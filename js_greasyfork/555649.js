// ==UserScript==
// @name         Daily RP Board Checker Button
// @namespace    https://www.grundos.cafe/
// @version      1.0.0
// @description  Adds a Daily button for the Role Playing Neoboard in Grundo's Cafe AIO sidebar
// @author       CoolCatMcGavins
// @match        https://www.grundos.cafe/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @icon         https://i.pinimg.com/236x/05/c1/5a/05c15aca14964af944aac1c638e1d7d2.jpg
// @downloadURL https://update.greasyfork.org/scripts/555649/Daily%20RP%20Board%20Checker%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/555649/Daily%20RP%20Board%20Checker%20Button.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ROLEPLAY_URL = 'https://www.grundos.cafe/neoboards/boardlist/?board=16&page=1';
  const TODAY = new Date().toDateString();
  const ICON_URL = 'https://i.pinimg.com/236x/05/c1/5a/05c15aca14964af944aac1c638e1d7d2.jpg';

  const lastVisit = GM_getValue('rp_last_visit', '');

  // Only show if not visited today
  if (lastVisit === TODAY) return;

  // Wait for sidebar to load
  const observer = new MutationObserver(() => {
    const dailiesList = document.querySelector('#aio-dailies-list');
    if (dailiesList) {
      observer.disconnect();
      insertDailyIcon(dailiesList);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function insertDailyIcon(container) {
    // Build structure like other dailies
    const wrapper = document.createElement('div');

    const link = document.createElement('a');
    link.href = ROLEPLAY_URL;
    link.target = '_blank'; // optional, opens in new tab

    const img = document.createElement('img');
    img.className = 'smol-image';
    img.title = 'Role Playing Board';
    img.src = ICON_URL;
    img.style.cursor = 'pointer';

    link.appendChild(img);
    wrapper.appendChild(link);
    container.insertBefore(wrapper, container.firstChild);

    // When clicked, mark as visited
    link.addEventListener('click', () => {
      GM_setValue('rp_last_visit', TODAY);
      wrapper.remove(); // remove icon for the rest of the day
    });
  }
})();