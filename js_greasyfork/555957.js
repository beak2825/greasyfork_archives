// ==UserScript==
// @name        openrouter style
// @description openrouter style2
// @match       https://openrouter.ai/chat*
// @grant       none
// @version     1.20
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555957/openrouter%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/555957/openrouter%20style.meta.js
// ==/UserScript==

// (() => {
//   const FLAG   = 'data-hl',          // prevents double work
//         BORDER = '4px solid red';

//   const paint = el => {
//     // el.style.border = BORDER; // debug outline
//     el.setAttribute(FLAG, '');
//     // TODO: EXTRACT MSG-ID (IS it set instantly?) and restore .text-collapsed state; also store it in LS later
//   };

//   const touch = node => {            // node + descendants
//     if (node.nodeType !== 1) return;

//     if (node.matches('[data-message-id]') && !node.hasAttribute(FLAG)) paint(node);

//     node.querySelectorAll('[data-message-id]').forEach(el => {
//       if (!el.hasAttribute(FLAG)) paint(el);
//     });
//   };

//   // handle what is already on the page
//   document.querySelectorAll('[data-message-id]').forEach(paint);

//   // handle what arrives later
//   new MutationObserver(recs =>
//     recs.forEach(r => r.addedNodes.forEach(touch))
//   ).observe(document.body, { childList: true, subtree: true }); // only creations watched
// })();


/* ================================================================
   CSS (auto-injected by Tampermonkey / Greasemonkey)
================================================================ */
const ALPHA = '19';

GM_addStyle(`
/* fade text and collapse */
[data-message-id].text-collapsed > div > div:nth-child(2 of :not(.text-xs)) {
  color: red !important;
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
  mask:        var(--mask) no-repeat;
}

/* green overlay when the message comes from the user --------------- */
[data-message-id].text-collapsed > div.group.justify-end > :last-child {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #00FF00${ALPHA} 100%
  );
}
[data-message-id] > div.group.justify-end > :last-child {
  min-width: 100%; /* put buttons right */
}

/* red overlay when the message comes from the LLM ------------------ */
[data-message-id].text-collapsed > div.group.justify-start > :last-child {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #FF0000${ALPHA} 100%
  );
}


[data-message-id].text-collapsed div:has(>div[title="Collapse reasoning"]) {
  display: none !important;
}

`);





/* ================================================================
   Helpers
================================================================ */
const scrollParent = el => { // get scroll container parent of an el, because scroll is reported per container
  for (let e = el; e; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (/(auto|scroll|overlay)/.test(s.overflowY) && e.scrollHeight > e.clientHeight) {
      return e;
    }
  }
  return document.scrollingElement || document.documentElement;
};

/* ================================================================
   Click logic
================================================================ */
function handleClick(e) {
  /* ---------- normalise target to an Element -------------------- */
  let el = e.target;
  if (el && el.nodeType !== Node.ELEMENT_NODE) el = el.parentElement;
  if (!el) return;

  // console.log(e.target)

  /* ---------- locate message container -------------------------- */
  const msg = el.closest('[data-message-id]');
  if (!msg) return;
  // {
  //     const sc        = scrollParent(msg);   // scroll container
  //     console.log("HEIGHT", {scrollHeight: sc.scrollHeight}
  // }

  /* ---------- message is collapsed -> click always opens -- */
  if (msg.classList.contains('text-collapsed')) {
    // msg.classList.remove('text-collapsed');
    /* keep viewport anchored when the message expands ------------- */
    const sc        = scrollParent(msg);   // scroll container
    const h0        = msg.offsetHeight;    // height while collapsed

    msg.classList.remove('text-collapsed'); // expand it
    requestAnimationFrame(() => {          // after the new height is known
      let change = msg.offsetHeight - h0;
      // console.log("HEIGHT", {sc, h0, new: msg.offsetHeight, change, scrollHeight: sc.scrollHeight})
      sc.scrollHeight -= change; // scroll up by the growth
    });

    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    return;
  }

  /* ---------- ignore buttons (for the bottom bar) --------------- */
  if (el.closest('button, [role="button"]')) return;

  /* ---------- if click is in container or bottom bar ------------- */
  const firstBlock = msg.querySelector(':scope > div');                    // the container
  const bottomBar  = msg.querySelector(':scope > div > div:last-of-type'); // the bottom bar

  const hitFirstBlock = (el === firstBlock);                 // the base block itself
  const hitBottomBar  = bottomBar && bottomBar.contains(el); // the bar or its children

  if (hitFirstBlock || hitBottomBar) {
    const sc          = scrollParent(msg);
    const adding      = !msg.classList.contains('text-collapsed'); // true → will collapse
    const fromBottom  = adding ? sc.scrollHeight - sc.scrollTop - sc.clientHeight : 0;

    msg.classList.toggle('text-collapsed');

    if (adding) {
      requestAnimationFrame(() => {
        sc.scrollTop = Math.max(0, sc.scrollHeight - sc.clientHeight - fromBottom);
      });
    }
  }
}

/* capture:true so we run before React’s delegated listener
   passive:false so we can preventDefault() when swallowing clicks */
document.addEventListener('click', handleClick, { capture: true, passive: false });






GM_addStyle(`
/* DARK MODE */
html.dark * {
  --foreground: 0 0% 85% !important;
  color: hsl(var(--foreground));
}

/* MOBILE */
@media (pointer: coarse) {
/*   div[data-message-id] {
    // Container margin;
    padding-left: 0px;
    padding-right: 0px;
  } */
  /*
    user => [data-message-id]>div.group.justify-end
    llm  => [data-message-id]>div.group.justify-start
  */


  div[data-message-id] {
    padding-left: 0px;
    padding-right: 0px;
  }
/*   div[data-message-id]>div.group.justify-end {
    padding-left:  26px;
    padding-right: 10px;
  } */

  /* Chat margin */
  .py-3.px-4.font-normal.relative.border.rounded-lg.col-start-1.row-start-1 {
    padding-left:  10px;
    padding-right: 10px;
  }

  /* ===========================  */

  /* OPENROUTER HEADER */
  #main-nav {
    //padding: 0;
   // zoom: 0.9;
  }

  /* CHAT LISTING */
  .w-full.flex-shrink-0.px-2.mt-2:has(button):first-of-type {
    margin-top: 4px; // 0px;
    zoom: 0.9;
  }
  /* CHAT LISTING > CHAT BUTTON */
  .w-full.flex-shrink-0.px-2.mt-2 button {
    height: 2em;
  }

  /* MODEL BUTTON LIST */
  .relative.flex-1.flex.flex-col.min-w-0.min-h-0.h-full.pt-2:has(section[aria-roledescription="carousel"]) {
    padding-top: 4px; // 0px;
     // zoom: 0.9; // causes font size change
  }

  /* CHAT */
  .rounded-xl.overflow-hidden.p-2.border.border-slate-4.w-full.max-w-4xl.mx-auto.flex-shrink-0:first-of-type {
    padding: 0px;
  }

  .rounded-xl.overflow-hidden.p-2.border.border-slate-4.w-full.max-w-4xl.mx-auto.flex-shrink-0:first-of-type .relative.h-9 {
    zoom: 0.75;
  }

  .rounded-xl.overflow-hidden.p-2.border.border-slate-4.w-full.max-w-4xl.mx-auto.flex-shrink-0:first-of-type div:has(> textarea) {
    /* CHATBOX PADDING
           padding-top: 0px;
           padding-bottom: 0px; */
  }

  .rounded-xl.overflow-hidden.p-2.border.border-slate-4.w-full.max-w-4xl.mx-auto.flex-shrink-0:first-of-type   .flex.gap-1.mt-2 {
   zoom: 0.9;
   margin: 0px;
  }

  /* minimise the textarea when not focused */
  html:not(:has(input:focus, textarea:focus, [contenteditable="true"]:focus)) .rounded-xl.overflow-hidden.p-2.border.border-slate-4.w-full.max-w-4xl.mx-auto.flex-shrink-0 textarea {
    max-height: 1.5em !important;
  }
}
`);



// -------------------------------------

(function () {
  'use strict';

  function handleKeydown(e) {
    const t = e.target;
    if (!t || t.tagName !== 'TEXTAREA') return;

    // Enter?
    const isEnter =
      e.key === 'Enter' ||
      e.keyCode === 13 ||
      e.which === 13;

    if (!isEnter) return;

    // Block SEND handlers
    e.preventDefault();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    e.stopPropagation();

    // Insert exactly one "\n" at caret
    const val   = t.value;
    const start = t.selectionStart != null ? t.selectionStart : val.length;
    const end   = t.selectionEnd   != null ? t.selectionEnd   : start;

    t.value = val.slice(0, start) + '\n' + val.slice(end);
    t.selectionStart = t.selectionEnd = start + 1;

    // Tell React/frameworks that the value changed
    t.dispatchEvent(new Event('input',  { bubbles: true }));
    t.dispatchEvent(new Event('change', { bubbles: true }));

    // Try to keep autosize behavior
    try {
      t.style.height = 'auto';
      t.style.height = t.scrollHeight + 'px';
    } catch (_) {
      // ignore if not allowed / not needed
    }
  }

  // Only keydown – avoids double/triple newlines
  document.addEventListener('keydown', handleKeydown, true);
})();