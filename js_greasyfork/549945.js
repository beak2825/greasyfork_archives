// ==UserScript==
// @name         59iedu华博教育系列刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 59iedu华博教育系列 的辅助看课，脚本功能如下：自动检测进度并点击课程学习按钮，自动过计算题验证
// @author       脚本喵
// @match        https://*.59iedu.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549945/59iedu%E5%8D%8E%E5%8D%9A%E6%95%99%E8%82%B2%E7%B3%BB%E5%88%97%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549945/59iedu%E5%8D%8E%E5%8D%9A%E6%95%99%E8%82%B2%E7%B3%BB%E5%88%97%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 自动检测进度并点击课程学习按钮
     */

    // 点击进度对应的课程学习按钮
    function clickCourseLearnButton(button) {
        if (button) {
            console.log('点击课程学习按钮：', button);
            button.click();
        }
    }

    // 检测进度并点击对应的课程学习按钮
    function checkProgressAndClick() {
        // 获取所有的进度条元素和对应的课程学习按钮
        var progresses = document.querySelectorAll('.process');
        var courseLearnButtons = document.querySelectorAll('a.ui-btn.btn-gr.ui-btn-2[ng-click^="events.tryListen"]');

        // 遍历进度条元素
        for (var i = 0; i < progresses.length; i++) {
            // 获取进度条的百分比数值
            var progressNum = progresses[i].querySelector('.process-num');
            var progressValue = progressNum ? progressNum.textContent.trim() : '0%';
            console.log('进度条 ' + (i + 1) + ' 的数值: ' + progressValue);

            // 根据进度值点击对应的课程学习按钮
            if (progressValue !== '100%' && i < courseLearnButtons.length) {
                // 如果进度不等于100%，则点击对应的课程学习按钮
                clickCourseLearnButton(courseLearnButtons[i]);
                return; // 只点击第一个不等于100%的进度对应的按钮
            } else if (progressValue === '100%' && i < progresses.length - 1) {
                // 如果当前进度等于100%，则点击下一个进度对应的按钮
                if (progresses[i + 1].querySelector('.process-num').textContent.trim() !== '100%') {
                    clickCourseLearnButton(courseLearnButtons[i + 1]);
                    return;
                }
            }
        }
    }

    // 检查是否在指定的页面上
    function startChecking() {
        if (window.location.href.indexOf("59iedu.com/center/myRealClass/") !== -1) {
            // 立即检查并点击
            setTimeout(checkProgressAndClick, 15000);// 15秒检查并点击一次
            // 每45分钟检查进度条状态
            var intervalId = setInterval(checkProgressAndClick, 2700000);
            // 在页面卸载时清除定时器
            window.addEventListener('beforeunload', function () {
                clearInterval(intervalId);
            });
        }
    }

    // 使用window.addEventListener('load', function() {...})来确保在页面所有资源加载完成后执行
    window.addEventListener('load', startChecking);


    /**
     * 屏蔽弹窗
     */
    setInterval(() => {
        questionDialog = null;
    }, 1e3);

    /**
     * 自动填验证
     */
    //保存原函数的引用
    let clr = window.clearInterval;
    window.clearInterval = (id) => {
        if (id != myID) {
            //调用原函数
            clr(id);
            //这里不能用clearInterval,会爆堆栈
        }
    }
    let myID = setInterval(function () {
        console.log("脚本运行中……")
        function jisuan(x, y, z) {
            var s;
            x = Number(x);
            z = Number(z);
            if (y == "+") { s = x + z; }
            else if (y == "-") { s = x - z; }
            else if (y == "x") { s = x * z; }
            else if (y == "÷") { s = s / z; }
            return s;
        }
        //判断验证码页面是否出现
        var zt = document.querySelector('.vjs-play-control > span:nth-child(2)')?.textContent;
        var question = document.querySelector(".d-qus-body");
        if (zt == "播放" && question == null) {
            document.querySelector('.vjs-play-control').click()
        }
        if (question != null) {
            console.log("验证页面出现了");
            // 提取题目输出：例"2 x 5 = ?"
            let qu = document.querySelector(".d-qus-body").innerText;
            //提取题目并进行计算
            //let qu = "2 x 5 = ?"
            console.log('获取题目：', qu);
            console.log(qu[0], qu[2], qu[4]);
            let a = jisuan(qu[0], qu[2], qu[4]);
            console.log("计算结果：", a);
            // 提取A选项答案
            let ansA = document.querySelector('div.d-slt:nth-child(1) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // A选项是否被选中
            let chA = document.querySelector('div.d-slt:nth-child(1) > label:nth-child(1) > input:nth-child(1)');
            //  提取B选项答案
            let ansB = document.querySelector('div.d-slt:nth-child(2) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // B选项是否被选中
            let chB = document.querySelector('div.d-slt:nth-child(2) > label:nth-child(1) > input:nth-child(1)');
            //  提取C选项答案
            let ansC = document.querySelector('div.d-slt:nth-child(3) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // C选项是否被选中
            let chC = document.querySelector('div.d-slt:nth-child(3) > label:nth-child(1) > input:nth-child(1)');
            //  提取D选项答案
            let ansD = document.querySelector('div.d-slt:nth-child(4) > label:nth-child(1) > span:nth-child(4)')?.innerText;
            // D选项是否被选中
            let chD = document.querySelector('div.d-slt:nth-child(4) > label:nth-child(1) > input:nth-child(1)');
            console.log(ansA, ansB, ansC, ansD);
            console.log(chA.checked, chB.checked, chC.checked, chD.checked);
            //查找答案的位置并选中正确选项
            if (a == ansA) {
                chA.checked = true;
                chA.click();
                console.log("点击了正确答案A");
            }
            else if (a == ansB) {
                chB.checked = true;
                chB.click();
                console.log("点击了正确答案B");
            }
            else if (a == ansC) {
                chC.checked = true;
                chC.click();
                console.log("点击了正确答案C");
            }
            else if (a == ansD) {
                chD.checked = true;
                chD.click();
                console.log("点击了正确答案D");
            }
            //点击提交答案按钮			//延时0.5秒
            setTimeout(document.querySelector('.blue').click(), 500);
            //点击关闭窗口按钮			//延时0.5秒
            setTimeout(document.querySelector('.blue').click(), 500);
        }
    }, 3000);

})();
