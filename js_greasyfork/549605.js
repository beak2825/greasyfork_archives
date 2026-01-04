// ==UserScript==
// @name         Resizable Diff Sidebar (GitHub PR Files)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @description  Make GitHub PR diff sidebar resizable with a visible drag handle
// @author       Louis Yvelin
// @match        https://github.com/*/*/pull/*/files*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549605/Resizable%20Diff%20Sidebar%20%28GitHub%20PR%20Files%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549605/Resizable%20Diff%20Sidebar%20%28GitHub%20PR%20Files%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const parent = document.querySelector("#diff-layout-component")
    const sidebar = document.querySelector("#diff-layout-component > div.Layout-sidebar.overflow-y-auto.hx_Layout--sidebar.diff-sidebar.position-sticky div")

    if (!parent || !sidebar) return

    const handle = document.createElement("div")
    handle.style.width = "5px"
    handle.style.cursor = "col-resize"
    handle.style.position = "absolute"
    handle.style.top = "0"
    handle.style.bottom = "0"
    handle.style.right = "0"
    handle.style.zIndex = "9999"
    handle.style.background = "rgba(0, 123, 255, 0)"
    handle.style.transition = "background 0.2s ease"

    sidebar.style.position = "relative"
    sidebar.appendChild(handle)

    sidebar.addEventListener("mouseenter", () => {
        if (!isDragging) handle.style.background = "rgba(0, 123, 255, 0.5)"
    })
    sidebar.addEventListener("mouseleave", () => {
        if (!isDragging) handle.style.background = "rgba(0, 123, 255, 0)"
    })

    let isDragging = false

    handle.addEventListener("mousedown", e => {
        e.preventDefault()
        isDragging = true
        document.body.style.userSelect = "none"
        handle.style.background = "rgba(0, 123, 255, 0.9)"
    })

    document.addEventListener("mousemove", e => {
        if (!isDragging) return
        const rect = parent.getBoundingClientRect()
        const newWidth = e.clientX - rect.left
        parent.style.setProperty("--Layout-sidebar-width", `${newWidth}px`)
    })

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false
            document.body.style.userSelect = ""
            handle.style.background = "rgba(0, 123, 255, 0.5)"
        }
    })
})()
