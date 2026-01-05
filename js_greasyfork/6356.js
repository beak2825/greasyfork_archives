// ==UserScript==
// @name        beemp3s.org MP3
// @namespace   beemp3s.org Downloader
// @description Genera enlaces de descarga en beemp3s.org si esta activo el enlace.(nota: algunos no se descargan por que el archivo fue borrado)
// @author      yaelmania | http://www.yaelmania.co.nf/ | http://www.yaelmania.tk/
// @@copyright  2014, yaelmania (http://www.yaelmania.co.nf/ | http://www.yaelmania.tk/)
// @include     http://beemp3s.org/download.php*
// @version     09112014
// @license     OpenGL API
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6356/beemp3sorg%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/6356/beemp3sorg%20MP3.meta.js
// ==/UserScript==

var boxing = document.getElementsByClassName("song-player");
for (var i = 0; i < boxing.length; i++) {
boxing[i].setAttribute("id","song-player");
}

var generaid1 = document.getElementById("song-player");
var generaid1Sub = generaid1.getElementsByTagName("div");
generaid1Sub[0].setAttribute("id","song-player-box");

var generaid2 = document.getElementById("song-player-box");
var generaid2Sub = generaid2.getElementsByTagName("p");
generaid2Sub[0].setAttribute("id","song-player-box-a");

var urlsdata = document.getElementsByClassName("beeplaer")[0].getAttribute("flashvars")
var urlsdatas = urlsdata.replace(/playerID=1&bg=0xCDDFF3&leftbg=0x357DCE&lefticon=0xF2F2F2&rightbg=0x64F051&rightbghover=0x1BAD07&righticon=0xF2F2F2&righticonhover=0xFFFFFF&text=0x357DCE&slider=0x357DCE&track=0xFFFFFF&border=0xFFFFFF&loader=0xAF2910&soundFile=/gi,"")
var remplacelink = document.getElementById("song-player-box-a");
var remplacelinkSub = remplacelink.getElementsByTagName("a");
remplacelinkSub[0].setAttribute("href",urlsdatas);

var killbasura = document.getElementById("tab-download");
killbasura.parentNode.removeChild(killbasura);

var renuevaDescarga = document.getElementsByClassName("tabs-content");
for (var i = 0; i < renuevaDescarga.length; i++) {
renuevaDescarga[i].setAttribute("id","tabs-content");
}

var newDescargas = document.createElement('a');
newDescargas.setAttribute("id","tab-download")
newDescargas.setAttribute("target","_blank")
newDescargas.setAttribute("href", urlsdatas)
document.getElementById("tabs-content").appendChild(newDescargas);

var newImage = document.createElement('img');
newImage.setAttribute("id","tab-download-img")
newImage.setAttribute("src","http://www.auplod.com/u/ldpaou42394.png")
document.getElementById("tab-download").appendChild(newImage);