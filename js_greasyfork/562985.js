// ==UserScript==
// @name         AO3 Change Tag Separator ✨ (CSS-based)
// @namespace    https://aglioeollieo.neocities.org/misc#script
// @version      1.0
// @description  Replace AO3 tag separators with ✨ using CSS
// @match        https://archiveofourown.org/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562985/AO3%20Change%20Tag%20Separator%20%E2%9C%A8%20%28CSS-based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562985/AO3%20Change%20Tag%20Separator%20%E2%9C%A8%20%28CSS-based%29.meta.js
// ==/UserScript==

GM_addStyle(`
/* Standard tag lists */
.taglist li:not(:last-child)::after {
    content: " ✨";
}

/* Search results & bookmarks */
.tags li:not(:last-child)::after {
    content: " ✨";
}

/* Mobile layout */
.blurb .taglist li:not(:last-child)::after {
    content: " ✨";
}

/* Remove default commas just in case */
.taglist li::after,
.tags li::after {
    margin-right: 0;
}

/* Cancel in filters */
.filters .taglist li::after,
.filters .tags li::after {
    content: "" !important;
}
`);
