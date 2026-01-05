// ==UserScript==
// @name       X-Hamster
// @namespace  http://use.i.E.your.homepage/
// @version    0.4001
// @description  Keyboard driven changing layout, full browser player with ability to re-size, remove auto-play, auto-scroll to video, bigger thumbs
// @match      *://xhamster.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @require    https://greasyfork.org/scripts/6882-riklomas-jquery-quicksearch/code/riklomasjqueryquicksearch.js?version=27465
// @require    https://greasyfork.org/scripts/6881-wait-until-exists-version-v0-2/code/Wait%20Until%20Exists%20Version%20v02.js?version=27464
// @require    https://greasyfork.org/scripts/6883-tinysort-tsort/code/TinySorttsort.js?version=27466

// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_deleteValue
// @grant      GM_log

// @run-at     document-start

// @copyright  2014+, You
// @downloadURL https://update.greasyfork.org/scripts/6885/X-Hamster.user.js
// @updateURL https://update.greasyfork.org/scripts/6885/X-Hamster.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W082,a function declaration inside a block statement

function l(name,func)
{ 
    console.log( name, func !== undefined ? func : '' ); 
}

(function ($) {
    
    $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) 
    {
        var found  = 'found',
        $this	   = $(this.selector),
        $elements  = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);

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

//ScrollZoomTune("div.thumb .title a",1,-25,1,'slow');
function ScrollZoomTune(selection, zomms, tune, ani, speed)
{
    $('body').css('zoom',zomms);
    
    var position = $( selection ).position();
    position = position.top + tune;
    
    if( ani == 1 ){
        $('body').animate({ scrollTop: position * zomms }, speed); }
    else {
        $('body').scrollTop( position * zomms );
    }
}

String.prototype.formatString = function(){ 
    return this.toString()
                .split(/\s+/g).join(' ')
                .split('{').join('{\n\t')
                .split('; ').join(';')
                .split(';').join(';\n\t')
                .split('*/').join('*/\n')
                .split('}').join('}\n'); 
};

function refreshElement( elem , speed ) //refreshElement('.videoPlayer','slow');
{
    var data = $( elem ).html();
    $( elem ).empty().html( data ).fadeIn( speed );
}   
 
$( '#player object' ).waitUntilExists(function(){
    
    if( $( this ).hasClass('donne') ) return false;
    $( this ).addClass('donne');
    
    var flashvar = $( '#player object param[name=flashvars]' ).attr('value');     
    $( '#player object param[name=flashvars]' ).attr('value',flashvar.replace("&autostart=true&","&autostart=false&autoload=true&"));
    
    setTimeout(function(){
    	refreshElement( '#player', 128 );
        ScrollZoomTune("#content",1,5,1,'slow');
        $( '#player' ).on('mousedown', function(){
            $( '#player' ).addClass('clicked');
        });
    },128);    
});

function RefreshButton()
{
    var newRefreshButtonCss, newRefreshButton = ' '
	+	'<div class="RefreshButton">'
	+		'<div class="wrap"></div>'
        +	'</div>';
    
    newRefreshButtonCss = ' '
	+	' .RefreshButton {'
	+		' position: relative;'
	+		' height: 27px;'
	+		' margin-top: -28px;'
        +		' }'
	+	' .RefreshButton .wrap {'
	+		' position: absolute;'
	+		' height: inherit;'
	+		' width: 17px;'
	+		' right: 0px;'
	+		' zoom: 1.8;'
	+		' top: 0px;'
	+		' background-image: url(http://eu-st.xhamster.com/images/tpl2/icons.png?5);'
	+		' background-position: 1px -51px;'
        +		' cursor: pointer;'
	+		' }'
        +	' .RefreshButton .wrap:hover {'
	+		' background-position: -15px -51px;'
	+		' }';
    
    $("style#tamper").append( newRefreshButtonCss.formatString() );    
   
    setTimeout(function(){
        $( "#playerBox .head.gr" ).append( newRefreshButton ); 
        $( '.RefreshButton .wrap' ).on('click',function(){
            refreshElement( '#player', 250 );    
        });
    },250);    
}

function searchMenue()
{
    $( "#searchFrom > div:nth-child(6)" ).insertAfter( "#searchFrom .menu2" );
    
    var newSearchMenue = ' '
	+	'<div class="box">'
	+		'<div class="head gr">Filter Search</div>'
	+		'<div class="boxC radio" style="height: 105px">'
	+			'<label class="sel"><input type="radio" name="unFiltered" value="" checked=""> Unfiltered</label>'
	+			'<label class=""><input type="radio" name="exactMatch" value=""> Exact Match</label>'
	+			'<label><input type="radio" name="filterMore" value=""> Filter More<div id="searhthis" style="margin-top:10px;">'
        +                              '<input id="sub_search"></div></label>'
	+		'</div>'
	+	'</div>';
    $( "#searchFrom .menu2" ).after( newSearchMenue ); 
    
    $("#sub_search, #searchRes2 > div.box > div.boxC > table > tbody > tr > td > div:nth-child(2) > u").on("change keyup paste", function(){
        
        $('input#sub_search').quicksearch('.video');        
        var newinputtext = $( '#sub_search' ).val();
        $.cookie( "inputtext", newinputtext );
	});     
}

function resize( newWidth )
{
     var newResize =
         '.main, table#content, #playerBox, #commentBox, #related, #playerBox, #commentBox, #related {'
    +		' width: '+newWidth+'px !important;'
    +		' }'
    +	'#player, #player object, #player .noFlash, #playerSwf, .noFlash, video, .mp4Thumb, .mp4Thumb img {'
    +		' width: 100%;'
    +		' height: calc( ('+newWidth+'px - 20px) * (10/16)) !important;'
    +		' }';   
    
    $('#cssResize').empty().append( newResize.formatString() );  
}

function fullPlayer(){
      
    var cssfullPlayer =
        '#header, #content tr:nth-child(2), #commentBox, .tools, #videoInfoBox, .head.gr, #footer {'
    +		' display: none !important;'
    +		' }'
    +	' #content {'
    +		' margin-top: 0px;'
    +		' }'
    +	' body {'
    +		' overflow: hidden;'
    +		' }';
    
    $('#cssfullPlayer').empty().append( cssfullPlayer.formatString() );
     
    resize( $( window ).width() );
    
    if( $('#player').hasClass('clicked') === false )
    {
        refreshElement('#player','fast');
    }   
    
    ScrollZoomTune("#content",1,-10,1,'slow');
}

$( window ).resize(function()
{
    if( $('html').hasClass('fullplayer') )
    {
        resize( $( this ).width() );
    }
    
    if( $('#player').hasClass('clicked') === false )
    {
        refreshElement('#player','fast');
    }
    
});

function movies( newWidth ){
    
    var newRulesSortMenue =
    	'#idxFeach {'
    +		' display: none !important;'
    +		' }'
    +	'.adVideo2 {'
    +		' display: none;'
    +		' }'
    +	' table#header {'
    +		' width: 1000px;'
    +		' margin: auto;'
    +		' }';
    
    resize(newWidth);
    
    newRulesSortMenue +=
		'#playerBox .boxC {'
	+		' box-sizing: border-box;'
	+		' padding-right: 18px;'
	+		' }'
	+	'.tools {'
	+		' width: 100%;'
	+		' }'
	+	'#videoInfoBox {'
	+		' width: calc(100% - 12px);'
	+		' }'
	+	'.box .line, .box .lineS {'
	+		' width: calc(100% + 18px);'
	+		' }'
	+	'.tabs {'
	+		' width: inherit;'
	+		' }'
	+	'.tabs .content {'
	+		' max-width: none;'
	+		' width: 100%;'
	+		' }'
        +	'#related .tab {'
	+		' width: 100%;'
	+		' }'
	+	'#relatedVid, #relatedVid table {'
	+		' width: inherit;'
	+		' }'
	+	'#relatedVidList {'
	+		' width: inherit;'
	+		' height: initial;'
	+		' }'
	+	'.video {'
        +		' width: calc(100% / 5 - 18px);'
	+		' height: 100%;'
	+		' display: inline-table; }'
	+	'.video a {'
	+		' width: 100%;'
	+		' }'
	+	'.video .thumb {'
	+		' width: inherit;' 
	+		' height: initial;'
	+		' }'
	+	'.video b, .video .hPaid {'
	+		' top: calc(100% - 72px);'
	+		' left: calc( 100% - 38px);'
	+		' }'
	+	'.video u {'
	+		' height: 30px;'
	+		' }'
	+	'#relatedVid .arrowL, #relatedVid .arrowR {'
	+		' vertical-align: initial;'
	+		' }'
        +	'#relatedVid .arrowR a, #relatedVid .arrowL a {'
	+		' margin-top: 0px;'
	+		' }';
    $("style#tamper").append( newRulesSortMenue.formatString() );  
    
    $(' #relatedVid').hide();
    setTimeout(function(){    
        var hh = $('#relatedVidList .video').width() - 1; l( 'hh', hh );
        hh = hh / 160; l( 'hh', hh );
        
        newRulesSortMenue = ' '
        +	'.video .hSprite {'
        +		' transform: scale('+ hh +');'
        +		' transform-origin: 1px 1px;'
        +		' }';
        $("style#tamper").append( newRulesSortMenue.formatString() );
    },10);    
    setTimeout(function(){
        newRulesSortMenue = ' '
        +	' #relatedVid .arrowL, #relatedVid .arrowR {'
        +		' padding-top: calc('+ $('#relatedVid table').height() +'px / 2 - 49px);'
        +		' }';
        $("style#tamper").append( newRulesSortMenue.formatString() );  
        
        
    },500);
    
    refreshElement( '#relatedVid', 1);
    $(' #relatedVid').show();
}

function basic(){
    
    var newRulesSortMenue = ' '
	+	'.clear {'
	+		' display: none;'
	+		' }'
	+	'.video {'
	+		' height: 240px;'
	+		' max-height: none;'
	+		' width: 245px;'
	+		' }'
	+	'#searchResR, .video .xhSprite {'
	+		' display: none;'
	+		' }'
	+	'.video .thumb, .video .hSprite {'
	+		' zoom: 1.53 !important;'
	+		' }'
	+	'.video b, .video .hPaid {'
	+		' top: 166px;'
	+		' color: antiquewhite;'
	+		' background: rgba(139, 0, 0, 0.45);'
	+		' }';           
    $("style#tamper").append( newRulesSortMenue.formatString() );   
}

function search(){

        $('.main').css('cssText','width: 1507px;'); 
        $('#searchFrom, #searchMenu').css('cssText','width: 222px;');
    
        searchMenue(); 
    
        console.log('searchMenuNew');

}

function channel(){

    $('.main').css('cssText','width: 1422px;'); 
    $(".pager").before('<div class="clear" style="display: block;"></div>');
    
}

function preSorter(){
    
    if( !$('.boxTL .boxC>div').hasClass('sortedBYme') )
    {        
        var counter = 1;
        $('.boxTL .boxC>div').each(function(counter)
        {            
            $( this ).addClass('sortedBYme');
            $( this ).attr( 'data-SortCounts', counter );
            $( this ).attr( 'data-SortLength', $( this ).find('b').text() );
            counter++;              
        });    
    }
}

function pager(){
    
    $(".boxTL .boxC>div.pager").attr('id','pager-bottom');
    $(".box.boxTL .boxC").attr('id','target-GPM');

    $( "#pager-bottom" ).insertAfter( $( "#target-GPM" ) );
    
    var field1 = $('#pager-bottom').clone();
    field1.attr('id','pager-top');
    field1.insertBefore( $( "#target-GPM" ) );
    
    $( "#pager-top, #pager-bottom" ).css('cssText','width: 1277px; margin-left: 0px; padding-bottom: 10px; ');
    
}

function SizeDate(){
      
    var newButtonsMenue = '', sortOrder = '', buttonToSelect = GM_getValue( "newSizeDate" );
    
    newButtonsMenue = 
        '<a id="sortbydate" class="sel">Date</a>' +
	'<a id="sortbylength" class="">Length</a>';        
    $( "div.btnsRight" ).append( newButtonsMenue ); 
    $( ".box .head .btnsBetween" ).append( newButtonsMenue ); 

        
    function selButton(){
        
        console.log('buttonToSelect',buttonToSelect);
        
        if ( buttonToSelect == 'date' ){
            sortOrder = 'asc';
            $('#sortbylength').removeClass('sel');
            $('#sortbydate').addClass('sel');
            $('.vDate, .fl').css('cssText','display: block;');
            pager();
            preSorter();
            $('.boxTL .boxC>div').tsort({attr:'data-SortCounts', order: sortOrder });
        } else if ( buttonToSelect == 'lenght' ){
            sortOrder = 'decs';
            $('#sortbydate').removeClass('sel');
            $('#sortbylength').addClass('sel');
            $('.vDate, .fl').css('cssText','display: none;');
            pager();
            preSorter();
            $('.boxTL .boxC>div').tsort({attr:'data-SortLength', order: sortOrder });
        } else {
            buttonToSelect = 'lenght';
            selButton();
        }
    }
    
    selButton();
    
    $('#sortbydate').on('click', function(){
        var newSizeDate = 'date',sortOrder = 'asc';
        $('#sortbylength').removeClass('sel');
        $('#sortbydate').addClass('sel');
        $('.vDate, .fl').css('cssText','display: block;');
        GM_setValue( "newSizeDate", newSizeDate );
        //$.cookie( "newSizeDate", newSizeDate );
        $('.boxTL .boxC>div').tsort({attr:'data-SortCounts', order: sortOrder });
    });

    $('#sortbylength').on('click', function(){
        var newSizeDate = 'lenght',sortOrder = 'decs';
        $('#sortbydate').removeClass('sel');
        $('#sortbylength').addClass('sel');
        $('.vDate, .fl').css('cssText','display: none;');
        GM_setValue( "newSizeDate", newSizeDate );
        //$.cookie( "newSizeDate", newSizeDate );
        $('.boxTL .boxC>div').tsort({attr:'data-SortLength', order: sortOrder });
    });

}
document.addEventListener('keydown', function(e) {
           
    if (e.keyCode == 27) { //esc
        if( $('html').hasClass('fullplayer') === false ) return false;
        
        $('html').removeClass('fullplayer');
        $("style#cssfullPlayer").empty();
        
        resize(1450);
        
        if( $('#player').hasClass('clicked') === false )
        {
            refreshElement('#player','fast');
        }  
        
        ScrollZoomTune("#content",1,5,1,'slow');
    }
    else if (e.keyCode == 66) { //b
        if( $('html').hasClass('fullplayer') ) return false;
        $('html').addClass('fullplayer');
        fullPlayer();
    }
        
/*    else if (e.keyCode == 76) { //L
        
    }
    else if (e.keyCode == 78) { //n
        t_PW = t_normal;
        fn_init();
	fn_playerWidth( t_PW );
        GM_setValue('likuoo_PW', t_PW);
        ScrollZoomTune("#container",1,-25,1,'slow');
    }
    else if (e.keyCode == 87) { //w
        t_PW = t_wide;
        fn_init();
	fn_playerWidth( t_PW );
        GM_setValue('likuoo_PW', t_PW);
        ScrollZoomTune("#container",1,-25,1,'slow');
    }
    else if (e.keyCode == 79) { //O
        GM_setValue('likuoo_PW', 655);
        $("style#fullplayer, style#playerWidth, style#CssBasic").empty();
    }*/
}, false);

waitUntilExists(document,function(){

    var astr = window.location.href,
        ares = astr.split("/"),
        Wait_search,
        ch;
    
    console.log('astr',astr);console.log('ares',ares);

	$('<style id="tamper"></style><style id="cssfullPlayer"></style><style id="cssResize"></style>').appendTo('head');

    if ( astr == 'http://xhamster.com/' ||  astr == 'https://xhamster.com/' )
    {        
        $('div#vPromo, div#idxFeach').css('margin-top','40px');
        console.log('root');
    }
    else if ( ares[3] == 'movies' )
    {   
        movies(1450);
        RefreshButton();
        console.log('movies');
        //wideVideo();
    }
    else if ( ares[3] == 'user' )
    {    
        if ( ares[4] !== 'video' )
        { 
            userProfile(); 
        }  
        else if ( ares[4] == 'video' )
        { 
            channel(); 
        } 
    } 
    else if ( ares[3].substring(0,6) == 'search' )
    {           
        function Wait_search(){
            
            if( $('#searchFrom').size() >  0 ){
                basic();
                search();                
            } else {
                console.log('Wait_search');
                setTimeout(function(){
                    Wait_search();
                },25);
            }
        } 
        Wait_search();
        
        var arrayQuery = astr.split("?"); 
        arrayQuery = arrayQuery[1].split("&");												
        
        $.each(arrayQuery, function(Index, value)
        {        
            if( value.substring(0,1) === 'q' && value.substring(0,4) != 'qcat') 
            {                
                var searchQuery = value.split("=");
                if ( searchQuery[1] == GM_getValue("searchQuery") ) 
                {
                       var inputtext = GM_getValue("inputtext");									
                       $('input#sub_search').val( inputtext ).focus();
                } 
                else if ( searchQuery[1] != GM_getValue("searchQuery") ) 
                {																			
		        GM_setValue( "searchQuery", searchQuery[1] );
			$('input#sub_search').focus();                
                }
            }
        });
    }
    else if ( ares[3] == 'photos' && ares[4] == 'view')
    {        
        document.addEventListener('keydown', function(e) {
            GM_log(e.keyCode);
            if (e.keyCode == 37) {
                slide.showPrev(true);
                $("a.prev").click();
            }
            if (e.keyCode == 39) {
                slide.showNext(true);
                $("a.next").click();
            }
        }, false);
            
        console.log('ViewPhotos');        
     } 
     else if ( ares[3] == 'photos' || ares[3] == 'channels' || ares[3] == 'new')
     {
         function ch(){
             console.log('#main',$('#main').size());
             if( $('#main').size() >  0 ){
                 basic();        
                 channel();
                 SizeDate();
             } else {
                 setTimeout(function(){
                     ch();
                 },10);
             }
         }
         
         ch();
         
         if ( ares[3] == 'photos'){
             photo();
         }    
         console.log('pcn');  
     } 
     else 
     {        
         channel();        
     }    

        
});














