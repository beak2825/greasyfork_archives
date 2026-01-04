// ==UserScript==
// @name         DGUT Ulearning Tool
// @version 1.1.0
// @match        https://ua.dgut.edu.cn/learnCourse/learnCourse.html*
// @description  一个适用于新版本DGUT U学院的脚本，支持自动播放视频，调整倍速，并从官方API获取章节测验答案。
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1537344
// @downloadURL https://update.greasyfork.org/scripts/555722/DGUT%20Ulearning%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/555722/DGUT%20Ulearning%20Tool.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let video_speed = 6;
    let logBox;


    class AnswerVideo {
        constructor() { }

        getType(questionNode) {
            const tag = questionNode.querySelector('.question-type-tag');
            if (!tag) return null;

            const text = tag.textContent.trim();
            if (text.includes('单选题')) return 'single';
            if (text.includes('多选题')) return 'multiple';
            if (text.includes('判断题')) return 'judge';
            if (text.includes('填空题')) return 'blank';
            return null;
        }

        answerQuestions(questionId, answerList) {

            const questionNode = document.querySelector(`#question${questionId}`);
            if (!questionNode) {
                Yukilog(`Qusetion ${questionId} called: ${type}`);
                return;
            }

            const type = this.getType(questionNode);
            if (!type) {
                Yukilog(`Unknown Type Qusetion called: ${type}`);
                return;
            }

            switch (type) {
                case 'single':
                    this.choice(questionNode, answerList);
                    break;
                case 'multiple':
                    this.choice(questionNode, answerList);
                    break;
                case 'judge':
                    this.judge(questionNode, answerList);
                    break;
                case 'blank':
                    this.blank(questionNode, answerList);
                    break;
                default:
                    Yukilog(`Unsupported question type: ${type} for question ${questionId}`);
            }

        }

        choice(questionNode, answerList) {
            const choiceItems = questionNode.querySelectorAll('.choice-item');
            choiceItems.forEach(item => {
                const optionLetter = item.querySelector('.option')?.textContent?.trim().replace('.', '');
                if (optionLetter && answerList.includes(optionLetter)) {
                    const checkbox = item.querySelector('.checkbox');
                    if (checkbox && !checkbox.classList.contains('selected')) {
                        item.click();
                        Yukilog(`已勾选选项 ${optionLetter}`);
                    }
                }
            });
            Yukilog(`选择题选择: ${answerList}`);
        }

        judge(questionNode, answerList) {
            const isCorrect = String(answerList) === 'true';
            const btnClass = isCorrect ? '.right-btn' : '.wrong-btn';
            const btn = questionNode.querySelector(btnClass);
            if (btn && !btn.classList.contains('selected')) {
                btn.click();
                Yukilog(`判断题选择: ${isCorrect ? 'true' : 'false'}`);
            }
        }

        blank(questionNode, answerList) {
            Yukilog(`填空题自动作答功能尚未实现`);
        }

    }

    function Yukilog(msg) {
        console.log(`DGUT Ulearning Tool: ${msg}`);
        if (logBox) {
            logBox.innerHTML += msg.replace(/\n/g, "<br>") + "<br>";
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    function controlPanel() {
        const controlPanel = document.createElement("div");
        controlPanel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            z-index: 999999;
            background: rgba(0,0,0,0.6);
            color: #fff;
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 14px;
            width: 250px;
            cursor: move;
        `;
        controlPanel.innerHTML = `
            <div>DGUT Ulearning Tools</div>
            <div style="margin-top:6px;">视频播放倍速: <span id="speedVal">${video_speed}</span>x</div>
            <button id="speedUp" style="margin:4px;">➕</button>
            <button id="speedDown" style="margin:4px;">➖</button>
            <div style="margin-top:8px;">输出:</div>
            <div id="logBox" style="height:150px;overflow:auto;background:#111;padding:4px;border-radius:4px;font-size:12px; line-height: 1.5;"></div>
        `;

        document.body.appendChild(controlPanel);

        document.getElementById("speedUp").onclick = () => controlSpeed(1);
        document.getElementById("speedDown").onclick = () => controlSpeed(-1);
        logBox = document.getElementById("logBox");

        controlPanel.onmousedown = function (e) {
            let offsetX = e.clientX - controlPanel.offsetLeft;
            let offsetY = e.clientY - controlPanel.offsetTop;

            document.onmousemove = function (e) {
                controlPanel.style.left = e.clientX - offsetX + "px";
                controlPanel.style.top = e.clientY - offsetY + "px";
            };

            document.onmouseup = function () { document.onmousemove = null; };
        };

    }

    function controlSpeed(speed) {
        video_speed = video_speed + speed;
        if (video_speed < 1) {
            video_speed = 1;
            Yukilog("补药再减速啦 O (≧口≦)O");
        }
        document.getElementById("speedVal").innerText = video_speed;
        const video = document.querySelector("video");
        if (video) video.playbackRate = video_speed;
        Yukilog(`视频播放倍速调整为 ${video_speed}x`);
    }

    function init() {
        new MutationObserver((mutations, observer) => {
            main();
        }).observe(document.body, { childList: true, subtree: true });
        main();
    }

    function main() {
        const video = document.querySelector('video');
        if (video && !video.dataset.hooked) {
            video.dataset.hooked = 'true';
            Yukilog("(´ ∀ ` *) 找到视频，开始刷课啦！");
            video.playbackRate = video_speed;
            video.muted = true; // mute the video by default
            video.play().catch(e => Yukilog("播放失败，请手动点击一次。"));

            const intervalId = setInterval(() => {
                if (!document.contains(video)) {
                    clearInterval(intervalId);
                    return;
                }
                video.playbackRate = video_speed;
                if (video.paused) video.play();
            }, 2000);

            video.addEventListener("ended", () => {
                Yukilog("视频播放结束。");
                goNext();
            });

        }

        const quizPanel = document.querySelector(".question-setting-panel");
        if (quizPanel && !quizPanel.dataset.hooked) {
            quizPanel.dataset.hooked = 'true';
            Yukilog("检测到做题页面，开始获取答案...");

            let result = getElementsId();

            result.forEach(({ questionId, parentId }) => {
                fetchAnswers(questionId, parentId);
            });

            submitQuiz();

        }
    }

    function submitQuiz() {
        const btn = document.querySelector('.btn-submit');
        if (btn) {
            btn.click();
        } else {
            setTimeout(btn.click(), 1000);
        }
    }


    function goNext() {
        Yukilog("(* ^ ω ^) 视频播放完毕，自动跳下一节...");
        let nextBtn = document.querySelector(".next-btn,.btn-next,.nextVideoBtn,.mobile-next-page-btn");
        if (nextBtn && !nextBtn.classList.contains('disabled')) {
            nextBtn.click();
        } else {
            Yukilog("未找到或无法点击下一节按钮，可能是本章结束。");
        }
    }

    function getElementsId() {
        const result = [];
        let parentId = $('.page-name.active').parent().attr('id').substring(4);

        const questionElements = document.querySelectorAll('.question-element-node');
        questionElements.forEach(node => {
            const wrapper = node.querySelector('[id^="question"]') || node;
            if (wrapper && wrapper.id.startsWith('question')) {
                const questionId = wrapper.id.replace('question', '');
                result.push({ parentId, questionId });
            }
        });
        return result;
    }

    function getUAAuth() {
        let uaAuth = document.cookie.split(";")
            .map(c => c.trim().split("="))
            .find(([k, v]) => k === "AUTHORIZATION")?.[1] || "";
        if (!uaAuth) Yukilog("未找到 UA-AUTHORIZATION!");
        return uaAuth;
    }

    function fetchAnswers(questionId, parentId) {
        const uaAuth = getUAAuth();
        if (!uaAuth) return Yukilog("UA-AUTHORIZATION 为空，无法请求");

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ua.dgut.edu.cn/uaapi/questionAnswer/${questionId}?parentId=${parentId}`,
            headers: {
                "UA-AUTHORIZATION": uaAuth,
                "X-Requested-With": "XMLHttpRequest",
                "Referer": window.location.href
            },
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const answerList = data.correctAnswerList || [];
                    console.log("题目答案抓取成功:", data);

                    const answerer = new AnswerVideo();
                    if (answerList.length > 0) {
                        answerer.answerQuestions(questionId, answerList);
                    }
                } catch (e) {
                    console.error("解析答案失败", e, res.responseText);
                }
            },
            onerror: function (err) {
                console.error("拉取答案失败", err);
            }
        });
    }


    // START
    controlPanel();
    setTimeout(init, 2000);

})();