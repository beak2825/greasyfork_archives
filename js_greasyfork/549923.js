// ==UserScript==
// @name         蝶云科技抖音直播数据助手
// @namespace    http://tampermonkey.net/
// @version      0.9.9
// @description  为蝶云直播设计的浏览器助手。方便大家统计直播数据，快速复制数据，完成数据填报。
// @author       左立方
// @homepageURL  https://cbm.im/
// @match        *://*.douyin.com/*
// @match        *://*.ynjdy.com:*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549923/%E8%9D%B6%E4%BA%91%E7%A7%91%E6%8A%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549923/%E8%9D%B6%E4%BA%91%E7%A7%91%E6%8A%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- MINI JQUERY: 内置一个轻量级的jQuery替代品 ---
    const $ = (selectorOrElement) => {
        const self = {
            element: selectorOrElement,
            closest(selector) { if (!this.element || !this.element.closest) return null; return $(this.element.closest(selector)); },
            find(selector) { if (!this.element || !this.element.querySelector) return null; return $(this.element.querySelector(selector)); },
            get length() { return this.element ? 1 : 0; },
            data(key) { return this.element && this.element.dataset ? this.element.dataset[key] : undefined; },
            attr(attribute) { return this.element && this.element.getAttribute ? this.element.getAttribute(attribute) : undefined; }
        };
        return self;
    };

    // --- CONFIG: 常量与配置 ---
    const CONFIG = {
        reviewPageURL: 'https://anchor.douyin.com/anchor/review',
        crmHostIdentifier: '.ynjdy.com:8888', // 用于判断CRM页面的核心特征
        svgIcon: 'data:image/svg+xml;base64,' + btoa(`<svg t="1757661749109" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 0m184.32 0l655.36 0q184.32 0 184.32 184.32l0 655.36q0 184.32-184.32 184.32l-655.36 0q-184.32 0-184.32-184.32l0-655.36q0-184.32 184.32-184.32Z" fill="#111111"></path><path d="M204.27776 670.59712a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V134.35904h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z" fill="#FF4040"></path><path d="M164.92544 631.23456a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V94.99648h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z" fill="#00F5FF"></path><path d="M410.91072 427.58144c-158.8224 20.15232-284.44672 222.72-154.112 405.00224 120.40192 98.47808 373.68832 41.20576 380.70272-171.85792l-0.17408-324.1472a280.7296 280.7296 0 0 0 142.88896 38.62528V261.2224a144.98816 144.98816 0 0 1-72.8064-54.82496 135.23968 135.23968 0 0 1-54.70208-72.45824h-123.66848l-0.08192 561.41824c-0.11264 78.46912-130.9696 106.41408-164.18816 30.2592-83.18976-39.77216-64.37888-190.9248 46.31552-192.57344z" fill="#FFFFFF"></path></svg>`),
    };

    const STATE = {
        isOnReviewPage: window.location.href.startsWith(CONFIG.reviewPageURL),
        isOnCrmPage: window.location.host.includes(CONFIG.crmHostIdentifier),
        isOnDouyinDomain: window.location.hostname.endsWith('douyin.com'),
        currentData: [],
    };

    const UI = {
        widgetWrapper: null, mainIcon: null, panel: null,
        init() { this.createWidget(); if (STATE.isOnReviewPage || STATE.isOnCrmPage) { this.createPanel(); } },
        createWidget() { this.widgetWrapper = document.createElement('div'); this.widgetWrapper.id = 'dk-widget-wrapper'; this.mainIcon = document.createElement('div'); this.mainIcon.id = 'dk-main-icon'; this.mainIcon.style.backgroundImage = `url("${CONFIG.svgIcon}")`; this.widgetWrapper.appendChild(this.mainIcon); document.body.appendChild(this.widgetWrapper); },
        createPanel() { const panelHTML = `<div id="dk-data-panel"><div id="dk-data-panel-header"><span class="header-title">直播数据助手</span><div class="header-buttons"><span id="dk-data-panel-refresh" title="刷新"></span><span id="dk-data-panel-close" title="关闭"></span></div></div><div id="dk-data-panel-content"></div><div id="dk-data-panel-footer"><button id="dk-copy-all-btn" class="dk-footer-btn">复制全部数据</button></div></div>`; document.body.insertAdjacentHTML('beforeend', panelHTML); this.panel = document.getElementById('dk-data-panel'); }
    };

    const Core = {
        processDuration: (text) => {
            if (!text) return '0.0';
            const hourMatch = text.match(/(\d+)\s*小时/); const minMatch = text.match(/(\d+)\s*分钟/); const secMatch = text.match(/(\d+)\s*秒/);
            const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0; const minutes = minMatch ? parseInt(minMatch[1], 10) : 0; const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;
            if (hours === 0 && minutes === 0 && seconds === 0) return '0.0';
            return ((hours * 60) + minutes + (seconds / 60)).toFixed(1);
        },
        processPercentage: (text) => text ? text.replace('%', '').trim() : '0',
        dataPaths: [ { label: '直播主题', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div/div/div[1]' }, { label: '直播日期', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div/div/div[2]/div[1]/span[2]', process: (text) => text ? text.split(' ')[0] : '未找到' }, { label: '直播时长', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div/div/div[2]/div[3]/span[2]', process: (text) => Core.processDuration(text) }, { label: '观看人数', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[2]/div[2]/div[2]/div[2]/div/div' }, { label: '平均在线', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[2]/div[2]/div[4]/div[2]/div/div' }, { label: '最高在线', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[2]/div[2]/div[5]/div[2]/div/div' }, { label: '平均停留时长', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[1]' }, { label: '点赞数', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div[2]/div[3]/div[2]/div/div' }, { label: '评论数', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div[2]/div[2]/div[2]/div/div' }, { label: '分享转发数', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div[2]/div[5]/div[2]/div/div' }, { label: '新增粉丝数', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div[2]/div[4]/div[2]/div/div' }, { label: '流量-关注', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[2]/div[2]', process: (text) => Core.processPercentage(text) }, { label: '流量-推荐', xpath: '/html/body/div[1]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div[2]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div/div/div/div/table/tbody/tr[2]/td[2]/div', process: (text) => Core.processPercentage(text) } ],
        getValueByXpath: (xpath, defaultValue = '未找到') => { try { const e = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; return e ? e.textContent.trim() : defaultValue; } catch (e) { return defaultValue; } },
        refreshData() { if (STATE.isOnReviewPage) { STATE.currentData = Core.dataPaths.map(item => { const rawValue = Core.getValueByXpath(item.xpath); const processedValue = item.process ? item.process(rawValue) : rawValue; return { label: item.label, value: processedValue }; }); GM_setValue('dyLiveData', JSON.stringify(STATE.currentData)); } else { STATE.currentData = JSON.parse(GM_getValue('dyLiveData', '[]')); } Core.renderPanel(STATE.currentData); },
        renderPanel(data) { const contentDiv = document.getElementById('dk-data-panel-content'); if (!contentDiv) return; contentDiv.innerHTML = ''; data.forEach(item => { const rowHTML = `<div class="dk-data-row"><span class="dk-data-label">${item.label}</span><div class="dk-data-value-wrapper"><span class="dk-data-value">${item.value}</span><button class="dk-copy-btn" data-value="${item.value}">复制</button></div></div>`; contentDiv.insertAdjacentHTML('beforeend', rowHTML); }); contentDiv.querySelectorAll('.dk-copy-btn').forEach(btn => { btn.addEventListener('click', (e) => { e.stopPropagation(); GM_setClipboard(btn.dataset.value, 'text'); btn.textContent = '已复制!'; setTimeout(() => { btn.textContent = '复制'; }, 1500); }); }); },
    };

    const SmartTooltip = {
        tooltip: null, activeInput: null, dataMap: null, isSecondaryVisible: GM_getValue('tooltipFolded', false),
        fieldIdentifierMap: { 'FNOTE,0': '直播主题', 'FDATE': '直播日期', 'FBCZXZB,1': '直播时长', 'FBCZXZB,2': '观看人数', 'FBCZXZB,4': '平均在线', 'FBCZXZB,5': '最高在线', 'FBCZXZB,6': '平均停留时长', 'FBCZXZB,7': '点赞数', 'FBCZXZB,8': '评论数', 'FBCZXZB,9': '分享转发数', 'FBCZXZB,10': '新增粉丝数', 'FBCZXZB,17': '流量-关注', 'FBCZXZB,18': '流量-推荐' },
        isActive: false,
        init(toggleInput) { this.toggleInput = toggleInput; this.dataMap = new Map(JSON.parse(GM_getValue('dyLiveData', '[]')).map(i => [i.label, i.value])); document.addEventListener('focusin', this.handleFocusIn.bind(this)); document.addEventListener('click', (e) => { if (this.tooltip && this.tooltip.classList.contains('visible') && !this.tooltip.contains(e.target) && e.target !== this.activeInput) { this.hide(); } }, true); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.hide(); }); },
        activate() { this.isActive = true; this.toggleInput.checked = true; }, deactivate() { this.isActive = false; this.toggleInput.checked = false; this.hide(); },
        handleFocusIn(e) { if (this.isActive && e.target.matches('input.k-input, textarea.k-input')) { this.show(e.target); } },
        identifyField(inputElement) { const $input = $(inputElement); const $editorContainer = $input.closest('div[data-field]'); if ($editorContainer.length > 0) { const field = $editorContainer.data('field'); const rowid = $editorContainer.data('rowid'); const key = rowid !== undefined ? `${field},${rowid}` : field; if (this.fieldIdentifierMap[key]) return this.fieldIdentifierMap[key]; } if ($input.attr('id') && $input.attr('id').includes('-FDATE-EDITOR')) return this.fieldIdentifierMap['FDATE']; const $parentCell = $input.closest('td'); if ($parentCell.length > 0) { const $span = $parentCell.find('span[data-field][data-rowid]'); if ($span.length > 0) { const field = $span.data('field'); const rowid = $span.data('rowid'); const key = `${field},${rowid}`; if (this.fieldIdentifierMap[key]) return this.fieldIdentifierMap[key]; } } return null; },
        createButton(label, value) { const btn = document.createElement('button'); btn.className = 'dk-toolbar-btn'; btn.innerHTML = `<span class="dk-toolbar-label">${label}</span><span class="dk-toolbar-value">${value}</span>`; btn.onclick = (e) => { e.stopPropagation(); GM_setClipboard(value, 'text'); btn.innerHTML = `<span class="dk-toolbar-label" style="color: var(--dk-green-accent);">已复制!</span>`; setTimeout(() => this.hide(), 800); }; return btn; },
        saveSize() { const newWidth = `${this.tooltip.offsetWidth}px`; GM_setValue('tooltipSize', JSON.stringify({ width: newWidth })); },
        show(inputElement) {
            this.activeInput = inputElement;
            const matchedLabel = this.identifyField(inputElement);
            if (!matchedLabel) { this.hide(); return; }
            if (!this.tooltip) { this.tooltip = document.createElement('div'); this.tooltip.id = 'dk-follow-toolbar'; const savedSize = JSON.parse(GM_getValue('tooltipSize', null)); if(savedSize) { this.tooltip.style.width = savedSize.width; } this.tooltip.addEventListener('mouseup', this.saveSize.bind(this)); document.body.appendChild(this.tooltip); }
            this.tooltip.innerHTML = '';
            const primaryGroup = document.createElement('div'); primaryGroup.className = 'dk-toolbar-group'; const contextGroup = document.createElement('div'); contextGroup.className = 'dk-toolbar-group'; const secondaryGroup = document.createElement('div'); secondaryGroup.className = 'dk-toolbar-group'; secondaryGroup.style.display = this.isSecondaryVisible ? 'flex' : 'none';
            const contextLabels = ['直播主题', '直播日期']; const allOtherLabels = Array.from(this.dataMap.keys()).filter(label => label !== matchedLabel && !contextLabels.includes(label));
            if (this.dataMap.has(matchedLabel)) primaryGroup.appendChild(this.createButton(matchedLabel, this.dataMap.get(matchedLabel)));
            contextLabels.forEach(label => { if (label !== matchedLabel && this.dataMap.has(label)) contextGroup.appendChild(this.createButton(label, this.dataMap.get(label))); });
            allOtherLabels.forEach(label => { if (this.dataMap.has(label)) secondaryGroup.appendChild(this.createButton(label, this.dataMap.get(label))); });
            if(primaryGroup.childElementCount > 0) this.tooltip.appendChild(primaryGroup);
            if(contextGroup.childElementCount > 0) { if(primaryGroup.childElementCount > 0) contextGroup.prepend(document.createElement('hr')); this.tooltip.appendChild(contextGroup); }
            if(secondaryGroup.childElementCount > 0) {
                this.tooltip.appendChild(secondaryGroup);
                const toggleBtn = document.createElement('button'); toggleBtn.id = 'dk-toolbar-toggle'; toggleBtn.className = 'dk-toolbar-btn';
                toggleBtn.textContent = this.isSecondaryVisible ? `收起 ▲` : `显示其他 (${secondaryGroup.childElementCount}) ▼`;
                toggleBtn.onclick = (e) => { e.stopPropagation(); this.isSecondaryVisible = !this.isSecondaryVisible; GM_setValue('tooltipFolded', this.isSecondaryVisible); secondaryGroup.style.display = this.isSecondaryVisible ? 'flex' : 'none'; toggleBtn.textContent = this.isSecondaryVisible ? `收起 ▲` : `显示其他 (${secondaryGroup.childElementCount}) ▼`; this.activeInput.focus(); };
                this.tooltip.appendChild(toggleBtn);
            }
            if (this.tooltip.childElementCount === 0) { this.hide(); return; }
            const rect = inputElement.getBoundingClientRect();
            this.tooltip.style.top = `${window.scrollY + rect.top}px`;
            this.tooltip.style.left = `${window.scrollX + rect.left - this.tooltip.offsetWidth - 8}px`;
            this.tooltip.classList.add('visible');
        },
        hide() { if (this.tooltip) this.tooltip.classList.remove('visible'); }
    };

    function initialize() {
        if (document.getElementById('dk-widget-wrapper')) return;
        UI.init();
        const { widgetWrapper, mainIcon, panel } = UI;
        const savedPosition = JSON.parse(GM_getValue('widgetPosition', null));
        widgetWrapper.style.top = savedPosition ? savedPosition.top : `${window.innerHeight - 80}px`;
        widgetWrapper.style.left = savedPosition ? savedPosition.left : `${window.innerWidth - 80}px`;
        let isDragging = false, wasDragged = false, offsetX, offsetY;
        mainIcon.addEventListener('mousedown', (e) => { isDragging = true; wasDragged = false; offsetX = e.clientX - widgetWrapper.offsetLeft; offsetY = e.clientY - widgetWrapper.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); });
        function onMouseMove(e) { if (!isDragging) return; wasDragged = true; let newLeft = e.clientX - offsetX; let newTop = e.clientY - offsetY; const maxLeft = window.innerWidth - widgetWrapper.offsetWidth; const maxTop = window.innerHeight - widgetWrapper.offsetHeight; widgetWrapper.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`; widgetWrapper.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`; }
        function onMouseUp() { if (isDragging && wasDragged) { GM_setValue('widgetPosition', JSON.stringify({ top: widgetWrapper.style.top, left: widgetWrapper.style.left })); } isDragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }

        if (STATE.isOnReviewPage || STATE.isOnCrmPage) {
            document.getElementById('dk-data-panel-refresh').addEventListener('click', Core.refreshData);
            document.getElementById('dk-data-panel-close').addEventListener('click', () => panel.classList.remove('visible'));
            document.getElementById('dk-copy-all-btn').addEventListener('click', (e) => { if (STATE.currentData.length > 0) { const allDataText = STATE.currentData.map(item => `${item.label}：${item.value}`).join('\n'); GM_setClipboard(allDataText, 'text'); e.target.textContent = '已全部复制!'; setTimeout(() => { e.target.textContent = '复制全部数据'; }, 2000); } });
            let isPanelDragging = false, panelOffsetX, panelOffsetY;
            const header = document.getElementById('dk-data-panel-header');
            header.addEventListener('mousedown', (e) => { isPanelDragging = true; panelOffsetX = e.clientX - panel.offsetLeft; panelOffsetY = e.clientY - panel.offsetTop; document.addEventListener('mousemove', onPanelMouseMove); document.addEventListener('mouseup', onPanelMouseUp); });
            function onPanelMouseMove(e) { if (!isPanelDragging) return; let newLeft = e.clientX - panelOffsetX; let newTop = e.clientY - panelOffsetY; const maxLeft = window.innerWidth - panel.offsetWidth; const maxTop = window.innerHeight - panel.offsetHeight; panel.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`; panel.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`; panel.style.right = 'auto'; panel.style.bottom = 'auto'; }
            function onPanelMouseUp() { isPanelDragging = false; document.removeEventListener('mousemove', onPanelMouseMove); document.removeEventListener('mouseup', onPanelMouseUp); }
            if (STATE.isOnReviewPage) {
                let debounceTimer;
                const debouncedRefresh = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => { if (panel.classList.contains('visible')) { Core.refreshData(); } }, 500); };
                const targetNode = document.querySelector('.content--224Y7');
                if (targetNode) { const observer = new MutationObserver(debouncedRefresh); observer.observe(targetNode, { childList: true, subtree: true }); }
            }
            if (STATE.isOnCrmPage) {
                const smartFillToggleLabel = document.createElement('label'); smartFillToggleLabel.className = 'dk-switch';
                const smartFillToggleInput = document.createElement('input'); smartFillToggleInput.type = 'checkbox';
                const smartFillToggleSpan = document.createElement('span'); smartFillToggleSpan.className = 'slider';
                smartFillToggleLabel.appendChild(smartFillToggleInput); smartFillToggleLabel.appendChild(smartFillToggleSpan);
                widgetWrapper.appendChild(smartFillToggleLabel);
                SmartTooltip.init(smartFillToggleInput);
                smartFillToggleLabel.addEventListener('click', () => { if (smartFillToggleInput.checked) { SmartTooltip.deactivate(); } else { const storedData = GM_getValue('dyLiveData', '[]'); if (storedData === '[]' || !storedData) { alert('没有找到缓存的直播数据，请先在抖音直播复盘页打开助手面板。'); smartFillToggleInput.checked = false; return; } SmartTooltip.activate(); } });
            }
            mainIcon.addEventListener('click', (e) => { if (wasDragged) { e.stopPropagation(); return; } const isVisible = panel.classList.toggle('visible'); if (isVisible) { Core.refreshData(); } });
        } else if (STATE.isOnDouyinDomain) {
            mainIcon.addEventListener('click', (e) => { if (wasDragged) { e.stopPropagation(); return; } GM_openInTab(CONFIG.reviewPageURL, { active: true }); });
        }

        GM_addStyle(`:root{--dk-bg-color:rgba(242,242,247,0.85);--dk-border-color:rgba(0,0,0,0.1);--dk-text-primary:#1d1d1f;--dk-text-secondary:#6e6e73;--dk-blue-accent:#007aff;--dk-green-accent:#34c759;--dk-panel-width:360px}#dk-widget-wrapper{position:fixed;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:10px}#dk-main-icon{width:52px;height:52px;background-color:rgba(255,255,255,0.25);background-size:cover;border-radius:50%;cursor:grab;transition:transform .2s ease-in-out;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,0.4),0 8px 20px rgba(0,0,0,.15);background-position:center;background-repeat:no-repeat;}#dk-main-icon:hover{transform:scale(1.1)}#dk-main-icon:active{cursor:grabbing;transform:scale(.95)}.dk-switch{position:relative;display:inline-block;width:51px;height:31px;cursor:pointer}.dk-switch input{opacity:0;width:0;height:0}.dk-switch .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:34px}.dk-switch .slider:before{position:absolute;content:"";height:27px;width:27px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}.dk-switch input:checked+.slider{background-color:var(--dk-green-accent)}.dk-switch input:checked+.slider:before{transform:translateX(20px)}#dk-data-panel{position:fixed;top:150px;right:25px;width:var(--dk-panel-width);background-color:var(--dk-bg-color);backdrop-filter:blur(20px) saturate(180%);border:1px solid var(--dk-border-color);border-radius:18px;z-index:10000;box-shadow:0 10px 30px rgba(0,0,0,.15);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;opacity:0;transform:translateY(20px);transition:opacity .3s ease-out,transform .3s ease-out;visibility:hidden}#dk-data-panel.visible{opacity:1;transform:translateY(0);visibility:visible}#dk-data-panel-header{padding:14px 20px;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none;border-bottom:1px solid var(--dk-border-color)}.header-title{font-size:16px;font-weight:600;color:var(--dk-text-primary)}.header-buttons{display:flex;align-items:center;gap:12px}#dk-data-panel-refresh,#dk-data-panel-close{width:24px;height:24px;border-radius:50%;cursor:pointer;position:relative;transition:background-color .2s,transform .3s;background-color:#ddd}#dk-data-panel-refresh:hover,#dk-data-panel-close:hover{background-color:#ccc}#dk-data-panel-refresh:active{transform:rotate(360deg)}#dk-data-panel-refresh::before{content:'↻';font-family:Arial,sans-serif;color:#fff;font-size:18px;font-weight:700;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}#dk-data-panel-close::before,#dk-data-panel-close::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:1.5px;background-color:#fff;transform-origin:center}#dk-data-panel-close::before{transform:translate(-50%,-50%) rotate(45deg)}#dk-data-panel-close::after{transform:translate(-50%,-50%) rotate(-45deg)}#dk-data-panel-content{padding:8px 20px;max-height:450px;overflow-y:auto}.dk-data-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--dk-border-color)}.dk-data-row:last-child{border-bottom:none}.dk-data-label{font-size:14px;color:var(--dk-text-secondary)}.dk-data-value-wrapper{display:flex;align-items:center}.dk-data-value{font-size:14px;font-weight:500;color:var(--dk-text-primary);margin-right:12px}.dk-copy-btn{padding:5px 10px;font-size:12px;cursor:pointer;border:1px solid rgba(0,0,0,.1);border-radius:8px;background-color:rgba(255,255,255,.7);color:var(--dk-blue-accent);transition:background-color .2s,color .2s}.dk-copy-btn:hover{background-color:var(--dk-blue-accent);color:#fff;border-color:transparent}#dk-data-panel-footer{padding:16px 20px;border-top:1px solid var(--dk-border-color);display:flex;flex-wrap:wrap;gap:10px}.dk-footer-btn{flex-basis:100%;padding:12px;font-size:15px;font-weight:600;cursor:pointer;border:none;border-radius:12px;color:#fff;transition:background-color .2s,transform .1s}#dk-copy-all-btn{background-color:var(--dk-blue-accent)}#dk-copy-all-btn:hover{background-color:#0071e3}.dk-footer-btn:active{transform:scale(.98)}#dk-follow-toolbar{position:absolute;z-index:10002;background-color:rgba(28,28,30,.85);backdrop-filter:blur(10px);color:#fff;padding:8px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.2);display:flex;flex-direction:column;gap:8px;width:280px;resize:horizontal;overflow:auto;min-width:180px;max-width:500px;transition:opacity .2s,transform .2s;opacity:0;transform:translateX(-10px);visibility:hidden}#dk-follow-toolbar.visible{opacity:1;transform:translateX(0);visibility:visible}.dk-toolbar-group{display:flex;flex-direction:column;gap:6px}.dk-toolbar-group hr{border:none;height:1px;background-color:rgba(255,255,255,.2);margin:2px 0}.dk-toolbar-btn{background-color:rgba(255,255,255,.15);border:none;color:#fff;padding:8px 12px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;min-height:38px}.dk-toolbar-btn:hover{background-color:rgba(255,255,255,.3)}.dk-toolbar-label{font-weight:600;margin-right:8px}.dk-toolbar-value{opacity:.8;word-break:break-all}#dk-toolbar-toggle{width:100%;background-color:rgba(100,100,100,.3);margin-top:4px}#dk-toolbar-toggle:hover{background-color:rgba(100,100,100,.5)}`);
    }

    // 启动脚本
    const safeInitialize = () => {
        if (document.body) {
            initialize();
        } else {
            setTimeout(safeInitialize, 100);
        }
    };
    safeInitialize();

})();