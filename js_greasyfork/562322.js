// ==UserScript==
// @name         Dragon Cave - Auto Groups Links
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Turns groups "links" in trading "Wants" into real clickable hyperlinks.
// @author       Valen
// @match        https://dragcave.net/trading*
// @match        https://dragcave.net/teleport*
// @icon         https://icons.duckduckgo.com/ip2/dragcave.net.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562322/Dragon%20Cave%20-%20Auto%20Groups%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/562322/Dragon%20Cave%20-%20Auto%20Groups%20Links.meta.js
// ==/UserScript==

function waitDOMContent(func) {
    if (document.readyState !== 'loading') {
        func;
    } else {
        document.addEventListener('DOMContentLoaded', func);
    };
};

async function toHref() {
    let els;
    if (/\/(trading)/.test(location.href)) {
        els = await document.getElementsByClassName("_78_6");
    } else if (/\/(teleport)/.test(location.href)) {
        els = await document.querySelectorAll("section div");
    }
    const texts = await Array.from(els);
    for (let i = 0; i < texts.length; i++) {
        const $this = texts[i];
        const $text = $this.textContent;
        const regex = /(|group)\/\d{3,}/gi;
        let match;
        let repl;

        if (regex.test($text) == false) {
            continue
        } else {
            match = $text.match(regex).filter((x) => x.match(/\//));
            console.log(match)
            for (const matches of match) {
                if (/(group)/.test(matches)) {
                    $this.innerHTML = $this.innerHTML.replace(matches, `<a href="/${matches}" target="_blank">${matches}</a>`);
                } else {
                    repl = "group"+matches;
                    $this.innerHTML = $this.innerHTML.replace(matches, `<a href="/${repl}" target="_blank">${matches}</a>`);
                }
            }

        };
    };
};

waitDOMContent(toHref());
