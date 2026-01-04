// ==UserScript==
// @name         SD WebUI: Config PresetsのUIを移動
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Config PresetsのUIを生成設定の上部に移動します
// @author       Feldschlacht
// @match        http://127.0.0.1:7860/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559694/SD%20WebUI%3A%20Config%20Presets%E3%81%AEUI%E3%82%92%E7%A7%BB%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/559694/SD%20WebUI%3A%20Config%20Presets%E3%81%AEUI%E3%82%92%E7%A7%BB%E5%8B%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetConfigs = [
        {
            id: 'txt2img',
            presetId: 'config_preset_wrapper_txt2img',
            seedRowId: 'txt2img_seed_row'
        },
        {
            id: 'img2img',
            presetId: 'config_preset_wrapper_img2img',
            seedRowId: 'img2img_seed_row'
        }
    ];

    function applyFineTuning(config) {
        const configPresetsUI = document.getElementById(config.presetId);
        const targetElement = document.getElementById(config.seedRowId);

        if (!configPresetsUI || !targetElement || configPresetsUI.dataset.moved === 'true') {
            return;
        }

        try {
            // 1. 移動処理
            targetElement.after(configPresetsUI);
            configPresetsUI.dataset.moved = 'true';

            const parentContainer = targetElement.parentElement;
            if (parentContainer) {
                parentContainer.style.display = 'flex';
                parentContainer.style.flexDirection = 'row';
                parentContainer.style.alignItems = 'stretch';
                parentContainer.style.columnGap = '16px';
            }

            // 2. Seed値側の調整
            targetElement.style.flex = '1 1 0%';
            targetElement.style.gap = '8px';

            // 3. Config Presets側の調整
            configPresetsUI.style.flex = '1 1 0%';
            configPresetsUI.style.border = 'none';
            configPresetsUI.style.margin = '0px';
            configPresetsUI.style.padding = '0px';

            const dropdownRow = configPresetsUI.querySelector('[id*="config_preset_dropdown_row"]');
            if (dropdownRow) {
                dropdownRow.style.gap = '8px';
            }

            // 4. ラベルの余白調整
            const allLabels = configPresetsUI.querySelectorAll('[data-testid="block-info"]');
            const seedLabels = targetElement.querySelectorAll('[data-testid="block-info"]');
            [...allLabels, ...seedLabels].forEach(label => {
                label.style.marginBottom = '0px';
            });

            console.log(`✅ Config Presets UI の移動完了。監視を終了しました……`);
        } catch (e) {
            console.error('Config Presets UIを移動する際にエラーが発生しました:', e);
        }
    }

    let timeout = null;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            targetConfigs.forEach(config => applyFineTuning(config));
        }, 300);
    });

    const container = document.getElementById('tab_txt2img')?.parentElement || document.body;
    observer.observe(container, { childList: true, subtree: true });

    setTimeout(() => {
        targetConfigs.forEach(config => applyFineTuning(config));
    }, 1000);
})();