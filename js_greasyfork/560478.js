// ==UserScript==
// @name         bh3helper-enhancer
// @namespace    4b8b542a-3500-49bd-b857-8d62413434c7
// @version      1.1.1
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
// @require      https://unpkg.com/vue3-tree@0.11.5/dist/vue3-tree.js#sha256-cUAWVV0/sMo44jc45yFH2uEv6+AkMGKZod8QdY/vMqA=
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js#sha256-w7NPLp9edNTX1k4BysegwBlUxsQGQU1CGFx7U9aHXd8=
// @require      https://unpkg.com/add-css-constructed@1.1.1/dist/umd.js#sha256-d0FJH11iwMemcFgueP8rpxVl9RdFyd3V8WJXX9SmB5I=
// @resource     dialog_css https://unpkg.com/vue-dialog-view@1.7.1/dist/vue-dialog-view.css#sha256-HnPUNAFITfEE27CBFvnXJJBIw7snbNTkexmuZ95u160=
// @resource     treeview_css https://unpkg.com/vue3-tree@0.11.5/dist/style.css#sha256-pMwswRTw7jawlpe60P8W2yItWloUeREwp4DwlZkp3OI=
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
        COMMON_PAGE_BASE_URL: '/pages/common.html',
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

    // Data

    const PG_DOWNLOAD_STRUCT = {
        contentExtractRules: {
            'dialog-step': '· {TEXT}',
            'dialog-synopsis-line': '> {TEXT}',
            'dialog-doc': '文档：{TEXT}',
            'default': '{TEXT}'
        },
        listIndentCount: 2,
        multiLineDialogIntend: '\n    ：',
    };

    const TYPOFIX = {
        homepageStruct: {
            mainlineGroupTypo: {
                "桔梗再次沉睡": "桔梗在此沉睡", // 😂还得帮忙改typo
            },
        },
        domPatch: [
            {
                id: 1,
                selector: '#toc-sub-main>a>div.toc-item.toc-item-sub>div.toc-text.toc-ch-text',
                patch: '桔梗在此沉睡<div class="toc-ch-number-text">第18~19章</div>',
                dangerouslySetInnerHTML: true,
                multiple: true,
                condition: [
                    ["pathname", "eq", "/"],
                    ["innerHTML", "eq", '桔梗再次沉睡<div class="toc-ch-number-text">第18~19章</div>'],
                ],
                errorAction: "Continue", // 或"SilentlyContinue"
            },
            {
                id: 2,
                selector: '#桔梗再次沉睡',
                patch: '桔梗在此沉睡',
                condition: [
                    ["pathname", "eq", "/"],
                ],
                errorAction: "Continue",
            },
        ],
    };

    const DLUI_TEXT = {
        onBeforeZipStart: '正在压缩\n这可能需要一些时间，请耐心等待\n标签页可能会暂时失去响应，请不要强行退出',
    };

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

    DOMPatch(); /// 应用DOM补丁

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

        addCSS(`:host {
    font-family: "Microsoft YaHei","微软雅黑","Noto Sans SC","Noto","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","PingFang SC","黑体",ui-sans-serif,sans-serif;
}
#panel {
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
.dlg-option-form>label>input[type="text"] {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.dlg-option-form>label>input[type="text"]:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}
.dlg-option-form>label>input[type="text"]::placeholder {
    color: #9ca3af;
}
.dlg-option-form>button {
    margin-top: 10px;
}
.dlg-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e5e7eb;
}
.dlg-help {
    margin-top: 15px;
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}
.dlg-help-summary {
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    user-select: none;
    list-style: none;
    padding: 0;
    margin-bottom: 8px;
}
.dlg-help-summary::-webkit-details-marker {
    display: none;
}
.dlg-help-summary::before {
    content: '▶';
    display: inline-block;
    margin-right: 6px;
    font-size: 12px;
    transition: transform 0.2s;
}
details[open] > .dlg-help-summary::before {
    transform: rotate(90deg);
}
.dlg-help-list {
    margin: 0;
    padding-left: 20px;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.6;
}
.dlg-help-list li {
    margin-bottom: 6px;
}
.dlg-preview {
    margin-top: 15px;
    padding: 12px;
    background-color: #f0f9ff;
    border-radius: 6px;
    border: 1px solid #bae6fd;
}
.dlg-preview-title {
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 8px;
}
.dlg-preview-item {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}
.dlg-preview-item:last-child {
    margin-bottom: 0;
}
.dlg-preview-label {
    font-weight: 500;
    color: #6b7280;
    margin-right: 8px;
    min-width: 100px;
}
.dlg-preview-value {
    flex: 1;
    color: #374151;
    font-family: 'Courier New', monospace;
    background-color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
}
.checkbox-row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: auto;
    gap: 8px;
    white-space: nowrap;
}
.checkbox-row>label+label {
    margin-left: 0.5em;
}
.checkbox-inline {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
}
.checkbox-inline>input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
}
.checkbox-inline>span {
    cursor: pointer;
    user-select: none;
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
.operation-link {
    color: #4285f4;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
}
.operation-link:hover {
    color: #357ae8;
    text-decoration: underline;
}
.range-tree-container {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: #f9fafb;
}
.range-tree-container input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #4285f4;
    transition: all 0.2s ease;
}
.range-tree-container input[type="checkbox"]:hover {
    accent-color: #357ae8;
}
.range-tree-container input[type="checkbox"]:checked {
    accent-color: #4285f4;
}
.range-tree-container input[type="checkbox"]:indeterminate {
    accent-color: #4285f4;
}
`, ui_root);
        const template = `
        <div id="panel" v-show="showPanel">
            <button v-if="isHomePage" class="operation-btn fn primary" @click="prepareDownloadMainline">下载所有主线剧情</button>
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
                    <a href="javascript:;" style="margin-left: 0.5em;" @click.prevent="showMoreDownloadOptions = true" class="operation-link">更多选项…</a>
                </label>

                <label v-if="dlType === 1">
                    <span>范围：</span>
                    <a href="javascript:;" @click.prevent="showRangeDlg = true" class="operation-link">选择</a>
                    <span style="padding-left: 0.5em;">{{ selectedRangeCount }} 已选</span>
                </label>

                <label v-if="dlType === 1">
                    <span>格式：</span>
                    <a href="javascript:;" @click.prevent="showSetOutputFormatDlg = true" class="operation-link">设置输出格式</a>
                </label>

                <div class="checkbox-row">
                    <span>包含：</span>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeMainline"><span>主线</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeCollections"><span>收藏品</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeRecapitulation"><span>前情提要</span></label>
                </div>

                <div class="checkbox-row" v-if="dlOptions.includeMainline" v-show=0>
                    <span style="padding-left: 2em;">：</span>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeContent_mainline"><span>主线</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeContent_subplot"><span>支线</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeContent_activity"><span>活动</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeContent_npc"><span>NPC</span></label>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeContent_interaction"><span>交互</span></label>
                </div>

                <div class="checkbox-row" v-if="dlOptions.includeMainline">
                    <span style="padding-left: 2em;">：</span>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.useColorTag"><span>特殊颜色</span></label>
                </div>

                <div class="checkbox-row" v-if="dlOptions.includeMainline">
                    <span style="padding-left: 2em;">：</span>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.includeSynopsis"><span>包含梗概</span></label>
                </div>

                <div class="checkbox-row" v-if="dlType === 0 && dlOptions.includeCollections">
                    <span style="padding-left: 2em;">：</span>
                    <label class="checkbox-inline"><input type="checkbox" v-model="dlOptions.splitCollections"><span>拆分收藏品文本到独立文件</span></label>
                </div>

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

        <dialog-view v-model="showRangeDlg" style="width: 100%; height: 100%;">
            <template #title>选择下载范围</template>
            <div class="range-tree-container">
                <tree v-model:nodes="dlRangeData"
                    use-checkbox
                    show-child-count
                    @nodeClick="handleSelectRangeNodeClick"
                >
                    <template #checkbox="{ id, checked, node, indeterminate, toggleCheckbox }">
                        <input type="checkbox" :id="'dlRangeCheckbox_' + node.id"
                            :checked="checked"
                            :indeterminate="indeterminate"
                            @change="toggleCheckbox"
                            @click.stop
                        />
                    </template>
                </tree>
            </div>
            <template #footer>
                <div style="display: flex; align-items: center;">
                    <button type="button" @click="showSetOutputFormatDlg = true">设置输出格式</button>
                    <div style="flex: 1;"></div>
                    <span style="padding-right: 0.5em;">{{ selectedRangeCount }} 已选</span>
                    <button type="button" class="primary" @click="showRangeDlg = false">确定</button>
                </div>
            </template>
        </dialog-view>

        <dialog-view v-model="showSetOutputFormatDlg" style="width: 100%; height: 100%;">
            <template #title>设置输出格式</template>
            <form method="dialog" class="dlg-option-form">
                <label>
                    <span>输出文件名格式:</span>
                    <input type="text" v-model="dlOptions.outputFilenameFormat" placeholder="请输入文本">
                </label>
                <label>
                    <span>拆分收藏品文本到独立文件:</span>
                    <input type="checkbox" v-model="dlOptions.splitCollections">
                </label>
                <label v-if="dlOptions.splitCollections">
                    <span>收藏品文件名格式:</span>
                    <input type="text" v-model="dlOptions.collectionFilenameFormat" placeholder="请输入文本">
                </label>
            </form>
            <details class="dlg-help">
                <summary class="dlg-help-summary">说明</summary>
                <ul class="dlg-help-list">
                    <li><b>$1</b>:&nbsp;第一部分，如"主线第一部"</li>
                    <li><b>$2</b>:&nbsp;第二部分，如"月之始源与终焉"</li>
                    <li><b>$3</b>:&nbsp;第三部分，如"梦，开始了"</li>
                    <li><b>$4</b>:&nbsp;章节标题，如"第一章 黄昏·少女·战舰"（空格分隔）</li>
                    <li><b>$5</b>:&nbsp;收藏品标题（不包括文件名），如"收藏品"</li>
                    <li><b>$.</b>:&nbsp;文件扩展名，如".txt"</li>
                    <li><b>$$</b>&nbsp;= "$"</li>
                </ul>
            </details>
            <div class="dlg-preview">
                <div class="dlg-preview-title">预览：</div>
                <div class="dlg-preview-item">
                    <span class="dlg-preview-label">输出文件名：</span>
                    <span class="dlg-preview-value">{{ previewOutputFilename }}</span>
                </div>
                <div class="dlg-preview-item" v-if="dlOptions.splitCollections">
                    <span class="dlg-preview-label">收藏品文件名：</span>
                    <span class="dlg-preview-value">{{ previewCollectionFilename }}</span>
                </div>
            </div>
            <template #footer>
                <div class="dlg-footer">
                    <button type="button" class="primary" @click="showSetOutputFormatDlg = false">确定</button>
                    <button type="button" @click="resetOutputFormat">恢复默认</button>
                </div>
            </template>
        </dialog-view>

        <dialog-view v-model="showMoreDownloadOptions">
            <template #title>更多下载选项</template>
            <div class="btn-group btn-group-vertical">
                <button type="button" v-if="isHomePage" v-show=0 @click="showMoreDownloadOptions = false; showDownloadRawDataDlg = true">下载原始数据</button>
                <button type="button" @click="showMoreDownloadOptions = false">取消</button>
            </div>
        </dialog-view>

        <dialog-view v-model="showDownloadRawDataDlg">
            <template #title>下载原始数据</template>
            <div style="margin-bottom: 0.5em;">
                <b style="margin-bottom: 0.5em; display: block;">即将打包下载所有原始数据(js)文件。</b>
                <label><input type="checkbox" v-model="dlOptions.autoParseLzJs">&nbsp;自动解析lz.js数据</label>
            </div>
            <div class="btn-group">
                <button type="button" class="primary" @click="download_raw_data">立即下载</button>
                <button type="button" @click="showDownloadRawDataDlg = false">取消</button>
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
                    showPromptDialog: false,
                    // dialog start
                    showCloseOptionDlg: false,
                    showDownloadRawDataDlg: false,
                    showMoreDownloadOptions: false,
                    showPgDownDlg: false,
                    showRangeDlg: false,
                    showSetOutputFormatDlg: false,
                    // dialog end
                    dlType: 0,
                    dlOptions: {
                        mode: 'newWindow',
                        format: 'text',
                        includeMainline: true,
                        includeRecapitulation: true,
                        includeCollections: true,
                        includeSynopsis: true,
                        splitCollections: true,
                        outputFilenameFormat: '',
                        collectionFilenameFormat: '',
                        useColorTag: true,
                        autoParseLzJs: false,
                        includeContent_mainline: true,
                        includeContent_subplot: true,
                        includeContent_activity: true,
                        includeContent_npc: true,
                        includeContent_interaction: true,
                    },
                    defaultOutputFilenameFormat: '$1：$2/$4$.',
                    defaultCollectionFilenameFormat: '收藏品/$1：$2/$4/$5$.',
                    dlRange: [],
                    dlRangeData: [],
                    shouldSaveDlRange: false,
                    outFilenameExample: {
                        '1': '主线第一部',
                        '2': '月之始源与终焉',
                        '3': '梦，开始了',
                        '4': '第一章 黄昏·少女·战舰',
                        '5': '收藏品',
                        '.': '.txt',
                    },
                };
            },
            computed: {
                commonid() { 
                    const url = new URL(window.location.href);
                    return +(url.searchParams.get('id'));
                },
                selectedRangeCount() {
                    let count = 0;
                    const processNode = (node) => {
                        if (node.nodes) {
                            for (const child of node.nodes) {
                                processNode(child);
                            }
                        }
                        if (node.leaf && node.checked) {
                            count++;
                        }
                    };
                    for (const node of this.dlRangeData) {
                        processNode(node);
                    }
                    return count;
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
                previewOutputFilename() {
                    return this.replaceExampleFilenameVariables(this.dlOptions.outputFilenameFormat);
                },
                previewCollectionFilename() {
                    return this.replaceExampleFilenameVariables(this.dlOptions.collectionFilenameFormat);
                },
                handleSelectRangeNodeClick(node) {
                    if (node.leaf === true) {
                        node.checked = !node.checked;
                    }
                },
            },
            watch: {
                dlOptions: {
                    deep: true,
                    handler(value) {
                        state.dlOptions = value;
                    }
                },
                dlRangeData: {
                    // deep: true,// 由于使用 v-model 绑定，所以不需要深度监听
                    handler() {
                        if (!this.shouldSaveDlRange) return;
                        this.saveSelectedRange();
                    }
                },
            },
            components: {
                DialogView: DialogView.DialogView,
                Tree: Tree.default,
            },
            mounted() {
                const stateDlOpt = state.dlOptions;
                if (stateDlOpt) {
                    const keys = Reflect.ownKeys(this.dlOptions);
                    for (const key of keys) {
                        if (key in stateDlOpt) {
                            this.dlOptions[key] = stateDlOpt[key];
                        }
                    }
                }
                if (session.hidePanel === true) this.showPanel = false;
                if (!this.dlOptions.outputFilenameFormat) this.dlOptions.outputFilenameFormat = this.defaultOutputFilenameFormat;
                if (!this.dlOptions.collectionFilenameFormat) this.dlOptions.collectionFilenameFormat = this.defaultCollectionFilenameFormat;
            },
            methods: {
                download_current_all() {
                    this.showPgDownDlg = false;
                    if (this.dlType === 1) {
                        return findAndDownloadAllMainline(this.dlOptions, JSON.parse(JSON.stringify(this.dlRangeData)));
                    }
                    pgDownloadWorker(this.dlOptions).catch(e => {
                        console.error('[bh3helper-download] 下载失败:', e);
                    });
                },
                async prepareDownloadMainline() {
                    ui.loading_indicator.show();
                    ui.loading_indicator.innerText = '正在加载主线剧情数据...';
                    try {
                        this.shouldSaveDlRange = false;
                        await this.$nextTick();
                        this.dlRangeData = await getAllMainlinePageStructData();
                        await this.$nextTick();
                        this.restoreSelectedRange();
                        this.shouldSaveDlRange = true;
                        await this.$nextTick();
                        this.dlType = 1;
                        this.showPgDownDlg = true;
                    } catch (error) {
                        console.error('[bh3helper-downloader] 加载主线剧情数据失败:', error);
                        showMessage('加载主线剧情数据失败，请重试', 'error');
                    } finally {
                        ui.loading_indicator.hide();
                    }
                },
                force_set_search_max_result_count() {
                    setMaxSearchLimit();
                },
                download_raw_data() {
                    this.showDownloadRawDataDlg = this.showPgDownDlg = false;
                    DownloadRawData(this.dlOptions);
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
                resetOutputFormat() {
                    this.dlOptions.outputFilenameFormat = this.defaultOutputFilenameFormat;
                    this.dlOptions.collectionFilenameFormat = this.defaultCollectionFilenameFormat;
                },
                replaceExampleFilenameVariables(format) {
                    return format.replace(/\$\$/g, '\u0000').replace(/\$(\d+|\.)/g, (match, p1) => {
                        if (p1 === '.') return '.txt'
                        return this.outFilenameExample[p1];
                    }).replace(/\u0000/g, '$');
                },
                saveSelectedRange() {
                    const selectedIds = {};
                    const processNode = (node) => {
                        if (node.nodes) {
                            for (const child of node.nodes) {
                                processNode(child);
                            }
                        }
                        if (node.leaf) {
                            selectedIds[node.id] = node.checked;
                        }
                    };
                    for (const node of this.dlRangeData) {
                        processNode(node);
                    }
                    state.dlRange = selectedIds;
                },
                restoreSelectedRange() {
                    const selectedIds = state.dlRange;
                    if (!selectedIds || Reflect.ownKeys(selectedIds).length === 0) return;
                    this.shouldSaveDlRange = false;
                    const processNode = (node) => {
                        if (node.nodes) {
                            for (const child of node.nodes) {
                                processNode(child);
                            }
                        }
                        if (node.leaf && node.id in selectedIds) {
                            node.checked = selectedIds[node.id];
                        }
                    };
                    for (const node of this.dlRangeData) {
                        processNode(node);
                    }
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
    // 插入treeview_css
    const treeview_css = GM_getResourceText('treeview_css');
    if (treeview_css) addCSS(treeview_css, ui.root);



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
                pgDownloadWorker(data.config, true).then((ret) => {
                    source.postMessage(Object.assign({
                        rpc_action: 'downloadStoryResult',
                        rpc_invoke_nonce: data.rpc_invoke_nonce, // ***
                        success: true,
                    }, ret), window.location.origin);
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
        splitCollections = false,
        useColorTag = false,
    } = {}, returnData = false) {
        // 下载当前页面所有剧情
        const result = [];
        const extractRulesArr = Object.entries(PG_DOWNLOAD_STRUCT.contentExtractRules);
        const nodeTextExt = { useColor: useColorTag };
        ui.loading_indicator.show();
        ui.loading_indicator.innerText = '正在下载...';

        try {
            // 1. 获取所有 .external-link
            const main_content = document.getElementById('main-content');
            const constraints = [], otherSelectors = [];
            if (!includeMainline) constraints.push(':not(#text-review-switch)');
            // if (!includeCollections) constraints.push(':not(#collection-review-switch)');
            if (includeRecapitulation) otherSelectors.push('.content-section#前情提要 div.external-link:not(:empty)');
            const selectorBase = `.content-section.level-4{}${constraints.join('')} div.external-link:not(:empty)`; // 注意必须是div，而不是<a>，<a>是真·外链
            const selectorBaseEx = `.content > *{}${constraints.join('')} > div.external-link:not(:empty)${otherSelectors.length ? (',' + otherSelectors.join(',')) : ''}`;
            const selectorMainStory = selectorBase.replace("{}", ":not(#collection-review-switch)") + ',' + selectorBaseEx.replace("{}", ":not(#collection-review-switch)"),
                selectorCollections = selectorBase.replace("{}", "#collection-review-switch");
            let skipCount = 0;
            const resources = []; // 额外资源
            
            let current = 0, total = 0;
            const updateProgress = (current, desc = '') => {
                ui.loading_indicator.innerText = `正在处理第 ${current} (共 ${total} 个)\n${desc || '\u2060'}`;
            };
            updateProgress(0);

            // 2. 依次点击按钮以加载内容
            const processButton = async (button, result, {
                single = false,
            } = {}) => {
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
                        return; // 跳过
                    }
                }
                if (contentDialog.classList.contains('dialog-embedded')) return;
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
                            const column1text = extractNodeText(column1, nodeTextExt).join('');
                            if (column1text !== "") contents.push(column1text);
                            continue;
                        }
                        // 5. 判断类型
                        if (column1.querySelector(".dialog-actor > .dialog-actor-option")) {
                            // 选项
                            const dialogActorOption = column1.querySelector('.dialog-actor-option');
                            const optionText = (dialogActorOption && dialogActorOption.innerText) ? `${dialogActorOption.innerText}：` : '- ';
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
                            for (const lineWrapper of lines) {
                                if (!includeSynopsis && lineWrapper.classList.contains('dialog-synopsis-line')) continue;
                                let lineTextBuffer = [];
                                for (const line of lineWrapper.childNodes) {
                                    if (line.nodeType === Node.TEXT_NODE) {
                                        const nodeText = line.textContent.trim();
                                        if (nodeText !== "") lineTextBuffer.push(nodeText);
                                        continue;
                                    }
                                    if (line.nodeType !== Node.ELEMENT_NODE) continue;
                                    let lineText = extractNodeText({ childNodes: [line] }, nodeTextExt).join('');
                                    for (let k = 0; k < extractRulesArr.length; k++) {
                                        const [classname, content] = extractRulesArr[k];
                                        if (!(line.classList.contains(classname))) continue;
                                        lineText = FormatValueTemplate(content, { TEXT: lineText }); break;
                                    }
                                    lineTextBuffer.push(lineText);
                                }
                                if (lineTextBuffer.length === 0) continue;
                                let extractRule = PG_DOWNLOAD_STRUCT.contentExtractRules.default;
                                for (let k = 0; k < extractRulesArr.length; k++) {
                                    const [classname, content] = extractRulesArr[k];
                                    if (!(lineWrapper.classList.contains(classname))) continue;
                                    extractRule = content; break;
                                }
                                lineTextBuffer[0] = FormatValueTemplate(extractRule, { TEXT: lineTextBuffer[0] }); // 只改第一个（因为可能是多个inline node）
                                if (field1) {
                                    // 为每一个条目添加actor字段（因为原网站对同一个说话者采取合并策略）
                                    for (let i = 0, l = lineTextBuffer.length; i < l; i++) {
                                        const line = lineTextBuffer[i];
                                        const j = line.indexOf('\n');
                                        lineTextBuffer[i] = j === -1 ?
                                            (field1 + line) : (field1 + line.substring(0, j) +
                                                PG_DOWNLOAD_STRUCT.multiLineDialogIntend +
                                                line.substring(j + 1).replace(/\n/g, PG_DOWNLOAD_STRUCT.multiLineDialogIntend));
                                    }
                                }
                                contents.push(lineTextBuffer.join('\n'));
                            }
                        }
                    }
                    // table和table之间有一个空行
                    contents.push('');
                }
                // 6. 合并内容
                if (single) {
                    result.push(contents.join('\n'));
                } else {
                    result.push(`【${title}】\n${contents.join('\n')}\n`);
                    result.push('-----\n\n');
                }
                // 7. 关闭当前对话框
                const closeButton = contentDialog.querySelector('.dialog-btn-wrapper > .dialog-button.dialog-fs-button > .fa.fa-remove');
                if (closeButton) closeButton.click();
                else contentDialog.style.display = 'none'; // 手动关闭
                // 8. 冷却
                await new Promise(resolve => setTimeout(resolve, CONFIG.DIALOG_SWITCH_CD_TIME)); // 处理速度太快会导致浏览器渲染跟不上😂，只能放慢一点了
                return title;
            };

            // 运行处理
            // 先选中元素
            const mainStoryElements = main_content.querySelectorAll(selectorMainStory);
            const collectionElements = main_content.querySelectorAll(selectorCollections);
            // 统计总数
            total = mainStoryElements.length + (includeCollections ? collectionElements.length : 0);
            updateProgress(0);
            // 如果选择拆分收藏品，那么单独收集收藏品内容
            if (splitCollections) {
                // 先处理其他内容
                for (const element of mainStoryElements) {
                    await processButton(element, result);
                }
                if (includeCollections) {
                    // 单独收集收藏品内容
                    for (const element of collectionElements) {
                        const resultContainer = [];
                        const title = await processButton(element, resultContainer, { single: true });
                        resources.push({
                            content: resultContainer.join(''),
                            name: title ?? element.innerText.trim(), // 对于收藏品而言一般可以直接使用按钮文本作为收藏品标题，如果遇到问题请反馈
                            extName: '.txt',
                        });
                    }
                }
            }
            else {
                // 合并处理
                for (const element of mainStoryElements) await processButton(element, result);
                if (includeCollections) {
                    for (const element of collectionElements) await processButton(element, result);
                }
            }

            // 9. 合并所有内容
            result.pop();
            const blob = new Blob(result, { type: 'text/plain;charset=utf-8' });
            // 10. 获取页面标题，生成文件名
            const pageTitle = main_content.querySelector('.content-title-wrapper > .main-title')?.innerText || document.title;
            // 11. 返回数据或下载文件
            if (returnData) return {
                data: URL.createObjectURL(blob),
                title: pageTitle + '.txt',
                extName: '.txt',
                skipCount,
                resources,
            };
            // 12. 根据情况下载文件，如果有资源的话压缩起来
            if (resources.length > 0) {
                const files = {
                    [`${pageTitle}.txt`]: new Uint8Array(await blob.arrayBuffer()),
                };
                for (const resource of resources) {
                    let filename = resource.name + resource.extName, i = 0;
                    while (filename in files) {
                        filename = resource.name + '(' + (++i) + ')' + resource.extName;
                        if (i > 999) {
                            showMessage('文件名"' + resource.name + '"重复次数超过999次，已放弃', 'error');
                            console.warn('[bh3helper-downloader] filename "' + resource.name + '" repeated more than 999 times, skipped');
                            break;
                        }
                    }
                    files[filename] = new Uint8Array((new TextEncoder()).encode(resource.content));
                }
                updateProgress(current, DLUI_TEXT.onBeforeZipStart);
                await new Promise(resolve => setTimeout(resolve, 500));
                // 13. 压缩文件
                const zipBlob = new Blob([fflate.zipSync(files)], { type: 'application/zip' });
                updateProgress(current, '正在完成');
                DownloadFile(URL.createObjectURL(zipBlob), `${document.title} - ${new Date().toLocaleString()}.zip`);
            } else {
                DownloadFile(URL.createObjectURL(blob), `${pageTitle}.txt`);
            }
            showMessage(skipCount ? `下载完成（已跳过 ${skipCount} 个，请检查内容完整性！）` : "下载完成！", 'info', false);
            // 清理资源
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

    async function findAndDownloadAllMainline(options, range) {
        const mainlineDialogsData = buildMainlinePageIdListFromRangeData(range);
        if (mainlineDialogsData.length === 0) {
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
                ui.loading_indicator.innerText = `正在处理第 ${current} (共 ${mainlineDialogsData.length} 个)\n${desc || '\u2060'}`;
            };
            updateProgress(0);

            state.rpc_password = context.crypto.randomUUID();
            const zipEntries = Object.create(null);
            let current = 0, totalSkip = 0;
            for (const item of mainlineDialogsData) {
                const url = new URL(CONFIG.COMMON_PAGE_BASE_URL, window.location.href);
                url.searchParams.set('id', item.id);
                const ctx = openPage(url.href);
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
                if (ctx.closed) {
                    throw '页面已被用户关闭';
                }
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
                const { success, data, extName, resources, skipCount } = await new Promise((resolve, reject) => {
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
                const filename = options.outputFilenameFormat.replace(/\$\$/g, '\u0000').replace(/\$(.)/g, (match, p1) => { 
                    if (p1 === '.') return extName;
                    return item.path[(+p1) - 1];
                }).replace(/\u0000/g, '$');
                zipEntries[filename] = u8;
                if (resources && resources.length > 0) for (const res of resources) {
                    const { content, url, name, extName } = res;
                    const data = content ? ((new TextEncoder()).encode(content)) : (url ? new Uint8Array(await (await fetch(url)).arrayBuffer()) : new Uint8Array(0));
                    const filename = options.collectionFilenameFormat.replace(/\$\$/g, '\u0000').replace(/\$(.)/g, (match, p1) => { 
                        if (p1 === '.') return extName;
                        if (p1 === '5') return name;
                        return item.path[(+p1) - 1];
                    }).replace(/\u0000/g, '$');
                    zipEntries[filename] = data;
                }
                // cd
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (win && !win.closed) win.close();
            // 下载 zip 文件
            updateProgress(current, DLUI_TEXT.onBeforeZipStart);
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

    function buildMainlinePageIdListFromRangeData(rangeData) {
        const result = [];
        function buildNodePath(node) {
            const path = [];
            let current = node;
            do {
                path.unshift(current.orig_label ?? current.label);
                current = current.parentNode;
            } while (current);
            return path;
        }
        function processNode(node) {
            if (node.leaf === true && node.checked === true) {
                result.push({
                    id: node.id,
                    path: buildNodePath(node),
                });
            }
            if (node.nodes) for (const child of node.nodes) {
                child.parentNode = node;
                processNode(child);
            }
        }
        for (const node of rangeData) {
            processNode(node);
        }
        return result;
    }

    function DownloadRawData(options) {
        showMessage('暂未实现此功能！', 'error');
    }

    function findAllMainlineDialogs() {
        // 去重
        return Array.from(new Set(Array.from(document.querySelectorAll('.catalogue-card.catalogue-card-story > .story-item > a[href], .catalogue-card.catalogue-card-story-w > .story-item > a[href]'))
            .map(el => el.href)
            .filter(_ => !!_)));
    }

    async function getAllMainlinePageStructData() {
        // 本来还想着去DOM模拟点击的，结果发现目标网站
        // 本来就硬编码的数据😂😂😂那我还费那么大劲解析干啥
        // 直接把数据按一样的方法硬编码拉过来😂
        const m1 = MainLineData, // 主线第一部
            m2 = MarsMainLineData, // 主线第二部
            rouge = GameRogueData; // 往世乐土
        // 上述数据全都在Scripts作用域里面，无法通过window或unsafeWindow访问
        // 因此直接这样写，这不是错误
        
        // 解析数据，转换成vue3-tree格式
        const tree = [
            {
                id: 'mainline1',
                label: '主线第一部', // 你都硬编码了😂我也硬编码
                nodes: [
                    {
                        id: 'mainline1-1',
                        label: '月之始源与终焉',
                        nodes: []
                    },
                    {
                        id: 'mainline1.5',
                        label: '婆娑死生',
                        nodes: []
                    },
                ]
            },
            {
                id: 'mainline2',
                label: '主线第二部',
                nodes: [
                    {
                        id: 'mainline2-1',
                        label: '星灭之光，重燃之火',
                        nodes: []
                    },
                ]
            },
        ];
        // 填充数据
        const processData = (reference, data, nodeId, part) => {
            if (!reference.nodes[nodeId]) {
                reference.nodes[nodeId] = {
                    id: `mainline1-unknown`,
                    label: `未知章节`,
                    nodes: []
                };
            }
            let title = data.title;
            if (TYPOFIX.homepageStruct?.mainlineGroupTypo?.[title]) {
                title = TYPOFIX.homepageStruct.mainlineGroupTypo[title];
            }
            const data1 = {
                id: `mainline1-${title}`,
                label: title,
                nodes: []
            };
            // 还有套娃（别问我为啥...原网站是这样的）
            for (const j of data.data) {
                // 奇妙数据结构：[201610, '黄昏 · 少女 · 战舰', 1, '1.jpg', Array(2), '1.0']
                // 第二部结构：{chapter: '1.5', title: '虚影的宴舞', version: '7.3', isCompanion: true, cover: '1.5-s.jpg', …}
                const data2 = {
                    leaf: true, // 自定义标记
                    id: null, // 对应的章节的common页面id
                    label: null // 叶子节点，没有.nodes
                }, e = {
                    chapter: null,
                    isCompanion: false,
                }
                if (part === 1) { 
                    data2.id = (j[2]); // 对应的章节的common页面id
                    data2.label = j[1] // 叶子节点，没有.nodes
                    e.chapter = j[2];
                }
                if (part === 2) {
                    data2.id = j.chapterId; // 对应的章节的common页面id
                    data2.label = j.title // 叶子节点，没有.nodes
                    e.chapter = j.chapter;
                    e.isCompanion = j.isCompanion;
                }
                if (e.chapter == 43) { // 别问为什么😂问就是硬编码
                    data2.orig_label = data2.label;
                } else {
                    const prefix = (e.isCompanion ? "梦间拾集" : Util.toChapterNumber(e.chapter));
                    data2.orig_label = prefix + " " + data2.label;
                    data2.label = prefix + "：" + data2.label;
                }
                data1.nodes.push(data2);
            }
            reference.nodes[nodeId].nodes.push(data1);
        };
        for (let i = 0, l = m1.length; i < l; i++) {
            // 硬编码魔法😂0-11=月之始源与终焉，12-14=婆娑死生，其他的？不知道！
            const nodeId = (
                i < 12 ? 0 :
                i < 15 ? 1 :
                2
            );
            processData(tree[0], m1[i], nodeId, 1);
        }
        for (const i of m2) {
            processData(tree[1], i, 0, 2); // 目前主线第二部只有一个「星灭之光，重燃之火」  
        }
        // 在特定位置插入往世乐土
        const rougeContainer = []
        for (const i in rouge) {
            // 离离原上谱，rouge数据是个object不是array。。。
            // { date: 202107, title: '在无限的阴影之中', id: 3001, cover: 'r1.jpg', duration: Array(2), … }
            rougeContainer.push({
                id: (rouge[i]).id,
                label: (rouge[i]).title,
                leaf: true,
            })
        }
        // 又是硬编码。。。
        /*
        原网站包含漫画，我们不取漫画，因此我们的splice位置稍有不同
        原网站相关代码：
    groups.splice(1, 0, new CatalogueCardGroup('【圣芙蕾雅的故事】',[card_comic[0], card_comic[1], card_comic[7], card_comic[9], card_ex[0], card_ex[1], ]))
    groups.splice(3, 0, new CatalogueCardGroup('【命运交汇的故事】',[card_comic[10], card_comic[11], card_comic[12], card_comic[14], card_ex[2], card_ex[3], card_ex[4], card_ex[5], new GameOwCard(2), ]))
    groups.splice(5, 0, new CatalogueCardGroup('【孤儿院的故事】',[card_comic[5], card_comic[18], card_comic[19], card_ex[6], ]))
    groups.splice(7, 0, new CatalogueCardGroup('【强者的故事】',[card_comic[17], card_comic[20], card_comic[21], card_comic[25], ]))
    groups.splice(11, 0, new CatalogueCardGroup('【赤鸢的故事】',[card_comic[22], card_comic[23], card_comic[26], ]))
    groups.splice(15, 0, new CatalogueCardGroup('【往世乐土】',card_rogue))
        */
        tree[0].nodes[0].nodes.splice(10, 0, {
            id: 'mainline1-rogue',
            label: '往世乐土',
            nodes: rougeContainer,
        });

        const processTree = (nodes) => {
            for (const node of nodes) {
                node.checked = true;
                if (node.nodes) {
                    node.expanded = true;
                    processTree(node.nodes);
                }
                else if (node.leaf) {
                    if (typeof node.orig_label === 'undefined') node.orig_label = node.label;
                    node.label += ` (id: ${node.id})`;
                }
            }
        };
        processTree(tree);

        // 终于搞完了。。。
        return tree;
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

    // 运行DOMPatch
    async function DOMPatch() {
        function GetConditionValue(conditionName, ctx) {
            switch (conditionName) {
                case 'pathname': return window.location.pathname;
                case 'href': return window.location.href;
                case 'host': return window.location.host;
                case 'origin': return window.location.origin;
                case 'hostname': return window.location.hostname;
                case 'commonid': return (new URL(window.location.href)).searchParams.get('id');
                case 'textContent': return ctx.node?.textContent;
                case 'innerHTML': return ctx.node?.innerHTML;
                default: return null;
            }
        }
        function DOMPatchConditionChecker(condition, ctx) {
            const [type, op, value] = condition;
            const nodeValue = GetConditionValue(type, ctx);
            switch (op) {
                case 'eq': return nodeValue === value;
                case 'ne': return nodeValue !== value;
                case 'includes': return nodeValue.includes(value);
                case 'startsWith': return nodeValue.startsWith(value);
                case 'endsWith': return nodeValue.endsWith(value);
                case 'lt': return (+nodeValue) < (+value);
                case 'le': return (+nodeValue) <= (+value);
                case 'gt': return (+nodeValue) > (+value);
                case 'ge': return (+nodeValue) >= (+value);
                default: return false;
            }
        }
        async function DOMPatchWorker(rule) {
            rule = structuredClone(rule);
            let hasDomCondition = false;
            const conditionContext = {};
            if (rule.condition) for (const condition of rule.condition) {
                if (condition[0] === 'innerHTML' || condition[0] === 'textContent') {
                    hasDomCondition = true;
                    continue;
                }
                if (!DOMPatchConditionChecker(condition, conditionContext)) return;
                condition.checked = true;
            }
            let nodes = document.querySelectorAll(rule.selector);
            if (nodes.length === 0) {
                for (let i = 0, maxAttempts = rule.maxAttempts ?? 10; i < maxAttempts; i++) try {
                    await waitForElement(rule.selector, 1000); break;
                } catch { continue; }
                nodes = document.querySelectorAll(rule.selector);
                if (nodes.length === 0) {
                    if (rule.errorAction !== 'SilentlyContinue') {
                        console.warn(`[bh3helper-downloader] Rule ${rule.id} matches no nodes after ${maxAttempts} attempts. Skipped the rule.`);
                    }
                    return;
                }
            }
            if (nodes.length > 1 && !rule.multiple) {
                if (rule.errorAction !== 'SilentlyContinue') {
                    console.warn(`[bh3helper-downloader] Rule ${rule.id} matches multiple nodes, but multiple is set to false. Skipped the rule.`);
                }
                return;
            }
            for (const node of nodes) {
                conditionContext.node = node;
                let skip = false;
                if (rule.condition && hasDomCondition) for (const condition of rule.condition) {
                    if (condition.checked) continue;
                    if (!DOMPatchConditionChecker(condition, conditionContext)) {
                        skip = true;
                        break;
                    }
                }
                if (skip) continue;
                node[rule.dangerouslySetInnerHTML ? 'innerHTML' : 'innerText'] = rule.patch;
            }
        }
        const tasks = [];
        for (const i of TYPOFIX.domPatch) tasks.push(DOMPatchWorker(i));
        try {
            await Promise.all(tasks);
        } catch (error) {
            console.warn('[bh3helper-downloader] Unable to patch DOM:', error);
        }
    }

    /**
 * 提取节点文本内容
 * @param {Node} node - 要提取文本内容的节点
 * @param {any} ctx - 上下文对象，用于递归调用时传递状态
 * @returns {string[]} - 节点文本内容的数组
 */
    function extractNodeText(node, ctx = {}) {
        let value = []; for (let index = 0, len = node.childNodes.length; index < len; index++) {
            const i = node.childNodes[index];
            if (i.nodeType === Node.TEXT_NODE) { // 文本节点
                const text = i.textContent;
                if (text.trim()) value.push(text);
                continue;
            }
            if (i.nodeType !== Node.ELEMENT_NODE) continue; // 元素节点
            switch (i.tagName) {
                case 'BR':
                case 'HR':
                    value.push('\n');
                    break;
                case 'RUBY':
                    //{RUBY_B#rt内容}ruby内容{RUBY_E#}
                    {
                        const newCtx = context.structuredClone(ctx);
                        // ruby是文本，rt是标注
                        newCtx.rtText = []; // 假设是规范的HTML，rt内容不会嵌套ruby
                        const text = extractNodeText(i, newCtx).join('');
                        value.push(`{RUBY_B#${newCtx.rtText.join('')}}${text}{RUBY_E#}`);
                    }
                    break;
                case 'RT':
                    ctx.rtText.push(...extractNodeText(i, ctx));
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
                    const text = extractNodeText(i, ctx).join('');
                    if (text) {
                        const colorProp = i.style.getPropertyValue('--color');
                        value.push((colorProp && ctx.useColor) ? `<color=${colorProp}>${text}</color>` : text);
                        if (isBlockElement(i) && i.nextElementSibling && index < (len - 1)) value.push('\n');
                    }
            }
        }
        return value;
    }

    // ---------- //

    // Utils

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
        function c() {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }
        if (autoClose) { setTimeout(c, 3000); }
        else { setTimeout(() => window.addEventListener('click', c, { once: true }), 100); } // 避免点击事件立即触发
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
