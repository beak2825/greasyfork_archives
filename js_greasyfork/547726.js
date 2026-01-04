// ==UserScript==
// @name         Youtube - Easy "Not interested" recommended videos (on hover)
// @namespace    vm-youtube-quick-feedback
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @version      1.1
// @author       koza.dev
// @description  Easily click "Not interested" on Youtube homepage recommended videos by hovering - CTRL for "Not interested", ALT for "Don't recommend channel" and SHIFT+CTRL for "Not interested because already watched"
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547726/Youtube%20-%20Easy%20%22Not%20interested%22%20recommended%20videos%20%28on%20hover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547726/Youtube%20-%20Easy%20%22Not%20interested%22%20recommended%20videos%20%28on%20hover%29.meta.js
// ==/UserScript==

(function () {
    'use strict'

    let currentCard = null
    let processedCards = new WeakSet()
    let isProcessing = false

    function isHome() {
        return location.pathname === '/'
    }

    console.log('[YT] Script started - Homepage only')

    document.addEventListener(
        'mousemove',
        e => {
            if (!isHome()) {
                currentCard = null
                return
            }
            const card = e.target.closest('ytd-rich-item-renderer')
            if (card && card !== currentCard) {
                currentCard = card
            }
        },
        { passive: true }
    )

    document.addEventListener('keydown', e => {
        if (!isHome()) return
        if (isProcessing || !currentCard || processedCards.has(currentCard)) return

        let action = null

        if (e.shiftKey && e.ctrlKey) {
            action = 'already-seen'
            console.log('[YT] Shift+Ctrl: Starting already-seen flow')
        } else if (e.key === 'Control' && !e.shiftKey) {
            action = 'not-interested'
        } else if (e.key === 'Alt') {
            action = 'dont-recommend'
            e.preventDefault()
        }

        if (action) {
            processedCards.add(currentCard)
            handleAction(action)
        }
    })

    document.addEventListener('keyup', e => {
        if (!isHome()) return
        if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
            processedCards = new WeakSet()
        }
    })

    // Reset state when navigating away from homepage
    document.addEventListener('yt-navigate-finish', () => {
        if (!isHome()) {
            currentCard = null
            processedCards = new WeakSet()
            isProcessing = false
        }
    })

    async function handleAction(action) {
        if (!isHome()) return
        isProcessing = true
        console.log('[YT] Starting action:', action)

        try {
            if (!currentCard) return

            const menuButton = findMenuButton(currentCard)
            if (!menuButton) return

            let dropdown = null
            for (let attempt = 0; attempt < 3 && !dropdown; attempt++) {
                menuButton.click()
                dropdown = await waitForDropdown(2000)
                if (!dropdown) await sleep(300)
            }

            if (!dropdown) return

            await processDropdown(dropdown, action)
        } catch (error) {
            console.error('[YT] Error:', error)
        } finally {
            isProcessing = false
        }
    }

    function findMenuButton(card) {
        const selectors = [
            'button[aria-label*="More actions"]',
            'button[aria-label*="More"]',
            '.yt-lockup-metadata-view-model__menu-button button',
            'button svg[viewBox="0 0 24 24"] path[d*="1.5 1.5"]'
        ]

        for (const selector of selectors) {
            const button = card.querySelector(selector)
            if (button) return button
        }
        return null
    }

    async function waitForDropdown(timeout = 2000) {
        const startTime = Date.now()

        while (Date.now() - startTime < timeout) {
            const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown')

            for (const dropdown of dropdowns) {
                const rect = dropdown.getBoundingClientRect()
                if (rect.width > 10 && rect.height > 10) {
                    const items = dropdown.querySelectorAll(
                        'yt-list-item-view-model[role="menuitem"]'
                    )
                    if (items.length > 0) {
                        return dropdown
                    }
                }
            }
            await sleep(50)
        }
        return null
    }

    async function processDropdown(dropdown, action) {
        await sleep(100)

        const items = dropdown.querySelectorAll(
            'yt-list-item-view-model[role="menuitem"]'
        )

        const targetAction = action === 'already-seen' ? 'not-interested' : action
        const targetItem = findMenuItem(items, targetAction)

        if (targetItem) {
            const clickTarget =
                targetItem.querySelector('.yt-list-item-view-model__container') ||
                targetItem
            clickTarget.click()

            if (action === 'already-seen') {
                console.log('[YT] Starting advanced flow...')
                await handleAlreadySeenFlow()
            }
        } else {
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
            )
        }
    }

    async function handleAlreadySeenFlow() {
        try {
            console.log('[YT] Step 1: Looking for banner...')
            const tellUsWhyButton = await waitForTellUsWhyButton(8000)
            if (!tellUsWhyButton) {
                console.log('[YT] Failed to find "Tell us why" button')
                return
            }

            console.log('[YT] Step 2: Looking for reason dialog...')
            const dialogSuccess = await waitAndSelectAlreadyWatched(5000)
            if (!dialogSuccess) {
                console.log('[YT] Failed to select "already watched"')
                return
            }

            console.log('[YT] Step 3: Submitting...')
            await submitReasonForm()

            console.log('[YT] Already seen flow completed!')
        } catch (error) {
            console.error('[YT] Error in already seen flow:', error)
        }
    }

    async function waitForTellUsWhyButton(timeout = 8000) {
        const startTime = Date.now()

        while (Date.now() - startTime < timeout) {
            const banners = document.querySelectorAll(
                'notification-multi-action-renderer'
            )

            for (const banner of banners) {
                const rect = banner.getBoundingClientRect()
                if (rect.width > 0 && rect.height > 0) {
                    const buttonContainer = banner.querySelector(
                        '.ytNotificationMultiActionRendererButtonContainer'
                    )
                    if (buttonContainer) {
                        const buttonModels =
                            buttonContainer.querySelectorAll('button-view-model')

                        for (const buttonModel of buttonModels) {
                            const button = buttonModel.querySelector('button')
                            const textSpan = button?.querySelector(
                                '.yt-core-attributed-string[role="text"]'
                            )

                            if (textSpan) {
                                const text = textSpan.textContent.trim()
                                if (text.toLowerCase().includes('tell us why')) {
                                    button.focus()
                                    await sleep(100)
                                    button.click()
                                    await sleep(500)
                                    const dialog = document.querySelector(
                                        'tp-yt-paper-dialog ytd-dismissal-follow-up-renderer'
                                    )
                                    if (dialog) return true
                                }
                            }
                        }
                    }
                }
            }
            await sleep(300)
        }
        return false
    }

    async function waitAndSelectAlreadyWatched(timeout = 5000) {
        const startTime = Date.now()

        while (Date.now() - startTime < timeout) {
            const dialog = document.querySelector(
                'tp-yt-paper-dialog ytd-dismissal-follow-up-renderer'
            )

            if (dialog && dialog.getBoundingClientRect().width > 0) {
                const checkboxContainers = dialog.querySelectorAll(
                    'ytd-dismissal-reason-text-renderer'
                )

                for (const container of checkboxContainers) {
                    const text = container.textContent.toLowerCase()
                    if (
                        text.includes('already watched') ||
                        text.includes('already seen') ||
                        text.includes('watched the video')
                    ) {
                        const checkbox = container.querySelector(
                            'tp-yt-paper-checkbox'
                        )
                        if (checkbox) {
                            checkbox.click()
                            await sleep(500)
                            return true
                        }
                    }
                }

                const firstCheckbox = dialog.querySelector('tp-yt-paper-checkbox')
                if (firstCheckbox) {
                    firstCheckbox.click()
                    await sleep(500)
                    return true
                }
            }
            await sleep(200)
        }
        return false
    }

    async function submitReasonForm() {
        await sleep(700)
        const submitBtn = document.querySelector('#submit button:not([disabled])')
        if (submitBtn) {
            submitBtn.click()
        }
    }

    function findMenuItem(items, action) {
        for (const item of items) {
            const text = item.textContent.toLowerCase().trim()

            if (action === 'not-interested' && text.includes('not interested')) {
                return item
            }

            if (
                action === 'dont-recommend' &&
                (text.includes("don't recommend") ||
                    text.includes('dont recommend') ||
                    (text.includes('recommend') && text.includes('channel')))
            ) {
                return item
            }
        }
        return null
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms))
    }
})()