// ==UserScript==
// @license MIT
// @name          fokse's d2jsp post blocker v2 @ CLAUDE
// @author        Fokse + Claude + fuskukurwu
// @description   Hides posts and quoted text from a defined list of users [quotes supported]
// @namespace     jsppostblocker
// @include       https://forums.d2jsp.org/topic.php?t=*&f=*
// @include       https://forums.d2jsp.org/topic.php?t=*
// @include       https://forums.d2jsp.org/post.php
// @require       http://code.jquery.com/jquery-latest.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @version       1.23
// @downloadURL https://update.greasyfork.org/scripts/550259/fokse%27s%20d2jsp%20post%20blocker%20v2%20%40%20CLAUDE.user.js
// @updateURL https://update.greasyfork.org/scripts/550259/fokse%27s%20d2jsp%20post%20blocker%20v2%20%40%20CLAUDE.meta.js
// ==/UserScript==

/** OPTIONS **/
const QUOTE_REDACTION_MODE = 'hide'; // 'hide' or 'stars'

/** STORAGE KEYS **/
const IDS_KEY   = 'fokse_post_blocker_userlist';     // existing: array of userId strings
const NAMES_KEY = 'fokse_post_blocker_usernames';    // new: array of username strings

/** UTILS **/
const getArr = (k) => {
  const v = GM_getValue(k);
  return Array.isArray(v) ? v : [];
};
const setArr = (k, arr) => GM_setValue(k, Array.from(new Set(arr))); // dedupe
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

if (!Array.isArray(GM_getValue(IDS_KEY)))   GM_setValue(IDS_KEY, []);
if (!Array.isArray(GM_getValue(NAMES_KEY))) GM_setValue(NAMES_KEY, []);

function placeholderHtml(txt) {
  return `<center><b><span style="color:#d65a5a;">${txt}</span></b></center>`;
}

function redactTextWithStars($root) {
  // Replace visible text characters with *
  $root.find('*').addBack().contents().each(function() {
    if (this.nodeType === 3) { // text node
      this.nodeValue = this.nodeValue.replace(/\S/g, '*');
    }
  });
  // Optionally remove media inside quotes
  $root.find('img, video, iframe').remove();
}

function parseQuoteNameFromHeaderText(t) {
  // Tries common patterns:
  // "Quote (UserName @ Sep 5 2025 02:39pm)"
  // "Quote (UserName)"
  // "Quote by UserName"
  t = (t || '').trim();
  let m =
    t.match(/^Quote\s*\(([^@)]+)\s*@/i) ||
    t.match(/^Quote\s*\(([^)]+)\)/i)      ||
    t.match(/^Quote\s+by\s+([^,]+)\b/i);
  return m ? m[1].trim() : null;
}

// SIMPLE QUOTE BLOCKER - runs every 2 seconds
function blockQuotes() {
  const blockedNames = getArr(NAMES_KEY).map(norm);
  
  if (blockedNames.length === 0) return;
  
  // Find all quote1 elements and check if next sibling is quote2
  $('.quote1').each(function() {
    const quoteHeader = $(this).text();
    const username = parseQuoteNameFromHeaderText(quoteHeader);
    
    if (username && blockedNames.includes(norm(username))) {
      const $quoteContent = $(this).next('.quote2');
      if ($quoteContent.length && !$quoteContent.hasClass('blocked-quote')) {
        $quoteContent.addClass('blocked-quote');
        if (QUOTE_REDACTION_MODE === 'stars') {
          redactTextWithStars($quoteContent);
        } else {
          $quoteContent.html(placeholderHtml('Quote from blocked user hidden'));
        }
      }
    }
  });
}

function hideOrRedactQuote($headerEl, blockedNameSet) {
  // Try to find the body immediately after the header; cover multiple class names
  const bodySel = '.qmsg, .qp, .q1p, .quote-msg, .qbody';
  let $body = $headerEl.nextAll(bodySel).first();

  // Fallback: if no known body element, use the next sibling block element
  if (!$body.length) {
    const $n = $headerEl.next();
    if ($n.length) $body = $n;
  }

  if ($body && $body.length) {
    if (QUOTE_REDACTION_MODE === 'stars') {
      redactTextWithStars($body);
    } else {
      $body.html(placeholderHtml('Quote from blocked user hidden'));
    }
    return true;
  }

  // Final fallback: collapse entire quote container if it looks like one
  const $container = $headerEl.closest('.quote, .q1, .qbox, .qtbox');
  if ($container.length) {
    $container.html(placeholderHtml('Quote from blocked user hidden'));
    return true;
  }

  return false;
}

function processQuotes() {
  const blockedNames = getArr(NAMES_KEY).map(norm);
  const blockedNameSet = new Set(blockedNames);

  if (!blockedNames.length) return;

  // Likely quote header selectors on d2jsp (cover variants)
  const headerSel = '.qheader, .qt, .quote .top, .q1w, .quote > .top, .quote .qheader';

  // Pass 1: obvious headers
  $(headerSel).each(function() {
    const name = parseQuoteNameFromHeaderText($(this).text());
    if (name && blockedNameSet.has(norm(name))) {
      hideOrRedactQuote($(this), blockedNameSet);
    }
  });

  // Pass 2: generic heuristic — a single-line block starting with "Quote ("
  $('div, td').filter(function () {
    const txt = $(this).clone().children().remove().end().text().trim();
    return /^Quote\s*\(/i.test(txt) && $(this).children().length === 0;
  }).each(function() {
    const name = parseQuoteNameFromHeaderText($(this).text());
    if (name && blockedNameSet.has(norm(name))) {
      hideOrRedactQuote($(this), blockedNameSet);
    }
  });
}

function processPosts() {
  let blockedIds   = getArr(IDS_KEY);
  let blockedNames = getArr(NAMES_KEY);

  $('body > form > dl').each(function() {
    const $userLink = $('.pU > div > a', this);
    const href = $userLink.attr('href') || '';
    if (!href.includes('user.php?i=')) return;

    const userId   = href.split('=').pop();
    const userName = $userLink.text().trim();

    // If ID is blocked, ensure the name is also stored (backfill)
    if (~blockedIds.indexOf(userId) && userName && !~blockedNames.map(norm).indexOf(norm(userName))) {
      blockedNames.push(userName);
      setArr(NAMES_KEY, blockedNames);
    }

    if (~blockedIds.indexOf(userId)) {
      $('dd > div > div.bc1.upc > div.desc.cl.rc > div.fR.links', this)
        .prepend(`<b><a href="#" class="blockPost" action="unblock" userId="${userId}" userName="${userName.replace(/"/g,'&quot;')}">Unblock Posts</a></b>`);
      $('dd > div > div.bc1.upc > .sig', this).hide();
      $('.pU', this).children().eq(1).hide();
      $('div.bts', this).html(placeholderHtml('Post from that user is hidden'));
    } else {
      $('dd > div > div.bc1.upc > div.desc.cl.rc > div.fR.links', this)
        .prepend(`<b><a href="#" class="blockPost" action="block" userId="${userId}" userName="${userName.replace(/"/g,'&quot;')}">Block Posts</a></b>`);
    }
  });

  // Click handler for block/unblock
  $('.blockPost').off('click').on('click', function(e){
    e.preventDefault();
    let blockedIds   = getArr(IDS_KEY);
    let blockedNames = getArr(NAMES_KEY);

    const userId   = $(this).attr('userId');
    const userName = ($(this).attr('userName') || '').trim();

    if ($(this).attr('action') === 'block') {
      if (!~blockedIds.indexOf(userId))   blockedIds.push(userId);
      if (userName && !~blockedNames.map(norm).indexOf(norm(userName))) blockedNames.push(userName);
    } else {
      blockedIds   = blockedIds.filter(id => id !== userId);
      if (userName) {
        const n = norm(userName);
        blockedNames = blockedNames.filter(x => norm(x) !== n);
      }
    }

    setArr(IDS_KEY, blockedIds);
    setArr(NAMES_KEY, blockedNames);
    location.reload();
  });
}

function parsePage(){
  processPosts();
  processQuotes();
  
  // NEW: Simple quote blocker that runs once immediately
  blockQuotes();
  
  // Handle dynamically added content (e.g., quick replies)
  const mo = new MutationObserver(() => {
    processQuotes();
    blockQuotes();
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

parsePage();