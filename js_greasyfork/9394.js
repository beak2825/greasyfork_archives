// Copyright 2013 Marco Trevisan (Treviño) <mail@3v1n0.net>
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License version 3, as published
// by the Free Software Foundation.
//
// ==UserScript==
// @name        Repubblica TV HTML5
// @name:it     Repubblica TV HTML5
// @namespace   video.repubblica.it
// @description Use HTML5 video tags for Repubblica TV videos, removing ADS
// @description:it Usa il tag video HTML5 per riprodurre i filmati di Repubblica TV, eliminando la pubblicità
// @include     http*://video.repubblica.it/*
// @version     0.9.8
// @namespace   http://www.3v1n0.net
// @icon        http://www.repubblica.it/static/images/homepage/2010/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9394/Repubblica%20TV%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/9394/Repubblica%20TV%20HTML5.meta.js
// ==/UserScript==

// Load jquery if needed and once done, call the provided callback
function addJQuery(callback)
{
  if (this.$)
  {
    callback();
    return;
  }

  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "this.$=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

addJQuery(function() {
  var player_div = $("div.video-player");

  if (player_div)
  {
    var width = player_div.width();
    var height = player_div.height();
    var src = player_div.find("meta[itemprop=contentUrl]").attr("content");

    if (src && src.length > 0 && src.search("rtmp://") < 0)
    {
      player_div.replaceWith('<video width="'+width+'" height="'+height+'" controls><source src="'+src+'" type="video/mp4"></video>');
    }
  }
});
