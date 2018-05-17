let useTileIds=[];

document.addEventListener("deviceready",function(){
  cordova.plugins.moto.setAllTilesColor("red",false,false);

  //#config_beforeに設定前のconfigを表示
  let beforeUseTileIds=JSON.parse(window.localStorage.getItem("useTileIds"));
  let config_before=document.querySelector("#config_before");
  if(beforeUseTileIds!=null){
    for (let i = 0; i < beforeUseTileIds.length; i++) {
      config_before.textContent+=beforeUseTileIds[i];
      if(i<beforeUseTileIds.length-1){
        config_before.textContent+=",";
      }
    }
  }else{
    config_before.textContent="設定されていません";
  }

  //使うタイルを踏んで設定し、#config_afterに表示
  cordova.plugins.moto.setAntPressEvent(function(tileId){
    if(useTileIds.indexOf(tileId)==-1){
      useTileIds.push(tileId);
      cordova.plugins.moto.setTileColor("blue",tileId,false,false);

      let config_after=document.querySelector("#config_after");
      config_after.textContent="";
      for (let i = 0; i < useTileIds.length; i++) {
        config_after.textContent+=useTileIds[i];
        if(i<useTileIds.length-1){
          config_after.textContent+=",";
        }
      }
    }
  },false);
});

//--

//#config_saveから呼ばれる
function saveConfig(){
  window.localStorage.setItem("useTileIds",JSON.stringify(useTileIds));
  alert("configを保存しました");
}
