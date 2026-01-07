// ==UserScript==
// @name         财新阅读助手
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  沉浸式阅读新闻，支持调整字号、行高，由AI生成。无任何破解功能。
// @author       Steve Jobs
// @match        *://*.caixin.com/*
// @exclude      *://deepview.caixin.com/*
// @exclude      *://www.caixin.com/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561674/%E8%B4%A2%E6%96%B0%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561674/%E8%B4%A2%E6%96%B0%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 灵魂存储：持久化配置 ---
    const config = {
        size: GM_getValue('rf_size', 20),
        width: GM_getValue('rf_width', 800),
        leading: GM_getValue('rf_leading', 1.7),
        spacing: GM_getValue('rf_spacing', 1.8)
    };

    // --- 2. 视觉重构：2026 审美标准 ---
    const injectStyles = () => {
        GM_addStyle(`
            :root {
                --rf-bg: #ffffff;
                --rf-text: #1a1a1a;
                --rf-serif: "Charter", "Source Han Serif SC", "Source Han Serif CN", "Noto Serif CJK SC", "Georgia", serif;
                --rf-sans: "SF Pro Display", "Inter", "Helvetica Neue", system-ui, sans-serif;
                --rf-size: ${config.size}px;
                --rf-width: ${config.width}px;
                --rf-leading: ${config.leading};
                --rf-spacing: ${config.spacing}em;
                --rf-accent: #1a1a1a;
            }

            /* 极简主义：抹除噪音 */
            .head, .sitenav, .topup, .mainnav, .littlenav, .conri, .f_ri, .function01,
            .pip_ad, .leftAd, .rightAd, .bottom_tong_ad, #comment, .multimedia,
            .columnBox, .rssBox, .indexEmail, .bottom, .pnArt, .xgydBox,
            .lanmu_textend, .idetor, .content-tag, #pageNext, .icon_key,
            .bd_block, .pip_mag_per, .app-download-guide, #header, #footer {
                display: none !important;
            }

            body {
                background-color: var(--rf-bg) !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden;
            }

            /* 核心容器 */
            #the_content, .comMain, .article-content, #main {
                display: block !important;
                width: 100% !important;
                max-width: none !important;
                background: transparent !important;
            }

            .conlf, .article-main, .main-content {
                float: none !important;
                margin: 0 auto !important;
                width: 90% !important;
                max-width: var(--rf-width) !important;
                padding: 8vh 0 !important;
                transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 标题艺术 */
            #conTit h1, .article-header h1 {
                font-family: var(--rf-sans);
                font-size: 3rem !important;
                font-weight: 800;
                letter-spacing: -0.03em;
                line-height: 1.1;
                margin-bottom: 1.5rem;
                color: var(--rf-text);
            }

            /* 正文排版 */
            #Main_Content_Val, .text, .content, .article-body {
                font-family: var(--rf-serif) !important;
                font-size: var(--rf-size) !important;
                line-height: var(--rf-leading) !important;
                color: var(--rf-text) !important;
                text-align: justify;
            }

            #Main_Content_Val p, .text p, .content p, .article-body p {
                margin-bottom: var(--rf-spacing) !important;
                display: block;
            }

            /* 外刊级首字下沉 */
            #Main_Content_Val p:first-of-type::first-letter,
            .text p:first-of-type::first-letter {
                float: left;
                font-size: 4.8em;
                line-height: 0.8;
                padding-top: 0.1em;
                padding-right: 0.1em;
                font-family: var(--rf-sans);
                font-weight: 800;
            }

            /* --- 控制中心升级版 --- */
            #rf-dock {
                position: fixed;
                bottom: 40px;
                right: 40px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px; /* 按钮间距 */
            }

            #rf-panel {
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 24px;
                padding: 24px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                margin-bottom: 10px;
                width: 220px;
                transform-origin: bottom right;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                opacity: 0;
                transform: scale(0.9) translateY(10px);
                pointer-events: none;
                position: absolute;
                bottom: 140px; /* 位于按钮组上方 */
                right: 0;
            }

            #rf-dock.panel-open #rf-panel {
                opacity: 1;
                transform: scale(1) translateY(0);
                pointer-events: auto;
            }

            /* 通用圆形按钮样式 */
            .rf-btn {
                width: 56px;
                height: 56px;
                background: var(--rf-accent);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 20px rgba(0,0,0,0.25);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                position: relative;
            }

            .rf-btn:hover { transform: scale(1.05); }
            .rf-btn:active { transform: scale(0.95); }
            .rf-btn svg { fill: white; width: 24px; height: 24px; transition: transform 0.3s; }

            /* 复制按钮特有样式 */
            .rf-copy {
                background: #ffffff;
            }
            .rf-copy svg { fill: var(--rf-accent); }
            .rf-copy:hover { background: #f0f0f0; }

            /* 复制成功后的状态 */
            .rf-copy.success { background: #34C759; }
            .rf-copy.success svg { fill: white; }

            /* 设置面板样式 */
            .ctrl-group { margin-bottom: 18px; }
            .ctrl-group:last-child { margin-bottom: 0; }
            .ctrl-group label {
                display: flex;
                justify-content: space-between;
                font-family: var(--rf-sans);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 10px;
                color: #666;
            }

            input[type=range] {
                width: 100%;
                height: 4px;
                background: rgba(0,0,0,0.1);
                border-radius: 2px;
                appearance: none;
                outline: none;
            }
            input[type=range]::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--rf-accent);
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            @media screen and (max-width: 768px) {
                .conlf { padding: 40px 20px !important; }
                #conTit h1 { font-size: 2.2rem !important; }
                #rf-panel { width: 180px; right: 0; }
                #rf-dock { bottom: 20px; right: 20px; }
            }
        `);
    };

    // --- 3. 核心功能：提取与交互 ---
    const copyContent = () => {
        // 1. 获取标题
        const titleEl = document.querySelector('#conTit h1') || document.querySelector('.article-header h1');
        const title = titleEl ? titleEl.innerText.trim() : '无标题';

        // 2. 获取日期 (深度清洗)
        const infoEl = document.querySelector('#artInfo') || document.querySelector('.artInfo');
        let date = '';
        if (infoEl) {
            const rawText = infoEl.innerText;
            // 匹配 YYYY年MM月DD日 HH:MM 格式
            const timeMatch = rawText.match(/(\d{4}年\d{2}月\d{2}日\s?\d{2}:\d{2})/);
            date = timeMatch ? timeMatch[1] : rawText.split('\n')[0].trim();
        }

        // 3. 获取正文 (保持段落结构)
        const contentEl = document.getElementById('Main_Content_Val') || document.querySelector('.text');
        let body = '';
        if (contentEl) {
            // 过滤掉无关的隐藏元素和空段落
            body = Array.from(contentEl.querySelectorAll('p'))
                .map(p => p.innerText.trim())
                .filter(txt => txt.length > 0 && !txt.includes('本文由第三方AI')) // 简单的过滤
                .join('\n\n');
        }

        // 4. 组装并写入剪切板
        const finalData = `${title}\n${date}\n\n${body}`;

        navigator.clipboard.writeText(finalData).then(() => {
            // 成功反馈动画
            const btn = document.querySelector('.rf-copy');
            const originalIcon = btn.innerHTML;
            btn.classList.add('success');
            // 切换为打钩图标
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = originalIcon;
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('复制失败，请检查浏览器权限');
        });
    };

    // --- 4. 构造交互界面 ---
    const createUI = () => {
        const dock = document.createElement('div');
        dock.id = 'rf-dock';

        // 复制图标 SVG
        const copyIcon = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

        // 设置图标 SVG
        const settingsIcon = `<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`;

        dock.innerHTML = `
            <div id="rf-panel">
                <div class="ctrl-group">
                    <label>字号 <span id="val-sz">${config.size}</span></label>
                    <input type="range" id="sz" min="16" max="36" value="${config.size}">
                </div>
                <div class="ctrl-group">
                    <label>宽度 <span id="val-wd">${config.width}</span></label>
                    <input type="range" id="wd" min="400" max="1200" step="50" value="${config.width}">
                </div>
                <div class="ctrl-group">
                    <label>行高 <span id="val-ld">${config.leading}</span></label>
                    <input type="range" id="ld" min="1.2" max="2.5" step="0.1" value="${config.leading}">
                </div>
                <div class="ctrl-group">
                    <label>段间距 <span id="val-sp">${config.spacing}</span></label>
                    <input type="range" id="sp" min="0.5" max="3" step="0.1" value="${config.spacing}">
                </div>
            </div>

            <!-- 复制按钮 -->
            <div class="rf-btn rf-copy" title="一键复制全文">
                ${copyIcon}
            </div>

            <!-- 设置开关 -->
            <div class="rf-btn rf-toggle" title="阅读设置">
                ${settingsIcon}
            </div>
        `;
        document.body.appendChild(dock);

        // 绑定事件
        document.querySelector('.rf-copy').addEventListener('click', copyContent);

        const toggleBtn = document.querySelector('.rf-toggle');
        toggleBtn.addEventListener('click', () => {
            document.getElementById('rf-dock').classList.toggle('panel-open');
        });

        // 绑定滑块数据
        const update = (id, key, unit = '') => {
            const el = document.getElementById(id);
            el.addEventListener('input', (e) => {
                const val = e.target.value;
                document.documentElement.style.setProperty(`--rf-${key}`, val + unit);
                document.getElementById(`val-${id}`).innerText = val;
                GM_setValue(`rf_${key}`, val);
            });
        };

        update('sz', 'size', 'px');
        update('wd', 'width', 'px');
        update('ld', 'leading', '');
        update('sp', 'spacing', 'em');
    };

    // --- 5. 执行流程 ---
    injectStyles();

    const init = () => {
        // 确保核心元素存在
        if (document.body && !document.getElementById('rf-dock')) {
            createUI();

            // 图片与媒体修复
            document.querySelectorAll('.cx-img-loader, img').forEach(img => {
                if (img.dataset.src) img.src = img.dataset.src;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '12px';
                img.style.margin = '2em 0';
                img.style.display = 'block'; // 避免内联元素的空隙
            });
        } else {
            setTimeout(init, 50);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();