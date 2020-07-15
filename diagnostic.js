function checkStatus(expectStatus, status) {
  for (var i = 0; i < expectStatus.length; i++) {
    if (expectStatus[i] == status) {
      return true;
    }
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
      elem.innerHTML = "status:" + xmlHttp.status+ " ("+escape(xmlHttp.statusText).split('%20').join(" ")+")";
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
// urls to probe with a HEAD call. These may prove to be fairly limited because of CORS
var probeUrls = [
                 {"note":"static http request test 1", "url":"/index.html", "expectStatus":[200], "timeout":10000},
                 {"note":"static http request test 1", "url":"/missing", "expectStatus":[404], "timeout":10000},
                 ];
// urls to show in small iframes
var iframeUrls = [
                  {"note":"Doctrin.se (expected to show doctrin welcome page)", "url":"https://doctrin.se/", "small":true},
                  {"note":"e-caregiver / (expected to show {\"statusCode\": 404,...})", "url":"https://e-caregiver.se/", "small":false},
                  {"note":"E-identitet IDP (expected to say \"Unauthorized\")", "url":"https://login.grandid.com/", "small":true},
                  ];

var listHtml = "<dl>";
listHtml += '<dt> Browser agent</dt><dd>'+navigator.userAgent+'</dd>';
for (var i = 0; i < probeUrls.length; i++) {
  var probeUrl = probeUrls[i];
  probeUrl.id="probe_"+i;
  listHtml += "<dt>" + probeUrl.note + " [" + probeUrl.url + ']</dt><dd id="'+ probeUrl.id + '">checking...</dd>';
}

for (var i = 0; i < iframeUrls.length; i++) {
  var iframeUrl = iframeUrls[i];
  var iframeClass = "";
  if (iframeUrl.small) {
    iframeClass = "small"; // zoomed out to fit more of the page in view
  }
  listHtml += ('<dt>' + iframeUrl.note + ' [' + iframeUrl.url + ']</dt>'
               +'<dd class="wrap">'
               +'<iframe class="' + iframeClass + '" src="' + iframeUrl.url + '" scrolling="no"></iframe>'
               +'</dd>');
}

listHtml += "</dl>"

var contentElem = document.getElementById("content");
contentElem.innerHTML = listHtml;
for (var i = 0; i < probeUrls.length; i++) {
  probeUrlAsync(probeUrls[i]);
}
