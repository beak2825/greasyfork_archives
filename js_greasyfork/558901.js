// ==UserScript==
// @name         【水源社区】自定义分享用户名
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  不错的分享👍
// @author       来自深渊
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/558901/%E3%80%90%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E3%80%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E7%94%A8%E6%88%B7%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/558901/%E3%80%90%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E3%80%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E7%94%A8%E6%88%B7%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================
    const USER_SUFFIX = "?u=HCWL"; // <== 在这里设置你的自定义后缀
    // ===========================

    // 要匹配的正则表达式：从 '?u=' 开始到字符串结尾
    const REGEX_TO_REPLACE = /\?u=.+$/;

    const originalExecCommand = document.execCommand;

    /**
     * 自定义的 document.execCommand 实现
     * @param {string} commandId - 要执行的命令，我们只关心 'copy'
     * @param {boolean} [showUI=false] - 是否显示用户界面 (通常为 false)
     * @param {string} [value=null] - 命令的值 (通常为 null)
     * @returns {boolean} - 是否成功执行命令
     */
    document.execCommand = function(commandId, showUI = false, value = null) {
        if (commandId === 'copy') {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT')) {
                const inputElement = activeElement;
                const originalValue = inputElement.value;
                if (originalValue && REGEX_TO_REPLACE.test(originalValue)) {
                    const newValue = originalValue.replace(REGEX_TO_REPLACE, USER_SUFFIX);
                    inputElement.value = newValue;
                    inputElement.select();

                    let success = false;
                    try {
                        success = originalExecCommand.call(document, commandId, showUI, value);
                    } catch (e) {
                        console.error('Error during original copy execution:', e);
                    }

                    return success;

                }
            }
        }

        // 如果不匹配要求（非copy命令，或不匹配的元素，或不匹配的正则），则执行原始的 execCommand
        return originalExecCommand.call(document, commandId, showUI, value);
    };
})();