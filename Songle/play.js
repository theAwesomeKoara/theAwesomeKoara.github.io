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
    url: "www.youtube.com/watch?v=5ptnDFsmSGk"
  });

  document.getElementById("widget").appendChild(songleWidgetElement);
}

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
