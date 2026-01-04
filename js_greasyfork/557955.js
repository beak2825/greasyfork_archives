// ==UserScript==
// @name         WaniKani Unobtrusive Kanji Stroke Order (2025 refresh)
// @namespace    org.orls
// @version      1.5.0
// @description  An unobtrusive Kanji Stroke Order display for WaniKani. Original by atzkey. See https://community.wanikani.com/t/userscript-an-unobtrusive-kanji-stroke-order/24206
// @author       orls
//
// @match        https://*.wanikani.com/kanji/*
// @match        https://wanikani.com/kanji/*
//
// @match        https://*.wanikani.com/vocabulary/*
// @match        https://wanikani.com/vocabulary/*
//
// @match        https://*.wanikani.com/subject-lessons*

// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557955/WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order%20%282025%20refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557955/WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order%20%282025%20refresh%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ksoFont = 'KanjiStrokeOrders';
  const ksoStyle = document.createElement('style');
  ksoStyle.innerHTML = `
    .subject-character--expandable .subject-character__characters:hover {
      font-family: "${ksoFont}";
      font-weight: normal;
      transform: translate(10px, 10px) scale(4);
    }

    .character-header__characters.kso {
      font-family: "${ksoFont}";
      font-weight: normal;
    }

    .ksoAlert p {
      margin: 1em;
    }
  `;
  const lessonCharacterSelector = '.character-header__characters';

  let head = document.getElementsByTagName('head')[0];
  head.appendChild(ksoStyle);


  function alertModal(text) {
    console.error(text);
    const tpl = document.createElement('template');
    tpl.innerHTML=`
    <dialog class="ksoAlert">
      <p>${text}</p>
      <form method="dialog">
        <button>OK</button>
      </form>
    </dialog>`;
    const modal = tpl.content.firstElementChild;
    document.body.appendChild(modal);
    modal.showModal();
  }

  function isFontAvailable(fontName) {
    let canvas = document.createElement("canvas");
    canvas.width = 1000;

    let context = canvas.getContext("2d");

        // the text whose final pixel size I want to measure
    let text = "Font availability detection, 0123456789!?.";

    let checks = ['monospace', 'sans-serif', 'serif'].map((fontFamily) => {
            // specifying the baseline font
      context.font = "72px " + fontFamily;

            // checking the size of the baseline text
      let baselineSize = context.measureText(text).width;

            // specifying the font whose existence we want to check
      context.font = "72px '" + fontName + "', " + fontFamily;

            // checking the size of the font we want to check
      let newSize = context.measureText(text).width;

      return newSize !== baselineSize;
    });

    return checks.find((x) => x);
  }

  function handleLessonKsoToggle(e) {
    e.target.classList.toggle('kso');
  }

  if (isFontAvailable(ksoFont)) {

    let observer = new MutationObserver(function(mutations) {
      const character = document.querySelector(lessonCharacterSelector);
      if (character) {
        character.addEventListener('click', handleLessonKsoToggle);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    alertModal(`The Unobtrusive Kanji Stroke Order userscript requires you to download and install the <a href="http://www.nihilist.org.uk/">Kanji Stroke Order font</a>.`);
  }
})();
