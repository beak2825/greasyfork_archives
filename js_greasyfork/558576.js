// ==UserScript==
// @name                    TickTick Auto Change Theme
// @name:zh-CN              TickTick 自动切换主题
// @namespace               https://github.com/xlsama/tampermonkey-scripts
// @version                 0.2.0
// @author                  xlsama
// @description             Automatically switch TickTick theme based on system preferences (light/dark mode)
// @description:zh-CN       根据系统偏好设置（浅色/深色模式）自动切换 TickTick 主题
// @supportURL              https://github.com/xlsama/tampermonkey-scripts/issues
// @match                   *://*.dida365.com/*
// @match                   *://*.ticktick.com/*
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/558576/TickTick%20Auto%20Change%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/558576/TickTick%20Auto%20Change%20Theme.meta.js
// ==/UserScript==

const API_HOST = window.location.hostname.includes('ticktick.com')
  ? 'https://api.ticktick.com'
  : 'https://api.dida365.com'

const API_URL = `${API_HOST}/api/v2/user/preferences/settings?includeWeb=true`

function getCsrfToken() {
  const match = document.cookie.match(/_csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function mapSystemThemeToTickTickTheme(systemTheme) {
  return systemTheme === 'dark' ? 'night' : 'grey'
}

function getTickTickPreferences() {
  return fetch(API_URL, {
    method: 'GET',
    credentials: 'include',
  })
}

function updateTickTickTheme(theme, preferences) {
  return fetch(API_URL, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'x-csrftoken': getCsrfToken(),
    },
    body: JSON.stringify({ ...preferences, theme }),
  })
}

async function checkTickTickTheme() {
  const expectedTheme = mapSystemThemeToTickTickTheme(getSystemTheme())

  const tickTickPreferences = await getTickTickPreferences().then(res => res.json())
  const currentTheme = tickTickPreferences.theme

  console.log('🧩 ~ TickTick Auto Change Theme', { currentTheme, expectedTheme })

  if (currentTheme !== expectedTheme) {
    await updateTickTickTheme(expectedTheme, tickTickPreferences)
    window.location.reload()
  }
}

function isInputFocused() {
  return document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA'
}

function setKeymap() {
  let isKeymapSet = false

  // 监听页面变化
  new MutationObserver(() => {
    if (isKeymapSet) return

    const sideBarItems = document.querySelector('a[href="#p/inbox/tasks"]')?.parentNode?.parentNode
      ?.parentNode

    document.addEventListener(
      'keydown',
      e => {
        if (isInputFocused()) return

        const currentItem = sideBarItems.children[e.key - 1]

        if (currentItem) {
          e.preventDefault()
          e.stopImmediatePropagation()
          currentItem.querySelector('a')?.click()
        }
      },
      true
    )

    isKeymapSet = true
  }).observe(document.body, {
    childList: true,
    subtree: true,
  })
}

;(async function () {
  'use strict'

  await checkTickTickTheme()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 监听主题变化
  mediaQuery.addEventListener('change', async () => {
    await checkTickTickTheme()
  })

  setKeymap()
})()
