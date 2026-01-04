// ==UserScript==
// @name         Fitgirl Screenshots Lightbox Gallery + Auto YouTube Preview
// @namespace    https://greasyfork.org/users/1339856-userrman-ozlem
// @version      2.1.2
// @description  Fitgirl oyun sayfalarında Screenshots için lightbox galerisi, ok butonları ile gezinme ve oyun altına YouTube Oynanış, İnceleme & Engine linkleri. Popup açıldığında DuckDuckGo aramaları otomatik yapılır.
// @include      https://fitgirl-repacks.site/*
// @include      https://duckduckgo.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       bigbluetr
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/550599/Fitgirl%20Screenshots%20Lightbox%20Gallery%20%2B%20Auto%20YouTube%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/550599/Fitgirl%20Screenshots%20Lightbox%20Gallery%20%2B%20Auto%20YouTube%20Preview.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function($){
    $(document).ready(function(){

        // === Lightbox Screenshots Galerisi ===
        var screenshots = [];
        var currentIndex = -1;

        var $overlay = $('<div id="fg-overlay"></div>').css({
            position: 'fixed', top:0, left:0, width:'100%', height:'100%',
            background:'rgba(0,0,0,0.85)', display:'none', justifyContent:'center',
            alignItems:'center', textAlign:'center', zIndex:9999
        }).appendTo('body');

        var $overlayImg = $('<img>').css({
            maxWidth:'90%', maxHeight:'90%', boxShadow:'0 0 20px #000', borderRadius:'4px'
        }).appendTo($overlay);

        var $leftArrow = $('<div>&#10094;</div>').css({
            position:'absolute', top:'50%', left:'20px', transform:'translateY(-50%)',
            fontSize:'50px', color:'#fff', cursor:'pointer', userSelect:'none'
        }).appendTo($overlay);

        var $rightArrow = $('<div>&#10095;</div>').css({
            position:'absolute', top:'50%', right:'20px', transform:'translateY(-50%)',
            fontSize:'50px', color:'#fff', cursor:'pointer', userSelect:'none'
        }).appendTo($overlay);

        $overlay.on('click', function(e){
            if(e.target === this){ $overlay.hide(); currentIndex = -1; }
        });

        $('h3:contains("Screenshots")').next('p').each(function(){
            var $p = $(this);
            $p.find('a img').each(function(){
                var $img = $(this);
                var src = $img.attr('src');
                if(!src) return;

                $img.attr('loading','eager');

                var idx = src.indexOf('.jpg');
                if(idx !== -1) src = src.substring(0, idx+4);
                $img.attr('src', src);

                screenshots.push(src);

                $img.css('cursor','pointer').off('click').on('click', function(e){
                    e.preventDefault();
                    currentIndex = screenshots.indexOf(src);
                    showImage(currentIndex);
                });
            });
        });

        function showImage(idx){
            if(idx < 0 || idx >= screenshots.length) return;
            $overlayImg.attr('src', screenshots[idx]);
            $overlay.css('display','flex');
        }

        $leftArrow.on('click', function(e){
            e.stopPropagation();
            if(currentIndex===-1) return;
            currentIndex=(currentIndex-1+screenshots.length)%screenshots.length;
            showImage(currentIndex);
        });

        $rightArrow.on('click', function(e){
            e.stopPropagation();
            if(currentIndex===-1) return;
            currentIndex=(currentIndex+1)%screenshots.length;
            showImage(currentIndex);
        });

        $(document).on('keydown', function(e){
            if(currentIndex===-1) return;
            if(e.key==='ArrowRight'){ currentIndex=(currentIndex+1)%screenshots.length; showImage(currentIndex); }
            else if(e.key==='ArrowLeft'){ currentIndex=(currentIndex-1+screenshots.length)%screenshots.length; showImage(currentIndex); }
            else if(e.key==='Escape'){ $overlay.hide(); currentIndex=-1; }
        });

        // === Video & Engine Linkleri ===
        $('h1.entry-title').each(function(){
            var fullTitle = $(this).text().trim();
            if (!fullTitle || fullTitle.toUpperCase() === "REUPLOAD") return;

            var gameTitle = fullTitle.split('–')[0].trim();
            if(!gameTitle) return;

            var query = encodeURIComponent(gameTitle);

            // Bu başlığın ait olduğu post içinden Screenshots bul
            var $screenshotsP = $(this).closest('.post').find('h3:contains("Screenshots")').next('p');

            if($screenshotsP.length){
                var $videoLinks = $('<div class="fg-video-links"></div>').css({
                    marginTop:'10px', fontSize:'14px'
                });

                function openPopup(url){
                    var width = screen.width * 0.75;
                    var height = screen.height * 0.75;
                    var left = (screen.width - width) / 2;
                    var top = (screen.height - height) / 2;
                    var params = 'width='+width+',height='+height+',top='+top+',left='+left+',scrollbars=yes,resizable=yes';
                    window.open(url, 'videoPopup', params);
                }

                var gameplayUrl = 'https://duckduckgo.com/?q=%21+site%3Ayoutube.com+'+query+'+gameplay+video+game';
                var $gameplayLink = $('<a><img src="https://img.icons8.com/color/24/youtube-play.png"/> YouTube Oynanış</a>')
                    .css({marginRight:'10px', cursor:'pointer', verticalAlign:'middle', textDecoration:'none'})
                    .on('click', function(e){ e.preventDefault(); openPopup(gameplayUrl); });

                var reviewUrl = 'https://duckduckgo.com/?q=%21+site%3Ayoutube.com+'+query+'+review+video+game';
                var $reviewLink = $('<a><img src="https://img.icons8.com/color/24/youtube-play.png"/> YouTube İnceleme</a>')
                    .css({marginRight:'10px', cursor:'pointer', verticalAlign:'middle', textDecoration:'none'})
                    .on('click', function(e){ e.preventDefault(); openPopup(reviewUrl); });

                var engineUrl = 'https://duckduckgo.com/?q=%21+site%3Asteamdb.info+'+query;
                var $engineLink = $('<a><img src="https://img.icons8.com/color/24/steam.png"/> Engine</a>')
                    .css({marginRight:'10px', cursor:'pointer', verticalAlign:'middle', textDecoration:'none'})
                    .on('click', function(e){ e.preventDefault(); openPopup(engineUrl); });

                $videoLinks.append($gameplayLink).append($reviewLink).append($engineLink);
                $screenshotsP.after($videoLinks);
            }
        });

    });

    // === DuckDuckGo otomatik arama ===
    if(window.location.host=='duckduckgo.com' && window.name === 'videoPopup'){
        setInterval(function(){
            $("#search_form > div > div > div > div > div > button").click()
        }, 1000);
    }

})(jQuery);
