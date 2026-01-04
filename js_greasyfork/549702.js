// ==UserScript==
// @name     hjm3u8
// @namespace    https://greasyfork.org/users/439775
// @description m3u8
// @include  https://*haijiao.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549702/hjm3u8.user.js
// @updateURL https://update.greasyfork.org/scripts/549702/hjm3u8.meta.js
// ==/UserScript==

var itv;

!!function() {
    itv = setInterval(findM3u8, 2000);
}();

function findM3u8() {
    // mobile: .preview-btn  pc: .video-div
    const m3u8El = document.querySelector('.preview-btn') || document.querySelector('.video-div');
    if (!m3u8El) return;
    const m3u8Url = m3u8El['dataset']['url'];

    const sellBtn = document.querySelector('.sell-btn');
    if (!sellBtn) return;
    const titleMatched = sellBtn.innerText.match(/\[(\d+)分(\d+)秒\]/);
    if (titleMatched.length < 3) return;

    const [, min, sec] = titleMatched;

    if (!min || !sec) return;

    clearInterval(itv);

    const duration = +min * 60 + +sec;
    console.log({ duration, m3u8Url })

    const link = document.createElement("a");
    link.href = "https://hjm3u8.netlify.app/?duration=" + duration + "&url=" + m3u8Url;
    link.target = "_blank";
    link.innerText = "打开m3u8";
    link.style = "cursor:pointer";
    sellBtn.parentElement.insertBefore(link, sellBtn);

    const link2 = document.createElement("a");
    link2.href = "http://192.168.2.99:6969/process?url=" + m3u8Url;
    link2.target = "_blank";
    link2.innerText = "下载m3u8";
    link2.style = "cursor:pointer";
    sellBtn.parentElement.insertBefore(link2, sellBtn);
}
