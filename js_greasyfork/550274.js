// ==UserScript==
// @name         CURSORE Rutracker/Pornolab Poster Preview 2025 (Near Headline)
// @namespace    custom-preview
// @include      https://rutracker.org/forum/*
// @include      https://pornolab.net/forum/*
// @version      1.7
// @grant        none
// @description  puk srenk loot at pictures in search ta dam!
// @license MIT  what loicens - i made this in chatgpt/grok
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550274/CURSORE%20RutrackerPornolab%20Poster%20Preview%202025%20%28Near%20Headline%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550274/CURSORE%20RutrackerPornolab%20Poster%20Preview%202025%20%28Near%20Headline%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const previewCache = new Map();

    const previewDiv = $(`
        <div id="customPreview" style="
            position:absolute;
            background:white;
            border:1px solid #444;
            padding:5px;
            max-width:300px;
            max-height:400px;
            overflow-y:auto;
            overflow-x:hidden;
            z-index:1000;
            display:none;
            box-shadow:0 0 10px rgba(0,0,0,0.5);
            border-radius:6px;
            box-sizing:border-box;
        "></div>
    `).appendTo('body');

    function showPreviewAtPosition(e, previewHeight, linkHeight) {
        const spaceBelow = window.innerHeight - (e.clientY + linkHeight + 10);
        const spaceAbove = e.clientY - 10;

        let top;
        if (spaceBelow < previewHeight && spaceAbove > previewHeight) {
            // сверху курсора
            top = e.pageY - previewHeight - 10;
        } else {
            // снизу курсора
            top = e.pageY + linkHeight + 5;
        }

        previewDiv.css({
            top: top,
            left: e.pageX + 10,
        });
    }

    function attachPreviewHandlers() {
        const titleLinks = $('a.tLink, a.tt-text, td a[href*="viewtopic"]').not('[data-preview-attached]');
        titleLinks.each(function() {
            $(this).attr('data-preview-attached', 'true').css('cursor', 'pointer').hover(
                function(e) {
                    const href = $(this).attr('href');
                    if (!href) return;

                    previewDiv.show().html('<span style="color:#666;">Loading...</span>');
                    showPreviewAtPosition(e, previewDiv.outerHeight(), $(this).outerHeight());

                    if (previewCache.has(href)) {
                        const cached = previewCache.get(href);
                        previewDiv.html(cached.html);
                        showPreviewAtPosition(e, cached.height, $(this).outerHeight());
                        return;
                    }

                    $.get(href).done(function(data) {
                        let imgMatch = $(data).find('var.postImg, img.postImg').first().attr('src') ||
                                       $(data).find('var.postImg').first().attr('title');

                        if (imgMatch) {
                            const imgUrl = imgMatch.startsWith('http') ? imgMatch : 'https://' + window.location.hostname + imgMatch;
                            const tempImg = new Image();
                            tempImg.onload = () => {
                                const imgHtml = `<img src="${imgUrl}" style="max-width:100%;max-height:380px;display:block;margin:0 auto;">`;
                                previewCache.set(href, { html: imgHtml, height: Math.min(tempImg.height, 380) + 20 }); // 20 на padding
                                previewDiv.html(imgHtml);
                                showPreviewAtPosition(e, Math.min(tempImg.height, 380) + 20, $(this).outerHeight());
                            };
                            tempImg.onerror = () => {
                                const html = '<span style="color:#a00;">Image load error</span>';
                                previewCache.set(href, { html, height: 50 });
                                previewDiv.html(html);
                                showPreviewAtPosition(e, 50, $(this).outerHeight());
                            };
                            tempImg.src = imgUrl;
                        } else {
                            const html = '<span style="color:#a00;">No image found</span>';
                            previewCache.set(href, { html, height: 50 });
                            previewDiv.html(html);
                            showPreviewAtPosition(e, 50, $(this).outerHeight());
                        }
                    }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
                        const html = `<span style="color:#a00;">Error: ${textStatus} - ${errorThrown}</span>`;
                        previewCache.set(href, { html, height: 50 });
                        previewDiv.html(html);
                        showPreviewAtPosition(e, 50, $(this).outerHeight());
                    }.bind(this));
                },
                function() {
                    previewDiv.hide().empty();
                }
            ).mousemove(function(e) {
                const cached = previewCache.get($(this).attr('href'));
                const previewHeight = cached ? cached.height : previewDiv.outerHeight();
                showPreviewAtPosition(e, previewHeight, $(this).outerHeight());
            });
        });
    }

    attachPreviewHandlers();

    const observer = new MutationObserver(function() {
        attachPreviewHandlers();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})(jQuery.noConflict(true));