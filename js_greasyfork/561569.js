// ==UserScript==
// @name         DeepSeek网页端内存溢出修复 (DeepSeek Web Version Out Of Memory Fix)
// @description  阻止Deepseek的collect-rangers收集脚本修复内存溢出问题 (Blocks the collect-rangers analytics script on DeepSeek to fix memory overflow issues.)
// @namespace    https://github.com/deepseek-ai/DeepSeek-V3/issues/1061
// @version      1.0.0
// @author       deepseek
// @match        https://*.deepseek.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561569/DeepSeek%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA%E4%BF%AE%E5%A4%8D%20%28DeepSeek%20Web%20Version%20Out%20Of%20Memory%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561569/DeepSeek%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA%E4%BF%AE%E5%A4%8D%20%28DeepSeek%20Web%20Version%20Out%20Of%20Memory%20Fix%29.meta.js
// ==/UserScript==

// 匹配 collect-rangers-vx.x.x.js 格式的所有版本
const TARGET_PATTERN = /collect-rangers-v\d+\.\d+\.\d+\.js/;
const LOG_PREFIX = '[DeepSeek OOM Fix] ';

(function() {
    'use strict';
    console.log(LOG_PREFIX + 'DeepSeek Web Version Out Of Memory Fix Started');

    function checkExistingScripts() {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (TARGET_PATTERN.test(script.src)) {
                console.log(LOG_PREFIX + 'Try Remove Script: ', script.src);
                try {
                    script.parentNode.removeChild(script);// 相比script.remove();兼容性更好
                    console.log(LOG_PREFIX + 'Script Removed!');
                } catch (e) {
                    console.error(LOG_PREFIX + 'Remove Error: ', e);
                }
            }
        }
    }

    if (document.head) {
        checkExistingScripts();
    } else {
        document.addEventListener('DOMContentLoaded', checkExistingScripts);
    }
})();