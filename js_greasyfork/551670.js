// ==UserScript==
// @name        哔哩哔哩直播间隐身
// @namespace   https://space.bilibili.com/9970028
// @version     2.4
// @description 适用于哔哩哔哩平台，取消进入直播间提示以及隐藏在线榜。
// @author      9970028
// @match       https://live.bilibili.com/*
// @icon        https://www.bilibili.com/favicon.ico
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/551670/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%9A%90%E8%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/551670/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%9A%90%E8%BA%AB.meta.js
// ==/UserScript==

(function() {
    this.roomid = window.location.pathname.split("/")[1].split("?")[0]
    this.whitelist = GM_getValue("bilibili_live_hidden_whitelist", [])
    this.hiddenMode = !this.whitelist.includes(this.roomid)

    if(isNaN(parseInt(this.roomid))) return

    let tip_hidden = "对当前直播间隐身中（点击切换）"
    let tip_appear = "对当前直播间不隐身（点击切换）"
    GM_registerMenuCommand(this.hiddenMode ? tip_hidden : tip_appear, () => {
        if(this.hiddenMode) this.whitelist.push(this.roomid)
        else this.whitelist.splice(this.whitelist.indexOf(this.roomid), 1)
        GM_setValue("bilibili_live_hidden_whitelist", this.whitelist)
        window.location.reload()
    })

    function int2Uint32ArrayBufferReverse(v){
        let u = new Uint32Array(1)
        u[0] = v
        return new Uint8Array(u.buffer).reverse().buffer
    }

    function merge2ArrayBuffer(f, s){
        let b = new ArrayBuffer(f.byteLength + s.byteLength)
        let u = new Uint8Array(b)
        u.set(new Uint8Array(f), 0)
        u.set(new Uint8Array(s), f.byteLength)
        return b
    }

    function mergeArrayBuffers(){
        let b = arguments[0]
        for(let i = 1; i < arguments.length; i++){
            b = merge2ArrayBuffer(b, arguments[i])
        }
        return b
    }
    
    function reviseName(e, c = 0){
        let xhr = new XMLHttpRequest()
        xhr.open("GET", _api)
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200 && JSON.parse(xhr.responseText).code === 0){
                let finished = false
                JSON.parse(xhr.responseText).data.room.reverse().some(i => {
                    if(e.getAttribute("data-ct") === i.check_info.ct){
                        e.setAttribute(e.getAttributeNames()[1], i.nickname)
                        e.setAttribute(e.getAttributeNames()[5], i.uid)
                        e.getElementsByClassName("user-name")[0].innerHTML = `${i.nickname} : `
                        finished = true
                        return true
                    }
                })
                if(!finished) setTimeout(() => reviseName(e, ++c), 1000)
            }
        }
        if(c < 5 && _api) xhr.send()
    }

    let _fetch = unsafeWindow.fetch
    unsafeWindow.fetch = function() {
        if(arguments[0].indexOf("getInfoByUser") > -1){
            arguments[0] = arguments[0].replace(this.roomid, "27227")
        }
        else if(this.hiddenMode && arguments[0].indexOf("getDanmuInfo") > -1){
            arguments[1].credentials = "omit"
        }
        return _fetch(...arguments)
    }

    if(!this.hiddenMode) return

    let _api = null
    let _xhr = unsafeWindow.XMLHttpRequest
    unsafeWindow.XMLHttpRequest = function(){
        let xhr = new _xhr()
        let _open = xhr.open
        xhr.open = function(){
            if(arguments[1].includes("history") && !arguments[1].includes("|")) _api = arguments[1]
            return _open.call(this, ...arguments)
        }
        return xhr
    }

    let _websocket = unsafeWindow.WebSocket
    unsafeWindow.WebSocket = function() {
        let _socket = new _websocket(...arguments)
        let _send = _socket.send
        _socket.send = function(){
            if(new Uint8Array(arguments[0])[11] === 7){
                let data = JSON.parse(new TextDecoder("utf-8").decode(arguments[0].slice(16)))
                data.uid = 0
                let buffer = new TextEncoder().encode(JSON.stringify(data)).buffer
                arguments[0] = mergeArrayBuffers(int2Uint32ArrayBufferReverse(buffer.byteLength + 16), arguments[0].slice(4, 16), buffer)
            }
            return _send.call(this, arguments[0])
        }
        new MutationObserver(function(){
            arguments[0].forEach(m => m.addedNodes.forEach(e => {
                if(e.classList.value.includes("danmaku")){
                    if(e.getAttribute("data-ct").length === 0) e.style.display ="none"
                    if(e.getAttribute(e.getAttributeNames()[5]) == 0) reviseName(e)
                }
            }))
        }).observe(document.getElementById("chat-items"), { childList: true })
        return _socket
    }
    unsafeWindow.WebSocket.prototype = _websocket.prototype

    GM_addStyle(".privacy-dialog{ display: none !important; }")
})();