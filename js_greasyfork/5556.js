// ==UserScript==
// @name    		Gaia - Disable Profile Media Auto-play
// @description:en    	Disable Profile Media Auto-play
// @author  		Knight Yoshi (http://www.gaiaonline.com/p/7944809)
// @version     1.0.6
// @include 		http://www.gaiaonline.com/profiles/*
// @namespace https://greasyfork.org/users/2263
// @description Disable Profile Media Auto-play
// @downloadURL https://update.greasyfork.org/scripts/5556/Gaia%20-%20Disable%20Profile%20Media%20Auto-play.user.js
// @updateURL https://update.greasyfork.org/scripts/5556/Gaia%20-%20Disable%20Profile%20Media%20Auto-play.meta.js
// ==/UserScript==
var quit = false;
var media = (function () {
  if (document.body.id === 'viewer') {
    return document.querySelectorAll('param[name="movie"]');
  } else {
    return document.querySelectorAll('embed');
  }
}) ();
for (var idx in media) {
  var curmedia = media[idx];
  if (curmedia.value !== undefined && curmedia.value.indexOf('gaiaonline') === -1) {
    curmedia.parentNode.setAttribute('data', stopMedia(curmedia.value));
    curmedia.value = stopMedia(curmedia.value);
  } else if (curmedia.src !== undefined && curmedia.src.indexOf('gaiaonline') === -1) {
      curmedia.src = stopMedia(curmedia.src); 
  }
}
function stopMedia(url) {
  if (url.indexOf('youtube') !== - 1 || url.indexOf('youtu.be') !== -1 || url.indexOf('zanorg.com') !== -1) {
    url = url.replace(/(\?|&)\s*autoplay=\s*1&?/gi, '$1');
  } 
  else if (url.indexOf('grooveshark') !== - 1) {
    url = url.replace(/(\?|&)\s*p=\s*1&?/gi, '$1');
  } 
  else if (url.indexOf('soundcloud') !== - 1) {
    url = url.replace(/(\?|&)\s*auto_play=\s*true&?/gi, '$1');
  } 
  else if (url.indexOf('hypster') !== - 1 || url.indexOf('sheepproductions') !== -1) {
    url = url.replace(/(\?|&)\s*autoplay=\s*true&?/gi, '$1');
  }
  else if((url.indexOf('tinyurl') || url.indexOf('goo.gl')) !== -1) {
  /**
   * TODO: figure out how to get the original URL from at least TinyURL.
   * Stupid shortened URLs...
   */
    console.log('Media, "' + url + '", cannot be modified - completely removing')
    url = url.replace(url, '');
  } else {
    if(!quit) {
      console.log('Fuck this shit, I\'m done. I was unable to handle the media,' + url);
      quit = true;
    }
  }
  return url;
};