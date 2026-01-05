// ==UserScript==
// @name         VK: Friends w/o History
// @description  Adds "Without History" filter to Friends page. Handy, if you have lots of friends and you want to *spam* only those, who don't have chat history with you yet.
// @version      0.4
// @date         2015-02-24
// @author       vipaware
// @namespace    https://greasyfork.org/en/users/9103-vipaware
// @match        *vk.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://greasyfork.org/scripts/386-waituntilexists/code/waitUntilExists.js?version=5026
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/8233/VK%3A%20Friends%20wo%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/8233/VK%3A%20Friends%20wo%20History.meta.js
// ==/UserScript==

(function($){
  "use strict";
  
  var monitorID = 0,
      divsProcessed = 0;
  
  function Reset() {
    clearInterval(monitorID);
    divsProcessed = 0;
  }
  
  function ToggleMonitor() {
    var cn = "cur_section",
        el = $(this);
    if (el.hasClass(cn))
      Reset();
    else {
      RemoveFriends();
      monitorID = setInterval(RemoveFriends, 1000);
    }
    el.toggleClass(cn);
  }
    
  function ProcessDiv(div) {
    var ubs = $(".user_block", div);
    ubs.each(function(index, el){
      if ($(this).css("display") == "none")
        return 1;
      var id = $(this).attr("id").replace("user_block", "");
      $.get("/im", {sel: id}, function(data) {
        if ($("#im_log" + id + " tr", data).length)
          $(el).hide("fast");
      });
    });
  }

  function RemoveFriends() {
    var divs = $("#list_content > div");
    var i = divsProcessed;
    divsProcessed = divs.length;
    for (; i < divs.length; i++) {
      setTimeout(ProcessDiv, 0, divs[i]);
    }
  }
  
  $('#sections_block .friends_fltr').waitUntilExists(function() {
    $(this).append('<a id="friends_remove_with_history" class="side_filter">Без истории</a>');
    $("#friends_remove_with_history").click(ToggleMonitor);
    Reset();
  });
    
}(jQuery));
