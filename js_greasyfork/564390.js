// ==UserScript==
// @name         Arena AI
// @namespace    https://arena.ai/
// @version      5.81
// @description  通过WebSocket自动填充提示词Lmarena AI并执行
// @author       You
// @match        https://lmarena.ai/*
// @match        https://arena.ai/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564390/Arena%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/564390/Arena%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 判断当前窗口是否是顶层窗口
    if (window.top === window.self) {
        // 是顶层窗口，执行你的主要代码
        console.log("脚本在主页面运行");
        // ... 你的所有代码都放在这里 ...
    } else {
        // 是在 iframe 中，不执行或执行其他逻辑
        console.log("脚本在 iframe 中，已跳过");
        return;
    }
    let ws = null;
    let clientId = null;
    let reconnectInterval = null;
    const WS_URL = 'ws://localhost:5999'; // WebSocket端口
    let currentRequestId = null;
    let isProcessing = false;
    let holdChatConvertionModelIdMap ={};//{key:modelId,value:holdChatConvertionArray}
    let model_info_array = [];
    let currentAssistantAInfo = null;
    let currentAssistantBInfo = null;
    // 存储已处理的Assistant元素，避免重复处理
    let processedAssistantIds = new Set();
    // 存储recaptchaV3Token
    let recaptchaV3Token = null;
    // 存储当前正在处理的prompt数据
    let currentPromptData = null;
    // 存储拦截到的响应流
    let interceptedResponseReader = null;
    let refresh_page_url='https://arena.ai/zh/c/new?mode=direct'
    // 日志函数
    function log(message, data = null) {
        console.log(`[Lmarena AI] ${message}`, data || '');
    }

    // 连接WebSocket
    function connectWebSocket() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            return;
        }

        log('正在连接WebSocket服务器...');
        ws = new WebSocket(WS_URL);

        ws.onopen = function() {
            log('WebSocket连接成功');
            if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
            }
            // 发送注册消息
            clientId = generateClientId();
            ws.send(JSON.stringify({
                type: 'register',
                clientId: clientId
            }));
        };

        ws.onmessage = async function(event) {
            try {
                const data = JSON.parse(event.data);
                log(`收到消息:${data.type}`);

                if (data.type === 'prompt') {
                    if(isProcessing){
                        log('正在处理中，忽略');
                        return;
                    }

                    currentRequestId = data.requestId;
                    currentPromptData = data;
                    await simulatePromptInUI(data);
                }
                else if(data.type === 'retry_prompt'){
                    if(isProcessing){
                        log('正在处理中，忽略');
                        return;
                    }
                    currentRequestId = data.requestId;
                    await post_to_evaluation(data);
                }
                else if(data.type === 'refresh_page') {
                    log('收到页面刷新信号，使用SPA导航返回主页（不刷新）...');
                    setTimeout(() => {
                        const success = navigateToHome();
                        if (!success) {
                            // 如果SPA导航失败，使用URL跳转作为后备方案
                            log('SPA导航失败，使用URL跳转');
                            window.location.href = refresh_page_url;
                        }
                    }, 500);
                }
                else if(data.type === 'action'){

                }else if(data.type === 'registered'){
                    console.log('registered',data);
                    // data.model_id_array.forEach(modelId => {
                    //     const holdChatConvertionArray = getHoldChatConvertionArray(modelId);
                    // });
                    // sendUpdateSessionData();
                    model_info_array = data.model_info_array || [];
                    data.model_info_array.forEach(model => {
                        const holdChatConvertionArray = getHoldChatConvertionArray(model.modelId);
                    });
                    sendUpdateSessionData();
                    // // 初始检测Assistant元素
                    setTimeout(() => {
                        detectAndHandleAssistants();
                    }, 1000);
                }
                else if(data.type === 'reset_model_relation'){
                    const modelId = data.modelId;
                    const holdChatConvertionArray = getHoldChatConvertionArray(modelId);
                    holdChatConvertionArray.length = 0;
                    // 保存到localStorage
                    const storageKey = 'holdChatConvertionArray' + modelId;
                    localStorage.setItem(storageKey, JSON.stringify(holdChatConvertionArray));
                    console.log('[模型清除] 已清除模型的localStorage:', storageKey);

                    // 更新会话数据
                    sendUpdateSessionData();
                }
                else{
                    sendFinishResponse('')
                }
            } catch (error) {
                log('处理消息错误:', error);
                isProcessing = false;
            }
        };

        ws.onclose = function() {
            log('WebSocket连接关闭');
            ws = null;
            startReconnect();
        };

        ws.onerror = function(error) {
            log('WebSocket错误:', error);
        };
    }

    // 自动重连
    function startReconnect() {
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                log('尝试重新连接...');
                connectWebSocket();
            }, 5000);
        }
    }

    // 生成客户端ID
    function generateClientId() {
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }

    // 通过编程方式导航到主页（不刷新页面，SPA导航）
    function navigateToHome() {
        try {
            // 使用 History API 改变URL，不刷新页面
            window.history.pushState({}, '', '/c/new?mode=direct');
            
            // 触发 popstate 事件，让 React Router 等 SPA 框架响应路由变化
            const popStateEvent = new PopStateEvent('popstate', {
                state: {}
            });
            window.dispatchEvent(popStateEvent);
            
            console.log('已通过 History API 导航到主页（SPA导航）');
            return true;
        } catch (error) {
            console.error('SPA导航失败:', error);
            return false;
        }
    }

    // 方法1: 直接点击元素（推荐用于 SPA）
    async function clickLogoLink() {
        let sidebarClicked = false;

        // 先点击侧边栏按钮 - 使用更精确的选择器
        const sidebarButton = document.querySelector('button[data-sentry-element="TooltipTrigger"][data-sentry-source-file="basic-tooltip.tsx"] svg.lucide-panel-left-open');
        if (sidebarButton) {
            // 点击SVG的父级按钮
            simulateRealClick(sidebarButton.parentElement);
            console.log('点击了侧边栏按钮');
            sidebarClicked = true;
        } else {
            // 备用选择器1
            const sidebarButtonAlt = document.querySelector('button svg.lucide-panel-left-open');
            if (sidebarButtonAlt) {
                simulateRealClick(sidebarButtonAlt.parentElement);
                console.log('点击了侧边栏按钮(备用1)');
                sidebarClicked = true;
            } else {
                // 备用选择器2 - panel-right-close按钮
                const panelRightCloseButton = document.querySelector('button[data-sentry-element="Button"][data-sentry-source-file="evaluation-header.tsx"] svg.lucide-panel-right-close');
                if (panelRightCloseButton) {
                    simulateRealClick(panelRightCloseButton.parentElement);
                    console.log('点击了右侧面板关闭按钮(备用2)');
                    sidebarClicked = true;
                } else {
                    // 最后的备用选择器
                    const panelRightCloseButtonAlt = document.querySelector('button svg.lucide-panel-right-close');
                    if (panelRightCloseButtonAlt) {
                        simulateRealClick(panelRightCloseButtonAlt.parentElement);
                        console.log('点击了右侧面板关闭按钮(备用3)');
                        sidebarClicked = true;
                    }
                }
            }
        }

        if (sidebarClicked) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 再点击新对话按钮
        const newChatButton = document.querySelector('h2[data-sentry-element="Tag"][data-sentry-source-file="text.tsx"]');
        if (newChatButton) {
            simulateRealClick(newChatButton);
            console.log('点击了 New chat 按钮');
            return true;
        }
        return false;
    }
    // 处理提示词
    async function processPrompt(data) {
        try {
            isProcessing = true;
            console.log('processPrompt',data.modelId,data.mode);
            let modelBMessageId = null;
            if(data.mode === 'battle'){
                // 完整复制最后一句对话，并修改内容，不要改变原始数据
                const lastMessage = data.transcript[data.transcript.length - 1];
                const newMessage = {
                    ...lastMessage,
                };
                newMessage.id = data.requestId;
                modelBMessageId = newMessage.id;
                data.transcript.push(newMessage);
            }
            // 构建请求体
            const body = {
                ...(data.extra_body),
                
                // messages: data.transcript,
                ...(data.mode === 'battle'?{
                    modelBMessageId: data.requestId,
                }:{
                    modelAId: data.modelId,
                }),
                id:data.requestId,
                userMessage:data.userMessage,
                mode: data.mode,
                modality: data.modality,
                userMessageId: data.userMessageId,
                modelAMessageId: data.modelAMessageId,
                recaptchaV3Token:recaptchaV3Token,
            };

            // 直接发送请求
            const response = await window.fetch(   `https://arena.ai/${data.backend_url || 'nextjs-api/stream/create-evaluation'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if(response.status >= 200 && response.status < 300){
                if(data.mode === 'battle'){

                }else{
                    const holdChatConvertion={
                        id:data.requestId,
                        modelId:data.modelId,
                        mode:data.mode,
                        modality:data.modality,
                        userMessageId:data.userMessageId,
                        modelAMessageId:data.modelAMessageId
                    }
                    // save to local storage
                    const holdChatConvertionArray = getHoldChatConvertionArray(data.modelId);
                    if(holdChatConvertionArray.length >= 20){
                        // remove first item from the array
                        holdChatConvertionArray.shift();
                    }
                    holdChatConvertionArray.push(holdChatConvertion);
                    localStorage.setItem('holdChatConvertionArray'+data.modelId,JSON.stringify(holdChatConvertionArray));
                    sendLog(`保存请求记录模型,${data.modelId},当前数量: ${holdChatConvertionArray.length}`);
                }
            }else{
                console.error('处理提示词错误:', response.status); 
            }
            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    log('Stream complete');
                    sendFinishResponse('');
                    isProcessing = false;
                    break;
                }

                const chunk = decoder.decode(value, {stream: true});
                sendResponse(chunk);
            }

        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
            isProcessing = false;
        }
    }

    function getHoldChatConvertionArray(modelId){   
        if(!holdChatConvertionModelIdMap[modelId]){
            try{
                holdChatConvertionModelIdMap[modelId] = JSON.parse(localStorage.getItem('holdChatConvertionArray'+modelId));
            }catch(e){
                console.error('load from local storage error',e);
                holdChatConvertionModelIdMap[modelId] = [];
            }
        }
        if(!holdChatConvertionModelIdMap[modelId]){
            holdChatConvertionModelIdMap[modelId] = [];
        }
        return holdChatConvertionModelIdMap[modelId];
    }
    
    // 处理提示词
    async function retryPrompt(data) {
        try {
            isProcessing = true;

            let holdChatConvertion = null;
            const holdChatConvertionArray = getHoldChatConvertionArray(data.modelId);
            if(holdChatConvertionArray.length > 0){
                if(data.evaluationSessionId){
                    holdChatConvertion = holdChatConvertionArray.find(item => item.id === data.evaluationSessionId);
                }else{
                    // random get one
                    holdChatConvertion = holdChatConvertionArray[Math.floor(Math.random() * holdChatConvertionArray.length)];
                }
            }

            if(!holdChatConvertion){
                //兼容舊版本
                if(localStorage.getItem('holdChatConvertion'+data.modelId)){
                    try{
                        holdChatConvertion = JSON.parse(localStorage.getItem('holdChatConvertion'+data.modelId));
                        console.log('load from local storage',holdChatConvertion);
                    }catch(e){
                        console.error('load from local storage error',e);
                    }
                }
            }

            if(!holdChatConvertion){
                log('holdChatConvertion not found');
                sendError('holdChatConvertion not found');
                isProcessing = false;
                return;
            }

            console.warn('正式重新刷新消息',holdChatConvertion.id);
            // 构建请求体
            const body = {
                "messages": [
                    {
                        "id": holdChatConvertion.userMessageId,
                        "evaluationSessionId": holdChatConvertion.id,
                        // "evaluationId": "c1a4fc9c-702b-4826-8b2f-44fe5788e046",
                        "parentMessageIds": [],
                        "content": data.prompt,
                        "modelId": null,
                        "status": "success",//pending
                        "failureReason": null,
                        "metadata": null,
                        // "createdAt": "2025-07-10T07:27:33.814369+00:00",
                        // "updatedAt": "2025-07-10T07:27:33.814369+00:00",
                        "role": "user",
                        "experimental_attachments": [],
                        "participantPosition": "a"
                    }
                ],
                "modelId": data.modelId
            }
            const baseurl = `https://arena.ai/${data.backend_retry_url || 'nextjs-api/stream/retry-evaluation-session-message'}/${holdChatConvertion.id}/messages/${holdChatConvertion.modelAMessageId}`
            // 直接发送请求
            const response = await window.fetch(baseurl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if(response.status < 200 || response.status >= 300){
                // 如果是access的問題，可能要刪除holdChatConvertion
                // TODO
            }

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    log('Stream complete');
                    sendFinishResponse('');
                    isProcessing = false;
                    break;
                }

                const chunk = decoder.decode(value, {stream: true});
                sendResponse(chunk);
            }

        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
            isProcessing = false;
        }
    }


    async function post_to_evaluation(data) {
        try {
            isProcessing = true;

            let holdChatConvertion = null;
            const holdChatConvertionArray = getHoldChatConvertionArray(data.modelId);
            if(holdChatConvertionArray.length > 0){
                if(data.evaluationSessionId){
                    holdChatConvertion = holdChatConvertionArray.find(item => item.id === data.evaluationSessionId);
                }else{
                    // random get one
                    holdChatConvertion = holdChatConvertionArray[Math.floor(Math.random() * holdChatConvertionArray.length)];
                }
            }

            if(!holdChatConvertion){
                //兼容舊版本
                if(localStorage.getItem('holdChatConvertion'+data.modelId)){
                    try{
                        holdChatConvertion = JSON.parse(localStorage.getItem('holdChatConvertion'+data.modelId));
                        console.log('load from local storage',holdChatConvertion);
                    }catch(e){
                        console.error('load from local storage error',e);
                    }
                }
            }
            if(!recaptchaV3Token){
                log('recaptchaV3Token not found');
                sendError('recaptchaV3Token not found');
                isProcessing = false;
                return;
            }

            if(!holdChatConvertion){
                log('holdChatConvertion not found');
                sendError('holdChatConvertion not found');
                isProcessing = false;
                return;
            }
            if(!holdChatConvertion.assistantType){
                log('holdChatConvertion not assistantType');
                sendError('holdChatConvertion not assistantType');
                isProcessing = false;
                return;
            }

            console.warn('正式重新刷新消息',holdChatConvertion.id);
            sendPostHoldBody(holdChatConvertion);

            const body = {
                id:holdChatConvertion.id,
                userMessage:data.userMessage,
                modality: data.modality,
                userMessageId: data.userMessageId,
                modelAMessageId: data.modelAMessageId,
                modelBMessageId: data.modelBMessageId,
            }
            const baseurl = `https://arena.ai/${data.backend_retry_url || 'nextjs-api/stream/post-to-evaluation'}/${holdChatConvertion.id}`
            // 直接发送请求
            const response = await window.fetch(baseurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if(response.status < 200 || response.status >= 300){
                // 如果是access的問題，可能要刪除holdChatConvertion
                // TODO
            }

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    log('Stream complete');
                    sendFinishResponse('');
                    isProcessing = false;
                    break;
                }

                const chunk = decoder.decode(value, {stream: true});
                sendResponse(chunk);
            }

        } catch (error) {
            log('处理提示词错误:', error);
            sendError(error.message);
            isProcessing = false;
        }
    }

    // 等待运行按钮可用
    async function waitForRunButton(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            const button = document.querySelector('button[type="submit"][data-sentry-element="Button"]');
            if (button) {
                log('运行按钮已可用');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('运行按钮未能可用');
    }

    // 点击运行按钮
    async function clickRunButton() {
        const button = document.querySelector('button[type="submit"][data-sentry-element="Button"]');
        if (!button) {
            throw new Error('运行按钮不可用');
        }

        log('点击运行按钮');
        // 使用模拟真实鼠标点击来点击按钮
        simulateRealClick(button);
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }

    // 发送响应
    function sendResponse(content) {
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送响应内容');
            ws.send(JSON.stringify({
                type: 'response',
                requestId: currentRequestId,
                content: content,
                success: true
            }));
        }
    }

    function sendPostHoldBody(holdChatConvertion){
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送响应内容');
            ws.send(JSON.stringify({
                type: 'retry_post_id',
                requestId: currentRequestId,
                content: holdChatConvertion,
                success: true
            }));
        }
    }

    function sendFinishResponse(content){
        isProcessing = false;
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送结束消息');
            ws.send(JSON.stringify({
                type: 'finish',
                requestId: currentRequestId,
                content: content,
                success: true
            }));
            currentRequestId = null;
        }
    }

    // 发送错误
    function sendError(error) {
        isProcessing = false;
        if (ws && ws.readyState === WebSocket.OPEN && currentRequestId) {
            log('发送错误信息:', error);
            ws.send(JSON.stringify({
                type: 'response',
                requestId: currentRequestId,
                error: error,
                success: false
            }));
            currentRequestId = null;
        }
    }

    // 发送日志
    function sendLog(logInfo) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            log('发送日志:', logInfo);
            ws.send(JSON.stringify({
                type: 'log',
                log: logInfo,
            }));
        }
    }

    
    // 更新sessionData
    function sendUpdateSessionData() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            log('更新sessionData:', holdChatConvertionModelIdMap);
            ws.send(JSON.stringify({
                type: 'update_session_data',
                clientId: clientId,
                holdChatConvertionModelIdMap: holdChatConvertionModelIdMap,
            }));
        }
    }

    // 辅助函数：睡眠
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 模拟真实的鼠标点击
    function simulateRealClick(element) {
        if (!element) return false;

        // 获取元素位置
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 模拟鼠标移动到元素上
        const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY
        });
        element.dispatchEvent(moveEvent);

        // 模拟鼠标按下
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(mouseDownEvent);

        // 模拟鼠标松开
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(mouseUpEvent);

        // 模拟点击
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            button: 0 // 左键
        });
        element.dispatchEvent(clickEvent);

        return true;
    }

    // 监控所有网络请求（调试用）
    function monitorAllRequests() {
        // // 监控 XMLHttpRequest
        // const originalXHROpen = XMLHttpRequest.prototype.open;
        // XMLHttpRequest.prototype.open = function(method, url, ...args) {
        //     if (url.includes('google.com')) {
        //         console.log(`[Network Monitor] XHR ${method} ${url}`);
        //     }
        //     return originalXHROpen.apply(this, [method, url, ...args]);
        // };

        // 监控 fetch
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const requestUrl = JSON.stringify(args[0]);
            const requestOptions = args[1];
            
            // 拦截 create-evaluation 接口
            if(requestUrl && requestUrl.includes('create-evaluation') && requestOptions && requestOptions.method === 'POST'){
                try{
                    const bodyJson = JSON.parse(requestOptions.body);
                    
                    // 获取 recaptchaV3Token
                    if(bodyJson.recaptchaV3Token){
                        recaptchaV3Token = bodyJson.recaptchaV3Token;
                        console.log('[Token获取] 成功获取recaptchaV3Token:', recaptchaV3Token);
                        sendLog(`成功获取recaptchaV3Token: ${recaptchaV3Token.substring(0, 20)}...`);
                    }
                    
                    // 如果是通过UI模拟触发的请求，修改body并拦截响应
                    if(currentPromptData && isProcessing){
                        console.log('[UI模拟] 拦截到create-evaluation请求，准备修改body并处理响应');
                        
                        // 修改body中的modelAId为指定的modelId
                        if(currentPromptData.modelId){
                            bodyJson.modelAId= currentPromptData.modelId
                            bodyJson.id=currentPromptData.requestId,
                            bodyJson.userMessage=currentPromptData.userMessage,
                            bodyJson.mode=currentPromptData.mode,
                            bodyJson.modality=currentPromptData.modality,
                            bodyJson.userMessageId=currentPromptData.userMessageId,
                            bodyJson.modelAMessageId=currentPromptData.modelAMessageId,
                            delete bodyJson.modelBMessageId;
                            console.log('[UI模拟] 修改modelAId为:', currentPromptData.modelId);
                        }
                        
                        // 保存token到localStorage
                        if(bodyJson.recaptchaV3Token){
                            localStorage.setItem('recaptchaV3Token', bodyJson.recaptchaV3Token);
                        }
                        
                        // 使用修改后的body重新构建请求
                        const modifiedOptions = {
                            ...requestOptions,
                            body: JSON.stringify(bodyJson)
                        };
                        
                        const response = await originalFetch.apply(this, [args[0], modifiedOptions]);
                        
                        // 克隆响应以便处理流式数据
                        const responseClone = response.clone();
                        
                        // 在后台处理流式响应并转发到WebSocket
                        handleStreamResponse(responseClone);
                        
                        // 返回原始响应给页面
                        return response;
                    }
                }catch(e){
                    console.error('[Token获取] 解析create-evaluation请求失败:', e);
                }
            }
            
            const url = requestOptions;
            if(url && url.body && url.method === 'POST'){
                try{
                    console.log('fetch',args);
                    const bodyJson = JSON.parse(url.body);
                    // typeof bodyJson is array
                    if(Array.isArray(bodyJson)){
                        console.log(`[Network Monitor] Fetch ${bodyJson}`);
                        if(bodyJson.length === 1){
                            const chatId = bodyJson[0];
                            // 拦截返回结果，并返回结果
                            const response = await originalFetch.apply(this, args);
                            // 0:{"a":"$@1","f":"","b":"R9tZQV87M8bOy8rX451ag"}
                            // 1:{"success":true,"data":{"id":"598623e3-9182-4793-a166-6e1de18d7fcb","userId":"9c475b40-27eb-42dd-87e6-4856ec026a04","title":"ä½ æ˜¯è°","mode":"direct","visibility":"public","lastMessageIds":["1c45b6bf-2a87-41d3-a117-26b8f6ef00f7"],"createdAt":"2025-07-14 06:12:50.619+00","updatedAt":"2025-07-14 06:12:51.001693+00","messages":[{"id":"1c45b6bf-2a87-41d3-a117-26b8f6ef00f7","evaluationSessionId":"598623e3-9182-4793-a166-6e1de18d7fcb","evaluationId":"3dbb6593-3b93-4848-800f-0b0e15a98105","parentMessageIds":["b69a22d0-d5ba-4672-ac37-fb76eb44baa6"],"content":"æˆ‘æ˜¯ Groqï¼Œä¸€ä¸ªç”± Groq å…¬å¸å¼€å‘çš„ AI åŠ©æ‰‹ï¼Œä½¿ç”¨ä»–ä»¬çš„å¿«é€ŸæŽ¨ç†å¼•æ“Žï¼Œèƒ½é«˜æ•ˆå¤„ç†å„ç§æŸ¥è¯¢ã€‚","modelId":"08a2050b-5ce3-4eee-a7a3-42097565799c","status":"success","failureReason":null,"metadata":null,"createdAt":"2025-07-14T06:12:50.997072+00:00","updatedAt":"2025-07-14T06:12:57.396508+00:00","role":"assistant","experimental_attachments":[],"participantPosition":"a"},{"id":"b69a22d0-d5ba-4672-ac37-fb76eb44baa6","evaluationSessionId":"598623e3-9182-4793-a166-6e1de18d7fcb","evaluationId":"3dbb6593-3b93-4848-800f-0b0e15a98105","parentMessageIds":[],"content":"ä½ æ˜¯è°","modelId":null,"status":"success","failureReason":null,"metadata":null,"createdAt":"2025-07-14T06:12:50.993795+00:00","updatedAt":"2025-07-14T06:12:50.993795+00:00","role":"user","experimental_attachments":[],"participantPosition":"a"}],"pairwiseFeedbacks":[],"pointwiseFeedbacks":[],"maskedEvaluations":[{"id":"3dbb6593-3b93-4848-800f-0b0e15a98105","modality":"chat","arenaId":"4c249f58-2f34-4859-bbdb-4233a8313340"}]}}
                            // 从response中拷贝response并解析
                            // clone response
                            try{
                                const responseClone = response.clone();
                                const responseText = await responseClone.text();
                                // console.log('responseText',responseText);
                                const lines = responseText.split('\n');
                                const targetLine = lines.find(line => line.includes('{"success":true,"data":'));
                                if (!targetLine) {
                                    console.error('未找到包含{"success":true,"data":的行');
                                }else{
                                    console.log('targetLine',targetLine)
                                    const splitText = targetLine.split('{"success":true,"data":');
                                    console.log('splitText',splitText);
                                    const responseJson = JSON.parse('{"success":true,"data":'+splitText[1]);
                                    // console.log(`[Network Monitor] Fetch ${responseJson.data.id}`);
                                    // let modelId = null;
                                    
                                    currentAssistantAInfo = null;
                                    currentAssistantBInfo = null;
                                    if(responseJson.data.messages){
                                        const modelListIds = {};
                                        let usetMessageId = null;
                                        for(let i = 0; i < responseJson.data.messages.length; i++){
                                            const message = responseJson.data.messages[i];
                                            // console.log(message,message);
                                            if(message.role === 'assistant' && message.status === 'success'){
                                                if(message.modelId){
                                                    // direct模式，有具体的modelId
                                                    if(!modelListIds[message.modelId]){
                                                        modelListIds[message.modelId]={
                                                            modelId:message.modelId,
                                                            modelMessageId:message.id
                                                        }
                                                    }
                                                } else if(message.participantPosition){
                                                    // battle模式，没有modelId但有participantPosition
                                                    if(message.participantPosition === 'a'){
                                                        currentAssistantAInfo = message;
                                                        console.log('[网络监控] 设置currentAssistantAInfo:', currentAssistantAInfo);
                                                    }else if(message.participantPosition === 'b'){
                                                        currentAssistantBInfo = message;
                                                        console.log('[网络监控] 设置currentAssistantBInfo:', currentAssistantBInfo);
                                                    }
                                                }
                                            }
                                            if(message.role === 'user' && !usetMessageId){
                                                usetMessageId = message.id;
                                            }
                                        }
                                        // battle 没法重试，所以存储了也没有用，所以不存储
                                        if(Object.keys(modelListIds).length > 0 && usetMessageId && data.mode !== 'battle'){
                                            for(let modelId in modelListIds){
                                                const modelMessageId = modelListIds[modelId].modelMessageId;
                                                console.log(`[Network Monitor] Success Fetch ModelId: ${modelId}`);
                                                // save to local storage
                                                const holdChatConvertionArray = getHoldChatConvertionArray(modelId);
                                                // check responseJson.data.id is in holdChatConvertionArray
                                                if(holdChatConvertionArray.find(item => item.id === responseJson.data.id)){
                                                    console.warn(`[Network Monitor] Hold Chat Convertion ${responseJson.data.id} already exists`);
                                                }else{          
                                                    const holdChatConvertion={
                                                        id:responseJson.data.id,//evaluationSessionId
                                                        modelId:modelId,
                                                        mode:responseJson.data.mode,
                                                        modality:'chat',
                                                        userMessageId:usetMessageId,
                                                        modelAMessageId:modelMessageId
                                                    }
                                                    console.log(`[Network Monitor] Hold Chat Convertion: ${JSON.stringify(holdChatConvertion)}`);
                                                    
                                                    holdChatConvertionArray.push(holdChatConvertion);
                                                    localStorage.setItem('holdChatConvertionArray'+modelId,JSON.stringify(holdChatConvertionArray));
                                                    sendLog(`获取holdChatConvertion,${modelId},當前數量: ${holdChatConvertionArray.length}`);
                                                    sendUpdateSessionData();
                                                }
                                            }
                                        }else{
                                            console.error(`[Network Monitor] Failed Get Messages ModelIds`,Object.keys(modelListIds).length,usetMessageId);
                                        }
                                    }else{
                                        console.error(`[Network Monitor] Not Messages in response`);
                                    }
                                }
                            }catch(e){
                                console.error(`[Network Monitor] Fetch 解析失败 `,e);
                            }

                            // 返回原始response
                            return response;
                        }
                    }
                }catch(e){
                    console.log(`[Network Monitor] Fetch ${url.body} 解析失败`);
                }
            }
            return originalFetch.apply(this, args);
        };
    }

    // 添加CSS样式到页面
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lmarena-model-selector {
                animation: fadeIn 0.3s ease-in;
                margin-top: 8px;
                padding: 8px;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #e9ecef;
                font-size: 12px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .lmarena-model-select {
                width: 100%;
                padding: 4px 8px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                background: white;
                font-size: 12px;
            }
            
            .lmarena-model-select:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
            }
            
            .lmarena-model-selector button {
                margin-top: 6px;
                padding: 4px 12px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .lmarena-model-selector button:hover {
                background: #0056b3;
            }
            
            .lmarena-model-selector button:disabled {
                background: #6c757d;
                cursor: not-allowed;
            }
            
            .association-status {
                margin-top: 6px;
                font-size: 11px;
                color: #6c757d;
            }
        `;
        document.head.appendChild(style);
    }

    // 从浏览器缓存中获取已处理的Assistant ID
    function getProcessedAssistantIdsFromCache() {
        try {
            const cached = localStorage.getItem('A_B_processedAssistantIds');
            return cached ? JSON.parse(cached) : new Set();
        } catch (e) {
            console.error('读取已处理Assistant ID缓存失败:', e);
            return new Set();
        }
    }

    // 保存已处理的Assistant ID到浏览器缓存
    function saveProcessedAssistantIdsToCache(processedIds) {
        try {
            const idsArray = Array.from(processedIds);
            localStorage.setItem('A_B_processedAssistantIds', JSON.stringify(idsArray));
        } catch (e) {
            console.error('保存已处理Assistant ID缓存失败:', e);
        }
    }

    // 检测并处理Assistant元素（支持A和B）
    function detectAndHandleAssistants() {
        console.log('detectAndHandleAssistants');
        if(currentAssistantAInfo === null || currentAssistantBInfo === null){
            console.error('currentAssistantAInfo or currentAssistantBInfo is nil')
            return;
        }
        // 查找所有可能包含Assistant的元素
        const assistantElements = document.querySelectorAll('span.xs\\:max-w-full');
        
        // 从缓存中读取已处理的ID
        const cachedProcessedIds = getProcessedAssistantIdsFromCache();
        processedAssistantIds = new Set(cachedProcessedIds);
        console.log('assistantElements.length',assistantElements.length)
        assistantElements.forEach(element => {
            const truncateSpan = element.querySelector('.truncate');
            if (truncateSpan) {
                const textContent = truncateSpan.textContent.trim();
                if (textContent === 'Assistant A' || textContent === 'Assistant B') {
                    // 生成唯一标识符，包含assistant类型
                    const assistantType = textContent === 'Assistant A' ? 'A' : 'B';
                    const elementId = element.getAttribute('data-assistant-id') ||
                                     `assistant-${assistantType}-${Math.random().toString(36).substr(2, 9)}`;
                    element.setAttribute('data-assistant-id', elementId);
                    
                    const currentAssistantInfo = assistantType === 'A' ? currentAssistantAInfo : currentAssistantBInfo;
                    // 检查是否已经处理过
                    if (!processedAssistantIds.has(currentAssistantInfo.id)) {
                        createModelSelectorUI(element, elementId, assistantType);
                        log(`检测到${textContent}元素，已添加模型选择器`);
                        
                    }
                }
            }
        });
    }

    // 创建模型选择器UI
    function createModelSelectorUI(assistantElement, elementId, assistantType) {
        // 查找父容器
        const parentContainer = assistantElement.closest('div');
        if (!parentContainer) return;

        // 检查是否已经添加了选择器
        if (parentContainer.querySelector('.lmarena-model-selector')) {
            return;
        }

        // 创建选择器容器
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'lmarena-model-selector';
        selectorContainer.setAttribute('data-assistant-type', assistantType);

        // 创建标题
        const title = document.createElement('div');
        title.textContent = `关联模型 (Assistant ${assistantType}):`;
        title.style.cssText = `
            font-weight: 500;
            margin-bottom: 6px;
            color: #495057;
        `;

        // 创建模型选择下拉框
        const modelSelect = document.createElement('select');
        modelSelect.className = 'lmarena-model-select';

        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '选择模型...';
        modelSelect.appendChild(defaultOption);

        // 添加可用模型选项
        if (model_info_array && model_info_array.length > 0) {
            model_info_array.forEach(model => {
                const option = document.createElement('option');
                option.value = model.modelId;
                option.textContent = model.modelName || model.modelId;
                modelSelect.appendChild(option);
            });
        }else{
            console.error('model_info_array is empty');
        }

        // 创建关联按钮
        const associateBtn = document.createElement('button');
        associateBtn.textContent = '关联';

        // 创建状态显示
        const statusDiv = document.createElement('div');
        statusDiv.className = 'association-status';

        // 添加事件监听
        associateBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('[模型关联] 关联按钮被点击', { elementId, assistantType });
            
            const selectedModelId = modelSelect.value;
            console.log('[模型关联] 选中的模型ID:', selectedModelId);
            
            if (selectedModelId) {
                statusDiv.textContent = '正在关联...';
                statusDiv.style.color = '#007bff';
                handleModelAssociation(elementId, selectedModelId, statusDiv, assistantType);
            } else {
                statusDiv.textContent = '请先选择模型';
                statusDiv.style.color = '#dc3545';
            }
        });
        
        // 添加调试信息
        console.log('[模型关联] 已为', assistantType, '创建模型选择器UI');

        // 组装UI
        selectorContainer.appendChild(title);
        selectorContainer.appendChild(modelSelect);
        selectorContainer.appendChild(associateBtn);
        selectorContainer.appendChild(statusDiv);

        // 插入到DOM中
        parentContainer.appendChild(selectorContainer);
    }

    // 查找用户消息ID的辅助函数
    function findUserMessageId(assistantInfo) {
        // 从parentMessageIds中获取
        if (assistantInfo && assistantInfo.parentMessageIds && assistantInfo.parentMessageIds.length > 0) {
            return assistantInfo.parentMessageIds[0];
        }
        return null;
    }

    // 处理模型关联
    function handleModelAssociation(elementId, modelId, statusElement, assistantType) {
        console.log('[模型关联] 开始处理关联', { elementId, modelId, assistantType });
        
        try {
            // 根据assistant类型选择对应的信息
            const currentAssistantInfo = assistantType === 'A' ? currentAssistantAInfo : currentAssistantBInfo;
            
            console.log('[模型关联] 当前Assistant信息:', {
                assistantType,
                hasAssistantAInfo: !!currentAssistantAInfo,
                hasAssistantBInfo: !!currentAssistantBInfo,
                selectedInfo: currentAssistantInfo
            });
            
            // 检查是否有对应的Assistant信息
            if (!currentAssistantInfo) {
                const errorMsg = `未找到Assistant ${assistantType}信息，请先进行对话`;
                console.warn('[模型关联]', errorMsg);
                statusElement.textContent = errorMsg;
                statusElement.style.color = '#dc3545';
                return;
            }

            // 检查必要的字段
            if (!currentAssistantInfo.evaluationSessionId || !currentAssistantInfo.id) {
                const errorMsg = `Assistant ${assistantType}信息不完整`;
                console.error('[模型关联]', errorMsg, currentAssistantInfo);
                statusElement.textContent = errorMsg;
                statusElement.style.color = '#dc3545';
                return;
            }

            // 创建关联信息
            const holdChatConvertion = {
                id: currentAssistantInfo.evaluationSessionId, // evaluationSessionId
                modelId: modelId,
                mode: 'battle', // battle模式支持A和B
                modality: 'chat',
                userMessageId: findUserMessageId(currentAssistantInfo),
                modelAMessageId: currentAssistantInfo.id,
                assistantType,
            };

            console.log('[模型关联] 创建的关联信息:', holdChatConvertion);

            // 保存到本地存储
            const holdChatConvertionArray = getHoldChatConvertionArray(modelId);
            console.log('[模型关联] 当前模型的关联数组:', holdChatConvertionArray);
            
            // 检查是否已存在
            const existingIndex = holdChatConvertionArray.findIndex(
                item => item.id === holdChatConvertion.id
            );
            
            if (existingIndex >= 0) {
                // 更新现有记录
                holdChatConvertionArray[existingIndex] = holdChatConvertion;
                statusElement.textContent = '关联信息已更新';
                console.log('[模型关联] 更新了现有记录');
            } else {
                // 添加新记录
                if (holdChatConvertionArray.length >= 20) {
                    holdChatConvertionArray.shift();
                }
                holdChatConvertionArray.push(holdChatConvertion);
                statusElement.textContent = '关联成功';
                console.log('[模型关联] 添加了新记录');

                const cachedProcessedIds = getProcessedAssistantIdsFromCache();
                processedAssistantIds = new Set(cachedProcessedIds);
                processedAssistantIds.add(currentAssistantInfo.id);
                // 保存到浏览器缓存
                saveProcessedAssistantIdsToCache(processedAssistantIds);
            }

            statusElement.style.color = '#28a745';

            // 保存到localStorage
            const storageKey = 'holdChatConvertionArray' + modelId;
            localStorage.setItem(storageKey, JSON.stringify(holdChatConvertionArray));
            console.log('[模型关联] 已保存到localStorage:', storageKey);

            // 发送日志
            sendLog(`手动关联Assistant ${assistantType}到模型: ${modelId}, 会话ID: ${holdChatConvertion.id}`);
            
            // 更新会话数据
            sendUpdateSessionData();

            log(`Assistant ${assistantType}模型关联完成:`, holdChatConvertion);

        } catch (error) {
            console.error('[模型关联] 处理错误:', error);
            log('模型关联处理错误:', error);
            statusElement.textContent = '关联失败: ' + error.message;
            statusElement.style.color = '#dc3545';
        }
    }


    // 处理流式响应并转发到WebSocket
    async function handleStreamResponse(response) {
        try {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    log('[UI模拟] Stream complete');
                    sendFinishResponse('');
                    isProcessing = false;
                    currentPromptData = null;
                    break;
                }
                
                const chunk = decoder.decode(value, {stream: true});
                sendResponse(chunk);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigateToHome();
        } catch (error) {
            console.error('[UI模拟] 处理流式响应错误:', error);
            sendError(error.message);
            isProcessing = false;
            currentPromptData = null;
            navigateToHome();
        }
    }

    // 通过UI模拟操作处理prompt
    async function simulatePromptInUI(data) {
        try {
            isProcessing = true;
            log('[UI模拟] 开始通过UI模拟处理prompt');
            
            // 等待页面元素加载
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 1. 获取textarea元素
            const textarea = document.querySelector('textarea.bg-surface-primary[name="message"][placeholder="Ask anything…"]');
            if (!textarea) {
                log('[UI模拟] 未找到textarea元素');
                sendError('未找到textarea元素');
                isProcessing = false;
                currentPromptData = null;
                // 等待0.5秒后跳转到新页面
                setTimeout(() => {
                    window.location.href = refresh_page_url;
                }, 500);
                return;
            }
            
            log('[UI模拟] 找到textarea元素，准备填入提示词');
            
            // 2. 填入提示词 - 使用React兼容的方式
            textarea.focus();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 使用原生setter设置值
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;
            nativeTextAreaValueSetter.call(textarea, 'hello');
            
            // 触发多种事件以确保React识别变化
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
            textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' }));
            
            // 等待React状态更新
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 3. 查找并点击提交按钮
            const submitButton = document.querySelector('button[type="submit"]');
            if (!submitButton) {
                log('[UI模拟] 未找到提交按钮');
                sendError('未找到提交按钮');
                isProcessing = false;
                currentPromptData = null;
                // 等待0.5秒后跳转到新页面
                setTimeout(() => {
                    window.location.href = refresh_page_url;
                }, 500);
                return;
            }
            
            // 检查按钮是否可用
            if (submitButton.disabled) {
                log('[UI模拟] 提交按钮仍然是禁用状态，尝试再次触发事件');
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            log('[UI模拟] 找到提交按钮，准备点击');
            simulateRealClick(submitButton);
            
            // 等待请求发送，响应会在monitorAllRequests中被拦截处理
            log('[UI模拟] 已点击提交按钮，等待响应拦截');
            
        } catch (error) {
            log('[UI模拟] 处理prompt错误:', error);
            sendError(error.message);
            isProcessing = false;
            currentPromptData = null;
        }
    }

    // 自动获取recaptchaV3Token的流程
    async function autoFetchRecaptchaToken() {
        try {
            log('[Token获取] 开始自动获取recaptchaV3Token流程');
            
            // 等待页面元素加载
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 1. 获取textarea元素
            const textarea = document.querySelector('textarea.bg-surface-primary[name="message"][placeholder="Ask anything…"]');
            if (!textarea) {
                log('[Token获取] 未找到textarea元素');
                navigateToHome();
                return;
            }
            
            log('[Token获取] 找到textarea元素，准备填入内容');
            
            // 2. 填入提示词 "hello" - 使用React兼容的方式
            // 先聚焦到textarea
            textarea.focus();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 使用原生setter设置值（适用于React）
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;
            nativeTextAreaValueSetter.call(textarea, '为什么人类探索太空的进度超过海洋？');
            
            // 触发多种事件以确保React识别变化
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
            textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' }));
            
            // 等待React状态更新
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 3. 查找并点击提交按钮
            const submitButton = document.querySelector('button[type="submit"][data-sentry-element="Button"]');
            if (!submitButton) {
                log('[Token获取] 未找到提交按钮');
                return;
            }
            
            // 检查按钮是否可用
            if (submitButton.disabled) {
                log('[Token获取] 提交按钮仍然是禁用状态，尝试再次触发事件');
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            log('[Token获取] 找到提交按钮，准备点击');
            simulateRealClick(submitButton);
            
            // 等待请求发送和token获取
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            if (recaptchaV3Token) {
                log('[Token获取] Token获取流程完成，Token:', recaptchaV3Token.substring(0, 20) + '...');
            } else {
                log('[Token获取] Token获取流程完成，但未能获取到Token');
            }
            
        } catch (error) {
            console.error('[Token获取] 自动获取Token流程出错:', error);
        }
    }

    // 初始化
    function init() {
        log('油猴脚本初始化');

        // 注入CSS样式
        injectStyles();
        log('CSS样式已注入');

        // 启用网络监控（调试用，可注释掉）
        // if (window.location.href.includes('debug=true'))
        {
            monitorAllRequests();
            log('网络监控已启用');
        }

        connectWebSocket();

        // 监听页面变化，确保元素存在
        const observer = new MutationObserver(() => {
//            log('页面元变换');
            const textarea = document.querySelector('textarea[name="text"][placeholder="Ask anything…"]');
            const button = document.querySelector('button[type="submit"][data-sentry-element="Button"]');
            if (textarea && button) {
                log('页面元素已就绪');
            }else{
                if(textarea){
                    log('⚠️页面元素未找到 textarea');
                }
                if(button){
                    log('⚠️页面元素未找到 button');
                }
            }

            // 检测Assistant元素（A和B）
            detectAndHandleAssistants();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检测Assistant元素
        setTimeout(() => {
            detectAndHandleAssistants();
        }, 1000);

        // // 页面加载后自动执行获取Token流程
        // setTimeout(() => {
        //     autoFetchRecaptchaToken();
        // }, 3000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();