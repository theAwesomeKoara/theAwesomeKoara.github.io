//---------------------------------------------------------

//制御部分

let songleWidget=null;
let position=0;

let tiles=[];
/*
tile={
  id/int,
  topNote/note
}
*/

let notes=[];
/*
note={
  start/int,
  targetTile/tile,
  state/String
}
*/

let score=0;
let combo=0;

//songleWidget準備
window.onload=function(){
  let songleWidgetElement=SongleWidgetAPI.createSongleWidgetElement({
    api: "unchi",
    url: getParams()['url']
  });

  document.getElementById("widget").appendChild(songleWidgetElement);
}

//--

document.addEventListener("deviceready",function(){
  let useTileIds=JSON.parse(window.localStorage.getItem("useTileIds"));
  for (tileId of useTileIds) {
    let tile={
      id: tileId,
      topNote: null
    };
    tiles.push(tile);
  }

  cordova.plugins.moto.setAllTilesColor("off",false,false);
  cordova.plugins.moto.setAntPressEvent(function(tileId){
    //タイルを踏んだ際毎回判定を行う
    let tile=tiles.find(tile=>tile.id==tileId);
    if(tile!=undefined){
      doJudgeOf(tile);
    }
  },false);

  //--

  window.onSongleWidgetReady=function(_api,_songleWidget){
    songleWidget=_songleWidget;
    songleWidget.play();

    generateNotes();

    //ループ
    setInterval(function(){
      if(songleWidget.position!=null)position=songleWidget.position;
      stepNotesAndTiles();
    },1);
  }
});
