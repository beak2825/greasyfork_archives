// ==UserScript==
// @name         ZNUT (Z-aN UtilityTool)
// @namespace    https://greasyfork.org/ja/users/1554136-shiftsphere
// @version      3.47
// @description  コメントレシートを動画の上に配置またはニコニコ動画風の弾幕モードにできるスクリプト。右上の設定（⚙アイコン）からモードを切り替えられます。
// @author       shiftsphere with gemini
// @match        https://www.zan-live.com/live/play/*
// @match        https://www.zan-live.com/ja/live/play/*
// @match        https://www.zan-live.com/live/detail/*
// @match        https://www.zan-live.com/ja/live/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560738/ZNUT%20%28Z-aN%20UtilityTool%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560738/ZNUT%20%28Z-aN%20UtilityTool%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定の読み込み ---
    let config = {
        // 共通・通常モード設定
        width: parseInt(localStorage.getItem('znut_width')) || 15,
        bgOpacity: parseFloat(localStorage.getItem('znut_opacity')) || 0.5,
        titleColor: localStorage.getItem('znut_titleColor') || '#c0c0c0',

        // 弾幕モード設定
        danmakuMode: localStorage.getItem('znut_danmakuMode') === 'true',
        danmakuSize: parseInt(localStorage.getItem('znut_danmakuSize')) || 32, // 文字サイズ(px)
        danmakuOpacity: parseFloat(localStorage.getItem('znut_danmakuOpacity')) || 1.0 // 文字透明度
    };

    let intervalId = null;
    let commentObserver = null;
    let lanes = [];

    // --- スタイル適用関数 ---
    function applyStyles() {
        const lBox = document.getElementById('lBox');
        const rBox = document.getElementById('rBox');
        const mainContent = document.getElementById('main-content');
        const kafTitle = document.querySelector('#kafTitle01, .title p');

        if (!lBox || !rBox || !mainContent) return;

        // 共通
        mainContent.style.setProperty('position', 'relative', 'important');
        mainContent.style.setProperty('display', 'block', 'important');
        lBox.style.setProperty('width', '100%', 'important');
        lBox.style.setProperty('max-width', '100%', 'important');
        lBox.style.setProperty('flex', 'none', 'important');

        if (kafTitle) kafTitle.style.setProperty('color', config.titleColor, 'important');

        // ★弾幕モードの分岐★
        if (config.danmakuMode) {
            rBox.style.setProperty('position', 'absolute', 'important');
            rBox.style.setProperty('top', '0', 'important');
            rBox.style.setProperty('right', '0', 'important');
            rBox.style.setProperty('width', '1px', 'important');
            rBox.style.setProperty('height', '1px', 'important');
            rBox.style.setProperty('opacity', '0', 'important');
            rBox.style.setProperty('overflow', 'hidden', 'important');
            rBox.style.setProperty('pointer-events', 'none', 'important');
            rBox.style.setProperty('z-index', '-1', 'important');

            initDanmakuLayer();
            startCommentObserver();

        } else {
            // 通常モード
            rBox.style.setProperty('position', 'absolute', 'important');
            rBox.style.setProperty('top', '0', 'important');
            rBox.style.setProperty('right', '0', 'important');
            rBox.style.setProperty('height', '100%', 'important');
            rBox.style.setProperty('z-index', '10', 'important');
            rBox.style.setProperty('background-color', `rgba(0, 0, 0, ${config.bgOpacity})`, 'important');
            rBox.style.setProperty('width', config.width + '%', 'important');
            rBox.style.setProperty('flex', 'none', 'important');
            rBox.style.setProperty('max-width', 'none', 'important');
            rBox.style.setProperty('opacity', '1', 'important');
            rBox.style.setProperty('overflow', 'visible', 'important');
            rBox.style.setProperty('pointer-events', 'auto', 'important');

            const rInner = document.getElementById('rBoxInner');
            if(rInner) rInner.style.setProperty('background-color', 'transparent', 'important');

            removeDanmakuLayer();
            if(commentObserver) commentObserver.disconnect();
        }
    }

    // --- 弾幕（流れるコメント）機能 ---
    function initDanmakuLayer() {
        if (document.getElementById('znut-danmaku-layer')) return;
        const layer = document.createElement('div');
        layer.id = 'znut-danmaku-layer';
        layer.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 2147483647; overflow: hidden;
        `;
        document.body.appendChild(layer);
    }

    function removeDanmakuLayer() {
        const layer = document.getElementById('znut-danmaku-layer');
        if (layer) layer.remove();
    }

    function startCommentObserver() {
        const findTarget = setInterval(() => {
            const target = document.getElementById('commentListBox');
            if (target) {
                clearInterval(findTarget);
                setupObserver(target);
            }
        }, 1000);
    }

    function setupObserver(target) {
        if (commentObserver) commentObserver.disconnect();
        commentObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        let text = "";
                        if (node.classList && node.classList.contains('comment')) text = node.innerText;
                        else {
                            const commentSpan = node.querySelector('.comment');
                            if (commentSpan) text = commentSpan.innerText;
                        }
                        if (text) fireDanmaku(text);
                    }
                });
            });
        });
        commentObserver.observe(target, { childList: true, subtree: true });
    }

    function fireDanmaku(text) {
        const layer = document.getElementById('znut-danmaku-layer');
        if (!layer) return;

        const el = document.createElement('div');
        el.innerText = text;

        // 設定値を適用
        el.style.cssText = `
            position: absolute; white-space: nowrap; color: #fff; font-weight: bold;
            font-family: "M PLUS 1p", sans-serif;
            text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            will-change: transform; pointer-events: none;
            font-size: ${config.danmakuSize}px;
            opacity: ${config.danmakuOpacity};
        `;

        // レーン計算 (文字サイズに応じて行間を調整)
        const trackHeight = config.danmakuSize * 1.3;
        const maxTracks = Math.floor(window.innerHeight / trackHeight) || 10;
        const now = Date.now();
        let trackIndex = 0;

        for (let i = 0; i < maxTracks; i++) {
            if (!lanes[i] || lanes[i] < now) {
                trackIndex = i;
                break;
            }
            if (i === maxTracks - 1) trackIndex = Math.floor(Math.random() * maxTracks);
        }
        lanes[trackIndex] = now + 1000;

        el.style.top = (trackIndex * trackHeight) + 50 + 'px';
        el.style.left = '100vw';

        layer.appendChild(el);

        const duration = 6000 + (Math.random() * 2000);
        const anim = el.animate([
            { transform: 'translateX(0)' },
            { transform: `translateX(-${window.innerWidth + el.offsetWidth + 50}px)` }
        ], { duration: duration, easing: 'linear' });

        anim.onfinish = () => el.remove();
    }


    // --- 設定保存 ---
    function saveConfig() {
        localStorage.setItem('znut_width', config.width);
        localStorage.setItem('znut_opacity', config.bgOpacity);
        localStorage.setItem('znut_titleColor', config.titleColor);
        localStorage.setItem('znut_danmakuMode', config.danmakuMode);
        localStorage.setItem('znut_danmakuSize', config.danmakuSize);
        localStorage.setItem('znut_danmakuOpacity', config.danmakuOpacity);
        applyStyles();
    }

    // --- UI構築 ---
    function initUI() {
        const headerRight = document.getElementById('headerRight');
        if (!headerRight || document.getElementById('znut-settings-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'znut-settings-wrapper';
        wrapper.style.cssText = 'position:relative; margin-right:15px; display:flex; align-items:center;';

        const gearBtn = document.createElement('button');
        gearBtn.innerHTML = '⚙';
        gearBtn.title = 'ZNUT設定';
        gearBtn.style.cssText = 'font-size:24px; background:none; border:none; color:white; cursor:pointer; padding:5px; line-height:1;';

        const panel = document.createElement('div');
        panel.style.cssText = `
            display: none; position: absolute; top: 40px; right: 0;
            background: rgba(30, 30, 30, 0.95); border: 1px solid #555;
            padding: 15px; border-radius: 8px; width: 250px; z-index: 10001;
            color: white; font-size: 13px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        `;

        const createRow = (label, isSub = false) => {
            const div = document.createElement('div');
            div.style.marginBottom = '12px';
            if(isSub) div.style.paddingLeft = '10px';
            div.innerHTML = `<div style="margin-bottom:5px;font-weight:bold;color:${isSub?'#aaa':'#fff'};">${label}</div>`;
            return div;
        };

        const createControlBtn = (text, action) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = 'padding:2px 10px; background:#444; color:white; border:1px solid #666; border-radius:4px; cursor:pointer; font-weight:bold; margin: 0 5px;';
            btn.onmousedown = (e) => { e.preventDefault(); action(); intervalId = setInterval(action, 100); };
            const stop = () => { clearInterval(intervalId); };
            btn.onmouseup = stop; btn.onmouseleave = stop;
            return btn;
        };

        const createValDisplay = (text) => {
            const span = document.createElement('span');
            span.style.color = '#00ffcc';
            span.textContent = text;
            return span;
        };

        // --- 0. 弾幕モードスイッチ ---
        const modeRow = document.createElement('div');
        modeRow.style.cssText = 'margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #555;';
        const modeLabel = document.createElement('label');
        modeLabel.style.cssText = 'display:flex; align-items:center; cursor:pointer; font-weight:bold; font-size:14px;';
        const modeCheck = document.createElement('input');
        modeCheck.type = 'checkbox';
        modeCheck.checked = config.danmakuMode;
        modeCheck.style.marginRight = '8px';
        modeCheck.onchange = (e) => {
            config.danmakuMode = e.target.checked;
            saveConfig();
            updatePanelVisibility(); // パネル内の表示切り替え
        };
        modeLabel.appendChild(modeCheck);
        modeLabel.appendChild(document.createTextNode('弾幕モード (流れるコメント)'));
        modeRow.appendChild(modeLabel);


        // --- A. 弾幕用設定グループ ---
        const groupDanmaku = document.createElement('div');

        // A-1. 弾幕サイズ
        const dSizeRow = createRow('弾幕サイズ (行数調整)', true);
        const dSizeDisplay = createValDisplay(` ${config.danmakuSize}px`);
        const updateDSize = (delta) => {
            config.danmakuSize = Math.max(12, Math.min(100, config.danmakuSize + delta));
            dSizeDisplay.textContent = ` ${config.danmakuSize}px`;
            saveConfig();
        };
        dSizeRow.appendChild(createControlBtn('小', () => updateDSize(-2)));
        dSizeRow.appendChild(dSizeDisplay);
        dSizeRow.appendChild(createControlBtn('大', () => updateDSize(2)));
        groupDanmaku.appendChild(dSizeRow);

        // A-2. 弾幕透明度
        const dOpacityRow = createRow('弾幕透明度', true);
        const dOpacityDisplay = createValDisplay(` ${Math.round(config.danmakuOpacity * 100)}%`);
        const updateDOpacity = (delta) => {
            config.danmakuOpacity = Math.max(0.1, Math.min(1, Math.round((config.danmakuOpacity + delta) * 10) / 10));
            dOpacityDisplay.textContent = ` ${Math.round(config.danmakuOpacity * 100)}%`;
            saveConfig();
        };
        dOpacityRow.appendChild(createControlBtn('薄', () => updateDOpacity(-0.1)));
        dOpacityRow.appendChild(dOpacityDisplay);
        dOpacityRow.appendChild(createControlBtn('濃', () => updateDOpacity(0.1)));
        groupDanmaku.appendChild(dOpacityRow);


        // --- B. 通常モード用設定グループ ---
        const groupNormal = document.createElement('div');

        // B-1. 横幅
        const widthRow = createRow('右カラム幅', true);
        const widthDisplay = createValDisplay(` ${config.width}%`);
        const updateWidth = (delta) => {
            config.width = Math.max(1, Math.min(95, config.width + delta));
            widthDisplay.textContent = ` ${config.width}%`;
            saveConfig();
        };
        widthRow.appendChild(createControlBtn('－', () => updateWidth(-1)));
        widthRow.appendChild(widthDisplay);
        widthRow.appendChild(createControlBtn('＋', () => updateWidth(1)));
        groupNormal.appendChild(widthRow);

        // B-2. 背景透明度
        const opacityRow = createRow('背景透明度', true);
        const opacityDisplay = createValDisplay(` ${Math.round(config.bgOpacity * 100)}%`);
        const updateOpacity = (delta) => {
            config.bgOpacity = Math.max(0, Math.min(1, Math.round((config.bgOpacity + delta) * 10) / 10));
            opacityDisplay.textContent = ` ${Math.round(config.bgOpacity * 100)}%`;
            saveConfig();
        };
        opacityRow.appendChild(createControlBtn('－', () => updateOpacity(-0.1)));
        opacityRow.appendChild(opacityDisplay);
        opacityRow.appendChild(createControlBtn('＋', () => updateOpacity(0.1)));
        groupNormal.appendChild(opacityRow);


        // --- C. 共通設定（タイトル色） ---
        const commonDiv = document.createElement('div');
        commonDiv.style.cssText = 'border-top:1px solid #555; padding-top:10px; margin-top:5px;';
        const colorRow = createRow('タイトル文字色');
        const colors = [{name:'銀',v:'#c0c0c0'}, {name:'灰',v:'#808080'}, {name:'黒',v:'#333333'}, {name:'標準',v:''}];
        colors.forEach(c => {
            const cBtn = document.createElement('button');
            cBtn.textContent = c.name;
            cBtn.style.cssText = 'padding:3px 8px; margin-right:4px; font-size:11px; cursor:pointer; background:#444; color:white; border:1px solid #666; border-radius:3px;';
            cBtn.onclick = () => { config.titleColor = c.v; saveConfig(); };
            colorRow.appendChild(cBtn);
        });
        commonDiv.appendChild(colorRow);


        // パネルの表示制御（モードによって設定項目を出し分ける）
        function updatePanelVisibility() {
            if (config.danmakuMode) {
                groupDanmaku.style.display = 'block';
                groupNormal.style.display = 'none';
            } else {
                groupDanmaku.style.display = 'none';
                groupNormal.style.display = 'block';
            }
        }

        gearBtn.onclick = (e) => { e.stopPropagation(); panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
        document.addEventListener('click', () => { panel.style.display = 'none'; });
        panel.onclick = (e) => e.stopPropagation();

        panel.appendChild(modeRow);
        panel.appendChild(groupDanmaku);
        panel.appendChild(groupNormal);
        panel.appendChild(commonDiv);
        wrapper.appendChild(gearBtn);
        wrapper.appendChild(panel);
        headerRight.prepend(wrapper);

        updatePanelVisibility();
        applyStyles();
    }

    const observer = new MutationObserver(() => {
        applyStyles();
        if (document.getElementById('headerRight') && !document.getElementById('znut-settings-wrapper')) {
            initUI();
        }
        if (config.danmakuMode && !commentObserver) {
            startCommentObserver();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    initUI();
})();