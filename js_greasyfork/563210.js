// ==UserScript==
// @name         虎扑表情包自动缩小
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅缩小虎扑回帖中的大尺寸表情包，主帖图片保持不变
// @author       GeBron
// @match        https://bbs.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563210/%E8%99%8E%E6%89%91%E8%A1%A8%E6%83%85%E5%8C%85%E8%87%AA%E5%8A%A8%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563210/%E8%99%8E%E6%89%91%E8%A1%A8%E6%83%85%E5%8C%85%E8%87%AA%E5%8A%A8%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_SIZE = 150;

    function resizeReplyImages() {
        // 关键点：只选择回帖列表（.post-reply-list）或评论内容区域里的图片
        // 这样可以避开主帖（通常在 .topic-content-article 或 post-user-wrapper 之外）
        const replyImgs = document.querySelectorAll('.post-reply-list img, .reply-list img, .comment-content img');

        replyImgs.forEach(img => {
            let src = img.src;
            if (!src || img.dataset.resizingDone) return;

            // 识别宽高
            const match = src.match(/_w_(\d+)_h_(\d+)/);

            if (match) {
                const width = parseInt(match[1]);
                const height = parseInt(match[2]);

                // 如果长或宽超过阈值
                if (width > MAX_SIZE || height > MAX_SIZE) {
                    // 缩小显示尺寸
                    img.style.maxWidth = MAX_SIZE + 'px';
                    img.style.maxHeight = MAX_SIZE + 'px';
                    img.style.objectFit = 'contain';
                    img.style.cursor = 'zoom-in'; // 增加一个可以放大的手势提示

                    // 优化图片加载源
                    if (src.includes('x-oss-process=')) {
                        img.src = src.replace(/image\/resize,w_\d+/, 'image/resize,w_300');
                    } else {
                        const connector = src.includes('?') ? '&' : '?';
                        img.src = src + connector + 'x-oss-process=image/resize,w_300';
                    }
                }
            }
            img.dataset.resizingDone = 'true';
        });
    }

    // 执行
    resizeReplyImages();

    // 监控异步加载的回帖
    const observer = new MutationObserver(() => {
        resizeReplyImages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();