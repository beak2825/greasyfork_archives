// ==UserScript==
// @name         广州市中小学教师继续教育网刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 广州市中小学教师继续教育网 的辅助看课，脚本功能如下：webtrn.cn机构课程，自动点击确定；tt.cn机构课程，视频中间题目自动答题;yanxiu.com机构课程，视频中间题目自动答题
// @author       脚本喵
// @match        https://i.teacher.gzteacher.com/*
// @match        https://*.webtrn.cn/*
// @match        https://*.ttcn.cn/*
// @match        https://*.yanxiu.com/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555400/%E5%B9%BF%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555400/%E5%B9%BF%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // webtrn.cn机构课程，自动点击确定
    function kill_loop_click() {
        var time_out = 0;
        var count = 0;
        setInterval(() => {
            if (typeof document.getElementsByClassName("layui-layer-btn0")[0] != "undefined") {
                $(".layui-layer-btn0").trigger("click");
                console.log("Loop conform cracked [" + count + "] times.");
                time_out = 0;
                // document.getElementById("container_display").click();  # V 0.1 Bug code.
                if ($("#player_pause").css("display") != "none") { // # V 0.1.2  Bug fixed code
                    $("#player_pause").click();
                }
                count += 1;
            }
            console.log("Time elapsed [" + time_out + "s].");
            time_out += 1;
        }, 1000);
    }

    if (location.href.indexOf("webtrn.cn") != -1) {
        kill_loop_click();
    }

    // tt.cn机构课程，视频中间题目自动答题
    if (location.href.indexOf("ttcn.cn") != -1) {
        setInterval(function () {
            if (document.querySelector(".ant-modal-content") && document.querySelector(".ant-modal-content").querySelector("input")) {
                setTimeout(function () {
                    document.querySelector(".ant-modal-content").querySelector("input").click()
                }, 1000)

                setTimeout(function () {
                    document.querySelector(".ant-modal-content").querySelector("button").click()
                }, 2000)
            }

        }, 5 * 1000)
    }

    // yanxiu.com机构课程，视频中间题目自动答题
    if (location.href.indexOf("yanxiu.com") != -1) {
        setInterval(function () {

            if (document.querySelector(".question-stem")) {
                for (let i = 0; i < document.querySelectorAll(".question-stem").length; i++) {
                    let item = document.querySelectorAll(".question-stem")[i];
                    if (isElementVisible(item)) {
                        setTimeout(function () {
                            item.querySelector(".label-text").click()
                        }, 1000)

                        setTimeout(function () {
                            document.querySelectorAll(".question button.ivu-btn.ivu-btn-primary")[i].click()
                        }, 2000)

                        setTimeout(function () {
                            document.querySelectorAll(".question button.ivu-btn.ivu-btn-primary")[i].click()
                        }, 3000)

                    }
                }
            }

        }, 5 * 1000)
    }

    function isElementVisible(element) {
        // 首先检查传入的参数是否为Element对象
        if (!(element instanceof Element)) {
            console.error('The provided parameter is not an Element.');
            return false;
        }

        // 检查元素是否在DOM中
        if (!document.body.contains(element)) {
            return false;
        }

        // 获取元素的计算样式
        var style = window.getComputedStyle(element);

        // 检查元素的visibility属性
        if (style.visibility === 'hidden') {
            return false;
        }

        // 检查元素的opacity属性
        if (style.opacity === '0') {
            return false;
        }

        // 检查元素的尺寸
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return false;
        }

        // 获取元素的位置和尺寸
        var rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return false;
        }

        // 检查元素是否在视口内
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
            return false;
        }

        // 检查元素是否被其他元素遮挡
        while ((element = element.parentNode) && !document.body.contains(element)) {
            if (style['overflow'] === 'hidden') {
                var parentRect = element.getBoundingClientRect();
                if (rect.right < parentRect.left || rect.left > parentRect.right || rect.bottom < parentRect.top || rect.top > parentRect.bottom) {
                    return false;
                }
            }
        }

        // 如果所有检查都通过了，那么元素是可见的
        return true;
    }

})();
