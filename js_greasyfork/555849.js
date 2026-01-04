// ==UserScript==
// @name         Combo
// @namespace    combostuff
// @version      1.0.3
// @description  AAA
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      mit
// @match        https://www.torn.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/555849/Combo.user.js
// @updateURL https://update.greasyfork.org/scripts/555849/Combo.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const EVENT_REGEX = /event:\/\/([^\s]+)/g; // matches event://<anything-no-whitespace>

    function onEventClick(e) {
        // only handle left-click / normal clicks
        /*
        e.preventDefault();
        e.stopPropagation();

        
        const href = e.currentTarget.getAttribute('href');
        const id = href.split('://')[1] || '';
        console.log('event clicked:', id);
        */
        e.preventDefault?.();
        e.stopPropagation?.();

        const id = e.currentTarget.dataset.eventId || '';
        console.log('event clicked:', id);
        alert(`event clicked: ${id}`);
    }
    function processTextNode(textNode) {
        if (!textNode || !textNode.nodeValue) return;

        // Parent might be null if node was removed
        const parent = textNode.parentNode;
        if (!parent) return;

        // Don’t process inside our own links
        if (parent.closest && parent.closest('a[data-event-link="true"]')) {
            return;
        }

        const text = textNode.nodeValue;
        if (!EVENT_REGEX.test(text)) return;

        EVENT_REGEX.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = EVENT_REGEX.exec(text)) !== null) {
            const fullMatch = match[0]; // e.g. "event://3nd82ggsfb"
            const id = match[1];        // e.g. "3nd82ggsfb"
            const index = match.index;

            if (index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }

            /*
            const a = document.createElement('a');
            a.classList.add("customEventLink");
            a.href = fullMatch;
            a.textContent = `Watchlist : ${id}`;
            a.dataset.eventLink = 'true';
            a.addEventListener('click', onEventClick);
            */

            // create the button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add("customEventLink");
            btn.textContent = `Event ${id}`;          // or use fullMatch if you prefer
            btn.dataset.eventId = id;                // store the ID
            btn.dataset.eventProcessed = 'true';     // mark as processed so we don't recurse
            btn.addEventListener('click', onEventClick);

            //fragment.appendChild(a);
            fragment.appendChild(btn);
            lastIndex = index + fullMatch.length;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // Parent might have disappeared while we were building the fragment,
        // so re-check before replacing.
        if (!textNode.parentNode) return;

        textNode.parentNode.replaceChild(fragment, textNode);
    }


    function walkAndProcess(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    // ignore empty or whitespace-only text
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    // don't process inside script/style
                    const parent = node.parentNode;
                    if (!parent || parent.nodeName === 'SCRIPT' || parent.nodeName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            processTextNode(node);
        }
    }

    // Initial run
    walkAndProcess(document.body);

    // Handle dynamically added content
    const observer = new MutationObserver(mutations => {
        /*
        detect timer div
        detect if calender.php for adding events
        detect settings?

        if paricipate then continute with for loop
        */
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    walkAndProcess(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    GM_addStyle(`
        .customEventLink{
            font-size: 12px !important;
            line-height: 15px !important;
            color: #74c0fc;
            background-color: transparent;
            
            cursor: pointer;
            text-decoration: underline;
        }
        .customEventLink:hover{
            color: #3190d8ff;
        }
    `);
})();

/*
(function () {
    'use strict';
    throwRed(`started | v${GM_info.script?.version || null}`);


    if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', function () {
        alert("TEST")
    });

    let cacheNames = {
        apiKey: 'combo_apikey'
    }

    let apiKey = GM_getValue(cacheNames.apiKey, '');


    function init() {
        let status = document.querySelector('.status-icons___gPkXF');

        const listItem = document.createElement('li');
        listItem.setAttribute('id', 'combo_virus');
        listItem.style.backgroundImage = "url('https://www.torn.com/images/items/70/small.png')"
        //        listItem.classList.add("icon51___rMjcE");


        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.setAttribute('aria-label', 'Test');
        link.setAttribute('tabindex', 0);
        link.setAttribute('data-is-tooltip-opened', false);


        link.textContent = '';


      

        listItem.appendChild(link);
        status.appendChild(listItem);



    }



    async function GM_fetch(page, selections) {

        throwRed(`GM_fetch https://api.torn.com/v2/${page}/?selections=${selections}&key=${apiKey}`);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/v2/${page}/?selections=${selections}&key=${apiKey}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function (response) {
                    throwRed(`GM_fetch onload`);
                    try {
                        if (!response || !response.responseText) {
                            throwRed(`GM_fetch Empty response`);
                            reject("Empty response");
                            return reject(new Error("Empty response"));
                        }



                        const json = JSON.parse(response.responseText);
                        console.log('GM_fetch', json)
                        resolve(json);

                    } catch (err) {
                        throwRed(`GM_fetch ERROR1, ${err}`);
                        reject(err);
                    }
                },
                onerror: function (err) {
                    throwRed(`GM_fetch ERROR2, ${err}`);
                    reject(err);
                },
            });
        });
    }

    function throwRed(msg) {
        console.log(msg)
    }



    
    const observer = new MutationObserver(() => {
        let status = document.querySelector('.status-icons___gPkXF');
        if (status && !document.querySelector('#combo_virus')) {
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    


    GM_addStyle(`
        #combo_virus{
            height: 17px;
            margin-bottom: 10px;
            margin-right: 10px;
            width: 17px;

            background-position: top center;

            
            background-repeat: no-repeat;
            display: inline-block;
            vertical-align: top;
        }
    `);
})();
*/