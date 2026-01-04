// ==UserScript==
// @name         IGG-GAMES Download Size Previewer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Shows the download size for a game download (single or parts)
// @author       Shadoweb
// @match        https://igg-games.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=igg-games.com
// @grant        GM.xmlHttpRequest
// @connect      urlbluemedia.shop
// @connect      megaup.net
// @downloadURL https://update.greasyfork.org/scripts/555232/IGG-GAMES%20Download%20Size%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/555232/IGG-GAMES%20Download%20Size%20Previewer.meta.js
// ==/UserScript==

const UNITS = {
    BYTES: 1,
    KBYTES: 1 * 1000,
    MBYTES: 1 * 1000 * 1000,
    GBYTES: 1 * 1000 * 1000 * 1000,
    TBYTES: 1 * 1000 * 1000 * 1000 * 1000,
};

function get(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data = response.responseText;
                        resolve(data);
                    } catch (e) {
                        reject(new Error("Failed to get response text"));
                    }
                } else {
                    reject(new Error(`Failed request with status ${response.status}`));
                }
            },
            onerror: function(response) {
                reject(new Error(`Failed request with status ${response.status}`));
            }
        });
    });
}

function blueMediaFiles_decodekey(encoded) {
    var key = '';
    for (var i = encoded.length / 2 - 5; i >= 0; i = i - 2) {
        key += encoded[i];
    }
    for (i = encoded.length / 2 + 4; i < encoded.length; i = i + 2) {
        key += encoded[i];
    }
    return key;
}

function blueMediaFiles_getURL(doc) {
    var solvedURL;
    [].forEach.call(doc.getElementsByTagName('script'), function (s) {
        var m = s.innerText.match(/generateDownloadUrl\(\).+?_0x44b739='(?<encoded>.+?)'/);
        if (m && m.length > 1) {
            solvedURL = '/get-url.php?url=' + blueMediaFiles_decodekey(m[1]);
        }
    });
    return solvedURL;
}

(async function() {
    'use strict';

    const HTML_PARSER = new DOMParser();

    const linkProviders = Array.from(document.querySelectorAll("main#tm-main article.uk-article b"));
    var linkParent;
    var blueMediaFile_URLs = [];

    linkProviders.forEach((e) => {
        const text = e.innerText.toLowerCase();
        if (text.includes("megaup.net")) {
            linkParent = e.parentNode;
        }
    });

    linkParent.querySelectorAll("a").forEach((e) => {
        blueMediaFile_URLs.push(e.href);
    });

    const linkParentString = linkParent.querySelector("b");
    const linkParentOGString = linkParentString.innerText;
    linkParentString.innerText = linkParentOGString + " (fetching...)";

    var totalSize = 0;
    const sizePromises = blueMediaFile_URLs.map(async (url) => {
        const blueMediaFile_HTML = await get(url);
        const blueMediaFile_DOM = HTML_PARSER.parseFromString(blueMediaFile_HTML, "text/html");

        const blueMediaFile_SolvedURL = "https://" + url.split("/")[2] + blueMediaFiles_getURL(blueMediaFile_DOM);

        const mediaUp_HTML = await get(blueMediaFile_SolvedURL);
        const mediaUp_DOM = HTML_PARSER.parseFromString(mediaUp_HTML, "text/html");

        const mediaUp_title = mediaUp_DOM.querySelector("div.main-container div.container table th strong").innerText.trim();
        const mediaUp_split = mediaUp_title.split("(");
        const mediaUp_size_raw = mediaUp_split[mediaUp_split.length-1].split(")")[0];
        const mediaUp_size_clean = mediaUp_size_raw.replace(/[^0-9.,]/g, "");
        const mediaUp_size_unit = mediaUp_size_raw.replace(/[0-9.,]/g, "").trim().toLowerCase().split("")[0];

        var mult;
        switch (mediaUp_size_unit) {
            case "b": mult = UNITS.BYTES; break;
            case "k": mult = UNITS.KBYTES; break;
            case "m": mult = UNITS.MBYTES; break;
            case "g": mult = UNITS.GBYTES; break;
            case "t": mult = UNITS.TBYTES; break;
        }
        const mediaUp_size = parseFloat(mediaUp_size_clean) * mult;

        return mediaUp_size;
    });
    const allSizes = await Promise.all(sizePromises);
    totalSize = allSizes.reduce((sum, currentSize) => sum + currentSize, 0);

    var unit;
    if ((totalSize / UNITS.TBYTES) >= 1) {
        totalSize = Math.round((totalSize / UNITS.TBYTES) * 100) / 100;
        unit = "TB";
    } else if ((totalSize / UNITS.GBYTES) >= 1) {
        totalSize = Math.round((totalSize / UNITS.GBYTES) * 100) / 100;
        unit = "GB";
    } else if ((totalSize / UNITS.MBYTES) >= 1) {
        totalSize = Math.round((totalSize / UNITS.MBYTES) * 100) / 100;
        unit = "MB";
    } else if ((totalSize / UNITS.KBYTES) >= 1) {
        totalSize = Math.round((totalSize / UNITS.KBYTES) * 100) / 100;
        unit = "KB";
    } else {
        totalSize = Math.round((totalSize / UNITS.BYTES) * 100) / 100;
        unit = "B";
    }

    const finalSize = `${totalSize} ${unit}`;

    linkParentString.innerText = linkParentOGString + " (" + finalSize + ")";
})();