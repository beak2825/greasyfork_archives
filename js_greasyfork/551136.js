// ==UserScript==
// @name         footnote
// @name:zh-CN         豆瓣读书生成中文引用格式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从豆瓣读书网页中提取元数据并生成中文引用格式（芝加哥格式）。
// @description:zh-CN  从豆瓣读书网页中提取元数据并生成中文引用格式（芝加哥格式）。
// @author       entr0pia
// @match        https://book.douban.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551136/footnote.user.js
// @updateURL https://update.greasyfork.org/scripts/551136/footnote.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var title = document.querySelector("#wrapper > h1 > span").textContent;

    var subtitle, author1st, authors, publisher, year, pages, translators='', originalTitle='';
    function catSpan(n) {
        var key = n.textContent.trim().split(':')[0];
        var ast;
        switch (key) {
            case '作者':
                author1st = n.querySelectorAll('a')[0].textContent;
                var authorsList = Array.from(n.querySelectorAll('a'))
                    .map(a => a.textContent);
                authors = authorsList.join('，');
                ast = authors.split(/[，、]/);
                if (ast.length > 1) {
                    author1st = ast[0]
                    authors = ast.join('，');
                }
                console.log('一作:'+author1st);
                break;
            case '出版社':
                publisher = n.nextElementSibling.textContent;
                break;
            case '副标题':
                subtitle = n.nextSibling.textContent.trim();
                console.log('副标题:' + subtitle);
                break;
            case '原作名':
                originalTitle = n.nextSibling.textContent.trim();
                console.log('原作名:' + originalTitle);
                break;
            case '出版年':
                var yearText = n.nextSibling.textContent.trim();
                // 处理格式如 "2024-6-1" 转换为 "2024.06"
                var yearMatch = yearText.match(/(\d{4})-(\d{1,2})-?(\d{1,2})?/);
                if (yearMatch) {
                    var yearPart = yearMatch[1];
                    var monthPart = yearMatch[2].padStart(2, '0');
                    year = yearPart + '.' + monthPart;
                } else {
                    // 如果格式不匹配，直接使用原文本
                    year = yearText;
                }
                console.log('出版年:' + year);
                break;
            case '页数':
                pages = n.nextSibling.textContent.trim();
                break;
            case '译者':
                translators = Array.from(n.querySelectorAll('a'))
                    .map(a => a.textContent)
                    .join('，');
                ast = translators.split(/[，、]/);
                if (ast.length > 1) {
                    translators = ast.join('，');
                }
                console.log('译者:' + translators);
                break;
        }
    }

    // 提取元数据
    Array.from(document.querySelectorAll('#info > span'))
        .map(n => catSpan(n));

    // 构建中文引用格式
    var citation = '';

    // 作者部分 - 格式：作者中文名（作者原名）、作者中文名（作者原名） 著
    if (authors) {
        // 注意：豆瓣上的作者通常已经是中文名，原名信息可能不完整
        // 这里假设作者信息就是中文名，如果需要原名需要额外处理
        citation += authors + ' 著';
    }

    // 译者部分
    if (translators) {
        citation += ', ' + translators + ' 译';
    }

    citation += '. ';

    // 书名部分 - 格式：《书籍中文名》（书籍原名）
    var fullTitle = title;
    if (subtitle) {
        fullTitle = title + '：' + subtitle;
    }
    citation += '《' + fullTitle + '》';

    // 原文书名
    if (originalTitle) {
        citation += '（' + originalTitle + '）';
    }

    citation += '. ';

    // 出版社和年份
    if (publisher) {
        citation += publisher;
    }

    if (year) {
        citation += ', ' + year;
    }

    citation += '. ';

    console.log('生成的引用格式:', citation);

    // 添加一个按钮，点击后将引用文本复制到剪贴板
    const bibButton = document.createElement('button');
    bibButton.textContent = '复制中文引用';
    bibButton.className = 'j a_show_login lnk-sharing lnk-douban-sharing';
    bibButton.type = 'button';
    const container = document.querySelector("#content > div > div.article > div.indent > div.rec-sec");
    if (container != null) {
        container.appendChild(bibButton);
    }

    bibButton.addEventListener('click', () => {
        GM_setClipboard(citation);
        alert('复制成功！');
    });
})();
