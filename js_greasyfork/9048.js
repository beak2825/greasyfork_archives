// ==UserScript==
// @name Organised Crime
// @namespace Organised Crime
// @version 0.1.2
// @description Easy initiation of Torn organised crimes.
// @author mrmuskrat [1863650]
// @include *.torn.com/factions.php?step=your*
// @require http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/9048/Organised%20Crime.user.js
// @updateURL https://update.greasyfork.org/scripts/9048/Organised%20Crime.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var $CRIMES = $('#faction-crimes');

// Modified from code found in torn_stats.user.js
function watchFactionPage() {
    new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation ) {
            if ( mutation.addedNodes.length ) {
                var item = mutation.addedNodes.item(0);
                if ( $(item).hasClass('faction-crimes-wrap') ) {
                    crimes();
                }
			}
		});
	}).observe( $CRIMES[0], { childList: true } );
}

function crimes() {
	var items = $CRIMES.find('ul.crimes-list li.item-wrap');
	items.each( function( i, ele ) {
		var details = $(ele).find('div.details-wrap');
		if ( $(details).length ) {
			var ready = 1;
			var list = $(details).find('ul.details-list > li > ul.item > li.stat');
			if ( $(list).length ) {
				list.each( function( i, item ) {
					if ( $(item).hasClass('t-red') ) ready = 0;
				});
                var item = $(ele).find('ul.item');
                var status = $(item).children(1).children(1).get(0);
				if ( ready ) {
                    var wrap = $(details).find('div.initiate-crime-wrap');
                    var bwrap = $(wrap).length ? $(wrap).find('span.btn-wrap') : '';
                    var btn = $(bwrap).length ? $(bwrap).find('span.btn') : '';
					if ( $(status).hasClass('t-green') ) {
                        if ( $(bwrap).length ) {
                            var newBtn = $(bwrap).clone();
                            newBtn.click( function() { $(btn).trigger( 'click' ); } );
                            newBtn.css('cursor', 'pointer');
                            $(status).replaceWith( newBtn );
                        }
					}
                } else {
                    if ( $(status).text() == 'Ready' ) {
                        $(status).removeClass('t-green');
                        $(status).addClass('t-red');
                    }
                }
			}
		}
	});
}

watchFactionPage();
