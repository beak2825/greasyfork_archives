// ==UserScript==
// @name          Decloak links and open directly
// @description   Open redirected/cloaked links directly
// @version       2.2.5
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @icon          https://i.imgur.com/cfmXJHv.png
// @resource      icon https://i.imgur.com/cfmXJHv.png
// @license       MIT License
// @run-at        document-start
// @grant         GM_getResourceURL
// @match         *://*/*
// @downloadURL https://update.greasyfork.org/scripts/7596/Decloak%20links%20and%20open%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/7596/Decloak%20links%20and%20open%20directly.meta.js
// ==/UserScript==

'use strict';

const POPUP = document.createElement('a');
POPUP.id = GM_info.script.name;
POPUP.title = 'Original link';
let isPopupStyled;
let lastLink;
let hoverTimer;
let hoverStopTimer;

addEventListener('keypress', e => e.which === 13 && decloakLink(e), true);
addEventListener('mousedown', decloakLink, true);
addEventListener('mouseover', onHover, true);

function onHover(event) {
  const a = decloakLink(event);
  if (!a) return;
  if (lastLink)
    lastLink.removeEventListener('mouseout', cancelHover);
  lastLink = a;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(showPopup, 500, a);
  a.addEventListener('mouseout', cancelHover);
}

function cancelHover(e) {
  this.removeEventListener('mouseout', cancelHover);
  clearTimeout(hoverStopTimer);
  hoverStopTimer = setTimeout(hidePopup, 500, this);
}

function showPopup(a) {
  if (!a.matches(':hover'))
    return;
  if (!isPopupStyled) {
    isPopupStyled = true;
    POPUP.style.cssText = //'all: unset;' +
      'width: 18px;' +
      'height: 18px;' +
      'background: url("' + GM_getResourceURL('icon', false) + '") center no-repeat, white;' +
      'background-size: 16px;' +
      'opacity: 0;' +
      'transition: opacity .5s;' +
      'border: 1px solid #888;' +
      'border-radius: 11px;' +
      'z-index: 2147483647;' +
      'margin-left: 0;' +
      'cursor: pointer;' +
      'position: absolute;'
        .replace(/;/g, '!important;');
  }
  const linkStyle = getComputedStyle(a);
  POPUP.href = a.hrefUndecloaked;
  POPUP.style.opacity = '0';
  POPUP.style.marginLeft = -(
    (parseFloat(linkStyle.paddingRight) || 0) +
    (parseFloat(linkStyle.marginRight) || 0) +
    (parseFloat(linkStyle.borderRightWidth) || 0) +
    Math.max(0, a.getBoundingClientRect().right + 32 - innerWidth)
  ) + 'px';
  setTimeout(() => (POPUP.style.opacity = '1'));
  a.parentElement.insertBefore(POPUP, a.nextSibling);
  POPUP.addEventListener('click', openOriginal);
}

function hidePopup(a) {
  if (POPUP.matches(':hover') || lastLink && lastLink.matches(':hover')) {
    cancelHover.call(a);
  } else if (POPUP.style.opacity === '1') {
    POPUP.style.opacity = '0';
    cancelHover.call(a);
  } else {
    lastLink = null;
    POPUP.remove();
  }
}

function openOriginal(e) {
  this.href = '';
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  setTimeout(() => {
    lastLink.href = lastLink.hrefUndecloaked;
    lastLink.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
}

function decloakLink(event) {
  const a = getClosestLink(event);
  if (!a || a === POPUP || !/^https?:$/.test(a.protocol))
    return;
  if (a.hrefUndecloaked)
    return a;

  if (/\bthis\.href\s*=[^=]/.test(a.getAttribute('onmousedown')))
    a.onmousedown = null;
  if (/\bthis\.href\s*=[^=]/.test(a.getAttribute('onclick')))
    a.onclick = null;

  const href = a.href.baseVal || a.href;
  const m = href.match(/([?&][-\w]*referrer[-\w]*(?==))?[=?/]((ftps?|https?)((:|%3[Aa])\/\/[^+&]+|%3[Aa]%2[Ff]%2[Ff][^+&/]+))/);
  if (!m ||
      m[1] ||
      a.hostname === 'disqus.com' && a.pathname.startsWith('/embed/comments/')) {
    return;
  }

  let realUrl = decodeURIComponent(m[2]);
  if (a.hostname === 'disq.us' &&
      realUrl.lastIndexOf(':') !== realUrl.indexOf(':')) {
    realUrl = realUrl.substr(0, realUrl.lastIndexOf(':'));
  }

  if (new URL(realUrl).hostname === a.hostname ||
      href.match(/[?&=/]\w*([Ss]ign|[Ll]og)[io]n/)) {
    console.debug('Decloak skipped: assumed a login redirection.');
    return;
  }

  a.hrefUndecloaked = href;
  a.setAttribute('href', realUrl);
  a.rel = 'external noreferrer nofollow noopener';
  return a;
}

function getClosestLink(event) {
  return event.composedPath
    ? event.composedPath().find(el => el.tagName === 'A')
    : event.target.closest('a');
}
