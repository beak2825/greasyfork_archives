// ==UserScript==
// @name         飞书 Wiki 目录导出工具
// @namespace    https://feishu-wiki-exporter.example
// @version      4.8.0
// @description  全自动展开并提取飞书知识库的完整目录，同时智能区分和报告外部跳转链接，最终在一个清晰的面板中提供一键复制功能。
// @author       掌心向暖 | 开发者微信: PD-1104 | 专注分享自动化提效方案
// @match        https://*.feishu.cn/wiki/*
// @match        https://*.larkoffice.com/wiki/*
// @grant        none
// @run-at       document-idle
// @all-frames   true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563928/%E9%A3%9E%E4%B9%A6%20Wiki%20%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/563928/%E9%A3%9E%E4%B9%A6%20Wiki%20%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 开发者微信：PD-1104
    // 专注RPA&AI等自动化提效方案，爆款RPA应用"复制受限飞书文档下载"，移步公众号：掌心向暖

    /***** 配置 *****/
    const SCROLL_STEP = 400;
    const ACTION_DELAY = 2000;
    const MAX_PASSES = 50;
    const LOG_PREFIX = '[WikiExporter v4.8]';

    const CONTAINER_SELECTOR = '.sidebar-styled__ScrollableContainer-czoANO';
    const COLLAPSED_NODE_SELECTOR = '.workspace-tree-view-node-expand-arrow--collapsed';
    const ALL_NODES_SELECTOR = '.workspace-tree-view-node';

    let RUNNING = false;
    let controlElements = null;
    let hasExternalKnowledgeBase = false;

    const currentDomain = window.location.hostname.replace(/^www\./, '');
    const isFeishuDomain = currentDomain.includes('feishu.cn') || currentDomain.includes('larksuite.com');

    /***** 工具函数 *****/
    function log(...args) { console.log(LOG_PREFIX, ...args); }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function robustClick(element) {
        if (!element) return;
        try {
            const rect = element.getBoundingClientRect();
            const opts = { bubbles: true, cancelable: true, view: window, clientX: rect.left + 5, clientY: rect.top + 5 };
            element.dispatchEvent(new PointerEvent('pointerdown', opts));
            element.dispatchEvent(new MouseEvent('mousedown', opts));
            element.dispatchEvent(new PointerEvent('pointerup', opts));
            element.dispatchEvent(new MouseEvent('mouseup', opts));
            element.dispatchEvent(new MouseEvent('click', opts));
        } catch (e) { log('Click simulation failed:', e); }
    }

    function isExternalJumpLink(node, uid) {
        const wikiTokenRegex = /wikiToken=([^&]+)/;
        const shortcutTokenRegex = /shortcutTokenPaths=([^&]+)/;
        const shortcutMatch = uid.match(shortcutTokenRegex);
        const wikiMatch = uid.match(wikiTokenRegex);
        if (shortcutMatch && wikiMatch && shortcutMatch[1] !== wikiMatch[1]) { return true; }
        const linkElement = node.querySelector('a');
        if (linkElement) {
            const href = linkElement.getAttribute('href') || '';
            if (href.startsWith('http') && !href.includes(currentDomain)) { return true; }
            if (isFeishuDomain && href.includes('/wiki/') && !href.includes(window.location.pathname.split('/wiki/')[1]?.split('/')[0])) { return true; }
        }
        const externalClasses = ['external-link', 'cross-wiki', 'inter-wiki'];
        const nodeClasses = node.className || '';
        if (externalClasses.some(cls => nodeClasses.includes(cls))) { return true; }
        return false;
    }

    /***** 核心逻辑 *****/
    function extractAndStoreVisibleData(internalMap, externalMap) {
        document.querySelectorAll(ALL_NODES_SELECTOR).forEach(node => {
            const uid = node.dataset.nodeUid;
            if (!uid) return;
            if (isExternalJumpLink(node, uid)) {
                if (externalMap.has(uid)) return;
                hasExternalKnowledgeBase = true;
                const nameElement = node.querySelector('.workspace-tree-view-node-content');
                if (nameElement) {
                    const name = nameElement.textContent.trim();
                    const level = node.dataset.nodeLevel || 'N/A';
                    const pos = node.dataset.nodePos || '';
                    let url = 'N/A (外部链接)';
                    const linkElement = node.querySelector('a');
                    if (linkElement && linkElement.href) { url = linkElement.href; }
                    externalMap.set(uid, { level, name, url, pos });
                }
                return;
            }
            if (internalMap.has(uid)) return;
            const nameElement = node.querySelector('.workspace-tree-view-node-content');
            if (nameElement) {
                const name = nameElement.textContent.trim();
                const level = node.dataset.nodeLevel || 'N/A';
                const pos = node.dataset.nodePos || '';
                const wikiTokenRegex = /wikiToken=([^&]+)/;
                const match = uid.match(wikiTokenRegex);
                if (match && match[1]) {
                    const wikiToken = match[1];
                    const url = `${window.location.origin}/wiki/${wikiToken}`;
                    internalMap.set(uid, { level, name, url, pos });
                }
            }
        });
    }
    async function expandAndCollectAll() {
        hasExternalKnowledgeBase = false;
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) return null;
        const collectedInternalData = new Map();
        const collectedExternalData = new Map();
        let totalPasses = 0;
        while (RUNNING && totalPasses < MAX_PASSES) {
            totalPasses++;
            container.scrollTo({ top: 0, behavior: 'auto' });
            await sleep(ACTION_DELAY);
            let lastScrollTop = -1, stuckCount = 0, expansionsInThisPass = 0;
            log(`-> 开始第 ${totalPasses} 轮扫描, 已采集 ${collectedInternalData.size} (内部) + ${collectedExternalData.size} (外部) 条`);
            while (RUNNING) {
                extractAndStoreVisibleData(collectedInternalData, collectedExternalData);
                const arrows = document.querySelectorAll(COLLAPSED_NODE_SELECTOR);
                let clickedCount = 0;
                if (arrows.length > 0) {
                    for (const arrow of arrows) {
                        const parentNode = arrow.closest(ALL_NODES_SELECTOR);
                        if (parentNode) {
                            const uid = parentNode.dataset.nodeUid;
                            if (!uid || !isExternalJumpLink(parentNode, uid)) {
                                robustClick(parentNode);
                                clickedCount++;
                                await sleep(100);
                            }
                        }
                    }
                }
                if (clickedCount > 0) {
                    expansionsInThisPass += clickedCount;
                    await sleep(ACTION_DELAY);
                }
                lastScrollTop = container.scrollTop;
                container.scrollBy({ top: SCROLL_STEP, behavior: 'auto' });
                await sleep(500);
                const atEnd = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
                if (atEnd) break;
                if (container.scrollTop === lastScrollTop) {
                    stuckCount++;
                    if (stuckCount >= 5) break;
                } else {
                    stuckCount = 0;
                }
            }
            extractAndStoreVisibleData(collectedInternalData, collectedExternalData);
            if (expansionsInThisPass === 0) {
                log('全盘扫描未发现任何可展开节点，判定为全部展开完成！');
                break;
            }
            if (!RUNNING) return null;
        }
        log('最终验证滚动...');
        await sleep(ACTION_DELAY);
        let finalScrollTop = -1;
        container.scrollTo({ top: 0, behavior: 'auto' });
        await sleep(ACTION_DELAY);
        while (RUNNING) {
            extractAndStoreVisibleData(collectedInternalData, collectedExternalData);
            container.scrollBy({ top: SCROLL_STEP, behavior: 'auto' });
            await sleep(200);
            if (container.scrollTop === finalScrollTop) break;
            finalScrollTop = container.scrollTop;
        }
        extractAndStoreVisibleData(collectedInternalData, collectedExternalData);
        log('采集完成。');
        return { internal: collectedInternalData, external: collectedExternalData };
    }
    function sortAndOutput(internalDataMap, externalDataMap) {
        const sortFunc = (a, b) => {
            const posA = a.pos.split(',').map(Number);
            const posB = b.pos.split(',').map(Number);
            const minLength = Math.min(posA.length, posB.length);
            for (let i = 0; i < minLength; i++) { if (posA[i] !== posB[i]) return posA[i] - posB[i]; }
            return posA.length - posB.length;
        };
        let finalInternalData = Array.from(internalDataMap.values()).sort(sortFunc);
        let finalExternalData = Array.from(externalDataMap.values()).sort(sortFunc);
        log(`数据整理完成！内部目录 ${finalInternalData.length} 条，外部链接 ${finalExternalData.length} 条。`);
        showCsvOutputUI(finalInternalData, finalExternalData);
    }

    function showCsvOutputUI(internalData, externalData) {
        // 开发者微信：PD-1104
        // 专注RPA&AI等自动化提效方案，爆款RPA应用"复制受限飞书文档下载"，移步公众号：掌心向暖

        if (internalData.length === 0 && externalData.length === 0) {
            alert("未能提取到任何数据。");
            return;
        }

        const oldOutput = document.getElementById('wiki-csv-output-container');
        if (oldOutput) oldOutput.remove();

        const csvHeader = '"层级","名称","链接"';
        const internalCsvOutput = [csvHeader, ...internalData.map(item => `"${item.level}","${item.name.replace(/"/g, '""')}","${item.url}"`)].join('\n');
        const externalCsvOutput = [csvHeader, ...externalData.map(item => `"${item.level}","${item.name.replace(/"/g, '""')}","${item.url}"`)].join('\n');

        const container = document.createElement('div');
        container.id = 'wiki-csv-output-container';
        Object.assign(container.style, {
            position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '800px', zIndex: '99999', backgroundColor: 'white',
            border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            maxHeight: '85vh',
        });

        const mainContent = document.createElement('div');
         Object.assign(mainContent.style, {
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
            overflowY: 'auto'
        });

        const mainTitle = document.createElement('h3');
        mainTitle.textContent = `飞书 Wiki 目录提取结果【脚本开发者公众号：掌心向暖】`;
        Object.assign(mainTitle.style, { margin: '0 0 10px 0', padding: '0', fontSize: '18px', textAlign: 'center', color: '#333' });

        const createSection = (titleText, data, csvOutput) => {
            if (data.length === 0) return;

            const section = document.createElement('div');
            Object.assign(section.style, { display: 'flex', flexDirection: 'column', gap: '8px' });

            const titleBar = document.createElement('div');
            Object.assign(titleBar.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });

            const title = document.createElement('h4');
            title.textContent = `${titleText} (${data.length} 条)`;
            Object.assign(title.style, { margin: '0', padding: '0', fontSize: '16px', color: '#333' });

            const copyButton = document.createElement('button');
            copyButton.textContent = '一键复制';
            Object.assign(copyButton.style, {
                padding: '5px 15px', border: 'none', borderRadius: '5px',
                backgroundColor: '#31817F', color: 'white', cursor: 'pointer', fontSize: '14px'
            });
            copyButton.onclick = () => {
                navigator.clipboard.writeText(csvOutput).then(() => {
                    copyButton.textContent = '复制成功!';
                    setTimeout(() => { copyButton.textContent = '一键复制'; }, 2000);
                }).catch(err => {
                    copyButton.textContent = '复制失败'; log("复制失败:", err);
                });
            };

            const textarea = document.createElement('textarea');
            textarea.value = csvOutput;
            Object.assign(textarea.style, {
                width: '100%', boxSizing: 'border-box',
                height: data.length > 5 ? '120px' : '200px',
                resize: 'vertical', fontFamily: 'monospace', fontSize: '12px',
                border: '1px solid #ddd', padding: '5px'
            });

            titleBar.append(title, copyButton);
            section.append(titleBar, textarea);
            mainContent.appendChild(section);
        };

        mainContent.appendChild(mainTitle);
        createSection('知识库原生目录', internalData, internalCsvOutput);
        if (externalData.length > 0) {
            createSection('其他链接的外部知识库 (需人工核实进一步处理)', externalData, externalCsvOutput);
        }

        const footer = document.createElement('div');
        Object.assign(footer.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 20px', backgroundColor: '#f5f5f5', borderTop: '1px solid #eee'
        });

        const hintText = document.createElement('span');
        hintText.textContent = '提示：可新建本地txt文件，将内容复制存放，从EXCEL导入使用';
        Object.assign(hintText.style, { fontSize: '12px', color: '#666' });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        Object.assign(closeButton.style, {
            padding: '5px 15px', border: '1px solid #ccc', borderRadius: '5px',
            backgroundColor: '#fff', color: '#333', cursor: 'pointer', fontSize: '14px'
        });
        closeButton.onclick = () => container.remove();

        footer.append(hintText, closeButton);
        container.append(mainContent, footer);
        document.body.appendChild(container);
    }

    async function startExportProcess() {
        if (RUNNING) return;
        RUNNING = true;
        updateControlState('采集中...');
        const allData = await expandAndCollectAll();
        if (allData && RUNNING) {
            sortAndOutput(allData.internal, allData.external);
        } else {
            log("过程被中断或失败。");
        }
        RUNNING = false;
        updateControlState('开始提取');
    }
    function stopExecution() { if (RUNNING) { log("用户手动停止。"); RUNNING = false; } }
    function createMainButton() {
        const btnWrap = document.createElement('div');
        const startBtn = document.createElement('button');
        startBtn.textContent = '开始提取';
        Object.assign(startBtn.style, {
            padding: '2px 8px', fontSize: '12px', color: '#fff', background: '#007bff',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
        });
        startBtn.onclick = () => { if (RUNNING) stopExecution(); else Promise.resolve().then(startExportProcess); };
        btnWrap.appendChild(startBtn);
        controlElements = { wrapper: btnWrap, button: startBtn };
    }
    function updateControlState(text) {
        if (!controlElements || !controlElements.button) return;
        const btn = controlElements.button;
        if (RUNNING) {
            btn.textContent = `停止 (${text})`;
            btn.style.backgroundColor = '#d9534f';
        } else {
            btn.textContent = text || '开始提取';
            btn.style.backgroundColor = '#007bff';
        }
    }
    let pageObserver = null;
    function manageButton() {
        const targetSelector = 'span.styled__WikiSpaceTag-fUFHnL.bQJrNE, [class*="wiki-space-tag"]';
        const targetText = '互联网公开';
        const wrapperId = 'wiki-exporter-wrapper';
        const targetTag = Array.from(document.querySelectorAll(targetSelector)).find(el => el.textContent.trim() === targetText);
        const existingWrapper = document.getElementById(wrapperId);
        if (targetTag && !existingWrapper) {
            const wrapper = document.createElement('div');
            wrapper.id = wrapperId;
            Object.assign(wrapper.style, { display: 'inline-flex', alignItems: 'baseline', gap: '10px' });
            const parent = targetTag.parentNode;
            parent.insertBefore(wrapper, targetTag);
            wrapper.appendChild(targetTag);
            if (!controlElements) createMainButton();
            wrapper.appendChild(controlElements.wrapper);
        } else if (!targetTag && existingWrapper) {
            existingWrapper.remove();
        }
    }
    function initialize() {
        if (pageObserver) pageObserver.disconnect();
        manageButton();
        pageObserver = new MutationObserver(manageButton);
        pageObserver.observe(document.body, { childList: true, subtree: true });
    }
    function hookHistory() {
        const fire = () => setTimeout(initialize, 500);
        const origPushState = history.pushState;
        history.pushState = function (...args) { origPushState.apply(this, args); fire(); };
        const origReplaceState = history.replaceState;
        history.replaceState = function (...args) { origReplaceState.apply(this, args); fire(); };
        window.addEventListener('popstate', fire);
    }

    hookHistory();
    initialize();
    log('最终优化版采集导出工具已加载。');
})();