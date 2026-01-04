// ==UserScript==
// @name         PSNINE奖杯列表优化
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  统一奖杯图标尺寸 + PSPC标签美化
// @author       KuusouMenreiki(KuangRe)
// @match        https://psnine.com/psnid/*
// @match        https://www.psnine.com/psnid/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554368/PSNINE%E5%A5%96%E6%9D%AF%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554368/PSNINE%E5%A5%96%E6%9D%AF%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 完整CSS样式注入（包含.pf_pspc美化）
    const fullCss = `
.pd15 a {
    width: 91px !important;
    height: 91px !important;
    display: inline-block !important;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
    background: #000 !important;
}
.pd15 a img {
    width: 100% !important;
    height: auto !important;
    max-height: 100% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: contain;
}
.list tbody tr {
    display: table-row !important;
    min-height: 151px !important;
}
.list tbody tr td {
    vertical-align: middle !important;
    box-sizing: border-box;
}
.pf_pspc {
    background-color: #000 !important;
    color: #fff !important;
    padding: 2px 4px !important;
    border-radius: 3px !important;
    margin: 0 1px !important;
    display: inline-block !important;
    font-size: 11px !important;
}
    `;
    GM_addStyle(fullCss);

    // 功能逻辑（奖杯图标+PSPC标签兼容）
    document.addEventListener('DOMContentLoaded', function() {
        // 优化奖杯图标
        const iconContainers = document.querySelectorAll('.pd15 a');
        iconContainers.forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                img.style.objectFit = 'contain';
                img.style.position = 'absolute';
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%, -50%)';
            }
        });

        // 额外处理PSPC标签（如需动态修正可扩展）
        const pspcTags = document.querySelectorAll('.pf_pspc');
        pspcTags.forEach(tag => {
            // 强制覆盖行内样式（如果有）
            tag.style.backgroundColor = '#000 !important';
            tag.style.color = '#fff !important';
        });
    });
})();