/// ==UserScript==
// @name			vk.com
// @namespace		http://use.i.E.your.homepage/
// @version			0.25
// @description     Layout Design - bigger video and thumbs and Info on precent video and some navigation  

// @match			*vk.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require 		https://greasyfork.org/scripts/386-waituntilexists/code/waitUntilExists.js?version=5026
// @require			http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue

// @created			2014-09-27
// @released		2014-00-00
// @updated			2014-00-00
// @history         @version 0.25 - first version: @released - 2015-02-11

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @copyright		2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/8008/vkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/8008/vkcom.meta.js
// ==/UserScript==

/*global $, jQuery*/
/*jshint -W014, -W030*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression

//-----------------------------------------------------------------------------------------------------------------------------------------

(function ($) {
    
    var timeThis = performance.now(),
        mainWidth = 1357,
        lstate = 0;
    
    function l( name, fn, showthis ){  if( showthis == 1 || lstate == showthis ) console.log( name, fn !== undefined ? fn : '' );  }
    
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
    
    $( '<style id="InsertCssZoom"></style>' +
       '<style id="InsertCssBasic"></style>' +
       '<style id="inputPopupCss" ></style>' ).appendTo('head');
        
    function refreshElement( elem , speed ) //refreshElement('.videoPlayer','slow');
    {
        var data = $( elem ).html();
        $( elem ).hide().html( data ).fadeIn( speed );
    }
    
    function playerSize()
    {
        var sideWidth = 120,
            ContWidth = 1500,
            
            bodyWidth0 = window.innerWidth - sideWidth,
            bodyWidth1 = bodyWidth0 > ContWidth ? ContWidth : bodyWidth0,
            zoomWidth0 = bodyWidth1 / $('#video_player').width(),
            
            zoomWidth = zoomWidth0 < 1 ? 1 : zoomWidth0;
        
        $( '#InsertCssZoom' ).text( '#video_player { zoom:' + zoomWidth + '; }' );
    }
    
    function init(input)
    {
        var InsertCssBasic, insertReload, newWidth, divider, insertThis;
        
        insertReload = 
    //        '<div class="divider fl_r">|</div>' +
            '<div id="NormalizeThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="mv_top_button fl_r">Normalize</div>' +
            '<div id="MaximizeThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="mv_top_button fl_r">Maximize</div>' +
            '<div class="divider fl_r">|</div>' +
            '<div id="reloadThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="mv_top_button fl_r">Reload</div>' +
            '<div class="divider fl_r">|</div>' +
            '<div id="ChangeThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="mv_top_button fl_r">Change Title</div>';
        
    //    $( insertReload ).appendTo('#mv_top_controls');
    //    $( insertReload ).insertAfter('.mv_share_actions.fl_l .fl_r .mv_views_count.fl_r');
    
        insertThis = setInterval(function(){ $('.mv_info_block.fl_l').size() !== 0 && $('#NormalizeThis').size() === 0 && ( $( insertReload ).appendTo('.mv_info_block.fl_l'), clearInterval(insertThis) ); },8);
        
        divider = 4;
        newWidth = input !== undefined ? input : mainWidth;
        InsertCssBasic = 
            '.mv_cont {'
        +	'	top: 30px !important;'
        +	'	}'
        +	'#mv_box {'
        +	'	background: #232430;'
        +	'	}'
        +	'.mv_top_button {'
        +	'	background: transparent;'
        +	'	color: rgb(119, 119, 119);'
        +	'	margin-top: -4px;'
        +	'	}'
        +	'.video_box_wrap {'
        +	'	width: initial !important;'
        +	'	height: initial !important;'
        +	'	}'
        +	'#mv_min_layer {'
        +	'	width: calc(100% - 250px);'
        +	'	}'
        +	'#mv_min_title {'
        +	'	max-width: 100% !important;'
        +	'	}'
        +	'#mv_title {'
        +	'	width: 100%;'
        +	'	max-width: 100%;'
        +	'	}'
        +	'#mv_min_title:hover, .mv_top_button:hover {'
        +	'	cursor: pointer;'
        +	'	color: rgb(7, 7, 207) !important;'
        +	'	}'
        +	'.fl_r.mv_title_panel {'
        +	'	width: calc(100% - 65px);'
        +	'	}'
        +	'.mv_info_block.fl_l {'
        +	'	width: 100%;'
        +	'	}'
        
        +	'#page_layout {'
        +	'	width: '+newWidth+'px !important;'
        +	'	}'
        
        +	'#page_body {'
        +	'	width: calc(100% - 165px) !important;'
        +	'	}'
        +	'.video_compact_view #choose_video_rows .video_row, .video_compact_view #video_rows .video_row, '
        +	'.video_compact_view #video_search_rows .video_row, .video_compact_view .search_media_rows.video_type .video_row {'
        +	'	height: initial;'
        +	'	margin-bottom: 20px;'
        +	'	width: calc(('+newWidth+'px - 165px) / '+divider+' - 23px);'
        +	'	}'
        +	'.video_compact_view #choose_video_rows .video_row_thumb, .video_compact_view #video_rows .video_row_thumb, '
        +	'.video_compact_view #video_search_rows .video_row_thumb, .video_compact_view .search_media_rows.video_type .video_row_thumb, '
        +	'.video_compact_view #choose_video_rows .video_image_div, .video_compact_view .search_media_rows.video_type .video_image_div, '
        +	'.video_compact_view #video_rows .video_image_div, .video_compact_view #video_search_rows .video_image_div {'
        +	'	width: inherit;'
        +	'	}'
        +	'.video_compact_view #choose_video_rows .video_image_div, .video_compact_view #video_rows .video_image_div, '
        +	'.video_compact_view #video_search_rows .video_image_div, .video_compact_view .search_media_rows.video_type .video_image_div, '
        +	'.video_compact_view #choose_video_rows .video_row_thumb, .video_compact_view #video_rows .video_row_thumb, '
        +	'.video_compact_view #video_search_rows .video_row_thumb, .video_compact_view .search_media_rows.video_type .video_row_thumb {'
        +	'	height: calc((('+newWidth+'px - 165px) / '+divider+' - 23px) * (106/191));'
        +	'	}'
        +	'#search_content .video_row .video_row_info_name a, #video_content .video_row .video_row_info_name a, '
        +	'#choose_video_content .video_row .video_row_info_name a, #pva_video_tags .video_row .video_row_info_name a {'
        +	'	white-space: normal;'
        +	'	overflow: hidden;'
        +	'	text-overflow: ellipsis;'
        +	'	width: calc(('+newWidth+'px - 165px) / '+divider+' - 23px) !important;'
        +	'	display: -webkit-box;'
        +	'	height: calc( 11px * 1.4 * 3 );'
        +	'	font-size: 11px;'
        +	'	line-height: 1.4;'
        +	'	-webkit-line-clamp: 3;'
        +	'	-webkit-box-orient: vertical;'
        +	'	}';
     
        $( '#InsertCssBasic' ).html( InsertCssBasic.formatString() );
        
        $( '#InsertCssBasic' ).append( '#stl_side { left: '+( $( '#page_layout' ).offset().left )+'px !important; }'.formatString() );
    }
    
    init();
    
    $( window ).resize(function(){ init(); });
    
    $( '#NormalizeThis' ).waitUntilExists(function(){ 
                
        function Maximize()
        {
            GM_setValue('VK_playerState', 'Maximize' );
            
            playerSize();
            
            $(".mv_top_button:contains('Maximize')").hide();
            $(".mv_top_button:contains('Normalize')").show();
        }
        function Normalize()
        {
            GM_setValue('VK_playerState', 'Normalize' );
            
            $( '#InsertCssZoom' ).empty();
            
            $(".mv_top_button:contains('Normalize')").hide();
            $(".mv_top_button:contains('Maximize')").show();    
        }
        
        GM_getValue('VK_playerState') == 'Maximize' ? Maximize() : Normalize();
        
        $("#NormalizeThis").on('click', Normalize );
        
        $("#MaximizeThis").on('click', Maximize );
        
        $('#reloadThis').on('click', function() { 
            refreshElement('#mv_content .video_box_wrap', 2500 );
        });
        
        $('#ChangeThis, #ChangeThis font').on('mouseup', function(e){ 
            this == e.target && e.which == 1 && rewriteTitle(); 
        });    
    });
    
    function runflashvars()
    {
        var flashvars,Seconds_1,Seconds,xformat,time;
        
        flashvars = $('embed').attr('flashvars');
        flashvars = flashvars !== undefined ? flashvars : '';
        Seconds_1 = flashvars.split('&duration=');
        Seconds = Seconds_1[1] === undefined ? '' : Seconds_1[1].split('&eid1=');
        Seconds = Seconds[0] === undefined ? 0 : Seconds[0];
        xformat = ( Seconds < 3600 ) ? 'mm:ss' : 'H:mm:ss';
        time = moment().startOf('day').seconds(Seconds).format(xformat);
        
        console.log('sec',Seconds);
        // Display how long the video clip are      
        if( $('#VideoLength').size() === 0 ) 
        {
            $('<div id="VideoLength" class="mv_info mv_duration" style="margin-left: 20px;">Video Length:<span style="padding-left:22px;">' + time + '</span></div><br class="my"><div class="clear"></div>').insertAfter('.mv_info_panel.clear_fix');
        }
        
        // Show a list of Qualities that are playable for this clip 
        window.qualities = '';     
        function stp( qual,input ){ window.qualities += '<span class="mv_info mv_quality" style="float: none !important; margin-bottom: 10px;"><span>' + qual + '</span> - ' + input + '</span><br>'; }
        
        if ( flashvars.search('&url720=' ) > 0 ) { stp('720p','HD'); }
        if ( flashvars.search('&url480=' ) > 0 ) { stp('480p','SD'); }
        if ( flashvars.search('&url360=' ) > 0 ) { stp('360p','Normal'); }
        if ( flashvars.search('&url240=' ) > 0 ) { stp('240p','Almost'); }
        if ( flashvars.search('&url180=' ) > 0 ) { stp('180p','Lowest'); }
        
        $( '<div class="mv_info mv_quality_lable" style="margin-left: 20px; float:left;">Video Qualities:</div> <div class="mv_info mv_qualities" style="float:left; margin-left:15px;">' + window.qualities + '</div>' ).insertAfter('br.my');
    
    }
    
    $( '#video_player' ).waitUntilExists(function() { $( '#VideoLength' ).size() === 0 && runflashvars(); });
    
    // Re-sizing inputField
    function sizingInput( str )
    {
        str = str === undefined ? ' ' : str;
        
        var texLen = str.length,
            parLen = $('#toInputingThis').width() - 6,
            inputWidth = ( texLen * 5.2 ) + 21;
        
        // this makes sure that inputfield dont get bigger than avaible space
        inputWidth = inputWidth > parLen ? parLen : inputWidth;
        
        // check if string is longer than, then the field gets bigger, otherwise it vill stay the same as default.
        inputWidth = texLen > 34 ? inputWidth : 200;
        
        // makes the change as defined 
        $( '#txtInputThis' ).width( inputWidth );  
    }
    
    $( window ).resize(function() {
        playerSize();
        sizingInput( $( '#txtInputThis' ).val() );
    });
    
    // this is usefull when same page reloads, with new uniqe URL && only applicable within 10s from clicking reload.
    var mainTitleHead = '#mv_title',
        docLoc = window.location.href,
        lastUrl = GM_getValue('VK_lastUrl') === docLoc,
        ifReloaded = GM_getValue('VK_title_old') !== undefined && lastUrl;
    
    if( lastUrl && $.now() - GM_getValue('VK_date') < 10000  )
    {
        $( '#mv_title' ).waitUntilExists(function(){ 
            var changeTo = GM_getValue('VK_title');
            $( '#txtInputThis' ).val( changeTo );            
            $( mainTitleHead + ', title').text( changeTo ); 
        });
    }
    
    function rewriteTitle()
    {        
        function thePopup()
        {
            var inputPopup, inputPopupCss, thisTitle, author;
            
            inputPopup =
                '<div id="space"class="ymvy"></div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="CancelsNowThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Cancel</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="SaveReloadThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Reload</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="justupdateThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Update</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="toInputingThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">'
            +		'<input id="txtInputThis" type="text" class="" value=""/>'
            +	'</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="LatestTextThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Latest</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="MostUseTxtThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Most</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="FavoritTxtThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Favorits</div>'
            +	'<div class="divider fl_r">|</div>'
            +	'<div id="restsTextsThis" onmouseover="Videoview.activate(this, 2);" onmouseout="Videoview.deactivate(this, 2);" class="ymvy">Resets</div>'
            +	'<div class="divider fl_r">|</div>'
            +	' ';
            
            inputPopupCss = 
                '#inputPopup {'
            +	'	width: calc(100% - 14px);'
            +	'	background-color:#232430;'
            +	'	position: fixed;'
            +	'	z-index: 1000;'
            +	'	height: 40px;'
            +	'	margin:auto;'
            +	'	top:0px;'
            +	'	}'
            +	'#space {'
            +	'	width: 40px;'
            +	'	}' 
            +	'.ymvy {'
            +	'	float: right;'
            +	'	color: #777777;'
            +	'	cursor: pointer;'
            +	'	padding: 12px 5px 12px;'
            +	'	}'
            +	'#toInputingThis {'
            +	'	margin-top: -4px;'
            +	'	width: calc(100% - (87px * 6) );'
            +	'	}'
            +	'input#txtInputThis {'
            +	'	width: 200px;'
            +	'	padding-left: 3px;'
            +	'	line-height: 15px;'
            +	'	background-color: darkgray;'
            +	'	}'
            +	'#inputPopup .divider.fl_r {'
            +	'	padding: 12px 5px;'
            +	'	opacity: .5;'
            +	'	}';
            
            $( '#inputPopupCss' ).html( inputPopupCss.formatString() );
            
            $('<div id="inputPopup" style="display:none;">' + inputPopup + '</div>').insertBefore('#mv_layer_wrap');
            
            author = $('.mv_author_name a').text();
            thisTitle = $( mainTitleHead ).text() + ( ifReloaded || ( mainTitleHead.search( author ) > -1 ) ? '' : ' - ' + author );
            
            if( ifReloaded )
            {
                $('#restsTextsThis').attr('data-thisTitle', GM_getValue('VK_title_old') );
                GM_deleteValue('VK_title_old');
            }
            else
            {
                $('#restsTextsThis').attr('data-thisTitle', thisTitle);
            }
            
           
            $('#txtInputThis').val( thisTitle );       
        }
        
        function doThis()
        {
            $('#inputPopup').slideToggle( 1000 );
        }   
        
        if( $('#inputPopup').size() < 1 )
        {
            thePopup();
            doThis();
            sizingInput( $( '#txtInputThis' ).val() );
        }
        else
        {
            doThis();
        }
        
        function handlestr( str )
        {
            var strArray = str.split(' ');
        }
        
        $('#CancelsNowThis').off().on('mousedown',function() {
            $('#inputPopup').slideUp( 1000 );
        });
        
        $('#SaveReloadThis').off().on('mousedown',function() {
            
            var NewurlThis,
                nowTime = $.now(),
                titleThis = $('#txtInputThis').val(),
                oldtitleThis = $('#restsTextsThis').attr('data-thisTitle'),
                urlThis = docLoc;
            
            // Stored so it can be checked and used later after page are reloaded.
            GM_setValue('VK_date', nowTime );
            GM_setValue('VK_title', titleThis );
            GM_setValue('VK_title_old', oldtitleThis );
            
            // Clean up earlier uniqe generated url
            if( urlThis.search('=ffff') > 0 ) 
            {
                NewurlThis = urlThis.split('=ffff');
                urlThis = NewurlThis[0].slice(0, -1 );
            }
            
            // Creat new uniqe generated url and store as value, so it can be check when page loads. 
            // This needs to be done so that download button gets the new title
            urlThis = urlThis + '?=ffff' + nowTime;
            GM_setValue('VK_lastUrl', urlThis );
            
            // Reload with that newley created url.
            window.location.href = urlThis;            
        });
        
        $('#justupdateThis').off().on('mousedown',function() {
            var changeTo = $('#txtInputThis').val();
            $( mainTitleHead + ', title').text( changeTo );
        });
        
        $('#restsTextsThis').off().on('mousedown',function() { 
            var changeTo = $('#restsTextsThis').attr('data-thisTitle');
            sizingInput( changeTo );
            $('#txtInputThis').val( changeTo );
            $( mainTitleHead + ', title').text( changeTo );        
        });
        
        $( '#txtInputThis' ).bind("input change paste keyup", function( target ) {
            sizingInput( target.currentTarget.value );    
        });
    }       
    
    $(document).on('click','*',function(e){ this == e.target && l('target',e.target,1); });
    console.log('timeThis', performance.now() - timeThis );

}(jQuery));








