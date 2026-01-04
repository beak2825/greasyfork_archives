// ==UserScript==
// @name         思纽教育（秒刷、无授权）
// @version      2.0
// @description  禁止外泄！
// @author       白衬
// @match        *://*.edueva.org/*
// @icon         http://www.isiniu.com/img/logo/logo.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/973431
// @downloadURL https://update.greasyfork.org/scripts/557490/%E6%80%9D%E7%BA%BD%E6%95%99%E8%82%B2%EF%BC%88%E7%A7%92%E5%88%B7%E3%80%81%E6%97%A0%E6%8E%88%E6%9D%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557490/%E6%80%9D%E7%BA%BD%E6%95%99%E8%82%B2%EF%BC%88%E7%A7%92%E5%88%B7%E3%80%81%E6%97%A0%E6%8E%88%E6%9D%83%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stateBar = document.createElement('div');
    stateBar.style.position = 'fixed';
    stateBar.style.top = '60px';
    stateBar.style.left = '0px';
    stateBar.style.width = '500px';
    stateBar.style.maxHeight = '400px';
    stateBar.style.overflowY = 'auto';
    stateBar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    stateBar.style.border = '1px solid #ccc';
    stateBar.style.padding = '10px';
    stateBar.style.zIndex = '9999';
    document.body.appendChild(stateBar);

    const title = document.createElement('h2');
    title.textContent = '思纽教育（秒刷版）';
    title.style.color = '#333';
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';

    stateBar.appendChild(title);

    const openAllButton = document.createElement('button');
    openAllButton.textContent = '一键秒射';
    openAllButton.style.fontSize = '16px';
    openAllButton.style.padding = '10px 20px';
    openAllButton.style.margin = '0 auto';
    openAllButton.style.display = 'block';
    stateBar.appendChild(openAllButton);

    const messageBox = document.createElement('div');
    messageBox.id = 'messageBox';
    messageBox.style.marginTop = '10px';
    messageBox.style.userSelect = 'text';
    stateBar.appendChild(messageBox);

    let isRunning = false;  // 变量用来跟踪脚本的运行状态

    openAllButton.onclick = function() {
        if (isRunning) {
            messageBox.innerHTML = "<span style='color: red;'>脚本正在运行中！避免脚本重复运行。</span><br>" + messageBox.innerHTML;
            return;
        }
        if (courseLinks.length === 0) {
            alert("所有课程已完成！");
            return;
        }

        isRunning = true; // 设置为正在运行
        messageBox.innerHTML = "<span style='color: orange;'>正在运行，请稍等......</span><br>" + messageBox.innerHTML;
        openAllCourses();
    };

    const courseLinks = [];

    function findCourses() {
        const courseElements = document.querySelectorAll('dd a em.icon_1, dd a em.icon_4');
        courseElements.forEach(elem => {
            const linkElem = elem.closest('a');
            if (linkElem) {
                const title = linkElem.querySelector('.tit').textContent;
                const href = linkElem.getAttribute('href');
                const fullLink = `https://xlvideo.edueva.org${href.replace(/&amp;/g, '&')}`;
                courseLinks.push({ title, link: fullLink });
            }
        });
        displayCourses();
    }

    function displayCourses() {
        const titleDisplay = document.createElement('div');
        titleDisplay.style.marginTop = '20px';
        titleDisplay.style.userSelect = 'text';
        stateBar.appendChild(titleDisplay);
        titleDisplay.innerHTML = `<h4>未完成的课程（总计${courseLinks.length}条）:</h4>`;
        courseLinks.forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.textContent = course.title;
            titleDisplay.appendChild(courseDiv);
        });
    }

    function openAllCourses() {
        const promises = courseLinks.map(course => {
            return new Promise((resolve) => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = course.link;
                document.body.appendChild(iframe);

                iframe.onload = () => {
                    iframe.contentWindow.eval(`(function() {
                        let repeatCount = 0;
                        function runActions() {
                            var v = document.querySelector("video");
                            if (v) {
                                v.dispatchEvent(new Event("ended"));
                                v.muted = true;
                                setTimeout(function() {
                                    var btn = document.querySelector('.layui-layer-btn1');
                                    if (btn) {
                                        btn.click();
                                    }
                                }, 1500);
                            }
                            repeatCount++;
                            if (repeatCount < 2) {
                                setTimeout(runActions, 2000);
                            }
                        }
                        runActions();
                    })();`);
                    messageBox.innerHTML = `<span style='color: green;'>${course.title} - 已完成！</span><br>` + messageBox.innerHTML;
                    resolve();
                };
            });
        });

        Promise.all(promises).then(() => {
            messageBox.innerHTML = "<span style='color: blue;'>已全部完成，请等待10秒后自动刷新!</span><br>" + messageBox.innerHTML;
            setTimeout(() => {
                isRunning = false; // 运行完成后，恢复运行状态
                location.reload();
            }, 2000);
        });
    }

    findCourses();
})();
