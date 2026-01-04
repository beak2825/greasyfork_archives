// ==UserScript==
// @name         博客园编辑器快捷键禁用器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  通过“猴子补丁”方式拦截 editor.md 的初始化过程，强行注入快捷键禁用配置。
// @author       Qixyi
// @match        https://i.cnblogs.com/posts/edit*
// @match        https://i.cnblogs.com/post/new*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547808/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%A6%81%E7%94%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547808/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BC%96%E8%BE%91%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%A6%81%E7%94%A8%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 在某些环境下需要 unsafeWindow 才能可靠地访问和修改页面自身的全局变量
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    console.log('油猴脚本 V4: 已启动，准备拦截 window.editormd 的创建。');

    // --- 在这里配置您想要禁用的快捷键 ---
    // 这是 editor.md 官方支持的快捷键名称格式。
    const keyMapsToBlock = [
        'Ctrl-1', 'Cmd-1',
        'Ctrl-2', 'Cmd-2',
        'Ctrl-3', 'Cmd-3',
        'Ctrl-4', 'Cmd-4',
        'Ctrl-5', 'Cmd-5',
        'Ctrl-6', 'Cmd-6',
        'Ctrl-B', 'Cmd-B', // 加粗
        'Ctrl-I', 'Cmd-I', // 斜体
        'Ctrl-Q', 'Cmd-Q', // 引用
        'Ctrl-K', 'Cmd-K', // 链接
        'Ctrl-L', 'Cmd-L', // 链接
        'Ctrl-G', 'Cmd-G', // 图片
        'Ctrl-H', 'Cmd-H', // 分割线
    ];

    let originalEditormd = null;
    Object.defineProperty(win, 'editormd', {
        configurable: true,
        enumerable: true,
        get: function() {
            return originalEditormd;
        },
        set: function(value) {
            console.log(`成功拦截到 'window.editormd'！正在进行替换...`);
            originalEditormd = value;
            const patchedEditormd = function(id, config) {
                console.log('博客园页面正在调用 editor.md，已进入我们的代理函数。');
                config = config || {};
                config.disabledKeyMaps = keyMapsToBlock;
                console.log('已成功注入禁用的快捷键配置:', config.disabledKeyMaps);
                return originalEditormd.apply(this, arguments);
            };
            for (let key in originalEditormd) {
                if (Object.prototype.hasOwnProperty.call(originalEditormd, key)) {
                    patchedEditormd[key] = originalEditormd[key];
                }
            }
            Object.defineProperty(win, 'editormd', {
                value: patchedEditormd,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
    });
})();