// ==UserScript==
// @name         AI 解析增强版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提取app.goodsfox.com网站中/material路径下页面的素材图片链接，支持调用通义千问VL-plus模型进行分析，并可将结果同步到Notion
// @author       You
// @match        https://app.goodsfox.com/material*
// @grant        GM_xmlhttpRequest
// @connect      api.dify.ai
// @connect      dashscope.aliyuncs.com
// @connect      api.notion.com
// @downloadURL https://update.greasyfork.org/scripts/556300/AI%20%E8%A7%A3%E6%9E%90%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556300/AI%20%E8%A7%A3%E6%9E%90%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要过滤的图片链接
    const filteredImageUrl = 'chrome-extension://bgocaiandcncfnmoajmhpbdjfojblilh/image/public/logo-clear.png';

    // 存储提取到的媒体URL
    let mediaUrls = [];

    // 创建固定按钮
    function createFixedButton() {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = '提图';
        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background-color: #c7006c; /* 树莓红色 */
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 5px 0 0 5px;
            padding: 15px 10px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        `;

        // 添加点击事件
        button.addEventListener('click', showImageModal);

        // 将按钮添加到页面
        document.body.appendChild(button);
    }

    // 创建弹窗
    function createModal() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'image-extractor-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10000;
        `;

        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 10px;
            max-width: 90%;
            max-height: 90%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '提取的素材';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            text-align: center;
            padding: 20px 20px 0 20px;
            flex-shrink: 0;
        `;

        // 创建可滚动的内容区域
        const scrollableContent = document.createElement('div');
        scrollableContent.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 0 20px 20px 20px;
        `;

        // 创建图片容器
        const imageContainer = document.createElement('div');
        imageContainer.id = 'image-container';
        imageContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 15px;
        `;

        // 组装弹窗
        scrollableContent.appendChild(imageContainer);
        modal.appendChild(title);
        modal.appendChild(scrollableContent);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 点击遮罩层关闭弹窗
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });

        return overlay;
    }

    // 下载图片
    function downloadImage(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename || 'image.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(err => {
                // 如果fetch失败，使用传统方法
                const link = document.createElement('a');
                link.href = url;
                link.download = filename || 'image.jpg';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    // 下载视频
    function downloadVideo(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename || 'video.mp4';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(err => {
                // 如果fetch失败，使用传统方法
                const link = document.createElement('a');
                link.href = url;
                link.download = filename || 'video.mp4';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    // 从URL中提取文件名（不含扩展名）
    function extractFilename(url) {
        try {
            // 从URL中提取路径部分
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            // 获取文件名（含扩展名）
            const fullFilename = pathname.split('/').pop();
            // 去除扩展名和查询参数
            const filename = fullFilename.split('.')[0];
            return filename;
        } catch (err) {
            return '';
        }
    }

    // 生成原始链接
    function generateOriginalLink(url, type) {
        const filename = extractFilename(url);
        const typeCode = type === 'image' ? '102' : '201';
        return `https://app.goodsfox.com/material/${filename}-${typeCode}`;
    }

    // Cookie 操作函数
    /*
    function setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        // 检查cookie大小，如果太大则不保存
        const cookieString = `${name}=${encodeURIComponent(value)}`;
        if (cookieString.length > 4000) {
            console.warn('Cookie大小超过限制，可能无法保存');
            return;
        }
        console.log('设置cookie:', cookieString);
        // 简化cookie设置，只使用path=/确保在所有页面间共享
        document.cookie = `${cookieString};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        console.log('当前所有cookie:', document.cookie);
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    const value = c.substring(nameEQ.length, c.length);
                    console.log('找到cookie:', name, value);
                    return decodeURIComponent(value);
                } catch (e) {
                    console.error('解码cookie失败:', e);
                    return null;
                }
            }
        }
        console.log('未找到cookie:', name);
        return null;
    }
    */

    // 保存记忆到localStorage
    function saveMemory(type, changePoint, prompt) {
        const memoryKey = type === 'image' ? 'image_memory' : 'video_memory';
        const memory = JSON.stringify({ changePoint, prompt });
        console.log('保存记忆到localStorage:', memoryKey, memory);
        try {
            localStorage.setItem(memoryKey, memory);
            console.log('记忆保存成功');
        } catch (e) {
            console.error('保存记忆失败:', e);
        }
    }

    // 获取记忆
    function getMemory(type) {
        const memoryKey = type === 'image' ? 'image_memory' : 'video_memory';
        console.log('从localStorage获取记忆:', memoryKey);
        try {
            const memory = localStorage.getItem(memoryKey);
            console.log('获取到的localStorage值:', memory);
            if (memory) {
                const parsed = JSON.parse(memory);
                console.log('解析后的记忆:', parsed);
                return parsed;
            }
        } catch (err) {
            console.error('获取或解析记忆失败:', err);
        }
        console.log('未找到记忆，返回默认值');
        return { changePoint: '', prompt: '' };
    }

    // 调用通义千问VL-flash模型
    async function callQwenVLFlash(mediaUrl, prompt, mediaType) {
        const apiKey = 'sk-41b2bfc344414ecf9fe583afce37c920';
        const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
        
        // 根据素材类型选择模型
        const model = 'qwen-vl-plus'; // 使用正确的模型名称
        
        // 构造请求内容
        let content;
        if (mediaType === 'image') {
            content = [
                {
                    "image": mediaUrl
                },
                {
                    "text": prompt
                }
            ];
        } else {
            // 对于视频，使用视频特定的格式
            content = [
                {
                    "video": mediaUrl
                },
                {
                    "text": prompt
                }
            ];
        }
        
        const requestBody = {
            "model": model,
            "input": {
                "messages": [
                    {
                        "role": "user",
                        "content": content
                    }
                ]
            },
            "parameters": {
                "timeout": 1800 // 1800秒超时
            }
        };

        console.log('发送通义千问VL-plus API请求:', requestBody);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    console.log('API响应状态:', response.status);
                    console.log('API响应头:', response.responseHeaders);
                    console.log('API响应内容:', response.responseText);
                    
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('API返回数据:', data);
                            resolve(data);
                        } catch (err) {
                            console.error('JSON解析失败:', err);
                            reject(new Error('解析API响应失败'));
                        }
                    } else if (response.status === 403) {
                        try {
                            const errorData = JSON.parse(response.responseText);
                            if (errorData.code === 'AccessDenied' && errorData.message.includes('asynchronous calls')) {
                                reject(new Error('当前API不支持异步调用，请检查API权限或使用同步调用'));
                            } else {
                                reject(new Error('API密钥无效或权限不足，请检查API配置'));
                            }
                        } catch (e) {
                            reject(new Error('API密钥无效或权限不足，请检查API配置'));
                        }
                    } else if (response.status === 400) {
                        try {
                            const errorData = JSON.parse(response.responseText);
                            reject(new Error(`请求参数错误: ${errorData.message}`));
                        } catch (e) {
                            reject(new Error(`请求参数错误 (${response.status})，请检查请求内容`));
                        }
                    } else if (response.status === 401) {
                        reject(new Error('API认证失败，请检查API密钥'));
                    } else if (response.status === 429) {
                        reject(new Error('请求频率超限，请稍后再试'));
                    } else if (response.status >= 500) {
                        reject(new Error(`服务器内部错误 (${response.status})，请稍后重试`));
                    } else {
                        console.error('API错误响应:', response.responseText);
                        reject(new Error(`API请求失败 (${response.status})，请检查API配置`));
                    }
                },
                onerror: function(error) {
                    console.error('通义千问API调用失败:', error);
                    reject(new Error('网络请求失败，请检查网络连接'));
                },
                ontimeout: function() {
                    console.error('API请求超时');
                    reject(new Error('API请求超时，请稍后重试'));
                },
                timeout: 1800000  // 设置1800秒超时 (30分钟)
            });
        });
    }

    // 同步到Notion
    async function syncToNotion(changePoint, mediaType, orgLink, prompt, resultText) {
        const notionApiKey = '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';
        const databaseId = '2b0e85c8898f801f9b35df49fcc9776a';
        
        // 检查单个内容块是否超过限制
        const promptHeader = "prompt：";
        const resultHeader = "结果：";
        const promptContent = promptHeader + prompt;
        const resultContent = resultHeader + resultText;
        
        // 如果任何一个内容块超过2000字符，或者总长度超过1900字符，需要分段处理
        if (promptContent.length > 2000 || resultContent.length > 2000 || (promptContent.length + resultContent.length) > 1900) {
            return syncToNotionInChunks(changePoint, mediaType, orgLink, prompt, resultText);
        } else {
            // 内容都不超过限制，直接创建页面
            const apiUrl = 'https://api.notion.com/v1/pages';
            const requestBody = {
                parent: {
                    database_id: databaseId
                },
                properties: {
                    "change_point": {
                        title: [
                            {
                                text: {
                                    content: changePoint + "解析结果"
                                }
                            }
                        ]
                    },
                    "type": {
                        rich_text: [
                            {
                                text: {
                                    content: mediaType === 'image' ? '图片' : '视频'
                                }
                            }
                        ]
                    },
                    "org_link": {
                        rich_text: [
                            {
                                text: {
                                    content: orgLink
                                }
                            }
                        ]
                    }
                },
                children: [
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: promptContent
                                    }
                                }
                            ]
                        }
                    },
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: resultContent
                                    }
                                }
                            ]
                        }
                    }
                ]
            };

            console.log('发送Notion API请求:', requestBody);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: {
                        'Authorization': `Bearer ${notionApiKey}`,
                        'Content-Type': 'application/json',
                        'Notion-Version': '2022-06-28'
                    },
                    data: JSON.stringify(requestBody),
                    onload: function(response) {
                        console.log('Notion API响应状态:', response.status);
                        console.log('Notion API响应内容:', response.responseText);
                        
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log('Notion API返回数据:', data);
                                resolve(data);
                            } catch (err) {
                                console.error('Notion JSON解析失败:', err);
                                reject(new Error('解析Notion API响应失败'));
                            }
                        } else {
                            console.error('Notion API错误响应:', response.responseText);
                            reject(new Error(`Notion API请求失败 (${response.status})`));
                        }
                    },
                    onerror: function(error) {
                        console.error('Notion API调用失败:', error);
                        reject(new Error('Notion网络请求失败，请检查网络连接'));
                    },
                    ontimeout: function() {
                        console.error('Notion API请求超时');
                        reject(new Error('Notion API请求超时，请稍后重试'));
                    },
                    timeout: 30000  // 设置30秒超时
                });
            });
        }
    }
    
    // 分段同步到Notion
    async function syncToNotionInChunks(changePoint, mediaType, orgLink, prompt, resultText) {
        const notionApiKey = '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';
        const databaseId = '2b0e85c8898f801f9b35df49fcc9776a';
        const createPageUrl = 'https://api.notion.com/v1/pages';
        
        try {
            // 1. 创建页面并发送第一个块的内容（确保不超过2000字符）
            const promptHeader = "prompt：";
            const resultHeader = "结果：";
            
            // 分别处理prompt和result，确保每个都不超过2000字符
            let promptContent = promptHeader + prompt;
            let resultContent = resultHeader + resultText;
            
            // 如果prompt内容超过2000字符，需要分段
            let firstPromptBlock = "";
            let firstResultBlock = "";
            let remainingPrompt = "";
            let remainingResult = "";
            
            if (promptContent.length > 2000) {
                // prompt内容超过限制，截取前2000字符（减去header长度和安全边距）
                const maxPromptLength = 2000 - promptHeader.length - 50; // 50个字符的安全边距
                firstPromptBlock = prompt.substring(0, maxPromptLength);
                remainingPrompt = prompt.substring(maxPromptLength);
                firstResultBlock = ""; // result内容延后处理
                remainingResult = resultText;
            } else if (resultContent.length > 2000) {
                // result内容超过限制，截取前2000字符（减去header长度和安全边距）
                const maxResultLength = 2000 - resultHeader.length - 50; // 50个字符的安全边距
                firstPromptBlock = prompt; // prompt内容完整保留
                firstResultBlock = resultText.substring(0, maxResultLength);
                remainingPrompt = ""; // prompt内容已完整处理
                remainingResult = resultText.substring(maxResultLength);
            } else {
                // 都不超过限制，但总长度超过1900，正常分段处理
                firstPromptBlock = prompt;
                firstResultBlock = resultText.substring(0, Math.max(0, 2000 - promptContent.length - resultHeader.length - 100));
                remainingPrompt = "";
                remainingResult = resultText.substring(firstResultBlock.length);
            }
            
            // 构造创建页面的请求体
            const childrenBlocks = [];
            
            // 添加prompt块
            if (firstPromptBlock) {
                childrenBlocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: promptHeader + firstPromptBlock
                                }
                            }
                        ]
                    }
                });
            }
            
            // 添加result块
            if (firstResultBlock) {
                childrenBlocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: resultHeader + firstResultBlock
                                }
                            }
                        ]
                    }
                });
            }
            
            const createRequestBody = {
                parent: {
                    database_id: databaseId
                },
                properties: {
                    "change_point": {
                        title: [
                            {
                                text: {
                                    content: changePoint + "解析结果"
                                }
                            }
                        ]
                    },
                    "type": {
                        rich_text: [
                            {
                                text: {
                                    content: mediaType === 'image' ? '图片' : '视频'
                                }
                            }
                        ]
                    },
                    "org_link": {
                        rich_text: [
                            {
                                text: {
                                    content: orgLink
                                }
                            }
                        ]
                    }
                },
                children: childrenBlocks
            };

            console.log('发送Notion创建页面请求:', createRequestBody);

            // 创建页面
            const createResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: createPageUrl,
                    headers: {
                        'Authorization': `Bearer ${notionApiKey}`,
                        'Content-Type': 'application/json',
                        'Notion-Version': '2022-06-28'
                    },
                    data: JSON.stringify(createRequestBody),
                    onload: function(response) {
                        console.log('Notion创建页面响应状态:', response.status);
                        console.log('Notion创建页面响应内容:', response.responseText);
                        
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log('Notion创建页面返回数据:', data);
                                resolve(data);
                            } catch (err) {
                                console.error('Notion创建页面JSON解析失败:', err);
                                reject(new Error('解析Notion创建页面响应失败'));
                            }
                        } else {
                            console.error('Notion创建页面错误响应:', response.responseText);
                            reject(new Error(`Notion创建页面请求失败 (${response.status})`));
                        }
                    },
                    onerror: function(error) {
                        console.error('Notion创建页面调用失败:', error);
                        reject(new Error('Notion创建页面网络请求失败，请检查网络连接'));
                    },
                    ontimeout: function() {
                        console.error('Notion创建页面请求超时');
                        reject(new Error('Notion创建页面请求超时，请稍后重试'));
                    },
                    timeout: 30000  // 设置30秒超时
                });
            });
            
            // 获取创建的页面ID
            const pageId = createResponse.id;
            
            // 2. 分段更新页面内容
            const chunkSize = 1900;
            const appendPromises = [];
            
            // 处理剩余的prompt内容
            let currentIndex = 0;
            while (currentIndex < remainingPrompt.length) {
                const chunkContent = remainingPrompt.substring(currentIndex, currentIndex + chunkSize);
                currentIndex += chunkSize;
                
                // 构造追加块的请求体
                const appendBlockUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
                const appendRequestBody = {
                    children: [
                        {
                            object: "block",
                            type: "paragraph",
                            paragraph: {
                                rich_text: [
                                    {
                                        type: "text",
                                        text: {
                                            content: chunkContent
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                };

                console.log('发送Notion追加块请求:', appendRequestBody);

                // 追加块到页面
                const appendPromise = new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'PATCH',
                        url: appendBlockUrl,
                        headers: {
                            'Authorization': `Bearer ${notionApiKey}`,
                            'Content-Type': 'application/json',
                            'Notion-Version': '2022-06-28'
                        },
                        data: JSON.stringify(appendRequestBody),
                        onload: function(response) {
                            console.log('Notion追加块响应状态:', response.status);
                            console.log('Notion追加块响应内容:', response.responseText);
                            
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    console.log('Notion追加块返回数据:', data);
                                    resolve(data);
                                } catch (err) {
                                    console.error('Notion追加块JSON解析失败:', err);
                                    reject(new Error('解析Notion追加块响应失败'));
                                }
                            } else {
                                console.error('Notion追加块错误响应:', response.responseText);
                                reject(new Error(`Notion追加块请求失败 (${response.status})`));
                            }
                        },
                        onerror: function(error) {
                            console.error('Notion追加块调用失败:', error);
                            reject(new Error('Notion追加块网络请求失败，请检查网络连接'));
                        },
                        ontimeout: function() {
                            console.error('Notion追加块请求超时');
                            reject(new Error('Notion追加块请求超时，请稍后重试'));
                        },
                        timeout: 30000  // 设置30秒超时
                    });
                });
                
                appendPromises.push(appendPromise);
            }
            
            // 处理剩余的result内容
            currentIndex = 0;
            while (currentIndex < remainingResult.length) {
                const chunkContent = remainingResult.substring(currentIndex, currentIndex + chunkSize);
                currentIndex += chunkSize;
                
                // 构造追加块的请求体
                const appendBlockUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
                const appendRequestBody = {
                    children: [
                        {
                            object: "block",
                            type: "paragraph",
                            paragraph: {
                                rich_text: [
                                    {
                                        type: "text",
                                        text: {
                                            content: chunkContent
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                };

                console.log('发送Notion追加块请求:', appendRequestBody);

                // 追加块到页面
                const appendPromise = new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'PATCH',
                        url: appendBlockUrl,
                        headers: {
                            'Authorization': `Bearer ${notionApiKey}`,
                            'Content-Type': 'application/json',
                            'Notion-Version': '2022-06-28'
                        },
                        data: JSON.stringify(appendRequestBody),
                        onload: function(response) {
                            console.log('Notion追加块响应状态:', response.status);
                            console.log('Notion追加块响应内容:', response.responseText);
                            
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    console.log('Notion追加块返回数据:', data);
                                    resolve(data);
                                } catch (err) {
                                    console.error('Notion追加块JSON解析失败:', err);
                                    reject(new Error('解析Notion追加块响应失败'));
                                }
                            } else {
                                console.error('Notion追加块错误响应:', response.responseText);
                                reject(new Error(`Notion追加块请求失败 (${response.status})`));
                            }
                        },
                        onerror: function(error) {
                            console.error('Notion追加块调用失败:', error);
                            reject(new Error('Notion追加块网络请求失败，请检查网络连接'));
                        },
                        ontimeout: function() {
                            console.error('Notion追加块请求超时');
                            reject(new Error('Notion追加块请求超时，请稍后重试'));
                        },
                        timeout: 30000  // 设置30秒超时
                    });
                });
                
                appendPromises.push(appendPromise);
            }
            
            // 等待所有追加操作完成
            await Promise.all(appendPromises);
            
            // 返回创建的页面数据
            return createResponse;
        } catch (error) {
            console.error('分段同步到Notion失败:', error);
            throw error;
        }
    }

    // 创建抽屉
    function createDrawer(modal) {
        // 创建蒙层
        const drawerOverlay = document.createElement('div');
        drawerOverlay.id = 'drawer-overlay';
        drawerOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 0;
            display: none;
            cursor: pointer;
        `;
        
        // 点击蒙层关闭抽屉
        drawerOverlay.addEventListener('click', () => {
            const drawer = document.getElementById('analysis-drawer');
            if (drawer) {
                drawer.style.right = '-80%';
            }
            drawerOverlay.style.display = 'none';
        });
        
        modal.appendChild(drawerOverlay);
        
        // 创建抽屉
        const drawer = document.createElement('div');
        drawer.id = 'analysis-drawer';
        drawer.style.cssText = `
            position: absolute;
            top: 0;
            right: -80%;
            width: 80%;
            height: 100%;
            background-color: white;
            box-shadow: -2px 0 8px rgba(0,0,0,0.3);
            transition: right 0.3s ease;
            overflow-y: hidden;
            z-index: 1;
            display: flex;
            flex-direction: column;
        `;

        modal.appendChild(drawer);
        return drawer;
    }

    // 显示抽屉并填充内容
    function showDrawer(media) {
        const modal = document.querySelector('#image-extractor-overlay > div');
        let drawer = document.getElementById('analysis-drawer');
        
        if (!drawer) {
            drawer = createDrawer(modal);
        }

        // 清空抽屉内容
        drawer.innerHTML = '';

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 30px;
            cursor: pointer;
            color: #666;
            z-index: 10;
        `;
        closeBtn.addEventListener('click', () => {
            drawer.style.right = '-80%';
            // 隐藏蒙层
            const drawerOverlay = document.getElementById('drawer-overlay');
            if (drawerOverlay) {
                drawerOverlay.style.display = 'none';
            }
        });
        drawer.appendChild(closeBtn);

        // 创建内容容器
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            display: flex;
            flex-direction: column;
            height: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            flex: 1;
        `;

        // 顶部区域（图片和输入框）
        const topSection = document.createElement('div');
        topSection.style.cssText = `
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            flex-shrink: 0;
            align-items: flex-start;
        `;

        // 左侧图片容器
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            position: relative;
            width: 200px;
            height: auto;
            flex-shrink: 0;
        `;
        
        const img = document.createElement('img');
        img.src = media.thumbnail || media.url;
        img.style.cssText = `
            width: 200px;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            flex-shrink: 0;
        `;
        imgContainer.appendChild(img);
        topSection.appendChild(imgContainer);

        // 如果是视频类型，在封面中间添加播放按钮
        if (media.type === 'video') {
            const playButton = document.createElement('button');
            playButton.innerHTML = '▶';
            playButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
            `;
            
            // 创建视频播放容器
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 200px;
                height: auto;
                display: none;
                z-index: 1;
            `;
            
            const videoElement = document.createElement('video');
            videoElement.src = media.url;
            videoElement.controls = true;
            videoElement.style.cssText = `
                width: 100%;
                height: auto;
                border: 1px solid #ddd;
                border-radius: 5px;
            `;
            
            videoContainer.appendChild(videoElement);
            
            // 点击播放按钮时显示视频并播放
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                // 隐藏封面图片
                img.style.display = 'none';
                // 隐藏播放按钮
                playButton.style.display = 'none';
                // 显示视频并播放
                videoContainer.style.display = 'block';
                videoElement.play();
            });
            
            // 将播放按钮和视频容器添加到图片容器中
            imgContainer.appendChild(playButton);
            imgContainer.appendChild(videoContainer);
        }

        // 右侧输入框容器
        const inputWrapper = document.createElement('div');
        inputWrapper.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 650px;
            overflow: hidden;
        `;
        
        // 添加类型标签
        const typeTag = document.createElement('div');
        typeTag.textContent = media.type === 'image' ? '图片' : '视频';
        typeTag.style.cssText = `
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            align-self: flex-start;
            background-color: ${media.type === 'image' ? '#4CAF50' : '#FF9800'};
        `;
        inputWrapper.appendChild(typeTag);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'change_point';
        input.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 10px;
        `;
        
        // 获取记忆并填充
        console.log('当前素材类型:', media.type);
        const memory = getMemory(media.type);
        console.log('获取到的记忆:', memory);
        input.value = memory.changePoint || '';
        
        // 多行文本区域
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'prompt';
        textarea.style.cssText = `
            flex: 1;
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            resize: none;
            box-sizing: border-box;
            height: 600px;
            min-height: 600px;
            max-height: 600px;
            transition: all 0.3s ease;
            align-self: stretch;
            flex-shrink: 0;
        `;
        
        // 填充记忆中的prompt
        textarea.value = memory.prompt || '';
        console.log('填充的prompt值:', textarea.value);
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(textarea);
        topSection.appendChild(inputWrapper);
        
        content.appendChild(topSection);
        
        // 监听输入变化，保存记忆
        textarea.addEventListener('input', () => {
            const currentChangePoint = input.value;
            saveMemory(media.type, currentChangePoint, textarea.value);
            // 当prompt文本框变化时，恢复调用按钮状态
            invokeBtn.innerHTML = '调用';
            invokeBtn.disabled = false;
            invokeBtn.style.cursor = 'pointer';
            invokeBtn.style.backgroundColor = '#2196F3';
            
            // 同时重置Notion同步按钮状态（如果存在）
            const syncNotionBtn = document.getElementById('sync-notion-btn');
            if (syncNotionBtn) {
                syncNotionBtn.innerHTML = '同步到Notion';
                syncNotionBtn.disabled = false;
                syncNotionBtn.style.cursor = 'pointer';
                syncNotionBtn.style.backgroundColor = '#000';
            }
        });
        
        // 监听change_point输入框变化，保存记忆
        input.addEventListener('input', () => {
            const currentPrompt = textarea.value;
            saveMemory(media.type, input.value, currentPrompt);
            // 当change_point输入框变化时，也恢复调用按钮状态
            invokeBtn.innerHTML = '调用';
            invokeBtn.disabled = false;
            invokeBtn.style.cursor = 'pointer';
            invokeBtn.style.backgroundColor = '#2196F3';
            
            // 同时重置Notion同步按钮状态（如果存在）
            const syncNotionBtn = document.getElementById('sync-notion-btn');
            if (syncNotionBtn) {
                syncNotionBtn.innerHTML = '同步到Notion';
                syncNotionBtn.disabled = false;
                syncNotionBtn.style.cursor = 'pointer';
                syncNotionBtn.style.backgroundColor = '#000';
            }
        });

        // 结果展示区域（初始隐藏）
        const resultContainer = document.createElement('div');
        resultContainer.style.cssText = `
            width: 100%;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 4px;
            margin-top: 15px;
            display: none;
            flex: 1;
            overflow-y: auto;
            box-sizing: border-box;
            flex-shrink: 0;
            min-height: 300px;
        `;
        
        const resultTitle = document.createElement('div');
        resultTitle.textContent = '返回结果：';
        resultTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        `;
        resultContainer.appendChild(resultTitle);
        
        const resultContent = document.createElement('div');
        resultContent.style.cssText = `
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #333;
            line-height: 1.6;
        `;
        resultContainer.appendChild(resultContent);
        
        content.appendChild(resultContainer);
        
        // 调用按钮
        const invokeBtn = document.createElement('button');
        invokeBtn.textContent = '调用';
        invokeBtn.style.cssText = `
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 24px;
            font-size: 16px;
            cursor: pointer;
            align-self: center;
            margin: 10px 0;
            height: 36px;
            box-sizing: border-box;
            line-height: 36px;
        `;
        
        // 添加旋转动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .spin-animation {
                animation: spin 1s linear infinite;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
        
        // 调用处理函数（调用通义千问VL-plus模型并支持同步到Notion）
        const handleInvoke = async () => {
            const changePointValue = input.value;
            const promptValue = textarea.value;
            const link = media.url;
            const orgLink = generateOriginalLink(media.url, media.type);
            
            // 验证必填字段
            if (!link || !link.trim()) {
                alert('图片/视频链接不能为空');
                return;
            }
            
            if (!orgLink || !orgLink.trim()) {
                alert('原始链接不能为空');
                return;
            }
            
            if (!promptValue || !promptValue.trim()) {
                alert('请输入prompt内容');
                return;
            }
            
            // 显示加载状态并添加旋转动画
            invokeBtn.innerHTML = '<span class="spin-animation">🌸</span>';
            invokeBtn.disabled = true;
            invokeBtn.style.cursor = 'not-allowed';
            
            try {
                const result = await callQwenVLFlash(link, promptValue, media.type);
                
                // 显示成功状态
                invokeBtn.innerHTML = '调用成功';
                
                // 调整布局：prompt输入框高度缩小
                textarea.style.flex = '0 0 auto';
                textarea.style.height = '300px'; // 缩小到300px
                textarea.style.minHeight = '300px';
                textarea.style.maxHeight = '300px';
                
                // 显示结果
                let resultText = '';
                if (result.output && result.output.text) {
                    resultText = result.output.text;
                    resultContent.textContent = resultText;
                } else if (result.output && result.output.choices && result.output.choices.length > 0) {
                    // 兼容不同的响应格式
                    const message = result.output.choices[0].message;
                    if (message && message.content) {
                        if (Array.isArray(message.content)) {
                            // 如果content是数组，提取其中的text字段
                            const textContent = message.content.map(item => 
                                typeof item === 'object' && item.text ? item.text : String(item)
                            ).join('\n');
                            resultText = textContent;
                            resultContent.textContent = textContent;
                        } else {
                            // 如果content是字符串
                            resultText = message.content;
                            resultContent.textContent = message.content;
                        }
                        resultText = resultContent.textContent;
                    } else if (result.output) {
                        // 处理空结果情况
                        resultText = "API返回了空结果，请检查API密钥和网络连接";
                        resultContent.textContent = resultText;
                    } else {
                        resultText = JSON.stringify(result.output, null, 2);
                        resultContent.textContent = JSON.stringify(result.output, null, 2);
                    }
                } else {
                    resultText = JSON.stringify(result, null, 2);
                    resultContent.textContent = JSON.stringify(result, null, 2);
                }
                resultContainer.style.display = 'block';
                
                // 如果API响应状态为200，添加同步到Notion的按钮
                if (result.output) {
                    // 检查是否已经存在同步按钮，避免重复创建
                    let syncNotionBtn = document.getElementById('sync-notion-btn');
                    if (!syncNotionBtn) {
                        syncNotionBtn = document.createElement('button');
                        syncNotionBtn.id = 'sync-notion-btn';
                        syncNotionBtn.innerHTML = '同步到Notion';
                        syncNotionBtn.style.cssText = `
                            background-color: #000;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 0 24px;
                            font-size: 16px;
                            cursor: pointer;
                            align-self: center;
                            margin-left: 10px;
                            height: 36px;
                            box-sizing: border-box;
                            line-height: 36px;
                        `;
                        
                        // 添加到按钮容器中
                        buttonContainer.appendChild(syncNotionBtn);
                    }
                    
                    // 存储当前结果数据供后续使用
                    syncNotionBtn.dataset.mediaType = media.type;
                    syncNotionBtn.dataset.orgLink = orgLink;
                    syncNotionBtn.dataset.prompt = promptValue;
                    syncNotionBtn.dataset.resultText = resultText;
                    
                    // 重置按钮状态（可点击）
                    syncNotionBtn.disabled = false;
                    syncNotionBtn.innerHTML = '同步到Notion';
                    syncNotionBtn.style.cursor = 'pointer';
                    syncNotionBtn.style.backgroundColor = '#000';
                    
                    // 同步到Notion处理函数
                    const handleSyncNotion = async () => {
                        // 获取当前最新的change_point值（而不是调用时存储的值）
                        const currentChangePoint = input.value;
                        // 获取当前页面上的按钮引用
                        const currentBtn = document.getElementById('sync-notion-btn');
                        
                        try {
                            // 显示加载状态并添加旋转动画
                            currentBtn.innerHTML = '<span class="spin-animation">🌸</span>';
                            currentBtn.disabled = true;
                            currentBtn.style.cursor = 'not-allowed';
                            
                            await syncToNotion(
                                currentChangePoint,  // 使用当前最新的change_point值
                                currentBtn.dataset.mediaType,
                                currentBtn.dataset.orgLink,
                                currentBtn.dataset.prompt,
                                currentBtn.dataset.resultText
                            );
                            
                            currentBtn.innerHTML = '✅同步成功';
                            currentBtn.style.backgroundColor = '#4CAF50';
                            // 同步成功后保持禁用状态，鼠标悬停显示禁用状态
                            currentBtn.style.cursor = 'not-allowed';
                        } catch (err) {
                            currentBtn.innerHTML = '同步失败';
                            currentBtn.style.backgroundColor = '#f44336';
                            alert('同步到Notion失败: ' + err.message);
                            // 同步失败后恢复按钮为可点击状态
                            setTimeout(() => {
                                currentBtn.innerHTML = '同步到Notion';
                                currentBtn.disabled = false;
                                currentBtn.style.cursor = 'pointer';
                                currentBtn.style.backgroundColor = '#000';
                            }, 2000);
                        }
                    };
                    
                    // 清除可能已有的事件监听器，避免重复绑定
                    const newSyncNotionBtn = syncNotionBtn.cloneNode(true);
                    newSyncNotionBtn.addEventListener('click', handleSyncNotion);
                    syncNotionBtn.parentNode.replaceChild(newSyncNotionBtn, syncNotionBtn);
                }
            } catch (err) {
                // 显示错误
                invokeBtn.innerHTML = '调用失败';
                
                resultContent.textContent = '错误: ' + err.message;
                resultContainer.style.display = 'block';
                
                // 2秒后恢复按钮
                setTimeout(() => {
                    invokeBtn.innerHTML = '调用';
                    invokeBtn.disabled = false;
                    invokeBtn.style.cursor = 'pointer';
                }, 2000);
            }
        };
        
        invokeBtn.addEventListener('click', handleInvoke);
        
        // 创建按钮容器（固定在底部）
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
            flex-shrink: 0;
            position: sticky;
            bottom: 0;
            background-color: white;
            padding: 10px 0;
            border-top: 1px solid #eee;
        `;
        buttonContainer.appendChild(invokeBtn);
        
        content.appendChild(buttonContainer);
        drawer.appendChild(content);

        // 显示抽屉和蒙层
        setTimeout(() => {
            const drawerOverlay = document.getElementById('drawer-overlay');
            if (drawerOverlay) {
                drawerOverlay.style.display = 'block';
            }
            drawer.style.right = '0';
        }, 10);
    }

    // 创建复制按钮
    function createCopyButton(text, label) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 5px;
            margin: 2px;
            cursor: pointer;
            font-size: 12px;
            height: 30px;
            box-sizing: border-box;
        `;

        // 添加点击事件
        button.addEventListener('click', function() {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    const originalText = button.textContent;
                    button.textContent = '✅复制成功';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                }
            } catch (err) {
                alert('复制失败，请手动复制');
            }
            
            document.body.removeChild(textArea);
        });

        return button;
    }

    // 显示弹窗
    function showImageModal() {
        // 获取或创建弹窗
        let overlay = document.getElementById('image-extractor-overlay');
        if (!overlay) {
            overlay = createModal();
        }

        // 获取图片容器
        const imageContainer = document.getElementById('image-container');
        imageContainer.innerHTML = ''; // 清空之前的内容

        // 提取媒体URL
        extractMediaUrls();

        // 添加媒体到容器
        mediaUrls.forEach((media, index) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
            `;

            const img = document.createElement('img');
            img.src = media.thumbnail || media.url;
            img.style.cssText = `
                width: 200px;
                height: auto;
                border: 1px solid #ddd;
                border-radius: 5px;
                cursor: pointer;
            `;

            // 添加点击事件 - 触发画面解析效果
            img.addEventListener('click', () => {
                showDrawer(media);
            });

            // 底部容器，包含标签和下载按钮
            const bottomContainer = document.createElement('div');
            bottomContainer.style.cssText = `
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 200px;
            `;

            const typeLabel = document.createElement('div');
            typeLabel.textContent = media.type === 'image' ? '图片' : '视频';
            typeLabel.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                color: white;
                background-color: ${media.type === 'image' ? '#4CAF50' : '#FF9800'};
                height: 28px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 创建下载按钮 - 次级按钮样式
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载';
            downloadButton.style.cssText = `
                background-color: white;
                color: black;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 4px 12px;
                cursor: pointer;
                font-size: 12px;
                height: 28px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 添加下载按钮点击事件 - 触发原来的下载功能
            downloadButton.addEventListener('click', () => {
                if (media.type === 'image') {
                    downloadImage(media.url, `image_${index + 1}.jpg`);
                } else if (media.type === 'video') {
                    downloadVideo(media.url, `video_${index + 1}.mp4`);
                }
            });

            bottomContainer.appendChild(typeLabel);
            bottomContainer.appendChild(downloadButton);

            itemWrapper.appendChild(img);
            itemWrapper.appendChild(bottomContainer);
            imageContainer.appendChild(itemWrapper);
        });

        // 显示弹窗
        overlay.style.display = 'block';
    }

    // 确保DOM加载完成后再执行
    function extractMediaUrls() {
        // 清空之前的URL
        mediaUrls = [];
        
        // 查找所有具有指定class的div元素
        const containers = document.querySelectorAll('div.common-ad-material__container');
        
        // 遍历所有找到的容器
        containers.forEach((container) => {
            // 在容器内查找具有'common-ad-material__content-container'类的div元素
            const contentContainers = container.querySelectorAll('div.common-ad-material__content-container');
            
            // 遍历所有内容容器
            contentContainers.forEach((contentContainer) => {
                // 查找img标签
                const images = contentContainer.querySelectorAll('img');
                // 查找video标签
                const videos = contentContainer.querySelectorAll('video[poster]');
                
                // 处理图片
                images.forEach((img) => {
                    const imgUrl = img.src;
                    // 过滤特定的图片链接
                    if (imgUrl && imgUrl !== filteredImageUrl && 
                        !mediaUrls.some(media => media.url === imgUrl)) {
                        mediaUrls.push({
                            url: imgUrl,
                            type: 'image',
                            thumbnail: imgUrl
                        });
                    }
                });
                
                // 处理视频
                videos.forEach((video) => {
                    const videoUrl = video.src || ''; // 视频链接可能为空
                    const posterUrl = video.poster;
                    
                    // 添加视频链接（如果存在）
                    if (videoUrl && videoUrl !== filteredImageUrl && videoUrl !== "" &&
                        !mediaUrls.some(media => media.url === videoUrl)) {
                        mediaUrls.push({
                            url: videoUrl,
                            type: 'video',
                            thumbnail: posterUrl || videoUrl,
                            poster: posterUrl
                        });
                    }
                    
                    // 添加封面链接（如果不存在视频链接）
                    if ((!videoUrl || videoUrl === filteredImageUrl || videoUrl === "") && 
                        posterUrl && posterUrl !== filteredImageUrl && posterUrl !== "" &&
                        !mediaUrls.some(media => media.url === posterUrl)) {
                        mediaUrls.push({
                            url: posterUrl,
                            type: 'image',
                            thumbnail: posterUrl
                        });
                    }
                });
            });
        });
    }

    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createFixedButton();
        });
    } else {
        // 如果DOM已经加载完成，直接执行
        createFixedButton();
    }

    // 使用MutationObserver监听DOM变化，确保动态加载的内容也能被处理
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查是否有新增节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否有我们关心的元素被添加
                const hasTargetContainer = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查节点本身或其子节点是否包含目标class
                        return node.classList?.contains('common-ad-material__container') || 
                               node.querySelector?.('div.common-ad-material__container');
                    }
                    return false;
                });
                
                if (hasTargetContainer) {
                    // 延迟执行以确保DOM完全渲染
                    setTimeout(() => {
                        // 重新提取媒体URL，但不显示弹窗
                        extractMediaUrls();
                    }, 100);
                }
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();