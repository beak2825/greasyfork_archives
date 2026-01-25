// ==UserScript==
// @name         Torn City Page Saver 
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  PDA-style page saver for Torn City with draggable circle button, double-click to open/close, bold save names, and paint-drop color editor
// @author       Papanad[3928917]
// @license      MAT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563972/Torn%20City%20Page%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/563972/Torn%20City%20Page%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!location.hostname.includes('torn.com')) return;

    const MAX_SAVES = 15;
    const STORAGE_KEY = 'page_saver_saves';
    const POSITION_KEY = 'page_saver_button_pos';
    const VERSION = '2.9';

    let saves = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let btnPos = JSON.parse(localStorage.getItem(POSITION_KEY) || null);

    let buttonColor = '#007bff';

    // Floating circular button
    const btn = document.createElement('div');
    btn.style.position = 'fixed';
    btn.style.width = '50px';
    btn.style.height = '50px';
    btn.style.background = buttonColor;
    btn.style.borderRadius = '50%';
    btn.style.display = 'flex';
    btn.style.justifyContent = 'center';
    btn.style.alignItems = 'center';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
    btn.style.transition = 'all 0.2s';
    btn.title = 'Page Saver';
    btn.innerHTML = '💾';
    document.body.appendChild(btn);

    // Initial position
    if(btnPos){
        btn.style.top = btnPos.top + 'px';
        btn.style.left = btnPos.left + 'px';
    } else {
        btn.style.top = (window.innerHeight / 2 - 25) + 'px';
        btn.style.right = '20px';
    }

    // Dragging variables
    let isDragging = false, startX, startY, origX, origY;
    let clickTimeout;

    btn.addEventListener('mousedown', e => {
        e.preventDefault();
        clickTimeout = setTimeout(() => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = btn.offsetLeft;
            origY = btn.offsetTop;
        }, 200); // start drag after holding 200ms
    });

    document.addEventListener('mousemove', e => {
        if(!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        btn.style.left = origX + dx + 'px';
        btn.style.top = origY + dy + 'px';
    });

    document.addEventListener('mouseup', () => {
        clearTimeout(clickTimeout);
        if(isDragging){
            localStorage.setItem(POSITION_KEY, JSON.stringify({
                top: parseInt(btn.style.top),
                left: parseInt(btn.style.left)
            }));
        }
        isDragging = false;
    });

    // Panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.width = '350px';
    panel.style.maxHeight = '450px';
    panel.style.background = '#111';
    panel.style.border = '1px solid #333';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 2px 15px rgba(0,0,0,0.5)';
    panel.style.padding = '10px';
    panel.style.overflowY = 'auto';
    panel.style.zIndex = '9998';
    panel.style.color = '#fff';
    panel.style.display = 'none';
    document.body.appendChild(panel);

    function renderPanel() {
        panel.innerHTML = '';

        // Header in purple (only version)
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.fontWeight = 'bold';
        header.style.color = 'purple';
        header.style.marginBottom = '10px';
        header.innerHTML = `Page Saver v${VERSION}`;
        panel.appendChild(header);

        // Save current page
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Save Current Page';
        saveBtn.style.width = '100%';
        saveBtn.style.marginBottom = '10px';
        saveBtn.style.padding = '6px';
        saveBtn.style.borderRadius = '5px';
        saveBtn.style.border = 'none';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.background = buttonColor;
        saveBtn.style.color = '#fff';
        saveBtn.onclick = () => {
            if(saves.length >= MAX_SAVES){ alert('Max saves reached (15)'); return; }
            const name = prompt('Name this page:', document.title || 'Untitled');
            if(!name) return;
            saves.push({name, url: window.location.href, bgColor: buttonColor, textColor:'#fff'});
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
            renderPanel();
        };
        panel.appendChild(saveBtn);

        // List saves
        saves.forEach((save,index) => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.marginBottom = '5px';

            // Open same window
            const nameBtn = document.createElement('button');
            nameBtn.textContent = save.name;
            nameBtn.style.flex = '1';
            nameBtn.style.padding = '5px';
            nameBtn.style.marginRight = '5px';
            nameBtn.style.border = 'none';
            nameBtn.style.borderRadius = '5px';
            nameBtn.style.background = save.bgColor;
            nameBtn.style.color = save.textColor;
            nameBtn.style.cursor = 'pointer';
            nameBtn.style.fontWeight = 'bold'; // thicker letters
            nameBtn.onclick = () => window.location.href = save.url;

            // Open new window
            const newWinBtn = document.createElement('button');
            newWinBtn.textContent = '🗔';
            newWinBtn.style.marginRight = '5px';
            newWinBtn.style.border = 'none';
            newWinBtn.style.borderRadius = '5px';
            newWinBtn.style.background = '#555';
            newWinBtn.style.color = '#fff';
            newWinBtn.style.cursor = 'pointer';
            newWinBtn.onclick = () => window.open(save.url,'_blank');

            // Paint drop button 🎨
            const paintBtn = document.createElement('button');
            paintBtn.textContent = '🎨';
            paintBtn.title = 'Change color';
            paintBtn.style.marginRight = '5px';
            paintBtn.style.border = 'none';
            paintBtn.style.borderRadius = '5px';
            paintBtn.style.background = '#666';
            paintBtn.style.color = '#fff';
            paintBtn.style.cursor = 'pointer';
            container.appendChild(nameBtn);
            container.appendChild(newWinBtn);
            container.appendChild(paintBtn);

            // Delete
            const delBtn = document.createElement('button');
            delBtn.textContent = '🗑️';
            delBtn.style.border='none';
            delBtn.style.borderRadius='5px';
            delBtn.style.background='#333';
            delBtn.style.color='#fff';
            delBtn.style.cursor='pointer';
            delBtn.onclick = ()=>{ saves.splice(index,1); localStorage.setItem(STORAGE_KEY,JSON.stringify(saves)); renderPanel(); };
            container.appendChild(delBtn);

            panel.appendChild(container);

            // Paint drop menu
            paintBtn.addEventListener('click', e=>{
                e.stopPropagation();
                const existing = document.querySelector('.paint-picker');
                if(existing) existing.remove();

                const pickerDiv = document.createElement('div');
                pickerDiv.className = 'paint-picker';
                pickerDiv.style.position = 'absolute';
                pickerDiv.style.background = '#222';
                pickerDiv.style.border = '1px solid #555';
                pickerDiv.style.padding = '5px';
                pickerDiv.style.display = 'flex';
                pickerDiv.style.flexDirection = 'column';
                pickerDiv.style.gap = '5px';
                pickerDiv.style.borderRadius = '5px';
                pickerDiv.style.zIndex = '99999';

                const rect = paintBtn.getBoundingClientRect();
                pickerDiv.style.top = (rect.bottom + 5) + 'px';
                pickerDiv.style.left = rect.left + 'px';

                // Box color
                const boxLabel = document.createElement('span');
                boxLabel.textContent = 'Box Color:';
                boxLabel.style.color = '#fff';
                const boxInput = document.createElement('input');
                boxInput.type='color';
                boxInput.value = save.bgColor;
                boxInput.oninput = ()=>{ save.bgColor = boxInput.value; localStorage.setItem(STORAGE_KEY,JSON.stringify(saves)); renderPanel(); pickerDiv.remove(); };
                pickerDiv.appendChild(boxLabel);
                pickerDiv.appendChild(boxInput);

                // Text color
                const textLabel = document.createElement('span');
                textLabel.textContent = 'Text Color:';
                textLabel.style.color = '#fff';
                const textInput = document.createElement('input');
                textInput.type='color';
                textInput.value = save.textColor;
                textInput.oninput = ()=>{ save.textColor = textInput.value; localStorage.setItem(STORAGE_KEY,JSON.stringify(saves)); renderPanel(); pickerDiv.remove(); };
                pickerDiv.appendChild(textLabel);
                pickerDiv.appendChild(textInput);

                document.body.appendChild(pickerDiv);

                const removePicker = e2 => {
                    if(!pickerDiv.contains(e2.target)){
                        pickerDiv.remove();
                        document.removeEventListener('click', removePicker);
                    }
                };
                document.addEventListener('click', removePicker);
            });
        });
    }

    renderPanel();

    // Double-click to toggle panel
    btn.addEventListener('dblclick', ()=>{
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';

        if(panel.style.display==='block'){
            const btnRect = btn.getBoundingClientRect();
            const panelWidth = panel.offsetWidth;
            const panelHeight = panel.offsetHeight;

            let left = btnRect.right + 10;
            let top = btnRect.top;
            if(left + panelWidth > window.innerWidth) left = btnRect.left - panelWidth - 10;
            if(top + panelHeight > window.innerHeight) top = window.innerHeight - panelHeight - 10;

            panel.style.left = left+'px';
            panel.style.top = top+'px';
        }
    });

})();
