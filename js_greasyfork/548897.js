// ==UserScript==
// @name           Facebook 乾淨連結
// @description    清除臉書為外部連結附加的轉址等處理
// @version        1.0.1
// @license        MIT
// @author         bootleq
// @namespace      bootleq.com
// @homepageURL    https://github.com/bootleq/user-scripts
//
// @match          https://www.facebook.com/*
// @run-at         document-idle
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/548897/Facebook%20%E4%B9%BE%E6%B7%A8%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/548897/Facebook%20%E4%B9%BE%E6%B7%A8%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

// Target behaviors:
//
// - Link href transformed on click
//   <a href='foo'> changes its `href` to 'l.facebook.com/l.php?u=foo' after user click it.
//
// - Link href had `?fbclid=...` params appended


// Search params to be removed
// ref: https://github.com/mpchadwick/tracking-query-params-registry/blob/master/_data/params.csv
const unwantedParams = [
  'fbclid',
  // 'utm_content',
  // 'utm_term',
  // 'utm_campaign',
  // 'utm_medium',
  // 'utm_source',
  // 'utm_id',
];

// Known FB domains, to determine if a link is external
const fbDomains = ['www.facebook.com']

const linkSelector = 'a[role="link"][href^="http"]';

const unwantedEvents = [
  'contextmenu',
  'click',
];

function isExternalOrTracking(href) {
  const domain = (new URL(href)).hostname;
  return !fbDomains.includes(domain);
}

function cleanupURL(url) {
  const u = new URL(url);
  const search = u.search;

  // Real link is in the ?u=foo part
  if (/^lm?.facebook.com$/i.test(u.hostname) && u.pathname === '/l.php' && u.search.startsWith('?u=')) {
    const newHref = decodeURIComponent(u.href.match(/u=([^&#$]+)/i)[1]);
    if (newHref.startsWith('https://')) {
      return cleanupURL(newHref);
    }
  }

  for (const paramName of unwantedParams) {
    u.searchParams.delete(paramName)
  }

  return u.href;
}

function stopPropagation(event) {
  const el = event.target;
  const link = el.closest(linkSelector);
  const btn = el.closest('[role="button"]')

  if (btn) {
    // console.log('👌 forgive button', btn, el);
    return;
  }

  if (link && isExternalOrTracking(link.href)) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

function unbindEvents(el) {
  for (const eventName of unwantedEvents) {
    el.addEventListener(eventName, stopPropagation, true);
  }
}

function mutateLink(node) {
  const href = node.href;

  if (isExternalOrTracking(href)) {
    const cleared = cleanupURL(href);
    if (cleared !== href) {
      node.href = cleared;
    }
  }
}

function removeEventHandlers() {
  const container = document.querySelector('body > div[id^="mount"]');
  if (container) {
    unbindEvents(container);
  } else {
    console.log('Container not found.');
  }
}

function init() {
  removeEventHandlers();

  document.querySelectorAll(linkSelector).forEach(mutateLink);

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const link = node.matches(linkSelector) ? node : node.querySelector(linkSelector);
            if (link) {
              mutateLink(link);
            }
          }
        });
      } else if (mutation.type === 'attributes' && mutation.target.matches(linkSelector)) {
        const link = mutation.target;
        mutateLink(link);
      }
    }
  });

  observer.observe(
    document.body,
    {
      attributes: true,
      attributeFilter: ['href'],
      childList: true,
      subtree: true
    }
  );
}

init();
