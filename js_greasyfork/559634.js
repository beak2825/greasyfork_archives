// ==UserScript==
// @name         brid.gy profile badge
// @description  Display a fediverse badge on a profile page if an account can be reached from fediverse via fed.brid.gy
// @version      1.0.2
// @namespace    https://www.unix.dog/~fruye/bsky-bridgy-badge/
// @author       fruye
// @match        https://bsky.app/profile/*
// @run-at       document-end
// @grant        none
// @license      0BSD
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559634/bridgy%20profile%20badge.user.js
// @updateURL https://update.greasyfork.org/scripts/559634/bridgy%20profile%20badge.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const observer = new MutationObserver(waitForReactToLoad);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });

  function waitForReactToLoad(_records, observer) {
    const main = document.querySelector('main');
    if (!main) {
        return;
    }
    findProfileView(main);
    observer.disconnect();
    const newObserver = new MutationObserver(onNewView);
    newObserver.observe(main.children[0], { childList: true });
  }

  function findProfileView(element) {
    const profileScreen = element.querySelector('[data-testid="profileScreen"]');
    if (!profileScreen) {
        return;
    }
    // it's so over.
    const yaWinningSon = () => {
      const profileView = profileScreen.querySelector('[data-testid="profileView"]');
      if (profileView) {
          checkBridgeStatus(profileView);
      }
      return !!profileView;
    };
    if (!yaWinningSon()) {
      setTimeout(yaWinningSon, 1000);
    }
  }

  function onNewView(records, _observer) {
    for (const record of records) {
      for (const addedNode of record.addedNodes) {
        findProfileView(addedNode);
      }
    }
  }

  async function checkBridgeStatus(profileView) {
    // getting did: from profile picture url. just hope with me they won't change cdn paths.
    const did = /did:[^/]+/.exec(profileView.querySelector('img[src*="did:"]').src);
    const bridgyurl = 'https://bsky.brid.gy/ap/' + did;

    // This really should be a GM.xmlHttpRequest call,
    // but they don't seem to have an option like fetch()'s `cache: 'force-cache'`.
    const response = await fetch(bridgyurl, {
      method: 'HEAD', // WHAT, chrome doesn't cache HEADs??
      cache: 'force-cache', // firefox: cache 404s too :)
      headers: {
        Accept: 'application/activity+json',
        // FIXME: Indentify ourselves(?)
        // - Chrome ignores provided User-Agent header: https://crbug.com/571722
        // - and setting Referer is forbidden: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header
        // - setting any header makes an additional CORS preflight request.
        // GM.xmlHttpRequest doesn't have these restrictions.
        //'User-Agent': window.navigator.userAgent + ' via bsky-bridgy-badge/1',
        //'X-UserScript': 'bsky-bridgy-badge/1',
      },
    });
    if (!response.ok) {
        return;
    }

    const badge = document.createElement('bridgy-badge');
    const a = document.createElement('a');
    a.href = bridgyurl;
    a.ariaLabel = 'Bridges on Fediverse';
    a.title = 'This profile is being bridged to Fediverse via fed.brid.gy! Copy the link to fetch it on your server.';
    badge.append(a);

    const style = document.createElement('style');
    // The verified badge is either 18 or 20px depending on whether we are on mobile:
    // - https://github.com/bluesky-social/social-app/blob/952abc82/src/components/verification/VerificationCheckButton.tsx#L86
    // - https://github.com/bluesky-social/social-app/blob/952abc82/src/alf/breakpoints.ts#L9
    // image source: https://commons.wikimedia.org/wiki/File:Fediverse_logo_proposal.svg, additionaly optimized by SVGOMG.
    style.textContent = `bridgy-badge a {
      display: inline-block;
      aspect-ratio: 1/1;
      height: 18px;
      @media (width >= 500px) { height: 20px }
      scale: 1;
      &:hover { scale: 1.1 }
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196.52 196.52"><path fill="%23a730b8" d="M47.92 72.8a18.23 18.23 0 0 1-7.8 7.76l42.8 42.96 10.32-5.23zm56.46 56.67-10.32 5.23 21.68 21.77a18.23 18.23 0 0 1 7.8-7.76z"/><path fill="%235496be" d="m129.66 102.08 1.8 11.42 27.4-13.9a18.23 18.23 0 0 1-4.97-9.8zm-14.06 7.12L58.3 138.24a18.23 18.23 0 0 1 4.97 9.81l54.1-27.42z"/><path fill="%23ce3d1a" d="m69.53 91.65 8.16 8.2 29.27-57.14a18.23 18.23 0 0 1-9.79-5.02zm-7.19 14.04-14 27.34a18.23 18.23 0 0 1 9.79 5.02l12.37-24.17z"/><path fill="%23d0188f" d="M39.9 80.68a18.23 18.23 0 0 1-10.87 1.72l8.17 52.3a18.23 18.23 0 0 1 10.87-1.73z"/><path fill="%235b36e9" d="M63.33 148.31a18.23 18.23 0 0 1-1.74 10.86l52.3 8.4a18.23 18.23 0 0 1 1.73-10.87z"/><path fill="%2330b873" d="M134.91 146.92a18.23 18.23 0 0 1 9.8 5.02l24.13-47.12a18.23 18.23 0 0 1-9.79-5.02z"/><path fill="%23ebe305" d="M126.13 33.16a18.23 18.23 0 0 1-7.8 7.76l37.38 37.52a18.23 18.23 0 0 1 7.8-7.76z"/><path fill="%23f47601" d="M44.77 51.63a18.23 18.23 0 0 1 4.97 9.81L97 37.49a18.23 18.23 0 0 1-4.97-9.8z"/><path fill="%2357c115" d="M118.25 40.96a18.23 18.23 0 0 1-10.85 1.82l4.18 26.8L123 71.4zm-4.23 44.2 9.9 63.36a18.23 18.23 0 0 1 10.87-1.63L125.44 87z"/><path fill="%23dbb210" d="M49.78 61.64a18.23 18.23 0 0 1-1.7 10.87l26.82 4.3 5.27-10.29zm45.96 7.38-5.27 10.3 63.37 10.18a18.23 18.23 0 0 1 1.76-10.86z"/><path fill="%23ffca00" d="M93.44 23.84a1 1 0 1 0 33.1 1.8 1 1 0 1 0-33.1-1.8"/><path fill="%2364ff00" d="M155.31 85.96a1 1 0 1 0 33.1 1.8 1 1 0 1 0-33.1-1.8"/><path fill="%2300a3ff" d="M115.35 163.98a1 1 0 1 0 33.09 1.8 1 1 0 1 0-33.1-1.8"/><path fill="%239500ff" d="M28.77 150.09a1 1 0 1 0 33.1 1.8 1 1 0 1 0-33.1-1.8"/><path fill="red" d="M15.23 63.48a1 1 0 1 0 33.1 1.8 1 1 0 1 0-33.1-1.8"/></svg>');
    }`;
    badge.append(style);

    const displayName = profileView.querySelector('[data-testid="profileHeaderDisplayName"]');
    displayName.append(badge);
  }
})();
