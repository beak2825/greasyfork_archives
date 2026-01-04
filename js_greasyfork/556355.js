// ==UserScript==
// @name         全て歌詞の所為です。 歌詞情報コピー
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  「全て歌詞の所為です。」の歌詞ページで曲情報をコピー、または作者ページで作品リストをコピーするボタンを追加します。
// @icon         https://lyrics.imicomweb.com/static/subekashi/image/icon.e63b371c17c1.ico
// @author       全て0808の所為です。
// @match        https://lyrics.imicomweb.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556355/%E5%85%A8%E3%81%A6%E6%AD%8C%E8%A9%9E%E3%81%AE%E6%89%80%E7%82%BA%E3%81%A7%E3%81%99%E3%80%82%20%E6%AD%8C%E8%A9%9E%E6%83%85%E5%A0%B1%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/556355/%E5%85%A8%E3%81%A6%E6%AD%8C%E8%A9%9E%E3%81%AE%E6%89%80%E7%82%BA%E3%81%A7%E3%81%99%E3%80%82%20%E6%AD%8C%E8%A9%9E%E6%83%85%E5%A0%B1%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 ---
    GM_addStyle(`
        .subekashi-copy-btn {
            display: block;
            margin-bottom: 15px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            background-color: #f7f7f7;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-align: center;
            width: fit-content;
        }
        .subekashi-copy-btn:hover {
            background-color: #e9e9e9;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .subekashi-copy-btn:active {
            background-color: #dcdcdc;
            transform: translateY(1px);
        }
        /* 针对作者页面的特殊定位 */
        #channelsettion .subekashi-copy-btn {
            margin: 10px auto;
        }
    `);

    // --- 通用函数：创建按钮 ---
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.classList.add('subekashi-copy-btn', 'sansfont');
        btn.addEventListener('click', async () => {
            const originalText = btn.textContent;
            await onClick();
            btn.textContent = 'コピーしました！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
        return btn;
    }

    // ==========================================
    // 场景 A: 歌曲详情页 (原功能)
    // ==========================================
    const lyricsWrapper = document.getElementById('lyrics-wrapper');
    if (lyricsWrapper) {
        const IMITATED_BY_LIMIT = 7;

        const copyBtn = createButton('全情報コピー', () => {
            // 1. 获取基础信息
            function getInfoByLabel(label) {
                const rows = document.querySelectorAll('#song-info tr');
                for (const row of rows) {
                    const pTag = row.querySelector('td:first-child p');
                    if (pTag && pTag.textContent.trim() === label) {
                        return row.querySelector('td:last-child').textContent.trim();
                    }
                }
                return '';
            }

            const songTitle = getInfoByLabel('曲名');
            const artistLinks = document.querySelectorAll('#song-info a[href^="/channel/"]');
            const artists = Array.from(artistLinks).map(a => `\`${a.textContent.trim()}\``).join(', ');
            const uploadDate = getInfoByLabel('YouTubeへのアップロード日');

            // 2. 获取模仿元
            let imitatingText = '';
            const imitatingSummary = Array.from(document.querySelectorAll('details > summary'))
                                        .find(summary => summary.textContent.includes('曲の模倣元'));
            if (imitatingSummary) {
                const imitateLinks = imitatingSummary.parentElement.querySelectorAll('.songimitate');
                if (imitateLinks.length > 0) {
                    const songNames = Array.from(imitateLinks).map(link => `\`${link.textContent.trim()}\``).join(', ');
                    imitatingText = `模仿元：${songNames}\n`;
                }
            }

            // 3. 获取模仿曲
            let imitatedByText = '';
            const imitatedBySummary = Array.from(document.querySelectorAll('details > summary'))
                                         .find(summary => summary.textContent.includes('曲の模倣曲'));
            if (imitatedBySummary) {
                const imitateLinks = imitatedBySummary.parentElement.querySelectorAll('.songimitate');
                const totalCount = imitateLinks.length;
                if (totalCount > 0) {
                    let songNames;
                    if (totalCount <= IMITATED_BY_LIMIT) {
                        songNames = Array.from(imitateLinks).map(link => `\`${link.textContent.trim()}\``).join(', ');
                    } else {
                        const firstPart = Array.from(imitateLinks).slice(0, IMITATED_BY_LIMIT).map(link => `\`${link.textContent.trim()}\``).join(', ');
                        songNames = `${firstPart} ...等`;
                    }
                    imitatedByText = `模仿作品 (${totalCount}曲)：${songNames}\n`;
                }
            }

            // 4. 获取歌词
            const lyricsElement = document.getElementById('lyrics');
            const lyrics = lyricsElement ? lyricsElement.innerText.trim() : '歌詞が見つかりませんでした。';

            // 5. 组合 Markdown
            let output = `## 《${songTitle}》\n\n`;
            output += `曲名：\`${songTitle}\`\n`;
            if (artists) output += `作者：${artists}\n`;
            if (uploadDate) output += `上传日期：${uploadDate}\n`;
            output += imitatingText;
            output += imitatedByText;
            output += `\n歌词：\n\`\`\`\n${lyrics}\n\`\`\``;

            GM_setClipboard(output);
        });

        lyricsWrapper.prepend(copyBtn);
    }

    // ==========================================
    // 场景 B: 作者/频道页 (新功能) - 修改后
    // ==========================================
    const channelSection = document.getElementById('channelsettion');
    if (channelSection) {
        const copyListBtn = createButton('作品リストをコピー', () => {
            // 1. 获取作者名
            const h1 = channelSection.querySelector('h1');
            const authorName = h1 ? h1.textContent.trim() : '未知作者';

            // 2. 遍历所有歌曲卡片
            const songCards = channelSection.querySelectorAll('.song-card');
            let output = `## ${authorName}\n${authorName}的作品列表：\n`;

            songCards.forEach(card => {
                // 提取标题 (去除 fontawesome 图标后的纯文本)
                const titleCell = card.querySelector('.song-card-col1.sansfont');
                let title = titleCell ? titleCell.textContent.trim() : '无题';

                // 提取歌词片段
                const lyricsCell = card.querySelector('.song-card-lyrics');
                // 将换行符替换为空格，保持单行显示
                let lyrics = lyricsCell ? lyricsCell.textContent.trim().replace(/[\r\n]+/g, ' ') : '';
                // 如果有歌词，在末尾添加省略号
                if (lyrics) {
                    lyrics += '……';
                }

                // 判断是否为合作
                const isCollab = card.querySelector('.fa-user-friends') !== null || card.innerText.includes('合作');

                // 格式化单行
                output += `- 《${title}》${isCollab ? '（合作） ' : ' '}\`${lyrics}\`\n`;
            });

            GM_setClipboard(output);
        });

        // 将按钮插入到 H1 标题之后，或者下划线之后
        const underline = channelSection.querySelector('.underline');
        if (underline) {
            underline.after(copyListBtn);
        } else {
            channelSection.prepend(copyListBtn);
        }
    }

})();