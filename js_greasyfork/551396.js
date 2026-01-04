// ==UserScript==
// @name         Torn DIBS Button + Hospital Timer + TornPDA Support
// @namespace    smitty
// @version      3.0
// @description  Adds a DIBS button to Torn profiles. Sends bolded DIBS message to faction chat. Includes hospital timer if applicable. Adds a DIBS Assist button.
// @author       Smitty
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551396/Torn%20DIBS%20Button%20%2B%20Hospital%20Timer%20%2B%20TornPDA%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/551396/Torn%20DIBS%20Button%20%2B%20Hospital%20Timer%20%2B%20TornPDA%20Support.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const waitForHeader = setInterval(() => {
    const header = document.querySelector('.content-title h4');
    if (!header || document.getElementById('smitty-dibs-btn')) return;

    let rawText = header.textContent.trim();
    let playerName = rawText;

    // Handle desktop format: "User [123456]"
    const nameMatch = rawText.match(/^(.+?)\s+\[\d+\]$/);
    if (nameMatch) {
      playerName = nameMatch[1];

    // Handle TornPDA mobile app format: "User's profile" or "Users' profile"
    } else if (rawText.toLowerCase().endsWith("'s profile")) {
      playerName = rawText.replace(/'s profile$/i, '').trim();
    } else if (rawText.toLowerCase().endsWith("' profile")) {
      playerName = rawText.replace(/' profile$/i, '').trim();
    }

    function createButton(id, label, msgBuilder) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      btn.style.cssText = `
        margin-left: 8px;
        padding: 1px 6px;
        font-size: 11px;
        background: #ffda79;
        border: 1px solid #999;
        border-radius: 4px;
        cursor: pointer;
        vertical-align: baseline;
        line-height: 1;
        height: auto;
        display: inline-block;
      `;

      btn.addEventListener('click', async () => {
        // Check for hospital timer (DIBS only)
        let hospitalTime = '';
        if (label === 'DIBS') {
          const hospitalIcon = document.querySelector('.user-status-16-Hospital');
          if (hospitalIcon) {
            hospitalIcon.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            await new Promise(r => setTimeout(r, 300));
            const tooltip = document.querySelector('.tooltip___aWICR .user-icons-tooltip');
            if (tooltip) {
              const spans = tooltip.querySelectorAll('span');
              if (spans.length >= 3) {
                hospitalTime = spans[2].textContent.trim();
              }
            }
            hospitalIcon.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          }
        }

        let chatInput, sendBtn;
        if (/TornPDA/i.test(navigator.userAgent)) {
          chatInput = document.querySelector('.textarea___V8HsV');
          sendBtn = document.querySelector('.iconWrapper___tyRRU');
        } else {
          const factionChat = [...document.querySelectorAll('div[id^="faction-"]')]
            .find(el => el.querySelector('.tt-chat-autocomplete'));
          if (!factionChat) return alert("Faction chat not found. Make sure it's open.");
          chatInput = factionChat.querySelector('.tt-chat-autocomplete');
          sendBtn = factionChat.querySelector('.iconWrapper___tyRRU');
        }

        if (!chatInput || !sendBtn) return alert("Faction chat input or send button not found.");

        const message = msgBuilder(playerName, hospitalTime);
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (setter) setter.call(chatInput, message);
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.dispatchEvent(new FocusEvent('focus'));
        chatInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'D' }));

        setTimeout(() => {
          if (!sendBtn.disabled) sendBtn.click();
          else alert("Send button still disabled. You may need to tap the input first.");
        }, 100);
      });

      return btn;
    }

    const dibsBtn = createButton('smitty-dibs-btn', 'DIBS', (name, time) =>
      time
        ? `DIBS on <b>${name}</b>, fool. (Hospital: ${time})`
        : `DIBS on <b>${name}</b>, fool.`
    );

    const asstBtn = createButton('smitty-asstdib-btn', 'Asst DIB', (name) =>
      `ASSIST DIBS <b>${name}</b>.`
    );

    // Insert DIBS first, then Asst DIB
    header.insertAdjacentElement('afterend', asstBtn);
    header.insertAdjacentElement('afterend', dibsBtn);
    clearInterval(waitForHeader);
  }, 500);
})();