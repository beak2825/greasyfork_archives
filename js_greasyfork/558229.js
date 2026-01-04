// ==UserScript==
// @name        DeviantArt Anonymous NSFW Bypass
// @namespace   DeviantArt
// @match       *://*.deviantart.com/*/art/*
// @grant       GM.xmlHttpRequest
// @version     1.1
// @author      lightwo <lightwo@lightwo.net>
// @description View NSFW submissions without having to sign in
// @license     MIT
// @icon        https://www.deviantart.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/558229/DeviantArt%20Anonymous%20NSFW%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/558229/DeviantArt%20Anonymous%20NSFW%20Bypass.meta.js
// ==/UserScript==

(function() {
  const preview = document.getElementsByClassName("mWPapz bUMYCP")[0];
  if (!document.body.contains(preview)) { return false; } // Not an NSFW submission, abort
  const wrapper = document.getElementsByClassName("rdKaY6")[0];
  const loginNag = document.getElementsByClassName("jgdbLP")[0];

  // Get the original image URL
  GM.xmlHttpRequest({
    method: "GET",
    url: "https://backend.deviantart.com/oembed?url=" + document.URL,
    onload: function(response) {
      // Set the image URL
      const origImg = JSON.parse(response.responseText).url;
      preview.style.backgroundImage = "url('" + origImg + "')";

      // Create an anchor to open/save the image
      // XXX: Figure out how to time this without a timeout;
      //      may cause issues for slow connections
      setTimeout(function(){
        const anchor = document.createElement('a');
        anchor.href = origImg;
        anchor.style.height = "100%";
        wrapper.parentNode.replaceChild(anchor, wrapper);
        anchor.appendChild(wrapper);
      }, 1000);
    }
  });

  // Remove unnecessary filters
  preview.style.filter = "unset";
  loginNag.style.display = "none";

  // Remove darken filter ::before
  const styleElem = document.head.appendChild(document.createElement("style"));
  styleElem.innerHTML = ".mWPapz::before {display: none !important;}";
})();