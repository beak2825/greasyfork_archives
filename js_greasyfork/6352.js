// ==UserScript==
// @name       Youtube Offliberate Button
// @namespace  http://abs.ezw.me
// @icon       http://offliberty.com/favicon.ico
// @version    1.2.2
// @description  Places an "Offliberate" button next to the subscribe button under YouTube videos. The button redirects you to Offliberty.com, where the conversion is started automatically. Based on "Youtube MP3 Download Button" by Soulweaver.
// @match      *://www.youtube.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/6352/Youtube%20Offliberate%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/6352/Youtube%20Offliberate%20Button.meta.js
// ==/UserScript==

function insertOffliberateButton() {
	document.getElementsByClassName('action-panel-trigger-share')[0].insertAdjacentHTML('afterend', `<button id="offliberate-button" class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup" title="Offliberate" target="_blank" onclick="window.open('${linkPath}');"><span class="yt-uix-button-content">Offliberate</span></button>`);
}

GM_addStyle('#offliberate-button:before {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsSAAALEgHS3X78AAABJElEQVQ4y61VUW0DMQx9rgogEMJgYXAHYRAOwiB0DA5CoRyElEHG4IbA+5hT+dw4TaVG8o9jPznv2Q4xM7xDRBHADCCKqwDYmLm4Scz8YAAWSWbHCoClmWuAAoCtA2RtAxCagAKWncQvsdZd1qAasFfZLOZWWnFOQv4CYFLU3gB8O7T/yN1N+SbBQK1OC7CLqsGpsEhOktj702vHRFP+RS6unSevEnMxubG2iHXGAQ6DVKl9n2fVtJWCQkSz4W1tcJmYeSOig++MsfMxGIeTCGLHrTzJ+wWQiSgZf+6Jsnb6riXcP/9O2yRHxV2BWUHyfVIaSmvQoFQOTg9yXRbPRm8FEFVMajzzMHqjy6Fn7eXw9vX14oLN3oKlgS8gidU+y70v4A/T/Y3jGZ6RBAAAAABJRU5ErkJggg==) no-repeat; width:20px; height:20px;}');

let linkPath ='http://offliberty.com/#'+encodeURIComponent(document.URL);
console.log('Offliberty link path: ', linkPath);

insertOffliberateButton();

let prevLoc = location.href.match(/^([^#&]*)/)[0];
setInterval(()=> {
	if (location.href.match(/^([^#&]*)/)[0] != prevLoc)
		setTimeout(insertOffliberateButton,2000);
	prevLoc = location.href.match(/^([^#&]*)/)[0];
}, 1000);
