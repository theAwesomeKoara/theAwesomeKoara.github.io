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

window.onSongleWidgetReady=function(_api,_songleWidget){
  songleWidget=_songleWidget;
  console.log("dfsa");
}
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
