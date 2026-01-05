// ==UserScript==
// @name         Reddit Flair Linkifier
// @namespace    https://greasyfork.org/users/649
// @version      2.1.7
// @description  Turns the text in various subreddits' flair into links
// @author       Adrien Pyke
// @match        *://*.reddit.com/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/706/Reddit%20Flair%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/706/Reddit%20Flair%20Linkifier.meta.js
// ==/UserScript==

(() => {
  'use strict';

  GM_addStyle(`
		.flair-link {
			text-decoration: none;
		}
		.flair-link:hover {
			text-decoration: underline;
		}
	`);

  const newLayoutId = '#SHORTCUT_FOCUSABLE_DIV';

  waitForElems({
    sel: [
      // old reddit
      'span.flair',
      'span.Comment__authorFlair',

      // new reddit
      `${newLayoutId} span`
    ].join(','),
    onmatch(flair) {
      if (
        flair.childNodes.length !== 1 ||
        flair.childNodes[0].nodeType !== Node.TEXT_NODE ||
        flair.closest('.DraftEditor-root')
      )
        return;
      const newhtml = flair.textContent
        .split(' ')
        .map(segment =>
          segment.match(/^https?:\/\//u)
            ? `<a href="${segment}" class="flair-link" target="_blank" rel="noopener noreferrer">${segment}</a>`
            : segment
        )
        .join(' ');
      if (flair.innerHTML !== newhtml) flair.innerHTML = newhtml;
    }
  });
})();
