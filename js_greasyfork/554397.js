// ==UserScript==
// @name         bonk.io Mobile Mod
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  This script makes bonk.io playable on mobile.
// @author       kitaesq
// @match        https://bonk.io/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554397/bonkio%20Mobile%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/554397/bonkio%20Mobile%20Mod.meta.js
// ==/UserScript==
if (!window.kitaes) window.kitaes = {}
if (!window.kitaes.requestIntercept) {
    window.kitaes.requestIntercept = async () => {
        const send = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function(body){
            this.addEventListener("load", () => {
                const event = new Event("kitaes-request")
                event.body = body
                event.request = this
                window.dispatchEvent(event)
            })
            return send.apply(this, [body]);
        };
        console.log("Request interceptor loaded")
    }
    window.kitaes.requestIntercept()
}
if (!window.kitaes.fullscreen) {window.kitaes.fullscreen = async () => {
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
}
if (!window.kitaes.mobile) {window.kitaes.mobile = async () => {
    console.log("loading mobile mod...")
    top.document.head.innerHTML += '<meta name="viewport" content="height=600px, initial-scale=0.5, maximum-scale=0.5">'
    if ("virtualKeyboard" in navigator) {
        navigator.virtualKeyboard.overlaysContent = true;
    }
    const fstyle = document.createElement("style")
    fstyle.textContent =
`#ingamechatbox{
bottom: 210px !important;
}`
    document.head.append(fstyle)
    const buttonContainer = document.createElement("div")
    Object.assign(buttonContainer.style, {
        position: "fixed",
        bottom: "25px",
        right: "25px",
        width: "225px",
        height: "225px",
        display: "flex",
        flexWrap: "wrap",
        lineHeight: "70px",
        fontSize: "40px"
    })
    const keybinds = {enter: 13}
    async function parseControls(base64){
        const x = "data:image/png;base64," + base64
        const arrayBuffer = await (await fetch(x)).arrayBuffer()
        const view = new DataView(arrayBuffer);
        keybinds.up = view.getUint16(2)
        keybinds.down = view.getUint16(6)
        keybinds.left = view.getUint16(10)
        keybinds.right = view.getUint16(14)
        keybinds.heavy = view.getUint16(18)
        keybinds.special = view.getUint16(22)
    }
    window.addEventListener("kitaes-request", async (e) => {
        console.log(e.request.responseURL)
        if (e.request.responseURL === "https://bonk2.io/scripts/account_savecontrols.php"){
            const {controls} = Object.fromEntries(new URLSearchParams(e.body))
            await parseControls(controls)
        }
        if (!(e.request.responseURL === "https://bonk2.io/scripts/login_legacy.php" || e.request.responseURL === "https://bonk2.io/scripts/login_auto.php")) return
        const data = JSON.parse(e.request.responseText)
        await parseControls(data.controls)
    })
    const buttons = [["↖", "↑", "↗"],
                     ["←", " ", "→"],
                     ["↙", "↓", "↘"]]
    const activeDirKeys = {up: false, down: false, left: false, right: false}
    const activeSpecialKeys = {heavy: false, special: false}
    let isActive = false
    function simulateKey(key, down, element) {
        if (down === activeDirKeys[key]) return
        if (!element) element = document
        if (Object.keys(activeDirKeys).indexOf(key) !== -1) activeDirKeys[key] = down
        const event = document.createEvent("HTMLEvents");
	    event.initEvent("key" + (down ? "down" : "up"), true, false);
        event.keyCode = keybinds[key]
        element.dispatchEvent(event);
    }
    function simulateKeys(keys, type) {
        for (const key of keys){
            simulateKey(key, type)
        }
    }
    function releaseAllKeys(){
        for (const a of Object.keys(activeDirKeys)){
            if (!activeDirKeys[a]) continue
            simulateKey(a, false)
        }
    }
    buttonContainer.ontouchstart = (e) => {
        e = e.targetTouches[0]
        const ContainerPos = buttonContainer.getBoundingClientRect()
        const x = e.clientX - ContainerPos.x
        const y = e.clientY - ContainerPos.y
        if      (x < 74)  simulateKey("left", true)
        else if (x > 147) simulateKey("right", true)
        if      (y < 74)  simulateKey("up", true)
        else if (y > 147) simulateKey("down", true)
        isActive = true
        console.log("down")
    }
    oncontextmenu = e => e.preventDefault()
    window.ontouchend = (e) => {
        if (!isActive) return
        isActive = false
        console.log("up")
        if (e.changedTouches[0].target === buttonContainer){
            releaseAllKeys()
            isActive = false
        }
        else if (e.changedTouches[0].target.key){
            simulateKey(e.changedTouches[0].target.key, false)
        }
    }
    const gameOverlay = document.createElement("div")
    gameOverlay.addEventListener('contextmenu', e => e.preventDefault());
    gameOverlay.style.zIndex = 99999
    gameOverlay.style.position = "fixed"
    gamerenderer.append(gameOverlay)
    gameOverlay.append(buttonContainer)
    const bs = {height: "70px", width: "70px", pointerEvents: "none", marginBottom: "5px", marginRight: "5px"}
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (j === 1 && i === 1) {
                const div = document.createElement("div")
                Object.assign(div.style, bs)
                buttonContainer.append(div)
                continue
            }
            const keys = []
            if      (j === 0) keys.push("left")
            else if (j === 2) keys.push("right")
            if      (i === 0) keys.push("up")
            else if (i === 2) keys.push("down")
            const button = document.createElement("div")
            Object.assign(button.style, bs)
            button.keys = keys
            button.textContent = buttons[i][j]
            button.className = "brownButton brownButton_classic buttonShadow"
            buttonContainer.append(button)
        }
    }
    buttonContainer.ontouchmove = (e) => {
        e = e.targetTouches[0]
        const ContainerPos = buttonContainer.getBoundingClientRect()
        const x = e.clientX - ContainerPos.x
        const y = e.clientY - ContainerPos.y
        releaseAllKeys()
        if      (x < 74)  simulateKey("left", true)
        else if (x > 147) simulateKey("right", true)
        if      (y < 74)  simulateKey("up", true)
        else if (y > 147) simulateKey("down", true)
    }
    const list = ["special", "heavy", "enter"]
    const leftStyle = {height: "70px", width: "200px", fontSize: "30px", lineHeight: "70px", textTransform: "capitalize", position: "fixed", left: "30px"}
    for (let i = 0; i < 3; i++){
        const button = document.createElement("div")
        button.className = "brownButton brownButton_classic buttonShadow"
        button.key = list[i]
        button.textContent = button.key
        Object.assign(button.style, leftStyle)
        if (list[i] === "enter"){
            button.textContent = "💬"
            Object.assign(button.style, {left: "unset", right: "260px", bottom: "30px", width: "70px", visibility: "visible"})
            button.onpointerdown = (e) => {
                e.preventDefault()
            }
            button.onclick = () => {
                simulateKey("enter", true, fdocument.activeElement)
            }
            gameOverlay.append(button)
            return
        }
        button.style.bottom = (30 + (i * 100)) + "px"
        button.ontouchstart = (e) => {
            isActive = true
            simulateKey(button.key, true)
        }
        gameOverlay.append(button)
    }
}
window.kitaes.mobile()}