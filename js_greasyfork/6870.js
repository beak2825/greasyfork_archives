/**
 * Created by Pegaasus on 2016-03-05.
 */

//// ==UserScript==
// @name			www.xvideos.com II
// @namespace		http://use.i.E.your.homepage/
// @version			0.45
// @description     enter something useful

// @match			http://www.xvideos.com/*

// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @require         https://greasyfork.org/scripts/9160-my-function-library/code/My%20Function%20library.js?version=111519

// @require         https://greasyfork.org/scripts/1930-simulate-click/code/Simulate_click.js?version=5025
// @require         https://greasyfork.org/scripts/6883-tinysort-tsort/code/TinySorttsort.js?version=27466

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_getResourceURL

// @resource		crinkled_paper http://www.katebocciapresents.com/wp-content/uploads/2014/02/33-crinkled-paper-background-sml.jpg
// @resource		seamlesstexture21_1200 http://www.unsigneddesign.com/Seamless_background_textures/thumbs/seamlesstexture21_1200.jpg

// @run-at			document-start

// @created			2014-10-16
// @released		2014-00-00
// @updated			2014-00-00
// @history         @version 0.1 - first version: @released - 2014-10-18
// @history         @version 0.2 - sec version: @updated - 2014-12-06
// @history         @version 0.22 - sec version: @updated - 2014-12-19
// @history         @version 0.40 - 3rd version: @updated - 2015-10-19
// @history         @version 0.45 - 4th version: @updated - 2016-03-04

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright		2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/6870/wwwxvideoscom%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/6870/wwwxvideoscom%20II.meta.js
// ==/UserScript==


/*global $, jQuery*/
/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression
// -W082, a function declaration inside a block statement


(function($){

    var fc = 0,
        fade = setInterval(function(){

            c.i('fade' + fc++, $('body').length );

            $('img').length && (
                clearInterval( fade ),
                    $('img').fadeOut( 1, "linear" ).delay(10).fadeIn( 2200, "linear" )
            );

        }, 10 ),
        videoPop = locDoc.split('#').pop();

    inURL('#') && videoPop !== undefined && videoPop.length > 1 && self.close();

    var config 	= {
            UI 			: {
                normal		: 930,
                myNormal	: 1111,
                wide		: 1440,
                extra		: 1880,
                dyn			: 100
            },
            pageWidth	: null,
            pageUI		: 'wide',
            startWidth  : function(){
                var winWidth = $w.width(), corr = 88, min = 700,
                    uiWidth = this.pageUI == 'dyn' ? winWidth * ( this.UI.dyn / 100 ) - corr : this.UI[ this.pageUI ],
                    setWidth = uiWidth + corr > winWidth ? winWidth - corr : uiWidth;
                config.pageWidth = setWidth < min ? min : setWidth;
            },
            videoFormat : '',
            thumbRow	: 4,
            enhanced 	: true,
            orginal 	: false,
            isVideo 	: false,
            fullPlayer	: null
        },
        css 	= {
            main		: function(){
                var bimg = 'http://profile-pics-cdn.xvideos.com/videos/profiles/galleries/76/40/58/pegaasus68/gal671503/pic_2_big.jpg';
                return ''
                    +	'.enhanced #page {'
                    +		'background-color: rgb(249, 251, 255);'
                    +		'padding: 20px;'
                    +		'box-shadow: 0px 0px 40px 2px rgba(56, 0, 0, 0.33);'
                    +		'border-style: solid;'
                    +		'border-left-width: 1px;'
                    +		'border-right-width: 1px;'
                    +		'border-top-width: 0px;'
                    +		'border-bottom-width: 0;'
                    +		'border-color: rgba(173, 110, 96, 0.5);'
                    +		'}'
                    +	'.enhanced #player {'
                    +		'width: calc(100% - 0px) !important;'
                    +		'}'

                    +	'.enhanced #relatedVideosWithMore, .enhanced .thumbBlock .thumbInside {'
                    +		'height: initial !important;'
                    +		'}'
                    +	'.enhanced #relatedVideosWithMore .page {'
                    +		'position: static;'
                    +		'}'
                    +	'.enhanced .thumbBlock {'
                    +		'height: initial;'
                    +		'box-sizing: border-box;'
                    +		'}'
                    +	'.enhanced .thumbProfile .thumb {'
                    +		'width: 100%;'
                    +		'box-sizing: border-box;'
                    +		'}'
                    +	'.enhanced .thumbProfile .thumb img {'
                    +		'height: initial;'
                    +		'}'
                    +	'.enhanced .thumbBlock .thumb img {'
                    +		'width: calc(100% - 10px);'
                    +		'}'

                    +	'.enhanced .thumbBlock .thumbInside p a {'
                    +		'height: 36px;'
                    +		'display: inline-block;'
                    +		'}'

                    +	'.enhanced .profilesGalleries.videoThumbs .thumb, .enhanced .profilesGalleries.videoThumbs .vcenter {'
                    +		'height: initial;'
                    +		'}'

                    +	'.enhanced #mv_min_title:hover{'
                    +		'cursor: pointer;'
                    +		'color: white;'
                    +		'}'
                    +	'.enhanced .page {'
                    +		'top: 0% !important'
                    +		'}'
                    +	'.enhanced body {'
                    +		'background-color: rgba(255, 233, 223, 0.33);'
                    +		'background-repeat: repeat;'
                    +		'background-size: cover;'
                    +		'background-attachment: fixed;'
                    +		'background-image: url("' + bimg + '") !important;'
                    +		'}'
                    +	'#related-videos-show-more {'
                    +		'display: none;'
                    +		'}'

                    ;
            },
            dynCss  	: function(){
                return 	''
                    +	'.enhanced #page {'
                    +		'width: '+ config.pageWidth +'px;'
                    +		'max-width: '+ config.pageWidth +'px;'
                    +		'}'
                    +	'.enhanced .thumbBlock{'
                    +		'width: calc(100% / '+ config.thumbRow +' - 0px) !important;'
                    +		'}'
                    +	'.enhanced .thumbProfile {'
                    +		'width: calc(100% / '+ config.thumbRow +' - 4px) !important;'
                    +		'}'
                    +	'.enhanced .thumbProfile .thumb a img {'
                    +		'height: calc( ( '+ config.pageWidth +'px - ( '+ config.pageWidth +'px * 0.25 ) ) / '+ config.thumbRow +' - 4px ) !important;'
                    +		'}'
                    +	'.enhanced #player, .enhanced #player embed {'
//				+		'width: '+ config.pageWidth +'px !important;'
                    +		'height:'+( config.pageWidth * config.videoFormat )+'px !important;'
//				+		'padding-bottom:'+( config.pageWidth * config.videoFormat )+'px !important;'
                    +		'}'
                    +	'.enhanced #related-videos {'
                    +		'z-index: 100;'
                    +		'height: initial !important;'
                    +		'}';
            },
            ads			: function(){
                return	''
                    +	'.hideAds #ads, .hideAds #video-ad, .hideAds #ad-bottom, .hideAds #adChannel {'
                    +		'display: none;'
                    +		'}';
            },
            menuMouse	: function(){
                return	''
                    +	'#ClickMenu {'
                    +		'width: 100px;'
                    +		'position: fixed;'
                    +		'background-color: darkgray;'
                    +		'border: 1px black solid;'
                    +		'padding: 0px;'
                    +		'opacity: 0.8;'
                    +		'z-index: 1000;'
                    +		'}'
                    +	'.UI_choice {'
                    +		'width: calc(100% - 10px);'
                    +		'background-color: lightgray;'
                    +		'line-height: 30px;'
                    +		'height: 30px;'
                    +		'margin: 5px;'
                    +		'text-align: center;'
                    +		'cursor: pointer;'
                    +		'font-weight: bold;'
                    +		'}'
                    +	'.UI_choice:hover {'
                    +		'background-color: rgb(255, 252, 225);'
                    +		'color: darkred;'
                    +		'}'
                    +	'li.cActive {'
                    +		'background-color: beige;'
                    +		'border: 1px solid darkred;'
                    +		'}';
            },
            menuButton  : function(){
                return	'';
            },
            videoButtons: function(){
                return	''
                    +	'.tabsContainer ul.tabButtons li {'
                    +		'margin: 0 3.5px 0 0;'
                    +		'}'
                    +	'ul.tabButtons {'
//				+		'width: calc(100% + 36px);'
                    +		'}'
                    +	'ul.tabButtons.subMenu {'
                    +		'position: absolute;'
                    +		'display: none;'
                    +		'}'
                    +	'li#format {'
//				+		'width: 46px;'
                    +		'}'
                    +	'li#format .tabformat:hover {'
                    +		'color: white !important;'
                    +		'}'
                    +	'li#format:hover ul.tabButtons.subMenu {'
                    +		'display: block;'
                    +		'color: black;'
                    +		'margin-left: -81px;'
                    +		'}'
                    +	'#video-tabs {'
                    +		'position: relative;'
                    +		'z-index: 1000;'
                    +		'}'
                    +	'ul.tabButtons.subMenu a:empty {'
                    +		'display: none;'
                    +		'}';
            },
            orginal  : function(){
                return	''
                    +	'.orginal #format, .orginal #maximize, .orginal #reload {'
                    +		'display: none !important;'
                    +		'}'
                    +	'.orginal #relatedVideosMoreLinkNew {'
                    +		'display: block !important;'
                    +		'}';
            },
            fullPlayer  : function(){
                return	''
                    +	'.fullPlayer body {'
                    +		'position: absolute;'
                    +		'width: 100%;'
                    +		'height: 100%;'
                    +		'overflow: hidden;'
                    +		'background-color: #C84D59;'
                    +		'}'
                    +	'.fullPlayer embed#flash-player-embed {'
                    +		'width: 100% !important;'
                    +		'height: 100% !important;'
                    +		'}'
                    +	'.fullPlayer #player {'
                    +		'position: absolute;'
                    +		'width: calc( 100% - 30px ) !important;'
                    +		'height: calc( 100% - 30px ) !important;'
                    +		'top: 15px;'
                    +		'left: 15px;'
                    +		'box-sizing: border-box;'
                    +		'padding: 5px;'
                    +		'border-style: solid;'
                    +		'border-width: 5px;'
                    +		'border-color: wheat;'
                    +		'border-radius: 8px;'
                    +		'box-shadow: 0px 0px 20px 2px black;'
                    +		'background-color: black;'
                    +		'}'
                    +	'.fullPlayer #page {'
                    +		'position: static !important;'
                    +		'}'
                    +	'.fullPlayer body > * {'
                    +		'width: 0 !important;'
                    +		'height: 0 !important;'
                    +		'padding: 0px !important;'
                    +		'}';
            },
            style  		: function( id ){
                var $id = $( 'head #' + id ), cssID = css[ id ]().formatString();
                $id.length ? $id.html( cssID ) : $( $( '<style/>',{ id: id, class:'mySuperStyles', html: cssID } ) ).appendTo('head');
            }
        },
        html	= {
            RatioButtons : function( ){
                return [
                    { name :'16:9', 	ratio :'16:9'      },
                    { name :'16:10', 	ratio :'16:10'     },
                    { name :'5:4', 		ratio :'5:4'       },
                    { name :'588:486', 	ratio :'Std'       }
                ];
            },
            ButtonsVideo : function( ){
                return [
                    { name :'format'       },
                    { name :'maximize'     },
                    { name :'reload'       }
                ];
            },
            videoButtons: function(){
                css.style('videoButtons');

                var tmp = $('<span/>'),
                    ratioLi = function( i, val ){
                        return $('<li/>').append( $('<a/>',{ class:'btn btn-default', 'data-vf': val.name, 'data-choice': i, text: val.ratio }) );
                    },
                    normLi = function( e ){
                        var cap = e.name.capitalizeFirst();
                        return $('<li/>',{ id: e.name, 'data-ref': 'tab' + cap }).append( $('<a/>',{ class:'btn btn-default', text: cap }) );
                    };

                $( '#format').size() === 0 && (
                    $.each( html.ButtonsVideo(), function( i, e ){
                        tmp.append( normLi(e) );
                    }),
                        tmp.find( '#format a' ).append( $('<ul/>',{ class:'tabButtons subMenu' }) ),
                        $.each( html.RatioButtons(), function( i, val ){
                            i++;
                            tmp.find( '.tabButtons' ).append( ratioLi( i, val ) );
                        }),
                        $( '#video-tabs ul.tab-buttons' ).append( tmp.html() )
                );

            },
            menuButton  : function(){
                css.style('menuButton');

            },
            menuMouse  : function(){


                var isVideo = config.isVideo,
                    menuHtml =
                        '<ul id="ClickMenu" style="display:none;">';

                menuHtml += !isVideo ?
                    '<li class="UI_choice 9" data-state="next">Next Page</li>'
                    +		'<li class="UI_choice 9" data-state="prev">Prev Page</li>' :
                    '<li class="UI_choice 1" data-state="big">Big</li>';

                menuHtml +=
                    '<li class="UI_choice 8" data-state="reload">Reload</li>'
                    +		'<li class="UI_choice 3" data-state="normal">Normal</li>'
                    +		'<li class="UI_choice 3" data-state="myNormal">My Normal</li>'
                    +		'<li class="UI_choice 3" data-state="wide">Wide</li>'
                    +		'<li class="UI_choice 3" data-state="extra">Extra</li>'
                    +		'<li class="UI_choice 3" data-state="dyn">Dynamisk</li>'
                    +		'<li class="UI_choice 3" data-state="orginal">Orginal</li>';

                menuHtml += isVideo ?
                    '<li class="UI_choice 5" data-state="#main h2">Scroll Title</li>'
                    +		'<li class="UI_choice 5" data-state="#main #content">Scroll Video</li>'
                    +		'<li class="UI_choice 5" data-state="#relatedVideosWithMore">Scroll Related</li>' : ' ';

                menuHtml +=
                    '</ul>';

                $( menuHtml ).appendTo('body');

            }
        },
        fn 		= {
            fullplayer 	: function( type ){
                if( g.ms !== 0 ) return false; else g.timer( 256 );

                $( 'head #fullPlayer' ).length || css.style('fullPlayer');
                toggleClassState( config, 'fullPlayer', type );
                config.isVideo && GM_setValue('fullPlayer', config.fullPlayer );
            },
            orginal		: function( type ){
                toggleClassState( config, 'enhanced', type );
                toggleClassState(config, 'orginal', !config.enhanced);
                toggleClassState(config, 'hideAds', config.enhanced);
                $( 'head #orginal' ).length || css.style('orginal');
                $( 'head #ads' ).length || css.style('ads');
            },
            getVideoLength 	: function( $e ){
                var h, min, sec,
                    txt = $e.find( '.duration' ).text().replace(/\(|\)/g,'');

                h	= txt.inElem('h') ? parseInt( txt.split( 'h' ).shift() ) * 60 * 60 : 0;
                txt = txt.inElem('h') ? txt.split( 'h' ).pop() : txt;

                min = txt.inElem('min') ? parseInt( txt.split( 'min' ).shift() ) * 60 : 0;
                sec = txt.inElem('sec') ? parseInt( txt.split( 'min' ).pop().split( 'sec' ).shift() ) : 0;

                return h + min + sec + '';
            },
            thumbs		: function(){

                var relatedVideos = $( '#relatedVideosWithMore' );

                if( relatedVideos.hasClass('done') ) return false; else relatedVideos.hide().addClass('done');

                var clickCounter = 0,
                    sortCounter  = 1,
                    newContainer = $( '<span/>',{ class:"newContainer", style:"position: relative; top: 0%;" }),
                    newMoreClone = $( '<div/>',{ id:"relatedVideosWithMore" }),
                    reArrange 	 = function(){
                        relatedVideos.find( '.thumbBlock' ).each(function( i, relatedElem ){
                            var $relatedElem = $( relatedElem ), thumbInside = $relatedElem.find( '.thumbInside ' );

                            thumbInside.text().length === 0 && thumbInside.each(function( i, insideElem ){
                                var $insideElem = $( insideElem );
                                $insideElem.append( $insideElem.html().extract('<!--','-->','inside') ); });

                            $relatedElem
                                .attr( 'data-SortCounts', sortCounter++ )
                                .attr( 'data-SortLength', fn.getVideoLength( $relatedElem ).lpad( '0', 5 ) );

                            newContainer.find( '#' + $relatedElem.attr('id') ).length || newContainer.append( $relatedElem );
                        });

                        $( '#relatedVideosWithMore' ).replaceWith( newMoreClone.append( newContainer ) );

                        $( '#relatedVideosMoreLink' ).replaceWith(
                            $( '#relatedVideosMoreLink' )
                                .attr('id','relatedVideosMoreLinkNew')
                                .css('cssText','margin: 0 auto; width: 131px; font-weight: bold; display: none;') );

                        fn.sorter('SortLength');

                        config.fullPlayer && fn.fullplayer( true );

                        return false;
                    },
                    loadThumbs = function(){
                        clickCounter++;
                        clickCounter > 3 && reArrange();
                        $( '#relatedVideosMoreLink a').simulate('click');
                        clickCounter > 2 && relatedVideos.show();
                        clickCounter < 5 && setTimeout(function(){ loadThumbs(); }, clickCounter == 3 ? 0 : 250 * clickCounter );
                    };

                loadThumbs();

                $d.on('click', '#relatedVideosMoreLinkNew', function(){
                    var elem = $( '.newContainer' ), top = elem.css('top'), newTop;
                    newTop = top == '0%' ? '-100%' : top == '-100%' ? '-200%' : top == '-200%' && '0%';
                    elem.animate({ top: newTop }, newTop == '0%' ? 128 : 1000 );
                });

            },
            thumbBlock	: function() {
                $('.mozaique.thumbs-5').find('.thumb-block').each(function( i, elm ) {
                    var $elm = $(elm);
                    $elm.find('img').length || $elm.find('.thumb > a').append( $('<img/>',{ id: 'pic_' + $elm.attr('id').split('_').pop(), src: $elm.find('a').data('src') } ) );
                });
            },
            tabformat	: function( elem ){
                var thisFormat  	=  elem.data('vf').split(':'),
                    newFormat		=  thisFormat[1] / thisFormat[0],
                    thisButton 		=  elem.attr('data-choice');
                config.videoFormat 	=  newFormat;
                GM_setValue( 'xVideo_VF', newFormat );
                GM_setValue( 'xVideo_VFbutt', thisButton );
            },
            sorter  	: function( action ){
                //c.i('action',action)
                //$( '.sortButton' ).removeClass( 'sel' );
                //$( '#' + action ).addClass( 'sel' );
                //$( 'html' ).removeClass( 'SortCounts SortLength' ).addClass( action );

                $( '.thumb-block, .thumbBlock' ).tsort({attr:'data-' + action, order: action == 'SortCounts' ? 'asc':'dec' });
//$('#content, #tabVideos').delay(1100).fadeIn( 800, "linear" );
                //GM_setValue( 'sortState', action );
            },
            preSorter 	: function(){

                var counter = 1;
                $( '.mozaique' ).find( '.thumb-block, .thumbBlock' ).each(function( i, elm ){
                    var $elm = $( elm ), videoLen = fn.getVideoLength( $elm );
                    $elm.attr( 'data-SortCounts', counter++ )
                        .attr( 'data-SortLength', videoLen.lpad( '0', 5 ) )
                        .addClass( videoLen < 300 ? 'max5': videoLen < 600 ? 'max10':'min10');
                });
                counter === 1 && fn.preSorter();
                fn.sorter('SortLength');
            },
            filter		: function( moreOrLess, minutes ){

            },
            reload		: function( type ){
                type === 'page' ? loadDoc( locDoc ) : type === 'video' && refreshElement( $('#player') , 'slow' );
            },
            runUI		: function(){
                config.startWidth();
                css.style('dynCss');
            },
            switchUI	: function( ui ){
                this.orginal( ui == 'orginal' ? 'Toggle' : true );
                config.pageUI = ui;
                this.runUI();
                config.isVideoURL ? GM_setValue( 'xVideo', ui ) : GM_setValue( 'xVideo_List', ui );
            },
            firstRun	: function(){
                alert('Welcome to your first time or first use after reinstallion or after reset Configuration');
                GM_setValue( 'firstRun', false );
                GM_setValue( 'xVideo', 'myNormal' );
                GM_setValue( 'xVideo_VF', 10/16 );
                GM_setValue( 'xVideo_List', 'myNormal' );
                GM_setValue( 'xVideo_VFbutt', '4' );
            },
            delConfig	: function(){
                var arr = ['pageUI','fullPlayer','xVideo_List','xVideo_VFbutt','xVideo_VF','firstRun','xVideo'];
                $.each( arr, function(i,e){
                    GM_deleteValue( e );
                });
                alert('Settings has now been - reset back to default settings');
            },
            setConfig	: function(){
                c.i( 'setConfig' );
                GM_getValue( 'firstRun' ) === undefined && this.firstRun();
                config.isVideoURL 		=  	'.com/video'.inURL();
                config.pageUI 			=  	GM_getValue( config.isVideoURL ? 'xVideo':'xVideo_List' );
                config.fullPlayer		=	GM_getValue( 'fullPlayer' );
                config.videoFormat		=	GM_getValue( 'xVideo_VF' ) || 10/16;
                config.videoButton		=	GM_getValue( 'xVideo_VFbutt' );
                config.startWidth();
                config.next 			= 	'next';
                config.prev 			= 	'prev';
            },
            loadHref 	: function( dir ){
//				$('.pagination a:contains(Prev)' ).length
//				$('.pagination a:contains('+ dir +')' ).simulate('click');
                $('.pagination a.sel, .pagination a.active').parent()[ dir ]().find('a').simulate('click');
//				$('#content, #tabVideos').fadeOut( 64, "linear" ).delay(64).fadeIn( 800, "linear" );
                setTimeout(function(){
                    render.sorter();
                }, 256);
            }
        },
        listners	= {
            player 		: function(){
                c.i('player');
                $d.on('mousedown','.fullPlayer body, body',function(e){

                    //filterClick( e, this ) && g.ms == 0 && ( g.timer(64), fn.fullplayer('toggle') );
                });
            },
            pagenav 	: function(){
                c.i('pagenav');
                config.hasPagnation = true;
                $d.on('click','.page-body',function(e){

                    var X_spot			= 	e.clientX,
                        ContentElem		= 	$('#page'),
                        ContentLeft		= 	ContentElem.offset().left,
                        ContentRight	= 	ContentLeft + ContentElem.width();

                    filterClick( e, this ) && ( X_spot < ContentLeft || X_spot > ContentRight ) &&
                    fn.loadHref( X_spot < ContentLeft ? config.prev : config.next );
                });
                //e.stopPropagation()
                //e.preventDefault()
            },
            videoButtons: function(){
                html.videoButtons();
                $d.on('mouseup', 'ul.tabButtons.subMenu a', function(){
                    fn.tabformat( $( this ) );
                    css.style('dynCss'); });
                $d.on('mouseover', '#format', function(){
                    $( '#format li' ).css('cssText','');
                    $( '#format li[data-choice='+( GM_getValue('xVideo_VFbutt') )+']' ).css('cssText','color:red; font-weight: bold;'); });
                $d.on('mouseup', '#maximize', function(){
                    config.isVideo && config.fullPlayer || fn.fullplayer( true ); });
                $d.on('mouseup', '#reload', function(){
                    fn.reload('video'); });
            },
            resize 		: function(){
                $w.resize(function(){ config.fullPlayer || fn.runUI(); });
            },
            menuMouse 	: function(){
                css.style('menuMouse');
                html.menuMouse();
                $d.on('mousedown', '.UI_choice', function(e){

                    e.stopPropagation();
                    e.preventDefault();

                    var $this, state, getIt;
                    e.target == this && e.which == 1 && (
                        $this = $(this),
                            state = $this.data('state'),
                            getIt = GM_getValue( 'xVideo_Scroll' ) == 'undefined' || GM_getValue( 'xVideo_Scroll' ) === undefined ? "#main h2" : GM_getValue( 'xVideo_Scroll' ),
                            $('#ClickMenu').hide( 512 ),
                            $this.hasClass('1') ? config.isVideo && config.fullPlayer || fn.fullplayer( true ) :
                            $this.hasClass('9') ? fn.loadHref( config[ state ] ) :
                            $this.hasClass('5') ? ( ScrollZoomTune( state, 1, -2, 1, 'slow'), GM_setValue( 'xVideo_Scroll', state ) ) :
                            $this.hasClass('8') ? fn.reload('page') :
                            ( fn.switchUI( state ), ScrollZoomTune( getIt, 1, -2, 1, 'slow') )
                    );
                });

                $d.on('mouseleave','#ClickMenu',function(){
                    $('#ClickMenu').hide(); });

                $( document ).on('click','body',function(e){

                    var X_spot			= 	e.clientX,
                        ContentElem		= 	$('#page'),
                        ContentLeft		= 	ContentElem.offset().left,
                        ContentRight	= 	ContentLeft + ContentElem.width();

                    e.stopPropagation();

                    $('#ClickMenu').is(':hidden') && e.target == this && e.which == 1 && (
                        config.fullPlayer ?
                        config.isVideo && fn.fullplayer( false ) :
                        config.fullPlayer || ( X_spot < ContentLeft || X_spot > ContentRight ) && (
                            $('.cActive').removeClass('cActive'),
                            $('#ClickMenu')
                                .css('cssText', 'left: '+( e.clientX - 50 )+'px; top: '+( e.clientY - 12 )+'px; display:block;' )
                                .find('li[data-state='+ config.pageUI +']').addClass('cActive'),
                            $( 'ul.tm' ).hide() ) );
                });
            },
            keyNav		: function(){
                d.addEventListener('keydown', function(e){
                    if( $('input').is(':focus') || g.ms !== 0 ) return false; else g.timer( 64 );

                    var key = e.keyCode; c.i('Key',key);

                    switch( key ){
                        case 27:    config.isVideo && config.fullPlayer && 	( g.ms = 0, fn.fullplayer( false ) );	break;          // esc
                        case 39:    config.isVideo						||  fn.loadHref( config.next );    			break;          // arrow right
                        case 66:    config.isVideo && config.fullPlayer || 	( g.ms = 0, fn.fullplayer( true ) );	break;          // b
                        case 37:    config.isVideo 						||  fn.loadHref( config.prev );   			break;          // arrow left
                        case 82:    fn.delConfig();        												break;          //r
                        case 68:    fn.switchUI('dyn');        											break;          //d
                        case 69:    fn.switchUI('extra');        										break;          //e
                        case 87:    fn.switchUI('wide');             									break;          //w
                        case 78:    fn.switchUI('normal');           									break;          //n
                        case 77:    fn.switchUI('myNormal');           									break;          //m
                        case 79:    fn.switchUI('orginal');           									break;          //o		                        -
                    }
                }, false);
            }
        },
        render 		= {
            start : function(){
                fn.setConfig();
                css.style('main');
                fn.switchUI( config.pageUI );
                listners.keyNav();
                listners.resize();
            },
            sorter : function(){
                c.i('sorter');
                fn.preSorter();
//				setTimeout(function(){ fn.sorter('SortLength'); },512);
            },
            video : function(){
                c.i('video');
                config.isVideo = true;
                listners.videoButtons();
                fn.thumbs();
                fn.thumbBlock();
                this.sorter();
            },
            list : function(){
                config.hasPagnation = true;
                this.sorter();
            }
        },
        observer    = new MutationObserver( function( mutations ){
            mutations.forEach( function( mutation ){
                $( mutation.addedNodes ).each( function( i, e ){
                    var $e = $(e), $p = $e.parent();
//					$e.hasId('content') || $e.hasId('tabVideos') && ( $e.fadeOut( 0, "linear" ), $e.hide(), c.i('jjj', e.id ));
                    //$e.hasId('tabVideos') && $e.fadeOut( 128, "linear" ).delay(800).fadeIn( 800, "linear" )
                    //$e.isTag('body') && $e.fadeOut( 1, "linear" ).delay(800).fadeIn( 1800, "linear" )
                });
            });
        });

    observer.observe( document, { subtree: true, childList: true });

    c.i('www.xvideos.com II');

    $d.ready(function(){
        render.start();
        $('#player, embed').length && render.video();

        setTimeout(function(){
            ( $('.pagination').length || !config.isVideo ) && ( render.list() );
            listners.menuMouse();
            $('.mySuperStyles').appendTo('head');
        }, 1512);
    });

    setTimeout(function(){ $('footer').length || loadDoc( locDoc ); },4000 );

}(jQuery));



