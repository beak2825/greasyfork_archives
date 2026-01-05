// ==UserScript==
// @name        400gb
// @namespace   onisuly
// @description 禁止城通网盘检测Adblock
// @include     http://www.400gb.com/file/*
// @version     2014.09.25
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/8263/400gb.user.js
// @updateURL https://update.greasyfork.org/scripts/8263/400gb.meta.js
// ==/UserScript==

function guestviewchkform2() {
    if (typeof copy_clip == 'undefined' || typeof jQuery == 'undefined') {
        alert("由于您打开了类似于广告拦截的相关插件，这些插件影响了网页内容的正常载入，本页无法渲染，请您关闭广告拦截的插件后重试。");
        return false;
    }
    /*if ($("#cproIframe2001holder").size() == 0 || $("#BAIDU_DUP_wrapper_u1258127_0").size() == 0) {
        $(ctmodal).load("/iajax_guest.php?item=file_act&action=download_page_error2").modal();
        return false;
    }*/
    if (document.getElementById("randcode").value.length != 4) {
        $(ctmodal).load("/iajax_guest.php?item=file_act&action=download_page_error1").modal();
        return false;
    }
    return $("#hash_key").val($.base64.decode($("#hash_info").val()));
}

document.getElementsByName("user_form")[0].onsubmit = guestviewchkform2;
