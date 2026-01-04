// ==UserScript==
// @name         MaruMori Conjugation Feedback Tweaker
// @namespace    https://marumori.io
// @version      1.1
// @description  Replace end-of-session title based on mistakes, with random phrases
// @author       Matskye
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551488/MaruMori%20Conjugation%20Feedback%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/551488/MaruMori%20Conjugation%20Feedback%20Tweaker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MESSAGES = {
    positive: [
      "Great job, Conjugation Champion! 🎉",
      "Flawless victory — conjugation master at work! 🏆",
      "Almost too easy for you, isn’t it? 😏"
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
      "Conjugations chewed you up this round. 🐼",
      "Well… that was *something*. Try again? 🙃",
      "Oof, conjugation dojo kicked you out today. 🚪"
    ],
    scathing: [
      "That was… not it. Reset, refocus, and actually read the prompts. 😬",
      "You bombed it. Were you even paying attention?",
      "Yikes… conjugation disaster. Back to square one.",
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
      "お前はも死んでってー oh god you infected me as well",
      "Luckily I don't care about you enough to feel disappointed.",
      "I thought you had it in you and then I openend my eyes and realized it was all a dream",
      "If I was dead, I’d be rolling over in my grave",
      "Now... What would your dad think of this?",
      "I was about to say something, but it seems that words, like knowledge, are lost on you.",
      "Were you trying to fail? Or is failure your only gift?",
      "If I take my glasses off... I almost can't see how bad it was.",
      "To be honest, even I am embarassed.",
      "I hope it's your dyslexia that caused this many errors.",
      "The bar was low, but it seems you've broken all my expectations.",
      "Should I jot down that this is your best?",
      "Thankfully this won't be logged.",
      "At least we know who's at the start of the bell curve.",
      "I thought zero didn't exist, but you just proved it does!"
    ]
  };

  function pickCategory(wrongPct) {
    if (wrongPct > 50) return 'scathing';
    if (wrongPct >= 15) return 'mocking';
    if (wrongPct >= 10) return 'neutral';
    if (wrongPct >= 5) return 'encouraging';
    return 'positive';
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function readStats() {
    const wrapper = document.querySelector('.blocks-wrapper');
    if (!wrapper) return null;

    let totalQuestions = null;
    let mistakes = null;

    wrapper.querySelectorAll('.stats').forEach(statsEl => {
      const numEl = statsEl.querySelector('h1');
      const labelEl = statsEl.querySelector('.text');
      if (!numEl || !labelEl) return;

      const value = parseInt(numEl.textContent.trim(), 10);
      const label = labelEl.textContent.trim().toLowerCase();

      if (label.includes('question')) totalQuestions = value;
      if (label.includes('mistake')) mistakes = value;
    });

    if (totalQuestions == null || mistakes == null) return null;
    return { totalQuestions, mistakes };
  }

  function applyResultsFeedback() {
    const stats = readStats();
    if (!stats || stats.totalQuestions <= 0) return;

    const wrongPct = (stats.mistakes / stats.totalQuestions) * 100;
    const category = pickCategory(wrongPct);
    const message = randomFrom(MESSAGES[category]);

    const titleEl = document.querySelector('.conjugation-results-wrapper .header h1');
    if (titleEl) {
      titleEl.textContent = message;
    }
  }

  // --- Mutation observer to catch both modal + results instantly ---
  const observer = new MutationObserver(() => {
    // Modal "Great Job!" replacement
    const modalText = document.querySelector('.modal .lesson-content h4.lesson-text');
    if (modalText && modalText.textContent.match(/Great Job!/i)) {
      modalText.textContent = "Let's see how you really did...";
    }

    // Results page header replacement
    const resultHeader = document.querySelector('.conjugation-results-wrapper .header h1');
    if (resultHeader && !resultHeader.dataset.mmTweaked) {
      applyResultsFeedback();
      resultHeader.dataset.mmTweaked = "1"; // prevent re-tweaking
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
