// ==UserScript==
// @name        MegafilmesHD 2
// @namespace   Alpe
// @include     http://megafilmeshd.net/p/*
// @include     http://megafilmeshd.net/player/*
// @version     1.3
// @grant       none
// @run-at      document-end
// @description Link direto dos embeds no MegaFilmesHD
// @downloadURL https://update.greasyfork.org/scripts/8467/MegafilmesHD%202.user.js
// @updateURL https://update.greasyfork.org/scripts/8467/MegafilmesHD%202.meta.js
// ==/UserScript==

var code = ["drop2", "drop", "cz", "vdm", "amv", "vpw2", "vpw", "py"];
var prefix = ["http://dropvideo.com/embed/", "http://dropvideo.com/embed/", "http://www.cloudzilla.to/embed/", "http://vidto.me/embed-", "http://allmyvideos.net/embed-", "http://video.pw/e/", "http://video.pw/e/", "http://played.to/embed-"];
var pos = ["", "", "", "-468x360.html", ".html", "", "", "-468x365.html"]

console.log("");
element = document.getElementsByClassName("btn")

for (var i=0; i<element.length; i++){
  id = code.indexOf(element[i].href.split("/player/")[1].split(".php")[0])
  if (id != "-1"){
    prehref = [code[id], element[i].href]
    element[i].href = prefix[id] + element[i].href.split("?v=")[1] + pos[id]
    prehref.push(element[i].href); console.log(prehref);
  } else if (element[i].href.split("/player/")[1].split(".php?v=")[0] == "vmv2"){
    prehref = ["vmv2", element[i].href]
    element[i].href = "http://videoapi.my.mail.ru/videos/embed/mail/" + element[i].href.split("/player/")[1].split(".php?v=")[1].split("&u=")[1] + "/_myvideo/" + element[i].href.split("/player/")[1].split(".php?v=")[1].split("&u=")[0] + ".html"
    prehref.push(element[i].href); console.log(prehref);
  } else {
    console.log(element[i].href.split("/player/")[1].split(".php?v="))
  }
}