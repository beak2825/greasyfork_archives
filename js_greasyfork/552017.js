// ==UserScript==
// @name         知乎排序增强
// @namespace    https://github.com/
// @version      2.0
// @description  通过左下角悬浮按钮，在弹窗中展示知乎内容的赞同数降序排序结果，并支持导出为CSV表格。
// @author       pixelpulse
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/search*
// @match        https://www.zhihu.com/question/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552017/%E7%9F%A5%E4%B9%8E%E6%8E%92%E5%BA%8F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552017/%E7%9F%A5%E4%B9%8E%E6%8E%92%E5%BA%8F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
/*
 * =================================================================================================
 * 【重要声明及使用条款 / Important Disclaimer and Terms of Use】
 *
 * 1. **脚本目的 (Purpose of the Script):**
 * 本脚本（知乎排序增强）仅为个人学习和技术交流目的而开发。其核心功能是为用户提供一种客户端内容排序
 * 和索引导出的辅助功能，旨在改善个人信息筛选和整理的效率。本脚本非官方出品，与知乎（Zhihu.com）
 * 没有任何关联。
 *
 * 2. **数据与版权 (Data and Copyright):**
 * 本脚本处理的所有内容（包括但不限于文字、链接、数据）的版权、数据权及其他所有权，均归属于知乎平台
 * 及其内容创作者所有。本脚本仅在用户浏览器端对已加载的数据进行临时性、非侵入式的处理，并未对源数据
 * 进行任何形式的修改、破解或存储。
 *
 * 3. **【特别条款】关于“导出为.csv”功能 (SPECIAL CLAUSE regarding "Export to .csv" feature):**
 * a. **性质界定 (Definition of Nature):** 本功能导出的数据仅包含【标题、链接、赞同数】等核心元数据。
 * 其性质是为用户个人备份或分析创建内容的“索引”或“目录”，并非内容本身的完整复制。
 * b. **使用限制 (Usage Restrictions):** 用户承诺，通过本功能导出的.csv文件将严格用于【个人、非商业性】
 * 用途（如个人资料整理、学习分析）。
 * c. **严禁行为 (Prohibited Actions):** 【严禁】将导出的数据用于任何商业目的、进行二次分发、公开展示，
 * 或用于构建与知乎存在竞争关系的产品或服务。【严禁】利用本功能进行自动化、批量、系统性的数据提取，
 * 或从事任何可能损害知乎或内容创作者利益的行为。
 *
 * 4. **风险与责任 (Risk and Liability):**
 * 本脚本按“原样”提供，作者不对其功能的完整性、准确性、稳定性或永久可用性作任何明示或暗示的保证。
 * 用户因使用本脚本（包括其导出功能）而产生的任何直接或间接后果，包括但不限于数据丢失、账户风险或
 * 与知乎《用户协议》可能产生的冲突，【均由用户本人承担全部责任】。作者对此不承担任何法律或经济责任。
 *
 * 5. **接受条款 (Acceptance of Terms):**
 * 一旦您选择安装并使用本脚本，即表示您已完整阅读、充分理解并同意遵守以上所有条款。如果您不同意
 * 任何条款，请立即停止使用并卸载本脚本。
 *
 * 请在遵守相关法律法规及知乎平台规定的前提下，合理、负责地使用本脚本。
 * =================================================================================================
 */
(function () {
    'use strict';

    const LOG_PREFIX = "知乎排序增强 v2.0:";
    console.log(`${LOG_PREFIX} 脚本已启动。`);

    // --- 全局CSS样式注入 ---
    GM_addStyle(`
        /* 弹窗遮罩层 */
        .sorter-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9998; display: flex; align-items: center; justify-content: center; }
        /* 弹窗主体 */
        .sorter-modal-content { background-color: #fff; color: #121212; border-radius: 8px; width: 80%; max-width: 800px; height: 80%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        /* 弹窗头部 */
        .sorter-modal-header { padding: 12px 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .sorter-modal-title { font-size: 16px; font-weight: 600; }
        .sorter-modal-close { font-size: 24px; font-weight: bold; cursor: pointer; border: none; background: none; padding: 0 8px; margin-left: auto; }
        /* 弹窗内容区域 */
        .sorter-modal-body { overflow-y: auto; padding: 8px 16px; }
        /* 排序结果的每一行 */
        .sorted-item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: left; }
        /*  排名/序号列样式 */
        .sorted-item-rank { font-size: 14px; font-weight: bold; color: #6c757d; flex-shrink: 0; width: 60px; text-align: center; }
        /* 赞同数样式 */
        .sorted-item-votes { font-size: 14px; font-weight: bold; color: #1772F6; flex-shrink: 0; width: 100px; }
        .sorted-item-details { flex-grow: 1; min-width: 0; }
        .sorted-item-title { font-size: 15px; color: #121212; text-decoration: none; display: block; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sorted-item-title:hover { color: #0084ff; }
        /* 按钮通用样式 */
        .sorted-item-button { font-size: 12px; padding: 3px 8px; margin-right: 8px; border: 1px solid #ccc; border-radius: 3px; background: #f9f9f9; cursor: pointer; text-decoration: none; color: #333; }
        .sorted-item-button:hover { background: #eee; border-color: #bbb; }
        /* 导出按钮特殊样式 */
        #export-csv-btn { background-color: #28a745; color: white; border-color: #28a745; }
    `);

    // --- 全局配置与状态管理 ---
    const voteSelector = 'button[aria-label^="赞同"]';
    const pageConfigs = {
        question: { itemSelector: '.Question-main .List-item', voteSelector: voteSelector, titleSelector: null },
        search: { itemSelector: '.SearchResult-Card', voteSelector: voteSelector, titleSelector: 'h2.ContentItem-title a' },
        feed: { itemSelector: '.TopstoryItem', voteSelector: voteSelector, titleSelector: '.ContentItem-title a' }
    };
    let collectedData = []; // 用于存储所有抓取到的项目数据

    // --- 核心功能函数 ---

    function detectPageType() {
        const { hostname, pathname } = window.location;
        if (hostname === 'www.zhihu.com') {
            if (pathname.startsWith('/question/')) return 'question';
            if (pathname.startsWith('/search')) return 'search';
            if (pathname === '/' || pathname.startsWith('/follow')) return 'feed';
        }
        return null;
    }

    function parseVoteCount(voteText) {
        if (!voteText || typeof voteText !== 'string') return 0;
        const match = voteText.replace(/,/g, '').match(/([\d.]+)\s*([kKwW万]?)/);
        if (!match) return 0;
        let num = parseFloat(match[1]);
        const unit = match[2] ? match[2].toLowerCase() : '';
        if (unit === 'k') num *= 1000;
        else if (unit === 'w' || unit === '万') num *= 10000;
        return isNaN(num) ? 0 : Math.round(num);
    }

    // --- [新模块] 排序、弹窗与导出 ---

    /**
     * 关闭并移除排序结果弹窗。
     */
    function closeSortModal() {
        const modal = document.getElementById('sorter-modal');
        if (modal) { document.body.removeChild(modal); }
    }

    /**
     * 在弹窗中动态生成并显示排序结果。
     * @param {Array} sortedItems - 已排序的项目数据数组。
     */
    function displaySortModal(sortedItems) {
        closeSortModal();
        const overlay = document.createElement('div');
        overlay.id = 'sorter-modal';
        overlay.className = 'sorter-modal-overlay';

        let modalHtml = `
            <div class="sorter-modal-content">
                <div class="sorter-modal-header">
                    <span class="sorter-modal-title">排序结果 (${sortedItems.length} 条)</span>
                    <button id="export-csv-btn" class="sorted-item-button">导出为表格</button>
                    <button class="sorter-modal-close">&times;</button>
                </div>
                <div class="sorter-modal-body">
        `;

        if (sortedItems.length === 0) {
            modalHtml += '<p style="text-align: center; padding: 20px;">暂无数据。请尝试在页面上滚动加载更多内容。</p>';
        } else {
            sortedItems.forEach((item, index) => {
                modalHtml += `
                    <div class="sorted-item">
                        <div class="sorted-item-rank">#${index + 1}</div>
                        <div class="sorted-item-votes">👍 ${item.votesText}</div>
                        <div class="sorted-item-details">
                            <a class="sorted-item-title" href="${item.url}" target="_blank" title="${item.title.replace(/"/g, '&quot;')}">${item.title}</a>
                        </div>
                    </div>
                `;
            });
        }
        modalHtml += `</div></div>`;
        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay);

        if (sortedItems.length > 0) {
            overlay.querySelector('#export-csv-btn').addEventListener('click', () => exportToCsv(sortedItems));
        }

        overlay.querySelector('.sorter-modal-close').addEventListener('click', closeSortModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSortModal(); });
    }

    /**
     * 将排序结果导出为CSV文件。
     * @param {Array} data - 已排序的数据数组。
     */
    function exportToCsv(data) {
        let csvContent = '"排名","赞同数","标题","链接"\n';
        data.forEach((item, index) => {
            const rank = index + 1;
            const votes = item.votes;
            const name = `"${item.title.replace(/"/g, '""')}"`; // 处理标题中的双引号
            const url = item.url;
            csvContent += `${rank},${votes},${name},${url}\n`;
        });

        // 创建并下载文件
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "知乎内容排序结果.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 主流程与UI创建 ---

    /**
     * 主流程函数：抓取、排序并调用显示。
     * @param {object} config - 当前页面的配置对象。
     * @param {HTMLElement} button - 主排序按钮。
     */
    function processAndShowSortedList(config, button) {
        button.textContent = '抓取中...';
        button.disabled = true;

        const items = Array.from(document.querySelectorAll(config.itemSelector));
        if (items.length === 0) {
            displaySortModal([]);
            button.textContent = '排序'; button.disabled = false;
            return;
        }

        collectedData = []; // 清空旧数据
        items.forEach(item => {
            const voteElement = item.querySelector(config.voteSelector);
            if (!voteElement) return;

            const votes = parseVoteCount(voteElement.getAttribute('aria-label') || voteElement.innerText);
            const votesText = (voteElement.innerText.replace('赞同', '').trim() || '0');

            let title = '无标题';
            let url = '#';

            if (config.titleSelector === null) {
                const questionTitleEl = document.querySelector('.QuestionHeader-title');
                title = questionTitleEl ? `回答: ${questionTitleEl.innerText}` : '回答';
                const answerLinkEl = item.querySelector('meta[itemprop="url"]');
                url = answerLinkEl ? answerLinkEl.content : item.querySelector('a[data-za-detail-view-element_name="Title"]')?.href || '#';
            } else {
                const titleElement = item.querySelector(config.titleSelector);
                if (titleElement) {
                    title = titleElement.innerText.trim();
                    url = titleElement.href;
                }
            }
            collectedData.push({ votes, votesText, title, url });
        });

        collectedData.sort((a, b) => b.votes - a.votes);

        button.textContent = '排序';
        button.disabled = false;
        displaySortModal(collectedData);
    }

    /**
     * 创建并向页面添加左下角的悬浮排序按钮。
     */
    function createFixedButton(config) {
        if (document.getElementById('zhihu-sorter-btn')) return;
        const button = document.createElement('button');
        button.id = 'zhihu-sorter-btn';
        button.textContent = '排序';
        Object.assign(button.style, {
            position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999',
            padding: '10px 15px', fontSize: '14px', color: '#fff',
            backgroundColor: '#0084ff', border: 'none', borderRadius: '5px',
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
        });
        button.addEventListener('click', () => processAndShowSortedList(config, button));
        document.body.appendChild(button);
        console.log(`${LOG_PREFIX} 悬浮按钮创建成功。`);
    }

    /**
     * 脚本的启动入口函数，使用 MutationObserver 智能等待内容加载。
     */
    function initialize() {
        const pageType = detectPageType();
        if (!pageType) return;

        const config = pageConfigs[pageType];
        console.log(`${LOG_PREFIX} 已识别页面为 [${pageType}]`);
        console.log(`${LOG_PREFIX} 正在等待第一个内容项出现: ${config.itemSelector}`);

        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(config.itemSelector)) {
                console.log(`${LOG_PREFIX} 第一个内容项已出现, 正在创建按钮...`);
                createFixedButton(config);
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 运行启动函数
    initialize();

})();