// ==UserScript==
// @name         bh3helper-剧情文本下载器
// @namespace    4b8b542a-3500-49bd-b857-8d62413434c7
// @version      0.4.0
// @description  从bh3helper下载崩坏3剧情文本的辅助脚本|崩坏三|崩坏3|剧情文本
// @author       -
// @match        https://bh3helper.xrysnow.xyz/*
// @icon         https://bh3helper.xrysnow.xyz/res/img/favicon.png
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://unpkg.com/vue@3.5.26/dist/vue.global.prod.js
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @require      https://unpkg.com/add-css-constructed@1.1.1/dist/umd.js
// @inject-into  page
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/560478/bh3helper-%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560478/bh3helper-%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

((async function (window, context) {
    const CONFIG = {
        SHADOW_ROOT_MODE: "closed",
        CONTENT_WAIT_TIMEOUT: 10000,
        PAGE_LOAD_WAIT_TIMEOUT: 20000,
        EXPORT_WAIT_TIMEOUT: 1000 * 60 * 3,
        DIALOG_SWITCH_CD_TIME: 65,
    };

    // ---------- //

    const { document } = window;

    // ---------- //

    // State load
    const state = createStateStorage({
        getItem: GM_getValue,
        setItem: GM_setValue,
        removeItem: GM_deleteValue,
    });
    const session = createStateStorage(context.sessionStorage);
    const temp = Object.create(null);

    // ---------- //

    // Initial

    window.addEventListener('message', MessageHandler);

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

        //lib
        addCSS(`
.message { position: fixed; top: 20px; right: 20px; z-index: 10000; padding: 12px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); max-width: 350px; word-wrap: break-word; }
.message[data-type="info"] { background-color: #4285f4; color: #fff; }
.message[data-type="error"] { background-color: #ea4335; color: #fff; }
.message { animation: messageFadeIn 0.3s ease-out; }
.message.fade-out { animation: messageFadeOut 0.3s ease-in forwards; }
@keyframes messageFadeIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
@keyframes messageFadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
#loading_indicator { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; padding: 12px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; max-width: 350px; word-break: break-all; background-color: #4285f4; color: #fff; text-align: center; }
#loading_indicator_overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 10000; }
:host { all: initial; } [hidden] { display: none !important; }`, ui_root);
        //lib end

        addCSS(`#panel {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
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
.operation-btn:hover {
    background-color: #357ae8;
}
.dlg-option-form {
    display: flex;
    flex-direction: column;
}
.dlg-option-form>h2 {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
}
.dlg-option-form>label {
    display: flex;
    align-items: center;
}
.dlg-option-form>*+* {
    margin-top: 10px;
}
.dlg-option-form>label>span {
    margin-right: 0.5em;
}
.dlg-option-form>button {
    margin-top: 10px;
}
.dlg-option-form>.btn-group {
    display: flex;
}
.dlg-option-form>.btn-group>button {
    flex: 1;
    padding: 5px 10px;
}
.dlg-option-form>.btn-group>button+button {
    margin-left: 0.5em;
}
`, ui_root);
        const template = `
        <div id="panel">
            <button v-if="isHomePage" class="operation-btn" @click="((dlType = 1), $refs.pgDownDlg.showModal())">下载所有主线剧情</button>
            <button v-if="isStoryPage" class="operation-btn" @click="((dlType = 0), $refs.pgDownDlg.showModal())">下载本页所有剧情</button>
            <button v-if="isSearchPage" class="operation-btn" @click="force_set_search_max_result_count">设置搜索最大结果数</button>
        </div>
        <dialog ref="pgDownDlg">
            <form method="dialog" class="dlg-option-form">
                <h2>下载选项</h2>
                <label v-if="dlType === 1">
                    <span>下载模式:</span>
                    <select v-model="dlOptions.mode">
                        <option value="newWindow">独立窗口模式（性能更好但移动端可能不支持）</option>
                        <option value="iframe">iframe模式（兼容性更好但性能较差）</option>
                    </select>
                </label>

                <label>
                    <span>输出格式:</span>
                    <select v-model="dlOptions.format">
                        <option value="text">纯文本</option>
                        <option v-if=0 value="html">HTML</option>
                    </select>
                </label>

                <label>
                    <span>包含主线剧情:</span>
                    <input type="checkbox" v-model="dlOptions.includeMainline">
                </label>
                <label>
                    <span>包含收藏品:</span>
                    <input type="checkbox" v-model="dlOptions.includeCollections">
                </label>
                <label>
                    <span>包含梗概:</span>
                    <input type="checkbox" v-model="dlOptions.includeSynopsis">
                </label>

                <div class="btn-group">
                    <button type="button" @click="download_current_all">下载</button>
                    <button type="submit">取消</button>
                </div>
            </form>
        </dialog>
        `;
        const app = Vue.createApp({
            template,
            data() {
                return {
                    page: window.location.pathname,
                    dlType: 0,
                    dlOptions: {
                        mode: 'newWindow',
                        format: 'text',
                        includeMainline: true,
                        includeCollections: true,
                        includeSynopsis: true,
                    },
                };
            },
            computed: {
                commonid() { 
                    const url = new URL(window.location.href);
                    return +(url.searchParams.get('id'));
                },
                isHomePage() {
                    return this.page === '/';
                },
                isStoryPage() {
                    return this.page === '/pages/common.html' && !isNaN(this.commonid) && (this.commonid >= 1 && this.commonid <= 199);
                },
                isSearchPage() {
                    return this.page === '/pages/search.html';
                },
            },
            methods: {
                download_current_all() {
                    this.$refs.pgDownDlg.close();
                    if (this.dlType === 1) {
                        return findAndDownloadAllMainline(this.dlOptions);
                    }
                    pgDownloadWorker(this.dlOptions).catch(e => {
                        console.error('[bh3helper-download] 下载失败:', e);
                    });
                },
                force_set_search_max_result_count() {
                    setMaxSearchLimit();
                },
            },
        });
        app.mount(ui_root.appendChild(document.createElement('div')));

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

        document.body.append(ui_container);
        return {
            container: ui_container,
            root: ui_root,
            loading_indicator,
            loading_indicator_overlay,
            app
        };
    }

    function postLoadMessage() { 
        const target = window.opener || ((window.parent == window.self) ? null : window.parent);
        if (!target) return;
        target.postMessage({
            rpc_action: 'load',
            password: state.rpc_password,
        }, window.location.origin);
    }

    /**
     * @type {ReturnType<createUi>}
     */
    const ui = await new Promise(resolve => {
        if (window.document.readyState !== 'loading') {
            resolve(createUi());
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve(createUi());
            }, { once: true });
        }

        if (window.document.readyState === 'complete') {
            postLoadMessage();
        } else {
            window.addEventListener('load', () => {
                postLoadMessage();
            }, { once: true });
        }
    }); // 从这里开始执行时机都是DOMContentLoaded之后了

    // ---------- //

    // Functions
    function MessageHandler(event) {
        const { data, origin, source } = event;
        if (origin !== window.location.origin) return;
        if (!data) return;
        if (!state.rpc_password) return;
        if (data.rpc_invoke_nonce !== temp.rpc_invoke_nonce && data.password !== state.rpc_password) return;
        const action = data.rpc_action;

        switch (action) {
            case 'load':
                if (temp.loadresolver) {
                    temp.loadresolver();
                    temp.loadresolver = null;
                }
                break;
            
            case 'automated_controlled_overlay': {
                ui.root.appendChild(ui.loading_indicator_overlay.cloneNode(true)).hidden = false;
                const tip = ui.root.appendChild(document.createElement('div'));
                tip.append('此页面正在由自动化程序控制');
                tip.setAttribute('style', 'color: #fff; font-size: 16px; font-weight: bold; text-align: center; margin-top: 20px; position: fixed; top: 10px; left: 50%; transform: translate(-50%, 0); background: #000; border-radius: 5px; padding: 5px 10px; border: 1px solid #ccc; z-index: 99999;');
            }
                break;
            
            case 'downloadStory':
                source.postMessage({
                    rpc_action: 'downloadStoryRequestAccepted',
                    rpc_invoke_nonce: data.rpc_invoke_nonce,
                });
                pgDownloadWorker(data.config, true).then(({ blobUrl, title }) => {
                    source.postMessage({
                        rpc_action: 'downloadStoryResult',
                        rpc_invoke_nonce: data.rpc_invoke_nonce,
                        success: true,
                        data: blobUrl,
                        title,
                    }, window.location.origin);
                }).catch(error => {
                    console.error("[bh3helper-downloader] E: 下载失败: ", error);
                    source.postMessage({
                        rpc_action: 'downloadStoryResult',
                        rpc_invoke_nonce: data.rpc_invoke_nonce,
                        success: false,
                        data: String(error),
                    }, window.location.origin);
                });
                break;
            
            case 'downloadStoryRequestAccepted':
            case 'downloadStoryResult':
                if (temp.downloadresolver) {
                    temp.downloadresolver(data);
                    temp.downloadresolver = null;
                }
                break;
        }
    }

    async function pgDownloadWorker({
        format = 'text',
        includeMainline = true,
        includeCollections = true,
        includeSynopsis = true,
    } = {}, returnData = false) {
        // 下载当前页面所有剧情
        const result = [];
        ui.loading_indicator.show();
        ui.loading_indicator.innerText = '正在下载...';

        try {
            // 1. 获取所有 .external-link
            const main_content = document.getElementById('main-content');
            const limits = [];
            if (!includeMainline) limits.push(':not(#text-review-switch)');
            if (!includeCollections) limits.push(':not(#collection-review-switch)');
            const selector = `.content-section.level-4${limits.join('')} div.external-link:not(:empty), .content > *${limits.join('')} > div.external-link:not(:empty)`; // 注意必须是div，而不是<a>，<a>是真·外链
            const buttons_to_be_clicked = main_content.querySelectorAll(selector);
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
                    showMessage(`警告：点击按钮 "${button.innerText}" 后未加载出内容对话框或加载超时`);
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
                                else if (line.classList.contains('dialog-synopsis-line')) if (includeSynopsis) contents.push(`> ${line.innerText}`);
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
            if (returnData) return { blobUrl: URL.createObjectURL(blob), title: pageTitle };
            DownloadFile(URL.createObjectURL(blob), `${pageTitle}.txt`);
            showMessage(skipCount ? `下载完成（已跳过 ${skipCount} 个，请检查内容完整性！）` : "下载完成！");
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

    async function findAndDownloadAllMainline(options) {
        const mainlineDialogs = findAllMainlineDialogs();
        if (mainlineDialogs.length === 0) {
            showMessage("未找到主线剧情", 'error');
            return;
        }
        // 依次打开页面
        const ifr = (options.mode === 'iframe') ? document.createElement('iframe') : null;
        if (ifr) {
            ifr.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 9; inset: 0; box-sizing: border-box;');
            document.body.append(ifr);
        }
        const win = (options.mode === 'newWindow') ? window.open('', '_blank', 'width=800,height=600') : null;
        const openPage = (url) => {
            if (ifr) {
                ifr.src = url;
                return ifr.contentWindow;
            } else if (win && !win.closed) {
                win.location = url;
                return win;
            } else {
                if (win && win.closed) throw '窗口已被用户关闭';
                throw 'No available mode to open page'
            }
        };

        try {
            ui.loading_indicator.show();
            const updateProgress = (current, desc = '') => {
                ui.loading_indicator.innerText = `正在处理第 ${current} (共 ${mainlineDialogs.length} 个)\n${desc || '\u2060'}`;
            };
            updateProgress(0);

            state.rpc_password = context.crypto.randomUUID();
            const zipEntries = Object.create(null);
            let current = 0;
            for (const url of mainlineDialogs) {
                const ctx = openPage(url);
                updateProgress(++current, '正在加载页面');
                await new Promise((resolve, reject) => { 
                    temp.loadresolver = resolve;
                    setTimeout(() => reject(new Error('加载超时')), CONFIG.PAGE_LOAD_WAIT_TIMEOUT);
                });
                ctx.postMessage({
                    rpc_action: 'automated_controlled_overlay',
                    password: state.rpc_password,
                })
                updateProgress(current, '正在等待');
                await new Promise(resolve => setTimeout(resolve, 1500));
                // 请求导出资源并等待完成
                updateProgress(current, '正在获取数据');
                const nonce = context.crypto.randomUUID();
                temp.rpc_invoke_nonce = nonce;
                let responded = false;
                for (let i = 0; i < 3; i++) {
                    try {
                        ctx.postMessage({
                            rpc_action: 'downloadStory',
                            password: state.rpc_password,
                            config: JSON.parse(JSON.stringify(options)),
                            rpc_invoke_nonce: nonce,
                        }, window.location.origin);
                        await new Promise((resolve, reject) => {
                            temp.downloadresolver = resolve;
                            setTimeout(() => reject(new Error('页面似乎没有响应')), CONFIG.CONTENT_WAIT_TIMEOUT);
                        });
                        responded = true;
                        break;
                    }
                    catch (error) {
                        showMessage(`警告: ${error}`, 'error');
                        continue;
                    }
                }
                if (!responded) {
                    showMessage(`警告: 页面没有响应，正在跳过该页面`, 'error');
                    continue;
                }
                // 等待导出完成
                const { success, data, title } = await new Promise((resolve, reject) => {
                    temp.downloadresolver = resolve;
                    setTimeout(() => reject(new Error('导出超时')), CONFIG.EXPORT_WAIT_TIMEOUT);
                });
                if (!success) {
                    showMessage(`导出失败: ${data}`, 'error');
                    continue;
                }
                // 获取资源并添加到 zip 文件
                updateProgress(current, '正在保存');
                const u8 = new Uint8Array(await (await fetch(data)).arrayBuffer());
                // 添加到 zip 文件
                zipEntries[`${title}.txt`] = u8;
                // cd
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (win && !win.closed) win.close();
            // 下载 zip 文件
            updateProgress(current, '正在压缩\n这可能需要一些时间，请耐心等待');
            const zipBlob = new Blob([fflate.zipSync(zipEntries)], { type: 'application/zip' });
            updateProgress(current, '正在完成');
            DownloadFile(URL.createObjectURL(zipBlob), `${document.title} - ${new Date().toLocaleString()}.zip`);
            setTimeout(() => {
                URL.revokeObjectURL(zipBlob);
            }, 60000);
            showMessage(`下载完成！`);
        } catch (error) {
            console.error('[bh3helper-downloader] download failed:', error);
            showMessage("下载失败: " + error, 'error');
        } finally {
            if (ifr) ifr.remove();
            if (win && !win.closed) win.close();
            ui.loading_indicator.hide();
        }
    }

    function findAllMainlineDialogs() {
        // 去重
        return Array.from(new Set(Array.from(document.querySelectorAll('.catalogue-card.catalogue-card-story > .story-item > a[href]'))
            .map(el => el.href)
            .filter(_ => !!_)));
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

    /**
     * 创建状态存储
     * @param {Storage} source -  localStorage 或 sessionStorage 或其他实现了 Storage 接口的对象
     * @returns {Proxy} - 一个代理对象，用于读写状态
     */
    function createStateStorage(source) {
        return new Proxy(Object.create(null), {
            get(target, property, receiver) {
                try { return JSON.parse(source.getItem(property) || "null"); } catch { return null }
            },
            set(target, property, value, receiver) {
                source.setItem(property, JSON.stringify(value));
                return true;
            },
            deleteProperty(target, property) {
                source.removeItem(property);
                return true;
            },
            // ownKeys(target) {
            //     return source.keys();
            // },
        });
    }

})(unsafeWindow, window))
    .then(() => {
        console.log('[bh3helper-downloader] initialization completed');
    })
    .catch(error => {
        console.error('[bh3helper-downloader] initialization failed:', error);
    });


// Vue Function hack
// The vue.global version assume that the 'Vue' is globally available,
// which is not correct in the context of userscript
// That's why we need to inject a 'Vue' argument to the function
// Due to the auto-elevation of function declarations, the special 'Function' will be automatically used by Vue
function Function(...args) { 
    args.splice(0, 0, 'Vue');
    return (new (window.Function)(...args)).bind(window, Vue);
}
