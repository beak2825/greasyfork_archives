// ==UserScript==
// @name         MaruMori Prestige Progress
// @namespace    http://marumori.io/
// @version      1.1.0
// @license      WTFPL
// @description  Add a progress bar to the homepage displaying the progress towards prestige.
// @author       Eearslya Sleiarion
// @match        https://marumori.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559396/MaruMori%20Prestige%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/559396/MaruMori%20Prestige%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prestigeExp = 100480;

    const update = (progressBars) => {
        if (progressBars === null) { return; }
        if (progressBars.querySelector(".prestige-progress") !== null) { return; }

        let progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "bar-big", "svelte-swk787", "prestige-progress");
        progressBar.style.marginTop = "25px";
        progressBar.style.display = "none";
        progressBars.appendChild(progressBar);

        fetch("https://marumori.io/home/__data.json", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
              const info = data.nodes[0].data;
              const userInfo = info[info[0].user];
              const currentExp = info[userInfo.experience];

              const progress = Math.round((currentExp / prestigeExp) * 100);
              console.log((prestigeExp - currentExp) + "EXP to prestige!");

              let outerBar = document.createElement("div");
              outerBar.classList.add("outer-bar", "big", "svelte-swk787");
              outerBar.style.backgroundColor = "var(--purple-transparent)";

              let innerBar = document.createElement("div");
              innerBar.classList.add("inner-bar", "svelte-swk787");
              innerBar.style.backgroundColor = "var(--purple)";
              innerBar.style.width = progress + "%";

              let barText = document.createElement("span");
              barText.classList.add("svelte-swk787");
              barText.innerText = progress + "% Prestige";

              outerBar.appendChild(innerBar);
              outerBar.appendChild(barText);
              progressBar.appendChild(outerBar);
              progressBar.style.display = "block";
        });
    };

    const updateCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.querySelector(".progress-bars") !== null) {
                    update(node.querySelector(".progress-bars"));
                }
            }
        }
    };

    const setupCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.classList.contains("content")) {
                    const newObserver = new MutationObserver(updateCallback);
                    newObserver.observe(node, { childList: true });
                    update(node.querySelector(".progress-bars"));
                }
            }
        }
    };

    const observer = new MutationObserver(setupCallback);
    observer.observe(document.getElementById("svelte"), { childList: true });
})();