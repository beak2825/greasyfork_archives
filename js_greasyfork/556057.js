// ==UserScript==
// @name         Gooboo 新自动考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Gooboo相关学校考试页面上自动满分通过。
// @author       zding
// @match        https://gooboo.g8hh.com.cn/*
// @match        *://*/gooboo/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556057/Gooboo%20%E6%96%B0%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556057/Gooboo%20%E6%96%B0%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkInterval = null;
    let isSequenceExecuting = false;

    function checkAndExecuteActions() {
        if (isSequenceExecuting) {
            return;
        }

        const containerDiv = document.querySelector('div.text-center.ma-2');
        if (!containerDiv) {
            return;
        }

        const timerIcon = containerDiv.querySelector('i.mdi-timer');
        const markerCheckIcon = containerDiv.querySelector('i#score-marker.mdi-marker-check');

        if (timerIcon && markerCheckIcon) {
            isSequenceExecuting = true;
            const scoreMarkerElement = document.getElementById('score-marker');

            if (scoreMarkerElement && scoreMarkerElement.__vue__) {
                const parentComponent = scoreMarkerElement.__vue__.$parent.$parent;

                if (parentComponent) {
                    if (typeof parentComponent.updateScore === 'function') {
                        parentComponent.updateScore(100);
                    }

                    setTimeout(() => {
                        const reCheckContainerDiv = document.querySelector('div.text-center.ma-2');
                        if (reCheckContainerDiv) {
                            const reCheckTimerIcon = reCheckContainerDiv.querySelector('i.mdi-timer');
                            const reCheckMarkerCheckIcon = reCheckContainerDiv.querySelector('i#score-marker.mdi-marker-check');

                            if (reCheckTimerIcon && reCheckMarkerCheckIcon) {
                                if (typeof parentComponent.finishSchool === 'function') {
                                    parentComponent.finishSchool();
                                }
                            }
                        }
                        isSequenceExecuting = false;
                    }, 300);
                } else {
                    isSequenceExecuting = false;
                }
            } else {
                isSequenceExecuting = false;
            }
        }
    }

    function startChecker(intervalTime = 500) {
        if (checkInterval) {
            return;
        }
        checkInterval = setInterval(checkAndExecuteActions, intervalTime);
    }

    function stopChecker() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            isSequenceExecuting = false;
        }
    }

    startChecker();
})();
