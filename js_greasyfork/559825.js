// ==UserScript==
// @name         班固米在看扭蛋机丨位置调整定制版 (稳定版)
// @namespace    bangumi@xban
// @version      0.1.3.forkstable
// @description  修复样式冲突，优化深色模式兼容性。使用 CSS 变量统一管理颜色，确保在不同布局下样式稳定。
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @icon         https://bgm.tv/img/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559825/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%9C%A8%E7%9C%8B%E6%89%AD%E8%9B%8B%E6%9C%BA%E4%B8%A8%E4%BD%8D%E7%BD%AE%E8%B0%83%E6%95%B4%E5%AE%9A%E5%88%B6%E7%89%88%20%28%E7%A8%B3%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559825/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%9C%A8%E7%9C%8B%E6%89%AD%E8%9B%8B%E6%9C%BA%E4%B8%A8%E4%BD%8D%E7%BD%AE%E8%B0%83%E6%95%B4%E5%AE%9A%E5%88%B6%E7%89%88%20%28%E7%A8%B3%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 核心样式表 (包含基础布局 + 交互 + 主题变量) ---
    const GACHA_UI_STYLE = `
        /* 1. 主题变量定义 */
        :root, [data-gacha-theme="light"] {
            --gx-surface: #ffffff;
            --gx-surface-subtle: #f9fafb;
            --gx-text-main: #1f2937;
            --gx-text-sub: #9ca3af;
            --gx-border: #e5e7eb;
            --gx-accent: #ec4899;
            --gx-accent-hover: #db2777;
            --gx-accent-bg: #fdf2f8;
            --gx-blue: #3b82f6;
            --gx-blue-bg: #eff6ff;
            --gx-overlay: rgba(17, 24, 39, 0.4);
            --gx-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        [data-gacha-theme="dark"] {
            --gx-surface: #1e293b;
            --gx-surface-subtle: #0f172a;
            --gx-text-main: #f1f5f9;
            --gx-text-sub: #94a3b8;
            --gx-border: #334155;
            --gx-accent: #f472b6;
            --gx-accent-hover: #ec4899;
            --gx-accent-bg: rgba(244, 114, 182, 0.15);
            --gx-blue: #60a5fa;
            --gx-blue-bg: rgba(59, 130, 246, 0.15);
            --gx-overlay: rgba(0, 0, 0, 0.7);
            --gx-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* 2. 工具栏与按钮 */
        .gx-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; height: 32px; width: 100%; }
        .gx-btn-group { display: flex; background: var(--gx-surface); border: 1px solid var(--gx-border); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: border-color 0.2s; }
        .gx-btn-group:hover { border-color: var(--gx-accent); }

        .gx-btn {
            padding: 4px 12px; font-size: 12px; font-weight: bold; cursor: pointer; border: none; background: transparent;
            display: flex; align-items: center; gap: 6px; color: var(--gx-text-main) !important; transition: all 0.2s;
            height: 100%; box-sizing: border-box; text-decoration: none !important;
        }
        .gx-btn:not(:last-child) { border-right: 1px solid var(--gx-border); }
        .gx-btn-gacha:hover { background: var(--gx-accent-bg); color: var(--gx-accent) !important; }
        .gx-btn-direct:hover { background: var(--gx-blue-bg); color: var(--gx-blue) !important; }

        /* 3. 模态框布局 */
        #gacha-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: var(--gx-overlay); backdrop-filter: blur(2px); transition: opacity 0.2s; }
        #gacha-container {
            background: var(--gx-surface); border-radius: 16px; padding: 24px; position: relative;
            max-width: 90vw; min-width: 320px; box-shadow: var(--gx-shadow); border: 1px solid var(--gx-border);
            animation: gx-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes gx-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        /* 4. 卡片样式 (核心修复点) */
        .gx-grid { display: grid; gap: 16px; justify-content: center; }
        .gx-grid.cols-3 { grid-template-columns: repeat(3, 160px); }
        .gx-grid.single { grid-template-columns: 220px; }

        .gx-card {
            background: var(--gx-surface); border: 1px solid var(--gx-border); border-radius: 12px; overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; display: flex; flex-direction: column;
        }
        .gx-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.2); border-color: var(--gx-accent); }

        .gx-card-cover { position: relative; width: 100%; aspect-ratio: 2/2.8; background: var(--gx-surface-subtle); }
        .gx-card-img { width: 100%; height: 100%; object-fit: cover; }

        .gx-badge {
            position: absolute; top: 8px; left: 8px; padding: 2px 8px; font-size: 10px; font-weight: bold;
            border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);
        }
        /* 针对不同类型的标签颜色强化 */
        .gx-badge[data-type="2"] { background: #fce7f3; color: #db2777; } /* 动画 */
        .gx-badge[data-type="1"] { background: #dcfce7; color: #16a34a; } /* 书籍 */
        .gx-badge[data-type="6"] { background: #f3f4f6; color: #4b5563; } /* 三次元 */
        [data-gacha-theme="dark"] .gx-badge { border-color: rgba(255,255,255,0.1); }
        [data-gacha-theme="dark"] .gx-badge[data-type="2"] { background: rgba(244, 114, 182, 0.25); color: #f9a8d4; }
        [data-gacha-theme="dark"] .gx-badge[data-type="1"] { background: rgba(74, 222, 128, 0.2); color: #86efac; }

        .gx-card-info { padding: 12px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; gap: 8px; }
        .gx-card-title { color: var(--gx-text-main) !important; font-weight: bold; font-size: 14px; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .gx-pill { font-size: 10px; font-family: monospace; padding: 2px 6px; background: var(--gx-surface-subtle); border: 1px solid var(--gx-border); color: var(--gx-text-sub); border-radius: 4px; text-align: center; }

        /* 5. 通用工具 */
        .gx-hidden { display: none !important; }
        .gx-loading-spinner { width: 32px; height: 32px; border: 4px solid var(--gx-accent-bg); border-top-color: var(--gx-accent); border-radius: 50%; animation: gx-spin 0.8s linear infinite; }
        @keyframes gx-spin { to { transform: rotate(360deg); } }
    `;

    GM_addStyle(GACHA_UI_STYLE);

    // --- 2. 逻辑处理类 ---
    class BangumiGacha {
        constructor() {
            this.isRunning = false;
            this.init();
        }

        init() {
            this.setupThemeSync();
            this.renderToolbar();
            this.renderModal();
            this.bindTabListeners();
            this.updatePoolCount();
        }

        setupThemeSync() {
            const apply = () => {
                const isDark = document.body.classList.contains('dark_mode') ||
                               document.documentElement.getAttribute('data-theme') === 'dark';
                document.documentElement.setAttribute('data-gacha-theme', isDark ? 'dark' : 'light');
            };
            apply();
            const obs = new MutationObserver(apply);
            obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }

        getPool() {
            const container = document.getElementById('prgSubjectList');
            if (!container) return [];
            const activeTab = document.querySelector('#prgCatrgoryFilter a.focus');
            const targetType = activeTab ? activeTab.getAttribute('subject_type') : '0';
            const selector = targetType === '0' ? 'li[subject_type]' : `li[subject_type="${targetType}"]`;

            return Array.from(container.querySelectorAll(selector)).map(item => {
                const titleEl = item.querySelector('.subjectItem.title');
                const imgEl = item.querySelector('img');
                if (!titleEl || !imgEl) return null;
                return {
                    id: titleEl.getAttribute('subject_id'),
                    title: (titleEl.getAttribute('data-subject-name-cn') || titleEl.innerText).trim(),
                    link: titleEl.getAttribute('href'),
                    cover: imgEl.src.startsWith('//') ? 'https:' + imgEl.src : imgEl.src,
                    typeId: item.getAttribute('subject_type'),
                    progress: (item.querySelector('.progress_percent_text')?.innerText || '[??/??]').replace(/[\[\]]/g, '')
                };
            }).filter(Boolean);
        }

        updatePoolCount() {
            const el = document.getElementById('gx-count');
            if (el) el.innerText = `POOL: ${this.getPool().length}`;
        }

        bindTabListeners() {
            document.querySelectorAll('#prgCatrgoryFilter a').forEach(a => {
                a.addEventListener('click', () => setTimeout(() => this.updatePoolCount(), 300));
            });
        }

        renderToolbar() {
            const target = document.getElementById('prgManagerHeader');
            if (!target || document.getElementById('gx-toolbar')) return;

            const toolbar = document.createElement('div');
            toolbar.id = 'gx-toolbar';
            toolbar.className = 'gx-toolbar';
            toolbar.innerHTML = `
                <div id="gx-count" style="font-size:10px; color:var(--gx-text-sub); font-family:monospace;">POOL: -</div>
                <div class="gx-btn-group">
                    <button class="gx-btn gx-btn-gacha" id="gx-open"><span style="font-size:14px">🎲</span> 扭蛋</button>
                    <button class="gx-btn gx-btn-direct" id="gx-lucky"><span style="font-size:14px">⚡</span> 手气不错</button>
                </div>
            `;
            target.appendChild(toolbar);

            document.getElementById('gx-open').onclick = () => this.openModal();
            document.getElementById('gx-lucky').onclick = () => {
                const p = this.getPool();
                if (p.length) window.location.href = p[Math.floor(Math.random()*p.length)].link;
            };
        }

        renderModal() {
            const modal = document.createElement('div');
            modal.id = 'gacha-modal';
            modal.className = 'gx-hidden';
            modal.innerHTML = `
                <div id="gacha-container">
                    <button id="gx-close" style="position:absolute; top:12px; right:12px; background:none; border:none; color:var(--gx-text-sub); cursor:pointer; font-size:20px;">&times;</button>
                    <div style="text-align:center; margin-bottom:20px;">
                        <h3 style="margin:0; font-size:18px; color:var(--gx-text-main);">抽选结果</h3>
                        <p id="gx-subtitle" style="font-size:10px; color:var(--gx-text-sub); margin-top:4px; font-family:monospace;"></p>
                    </div>
                    <div id="gx-result" style="min-height:280px; display:flex; align-items:center; justify-content:center;"></div>
                    <div style="margin-top:24px; display:flex; justify-content:center; gap:12px; padding-top:16px; border-top:1px solid var(--gx-border);">
                        <button id="gx-draw-1" style="padding:8px 16px; border-radius:8px; border:1px solid var(--gx-border); background:var(--gx-surface); cursor:pointer; color:var(--gx-text-main); font-size:13px;">再抽一个</button>
                        <button id="gx-draw-3" style="padding:8px 16px; border-radius:8px; border:1px solid var(--gx-accent); background:var(--gx-accent-bg); color:var(--gx-accent); cursor:pointer; font-size:13px; font-weight:bold;">🎰 三连抽</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            this.ui = {
                modal,
                result: modal.querySelector('#gx-result'),
                subtitle: modal.querySelector('#gx-subtitle')
            };

            modal.onclick = (e) => { if(e.target === modal) this.closeModal(); };
            modal.querySelector('#gx-close').onclick = () => this.closeModal();
            modal.querySelector('#gx-draw-1').onclick = () => this.run(1);
            modal.querySelector('#gx-draw-3').onclick = () => this.run(3);
        }

        openModal() {
            this.currentPool = this.getPool();
            if (!this.currentPool.length) return alert("当前列表没有条目");
            this.ui.subtitle.innerText = `SEARCHED ${this.currentPool.length} ITEMS`;
            this.ui.modal.classList.remove('gx-hidden');
            this.run(1);
        }

        closeModal() {
            this.ui.modal.classList.add('gx-hidden');
            this.ui.result.innerHTML = '';
        }

        run(count) {
            if (this.isRunning) return;
            this.isRunning = true;
            this.ui.result.innerHTML = `<div class="gx-loading-spinner"></div>`;

            setTimeout(() => {
                const results = [...this.currentPool].sort(() => 0.5 - Math.random()).slice(0, count);
                this.renderCards(results);
                this.isRunning = false;
            }, 400);
        }

        renderCards(items) {
            const isSingle = items.length === 1;
            const typeNames = { '1': '书籍', '2': '动画', '6': '三次元' };

            let html = `<div class="gx-grid ${isSingle ? 'single' : 'cols-3'}">`;
            items.forEach(item => {
                html += `
                    <div class="gx-card" onclick="window.location.href='${item.link}'">
                        <div class="gx-card-cover">
                            <img src="${item.cover}" class="gx-card-img" onerror="this.src='https://bgm.tv/img/no_icon_subject.png'">
                            <span class="gx-badge" data-type="${item.typeId}">${typeNames[item.typeId] || '条目'}</span>
                        </div>
                        <div class="gx-card-info">
                            <div class="gx-card-title">${item.title}</div>
                            <div class="gx-pill">${item.progress}</div>
                        </div>
                    </div>`;
            });
            this.ui.result.innerHTML = html + `</div>`;
        }
    }

    new BangumiGacha();
})();