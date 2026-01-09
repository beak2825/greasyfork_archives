// ==UserScript==
// @name         阻止123云盘复制行为
// @description  禁止向剪切板中写入内容
// @namespace    https://www.tampermonkey.net/
// @version      1.0
// @author       Gemini
// @match        *://*.123pan.cn/s/*
// @match        *://*.123pan.com/s/*
// @match        *://*.123684.com/s/*
// @match        *://*.123865.com/s/*
// @match        *://*.123912.com/s/*
// @match        *://*.123952.com/s/*
// @match        *://pan.quark.cn/s/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561933/%E9%98%BB%E6%AD%A2123%E4%BA%91%E7%9B%98%E5%A4%8D%E5%88%B6%E8%A1%8C%E4%B8%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561933/%E9%98%BB%E6%AD%A2123%E4%BA%91%E7%9B%98%E5%A4%8D%E5%88%B6%E8%A1%8C%E4%B8%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        prop_desc: {
            writable: false,
            configurable: false,
            enumerable: true
        }
    };

    const blocker = {
        patch_navigator() {
            if (navigator.clipboard) {
                for (const method of ['writeText', 'write']) {
                    Object.defineProperty(navigator.clipboard, method, { 
                        value: () => Promise.resolve(), 
                        ...config.prop_desc 
                    });
                }
            }
        },

        patch_document() {
            const original_exec = document.execCommand;
            const blocked_cmds = new Set(['copy', 'cut']);
            
            Object.defineProperty(document, 'execCommand', {
                value: function(command) {
                    const cmd = command?.toLowerCase();
                    if (blocked_cmds.has(cmd)) {
                        return true;
                    }
                    return original_exec.apply(this, arguments);
                },
                ...config.prop_desc
            });
        },

        event_handler(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    };

    const copy = {
        init() {
            blocker.patch_navigator();
            blocker.patch_document();
            document.addEventListener('copy', blocker.event_handler, true);
            document.addEventListener('cut', blocker.event_handler, true);
        }
    };

    copy.init();
})();