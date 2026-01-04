// ==UserScript==
// @name         MaruMori SRS Feedback Tweaker
// @namespace    https://marumori.io
// @version      1.0
// @description  Results feedback with scathing/helpful toggle.
// @author       Matskye
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551541/MaruMori%20SRS%20Feedback%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/551541/MaruMori%20SRS%20Feedback%20Tweaker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------- CONFIG ---------
  const STORAGE_KEY = 'mm-feedback-mode'; // 'scathing' | 'helpful'
  const DEFAULT_MODE = 'scathing';
  const HELPFUL_THRESHOLD = 85; // angelic: >85% ⇒ positive
  const RESULTS_PATH = '/study-lists/results';
  const STABLE_DELAY_MS = 750; // wait after last score change

  const IMG_SINISTER = 'https://raw.githubusercontent.com/matskye/maru-image-repository/4145f33372a7539b1687801416c717434a472382/sinister%20maru.webp';
  const IMG_ANGEL = 'https://raw.githubusercontent.com/matskye/maru-image-repository/4145f33372a7539b1687801416c717434a472382/maru_angel.png';

  // --------- MESSAGES ---------
  const MESSAGES = {
    scathing: {
      positive: [
        "Great job! 🎉",
        "You did absolutely amazing!",
        "Flawless victory : a master at work!",
        "Almost too easy for you, isn’t it?",
        "Phenomenal work! SRS boss mode unlocked!",
        "You're cruising, keep that momentum rolling!",
        "Chef's kiss accuracy.",
        "Maru's doing a happy dance for you.",
        "Textbook perfect. You make it look easy.",
        "Clean hits all around.",
        "Stellar memory! Onward to mastery.",
        "That was silky smooth.",
        "You nailed it. Again!",
        "Gold-star performance today.",
        "Beautiful recall! いい感じ！",
        "That's how it's done. 教科書レベル！",
        "Laser focus, great results.",
        "Maru approves. その調子！",
        "Your study streak is shining.",
        "You're a review machine! 🤖",
        "Super crisp answers.",
        "Brain gains achieved!",
        "Fast, accurate, confident. nice!",
        "Flawless vibes only. ",
        "Your future self says thanks.",
        "SRS wizardry detected.",
        "Legendary session — keep going!",
        "You're in the growth zone. ",
        "Precision like a pro.",
        "Crystal-clear recall.",
        "You're setting the curve.",
        "Your effort shows! Beautiful work.",
        "Reps pay off. Nice form!",
        "今日も完璧！(Perfect today!)",
        "On fire!  ナイス！🔥",
        "Consistent and confident. A great combo.",
        "That was artful study.",
        "Mastery in motion.",
        "You're leveling up fast.",
        "Killer accuracy, calm execution.",
        "Top-tier reviewing.",
        "You're unstoppable today.",
        "Smooth like butter mochi.",
        "Sharp as a katana.",
        "Peak focus, peak results.",
        "Speed + accuracy = you.",
        "The Red Panda Council salutes you.",
        "Maru's proud and so am I.",
        "Strong finish! Beautifully done.",
        "Effort > luck.  And it shows.",
        "Smart work, smart wins.",
        "Elite reviews! Chef's kiss.",
        "You're flying today.",
        "Rock-solid memory! Keep stacking!"
      ],
      encouraging: [
        "Good work—but those slips add up. Stay sharp! ⚡",
        "Nice progress, but don’t rush it this time. 🐢",
        "Solid! A few stumbles, but nothing you can’t fix. 👍"
      ],
      neutral: [
        "Decent, but you’re walking the line. Think carefully next time. 😐",
        "Not bad, not great. You can push higher. 📈",
        "Average… and I know you can do better. 🤨"
      ],
      mocking: [
        "Your reviews chewed you up this round. 🐼",
        "Well… that was *something*. Try again? 🙃",
        "Oof, the Japanese dojo kicked you out today. 🚪"
      ],
      scathing: [
        "That was… not it. Reset, refocus, and actually read the prompts. 😬",
        "You bombed it. Were you even paying attention?",
        "Yikes… SRS disaster. Back to square one.",
        "You did as well as one could expect of you... I guess.",
        "You did your best, language learning isn't for everybody!",
        "And here I was hoping you'd be good at something...",
        "Making mistakes is natural. The amount however...",
        "Ew...",
        "*sigh*",
        "...Wow.",
        "Congratulations, even Maru has given up on you!",
        "To delete your account, please e-mail support@marumori.io",
        "You're not even worth my scathing feedback",
        "You're great at this! Throwing crap against the wall, that is.",
        "No...",
        "I give up.",
        "Luckily I don't care about you enough to feel disappointed.",
        "I thought you had it in you and then I openend my eyes and realized it was all a dream",
        "If I was dead, I’d be rolling over in my grave",
        "Now... What would your dad think of this?",
        "I was about to say something, but it seems that words, like knowledge, are lost on you.",
        "Were you trying to fail? Or is failure your only gift?",
        "If I take my glasses off... I almost can't see how bad it was.",
        "To be honest, even I am embarassed.",
        "The bar was low, but it seems you've broken all my expectations.",
        "Should I jot down that this is your best?",
        "Thankfully this won't be logged.",
        "At least we know who's at the start of the bell curve.",
        "I thought zero didn't exist, but you just proved it does!"
      ]
    },
    helpful: [
      "Bad days happen to everyone, chin up. Next time you’ll ace it!",
      "Remember, trust the process. One failure at a time",
      "You’re better prepared for the next rounds",
      "Every master was first a novice",
      "You don’t make an omelette without breaking some eggs",
      "You’ve just leveled up in resilience! Keep at it!",
      "Perfection is boring. Trust me, I know",
      "You wouldn’t want to be a know-it-all, right?",
      "The most beautiful souls make the most mistakes",
      "If you wouldn’t fail, you wouldn’t be able to learn",
      "Failure is the first step towards mastery",
      "There’s always a next time with SRS",
      "I’ll always believe in you, even if you don’t.",
      "I’ve seen your dedication. Don’t lose hope and don’t stop.",
      "Breathe in. Breathe out. You’ll ace it next time",
      "You should’ve seen me when I first started.",
      "If you’re feeling down, share it on our discord. We’ll lift your spirits.",
      "Your spirit cannot be broken by a few mistakes.",
      "This is nothing, I’ve done way worse.",
      "Every night has its moon",
      "You haven’t fallen, you just slipped.",
      "I will always admire your resilience and focus.",
      "Don’t compare yourself to others.",
      "Repetition is the key to all success",
      "The day will come when you’ll be the master and I the student.",
      "Reviewing, no matter the results, equals exposure.",
      "Even in failure you shine. Trust me and the process",
      "I’ll always be there to support you in your studies, no matter the outcome.",
      "There are no shortcuts to mastery."
    ]
  };

  // --------- STYLES ---------
  const style = document.createElement('style');
  style.textContent = `
    .mm-feedback-card {
      margin-top: 0.75rem;
      padding: 0.9rem 1rem;
      border-radius: 12px;
      background: #1f2227;
      color: var(--always-white, #f3f4f6);
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      line-height: 1.35;
      font-size: 0.98rem;
      opacity: 0;
      transform: translateY(-4px);
      animation: mm-fade-in 200ms ease-out forwards;
    }
    .mm-feedback-card.mm-helpful { border: 1px solid rgba(107, 224, 122, 0.35); color: #d6ffe0; }
    .mm-feedback-card.mm-scathing { border: 1px solid rgba(255, 92, 92, 0.35); color: #ffd6d6; }
    .mm-feedback-card.mm-pending {
      border: 1px dashed rgba(255,255,255,0.25);
      color: #cfd3da;
      opacity: 0.85;
    }
    .mm-feedback-card .mm-dots:after {
      content: '…';
      animation: mm-ellipsis 1.2s infinite steps(4,end);
      /* visually subtle ellipsis */
    }
    @keyframes mm-ellipsis {
      0%  { content: '';  }
      25% { content: '.'; }
      50% { content: '..';}
      75% { content: '...';}
      100%{ content: '';  }
    }

    @keyframes mm-fade-in { to { opacity: 1; transform: translateY(0); } }
    .mm-hidden { display: none !important; }

    /* Toggle pill (outside-right of title_wrapper) */
    .mm-toggle-wrap {
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translate(12px, -50%);
      z-index: 10;
      display: flex; align-items: center; gap: 0.5rem;
      pointer-events: auto;
    }
    .mm-toggle-label { font-size: 0.85rem; opacity: 0.8; color: var(--always-white, #e5e7eb); }
    .mm-toggle {
      position: relative; width: 86px; height: 38px; border-radius: 19px;
      background: #1f2227; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
      display: inline-flex; align-items: center; justify-content: space-between; padding: 4px;
      cursor: pointer; user-select: none;
      transition: background 150ms ease;
    }
    .mm-toggle img { width: 26px; height: 26px; pointer-events: none; opacity: 0.6; }
    .mm-toggle .mm-thumb {
      position: absolute; top: 3px; width: 40px; height: 32px; border-radius: 16px;
      background: rgba(255,255,255,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    .mm-toggle.scathing img[data-side="left"], .mm-toggle.helpful img[data-side="right"] { opacity: 1; }
    .mm-toggle.scathing .mm-thumb { transform: translateX(3px); background: rgba(255, 92, 92, 0.18); }
    .mm-toggle.helpful .mm-thumb { transform: translateX(43px); background: rgba(107, 224, 122, 0.20); }

    /* Mobile/tablet fallback: keep toggle inside header to avoid overflow */
    @media (max-width: 1024px) {
      .mm-toggle-wrap { position: static; transform: none; margin-top: 0.5rem; }
    }
  `;
  document.head.appendChild(style);

  // --------- STATE / HELPERS ---------
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const getMode = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_MODE;
  const setMode = (m) => localStorage.setItem(STORAGE_KEY, m);

  let lastApplyKey = '';
  let resultsObserver = null;
  let scoreObserver = null;
  let debounceTimer = null;

  function onResultsPage() {
    if (!location.pathname.includes(RESULTS_PATH)) return false;
    const qs = new URLSearchParams(location.search);
    return qs.get('reviews') === 'true';
  }

  function pickCategory(wrongPct) {
    if (wrongPct > 50) return 'scathing';
    if (wrongPct >= 15) return 'mocking';
    if (wrongPct >= 10) return 'neutral';
    if (wrongPct >= 5) return 'encouraging';
    return 'positive';
  }
  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function parseScoreFromDOM() {
    const span = document.querySelector('.progress-bar span, .progress_wrapper span');
    if (!span) return null;
    const pct = parseInt(span.textContent.replace('%', '').trim(), 10);
    return Number.isFinite(pct) ? clamp(pct, 0, 100) : null;
  }

  const findTitleWrapper = () => document.querySelector('.title_wrapper');
  const findTitleH2 = () => document.querySelector('.title_wrapper h2');

  function ensureToggle(container) {
    if (document.querySelector('.mm-toggle-wrap')) return;

    // Anchor for absolutely positioned toggle
    if (container && getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    const wrap = document.createElement('div');
    wrap.className = 'mm-toggle-wrap';

    const label = document.createElement('span');
    label.className = 'mm-toggle-label';
    label.textContent = 'Feedback';

    const toggle = document.createElement('div');
    toggle.className = 'mm-toggle';
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-checked', getMode() === 'helpful' ? 'true' : 'false');

    const thumb = document.createElement('div');
    thumb.className = 'mm-thumb';

    const left = document.createElement('img');
    left.src = IMG_SINISTER; left.alt = 'Scathing'; left.dataset.side = 'left';

    const right = document.createElement('img');
    right.src = IMG_ANGEL; right.alt = 'Helpful'; right.dataset.side = 'right';

    toggle.append(thumb, left, right);
    wrap.append(label, toggle);
    container.appendChild(wrap);

    applyToggleVisual(toggle, getMode());

    toggle.addEventListener('click', () => {
      const next = getMode() === 'scathing' ? 'helpful' : 'scathing';
      setMode(next);
      applyToggleVisual(toggle, next);
      scheduleApply(); // recompute after mode flip
    });
  }

  function applyToggleVisual(toggleEl, mode) {
    toggleEl.classList.toggle('helpful', mode === 'helpful');
    toggleEl.classList.toggle('scathing', mode === 'scathing');
    toggleEl.setAttribute('aria-checked', mode === 'helpful' ? 'true' : 'false');
  }

  function ensureCard() {
    const h2 = findTitleH2();
    if (!h2) return null;
    let card = document.querySelector('.mm-feedback-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'mm-feedback-card mm-hidden';
      h2.insertAdjacentElement('afterend', card);
    }
    return card;
  }

  function showPending() {
    const card = ensureCard();
    if (!card) return;
    card.classList.add('mm-pending');
    card.classList.remove('mm-helpful', 'mm-scathing', 'mm-hidden');
    card.textContent = 'Analyzing your session';
    const dots = document.createElement('span');
    dots.className = 'mm-dots';
    card.appendChild(dots);
  }

  function injectMessage(msg, mode) {
    const card = ensureCard();
    if (!card) return;
    card.classList.remove('mm-pending', 'mm-hidden');
    card.classList.toggle('mm-helpful', mode === 'helpful');
    card.classList.toggle('mm-scathing', mode === 'scathing');
    card.textContent = msg;
  }

  function clearMessage() {
    const card = document.querySelector('.mm-feedback-card');
    if (card) card.classList.add('mm-hidden');
  }

  function applyFeedbackNow() {
    if (!onResultsPage()) return;

    const score = parseScoreFromDOM();
    if (score == null) return; // keep pending until we have a number

    const mode = getMode();

    if (mode === 'scathing') {
      const wrongPct = 100 - score;
      const category = pickCategory(wrongPct);
      const key = `${mode}|${score}|${category}`;
      if (key === lastApplyKey) return;
      lastApplyKey = key;
      const msg = randomFrom(MESSAGES.scathing[category]);
      injectMessage(msg, 'scathing');
    } else {
      // Angelic: >85% => positive; else helpful encouraging
      const showPositive = score > HELPFUL_THRESHOLD;
      const key = `${mode}|${score}|${showPositive ? 'pos' : 'help'}`;
      if (key === lastApplyKey) return;
      lastApplyKey = key;
      const msg = showPositive
        ? randomFrom(MESSAGES.scathing.positive)
        : randomFrom(MESSAGES.helpful);
      injectMessage(msg, 'helpful'); // keep angelic styling for both
    }
  }

  function scheduleApply() {
    // Debounce to allow score to settle; show pending immediately
    showPending();
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyFeedbackNow();
    }, STABLE_DELAY_MS);
  }

  function watchScoreLive(span) {
    if (scoreObserver) { scoreObserver.disconnect(); scoreObserver = null; }
    if (!span) return;

    // Run once after a brief wait (in case score is already final)
    scheduleApply();

    scoreObserver = new MutationObserver(() => {
      // Any change => restart the debounce window
      lastApplyKey = '';
      scheduleApply();
    });
    scoreObserver.observe(span, { characterData: true, childList: true, subtree: true });
  }

  function initResultsOnceReady() {
    if (!onResultsPage()) return;

    // Reset state and show pending immediately to avoid stale flash
    lastApplyKey = '';
    showPending();

    const wrapper = findTitleWrapper();
    const h2 = findTitleH2();
    const scoreSpan = document.querySelector('.progress-bar span, .progress_wrapper span');

    if (wrapper && h2 && scoreSpan) {
      ensureToggle(wrapper);
      watchScoreLive(scoreSpan);
      // Do NOT call apply immediately; debounce will handle once stable
      if (resultsObserver) { resultsObserver.disconnect(); resultsObserver = null; }
      return;
    }

    if (!resultsObserver) {
      resultsObserver = new MutationObserver(() => {
        const wNow = findTitleWrapper();
        const h2Now = findTitleH2();
        const spanNow = document.querySelector('.progress-bar span, .progress_wrapper span');
        if (wNow && h2Now && spanNow) {
          ensureToggle(wNow);
          watchScoreLive(spanNow);
          if (resultsObserver) { resultsObserver.disconnect(); resultsObserver = null; }
        }
      });
      resultsObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        if (resultsObserver) { resultsObserver.disconnect(); resultsObserver = null; }
      }, 5000);
    }
  }

  function cleanupUI() {
    if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
    const wrap = document.querySelector('.mm-toggle-wrap');
    if (wrap) wrap.remove();
    const card = document.querySelector('.mm-feedback-card');
    if (card) card.remove();
    lastApplyKey = '';
    if (resultsObserver) { resultsObserver.disconnect(); resultsObserver = null; }
    if (scoreObserver) { scoreObserver.disconnect(); scoreObserver = null; }
  }

  function onRouteChange() {
    if (onResultsPage()) {
      initResultsOnceReady();
    } else {
      cleanupUI();
    }
  }

  // --------- ROUTE HOOKS (SPA friendly) ---------
  ['pushState', 'replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function () {
      const ret = orig.apply(this, arguments);
      onRouteChange();
      return ret;
    };
  });
  window.addEventListener('popstate', onRouteChange);

  // Initial run
  onRouteChange();
})();