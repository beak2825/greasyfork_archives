// ==UserScript==
// @name       www.hardsextube.com
// @namespace  http://use.i.E.your.homepage/
// @version    0.25
// @description  Changeing video and thumb size - dynamicaly, little key navigation. 
// @match      http://www.hardsextube.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/8005/wwwhardsextubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/8005/wwwhardsextubecom.meta.js
// ==/UserScript==

/*jshint -W014, -W030*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression

(function($){
    
    String.prototype.formatString = function(){ 
        return this.toString()
                    .split(/\s+/g).join(' ')
                    .split('{').join('{\n\t')
                    .split('; ').join(';')
                    .split(';').join(';\n\t')
                    .split('*/').join('*/\n')
                    .split('}').join('}\n'); 
    };

	//---------------------------------------------------------------------------------------------------     
		var mainWidth = 1400;    
	//--------------------------------------------------------------------------------------------------- 
    
    $('<style id="basic"></style>' +
      '<style id="reSize"></style>' +
      '<style id="fullplayer"></style>').appendTo('head');
    
    function fn_Basic()
    {
        $('.container.video-page > .row:not(:nth-child(3))').addClass('fullhide');
        
        $('.pagination').size() > 0 && $('.pagination').find('.btn-secondary').each(function(id,elem){
            $( elem ).addClass( id === 0 ? 'prev':'next' ); });
        
        $( '#basic' ).html(	
            '.video-items-feed .advertisement, .video-items-feed .feature-block, .right-col.right {'
          +		'display: none;'
          +		'}'
          +	'.main-bg-image, .master-footer:before, body:before {'
          +		'height: initial;'
          +		'}'
          +	'.video-page .video-player-wrap {'
          +		'padding-bottom: 15px;'
          +		'}'
          +	'.video-page .video-player-wrap .video-player>object {'
          +		'width: inherit;'
          +		'height: inherit;'
          +		'}'
          +	'.video-item>a .video-thumb, '
          + '.video-page .related-content .video-items-feed.video-items-xs .video-item .video-thumb {'
          +		'height: inherit;'
          +		'}'
          + '.channel-items-feed, .pornstars-page .pornstars-item-feed-center .pornstar-items-feed, .video-items-feed {'
          +		'margin: 0 -12px;'
          +		'}'
          +	'.video-page .video-player-wrap .video-action-buttons .btn.share-btn {'
          +		'width: 17%;'
          +		'}'.formatString() );
    }

    function fn_reSize(inputWidth)
    {
        var reSizeCss,
            windowWidth = $( window ).width(),
            fullplayer  = $('html').hasClass('fullplayer'),
            pageWidth   = fullplayer ? $( window ).width() - 20 : inputWidth !== undefined ? inputWidth : ( windowWidth < mainWidth ? ( windowWidth - 40 < 1300 ? 1300 : windowWidth - 40 ) : mainWidth ),
            pageHeight  = fullplayer ? $( window ).height() - 40 + 'px' : 'calc(('+pageWidth+'px - 20px) * (546/728))';
        
        reSizeCss =
        	'.container.video-page, .channel-items-feed-center, .pornstars-page .pornstars-item-feed-center, .videos-item-feed-center {'
        +		'width: '+pageWidth+'px !important;'
        +		'max-width: '+pageWidth+'px !important;'
        +		'}';
       
        !fullplayer ? reSizeCss +=
        	'.video-page .video-player-wrap, .video-page .video-player-wrap .video-player {'
        +		'width: calc('+pageWidth+'px - 20px);'
        +		'}'
        +	'.video-page .video-player-wrap .video-player {'
        +		'height: '+pageHeight+';'
        +		'}'    
        +	'.pornstars-page .pornstar, .video-item, '
        +	'.video-page .related-content .video-items-feed.video-items-xs .video-item {'
        +		'width: calc('+pageWidth+'px / 5 - 13px);'
        +		'}' 
        : ( $('.video-page .video-player-wrap, .video-page .video-player-wrap .video-player').css('width','calc('+pageWidth+'px - 20px)'),
        	$('.video-page .video-player-wrap .video-player').css('height', pageHeight ) );
        
        $( '#reSize' ).html( reSizeCss.formatString() );
    } 
    
    function fn_fullplayer()
    {
        $( 'html' ).addClass( 'fullplayer' );  
        
        $( '#fullplayer' ).html( 
            'header, .row.fullhide, .video-action-buttons, .videos-item-feed-center, footer.master-footer {'
        +		'display: none;'
        +		'}'
        +	'#wrapper {'
        +		'padding-top: 0;'
        +		'}'
        +	'#content {'
        +		'padding: 10px 0px;'
        +		'}'
        +	'.video-page .video-player-wrap {'
        +		'padding-bottom: 0px;'
        +		'margin-bottom: 0px;'
        +		'}'
        +	'body {'
        +		'overflow: hidden;'
        +		'}'.formatString() );
    }
    
    GM_setValue( 'ms', 0 );
    function fn_timer(ms)
    {
        GM_setValue( 'ms', ms ); 
        setTimeout(function(){ GM_setValue( 'ms', 0 ); },ms);
    } 
    
    function fn_choice( thisUI )
    {
        var clearCssList = ['orginal','normal','wide','extrawide'],
            UIlist = ['normal','wide','extrawide','esc','sidebar'],
            setListYes = 1,
            setVideoYes = 1,
            get_ms;

        $.inArray( thisUI, clearCssList ) > -1 && $("style#fullplayer, style#playerWidth, style#CssBasic").empty();              
        
        switch( thisUI )
        {
            case 'orginal':
                $( '.single .video' ).removeClass('state');
                break;
            case 'normal':            
                fn_reSize();
                break;
            case 'wide':
                fn_reSize(wideWidth);
                break;
            case 'extrawide':
                fn_reSize(xtraWidth);            
                break;
            case 'big':            
                if( $('.paginator').size() > 0 ) return false;                      
                GM_setValue( 'drtube_big', $('.wrapper').width() );            
                fn_reSize();
                fn_fullPlayer();
                setListYes = 0;
                break;
            case 'next':
                $('.pagination .next').size() > 0 && ( window.location.href = $('.pagination .next').attr('href') );
                setListYes = 0;
                setVideoYes = 0;            
                break;
            case 'prev':
                $('.pagination .prev').size() > 0 && ( window.location.href = $('.pagination .prev').attr('href') );
                setListYes = 0;
                setVideoYes = 0;            
                break;            
            case 'esc':
                if( $('html').hasClass('fullplayer') === false ) return false;            
                $( 'html' ).removeClass( 'fullplayer' );
                $( "style#fullplayerCss" ).empty();
                setListYes = 0;
                setVideoYes = 0;
                
                var gotWidth = GM_getValue( 'drtube_big' );
                start == 1 && ( start = 0, gotWidth = defaultEsc );
                fn_timer( 1000 );
                
                gotWidth <  mainWidth	? 	( fn_choice('orginal') 		):
                gotWidth == mainWidth	? 	( fn_choice('normal') 		):
                gotWidth == wideWidth	? 	( fn_choice('wide') 		):
                gotWidth == xtraWidth	&& 	( fn_choice('extrawide') 	);            
                break;
        }   
                      
//        $.inArray( thisUI, UIlist ) > -1 && fn_playerWidth( $('.video_content2.fleft').width() );    
//        ( GM_getValue('ms') === 0 ) && setVideoYes == 1 && ( $('embed#playeradx').size() > 0 ? GM_setValue( 'drtube', thisUI ) : GM_setValue( 'drtube_List', thisUI ) );
    }
        
    document.addEventListener('keydown', function(e) {
        
//        l('key',e.keyCode,4);
//		  ktime = performance.now();
        
        var ui,
            key = e.keyCode,
            disabled = [27,66,78,87,69,79,82];
        
        if( $.inArray( key , disabled ) > -1 ) { return false; }
        
        ui = key == 27	? 	'esc' 		:		//esc 
        	 key == 66	? 	'big' 		: 		//b
        	 key == 78	? 	'normal' 	: 		//n
        	 key == 87	? 	'wide' 		: 		//w
        	 key == 69	? 	'extrawide' : 		//e
        	 key == 79	? 	'orginal' 	: 		//o
        	 key == 82	? 	'reset' 	: 		//r
             key == 39	? 	'next' 		: 		//next
        	 key == 37	&& 	'prev' 		; 		//prev

         fn_choice( ui ); 

    }, false);
    
    fn_Basic();
    $( '.video-page .video-player-wrap .video-player' ).size() == 1 && fn_fullplayer();
    fn_reSize();
    
    $( window ).resize(function(){ fn_reSize(); });   

    $( document ).on( 'mouseup', '#content, .col-md-12', function(e){
        ( e.target == this && e.which == 1 ) && $( '.video-page .video-player-wrap .video-player' ).size() == 1 && (
            $( 'html' ).hasClass( 'fullplayer' ) ? ( 
                $('.video-page .video-player-wrap, .video-page .video-player-wrap .video-player, .video-page .video-player-wrap .video-player').css('width','').css('height',''),
                $( 'html' ).removeClass( 'fullplayer' ), $( '#fullplayer' ).empty() ) : fn_fullplayer(), fn_reSize() ); 
    });    
    
	$( document ).on( 'click', '*', function(e){ this == e.target && console.log( 'target', e.target ); });
    
}(jQuery));


    // $('.container.video-page > .row').each( function( id, elem ) { id !== 2 && $( elem ).addClass('fullhide'); });
    





