// ==UserScript==
// @name         Copy Forum Post
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a copy button to forum posts
// @author       JK_3
// @match        https://www.warzone.com/Discussion/?ID=*
// @include      /^https:\/\/www\.warzone\.com\/Forum\/\d+-.*/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560559/Copy%20Forum%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/560559/Copy%20Forum%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CopyDoneDuration = 1600;
    const CopyDoneText = "Copied!";
    const CopyDoneBackgroundColor = "ForestGreen";
    const CopyDoneBorderColor = "DarkGreen";
    const CopyText = "Copy";

    function processNode(parentNode, insideList = false) {
        let textParts = [];
        for (let childNode of parentNode.childNodes) {
            switch (childNode.nodeName) {
                case "#text": // Text
                {
                    textParts.push(childNode.textContent);
                    break;
                }
                case "BR": // Linebreak (newline)
                {
                    textParts.push("\n");
                    break;
                }
                case "LI": // Container for elements
                {
                    if (insideList) {
                        textParts.push("[*]");
                    }
                    textParts.push(processNode(childNode));
                    break;
                }
                case "B": // Bold
                {
                    textParts.push("[b]" + childNode.innerText + "[/b]");
                    break;
                }
                case "SPAN": // Italics
                {
                    textParts.push("[i]" + childNode.innerText + "[/i]");
                    break;
                }
                case "UL": // List
                {
                    textParts.push("[list]" + processNode(childNode, true) + "[/list]");
                    break;
                }
                case "A": // Url
                {
                    textParts.push(childNode.href);
                    break;
                }
                case "IMG": // Inline image
                {
                    textParts.push("[img]" + childNode.src + "[/img]");
                    break;
                }
                case "HR": // Horizontal Linebreak
                {
                    textParts.push("[hr]");
                    break;
                }
                case "FONT": // The "Edited yyyy-mm-dd hh:mm:ss" label
                {
                    break;
                }
                default:
                {
                    console.error(`Unknown childNode type ${childNode.nodeName}`, childNode);
                }
            }
        }
        return textParts.join("");
    }

    function handleClick(event) {
        // Copy the forum post
        let buttonElement = event.target;
        let contentNode = buttonElement.parentElement.parentElement.cells[1].firstElementChild;
        let text = processNode(contentNode).trim();
        GM_setClipboard(text);

        // Style button to show success
        buttonElement.innerText = CopyDoneText;
        buttonElement.style.backgroundColor = CopyDoneBackgroundColor;
        buttonElement.style.borderColor = CopyDoneBorderColor;

        // Revert button to old state
        setTimeout(() => {
            buttonElement.innerText = CopyText;
            buttonElement.style = null;
        }, CopyDoneDuration);

        // Return false to cancel the anchor navigation event (which prevents browser from reloading)
        return false;
    }

    function addButtonToPost(post) {
        let postId = post.id.split("_")[1];
        let postedBy = post.tBodies[0].rows[1].cells[0];

        let button = document.createElement("a");
        button.id = "CopyPostBtn_" + postId;
        button.classList.add("btn", "btn-primary");
        button.innerText = CopyText;
        button.href = "#";
        button.onclick = handleClick;

        postedBy.appendChild(document.createElement("br"));
        postedBy.appendChild(button);
    }

    for (let post of document.querySelectorAll("table[id^='PostTbl_']")) {
        if (post.id.includes("-")) {
            continue; // skip over invisible posts with negative ids
        }

        addButtonToPost(post);
    }

})();