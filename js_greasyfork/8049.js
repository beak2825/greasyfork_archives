//// ==UserScript==
// @name			tubenn.com - 16 porn sites in one script
// @namespace		http://use.i.E.your.homepage/
// @version			0.32
// @description     Navigation menu - Layout ' Change bigger better, dynamic autochange -tubenn.com, yamtube.com, yamtube.net, hdporn1080.net, yomporn.com, womporn.com, tubeuu.com, tubekk.com, wixvi.com, wixvi.so, hotpornohd.com, hotpornohd.com, www.vdep.net, kcce.com, streampornhd.com, www.porntoast.tk

// @match			http://tubenn.com/*

// @match			http://yamtube.com/*
// @match			http://yamtube.net/*
// @match			http://nixvi.com/*

// @match			http://hdporn1080.net/*

// @match			http://womporn.com/*
// @match			http://yomporn.com/*

// @match			http://tubeuu.com/*
// @match			http://tubekk.com/*

// @match			http://wixvi.com/*
// @match			http://wixvi.so/*
// @match			http://wixvi.cc/*

// @match			http://hotpornohd.com/*WrongSiteLayout
// @match			http://www.vdep.net/*WrongSiteLayout
// @match			http://kcce.com/*WrongSiteLayout

// @match			http://streampornhd.com/*

// @match			http://realvid.net/embed-*
// @match			http://streamin.to/embed-*
// @match			http://videowood.tv/embed/*

// @match			http://www.porntoast.tk/*

// @match			http://www.gonzoporn.org/*

// @match			http://omgpornpics.com/*

// @match			http://xparod.com/*
// @match			http://www.pornstreams.eu/*

// @match			http://porn720p.net/*

// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require			https://greasyfork.org/scripts/1930-simulate-click/code/Simulate_click.js?version=5025
// @require         https://greasyfork.org/scripts/9160-my-function-library/code/My%20Function%20library.js?version=45900

// @run-at			document-end

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue

// @created			2015-01-14
// @released		2015-00-00
// @updated			2015-00-00

// @history         @version 0.26 @released - 2015-02-13 - 16 sites
// @history         @version 0.25 @released - 2015-02-13 - first version - 9 sites

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @copyright		2014+, Magnus Fohlström.
// @downloadURL https://update.greasyfork.org/scripts/8049/tubenncom%20-%2016%20porn%20sites%20in%20one%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/8049/tubenncom%20-%2016%20porn%20sites%20in%20one%20script.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression
// -W082, a function declaration inside a block statement

//----------------------------------------------------------------------------
(function ($) {
    
    $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) 
    {
		var found	= 'found',
            $this	= $(this.selector),
            $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);   
        if( !isChild ) 
        {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
                window.setInterval(function () { 
                    $this.waitUntilExists(
                        handler, shouldRunHandlerOnce, true); 
                }, 500);
        } 
        else if (shouldRunHandlerOnce && $elements.length) 
        {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
		return $this;
	};
        
}(jQuery));

String.prototype.formatString = function(){
    return this.toString()    
                .split(/\s+/g).join(' ')
    			.split('¤').join('')
                .split('{').join('{\n\t\t')
                .split('; ').join(';')
                .split(';').join(';\n\t\t')
                .split('*/').join('*/\n')
    			.split('\t\t').join('\t')
                .split('}').join('}\n');
};

function ScrollZoomTune(selection,zomms,tune,ani,speed) //ScrollZoomTune("div.thumb .title a",1,-25,1,'slow');
{    
    $('body').css('zoom',zomms); 
    
    var position = $( selection ).position();        
    position = position.top;
    position = position + tune;
    
    ani == 1 ? $('body').animate({ scrollTop: position * zomms }, speed) : $('body').scrollTop( position * zomms);

}

//function l( name, fn, showthis ){  if( showthis == 1 || lstate == showthis ) console.log( name, fn !== undefined ? fn : '' );  }
function l(name,fn){ console.log( name, fn !== undefined ? fn : '' ); }

//-------------------------------------------------------------------------------

if( GM_getValue( 'tubenn' ) == 'undefined' || GM_getValue( 'tubenn' ) === undefined ) GM_setValue( 'tubenn', 'orginal' );
if( GM_getValue( 'tubenn_List' ) == 'undefined' || GM_getValue( 'tubenn_List' ) === undefined ) GM_setValue( 'tubenn_List', 'orginal' );

GM_deleteValue( 'tubenn_Scroll' );
//GM_deleteValue( 'tubenn_big' );

GM_setValue( 'tubenn_playerState', 0 );

var UI_state = $('#gplayer').size() === 0 ? GM_getValue( 'tubenn_List' ) : GM_getValue( 'tubenn' ),
    pageNormal = 1100,
    pageWide = 1440,
    pageExWide = 1700,
    docLoc = window.location.href;

//-------------------------------------------------------------------------------


function embededVideo(){
    $('#lightOff').size() === 0 && 
        $('<style id="lightOff">.lightsout_shade, #OnPlayerBanner, .video_ad { display: none !important; }' +
          '.wh { width: 100% !important; height: 100% !important; } body { overflow: hidden } </style>'.formatString() ).appendTo('head');
    
    var si = setInterval(function(){
            $('object').parent().addClass('wh').parent().parent().addClass('wh').parents('table').addClass('wh');
        	$('table>tbody>tr>td>div').not('.wh').addClass('wh');
            $('.wh').size() > 1 && clearInterval( si );
        },1); 
    $(document).on('click','*',function(e){ 
    this == e.target && console.log('emeded-target',e.target); });
}

docLoc.search('/embed-') > 0 && embededVideo();

$( '<style id="CssBasic"></style>' +
   '<style id="playerWidth"></style>' +
   '<style id="fullplayer"></style>' +
   '<style id="CssCategory"></style>' +
   '<style id="styleClickMenu"></style>' +
   '<style id="CssCorr"></style>' +
   '<style id="adsThis"></style>' +
   '<style id="light"></style>').appendTo('head');

    var CssCorr = 
        '#sidebar .widget {'
	+		'position: relative !important;'
	+		'top: 0 !important;'
	+		'}'
	+	'#sidebar {'
	+		'height: auto !important;'
	+		'}'
	+	'#page {'
	+		'overflow: visible;'
	+		'}'
	+	'#text-12 {'
	+		'margin-bottom: 50px;'
	+		'}'
	+	'#text-17 {'
	+		'margin-bottom: 100px;'
	+		'}'
	+	'#dp-widget-posts-5 {'
	+		'margin-top: 0px;'
	+		'}';
    $( '#CssCorr' ).html( CssCorr.formatString() );

c.i('CssCorr', CssCorr.formatString() );

//docLoc.search('wixvi.so/') > 0 && ( window.location.href = docLoc.replace('wixvi.so/','wixvi.com/') );
docLoc.search('tubenn.com/') > 0 && $('link[rel="shortcut icon"]').attr('href','http://adult.bloglovin.com/assets/gfx/favicon.ico');


function fn_Category(){
    var elem = '#dp-widget-posts-2, #dp-widget-posts-3, #dp-widget-posts-4, #categories-2, #archives-2',
        CssCategory = 
        '#sidebar {'
	+		'display: none;'
	+		'}'
	+	elem +' {'
	+		'width: calc(100% - 450px);'
	+		'left: -75px !important;'
	+		'position: relative !important;'
	+		'top: 0  !important;'
    +		'float: right;'
	+		'}'
	+	'.widget_archive ul, .widget_categories ul {'
	+		'width: 100%;'
	+		'}'
	+	'#sidebar {'
	+		'width: inherit;'
	+		'}'
	+	'#content {'
	+		'width: initial;'
	+		'margin-left: 125px;'
	+		'}'
	+	'.wrap.cf {'
	+		'width: calc(100% - 40px);'
	+		'}';
    $( elem ).insertBefore('#sidebar');
    $( '#CssCategory' ).html( CssCategory.formatString() );    
}

docLoc.search('/porn-categories') > 0 && fn_Category();

function fn_moveElem(state){
    var widgetpost = $( '#dp-widget-posts-3' ).size() == 1 ? '#dp-widget-posts-3' : '#dp-widget-posts-7',
        adsThis = '.thisAdsHide, #page>center, #OnPlayerBanner, .entry-content.rich-content>center, #floatdiv { display: none !important }';
    
    $( '.thisAdsHide' ).size() === 0 && ( $( '#main-nav' ).siblings('div').not('#main').addClass('thisAdsHide'), 
        $( '#page>center, #OnPlayerBanner, .entry-content.rich-content>center' ).addClass('thisAdsHide'),
        $( '#details center:has(iframe)').addClass('thisAdsHide') );    
	
    $( 'a[href*="keep2share"]' ).addClass('thisAdsHide');
	
    $( '.insertAfter' ).size() === 0 && $( widgetpost ).prev().addClass('insertAfter'); 
    state == 1 ? ( $('style#adsThis').empty(), $( widgetpost ).insertAfter('.insertAfter') ):( $('style#adsThis').html( adsThis.formatString() ), $( widgetpost ).insertAfter('.section-box.related-posts') );    
}

function OLD_fn_moveElem(){
    $( '#main-nav' ).next().addClass('removeThis');
    $( '.removeThis' ).attr('id') != 'main' ? ( 
        $( '.removeThis' ).remove(), fn_moveElem() ):( $( '#dp-widget-posts-3' ).insertAfter('.section-box.related-posts'), $( '#main' ).removeClass('removeThis') );
}

function fn_Basic(){   
	if( $( '.flr' ).length == 1 ) return false;
	
	$('.entry-content.rich-content > a').each(function(i,e){
		if(i > 5) return false;
		var $e = $(e);
		$e.addClass('aa'+i);
		i == 1 && $e.height() > $e.width() && ($e.addClass('flr'), c.i('flr'));
	});
	
	$('.aa1').insertBefore('.aa0');
	
    var CssBasic = 
        '#sidebar, body > table[width="100%"][height="100%"], .tabs-shortcode.ui-tabs > p br, .tabs-shortcode .ui-tabs-panel > p br {'
	+		'display: none !important;'
	+		'}'
	+	'.aa1 {'
	+		'float: right;'
	+		'}'
	+	'#content > div {'
	+		'float: left;'
	+		'width: inherit;'
	+		'}'
	+	'.fluid-width-video-wrapper {'
	+		'background: transparent;'
	+		'}'
	+	'.boxed-wrap #page {'
	+		'padding: 0 20px;'
	+		'}'
	+	'.screen.fluid-width-video-wrapper {'
	+		'padding-top: initial !important;'
	+		'}'
	+	'#content, #contentfull {'
	+		'width: inherit;'
	+		'}'
	+	'#dp-widget-posts-3, #dp-widget-posts-7 {'
	+		'position: static !important;'
	+		'}'
	+	'.grid-medium .nag, .grid-small .nag, .post-grid-2 .nag, .widget-posts .post-grid-2  {'
	+		'width: calc( 100% + 35px );'// 21 28 35
	+		'}';
    $( '#CssBasic' ).html( CssBasic.formatString() );     
}

function fn_playerWidth(tmpWidth) { 
    var inurl		= 	inURL('streampornhd.com/') || inURL('wixvi') || inURL('womporn.com') || 
						inURL('nixvi.com') || inURL('hdporn1080.net') || inURL('tubeuu.com')  || inURL('tubekk.com'),
		
		screenWidth	= screen.width - 20,
        inputWidth  = tmpWidth > screenWidth ? screenWidth : tmpWidth,
        border		= 30,
        fullWWidth	= $( window ).width(),
        fullplayer 	= $('html').hasClass('fullplayer'),
        width 		= fullplayer ? fullWWidth - border : inputWidth,
//        height 		= fullplayer ? $( window ).height() - border : width * (9/16),
        divider		= fullplayer ? 5 : ( width > pageNormal ? ( inputWidth > pageWide ? 5 : 4 ) : 3 ),
        divided		= width / divider,
        vwidth		= fullplayer ? fullWWidth - border + 'px' : inurl ? inputWidth + 'px' : '100%',
        vheight		= fullplayer ? $( window ).height() - border + 'px' : /*inurl ?*/ width * (9/16) + 'px' /*: '100%'*/,
        playerMore, playerWidth;
 	
    playerWidth = 
		'.wrap.cf, .boxed-wrap #page {'
    +		'width: '+width+'px !important;'
    +		'}'
	+	'.movie-player, #myplayer {'
    +		'height: '+vheight+' !important;'
    +		'}'
	+	'#gplayer, .fluid-width-video-wrapper iframe, .fluid-width-video-wrapper object, .fluid-width-video-wrapper, ' 
    +	'.fluid-width-video-wrapper embed, .fluid-width-video-wrapper video, .entry-content.rich-content iframe {'
    +		'width: '+vwidth+' !important ;'
    +		'height: '+vheight+' !important;' 
    +		'}';
    
    ( docLoc.search('kcce.com') > 0 || docLoc.search('www.vdep.net') > 0 ) && ( playerWidth += 
        '#page {'
    +		'width: '+( width + 30 )+'px !important;'
    +		'}');
    
    playerMore =
    	'.grid-medium .item, .grid-mini .item, .grid-small .item, .post-grid-2 .item {'
    +		'width: calc( '+divided+'px - 16px ) !important;'
    +		'}'
    +	'.grid-medium .thumb, .grid-mini .thumb, .grid-small .thumb, .post-grid-2 .thumb {'
    +		'width: 100% !important;'
    +		'height: calc( ( '+divided+'px - 12px ) * ( 108/192 ) ) !important;'
    +		'}'
    +	'.grid-medium .thumb img, .grid-mini .thumb img, .grid-small .thumb img, .post-grid-2 .thumb img {'
    +		'width: calc( '+divided+'px - 22px ) !important;'
    +		'height: calc( ( '+divided+'px - 22px ) * ( 108/192 ) ) !important;'
    +		'}';
    
    playerWidth += playerMore;
//    playerWidth += fullplayer ? playerMore :  ' ';
    $( '#playerWidth' ).empty().html( playerWidth.formatString() );
}

$( window ).resize(function(){  
    //$('html').hasClass('fullplayer') && fn_playerWidth();
    
    var get_ms = GM_getValue('ms'), fullWWidth = $( window ).width(); 
    ( $('html').hasClass('fullplayer') ) ? fn_playerWidth() : ( 
        ( get_ms === 0 ) && ( fullWWidth < pageExWide ? ( fullWWidth < pageWide ? ( fullWWidth < pageNormal ? fn_choice('orginal') : fn_choice('normal') ) : fn_choice('wide') ) : fn_choice('extrawide'), timer(512) ) ); 

});

function fn_fullplayer(){   
    $( '.entry-content.rich-content > p:not(:has(div)), ll.entry-content.rich-content > p:has(br)').has(':not(iframe)').addClass('fullhide');
    
    var fullplayer =
		'#header, #main-nav, #footer, .entry-header.cf, p.entry-meta, #extras, .section-box.related-posts, #dp-widget-posts-3, #dp-widget-posts-7, '
    +	'#disqus_thread, #fb-root, .ui-tabs-nav, .fullhide, br, .entry-content.rich-content > *:not(.tabs-shortcode-top):not(#gplayer), ul.tabs-shortcode-list {'
    +		'display: none !important;'
    +		'}'
    +	'#main {'
    +		'padding: '+( docLoc.search('streampornhd') > 0 ? '10px':'15px' )+' !important;'
    +		'}'
    +	'.fluid-width-video-wrapper {'
    +		'background: transparent;'
    +		'}'
    +	'#details, ul, ol, p, table, form, pre {'
    +		'margin: 0 !important;'
    +		'}'
    +	'html, body {'
    +		'overflow: hidden;'
    +		'}';
	
	fullplayer =
		'#gplayer, .fluid-width-video-wrapper, .player, .entry-content.rich-content iframe {'
	+		'position: absolute;'
	+		'top: 15px;'
	+		'bottom: 15px;'
	+		'left: 15px;'
	+		'right: 15px;'
	+		'padding: 5px;'
	+		'background-color: #7D231E;'
	+		'width: calc( 100% - 30px ) !important;'
	+		'height: calc( 100% - 30px ) !important;'
	+		'box-sizing: border-box;'
	+		'}'
	+	'.fluid-width-video-wrapper iframe, .fluid-width-video-wrapper object, '
	+	'.fluid-width-video-wrapper embed, .fluid-width-video-wrapper video {'
	+		'position: absolute;'
	+		'top: 0px;'
	+		'bottom: 0px;'
	+		'left: 0px;'
	+		'right: 0px;'
	+		'padding: 6px;'
	+		'background-color: #7D231E;'
	+		'width: calc( 100% - 0px ) !important;'
	+		'height: calc( 100% - 0px ) !important;'
	+		'box-sizing: border-box;'
	+		'}'
	
	+	'.movie-player, body * {'
	+		'position: static;'
	+		'}'
	+	'#page {'
	+		'overflow: hidden !important;'
	+		'height: 0;'
	+		'}'
	+	'#jwplayer {'
	+		'padding-right: 5px;'
	+		'box-sizing: border-box;'
	+		'}'
	+	'body {'
	+		'position: absolute;'
	+		'top: 0;'
	+		'bottom: 0;'
	+		'left: 0;'
	+		'right: 0;'
	+		'width: 100%;'
	+		'height: 100%;'
	+		'border: 0;'
	+		'overflow: hidden !important;'
	+		'}';
    
    $( '#fullplayer' ).empty().html( fullplayer.formatString() );
    
    $( 'html' ).addClass('fullplayer');
    
    //fn_playerWidth();

}

GM_setValue( 'ms', 0 );
function timer(ms){
    GM_setValue( 'ms', ms ); 
    setTimeout(function(){ GM_setValue( 'ms', 0 ); },ms);
} 

function fn_chkWin(fullWWidth){
    timer(4000);
    fullWWidth < pageExWide ? ( fullWWidth < pageWide ? ( fullWWidth < pageNormal ? fn_choice('orginal') : fn_choice('normal') ) : fn_choice('wide') ) : fn_choice('extrawide');
}

function fn_choice( thisSwitch ){
    var ktime = performance.now(),
        setListYes = 1,
        setVideoYes = 1,
        fullWWidth	= $( window ).width(),
        returnFalse = ['big','orginal','normal','wide','extrawide'];
    
//    l('thisSwitch',thisSwitch );
//    l('inArray', $.inArray( thisSwitch, returnFalse ) && $('html').hasClass('fullplayer') );
    
    if( thisSwitch !== 'esc' && $.inArray( thisSwitch, returnFalse ) !== -1 && $('html').hasClass('fullplayer') ) return false;
    
    fn_Basic();

    
    switch( thisSwitch ){
        case 'normal':            
            $("style#playerWidth").empty();
            ( fullWWidth < pageNormal ) ? ( fn_chkWin(fullWWidth) ) : ( fn_playerWidth(pageNormal) );                        
            break;
        case 'big':            
            $('html').addClass('fullplayer');
            GM_setValue( 'tubenn_big', $('#content').width() );            
            fn_fullplayer();
            ScrollZoomTune( 'body', 1, -2, 1, 'slow');
            setListYes = 0;
            break;
        case 'extrawide':
            ( fullWWidth < pageExWide )	? ( fn_chkWin(fullWWidth) ) : ( fn_playerWidth(pageExWide) );            
            break;
        case 'wide':
            ( fullWWidth < pageWide ) 	? ( fn_chkWin(fullWWidth) ) : ( fn_playerWidth(pageWide) );                        
            break;
        case 'orginal':   
            $('html').removeClass('fullplayer');                        
            $("style#fullplayer, style#CssBasic, style#playerWidth").empty();            
            break;
        case 'next':
            $('.nextpostslink').size() > 0 && $('.nextpostslink').simulate('click');            
            setListYes = 0;
            setVideoYes = 0;            
            break;
        case 'prev':
	        $('.previouspostslink').size() > 0 && $('.previouspostslink').simulate('click');
            setListYes = 0;
            setVideoYes = 0;            
            break;
        case 'esc':
            if( $('html').hasClass('fullplayer') === false ) return false;
            $('html').removeClass('fullplayer');
            $("#fullplayer").empty();

            var thisMainWidth = GM_getValue( 'tubenn_big' );
                        
            thisMainWidth < 1000 		? 	( 															fn_choice('orginal') 	):
            thisMainWidth == pageNormal ? 	( fullWWidth < pageNormal 	?	fn_chkWin(fullWWidth)	: 	fn_choice('normal') 	):
            thisMainWidth == pageWide 	? 	( fullWWidth < pageWide 	?	fn_chkWin(fullWWidth)	: 	fn_choice('wide') 		):
            thisMainWidth == pageExWide && 	( fullWWidth < pageExWide 	?	fn_chkWin(fullWWidth)	: 	fn_choice('extrawide') 	);
                        
            setListYes = 0;
            setVideoYes = 0;
            break;
    }
    
    var get_ms = GM_getValue('ms');
    //l('get_ms',get_ms); 
    //l('get_ms',get_ms === 0); 
    //l('setVideoYes',setVideoYes == 1); 

    var player = $('#gplayer, .entry-content.rich-content iframe').size();
    //l('player', player ); 
    ( player > 0 ) && ( GM_setValue( 'tubenn_playerState', player > 0 && player ) );    
    //l('GET ValueSET', GM_getValue( 'tubenn_playerState' ) ); 
    
    ( get_ms === 0 ) && setVideoYes == 1 && ( 
        GM_getValue( 'tubenn_playerState') > 0 ? GM_setValue( 'tubenn', thisSwitch ) : GM_getValue( 'tubenn_playerState') < 1 && GM_setValue( 'tubenn_List', thisSwitch ), 
        thisSwitch == 'orginal' ? fn_moveElem(1) : fn_moveElem(0), 
        timer(2000) );
    
    //l('thisSwitch', GM_getValue( 'tubenn' ) );
    
//    ( get_ms === 0 ) && ( thisSwitch == 'orginal' ? fn_moveElem(1) : fn_moveElem(0), timer(2000) );
    
//    ( get_ms === 0 ) && ( $('html').hasClass('fullplayer') || 
//    		( fullWWidth < pageExWide ? ( fullWWidth < pageWide ? ( fullWWidth < pageNormal ? l('orginal') : l('normal') ) : l('wide') ) : l('extrawide') ), timer(4000) ); 
//    ( get_ms === 0 ) && ( $('html').hasClass('fullplayer') || 
//		    ( fullWWidth < pageExWide ? ( fullWWidth < pageWide ? ( fullWWidth < pageNormal ? fn_choice('orginal') : fn_choice('normal') ) : fn_choice('wide') ) : fn_choice('extrawide') ), timer(4000) ); 
    
    l('load '+thisSwitch, performance.now() - ktime );
}

function fn_arrayElemExistsInDom(array){
	var found = false;
	jQuery.each( array, function( i, value ) {
		$( value ).length && ( found = true );
		
	});
	c.i('found',found)
	return found;
}

function fn_ClickMenu(){
	function menu(){
		
		var menuHtml, menueCss, tag = 0,
			tagArr = ['#gplayer','.fluid-width-video-wrapper iframe','.fluid-width-video-wrapper object','.fluid-width-video-wrapper embed','.player .jwplayer','.fluid-width-video-wrapper video','.entry-content.rich-content iframe','#Full-HD iframe'],
			tag = fn_arrayElemExistsInDom(tagArr); 
	
		menueCss =
			'#ClickMenu {'	
		+		'width: 130px;'
		+		'position: fixed;'
		+		'background-color: darkgray;'
		+		'border: 1px black solid;'
		+		'padding-top: 5px;'
		+		'opacity: 0.8;'    
		+		'}'
		+	'.UI_choice {'	
		+		'width: calc(100% - 10px);'
		+		'background-color: lightgray;'    
		+		'line-height: 30px;'
		+		'height: 30px;'
		+		'margin: 0 auto 5px;'
		+		'text-align: center;'
		+		'cursor: pointer;'
		+		'font-weight: bold;'
		+		'}'
		+	'.UI_choice:hover {'
		+		'background-color: rgb(255, 252, 225);' 
		+		'color: darkred;'
		+		'}';

		menuHtml =
			'<ul id="ClickMenu" style="display:none;">';

		menuHtml += ( ( tag === false ) || $('.wp-pagenavi').length > 0 ) ?    
				'<li class="UI_choice 6" data-state="next">Next Page</li>'
		+		'<li class="UI_choice 7" data-state="prev">Prev Page</li>' : ' ';

		menuHtml += tag ? 
				'<li class="UI_choice 1" data-state="big">Big</li>': ' ';
	//    +		'<li class="UI_choice 8" data-state="reload">Reload</li>': ' ';

		menuHtml +=        
				'<li class="UI_choice 2" data-state="wide">Wide</li>'
		+		'<li class="UI_choice 3" data-state="normal">Normal</li>'
		+		'<li class="UI_choice 4" data-state="orginal">Orginal</li>'
		+		'<li class="UI_choice 4" data-state="extrawide">Extra Wide</li>'
		+		'<li class="UI_choice 5" data-state="#main h2">Scroll Title</li>';

		menuHtml += tag ?    
				'<li class="UI_choice 5" data-state="#main #content">Scroll Video</li>'
		+		'<li class="UI_choice 5" data-state="#relatedVideosWithMore">Scroll Related</li>'
		+		( $( '#gplayer' ).size() === 0 ? '<li id="#gplayer" style="display:none;" class="UI_choice 5" data-state="#dp-widget-posts-3">Scroll Being Watch</li>' : ' ' ): ' ';

		menuHtml +=
			'</ul>';

		$( '#styleClickMenu' ).html( menueCss.formatString() );
		
		$( menuHtml ).appendTo('body'); 
	}
    
    //var chkClickMenu = setInterval(function(){ $('#ClickMenu').size() === 0 ? $( menuHtml ).appendTo('body') : clearInterval(chkClickMenu); },12800000);
    
    $( '#ClickMenu' ).waitUntilExists(function() {         
        $( '.UI_choice.1, .UI_choice.2, .UI_choice.3, .UI_choice.4, .UI_choice.5, .UI_choice.6, .UI_choice.7, .UI_choice.8' ).on('mouseup',function(e){
            var state, getIt;
            e.target == this && e.which == 1 && (
                state = $(this).data('state'),
                getIt = GM_getValue( 'tubenn_Scroll' ) == 'undefined' || GM_getValue( 'tubenn_Scroll' ) === undefined ? "#page" : GM_getValue( 'tubenn_Scroll' ),
                $('#ClickMenu').hide(),
                $( this ).hasClass('5') ? (
                    ScrollZoomTune( state, 1, -2, 1, 'slow'), GM_setValue( 'tubenn_Scroll', state ) ) : $( this ).hasClass('8') ? ( fn_choice('reload') ) : ( fn_choice( state ), ScrollZoomTune( getIt, 1, -2, 1, 'slow') ) );
        });        
        $('#ClickMenu').on('mouseleave',function(){
            $('#ClickMenu').hide();
	    });        
    });
    
	$(document).on('click','.wrap.cf, #main, body',function(e){
        ( e.target == this && e.which == 1 ) &&
            ( $('html').hasClass('fullplayer') === false ? (
				$('#ClickMenu').size() === 0 && menu(),
                $('#ClickMenu').css('cssText', 'left: '+( e.clientX - 50 )+'px; top: '+( e.clientY - 12 )+'px; display:block;' ) ) : fn_choice('esc') );
    });
}

docLoc.search('/porn-categories') == -1 && setTimeout(function(){ fn_ClickMenu(); },1000);
 
//l('UI_state', GM_getValue( 'tubenn' ) );

//	l('tubenn_playerState', GM_getValue( 'tubenn_playerState') ); 
//( GM_getValue( 'tubenn_playerState' ) < 1 ) && ( GM_setValue( 'tubenn_playerState', $('#gplayer, .entry-content.rich-content iframe, #details iframe').size() ) );
//	l('tubenn_playerState', GM_getValue( 'tubenn_playerState') ); 


setTimeout(function(){ 
    fn_choice('wide');
//    fn_choice( UI_state ); 
},128); 

document.addEventListener('keydown', function(e) {
    
    if( $('input').is(':focus') ) return false;
    
	var keyCode = e.keyCode;
    l('key',keyCode,1);   
//    ktime = performance.now();
    
    if ( keyCode == 27) { fn_choice('esc'); }					//esc       

    else if ( keyCode == 66) { fn_choice('big'); }				//b        

    else if ( keyCode == 78) { fn_choice('normal'); }			//n

    else if ( keyCode == 87) { fn_choice('wide'); }			//w

    else if ( keyCode == 69) { fn_choice('extrawide'); }		//e

    else if ( keyCode == 79) { fn_choice('orginal'); }			//O
    
    else if ( keyCode == 82) 
    {
        GM_deleteValue( 'tubenn' ); 
        GM_deleteValue( 'tubenn_big' ); 
        GM_deleteValue( 'tubenn_List' );
    }															//R
        
    else if (keyCode == 39) { fn_choice('next'); }			//next
        
    else if (keyCode == 37) { fn_choice('prev'); }	  		//Prev
        
}, false);









$(document).on('click','*',function(e){ 
    this == e.target && console.log('target',e.target); });
