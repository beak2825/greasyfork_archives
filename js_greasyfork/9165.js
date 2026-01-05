// ==UserScript==
// @name         Auto Close YouTube Ads
// @namespace    fuz/acya
// @version      1.4.8
// @description  Close and/or Mute YouTube ads automatically!
// @author       fuzetsu
// @run-at       document-body
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/subscribe_embed?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@23586fd0a72b587a1786f7bb9088e807a5b53e79/libs/gm_config.js
// @downloadURL https://update.greasyfork.org/scripts/9165/Auto%20Close%20YouTube%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/9165/Auto%20Close%20YouTube%20Ads.meta.js
// ==/UserScript==
/* globals GM_getValue GM_setValue GM_deleteValue GM_registerMenuCommand GM_config waitForElems waitForUrl */
/**
 * This section of the code holds the css selectors that point different parts of YouTube's
 * user interface. If the script ever breaks and you don't want to wait for me to fix it
 * chances are that it can be fixed by just updating these selectors here.
 */
const CSS = {
  // the button used to skip an ad
  skipButton:
    '.videoAdUiSkipButton,.ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-skip-ad-button',
  // the area showing the countdown to the skip button showing
  preSkipButton: '.videoAdUiPreSkipButton,.ytp-ad-preview-container,.ytp-preview-ad',
  // little x that closes banner ads
  closeBannerAd: '.close-padding.contains-svg,a.close-button,.ytp-ad-overlay-close-button',
  // button that toggle mute on the video
  muteButton: '.ytp-mute-button',
  // the slider bar handle that represents the current volume
  muteIndicator: '.ytp-volume-slider-handle',
  // container for ad on video
  adArea: '.videoAdUi,.ytp-ad-player-overlay,.ytp-ad-player-overlay-layout',
  // container that shows ad length eg 3:23
  adLength: '.videoAdUiAttribution,.ytp-ad-duration-remaining',
  // container for header ad on the home page
  homeAdContainer: '#masthead-ad'
}

const util = {
  log: (...args) => console.log(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: purple;', ...args),
  clearTicks: ticks => {
    ticks.forEach(tick =>
      !tick ? null : typeof tick === 'number' ? clearInterval(tick) : tick.stop()
    )
    ticks.length = 0
  },
  keepTrying: (wait, action) => {
    const tick = setInterval(() => action() && clearInterval(tick), wait)
    return tick
  },
  storeGet: key => {
    if (typeof GM_getValue === 'undefined') {
      const value = localStorage.getItem(key)
      return value === 'true' ? true : value === 'false' ? false : value
    }
    return GM_getValue(key)
  },
  storeSet: (key, value) =>
    typeof GM_setValue === 'undefined' ? localStorage.setItem(key, value) : GM_setValue(key, value),
  storeDel: key =>
    typeof GM_deleteValue === 'undefined' ? localStorage.removeItem(key) : GM_deleteValue(key),
  q: (query, context) => (context || document).querySelector(query),
  qq: (query, context) => Array.from((context || document).querySelectorAll(query)),
  get: (obj, str) => util.getPath(obj, str.split('.').reverse()),
  getPath: (obj, path) =>
    obj == null ? null : path.length > 0 ? util.getPath(obj[path.pop()], path) : obj
}

const SCRIPT_NAME = 'Auto Close YouTube Ads'
const SHORT_AD_MSG_LENGTH = 12000
const TICKS = []
let DONT_SKIP = false
const CONFIG_VERSION = 2

const config = GM_config([
  {
    key: 'muteAd',
    label: 'Mute ads?',
    type: 'bool',
    default: true
  },
  {
    key: 'hideAd',
    label: 'Hide video ads?',
    type: 'bool',
    default: false
  },
  {
    key: 'secWaitBanner',
    label: 'Banner ad close delay (seconds)',
    type: 'number',
    default: 3,
    min: 0
  },
  {
    key: 'secWaitVideo',
    label: 'Video ad skip delay (seconds)',
    type: 'number',
    default: 3,
    min: 0
  },
  {
    key: 'minAdLengthForSkip',
    label: 'Dont skip video shorter than this (seconds)',
    type: 'number',
    default: 0,
    min: 0
  },
  {
    key: 'muteEvenIfNotSkipping',
    label: 'Mute video even if not skipping',
    type: 'bool',
    default: true
  },
  {
    key: 'debug',
    label: 'Show extra debug information.',
    type: 'bool',
    default: false
  },
  {
    key: 'version',
    type: 'hidden',
    default: CONFIG_VERSION
  }
])

let conf = config.load()

config.onsave = cfg => (conf = cfg)

function createMessageElement() {
  const elem = document.createElement('div')
  elem.setAttribute(
    'style',
    'border: 1px solid white;border-right: none;background: rgb(0,0,0,0.75);color:white;position: absolute;right: 0;z-index: 1000;top: 30px;padding: 10px;padding-right: 20px;cursor: pointer;pointer-events: all;'
  )
  return elem
}
function showMessage(container, text, ms) {
  const message = createMessageElement()
  message.textContent = text
  container.appendChild(message)
  util.log(`showing message [${ms}ms]: ${text}`)
  setTimeout(() => message.remove(), ms)
}

function setupCancelDiv(ad) {
  const skipArea = util.q(CSS.preSkipButton, ad)
  const skipText = skipArea && skipArea.textContent.trim().replace(/\s+/g, ' ')
  if (skipText) {
    if (['will begin', 'will play', 'plays soon'].some(snip => skipText.includes(snip))) return
    const cancelClass = 'acya-cancel-skip'
    let cancelDiv = util.q('.' + cancelClass)
    if (cancelDiv) cancelDiv.remove()
    cancelDiv = createMessageElement()
    cancelDiv.className = cancelClass
    cancelDiv.textContent = (conf.muteAd ? 'Un-mute & ' : '') + 'Cancel Auto Skip'
    cancelDiv.onclick = () => {
      util.log('cancel clicked')
      DONT_SKIP = true
      cancelDiv.remove()
      if (conf.hideAd) {
        ad.style.zIndex = ''
        ad.style.background = ''
      }
      const muteButton = getMuteButton()
      const muteIndicator = getMuteIndicator()
      if (conf.muteAd && muteButton && muteIndicator && isMuted(muteIndicator)) muteButton.click()
    }
    ad.appendChild(cancelDiv)
  } else {
    util.log("skip button area wasn't there for some reason.. couldn't place cancel button.")
  }
}

function parseTime(str) {
  const [minutes, seconds] = str
    .split(' ')
    .pop()
    .split(':')
    .map(num => parseInt(num))
  util.log(str, minutes, seconds)
  return minutes * 60 + seconds || 0
}

const getMuteButton = () => util.qq(CSS.muteButton).find(elem => elem.offsetParent)
const getMuteIndicator = () => util.qq(CSS.muteIndicator).find(elem => elem.offsetParent)
const isMuted = m => m.style.left === '0px'

function getAdLength(ad) {
  if (!ad) return 0
  const time = ad.querySelector(CSS.adLength)
  return time ? parseTime(time.textContent) : 0
}

function waitForAds() {
  DONT_SKIP = false
  TICKS.push(
    waitForElems({
      sel: CSS.skipButton,
      onmatch: btn => {
        util.log('found skip button')
        util.keepTrying(500, () => {
          if (!btn) return true
          // if not visible
          if (btn.offsetParent == null) return
          setTimeout(() => {
            if (DONT_SKIP) {
              util.log('not skipping...')
              DONT_SKIP = false
              return
            }
            util.log('clicking skip button')
            btn.click()
          }, conf.secWaitVideo * 1000)
          return true
        })
      }
    }),
    waitAndClick(CSS.closeBannerAd, conf.secWaitBanner * 1000),
    waitForElems({
      sel: CSS.adArea,
      onmatch: ad => {
        util.log('Video ad detected')
        // reset don't skip
        DONT_SKIP = false
        const adLength = getAdLength(ad)
        const isShort = adLength < conf.minAdLengthForSkip
        const debug = () =>
          conf.debug
            ? `[DEBUG adLength = ${adLength}, minAdLengthForSkip = ${conf.minAdLengthForSkip}]`
            : ''
        if (isShort && !conf.muteEvenIfNotSkipping) {
          DONT_SKIP = true
          return showMessage(
            ad,
            `Shot AD detected, will not skip or mute. ${debug()}`,
            SHORT_AD_MSG_LENGTH
          )
        }
        if (conf.hideAd) {
          ad.style.zIndex = 10
          ad.style.background = 'black'
        }
        // show option to cancel automatic skip
        if (!isShort) setupCancelDiv(ad)
        if (!conf.muteAd) return
        const muteButton = getMuteButton()
        const muteIndicator = getMuteIndicator()
        if (!muteIndicator) return util.log('unable to determine mute state, skipping mute')
        if (isMuted(muteIndicator)) {
          util.log('Audio is already muted')
        } else {
          util.log('Muting audio')
          muteButton.click()
        }
        // wait for the ad to disappear before unmuting
        util.keepTrying(250, () => {
          if (!ad.offsetParent) {
            if (isMuted(muteIndicator)) {
              muteButton.click()
              util.log('Video ad ended, unmuting audio')
            } else {
              util.log('Video ad ended, audio already unmuted')
            }
            return true
          }
        })
        if (isShort) {
          DONT_SKIP = true
          return showMessage(
            ad,
            `Short AD detected, will not skip but will mute. ${debug()}`,
            SHORT_AD_MSG_LENGTH
          )
        }
      }
    })
  )
}

const waitAndClick = (sel, ms, cb) =>
  waitForElems({
    sel: sel,
    onmatch: btn => {
      util.log('Found ad, closing in', ms, 'ms')
      setTimeout(() => {
        btn.click()
        if (cb) cb(btn)
      }, ms)
    }
  })

util.log('Started')

if (window.self === window.top) {
  let videoUrl
  // close home ad whenever encountered
  waitForElems({ sel: CSS.homeAdContainer, onmatch: ad => ad.remove() })
  // wait for video page
  waitForUrl(/^https:\/\/www\.youtube\.com\/watch\?.*v=.+/, () => {
    if (videoUrl && location.href !== videoUrl) {
      util.log('Changed video, removing old wait')
      util.clearTicks(TICKS)
    }
    videoUrl = location.href
    util.log('Entered video, waiting for ads')
    waitForAds()
    TICKS.push(
      waitForUrl(
        url => url !== videoUrl,
        () => {
          videoUrl = null
          util.clearTicks(TICKS)
          util.log('Left video, stopped waiting for ads')
        },
        true
      )
    )
  })
} else {
  if (/^https:\/\/www\.youtube\.com\/embed\//.test(location.href)) {
    util.log('Found embedded video, waiting for ads')
    waitForAds()
  }
}

GM_registerMenuCommand('Auto Close Youtube Ads - Manage Settings', config.setup)
