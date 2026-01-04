// ==UserScript==
// @name         TOP12 graczy wg lvl (kropki + legenda, alfabetycznie przy remisie)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Dodaje kolorową kropkę nad nickiem TOP12 graczy wg levelu (z sortowaniem alfabetycznym przy remisie) + legendę kolorów
// @match        *://*/*
// @grant        none
// @author        mleko95
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/549504/TOP12%20graczy%20wg%20lvl%20%28kropki%20%2B%20legenda%2C%20alfabetycznie%20przy%20remisie%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549504/TOP12%20graczy%20wg%20lvl%20%28kropki%20%2B%20legenda%2C%20alfabetycznie%20przy%20remisie%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const MAX_ITEMS = 12;

  const IMAGE_URLS = [
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/1.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/2.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/3.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/4.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/5.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/6.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/7.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/8.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/9.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/10.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/11.svg',
    'https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/12.svg'
  ];

  function normalizeNick(nick) {
    // Usuwa diakrytyki i zamienia nietypowe znaki na prostsze
    return nick
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // usuwa akcenty
      .toLowerCase();
  }

  function createRankImage(rank) {
    const wrapper = document.createElement('div');
    wrapper.style.width = '28px';
    wrapper.style.height = '40px';
    wrapper.style.background = '#263238';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.marginBottom = '4px';
    wrapper.style.borderRadius = '4px';

    const img = document.createElement('img');
    img.src = IMAGE_URLS[rank];
    img.style.width = '28px';
    img.style.height = '40px';

    wrapper.appendChild(img);
    wrapper.className = 'lvl-rank-wrapper';
    return wrapper;
  }

  function markTopPlayers() {
    const WG = document.getElementById('opponentGangsters');
    if (!WG) return;
    const users = WG.querySelectorAll('div.user');
    let players = [];

    users.forEach(user => {
      const divs = user.querySelectorAll('a > div');
      if (divs.length >= 2) {
        const nickDiv = divs[0];
        const lvlDiv = divs[1];
        const match = lvlDiv.textContent.match(/(\d+)\s*lvl/i);
        if (match) {
          const lvl = parseInt(match[1], 10);
          const nick = nickDiv.textContent.trim();
          players.push({ user, nickDiv, lvl, nick });
        }
      }
    });

    if (players.length === 0) return;

    // Sortowanie wg lvl malejąco, a przy remisie — alfabetycznie (po normalizacji)
    players.sort((a, b) => {
      if (b.lvl !== a.lvl) return b.lvl - a.lvl;
      return normalizeNick(a.nick).localeCompare(normalizeNick(b.nick), 'pl');
    });

    const topPlayers = players.slice(0, MAX_ITEMS);

    topPlayers.forEach((p, i) => {
      const rank = i;
      if (!p.nickDiv.parentElement.querySelector('.lvl-rank-wrapper')) {
        const rankWrapper = createRankImage(rank);
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        p.nickDiv.parentElement.insertBefore(wrapper, p.nickDiv);
        wrapper.appendChild(rankWrapper);
        wrapper.appendChild(p.nickDiv);
      }
    });

    // legenda
    if (!document.getElementById('lvl-legend')) {
      const legendWrapper = document.createElement('div');
      legendWrapper.id = 'lvl-legend';
      legendWrapper.style.marginTop = '10px';
      legendWrapper.style.padding = '5px';
      legendWrapper.style.borderTop = '1px solid #ccc';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';

      const title = document.createElement('span');
      title.textContent = 'Legenda TOP12 wg lvl:';

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'Pokaż';
      toggleBtn.style.marginLeft = '10px';
      toggleBtn.style.cursor = 'pointer';

      header.appendChild(title);
      header.appendChild(toggleBtn);
      legendWrapper.appendChild(header);

      const legendContent = document.createElement('div');
      legendContent.style.marginTop = '5px';
      legendContent.style.display = 'none';
      legendContent.style.flexWrap = 'wrap';
      legendContent.style.gap = '6px';
      legendContent.style.flexDirection = 'row';

      for (let i = 0; i < MAX_ITEMS; i++) {
        const imgItem = createRankImage(i);
        legendContent.appendChild(imgItem);
      }

      legendWrapper.appendChild(legendContent);
      WG.appendChild(legendWrapper);

      toggleBtn.addEventListener('click', () => {
        if (legendContent.style.display === 'none' || legendContent.style.display === '') {
          legendContent.style.display = 'flex';
          toggleBtn.textContent = 'Ukryj';
        } else {
          legendContent.style.display = 'none';
          toggleBtn.textContent = 'Pokaż';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markTopPlayers);
  } else {
    markTopPlayers();
  }

  new MutationObserver(markTopPlayers).observe(document.body, { childList: true, subtree: true });
})();
