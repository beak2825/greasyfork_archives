// ==UserScript==
// @name         页面灰度调节器
// @name:zh-CN   页面灰度调节器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  点击屏幕左侧按钮中部按钮，可展开灰度调节面板
// @description:zh-CN  点击屏幕左侧按钮中部按钮，可展开灰度调节面板
// @author       yonlin zhu
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549792/%E9%A1%B5%E9%9D%A2%E7%81%B0%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549792/%E9%A1%B5%E9%9D%A2%E7%81%B0%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    const KEY_PREFIX = '__tm_grayscale_level__:';
    const CONTROL_ID = 'tm-gray-control';

    if (document.getElementById(CONTROL_ID)) return;

    const host = location.hostname;
    const baseDomain = getBaseDomain(host);
    const STORAGE_KEY = KEY_PREFIX + baseDomain;

    const stored = localStorage.getItem(STORAGE_KEY);
    let grayLevel = stored !== null ? clamp(parseInt(stored, 10), 0, 100) : 0;
    applyGrayscale(grayLevel);

    const root = document.createElement('div');
    root.id = CONTROL_ID;
    root.innerHTML = `
      <div class="tg-panel">
        <div class="tg-btn" title="点击调节灰度">
          <span class="tg-btn-text">灰</span>
        </div>
        <div class="tg-slider-wrap" style="display:none;">
          <div class="tg-row">
            <input type="range" min="0" max="100" value="${grayLevel}" class="tg-range"/>
            <span class="tg-val">${grayLevel}%</span>
          </div>
          <div class="tg-tip">主域: ${baseDomain}<br/>离开 1 秒收起</div>
        </div>
      </div>
    `;
    document.documentElement.appendChild(root);

    const style = document.createElement('style');
    style.textContent = `
#${CONTROL_ID} {
  position: fixed;
  top: 40%;
  left: 0;
  z-index: 2147483647;
  font-family: system-ui, sans-serif;
  pointer-events: none;
}
#${CONTROL_ID} * { box-sizing: border-box; }

#${CONTROL_ID} .tg-panel {
  position: relative;
  width: 280px;
  height: 78px;
  pointer-events: auto;
}
#${CONTROL_ID} .tg-panel:not(.expanded) {
  width: 56px;
  height: 56px;
  transform: translateX(-28px);
  transition: transform .25s ease;
}
#${CONTROL_ID} .tg-panel.peek:not(.expanded) {
  transform: translateX(0);
}
#${CONTROL_ID} .tg-panel.expanded {
  transform: translateX(8px);
  width: 260px;
  height: 78px;
  transition: transform .25s ease;
}

#${CONTROL_ID} .tg-btn {
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: transparent;
}
#${CONTROL_ID} .tg-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffffdd, #d0d0d0);
  box-shadow: 0 2px 6px rgba(0,0,0,.28);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
#${CONTROL_ID} .tg-btn-text {
  position: relative;
  width: 100%; height: 100%;
  display:flex;align-items:center;justify-content:center;
  font-size: 12px; font-weight: 600; color:#333; letter-spacing:2px;
  pointer-events:none; text-shadow:0 1px 2px #fff;
}

#${CONTROL_ID} .tg-panel.expanded .tg-btn { display:none; }

#${CONTROL_ID} .tg-slider-wrap {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.9);
  border-radius: 14px;
  padding: 10px 14px 8px 66px;
  box-shadow: 0 4px 14px rgba(0,0,0,.25);
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: fadeIn .18s ease;
}

#${CONTROL_ID} .tg-row {
  display:flex;
  align-items:center;
  gap:8px;
}
#${CONTROL_ID} .tg-range {
  -webkit-appearance: none;
  appearance: none;
  width: 160px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg,#666,#bbb);
  outline: none;
  cursor: pointer;
}
#${CONTROL_ID} .tg-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width:16px; height:16px;
  border-radius:50%;
  background:#fff;
  border:2px solid #444;
  box-shadow:0 0 0 2px #ffffff99;
  cursor:pointer;
  transition: transform .15s;
}
#${CONTROL_ID} .tg-range:active::-webkit-slider-thumb { transform: scale(1.1); }

#${CONTROL_ID} .tg-val {
  min-width: 52px;
  font-size:13px;
  font-weight:600;
  text-align:right;
  color:#222;
}

#${CONTROL_ID} .tg-tip {
  font-size:10px;
  line-height:1.2;
  color:#555;
  text-align:right;
  padding-right:2px;
  word-break: break-all;
}

@keyframes fadeIn {
  from { opacity:0; transform:translateY(4px);}
  to   { opacity:1; transform:translateY(0);}
}
`;
    document.head.appendChild(style);

    const panel      = root.querySelector('.tg-panel');
    const btn        = root.querySelector('.tg-btn');
    const sliderWrap = root.querySelector('.tg-slider-wrap');
    const range      = root.querySelector('.tg-range');
    const valEl      = root.querySelector('.tg-val');

    let expanded = false;
    let collapseTimer = null;
    let peekOutTimer = null;
    let peekRetractTimer = null;

    function expand() {
        if (expanded) return;
        expanded = true;
        panel.classList.add('expanded');
        sliderWrap.style.display = 'flex';
        clearTimers();
    }

    function collapse() {
        if (!expanded) return;
        expanded = false;
        panel.classList.remove('expanded');
        sliderWrap.style.display = 'none';
        // 折叠后若鼠标不在面板上，安排半隐藏
        schedulePeekOff(160);
    }

    function clearTimers() {
        clearTimeout(collapseTimer);
        clearTimeout(peekOutTimer);
        clearTimeout(peekRetractTimer);
    }

    // 进入：立即展示按钮完整（添加 peek）
    panel.addEventListener('pointerenter', () => {
        clearTimers();
        if (!expanded) panel.classList.add('peek');
    });

    // 离开：展开状态 → 1 秒后折叠；非展开则轻微延迟恢复半隐藏
    panel.addEventListener('pointerleave', () => {
        if (expanded) {
            collapseTimer = setTimeout(() => {
                if (!panel.matches(':hover')) collapse();
            }, 1000);
        } else {
            // 非展开状态下离开，安排收回半隐藏
            schedulePeekOff(140);
        }
    });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        expand();
    });

    range.addEventListener('input', () => {
        grayLevel = clamp(parseInt(range.value, 10), 0, 100);
        valEl.textContent = grayLevel + '%';
        applyGrayscale(grayLevel);
        localStorage.setItem(STORAGE_KEY, String(grayLevel));
    });

    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && expanded) {
            collapse();
        }
    });

    function schedulePeekOff(delay) {
        clearTimeout(peekRetractTimer);
        // 如果此刻还在 hover，就不收回
        if (panel.matches(':hover') || expanded) return;
        peekRetractTimer = setTimeout(() => {
            if (!panel.matches(':hover') && !expanded) {
                panel.classList.remove('peek');
            }
        }, delay);
    }

    function applyGrayscale(level) {
        document.documentElement.style.filter = level ? `grayscale(${level}%)` : '';
    }

    function clamp(n, min, max) {
        return n < min ? min : (n > max ? max : n);
    }

    function getBaseDomain(h) {
        if (!h) return 'unknown';
        const lower = h.toLowerCase();
        if (lower === 'localhost') return lower;
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(lower)) return lower;
        if (/^\[?[a-f0-9:]+\]?$/.test(lower)) return lower;
        const parts = lower.split('.');
        if (parts.length <= 2) return lower;

        const multiSuffixes = [
            'com.cn','net.cn','org.cn','gov.cn','edu.cn','ac.cn',
            'co.uk','org.uk','gov.uk','ltd.uk','plc.uk',
            'com.hk','com.tw'
        ];
        const last2 = parts.slice(-2).join('.');
        const last3 = parts.slice(-3).join('.');
        if (multiSuffixes.includes(last2)) {
            return parts.slice(-3).join('.');
        }
        if (multiSuffixes.includes(last3)) {
            return parts.slice(-4).join('.');
        }
        return last2;
    }
})();