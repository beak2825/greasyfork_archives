// ==UserScript==
// @name         Infinite Craft - Auto Dragger PRO
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Why not automate the game?
// @author       Silverfox0338
// @license      CC-BY-NC-ND-4.0
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556028/Infinite%20Craft%20-%20Auto%20Dragger%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/556028/Infinite%20Craft%20-%20Auto%20Dragger%20PRO.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Infinite Craft Auto-Dragger Pro v6.0 Ultimate Terminal Edition
// U2FsdGVkX1+8xJ2kL9pVzQwX4HKl3mNvY8RtPxQ2aE9iZWF0ZWQgYnk6IFNpbHZlcmZveDAzMzg=
(function() {
  const VERSION = 'v6.0';
  const CREATOR = atob('Q3JlYXRlZCBieSBTaWx2ZXJmb3gwMzM4');

  let isRunning = false;
  let dragCount = 0;
  let totalAttempts = 0;
  let discoveredItems = [];
  let speedMultiplier = 1;
  let isMinimized = false;
  let startTime = null;
  let elapsedTime = 0;
  let timerInterval = null;
  let performanceMode = 'auto';
  let currentFPS = 0;
  let autoSpeedAdjusting = false;
  let isDraggingPanel = false;
  let dragOffset = { x: 0, y: 0 };

  let priorityItems = [];
  let blacklistItems = [];
  let pauseAfterDiscoveries = 0;
  let pauseAfterMinutes = 0;

  let soundEnabled = true;
  let celebrationEnabled = true;
  
  // Theme System - Now with 3 presets
  let activeThemePreset = localStorage.getItem('infinecraft_theme_preset') || 'hacker';
  let terminalEffectsEnabled = localStorage.getItem('infinecraft_terminal_effects') !== 'false';

  let discoveryTimeline = [];
  let elementFrequency = {};

  let debugMode = false;
  let debugCanvas = null;

  let keyboardShortcutsEnabled = true;
  let shortcutStartStop = 's';
  let shortcutMinimize = 'm';
  let shortcutExport = 'e';
  let shortcutTheme = 't';

  let performanceMetrics = {
    avgDragTime: 0,
    failedDrags: 0,
    successfulDrags: 0,
    totalDragTime: 0
  };

  const performanceSettings = {
    'auto': { speed: 1.5, dragSteps: 25, baseDelay: 60, clearDelay: 800, minSpeed: 1.0, maxSpeed: 3.0 },
    'manual': { speed: 1.0, dragSteps: 30, baseDelay: 80, clearDelay: 1000 }
  };

  let userId = localStorage.getItem('infinecraft_userid') || 'user_' + Date.now();
  let userStats = { totalDiscoveries: 0, totalAttempts: 0, totalTime: 0, currentStreak: 0 };

  let quests = [
    { id: 'discover_10', name: 'Explorer', target: 10, progress: 0, completed: false, points: 10 },
    { id: 'discover_25', name: 'Adventurer', target: 25, progress: 0, completed: false, points: 25 },
    { id: 'discover_50', name: 'Crafter', target: 50, progress: 0, completed: false, points: 50 },
    { id: 'discover_100', name: 'Master', target: 100, progress: 0, completed: false, points: 100 },
    { id: 'discover_250', name: 'Legend', target: 250, progress: 0, completed: false, points: 250 },
    { id: 'discover_500', name: 'Champion', target: 500, progress: 0, completed: false, points: 500 },
    { id: 'discover_1000', name: 'Ultimate Crafter', target: 1000, progress: 0, completed: false, points: 1000 }
  ];

  let questPoints = 0;
  let questLevel = 1;

  const successSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSh+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSh3xvDdkUAKE16z6eynVRUJRp/h8sFuJAUvhdDz1YU1Bx5tv+/jmUgND1as5++wXRgIPpba8sZ2KQUofszy2os7CBhkuezooVARCUyk4fG5ZRwFNo3V8859LwUod8bw3ZFAC');

  // --- THEME CONFIGURATION (3 Presets) ---
  function getThemeColors() {
    const themes = {
      hacker: {
        terminalBg: 'rgba(0, 20, 0, 0.98)',
        terminalBorder: '#0f0',
        terminalText: '#0f0',
        terminalTextSecondary: '#0a0',
        terminalAccent: '#0f0',
        terminalAccentDim: 'rgba(0, 255, 0, 0.2)',
        surface: 'rgba(0, 255, 0, 0.05)',
        surfaceHover: 'rgba(0, 255, 0, 0.1)',
        border: 'rgba(0, 255, 0, 0.2)',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        shadow: 'rgba(0, 255, 0, 0.2)',
        shadowLarge: 'rgba(0, 255, 0, 0.3)',
        scanlineOpacity: '0.05',
        font: "'Courier New', monospace",
        matrixChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()',
        matrixBg: '#000'
      },
      furry: {
        terminalBg: 'rgba(255, 240, 245, 0.98)',
        terminalBorder: '#ff69b4',
        terminalText: '#880044',
        terminalTextSecondary: '#ff8da1',
        terminalAccent: '#ffa500',
        terminalAccentDim: 'rgba(255, 105, 180, 0.1)',
        surface: 'rgba(255, 255, 255, 0.6)',
        surfaceHover: 'rgba(255, 192, 203, 0.3)',
        border: 'rgba(255, 105, 180, 0.3)',
        success: '#ff1493',
        error: '#ff0000',
        warning: '#ffca00',
        info: '#00bfff',
        shadow: 'rgba(255, 105, 180, 0.2)',
        shadowLarge: 'rgba(255, 105, 180, 0.4)',
        scanlineOpacity: '0.01',
        font: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
        matrixChars: 'UwUOwO♥♦♣♠★',
        matrixBg: '#fff0f5'
      },
      synthwave: {
        terminalBg: 'rgba(20, 0, 40, 0.98)',
        terminalBorder: '#00f3ff',
        terminalText: '#ff00ff',
        terminalTextSecondary: '#bd00ff',
        terminalAccent: '#00f3ff',
        terminalAccentDim: 'rgba(0, 243, 255, 0.15)',
        surface: 'rgba(255, 0, 255, 0.05)',
        surfaceHover: 'rgba(0, 243, 255, 0.1)',
        border: 'rgba(0, 243, 255, 0.3)',
        success: '#00ff9d',
        error: '#ff2a2a',
        warning: '#ffdd00',
        info: '#00f3ff',
        shadow: 'rgba(0, 243, 255, 0.3)',
        shadowLarge: 'rgba(255, 0, 255, 0.4)',
        scanlineOpacity: '0.08',
        font: "'Courier New', monospace",
        matrixChars: '▲▼◄►★☆◆◇○●□■',
        matrixBg: '#140028'
      }
    };
    return themes[activeThemePreset] || themes.hacker;
  }

  function applyTheme() {
    const theme = getThemeColors();
    const root = document.documentElement;
    Object.keys(theme).forEach(key => {
      if(key !== 'font' && key !== 'matrixChars' && key !== 'matrixBg') {
        root.style.setProperty(`--theme-${key}`, theme[key]);
      }
    });
    
    const panel = document.getElementById('auto-dragger-panel');
    if(panel) panel.style.fontFamily = theme.font;

    const scanline = document.querySelector('.panel-scanline');
    if (scanline) {
      scanline.style.display = terminalEffectsEnabled ? 'block' : 'none';
    }
    
    // Update theme badge
    const themeBadge = document.querySelector('.theme-badge');
    if(themeBadge) themeBadge.textContent = activeThemePreset.toUpperCase();
  }

  function setThemePreset(preset) {
    activeThemePreset = preset;
    localStorage.setItem('infinecraft_theme_preset', preset);
    applyTheme();
    updateThemeButtons();
    showToast(`Theme: ${preset.toUpperCase()}`, 'success');
  }

  function updateThemeButtons() {
    document.querySelectorAll('[data-theme-preset]').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.themePreset === activeThemePreset) {
        btn.classList.add('active');
      }
    });
  }

  function cycleTheme() {
    const themes = ['hacker', 'furry', 'synthwave'];
    const currentIndex = themes.indexOf(activeThemePreset);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemePreset(themes[nextIndex]);
  }

  // --- THEME SELECTOR POPUP ---
  function createThemeSelector() {
    return new Promise((resolve) => {
      const selector = document.createElement('div');
      selector.id = 'theme-selector-overlay';
      selector.innerHTML = `
        <style>
          #theme-selector-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #000 0%, #1a1a2e 50%, #000 100%);
            z-index: 100000; display: flex;
            flex-direction: column; align-items: center; justify-content: center;
            font-family: 'Courier New', monospace;
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          
          .selector-title {
            color: #fff; font-size: 28px; margin-bottom: 50px;
            text-transform: uppercase; letter-spacing: 6px;
            text-shadow: 0 0 20px rgba(255,255,255,0.8);
            animation: glowPulse 2s ease-in-out infinite;
          }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.8); }
            50% { text-shadow: 0 0 40px rgba(255,255,255,1); }
          }
          
          .theme-cards {
            display: flex; gap: 30px; perspective: 1000px;
          }
          .theme-card {
            width: 220px; height: 280px;
            border-radius: 12px; cursor: pointer;
            position: relative; overflow: hidden;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            border: 3px solid;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          }
          .theme-card:hover { 
            transform: translateY(-15px) scale(1.05); 
          }
          
          .card-hacker {
            background: linear-gradient(135deg, #001400 0%, #003300 100%);
            border-color: #0f0;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
          }
          .card-hacker:hover { box-shadow: 0 0 60px rgba(0, 255, 0, 0.8); }
          .card-hacker .card-icon { color: #0f0; text-shadow: 0 0 15px #0f0; }
          .card-hacker .card-name { color: #0f0; }
          .card-hacker .card-desc { color: #0a0; }
          
          .card-furry {
            background: linear-gradient(135deg, #fff0f5 0%, #ffb6c1 100%);
            border-color: #ff69b4;
            box-shadow: 0 0 30px rgba(255, 105, 180, 0.3);
            font-family: 'Comic Sans MS', cursive;
          }
          .card-furry:hover { box-shadow: 0 0 60px rgba(255, 105, 180, 0.8); }
          .card-furry .card-icon { color: #ff1493; text-shadow: 0 0 15px #ff69b4; }
          .card-furry .card-name { color: #ff1493; }
          .card-furry .card-desc { color: #ff69b4; }
          
          .card-synth {
            background: linear-gradient(135deg, #140028 0%, #2d0050 100%);
            border-color: #00f3ff;
            box-shadow: 0 0 30px rgba(0, 243, 255, 0.3);
          }
          .card-synth:hover { box-shadow: 0 0 60px rgba(255, 0, 255, 0.8); }
          .card-synth .card-icon { 
            color: #ff00ff; 
            text-shadow: 0 0 15px #ff00ff, 0 0 30px #00f3ff; 
          }
          .card-synth .card-name { color: #00f3ff; }
          .card-synth .card-desc { color: #bd00ff; }

          .card-icon { 
            font-size: 50px; margin-bottom: 20px; 
            font-weight: bold; 
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .card-name { 
            font-size: 22px; font-weight: bold; letter-spacing: 3px; 
            margin-bottom: 15px;
          }
          .card-desc { 
            font-size: 11px; opacity: 0.8; text-align: center; 
            padding: 0 15px; line-height: 1.5;
          }
          
          .selector-subtitle {
            color: #888; font-size: 12px; margin-top: 40px;
            letter-spacing: 2px; text-transform: uppercase;
          }
        </style>
        <div class="selector-title">⚡ SELECT INTERFACE THEME ⚡</div>
        <div class="theme-cards">
          <div class="theme-card card-hacker" data-theme="hacker">
            <div class="card-icon">▮▮</div>
            <div class="card-name">HACKER</div>
            <div class="card-desc">Classic matrix terminal. Green phosphor on black. Maximum stealth mode.</div>
          </div>
          <div class="theme-card card-furry" data-theme="furry">
            <div class="card-icon">UwU</div>
            <div class="card-name">FURRY</div>
            <div class="card-desc">Soft, cute, and fluffy! Pink aesthetics with adorable paw-some visuals~ ♥</div>
          </div>
          <div class="theme-card card-synth" data-theme="synthwave">
            <div class="card-icon">▲</div>
            <div class="card-name">SYNTH</div>
            <div class="card-desc">Retro 80s vibes. Neon grids, purple haze, and cyan lasers. Pure aesthetic.</div>
          </div>
        </div>
        <div class="selector-subtitle">Click to select • Alt+T to cycle later</div>
      `;
      
      document.body.appendChild(selector);
      
      selector.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
          const selected = card.dataset.theme;
          activeThemePreset = selected;
          localStorage.setItem('infinecraft_theme_preset', selected);
          selector.style.opacity = '0';
          selector.style.transition = 'opacity 0.6s ease';
          setTimeout(() => {
            selector.remove();
            resolve(selected);
          }, 600);
        });
      });
    });
  }

  // --- UTILITIES ---
  function showToast(message, type = 'info') {
    const theme = getThemeColors();
    const toast = document.createElement('div');
    const colors = {
      success: theme.success,
      error: theme.error,
      info: theme.info,
      warning: theme.warning
    };
    
    const bgColor = colors[type] || colors.info;
    const textColor = activeThemePreset === 'furry' ? '#fff' : activeThemePreset === 'hacker' ? '#000' : '#000';
    
    toast.style.cssText = `position:fixed;top:80px;right:20px;background:${bgColor};
      padding:16px 24px;border-radius:8px;color:${textColor};
      font-family:${theme.font};font-size:13px;
      box-shadow:0 0 20px ${bgColor};z-index:10004;animation:slideInRight 0.3s ease-out;
      max-width:300px;word-wrap:break-word;font-weight:700;border:2px solid ${theme.terminalBorder};`;
    
    let displayMsg = message;
    if (activeThemePreset === 'furry') displayMsg = displayMsg + ' UwU';
    
    const prefix = activeThemePreset === 'hacker' ? '> ' : activeThemePreset === 'furry' ? '♥ ' : '★ ';
    toast.textContent = prefix + displayMsg;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- LOADING SCREEN ---
  function createLoadingScreen() {
    const theme = getThemeColors();
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'auto-dragger-loading';
    
    loadingScreen.innerHTML = `
      <style>
        #auto-dragger-loading {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: ${theme.matrixBg}; display: flex; flex-direction: column;
          align-items: center; justify-content: center; z-index: 99999;
          font-family: ${theme.font}; color: ${theme.terminalBorder}; overflow: hidden;
        }
        .matrix-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.15; z-index: 1; }
        .loading-content { position: relative; z-index: 2; text-align: center; }
        .terminal-window {
          background: ${theme.terminalBg}; border: 2px solid ${theme.terminalBorder};
          border-radius: 8px; padding: 24px;
          box-shadow: 0 0 50px ${theme.shadowLarge}, inset 0 0 20px ${theme.shadow};
          min-width: 600px; max-width: 700px; color: ${theme.terminalText};
        }
        .terminal-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
          padding-bottom: 12px; border-bottom: 1px solid ${theme.terminalBorder};
        }
        .terminal-dot {
          width: 12px; height: 12px; border-radius: 50%; background: ${theme.terminalBorder};
          box-shadow: 0 0 8px ${theme.terminalBorder}; animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .ascii-art { font-size: 10px; line-height: 1.2; margin-bottom: 20px; white-space: pre; text-shadow: 0 0 5px ${theme.terminalBorder}; }
        .terminal-line { margin-bottom: 8px; opacity: 0; animation: fadeInLine 0.3s ease-out forwards; text-align:left; }
        .terminal-line::before { content: '${activeThemePreset === 'furry' ? '♥ ' : '> '}'; color: ${theme.terminalAccent}; font-weight: bold; }
        @keyframes fadeInLine { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .loading-bar-container {
          background: ${theme.surface}; border: 1px solid ${theme.terminalBorder};
          border-radius: 4px; height: 24px; overflow: hidden; margin-bottom: 16px; position: relative; margin-top: 20px;
        }
        .loading-bar {
          height: 100%; background: ${theme.terminalAccent}; width: 0%;
          transition: width 0.1s linear; box-shadow: 0 0 10px ${theme.terminalAccent};
        }
        .loading-bar::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .scanline {
          position: absolute; top: 0; left: 0; width: 100%; height: 2px;
          background: ${theme.terminalAccentDim}; animation: scan 6s linear infinite; z-index: 3;
        }
        @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }
      </style>
      <canvas class="matrix-bg" id="matrix-canvas"></canvas>
      <div class="scanline"></div>
      <div class="loading-content">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dot"></div>
            <div class="terminal-dot" style="animation-delay: 0.3s;"></div>
            <div class="terminal-dot" style="animation-delay: 0.6s;"></div>
            <div class="terminal-title">SYSTEM_BOOT_${activeThemePreset.toUpperCase()}</div>
          </div>
          <div class="ascii-art">
    ▄▀█ █░█ ▀█▀ █▀█   █▀▄ █▀█ ▄▀█ █▀▀ █▀▀ █▀▀ █▀█
    █▀█ █▄█ ░█░ █▄█   █▄▀ █▀▄ █▀█ █▄█ █▄█ ██▄ █▀▄
                      ${VERSION} ${activeThemePreset.toUpperCase()}
          </div>
          <div class="terminal-text" id="terminal-output"></div>
          <div class="loading-bar-container"><div class="loading-bar" id="loading-progress-bar"></div></div>
          <div class="loading-status"><span id="loading-status-text">INITIALIZING</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(loadingScreen);
    
    // Matrix Effect
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
      const fadeColor = activeThemePreset === 'furry' ? 'rgba(255, 240, 245, 0.1)' : 
                        activeThemePreset === 'synthwave' ? 'rgba(20, 0, 40, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme.terminalBorder;
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = theme.matrixChars[Math.floor(Math.random() * theme.matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const matrixInterval = setInterval(drawMatrix, 33);
    loadingScreen.matrixInterval = matrixInterval;
    return loadingScreen;
  }

  function animateLoadingScreen(loadingScreen, duration = 6000) {
    return new Promise((resolve) => {
      const progressBar = document.getElementById('loading-progress-bar');
      const statusText = document.getElementById('loading-status-text');
      const terminalOutput = document.getElementById('terminal-output');
      const startTime = Date.now();

      let messages = [];
      if (activeThemePreset === 'furry') {
        messages = [
          'Waking up system OwO...', 'Brushing the code...', 'Loading cuteness drivers...', 
          'Petting the algorithms...', 'Generating paw-sibilities...', 'Almost ready UwU...'
        ];
      } else if (activeThemePreset === 'synthwave') {
        messages = [
          'Rezzed grid system...', 'Synthesizing logic...', 'Loading neon buffers...', 
          'Calculating gradients...', 'Vaporwave stabilizers on...', 'System Ready.'
        ];
      } else {
        messages = [
          'Mounting filesystem...', 'Bypassing security...', 'Injecting drag logic...', 
          'Optimizing neural paths...', 'Compiling exploit...', 'Access Granted.'
        ];
      }

      function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        if (progressBar) progressBar.style.width = progress + '%';
        
        const msgIndex = Math.floor((progress / 100) * messages.length);
        if(terminalOutput && terminalOutput.children.length <= msgIndex && messages[msgIndex]) {
          const line = document.createElement('div');
          line.className = 'terminal-line';
          line.textContent = messages[msgIndex];
          terminalOutput.appendChild(line);
          if(statusText) statusText.textContent = messages[msgIndex].toUpperCase();
        }

        if (elapsed < duration) requestAnimationFrame(update);
        else setTimeout(resolve, 500);
      }
      update();
    });
  }

  function removeLoadingScreen(loadingScreen) {
    if (loadingScreen.matrixInterval) clearInterval(loadingScreen.matrixInterval);
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => loadingScreen.remove(), 500);
  }

  // --- PANEL DRAG LOGIC WITH WARNING ---
  function setupPanelDragging() {
    const panel = document.getElementById('auto-dragger-panel');
    const header = panel.querySelector('.panel-header');
    let warningShown = false;

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('minimize-btn') || e.target.closest('.minimize-btn') ||
          e.target.classList.contains('theme-btn') || e.target.closest('.theme-btn')) return;
      
      // *** PREVENT DRAG WHEN RUNNING ***
      if (isRunning) {
        if (!warningShown) {
          showToast('CANNOT MOVE PANEL WHILE RUNNING!', 'error');
          // Shake effect
          panel.style.transform = 'translateX(5px)';
          setTimeout(() => panel.style.transform = 'translateX(-5px)', 50);
          setTimeout(() => panel.style.transform = 'translateX(5px)', 100);
          setTimeout(() => panel.style.transform = 'translateX(0)', 150);
          warningShown = true;
          setTimeout(() => warningShown = false, 3000);
        }
        return;
      }

      isDraggingPanel = true;
      const rect = panel.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      panel.style.transition = 'none';
      panel.style.cursor = 'grabbing';
      header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingPanel) return;
      const panel = document.getElementById('auto-dragger-panel');
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDraggingPanel) {
        isDraggingPanel = false;
        const panel = document.getElementById('auto-dragger-panel');
        const header = panel.querySelector('.panel-header');
        panel.style.transition = '';
        panel.style.cursor = '';
        header.style.cursor = '';
      }
    });
  }

  function toggleMinimize() {
    const panel = document.getElementById('auto-dragger-panel');
    const btn = document.getElementById('minimize-btn');
    if (!panel || !btn) return;

    isMinimized = !isMinimized;
    panel.classList.toggle('minimized', isMinimized);
    btn.textContent = isMinimized ? '[+]' : '[−]';
  }

  // --- MAIN PANEL CONSTRUCTION ---
  function createControlPanel() {
    const theme = getThemeColors();
    const panel = document.createElement('div');
    panel.id = 'auto-dragger-panel';
    
    panel.innerHTML = `
      <style>
        :root {
          --theme-terminalBg: ${theme.terminalBg};
          --theme-terminalBorder: ${theme.terminalBorder};
          --theme-terminalText: ${theme.terminalText};
          --theme-terminalTextSecondary: ${theme.terminalTextSecondary};
          --theme-terminalAccent: ${theme.terminalAccent};
          --theme-terminalAccentDim: ${theme.terminalAccentDim};
          --theme-surface: ${theme.surface};
          --theme-surfaceHover: ${theme.surfaceHover};
          --theme-border: ${theme.border};
          --theme-success: ${theme.success};
          --theme-error: ${theme.error};
          --theme-warning: ${theme.warning};
          --theme-info: ${theme.info};
          --theme-shadow: ${theme.shadow};
          --theme-shadowLarge: ${theme.shadowLarge};
          --theme-scanlineOpacity: ${theme.scanlineOpacity};
        }
        
        * { box-sizing: border-box; }
        
        @keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        
        #auto-dragger-panel {
          position: fixed; top: 20px; right: 20px;
          background: var(--theme-terminalBg); border-radius: 8px;
          padding: 0; box-shadow: 0 0 40px var(--theme-shadowLarge), 0 0 2px var(--theme-terminalBorder) inset;
          z-index: 10000; font-family: ${theme.font};
          min-width: 440px; max-width: 440px;
          color: var(--theme-terminalText); max-height: 90vh;
          overflow: hidden; backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid var(--theme-terminalBorder);
        }
        
        .panel-scanline {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(255,255,255,var(--theme-scanlineOpacity)) 3px);
          pointer-events: none; z-index: 1;
        }
        
        .panel-content-wrapper { 
          position: relative; z-index: 2; max-height: 90vh; 
          overflow-y: auto; padding: 20px; 
        }
        .panel-content-wrapper::-webkit-scrollbar { width: 8px; }
        .panel-content-wrapper::-webkit-scrollbar-track { background: var(--theme-surface); border-radius: 4px; }
        .panel-content-wrapper::-webkit-scrollbar-thumb { background: var(--theme-terminalAccent); border-radius: 4px; }
        
        #auto-dragger-panel.minimized { min-width: auto; max-width: auto; overflow: hidden; }
        #auto-dragger-panel.minimized .panel-content { display: none; }
        
        .panel-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px; cursor: move; user-select: none;
          padding-bottom: 12px; border-bottom: 1px solid var(--theme-terminalBorder);
        }
        
        .panel-header h3 {
          margin: 0; font-size: 14px; font-weight: 700;
          display: flex; flex-direction: column; gap: 8px;
          letter-spacing: 1px; text-transform: uppercase;
        }
        
        .header-controls { display: flex; align-items: center; gap: 6px; }
        
        .status-indicator {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px; background: var(--theme-surface);
          border-radius: 4px; font-size: 11px; font-weight: 700;
          border: 1px solid var(--theme-border);
        }
        
        .status-dot {
          display: inline-block; width: 8px; height: 8px; border-radius: 50%;
          background: var(--theme-error); box-shadow: 0 0 8px var(--theme-error);
          animation: pulse-stop 2s ease-in-out infinite;
        }
        .status-dot.active {
          background: var(--theme-success); box-shadow: 0 0 8px var(--theme-success);
          animation: pulse-running 1s ease-in-out infinite;
        }
        @keyframes pulse-stop { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes pulse-running { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        
        .status-text-inline { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 10px; }
        
        .theme-btn, .minimize-btn {
          background: var(--theme-surface); border: 1px solid var(--theme-border);
          width: 28px; height: 28px; border-radius: 4px; cursor: pointer;
          color: var(--theme-terminalText); font-size: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; font-weight: 700;
          font-family: ${theme.font};
        }
        .theme-btn:hover, .minimize-btn:hover {
          background: var(--theme-surfaceHover);
          box-shadow: 0 0 8px var(--theme-terminalAccent);
        }
        
        .tabs {
          display: flex; gap: 6px; margin-bottom: 16px;
          background: var(--theme-surface); padding: 4px;
          border-radius: 4px; border: 1px solid var(--theme-border);
        }
        
        .tab {
          flex: 1; padding: 8px 12px; background: transparent;
          border: none; border-radius: 2px; cursor: pointer;
          font-size: 11px; font-weight: 700; text-align: center;
          color: var(--theme-terminalTextSecondary);
          transition: all 0.2s ease; font-family: ${theme.font};
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .tab.active {
          background: var(--theme-terminalAccent); color: #000;
          box-shadow: 0 0 10px var(--theme-terminalAccent);
        }
        .tab:hover:not(.active) {
          background: var(--theme-surfaceHover);
          color: var(--theme-terminalText);
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease; }
        
        .data-box {
          background: var(--theme-surface); border-radius: 4px;
          padding: 10px 12px; margin-bottom: 10px;
          border: 1px solid var(--theme-border);
          position: relative; overflow: hidden;
        }
        .data-box::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 100%; background: var(--theme-terminalAccent);
          box-shadow: 0 0 5px var(--theme-terminalAccent);
        }
        .data-box-header {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: var(--theme-terminalTextSecondary);
          margin-bottom: 6px; padding-left: 8px;
        }
        .data-box-value {
          font-size: 20px; font-weight: 700;
          color: var(--theme-terminalText); padding-left: 8px;
          text-shadow: 0 0 5px var(--theme-terminalAccent);
        }
        
        .data-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 12px;
        }
        
        .section {
          background: var(--theme-surface); border-radius: 4px;
          padding: 12px; margin-bottom: 12px;
          border: 1px solid var(--theme-border);
        }
        .section-title {
          font-size: 11px; font-weight: 700; margin-bottom: 10px;
          color: var(--theme-terminalText); text-transform: uppercase;
          letter-spacing: 1px; padding-bottom: 8px;
          border-bottom: 1px solid var(--theme-border);
        }
        
        .stat-row {
          display: flex; justify-content: space-between;
          margin-bottom: 8px; font-size: 12px;
        }
        .stat-row:last-child { margin-bottom: 0; }
        .stat-label { color: var(--theme-terminalTextSecondary); font-weight: 600; }
        .stat-value { font-weight: 700; font-size: 13px; color: var(--theme-terminalText); }
        
        .speed-btn, .option-btn {
          flex: 1; padding: 8px 12px;
          border: 1px solid var(--theme-border);
          background: var(--theme-surface); border-radius: 4px;
          font-size: 11px; font-weight: 700; cursor: pointer;
          color: var(--theme-terminalText);
          transition: all 0.2s ease;
          font-family: ${theme.font};
          text-transform: uppercase;
        }
        .speed-btn:hover, .option-btn:hover {
          background: var(--theme-surfaceHover);
          box-shadow: 0 0 5px var(--theme-terminalAccent);
        }
        .speed-btn.active, .option-btn.active {
          background: var(--theme-terminalAccent);
          border-color: var(--theme-terminalAccent);
          color: #000; box-shadow: 0 0 10px var(--theme-terminalAccent);
        }
        
        .speed-buttons, .option-buttons {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        
        .controls { display: flex; gap: 10px; margin-bottom: 12px; }
        
        button:not(.minimize-btn):not(.speed-btn):not(.option-btn):not(.tab):not(.theme-btn) {
          flex: 1; padding: 12px 20px; border: 2px solid;
          border-radius: 4px; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease;
          text-transform: uppercase; letter-spacing: 1px;
          font-family: ${theme.font};
        }
        button:hover:not(:disabled) { box-shadow: 0 0 15px; }
        button:active:not(:disabled) { transform: scale(0.98); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        #start-btn {
          background: transparent; color: var(--theme-success);
          border-color: var(--theme-success);
        }
        #start-btn:hover:not(:disabled) {
          background: var(--theme-success); color: #000;
          box-shadow: 0 0 15px var(--theme-success);
        }
        
        #stop-btn {
          background: transparent; color: var(--theme-error);
          border-color: var(--theme-error);
        }
        #stop-btn:hover:not(:disabled) {
          background: var(--theme-error); color: #000;
          box-shadow: 0 0 15px var(--theme-error);
        }
        
        .discoveries {
          background: var(--theme-surface); border-radius: 4px;
          padding: 12px; max-height: 200px; overflow-y: auto;
          border: 1px solid var(--theme-border);
        }
        .discoveries::-webkit-scrollbar { width: 6px; }
        .discoveries::-webkit-scrollbar-track { background: var(--theme-surface); border-radius: 3px; }
        .discoveries::-webkit-scrollbar-thumb { background: var(--theme-terminalAccent); border-radius: 3px; }
        
        .discovery-item {
          font-size: 11px; padding: 8px 10px;
          background: var(--theme-terminalAccentDim);
          border-left: 2px solid var(--theme-success);
          border-radius: 2px; margin-bottom: 6px;
          animation: slideInLeft 0.3s ease;
          color: var(--theme-terminalText);
        }
        .discovery-item::before {
          content: '${activeThemePreset === 'furry' ? '♥ ' : '> '}';
          color: var(--theme-terminalAccent); font-weight: 700;
        }
        @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        input[type="text"], input[type="number"] {
          width: 100%; padding: 8px 10px;
          border: 1px solid var(--theme-border);
          background: var(--theme-surface); border-radius: 4px;
          color: var(--theme-terminalText); font-size: 11px;
          margin-bottom: 8px; transition: all 0.2s ease;
          font-family: ${theme.font};
        }
        input:focus {
          outline: none; border-color: var(--theme-terminalAccent);
          box-shadow: 0 0 8px var(--theme-terminalAccent);
        }
        input::placeholder { color: var(--theme-terminalTextSecondary); }
        
        .input-label {
          font-size: 10px; margin-bottom: 6px; display: block;
          font-weight: 700; color: var(--theme-terminalTextSecondary);
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        
        .small-btn { padding: 8px 12px !important; font-size: 10px !important; }
        
        .auto-speed-indicator {
          background: var(--theme-terminalAccentDim);
          border: 2px solid var(--theme-success);
          border-radius: 4px; padding: 12px; text-align: center;
          margin-bottom: 12px;
        }
        .auto-speed-value {
          font-size: 24px; font-weight: 800;
          color: var(--theme-success); margin-bottom: 4px;
          text-shadow: 0 0 10px var(--theme-success);
        }
        .auto-speed-label {
          font-size: 10px; font-weight: 700;
          color: var(--theme-terminalTextSecondary);
          text-transform: uppercase; letter-spacing: 1px;
        }
        
        .version-badge {
          font-size: 9px; padding: 2px 6px;
          background: var(--theme-surface); border-radius: 2px;
          font-weight: 700; letter-spacing: 1px;
          border: 1px solid var(--theme-border);
        }
        
        .theme-badge {
          font-size: 9px; padding: 2px 4px;
          border: 1px solid var(--theme-terminalAccent);
          border-radius: 3px; font-weight: 700;
        }
        
        .quest-item {
          padding: 10px; margin-bottom: 8px;
          background: var(--theme-surface); border-radius: 4px;
          border-left: 3px solid var(--theme-terminalAccent);
          transition: all 0.2s ease;
          border: 1px solid var(--theme-border);
        }
        .quest-item:hover {
          background: var(--theme-surfaceHover);
          box-shadow: 0 0 8px var(--theme-terminalAccent);
        }
        .quest-item.completed {
          background: var(--theme-terminalAccentDim);
          border-left-color: var(--theme-success);
        }
        .quest-icon {
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .quest-points {
          font-size: 10px; padding: 3px 8px;
          background: var(--theme-surface); border-radius: 10px;
          font-weight: 700; border: 1px solid var(--theme-border);
        }
        .quest-progress-bar {
          flex: 1; height: 6px; background: var(--theme-surface);
          border-radius: 3px; overflow: hidden;
          border: 1px solid var(--theme-border);
        }
        .quest-progress-fill {
          height: 100%; background: var(--theme-terminalAccent);
          border-radius: 3px; transition: width 0.3s ease;
          box-shadow: 0 0 5px var(--theme-terminalAccent);
        }
        .quest-item.completed .quest-progress-fill {
          background: var(--theme-success);
          box-shadow: 0 0 5px var(--theme-success);
        }
        .quest-progress-text {
          font-size: 11px; min-width: 50px; text-align: right;
          font-weight: 700; color: var(--theme-terminalTextSecondary);
        }
        
        .export-import-btns { display: flex; gap: 8px; margin-top: 10px; }
        .export-btn, .import-btn {
          flex: 1; padding: 8px !important; font-size: 10px !important;
          background: transparent !important; color: var(--theme-info) !important;
          border-color: var(--theme-info) !important;
        }
        .export-btn:hover, .import-btn:hover {
          background: var(--theme-info) !important; color: #000 !important;
          box-shadow: 0 0 10px var(--theme-info) !important;
        }
        
        .creator-badge {
          text-align: center; font-size: 9px;
          color: var(--theme-terminalTextSecondary);
          margin-top: 12px; padding: 8px;
          background: var(--theme-surface); border-radius: 4px;
          border: 1px solid var(--theme-border);
        }
        
        .theme-preset-buttons { display: flex; gap: 4px; margin-bottom: 8px; }
        .theme-preset-btn { flex: 1; padding: 6px !important; font-size: 9px !important; }
      </style>
      
      <div class="panel-scanline"></div>
      
      <div class="panel-content-wrapper">
        <div class="panel-header">
          <h3>
            <div style="display:flex;align-items:center;gap:8px;">
              AUTO DRAGGER PRO
              <span class="version-badge">${VERSION}</span>
              <span class="theme-badge">${activeThemePreset.toUpperCase()}</span>
            </div>
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text-inline" id="status-text-inline">STOPPED</span>
            </div>
          </h3>
          <div class="header-controls">
            <button class="theme-btn" id="theme-cycle-btn" title="Cycle Theme (Alt+T)">◐</button>
            <button class="minimize-btn" id="minimize-btn">[−]</button>
          </div>
        </div>
        
        <div class="panel-content">
          <div class="tabs">
            <div class="tab active" data-tab="main">[MAIN]</div>
            <div class="tab" data-tab="quests">[QUESTS]</div>
            <div class="tab" data-tab="settings">[CONFIG]</div>
          </div>

          <div class="tab-content active" data-tab-content="main">
            <div class="data-grid">
              <div class="data-box">
                <div class="data-box-header">STATUS</div>
                <div class="data-box-value" id="status-text" style="font-size:14px;">STOPPED</div>
              </div>
              <div class="data-box">
                <div class="data-box-header">TOTAL DRAGS</div>
                <div class="data-box-value" id="drag-count">0</div>
              </div>
              <div class="data-box">
                <div class="data-box-header">DISCOVERIES</div>
                <div class="data-box-value" id="discovery-count">0</div>
              </div>
              <div class="data-box">
                <div class="data-box-header">RUNTIME</div>
                <div class="data-box-value" style="font-size:16px;" id="elapsed-time">00:00:00</div>
              </div>
            </div>

            <div class="auto-speed-indicator" data-auto-speed-display style="display:none;">
              <div class="auto-speed-value" id="auto-speed-display">1.5x</div>
              <div class="auto-speed-label">Auto Speed Mode</div>
            </div>

            <div class="section" data-speed-section style="display:none;">
              <div class="section-title">Speed Control</div>
              <div class="speed-buttons">
                <button class="speed-btn" data-speed="0.5">0.5x</button>
                <button class="speed-btn active" data-speed="1">1.0x</button>
                <button class="speed-btn" data-speed="2">2.0x</button>
                <button class="speed-btn" data-speed="3">3.0x</button>
                <button class="speed-btn" data-speed="5">5.0x</button>
              </div>
            </div>

            <div class="controls">
              <button id="start-btn">[START]</button>
              <button id="stop-btn" disabled>[STOP]</button>
            </div>

            <div class="discoveries">
              <div style="font-size:11px;font-weight:700;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;text-transform:uppercase;letter-spacing:1px;">
                <span>Recent Discoveries</span>
                <span style="font-size:10px;opacity:0.8;font-weight:700;" id="discovery-count-header">0</span>
              </div>
              <div id="discovery-list" style="font-size:11px;opacity:0.7;font-style:italic;">No discoveries logged...</div>
            </div>
            
            <div class="export-import-btns">
              <button class="export-btn" id="export-btn">[EXPORT]</button>
              <button class="import-btn" id="import-btn">[IMPORT]</button>
            </div>
          </div>

          <div class="tab-content" data-tab-content="quests">
            <div class="data-box" style="text-align:center;margin-bottom:12px;">
              <div class="data-box-header">Quest Level</div>
              <div class="data-box-value" style="font-size:32px;" id="quest-level">1</div>
              <div style="font-size:11px;color:var(--theme-terminalTextSecondary);margin-top:4px;font-weight:700;" id="quest-points">0 POINTS</div>
            </div>
            <div id="quests-list">Loading quests...</div>
          </div>

          <div class="tab-content" data-tab-content="settings">
            <div class="section">
              <div class="section-title">Theme Presets</div>
              <div class="theme-preset-buttons">
                <button class="option-btn theme-preset-btn ${activeThemePreset === 'hacker' ? 'active' : ''}" data-theme-preset="hacker">HACKER</button>
                <button class="option-btn theme-preset-btn ${activeThemePreset === 'furry' ? 'active' : ''}" data-theme-preset="furry">FURRY</button>
                <button class="option-btn theme-preset-btn ${activeThemePreset === 'synthwave' ? 'active' : ''}" data-theme-preset="synthwave">SYNTH</button>
              </div>
              <div class="option-buttons" style="margin-top:8px;">
                <button class="option-btn ${terminalEffectsEnabled ? 'active' : ''}" id="terminal-effects-toggle">EFFECTS: ${terminalEffectsEnabled ? 'ON' : 'OFF'}</button>
              </div>
            </div>
          
            <div class="section">
              <div class="section-title">Performance Metrics</div>
              <div class="stat-row">
                <span class="stat-label">FPS:</span>
                <span class="stat-value" id="current-fps" style="color:var(--theme-success);">0</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">AVG DRAG:</span>
                <span class="stat-value" id="avg-drag-time">0ms</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">SUCCESS RATE:</span>
                <span class="stat-value" id="drag-success-rate">0%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">FAILED:</span>
                <span class="stat-value" id="failed-drags">0</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Performance Mode</div>
              <div class="option-buttons">
                <button class="option-btn active" data-perf="auto">AUTO</button>
                <button class="option-btn" data-perf="manual">MANUAL</button>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Debug Mode</div>
              <span class="input-label">Visualize Drag Paths</span>
              <div class="option-buttons">
                <button class="option-btn" id="debug-toggle">ENABLE DEBUG</button>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Keyboard Shortcuts</div>
              <div class="option-buttons" style="margin-bottom:10px;">
                <button class="option-btn active" id="shortcuts-toggle">ENABLED</button>
              </div>
              <span class="input-label">Start/Stop (Alt+Key)</span>
              <input type="text" id="shortcut-startstop" maxlength="1" value="s" placeholder="s">
              <span class="input-label">Minimize (Alt+Key)</span>
              <input type="text" id="shortcut-minimize" maxlength="1" value="m" placeholder="m">
              <span class="input-label">Export (Alt+Key)</span>
              <input type="text" id="shortcut-export" maxlength="1" value="e" placeholder="e">
              <span class="input-label">Cycle Theme (Alt+Key)</span>
              <input type="text" id="shortcut-theme" maxlength="1" value="t" placeholder="t">
              <button class="small-btn" id="save-shortcuts-btn" style="width:100%;background:transparent;color:var(--theme-success);border:2px solid var(--theme-success);margin-top:8px;">[SAVE]</button>
              <div style="font-size:9px;color:var(--theme-terminalTextSecondary);margin-top:8px;padding:8px;background:var(--theme-surface);border-radius:4px;border:1px solid var(--theme-border);">
                <div style="font-weight:700;margin-bottom:4px;">ACTIVE BINDINGS:</div>
                <div>ALT+<span id="current-startstop">S</span> = START/STOP</div>
                <div>ALT+<span id="current-minimize">M</span> = MINIMIZE</div>
                <div>ALT+<span id="current-export">E</span> = EXPORT</div>
                <div>ALT+<span id="current-theme">T</span> = THEME</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Notifications</div>
              <div class="option-buttons">
                <button class="option-btn active" id="sound-toggle">SOUND: ON</button>
                <button class="option-btn active" id="celebration-toggle">EFFECTS: ON</button>
              </div>
            </div>
            
            <div class="creator-badge">${CREATOR}</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    applyTheme();

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`[data-tab-content="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    document.getElementById('minimize-btn').addEventListener('click', toggleMinimize);
    document.getElementById('theme-cycle-btn').addEventListener('click', cycleTheme);

    // Theme preset buttons
    document.querySelectorAll('[data-theme-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        setThemePreset(btn.dataset.themePreset);
      });
    });

    document.getElementById('terminal-effects-toggle').addEventListener('click', () => {
      terminalEffectsEnabled = !terminalEffectsEnabled;
      localStorage.setItem('infinecraft_terminal_effects', terminalEffectsEnabled);
      applyTheme();
      const btn = document.getElementById('terminal-effects-toggle');
      btn.classList.toggle('active', terminalEffectsEnabled);
      btn.textContent = terminalEffectsEnabled ? 'EFFECTS: ON' : 'EFFECTS: OFF';
    });

    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (performanceMode !== 'manual') return;
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        speedMultiplier = parseFloat(btn.dataset.speed);
        showToast(`Speed: ${speedMultiplier}x`, 'info');
      });
    });

    document.getElementById('start-btn').addEventListener('click', startAutoDragger);
    document.getElementById('stop-btn').addEventListener('click', stopAutoDragger);

    // Performance mode
    document.querySelectorAll('[data-perf]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-perf]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setPerformanceMode(btn.dataset.perf);
        showToast(`Mode: ${btn.dataset.perf}`, 'info');
      });
    });

    document.getElementById('debug-toggle').addEventListener('click', toggleDebugMode);

    document.getElementById('shortcuts-toggle').addEventListener('click', (e) => {
      keyboardShortcutsEnabled = !keyboardShortcutsEnabled;
      e.target.classList.toggle('active', keyboardShortcutsEnabled);
      e.target.textContent = keyboardShortcutsEnabled ? 'ENABLED' : 'DISABLED';
      localStorage.setItem('infinecraft_shortcuts', JSON.stringify({
        enabled: keyboardShortcutsEnabled, startStop: shortcutStartStop, minimize: shortcutMinimize, export: shortcutExport, theme: shortcutTheme
      }));
      showToast(keyboardShortcutsEnabled ? 'Shortcuts ON' : 'Shortcuts OFF', 'info');
    });

    document.getElementById('save-shortcuts-btn').addEventListener('click', () => {
      updateKeyboardShortcuts();
      document.getElementById('current-startstop').textContent = shortcutStartStop.toUpperCase();
      document.getElementById('current-minimize').textContent = shortcutMinimize.toUpperCase();
      document.getElementById('current-export').textContent = shortcutExport.toUpperCase();
      document.getElementById('current-theme').textContent = shortcutTheme.toUpperCase();
    });

    document.getElementById('sound-toggle').addEventListener('click', (e) => {
      soundEnabled = !soundEnabled;
      e.target.classList.toggle('active', soundEnabled);
      e.target.textContent = soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
      showToast(soundEnabled ? 'Sound ON' : 'Sound OFF', 'info');
    });

    document.getElementById('celebration-toggle').addEventListener('click', (e) => {
      celebrationEnabled = !celebrationEnabled;
      e.target.classList.toggle('active', celebrationEnabled);
      e.target.textContent = celebrationEnabled ? 'EFFECTS: ON' : 'EFFECTS: OFF';
      showToast(celebrationEnabled ? 'Effects ON' : 'Effects OFF', 'info');
    });

    document.getElementById('export-btn').addEventListener('click', exportDiscoveries);
    document.getElementById('import-btn').addEventListener('click', importDiscoveries);

    setupPanelDragging();
    setTimeout(() => {
      setPerformanceMode('auto');
      const ss = document.getElementById('shortcut-startstop');
      const sm = document.getElementById('shortcut-minimize');
      const se = document.getElementById('shortcut-export');
      const st = document.getElementById('shortcut-theme');
      const cs = document.getElementById('current-startstop');
      const cm = document.getElementById('current-minimize');
      const ce = document.getElementById('current-export');
      const ct = document.getElementById('current-theme');
      const sht = document.getElementById('shortcuts-toggle');
      if (ss) ss.value = shortcutStartStop;
      if (sm) sm.value = shortcutMinimize;
      if (se) se.value = shortcutExport;
      if (st) st.value = shortcutTheme;
      if (cs) cs.textContent = shortcutStartStop.toUpperCase();
      if (cm) cm.textContent = shortcutMinimize.toUpperCase();
      if (ce) ce.textContent = shortcutExport.toUpperCase();
      if (ct) ct.textContent = shortcutTheme.toUpperCase();
      if (sht) {
        sht.classList.toggle('active', keyboardShortcutsEnabled);
        sht.textContent = keyboardShortcutsEnabled ? 'ENABLED' : 'DISABLED';
      }
      applyTheme();
    }, 100);
  }

  // (Continue with all other functions from the second script - updateUI, exportDiscoveries, importDiscoveries, etc.)
  
  function updateUI() {
    const statusDot = document.querySelector('.status-dot');
    const statusTextInline = document.getElementById('status-text-inline');
    const statusText = document.getElementById('status-text');
    const dragCountEl = document.getElementById('drag-count');
    const discoveryCount = document.getElementById('discovery-count');
    const discoveryCountHeader = document.getElementById('discovery-count-header');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const questLevelEl = document.getElementById('quest-level');
    const questPointsEl = document.getElementById('quest-points');

    if (statusDot) statusDot.classList.toggle('active', isRunning);
    if (statusTextInline) statusTextInline.textContent = isRunning ? 'RUNNING' : 'STOPPED';
    if (statusText) statusText.textContent = isRunning ? 'RUNNING' : 'STOPPED';
    if (dragCountEl) dragCountEl.textContent = dragCount.toLocaleString();
    if (discoveryCount) discoveryCount.textContent = discoveredItems.length.toLocaleString();
    if (discoveryCountHeader) discoveryCountHeader.textContent = discoveredItems.length.toLocaleString();
    if (startBtn) {
      startBtn.disabled = isRunning;
      startBtn.textContent = isRunning ? '[RUNNING]' : '[START]';
    }
    if (stopBtn) stopBtn.disabled = !isRunning;
    if (questLevelEl) questLevelEl.textContent = questLevel;
    if (questPointsEl) questPointsEl.textContent = questPoints.toLocaleString() + ' POINTS';

    if (isRunning) {
      if (pauseAfterDiscoveries > 0 && discoveredItems.length >= pauseAfterDiscoveries) {
        stopAutoDragger();
        showToast(`Paused: ${pauseAfterDiscoveries} discoveries`, 'info');
      }
      if (pauseAfterMinutes > 0 && elapsedTime >= pauseAfterMinutes * 60000) {
        stopAutoDragger();
        showToast(`Paused: ${pauseAfterMinutes} minutes`, 'info');
      }
    }
  }

  function updateTimer() {
    const elapsedEl = document.getElementById('elapsed-time');
    if (elapsedEl) {
      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      elapsedEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  function updateDiscoveryList() {
    const list = document.getElementById('discovery-list');
    if (!list) return;
    if (discoveredItems.length === 0) {
      list.innerHTML = '<div style="font-size:11px;opacity:0.7;font-style:italic;">No discoveries logged...</div>';
    } else {
      list.innerHTML = discoveredItems.slice(-10).reverse().map(item =>
        `<div class="discovery-item">${item}</div>`
      ).join('');
    }
  }

  function exportDiscoveries() {
    const data = {
      version: VERSION,
      exportDate: new Date().toISOString(),
      theme: activeThemePreset,
      discoveries: discoveredItems,
      stats: userStats,
      timeline: discoveryTimeline,
      frequency: elementFrequency
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infinite-craft-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported', 'success');
  }

  function importDiscoveries() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (confirm(`Import ${data.discoveries?.length || 0} discoveries?`)) {
            data.discoveries?.forEach(item => {
              if (!discoveredItems.includes(item)) discoveredItems.push(item);
            });
            updateUI();
            updateDiscoveryList();
            updateQuests();
            showToast('Data imported', 'success');
          }
        } catch (err) {
          showToast('Invalid file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function updatePerformanceMetrics() {
    const el1 = document.getElementById('avg-drag-time');
    const el2 = document.getElementById('drag-success-rate');
    const el3 = document.getElementById('failed-drags');
    if (el1) el1.textContent = Math.round(performanceMetrics.avgDragTime) + 'ms';
    if (el2) {
      const total = performanceMetrics.successfulDrags + performanceMetrics.failedDrags;
      el2.textContent = (total > 0 ? ((performanceMetrics.successfulDrags/total)*100).toFixed(1) : 0) + '%';
    }
    if (el3) el3.textContent = performanceMetrics.failedDrags;
  }

  function measureFPS() {
    let lastTime = performance.now();
    let frames = 0;

    function countFrame() {
      frames++;
      const now = performance.now();

      if (now >= lastTime + 1000) {
        currentFPS = Math.round((frames * 1000) / (now - lastTime));
        frames = 0;
        lastTime = now;

        if (performanceMode === 'auto' && isRunning && !autoSpeedAdjusting) {
          autoAdjustSpeed();
        }

        const fpsEl = document.getElementById('current-fps');
        if (fpsEl) {
          fpsEl.textContent = currentFPS;
          fpsEl.style.color = currentFPS < 30 ? '#ef4444' : currentFPS < 50 ? '#f59e0b' : '#10b981';
        }
      }

      requestAnimationFrame(countFrame);
    }

    countFrame();
  }

  function autoAdjustSpeed() {
    if (performanceMode !== 'auto') return;
    autoSpeedAdjusting = true;
    const settings = performanceSettings.auto;

    if (currentFPS < 30) {
      speedMultiplier = Math.max(settings.minSpeed, speedMultiplier - 0.2);
    } else if (currentFPS > 55 && speedMultiplier < settings.maxSpeed) {
      speedMultiplier = Math.min(settings.maxSpeed, speedMultiplier + 0.1);
    }

    updateAutoSpeedDisplay();
    setTimeout(() => { autoSpeedAdjusting = false; }, 2000);
  }

  function updateAutoSpeedDisplay() {
    const el = document.getElementById('auto-speed-display');
    if (el) el.textContent = `${speedMultiplier.toFixed(1)}x`;
  }

  function setPerformanceMode(mode) {
    if (!performanceSettings[mode]) return;
    performanceMode = mode;

    if (mode === 'manual') {
      speedMultiplier = 1;
      document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.speed) === 1) btn.classList.add('active');
      });
    } else {
      speedMultiplier = performanceSettings[mode].speed;
    }

    updatePerformanceModeUI();
  }

  function updatePerformanceModeUI() {
    const speedSection = document.querySelector('[data-speed-section]');
    const autoSpeedDisplay = document.querySelector('[data-auto-speed-display]');

    if (speedSection) {
      speedSection.style.display = performanceMode === 'manual' ? 'block' : 'none';
    }

    if (autoSpeedDisplay) {
      autoSpeedDisplay.style.display = performanceMode === 'auto' ? 'block' : 'none';
      if (performanceMode === 'auto') updateAutoSpeedDisplay();
    }
  }

  function loadUserStatsLocal() {
    try {
      const saved = localStorage.getItem('infinecraft_stats_' + userId);
      if (saved) userStats = JSON.parse(saved);
    } catch (e) {}
  }

  function saveUserStatsLocal() {
    try {
      localStorage.setItem('infinecraft_stats_' + userId, JSON.stringify(userStats));
    } catch (e) {}
  }

  function updateQuests() {
    quests.forEach(quest => {
      quest.progress = discoveredItems.length;
      if (quest.progress >= quest.target && !quest.completed) {
        quest.completed = true;
        questPoints += quest.points;
        questLevel = Math.floor(questPoints / 100) + 1;
        showQuestComplete(quest);
      }
    });
    saveQuests();
    updateQuestsDisplay();
  }

  function saveQuests() {
    try {
      localStorage.setItem('infinecraft_quests_' + userId, JSON.stringify(quests));
    } catch (e) {}
  }

  function showQuestComplete(quest) {
    const theme = getThemeColors();
    const textColor = activeThemePreset === 'hacker' ? '#000' : '#fff';
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:${theme.success};padding:30px 40px;border-radius:8px;box-shadow:0 0 40px ${theme.success};z-index:10003;color:${textColor};text-align:center;font-family:${theme.font};animation:questPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);border:2px solid ${theme.success};`;
    n.innerHTML = `<h2 style="margin:0 0 10px 0;font-size:24px;font-weight:700;">QUEST COMPLETE ${activeThemePreset === 'furry' ? 'UwU' : '!'}</h2><div style="font-size:20px;margin:10px 0;font-weight:600;">${quest.name}</div><div style="font-size:16px;opacity:0.9;">+${quest.points} POINTS</div>`;
    document.body.appendChild(n);
    const style = document.createElement('style');
    style.textContent = '@keyframes questPop{0%{transform:translate(-50%,-50%) scale(0);opacity:0;}100%{transform:translate(-50%,-50%) scale(1);opacity:1;}}';
    document.head.appendChild(style);
    setTimeout(() => { n.style.animation = 'fadeOut 0.3s ease-out'; setTimeout(() => { n.remove(); style.remove(); }, 300); }, 3000);
    playSuccessSound();
  }

  function updateQuestsDisplay() {
    const el = document.getElementById('quests-list');
    if (!el) return;

    el.innerHTML = quests.map(q => {
      const pct = Math.min(100, (q.progress / q.target) * 100);
      return `<div class="quest-item ${q.completed ? 'completed' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="quest-icon">${q.completed ? '[✓]' : '[ ]'}</div>
            <div style="font-size:13px;font-weight:700;">${q.name}</div>
          </div>
          <div class="quest-points">+${q.points}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="quest-progress-bar">
            <div class="quest-progress-fill" style="width:${pct}%;"></div>
          </div>
          <div class="quest-progress-text">${q.progress}/${q.target}</div>
        </div>
      </div>`;
    }).join('');
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    try {
      successSound.currentTime = 0;
      successSound.play().catch(() => {});
    } catch (e) {}
  }

  function showCelebration() {
    if (!celebrationEnabled) return;
    const theme = getThemeColors();
    const c = document.createElement('div');
    c.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:60px;z-index:10002;animation:celebrate 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;pointer-events:none;';
    c.textContent = activeThemePreset === 'furry' ? '♥' : '★';
    c.style.color = theme.terminalAccent;
    c.style.textShadow = `0 0 20px ${theme.terminalAccent}`;
    document.body.appendChild(c);
    const style = document.createElement('style');
    style.textContent = '@keyframes celebrate{0%{transform:translate(-50%,-50%) scale(0) rotate(0deg);opacity:1;}50%{transform:translate(-50%,-50%) scale(1.3) rotate(180deg);}100%{transform:translate(-50%,-50%) scale(1) translateY(-120px) rotate(360deg);opacity:0;}}';
    document.head.appendChild(style);
    setTimeout(() => { c.remove(); style.remove(); }, 1200);
  }

  function createDebugCanvas() {
    if (debugCanvas) return;
    debugCanvas = document.createElement('canvas');
    debugCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    debugCanvas.width = window.innerWidth;
    debugCanvas.height = window.innerHeight;
    document.body.appendChild(debugCanvas);
  }

  function removeDebugCanvas() {
    if (debugCanvas) { debugCanvas.remove(); debugCanvas = null; }
  }

  function drawDebugPath(start, end, steps) {
    if (!debugMode || !debugCanvas) return;
    const theme = getThemeColors();
    const ctx = debugCanvas.getContext('2d');
    ctx.strokeStyle = theme.terminalAccent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.fillStyle = theme.terminalAccent;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
    ctx.fill();
    if (steps) {
      ctx.fillStyle = theme.terminalAccentDim;
      steps.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill(); });
    }
    setTimeout(() => ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height), 2000);
  }

  function toggleDebugMode() {
    debugMode = !debugMode;
    debugMode ? createDebugCanvas() : removeDebugCanvas();
    document.getElementById('debug-toggle')?.classList.toggle('active', debugMode);
  }

  function monitorDiscoveries() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            let discoveryElement = null;
            if (node.classList && node.classList.contains('instance-discovery')) {
              discoveryElement = node;
            } else if (node.querySelector) {
              discoveryElement = node.querySelector('.instance-discovery');
            }

            if (discoveryElement) {
              const parentInstance = discoveryElement.closest('.instance');
              if (parentInstance && parentInstance.classList.contains('instance-discovery')) {
                const emojiSpan = discoveryElement.querySelector('.instance-emoji');
                const textSpan = discoveryElement.querySelector('.instance-text');

                if (emojiSpan && textSpan) {
                  const emoji = emojiSpan.textContent.trim();
                  const text = textSpan.textContent.trim();
                  const fullItem = `${emoji} ${text}`;

                  if (!discoveredItems.includes(fullItem)) {
                    discoveredItems.push(fullItem);
                    userStats.totalDiscoveries++;
                    userStats.currentStreak++;
                    saveUserStatsLocal();

                    const now = new Date();
                    discoveryTimeline.push({ time: now.toLocaleTimeString(), item: fullItem });

                    const words = text.split(' ');
                    words.forEach(word => {
                      elementFrequency[word] = (elementFrequency[word] || 0) + 1;
                    });

                    console.log(`NEW DISCOVERY: ${fullItem}`);

                    updateQuests();
                    playSuccessSound();
                    showCelebration();
                    showToast(`NEW: ${fullItem}`, 'success');
                    updateUI();
                    updateDiscoveryList();
                  }
                }
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  let mouseBlockerOverlay = null;

  function createMouseBlocker() {
    if (mouseBlockerOverlay) return;
    mouseBlockerOverlay = document.createElement('div');
    mouseBlockerOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;background:transparent;';
    document.body.appendChild(mouseBlockerOverlay);
  }

  function enableMouseBlocker() {
    if (!mouseBlockerOverlay) createMouseBlocker();
    mouseBlockerOverlay.style.pointerEvents = 'auto';
  }

  function disableMouseBlocker() {
    if (mouseBlockerOverlay) mouseBlockerOverlay.style.pointerEvents = 'none';
  }

  function randomDelay(base, variance) {
    const settings = performanceSettings[performanceMode];
    const adjusted = (base / speedMultiplier) * (settings.baseDelay / 60);
    const adjustedVariance = (variance / speedMultiplier) * (settings.baseDelay / 60);
    return adjusted + (Math.random() - 0.5) * adjustedVariance;
  }

  function humanCurve(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  let lastDropPosition = null;
  let itemsOnCanvas = 0;

  function selectSidebarItem() {
    const sidebarItems = Array.from(document.querySelectorAll(".sidebar-inner .item"));
    if (sidebarItems.length === 0) return null;

    let availableItems = sidebarItems.filter(item => {
      const itemText = item.dataset.itemText || item.textContent.trim();
      return !blacklistItems.some(bl => itemText.includes(bl));
    });

    if (availableItems.length === 0) availableItems = sidebarItems;

    if (priorityItems.length > 0) {
      const priorityItem = availableItems.find(item => {
        const itemText = item.dataset.itemText || item.textContent.trim();
        return priorityItems.some(pi => itemText.includes(pi));
      });
      if (priorityItem) return priorityItem;
    }

    return availableItems[Math.floor(Math.random() * availableItems.length)];
  }

  async function dragSidebarItemToCanvas() {
    const dragStartTime = performance.now();

    const item = selectSidebarItem();
    if (!item) {
      performanceMetrics.failedDrags++;
      updatePerformanceMetrics();
      return;
    }

    const settings = performanceSettings[performanceMode];

    const rect = item.getBoundingClientRect();
    const startOffsetX = (Math.random() - 0.5) * rect.width * 0.4;
    const startOffsetY = (Math.random() - 0.5) * rect.height * 0.4;
    const start = {
      x: rect.left + rect.width / 2 + startOffsetX,
      y: rect.top + rect.height / 2 + startOffsetY
    };

    const canvas = document.querySelector(".container.infinite-craft");
    if (!canvas) {
      performanceMetrics.failedDrags++;
      updatePerformanceMetrics();
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    let target;
    if (lastDropPosition && itemsOnCanvas > 0 && Math.random() > 0.05) {
      target = {
        x: lastDropPosition.x + (Math.random() - 0.5) * 15,
        y: lastDropPosition.y + (Math.random() - 0.5) * 15
      };
    } else {
      target = {
        x: canvasRect.left + canvasRect.width / 2 + (Math.random() - 0.5) * 100,
        y: canvasRect.top + canvasRect.height / 2 + (Math.random() - 0.5) * 100
      };
    }

    lastDropPosition = target;
    itemsOnCanvas++;

    function fireMouseEvent(type, coords, targetEl) {
      const evt = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: coords.x,
        clientY: coords.y,
        view: window,
        buttons: type === 'mousemove' ? 1 : 0
      });
      targetEl.dispatchEvent(evt);
    }

    async function humanLikeDrag(start, target) {
      const steps = settings.dragSteps;
      const pathSteps = [];

      await new Promise(r => setTimeout(r, randomDelay(60, 40)));
      fireMouseEvent("mousedown", start, item);
      await new Promise(r => setTimeout(r, randomDelay(30, 20)));

      const midpointOffset = {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60
      };

      for (let i = 1; i <= steps; i++) {
        if (!isRunning) break;

        const t = i / steps;
        const eased = humanCurve(t);
        const arcInfluence = Math.sin(t * Math.PI) * 0.3;
        const x = start.x + (target.x - start.x) * eased + midpointOffset.x * arcInfluence;
        const y = start.y + (target.y - start.y) * eased + midpointOffset.y * arcInfluence;
        const jitterX = (Math.random() - 0.5) * 2;
        const jitterY = (Math.random() - 0.5) * 2;
        const finalX = x + jitterX;
        const finalY = y + jitterY;

        if (debugMode) pathSteps.push({ x: finalX, y: finalY });

        const currentElement = document.elementFromPoint(finalX, finalY);
        if (currentElement && currentElement.closest('#auto-dragger-panel')) continue;

        fireMouseEvent("mousemove", { x: finalX, y: finalY }, currentElement || canvas);
        await new Promise(r => setTimeout(r, randomDelay(10, 5)));
      }

      await new Promise(r => setTimeout(r, randomDelay(20, 10)));
      fireMouseEvent("mouseup", target, canvas);

      if (debugMode) drawDebugPath(start, target, pathSteps);

      await new Promise(r => setTimeout(r, 80));
    }

    try {
      await humanLikeDrag(start, target);
      const dragEndTime = performance.now();
      const dragDuration = dragEndTime - dragStartTime;
      performanceMetrics.totalDragTime += dragDuration;
      performanceMetrics.successfulDrags++;
      performanceMetrics.avgDragTime = performanceMetrics.totalDragTime / performanceMetrics.successfulDrags;
      totalAttempts++;
      userStats.totalAttempts++;
      saveUserStatsLocal();
      updatePerformanceMetrics();
    } catch (error) {
      console.error('Drag error:', error);
      performanceMetrics.failedDrags++;
      updatePerformanceMetrics();
    }
  }

  async function autoDragLoop() {
    while (isRunning) {
      try {
        await dragSidebarItemToCanvas();
        dragCount++;
        updateUI();

        if (dragCount % 20 === 0) {
          lastDropPosition = null;
          itemsOnCanvas = 0;

          const clearBtn = document.querySelector(".clear");
          if (clearBtn) {
            const settings = performanceSettings[performanceMode];
            await new Promise(r => setTimeout(r, randomDelay(settings.clearDelay, 400)));
            clearBtn.click();
            await new Promise(r => setTimeout(r, randomDelay(300, 200)));

            const yesBtn = Array.from(document.querySelectorAll("button"))
              .find(b => b.textContent.trim().toLowerCase() === "yes");
            if (yesBtn) {
              yesBtn.click();
            }
            await new Promise(r => setTimeout(r, randomDelay(settings.clearDelay * 1.5, 600)));
          }
        }

        await new Promise(r => setTimeout(r, randomDelay(500, 300)));
      } catch (error) {
        console.error("Error in auto-drag loop:", error);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  function startAutoDragger() {
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now();
    enableMouseBlocker();

    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      userStats.totalTime += 1000;
      saveUserStatsLocal();
      updateTimer();
    }, 1000);

    updateUI();
    showToast('Auto-dragger started', 'success');
    console.log(`Auto-dragger started in ${performanceMode} mode`);
    autoDragLoop();
  }

  function stopAutoDragger() {
    if (!isRunning) return;
    isRunning = false;
    disableMouseBlocker();

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    updateUI();
    showToast('Auto-dragger stopped', 'info');
    console.log("Auto-dragger stopped");
  }

  function loadKeyboardShortcuts() {
    try {
      const saved = localStorage.getItem('infinecraft_shortcuts');
      if (saved) {
        const s = JSON.parse(saved);
        keyboardShortcutsEnabled = s.enabled ?? true;
        shortcutStartStop = s.startStop || 's';
        shortcutMinimize = s.minimize || 'm';
        shortcutExport = s.export || 'e';
        shortcutTheme = s.theme || 't';
      }
    } catch (e) {}
  }

  function updateKeyboardShortcuts() {
    const ss = document.getElementById('shortcut-startstop')?.value;
    const sm = document.getElementById('shortcut-minimize')?.value;
    const se = document.getElementById('shortcut-export')?.value;
    const st = document.getElementById('shortcut-theme')?.value;
    if (ss?.length === 1) shortcutStartStop = ss.toLowerCase();
    if (sm?.length === 1) shortcutMinimize = sm.toLowerCase();
    if (se?.length === 1) shortcutExport = se.toLowerCase();
    if (st?.length === 1) shortcutTheme = st.toLowerCase();
    localStorage.setItem('infinecraft_shortcuts', JSON.stringify({
      enabled: keyboardShortcutsEnabled,
      startStop: shortcutStartStop,
      minimize: shortcutMinimize,
      export: shortcutExport,
      theme: shortcutTheme
    }));
    showToast('Shortcuts saved', 'success');
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!keyboardShortcutsEnabled || e.target.tagName === 'INPUT') return;
      if (e.altKey && e.key.toLowerCase() === shortcutStartStop) {
        e.preventDefault();
        isRunning ? stopAutoDragger() : startAutoDragger();
      }
      if (e.altKey && e.key.toLowerCase() === shortcutMinimize) {
        e.preventDefault();
        toggleMinimize();
      }
      if (e.altKey && e.key.toLowerCase() === shortcutExport) {
        e.preventDefault();
        exportDiscoveries();
      }
      if (e.altKey && e.key.toLowerCase() === shortcutTheme) {
        e.preventDefault();
        cycleTheme();
      }
    });
  }

  // Initialize
  async function initializeScript() {
    if (document.getElementById('auto-dragger-panel')) return;

    // Show theme selector first (only on first run or if not saved)
    const savedTheme = localStorage.getItem('infinecraft_theme_preset');
    if (!savedTheme) {
      await createThemeSelector();
    }

    const loadingScreen = createLoadingScreen();
    await animateLoadingScreen(loadingScreen, 6000);

    loadUserStatsLocal();
    if (!userId) {
      userId = 'user_' + Date.now();
      localStorage.setItem('infinecraft_userid', userId);
    }
    loadKeyboardShortcuts();

    try {
      const savedQuests = localStorage.getItem('infinecraft_quests_' + userId);
      if (savedQuests) {
        const loaded = JSON.parse(savedQuests);
        loaded.forEach((q, i) => {
          if (quests[i]) {
            quests[i].progress = q.progress || 0;
            quests[i].completed = q.completed || false;
          }
        });
        questPoints = quests.filter(q => q.completed).reduce((sum, q) => sum + q.points, 0);
        questLevel = Math.floor(questPoints / 100) + 1;
      }
    } catch (e) {}

    createControlPanel();
    createMouseBlocker();
    updateUI();
    updateDiscoveryList();
    updateQuestsDisplay();
    setupKeyboardShortcuts();
    monitorDiscoveries();
    measureFPS();

    removeLoadingScreen(loadingScreen);

    console.log(`[AUTO DRAGGER PRO ${VERSION}] System initialized`);
    console.log(`[THEME] ${activeThemePreset.toUpperCase()}`);
    console.log(`[PERFORMANCE] Mode: ${performanceMode}`);
    console.log(`[SHORTCUTS] Alt+${shortcutStartStop.toUpperCase()} (Start/Stop), Alt+${shortcutMinimize.toUpperCase()} (Minimize), Alt+${shortcutExport.toUpperCase()} (Export), Alt+${shortcutTheme.toUpperCase()} (Theme)`);
    
    showToast('System ready', 'success');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
  } else {
    initializeScript();
  }
})();
})();