// ==UserScript==
// @name         Notion Custom Styling
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Custom styling for Notion (all devices)
// @author       You
// @match        https://www.notion.so/*
// @grant        none
// @license      pipi
// @downloadURL https://update.greasyfork.org/scripts/552800/Notion%20Custom%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/552800/Notion%20Custom%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 所有样式合并应用
    const fullCSS = `
        span.notion-enable-hover{
            display: inline-block !important;
            border-radius: 4px !important;
            padding: 0px 3px !important;
            color: white !important;
        }

        /* 代码块的装饰按钮 */
        .notion-code-block.line-numbers {
            position: relative;
        }

        .notion-code-block.line-numbers:before {
            content: "•••";
            color: transparent;
            background-image: linear-gradient( 145deg,
            #ffa1da, #f5c3ff 33%,
            #d9bcff 33%, #e1caff 66%,
            #e1caff 66%, #a9e1ff);
            background-clip: text;
            -webkit-background-clip: text;
            font-size: 36px;
            line-height: 0.5;
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .notion-code-block.line-numbers > div {
            padding-top: 44px !important;
            padding-bottom: 20px !important;
        }

        .notion-selectable.notion-code-block > div > div:nth-child(1) {
            color: #9a6e3a;
            border: 1px solid #2e2e2e;
        }
        .notion-selectable.notion-code-block > div > div:nth-child(1) > div:nth-child(1) {
            opacity: 1 !important;
        }
        .notion-selectable.notion-code-block > div > div:nth-child(1) > div:nth-child(2) {
            opacity: 1 !important;
        }
        .notion-selectable.notion-code-block > div > div:nth-child(1) > div:nth-child(2) * {
            background: #f7f3f300 !important;
        }
        .line-numbers.notion-code-block > div:nth-child(1) {
            padding: 34px 12px 12px 12px !important;
        }

        div.notion-selectable.notion-code-block {
            background: var(--pipi-white);
            padding: 2px
        }

        /* 匹配背景样式 */
        div[style*="background: var(--ca-graBacPriTra)"] {
            background: white !important
        }

        .pageLinkIndicator path {
            display: none !important
        }

        .notion-light-theme,
        :root {
            /* 紫色系 */
            --ca-purBacTerTra: linear-gradient(145deg, #b682f5, #fea8f0cc);
            --ca-purBacPriTra: linear-gradient(145deg, #b682f5, #fea8f0cc);
            --ca-purBacSecTra: linear-gradient(145deg, #b682f5, #fea8f0cc);
            --c-purTexPri: white;
            --c-purTexSec: #e6b3ff;
            --c-purTexTer: #d580ff;

            /* 粉色系 */
            --ca-pinBacTerTra: linear-gradient(145deg, #ff7ba9, #ffa6beab);
            --ca-pinBacPriTra: linear-gradient(145deg, #ff7ba9, #ffa6beab);
            --ca-pinBacSecTra: linear-gradient(145deg, #ff7ba9, #ffa6beab);
            --c-pinTexPri: white;
            --c-pinTexSec: #ff99cc;
            --c-pinTexTer: #ff66b3;

            /* 蓝色系 */
            --ca-bluBacTerTra: linear-gradient(145deg, #7b9aff, #a6e4ff);
            --ca-bluBacPriTra: linear-gradient(145deg, #7b9aff, #a6e4ff);
            --ca-bluBacSecTra: linear-gradient(145deg, #7b9aff, #a6e4ff);
            --c-bluTexPri: white;
            --c-bluTexSec: #80b3ff;
            --c-bluTexTer: #4d94ff;

            /* 绿色系 - 优化后 */
            --ca-greBacTerTra: linear-gradient(145deg, #b7ff00, #3bffd785);
            --ca-greBacPriTra: linear-gradient(145deg, #b7ff00, #3bffd785);
            --ca-greBacSecTra: linear-gradient(145deg, #b7ff00, #3bffd785);
            --c-greTexPri: #4a724a;
            --c-greTexSec: #88cc88;
            --c-greTexTer: #66bb66;

            /* 棕色系 */
            --ca-broBacTerTra: linear-gradient(145deg, #e6a5ff, #97dbff);
            --ca-broBacPriTra: linear-gradient(145deg, #e6a5ff, #97dbff);
            --ca-broBacSecTra: linear-gradient(145deg, #e6a5ff, #97dbff);
            --c-broTexPri: white;
            --c-broTexSec: #d580ff;
            --c-broTexTer: #c04dff;

            /* 橙色系 */
            --ca-oraBacTerTra: linear-gradient(145deg, #ff9900f0, #ff910075);
            --ca-oraBacPriTra: linear-gradient(145deg, #ff9900f0, #ff910075);
            --ca-oraBacSecTra: linear-gradient(145deg, #ff9900f0, #ff910075);
            --c-oraTexPri: #fff;
            --c-oraTexSec: #ffb84d;
            --c-oraTexTer: #ff9933;

            /* 黄色系 - 优化后 */
            --ca-yelBacTerTra: linear-gradient(145deg, #fff5d0, #ffea00);
            --ca-yelBacPriTra: linear-gradient(145deg, #fff5d0, #ffea00);
            --ca-yelBacSecTra: linear-gradient(145deg, #fff5d0, #ffea00);
            --c-yelTexPri: #6b5e2b;
            --c-yelTexSec: #ffda00;
            --c-yelTexTer: #e6d15a;

            /* 基础色系 */
            --ca-bacTerTra: linear-gradient(145deg, #fff, #dfdfdf);
            --ca-bacPriTra: linear-gradient(145deg, #fff, #dfdfdf);
            --ca-bacSecTra: linear-gradient(145deg, #fff, #dfdfdf);
            --c-texPri: #474747;
            --c-texSec: #8c8c8c;
            --c-texTer: #666666;

            /* 灰色系 */
            --ca-graBacTerTra: linear-gradient(145deg, #b5b1b1, #dfdfdf);
            --ca-graBacPriTra: linear-gradient(145deg, #b5b1b1, #dfdfdf);
            --ca-graBacSecTra: linear-gradient(145deg, #b5b1b1, #dfdfdf);
            --c-graTexPri: #fff;
            --c-graTexSec: #f0f0f0;
            --c-graTexTer: #e0e0e0;

            /* 红色系 */
            --ca-redBacTerTra: linear-gradient(145deg, #ff5252, #ff6d6db0);
            --ca-redBacPriTra: linear-gradient(145deg, #ff5252, #ff6d6db0);
            --ca-redBacSecTra: linear-gradient(145deg, #ff5252, #ff6d6db0);
            --c-redTexPri: white;
            --c-redTexSec: #ff9999;
            --c-redTexTer: #ff6666;
        }

        div[style*="color:var(--c-texPri);background: var(--ca-bacTerTra)"] {
            background: linear-gradient(145deg, #b5b1b1, #dfdfdf) !important;
            color: #fff !important
        }

        /* 原本的移动端样式现在对所有设备生效 */
        div[spellcheck],[role] > div > span {
            font-size: 12px !important
        }
        .notion-selectable div div div div span {
            font-size: 12px !important
        }
        .notion-gallery-view .notion-selectable > div > div,.notion-selectable > div > div > div > div:nth-of-type(2) > div:nth-of-type(1) {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 25px !important
        }
        
        /* 隐藏AI按钮 */
        [data-testid="ai-button"],
        .ai-button,
        .notion-ai-button,
        [href*="ai"],
        button[aria-label*="AI"],
        button[aria-label*="Ai"],
        button[aria-label*="ai"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
    `;

    // 添加样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = fullCSS;
    document.head.appendChild(style);
})();