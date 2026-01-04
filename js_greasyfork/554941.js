// ==UserScript==
// @name         学达云刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 学达云 的辅助看课，脚本功能如下：后台计时，计时结束后自动提交，提交后自动刷新页面来学习下一门课
// @author       脚本喵
// @match        *://*.ok99ok99.com/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554941/%E5%AD%A6%E8%BE%BE%E4%BA%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554941/%E5%AD%A6%E8%BE%BE%E4%BA%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.indexOf("stu/study") != -1) {
        setTimeout(function () {
            // 创建一个新的文本节点
            const textNode = document.createTextNode("脚本自动学习中...");
            // 创建一个容器元素（例如div），用于包裹文本节点
            const container = document.createElement("div");
            container.appendChild(textNode);
            // 添加样式
            container.style.position = "fixed"; // 固定位置
            container.style.top = "8%"; // 垂直居中
            container.style.left = "30%"; // 水平居中
            container.style.transform = "translate(-50%, -50%)"; // 偏移自身尺寸的50%以确保中心对齐
            container.style.color = "red"; // 字体颜色为红色
            container.style.fontWeight = "bold"; // 字体加粗
            container.style.zIndex = "1000"; // 确保在最上层
            container.style.padding = "10px"; // 添加一些内边距
            container.style.background = "white"; // 背景颜色
            container.style.border = "1px solid #ddd"; // 边框
            container.style.borderRadius = "5px"; // 边框圆角
            container.style.textAlign = "center"; // 文本居中
            container.style.fontSize = "20px"; // 字体大小
            container.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)"; // 添加阴影效果
            // 将容器元素插入到<body>标签的最前面
            document.body.insertBefore(container, document.body.firstChild);
        }, 3000)

        setTimeout(function () {
            console.log("判断")
            console.log(window.location.href)

            if (document.getElementsByClassName("flex align_content justify_between font18 study_time").length == 1) {
                if (!is_in_study) {
                    is_in_study = true
                }
                if (document.getElementsByClassName("layui-layer-move").length != 0 && document.getElementById("TB_window") != null) {
                    if (document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard") != null && document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard").length != 0) {
                        document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard")[0].click()
                    }
                }
                console.log("新版")
                setInterval(function () {
                    var btn_disable = document.getElementsByClassName("btn submit_btn")[0].disabled
                    console.log("btn_disable  " + btn_disable)
                    if (btn_disable == false) {
                        document.getElementsByClassName("btn submit_btn")[0].click()
                        setTimeout(function () {
                            location.reload()
                        }, 5 * 1000)
                    }
                    if (!is_in_study) {
                        is_in_study = true
                    }
                }, 5000)
            } else {
                console.log("旧版")
                if (document.getElementById("rightiframe") == null) {
                    return
                }
                var right = document.getElementById("rightiframe").contentWindow.document

                if (right.getElementById("TB_ajaxWindowTitle") && right.getElementsByClassName("btn_Dora_b").length == 0) {
                    console.log(right.getElementById("TB_ajaxWindowTitle").disabled)
                } else {
                    if (right.getElementById("curtime").innerText == "00:00:00") {
                        location.reload()
                    }
                }
                setInterval(function () {
                    if (right.getElementById("SaveStudyRecord").disabled != true) {
                        right.getElementById("SaveStudyRecord").click()
                        setTimeout(function () {
                            location.reload()
                        }, 3000)
                    }
                }, 5000)
            }
        }, 10000)
    }

})();
