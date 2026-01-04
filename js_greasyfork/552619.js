// ==UserScript==
// @name         自动化用例失败分析
// @namespace    https://orthogonalandparallel.github.io/
// @version      1.0
// @description  公司白盒自动化用例失败分析
// @author       JinChen
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @match        https://c2.yonyoucloud.com/iuap-yyc-yontest/task/log/execApiLog


// @downloadURL https://update.greasyfork.org/scripts/552619/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%94%A8%E4%BE%8B%E5%A4%B1%E8%B4%A5%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/552619/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%94%A8%E4%BE%8B%E5%A4%B1%E8%B4%A5%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 毛玻璃拖动框 */
        .custom-glass {
            position: fixed !important;
            top: 500px;
            left: 500px;
            transform: translate(-50%, -50%);
            height: 300px;
            width: 500px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow:
                inset -0.75px -0.5px rgba(255, 255, 255, 0.1),
                inset +0.75px +0.5px rgba(255, 255, 255, 0.025),
                3px 2px 10px rgba(0, 0, 0, 0.25),
                inset 0px 0px 10px 5px rgba(255, 255, 255, 0.025),
                inset 0px 0px 40px 5px rgba(255, 255, 255, 0.025);
            position: relative;
            border-radius: 5px;
            overflow: hidden;
            z-index: 9999;
        }

        .custom-drag-me {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 44px;
            background-color: rgba(12, 13, 14, 0.75);
            color: rgba(255, 255, 255, 1);
            cursor: move;
        }

        .custom-close-btn {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .custom-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        .custom-fix-btn {
            position: absolute;
            left: 50%;
            bottom: 10px;
            transform: translateX(-50%);
            padding: 8px 16px;
            border-radius: 4px;
            background-color: rgba(12, 13, 14, 0.75);
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            border: none;
            outline: none;
        }

        .custom-fix-btn:hover {
            background-color: rgba(255, 9, 42, 0.8);
        }

        .custom-content {
            padding: 10px;
            height: calc(100% - 44px);
            overflow: hidden;
            position: relative;
        }
        .custom-content textarea {
            width: 100%;
            height: calc(100% - 50px);
            resize: none;
            border: none;
            outline: none;
            background: #0000000a;
        }

    `;
    document.head.appendChild(style);

    // ------- 页面元素 begin -------

    const domainUrl = 'https://c2.yonyoucloud.com' // https://c2.yonyoucloud.com https://yct.yyuap.com

    let glass = null;
    let recordListCache = []

    // 创建并显示结果窗口
    function createAndShowResultWindow() {
        if (!glass) {
            // 创建毛玻璃窗口
            glass = document.createElement('div');
            glass.className = 'custom-glass ignore';

            const dragMe = document.createElement('div');
            dragMe.className = 'custom-drag-me';
            dragMe.textContent = '失败用例结果分析';
            glass.appendChild(dragMe);

            // 添加关闭按钮
            const closeBtn = document.createElement('div');
            closeBtn.className = 'custom-close-btn';
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', () => {
                glass.style.display = 'none';
            });
            dragMe.appendChild(closeBtn);

            // 创建内容区域
            const content = document.createElement('div');
            content.className = 'custom-content';

            // 创建文本框
            const textarea = document.createElement('textarea');
            textarea.id = 'output';
            textarea.rows = 20;
            textarea.cols = 50;
            textarea.readOnly = true;
            textarea.style.resize = 'none';

            // 添加一键错误修正按钮
            const fixBtn = document.createElement('button');
            fixBtn.className = 'custom-fix-btn';
            fixBtn.textContent = '一键错误修正';
            fixBtn.addEventListener('click', () => {
                // TODO: 在这里添加错误修正的逻辑
                console.log('点击了一键错误修正按钮');

                const cookie = '_WorkbenchCross_=Ultraman; loginLocale=en_US; debugger=1; yht_username_yht-server=ST-154678960-xuMsgRupSiSg2hvz9OOb-online__2a063dd6-7931-41b2-85ff-45e2939cf1d9; yht_username=ST-154678960-xuMsgRupSiSg2hvz9OOb-online__2a063dd6-7931-41b2-85ff-45e2939cf1d9; yht_usertoken_yht-server=SybCRs2Eg9U4OULbU11JBmIHNZBihcD9b%2B6PVXzn8lpR%2F161ZY9mG1ELL9RSdlS3jdQhvZTT4t4fIHwYhnzOzA%3D%3D; com.yonyou.yht.web.utils.CookieLocaleResolver.LOCALE=zh-CN; JSESSIONID=0000GX90I1E889KhrnmODO1ryBs8n9SlRcaujDIuyTQfK0wLe9Oavgs8bMJCUecXniC7:896ae5b3-05b8-4074-8c42-5cc3dd0627fd; yht_access_token=bttTmUwUUlXR1FEUmI3TU5VQnRYeWxvQWRmT0pxY2V4Vk8xN0VBYU1rRlR2NHk5VlpoWXd4WkR0VFBqWmFlTzN1dV9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__017ae6a003622bb3e71e7eb6037a3a7d_1748590319366TGTGdccore0iuap-apcom-workbencha829b8cbYT; multilingualFlag=true; timezone=UTC+08:00; language=001; locale=zh_CN; orgId=""; defaultOrg=""; tenantid=jqilbhs8; theme=""; languages=1_3-2_1-3_1; newArch=true; sysid=diwork; defaultLocale=zh_CN; a00=LKIyf97QgNYvyiIPKKrFHo0PVn4ped79N_9TzbB7KmhqcWlsYmhzOGAzMzkzNzA3MzE1NTQ5Nzc2YGpxaWxiaHM4YDJhMDYzZGQ2LTc5MzEtNDFiMi04NWZmLTQ1ZTI5MzljZjFkOWAxYGBlOTlkYjNlNzkwOWJgYGAyMjA0MDY2NzMyNzE5OTk2OTMzYGZhbHNlYGAxNzQ4NTkwMzE5MzgxYHltc3NlczplZTY4YzFhODljNjM4NGMwNTNlZTgzYTYwYjQ4NTZiMGBkaXdvcmtg; n_f_f=false; c800=dccore0; yht_username_diwork=ST-1559404-rrm4fdncbepG3nbERcyH-online__2a063dd6-7931-41b2-85ff-45e2939cf1d9; yht_usertoken_diwork=rLn%2BpJQPLrrhNdQKujzNPdo%2F%2FL%2BK1DyYHRa6WYOCg3n%2FPFIA%2B%2FkHAzcp0JUG3kjRRJlFouWIMBcvV6%2BjyKwiUA%3D%3D; acw_tc=1a0c638e17485910289983293e0073f84d0e84008bbb3b099e471e387df263; a10=MjgxNDQ4MDIyNzg3NjgxMjM1NDE; XSRF-TOKEN=MDF_D1R5FGJLF9MQJ1S342ETB8XDO!160306; UBA_LAST_EID=shdklaair1f8';

                // 创建接口映射表
                const interfaceMap = new Map();
                // 用例ID
                let testCaseId = recordListCache[0].ext.testCaseId
                // 列出用例接口
                let listInterfaceUrl = domainUrl + '/iuap-yyc-yontest/case/interface/apiCase/detail?id=' + testCaseId + '&billnum=yontest_caseTreeTable&serviceCode=YYCTCW&terminalType=1&fromYonyou=true&busiObj=yontest_case&locale=zh_CN&isDistinct=true'
                let listInterfaceResp = sendGetRequest(listInterfaceUrl, cookie)
                // 构建映射关系
                let listInterfaceRespObj = JSON.parse(listInterfaceResp)
                if (listInterfaceRespObj?.data?.interfaceVoList) {
                    for (const interfaceItem of listInterfaceRespObj.data.interfaceVoList) {
                        interfaceMap.set(interfaceItem.title, interfaceItem.id);
                    }
                }
                // 遍历用例接口列表
                for (const recordCache of recordListCache) {
                    // 用例ID
                    testCaseId = recordCache.ext.testCaseId
                    // 接口名称
                    let interfaceName = recordCache.name
                    /*
                    if (interfaceName !== '大供应链_iuap-api-gateway_yonbip_QMS_QIT_inspectorder_update_更新(update)_250526135624803') {
                        continue
                    }
                    */
                    // 接口ID
                    const caseInterfaceRefId = interfaceMap.get(interfaceName);
                    // 接口断言结果列表
                    let errorDescArr = []
                    let interfaceAssertResultList = recordCache.assertResultVo.interfaceAssertResultList
                    for (const interfaceAssertResult of interfaceAssertResultList) {
                        let desc = interfaceAssertResult.desc.replace(/\(脚本断言\)/, '') // 状态码(脚本断言)
                        let result = interfaceAssertResult.result // 是否成功 true/false
                        if (!result) {
                            errorDescArr.push(desc)
                        }
                    }
                    if (errorDescArr.length == 0) {
                        continue
                    }
                    // 编辑脚本
                    let openScriptUrl = domainUrl + '/iuap-yyc-yontest/case/api/script/list?refId=' + caseInterfaceRefId + '&billnum=yontest_caseTreeTable&serviceCode=YYCTCW&terminalType=1&fromYonyou=true&busiObj=yontest_case&locale=zh_CN&isDistinct=true&domainKey=iuap-yyc-yontest';
                    let openScriptResp = sendGetRequest(openScriptUrl, cookie)
                    let openScriptRespObj = JSON.parse(openScriptResp)
                    // 脚本ID
                    let scriptId = openScriptRespObj.data['2'].id
                    let script = openScriptRespObj.data['2'].script
                    const updatedScript = processScript(errorDescArr, script);
                    console.log('脚本 -- {}' + updatedScript)
                    let scriptEncode = utf8ToBase64(updatedScript);
                    const postData = {
                        "1": {
                            "domainKey": "iuap-yyc-yontest",
                            "type": 2,
                            "caseInterfaceRefId": caseInterfaceRefId,
                            "caseId": testCaseId,
                            "script": "",
                            "runStage": 1
                        },
                        "2": {
                            "domainKey": "iuap-yyc-yontest",
                            "type": 2,
                            "caseInterfaceRefId": caseInterfaceRefId,
                            "caseId": testCaseId,
                            "script": scriptEncode,
                            "runStage": 2,
                            "id": scriptId
                        }
                    };
                    const url = domainUrl + '/iuap-yyc-yontest/case/api/script/save?refId=’ + caseInterfaceRefId + ‘&billnum=yontest_caseTreeTable&serviceCode=YYCTCW&terminalType=1&fromYonyou=true&busiObj=yontest_case&locale=zh_CN&isDistinct=true';
                    let saveResp = sendPostRequest(postData, url, cookie);
                    let saveRespObj = JSON.parse(saveResp)
                    // alert(interfaceName + '------' + saveRespObj.message);
                    let container = document.getElementById('notification-container');
                    if (!container) {
                        container = document.createElement('div');
                        container.id = 'notification-container';
                        container.style.cssText = 'position: fixed; right: 20px; top: 20px; max-height: 80vh; overflow-y: auto; z-index: 9999;';
                        document.body.appendChild(container);
                    }
                    const messageElement = document.createElement('div');
                    messageElement.textContent = interfaceName + '------' + saveRespObj.message;
                    messageElement.style.cssText = 'margin-bottom: 10px; padding: 15px; background: #f0f0f0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    container.appendChild(messageElement);
                    setTimeout(() => messageElement.remove(), 3000);
                }
            });

            // 将元素添加到内容区域
            content.appendChild(textarea);
            content.appendChild(fixBtn)

            // 将内容区域添加到毛玻璃窗口
            glass.appendChild(content);

            const topBody = document.body;
            topBody.appendChild(glass);

            // 初始化拖拽功能
            initDragFeature(dragMe, glass);
        }
        // 显示窗口
        glass.style.display = 'block';
    }

    // ------- 页面元素 end -------


    // ------- 解析用例数据 begin -------

    function utf8ToBase64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }
        ));
    }

    // 处理接口返回数据
    function processApiResponse(response) {
        let msg = [];
        let recordList = response.data.recordList;
        recordListCache = recordList
        for (const record of recordList) {
            msg.push('\n' + record.name + '\n');
            let interfaceAssertResultList = record.assertResultVo.interfaceAssertResultList;
            for (const interfaceAssertResult of interfaceAssertResultList) {
                if (interfaceAssertResult.result == false) {
                    msg.push(interfaceAssertResult.desc + ' -- ' + '期望值：' + interfaceAssertResult.value + ' -- '  + '实际值：' + interfaceAssertResult.actual);
                }
            }
        }
        createAndShowResultWindow();
        const outputElement = document.getElementById('output');
        outputElement.textContent = ''; // 先清空内容
        outputElement.textContent = msg.join('\n'); // 再设置新内容
    }

    // ------- 解析用例数据 end -------

    // ------- 拦截用例数据 begin -------

    // 拦截原生XHR
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    // 拦截 open 方法
    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    // 拦截 send 方法
    XHR.send = function(postData) {
        // 只处理目标URL的POST请求
        if (this._url.includes('/iuap-yyc-yontest/task/log/execApiLog') && this._method === 'POST') {
            // 监听请求完成事件
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    console.log('【油猴】拦截到的请求数据:', {
                        url: this._url,
                        method: this._method,
                        requestData: postData ? JSON.parse(postData) : null,
                        responseData: response
                    });

                    // 这里可以添加你的数据处理逻辑
                    if (response.code === 200) {
                        // 处理成功响应
                        console.log('【油猴】请求成功，数据:', response.data);
                        processApiResponse(response);
                    } else {
                        // 处理错误响应
                        console.log('【油猴】请求失败，错误信息:', response.msg);
                    }
                } catch (error) {
                    console.error('【油猴】数据解析错误:', error);
                }
            });
        }
        return send.apply(this, arguments);
    };

    // ------- 拦截用例数据 end -------


    // ------- 一键修正 end -------

    // 获取第三个参数
    function getThreeParam(line) {
        const regex = /['"]([^'"]+)['"]\);$/;
        const match = line.match(regex);
        if (match && match[1]) {
            return match[1]
        } else {
            console.log("未找到匹配项");
        }

    }

    // 添加注释
    function processScript(errorDescArr, script) {
        const lines = script.split('\n');
        const processedLines = [];

        for (const line of lines) {
            // 检查是否是 assert 语句
            const assertMatch = line.includes('assert');
            // 检查是否是注释
            const assertMatch2 = line.startsWith("//");
            // 匹配 assert 语句，并捕获第三个参数
            const threeParam = getThreeParam(line);
            if (assertMatch && !assertMatch2 && threeParam && errorDescArr.includes(threeParam)) {
                processedLines.push('// ' + line); // 添加注释
            } else {
                processedLines.push(line);
            }
        }
        return processedLines.join('\n');
    }


    /**
     * 发送Post请求
     * @param {Object} postData - 请求数据体
     * @param {string} url - 请求地址
     * @param {string} cookie - 认证凭证
     */
    function sendPostRequest(postData, url, cookie) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, false); // false表示同步请求
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Cookie', cookie);

        try {
            xhr.send(JSON.stringify(postData));
            console.log('请求成功:', xhr.responseText);
            if (xhr.status === 403) {
                alert('权限验证失败，请检查Cookie');
                throw new Error('权限验证失败');
            }
            return xhr.response;
        } catch (error) {
            console.error('请求失败:', error);
            throw error;
        }
    }

    /**
     * 发送Get请求
     * @param {string} url - 请求地址
     * @param {string} cookie - 认证凭证
     */
    function sendGetRequest(url, cookie) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // false表示同步请求
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Cookie', cookie);

        try {
            xhr.send();
            if (xhr.status === 403) {
                alert('权限验证失败，请检查Cookie');
                throw new Error('权限验证失败');
            }
            return xhr.responseText;
        } catch (error) {
            console.error('请求失败:', error);
            throw error;
        }
    }
    // ------- 一键修正 end -------


    // ------- 拖拽功能 begin -------
    // 初始化拖拽功能
    function initDragFeature(dragMe, glass) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        dragMe.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === dragMe) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, glass);
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }
    // ------- 拖拽功能 end -------

})();