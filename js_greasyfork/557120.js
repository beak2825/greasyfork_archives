// ==UserScript==
// @name         SpeechChat Username to Profile URL linker
// @namespace    https://github.com/joex92/SpeechChat-Username-Linker
// @version      3.3
// @description  this script links the usernames in chat to their respective profile URLs
// @author       JoeX92
// @match        https://www.speechchat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speechchat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557120/SpeechChat%20Username%20to%20Profile%20URL%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/557120/SpeechChat%20Username%20to%20Profile%20URL%20linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function userHTML( username, platform = null ){
        switch ( platform ) {
            case 'Twitch':
                return `<a href='https://www.twitch.tv/${username}' target="_blank">${username}</a>`;
                break;
            case 'YouTube':
                return `<a href='https://www.youtube.com/${username}' target="_blank">${username}</a>`;
                break;
            default:
                return username;
                break;
        }
    }

    const observer = new MutationObserver( async (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // mutation.addedNodes contains all the new nodes
                try {
                    const twViewers = document.querySelectorAll(".twitch.chatters > *");
                    twViewers.entries().forEach( ( chatter ) => {
                        if ( chatter[1].textContent ) chatter[1].innerHTML = userHTML(chatter[1].textContent,"Twitch");
                    } );
                    const ytViewers = document.querySelectorAll(".youtube.chatters > *");
                    ytViewers.entries().forEach( ( chatter ) => {
                        if ( chatter[1].textContent ) chatter[1].innerHTML = userHTML(chatter[1].textContent,"YouTube");
                    } );
                    mutation.addedNodes.forEach((node) => {
                        const displayname = node.querySelector ? node.querySelector(".chat-line-display-name") : null;
                        const platform = displayname ? node.querySelectorAll(".service-logo") : null;
                        if ( displayname && platform ) {
                            if ( platform.length == 1 ) {
                                const username = displayname.textContent;
                                displayname.innerHTML = userHTML(username, platform[0].getAttribute("tooltip"));
                            }
                        }
                        const notice = node.className ? ( node.className.match(/(chat-line-event-msg)/) ? node.querySelector(".chat-line-notice") : null ) : null;
                        const nplatform = notice ? node.querySelectorAll(".service-logo") : null;
                        if ( notice && nplatform ) {
                            if ( nplatform.length == 1 ) {
                                const noticetxt = Array.from(notice.childNodes).find( n => n.nodeType == 3 );
                                const event = noticetxt.textContent.match(/(joined)|(left)/i);
                                if ( event ){
                                    const username = event.input.split(" ")[0];
                                    const message = event.input.split(username)[1];
                                    noticetxt.remove();
                                    notice.innerHTML += `${userHTML(username, nplatform[0].getAttribute("tooltip"))}${message}`;
                                }
                            }
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }
    });

    const obConfig = { childList: true, subtree: true };
    window.onload = () => {
        observer.observe(document.querySelector('#messages-ul'), obConfig);
        const scstyle = document.createElement("style");
        scstyle.textContent = `
            div.ads.show, div.ads, .ads {
                display: none;
                visibility: hidden;
                opacity: 0;
                margin-bottom: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(scstyle);
    };
})();
