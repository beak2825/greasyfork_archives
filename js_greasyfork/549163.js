// ==UserScript==
// @name           Jellyneo - Add DTI Link for Wearables in JN's Item Database
// @version        1.1
// @description    Adds a link to DTI for wearable items in Jellyneo's Item Database
// @match          *://items.jellyneo.net/item/*
// @author         0o0slytherinpride0o0
// @namespace      https://github.com/0o0slytherinpride0o0/
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/549163/Jellyneo%20-%20Add%20DTI%20Link%20for%20Wearables%20in%20JN%27s%20Item%20Database.user.js
// @updateURL https://update.greasyfork.org/scripts/549163/Jellyneo%20-%20Add%20DTI%20Link%20for%20Wearables%20in%20JN%27s%20Item%20Database.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const once = {
        once: true,
    };

    function init() {
        var closetImg = document.querySelector("div.find-this-item.text-small ul li img[alt='Find in your Closet']");

        if (closetImg && !document.querySelector("div.find-this-item.text-small ul li img[alt='Find on DTI']")) {

            var closetLi = closetImg.parentElement.parentElement;
            if (closetLi.tagName === "LI") {
                var itemName = document.querySelector("h1").innerText;
                var itemNameURL = encodeURIComponent(itemName).replaceAll("%20", "+");

                var DTIli = closetLi.cloneNode(true);

                DTIli.children[0].href = "https://impress.openneo.net/items?q=" + itemNameURL;
                DTIli.children[0].children[0].src = "https://images.neopets.com/items/clo_shoyru_dappermon.gif";
                DTIli.children[0].children[0].alt = "Find on DTI";
                DTIli.children[0].children[0].title = "Find on DTI";
                DTIli.children[1].href = DTIli.children[0].href;
                DTIli.children[1].innerText = "Dress to Impress";

                closetLi.parentElement.insertBefore(DTIli, closetLi.parentElement.children[0]);
            }
        }
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init, once);
    }
})();
