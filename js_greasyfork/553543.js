// ==UserScript==
// @name         人民日报数字报-阅读优化
// @namespace    https://greasyfork.org/users/1072769
// @version      0.3
// @description  1. 新增PDF预览按钮; 2. 移除手机版链接; 3. 移除顶部和底部导航; 4. 添加网页全屏按钮；5. 优化返回顶部按钮。
// @author       yingming006
// @match        *://paper.people.com.cn/rmrb/pc/layout/*
// @match        *://paper.people.com.cn/rmrb/pc/content/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=people.com.cn
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/553543/%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5%E6%95%B0%E5%AD%97%E6%8A%A5-%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/553543/%E4%BA%BA%E6%B0%91%E6%97%A5%E6%8A%A5%E6%95%B0%E5%AD%97%E6%8A%A5-%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const pdfDownloadLink = document.querySelector('.paper-bot .btn a');
 
    if (pdfDownloadLink) {
        const pdfUrl = pdfDownloadLink.href;
        const pdfPreviewLink = document.createElement('a');
        pdfPreviewLink.textContent = 'PDF预览';
        pdfPreviewLink.href = pdfUrl;
        pdfPreviewLink.setAttribute('target', '_blank');
        pdfPreviewLink.setAttribute('rel', 'noopener noreferrer');
        const buttonContainer = pdfDownloadLink.parentElement;
        if (buttonContainer) {
            buttonContainer.insertBefore(pdfPreviewLink, pdfDownloadLink);
            buttonContainer.insertBefore(document.createTextNode('|'), pdfDownloadLink);
            console.log('PDF预览按钮已添加。');
        }
    } else {
        console.log('在当前页面未找到PDF下载链接，无法添加预览按钮。');
    }
 
    const mobileLinkDiv = document.getElementById('tiaozhuan');
    if (mobileLinkDiv) {
        mobileLinkDiv.remove();
    }

    const topElement = document.querySelector('.top');
    if (topElement) { topElement.remove(); }
    const bottomElement = document.querySelector('.bottom');
    if (bottomElement) { bottomElement.remove(); }
    console.log('顶部和底部已移除。');

    const articleBox = document.querySelector('.article-box');
    const paperBox = document.querySelector('.left.paper-box');

    if (articleBox) {
        GM_addStyle(`
            .art-btn {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .art-btn > * {
                white-space: nowrap;
                flex-shrink: 0;
            }
            .art-btn strong {
                float: none !important;
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #go-top {
                z-index: 10000 !important;
            }
            .article-box.fullscreen-mode {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background-color: #fdfdfd; z-index: 9999; padding: 20px;
                box-sizing: border-box; overflow-y: auto; display: flex;
                flex-direction: column; align-items: center;
            }
            .fullscreen-mode .article { width: 90%; max-width: 800px; }
        `);

        const btnContainer = articleBox.querySelector('.art-btn');
        if (btnContainer) {
            const childNodes = Array.from(btnContainer.childNodes);
            childNodes.forEach(node => {
                if (node.nodeType === 3 && !node.textContent.trim()) {
                    node.remove();
                }
            });

            const fullscreenBtn = document.createElement('a');
            fullscreenBtn.href = 'javascript:;';
            const fullscreenBtnSpan = document.createElement('span');
            fullscreenBtnSpan.textContent = '网页全屏';
            fullscreenBtn.appendChild(fullscreenBtnSpan);

            fullscreenBtn.addEventListener('click', () => {
                const isFullscreen = articleBox.classList.contains('fullscreen-mode');
                if (isFullscreen) {
                    articleBox.classList.remove('fullscreen-mode');
                    fullscreenBtnSpan.textContent = '网页全屏';
                    if (paperBox) paperBox.style.display = 'block';
                } else {
                    articleBox.classList.add('fullscreen-mode');
                    fullscreenBtnSpan.textContent = '退出全屏';
                    if (paperBox) paperBox.style.display = 'none';
                }
            });

            const referenceElement = btnContainer.querySelector('strong');
            if (referenceElement) {
                btnContainer.insertBefore(fullscreenBtn, referenceElement);
                console.log('全屏按钮已添加。');
            }
        }

        const goTopButton = document.getElementById('go-top');
        if (goTopButton) {
            const goTopClone = goTopButton.cloneNode(true);
            goTopButton.parentNode.replaceChild(goTopClone, goTopButton);

            goTopClone.addEventListener('click', (e) => {
                e.preventDefault();

                const articleBoxElem = document.querySelector('.article-box');

                if (articleBoxElem && articleBoxElem.classList.contains('fullscreen-mode')) {
                    articleBoxElem.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            console.log('"返回顶部"按钮可在全屏模式下正常工作。');
        }
    }
})();