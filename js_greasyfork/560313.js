// ==UserScript==
// @name         あいもげ画像レス表示幅調整
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  画像が添付されているレスの表示幅を広げます
// @author       Feldschlacht
// @match        https://nijiurachan.net/pc/thread*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560313/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%94%BB%E5%83%8F%E3%83%AC%E3%82%B9%E8%A1%A8%E7%A4%BA%E5%B9%85%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/560313/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%94%BB%E5%83%8F%E3%83%AC%E3%82%B9%E8%A1%A8%E7%A4%BA%E5%B9%85%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // マージンの調整(上 右 下 左)
    const config = {
        withImage: {
            blockquote: '16px 0px 0px 16px',
            backlinks: '8px 0px 0px 8px'
        },
        noImage: {
            blockquote: '16px 0px 16px 16px',
            backlinks: '0px'
        }
    };

    const adjustAllRes = () => {
        // すべてのレス用テーブルをループ
        const tables = document.querySelectorAll('table[data-reply-id]');

        tables.forEach(table => {
            const rtd = table.querySelector('.rtd');
            if (!rtd) return;

            const mediaImg = rtd.querySelector('img[align="left"]');
            const mediaVideo = rtd.querySelector('video');

            const blockquote = rtd.querySelector('blockquote');
            const backlinks = rtd.querySelector('.quote-backlinks');

            if (mediaImg || mediaVideo) {
                // 【画像・動画ありレスの処理】
                if (!table.dataset.rebuilt) {
                    rebuildImageLayout(table, rtd, mediaImg, mediaVideo, blockquote, backlinks);
                }
            } else {
                // 【画像なしレスの処理】
                if (blockquote) {
                    blockquote.style.setProperty('margin', config.noImage.blockquote, 'important');
                }
                if (backlinks) {
                    backlinks.style.setProperty('margin-left', config.noImage.backlinks.split(' ').pop(), 'important');
                    backlinks.style.setProperty('margin', config.noImage.backlinks, 'important');
                }
            }
        });
    };

    // 画像・動画ありレスの構造組み換え関数
    const rebuildImageLayout = (table, rtd, mediaImg, mediaVideo, blockquote, backlinks) => {
        let targetElement = null;

        if (mediaImg) {
            // 画像スタイルのリセット処理
            mediaImg.removeAttribute('align');
            mediaImg.removeAttribute('hspace');
            mediaImg.style.float = 'none';
            mediaImg.style.display = 'block';

            // 画像がリンク(a)で囲まれている場合はaタグごと移動対象にする
            targetElement = mediaImg.closest('a') || mediaImg;
        } else if (mediaVideo) {
            // 動画スタイルのリセット処理
            mediaVideo.style.float = 'none';
            mediaVideo.style.display = 'block';
            mediaVideo.style.setProperty('margin', '0', 'important');
            targetElement = mediaVideo;
        }

        if (!targetElement || !blockquote) return;

        const innerTable = document.createElement('table');
        innerTable.style.border = '0';
        innerTable.style.width = 'auto';
        innerTable.style.borderCollapse = 'collapse';
        innerTable.style.marginLeft = '0';
        innerTable.style.marginRight = 'auto';

        const innerTr = innerTable.insertRow();
        const leftTd = innerTr.insertCell();
        const rightTd = innerTr.insertCell();

        leftTd.style.verticalAlign = 'top';
        leftTd.style.width = '1px';
        leftTd.style.whiteSpace = 'nowrap';
        rightTd.style.verticalAlign = 'top';
        rightTd.style.width = 'auto';

        wrapperStyleReset: {
             // 旧ラッパーのようなものがあればスタイルをリセット（念のため）
             targetElement.style.display = 'inline-block';
             targetElement.style.width = 'auto';
        }

        // 画像あり用のマージン適用
        blockquote.style.setProperty('margin', config.withImage.blockquote, 'important');

        leftTd.appendChild(targetElement);

        rightTd.appendChild(blockquote);
        if (backlinks) {
            backlinks.style.setProperty('margin', config.withImage.backlinks, 'important');
            rightTd.appendChild(backlinks);
        }

        rtd.appendChild(innerTable);
        table.style.width = 'auto';
        table.dataset.rebuilt = 'true';
    };

    adjustAllRes();

    const observer = new MutationObserver(() => {
        adjustAllRes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();