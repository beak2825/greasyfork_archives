// ==UserScript==
// @name        Bangumi 双简介显示
// @namespace   https://github.com/stay206
// @version     1.1
// @description 在 Bangumi 编辑页添加双简介按钮，在条目页添加双简介切换按钮。
// @author      墨云(Sumora）
// @match       https://bangumi.tv/subject/*/edit_detail
// @match       https://bgm.tv/subject/*/edit_detail
// @match       https://chii.in/subject/*/edit_detail
// @match       https://bangumi.tv/subject/*
// @match       https://bgm.tv/subject/*
// @match       https://chii.in/subject/*
// @exclude     *://*/subject/*/comments*
// @exclude     *://*/subject/*/add_related*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547952/Bangumi%20%E5%8F%8C%E7%AE%80%E4%BB%8B%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547952/Bangumi%20%E5%8F%8C%E7%AE%80%E4%BB%8B%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 分割线
    const fullSeparator = '\n\n\n\n[中文简介]';

    const isEditPage = window.location.href.includes('/edit_detail');

    if (isEditPage) {
        // --- 编辑页面的功能 ---
        window.addEventListener('load', function() {
            const summaryTextarea = document.getElementById('subject_summary');
            if (summaryTextarea) {
                const splitButton = document.createElement('button');
                splitButton.type = 'button';
                splitButton.textContent = '⤵';
                splitButton.title = '添加中文简介';
                splitButton.style.cssText = `
                    margin-left: 5px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #f7f7f7;
                    padding: 4px 8px;
                `;

                summaryTextarea.parentNode.insertBefore(splitButton, summaryTextarea.nextSibling);

                let isSplitView = false;
                let secondTextarea, separatorSpan;

                function getElements() {
                    secondTextarea = document.getElementById('summary_second_part');
                    separatorSpan = document.getElementById('summary_separator');
                }

                function createElements() {
                    secondTextarea = document.createElement('textarea');
                    secondTextarea.name = 'summary_second_part';
                    secondTextarea.id = 'summary_second_part';
                    secondTextarea.cols = summaryTextarea.cols;
                    secondTextarea.rows = summaryTextarea.rows;
                    secondTextarea.className = summaryTextarea.className;
                    secondTextarea.style.cssText = summaryTextarea.style.cssText;

                    separatorSpan = document.createElement('span');
                    separatorSpan.id = 'summary_separator';
                    separatorSpan.textContent = fullSeparator;
                    separatorSpan.style.display = 'block';
                    separatorSpan.style.color = '#888';
                    separatorSpan.style.fontSize = '16px';
                    separatorSpan.style.textAlign = 'center';

                    summaryTextarea.parentNode.insertBefore(secondTextarea, summaryTextarea.nextSibling);
                    summaryTextarea.parentNode.insertBefore(separatorSpan, secondTextarea);

                    const syncContents = () => {
                        const firstPart = summaryTextarea.value.split(fullSeparator)[0];
                        const secondPart = secondTextarea.value;
                        const finalValue = firstPart.trim() + (secondPart.trim() ? fullSeparator + '\n' + secondPart : '');
                        summaryTextarea.value = finalValue;
                    };

                    summaryTextarea.addEventListener('input', syncContents);
                    secondTextarea.addEventListener('input', syncContents);
                }

                function syncToSplitTextareas() {
                    const parts = summaryTextarea.value.split(fullSeparator);
                    summaryTextarea.value = parts[0].trim();
                    secondTextarea.value = parts[1] ? parts[1].trim() : '';
                }

                function enterSplitView() {
                    if (!secondTextarea) {
                        createElements();
                    }

                    secondTextarea.style.display = 'block';
                    separatorSpan.style.display = 'block';

                    syncToSplitTextareas();
                    isSplitView = true;
                    splitButton.textContent = '⤴';
                    splitButton.title = '取消';
                }

                function exitSplitView() {
                    summaryTextarea.value = summaryTextarea.value.split(fullSeparator)[0].trim();
                    secondTextarea.value = '';
                    secondTextarea.style.display = 'none';
                    separatorSpan.style.display = 'none';

                    isSplitView = false;
                    splitButton.textContent = '⤵';
                    splitButton.title = '添加中文简介';
                }

                splitButton.addEventListener('click', function() {
                    getElements();
                    if (isSplitView) {
                        exitSplitView();
                    } else {
                        enterSplitView();
                    }
                });

                if (summaryTextarea.value.includes(fullSeparator)) {
                    getElements();
                    enterSplitView();
                }
            }
        });
    } else {
        // --- 详情页面的功能 ---
        window.addEventListener('load', function() {
            const summaryDiv = document.querySelector('div.subject_summary');
            if (summaryDiv) {
                const separatorRegex = /<br\s*>\s*\[中文简介\]\s*<br\s*>/;
                const fullText = summaryDiv.innerHTML;
                const parts = fullText.split(separatorRegex);

                if (parts.length > 1) {
                    const originalText = parts[0].trim();
                    const translatedText = parts[1].trim();

                    const toggleButton = document.createElement('a');
                    toggleButton.href = 'javascript:void(0)';
                    toggleButton.style.cssText = `
                        display: inline-block;
                        margin-bottom: 10px;
                        padding: 4px 8px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        background-color: #f7f7f7;
                        color: #555;
                        text-decoration: none;
                    `;

                    summaryDiv.parentNode.insertBefore(toggleButton, summaryDiv);

                    if (translatedText) {
                        summaryDiv.innerHTML = translatedText;
                        toggleButton.textContent = '显示原文';
                    } else {
                        summaryDiv.innerHTML = originalText;
                        toggleButton.textContent = '显示中文简介';
                    }

                    toggleButton.addEventListener('click', function() {
                        if (this.textContent === '显示中文简介') {
                            this.textContent = '显示原文';
                            summaryDiv.innerHTML = translatedText;
                        } else {
                            this.textContent = '显示中文简介';
                            summaryDiv.innerHTML = originalText;
                        }
                    });
                }
            }
        });
    }
})();