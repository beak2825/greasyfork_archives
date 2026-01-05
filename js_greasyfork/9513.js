// ==UserScript==
// @name lotsOfCLICKS
// @description Проходи мимо, чужеземец. Добро пожаловать, ТПУшник. 
// @author iwouldnot
// @license MIT
// @version 1.4
// @include http://stud.lms.tpu.ru/mod/page/view.php?id=30648
// @namespace https://greasyfork.org/users/10868
// @downloadURL https://update.greasyfork.org/scripts/9513/lotsOfCLICKS.user.js
// @updateURL https://update.greasyfork.org/scripts/9513/lotsOfCLICKS.meta.js
// ==/UserScript==

function bindReady(handler){

	var called = false;

	function ready() { // (1)
		if (called) return;
		called = true;
		handler();
	}
    
    function tryScroll(){
        if (called) return;
		if (!document.body) return;
		try {
			document.documentElement.doScroll("left");
			ready();
		} catch(e) {
			setTimeout(tryScroll, 0);
		}
	}

	if ( document.addEventListener ) { // (2)
		document.addEventListener( "DOMContentLoaded", function(){
			ready();
		}, false );
	} else if ( document.attachEvent ) {  // (3)

		// (3.1)
		if ( document.documentElement.doScroll && window == window.top ) {
			tryScroll();
		}

		// (3.2)
		document.attachEvent("onreadystatechange", function(){

			if ( document.readyState === "complete" ) {
				ready();
			}
		});
	}

	// (4)
    if (window.addEventListener)
        window.addEventListener('load', ready, false);
    else if (window.attachEvent)
        window.attachEvent('onload', ready);
    /*  else  // (4.1)
        window.onload=ready
	*/
}

readyList = [];

function onReady(handler) {

	if (!readyList.length) {
		bindReady(function() {
			for(var i=0; i<readyList.length; i++) {
				readyList[i]();
			}
		});
	}

	readyList.push(handler);
}

(function (window, undefined) {
    var w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self != w.top) {
        return;
    }
    
    onReady(function pageReload() {
        window.location.reload();
    });
    setInterval(pageReload,2000);
})(window);