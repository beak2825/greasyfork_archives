// ==UserScript==
// @name         Dead Frontier – Mini Boss Map (Profile ID)
// @namespace    Dead Frontier – Mini Boss Map (Profile ID)
// @version      2.6
// @description  Embeds DFProfiler profile dynamically by player ID
// @author       Zega, Cezinha
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559181/Dead%20Frontier%20%E2%80%93%20Mini%20Boss%20Map%20%28Profile%20ID%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559181/Dead%20Frontier%20%E2%80%93%20Mini%20Boss%20Map%20%28Profile%20ID%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== URL FILTER =====
  const url = window.location.href.toLowerCase();
  if (
    url.includes('forum') ||
    url.includes('board') ||
    url.includes('topics') ||
    url.includes('topic') ||
    url.includes('action')
  ) return;

  if (document.getElementById('df-mini-bossmap')) return;

  // ===== PLAYER ID =====
  let playerId = localStorage.getItem('dfProfilerPlayerId');

  if (!playerId) {
    playerId = prompt('Enter the player ID for DFProfiler:', '8119603');
    if (!playerId || !/^\d+$/.test(playerId)) {
      alert('Invalid player ID. The map will not be loaded.');
      return;
    }
    localStorage.setItem('dfProfilerPlayerId', playerId);
  }

  const profileUrl = 'https://www.dfprofiler.com/profile/view/' + playerId;

  // ===== CONTAINER =====
  const container = document.createElement('div');
  container.id = 'df-mini-bossmap';

  Object.assign(container.style, {
    position: 'fixed',
    top: '1.2vh',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '99999',
    backgroundColor: '#111',
    border: '2px solid #444',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  });

  // ===== BUTTON BAR =====
  const btnBar = document.createElement('div');
  Object.assign(btnBar.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '6px'
  });

  const toggleBtn = document.createElement('button');
  const changeIdBtn = document.createElement('button');
  changeIdBtn.textContent = 'Change Player ID';

  [toggleBtn, changeIdBtn].forEach(btn => {
    Object.assign(btn.style, {
      backgroundColor: '#222',
      color: '#ffd700',
      border: 'none',
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: '12px'
    });
  });

  btnBar.append(toggleBtn, changeIdBtn);
  container.appendChild(btnBar);

  // ===== IFRAME =====
  const iframe = document.createElement('iframe');
  iframe.src = profileUrl;

  Object.assign(iframe.style, {
    width: '100%',
    height: 'calc(100vh - 70px)',
    maxHeight: '90vh',
    border: 'none',
    backgroundColor: '#fff'
  });

  container.appendChild(iframe);

  // ===== STATES =====
  function setHiddenState() {
    iframe.style.display = 'none';
    container.style.width = 'fit-content';
    container.style.maxWidth = 'none';
    toggleBtn.textContent = 'Show Map';
    localStorage.setItem('bossMapHidden', 'true');
  }

  function setVisibleState() {
    iframe.style.display = 'block';
    container.style.width = '80vw';
    container.style.maxWidth = '1400px';
    toggleBtn.textContent = 'Hide Map';
    localStorage.setItem('bossMapHidden', 'false');
  }

  // ===== INITIAL STATE =====
  const hidden = localStorage.getItem('bossMapHidden') === 'true';
  hidden ? setHiddenState() : setVisibleState();

  // ===== TOGGLE =====
  toggleBtn.addEventListener('click', () => {
    const isHidden = iframe.style.display === 'none';
    isHidden ? setVisibleState() : setHiddenState();
  });

  // ===== CHANGE ID =====
  changeIdBtn.addEventListener('click', () => {
    const newId = prompt('Enter the new player ID:', playerId);
    if (!newId || !/^\d+$/.test(newId)) {
      alert('Invalid player ID.');
      return;
    }
    localStorage.setItem('dfProfilerPlayerId', newId);
    iframe.src = 'https://www.dfprofiler.com/profile/view/' + newId;
  });

  document.body.appendChild(container);
  console.log('Mini Boss Map (Profile ID) loaded');
})();
