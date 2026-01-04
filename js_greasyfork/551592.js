// ==UserScript==
// @name         GPT-5 Token Count
// @description  Display the estimated token count of the conversation below the last answer.
// @version      1.5
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://chatgpt.com/*
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551592/GPT-5%20Token%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/551592/GPT-5%20Token%20Count.meta.js
// ==/UserScript==

'use strict';

const CONF_SHOW_LAST_ONLY  = false;
const CONF_SHOW_POST_COUNT = true;

const selector = "article .text-message";
const root = document.documentElement;
const counts = new Map();
const labels = new Map();
let prevTk = null;
let highestId = 0;

// reset on SPA navigation
const { pushState, replaceState } = history;
const wrap = fn => function (...args) {
  counts.clear();
  highestId = 0;
  prevTk = null;
  for (const el of labels.values()) if (el && el.remove) el.remove();
  labels.clear();
  return fn.apply(this, args);
};
history.pushState = wrap(pushState);
history.replaceState = wrap(replaceState);

let c = 0;
const observer = new MutationObserver(muts => {
  for (const m of muts) {
    let t = m.target;

    if      (m.type === "attributes" && t.nodeType === Node.ELEMENT_NODE && t.tagName === "ARTICLE") {}
    else if (m.type === "childList"  && t.nodeType === Node.ELEMENT_NODE && t.tagName === "DIV" && t.classList.contains('group/turn-messages')) {}
    else continue;

    const article = t?.closest('article');
    const text = article?.querySelector('.text-message');
    if (!text) continue;

    const msgUid = article.getAttribute("data-turn-id");
    const msgId  = article.getAttribute("data-testid");
    const assist = article.getAttribute("data-turn") === 'assistant';

    if (!msgId) continue;
    const id     = parseInt(msgId.split('-').pop(), 10);
    const count  = Math.round(text.textContent.trim().length * 0.235); // 0.235 tokens/char

    counts.set(id, count);

    // total = sum of counts for keys <= id
    let total = 0;
    for (const [k, v] of counts) if (k <= id) total += v;
    const count_fmt = CONF_SHOW_POST_COUNT ? Number(count).toLocaleString('en-US') : null;
    const total_fmt = Number(total).toLocaleString('en-US');

    if (assist) {
      const threeDots = article.querySelector('button[aria-label="More actions"]');
      const parent = threeDots?.parentElement;
      //console.log({threeDots, parent})
      if (parent) {

        if (CONF_SHOW_LAST_ONLY) {
          if (id < highestId) continue;
          else {
            highestId = id;
            if (prevTk) prevTk.remove();
          }
        }

        // remove old label on reevaluation
        if (labels.has(id)) {
          const old = labels.get(id);
          if (old && old.remove) old.remove();
        }

        const label = document.createElement('span');
        //console.log({label})
        label.textContent = (count_fmt?'('+count_fmt+') ':'') + total_fmt;
        // label.textContent = (count_fmt?count_fmt+' | ':'') + total_fmt;
        label.style.opacity = '0.5';
        label.style.fontSize = '.825em';
        label.style.marginLeft = 'auto';
        parent.appendChild(label);

        labels.set(id, label);
        prevTk = label;
      }
    }
    //console.log('id', id, ', total', total, counts)
  }
});

observer.observe(root, {
  subtree: true,
  attributes: true,
  childList: true,
});
