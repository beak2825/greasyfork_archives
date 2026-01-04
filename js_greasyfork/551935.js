// ==UserScript==
// @name         網頁電影史詩感特效 Pro (圖形化調色面板)
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  為網頁添加可自訂材質、智慧隱藏黑邊、以及圖形化即時調色面板的終極電影特效。
// @author       AI Assistant
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/551935/%E7%B6%B2%E9%A0%81%E9%9B%BB%E5%BD%B1%E5%8F%B2%E8%A9%A9%E6%84%9F%E7%89%B9%E6%95%88%20Pro%20%28%E5%9C%96%E5%BD%A2%E5%8C%96%E8%AA%BF%E8%89%B2%E9%9D%A2%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551935/%E7%B6%B2%E9%A0%81%E9%9B%BB%E5%BD%B1%E5%8F%B2%E8%A9%A9%E6%84%9F%E7%89%B9%E6%95%88%20Pro%20%28%E5%9C%96%E5%BD%A2%E5%8C%96%E8%AA%BF%E8%89%B2%E9%9D%A2%E6%9D%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全域設定與狀態 ---
    const BAR_HEIGHT_VH = 8;
    let isEffectEnabled = GM_getValue('cinematicEffectEnabled', true);
    let currentTexture = GM_getValue('cinematicTexture', 'metal');

    // 預設濾鏡數值 (給滑桿用的 0-200 範圍，更直覺)
    const defaultFilters = {
        sepia: 25,      // 0-100 -> 0-1.0
        contrast: 110,  // 0-200 -> 0-2.0
        saturate: 110,  // 0-200 -> 0-2.0
        brightness: 98, // 0-200 -> 0-2.0
        hue: 0          // 0-360 -> 0-360deg
    };
    let currentFilters = GM_getValue('colorFilters', { ...defaultFilters });


    // --- 風格設定 (CSS) ---
    // 這裡只放靜態的 CSS。動態的 filter 會由 JS 直接控制
    const staticCSS = `
        /* 黑邊基礎樣式 */
        .cinematic-bar { position: fixed; left: 0; width: 100%; z-index: 999999; pointer-events: none; opacity: 0; transition: opacity 0.4s ease-in-out; height: ${BAR_HEIGHT_VH}vh; background-color: #111; }
        .cinematic-top-bar { top: 0; }
        .cinematic-bottom-bar { bottom: 0; }
        .cinematic-bar.active { opacity: 1; }
        .cinematic-bar.mouse-hover-hide { opacity: 0 !important; }

        /* 材質選項 */
        .texture-metal { background: linear-gradient(to bottom, #222 0%, #111 50%, #222 100%), linear-gradient(to right, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.1) 100%); }
        .texture-carbon { background-color: #1a1a1a; background-image: linear-gradient(45deg, #2b2b2b 25%, transparent 25%, transparent 75%, #2b2b2b 75%, #2b2b2b), linear-gradient(-45deg, #2b2b2b 25%, transparent 25%, transparent 75%, #2b2b2b 75%, #2b2b2b); background-size: 10px 10px; }
        .texture-noise { background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjam5vaXNlKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg=='), linear-gradient(to bottom, #252525, #111); }
        .texture-gradient { background: linear-gradient(to bottom, #333, #111 70%, #000); box-shadow: 0 0 20px rgba(0,0,0,0.6); }

        /* 暗角 & 膠片顆粒 */
        .cinematic-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999998; pointer-events: none; opacity: 0; transition: opacity 0.5s ease; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%); }
        .cinematic-overlay.active { opacity: 1; }
        .cinematic-overlay::after { content: ""; position: absolute; top: -100%; left: -100%; width: 300%; height: 300%; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABTSURBVFhH7c5BDQAwEASh+je9N3gBLgHCFwY4fpmZ9x7gCZ988sknn3zyySeffPLJJ5988sknn3zyySeffPLJJ5988sknn3zyySeffPLJJ5988smnf0g2BwFksyQEtgAAAABJRU5ErkJggg=='); opacity: 0.06; animation: grain 0.4s steps(1) infinite; }
        @keyframes grain { 0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); } 20% { transform: translate(-15%, 5%); } 30% { transform: translate(7%, -25%); } 40% { transform: translate(-5%, 25%); } 50% { transform: translate(-15%, 10%); } 60% { transform: translate(15%, 0%); } 70% { transform: translate(0%, 15%); } 80% { transform: translate(3%, 35%); } 90% { transform: translate(-10%, 10%); } }

        /* --- 設定面板 UI 樣式 --- */
        .cinematic-settings-panel {
            position: fixed;
            bottom: calc(${BAR_HEIGHT_VH}vh + 20px); /* 剛好在下黑邊的上方 */
            right: 20px;
            z-index: 10000000;
            background: rgba(20, 20, 20, 0.9);
            backdrop-filter: blur(10px);
            color: #eee;
            padding: 15px 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            width: 300px;
            transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
            transform: translateX(0);
        }
        .cinematic-settings-panel.hidden {
            transform: translateX(calc(100% + 40px));
            opacity: 0;
            pointer-events: none;
        }
        .cinematic-settings-panel h3 { margin: 0 0 15px; font-size: 16px; font-weight: 600; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
        .cinematic-settings-panel .control-group { display: flex; align-items: center; margin-bottom: 10px; }
        .cinematic-settings-panel label { flex: 0 0 80px; font-size: 13px; }
        .cinematic-settings-panel input[type="range"] { flex-grow: 1; margin: 0 10px; -webkit-appearance: none; background: transparent; }
        .cinematic-settings-panel input[type="range"]::-webkit-slider-runnable-track { height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; }
        .cinematic-settings-panel input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; margin-top: -6px; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
        .cinematic-settings-panel .value-display { font-size: 13px; font-variant-numeric: tabular-nums; width: 35px; text-align: right; }
        .cinematic-settings-panel .panel-buttons { display: flex; justify-content: space-between; margin-top: 15px; }
        .cinematic-settings-panel button { background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s; font-size: 12px; }
        .cinematic-settings-panel button:hover { background: rgba(255,255,255,0.2); }
    `;
    GM_addStyle(staticCSS);
    // 建立一個專門用來放動態 filter 的 style 標籤
    const filterStyleElement = document.createElement('style');
    filterStyleElement.id = 'cinematic-filter-style';
    document.head.appendChild(filterStyleElement);

    // --- 創建 HTML 元素 ---
    const topBar = document.createElement('div');
    topBar.className = 'cinematic-bar cinematic-top-bar';
    const bottomBar = document.createElement('div');
    bottomBar.className = 'cinematic-bar cinematic-bottom-bar';
    const overlay = document.createElement('div');
    overlay.className = 'cinematic-overlay';
    document.documentElement.appendChild(topBar);
    document.documentElement.appendChild(bottomBar);
    document.documentElement.appendChild(overlay);

    // --- 創建設定面板 UI ---
    const panel = document.createElement('div');
    panel.className = 'cinematic-settings-panel hidden'; // 預設隱藏
    let panelHTML = '<h3>色彩調整面板</h3>';
    const sliders = {
        sepia: { label: '復古色調', min: 0, max: 100, step: 1, unit: '%' },
        contrast: { label: '對比度', min: 0, max: 200, step: 1, unit: '%' },
        saturate: { label: '飽和度', min: 0, max: 200, step: 1, unit: '%' },
        brightness: { label: '亮度', min: 0, max: 200, step: 1, unit: '%' },
        hue: { label: '色相', min: 0, max: 360, step: 1, unit: 'deg' }
    };
    for (const key in sliders) {
        panelHTML += `
            <div class="control-group">
                <label for="cinematic_${key}">${sliders[key].label}</label>
                <input type="range" id="cinematic_${key}" min="${sliders[key].min}" max="${sliders[key].max}" step="${sliders[key].step}" value="${currentFilters[key]}">
                <span class="value-display" id="value_${key}">${currentFilters[key]}${sliders[key].unit === 'deg' ? '°' : '%'}</span>
            </div>
        `;
    }
    panelHTML += `
        <div class="panel-buttons">
            <button id="reset_filters">重設為預設值</button>
            <button id="close_panel">關閉</button>
        </div>
    `;
    panel.innerHTML = panelHTML;
    document.body.appendChild(panel);

    // --- 功能函式 ---
    function updateFilterStyle() {
        const f = currentFilters;
        const filterString = `sepia(${f.sepia / 100}) contrast(${f.contrast}%) saturate(${f.saturate}%) brightness(${f.brightness}%) hue-rotate(${f.hue}deg)`;
        const cssRule = `body.cinematic-effect-active { filter: ${filterString}; }`;
        filterStyleElement.textContent = cssRule;
    }

    function setEffectState(enabled) {
        if (enabled) {
            document.body.classList.add('cinematic-effect-active');
            topBar.classList.add('active'); bottomBar.classList.add('active'); overlay.classList.add('active');
        } else {
            document.body.classList.remove('cinematic-effect-active');
            topBar.classList.remove('active'); bottomBar.classList.remove('active'); overlay.classList.remove('active');
            topBar.classList.remove('mouse-hover-hide'); bottomBar.classList.remove('mouse-hover-hide');
            panel.classList.add('hidden'); // 關閉特效時也隱藏面板
        }
        GM_setValue('cinematicEffectEnabled', enabled);
        isEffectEnabled = enabled;
        updateMenu();
    }

    const textureClasses = ['texture-metal', 'texture-carbon', 'texture-noise', 'texture-gradient'];
    function applyTexture(textureName) {
        topBar.classList.remove(...textureClasses); bottomBar.classList.remove(...textureClasses);
        topBar.classList.add(`texture-${textureName}`); bottomBar.classList.add(`texture-${textureName}`);
        GM_setValue('cinematicTexture', textureName); currentTexture = textureName;
        updateMenu();
    }

    // --- 事件監聽 ---
    // 滑鼠偵測
    document.addEventListener('mousemove', (e) => {
        if (!isEffectEnabled) return;
        const mouseY = e.clientY;
        const windowHeight = window.innerHeight;
        const barPixelHeight = windowHeight * (BAR_HEIGHT_VH / 100);
        topBar.classList.toggle('mouse-hover-hide', mouseY < barPixelHeight);
        bottomBar.classList.toggle('mouse-hover-hide', mouseY > windowHeight - barPixelHeight);
    });

    // 面板滑桿事件
    for (const key in sliders) {
        const sliderElement = document.getElementById(`cinematic_${key}`);
        const valueDisplay = document.getElementById(`value_${key}`);
        sliderElement.addEventListener('input', () => {
            const newValue = sliderElement.value;
            currentFilters[key] = Number(newValue);
            valueDisplay.textContent = `${newValue}${sliders[key].unit === 'deg' ? '°' : '%'}`;
            updateFilterStyle();
            GM_setValue('colorFilters', currentFilters);
        });
    }

    // 面板按鈕事件
    document.getElementById('reset_filters').addEventListener('click', () => {
        currentFilters = { ...defaultFilters };
        for (const key in sliders) {
            document.getElementById(`cinematic_${key}`).value = currentFilters[key];
            document.getElementById(`value_${key}`).textContent = `${currentFilters[key]}${sliders[key].unit === 'deg' ? '°' : '%'}`;
        }
        updateFilterStyle();
        GM_setValue('colorFilters', currentFilters);
    });
    document.getElementById('close_panel').addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    // --- 油猴選單控制 ---
    let menuCommandIds = [];
    function updateMenu() {
        menuCommandIds.forEach(id => GM_unregisterMenuCommand(id));
        menuCommandIds = [];

        menuCommandIds.push(GM_registerMenuCommand(
            `${isEffectEnabled ? '✅' : '❌'} 切換電影模式`,
            () => setEffectState(!isEffectEnabled)
        ));

        // 新增打開面板的選項
        menuCommandIds.push(GM_registerMenuCommand('⚙️ 開啟色彩調整面板', () => {
            if (isEffectEnabled) {
                panel.classList.toggle('hidden');
            } else {
                alert('請先啟用電影模式！');
            }
        }));

        menuCommandIds.push(GM_registerMenuCommand('--- 材質設定 ---', () => {})); // 分隔線

        const textureOptions = { metal: '金屬髮絲紋', carbon: '碳纖維', noise: '細緻皮革', gradient: '柔和光影' };
        for (const key in textureOptions) {
            menuCommandIds.push(GM_registerMenuCommand(
                `${currentTexture === key ? '◉' : '○'} ${textureOptions[key]}`,
                () => applyTexture(key)
            ));
        }
    }

    // --- 初始化 ---
    requestAnimationFrame(() => {
        setEffectState(isEffectEnabled);
        applyTexture(currentTexture);
        updateFilterStyle(); // 初始載入儲存的濾鏡
        updateMenu();
    });

})();