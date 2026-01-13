// ==UserScript==
// @name         The Guardian Cleaner
// @description  Cleans The Guardian of any distractions, ads, and nags
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-01-12
// @match        https://www.theguardian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theguardian.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560333/The%20Guardian%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/560333/The%20Guardian%20Cleaner.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Remove nags, thank you to "The Guardian Nag Nullifier" for the idea
  let raf = 0;
  const zap = () => {
    raf = 0;
    document.querySelector('[id^="sp_message_container_"]')?.remove();
    document.querySelector('#sign-in-gate')?.remove();
    document.documentElement.classList.remove('sp-message-open');
  };
  const schedule = () => raf || (raf = requestAnimationFrame(zap));

  new MutationObserver(schedule).observe(document, { childList: true, subtree: true });
  schedule();

  // Custom CSS (inject once)
  if (!document.getElementById('tm-guardian-clean')) {
    const style = document.createElement('style');
    style.id = 'tm-guardian-clean';
    style.textContent = `
/* Hide anything that isn't news related */
#trending-topics,
[data-spacefinder-type="model.dotcomrendering.pageElements.GuideAtomBlockElement"],
[name=GuideAtomWrapper],
[name="CommentCount"],
aside:has(div#comments),
[name=ShareButton],
section:has([data-link-name="keywords"]),
[name=SubNav],
[href="/email-newsletters"],
[data-gu-name="body"] [data-print-layout="hide"]:not([data-component="rich-link"]),
[data-gu-name="body"] svg[stroke="var(--straight-lines)"],
[name=SlotBodyEnd],
[name=FooterReaderRevenueLinks],
#slot-body-end,
[name=EmailSignUpWrapper],
.ad-slot-container,
.top-fronts-banner-ad-container,
[name=ScrollableHighlights],
[data-testid=contributions-liveblog-epic],
[name=LiveblogGutterAskWrapper],
div:has(> [data-link-name*=newsletter]),
[data-link-name="footer"],
#secure-messaging,
[name=StickyBottomBanner] { display: none !important; }

/* Hide all but the my account button at the top */
[name=TopBar] > div > div { height: 1em !important; }
[name=TopBar] > div > div > :not(:last-child) { display: none !important; }
[name=TopBar] > div > div > :last-child::before { border: 0 !important; }
[name=TopBar] > div > div > :last-child svg { display: none !important; }
[name=TopBar] > div > div > :last-child button { font-size: xx-small !important; }
`.trim();

    (document.head || document.documentElement).appendChild(style);
  }
})();