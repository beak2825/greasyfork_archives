// ==UserScript==
// @name            ASMR Online 一键下载 2.2
// @name:zh-CN      ASMR Online 一键下载 2.2
// @name:en         ASMR Online Work Downloader 2.2
// @namespace       ASMR-ONE
// @version         2.2
// @description     一键下载asmr.one上的整个作品(或者选择文件下载)，包括全部的文件和目录结构。支持 RJ/VJ/BJ 代码，自定义标签筛选下载。内置 Aria2 连接测试工具。
// @description:zh-CN 一键下载asmr.one上的整个作品(或者选择文件下载)，包括全部的文件和目录结构。支持 RJ/VJ/BJ 代码，自定义标签筛选下载。内置 Aria2 连接测试工具。
// @description:en     Download all(selected) folders and files for current work on asmr.one in one click, preserving folder structures. Supports RJ/VJ/BJ codes and quick audio selection.
// @author         惊奇 (Modified by Assistant)
// @license         MIT
// @match           https://www.asmr.one/*
// @match           https://www.asmr-100.com/*
// @match           https://www.asmr-200.com/*
// @match           https://www.asmr-300.com/*
// @match           https://asmr.one/*
// @match           https://asmr-100.com/*
// @match           https://asmr-200.com/*
// @match           https://asmr-300.com/*
// @connect         asmr.one
// @connect         asmr-100.com
// @connect         asmr-200.com
// @connect         asmr-300.com
// @connect         localhost
// @connect         127.0.0.1
// @connect         *
// @require         https://update.greasyfork.org/scripts/456034/1542392/Basic%20Functions%20%28For%20userscripts%29.js
// @require         https://update.greasyfork.org/scripts/458132/1138364/ItemSelector.js
// @icon            https://www.asmr.one/statics/app-logo-128x128.png
// @grant           GM_download
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563902/ASMR%20Online%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%2022.user.js
// @updateURL https://update.greasyfork.org/scripts/563902/ASMR%20Online%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%2022.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

(function __MAIN__() {
    'use strict';

    window.logToModal = function(msg, type='info') { console.log(msg); };
    let hasErrorOccurred = false;
    const OVERLAY_ID = 'asmr-overlay-unique-v4'; 

    const CONST = {
        HTML: {
            DownloadButton: `
                <button tabindex="0" type="button" id="download-btn"
                        class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-cyan q-mt-sm shadow-4 q-mx-xs q-px-sm text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap q-btn--dense">
                    <span class="q-focus-helper"></span><span class="q-btn__wrapper col row q-anchor--skip"><span
                        class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block" id="download-btn-inner">DOWNLOAD</span></span></span>
                </button>
            `
        },
        TextAllLang: {
            DEFAULT: 'en',
            'zh-CN': {
                DownloadFolder: 'ASMR-ONE',
                WorkFolder: '{RJ}',
                DownloadButton: '下载',
                DownloadButton_Working: '正在下载（{Done}/{All}）',
                DownloadButton_Done: '下载（已完成）',
                RootFolder: '根目录',
                NoTitle: '未命名'
            },
            'en': {
                DownloadFolder: 'ASMR-ONE',
                WorkFolder: '{RJ} ',
                DownloadButton: 'Download',
                DownloadButton_Working: 'Downloading({Done}/{All})',
                DownloadButton_Done: 'Download(Finished)',
                RootFolder: 'Root',
                NoTitle: 'No Title'
            }
        },
        Number: {
            Max_Download: 2,
            GUITextChangeDelay: 300
        }
    }

    const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
    CONST.Text = CONST.TextAllLang[i18n];

    loadFuncs([{
        id: 'utils',
        func() {
            const win = typeof unsafeWindow === 'object' && unsafeWindow !== null ? unsafeWindow : window;

            function htmlElm(html) {
                const parent = $CrE('div');
                parent.innerHTML = html;
                return parent.children.length > 1 ? Array.from(parent.children) : parent.children[0];
            }

            function getOSSep() {
                return ({ 'Windows': '\\', 'Mac': '/', 'iOS': '/', 'Linux': '/', 'Null': '-' })[getOS()];
            }

            function getOS() {
                const ua = navigator.userAgent.toLowerCase();
                const platform = (navigator.platform || '').toLowerCase();
                if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
                if (platform.includes('win') || ua.includes('windows')) return 'Windows';
                if (platform.includes('mac') || ua.includes('macintosh')) return 'Mac';
                return 'Linux';
            }

            function randstr(length = 16) {
                const all = 'abcdefghijklmnopqrstuvwxyz0123456789';
                return Array(length).fill(0).reduce(pre => (pre += all.charAt(Math.floor(Math.random() * all.length))), '');
            }

            function downloadText(text, name) {
                const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                dl_browser(url, name);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }

            function joinPath(p1, p2) {
                return p1.replace(/[\/\\]+$/, '') + getOSSep() + p2.replace(/^[\/\\]+/, '');
            }

            class ProgressManager {
                constructor(steps, callback) {
                    this.steps = steps;
                    this.callback = callback;
                    this.finished = 0;
                    if(this.steps) this.callback(0, this.steps);
                }
                add() { this.steps++; }
                async progress(promise) {
                    try { return await promise; }
                    finally { setTimeout(() => this.callback(++this.finished, this.steps)); }
                }
            }

            return { window: win, htmlElm, getOSSep, getOS, randstr, downloadText, joinPath, ProgressManager }
        }
    }, {
        id: 'aria2_internal',
        dependencies: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        func(GM_setValue, GM_getValue) {
            class Aria2Client {
                constructor() {
                    this.reloadConfig();
                }

                reloadConfig() {
                    this.host = GM_getValue('host', 'localhost');
                    this.port = GM_getValue('port', 6800);
                    this.secret = GM_getValue('secret', '');
                    this.dir = GM_getValue('dir', '');
                }

                async send(method, params = []) {
                    const url = `http://${this.host}:${this.port}/jsonrpc`;
                    const requestObj = {
                        jsonrpc: '2.0',
                        method: `aria2.${method}`,
                        id: 'asmr-' + Date.now(),
                        params: params
                    };

                    if (this.secret) {
                        requestObj.params.unshift(`token:${this.secret}`);
                    }

                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: url,
                            headers: { 'Content-Type': 'application/json' },
                            data: JSON.stringify(requestObj),
                            timeout: 5000,
                            onload: (res) => {
                                if (res.status === 200) {
                                    try {
                                        const r = JSON.parse(res.responseText);
                                        if (r.error) {
                                            window.logToModal(`[RPC Error] ${r.error.message}`, 'error');
                                            hasErrorOccurred = true;
                                            reject(new Error(r.error.message));
                                        } else {
                                            resolve(r.result);
                                        }
                                    } catch (e) {
                                        hasErrorOccurred = true;
                                        reject(new Error('Invalid JSON response'));
                                    }
                                } else {
                                    window.logToModal(`[HTTP Error] Status ${res.status}`, 'error');
                                    hasErrorOccurred = true;
                                    reject(new Error(`HTTP Error ${res.status}: ${res.statusText}`));
                                }
                            },
                            onerror: (e) => {
                                window.logToModal(`[Network Error] Connection failed to ${url}`, 'error');
                                hasErrorOccurred = true;
                                reject(new Error('Connection Failed'));
                            },
                            ontimeout: (e) => {
                                window.logToModal(`[Timeout] Request timed out.`, 'error');
                                hasErrorOccurred = true;
                                reject(new Error('Connection Timed Out'));
                            }
                        });
                    });
                }

                async getVersion() {
                    return this.send('getVersion');
                }

                async addUri(uri, options = {}) {
                    if (!this.dir) {
                        const msg = 'Download directory is missing! Click Settings.';
                        window.logToModal(`[Config Error] ${msg}`, 'error');
                        hasErrorOccurred = true;
                        throw new Error(msg);
                    }
                    
                    const finalOptions = Object.assign({}, options, { dir: this.dir });
                    
                    if (options.subDir) {
                        const sep = navigator.userAgent.includes('Windows') ? '\\' : '/';
                        let cleanDir = this.dir.replace(/[\\/]+$/, '');
                        let cleanSub = options.subDir.replace(/^[\\/]+/, '');
                        finalOptions.dir = cleanDir + sep + cleanSub;
                        delete finalOptions.subDir;
                    }
                    
                    window.logToModal(`[Aria2] Sending Task: ${options.out}`, 'info');
                    return this.send('addUri', [[uri], finalOptions]);
                }
            }

            const client = new Aria2Client();

            function configure() {
                const host = prompt('Aria2 Host (IP):', GM_getValue('host', 'localhost'));
                if (host === null) return;
                const port = prompt('Aria2 Port (端口):\n默认 6800，Motrix 请填 16800', GM_getValue('port', 6800));
                if (port === null) return;
                const secret = prompt('Aria2 Secret (密钥/Token):\n如果没有请留空', GM_getValue('secret', ''));
                if (secret === null) return;
                const dir = prompt('Download Directory (绝对路径):\n例如 D:\\ASMR', GM_getValue('dir', ''));
                if (dir === null) return;

                GM_setValue('host', host);
                GM_setValue('port', port);
                GM_setValue('secret', secret);
                GM_setValue('dir', dir);
                
                client.reloadConfig();
                alert('设置已保存！');
            }

            async function testConnection() {
                client.reloadConfig();
                try {
                    const ver = await client.getVersion();
                    alert(`✅ 连接成功！\nAria2 Version: ${ver.version}`);
                    return true;
                } catch (e) {
                    alert(`❌ 连接失败！\n原因: ${e.message}\n请检查 Aria2 是否运行，端口配置是否正确。`);
                    return false;
                }
            }

            return { client, configure, testConnection };
        }
    }, {
        id: 'downloader',
        dependencies: ['utils', 'aria2_internal'],
        params: ['GM_setValue', 'GM_getValue'],
        func(GM_setValue, GM_getValue) {
            const utils = require('utils');
            const { client } = require('aria2_internal');

            // 【核心修改】接受第三个参数 forceAria2，强制指定模式
            async function download(url, path, forceAria2) {
                // 优先使用传入的 forceAria2 参数，如果没有则读取存储
                const useAria2 = (forceAria2 !== undefined) ? forceAria2 : GM_getValue('use-aria2', false);
                
                if (useAria2) {
                    // === Aria2 Mode ===
                    client.reloadConfig(); 
                    const sep = utils.getOSSep();
                    const parts = path.split(sep);
                    const filename = parts.pop();
                    const subDir = parts.join(sep);

                    if (!client.dir) {
                        window.logToModal("Error: Aria2 directory not configured!", 'error');
                        throw new Error("No download dir");
                    }

                    try {
                        return await client.addUri(url, { 
                            out: filename, 
                            subDir: subDir,
                            header: [`referer: https://asmr-200.com/`, `user-agent: ${navigator.userAgent}`]
                        });
                    } catch (e) {
                        window.logToModal(`[Aria2 Fail] ${e.message}`, 'error');
                        hasErrorOccurred = true;
                        throw e;
                    }
                } else {
                    // === Browser Mode ===
                    const fullpath = utils.joinPath(CONST.Text.DownloadFolder, path);
                    window.logToModal(`[Browser DL] ${fullpath}`, 'info');
                    
                    return new Promise((resolve, reject) => {
                         GM_download({ 
                             url, 
                             name: fullpath, 
                             onload: () => {
                                 window.logToModal(`[Success] ${path}`, 'success');
                                 resolve();
                             }, 
                             onerror: (err) => {
                                 const errType = err.error || 'Unknown';
                                 window.logToModal(`[Browser Error] ${errType}: ${path}`, 'error');
                                 hasErrorOccurred = true;
                                 reject(err);
                             },
                             ontimeout: () => {
                                 window.logToModal(`[Browser Timeout] ${path}`, 'error');
                                 hasErrorOccurred = true;
                                 reject(new Error("Timeout"));
                             }
                         });
                    });
                }
            }
            return { download };
        }
    }, {
        id: 'api',
        func() {
            function tracks(id) {
                return new Promise((resolve, reject) => {
                    const host = `api.${location.host.match(/(?:[^.]+\.)?([^.]+\.[^.]+)/)[1]}`;
                    GM_xmlhttpRequest({
                        method: 'GET', url: `https://${host}/api/tracks/${id}`,
                        headers: { accept: 'application/json' },
                        onload: e => {
                            if (e.status === 200) {
                                try {
                                    const json = JSON.parse(e.responseText);
                                    if (json.error) {
                                        reject(new Error(json.error));
                                    } else {
                                        resolve(json);
                                    }
                                } catch(err) {
                                    reject(err);
                                }
                            } else {
                                reject(new Error(`API Error: ${e.status} ${e.statusText}`));
                            }
                        },
                        onerror: (err) => reject(new Error('Network Error'))
                    });
                });
            }
            return { tracks };
        }
    }, {
        id: 'main',
        dependencies: ['utils', 'api', 'downloader', 'aria2_internal'],
        func() {
            const utils = require('utils');
            const api = require('api');
            const downloader = require('downloader');
            const aria2 = require('aria2_internal');

            detectDom({ selector: '#work-tree', callback: () => pageWork() });

            async function pageWork() {
                const downloadBtn = utils.htmlElm(CONST.HTML.DownloadButton);
                const downloadBtn_inner = $(downloadBtn, '#download-btn-inner');
                downloadBtn_inner.innerText = CONST.Text.DownloadButton;
                (await detectDom(".q-page-container .q-pa-sm")).append(downloadBtn);
                $AEL(downloadBtn, 'click', showCustomSelector);

                async function showCustomSelector() {
                    const ids = getIds();
                    
                    let rawList = [];
                    try {
                        rawList = await api.tracks(ids.apiId); 
                    } catch (e) {
                        alert(`获取作品信息失败！\n\n尝试API ID: ${ids.apiId}\n错误信息: ${e.message}\n\n可能原因：URL结构变更或ID提取错误。`);
                        return;
                    }

                    const treeData = buildTree(rawList);
                    const allExtensions = getAllExtensions(rawList);
                    hasErrorOccurred = false; 
                    
                    const overlay = document.createElement('div');
                    overlay.id = OVERLAY_ID;
                    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;display:flex;justify-content:center;align-items:center;';
                    
                    const modal = document.createElement('div');
                    modal.style.cssText = 'background:white;width:600px;max-width:95%;height:85vh;min-height:500px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);display:flex;flex-direction:column;font-family:sans-serif;overflow:hidden;animation:popIn 0.2s ease-out;';
                    
                    const style = document.createElement('style');
                    style.innerHTML = `
                        @keyframes popIn { from{transform:scale(0.95);opacity:0;} to{transform:scale(1);opacity:1;} }
                        .asmr-dl-header { padding: 15px 20px; border-bottom: 1px solid #eee; font-size: 18px; font-weight: 500; color: #333; background: #fff; }
                        .asmr-dl-filters { padding: 10px 20px; display: flex; gap: 8px; flex-wrap: wrap; background: #fafafa; border-bottom: 1px solid #eee; }
                        .asmr-dl-tag { 
                            padding: 4px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; 
                            background: #e0e0e0; color: #333; border: 1px solid #ccc;
                            transition: all 0.2s; user-select: none;
                        }
                        .asmr-dl-tag:hover { opacity: 0.8; }
                        .asmr-dl-tag.active { 
                            background: #1976D2; color: white; border-color: #1976D2;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        }
                        .asmr-dl-stats { padding: 8px 20px; font-size: 13px; color: #666; border-bottom: 1px solid #eee; background: #fff; }
                        .asmr-dl-body { flex: 1; overflow-y: auto; padding: 10px; background: #fff; color: #333; }
                        .asmr-dl-log { height: 100px; background: #222; color: #ccc; font-family: monospace; font-size: 11px; padding: 5px; overflow-y: auto; border-top: 1px solid #444; }
                        .asmr-dl-footer { 
                            padding: 10px 20px; border-top: 1px solid #eee; display: flex; 
                            justify-content: space-between; align-items: center;
                            gap: 10px; background: white;
                        }
                        .asmr-dl-btn { padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; border: none; }
                        .asmr-dl-btn-cancel { background: transparent; color: #333; border: 1px solid #ccc; }
                        .asmr-dl-btn-ok { background: #00bcd4; color: white; font-weight: bold;}
                        .asmr-dl-btn-setting { background: #f0f0f0; color: #555; margin-left: 5px;}
                        .aria2-group { display: flex; align-items: center; font-size: 13px; color: #333; gap: 8px; }
                        .tree-item { display: flex; align-items: center; padding: 4px 0; font-size: 14px; color: #333; border-bottom: 1px solid #f9f9f9; }
                        .tree-item:hover { background: #f0f8ff; }
                        .tree-indent { margin-left: 22px; border-left: 1px solid #eee; }
                        .tree-checkbox { margin-right: 8px; cursor: pointer; }
                    `;
                    modal.appendChild(style);

                    const header = document.createElement('div');
                    header.className = 'asmr-dl-header';
                    header.innerText = `创建下载任务 (Name: ${ids.displayId})`;
                    modal.appendChild(header);

                    const filterBar = document.createElement('div');
                    filterBar.className = 'asmr-dl-filters';
                    allExtensions.forEach(ext => {
                        const tag = document.createElement('button');
                        tag.className = 'asmr-dl-tag';
                        tag.innerText = ext.toUpperCase().replace('.', '');
                        tag.onclick = () => {
                            tag.classList.toggle('active');
                            const isActive = tag.classList.contains('active');
                            const checkboxes = body.querySelectorAll(`.file-checkbox[data-ext="${ext}"]`);
                            checkboxes.forEach(cb => {
                                cb.checked = isActive;
                                cb.dispatchEvent(new Event('change'));
                            });
                            updateStats();
                        };
                        filterBar.appendChild(tag);
                    });
                    modal.appendChild(filterBar);

                    const statsBar = document.createElement('div');
                    statsBar.className = 'asmr-dl-stats';
                    statsBar.innerHTML = '<span id="asmr-dl-count">0</span> 已选';
                    modal.appendChild(statsBar);

                    const body = document.createElement('div');
                    body.className = 'asmr-dl-body';
                    
                    treeData.children.forEach(node => renderNode(node, body));
                    function renderNode(node, container) {
                        const div = document.createElement('div');
                        const itemRow = document.createElement('div');
                        itemRow.className = 'tree-item';
                        
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.className = node.type === 'folder' ? 'folder-checkbox' : 'file-checkbox';
                        cb.checked = false; 
                        cb.className += ' tree-checkbox';
                        cb.itemData = node;

                        if (node.type !== 'folder') {
                            const ext = node.title.includes('.') ? '.' + node.title.split('.').pop().toLowerCase() : '.other';
                            cb.dataset.ext = ext;
                        }

                        const icon = document.createElement('span');
                        icon.className = 'tree-icon';
                        icon.innerText = node.type === 'folder' ? '📁' : (node.title.match(/\.(mp3|wav|flac|m4a)$/i) ? '🎵' : (node.title.match(/\.(jpg|png|jpeg|gif)$/i) ? '🖼️' : '📄'));

                        const name = document.createElement('span');
                        name.className = 'tree-name';
                        name.innerText = node.title;

                        itemRow.append(cb, icon, name);
                        div.appendChild(itemRow);

                        cb.onchange = (e) => {
                            const checked = e.target.checked;
                            if (node.type === 'folder') {
                                const nextSibling = itemRow.nextElementSibling;
                                if (nextSibling && nextSibling.classList.contains('tree-indent')) {
                                    const childrenCbs = nextSibling.querySelectorAll('input[type="checkbox"]');
                                    childrenCbs.forEach(c => c.checked = checked);
                                }
                            }
                            updateParentState(cb);
                            updateStats();
                        };

                        if (node.children && node.children.length > 0) {
                            const childrenContainer = document.createElement('div');
                            childrenContainer.className = 'tree-indent';
                            node.children.forEach(child => renderNode(child, childrenContainer));
                            div.appendChild(childrenContainer);
                        }
                        container.appendChild(div);
                    }

                    function updateParentState(currentCb) {
                        const currentIndent = currentCb.closest('.tree-indent');
                        if (!currentIndent) return; 
                        const parentWrapper = currentIndent.parentElement;
                        const parentCb = parentWrapper.querySelector('.tree-item > input[type="checkbox"]');
                        if (parentCb) {
                            const siblings = currentIndent.querySelectorAll(':scope > div > .tree-item > input[type="checkbox"]');
                            const checkedCount = Array.from(siblings).filter(c => c.checked).length;
                            parentCb.checked = checkedCount > 0;
                            updateParentState(parentCb);
                        }
                    }
                    modal.appendChild(body);

                    const logDiv = document.createElement('div');
                    logDiv.className = 'asmr-dl-log';
                    logDiv.innerText = 'Log Console Ready.';
                    modal.appendChild(logDiv);

                    window.logToModal = function(msg, type) {
                        const line = document.createElement('div');
                        line.innerText = `> ${msg}`;
                        if (type === 'error') line.style.color = '#ff5555';
                        if (type === 'success') line.style.color = '#55ff55';
                        logDiv.appendChild(line);
                        logDiv.scrollTop = logDiv.scrollHeight;
                    }

                    const footer = document.createElement('div');
                    footer.className = 'asmr-dl-footer';
                    
                    const leftDiv = document.createElement('div');
                    leftDiv.className = 'aria2-group';
                    const ariaLabel = document.createElement('label');
                    const ariaInput = document.createElement('input');
                    ariaInput.type = 'checkbox';
                    ariaInput.checked = GM_getValue('use-aria2', false);
                    ariaInput.onchange = (e) => GM_setValue('use-aria2', e.target.checked);
                    ariaLabel.appendChild(ariaInput);
                    ariaLabel.appendChild(document.createTextNode('使用 Aria2'));
                    const btnConfig = document.createElement('button');
                    btnConfig.className = 'asmr-dl-btn asmr-dl-btn-setting';
                    btnConfig.innerText = '⚙ 设置';
                    btnConfig.onclick = () => aria2.configure();
                    const btnTest = document.createElement('button');
                    btnTest.className = 'asmr-dl-btn asmr-dl-btn-setting';
                    btnTest.innerText = '测试连接';
                    btnTest.onclick = () => aria2.testConnection();
                    leftDiv.append(ariaLabel, btnConfig, btnTest);
                    
                    const rightDiv = document.createElement('div');
                    
                    const closeModal = () => {
                        const el = document.getElementById(OVERLAY_ID);
                        if (el) el.remove();
                        if (document.body.contains(overlay)) document.body.removeChild(overlay);
                    };

                    const btnCancel = document.createElement('button');
                    btnCancel.className = 'asmr-dl-btn asmr-dl-btn-cancel';
                    btnCancel.innerText = '取消';
                    btnCancel.onclick = closeModal;
                    
                    const btnOk = document.createElement('button');
                    btnOk.className = 'asmr-dl-btn asmr-dl-btn-ok';
                    btnOk.innerText = '开始下载';
                    
                    btnOk.onclick = () => {
                        if (btnOk.dataset.action === 'close') {
                            closeModal();
                            return;
                        }

                        const tasks = [];
                        body.querySelectorAll('.file-checkbox:checked').forEach(cb => {
                            tasks.push({ item: cb.itemData, path: cb.itemPath });
                        });
                        if (tasks.length === 0) return alert('未选择任何文件');
                        
                        logDiv.innerHTML = '';
                        hasErrorOccurred = false;
                        window.logToModal(`Initialized ${tasks.length} tasks.`);
                        
                        // 【核心修复】强制同步 UI 状态到下载逻辑
                        const useAria2 = ariaInput.checked;
                        window.logToModal(`Download Mode: ${useAria2 ? 'Aria2 RPC' : 'Browser Native'}`);
                        
                        btnOk.disabled = true;
                        btnOk.innerText = '处理中...';

                        const manager = new utils.ProgressManager(tasks.length, on_progress);
                        // 传递 useAria2 参数
                        tasks.forEach(task => dealItem(task.item, task.path, manager, useAria2));
                    };
                    rightDiv.append(btnCancel, btnOk);
                    
                    footer.append(leftDiv, rightDiv);
                    modal.appendChild(footer);
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);

                    updateStats();

                    function updateStats() {
                        const count = body.querySelectorAll('.file-checkbox:checked').length;
                        document.getElementById('asmr-dl-count').innerText = count;
                    }
                }

                function buildTree(list) {
                    list = JSON.parse(JSON.stringify(list));
                    function convert(item) {
                        if (item.children && Array.isArray(item.children)) {
                            item.children = item.children.map(convert);
                        }
                        return item;
                    }
                    return { children: list.map(convert) };
                }

                function getAllExtensions(list) {
                    const exts = new Set();
                    const traverse = (items) => {
                        items.forEach(item => {
                            if (item.type === 'folder' && item.children) traverse(item.children);
                            else if (item.title) {
                                const match = item.title.match(/\.([a-zA-Z0-9]+)$/);
                                if (match) exts.add('.' + match[1].toLowerCase());
                            }
                        });
                    };
                    traverse(list);
                    return Array.from(exts).sort();
                }

                function replaceText(text, replacements) {
                    for (const [key, value] of Object.entries(replacements)) {
                        text = text.split(key).join(value);
                    }
                    return text;
                }

                async function dealItem(item, path = [], manager, useAria2) {
                     const sep = utils.getOSSep();
                     const url = item.mediaDownloadUrl;
                     
                     if (!url) {
                         window.logToModal(`Error: Item ${item.title} has no URL`, 'error');
                         await manager.progress(); // skip
                         return;
                     }

                     const WorkID = getIds().displayId;
                     
                     const dlpath = [
                         replaceText(CONST.Text.WorkFolder, { '{RJ}': WorkID, '{WorkName}': item.workTitle || CONST.Text.NoTitle }),
                         ...path,
                         item.title,
                     ].map(name => escapePath(name)).join(sep);
                     
                     try {
                        // 【核心修复】传入强制的 useAria2 参数
                        await manager.progress(downloader.download(url, dlpath, useAria2));
                     } catch (e) {
                         window.logToModal(`[Failed] ${e.message}`, 'error');
                         hasErrorOccurred = true;
                         console.error(e);
                     }
                }

                function on_progress(finished, total) {
                    downloadBtn_inner.innerText = replaceText(CONST.Text.DownloadButton_Working, { '{Done}': finished, '{All}': total });
                    
                    if (finished === total) {
                        downloadBtn_inner.innerText = CONST.Text.DownloadButton_Done;
                        const modalBtn = document.querySelector('.asmr-dl-btn-ok');
                        modalBtn.disabled = false;
                        modalBtn.dataset.action = 'close';
                        
                        if (hasErrorOccurred) {
                            window.logToModal('=== Completed with Errors ===', 'error');
                            modalBtn.innerText = '关闭 (有错误)';
                        } else {
                            window.logToModal('=== Success! Closing in 0.3s... ===', 'success');
                            modalBtn.innerText = '完成 (关闭)';
                            setTimeout(() => {
                                const el = document.getElementById(OVERLAY_ID);
                                if (el) el.remove();
                            }, 300);
                        }
                    }
                }

                function escapePath(path) {
                    const chars_bank = { '\\': '＼', '/': '／', ':': '：', '*': '＊', '?': '？', '"': "'", '<': '＜', '>': '＞', '|': '｜' };
                    for (const [char, replacement] of Object.entries(chars_bank)) path = path.replaceAll(char, replacement);
                    path.endsWith('.') && (path += '_');
                    return path;
                }
                
                function getIds() {
                    const path = location.pathname; 
                    const parts = path.split('/').filter(p => p); 
                    
                    let apiId = '';
                    let displayId = '';

                    const workIndex = parts.indexOf('work');
                    if (workIndex !== -1 && parts[workIndex + 1]) {
                        apiId = parts[workIndex + 1];
                        apiId = apiId.replace(/^[a-zA-Z]+/, "");
                    }

                    if (parts.length > 0) {
                        displayId = parts[parts.length - 1];
                    }
                    
                    if (!apiId) apiId = displayId.replace(/^[a-zA-Z]+/, "");
                    
                    return { apiId, displayId };
                }
                
                function getid() {
                    return getIds().apiId;
                }
            }
        }
    }]);
})();