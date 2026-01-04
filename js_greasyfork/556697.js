// ==UserScript==
// @name        I'm Not A Robot - DDR AutoTap
// @namespace   https://tampermonkey.net/
// @match       https://neal.fun/not-a-robot/*
// @run-at      document-idle
// @grant       none
// @version     1.7
// @author      relty
// @description Automatically plays the DDR minigame at level 47 for you.
// @icon        https://i.postimg.cc/jSGxCmZg/icon.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556697/I%27m%20Not%20A%20Robot%20-%20DDR%20AutoTap.user.js
// @updateURL https://update.greasyfork.org/scripts/556697/I%27m%20Not%20A%20Robot%20-%20DDR%20AutoTap.meta.js
// ==/UserScript==


(function() {

  'use strict';

  const keyMap = {

    Up: "ArrowUp",
    Down: "ArrowDown",
    Left: "ArrowLeft",
    Right: "ArrowRight"

  };

  function getDirection(note) {

    const arrow = note.querySelector(".note-arrow");
    if (!arrow) return null;

    for (const cls of arrow.classList) {

      if (keyMap[cls]) return cls; // map the key direction from the child class of the note-arrow div

    }

    return null;

  }

  function tap(key) {

    if (!key) return;

    document.dispatchEvent(new KeyboardEvent("keydown", { key })); // press down the specified key immediately

    requestAnimationFrame(() => {

      document.dispatchEvent(new KeyboardEvent("keyup", { key })); // release (press up) the pressed key right after to allow it to bounce back

    });

  }

  function findHitLine() {

    return document.querySelector(".arrows-container"); // dynamically fetch the target area the notes are falling into

  }

  function autoTapLoop(hitLine) { // main thread

    const notes = document.querySelectorAll("div.note:not(.note-played):not(.note-missed)"); // get all the upcoming notes, excluding played/missed ones

    const HIT_TOP = hitLine.getBoundingClientRect().top;
    const HIT_BOTTOM = hitLine.getBoundingClientRect().bottom; // get the bounds of the target area

    notes.forEach(note => {

      const y = note.getBoundingClientRect().top; // top axis of the falling note

      if (y >= HIT_TOP && y <= HIT_BOTTOM && note.className === "note") { // check bounds and state

        const dir = getDirection(note);

        tap(keyMap[dir]);

        note.className = "note-played"; // manually mark it to block double taps or any other edge case
      }

    });

    requestAnimationFrame(() => autoTapLoop(hitLine)); // continue the loop frame after frame for precision

  }

  function startAutoTap() { // entry point

    const hitLine = findHitLine();
    if (!hitLine) return;

    autoTapLoop(hitLine);

  }

  window.addEventListener("load", () => { // initialization delay

    setTimeout(startAutoTap, 500);

  });

})();