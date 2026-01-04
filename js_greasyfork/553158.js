// ==UserScript==
// @name         Bio
// @namespace    http://mng.jjvip.net/
// @version      0.2.1
// @description  生物一键快速添加
// @author       batcom
// @match        *://*.aoyinbio.cn/*
// @match        *://mng.jjvip.net/*
// @match        *://ssrcc.com.cn/*
// @match        https://noancell.cn/bio/create*
// @icon         https://www.zhihupe.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://www.layuicdn.com/layui-v2.8.15/layui.js
// @require      https://unpkg.com/art-template@4.13.2/lib/template-web.js
// @run-at       document-end

// @resource layui.css https://gitee.com/layui/layui/raw/main/dist/css/layui.css
// @resource layui64.css https://gitee.com/batcom/layui/raw/main/dist/css/layui64.css
// @resource woff2.css https://gitee.com/batcom/layui/raw/main/dist/css/woff2.css

// @connect      mng.jjvip.net
// @connect      noancell.cn
// @connect      www.ssrcc.com.cn
// @connect      www.aoyinbio.cn

// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license           GPL License

// @downloadURL https://update.greasyfork.org/scripts/553158/Bio.user.js
// @updateURL https://update.greasyfork.org/scripts/553158/Bio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // HTTP工具类 - 使用GM_xmlhttpRequest解决跨域问题
    const HttpUtil = {
        /**
         * 发送HTTP请求
         * @param {Object} options 请求配置
         * @returns {Promise} 返回Promise对象
         */
        request (options) {
            return new Promise((resolve, reject) => {
                console.log('GM_xmlhttpRequest 请求配置:');
                console.log('- Method:', options.method || 'GET');
                console.log('- URL:', options.url);
                console.log('- Headers:', options.headers || {});
                console.log('- Data:', options.data || null);

                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    headers: options.headers || {},
                    data: options.data || null,
                    timeout: options.timeout || 30000,
                    onload: function (response) {
                        console.log('GM_xmlhttpRequest 响应状态:', response.status);
                        console.log('GM_xmlhttpRequest 响应文本:', response.responseText);

                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = options.responseType === 'json' ?
                                    JSON.parse(response.responseText) : response.responseText;
                                resolve({
                                    status: response.status,
                                    statusText: response.statusText,
                                    data: data,
                                    headers: response.responseHeaders
                                });
                            } catch (e) {
                                console.error('JSON解析失败:', e);
                                console.error('原始响应文本:', response.responseText);
                                reject(new Error('解析响应数据失败: ' + e.message));
                            }
                        } else {
                            console.error('HTTP错误响应:', response.status, response.statusText);
                            console.error('错误响应内容:', response.responseText);
                            reject(new Error(`HTTP错误: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error('网络请求失败: ' + error.message));
                    },
                    ontimeout: function () {
                        reject(new Error('请求超时'));
                    }
                });
            });
        },

        /**
         * 发送POST请求
         * @param {string} url 请求URL
         * @param {Object} data 请求数据
         * @param {Object} headers 请求头
         * @returns {Promise} 返回Promise对象
         */
        post (url, data, headers = {}) {
            const requestData = typeof data === 'object' ? JSON.stringify(data) : data;
            console.log('HttpUtil POST - 发送的数据:', requestData);

            // 如果headers中没有content-type，则添加默认的
            const finalHeaders = { ...headers };
            if (!finalHeaders['content-type'] && !finalHeaders['Content-Type']) {
                finalHeaders['Content-Type'] = 'application/json';
            }

            return this.request({
                method: 'POST',
                url: url,
                data: requestData,
                headers: finalHeaders,
                responseType: 'json'
            });
        },

        /**
         * 发送GET请求
         * @param {string} url 请求URL
         * @param {Object} headers 请求头
         * @returns {Promise} 返回Promise对象
         */
        get (url, headers = {}) {
            return this.request({
                method: 'GET',
                url: url,
                headers: headers,
                responseType: 'json'
            });
        }
    };

    // 创建UI界面
    function createUI () {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'bio-fetcher-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '数据抓取工具';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #007bff;
            font-size: 16px;
        `;

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入要抓取的URL';
        input.id = 'fetch-url-input';
        input.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
            box-sizing: border-box;
        `;

        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '一键抓取';
        button.id = 'fetch-data-btn';
        button.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        // 创建状态显示区域
        const status = document.createElement('div');
        status.id = 'fetch-status';
        status.style.cssText = `
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        `;

        // 创建最小化按钮
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            border-radius: 3px;
        `;

        // 组装UI
        container.appendChild(minimizeBtn);
        container.appendChild(title);
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(status);

        document.body.appendChild(container);

        return { container, input, button, status, minimizeBtn };
    }

    // 显示状态信息
    function showStatus (statusElement, message, type = 'info') {
        statusElement.style.display = 'block';
        statusElement.textContent = message;

        const colors = {
            info: '#d1ecf1',
            success: '#d4edda',
            error: '#f8d7da',
            warning: '#fff3cd'
        };

        statusElement.style.backgroundColor = colors[type] || colors.info;
        statusElement.style.color = type === 'error' ? '#721c24' : '#155724';
    }

    // 构建表格HTML
    function buildTableHTML (attrsData) {
        if (!attrsData || typeof attrsData !== 'object') {
            return '<p>无有效数据</p>';
        }
        `<table>
        `

        let tableHTML = '<table><tbody>';
        // 遍历attrs_txt中的所有字段
        for (const [key, value] of Object.entries(attrsData)) {
            // 跳过pic字段，因为它是图片数组
            if (key === 'pic') continue;
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            tableHTML += `<tr>
            <td valign="top" colspan="1" rowspan="1" width="125" style="border-color: rgb(0, 112, 192); word-break: break-all;">
            ${key}
            </td>
            <td valign="top" colspan="1" rowspan="1" width="1234" style="border-color: rgb(0, 112, 192); word-break: break-all;">
                <span style="color: rgb(89, 89, 89); font-family: 宋体; font-size: 14px; background-color: rgb(255, 255, 255);">${displayValue}</span>
            </td>
        </tr>`
        }

        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    // 通用的表单字段更新函数
    function updateFormField (selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            // 根据元素类型设置值
            if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                field.value = value;
            } else if (field.tagName === 'SELECT') {
                // 对于select元素，尝试选择匹配的option
                const option = Array.from(field.options).find(opt => opt.value === value || opt.text === value);
                if (option) {
                    field.selectedIndex = option.index;
                }
            } else {
                // 对于其他元素，设置textContent或innerHTML
                field.textContent = value;
            }

            // 触发各种事件，确保表单知道值已更新
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('blur', { bubbles: true }));

            return true;
        }
        return false;
    }

    // 批量更新表单字段
    function updateMultipleFields (fieldMappings) {
        const results = {};
        for (const [selector, value] of Object.entries(fieldMappings)) {
            results[selector] = updateFormField(selector, value);
        }
        return results;
    }

    // 更新表单字段（保持原有功能）
    function updateProInfoField (tableHTML) {
        return updateFormField('textarea[name="pro_info"], input[name="pro_info"], #pro_info, [name*="pro_info"]', tableHTML);
    }

    // 使用jQuery更新字段的函数（如果jQuery可用）
    function updateFieldsWithJQuery (data) {
        if (typeof $ !== 'undefined') {
            console.log('使用jQuery更新字段');

            // 使用jQuery语法更新字段
            $('[name="proname"], #proname').val(data.name || '').trigger('change');
            $('[name="productno"], #productno').val(data.productno || '').trigger('change');
            $('[name="price"], #price').val(data.price || '').trigger('change');
            $('[name="platform"], #platform').val(data.platform || '').trigger('change');

            // 更新标签字段（如果是数组，转换为字符串）
            const tags = Array.isArray(data.tag) ? data.tag.join(', ') : (data.tag || '');
            $('[name="tags"], #tags, [name="tag"], #tag').val(tags).trigger('change');

            // 更新其他可能的字段
            if (data.attrs_txt) {
                // 遍历attrs_txt中的所有属性
                Object.keys(data.attrs_txt).forEach(key => {
                    if (key !== 'pic') { // 跳过图片字段
                        const value = data.attrs_txt[key];
                        const displayValue = Array.isArray(value) ? value.join(', ') : value;

                        // 尝试多种选择器
                        $(`[name="${key}"], #${key}, .${key}`).val(displayValue).trigger('change');
                    }
                });
            }

            return true;
        }
        return false;
    }

    // 使用jQuery添加隐藏input元素的函数
    function addHiddenInputs (imageUrls, targetForm = 'form') {
        if (typeof $ !== 'undefined') {
            console.log('使用jQuery添加隐藏input元素');

            // 清除已存在的propic[]元素（避免重复）
            $('input[name="propic[]"]').remove();

            // 确保imageUrls是数组
            const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

            // 找到目标表单
            const $form = $(targetForm).first();

            if ($form.length === 0) {
                console.warn('未找到目标表单:', targetForm);
                return false;
            }

            // 为每个图片URL添加隐藏input
            urls.forEach((url, index) => {
                if (url && url.trim()) {
                    const $hiddenInput = $('<input>', {
                        name: 'propic[]',
                        type: 'hidden',
                        value: url.trim()
                    });

                    // 添加到表单中
                    $form.append($hiddenInput);
                    console.log(`添加隐藏input [${index}]:`, url);
                }
            });

            console.log(`成功添加 ${urls.length} 个隐藏input元素`);
            return true;
        }
        return false;
    }

    // 原生JavaScript版本的添加隐藏input函数
    function addHiddenInputsNative (imageUrls, targetFormSelector = 'form') {
        console.log('使用原生JavaScript添加隐藏input元素');

        // 清除已存在的propic[]元素
        const existingInputs = document.querySelectorAll('input[name="propic[]"]');
        existingInputs.forEach(input => input.remove());

        // 确保imageUrls是数组
        const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

        // 找到目标表单
        const form = document.querySelector(targetFormSelector);

        if (!form) {
            console.warn('未找到目标表单:', targetFormSelector);
            return false;
        }

        // 为每个图片URL添加隐藏input
        urls.forEach((url, index) => {
            if (url && url.trim()) {
                const hiddenInput = document.createElement('input');
                hiddenInput.name = 'propic[]';
                hiddenInput.type = 'hidden';
                hiddenInput.value = url.trim();

                // 添加到表单中
                form.appendChild(hiddenInput);
                console.log(`添加隐藏input [${index}]:`, url);
            }
        });

        console.log(`成功添加 ${urls.length} 个隐藏input元素`);
        return true;
    }

    // 抓取数据
    async function fetchData (url, statusElement) {
        try {
            showStatus(statusElement, '正在抓取数据...', 'info');

            // 打印请求信息用于调试
            console.log('准备发送请求到:', "https://noancell.cn/bio/fetch-data");
            console.log('请求数据:', { "url": url });

            // 尝试不同的数据格式，看服务器期望哪种
            let requestData;

            // 尝试方式1: 标准JSON格式
            requestData = { "url": url };
            console.log('尝试发送JSON格式:', requestData);

            // 使用HttpUtil发送POST请求，解决跨域问题
            const response = await HttpUtil.post("https://noancell.cn/bio/fetch-data",
                requestData,
                {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "origin": "https://noancell.cn",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "referer": "https://noancell.cn/bio/create",
                    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
                }
            );

            const data = response.data;

            // 添加详细的调试信息
            console.log('HTTP响应状态:', response.status);
            console.log('完整响应数据:', data);
            console.log('数据类型:', typeof data);

            if (data && data.success && data.data && data.data.attrs_txt) {
                showStatus(statusElement, '数据抓取成功，正在构建表格...', 'success');


                // 构建表格HTML
                const tableHTML = buildTableHTML(data.data.attrs_txt);

                // 更新表单字段
                const productno = `WN-` + Math.floor(10000 + Math.random() * 90000);
                const proInfoUpdated = updateProInfoField(tableHTML);

                console.log(data.data)
                const price = data.data.price
                const name = data.data.name
                console.log(`name: ${name},price: ${price}`)
                $('#proname').val(name)
                $('[name="Param_24977581"]').val(price)
                addHiddenInputs(['https://aimg8.dlssyht.cn/u/2143541/product/9191/18380707_1726040954.jpg'])

                // 处理图片数组，添加隐藏input元素
                // if (data.data.attrs_txt && data.data.attrs_txt.pic) {
                //     const imageUrls = data.data.attrs_txt.pic;
                //     console.log('找到图片数组:', imageUrls);

                //     // 使用jQuery添加隐藏input（优先）
                //     const jquerySuccess = addHiddenInputs(imageUrls);

                //     // 如果jQuery不可用，使用原生JavaScript
                //     if (!jquerySuccess) {
                //         addHiddenInputsNative(imageUrls);
                //     }
                // } else {
                //     console.log('未找到图片数据');
                // }
                // 更新其他字段（根据返回的数据）
                const fieldUpdates = updateMultipleFields({
                    // 通过name属性查找
                    // '[name="proname"]': data.data.name || '',
                    // '[name="Param_24977581"]': data.data.price || '',
                    '[name="prounit"]': `瓶` || '',
                    '[name="pro_no"]': productno,
                    '[name="Param_24977580"]': productno,
                    '[name="Param_24977582"]': `T25`,
                    '[name="Param_24977583"]': `已通过STR鉴定`,
                });

                console.log('字段更新结果:', fieldUpdates);

                if (proInfoUpdated) {
                    showStatus(statusElement, '数据已成功填入表单！', 'success');
                } else {
                    showStatus(statusElement, '数据抓取成功，但未找到pro_info字段', 'warning');
                }
                GM_setClipboard(tableHTML);

                showStatus(statusElement, '数据已成功复制到剪切板！', 'success');


            } else {
                // 提供更详细的错误信息
                let errorMsg = '返回数据格式不正确或抓取失败';
                if (!data) {
                    errorMsg = '响应数据为空';
                } else if (!data.success) {
                    errorMsg = `API返回失败: ${data.message || '未知错误'}`;
                } else if (!data.data) {
                    errorMsg = '响应中缺少data字段';
                } else if (!data.data.attrs_txt) {
                    errorMsg = '响应中缺少attrs_txt字段';
                }

                console.error('详细错误信息:', errorMsg);
                console.error('实际返回的数据结构:', JSON.stringify(data, null, 2));
                throw new Error(errorMsg);
            }

        } catch (error) {
            console.error('抓取数据时出错:', error);
            showStatus(statusElement, `抓取失败: ${error.message}`, 'error');
        }
    }

    // 检查是否为目标页面
    function isTargetPage () {
        const urlParams = new URLSearchParams(window.location.search);

        // 检查必要的URL参数
        const requiredParams = {
            'is_frame': '2',
            'channel_id': '24932262',
            'comeform': '1'
        };

        // 验证所有必要参数是否存在且匹配
        for (const [key, value] of Object.entries(requiredParams)) {
            if (urlParams.get(key) !== value) {
                return false;
            }
        }

        // 检查是否包含list_page参数
        if (!urlParams.has('list_page')) {
            return false;
        }

        return true;
    }

    // 初始化插件
    function init () {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查是否为目标页面
        if (!isTargetPage()) {
            console.log('Bio Data Fetcher: 不是目标页面，插件未加载');
            return;
        }

        const ui = createUI();
        let isMinimized = false;

        // 绑定事件
        ui.button.addEventListener('click', () => {
            const url = ui.input.value.trim();
            if (!url) {
                showStatus(ui.status, '请输入有效的URL', 'warning');
                return;
            }

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                showStatus(ui.status, 'URL必须以http://或https://开头', 'warning');
                return;
            }

            fetchData(url, ui.status);
        });

        // 最小化功能
        ui.minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            const content = ui.container.children;

            for (let i = 1; i < content.length; i++) {
                content[i].style.display = isMinimized ? 'none' : 'block';
            }

            ui.minimizeBtn.textContent = isMinimized ? '+' : '−';
            ui.container.style.height = isMinimized ? '30px' : 'auto';
        });

        // 回车键快捷操作
        ui.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ui.button.click();
            }
        });

        console.log('Bio Data Fetcher 插件已加载');

        // 将函数暴露到全局作用域，方便调试和手动调用
        window.bioFetcher = {
            addHiddenInputs: addHiddenInputs,
            addHiddenInputsNative: addHiddenInputsNative,
            updateFormField: updateFormField,
            updateMultipleFields: updateMultipleFields,
            updateFieldsWithJQuery: updateFieldsWithJQuery
        };

        console.log('Bio Data Fetcher 函数已暴露到 window.bioFetcher');
    }


    // 启动插件
    init();

})();
