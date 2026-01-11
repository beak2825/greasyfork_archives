// ==UserScript==
// @name                Mobilism Download Links Clean Bloat
// @namespace           https://greasyfork.org/users/821661
// @match               https://uploadrar.com/*
// @match               https://www.uploadrar.com/*
// @match               https://modsfire.com/*
// @match               https://mega4upload.net/*
// @match               *://upfion.com/*
// @match               *://upfiles.com/*
// @match               *://uploady.io/*
// @match               https://www.up-4ever.net/*
// @include             *://frdl.*/*
// @include             *://fredl.*/*
// @include             *://katfile.*/*
// @include             *://dailyuploads.*/*
// @match               https://devuploads.com/*
// @match               https://djxmaza.in/*
// @match               https://smartfeecalculator.com/*
// @match               https://pdfhindibook.com/*
// @match               https://gujjukhabar.in/*
// @match               https://rfiql.com/*
// @match               https://cloudfam.io/*
// @match               https://dropgalaxy.*/*
// @match               https://financemonk.*/*
// @grant               GM.addStyle
// @run-at              document-start
// @version             3.0.8
// @description         Removes unnecessary bloat from multiple file hosting and download sites to make download links more accessible
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/556623/Mobilism%20Download%20Links%20Clean%20Bloat.user.js
// @updateURL https://update.greasyfork.org/scripts/556623/Mobilism%20Download%20Links%20Clean%20Bloat.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const domain = window.location.hostname;
 
    function addCSS(css) {
        document.documentElement.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    }
 
    /* ---------------------------------------------------------
     * CLEANER RULES PER HOST
     * --------------------------------------------------------- */
 
    // UploadRAR
    if (domain === "uploadrar.com" || domain === "www.uploadrar.com") {
        addCSS(`
            .premiumTable,
            .footer,
            .fs-5,
            .mb-4>p,
            .shadow-sm,
            .p-0,
            .my-5,
            .p-0,
            .mb-4>ul,
            .border-warning,
            form[method="POST"]>center,
            .header-row {
                display: none !important;
            }
            body {
                padding-top: 0 !important;
                margin-top: 0 !important;
            }
        `);
    }
 
    // ModsFire
    else if (domain === "modsfire.com") {
        addCSS(`
            .navbar,
            .footer,
            .inf-down,
            .report-btn,
            .section-title > h1,
            .disc-tabbing-main {
                display: none !important;
            }
        `);
    }
 
    // FRDL / FREDL
    else if (domain.startsWith("frdl.") || domain.startsWith("fredl.")) {
        addCSS(`
            .header,
            .seperate,
            .footer,
            .col-lg-12,
            #fdmMsg,
            .btn-warning {
                display: none !important;
            }
        `);
    }
 
    // KatFile
    else if (domain.startsWith("katfile.")) {
        addCSS(`
            .navbar,
            ul[style="margin: 10px 10px 0 10px;"] > li,
            body > footer,
            img[src="/images/n.png"],
            .sp,
            .free-class > span,
            .style3,
            div[id="container"] > h2,
            .recommended,
            .page-buffer,
            #container > [src],
            .free-class > b,
            .premium-class {
                display: none !important;
            }
        `);
    }
 
    // Mega4Upload
    else if (domain === "mega4upload.net") {
        addCSS(`
            .section-title,
            .p-3 > center,
            .d-md-none,
            .card,
            .footer-copyright,
            #app-header,
            .list-group,
            .compare_table,
            .app-footer {
                display: none !important;
            }
        `);
    }
 
    // Upfion / Upfiles
    else if (domain === "upfion.com" || domain === "upfiles.com") {
        addCSS(`
            .file-title,
            body > header,
            body > footer,
            div[style="padding: 0 40px; margin-top: 50px"],
            .features,
            .premium,
            .container>hr,
            .speed,
            .faqs {
                display: none !important;
            }
        `);
    }
 
    // DailyUploads
    else if (domain.includes("dailyuploads")) {
        addCSS(`
            footer[style="font-size:13px; position:fixed; bottom:0; margin-top:5000px; height:10px; width:100%; padding-top:2px;"],
            .sharetabs,
            #header,
            .downleft,
            a[href^="https://dailyuploads.net/"],
            #open,
            h2[style="color:#da2017;"] {
                display: none !important;
            }
        `);
    }
 
    // CloudFam
    else if (domain === "cloudfam.io" || domain === "www.cloudfam.io") {
        addCSS(`
            .border-b,
            .premium,
            .text-center,
            .cf-footer,
            .cf-header,
            .cf-main>center,
            .text-xs {
                display: none !important;
            }
        `);
    }
 
    // DropGalaxy & FinanceMonk
    else if (domain.startsWith("dropgalaxy.") || domain.startsWith("financemonk.")) {
        addCSS(`
            .pt-4,
            #a-ads5,
            .float-right,
            .float-left,
            .icon,
            .btn-danger,
            .text-primary,
            .premium-feed-card,
            #a-ads6,
            .mys-wrapper,
            #tokennstatus,
            #sharetabs,
            .footer,
            iframe[width="280"],
            .py-3,
            .navbar {
                display: none !important;
            }
        `);
    }

    // Uploady
    else if (domain === "uploady.io" || domain === "www.uploady.io") {
        addCSS(`
            .header-row,
            .premium,
            .danger,
            .negative,
            #free-header,
            .upgrade-cta,
            #premiumplans,
            .footer,
            .dl-wait-upsell,
            .captcha-upsell,
            .col-md-4,
            .mt-3,
            .col-md-8,
            .row,
            .mt-2 {
                display: none !important;
            }
        `);
    }
 
    // Up-4ever
    else if (domain === "www.up-4ever.net") {
        addCSS(`
            #app-header,
            #app-footer,
            .text-xl,
            .د-flex,
            .space-y-2,
            .mt-5,
            .custom-accordion,
            .tp-faq-left-wrapper,
            .breadcrumb__area,
            .file-card,
            svg[fill="var(--bs-secondary)"],
            svg[fill="var(--bs-dark)"],
            .col-xl-8,
            .tp-price-table {
                display: none !important;
            }
        `);
    }
 
    /* ---------------------------------------------------------
     * DEVUPLOADS SPECIAL CLEANER
     * --------------------------------------------------------- */
 
    function devuploadsCSS() {
        addCSS(`
            body:not(:has(#container)) {
                background-color: #131316 !important;
            }
            body {
                overflow: hidden !important;
            }
            #folders_paging {
                display: none !important;
            }
            #container {
                max-width: unset !important;
                position: fixed !important;
                inset: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                background-color: #131316 !important;
                margin: 0 !important;
                z-index: 214748364 !important;
            }
        `);
    }
 
    function reDevuploadsCSS() {
        addCSS(`
            #dlp,
            [style*="block"]:is(#dlndiv, #adBlocked, #Blocked) {
                position: fixed !important;
                height: 100vh !important;
                width: 100vw !important;
                inset: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: #131316 !important;
                z-index: 99999 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
            }
        `);
    }
 
    if (domain === "devuploads.com") {
        devuploadsCSS();
    } else if (
        domain === "djxmaza.in" ||
        domain === "smartfeecalculator.com" ||
        domain === "gujjukhabar.in" ||
        domain === "pdfhindibook.com" ||
        domain === "rfiql.com"
    ) {
        reDevuploadsCSS();
    }
 
})();