// ==UserScript==
// @name         LZT минимализм
// @description  удаляет комменты и всю хуйню уменьшает
// @namespace    awaw https://lolz.live/andrey
// @version      1.1
// @match        https://lolz.live/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556206/LZT%20%D0%BC%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%D0%B7%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/556206/LZT%20%D0%BC%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%D0%B7%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .discussionListItem .threadHeaderBottom {
            border-bottom: none !important;
        }
    `);

    GM_addStyle(`
        .discussionListItem .threadFooter {
            display: none !important;
        }
    `);

    GM_addStyle(`
        .discussionListItem .threadLastPost {
            display: none !important;
        }
    `);

    GM_addStyle(`
        .LZT-mini-counter span {
            font-size: 12px !important;
        }
        .LZT-mini-counter {
            padding: 3px 6px !important;
            gap: 4px !important;
        }
    `);

    GM_addStyle(`
        .discussionListItem .controls_prefixes,
        .discussionListItem .controls_prefixes .controls {
            display: none !important;
        }
    `);

    function processThreadItem(threadItem) {
        if (threadItem.hasAttribute('data-minimalized')) return;
        threadItem.setAttribute('data-minimalized', 'true');

        const threadHeaderBottom = threadItem.querySelector('.threadHeaderBottom');
        const threadCounters = threadItem.querySelector('.threadCounters');

        if (!threadHeaderBottom || !threadCounters) return;

        const likeCounter = threadCounters.querySelector('.LikeLink');
        const replyCounter = threadCounters.querySelector('.MainPageReply');

        if (likeCounter && replyCounter) {
            const countersContainer = document.createElement('div');
            countersContainer.style.display = 'flex';
            countersContainer.style.alignItems = 'center';
            countersContainer.style.gap = '8px';
            countersContainer.style.marginLeft = '8px';

            const makeBox = (clone) => {
                const box = document.createElement('div');
                box.className = 'LZT-mini-counter';

                box.style.display = 'flex';
                box.style.alignItems = 'center';
                box.style.backgroundColor = '#2a2a2a';
                box.style.borderRadius = '8px';
                box.style.padding = '4px 8px';
                box.style.gap = '4px';

                clone.style.display = 'flex';
                clone.style.flexDirection = 'row';
                clone.style.alignItems = 'center';
                clone.style.gap = '4px';
                clone.querySelectorAll('span').forEach(span => {
                    span.style.lineHeight = '1';
                    span.style.fontSize = '12px';
                    span.style.display = 'inline-block';
                    span.style.margin = '0';
                    span.style.padding = '0';
                });

                box.appendChild(clone);
                return box;
            };

            const likeClone = likeCounter.cloneNode(true);
            const replyClone = replyCounter.cloneNode(true);

            const likeBox = makeBox(likeClone);
            const replyBox = makeBox(replyClone);

            countersContainer.appendChild(likeBox);
            countersContainer.appendChild(replyBox);

            const dateElement = threadHeaderBottom.querySelector('.muted');
            if (dateElement)
                dateElement.parentNode.insertBefore(countersContainer, dateElement.nextSibling);
            else
                threadHeaderBottom.appendChild(countersContainer);

            likeCounter.remove();
            replyCounter.remove();
        }

        const controlsBlock = threadItem.querySelector('.controls_prefixes');
        if (controlsBlock) controlsBlock.remove();
    }

    function processAll() {
        document.querySelectorAll('.discussionListItem:not([data-minimalized])')
            .forEach(processThreadItem);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    const observer = new MutationObserver(m => {
        m.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches?.('.discussionListItem')) {
                    processThreadItem(node);
                } else if (node.querySelector?.('.discussionListItem')) {
                    node.querySelectorAll('.discussionListItem:not([data-minimalized])')
                        .forEach(processThreadItem);
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

})();