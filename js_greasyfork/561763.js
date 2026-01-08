// ==UserScript==
// @name         SnapScore Automater Pro
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Multi-step auto-snap with clean UI. No overlays, no lag. Drag/upload profiles, emergency stop (X).
// @match        https://www.snapchat.com/web*
// @match        https://web.snapchat.com/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/561763/SnapScore%20Automater%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561763/SnapScore%20Automater%20Pro.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* ---------- CONFIGURATION ---------- */
  const CONFIG = {
    minDelay: 0.02,
    defaultDelay: 0.2,
    screenIgnoreRatio: 0.2,
    toastDuration: 1500
  };

  /* ---------- UI BUILDER ---------- */
  const UI = {
    overlay: null,
    isMinimized: false,

    create() {
      const theme = {
        bg: '#1c1c1e',
        border: '#2c2c2e',
        text: '#ffffff',
        accent: '#0a84ff',
        success: '#30d158',
        warning: '#ff9f0a',
        danger: '#ff453a',
        subtle: '#8e8e93'
      };

      this.overlay = document.createElement('div');
      Object.assign(this.overlay.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '2147483647',
        background: theme.bg,
        color: theme.text,
        padding: '16px',
        borderRadius: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        width: '480px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px ' + theme.border
      });

      this.overlay.innerHTML = `
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:8px;height:8px;border-radius:50%;background:${theme.success}" id="ac-status-dot"></div>
            <strong style="font-size:15px;letter-spacing:0.5px">Snap AutoClick Pro</strong>
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <button id="ac-minimize" title="Minimize" style="background:${theme.border};border:0;color:${theme.text};cursor:pointer;padding:4px 8px;border-radius:6px;font-size:14px">−</button>
            <button id="ac-close" title="Close" style="background:${theme.danger};border:0;color:#fff;cursor:pointer;padding:4px 8px;border-radius:6px;font-size:14px">✕</button>
          </div>
        </div>

        <!-- Step Buttons -->
        <div class="ac-content" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
          ${['cam', 'picture', 'send', 'final'].map(type => `
            <button class="ac-set-btn" data-type="${type}" style="background:${theme.border};color:${theme.text};border:0;padding:10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:500;position:relative">
              <div style="font-size:18px;margin-bottom:4px">${this.getStepIcon(type)}</div>
              <div>${this.getStepName(type)}</div>
              <div class="ac-set-indicator" style="position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:${theme.danger};opacity:0"></div>
            </button>
          `).join('')}
        </div>

        <!-- Controls -->
        <div class="ac-content" style="display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:200px">
            <label style="font-size:12px;color:${theme.subtle};white-space:nowrap">Delay:</label>
            <input id="ac-delay" type="number" value="${CONFIG.defaultDelay}" step="0.1" min="${CONFIG.minDelay}" max="60" style="width:80px;padding:6px;border-radius:6px;border:1px solid ${theme.border};background:${theme.border};color:${theme.text};text-align:center;font-size:12px"/>
            <span style="color:${theme.subtle};font-size:12px">s</span>
            <button id="ac-delay-presets" title="Quick presets" style="background:${theme.border};border:0;color:${theme.text};cursor:pointer;padding:4px 8px;border-radius:6px;font-size:12px">⚡</button>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button id="ac-start" style="background:${theme.success};color:#fff;border:0;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:500;font-size:12px">▶ Start</button>
            <button id="ac-stop" style="background:${theme.danger};color:#fff;border:0;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:500;font-size:12px">■ Stop</button>
            <button id="ac-clear" style="background:${theme.border};color:${theme.text};border:0;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:500;font-size:12px">Clear</button>
          </div>
        </div>

        <!-- Profiles Section -->
        <div class="ac-content" style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-size:12px;color:${theme.subtle};font-weight:500">PROFILES</div>
            <div style="display:flex;gap:4px">
              <button id="ac-upload" style="background:${theme.accent};color:#fff;border:0;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:11px">+ Upload</button>
            </div>
          </div>
          <div id="ac-drop" style="border:2px dashed ${theme.border};min-height:100px;padding:8px;border-radius:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;overflow:auto;max-height:180px;background:${theme.border}22"></div>
          <div id="ac-preview" style="margin-top:8px;font-size:11px;color:${theme.subtle};max-height:60px;overflow:auto"></div>
        </div>

        <!-- Footer Info -->
        <div class="ac-content" style="font-size:10px;color:${theme.subtle};opacity:0.8;line-height:1.4">
          <div>💡 <strong>Tips:</strong> Click "Set" buttons then click page elements. Press <kbd style="background:${theme.border};padding:2px 4px;border-radius:3px;font-family:monospace">X</kbd> to emergency stop.</div>
          <div style="margin-top:4px">📏 Left <strong>${Math.round(CONFIG.screenIgnoreRatio * 100)}%</strong> of screen is ignored during clicks</div>
        </div>

        <!-- Minimized State -->
        <div class="ac-minimized-controls" style="display:none;justify-content:space-between;align-items:center;margin-top:12px">
          <button id="ac-restore" style="background:${theme.accent};color:#fff;border:0;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:12px">Restore Panel</button>
          <div style="color:${theme.subtle};font-size:11px">Snap AutoClick Pro (Minimized)</div>
        </div>

        <!-- Toast -->
        <div id="ac-toast" style="position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);background:${theme.success};color:#fff;padding:8px 16px;border-radius:8px;font-size:12px;opacity:0;pointer-events:none;white-space:nowrap;transition:opacity 0.2s,bottom 0.2s">Action completed</div>
      `;

      document.documentElement.appendChild(this.overlay);
      this.bindEvents();
      this.toast('UI initialized', 'success');
    },

    getStepIcon(type) {
      const icons = { cam: '📷', picture: '🖼️', send: '➡️', final: '✅' };
      return icons[type] || '⚡';
    },

    getStepName(type) {
      const names = { cam: 'Camera', picture: 'Picture', send: 'Send', final: 'Final' };
      return names[type] || type;
    },

    bindEvents() {
      // Minimize
      document.getElementById('ac-minimize').addEventListener('click', () => {
        this.toggleMinimize();
      });

      // Restore button (only visible when minimized)
      document.getElementById('ac-restore').addEventListener('click', () => {
        this.toggleMinimize();
      });

      // Close
      document.getElementById('ac-close').addEventListener('click', () => {
        State.emergency = true;
        State.running = false;
        this.overlay.remove();
      });

      // Delay presets
      document.getElementById('ac-delay-presets').addEventListener('click', (e) => {
        const presets = [0.02, 0.1, 0.2, 0.5, 1.0, 2.0];
        const rect = e.target.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.style.cssText = `
          position: fixed; top: ${rect.bottom + 4}px; left: ${rect.left}px;
          background: #1c1c1e;
          border: 1px solid #2c2c2e;
          border-radius: 8px; padding: 4px; z-index: 2147483648;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        `;
        presets.forEach(p => {
          const item = document.createElement('div');
          item.textContent = `${p}s`;
          item.style.cssText = `
            padding: 6px 12px; cursor: pointer; border-radius: 4px;
            font-size: 12px; color: #fff;
          `;
          item.addEventListener('click', () => {
            document.getElementById('ac-delay').value = p;
            menu.remove();
            this.toast(`Delay set to ${p}s`, 'success');
          });
          menu.appendChild(item);
        });
        document.body.appendChild(menu);
        const closeMenu = (e) => {
          if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
          }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
      });
    },

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      const minimizeBtn = document.getElementById('ac-minimize');
      const content = document.querySelectorAll('.ac-content');
      const minimizedControls = document.querySelector('.ac-minimized-controls');

      if (this.isMinimized) {
        minimizeBtn.textContent = '+';
        content.forEach(el => el.style.display = 'none');
        minimizedControls.style.display = 'flex';
        this.overlay.style.width = '220px';
      } else {
        minimizeBtn.textContent = '−';
        content.forEach(el => el.style.display = '');
        minimizedControls.style.display = 'none';
        this.overlay.style.width = '480px';
      }
    },

    toast(message, type = 'success') {
      const toast = document.getElementById('ac-toast');
      const colors = {
        success: '#30d158',
        warning: '#ff9f0a',
        error: '#ff453a'
      };
      toast.textContent = message;
      toast.style.background = colors[type] || colors.success;
      toast.style.opacity = '1';
      toast.style.bottom = '-50px';
      setTimeout(() => {
        toast.style.opacity = '0';
      }, CONFIG.toastDuration);
    },

    updateStatus(status, isRunning = false) {
      const statusDot = document.getElementById('ac-status-dot');
      const statusText = document.getElementById('ac-status-text');

      if (!statusText) return;

      statusText.textContent = status;
      statusDot.style.background = isRunning ? '#30d158' : '#8e8e93';
    },

    highlightSetButton(type, hasValue) {
      const btn = document.querySelector(`[data-type="${type}"]`);
      if (!btn) return;
      const indicator = btn.querySelector('.ac-set-indicator');
      if (hasValue) {
        btn.style.border = '2px solid #30d158';
        indicator.style.opacity = '1';
        indicator.style.background = '#30d158';
      } else {
        btn.style.border = 'none';
        indicator.style.opacity = '0';
      }
    },

    addProfileCard(profile) {
      const dropEl = document.getElementById('ac-drop');
      const theme = {
        bg: 'rgba(255,255,255,0.03)',
        text: '#ffffff'
      };

      const card = document.createElement('div');
      card.dataset.profileId = profile.id;
      Object.assign(card.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '88px',
        padding: '8px',
        background: theme.bg,
        borderRadius: '8px',
        position: 'relative'
      });

      card.innerHTML = `
        <div style="position:absolute;top:4px;left:4px;width:12px;height:12px;border-radius:50%;background:${profile.enabled ? '#30d158' : '#ff453a'};border:2px solid ${theme.text};cursor:pointer" title="${profile.enabled ? 'Click to disable' : 'Click to enable'}"></div>
        <img src="${profile.src}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid #2c2c2e" onerror="this.style.opacity=0.3"/>
        <div style="font-size:10px;color:${theme.text};width:100%;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${profile.name}">${profile.name}</div>
        <div style="display:flex;gap:4px;width:100%;justify-content:center">
          <button class="ac-profile-test" title="Test click this profile" style="background:#0a84ff;color:#fff;border:0;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:10px">Test</button>
          <button class="ac-profile-remove" title="Remove profile" style="background:#ff453a;color:#fff;border:0;padding:2px 6px;border-radius:4px;cursor:pointer;font-size:10px">×</button>
        </div>
      `;

      // Enable/disable toggle
      card.querySelector('div[title*="Click to"]').addEventListener('click', (e) => {
        e.stopPropagation();
        profile.enabled = !profile.enabled;
        State.updatePreview();
        this.toast(`${profile.name} ${profile.enabled ? 'enabled' : 'disabled'}`, 'warning');
      });

      // Test button
      card.querySelector('.ac-profile-test').addEventListener('click', (e) => {
        e.stopPropagation();
        const match = Utils.findMatchingThumbnail(profile);
        if (match) {
          Utils.clickElement(match);
          this.toast(`Test: ${profile.name}`, 'success');
        } else {
          this.toast(`No match for ${profile.name}`, 'error');
        }
      });

      // Remove button
      card.querySelector('.ac-profile-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        profileList = profileList.filter(p => p.id !== profile.id);
        State.updatePreview();
        renderProfiles();
        this.toast(`Removed ${profile.name}`, 'warning');
      });

      dropEl.appendChild(card);
    },

    renderProfiles() {
      const dropEl = document.getElementById('ac-drop');
      dropEl.innerHTML = '';
      if (profileList.length === 0) {
        dropEl.innerHTML = `<div style="width:100%;text-align:center;color:#8e8e93;padding:20px;font-style:italic">Drag images here or click Upload</div>`;
      } else {
        profileList.forEach(p => this.addProfileCard(p));
      }
    }
  };

  /* ---------- STATE MANAGER ---------- */
  const State = {
    captureMode: null,
    running: false,
    emergency: false,
    setButtons: {
      cam: { sel: null, el: null },
      picture: { sel: null, el: null },
      send: { sel: null, el: null },
      final: { sel: null, el: null }
    },

    updatePreview() {
      const previewEl = document.getElementById('ac-preview');
      if (!previewEl) return;

      const enabledCount = profileList.filter(p => p.enabled).length;
      const totalCount = profileList.length;

      if (totalCount === 0) {
        previewEl.innerHTML = 'No profiles loaded';
      } else if (enabledCount === totalCount) {
        previewEl.innerHTML = `<span style="color:#30d158">${enabledCount} profiles ready</span>`;
      } else {
        previewEl.innerHTML = `<span style="color:#ff9f0a">${enabledCount}/${totalCount} profiles enabled</span>`;
      }
    },

    setRunning(isRunning) {
      this.running = isRunning;
      UI.updateStatus(isRunning ? 'Running' : 'Idle', isRunning);
    }
  };

  /* ---------- UTILITIES ---------- */
  const Utils = {
    buildSelector(el) {
      if (!el || el.nodeType !== 1) return null;
      if (el.id) return `#${CSS.escape(el.id)}`;

      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== 'html') {
        let part = node.tagName.toLowerCase();
        if (node.className && typeof node.className === 'string') {
          const cls = node.className.split(/\s+/).filter(Boolean)[0];
          if (cls) part += `.${CSS.escape(cls)}`;
        }
        const parent = node.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(ch => ch.tagName === node.tagName);
          if (siblings.length > 1) {
            part += `:nth-child(${Array.from(parent.children).indexOf(node) + 1})`;
          }
        }
        parts.unshift(part);
        node = node.parentElement;
        if (parts.length > 8) break;
      }
      return parts.length ? parts.join(' > ') : null;
    },

    safeQuery(sel) {
      try { return sel ? document.querySelector(sel) : null; } catch (e) { return null; }
    },

    inRightArea(rect) {
      return rect.left >= (window.innerWidth * CONFIG.screenIgnoreRatio);
    },

    findSmallestClickableWithin(el) {
      if (!el) return null;
      const candidates = [el].concat(Array.from(el.querySelectorAll('button, a, [role="button"], [onclick], img')));
      let best = null;
      let bestArea = Infinity;

      candidates.forEach(c => {
        try {
          const r = c.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0) return;
          if (!this.inRightArea(r)) return;
          const area = r.width * r.height;
          if (area > 0 && area < bestArea) {
            bestArea = area;
            best = c;
          }
        } catch (e) {}
      });
      return best;
    },

    clickElement(el) {
      if (!el) return false;
      const target = this.findSmallestClickableWithin(el) || el;
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      if (!this.inRightArea(rect)) return false;

      const props = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: Math.round(rect.left + rect.width / 2),
        clientY: Math.round(rect.top + rect.height / 2)
      };

      try {
        target.dispatchEvent(new PointerEvent('pointerdown', props));
        target.dispatchEvent(new PointerEvent('pointerup', props));
        target.dispatchEvent(new MouseEvent('click', props));

        // Simple visual feedback
        const prev = target.style.outline;
        target.style.outline = '2px solid #0a84ff';
        setTimeout(() => {
          target.style.outline = prev;
        }, 100);

        return true;
      } catch (e) {
        UI.toast(`Click failed: ${e.message}`, 'error');
        return false;
      }
    },

    lastSegment(url) {
      try {
        return (new URL(url)).pathname.split('/').filter(Boolean).pop() || url;
      } catch (e) {
        return url.split('/').pop() || url;
      }
    },

    findMatchingThumbnail(profile) {
      const allImgs = Array.from(document.querySelectorAll('img'));
      const candidates = allImgs.filter(img => {
        try {
          const r = img.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0) return false;
          if (!this.inRightArea(r)) return false;
          if (r.width <= 48 && r.height <= 48) return true;
          return false;
        } catch (e) { return false; }
      });

      if (candidates.length === 0) return null;

      let best = null;
      let bestScore = Infinity;

      candidates.forEach(img => {
        try {
          const src = (img.currentSrc || img.src || '').toString();
          const r = img.getBoundingClientRect();
          const area = r.width * r.height;
          let score = 1000;

          if (profile.src && src === profile.src) score = 0;
          else if (profile.src && this.lastSegment(src) && this.lastSegment(profile.src) && this.lastSegment(src) === this.lastSegment(profile.src)) score = 10;

          if (profile.w && profile.h) {
            const w = img.naturalWidth || img.width || r.width;
            const h = img.naturalHeight || img.height || r.height;
            score += Math.abs((w || 0) - profile.w) + Math.abs((h || 0) - profile.h);
          }

          score += area / 100;
          if (profile.type === 'data' && src.startsWith('data:')) score -= 5;
          if (score < bestScore) {
            bestScore = score;
            best = img;
          }
        } catch (e) {}
      });

      return best;
    },

    sleep(ms) {
      return new Promise(res => setTimeout(res, ms));
    },

    getDelayMs() {
      let d = parseFloat(document.getElementById('ac-delay').value);
      if (isNaN(d) || d < CONFIG.minDelay) d = CONFIG.minDelay;
      const ms = Math.round(d * 1000);
      return Math.max(ms, 20);
    }
  };

  /* ---------- CORE LOGIC ---------- */
  async function runSequenceOnce() {
    const delayMs = Utils.getDelayMs();

    // 1. Click main buttons
    for (const k of ['cam', 'picture', 'send']) {
      if (State.emergency) return false;
      const s = State.setButtons[k];
      const el = s && (s.sel ? Utils.safeQuery(s.sel) : s.el) || null;
      if (el) Utils.clickElement(el);
      await Utils.sleep(delayMs);
    }

    // 2. Click profiles
    for (const p of profileList) {
      if (State.emergency) return false;
      if (!p.enabled) continue;
      const match = Utils.findMatchingThumbnail(p);
      if (match) Utils.clickElement(match);
      await Utils.sleep(delayMs);
    }

    // 3. Click final button
    if (State.setButtons.final && (State.setButtons.final.sel || State.setButtons.final.el)) {
      const sf = State.setButtons.final;
      const fe = sf.sel ? Utils.safeQuery(sf.sel) : sf.el;
      if (fe) Utils.clickElement(fe);
      await Utils.sleep(delayMs);
    }

    return true;
  }

  async function startRunner() {
    if (State.running) return;

    const anyBtn = Object.values(State.setButtons).some(s => s && (s.sel || s.el));
    if (!anyBtn && profileList.length === 0) {
      UI.toast('Set buttons or add profiles first', 'warning');
      return;
    }

    State.emergency = false;
    State.setRunning(true);

    while (State.running && !State.emergency) {
      const ok = await runSequenceOnce();
      if (!ok) break;
      await Utils.sleep(2);
    }

    State.setRunning(false);
  }

  function stopRunner() {
    State.emergency = true;
    State.setRunning(false);
    UI.toast('Stopped', 'warning');
  }

  /* ---------- EVENT LISTENERS ---------- */
  function bindEvents() {
    // Set buttons - NO OVERLAY
    document.querySelectorAll('.ac-set-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        State.captureMode = type;
        UI.updateStatus(`Click element for ${UI.getStepName(type)}...`);

        const handler = e => {
          if (e.composedPath && e.composedPath().includes(UI.overlay)) return;
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

          const el = e.target;
          const sel = Utils.buildSelector(el);
          State.setButtons[type] = { sel, el };
          State.captureMode = null;

          document.removeEventListener('click', handler, true);
          UI.highlightSetButton(type, true);
          UI.updateStatus('Ready');
          UI.toast(`${UI.getStepName(type)} set`, 'success');
        };

        document.addEventListener('click', handler, true);
      });
    });

    // Control buttons
    document.getElementById('ac-start').addEventListener('click', startRunner);
    document.getElementById('ac-stop').addEventListener('click', stopRunner);
    document.getElementById('ac-clear').addEventListener('click', () => {
      if (confirm('Clear all settings and profiles?')) {
        Object.keys(State.setButtons).forEach(k => State.setButtons[k] = { sel: null, el: null });
        profileList.length = 0;
        profileIdCounter = 1;
        renderProfiles();
        State.updatePreview();
        UI.updateStatus('Ready');
        UI.toast('Cleared all data', 'warning');
      }
    });

    // Profile upload
    document.getElementById('ac-upload').addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.multiple = true;
      inp.onchange = () => {
        Array.from(inp.files || []).forEach(file => {
          if (!file.type.startsWith('image/')) {
            UI.toast('Only images are supported', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = ev => {
            const src = ev.target.result;
            const id = profileIdCounter++;
            const profile = { id, type: 'data', src, name: file.name, enabled: true };
            const img = new Image();
            img.onload = () => {
              profile.w = img.naturalWidth;
              profile.h = img.naturalHeight;
              profileList.push(profile);
              renderProfiles();
              State.updatePreview();
              UI.toast(`Added ${profile.name}`, 'success');
            };
            img.src = src;
          };
          reader.readAsDataURL(file);
        });
      };
      inp.click();
    });

    // Drag and drop
    const dropEl = document.getElementById('ac-drop');
    dropEl.addEventListener('dragover', e => {
      e.preventDefault();
      dropEl.style.borderColor = '#0a84ff';
      dropEl.style.background = 'rgba(10, 132, 255, 0.1)';
    });

    dropEl.addEventListener('dragleave', e => {
      dropEl.style.borderColor = '#2c2c2e';
      dropEl.style.background = 'rgba(255,255,255,0.03)';
    });

    dropEl.addEventListener('drop', e => {
      e.preventDefault();
      dropEl.style.borderColor = '#2c2c2e';
      dropEl.style.background = 'rgba(255,255,255,0.03)';

      // Handle files
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach(file => {
          if (!file.type.startsWith('image/')) {
            UI.toast('Only images are supported', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = ev => {
            const src = ev.target.result;
            const id = profileIdCounter++;
            const profile = { id, type: 'data', src, name: file.name, enabled: true };
            const img = new Image();
            img.onload = () => {
              profile.w = img.naturalWidth;
              profile.h = img.naturalHeight;
              profileList.push(profile);
              renderProfiles();
              State.updatePreview();
              UI.toast(`Added ${profile.name}`, 'success');
            };
            img.src = src;
          };
          reader.readAsDataURL(file);
        });
      }

      // Handle URLs
      const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
      if (url) {
        const first = url.split('\n')[0].trim();
        if (first) {
          const id = profileIdCounter++;
          const profile = { id, type: 'url', src: first, name: first.split('/').pop() || 'dragged-image', enabled: true };
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            profile.w = img.naturalWidth;
            profile.h = img.naturalHeight;
            profileList.push(profile);
            renderProfiles();
            State.updatePreview();
            UI.toast(`Added ${profile.name}`, 'success');
          };
          img.onerror = () => {
            profileList.push(profile);
            renderProfiles();
            State.updatePreview();
            UI.toast(`Added ${profile.name} (may not load)`, 'warning');
          };
          img.src = first;
        }
      }
    });

    // Emergency stop (X key)
    document.addEventListener('keydown', e => {
      if (e.key && e.key.toLowerCase() === 'x') {
        stopRunner();
      }
    });

    // Highlight existing set buttons on load
    Object.keys(State.setButtons).forEach(k => {
      UI.highlightSetButton(k, State.setButtons[k].sel || State.setButtons[k].el);
    });
  }

  /* ---------- PROFILE RENDERING ---------- */
  function renderProfiles() {
    UI.renderProfiles();
  }

  /* ---------- INITIALIZATION ---------- */
  const profileList = [];
  let profileIdCounter = 1;

  // Initialize UI
  UI.create();
  bindEvents();
  renderProfiles();
  State.updatePreview();
  UI.updateStatus('Ready');
  UI.toast('Snap AutoClick Pro ready', 'success');

  // Expose debug interface
  window.__SnapAutoClick = {
    startRunner,
    stopRunner,
    getState: () => ({ ...State, profileList, setButtons: State.setButtons }),
    getConfig: () => ({ ...CONFIG }),
    testClick: Utils.clickElement,
    findMatch: Utils.findMatchingThumbnail
  };

})();