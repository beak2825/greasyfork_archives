// ==UserScript==
// @name         Website tweak
// @description  not for public use
// @namespace    what is this field for?
// @author       Sil_
// @version      1.2
// @license      none as not publically released yet
// @homepage
// @match        https://booktoki*.com/novel/*
// @icon         https://icons8.com/icon/IJ7yETPMYNTy/story-book
// grant        GM_setValue
// grant        GM_getValue
// grant        GM_registerMenuCommand
// grant        GM_setClipboard
// grant        GM_openInTab
// I don't think I any of the above grants
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/557530/Website%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/557530/Website%20tweak.meta.js
// ==/UserScript==
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
(function(){
    'use strict';
    // --- CONFIGURATION ---
    const selector = "." + document.getElementById('novel_content').children[1].classList[0] + " p";
    const property = 'margin';
    const value    = 'unset';    // 'unset' usually disables it. Or try 'none', 'initial', etc.
    // ---------------------
    
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `${selector} { ${property}: ${value} !important; }`;
    document.head.appendChild(styleSheet);
    
    console.log(`Disabled ${property} on ${selector}`);
    document.addEventListener("keydown", (e) => {
	switch(e.key) {
    case "a":
			document.querySelector("div.hidden-xs").children[0].click();break;
		case "ArrowLeft":
			document.querySelector("div.hidden-xs").children[0].click();break;
		case "d":
			document.querySelector("div.hidden-xs").children[1].click();break;
		case "ArrowRight":
			document.querySelector("div.hidden-xs").children[1].click();break;
    default:
			// console.log(e.key)
  }
  console.log("keybinds added");
})
})();