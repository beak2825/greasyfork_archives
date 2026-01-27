// ==UserScript==
// @name         JavDB Fast Watch (Tag-Proximity Edition)
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  Uses proximity to status tags to find the correct Delete button. Now includes Batch Mark Watched (GET->DELETE->POST).
// @author       Gemini
// @match        https://javdb.com/v/*
// @match        https://javdb.com/users/want_watch_videos*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562942/JavDB%20Fast%20Watch%20%28Tag-Proximity%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562942/JavDB%20Fast%20Watch%20%28Tag-Proximity%20Edition%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- SHARED UTILS ---
  const log = (msg) =>
    console.log(`%c[FastWatch] ${msg}`, 'color: #00d1b2; font-weight: bold;');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- ORIGINAL LOGIC (Single Movie Page) ---
  // (Unchanged as requested)
  if (window.location.pathname.startsWith('/v/')) {
    const BTN_ID = 'fast-watch-trigger';
    let isProcessing = false;

    const init = () => {
      const container = document.querySelector('.review-buttons');
      if (!container || document.getElementById(BTN_ID)) return;

      const fastBtn = document.createElement('a');
      fastBtn.id = BTN_ID;
      fastBtn.className = 'button is-primary is-small';
      fastBtn.style.marginLeft = '10px';
      fastBtn.innerHTML = `<span class="icon is-small"><i class="fas fa-bolt"></i></span><span>Fast Watch</span>`;

      fastBtn.onclick = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        isProcessing = true;
        fastBtn.classList.add('is-loading');

        try {
          await executeLogic();
        } catch (err) {
          log(`Error: ${err.message}`);
        } finally {
          isProcessing = false;
          fastBtn.classList.remove('is-loading');
        }
      };

      container.appendChild(fastBtn);
    };

    async function executeLogic() {
      window.confirm = () => true;

      const allTags = Array.from(
        document.querySelectorAll('.review-title .tag'),
      );
      const watchedTag = allTags.find((el) =>
        el.textContent.includes('watched this movie'),
      );
      const wantTag = allTags.find((el) =>
        el.textContent.includes('want to watch'),
      );

      const getDeleteBtnForTag = (tag) => {
        if (!tag) return null;
        const parentSection =
          tag.closest('.column') || tag.closest('.review-buttons');
        return Array.from(
          parentSection.querySelectorAll('a.is-danger, button.is-danger'),
        ).find((btn) => btn.textContent.includes('Delete'));
      };

      if (watchedTag) {
        log('Detected: WATCHED state.');
        const deleteBtn = getDeleteBtnForTag(watchedTag);
        if (deleteBtn) {
          log('Clicking Watched Delete button...');
          deleteBtn.click();
        }
        return;
      }

      if (wantTag) {
        log('Detected: WANT state.');
        const deleteBtn = getDeleteBtnForTag(wantTag);
        if (deleteBtn) {
          log('Removing from Wanted list first...');
          deleteBtn.click();
          log('Waiting for Watched trigger...');
          await new Promise((r) => setTimeout(r, 1200));
        }
      }

      const watchedArea =
        document.querySelectorAll('.review-buttons .column')[1] ||
        document.querySelector('.review-buttons');
      const watchTrigger = Array.from(
        watchedArea.querySelectorAll('a.button, button.button'),
      ).find(
        (btn) => !btn.classList.contains('is-danger') && btn.id !== BTN_ID,
      );

      if (watchTrigger) {
        log('Opening watch modal...');
        watchTrigger.click();
        await handleModalSubmit();
      }
    }

    async function handleModalSubmit() {
      for (let i = 0; i < 30; i++) {
        const submitBtn = document.querySelector(
          '#new_review input[type="submit"], #review-save, .review-submit-btn input',
        );
        if (submitBtn) {
          log('Modal found. Saving...');
          submitBtn.click();
          return;
        }
        await new Promise((r) => setTimeout(r, 150));
      }
    }

    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();
  }

  // --- NEW LOGIC (Batch Mark Watched for "Want to Watch" Page) ---
  if (window.location.href.includes('/users/want_watch_videos')) {
    const BATCH_BTN_ID = 'batch-mark-watched-trigger';

    const initBatchLogic = () => {
      const movieList = document.querySelector('.movie-list');
      if (!movieList || document.getElementById(BATCH_BTN_ID)) return;

      // NEW: Only render if there are actually movies in the list
      const movies = movieList.querySelectorAll(
        '.item .box > a, .item > a[href^="/v/"]',
      );
      if (movies.length === 0) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'batch-mark-wrapper';
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.marginLeft = '10px';
      wrapper.style.marginTop = '0';
      wrapper.style.marginBottom = '0';

      const batchBtn = document.createElement('a');
      batchBtn.id = BATCH_BTN_ID;
      batchBtn.className = 'button is-danger is-small is-rounded';
      batchBtn.innerHTML = `<span>⚡ Batch Mark Watched</span>`;

      batchBtn.onclick = async (e) => {
        e.preventDefault();
        if (batchBtn.classList.contains('is-loading')) return;

        if (
          !confirm(
            "Are you sure you want to mark all visible movies as WATCHED? This will remove them from 'Want to Watch'.",
          )
        )
          return;

        batchBtn.classList.add('is-loading');
        await executeBatchMarking(movieList, batchBtn);
        batchBtn.classList.remove('is-loading');
      };

      wrapper.appendChild(batchBtn);

      const existingWrapper = document.querySelector('.batch-opener-wrapper');
      if (existingWrapper) {
        existingWrapper.appendChild(wrapper);
      } else {
        wrapper.style.marginBottom = '10px';
        movieList.parentNode.insertBefore(wrapper, movieList);
      }
    };

    async function executeBatchMarking(container, btn) {
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]',
      )?.content;
      if (!csrfToken) {
        alert('Error: Could not find CSRF Token. Refresh the page.');
        return;
      }

      const items = Array.from(container.querySelectorAll('.item'));
      const total = items.length;
      let successCount = 0;

      log(`Found ${total} movies to process.`);

      for (let i = 0; i < total; i++) {
        const item = items[i];
        const link = item.querySelector('a[href^="/v/"]');
        if (!link) continue;

        const movieUrl = link.href;
        const movieId = link.getAttribute('href').split('/')[2];

        btn.innerHTML = `<span>Processing ${i + 1}/${total}...</span>`;
        item.style.opacity = '0.5';
        item.style.pointerEvents = 'none';

        try {
          await processMovieTransition(movieUrl, movieId, csrfToken);

          item.style.opacity = '0.2';
          const badge = document.createElement('div');
          badge.style.cssText =
            'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,255,0,0.1);display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bold;pointer-events:none;z-index:10;';
          badge.innerText = '✅ Watched';
          item.style.position = 'relative';
          item.appendChild(badge);

          successCount++;
        } catch (err) {
          console.error(err);
          log(`Failed to mark ${movieId}: ${err.message}`);
          item.style.opacity = '1';
          item.style.border = '2px solid red';
          item.style.pointerEvents = 'auto';
        }

        await sleep(1500);
      }

      btn.innerHTML = `<span>✅ Batch Complete (${successCount}/${total})</span>`;
      btn.classList.replace('is-danger', 'is-success');
    }

    async function processMovieTransition(url, movieId, csrfToken) {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const deleteBtn = Array.from(
        doc.querySelectorAll('.review-buttons a.is-danger'),
      ).find((el) => el.textContent.includes('Delete'));

      if (deleteBtn) {
        const deleteUrl = deleteBtn.getAttribute('href');
        log(`Found existing review for ${movieId}. Deleting...`);

        await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest',
          },
        });
        await sleep(500);
      }

      const authTokenInput = doc.querySelector(
        'input[name="authenticity_token"]',
      );
      const authToken = authTokenInput ? authTokenInput.value : '';

      const bodyParams = new URLSearchParams();
      if (authToken) bodyParams.append('authenticity_token', authToken);
      bodyParams.append('video_review[content]', '');
      bodyParams.append('video_review[status]', 'watched');
      bodyParams.append('commit', 'Save');

      log(`Posting 'Watched' status for ${movieId}...`);
      const postResponse = await fetch(
        `https://javdb.com/v/${movieId}/reviews`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest',
          },
          body: bodyParams.toString(),
        },
      );

      if (!postResponse.ok) {
        throw new Error(`POST Failed: ${postResponse.status}`);
      }
    }

    const observer = new MutationObserver((mutations) => {
      if (
        document.querySelector('.movie-list') &&
        !document.getElementById(BATCH_BTN_ID)
      ) {
        initBatchLogic();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    initBatchLogic();
  }
})();