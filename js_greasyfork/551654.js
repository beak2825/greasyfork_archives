// ==UserScript==
// @name         Youtube Better Player
// @description  Scroll wheel volume, "Are you there" popup bypass, Volume percent display, Infinite autoplay, Volume save
// @include      /^https:\/\/www\.youtube(-nocookie)?\.com\/(?!(live_chat\?.*|ytscframe)$).*$/
// @run-at       document-idle
// @allFrames    true
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @version 0.0.1.20240506140158
// @namespace https://greasyfork.org/users/286737
// @icon      https://www.youtube.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551654/Youtube%20Better%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/551654/Youtube%20Better%20Player.meta.js
// ==/UserScript==

class Player {
    constructor() {
        this.volumeSk = 'volume'
    }

    async init(isEmbed) {
        const api = this.api = await this.getApi(isEmbed)

        this.volume = Number(GM_getValue(this.volumeSk))

        if (isNaN(this.volume)) {
            this.volume = Math.floor(api.getVolume())
            GM_setValue(this.volumeSk, this.volume)
        }
        else {
            api.unMute()
            api.setVolume(this.volume)
        }

        const {$player, $video, $eventCatcher, $volumeArea, $volumeBar} = this.getEls()

        this.$volumeText = this.buildVolumeText($volumeArea)

        const onVolumeChange = this.onVolumeChange.bind(this)
        $video.addEventListener('volumechange', onVolumeChange)

        new WheelVolume(this, api, $volumeBar, $player).init($eventCatcher)

        if (!isEmbed) new RealAutoPlay(api).init($video)
    }

    async getApi(isEmbed) {
        if (isEmbed) {
            let api
            while (!(api = unsafeWindow.movie_player)) await wait(200)

            return api
        }

        let $el, api

        while (!($el = unsafeWindow['ytd-player'])) await wait(1000)
        while (!(api = $el.player_)) await wait(200)
        while (!api.isReady()) await wait(200)

        return api
    }

    getEls() {
        const $player = $('#movie_player')
        const $video = $('.html5-main-video', $player)
        const $eventCatcher = $player.parentElement
        const $volumeArea = $('.ytp-volume-area', $player)
        const $volumeBar = $('.ytp-volume-slider', $volumeArea)

        return {$player, $video, $eventCatcher, $volumeArea, $volumeBar}
    }

    buildVolumeText($volumeArea) {
        const $volumeText = document.createElement('span')
        $volumeText.classList.add('ytbp-volume-text')
        $volumeText.textContent = this.volume
        GM_addStyle(volumeTextStyle)

        $volumeArea.insertAdjacentElement('beforeend', $volumeText)

        return $volumeText
    }

    onVolumeChange() {
        this.volume = this.$volumeText.textContent = Math.floor(this.api.getVolume())

        clearTimeout(this.saveTimeout)

        this.saveTimeout = setTimeout(() => GM_setValue(this.volumeSk, this.volume), 1000)
    }
}

class WheelVolume {
    constructor(player, api, $volumeBar, $player) {
        this.player = player
        this.api = api
        this.$volumeBar = $volumeBar
        this.$player = $player

        this.events = {
            mouseover: new Event('mouseover', {bubbles: true}),
            mouseout: new Event('mouseout', {bubbles: true}),
            mousemove: new Event('mousemove')
        }
    }

    init($eventCatcher) {
        const onWheel = this.onWheel.bind(this)
        const onClick = this.onClick.bind(this)

        $eventCatcher.addEventListener('wheel', onWheel)
        $eventCatcher.addEventListener('mousedown', onClick)
    }

    onWheel(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        this.show()

        const api = this.api
        const now = Date.now(), since = now - this.prevScrollDate
        const step = (e.deltaY < 0 ? 1 : -1) * (since < 50 ? 4 : 1)

        if (api.isMuted()) api.unMute()

        api.setVolume(this.player.volume + step)

        this.prevScrollDate = now
    }

    onClick(e) {
        if (e.which != 2) return

        e.preventDefault()

        this.show()

        const api = this.api

        if (api.isMuted()) {
            api.unMute()
            api.setVolume(this.player.volume)
        }
        else api.mute()
    }

    show() {
        const $volumeBar = this.$volumeBar, events = this.events

        this.$player.dispatchEvent(events.mousemove)

        clearTimeout(this.showTimeout)

        $volumeBar.dispatchEvent(events.mouseover)

        this.showTimeout = setTimeout(() => $volumeBar.dispatchEvent(events.mouseout), 1000)
    }
}

class RealAutoPlay {
    constructor(api) {
        this.api = api

        this.popupName = 'yt-confirm-dialog-renderer'

        const popupEl = $('ytd-popup-container', unsafeWindow.document)
        this.popupContainer = popupEl.polymerController ?? popupEl.inst
    }

    init($video) {
        const $autonavToggleButton = $('.ytp-autonav-toggle-button')

        this.autoNavEnabled = $autonavToggleButton.ariaChecked

        $autonavToggleButton.addEventListener('click', onToggleAutoNav)

        const bypassPopup = this.bypassPopup.bind(this)
        const forceNextVideo = this.forceNextVideo.bind(this)
        const onToggleAutoNav = this.onToggleAutoNav.bind(this)

        $video.addEventListener('pause', bypassPopup)
        $video.addEventListener('waiting', bypassPopup)
        $video.addEventListener('ended', forceNextVideo)
    }

    bypassPopup() {
        const popup = this.popupContainer.popups_?.[this.popupName]

        if (!popup) return

        this.api.playVideo()

        popup.popup.remove()
        delete this.popupContainer.popups_[this.popupName]
    }

    forceNextVideo() {
        if (this.autoNavEnabled && !document.hasFocus()) this.api.nextVideo()
    }

    onToggleAutoNav() {
        this.autoNavEnabled = !this.autoNavEnabled
    }
}

const init = async () => {
    const isEmbed = location.pathname.startsWith('/embed/')

    if (isEmbed) await new Promise(r => $('.html5-main-video').addEventListener('canplay', r, {once: true}))

    new Player().init(isEmbed)
}

const volumeTextStyle = `
.ytbp-volume-text {
    position: relative;
    top: -0.5px;
    width: 0;
    text-indent: 2px;
    overflow: hidden;
    color: #ddd;
    font-size: 109%;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    transition: width .2s
}
.ytbp-volume-text:after { content: '%' }
.ytp-volume-control-hover:not([aria-valuenow="0"], [aria-valuenow="100"]) + .ytbp-volume-text {
    width: 2.5em
}
`

const $ = (sel, el = document) => el.querySelector(sel)

const wait = (ms) => new Promise(r => setTimeout(r, ms))


init()