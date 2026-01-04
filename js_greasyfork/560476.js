// ==UserScript==
// @name         Google 搜索结果屏蔽吴语维基百科
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  利用 CSS :has() 选择器在 Google 搜索结果中彻底隐藏 wuu.wikipedia.org 的条目
// @author       YourName
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.google.com.tw/search*
// @match        *://www.google.cn/search*
// @match        *://www.google.de/search*
// @match        *://www.google.fr/search*
// @match        *://www.google.ru/search*
// @match        *://www.google.com.br/search*
// @match        *://www.google.co.in/search*
// @match        *://www.google.ca/search*
// @match        *://www.google.com.au/search*
// @match        *://www.google.ad/search*
// @match        *://www.google.ae/search*
// @match        *://www.google.com.af/search*
// @match        *://www.google.com.ag/search*
// @match        *://www.google.com.ai/search*
// @match        *://www.google.al/search*
// @match        *://www.google.am/search*
// @match        *://www.google.co.ao/search*
// @match        *://www.google.com.ar/search*
// @match        *://www.google.as/search*
// @match        *://www.google.at/search*
// @match        *://www.google.az/search*
// @match        *://www.google.ba/search*
// @match        *://www.google.com.bd/search*
// @match        *://www.google.be/search*
// @match        *://www.google.bf/search*
// @match        *://www.google.bg/search*
// @match        *://www.google.com.bh/search*
// @match        *://www.google.bi/search*
// @match        *://www.google.bj/search*
// @match        *://www.google.com.bn/search*
// @match        *://www.google.com.bo/search*
// @match        *://www.google.bs/search*
// @match        *://www.google.bt/search*
// @match        *://www.google.co.bw/search*
// @match        *://www.google.by/search*
// @match        *://www.google.com.bz/search*
// @match        *://www.google.cd/search*
// @match        *://www.google.cf/search*
// @match        *://www.google.cg/search*
// @match        *://www.google.ch/search*
// @match        *://www.google.ci/search*
// @match        *://www.google.co.ck/search*
// @match        *://www.google.cl/search*
// @match        *://www.google.cm/search*
// @match        *://www.google.com.co/search*
// @match        *://www.google.co.cr/search*
// @match        *://www.google.com.cu/search*
// @match        *://www.google.cv/search*
// @match        *://www.google.com.cy/search*
// @match        *://www.google.cz/search*
// @match        *://www.google.dj/search*
// @match        *://www.google.dk/search*
// @match        *://www.google.dm/search*
// @match        *://www.google.com.do/search*
// @match        *://www.google.dz/search*
// @match        *://www.google.com.ec/search*
// @match        *://www.google.ee/search*
// @match        *://www.google.com.eg/search*
// @match        *://www.google.es/search*
// @match        *://www.google.com.et/search*
// @match        *://www.google.fi/search*
// @match        *://www.google.com.fj/search*
// @match        *://www.google.fm/search*
// @match        *://www.google.ga/search*
// @match        *://www.google.ge/search*
// @match        *://www.google.gg/search*
// @match        *://www.google.com.gh/search*
// @match        *://www.google.com.gi/search*
// @match        *://www.google.gl/search*
// @match        *://www.google.gm/search*
// @match        *://www.google.gp/search*
// @match        *://www.google.gr/search*
// @match        *://www.google.com.gt/search*
// @match        *://www.google.gy/search*
// @match        *://www.google.hn/search*
// @match        *://www.google.hr/search*
// @match        *://www.google.ht/search*
// @match        *://www.google.hu/search*
// @match        *://www.google.co.id/search*
// @match        *://www.google.ie/search*
// @match        *://www.google.co.il/search*
// @match        *://www.google.im/search*
// @match        *://www.google.iq/search*
// @match        *://www.google.is/search*
// @match        *://www.google.it/search*
// @match        *://www.google.je/search*
// @match        *://www.google.com.jm/search*
// @match        *://www.google.jo/search*
// @match        *://www.google.co.ke/search*
// @match        *://www.google.com.kh/search*
// @match        *://www.google.ki/search*
// @match        *://www.google.kg/search*
// @match        *://www.google.co.kr/search*
// @match        *://www.google.com.kw/search*
// @match        *://www.google.kz/search*
// @match        *://www.google.la/search*
// @match        *://www.google.com.lb/search*
// @match        *://www.google.li/search*
// @match        *://www.google.lk/search*
// @match        *://www.google.co.ls/search*
// @match        *://www.google.lt/search*
// @match        *://www.google.lu/search*
// @match        *://www.google.lv/search*
// @match        *://www.google.com.ly/search*
// @match        *://www.google.co.ma/search*
// @match        *://www.google.md/search*
// @match        *://www.google.me/search*
// @match        *://www.google.mg/search*
// @match        *://www.google.mk/search*
// @match        *://www.google.ml/search*
// @match        *://www.google.com.mm/search*
// @match        *://www.google.mn/search*
// @match        *://www.google.ms/search*
// @match        *://www.google.com.mt/search*
// @match        *://www.google.mu/search*
// @match        *://www.google.mv/search*
// @match        *://www.google.mw/search*
// @match        *://www.google.com.mx/search*
// @match        *://www.google.com.my/search*
// @match        *://www.google.co.mz/search*
// @match        *://www.google.com.na/search*
// @match        *://www.google.com.ng/search*
// @match        *://www.google.com.ni/search*
// @match        *://www.google.ne/search*
// @match        *://www.google.nl/search*
// @match        *://www.google.no/search*
// @match        *://www.google.np/search*
// @match        *://www.google.nr/search*
// @match        *://www.google.nu/search*
// @match        *://www.google.co.nz/search*
// @match        *://www.google.com.om/search*
// @match        *://www.google.com.pa/search*
// @match        *://www.google.com.pe/search*
// @match        *://www.google.com.pg/search*
// @match        *://www.google.com.ph/search*
// @match        *://www.google.com.pk/search*
// @match        *://www.google.pl/search*
// @match        *://www.google.pn/search*
// @match        *://www.google.com.pr/search*
// @match        *://www.google.ps/search*
// @match        *://www.google.pt/search*
// @match        *://www.google.com.py/search*
// @match        *://www.google.com.qa/search*
// @match        *://www.google.ro/search*
// @match        *://www.google.rw/search*
// @match        *://www.google.com.sa/search*
// @match        *://www.google.com.sb/search*
// @match        *://www.google.sc/search*
// @match        *://www.google.se/search*
// @match        *://www.google.com.sg/search*
// @match        *://www.google.sh/search*
// @match        *://www.google.si/search*
// @match        *://www.google.sk/search*
// @match        *://www.google.com.sl/search*
// @match        *://www.google.sn/search*
// @match        *://www.google.so/search*
// @match        *://www.google.sm/search*
// @match        *://www.google.sr/search*
// @match        *://www.google.st/search*
// @match        *://www.google.com.sv/search*
// @match        *://www.google.com.sy/search*
// @match        *://www.google.co.sz/search*
// @match        *://www.google.co.th/search*
// @match        *://www.google.com.tj/search*
// @match        *://www.google.tk/search*
// @match        *://www.google.tl/search*
// @match        *://www.google.tm/search*
// @match        *://www.google.tn/search*
// @match        *://www.google.to/search*
// @match        *://www.google.com.tr/search*
// @match        *://www.google.tt/search*
// @match        *://www.google.co.tz/search*
// @match        *://www.google.com.ua/search*
// @match        *://www.google.co.ug/search*
// @match        *://www.google.com.uy/search*
// @match        *://www.google.co.uz/search*
// @match        *://www.google.com.vc/search*
// @match        *://www.google.co.ve/search*
// @match        *://www.google.vg/search*
// @match        *://www.google.co.vi/search*
// @match        *://www.google.com.vn/search*
// @match        *://www.google.vu/search*
// @match        *://www.google.ws/search*
// @match        *://www.google.rs/search*
// @match        *://www.google.co.za/search*
// @match        *://www.google.co.zm/search*
// @match        *://www.google.co.zw/search*
// @match        *://www.google.cat/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560476/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/560476/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');

    /**
     * 原理说明：
     * 1. .tF2Cxc 是你提供的 HTML 中包裹单条结果的核心 class。
     * 2. .g 是 Google 传统的单条结果 class。
     * 3. .eA0Zlc 是图片/视频小卡片的 class。
     * 4. .isv-r 是图片搜索模式下的单张图片 class。
     *
     * 使用 :has(a[href*="wuu.wikipedia.org"]) 确保只有当这个小卡片里
     * 确实包含吴语维基链接时，才隐藏这一个小卡片。
     */

    style.innerHTML = `
        /* 标准文本搜索结果 - 针对你提供的 HTML 结构优化 */
        div.tF2Cxc:has(a[href*="wuu.wikipedia.org"]),

        /* 传统的通用结果容器 */
        div.g:has(a[href*="wuu.wikipedia.org"]),

        /* 视频/图片轮播中的单个小卡片 */
        div.eA0Zlc:has(a[href*="wuu.wikipedia.org"]),

        /* 图片搜索结果中的单张图片 */
        div.isv-r:has(a[href*="wuu.wikipedia.org"]),

        /* 带有 data-rpos 属性的独立结果容器 (作为兜底) */
        div[data-rpos]:has(a[href*="wuu.wikipedia.org"]) > div:has(a[href*="wuu.wikipedia.org"])
        {
            display: none !important;
        }
    `;

    document.head.appendChild(style);
})();