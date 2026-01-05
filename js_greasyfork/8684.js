// ==UserScript==
// @name         Change video player for vkmag
// @namespace    vkmag.com
// @description  Change video player to youtube or native videoplayer
// @include      http://*.vkmag.com*
// @include      http://*.vkmag.com*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @author       DLL
// @version      0.15
// @downloadURL https://update.greasyfork.org/scripts/8684/Change%20video%20player%20for%20vkmag.user.js
// @updateURL https://update.greasyfork.org/scripts/8684/Change%20video%20player%20for%20vkmag.meta.js
// ==/UserScript==]]]]]
var file;
var height = 434;
var size = $(window).height()-100;



$(function() {
    if ($("#my-video1").length !== 0)
    {
        file = jwplayer('my-video1')['config']['file'];
        file = youtube_parser(file);
        $('<div class="video"></div>').insertAfter(".postInfo");
        $('.video').html('<iframe width="100%" src="http://www.youtube.com/embed/' + file + '?rel=0&autoplay=1" frameborder="0" allowfullscreen </iframe>');
        setAspectRatio();
        jQuery(window).resize(setAspectRatio);
        $("#my-video1").remove();
    }
    else if ($("#my-video").length !== 0){
        file = jwplayer('my-video')['config']['file'];
        $('<div class="video"></div>').insertAfter(".postInfo");
        $('.video').html('<video width="100%" autoplay="autoplay" controls="controls" loop><source src="' + file + '" type="video/mp4"></video>')
        $("#my-video").remove();
        checkSize(size);
    }
    
    $(".videoSection").remove();

});

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        alert("Url incorrecta");
    }
}

function setAspectRatio() {
    jQuery('iframe').each(function() {
        jQuery(this).css('height', jQuery(this).width() * 9 / 16);
    });
}
function checkSize(size){
    setTimeout(function(){
        if ($("video").height() > 450){
            $("video").height( size );

        }
    }, 5000);

}
