// ==UserScript==
// @name        Nexus No Wait ++ (Fork)
// @description Skip countdowns, auto-start downloads, archived file support, and Nexus SPA fixes. Fork of Nexus No Wait ++ with UI + safety improvements.
// @version     2.1.0
// @namespace   NexusNoWaitPlusPlusFork
// @author      Torkelicious (original) + Community Fork
// @iconURL     https://raw.githubusercontent.com/torkelicious/nexus-no-wait-pp/refs/heads/main/icon.png
// @icon        https://raw.githubusercontent.com/torkelicious/nexus-no-wait-pp/refs/heads/main/icon.png
// @license     GPL-3.0-or-later
// @include     https://*.nexusmods.com/*
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @connect     nexusmods.com
// @connect     raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/564332/Nexus%20No%20Wait%20%2B%2B%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564332/Nexus%20No%20Wait%20%2B%2B%20%28Fork%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /* --------------------------------------------------
   * GM API + BROWSER FALLBACKS
   * -------------------------------------------------- */

  const GMX = {
    get: (k, d) => (typeof GM_getValue === 'function' ? GM_getValue(k, d) : d),
    set: (k, v) => typeof GM_setValue === 'function' && GM_setValue(k, v),
    list: () => (typeof GM_listValues === 'function' ? GM_listValues() : []),
    del: k => typeof GM_deleteValue === 'function' && GM_deleteValue(k),
    style: css => typeof GM_addStyle === 'function' && GM_addStyle(css)
  }

  const xhr =
    typeof GM_xmlhttpRequest === 'function'
      ? GM_xmlhttpRequest
      : typeof GM !== 'undefined'
        ? GM.xmlHttpRequest
        : null

  if (!xhr) {
    console.error('[NexusNoWait++] Missing GM_xmlhttpRequest')
    return
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms))

  /* --------------------------------------------------
   * CONFIG
   * -------------------------------------------------- */

  const CONFIG_KEY = 'NexusNoWaitPP'
  const DEFAULTS = {
    AutoStartDownload: true,
    AutoCloseTab: true,
    SkipRequirements: true,
    ShowAlertsOnError: true,
    PlayErrorSound: true,
    HidePremiumUpsells: false,
    HandleArchivedFiles: true,
    CloseTabDelay: 2000,
    RequestTimeout: 30000
  }

  function loadConfig () {
    try {
      const raw = GMX.get(CONFIG_KEY)
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
    } catch {
      return { ...DEFAULTS }
    }
  }

  let cfg = loadConfig()

  function saveConfig () {
    GMX.set(CONFIG_KEY, JSON.stringify(cfg))
  }

  /* --------------------------------------------------
   * LOGGER
   * -------------------------------------------------- */

  const Logger = (() => {
    const p = `[NexusNoWait++ v${GM_info?.script?.version || 'dev'}]`
    return {
      debug: (...a) => console.debug(p, ...a),
      info: (...a) => console.info(p, ...a),
      warn: (...a) => console.warn(p, ...a),
      error: (...a) => console.error(p, ...a)
    }
  })()

  /* --------------------------------------------------
   * NETWORK HELPERS
   * -------------------------------------------------- */

  const request = opts =>
    new Promise(resolve =>
      xhr({
        ...opts,
        onload: r => resolve(r),
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      })
    )

  const fetchText = async url =>
    (await request({ method: 'GET', url }))?.responseText || ''

  /* --------------------------------------------------
   * DOWNLOAD URL EXTRACTION
   * -------------------------------------------------- */

  function parseDownloadURL (text) {
    if (!text) return null
    try {
      const j = JSON.parse(text)
      if (j?.url) return j.url.replace(/&amp;/g, '&')
    } catch {}
    const m = text.match(/id=["']dl_link["'][^>]*value=["']([^"']+)/i)
    return m ? m[1].replace(/&amp;/g, '&') : null
  }

  async function getDownloadUrl ({ fileId, gameId, isNMM, href }) {
    if (!fileId) return { error: 'Missing fileId' }

    if (isNMM && href) {
      const first = await fetchText(href)
      const nxm = first.match(/(nxm:\/\/[^"'\s]+)/i)
      if (nxm) return { url: nxm[1] }
    }

    const res = await request({
      method: 'POST',
      url: '/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl',
      data: `fid=${encodeURIComponent(fileId)}&game_id=${encodeURIComponent(gameId || '')}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: cfg.RequestTimeout
    })

    const url = parseDownloadURL(res?.responseText || '')
    return url ? { url } : { error: 'No download URL (login required?)' }
  }

  /* --------------------------------------------------
   * CLICK INTERCEPTOR
   * -------------------------------------------------- */

  document.addEventListener(
    'click',
    async e => {
      const el = e.target.closest('a,button')
      if (!el || !el.href) return

      const url = new URL(el.href, location.href)
      const fileId = url.searchParams.get('file_id') || url.searchParams.get('id')
      if (!fileId) return

      if (url.searchParams.has('requirements') && !cfg.SkipRequirements) return

      e.preventDefault()
      e.stopImmediatePropagation()

      const { url: dl, error } = await getDownloadUrl({
        fileId,
        gameId: document.querySelector('[data-game-id]')?.dataset?.gameId || '',
        isNMM: url.searchParams.has('nmm'),
        href: el.href
      })

      if (dl) location.assign(dl)
      else if (error && cfg.ShowAlertsOnError) alert(error)
    },
    true
  )

  /* --------------------------------------------------
   * AUTO START
   * -------------------------------------------------- */

  async function autoStart () {
    if (!cfg.AutoStartDownload) return
    const p = new URLSearchParams(location.search)
    const fileId = p.get('file_id')
    if (!fileId) return

    await sleep(200)

    const { url } = await getDownloadUrl({
      fileId,
      gameId: document.querySelector('[data-game-id]')?.dataset?.gameId || '',
      isNMM: p.has('nmm'),
      href: location.href
    })

    if (url) {
      location.assign(url)
      if (cfg.AutoCloseTab) setTimeout(() => window.close(), cfg.CloseTabDelay)
    }
  }

  /* --------------------------------------------------
   * ARCHIVED FILE HANDLER (LAYOUT SAFE)
   * -------------------------------------------------- */

  function handleArchivedFiles () {
    if (!cfg.HandleArchivedFiles) return
    if (!location.href.includes('archived')) return

    document.querySelectorAll('[data-file-id]').forEach(el => {
      if (el.dataset.nnwDone) return
      el.dataset.nnwDone = '1'
      const id = el.dataset.fileId
      const base = location.origin + location.pathname
      el.insertAdjacentHTML(
        'beforeend',
        `
        <div class="nnw-archived">
          <a href="${base}?file_id=${id}&nmm=1">Mod Manager</a>
          <a href="${base}?file_id=${id}">Manual</a>
        </div>
      `
      )
    })
  }

  /* --------------------------------------------------
   * SETTINGS UI (LIGHT + SAFE)
   * -------------------------------------------------- */

  GMX.style(`
    #nnw-settings {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      background: #1b1b1b;
      color: #eee;
      border-radius: 10px;
      padding: 12px;
      font-size: 13px;
      box-shadow: 0 8px 30px rgba(0,0,0,.4)
    }
    #nnw-settings summary { cursor:pointer; font-weight:600 }
    #nnw-settings label { display:flex; gap:6px; align-items:center }
  `)

  function injectSettingsUI () {
    if (document.getElementById('nnw-settings')) return

    const box = document.createElement('details')
    box.id = 'nnw-settings'
    box.innerHTML = `
      <summary>Nexus No Wait ++</summary>
      ${Object.keys(DEFAULTS)
        .filter(k => typeof DEFAULTS[k] === 'boolean')
        .map(
          k => `
          <label>
            <input type="checkbox" data-key="${k}" ${cfg[k] ? 'checked' : ''}>
            ${k}
          </label>`
        )
        .join('')}
    `

    box.addEventListener('change', e => {
      const i = e.target
      if (i.dataset?.key) {
        cfg[i.dataset.key] = i.checked
        saveConfig()
      }
    })

    document.body.appendChild(box)
  }

  /* --------------------------------------------------
   * SPA SUPPORT (eslint-safe)
   * -------------------------------------------------- */

  let lastUrl = location.href
  function rerun () {
    if (location.href === lastUrl) return
    lastUrl = location.href
    main()
  }

  history.pushState = new Proxy(history.pushState, {
    apply (target, thisArg, argArray) {
      const r = target.apply(thisArg, argArray)
      rerun()
      return r
    }
  })

  history.replaceState = new Proxy(history.replaceState, {
    apply (target, thisArg, argArray) {
      const r = target.apply(thisArg, argArray)
      rerun()
      return r
    }
  })

  window.addEventListener('popstate', rerun)
  new MutationObserver(rerun).observe(document.body, { subtree: true, childList: true })

  /* --------------------------------------------------
   * INIT
   * -------------------------------------------------- */

  function main () {
    autoStart()
    handleArchivedFiles()
    injectSettingsUI()
    Logger.debug('Initialized')
  }

  main()
})()