// ==UserScript==
// @name UG tab download
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  download plain text tab from ultimate-guitar.com
// @author       mihau
// @include https://tabs.ultimate-guitar.com/tab/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556199/UG%20tab%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/556199/UG%20tab%20download.meta.js
// ==/UserScript==

// from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitforit(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    var observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

waitforit('#pdfControl').then((elm) => {
  
  var tab = window.UGAPP.store.page["data"]["tab_view"]["wiki_tab"]["content"].replace(/\[ch\]/gi, "").replace(/\[\/ch\]/gi, "");
 
  var hiddenElement = document.createElement('a');
  var format = encodeURIComponent(tab.replace(/\[tab\]/g, "").replace(/\[.tab\]/g, ""));
  hiddenElement.href = 'data:attachment/text,' + format;
  hiddenElement.download = location.href.replace(/.*tab\//,"").replace(/\-/g,"_").replace(/\//g,"-").replace(/_tabs/g,"\.tab").replace(/tab_.*/,"tab");

  document.querySelectorAll(".M71za.zQu4a.IlvQM.kvB02.yjpiY")[0].innerHTML = '<button type="button" tabindex="0" id="tabdl" class="H2hsN vDzLP jcUeD Kb0iM"><svg aria-hidden="true" viewBox="0 0 20 20" class="qkTwy"><g><path d="M4 16h12v-3h2v5H2v-5h2z"></path><path d="M11 8h3l-4 6-4-6h3V3h2z"></path></g></svg><span class="Q_TBK RIR92 cH1R2 cTzGe VLnCY p62dr">Save .tab</span></button>';

  document.getElementById("tabdl").onclick = function() {
    hiddenElement.click();
  }

});
