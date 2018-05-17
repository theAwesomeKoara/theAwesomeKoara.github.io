window.onload=function(){
  //#search_optionsのリンクを動的に設定
  if(getParams()['q']){
    document.querySelector("#search_options .option_all").href="index.html?q="+getParams()['q'];
    document.querySelector("#search_options .option_piapro").href="index.html?hostname=piapro.jp&q="+getParams()['q'];
    document.querySelector("#search_options .option_soundcloud").href="index.html?hostname=soundcloud.com&q="+getParams()['q'];
    document.querySelector("#search_options .option_nicodiveo").href="index.html?hostname=www.nicovideo.jp&q="+getParams()['q'];
    document.querySelector("#search_options .option_youtube").href="index.html?hostname=www.youtube.com&q="+getParams()['q'];
  }else{
    document.querySelector("#search_options .option_all").href="index.html";
    document.querySelector("#search_options .option_piapro").href="index.html?hostname=piapro.jp";
    document.querySelector("#search_options .option_soundcloud").href="index.html?hostname=soundcloud.com";
    document.querySelector("#search_options .option_nicodiveo").href="index.html?hostname=www.nicovideo.jp";
    document.querySelector("#search_options .option_youtube").href="index.html?hostname=www.youtube.com";
  }

  //検索結果を取得して表示
  displayResult();
}

//アプリ起動時のみstartMotoConnectionを呼ぶ
document.addEventListener("deviceready",function(){
  if(window.sessionStorage.getItem("connected")==null){
    cordova.plugins.moto.startMotoConnection(false,false);
    window.sessionStorage.setItem("connected","true");
  }
});
