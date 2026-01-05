// ==UserScript==
// @name         识典古籍辅助输入
// @namespace    http://tampermonkey.net/
// @version      2025-12-07
// @description  辅助输入
// @author       Leon406
// @match        https://edit.shidianguji.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shidianguji.com
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/558374/%E8%AF%86%E5%85%B8%E5%8F%A4%E7%B1%8D%E8%BE%85%E5%8A%A9%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/558374/%E8%AF%86%E5%85%B8%E5%8F%A4%E7%B1%8D%E8%BE%85%E5%8A%A9%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
    style.innerHTML = '#highlight-options-container{position:fixed;top:-4px;right:-15px;width:29%;min-width:260px;max-height:80%;background-color:#f0f0f0;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);z-index:9999;display:flex;flex-direction:column;resize:both;overflow:hidden;font-family:\'Segoe UI\',Tahoma,Geneva,Verdana,sans-serif;user-select:none}#highlight-options-header{padding:8px 12px;background-color:#e0e0e0;border-bottom:1px solid #ccc;cursor:grab;font-weight:bold;display:flex;justify-content:space-between;align-items:center;gap:10px}#highlight-options-header:active{cursor:grabbing}#highlight-header-title{white-space:nowrap;cursor:pointer}#highlight-header-controls{display:flex;gap:5px;align-items:center;flex-grow:1;justify-content:flex-end}#highlight-options-content{flex-grow:1;padding:10px;display:flex;flex-wrap:wrap;gap:8px;overflow-y:auto;align-content:flex-start}.highlight-option-item{padding:6px 10px;background-color:#ffffff;border:1px solid #ddd;border-radius:4px;cursor:pointer;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:background-color .2s,transform .1s}.highlight-option-item:hover{background-color:#e9e9e9}.highlight-option-item:active{transform:translateY(1px)}#highlight-add-input{flex-grow:1;padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:13px;min-width:80px}#highlight-add-button{padding:4px 10px;background-color:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;transition:background-color .2s;font-size:13px;white-space:nowrap}#highlight-add-button:hover{background-color:#0056b3}#highlight-add-button:active{transform:translateY(1px)}';
    document.head.appendChild(style);
    const container = document.createElement('div');
    container.id = 'highlight-options-container';
    document.body.appendChild(container);
    const header = document.createElement('div');
    header.id = 'highlight-options-header';
    container.appendChild(header);
    const headerTitle = document.createElement('span');
    headerTitle.id = 'highlight-header-title';
    headerTitle.textContent = '选项';
    header.appendChild(headerTitle);
    const headerControls = document.createElement('div');
    headerControls.id = 'highlight-header-controls';
    header.appendChild(headerControls);
    const addInput = document.createElement('input');
    addInput.id = 'highlight-add-input';
    addInput.type = 'text';
    addInput.placeholder = '新增选项内容';
    headerControls.appendChild(addInput);
    const addButton = document.createElement('button');
    addButton.id = 'highlight-add-button';
    addButton.textContent = '添加';
    headerControls.appendChild(addButton);
    const content = document.createElement('div');
    content.id = 'highlight-options-content';
    container.appendChild(content);
    let options = JSON.parse(localStorage.getItem('highlightOptions') || '[]');

    function renderOptions() {
        content.innerHTML = '';
        options.forEach(optionText => {
            const item = document.createElement('div');
            item.className = 'highlight-option-item';
            item.textContent = optionText;

            item.onclick = async() => {
                let input = document.querySelector("div > span[contenteditable]")
                input.focus();
                input.textContent = optionText
                input.classList.remove("jXK3eC5z")
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);

                try {
                    await navigator.clipboard.writeText(optionText);
                    console.log('Copied to clipboard:', optionText)
                } catch (err) {
                    console.error('Failed to copy:', err)
                }
            };
            item.oncontextmenu = e => {
                e.preventDefault();
                options = options.filter(opt => opt !== optionText);
                saveOptions();
                renderOptions()
            };
            content.appendChild(item)
        })
    };
    function saveOptions() {
        localStorage.setItem('highlightOptions', JSON.stringify(options))
    };
    function addOption() {
        const newOption = addInput.value.trim();
        if (newOption) {
            const characters = Array.from(newOption);
            let changed = false;
            characters.forEach(char => {
                if (!options.includes(char)) {
                    options.push(char);
                    changed = true
                }
            });
            if (changed) {
                saveOptions();
                renderOptions()
            }
            addInput.value = ''
        }
    };
    addButton.addEventListener('click', addOption);
    addInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            addOption()
        }
    });
    let clickTimer = null;
    headerTitle.addEventListener('click', e => {
        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                options = JSON.parse(localStorage.getItem('highlightOptions') || '[]');
                renderOptions();
                clickTimer = null
            }, 300)
        } else {
            clearTimeout(clickTimer);
            options = [];
            saveOptions();
            renderOptions();
            clickTimer = null
        }
    });
    let isDragging = false;
    let offsetX,
    offsetY;
    header.addEventListener('mousedown', e => {
        if (e.target === header || e.target === headerTitle) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none'
        }
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging)
            return;
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        document.body.style.userSelect = ''
    });
    renderOptions()
})();
