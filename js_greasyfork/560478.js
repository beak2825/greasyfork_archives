// ==UserScript==
// @name         bh3helper-enhancer
// @namespace    4b8b542a-3500-49bd-b857-8d62413434c7
// @version      0.5.3
// @description  在bh3helper（《崩坏3》剧情助手）上提供增强功能
// @author       -
// @match        https://bh3helper.xrysnow.xyz/*
// @icon         https://bh3helper.xrysnow.xyz/res/img/favicon.png
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @require      https://unpkg.com/vue@3.5.26/dist/vue.global.prod.js#sha256-tAgDTQf3yKkfEX+epicjVa5F9Vy9oaStBwStjXA5gJU=
// @require      https://unpkg.com/@chcs1013/vue-expose-to-window@1.0.1/index.js#sha256-0zwVsGUKw70iQnySKWxo81tEXaVhqZg7rF2yBH+0wAg=
// @require      https://unpkg.com/vue-dialog-view@1.7.1/dist/cssless.umd.js#sha256-cH5113wW7G1+ZShZmyVUL1FVmBUEHzCzTO/Qy7+gMDg=
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js#sha256-w7NPLp9edNTX1k4BysegwBlUxsQGQU1CGFx7U9aHXd8=
// @require      https://unpkg.com/add-css-constructed@1.1.1/dist/umd.js#sha256-d0FJH11iwMemcFgueP8rpxVl9RdFyd3V8WJXX9SmB5I=
// @resource     dialog_css https://unpkg.com/vue-dialog-view@1.7.1/dist/vue-dialog-view.css#sha256-HnPUNAFITfEE27CBFvnXJJBIw7snbNTkexmuZ95u160=
// @inject-into  page
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/560478/bh3helper-enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560478/bh3helper-enhancer.meta.js
// ==/UserScript==

((async function (window, context) {
    const CONFIG = {
        SHADOW_ROOT_MODE: "closed",
        CONTENT_WAIT_TIMEOUT: 15000,
        PAGE_LOAD_WAIT_TIMEOUT: 20000,
        EXPORT_WAIT_TIMEOUT: 1000 * 60 * 3,
        DIALOG_SWITCH_CD_TIME: 80,
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
    const session = createStateStorage(context.sessionStorage, 'bh3helper-enhancer@');
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
    border: 1px solid #ccc;
    padding: 5px;
    background-color: #f9f9f9;
    border-radius: 5px;
}
#panel:not(:has(.fn)) {
    display: none;
}
button {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fff;
    color: #374151;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
button:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
button:active {
    background-color: #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
button:disabled {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
}
button:disabled:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: none;
}
button.primary {
    background-color: #4285f4;
    border-color: #4285f4;
    color: #fff;
    box-shadow: 0 1px 3px rgba(66, 133, 244, 0.3);
}
button.primary:hover {
    background-color: #357ae8;
    border-color: #357ae8;
    box-shadow: 0 2px 6px rgba(66, 133, 244, 0.4);
}
button.primary:active {
    background-color: #2a5cb8;
    border-color: #2a5cb8;
    box-shadow: 0 1px 2px rgba(66, 133, 244, 0.3);
}
button.primary:disabled {
    background-color: #9ca3af;
    border-color: #9ca3af;
    color: #fff;
}
button.primary:disabled:hover {
    background-color: #9ca3af;
    border-color: #9ca3af;
}
.operation-btn {
    padding: 5px 8px;
}
.operation-btn+.operation-btn {
    margin-top: 5px;
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
    margin-top: 5px;
}
.dlg-option-form>label>span {
    margin-right: 0.5em;
}
.dlg-option-form>button {
    margin-top: 10px;
}
.btn-group {
    display: flex;
}
.btn-group>button {
    flex: 1;
    padding: 8px 16px;
}
.btn-group>button+button {
    margin-left: 0.5em;
}
.btn-group-vertical {
    flex-direction: column;
}
.btn-group-vertical>button {
    flex: none;
}
.btn-group-vertical>button+button {
    margin-top: 0.5em;
    margin-left: 0;
}
.prompt-input-wrapper {
    margin: 15px 0;
}
.prompt-input-wrapper>input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.prompt-input-wrapper>input:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}
.prompt-input-wrapper>input::placeholder {
    color: #9ca3af;
}
`, ui_root);
        const template = `
        <div id="panel" v-show="showPanel">
            <button v-if="isHomePage" class="operation-btn fn primary" @click="((dlType = 1), (showPgDownDlg = true))">下载所有主线剧情</button>
            <button v-if="isStoryPage" class="operation-btn fn primary" @click="((dlType = 0), (showPgDownDlg = true))">下载本页所有剧情</button>
            <button v-if="isPjmsPage" class="operation-btn fn primary" @click="changePjmsNickname">修改「寻梦者」昵称</button>
            <button v-if="isSearchPage" class="operation-btn fn primary" @click="force_set_search_max_result_count">设置搜索最大结果数</button>
            <button class="operation-btn" @click="showCloseOptionDlg = true">关闭</button>
        </div>
        <dialog-view v-model="showPgDownDlg">
            <template #title>下载选项</template>
            <form method="dialog" class="dlg-option-form">
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
                    <span>包含梗概:</span>
                    <input type="checkbox" v-model="dlOptions.includeSynopsis">
                </label>
                <label>
                    <span>包含前情提要:</span>
                    <input type="checkbox" v-model="dlOptions.includeRecapitulation">
                </label>
                <label>
                    <span>包含收藏品:</span>
                    <input type="checkbox" v-model="dlOptions.includeCollections">
                </label>
            </form>
            <template #footer>
                <div class="btn-group">
                    <button type="button" class="primary" @click="download_current_all">下载</button>
                    <button type="button" @click="showPgDownDlg = false">取消</button>
                </div>
            </template>
        </dialog-view>

        <dialog-view v-model="showPromptDialog" @closed="promptResolver.reject?.(null)">
            <template #title>{{ promptText }}</template>
            <div class="prompt-input-wrapper">
                <input type="text" v-model="promptInput" autofocus :placeholder="promptPlaceholder ?? '请输入文本'">
            </div>
            <template #footer>
                <div class="btn-group">
                    <button type="button" class="primary" @click="showPromptDialog = false; promptResolver.resolve?.(promptInput)">确定</button>
                    <button type="button" @click="showPromptDialog = false; promptResolver.reject?.(null)">取消</button>
                </div>
            </template>
        </dialog-view>

        <dialog-view v-model="showCloseOptionDlg">
            <template #title>关闭</template>
            <div class="btn-group btn-group-vertical">
                <button type="button" @click="showCloseOptionDlg = false; showPanel = false">关闭一次</button>
                <button type="button" @click="hidePanelInSession">本次浏览关闭</button>
                <button type="button" @click="showCloseOptionDlg = false">取消</button>
            </div>
        </dialog-view>
        `;
        const app = Vue.createApp({
            template,
            data() {
                return {
                    page: window.location.pathname,
                    showPanel: true,
                    promptText: '',
                    promptInput: '',
                    promptPlaceholder: null,
                    promptResolver: { resolve: null, reject: null },
                    showCloseOptionDlg: false,
                    showPromptDialog: false,
                    dlType: 0,
                    dlOptions: {
                        mode: 'newWindow',
                        format: 'text',
                        includeMainline: true,
                        includeRecapitulation: true,
                        includeCollections: true,
                        includeSynopsis: true,
                    },
                    showPgDownDlg: false,
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
                isPjmsPage() {
                    return this.isStoryPage && this.commonid >= 101 && this.commonid < 200;
                },
            },
            watch: {
                dlOptions: {
                    deep: true,
                    handler(value) {
                        state.dlOptions = value;
                    }
                },
            },
            components: {
                DialogView: DialogView.DialogView,
            },
            mounted() {
                const stateDlOpt = state.dlOptions;
                if (stateDlOpt) this.dlOptions = stateDlOpt;
                if (session.hidePanel === true) this.showPanel = false;
            },
            methods: {
                download_current_all() {
                    this.showPgDownDlg = false;
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
                prompt(text, defaultValue = '', placeholder = null) {
                    this.promptText = text;
                    this.promptInput = defaultValue;
                    this.promptPlaceholder = placeholder;
                    this.showPromptDialog = true;
                    return new Promise((resolve, reject) => {
                        this.promptResolver = { resolve, reject };
                    });
                },
                changePjmsNickname() {
                    this.prompt('请输入新昵称', state.PJMS_NICKNAME ?? '寻梦者', '熵').then(nickname => {
                        if (nickname) state.PJMS_NICKNAME = nickname;
                        else delete state.PJMS_NICKNAME;
                        showMessage(`设置已保存，刷新页面才能生效`);
                    }).catch(() => {});
                },
                hidePanelInSession() {
                    session.hidePanel = true;
                    this.showPanel = false;
                    this.showCloseOptionDlg = false;
                    showMessage('已在本次浏览关闭，下次浏览将重新显示')
                },
            },
        });
        const vm = app.mount(ui_root.appendChild(document.createElement('div')));

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
            app,
            vm
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
    }); // 从这里开始执行时机都是DOMContentLoaded之后了
    // 插入dialog_css
    const dialog_css = GM_getResourceText('dialog_css');
    if (dialog_css) addCSS(dialog_css, ui.root);

    // ---------- //

    await new Promise(resolve => {
        if (window.document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', () => {
                resolve();
            }, { once: true });
        }
    }); // 从这里开始执行时机都是load事件之后了
    postLoadMessage();
    if (state.PJMS_NICKNAME) applyPjmsNicknamePatch();

    // ---------- //

    // Data
    
    const PG_DOWNLOAD_STRUCT = {
        contentExtractRules: {
            'dialog-step': '· {TEXT}',
            'dialog-synopsis-line': '> {TEXT}',
            'default': '{TEXT}'
        },
        listIndentCount: 2,
    };
    
    // ---------- //

    // Functions
    
    /**
     * 处理消息事件
     * @param {MessageEvent} event - 消息事件对象
     */
    function MessageHandler(event) {
        const { data, origin, source } = event;
        if (origin !== window.location.origin) return;
        if (!data) return;
        if (!state.rpc_password) return;
        if (
            (!temp.rpc_invoke_nonce || data.rpc_invoke_nonce !== temp.rpc_invoke_nonce)
            && data.password !== state.rpc_password
        ) return;
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
        includeRecapitulation = true,
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
            const constraints = [], otherSelectors = [];
            if (!includeMainline) constraints.push(':not(#text-review-switch)');
            if (!includeCollections) constraints.push(':not(#collection-review-switch)');
            if (includeRecapitulation) otherSelectors.push('.content-section#前情提要 div.external-link:not(:empty)');
            const selector = `.content-section.level-4${constraints.join('')} div.external-link:not(:empty), .content > *${constraints.join('')} > div.external-link:not(:empty)${otherSelectors.length ? (',' + otherSelectors.join(',')) : ''}`; // 注意必须是div，而不是<a>，<a>是真·外链
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
                await new Promise(resolve => requestAnimationFrame(resolve));
                button.click();
                // 3. 等待内容加载完成
                const loadContent = () => waitForElement('.dialog-viewer-wrapper:not([style*="display: none"])', CONFIG.CONTENT_WAIT_TIMEOUT, main_content).then(element => element).catch(() => null);
                let contentDialog = await loadContent();
                if (!contentDialog) {
                    // 重试1次
                    button.click();
                    contentDialog = await loadContent();
                    if (!contentDialog) {
                        console.log(`[bh3helper-downloader] W: 点击按钮 "${button.innerText}" 后未加载出内容对话框`);
                        showMessage(`警告：点击按钮 "${button.innerText}" 后未加载出内容对话框或加载超时`);
                        skipCount += 1;
                        continue; // 跳过
                    }
                }
                if (contentDialog.classList.contains('dialog-embedded')) continue;
                updateProgress(current, button.innerText);
                // 4. 提取对话内容
                const contents = [];
                const title = contentDialog.querySelector('.dialog-stage-title')?.innerText || contentDialog.querySelector('.dialog-title')?.innerText || '';
                const contentTables = contentDialog.querySelectorAll('.dialog-viewer-container>.dialog-viewer>*>table.content-table,.dialog-viewer-container>.dialog-viewer>.content-table');
                for (const table of contentTables) {
                    const rows = table.querySelectorAll('tbody>tr');
                    for (const row of rows) {
                        const [column1, column2] = row.childNodes;
                        if (!column1) continue;
                        if (!column2) {
                            const column1text = extractNodeText(column1).join('');
                            if (column1text !== "") contents.push(column1text);
                            continue;
                        }
                        // 5. 判断类型
                        if (column1.querySelector(".dialog-actor > .dialog-actor-option")) {
                            // 选项
                            const dao = column1.querySelector('.dialog-actor-option');
                            const optionText = (dao && dao.innerText) ? `${dao.innerText}：` : '- ';
                            const options = column2.querySelectorAll('.dialog-line-option');
                            for (const option of options) {
                                contents.push(`${optionText}${option.innerText}`);
                            }
                        }
                        else {
                            // 对话
                            const isDialogSection = table.classList.contains('dialog-viewer-section');
                            const field1 = column1.innerText ? (isDialogSection ? `${column1.innerText}\uff1a` : `${column1.innerText}\n`) : '';
                            //let lines = column2.querySelectorAll('.dialog-line');
                            //if (!lines || !lines.length) lines = [column2];
                            const lines = column2.childNodes[0]?.childNodes || [column2];
                            for (const line of lines) {
                                if (!includeSynopsis && line.classList.contains('dialog-synopsis-line')) continue;
                                for (const cln in PG_DOWNLOAD_STRUCT.contentExtractRules) {
                                    if (!(line.classList.contains(cln)) && cln !== 'default') continue;
                                    let text = FormatValueTemplate(PG_DOWNLOAD_STRUCT.contentExtractRules[cln], { TEXT: extractNodeText(line).join('') });
                                    if (field1) text = text.split('\n').map(line => line ? (field1 + line) : line).join('\n');
                                    contents.push(text);
                                    break;
                                }
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
            if (returnData) return { blobUrl: URL.createObjectURL(blob), title: pageTitle + '.txt', skipCount };
            DownloadFile(URL.createObjectURL(blob), `${pageTitle}.txt`);
            showMessage(skipCount ? `下载完成（已跳过 ${skipCount} 个，请检查内容完整性！）` : "下载完成！", 'info', false);
            // 12. 清理资源
            setTimeout(() => {
                URL.revokeObjectURL(blob);
            }, 5000);
        } catch (error) {
            showMessage("下载失败: " + error, 'error', false);
            console.error('[bh3helper-downloader] download failed:', error);
        } finally {
            ui.loading_indicator.hide();
        }
    }

    async function setMaxSearchLimit() {
        try {
            const value = await ui.vm.prompt('请输入最大搜索结果数（默认100）', '100');
            if (!value) return;
            const maxResultCount = parseInt(value, 10);
            if (isNaN(+value) || isNaN(maxResultCount) || maxResultCount <= 0) {
                showMessage('请输入一个大于 0 的整数', 'error');
                return;
            }
            state.search_maxResultCount = maxResultCount;
            showMessage(`设置已保存，刷新页面才能生效`);
        } catch {}
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
            let current = 0, totalSkip = 0;
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
                const { success, data, title, skipCount } = await new Promise((resolve, reject) => {
                    temp.downloadresolver = resolve;
                    setTimeout(() => reject(new Error('导出超时')), CONFIG.EXPORT_WAIT_TIMEOUT);
                });
                if (!success) {
                    showMessage(`导出失败: ${data}`, 'error');
                    continue;
                }
                if (skipCount) {
                    showMessage(`警告：跳过了 ${skipCount} 项`, 'info', false);
                    console.log('[bh3helper-download]', `警告：跳过了`, skipCount, `项 于`, url);
                    totalSkip += skipCount;
                }
                // 获取资源并添加到 zip 文件
                updateProgress(current, '正在保存');
                const u8 = new Uint8Array(await (await fetch(data)).arrayBuffer());
                // 添加到 zip 文件
                zipEntries[title] = u8;
                // cd
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (win && !win.closed) win.close();
            // 下载 zip 文件
            updateProgress(current, '正在压缩\n这可能需要一些时间，请耐心等待');
            await new Promise(resolve => setTimeout(resolve, 500));
            const zipBlob = new Blob([fflate.zipSync(zipEntries)], { type: 'application/zip' });
            updateProgress(current, '正在完成');
            DownloadFile(URL.createObjectURL(zipBlob), `${document.title} - ${new Date().toLocaleString()}.zip`);
            setTimeout(() => {
                URL.revokeObjectURL(zipBlob);
            }, 300000);
            showMessage(totalSkip ? `下载完成（跳过了 ${totalSkip} 项！请检查数据完整性）` : '下载完成！', 'info', false);
        } catch (error) {
            console.error('[bh3helper-downloader] download failed:', error);
            showMessage("下载失败: " + error, 'error', false);
        } finally {
            if (ifr) ifr.remove();
            if (win && !win.closed) win.close();
            ui.loading_indicator.hide();
            // reset password and nonce
            delete state.rpc_password;
            delete temp.rpc_invoke_nonce;
        }
    }

    function findAllMainlineDialogs() {
        // 去重
        return Array.from(new Set(Array.from(document.querySelectorAll('.catalogue-card.catalogue-card-story > .story-item > a[href], .catalogue-card.catalogue-card-story-w > .story-item > a[href]'))
            .map(el => el.href)
            .filter(_ => !!_)));
    }

    function applyPjmsNicknamePatch(n = 0) {
        if (typeof DialogViewer === 'undefined') { 
            if (n < 10) {
                setTimeout(() => applyPjmsNicknamePatch(n + 1), 1000);
            } else {
                console.error('[bh3helper-downloader] DialogViewer 未定义，无法应用昵称补丁');
            }
            return;
        }
        // 应用昵称补丁
        try {
            const s = /寻梦者/g, r = state.PJMS_NICKNAME;
            const w = (t, e) => console.warn(`[bh3helper-downloader] Patch failed:`, t, e);
            try { patchClassMeth(DialogViewer, '_procMain2Line', s, r) } catch (e) { w('DialogViewer._procMain2Line', e); }
            // patchClassMeth(EnemyInfo, 'doMake', s, r) || w('EnemyInfo.doMake');//不是static，不好搞
            try { patchClassMeth(ChapterDocBase, 'procContent', s, r) } catch (e) { w('ChapterDocBase.procContent', e); }
        } catch (error) {
            console.warn('[bh3helper-downloader] Unable to patch nickname:', error);
        }
    }
    /**
     * 替换类方法中的字符串
     * @param {any} c Class
     * @param {string} p property
     * @param {string|RegExp} s search pattern
     * @param {string} r replace with
     */
    function patchClassMethV1(c, p, s, r) { 
        if (typeof c[p] !== 'function') {
            throw new Error('{p} is not a function property');
        }
        const [matchedString, funcName, argList, funcBody] = c[p].toString().match(/^\s*?([$_\p{L}][$_\p{L}\d]*?)\s*?\((.*?)\)\s*?\{([\s\S]*)\}\s*?$/u);
        if (!matchedString) {
            throw new Error(`Unable to parse ${p} function`);
        }
        const patchedFn = funcBody.replace(s, r);
        // 解析参数列表
        const params = argList.split(',').map(_ => _.trim()).filter(_ => !!_);
        // 构造新函数
        if (!Reflect.set(c, p, new window.Function(...params, patchedFn))) throw new Error('Unable to patch target property');
    }
    /**
     * 替换类方法中的字符串（注意不适用于闭包）
     * @param {any} c Class
     * @param {string} p property
     * @param {string|RegExp} s search pattern
     * @param {string} r replace with
     */
    function patchClassMeth(c, p, s, r) { 
        if (typeof c[p] !== 'function') {
            throw new Error('{p} is not a function property');
        }
        const src = c[p].toString();
        let patchedFn = src.replace(s, r);
        if (/^\s*?(async\s+)?([$_\p{L}][$_\p{L}\d]*?)\s*?\((.*?)\)\s*?\{([\s\S]*)\}\s*?$/u.test(src))
            patchedFn = 'function ' + patchedFn; // 属于类的内部函数定义形式，如 func() {...} 直接构造会报错需要手动补全function
        if (/^\s*?async\s+$/.test(src))
            patchedFn = 'async ' + patchedFn; // 补上async，如：async foo() {...}
        const rand = Math.random().toString().substring(2);
        const fn = `const __${rand}=(${patchedFn});if(new.target)return Reflect.construct(__${rand},arguments);return __${rand}.apply(this, arguments);`
        // 构造新函数
        if (!Reflect.set(c, p, new window.Function(fn))) throw new Error('Unable to patch target property');
    }
    
    /**
     * 格式化值模板字符串
     * @param {string} template - 包含变量的模板字符串，例如 "{name} 你好"
     * @param {any} context - 包含变量值的对象，例如 {name: "张三"}
     * @param {any} defaultValue - 默认值，当模板中变量不存在时使用
     * @returns {string} - 格式化后的字符串
     */
    function FormatValueTemplate(template, context, defaultValue = '') {
        return template.replace(/\{(.*?)\}/g, (match, name) => (context[name.trim()] ?? defaultValue));
    }
    
    /**
     * 提取节点文本内容
     * @param {Node} node - 要提取文本内容的节点
     * @param {any} ctx - 上下文对象，用于递归调用时传递状态
     * @returns {string[]} - 节点文本内容的数组
     */
    function extractNodeText(node, ctx = {}) {
        let value = [];
        for (const i of node.childNodes) switch (i.nodeType) {
        case Node.ELEMENT_NODE: // 元素节点
            switch (i.tagName) {
            case 'BR':
            case 'HR':
                value.push('\n');
                break;
            case 'RUBY':
                //{RUBY_B#rt内容}ruby内容{RUBY_E#}
                // 原格式不太好还原，直接使用 ruby(rt) 这样的直观格式
                value.push('{', ...extractNodeText(i, ctx));
                break;
            case 'RT':
                value.push('}(', ...extractNodeText(i, ctx));
                value.push(')');
                break;
            case 'OL':
            case 'UL':
                {
                    const newCtx = context.structuredClone(ctx);
                    newCtx.type = i.tagName; newCtx.index = 0;
                    newCtx.indent = (ctx.indent != undefined) ? (ctx.indent + PG_DOWNLOAD_STRUCT.listIndentCount) : 0;
                    value.push(...extractNodeText(i, newCtx));
                }
                break;
            case 'LI':
                if (ctx.indent) value.push(' '.repeat(ctx.indent));
                if (ctx.type === 'UL') value.push('· ', ...extractNodeText(i, ctx));
                else if (ctx.type === 'OL') value.push((++ctx.index) + '. ', ...extractNodeText(i, ctx));
                else value.push(...extractNodeText(i, ctx));
                break;
            default:
                {
                    const text = extractNodeText(i, ctx).join('');
                    if (text) {
                        value.push(text);
                        if (isBlockElement(i) && i.nextElementSibling) value.push('\n');
                    }
                }
            }
            break;
        case Node.TEXT_NODE: // 文本节点
            { const text = i.textContent; if (text.trim()) value.push(text); }
            break;
        default:;
        }
        return value;
    }
        
    /**
     * 判断元素是否为块级元素
     * @param {Element} element - 要判断的元素
     * @returns {boolean} - 如果元素为块级元素则返回true，否则返回false
     */
    function isBlockElement(element) {
        // 块级元素的display值
        const blockValues = [
            'block', 'flex', 'grid', 'table', 'list-item',
            'flow-root', 'table-row-group', 'table-header-group',
            'table-footer-group', 'table-row', 'table-cell',
            'table-column-group', 'table-column', 'table-caption',
        ];
        return blockValues.includes(window.getComputedStyle(element).display);
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
    function showMessage(message, type = 'info', autoClose = true) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.dataset.type = type;
        messageElement.className = 'message';
        ui.root.append(messageElement);
        if (autoClose) setTimeout(c, 3000);
        else window.addEventListener('click', c, { once: true });
        function c() {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }
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
     * @param {string} prefix - 存储前缀（默认为空）
     * @returns {Proxy} - 一个代理对象，用于读写状态
     */
    function createStateStorage(source, prefix = '') {
        return new Proxy(Object.create(null), {
            get(target, property, receiver) {
                try { return JSON.parse(source.getItem(prefix + property) || "null"); } catch { return null }
            },
            set(target, property, value, receiver) {
                source.setItem(prefix + property, JSON.stringify(value));
                return true;
            },
            deleteProperty(target, property) {
                source.removeItem(prefix + property);
                return true;
            },
            // ownKeys(target) {
            //     return source.keys();
            // },
        });
    }

})((typeof unsafeWindow !== "undefined" ? unsafeWindow : window), window))
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
