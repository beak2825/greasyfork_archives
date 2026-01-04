// ==UserScript==
// @name            百度网盘链接补全工具
// @namespace       http://tampermonkey.net/
// @description     智能识别并补全百度网盘链接，支持选中文本提示和自动填写提取码
// @version         2.4.2
// @author          deepseek
// @license         MIT
// @match           https://*/*
// @match           http://*/*
// @grant           GM_openInTab
// @grant           GM_notification
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM_getResourceText
// @grant           GM_info
// @require         https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource        swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at          document-idle
// @homepageURL     https://github.com/your-repo
// @supportURL      https://github.com/your-repo/issues
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMTAzLjYgMTA3LjRjMy41LTIuMiA4LjktNi4xIDEzLjgtMTIuNXM3LjMtMTIuNSA4LjUtMTYuNWMuNS0xLjcgMi4yLTcuNSAyLjItMTQuNyAwLTEwLjEtMy4zLTI1LjEtMTUuNC0zNi44LTE0LjUtMTQtMzIuMS0xNC4zLTM1LjctMTQuMy04IDAtMTUuNyAxLjktMjIuNiA1LjJDNDQgMjMgMzUuNyAzMS40IDMwLjggNDEuN2MtMS4zIDIuOC00IDQuNy03LjEgNS00IC4zLTcuNSA0LjQtOC45IDkuNi0uNSAxLjktMS42IDMuNS0zLjEgNC43QzQuNCA2Ni44IDAgNzUuNyAwIDg1YzAgNi44IDIuMyAxMy4xIDYuMSAxOC4yIDUuNSA3LjQgMTQuMiAxMi4yIDI0IDEyLjJoNDcuMWM0LjQgMCAxMS0uNSAxOC4zLTMuNSAzLjItMS40IDUuOS0zIDguMS00LjV6IiBmaWxsPSIjNDQ0Ii8+PHBhdGggZD0iTTExOS44IDY0LjNjLjEtMTcuMS0xMC40LTI4LTEyLjUtMzAuMUM5NSAyMi4xIDc5LjkgMjEuOCA3Ni45IDIxLjhjLTE3LjYgMC0zMy4zIDEwLjUtMzkuOSAyNi43LS42IDEuMy0xLjggMi4zLTMuNCAyLjNoLS40Yy01LjggMC0xMC42IDQuOC0xMC42IDEwLjd2LjVjMCAxLjQtLjggMi42LTEuOSAzLjNDMTMuNCA2OSA4LjggNzYuOCA4LjggODVjMCAxMi4yIDkuOSAyMi4zIDIyLjIgMjIuM2g0NS4yYzMuNi0uMSAxNy42LS45IDI5LjYtMTIgMi45LTIuOCAxMy45LTEzLjcgMTQtMzF6IiBmaWxsPSIjZGI4NDEyIi8+PHBhdGggZD0iTTExMC44IDU3LjRsLjIgMy4zYzAgMS4zLTEuMSAyLjQtMi4zIDIuNC0xLjMgMC0yLjMtMS4xLTIuMy0yLjRsLS4xLTIuOHYtLjNjMC0xLjIuOS0yLjIgMi4xLTIuM2guM2MuNyAwIDEuMy4zIDEuNy43LS4yLjEuMy41LjQgMS40em0tMy4zLTEwLjNjMCAxLjItMSAyLjMtMi4yIDIuM2gtLjFjLS44IDAtMS42LS41LTItMS4yLTQuNi04LjMtMTMuMy0xMy41LTIyLjgtMTMuNS0xLjIgMC0yLjMtMS0yLjMtMi4ydi0uMWMwLTEuMiAxLTIuMyAyLjItMi4zaC4xYTMwLjM3IDMwLjM3IDAgMCAxIDE1LjggNC40YzQuNiAyLjggOC40IDYuOCAxMS4xIDExLjUuMS4zLjIuNy4yIDEuMXpNNjkuMiA0OWwxOS40IDE0LjhjMS45IDEuNSAzLjEgMy41IDMuNSA1Ljd2LjJjLjEuNC4xLjguMSAxLjIgMCAuNi0uMSAxLjEtLjIgMS42LS40IDIuMi0xLjcgNC4yLTMuNSA1LjZMNjkuMyA5M2MtMi42IDItNS40IDIuNS03LjcgMS40LS4xLS4xLS4yLS4xLS4yLS4yLTItMS4yLTMuMi0zLjUtMy4yLTYuNHYtNi42aC01LjdjLTYuOCAwLTEyLTQuNy0xMi0xMC45IDAtNC44IDIuNi04LjUgNy4yLTEwLjMgMS4zLS41IDIuNy4yIDMuMiAxLjVzLS4xIDIuOC0xLjQgMy4zYy0yLjcgMS4xLTQgMi45LTQgNS41IDAgMy41IDMgNiA3IDZoOC4xYzEuNSAwIDIuNyAxLjIgMi43IDIuNyAwIDEuNS0xLjIgMi43LTIuNyAyLjdoLTUuMWMtMS41IDAtMi43IDEuMi0yLjcgMi43czEuMiAyLjcgMi43IDIuN2g4LjFjLjUgMCAxIC4yIDEuNC42LjcuNiAxLjEgMS43IDEuMSAyLjZ2OC40YzAgMS4zLjQgMiAuNyAyLjEuNC4yIDEuMyAwIDIuNC0uOWwxOS4yLTE0LjljMS4yLS45IDEuOC0yLjEgMS44LTMuM3MtLjYtMi4zLTEuNy0zLjFMNjYuMiA1M2MtMS4xLS45LTItMS4xLTIuNC0uOS0uMy4yLS43LjktLjcgMi4xdjcuNmMwIC45LS41IDEuNy0xLjIgMi4xLS40LjMtLjguNC0xLjMuNC0xLjQgMC0yLjUtMS4xLTIuNS0yLjV2LTcuNmMwLTMuMSAxLjMtNS41IDMuNS02LjZsLjctLjNjMi4xLS43IDQuNi0uMSA2LjkgMS43eiIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/552532/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%A1%A5%E5%85%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552532/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%A1%A5%E5%85%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置选项
    let config = {
        debugMode: GM_getValue('debugMode', false),
        autoDetect: GM_getValue('autoDetect', true),
        rules: {
            removeSpaces: GM_getValue('removeSpaces', true),
            replaceDian: GM_getValue('replaceDian', true),
            removeColon: GM_getValue('removeColon', true),
            replaceMa: GM_getValue('replaceMa', true),
            removeChinese: GM_getValue('removeChinese', true),
            removePrefix: GM_getValue('removePrefix', true),
            strictValidation: GM_getValue('strictValidation', true)
        },
        showResultNotification: GM_getValue('showResultNotification', true),
        detectDelay: GM_getValue('detectDelay', 300),
        autoSubmit: GM_getValue('autoSubmit', true),
        autoClose: GM_getValue('autoClose', true),
        autoCloseDelay: GM_getValue('autoCloseDelay', 5000),
        activeInFront: GM_getValue('activeInFront', true),
        successTimes: GM_getValue('successTimes', 0)
    };

    // 站点白名单管理
    const siteManager = {
        getWhitelist() {
            try {
                return JSON.parse(GM_getValue('siteWhitelist', '[]'));
            } catch (e) {
                console.error('Failed to parse site whitelist:', e);
                return [];
            }
        },

        setWhitelist(list) {
            GM_setValue('siteWhitelist', JSON.stringify(list));
        },

        isCurrentSiteEnabled() {
            const whitelist = this.getWhitelist();
            const currentDomain = location.hostname;
            return whitelist.includes(currentDomain);
        },

        addCurrentSite() {
            const whitelist = this.getWhitelist();
            const currentDomain = location.hostname;
            if (!whitelist.includes(currentDomain)) {
                whitelist.push(currentDomain);
                this.setWhitelist(whitelist);
            }
            return currentDomain;
        },

        removeCurrentSite() {
            const whitelist = this.getWhitelist();
            const currentDomain = location.hostname;
            const newWhitelist = whitelist.filter(domain => domain !== currentDomain);
            this.setWhitelist(newWhitelist);
            return currentDomain;
        },

        removeDomain(domain) {
            const whitelist = this.getWhitelist();
            const newWhitelist = whitelist.filter(d => d !== domain);
            this.setWhitelist(newWhitelist);
            return domain;
        }
    };

    // 百度网盘配置
    const baiduConfig = {
        reg: /((?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/(doc\/|enterprise\/)?(?:s\/[\w~]*(((-)?\w*)*)?|share\/\S{4,}))/,
        host: /(pan|e?yun)\.baidu\.com/,
        input: ['#accessCode', '.share-access-code', '#wpdoc-share-page > .u-dialog__wrapper .u-input__inner'],
        button: ['#submitBtn', '.share-access .g-button', '#wpdoc-share-page > .u-dialog__wrapper .u-btn--primary'],
        name: '百度网盘',
        storage: 'hash',
        // 新增：分享码验证规则
        shareCodePattern: /^1[a-zA-Z0-9_-]{11,31}$/,
        minLength: 12,
        maxLength: 32
    };

    const customClass = {
        container: 'bdpan-container',
        popup: 'bdpan-popup',
    };

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    let lastSelectedText = "";
    let currentDetectedLink = null;
    let currentPassword = null;

    // 工具函数
    const util = {
        log(message) {
            if (config.debugMode) {
                console.log(`%c[百度网盘链接补全工具]`, `background:url(${GM_info.script.icon}) center center no-repeat;background-size:12px;padding:3px`, message);
            }
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        isHidden(el) {
            try {
                return el.offsetParent === null;
            } catch (e) {
                return false;
            }
        },

        query(selector) {
            if (Array.isArray(selector)) {
                let obj = null;
                for (let i = 0; i < selector.length; i++) {
                    let o = document.querySelector(selector[i]);
                    if (o) {
                        obj = o;
                        break;
                    }
                }
                return obj;
            }
            return document.querySelector(selector);
        },

        showNotification(title, text, icon = 'info') {
            if (config.showResultNotification) {
                Swal.fire({
                    toast: true,
                    position: 'top',
                    title: title,
                    text: text,
                    icon: icon,
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: customClass
                });
            }
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        parseQuery(name) {
            let reg = new RegExp(`(?<=(?:${name})\\=)(?:wss:[a-zA-Z0-9]+|[\\w-]+)`, "i")
            let pd = location.href.replace(/%3A/g, ":").match(reg);
            if (pd) {
                return pd[0];
            }
            return null;
        },

        copyToClipboard(text) {
            return new Promise((resolve, reject) => {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(resolve).catch(reject);
                } else {
                    // 降级方案
                    let textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                    document.body.removeChild(textArea);
                }
            });
        },

        // 历史记录功能
        getHistory() {
            try {
                return JSON.parse(GM_getValue('manualInputHistory', '[]'));
            } catch (e) {
                return [];
            }
        },

        addToHistory(text, result) {
            const history = this.getHistory();
            // 保留最近10条记录
            history.unshift({
                text: text,
                result: result,
                timestamp: new Date().toISOString()
            });

            if (history.length > 10) {
                history.pop();
            }

            GM_setValue('manualInputHistory', JSON.stringify(history));
        },

        clearHistory() {
            GM_setValue('manualInputHistory', '[]');
        }
    };

    // 主功能类
    const main = {
        // 初始化配置
        initConfig() {
            const defaultConfig = {
                debugMode: false,
                autoDetect: true,
                rules: {
                    removeSpaces: true,
                    replaceDian: true,
                    removeColon: true,
                    replaceMa: true,
                    removeChinese: true,
                    removePrefix: true,
                    strictValidation: true
                },
                showResultNotification: true,
                detectDelay: 300,
                autoSubmit: true,
                autoClose: true,
                autoCloseDelay: 5000,
                activeInFront: true,
                successTimes: 0
            };

            for (let key in defaultConfig) {
                if (util.getValue(key) === undefined) {
                    if (typeof defaultConfig[key] === 'object') {
                        for (let subKey in defaultConfig[key]) {
                            util.setValue(`${key}_${subKey}`, defaultConfig[key][subKey]);
                        }
                    } else {
                        util.setValue(key, defaultConfig[key]);
                    }
                }
            }
        },

        // 注册菜单命令 (仅当脚本在当前站点启用时)
        registerMenuCommands() {
            GM_registerMenuCommand('👀 已识别：' + config.successTimes + '次', () => {
                this.clearIdentifyTimes();
            });
            GM_registerMenuCommand('📋 手动识别', () => {
                this.showManualInput();
            });
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSettings();
            });
            GM_registerMenuCommand('📋 管理已启用网站', () => {
                this.showSiteManagement();
            });
            GM_registerMenuCommand('❌ 在此网站禁用', () => {
                this.disableOnCurrentSite();
            });
            GM_registerMenuCommand('🔄 重置配置', () => {
                this.resetSettings();
            });
        },

        // 注册最小菜单命令 (当脚本在当前站点未启用时)
        registerMinimalMenuCommands() {
            GM_registerMenuCommand(`✅ 在 ${location.hostname} 启用`, () => {
                this.enableOnCurrentSite();
            });
            GM_registerMenuCommand('📋 管理已启用网站', () => {
                this.showSiteManagement();
            });
        },

        // 在当前站点启用脚本
        enableOnCurrentSite() {
            const domain = siteManager.addCurrentSite();
            Swal.fire({
                title: '已启用',
                html: `已在 <strong>${domain}</strong> 启用脚本。<br>页面即将刷新以应用更改。`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: customClass
            }).then(() => {
                window.location.reload();
            });
        },

        // 在当前站点禁用脚本
        disableOnCurrentSite() {
            Swal.fire({
                title: '确认禁用',
                html: `确定要在 <strong>${location.hostname}</strong> 禁用脚本吗？`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: customClass
            }).then((result) => {
                if (result.isConfirmed) {
                    const domain = siteManager.removeCurrentSite();
                    Swal.fire({
                        title: '已禁用',
                        html: `已在 <strong>${domain}</strong> 禁用脚本。<br>页面即将刷新。`,
                        icon: 'info',
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: customClass
                    }).then(() => {
                        window.location.reload();
                    });
                }
            });
        },

        // 显示站点管理界面
        showSiteManagement() {
            const whitelist = siteManager.getWhitelist();
            let html = '<div style="max-height: 300px; overflow-y: auto; margin: 10px 0;">';

            if (whitelist.length === 0) {
                html += '<p>暂无已启用的网站</p>';
            } else {
                html += '<ul style="list-style: none; padding: 0; margin: 0;">';
                whitelist.forEach(domain => {
                    html += `
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                            <span>${domain}</span>
                            <button class="bdpan-remove-btn" data-domain="${domain}"
                                style="background: #ff4757; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">
                                移除
                            </button>
                        </li>
                    `;
                });
                html += '</ul>';
            }
            html += '</div>';

            Swal.fire({
                title: '已启用网站列表',
                html: html,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: '关闭',
                width: '500px',
                customClass: customClass,
                didOpen: () => {
                    // 添加移除按钮的事件监听
                    document.querySelectorAll('.bdpan-remove-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const domain = btn.getAttribute('data-domain');
                            this.removeDomain(domain);
                        });
                    });
                }
            });
        },

        // 移除特定域名
        removeDomain(domain) {
            Swal.fire({
                title: '确认移除',
                html: `确定要从白名单中移除 <strong>${domain}</strong> 吗？`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: customClass
            }).then((result) => {
                if (result.isConfirmed) {
                    siteManager.removeDomain(domain);
                    Swal.fire({
                        title: '已移除',
                        html: `已从白名单中移除 <strong>${domain}</strong>`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: customClass
                    }).then(() => {
                        this.showSiteManagement(); // 刷新列表
                    });
                }
            });
        },

        // 增强的手动识别功能
        showManualInput() {
            const history = util.getHistory();
            let historyHtml = '';

            if (history.length > 0) {
                historyHtml = `
                    <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">最近识别记录</h4>
                        <div style="max-height: 150px; overflow-y: auto;">
                `;

                history.forEach((item, index) => {
                    const time = new Date(item.timestamp).toLocaleTimeString();
                    const truncatedText = item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text;
                    historyHtml += `
                        <div style="padding: 5px; margin-bottom: 5px; background: #f9f9f9; border-radius: 4px; font-size: 12px;">
                            <div style="color: #999; margin-bottom: 3px;">${time}</div>
                            <div title="${item.text}">${truncatedText}</div>
                            <button class="bdpan-history-btn" data-index="${index}"
                                style="background: #4caf50; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 3px;">
                                再次识别
                            </button>
                        </div>
                    `;
                });

                historyHtml += `
                        </div>
                        <button id="bdpan-clear-history" style="background: none; border: none; color: #999; cursor: pointer; font-size: 12px; margin-top: 5px;">
                            清除历史记录
                        </button>
                    </div>
                `;
            }

            Swal.fire({
                title: '手动识别百度网盘链接',
                html: `
                    <div style="text-align: left; margin-bottom: 15px;">
                        <div style="font-size: 13px; color: #666; margin-bottom: 10px;">
                            支持识别以下格式：
                            <ul style="margin: 5px 0 5px 15px; padding: 0;">
                                <li>完整链接：</li>
                                <li>分享码：1abc123def456 (以1开头，12-32位)</li>
                                <li>带提取码：1abc123def456 提取码: abcd</li>
                                <li>其他包含分享码的文本</li>
                            </ul>
                        </div>
                    </div>
                `,
                input: 'textarea',
                inputPlaceholder: '请输入或粘贴包含百度网盘链接或分享码的文本',
                inputAttributes: {
                    'aria-label': '输入百度网盘链接或分享码'
                },
                showCancelButton: true,
                confirmButtonText: '识别',
                cancelButtonText: '取消',
                customClass: customClass,
                footer: historyHtml,
                preConfirm: () => {
                    const input = Swal.getInput();
                    if (!input.value.trim()) {
                        Swal.showValidationMessage('请输入内容');
                        return false;
                    }
                    return input.value;
                },
                didOpen: () => {
                    // 添加历史记录按钮事件
                    document.querySelectorAll('.bdpan-history-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const index = parseInt(btn.getAttribute('data-index'));
                            const historyItem = history[index];
                            Swal.getInput().value = historyItem.text;
                        });
                    });

                    // 添加清除历史按钮事件
                    const clearBtn = document.getElementById('bdpan-clear-history');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            util.clearHistory();
                            Swal.close();
                            this.showManualInput(); // 重新打开对话框
                        });
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const inputText = result.value;
                    const processedText = this.processText(inputText);
                    const password = this.extractPassword(inputText);

                    // 保存到历史记录
                    util.addToHistory(inputText, {
                        processed: processedText,
                        password: password,
                        success: this.isValidProcessedContent(processedText) || this.isValidBaiduLink(inputText)
                    });

                    // 处理识别
                    if (this.isValidBaiduLink(inputText)) {
                        this.showLinkNotification(inputText, "识别到百度网盘链接", password);
                    } else if (processedText && this.isValidProcessedContent(processedText)) {
                        const baiduLink = `https://pan.baidu.com/s/${processedText}`;
                        this.showLinkNotification(baiduLink, "识别到百度网盘分享码", password);
                    } else {
                        // 识别失败的处理
                        Swal.fire({
                            title: '识别失败',
                            html: `
                                <div style="text-align: left;">
                                    <p>未能从输入文本中识别出有效的百度网盘链接或分享码。</p>
                                    <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 10px 0;">
                                        <strong>输入内容：</strong><br>
                                        <pre style="white-space: pre-wrap; font-size: 12px;">${inputText}</pre>
                                    </div>
                                    <p>请检查输入内容是否符合支持的格式。</p>
                                    <p style="color: #666; font-size: 12px; margin-top: 10px;">
                                        <strong>提示：</strong> 百度网盘分享码通常以数字"1"开头，长度为12-32位字符
                                    </p>
                                </div>
                            `,
                            icon: 'error',
                            confirmButtonText: '重新输入',
                            showCancelButton: true,
                            cancelButtonText: '关闭',
                            customClass: customClass
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.showManualInput();
                            }
                        });
                    }
                }
            });
        },

        // 添加页面监听
        addPageListeners() {
            if (config.autoDetect) {
                document.addEventListener('mouseup', this.handleMouseUp.bind(this), true);
            }
            document.addEventListener('keydown', this.pressKey.bind(this), true);
        },

        // 处理键盘事件
        pressKey(event) {
            if (event.key === 'Enter') {
                let confirmBtn = document.querySelector('.bdpan-container .swal2-confirm');
                confirmBtn && confirmBtn.click();
            }
            if (event.key === 'Escape') {
                let cancelBtn = document.querySelector('.bdpan-container .swal2-cancel');
                cancelBtn && cancelBtn.click();
            }
        },

        // 处理鼠标抬起事件
        handleMouseUp(event) {
            setTimeout(() => {
                const selection = window.getSelection().toString().trim();
                if (selection && selection !== lastSelectedText) {
                    lastSelectedText = selection;
                    this.processSelection(selection);
                }
            }, config.detectDelay);
        },

        // 处理选中的文本
        processSelection(text) {
            util.log(`检测到文本: ${text}`);

            // 首先检查是否包含完整的百度网盘链接
            const baiduLinkMatch = text.match(/https?:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9_-]+/);
            if (baiduLinkMatch) {
                const link = baiduLinkMatch[0];
                const password = this.extractPassword(text);
                util.log(`直接提取到百度链接: ${link}, 密码: ${password}`);
                this.showLinkNotification(link, "检测到百度网盘链接", password);
                return;
            }

            // 检查是否已经是完整链接（使用原有的正则）
            if (this.isValidBaiduLink(text)) {
                const password = this.extractPassword(text);
                this.showLinkNotification(text, "检测到百度网盘链接", password);
                return;
            }

            // 处理文本尝试提取分享码
            const processedText = this.processText(text);
            const password = this.extractPassword(text);

            if (processedText && this.isValidProcessedContent(processedText)) {
                const baiduLink = `https://pan.baidu.com/s/${processedText}`;
                currentDetectedLink = baiduLink;
                currentPassword = password;
                this.showLinkNotification(baiduLink, "检测到百度网盘分享码", password);
            } else {
                util.log(`未能从文本中提取有效信息: ${text}`);
            }
        },

        // 检查是否是有效的百度网盘链接
        isValidBaiduLink(text) {
            return baiduConfig.reg.test(text);
        },

        // 检查处理后的内容是否有效 - 增强验证
        isValidProcessedContent(text) {
            // 如果是完整链接，直接返回true
            if (this.isValidBaiduLink(text)) {
                return true;
            }

            // 提取纯分享码部分（去除查询参数）
            let pureCode = text.split('?')[0];

            // 基本长度检查
            if (pureCode.length < baiduConfig.minLength || pureCode.length > baiduConfig.maxLength) {
                util.log(`长度检查失败: ${pureCode.length}`);
                return false;
            }

            // 字符集检查
            if (!/^[a-zA-Z0-9_-]+$/.test(pureCode)) {
                util.log(`字符集检查失败: ${pureCode}`);
                return false;
            }

            // 严格验证：检查是否以1开头
            if (config.rules.strictValidation) {
                const result = baiduConfig.shareCodePattern.test(pureCode);
                util.log(`严格验证结果: ${result} for ${pureCode}`);
                return result;
            } else {
                // 宽松模式：只检查基本格式
                const result = pureCode.length >= baiduConfig.minLength &&
                       pureCode.length <= baiduConfig.maxLength &&
                       /^[a-zA-Z0-9_-]+$/.test(pureCode);
                util.log(`宽松验证结果: ${result} for ${pureCode}`);
                return result;
            }
        },

        // 增强的文本处理函数
        processText(text) {
            let processed = text;

            // 首先尝试直接提取百度网盘链接
            const baiduLinkMatch = processed.match(/https?:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9_-]+/);
            if (baiduLinkMatch) {
                processed = baiduLinkMatch[0];
                util.log(`直接提取到百度链接: ${processed}`);
            }

            // 应用配置的规则
            if (config.rules.removeSpaces) {
                processed = processed.replace(/\s/g, '');
            }

            if (config.rules.replaceDian) {
                processed = processed.replace(/[点點]/g, '.');
            }

            if (config.rules.removeColon) {
                processed = processed.replace(/[:：]/g, '');
            }

            if (config.rules.replaceMa) {
                processed = processed.replace(/[码碼]/g, '?pwd=');
            }

            if (config.rules.removeChinese) {
                processed = processed.replace(/[\u4E00-\u9FFF\u3400-\u4DBF]/g, '');
            }

            if (config.rules.removePrefix) {
                processed = processed.replace(/^(?:https?:\/\/pan\.baidu\.com)?\/?s\/?|^\/?/, '');
            }

            // 提取可能的提取码部分
            const extractCodeMatch = processed.match(/(.*?)(?:\?pwd=([a-zA-Z0-9]+))?$/);
            if (extractCodeMatch && extractCodeMatch[2]) {
                processed = `${extractCodeMatch[1]}?pwd=${extractCodeMatch[2]}`;
            }

            util.log(`处理后的文本: ${processed}`);
            return processed;
        },

        // 增强的密码提取函数
        extractPassword(text) {
            // 清理文本
            text = text.replace(/\u200B/g, '').replace('%3A', ":");
            text = text.replace(/(?:本帖)?隐藏的?内容[：:]?/, "");

            util.log(`开始提取密码，文本: ${text}`);

            // 方法1：直接匹配"提取码"后面的内容（优先级最高）
            let reg1 = /(?:提取码|密码|验证码|pwd|password)[：:\s]*([a-zA-Z0-9]{3,8})/i;
            if (reg1.test(text)) {
                let match = text.match(reg1);
                util.log(`方法1匹配到密码: ${match[1]}`);
                return match[1];
            }

            // 方法2：匹配常见的提取码格式
            let reg2 = /(?<=\s*(?:密|提取|访问|訪問|key|password|pwd|#|\?p=)\s*[码碼]?\s*[：:=]?\s*)[a-zA-Z0-9]{3,8}/i;
            if (reg2.test(text)) {
                let match = text.match(reg2);
                util.log(`方法2匹配到密码: ${match[0]}`);
                return match[0];
            }

            util.log(`未提取到密码`);
            return '';
        },

        // 显示链接通知
        showLinkNotification(link, title, password = '') {
            const startTime = performance.now();
            const finalLink = password ? (link.includes('?') ? `${link}&pwd=${password}` : `${link}?pwd=${password}`) : link;

            // 添加验证状态提示
            const validationStatus = config.rules.strictValidation ?
                '<div style="font-size: 12px; color: #4caf50; margin: 5px 0;">✓ 分享码格式验证通过</div>' :
                '<div style="font-size: 12px; color: #ff9800; margin: 5px 0;">⚠ 宽松模式：未严格验证分享码格式</div>';

            const options = {
                title: `<span style="color: #2778c4;margin: 0 5px;">${title}</span>`,
                html: `${validationStatus}<div class="bdpan-link-text">${link}</div>${password ? `<div style="margin-bottom: 10px;margin-top: 10px;">提取码: <strong>${password}</strong></div>` : ''}`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: '打开链接',
                denyButtonText: '复制链接',
                cancelButtonText: '关闭',
                position: 'top',
                customClass: customClass
            };

            // 添加自动关闭功能
            if (config.autoClose) {
                options.timer = config.autoCloseDelay;
                options.timerProgressBar = true;
            }

            Swal.fire(options).then((result) => {
                const endTime = performance.now();
                util.log(`识别耗时: ${(endTime - startTime).toFixed(2)}ms`);

                if (result.isConfirmed) {
                    config.successTimes++;
                    util.setValue('successTimes', config.successTimes);
                    this.openLink(link, password);
                } else if (result.isDenied) {
                    // 复制链接到剪贴板
                    util.copyToClipboard(finalLink).then(() => {
                        util.showNotification('成功', '链接已复制到剪贴板', 'success');
                    }).catch(err => {
                        util.showNotification('错误', '复制失败，请手动复制', 'error');
                        console.error('复制失败:', err);
                    });
                }
                // 如果是计时器结束或点击关闭，什么都不做
            });
        },

        // 打开链接
        openLink(link, password = '') {
            let finalLink = link;
            if (password) {
                finalLink = finalLink.includes('?') ?
                    `${finalLink}&pwd=${password}` :
                    `${finalLink}?pwd=${password}`;
            }

            GM_openInTab(finalLink, { active: config.activeInFront });
            util.showNotification('成功', '已打开百度网盘链接', 'success');
        },

        // 自动填写密码
        autoFillPassword() {
            if (!baiduConfig.host.test(location.hostname)) return;

            const password = this.extractPasswordFromURL();
            if (!password) return;

            this.doFillAction(baiduConfig.input, baiduConfig.button, password);
        },

        // 从URL中提取密码
        extractPasswordFromURL() {
            const queryPwd = util.parseQuery('pwd');
            const hashPwd = location.hash.slice(1).replace(/\W/g, "");
            return queryPwd || hashPwd;
        },

        // 执行填充操作
        doFillAction(inputSelector, buttonSelector, pwd) {
            let maxAttempts = 10;
            const interval = setInterval(async () => {
                maxAttempts--;
                const input = util.query(inputSelector);
                const button = util.query(buttonSelector);

                if (input && !util.isHidden(input)) {
                    clearInterval(interval);

                    Swal.fire({
                        toast: true,
                        position: 'top',
                        showCancelButton: false,
                        showConfirmButton: false,
                        title: 'AI已识别到密码！正自动帮您填写',
                        icon: 'success',
                        timer: 2000,
                        customClass: customClass
                    });

                    let lastValue = input.value;
                    input.value = pwd;
                    // 触发输入事件
                    const event = new Event('input', { bubbles: true });
                    const tracker = input._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    input.dispatchEvent(event);

                    if (config.autoSubmit) {
                        await util.sleep(1000);
                        button && button.click();
                    }
                } else if (maxAttempts <= 0) {
                    clearInterval(interval);
                }
            }, 800);
        },

        // 显示设置面板
        showSettings() {
            let html = `
                <div style="font-size: 1em;">
                    <label class="bdpan-setting-label">
                        自动检测选中文本
                        <input type="checkbox" id="autoDetect" ${config.autoDetect ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        自动提交提取码
                        <input type="checkbox" id="autoSubmit" ${config.autoSubmit ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        显示结果通知
                        <input type="checkbox" id="showNotification" ${config.showResultNotification ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        前台打开标签页
                        <input type="checkbox" id="activeInFront" ${config.activeInFront ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        自动关闭弹窗
                        <input type="checkbox" id="autoClose" ${config.autoClose ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label" id="autoCloseWrapper" style="${config.autoClose ? '' : 'display: none'}">
                        自动关闭时间(毫秒)
                        <input type="number" id="autoCloseDelay" value="${config.autoCloseDelay}" style="width: 100px;">
                    </label>
                    <label class="bdpan-setting-label">
                        检测延迟(毫秒)
                        <input type="number" id="detectDelay" value="${config.detectDelay}" style="width: 80px;">
                    </label>
                    <hr style="margin: 15px 0;">
                    <div style="font-weight: bold; margin-bottom: 10px;">文本处理规则:</div>
                    <label class="bdpan-setting-label">
                        移除空格
                        <input type="checkbox" id="removeSpaces" ${config.rules.removeSpaces ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        替换"点"
                        <input type="checkbox" id="replaceDian" ${config.rules.replaceDian ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        移除冒号
                        <input type="checkbox" id="removeColon" ${config.rules.removeColon ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        替换"码"
                        <input type="checkbox" id="replaceMa" ${config.rules.replaceMa ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        移除中文
                        <input type="checkbox" id="removeChinese" ${config.rules.removeChinese ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        移除前缀
                        <input type="checkbox" id="removePrefix" ${config.rules.removePrefix ? 'checked' : ''} class="bdpan-setting-checkbox">
                    </label>
                    <label class="bdpan-setting-label">
                        严格验证分享码格式
                        <input type="checkbox" id="strictValidation" ${config.rules.strictValidation ? 'checked' : ''} class="bdpan-setting-checkbox">
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">
                            启用后将验证分享码是否以"1"开头，长度为12-32位
                        </div>
                    </label>
                </div>
            `;

            Swal.fire({
                title: '百度网盘链接补全工具设置',
                html: html,
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                customClass: customClass,
                didOpen: () => {
                    // 添加事件监听
                    document.getElementById('autoClose').addEventListener('change', (e) => {
                        document.getElementById('autoCloseWrapper').style.display = e.target.checked ? 'flex' : 'none';
                    });
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.saveSettings();
                    util.showNotification('设置已保存', '部分设置需要刷新页面后生效', 'success');
                }
            });
        },

        // 保存设置
        saveSettings() {
            // 保存基本设置
            util.setValue('autoDetect', document.getElementById('autoDetect').checked);
            util.setValue('autoSubmit', document.getElementById('autoSubmit').checked);
            util.setValue('showResultNotification', document.getElementById('showNotification').checked);
            util.setValue('activeInFront', document.getElementById('activeInFront').checked);
            util.setValue('autoClose', document.getElementById('autoClose').checked);
            util.setValue('autoCloseDelay', parseInt(document.getElementById('autoCloseDelay').value) || 5000);
            util.setValue('detectDelay', parseInt(document.getElementById('detectDelay').value) || 300);

            // 保存规则设置
            util.setValue('rules_removeSpaces', document.getElementById('removeSpaces').checked);
            util.setValue('rules_replaceDian', document.getElementById('replaceDian').checked);
            util.setValue('rules_removeColon', document.getElementById('removeColon').checked);
            util.setValue('rules_replaceMa', document.getElementById('replaceMa').checked);
            util.setValue('rules_removeChinese', document.getElementById('removeChinese').checked);
            util.setValue('rules_removePrefix', document.getElementById('removePrefix').checked);
            util.setValue('rules_strictValidation', document.getElementById('strictValidation').checked);

            // 更新当前配置
            this.loadConfig();
        },

        // 加载配置
        loadConfig() {
            config.autoDetect = util.getValue('autoDetect');
            config.autoSubmit = util.getValue('autoSubmit');
            config.showResultNotification = util.getValue('showResultNotification');
            config.activeInFront = util.getValue('activeInFront');
            config.autoClose = util.getValue('autoClose');
            config.autoCloseDelay = util.getValue('autoCloseDelay') || 5000;
            config.detectDelay = util.getValue('detectDelay');
            config.successTimes = util.getValue('successTimes') || 0;

            // 加载规则配置
            config.rules.removeSpaces = util.getValue('rules_removeSpaces');
            config.rules.replaceDian = util.getValue('rules_replaceDian');
            config.rules.removeColon = util.getValue('rules_removeColon');
            config.rules.replaceMa = util.getValue('rules_replaceMa');
            config.rules.removeChinese = util.getValue('rules_removeChinese');
            config.rules.removePrefix = util.getValue('rules_removePrefix');
            config.rules.strictValidation = util.getValue('rules_strictValidation') !== false;
        },

        // 重置识别次数
        clearIdentifyTimes() {
            Swal.fire({
                title: '确定要重置识别次数吗？',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: customClass
            }).then((result) => {
                if (result.isConfirmed) {
                    util.setValue('successTimes', 0);
                    config.successTimes = 0;
                    util.showNotification('已重置', '识别次数已重置为0', 'success');
                }
            });
        },

        // 重置设置
        resetSettings() {
            Swal.fire({
                title: '确认重置所有设置？',
                text: '这将恢复所有设置为默认值',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: customClass
            }).then((result) => {
                if (result.isConfirmed) {
                    // 清除所有存储的值
                    const keys = [
                        'autoDetect', 'autoSubmit', 'showResultNotification',
                        'autoClose', 'autoCloseDelay', 'detectDelay', 'activeInFront', 'successTimes',
                        'rules_removeSpaces', 'rules_replaceDian', 'rules_removeColon',
                        'rules_replaceMa', 'rules_removeChinese', 'rules_removePrefix', 'rules_strictValidation'
                    ];

                    keys.forEach(key => {
                        util.setValue(key, undefined);
                    });

                    this.initConfig();
                    this.loadConfig();
                    util.showNotification('设置已重置', '页面将刷新以应用更改', 'success');
                    setTimeout(() => location.reload(), 1000);
                }
            });
        },

        // 添加插件样式
        addPluginStyle() {
            let style = `
                .bdpan-container {
                    z-index: 99999!important;
                    top: 20px !important;
                    bottom: auto !important;
                }
                .bdpan-popup {
                    font-size: 14px !important;
                    margin-top: 20px;
                }
                .bdpan-setting-label {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 15px;
                    margin-bottom: 10px;
                }
                .bdpan-setting-checkbox { width: 16px; height: 16px; }
                .bdpan-link-text {
                    word-break: break-all;
                    font-size: 14px;
                    background-color: #f9f9f9;
                    padding: 12px;
                    border-radius: 4px;
                    border: 1px solid #eee;
                    max-height: 120px;
                    overflow-y: auto;
                    margin: 10px 0;
                }
                .swal2-popup .swal2-actions {
                    margin: 1em auto 0.5em;
                }
                .bdpan-remove-btn:hover {
                    background: #ff6b81 !important;
                }
                .bdpan-history-btn:hover {
                    background: #66bb6a !important;
                }
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('bdpan-style', 'style', style);
            }

            // 使用MutationObserver确保样式在各种情况下都能正确注入
            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('bdpan-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        // 初始化
        init() {
            this.initConfig();
            this.loadConfig();
            this.addPluginStyle();

            // 检查当前站点是否在白名单中
            if (!siteManager.isCurrentSiteEnabled()) {
                util.log(`脚本未在当前站点 (${location.hostname}) 启用，停止执行主逻辑。`);
                // 只注册最小菜单命令
                this.registerMinimalMenuCommands();
                return;
            }

            // 如果启用了，才执行原来的逻辑
            this.registerMenuCommands();
            this.addPageListeners();
            this.autoFillPassword();

            util.log(`百度网盘链接补全工具已在 ${location.hostname} 加载`);
        }
    };

    // 初始化脚本
    main.init();
})();