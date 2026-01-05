// ==UserScript==
// @name         Fix Games Workshop Image viewer
// @namespace    http://your.homepage/
// @version      0.1
// @description  I am sick of their stupid magnifying glass so just wrote a horribly ugly fix to put the big images in by default.
// @author       You
// @match        http://www.games-workshop.com/*
// @grant        snone
// @downloadURL https://update.greasyfork.org/scripts/8696/Fix%20Games%20Workshop%20Image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/8696/Fix%20Games%20Workshop%20Image%20viewer.meta.js
// ==/UserScript==
$('#hero-slot').css(
    {
        width: $(document).width(),
        textAlign: 'center'
    }
);
$('.img-holder').css(
    {
        width: 920,
        textAlign: 'center'
    }
);

$('.als-wrapper').on('click', '.als-item', function(ev){
    var imgSrc = $(this).find('img').attr('src'),
        imgSizePos = imgSrc.indexOf('70x70'),
        imgNewSrc = imgSrc.replace('70x70', '920x950');

    $('.img-holder img').attr('src', imgNewSrc);
    ev.stopPropagation();
    return false;
});