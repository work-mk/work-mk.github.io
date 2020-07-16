var EnvCheck = function(contentElem) {
  var contentElem = contentElem;
  var startFunctions = [];

  this.addField= function(title, value) {
    var elem = document.createElement('div');
    elem.innerHTML = '<b>'+title + ':</b> '+ value;
    contentElem.appendChild(elem);
  };

  this.addModule = function(title, module) {
    var moduleElem = document.createElement('div');
    moduleElem.innerHTML = '<b>'+title + ':</b> ';
    var outputElem = document.createElement('span');
    moduleElem.appendChild(outputElem);
    contentElem.appendChild(moduleElem);
    var m = new module(outputElem);
    if (m.start) {
      moduleElem.className = 'loading';
      var onresult = function(successful) {
        moduleElem.className = (successful? "ok": "failed");
      };
      startFunctions.unshift(function () {
          m.start(onresult);
        });
    }
  };
  this.addIframe = function(url, className, message) {
    var container = document.createElement('div');
    container.innerHTML = message + '['+url+']<div class="wrap"><iframe class="' + className + '" src="' + url + '" scrolling="no"></iframe></div>'
    contentElem.appendChild(container);
  };
  this.start = function() {
    for (var i = 0; i < startFunctions.length; i++) {
      startFunctions[i]();
    }
  }
  return this;
};

//adapted from https://www.websocket.org/echo.html
var WebsocketsTest = function(outputElem) {
  var outputElem = outputElem;
  var message = 'testmessage 123';
  var websocket = null;
  var writeToScreen = function(message) {
    var pre = document.createElement('span');
    pre.style.wordWrap = 'break-word';
    pre.innerText = message + '; ';
    outputElem.appendChild(pre);
  }
  var doSend = function(message) {
    writeToScreen('sent: "' + message + '"');
    websocket.send(message);
  };
  this.start = function (onresult) {
    var timeout = window.setTimeout(function() { onresult(false); }, 10000);
    outputElem.innerHTML='';
    writeToScreen('started');
    websocket = new WebSocket('wss://echo.websocket.org/'); // publically available echo server
    websocket.onopen = function(evt) {
      writeToScreen('connected');
      doSend(message);
    };
    websocket.onclose = function(evt) {
      writeToScreen('disconnected');
    };
    websocket.onmessage = function(evt) {
      writeToScreen('response: "' + evt.data + '"');
      websocket.close();
      window.clearTimeout(timeout);
      onresult(evt.data == message);
    };
    websocket.onerror = function(evt) {
      writeToScreen('error: "' + evt.data + '"');
      window.clearTimeout(timeout);
      onresult(false);
    };
  };
  return this;
};

var CookieTest = function(outputElem) {
  this.start = function(onresult) {
    document.cookie = "testcookie";
    if (document.cookie.indexOf("testcookie") != -1) {
      outputElem.innerText = "OK";
      onresult(true);
    } else {
      outputElem.innerText = "failed";
    }
  }
}