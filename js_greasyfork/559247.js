// ==UserScript==
// @name                Maximize Video
// @name:zh-CN          视频网页全屏-自用
// @namespace           none
// @description         Maximize all video players.Support Piture-in-picture.   12.0.1 修复youtube层叠显示错误
// @description:zh-CN   让所有视频网页全屏，开启画中画功能
// @author              lzx 改自 冻猫
// @include             *
// @exclude             *www.w3school.com.cn*
// @version             12.0.1
// @run-at              document-end
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/559247/Maximize%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/559247/Maximize%20Video.meta.js
// ==/UserScript==



;(() => {
  const gv = {
    isFull: false,
    isIframe: false,
    autoCheckCount: 0,
  }

  const html5Rules = {
    "www.acfun.cn": [".player-container .player"],
    "www.bilibili.com": ["#bilibiliPlayer"],
    "www.douyu.com": ["#js-player-video-case"],
    "www.huya.com": ["#videoContainer"],
    "www.twitch.tv": [".player"],
    "www.youtube.com": ["#movie_player", "#player"],
    "www.yy.com": ["#player"],
    "*weibo.com": ['[aria-label="Video Player"]', ".html5-video-live .html5-video"],
    "v.huya.com": ["#video_embed_flash>div"],
  }

  const generalPlayerRules = [".dplayer", ".video-js", ".jwplayer", "[data-player]"]

  if (window.top !== window.self) {
    gv.isIframe = true
  }

  if (navigator.language.toLocaleLowerCase() == "zh-cn") {
    gv.btnText = {
      max: "网页全屏",
      pip: "画中画",
      tip: "Iframe内视频，请用鼠标点击视频后重试",
    }
  } else {
    gv.btnText = {
      max: "Maximize",
      pip: "PicInPic",
      tip: "Iframe video. Please click on the video and try again",
    }
  }

  const tool = {
    print(log) {
      const now = new Date()
      const year = now.getFullYear()
      const month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1)
      const day = (now.getDate() < 10 ? "0" : "") + now.getDate()
      const hour = (now.getHours() < 10 ? "0" : "") + now.getHours()
      const minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
      const second = (now.getSeconds() < 10 ? "0" : "") + now.getSeconds()
      const timenow = "[" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "]"
      console.log(timenow + "[Maximize Video] > " + log)
    },
    getRect(element) {
      const rect = element.getBoundingClientRect()
      const scroll = tool.getScroll()
      return {
        pageX: rect.left + scroll.left,
        pageY: rect.top + scroll.top,
        screenX: rect.left,
        screenY: rect.top,
      }
    },
    getScroll() {
      return {
        left: document.documentElement.scrollLeft || document.body.scrollLeft,
        top: document.documentElement.scrollTop || document.body.scrollTop,
      }
    },
    addStyle(css) {
      const style = document.createElement("style")
      style.type = "text/css"
      const node = document.createTextNode(css)
      style.appendChild(node)
      document.head.appendChild(style)
      return style
    },
    matchRule(str, rule) {
      return new RegExp("^" + rule.split("*").join(".*") + "$").test(str)
    },
    createButton(id) {
      const btn = document.createElement("tbdiv")
      btn.id = id
      btn.onclick = () => {
        maximize.playerControl()
      }
      document.body.appendChild(btn)
      return btn
    },
  }

  const setButton = {
    init() {
      if (!document.getElementById("playerControlBtn")) {
        init()
      }
      if (gv.isIframe && gv.player && tool.isHalfFullClient(gv.player)) {
        window.parent.postMessage("iframeVideo", "*")
        return
      }
      this.show()
    },
    show() {
      gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
      gv.player.addEventListener("mouseleave", handle.leavePlayer, false)
      gv.controlBtn.style.display = "block"
      gv.controlBtn.style.visibility = "visible"
      if (document.pictureInPictureEnabled && gv.player.nodeName != "OBJECT" && gv.player.nodeName != "EMBED") {
        gv.picinpicBtn.style.display = "block"
        gv.picinpicBtn.style.visibility = "visible"
      }
      this.locate()
    },
    locate() {
      const playerRect = tool.getRect(gv.player)
      gv.controlBtn.style.opacity = "0.5"
      gv.controlBtn.innerHTML = gv.btnText.max
      gv.controlBtn.style.top = playerRect.screenY - 20 + "px"
      gv.controlBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth + "px"
      gv.picinpicBtn.style.opacity = "0.5"
      gv.picinpicBtn.innerHTML = gv.btnText.pip
      gv.picinpicBtn.style.top = gv.controlBtn.style.top
      gv.picinpicBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth - 54 + "px"
    },
  }

  const handle = {
    getPlayer(e) {
      if (gv.isFull) return
      gv.mouseoverEl = e.target
      const hostname = document.location.hostname
      let players = []
      for (let i in html5Rules) {
        if (tool.matchRule(hostname, i)) {
          for (let html5Rule of html5Rules[i]) {
            if (document.querySelectorAll(html5Rule).length > 0) {
              for (let player of document.querySelectorAll(html5Rule)) {
                players.push(player)
              }
            }
          }
          break
        }
      }
      if (players.length == 0) {
        for (let generalPlayerRule of generalPlayerRules) {
          if (document.querySelectorAll(generalPlayerRule).length > 0) {
            for (let player of document.querySelectorAll(generalPlayerRule)) {
              players.push(player)
            }
          }
        }
      }
      if (players.length > 0) {
        const path = e.path || e.composedPath()
        for (let v of players) {
          if (path.indexOf(v) > -1) {
            gv.player = v
            setButton.init()
            return
          }
        }
      }
      switch (e.target.nodeName) {
        case "VIDEO":
        case "OBJECT":
        case "EMBED":
          if (e.target.offsetWidth > 399 && e.target.offsetHeight > 220) {
            gv.player = e.target
            setButton.init()
          }
          break
        default:
          handle.leavePlayer()
      }
    },
    leavePlayer() {
      if (gv.controlBtn.style.visibility == "visible") {
        gv.controlBtn.style.opacity = ""
        gv.controlBtn.style.visibility = ""
        gv.picinpicBtn.style.opacity = ""
        gv.picinpicBtn.style.visibility = ""
        gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
      }
    },
    hotKey(e) {
      if (e.keyCode == 27) {
        maximize.playerControl()
      }
      if (e.keyCode == 113) {
        handle.pictureInPicture()
      }
    },
    pictureInPicture() {
      if (!document.pictureInPictureElement) {
        if (gv.player) {
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("iframePicInPic", "*")
          } else {
            gv.player.parentNode.querySelector("video").requestPictureInPicture()
          }
        } else {
          document.querySelector("video").requestPictureInPicture()
        }
      } else {
        document.exitPictureInPicture()
      }
    },
  }

  const maximize = {
    playerControl() {
      if (!gv.player) return
      this.checkParent()
      if (!gv.isFull) {
        if (gv.isIframe) {
          window.parent.postMessage("parentFull", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerFull", "*")
        }
        this.fullWin()
      } else {
        if (gv.isIframe) {
          window.parent.postMessage("parentSmall", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerSmall", "*")
        }
        this.smallWin()
      }
    },
    checkParent() {
      if (gv.isFull) return
      gv.playerParents = []
      let full = gv.player
      while ((full = full.parentNode)) {
        if (full.nodeName == "BODY") break
        if (full.getAttribute) gv.playerParents.push(full)
      }
    },
    fullWin() {
      if (!gv.isFull) {
        document.removeEventListener("mouseover", handle.getPlayer, false)
        gv.backHtmlId = document.body.parentNode.id
        gv.backBodyId = document.body.id

        if (document.location.hostname === "www.youtube.com") {
          const watchFlexy = document.querySelector("ytd-watch-flexy")
          if (watchFlexy && !watchFlexy.hasAttribute("theater")) {
            watchFlexy.setAttribute("theater", "")
            gv.ytbTheater = true
          }
        }

        gv.leftBtn.style.display = "block"
        gv.rightBtn.style.display = "block"
        this.addClass()
      }
      gv.isFull = true
    },
    addClass() {
      document.body.parentNode.id = "htmlToothbrush"
      document.body.id = "bodyToothbrush"
      for (let v of gv.playerParents) {
        v.classList.add("parentToothbrush")
        if (getComputedStyle(v).position == "fixed") {
          v.classList.add("absoluteToothbrush")
        }
      }
      gv.player.classList.add("playerToothbrush")
      if (gv.player.nodeName == "VIDEO") {
        gv.backControls = gv.player.controls
        gv.player.controls = true
      }
      window.dispatchEvent(new Event("resize"))
    },
    smallWin() {
      document.body.parentNode.id = gv.backHtmlId
      document.body.id = gv.backBodyId
      for (let v of gv.playerParents) {
        v.classList.remove("parentToothbrush")
        v.classList.remove("absoluteToothbrush")
      }
      gv.player.classList.remove("playerToothbrush")

      if (document.location.hostname === "www.youtube.com" && gv.ytbTheater) {
        const watchFlexy = document.querySelector("ytd-watch-flexy[theater]")
        if (watchFlexy) watchFlexy.removeAttribute("theater")
        gv.ytbTheater = false
      }

      if (gv.player.nodeName == "VIDEO") {
        gv.player.controls = gv.backControls
      }
      gv.leftBtn.style.display = ""
      gv.rightBtn.style.display = ""
      document.addEventListener("mouseover", handle.getPlayer, false)
      window.dispatchEvent(new Event("resize"))
      gv.isFull = false
    },
  }

  const init = () => {
    gv.picinpicBtn = document.createElement("tbdiv")
    gv.picinpicBtn.id = "picinpicBtn"
    gv.picinpicBtn.onclick = () => handle.pictureInPicture()
    document.body.appendChild(gv.picinpicBtn)
    gv.controlBtn = tool.createButton("playerControlBtn")
    gv.leftBtn = tool.createButton("leftFullStackButton")
    gv.rightBtn = tool.createButton("rightFullStackButton")

    tool.addStyle(
      [
        "#htmlToothbrush, #bodyToothbrush {overflow:hidden !important;zoom:100% !important;}",
        "#htmlToothbrush #bodyToothbrush .parentToothbrush {overflow:visible !important;z-index:auto !important;transform:none !important;-webkit-transform-style:flat !important;transition:none !important;contain:none !important;}",
        "#htmlToothbrush #bodyToothbrush .absoluteToothbrush {position:absolute !important;}",
        "#htmlToothbrush #bodyToothbrush .parentToothbrush .bilibili-player-video {margin:0 !important;}",
        "#htmlToothbrush #bodyToothbrush .playerToothbrush {position:fixed !important;top:0px !important;left:0px !important;width:100vw !important;height:100vh !important;max-width:none !important;max-height:none !important;min-width:0 !important;min-height:0 !important;margin:0 !important;padding:0 !important;z-index:2147483646 !important;border:none !important;background-color:#000 !important;transform:none !important;}",
        "#htmlToothbrush #bodyToothbrush .parentToothbrush video {object-fit:contain !important;}",
        "#htmlToothbrush #bodyToothbrush .parentToothbrush .videoToothbrush {width:100vw !important;height:100vh !important;}",
        /* YouTube 专属隐藏：隐藏顶部栏、侧边栏、相关视频区、视频下方所有元信息（标题、描述、频道、订阅按钮、评论等） */
        "#htmlToothbrush #bodyToothbrush #masthead-container, #htmlToothbrush #bodyToothbrush ytd-watch-flexy #secondary, #htmlToothbrush #bodyToothbrush #related, #htmlToothbrush #bodyToothbrush ytd-watch-metadata, #htmlToothbrush #bodyToothbrush ytd-watch-flexy #primary #below, #htmlToothbrush #bodyToothbrush ytd-watch-flexy #info, #htmlToothbrush #bodyToothbrush ytd-watch-flexy #meta {display:none !important;}",
        '#playerControlBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:64px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #playerControlBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
        '#picinpicBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:53px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #picinpicBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
        "#leftFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;left:0;z-index:2147483647;background:#000;}",
        "#rightFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;right:0;z-index:2147483647;background:#000;}",
      ].join("\n")
    )

    document.addEventListener("mouseover", handle.getPlayer, false)
    document.addEventListener("keydown", handle.hotKey, false)
    tool.print("Ready")
  }

  init()
})()