// ==UserScript==
// @name         Kibana cURL Generator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在Kibana日志页面添加一个按钮和环境下拉列表，用于生成cURL命令。
// @author       Gemini
// @match        http://192.168.0.106:8410/*
// @match        *://logs.ihotel.cn/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555080/Kibana%20cURL%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/555080/Kibana%20cURL%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API 环境配置
    const baseUrls = [
        { name: '本地', url: 'http://127.0.0.1:8080' }
    ];

    const createUI = () => {
        const tabList = document.querySelector('div[role="tablist"].euiTabs');
        // 避免重复添加UI元素
        if (tabList && !document.getElementById('generate-curl-btn')) {
            // 创建环境选择下拉列表
            const selectList = document.createElement('select');
            selectList.id = 'base-url-select';
            selectList.className = 'euiSelect';
            selectList.style.marginLeft = '8px';
            selectList.style.padding = '5px';

            baseUrls.forEach(item => {
                const option = document.createElement('option');
                option.value = item.url;
                option.text = item.name;
                selectList.appendChild(option);
            });

            // 创建生成按钮
            const curlButton = document.createElement('button');
            curlButton.innerHTML = '<span class="euiTab__content">生成 cURL</span>';
            curlButton.id = 'generate-curl-btn';
            curlButton.className = 'euiTab';
            curlButton.type = 'button';
            curlButton.style.marginLeft = '8px';
            curlButton.setAttribute('aria-selected', 'false');

            curlButton.onclick = () => {
                try {
                    const apiNameEl = document.querySelector('tr[data-test-subj="tableDocViewRow-msgObj.apiName"] .kbnDocViewer__value');
                    const apiParameterEl = document.querySelector('tr[data-test-subj="tableDocViewRow-msgObj.apiParameter"] .kbnDocViewer__value');
                    const requestTypeEl = document.querySelector('tr[data-test-subj="tableDocViewRow-msgObj.requestType"] .kbnDocViewer__value');

                    if (!apiNameEl || !apiParameterEl || !requestTypeEl) {
                        alert('无法在页面上找到所需的字段 (msgObj.apiName, msgObj.apiParameter, msgObj.requestType)。');
                        return;
                    }

                    const url = apiNameEl.innerText.trim();
                    const params = apiParameterEl.innerText.trim();
                    const method = requestTypeEl.innerText.trim().toUpperCase();

                    const selectedBaseUrl = document.getElementById('base-url-select').value;
                    let fullUrl = selectedBaseUrl + url;
                    let curlCommand = '';

                    if (method === 'GET') {
                        if (params && params !== '{}') {
                            try {
                                const paramsObject = JSON.parse(params);
                                const queryParts = [];
                                for (const key in paramsObject) {
                                    if (Object.prototype.hasOwnProperty.call(paramsObject, key)) {
                                        const value = paramsObject[key];
                                        if (Array.isArray(value)) {
                                            value.forEach(item => {
                                                queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
                                            });
                                        } else if (typeof value === 'object' && value !== null) {
                                            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
                                        } else {
                                            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                                        }
                                    }
                                }
                                const queryString = queryParts.join('&');

                                if (queryString) {
                                    fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
                                }
                            } catch (e) {
                                console.error('无法解析GET请求的apiParameter，它不是一个有效的JSON字符串。', e);
                                alert('无法解析GET请求的apiParameter，它不是一个有效的JSON字符串。');
                                return; // Abort if JSON is invalid
                            }
                        }
                        curlCommand = `curl -X ${method} '${fullUrl}'`;
                    } else {
                        // For POST, PUT, etc.
                        curlCommand = `curl -X ${method} '${fullUrl}' \\
-H 'Content-Type: application/json' \\
-d '${params}'`;
                    }

                    GM_setClipboard(curlCommand);
                    alert('cURL 命令已生成并复制到剪贴板！\n\n' + curlCommand);
                    console.log(curlCommand);

                } catch (error) {
                    console.error('生成 cURL 命令时出错:', error);
                    alert('生成 cURL 命令时发生错误。请检查控制台获取详细信息。');
                }
            };

            tabList.appendChild(selectList);
            tabList.appendChild(curlButton);
        }
    };

    const observer = new MutationObserver((mutations, obs) => {
        const tabList = document.querySelector('div[role="tablist"].euiTabs');
        if (tabList) {
            createUI();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();