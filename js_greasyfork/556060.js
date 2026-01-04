// ==UserScript==
// @name         半自动完成学法考试系统课程学习
// @namespace    chuzhi_code
// @version      1.0.0
// @description  none
// @author       chuzhi
// @match        http*://xfks-study.gdsf.gov.cn/study/*
// @run-at       document-end
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/556060/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/556060/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function executeTarget() {
        if (typeof submitLearn === 'function') {
            try {
                submitLearn();
            } catch (error) {
                console.error('【自动执行脚本】出错：', error);
            }
        } else {
            console.log('【自动执行脚本】暂未找到submitLearn()，将继续等待...');
        }
    }

    // 立即执行一次
    executeTarget();
})();