// ==UserScript==
// @name         DFProfiler - Open Cell Map (Edit)
// @name         DFProfiler - Open Cell Map (Edit)
// @version      1.1
// @description  Open detailed cell map only with Ctrl + Click, preserving boss tooltip
// @author       Runonstof, Cezinha
// @match        https://*.dfprofiler.com/bossmap
// @match        https://*.dfprofiler.com/profile/view/*
// @icon         https://www.dfprofiler.com/images/favicon-32x32.png
// @grant        unsafeWindow
// @namespace Cezinha (Edit)
// @downloadURL https://update.greasyfork.org/scripts/559193/DFProfiler%20-%20Open%20Cell%20Map%20%28Edit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559193/DFProfiler%20-%20Open%20Cell%20Map%20%28Edit%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    td.coord:hover {
      cursor: pointer;
      opacity: 0.5;
    }
  `;
  document.head.appendChild(style);

  function openMap(x, y) {
    const holder = document.getElementById('mission-holder');
    const info = document.getElementById('mission-info');

    if (!holder || !info) return;

    info.innerHTML =
      "<img src='https://deadfrontier.info/map/Fairview_" +
      x +
      "x" +
      y +
      ".png' alt='MAP FAILED TO LOAD' />";

    holder.style.display = 'block';
  }

  unsafeWindow.addEventListener('click', function (event) {
    if (!event.ctrlKey) return;

    const el = event.target.closest('td.coord');
    if (!el) return;

    event.preventDefault();
    event.stopPropagation();

    const xClass = Array.from(el.classList).find(c => c.startsWith('x'));
    const yClass = Array.from(el.classList).find(c => c.startsWith('y'));

    if (!xClass || !yClass) return;

    const x = xClass.substring(1);
    const y = yClass.substring(1);

    openMap(x, y);
  });
})();
