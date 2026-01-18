// ==UserScript==
// @name         YouTube History Quick Delete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a delete button to videos in YouTube history page
// @author       koza.dev
// @match        https://www.youtube.com/feed/history*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563152/YouTube%20History%20Quick%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/563152/YouTube%20History%20Quick%20Delete.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const DELETE_ICON_PATH =
        'M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z'

    const STYLE_ID = 'yt-history-quick-delete-style'
    const PROCESSED_ATTR = 'data-quick-delete-added'

    function addStyles() {
        if (document.getElementById(STYLE_ID)) return
        const style = document.createElement('style')
        style.id = STYLE_ID
        style.textContent = `
            .yt-lockup-metadata-view-model__menu-button {
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }

            .yt-quick-delete-btn {
                background: none;
                border: none;
                color: #aaa;
                cursor: pointer;
                font-size: 30px;
                font-weight: normal;
                line-height: 30px;
                margin-top: 5px;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .yt-quick-delete-btn:hover {
                background-color: rgba(255, 255, 255, 0.15);
                color: #fff;
            }
        `
        document.head.appendChild(style)
    }

    async function deleteVideo(threeDotButton) {
        threeDotButton.click()

        const startTime = Date.now()
        const checkInterval = setInterval(() => {
            const popupContainer = document.querySelector('ytd-popup-container')
            if (!popupContainer) return

            const menuItems = popupContainer.querySelectorAll(
                'yt-list-item-view-model'
            )

            for (const item of menuItems) {
                const svg = item.querySelector('svg path')
                if (svg && svg.getAttribute('d') === DELETE_ICON_PATH) {
                    clearInterval(checkInterval)
                    item.click()
                    return
                }
            }

            if (Date.now() - startTime > 2000) {
                clearInterval(checkInterval)
            }
        }, 50)
    }

    function processRow(row) {
        const menuContainer = row.querySelector(
            '.yt-lockup-metadata-view-model__menu-button'
        )
        const threeDotBtn = menuContainer?.querySelector('button')

        if (!menuContainer || !threeDotBtn || row.hasAttribute(PROCESSED_ATTR))
            return

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'yt-quick-delete-btn'
        deleteBtn.textContent = '×'
        deleteBtn.title = 'Remove from history'

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            deleteVideo(threeDotBtn)

            row.style.opacity = '0.3'
            row.style.pointerEvents = 'none'
        })

        menuContainer.appendChild(deleteBtn)
        row.setAttribute(PROCESSED_ATTR, 'true')
    }

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const rows = document.querySelectorAll(
                        'yt-lockup-view-model:not([data-quick-delete-added])'
                    )
                    rows.forEach(processRow)
                }
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        const rows = document.querySelectorAll(
            'yt-lockup-view-model:not([data-quick-delete-added])'
        )
        rows.forEach(processRow)
    }

    addStyles()
    initObserver()
})()