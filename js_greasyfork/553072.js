// ==UserScript==
// @name         添加 B 站在线人数排名入口
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Add the online rank entry to the Bilibili homepage
// @author       showlotus
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @homepage     https://github.com/showlotus/tampermonkey-scripts/blob/main/packages/bilibili-online-rank
// @supportURL   https://github.com/showlotus/tampermonkey-scripts/issues
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553072/%E6%B7%BB%E5%8A%A0%20B%20%E7%AB%99%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0%E6%8E%92%E5%90%8D%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/553072/%E6%B7%BB%E5%8A%A0%20B%20%E7%AB%99%E5%9C%A8%E7%BA%BF%E4%BA%BA%E6%95%B0%E6%8E%92%E5%90%8D%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  class Logger {
    constructor(name) {
      this.name = name
      this.info('🚀 start...')
    }

    info(...args) {
      console.info(`%c[${this.name}]`, 'color: #2196F3', ...args)
    }

    warn(...args) {
      console.warn(`%c[${this.name}]`, 'color: #FF9800', ...args)
    }

    error(...args) {
      console.error(`%c[${this.name}]`, 'color: #F44336', ...args)
    }
  }

  const logger = new Logger('bilibili-online-rank')

  const container = document.querySelector('div.bili-header__channel > div.channel-icons')
  if (container && !container.hasAttribute('__has_rank_icon')) {
    const a = document.createElement('a')
    a.href = 'https://online.梦.link/'
    a.target = '_blank'
    a.setAttribute('class', 'channel-icons__item')
    a.innerHTML = /* html */ `
    <div class="icon-bg" style="background-color: #2196F3;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" class="icon-bg--icon"><g fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M17 18H4v24h13z"/><path d="M30 6H17v36h13z"/><path stroke-linecap="round" d="M43 26H30v16h13z"/></g></svg>
    </div>
    <span class="icon-title">在线榜</span>
  `
    container.appendChild(a)
    container.setAttribute('__has_rank_icon', 'true')
    logger.info('🎉 rank icon injected')
  }
})()
