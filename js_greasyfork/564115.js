// ==UserScript==
// @name         学习通自动登录
// @description  学习通自动点击登录按钮
// @author       caolib
// @license      MIT
// @match        https://passport2.chaoxing.com/login*
// @grant        none
// @version      0.0.1
// @namespace https://greasyfork.org/users/914125
// @downloadURL https://update.greasyfork.org/scripts/564115/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/564115/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 你的加密后的用户名和密码
    const uname = "1r51sIsj87Ke1aBDFgoVZA==";
    const password = "h6YHH9C6KDx+b6+r1Lcn6g==";

    const payload = new URLSearchParams({
        fid: "-1",
        uname: uname,
        password: password,
        refer: "",
        t: "true",
        forbidotherlogin: "0",
        validate: "",
        doubleFactorLogin: "0",
        independentId: "0",
        independentNameId: "0"
    });

    fetch("https://passport2.chaoxing.com/fanyalogin", {
        method: "POST",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: payload.toString(),
        credentials: "include"
    })
    .then(r => r.json())
    .then(data => {
        console.log("登录返回：", data);

        if (data && data.status) {
            console.log("登录成功！跳转到你的目标页面。");

            // 这里是你想去的页面
            window.location.href =
                "https://i.mooc.chaoxing.com/space/index?t=1592829485206";

        } else {
            console.log("登录失败：", data);
        }
    });

})();
