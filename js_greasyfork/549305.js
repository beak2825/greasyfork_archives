// ==UserScript==
// @name         Bilibili 恒定显示进度条
// @name:zh-CN   Bilibili 恒定显示进度条
// @namespace    bilibili.com
// @version      1.0
// @description  让B站视频进度条始终显示，不随控制栏自动隐藏。
// @author       Jifu
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549305/Bilibili%20%E6%81%92%E5%AE%9A%E6%98%BE%E7%A4%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/549305/Bilibili%20%E6%81%92%E5%AE%9A%E6%98%BE%E7%A4%BA%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

;(function () {
    const SCRIPTID = "BilibiliProgressBarPreserver"
    const BAR_HEIGHT = 4
    const BAR_COLOR = "#fa5a5a"
    const BUFFER_COLOR = "rgba(255,255,255,.4)"

    // 插入自定义样式
    function addStyle() {
        const style = document.createElement("style")
        style.id = SCRIPTID + "-style"
        style.textContent = `
      #${SCRIPTID}-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: ${BAR_HEIGHT}px;
        background: rgba(255,255,255,.15);
        z-index: 100;
        pointer-events: none;
      }
      #${SCRIPTID}-progress {
        position: absolute;
        left: 0;
        top: 0;
        height: ${BAR_HEIGHT}px;
        background: ${BAR_COLOR};
        z-index: 101;
        width: 0;
        transition: width .2s linear;
      }
      #${SCRIPTID}-buffer {
        position: absolute;
        left: 0;
        top: 0;
        height: ${BAR_HEIGHT}px;
        background: ${BUFFER_COLOR};
        z-index: 100;
        width: 0;
        transition: width .2s linear;
      }
    `
        document.head.appendChild(style)
    }

    // 获取播放器容器
    function getPlayerContainer() {
        // B站主播放器
        return (
            document.querySelector(".bpx-player-video-wrap") ||
            document.querySelector(".bilibili-player-video-wrap")
        )
    }

    // 获取视频元素
    function getVideo() {
        return document.querySelector("video")
    }

    // 插入进度条
    function appendBar(container) {
        if (!container || document.getElementById(SCRIPTID + "-bar")) return
        const bar = document.createElement("div")
        bar.id = SCRIPTID + "-bar"
        bar.innerHTML = `
      <div id="${SCRIPTID}-buffer"></div>
      <div id="${SCRIPTID}-progress"></div>
    `
        container.appendChild(bar)
    }

    // 绑定进度逻辑
    function bindProgressBar(video) {
        const bar = document.getElementById(SCRIPTID + "-bar")
        if (!bar) return
        const progress = document.getElementById(SCRIPTID + "-progress")
        const buffer = document.getElementById(SCRIPTID + "-buffer")
        // 进度
        video.addEventListener("timeupdate", () => {
            const percent = video.duration
                ? video.currentTime / video.duration
                : 0
            progress.style.width = `${percent * 100}%`
        })
        // 缓冲
        video.addEventListener("progress", () => {
            let end = 0
            for (let i = 0; i < video.buffered.length; i++) {
                if (video.currentTime < video.buffered.start(i)) continue
                end = video.buffered.end(i)
            }
            const percent = video.duration ? end / video.duration : 0
            buffer.style.width = `${percent * 100}%`
        })
        // 视频切换时重置
        video.addEventListener("durationchange", () => {
            progress.style.width = "0"
            buffer.style.width = "0"
        })
    }

    // 主流程
    function main() {
        addStyle()
        let lastContainer = null,
            lastVideo = null

        // 监听DOM变化（B站页面经常AJAX切换）
        const observer = new MutationObserver(() => {
            const container = getPlayerContainer()
            const video = getVideo()
            if (container && video && container !== lastContainer) {
                appendBar(container)
                bindProgressBar(video)
                lastContainer = container
                lastVideo = video
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })

        // 处理路由切换
        let lastUrl = location.href
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href
                setTimeout(() => {
                    const container = getPlayerContainer()
                    const video = getVideo()
                    if (container && video) {
                        appendBar(container)
                        bindProgressBar(video)
                        lastContainer = container
                        lastVideo = video
                    }
                }, 500)
            }
        }, 1000)
    }

    main()
})()
