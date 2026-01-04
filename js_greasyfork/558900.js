// ==UserScript==
// @name        WaniKani level progress next review time
// @description Adds next review time display in level progress widget
// @namespace   yakujin
// @include     https://www.wanikani.com/*
// @version     1.0
// @author      yakujin
// @license     public domain
// @run-at      document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558900/WaniKani%20level%20progress%20next%20review%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/558900/WaniKani%20level%20progress%20next%20review%20time.meta.js
// ==/UserScript==
"use strict";
(() => {
    const popupId = 'next-review-popup';

    let currentElement = null;

    const getPopup = () => {
        let popup = unsafeWindow.document.getElementById(popupId);
        if (!popup) {
            popup = unsafeWindow.document.createElement('div');
            popup.id = popupId;
            popup.style.position = 'fixed';
            popup.style.zIndex = '10001';
            popup.style.background = '#DDD';
            popup.style.color = '#000';
            popup.style.border = '1px solid #111';
            popup.style.margin = '-2px 0 0 0';
            popup.style.borderRadius = '3px';
            popup.style.padding = '3px';
            popup.style.transform = 'translate(-50%,-100%)';
            popup.style.textAlign = 'center';
            unsafeWindow.document.body.appendChild(popup);
        }
        return popup;
    };
    const updatePopup = () => {
        const popup = getPopup();
        popup.innerText = currentElement.dataset.title;
    };

    const openPopup = (element) => {
        currentElement = element;
        const popup = getPopup();
        const reviewItemRect = element.getBoundingClientRect();
        popup.style.display = 'block';
        popup.style.top = `${reviewItemRect.y}px`;
        popup.style.left = `${reviewItemRect.x + reviewItemRect.width / 2}px`;
        updatePopup();
    };

    const closePopup = () => {
        currentElement = null;
        getPopup().style.display = 'none';
    };

    const formatTitle = (reviewTime, nowTime) => {
        let diff = reviewTime - nowTime;
        const result = ['Next review:'];
        if (diff <= 0) {
            result.push('Now');
        } else {
            diff /= 1000;
            diff /= 60;
            const minutes = Math.trunc(diff % 60);
            diff /= 60;
            const hours = Math.trunc(diff % 24);
            diff /= 24;
            const days = Math.trunc(diff);
            const eta = ['In'];
            if (days == 1) {
                eta.push('1 day');
            } else if (days > 1) {
                eta.push(`${days} days`);
            }
            if (hours == 1) {
                eta.push('1 hour');
            } else if (hours > 1 || (hours == 0 && days != 0)) {
                eta.push(`${hours} hours`);
            }
            if (minutes == 1) {
                eta.push('1 minute');
            } else if (minutes > 1) {
                eta.push(`${minutes} minutes`);
            }
            result.push(eta.join(' '));
        }
        return result.join('\n');
    };

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(target) {
        const origPromise = origFetch.apply(this, arguments);
        const url = String(target);
        const match = /wanikani.com\/(kanji|vocabulary|radicals)\/([^\/]+)/.exec(url);
        if (match) {
            const allProgressItems = unsafeWindow.document.getElementsByClassName("subject-srs-progress");
            const progressItems = Array.prototype.filter.call(allProgressItems, (item) => item.href === url);
            if (progressItems) {
                for (let item of progressItems) {
                    const innerSpan = item.firstElementChild;
                    if (!innerSpan ||
                        innerSpan.classList.contains('subject-character--recent') ||
                        innerSpan.classList.contains('subject-character--locked')) {
                        continue;
                    }
                    if (item.dataset.title === undefined) {
                        item.dataset.title = 'Loading...';
                        item.addEventListener('mouseenter', (evt) => openPopup(evt.target));
                        item.addEventListener('mouseleave', closePopup);
                        item.addEventListener('click', closePopup);
                    }
                    if (item.matches(':hover')) {
                        openPopup(item);
                    }
                }
                return new Promise((resolve, reject) => {
                    origPromise.then((fetchResult) => {
                        fetchResult.text().then((body)=> {
                            const matchedTime = /<time datetime="([^"]+Z)" class="subject-progress__meta-value" data-controller="date" data-date-format-value="next-review">/.exec(body);
                            if (matchedTime) {
                                const reviewTime = Date.parse(matchedTime[1]);
                                const nowTime = Date.now();
                                const title = formatTitle(reviewTime, nowTime);
                                const popup = getPopup();
                                for (let item of progressItems) {
                                    item.dataset.title = title;
                                    if (item === currentElement) {
                                        updatePopup();
                                    }
                                }
                            }
                            const newResponse = new Response(body, {
                                status: fetchResult.status,
                                statusText: fetchResult.statusText,
                                headers: Object.fromEntries(fetchResult.headers.entries())
                            });
                            resolve(newResponse);
                        }, reject);
                    }, reject);
                });
            }
        }

        return origPromise;
    };
    unsafeWindow.addEventListener('popstate', closePopup);
})();
