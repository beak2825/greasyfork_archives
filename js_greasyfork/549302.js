// ==UserScript==
// @name        Youtube 恒定显示进度条
// @name:zh-CN  Youtube 恒定显示进度条
// @namespace   Violentmonkey Scripts
// @author      Jifu
// @description 让你恒常地显示油管上的进度条(显示播放时间比例的红色条)。
// @include     https://www.youtube.com/*
// @include     https://www.youtube-nocookie.com/embed/*
// @exclude     https://www.youtube.com/live_chat*
// @exclude     https://www.youtube.com/live_chat_replay*
// @version     1.1.0
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549302/Youtube%20%E6%81%92%E5%AE%9A%E6%98%BE%E7%A4%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/549302/Youtube%20%E6%81%92%E5%AE%9A%E6%98%BE%E7%A4%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

;(function () {
    const SCRIPTID = "YouTubeProgressBarPreserver"
    const BAR_HEIGHT = 4 // px，自定义进度条高度
    const BAR_COLOR = "#f00" // 进度条颜色
    const BUFFER_COLOR = "rgba(255,255,255,.4)"
    const AD_COLOR = "#fc0"
    const DEBUG = false

    // 辅助函数
    function $(selector, root = document) {
        return root.querySelector(selector)
    }
    function $$(selector, root = document) {
        return Array.from(root.querySelectorAll(selector))
    }
    function createElement(html = "<span></span>") {
        const outer = document.createElement("div")
        outer.innerHTML = html
        return outer.firstElementChild
    }
    function log(...args) {
        if (DEBUG) console.log(SCRIPTID, ...args)
    }
    function isLive(timeElem) {
        return timeElem?.classList.contains("ytp-live")
    }

    // 添加样式
    function addStyle() {
        const style = createElement(`
      <style id="${SCRIPTID}-style">
        #${SCRIPTID}-bar {
          --height: ${BAR_HEIGHT}px;
          --background: rgba(255,255,255,.2);
          --color: ${BAR_COLOR};
          --ad-color: ${AD_COLOR};
          --buffer-color: ${BUFFER_COLOR};
          position: absolute;
          width: 100%;
          height: var(--height);
          left: 0; bottom: 0;
          background: var(--background);
          opacity: 0;
          z-index: 100;
          transition: opacity .25s cubic-bezier(0.0,0.0,0.2,1);
          pointer-events: none;
        }
        #${SCRIPTID}-bar.active {
          opacity: 1;
        }
        #${SCRIPTID}-progress,
        #${SCRIPTID}-buffer {
          position: absolute;
          height: var(--height);
          width: 100%;
          left: 0; top: 0;
          transform-origin: 0 0;
          transition: transform .25s linear;
        }
        #${SCRIPTID}-progress {
          background: var(--color);
          z-index: 1;
        }
        .ad-interrupting #${SCRIPTID}-progress {
          background: var(--ad-color);
        }
        #${SCRIPTID}-buffer {
          background: var(--buffer-color);
        }
        .ytp-autohide #${SCRIPTID}-bar.active {
          opacity: 1;
        }
        .ytp-ad-persistent-progress-bar-container {
          display: none !important;
        }
      </style>
    `)
        document.head.appendChild(style)
    }

    // 创建并插入自定义进度条
    function appendBar(playerElem) {
        if ($("#" + SCRIPTID + "-bar", playerElem)) return
        const bar = createElement(`
      <div id="${SCRIPTID}-bar">
        <div id="${SCRIPTID}-progress"></div>
        <div id="${SCRIPTID}-buffer"></div>
      </div>
    `)
        playerElem.appendChild(bar)
        log("自定义进度条已插入")
    }

    // 绑定进度条逻辑
    function bindProgressBar(playerElem, videoElem, timeElem) {
        const bar = $("#" + SCRIPTID + "-bar", playerElem)
        const progress = $("#" + SCRIPTID + "-progress", bar)
        const buffer = $("#" + SCRIPTID + "-buffer", bar)

        // 监听直播状态
        function updateLiveState() {
            if (isLive(timeElem)) {
                bar.classList.remove("active")
            } else {
                bar.classList.add("active")
            }
        }
        updateLiveState()
        const liveObserver = new MutationObserver(updateLiveState)
        liveObserver.observe(timeElem, { attributes: true })

        // 监听视频进度
        videoElem.addEventListener("timeupdate", () => {
            progress.style.transform = `scaleX(${
                videoElem.currentTime / videoElem.duration
            })`
        })
        videoElem.addEventListener("durationchange", () => {
            progress.style.transform = "scaleX(0)"
        })
        videoElem.addEventListener("progress", () => {
            let end = 0
            for (let i = 0; i < videoElem.buffered.length; i++) {
                if (videoElem.currentTime < videoElem.buffered.start(i))
                    continue
                end = videoElem.buffered.end(i)
            }
            buffer.style.transform = `scaleX(${end / videoElem.duration})`
        })
        videoElem.addEventListener("seeking", () => {
            let end = 0
            for (let i = 0; i < videoElem.buffered.length; i++) {
                if (videoElem.currentTime < videoElem.buffered.start(i))
                    continue
                end = videoElem.buffered.end(i)
            }
            buffer.style.transform = `scaleX(${end / videoElem.duration})`
        })
    }

    // 入口
    function main() {
        addStyle()

        // 用 MutationObserver 监听播放器变化
        const observer = new MutationObserver(() => {
            const player = $(".html5-video-player")
            const video = $("video")
            const time = $(".ytp-time-display")
            if (player && video && time) {
                appendBar(player)
                bindProgressBar(player, video, time)
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })

        // 处理单页应用路由变化
        let lastUrl = location.href
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href
                setTimeout(() => {
                    const player = $(".html5-video-player")
                    const video = $("video")
                    const time = $(".ytp-time-display")
                    if (player && video && time) {
                        appendBar(player)
                        bindProgressBar(player, video, time)
                    }
                }, 500)
            }
        }, 1000)
    }

    main()
})()
