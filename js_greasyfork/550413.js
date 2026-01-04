// ==UserScript==
// @name         Group Standard Downloader
// @namespace    https://yinr.cc/
// @version      0.1
// @description  Group Standard Downloader in ttbz.org.cn
// @author       Yinr
// @icon         https://www.ttbz.org.cn/kkfileview/favicon.ico
// @match        https://www.ttbz.org.cn/kkfileview/onlinePreview*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550413/Group%20Standard%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550413/Group%20Standard%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** @returns {string} */
    const getPdfUrl = () => {
        const imgUrl = document.querySelector('.img-area>img').dataset.src
        return imgUrl.replace(/\/\d+\.(jpg|png)$/, '.pdf')
    }

    const downloadPdf = () => {
        const url = getPdfUrl()
        return GM_download({
            url,
            name: url.match(/[^/]+.pdf$/)[0] || 'file.pdf',
        })
    }

    const addDownloadBtn = () => {
        console.log('add download button')
        const div = document.createElement('div')
        div.style.position = 'fixed'
        div.style.right = '25px'
        div.style.bottom = '25px'
        document.body.appendChild(div)

        const icon = document.createElement('img')
        icon.style.width = '35px'
        icon.style.height = '35px'
        icon.style.cursor = 'pointer'
        icon.style.backgroundColor = '#fff6'
        icon.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGUvPjxnIGRhdGEtbmFtZT0iMSIgaWQ9Il8xIj48cGF0aCBkPSJNMjU1LjEzLDM4NS41NGExNSwxNSwwLDAsMS0xMS4xNC01TDEwMy42NywyMjQuOTNhMTUsMTUsMCwwLDEsMTEuMTQtMjVIMTcxVjYzYTE1LDE1LDAsMCwxLDE1LTE1SDMyNC4zYTE1LDE1LDAsMCwxLDE1LDE1VjE5OS44OWg1Ni4xNmExNSwxNSwwLDAsMSwxMS4xNCwyNUwyNjYuMjcsMzgwLjU4QTE1LDE1LDAsMCwxLDI1NS4xMywzODUuNTRaTTE0OC41MywyMjkuODlsMTA2LjYsMTE4LjI1TDM2MS43NCwyMjkuODlIMzI0LjNhMTUsMTUsMCwwLDEtMTUtMTVWNzhIMjAxVjIxNC44OWExNSwxNSwwLDAsMS0xNSwxNVoiLz48cGF0aCBkPSJNMzkwLjg0LDQ1MEgxMTkuNDNhNjUuMzcsNjUuMzcsMCwwLDEtNjUuMy02NS4yOVYzNDYuNTRhMTUsMTUsMCwwLDEsMzAsMHYzOC4xN0EzNS4zNCwzNS4zNCwwLDAsMCwxMTkuNDMsNDIwSDM5MC44NGEzNS4zMywzNS4zMywwLDAsMCwzNS4yOS0zNS4yOVYzNDYuNTRhMTUsMTUsMCwwLDEsMzAsMHYzOC4xN0E2NS4zNyw2NS4zNywwLDAsMSwzOTAuODQsNDUwWiIvPjwvZz48L3N2Zz4='
        icon.addEventListener('click', () => {downloadPdf()})
        div.appendChild(icon)
    }

    addDownloadBtn()

    GM_registerMenuCommand('下载团标', () => {
        downloadPdf()
    })

    unsafeWindow.GSDHelper = {
        getPdfUrl,
        downloadPdf,
    }
})();