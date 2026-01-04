// ==UserScript==
// @name         imgur proxy
// @namespace    http://tampermonkey.net/
// @version      1
// @description  redirects imgur <img> tags via a proxy
// @author       FatCatTuxedo
// @match        *://*/*
// @license MIT 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL https://update.greasyfork.org/scripts/551401/imgur%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/551401/imgur%20proxy.meta.js
// ==/UserScript==

// based on:
//Imgur to Rimgo redirect v0.1.4 by 0b9
//https://gist.github.com/wont-work/e1f00fcc6c44b05a312573379b649afa#file-free-overjoyed-anywhere-you-go-user-js by kopper

(function() {
    'use strict';

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
              //elem.src = newUrl;
              elem.src = "https://proxy.duckduckgo.com/iu/?u=" + imgsrc;
          };
    };

            try {

                walk(document.body)
                observer.observe(document.body, observerConfig);
            } catch (e) {
                console.error("JSON parsing failed, no image redirecting will occur.", e);
            }

})();