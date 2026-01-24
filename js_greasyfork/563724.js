// ==UserScript==
// @name         MPP auto-refresh connection
// @version      1.0.0 (beta test)
// @description  small userscript that refreshes the page automatically if connecting to mpp takes too long
// @author       ccjt
// @match        *://*/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1459137
// @downloadURL https://update.greasyfork.org/scripts/563724/MPP%20auto-refresh%20connection.user.js
// @updateURL https://update.greasyfork.org/scripts/563724/MPP%20auto-refresh%20connection.meta.js
// ==/UserScript==

let refreshTimeout = 5e3 // adjust as needed, in milliseconds (5e3 = 5000)
if (typeof MPP !== 'undefined' && typeof MPP === 'object') {
    let connected
    let connectionOpened = null
    MPP.client.ws.onopen = () => {
        // .startsWith because of url formatting quirkiness
        if (!MPP.client.ws.url.startsWith('wss://mppclone.com')) return
        connectionOpened = Date.now()

        function connectedCheck() {
            if (Date.now() - connectionOpened > refreshTimeout && !MPP.client.isConnected()) {
                let failedDiv = document.createElement('div')
                failedDiv.style.cssText = `
                width: 100vw;
                height: 100vh;
                position: fixed;
                top: 0;
                left: 0;
                background-color: #000a;
                backdrop-filter: saturate(150%) blur(10px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
                opacity: 0%;
                transition: opacity .5s ease;
                `
                document.body.appendChild(failedDiv)
                requestAnimationFrame(()=>{
                    let i = 2
                    let failedText = document.createElement('a')
                    failedText.textContent = `connection timed out (${refreshTimeout / 1e3}s), refreshing in ${i}s`
                    failedDiv.appendChild(failedText)
                    failedDiv.style.opacity = '100%'
                    setInterval(()=>{
                        i--
                        failedText.textContent = `connection failed, refreshing in ${i}s`
                        if (i <= 0) window.location.reload()
                    }, 1e3)
                })
                return
            }
            requestAnimationFrame(connectedCheck())
        }
        connectedCheck()
    }
}
