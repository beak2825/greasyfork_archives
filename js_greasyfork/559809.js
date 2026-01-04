// ==UserScript==
// @name         SD WebUI: ネガティブプロンプト欄を折り畳み
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ネガティブプロンプト入力欄を折り畳み式にし、入力検知で自動展開します。
// @author       Feldschlacht
// @match        http://127.0.0.1:7860/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559809/SD%20WebUI%3A%20%E3%83%8D%E3%82%AC%E3%83%86%E3%82%A3%E3%83%96%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E6%AC%84%E3%82%92%E6%8A%98%E3%82%8A%E7%95%B3%E3%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/559809/SD%20WebUI%3A%20%E3%83%8D%E3%82%AC%E3%83%86%E3%82%A3%E3%83%96%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E6%AC%84%E3%82%92%E6%8A%98%E3%82%8A%E7%95%B3%E3%81%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyLayoutStyles(prefix) {
        const tabDiv = document.querySelector(`#tab_${prefix} > div`);
        if (tabDiv) tabDiv.style.gap = '8px';
    }

    function setupTab(prefix) {
        const negRow = document.getElementById(`${prefix}_neg_prompt_row`);
        const negTextarea = negRow ? negRow.querySelector('textarea') : null;
        const promptRow = document.getElementById(`${prefix}_prompt`);
        const tokenCounter = document.getElementById(`${prefix}_negative_token_counter`);
        const btnId = `toggle_neg_btn_${prefix}`;

        if (!negRow || !negTextarea || !promptRow || document.getElementById(btnId)) return;

        applyLayoutStyles(prefix);

        // トグルボタンの作成
        const toggleBtn = document.createElement('div');
        toggleBtn.id = btnId;
        toggleBtn.innerHTML = `
            <span>▼</span>&nbsp;Negative prompt
        `;
        toggleBtn.style = `
            position: absolute;
            right: 8px;
            bottom: 8px;
            z-index: 100;
            cursor: pointer;
            padding: 2px 10px;
            background: var(--input-background-fill);
            border: 1px solid var(--border-color-primary);
            border-radius: 8px;
            font-size: 11px;
            color: var(--body-text-color-subdued);
            user-select: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
        `;
        promptRow.style.position = 'relative';
        promptRow.appendChild(toggleBtn);

        const updateVisibility = (forceOpen = false) => {
            const hasContent = negTextarea.value.trim().length > 0;
            const shouldOpen = forceOpen || hasContent;

            if (shouldOpen) {
                negRow.style.display = 'block';
                toggleBtn.querySelector('span').innerText = '▲';
            } else {
                negRow.style.display = 'none';
                toggleBtn.querySelector('span').innerText = '▼';
            }
        };

        updateVisibility();

        toggleBtn.onclick = (e) => {
            const isHidden = negRow.style.display === 'none';
            updateVisibility(isHidden);
        };

        let lastValue = negTextarea.value;
        setInterval(() => {
            if (negTextarea.value !== lastValue) {
                lastValue = negTextarea.value;
                if (lastValue.trim() !== "") {
                    updateVisibility(true);
                }
            }
            applyLayoutStyles(prefix);
        }, 500);
    }

    const checkExist = setInterval(() => {
        const txt2imgLoaded = document.getElementById('txt2img_neg_prompt_row');
        const img2imgLoaded = document.getElementById('img2img_neg_prompt_row');

        if (txt2imgLoaded) setupTab('txt2img');
        if (img2imgLoaded) setupTab('img2img');

        // 両方のタブにボタンが設置されたら監視を終了（または拡張機能の性質上、継続しても負荷は軽微です）
        if (document.getElementById('toggle_neg_btn_txt2img') && document.getElementById('toggle_neg_btn_img2img')) {
            clearInterval(checkExist);
        }
    }, 1000);
})();