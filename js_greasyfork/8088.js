//// ==UserScript==
// @name			www.lfporn.com
// @namespace		http://use.i.E.your.homepage/
// @version			0.25
// @description     A good pornsite - got even better.

// @match			http://www.lfporn.com/*
// @match			http://ketope.com/embed/*

// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue

// @created			2014-12-10
// @released		2014-00-00
// @updated			2014-00-00
// @history         @version 0.25 - first version: @released - 2015-02-15

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @copyright		2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/8088/wwwlfporncom.user.js
// @updateURL https://update.greasyfork.org/scripts/8088/wwwlfporncom.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014, -W030*/
// -W014, laxbreak, Bad line breaking before '+'

var mainWidth = 1239,
    wideWidth = 1500,
    extraWidth = 1800,
    ktime = performance.now(),
    docLoc = window.location.href,
    lstate = 3,
    g = window;

String.prototype.formatString = function(){ 
    return this.toString()
                .split(/\s+/g).join(' ')
                .split('{').join('{\n\t')
                .split('; ').join(';')
                .split(';').join(';\n\t')
                .split('*/').join('*/\n')
                .split('}').join('}\n'); 
};

function l( name, fn, showthis ){  if( lstate == 1 || lstate == showthis ) console.log( name, fn !== undefined ? fn : '' ); }

function embededVideo()
{
    var css;
    $('#corr').size() === 0 && (
            css = '<style id="corr">'
            +	'body {'
            +		'margin: 0px;'
            +		'overflow: hidden;'
            +		'}'
            +	'body, .video-player, #video-setup, #video-setup_view, .jwvideo, video {'
            +		'width: 100% !important;'
            +		'height: 100% !important;'
            +		'}'
            +'</style>');
        $(  css.formatString() ).appendTo('head');
}

docLoc.search('/embed/') > 0 ? embededVideo() : (

$( '<style id="CssBasic"></style>' +
   '<style id="fullplayerCss"></style>' +
   '<style id="paginationWrap"></style>' +  
   '<style id="playerWidth"></style>' ).appendTo('head') );    

$( '#gb' ).remove();

function pagination()
{
    var paginationWrapCss =    
    	'.paginator {'
    +		'height: 40px;'
//    +		'left: -50%;'
//    +		'position: absolute;'
    +		'width: 100%;'
    +		'margin-top: 10px;'
    +		'}'
    +	'.paginator .paginationWrap {'
    +		'position: relative;'
    +		'background: transparent;'
    +		'border: transparent;'
    +		'}';
    
    $( '#paginationWrap' ).html( paginationWrapCss.formatString() );
    
    if( $('.paginationWrap').size() === 0 ) $( '.paginator *' ).wrapAll( "<span class='paginationWrap' />");
}

function basic( )
{
    var CssBasic =
        'div#rightad, br {'
    +		'display: none;'
    +		'}'
    +	'.content, div#srch, .single-post, .single-post p, .single-post iframe, .single-post #nooverlay, .single-post #nooverlay iframe {'
    +		'width: 100%;'
    +		'}'
    +	'.ssba {'
    +		'padding-top: 10px;'
    +		'}'
    +	'.single-post p {'
    +		'max-height: initial;'
    +		'}'
    +	'.posts .post {'
    +		'width: calc(100% / 4);'
    +		'height: initial;'
    +		'}'
    +	'.posts .post a {'
    +		'width: 100%;'    
    +		'}';
    
	$( '#CssBasic' ).html( CssBasic.formatString() );     
}

function playerWidth(input)
{
    var fullplayer = $('html').hasClass('fullplayer'),       
        playerWidth = fullplayer ? 0 : 160,
        marginPost = fullplayer ? 0 : 10,
        newWidth = fullplayer ? ( $( window ).width() - 28 ) : input !== undefined ? input : mainWidth,       
        newheight = fullplayer ? ( ( $( window ).height() - 28 )+'px ' ):( '( '+newWidth+'px - '+playerWidth+'px ) * ( 8.2 / 15.4 )' ),
        playerCss =
       	'.main {'
    +		'width: '+newWidth+'px;'
    +		'}'
    +	'.posts {'
    +		'width: calc( 100% - '+playerWidth+'px );'
    +		'margin-top: '+marginPost+'px;'
    +		'}'
    +	'.single-post iframe, .single-post #nooverlay iframe {'
//    +		 fullplayer ? 'width: '+newWidth+'px;':' '
    +		'height: calc( '+newheight+' );'
    +		'}'
    +	'.posts .post a img {'
    +		'width: calc( 100% - 4px );'
    +		'height: '+( ( ( ( newWidth - playerWidth ) / 4 ) - 4 ) * ( 150 / 226 ) )+'px;'
    +		'}' 
    +	'.paginator .paginationWrap {'
    +		'left: calc( ( '+( newWidth - playerWidth )+'px / 2 ) - ( 896px / 2 ) );'
    +		'}';
    
    $( '#playerWidth' ).empty().html( playerCss.formatString() );    
}

$( window ).resize(function()
{
    if( $('html').hasClass('fullplayer') )
    {
        playerWidth();
    }
});

pagination();

function fullPlayer()
{
    var fullplayerCss =
       	'.header, .sidebar, div#srch, h2.post-titlee, .posts .post, .pr-widget, .footer {'
    +		'display: none !important;'
    +		'}'
    +	'.ssba, .video-category, #lasthope, .single-post .video-category, .single-post .video-tags, .post-comments, #comment {'
    +		'display: none !important;'
    +		'}'
    +	'body {'
    +		'overflow: hidden;'
    +		'min-width: inherit;'
    +		'background-color: black'
    +		'}'
    +	'body:hover, .single-post:hover, .posts:hover {'
    +		'background-color: #999999'
    +		'}';
    
    $( '#fullplayerCss' ).empty().html( fullplayerCss.formatString() );

/*    
	$(document).on({
        mouseenter: function(e) {
            $('html').hasClass('fullplayer') && e.target == this && $('body').css('cssText','background-color: #f9f9f9');
        },
        mouseleave: function(e) {
            $('html').hasClass('fullplayer') && e.target == this && $('body').css('cssText','');
        }
    }, "body, .single-post:not('iframe'), .posts"); //pass the element as an argument to .on
    
	$( 'body, .single-post, .posts' ).hover(function(e){
		$('html').hasClass('fullplayer') && e.target == this && $('body').css('cssText','background-color: #f9f9f9');
	});
*/

}
function fn_choice( thisSwitch )
{
    var setListYes = 1,
        setVideoYes = 1,
        thisorgSwitch;
        
    switch( thisSwitch )
    {
        case 'normal':            
            if( $('html').hasClass('fullplayer') ) return false;
            
            $("style#fullplayer, style#playerWidth, style#CssBasic").empty();
            basic();
            playerWidth(mainWidth);
            
            break;
        case 'big':            
            if( $('html').hasClass('fullplayer') ) return false;
            if( $('.paginator').size() > 0 ) return false;
            
            $('html').addClass('fullplayer');
            basic();
            fullPlayer();
            playerWidth( $( window ).width() - 28 );

            setListYes = 0;
            break;
        case 'wide':
            if( $('html').hasClass('fullplayer') ) return false;
            
            $("style#fullplayer, style#playerWidth, style#CssBasic").empty();
            basic();
            playerWidth(wideWidth);
            
            break;
        case 'extrawide':
            if( $('html').hasClass('fullplayer') ) return false;
            
            $("style#fullplayer, style#playerWidth, style#CssBasic").empty();
            basic();
            playerWidth(extraWidth);
            
            break;
        case 'orginal':            
            if( $('html').hasClass('fullplayer') ) return false;   
            
            $("style#fullplayer, style#playerWidth, style#CssBasic").empty();
            
            break;
        case 'esc':            
            if( $('html').hasClass('fullplayer') === false ) return false;
            
            $( 'html' ).removeClass( 'fullplayer' );
            $( "style#fullplayerCss" ).empty();
            
            playerWidth(mainWidth);
            
            setListYes = 0;
            setVideoYes = 0;
            break;
    }
     
/*   
    $('#player').size() > 0 && setVideoYes == 1 && GM_setValue( 'xVideo', thisSwitch );
    $('#player').size() < 1 && setVideoYes == 1 && GM_setValue( 'xVideo_List', thisSwitch );
*/    
    l('load '+thisSwitch, performance.now() - ktime );
}

fn_choice( 'normal' );

document.addEventListener('keydown', function(e) {
    
    l('key',e.keyCode,4);
    
    ktime = performance.now();
    
    if (e.keyCode == 27) { fn_choice('esc'); }					//esc       

    else if (e.keyCode == 66) { fn_choice('big'); }				//b        

    else if (e.keyCode == 78) { fn_choice('normal'); }			//n
        
    else if (e.keyCode == 87) { fn_choice('wide'); }			//w
        
    else if (e.keyCode == 69) { fn_choice('extrawide'); }		//E    
        
    else if (e.keyCode == 79) { fn_choice('orginal'); }			//O    
        
    else if (e.keyCode == 82) { }								//R
        
    else if (e.keyCode == 39) { 								//next        
        if( $('.paginator').size() > 0 ) window.location.href = $('.paginator .current').next().attr('href');        
        l('load next', performance.now() - ktime );
    }        
    else if (e.keyCode == 37) { 								//Prev        
        if( $('.paginator').size() > 0 ) window.location.href = $('.paginator .current').prev().attr('href');       
        l('load prev', performance.now() - ktime );
    }
        
}, false);

$( 'body, .single-post, .posts' ).on('click',function(e){
    $('html').hasClass('fullplayer') && e.target == this ? fn_choice('esc') : fn_choice('big'); });









