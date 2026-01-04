// ==UserScript==
// @name         WebUntis Random Student Picker (Wheel Animation)
// @namespace    https://greasyfork.org/en/scripts/556970-webuntis-random-student-picker-wheel-animation
// @version      1.5
// @description  Zufällige Schülerauswahl mit realistischem Glücksrad (schnell → langsam). Überspringt abwesende Schüler. Non-commercial use only. Attribution required.
// @match        *.webuntis.com/*
// @grant        none
// @author       Simon Pirker
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/556970/WebUntis%20Random%20Student%20Picker%20%28Wheel%20Animation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556970/WebUntis%20Random%20Student%20Picker%20%28Wheel%20Animation%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Styles ---
  const style = document.createElement('style');
  style.textContent = `
    .studentCard__container.highlighted {
      outline: 4px solid #FFD700;
      transform: scale(1.1);
      transition: transform 0.1s, outline 0.1s;
      z-index: 1000;
    }
    .winner-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.85);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-size: 1.8em;
    }
    .winner-overlay img {
      border-radius: 8px;
      width: 120px;
      height: auto;
      margin: 20px;
    }
    .winner-overlay button {
      background: #FFD700;
      color: black;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 1em;
      cursor: pointer;
      margin-top: 20px;
    }
    #winnerButton {
      margin: 10px;
      background: #FFD700;
      color: black;
      font-size: 1.2em;
      border: none;
      border-radius: 40px;
      padding: 10px 25px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);

  // --- Add button to panel ---
  function addButton(container) {
    if (document.getElementById('winnerButton')) return;

    const button = document.createElement('button');
    button.id = 'winnerButton';
    button.innerHTML = '🎲 The winner is';
    container.appendChild(button);

    // --- PICKER LOGIC ---
    button.addEventListener('click', async () => {

      const students = Array.from(document.querySelectorAll('.studentCard__container'))
        .filter(s => !s.classList.contains('CRSWAbsent'));

      if (students.length === 0) {
        alert('Keine anwesenden Schüler gefunden!');
        return;
      }

      // Remove all highlights
      students.forEach(s => s.classList.remove('highlighted'));

      const total = students.length;

      // --- REAL WHEEL: acceleration → full speed → easing slowdown ---
      const totalSpins = total * 4 + Math.floor(Math.random() * total); // always fair
      let currentIndex = 0;

      // Easing curve duration
      const duration = 2500; // 2.5 seconds
      const startTime = performance.now();

      async function animate(now) {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);

          // Quadratic ease-out: fast → slow
          const eased = t * (2 - t);

          // Calculate progress within total spins
          let progress = eased * totalSpins;

          // Make sure index never escapes array bounds
          const safeIndex = Math.floor(progress) % total;

          // Update highlight safely
          if (safeIndex !== currentIndex) {
              students.forEach(s => s.classList.remove('highlighted'));
              const elem = students[safeIndex];
              if (elem) elem.classList.add('highlighted');
              currentIndex = safeIndex;
          }

          if (t < 1) {
              requestAnimationFrame(animate);
          } else {
              finish();
          }
      }


      requestAnimationFrame(animate);

      function finish() {
        const winner = students[currentIndex];
        winner.classList.add('highlighted');

        const firstName = winner.querySelector('.studentCard__firstName')?.innerText || '';
        const lastName = winner.querySelector('.studentCard__lastName')?.innerText || '';
        const img = winner.querySelector('img')?.src || '';

        const overlay = document.createElement('div');
        overlay.className = 'winner-overlay';
        overlay.innerHTML = `
          <div>🎉 The winner is:</div>
          ${img ? `<img src="${img}">` : ''}
          <strong>${firstName} ${lastName}</strong>
          <button id="closeWinner">OK</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('closeWinner').addEventListener('click', () => {
          overlay.remove();
          students.forEach(s => s.classList.remove('highlighted'));
        });
      }
    });
  }

  // --- Observe DOM until the studentWidgets container appears ---
  const observer = new MutationObserver(() => {
    const container = document.getElementById('classregPageForm.studentWidgets');
    if (container) addButton(container);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
