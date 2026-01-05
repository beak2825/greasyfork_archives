// ==UserScript==
// @name                Yotube Image Acces
// @name:es             Youtube Acesso imagen
// @namespace           https://greasyfork.org/es/users/6729
// @run-at              document-end
// @require             https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include             https://www.youtube.com/*
// @include             http://www.youtube.com/*
// @version             0.9
// @description         help to get youtube default images hq,mq,lq.
// @description:es      Ayuda a bajar las imagenes delos videos en youtube
// @author              yaelmania
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/9150/Yotube%20Image%20Acces.user.js
// @updateURL https://update.greasyfork.org/scripts/9150/Yotube%20Image%20Acces.meta.js
// ==/UserScript==

var $yj = jQuery.noConflict();

$yj(document).ready(function() {
  var ETIQUETA_TEXTO={'ar':'صورة الفيديو','cs':'Obraz videa','de':'Video-Bild','en':'Video image','es':'Video imagen','fr':'Image vidéo','hi':'डवीडियो छवि','hu':'Videokép','id':'Gambar video','it':'Immagine video','ja':'ビデオ画像','ko':'비디오 이미지','pl':'Obraz wideo','pt':'Imagem de vídeo','ro':'Imagine video','ru':'Видео изображение','tr':'Video görüntüsü','zh':'视频图像'};
  var idiomas=document.documentElement.getAttribute('lang');
  var imagenImg = 'data:image/gif;base64,R0lGODlhCAAMAJEBAAAzmQAAAAAAAAAAACH5BAEAAAEALAAAAAAIAAwAAAIPjI+puwDqXorQIXpwliwUADs=';
  var imageText=(ETIQUETA_TEXTO[idiomas])?ETIQUETA_TEXTO[idiomas]:ETIQUETA_TEXTO['en'];
  var videoid = window.location.href;
  var filtroA = videoid.replace(/.+v=/gi,'');
  var filtroB = filtroA.replace(/&.+/gi,'');
  var newimgBox = document.createElement('li');
  newimgBox.setAttribute('id','ImgBox');
  newimgBox.setAttribute('class','watch-meta-item');
  newimgBox.innerHTML = ".";
  $yj('.watch-extras-section')[0].appendChild(newimgBox);
  $yj('#ImgBox').html('<h4 class="title">' + imageText + '</h4><ul class="content watch-info-tag-list"><a class="yt-uix-sessionlink spf-link g-hovercard" href="https://i.ytimg.com/vi/' + filtroB + '/hqdefault.jpg" target="_blank"><img src="' + imagenImg + '"/>HQ Imagen</a> <a class="yt-uix-sessionlink spf-link g-hovercard" href="https://i.ytimg.com/vi/' + filtroB + '/mqdefault.jpg" target="_blank"><img src="' + imagenImg + '"/>MQ Imagen</a> <a class="yt-uix-sessionlink spf-link g-hovercard" href="https://i.ytimg.com/vi/' + filtroB + '/default.jpg" target="_blank"><img src="' + imagenImg + '"/>Low Imagen</a></ul>');
});