let getParams = function(){
  let lets = {};
  let param = location.search.substring(1).split('&');
  for(let i = 0; i < param.length; i++) {
    let keySearch = param[i].search(/=/);
    let key = '';
    if(keySearch != -1) key = param[i].slice(0, keySearch);
    let val = param[i].slice(param[i].indexOf('=', 0) + 1);
    if(key != '') lets[key] = decodeURI(val);
  }
  return lets;
}

//--

function requestAjaxXML(endpoint,callback){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (this.readyState==4 && this.status==200) {
      callback(this.responseXML.documentElement);
    }
  };
  xhr.responseType="document";
  xhr.open('GET',endpoint);
  xhr.send();
};

function requestAjaxJson(endpoint,callback){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (this.readyState==4 && this.status==200) {
      callback(this.response);
    }
  };
  xhr.responseType="json";
  xhr.open('GET',endpoint);
  xhr.send();
}

//--

function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}
