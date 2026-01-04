// ==UserScript==
// @name         Disable YouTube HDR
// @namespace    socuul.disable_youtube_hdr
// @version      1.0.1
// @description  Allows HDR to be disabled in video settings
// @author       SoCuul
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556537/Disable%20YouTube%20HDR.user.js
// @updateURL https://update.greasyfork.org/scripts/556537/Disable%20YouTube%20HDR.meta.js
// ==/UserScript==

const hdrToggleClass = '.disable-hdr-toggle'
const customToggleHTML = `
<div class="ytp-menuitem disable-hdr-toggle" role="menuitemcheckbox" aria-checked="false" tabindex="0">
    <div class="ytp-menuitem-icon">
        <svg width="24" height="24" viewBox="0 0 0.72 0.72" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.563 0.105A0.098 0.098 0 0 1 0.66 0.202v0.315a0.098 0.098 0 0 1 -0.098 0.098H0.158A0.098 0.098 0 0 1 0.06 0.518V0.203A0.098 0.098 0 0 1 0.158 0.105zM0.251 0.27a0.019 0.019 0 0 0 -0.019 0.016l0 0.003v0.053H0.188v-0.052l0 -0.003a0.019 0.019 0 0 0 -0.037 0l0 0.003v0.143l0 0.003a0.019 0.019 0 0 0 0.037 0l0 -0.003v-0.052h0.044l0 0.052 0 0.003a0.019 0.019 0 0 0 0.037 0l0 -0.003V0.289l0 -0.003a0.019 0.019 0 0 0 -0.019 -0.016m0.265 0.001H0.469l-0.003 0a0.019 0.019 0 0 0 -0.016 0.016l0 0.003 0 0.142 0 0.003 0.001 0.003c0.005 0.017 0.033 0.017 0.036 -0.003l0 -0.003 0 -0.053H0.51l0.024 0.06 0.001 0.003a0.019 0.019 0 0 0 0.034 -0.014l-0.001 -0.003 -0.022 -0.055a0.054 0.054 0 0 0 -0.026 -0.099zm-0.175 0h-0.022l-0.003 0a0.019 0.019 0 0 0 -0.016 0.015L0.3 0.289v0.142l0 0.003c0.001 0.008 0.007 0.014 0.015 0.016l0.003 0h0.022l0.005 0a0.079 0.079 0 0 0 0.074 -0.074l0 -0.005v-0.022l0 -0.005a0.079 0.079 0 0 0 -0.074 -0.074zm0 0.037c0.021 0 0.039 0.016 0.041 0.037l0 0.004v0.022l0 0.004a0.041 0.041 0 0 1 -0.037 0.037l-0.004 0 -0.004 0v-0.105zm0.146 0h0.028l0.003 0a0.017 0.017 0 0 1 0 0.033l-0.003 0h-0.028z" fill="#ffffff"></path>
        </svg>
    </div>
    <div class="ytp-menuitem-label">Disable HDR</div>
    <div class="ytp-menuitem-content">
        <div class="ytp-menuitem-toggle-checkbox"></div>
    </div>
</div>
`;
const hdrBadgeCSS = `
.hdr-enabled::after {
    width: 24px !important;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjYgNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjIiPjxwYXRoIGQ9Ik04IDV2MUg1VjV6bTAgMFY0aDF2MXptNS0zaC0yVjFoMnptMCAwaDF2MWgtMXptMCAxdjFoLTJWM3ptNSAyaC0xVjJoMXptMC0zVjFoMnYxem0yIDBoMXYzaC0xem0wIDN2MWgtMlY1em00LTEuNWgxVjFoMXY1aC0xVjQuNWgtMXptMCAwaC0xVjZoLTFWMWgxdjEuNWgxek0zIDVoMXYxSDN6bTUtNHYxSDZWMXpNMSA0VjNoMnYxek0wIDVoMXYxSDB6bTEzIDBoMXYxaC0xem0tMyAwaDF2MWgtMXoiIHN0eWxlPSJmaWxsLW9wYWNpdHk6LjY1Ii8+PHBhdGggZD0iTTggNHYxSDVWMGgzdjFINnYzem0wLTNoMXYzSDh6bTUgMmgtMnYyaC0xVjBoNHYyaC0xVjFoLTJ2MWgyem0wIDBoMXYyaC0xem0xMS0uNWgtMVY1aC0xVjBoMXYxLjVoMXptMCAwaDFWMGgxdjVoLTFWMy41aC0xek0xOCA0aC0xVjFoMXptMC0zVjBoMnYxem0yIDBoMXYzaC0xem0wIDN2MWgtMlY0ek0zIDVWM0gxdjJIMFYwaDF2MmgyVjBoMXY1eiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjwvc3ZnPg==) !important;
}
.hdr-disabled::after {
    width: 25px !important;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjkgNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjIiPjxwYXRoIGQ9Ik04IDV2MUg1VjV6bTAgMFY0aDF2MXptNS0zaDF2MWgtMXptMCAwaC0yVjFoMnptMCAxdjFoLTJWM3pNMyA1aDF2MUgzem01LTR2MUg2VjF6TTEgNFYzaDJ2MXpNMCA1aDF2MUgwem0xMyAwaDF2MWgtMXptLTMgMGgxdjFoLTF6IiBzdHlsZT0iZmlsbC1vcGFjaXR5Oi42NSIvPjxwYXRoIGQ9Ik04IDR2MUg1VjBoM3YxSDZ2M3ptMC0zaDF2M0g4em01IDJoLTJ2MmgtMVYwaDR2MmgtMVYxaC0ydjFoMnptMCAwaDF2MmgtMXpNMyA1VjNIMXYySDBWMGgxdjJoMlYwaDF2NXoiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNMTcgNGgtMVYxaDF6bTAtM1YwaDJ2MXptMiAwaDF2M2gtMXptMCAzdjFoLTJWNHptMy0xdjJoLTFWMGgzdjFoLTJ2MWgydjF6bTQgMHYyaC0xVjBoM3YxaC0ydjFoMnYxeiIgc3R5bGU9ImZpbGwtb3BhY2l0eTouNjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMSkiLz48cGF0aCBkPSJNMTcgNGgtMVYxaDF6bTAtM1YwaDJ2MXptMiAwaDF2M2gtMXptMCAzdjFoLTJWNHptMy0xdjJoLTFWMGgzdjFoLTJ2MWgydjF6bTQgMHYyaC0xVjBoM3YxaC0ydjFoMnYxeiIgc3R5bGU9ImZpbGw6I2ZmZiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSkiLz48L3N2Zz4=) !important;
}
.hdr-enabled-fullscreen::after {
    content: "HDR ON" !important;
}
.hdr-disabled-fullscreen::after {
    content: "HDR OFF" !important;
}
`

function onClassChange(node, callback) {
    // credit: https://www.seanmcp.com/articles/listen-for-class-change-in-javascript/
    let lastClassString = node.classList.toString();

    const mutationObserver = new MutationObserver((mutationList) => {
        for (const item of mutationList) {
            if (item.attributeName === "class") {
                const classString = node.classList.toString()
                if (classString !== lastClassString) {
                    callback(mutationObserver)
                    lastClassString = classString
                    break
                }
            }
        }
    });

    mutationObserver.observe(node, { attributes: true })

    return mutationObserver
}

function isHDR () {
    return Array
        .from(document.querySelectorAll('.ytp-menu-label-secondary'))
        ?.some(el => el.innerText.toLowerCase().includes('hdr'))
}

function handleToggleClick (e) {
    const toggleEl = document.querySelector('.disable-hdr-toggle')
    if (!toggleEl) return

    // Update toggle state
    const newState = toggleEl.getAttribute('aria-checked') === "true" ? false : true
    toggleEl.setAttribute('aria-checked', newState)

    // Set player brightness
    const playerEl = document.querySelector('ytd-player')
    if (playerEl) {
        playerEl.style = newState ? 'filter: brightness(0.9999999);' : ''
    }
}

(function() {

    GM_addStyle(hdrBadgeCSS)

    const observerOptions = { subtree: true, childList: true }
    const mObserver = new MutationObserver(function() {

        const settingsMenuEl = document.querySelector('.ytp-popup.ytp-settings-menu')
        const menuItemsParentEl = document.querySelector('.ytp-panel-menu')

        // Attribute changes when settings menu opened
        //const beingOpened = settingsMenuEl?.getAttribute('aria-hidden') === "true"
        if (!menuItemsParentEl || !menuItemsParentEl.children.length) return

        // Only show toggle when HDR available
        if (!isHDR()) {
            document.querySelector(hdrToggleClass)?.remove()
            return
        }

        // Check if disable HDR toggle was already added
        if (document.querySelector(hdrToggleClass)) return

        // Place custom toggle at the bottom of video settings menu
        menuItemsParentEl.lastElementChild.insertAdjacentHTML('afterend', customToggleHTML)

        const toggleEl = document.querySelector(hdrToggleClass)
        toggleEl.addEventListener('click', handleToggleClick)

        // Disable HDR filter by default
        const playerEl = document.querySelector('ytd-player')
        playerEl.style = ''

    })

    mObserver.observe(document, observerOptions)

})();