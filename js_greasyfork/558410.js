// ==UserScript==
// @name         WARDROBE
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Гардероб, позволяющий примерить костюмы перед покупкой во вкладке кролей.
// @author       RESSOR
// @match        http*://*.catwar.net/rabbit*
// @match        http*://*.catwar.su/rabbit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558410/WARDROBE.user.js
// @updateURL https://update.greasyfork.org/scripts/558410/WARDROBE.meta.js
// ==/UserScript==

/* global Sortable */

let DEFAULT_MODEL_URL = '';
let layerCounter = 0;
let pendingModelUrl = null;
let pendingCostumeUrl = null;

let currentSearchStartID = 1;
const ITEMS_PER_PAGE = 40;

const PRIMARY_COLOR = '#cccccc';
const ACCENT_COLOR = '#4a90e2';
const BG_COLOR_DARK = '#262626';
const BG_COLOR_MID = '#333333';
const BG_COLOR_LIGHT = '#1e1e1e';
const BORDER_COLOR = '#444444';
const BUTTON_GRAY = '#646464';
const BUTTON_ACCENT_GRAY = '#555555';

const buttonStyle = (bgColor, fontWeight = 'normal', width = '100%') => `
    width: ${width};
    padding: 5px;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    background-color: ${bgColor};
    font-weight: ${fontWeight};
`;

const inputStyle = `
    width: 90%;
    padding: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
    border: 1px solid #555555;
    background-color: ${BG_COLOR_LIGHT};
    color: #f0f0f0;
    border-radius: 3px;
    font-size: 10px;
    -moz-appearance: textfield;
    appearance: textfield;
`;

const nameDisplayStyle = `font-size: 10px; color: #aaaaaa; margin: 0 0 5px 0; height: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
const loaderContainerStyle = `margin-top: 5px; padding: 5px 5px 5px 7px; background-color: ${BG_COLOR_MID}; border-radius: 4px; width: 180px; order: 4; margin-bottom: 10px;`;
const loaderHeaderStyle = `display: flex; justify-content: space-between; align-items: center; cursor: pointer;`;
const searchButtonStyle = (padding = '5px 5px', width = 'auto') => `
    ${buttonStyle(BUTTON_GRAY, 'normal', width)}
    padding: ${padding};
    line-height: 1;
    font-size: 10px;
`;

function updateLayerOrder() {
    const layers = document.getElementById('try-on-controller-panel')?.querySelectorAll('.costume-controller');
    if (!layers) return;
    let baseZIndex = 1000;
    layers.forEach((controller, i) => {
        const layerId = controller.getAttribute('data-layer-id');
        const costumeImage = document.getElementById(layerId);
        if (costumeImage) {
            costumeImage.style.zIndex = baseZIndex + (layers.length - i) * 10;
        }
    });
}

function removeLayer(layerId) {
    document.getElementById(layerId)?.remove();
    document.querySelector(`.costume-controller[data-layer-id="${layerId}"]`)?.remove();
    updateLayerOrder();
    const controllerPanel = document.getElementById('try-on-controller-panel');
    if (controllerPanel && controllerPanel.children.length === 0) {
        controllerPanel.innerHTML = '<p style="font-style: italic; color: #aaaaaa;">Нажмите на миниатюру для примерки.</p>';
    }
}

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (!file || (file.type !== 'image/png' && file.type !== 'image/jpeg')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const fileNameDisplayId = type === 'model' ? 'model-file-name-display' : 'costume-file-name-display';
        if (type === 'model') {
            pendingModelUrl = e.target.result;
        } else {
            pendingCostumeUrl = e.target.result;
        }
        document.getElementById(fileNameDisplayId).textContent = `Файл выбран: ${file.name}`;
    };
    reader.readAsDataURL(file);
}

function handleLoad(type) {
    const urlInput = document.getElementById(`${type}-url-input`);
    const pendingUrl = type === 'model' ? pendingModelUrl : pendingCostumeUrl;

    if (pendingUrl) {
        if (type === 'model') {
            changePlayerModel(pendingUrl);
            pendingModelUrl = null;
        } else {
            addCostumeLayer(pendingUrl);
            pendingCostumeUrl = null;
            document.getElementById('costume-file-input').value = '';
            document.getElementById('costume-file-name-display').textContent = 'Файл не выбран';
        }
    } else if (urlInput && urlInput.value) {
        if (type === 'model') {
            changePlayerModel(urlInput.value);
        } else {
            addCostumeLayer(urlInput.value);
            urlInput.value = '';
        }
    }
}

function togglePanel(id) {
    const content = document.getElementById(id + '-content');
    const toggleBtn = document.getElementById(id + '-toggle-btn');
    if (!content || !toggleBtn) return;

    const isVisible = content.style.display !== 'none' && content.style.display !== '';

    content.style.display = isVisible ? 'none' : 'block';
    toggleBtn.textContent = isVisible ? '▶' : '▼';

    if (!isVisible && id === 'costume-search' && document.getElementById('costume-search-thumbnails').children.length === 0) {
        updateCostumeSearchDisplay(1);
    }
}

function createLoaderHTML(type, title, confirmText, restore = false) {
    const loaderId = `${type}-loader`;
    const containerStyle = loaderContainerStyle + (type === 'model' ? 'margin-top: 20px; order: 3;' : '');

    return `
        <div id="${loaderId}-container" style="${containerStyle}">
            <div id="${loaderId}-header" style="${loaderHeaderStyle}">
                <h4 style="font-size: 14px; margin: 0; color: ${PRIMARY_COLOR};">${title}</h4>
                <button id="${loaderId}-toggle-btn" style="background: none; border: none; color: ${PRIMARY_COLOR}; font-size: 14px; cursor: pointer; padding: 0 5px; line-height: 1;">▶</button>
            </div>
            <div id="${loaderId}-content" style="display: none;">
                <input type="text" id="${type}-url-input" placeholder="URL изображения" style="${inputStyle}">
                <div id="${type}-file-name-display" style="${nameDisplayStyle}">Файл не выбран</div>
                <input type="file" id="${type}-file-input" style="display: none;" accept="image/png, image/jpeg">
                <button id="${type}-select-file-btn" style="${buttonStyle(BUTTON_ACCENT_GRAY)} margin-bottom: 5px;">Выбрать файл</button>
                <button id="${type}-confirm-load-btn" style="${buttonStyle(BUTTON_GRAY, 'bold')} margin-bottom: 8px;">${confirmText}</button>
                ${restore ? `<button id="restore-model-btn" style="${buttonStyle(BUTTON_GRAY)}">Вернуть модель</button>` : ''}
            </div>
        </div>
    `;
}

function changePlayerModel(newUrl) {
    const modelImg = document.getElementById('player-model');
    if (!modelImg || !newUrl) return;

    modelImg.src = newUrl;
    document.getElementById('model-url-input').value = '';
    pendingModelUrl = null;
    document.getElementById('model-file-name-display').textContent = 'Файл не выбран';
    document.getElementById('model-file-input').value = '';
}

function addCostumeLayer(costumeUrl) {
    if (!costumeUrl || costumeUrl.includes('/cw3/composited/')) return;
    layerCounter++;
    const layerId = `costume-layer-${layerCounter}`;
    const container = document.querySelector('#try-on-panel-content .try-on-container');
    const controllerPanel = document.getElementById('try-on-controller-panel');
    if (!container || !controllerPanel) return;

    controllerPanel.querySelector('p')?.remove();

    const newLayer = document.createElement('img');
    newLayer.id = layerId;
    newLayer.src = costumeUrl;
    newLayer.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 100;`;
    container.appendChild(newLayer);

    const controller = document.createElement('div');
    controller.className = 'costume-controller';
    controller.setAttribute('data-layer-id', layerId);
    controller.style.cssText = `display: flex; align-items: center; justify-content: space-between; border: 1px solid ${BORDER_COLOR}; border-radius: 4px; padding: 5px; margin-bottom: 5px; background-color: #383838; font-size: 10px; cursor: move;`;

    const costumeID = costumeUrl.match(/costume\/(\d+)\.png/)?.[1] || `Загруженный`;

    controller.innerHTML = `
        <div style="display: flex; align-items: center; flex-grow: 1;">
            <div style="width: 25px; height: 25px; background-image: url('${costumeUrl}'); background-size: contain; background-repeat: no-repeat; margin-right: 5px; border: 1px solid #666666; border-radius: 3px;"></div>
            <div>
                <span style="font-weight: bold; color: #f0f0f0;">ID: ${costumeID}</span>
            </div>
        </div>
        <div style="margin-left: 10px;">
            <button class="remove-layer-btn" data-layer-id="${layerId}" title="Удалить слой" style="background-color: #a00000; color: white; border: none; padding: 3px 5px 0 5px; cursor: pointer; line-height: 1; border-radius: 3px;">✖</button>
        </div>
    `;
    controllerPanel.prepend(controller);

    controller.querySelector('.remove-layer-btn')?.addEventListener('click', (event) => {
        event.stopPropagation();
        removeLayer(layerId);
    });

    updateLayerOrder();
}

function updateCostumeSearchDisplay(startId) {
    const thumbnailsPanel = document.getElementById('costume-search-thumbnails');
    if (!thumbnailsPanel) return;

    thumbnailsPanel.innerHTML = '';
    currentSearchStartID = Math.max(1, startId);

    const THUMB_WIDTH = '100px';
    const THUMB_HEIGHT = '150px';

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        const costumeID = currentSearchStartID + i;
        const costumeUrl = `/cw3/cats/0/costume/${costumeID}.png`;

        const thumbnail = document.createElement('div');
        thumbnail.style.cssText = `
            width: ${THUMB_WIDTH};
            height: ${THUMB_HEIGHT};
            background-image: url('${costumeUrl}');
            background-size: contain;
            background-repeat: no-repeat;
            cursor: pointer;
            border: 1px solid ${BORDER_COLOR};
            border-radius: 3px;
            position: relative;
            background-color: #2a2a2a;
            overflow: hidden;
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 10px;
            text-align: center;
            padding: 2px 0;
            font-weight: bold;
        `;
        overlay.textContent = `${costumeID}`;

        thumbnail.appendChild(overlay);

        const thumbnailClick = () => addCostumeLayer(costumeUrl);
        const mouseEnter = () => { thumbnail.style.borderColor = ACCENT_COLOR; thumbnail.style.backgroundColor = '#383838'; };
        const mouseLeave = () => { thumbnail.style.borderColor = BORDER_COLOR; thumbnail.style.backgroundColor = '#2a2a2a'; };

        thumbnail.addEventListener('click', thumbnailClick);
        thumbnail.addEventListener('mouseenter', mouseEnter);
        thumbnail.addEventListener('mouseleave', mouseLeave);

        thumbnailsPanel.appendChild(thumbnail);
    }

    document.getElementById('current-id-display').textContent =
        `ID: ${currentSearchStartID} - ${currentSearchStartID + ITEMS_PER_PAGE - 1}`;
}

function handleSearchRange() {
    const startInput = document.getElementById('search-start-id-input');

    let rawValue = startInput.value.replace(/\D/g, '');
    let startID = parseInt(rawValue, 10);

    if (isNaN(startID) || rawValue.trim() === '') {
        startID = 1;
    }

    let newStartID = Math.max(1, Math.floor((startID - 1) / ITEMS_PER_PAGE) * ITEMS_PER_PAGE + 1);

    updateCostumeSearchDisplay(newStartID);
}

function navigateSearch(direction) {
    let newStartID = currentSearchStartID + (direction * ITEMS_PER_PAGE);
    updateCostumeSearchDisplay(Math.max(1, newStartID));
}

(function() {

    function loadSortableJS(callback) {
        if (typeof Sortable !== 'undefined') {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initSortable() {
        const controllerPanel = document.getElementById('try-on-controller-panel');
        if (!controllerPanel) return;

        new Sortable(controllerPanel, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: updateLayerOrder,
        });

        const style = document.createElement('style');
        style.textContent = `.sortable-ghost { opacity: 0.5; background-color: #555555; border-radius: 4px; }`;
        document.head.appendChild(style);
    }

    function installTryOnPanel() {
        document.getElementById('try-on-panel')?.remove();
        layerCounter = 0;
        const mainDiv = document.getElementById('main');
        if (!mainDiv) return;

        let initialModelElement = document.querySelector('div[style*="/cw3/composited/"]');
        if (initialModelElement) {
            const urlMatch = window.getComputedStyle(initialModelElement).backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                DEFAULT_MODEL_URL = urlMatch[1];
            }
        }

        const modelLoaderHTML = createLoaderHTML('model', 'Заменить модель', 'ОК', true);
        const costumeLoaderHTML = createLoaderHTML('costume', 'Загрузить костюм', 'Добавить костюм', false);

        const costumeSearchHTML = `
            <div id="costume-search-section" style="
                border-top: 1px solid ${BORDER_COLOR};
                padding-top: 10px;
                margin-top: 15px;
            ">
                <div id="costume-search-header" style="${loaderHeaderStyle}">
                    <h4 style="font-size: 16px; margin: 0; color: ${PRIMARY_COLOR};">ПОИСК КОСТЮМОВ</h4>
                    <button id="costume-search-toggle-btn" style="background: none; border: none; color: ${PRIMARY_COLOR}; font-size: 18px; cursor: pointer; padding: 0 5px; line-height: 1;">▶</button>
                </div>
                <div id="costume-search-content" style="display: none; padding-top: 10px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
                        <span style="margin-right: 10px; font-size: 12px;">Искать от ID:</span>
                        <input type="text" id="search-start-id-input" placeholder="число" style="
                            ${inputStyle}
                            width: 100px;
                            margin: 0 10px 0 0;
                            padding: 4px;
                            &::-webkit-inner-spin-button,
                            &::-webkit-outer-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                            }
                        ">
                        <button id="search-range-btn" style="${searchButtonStyle('4px 8px', 'auto')}">ПОИСК</button>
                    </div>

                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        padding: 5px;
                        background-color: ${BG_COLOR_MID};
                        border-radius: 4px;
                    ">
                        <button id="prev-page-btn" style="${searchButtonStyle('4px 8px', 'auto')}">&#9664; Назад</button>
                        <span id="current-id-display" style="font-size: 12px; font-weight: bold; color: #f0f0f0;">ID: 1 - 40</span>
                        <button id="next-page-btn" style="${searchButtonStyle('4px 8px', 'auto')}">Вперёд &#9654;</button>
                    </div>

                    <div id="costume-search-thumbnails" style="
                        display: grid;
                        grid-template-columns: repeat(8, 1fr);
                        gap: 5px;
                        border: 1px solid ${BG_COLOR_MID};
                        padding: 10px;
                        background: ${BG_COLOR_LIGHT};
                        border-radius: 4px;
                    ">
                    </div>
                </div>
            </div>
        `;

        const panelWrapperHTML = `
            <div id="try-on-panel-wrapper" style="
                border: 1px solid ${BORDER_COLOR};
                border-radius: 8px;
                background-color: ${BG_COLOR_DARK};
                padding: 0 15px 0 15px;
                margin: 20px auto;
                width: 90%;
                max-width: 1000px;
                color: #f0f0f0;
            ">

                <div id="main-panel-header" style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 10px 0;
                    margin-bottom: 0;
                ">
                    <button id="main-panel-toggle-btn" style="
                        background: none;
                        border: none;
                        color: ${PRIMARY_COLOR};
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0 5px;
                        line-height: 1;
                        margin-right: 10px;
                    ">▶</button>
                    <h2 style="font-size: 18px; margin: 0; color: ${PRIMARY_COLOR};">ПРИМЕРКА КОСТЮМОВ</h2>
                </div>
                <div id="try-on-panel-content" style="
                    display: none;
                    flex-direction: column;
                    padding-top: 15px;
                    padding-bottom: 15px;
                ">
                    <div style="display: flex; justify-content: space-around; align-items: flex-start;">
                        <div id="control-column" style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            flex-shrink: 0;
                            margin-right: 30px;
                            text-align: center;
                        ">
                            <h3 style="font-size: 16px; margin: 0; padding: 0; margin-bottom: 25px; color: ${PRIMARY_COLOR}; order: 1;">ПАРАМЕТРЫ ПРИМЕРКИ</h3>
                            <div class="try-on-container" style="position: relative; width: 100px; height: 100px; margin: 5px auto 10px auto; transform: scale(1.5); order: 2;">
                                <img id="player-model"
                                    src="${DEFAULT_MODEL_URL}"
                                    alt="Модель игрока"
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1;"
                                >
                            </div>
                            ${modelLoaderHTML}
                            ${costumeLoaderHTML}
                            <h4 style="font-size: 14px; margin-bottom: 5px; color: ${PRIMARY_COLOR}; order: 5;">Слои костюмов</h4>
                            <div id="try-on-controller-panel" style="
                                width: 180px;
                                max-height: 400px;
                                overflow-y: auto;
                                margin: 2px auto 0 auto;
                                padding: 5px;
                                background-color: ${BG_COLOR_LIGHT};
                                border: 1px solid ${BG_COLOR_MID};
                                border-radius: 4px;
                                order: 6;
                            ">
                                <p style="font-style: italic; color: #aaaaaa;">Нажмите на миниатюру для примерки.</p>
                            </div>
                        </div>
                        <div style="flex-grow: 1;">
                            <h3 style="font-size: 16px; margin: 0 0 10px 0; color: ${PRIMARY_COLOR};">КОСТЮМЫ НА СТРАНИЦЕ</h3>
                            <div id="try-on-thumbnails" style="
                                display: grid;
                                grid-template-columns: repeat(12, 1fr);
                                gap: 3px;
                                border: 1px solid ${BG_COLOR_MID};
                                padding: 10px;
                                background: ${BG_COLOR_LIGHT};
                                border-radius: 4px;
                            ">
                                </div>
                        </div>
                    </div>
                    ${costumeSearchHTML}
                </div>
            </div>
            <hr>
        `;


        mainDiv.insertAdjacentHTML('beforebegin', panelWrapperHTML);

        document.getElementById('model-loader-header')?.addEventListener('click', () => togglePanel('model-loader'));
        document.getElementById('costume-loader-header')?.addEventListener('click', () => togglePanel('costume-loader'));
        document.getElementById('costume-search-header')?.addEventListener('click', () => togglePanel('costume-search'));

        document.getElementById('model-confirm-load-btn')?.addEventListener('click', () => handleLoad('model'));
        document.getElementById('costume-confirm-load-btn')?.addEventListener('click', () => handleLoad('costume'));
        document.getElementById('restore-model-btn')?.addEventListener('click', () => changePlayerModel(DEFAULT_MODEL_URL));

        document.getElementById('search-range-btn')?.addEventListener('click', handleSearchRange);
        document.getElementById('prev-page-btn')?.addEventListener('click', () => navigateSearch(-1));
        document.getElementById('next-page-btn')?.addEventListener('click', () => navigateSearch(1));

        document.getElementById('model-select-file-btn')?.addEventListener('click', () => document.getElementById('model-file-input')?.click());
        document.getElementById('model-file-input')?.addEventListener('change', (e) => handleFileSelect(e, 'model'));

        document.getElementById('costume-select-file-btn')?.addEventListener('click', () => document.getElementById('costume-file-input')?.click());
        document.getElementById('costume-file-input')?.addEventListener('change', (e) => handleFileSelect(e, 'costume'));

        const thumbnailsPanel = document.getElementById('try-on-thumbnails');
        document.querySelectorAll('#main button div[style*="background-image: url"]').forEach(icon => {
            const style = window.getComputedStyle(icon);
            let imageUrl = style.backgroundImage;
            const urlMatch = imageUrl.match(/url\(['"]?(.*?)['"]?\)/);

            if (urlMatch && urlMatch[1] && urlMatch[1].includes('/cw3/cats/')) {
                const costumeUrl = urlMatch[1];
                const thumbnail = document.createElement('div');

                thumbnail.style.cssText = `
                    width: 50px;
                    height: 75px;
                    background-image: url('${costumeUrl}');
                    background-size: contain;
                    background-repeat: no-repeat;
                    cursor: pointer;
                    border: 1px solid ${BORDER_COLOR};
                    border-radius: 3px;
                `;

                const thumbnailClick = () => addCostumeLayer(costumeUrl);
                const mouseEnter = () => { thumbnail.style.borderColor = ACCENT_COLOR; thumbnail.style.backgroundColor = '#383838'; };
                const mouseLeave = () => { thumbnail.style.borderColor = BORDER_COLOR; thumbnail.style.backgroundColor = 'transparent'; };

                thumbnail.addEventListener('click', thumbnailClick);
                thumbnail.addEventListener('mouseenter', mouseEnter);
                thumbnail.addEventListener('mouseleave', mouseLeave);

                thumbnailsPanel.appendChild(thumbnail);
            }
        });

        loadSortableJS(initSortable);

        document.getElementById('main-panel-header')?.addEventListener('click', () => {
            const mainContent = document.getElementById('try-on-panel-content');
            const toggleBtn = document.getElementById('main-panel-toggle-btn');
            const panel = document.getElementById('try-on-panel-wrapper');
            const isVisible = mainContent.style.display !== 'none';

            mainContent.style.display = isVisible ? 'none' : 'flex';
            toggleBtn.textContent = isVisible ? '▶' : '▼';
            panel.style.padding = isVisible ? '0 15px 0 15px' : '0 15px 15px 15px';
        });
    }

    installTryOnPanel();
})();
