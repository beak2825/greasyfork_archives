// ==UserScript==
// @name          Layout fixer
// @namespace     Layout fixer
// @version       3.02
// @description   This script allows 1920x1080 screen users to adjust pages layout
// @author        leandro.azevedo@gmail.com

// @icon          http://i.imgur.com/pLg6myd.png
// @resource      imgWide http://s9.postimg.org/n3jzwyoi3/img_Wide.png
// @resource      imgNarrow http://s9.postimg.org/5c8dii93f/img_Narrow.png

// @grant         GM_addStyle
// @grant         GM_getResourceURL
// @grant         GM_getValue
// @grant         GM_setValue

// @run-at		  document-end

/*********** INCLUSUINS ***********/
// @include	*

/*********** EXCLUSUINS ***********/
// @exclude	*google.*tbm=isch*
// @exclude	*google.*/maps/*
// @exclude	*google.com/imgres*
// @exclude	*.jpg
// @exclude	*.gif
// @exclude	*.png

// @downloadURL https://update.greasyfork.org/scripts/6841/Layout%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/6841/Layout%20fixer.meta.js
// ==/UserScript==



	/* options */

	var mode 		= 2;	// 1: wide / 2: narrow
	var docWidth	= 1000;
	var imgWide 	= GM_getResourceURL("imgWide");
	var imgNarrow	= GM_getResourceURL("imgNarrow");
	
	if ( GM_getValue ("exceptionsList")===undefined ) GM_setValue ("exceptionsList", "");
	var exceptionsList = GM_getValue("exceptionsList");
	/* reset exceptions */
	//GM_setValue ("exceptionsList", "");

	
	/* functions  */
	
	function getComputedStyle(el,styleProp){
	    var y;
		if (el.currentStyle)
			y = el.currentStyle[styleProp];
		else if (window.getComputedStyle)
			y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return y;
	}

	function setHeight(){
		var body = document.body,
			html = document.documentElement;
		maxHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		GM_addStyle('body {height:' + maxHeight + 'px');
	}

	function switchLayout(){
		var exceptionsList = GM_getValue("exceptionsList");

		if (mode==2) { // go wide
			mode = 1;
			img.src = imgWide;
			if ( exceptionsList.indexOf(cUrl)==-1 ) GM_setValue ("exceptionsList", exceptionsList + "," + cUrl);
			
			GM_addStyle('html {width: 100%}');
			GM_addStyle('html {margin: 0}');
			GM_addStyle('body {border: none; box-shadow: none; margin: 0}');
			
		} else { // go narrow
			mode = 2;
			img.src = imgNarrow;
			if ( exceptionsList.indexOf(cUrl)!=-1 ) GM_setValue ("exceptionsList", exceptionsList.replace("," + cUrl , "") );
			
			setNarrow();
		} 
	}

	function setNarrow(){
	
		GM_addStyle('html {position: relative; width: ' +docWidth+ 'px; margin-left: auto; margin-right: auto; background: #eee;}');
		GM_addStyle('body {width: 100%; border-left: 1px solid #999; border-right: 1px solid #999; box-shadow: 0 0 5px 1px #bbb; padding: 0; margin: 0}');

		// GM_addStyle('body {padding: 0');
		// GM_addStyle('* {min-width: 1px}');
		// GM_addStyle('* {max-width: ' + docWidth + 'px;}');
		
		if ( getComputedStyle( document.body, 'background-color')=='transparent') GM_addStyle('body {background-color: #fff');


		// get flexible width from widest ( exclude position fixed, absolute)

		elms = document.body.getElementsByTagName("*");
		var w;
		for (i=0 ; i<elms.length; i++) {

			/* ajust for wider */
			//if (parseInt( getComputedStyle( elms[i], 'min-width') , 10) > docWidth){
			//if (parseInt( getComputedStyle( elms[i], 'width') , 10) > docWidth){
			if ( elms[i].offsetWidth > docWidth ) {

				//GM_addStyle( 'html {width: ' + elms[i].offsetWidth + 'px}');
				//docWidth = elms[i].offsetWidth;
				
				//docWidth = parseInt( getComputedStyle( elms[i], 'width') , 10 );
				elms[i].style.width = docWidth + 'px'; 
				elms[i].style.padding = '0'; 
				elms[i].style.border = 'none'; 
			}


			if ( (getComputedStyle( elms[i], 'position')=='fixed') && (getComputedStyle( elms[i], 'left')=='0px') ) {
				elms[i].style.left = docLeft+1 + 'px'; 
			}
			if ( (getComputedStyle( elms[i], 'position')=='absolute') && (getComputedStyle( elms[i], 'left')=='0px') ) {
				elms[i].style.left = '1px'; 
			}

			
			
		}

		setHeight();
	}

	
	/* code  */
	

	var cUrl = document.URL.match(/(\w{2,}\.\w{2,}\.\w{2,}|\w{2,}\.\w{2,3})/)[0];
	var docLeft = (window.innerWidth-docWidth-16)/2;
	var i, elms, css;
	
	if ( ( exceptionsList.indexOf(cUrl)==-1 ) && (mode==2) ) {
		setNarrow();
		window.addEventListener ("load", setHeight); // after full load
	} else {
		mode=1;
	}
	
	/* switcher button */
	var img = new Image();
	img.id = 'switcher';


	img.src = (mode==2) ? imgNarrow : imgWide;

	img.onload = function() {
		document.body.appendChild(img);
		GM_addStyle('#switcher {position: fixed; bottom: 10px; right: 10px; z-index: 99999; opacity: 0.5}');
	};

	img.addEventListener("click", switchLayout);
	img.addEventListener("mouseover", function() { img.style.opacity = '1'; } );
	img.addEventListener("mouseout", function() { img.style.opacity = '0.5'; } );
	

	/*
	This script allows 1920x1080 screen users to adjust pages layout:
	<img src="http://s9.postimg.org/j9qjnt767/screenshot_2.png">
	<img src="http://s9.postimg.org/5u3iycyof/screenshot_3.png">
	<img src="http://s9.postimg.org/guyo3dqx7/screenshot_4.png">
	<img src="http://s9.postimg.org/ymaahu6bv/screenshot_5.png">
	*/
	