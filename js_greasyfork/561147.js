// ==UserScript==
// @name         [YouTube] Outside-Player-Bar [20260102] v1.2.0
// @namespace    https://github.com/0-V-linuxdo/YouTube-Outside-Player-Bar
// @license      MIT
// @description  Display YouTube's player bar outside the video.
//
// @version      [20260102] v1.2.0
// @update-log   [20260102] v1.2.0 - 修复 YouTube 新 UI 下按钮垂直位置偏下
//
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
//
// @run-at       document-start
// @grant        none
//
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAWJAAAFiQFtaJ36AAACy0lEQVR42u3b3ZGbMBhG4deZ3FIBDcgN0ABugAbcADRgCkANoAJEA2oAGqCBpQHuM0MBzkXGe5HJbPyXyQidUwGGZ/gksXswxlxFyfaNWwAAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAP87Y4yaplFRFDzVFAGcTifVdS3vvfq+V57nPN1UR0BZlhrHUU3TKMsynnKqa4C6rhVCUFVVPOlUF4F5nqvrOnnvWR+kvAsoikLee3Vdx/og5W1gVVUKIahpGp5+qucAWZaprmuN46iyLAGQanmeq+97ee9ljAFAqhVFoRCCuq5LbtsIgN/WB9M06Xw+AyDVsizT5XLROI5JbBsB8MX6wHsv7/2ut40AuGN9sOdjZQDcWV3XmqZpd8fKAHhwfdB1nUIIu1kfAOCJjDG7+ewMgBcqy/LzWDnW9QEA3jAWYv7sDIA3bhtvn51jehsA4B9sG4/HIwBSLYSgj4+PaK73O4/sPc3zLOec5nmO6roB8GLruso5pxBClNcPgBdyzsl7r23bov0NAHiiaZpkrdW6rtH/FgA80LIsstZGN+cB8GLbtqnvew3DsLvfBoC/NAyD+r6Pes4D4MltXdu2u5jzAHhwW9e27a7mPADunPO3131KAUC/jm+ttbud8wD4Ys5ba7UsS7L3IEkA67rKWqtpmpJ/+yUF4DbnYz++BcCTc945t/ttHQD+MOdj/EwLgDe87q210X6mBcAL7eEzLQAezHv/OeuZ8/d3MMZcuQ3pxh+FAoAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgAFBEHa7XK/8dzBuAAEAAIAAQAAgABAACAAGA9t7hh8RJIG8AAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAAKCY+wnlPORj5a0IYQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/561147/%5BYouTube%5D%20Outside-Player-Bar%20%5B20260102%5D%20v120.user.js
// @updateURL https://update.greasyfork.org/scripts/561147/%5BYouTube%5D%20Outside-Player-Bar%20%5B20260102%5D%20v120.meta.js
// ==/UserScript==

// ================================================
// 原插件信息：
// 名称：Outside-YouTube-Player-Bar
// 作者：1natsu172
// 链接：https://github.com/1natsu172/Outside-YouTube-Player-Bar/releases/tag/v3.0.10
// 版本：3.0.10
// ================================================

(() => {
  'use strict'

  const SCRIPT = {
    styleId: 'oypb-userscript-style',
    buttonId: 'oypb-toggleExtension',
    storageKey: 'oypb:outsideEnabled',
  }

  const CLASS = {
    isVisiblePlayerBar: 'oypb-is-visible-playerBar',
    isOutsidePlayerBar: 'oypb-is-outside-playerBar',
    isFullscreen: 'oypb-is-fullscreen',
  }

  const TOOLTIP_TEXT = {
    whenOutside: 'Inside player bar',
    whenInside: 'Outside player bar',
  }

  const state = {
    outsideEnabled: true,
    playerObserver: null,
    resizeObserver: null,
    syncToken: 0,
    queued: false,
  }

  const readStoredOutsideEnabled = () => {
    try {
      const raw = localStorage.getItem(SCRIPT.storageKey)
      if (raw === null) return true
      return raw === 'true'
    } catch {
      return true
    }
  }

  const writeStoredOutsideEnabled = (value) => {
    try {
      localStorage.setItem(SCRIPT.storageKey, String(value))
    } catch {
      // ignore
    }
  }

  const isVideoPage = () => {
    const pathName = location.pathname
    const userLivePagePathnamePattern = /^\/@?[^/]+\/live$/
    return pathName === '/watch' || userLivePagePathnamePattern.test(pathName)
  }

  const ensureStyle = () => {
    if (document.getElementById(SCRIPT.styleId)) return
    const style = document.createElement('style')
    style.id = SCRIPT.styleId
    style.textContent = `
:root{
  --oypb-player-bar-height: 51px;
  --oypb-player-bar-fill-lr-gap-size: 12px;
  --oypb-player-bar-color: rgb(15, 15, 15);
  --oypb-transition-in: .25s cubic-bezier(0.0, 0.0, 0.2, 1);
  --oypb-transition-out: 0s cubic-bezier(0.4, 0.0, 1, 1);
}
:root .oypb-is-fullscreen{
  --oypb-player-bar-height: 58px;
  --oypb-player-bar-fill-lr-gap-size: 24px;
  --oypb-player-ytp-chrome-top: 63px;
}
:root[dark]{
  --oypb-player-bar-color: var(--yt-spec-base-background, rgb(15, 15, 15));
}
.oypb-is-none{display:none !important;}
.oypb-toggleExtensionButton{
  text-align:center !important;
  vertical-align:top;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  line-height:0 !important;
  align-self:center !important;
  overflow:visible !important;
}
.oypb-toggleExtensionButton>svg{
  vertical-align:middle;
  display:block;
  width:18px;
  height:16px;
  transition:none !important;
}
.oypb-is-fullscreen .oypb-toggleExtensionButton>svg{
  width:25px;
  height:22.222px;
}
.oypb-tooltip{
  position:relative;
  overflow:visible;
  transition:opacity .1s cubic-bezier(0.4,0.0,1,1);
}
.oypb-tooltip:hover::after{
  content:attr(data-oypb-tooltip);
  opacity:1;
  position:absolute;
  top:-38px;
  left:50%;
  transform:translateX(-50%);
  white-space:nowrap;
  display:block;
  background-color:rgba(28,28,28,0.9);
  border-radius:2px;
  padding:5px 9px;
  font-size:12.98px;
  font-weight:500;
  line-height:15px;
}

.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} #primary{
  transition:opacity var(--oypb-transition-in), transform var(--oypb-transition-in) !important;
}
.${CLASS.isOutsidePlayerBar} #primary{
  transform:translate3d(0, var(--oypb-player-bar-height), 0);
  transition:opacity var(--oypb-transition-out), transform var(--oypb-transition-out) !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} #columns{overflow-y:hidden;}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} #player{
  transition:opacity var(--oypb-transition-in), transform var(--oypb-transition-in) !important;
}
.${CLASS.isOutsidePlayerBar} #player{
  transform:translate3d(0, calc(-1 * var(--oypb-player-bar-height)), 0);
  transition:opacity var(--oypb-transition-out), transform var(--oypb-transition-out) !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .html5-video-player{
  overflow:visible;
  contain:size style layout;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy{
  overflow:visible;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-chrome-bottom{
  background-color:var(--oypb-player-bar-color);
  transition:opacity var(--oypb-transition-in), transform var(--oypb-transition-in) !important;
}
.${CLASS.isOutsidePlayerBar} .ytp-chrome-bottom{
  transform:translate3d(0, var(--oypb-player-bar-height), 0);
  transition:opacity var(--oypb-transition-out), transform var(--oypb-transition-out) !important;
}
.${CLASS.isOutsidePlayerBar} #movie_player .ytp-chrome-bottom,
.${CLASS.isOutsidePlayerBar} #movie_player .ytp-chrome-bottom .ytp-chrome-controls{
  opacity:1 !important;
  visibility:visible !important;
  pointer-events:auto !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-chrome-bottom .ytp-left-controls::before,
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-chrome-bottom .ytp-right-controls::after{
  content:'';
  display:block;
  height:100%;
  width:var(--oypb-player-bar-fill-lr-gap-size);
  position:absolute;
  top:0;
  background-color:var(--oypb-player-bar-color);
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-chrome-bottom .ytp-left-controls::before{
  left:calc(-1 * var(--oypb-player-bar-fill-lr-gap-size));
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-chrome-bottom .ytp-right-controls::after{
  right:calc(-1 * var(--oypb-player-bar-fill-lr-gap-size));
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .oypb-toggleExtensionButton>svg{
  transform:rotateX(180deg);
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ended-mode .html5-main-video{
  visibility:hidden !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-iv-player-content{bottom:12px;}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-tooltip{
  transform:translate3d(0, var(--oypb-player-bar-height), 0) !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .caption-window.ytp-caption-window-bottom{
  transform:translate3d(0, var(--oypb-player-bar-height), 0);
  transition:opacity var(--oypb-transition-in), transform var(--oypb-transition-in) !important;
}
.${CLASS.isOutsidePlayerBar} .caption-window.ytp-caption-window-bottom{
  transition:opacity var(--oypb-transition-out), transform var(--oypb-transition-out) !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-settings-menu{
  transform:translate3d(0, var(--oypb-player-bar-height), 0);
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} .ytp-gradient-bottom{display:none;}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} ytd-watch-flexy[theater] #secondary,
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar} ytd-watch-flexy[fullscreen] #secondary{
  transform:translate3d(0, var(--oypb-player-bar-height), 0);
  transition:opacity var(--oypb-transition-in), transform var(--oypb-transition-in) !important;
}
.${CLASS.isOutsidePlayerBar} #secondary{
  transition:opacity var(--oypb-transition-out), transform var(--oypb-transition-out) !important;
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar}.${CLASS.isFullscreen} .ytp-chrome-top{
  transform:translateY(calc(-1 * var(--oypb-player-ytp-chrome-top)));
}
.${CLASS.isOutsidePlayerBar}.${CLASS.isVisiblePlayerBar}.${CLASS.isFullscreen} .ytp-big-mode .ytp-gradient-top{
  display:none;
}
    `.trim()
    ;(document.head || document.documentElement).appendChild(style)
  }

  const waitForElement = (selector, { root = document, timeoutMs = 30_000 } = {}) =>
    new Promise((resolve, reject) => {
      const found = root.querySelector(selector)
      if (found) return resolve(found)

      const observer = new MutationObserver(() => {
        const el = root.querySelector(selector)
        if (!el) return
        observer.disconnect()
        resolve(el)
      })
      observer.observe(root, { childList: true, subtree: true })

      if (timeoutMs <= 0) return
      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Timeout waiting for ${selector}`))
      }, timeoutMs)
    })

  const setOutsideEnabled = (enabled) => {
    state.outsideEnabled = enabled
    writeStoredOutsideEnabled(enabled)
    const body = document.body
    if (!body) return
    body.classList.toggle(CLASS.isOutsidePlayerBar, enabled)
    updateButtonTooltip()
  }

  const updateButtonTooltip = () => {
    const button = document.getElementById(SCRIPT.buttonId)
    if (!button) return
    button.setAttribute(
      'data-oypb-tooltip',
      state.outsideEnabled ? TOOLTIP_TEXT.whenOutside : TOOLTIP_TEXT.whenInside,
    )
  }

  const injectButton = async (token) => {
    const existing = document.getElementById(SCRIPT.buttonId)
    if (existing) {
      updateButtonTooltip()
      return
    }

    const playerBar = await waitForElement('.ytp-chrome-bottom').catch(() => null)
    if (!playerBar || token !== state.syncToken) return

    const rightControls = await waitForElement('.ytp-right-controls', {
      root: playerBar,
      timeoutMs: 10_000,
    }).catch(() => null)
    if (!rightControls) return

    const button = document.createElement('button')
    button.id = SCRIPT.buttonId
    button.className = 'ytp-button oypb-toggleExtensionButton oypb-tooltip'
    button.setAttribute(
      'data-oypb-tooltip',
      state.outsideEnabled ? TOOLTIP_TEXT.whenOutside : TOOLTIP_TEXT.whenInside,
    )
    button.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 16">
  <path id="oypb-toggle" fill="#fff" d="M0 0h18v5H0zm6.78 5v5.39H3.39L9 16l5.61-5.61h-3.39V5H6.78z"/>
</svg>`.trim()

    button.addEventListener(
      'click',
      () => {
        setOutsideEnabled(!state.outsideEnabled)
      },
      { passive: true },
    )

    rightControls.insertAdjacentElement('afterbegin', button)
  }

  const removeButton = () => {
    const button = document.getElementById(SCRIPT.buttonId)
    if (button) button.remove()
  }

  const blockAutohide = (moviePlayer) => {
    try {
      moviePlayer.dispatchEvent(new Event('mousedown'))
      moviePlayer.dispatchEvent(new Event('mouseleave'))
    } catch {
      // ignore
    }
  }

  const attachPlayerObserver = (moviePlayer) => {
    if (state.playerObserver) state.playerObserver.disconnect()

    const observer = new MutationObserver(() => {
      if (!state.outsideEnabled) return
      if (!document.body?.classList.contains(CLASS.isOutsidePlayerBar)) return

      const classList = moviePlayer.classList
      const isVisiblePlayerBar =
        classList.contains('paused-mode') || !classList.contains('ytp-autohide')

      if (!isVisiblePlayerBar) blockAutohide(moviePlayer)
    })

    observer.observe(moviePlayer, { attributes: true, attributeFilter: ['class'] })
    state.playerObserver = observer

    if (state.outsideEnabled) blockAutohide(moviePlayer)
  }

  const attachResizeObserver = (playerBarContainer) => {
    if (state.resizeObserver) state.resizeObserver.disconnect()
    if (!('ResizeObserver' in window)) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = entry.borderBoxSize?.[0]
        const height =
          size?.blockSize != null
            ? `${size.blockSize}px`
            : `${playerBarContainer.getBoundingClientRect().height}px`
        if (!height || height === '0px') continue
        document.documentElement.style.setProperty('--oypb-player-bar-height', height)
      }
    })
    ro.observe(playerBarContainer, { box: 'border-box' })
    state.resizeObserver = ro
  }

  const activate = async (token) => {
    const body = await waitForElement('body', {
      root: document.documentElement,
      timeoutMs: 30_000,
    }).catch(() => null)
    if (!body || token !== state.syncToken) return

    ensureStyle()

    body.classList.add(CLASS.isVisiblePlayerBar)
    body.classList.toggle(CLASS.isOutsidePlayerBar, state.outsideEnabled)

    const moviePlayer = await waitForElement('#movie_player').catch(() => null)
    if (!moviePlayer || token !== state.syncToken) return

    const playerBarContainer = await waitForElement('.ytp-chrome-bottom').catch(
      () => null,
    )
    if (!playerBarContainer || token !== state.syncToken) return

    attachPlayerObserver(moviePlayer)
    attachResizeObserver(playerBarContainer)
    await injectButton(token)
  }

  const deactivate = () => {
    if (state.playerObserver) state.playerObserver.disconnect()
    if (state.resizeObserver) state.resizeObserver.disconnect()
    state.playerObserver = null
    state.resizeObserver = null

    removeButton()
    document.body?.classList.remove(
      CLASS.isVisiblePlayerBar,
      CLASS.isOutsidePlayerBar,
      CLASS.isFullscreen,
    )
  }

  const sync = async () => {
    const token = ++state.syncToken
    if (isVideoPage()) {
      await activate(token)
    } else {
      deactivate()
    }
  }

  const queueSync = () => {
    if (state.queued) return
    state.queued = true
    queueMicrotask(async () => {
      state.queued = false
      await sync()
    })
  }

  const installNavigationHooks = () => {
    ;['yt-navigate-finish', 'yt-page-data-updated', 'yt-player-updated'].forEach(
      (eventName) => {
        document.addEventListener(eventName, queueSync, true)
      },
    )

    const pushState = history.pushState
    history.pushState = function (...args) {
      const ret = pushState.apply(this, args)
      queueSync()
      return ret
    }

    const replaceState = history.replaceState
    history.replaceState = function (...args) {
      const ret = replaceState.apply(this, args)
      queueSync()
      return ret
    }

    window.addEventListener('popstate', queueSync, true)
  }

  const installFullscreenHook = () => {
    let lastIsFullscreen = null
    const onFullscreenChange = () => {
      if (!isVideoPage()) return
      const isFullscreen = Boolean(
        document.fullscreenElement || document.webkitFullscreenElement,
      )
      if (lastIsFullscreen === isFullscreen) return
      lastIsFullscreen = isFullscreen
      document.body?.classList.toggle(CLASS.isFullscreen, isFullscreen)
      setOutsideEnabled(!state.outsideEnabled)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange, true)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange, true)
  }

  state.outsideEnabled = readStoredOutsideEnabled()
  installNavigationHooks()
  installFullscreenHook()
  queueSync()
})()
