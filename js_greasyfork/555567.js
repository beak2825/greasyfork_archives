// ==UserScript==
// @name         arson
// @namespace    arson.zero.nao
// @version      0.5
// @description  quick links for arson
// @author       nao [2669774]
// @match        https://www.torn.com/page.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555567/arson.user.js
// @updateURL https://update.greasyfork.org/scripts/555567/arson.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.href.includes("sid=crimes")) {
        return;
    }

    const rfc = getRFC();
    const igniters = [1466, 544, 742, 255];
    const dampers = [1235, 833, 1463];
    const priority = [172, 1461, 544, 1235];
    const data = {};

    const style = document.createElement("style");
    style.textContent = `
            .zero-div::-webkit-scrollbar { display: none; }
            .zero-div { display: flex; width: 100%; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -ms-overflow-style: none; }
            .recommended { box-shadow: 0 0 6px 1px rgba(255, 255, 0, 0.6); }
        `;
    document.head.appendChild(style);

    const { fetch: origFetch } = window;
    window.fetch = async (...args) => {
        const response = await origFetch(...args);
        if (response.url.includes("crimesData&step=crimesList")) {
            response.clone().json().then(body => {
                const targets = body.DB?.crimesByType?.targets || [];
                const availableList = body.DB?.crimesByType?.availableItems.reduce((acc, cur) => {
                    if (cur.total > 0) acc.push(cur.itemID);
                    return acc;
                }, []);
                for (const target of targets) {
                    const key = target.title + target.story;
                    const available = target.itemsNeeded;
                    const availableActions = target.availableActions.reduce((acc, cur) => {
                        acc.push(cur.crimeID);
                        return acc;
                    }, []);
                    const items = available.filter(item =>
                                                   availableList.includes(item)
                                                  );
                    if (items.length === 0) continue;
                    let temp = {
                        subID: target.subID,
                        recommended: target.suitable,
                        items,
                        availableActions
                    };
                    if (data[key]) {
                        if (JSON.stringify(data[key]) !== JSON.stringify(temp)) {
                            data[key] = temp;

                            // update element to be unprocessed
                            document.querySelector(`div[zero-id="${key}"]`).setAttribute("processed", "false");
                        }
                    }
                    else {
                        data[key] = temp;
                    }
                }
                setTimeout(processList, 500);
            }).catch(err => { });
        }
        return response;
    };

    function processElement(el) {
        const titleStory = el.querySelector("div[class^='titleAndScenario']");
        if (!titleStory) return;
        let title = titleStory.textContent.trim();
        if (!title) {
            title = titleStory.getAttribute("zero-id");
            if (!title) return;
        }
        if (titleStory.getAttribute("processed") === "true" || !data[title]) return;
        const { subID, items, recommended, availableActions } = data[title];
        const div = document.createElement("div");
        div.classList.add("zero-div");
        const ordered = [
            ...items.filter(i => priority.includes(i)),
            ...items.filter(i => !priority.includes(i))
        ];
        for (const item of ordered) {
            const img = document.createElement("img");
            img.src = `/images/items/${item}/medium.png`;
            img.style.width = "50px";
            img.style.border = "1px solid green";
            img.style.margin = "2px";
            img.style.flexShrink = "0";
            img.style.cursor = "pointer";
            if (recommended && recommended.includes(item)) {
                img.classList.add("recommended");
            }
            img.addEventListener("click", () => {
                img.style.border = "1px solid yellow";
                img.style.backgroundColor = "rgba(255,255,0,0.2)";
                let crimeVal = 331;
                
                
                if (igniters.includes(item)) {
                    crimeVal = 332;
                }
                if (availableActions.includes(333)) {
                    crimeVal = 333;
                }
                if (dampers.includes(item)) {
                    crimeVal = 334;
                }
                $.post(
                    `https://www.torn.com/page.php?sid=crimesData&step=attempt&typeID=13&crimeID=${crimeVal}&value1=${subID}&value2=${item}&rfcv=${rfc}`,
                    response => {
                        const success = response.DB?.outcome?.result !== "error";
                        img.style.border = success ? "1px solid green" : "1px solid red";
                        img.style.backgroundColor = success ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)";
                        setTimeout(() => {
                            img.style.backgroundColor = "";
                            img.style.border = "1px solid green";
                        }, 500);
                    }
                ).fail(() => {
                    img.style.border = "1px solid red";
                    img.style.backgroundColor = "rgba(255,0,0,0.2)";
                    setTimeout(() => {
                        img.style.backgroundColor = "";
                        img.style.border = "1px solid green";
                    }, 500);
                });
            });
            div.appendChild(img);
        }
        titleStory.innerHTML = "";
        titleStory.setAttribute("zero-id", title);
        titleStory.setAttribute("processed", "true");
        titleStory.style.overflow = "hidden";
        titleStory.appendChild(div);
    }

    function processList() {
        document.querySelectorAll("div[class^='virtualList_'] > div").forEach(processElement);
    }

    function getRFC() {
        var rfc = $.cookie('rfc_v');
        if (!rfc) {
            var cookies = document.cookie.split('; ');
            for (var i in cookies) {
                var cookie = cookies[i].split('=');
                if (cookie[0] == 'rfc_v') {
                    return cookie[1];
                }
            }
        }
        return rfc;
    }

    function setupUrlListener() {
        ['pushState', 'replaceState'].forEach(method => {
            const original = history[method];
            history[method] = function() {
                original.apply(this, arguments);
                onUrlChange();
            };
        });
        window.addEventListener('popstate', onUrlChange);
        onUrlChange();
    }

    function onUrlChange() {
        if (window.location.href.includes("arson") && !window.arsonSetup) {
            setupArson();
            window.arsonSetup = true;
        }
    }

    function setupArson() {


        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            processElement(node);
                        }
                    });
                }
            });
        });

        const container = document.querySelector("div[class^='virtualList_']");
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
            processList();
        }
    }

    setupUrlListener();

})();

