/// ==UserScript==
// @name			www.tv4play.se
// @namespace		http://use.i.E.your.homepage/
// @version			0.25
// @description     större film ock animering mm
// @match			http://www.tv4play.se/program/*
// @match			http://www.tv4play.se/kanaler/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @created			2014-08-15
// @released		2014-00-00
// @updated			2014-00-00
// @compatible		Greasemonkey, Tampermonkey
// @history         @version 0.25 - first version: @released - 2014-02-12
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @copyright		2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/8037/wwwtv4playse.user.js
// @updateURL https://update.greasyfork.org/scripts/8037/wwwtv4playse.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014, -W030*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression

(function($){
    
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
                }, 256);
        } 
        else if (shouldRunHandlerOnce && $elements.length) 
        {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
		return $this;
	};

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

    function refreshElement( elem , speed ) //refreshElement('.videoPlayer','slow');
    {
        var data = $( elem ).html();
        $( elem ).hide().html( data ).fadeIn( speed );
    }

    var basic, video, thisHeight, thisWidth,
        multi = 2.8,
        element = $('#player'),
        orgWidth = element.width(),
        orgHeight = element.height(),
        MultiString = function(f) {
            return f.toString().split('\n').slice(1, -1).join('\n');
        };
    
    basic = 
        	'.video-size-buttons {'
        +		'display: none;'
        +		'}'
        +	'.header-wrapper {'
    	+		'transition: all 80ms ease;'
        +		'position: fixed;'
        +		'visibility: hidden;'
//        +		'display: none;'
        +		'height: 5px;'    
        +		'}';
    
    $('<style id="Stylebasic">'+ basic.formatString() +'</style><style id="Stylevideo"></style>').appendTo('head'); 
    
    var width = 1100,
        css =
         '.module-center-wrapper {'
        +	'width: '+width+'px;'
        +	'}'
        +'.module.episodes .js-search-page ul li.video-panel {'
        +	'height: calc(69px * '+multi+');'
        +	'width: calc('+width+'px - 54px) !important;'
        +	'}'
        +'.module.episodes .js-search-page ul li.video-panel a {'
        +	'height: calc(61px * '+multi+');'
        +	'}'
        +'.module.episodes .js-search-page ul li.video-panel a .video-image {'
        +	'height: calc(56px * '+multi+');'
        +	'width: calc(100px * '+multi+');'
        +	'}'
        +'.module.episodes .js-search-page ul li.video-panel a .video-image img {'
        +	'height: calc(56px * '+multi+');'
        +	'width: calc(100px * '+multi+');'
        +	'}'
        +'.module.episodes .js-search-page ul li.video-panel a .video-image .overlay img {'
        +	'height: calc(39px * '+multi*0.75+');'
        +	'width: calc(38px * '+multi*0.75+');'
    	+	'top: 36%;'
        +	'}';
    
    $('#Stylebasic').append( css.formatString() );
    
    $( 'param[name="isResumePlay"].wwww' ).waitUntilExists(function(){
        $( this ).hasClass('donne') || (
            $( this ).addClass('donne'),
            console.log( 'isResumePlay', $(this).attr('value') ),
            $(this).attr('value') == "true" && $(this).attr('value','false'), 
            refreshElement('#video-player-wrapper','slow')            
            );
        });
    
    function playerSize()
    {    
        thisWidth = $('#site-intro').width() - 20;
        thisHeight = orgHeight * ( thisWidth / orgWidth );
    
        video = ' '
        +	'#video-player-wrapper, #player {'
        +		'	width: '+ thisWidth +'px !important;'
        +		'	height: '+ thisHeight +'px !important;'
        +		'	margin: 0 auto !important;'
        +		'}';
    
        $('#Stylevideo').empty().html( video.formatString() );
    }
    
    playerSize();
    
    $( window ).resize(function() { playerSize(); }); 
    
    $( window ).mousemove(function( event ) {
        event.clientY < 55 ? 
            $('.header-wrapper').css('cssText','visibility: visible; height: 58px;' ) : 
        	$('.header-wrapper').css('cssText','visibility: hidden; height: 5px;' ); });
    
    $( document ).on( 'click', '*', function(e){ this == e.target && console.log( 'target', e.target ); });
    
}(jQuery));

//        event.clientY < 55 
//        && event.clientX > $( window ).width() - 500 


