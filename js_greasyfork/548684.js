// ==UserScript==
// @name         DBD-RawsBanHelper
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  过滤动漫花园、末日动漫、Nyaa和蜜柑计划中的DBD-Raws与731学院内容，并修复行颜色问题
// @description:zh-CN  3.0更新内容：1、重置了所有的过滤方法。2、过滤内容输出在F12控制台并调整了样式。3、新增了过滤词面板，鉴于有人不喜欢页面多东西，故放在了右下角不起眼的地方，并在油猴拓展管理处添加了开关。4、自定义过滤词本地存储化（妈妈再也不用担心更新前忘记存自己的过滤词了）。
// @license      MIT
// @match        *://*.dmhy.org/*
// @match        *://*.acgnx.se/*
// @match        *://nyaa.land/*
// @match        *://nyaa.si/*
// @match        *://mikanani.me/*
// @match        *://mikanani.kas.pub/*
// @exclude      *://u2.dmhy.org/showup.php
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置对象：包含目标关键词和过滤类名
    const config = {
        targetKeywords: ['DBD-Raws', 'DBD制作组', 'DBD製作組', 'DBD转发', 'DBD轉發', 'DBD-SUB', 'DBD字幕组', 'DBD字幕組', 'DBD代发', 'DBD代發', 'DBD代传', 'DBD代傳', 'DBD转载', 'DBD轉載', 'DBD自购', 'DBD自購', 'DBD&', '&DBD', '[DBD]','[TOC]',
            '我的英雄学院', '我的英雄學院', 'Boku no Hero Academia', 'Boku No Hero Academia', 'My Hero Academia', 'My.Hero.Academia', 'Boku.no.Hero.Academia', 'Boku.No.Hero.Academia', 'My_Hero_Academia', 'Boku_no_Hero_Academia', '僕のヒーローアカデミア',
        ],
    };

    // 记录过滤结果的函数
    function logFilterResult(matchedKeywords, removedTexts, removedCount) {
        if (removedCount > 0) {
            console.log(`🔍匹配关键词: 『${Array.from(matchedKeywords).join('、')}』，共过滤 ${removedCount} 条内容,过滤的内容如下:`);
            removedTexts.forEach((text, index) => {
                console.log(`✅${index + 1}. ${text}`);
            });
        } else {
            console.log('❌没啥可过滤的');
        }
    }

    // 监听点击事件，处理蜜柑计划展开的子组
    document.addEventListener('click', function (e) {
        // 定位到展开按钮
        const span = e.target.closest('span.js-expand_bangumi');
        if (!span) return;

        // 找到父容器
        const anBox = span.closest('div.an-box.animated.fadeIn');
        if (!anBox) return;

        // 找到展开的内容框架
        const frame = anBox.nextElementSibling;
        if (!frame || !frame.classList.contains('an-res-row-frame')) return;

        console.log('🔍检测到展开的 frame，开始过滤');
        filterMikanFrame(frame);

        // 监听frame内容变化
        const observer = new MutationObserver(() => {
            filterMikanFrame(frame);
        });
        observer.observe(frame, { childList: true, subtree: true });
    });

    // 过滤特定内容（731学院）
    function filter731() {
        const bullshits = document.querySelectorAll('[title~=我的英雄学院]');
        bullshits.forEach(bullshit => {
            // 根据页面类型选择不同的父节点删除策略
            if (window.location.href.includes('/Home/Search')) {
                bullshit.parentNode.parentNode.parentNode.parentNode.remove();
            } else {
                bullshit.parentNode.parentNode.parentNode.remove();
            }
        });
    }

    // 过滤蜜柑计划展开的子组内容
    function filterMikanFrame(frame) {
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        // 获取所有子组列表项
        const lis = frame.querySelectorAll('li.js-expand_bangumi-subgroup');
        lis.forEach(li => {
            const tag = li.querySelector('.sk-col.tag-res-name');
            if (tag) {
                const text = tag.textContent.trim();
                const title = tag.getAttribute('title') || '';
                // 检查是否匹配关键词
                const hit = config.targetKeywords.find(keyword => text.includes(keyword) || title.includes(keyword));
                if (hit) {
                    matchedKeywords.add(hit);
                    removedTexts.push(text);
                    removedCount++;
                    li.remove(); // 删除匹配的列表项
                }
            }
        });

        // 调用额外的过滤逻辑
        filter731();
        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划列表模式
    function filterMikanList() {
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
            // 检查是否匹配关键词
            const hit = config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove(); // 删除整行
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划搜索模式
    function filterMikanSearch() {
        filter731();
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        // 过滤侧边栏
        const sidebarLis = document.querySelectorAll('#sk-container .leftbar-container ul li');
        sidebarLis.forEach(li => {
            const link = li.querySelector('span a');
            if (!link) return;

            const text = link.textContent.trim();
            // 特殊处理TOC关键词
            const hit = (text.includes("TOC") ? "TOC" : null) || config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                li.remove(); // 删除侧边栏项
            }
        });

        // 过滤主表格
        const rows = document.querySelectorAll('#sk-container table tbody tr');
        rows.forEach(row => {
            const td = row.querySelector('td:nth-child(2)');
            if (!td) return;

            const link = td.querySelector('a');
            if (!link) return;

            const text = link.textContent.trim();
            const hit = config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove(); // 删除整行
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 过滤蜜柑计划番剧模式
    function filterMikanBangumi() {
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        // 过滤侧边栏
        const sidebarLis = document.querySelectorAll('#sk-container .leftbar-container ul li');
        sidebarLis.forEach(li => {
            const link = li.querySelector('span a');
            if (!link) return;

            const text = link.textContent.trim();
            // 特殊处理TOC关键词
            const hit = (text.includes("TOC") ? "TOC" : null) || config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                li.remove();
            }
        });

        // 过滤主内容区的字幕组
        const subgroupDivs = document.querySelectorAll('div.subgroup-text[id]');
        subgroupDivs.forEach(subgroupDiv => {
            const link = subgroupDiv.querySelector('a');
            if (!link) return;

            const text = link.textContent.trim();
            // 特殊处理TOC关键词
            const hit = (text.includes("TOC") ? "TOC" : null) || config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;

                // 删除字幕组及其相关元素（前后共5个元素）
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

    // 过滤动漫花园内容
    function filterDmhyContent() {
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const table = document.querySelector('#topic_list');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // 定位到第三列（标题列）
            const td = row.querySelector('td:nth-child(3)');
            if (!td) return;

            const link = td.querySelector('a[target]');
            const text = (link?.textContent || row.textContent).trim();
            const hit = config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove(); // 删除整行
            }
        });

        // 重新为剩余行添加交替背景色
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

    // 过滤末日动漫内容
    function filterAcgnxContent() {
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const table = document.querySelector('#data_list');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            // 定位到第三列（标题列）
            const td = row.querySelector('td:nth-child(3)');
            if (!td) return;

            const text = td.textContent.trim();
            const hit = config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove(); // 删除整行
            }
        });

        // 重新为剩余行添加交替背景色
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

    // 过滤Nyaa内容
    function filterNyaaContent() {
        const matchedKeywords = new Set();
        const removedTexts = [];
        let removedCount = 0;

        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            // 定位到第二列（标题列）
            const td = row.querySelector('td:nth-child(2)');
            if (!td) return;

            const text = td.textContent.trim();
            const hit = config.targetKeywords.find(keyword => text.includes(keyword));
            if (hit) {
                matchedKeywords.add(hit);
                removedTexts.push(text);
                removedCount++;
                row.remove(); // 删除整行
            }
        });

        logFilterResult(matchedKeywords, removedTexts, removedCount);
    }

    // 主过滤函数：根据当前页面调用对应的过滤方法
    function filterContent() {
        // 延迟执行以确保页面完全加载
        setTimeout(() => {
            console.clear();
            console.log('ℹ️DBD-RawsBanHelper初始化完成，开始执行！');

            // 根据域名和路径决定使用哪种过滤方法
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
                // 蜜柑计划首页需要等待用户点击展开
            }
        }, 500);
    }

    // 页面加载完成后执行主过滤函数
    window.addEventListener('load', filterContent);

    // 监听DOM变化，持续过滤特定内容
    window.addEventListener('load', () => {
        const targetNode = document.querySelector('#sk-body');
        if (!targetNode) return;

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(() => {
            filter731();
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    });

    // 保存关键词
    function saveKeywords() {
        localStorage.setItem('DBD_RawsBanHelper_keywords', JSON.stringify(config.targetKeywords));
    }

    // 初始化控制面板（抽屉式）
    function initControlPanel() {
        const showButton = GM_getValue('showButton', true);

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'filter-config-panel';
        panel.style.cssText = `
        position: fixed;
        top: 15%;               /* 距离顶部留白 */
        right: 0;
        width: 360px;              /* 面板宽度调大 */
        height: 70%;            /* 不占满整个高度 */
        background: #fff;
        border-left: 1px solid #ccc;
        box-shadow: -4px 0 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        transform: translateX(100%); /* 默认隐藏在右侧 */
        transition: transform 0.3s ease;
        border-radius: 8px 0 0 8px;  /* 上下圆角 */
    `;

        const title = document.createElement('div');
        title.textContent = '过滤关键词控制面板';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.padding = '10px';
        title.style.borderBottom = '1px solid #ddd';
        panel.appendChild(title);

        // 列表容器
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '10px';
        list.style.margin = '0';
        list.style.flex = '1';
        list.style.overflowY = 'auto';
        panel.appendChild(list);

        // 底部容器
        const bottomContainer = document.createElement('div');
        bottomContainer.style.padding = '10px';
        bottomContainer.style.borderTop = '1px solid #ddd';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.marginBottom = '8px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入新的关键词，注意大小写敏感！';
        input.style.flex = '1';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        inputContainer.appendChild(input);

        const addBtn = document.createElement('button');
        addBtn.textContent = '添加';
        addBtn.style.marginLeft = '8px';
        addBtn.style.background = '#4CAF50';
        addBtn.style.color = '#fff';
        addBtn.style.border = 'none';
        addBtn.style.borderRadius = '4px';
        addBtn.style.cursor = 'pointer';
        inputContainer.appendChild(addBtn);

        bottomContainer.appendChild(inputContainer);

        // 导入导出按钮
        const ioContainer = document.createElement('div');
        ioContainer.style.display = 'flex';
        ioContainer.style.justifyContent = 'space-between';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出';
        exportBtn.style.flex = '1';
        exportBtn.style.marginRight = '5px';
        exportBtn.style.background = '#2196F3';
        exportBtn.style.color = '#fff';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.cursor = 'pointer';

        const importBtn = document.createElement('button');
        importBtn.textContent = '导入';
        importBtn.style.flex = '1';
        importBtn.style.marginLeft = '5px';
        importBtn.style.background = '#FF9800';
        importBtn.style.color = '#fff';
        importBtn.style.border = 'none';
        importBtn.style.borderRadius = '4px';
        importBtn.style.cursor = 'pointer';

        ioContainer.appendChild(exportBtn);
        ioContainer.appendChild(importBtn);
        bottomContainer.appendChild(ioContainer);

        panel.appendChild(bottomContainer);
        document.body.appendChild(panel);

        // 渲染列表
        function renderList() {
            list.innerHTML = '';
            const saved = JSON.parse(localStorage.getItem('DBD_RawsBanHelper_keywords')) || config.targetKeywords;
            config.targetKeywords = saved;

            config.targetKeywords.forEach((kw, index) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '4px 0';

                // 序号 + 关键词
                const textSpan = document.createElement('span');
                textSpan.textContent = `${index + 1}. ${kw}`;
                li.appendChild(textSpan);

                const btnContainer = document.createElement('div');

                // 修改按钮
                const editBtn = document.createElement('button');
                editBtn.textContent = '修改';
                editBtn.style.background = '#FF9800';
                editBtn.style.color = '#fff';
                editBtn.style.border = 'none';
                editBtn.style.borderRadius = '4px';
                editBtn.style.cursor = 'pointer';
                editBtn.style.marginRight = '5px';
                editBtn.onclick = () => {
                    const newKw = prompt('请输入新的关键词，注意大小写敏感！', kw);
                    if (newKw && newKw.trim()) {
                        config.targetKeywords[index] = newKw.trim();
                        saveKeywords();
                        renderList();
                        location.reload();
                    }
                };
                btnContainer.appendChild(editBtn);

                // 删除按钮
                const delBtn = document.createElement('button');
                delBtn.textContent = '删除';
                delBtn.style.background = '#f44336';
                delBtn.style.color = '#fff';
                delBtn.style.border = 'none';
                delBtn.style.borderRadius = '4px';
                delBtn.style.cursor = 'pointer';
                delBtn.onclick = () => {
                    config.targetKeywords.splice(index, 1);
                    saveKeywords();
                    renderList();
                    location.reload();
                };
                btnContainer.appendChild(delBtn);

                li.appendChild(btnContainer);
                list.appendChild(li);
            });
        }

        addBtn.onclick = () => {
            const newKw = input.value.trim();
            if (newKw && !config.targetKeywords.includes(newKw)) {
                config.targetKeywords.push(newKw);
                saveKeywords();
                input.value = '';
                renderList();
                location.reload();
            }
        };

        // 导出功能
        exportBtn.onclick = () => {
            const blob = new Blob([JSON.stringify(config.targetKeywords, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'keywords.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        // 导入功能
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
                        if (Array.isArray(imported)) {
                            config.targetKeywords = imported;
                            saveKeywords();
                            renderList();
                            location.reload();
                        } else {
                            alert('导入文件格式错误');
                        }
                    } catch (err) {
                        alert('导入失败: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            inputFile.click();
        };

        renderList();

        // 创建按钮
        function createToggleBtn() {
            if (document.getElementById('filter-toggle-btn')) return;
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'filter-toggle-btn';
            toggleBtn.textContent = '过滤词面板';
            toggleBtn.style.cssText = `
            position: fixed;
            bottom: 2.5px;
            right: 20px;
            background: rgba(33,150,243,0.8);
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `;
            toggleBtn.onclick = () => {
                if (panel.style.transform === 'translateX(0%)') {
                    panel.style.transform = 'translateX(100%)';
                } else {
                    panel.style.transform = 'translateX(0%)';
                }
            };
            document.body.appendChild(toggleBtn);
        }

        function removeToggleBtn() {
            const btn = document.getElementById('filter-toggle-btn');
            if (btn) btn.remove();
        }

        if (showButton) createToggleBtn();

        GM_registerMenuCommand(showButton ? '隐藏关键词按钮' : '显示关键词按钮', () => {
            const current = GM_getValue('showButton', true);
            const newState = !current;
            GM_setValue('showButton', newState);
            if (newState) {
                createToggleBtn();
            } else {
                removeToggleBtn();
                panel.style.transform = 'translateX(100%)';
            }
        });
    }

    // 页面加载完成后初始化控制面板
    window.addEventListener('load', initControlPanel);
})();