// ==UserScript==
// @name         Embedded YouTube fix
// @description  this monitors and auto-refreshes crashed embedded YouTube players in the background for a seamless viewing experience
// @namespace    https://htsign.hateblo.jp
// @version      0.4.1
// @author       htsign
// @match        *://*/*
// @match        https://www.youtube.com/embed/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563196/Embedded%20YouTube%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/563196/Embedded%20YouTube%20fix.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const ID = 'embedded-youtube-fix';
  const BROKEN_PAGES = [];

  const iframes = document.getElementsByTagName('iframe');

  // parent
  if (window.self === window.top) {
    const visibles = new WeakSet();

    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          visibles.add(target);
          target.contentWindow?.postMessage(ID, 'https://www.youtube.com');
        }
        else {
          visibles.delete(target);
        }
      }
    });

    window.addEventListener('message', ({ data, source, origin }) => {
      if (origin !== 'https://www.youtube.com') return;
      if (data !== ID) return;

      const iframe = Array.prototype.find.call(iframes, el => el.contentWindow === source);
      if (iframe == null) return;

      const url = new URL(iframe.src);

      if (url.searchParams.get('feature') === 'oembed') {
        url.searchParams.delete('feature');
      }
      url.searchParams.set(ID, url.searchParams.get(ID) ^ 1);

      if (BROKEN_PAGES.some(pageRegex => pageRegex.test(url.href))) {
        // fallback for cases where copying elements breaks the original site's scripts
        iframe.src = url.toString();
      }
      else {
        // avoid multiple back button presses
        const newIframe = iframe.cloneNode();
        newIframe.src = url.toString();

        iframe.replaceWith(newIframe);
        observer.observe(newIframe);
      }
    });

    const loop = () => {
      for (let i = 0, len = iframes.length; i < len; ++i) {
        const iframe = iframes[i];

        observer.observe(iframe);

        if (visibles.has(iframe)) {
          iframe.contentWindow?.postMessage(ID, 'https://www.youtube.com');
        }
      }

      setTimeout(loop, 500);
    };
    requestIdleCallback(loop);
  }

  // inside of iframe
  else if (location.href.startsWith('https://www.youtube.com/embed/')) {
    window.addEventListener('message', ({ data, source, origin }) => {
      if (data !== ID) return;

      if (document.querySelector('.ytp-error')) {
        source.postMessage(ID, origin);
      }
    });
  }
})();
