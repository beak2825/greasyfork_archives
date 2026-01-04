// ==UserScript==
// @name         IG Feed Quick Comment (Fred Phase 1 • fixed)
// @namespace    instagram-feed-comment-fred
// @version      1.1
// @description  Add quick comment box under each feed post; submit without leaving page
// @match        https://www.instagram.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552291/IG%20Feed%20Quick%20Comment%20%28Fred%20Phase%201%20%E2%80%A2%20fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552291/IG%20Feed%20Quick%20Comment%20%28Fred%20Phase%201%20%E2%80%A2%20fixed%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const APPLY_MS = 150;
  const attached = new WeakSet();
  let applyTimer = null;

  const log = (...a) => console.log('[IG-QuickComment]', ...a);
  const warn = (...a) => console.warn('[IG-QuickComment]', ...a);

  // --- shortcode <-> mediaId helpers ---
  const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  function shortcodeToMediaId(shortcode) {
    // base64url to integer string
    let num = BigInt(0);
    for (const ch of shortcode) {
      const idx = ALPH.indexOf(ch);
      if (idx < 0) break;
      num = num * BigInt(64) + BigInt(idx);
    }
    return num.toString(); // decimal media_id as string
  }

  const getCsrf = () => document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || '';
  const APP_ID = '936619743392459'; // Instagram web app id

  const scheduleApply = () => {
    if (applyTimer) return;
    applyTimer = setTimeout(() => { applyTimer = null; tryAttach(); }, APPLY_MS);
  };

  const mo = new MutationObserver(scheduleApply);
  mo.observe(document.documentElement, { childList: true, subtree: true });
  scheduleApply();

  function tryAttach() {
    document.querySelectorAll('article').forEach((article) => {
      if (attached.has(article)) return;

      // Find the icon row (where the comment bubble lives)
      const commentSvg = article.querySelector('svg[aria-label="Comment"]');
      if (!commentSvg) return;
      const iconSection = commentSvg.closest('section');
      if (!iconSection) return;

      // Avoid injecting twice
      if (iconSection.parentElement.querySelector('.fredQuickComment')) return;

      // Extract shortcode from the anchor like /p/SHORTCODE/
      const link = article.querySelector('a[href*="/p/"], a[href*="/reel/"]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const m = href.match(/\/(?:p|reel)\/([^/?#]+)/);
      if (!m) return;
      const shortcode = m[1];
      const mediaId = shortcodeToMediaId(shortcode);
      if (!mediaId) return;

      // Build UI
      const wrap = document.createElement('div');
      wrap.className = 'fredQuickComment';
      Object.assign(wrap.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        gap: '8px'
      });

      const input = document.createElement('input');
      Object.assign(input.style, {
        flex: '1',
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'transparent',
        color: 'inherit',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '14px',
        outline: 'none'
      });
      input.placeholder = 'Add a comment…';

      const btn = document.createElement('button');
      btn.textContent = 'Post';
      Object.assign(btn.style, {
        border: 'none',
        background: 'transparent',
        color: '#0095f6',
        fontWeight: '600',
        cursor: 'pointer'
      });

      const confirm = document.createElement('span');
      confirm.textContent = '';
      Object.assign(confirm.style, {
        marginLeft: '4px',
        opacity: '0',
        transition: 'opacity 0.25s',
        fontSize: '13px'
      });

      function flash(msg, ok=true) {
        confirm.textContent = msg;
        confirm.style.color = ok ? '#00c04b' : '#ff9f43';
        confirm.style.opacity = '1';
        setTimeout(() => (confirm.style.opacity = '0'), 1300);
      }

      async function postComment() {
        const text = input.value.trim();
        if (!text) return;

        try {
          const csrftoken = getCsrf();
          if (!csrftoken) { flash('No CSRF', false); warn('Missing csrftoken'); return; }

          const body = new URLSearchParams({
            comment_text: text,
            // Optional anti-spam hint; harmless if ignored server-side:
            // containermodule: 'feed_timeline',
          });

          const res = await fetch(`${location.origin}/web/comments/${mediaId}/add/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRFToken': csrftoken,
              'X-IG-App-ID': APP_ID,
              'Referer': location.href
            },
            body,
            credentials: 'include',
            mode: 'same-origin',
            redirect: 'follow'
          });

          // 200 OK → {"status":"ok", ...}
          const textBody = await res.text();
          let json;
          try { json = JSON.parse(textBody); } catch { json = null; }

          if (res.ok && (json?.status === 'ok' || textBody.includes('"status":"ok"'))) {
            input.value = '';
            flash('✓ Posted', true);
            log('Posted to media', mediaId, 'shortcode', shortcode, json);
          } else {
            warn('Post failed', res.status, textBody);
            flash('⚠️ Failed', false);
          }
        } catch (e) {
          warn('Error posting', e);
          flash('⚠️ Error', false);
        }
      }

      btn.addEventListener('click', postComment);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') postComment();
      });

      // insert just under the icon row
      iconSection.parentElement.insertBefore(wrap, iconSection.nextSibling);
      wrap.append(input, btn, confirm);

      attached.add(article);
      log('Attached to', shortcode, '→ media', mediaId);
    });
  }
})();
