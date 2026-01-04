// ==UserScript==
// @name         Adds wcat
// @namespace    devon
// @version      1.2
// @description  Allows users in DGG Chat to see the wcat emote. Credit to yuniDev for writing the original version for cabge which i stole and replaced with wcat
// @author       devon
// @match        https://www.destiny.gg/embed/chat*
// @match        https://www.destiny.gg/chat*
// @match        https://www.destiny.gg/bigscreen*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555487/Adds%20wcat.user.js
// @updateURL https://update.greasyfork.org/scripts/555487/Adds%20wcat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Base emote style
    GM_addStyle(`
        .emote.wcat {
            width: 32px;
            height: 32px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHAmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjExIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMTEtMDhUMjI6Mjc6NTktMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI1LTExLTEyVDIxOjQxOjQxLTA2OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI1LTExLTEyVDIxOjQxOjQxLTA2OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjNDg2MTJiZi1iZTJjLWRjNDctOTU5ZS0wNGI4YTE0NjI1NjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiODJhZmVmNC0xNGI2LWQ3NGUtYTEyMi0zMjNiY2FjYTI1YWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyYTM0YzJjMi04YjU5LWNjNDAtOWQ4Ny01ZTE5YWMyMzI0MjUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJhMzRjMmMyLThiNTktY2M0MC05ZDg3LTVlMTlhYzIzMjQyNSIgc3RFdnQ6d2hlbj0iMjAyNS0xMS0wOFQyMjoyNzo1OS0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjExIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNmEyNzU0Yi1kZmNlLWMzNDMtOGI5OC1mMDU5MDRmOGJkZDkiIHN0RXZ0OndoZW49IjIwMjUtMTEtMDhUMjI6MzI6NTYtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNi4xMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM0ODYxMmJmLWJlMmMtZGM0Ny05NTllLTA0YjhhMTQ2MjU2OCIgc3RFdnQ6d2hlbj0iMjAyNS0xMS0xMlQyMTo0MTo0MS0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjExIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6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);
        }
    `);

    // Default positioning tweak
    GM_addStyle(`
        .msg-chat .emote.wcat {
            margin-top: -32px;
            top: 7.5px;
        }
    `);

    // --- Custom shifts by timestamp suffix ---
    const timestampEmoteShifts = [
        { endsWith: '2', emote: 'wcat', x: -32, y: 0 },
        { endsWith: '5', emote: 'wcat', x: -32, y: 0 },
        { endsWith: '8', emote: 'wcat', x: -32, y: 0 },
        { endsWith: '3', emote: 'wcat', x: -96, y: 0 },
        { endsWith: '6', emote: 'wcat', x: -96, y: 0 },
        { endsWith: '9', emote: 'wcat', x: -96, y: 0 },
        { endsWith: '10', emote: 'wcat', x: -64, y: 0 },

        // Add more rules here
    ];

    timestampEmoteShifts.forEach(({ endsWith, emote, x, y }) => {
        GM_addStyle(`
            .msg-chat.msg-user > time[data-unixtimestamp$="${endsWith}"] ~ .text .emote.${emote}:first-of-type {
                height: 32px;
                width: 32px;
                background-position: ${x}px ${y}px;
                background-repeat: no-repeat;
            }
        `);
    });

    // --- Mutation observer to replace "wcat" text with emote ---
    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    if (textContainer) {
                      textContainer.innerHTML = textContainer.innerHTML.replace(
                          /(^|\s|>)wcat(?=\s|$|<)/g,
                          `$1<div class="emote wcat">
                              <div class="emote-info">
                                  <div class="name" title="Emote name">wcat</div>
                              </div>
                           </div>`
                      );
                    }
                }
            }
        }
    }



    const targetElement = document.getElementById("chat-win-main")?.querySelector(".chat-lines");
    if (targetElement) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetElement, { childList: true });
    }
})();