// ==UserScript==
// @name         知乎问题评论展开 for SingleFile
// @namespace    http://tampermonkey.net/
// @version      2025-11-27-2
// @description  滚动到底部若干次，然后模拟点击展开所有评论，供 SingleFile 保存用
// @author       You
// @match        https://www.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/557012/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%20for%20SingleFile.user.js
// @updateURL https://update.greasyfork.org/scripts/557012/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%20for%20SingleFile.meta.js
// ==/UserScript==

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function expandZhihu() {
    // 点击问题描述的"显示全部"按钮
    document.querySelector('button.QuestionRichText-more')?.click();
    await sleep(300);

    // 滚动页面到底部
    let count = 0;
    while (count < 10) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        window.scrollBy(0,-100);
        count++;
        await sleep(100);
    }

    // 点击所有"展开阅读全文"按钮
    let expandButtons = document.querySelectorAll('button[class*="expandButton"]');
    // let expandButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('展开阅读全文'));
    console.log(`找到 ${expandButtons.length} 个"展开阅读全文"按钮`);

    for (let i = 0; i < expandButtons.length; i++) {
        expandButtons[i].click();
        console.log(`点击了第 ${i + 1} 个展开按钮`);
        await sleep(300);
    }

    // 展开评论区
    const commentButtons = document.querySelectorAll("div.ContentItem-actions > button:nth-child(2)");
    console.log(`找到 ${commentButtons.length} 个评论区按钮`);

    for (let i = 0; i < commentButtons.length; i++) {
        commentButtons[i].click();
        await sleep(100);
    }

    // 关闭评论区
    await sleep(300);
    document.querySelector("div.css-1aq8hf9 > button")?.click();

    // 查找所有包含"展开其他"和"条回复"文本的按钮
    await sleep(300);
    const expandReplyButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
        btn.textContent.includes('展开其他') && btn.textContent.includes('条回复')
    );

    console.log(`展开 ${expandReplyButtons.length} 个其他回复`);

    // 展开其他回复
    for (let i = 0; i < expandReplyButtons.length; i++) {
        expandReplyButtons[i].click();
        await sleep(100);
    }

    // 滚动页面到底部
    count = 0;
    while (count < 10) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        window.scrollBy(0,-100);
        count++;
        await sleep(100);
    }

    // 滚动到页面顶部
    await sleep(500);
    window.scrollTo(0, 0);
    console.log('已滚动到页面顶部');

    console.log('自动化操作完成');
}

// 执行函数
expandZhihu();