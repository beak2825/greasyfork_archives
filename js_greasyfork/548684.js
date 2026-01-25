// ==UserScript==
// @name         DBD-RawsBanHelper
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  过滤动漫花园、末日动漫、Nyaa和蜜柑计划中的DBD-Raws与731学院内容，并修复行颜色问题
// @description:zh-CN  3.3更新内容：在控制面板中增加了手动触发过滤的按钮，并修复了没有初始化的问题
// @author       Fuck DBD-Raws
// @license      MIT
// @match        *://*.dmhy.org/*
// @match        *://*.acgnx.se/*
// @match        *://nyaa.land/*
// @match        *://nyaa.si/*
// @match        *://mikanani.me/*
// @match        *://mikanani.kas.pub/*
// @exclude      *://u2.dmhy.org/showup.php
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始默认关键词（仅用于首次运行时的默认值）
    const defaultKeywords = [
        'DBD-Raws', 'DBD制作组', 'DBD製作組', 'DBD转发', 'DBD轉發', 'DBD-SUB', 'DBD字幕组', 'DBD字幕組',
        'DBD代发', 'DBD代發', 'DBD代传', 'DBD代傳', 'DBD转载', 'DBD轉載', 'DBD自购', 'DBD自購',
        'DBD&', '&DBD', '[DBD]', '[TOC]',
        '我的英雄学院', '我的英雄學院', 'Boku no Hero Academia', 'Boku No Hero Academia',
        'My Hero Academia', 'My.Hero.Academia', 'Boku.no.Hero.Academia', 'Boku.No.Hero.Academia',
        'My_Hero_Academia', 'Boku_no_Hero_Academia', '僕のヒーローアカデミア',
    ];

    // 全局关键词
    function getGlobalKeywords() {
        return GM_getValue('globalKeywords', defaultKeywords);
    }
    function saveGlobalKeywords(keywords) {
        GM_setValue('globalKeywords', keywords);
    }

    // 站点关键词（按域名）
    function getSiteKeywords(hostname = location.hostname) {
        return GM_getValue('siteKeywords_' + hostname, []);
    }
    function saveSiteKeywords(keywords, hostname = location.hostname) {
        GM_setValue('siteKeywords_' + hostname, keywords);
    }

    // 合并关键词（全局 + 站点）
    function getAllKeywords() {
        return [...getGlobalKeywords(), ...getSiteKeywords()];
    }

    // 记录过滤结果
    function logFilterResult(matchedKeywords, removedTexts, removedCount) {
        if (removedCount > 0) {
            // 拼接过滤内容，每行加上换行符
            let logMessage = `🔍匹配关键词: 『${Array.from(matchedKeywords).join('、')}』\n`;
            logMessage += `共过滤 ${removedCount} 条内容,过滤的内容如下:\n`;
            logMessage += removedTexts.map((text, index) => `✅${index + 1}. ${text}`).join('\n');

            console.log(logMessage); // ✅ 仅输出一条日志
        } else {
            console.log('❌没啥要过滤的~');
        }
    }

    // 过滤特定内容（我的英雄学院）
    function filter731() {
        const bullshits = document.querySelectorAll('[title*=我的英雄学院]');
        bullshits.forEach(bullshit => {
            if (window.location.href.includes('/Home/Search')) {
                bullshit.parentNode.parentNode.parentNode.parentNode.remove();
            } else {
                bullshit.parentNode.parentNode.parentNode.remove();
            }
        });

        // ✅ 新增功能：检查 ul.list-inline.an-ul 是否为空
        const uls = document.querySelectorAll('#sk-body ul.list-inline.an-ul');
        uls.forEach(ul => {
            if (ul.children.length === 0) {
                // 如果没有子元素，则删除父元素
                if (ul.parentNode) {
                    ul.parentNode.remove();
                }
            }
        });
    }

    function getPanel() {
        return document.getElementById('filter-config-panel');
    }

    // ✅ 兜底：如果面板被删了，尝试重建或重新挂载
    function ensurePanelAlive(initFn) {
        const panel = getPanel();
        if (!panel) {
            try {
                // 如果你有 initControlPanel()，这里直接重建
                if (typeof initFn === 'function') initFn();
            } catch (e) {
                console.log('⚠️控制面板缺失且重建失败：', e);
            }
        }
    }


    // 过滤蜜柑计划展开的子组
    function filterMikanFrame(frame) {
        const keywords = getAllKeywords();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const lis = frame.querySelectorAll('li.js-expand_bangumi-subgroup');
        lis.forEach(li => {
            const tag = li.querySelector('.sk-col.tag-res-name');
            if (!tag) return;
            const text = tag.textContent.trim();
            const title = tag.getAttribute('title') || '';
            const hit = keywords.find(keyword => text.includes(keyword) || title.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                li.remove();
            }
        });

        filter731();
        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划列表模式
    function filterMikanList() {
        const keywords = getAllKeywords();
        const rows = document.querySelectorAll('#sk-body table tbody tr');
        const removedTexts = [];
        const matchedKeywords = new Set();
        let removedCount = 0;

        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(3)');
            if (!td) return;
            const link = td.querySelector('a');
            if (!link) return;
            const text = link.textContent.trim();
            const hit = keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove();
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划搜索模式
    function filterMikanSearch() {
        const keywords = getAllKeywords();
        filter731();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const sidebarLis = document.querySelectorAll('#sk-container .leftbar-container ul li');
        sidebarLis.forEach(li => {
            const link = li.querySelector('span a');
            if (!link) return;
            const text = link.textContent.trim();
            const hit = (text.includes('TOC') ? 'TOC' : null) || keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                li.remove();
            }
        });

        const rows = document.querySelectorAll('#sk-container table tbody tr');
        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(2)');
            if (!td) return;
            const link = td.querySelector('a');
            if (!link) return;
            const text = link.textContent.trim();
            const hit = keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove();
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划番剧模式
    function filterMikanBangumi() {
        const keywords = getAllKeywords();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const sidebarLis = document.querySelectorAll('#sk-container .leftbar-container ul li');
        sidebarLis.forEach(li => {
            const link = li.querySelector('span a');
            if (!link) return;
            const text = link.textContent.trim();
            const hit = (text.includes('TOC') ? 'TOC' : null) || keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                li.remove();
            }
        });

        const subgroupDivs = document.querySelectorAll('div.subgroup-text[id]');
        subgroupDivs.forEach(subgroupDiv => {
            const link = subgroupDiv.querySelector('a');
            if (!link) return;
            const text = link.textContent.trim();
            const hit = (text.includes('TOC') ? 'TOC' : null) || keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;

                const toRemove = [];
                if (subgroupDiv.previousElementSibling) {
                    toRemove.push(subgroupDiv.previousElementSibling);
                }
                toRemove.push(subgroupDiv);

                let next = subgroupDiv.nextElementSibling;
                for (let i = 0; i < 3 && next; i++) {
                    toRemove.push(next);
                    next = next.nextElementSibling;
                }

                toRemove.forEach(el => el.remove());
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤动漫花园
    function filterDmhyContent() {
        const keywords = getAllKeywords();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const table = document.querySelector('#topic_list');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(3)');
            if (!td) return;
            const link = td.querySelector('a[target]');
            // 改成兼容写法（ES5+）
            const tdText = ((link && link.textContent) || td.textContent).trim();
            const rowText = row.textContent.trim();// ✅ 用于匹配
            const hit = keywords.find(keyword => rowText.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(tdText);// ✅ 只保存第3列的内容
                removedCount++;
                row.remove();
            }
        });

        // 重新设置剩余行的奇偶行样式
        const remainingRows = table.querySelectorAll('tbody tr');
        remainingRows.forEach((row, index) => {
            row.classList.remove('odd', 'even');
            if (index % 2 === 0) {
                row.classList.add('even');
            } else {
                row.classList.add('odd');
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤末日动漫
    function filterAcgnxContent() {
        const keywords = getAllKeywords();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const table = document.querySelector('#data_list');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(3)');
            if (!td) return;
            const tdText = td.textContent.trim(); // ✅ 用于保存
            const rowText = row.textContent.trim();// ✅ 用于匹配

            const hit = keywords.find(keyword => rowText.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(tdText);// ✅ 只保存第3列的内容
                removedCount++;
                row.remove();
            }
        });

        // 重新设置剩余行的奇偶行样式
        const remainingRows = table.querySelectorAll('tr');
        remainingRows.forEach((row, index) => {
            row.classList.remove('alt1', 'alt2');
            if (index % 2 === 0) {
                row.classList.add('alt1');
            } else {
                row.classList.add('alt2');
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤 Nyaa
    function filterNyaaContent() {
        const keywords = getAllKeywords();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(2)');
            if (!td) return;
            const text = td.textContent.trim();
            const hit = keywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove();
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 主过滤函数
    function filterContent() {
        setTimeout(() => {
            console.clear();
            console.log('ℹ️DBD-RawsBanHelper初始化完成，开始执行！');
            if (location.hostname.includes('dmhy.org')) {
                console.log('ℹ️正在执行『动漫花园』的过滤方法');
                filterDmhyContent();
            } else if (location.hostname.includes('acgnx.se')) {
                console.log('ℹ️正在执行『末日动漫』的过滤方法');
                filterAcgnxContent();
            } else if (location.hostname.includes('nyaa')) {
                console.log('ℹ️正在执行『Nyaa』的过滤方法');
                filterNyaaContent();
            } else if (location.pathname.includes('/Home/Classic')) {
                console.log('ℹ️正在执行『蜜柑计划-列表模式』的过滤方法');
                filterMikanList();
            } else if (location.pathname.includes('/Home/Search')) {
                console.log('ℹ️正在执行『蜜柑计划-搜索模式』的过滤方法');
                filterMikanSearch();
            } else if (location.pathname.includes('/Home/Bangumi')) {
                console.log('ℹ️正在执行『蜜柑计划-番剧模式』的过滤方法');
                filterMikanBangumi();
            } else if (location.hostname.includes('mikanani.me') || location.hostname.includes('mikanani.kas.pub')) {
                console.log('ℹ️蜜柑计划展开过滤逻辑已绑定点击事件');
            }
        }, 500);
    }

    if (location.hostname.includes('mikanani.kas.pub')) {
        window.addEventListener('load', filter731);
    }

    window.addEventListener('load', filterContent);

    // 监听 DOM 变化，持续过滤特定内容
    window.addEventListener('load', () => {
        const targetNode = document.querySelector('#sk-body');
        if (!targetNode) return;
        const observer = new MutationObserver(() => {
            filter731();
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    });

    // 抽屉式控制面板
    function initControlPanel() {
        const showButton = GM_getValue('showButton', true);

        const panel = document.createElement('div');
        panel.id = 'filter-config-panel';
        panel.style.cssText = `
        position: fixed;
        top: 10%;
        right: 0;
        width: 360px;   /* 缩窄 */
        height: 85%;    /* 拉长 */
        background: #fff;
        border-left: 1px solid #ccc;
        box-shadow: -4px 0 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-radius: 8px 0 0 8px;
    `;
        panel.style.opacity = '0.95';

        // 样式覆盖
        const style = document.createElement('style');
        style.textContent = `
      #filter-config-panel, #filter-config-panel * {
        font-family: "Segoe UI", "Microsoft YaHei", "PingFang SC", Arial, Helvetica, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        box-sizing: border-box !important;
      }
      #filter-config-panel, #filter-config-panel ul {
        overflow-y: scroll !important;
      }
        #filter-config-panel::-webkit-scrollbar
     {
        display: none !important;
      }
      #filter-config-panel li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        padding: 4px 2px;
      }
      #filter-config-panel li span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #filter-config-panel button {
        padding: 4px 8px !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
      }
      .btn-add     { background: #4CAF50 !important; color: #fff !important; }
      .btn-delete  { background: #f44336 !important; color: #fff !important; }
      .btn-edit    { background: #FF9800 !important; color: #fff !important; }
      .btn-export  { background: #795548 !important; color: #fff !important; }
      .btn-import  { background: #2196F3 !important; color: #fff !important; }
      #toggle-keyword-panel-btn {
        font-family: "Segoe UI", "Microsoft YaHei", "PingFang SC", Arial, Helvetica, sans-serif !important;
        font-size: 13px !important;
      }
      #filter-config-panel li {
        border-bottom: 1px solid #eee;
      }
      .section-divider {
        height: 5px;
        background: #ccc;
        margin: 8px 0;
      }
    `;
        document.head.appendChild(style);

        // 标题
        const title = document.createElement('div');
        title.textContent = '过滤关键词控制面板';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.padding = '10px';
        title.style.borderBottom = '1px solid #ddd';
        panel.appendChild(title);

        // 全局关键词列表
        const globalTitle = document.createElement('div');
        globalTitle.textContent = '🌐 全局关键词(Global)';
        globalTitle.style.fontWeight = 'bold';
        globalTitle.style.padding = '5px 5px';
        panel.appendChild(globalTitle);

        const globalList = document.createElement('ul');
        globalList.style.listStyle = 'none';
        globalList.style.padding = '5px';
        globalList.style.margin = '0';
        globalList.style.flex = '1';
        panel.appendChild(globalList);

        // 全局关键词输入区
        const globalInputContainer = document.createElement('div');
        globalInputContainer.style.display = 'flex';
        globalInputContainer.style.gap = '5px';
        globalInputContainer.style.padding = '5px 10px';

        const globalInput = document.createElement('input');
        globalInput.type = 'text';
        globalInput.placeholder = ' 输入全局关键词，注意区分大小写！';
        globalInput.style.flex = '1';

        const addGlobalBtn = document.createElement('button');
        addGlobalBtn.textContent = '添加';
        addGlobalBtn.className = 'btn-add';

        globalInputContainer.appendChild(globalInput);
        globalInputContainer.appendChild(addGlobalBtn);
        panel.appendChild(globalInputContainer);

        // 在全局输入框之后插入分隔线
        const sectionDivider = document.createElement('div');
        sectionDivider.className = 'section-divider';
        panel.appendChild(sectionDivider);

        // 站点关键词列表
        const siteTitle = document.createElement('div');
        siteTitle.textContent = `📍 当前站点关键词 (${location.hostname})`;
        siteTitle.style.fontWeight = 'bold';
        siteTitle.style.padding = '5px 5px';
        panel.appendChild(siteTitle);

        const siteList = document.createElement('ul');
        siteList.style.listStyle = 'none';
        siteList.style.padding = '5px';
        siteList.style.margin = '0';
        siteList.style.flex = '1';
        panel.appendChild(siteList);

        // 站点关键词输入区
        const siteInputContainer = document.createElement('div');
        siteInputContainer.style.display = 'flex';
        siteInputContainer.style.gap = '5px';
        siteInputContainer.style.padding = '5px 10px';

        const siteInput = document.createElement('input');
        siteInput.type = 'text';
        siteInput.placeholder = ' 输入站点关键词，注意区分大小写！';
        siteInput.style.flex = '1';

        const addSiteBtn = document.createElement('button');
        addSiteBtn.textContent = '添加';
        addSiteBtn.className = 'btn-add';

        siteInputContainer.appendChild(siteInput);
        siteInputContainer.appendChild(addSiteBtn);
        panel.appendChild(siteInputContainer);

        // 导入导出按钮区
        const ioContainer = document.createElement('div');
        ioContainer.style.display = 'flex';
        ioContainer.style.gap = '8px';
        ioContainer.style.padding = '10px';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出配置文件';
        exportBtn.className = 'btn-export';
        exportBtn.style.flex = '1'; // 占满一半

        const importBtn = document.createElement('button');
        importBtn.textContent = '导入配置文件';
        importBtn.className = 'btn-import';
        importBtn.style.flex = '1'; // 占满另一半

        // ✅ 新增：手动触发过滤按钮
        const manualFilterBtn = document.createElement('button');
        manualFilterBtn.textContent = '手动触发过滤';
        manualFilterBtn.className = 'btn-add';
        manualFilterBtn.style.flex = '1';
        manualFilterBtn.onclick = (e) => {
            e.stopPropagation(); // 防止冒泡触发站点的全局点击逻辑

            console.log('ℹ️手动触发过滤逻辑');
            filterContent(); // 调用主过滤函数
            filter731();
            // 兜底：确保面板仍在
            ensurePanelAlive(typeof initControlPanel === 'function' ? initControlPanel : null);
        };

        ioContainer.appendChild(exportBtn);
        ioContainer.appendChild(importBtn);
        ioContainer.appendChild(manualFilterBtn); // ✅ 添加到容器
        panel.appendChild(ioContainer);

        document.body.appendChild(panel);

        // 渲染列表函数
        function renderLists() {
            globalList.innerHTML = '';
            siteList.innerHTML = '';

            // 全局关键词列表
            getGlobalKeywords().forEach((kw, index) => {
                const li = document.createElement('li');
                const textSpan = document.createElement('span');
                textSpan.title = kw; // 鼠标悬停显示完整内容
                textSpan.textContent = `${index + 1}. ${kw}`;
                li.appendChild(textSpan);

                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.gap = '8px';

                // 移到站点
                const globalMoveBtn = document.createElement('button');
                globalMoveBtn.textContent = '移动';
                globalMoveBtn.className = 'btn-import';
                globalMoveBtn.onclick = (e) => {
                    e.stopPropagation(); // ✅ 阻止冒泡，避免触发外部点击关闭
                    const globalArr = getGlobalKeywords();
                    globalArr.splice(index, 1);
                    saveGlobalKeywords(globalArr);

                    const siteArr = getSiteKeywords();
                    if (!siteArr.includes(kw)) {
                        siteArr.push(kw);
                        saveSiteKeywords(siteArr);
                    }
                    renderLists();
                };
                btnContainer.appendChild(globalMoveBtn);

                // 修改
                const globalEditBtn = document.createElement('button');
                globalEditBtn.textContent = '修改';
                globalEditBtn.className = 'btn-edit';
                globalEditBtn.onclick = () => {
                    const inputEdit = document.createElement('input');
                    inputEdit.type = 'text';
                    inputEdit.value = kw;
                    li.replaceChild(inputEdit, textSpan);

                    const globalSaveBtn = document.createElement('button');
                    globalSaveBtn.textContent = '保存';
                    globalSaveBtn.className = 'btn-add';
                    globalSaveBtn.onclick = () => {
                        const arr = getGlobalKeywords();
                        arr[index] = inputEdit.value.trim();
                        saveGlobalKeywords(arr);
                        renderLists();
                        location.reload();
                    };

                    const globalCancelBtn = document.createElement('button');
                    globalCancelBtn.textContent = '取消';
                    globalCancelBtn.className = 'btn-import';
                    globalCancelBtn.onclick = () => renderLists();

                    btnContainer.innerHTML = '';
                    btnContainer.appendChild(globalSaveBtn);
                    btnContainer.appendChild(globalCancelBtn);
                };
                btnContainer.appendChild(globalEditBtn);

                // 删除
                const globalDelBtn = document.createElement('button');
                globalDelBtn.textContent = '删除';
                globalDelBtn.className = 'btn-delete';
                globalDelBtn.onclick = () => {
                    const arr = getGlobalKeywords();
                    arr.splice(index, 1);
                    saveGlobalKeywords(arr);
                    renderLists();
                    location.reload();
                };
                btnContainer.appendChild(globalDelBtn);

                li.appendChild(btnContainer);
                globalList.appendChild(li);
            });

            // 站点关键词列表
            getSiteKeywords().forEach((kw, index) => {
                const li = document.createElement('li');
                const textSpan = document.createElement('span');
                textSpan.title = kw; // 鼠标悬停显示完整内容
                textSpan.textContent = `${index + 1}. ${kw}`;
                li.appendChild(textSpan);

                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.gap = '8px';

                // 移到全局
                const siteMoveBtn = document.createElement('button');
                siteMoveBtn.textContent = '移动';
                siteMoveBtn.className = 'btn-import';
                siteMoveBtn.onclick = (e) => {
                    e.stopPropagation(); // ✅ 阻止冒泡
                    const siteArr = getSiteKeywords();
                    siteArr.splice(index, 1);
                    saveSiteKeywords(siteArr);

                    const globalArr = getGlobalKeywords();
                    if (!globalArr.includes(kw)) {
                        globalArr.push(kw);
                        saveGlobalKeywords(globalArr);
                    }
                    renderLists();
                };
                btnContainer.appendChild(siteMoveBtn);

                // 修改
                const siteEditBtn = document.createElement('button');
                siteEditBtn.textContent = '修改';
                siteEditBtn.className = 'btn-edit';
                siteEditBtn.onclick = () => {
                    const inputEdit = document.createElement('input');
                    inputEdit.type = 'text';
                    inputEdit.value = kw;
                    li.replaceChild(inputEdit, textSpan);

                    const siteSaveBtn = document.createElement('button');
                    siteSaveBtn.textContent = '保存';
                    siteSaveBtn.className = 'btn-add';
                    siteSaveBtn.onclick = () => {
                        const arr = getSiteKeywords();
                        arr[index] = inputEdit.value.trim();
                        saveSiteKeywords(arr);
                        renderLists();
                        location.reload();
                    };

                    const siteCancelBtn = document.createElement('button');
                    siteCancelBtn.textContent = '取消';
                    siteCancelBtn.className = 'btn-import';
                    siteCancelBtn.onclick = () => renderLists();

                    btnContainer.innerHTML = '';
                    btnContainer.appendChild(siteSaveBtn);
                    btnContainer.appendChild(siteCancelBtn);
                };
                btnContainer.appendChild(siteEditBtn);

                // 删除
                const siteDelBtn = document.createElement('button');
                siteDelBtn.textContent = '删除';
                siteDelBtn.className = 'btn-delete';
                siteDelBtn.onclick = () => {
                    const arr = getSiteKeywords();
                    arr.splice(index, 1);
                    saveSiteKeywords(arr);
                    renderLists();
                    location.reload();
                };
                btnContainer.appendChild(siteDelBtn);

                li.appendChild(btnContainer);
                siteList.appendChild(li);
            });
        }

        // 添加到全局/站点
        addGlobalBtn.onclick = () => {
            const newKw = globalInput.value.trim();
            if (!newKw) return;
            const arr = getGlobalKeywords();
            if (!arr.includes(newKw)) {
                arr.push(newKw);
                saveGlobalKeywords(arr);
                globalInput.value = '';
                renderLists();
                location.reload(); // ✅ 添加后刷新页面
            }
        };
        addSiteBtn.onclick = () => {
            const newKw = siteInput.value.trim();
            if (!newKw) return;
            const arr = getSiteKeywords();
            if (!arr.includes(newKw)) {
                arr.push(newKw);
                saveSiteKeywords(arr);
                siteInput.value = '';
                renderLists();
                location.reload(); // ✅ 添加后刷新页面
            }
        };

        // 导出：全局和所有站点分开存储
        exportBtn.onclick = () => {
            const data = {
                global: getGlobalKeywords(),
                sites: {}
            };
            const allKeys = GM_listValues();
            allKeys.forEach(key => {
                if (key.startsWith('siteKeywords_')) {
                    const hostname = key.replace('siteKeywords_', '');
                    const arr = GM_getValue(key, []);
                    if (Array.isArray(arr)) {
                        data.sites[hostname] = arr;
                    }
                }
            });
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'keywords.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        // 导入：分别恢复全局和所有站点
        importBtn.onclick = () => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'application/json';
            inputFile.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (imported.global && Array.isArray(imported.global)) {
                            saveGlobalKeywords(imported.global);
                        }
                        if (imported.sites) {
                            Object.keys(imported.sites).forEach(hostname => {
                                if (Array.isArray(imported.sites[hostname])) {
                                    saveSiteKeywords(imported.sites[hostname], hostname);
                                }
                            });
                        }
                        renderLists();
                    } catch (err) {
                        alert('导入失败: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            inputFile.click();
        };

        // 初始渲染
        renderLists();

        // 面板按钮（右下角）
        if (showButton) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'toggle-keyword-panel-btn';// ✅ 添加 id
            toggleBtn.textContent = '关键词面板';
            toggleBtn.className = 'btn-import';
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.bottom = '2px';
            toggleBtn.style.right = '0';
            toggleBtn.style.zIndex = '10001';
            toggleBtn.style.borderRadius = '4px 0 0 4px';
            toggleBtn.style.opacity = '0.7';// ✅ 半透明效果

            toggleBtn.onclick = () => {
                if (panel.style.transform === 'translateX(0%)') {
                    panel.style.transform = 'translateX(100%)';
                } else {
                    panel.style.transform = 'translateX(0%)';
                }
            };

            document.body.appendChild(toggleBtn);
            // 点击面板外部时自动关闭
            document.addEventListener('click', (e) => {
                const isClickInside = panel.contains(e.target) || toggleBtn.contains(e.target);
                if (!isClickInside && panel.style.transform === 'translateX(0%)') {
                    panel.style.transform = 'translateX(100%)'; // 收起面板
                }
            });
        }
    }

    window.addEventListener('load', initControlPanel);

    // 绑定蜜柑展开点击事件（保持原逻辑）
    document.addEventListener('click', function (e) {
        const span = e.target.closest('span.js-expand_bangumi');
        if (!span) return;
        const anBox = span.closest('div.an-box.animated.fadeIn');
        if (!anBox) return;
        const frame = anBox.nextElementSibling;
        if (!frame || !frame.classList.contains('an-res-row-frame')) return;
        console.log('🔍检测到展开的 frame，开始过滤');
        filterMikanFrame(frame);
        const observer = new MutationObserver(() => {
            filterMikanFrame(frame);
        });
        observer.observe(frame, { childList: true, subtree: true });
    });
})();