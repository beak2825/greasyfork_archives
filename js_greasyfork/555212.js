// ==UserScript==
// @name         UOOC 学习助手_szu_v2
// @namespace    https://github.com/xiaochai-123
// @version      1.4.2
// @description  自动静音、二倍速、失焦不断播、自动连播、自动答题(视频中非测验)。递归可开关，修复直接跳过首测验视频小节的bug。
// @license      GPL
// @match        *://uooc.net.cn/home/learn/index*
// @match        *://www.uooc.net.cn/home/learn/index*
// @match        *://uooconline.com/home/learn/index*
// @match        *://www.uooconline.com/home/learn/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555212/UOOC%20%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B_szu_v2.user.js
// @updateURL https://update.greasyfork.org/scripts/555212/UOOC%20%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B_szu_v2.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 配置常量
    const CONFIG = {
        playbackRate: 2,
        interval: {
            player: 500,
            cleaner: 800,
            quiz: 500,
            logic: 800
        }
    };

    // 自动播放和倍速静音
    function keepPlaying() {
        const video = document.getElementById("player_html5_api");
        if (video) {
            // 优化：仅在状态不一致时修改，减少DOM操作开销
            if (!video.muted) video.muted = true;
            if (video.playbackRate !== CONFIG.playbackRate) video.playbackRate = CONFIG.playbackRate;
            if (video.paused && !video.ended) {
                video.play().catch(() => {}); // 捕获在此处可能产生的Promise报错
            }
        }
        const playBtn = document.querySelector(".vjs-big-play-button");
        if (playBtn && playBtn.style.display !== 'none') {
            playBtn.click();
        }
    }
    setInterval(keepPlaying, CONFIG.interval.player);

    // 强力弹窗和遮罩清理函数
    setInterval(() => {
        let hasSmartVerification = false;
        document.querySelectorAll('.layui-layer').forEach(layer => {
            const layerText = layer.innerText || '';
            // 关键词检测
            if (['验证', '智能', '提交'].some(kw => layerText.includes(kw)) || layer.querySelector('.layui-layer-btn')) {
                hasSmartVerification = true;
            }
        });

        if (!hasSmartVerification) {
            document.querySelectorAll('.layui-layer-shade').forEach(e => e.remove());
            document.querySelectorAll('.layui-layer.layui-layer-page').forEach(e => {
                const layerText = e.innerText || '';
                if (!['验证', '智能', '提交'].some(kw => layerText.includes(kw))) {
                    e.remove();
                }
            });
            document.querySelectorAll('.vjs-mask').forEach(e => e.remove());
            
            let quizDom = document.querySelector(".smallTest-view");
            if (quizDom && quizDom.offsetTop > 600) {
                quizDom.style.display = "none";
            }
        }
    }, CONFIG.interval.cleaner);

    // 自动答题
    let lastQuizQuestion = null;
    function autoAnswerQuiz() {
        let quizLayer = document.querySelector("#quizLayer");
        if (quizLayer && quizLayer.style.display !== "none") {
            try {
                let videoDiv = document.querySelector("div[uooc-video]");
                if (!videoDiv) return;
                
                let source = videoDiv.getAttribute("source");
                if (!source) return;
                
                let quizList = JSON.parse(source).quiz || [];
                let quizQuestionElem = document.querySelector(".smallTest-view .ti-q-c");
                if (!quizQuestionElem) return;
                
                let quizQuestion = quizQuestionElem.innerHTML.trim();

                if (lastQuizQuestion === quizQuestion && quizLayer.classList.contains("answered")) {
                    return;
                }

                let quizIndex = quizList.findIndex(q => q.question === quizQuestion);
                if (quizIndex === -1) return;
                
                // 注意：平台数据通常是原始JS字符串，eval在此处必须保留
                let quizAnswer = eval(quizList[quizIndex].answer);
                let quizOptions = quizLayer.querySelector("div.ti-alist");
                
                if (quizOptions) {
                    for (let ans of quizAnswer) {
                        let labelIndex = ans.charCodeAt() - "A".charCodeAt();
                        // 增加安全校验
                        let opt = quizOptions.children[labelIndex];
                        if (opt) opt.click();
                    }
                    let btn = quizLayer.querySelector("button");
                    if (btn) btn.click();
                    
                    quizLayer.classList.add("answered");
                    lastQuizQuestion = quizQuestion;
                    console.log("自动答题已完成:", quizQuestion, quizAnswer.toString());
                }
            } catch (error) {
                console.log("自动答题发生错误:", error);
            }
        } else {
            lastQuizQuestion = null;
            let answeredLayer = document.querySelector("#quizLayer.answered");
            if (answeredLayer) answeredLayer.classList.remove("answered");
        }
    }
    setInterval(autoAnswerQuiz, CONFIG.interval.quiz);

    // ======= 递归连播开关和核心 =======
    let autoRecursiveFlag = false;

    // 创建控制按钮（样式优化）
    function createControlBtn() {
        let btn = document.createElement("button");
        btn.innerText = "递归上课：关闭";
        Object.assign(btn.style, {
            position: "fixed",
            top: "140px",
            right: "30px",
            zIndex: "9999",
            background: "#00796b",
            color: "#fff",
            border: "none",
            padding: "11px 22px",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            userSelect: "none"
        });
        
        btn.onclick = function () {
            autoRecursiveFlag = !autoRecursiveFlag;
            btn.innerText = "递归上课：" + (autoRecursiveFlag ? "开启" : "关闭");
            if (autoRecursiveFlag) {
                startUltimateCourseRush();
            }
        };
        document.body.appendChild(btn);
    }
    createControlBtn();

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function clearShader() {
        let hasSmartVerification = false;
        document.querySelectorAll('.layui-layer').forEach(layer => {
            const layerText = layer.innerText || '';
            if (['验证', '智能', '提交'].some(kw => layerText.includes(kw)) || layer.querySelector('.layui-layer-btn')) {
                hasSmartVerification = true;
            }
        });

        if (!hasSmartVerification) {
            document.querySelectorAll("div.layui-layer-shade").forEach(shader => shader.remove());
            document.querySelectorAll('.vjs-mask').forEach(e => e.remove());
        }
    }

    function findCurrentVideoNode() {
        return document.querySelector('.basic.active') || 
               document.querySelector('.video-list li.current, .chapter-list li.current, .menu li.current, li.active, li.selected');
    }

    function findNextVideoInSameChapter(currentNode) {
        if (!currentNode) return null;
        let chapterContainer = currentNode.closest('ul, .chapter-list, .video-list');
        if (!chapterContainer) return null;
        
        let allVideoNodes = Array.from(chapterContainer.querySelectorAll('li, .basic'));
        let currentIndex = allVideoNodes.indexOf(currentNode);
        
        if (currentIndex === -1 || currentIndex >= allVideoNodes.length - 1) {
            return null;
        }
        
        for (let i = currentIndex + 1; i < allVideoNodes.length; i++) {
            let nextNode = allVideoNodes[i];
            // 增加空值检查
            if (nextNode.querySelector('.icon-video, span.icon-video') || (nextNode.classList.contains('taskpoint') && !nextNode.innerText.includes("测验"))) {
                return nextNode;
            }
        }
        return null;
    }

    function playNextVideoInChapter() {
        let current = findCurrentVideoNode();
        let next = findNextVideoInSameChapter(current);
        if (next) {
            let clickTarget = next.querySelector('a') || next;
            clickTarget.click();
            setTimeout(() => {
                const video = document.getElementById('player_html5_api');
                if (video) {
                    video.muted = true;
                    video.playbackRate = CONFIG.playbackRate;
                    video.play().catch(() => {});
                }
            }, 1000);
            return true;
        }
        return false;
    }

    function waitForVideoCompletion() {
        return new Promise(resolve => {
            const video = document.getElementById('player_html5_api');
            if (!video) {
                resolve();
                return;
            }
            video._recursiveResolve = resolve;
            video.onended = function() {
                setTimeout(() => {
                    if (video._recursiveResolve) {
                        video._recursiveResolve();
                    }
                }, 1500);
            };
            video.muted = true;
            video.playbackRate = CONFIG.playbackRate;
            
            const playBtn = document.querySelector(".vjs-big-play-button");
            if (playBtn) playBtn.click();
            
            setTimeout(() => {
                if (video.ended && video._recursiveResolve) {
                    video._recursiveResolve();
                }
            }, 500);
        });
    }

    function findCurrentChapter() {
        const currentVideoNode = findCurrentVideoNode();
        if (!currentVideoNode) return null;
        let node = currentVideoNode;
        while (node && node.parentElement) {
            if (node.parentElement.classList.contains('rank-1') || node.classList.contains('rank-1-item')) {
                return node;
            }
            node = node.parentElement;
        }
        return null;
    }

    async function searchUncompleteFromCurrentChapter() {
        const catalogRoot = document.querySelector("ul.rank-1");
        if (!catalogRoot) return;
        
        const chapters = Array.from(catalogRoot.children);
        const currentChapter = findCurrentChapter();
        let startIndex = 0;
        
        if (currentChapter) {
            startIndex = chapters.indexOf(currentChapter);
            if (startIndex === -1) startIndex = 0;
        }
        
        for (let i = startIndex; i < chapters.length; i++) {
            await checkActive(chapters[i]);
        }
    }

    async function checkActive(catalog) {
        if (!catalog) return;
        let children = catalog.children;
        let elem = catalog.firstElementChild;
        
        // 展开章节
        if (elem) {
            let iElement = elem.getElementsByTagName("i")[0];
            if (iElement && iElement.classList.contains("icon-xiangxia")) {
                elem.click();
            }
            await sleep(500);
        }
        
        for (let i = 1; i < children.length; i++) {
            const child = children[i];
            if (child.tagName === "DIV") {
                // 仅选择直接子元素，避免深度查询
                const resources = Array.from(child.querySelectorAll(':scope > .basic'));
                for (let r of resources) {
                    if (r.classList.contains('complete')) continue;
                    
                    let nameSpan = r.querySelector('.tag-source-name');
                    let nameText = nameSpan ? (nameSpan.innerText || '') : '';
                    
                    if (nameSpan && nameSpan.classList.contains('taskpoint') && nameText.includes('测验')) {
                        continue;
                    }
                    
                    if (r.querySelector('.icon-video') || /视频/.test(nameText)) {
                        r.click();
                        clearShader();
                        await waitForVideoCompletion();
                        while (playNextVideoInChapter()) {
                            await waitForVideoCompletion();
                        }
                        return; // 完成一个视频序列后返回上一层继续
                    }
                }
            } else if (child.tagName === "UL") {
                await searchUncomplete(child);
            }
        }
    }

    async function searchUncomplete(query) {
        if (!query) return;
        let catalog = query.children;
        for (let i = 0; i < catalog.length; i++) {
            await checkActive(catalog[i]);
        }
    }

    async function startUltimateCourseRush() {
        if (!autoRecursiveFlag) return;
        await searchUncompleteFromCurrentChapter();
    }

    function bindVideoEnded() {
        const video = document.getElementById('player_html5_api');
        if (video && !video._autoNextBound) {
            video._autoNextBound = true;
            video.onended = function () {
                if (autoRecursiveFlag) {
                    // 如果无法播放同章下一个，则触发递归寻找下一章
                    if (!playNextVideoInChapter()) {
                        setTimeout(() => { startUltimateCourseRush(); }, 1500);
                    }
                }
            };
        }
    }

    // 核心初始化逻辑 - 替换掉了 $(document).ready
    function init() {
        console.log("UOOC 学习助手 v1.4.2 已加载");
        setTimeout(() => { 
            if (autoRecursiveFlag) startUltimateCourseRush(); 
        }, 1000);

        // 递归保护循环
        setInterval(async function () {
            if (autoRecursiveFlag) {
                const video = document.getElementById('player_html5_api');
                // 增加判断：如果当前没有激活的节点，也尝试启动递归（防止卡死）
                if ((!video || video.ended) && !document.querySelector(".basic.active")) {
                    await startUltimateCourseRush();
                }
            }
        }, CONFIG.interval.logic);

        setInterval(bindVideoEnded, CONFIG.interval.logic);
    }

    // 原生 DOM Ready 检测
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();