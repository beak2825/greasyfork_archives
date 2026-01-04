// ==UserScript==
// @name         IPE添加预览样式和快捷键 (on THBWiki)
// @namespace    https://greasyfork.org/users/551710
// @version      1.0
// @description  为 InPageEdit 的预览添加缺少的样式，以及各种快捷键
// @author       Gzz
// @match        *://thwiki.cc/*
// @match        *://touhou.review/*
// @icon         https://static.thbwiki.cc/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549815/IPE%E6%B7%BB%E5%8A%A0%E9%A2%84%E8%A7%88%E6%A0%B7%E5%BC%8F%E5%92%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%20%28on%20THBWiki%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549815/IPE%E6%B7%BB%E5%8A%A0%E9%A2%84%E8%A7%88%E6%A0%B7%E5%BC%8F%E5%92%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%20%28on%20THBWiki%29.meta.js
// ==/UserScript==

(function() {
    // 去掉 IPE 预览窗口的内边距
    const style = document.createElement('style');
    style.innerHTML = `
    .in-page-edit.previewbox .ssi-modalContent {
        padding: 0;
    }
    .in-page-edit.previewbox .ssi-overflow::before, .in-page-edit.previewbox .ssi-overflow::after {
        height: 0;
    }
    `;
    document.head.appendChild(style);

    function addAccessKeys(editor) {
        // 给编辑区添加快捷键 Alt+,
        const progress = editor.querySelector('.ipe-progress');
        if (!progress.style.display) {
            // 等待编辑器加载完毕
            const observer = new MutationObserver((mutations, observer) => {
                if (progress.style.display !== 'none') return;
                setTimeout(() => {
                    // 判断编辑器类型: CodeMirror 6, Monaco, CodeMirror 5, default
                    let types = ['.cm-content', '.inputarea', '.CodeMirror textarea', '.editArea'];
                    editorType = types.find(type => editor.querySelector(type));

                    const editArea = editor.querySelector(editorType);
                    editArea?.setAttribute('accesskey', ',');
                    editArea?.focus();
                }, 300);
                observer.disconnect();
            });
            observer.observe(progress, { attributes: true });
        } else {
            editor.querySelector(editorType)?.setAttribute('accesskey', ',');
        }

        // 预览: Alt+P, 差异: Alt+V
        const buttons = editor.querySelectorAll('#ssi-leftButtons > button');
        if (buttons.length > 2) {
            buttons[0].title = 'Ctrl+S';
            buttons[1].accessKey = 'p';
            buttons[1].title = 'Alt+P';
            buttons[2].accessKey = 'v';
            buttons[2].title = 'Alt+V';

            // 已存在差异窗口时按下按钮则关闭窗口
            buttons[2].addEventListener('click', () => {
                if (!diff) return;
                setTimeout(() => {
                    document.querySelector('.in-page-edit.quick-diff .ssi-closeIcon')?.click();
                }, 0);
            }, { capture: true });
        }

        // 摘要: Alt+B
        const summary = editor.querySelector('.editSummary');
        if (summary) {
            summary.accessKey = 'b';
            summary.title = 'Alt+B';
        }

        // 小编辑: Alt+I
        const minor = editor.querySelector('.editMinor')?.closest('label');
        if (minor) {
            minor.accessKey = 'i';
            minor.title = 'Alt+I';
        }

        // 监视: Alt+W
        const watch = editor.querySelector('.watchList');
        const label = watch?.closest('label');
        const span = label?.querySelector('span');
        if (!label) return;

        // label 无法被 accesskey 直接激活, 加在 span 上
        span.accessKey = 'w';
        if (label.dataset.processed) return;

        label.title += ' [Alt+W]';
        label.addEventListener('click', () => {
            label.title = 'Alt+W';
        }, { once: true });
        label.dataset.processed = true;
    }

    function removeAccessKeys(editor) {
        editor.querySelectorAll('[accesskey]').forEach(el => {el.accessKey = ''});
    }

    // 等待编辑按钮出现, 添加快捷键 Alt+O
    const observerEdit = new MutationObserver((mutations, observer) => {
        const btn = document.getElementById('edit-btn');
        if (!btn) return;
        btn.accessKey = 'o';
        btn.title = 'Alt+O';

        // 先打开再关闭一次, 解决当前版本 CodeMirror 6 加载不及时的问题
        btn.click();
        document.querySelector('.in-page-edit.ipe-editor .ssi-closeIcon')?.click();
        document.querySelectorAll('.in-page-edit.notify').forEach(notify => notify.remove());
        observer.disconnect();
    });
    observerEdit.observe(document.body, { childList: true });

    // 监听 <body> 直接子元素变化
    let numModals = 0, numEditors = 0;
    let editorType, diff;
    const observer = new MutationObserver(() => {
        const modals = Array.from(document.querySelectorAll('body > .in-page-edit'));
        const lastModal = modals.at(-1);
        if (modals.length === numModals) return;

        const editors = modals.filter(el => el.matches('.ipe-editor'));
        const lastEditor = editors.at(-1);
        numModals = modals.length;

        // 聚焦最上层的窗口
        if (lastModal && lastModal === lastEditor) {
            if (editorType) lastEditor.querySelector(editorType)?.focus();
        } else {
            const el = ['.ssi-overflow', '.ssi-modalContent'].map(type => lastModal?.querySelector(type)).find(Boolean);
            if (el) {
                // 使上下键可以滚动
                el.tabIndex = '0';
                el.style.outline = 'none';
                el.focus();
            }
        }

        if (!lastEditor) {
            if (numEditors) {
                document.querySelectorAll('[data-accesskey]').forEach(el => {el.accessKey = el.dataset.accesskey});
                numEditors = 0;
            }
            return;
        }

        // 快捷键只加在最上层的编辑器里
        if (editors.length > numEditors) {
            if (numEditors) {
                removeAccessKeys(editors.at(-2));
            } else {
                // 去掉页面里已有的快捷键
                document.querySelectorAll('[accesskey]').forEach(el => {
                    el.dataset.accesskey = el.accessKey;
                    el.accessKey = '';
                });
            }
            addAccessKeys(lastEditor);
        } else if (editors.length < numEditors) {
            addAccessKeys(lastEditor);
        }
        numEditors = editors.length;

        // 如果存在两个以上的预览窗口则全部关闭
        const previews = document.querySelectorAll('.in-page-edit.previewbox');
        if (previews.length > 1) {
            previews.forEach(preview => preview.querySelector('.ssi-closeIcon')?.click());
        } else if (previews.length) {
            // 给预览内容添加 class
            const preview = previews[0].querySelector('.InPageEditPreview');
            preview.classList.add('mw-body', 'mw-body-content', 'mw-content-ltr');
            preview.style.marginLeft = 0;
        }

        diff = document.querySelector('.in-page-edit.quick-diff');
    });
    observer.observe(document.body, { childList: true });
})();
