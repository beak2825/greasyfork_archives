// ==UserScript==
// @name         Elimination Push Timer
// @namespace    https://torn.com
// @version      1.0.1
// @description  15 min countdown timer for Torn City elimination push coordination
// @author       Turt[2472641], TheWizardDJ[1800878]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558724/Elimination%20Push%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/558724/Elimination%20Push%20Timer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const root = document.documentElement;
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = JSON.parse(localStorage.getItem('quarterTimerDarkMode') || 'false');

  // Catppuccin Latte (light) colors
  const latte = {
    base: '#eff1f5',
    mantle: '#e6e9ef',
    crust: '#dce0e8',
    text: '#4c4f69',
    subtext1: '#5c5f77',
    subtext0: '#6c6f85',
    surface0: '#ccd0da',
    surface1: '#bcc0cc',
    surface2: '#acb0be',
    blue: '#1e66f5',
    lavender: '#7287fd',
    green: '#40a02b',
    yellow: '#df8e1d',
    red: '#d20f39',
    peach: '#fe640b',
  };

  // Catppuccin Macchiato (dark) colors
  const macchiato = {
    base: '#24273a',
    mantle: '#1e2030',
    crust: '#181926',
    text: '#cad3f5',
    subtext1: '#b8c0e0',
    subtext0: '#a5adcb',
    surface0: '#363a4f',
    surface1: '#494d64',
    surface2: '#5b6078',
    blue: '#8aadf4',
    lavender: '#b7bdf8',
    green: '#a6da95',
    yellow: '#eed49f',
    red: '#ed8796',
    peach: '#f5a97f',
  };

  const theme = (isDark || isDarkMode) ? macchiato : latte;
  const bg = theme.base;
  const fg = theme.text;
  const accent = theme.blue;
  const warning = theme.yellow;
  const danger = theme.red;
  const buttonBg = theme.surface0;

  const timer = document.createElement('div');
  timer.id = 'quarter-timer-overlay';
  timer.style.cssText = [
    'position: fixed;',
    'top: 20px;',
    'right: 20px;',
    'width: 220px;',
    'padding: 16px 18px 12px;',
    'border-radius: 12px;',
    'font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    'font-size: 14px;',
    'color: ' + fg + ';',
    'background: ' + bg + ';',
    'box-shadow: 0 15px 35px rgba(0,0,0,0.25);',
    'z-index: 2147483647;',
    'user-select: none;',
    'transition: background-color 0.3s ease, color 0.3s ease',
  ].join('');

  const titleBar = document.createElement('div');
  titleBar.style.cssText = [
    'display: flex;',
    'align-items: center;',
    'justify-content: space-between;',
    'margin-bottom: 10px;',
    'cursor: grab;',
  ].join('');
  timer.appendChild(titleBar);

  const titleText = document.createElement('span');
  titleText.textContent = 'Elim Push Timer';
  titleText.style.cssText = 'font-weight: 600; font-size: 13px;';
  titleBar.appendChild(titleText);

  const controlsContainer = document.createElement('div');
  controlsContainer.style.cssText = 'display: flex; gap: 4px;';
  titleBar.appendChild(controlsContainer);

  const minimizeBtn = document.createElement('span');
  minimizeBtn.textContent = '−';
  minimizeBtn.style.cssText = [
    'font-size: 16px;',
    'cursor: pointer;',
    'padding: 2px 6px;',
    'border-radius: 4px;',
    'opacity: 0.7;',
    'transition: opacity 0.2s;',
  ].join(' ');
  minimizeBtn.addEventListener('mouseenter', () => {
    minimizeBtn.style.opacity = '1';
  });
  minimizeBtn.addEventListener('mouseleave', () => {
    minimizeBtn.style.opacity = '0.7';
  });
  minimizeBtn.addEventListener('click', () => {
    const content = timer.querySelector('.timer-content');
    if (content) {
      const isMinimized = content.style.display === 'none';
      content.style.display = isMinimized ? 'block' : 'none';
      minimizeBtn.textContent = isMinimized ? '−' : '+';
      timer.style.width = isMinimized ? '220px' : '140px';
    }
  });
  controlsContainer.appendChild(minimizeBtn);

  const darkModeBtn = document.createElement('span');
  darkModeBtn.textContent = isDarkMode ? '◐' : '◑';
  darkModeBtn.style.cssText = [
    'font-size: 16px;',
    'cursor: pointer;',
    'padding: 2px 6px;',
    'border-radius: 4px;',
    'opacity: 0.7;',
    'transition: opacity 0.2s;',
  ].join(' ');
  darkModeBtn.addEventListener('mouseenter', () => {
    darkModeBtn.style.opacity = '1';
  });
  darkModeBtn.addEventListener('mouseleave', () => {
    darkModeBtn.style.opacity = '0.7';
  });
  darkModeBtn.addEventListener('click', () => {
    const newMode = !JSON.parse(localStorage.getItem('quarterTimerDarkMode') || 'false');
    localStorage.setItem('quarterTimerDarkMode', JSON.stringify(newMode));
    location.reload();
  });
  controlsContainer.appendChild(darkModeBtn);

  const closeButton = document.createElement('span');
  closeButton.textContent = '✕';
  closeButton.style.cssText = [
    'font-size: 16px;',
    'cursor: pointer;',
    'padding: 2px 6px;',
    'border-radius: 4px;',
    'opacity: 0.7;',
    'transition: opacity 0.2s;',
  ].join(' ');
  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.opacity = '1';
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.opacity = '0.7';
  });
  closeButton.addEventListener('click', () => {
    timer.remove();
  });
  titleBar.appendChild(closeButton);

  const content = document.createElement('div');
  content.className = 'timer-content';
  timer.appendChild(content);

  const display = document.createElement('div');
  display.id = 'quarter-timer-display';
  display.style.cssText = [
    'font-size: 32px;',
    'font-weight: 600;',
    'letter-spacing: 0.02em;',
    'margin-bottom: 6px;',
    'text-align: center;',
  ].join('');
  display.textContent = '15:01';
  content.appendChild(display);

  const nextInfo = document.createElement('div');
  nextInfo.id = 'quarter-timer-next';
  nextInfo.style.cssText = [
    'font-size: 11px;',
    'text-align: center;',
    'text-transform: uppercase;',
    'letter-spacing: 0.08em;',
    'opacity: 0.8;',
    'margin-bottom: 10px;',
  ].join('');
  nextInfo.textContent = 'Next: --:--';
  content.appendChild(nextInfo);

  const controls = document.createElement('div');
  controls.style.cssText = [
    'display: flex;',
    'gap: 6px;',
    'justify-content: center;',
  ].join('');
  content.appendChild(controls);

  // Creator credit text replacing pause/reset buttons
  const creatorText = document.createElement('div');
  creatorText.textContent = 'Created by Turt[2472641], TheWizardDJ[1800878]';
  creatorText.style.cssText = [
    'font-size: 10px;',
    'text-align: center;',
    'opacity: 0.6;',
    'width: 100%;',
  ].join('');
  controls.appendChild(creatorText);

  document.body.appendChild(timer);

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  titleBar.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    initialX = timer.offsetLeft;
    initialY = timer.offsetTop;
    titleBar.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    timer.style.left = Math.max(0, initialX + dx) + 'px';
    timer.style.top = Math.max(0, initialY + dy) + 'px';
    timer.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    titleBar.style.cursor = 'grab';
  });

  const updateColor = () => {
    const remaining = secondsUntilNextQuarter(new Date());
    timer.style.background = bg;
    timer.style.color = fg;

    if (remaining <= 41) { // Adjusted for 1s offset
      timer.style.background = danger;
      timer.style.color = '#ffffff';
    } else if (remaining <= 91) { // Adjusted for 1s offset
      timer.style.background = warning;
      timer.style.color = '#ffffff';
    }
  };

  updateColor();
  window.setInterval(updateColor, 1000);

  const loop = () => {
    const now = new Date();
    const seconds = secondsUntilNextQuarter(now);
    display.textContent = formatTime(seconds);
    nextInfo.textContent = 'Next: ' + getNextQuarterHour(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  loop();
  window.setInterval(loop, 1000);
})();

function getNextQuarterHour(date) {
  const base = new Date(date);
  const minutes = base.getMinutes();
  const currentQuarter = Math.floor(minutes / 15);
  const nextQuarter = (currentQuarter + 1) % 4;
  const nextMinute = nextQuarter * 15;

  base.setSeconds(0, 0);
  if (nextMinute === 0) {
    base.setHours(base.getHours() + 1);
    base.setMinutes(0);
  } else {
    base.setMinutes(nextMinute);
  }

  return base;
}

function secondsUntilNextQuarter(date) {
  const next = getNextQuarterHour(date);
  // Add 1 second offset to the countdown display
  return Math.max(0, Math.floor((next.getTime() - date.getTime()) / 1000) + 1);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return minutes + ':' + seconds;
}
