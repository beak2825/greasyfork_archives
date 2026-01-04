// ==UserScript==
// @name         Bypass Instagram Login Redirects
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  a workaround to bypass Instagram login page
// @author       you
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/561194/Bypass%20Instagram%20Login%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/561194/Bypass%20Instagram%20Login%20Redirects.meta.js
// ==/UserScript==

(async () => {
    // Instagram profile & post URLs regex
    const instaProfile = /(?<!^https\:\/\/www\.google\.com\/imgres\?imgurl.*)(?:https?\:\/\/)?(?:www\.)?(?<!help\.|api\.|business\.|about\.|lookaside\.)(?:(?:(?:instagram\.com|instagr\.am)\/accounts\/login\/\?next=)|(?:instagram\.com))(?:\/|%2f)(?!accounts|explore|developer|reel)([a-zA-Z._0-9]{3,})/i;
    const instaPost = /(?<!^https\:\/\/www\.google\.com\/imgres\?imgurl.*)(?:https?\:\/\/)?(?:www\.)?(?:(?:(?:instagram\.com|instagr\.am)\/accounts\/login\/\?next=)|(?:instagram\.com))(?:(?:\/|%2f)p|(?:\/|%2f)reel)(?:\/|%2f)([a-zA-Z._0-9-]+)/i;

    const VIEWER_LIST = [
        {
            name: "Dumpor",
            profilePrefix: "https://dumpor.io/v/",
            postPrefix: "https://dumpor.io/c/",
            ID: "mediaId",
            reverseId: true
        },
        {
            name: "imginn",
            profilePrefix: "https://imginn.com/",
            postPrefix: "https://imginn.com/p/",
            ID: "shortcode",
            reverseId: false
        },
        {
            name: "Piokok",
            profilePrefix: "https://www.piokok.com/profile/",
            postPrefix: "https://www.pixnoy.com/post/",
            ID: "shortcode",
            reverseId: false
        }
    ];
    const DEFAULT_VIEWR_NAME = "imginn";

    const defaultViewer = VIEWER_LIST.find(viewer => viewer.name === DEFAULT_VIEWR_NAME);
    const currentViewer = await GM_getValue("currentViewer", defaultViewer);

    for (const viewer of VIEWER_LIST) {
        const viewerName = currentViewer.name === viewer.name ? viewer.name + " ✔️" : viewer.name;
        await GM_registerMenuCommand(viewerName, async () => {
            if (currentViewer.name !== viewer.name) {
                await GM_setValue("currentViewer", viewer);
                location.reload();
                alert(`Viewer is now set to ${viewer.name}`);
            }
        });
    }

    function getUsername(url) {
        url = decodeURIComponent(url);
        const username = url.match(instaProfile)[1];
        return username;
    }

    function getMediaId(url) {
        let shortcode = url.match(instaPost)[1];
        if (currentViewer.ID === "shortcode") {
            return shortcode;
        }
        else if (currentViewer.ID === "mediaId") {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
            let mediaId = BigInt(0); // BigInt is used to produce large integers beyond JavaScript limit (see reference below)
            for (const char of shortcode) {
                mediaId = BigInt((mediaId * 64n)) + BigInt(alphabet.indexOf(char));
            }
            if (currentViewer.reverseId) mediaId = mediaId.toString().split("").reverse().join("");
            return mediaId;
        }
    }

    const address = window.location.href;
    if (/next=(?:\/|%2f)(?!accounts|explore|developer|reel)[a-zA-Z._0-9]{3,}/i.test(address)) window.location.href = currentViewer.profilePrefix + getUsername(address);
    if (/next=(?:\/|%2f)(p|reel)(?:\/|%2f)[a-zA-Z._0-9-]+/i.test(address)) window.location.href = currentViewer.postPrefix + getMediaId(address);

    const loggedIn = document.cookie.includes("ds_user_id");
    if (loggedIn) return;

    let aTags = [];
    const observer = new MutationObserver(() => {
        aTags = [...new Set([...aTags, ...document.querySelectorAll("a")])]; // collect <a> elemets without duplicates
        for (const elem of aTags) {
            try {
                // if Instagram profile URL
                if (instaProfile.test(decodeURIComponent(elem.href))) {
                    elem.addEventListener("click", (event) => { event.stopPropagation(); }, true); // override click event
                    elem.href = currentViewer.profilePrefix + getUsername(elem.href);
                }
                // if Instagram post URL
                if (instaPost.test(decodeURIComponent(elem.href))) {
                    elem.addEventListener("click", (event) => { event.stopPropagation(); }, true);
                    elem.href = currentViewer.postPrefix + getMediaId(elem.href);
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true, //  monitor addition/removal of nodes
        attributeFilter: ["href"] // monitor href changes
    });
})();