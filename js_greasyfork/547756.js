// ==UserScript==
// @name         Quiz Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  test
// @match        *://quiz.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547756/Quiz%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/547756/Quiz%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Running :D");

    function showAnswers(answers) {
        if (!answers || answers.length === 0) {
            updateFloatingBox("");
            return;
        }
        console.log("Update box");
        updateFloatingBox(answers.join("\n"));
    }

    function updateFloatingBox(text) {
        let box = document.getElementById("answer-float-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "answer-float-box";
            box.style.position = "fixed";
            box.style.bottom = "10px";
            box.style.right = "10px";
            box.style.padding = "8px 12px";
            box.style.background = "rgba(0,0,0,0.6)";
            box.style.color = "lime";
            box.style.fontSize = "9px";
            box.style.fontWeight = "bold";
            box.style.borderRadius = "6px";
            box.style.opacity = "0.1";
            box.style.transition = "opacity 0.3s";
            box.style.zIndex = 9999;
            box.style.pointerEvents = "auto";
            box.addEventListener("mouseenter", () => box.style.opacity = "0.5");
            box.addEventListener("mouseleave", () => box.style.opacity = "0.1");
            document.body.appendChild(box);
        }
        box.textContent = text;
    }

    const OldWorker = window.Worker;

    window.Worker = function(...args) {
        const worker = new OldWorker(...args);

        worker.addEventListener("message", (event) => {
            const d = event.data;
            if (Array.isArray(d) && d[0] === "onmessage") {
                try {
                    const payload = JSON.parse(d[2]?.data);

                    if (Array.isArray(payload) && payload[0] === "room/message") {
                        const answers = payload?.[1]?.message?.patch?.[0]?.value?.answers;
                        if (Array.isArray(answers)) {
                            const correct = answers.filter(a => a.isCorrect).map(a => a.text);
                            if (correct.length > 0) {
                                console.log("[Correct Answers]", correct);
                                showAnswers(correct);
                            }
                        }
                    }
                } catch(e) {}
            }
        });

        return worker;
    };

    window.Worker.prototype = OldWorker.prototype;
})();