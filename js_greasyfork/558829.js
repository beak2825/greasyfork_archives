// ==UserScript==
// @name         Niconico NICOScript Jump Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ニコニコ動画のニコスクリプトの@ジャンプのうち他の動画へジャンプさせるものを削除します
// @author       lltcggie
// @license      MIT 
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558829/Niconico%20NICOScript%20Jump%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558829/Niconico%20NICOScript%20Jump%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        let [resource, config] = args;

        let urlString = '';
        if (resource instanceof Request) {
            urlString = resource.url;
        } else {
            urlString = String(resource);
        }

        const response = await originalFetch(resource, config);
        if (urlString && urlString.includes('public.nvcomment.nicovideo.jp/v1/threads')) {
            try {
                const clone = response.clone();
                const json = await clone.json();

                if (json && json.data && Array.isArray(json.data.threads)) {
                    json.data.threads.forEach(thread => {
                        if (thread.fork === 'owner' && Array.isArray(thread.comments)) {
                            thread.comments = thread.comments.filter(comment => {
                                return comment.body && !comment.body.startsWith('＠ジャンプ sm');
                            });
                            thread.commentCount = thread.comments.length;
                        }
                    });

                    return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (error) {
                console.error('Niconico NICOScript Jump Filter: ', error);
                return response;
            }
        }

        return response;
    };
})();