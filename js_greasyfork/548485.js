// ==UserScript==
// @name         钦定字体
// @description  指定网页的 UI 字体和代码字体，忽略图标
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @author       chenh
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548485/%E9%92%A6%E5%AE%9A%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/548485/%E9%92%A6%E5%AE%9A%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

;(() => {
  'use strict'

  // UI 字体
  const UI_FONT = 'Microsoft YaHei'
  // 代码字体
  const CODE_FONT = 'HansCode'

  // 忽略项，用于忽略字体图标
  const GLOBAL_IGNORES = [
    'i',
    '[class*=ifont]',
    '[class*=ifont] *',
    '[class*=vjs]',
    '[class*=vjs] *',
    '[class*=icon]',
    '[class*=icon] *',
    '[class*=photo]',
    '[class*=photo] *',
    '[class*=image]',
    '[class*=image] *',
    '[class*=picture]',
    '[class*=picture] *',
    '[class*=symbols]',
    '[class*=symbols] *',
  ]

  // UI 选择器
  const UI_SELECTORS = ['*']
  // 代码选择器
  const CODE_SELECTORS = [
    'pre',
    'pre *',
    'code',
    'code *',
    '[id*=highlighted]',
    '[id*=highlighted] *',
    '[class*=highlighted]',
    '[class*=highlighted] *',
  ]

  /**
   * 将选择器和忽略结合成选择器
   * @param {string[]} selectors 普通选择器
   * @param {string[]} ignores 忽略项选择器
   * @returns {string} 选择器字符串
   */
  function buildIgnoreStyle(selectors, ignores) {
    return selectors.map(sel => `${sel}:not(${ignores.join(', ')})`).join(', ')
  }

  // 设置 CSS
  GM_addStyle(`
    ${buildIgnoreStyle(UI_SELECTORS, [...CODE_SELECTORS, ...GLOBAL_IGNORES])} {
      font-family: '${UI_FONT}' !important;
    }

    ${buildIgnoreStyle(CODE_SELECTORS, GLOBAL_IGNORES)} {
      font-family: '${CODE_FONT}' !important;
      -webkit-font-feature-settings : "calt" on;
    }
  `)
})()
