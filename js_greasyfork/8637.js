/**
 * Created by Pegaasus on 2015-03-21.
 */

// ==UserScript==
// @name            Panoramio - Easy and Enhanced Photo Viewer - linked with Google and Wikimapia maps.
// @description     A faster and easier way to explore 80 million images, handy EXIF image data/information, the place where it was taken and latitude/longitude. - Travel around the world, without leaving you secure home.
// @namespace       GCMP-EEPW-20150306-SDF-MOFM 
// @version         0.50

// @include         https://maps.google.*/maps*
// @match           https://maps.google.se/maps*
// @match           http://static.panoramio.com/photos/*.jpg
// @match           http://www.panoramio.com/map*

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require         https://greasyfork.org/scripts/17293-alert/code/$alert.js?version=109035

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest

// @created         2015-03-06
// @released        2015-00-00
// @updated         2015-00-00

// @history         @version 0.25 - Alpha version: @released - 2015-03-12
// @history         @version 0.45 - Beta version: @released - 2015-03-17
// @history         @version 0.5 - RC version: @released - 2016-02-21

// @compatible      Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright       2015+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/8637/Panoramio%20-%20Easy%20and%20Enhanced%20Photo%20Viewer%20-%20linked%20with%20Google%20and%20Wikimapia%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/8637/Panoramio%20-%20Easy%20and%20Enhanced%20Photo%20Viewer%20-%20linked%20with%20Google%20and%20Wikimapia%20maps.meta.js
// ==/UserScript==

/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or function call instead saw an expression


(function($){

    GM_getValue('startState') === undefined && GM_setValue('startState','Large');

    $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild){
        var found	= 'found',
            $this	= $(this.selector),
            $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
        if( !isChild ) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
                window.setInterval(function () {
                    $this.waitUntilExists(
                        handler, shouldRunHandlerOnce, true);
                }, 500);
        }
        else if (shouldRunHandlerOnce && $elements.length){
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
        return $this;
    };
    String.prototype.formatString = function(){
        return this.toString()
            .split(/\s+/g).join(' ')
            .split('{').join('{\n\t')
            .split('; ').join(';')
            .split(';').join(';\n\t')
            .split('*/').join('*/\n')
            .split('}').join('}\n');
    };

    var glob = {
            img: '000.000',
            startState: function(){ n = GM_getValue('startState'); return n },
            locDoc: window.location.href
        },
        f = {
            logState: 9,
            l: function( name, fn, showthis ){
                ( this.logState !== 0 && this.logState == (showthis || this.logState) || this.logState == 'all' ) &&
                console.log( name, fn !== undefined ? fn : '' );
            },
            i: function( name, fn, showthis ){
                ( this.logState !== 0 && this.logState == (showthis || this.logState) || this.logState == 'all' ) &&
                console.info( name, fn !== undefined ? fn : '' );
            },
            ms: 0,
            timer: function (ms){
                this.ms = ms;
                setTimeout(function(){ f.ms = 0; }, ms);
            },
            getRotate: function(){ var n; n = parseInt( $( '.largePanorama').attr('data-rotate') ); return n; },
            calcFlipRotate: function(){
                var flip = $( '#flip'), theImg = $('.theImg'), HFlipped, VFlipped, tw, th;

                HFlipped = flip.find('.flipHorizontal').hasClass('flipped') ? '-1' : '1';
                VFlipped = flip.find('.flipVertical').hasClass('flipped') ? '-1' : '1';
                var Newr, corr, r = f.getRotate();
                f.l('r', r, 8);
                Newr = r == 90 || r == 270;
                f.l('r',Newr, 8);
                tw = r == 90 || r == 270 ? theImg.height() : theImg.width();
                th = r == 90 || r == 270 ? theImg.width() : theImg.height();
    //            corr = r == 90 || r == 270 ? 'translate(12.4%,16.75%' : '';
                f.l('WWWW',tw, 8);
                f.l('HHHH',th, 8);
//                $( '#middle').css('cssText','width:'+( tw )+'px; height:'+( th )+'px;');
	            setTimeout(function(){
                    theImg.css('cssText','transform: scale('+HFlipped+','+VFlipped+') rotateZ('+( r )+'deg);');
	            },256);
	            setTimeout(function(){
		//            $( '#middle').css('cssText','width:'+( tw )+'px; height:'+( th )+'px;')
	            },1);
            },
            closeLargePanorama: function(){
                $( '.largePanorama').hide( 256 ).delay( 256 ).queue(function(){
                    $( this ).remove();
                });
            }
        },
        css = {
            firstPointerCss: function(){
                return 'img[src*="/photos/small/"] {'
                +		'cursor: pointer !important;'
                +		'}'
                +	'#Thumbholder >  *  {'
                +		'width: 311px !important;'
                +		'}'
                +	'#firstThumbholder > .gm-style-iw {'
                +		'position: absolute;'
                +		'width: 100% !important;'
                +		'left: 3px !important;'
                +		'}'
                +	'.gm-style-iw > div {'
                +		'overflow: hidden;'
                +		'width: 110%;'
                +		'max-width: 100% !important;'
                +		'}'
                +	'#firstThumbholder {'
                +		'width: 307px !important;'
                +		'position: relative !important;'
                +		'}'
                +	'.map-info-window {'
                +		'width: 306px;'
                +		'}'
                +	'.map-info-window-title {'
                +		'width: 290px;'
                +		'}'
                +	'.map-info-window-img-outer {'
                +		'width: 306px;'
                +		'}'
                +	'.gm-style .map-info-window-img-inner img {'
                +		'width: 282px;'
                +		'}'
                +	'.map-info-window-img-footer {'
                +		'width: 281px;'
                +		'}'
                +	'.map-info-window-img-footer-name {'
                +		'max-width: calc( 100% - 68px );'
                +		'}'
                +	'.map-info-window-img-footer-name a {'
                +		'height: 16px;'
                +		'display: block;'
                +		'overflow: hidden;'
                +		'}';
            },
	        fontsCss    : function(){
                return '@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css);';
            },
            navBarInner : function(){
                return '.linkTo {'
                        +		'float: left;'
                        +		'line-height: 52px;'
                        +		'height: 52px;'
                        +		'display: inline-block;'
                        +		'width: 152px;'
                        +		'overflow: hidden;'
                        +		'color: wheat;'
                        +		'}'
                        +	'.linkTo a {'
                        +		'color: rgba(255, 255, 255, 0.75);'
                        +		'font-size: 18px;'
                        +		'}';
            },
            details     : function(){
                return '.largePanorama #imageDetails {'
                +		'position: absolute;'
                +		'display: none;'
                +		'top: 50%;'
                +		'left: 50%;'
                +		'transform: translate(-50%,-50%);'
                +		'z-index: 30000;'
                +		'}'

                +	'.largePanorama .interim-info-card {'
                +		'padding: 15px;'
                +		'margin: 0 0 13px;'
                +		'background-color: rgba(255, 255, 255, 0.85);'
                +		'border-radius: 15px;'
                +		'border-color: rgba(123, 123, 123, 0.85);'
                +		'border-width: 3px;'
                +		'border-style: outset;'
                +		'box-shadow: 2px 2px 8px 4px rgba(0, 0, 0, 0.4);'
                +		'}'
                +	'.largePanorama .justImg {'
                +		'display: inline-block;'
                +		'width: 100%;'
                +		'margin-left: 0px;'
                +		'}'
                +	'.largePanorama .justImg span {'
                +		'margin-right: 25px;'
                +		'}'
                +	'.largePanorama .interim-info-card>h2 {'
                +		'margin: 0 0 5px;'
                +		'font-size: 16px;'
                +		'font-weight: normal;'
                +		'text-align: center;'
                +		'line-height: 40px;'
                +		'}'
                +	'.largePanorama .interim-info-card a {'
                +		'color: rgb(0, 0, 222) !important;'
                +		'}'
                +	'.largePanorama #details {'
                +		'margin: 0;'
                +		'padding: 0;'
                +		'list-style: none;'
                +		'}'
                +	'.largePanorama #details li {'
                +		'margin-bottom: 6px;'
                +		'padding-top: 0;'
                +		'font-size: 13px;'
                +		'color: #999;'
                +		'clear: both;'
                +		'}'
                +	'.largePanorama #map_info_breadcrumbs {'
                +		'margin-top: 15px;'
                +		'text-align: center;'
                +		'}'
                +	'.largePanorama #place {'
                +		'color: #999;'
                +		'}'
                +	'.largePanorama h2, .largePanorama #place, .largePanorama #details * {'
                +		'color: rgb(66, 66, 66) !important;'
                +		'}'
                +	'.largePanorama .geo {'
                +		'margin-top: 5px;'
                +		'}';
            },
            mainCss     : function(){
                return '.largePanorama {'
                +		'position: absolute;'
                +		'top: 50%;'
                +		'left: 50%;'
                +		'transform: translate(-50%,-50%);'
                +		'z-index: 10000;'
                +		'border-radius: 15px;'
                +		'padding: 0px 6px 20px;'
                +		'border-width: 3px;'
                +		'border-style: outset;'
                +		'border-color: rgba(127, 127, 127, 0.31);'
                +		'background-color: rgba(236, 236, 236, 0.85);'
                +		'box-shadow: 5px 5px 20px 10px rgba(0, 33, 32, 0.31);'
                +		'}'

                +	'.largePanorama > img.theImg {'
                +		'border-width: 3px;'
                +		'border-style: inset;'
                +		'border-color: rgba(255, 255, 255, 0.6);'
                +		'background-color: rgba(144, 144, 144, 0.65);'
                +		'box-shadow: 4px 2px 20px 1px rgba(170, 170, 170, 0.85);'
                +		'transform: rotate(0deg);'
                +		'}'
                +	'.largePanorama a {'
                +		'color: #15c;'
                +		'}'

                +	'.largePanorama .zoom, .largePanorama .close, .largePanorama .Size, '
                +	'.largePanorama #top, .largePanorama #bottom, '
                +	'.largePanorama .pano, .largePanorama .more, .largePanorama #rotate span {'
                +		'cursor: pointer;'
                +		'}'

                +	'.largePanorama .TheTitle {'
                +		'line-height: 35px;'
                +		'float: left;'
                +		'height: 35px;'
                +		'z-index: 15000;'
                +		'width: calc(100% - 150px) !important'
                +		'}'
                +	'.largePanorama .TheTitle b {'
                +		'float: left;'
                +		'cursor: initial;'
                +		'max-width: calc(100% - 0px) !important;'
                +		'}'

                +	'.mainSub {'
                +		'position: relative;'
                +		'}'

                +	'.largePanorama #top {'
                +		'height: 35px;'
                +		'line-height: 35px;'
                +		'}'

                +	'.largePanorama .mainClick {'
                +		'position: absolute;'
                +		'z-index: 11000;'
                +		'cursor: pointer;'
                +		'}'
                +	'.largePanorama #middle {'
                +		'height: calc(100% + 9px) !important;'
                +		'}'
                +	'.largePanorama #middle #over {'
//                +		'background-color: rgba(76, 131, 180, 0.28);'
                +		'width: 100%;'
                +		'height: 50%;'
                +		'top: 0;'
                +		'}'
                +	'.largePanorama #middle #under {'
//                +		'background-color: rgba(65, 65, 7, 0.34);'
                +		'width: 100%;'
                +		'height: 50%;'
                +		'bottom: 1px;'
                +		'}'
                +	'.largePanorama #middle .mainSub {'
                +		'position: relative;'
                +		'}'
                +	'.largePanorama #middle  img {'
                +		'position: relative;'
                +		'z-index: 10500;'
                +		'}'

                +	'.largePanorama #bottom {'
                +		'position: absolute;'
                +		'width: calc(100% - 12px);'
                +		'height: 20px;'
                +		'}'

                +	'.largePanorama .map-info-window-img-footer{'
                +		'width: calc(100% - 18px);'
                +		'}'

                +	'.largePanorama .pano {'
                +		'position: absolute;'
                +		'bottom: 3px;'
                +		'width: calc(100% - 2px);'
                +		'margin-left: 1px;'
                +		'}';
            },
            moreCss     : function(){
                return '.largePanorama .more {'
                +		'float: right;'
                +		'z-index: 20000;'
                +		'}'
                +	'.largePanorama .more ul {'
                +		'display: none;'
                +		'position: absolute;'
                +		'padding: 4px 4px 4px 3px;'
                +		'margin-top: -14px;'
                +		'margin-left: -24px;'
                +		'border-style: outset;'
                +		'border-width: 2px;'
                +		'border-radius: 8px;'
                +		'border-color: rgb(209, 209, 209);'
                +		'background-color: rgba(215, 215, 215, 0.85);'
                +		'box-shadow: 1px 2px 8px 3px rgba(0, 60, 62, 0.27);'
                +		'z-index: 20000;'
                +		'}'
                +	'.largePanorama .more ul li {'
                +		'border-radius: 4px;'
                +		'line-height: 35px;'
                +		'padding: 0 10px;'
                +		'}'
                +	'.largePanorama .more ul li:hover {'
                +		'background-color: rgb(104, 122, 138);'
                +		'}'
                +	'.largePanorama .more ul li a {'
                +		'color: rgb(0, 36, 47);'
                +		'text-decoration: none;'
                +		'white-space: nowrap;'
                +		'}'
                +	'.largePanorama .more ul li:hover a {'
                +		'color: aliceblue;'
                +		'}'
                +	'.largePanorama .moreArrow.skiptranslate {'
                +		'font-size: 20px;'
                +		'height: 35px;'
                +		'right: 0;'
                +		'padding: 0 5px;'
                +		'position: absolute;'
                +		'float: right;'
                +		'}'
                +	'.largePanorama .moreArrow.skiptranslate:hover {'
                +		'color: blue !important;'
                +		'}';
            },
            toolBoxCss  : function(){
                return '#toolBox {'
                +		'float: right;'
                +		'margin-right: 12px;'
                +		'width: 118px;'
                +		'padding: 0 10px;'
                +		'z-index: 50000;'
                +		'display: none;'
                +		'}'
                +	'#toolBox>div>span {'
                +		'padding: 0 6px;'
                +		'display: inline-block;'
                +		'}'
                +	'#rotate {'
                +		'float: right;'
                +		'}'
                +	'#flip {'
                +		'float: left;'
                +		'}'
                +	'#toolBox span:hover, .more:hover, .moreArrow:hover {'
                +		'box-shadow: 0px -1px 18px 6px rgba(229, 229, 229, 1);'
                +		'background-color: rgba(227, 228, 228, 1);'
                +		'height: 35px;'
                +		'color: rgb(40, 38, 211);'
                +		'}';
            },
            sizeCss     : function(){
                return '.largePanorama .Size {'
                +		'position: absolute;'
                +		'z-index: 1000;'
                +		'bottom: 0px;'
                +		'left: 50%;'
                +		'transform: translate(-50%);'
                +		'white-space: nowrap;'
                +		'}'
                +	'.largePanorama .Size span {'
                +		'padding: 0 8px;'
                +		'display: inline-block;'
                +		'height: 18px;'
                +		'}'
                +	'.largePanorama .Size span:hover {'
                +		'box-shadow: 0px -5px 20px 9px rgba(229, 229, 229, 1);'
                +		'background-color: rgba(229, 229, 229, 1);'
                +		'}'
                +	'.largePanorama .Size a {'
                +		'color: black;'
                +		'position: relative;'
                +		'text-decoration: none;'
                +		'}';
            },
            naturalWidth    : function( naturalWidth ){
                return '.largePanorama #top, .largePanorama #middle { width: '+ naturalWidth +'px !important; }';
            },
            style       : function( id, var1, var2 ){
                var $id = $( 'head #' + id ), cssID = css[ id ]( var1, var2 ).formatString();
                $id.length ? $id.html( cssID ) : $( $( '<style/>',{ id: id, class:'mySuperStyles', html: cssID } ) ).appendTo('head');
            }
        },
//        domSel = { main: $('.largePanorama')},
//        htmlSel = { main: '.largePanorama' },
        html = {
            title: null,
            bottomLink: null,
            imgNr: function(globImg){
                globImg = globImg || '000.000';
                var n; n = globImg.split('.').shift(); return n; },
            wrong: function(globImg){
                globImg = globImg || '0' ;
                var n; n = 'http://www.panoramio.com/map_photo/?id=' + globImg; return n; },
            reload: function(){
                var n;
                n = glob.locDoc.search('maps.google') > 0 ?
                    $(document).find('#link').attr('href') : glob.locDoc.search('www.panoramio.com/map') > 0 && window.location.href;
                return n;
            },
            panoPhoto: function(globImg){
                globImg = globImg || html.imgNr(glob.img);
                var n; n = 'http://www.panoramio.com/photo/' + globImg; return n;
            },
            panoramioHtmlLink : function( link ){
                return $('<a/>', { id: 'panoramioHtmlLink', href: link, text: 'Orginal page' } );
            },
            UrlConverter: function( domain, inputUrl ){
                var url = inputUrl !== undefined ? inputUrl : location.href;
                url = domain === 'Google' ?
                          'http://maps.google.com/maps/@' + url.split('lt=').pop().split('&ln=').join(',').split('&z').shift() + ',300m/data=!3m1!1e3' :
                          'http://wikimapia.org/#lang=en&lat=' + url.split('lt=').pop().split('&ln=').join('&lon=').split('&z').shift() + '&z=16&m=b';
                return url;
            },
            aLink: function( domain, inputUrl ){
                return $('<a/>', { id: 'convert' + domain, class:'link', href: this.UrlConverter( domain, inputUrl ), text: domain + ' Maps', target:'_blank' });
            },
            linkTo: function( domain ){
                return $( $('<div/>',{ class:'linkTo', 'data-domain': domain }).html( this.aLink( domain ) ) ).insertAfter( '#explore-wrapper' );
            },
            headLinks: function(){
                css.style('navBarInner');
                html.linkTo('Google');
                html.linkTo('Wikimapia');
                listenerOn.navBarInner();
            },
            DetailsResults: null,
            Details: function(){
                //noinspection JSUnusedGlobalSymbols
                GM_xmlhttpRequest({
                    method: "GET",
                    url: html.panoPhoto(),
                    crossDomain: true,
                    //onerror:
                    onprogress: function(res) {
                        var msg = "\n\r\t "
                            + "On progress Report."
                            //                            + "\nresponseText: " + res.responseText
                            + "\nreadyState: " + res.readyState
                            + "\nresponseHeaders: " + res.responseHeaders
                            + "\nstatus: " + res.status
                            + "\nstatusText: " + res.statusText
                            + "\nfinalUrl: " + res.finalUrl;
                        //						+ "\n\nContent-length: " + res.responseHeaders.match('Content-Length: \\d+').toString().split(': ').pop()

                            res.readyState == 4 && console.log(msg);
                    },
                    onload: function(res) {
                        var domain = 'http://www.panoramio.com/map/', href, newVal,
                            $res = $( res.responseText), bred = $( '<div/>', { id:"map_info_breadcrumbs" }), tmp = $( '<span/>'),
                            geoLink = 'https://ssl.panoramio.com' + $res.find('#location .geo').find('a').attr('href');

                        bred
                            .append(
                                $res.find('#map_info_breadcrumbs').html(),
                                $( '<span> • </span>' ),
                                $res.find('#map_info_name a').addClass('local'),
                                $('<br/>' ),$('<br/>' ),
                                $res.find('#location .geo').find('a').addClass('point').parent(),
                                $('<br/>' ),
                                html.aLink('Wikimapia', geoLink ),
                                $('<br/>' ),
                                html.aLink('Google', geoLink ) )
                            .find('a').each(function( id, el ){
                                var $el = $( el ), orgHref = $el.attr('href');
                                newVal = id === 1 ? '9' : id === 2 ? '4' : $el.hasClass('local') ? '0' : $el.hasClass('point') ? '-1' : '';
                                href = orgHref.split('/map/').pop().split('&z=');
                                $el.hasClass('link') ||
                                    $el.addClass( 'nr' + id ).attr('href',
                                        orgHref.search('&z=') !== -1 ? href.length > 1 ? href.shift() + '&z=' + newVal + '&k=2' : domain : orgHref );
                            });

                        tmp.append(
                            $res.find('#details').parent() ).find('.interim-info-card')
                                .append( bred )
                                    .prepend( html.bottomLink.clone().addClass('justImg')
                                        .append( html.panoramioHtmlLink( html.panoPhoto() ) )).end()
                                .find('.pano').removeClass('pano');

                        $( '<div/>', { id:"imageDetails", html: tmp.html() }).appendTo( '.largePanorama' );
                    }
                });
            },
            insertMore: [
                '<div class="more"><span class="moreArrow skiptranslate">?</span>',
                    '<ul>',
                        '<li><a class="reLoad" target="_self" href="">Reload Map this Location</a></li>',
                        '<li><a class="linkOrginal" target="_blank" href="">Orginal in new TAB</a></li>',
                        '<li><a class="wrongLink" target=" _blank" href="">Suggest new Location</a></li>',
                        '<li><a class="imageFlipRotate">Image Flip-Rotate</a></li>',
                        '<li><a class="imageDetails">Image Details</a></li>',
                        '<li><a class="configStartState">Default Size</a></li>',
                    '</ul>',
                '</div>'].join(''),
            main: [
                '<div class="largePanorama" data-rotate="0" data-state="" style="">',
                    '<div id="top"    class="mainSub"></div>',
                    '<div id="middle" class="mainSub">',
                        '<div id="over" class="mainClick zoomPano"></div>',
                        '<div id="under" class="mainClick closePano"></div>',
                    '</div>',
                    '<div id="bottom" class="mainSub"></div>',
                '</div>'].join(''),
            size: [
                '<div class="Size">',
                    '<span class="LargeBottomLink"><a target=" _blank" href="">Normal: </a></span>',
                    '<span class="HugeBottomLink"><a target=" _blank" href="">Large: </a></span>',
                    '<span class="OrginalBottomLink"><a target=" _blank" href="">Orginal: </a></span>',
                '</div>'].join(''),
            insertToolBox: [
                '<div id="toolBox">',
                    '<div id="rotate">',
                        '<span class="rotates rotateLeft skiptranslate">RL</span>',
                        '<span class="rotates rotateRight skiptranslate">RR</span>',
                    '</div>',
                    '<div id="flip">',
                        '<span class="flip flipVertical skiptranslate"><span id="up" class="fp">VF</span></span>',
                        '<span class="flip flipHorizontal skiptranslate"><span id="left" class="fp">HF</span></span>',
                    '</div>',
                '</div>'].join('')
        },
//        listenerOff = {zoomClose: function(){}},
        listenerOn = {
            ZoomState: null,
            zoomClose: function(){
                var state,waitOnLoad,
                    img = $( '.theImg'),
                    main = $('.largePanorama'),
                    newImg = new Image();
                $( '.zoomPano' ).on('mousedown', function(e){
                    e.which == 1 && this == e.target && (
                        waitOnLoad = setInterval(function(){
                            state = main.attr('data-state') == 'Huge' ? 'Large':'Huge';
                            $( '.' + state + 'BottomLink.loaded' ).length && (
                                clearInterval( waitOnLoad ),
                                newImg.src = loadImg[ state ](),
                                img.attr('src', loadImg[ state ]() ),
                                f.calcFlipRotate(),
                                main.attr('data-state', state ),
                                newImg.onload = function(){
                                    css.style('naturalWidth', newImg.naturalWidth );
                                } );
                        }, 5 ) ); });
                $( '.closePano' ).on('mouseup', function(e){
                    e.which == 1 && this == e.target && f.closeLargePanorama(); });
            },
            moreMenu: function(){
                $( '.moreArrow, .moreArrow font, .more' ).on('mousedown', function(e) {
                    e.which == 1 && this == e.target && (
                        $( '.more ul' ).show(), f.timer( 512 ),
                        $( '.reLoad' ).attr('href', $(document).find('#link').attr('href') ) ); });
                $( '.more ul' ).on('mouseleave', function(e) {
                    f.ms === 0 && this == e.target && $( this ).hide(); });
                $( '.more li a' ).on('click', function(e) {
                    f.ms === 0 && e.which == 1 && this == e.target && $( '.more ul' ).hide(); });
                $( '.configStartState' ).on('click', function(e) {
                    e.which == 1 && this == e.target && (
                        GM_setValue('startState', $('.largePanorama').attr('data-state') ) )
                });
                $( '.imageFlipRotate' ).on('mouseup', function(e) {
                    var LPano = $( '.largePanorama'), toolbox = $('#toolBox');
                    e.which == 1 && this == e.target && (
                        toolbox.is(':visible') ? toolbox.hide() : toolbox.show(),
                        $( '.rotates' ).on('click', function(e) {
                            var rotate = f.getRotate();
                            e.which == 1 && this == e.target && (
                                rotate = $( this ).hasClass('rotateRight') ? ( rotate == 270 ? 0 : rotate + 90 ):( rotate === 0 ? 270 : rotate - 90 ),
                                LPano.attr('data-rotate', rotate ).delay(2).queue(function(n){
	                                f.calcFlipRotate(); n(); }) );
                        }),
                        $('.fp').on('click', function(e) {
                            e.which == 1 && this == e.target && (
                                $(this).parent().toggleClass('flipped').delay(2).queue(function(n){
	                                f.calcFlipRotate(); n(); }) );
                        }))});
            },
            navBarInner: function(){
                $( document ).on('mouseenter', '.linkTo', function(){
                    var domain = $( this ).data('domain');
                    $( '#convert' + domain ).attr( 'href', html.UrlConverter( domain ) ); });
             },
            closeLargePanorama: function(){
                $( document ).on('mousedown', '#map > .gm-style > div > div', function(){
                    f.closeLargePanorama();
                });
            },
            detailsPhoto: function(){
                $( '.imageDetails, #top, #bottom, .pano, .TheTitle' ).on('mouseup', function(e) {
                    var elemLoc = $( '#imageDetails' );
                    f.ms === 0 && e.which == 1 && this == e.target && ( f.timer(64), elemLoc[ elemLoc.is(':hidden') ? 'show' : 'hide' ](128) ); });
                $( document ).on('mouseleave', '#imageDetails', function() {
                    $( this ).hide(256); });
            }//,
            //flipRotate: function(){ }
        },
        render = {
            mainHtml: function(){

                var htmlImgNr = html.imgNr( glob.img ),
                    main = $( html.main ),
                    newImg = new Image();

                newImg.src = loadImg[ glob.startState() == 'Large' ? 'Large' : 'Huge' ]();
                newImg.onload = function(){
                    css.style('naturalWidth', newImg.naturalWidth );
                };

                css.style('fontsCss');
                css.style('navBarInner');
	            css.style('mainCss');
                css.style('moreCss');
                css.style('toolBoxCss');

                main.addClass( htmlImgNr )
                    .find( '#middle' ).append( loadImg.startImg ).end()
                    .find( '#top' ).append( html.title ).end()
                    .find( '#bottom' ).append(
                        html.bottomLink.find('.map-info-window-img-footer-logo a').attr('href', html.panoPhoto() ) ).end()
                    .find( '#top' ).append( html.insertMore ).end()
                    .find( '#middle img' ).addClass('theImg');

                $('body').append( main ).delay(1).queue(function(){
                    $('.largePanorama')
                        .find( '.reLoad').attr('href', html.reload() ).end()
                        .find( '.linkOrginal').attr('href', loadImg.Orginal() ).end()
                        .find( '.wrongLink').attr('href', html.wrong( htmlImgNr ) ).end()
	                    .find( '#bottom img').closest('div').addClass('pano');
                });

                css.style('details');
                html.Details();
                render.sizePre();

                setTimeout(function(){
                    $('.largePanorama').attr('data-state', GM_getValue('startState') );
                    listenerOn.zoomClose();
                    render.size();
	                listenerOn.moreMenu();
                    listenerOn.detailsPhoto();
                    listenerOn.closeLargePanorama();
	                $( html.insertToolBox ).appendTo('#top');
                },24);
            },
            sizePre: function(){
                var Size = $( html.size );
                css.style('sizeCss');
	            Size.find('span').append('<i class="fa fa-spinner fa-pulse fa-1x fa-fw" style="width: 20px"></i>');
                $('#bottom').append( Size );
            },
            size: function() {
                var chk = {
                    Loaded  : setInterval(function(){
                        var Huge = $('.HugeBottomLink'), Orginal = $('.OrginalBottomLink'), Large = $('.LargeBottomLink');
                        $('.Size .loaded').length === 3 && (
                            clearInterval( chk.Loaded ),
                            Huge.data('size') === Orginal.data('size') && Orginal.hide(),
                            Large.data('size') === Huge.data('size') && Huge.hide(),
                                $('.Size span').each(function(id, el) {
                                    $(el).text().search('0x0') > 0 && $(el).hide(); }) );
                    }, 10),
                    tSize   : function( size ){
                        var sizes = loadImg[ size + 'Size' ],
                            link = $('.' + size + 'BottomLink');
                        link.length !== 0 && sizes.length > 2 && (
                            clearInterval( chk[ size ] ),
                            link.find('i').hide( 512 ).end()
                                .not('.loaded').addClass('loaded').attr('data-size', sizes )
                                    .find('a')
                                        .attr('href', loadImg[ size ]() )
                                        .attr('title', loadImg[ size+'fileSize' ] )
                                        .append( sizes ) );
                    },
                    Large   : setInterval(function(){
                        chk.tSize('Large');
                    }, 1),
                    Huge    : setInterval(function(){
                        chk.tSize('Huge');
                    }, 1),
                    Orginal : setInterval(function(){
                        chk.tSize('Orginal');
                    }, 1)
                };
            }
        },
        loadImg = {
            domainPhotoPath : 'http://static.panoramio.com/photos',
            /**
             * @return {string}
             */
            Large: function(){
                var n; n = loadImg.domainPhotoPath + '/large/' + glob.img; return n },
            /**
             * @return {string}
             */
            Huge: function(){
                var n; n = loadImg.domainPhotoPath + '/1920x1280/' + glob.img; return n },
            /**
             * @return {string}
             */
            Orginal: function(){
                var n; n = loadImg.domainPhotoPath + '/original/' + glob.img; return n },
            LargeLoaded: null,
            HugeLoaded: null,
            OrginalLoaded: null,
            LargeSize: '0',
            LargeWidth: '0',
            HugeSize: '0',
            HugeWidth: '0',
            OrginalSize: '0',
            OrginalWidth: '0',
            startImg: null,
            setLoadedSize: function( newImg, state ){                                   f.l('state',state,9);
                var sizeText = newImg.naturalWidth + 'x' + newImg.naturalHeight;        f.l(state,sizeText,3);
                this[state+'Loaded'] = true,                                            f.l(state+'Loaded',this[state+'Loaded'],9),
                this[state+'Size'] = sizeText,                                          f.l(state+'Size',this[state+'Size'],9);
                this[state+'Width'] = newImg.naturalWidth;
                loadImg[state+'fileSize'] = this[state].size / 1024;
                f.l(state+'fileSize',this[state+'fileSize']);
                f.l('newImg',newImg.target);
            },
            bootstrapCss: function(){
                $('#bootstrapCss').length || $('<link/>',{ id:'bootstrapCss', rel:"stylesheet", href:"//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" }).appendTo('head');
            },
            img_onWaitLoad: function(){
                this.bootstrapCss();
                $.alert('Wait on image to load',{
                    //http://www.jqueryscript.net/other/Create-Simple-Alert-Messages-with-jQuery-Bootstrap-alert-js.html
                    autoClose: true,
                    // Auto close delay time in ms (>1000)
                    closeTime: 8000,
                    // Display a countdown timer
                    withTime: true,
                    // danger, success, warning or info
                    type: 'info',
                    // position+offeset
                    // top-left,top-right,bottom-left,bottom-right,center
                    position: ['top-left', [ 128, ( $('div#map').width() / 2 ) - ( 284 / 2 ) ]],
                    // <a href="http://www.jqueryscript.net/animation/">
                    // Animation speed
                    speed: 'normal',
                    // onShow callback
                    onClose: function () {
                        $('#firstThumbholder').css('visibility','hidden');
                    },
                    title:'Loading info'
                });
            },
            img_onError: function( state ){
                this.bootstrapCss();
                $.alert('The size of ' + state + " can't be loaded",{
                    //http://www.jqueryscript.net/other/Create-Simple-Alert-Messages-with-jQuery-Bootstrap-alert-js.html
                    autoClose: true,
                    // Auto close delay time in ms (>1000)
                    closeTime: 8000,
                    // Display a countdown timer
                    withTime: true,
                    // danger, success, warning or info
                    type: 'info',
                    // position+offeset
                    // top-left,top-right,bottom-left,bottom-right,center
                    position: ['top-left', [ 128, ( $('div#map').width() / 2 ) - ( 284 / 2 ) ]],
                    // <a href="http://www.jqueryscript.net/animation/">
                    // Animation speed
                    speed: 'normal',
                    // onShow callback
                    onClose: function () {
                        $('#firstThumbholder').css('visibility','hidden');
                    },
                    title:'OnError'
                });
            },
            run_img1: function(){
                var startState = glob.startState() == 'Large' ,newImg = new Image(),
                    startString = startState ? 'Large' : 'Huge';
                newImg.src = this[ startString ]();  f.l('src1', startState ? this.Large(): this.Huge(),9);

                newImg.onerror = function(){
                    loadImg.img_onError( startString );
                    $('.' + startString + 'BottomLink').hide();
                };
                newImg.onload = function(){                                             f.l('run_img1',newImg,9);
                    loadImg.setLoadedSize( newImg, startString );
                    loadImg.startImg = newImg;
                };
            },
            run_img2: function(){
                var startState = glob.startState() == 'Large', newImg = new Image(),
                    startString = startState ? 'Huge' : 'Large',
                    chk = setInterval(function(){
                        loadImg.startImg !== null && (
                            clearInterval(chk), render.mainHtml()  ); },1);
                newImg.src = this[ startString ]();
                newImg.onerror = function(){
                    loadImg.img_onError( startString );
                    $('.' + startString + 'BottomLink').hide();
                };
                newImg.onload = function(){                                              f.l('run_img2',newImg,9);
                    loadImg.setLoadedSize( newImg, startString ); };
            },
            run_img3: function(){
                var newImg = new Image();
                newImg.src = this.Orginal();
                newImg.onerror = function(){
                    loadImg.img_onError( 'Orginal' );
                    $('.OrginalBottomLink').hide();
                };
                newImg.onload = function(){                                              f.l('run_img3',newImg,9);
                    loadImg.setLoadedSize( newImg, 'Orginal' ); };
            }
        },
        reset = {
            Objects: function(){
                loadImg.startImg        = null;
                loadImg.LargeLoaded     = false;
                loadImg.HugeLoaded      = false;
                loadImg.OrginalLoaded   = false;
                loadImg.LargeSize       = '0';
                loadImg.HugeSize        = '0';
                loadImg.OrginalSize     = '0';
                html.DetailsResults     = null;
            }
        },
        observer = new MutationObserver( function( mutations /*, observer */) {
            mutations.forEach( function( mutation ) {
                var newNodes = mutation.addedNodes;
                newNodes !== null &&
                $( newNodes ).each( function( i, e ){
                    var $e = $(e);
                    $e.hasClass('gm-style-iw') && ( $e.parent().attr('id','firstThumbholder'), $e.prev().attr('id','Thumbholder' ) );
                    //$e.hasClass('widget-titlecard-attribution') && switcher('123');
                });
            });
        });

    observer.observe( document, { subtree: true, childList: true });

    function fn_googleMaps(){
        var css = {
                panoramioButton: function(){
                return 'a.PanoramioUrl img {'
                    +		'width: 40px;'
                    +		'height: 40px;'
                    +		'}'
                    +	'.PanoramioWrapper {'
                    +		'top: -5px;'
                    +		'left: -35px;'
                    +		'position: absolute;'
                    +		'}'
                    +   'a.WikimapiaUrl img {'
                    +		'width: 20px;'
                    +		'height: 20px;'
                    +		'}'
                    +	'.WikimapiaWrapper {'
                    +		'top: 4px;'
                    +		'left: -52px;'
                    +		'position: absolute;'
                    +		'}'
                    ;
                },
                style  		: function( id, var1, var2 ){
                    var $id = $( 'head #' + id ), cssID = css[ id ]( var1, var2 ).formatString();
                    $id.length ? $id.html( cssID ) : $( $( '<style/>',{ id: id, class:'mySuperStyles', html: cssID } ) ).appendTo('head');
                }
            },
            html = {
                getPanoramioUrl : function(){
                    var cord = location.href.split('@').pop().split(',');
                    return 'https://ssl.panoramio.com/map/#lt=' + cord[0] + '&ln=' + cord[1] + '&z=2&k=2&a=1&tab=1&pl=all';
                },
                getWikimapiaUrl : function(){
                    var cord = location.href.split('@').pop().split(',');
                    return 'http://wikimapia.org/#lang=en&lat=' + cord[0] + '&lon=' + cord[1] + '&z=16&m=b';
                },
                panoramioButton : function(){
                    return '<button aria-label="Go to Panoramio" oncontextmenu="return false;" class="widget-expand-button-pegman-background grab-cursor"> '
                        +		'<div class="PanoramioWrapper" > '
                        +		'<a target="_blank" href="'+ html.getPanoramioUrl() + '" class="PanoramioUrl" title="Go to Panoramio"> <img src="https://lh5.ggpht.com/iX6z62XBBt1b2T0fWnt9EupX1e6yFoUnYwO60z702xIp3-VlJquqYBOSay7aKhd5wbQ=w300-rw"></a>'
                        +		'</div></button>';
                },
                /**
                 * @return {string}
                 */
                WikimapiaButton : function(){
                    return '<button aria-label="Go to Wikimapia" oncontextmenu="return false;" class="widget-expand-button-pegman-background grab-cursor"> <div class="WikimapiaWrapper" > '
                        + '<a target="_blank" href="' + html.getWikimapiaUrl() + '" class="WikimapiaUrl" title="Go to Wikimapia"> <img src="http://a1.mzstatic.com/us/r30/Purple3/v4/c1/7a/ea/c17aea4b-2f3d-dbc3-3fa9-92ece451ae3c/icon175x175.png"></a>'
                        + '</div></button>';
                }
            },
            listener = {
                panoramioButton: function(){
                    $( document ).on('mouseenter', 'a.PanoramioUrl img, a.PanoramioUrl', function(e){
                        this == e.target && (
                            $( 'a.PanoramioUrl' ).attr('href', html.getPanoramioUrl() )
                        );
                    });

                },
                WikimapiaButton: function(){
                    $( document ).on('mouseenter', '.WikimapiaUrl img, .WikimapiaUrl', function(e){
                        this == e.target && (
                            $( '.WikimapiaUrl' ).attr('href', html.getWikimapiaUrl() )
                        );
                    });

                }
            },
            render = function(){
                var insert =  $('.app-horizontal-widget-holder'); //$('.widget-expand-button-pegman')
                css.style('panoramioButton');
                $('.PanoramioWrapper').length || $( html.panoramioButton() ).prependTo( insert );
                listener.panoramioButton();

 //               css.style('WikimapiaButton');
                $('.WikimapiaWrapper').length || $( html.WikimapiaButton() ).prependTo( insert );
                listener.WikimapiaButton();
            },
            googleMaps_observer = new MutationObserver( function( mutations /*, observer */) {
                mutations.forEach( function( mutation ) {
                    var newNodes = mutation.addedNodes;
                    newNodes !== null &&
                    $( newNodes ).each( function( i, e ){
                        var $e = $(e);
                        ( $e.hasClass('widget-expand-button-pegman') ||  $e.hasClass('.app-horizontal-widget-holder') ) && render();
                    });
                });
            });

        googleMaps_observer.observe( document, { subtree: true, childList: true });
        setInterval(function() {
            $('.PanoramioWrapper').length || render();
        }, 1024);

        $(window).load(function() {
            render();

        });


    }

    function fn_panoramio(){
        css.style('firstPointerCss');

        var search = '/photos/small/';

        $( document ).on('hover mouseenter', '.map-info-window-img-inner img', function(){
            var mainParent      = $( this ).parents('.map-info-window-img-outer'),
                mainImgParent   = mainParent.find('.map-info-window-img-inner'),
                mainLink        = mainImgParent.find('a'),
                src             = $( this ).attr('src');

            src.search('logo-tos.png') > 0 && $( this ).addClass('panoLinkClick').closest('a').attr('href', mainLink.attr('href') );
            $('.map-info-window-img-footer-logo a').attr('href', mainLink.attr('href') );
            mainParent.hasClass( 'Donne' ) || ( mainParent.addClass( 'Donne' ), mainLink.find('img').unwrap() );

            src.search(search) !== -1 && (
                reset.Objects(),
                glob.img = src.split(search).pop(),
                loadImg.run_img1(),
                html.bottomLink = $( this ).parent().next().clone(),
                html.title = $( this ).parent().parent().prev().clone().addClass('TheTitle')
            );

        });
        $( document ).on('click', 'img', function(){
            var removePano = $('.largePanorama'),
                src = $( this ).attr('src');
            removePano.length && removePano.remove();
            src.search(search) !== -1 && (
                loadImg.run_img2(),
                loadImg.run_img3()
            );
        });

        f.l('fn_googleMaps');
    }

    glob.locDoc.search('panoramio.com') != -1 && fn_panoramio();
    glob.locDoc.search('/maps/') != -1 && fn_googleMaps();


    f.l('fn_googleMaps',location.href.search('/maps/'));

    function infoCol(){
        var zoomURL = $('#info-col').find('#location .geo a'),
            href = zoomURL.attr('href').split('=');
        href[3] = '-1&' + href[3].split('&').pop();
        zoomURL.attr('href', href.join('=') );
    }

    glob.locDoc.search('panoramio.com/photo/') != -1 && $('#info-col').length && infoCol();

    function switcher(code) {
        var url = $('a.widget-titlecard-attribution-link').attr('data-attribution-url');
        f.l( 'switcher',code + ': ' + url );

        GM_xmlhttpRequest({
            method     : "GET",
            url        : url,
            crossDomain: true,
            onprogress : function(res){
                var msg = "\n\r\t "
                    + "On progress Report."
                                                    + "\nresponseText: " + res.responseText
                    + "\nreadyState: " + res.readyState
                    + "\nresponseHeaders: " + res.responseHeaders
                    + "\nstatus: " + res.status
                    + "\nstatusText: " + res.statusText
                    + "\nfinalUrl: " + res.finalUrl;
                //						+ "\n\nContent-length: " + res.responseHeaders.match('Content-Length: \\d+').toString().split(': ').pop()

                res.readyState == 4 && console.log(msg);
            },
            onload     : function(res){
                //f.l( 'res.responseText', res.responseText );
                var $res = function(){
                        return $( res.responseText );
                    },
                    href = $res().find('#location .geo a').attr('href').split('='),
                    img = $('<img/>',{src:'http://www.galis.org/_/rsrc/1315550090403/Home/panoramio.png'}),
                    a   = $('<a/>',{ class:'panoramio_switcher', html:img });

                href[3] = '-1&' + href[3].split('&').pop();

                f.l('link', 'https://ssl.panoramio.com' + href.join('=') );

                $('.panoramio_switcher').length || $('.widget-titlecard-header .widget-titlecard-attribution').append( a.attr('href', 'https://ssl.panoramio.com' + href.join('=') ) );

            }
        });
    }
    $('.widget-titlecard-attribution-text').waitUntilExists(function(){
        var panaramioCss = 'a.panoramio_switcher img {'
                +		'width: 26px;'
                +		'top: 9px;'
                +		'position: relative;'
                +		'}'
                +	'.widget-titlecard-header .widget-titlecard-attribution {'
                +		'top: -10px;'
                +		'position: relative;'
                +		'}';

        setTimeout(function(){
            switcher('789');
            setTimeout(function(){
                $('<style id="panaramio">' + panaramioCss + '</style>').appendTo( 'head' );
            }, 424);
            setInterval(function(){
                var link = $('a.widget-titlecard-attribution-link').attr('data-attribution-url'),
                    arrays = link.split('/'),
                    locDoc  = window.location.href;

                link.search('ssl.panoramio.com') > 0 && locDoc.search( arrays[4] ) == -1 && (
                    console.log('chk', locDoc.search( arrays[4] ) ),
                    $('.panoramio_switcher').remove(),
                        setTimeout(function(){
                                switcher();
                        },512)
                );
            }, 2500);
        }, 1524);
    });

    //----------------------------------------------------------------------------------------------------------//
    //												    The END													//
    //----------------------------------------------------------------------------------------------------------//

    $( document ).on('click','*',function(e){ this == e.target && console.log('target',e.target); });

    f.l('google maps');

    $( document ).ready(function() {
        html.headLinks();
     });

}(jQuery));

