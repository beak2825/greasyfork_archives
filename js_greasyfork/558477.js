// ==UserScript==
// @name         劍橋雙解/有道詞典快速連結Dual Dictionary Quick Link (Trusted Types Fix)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Double click: Show icons + Audio. Gear for shortcuts. Safe for Gemini/Google (Trusted Types compliant).
// @author       Gemini
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      dict.youdao.com
// @downloadURL https://update.greasyfork.org/scripts/558477/%E5%8A%8D%E6%A9%8B%E9%9B%99%E8%A7%A3%E6%9C%89%E9%81%93%E8%A9%9E%E5%85%B8%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90Dual%20Dictionary%20Quick%20Link%20%28Trusted%20Types%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558477/%E5%8A%8D%E6%A9%8B%E9%9B%99%E8%A7%A3%E6%9C%89%E9%81%93%E8%A9%9E%E5%85%B8%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90Dual%20Dictionary%20Quick%20Link%20%28Trusted%20Types%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONTAINER_ID = 'dual-dict-quick-link-container';
    const SETTINGS_ID = 'dual-dict-settings-panel';
    const CAMBRIDGE_ICON_URL = 'https://www.google.com/s2/favicons?domain=dictionary.cambridge.org&sz=64';
    const YOUDAO_ICON_URL = 'https://www.google.com/s2/favicons?domain=youdao.com&sz=64';

    const DEFAULT_CONFIG = {
        youdaoKey: 'ctrl',
        cambridgeKey: 'alt'
    };

    function getConfig() {
        return GM_getValue('config', DEFAULT_CONFIG);
    }

    function saveConfig(newConfig) {
        GM_setValue('config', newConfig);
    }

    function checkShortcut(event, keySetting) {
        if (keySetting === 'ctrl') return event.ctrlKey;
        if (keySetting === 'alt') return event.altKey;
        if (keySetting === 'shift') return event.shiftKey;
        return false;
    }

    function removeElementById(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function removeContainer() {
        removeElementById(CONTAINER_ID);
    }

    // --- 核心修復：使用 SVG Namespace 建立圖示，不使用 innerHTML ---
    function createGearIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        Object.assign(svg.style, { width: '14px', height: '14px', verticalAlign: 'middle' });

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "3");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z");

        svg.appendChild(circle);
        svg.appendChild(path);
        return svg;
    }

    // --- 核心修復：使用 DOM API 建立設定面板，不使用 innerHTML ---
    function showSettingsPanel() {
        removeElementById(SETTINGS_ID);
        const config = getConfig();

        const panel = document.createElement('div');
        panel.id = SETTINGS_ID;
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: '2147483647',
            fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333',
            border: '1px solid #ccc', minWidth: '250px'
        });

        // 標題
        const title = document.createElement('h3');
        title.innerText = 'Shortcut Settings';
        Object.assign(title.style, { margin: '0 0 15px 0', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' });
        panel.appendChild(title);

        // 輔助函式：建立下拉選單區塊
        const createOptionGroup = (labelText, selectId, value) => {
            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            
            const label = document.createElement('label');
            label.innerText = labelText;
            Object.assign(label.style, { display: 'block', marginBottom: '4px', fontWeight: 'bold' });
            
            const select = document.createElement('select');
            select.id = selectId;
            select.style.width = '100%';
            select.style.padding = '4px';

            const options = [
                { val: 'ctrl', text: 'Ctrl + Double Click' },
                { val: 'alt', text: 'Alt + Double Click' },
                { val: 'shift', text: 'Shift + Double Click' },
                { val: 'none', text: 'Disable Shortcut' }
            ];

            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.val;
                option.innerText = opt.text;
                if (opt.val === value) option.selected = true;
                select.appendChild(option);
            });

            div.appendChild(label);
            div.appendChild(select);
            return div;
        };

        panel.appendChild(createOptionGroup('Youdao (New Tab):', 'youdao-key-select', config.youdaoKey));
        panel.appendChild(createOptionGroup('Cambridge (New Tab):', 'cambridge-key-select', config.cambridgeKey));

        // 按鈕區
        const btnGroup = document.createElement('div');
        btnGroup.style.textAlign = 'right';

        const btnCancel = document.createElement('button');
        btnCancel.innerText = 'Cancel';
        Object.assign(btnCancel.style, { marginRight: '8px', padding: '5px 10px', cursor: 'pointer', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' });
        btnCancel.onclick = () => removeElementById(SETTINGS_ID);

        const btnSave = document.createElement('button');
        btnSave.innerText = 'Save';
        Object.assign(btnSave.style, { padding: '5px 15px', cursor: 'pointer', background: '#1d2a57', color: 'white', border: 'none', borderRadius: '4px' });
        btnSave.onclick = () => {
            const newConfig = {
                youdaoKey: document.getElementById('youdao-key-select').value,
                cambridgeKey: document.getElementById('cambridge-key-select').value
            };
            saveConfig(newConfig);
            removeElementById(SETTINGS_ID);
            // 這裡不使用 alert，因為某些網站也會阻擋
            console.log('Settings Saved');
        };

        btnGroup.appendChild(btnCancel);
        btnGroup.appendChild(btnSave);
        panel.appendChild(btnGroup);

        document.body.appendChild(panel);
    }

    function playAudio(word, type) {
        const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: audioUrl,
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    const blobUrl = URL.createObjectURL(response.response);
                    const audio = new Audio(blobUrl);
                    audio.play().catch(err => console.error('Audio play error:', err));
                    audio.onended = () => URL.revokeObjectURL(blobUrl);
                }
            },
            onerror: function(err) { console.error("GM_xmlhttpRequest error:", err); }
        });
    }

    function openUrl(url) {
        window.open(url, '_blank', 'noreferrer');
    }

    document.addEventListener('scroll', function() {
        removeContainer();
    }, true);

    document.addEventListener('mousedown', function(e) {
        const container = document.getElementById(CONTAINER_ID);
        const settingsPanel = document.getElementById(SETTINGS_ID);
        
        if ((container && container.contains(e.target)) || (settingsPanel && settingsPanel.contains(e.target))) {
            return;
        }
        removeContainer();
    });

    document.addEventListener('dblclick', function(e) {
        const selection = window.getSelection();
        let selectedText = selection.toString().trim();

        if (selectedText && /^[a-zA-Z-]+$/.test(selectedText)) {

            const config = getConfig();
            const youdaoUrl = `https://www.youdao.com/result?word=${selectedText}&lang=en`;
            const cambridgeUrl = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${selectedText}`;

            if (checkShortcut(e, config.youdaoKey)) {
                openUrl(youdaoUrl);
                return;
            }
            if (checkShortcut(e, config.cambridgeKey)) {
                openUrl(cambridgeUrl);
                return;
            }

            removeContainer();

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                return;
            }

            const container = document.createElement('div');
            container.id = CONTAINER_ID;
            
            Object.assign(container.style, {
                position: 'fixed', 
                left: `${rect.left}px`,
                top: `${rect.bottom + 5}px`,
                zIndex: '2147483647',
                backgroundColor: '#fff',
                padding: '2px',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontFamily: 'Arial, sans-serif',
                border: '1px solid #d0d0d0',
                whiteSpace: 'nowrap'
            });

            if (rect.bottom + 40 > window.innerHeight) {
                container.style.top = `${rect.top - 30}px`;
            }

            const createIconLink = (url, iconSrc, title) => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noreferrer noopener';
                link.style.display = 'flex';
                link.title = title;
                const img = document.createElement('img');
                img.src = iconSrc;
                Object.assign(img.style, { width: '20px', height: '20px', borderRadius: '3px', display: 'block', marginRight: '1px' });
                link.appendChild(img);
                return link;
            };

            const createBtn = (text, type) => {
                const btn = document.createElement('div');
                btn.innerText = text;
                Object.assign(btn.style, {
                    cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', color: '#000',
                    backgroundColor: '#fff', padding: '0px 3px', borderRadius: '3px',
                    border: '1px solid #ccc', marginLeft: '1px', lineHeight: '16px', userSelect: 'none'
                });
                btn.onmouseenter = () => { btn.style.backgroundColor = '#f0f0f0'; };
                btn.onmouseleave = () => { btn.style.backgroundColor = '#fff'; };
                btn.onclick = (evt) => { evt.stopPropagation(); playAudio(selectedText, type); };
                return btn;
            };

            const createGearBtn = () => {
                const btn = document.createElement('div');
                // --- 關鍵修改：不使用 innerHTML，改用 appendChild ---
                btn.appendChild(createGearIcon());
                
                Object.assign(btn.style, {
                    cursor: 'pointer', color: '#888', padding: '0px 2px',
                    marginLeft: '3px', display: 'flex', alignItems: 'center'
                });
                btn.title = 'Settings (Shortcuts)';
                btn.onclick = (evt) => {
                    evt.stopPropagation();
                    removeContainer();
                    showSettingsPanel();
                };
                btn.onmouseenter = () => { btn.style.color = '#333'; };
                btn.onmouseleave = () => { btn.style.color = '#888'; };
                return btn;
            };

            const linkYoudao = createIconLink(youdaoUrl, YOUDAO_ICON_URL, 'Open in Youdao Dictionary');
            const linkCambridge = createIconLink(cambridgeUrl, CAMBRIDGE_ICON_URL, 'Open in Cambridge Dictionary');
            const btnUS = createBtn('US', 2);
            const btnUK = createBtn('UK', 1);
            const btnGear = createGearBtn();

            container.appendChild(linkYoudao);
            container.appendChild(linkCambridge);
            container.appendChild(btnUS);
            container.appendChild(btnUK);
            container.appendChild(btnGear);

            document.body.appendChild(container);
        }
    });
})();