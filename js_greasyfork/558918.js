// ==UserScript==
// @name         MetroWordle Pinyin Viewer
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  在 MetroWordle 中自动显示已提交词的拼音，并支持手动查询
// @author       bilibili@lvshu
// @match        https://metrowordle.fun/*
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/558918/MetroWordle%20Pinyin%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/558918/MetroWordle%20Pinyin%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.getElementById('pinyin-viewer')) return;

    let pinyinProLoaded = false;
    let uiMounted = false;

    // === 加载 pinyin-pro ===
    if (!window.pinyinPro) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/pinyin-pro';
        script.onload = () => {
            pinyinProLoaded = true;
            maybeInit();
        };
        script.onerror = () => {
            console.warn('⚠️ pinyin-pro 加载失败，手动查询将不可用');
            maybeInit();
        };
        document.head.appendChild(script);
    } else {
        pinyinProLoaded = true;
    }

    // === 尝试创建 UI ===
    let retryCount = 0;
    const maxRetries = 10;
    const tryCreateUI = () => {
        if (document.getElementById('pinyin-viewer') || uiMounted) return;
        if (!document.body) {
            if (retryCount++ < maxRetries) setTimeout(tryCreateUI, 800);
            return;
        }
        createUI();
        uiMounted = true;
    };

    if (document.body) {
        tryCreateUI();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                tryCreateUI();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    const retryInterval = setInterval(() => {
        if (!uiMounted && retryCount++ < maxRetries) {
            tryCreateUI();
        } else {
            clearInterval(retryInterval);
        }
    }, 800);

    // === 判断是否深色模式 ===
    function isDarkMode() {
        // 优先检测网页是否使用 Tailwind 的 .dark 类
        if (document.documentElement.classList.contains('dark')) return true;
        // 其次检测系统偏好
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // === 创建 UI ===
    function createUI() {
        const dark = isDarkMode();

        // 颜色方案
        const colors = dark
        ? {
            bgHeader: '#2d3748', // 灰蓝
            textHeader: '#e2e8f0',
            bgBody: '#1e293b',
            border: '#334155',
            inputBg: '#0f172a',
            inputText: '#f1f5f9',
            btnBg: '#38b2ac',
            btnText: '#fff',
            resultText: '#cbd5e1',
            placeholder: '#94a3b8'
        }
        : {
            bgHeader: '#6aaa64',
            textHeader: '#fff',
            bgBody: '#fff',
            border: '#ccc',
            inputBg: '#fff',
            inputText: '#333',
            btnBg: '#6aaa64',
            btnText: '#fff',
            resultText: '#333',
            placeholder: '#999'
        };

        const container = document.createElement('div');
        container.id = 'pinyin-viewer';
        container.innerHTML = `
            <div class="pinyin-header" style="background:${colors.bgHeader}; color:${colors.textHeader}; padding:8px 12px; border-radius:8px 8px 0 0; font-weight:bold; cursor:move; text-align:center; user-select:none;">
                拼音表
            </div>
            <div class="pinyin-body" style="background:${colors.bgBody}; padding:12px; border-radius:0 0 8px 8px; box-shadow:0 4px 12px rgba(0,0,0,0.2); border:1px solid ${colors.border};">
                <div id="auto-pinyin" style="margin-bottom:12px; font-size:0.9em; line-height:1.5; color:${colors.resultText};">
                    <div><strong>玩家最新词：</strong><span id="player-pinyin">-</span></div>
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="text" id="manual-query" placeholder="输入词查拼音"
                        style="flex:1; padding:6px 10px; background:${colors.inputBg}; color:${colors.inputText}; border:1px solid ${colors.border}; border-radius:6px; font-size:0.95em; outline:none;">
                    <button id="query-btn"
                        style="padding:6px 12px; background:${colors.btnBg}; color:${colors.btnText}; border:none; border-radius:6px; cursor:pointer; font-weight:bold; min-width:36px;">
                        查
                    </button>
                </div>
                <div id="manual-result" style="margin-top:10px; font-size:0.95em; min-height:1.3em; color:${colors.resultText}; word-break:break-all;"></div>
                <div style="margin-top:10px; text-align:center; font-size:0.8em; color:${colors.placeholder};">
                    <a href="https://space.bilibili.com/1944366810" target="_blank" style="color:${colors.placeholder}; text-decoration:underline;">
                        bilibili@lvshu
                    </a>
                </div>
            </div>
        `;
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10000,
            borderRadius: '8px',
            maxWidth: '280px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        });
        document.body.appendChild(container);

        // === 修复拖拽：防止事件穿透 + 限制在视窗内 ===
        const header = container.querySelector('.pinyin-header');
        let isDragging = false, offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
            container.style.pointerEvents = 'none'; // 防止穿透
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, e.clientX - offsetX));
            const y = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, e.clientY - offsetY));
            container.style.left = x + 'px';
            container.style.top = y + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.pointerEvents = 'auto';
            }
        });

        // === 重新检测深色模式（可选：监听页面主题切换）===
        const observer = new MutationObserver(() => {
            const nowDark = isDarkMode();
            if (nowDark !== dark) {
                // 简单刷新：移除旧 UI，重绘（或可做更精细的样式切换）
                container.remove();
                uiMounted = false;
                tryCreateUI();
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // 功能初始化
        initFunctionality();
    }

    // === 功能逻辑（保持不变，仅微调）===
    function initFunctionality() {
        function getPinyin(char) {
            if (!pinyinProLoaded || !window.pinyinPro) return char;
            try {
                return window.pinyinPro.pinyin(char, {
                    toneType: 'num',
                    v: true,
                    nonZh: 'consecutive'
                });
            } catch (e) {
                return char;
            }
        }

        function isChineseChar(char) {
            return /^[\u4e00-\u9fa5]$/.test(char);
        }

        function formatPinyin(word) {
            if (!word) return '';
            return [...word].map(char => {
                return isChineseChar(char) ? getPinyin(char) : char;
            }).join(' ');
        }

        const queryBtn = document.getElementById('query-btn');
        const input = document.getElementById('manual-query');
        const result = document.getElementById('manual-result');
        const handleQuery = () => {
            const text = input.value.trim();
            result.textContent = text ? formatPinyin(text) : '';
        };
        queryBtn?.addEventListener('click', handleQuery);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleQuery();
        });

        function extractLatestWord(selector) {
            const board = document.querySelector(selector);
            if (!board) return null;
            const rows = board.querySelectorAll('.flex.gap-2.justify-center');

            // 最新词在最上面
            for (let i = 0; i < rows.length; i++) {
                const boxes = Array.from(rows[i].querySelectorAll('div'));
                if (boxes.length === 0) continue;

                let word = '';
                let complete = true;
                for (const box of boxes) {
                    const txt = box.textContent.trim();
                    if (!txt || txt === '?') {
                        complete = false;
                        break;
                    }
                    word += txt;
                }
                if (!complete) continue;

                // 检查是否有反馈色
                const hasFeedback = boxes.some(b =>
                                               b.classList.contains('bg-success') ||
                                               b.classList.contains('bg-warning') ||
                                               b.classList.contains('bg-blue') ||
                                               b.classList.contains('bg-neutral')
                                              );

                if (hasFeedback) {
                    return word; // 找到最新已提交行，立即返回
                }
            }
            return null;
        }

        let lastPlayer = '';
        function updatePinyin() {
            try {
                const player = extractLatestWord('.grid.gap-3.max-w-2xl.mx-auto') || '';
                if (player !== lastPlayer) {
                    lastPlayer = player;
                    document.getElementById('player-pinyin').textContent = player ? formatPinyin(player) : '-';
                }
            } catch (e) {
                console.warn('⚠️ 自动更新失败:', e);
            }
        }

        setInterval(updatePinyin, 1200);
    }

    function maybeInit() {
        if (document.body && !uiMounted) {
            tryCreateUI();
        }
    }
})();