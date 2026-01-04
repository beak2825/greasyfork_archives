// ==UserScript==
// @name         AltcoinTalks Local Draft Saver
// @namespace    https://www.altcoinstalks.com/
// @version      1.0
// @description  Automatically save drafts locally when you click Preview, keep multiple drafts per topic.
// @author       Royal Cap
// @match        https://www.altcoinstalks.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553765/AltcoinTalks%20Local%20Draft%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/553765/AltcoinTalks%20Local%20Draft%20Saver.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Helpers ===
  function findMessageElements() {
    const textarea = document.querySelector('textarea[name=message], textarea#message, textarea');
    const subject = document.querySelector('input[name=subject], input#subject');
    return { textarea, subject };
  }

  function getContextKey() {
    const match = window.location.href.match(/topic=(\d+)/);
    return match ? `altc_drafts_topic_${match[1]}` : 'altc_drafts_general';
  }

  function loadDrafts() { try { return JSON.parse(localStorage.getItem('altc_drafts_v2')) || {}; } catch { return {}; } }
  function saveDrafts(obj) { try { localStorage.setItem('altc_drafts_v2', JSON.stringify(obj)); } catch (e) { console.error(e); } }
  function getDraftList(key) { const all = loadDrafts(); return all[key] || []; }
  function addDraft(key, draft, max=10) { const all = loadDrafts(); const arr = all[key] || []; arr.unshift(draft); if (arr.length > max) arr.length = max; all[key] = arr; saveDrafts(all); }

  function showToast(text) {
    let el = document.getElementById('altc-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'altc-toast';
      Object.assign(el.style, {position:'fixed', right:'14px', bottom:'14px', background:'#222', color:'#fff', padding:'8px 12px', borderRadius:'6px', zIndex:99999, transition:'opacity .35s'});
      document.body.appendChild(el);
    }
    el.textContent = text; el.style.opacity='1'; clearTimeout(el.dataset.t); el.dataset.t = setTimeout(()=> el.style.opacity='0',1800);
  }

  // === UI insertion next to Preview/Post ===
  function insertControlsNextToButtons() {
    // find likely preview/post button
    const previewBtn = document.querySelector("input[name='preview'], button[name='preview'], input[type=submit][value*='Preview'], button[type=submit][name='preview']");
    const postBtn = document.querySelector("input[name='post'], input[name='postmodify'], input[type=submit][value='Post'], input[type=submit][value='Save']");
    const ref = previewBtn || postBtn || document.querySelector('form[action*="action=post"] input[type=submit], form input[type=submit]');

    if (!ref) return false;

    // avoid inserting duplicates
    if (document.getElementById('altc-draft-controls')) return true;

    const wrapper = document.createElement('span');
    wrapper.id = 'altc-draft-controls';
    wrapper.style.marginLeft = '8px';

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.textContent = 'Drafts';
    viewBtn.title = 'View saved drafts';
    viewBtn.addEventListener('click', showDraftsModal);

    wrapper.append(viewBtn);

    ref.parentNode.insertBefore(wrapper, ref.nextSibling);
    return true;
  }

  // === Save logic ===
  function saveCurrentDraft() {
    const { textarea, subject } = findMessageElements();
    if (!textarea) { showToast('Editor not found'); return; }
    const key = getContextKey();
    addDraft(key, { subject: subject?.value || '', message: textarea.value, savedAt: new Date().toISOString() });
    showToast('Draft saved locally');
  }

  // === Draft modal ===
  function showDraftsModal() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99998';
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(780px,92%);max-height:78%;overflow:auto;background:#fff;padding:14px;border-radius:8px;z-index:99999';

    const h = document.createElement('h3'); h.textContent = 'Saved Drafts';
    modal.appendChild(h);

    const key = getContextKey();
    const drafts = getDraftList(key);
    const list = document.createElement('div');

    if (!drafts.length) {
      const p = document.createElement('div'); p.textContent = 'No drafts yet for this topic.'; list.appendChild(p);
    } else {
      drafts.forEach((d, idx) => {
        const row = document.createElement('div');
        row.style.borderBottom = '1px solid #eee';
        row.style.padding = '8px 0';

        const meta = document.createElement('div');
        meta.textContent = `${new Date(d.savedAt).toLocaleString()} — ${d.subject || '(no subject)'}`;
        meta.style.fontSize = '12px';
        meta.style.color = '#555';

        const excerpt = document.createElement('div');
        excerpt.textContent = (d.message || '').slice(0,300) + ((d.message||'').length>300 ? '…' : '');
        excerpt.style.margin = '6px 0';

        const load = document.createElement('button');
        load.type = 'button';
        load.textContent = 'Load';
        load.addEventListener('click', () => {
          const { textarea, subject } = findMessageElements();
          if (subject) subject.value = d.subject || '';
          if (textarea) textarea.value = d.message || '';
          showToast('Draft loaded');
          close();
        });

        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = 'Delete';
        del.style.marginLeft = '6px';
        del.addEventListener('click', () => {
          if (!confirm('Delete this draft?')) return;
          deleteDraftAtIndex(key, idx);
          close();
          showDraftsModal();
        });

        row.append(meta, excerpt, load, del);
        list.appendChild(row);
      });
    }

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '8px';
    closeBtn.addEventListener('click', close);
    modal.append(list, closeBtn);
    document.body.append(overlay, modal);

    function close() { modal.remove(); overlay.remove(); }
  }

  function deleteDraftAtIndex(key, idx) { const all = loadDrafts(); const arr = all[key]||[]; arr.splice(idx,1); all[key]=arr; saveDrafts(all); }

  // === Hook preview buttons to auto-save before their default action ===
  function attachPreviewSaveHook() {
    const selectors = [
      "input[name='preview']",
      "button[name='preview']",
      "input[type=submit][value*='Preview']",
      "button[type=submit][name='preview']",
      "input[data-value='Preview']"
    ];
    const nodes = selectors.map(s => Array.from(document.querySelectorAll(s))).flat();
    if (!nodes.length) return false;

    nodes.forEach(btn => {
      if (btn.dataset.altcHooked) return; btn.dataset.altcHooked = '1';
      // capture so we save before other listeners that may submit
      btn.addEventListener('click', function () {
        try { saveCurrentDraft(); } catch (e) { console.error(e); }
        // let the forum handle preview/post normally
      }, true);
    });

    return true;
  }

  // === Initialization ===
  function init() {
    insertControlsNextToButtons();
    attachPreviewSaveHook();

    // Retry once for dynamic pages
    setTimeout(() => { insertControlsNextToButtons(); attachPreviewSaveHook(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();