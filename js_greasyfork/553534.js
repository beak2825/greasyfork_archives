// ==UserScript==
// @name         BingPageSimplify
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  simplify cn.bing.com page
// @author       Favian096
// @match        *://*.bing.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553534/BingPageSimplify.user.js
// @updateURL https://update.greasyfork.org/scripts/553534/BingPageSimplify.meta.js
// ==/UserScript==
/* eslint-disable no-undef */

(function() {
    'use strict';

    // 元素样式调整
    GM_addStyle("#sa_pn_block,.sb_form_placeholder_query,.ad-ghost-slug {display:none!important;}");
    GM_addStyle(".b_searchboxForm {border-radius:12px!important}");
    GM_addStyle(".est_common::after {border-radius:10px!important}");


    //设置列表内元素部位不再显示
    let simplifyElements = ['.sb_feedback_button', '#id_qrcode', '#id_rh_w', '.id_button', '.scope_cont', '.below_sbox', '.cdxConv_slsboxl']
    simplifyElements.forEach(element=>{
        let elementTemp = document.querySelector(element);
        if(elementTemp){
            elementTemp.style.display = 'none'
        }
    })


    //个别元素样式调整
    document.querySelector('.head_cont').style.top = '320%'
    document.querySelector('.head_cont').style.left = '43%'
    document.querySelector('#sb_form').style.borderRadius = '12px'
    document.querySelector('.sbox_cn').style.top = '32%'
    document.querySelector('.sbox_cn').style.left = '12%'
    //document.querySelector('.sbox_cn').style.width = '800px'
    //document.querySelector('.as_rsform').style.width = '700px'
    document.querySelector('.sb_form').style.width = '800px'
    //document.querySelector('.sb_form').style.top = '150%'
    //document.querySelector('.as_exp').style.width = '800px'
    //document.querySelector('.as_show').style.width = '800px'
    document.querySelector('.sa_as').style.borderRadius = '12px'


    //输入框的提示词替换
    const form = document.querySelector('#sb_form');
    const observer = new MutationObserver(() => {
        let placeholder = document.querySelector('.sb_form_placeholder')
        if(placeholder){
            placeholder.innerHTML = '<span style="color: #999;">键入搜索词回车以开始 . . . </span>';
            observer.disconnect()
        }
    })
    observer.observe(form,{ childList: true, subtree: true });


    // ...


    console.log("BingPageSimplify process finished !")


})();