// ==UserScript==
// @name         Bilibili Video Overseas accleration
// @name:zh-CN   Bilibili 海外加速
// @name:zh-TW   Bilibili 海外加速
// @name:en      Bilibili Video CDN Switcher
// @namespace    mailto:louieluyaotang@outlook.com
// @copyright    Free For Personal Use
// @license      No License
// @version      0.2.0
// @description       修改哔哩哔哩播放时的所用CDN 加快视频加载 番剧加速 视频加速
// @description:zh-CN 修改哔哩哔哩播放时的所用CDN 加快视频加载 番剧加速 视频加速
// @description:en    Modify Bilibili's CDN during playback to speed up video loading, supporting Animes & Videos
// @description:zh-TW 修改 Bilibili 播放時的所用CDN 加快影片載入 番劇加速 影片加速
// @description:ja    ビリビリ動画（Bilibili）の動画再生時のCDNを変更して、動画読み込み速度の向上、アニメとビデオ読込高速化
// @author       louieluyaotang@outlook.com
// @run-at       document-start
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://live.bilibili.com/blanc/*
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/mooc/*
// @match        https://www.bilibili.com/v/*
// @match        https://www.bilibili.com/documentary/*
// @match        https://www.bilibili.com/variety/*
// @match        https://www.bilibili.com/tv/*
// @match        https://www.bilibili.com/guochuang/*
// @match        https://www.bilibili.com/movie/*
// @match        https://www.bilibili.com/anime/*
// @match        https://www.bilibili.com/match/*
// @match        https://www.bilibili.com/cheese/*
// @match        https://music.bilibili.com/pc/music-center/*
// @match        https://search.bilibili.com/*
// @match        https://m.bilibili.com/video/*
// @match        https://m.bilibili.com/bangumi/play/*
// @match        https://m.bilibili.com/?*
// @match        https://m.bilibili.com/
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/553929/Bilibili%20Video%20Overseas%20accleration.user.js
// @updateURL https://update.greasyfork.org/scripts/553929/Bilibili%20Video%20Overseas%20accleration.meta.js
// ==/UserScript==
//脚本修改来自Bilibili CDN切换，感谢其贡献
// 固定为你实测延迟最低的域名（226ms）：不要填IP，必须填域名以避免HTTPS证书问题
var CustomCDN = 'upos-sz-mirrorcosov.bilivideo.com'
// 备选（平均≈259ms）：需要切回时将上一行改为下面这一行
// var CustomCDN = 'upos-sz-mirrorhw.bilivideo.com'

const PluginName = 'BiliCDNSwitcher'
const log = console.log.bind(console, `[${PluginName}]:`)
const Language = (() => {
    const lang = (navigator.language || navigator.browserLanguage || (navigator.languages || ["en"])[0]).substring(0, 2)
    return (lang === 'zh' || lang === 'ja') ? lang : 'en'
})()

let disabled = !!GM_getValue('disabled')
const Replacement = (() => {
    const toURL = ((url) => { if (url.indexOf('://') === -1) url = 'https://' + url; return url.endsWith('/') ? url : `${url}/` })
    const stored = GM_getValue('CustomCDN')
    CustomCDN = CustomCDN === 'null' ? null : CustomCDN
    let domain
    if (CustomCDN && CustomCDN !== '') {
        domain = CustomCDN
        if (CustomCDN !== stored) {
            GM_setValue('CustomCDN', domain)
            log('CustomCDN was saved to GM storage')
        }
    } else if (CustomCDN === null && stored !== null) {
        GM_setValue('CustomCDN', null)
        log('CustomCDN was deleted from GM storage')
    } else if (stored) {
        domain = stored
    }

    if (!domain) {domain = {
        'zh': 'cn-jxnc-cmcc-bcache-06.bilivideo.com',
        'en': 'upos-sz-mirroraliov.bilivideo.com',
        'ja': 'upos-sz-mirroralib.bilivideo.com'
    }[Language]}

    log(`CDN=${domain}`)
    return toURL(domain)
})()
const SettingsBarTitle = {
    'zh': '拦截修改视频CDN',
    'en': 'CDN Switcher',
    'ja': 'CDNスイッチャー'
}[Language]

const playInfoTransformer = playInfo => {
    const urlTransformer = i => {
        const newUrl = i.base_url.replace(
            /https:\/\/.*?\//,
            Replacement
        )
        i.baseUrl = newUrl; i.base_url = newUrl
    };
    const durlTransformer = i => { i.url = i.url.replace(/https:\/\/.*?\//, Replacement) };

    if (playInfo.code !== (void 0) && playInfo.code !== 0) {
        log('Failed to get playInfo, message:', playInfo.message)
        return
    }

    let video_info
    if (playInfo.result) { // bangumi pages
        video_info = playInfo.result.dash === (void 0) ? playInfo.result.video_info : playInfo.result
        if (!video_info?.dash) {
            if (playInfo.result.durl && playInfo.result.durls) {
                video_info = playInfo.result
            } else {
                log('Failed to get video_info, limit_play_reason:', playInfo.result.play_check?.limit_play_reason)
            }
            video_info?.durl?.forEach(durlTransformer)
            video_info?.durls?.forEach(durl => { durl.durl?.forEach(durlTransformer) })
            return
        }
    } else { // video pages
        video_info = playInfo.data
    }
    try {
        video_info.dash.video.forEach(urlTransformer)
        video_info.dash.audio.forEach(urlTransformer)
    } catch (err) {
        if (video_info.durl) { // 充电专属视频、m.bilibili.com/video/*
            log('accept_description:', video_info.accept_description?.join(', '))
            video_info.durl.forEach(durlTransformer)
        } else {
            log('ERR:', err)
        }
    }
    return
}

// Network Request Interceptor
const interceptNetResponse = (theWindow => {
    const interceptors = []
    const interceptNetResponse = (handler) => interceptors.push(handler)

    const handleInterceptedResponse = (response, url) => interceptors.reduce((modified, handler) => {
        const ret = handler(modified, url)
        return ret ? ret : modified
    }, response)
    const OriginalXMLHttpRequest = theWindow.XMLHttpRequest

    class XMLHttpRequest extends OriginalXMLHttpRequest {
        get responseText() {
            if (this.readyState !== this.DONE) return super.responseText
            return handleInterceptedResponse(super.responseText, this.responseURL)
        }
        get response() {
            if (this.readyState !== this.DONE) return super.response
            return handleInterceptedResponse(super.response, this.responseURL)
        }
    }

    theWindow.XMLHttpRequest = XMLHttpRequest

    const OriginalFetch = fetch
    theWindow.fetch = (input, init) => (!handleInterceptedResponse(null, input) ? OriginalFetch(input, init) :
        OriginalFetch(input, init).then(response =>
            new Promise((resolve) => response.text()
                .then(text => resolve(new Response(handleInterceptedResponse(text, input), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                })))
            )
        )
    );

    return interceptNetResponse
})(unsafeWindow)

const waitForElm = (selector) => new Promise(resolve => {
    let ele = document.querySelector(selector)
    if (ele) return resolve(ele)

    const observer = new MutationObserver(mutations => {
        let ele = document.querySelector(selector)
        if (ele) {
            observer.disconnect()
            resolve(ele)
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })

    log('waitForElm, MutationObserver started.')
})

// Parse HTML string to DOM Element
function fromHTML(html) {
    if (!html) throw Error('html cannot be null or undefined', html)
    const template = document.createElement('template')
    template.innerHTML = html
    const result = template.content.children
    return result.length === 1 ? result[0] : result
}

(function () {
    'use strict';
    if (disabled) log('Plugin is Disabled');

    // Hook Bilibili PlayUrl Api
    interceptNetResponse((response, url) => {
        if (disabled) return
        if (url.startsWith('https://api.bilibili.com/x/player/wbi/playurl') ||
            url.startsWith('https://api.bilibili.com/pgc/player/web/v2/playurl') ||
            url.startsWith('https://api.bilibili.com/x/player/playurl') ||
            url.startsWith('https://api.bilibili.com/pgc/player/web/playurl') ||
            url.startsWith('https://api.bilibili.com/pugv/player/web/playurl')
        ) {
            if (response === null) return true
            log('(Intercepted) playurl api response.')
            const responseText = response
            const playInfo = JSON.parse(responseText)
            playInfoTransformer(playInfo)
            return JSON.stringify(playInfo)
        }
    });

    // Modify Pages playinfo
    if (location.host === 'm.bilibili.com') {
        const optionsTransformer = (opts) => (opts.readyVideoUrl = opts.readyVideoUrl?.replace(/https:\/\/.*?\//, Replacement))

        if (!disabled && unsafeWindow.options) {
            log('Directly modify the window.options')
            optionsTransformer(unsafeWindow.options)
        } else {
            let internalOptions = unsafeWindow.options
            Object.defineProperty(unsafeWindow, 'options', {
                get: () => internalOptions,
                set: v => {
                    if (!disabled) optionsTransformer(v);
                    internalOptions = v
                }
            })
        }
    } else {
        if (!disabled && unsafeWindow.__playinfo__) {
            log('Directly modify the window.__playinfo__')
            playInfoTransformer(unsafeWindow.__playinfo__)
        } else {
            let internalPlayInfo = unsafeWindow.__playinfo__
            Object.defineProperty(unsafeWindow, '__playinfo__', {
                get: () => internalPlayInfo,
                set: v => {
                    if (!disabled) playInfoTransformer(v);
                    internalPlayInfo = v
                }
            })
        }
    }

    // Add setting checkbox
    if (location.href.startsWith('https://www.bilibili.com/video/') || location.href.startsWith('https://www.bilibili.com/bangumi/play/')) {
        waitForElm('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-setting > div.bpx-player-ctrl-setting-box > div > div > div > div > div > div > div.bpx-player-ctrl-setting-others')
            .then(settingsBar => {
                settingsBar.appendChild(fromHTML(`<div class="bpx-player-ctrl-setting-others-title">${SettingsBarTitle}</div>`))
                const checkBoxWrapper = fromHTML(`<div class="bpx-player-ctrl-setting-checkbox bpx-player-ctrl-setting-blackgap bui bui-checkbox bui-dark"><div class="bui-area"><input class="bui-checkbox-input" type="checkbox" checked="" aria-label="自定义视频CDN">
    <label class="bui-checkbox-label">
        <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32"><path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a 2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path></svg></span>
        <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32"><path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"></path></svg></span>
        <span class="bui-checkbox-name">${SettingsBarTitle}</span>
    </label></div></div>`)
                const checkBox = checkBoxWrapper.getElementsByTagName('input')[0]
                checkBox.checked = !disabled

                checkBoxWrapper.onclick = () => {
                    if (checkBox.checked) {
                        disabled = false
                        GM_setValue('disabled', false)
                        log(`已启用 ${SettingsBarTitle}`)
                    } else {
                        disabled = true
                        GM_setValue('disabled', true)
                        log(`已禁用 ${SettingsBarTitle}`)
                    }
                }

                settingsBar.appendChild(checkBoxWrapper)
                log('checkbox added, MutationObserver disconnected.')
            });
    }
})();
