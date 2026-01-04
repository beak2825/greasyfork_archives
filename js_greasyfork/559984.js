// ==UserScript==
// @name         Exhentai AiDetector
// @namespace    B1773rm4n
// @version      2025-12-24
// @description  Detects AI generated content on e-hentai and highlights it
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/ehentai_AiDetector.js
// @author       B1773rm4n
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559984/Exhentai%20AiDetector.user.js
// @updateURL https://update.greasyfork.org/scripts/559984/Exhentai%20AiDetector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // If on a gallery page itself
    if (document.URL.includes("\/g\/")) {
        console.log("gallery view")
        let title = document.getElementById("gn").innerText
        let tag;
        try {
            tag = document.getElementById("ta_other:ai_generated").innerText
        } catch (err) {
            tag = ""
        }

        if (title.includes("AI Generated") || tag.includes("ai generated")) {
            document.body.style.color = "#F00"
            document.body.style.backgroundColor = "#400"
            document.getElementById("gdt").style.backgroundColor = "#400"
        }

        // redirect to exhentai

        if (window.location.toString().indexOf('e-hentai') > -1) {
            let newLocation = window.location.toString().replace('e-hentai', 'exhentai')
            window.location.replace(newLocation)
        }
    }

    // If on the overview of galleries
    if (document.URL.includes("advsearch") || document.URL.includes("tag") || document.URL.includes("popular")) {
        console.log("list view")
        // let galleryList = document.getElementsByClassName("glname")
        // this does the same as the commented line above but returns an array
        let galleryList = [...document.querySelectorAll('.glname')]

        galleryList.forEach(function (galleryItem, index) {
            if (galleryItem.innerText.toLowerCase().includes("ai generated") || galleryItem.innerText.toLowerCase().includes("ai-generated")) {
                galleryItem.parentElement.parentElement.style.backgroundColor = "#400"
            }
        })

    }

})();
