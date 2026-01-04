// ==UserScript==
// @name         【广告去除】哔哩哔哩B站
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  去除哔哩哔哩B站广告
// @author       SuCloudPlus
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557607/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/557607/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //*************************************************************************************
    //----------------------------------------广告匹配规则
    //*************************************************************************************
    var url = window.location.href;
    var domain = document.domain;
    var pathSegment = window.location.pathname.split('/')[1]

    var names = [];

    //******************
    //---------B站首页
    //******************
    if (/https?:\/\/www\.bilibili\.com\/?$/.test(url)) {
        console.log('[广告去除] B站首页');
        names = [
            //div class="feed-card" data-v-6711c968=""
            ['//*[@class="bili-video-card__stats--text" and text()="广告"]/ancestor::*[@class="feed-card"]', "remove"], // 伪装视频的广告
            //div data-v-6711c968="" class="bili-feed-card" data-feed-card-row-col="7-2"
            ['//*[@class="bili-video-card__stats--text" and text()="广告"]/ancestor::*[@class="bili-feed-card"]', "remove"], // 伪装视频的广告

        ];
    }


    //******************
    //---------B站视频页
    //******************
    else if (url.includes('www.bilibili.com/video')) {
        console.log('[广告去除]B站视频页');
        names = [
            ['//*[@id="slide_ad"]', "hide"], // 右侧弹幕列表下的大广告
            ['//*[@class="video-card-ad-small"]', "hide"], // 右侧弹幕列表下的小广告
            ['//div[@class="video-page-game-card-small"]', "hide"], // 右侧弹幕列表下的游戏下载小广告
            ['//*[@class="ad-report strip-ad left-banner"]', "hide"], // 视频下方评论区上方横幅广告
            ['//*[@class="activity-m-v1 act-end"]', "hide"], // 视频下方评论区上方横幅广告
            ['//*[@class="ad-report ad-floor-exp right-bottom-banner"]', "hide"], // 右侧下方广告
        ];
    }

    //******************
    //---------B站动态
    //******************
    else if (url.includes('t.bilibili.com')) {
        console.log('[广告去除]B站动态');
        names = [

        ];
    }



    //******************
    //---------通用
    //******************
    if (url) {
        console.log('[广告去除] 通用');
        names.push(...[
            ['//*[contains("bili-header__bar", class)]/ul[@class="right-entry"]//*[@class="v-popover is-bottom"]', "remove"], // 右上提示登录弹窗
            ['/html/body/div[@class="lt-row"]/div[@class="lt-col"]/div[@class="login-tip"]', "remove"], // 右下提示登录弹窗

        ])
    }







    //*************************************************************************************
    //----------------------------------------广告去除函数
    //*************************************************************************************
    // XPath查询辅助函数 - 过滤掉已隐藏的元素
    function getElementsByXPath(xpath) {
        const result = [];
        const nodesSnapshot = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
            const element = nodesSnapshot.snapshotItem(i);

            // 检查元素是否已隐藏
            if (!isElementHidden(element)) {
                result.push(element);
            }
        }

        return result;
    }

    // 基本的隐藏检查，简化版本
    function isElementHidden(element) {
        if (!element || !(element instanceof Element)) {
            return true;
        }

        // 检查元素自身和父元素的显示状态
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none' ||
            computedStyle.visibility === 'hidden') {
            return true;
        }

        // 检查是否有隐藏的祖先元素
        let parent = element;
        while (parent && parent !== document.documentElement) {
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'none' ||
                parentStyle.visibility === 'hidden') {
                return true;
            }
            parent = parent.parentElement;
        }

        return false;
    }

    // 根据动作类型处理元素
    function processElementsByAction(elements, action, xpath) {
        elements.forEach((element, index) => {
            switch (action) {
                case "remove":
                    element.remove();
                    break;

                case "hide":
                    element.style.display = 'none';
                    break;

                case "mark":
                    element.setAttribute('data-processed', 'true');
                    break;

                case "disable":
                    element.disabled = true;
                    element.style.opacity = '0.5';
                    break;

                default:
                    console.warn(`[元素处理] 未知的动作类型: ${action}`);
                    return;
            }

            console.log(`[元素处理] 元素 ${index + 1}/${elements.length} (${xpath}) 执行 ${action} 成功`);
        });
    }


    function processElements(rules) {
        if (!rules || !rules.length) {
            console.log("[元素处理] 没有需要处理的规则");
            return;
        }

        let hasProcessed = false;

        rules.forEach(rule => {
            const [xpath, action] = rule;

            if (!xpath || !action) {
                console.warn("[元素处理] 规则格式错误，跳过处理", rule);
                return;
            }

            try {
                const elements = getElementsByXPath(xpath);

                if (!elements || elements.length === 0) {
                    return;
                }

                processElementsByAction(elements, action, xpath);
                hasProcessed = true;

            } catch (error) {
                console.error(`[元素处理] 处理规则失败: ${xpath}`, error);
            }
        });

        if (!hasProcessed) {
            console.log("[元素处理] 未发现需要处理的元素");
        }
    }




    //*************************************************************************************
    //----------------------------------------广告去除
    //*************************************************************************************
    // 定义要运行的函数
    function run() {
        processElements(names);
    }

    var counter = 0; // 计数器变量
    var interval = setInterval(function() {
        run();
        counter++; // 每次执行时计数器加1
        if (counter === 100) { // 在达到指定次数后停止执行
            clearInterval(interval);
        }
    }, 50);

    // 每隔一秒运行一次函数
    setInterval(run, 1000);



    //*************************************************************************************
    //----------------------------------------置灰去除
    //*************************************************************************************
    function delFilter() {


        let box = document.getElementsByClassName('memorial');
        console.log(box);
        for (var i = 0; i < box.length; i++) {
            box[i].className = box[i].className.replace(/memorial/g, '');
        }

    }
    delFilter();


})();