// ==UserScript==
// @name          好医生-视频与考试
// @namespace     https://greasyfork.org/zh-CN/users/1386658-openscript
// @version       1.6.4-20250927
// @description   好医生课程视频倍速与跳过，考试自动答题。
// @author        OpenScript
// @license MIT
// @require       https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @match         *://cme.haoyisheng.com/cme/polyv.jsp*
// @match         *://cme.haoyisheng.com/cme/study2.jsp*
// @match         *://cme.haoyisheng.com/cme/exam.jsp*
// @match         *://cme.haoyisheng.com/cme/examQuizFail.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/polyv.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/exam.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/examQuizFail.jsp*
// @match         *://*.cmechina.net/cme/polyv.jsp*
// @match         *://*.cmechina.net/cme/study2.jsp*
// @match         *://*.cmechina.net/cme/exam.jsp*
// @match         *://*.cmechina.net/cme/examQuizFail.jsp*
// @run-at        document-end
// @grant         unsafeWindow
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_openInTab
// @grant         GM_notification
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/552881/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E8%A7%86%E9%A2%91%E4%B8%8E%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/552881/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E8%A7%86%E9%A2%91%E4%B8%8E%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyle(id, tag, css, element) {
        tag = tag || 'style';
        element = element || 'body';
        let doc = document, styleDom = doc.getElementById(id);
        if (styleDom) styleDom.remove();
        let style = doc.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        doc.getElementsByTagName(element)[0].appendChild(style);
    }
    try {
        addStyle('swal-pub-style', 'style', '.swal2-container{z-index:1999;}' + GM_getResourceText('Swal'));
    } catch (e) {
        console.warn('加载 SweetAlert 资源失败：', e);
    }

    const buttonCssText = 'position: absolute;z-index: 99;top: -50px;right: 0;padding:10px;cursor:pointer;background: #3087d9;color: #fff;border-radius: 10px;box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);';

    const lastPath = getLastUrlPath();
    const examId = `${getUrlParams('course_id')}_${getUrlParams('paper_id')}`;

    function getUrlParams(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }
    function getLastUrlPath() {
        const pathList = window.location.pathname.split('/');
        return pathList[pathList.length - 1];
    }

    const channelName = `NoMoreExam_${examId}`;
    function sendMessageToOtherTab(message) {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage(message);
    }
    function setupMessageListener(handler) {
        const channel = new BroadcastChannel(channelName);
        channel.onmessage = (event) => {
            const receivedMessage = event.data;
            handler(receivedMessage);
        };
    }

    function alertAnswerFailedMsg(index) {
        alert(`全部遍历但未找到第${index}题的正确答案, 请确定是使用脚本按钮开始答题! 请关闭此页面重新开始考试`);
    }
    function getNextChoice(str, questionIndex) {
        const code = str.charCodeAt(0) + 1;
        if (code === 70) {
            alertAnswerFailedMsg(questionIndex + 1);
            return 'A';
        }
        return String.fromCharCode(code);
    }
    function getNextMultipleChoice(str, questionIndex) {
        const dic = ['ABCDE', 'BCDE', 'ACDE', 'ABDE', 'ABCE', 'ABCD', 'CDE', 'BDE', 'BCE', 'BCD', 'ADE', 'ACE', 'ACD', 'ABE', 'ABD', 'ABC', 'DE', 'CE', 'CD', 'BE', 'BD', 'BC', 'AE', 'AD', 'AC', 'AB', 'E', 'D', 'C', 'B', 'A'];
        const index = dic.indexOf(str);
        if (index === dic.length - 1) {
            alertAnswerFailedMsg(questionIndex + 1);
            return dic[0];
        }
        return dic[index + 1];
    }

    function customQuerySelector(selectors) {
        return document.querySelectorAll(selectors)[0];
    }

    if (lastPath === ('examQuizFail.jsp')) {
        if (location.host === 'bjsqypx.haoyisheng.com') {
            const error_order = getUrlParams('error_order');
            sendMessageToOtherTab(error_order);
            window.close();
            return;
        }
        const nowAnswerStr = window.location.search.split('ansList=')[1].split('&')[0];
        const nowAnswerList = nowAnswerStr.split(',');

        let currentQuestionIndex = 0;
        const answersList = document.querySelectorAll('.answer_list h3');
        let finished = true;
        for (let i = 0; i < answersList.length; i++) {
            currentQuestionIndex = i;
            if (answersList[i].className.includes('cuo')) {
                finished = false;
                if (nowAnswerList[i].length === 1) {
                    nowAnswerList[i] = getNextChoice(nowAnswerList[i], currentQuestionIndex);
                } else {
                    nowAnswerList[i] = getNextMultipleChoice(nowAnswerList[i], currentQuestionIndex);
                }
                window.location.href = window.location.href.replace(nowAnswerStr, nowAnswerList.join(','));
                break;
            }
        }
        if (finished) {
            sendMessageToOtherTab(JSON.stringify(nowAnswerList));
            window.close();
        }
        return;
    }
    if (lastPath === ('exam.jsp')) {
        const isBjsqypx = location.host === 'bjsqypx.haoyisheng.com';
        const questionsList = isBjsqypx ? document.querySelectorAll('.kaoshi dl') : document.querySelectorAll('.exam_list li');
        const submitBtn = isBjsqypx ? customQuerySelector('.but_box .btn1') : customQuerySelector('#tjkj');
        const nowAnswerObjList = [];
        const autoSelectAnswer = answerArray => {
            const indexMap = {
                'A': 0,
                'B': 1,
                'C': 2,
                'D': 3,
                'E': 4
            };
            for (let i = 0; i < questionsList.length; i++) {
                const answer = answerArray[i];
                const optionsList = questionsList[i].querySelectorAll('p');
                if (questionsList[i].querySelectorAll('input[type="radio"]').length > 0) {
                    const index = indexMap[answer] || 0;
                    const answerItem = optionsList[index];
                    const input = answerItem.children[0];
                    nowAnswerObjList[i] = {
                        type: 1,
                        value: input.value
                    };
                    input.dispatchEvent(new MouseEvent('click'));
                    continue;
                }
                for (let i = 0; i < optionsList.length; i++) {
                    const answerItem = optionsList[i];
                    nowAnswerObjList[i] = {
                        type: 2,
                        value: answer
                    };
                    const input = answerItem.children[0];
                    if (answer.includes(input.value) && !input.checked) {
                        input.dispatchEvent(new MouseEvent('click'));
                    }
                }
            }
        };
        const messageHandler = message => {
            autoSelectAnswer(JSON.parse(message));
            customQuerySelector('form').removeAttribute('target');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        };
        const qypxMessageHandler = message => {
            const errorOrderList = message.split(',');
            errorOrderList.forEach(order => {
                const index = parseInt(order, 10) - 1;
                const answer = nowAnswerObjList[index].value;
                nowAnswerObjList[index].value = nowAnswerObjList[index].type === 1 ? getNextChoice(answer) : getNextMultipleChoice(answer);
            });
            autoSelectAnswer(nowAnswerObjList.map(item => item.value));
            customQuerySelector('form').setAttribute('target', '_blank');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        };

        setupMessageListener(isBjsqypx ? qypxMessageHandler : messageHandler);

        const examSkipButton = document.createElement('button');

        examSkipButton.innerText = '考试? 拿来吧你!';
        examSkipButton.id = 'exam_skip_btn';
        examSkipButton.style.cssText = buttonCssText;
        examSkipButton.style.top = '55px';
        examSkipButton.style.right = '150px';

        examSkipButton.addEventListener('click', () => {
            const answersArray = new Array(questionsList.length).fill('ABCDE');
            autoSelectAnswer(answersArray);
            customQuerySelector('form').setAttribute('target', '_blank');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        });

        if (isBjsqypx) {
            examSkipButton.style.top = '0px';
            examSkipButton.style.right = '50px';
            examSkipButton.style.border = 'none';
            customQuerySelector('.content').appendChild(examSkipButton);
        } else {
            customQuerySelector('.main').appendChild(examSkipButton);
        }

        if (localStorage.getItem('script_auto_exam') === 'true') {
            examSkipButton.dispatchEvent(new MouseEvent('click'));
        }
        return;
    }
    // 视频跳过

    // 声明 intervalR 避免未定义错误
    let intervalR = null;

    setTimeout(() => {
        let fuckingPlayer = null;

        function initPlayer() {
            const localNoticeSkip = localStorage.getItem('swal_notice_skip');

            if (unsafeWindow.player && unsafeWindow.player.params) {
                try {
                    unsafeWindow.player.params.rate_allow_change = true;
                } catch (e) {
                    console.warn('设置 player.params 失败：', e);
                }
                fuckingPlayer = unsafeWindow.player;
            } else if (unsafeWindow.cc_js_Player && unsafeWindow.cc_js_Player.params) {
                try {
                    unsafeWindow.cc_js_Player.params.rate_allow_change = true;
                } catch (e) {
                    console.warn('设置 cc_js_Player.params 失败：', e);
                }
                fuckingPlayer = unsafeWindow.cc_js_Player;
            }

            // 保持 customQuerySelector 的使用，不建议全局覆盖 document.querySelector，若确实需要覆盖请注意兼容性
            document.querySelector = function (selectors) {
                return document.querySelectorAll(selectors)[0];
            };

            if (fuckingPlayer) {
                if (!localNoticeSkip) {
                    try {
                        Swal.fire({
                            title: "播放器获取成功",
                            text: "倍速与一键看完功能已正常!",
                            icon: "success"
                        });
                    } catch (e) {
                        console.warn('Swal 弹窗失败：', e);
                    }
                }
                localStorage.setItem('swal_notice_skip', 'true');
            } else {
                localStorage.removeItem('swal_notice_skip');
                try {
                    Swal.fire({
                        title: "播放器获取失败",
                        text: "似乎网站未被正确兼容? 功能可能不正常",
                        icon: "question",
                    });
                } catch (e) {
                    console.warn('Swal 弹窗失败：', e);
                }
            }
        }

        if (customQuerySelector('.main')) {
            customQuerySelector('.main').style.marginTop = '40px';
        }

        // 安全清理 intervalR（之前未声明会报错）
        if (intervalR) {
            try {
                unsafeWindow.clearInterval(intervalR);
            } catch (e) {
                console.warn('clearInterval(intervalR) 失败：', e);
            }
            intervalR = null;
        }

        // 仅适用chromium — 仍保留，但保护调用以免抛异常
        try {
            unsafeWindow.clearInterval(1);
        } catch (e) {
            // ignore
        }

        initPlayer();

        const video = customQuerySelector('.pv-video') || customQuerySelector('video');
        if (!video) {
            console.warn('未找到 video 元素，脚本停止执行（可能页面元素名已变更）');
            return;
        }
        const parent = video.parentElement;
        const videoSkipButton = document.createElement('button');
        const selecterLabel = document.createElement('label');
        const playRateSelecter = document.createElement('select');
        const playRateCheckbox = document.createElement('input');
        const checkboxContainer = document.createElement('div');
        const videoCheckboxLabel = document.createElement('label');
        const videoCheckbox = document.createElement('input');
        const examCheckboxLabel = document.createElement('label');
        const examCheckbox = document.createElement('input');

        const containerCssText = 'position: absolute;height: 37px;line-height: 37px;top: -50px;right: 140px;';
        const labelCssText = 'vertical-align: middle;margin-right: 5px;line-height: 37px;color: #3087d9;font-size: 15px;';
        const controllerCssText = 'vertical-align: middle;cursor: pointer; margin-right: 5px;';

        checkboxContainer.style.cssText = containerCssText;
        // 跳过按钮
        videoSkipButton.innerText = '看视频? 拿来吧你!';
        videoSkipButton.style.cssText = buttonCssText;
        // 自动看完
        videoCheckboxLabel.innerText = '自动看完:';
        videoCheckboxLabel.style.cssText = labelCssText;
        videoCheckbox.type = 'checkbox';
        videoCheckbox.style.cssText = controllerCssText;
        // 自动开考
        examCheckboxLabel.innerText = '进入考试后自动开考:';
        examCheckboxLabel.style.cssText = labelCssText;
        examCheckbox.type = 'checkbox';
        examCheckbox.style.cssText = controllerCssText;
        // 倍速
        selecterLabel.innerText = '倍速:';
        selecterLabel.style.cssText = labelCssText;
        playRateSelecter.style.cssText = controllerCssText;
        playRateSelecter.style.border = '1px solid #000';
        playRateCheckbox.type = 'checkbox';
        playRateCheckbox.style.cssText = controllerCssText;
        // 倍速选择器初始化选项
        for (let i = 1; i <= 15; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.label = i;
            playRateSelecter.appendChild(option);
        }

        playRateSelecter.addEventListener('change', () => {
            localStorage.setItem('play_back_rate', playRateSelecter.value);
            if (palyRateEnable) {
                video.playbackRate = parseInt(playRateSelecter.value);
            }
        });
        playRateCheckbox.addEventListener('change', e => {
            const value = e.target.checked;
            localStorage.setItem('play_back_rate_enable', JSON.stringify(value));
            if (value) {
                video.playbackRate = parseInt(playRateSelecter.value);
            } else {
                video.playbackRate = 1;
            }
        });
        videoCheckbox.addEventListener('change', e => {
            const autoValue = e.target.checked;
            localStorage.setItem('script_auto_skip', JSON.stringify(autoValue));
        });
        examCheckbox.addEventListener('change', e => {
            const autoValue = e.target.checked;
            localStorage.setItem('script_auto_exam', JSON.stringify(autoValue));
        });
        videoSkipButton.addEventListener('click', () => {
            let videoDuration = video.duration;
            if (fuckingPlayer) {
                videoDuration = fuckingPlayer.getDuration() - 0.5;
                try {
                    fuckingPlayer.setVolume(0);
                    fuckingPlayer.play();
                    fuckingPlayer.jumpToTime(videoDuration);
                } catch (e) {
                    console.warn('fuckingPlayer 操作失败：', e);
                }
            } else {
                video.volume = 0;
                video.playbackRate = parseInt(playRateSelecter.value);
                try {
                    video.currentTime = video.duration;
                } catch (e) {
                    console.warn('设置 video.currentTime 失败：', e);
                }
            }
            // 使用字符串键，避免引用未声明变量
            if (unsafeWindow.see) {
                localStorage.setItem('see', 1);
            }
            if (unsafeWindow.see2) {
                localStorage.setItem('see2', videoDuration);
            }
        });

        if (customQuerySelector('.content .h5')) {
            customQuerySelector('.content .h5').style.marginBottom = '50px';
            checkboxContainer.style.top = '-45px';
            videoSkipButton.style.top = '-45px';
            videoSkipButton.style.border = 'none';
        }
        if (customQuerySelector('.ccH5playerBox')) {
            customQuerySelector('.ccH5playerBox').style.overflow = 'visible';
        }

        checkboxContainer.append(examCheckboxLabel, examCheckbox, videoCheckboxLabel, videoCheckbox, selecterLabel, playRateCheckbox, playRateSelecter);
        parent.append(checkboxContainer, videoSkipButton);

        // 默认直接勾选并执行（你之前希望默认启用）
        try {
            videoCheckbox.checked = true;
            videoSkipButton.dispatchEvent(new MouseEvent('click'));
        } catch (e) {
            console.warn('自动触发看完失败：', e);
        }

        if (localStorage.getItem('script_auto_exam') === 'true') {
            examCheckbox.checked = true;
        }

        const localRate = localStorage.getItem('play_back_rate');
        const palyRateEnable = localStorage.getItem('play_back_rate_enable');
        if (!localRate) {
            return;
        }
        let rate = parseInt(localRate);
        if (!isNaN(rate) && rate >= 1 && rate <= 15) {
            playRateSelecter.value = localRate;
        } else {
            playRateSelecter.value = '10';
            rate = 10;
        }

        if (palyRateEnable === 'true') {
            playRateCheckbox.checked = true;
            video.playbackRate = rate;
        }
    // 在视频播放控制逻辑后增加自动切换功能
    setInterval(() => {
    if (!fuckingPlayer) return;

    let currentTime = parseInt(fuckingPlayer.getPosition());
    let duration = parseInt(fuckingPlayer.getDuration());

    if (currentTime >= duration - 1) { // 视频播放完毕
        console.log("当前视频播放完毕，尝试切换下一个视频");

        try {
            const courseList = document.querySelectorAll("ul[id='s_r_ml'] li");
            let foundNext = false;
            for (let i = 0; i < courseList.length; i++) {
                if (courseList[i].className != "active" && courseList[i].outerText.includes("未学习")) {
                    console.log("点击下一个未学习视频：" + courseList[i].outerText.replace("未学习", ""));
                    courseList[i].querySelector("a").click();
                    foundNext = true;
                    break;
                }
            }
            if (!foundNext) {
                console.log("已完成全部视频，学习结束");
                Swal.fire({
                    title: "恭喜",
                    text: "已完成全部视频学习！",
                    icon: "success"
                });
            }
        } catch (e) {
            console.error("自动切换视频失败", e);
        }
    }
    }, 5000); // 每5秒检查一次视频播放状态

    }, 1500);
})();
