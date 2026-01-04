// ==UserScript==
// @name        Add download for kerkdienstgemist.nl (including gergemsliedrecht.nl embedding for it)
// @namespace   Downloads
// @match       https://www.gergemsliedrecht.nl/mijn-boazkerk/terugluisteren/*
// @match       https://kerkdienstgemist.nl/s/*
// @grant       none
// @version     1.0
// @author      Arjan L.
// @description 17/12/2025, 14:41:51
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559248/Add%20download%20for%20kerkdienstgemistnl%20%28including%20gergemsliedrechtnl%20embedding%20for%20it%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559248/Add%20download%20for%20kerkdienstgemistnl%20%28including%20gergemsliedrechtnl%20embedding%20for%20it%29.meta.js
// ==/UserScript==

(function(window) {
  'use strict';

  window.addEventListener('load', () => {
    addLinkToDownloadPage();
    addDownloadLink();
  });

  function addLinkToDownloadPage() {
    const iframe = document.querySelector('iframe[src^="//kerkdienstgemist.nl/"]');
    if (!iframe) {
      return;
    }

    iframe.height = parseInt(iframe.height) + 50;
  }

  function addDownloadLink() {
    const audio = document.querySelector('audio');
    if (!audio) {
      return;
    }

    const playList = document.getElementsByClassName('play-list')[0];

    const wrapper = document.createElement('div');
    wrapper.style = 'width: 100%; display: flex; justify-content: center;';
    const action = document.createElement('a');
    action.innerText = 'Download';
    action.target = '_blank';
    action.style = 'font-size: 15pt; padding: 8px 10px;';
    action.addEventListener('click', setDownloadLink);

    wrapper.append(action);

    document.body.insertBefore(wrapper, playList);
  }

  function setDownloadLink() {
    const audio = document.querySelector('audio');
    if (!audio) {
      return undefined;
    }

    this.href = audio.src;
  }
})(window);
