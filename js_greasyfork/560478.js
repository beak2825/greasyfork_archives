// ==UserScript==
// @name         bh3helper-剧情文本下载器
// @namespace    4b8b542a-3500-49bd-b857-8d62413434c7
// @version      0.3.3
// @description  从bh3helper下载崩坏3剧情文本的辅助脚本|崩坏三|崩坏3|剧情文本
// @author       -
// @match        https://bh3helper.xrysnow.xyz/*
// @icon         https://bh3helper.xrysnow.xyz/res/img/favicon.png
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://unpkg.com/add-css-constructed@1.1.1/dist/umd.js
// @inject-into  page
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/560478/bh3helper-%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560478/bh3helper-%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

((async function (window) {
    const CONFIG = {
        SHADOW_ROOT_MODE: "closed",
        CONTENT_WAIT_TIMEOUT: 10000,
        DIALOG_SWITCH_CD_TIME: 65,
    };

    // ---------- //

    const { document } = window;

    // ---------- //

    // State load
    const state = new Proxy(Object.create(null), {
        get(target, property, receiver) {
            try { return JSON.parse(GM_getValue(property, "null") || "null"); } catch { return null }
        },
        set(target, property, value, receiver) {
            GM_setValue(property, JSON.stringify(value));
            return true;
        },
        deleteProperty(target, property) {
            GM_deleteValue(property);
            return true;
        },
        ownKeys(target) {
            return GM_listValues();
        },
    });

    // ---------- //

    // Initial
    if (state.search_maxResultCount && window.location.pathname === '/pages/search.html') {
        window.SearchScriptEx = function () {
            Util.setPageBackground();
            const searchPage = new SearchPage();
            searchPage.updateMaxResultCount(state.search_maxResultCount);
            searchPage.make();
        };
    } // 这一步会在document-start执行

    // ---------- //

    // UI

    function createUi() {
        const ui_container = document.createElement('div');
        const ui_root = ui_container.attachShadow({ mode: CONFIG.SHADOW_ROOT_MODE });
        addCSS(`
        :host {
            all: initial;
        }
        [hidden] {
            display: none !important;
        }
        #panel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 1;
            border: 1px solid #ccc;
            padding: 5px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        #panel:empty {
            display: none;
        }
        .operation-btn {
            padding: 5px 10px;
            background-color: #4285f4;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 350px;
            word-wrap: break-word;
        }
        .message[data-type="info"] {
            background-color: #4285f4;
            color: #fff;
        }
        .message[data-type="error"] {
            background-color: #ea4335;
            color: #fff;
        }
        .message {
            animation: messageFadeIn 0.3s ease-out;
        }
        .message.fade-out {
            animation: messageFadeOut 0.3s ease-in forwards;
        }
        @keyframes messageFadeIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes messageFadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        #loading_indicator {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            word-break: break-all;
            background-color: #4285f4;
            color: #fff;
            text-align: center;
        }
        #loading_indicator_overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }
        `, ui_root);

        const loading_indicator_overlay = document.createElement('div');
        loading_indicator_overlay.id = 'loading_indicator_overlay';
        loading_indicator_overlay.hidden = true;
        ui_root.append(loading_indicator_overlay);

        const loading_indicator = document.createElement('div');
        loading_indicator.id = 'loading_indicator';
        loading_indicator.innerText = '';
        loading_indicator.hidden = true;
        loading_indicator.show = () => {
            loading_indicator.hidden = false;
            loading_indicator_overlay.hidden = false;
        };
        loading_indicator.hide = () => {
            loading_indicator.hidden = true;
            loading_indicator_overlay.hidden = true;
        };
        ui_root.append(loading_indicator);

        const panel = document.createElement('div');
        panel.id = 'panel';
        ui_root.append(panel);

        const download_current_all = document.createElement('button');
        download_current_all.id = 'download_current_all';
        download_current_all.className = 'operation-btn';
        download_current_all.textContent = '下载本页所有剧情';
        panel.append(download_current_all);

        const force_set_search_max_result_count = document.createElement('button');
        force_set_search_max_result_count.id = 'force_set_search_max_result_count';
        force_set_search_max_result_count.className = 'operation-btn';
        force_set_search_max_result_count.textContent = '设置搜索最大结果数';
        panel.append(force_set_search_max_result_count);

        document.body.append(ui_container);
        return {
            container: ui_container,
            root: ui_root,
            loading_indicator,
            loading_indicator_overlay,
            download_current_all,
            force_set_search_max_result_count,
        };
    }

    /**
     * @type {ReturnType<createUi>}
     */
    const ui = await new Promise(resolve => {
        if (window.document.readyState === 'complete') {
            resolve(createUi());
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve(createUi());
            }, { once: true });
        }
    }); // 从这里开始执行时机都是DOMContentLoaded之后了

    ui.download_current_all.addEventListener('click', downloadCurrentAll);
    ui.force_set_search_max_result_count.addEventListener('click', setMaxSearchLimit);
    
    // 根据当前URL显示/隐藏UI元素
    if (window.location.pathname !== '/pages/common.html') 
        ui.download_current_all.remove();
    if (window.location.pathname !== '/pages/search.html')
        ui.force_set_search_max_result_count.remove();

    // ---------- //

    // Functions
    async function downloadCurrentAll() {
        // 下载当前页面所有剧情
        const result = [];
        ui.loading_indicator.show();
        ui.loading_indicator.innerText = '正在下载...';

        try {
            // 1. 获取所有 .external-link
            const main_content = document.getElementById('main-content');
            const buttons_to_be_clicked = main_content.querySelectorAll('div.external-link:not(:empty)'); // 注意必须是div，而不是<a>，<a>是真·外链
            let skipCount = 0;

            const updateProgress = (current, desc = '') => {
                ui.loading_indicator.innerText = `正在处理第 ${current} (共 ${buttons_to_be_clicked.length} 个)\n${desc || '\u2060'}`;
            };
            updateProgress(0);

            // 2. 依次点击按钮以加载内容
            let current = 0;
            for (const button of buttons_to_be_clicked) {
                current++;
                //if (!button.innerText) continue; //已经通过CSS选择器排除
                updateProgress(current);
                button.click();
                // 3. 等待内容加载完成
                const contentDialog = await waitForElement('.dialog-viewer-wrapper:not([style*="display: none"])', CONFIG.CONTENT_WAIT_TIMEOUT, main_content).then(element => element).catch(() => null);
                if (!contentDialog) {
                    console.log(`[bh3helper-downloader] W: 点击按钮 "${button.innerText}" 后未加载出内容对话框`);
                    skipCount += 1;
                    continue; // 跳过
                }
                if (contentDialog.classList.contains('dialog-embedded')) continue;
                updateProgress(current, button.innerText);
                // 4. 提取对话内容
                const contents = [];
                const title = contentDialog.querySelector('.dialog-stage-title')?.innerText || contentDialog.querySelector('.dialog-title')?.innerText || '';
                const contentTables = contentDialog.querySelectorAll('.dialog-viewer-container > .dialog-viewer > .content-table');
                for (const table of contentTables) {
                    const rows = table.querySelectorAll('tbody>tr');
                    for (const row of rows) {
                        const [column1, column2] = row.childNodes;
                        if (!column1) continue;
                        if (!column2) {
                            const column1text = column1.innerText.trim();
                            if (column1text !== "") contents.push(column1text);
                            continue;
                        }
                        // 5. 判断类型
                        if (column1.querySelector(".dialog-actor > .dialog-actor-option")) {
                            // 选项
                            const dao = column1.querySelector('.dialog-actor-option');
                            const optionText = (dao && dao.innerText) ? `${dao.innerText}：` : '';
                            const options = column2.querySelectorAll('.dialog-line-option');
                            for (const option of options) {
                                contents.push(`${optionText}${option.innerText}`);
                            }
                        }
                        else {
                            // 对话
                            const actor = column1.innerText ? `${column1.innerText}：` : '';
                            const lines = column2.querySelectorAll('.dialog-line') || [column2];
                            for (const line of lines) {
                                if (line.classList.contains('dialog-step')) contents.push(`· ${line.innerText}`);
                                else if (line.classList.contains('dialog-synopsis-line')) contents.push(`> ${line.innerText}`);
                                else contents.push(`${actor}${line.innerText}`);
                            }
                        }
                    }
                    // table和table之间有一个空行
                    contents.push('');
                }
                // 6. 合并内容
                result.push(`【${title}】\n${contents.join('\n')}\n`);
                result.push('-----\n\n');
                // 7. 关闭当前对话框
                const closeButton = contentDialog.querySelector('.dialog-btn-wrapper > .dialog-button.dialog-fs-button > .fa.fa-remove');
                if (closeButton) closeButton.click();
                else contentDialog.style.display = 'none'; // 手动关闭
                // 8. 冷却
                await new Promise(resolve => setTimeout(resolve, CONFIG.DIALOG_SWITCH_CD_TIME)); // 处理速度太快会导致浏览器渲染跟不上😂，只能放慢一点了
            }

            // 9. 合并所有内容
            result.pop();
            const blob = new Blob(result, { type: 'text/plain;charset=utf-8' });
            // 10. 获取页面标题，生成文件名
            const pageTitle = main_content.querySelector('.content-title-wrapper > .main-title')?.innerText || document.title;
            // 11. 下载文件
            DownloadFile(URL.createObjectURL(blob), `${pageTitle}.txt`);
            showMessage(skipCount ? `下载完成（已跳过 ${skipCount} 个）` : "下载完成！");
            // 12. 清理资源
            setTimeout(() => {
                URL.revokeObjectURL(blob);
            }, 5000);
        } catch (error) {
            showMessage("下载失败: " + error, 'error');
            console.error('[bh3helper-downloader] download failed:', error);
        } finally {
            ui.loading_indicator.hide();
        }
    }

    async function setMaxSearchLimit() {
        const value = prompt('请输入最大搜索结果数（默认100）', '100');
        if (!value) return;
        const maxResultCount = parseInt(value, 10);
        if (isNaN(maxResultCount) || maxResultCount <= 0) {
            showMessage('请输入一个大于0的整数', 'error');
            return;
        }
        state.search_maxResultCount = maxResultCount;
        showMessage(`设置已保存，刷新页面才能生效`);
    }

    // ---------- //

    // Utils

    /**
     * 等待元素出现
     * @param {string} selector 元素选择器
     * @param {number} timeout 超时时间，单位毫秒
     * @param {Document | Element} on 查找范围，默认是 document
     * @returns {Promise<Element>} 找到的元素
     */
    function waitForElement(selector, timeout = 5000, on = document) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            function checkElement() {
                const element = on.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime < timeout) {
                    requestAnimationFrame(checkElement);
                } else {
                    reject(new Error("Element not found"));
                }
            }
            requestAnimationFrame(checkElement);
        });
    }

     /**
     * 显示消息
     * @param {string} message 消息内容
     * @param {string} type 消息类型，可选值：'info'（默认）、'error'
     */
    function showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.dataset.type = type;
        messageElement.className = 'message';
        ui.root.append(messageElement);
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * 下载文件
     * @param {string} url - 文件URL地址
     * @param {string} [filename] - 可选的自定义文件名
     */
    function DownloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || url.split('/').pop() || 'download';
        document.body.append(link);
        link.click();
        requestAnimationFrame(() => link.remove());
    }
    
})(unsafeWindow))
    .then(() => { 
        console.log('[bh3helper-downloader] initialization completed');
    })
    .catch(error => {
        console.error('[bh3helper-downloader] initialization failed:', error);
    });
