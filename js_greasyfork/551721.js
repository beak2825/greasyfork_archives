// ==UserScript==
// @name         ChatGPT Collapse Messages
// @description  Collapse messages by clicking the bottom bar. Autocollapse on open. Remembers collapse state. Add bar colors and separators. Mobile: max size for the textarea when not focused.
// @version      1.9
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551721/ChatGPT%20Collapse%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/551721/ChatGPT%20Collapse%20Messages.meta.js
// ==/UserScript==

'use strict';

const ALPHA = "04"; // 0xFF, controls the highlight intensity. "0F" best on mobile

/* __Hierarchy__:
article(maybe .text-collapsed)
> .text-base
  > div
    > .text-message (main message)
    > .z-0 (bottom bar)
    > other
*/

GM_addStyle(`
/* Mobile fix: remove the white ring on open. */
button.focus\\:ring-white {
  box-shadow: none !important;
}
@media (pointer: coarse) {
  /* Mobile fix: smaller header. */
  :root { --header-height: calc(var(--spacing)*8) !important; }

  /* Mobile fix: full width messages */
   :root { --user-chat-width: 90% !important; }

  /* Mobile fix: 10px margin */
  .text-base {
    padding-left: 10px;
    padding-right: 10px;
  }
  /* Mobile fix: clicking the "Thinking mode Standard/Extended" pill closes it, raise the left side */
  button.__composer-pill {
    z-index: 10;
    pointer-events: auto;
  }
  /* Mobile fix: bottom bar buttons are transparent/clickthrough */
  article button {
    pointer-events: auto;
  }
  /* Mobile fix: minimise the textarea when not focused to save space. */
  html:not(:has(input:focus, textarea:focus, [contenteditable="true"]:focus)) #prompt-textarea {
    max-height: 2.6em !important;
    margin-top: 0 !important;
    padding-bottom: 5px !important;
  }
}

article {
  padding-bottom: 10px !important;
}
article .text-base {
  padding-top: 0px;
}

article.text-collapsed .text-base > div > div:has(.text-message) {
  max-height: 6em !important;
  overflow: hidden;

  --fade: 4.5em;
  --mask: linear-gradient(
    to bottom,
    #000 0,
    #000 calc(100% - var(--fade)),
    transparent 100%
  );
  -webkit-mask: var(--mask) no-repeat;
  mask: var(--mask) no-repeat;
}

article .text-base > div {
  border-bottom: solid 10px #8884;
}
article[data-turn="user"] .text-base > div {
  border-bottom: solid 2px #8884;
}

article .text-base > div > div.z-0  {
  background: linear-gradient(to bottom, transparent 0%, #00FF00${ALPHA} 100%);
}
article.text-collapsed .text-base > div > div.z-0  {
  background: linear-gradient(to bottom, transparent 0%, #FF0000${ALPHA} 100%);
}
`);

const ARTICLE_SELECTOR = 'article';

const LS_KEY = 'article_state_db_v1';
const STATE = { COLLAPSED: 0, EXPANDED: 1 };
const DB_CACHE_MS = 500;
let dbCache = null;
let dbCacheAt = 0;

// Debounce DB parse
function loadStateDB() {
  const now = Date.now();
  if (dbCache && (now - dbCacheAt) < DB_CACHE_MS) return dbCache;
  try {
    const raw = localStorage.getItem(LS_KEY);
    dbCache = raw ? JSON.parse(raw) : {};
    if (typeof dbCache !== 'object' || Array.isArray(dbCache) || dbCache === null) dbCache = {};
  } catch {
    dbCache = {};
  }
  dbCacheAt = now;
  return dbCache;
}
function saveStateDB(db) {
  dbCache = db;
  dbCacheAt = Date.now();
  try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch {}
}
function hasId(id) {
  const db = loadStateDB();
  return Object.prototype.hasOwnProperty.call(db, id);
}
function setIdState(id, stateEnum) {
  const db = loadStateDB();
  db[id] = stateEnum;
  saveStateDB(db);
}

const scrollParent = el => {
  for (let e = el; e; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (/(auto|scroll|overlay)/.test(s.overflowY) && e.scrollHeight > e.clientHeight) return e;
  }
  return document.scrollingElement || document.documentElement;
};

// Note: 'data-turn-id' cannot be trusted for new messages so use 'convid#testid'
function getId(article) {
  let convid = location.pathname.match(/\/c\/([\-a-zA-Z0-9]+)/)?.[1];
  let testid = article.getAttribute('data-testid')?.match(/(\d+)/)?.[1];
  if (convid && testid) return convid+'#'+testid;
  return null
}

function doArticle(article, onLoad) {
  const text = article.querySelector('.text-message');
  if (!text) return;

  const id = getId(article);

  // On load: consult DB and apply initial state
  if (id && !id.startsWith('request-')) {
    const db = loadStateDB();
    // console.log(article, text, id, db[id])
    if (onLoad) {
      if (!hasId(id)) {
        // collapse all on open
        setTimeout(() => { article.classList.add('text-collapsed'); }, 200);
        setIdState(id, STATE.COLLAPSED);
      } else if (db[id] === STATE.COLLAPSED) {
        setTimeout(() => { article.classList.add('text-collapsed'); }, 200);
      }
    } else {
        // New messages
        const user = (article.getAttribute('data-turn') === 'user');
        setIdState(id, user ? STATE.COLLAPSED : STATE.EXPANDED);
    }
  }

  // Click: toggle and persist new state
  article.addEventListener('click', (e) => {
    const INSIDE_BOTTOM_BAR = '.text-base > div > .z-0';
    if (!(e?.target?.closest(INSIDE_BOTTOM_BAR))) return;
    if (e?.target?.closest('button')) return; // ignore buttons on the bar

    const sc = scrollParent(e.currentTarget || article);
    const adding = !article.classList.contains('text-collapsed'); // about to collapse
    const fromBottom = adding ? (sc.scrollHeight - sc.scrollTop - sc.clientHeight) : 0;

    article.classList.toggle('text-collapsed');

    if (adding) requestAnimationFrame(() => {
      sc.scrollTop = Math.max(0, sc.scrollHeight - sc.clientHeight - fromBottom);
    });

    if (id) setIdState(id, adding ? STATE.COLLAPSED : STATE.EXPANDED);
    e.stopPropagation();
  }, true);
}

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {

          // Check for articles
          if (node.matches(ARTICLE_SELECTOR)) {
            // console.log("ONLOAD", node)
            doArticle(node, false);
          }
          node.querySelectorAll(ARTICLE_SELECTOR).forEach(descendantArticle => {
            // console.log("LIVE", descendantArticle)
            doArticle(descendantArticle, true);
          });

        }
      });
    }
  });
});

observer.observe(document.documentElement, { childList: true, subtree: true });
