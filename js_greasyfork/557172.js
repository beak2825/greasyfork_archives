// ==UserScript==
// @name         M3U8视频链接检测助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动检测页面中的M3U8视频链接，智能验证可用性，支持一键复制
// @author       MissChina
// @license      仅限个人非商业用途，禁止商业使用
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_notification
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🎬</text></svg>
// @downloadURL https://update.greasyfork.org/scripts/557172/M3U8%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557172/M3U8%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------- 配置与全局状态 --------------------
    const validLinks = new Set();             // 已确认有效的 M3U8 链接
    const pendingLinks = new Map();           // 待确认的 M3U8 链接
    const logs = [];                          // 日志记录

    let panel = null;                         // 面板根节点
    let activeTab = 'links';                  // 当前激活的 Tab
    let tsDetectedCount = 0;                  // .ts 检测计数（限制次数）

    // ========================================================
    // 日志系统
    // ========================================================
    function log(msg, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        logs.push({ time: timestamp, msg, type });
        if (logs.length > 100) logs.shift();
        updatePanel();
    }

    // ========================================================
    // 工具函数
    // ========================================================

    // 判断是否为 M3U8 链接
    function isM3U8(url) {
        if (!url || typeof url !== 'string') return false;
        return /\.m3u8(?:\?|#|$)/.test(url) && !url.includes('.ts');
    }

    // 获取 URL 的目录路径
    function getPathOnly(url) {
        try {
            const u = new URL(url);
            return u.pathname.substring(0, u.pathname.lastIndexOf('/'));
        } catch(e) {
            return '';
        }
    }

    // 获取 URL 的 origin
    function getOrigin(url) {
        try {
            return new URL(url).origin;
        } catch(e) {
            return '';
        }
    }

    // ========================================================
    // 面板刷新
    // ========================================================
    function updatePanel() {
        if (!panel) return;

        const cntEl = document.getElementById('cnt');
        const lcntEl = document.getElementById('lcnt');
        const cont = document.getElementById('cont');

        if (cntEl) cntEl.textContent = validLinks.size;
        if (lcntEl) lcntEl.textContent = logs.length;
        if (!cont) return;

        if (activeTab === 'links') {
            // 链接列表
            if (validLinks.size === 0) {
                cont.innerHTML = '<div class="m3u8-empty">当前页面暂无 M3U8 链接</div>';
            } else {
                cont.innerHTML = Array.from(validLinks).map(url => `
                    <div class="m3u8-item">
                        <div class="m3u8-url" title="${url}">${url}</div>
                        <div class="m3u8-item-btns">
                            <button class="m3u8-btn m3u8-btn-pri" data-url="${url}">复制链接</button>
                        </div>
                    </div>
                `).join('');

                cont.querySelectorAll('.m3u8-btn-pri').forEach(btn => {
                    btn.onclick = () => window.m3u8Copy(btn.dataset.url);
                });
            }
        } else if (activeTab === 'logs') {
            // 日志列表
            if (logs.length === 0) {
                cont.innerHTML = '<div class="m3u8-empty">暂无日志</div>';
            } else {
                const typeColors = {
                    info: '#4b5563',
                    success: '#16a34a',
                    warning: '#d97706',
                    error: '#dc2626'
                };

                cont.innerHTML = `
                    <div class="m3u8-log-header">
                        <button class="m3u8-btn m3u8-btn-sec" id="clear-logs" style="width:auto;padding:4px 10px;font-size:11px">清除日志</button>
                    </div>
                ` + logs.slice().reverse().map(l => `
                    <div class="m3u8-log-item">
                        <span class="m3u8-log-time">${l.time}</span>
                        <span class="m3u8-log-msg" style="color:${typeColors[l.type] || typeColors.info}">${l.msg}</span>
                    </div>
                `).join('');

                const clearBtn = document.getElementById('clear-logs');
                if (clearBtn) {
                    clearBtn.onclick = () => {
                        logs.length = 0;
                        updatePanel();
                    };
                }
            }
        }
    }

    // ========================================================
    // 复制 M3U8 链接
    // ========================================================
    window.m3u8Copy = function(url) {
        try {
            GM_setClipboard(url);
            GM_notification({ title: '✅ 复制成功', text: '链接已复制到剪贴板', timeout: 2000 });
            log('📋 已复制链接: ' + url, 'success');
        } catch(e) {
            log('❌ 复制失败: ' + e.toString(), 'error');
        }
    };

    // ========================================================
    // 链接状态管理
    // ========================================================

    function addValid(url) {
        if (!validLinks.has(url)) {
            log('✅ 发现 M3U8: ' + url, 'success');
            validLinks.add(url);
            pendingLinks.delete(url);
            if (validLinks.size === 1) {
                setTimeout(showPanel, 120);
            } else {
                updatePanel();
            }
        }
    }

    function addPending(url) {
        if (!validLinks.has(url) && !pendingLinks.has(url)) {
            pendingLinks.set(url, { tsCount: 0 });
        }
    }

    // 处理 .ts 资源侦测，用来辅助确认真实 m3u8 地址
    function onTS(tsUrl) {
        if (tsDetectedCount >= 3) return;

        tsDetectedCount++;

        const tsPath = getPathOnly(tsUrl);
        const tsOrigin = getOrigin(tsUrl);

        for (const [m3u8Url, info] of pendingLinks) {
            const m3u8Path = getPathOnly(m3u8Url);
            const m3u8Origin = getOrigin(m3u8Url);

            if (m3u8Path === tsPath) {
                info.tsCount++;

                if (info.tsCount >= 1) {
                    if (tsOrigin !== m3u8Origin) {
                        try {
                            const m3u8UrlObj = new URL(m3u8Url);
                            const tsUrlObj = new URL(tsUrl);
                            const realUrl = tsUrlObj.origin + m3u8UrlObj.pathname + m3u8UrlObj.search;
                            log('🔧 检测到重定向，尝试构造真实 M3U8 URL', 'warning');

                            pendingLinks.delete(m3u8Url);
                            addValid(realUrl);
                        } catch(e) {
                            addValid(m3u8Url);
                        }
                    } else {
                        addValid(m3u8Url);
                    }
                }
            }
        }
    }

    // ========================================================
    // Hook fetch / XHR / PerformanceObserver
    // ========================================================

    // 重写 fetch
    const _fetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

        if (url && isM3U8(url)) {
            addPending(url);
            return _fetch.apply(this, args).then(res => {
                if (res.status === 200) {
                    res.clone().text().then(txt => {
                        if (txt && txt.includes('#EXTM3U')) addValid(url);
                    }).catch(() => {});
                }
                return res;
            });
        } else if (url && url.includes('.ts')) {
            onTS(url);
        }

        return _fetch.apply(this, args);
    };

    // 重写 XMLHttpRequest
    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__url = url;
        return _open.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        const url = this.__url;

        if (url && isM3U8(url)) {
            addPending(url);
            this.addEventListener('load', function() {
                if (this.status === 200) {
                    try {
                        const txt = this.responseText;
                        if (txt && txt.includes('#EXTM3U')) addValid(url);
                    } catch(e) {}
                }
            });
        } else if (url && url.includes('.ts')) {
            onTS(url);
        }

        return _send.apply(this, args);
    };

    // PerformanceObserver 监听资源加载
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const url = entry.name;
                if (isM3U8(url)) {
                    addPending(url);
                } else if (url.includes('.ts')) {
                    onTS(url);
                }
            }
        });
        observer.observe({ entryTypes: ['resource'] });
    } catch(e) {}

    // ========================================================
    // 面板创建 & 拖动
    // ========================================================

    function showPanel() {
        if (!panel) {
            if (document.body) {
                createPanel();
            } else {
                setTimeout(showPanel, 100);
            }
        } else {
            panel.style.display = 'block';
        }
    }

    function createPanel() {
        if (panel) return;

        panel = document.createElement('div');
        panel.setAttribute('data-m3u8-panel', 'true');
        panel.innerHTML = `
<style>
/* 根容器：默认在右上角 */
#m3u8-root {
    position: fixed;
    right: 18px;
    top: 18px;
    width: 320px;
    max-height: 68vh;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    color: #111827;
}

/* 卡片本体（浅色风格） */
#m3u8-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow:
        0 8px 20px rgba(15, 23, 42, 0.08),
        0 0 0 1px rgba(148, 163, 184, 0.35);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 头部：可拖动区域 */
.m3u8-hdr {
    height: 38px;
    padding: 0 10px 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    user-select: none;
    -webkit-user-select: none;
    background: linear-gradient(90deg, #e0f2fe, #f1f5f9);
    border-bottom: 1px solid #d1d5db;
}

.m3u8-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
}

.m3u8-title-icon {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: linear-gradient(135deg, #38bdf8, #22c55e);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 11px;
}

.m3u8-title-text {
    letter-spacing: 0.02em;
}

/* 头部按钮 */
.m3u8-btns {
    display: flex;
    align-items: center;
    gap: 4px;
}
.m3u8-btn-hdr {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    border: none;
    padding: 0;
    background: transparent;
    color: #4b5563;
    cursor: pointer;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.m3u8-btn-hdr:hover {
    background: rgba(148, 163, 184, 0.28);
    color: #111827;
}
.m3u8-btn-hdr:active {
    transform: scale(0.9);
}

/* Tabs 区域 */
.m3u8-tabs {
    display: flex;
    gap: 4px;
    padding: 6px 6px 4px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}
.m3u8-tab {
    flex: 1;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    font-size: 11px;
    padding: 4px 0;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
}
.m3u8-tab span {
    font-variant-numeric: tabular-nums;
}
.m3u8-tab:hover {
    background: #e5f2ff;
    color: #1d4ed8;
}
.m3u8-tab.active {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #93c5fd;
}

/* 内容区域 */
.m3u8-cont {
    padding: 8px 8px 10px;
    max-height: calc(68vh - 38px - 32px);
    min-height: 140px;
    overflow-y: auto;
    background: #ffffff;
    font-size: 12px;
    color: #111827;
}
.m3u8-cont::-webkit-scrollbar {
    width: 7px;
}
.m3u8-cont::-webkit-scrollbar-track {
    background: transparent;
}
.m3u8-cont::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.7);
    border-radius: 999px;
}
.m3u8-cont::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.9);
}

/* 列表项 */
.m3u8-item {
    padding: 8px 8px 7px;
    margin-bottom: 6px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.m3u8-url {
    font-size: 11px;
    line-height: 1.4;
    color: #1d4ed8;
    word-break: break-all;
    padding: 4px 6px;
    margin-bottom: 6px;
    border-radius: 6px;
    background: #eff6ff;
}

/* 按钮 */
.m3u8-item-btns {
    display: flex;
    gap: 6px;
}
.m3u8-btn {
    flex: 1;
    border-radius: 8px;
    border: none;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.08s ease;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
.m3u8-btn-pri {
    background: linear-gradient(90deg, #3b82f6, #22c55e);
    color: #ffffff;
    box-shadow: 0 1px 4px rgba(37, 99, 235, 0.4);
}
.m3u8-btn-pri:hover {
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.5);
    transform: translateY(-0.5px);
}
.m3u8-btn-sec {
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;
}
.m3u8-btn-sec:hover {
    background: #f3f4f6;
}

/* 空内容提示 */
.m3u8-empty {
    padding: 26px 12px;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
}
.m3u8-empty::before {
    content: "🎬";
    display: block;
    font-size: 26px;
    margin-bottom: 8px;
}

/* 日志样式 */
.m3u8-log-header {
    text-align: right;
    margin-bottom: 6px;
}
.m3u8-log-item {
    padding: 6px 7px;
    margin-bottom: 4px;
    border-radius: 8px;
    background: #f9fafb;
    border-left: 3px solid #3b82f6;
    font-size: 11px;
}
.m3u8-log-time {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    color: #3b82f6;
    margin-right: 6px;
}
.m3u8-log-msg {
    color: #374151;
}
</style>

<div id="m3u8-root">
  <div id="m3u8-card">
    <div class="m3u8-hdr" id="m3u8-drag">
      <div class="m3u8-title">
        <div class="m3u8-title-icon">M</div>
        <div class="m3u8-title-text">M3U8 检测助手</div>
      </div>
      <div class="m3u8-btns">
        <button class="m3u8-btn-hdr" id="m3u8-min" title="折叠">−</button>
        <button class="m3u8-btn-hdr" id="m3u8-close" title="关闭">×</button>
      </div>
    </div>
    <div id="m3u8-body">
      <div class="m3u8-tabs">
        <button class="m3u8-tab active" data-tab="links">
          <span>链接</span>
          <span id="cnt">0</span>
        </button>
        <button class="m3u8-tab" data-tab="logs">
          <span>日志</span>
          <span id="lcnt">0</span>
        </button>
      </div>
      <div class="m3u8-cont" id="cont"></div>
    </div>
  </div>
</div>`;

        document.body.appendChild(panel);

        const root = document.getElementById('m3u8-root');
        const bodyEl = document.getElementById('m3u8-body');
        const minBtn = document.getElementById('m3u8-min');
        const closeBtn = document.getElementById('m3u8-close');

        // 折叠
        if (minBtn) {
            minBtn.onclick = () => {
                const hidden = bodyEl.style.display === 'none';
                bodyEl.style.display = hidden ? 'block' : 'none';
                minBtn.textContent = hidden ? '−' : '+';
            };
        }

        // 关闭
        if (closeBtn) {
            closeBtn.onclick = () => {
                panel.style.display = 'none';
            };
        }

        // Tab 切换
        panel.querySelectorAll('.m3u8-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.m3u8-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeTab = tab.dataset.tab;
                updatePanel();
            };
        });

        // 拖动：拖动根容器 #m3u8-root
        const dragEl = document.getElementById('m3u8-drag');
        let dragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        const onMouseMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            root.style.left = startLeft + dx + 'px';
            root.style.top = startTop + dy + 'px';
            root.style.right = 'auto';
            root.style.bottom = 'auto';
        };

        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', endDrag);
        };

        if (dragEl) {
            dragEl.addEventListener('mousedown', (e) => {
                if (e.target.closest('.m3u8-btn-hdr')) return;
                e.preventDefault();
                const rect = root.getBoundingClientRect();
                dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', endDrag);
            });
        }

        updatePanel();
    }

})();
