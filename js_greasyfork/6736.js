// ==UserScript==
// @name           imgur output formatter
// @namespace      surrealmoviez.info
// @description    Adds fully formatted output containers
// @include        http://imgur.com/*
// @include        http://www.imgur.com/*
// @include        https://imgur.com/*
// @include        https://www.imgur.com/*
// @version        1.0.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/6736/imgur%20output%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/6736/imgur%20output%20formatter.meta.js
// ==/UserScript==

function extractUrls() {
    var imgUrls = [];
    $('head > meta[property="og:image"]').each(function (i, v) {
        link = $(v).attr('content');
        if (!link.endsWith('?fb')) {
            imgUrls.push(link);
        }
    });
    return imgUrls;
}

$(document).ready(function () {
    var imgUrls = extractUrls();
    var decoratedLinks = '<center><img src="' + imgUrls.join('">\n\n<img src="') + '"></center>';
    var plainLinks = imgUrls.join("\n");

    var preformattedLinksPanel = '<div class="new-panel post-options-panel">'
            + '<h2 class="new-panel-header">Preformatted Links</h2>'
            + '<div class="post-options">'
            + '<textarea id="preformatted-links-decorated" style="height: 100px; width: 100%;" onclick="this.select();" title="Click to select">' + decoratedLinks + '</textarea>'
            + '<textarea id="preformatted-links-plain" style="height: 100px; width: 100%;" onclick="this.select();" title="Click to select">' + plainLinks + '</textarea>'
            + '</div></div>';

    $('#right-content').prepend(preformattedLinksPanel);
});
