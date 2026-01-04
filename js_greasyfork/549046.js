// ==UserScript==
// @name         Left-Handed Video Shortcuts
// @namespace    https://github.com/dzist
// @version      0.0.20
// @description  A set of shortcuts designed for the Left-Hand style while watching videos
// @description:zh-CN  专为左手人士设计的视频快捷键
// @author       Dylan Zhang
// @license      MIT
// @include      *://*.youtube.com/*
// @include      *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549046/Left-Handed%20Video%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/549046/Left-Handed%20Video%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* utilities */
    const utils = {
        ensureCondition(condition, maxAttempts = 600 /* 10s */, failureMessage) {
            return new Promise((resolve, reject) => {
                let attempts = 0
                const detect = () => {
                    const result = condition()
                    if (result) {
                        resolve(result)
                    } else if (attempts < maxAttempts) {
                        attempts++
                        requestAnimationFrame(detect)
                    } else {
                        reject(new Error(failureMessage))
                    }
                }
                requestAnimationFrame(detect)
            })
        },
        ensureElement(selector, maxAttempts = 600) {
            return utils.ensureCondition(
                () => document.querySelector(selector),
                maxAttempts,
                `Could not detect ${selector} after ${maxAttempts} attempts`
            )
        }
    }

    class Indicator {
        constructor() {
            this.el = null
            this.hasInited = false
            this.timer = null
            this.duration = 0.5
            this.id = 'wasd-indicator'
            this.activeClass = 'wasd-indicator-active'
        }
        initialize() {
            this.injectStyle()
            this.injectElement()
        }
        injectStyle() {
            const { id, activeClass, duration } = this
            const style = document.createElement('style')
            style.id = `${id}-style`
            style.textContent = `
            #${id} {
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
              min-width: 50px;
              height: 50px;
              padding: 0 10px;
              background: #000;
              font-size: 18px;
              font-weight: bold;
              color: #fff;
              border-radius: 10px;
              opacity: 0;
              transition: opacity ${duration}s ease;
              position: fixed;
              left: 10px;
              bottom: 10px;
              z-index: -1;
            }
            #${id}.${activeClass} {
              opacity: 1;
              z-index: 99;
            }
            `
            document.body.appendChild(style)
        }
        injectElement() {
            const el = document.createElement('div')
            el.id = this.id
            document.body.appendChild(this.el = el)
        }
        show(text) {
            if (!this.hasInited) {
                this.hasInited = true
                this.initialize()
                // Force to excute a reflow to
                // ensure that the animation can be run at the first time
                void this.el.offsetWidth
            }

            const { el, activeClass } = this
            el.textContent = text
            el.classList.add(activeClass)

            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                el.classList.remove(activeClass)
                this.timer = null
            }, 800)
        }
    }

    class Shortcuts {
        constructor(meida, indicator) {
            this.media = meida
            this.indicator = indicator

            this.isVisible = false
            this.seekStep = 5
            this.volume = 1
            this.volumeStep = 0.1
            this.playbackRate = 1
            this.playbackRateStep = 0.25
            this.minPlaybackRate = 0.5

            this.allowedKeysList = {
                w: () => {
                    const volume = this.currentVolume
                    let text = '⬆'
                    if (volume === 1) text += 'Max'
                    return text
                },
                s: () => {
                    const volume = this.currentVolume
                    let text = '⬇︎'
                    if (volume === 0) text += 'Min'
                    return text
                },
                a: '⬅︎',
                d: '➡︎',
                1: 'x1',
                2: 'x2',
                3: 'x3',
                4: 'x4',
                5: 'x5',
                r: () => `x${this.playbackRate}`,
                x: ['Off', 'On']
            }

            this.watcher = null

            this.bindEvents()
            this.watch()
        }
        bindEvents() {
            window.addEventListener('keydown', this.handleKeyDown, { capture: true })
            window.addEventListener('beforeunload', this.handleBeforeUnload)
        }
        handleKeyDown = (event) => {
            if (this.isTyping) return

            // the key is uppercase while pressing with the shift key
            const key = event.key.toLowerCase()
            let text = this.allowedKeysList[key]
            // not in the allowed keys or with ctrl/command key
            if (!text || event.metaKey || event.ctrlKey) return

            event.stopImmediatePropagation()
            switch(key) {
                case 'w': // increase volume
                    this.increaseVolume()
                    break
                case 's': // decrease volume
                    this.decreaseVolume()
                    break
                case 'a': // rewind
                    this.seek(this.currentTime - this.seekStep)
                    break
                case 'd': // fast forward
                    this.seek(this.currentTime + this.seekStep)
                    break
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    this.setPlaybackRate(parseInt(event.key))
                    break
                case 'r':
                    event.shiftKey
                        ? this.decreasePlaybackRate()
                        : this.increasePlaybackRate()
                    break
            }

            if (this.isVisible) {
                if (key === 'x') {
                    this.isVisible = false
                    text = text[0]
                }
                if (typeof text === 'function') {
                    text = text()
                }
                this.indicator.show(text)
            } else {
                if (key === 'x') {
                    this.isVisible = true
                    this.indicator.show(text[1])
                }
            }
        }
        handleBeforeUnload = () => {
            window.removeEventListener('keydown', this.handleKeydown)
            window.removeEventListener('beforeunload', this.handleBeforeUnload)

            this.watcher.stop()
            this.media = null
        }

        watch() {
            this.watcher = this.createWatcher(this.media, () => {
                this.setPlaybackRate(this.playbackRate)
                this.setVolume(this.volume)
            })
        }
        createWatcher(media, callback) {
            const observer = new MutationObserver((mutationList) => {
                for (const mutation of mutationList) {
                    if (mutation.attributeName === 'src') {
                        callback && callback()
                        break
                    }
                }
            })
            observer.observe(media, {
                attributes: true
            })

            const stop = () => observer.disconnct()
            return {
                stop
            }
        }

        seek(time) {
            this.media.currentTime = time
        }
        get currentTime() {
            return this.media.currentTime
        }

        get currentVolume() {
            return this.media.volume
        }
        setVolume(volume) {
            this.volume = this.media.volume = volume
        }
        increaseVolume() {
            const volume = Math.min(this.media.volume + this.volumeStep, 1)
            this.setVolume(volume)
        }
        decreaseVolume() {
            const volume = Math.max(this.media.volume - this.volumeStep, 0)
            this.setVolume(volume)
        }

        setPlaybackRate(playbackRate) {
            this.playbackRate = this.media.playbackRate = playbackRate
        }
        increasePlaybackRate() {
            const rate = this.playbackRate + this.playbackRateStep
            this.setPlaybackRate(rate)
        }
        decreasePlaybackRate() {
            const rate = Math.max(this.playbackRate - this.playbackRateStep, this.minPlaybackRate)
            this.setPlaybackRate(rate)
        }

        get isTyping() {
            const activeElement = document.activeElement
            return activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                activeElement.isContentEditable === true
        }
    }

    utils.ensureElement('video').then(video => {
        new Shortcuts(video, new Indicator())
    })
})();