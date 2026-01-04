// ==UserScript==
// @name               Microsoft Store Generation Project Shortcut Customizer
// @name:ar            مخصص اختصارات مشروع توليد Microsoft Store
// @name:es            Personalizador de atajos de Microsoft Store Generation Project
// @name:fr            Personnalisateur de raccourcis Microsoft Store Generation Project
// @name:hi            Microsoft Store जनरेशन प्रोजेक्ट शॉर्टकट कस्टमाइज़र
// @name:id            Penyesuai Pintasan Proyek Generasi Microsoft Store
// @name:ja            Microsoft Store Generation Project ショートカット カスタマイザー
// @name:ko            Microsoft Store 생성 프로젝트 바로가기 사용자 정의
// @name:nl            Microsoft Store Generation Project Shortcut Customizer
// @name:pt-BR         Personalizador de atalhos do Microsoft Store Generation Project
// @name:ru            Настройщик ярлыков Microsoft Store Generation Project
// @name:vi            Trình tùy chỉnh phím tắt Microsoft Store Generation Project
// @name:zh-CN         Microsoft Store 链接生成器增强 (快捷标签)
// @name:zh-TW         Microsoft Store 連結產生器增強 (快捷標籤
// @version            1.3.2
// @description        Add custom shortcut tags to store.rg-adguard.net for quick link filling. Modern UI with i18n support.
// @description:ar     إضافة علامات اختصار مخصصة إلى store.rg-adguard.net لتعبئة الروابط بسرعة. واجهة حديثة مع دعم i18n.
// @description:es     Agregue etiquetas de acceso directo personalizadas a store.rg-adguard.net para completar enlaces rápidamente. Interfaz moderna con soporte i18n.
// @description:fr     Ajoutez des balises de raccourci personnalisées à store.rg-adguard.net pour un remplissage rapide des liens. Interface moderne avec support i18n.
// @description:hi     त्वरित लिंक भरने के लिए store.rg-adguard.net पर कस्टम शॉर्टकट टैग जोड़ें। i18n समर्थन के साथ आधुनिक यूआई।
// @description:id     Tambahkan tag pintasan kustom ke store.rg-adguard.net untuk pengisian tautan cepat. UI modern dengan dukungan i18n.
// @description:ja     リンクを素早く入力するために、store.rg-adguard.net にカスタム ショートカット タグを追加します。i18n サポートを備えたモダンな UI。
// @description:ko     빠른 링크 채우기를 위해 store.rg-adguard.net에 사용자 정의 바로가기 태그를 추가합니다. i18n 지원을 갖춘 최신 UI입니다.
// @description:nl     Voeg aangepaste sneltoetstags toe aan store.rg-adguard.net om links snel in te vullen. Moderne gebruikersinterface met i18n-ondersteuning.
// @description:pt-BR  Adicione tags de atalho personalizadas ao store.rg-adguard.net para preenchimento rápido de links. Interface moderna com suporte i18n.
// @description:ru     Добавьте настраиваемые теги ярлыков на store.rg-adguard.net для быстрого заполнения ссылок. Современный интерфейс с поддержкой i18n.
// @description:vi     Thêm thẻ ghi chú phím tắt tùy chỉnh vào store.rg-adguard.net để điền liên kết nhanh chóng. Giao diện hiện đại với hỗ trợ i18n.
// @description:zh-CN  为 store.rg-adguard.net 添加自定义快捷标签，实现链接一键填充。采用现代 UI 界面并支持多语言。
// @description:zh-TW  為 store.rg-adguard.net 添加自定義快捷標籤，實現連結一鍵填充。採用現代 UI 界面並支持多語言。
// @author             Femoon
// @match              https://store.rg-adguard.net/*
// @grant              none
// @license            MIT
// @noframes
// @namespace https://greasyfork.org/users/384092
// @downloadURL https://update.greasyfork.org/scripts/559770/Microsoft%20Store%20Generation%20Project%20Shortcut%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/559770/Microsoft%20Store%20Generation%20Project%20Shortcut%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI 内部多语言配置
    const i18n = {
        en: {
            settingsBtn: "Settings",
            modalTitle: "Link Shortcuts",
            tableThName: "Name",
            tableThValue: "URL / Value",
            tableThOp: "Action",
            addRow: "+ Add Row",
            saveBtn: "Save Changes",
            placeholderName: "Name",
            placeholderValue: "URL",
            langSwitch: "中文",
            delBtn: "Remove"
        },
        zh: {
            settingsBtn: "配置快捷标签",
            modalTitle: "快捷链接管理",
            tableThName: "名称",
            tableThValue: "链接地址",
            tableThOp: "操作",
            addRow: "+ 新增行",
            saveBtn: "保存配置",
            placeholderName: "名称",
            placeholderValue: "URL地址",
            langSwitch: "English",
            delBtn: "删除"
        }
    };

    let currentLang = localStorage.getItem('tm_lang') || 'en';
    let configData = JSON.parse(localStorage.getItem('tm_store_config') || '[]');

    const t = (key) => i18n[currentLang][key];

    // CSS 样式：强化非衬线字体，微调阴影与缩放
    const style = document.createElement('style');
    style.innerHTML = `
        #tm-settings-trigger, #tm-modal, #tm-tag-container, .tm-modern-btn {
            font-family: "Segoe UI", "Inter", "Roboto", "Helvetica Neue", "Arial", -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased;
        }

        :root {
            --primary-color: #0078d4;
            --btn-bg: rgba(255, 255, 255, 0.12);
            --panel-bg: rgba(255, 255, 255, 0.98);
            --subtle-shadow: 0 2px 5px rgba(0,0,0,0.1);
            --hover-shadow: 0 4px 8px rgba(0,0,0,0.15);
            --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tm-modern-btn {
            background: var(--btn-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: white;
            padding: 7px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: var(--transition);
            box-shadow: var(--subtle-shadow);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 0.1px;
        }

        .tm-modern-btn:hover {
            background: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-1px) scale(1.02);
            box-shadow: var(--hover-shadow);
        }

        .tm-modern-btn:active {
            transform: translateY(0) scale(0.98);
        }

        #tm-settings-trigger {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        }

        #tm-tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
        }

        #tm-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
            background: var(--panel-bg);
            border-radius: 16px;
            padding: 24px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            color: #222;
        }

        #tm-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        #tm-modal h3 { margin: 0; font-weight: 600; font-size: 17px; color: #111; }

        #tm-modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
            backdrop-filter: blur(2px);
        }

        .tm-panel-btn {
            background: #f4f4f4;
            color: #444;
            border: 1px solid #ddd;
            box-shadow: none;
        }
        .tm-panel-btn:hover { background: #eee; border-color: #ccc; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }

        .tm-save-btn { background: var(--primary-color); color: white; border: none; }

        .tm-input {
            width: 90%;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            outline: none;
            font-family: inherit;
            font-size: 13px;
        }
        .tm-input:focus { border-color: var(--primary-color); }

        .tm-table { width: 100%; border-collapse: collapse; }
        .tm-table th { text-align: left; padding: 10px 5px; border-bottom: 1px solid #eee; font-size: 11px; color: #999; text-transform: uppercase; }
        .tm-table td { padding: 8px 0; border-bottom: 1px solid #f8f8f8; }
    `;
    document.head.appendChild(style);

    function initUI() {
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'tm-settings-trigger';
        settingsBtn.className = 'tm-modern-btn';
        document.body.appendChild(settingsBtn);

        const overlay = document.createElement('div');
        overlay.id = 'tm-modal-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'tm-modal';
        document.body.appendChild(modal);

        // 注入标签容器
        const mainInput = document.getElementById('url') || document.querySelector('input[type="text"]');
        if (mainInput) {
            const container = mainInput.closest('.input-group') || mainInput.parentElement;
            const tagBox = document.createElement('div');
            tagBox.id = 'tm-tag-container';
            container.parentNode.insertBefore(tagBox, container);
        }

        updateText();

        settingsBtn.onclick = () => { modal.style.display = 'block'; overlay.style.display = 'block'; renderTable(); };
        overlay.onclick = () => { modal.style.display = 'none'; overlay.style.display = 'none'; };
    }

    function updateText() {
        document.getElementById('tm-settings-trigger').innerText = t('settingsBtn');
        document.getElementById('tm-modal').innerHTML = `
            <div id="tm-modal-header">
                <h3>${t('modalTitle')}</h3>
                <button id="tm-lang-switch" class="tm-modern-btn tm-panel-btn" style="padding: 2px 8px; font-size: 11px;">${t('langSwitch')}</button>
            </div>
            <div style="max-height: 280px; overflow-y: auto;">
                <table class="tm-table">
                    <thead>
                        <tr><th>${t('tableThName')}</th><th>${t('tableThValue')}</th><th style="width:50px"></th></tr>
                    </thead>
                    <tbody id="tm-table-body"></tbody>
                </table>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="tm-add-row" class="tm-modern-btn tm-panel-btn">${t('addRow')}</button>
                <button id="tm-save-config" class="tm-modern-btn tm-save-btn">${t('saveBtn')}</button>
            </div>
        `;

        document.getElementById('tm-lang-switch').onclick = () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            localStorage.setItem('tm_lang', currentLang);
            updateText();
            renderTable();
        };
        document.getElementById('tm-add-row').onclick = addRow;
        document.getElementById('tm-save-config').onclick = () => {
            saveConfig();
            document.getElementById('tm-modal').style.display = 'none';
            document.getElementById('tm-modal-overlay').style.display = 'none';
        };
        renderTags();
    }

    function renderTable() {
        const tbody = document.getElementById('tm-table-body');
        tbody.innerHTML = '';
        configData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input class="tm-input name-input" value="${item.name}"></td>
                <td><input class="tm-input value-input" value="${item.value}"></td>
                <td><button class="tm-modern-btn tm-panel-btn" style="color:#d33; padding:4px 8px; font-size:11px;" onclick="this.parentElement.parentElement.remove()">✕</button></td>
            `;
            tbody.appendChild(row);
        });
        if(configData.length === 0) addRow();
    }

    function addRow() {
        const tbody = document.getElementById('tm-table-body');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input class="tm-input name-input" placeholder="${t('placeholderName')}"></td>
            <td><input class="tm-input value-input" placeholder="${t('placeholderValue')}"></td>
            <td><button class="tm-modern-btn tm-panel-btn" style="color:#d33; padding:4px 8px; font-size:11px;" onclick="this.parentElement.parentElement.remove()">✕</button></td>
        `;
        tbody.appendChild(row);
    }

    function saveConfig() {
        const rows = document.querySelectorAll('#tm-table-body tr');
        const newData = [];
        rows.forEach(row => {
            const name = row.querySelector('.name-input').value.trim();
            const value = row.querySelector('.value-input').value.trim();
            if (name && value) newData.push({ name, value });
        });
        configData = newData;
        localStorage.setItem('tm_store_config', JSON.stringify(configData));
        renderTags();
    }

    function renderTags() {
        const container = document.getElementById('tm-tag-container');
        if (!container) return;
        container.innerHTML = '';
        configData.forEach(item => {
            const tag = document.createElement('button');
            tag.className = 'tm-modern-btn';
            tag.innerText = item.name;
            tag.onclick = () => {
                const mainInput = document.getElementById('url') || document.querySelector('input[type="text"]');
                if (mainInput) {
                    mainInput.value = item.value;
                    mainInput.dispatchEvent(new Event('input', { bubbles: true }));
                    mainInput.focus();
                }
            };
            container.appendChild(tag);
        });
    }

    if (document.readyState === 'complete') initUI();
    else window.addEventListener('load', initUI);

})();