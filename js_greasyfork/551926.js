// 作成：2025-10-08
// 更新：0000-00-00
// ==UserScript==
// @name         Gmail区切り線
// @namespace    zibunnyou
// @version      1.0
// @description  Gmailで返信メールごとに区切り線入れるだけ
// @author       suguru imamura
// @match        https://mail.google.com/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/551926/Gmail%E5%8C%BA%E5%88%87%E3%82%8A%E7%B7%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/551926/Gmail%E5%8C%BA%E5%88%87%E3%82%8A%E7%B7%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isEnabled = true; // 区切り線ON/OFF状態

    const borderTypes = [
        { name: '実線', style: 'solid' },
        { name: '点線', style: 'dashed' },
        { name: '二重線', style: 'double' }
    ];

    const colorRows = [
        ['#FF4500', '#1E90FF', '#32CD32'], // 赤,青,緑
        ['#FFA500', '#FFFFFF', '#000000'] // 橙,白,黒
    ];

    const thicknessList = [
        { name: '細', value: 1 },
        { name: '標準', value: 3 },
        { name: '太', value: 5 },
        { name: '極太', value: 8 }
    ];

    let currentBorder = 0;
    let currentColor = '#FF4500';
    let currentThickness = 1;

    function createControl() {
        if (document.getElementById('gm-line-control')) return;

        const container = document.createElement('div');
        container.id = 'gm-line-control';
        container.style.position = 'fixed';
        container.style.zIndex = '9999';
        container.style.width = 'auto';
        container.style.userSelect = 'none';
        container.style.top = `${GM_getValue('panelTop', 100)}px`;
        container.style.left = `${GM_getValue('panelLeft', window.innerWidth - 140)}px`;

        // 横線⚙ボタン
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '横線⚙';
        toggleBtn.style.padding = '6px';
        toggleBtn.style.backgroundColor = '#333';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.fontSize = '14px';
        toggleBtn.style.cursor = 'grab';
        toggleBtn.style.position = 'relative';
        container.appendChild(toggleBtn);

        // パネル
        const panel = document.createElement('div');
        panel.id = 'gm-line-panel';
        panel.style.display = 'none';
        panel.style.position = 'absolute';
        panel.style.top = '40px';
        panel.style.flexDirection = 'column';
        panel.style.backgroundColor = '#333';
        panel.style.color = '#fff';
        panel.style.padding = '8px';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
        panel.style.gap = '6px';
        panel.style.width = '100px';
        container.appendChild(panel);

        // ON/OFFボタン作成
        const toggleLineBtn = document.createElement('button');
        toggleLineBtn.textContent = 'ON';
        toggleLineBtn.style.backgroundColor = 'green';
        toggleLineBtn.style.color = 'white';
        toggleLineBtn.style.border = '1px solid #333';
        toggleLineBtn.style.padding = '5px 10px';
        toggleLineBtn.style.borderRadius = '6px';
        toggleLineBtn.style.cursor = 'pointer';

        toggleLineBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isEnabled = !isEnabled;
            if (isEnabled) {
                toggleLineBtn.textContent = 'ON';
                toggleLineBtn.style.backgroundColor = 'green';
                toggleLineBtn.style.color = 'white';
                insertLines(); // 区切り線適用
            } else {
                toggleLineBtn.textContent = 'OFF';
                toggleLineBtn.style.backgroundColor = 'gray';
                toggleLineBtn.style.color = 'black';
                refreshLines(); // 区切り線削除
            }
        });


        // 線種類ボタン
        const borderBtn = document.createElement('button');
        borderBtn.textContent = '線種類: ' + borderTypes[currentBorder].name;
        stylePanelButton(borderBtn);
        borderBtn.addEventListener('click', () => {
            currentBorder = (currentBorder + 1) % borderTypes.length;
            borderBtn.textContent = '線種類: ' + borderTypes[currentBorder].name;
            refreshLines();
        });

        // 太さボタン
        const thickBtn = document.createElement('button');
        thickBtn.textContent = '線太さ: ' + thicknessList[currentThickness].name;
        stylePanelButton(thickBtn);
        thickBtn.addEventListener('click', () => {
            currentThickness = (currentThickness + 1) % thicknessList.length;
            thickBtn.textContent = '線太さ: ' + thicknessList[currentThickness].name;
            refreshLines();
        });

        // 色選択ボタン
        const colorBtn = document.createElement('button');
        colorBtn.textContent = `色: ${currentColor}`;
        stylePanelButton(colorBtn);
        colorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorPanel.style.display = colorPanel.style.display === 'flex' ? 'none' : 'flex';
        });

        // カラー選択パネル
        const colorPanel = document.createElement('div');
        colorPanel.style.display = 'none';
        colorPanel.style.flexDirection = 'column';
        colorPanel.style.backgroundColor = '#222';
        colorPanel.style.padding = '4px';
        colorPanel.style.borderRadius = '4px';
        colorPanel.style.gap = '4px';

        colorRows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.gap = '4px';
            row.forEach(c => {
                const btn = document.createElement('div');
                btn.style.width = '32px';
                btn.style.height = '32px';
                btn.style.backgroundColor = c;
                btn.style.cursor = 'pointer';
                btn.style.border = (currentColor === c) ? '2px solid #fff' : '1px solid #555';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentColor = c;
                    colorBtn.textContent = `色: ${c}`;
                    refreshLines();
                    updateBorders(colorPanel);
                });
                rowDiv.appendChild(btn);
            });
            colorPanel.appendChild(rowDiv);
        });

        // カスタムカラー
        const customDiv = document.createElement('div');
        const customBtn = document.createElement('button');
        customBtn.textContent = 'custom';
        customBtn.style.width = '100%';
        customBtn.style.height = '32px';
        customBtn.style.cursor = 'pointer';
        customBtn.style.borderRadius = '4px';
        customBtn.style.border = '1px solid #555';
        customBtn.style.backgroundColor = '#888';
        customBtn.style.color = '#fff';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.display = 'none';
        colorInput.addEventListener('input', (e) => {
            currentColor = e.target.value;
            colorBtn.textContent = `色: ${currentColor}`;
            refreshLines();
        });

        customBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorInput.click();
        });

        customDiv.appendChild(customBtn);
        customDiv.appendChild(colorInput);
        colorPanel.appendChild(customDiv);

        panel.appendChild(borderBtn);
        panel.appendChild(thickBtn);
        panel.appendChild(colorBtn);
        panel.appendChild(colorPanel);
        panel.appendChild(toggleLineBtn);

        document.body.appendChild(container);

        // ドラッグ制御（画面外不可＋位置保存）
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        toggleBtn.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            isDragging = true;
            dragOffset = { x: e.clientX - container.offsetLeft, y: e.clientY - container.offsetTop };
            toggleBtn.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            let newLeft = e.clientX - dragOffset.x;
            let newTop = e.clientY - dragOffset.y;
            const rect = container.getBoundingClientRect();
            const maxLeft = window.innerWidth - rect.width;
            const maxTop = window.innerHeight - rect.height;
            newLeft = Math.min(Math.max(0, newLeft), maxLeft);
            newTop = Math.min(Math.max(0, newTop), maxTop);
            container.style.left = `${newLeft}px`;
            container.style.top = `${newTop}px`;
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;
            toggleBtn.style.cursor = 'grab';
            GM_setValue('panelTop', parseInt(container.style.top, 10));
            GM_setValue('panelLeft', parseInt(container.style.left, 10));
        });

toggleBtn.addEventListener('click', e => {
    if (isDragging) { e.stopImmediatePropagation(); e.preventDefault(); return; }

    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
        colorPanel.style.display = 'none';
        return;
    }

    panel.style.display = 'flex';
    colorPanel.style.display = 'none';

    // パネルの左右展開判定
    const panelWidth = panel.offsetWidth;
    const rect = toggleBtn.getBoundingClientRect();
    if (rect.left >= panelWidth + 10) {
        // ボタンが画面右寄りの場合、パネルを右に展開
        panel.style.left = 'auto';
        panel.style.right = '0px';
    } else {
        // それ以外は左に展開
        panel.style.left = '0px';
        panel.style.right = 'auto';
    }
});


        document.addEventListener('click', e => {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                panel.style.display = 'none';
                colorPanel.style.display = 'none';
            }
        });
    }

    function stylePanelButton(btn) {
        btn.style.cursor = 'pointer';
        btn.style.padding = '4px';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#555';
        btn.style.color = '#fff';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';
    }

    function updateBorders(panel) {
        panel.querySelectorAll('div > div').forEach(div => {
            if (div.style.backgroundColor) {
                div.style.border = (div.style.backgroundColor === currentColor)
                    ? '2px solid #fff'
                    : '1px solid #555';
            }
        });
    }

    function refreshLines() {
        document.querySelectorAll('hr.gm-line').forEach(hr => hr.remove());
        document.querySelectorAll('div.gm-line-processed').forEach(div => div.classList.remove('gm-line-processed'));
        insertLines();
    }

    function insertLines() {
        if (!isEnabled) return; // OFFなら何もしない
        const dateLines = document.querySelectorAll('div[dir="ltr"]:not(.gm-line-processed)');
        dateLines.forEach(div => {
            const text = div.innerText;
            if (/^\d{4}年\d{1,2}月\d{1,2}日.*?:/.test(text)) {
                const hr = document.createElement('hr');
                hr.style.borderTop = `${thicknessList[currentThickness].value}px ${borderTypes[currentBorder].style} ${currentColor}`;
                hr.style.margin = '10px 0';
                hr.style.borderRadius = '2px';
                hr.classList.add('gm-line');
                div.parentNode.insertBefore(hr, div);
                div.classList.add('gm-line-processed');
            }
        });
    }

    const observer = new MutationObserver(() => {
        insertLines();
        createControl();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();