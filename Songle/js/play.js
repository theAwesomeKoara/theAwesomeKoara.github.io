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
    api: "songle-widget-api-example",
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
    console.log("dfsa");

    generateNotes();

    //ループ
    /*setInterval(function(){
      if(songleWidget.position!=null)position=songleWidget.position;
      stepNotesAndTiles();
    },1);*/
  }
});

//---------------------------------------------------------

//view部分

let canvas;

function setup() {
  canvas=createCanvas(windowWidth/2,windowHeight/2);
  canvas.parent("field");
}

function draw() {
  background(0);
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text("score:"+score,width/2,height/3);
  text(combo+" combo",width/2,height*2/3);
}

function mousePressed(){
  songleWidget.play();
}
