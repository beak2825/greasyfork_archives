// ==UserScript==
// @name         bonk.io Fullscreen Mod
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  This script removes all the junk from bonk.io website and makes the game take up the whole page.
// @author       kitaesq
// @match        https://bonk.io/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553932/bonkio%20Fullscreen%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/553932/bonkio%20Fullscreen%20Mod.meta.js
// ==/UserScript==
if (!window.kitaes) window.kitaes = {}
if (!window.kitaes.findElement){
    window.kitaes.findElement = function(document, selector){return new Promise((res, rej) => {
        let interval = setInterval(() => {
            const el = document.querySelector(selector)
            if (el){
                clearInterval(interval)
                res(el)
            }
        }, 100)
    })}
}
window.kitaes.fullscreen = async () => {
    console.log("[Fullscreen mod] Loading fullscreen mod...")
    const styleElem = document.createElement("style")
    styleElem.textContent =
`body{
    overflow: hidden;
    visibility: hidden;
}
#maingameframe{
    margin: 0 !important;
    position: fixed;
    inset: 0 !important;
    visibility: visible;
}
#theme_container{
    top: 36px;
    visibility: visible;
}`
    top.document.head.append(styleElem)
    const fstyleElem = document.createElement("style")
    fstyleElem.className = "kitaes-fullscreen-style"
    fstyleElem.textContent =
`#bonkiocontainer{
    width: 100% !important;
    height: 100% !important;
    border: none !important;
}
#gamerenderer > canvas, #bgreplay > canvas{
	inset: 0;
	margin: auto;
	position: absolute;
}
#xpbarcontainer{
    top: -4px !important
}
#fullscreen_button{
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABPSURBVEhLYxgFhAAjlAaD/0AAZWIARiCAMsGAWLVMUJpmgOYW4PQ2epAQArj0Dv0gorkFo2DgwWg+IAhobgHOOEAH6HFCrNrRomLYAwYGACfdIBnA7J6WAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 35px;
    left: 0;
    margin: 10px;
    width: 40px;
    height: 40px;
    pointer-events: auto;
}
*{
    touch-action: manipulation;
    user-select: none;
}
#newbonklobby_chat_content *{
    user-select: text;
}`
    document.head.append(fstyleElem)
    console.log("[Fullscreen mod] Style was injected")
    const fullscreenBtn = document.createElement("div")
    fullscreenBtn.id = "fullscreen_button"
    fullscreenBtn.className = "brownButton brownButton_classic buttonShadow"
    let isFullScreen = false
    fullscreenBtn.onclick = () => {
        if (!isFullScreen) {
            document.body.requestFullscreen()
        }
        else{
            document.exitFullscreen()
        }
        isFullScreen = !isFullScreen
    }
    prettymenu.append(fullscreenBtn)
    console.log("[Fullscreen mod] Fullscreen button was added")
    const interval = setInterval(() => {
        if (document.body.lastElementChild.tagName !== "DIV" || document.body.lastElementChild.className) return
        document.body.lastElementChild.style.top = "85px"
        clearInterval(interval)
        console.log("[Fullscreen mod] FPS counter was moved to the bottom")
        console.log("[Fullscreen mod] Fullscreen mod was loaded")
    }, 500)
}
window.kitaes.fullscreen()