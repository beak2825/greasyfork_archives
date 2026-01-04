// ==UserScript==
// @name         visualstudio marketplace toolkit
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  visualstudio marketplace toolkit by Theo·Chan
// @author       Theo·Chan
// @match        *://marketplace.visualstudio.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/552642/visualstudio%20marketplace%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/552642/visualstudio%20marketplace%20toolkit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let vsMarketDownloader = (function () {
        return {
            interval: null,
            // 存储所有绑定的事件回调，方便后续解绑
            eventHandlers: [],

            copyCurl: function(spanEl){
                if (!(spanEl instanceof HTMLSpanElement)) return;

                const curlValue = spanEl.dataset.curl;
                const iconEl = spanEl;
                const tipEl = spanEl.parentElement.querySelector('.curl-tip');

                if (!curlValue || !tipEl || !iconEl) return;

                navigator.clipboard.writeText(curlValue)
                    .then(() => {
                        tipEl.style.display = '';
                        iconEl.style.display = 'none';

                        setTimeout(() => {
                            tipEl.style.display = 'none';
                            iconEl.style.display = '';
                        }, 5000);
                    })
                    .catch((err) => {
                        console.error('复制失败：', err);
                        setTimeout(() => {
                            tipEl.style.display = 'none';
                            iconEl.style.display = 'inline-block';
                        }, 2000);
                    });
            },

            extractPkgName: function(){
                const urlObj = new URL(window.location.href);
                let itemName = urlObj.searchParams.get('itemName');
                return itemName == null ? '' : itemName;
            },

            addDownloadBtn: function () {
                const histories = document.querySelectorAll('tr.version-history-container-row');
                if (histories.length === 0) return;

                // 清除定时器（避免重复执行）
                if (vsMarketDownloader.interval) {
                    clearInterval(vsMarketDownloader.interval);
                    vsMarketDownloader.interval = null;
                }

                if (window.location.host.toUpperCase() !== 'MARKETPLACE.VISUALSTUDIO.COM') return false;

                const pkgName = vsMarketDownloader.extractPkgName();
                if (!pkgName) return; // 无 itemName 时直接返回，避免 split 报错

                const [author, id] = pkgName.split('.');
                if (!author || !id) return; // 兼容 pkgName 格式异常的情况

                // 遍历历史版本（注意：原代码 i 从 1 开始，跳过第一个？需确认逻辑）
                for (let i = 1; i < histories.length; i++) {
                    const historyRow = histories[i];
                    const version = historyRow.firstChild.textContent.trim(); // 去除空格，避免版本号异常
                    const href = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${author}/vsextensions/${id}/${version}/vspackage`;

                    // 创建下载按钮
                    const a = document.createElement('a');
                    a.className = 'bowtie-icon bowtie-install';
                    a.style.marginLeft = '1rem';
                    a.href = href;
                    historyRow.firstChild.appendChild(a);

                    // 创建 curl 复制相关元素
                    const curlSpan = document.createElement('span');
                    curlSpan.style.marginLeft = '.25rem';

                    const curlIcon = document.createElement('span');
                    curlIcon.className = 'curl-icon bowtie-icon bowtie-copy-to-clipboard';
                    curlIcon.style.cssText = 'color: #1e90ff; cursor:pointer; padding: 0px 1px;';
                    curlIcon.title = '复制为 curl 命令';
                    curlIcon.dataset.curl = `curl -o ${id}-${version}@${author}.vsix ${href}`;

                    // 存储事件回调，方便后续解绑
                    const clickHandler = (e) => {
                        e.stopPropagation(); // 阻止事件冒泡（可选）
                        vsMarketDownloader.copyCurl(curlIcon);
                    };
                    curlIcon.addEventListener('click', clickHandler);
                    vsMarketDownloader.eventHandlers.push({ element: curlIcon, handler: clickHandler });

                    const curlTip = document.createElement('span');
                    curlTip.className = 'curl-tip bowtie-icon bowtie-check';
                    curlTip.style.cssText = 'color: rgb(16, 124, 16); border: 2px solid rgb(16, 124, 16); border-radius: 2px; padding: 0px 1px; display: none;';
                    curlTip.title = '已复制到剪切板';

                    curlSpan.appendChild(curlIcon);
                    curlSpan.appendChild(curlTip);
                    historyRow.firstChild.appendChild(curlSpan);
                }
                return true;
            },

            // 清理资源：解绑事件 + 清除定时器
            cleanup: function() {
                // 解绑所有事件监听
                vsMarketDownloader.eventHandlers.forEach(({ element, handler }) => {
                    element.removeEventListener('click', handler);
                });
                vsMarketDownloader.eventHandlers = [];

                // 清除定时器
                if (vsMarketDownloader.interval) {
                    clearInterval(vsMarketDownloader.interval);
                    vsMarketDownloader.interval = null;
                }
            }
        };
    })();

    // 启动定时器（1.2秒轮询添加按钮）
    vsMarketDownloader.interval = setInterval(() => {
        vsMarketDownloader.addDownloadBtn();
    }, 1200);

    // 页面卸载时清理资源（避免内存泄漏）
    window.addEventListener('beforeunload', () => {
        vsMarketDownloader.cleanup();
    });
})();