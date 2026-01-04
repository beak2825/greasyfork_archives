// ==UserScript==
// @name         FV - Warrior Potion Shortcut
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.2
// @description  Adds a "Potion Shortcut" next to the Battle Log for quick inventory access to Serpent brews and Golden Buff Dust.
// @author       necroam
// @match        https://www.furvilla.com/career/warrior/battle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555853/FV%20-%20Warrior%20Potion%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/555853/FV%20-%20Warrior%20Potion%20Shortcut.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function insertShortcut() {
    const header = document.querySelector('h2.text-left');
    if (!header || header.textContent.trim() !== 'Battle Log') return;

    const wrapper = document.createElement('div');
    wrapper.setAttribute(
      'style',
      'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;'
    );

    header.parentNode.insertBefore(wrapper, header);
    wrapper.appendChild(header);
           // Furvilla Button Look
    const button = document.createElement('a');
    button.textContent = 'Potion Shortcut';
    button.href = 'https://www.furvilla.com/inventory?type=is_potion';
    button.target = '_blank';
    button.className = 'btn';
    button.setAttribute(
      'style',
      'display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;font-size:14px;margin-left:10px;height:32px;'
    );

    wrapper.appendChild(button);
  }

    if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertShortcut);
  } else {
    insertShortcut();
  }
})();



