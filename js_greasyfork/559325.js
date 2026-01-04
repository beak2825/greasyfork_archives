// ==UserScript==
// @name         📞 SMS Caller
// @version      2.6
// @description  Call all characters with SMS-style UI. Target names get funny/friendly calls and special display; others get wazzup. Soft pastel colored turquoise panel, Inter font, animated counters, typing bubble. Now with <100% filter option.
// @author       chk
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @grant        none
// @run-at       document-idle
// @namespace anon
// @downloadURL https://update.greasyfork.org/scripts/559325/%F0%9F%93%9E%20SMS%20Caller.user.js
// @updateURL https://update.greasyfork.org/scripts/559325/%F0%9F%93%9E%20SMS%20Caller.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const interactionOptions = ['58', '61', '121'];
  const fallbackOptions = ['121', '171', '24']; // Gossip, Thank you call, or Wazzup if others not available
  const baseUrl = location.origin + '/World/Popmundo.aspx/Interact/Phone/';
  const delayBetweenCalls = 2000;

  // Detect language from page
  const isTurkish = document.documentElement.lang === 'tr' ||
                    document.querySelector('select option[value="24"]')?.textContent.includes('N\'aber') ||
                    document.querySelector('input[value="İlgilen"]') !== null;

  const translations = {
    en: {
      panelTitle: '📞 sms caller',
      callAll: '📞 call all',
      callNon100: '📈 call <100%',
      contacts: '🧍‍♂️ contacts',
      skipped: '🚫 skipped',
      sent: '✅ sent',
      typing: 'typing…',
      startingCalls: '📞 starting sms calls for {count} characters…',
      callingNon100: '📈 calling only contacts below 100%…',
      sentLabel: '✔️ {name} → sent {action}',
      calledRecently: '💭 {name} → called 2 mins ago',
      error: '❌ {name} → error',
      funnyPic: 'Funny pic',
      friendlyText: 'Friendly text',
      gossip: 'Gossip on phone',
      wazzup: 'Wazzup call',
      thankYou: 'Thank you call'
    },
    tr: {
      panelTitle: '📞 sms arayan',
      callAll: '📞 hepsini ara',
      callNon100: '📈 <100% ara',
      contacts: '🧍‍♂️ kişiler',
      skipped: '🚫 atlanan',
      sent: '✅ gönderilen',
      typing: 'yazıyor…',
      startingCalls: '📞 {count} karakter için sms aramaları başlatılıyor…',
      callingNon100: '📈 sadece %100\'ün altındaki kişiler aranıyor…',
      sentLabel: '✔️ {name} → {action} gönderildi',
      calledRecently: '💭 {name} → 2 dakika önce arandı',
      error: '❌ {name} → hata',
      funnyPic: 'Komik resim',
      friendlyText: 'Dostane SMS',
      gossip: 'Telefonda dedikodu',
      wazzup: 'N\'aber araması',
      thankYou: 'Teşekkür araması'
    }
  };

  const t = translations[isTurkish ? 'tr' : 'en'];

  const banIds = ['3603887', '3579984', '3585513', '3616422', '3579788', '3579934', '3617774', '3602146', '3609935', '3602138', '3611645', '3612251', '3609922', '3613491'];
  const targetIds = ['3252082', '3295314', '3267953', '3389930', '3373307', '3386933', '3553720', '3607777', '3615967', '3616027'];
  const nameOnlyList = ['xxx'];

  function normalizeName(name) {
    return name.replace(/\s+/g, ' ').trim();
  }

  const panel = document.createElement('div');
  panel.id = 'smsPanel';
  panel.innerHTML = `
    <div class="header">${t.panelTitle}</div>
    <div class="modeButtons">
      <button id="callAllBtn" class="modeBtn">${t.callAll}</button>
      <button id="callNon100Btn" class="modeBtn">${t.callNon100}</button>
    </div>
    <div class="stats">
      <div class="statItem">${t.contacts} <span id="foundCount" class="pill">0</span></div>
      <div class="statItem">${t.skipped} <span id="excludedCount" class="pill">0</span></div>
      <div class="statItem">${t.sent} <span id="progressCount" class="pill">0</span></div>
    </div>
    <div id="log" class="log"></div>
    <div id="typingBubble" class="typing">${t.typing}</div>
  `;
  panel.style.display = 'none';
  document.body.appendChild(panel);

  const triggerButton = document.createElement('div');
  triggerButton.id = 'smsTriggerButton';
  triggerButton.textContent = '📞';
  document.body.appendChild(triggerButton);

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

    #smsPanel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 220px;
      background: #f0ffff; /* Soft pastel turquoise background */
      border-radius: 18px;
      font-family: "Inter", "Bahnschrift", "Din Alternate", "Century Gothic", "Futura", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif !important;
      font-size: 12px;
      text-transform: lowercase;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(72, 126, 126, 0.1); /* Soft turquoise shadow */
      overflow: hidden;
      border: 1px solid #d4edee; /* Soft pastel turquoise border */
      animation: fadeIn 0.4s ease-out;
    }
    #smsPanel .header {
      background: linear-gradient(to right, #d4edee, #b0e0e6); /* Soft pastel turquoise gradient */
      color: #487e7e; /* Soft dark cyan text */
      padding: 8px 12px;
      font-weight: bold;
      font-size: 13px;
      text-align: center;
      border-top-left-radius: 18px;
      border-top-right-radius: 18px;
      box-shadow: inset 0 -1px 0 rgba(255,255,255,0.3);
    }
    #smsPanel .modeButtons {
      display: flex;
      gap: 6px;
      padding: 8px 12px;
      background: #e8f8f8; /* Soft medium pastel turquoise background */
      border-bottom: 1px solid #d4edee; /* Soft pastel turquoise border */
    }
    #smsPanel .modeBtn {
      flex: 1;
      background: white;
      border: 2px solid #98d8d8; /* Soft turquoise border */
      color: #487e7e; /* Soft dark cyan text */
      padding: 6px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: "Inter", "Bahnschrift", "Din Alternate", "Century Gothic", "Futura", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif !important;
      text-transform: lowercase;
    }
    #smsPanel .modeBtn:hover {
      background: #98d8d8; /* Soft turquoise hover */
      color: white;
      transform: scale(1.05);
    }
    #smsPanel .stats {
      padding: 6px 12px;
      background: #e8f8f8; /* Soft medium pastel turquoise background */
      border-bottom: 1px solid #d4edee; /* Soft pastel turquoise border */
    }
    #smsPanel .statItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      font-weight: 500;
      color: #487e7e; /* Soft dark cyan text */
    }
    #smsPanel .pill {
      background: #98d8d8; /* Soft turquoise accent */
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      box-shadow: 0 1px 2px rgba(72, 126, 126, 0.1); /* Soft turquoise shadow */
      transition: all 0.3s ease;
    }
    #smsPanel .log {
      max-height: 140px;
      overflow-y: auto;
      padding: 8px 10px;
      background: #f0ffff; /* Soft pastel turquoise background */
      scrollbar-width: thin;
      scrollbar-color: #98d8d8 #e8f8f8; /* Soft turquoise scrollbar */
    }
    #smsPanel .log::-webkit-scrollbar {
      width: 6px;
    }
    #smsPanel .log::-webkit-scrollbar-track {
      background: #e8f8f8; /* Soft medium pastel turquoise background */
      border-radius: 10px;
    }
    #smsPanel .log::-webkit-scrollbar-thumb {
      background-color: #98d8d8; /* Soft turquoise accent */
      border-radius: 10px;
      border: 1px solid #d4edee; /* Soft pastel turquoise border */
    }
    #smsPanel .log div {
      background: #ffffff;
      border-radius: 14px;
      padding: 6px 10px;
      margin-bottom: 6px;
      box-shadow: 0 2px 4px rgba(72, 126, 126, 0.08); /* Soft turquoise shadow */
      border: 1px solid #d4edee; /* Soft pastel turquoise border */
      transition: background 0.3s ease, transform 0.2s ease;
      animation: bubbleFade 0.3s ease-out;
    }
    #smsPanel .log div:hover {
      background: #e8f8f8; /* Soft medium pastel turquoise background */
      transform: scale(1.02);
    }
    #smsPanel .typing {
      padding: 6px 12px;
      font-style: italic;
      color: #487e7e; /* Soft dark cyan text */
      font-size: 12px;
      animation: pulse 1s infinite ease-in-out;
      text-align: left;
    }
    #smsTriggerButton {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #fff;
      color: white;
      font-size: 25px;
      font-family: "Segoe UI Emoji", "Noto Emoji", "Apple Color Emoji", sans-serif;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(72, 126, 126, 0.2); /* Soft turquoise shadow */
      cursor: pointer;
      z-index: 10000;
      transition: transform 0.2s ease;
    }
    #smsTriggerButton:hover {
      transform: scale(1.1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bubbleFade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);

  function animateCounter(id, value) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent);
    const target = parseInt(value);
    let frame = 0;
    const steps = 10;
    const increment = (target - current) / steps;
    const update = () => {
      frame++;
      const newVal = Math.round(current + increment * frame);
      el.textContent = newVal;
      if (frame < steps) requestAnimationFrame(update);
    };
    update();
  }

  function logMessage(msg) {
    const typing = document.getElementById('typingBubble');
    typing.style.display = 'block';
    setTimeout(() => {
      typing.style.display = 'none';
      const log = document.getElementById('log');
      const line = document.createElement('div');
      line.textContent = msg;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    }, 600);
  }

  function extractCharactersFromTable() {
    const rows = document.querySelectorAll('table.data tbody tr');
    const all = [];
    for (const row of rows) {
      const link = row.querySelector('a[href*="/Character/"]');
      if (!link) continue;
      const name = link.textContent.trim();
      const id = link.href.match(/Character\/(\d+)/)?.[1];

      // Extract friendship percentage
      const friendshipCell = row.querySelectorAll('td')[1];
      const sortKey = friendshipCell?.querySelector('.sortkey');
      const friendship = sortKey ? parseInt(sortKey.textContent) : 100;

      if (id) all.push({ name, id, friendship });
    }
    return all;
  }

  function submitSMSViaIframe(charId, name, index) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = baseUrl + charId;
    document.body.appendChild(iframe);

    let submitted = false;

    iframe.onload = () => {
      if (submitted) return;
      submitted = true;

      const isTarget = targetIds.includes(charId);
      const normName = normalizeName(name);
      const parts = name.split(' ');
      const displayName = nameOnlyList.includes(normName) ? parts[1] || parts[0] : parts[0];

      let retryCount = 0;

      const checkFormReady = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          const select = doc.querySelector('select[name="ctl00$cphTopColumn$ctl00$ddlInteractionTypes"]');
          const button = doc.querySelector('input[name="ctl00$cphTopColumn$ctl00$btnInteract"]');

          if (select && button) {
            // Get available options
            const availableOptions = Array.from(select.options)
              .map(opt => opt.value)
              .filter(val => val !== '0');

            let interaction;
            if (isTarget) {
              // Try to find an available option from preferred list
              const preferred = interactionOptions.find(opt => availableOptions.includes(opt));
              if (preferred) {
                interaction = preferred;
              } else {
                // Fallback: gossip (121) > thank you (171) > wazzup (24)
                interaction = fallbackOptions.find(opt => availableOptions.includes(opt));
              }
            } else {
              // For non-targets: wazzup (24) > thank you (171) > gossip (121)
              interaction = availableOptions.includes('24') ? '24' :
                           availableOptions.includes('171') ? '171' :
                           availableOptions.includes('121') ? '121' :
                           null;
            }

            if (!interaction) {
              logMessage(t.error.replace('{name}', displayName));
              setTimeout(() => iframe.remove(), 1200);
              return;
            }

            select.value = interaction;

            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);

            button.click();

            const label = isTarget
              ? (interaction === '58'
                  ? t.funnyPic
                  : interaction === '61'
                    ? t.friendlyText
                    : interaction === '121'
                      ? t.gossip
                      : interaction === '171'
                        ? t.thankYou
                        : t.wazzup)
              : (interaction === '24'
                  ? t.wazzup
                  : interaction === '171'
                    ? t.thankYou
                    : t.gossip);

            logMessage(t.sentLabel.replace('{name}', displayName).replace('{action}', label));
            animateCounter('progressCount', index + 1);
            setTimeout(() => iframe.remove(), 1200);
          } else {
            if (retryCount < 10) {
              retryCount++;
              setTimeout(checkFormReady, 100);
            } else {
              logMessage(t.calledRecently.replace('{name}', displayName));
              setTimeout(() => iframe.remove(), 1200);
            }
          }
        } catch (e) {
          logMessage(t.error.replace('{name}', displayName));
          setTimeout(() => iframe.remove(), 1200);
        }
      };

      checkFormReady();
    };
  }

  function startCalling(onlyNon100 = false) {
    const all = extractCharactersFromTable();
    let filtered = all.filter(c => !banIds.includes(c.id));

    if (onlyNon100) {
      filtered = filtered.filter(c => c.friendship < 100);
      logMessage(t.callingNon100);
    } else {
      logMessage(t.startingCalls.replace('{count}', filtered.length));
    }

    animateCounter('foundCount', all.length);
    animateCounter('excludedCount', all.length - filtered.length);

    filtered.forEach((char, i) => {
      setTimeout(() => submitSMSViaIframe(char.id, char.name, i), i * delayBetweenCalls);
    });
  }

  triggerButton.addEventListener('click', () => {
    triggerButton.style.display = 'none';
    panel.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'callAllBtn') {
      startCalling(false);
    } else if (e.target.id === 'callNon100Btn') {
      startCalling(true);
    }
  });

})();
