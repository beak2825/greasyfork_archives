// ==UserScript==
// @name         YouTube List Stripper
// @name:ja      YouTube List Stripper
// @namespace    https://greasyfork.org/ja/users/1492018-sino087
// @version      1.1.1
// @description  Open YouTube videos from a playlist in a new tab without the playlist attributes
// @description:ja プレイリストから動画を開くときに、プレイリストの属性を削除して新しいタブで開きます
// @author       sino
// @license      MIT
// @icon         https://www.youtube.com/s/desktop/db7db827/img/favicon.ico
// @match        *://www.youtube.com/*
// @noframes
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558042/YouTube%20List%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/558042/YouTube%20List%20Stripper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCleanUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.pathname === '/watch' && urlObj.searchParams.has('list')) {
                urlObj.searchParams.delete('list');
                urlObj.searchParams.delete('index');
                return urlObj.toString();
            }
        } catch (e) {
            console.error('YouTube List Stripper: Invalid URL', e);
        }
        return null;
    }

    function handleClick(event) {
        const pathname = window.location.pathname;
        const search = window.location.search;
        const isPlaylist = pathname === '/playlist' && search.includes('list=');
        const isWatchList = pathname === '/watch' && search.includes('list=');

        if (!isPlaylist && !isWatchList) return;

        let link = event.target.closest('a');
        if (!link || !link.href) {
            const contentDiv = event.target.closest('ytd-playlist-video-renderer > div#content');
            if (contentDiv) {
                link = contentDiv.querySelector('a#video-title');
            }
            if (!link || !link.href) return;
        }
        if (link.classList.contains('yt-spec-button-shape-next')) {
            return;
        }

        if (event.button !== 0 || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
            return;
        }

        const cleanUrl = getCleanUrl(link.href);
        if (cleanUrl) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (isWatchList) {
                const video = document.querySelector('video');
                if (video) {
                    video.pause();
                }
            }

            window.open(cleanUrl, '_blank');
        }
    }

    document.addEventListener('click', handleClick, true);

})();
