// ==UserScript==
// @name           Direct Image Link Multi
// @description    Переработка переработки переработки Zendillo's Gelbooru Thumb to Image script. Показывает прямые ссылки под эскизами
// @icon           http://www.faunaurbana.com.br/wp-content/uploads/2010/09/20100531083526E621Logo.png
// @include        https://e621.net/*
// @include        http://*gelbooru.com*
// @include        http://*gocomics.com*
// @include        http://*rule34.xxx*
// @include        http://*tapastic.com*
// @include        http*://twitter.com*
// @grant          none
// @version 0.0.1.20150201183309
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/7840/Direct%20Image%20Link%20Multi.user.js
// @updateURL https://update.greasyfork.org/scripts/7840/Direct%20Image%20Link%20Multi.meta.js
// ==/UserScript==

// переключатели
var s_e621 = 1,
    s_gelb = 1,
    s_goco = 1,
    s_rule = 1,
    s_tapa = 1,
    s_twit = 1;

if ((s_e621)&&(window.location.href.indexOf('e621') !== -1)) {
 var spans = document.getElementsByTagName("span");
 for (x in spans) {
  if (spans[x].className=="thumb") {
   var dir = [];
   dir[0] = spans[x].getElementsByTagName("img")[0].getAttribute('src').replace("preview/","");
   if ((dir[0].indexOf("/download-preview.png") < 0)&&(dir[0].indexOf("/webm-preview.png") < 0)) {
    dir[1] = dir[0].replace(".jpg",".gif");
    dir[2] = dir[0].replace(".jpg",".png");
    var dlink = [], text = ["jpg ", "gif ", "png"];
    for (i=0; i<= 2; i++) {
     dlink[i] = document.createElement('a');
     dlink[i].setAttribute('href', dir[i]);
     dlink[i].innerHTML = text[i];
     spans[x].appendChild(dlink[i]);
    }
   }
  }
 }
}

if ((s_gelb)&&(window.location.href.indexOf('gelbooru') !== -1)) {
 var spans = document.getElementsByTagName("span");
 for (x in spans) {
  if (spans[x].className=="thumb") {
   var dir = [], dlink = [], text = ["jpg ", "jpeg ", "gif ", "png"];
   dir[0] = spans[x].getElementsByTagName("img")[0].getAttribute('src').split('?')[0].replace("\/\/gel","//simg3.gel").replace("thumbnails","images").replace("thumbnail_","");
   dir[1] = dir[0].replace(".jpg",".jpeg");
   dir[2] = dir[0].replace(".jpg",".gif");
   dir[3] = dir[0].replace(".jpg",".png");
   spans[x].appendChild(document.createElement('br'));
   for (i=0; i<= 3; i++) {
    dlink[i] = document.createElement('a');
    dlink[i].setAttribute('href', dir[i]);
    dlink[i].innerHTML = text[i];
    spans[x].appendChild(dlink[i]);
   }
  }
 }
}

if ((s_goco)&&(window.location.href.indexOf('gocomics') !== -1)) {
 var strip = document.getElementsByClassName('strip'), img  = strip[1].getAttribute('src'), dlink = document.createElement('a');
 dlink.setAttribute('href', img+'.gif');
 dlink.setAttribute('style', 'font-size: 20px');
 dlink.innerHTML = "Прямая cсылка";
 strip[0].parentNode.appendChild(dlink);
}

if ((s_rule)&&(window.location.href.indexOf('rule34') !== -1)) {
 var spans = document.getElementsByClassName("preview");
 for (x in spans) {
  var dir = [], dlink = [], text = ["jpg ", "jpeg ", "gif ", "png"];
  dir[0] = spans[x].getAttribute('src').split('?')[0].replace("thumbnails","images").replace("thumbnail_","");
  dir[1] = dir[0].replace(".jpg",".jpeg");
  dir[2] = dir[0].replace(".jpg",".gif");
  dir[3] = dir[0].replace(".jpg",".png");
  spans[x].parentNode.appendChild(document.createElement('br'));
  for (i=0; i<= 3; i++) {
   dlink[i] = document.createElement('a');
   dlink[i].setAttribute('href', dir[i]);
   dlink[i].innerHTML = text[i];
   spans[x].parentNode.appendChild(dlink[i]);
  }
 }
}

if ((s_tapa)&&(window.location.href.indexOf('tapastic') !== -1)) {
 var strip = document.getElementsByClassName('art-image'), img = strip[0].getAttribute('src'), dlink = document.createElement('a');
 dlink.setAttribute('href', img);
 dlink.setAttribute('style', 'font-size: 20px');
 dlink.innerHTML = "Прямая ссылка";
 strip[0].parentNode.appendChild(dlink);
}

if ((s_twit)&&(window.location.href.indexOf('twitter') !== -1)) {
 var parentdiv = document.getElementsByClassName("TwitterPhoto-container"); //найти все места картинок
 for (x in parentdiv) {
  var image = parentdiv[x].getElementsByClassName("TwitterPhoto-mediaSource"); //найти картинку
  var source = image[0].getAttribute('src').split(':l')[0]; //найти и подрезать её путь
  var dlink = document.createElement('a'); //смастерить ссылку
  dlink.setAttribute('href', source); //вставить путь
  dlink.setAttribute('target', '_blank'); //и чтоб в другом окне открывалась
  dlink.innerHTML = "Прямая ссылка"; //обозвать
  parentdiv[x].appendChild(dlink); //и присобачить
 }
}