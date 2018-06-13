window.onload=function(){
  let log=JSON.parse(window.localStorage.getItem("log"));
  let display=document.querySelector("#log_display");
  if(log!=null){
    for (logData of log) {
      let songContent=document.createElement("songContent");
        songContent.setAttribute("link",logData.link);
        songContent.setAttribute("title",logData.title);
        songContent.setAttribute("pubdate",logData.pubdate);
        songContent.setAttribute("author",logData.author);
        songContent.setAttribute("hostname",logData.hostname);

        display.appendChild(songContent);
    }

    riot.mount('*');
  }
}
