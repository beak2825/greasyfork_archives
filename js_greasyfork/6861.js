// ==UserScript==
// @name        GreasyFork script icon
// @namespace   wOxxOm.scripts
// @description On a script info page it shows its icon from the script meta block
// @icon        https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/64/information-icon.png
// @version     1.1.8
// @author      wOxxOm
// @match       https://greasyfork.org/*scripts/*
// @include     /^https://(sleazy)fork.org/.*?scripts/.*?/
// @exclude     /^https://(greasy|sleazy)fork\.org/([^/]+/)?scripts/(\D|$)/
// @run-at      document-start
// @connect-src *
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/6861/GreasyFork%20script%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/6861/GreasyFork%20script%20icon.meta.js
// ==/UserScript==

var scriptID = location.href.match(/scripts\/(\d+)/)[1];
var iconsrc = (GM_getValue(scriptID) || '').split('\n');
var iconDate = iconsrc[1];
iconsrc = iconsrc[0];

if (iconsrc.match(/^data:image|^https:/))
  addIcon();

if (true)  {
  GM_xmlhttpRequest({
    method: 'GET',
    url: location.href.replace(/^(https:..)([^/]+).*?(\/scripts\/\d+).*/,'$1update.$2$3/_.user.js'),
    headers: iconDate && {'If-Modified-Since': iconDate},
    timeout: 10000,
    onload: function (r) {
      var url = (r.responseText.match(/\n\s*\/\/\s+@icon(?:url)?\s+((?:https?:\/\/|data:image\/).+)|$/i)[1] || '').trim();
      var date = url && (r.responseHeaders.match(/(\n|^)Last-Modified:\s*(.+)/i) || [])[2];
      if (!url || date && iconDate === date)
        return;
      if (!/^http:/.test(url))
        return addIcon(url, date);
      // download http icon and store it in script db if it's small
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: 10000,
        headers: {'Accept':'image/png,image/*;q=0.8,*/*;q=0.5'},
        responseType: 'arraybuffer',
        onload: function(ri) {
          var /**@type ArrayBuffer*/rb = ri.response, rbl = rb.byteLength;
          if (rbl > 100000) {
            console.log('Script icon exceeds 100k, ignoring');
            return;
          }
          var mime = ri.responseHeaders.match(/(^|\n\s*)Content-Type:\s*(image\/[^;,\s]+)|$/i)[2];
          var rbs = [];
          for (var i = 0, step = 8192; i < rbl; i += step)
            rbs.push(String.fromCharCode.apply(null, new Uint8Array(rb, i, Math.min(step, rbl - i))));
          addIcon('data:image/' + (mime || 'png') + ';base64,' + btoa(rbs.join('')), date);
        }
      });
    }
  });
}

function addIcon(url, date) {
  if (url) {
    if (url === iconsrc && date === iconDate)
      return;
    iconsrc = url;
    iconDate = date || '';
  }
  GM_setValue(scriptID, iconsrc + '\n' + iconDate);

  var h2 = document.querySelector('#script-info header h2');
  h2 ? __add(h2) : __wait();

  function __add(h2) {
    if (!h2)
      if (!(h2 = document.querySelector('#script-info header h2')))
        return;

    h2.insertAdjacentHTML('afterbegin','<div style="\
        position: absolute;\
        width: 80px;\
        margin-left: calc(-80px - 1ex);\
        display: inline-block;\
        text-align: right"></div>');
    var img = h2.firstChild.appendChild(document.createElement('img'));
    img.style.maxWidth = img.style.maxHeight = '64px';
    img.style.width = img.style.height = 'auto';
    img.src = iconsrc;
  }

  function __wait() {
    var ob = new MutationObserver(function(mutations){
      for (var i=0, ml=mutations.length, m; (i<ml) && (m=mutations[i]); i++) {
        if (m.target.localName == 'h2') {
          __add();
          ob.disconnect();
          return;
        }
      }
    });
    ob.observe(document, {subtree:true, childList:true});
  }
}
