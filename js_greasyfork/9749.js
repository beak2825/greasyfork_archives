// ==UserScript==
// @name       SkyGo Persistent Fullscreen Player
// @namespace  http://www.cb-net.org
// @version    0.1
// @description  Adds a button to SkyGo to enable Permanent Fullscreen Mode. Works for any resolution and adapts player size on browser resize. Press [ESC] to enter/leave fullscreen mode. Works fine with multi-display setups.
// @match      http://*.skygo.sky.de/*
// @copyright  2015+, Daniel Hoyos
// @downloadURL https://update.greasyfork.org/scripts/9749/SkyGo%20Persistent%20Fullscreen%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/9749/SkyGo%20Persistent%20Fullscreen%20Player.meta.js
// ==/UserScript==

$( window ).resize(function() {
    if(window.skyFullscreen){
        $('#PolymediaShowPlayer').width($(window).width()).height($(window).height());
    }
});

var toggleSkyFullscreen = function(){
    if(window.skyFullscreen == null)
        window.skyFullscreen = false;    
    window.skyFullscreen = !window.skyFullscreen;
    if(window.skyFullscreen)
        $('#PolymediaShowPlayer').css({'z-index':5000, 'position':'fixed', 'top':0, 'left':0}).width($(window).width()).height($(window).height()); 
    else
        $('#PolymediaShowPlayer').css('position','relative').width(680).height(383);  
    
};
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        toggleSkyFullscreen();
    }
});

$('.detail_actions').append('<a class="button horizontal fullscreenMode"><span style="padding-right:10px"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAphAAAKYQH8zEolAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAABVQTFRF////AAAAAAADAgACAQADAQACAQACwIjQ9gAAAAZ0Uk5TACBggMDgHoTxIAAAAGZJREFUGFdVzzEKgDAMheFE0blLd48gBHoEZ7t0FtTe/wgGa9Lnv33kLSHCBKIK0dlHyTCIrA4u9XBQRHABUETwrmBTUEzBpJgz4g6AmhF2Uowii4O89P/nfXG72qdt0MffpiWw6T2oqyLvfXdsVQAAAABJRU5ErkJggg8440b06f3736ac03d9e1b3bba31a7652"/></span><span>Advanced Fullscreen</span></a>');
$('.fullscreenMode').click(function(){toggleSkyFullscreen();});
$('#footer_nav .navlist').append('<li class="leaf">Fullscreen icon made by <a href="http://www.flaticon.com/authors/picol" title="Picol">Picol</a> from <a href="http://www.flaticon.com" title="Flaticon">flaticon.com</a></li>');
$('.detail_player').prepend('<div style="text-align:left; font-size:12px"><nobr><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VMCBP6HAJLLCW" target="_blank">Click here to buy me a coffee if you like fullscreen mode =)</a></div>');