function checkStatus(expectStatus, status) {
  for (var i = 0; i < expectStatus.length; i++) {
    if (expectStatus[i] == status) return true;
  }
  return false;
}
function probeUrlAsync(probeUrl)
{
  var xmlHttp = new XMLHttpRequest();
  var elem = document.getElementById(probeUrl.id);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState < 4) {
      var progress = "loading";
      for (var i=0; i < xmlHttp.readyState; i++) {
        progress += ".";
      }
      elem.innerHTML = progress;
      elem.className = "loading"
    } else {
      elem.innerHTML = "status:" + xmlHttp.status+ " ("+escape(xmlHttp.statusText).replaceAll('%20', " ")+")";
      if (checkStatus(probeUrl.expectStatus, xmlHttp.status)) {
        elem.className = "ok";
      } else {
        elem.className = "failed";
      }
    }
  }
  xmlHttp.ontimeout = function() {
    elem.innerHTML = "timeout";
    elem.className = "failed";
  }
  /*  xmlHttp.onerror = function() {
    elem.innerHTML = "error "+xmlHttp.status;
    elem.className = "failed";
    }*/
  xmlHttp.open("HEAD", probeUrl.url, true);
  xmlHttp.timeout = probeUrl.timeout;
  xmlHttp.send(null);
}

var probeUrls = [
                 {"note":"static http request test 1", "url":"/index.html", "expectStatus":[200], "timeout":10000},
                 {"note":"static http request test 1", "url":"/missing", "expectStatus":[404], "timeout":10000},
                 {"note":"static http request test 2", "url":"https://mk.se/", "expectStatus":[0,200], "timeout":10000},
                 {"note":"static http request test 2", "url":"https://mk.se/missing", "expectStatus":[0,200], "timeout":10000},
                 {"note":"E-identitet IDP", "url":"https://login.grandid.com/", "expectStatus":[0,401], "timeout":10000},
                 ];

var iframeUrls = [
                  {"note":"simple iframe test (expected to be black with dark gray text)", "url":"https://mk.se/", "width":"100%", "height":"50"},
                  {"note":"E-identitet IDP (expected to say \"Unauthorized\")", "url":"https://login.grandid.com/", "width":"100%", "height":"50"},
                  ];

var listHtml = "<dl>";
listHtml += '<dt> Browser agent</dt><dd>'+navigator.userAgent+'</dd>';
for (var i=0; i < probeUrls.length; i++) {
  var probeUrl = probeUrls[i];
  probeUrl.id="probe_"+i;
  listHtml += "<dt>" + probeUrl.note + " [" + probeUrl.url + ']</dt><dd id="'+ probeUrl.id + '">checking...</dd>';
}
for (var i=0; i < iframeUrls.length; i++) {
  var iframeUrl = iframeUrls[i];
  iframeUrl.id="iframe_"+i;
  listHtml += '<dt>' + iframeUrl.note + ' [' + iframeUrl.url + ']</dt><dd id="'+ iframeUrl.id + '" class="wrap"><iframe class="frame" src="'+iframeUrl.url+'" title="'+iframeUrl.note+'" width="'+iframeUrl.width+'" height="'+iframeUrl.height+'" scrolling="no"></iframe></dd>';
}
listHtml += "</dl>"
var contentElem = document.getElementById("content");
contentElem.innerHTML = listHtml;
for (var i=0; i < probeUrls.length; i++) {
  probeUrlAsync(probeUrls[i]);
}
