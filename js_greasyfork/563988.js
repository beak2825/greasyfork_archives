// ==UserScript==
// @name Cleaner HiAnime Comment Section
// @namespace http://tampermonkey.net/
// @license MIT
// @match *://hianime.to/*
// @icon https://hianime.to/images/icons-192.png
// @grant none
// @version 1.0
// @author TapToh
// @description Blocks spam, unmarked spoilers and modifies HiAnime comments to have comment collapsing. Configurable settings to modify behaviors and filters.
// @downloadURL https://update.greasyfork.org/scripts/563988/Cleaner%20HiAnime%20Comment%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/563988/Cleaner%20HiAnime%20Comment%20Section.meta.js
// ==/UserScript==
/*
 * Primarily made to block spam, collapsing feature introduced to address false positives instead of strictly removing everything; later polished to be a strong standalone feature.
 * Spam will get through any filter, it's a game of cat and mouse.
 * At the time of creation, the site has ineffective (if any) spam countermeasures in place, so bots don't need to change their spam messages often. Simple filters are mostly effective because of this.
 * That can change, and this script is made to handle that. Hopefully people who use scripts like this aren't the botters' target audience, so they won't need to adapt to bypassing this script's filter list.
 * Best way for users to address bypassed spam filters is to use a community approach. Dislike spam and unmarked spoiler comments, and they will be auto-collapsed or removed for everyone using this script (if set to do so).
 * This script does not intend to take the site's moderation into its' own hands. It is meant to empower you, the user, to see only that which you want to see and hide the rest.
 *
 * Default settings are strongly recommended for the best experience. Edit spam filters as necessary.
*/
(function () {
  'use strict';
  const settings = {
    // Spam handling
    // Possible states: 'remove' (removes comment), 'collapse' (comment is collapsed and greyed out), 'ignore' (leave it as is).
    filterMatchAction: 'remove', // Decide what to do with comments that match the spam filter. Possible states mentioned above.
    lowScoreAction: 'collapse', // Decide what to do with comments that are disliked by the community. Possible states mentioned above.
    lowScoreThreshold: -2, // Score is calculated as likes - dislikes. Anything less than or equal to the threshold is handled as defined above.
    filterOnlyWithoutBadges: true, // Comments marked below the score threshold will only be handled if the user doesn't have any badge, to avoid flagging established users and target spam bot or throwaway accounts.
    // Preview Bar
    showPreviewInBar: true, // When a comment is collapsed, optionally keep its' preview text next to the username in a single, compact line.
    previewMaxLength: 1000, // Maximum preview text comment length before cutoff (1000 characters is max comment length).
    forceBlurAutoCollapsedPreviews: true, // Blur the text preview for automatically collapsed comments even if the comment isn't marked as a spoiler (helps against unmarked spoilers).
    // Collapsing
    enableManualCollapsing: true, // Enable collapsing feature for regular comments.
    enablePointerCursor: false, // Enable pointer cursor on headers of collapsed comments.
  };
  // Spam filter, edit when ineffective. Use (https://www.fontspace.com/unicode/analyzer) to inspect the unicode characters in a comment to look for invisible or weird characters only used in spam.
  // If experienced, you can make your own regex filters.
  const spamFilter = [
    "n-u-d-e-s", "n*des", "nudes",
    "seductive", "arouse", "horny", "hentai", "rule34",
    "­", "﻿", // Zero width (invisible) characters used to bypass spam filters
    "username", "site", "link", "youtube", "discord", ".gg", "telgram",
    {all: ["remove", "space"]}, // Handles "Remove the space" type comments by filtering only if we find all the keywords from the array in a comment
    //new RegExp(""), // You can use regex
  ];
  const sessionState = new Map();
  const commentItemSelector = '[id^="cm-"]';
  const style = document.createElement('style');
  let css = `
    .ghost-bar {
        height: 36px !important;
        display: flex !important;
        align-items: center !important;
        cursor: pointer !important;
        padding: 0 12px !important;
        background: transparent !important;
        gap: 12px;
        overflow: hidden;
        user-select: none;
        white-space: nowrap;
    }
    .ghost-avatar {
        width: 24px !important;
        height: 24px !important;
        border-radius: 50%;
        flex-shrink: 0;
        background-size: cover;
    }
    .ghost-bar .ihead {
        display: flex !important;
        align-items: center !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        pointer-events: none !important;
        width: auto !important;
        gap: 8px;
        flex-shrink: 0;
    }
    .ghost-preview {
        font-size: 12px !important;
        opacity: 0.6;
        color: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 4px;
        transition: filter 0.1s ease;
    }
    .ghost-preview.is-spoiler-preview {
        filter: blur(3px) !important;
        user-select: none !important;
        opacity: 0.3;
        pointer-events: none;
    }
    .ghost-bar .ihead .user-name { font-size: 12px !important; }
    .ghost-bar .ihead .time { font-size: 10px !important; opacity: 0.5; }
    .is-muted-internal .ibody,
    .is-muted-internal .ihead,
    .is-muted-internal .user-avatar,
    .is-muted-internal .comment-footer {
        opacity: 0.4 !important;
        filter: grayscale(1) !important;
    }
    .is-muted-internal .dropdown-menu {
        opacity: 1 !important;
        filter: none !important;
    }
    /* Prevent parent muting from cascading to un-muted replies */
    .is-muted-internal [id^="cm-"]:not(.is-muted-internal) .ibody,
    .is-muted-internal [id^="cm-"]:not(.is-muted-internal) .ihead,
    .is-muted-internal [id^="cm-"]:not(.is-muted-internal) .user-avatar,
    .is-muted-internal [id^="cm-"]:not(.is-muted-internal) .comment-footer {
        opacity: 1 !important;
        filter: none !important;
    }
    .ghost-bar.is-muted { opacity: 0.4 !important; filter: grayscale(1) !important; }
    .is-hidden { display: none !important; }
    [class^="cm-"] {
        opacity: 1 !important;
        filter: none !important;
        position: relative;
    }
  `;
  if (settings.enablePointerCursor) {
    css += `
      .is-collapsible .ihead { cursor: pointer !important; }
    `;
  }
  style.textContent = css;
  document.head.appendChild(style);
  function isSpam(text) {
    const lowerText = text.toLowerCase();
    return spamFilter.some(m => typeof m === "string" ? lowerText.includes(m) : (m instanceof RegExp ? m.test(lowerText) : m.all.every(w => lowerText.includes(w))));
  }
  function setupCollapsible(commentEl, isAutoFiltered = false) {
    if (commentEl.dataset.processed || !commentEl.parentNode) return;
    commentEl.dataset.processed = "true";
    if (isAutoFiltered) commentEl.dataset.isSpam = "true";
    const commentId = commentEl.id;
    const originalHeader = commentEl.querySelector('.ihead');
    if (!originalHeader) return;
    commentEl.classList.add('is-collapsible');
    const bar = document.createElement('div');
    bar.className = 'ghost-bar is-hidden';
    const realImg = commentEl.querySelector('.user-avatar-img');
    const avatar = document.createElement('div');
    avatar.className = 'ghost-avatar';
    if (realImg) avatar.style.backgroundImage = `url(${realImg.src})`;
    bar.appendChild(avatar);
    const clonedHeader = originalHeader.cloneNode(true);
    const moreBtn = clonedHeader.querySelector('.ib-more');
    if (moreBtn) moreBtn.remove();
    bar.appendChild(clonedHeader);
    let previewEl = null;
    if (settings.showPreviewInBar) {
        const bodyPara = commentEl.querySelector('.ibody p');
        if (bodyPara) {
            const previewText = bodyPara.innerText.replace(/\s+/g, ' ').trim();
            if (previewText) {
                previewEl = document.createElement('span');
                previewEl.className = 'ghost-preview';
                const truncated = previewText.length > settings.previewMaxLength
                    ? previewText.substring(0, settings.previewMaxLength) + "..."
                    : previewText;
                previewEl.textContent = `${truncated}`;
                bar.appendChild(previewEl);
            }
        }
    }
    commentEl.parentNode.insertBefore(bar, commentEl);
    const collapse = (manual = false) => {
        commentEl.classList.add('is-hidden');
        bar.classList.remove('is-hidden');
        if (manual && commentId) sessionState.set(commentId, 'collapsed');
        if (previewEl) {
            const bodyContainer = commentEl.querySelector('.ibody');
            const isCurrentlySpoiler = (bodyContainer && bodyContainer.classList.contains('is-spoil')) ||
                                       commentEl.classList.contains('is-spoil');
            let shouldBlur = isCurrentlySpoiler;
            const isAuto = !manual && (commentEl.dataset.isSpam === "true");
            if (isAuto && settings.forceBlurAutoCollapsedPreviews) {
                shouldBlur = true;
            }
            if (shouldBlur) {
                previewEl.classList.add('is-spoiler-preview');
            } else {
                previewEl.classList.remove('is-spoiler-preview');
            }
        }
        if (commentEl.dataset.isSpam === "true") bar.classList.add('is-muted');
        else bar.classList.remove('is-muted');
    };
    const expand = (manual = false) => {
        bar.classList.add('is-hidden');
        commentEl.classList.remove('is-hidden');
        if (manual && commentId) sessionState.set(commentId, 'expanded');
        if (commentEl.dataset.isSpam === "true") commentEl.classList.add('is-muted-internal');
        else commentEl.classList.remove('is-muted-internal');
    };
    bar.onclick = (e) => { e.stopPropagation(); expand(true); };
    originalHeader.onclick = (e) => {
        if (e.target.closest('a') || e.target.closest('.ib-more') || e.target.closest('.btn')) return;
        collapse(true);
    };
    const savedState = sessionState.get(commentId);
    if (savedState === 'collapsed') {
        collapse(false);
    } else if (savedState === 'expanded') {
        expand(false);
    } else {
        if (isAutoFiltered) collapse(false);
        else expand(false);
    }
  }
  function scan() {
    document.querySelectorAll('.cw_l-line, .swiper-slide, ' + commentItemSelector).forEach(el => {
      if (el.dataset.processed) return;
      const bodyPara = el.querySelector('.ibody p');
      const commentText = bodyPara ? bodyPara.innerText : (el.innerText || "");
      const isSpamMatch = isSpam(commentText);
      const isSwiper = el.classList.contains('swiper-slide');
      if (isSpamMatch) {
          if (isSwiper || settings.filterMatchAction === 'remove') {
              el.remove();
              return;
          }
          if (settings.filterMatchAction === 'collapse') {
              setupCollapsible(el, true);
              return;
          }
      }
      if (settings.lowScoreAction !== 'ignore' && el.matches(commentItemSelector)) {
          const hasBadge = !!el.querySelector(".badg-level");
          if (!(settings.filterOnlyWithoutBadges && hasBadge)) {
              const l = parseInt(el.querySelector(".ib-like .value")?.textContent) || 0;
              const d = parseInt(el.querySelector(".ib-dislike .value")?.textContent) || 0;
              if (l - d <= settings.lowScoreThreshold) {
                  if (isSwiper || settings.lowScoreAction === 'remove') {
                      el.remove();
                      return;
                  }
                  setupCollapsible(el, true);
                  return;
              }
          }
      }
      if (!isSwiper) {
        if (settings.enableManualCollapsing) {
          setupCollapsible(el, false);
        } else {
          el.dataset.processed = "true";
        }
      } else {
        el.dataset.processed = "true";
      }
    });
  }
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
  scan();
})();