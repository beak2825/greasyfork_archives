// ==UserScript==
// @name         SmartStrm助手 - 转存触发任务
// @namespace    https://github.com/Cp0204/SmartStrm
// @license      AGPL
// @icon         https://raw.githubusercontent.com/Cp0204/SmartStrm/refs/heads/main/img/icon.svg
// @version      1.1
// @description  监听天翼云盘、夸克网盘和115网盘转存成功事件，根据转存路径触发 SmartStrm 任务，支持设置延时触发。
// @author       Cp0204
// @match        https://cloud.189.cn/web/share?code=*
// @match        https://pan.quark.cn/s/*
// @match        https://115cdn.com/s/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/549634/SmartStrm%E5%8A%A9%E6%89%8B%20-%20%E8%BD%AC%E5%AD%98%E8%A7%A6%E5%8F%91%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/549634/SmartStrm%E5%8A%A9%E6%89%8B%20-%20%E8%BD%AC%E5%AD%98%E8%A7%A6%E5%8F%91%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let webhook = GM_getValue('webhook', '');
    let delay = parseInt(GM_getValue('delay', 0), 10);

    // 设置
    async function setWebhookUrl() {
        Swal.fire({
            title: 'SmartStrm助手设置',
            html: `
                <label for="webhook-input">Webhook 地址：</label>
                <input id="webhook-input" class="swal2-input" placeholder="http://192.168.8.8:8024/webhook/9dfb573e83" value="${webhook || ''}"><br>
                <label for="delay-input">执行延时：</label>
                <input id="delay-input" class="swal2-input" type="number" min="0" title="0为不延时" value="${delay}"> 秒
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const webhookInput = document.getElementById('webhook-input').value;
                const delayInput = document.getElementById('delay-input').value;
                if (!webhookInput) {
                    Swal.showValidationMessage('Webhook 地址不能为空！');
                    return false;
                }
                if (delayInput === '' || isNaN(parseInt(delayInput, 10)) || parseInt(delayInput, 10) < 0) {
                    Swal.showValidationMessage('延时应为非负整数！');
                    return false;
                }
                return { webhook: webhookInput, delay: parseInt(delayInput, 10) };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                webhook = result.value.webhook;
                delay = result.value.delay;
                GM_setValue('webhook', webhook);
                GM_setValue('delay', delay);
                Swal.fire({
                    title: '设置已保存',
                    icon: 'success',
                    html: `Webhook 地址: ${webhook}<br><br>转存延时: ${delay} 秒<br><br>可在油猴菜单中重新设置`,
                    confirmButtonText: '好的'
                });
            }
        });;
    }

    // 注册菜单命令
    GM_registerMenuCommand('参数设置', setWebhookUrl);


    // 页面加载完成后再检查
    window.addEventListener('load', async () => {
        if (!webhook) {
            await setWebhookUrl();
        }
        // 根据当前域名判断处理逻辑
        if (window.location.hostname === 'cloud.189.cn') {
            initCloud189();
        } else if (window.location.hostname === 'pan.quark.cn') {
            initQuark();
        } else if (window.location.hostname === '115cdn.com') {
            init115();
        }
        console.log('SmartStrm助手已启动');
    });


    // 天翼云盘处理逻辑
    function initCloud189() {
        let saveSuccess = false;
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', function () {
                try {
                    if (this._url.includes('api/open/batch/checkBatchTask.action')) {
                        const response = JSON.parse(this.responseText);
                        // taskStatus=4 任务成功
                        if (response.taskStatus === 4) {
                            saveSuccess = true;
                            console.log('检测到天翼云盘转存成功');
                        }
                    }
                    // 监听系统发出的 getLastSavePath.action 请求，但仅在转存成功后才处理
                    else if (this._url.includes('api/open/getLastSavePath.action') && saveSuccess) {
                        const response = JSON.parse(this.responseText);
                        if (response.code === 'success') {
                            const savepath = response.data.filePath;
                            sendWebhook(savepath, 'cloud189');
                            saveSuccess = false;
                        }
                    }
                } catch (e) {
                    console.error('SmartStrm助手解析响应出错:', e);
                }
            });
            originalSend.apply(this, arguments);
        };
    }

    // 夸克网盘处理逻辑
    function initQuark() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', function () {
                try {
                    if (this._url.includes('drive-pc.quark.cn/1/clouddrive/task')) {
                        const response = JSON.parse(this.responseText);
                        // status=2 任务成功
                        if (response.data && response.data.status === 2) {
                            console.log('检测到夸克网盘转存成功');
                            let pathElement = document.querySelector('.path-name');
                            const savepath = pathElement ? pathElement.title.replace('全部文件', '').trim() : "";
                            sendWebhook(savepath, 'quark');
                        }
                    }
                } catch (e) {
                    console.error('SmartStrm助手解析响应出错:', e);
                }
            });
            originalSend.apply(this, arguments);
        };
    }

    // 115网盘处理逻辑
    function init115() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', function () {
                try {
                    if (this._url.includes('webapi/share/receive')) {
                        const response = JSON.parse(this.responseText);
                        // state=true 任务成功
                        if (response.state === true) {
                            const cid = localStorage.getItem('SEL_F_DIR').split('|')[1];
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `https://115cdn.com/webapi/files?aid=1&cid=${cid}&max_size=&offset=0&limit=50&show_dir=1&nf=1&qid=0&natsort=1&source=&format=json&type=`,
                                onload: function (response) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.errNo == 20130827) {
                                            console.error('获取115网盘保存路径失败', '堆屎山的 115 API');
                                            return;
                                        } else if (data.errNo != 0) {
                                            console.error('获取115网盘保存路径失败', response.responseText);
                                            return;
                                        }
                                        // console.log('获取115网盘保存路径成功', response.responseText);
                                        let savepath = '';
                                        if (data.path && data.path.length > 1) {
                                            // 构建路径，从第二个元素开始（第一个是根目录）
                                            for (let i = 1; i < data.path.length; i++) {
                                                savepath += '/' + data.path[i].name;
                                            }
                                            console.log('保存路径:', savepath);
                                            sendWebhook(savepath, 'open115');
                                        }
                                    } catch (e) {
                                        console.error('解析115网盘路径出错:', e);
                                    }
                                },
                                onerror: function (error) {
                                    console.error('获取115网盘路径失败:', error);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error('SmartStrm助手解析响应出错:', e);
                }
            });
            originalSend.apply(this, arguments);
        };
    }

    // 发送webhook通知
    function sendWebhook(savepath, driver) {
        const currentWebhook = GM_getValue('webhook', '');
        const currentDelay = parseInt(GM_getValue('delay', '0'), 10);
        if (isNaN(currentDelay)) currentDelay = 0;

        if (!currentWebhook) {
            console.error('Webhook地址未设置');
            return;
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: currentWebhook,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                event: 'web_save',
                delay: currentDelay,
                data: {
                    driver: driver,
                    savepath: savepath
                },
            }),
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                if (data.success) {
                    console.log('Webhook发送成功:', data.message, data.task);
                    showFloatingTip(`Webhook发送成功: ${data.message || ''} [${data.task.name}] ${data.task.storage_path}`, 'success');
                } else {
                    console.error('Webhook发送成功，但触发失败:', data.message);
                    showFloatingTip(`Webhook发送成功，但触发失败: ${data.message || ''}`, 'error');
                }
            },
            onerror: function (error) {
                console.error('Webhook发送失败:', error);
                showFloatingTip(`Webhook发送失败: ${error.responseText || error.statusText || '未知错误'}`, 'error');
            }
        });
    }

    // 显示 SweetAlert2 悬浮提示
    function showFloatingTip(message, type) {
        Swal.fire({
            text: message,
            icon: type,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }
})();
