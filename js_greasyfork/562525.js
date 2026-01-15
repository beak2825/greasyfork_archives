// ==UserScript==
// @name         Otomatik Gelişim Raporu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tablodaki radio butonları için hızlı seçim butonları ekler
// @author       You
// @match        https://e-okul.meb.gov.tr/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562525/Otomatik%20Geli%C5%9Fim%20Raporu.user.js
// @updateURL https://update.greasyfork.org/scripts/562525/Otomatik%20Geli%C5%9Fim%20Raporu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Kontrol paneli oluştur
    const panel = document.createElement('div');
    panel.id = 'radio-selector-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: Arial, sans-serif;
        min-width: 200px;
    `;

    panel.innerHTML = `
        <div style="color: #ecf0f1; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
            📋 Radio Seçici
        </div>
        <button id="btn-option-2" style="
            width: 100%;
            padding: 10px;
            margin-bottom: 8px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: background 0.3s;
        ">2. Seçenek</button>
        <button id="btn-option-3" style="
            width: 100%;
            padding: 10px;
            margin-bottom: 8px;
            background: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: background 0.3s;
        ">3. Seçenek</button>
        <button id="btn-option-4" style="
            width: 100%;
            padding: 10px;
            margin-bottom: 8px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: background 0.3s;
        ">4. Seçenek</button>
        <button id="btn-close" style="
            width: 100%;
            padding: 8px;
            background: #7f8c8d;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
        ">Kapat</button>
    `;

    document.body.appendChild(panel);

    // Hover efektleri
    const buttons = panel.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });

    // 2. Seçenek butonu
    document.getElementById('btn-option-2').addEventListener('click', function() {
        let count = 0;
        const satirlar = document.querySelectorAll('table.table tbody tr');
        satirlar.forEach(satir => {
            const radios = Array.from(satir.querySelectorAll('input[type=radio]'));
            if (radios.length >= 2) {
                radios[1].click();
                count++;
            }
        });
        showNotification(`✓ ${count} satırda 2. seçenek işaretlendi`, '#3498db');
    });

    // 3. Seçenek butonu
    document.getElementById('btn-option-3').addEventListener('click', function() {
        let count = 0;
        const satirlar = document.querySelectorAll('table.table tbody tr');
        satirlar.forEach(satir => {
            const radios = Array.from(satir.querySelectorAll('input[type=radio]'));
            if (radios.length >= 3) {
                radios[2].click();
                count++;
            }
        });
        showNotification(`✓ ${count} satırda 3. seçenek işaretlendi`, '#2ecc71');
    });

    // 4. Seçenek butonu
    document.getElementById('btn-option-4').addEventListener('click', function() {
        let count = 0;
        const satirlar = document.querySelectorAll('table.table tbody tr');
        satirlar.forEach(satir => {
            const radios = Array.from(satir.querySelectorAll('input[type=radio]'));
            if (radios.length >= 4) {
                radios[3].click();
                count++;
            }
        });
        showNotification(`✓ ${count} satırda 4. seçenek işaretlendi`, '#e74c3c');
    });

    // Kapat butonu
    document.getElementById('btn-close').addEventListener('click', function() {
        panel.style.display = 'none';
    });

    // Bildirim göster
    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-size: 16px;
            font-weight: bold;
            animation: fadeInOut 2s ease-in-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Paneli sürüklenebilir yap
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    panel.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.tagName === 'BUTTON') return;
        initialX = e.clientX - panel.offsetLeft;
        initialY = e.clientY - panel.offsetTop;
        isDragging = true;
        panel.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            panel.style.right = 'auto';
        }
    }

    function dragEnd() {
        isDragging = false;
        panel.style.cursor = 'default';
    }

})();