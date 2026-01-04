// ==UserScript==
// @name         CUG酬金自动查询
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动填充学号密码并查询酬金
// @author       Wangyp
// @match        http*://*/sjcx/Student.aspx*
// @icon         https://www.cug.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558398/CUG%E9%85%AC%E9%87%91%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558398/CUG%E9%85%AC%E9%87%91%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const StuNum = "";   //此处填写学号
    const Passwd = "";   //此处填写密码

    // 等待控件加载
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    waitForElement("#Main_Text4", () => {

        document.getElementById("Main_Text4").value = StuNum;
        document.getElementById("Main_Password1").value = Passwd;

        document.getElementById("Main_rb2").checked = true; // 默认选择查询酬金

        // 小延迟确保 ViewState 绑定完毕
        setTimeout(() => {
            __doPostBack('ctl00$Main$Button2','');
        }, 300);
    });

})();
