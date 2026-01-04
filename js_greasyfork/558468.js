// ==UserScript==
// @name         Custom discord
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Enlarge discord emojis and loop videos
// @author       Doni
// @match        https://discord.com/*
// @icon         https://i.imgur.com/rE9N0R7.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558468/Custom%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/558468/Custom%20discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    registerCss("emojiEnlarger", `
        div:not([class^="repliedTextPreview"]) > div[id^="message-content"] img.emoji:not(.jumboable) {
            width: 2.5em;
            height: 2.5em;
        }
        div[id^="message-content"] img.emoji.jumboable {
            width: 6em;
            height: 6em;
        }
    `);

     registerCss("smallMode", `
        @media screen and (max-width: 720px) {
            div[class^="base-"] > div[class^="content-"] {
                position: relative;
                width: 100vmax;
                left: -241px;
            }
            div[class^="container-"] > nav[class^="wrapper-"] {
                visibility: hidden;
                display: none;
            }
            div[class^="content-"] > div[class^="sidebar-"] {
                visibility: hidden;
            }
            main[class^="chatContent-"] div[class^="buttons-"] > div:nth-child(1),
            main[class^="chatContent-"] div[class^="buttons-"] > div:nth-child(2),
            main[class^="chatContent-"] div[class^="buttons-"] > div:nth-child(3) {
                visibility: hidden;
            }
        }
    `);

    observeVideos(node => {
        if(node.tagName == "VIDEO") {
            node.loop = true;
        }
    });

    function registerCss(id, rules) {

        if(!id) return;

        let style = document.getElementById(id);

        if(!style) {
            style = document.createElement('style');
            style.id = id;
        }

        style.type = 'text/css';
        style.innerHTML = rules;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function observeVideos(_callback) {
        const bodyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(addedNode => {
                    _callback(addedNode);
                    addedNode.querySelectorAll && addedNode.querySelectorAll("video").forEach(_callback);
                });
            });
        });

        bodyObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });
    }
})();