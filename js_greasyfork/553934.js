// ==UserScript==
// @name                Copy URL as Markdown Link
// @name:zh-CN          复制 Markdown 格式超链接
// @version             1.0.1
// @description         Right-click on a blank area of the page to copy the current page's title and URL as a Markdown formatted link to the clipboard.
// @description:zh-CN   在页面中空白位置右键，将当前页面的标题和 URL 以 Markdown 格式复制到剪贴板。
// @namespace           https://github.com/yxzlwz/browser_scripts
// @author              yxzlwz
// @match               *://*/*
// @grant               GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/553934/Copy%20URL%20as%20Markdown%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/553934/Copy%20URL%20as%20Markdown%20Link.meta.js
// ==/UserScript==

GM_registerMenuCommand("Generally", function () {
    copyMarkdownLink(false);
});

GM_registerMenuCommand("Without Query", function () {
    copyMarkdownLink(true);
});

GM_registerMenuCommand("Title Only", function () {
    navigator.clipboard.writeText(document.title);
});

function copyMarkdownLink(ignoreQuery) {
    let url = window.location.href;
    const title = document.title;

    if (ignoreQuery) {
        url = url.split("?")[0];
    }

    const markdownLink = `[${title}](${url})`;

    navigator.clipboard
        .writeText(markdownLink)
        .then(() => {
            console.log("URL copied as markdown link!");
        })
        .catch(error => {
            console.error("Error copying URL as markdown link:", error);
        });
}
