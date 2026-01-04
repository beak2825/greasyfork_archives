// ==UserScript==
// @name         Data login
// @namespace    http://tampermonkey.net/
// @version      2025-11-30
// @description  This script lets you log in to a bonk.io account without using a password.
// @author       kitaesq
// @match        https://bonk.io/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557672/Data%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/557672/Data%20login.meta.js
// ==/UserScript==
if (!window.kitaes) window.kitaes = {}
if (!window.kitaes.requestInterceptNoSend) {
    window.kitaes.requestInterceptNoSend = () => {
        const send = XMLHttpRequest.prototype.send
        this.preventDefault = false
        XMLHttpRequest.prototype.send = function(body){
            const event = new Event("kitaes-request-nosend")
            event.request = this
            event.preventDefault = function() {this.preventDefault = true}
            window.dispatchEvent(event)
            if (!this.preventDefault) send.apply(this, [body])
        };
        console.log("Request interceptor (no send) loaded")
    }
    window.kitaes.requestInterceptNoSend()
}
(function() {
    registerwindow.style.margin = "0"
    loginwindow.style.margin = "0"
    const datawindow = document.createElement("div")
    Object.assign(datawindow.style, {
        top: "280px",
        position: "absolute",
        width: "100%",
        borderRadius: "7px",
        height: "80px",
        backgroundColor: "var(--bonk_theme_primary_background, --greyWindowBGColor)"
    })
    datawindow.className = "windowShadow"
    const topbar = document.createElement("div")
    topbar.className = "windowTopBar windowTopBar_classic"
    topbar.textContent = "Data login"
    datawindow.append(topbar)
    const input = document.createElement("input")
    Object.assign(input.style, {
        bottom: "7px",
        left: "7px",
        width: "calc(100% - 150px)",
        margin: "0",
        backgroundColor: "var(--bonk_theme_secondary_background, #fdfdfd)",
        color: "var(--bonk_theme_primary_text, #4e4e4e)",
        borderColor: "transparent"
    })
    input.className = "loginwindow_field fieldShadow"
    datawindow.append(input)
    const submit = document.createElement("div")
    submit.className = "brownButton brownButton_classic buttonShadow thickerText"
    Object.assign(submit.style, {
        position: "absolute",
        bottom: "7px",
        right: "7px",
        width: "129px",
        height: "31px",
        lineHeight: "31px"
    })
    submit.textContent = "Log in"
    submit.onclick = () => {
        addEventListener("kitaes-request-nosend", (e) => {
            e.preventDefault()
            const headers = `content-type: application/json`
            const data = input.value
            Object.defineProperty(e.request, "response", {
                get: function() {
                    return data
                },
            });
            Object.defineProperty(e.request, "responseText", {
                get: function() {
                    return data
                },
            });
            Object.defineProperty(e.request, "responseURL", {
                get: function() {
                    return "https://bonk2.io/scripts/login_legacy.php"
                },
            });
            Object.defineProperty(e.request, "readyState", {
                get: function() {
                    return 4
                },
            });
            Object.defineProperty(e.request, "status", {
                get: function() {
                    return 200
                },
            });
            Object.defineProperty(e.request, "getAllResponseHeaders", {
                get: function() {
                    return function(){
                        return headers
                    }
                },
            });
            setTimeout(() => {
            e.request.dispatchEvent(new Event("readystatechange"))
            if (e.request.onreadystatechange) e.request.onreadystatechange()
            e.request.dispatchEvent(new Event("load"))
            if (e.request.onload) e.request.onload()
            console.log("event dispatched", JSON.stringify(e.request))
            }, 0)
        }, {once: true})
        loginwindow_username.value = "pivo"
        loginwindow_password.value = "i love pivo"
        loginwindow_submitbutton.click()
    }
    datawindow.append(submit)
    accountContainer.append(datawindow)
})();