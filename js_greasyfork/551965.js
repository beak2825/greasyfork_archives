// ==UserScript==
// @name         Neopets Auto Zapper Pro V2
// @namespace    Neopets Auto Zapper Pro
// @version      2.1.1
// @description  Auto-zapper with persistent pet memory and lab2 cooldown sync
// @author       combined: badsk8700o / thezuki10 / nadinejun0 + modifications
// @match        https://www.neopets.com/lab.phtml
// @match        https://www.neopets.com/lab2.phtml
// @match        https://www.neopets.com/process_lab2.phtml
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551965/Neopets%20Auto%20Zapper%20Pro%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/551965/Neopets%20Auto%20Zapper%20Pro%20V2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== STORAGE (Using GM for persistence; fallback/sync with localStorage) ==========
  const STORE = {
    getPet: () => {
      const gm = GM_getValue('zapPet', null);
      if (gm) return gm;
      // fallback to older script
      try { return localStorage.getItem('lastSelectedPet') || null; } catch (e) { return null; }
    },
    setPet: (v) => {
      GM_setValue('zapPet', v);
      try { localStorage.setItem('lastSelectedPet', v); } catch (e) {}
    },
    clearPet: () => {
      GM_setValue('zapPet', null);
      try { localStorage.removeItem('lastSelectedPet'); } catch (e) {}
    },

    getCount: () => parseInt(GM_getValue('zapCount', '0'), 10),
    setCount: (n) => GM_setValue('zapCount', String(n)),
    incCount: () => STORE.setCount(STORE.getCount() + 1),

    getDate: () => GM_getValue('zapDate', null),
    setDate: (d) => GM_setValue('zapDate', d),

    getRemaining: () => parseInt(GM_getValue('zapRemaining', '0'), 10),
    setRemaining: (n) => GM_setValue('zapRemaining', String(n)),

    getTodayNST: () => {
      const now = new Date();
      const nst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      return nst.toISOString().split('T')[0];
    },

    checkAndResetDay: () => {
      const today = STORE.getTodayNST();
      const stored = STORE.getDate();
      if (stored !== today) {
        STORE.setDate(today);
        STORE.setCount(0);
        return true;
      }
      return false;
    },
  };

  function log(...args) { console.log('[AutoZapper]', ...args); }
  function randDelay(min = 800, max = 1800) { return min + Math.floor(Math.random() * (max - min + 1)); }

  function getZapsFromPage() {
    const text = document.body.innerText || '';
    let match = text.match(/Zaps Left Today:\s*(\d+)\s*\/\s*(\d+)/i);
    if (match) return { remaining: parseInt(match[1], 10), total: parseInt(match[2], 10) };
    match = text.match(/(\d+)\s*\/\s*(\d+)\s*(?:zaps?|Zaps?)/i);
    if (match) return { remaining: parseInt(match[1], 10), total: parseInt(match[2], 10) };
    log('Could not find zap count; defaulting to 0');
    return { remaining: 0, total: 0 };
  }

  // ========== LAB.PHTML ==========
  function handleLabPage() {
    if (!window.location.pathname.includes('lab.phtml')) return false;
    log('On lab.phtml - going to lab2');
    setTimeout(() => {
      let form = document.querySelector('form[action="lab2.phtml"]') || document.querySelector('form[action*="lab2"]');
      if (!form) {
        const allForms = document.querySelectorAll('form');
        allForms.forEach((f) => { if (!form && (f.action && f.action.includes('lab2'))) form = f; });
      }
      if (form) form.submit();
      else setTimeout(() => { window.location.href = 'https://www.neopets.com/lab2.phtml'; }, 1000);
    }, 1500);
    return true;
  }

  // ========== UTIL: Wait for STOP cue and cooldown ==========
  // Looks for visible text "STOP - Choose Different Pet" and parses nearby countdown or waits until it's removed.
  function waitForStopCueThenSubmit(petName, form, userStoppedFlag) {
    // If user stopped via UI, do nothing
    if (userStoppedFlag && userStoppedFlag.value) {
      log('User cancelled auto-submit (stop flag). Aborting submit.');
      return;
    }

    // try to find node that contains the STOP phrase
    const findStopNode = () => Array.from(document.querySelectorAll('body *')).find(el => {
      try { return (el.innerText || '').match(/STOP\s*-\s*Choose Different Pet/i); } catch (e) { return false; }
    });

    const stopNode = findStopNode();

    if (!stopNode) {
      // no STOP cue on page. submit after small delay
      log('No STOP cue found. Submitting after random delay.');
      setTimeout(() => {
        if (!(userStoppedFlag && userStoppedFlag.value)) form.submit();
      }, randDelay());
      return;
    }

    log('STOP cue found. Attempting to parse countdown or observe DOM.');

    // Try to parse seconds from text near the node (parent or same container)
    const candidateText = (stopNode.parentElement && stopNode.parentElement.innerText) ? stopNode.parentElement.innerText : stopNode.innerText;
    let secs = null;

    // mm:ss or ss
    const mmss = candidateText.match(/(\d{1,2}):(\d{2})/);
    if (mmss) secs = parseInt(mmss[1], 10) * 60 + parseInt(mmss[2], 10);
    else {
      const sMatch = candidateText.match(/(\d{1,4})\s*seconds?/i);
      if (sMatch) secs = parseInt(sMatch[1], 10);
    }

    if (secs !== null && !Number.isNaN(secs)) {
      const ms = (secs + 1) * 1000; // small buffer
      log('Parsed countdown seconds:', secs, 'waiting', ms, 'ms before submit');
      setTimeout(() => {
        if (!(userStoppedFlag && userStoppedFlag.value)) form.submit();
      }, ms);
      return;
    }

    // If no numeric countdown, observe DOM for removal or change
    const observer = new MutationObserver((mutationsList) => {
      // Re-check existence of STOP text
      const still = findStopNode();
      if (!still) {
        observer.disconnect();
        log('STOP cue removed from page. Proceeding to submit.');
        setTimeout(() => {
          if (!(userStoppedFlag && userStoppedFlag.value)) form.submit();
        }, randDelay());
      } else {
        // optional: check again for digits as node updates
        const txt = still.innerText || still.parentElement && still.parentElement.innerText || '';
        const s = txt.match(/(\d{1,2}):(\d{2})/) || txt.match(/(\d{1,4})\s*seconds?/i);
        if (s) {
          observer.disconnect();
          let secs2;
          if (s.length === 3) secs2 = parseInt(s[1], 10) * 60 + parseInt(s[2], 10);
          else secs2 = parseInt(s[1], 10);
          const ms2 = (secs2 + 1) * 1000;
          log('Found countdown while observing. Waiting', ms2, 'ms then submit.');
          setTimeout(() => {
            if (!(userStoppedFlag && userStoppedFlag.value)) form.submit();
          }, ms2);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Safety fallback: after 40s, stop observing and submit if not user stopped
    setTimeout(() => {
      try { observer.disconnect(); } catch (e) {}
      if (!(userStoppedFlag && userStoppedFlag.value)) {
        log('Fallback timeout reached. Submitting.');
        setTimeout(() => { if (!(userStoppedFlag && userStoppedFlag.value)) form.submit(); }, randDelay());
      }
    }, 40000);
  }

  // ========== LAB2.PHTML ==========
  function handleLab2Page() {
    if (!window.location.pathname.includes('lab2.phtml')) return false;
    log('On lab2.phtml - build UI and manage pet memory');

    const isNewDay = STORE.checkAndResetDay();
    const storedPet = STORE.getPet();
    const used = STORE.getCount();
    const { remaining, total } = getZapsFromPage();

    log('Day reset?', isNewDay, '| Stored pet:', storedPet, '| Used:', used, '| Remaining:', remaining);

    const petListRoot = document.querySelector('#bxlist');
    const form = document.querySelector('form[action="process_lab2.phtml"]');
    if (!petListRoot || !form) return false;

    const slider = document.querySelector('.bx-wrapper');
    if (slider) slider.style.display = 'none';

    // small flag object to allow closures to modify stopped state
    const userStoppedFlag = { value: false };

    // Counter box (kept visually similar)
    const counterBox = document.createElement('div');
    counterBox.style.cssText = 'text-align:center;margin:16px auto;padding:12px;background:#e9ecef;border-radius:8px;max-width:600px;font-weight:bold;font-size:14px;';
    counterBox.innerHTML = `<div>Total Zaps Today: <span>${total}</span></div><div>Used: <span>${used}</span> | Remaining: <span>${remaining}</span></div>`;

    // Grid container (keeps much of original structure)
    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding:16px;max-width:900px;margin:16px auto;';

    const petLis = Array.from(petListRoot.querySelectorAll('li'));
    const petCards = [];

    petLis.forEach(li => {
      const radio = li.querySelector('input[type="radio"]');
      const img = li.querySelector('img');
      const label = li.querySelector('b');
      if (!radio || !img) return;
      const petName = radio.value || (label && label.innerText);
      if (!petName) return;

      const card = document.createElement('div');
      card.style.cssText = 'border:3px solid #ccc;border-radius:8px;padding:12px;background:white;cursor:pointer;text-align:center;transition:all .2s;box-shadow:0 2px 4px rgba(0,0,0,0.1);';
      const imgDiv = document.createElement('div');
      imgDiv.style.cssText = 'height:120px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;';
      const clonedImg = img.cloneNode(true);
      clonedImg.style.maxWidth = '100%'; clonedImg.style.maxHeight = '100%'; clonedImg.style.objectFit = 'contain';
      imgDiv.appendChild(clonedImg);
      const nameDiv = document.createElement('div');
      nameDiv.textContent = petName;
      nameDiv.style.cssText = 'font-weight:bold;font-size:12px;word-wrap:break-word;';
      card.appendChild(imgDiv); card.appendChild(nameDiv);

      card.addEventListener('mouseenter', () => { if (!radio.checked) card.style.backgroundColor = '#f0f0f0'; });
      card.addEventListener('mouseleave', () => { if (!radio.checked) card.style.backgroundColor = 'white'; });

      card.addEventListener('click', () => {
        // user clicked: clear any auto-stop and register pet
        document.querySelectorAll('#bxlist input[type="radio"]').forEach(r => r.checked = false);
        petCards.forEach(c => { c.card.style.borderColor = '#ccc'; c.card.style.backgroundColor = 'white'; });
        radio.checked = true;
        STORE.setPet(petName);
        try { localStorage.setItem('lastSelectedPet', petName); } catch (e) {}
        STORE.setRemaining(remaining);
        card.style.borderColor = '#FFD700'; card.style.backgroundColor = '#FFFACD';
        // Auto-submit after a small delay, but respect any STOP cue
        setTimeout(() => {
          waitForStopCueThenSubmit(petName, form, userStoppedFlag);
        }, randDelay());
      });

      petCards.push({ card, petName, radio });
      gridContainer.appendChild(card);

      if (storedPet === petName) {
        radio.checked = true;
        card.style.borderColor = '#FFD700';
        card.style.backgroundColor = '#FFFACD';
      }
    });

    // Insert UI
    const zapInfo = form.querySelector('p[style*="text-align"]');
    if (zapInfo) form.insertBefore(gridContainer, zapInfo);
    else form.insertBefore(gridContainer, form.firstChild);
    form.insertBefore(counterBox, form.firstChild);

    // STOP button for UI control (clears memory and sets userStoppedFlag)
    function addStopButtonUI(container) {
      const stopBtn = document.createElement('button');
      stopBtn.textContent = '⏸️ Stop Zapping This Pet';
      stopBtn.style.cssText = 'display:block;margin:10px auto;padding:8px 16px;cursor:pointer;border-radius:6px;background:#ff9800;color:white;border:none;font-weight:bold;font-size:12px;';
      stopBtn.addEventListener('click', () => {
        STORE.clearPet();
        userStoppedFlag.value = true;
        stopBtn.remove();
        log('User cleared stored pet and set stop flag');
      });
      container.appendChild(stopBtn);
    }

    // If it's a new day and a storedPet exists, show countdown notice then submit respecting STOP cue
    if (isNewDay && storedPet && remaining > 0) {
      showNewDayCountdown(form, storedPet, counterBox, userStoppedFlag);
    } else if (storedPet && remaining > 0) {
      // same-day auto-continue with stored pet but wait for in-page STOP cue timing
      log('Same day - proceeding to auto-submit stored pet (respecting STOP cue if present)');
      // choose the pet radio visually and then wait for STOP cue before final submit
      const radio = Array.from(document.querySelectorAll('#bxlist input[type="radio"]')).find(r => r.value === storedPet);
      if (radio) radio.checked = true;
      waitForStopCueThenSubmit(storedPet, form, userStoppedFlag);
    }

    if (storedPet && !isNewDay && remaining > 0) addStopButtonUI(counterBox);

    return true;
  }

  // keep original new-day UI but wire in userStoppedFlag so stop UI works
  function showNewDayCountdown(form, petName, counterBox, userStoppedFlag) {
    const notice = document.createElement('div');
    notice.style.cssText = 'background:#fff3cd;border:3px solid #ffc107;border-radius:8px;padding:16px;margin:16px auto;text-align:center;max-width:600px;font-weight:bold;';
    const title = document.createElement('div');
    title.innerHTML = '<strong style="font-size:18px;">NEW DAY! Auto-zapping starts in...</strong>'; title.style.marginBottom = '10px';
    const countdown = document.createElement('div'); countdown.style.cssText = 'font-size:24px;color:#d9534f;margin:10px 0;'; let secs = 10; countdown.textContent = secs;
    const stopBtn = document.createElement('button');
    stopBtn.textContent = '❌ STOP - Choose Different Pet';
    stopBtn.style.cssText = 'margin-top:12px;padding:10px 16px;cursor:pointer;border-radius:6px;background:#dc3545;color:white;border:none;font-weight:bold;font-size:14px;';
    notice.appendChild(title); notice.appendChild(countdown); notice.appendChild(stopBtn);
    counterBox.insertBefore(notice, counterBox.firstChild);

    stopBtn.addEventListener('click', () => {
      userStoppedFlag.value = true;
      STORE.clearPet();
      notice.remove();
      log('User clicked STOP in NEW DAY notice; auto-start cancelled.');
    });

    const interval = setInterval(() => {
      secs--;
      countdown.textContent = secs;
      if (secs <= 0) {
        clearInterval(interval);
        notice.remove();
        // After countdown, find and use the stored pet; respect in-page STOP cue that the real site may show
        waitForStopCueThenSubmit(petName, form, userStoppedFlag);
      }
    }, 1000);
  }

  // ========== PROCESS_LAB2.PHTML ==========
  function handleResultsPage() {
    if (!window.location.pathname.includes('process_lab2.phtml')) return false;
    log('On results page - incrementing count');
    STORE.incCount();
    let remaining = STORE.getRemaining() - 1;
    remaining = Math.max(0, remaining);
    STORE.setRemaining(remaining);
    log('Results - Remaining zaps (from memory):', remaining);
    if (remaining <= 0) {
      STORE.clearPet();
      log('No zaps left - cleared stored pet');
    }

    const statusBox = document.createElement('div');
    statusBox.style.cssText = 'background:#d4edda;border:3px solid #28a745;border-radius:8px;padding:20px;text-align:center;margin:20px auto;max-width:600px;font-weight:bold;';
    const msg = document.createElement('div'); msg.style.fontSize = '16px';
    msg.innerHTML = remaining > 0 ? '✅ Zap successful! Returning to Lab...' : '🎉 All zaps used for today!';
    const countdown = document.createElement('div'); countdown.style.cssText = 'font-size:24px;color:#d9534f;margin-top:12px;'; let secs = 10; countdown.textContent = secs;
    statusBox.appendChild(msg); statusBox.appendChild(countdown);
    const centerTag = document.querySelector('center');
    if (centerTag) centerTag.insertBefore(statusBox, centerTag.firstChild); else document.body.insertBefore(statusBox, document.body.firstChild);

    let interval;
    const redirectToLab = () => {
      if (interval) clearInterval(interval);
      log('Redirecting to lab.phtml');
      window.location.replace('https://www.neopets.com/lab.phtml');
      setTimeout(() => { window.location.href = 'https://www.neopets.com/lab.phtml'; }, 800);
      setTimeout(() => { window.location.assign('https://www.neopets.com/lab.phtml'); }, 1600);
      setTimeout(() => { const link = document.createElement('a'); link.href = 'https://www.neopets.com/lab.phtml'; link.style.display = 'none'; document.body.appendChild(link); link.click(); link.remove(); }, 2400);
      setTimeout(() => { history.back(); }, 3200);
    };

    interval = setInterval(() => {
      secs--;
      countdown.textContent = secs;
      if (secs <= 0) redirectToLab();
    }, 1000);

    return true;
  }

  // ========== INIT ==========
  (async function init() {
    STORE.checkAndResetDay();
    if (handleLabPage()) return;
    if (handleLab2Page()) return;
    if (handleResultsPage()) return;
  })();
})();
