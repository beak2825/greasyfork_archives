// ==UserScript==
// @name        Haraedo - No Flashlight Cookies
// @namespace   Violentmonkey Scripts
// @match       https://haraedo.forumpolish.com/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 04/09/2025, 02:48:32
// @downloadURL https://update.greasyfork.org/scripts/548291/Haraedo%20-%20No%20Flashlight%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/548291/Haraedo%20-%20No%20Flashlight%20Cookies.meta.js
// ==/UserScript==

document.head.append(Object.assign(document.createElement("style"), {
    type: "text/css",
    textContent: `#sd-cmp {
--background-color-dark: var(--b2a)!important;
--text-color-dark: #787878!important;
--font-family: prompt!important;
--title-color-dark: var(--f1)!important;
--border-color-dark: var(--o1)!important;
--main-color-dark: #7b2828!important;
--font-family-title: "Roboto Condensed"!important;
--font-size-base: 12px!important;
}

#sd-cmp > div > div > div > div > div > div > div > div *
{
letter-spacing: 0.5px;
}

#sd-cmp > div > div > div > div > div > div > div > div > div:nth-of-type(1) > span
{
text-transform: uppercase;
letter-spacing: 5px;
}

#sd-cmp > div > div > div > div > div > div > div:nth-child(2) > div > button > span, #sd-cmp > div > div:nth-child(2) > div > div > div > button > span
{
letter-spacing: 1px;
text-transform: uppercase;
}

#sd-cmp > div > div > div > div > div
{
border: var(--o1);
}
.sd-cmp-1bquj, .sd-cmp-1EpGs, .sd-cmp-2jVB1, .sd-cmp-1jLDJ, .sd-cmp-fuQAp, .sd-cmp-3_LLS

{
    color: #787878;
}
.sd-cmp-2QK_B .sd-cmp-1ZnvE .sd-cmp-2w6m6
{
    filter: grayscale(100) contrast(1) brightness(0.5)
}
.sd-cmp-2QK_B .sd-cmp-1ZnvE .sd-cmp-FhVkq.sd-cmp-2PpFN
{
    filter: grayscale(100) contrast(1) brightness(0.7)
}`
}))