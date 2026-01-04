// ==UserScript==
// @name         imgur to rimgo image redirector
// @namespace    http://tampermonkey.net/
// @version      2025.11.28
// @description  redirects imgur <img> tags to a randomly selected rimgo instance
// @author       infinitysnapz
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @license     MIT; http://opensource.org/licenses/MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551190/imgur%20to%20rimgo%20image%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/551190/imgur%20to%20rimgo%20image%20redirector.meta.js
// ==/UserScript==

// based on:
//Imgur to Rimgo redirect v0.1.4 by 0b9
//https://gist.github.com/wont-work/e1f00fcc6c44b05a312573379b649afa#file-free-overjoyed-anywhere-you-go-user-js by kopper

(function() {
    'use strict';

    const apiUrl = 'https://rimgo.codeberg.page/api.json';
    const instancediscovery = 'https://rimgo.codeberg.page';

    var eligible = {};

    var broken = [

        "imgur.010032.xyz", // dead domain
        "projectsegfau.lt", // all private instances being shut down
        "rmgur.com", // dead domain
        "rimgo.frylo.net", // dead domain
        "rimgo.fascinated.cc", // 404 not found
        "rimgo.totaldarkness.net", // dead domain/times out
        "rimgo.quantenzitrone.eu", //error 502, keeps breaking
        "rimgo.reallyaweso.me", // keeps breaking

        "rimgo.darkness.services", // has anubis check
        "imgur.artemislena.eu", // has anubis check
        "rimgo.bloat.cat", // has anubis check and appears to be down
        "imgur.nerdvpn.de", // has anubis check
        "rg.kuuro.net", // has anubis check
        "rimgo.aketawi.space", // has anubis check
        // as amazing as anubis is in the fight against bots and AI, it means we cannot embed images from these sites properly.

        "drgns.space", //under maintenance, will check back later
        "rimgo.proxik.cloud", //cloudflare error, check back later
        "rimgo.thebunny.zone", //error 502
        //temporary dead domains

        //"r.opnxng.com",                             //second chance! testing, might still have anubis check
        //"imgur.sudovanilla.org",                    //second chance! formerly times out
        //"nohost.network",                           //second chance! formerly times out
        //"rimgo.lunar.icu",                          //second chance! formerly error 502
        //"rimgo.privacyredirect.com",                //second chance! formerly error 502
        //second chancers, domains that were down, but are back now!

    ];// soo many broken instances wtf

    const generateHash = (string) => { // hash, to allow us to cache images easier and reduce load on
        let hash = 0;
        for (const char of string) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }
        return hash;
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                walk(node);
            }
        }
    });

    /**
 * @param {Node} root
 */
    function walk(root) {
        if (!root.ownerDocument) throw "assertion falied: no owner document";

        const walker = root.ownerDocument.createNodeIterator(
            root,
            NodeFilter.SHOW_ELEMENT,
            (node) => {
                if (node.nodeType == Node.ELEMENT_NODE && node.shadowRoot) {return NodeFilter.FILTER_ACCEPT};

                if (node.nodeName == "STYLE" || node.nodeName == "SCRIPT") {return NodeFilter.FILTER_REJECT};

                if (node.nodeName == "IMG"){return NodeFilter.FILTER_ACCEPT};


                return NodeFilter.FILTER_SKIP;
            });

        /** @type {Node|null} */let node;
        node = walker.nextNode();
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
                for (const child of node.shadowRoot.children) {
                    if (child.nodeName == "STYLE" || child.nodeName == "SCRIPT") continue;
                    walk(child);
                }

                observer.observe(node.shadowRoot, observerConfig);
                continue;
            };

            if (!node.nodeName == "IMG") continue;
            redirectImg(node);

        }
    }

    const observerConfig = {
        childList: true,
        subtree: true,
    };

    const redirectImg = (elem) => {
          const imgsrc = elem.src
          if (/https?:\/\/(\w+\.)?imgur.com\/(\w*)+(\.[a-zA-Z]{3,4})/.test(imgsrc)){
              const path = imgsrc.substring(imgsrc.indexOf("/", 8));
              const instanceUrl = eligible[Math.abs(generateHash(path) % eligible.length)].url
              const newUrl = `${instanceUrl}/${path.startsWith("/") ? path.slice(1) : path}`;
              elem.src = newUrl;
          };
    };

    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function (response) {
            try {
                const data = JSON.parse(response.responseText);
                eligible = data.clearnet.filter(inst => inst.note.includes("✅ Data not collected"));
                eligible = eligible.filter(inst => !(new RegExp( '\\b' + broken.join('\\b|\\b') + '\\b') ).test(inst.url) );
                console.log(eligible)
                walk(document.body)
                observer.observe(document.body, observerConfig);
            } catch (e) {
                console.error("JSON parsing failed, no image redirecting will occur.", e);
            }
        },
        onerror: function (err) {
            console.error("Request failed, no image redirecting will occur.", err);
        }
    });

})();