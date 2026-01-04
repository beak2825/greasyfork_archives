// ==UserScript==
// @name         GGn GOTY Search Linker
// @namespace    none
// @version      1
// @description  Links GOTY nominations/votes to search
// @author       ingts
// @match        https://gazellegames.net/forums.php*action=viewthread&threadid=*
// @downloadURL https://update.greasyfork.org/scripts/558115/GGn%20GOTY%20Search%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/558115/GGn%20GOTY%20Search%20Linker.meta.js
// ==/UserScript==

const threadTitle = document.querySelector("#content > div > h2 > a:nth-child(2)").nextSibling.nodeValue

function getHref(title) {
    return `https://gazellegames.net/torrents.php?artistname=&action=advanced&groupname=${encodeURIComponent(title)}&filter_cat%5B1%5D=1`
}

if (/GOTY \d+ (?:Nomination|Voting) Thread/.test(threadTitle)) {
    const posts = document.querySelectorAll('table.forum_post div[id^=content]')

    if (threadTitle.includes('Nomination')) {
        for (const post of posts) {
            const firstChild = post.firstChild
            const title = firstChild.nodeValue.trim()
            const a = document.createElement('a')
            a.href = getHref(title)
            a.textContent = title
            a.target = '_blank'
            firstChild.replaceWith(a)
        }
    } else {
        for (const post of posts) {
            let lastWasBr = false

            for (const child of post.childNodes) {
                if (child.nodeName === 'BR') {
                    if (lastWasBr) break
                    lastWasBr = true
                    continue
                }

                lastWasBr = false
                const val = child.nodeValue?.trim()
                const exec = /(.*?): ?(.*)/.exec(val)
                if (!exec) continue

                const span = document.createElement('span')
                span.innerHTML = `${exec[1]}: <a href=${getHref(exec[2])} target="_blank">${exec[2]}</a>`
                child.replaceWith(span)
            }
        }
    }
}