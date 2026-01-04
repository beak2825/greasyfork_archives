// ==UserScript==
// @name         华医网助手2025
// @namespace    https://greasyfork.org/zh-CN/scripts/553643-%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B2025
// @version      202511.3
// @description  基于“🥇【华医网小助手】全网唯一真实免费|无人值守|自动静音|视频助手|考试助手|不疲劳”。[❌倍速播放✅视频助手✅屏蔽或者跳过课堂签到、提醒、疲劳✅考试助手（试错算法仅面向可多次提交的考试）✅双模选择：单刷视频or视频+考试。]
// @author       三创作者：citlalidsk  二创作者：境界程序员   原创作者：Dr.S
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @exclude      *://guideline.91huayi.com/*
// @exclude      *://gdkjpt.91huayi.com/kjptwsw
// @exclude      *://gdkjpt.91huayi.com/kjptwsw/*
// @exclude      *://gdkjpt.91huayi.com/kjpt2/personel/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553647/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B2025.user.js
// @updateURL https://update.greasyfork.org/scripts/553647/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B2025.meta.js
// ==/UserScript==

var newupdate = "屏蔽了几个无关网址";
//更新历史
//■2025.11.3屏蔽了几个无关网址
//■2025.11.2优化跳转，去掉多余窗口
//■2025.11优化进入考试和单刷
//■2025.10适配2025年华医网
//原作https://greasyfork.org/zh-CN/scripts/502969-%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0-%E8%B7%B3%E8%BF%87%E7%AD%BE%E5%88%B0-%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3-%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B-%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95
//原作https://greasyfork.org/zh-CN/scripts/483418-%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B-%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E7%9C%9F%E5%AE%9E%E5%85%8D%E8%B4%B9-%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88-%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3-%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B-%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B-%E4%B8%8D%E7%96%B2%E5%8A%B3
//■2024.8.1网页布局和提示窗改版，调整检测逻辑；既然禁用倍速，不再显示变速按钮；得学分更快的双卫网小助手考试功能已开发完毕，正在优化缩短视频时间，完善后发布，欢迎天使投资人
//■2024.7.16因部分地区考试不用二维码，所以将进入考试的方式回滚到旧版本方便更多人使用，因此可能会导致部分全国通用版的用户依旧偶尔自动进入考试失败，以后再另行观察。感谢大家的意见
//■2024.7.14优化静音时间点；优化更新内容展示；优化播放逻辑，已完成的视频不再引起卡顿
//■2024.7.13优化进入考试的逻辑，不再依赖考试按钮
//■2024.7.11根据用户反馈，增加了登录界面关闭悬浮窗的按钮
//■2024.7.8增加了当前页面是否有对应代码的提示，增加了作者脚本的分享链接
//■2024.6.21智能检测剩余任务，以防有人直接看最后一节课导致脚本发呆
//■2024.6.19新增了从考试结果界面自动返回原课程的功能（官方网站改版，主动删除网页中的继续学习按钮）
//■2024.6.18针对华医网答题模块改版，已更新语法
//■2024.6.7根据赞赏和评论区反馈，修复了一种视频意外暂停的情况
//■2024.6.5增加视频过程中对温馨提示（疲劳）的检测
//■2024.6.3尝试修复CC播放器和保利威播放器加载事件bug
//■2024.4.28由于与用户无法取得联系，在页面上增加了反馈机制的说明
//■2024.4.15修复了不自动切换视频的问题（因网站版本限制，目前脚本倍速已失效）
//■2024.1.11在人脸识别页面增加温馨提醒，考试功能仅为答案遍历，而非自动搜索答案
//■2023.12.25添加了网页静音代码，润物细无声
//■2023.12.24优化了倍速调整的逻辑，无需刷新网页
//■2023.12.21将脚本控制台上移到显眼的位置，方便用户操作；增加生效的倍速按钮变色(删除了原先的文字提醒)
//■2023.12.15新增模式切换，可以选择先单刷视频（无人值守），刷完再打开考试开关，就可以连续考试了
//■2023.12.3优化了视频播放逻辑，能够自动切换下一个视频，而不是播完1个就卡在考试认证处（也导致了不修改代码就无法进入考试）
//■2023.12.1调整默认播放速度5倍（仅首次登录起效，后续以用户更改过的倍速保存），免得用户感觉不到脚本在运行


(function () {
    'use strict';
    var submitTime = 6100;//交卷时间控制
    var reTryTime = 2100;//重考,视频进入考试延时控制
    var examTime = 10000;//听课完成进入考试延时
    var randomX = 5000;//随机延时上限
    var vSpeed = 1; //首次使用脚本的默认播放速度
    var autoSkip = false; //一个可能会封号的功能。
    //记录字段
    var keyPlayRate = "JJ_Playrate";
    var keyTest = "JJ_Test";
    var keyResult = "JJ_Result";
    var keyThisTitle = "JJ_ThisTitle";
    var keyTestAnswer = "JJ_TestAnswer";
    var keyRightAnswer = "JJ_RightAnswer";
    var keyAllAnswer = "JJ_AllAnswer";
    //按钮样式
    var btstyleA = "font-size: 16px;font-weight: 300;text-decoration: none;text-align: center;line-height: 40px;height: 40px;padding: 0 40px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #4cb0f9;border-color: #4cb0f9;border-radius: 4px;margin: 5px;color: #FFF;";
    var btstyleB = "font-size: 12px;font-weight: 300;text-decoration: none;text-align: center;line-height: 20px;height: 20px;padding: 0 5px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #4cb0f9;border-color: #4cb0f9;border-radius: 4px;margin: 5px;color: #FFF;";
    var btstyleC = "font-size: 12px;font-weight: 300;text-decoration: none;text-align: center;line-height: 20px;height: 20px;padding: 0 5px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #f15854;border-color: #f15854;border-radius: 4px;margin: 5px;color: #FFF;";
    //页面判别
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var huayi = getHuayi();
    var nspeed = 0;
    //var mmcode = `data:image/jpeg;base64,/9j/xxxxxxxxx`
    var clock = null;

    advis();
    document.querySelector("span[id='tixing']").innerHTML = "当前网址已适配";
    if (urlTip == "course_ware_polyv.aspx") { //保利威播放器视频页面
        console.log("当前任务: 华医看视频");
        document.querySelector("div[id='Div1']").style.top = "40px";
        huayi.seeVideo(1);
    } else if (urlTip == "course_ware_cc.aspx") { //CC播放器视频页面
        console.log("当前任务: 华医看视频");
        document.querySelector("div[id='Div1']").style.top = "40px";
        huayi.seeVideo(2);
    } else if (urlTip == "exam.aspx") { //考试页面
        console.log("当前任务: 华医考试");
        huayi.doTest();
    } else if (urlTip == "course.aspx" || urlTip == "cme.aspx") { //课程列表页面
        console.log("当前任务: 课程列表");
        huayi.courseList();
    } else if (urlTip == "exam_result.aspx") { //考试结果页面
        console.log("当前任务: 华医考试结果审核");
        huayi.doResult();
    } else {
        console.log("其它情况");
        try {
            document.querySelector("span[id='tixing']").innerHTML = "此页面非视频、考试或未适配";
            //document.querySelector("img[id='Pic']").style.display = "block";
        } catch (error) { };
    };
    //网页中存在子页面的检测，导致存在多个Div1

    // ==================== 新增：全局试错函数 ====================
    // 全局试错函数
    // 全局试错函数 (动态 maxLetter)
    function getChoiceCode(an) {
        var charin = an || "A";
        return charin.charCodeAt(0) - "A".charCodeAt(0);
    };

    function getNextChoice(an, maxLetter = 'D') {
        var code = an.charCodeAt(0) + 1;
        var maxCode = maxLetter.charCodeAt(0);
        if (code > maxCode) code = "A".charCodeAt(0);
        return String.fromCharCode(code);
    };
    // ==================== 新增结束 ====================
    function getHuayi() {
        return {
            courseList: function () {
                addAnwserCopybtn();
                DelAllAnwser();

            },
            seeVideo: function (e) {
                var tr = localStorage.getItem(keyPlayRate);
                //console.log("存储读取" + tr);//读取倍速
                //var playRateNow = tr ? tr : vSpeed;
                var playRateNow = 1;
                cleanKeyStorage();



                asynckillsendQuestion();//屏蔽课堂问答的函数；
                killsendQuestion2();//屏蔽课堂问答的函数2；

                killsendQuestion3(); //循环检测问答对话框是否弹出。

                // addrateinfo();//插入一些按钮
                // addratebtn(1);
                // addratebtn(1.5);
                // addratebtn(2);
                // addratebtn(3);
                // addratebtn(5);
                // addratebtn(10);
                //addSkipbtn();//跳过按钮
                addinfo();//脚本信息
                changelayout();
                //速度调节部分

                window.onload = function () {
                    localStorage.setItem(keyThisTitle, JSON.stringify(window.document.title));//储存章节标题
                    // console.log("准备激活加速");
                    ratechg(playRateNow);
                    if (autoSkip == true) {//秒过功能，签完别尝试
                        setTimeout(function () {
                            skipVideo();
                        }, (submitTime + Math.ceil(Math.random() * randomX)));
                        console.log("秒过了！");

                    };

                    // ==================== 新增：单刷模式下隐藏考试按钮 ====================
                    var mode = localStorage.getItem("华医mode") || "1";
                    if (mode == "1") {
                        var examBtn = document.querySelector("#jrks");  // 考试按钮ID，根据实际页面调整
                        if (examBtn) {
                            examBtn.style.display = "none";
                            console.log("单刷模式：已隐藏考试按钮");
                        }
                    }
                    // ==================== 新增结束 ====================



                    var videoObj = document.querySelector("video");

                    // 视频结束时检查
                    videoObj.onended = function () {
                        console.log("视频 ended 事件触发，2秒后检查状态");
                        setTimeout(function () {
                            examherftest();
                        }, 2000);
                    };


                    // 原有静音和播放逻辑保持不变...

                    switch (e) {
                        case 1:
                            window.s2j_onPlayerInitOver()
                            {
                                // console.log("polyv加载完毕，静音，稍后尝试触发一次播放");
                                player?.j2s_setVolume(0);
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        //document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        player.j2s_resumeVideo();
                                        //document.querySelector("video").muted = true;
                                        examherftest();
                                        //document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("上一段代码有误");
                                    };
                                }, 2000); //延时点击播放，之前是5秒
                            };
                            break;
                        case 2:
                            window.on_CCH5player_ready()
                            {
                                //console.log("CCplayer加载完毕，静音，稍后尝试触发一次播放");
                                cc_js_Player?.setVolume(0);
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        //document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        cc_js_Player.play();
                                        //document.querySelector("video").muted = true;
                                        examherftest();
                                        //document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("上一段代码有误");
                                    };
                                }, 2000); //延时点击播放，之前是5秒
                            };
                            break;
                        default:
                            console.log("其他播放器？");
                    };

                };
            },
            doTest: function () {
                var questions = JSON.parse(localStorage.getItem(keyTest)) || {};
                var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
                if (JSON.stringify(qRightAnswer) == "{}") {
                    qRightAnswer = LoadRightAnwser();
                };
                var qTestAnswer = {};
                var index = 0;

                console.log("=== 开始答题 ===");
                console.log("keyTest:", questions);

                while (true) {
                    var question = document.querySelectorAll("table[class='tablestyle']")[index];
                    if (question == null) break;
                    else {
                        var qRaw = question.querySelector(".q_name").innerText.substring(2);
                        var q = qRaw.replace(/\s*/g, "");  // 删空格

                        console.log("处理题 " + index + ": q = '" + q + "'");

                        if (qRightAnswer.hasOwnProperty(q)) {
                            console.log("有正确答案: " + qRightAnswer[q]);
                            var rightSelection = findAnwser("tbody", index, qRightAnswer[q]);
                            rightSelection.click();
                        } else {
                            console.log("无正确答案，当前: " + (questions[q] || '无'));
                            if (questions.hasOwnProperty(q)) {
                                // 保持上次
                                console.log("保持上次选项: " + questions[q]);
                            } else {
                                questions[q] = "A";
                                console.log("新题，默认A");
                            };

                            // 检测选项数
                            var labels = document.querySelectorAll("tbody")[index].getElementsByTagName("label");
                            var numOptions = labels.length;
                            var maxLetter = String.fromCharCode("A".charCodeAt(0) + numOptions - 1);  // 4 → 'D', 5 → 'E'
                            console.log("题 " + index + " 选项数: " + numOptions + ", maxLetter: " + maxLetter);

                            var answer = getChoiceCode(questions[q]);
                            var element = labels[answer];

                            if (!element || answer >= numOptions) {
                                console.log("选项无效，重置A");
                                questions[q] = "A";
                                answer = 0;
                                element = labels[answer];
                            };
                            try {
                                var answerText = element.innerText.substring(3);
                                qTestAnswer[q] = answerText;
                                console.log("选 " + questions[q] + ": '" + answerText + "' (max: " + maxLetter + ")");
                            } catch (error) {
                                console.log("文本失败: " + error);
                                qTestAnswer[q] = "未知";
                            };
                            element.click();
                        };
                        index++;
                    };
                };

                localStorage.setItem(keyTest, JSON.stringify(questions));
                localStorage.setItem(keyTestAnswer, JSON.stringify(qTestAnswer));

                console.log("答题结束，qTestAnswer 键值对:", Object.entries(qTestAnswer));
                console.log("更新 keyTest:", questions);
                console.log("=== 答题结束 ===");

                setTimeout(function () {
                    document.querySelector("#btn_submit").click();
                }, (submitTime + Math.ceil(Math.random() * randomX)));

                function findAnwser(qakey, index, rightAnwserText) {
                    var answerslist = document.querySelectorAll(qakey)[index];
                    var arr = answerslist.getElementsByTagName("label");
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].innerText.substring(3) == rightAnwserText) {
                            return arr[i];
                        };
                    };
                };
            },
            doResult: function () {
                // 原有结果检测逻辑（增强 res 匹配，fallback 检查页面）
                var tipsTextEl = $(".tips_text")[0] || document.querySelector(".tips_text");
                var res = tipsTextEl ? tipsTextEl.innerText.trim() : "";  // trim() 去除空格
                var dds = $(".state_cour_lis");  // 兼容旧版
                var lis = document.querySelectorAll("ul.state_cour_ul li.state_cour_lis");  // 新结构
                localStorage.removeItem(keyResult); // 移除错题表缓存

                // ==================== 修复：优先图标 + 精确文本匹配，排除“未通过”误判 ====================
                var tipsImgEl = document.querySelector(".tips_img");
                var imgSrc = tipsImgEl ? tipsImgEl.src : "";
                var isPassed = false;

                // 优先：图标判断（更可靠，避免文本子串误判）
                if (imgSrc.includes("tips_success.png")) {
                    isPassed = true;
                    console.log("通过图标匹配：tips_success.png");
                    saveRightAnwser(); // 记录最后一次答对的题目
                    SaveAllAnwser(); // 存储所有记录的答案
                    cleanKeyStorage(); // 如果通过清理答案

                    // ==================== 修改：只搜索并点击“立即学习”按钮 ====================
                    setTimeout(function () {
                        var nextBtn = null;
                        // 优先新结构
                        if (lis.length > 0) {
                            console.log("检测到新考试结果界面（ul.state_cour_ul），搜索'立即学习'按钮...");
                            for (var i = 0; i < lis.length; i++) {
                                var btn = lis[i].querySelector("input.state_lis_btn[value='立即学习']");
                                if (btn) {
                                    nextBtn = btn;
                                    var titleEl = lis[i].querySelector("p.state_lis_text");
                                    console.log("找到下一个课程: " + (titleEl ? titleEl.title : "未知标题") + " (按钮: 立即学习)");
                                    break;  // 取第一个“立即学习”
                                }
                            }
                        } else if (dds.length > 0) {
                            // Fallback 旧结构
                            console.log("使用旧结构 fallback，搜索'立即学习'按钮...");
                            for (var i = 0; i < dds.length; i++) {
                                var btn = dds[i].querySelector("input.state_lis_btn[value='立即学习']");
                                if (btn) {
                                    nextBtn = btn;
                                    var titleEl = dds[i].querySelector("p");
                                    console.log("找到下一个课程 (旧结构): " + (titleEl ? titleEl.title : "未知标题") + " (按钮: 立即学习)");
                                    break;
                                }
                            }
                        }

                        if (nextBtn) {
                            // 有下一个：点击进入视频（学习后自动考试）
                            console.log("点击'立即学习'按钮，进入视频+考试循环");
                            nextBtn.click();
                        } else {
                            // 无下一个：所有完成，停止
                            console.log("未找到'立即学习'按钮，所有课程已完成或无需学习，无需进一步操作。备注：待考试按钮无实际作用不用尝试");
                            if (clock) clearInterval(clock);  // 停止主定时器
                        }
                    }, (1000 + Math.ceil(Math.random() * 2000)));  // 1-3秒随机延时
                    // ==================== 修改结束 ====================



                } else { // 考试没过
                    console.log("考试未通过，标记错题并重考");
                    // 提示文本
                    try {
                        if (tipsTextEl) {
                            tipsTextEl.innerText = "本次未通过，正在尝试更换答案\r\n（此为正常现象，脚本几秒后刷新，请勿操作）";
                        }
                    } catch (e) {
                        console.log("设置提示文本失败: " + e);
                    }

                    var qWrong = {};
                    var elements = (lis.length > 0) ? Array.from(lis) : (dds.length > 0 ? Array.from(dds) : document.querySelectorAll('li[class*="lis"]'));
                    if (elements.length > 0) {
                        console.log("搜索错题... 元素数量: " + elements.length);
                        for (var i = 0; i < elements.length; i++) {
                            var imgEl = elements[i].querySelector("img");
                            var imgSrc = imgEl ? imgEl.src : "无";
                            var btn = elements[i].querySelector("input.state_lis_btn");
                            var btnValue = btn ? btn.value : "无";
                            var isWrong = false;  // 补定义

                            console.log("检查元素 " + i + ": btnValue = '" + btnValue + "', imgSrc = '" + imgSrc + "'");

                            if (imgEl && imgEl.src && !imgEl.src.includes("bar_img")) {
                                isWrong = true;
                                console.log("  → img 错");
                            } else if (!imgEl) {
                                var textEl = elements[i].querySelector("p");
                                var text = textEl ? (textEl.title || textEl.innerText) : "无";
                                if (btnValue == "待考试" || text.includes("错") || btnValue.includes("未通过")) {
                                    isWrong = true;
                                    console.log("  → fallback 错 (btn: '" + btnValue + "')");
                                } else {
                                    console.log("  → fallback 无错");
                                }
                            } else {
                                console.log("  → img 正确");
                            }

                            if (isWrong) {
                                var titleEl = elements[i].querySelector("p");
                                var qTitle = titleEl ? titleEl.title.replace(/\s*/g, "") : "未知";
                                qWrong[qTitle] = i;
                                console.log("标记错题: '" + qTitle + "'");
                            }
                        }
                        console.log("qWrong:", qWrong);
                    } else {
                        console.log("未找到元素");
                    }

                    localStorage.setItem(keyResult, JSON.stringify(qWrong));
                    saveRightAnwser();

                    var retryCount = parseInt(localStorage.getItem("retryCount") || "0") + 1;
                    localStorage.setItem("retryCount", retryCount.toString());
                    console.log("重考次数: " + retryCount);

                    setTimeout(function () {
                        if (retryCount > 10) {
                            console.log("超限10次，停止");
                            localStorage.removeItem("retryCount");
                            window.location.reload();
                            return;
                        }
                        var retryBtn = document.querySelector("input[value='重新考试']") ||
                            document.querySelector("input.state_foot_btn[value='重新考试']") ||
                            document.querySelector("input.state_edu[value='重新考试']");
                        if (retryBtn) {
                            retryBtn.click();
                            console.log("点击重新考试 (第 " + retryCount + " 次)");
                        } else {
                            var onclickBtn = document.querySelector("input[value='重新考试'][onclick*='exam.aspx']");
                            if (onclickBtn && onclickBtn.onclick) {
                                var onclickStr = onclickBtn.onclick.toString();
                                var cwidMatch = onclickStr.match(/cwid=([a-f0-9-]+)/i);
                                if (cwidMatch) {
                                    var cwid = cwidMatch[1];
                                    window.location.href = 'exam.aspx?cwid=' + cwid;
                                    console.log("手动跳转重考: exam.aspx?cwid=" + cwid + " (第 " + retryCount + " 次)");
                                } else {
                                    console.log("无 cwid，刷新");
                                    window.location.reload();
                                }
                            } else {
                                console.log("无重考按钮，刷新");
                                window.location.reload();
                            }
                        }
                    }, (reTryTime + Math.ceil(Math.random() * randomX)) * 1);
                }
            },
        };
    };

    //---------------------------------全局函数区------------------------------//
    //答案记录函数区开始//
    function SaveAllAnwser() {//保存历史题目答案
        var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
        var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
        var qTitle = JSON.parse(localStorage.getItem(keyThisTitle)) || "没有记录到章节名称";
        var qOldAnswer = qAllAnswer[qTitle] || {};
        for (var q in qRightAnswer) {
            qOldAnswer[q] = qRightAnswer[q];
        };
        qAllAnswer[qTitle] = qOldAnswer;

        if (qAllAnswer != null) {//保存正确答案
            localStorage.setItem(keyAllAnswer, JSON.stringify(qAllAnswer));
        };
    };
    function LoadRightAnwser() {//加载历史题目答案
        var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
        //var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) ||{};
        var qTitle = JSON.parse(localStorage.getItem(keyThisTitle)) || "没有记录到章节名称";
        if (qTitle == "没有记录到章节名称") {
            console.log("没找到章节名称");
            return {};
        };
        var qOldAnswer = qAllAnswer[qTitle] || {};
        return qOldAnswer
    };
    function saveRightAnwser() {
        var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
        var qTestAnswer = JSON.parse(localStorage.getItem(keyTestAnswer)) || {};
        var qkeyTest = JSON.parse(localStorage.getItem(keyTest)) || {};
        var qWrongs = JSON.parse(localStorage.getItem(keyResult)) || {};

        // 简单键
        var stdWrongs = {};
        for (var wrongQ in qWrongs) {
            stdWrongs[wrongQ.replace(/\s*/g, "")] = qWrongs[wrongQ];
        }
        qWrongs = stdWrongs;

        console.log("=== saveRightAnwser ===");
        console.log("qWrongs:", qWrongs);
        console.log("qTestAnswer 键值对:", Object.entries(qTestAnswer));

        for (var q in qTestAnswer) {
            var stdQ = q.replace(/\s*/g, "");
            var isWrong = qWrongs.hasOwnProperty(stdQ);
            console.log("检查 q '" + q + "' (std: '" + stdQ + "'): 答 '" + qTestAnswer[q] + "', 错: " + isWrong);
            if (!isWrong) {
                console.log("正确: " + q + " = " + qTestAnswer[q]);
                qRightAnswer[q] = qTestAnswer[q];
            } else {
                console.log("错题: " + q + ", 切下一个");
                // 检测 maxLetter (从 qTestAnswer 推，假设上次答题有 labels)
                var numOptions = 5;  // 默认5，实际可从页面再检测，但 save 时无元素，固定或存
                var maxLetter = String.fromCharCode("A".charCodeAt(0) + numOptions - 1);
                if (qkeyTest.hasOwnProperty(q)) {
                    var oldOpt = qkeyTest[q];
                    qkeyTest[q] = getNextChoice(oldOpt, maxLetter);
                    console.log("  → 从 " + oldOpt + " 切到 " + qkeyTest[q] + " (max: " + maxLetter + ")");
                } else {
                    qkeyTest[q] = "B";
                    console.log("  → 默认切B");
                }
            };
        };
        localStorage.removeItem(keyTestAnswer);
        localStorage.setItem(keyRightAnswer, JSON.stringify(qRightAnswer));
        localStorage.setItem(keyTest, JSON.stringify(qkeyTest));

        console.log("更新 qRightAnswer:", qRightAnswer);
        console.log("更新 keyTest:", qkeyTest);
        console.log("=== 结束 ===");
    };
    //答案记录函数区结束//

    //答案复制相关按钮
    function addAnwserCopybtn() {//插入答案复制按钮
        let alink = document.createElement("a");
        alink.innerHTML = '显示已记录答案';
        alink.style = btstyleB;

        alink.onclick = function (event) {
            var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
            var Aout = JSON.stringify(qAllAnswer, null, "\t")
            //Aout=encodeURIComponent(Aout);
            //window.prompt("请复制",Aout);
            if (document.getElementById("AnwserOut")) {
                document.getElementById("AnwserOut").innerHTML = Aout;
            } else {
                let textout = document.createElement("textarea");
                textout.id = "AnwserOut";
                textout.innerHTML = Aout;
                textout.rows = 20;
                textout.cols = 30;
                document.getElementById("main_div").parentNode.append(textout);
            };

        };
        document.getElementById("main_div").parentNode.append(alink);

    };
    function DelAllAnwser() {//插入清除答案按钮
        let alink = document.createElement("a");
        alink.innerHTML = '清除已记录答案';
        alink.style = btstyleB;

        alink.onclick = function (event) {

            var r = confirm("确定清除历史答案？!");
            if (r) {
                localStorage.removeItem(keyAllAnswer);
            };
        };
        document.getElementById("main_div").parentNode.append(alink);
    };
    //答案复制相关按钮 end
    function skipVideo() {//这是跳过视频的代码
        var oVideo = document.getElementsByTagName('video')[0];
        if (oVideo) {
            oVideo.currentTime = oVideo.duration - 1
        };
    };

    function clickexam() { //延时点击考试按钮。
        // 计算总延时时间
        let delay = examTime + Math.ceil(Math.random() * randomX);
        console.log("延时时间总共是: " + delay + " 毫秒");  // 输出总延时
        setTimeout(function () {
            document.querySelector("#jrks").click();
            console.log("已点击考试按钮"); //确认点击后再输出
        //}, (Math.ceil(Math.random() * randomX)));
        }, delay);
    };
    //按钮插入函数相关
    function addSkipbtn() {//插入按钮快进视频按钮
        let alink = document.createElement("a");
        alink.innerHTML = '快进视频';
        alink.style = btstyleA;

        alink.onclick = function (event) {
            skipVideo();
        };
        document.querySelector("div[id='jj']").parentNode.append(alink);
    };

    function addratebtn(ra) {//倍率调整按钮
        let alink = document.createElement("a");
        alink.innerHTML = '' + ra + 'x';
        alink.style = btstyleB;
        alink.className = "speed";
        alink.id = ra + "x";
        alink.onclick = function (event) {
            ratechg(ra);
            try {
                var arr = document.querySelectorAll("a[class='speed']");
                arr.forEach(function (item, index, arr) {
                    arr[index].style = btstyleB;
                });
            } catch (error) {
            };
            alink.style = btstyleC;
        };
        document.querySelector("div[id='jj']").parentNode.append(alink);
    }
    function ratechg(ra) {//倍率调整
        var videoObj = document.querySelector("video")
        try {
            clearInterval(nspeed);
            nspeed = setInterval(() => {
                videoObj.playbackRate = ra;
            }, 1 * 1000);
            localStorage.setItem(keyPlayRate, ra);
            //document.querySelector("a[id=" + "'" + ra + "x']").style = btstyleC;
            //document.getElementById("playrate").innerHTML = "当前播放速率" + ra + "x";
            //console.log("倍率调整为" + ra);
        } catch (error) { console.log("倍率调整错误" + error); };
    };
    function addrateinfo() {//插入说明
        let adiv1 = document.createElement("div");
        adiv1.innerHTML = '当前播放速率';
        adiv1.id = 'playrate';
        adiv1.style = "font-size: 15px;text-align: center;margin-top: 10px;";
        document.querySelector("div[id='jj']").parentNode.append(adiv1);

    };
    function addinfo() {//插入说明
        // 确定初始模式文本
        var moderesult = localStorage.getItem("华医mode");
        var modeText = (moderesult == '2') ? "当前模式：视频+考试" : "当前模式：单刷视频";

        // 创建模式切换按钮
        var checkbox = document.createElement('div');
        checkbox.innerHTML = '<a id="mode" class="btn" style="font-size:22px; background-color: rgba(251, 255, 0, 0.95); transition: background-color 0.3s;" >' + modeText + '<br> [点击此处切换]</a > ';
        document.querySelector("div[id='jj']").parentNode.append(checkbox);

        // 定义一个函数，用于根据当前模式更新UI（按钮文字和面板颜色）
        function updateModeStyle() {
            var currentMode = localStorage.getItem("华医mode");
            var panel = document.getElementById('Div1');
            var modeButton = document.getElementById('mode');
            if (currentMode == '2') {
                modeButton.innerText = "当前模式：视频+考试\n[点击此处切换]";
                panel.style.backgroundColor = "rgba(255, 204, 203, 0.8)"; // 淡红色背景
            } else {
                modeButton.innerText = "当前模式：单刷视频\n[点击此处切换]";
                panel.style.backgroundColor = "rgba(184, 247, 255, 0.7)"; // 原始淡蓝色背景
            }
        }

        // 页面加载时立即应用一次样式
        updateModeStyle();

        // 为按钮绑定点击事件
        document.getElementById('mode').onclick = function () {
            var currentMode = localStorage.getItem("华医mode");
            if (currentMode == '2') {
                localStorage.setItem("华医mode", "1"); // 从模式2切换到模式1
            } else {
                localStorage.setItem("华医mode", "2"); // 从模式1切换到模式2
            }
            updateModeStyle(); // 每次点击后立即更新UI
        };

        // --- 原始脚本中的其他说明内容 ---
        let adiv2 = document.createElement("div");
        adiv2.innerHTML = '切换模式后请刷新一下网页';
        adiv2.id = 'jsinfo';
        adiv2.style = "position:relative;left:10px;top:5px;width:240px; font-size:13px;text-align: justify;border: 1px dashed #ff9595;padding:5px;";
        document.querySelector("div[id='jj']").parentNode.append(adiv2);
        $('div:contains("观看视频完成后,才能进入考试")').eq(-1)
            .html('建议Chrome+tampermonkey<br>F12控制台查看动作') //html可换行
            .css('height', '92px');  // 修改高度为 200px（可调整值）
    };

    function changelayout() {

        document.querySelector("div[id='jj']").remove();
        //document.querySelector("img[id='photo']").outerHTML = `<img id="photo" alt="" src="` + `" style="width: 120px; height: 120px;">`;
        //document.querySelector("img[id='photo']").style.width = "120px";
        //document.querySelector("img[id='photo']").style.height = "120px";

        document.querySelectorAll("div[class='title']")[0].children[0].style = "color: #2600ffff;font-weight: bold";
        document.querySelectorAll("div[class='title']")[0].children[0].innerText = "模式切换";
        //document.querySelector("div[class='imgtext']").children[1].style.width = "125px";
        //document.querySelector("div[class='imgtext']").children[1].style = "color: #ff0000;padding-top:10px";
        //document.querySelector("div[class='imgtext']").children[1].innerText = "作 者\n创作优化不易\n投点小费吧\n❤谢啦❤\n❤"
        //document.querySelector("div[class='imgtext']").children[1].style.left = "10px";
        document.querySelector("div[class='top']").outerHTML = '<div class="top" style="padding-top: 6px;font-size:18px;color: #ff0000;">如服务器调整，脚本可能失效。反馈意见请在Greasyfork私信或脚本反馈区联络。</div>';


    };

    function cleanKeyStorage() {//缓存清理
        localStorage.removeItem(keyTest);
        localStorage.removeItem(keyResult);
        localStorage.removeItem(keyTestAnswer);
        localStorage.removeItem(keyRightAnswer);
    };

    // 这是一个专门负责“播放下一个视频”的辅助函数，逻辑清晰，易于管理
    function playNextVideo() {
        console.log("正在执行“播放下一个视频”的逻辑...");
        try {
            const targetElements = document.querySelectorAll("i[id='top_play']");
            if (targetElements.length === 0) {
                console.log("未找到当前视频位置，尝试备用方案");
                gotoNextVideoByButton();
                return;
            }
            const parentElement = targetElements[0].parentElement;
            const grandparentElement = parentElement.parentElement;
            const lis = document.querySelectorAll("li[class='lis-inside-content']");
            var index = Array.from(lis).findIndex(li => li === grandparentElement);

            if (index !== -1 && (index + 2 <= lis.length)) {
                let nextIndex = index + 2;
                console.log("按顺序找到下一个视频，位置: " + nextIndex);
                const nextH2 = document.querySelector("#top_body > div.video-container > div.page-container > div.page-content > ul > li:nth-child(" + nextIndex + ") > h2");
                if (nextH2) {
                    nextH2.click();
                    console.log("已点击下一个视频链接");
                    return;
                }
            }

            // 备用方案：寻找未完成视频
            console.log("已是列表末尾或点击失败，启动备用方案寻找未完成的视频。");
            gotoNextVideoByButton();
        } catch (e) {
            console.error("在 playNextVideo 函数中出错: ", e);
            gotoNextVideoByButton();  // 出错时也用备用
        }
    };
    // 新增辅助函数：通过按钮状态查找并跳转下一个视频（备用）
    function gotoNextVideoByButton() {
        var mode = localStorage.getItem("华医mode") || "1";
        if (mode !== "1") return;  // 只在单刷模式下执行备用，确保不干扰考试模式

        console.log("执行备用跳转逻辑（单刷模式）");
        try {
            // 优先找“未学习”
            if ($('button:contains("未学习")').length > 0) {
                console.log("备用方案：找到“未学习”的视频。");
                var nextBtn = $('button:contains("未学习")').eq(0);
                var nextLink = nextBtn.siblings('h2').eq(0);  // 假设 siblings 是 h2 链接
                if (nextLink.length > 0) {
                    nextLink.click();
                } else {
                    // 失败时，构造 URL（基于当前 cwid 和 vid 推下一个）
                    var currentUrl = window.location.href;
                    var cwid = new URLSearchParams(currentUrl.split('?')[1]).get('cwid');
                    if (cwid) {
                        // 假设下一个 vid 是当前 vid +1（需根据实际列表调整，或从页面提取所有 vid）
                        var currentVid = new URLSearchParams(currentUrl.split('?')[1]).get('vid') || '1';
                        var nextVid = parseInt(currentVid) + 1;
                        var nextUrl = currentUrl.replace(/vid=\d+/, 'vid=' + nextVid);
                        window.location.href = nextUrl;
                        console.log("备用 URL 跳转: " + nextUrl);
                    }
                }
            } else if ($('button:contains("学习中")').length > 0) {
                // 同上，处理“学习中”
                console.log("备用方案：找到“学习中”的视频。");
                // ... 类似逻辑
            } else {
                console.log('所有视频任务点似乎都已完成。脚本将停止自动切换。');
                if (clock) clearInterval(clock); // 停止主定时器
            }
        } catch (e) {
            console.error("备用跳转失败: ", e);
        }
    };



    // 这是全新的总指挥函数，负责判断模式并分发任务
    // ==================== 修改：examherftest() 作为备用，单刷模式优先提前逻辑 ====================
    // ==================== 优化：examherftest() - 优先防 "已完成" + 轮询 #jrks 可点击 ====================
    function examherftest() {

        var state = document.querySelectorAll("i[id='top_play']")[0]?.parentNode?.nextElementSibling?.nextElementSibling?.nextElementSibling?.innerText || "";

        // 单刷模式和考试模式都要检查已完成：已完成是为了直接跳过播放下一个视频服务的
        if (state == "已完成") {
            console.log("备用检查：视频已完成，单刷模式下切换下一个");
            playNextVideo();
            return;
        }


        // 视频+考试模式：您的建议逻辑
        console.log("视频+考试模式：检查状态 (时间: " + new Date().toLocaleTimeString() + ")");
        var mode = localStorage.getItem("华医mode") || "2";
        var examBtn = document.querySelector("#jrks");

        if (mode == "1") {

            // 否则：轮询 #jrks 可点击. 放弃检查<a>的disabled因为对于<a>标签不适用，实际原网页jQUERY逻辑
            if (examBtn && $(examBtn).attr("disabled") !== "disabled") {
                console.log("state = '" + state + "', #jrks 可点击，播放下一个");
                playNextVideo();
                return;
            }

        }

        if (mode == "2") {

            // 否则：轮询 #jrks 可点击. 放弃检查<a>的disabled因为对于<a>标签不适用，实际原网页jQUERY逻辑
            if (examBtn && examBtn.style.display !== "none" && $(examBtn).attr("disabled") !== "disabled") {
                console.log("state = '" + state + "', #jrks 可点击，进入考试");
                clickexam();
                return;
            }

            console.log("state = '" + state + "', #jrks 不可点击 (display: " + (examBtn ? examBtn.style.display : "无") + ", disabled: " + (examBtn ? examBtn.disabled : "无") + ")，继续轮询");
            // 备用：如果 state "待考试" 但按钮不可，强制跳转
            if (state == "待考试" && examBtn) {
                console.log("state '待考试' 但按钮不可，备用跳转");
                var currentUrl = window.location.href;
                var cwid = new URLSearchParams(currentUrl.split('?')[1]).get('cwid');
                if (cwid) {
                    window.location.href = '/pages/exam.aspx?cwid=' + cwid;
                    console.log("备用跳转: /pages/exam.aspx?cwid=" + cwid);
                }
            }
        }
    }
    // ==================== 优化结束 ====================
    // ==================== 修改结束 ====================

    //课堂问答跳过，临时版
    function sleep(timeout) {
        return new Promise((resolve) => { setTimeout(resolve, timeout); });
        console.log("课堂问答循环调用");
    };
    function asynckillsendQuestion() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            };
            //console.log("课堂问答跳过插入");
            player.sendQuestion = function () {
                //console.log("播放器尝试弹出课堂问答，已屏蔽。");
            };
        })();
    };
    function killsendQuestion2() {
        if (typeof (isInteraction) == "undefined") {
            //console.log('变量未定义');
        } else {
            console.log('isInteraction设置off');
            isInteraction = "off";
        };
    };
    function killsendQuestion3() { // 点击跳过按钮版的跳过课堂答题
        var clockms = setInterval(async function () {
            try {
                if ($('.pv-ask-head').length && $('.pv-ask-head').length > 0) {
                    console.log("检测到问题对话框，尝试跳过");
                    $(".pv-ask-skip").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($('.signBtn').length && $('.signBtn').length > 0) {
                    console.log("检测到签到对话框，尝试跳过");
                    $(".signBtn").click();
                };
            } catch (err) {
                console.log(err);
            };

            // ==================== 修改/新增部分开始 ====================
            // 这里是针对你提到的“温馨提示”弹窗的修改。
            // 之前的代码是寻找一个特定的按钮，但弹窗的结构可能已改变。
            // 新的逻辑是直接检查ID为'div_processbar_tip'的弹窗是否可见。
            try {
                // 使用 .is(":visible") 来判断弹窗是否在屏幕上显示
                if ($("div[id='div_processbar_tip']").is(":visible")) {
                    console.log("检测到温馨提示对话框（不能拖拽），尝试自动点击“知道了”");
                    // 找到弹窗内的“知道了”按钮并模拟点击
                    $("div[id='div_processbar_tip'] input[value='知道了']").click();
                }
            } catch (err) {
                console.log(err);
            };
            // ==================== 修改/新增部分结束 ====================

            try {
                if ($("button[class='btn_sign']").length && $("button[class='btn_sign']").length > 0) {
                    console.log("检测到温馨提示对话框（疲劳提醒），尝试跳过");
                    $("button[class='btn_sign']").click();
                };
            } catch (err) {
                console.log(err);
            };


            try {
                var state = document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                if ($('video').prop('paused') == true && state != "已完成") {
                    console.log("视频意外暂停，恢复播放");
                    $('video').get(0).play();
                    $('video').prop('volumed') = 0;
                    $('video').prop('muted') = true;
                } else if (state == "已完成") {
                    document.querySelector("video").pause();
                    //clearInterval(clockms);
                };
            } catch (err) {
                //console.log(err);
            };
        }, 2000);
    };

    function advis() {
        let div1 = document.createElement("div");
        div1.innerHTML = `
        <div id='Div1' style="width:150px;text-align:left;padding: 10px 10px;font-family:微软雅黑;font-size:20px;float: left;position:fixed;top:140px;left: 100px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;">
        <span id='clo' style="float: right;position: absolute;top:14px;right:5px;cursor:pointer;font-size:16px">❎</span>
        <div style="font-size:22px;font-weight:bolder;color:red;">华医网助手`+ GM_info['script']['version'] + `</div>
        <hr style="margin-top: 10px;margin-bottom: 10px;">
        <span id="tixing" style="font-size:16px;font-weight:normal;color:black;text-align:left;">当前页面无代码！！！</span><br>
        <img id="Pic" style = "display:none;width:auto;height:220px;object-fit: contain;" src="' + + '" >
        <br>
        <a id='update' class='spe' style="font-size:14px;font-weight:normal;color:black;white-space:pre-wrap;">最近更新:<br>`+ newupdate + `</a><br>
        </div> ` //GM_info是从userscript读取的。模板字面量内无法注释
        //<span style="font-size:18px;font-weight:bold;color:black;">其他脚本</span><br>
        //<a id='Share1' class='spe' style="font-size:16px;font-weight:bold;color:red;cursor:pointer;">👉&nbsp好医生小助手</a><br>
        //<a id='Share2' class='spe' style="font-size:16px;font-weight:bold;color:red;cursor:pointer;">👉&nbsp成都继教医学教育平台</a><br>
        //<a class='spe' style="font-size:16px;font-weight:normal;color:black;white-space:pre-wrap;">😁</a>; 这四行移到了上面div1.innerHTML = ``外进行了注释
        document.body.append(div1);
        //let share1 = document.querySelector("a[id='Share1']");
        //let share2 = document.querySelector("a[id='Share2']");
        let clo = document.querySelector("span[id='clo']");
        //share1.onclick = function () {
        //  window.open("https://greasyfork.org/zh-CN/scripts/500010", "_blank");
        // };
        // share2.onclick = function () {
        //  window.open("https://greasyfork.org/zh-CN/scripts/494635", "_blank");
        // };
        clo.onclick = function () {
            document.querySelector("div[id='Div1']").style.display = "none";
        };
    };


    //---------------------------------全局函数区end------------------------------//



})();