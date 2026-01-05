// ==UserScript==
// @name       Taringa GIF blocker
// @namespace  http://www.taringa.net/qwerty1349
// @version    1.5.14
// @description  GIF blocker para taringa.
// @match      http://www.taringa.net/mi*
// @copyright  @qwerty1349
// @downloadURL https://update.greasyfork.org/scripts/6714/Taringa%20GIF%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/6714/Taringa%20GIF%20blocker.meta.js
// ==/UserScript==

function filtrar(i) {
  if(/^.*\.gif/i.test(i.src)){
    if(i.parentNode.tagName=="A"){
      return true;
    }
  }
  return false;
}
function pausa(i){
  var c = document.createElement('canvas');
  var w = c.width = i.width;
  var h = c.height = i.height;
  var sr = i.src;
  var ctx = c.getContext('2d');
  var lin = Math.min(w/4, h/4);
  var he = lin * (Math.sqrt(3)/2);
  ctx.drawImage(i, 0, 0, w, h);
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(w/2, h/2, Math.min(w/4, h/4), 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fill();
  ctx.closePath();
  ctx.translate(w/2,h/2);
  ctx.beginPath();
  ctx.lineTo(-lin/2, he/2);
  ctx.lineTo(lin/2, 0);
  ctx.lineTo(-lin/2, -he/2);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fill();
  ctx.closePath();
  try{
    i.src = c.toDataURL("image/gif");
  }catch(e){
    for(var j = 0, a; a = i.attributes[j]; j++){
      c.setAttribute(a.name, a.value);
    }
    i.parentNode.replaceChild(c, i);
  }
  c.addEventListener("mouseover", function(){
    var im = document.createElement("img");
    im.src = sr;
    c.parentNode.replaceChild(im, c);
  });
}
$(window).on("load", function(){
  var imgs =[].slice.apply(document.images).filter(filtrar).map(pausa);
  imgs = [];
});
$(document).on("ajaxSuccess", function(){
  var imgs =[].slice.apply(document.images).filter(filtrar).map(pausa);
  imgs = [];
});