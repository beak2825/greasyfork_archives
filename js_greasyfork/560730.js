// ==UserScript==
// @name         ERP图片放大显示
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  监控ERP系统中特定POST请求并显示图片
// @author       ming
// @match        https://www.erp321.com/*
// @match        https://ww.erp321.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560730/ERP%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560730/ERP%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建图片显示框 - 支持拖动和位置记忆
    function createImageDisplay() {
        const display = document.createElement('div');
        display.id = 'erp-image-display';

        // 从localStorage加载保存的位置
        const savedPosition = loadDisplayPosition();
        const topPosition = savedPosition?.top || '35px';
        const rightPosition = savedPosition?.right || '10px';

        display.style.cssText = `
            position: fixed;
            top: ${topPosition};
            right: ${rightPosition};
            width: 400px;
            height: 400px;
            background: white;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            overflow: hidden;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: move;
            user-select: none;
        `;

        // 添加提示信息容器
        const alertContainer = document.createElement('div');
        alertContainer.id = 'erp-image-alerts';
        alertContainer.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            text-align: center;
            z-index: 1;
            pointer-events: none;
        `;

        // 创建第一个提示信息标签
        const alert1 = document.createElement('div');
        alert1.id = 'erp-alert-1';
        alert1.style.cssText = `
            background-color: rgba(255, 255, 255, 0.3);
            color: red;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
            margin-bottom: 5px;
            display: none;
            font-size: 14px;
        `;

        // 创建第二个提示信息标签
        const alert2 = document.createElement('div');
        alert2.id = 'erp-alert-2';
        alert2.style.cssText = `
            background-color: rgba(255, 255, 255, 0.3);
            color: red;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
            display: none;
            font-size: 14px;
        `;

        alertContainer.appendChild(alert1);
        alertContainer.appendChild(alert2);
        display.appendChild(alertContainer);

        const img = document.createElement('img');
        img.id = 'erp-displayed-image';
        img.style.cssText = `
            min-width: 100%;
            min-height: 100%;
            object-fit: cover;
        `;
        img.alt = 'ERP产品图片';

        display.appendChild(img);
        document.body.appendChild(display);

        // 添加拖动功能
        let isDragging = false;
        let startX, startY, startTop, startRight;

        display.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startTop = parseInt(display.style.top);
            startRight = parseInt(display.style.right);
            display.style.zIndex = 10000; // 拖动时提高层级
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            display.style.top = (startTop + deltaY) + 'px';
            display.style.right = (startRight - deltaX) + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                display.style.zIndex = 9999; // 拖动结束后恢复层级

                // 保存当前位置到localStorage
                saveDisplayPosition(display.style.top, display.style.right);
            }
        });

        return display;
    }

    // 保存显示框位置到localStorage
    function saveDisplayPosition(top, right) {
        try {
            localStorage.setItem('erpImageDisplayPosition', JSON.stringify({
                top: top,
                right: right
            }));
        } catch (error) {
            console.error('❌ 保存位置失败');
        }
    }

    // 从localStorage加载显示框位置
    function loadDisplayPosition() {
        try {
            const saved = localStorage.getItem('erpImageDisplayPosition');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ 加载位置失败');
        }
        return null;
    }

    // 通用的URL查找函数 - 查找第一个URL，不限定图片格式
    function findFirstImageUrl(obj) {
        // URL正则表达式 - 查找任何HTTP/HTTPS链接
        const urlRegex = /https?:\/\/[^\s"']+(?:\?[^"']*)?/i;

        // 递归查找函数
        function search(obj) {
            // 如果是字符串，检查是否是URL
            if (typeof obj === 'string') {
                const match = obj.match(urlRegex);
                if (match) {
                    return match[0];
                }
            }
            // 如果是数组，遍历每个元素
            else if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    const result = search(obj[i]);
                    if (result) {
                        return result;
                    }
                }
            }
            // 如果是对象，遍历每个属性
            else if (obj && typeof obj === 'object') {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const result = search(obj[key]);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
            // 未找到URL
            return null;
        }

        return search(obj);
    }

    // 提取产品信息（name和taxAfterPrice）的函数
    function extractProductInfo(obj) {
        // 存储找到的信息
        const info = {
            name: null,
            taxAfterPrice: null
        };

        // 递归查找函数
        function search(obj) {
            // 如果是对象，遍历每个属性
            if (obj && typeof obj === 'object') {
                // 检查是否有name字段
                if (obj.hasOwnProperty('name') && typeof obj.name === 'string' && !info.name) {
                    info.name = obj.name;
                }

                // 检查是否有taxAfterPrice字段
                if (obj.hasOwnProperty('taxAfterPrice') && (typeof obj.taxAfterPrice === 'number' || typeof obj.taxAfterPrice === 'string') && !info.taxAfterPrice) {
                    info.taxAfterPrice = parseFloat(obj.taxAfterPrice);
                }

                // 如果两个字段都找到了，直接返回
                if (info.name && info.taxAfterPrice !== null) {
                    return true;
                }

                // 如果是数组，遍历每个元素
                if (Array.isArray(obj)) {
                    for (let i = 0; i < obj.length; i++) {
                        if (search(obj[i])) {
                            return true;
                        }
                    }
                } else {
                    // 遍历对象的每个属性
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (search(obj[key])) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        search(obj);
        return info;
    }

    // 更新显示的图片和提示信息
    function updateDisplayedImage(picUrl, productInfo = {}) {
        let imgElement = document.getElementById('erp-displayed-image');
        if (!imgElement) {
            createImageDisplay();
            imgElement = document.getElementById('erp-displayed-image');
        }

        imgElement.src = picUrl;

        // 获取提示信息元素
        const alert1 = document.getElementById('erp-alert-1');
        const alert2 = document.getElementById('erp-alert-2');

        // 重置提示信息
        if (alert1) alert1.style.display = 'none';
        if (alert2) alert2.style.display = 'none';

        // 根据产品信息显示提示
        if (alert1 && productInfo.name) {
            if (productInfo.name.toLowerCase().includes('18k')) {
                alert1.textContent = '金镶嵌,注意包装';
                alert1.style.display = 'block';
            }
        }

        if (alert2 && productInfo.taxAfterPrice !== null) {
            if (productInfo.taxAfterPrice >= 600) {
                alert2.textContent = '货品贵重,注意包装';
                alert2.style.color = 'gray';
                alert2.style.display = 'block';
            }
        }
    }

    // 解析请求数据（支持字符串、FormData等）
    function parseRequestData(data) {
        if (!data) return '';

        if (typeof data === 'string') {
            return data;
        } else if (data instanceof FormData) {
            // 解析FormData
            let result = '';
            for (let [key, value] of data.entries()) {
                if (result) result += '&';
                result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
            return result;
        } else {
            // 尝试将其他类型转换为字符串
            try {
                return JSON.stringify(data);
            } catch (e) {
                return String(data);
            }
        }
    }

    // 检查请求是否包含__CALLBACKPARAM且Method为CheckQty或LoadDataToJSON
    function isRelevantRequest(url, data) {
        // 检查URL参数
        const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.href : '';
        const urlContainsTarget = urlStr.includes('__CALLBACKPARAM') &&
            ((urlStr.includes('"Method":"CheckQty"') || urlStr.includes("'Method':'CheckQty'")) ||
             (urlStr.includes('"Method":"LoadDataToJSON"') || urlStr.includes("'Method':'LoadDataToJSON'")));

        if (urlContainsTarget) {
            return true;
        }

        // 解析请求体数据
        const dataStr = parseRequestData(data);

        // 检查请求体
        if (!dataStr.includes('__CALLBACKPARAM')) return false;

        // 提取__CALLBACKPARAM的值
        const callbackParamMatch = dataStr.match(/__CALLBACKPARAM=([^&]+)/);
        if (!callbackParamMatch) return false;

        // 解码URL参数
        const callbackParam = decodeURIComponent(callbackParamMatch[1]);

        // 检查是否包含Method:CheckQty或Method:LoadDataToJSON
        const isMatch = callbackParam.includes('"Method":"CheckQty"') ||
               callbackParam.includes("'Method':'CheckQty'") ||
               callbackParam.includes('"Method":"LoadDataToJSON"') ||
               callbackParam.includes("'Method':'LoadDataToJSON'");

        return isMatch;
    }

    // 保存原始的XMLHttpRequest发送方法
    const originalXHRSend = XMLHttpRequest.prototype.send;

    // 重写XMLHttpRequest的send方法以监控请求
    XMLHttpRequest.prototype.send = function(data) {
        // 保存当前实例
        const xhr = this;

        // 检查请求是否是相关请求（CheckQty或LoadDataToJSON）
        const isRelevant = isRelevantRequest(xhr.responseURL, data);

        // 只处理相关请求
        if (isRelevant) {
            // 监听响应
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 4) {
                    // 处理响应内容，移除可能的前缀
                    let responseText = xhr.responseText;
                    // 移除可能的"0|"前缀
                    if (responseText.startsWith('0|')) {
                        responseText = responseText.substring(2);
                    }

                    try {
                        // 尝试解析响应内容
                        const response = JSON.parse(responseText);

                        // 检查响应是否包含ReturnValue
                        if (response.ReturnValue && typeof response.ReturnValue === 'string') {
                            // 解析ReturnValue字符串（可能是嵌套JSON数组）
                            const returnValueObj = JSON.parse(response.ReturnValue);

                            // 使用通用函数查找图片链接
                            const picUrl = findFirstImageUrl(returnValueObj);
                            if (picUrl) {
                                // 提取产品信息
                                const productInfo = extractProductInfo(returnValueObj);
                                updateDisplayedImage(picUrl, productInfo);
                            }
                        }
                    } catch (error) {
                        console.error('❌ XMLHttpRequest响应解析错误:', error);
                        console.error('📄 XMLHttpRequest原始响应文本:', responseText);
                    }
                }
            });
        }

        // 调用原始的send方法
        originalXHRSend.call(xhr, data);
    };

    // 同样监控fetch请求
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        // 解析URL
        const requestUrl = typeof url === 'string' ? url : url.href;

        // 检查请求是否是相关请求（CheckQty或LoadDataToJSON）
        const isRelevant = isRelevantRequest(requestUrl, options?.body);

        // 发送原始请求
        const response = await originalFetch.call(this, url, options);

        // 只处理相关请求的响应
        if (isRelevant) {
            // 处理响应
            try {
                // 克隆响应以避免影响原始请求
                const clonedResponse = response.clone();

                // 获取文本响应
                const textResponse = await clonedResponse.text();

                // 处理响应内容，移除可能的前缀
                let responseText = textResponse;
                // 移除可能的"0|"前缀
                if (responseText.startsWith('0|')) {
                    responseText = responseText.substring(2);
                }

                // 尝试解析为JSON
                            try {
                                const responseJson = JSON.parse(responseText);

                                // 检查响应是否包含ReturnValue
                                if (responseJson.ReturnValue && typeof responseJson.ReturnValue === 'string') {
                                    // 解析ReturnValue字符串（可能是嵌套JSON数组）
                                    const returnValueObj = JSON.parse(responseJson.ReturnValue);

                                    // 使用通用函数查找图片链接
                                    const picUrl = findFirstImageUrl(returnValueObj);
                                    if (picUrl) {
                                        // 提取产品信息
                                        const productInfo = extractProductInfo(returnValueObj);
                                        updateDisplayedImage(picUrl, productInfo);
                                    }
                                }
                } catch (jsonError) {
                    console.error('❌ fetch JSON解析错误:', jsonError);
                    console.error('📄 fetch原始响应文本:', responseText);
                }
            } catch (error) {
                console.error('❌ fetch响应处理错误:', error);
            }
        }

        // 返回原始响应
        return response;
    };

    console.log('ERP POST请求监控器 v2.3 已启动');

    // 修改footer元素高度为433px
    function modifyFooterHeight() {
        const footElement = document.getElementById('foot');
        if (footElement) {
            footElement.style.height = '433px';
        }
    }

    // 页面加载完成后修改footer高度
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyFooterHeight);
    } else {
        modifyFooterHeight();
    }
})();