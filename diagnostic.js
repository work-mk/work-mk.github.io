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
      elem.innerHTML = "status:" + xmlHttp.status+ " ("+escape(xmlHttp.statusText)+")";
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
  xmlHttp.open("HEAD", probeUrl.url, true);
  xmlHttp.timeout = probeUrl.timeout;
  xmlHttp.send(null);
}

var probeUrls = [
                 {"id":"naive_test_1", "note":"static http request test 1", "url":"http://mk.se/", "expectStatus":[200], "timeout":30000},
                 {"id":"e_identity", "note":"E-identitet IDP", "url":"https://login.grandid.com/", "expectStatus":[401], "timeout":30000},
]

var listHtml = "<dl>"
for (var i=0; i < probeUrls.length; i++) {
  var probeUrl = probeUrls[i];
  listHtml += "<dt>" + probeUrl.note + " [" + probeUrl.url + ']</dt><dd id="'+ probeUrl.id + '">checking...</dd>';
}
listHtml += "</dl>"
var contentElem = document.getElementById("content");
contentElem.innerHTML = listHtml;
for (var i=0; i < probeUrls.length; i++) {
  probeUrlAsync(probeUrls[i]);
}
