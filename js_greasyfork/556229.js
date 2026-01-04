// ==UserScript==
// @name         学堂在线视频自动学习面板脚本
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @license      MIT
// @description  为学堂在线(xuetangx.com/learn/)提供一个操作面板，只播放左侧“饼图未满”的章节；自动 2.0 倍速、静音、循环播放，直到饼图满再跳下一节。
// @author       Yangkunlong + ChatGPT
// @match        *://www.xuetangx.com/learn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556229/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E9%9D%A2%E6%9D%BF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556229/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E9%9D%A2%E6%9D%BF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    var index = 0;                  // 当前正在播放的章节索引（对应 lists 的下标）
    var runIt;                      // 定时器
    var lists;                      // 左侧章节列表（class="third"）
    var dragElement;                // 操作面板 DOM
    var replayCountMap = {};        // 每节的重播次数，防止死循环
    var isCheckingProgress = false; // 防止重复触发当前节的进度检查
    var pendingCheckIndex = null;   // 记录哪一节需要在切章后检查饼图
    var isRefreshingPie = false;    // 正在“切章刷新饼图”的过程中，避免重复触发

    // --- UI/操作面板 相关函数 ---

    /**
     * 构建操作面板的HTML和CSS，并使其可拖动
     */
    function createPanel() {
        // CSS 样式
        const panelStyle = `
            #gemini-automation-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 320px;
                background-color: #fff;
                border: 1px solid #ccc;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                border-radius: 8px;
                overflow: hidden;
                font-size: 13px;
            }
            #gemini-panel-header {
                cursor: move;
                background-color: #007bff;
                color: white;
                padding: 10px;
                border-bottom: 1px solid #0056b3;
                font-weight: bold;
                user-select: none;
            }
            #gemini-automation-panel button {
                transition: background-color 0.3s;
            }
            #gemini-automation-panel button:hover {
                background-color: #1e7e34 !important;
            }
        `;

        // 插入 CSS
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = panelStyle;
        document.head.appendChild(styleSheet);

        // HTML 结构
        const panelHTML = `
            <div id="gemini-panel-header">
                🚀 学堂在线自动学习面板
            </div>
            <div style="padding: 10px;">
                <p><strong>未完成章节数: </strong><span id="video-count">加载中...</span></p>
                <div style="margin-bottom: 15px; margin-top: 10px;">
                    <label for="start-select" style="display: block; font-weight: bold;">选择起始章节（仅显示饼图未满）:</label>
                    <select id="start-select" style="width: 100%; padding: 7px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"></select>
                </div>
                <button id="start-automation" style="width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ▶️ 从所选章节开始自动学习
                </button>
                <p style="margin-top: 10px; font-size: 12px; color: #666; text-align: center;">
                    * 只播放饼图未满的章节；自动 2.0 倍速、静音，每 5 秒检查进度，饼图未满会自动重播本节。
                </p>

                <div id="gemini-status"
                    style="margin-top: 8px; font-size: 12px; color: #333;
                           background: #f8f9fa; border-radius: 4px; padding: 6px;
                           max-height: 140px; overflow-y: auto; white-space: pre-line; border: 1px solid #e1e4e8;">
                    等待启动...
                </div>
            </div>
        `;

        const panel = document.createElement("div");
        panel.id = "gemini-automation-panel";
        panel.innerHTML = panelHTML;
        document.body.appendChild(panel);

        dragElement = panel;
        makeDraggable(panel);

        return panel;
    }
        /**
     * 判断某个章节是不是“作业/习题”等非视频单元
     * 依据：
     *   - li 里是否存在 span.titlespan.noScore
     *   - 文本里是否包含“习题”等关键字（防御性补刀）
     */
     function isHomeworkChapter(listElement) {
        if (!listElement) return false;

        var li = listElement.querySelector("li");
        if (!li) return false;

        // 只看 span.titlespan.noScore
        var span = li.querySelector("span.titlespan.noScore");
        if (!span) return false;

        var text = (span.innerText || "").trim();
        if (!text) return false;

        // 只在这个 span 文本里找关键字
        return /习题|作业|练习|测验|考试|homework|quiz|exercise/i.test(text);
    }


    /**
     * 将状态信息输出到面板上的状态框
     */
    function logStatus(msg) {
        var box = document.getElementById("gemini-status");
        if (!box) return;

        var time = new Date().toLocaleTimeString();
        var line = "[" + time + "] " + msg;

        if (box.textContent && box.textContent.trim() !== "") {
            box.textContent += "\n" + line;
        } else {
            box.textContent = line;
        }

        box.scrollTop = box.scrollHeight;
    }

    /**
     * 实现面板拖动功能
     */
    function makeDraggable(element) {
        var header = document.getElementById("gemini-panel-header");
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * 面板：只把“饼图未满”的章节放进下拉框
     */
    function populatePanel() {
        try {
            lists = document.getElementsByClassName("third");

            const videoCountSpan = document.getElementById("video-count");
            const startSelect = document.getElementById("start-select");
            const startButton = document.getElementById("start-automation");

            if (lists.length === 0) {
                videoCountSpan.innerText = "0 (未找到章节，请检查类名 'third')";
                logStatus("未找到任何章节元素，可能页面结构有变化。");
                startSelect.innerHTML = '<option value="-1">未找到视频列表</option>';
                startButton.disabled = true;
                return;
            }

            startSelect.innerHTML = '';
            let unfinishedCount = 0;

            for (let i = 0; i < lists.length; i++) {
                const temp = lists[i].getElementsByTagName("li");
                if (temp.length === 0) continue;
                const li = temp[0];

                // 有 .percentFull 说明饼图已满，直接跳过
                const fullIcon = li.querySelector(".percentFull");
                if (fullIcon) {
                    continue;
                }
                // 作业/习题：用 DOM 标记过滤掉
                if (isHomeworkChapter(lists[i])) {
                    // 可选：logStatus("过滤作业章节 #" + i);
                    continue;
                }

                unfinishedCount++;

                let titleText = "无法获取标题";
                const titleSpan = li.getElementsByTagName("span");
                if (titleSpan.length > 0) {
                    titleText = titleSpan[0].innerText.trim();
                }

                const option = document.createElement("option");
                option.value = i; // 直接保存原始索引
                option.innerText = `[#${i}] ${titleText}`;
                startSelect.appendChild(option);
            }

            videoCountSpan.innerText = unfinishedCount;
            logStatus("当前未完成章节数：" + unfinishedCount + "。");

            if (unfinishedCount === 0) {
                startSelect.innerHTML = '<option value="-1">没有未完成的章节</option>';
                startButton.disabled = true;
                logStatus("所有章节饼图都已满，无需自动学习。");
                return;
            } else {
                startButton.disabled = false;
            }

            // 绑定开始按钮事件
            startButton.onclick = function() {
                const selectedValue = startSelect.value;
                const selectedIndex = parseInt(selectedValue, 10);
                if (!isNaN(selectedIndex) && selectedIndex >= 0) {
                    console.log("用户选择从章节 #", selectedIndex, " 开始。");
                    logStatus("开始自动学习，从章节 #" + selectedIndex + " 开始（饼图未满）。");
                    window.clearInterval(runIt);
                    index = selectedIndex;
                    startNum(selectedIndex);
                } else {
                    alert("请选择一个有效的起始章节！");
                }
            };

        } catch (e) {
            console.error("面板初始化失败:", e);
            logStatus("面板初始化失败：" + e.message);
        }
    }

    // --- 播放列表：只在“饼图未满”的章节之间跳转 ---

    /**
     * 从指定起点之后，找到下一个饼图未满的章节索引
     * @param {number} startIndex - 从哪个索引之后开始找（一般是当前 index）
     * @returns {number} - 下一未完成章节索引；找不到则返回 -1
     */
    function findNextUnfinished(startIndex) {
        lists = document.getElementsByClassName("third");
        for (let i = startIndex + 1; i < lists.length; i++) {
            const temp = lists[i].getElementsByTagName("li");
            if (temp.length === 0) continue;
            const li = temp[0];
            const fullIcon = li.querySelector(".percentFull");
            if (!fullIcon) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 跳转到下一个饼图未满的章节；如果没有，就结束脚本
     * @param {number} currentIndex - 当前章节索引
     */
    function gotoNextUnfinished(currentIndex) {
        const nextIdx = findNextUnfinished(currentIndex);
        if (nextIdx === -1) {
            console.log("没有更多未完成的章节，脚本结束。");
            logStatus("没有更多未完成的章节，脚本结束。");
            window.clearInterval(runIt);
            alert("未完成的章节已全部播放完毕！");
            return;
        }
        startNum(nextIdx);
    }

    // --- 核心自动化逻辑函数 ---

    /**
     * 根据索引启动某个章节的播放 (模拟点击)
     * @param {number} num - 章节索引
     */
        function startNum(num) {
        lists = document.getElementsByClassName("third");

        if (num >= lists.length) {
            console.log("索引超出范围，尝试结束。");
            logStatus("章节索引超出范围，脚本结束。");
            window.clearInterval(runIt);
            alert("脚本运行结束。");
            return;
        }

        index = num;
        var currentList = lists[index];
        var temp = currentList.getElementsByTagName("li");

        if (temp.length === 0) {
            console.log("章节 #" + index + " 中未找到 'li' 元素。尝试跳过。");
            logStatus("章节 #" + index + " 没有有效视频节点，跳到下一个未完成章节。");
            gotoNextUnfinished(index);
            return;
        }

        var li = temp[0];

        // 1. 作业/习题：直接跳过（你前面已经有 isHomeworkChapter 的话可以用它）
        if (typeof isHomeworkChapter === "function" && isHomeworkChapter(currentList)) {
            logStatus("章节 #" + index + " 是作业/习题，自动跳过。");
            gotoNextUnfinished(index);
            return;
        }

        // 2. 饼图已经满：不用再刷，跳下一个
        var fullIcon = li.querySelector(".percentFull");
        if (fullIcon) {
            logStatus("章节 #" + index + " 饼图已经满了，自动跳到下一个未完成章节。");
            gotoNextUnfinished(index);
            return;
        }

        // 3. 真的需要刷这节 → 点击进入，开始自动播放
        li.click();

        var titleSpan = li.getElementsByTagName("span");
        var titleText = titleSpan.length > 0 ? titleSpan[0].innerText.trim() : "无标题";

        console.log("当前章节编号：" + index + ", 章节标题：" + titleText);
        logStatus("正在播放章节 #" + index + " - " + titleText);

        start();  // 开启 5 秒轮询
    }


    /**
     * 开始/设置定时器检查进度
     */
    function start() {
        console.log("播放检查/启动----");
        window.clearInterval(runIt);
        runIt = setInterval(next, 5000); // 每5秒检查一次
    }

        /**
     * 定时器触发函数：检查播放进度，进行下一节跳转
     */
        function next() {
        var videos = document.getElementsByClassName("xt_video_player");
        var video = videos.length > 0 ? videos[0] : undefined;

        // --- 当前不是视频：当作作业/讨论，直接跳下一节 ---
        if (video === undefined) {
            console.log("未找到视频播放器，可能是作业/讨论，跳转下一个未完成章节。");
            logStatus("当前章节不是视频（可能是作业/讨论），跳到下一个未完成章节。");
            gotoNextUnfinished(index);
            return;
        }

        var c = video.currentTime;
        var d = video.duration;

        if (!isFinite(d) || d < 1) {
            console.log("视频时长无效或仍在加载中，等待加载...");
            logStatus("视频时长未正确获取，等待加载中...");
            if (video.paused) {
                video.play().catch(function(error) {
                    console.log("尝试播放失败 (可能需要用户交互)：", error.name);
                    logStatus("尝试播放视频失败，可能需要手动点一下播放按钮。");
                });
            }
            return;
        }

        // 保证 2 倍速 & 静音
        speed(video);
        soundClose();

        if (video.paused) {
            console.log("检测到视频暂停，尝试强制播放...");
            logStatus("检测到视频暂停，尝试继续播放当前章节。");

            video.play().catch(function(error) {
                console.log("视频强制播放失败，可能需要用户交互。错误类型:", error.name);
                logStatus("强制播放失败，可能需要你手动点一下播放按钮。");
            });

            var staNow = document.getElementsByClassName("play-btn-tip")[0];
            if (staNow && staNow.innerText === "播放") {
                staNow.click();
            }
        }

        var ratio = c / d;
        var percentText = (ratio * 100).toFixed(2) + "%";
        var remain = d - c;

        // ✅ 关键点：只要这一遍“看完了”，就触发刷新饼图的流程
        if (video.ended || remain <= 1.0) {
            if (isRefreshingPie) return;

            isRefreshingPie = true;
            pendingCheckIndex = index;

            console.log("本节视频完整播放结束，进度：" + percentText + "，准备切换章节刷新饼图...");
            logStatus("本节视频完整播放结束（" + percentText + "），切到其他章节刷新饼图，然后再看饼图是否满。");

            switchChapterForPieRefresh();
            return;
        }

        // 否则就是正常播放中，什么都不做
        console.log("视频正在播放中... 进度: " + percentText);
    }


    /**
     * 为了刷新当前章节的饼图：临时切换到别的章节
     */
    function switchChapterForPieRefresh() {
        lists = document.getElementsByClassName("third");

        var jumpIndex = -1;
        if (lists.length > 1) {
            if (index + 1 < lists.length) {
                jumpIndex = index + 1;
            } else if (index - 1 >= 0) {
                jumpIndex = index - 1;
            }
        }

        if (jumpIndex === -1) {
            // 只有一节课，没得切章，那就直接按原逻辑检查
            logStatus("只有一个章节，无法切章刷新饼图，直接检查当前章节饼图。");
            checkProgressAndMaybeGotoNext(null); // video 可选
            return;
        }

        var list = lists[jumpIndex];
        var lis = list.getElementsByTagName("li");
        if (lis.length > 0) {
            lis[0].click();
            console.log("为刷新饼图，临时切到章节 #" + jumpIndex);
            logStatus("为刷新饼图，暂时切到章节 #" + jumpIndex + "。");
        }

        // 给后台一点时间刷新进度，之后再去检查 pendingCheckIndex 那节的饼图
        setTimeout(function() {
            checkProgressAndMaybeGotoNext(null);  // 之后统一在这里决定是重播还是下一节
        }, 5000);
    }

    /**
     * 在“切到其它章节刷新饼图”之后，检查 pendingCheckIndex 那节的饼图
     * 如果饼图满 → 跳到下一未完成章节
     * 如果没满   → 切回去重播 pendingCheckIndex
     */
    var MAX_REPLAY_PER_CHAPTER = 20;

    function checkProgressAndMaybeGotoNext() {
        isCheckingProgress = false;
        lists = document.getElementsByClassName("third");

        if (pendingCheckIndex == null) {
            isRefreshingPie = false;
            logStatus("没有 pendingCheckIndex，跳过饼图检查。");
            return;
        }

        var idx = pendingCheckIndex;
        var currentList = lists[idx];

        if (!currentList) {
            console.log("找不到 pending 章节节点，跳到下一个未完成章节。");
            logStatus("找不到 pending 章节节点，跳到下一个未完成章节。");
            isRefreshingPie = false;
            pendingCheckIndex = null;
            gotoNextUnfinished(idx);
            return;
        }

        var lis = currentList.getElementsByTagName("li");
        if (lis.length === 0) {
            console.log("pending 章节没有 li，跳到下一个未完成章节。");
            logStatus("pending 章节没有 li，跳到下一个未完成章节。");
            isRefreshingPie = false;
            pendingCheckIndex = null;
            gotoNextUnfinished(idx);
            return;
        }

        var currentLi = lis[0];
        var fullIcon = currentLi.querySelector(".percentFull");

        // ✅ 饼图满了：这一节彻底搞定，跳到下一个未完成视频
        if (fullIcon) {
            console.log("检测到章节 #" + idx + " 饼图已满，跳到下一个未完成章节。");
            logStatus("章节 #" + idx + " 饼图已满，开始下一节未完成视频。");
            replayCountMap[idx] = 0;
            isRefreshingPie = false;
            pendingCheckIndex = null;
            gotoNextUnfinished(idx);
            return;
        }

        // ❌ 饼图没满：这一节需要再看一遍
        replayCountMap[idx] = (replayCountMap[idx] || 0) + 1;
        var times = replayCountMap[idx];

        console.log("章节 #" + idx + " 饼图仍未满，第 " + times + " 次重播。");
        logStatus("章节 #" + idx + " 饼图仍未满，第 " + times + " 次重播。");

        // 防止真的无限死循环（比如这节是互动题/课件，永远不会满）
        if (times >= MAX_REPLAY_PER_CHAPTER) {
            console.log("本章节重播超过 " + MAX_REPLAY_PER_CHAPTER + " 次仍未满，跳到下一个未完成章节。");
            logStatus("章节 #" + idx + " 看了 " + MAX_REPLAY_PER_CHAPTER +
                      " 次饼图仍未满，可能需要你手动答题/操作，已自动跳过这一节。");
            isRefreshingPie = false;
            pendingCheckIndex = null;
            gotoNextUnfinished(idx);
            return;
        }

        // 重新回到这一节，从头播放
        index = idx;
        pendingCheckIndex = null;
        isRefreshingPie = false;

        currentLi.click();  // 再次进入该章节

        setTimeout(function() {
            var videos = document.getElementsByClassName("xt_video_player");
            var v = videos.length > 0 ? videos[0] : null;
            if (v) {
                v.currentTime = 0;   // ✅ 硬从 0 开始看一遍
                v.play().catch(function(err) {
                    console.log("重播当前视频失败：", err.name);
                    logStatus("重播当前视频失败，可能需要你手动点一下播放。");
                });
            }
            start(); // 重新启动定时检查
        }, 1000);
    }


    /**
     * 关闭视频声音 (通过点击 UI 按钮)
     */
    function soundClose() {
        var mutedIcon = document.getElementsByClassName("xt_video_player_common_icon_muted");
        if (mutedIcon.length === 0) {
            var muteButton = document.getElementsByClassName("xt_video_player_common_icon")[0];
            if (muteButton) {
                muteButton.click();
                console.log("视频声音关闭");
            }
        }
    }

    /**
     * 设置播放速度为2.0 (直接操作 video 元素)
     */
    function speed(video) {
        if (video && video.playbackRate !== 2.0) {
            video.playbackRate = 2.0;
            console.log("设置播放速度为 2.0 倍。");
        }
    }

    // --- 脚本启动入口 ---

    function main() {
        console.log("油猴脚本已启动，开始加载操作面板...");
        createPanel();
        logStatus("脚本已载入，正在识别未完成的章节...");
        setTimeout(populatePanel, 3000);
    }

    setTimeout(main, 2000);
})();
