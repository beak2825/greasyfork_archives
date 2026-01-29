// ==UserScript==
// @name         Twitter/X 互关检测助手 Unfollow Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 Twitter/X 的“正在关注”页面自动筛选未回关的用户。未回关者标红，已回关者隐藏。支持物理移除模式。
// @author       QuasarNe
// @match        https://twitter.com/*/following
// @match        https://x.com/*/following
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564355/TwitterX%20%E4%BA%92%E5%85%B3%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B%20Unfollow%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/564355/TwitterX%20%E4%BA%92%E5%85%B3%E6%A3%80%E6%B5%8B%E5%8A%A9%E6%89%8B%20Unfollow%20Helper.meta.js
// ==/UserScript==

(async () => {
    console.log("%c[Twitter Helper] 正在初始化工具...", "color: #1d9bf0; font-weight: bold; font-size: 16px;");
    
    // 1. 注入强力 CSS 规则，确保样式不会被 Twitter 的 React 引擎推翻
    const style = document.createElement('style');
    style.innerHTML = `
        .helper-unfollow {
            background-color: rgba(255, 0, 0, 0.15) !important;
            border-left: 5px solid #ff4444 !important;
            border-radius: 4px !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        .helper-mutual {
            opacity: 0 !important;
            pointer-events: none !important;
        }
        /* 彻底移除模式的样式 */
        .helper-mode-clean .helper-mutual {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const highlightUnfollowers = () => {
        const userCells = document.querySelectorAll('[data-testid="UserCell"]');
        userCells.forEach(cell => {
            const content = cell.innerText;
            const username = (content.match(/@(\w+)/) || [])[1] || 'unknown';
            const isMutual = /Follows you|回关了你|关注了你|跟隨了你/.test(content);
            const targetClass = isMutual ? 'helper-mutual' : 'helper-unfollow';

            // 只有当用户名变化或 class 不对时才更新，减少 DOM 操作
            if (cell.getAttribute('data-active-user') !== username || !cell.classList.contains(targetClass)) {
                cell.classList.remove('helper-mutual', 'helper-unfollow');
                cell.classList.add(targetClass);
                cell.setAttribute('data-active-user', username);
            }
        });
    };

    let isPaused = true; // 油猴版默认暂停，等待用户点击开始

    // 2. 检测逻辑独立运行 (高频 500ms)，暂停滚动时检测依然有效
    const detectionTask = setInterval(highlightUnfollowers, 500);

    // 3. 滚动逻辑独立运行 (1200ms)，受暂停开关控制
    const scrollTask = setInterval(() => {
        if (isPaused) return;
        window.scrollBy({
            top: window.innerHeight * 0.9,
            behavior: 'smooth'
        });
    }, 1200);

    // 4. 控制面板
    const initUI = () => {
        if (document.getElementById('twitter-helper-panel')) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = 'twitter-helper-panel';
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.zIndex = '9999';
        controlPanel.style.display = 'flex';
        controlPanel.style.gap = '10px';

        const stopBtn = document.createElement('button');
        stopBtn.innerText = '停止并刷新';
        
        const pauseBtn = document.createElement('button');
        pauseBtn.innerText = '开始滚动';
        pauseBtn.style.backgroundColor = '#00ba7c';

        const clearBtn = document.createElement('button');
        clearBtn.innerText = '清理列表(移除互关)';

        [stopBtn, pauseBtn, clearBtn].forEach(btn => {
            btn.style.padding = '10px 20px';
            btn.style.backgroundColor = btn.style.backgroundColor || '#1d9bf0';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '20px';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = 'bold';
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        pauseBtn.onclick = () => {
            isPaused = !isPaused;
            pauseBtn.innerText = isPaused ? '恢复滚动' : '暂停滚动';
            pauseBtn.style.backgroundColor = isPaused ? '#ffa500' : '#1d9bf0';
        };
        
        stopBtn.onclick = () => {
            location.reload();
        };

        clearBtn.onclick = () => {
            isPaused = true;
            pauseBtn.innerText = '恢复滚动';
            pauseBtn.style.backgroundColor = '#ffa500';
            document.body.classList.toggle('helper-mode-clean');
            const isActive = document.body.classList.contains('helper-mode-clean');
            clearBtn.innerText = isActive ? '取消清理(显示全部)' : '清理列表(移除互关)';
            clearBtn.style.backgroundColor = isActive ? '#00ba7c' : '#1d9bf0';
        };
        
        controlPanel.appendChild(pauseBtn);
        controlPanel.appendChild(clearBtn);
        controlPanel.appendChild(stopBtn);
        document.body.appendChild(controlPanel);
    };

    // 持续检查是否需要初始化 UI（因为 Twitter 是 SPA）
    setInterval(() => {
        if (window.location.href.includes('/following')) {
            initUI();
        } else {
            const panel = document.getElementById('twitter-helper-panel');
            if (panel) panel.remove();
        }
    }, 2000);

    console.log("%c[已就绪] 油猴脚本已加载，请在 /following 页面查看控制面板。", "color: #1d9bf0;");
})();