// ==UserScript==
// @name           laSexta.com and Antena3.com HTML5 player
// @name:es        Reproductor HTML5 en laSexta.com y Antena3.com
// @author         Swyter
// @homepage       https://swyterzone.appspot.com
// @namespace      userscripts.org/swyter
// @description    HTML5 player for laSexta.com, avoiding the Flash Player plugin.
// @description:es Reproductor HTML5 para laSexta.com, evitando el uso del plugin Flash Player.
// @match          http://www.lasexta.com/*
// @match          http://www.antena3.com/*
// @version        1.3
// @grant          none
// @icon           https://i.imgur.com/rvx1xwK.png
// @downloadURL https://update.greasyfork.org/scripts/9539/laSextacom%20and%20Antena3com%20HTML5%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/9539/laSextacom%20and%20Antena3com%20HTML5%20player.meta.js
// ==/UserScript==

if ((videoDataUrl = document.querySelector("*[name=videoDataUrl], input[value*='videosnuevosxml']").value))
{
  xhr = new XMLHttpRequest();

  xhr.open("GET", videoDataUrl);

  xhr.onreadystatechange = function()
  {
    if (this.readyState != xhr.DONE) return;

    /* build our own html5 player with our own stuff */
    vplayer = document.createElement("video");

    vplayer.src    = this.responseXML.getElementsByTagName("videoSource")[0].textContent;
    vplayer.poster = this.responseXML.getElementsByTagName("background")[0].textContent;

    vplayer.controls = "true";
    vplayer.volume = "0.4";

    vplayer.style = 'width: 644px; height: 362px;';

    /* replace it on the page */
    videoHolderElement = document.querySelector("*[itemprop='Video'], .visor_reemplace");
    videoHolderElement.parentElement.replaceChild(vplayer, videoHolderElement);
  }

  xhr.send();
}