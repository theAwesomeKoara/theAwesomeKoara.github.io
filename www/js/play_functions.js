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
    let tileId=-1;
    const interval=200;

    for (chord of musicInformationRequests.chord.json.chords) {
      if(hasPlentyInterval(chord)){
        tileId=getNextRandomTileId(tileId);
        insertNote(chord.start+interval,tileId);
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
    let tileId=-1;
    const delT=1000;

    while (t<songleWidget.duration.milliseconds) {
      if(existSound()){
        if(isChorus()){
          if(getMelodyChangedTime()!==null){
            tileId=getNextRandomTileId(tileId);
            insertNote(getMelodyChangedTime(),tileId);
          }
        }else{
          if(getNearBeatTime()!=null){
            tileId=getNextRandomTileId(tileId);
            insertNote(getNearBeatTime(),tileId);
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

  function getNextRandomTileId(pTileId){
    if(useTiles.length>1){
      let tileId=pTileId;
      while (tileId===pTileId) {
        tileId=useTiles[getRandomInt(0,useTiles.length-1)].id;
      }
      return tileId;
    }else if(useTiles.length==1){
      return useTiles[0].id;
    }

    return -1;
  }

  function insertNote(time,tileId){
    let note={
      start:time,
      tileId:tileId,
      state:"wait"
    };
    notes.push(note);
  }
}

function doJudgeOf(tileId){
  for (note of notes) {
    if(note.tileId==tileId){
      if(note.state=="white"){
        combo++;
        score+=100;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.tileId,false,false);
        songleWidget.play();
      }else if(note.state=="red"){
        combo=0;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.tileId,false,false);
        setTimeout(function(){
          songleWidget.play();
        },1000);
      }
    }
  }
}

function stepNotes(){
  for (let i=notes.length-1; i>=0; i--) {
    let note=notes[i];

    if(note.tileId){
      if(note.state=="wait" && position.milliseconds>=note.start-3000){
        note.state="blue";
        cordova.plugins.moto.setTileColor("blue",note.tileId,false,false);
      }else if(note.state=="blue" && position.milliseconds>=note.start-2000){
        note.state="indigo";
        cordova.plugins.moto.setTileColor("indigo",note.tileId,false,false);
      }else if(note.state=="indigo" && position.milliseconds>=note.start-1000){
        note.state="violet";
        cordova.plugins.moto.setTileColor("violet",note.tileId,false,false);
      }else if(note.state=="violet" && position.milliseconds>=note.start-500){
        note.state="white";
        cordova.plugins.moto.setTileColor("white",note.tileId,false,false);
      }else if(note.state=="white" && position.milliseconds>=note.start+500){
        note.state="red";
        cordova.plugins.moto.setTileColor("red",note.tileId,false,false);
        songleWidget.pause();
      }
    }
  }
}

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
