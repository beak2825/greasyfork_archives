// ==UserScript==
// @name       		iStock XL Comps
// @description  	Get a full size comp from iStock to include it in your development work.
// @copyright  		2014, Giammarco Galletti (http://dotsqr.co)
// @icon            http://i.imgur.com/5aXOn7y.png
// @license         MIT License
// @homepageURL     https://gist.github.com/gallettigr/8693df7ce9ed2da21415
// @supportURL      http://dotsqr.co
// @namespace       istock-xl-comps
// @oujs:author     gallettigr
// @version         0.1
// @match           http://www.istockphoto.com/photo/*
// @match           http://www.istockphoto.com/vector/*
// @require    		http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/6711/iStock%20XL%20Comps.user.js
// @updateURL https://update.greasyfork.org/scripts/6711/iStock%20XL%20Comps.meta.js
// ==/UserScript==

jQuery.noConflict();
jQuery(document).ready( function() {
    var istockCompHTML = '<div id="istock-xl-comp"><p>Zoom the image to desired size. </p><a href="javascript:();">Grab Image</a></div>';
    
    var istockCompButtonLabel = {
        'opacity' : '0',
        'margin' : '15px 0 0',
        'padding' : '10px 10px 12px',
        'border' : '1px solid #ccd3d3',
        'font' : '300 16px/33px "iStock Maquette", Arial, Tahoma, sans-serif',
        'background' : '#f3f3f3',
        'height' : '0',
        'width' : '360px'
    };
    
    var istockCompText = {
        'float' : 'left',
        'margin' : '0',
        'font' : '300 14px/37px Arial, Tahoma, sans-serif'
    }
    
    var istockCompButton = {
		'float' : 'right',
        'width' : '125px',
        'height' : '32px',
        'margin' : '0',
		'background' : '#2a98ed',
        'color' : '#fafafa',
        'font-weight' : 'bold',
        'text-align' : 'center',
        'text-decoration' : 'none',
        'border' : '1px solid #2473b0',
        'border-radius' : '4px'
    };
    
    var istockCompButtonHoverCSS = {
		'background' : '#268FE0'
    };
    
    jQuery(istockCompHTML).appendTo('#file-preview').css(istockCompButtonLabel).not(':animated').animate({opacity: '1', height: '32px'}, 300);
    jQuery("#istock-xl-comp > p").css(istockCompText);
    jQuery("#istock-xl-comp > a").css(istockCompButton);
    jQuery("#istock-xl-comp > a").hover( function() {
        jQuery(this).css(istockCompButtonHoverCSS);
    }, function() {
        jQuery(this).css(istockCompButton);
    });
    
    var iStockBaseURL = 'http://www.istockphoto.com';

    jQuery("#istock-xl-comp > a").on('click', function(){
        if (jQuery('#ZoomDraggableDiv > div[id^="s"]:visible').size() > 0) {
			var generatedURL = jQuery('#ZoomDraggableDiv > div[id^="s"]:visible > div:first-child img').attr('src');
            window.open(iStockBaseURL + generatedURL, '_blank');
        }
        else
            alert('First click on the image to zoom and generate image size.');
    });
    
});