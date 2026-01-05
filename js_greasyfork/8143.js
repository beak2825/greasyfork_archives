// ==UserScript==
// @name        Megafilmeshd
// @namespace   Alpe
// @include     http://megafilmeshd.net/series/*.html
// @version     1.2
// @grant       none
// @run-at      document-end
// @description Link direto no MegaFilmesHD a partir de uma lista de prioridades
// @downloadURL https://update.greasyfork.org/scripts/8143/Megafilmeshd.user.js
// @updateURL https://update.greasyfork.org/scripts/8143/Megafilmeshd.meta.js
// ==/UserScript==

var list1 = [0, 4, 1, 2, 3];

var list2 = ["dp=", "cz=", "vdm=", "amv=", "pw="];
var list3 = ["http://dropvideo.com/embed/", "http://www.cloudzilla.to/embed/", "http://vidto.me/", "http://allmyvideos.net/", "http://video.pw/e/"];

linknum = []
while (linknum.length < list2.length){ linknum.push(0); }
none = 0

element = document.querySelector(".box .content").getElementsByClassName("video cboxElement")

setTimeout(function() {
  for (var i=0; i<element.length; i++){
    for (var a=0; a<list1.length; a++){
      if (element[i].href.indexOf(list2[list1[a]]) != "-1"){
        if (element[i].href.split(list2[list1[a]])[1].split("&")[0] != "") {
          listid = list1[a]
          linknum[a]++
          a = 99
        }
      }
    }
    if (a == "100"){
      idpre = list2[listid]
      linkpre = list3[listid]
      id = element[i].href.split(idpre)[1].split("&")[0]
      link = linkpre+id
      element[i].href = link
    } else none++
  }
  for (var count=0; count<list1.length; count++){
    console.log(list2[list1[count]] + linknum[count])
  }
  console.log("none="+none);
}, 0)