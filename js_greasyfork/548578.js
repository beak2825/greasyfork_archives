// ==UserScript==
// @name         🔥🔥🔥华医助手（修复版2025.9.6）
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  ✅视频助手✅屏蔽或者跳过课堂签到、提醒、疲劳✅考试助手（试错算法仅面向可多次提交的考试）✅全自动学习所有课程
// @author       二创作者：大成路旁   原创作者：Dr.S
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/pages/course.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/548578/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E5%8D%8E%E5%8C%BB%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88202596%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548578/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E5%8D%8E%E5%8C%BB%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88202596%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================
    // 🔧 配置参数
    // ========================
    const config = {
        submitTime: 6100,
        reTryTime: 2100,
        examTime: 10000,
        randomX: 5000,
        autoSkip: false,
        checkInterval: 20000, // 检测间隔时间（毫秒），
        videoCompletionThreshold: 0.95 // 视频完成阈值（95%视为完成）
    };

    // ========================
    // 🗃️ 存储键名
    // ========================
    const STORAGE_KEYS = {
        PLAY_RATE: "JJ_Playrate",
        TEST: "JJ_Test",
        RESULT: "JJ_Result",
        THIS_TITLE: "JJ_ThisTitle",
        TEST_ANSWER: "JJ_TestAnswer",
        RIGHT_ANSWER: "JJ_RightAnswer",
        ALL_ANSWER: "JJ_AllAnswer",
        CURRENT_COURSE: "JJ_CurrentCourse",
        VIDEO_COMPLETED: "JJ_VideoCompleted" // 新增：记录视频完成状态
    };

    // ========================
    // 🎨 按钮样式
    // ========================
    const BTN_STYLES = {
        A: "font-size:16px;font-weight:300;text-decoration:none;text-align:center;line-height:40px;height:40px;padding:0 40px;display:inline-block;appearance:none;cursor:pointer;border:none;box-sizing:border-box;transition:all .3s;background:#4cb0f9;border-color:#4cb0f9;border-radius:4px;margin:5px;color:#FFF;",
        B: "font-size:12px;font-weight:300;text-decoration:none;text-align:center;line-height:20px;height:20px;padding:0 5px;display:inline-block;appearance:none;cursor:pointer;border:none;box-sizing:border-box;transition:all .3s;background:#4cb0f9;border-color:#4cb0f9;border-radius:4px;margin:5px;color:#FFF;",
        C: "font-size:12px;font-weight:300;text-decoration:none;text-align:center;line-height:20px;height:20px;padding:0 5px;display:inline-block;appearance:none;cursor:pointer;border:none;box-sizing:border-box;transition:all .3s;background:#f15854;border-color:#f15854;border-radius:4px;margin:5px;color:#FFF;"
    };

    // ========================
    // 🌐 URL 解析
    // ========================
    const urlParts = window.location.href.split('/');
    const pageName = urlParts[urlParts.length - 1].split('?')[0];

    // ========================
    // 🧠 主逻辑分发
    // ========================
    const huayi = getHuayi();
    const actions = {
        'course_ware_polyv.aspx': () => huayi.seeVideo(1),
        'course_ware_cc.aspx': () => huayi.seeVideo(2),
        'exam.aspx': () => huayi.doTest(),
        'course.aspx': () => huayi.courseList(),
        'cme.aspx': () => huayi.courseList(),
        'exam_result.aspx': () => huayi.doResult()
    };

    const action = actions[pageName];
    if (action) {
        console.log(`当前任务: ${{
            'course_ware_polyv.aspx': '华医看视频',
            'course_ware_cc.aspx': '华医看视频',
            'exam.aspx': '华医考试',
            'course.aspx': '课程列表',
            'cme.aspx': '课程列表',
            'exam_result.aspx': '华医考试结果审核'
        }[pageName]}`);
        action();
    } else {
        console.log("其它页面，无需处理");
    }

    // ========================
    // 🧩 核心功能对象
    // ========================
    function getHuayi() {
        return {
            courseList: () => {
                addAnswerCopyBtn();
                addClearAnswerBtn();
                goToNextCourse(); // 自动进入下一课
            },

            seeVideo: (playerType) => {
                cleanStorage();
                asynckillSendQuestion();
                killSendQuestion2();
                killSendQuestion3();
                addModeIndicator();
                changeLayout();

                // 重置视频完成状态
                localStorage.removeItem(STORAGE_KEYS.VIDEO_COMPLETED);

                window.onload = () => {
                    localStorage.setItem(STORAGE_KEYS.THIS_TITLE, JSON.stringify(document.title));
                    if (config.autoSkip) {
                        setTimeout(skipVideo, config.submitTime + Math.ceil(Math.random() * config.randomX));
                        console.log("秒过了！");
                    }

                    // 设置视频完成监听
                    setTimeout(setupVideoCompletionListener, 3000);

                    // 定期检查状态 - 使用配置的间隔时间
                    const clock = setInterval(examherftest, config.checkInterval);

                    // 初始化播放器
                    const initPlayer = {
                        1: () => {
                            window.s2j_onPlayerInitOver = () => {
                                const video = document.querySelector('video');
                                if (video) video.defaultMuted = true;
                                const playerInstance = window.player;
                                playerInstance?.j2s_setVolume?.(0);
                                setTimeout(() => {
                                    try {
                                        playerInstance?.j2s_resumeVideo?.();
                                        examherftest();
                                    } catch (e) {
                                        console.warn("保利威播放器初始化错误:", e);
                                    }
                                }, 2000);
                            };
                        },
                        2: () => {
                            window.on_CCH5player_ready = () => {
                                const video = document.querySelector('video');
                                if (video) video.defaultMuted = true;
                                const playerInstance = window.cc_js_Player;
                                playerInstance?.setVolume?.(0);
                                setTimeout(() => {
                                    try {
                                        playerInstance?.play?.();
                                        examherftest();
                                    } catch (e) {
                                        console.warn("CC播放器初始化错误:", e);
                                    }
                                }, 2000);
                            };
                        }
                    }[playerType];

                    initPlayer?.();
                };
            },

            doTest: () => {
                const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST)) || {};
                let qRightAnswer = JSON.parse(localStorage.getItem(STORAGE_KEYS.RIGHT_ANSWER)) || {};
                if (Object.keys(qRightAnswer).length === 0) {
                    qRightAnswer = loadRightAnswer();
                }

                const qTestAnswer = {};
                let index = 0;
                let questionEl;

                while ((questionEl = document.querySelectorAll("table.tablestyle")[index])) {
                    const questionText = questionEl.querySelector(".q_name")?.innerText.substring(2).replace(/\s/g, '');
                    if (!questionText) {
                        index++;
                        continue;
                    }

                    const tbody = questionEl.querySelector("tbody");
                    if (!tbody) {
                        index++;
                        continue;
                    }

                    // 优先使用正确答案
                    if (qRightAnswer.hasOwnProperty(questionText)) {
                        const rightOption = findAnswer(tbody, qRightAnswer[questionText]);
                        rightOption?.click();
                    } else {
                        // 否则试错机制
                        const current = questions[questionText] || "A";
                        const next = String.fromCharCode(current.charCodeAt(0) + 1);
                        questions[questionText] = next;

                        const optionIndex = current.charCodeAt(0) - "A".charCodeAt(0);
                        const labels = tbody.getElementsByTagName("label");
                        const element = labels[optionIndex] || labels[0]; // fallback to A

                        try {
                            qTestAnswer[questionText] = element.innerText.substring(3);
                        } catch (e) {
                            console.warn("答案文本获取失败:", e);
                        }
                        element.click();
                    }
                    index++;
                }

                localStorage.setItem(STORAGE_KEYS.TEST, JSON.stringify(questions));
                localStorage.setItem(STORAGE_KEYS.TEST_ANSWER, JSON.stringify(qTestAnswer));

                setTimeout(() => {
                    document.querySelector("#btn_submit")?.click();
                }, config.submitTime + Math.ceil(Math.random() * config.randomX));
            },

            doResult: () => {
                const resultText = $(".tips_text")[0]?.innerText || "";
                const dds = $(".state_cour_lis");
                localStorage.removeItem(STORAGE_KEYS.RESULT);

                if (/考试通过|完成项目学习/.test(resultText)) {
                    console.log("✅ 考试通过，正在查找下一门课程...");
                    saveRightAnswer();
                    saveAllAnswers();
                    cleanStorage();

                    // 保存当前课程信息，用于后续跳转
                    const currentCourse = {
                        url: window.location.href,
                        title: document.title,
                        timestamp: new Date().getTime()
                    };
                    localStorage.setItem(STORAGE_KEYS.CURRENT_COURSE, JSON.stringify(currentCourse));

                    // 延迟执行，确保页面稳定
                    setTimeout(() => {
                        // 首先尝试查找页面上的"立即学习"按钮
                        const learnBtn = $('input[value="立即学习"].state_lis_btn')[0];

                        if (learnBtn) {
                            const title = $(learnBtn).siblings('.state_lis_text').attr('title') || "未知课程";
                            console.log(`▶️ 发现待学课程: ${title}，正在跳转...`);
                            learnBtn.click();
                        } else {
                            console.log("❌ 未找到立即学习按钮，尝试自动进入下一课程");

                            // 如果没有找到按钮，尝试自动跳转到课程列表
                            // setTimeout(() => {
                            //     window.location.href = "/pages/course.aspx";
                            // }, 2000);
                        }
                    }, 1000);
                } else {
                    console.log("❌ 考试未通过，准备重考");
                    document.querySelector("p.tips_text").innerText =
                        "本次未通过，正在尝试更换答案\r（此为正常现象，脚本几秒后刷新，请勿操作）";

                    const wrongMap = {};
                    dds.each((i, el) => {
                        const img = el.querySelector("img");
                        const p = el.querySelector("p");
                        if (img && p && !img.src.includes("bar_img")) {
                            wrongMap[p.title.replace(/\s/g, "")] = i;
                        }
                    });

                    if (Object.keys(wrongMap).length > 0) {
                        localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(wrongMap));
                        saveRightAnswer();
                    }

                    setTimeout(() => {
                        $("input[type=button][value='重新考试']").click();
                    }, config.reTryTime + Math.ceil(Math.random() * config.randomX));
                }
            }
        };
    }

    // ========================
    // 🚀 功能函数（优化版）
    // ========================

    function goToNextCourse() {
        // 获取当前课程信息
        const currentCourse = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_COURSE) || "{}");
        const currentUrl = currentCourse.url || "";

        console.log("正在寻找下一门课程...");

        setTimeout(() => {
            const lessons = document.querySelectorAll(".lis-inside-content");
            let foundNext = false;

            for (const lesson of lessons) {
                const status = lesson.querySelector("button")?.innerText.trim();
                const h2 = lesson.querySelector("h2[onclick]");
                const onclick = h2?.getAttribute("onclick");

                if ((status === "学习中" || status === "未学习") && onclick) {
                    const match = onclick.match(/window\.location\.href='([^']+)'/);
                    if (match) {
                        const courseUrl = match[1];
                        console.log("➡️ 正在进入下一门课程:", courseUrl);

                        // 确保URL是完整的
                        const fullUrl = courseUrl.startsWith("http") ? courseUrl :
                                      `https://${window.location.hostname}${courseUrl.startsWith("/") ? "" : "/"}${courseUrl}`;

                        window.location.href = fullUrl;
                        foundNext = true;
                        return;
                    }
                }
            }

            if (!foundNext) {
                console.log("❌ 未找到可用的下一门课程");

                // 尝试其他方法查找课程
                tryAlternativeCourseFinding();
            }
        }, 3000);
    }

    function tryAlternativeCourseFinding() {
        // 方法1: 查找所有可能的课程链接
        const courseLinks = document.querySelectorAll('a[href*="course_ware"], a[href*="exam"], h2[onclick*="course_ware"], h2[onclick*="exam"]');

        for (const link of courseLinks) {
            let url = null;

            if (link.tagName === 'A') {
                url = link.href;
            } else if (link.hasAttribute('onclick')) {
                const onclick = link.getAttribute('onclick');
                const match = onclick.match(/window\.location\.href='([^']+)'/);
                if (match) {
                    url = match[1];
                }
            }

            if (url && (url.includes("course_ware") || url.includes("exam"))) {
                console.log("🔍 发现备选课程链接:", url);

                // 确保URL是完整的
                const fullUrl = url.startsWith("http") ? url :
                              `https://${window.location.hostname}${url.startsWith("/") ? "" : "/"}${url}`;

                setTimeout(() => {
                    window.location.href = fullUrl;
                }, 2000);
                return;
            }
        }

        console.log("🎉 所有课程已完成或未找到更多课程！");
    }

    function saveAllAnswers() {
        const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ANSWER)) || {};
        const rightAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.RIGHT_ANSWER)) || {};
        const title = JSON.parse(localStorage.getItem(STORAGE_KEYS.THIS_TITLE)) || "没有记录到章节名称";

        if (title !== "没有记录到章节名称") {
            const chapterAnswers = allAnswers[title] || {};
            Object.assign(chapterAnswers, rightAnswers);
            allAnswers[title] = chapterAnswers;
            localStorage.setItem(STORAGE_KEYS.ALL_ANSWER, JSON.stringify(allAnswers));
        }
    }

    function loadRightAnswer() {
        const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ANSWER)) || {};
        const title = JSON.parse(localStorage.getItem(STORAGE_KEYS.THIS_TITLE)) || "没有记录到章节名称";
        return title !== "没有记录到章节名称" ? allAnswers[title] || {} : {};
    }

    function saveRightAnswer() {
        const rightAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.RIGHT_ANSWER)) || {};
        const testAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_ANSWER)) || {};
        const wrongs = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULT)) || {};

        for (const q in testAnswers) {
            if (!wrongs.hasOwnProperty(q)) {
                console.log("正确的题目：" + q + "，答案：" + testAnswers[q]);
                rightAnswers[q] = testAnswers[q];
            } else {
                console.log("错误的题目：" + q + "，答案：" + testAnswers[q]);
            }
        }

        localStorage.setItem(STORAGE_KEYS.RIGHT_ANSWER, JSON.stringify(rightAnswers));
        localStorage.removeItem(STORAGE_KEYS.TEST_ANSWER);
    }

    function addAnswerCopyBtn() {
        const btn = document.createElement("a");
        btn.innerHTML = '显示已记录答案';
        btn.style.cssText = BTN_STYLES.B;
        btn.onclick = () => {
            const allAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ANSWER)) || {};
            const output = JSON.stringify(allAnswers, null, "\t");
            const textarea = document.getElementById("AnwserOut") || (() => {
                const el = document.createElement("textarea");
                el.id = "AnwserOut";
                el.rows = 20;
                el.cols = 30;
                document.getElementById("main_div").parentNode.appendChild(el);
                return el;
            })();
            textarea.value = output;
        };
        document.getElementById("main_div")?.parentNode.appendChild(btn);
    }

    function addClearAnswerBtn() {
        const btn = document.createElement("a");
        btn.innerHTML = '清除已记录答案';
        btn.style.cssText = BTN_STYLES.B;
        btn.onclick = () => {
            if (confirm("确定清除历史答案？!")) {
                localStorage.removeItem(STORAGE_KEYS.ALL_ANSWER);
            }
        };
        document.getElementById("main_div")?.parentNode.appendChild(btn);
    }

    function skipVideo() {
        const video = document.querySelector('video');
        if (video) video.currentTime = video.duration - 1;
    }

    function examherftest() {
        const jrks = document.getElementById("jrks");
        const ckjy = document.getElementById("ckjy");

        if (!ckjy || !jrks) {
            console.log("❌ 未找到考试相关元素");
            return;
        }

        const ckjyHref = ckjy.href || "";
        const cwidMatch = ckjyHref.match(/[?&]cwid=([^&]+)/i);
        const cwid = cwidMatch ? cwidMatch[1] : null;

        // 检测按钮状态
        const isDisabled = jrks.hasAttribute("disabled");
        const hasDisabledClass = jrks.classList.contains("inputstyle2_2");

        // 检测视频状态 - 通过保利威播放器API
        let isVideoCompleted = false;
        try {
            if (window.player && typeof window.player.j2s_getCurrentTime === 'function') {
                const currentTime = window.player.j2s_getCurrentTime();
                const duration = window.player.j2s_getDuration();

                // 如果视频播放接近完成（达到阈值）
                const completionRatio = currentTime / duration;
                isVideoCompleted = completionRatio >= config.videoCompletionThreshold;

                // 检查是否已经标记为完成
                const alreadyCompleted = localStorage.getItem(STORAGE_KEYS.VIDEO_COMPLETED) === "true";

                if (isVideoCompleted && !alreadyCompleted) {
                    console.log("✅ 视频已达到完成阈值，标记为已完成");
                    localStorage.setItem(STORAGE_KEYS.VIDEO_COMPLETED, "true");
                }

                // 如果已经标记为完成，则始终认为视频已完成
                if (alreadyCompleted) {
                    isVideoCompleted = true;
                }
            }
        } catch (e) {
            console.log("无法获取视频状态:", e);
        }

        // 检测页面中的状态指示器
        const statusButtons = document.querySelectorAll(".lis-inside-content button");
        let currentVideoCompleted = false;

        statusButtons.forEach(button => {
            if (button.textContent === "已完成" || button.textContent === "待考试") {
                currentVideoCompleted = true;
            }
        });

        console.log(`📊 状态检测: cwid=${cwid}, 按钮禁用=${isDisabled}, 禁用类=${hasDisabledClass}, 视频完成=${isVideoCompleted}, 页面状态=${currentVideoCompleted}`);

        // 主要判断条件：按钮可用且有CWID
        if (cwid && !isDisabled && !hasDisabledClass) {
            console.log("✅ 满足所有条件，正在跳转考试...");

            // 直接使用URL跳转（更可靠）
            const examUrl = `/pages/exam.aspx?cwid=${cwid}`;
            window.location.href = examUrl;
        } else {
            // if (!cwid) console.log("❌ 缺少cwid参数");
            // if (isDisabled) console.log("❌ 考试按钮仍被禁用");
            // if (hasDisabledClass) console.log("❌ 考试按钮仍有禁用样式");
            // if (!isVideoCompleted) console.log("❌ 视频未完成");
        }
    }

    // 添加视频完成事件监听
    function setupVideoCompletionListener() {
        if (window.player && typeof window.player.j2s_onPlayOver === 'function') {
            // 保存原始回调
            const originalOnPlayOver = window.player.j2s_onPlayOver;

            // 重写回调
            window.player.j2s_onPlayOver = function() {
                console.log("🎬 视频播放完成，准备跳转考试");
                // 标记视频为已完成
                localStorage.setItem(STORAGE_KEYS.VIDEO_COMPLETED, "true");

                // 调用原始回调
                if (typeof originalOnPlayOver === 'function') {
                    originalOnPlayOver();
                }
                // 检查并跳转
                setTimeout(examherftest, 2000);
            };
        }
    }

    function asynckillSendQuestion() {
        (async () => {
            while (!window.player || !window.player.sendQuestion) await new Promise(r => setTimeout(r, 20));
            window.player.sendQuestion = () => {};
        })();
    }

    function killSendQuestion2() {
        // 修复：安全地检查并设置 isInteraction 变量
        try {
            // 首先检查页面上是否已定义 isInteraction 变量
            if (typeof window.isInteraction !== 'undefined') {
                window.isInteraction = "off";
                console.log("✅ 已设置 isInteraction = 'off'");
            }
        } catch (e) {
            console.log("❌ 设置 isInteraction 时出错:", e);
        }
    }

    function killSendQuestion3() {
        setInterval(() => {
            try {
                // 跳过各种弹窗
                const selectors = [
                    '.pv-ask-skip', // 问题对话框
                    '.signBtn', // 签到
                    "button[onclick='closeProcessbarTip()']", // 旧提示
                    '#div_processbar_tip .rig_btn', // 新版"知道了"
                    'button.btn_sign' // 疲劳提醒
                ];

                selectors.forEach(sel => {
                    const el = document.querySelector(sel);
                    if (el && isVisible(el)) {
                        console.log(`检测到弹窗，尝试跳过: ${sel}`);
                        el.click();
                    }
                });

                // 视频播放状态监控
                const video = document.querySelector('video');
                const playIcon = document.querySelector("i#top_play");
                const stateText = document.querySelector('.rig_text')?.innerText;

                if (video && playIcon && video.paused && stateText !== "已完成") {
                    video.muted = true;
                    video.volume = 0;
                    video.play().catch(err => console.warn("自动播放被阻止:", err));
                } else if (stateText === "已完成") {
                    video?.pause();
                }
            } catch (err) {
                console.warn("弹窗处理出错:", err);
            }
        }, 2000);
    }

    // 辅助函数：判断元素是否可见
    function isVisible(el) {
        return el && el.offsetParent !== null && el.style.display !== 'none' && el.style.visibility !== 'hidden';
    }

    function findAnswer(tbody, answerText) {
        const labels = tbody.getElementsByTagName("label");
        for (let i = 0; i < labels.length; i++) {
            if (labels[i].innerText.substring(3) === answerText) {
                return labels[i];
            }
        }
        return null;
    }

    function cleanStorage() {
        [
            STORAGE_KEYS.TEST,
            STORAGE_KEYS.RESULT,
            STORAGE_KEYS.TEST_ANSWER,
            STORAGE_KEYS.RIGHT_ANSWER
        ].forEach(key => localStorage.removeItem(key));
    }

    function addModeIndicator() {
        const mode = localStorage.getItem("华医mode") === "2" ? "视频+考试" : "单刷视频";
        const icon = localStorage.getItem("华医mode") === "2" ? "🎬📝" : "🎬";
        const color = localStorage.getItem("华医mode") === "2" ? "#28a745" : "#007bff";

        const el = document.createElement("div");
        el.innerHTML = `${icon} ${mode} (点击切换)`;
        el.title = "点击切换模式";

        // 修复样式设置，使用正确的CSS属性名
        el.style.position = "fixed";
        el.style.top = "90%";
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)";
        el.style.background = color;
        el.style.color = "white";
        el.style.padding = "12px 20px";
        el.style.borderRadius = "8px";
        el.style.fontSize = "24px";
        el.style.fontWeight = "bold";
        el.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
        el.style.zIndex = "9999";
        el.style.cursor = "pointer";
        el.style.whiteSpace = "nowrap";

        el.onclick = () => {
            const m = localStorage.getItem("华医mode") !== "2" ? "2" : "1";
            localStorage.setItem("华医mode", m);
            const i = m === "2" ? "🎬📝" : "🎬";
            const c = m === "2" ? "#007bff" : "#28a745";
            el.innerHTML = `${i} ${m === "2" ? "视频+考试" : "单刷视频"} (点击切换)`;
            el.style.background = c;
        };
        document.body.appendChild(el);
    }

    function changeLayout() {
        // 这里可以添加布局修改代码
        console.log("修改页面布局...");
    }

})();