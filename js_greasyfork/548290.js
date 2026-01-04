// ==UserScript==
// @name         MeFi Inline Images
// @namespace    https://github.com/klipspringr/mefi-userscripts
// @version      2025-09-09-a
// @description  MetaFilter: restore the glory days of the IMG tag by inlining images linked in comments
// @author       Klipspringer
// @supportURL   https://github.com/klipspringr/mefi-userscripts
// @license      MIT
// @match        *://*.metafilter.com/*
// @downloadURL https://update.greasyfork.org/scripts/548290/MeFi%20Inline%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/548290/MeFi%20Inline%20Images.meta.js
// ==/UserScript==

;(async () => {
    ;("use strict")

    const IMG_CLASS = "mfit"
    const ATTRIBUTE_DONE = "data-mfit"

    if (
        !/^\/(\d|comments\.mefi)/.test(window.location.pathname) ||
        /rss$/.test(window.location.pathname)
    ) {
        return
    }

    const onImageError = (e) => e.target.remove() // if fail to load, remove element

    const run = async (target) => {
        const start = performance.now()

        const nodes = (target ?? document).querySelectorAll(
            `div.comments a:not(.smallcopy *):not([${ATTRIBUTE_DONE}])`
        )

        let count = 0

        nodes.forEach((node) => {
            let href = node.getAttribute("href")
            if (!href) return

            const imgur = href.match(
                /^https?:\/\/(?:i\.)?imgur.com\/(\w+)$/
            )?.[1]
            if (imgur) {
                // using i subdomain saves a 302 redirect
                // .png works even if MIME type is different
                href = `https://i.imgur.com/${imgur}.png`
            } else if (!/\.(avif|gif|jpg|jpeg|png|webp)$/i.test(href)) {
                return
            }

            // don't inject images twice - e.g. when new comments loaded a second time
            node.setAttribute(ATTRIBUTE_DONE, "done")

            const img = document.createElement("img")
            img.setAttribute("src", href)
            img.setAttribute("class", IMG_CLASS)
            img.addEventListener("error", onImageError)

            // we're setting display:block on the img. so a following <br> causes an empty line
            if (node.nextElementSibling?.tagName === "BR")
                node.nextElementSibling.remove()

            node.insertAdjacentElement("afterend", img)

            count += 1
        })

        console.log(
            "mefi-inline-images",
            nodes.length,
            count,
            Math.round(performance.now() - start) + "ms"
        )
    }

    const styleElement = document.createElement("style")
    styleElement.textContent = `img.${IMG_CLASS} {
        display: block;
        max-width: 100%;
        max-height: 50vh;
        width: auto;
        height: auto;
        object-fit: contain;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }`
    document.body.insertAdjacentElement("beforeend", styleElement)

    const newCommentsElement = document.getElementById("newcomments")
    if (newCommentsElement) {
        const observer = new MutationObserver(() => run(newCommentsElement))
        observer.observe(newCommentsElement, { childList: true })
    }

    run()
})()
