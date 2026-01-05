// ==UserScript==
// @name         Scratch Swaggification Homepage Fixer
// @author       MegaApuTurkUltra
// @namespace    MegaApuTurkUltra_scripts
// @website      https://userstyles.org/styles/110430/scratch-2-0-swaggification
// @version      0.1.0
// @description  Fixes blurry images on the Scratch homepage that normally show up when using the Scratch Swaggification userstyle.
// @include      http://scratch.mit.edu/*
// @include      https://scratch.mit.edu/*
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @copyright    CC0 Public Domain
// @downloadURL https://update.greasyfork.org/scripts/8101/Scratch%20Swaggification%20Homepage%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/8101/Scratch%20Swaggification%20Homepage%20Fixer.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

if (unsafeWindow.location.pathname == '/') {
  try {
    $('.image.lazy').each(function () {
      var url = $(this).attr('data-original');
      url = url.replace('144x108', '480x360');
      $(this).attr('data-original', url).attr('src', url);
      scheduleLoadComplete($(this), $(this).parent().parent());
    });
    console.log('Project images fixed');
    $('.image .lazy').each(function () {
      var url = $(this).attr('data-original');
      url = url.replace('170x100', '394x232');
      $(this).attr('data-original', url).attr('src', url);
      scheduleLoadComplete($(this), $(this).parent().parent().parent());
    });
    console.log('Swaggification hi-res images activated');
  } catch (e) {
    console.log(e);
  }
}
function scheduleLoadComplete(img, li) {
  var loader = $('<div style="border-radius:5px;position: absolute;top:0px;left:0px;width:100%;height:87%;pointer-events:none;background:rgba(255, 255, 255, 0.7);border: 0;"'
  + '><img src="http://i.cubeupload.com/rPcKiu.gif" style="width: 48px;height:'
  + '48px;position:absolute;top: calc(50% - 48px);border:0;left: calc(50% - 24px);" /><p style="color:black;text-align:center;margin-top:2px;">Loading thumbnail...</p></div>');
  li.css('position', 'relative').append(loader);
  img.css('filter', 'blur(10px)');
  var i = new Image();
  i.src = img.attr('data-original');
  i.onload = function () {
    loader.fadeOut();
  };
}

$(document).scroll(function(){
    $(document.body).attr("style", "background-position:0px -"+(100*$(document).scrollTop()/$(document).height())+"px;");
});
    
    if(location.pathname.startsWith("/discuss/youtube/")){
        var h4 = $(".col-10 .box-head h4");
        h4.html(h4.text());
    }