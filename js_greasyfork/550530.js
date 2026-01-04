// ==UserScript==
// @name         MQC 附件顯示為縮圖與影片（PMQCUPLOADL）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  將MQC附件頁的「開啟」按鈕隱藏，以圖片或影片方式顯示（三列排列），點擊可開原始檔，其他資訊全部隱藏
// @match        https://appsvr12.panasonic.com.tw/MQC/PMQCUPLOADL.asp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550530/MQC%20%E9%99%84%E4%BB%B6%E9%A1%AF%E7%A4%BA%E7%82%BA%E7%B8%AE%E5%9C%96%E8%88%87%E5%BD%B1%E7%89%87%EF%BC%88PMQCUPLOADL%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550530/MQC%20%E9%99%84%E4%BB%B6%E9%A1%AF%E7%A4%BA%E7%82%BA%E7%B8%AE%E5%9C%96%E8%88%87%E5%BD%B1%E7%89%87%EF%BC%88PMQCUPLOADL%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 隱藏原有畫面內容
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].style.display = 'none';
    }

    // 建立顯示區域
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    container.style.gap = '10px';
    container.style.padding = '20px';
    container.style.background = 'lightgoldenrodyellow';
    container.style.boxSizing = 'border-box';
    document.body.appendChild(container);

    // 尋找按鈕
    const buttons = document.querySelectorAll('input[type="button"][onclick^="return File_onclick"]');

    buttons.forEach(button => {
        const onclickText = button.getAttribute('onclick');
        const match = onclickText.match(/'[^']*','([^']*)'/);
        if (!match) return;

        const filePath = match[1];
        const fileUrl = 'https://appsvr12.panasonic.com.tw' + filePath;
        const lowerUrl = fileUrl.toLowerCase();
        const isVideo = /\.(mp4|mov|webm|ogg)$/.test(lowerUrl);

        let mediaElement;

        if (isVideo) {
            // 建立影片
            const video = document.createElement('video');
            video.src = fileUrl;
            video.controls = true;
            video.style.width = '100%';
            video.style.maxHeight = '300px';
            video.style.border = '1px solid #999';

            // 包裝成超連結（影片也可以點擊開啟原始檔）
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            link.appendChild(video);
            mediaElement = link;
        } else {
            // 圖片
            const img = document.createElement('img');
            img.src = fileUrl;
            img.style.width = '100%';
            img.style.cursor = 'pointer';
            img.style.border = '1px solid #999';
            img.title = '點擊開啟原圖';
            img.addEventListener('click', () => {
                window.open(fileUrl, '_blank');
            });
            mediaElement = img;
        }

        container.appendChild(mediaElement);
    });
})();
