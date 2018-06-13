window.onload=function(){
  displayResult("",document.querySelector(".option_all"));
}

function displayResult(hostname){
  let requestURL="http://songle.jp/songs/search.rss?q="+getParams()['q'];
  if(hostname!=="")requestURL+="&hostname="+hostname;

  requestAjaxXML(requestURL,function(xml){
    let display=document.querySelector("#search_display");

    if(xml.querySelectorAll("item").length===0){
      display.innerHTML="該当結果なし";
    }else{
      display.innerHTML="";
      for (item of xml.querySelectorAll("item")) {
        let songContent=document.createElement("songContent");
        songContent.setAttribute("link","play.html?url="+decodeURIComponent(item.querySelector("link").textContent.substring("http://songle.jp/songs/".length)));
        songContent.setAttribute("title",item.querySelector("title").textContent);
        songContent.setAttribute("pubdate",item.querySelector("pubDate").textContent);
        songContent.setAttribute("author",item.querySelector("author").textContent);
        let contentHostname="";
        if(item.querySelector("link").textContent.indexOf("piapro.jp")!==-1)contentHostname="piapro.jp";
        if(item.querySelector("link").textContent.indexOf("soundcloud.com")!==-1)contentHostname="soundcloud.com";
        if(item.querySelector("link").textContent.indexOf("www.nicovideo.jp")!==-1)contentHostname="www.nicovideo.jp";
        if(item.querySelector("link").textContent.indexOf("www.youtube.com")!==-1)contentHostname="www.youtube.com";
        songContent.setAttribute("hostname",contentHostname);

        display.appendChild(songContent);
      }
      riot.mount('*');
    }
  });

  let option=document.querySelector(".option_all");
  if(hostname=="piapro.jp") option=document.querySelector(".option_piapro");
  if(hostname=="soundcloud.com") option=document.querySelector(".option_soundcloud");
  if(hostname=="www.nicovideo.jp") option=document.querySelector(".option_nicovideo");
  if(hostname=="www.youtube.com") option=document.querySelector(".option_youtube");
  for (otherOption of document.querySelectorAll(".option")) {
    otherOption.classList.remove("option_active");
  }
  option.classList.add("option_active");
}
