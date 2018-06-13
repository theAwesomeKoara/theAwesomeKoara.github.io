//アプリ起動時のみstartMotoConnectionを呼ぶ
document.addEventListener("deviceready",function(){
  if(window.sessionStorage.getItem("connected")==null){
    cordova.plugins.moto.startMotoConnection(false,false);
    window.sessionStorage.setItem("connected","true");
  }
});

function check(){
  let q=document.querySelector("#search_form").q.value;
  if(q=="") return false;
}
