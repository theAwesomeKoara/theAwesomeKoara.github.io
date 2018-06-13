/*
ノーツを生成し、グローバルのnotesに代入。
この関数内でノーツを生成する際のルール：startが早い順にソートされていること。
*/
function generateNotes(){
  musicInformationRequestsCallback(function(musicInformationRequests){
    if(musicInformationRequests.chord.json.chords.length>0){
      generateMode_chord(musicInformationRequests);
    }else{
      generateMode_native(musicInformationRequests);
    }
  });

  //----------------------------------
  //↓fns

  function generateMode_chord(musicInformationRequests){
    let tile=null;
    const interval=200;

    for (chord of musicInformationRequests.chord.json.chords) {
      if(hasPlentyInterval(chord)){
        tile=getNextRandomTile(tile);
        insertNote(chord.start+interval,tile);
      }
    }

    function hasPlentyInterval(chord){
      if(chord.name!=="N"){
        if(notes.length>0){
          if((chord.start-interval)-notes[notes.length-1].start>2000){
            return true;
          }
        }else{
          return true;
        }
      }

      return false;
    }
  }

  //----------------------------------

  function generateMode_native(musicInformationRequests){
    let t=0;
    let tile=null;
    const delT=1000;

    while (t<songleWidget.duration.milliseconds) {
      if(existSound()){
        if(isChorus()){
          if(getMelodyChangedTime()!==null){
            tile=getNextRandomTile(tile);
            insertNote(getMelodyChangedTime(),tile);
          }
        }else{
          if(getNearBeatTime()!=null){
            tile=getNextRandomTile(tile);
            insertNote(getNearBeatTime(),tile);
          }
        }
      }
      t+=delT;
    }

    //--

    function existSound(){
      for (melodyNote of musicInformationRequests.melody.json.notes) {
        if(t>=melodyNote.start && t<melodyNote.start+melodyNote.duration){
          if(melodyNote.number!==0){
            return true;
          }else{
            return false;
          }
        }
      }
      return false;
    }

    function isChorus(){
      for (repeat of musicInformationRequests.chorus.json.chorusSegments[0].repeats) {
        if(t>=repeat.start && t<repeat.start+repeat.duration){
          return true;
        }
      }
      return false;
    }

    function getNearBeatTime(){
      for (beat of musicInformationRequests.beat.json.beats) {
        if(t>=beat.start-100 && t<beat.start+100){
          return beat.start;
        }
      }
      return null;
    }

    function getMelodyChangedTime(){
      let tNote=null,nextTNote=null;
      for (melodyNote of musicInformationRequests.melody.json.notes) {
        if(t>=melodyNote.start && t<melodyNote.start+melodyNote.duration){
          tNote=melodyNote;
        }
        if(t+delT>=melodyNote.start && t+delT<melodyNote.start+melodyNote.duration){
          nextTNote=melodyNote;
        }
      }
      if(tNote!==null && nextTNote!==null){
        if(tNote.number!==nextTNote.number){
          return nextTNote.start;
        }
      }

      return null;
    }
  }

  //----------------------------------

  function getNextRandomTile(pTile){
    if(tiles.length>1){
      let tile=pTile;
      while (tile===pTile) {
        tile=tiles[getRandomInt(0,tiles.length-1)];
      }
      return tile;
    }else if(tiles.length==1){
      return tiles[0];
    }

    return null;
  }

  function insertNote(time,tile){
    let note={
      start:time,
      targetTile:tile,
      state:"wait"
    };
    notes.push(note);
  }
}

/*
引数tileに対する判定を実施、処理すべきノーツがあれば処理。
*/
function doJudgeOf(tile){
  for (note of notes) {
    if(note.targetTile.id==tile.id && note==tile.topNote){
      if(note.state=="white"){
        combo++;
        score+=100;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.targetTile.id,false,false);
        //songleWidget.play();
      }else if(note.state=="red"){
        combo=0;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.targetTile.id,false,false);
        setTimeout(function(){
          songleWidget.play();
        },1000);
      }
    }
  }
}

/*
ノーツ、タイル情報の更新。
*/
function stepNotesAndTiles(){
  let statechangingNotes=[];

  //stateの更新（statechangingNoteがあれば抽出）
  for (note of notes) {
    let pstate=note.state;
    if(note.state=="wait" && position.milliseconds>=note.start-3000){
      note.state="blue";
    }else if(note.state=="blue" && position.milliseconds>=note.start-2000){
      note.state="indigo";
    }else if(note.state=="indigo" && position.milliseconds>=note.start-1000){
      note.state="violet";
    }else if(note.state=="violet" && position.milliseconds>=note.start-500){
      note.state="white";
    }else if(note.state=="white" && position.milliseconds>=note.start+500){
      note.state="red";
      songleWidget.pause();
    }

    if(note.state!=pstate){
      statechangingNotes.push(note);
    }
  }

  //tile.topNoteの更新
  for (tile of tiles) {
    tile.topNote=null;
  }
  for (note of notes) {
    if(note.targetTile.topNote==null && note.state!="wait" && note.state!="done"){
      note.targetTile.topNote=note;
    }
  }

  //statechangingNotesの中からtopNoteであるものに対して光らせるコマンドを実行する
  //これによって後続ノーツが続いて光ってプレイヤーを惑わせることがなくなる
  for (note of statechangingNotes) {
    if(note==note.targetTile.topNote){
      cordova.plugins.moto.setTileColor(note.state,note.targetTile.id,false,false);
    }
  }
}

/*
musicInformationRequestsという音楽情報を格納したものを受け取りコールバックできる。
musicInformationRequestsCallback(function(musicInformationRequests){
  //code
});
の形で利用できる。
*/
function musicInformationRequestsCallback(callback){
  let musicInformationRequests={
    beat: {url: "https://widget.songle.jp/api/v1/song/beat.json?url="+getParams()['url'],json: null},
    chord: {url: "https://widget.songle.jp/api/v1/song/chord.json?url="+getParams()['url'],json: null},
    melody: {url: "https://widget.songle.jp/api/v1/song/melody.json?url="+getParams()['url'],json: null},
    chorus: {url: "https://widget.songle.jp/api/v1/song/chorus.json?url="+getParams()['url'],json: null}
  };

  let requestsProcessCount=0;
  for (let name in musicInformationRequests) {
    requestAjaxJson(musicInformationRequests[name].url,function(json){
      musicInformationRequests[name].json=json;

      requestsProcessCount++;
      if(requestsProcessCount>=Object.keys(musicInformationRequests).length){
        callback(musicInformationRequests);
      }
    });
  }
}
