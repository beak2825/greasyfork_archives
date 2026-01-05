// ==UserScript==
// @name        YouTube - click to play
// @namespace   monnef.tk
// @include     https://www.youtube.com/*
// @version     2
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @run-at document-start
// @description Provides click-to-play functionality for YouTube (disables auto-play).
// @downloadURL https://update.greasyfork.org/scripts/8123/YouTube%20-%20click%20to%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/8123/YouTube%20-%20click%20to%20play.meta.js
// ==/UserScript==

/*

   Few Notes
  -----------
This script *may* work with other html5 players, you have to test it on your own.
Mutation observer is not used, b/c GreaseMonkey thrashes all events for it...

*/

var debug = false;

function log(msg){
  if(debug) console.log(msg);
}

log("installing video hook");

HTMLMediaElement.prototype._oldPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function() {
  var unlocked = this._playUnlocked !== undefined;
  log("intercepted play request, " + unlocked);
  if (unlocked) this._oldPlay();
};

this.$ = this.jQuery = jQuery.noConflict(true);

function insertUnlockers(sc) {
  log("inserting unlocker");
  var ve = $("video", sc);
  log("got " + ve.length + " video element(s).");
  ve.each(function() {
    var elem = this;
    $(this).attr("data-uv-processed", "true");
    var unlockerLink = $("<a href='#'>Unlock video and play!</a>").click(function() {
      log("unlocking and playing");
      elem._playUnlocked = true;
      elem.play();
      $(this).parent().hide();
      return false;
    }).css("font-size", "15pt");
    $(this).before(unlockerLink);
    unlockerLink.wrap("<div></div>");
    unlockerLink.parent().css("height", "50px").css("width","220px").css("background-color", "rgba(255, 255, 255, 0.8)").css("color", "black").css("position", "relative").css("z-index", "950").css("margin", "20px").css("padding", "10px").css("border", "1px solid #aaa").append("<p style='margin-top:10px'>Created by <a href='http://monnef.tk'>monnef</a>.</p>");
  });
}

var inserting = false;

function installDomEventListener() {
  document.addEventListener("DOMNodeInserted", function(e) {
    if(inserting){
      log("Preventing recursion.");
      return;
    }
    inserting = true;
    var nodeRaw = e.target;
    var node = $(nodeRaw);
    if (nodeRaw.nodeName.toLowerCase() == "video" || $("video", node).length > 0) {
      log("found");
      var parentNode = $(node.parent());
      if (!node.attr("data-uv-processed") && !parentNode.attr("data-uv-processed")) {
        insertUnlockers(parentNode);
      }
    }
    inserting = false;
  }, false);
}

installDomEventListener();
