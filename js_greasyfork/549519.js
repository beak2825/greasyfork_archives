// ==UserScript==
// @name         Visited Links Enhanced - Size Optimized
// @namespace    com.userscript.visited-links-enhanced
// @version      0.6.9
// @description  Size-optimized userscript for visited links. Reduced file size with full functionality.
// @author       Enhanced by AI Assistant ft. Hongmd
// @license      MIT
// @homepageURL  https://github.com/hongmd/userscript-improved
// @supportURL   https://github.com/hongmd/userscript-improved/issues
// @match        http://*/*
// @match        https://*/*
// @noframes
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @copyright    2025, Enhanced by AI Assistant ft. Hongmd
// @downloadURL https://update.greasyfork.org/scripts/549519/Visited%20Links%20Enhanced%20-%20Size%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/549519/Visited%20Links%20Enhanced%20-%20Size%20Optimized.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const MEM_OPT = {
    REGEX: {
      COLOR_HEX: /^#([0-9a-f]{3}){1,2}$/i,
      COLOR_RGB: /^rgb\(\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*\)$/i,
      COLOR_RGBA: /^rgba\(\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\s*,\s*(?:1(?:\.0*)?|0(?:\.\d*)?)\s*\)$/i,
      COLOR_NAMED: /^(red|blue|green|yellow|black|white|gray|orange|purple|pink|brown)$/i,
      URL_DOMAIN: /^https?:\/\/([^\/\?#]+)/i,
    },
    COLORS: [
      ["#93c5fd", "Pastel Blue"], ["#fca5a5", "Pastel Red"], ["#86efac", "Pastel Green"], ["#fed7aa", "Pastel Orange"],
      ["#f97316", "Vibrant Orange"], ["#c4b5fd", "Pastel Purple"], ["#f9a8d4", "Pastel Pink"], ["#7dd3fc", "Pastel Sky Blue"],
      ["#bef264", "Pastel Lime"], ["#fde047", "Pastel Yellow"], ["#fb7185", "Pastel Rose"], ["#a78bfa", "Pastel Violet"],
      ["#34d399", "Pastel Emerald"], ["#dc2626", "Bold Red"], ["#2563eb", "Bold Blue"], ["#059669", "Bold Green"],
      ["#7c3aed", "Bold Purple"], ["#db2777", "Bold Pink"], ["#ea580c", "Bold Orange"], ["#0891b2", "Bold Cyan"],
      ["#65a30d", "Bold Lime"], ["#ca8a04", "Bold Yellow"], ["#be123c", "Bold Rose"], ["#000000", "Black"],
      ["#ffffff", "White"], ["#6b7280", "Gray"], ["#ef4444", "Pure Red"], ["#3b82f6", "Pure Blue"],
      ["#10b981", "Pure Green"], ["#8b5cf6", "Pure Purple"], ["#f59e0b", "Pure Orange"], ["#eab308", "Pure Yellow"]
    ],
    CFG: {
      KEYS: { C: "visited_color", N: "script_enabled" },
      DEF: { C: "#f97316", N: true },
      ID: "visited-lite-enhanced-style",
      CSS: "a:visited,a:visited *{color:%C%!important}",
    }
  };

  

  const U = {
    V: (c) => {
      if (!c || typeof c !== 'string') return false;
      const t = c.trim();
      if (t.length < 3) return false;
      return MEM_OPT.REGEX.COLOR_HEX.test(t) ||
        MEM_OPT.REGEX.COLOR_RGB.test(t) ||
        MEM_OPT.REGEX.COLOR_RGBA.test(t) ||
        MEM_OPT.REGEX.COLOR_NAMED.test(t);
    },
    G: (u) => {
      try {
        return new URL(u).hostname;
      } catch {
        const m = u.match(MEM_OPT.REGEX.URL_DOMAIN);
        return m ? m[1] : "";
      }
    }
  };

  const CM = {
    _c: new Map(),
    _p: "visited_links_enhanced_",
    G: function (k) {
      if (this._c.has(k)) return this._c.get(k);
      const sk = MEM_OPT.CFG.KEYS[k];
      const dv = MEM_OPT.CFG.DEF[k];
      let v = dv;
      try {
        if (typeof GM_getValue !== 'undefined') {
          v = GM_getValue(sk, dv);
        } else {
          const s = localStorage.getItem(this._p + sk);
          v = s ? JSON.parse(s) : dv;
        }
      } catch (e) {
        try {
          const s = localStorage.getItem(this._p + sk);
          v = s ? JSON.parse(s) : dv;
        } catch { }
      }
      this._c.set(k, v);
      return v;
    },
    S: function (k, v) {
      this._c.set(k, v);
      const sk = MEM_OPT.CFG.KEYS[k];
      try {
        if (typeof GM_setValue !== 'undefined') {
          GM_setValue(sk, v);
          return true;
        }
      } catch (e) {
      }
      try {
        localStorage.setItem(this._p + sk, JSON.stringify(v));
        return true;
      } catch { }
      return false;
    },
    // removed CM.I (unused) and CM.C (no external cache)
  };

  const SM = {
    _e: null,
    _l: "",
    I: function () { this.E(); },
    E: function () {
      const e = document.getElementById(MEM_OPT.CFG.ID);
      if (e) e.remove();

      this._e = Object.assign(document.createElement("style"), {
        id: MEM_OPT.CFG.ID,
        type: "text/css"
      });

      

      (document.head ?? document.documentElement)?.appendChild?.(this._e);
      return this._e;
    },
    U: function () {
      const c = CM.G("C");
      if (!U.V(c)) return;
      const css = MEM_OPT.CFG.CSS.replace("%C%", c);
      if (this._l === css) return;
      if (!this._e?.isConnected) this.E();
      const animations = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      `;
      this._e.textContent = animations + "\n" + css;
      this._l = css;
    },
    R: function () {
      if (this._e && this._l) {
        this._e.textContent = "";
        this._l = "";
      }
    }
  };

  const MM = {
    _co: null,
    I: function () {
      if (typeof GM_registerMenuCommand === 'undefined') return;
      try {
        GM_registerMenuCommand("🎨 Choose Color", this.CC.bind(this));
        GM_registerMenuCommand("⚙️ Toggle Script", this.TS.bind(this));
      } catch { }
    },
    TS: function () {
      const ns = !CM.G("N");
      CM.S("N", ns);
      ns ? SM.U() : SM.R();
      const msg = `Visited Links Enhanced: ${ns ? 'Enabled' : 'Disabled'}`;
      this.showNotification(msg);
    },
    
    CC: function () {
      // Create visual color picker interface
      const colorGrid = this.createColorGrid();
      const modal = this.createColorModal(colorGrid);

      // Display modal
      document.body.appendChild(modal);

      // Focus on modal
      modal.style.display = 'flex';
      modal.focus();
    },

    createColorGrid: function () {
      const container = document.createElement('div');
      container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
        gap: 12px;
        max-width: 650px;
        margin: 25px auto;
        padding: 0 10px;
      `;

      MEM_OPT.COLORS.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.style.cssText = `
          width: 75px;
          height: 75px;
          background-color: ${color[0]};
          border: 3px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: ${this.getContrastColor(color[0])};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        // Hover effects
        colorBox.onmouseover = () => {
          colorBox.style.transform = 'scale(1.08) rotate(2deg)';
          colorBox.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
          colorBox.style.borderColor = '#007bff';
          colorBox.style.zIndex = '10';
        };
        colorBox.onmouseout = () => {
          colorBox.style.transform = 'scale(1) rotate(0deg)';
          colorBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          colorBox.style.borderColor = '#e0e0e0';
          colorBox.style.zIndex = '1';
        };

        // Click handler
        colorBox.onclick = () => {
          CM.S("C", color[0]);
          SM.U();
          this.showNotification(`Selected: ${color[1]} (${color[0]})`);
          const modal = document.querySelector('.color-modal');
          if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        };

        // Tooltip
        colorBox.title = `${color[1]} - Click to select`;

        container.appendChild(colorBox);
      });

      return container;
    },

    createColorModal: function (colorGrid) {
      const modal = document.createElement('div');
      modal.className = 'color-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        display: none;
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 700px;
        max-height: 85vh;
        overflow-y: auto;
        position: relative;
        border: 1px solid rgba(255,255,255,0.2);
      `;

      const title = document.createElement('h3');
      title.textContent = '🎨 Choose Color for Visited Links';
      title.style.cssText = `
        margin: 0 0 25px 0;
        color: #2c3e50;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      `;

      // Default color button
      const defaultWrap = document.createElement('div');
      defaultWrap.style.cssText = `
        display: flex; justify-content: center; margin: 0 0 15px 0;
      `;
      const defaultBtn = document.createElement('button');
      defaultBtn.textContent = 'Use Default Color';
      defaultBtn.style.cssText = `
        padding: 10px 16px;
        background: #f1f3f5;
        color: #212529;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
      `;
      defaultBtn.onclick = () => {
        CM.S("C", MEM_OPT.CFG.DEF.C);
        SM.U();
        this.showNotification(`Default color applied: ${MEM_OPT.CFG.DEF.C}`);
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      };
      defaultWrap.appendChild(defaultBtn);

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        line-height: 1;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(238, 90, 82, 0.3);
      `;
      closeBtn.onmouseover = () => {
        closeBtn.style.transform = 'scale(1.1)';
        closeBtn.style.boxShadow = '0 6px 20px rgba(238, 90, 82, 0.4)';
      };
      closeBtn.onmouseout = () => {
        closeBtn.style.transform = 'scale(1)';
        closeBtn.style.boxShadow = '0 4px 12px rgba(238, 90, 82, 0.3)';
      };
      closeBtn.onclick = () => {
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      };

      const customColorDiv = document.createElement('div');
      customColorDiv.style.cssText = `
        margin-top: 25px;
        padding-top: 20px;
        border-top: 2px solid #e9ecef;
        text-align: center;
        background: rgba(248, 249, 250, 0.5);
        border-radius: 12px;
        padding: 20px;
      `;

      const customLabel = document.createElement('div');
      customLabel.textContent = 'Or enter a custom color code:';
      customLabel.style.cssText = `
        margin-bottom: 15px;
        color: #495057;
        font-size: 16px;
        font-weight: 500;
      `;

      const inputContainer = document.createElement('div');
      inputContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      `;

      const customInput = document.createElement('input');
      customInput.type = 'text';
      customInput.placeholder = '#ff0000 or red';
      customInput.style.cssText = `
        padding: 12px 16px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        width: 220px;
        font-size: 16px;
        transition: all 0.3s ease;
        outline: none;
      `;
      customInput.onfocus = () => {
        customInput.style.borderColor = '#007bff';
        customInput.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
      };
      customInput.onblur = () => {
        customInput.style.borderColor = '#dee2e6';
        customInput.style.boxShadow = 'none';
      };

      const customBtn = document.createElement('button');
      customBtn.textContent = 'Apply';
      customBtn.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      `;
      customBtn.onmouseover = () => {
        customBtn.style.transform = 'translateY(-2px)';
        customBtn.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
      };
      customBtn.onmouseout = () => {
        customBtn.style.transform = 'translateY(0)';
        customBtn.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
      };
      customBtn.onclick = () => {
        const customColor = customInput.value.trim();
        if (customColor && U.V(customColor)) {
          CM.S("C", customColor);
          SM.U();
          this.showNotification(`Custom color applied: ${customColor}`);
          if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        } else {
          this.showError('Invalid color code! Please try again.');
        }
      };

      inputContainer.appendChild(customInput);
      inputContainer.appendChild(customBtn);

      customColorDiv.appendChild(customLabel);
      customColorDiv.appendChild(inputContainer);

      content.appendChild(closeBtn);
      content.appendChild(title);
      content.appendChild(defaultWrap);
      content.appendChild(colorGrid);
      content.appendChild(customColorDiv);

      modal.appendChild(content);

      // Enhanced close handlers
      modal.onclick = (e) => {
        if (e.target === modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      };

      modal.onkeydown = (e) => {
        if (e.key === 'Escape' && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      };

      return modal;
    },

    getContrastColor: function (hexColor) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#ffffff';
    },

    showNotification: function (message) {
      const notification = document.createElement('div');
      notification.textContent = '✅ ' + message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    },

    showError: function (message) {
      const error = document.createElement('div');
      error.textContent = '❌ ' + message;
      error.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
      `;

      document.body.appendChild(error);

      setTimeout(() => {
        error.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (error.parentNode) {
            error.parentNode.removeChild(error);
          }
        }, 300);
      }, 3000);
    }
  };

  const A = {
    I: function () {
      SM.I();
      MM.I();
      this.CAS();
    },
    CAS: function () {
      const e = CM.G("N");
      if (e) {
        SM.U();
      } else {
        SM.R();
      }
    },
    
  };

  function I() {
    if (document.documentElement) {
      A.I();
    } else {
      setTimeout(I, 50);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", I);
  } else {
    I();
  }

  

})();
