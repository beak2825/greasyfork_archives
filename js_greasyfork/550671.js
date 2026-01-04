// ==UserScript==
// @name         USST教务系统余课监控
// @namespace    https://bobliu.tech/
// @version      1.0.0
// @license      MIT
// @supportURL   https://github.com/BobLiu0518/USST-Course-Watch/issues
// @description  自动刷新USST教务选课系统，检查班级是否有余量
// @author       BobLiu
// @match        https://jwgl.usst.edu.cn/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html?*
// @icon         https://jwgl.usst.edu.cn/jwglxt/logo/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550671/USST%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BD%99%E8%AF%BE%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/550671/USST%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BD%99%E8%AF%BE%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let monitorRunning = false;
    const postMethod = $.post;
 
    const notify = (msg) => {
        new Notification(msg);
        console.log(msg);
        $.alert(msg);
    };
 
    const checkNotificationPermission = async () => {
        if (Notification.permission != 'granted' && (await Notification.requestPermission()) != 'granted') {
            console.error('无通知权限');
        }
    };
 
    const stopMonitor = (manualStop) => {
        monitorRunning = false;
        $.post = postMethod;
        if (manualStop) {
            notify('结束监控课程');
            document.querySelector('[name="query"]').click();
        }
    };
 
    const runMonitor = async (courseId, classNum) => {
        monitorRunning = true;
        await checkNotificationPermission();
 
        $.post = (url, payload, callback) => {
            postMethod(url, payload, (data) => {
                callback(data);
                if (url.match('cxJxb') && parseInt(data[classNum].yxzrs) < parseInt(data[classNum].jxbrl)) {
                    notify('课程有余量啦');
                    stopMonitor(false);
                }
            });
        };
 
        notify('开始监控课程');
        document.querySelector('[name="searchInput"]').value = courseId;
        while (monitorRunning) {
            document.querySelector('[name="query"]').click();
            await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1750 + 1250)));
        }
    };
 
    const injectButton = (coursePanel) => {
        try {
            coursePanel.querySelector('th:last-of-type').colSpan = 2;
            const courseId = coursePanel.querySelector('.kcmc').innerText.match(/^\((\d+)\)/)[1];
            coursePanel.querySelectorAll('.body_tr').forEach((courseActions, index) => {
                courseActions.innerHTML += `<td><button type="button" class="btn btn-default btn-sm" onclick="${
                    monitorRunning ? 'stopMonitor(true)' : `runMonitor('${courseId}', ${index})`
                }">${monitorRunning ? '取消监控' : '监控'}</button></td>`;
            });
        } catch (err) {}
    };
 
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList && node.classList.contains('panel-info')) {
                        injectButton(node);
                    }
                    const panelInfoNodes = node.querySelectorAll?.('.panel-info') ?? [];
                    panelInfoNodes.forEach(injectButton);
                }
            });
        });
    });
 
    window.runMonitor = runMonitor;
    window.stopMonitor = stopMonitor;
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
