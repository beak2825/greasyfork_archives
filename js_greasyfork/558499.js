// ==UserScript==
// @name                    Go to Github Releases Page
// @name:zh-CN              跳转到 Github Releases 页面
// @namespace               https://github.com/xlsama/tampermonkey-scripts
// @version                 0.2.0
// @author                  xlsama
// @description             Add a quick link button to navigate to GitHub repository releases page
// @description:zh-CN       在 GitHub 仓库页面添加快速跳转到 Releases 页面的按钮
// @homepageURL             https://github.com/xlsama/tampermonkey-scripts
// @supportURL              https://github.com/xlsama/tampermonkey-scripts/issues
// @match                   *://github.com/*
// @include                 *://*github*
// @grant                   none
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/558499/Go%20to%20Github%20Releases%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/558499/Go%20to%20Github%20Releases%20Page.meta.js
// ==/UserScript==

// 判断当前path是否是一个 github repo，且位于项目的主页面
function isGithubRepo(path) {
  path = path.slice(0, -1)
  return path.split('/').length === 3
}

// 创建 package 图标 SVG 的辅助函数
function createPackageIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.setAttribute('class', 'octicon octicon-package')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '16')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('display', 'inline-block')
  svg.setAttribute('overflow', 'visible')
  svg.setAttribute('style', 'vertical-align: text-bottom;')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    'm8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 4.775v5.913c0 .09.047.171.125.216l4.625 2.683V7.653Zm6.25 8.832 4.625-2.683a.25.25 0 0 0 .125-.216V4.775L8.75 7.653Z'
  )

  svg.appendChild(path)
  return svg
}

// 创建 releases 按钮（带文本）
function createReleasesButton() {
  const el = document.querySelector('[class^="OverviewContent-module__Box_4"]')

  if (!el) {
    return
  }

  // 检查是否已经存在 releases 按钮
  if (el.querySelector('a[href*="/releases"]')) {
    return
  }

  const releasesButton = el.firstChild.cloneNode(true)
  releasesButton.setAttribute('href', `${window.location.pathname}/releases`)
  releasesButton.querySelector('svg').replaceWith(createPackageIcon())
  releasesButton.querySelector('[data-component="text"]').textContent = 'Releases'

  el.appendChild(releasesButton)
}

// 创建 releases 按钮（仅图标）
function createReleasesButtonMobile() {
  const el = document.querySelector('[class^="OverviewContent-module__Box_5"]')

  if (!el) {
    return
  }

  // 检查是否已经存在 releases 按钮
  if (el.querySelector('a[href*="/releases"]')) {
    return
  }

  const releasesButton = el.firstChild.cloneNode(true)
  releasesButton.setAttribute('href', `${window.location.pathname}/releases`)
  releasesButton.setAttribute('aria-label', 'Go to Releases page')
  releasesButton.querySelector('svg').replaceWith(createPackageIcon())

  el.appendChild(releasesButton)
}

function initButtons() {
  if (!isGithubRepo(window.location.pathname)) {
    return
  }

  createReleasesButton()
  createReleasesButtonMobile()
}

;(function () {
  'use strict'

  // 初始化
  initButtons()

  // 监听页面变化
  new MutationObserver(() => {
    // 检查两个容器是否存在
    if (
      document.querySelector('[class^="OverviewContent-module__Box_4"]') ||
      document.querySelector('[class^="OverviewContent-module__Box_5"]')
    ) {
      initButtons()
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  })
})()
