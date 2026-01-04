// ==UserScript==
// @name         新・北林评教
// @license      Public Domain
// @namespace    icu.bjfu.pjpx
// @version      ver2.0.0-2026-01-03
// @description  为北京林业大学 newjwxt 自动填写学生评教。
// @author       74
// @match        http://newjwxt.bjfu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @icon         https://www.bjfu.edu.cn/images/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561355/%E6%96%B0%E3%83%BB%E5%8C%97%E6%9E%97%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/561355/%E6%96%B0%E3%83%BB%E5%8C%97%E6%9E%97%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const no = () => true;

    window.confirm = no;
    window.alert = no;
    window.message = no;

    window.addEventListener('load', function () {
        setTimeout(() => {
            $('#table1:not(#table1:last-child, #table1:nth-last-child(2)) td>input:first-child').prop(true);
            $((new Array(74)).keys().map(i => '#pjly_'+i+',').reduce((acc, i) => acc+i).slice(0, -1)).val('非常满意，老师很不错！');
            setTimeout(() => { $('#table1:nth-last-child(2) tr:nth-child(-n+2) input').prop(true); }, 74);
            setTimeout(() => {
                $('#tj').click();
                // $('#bc').click();
            }, 148);
        }, 74);
    });
})();