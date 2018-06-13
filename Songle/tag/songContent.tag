<songContent>
  <style>
  div{
    border-bottom: solid 1px #aaaaaa;
  }
  </style>

  <div>
    <p><a href="{ link }" onclick="{ addToLog }">{ title }</a> / { author }</p>
    <p>{ hostname } / { pubdate }</p>
  </div>

  <script>
  this.link=opts.link;
  this.title=opts.title;
  if(this.title.length>25)this.title=this.title.substring(0,25)+"...";
  this.pubdate=opts.pubdate;
  this.author=opts.author;
  this.hostname=opts.hostname;
  this.addToLog=function(){
    let log;
    if(window.localStorage.getItem("log")!=null)log=JSON.parse(window.localStorage.getItem("log"));
    else log=[];

    let logData={
      link:opts.link,
      title:opts.title,
      pubdate:opts.pubdate,
      author:opts.author,
      hostname:opts.hostname
    };
    log.unshift(logData);
    while(log.length>50)log.pop();

    window.localStorage.setItem("log",JSON.stringify(log));
  }
  </script>
</songContent>
