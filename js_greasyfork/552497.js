// ==UserScript==
// @name         arte stop nagging me
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  no more arte nagscreen! and always open descriptions (no more "click here to read more...")
// @author       mihau
// @match        https://www.arte.tv/de/videos/*
// @match        https://www.arte.tv/fr/videos/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552497/arte%20stop%20nagging%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/552497/arte%20stop%20nagging%20me.meta.js
// ==/UserScript==

$qa = function(_) {return document.querySelectorAll(_)}

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

waitforit('button.ds-1syte4c').then((elm) => {
      if ($qa("button.ds-1syte4c")[0]) {
        $qa("button.ds-1syte4c")[0].click();
        window.onscroll = function () { window.scrollTo(0, 0); };
        setTimeout(function() { window.onscroll = function () {} }, 1000);
        if ($qa(".ds-78gfl4")[0]) {
          $qa(".ds-78gfl4")[0].style.display="none";
          $qa(".ds-78gfl4")[0].style.visibility="hidden";
        }
       }
});

waitforit('.avp-morality__content').then((elm) => {
      if ($qa(".avp-morality__content")[0]) {
        if ((!(/Einloggen/.test($qa(".ds-1bm7j6v")[0].innerText))) && (!(/Se connecter/.test($qa(".ds-1bm7j6v")[0].innerText)))) {
          $qa(".avp-morality__content")[0].querySelectorAll('[aria-describedby=""]')[0].click();
        }
      }
});