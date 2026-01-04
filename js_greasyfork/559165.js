// ==UserScript==
// @name         courseStudy
// @namespace    http://tampermonkey.net/
// @version      2025-12-17.4
// @description  武汉人社继续教育自动添加课程工具
// @description:zh-CN  武汉人社继续教育自动添加课程工具
// @author       Marshmallow
// @match        https://szrs.rsj.wuhan.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559165/courseStudy.user.js
// @updateURL https://update.greasyfork.org/scripts/559165/courseStudy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var message,continueButton;
    var showMsg = function(){
        var base64String = "data:image/jpeg;base64,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";

        // -------------------------------------------------------------
        // 1. 创建容器元素 (div#gratitude-container)
        // -------------------------------------------------------------
        const container = document.createElement('div');
        container.id = 'gratitude-container';
        container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* 半透明背景 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000; /* 确保它在最上层 */
`;

        // 2. 创建内容卡片 (div#content-card)
        const card = document.createElement('div');
        card.style.cssText = `
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 90%;
    transform: scale(1);
    transition: transform 0.3s ease-out;
`;
        card.id = 'content-card';

        // 3. 创建图片元素 (img)
        const imageElement = document.createElement('img');
        imageElement.src = base64String;
        imageElement.alt = "打赏二维码";
        imageElement.style.cssText = `
    max-width: 650px;
    height: auto;
    display: block;
    margin: 0 auto 15px;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
`;
        imageElement.id = 'base64-image-js';

        // 4. 创建文本元素 (p)
        message = document.createElement('p');
        message.textContent = "运行中，需要约30秒......学习不易，感谢打赏!";
        message.style.cssText = `
    font-size: 1.5em;
    color: #d9534f; /* 醒目的红色 */
    margin-bottom: 25px;
    font-weight: bold;
`;
        message.id = 'gratitude-message';


        // 5. 创建“继续”按钮 (button)
        continueButton = document.createElement('button');
        continueButton.textContent = "继续";
        continueButton.style.cssText = `
    padding: 10px 30px;
    font-size: 18px;
    cursor: pointer;
    background-color: #5cb85c; /* 绿色按钮 */
    color: white;
    border: none;
	display:none;
    border-radius: 5px;
    transition: background-color 0.3s;
`;
        continueButton.id = 'continue-button-js';

        // -------------------------------------------------------------
        // 6. 定义按钮事件和插入逻辑
        // -------------------------------------------------------------

        continueButton.onclick = function() {
            // 点击后淡出并移除整个容器
            card.style.transform = 'scale(0.8)';
            container.style.opacity = '0';

            // 延时移除，使淡出效果可见
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 300);

            console.log("用户已点击继续按钮，容器已移除。");

            // ⚠️ 在这里执行点击“继续”后需要执行的业务逻辑
            // 例如： window.location.href = 'next_step.html';
            // 例如： startNextCourseTask();
        };

        // 7. 组合所有元素
        card.appendChild(imageElement);
        card.appendChild(message);
        card.appendChild(continueButton);
        container.appendChild(card);

        // 8. 将整个容器添加到页面的 body 中
        document.body.appendChild(container);
    }


    // ----------------------------------------------------------------------
    // 核心逻辑：重写浏览器原生的 XMLHttpRequest 对象
    // ----------------------------------------------------------------------

    // 1. 备份原本的 open 和 send 方法，防止把浏览器搞坏
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const token = window.sessionStorage.getItem("token");
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    var directoryId = "";

    // 2. 重写 open 方法：主要目的是为了记录下当前请求的 URL
    XMLHttpRequest.prototype.open = function(method, url) {
        // 将 url 保存到当前 xhr 对象的临时属性 _url 中
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    // 3. 重写 send 方法：这是拦截数据的关键
    XMLHttpRequest.prototype.send = function(body) {
        // 在请求发送前，给自己绑定一个 'load' 事件监听器
        // 当服务器数据返回完成时，这个监听器会触发
        this.addEventListener('load', function() {
            // 检查 URL 是否包含我们要找的关键字 'getCourseList'
            if (this._url && this._url.includes('getCourseList') && this._url.includes('directoryId=')) {
                console.log('%c [拦截成功] 发现目标接口请求:', 'color:red; font-weight:bold;', this._url);

                try {
                    // this.responseText 就是服务器返回的原始字符串数据
                    const responseText = this.responseText;

                    // 尝试将其解析为 JSON 对象
                    const jsonData = JSON.parse(responseText);

                    // --- 在控制台打印数据 ---
                    console.log('▼▼▼▼▼▼▼▼▼▼ 返回的数据如下 ▼▼▼▼▼▼▼▼▼▼');
                    parseData(jsonData);
                    console.log('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲');

                } catch (err) {
                    console.error('数据拦截到了，但解析 JSON 失败:', err);
                    console.log('原始文本:', this.responseText);
                }
            }
            if (this._url && this._url.includes('jxchannelanddirectory/getAdminDiretoryList')) {
                console.log('%c [拦截成功] 发现目标接口请求:', 'color:red; font-weight:bold;', this._url);

                try {
                    // this.responseText 就是服务器返回的原始字符串数据
                    const responseText = this.responseText;

                    // 尝试将其解析为 JSON 对象
                    const jsonData = JSON.parse(responseText);

                    // --- 在控制台打印数据 ---
                    console.log('▼▼▼▼▼▼▼▼▼▼ 返回的数据如下 ▼▼▼▼▼▼▼▼▼▼');
                    const courseIdList1 = jsonData.data.list.map(item => item.channelId);
                    directoryId = courseIdList1[0];
                    console.log(directoryId);
                    console.log('▲▲▲▲▲▲▲▲▲ 读取directoryId为' + directoryId);

                } catch (err) {
                    console.error('数据拦截到了，但解析 JSON 失败:', err);
                    console.log('原始文本:', this.responseText);
                }
            }
        });

        // 既然监听器绑好了，那就让请求正常发出去
        return originalSend.apply(this, arguments);
    };

    var addCourse=async function(courseIdList){
        const urladd = "https://szrs.rsj.wuhan.gov.cn/jxjy-ui/jxjy/declare/jxusercoursemanage/addUserCourse";
        // 1. 准备请求体数据
        const requestBody = courseIdList; // 直接使用数组作为请求体
        const response44 = await fetch(urladd, {
            method: "POST",
            headers: {
                // 认证 Token
                "Authorization": token,
                // 明确告知服务器请求体是 JSON 格式
                "Content-Type": "application/json;charset=UTF-8"
            },
            // 3. 将 JavaScript 对象/数组转换为 JSON 字符串
            body: JSON.stringify(requestBody)
        });
        // 5. 解析响应体为 JSON 数据
        const data = await response44.json();
        console.log("添加学习课程" + courseIdList );
    }

    var studyCourse=async function(courseIdList){
        for (const currentCourseId of courseIdList) {
            await sleep(1000);

            // C. 拼接 GET 请求地址
            const getUrl = `https://szrs.rsj.wuhan.gov.cn/jxjy-ui/jxjy/declare/jxcourse/getCourseInfo?courseId=${currentCourseId}`;

            console.log(`🔍 正在获取课程信息... ID: ${currentCourseId}`);

            // D. 发起 GET 请求
            fetch(getUrl, {
                method: "GET",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json;charset=UTF-8"
                }
            })
            // 1. 处理 Response 对象，将其转换为 JSON
            .then(response => {
                // 检查 HTTP 状态码，例如 401/404/500
                if (!response.ok) {
                    throw new Error(`HTTP 错误！状态码: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                const { courseId, studyTime } = json.data;
                if (courseId && studyTime) {
                    console.log(`📄 获取成功：courseId=${courseId}, studyTime=${studyTime}`);

                    // F. 调用之前的 updateStudyRecord 函数
                    //updateStudyRecord(courseId, studyTime);
                    const baseUrl = "https://szrs.rsj.wuhan.gov.cn/jxjy-ui/jxjy/declare/jxusercoursemanage/updateStudyRecord";
                    const url = `${baseUrl}?courseId=${courseId}&userStudyTime=${studyTime}`;
                    fetch(url, {
                        method: "PUT",
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json;charset=UTF-8"
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                        console.log("✅ 更新成功！服务器返回:", data);
                    })
                        .catch(err => console.error("❌ 更新请求出错:", err));
                }
            }).catch(err => {
                console.error("❌ 获取课程信息出错:", err);
            });
        }
        continueButton.style.display = "";
        message.textContent = "当页课程学习完成，可以直接考试!";
    }

    var parseData = function(jsonData){
        const courseIdList = jsonData.data.list.map(item => item.courseId);
        showMsg();
        addCourse(courseIdList);
        studyCourse(courseIdList);
        
    }

    console.log("XHR 拦截器已注入，正在监听 getCourseList...");
})();