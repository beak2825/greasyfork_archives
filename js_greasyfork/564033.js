// ==UserScript==
// @author      daniel.z.tg
// @description Provides additional Duolingo keyboard shortcuts
// @grant       GM_addStyle
// @license     Unlicense
// @match       https://www.duolingo.com/*
// @name        Duolingo keyboard shortcuts 2025
// @namespace   https://github.com/danielzgtg
// @version     202601251031070001
// @downloadURL https://update.greasyfork.org/scripts/564033/Duolingo%20keyboard%20shortcuts%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/564033/Duolingo%20keyboard%20shortcuts%202025.meta.js
// ==/UserScript==

/*
 * Features:
 * - Working as of January 2026
 * - Use Backtick ("`") as Enter to submit exercises with only left hand
 * - Press Control to replay audio
 * - Press any key to skip Duolingo Plus video ad
 * - Supplements numeric keybinds for wordbanks in the few remaining exercise types without support
 * - Press Backtick on homescreen to jump to practice mode
 */

document.addEventListener('keydown', e => {
  // Only 1234567890 is supported. Using abcde is untuitive and messes with non-English keyboard layouts
  const i = +e.key;
  if (!isNaN(i)) {
    // Ports to 2025 the old https://github.com/CyberShadow/DuolingoMoreKeys/blob/master/More_keyboard_hotkeys.user.js
    // For alphabetical languages, supports mixing existing typing prefixes feature and my new pressing numbers feature
    document.querySelectorAll('div[data-test=word-bank] button')?.[(i+9)%10]?.click();
    // Need backspace? Skill issue.
    return;
  }
  if (e.key === "Control") {
    document.querySelector('button:has(>[style^="--animated-speaker-icon-color"])')?.click();
    return;
  }
  if (e.key !== '`') return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (window.location + "" === "https://www.duolingo.com/learn") {
      window.location = "https://www.duolingo.com/practice";
      return;
  }
  const buttons = document.querySelectorAll("button");
  if (buttons.length === 1) {
    buttons[0].click();
    return;
  }
  const button = document.querySelector(
    "[data-test='player-practice-again'], [data-test='player-next']");
  if (button) {
    button.click();
    return;
  }
}, true);

// Yay Duolingo has a builtin left corner label now
GM_addStyle(`
div[data-test=word-bank]>div:nth-child(1) button::before { content: "1"; }
div[data-test=word-bank]>div:nth-child(2) button::before { content: "2"; }
div[data-test=word-bank]>div:nth-child(3) button::before { content: "3"; }
div[data-test=word-bank]>div:nth-child(4) button::before { content: "4"; }
div[data-test=word-bank]>div:nth-child(5) button::before { content: "5"; }
div[data-test=word-bank]>div:nth-child(6) button::before { content: "6"; }
div[data-test=word-bank]>div:nth-child(7) button::before { content: "7"; }
div[data-test=word-bank]>div:nth-child(8) button::before { content: "8"; }
div[data-test=word-bank]>div:nth-child(9) button::before { content: "9"; }
div[data-test=word-bank]>div:nth-child(10) button::before { content: "0"; }
`);

// Block first-party ad that uBlock Origin missed
(() => {
  let timeout = 0;
  function adblock2() {
    document.querySelector("button._2pYm_.bafGS._2LoNU.VzbUl._1saKQ._1AgKJ")?.click();
  }
  function adblock1() {
    const button = document.querySelector("button._1gEmM._7jW2t._1Udkq");
    if (button) {
      button.click();
      setTimeout(adblock2, 1000);
    }
    timeout = 0;
  }
  document.addEventListener("keyup", (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(adblock1, 1000);
  });
})();