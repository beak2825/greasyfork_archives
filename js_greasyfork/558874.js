// ==UserScript==
// @name         csdn去广告
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @date         2025-12-24
// @description  csdn去广告,自动展开
// @description:zh-cn  csdn去广告,自动展开
// @author       小明
// @license MIT
// @match        https://blog.csdn.net/*
// @match        https://so.csdn.net/*
// @match        https://*.blog.csdn.net/*
// @match        https://www.csdn.net/*
// @match        https://edu.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558874/csdn%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/558874/csdn%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let display = "{display:none !important}";
    let vis = "{visibility:hidden !important}";

    //------blog------
    GM_addStyle(".preview-wrapper1{display:none !important}");


    //---so---
    GM_addStyle("#csdn-toolbar > div > div > div.toolbar-container-right > div > div.toolbar-btn.toolbar-btn-vip.csdn-toolbar-fl > a > img{display:none !important}");

	//------blog------
    //顶部
    let ding1 = "#csdn-toolbar > div.toolbar-advert";
    GM_addStyle(ding1+display);

    //会员中心
    let ss1 = "#csdn-toolbar > div > div > div.toolbar-container-right > div > div.toolbar-btn.toolbar-btn-vip.csdn-toolbar-fl > a > img";
    GM_addStyle(ss1+display);
    //消息小红点
    let ss2 = "#toolbar-remind > span > i";
    GM_addStyle(ss2+display);

    //右侧
    // 右侧vip服务
    GM_addStyle(".sidecolumn-vip{display:none !important}");
    GM_addStyle(".csdn-common-logo-advert{display:none !important}");
    GM_addStyle("#sidecolumn-deepseek{display:none !important}");

    //内容
    let content1 = ".opt-box";
    GM_addStyle(content1+display);
    GM_addStyle(".pre-numbering{display:none !important}");

    //------www------

    //正在直播
    let zhibo1 = ".live-type";
    GM_addStyle(zhibo1+vis);


    //------edu------
    GM_addStyle(".top_banner"+display);
    //GM_addStyle(".v-modal"+display);
    GM_addStyle(".el-dialog__wrapper"+display);
	//GM_addStyle(`
	//.top_banner,
	//.v-modal,
	//.el-dialog__wrapper{
	//	display:none !important
	//}
	//`);


    function basicClick() {
        // 查找所有包含"hide-preCode-bt"的按钮
        const buttons = document.querySelectorAll('[class*="hide-preCode-bt"]');

        if (buttons.length > 0) {
            console.log(`找到 ${buttons.length} 个需要点击的展开按钮`);

            buttons.forEach(button => {
                try {
                    // 模拟点击事件
                    button.click();
                    console.log('已点击展开按钮:', button);
                } catch (error) {
                    console.error('点击按钮时出错:', error, button);
                }
            });
        } else {
            console.log('未找到包含"hide-preCode-bt"的按钮');
        }
    }

    basicClick();
    GM_addStyle(".hide-preCode-box{display:none !important}");

})();