// ==UserScript==
// @name         Youtube Middle Click Search
// @namespace    https://greasyfork.org/users/649
// @version      2.1.7
// @description  Middle clicking the search on youtube opens the results in a new tab
// @author       Adrien Pyke
// @match        *://www.youtube.com/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6031/Youtube%20Middle%20Click%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/6031/Youtube%20Middle%20Click%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_NAME = 'YMCS';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    getQueryParameter(name, url = window.location.href) {
      name = name.replace(/[[\]]/gu, '\\$&');
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/gu, ' '));
    },
    encodeURIWithPlus(string) {
      return encodeURIComponent(string).replace(/%20/gu, '+');
    }
  };

  waitForElems({
    sel: '#search-icon-legacy',
    stop: true,
    onmatch(btn) {
      btn.onmousedown = function (e) {
        if (e.button === 1) {
          e.preventDefault();
        }
      };
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const input = Util.q('input#search').value.trim();
        if (!input) return false;

        const url = `${
          location.origin
        }/results?search_query=${Util.encodeURIWithPlus(input)}`;
        if (e.button === 1) {
          GM_openInTab(url, true);
        } else if (e.button === 0) {
          window.location.href = url;
        }

        return false;
      };
      btn.onauxclick = btn.onclick;
    }
  });

  waitForElems({
    sel: '.sbsb_c',
    onmatch(result) {
      result.onclick = function (e) {
        if (!e.target.classList.contains('sbsb_i')) {
          const search = Util.q('.sbpqs_a, .sbqs_c', result).textContent;

          const url = `${
            location.origin
          }/results?search_query=${Util.encodeURIWithPlus(search)}`;
          if (e.button === 1) {
            GM_openInTab(url, true);
          } else if (e.button === 0) {
            window.location.href = url;
          }
        } else if (e.button === 1) {
          // prevent opening in new tab if they middle click the remove button
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };
      result.onauxclick = result.onclick;
    }
  });
})();
