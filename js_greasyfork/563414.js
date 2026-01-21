// ==UserScript==
// @name         师学通自动连播验证码
// @match        stu.teacher.com.cn
// @description  1.验证码自动填写、提交;       2.视频播放结束后重新播放;       3.提交验证码与重新播放功能可能需要等待几秒（不超过20s）。
// @license      MIT
// @version 0.0.1.20260121004530
// @namespace https://greasyfork.org/users/805133
// @downloadURL https://update.greasyfork.org/scripts/563414/%E5%B8%88%E5%AD%A6%E9%80%9A%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/563414/%E5%B8%88%E5%AD%A6%E9%80%9A%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==
let initFlag = true;
let elements;
(function() {
    'use strict';
    // 初次进入页面，自动播放类型为‘视频’,并且有data-verb属性为'观看'的视频

    setInterval(function(){
        if(initFlag) {
            console.log("第一次播放");
            if (document.getElementsByClassName("ccH5TogglePlay") && document.getElementsByClassName("ccH5TogglePlay")[0]) {
                document.getElementsByClassName("ccH5TogglePlay")[0].click();
                initFlag = false;
            }
            if(document.getElementsByClassName("ccH5PlayBtn") && document.getElementsByClassName("ccH5PlayBtn")[0]) {
                console.log("btn play");
                document.getElementsByClassName("ccH5PlayBtn")[0].click();
                initFlag = false;
            }
        }
        if(document.getElementById("codespan")){
            document.getElementById("code").value = document.getElementById("codespan").innerText;
            document.getElementById("codespan").parentNode.parentNode.parentNode.parentNode.children[3].children[0].click();
            console.log("pass captcha!!!");
        }else{
            if(document.querySelector(".layui-layer-content") && document.querySelector(".layui-layer-content").innerText === "为保障学习质量，优化学习体验，系统已开启防连播功能。每节课程学习完成后，请手动选择下一节，以便您充分消化知识，让学习更高效!"){
                elements = document.querySelectorAll('a');
                elements.forEach(function(el) {
                    if(el.innerText == 'Ok，我知道了！'){
                        el.click();
                    }
                });
                if ( document.querySelectorAll('[data-type="1"]')) {
                    document.querySelectorAll('[data-type="1"]')[0].click();
                    initFlag = true;
                }
            } else {
                elements = document.querySelectorAll('a');
                elements.forEach(function(el) {
                    if(el.innerText == 'Ok，我知道了！'){
                        el.click();
                        document.getElementsByClassName("ccH5TogglePlay")[0].click();
                        console.log("rePlay success!!!");
                    }
                });
            }
        }

    },20000)

})();