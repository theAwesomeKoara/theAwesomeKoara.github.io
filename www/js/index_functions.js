function displayResult(){
  //#search_optionsのリンクのGET入力からrequestURLを生成
  let requestURL="http://songle.jp/songs/search.rss";
  let names=["hostname","q"];
  let count=0;
  names.forEach(function(name){
    if(getParams()[name]){
      if(count===0){
        requestURL+="?";
      }else{
        requestURL+="&";
      }
      requestURL+=name+"="+getParams()[name];
      count++;
    }
  });

  //リクエストして結果表示
  requestAjaxXML(requestURL,function(xml){
    let display=document.querySelector("#search_display");
    if(!getParams()['q']){
      display.innerHTML="クエリを入力してください";
    }else if(xml.querySelectorAll("item").length===0){
      display.innerHTML="該当結果なし";
    }else{
      display.innerHTML="";
      xml.querySelectorAll("item").forEach(function(item){

        let displayContent=document.createElement("displayContent");
        displayContent.setAttribute("link","play.html?url="+decodeURIComponent(item.querySelector("link").textContent.substring("http://songle.jp/songs/".length)));
        displayContent.setAttribute("title",item.querySelector("title").textContent);
        displayContent.setAttribute("pubdate",item.querySelector("pubDate").textContent);
        displayContent.setAttribute("author",item.querySelector("author").textContent);

        display.appendChild(displayContent);
      });
    }
    riot.mount('*');
  });
}
