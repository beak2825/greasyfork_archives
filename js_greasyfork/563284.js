// ==UserScript==
// @name        Subscriptions CollabHider - Hide Collaborations / Multiple Channel Videos - YouTube youtube.com
// @namespace   MMM Scripts
// @match       https://www.youtube.com/feed/subscriptions*
// @grant       none
// @license     mit
// @version     1.0
// @author      -
// @description Hide collabs / collaborations / multiple channel videos on YouTube
// @require        https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require        https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/563284/Subscriptions%20CollabHider%20-%20Hide%20Collaborations%20%20Multiple%20Channel%20Videos%20-%20YouTube%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/563284/Subscriptions%20CollabHider%20-%20Hide%20Collaborations%20%20Multiple%20Channel%20Videos%20-%20YouTube%20youtubecom.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  const $node = $('yt-avatar-stack-view-model[aria-label="Collaboration channels"]');
  if ($node.length) {
    console.log('CollabHider - Found one/some: '+$node.length);
    $node.each(function(){
      let ThisOnesTitle = $( this ).closest( 'div#content' ).find('a.yt-lockup-metadata-view-model__title[href][aria-label]').attr('aria-label');
      console.log('CollabHider - Hid collab - Title: '+ThisOnesTitle);
      $( this ).closest( 'ytd-rich-item-renderer' ).css('display','none !important').remove ();
    });
    // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    // return true;
  }
});