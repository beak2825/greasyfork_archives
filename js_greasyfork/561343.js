// ==UserScript==
// @name         海角社区
// @version      1.0.8
// @description  🔥 解锁海角社区全部付费视频（包括短视频,封禁用户视频），去弹窗、去广告、自动展开帖子，不限量观看、下载视频，可复制播放链接
// @namespace    海角社区
// @author       fanqiechaodan
// @match        *://*/videoplay/*
// @match        *://*/post/details/*
// @match        *://*.haijiao.com/*
// @include      *://hj2512*.*/*
// @match        *://*.haijiao999.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.4.14/dist/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@3.2.1/bin/jsencrypt.min.js
// @connect      gqkp.yidajichang.top
// @connect      gqkl.yidajichang.top
// @run-at       document-start
// @antifeature  payment
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561343/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561343/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict'
    let isBarExpanded = true
    let m3u8Link = null
    let hlsInstance = null
    let isPlayerVisible = false
    let isMember = true
    let observer = null
    let isOhterQuestion = false
    let fullUrl = window.location.href
    let isResponsed = true
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    const ec = {
        b64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
        isJSON: (str) => {
            if (typeof str !== 'string' || str.trim() === '') return false
            const trimStr = str.trim()
            if (!(/^\{|\[/.test(trimStr) && /\}|\]$/.test(trimStr))) return false
            try {
                JSON.parse(trimStr)
                return true
            } catch (e) {
                return false
            }
        },
        swaqbt: (string) => {
            string = String(string)
            let bitmap, a, b, c, result = '', i = 0, rest = string.length % 3
            for (; i < string.length - rest;) {
                a = string.charCodeAt(i++)
                b = string.charCodeAt(i++)
                c = string.charCodeAt(i++)
                if (a > 255 || b > 255 || c > 255) return 'Failed to execute swaqbt'
                bitmap = (a << 16) | (b << 8) | c
                result += ec.b64.charAt((bitmap >> 18) & 63) +
                    ec.b64.charAt((bitmap >> 12) & 63) +
                    ec.b64.charAt((bitmap >> 6) & 63) +
                    ec.b64.charAt(bitmap & 63)
            }
            if (rest) {
                a = string.charCodeAt(i++)
                if (a > 255) return 'Failed to execute swaqbt'
                bitmap = a << 16
                result += ec.b64.charAt((bitmap >> 18) & 63)
                if (rest === 2) {
                    b = string.charCodeAt(i++)
                    if (b > 255) return 'Failed to execute swaqbt'
                    bitmap |= b << 8;
                    result += ec.b64.charAt((bitmap >> 12) & 63) + ec.b64.charAt((bitmap >> 6) & 63) + '='
                } else {
                    result += ec.b64.charAt((bitmap >> 12) & 63) + '=='
                }
            }
            return result
        },
        sfweccat: (string) => {
            string = String(string).replace(/[\t\n\f\r ]+/g, '')
            if (!ec.b64re.test(string)) return null
            string += '=='.slice(2 - (string.length & 3))
            let bitmap, result = '', r1, r2, i = 0
            for (; i < string.length;) {
                bitmap = (ec.b64.indexOf(string.charAt(i++)) << 18) |
                    (ec.b64.indexOf(string.charAt(i++)) << 12) |
                    ((r1 = ec.b64.indexOf(string.charAt(i++))) << 6) |
                    (r2 = ec.b64.indexOf(string.charAt(i++)))
                result += r1 === 64 ? String.fromCharCode((bitmap >> 16) & 255) : r2 === 64 ? String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255) : String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255, bitmap & 255)
            }
            return result
        },
        utf8Encode: (str) => unescape(encodeURIComponent(str)),
        utf8Decode: (str) => decodeURIComponent(escape(str))
    }
    const decode = function (s, plus = false) {
        try {
            const maxRecursion = 5
            const recursiveDecode = (currStr, times) => {
                if (times >= maxRecursion) return null
                const decodeRes = ec.sfweccat(currStr)
                if (!decodeRes) return null;
                const transStr = plus ? ec.utf8Decode(decodeRes) : decodeRes
                if (ec.isJSON(transStr)) return JSON.parse(transStr)
                return recursiveDecode(decodeRes, times + 1)
            }
            return recursiveDecode(s, 0);
        } catch (e) {
            return null
        }
    }
    const encode = function (s, plus = false) {
        try {
            let rawStr = typeof s === 'object' ? JSON.stringify(s) : String(s)
            rawStr = plus ? ec.utf8Encode(rawStr) : rawStr
            const firstEncode = ec.swaqbt(rawStr)
            const secondEncode = ec.swaqbt(firstEncode)
            const thirdEncode = ec.swaqbt(secondEncode)
            if ([firstEncode, secondEncode, thirdEncode].some(v => v.startsWith('Failed'))) {
                return s
            }
            return thirdEncode
        } catch (e) {
            return s
        }
    }
    function getVueCurrentUrl() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(window.location.href)
            }, 0)
        })
    }
    function isExitToken() {
        const token = GM_getValue('token')
        return token
    }
    GM_addStyle(`
        * { box-sizing: border-box; }
          body { overflow:auto !important; height:100vh; }
          #custom-vertical-bar { position: fixed; ${isMobile ? 'right: 10px' : 'right:20px'}; top: 50%; transform: translateY(-50%); width: 50px; background-color: #2c3e50; border-radius: 25px; padding: 12px 0; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; align-items: center; z-index: 99999999; transition: all 0.3s ease; }
          #bar-avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #34495e; margin-bottom: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid ${isExitToken() ? '#308ee3' : '#ecf0f2'}; }
          #bar-avatar::after { content: "头像"; color: #ecf0f1; font-size: 8px; text-align: center; }
          #bar-buttons { display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 190px; width: 100%; }
          .bar-function-btn { width: 30px; height: 30px; border-radius: 50%; background-color: #34495e; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; position: relative; }
          .btn-icon { width: 15px; height: 15px; fill: #ecf0f1; stroke: #ecf0f1; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
          #expand-bar-btn { position: fixed; right: 10px; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; border-radius: 50%; background-color: #2c3e50; border: none; cursor: pointer; display: none; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); z-index: 99999999; transition: all 0.3s ease; }
          #expand-bar-btn:hover { background-color: #3498db; transform: translateY(-50%) scale(1.08); box-shadow: 0 2px 6px rgba(52, 152, 219, 0.5); }
          .m3u8-indicator { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; border-radius: 50%; background-color: #4cd964; display: none; z-index: 1; box-shadow: 0 0 4px rgba(76, 217, 100, 0.8); }
          #m3u8-player-window { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; max-width: 100vw; height: 100%; max-height: 100vh; background-color: #000; overflow: hidden!important; z-index: 999999999; display: none; box-shadow: 0 0 30px rgba(0, 0, 0, 0.8); pointer-events: auto; touch-action: none!important; }
          #m3u8-player-mask { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.95); z-index: 999999998; display: none; pointer-events: auto; }
          #m3u8-video-player { width: 100%; height: 100%; object-fit: contain; }
          .no-scroll { overflow:hidden !important; height:100vh !important; }
          #close-player-btn { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.7); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 10; pointer-events: auto; }
          #close-player-btn:hover { background-color: rgba(255, 59, 48, 0.9); }
          #close-player-btn .btn-icon { width: 16px; height: 16px; stroke: #ffffff; fill: none; }
          .collapse-btn-right svg { transform: rotate(180deg); }
          .expand-btn-left svg { transform: rotate(0deg); }
          #modalOverlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 999999998; display: none; pointer-events: auto; }
          #downloadDialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #fff; padding: 10px; border-radius: 8px; font-size: 10px; width: 200px; max-width: 80vw; box-shadow: 0 4px 16px rgba(0,0,0,0.2); cursor: default; display: none; justify-content: center; align-items: center; flex-direction: column; z-index: 999999999; }
          #downloadHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding-bottom: 10px; border-bottom: 1px solid #eee; width: 100%; font-size: 16px; font-weight: 600; color: #333; }
          #downloadLinkAndCopyLink { font-size: 15px; }
          #copyLink, #downloadLink_1, #downloadLink_2 { margin: 10px 0; padding: 8px 12px; cursor: pointer; color: #007bff; border-radius: 4px; transition: background-color 0.2s; }
          #copyLink:hover, #downloadLink_1:hover, #downloadLink_2:hover { background-color: #f5f9ff; }
          .closedBtn { width: 20px; height: 20px; vertical-align: middle; }
          #loginDialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); ${isMobile ? 'width: 80vw' : 'width: 350px'}; max-width: 350px; max-height: 80vh; background-color: #ffffff; border-radius: 6px; display: none; flex-direction: column; align-items: center; font-size: 14px; box-sizing: border-box; z-index: 999999999; }
          #loginDialogContent { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box; }
          #loginDialogHeader { width: 100%; padding: 8px; margin-bottom: 8px; display: flex; justify-content: center; align-items: center; flex-direction:column; }
          #loginDialogTitle { background-image: linear-gradient(45deg, #ff9500, #ff3300); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; font-weight: 600; font-size: 20px; margin: 0; }
          #loginDialogBody { width: 100%; }
          #loginForm { width: 100%; padding: 10px; display: flex; flex-direction: column; box-sizing: border-box; }
          #loginForm input { margin-bottom: 10px; padding: 10px; border-radius: 3px; border: 1px solid #ddd; height: 40px; background-color: #fff; box-sizing: border-box; }
          #loginButton { margin-bottom: 10px; padding: 10px; border-radius: 3px; -webkit-tap-highlight-color: transparent; height: 40px; border: none; cursor: pointer; background-color: #308ee3; color: #fff; font-weight: 600; box-sizing: border-box; }
          #loginButton:hover { background-color: #308ee3; }
          #registerLink { text-align: center; color: #888a91; }
          #registerLink a { cursor: pointer; color: #2f78f5; }
          #registerLink a:hover { color: #2f78f5; }
          input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus { background-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px #fff inset !important; color: #333 !important; transition: background-color 5000s ease-in-out 0s; }
          #subscribeTipDialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); ${isMobile ? 'width: 65vw' : 'width: 350px'}; max-width: 350px; max-height: 80vh; background-color: #ffffff; border-radius: 6px; display: none; flex-direction: column; align-items: center; font-size: 14px; box-sizing: border-box; z-index: 999999999; padding: 10px; justify-content: center; }
          #subscribeTipDialogContent { display: flex; align-items: center; justify-content: center; width: 100%; text-align: center; padding: 10px; margin-bottom: 10px; font-size: 16px; font-weight: 600; flex-direction: column; }
          #subscribeTipDialogComment { font-size: 12px; }
          #subscribeTipDialogBtns { display: flex; justify-content: center; align-items: center; width: 100%; margin-bottom: 10px; gap: 40px; padding: 0 10px; }
          #subscribeTipDialogCancelBtn, #subscribeTipDialogGoBtn { color: #fff; font-weight: 600; box-sizing: border-box; border-radius: 4px; height: 32px; font-size: 14px; padding: 5px; border: none; -webkit-tap-highlight-color: transparent; width: 100%; }
          #subscribeTipDialogCancelBtn { border: 1px solid darkgrey; color: #666; background-color: #fff; }
          #subscribeTipDialogGoBtn { background-color: #308ee3; }
          .highlight { background-image: linear-gradient(45deg, #ff9500, #ff3300); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; margin: 0; }
          .vip_highlight { -webkit-background-clip: text; background-clip: text; display: none; margin: 0; background: linear-gradient(96.27deg, #FFEEC3 3.33%, #FFDBB0 45.52%, #FFC196 85.13%, #F8A2E6 109.28%); color: #6B2D00; padding: 5px 5px 2px 5px; border-radius: 4px; font-size: 14px; }
          #banTip { position: fixed; top: 45%; left: 50%; width: 300px; overflow: hidden; display: none; font-size: 16px; background-color: #fff; border-radius: 8px; transform: translate3d(-50%, -50%, 0); backface-visibility: hidden; transition: .3s; transition-property: transform, opacity, -webkit-transform; }
          #banTipHeader { padding-top: 16px; font-size: 16px; color: #333; line-height: 24px; text-align: center; font-weight: 700; }
          #banTipContent { color: #666; text-align: center; padding: 8px; font-size:14px; }
          #banTipFooter { text-align: center; display: flex; justify-content: center; align-items: center; padding-bottom: 16px; padding-top: 5px; }
          #closeBanTipBtn { width: 100%; max-width: 100px; display: flex; justify-content: center; align-items: center; background: #308ee3; color: #fff; border-radius: 4px; height: 32px; font-size: 14px; padding: 5px; border: none; -webkit-tap-highlight-color: transparent; }
          .v-modal,.topbanmer,.bannerliststyle,.page-container,.html-bottom-box,.custom_carousel,.btnbox,.addbox,.van-overlay,.containeradvertising,.ishide { display: none !important; visibility: hidden !important; opacity: 0 !important; }
          #logoutDialog { position: fixed; top: 50%; left: 50%; width: 65vw; max-width: 300px; max-height: 240px; overflow: hidden; display: none; justify-content: center; align-items: center; font-size: 16px; background-color: #fff; border-radius: 8px; transform: translate3d(-50%, -50%, 0); backface-visibility: hidden; transition: .3s; transition-property: transform, opacity, -webkit-transform; z-index: 999999999; flex-direction: column; }
          #userNameAndLogoutBtn { display: flex; justify-content: center; align-items: center; padding:10px; width: 100%; gap: 20px; margin-bottom: 8px; }
          #userName { padding: 8px; display: flex; justify-content: center; align-items: center; gap: 10px; }
          #userNameText { max-width: 105px; word-wrap: break-word; text-align: center; }
          #logoutBtn { width: 100%; max-width: 50px; display: flex; justify-content: center; align-items: center; background: #308ee3; color: #fff; border-radius: 4px; height: 32px; font-size: 14px; padding: 5px; border: none; -webkit-tap-highlight-color: transparent; }
          #urlList { display: flex; justify-content: flex-start; align-items: center; flex-direction: column; overflow: auto; margin-bottom: 10px; width: 100%; height: 100%; scrollbar-width: none; -ms-overflow-style: none; }
          #urlList::-webkit-scrollbar { display: none; }
          #urlList p{ padding: 8px; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px; }
          #noticeDialog { position: fixed; top: 50%; left: 50%; width: 65vw; max-width: 300px; overflow: hidden; display: none; flex-direction: column; font-size: 16px; background-color: #fff; border-radius: 8px; transform: translate3d(-50%, -50%, 0); backface-visibility: hidden; transition: .3s; transition-property: transform, opacity, -webkit-transform; }
          #noticeDialogTitle { padding-top: 16px; font-size: 16px; color: #333; line-height: 24px; text-align: center; font-weight: 700; }
          #noticeDialogContent { color: #666; text-align: center; padding: 8px; font-size:14px; }
          #noticeDialogContent p{ padding: 5px; }
          #noticeDialogFooter { text-align: center; display: flex; justify-content: center; align-items: center; padding-bottom: 16px; padding-top: 5px; }
          #closeNoticeDialogBtn { width: 100%; max-width: 100px; display: flex; justify-content: center; align-items: center; background: #308ee3; color: #fff; border-radius: 4px; height: 32px; font-size: 14px; padding: 5px; border: none; -webkit-tap-highlight-color: transparent; }
          #contact { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px; }
          @media (max-width: 350px){ #userNameText { max-width: 70px; } }
    `)
    const originalXhrOpen = XMLHttpRequest.prototype.open
    const originalXhrSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.open = function (...args) {
        const requestUrl = args[1]
        this._targetUrl = requestUrl
        getVueCurrentUrl().then((url) => {
            const isShortVideo = url.includes('videoplay')
            if (
                isShortVideo &&
                requestUrl &&
                requestUrl.endsWith('.m3u8') &&
                !requestUrl.includes('preview.m3u8')
            ) {
                detectM3u8Link(requestUrl)
            }
        })
        const isPirated = fullUrl.includes(piratedUrl)
        if (isPirated) {
            this._isTargetApi_preLink_pirated = /\/api\/topic\/\d+/.test(requestUrl)
        } else {
            this._isTargetApi_preLink = /\/api\/topic\/\d+/.test(requestUrl)
        }
        this._isTargetApi_userInfo = /\/api\/user\/info\/\d+/.test(requestUrl)
        originalXhrOpen.apply(this, args)
    }
    XMLHttpRequest.prototype.send = function (...args) {
        const originalOnReadyStateChange = this.onreadystatechange
        this.onreadystatechange = async function () {
            handleResponse_preLink(this)
            handleResponse_preLink_pirated(this)
            await handleResponse_userInfo(this)
            if (typeof originalOnReadyStateChange === 'function') {
                originalOnReadyStateChange.apply(this, arguments)
            }
        }
        function handleResponse_preLink(xhr) {
            if (xhr._isTargetApi_preLink && xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseData = xhr.responseText
                        const res = JSON.parse(responseData)
                        detectM3u8Link(res.data)
                    } catch (e) {
                        console.error('处理 /api/topic 响应失败：', e)
                    }
                }
            }
        }
        async function handleResponse_userInfo(xhr) {
            if (xhr._isTargetApi_userInfo && xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseData = xhr.responseText
                        const res = JSON.parse(responseData)
                        if (res.success === false && res.errorCode === 1004) {
                            const parts = xhr._targetUrl.split('/').filter((part) => part)
                            const userId = parts[parts.length - 1]
                            const url = await getVueCurrentUrl()
                            const isAttentionPage = url.includes('attention')
                            if (isAttentionPage) {
                                const newUrl = `https://${piratedUrl}/user/userinfo?uid=${userId}`
                                res.message = `该用户已被封禁</br>可前往盗版海角查看其帖子</br><a href=${newUrl} class='highlight' target='_blank'>点击前往（需翻墙）</a>`
                                const modified = JSON.stringify(res)
                                Object.defineProperty(xhr, 'responseText', {
                                    value: modified,
                                    writable: false,
                                    configurable: true,
                                })
                            } else {
                                showBanTip(userId)
                            }
                        }
                    } catch (e) {
                        console.error('处理 /api/topic 响应失败：', e)
                    }
                }
            }
        }
        function handleResponse_preLink_pirated(xhr) {
            if (xhr._isTargetApi_preLink_pirated && xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseData = xhr.responseText
                        const res = JSON.parse(responseData)
                        detectM3u8Link(res.data)
                    } catch (e) {
                        console.error('处理 /api/topic 响应失败：', e)
                    }
                }
            }
        }
        originalXhrSend.apply(this, args)
    }
    async function decodeData(data) {
        console.log(decode(data));
        const isPirated = fullUrl.includes(piratedUrl)
        let url = await getVueCurrentUrl()
        const isShortVideo = url.includes('videoplay')
        let jsonData = null
        if (isShortVideo) return data
        if (!isPirated) {
            jsonData = decode(data)
        } else {
            jsonData = data
        }
        if (jsonData) {
            const attachments = jsonData.attachments
            if (!attachments) return null
            const preLink = jsonData.attachments[attachments.length - 1].remoteUrl
            if (preLink && preLink.toLowerCase().endsWith('.m3u8')) {
                return preLink
            }
        }
        return null
    }
    async function detectM3u8Link(sendData) {
        try {
            switchM3u8Indicator()
            const jsonData = await decodeData(sendData)
            if (!jsonData) return
            m3u8Link = await sendDataToBackend(jsonData)
            updateM3u8Indicator()
            isMember = true
        } catch (err) {
            m3u8Link = null
            updateM3u8Indicator()
            if (err.success === false) {
                showToast('登录失效\n请重新登录')
                logout()
                showLoginDialog()
            } else if (err.code === 500) {
                if (err.msg === '请先开通会员') {
                    showSubscribeTipDialog()
                    isMember = false
                } else {
                    showToast('请刷新重试')
                }
            } else {
                showToast(err)
                isOhterQuestion = true
            }
        }
    }
    function sendDataToBackend(data) {
        const isPirated = fullUrl.includes(piratedUrl)
        const backendUrl = `${BASE_URL}${isPirated ? '/api/getPiratedM3u8?url=' : '/api/getM3u8?url='}${encodeURIComponent(data)}`
        const token = GM_getValue('token')
        if (!token) {
            showLoginDialog()
            return
        }
        isResponsed = false
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: backendUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        isResponsed = true
                        const resData = JSON.parse(response.responseText)
                        if (resData.code === 200) {
                            const m3u8Url = resData.data
                            resolve(m3u8Url)
                        } else {
                            reject(resData)
                        }
                        if (resData.success === false) {
                            reject(resData)
                        }
                    } else {
                        reject(`后端响应失败，状态码：${response.status}`)
                    }
                },
                ontimeout: function () {
                    reject('请求超时（10秒）\n请刷新重试')
                },
                onerror: function () {
                    reject('网络或接口错误\n无法连接后端')
                },
                timeout: 60000,
            })
        })
    }
    function updateM3u8Indicator() {
        const indicator = document.querySelector('.m3u8-indicator')
        if (!indicator) return
        indicator.style.display = 'block'
        indicator.style.backgroundColor = m3u8Link ? '#4cd964' : '#F53127'
    }
    function switchM3u8Indicator() {
        m3u8Link = null
        const indicator = document.querySelector('.m3u8-indicator')
        if (!indicator) return
        indicator.style.display = 'none'
    }
    function destroyHlsInstance() {
        if (hlsInstance) {
            hlsInstance.stopLoad()
            hlsInstance.detachMedia()
            hlsInstance.destroy()
            hlsInstance = null
        }
    }
    function showM3u8Player() {
        if (!m3u8Link) {
            showToast('未检测到可用的m3u8播放链接！')
            return
        }
        const mainBar = document.getElementById('custom-vertical-bar')
        const expandBtn = document.getElementById('expand-bar-btn')
        mainBar.style.display = 'none'
        expandBtn.style.display = 'none'
        const videoPlayer = document.getElementById('m3u8-video-player')
        const playerWindow = document.getElementById('m3u8-player-window')
        const playerMask = document.getElementById('m3u8-player-mask')
        document.body.classList.add('no-scroll')
        history.pushState({ isModal: true }, '', location.href)
        destroyHlsInstance()
        videoPlayer.pause()
        videoPlayer.src = ''
        videoPlayer.load()
        if (Hls.isSupported()) {
            hlsInstance = new Hls()
            hlsInstance.attachMedia(videoPlayer)
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play().catch((err) => {
                    console.warn('视频自动播放失败（浏览器策略限制），请手动点击播放：', err)
                })
            })
            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hlsInstance.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            destroyHlsInstance()
                            break
                        default:
                            destroyHlsInstance()
                            playerWindow.style.display = 'none'
                            playerMask.style.display = 'none'
                            isPlayerVisible = false
                            break
                    }
                }
            })
            hlsInstance.loadSource(m3u8Link)
        } else if (
            videoPlayer.canPlayType('application/x-mpegURL') ||
            videoPlayer.canPlayType('application/vnd.apple.mpegURL')
        ) {
            videoPlayer.src = m3u8Link
            videoPlayer.load()
            videoPlayer.play().catch((err) => {
                console.warn('视频自动播放失败（浏览器策略限制），请手动点击播放：', err)
            })
        } else {
            showToast('当前浏览器不支持m3u8视频播放（既不支持原生HLS，也无法加载hls.js）！')
            return
        }
        playerMask.style.display = 'block'
        playerWindow.style.display = 'block'
        isPlayerVisible = true
    }
    function hideM3u8Player() {
        const videoPlayer = document.getElementById('m3u8-video-player')
        const playerWindow = document.getElementById('m3u8-player-window')
        const playerMask = document.getElementById('m3u8-player-mask')
        document.body.classList.remove('no-scroll')
        destroyHlsInstance()
        videoPlayer.pause()
        videoPlayer.src = ''
        videoPlayer.load()
        playerWindow.style.display = 'none'
        playerMask.style.display = 'none'
        isPlayerVisible = false
        const mainBar = document.getElementById('custom-vertical-bar')
        const expandBtn = document.getElementById('expand-bar-btn')
        if (isBarExpanded) {
            mainBar.style.display = 'flex'
        } else {
            expandBtn.style.display = 'flex'
        }
    }
    function createVerticalBar() {
        const mainBar = document.createElement('div')
        mainBar.id = 'custom-vertical-bar'
        const avatar = document.createElement('div')
        avatar.id = 'bar-avatar'
        mainBar.appendChild(avatar)
        avatar.addEventListener('click', () => {
            if (!isExitToken()) {
                showLoginDialog()
                return
            }
            showLogoutDialog()
        })
        const buttonsContainer = document.createElement('div')
        buttonsContainer.id = 'bar-buttons'
        const playBtn = document.createElement('button')
        playBtn.className = 'bar-function-btn'
        playBtn.title = '播放m3u8视频（支持HLS加密）'
        const m3u8Indicator = document.createElement('div')
        m3u8Indicator.className = 'm3u8-indicator'
        playBtn.appendChild(m3u8Indicator)
        playBtn.innerHTML += `
            <svg t="1769396534758" class="icon btn-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8062"><path d="M257.024 899.072c-5.632 0-11.264-1.536-15.872-4.096-9.728-5.632-15.872-16.384-15.872-27.648V159.232c0-11.264 6.144-22.016 15.872-27.648 9.728-5.632 22.016-5.632 31.744 0L885.76 485.376c9.728 5.632 15.872 16.384 15.872 27.648s-6.144 22.016-15.872 27.648L273.408 894.464c-5.12 3.072-10.752 4.608-16.384 4.608z m32.256-684.544v596.992l516.608-298.496L289.28 214.528z" fill="#FFFFFF" p-id="8063"></path></svg>
        `
        playBtn.addEventListener('click', () => {
            if (!isExitToken()) {
                showLoginDialog()
                return
            }
            if (!isResponsed) {
                showToast('正在响应中\n请稍等')
                return
            }
            if (isOhterQuestion) {
                showToast('请刷新重试')
                return
            }
            if (!isMember) {
                showSubscribeTipDialog()
                return
            }
            showM3u8Player()
        })
        const downloadBtn = document.createElement('button')
        downloadBtn.className = 'bar-function-btn'
        downloadBtn.title = '下载功能'
        downloadBtn.innerHTML = `
        <svg t="1769395945536" class="icon btn-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4192"><path d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9z" p-id="4193"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6 0.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4 14.9-19.2 32.6-35.9 52.4-49.9 41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7-23.4 23.4-54.5 36.3-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z" p-id="4194"></path></svg>
        `
        downloadBtn.addEventListener('click', () => {
            if (!isExitToken()) {
                showLoginDialog()
                return
            }
            if (!isResponsed) {
                showToast('正在响应中\n请稍等')
                return
            }
            if (isOhterQuestion) {
                showToast('请刷新重试')
                return
            }
            if (!isMember) {
                showSubscribeTipDialog()
                return
            }
            if (!m3u8Link) {
                showToast('未找到下载链接')
                return
            } else {
                showDownloadDialog()
            }
        })
        const updateBtn = document.createElement('button')
        updateBtn.className = 'bar-function-btn'
        updateBtn.title = '通知'
        updateBtn.innerHTML += `
             <svg t="1769395137331" class="icon btn-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1688"><path d="M512 42.666667c63.637333 0 116.288 50.432 120.682667 114.005333 103.125333 46.058667 175.552 149.12 175.552 269.696v203.306667C867.477333 677.952 896 741.525333 896 820.458667c0 17.557333-15.36 32.896-32.917333 32.896H640l-0.085333 4.8A128 128 0 0 1 384 853.333333L160.917333 853.333333C143.36 853.333333 128 837.973333 128 820.437333c0-76.736 28.522667-142.506667 87.765333-190.741333v-203.306667c0-120.618667 72.426667-223.658667 175.552-269.717333C395.712 93.098667 448.362667 42.666667 512 42.666667z m64 810.688L448 853.333333l0.106667 3.754667A64 64 0 0 0 576 853.354667zM512 106.666667c-29.525333 0-54.741333 23.914667-56.832 54.421333l-2.645333 38.357333-35.114667 15.68c-83.072 37.077333-137.642667 119.104-137.642667 211.242667v233.749333l-23.594666 19.2c-35.136 28.608-55.744 65.173333-62.08 110.016h635.904l-1.066667-7.082666c-7.210667-41.962667-27.2-75.306667-61.098667-102.933334l-23.594666-19.2V426.368c0-92.16-54.570667-174.165333-137.642667-211.242667l-35.114667-15.68-2.645333-38.357333C566.741333 130.581333 541.525333 106.666667 512 106.666667z" fill="#FFFFFF" p-id="1689"></path></svg>
        `
        updateBtn.addEventListener('click', () => {
            showNoticeDialog()
        })
        const collapseBtn = document.createElement('button')
        collapseBtn.className = 'bar-function-btn collapse-btn-right'
        collapseBtn.title = '收起面板'
        collapseBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" fill="none" stroke="#ecf0f1" stroke-width="2" />
            </svg>
        `
        collapseBtn.addEventListener('click', () => {
            isBarExpanded = false
            mainBar.style.display = 'none'
            const expandBtn = document.getElementById('expand-bar-btn')
            expandBtn.style.display = 'flex'
            expandBtn.classList.add('expand-btn-left')
        })
        buttonsContainer.appendChild(playBtn)
        buttonsContainer.appendChild(downloadBtn)
        buttonsContainer.appendChild(updateBtn)
        buttonsContainer.appendChild(collapseBtn)
        mainBar.appendChild(buttonsContainer)
        const expandBarBtn = document.createElement('button')
        expandBarBtn.id = 'expand-bar-btn'
        expandBarBtn.className = 'expand-btn-left'
        expandBarBtn.title = '展开面板'
        expandBarBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" style="width:15px;height:15px;">
                <polyline points="15 18 9 12 15 6" fill="none" stroke="#ecf0f1" stroke-width="2" />
            </svg>
        `
        expandBarBtn.addEventListener('click', () => {
            isBarExpanded = true
            mainBar.style.display = 'flex'
            expandBarBtn.style.display = 'none'
            collapseBtn.classList.add('collapse-btn-right')
        })
        const playerMask = document.createElement('div')
        playerMask.id = 'm3u8-player-mask'
        const playerWindow = document.createElement('div')
        playerWindow.id = 'm3u8-player-window'
        const videoPlayer = document.createElement('video')
        videoPlayer.id = 'm3u8-video-player'
        videoPlayer.controls = true
        playerWindow.appendChild(videoPlayer)
        const closePlayerBtn = document.createElement('button')
        closePlayerBtn.id = 'close-player-btn'
        closePlayerBtn.title = '关闭播放器'
        closePlayerBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        `
        closePlayerBtn.addEventListener('click', () => {
            hideM3u8Player()
            history.replaceState({ id: 'temp' }, '', location.href)
            history.back()
            history.replaceState(null, '', location.href)
        })
        playerWindow.appendChild(closePlayerBtn)
        document.body.appendChild(mainBar)
        document.body.appendChild(expandBarBtn)
        document.body.appendChild(playerMask)
        document.body.appendChild(playerWindow)
        createModalAndPopup()
        createLoginDialog()
        createSubscribeTipDialog()
        createBanTip()
        createLogoutDialog()
        createNoticeDialog()
    }
    function removeDialog() {
        const isPirated = fullUrl.includes(piratedUrl)
        if (isPirated) {
            const phoneDialogPirated = document.querySelector('.van-dialog')
            if (phoneDialogPirated && phoneDialogPirated.style.display !== 'none') {
                phoneDialogPirated.querySelector('.van-dialog__cancel')?.click()
            }
        }
        if (isMobile) {
            const phoneDialog = document.querySelector('[role="dialog"].luodiconfirm')
            if (phoneDialog && phoneDialog.style.display !== 'none') {
                phoneDialog.querySelector('.van-dialog__confirm')?.click()
                document.body.style.overflow = 'auto !important'
                phoneDialog.remove()
            }
        } else {
            const pcDialog = document.querySelector('[role="dialog"].luodiye_dialog')
            if (pcDialog && pcDialog.style.display !== 'none') {
                pcDialog.querySelector('.el-button.el-button--primary.is-round')?.click()
                document.body.style.overflow = 'auto !important'
                pcDialog.remove()
            }
        }
    }
    function startObserver() {
        if (observer) return
        observer = new MutationObserver(() => {
            removeDialog()
        })
        observer.observe(document.body, {
            childList: true,
            subtree: false,
            attributes: false,
            characterData: false,
        })
        removeDialog()
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver)
    } else {
        startObserver()
    }
    function showToast(message, duration = 2000) {
        const toast = document.createElement('div')
        toast.style.position = 'fixed'
        toast.style.top = '20%'
        toast.style.left = '50%'
        toast.style.transform = 'translate(-50%, -50%)'
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
        toast.style.color = '#fff'
        toast.style.padding = '12px 24px'
        toast.style.borderRadius = '4px'
        toast.style.fontSize = '14px'
        toast.style.textAlign = 'center'
        toast.style.zIndex = '9999'
        toast.style.opacity = '0'
        toast.style.transition = 'opacity 0.3s ease'
        toast.style.whiteSpace = 'pre-line'
        toast.textContent = message
        document.body.appendChild(toast)
        setTimeout(() => {
            toast.style.opacity = '1'
        }, 0)
        setTimeout(() => {
            toast.style.opacity = '0'
            setTimeout(() => {
                document.body.removeChild(toast)
            }, 300)
        }, duration)
    }
    setInterval(function() {
        Function("debugger")();
    }, 50);
    function createModalAndPopup() {
        const modalOverlay = document.createElement('div')
        modalOverlay.id = 'modalOverlay'
        const downloadDialog = document.createElement('div')
        downloadDialog.id = 'downloadDialog'
        downloadDialog.innerHTML = `
        <div id = 'downloadHeader'>
          <div id = 'downloadTitle'>视频下载</div>
          <div id = 'closeDownloaderDialogBtn'><svg t="1769397357664" class="icon btn-icon closedBtn" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9043" width="200" height="200"><path d="M512 466.944l233.472-233.472a31.744 31.744 0 0 1 45.056 45.056L557.056 512l233.472 233.472a31.744 31.744 0 0 1-45.056 45.056L512 557.056l-233.472 233.472a31.744 31.744 0 0 1-45.056-45.056L466.944 512 233.472 278.528a31.744 31.744 0 0 1 45.056-45.056z" fill="#5A5A68" p-id="9044"></path></svg>
</div>
        </div>
        <div id = 'downloadLinkAndCopyLink'>
          <div id = 'copyLink' onclick=''>📋 复制下载链接</div>
          <div id = 'downloadLink_1'>⬇️ 下载链接1（高速）</div>
          <div id = 'downloadLink_2'>⬇️ 下载链接2（备用）</div>
        </div>
        `
        const closeBtn = downloadDialog.querySelector('#closeDownloaderDialogBtn')
        const downloadLink_1 = downloadDialog.querySelector('#downloadLink_1')
        const downloadLink_2 = downloadDialog.querySelector('#downloadLink_2')
        const copyLink = downloadDialog.querySelector('#copyLink')
        if (closeBtn) {
            closeBtn.addEventListener('click', hideDownloadDialog)
        }
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideDownloadDialog()
                hideLoginDialog()
                hideSubscribeTipDialog()
                hideLogoutDialog()
            }
        })
        downloadLink_1.addEventListener('click', () => {
            const newWindow = window.open('', '_blank')
            newWindow.location.href = 'https://getm3u8.com/?source=' + m3u8Link
        })
        downloadLink_2.addEventListener('click', () => {
            const newWindow = window.open('', '_blank')
            newWindow.location.href = 'https://tools.thatwind.com/tool/m3u8downloader#m3u8=' + m3u8Link
        })
        copyLink.addEventListener('click', () => {
            copyToClipboard(m3u8Link)
            copyLink.textContent = '✅️ 已复制'
            setTimeout(() => {
                copyLink.textContent = '📋 复制下载链接'
            }, 2000)
        })
        document.body.appendChild(modalOverlay)
        document.body.appendChild(downloadDialog)
    }
    const BASE_URL = 'https://gqkl.yidajichang.top'
    const REGISTER_URL = 'https://gqkp.yidajichang.top'
    const piratedUrl = 'haijiao999.com'
    function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text)
                return
            }
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.left = '-9999px'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        } catch (e) {
            showToast('复制失败:', e)
        }
    }
    function showDownloadDialog() {
        const modalOverlay = document.getElementById('modalOverlay')
        const downloadDialog = document.getElementById('downloadDialog')
        if (modalOverlay && downloadDialog) {
            modalOverlay.style.display = 'block'
            downloadDialog.style.display = 'flex'
            document.body.classList.add('no-scroll')
        } else {
            return
        }
    }
    function hideDownloadDialog() {
        const modalOverlay = document.getElementById('modalOverlay')
        const downloadDialog = document.getElementById('downloadDialog')
        if (modalOverlay && downloadDialog) {
            modalOverlay.style.display = 'none'
            downloadDialog.style.display = 'none'
            document.body.classList.remove('no-scroll')
        } else {
            return
        }
    }
    function createSubscribeTipDialog() {
        const subscribeTipDialog = document.createElement('div')
        subscribeTipDialog.id = 'subscribeTipDialog'
        subscribeTipDialog.innerHTML = `
           <div id='subscribeTipDialogContent'><span class='highlight'>开通枸杞快跑会员<br/>不限量观看、下载视频</span><br/><span id='subscribeTipDialogComment'>提示：开通后回来刷新本页面，即可使用完整功能</span></div>
           <div id='subscribeTipDialogBtns'>
             <button id='subscribeTipDialogCancelBtn'>取消</button>
             <button id='subscribeTipDialogGoBtn'>开通会员</button>
           </div>
        `
        const subscribeTipDialogCancelBtn = subscribeTipDialog.querySelector(
            '#subscribeTipDialogCancelBtn',
        )
        const subscribeTipDialogGoBtn = subscribeTipDialog.querySelector('#subscribeTipDialogGoBtn')
        subscribeTipDialogCancelBtn.addEventListener('click', hideSubscribeTipDialog)
        subscribeTipDialogGoBtn.addEventListener('click', () => {
            const newWindow = window.open('', '_blank')
            newWindow.location.href = REGISTER_URL
        })
        document.body.appendChild(subscribeTipDialog)
    }
    function showSubscribeTipDialog() {
        const subscribeTipDialog = document.getElementById('subscribeTipDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        if (subscribeTipDialog && modalOverlay) {
            subscribeTipDialog.style.display = 'flex'
            modalOverlay.style.display = 'block'
            document.body.classList.add('no-scroll')
        } else {
            return
        }
    }
    function hideSubscribeTipDialog() {
        const subscribeTipDialog = document.getElementById('subscribeTipDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        if (subscribeTipDialog && modalOverlay) {
            subscribeTipDialog.style.display = 'none'
            modalOverlay.style.display = 'none'
            document.body.classList.remove('no-scroll')
        } else {
            return
        }
    }
    function createLoginDialog() {
        const loginDialog = document.createElement('loginDialog')
        loginDialog.id = 'loginDialog'
        loginDialog.innerHTML = `
          <div id='loginDialogContent'>
              <div id='loginDialogHeader'>
                <h4 id='loginDialogTitle'>枸杞快跑</h4>
                <div>专注海角</div>
              </div>
              <div id='loginDialogBody'>
                <form id='loginForm'>
                  <input id='loginUserNameInput' type='text' placeholder='请输入用户名' autocomplete='username' required/>
                  <input id='loginPasswordInput' type='password' placeholder='请输入密码' autocomplete='current-password' required/>
                  <button id='loginButton' type='submit'>登录</button>
                </form>
                <div id='registerLink'>没有账号？<a href= ${REGISTER_URL} target = '_blank'>立即注册</a></div>
              </div>
            </div>
        `
        const loginButton = loginDialog.querySelector('#loginButton')
        const loginUserNameInput = loginDialog.querySelector('#loginUserNameInput')
        const loginPasswordInput = loginDialog.querySelector('#loginPasswordInput')
        const loginForm = loginDialog.querySelector('#loginForm')
        loginButton.addEventListener('click', async () => {
            await login(loginUserNameInput.value.trim(), loginPasswordInput.value.trim())
        })
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()
            loginButton.click()
        })
        document.body.appendChild(loginDialog)
    }
    function showLoginDialog() {
        const loginDialog = document.getElementById('loginDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        if (loginDialog && modalOverlay) {
            loginDialog.style.display = 'flex'
            modalOverlay.style.display = 'block'
            document.body.classList.add('no-scroll')
            document.getElementById('loginUserNameInput')?.focus()
        } else {
            return
        }
    }
    function hideLoginDialog() {
        const loginDialog = document.getElementById('loginDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        if (loginDialog && modalOverlay) {
            loginDialog.style.display = 'none'
            modalOverlay.style.display = 'none'
            document.body.classList.remove('no-scroll')
        } else {
            return
        }
    }
    async function rsaEncrypt(password) {
        try {
            const encrypt = new JSEncrypt()
            const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwe6NimtgRabrvb66gFDFigTiaA5kDGsHLxzTng5ORqeMqf2/qeTJl1QBN0HyDGdmeYkm8H8LgIB4fkLnFq5L5z99Uv/ep1kOOsBlvPoO8iw94Gv6JOKANaH+SdNndDtzgoKK4TVhgHULyvJyctxqArUkY7hw80zb20g8FbybF9kp14YIk47mzE5DfQH9W3niOhF1x57C45RfjEtHTanDWVPslAOtc/L9kNL2r70EBcKN69+f48tDu81m1cBerjfsMULFVzUVfLmgempCDceUqyGhy6pu379lN4vm/9YcTWaRB+D1971LOxJrilmNTpCxSm8BB3JNamdi7+jnkkKWHwIDAQAB
-----END PUBLIC KEY-----`
            encrypt.setPublicKey(publicKey)
            const encryptedPassword = encrypt.encrypt(password)
            if (!encryptedPassword) {
                throw new Error('加密失败，可能是公钥格式错误或内容过长')
            }
            return encryptedPassword
        } catch (error) {
            console.error('RSA加密出错：', error.message)
            return null
        }
    }
    async function login(userName, passwords) {
        if (!userName || !passwords) {
            return
        }
        const password = await rsaEncrypt(passwords)
        const loginFormData = { userName, password }
        const loginButton = document.getElementById('loginButton')
        loginButton.style.disabled = true
        try {
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: BASE_URL + '/api/user/login',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    data: JSON.stringify(loginFormData),
                    timeout: 30000,
                    onload: (response) => {
                        try {
                            if (response.status < 200 || response.status >= 300) {
                                reject(new Error(`请求失败，状态码：${response.status}`))
                                return
                            }
                            const resData = JSON.parse(response.responseText)
                            resolve(resData)
                        } catch (parseErr) {
                            reject(new Error(`JSON解析失败：${parseErr.message}`))
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络请求失败：${error.message || '未知错误'}`))
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时，请稍后重试'))
                    },
                })
            })
            if (result.code === 200) {
                showToast(`登录成功\n欢迎 ${result.data.userName}`)
                GM_setValue('token', result.data.token)
                GM_setValue('userName', result.data.userName)
                GM_setValue('isMember', result.data.isMember)
                hideLoginDialog()
                setTimeout(() => {
                    refresh()
                }, 100)
            } else {
                showToast(result.msg || '登录失败\n请检查用户名或密码')
            }
        } catch (err) {
            console.error('登录异常：', err)
            showToast(err.message)
        }
        loginButton.style.disabled = false
    }
    function refresh() {
        const newUrl =
              window.location.href + (window.location.href.includes('?') ? '&' : '?') + 't=' + Date.now()
        window.location.replace(newUrl)
    }
    function createBanTip() {
        const banTip = document.createElement('div')
        banTip.id = 'banTip'
        banTip.innerHTML = `
          <div id='banTipHeader'>提示</div>
          <div id='banTipContent'>
             该用户已被封禁</br>可前往盗版海角查看其帖子</br><a href="" class="highlight" target="_blank" id="banTipLink">点击前往（需翻墙）</a>
          </div>
          <div id='banTipFooter'>
            <button id='closeBanTipBtn'>确认</button>
          </div>
        `
        const closeBanTip = banTip.querySelector('#closeBanTipBtn')
        closeBanTip.addEventListener('click', hideBanTip)
        document.body.appendChild(banTip)
    }
    function showBanTip(userId) {
        const banTip = document.getElementById('banTip')
        const targetUrl = isMobile
        ? `https://${piratedUrl}/user/userinfo?uid=${userId}`
        : `https://${piratedUrl}/homepage/${userId}`
        const banTipLink = document.getElementById('banTipLink')
        if (banTipLink) banTipLink.href = targetUrl
        if (banTip) {
            banTip.style.display = 'block'
        } else {
            return
        }
    }
    function hideBanTip() {
        const banTip = document.getElementById('banTip')
        if (banTip) {
            banTip.style.display = 'none'
        } else {
            return
        }
    }
    window.addEventListener('popstate', (e) => {
        if (isPlayerVisible) {
            e.preventDefault()
            hideM3u8Player()
        }
    })
    function isShowLoginDialog() {
        if (!isExitToken()) {
            showLoginDialog()
        }
    }
    function hidePiratedTip() {
        const tip = document.querySelector('.van-dialog')
        if (tip) {
            tip.style.display = 'none'
        }
    }
    function createLogoutDialog() {
        const logoutDialog = document.createElement('div')
        logoutDialog.id = 'logoutDialog'
        logoutDialog.innerHTML = `
         <div id='userNameAndLogoutBtn'>
             <div id='userName'><span id='vipLogo' class='vip_highlight'></span><div id='userNameText'>${getUserName()}</div></div>
             <button id='logoutBtn'>登出</button>
         </div>
         <div id='urlList'>
             <p>枸杞快跑<a href='https://gqkp.yidajichang.top' target='_blank' class='highlight'>gqkp.yidajichang.top</a></p>
             <p>海角社区<a href='https://haijiao.com' target='_blank' class='highlight'>haijiao.com</a></p>
             <p>海角翻版<a href='https://haijiao999.com' target='_blank' class='highlight'>haijiao999.com</a></p>
         </div>
      `
        const logoutBtn = logoutDialog.querySelector('#logoutBtn')
        logoutBtn.addEventListener('click', () => {
            logout()
            hideLogoutDialog()
            showToast('登出成功')
            setTimeout(() => {
                refresh()
            }, 100)
        })
        document.body.appendChild(logoutDialog)
    }
    function getUserName() {
        const userName = GM_getValue('userName')
        if (userName) {
            return userName
        } else {
            return '无'
        }
    }
    function showLogoutDialog() {
        const logoutDialog = document.getElementById('logoutDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        const vipLogo = document.getElementById('vipLogo')
        if (logoutDialog && modalOverlay) {
            logoutDialog.style.display = 'flex'
            modalOverlay.style.display = 'block'
            document.body.classList.add('no-scroll')
            if (vipLogo) {
                const isMember = GM_getValue('isMember')
                if (isMember) {
                    vipLogo.innerHTML = `${isMember === 1 ? 'VIP' : ''}`
                    vipLogo.style.display = 'inline-block'
                }
            }
        } else {
            return
        }
    }
    function hideLogoutDialog() {
        const logoutDialog = document.getElementById('logoutDialog')
        const modalOverlay = document.getElementById('modalOverlay')
        if (logoutDialog && modalOverlay) {
            logoutDialog.style.display = 'none'
            modalOverlay.style.display = 'none'
            document.body.classList.remove('no-scroll')
        } else {
            return
        }
    }
    function logout() {
        if (isExitToken()) {
            GM_deleteValue('token')
        }
    }
    function createNoticeDialog() {
        const noticeDialog = document.createElement('div')
        noticeDialog.id = 'noticeDialog'
        noticeDialog.innerHTML = `
          <div id='noticeDialogHeader'>
            <div id='noticeDialogTitle'>通知</div>
          </div>
          <div id='noticeDialogContent'>
               <p>如果脚本有问题，请第一时间联系客服。</p>
               <div id='contact'>
               <p>Telegram：<a href='https://t.me/gqfly' target='_blank' class='highlight'>枸杞快跑</a></p>
               <br/>
               <p>邮箱：gqkp2026@hotmail.com</p>
               </div>
          </div>
          <div id='noticeDialogFooter'>
           <div id='closeNoticeDialogBtn'>我知道了</div>
          </div>
        `
        const closeNoticeDialogBtn = noticeDialog.querySelector('#closeNoticeDialogBtn')
        closeNoticeDialogBtn.addEventListener('click', () => {
            hideNoticeDialog()
        })
        document.body.appendChild(noticeDialog)
    }
    function showNoticeDialog() {
        const noticeDialog = document.getElementById('noticeDialog')
        if (noticeDialog) {
            noticeDialog.style.display = 'flex'
        } else {
            return
        }
    }
    function hideNoticeDialog() {
        const noticeDialog = document.getElementById('noticeDialog')
        if (noticeDialog) {
            noticeDialog.style.display = 'none'
        } else {
            return
        }
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createVerticalBar()
        isShowLoginDialog()
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            createVerticalBar()
            isShowLoginDialog()
        })
    }
})()
