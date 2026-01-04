// ==UserScript==
// @name         科技创新达人赛
// @namespace    https://greasyfork.org/zh-CN/scripts/551993-科技创新达人赛
// @version      2025-12-15
// @description  仅限内部交流使用，请用户24小时内删除脚本，产生的后果由用户个人承担。
// @author       buzhanxian
// @match        https://qtmoa.hecmcc.com:7080/*
// @icon         https://src.onlinedown.net/images/h_iphone_imges/book_3/171124_044606.jpg
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/551993/%E7%A7%91%E6%8A%80%E5%88%9B%E6%96%B0%E8%BE%BE%E4%BA%BA%E8%B5%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/551993/%E7%A7%91%E6%8A%80%E5%88%9B%E6%96%B0%E8%BE%BE%E4%BA%BA%E8%B5%9B.meta.js
// ==/UserScript==
/*
再次声明：仅限内部交流使用，请用户24小时内删除脚本，产生的后果由用户个人承担。
*/
(function() {

    start();
    function start() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(start, 1000);
            });
        } else {
            setTimeout(getTmArrValue, 1000);
        }
    }

    function getTmArrValue() {
        try {
            if (typeof unsafeWindow !== 'undefined' &&
                typeof unsafeWindow.tm_arr !== 'undefined' &&
                Array.isArray(unsafeWindow.tm_arr) &&
                unsafeWindow.tm_arr.length > 0) {
                selectAnswer();
                return;
            }
            setTimeout(getTmArrValue, 1000);
        } catch (error) {
            setTimeout(getTmArrValue, 1000);
        }
    }

    function printAnswer() {
        try {
            if (typeof unsafeWindow !== 'undefined' &&
                typeof unsafeWindow.tm_arr !== 'undefined' &&
                Array.isArray(unsafeWindow.tm_arr) &&
                unsafeWindow.tm_arr.length > 0) {
                alert(unsafeWindow.tm_arr[0][10]);
                return;
            }
            setTimeout(printAnswer, 1000);
        } catch (error) {
            setTimeout(printAnswer, 1000);
        }
    }
    function selectAnswer() {
        if ("1" === unsafeWindow.tm_arr[0][10]) {
            // alert('答案选项是 ： 正确');
            doCheck(0);
        } else if ("0" === unsafeWindow.tm_arr[0][10]) {
            // alert('答案选项是 ： 错误');
            doCheck(1);
        } else {
            var answerStr = unsafeWindow.tm_arr[0][10].toLowerCase();
            // alert('答案选项是 ： ' + answerStr);
            if(answerStr.includes('a')) {
                doCheck(0);
            }
            if(answerStr.includes('b')) {
                doCheck(1);
            }
            if(answerStr.includes('c')) {
                doCheck(2);
            }
            if(answerStr.includes('d')) {
                doCheck(3);
            }
            if(answerStr.includes('e')) {
                doCheck(4);
            }
        }
    }

    // 可选：添加一个按钮到页面，方便手动触发
    function doCheck(index) {
        if(document.querySelectorAll('.van-radio')[index]){
            document.querySelectorAll('.van-radio')[index].click();
        }
        if(document.querySelectorAll('.van-checkbox')[index]){
            document.querySelectorAll('.van-checkbox')[index].click();
        }
    }
    // 可选：添加一个按钮到页面，方便手动触发
    function addButton() {
        const button = document.createElement('button');
        button.innerHTML = '获取答案';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', printAnswer);

        document.body.appendChild(button);
    }

    // 添加按钮
    setTimeout(addButton, 2000);
})();
