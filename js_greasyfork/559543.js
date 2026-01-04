// ==UserScript==
// @name        Youtube thumb links
// @namespace   yt_fuckery
// @match       https://www.youtube.com/*
// @grant       none
// @version     2.1
// @author      noccu
// @description Add thumbnail link to videos. Check the … menu.
// @downloadURL https://update.greasyfork.org/scripts/559543/Youtube%20thumb%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/559543/Youtube%20thumb%20links.meta.js
// ==/UserScript==

const [PREVIEW_BUTTON, PREVIEW_LINK] = createPreviewLink()
const [CURRENTVID_BUTTON, CURRENTVID_LINK] = createCurrentVideoLink()
var PREVIEW_ADDED = false
var CURRENTVID_ADDED = false


function getPreviewThumbUrl(el) {
    thumbEl = el.querySelector("img.ytCoreImageHost")
    return thumbEl.src.split("?")[0].replace("hqdefault", "maxresdefault")
}

// Small thumbnails in a list/feed.
function createPreviewLink() {
    const btn = document.createElement("yt-list-item-view-model")
    btn.style.color = "inherit"
    btn.className = "yt-list-item-view-model yt-list-item-view-model__container"
    const link = document.createElement("a")
    link.textContent = "Thumbnail"
    link.className = "yt-list-item-view-model__title"
    btn.append(link)
    return [btn, link]
}

// Full videos.
function createCurrentVideoLink() {
    // Adding to "above the fold" UI directly: #flexible-item-buttons
    const btn = document.createElement("ytd-menu-service-item-renderer")
    btn.className = "style-scope ytd-menu-popup-renderer"
    const link = document.createElement("a")
    link.textContent = "Thumbnail"
    link.style.color = "inherit"
    // Need to let it initialize internal structure first, append link on user interaction.
    return [btn, link]
}

function addPreviewBtn() {
    if (PREVIEW_ADDED) return
    document.querySelector("yt-download-list-item-view-model").before(PREVIEW_BUTTON)
    PREVIEW_ADDED = true
}

function addCurrentVidBtn() {
    if (CURRENTVID_ADDED) return
    document.querySelector("tp-yt-paper-listbox#items").append(CURRENTVID_BUTTON)
    // Append link now that menu item is inited.
    CURRENTVID_BUTTON.querySelector("tp-yt-paper-item").append(CURRENTVID_LINK)
    CURRENTVID_ADDED = true
}

// Try to add a thumb link to feed menus.
function updatePreviewUrl(e) {
    const videoRoot = e.target.closest("div.yt-lockup-view-model")
    if (videoRoot) {
        addPreviewBtn()
        PREVIEW_LINK.href = getPreviewThumbUrl(videoRoot)
    }
}

// Try to add a thumb link to the current video's menu.
function updateCurrentVidUrl() {
    if (location.pathname != "/watch") return
    // if (!e.target.closest("#above-the-fold")) return
    addCurrentVidBtn()
    const params = new URLSearchParams(location.search)
    const vidId = params.get("v")
    CURRENTVID_LINK.href = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`
}

function tryAddButtons(e) {
    if (e.target.tagName != "DIV" || !e.target.className.endsWith("fill")) {
        return
    }
    updateCurrentVidUrl()
    updatePreviewUrl(e)
}
document.body.addEventListener("click", tryAddButtons)
