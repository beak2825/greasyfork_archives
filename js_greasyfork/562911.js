// ==UserScript==
// @name         book view history
// @version      5
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @exclude      /^https?:\/\/[^\/]*livereload.net\/files\/ffopen\/index\.html$/
// @exclude      /^https?:\/\/[^\/]*stackblitz.com/
// @exclude      /^https?:\/\/[^\/]*webcontainer.io/
// @exclude      /^https?:\/\/[^\/]*regexr.com/
// @exclude      /^https?:\/\/[^\/]*regex101.com/
// @exclude      *://*/*.mjs
// @exclude      *://*/*.js
// @exclude      *://*/*.css
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @require https://update.greasyfork.org/scripts/491829/1356221/tampermonkey%20storage%20proxy.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        window.close
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/562911/book%20view%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/562911/book%20view%20history.meta.js
// ==/UserScript==

;(async () => {
  const storage = new storageproxy()
  const sp = new storageproxy("settings").get()
  sp.alertOnLoad ??= 0
  sp.alertOnFirstFocus ??= 1
  sp.recolorLinksInsteadOfRemoving ??= 1
  GM_registerMenuCommand(
    "Alert on Page Load: " + !!sp.alertOnLoad,
    () => {
      sp.alertOnLoad = !sp.alertOnLoad
    }
  )
  GM_registerMenuCommand(
    "Alert on First Focus: " + !!sp.alertOnFirstFocus,
    () => {
      sp.alertOnFirstFocus = !sp.alertOnFirstFocus
    }
  )
  GM_registerMenuCommand(
    "Recolor Links Instead of Removing: " +
      !!sp.recolorLinksInsteadOfRemoving,
    () => {
      sp.recolorLinksInsteadOfRemoving =
        !sp.recolorLinksInsteadOfRemoving
    }
  )
  const a = loadlib("allfuncs")
  unsafeWindow.z = storage
  var urlmatches = [
    /royalroad\.com\/fiction\/(?!search)/,
    /scribblehub\.com\/series\//,
    /novelupdates\.com\/series\//,
    /wtr-lab\.com\/en\/serie-/,
    /wuxia\.blog\/book\//,
    /wuxia\.click\/novel\//,
    /lncrawler\.monster\/novel\//,
    /gamebanana\.com\/mods\//,
    /myanimelist.net\/anime\//,
    /lnmtl.com\/novel\//,
    /chinawuxia.com\/\/\/(?:\/$)?/,
  ]
  const urlMatchSet = new Set(urlmatches.map((regex) => regex.source))
  const loc = location.href
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "")
    .replace("http://", "https://")
  const isMatchedUrl = [...urlMatchSet].some((pattern) =>
    new RegExp(pattern).test(loc)
  )
  if (isMatchedUrl) {
    warn(loc)
    handleHistory(loc)
  } else {
    // if (loc in history && history[loc]?.autoclose) {
    //   alert(history[loc]?.autoclose)
    //   // window.close()
    // }
    warn("failed", loc)
  }
  function formatTimeDiffHuman(ms) {
    const units = [
      { label: "year", value: 1000 * 60 * 60 * 24 * 365 },
      { label: "week", value: 1000 * 60 * 60 * 24 * 7 },
      { label: "day", value: 1000 * 60 * 60 * 24 },
      { label: "minute", value: 1000 * 60 },
    ]

    return units
      .map((u) => {
        const amount = Math.floor(ms / u.value)
        ms %= u.value
        return amount ?
            `${amount} ${u.label}${amount > 1 ? "s" : ""}`
          : null
      })
      .filter(Boolean)
      .join(", ")
  }
  function getNumPost(n) {
    if (n % 100 >= 11 && n % 100 <= 13) {
      return "th"
    }

    switch (n % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  function handleHistory(loc) {
    if (GM_getValue(loc)) {
      var [lastDate, visits] = GM_getValue(loc).split(" ")
      visits = Number(visits)
      visits += 1
      var timeDif = Date.now() - lastDate
      GM_setValue(loc, Date.now() + " " + visits)
      const timeStr = formatTimeDiffHuman(timeDif)
      if (sp.alertOnLoad)
        alert(
          `url in history: last visited ${timeStr ? `${timeStr} ago` : "just now"} - ${visits}${getNumPost(visits)} visit `
        )
      var listener = a.listen(window, "focus", function () {
        //alert(timesencelastvisit)
        a.unlisten(listener)
        if (sp.alertOnFirstFocus)
          alert(
            `url in history: last visited ${timeStr ? `${timeStr} ago` : "just now"} - ${visits}${getNumPost(visits)} visit `
          )
      })
    } else {
      GM_setValue(loc, Date.now() + " " + 1)
    }
  }

  const linkObserver = new MutationObserver((mutations) => {
    linkObserver.disconnect()
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const links = node.querySelectorAll("a")
          for (const link of links) {
            processLink(link)
          }
        }
      }
    }
    watch()
  })

  await a.bodyload()
  const links = document.body.querySelectorAll("a")
  for (const link of links) {
    processLink(link)
  }
  watch()

  function processLink(elem) {
    let eloc = elem.href
    if (!eloc.match(/^https?:\/\//)) {
      eloc = new URL(eloc, unsafeWindow.location.origin).href
    }
    eloc = eloc
      .replace(/[?#].*$/, "")
      .replace(/\/$/, "")
      .replace("http://", "https://")
    if (GM_getValue(eloc)) {
      if (sp.recolorLinksInsteadOfRemoving) {
        elem.style.color = "red"
      } else {
        elem.remove()
      }
    }
  }
  setTimeout(() => {
    linkObserver.disconnect()
    document.querySelectorAll("a").forEach(processLink)
    watch()
  }, 1000)

  function watch() {
    linkObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})()
