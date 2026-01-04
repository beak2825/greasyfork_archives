// ==UserScript==
// @name         VR Download Renamer
// @namespace    local.vr.renamer
// @version      2025-09-23
// @description  Build filename string from page fields, copy to clipboard, set download attribute
// @match  https://vrporn.com/*
// @match  https://www.vrporn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrporn.com
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550389/VR%20Download%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/550389/VR%20Download%20Renamer.meta.js
// ==/UserScript==

// vrporn-download-link-rename.js
// https://sleazyfork.org/en/scripts/550389-vr-download-renamer

; (() => {
  let cachedMeta = { title: '', studio: '', performers: '', date: '' }

  // CONFIG
  const FIELD_SELECTORS = {
    title: '.ui-player-title__main-title',
    studio: '.ui-detail-video .studio a.ui-detail-video__title',
    performers: '.starrings .ui-card-model__name',
    date: '.ui-player-title__sub-text' // may need filter for date pattern
  }

  // CONFIG: filename pattern
  // Available tokens: {date} {studio} {title} {performers} {resolution}
  const PATTERN = '{performers} {title}.{date}.{studio}.{resolution}.mp4'

  // Minimal button UI
  const BTN_TEXT = 'Copy Filename'
  const BTN_ID = 'vr-filename-btn'
  const BTN_STYLE = `
    #${BTN_ID}{
      position:fixed;top:12px;right:12px;z-index:99999;
      font:12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      padding:8px 10px;border:1px solid #999;border-radius:6px;background:#fff;cursor:pointer
    }
  `

  const $ = s => document.querySelector(s)
  const $$ = s => Array.from(document.querySelectorAll(s))

  const textOrNull = el => el ? el.textContent.trim() : ''
  const collectTexts = nodes => nodes.map(n => n.textContent.trim()).filter(Boolean)

  const parseDate = el => {
    if (!el) return ''
    const text = el.textContent.trim()
    // parse format like "Sep 19 2025" into "25.09.19"
    const m = text.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})$/)
    if (!m) return ''
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    }
    const mon = monthMap[m[1]] || '00'
    const day = m[2].padStart(2, '0')
    const year = m[3].slice(2)
    return `${year}.${mon}.${day}`
  }

  const sanitize = (s, isTitle = false) => {
    let str = s.replace(/[\/\\:*?"<>|'"]/g, ' ')
    if (isTitle) {
      str = str.replace(/\s+/g, '.').replace(/\.{2,}/g, '.')
    } else {
      str = str.replace(/\s+/g, ' ')
    }
    return str.trim()
  }

  const collapseList = arr => sanitize(arr.join(' ').toLowerCase())

  const cachePageMeta = () => {
    const titleRaw = textOrNull($(FIELD_SELECTORS.title))
    const title = sanitize(titleRaw, true)
    const studio = sanitize(textOrNull($(FIELD_SELECTORS.studio)), true)
    const performers = collapseList(collectTexts($$(FIELD_SELECTORS.performers)))
    const dateNode = $$(FIELD_SELECTORS.date).find(n =>
      /^\w{3}\s+\d{1,2}\s+\d{4}$/.test(n.textContent.trim())
    )
    const date = parseDate(dateNode)
    cachedMeta.title = title
    cachedMeta.studio = studio
    cachedMeta.performers = performers
    cachedMeta.date = date
  }

  const buildFilename = () => {
    const resolutionEl = document.querySelector('.ui-download-modal__list .ui-download-modal__item-name-label')
    let resolution = sanitize(textOrNull(resolutionEl))
    if (!resolution) {
      resolution = '5k' // default if not found
    }

    const dict = { title: cachedMeta.title, studio: cachedMeta.studio, performers: cachedMeta.performers, date: cachedMeta.date, resolution }
    let out = PATTERN
    Object.entries(dict).forEach(([k, v]) => {
      out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), v || '')
    })
    return out.trim()
  }

  const copyToClipboard = s => {
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(s, { type: 'text', mimetype: 'text/plain' })
      } else {
        navigator.clipboard && navigator.clipboard.writeText(s)
      }
      toast('filename copied')
    } catch (e) {
      console.log('copy failed', e)
    }
  }

  const rewriteDownloadAttr = (filename) => {
    document.querySelectorAll('.ui-download-modal__list a').forEach(a => {
      try {
        a.setAttribute('download', filename)
      } catch (e) { }
    })
  }

  const injectBtn = () => {
    if (document.getElementById(BTN_ID)) return
    const style = document.createElement('style')
    style.textContent = BTN_STYLE
    document.head.appendChild(style)

    const btn = document.createElement('button')
    btn.id = BTN_ID
    btn.textContent = BTN_TEXT
    btn.addEventListener('click', () => {
      cachePageMeta()
      const name = buildFilename()
      copyToClipboard(name)
      rewriteDownloadAttr(name)
    })
    document.body.appendChild(btn)
  }

  const toast = msg => {
    const el = document.createElement('div')
    el.textContent = msg
    el.style.cssText = 'position:fixed;bottom:12px;right:12px;background:#333;color:#fff;padding:8px 10px;border-radius:6px;font:12px system-ui;z-index:99999;opacity:0.95'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1200)
  }

  const run = () => {
    // Removed delayed cachePageMeta call
    const name = buildFilename()
    rewriteDownloadAttr(name)
    injectBtn()
  }

  // handle SPA navigation
  const mo = new MutationObserver(() => {
    // debounce a touch
    clearTimeout(mo._t)
    mo._t = setTimeout(() => {
      run()
      const modalList = document.querySelector('.ui-download-modal__list')
      if (modalList) {
        if (!modalList._vrHooked) {
          modalList._vrHooked = true
          rewriteDownloadAttr(buildFilename())
          modalList.addEventListener('click', e => {
            const a = e.target.closest('a')
            if (a) {
              // removed copyToClipboard call
            }
          })
        }
        const name = buildFilename()
        rewriteDownloadAttr(name)
      }
    }, 150)
  })
  mo.observe(document.documentElement, { subtree: true, childList: true })
  run()
})()
