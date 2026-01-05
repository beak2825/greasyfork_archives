// ==UserScript==
// @name          Tumblr notes autoload
// @include       http://*tumblr.com/post/*
// @description   Adds a button to autoload all notes on Tumblr full page posts
// @version       1.2.1
// @author        wOxxOm
// @contributor   JesseW
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/8157/Tumblr%20notes%20autoload.user.js
// @updateURL https://update.greasyfork.org/scripts/8157/Tumblr%20notes%20autoload.meta.js
// ==/UserScript==

var maxLoadOnStart = 100; // load no more than 100 notes when the page is displayed

window.addEventListener('DOMContentLoaded', function(){
  var btn;
  var btnLabel = {load:'Load all notes', stop:'Stop loading notes', done:'All notes are loaded'};
  var totalNotes;

  function clickMore() {
    var loadedNotes = document.querySelectorAll('ol.notes > .note').length;
    if (btn.autoSignal && loadedNotes >= maxLoadOnStart) {
      delete btn.autoSignal;
      btn.stopSignal = true;
    }
    var more = document.querySelector('.more_notes_link');
    if (more) {
      var notesToLoad = totalNotes ? ' (' + Math.max(1, totalNotes - loadedNotes) + ' more)' : '';
      if (btn.stopSignal) {
        delete btn.stopSignal;
        btn.textContent = btnLabel.load + notesToLoad;
        return;
      }
      btn.textContent = btnLabel.stop + notesToLoad;
      more.click();
      var ob = new MutationObserver(function(mutations){
        ob.disconnect();
        setTimeout(function(){ clickMore() }, 200);
      });
      ob.observe(more.parentNode.parentNode, {subtree:true, childList:true});
    }
    else {
      btn.textContent = btnLabel.done;
      btn.disabled = true;
    }
  }
  
  document.querySelector('ol.notes').insertAdjacentHTML('beforebegin', 
       '<button id="loadallBtn" style="margin-bottom:1em">' + btnLabel.load + '</button>');
  btn = document.getElementById('loadallBtn');
  btn.addEventListener('click', function(){
    if (!btn.textContent.match(btnLabel.stop)) {
      btn.textContent = btnLabel.stop;
      clickMore();
    } else {
      btn.stopSignal = true;
    }
  });
  
  Array.prototype.some.call(document.querySelectorAll('.info, a[href*="/post/"], .permainfo'), function(n){
    var m = n.textContent.match(/([\d,]+) notes/);
    if (m) {
      totalNotes = parseInt(m[1].replace(',',''));
      return true;
    }
  });

  btn.autoSignal = true;
  btn.click();
});
