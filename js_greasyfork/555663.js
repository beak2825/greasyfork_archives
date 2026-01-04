// ==UserScript==
// @name         theCrag Topo Ticks + Grades Overlay (Manual Bands)
// @namespace    https://thecrag.com/
// @version      2.3.1
// @description  Show compact grade boxes with user-defined color bands + tick icons
// @match        https://www.thecrag.com/es/escalar/*
// @icon         https://www.google.com/s2/favicons?domain=thecrag.com
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555663/theCrag%20Topo%20Ticks%20%2B%20Grades%20Overlay%20%28Manual%20Bands%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555663/theCrag%20Topo%20Ticks%20%2B%20Grades%20Overlay%20%28Manual%20Bands%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /* ===== CONFIG ===== */
  const SHOW_LIST_ICON = true
  const SHOW_GRADES = true
  const SHOW_TICKS = true

  const GRADE_BANDS = {
    beginner: {
      color: '#53b41c',
      grades: ['3', '3+', '3b', '3b+', '3c', '3c+']
    },
    intermediate: {
      color: '#ffe201',
      grades: [
        '4',
        '4+',
        '4a',
        '4a+',
        '4b',
        '4b+',
        '4c',
        '4c+',
        '5',
        '5+',
        '5a',
        '5a+',
        '5b',
        '5b+',
        '5c',
        '5c/c+',
        '5c+',
        '5c+/6a',
        '6a'
      ]
    },
    experienced: {
      color: '#e6842a',
      grades: [
        '6a+',
        '6a+/b',
        '6b',
        '6b/b+',
        '6b+',
        '6b+/c',
        '6c',
        '6c/c+',
        '6c+',
        '6c+/7a',
        '7a',
        '7a/a+',
        '7a+'
      ]
    },
    expert: {
      color: '#db2424',
      grades: [
        '7a+/b',
        '7b',
        '7b/b+',
        '7b+',
        '7b+/c',
        '7c',
        '7c/c+',
        '7c+',
        '7c+/8a',
        '8a',
        '8a/a+',
        '8a+',
        '8a+/b',
        '8b',
        '8b/b+',
        '8b+'
      ]
    },
    elite: {
      color: '#aa1d7b',
      grades: [
        '8c',
        '8c/c+',
        '8c+',
        '8c+/9a',
        '9a',
        '9a/a+',
        '9a+',
        '9a+/b',
        '9b',
        '9b/b+',
        '9b+',
        '9b+/c',
        '9c'
      ]
    }
  }

  const GAP_PX = 1
  const FONT_SIZE = 8
  const PADDING_PX = 1
  const GRADE_H_PX = 10
  const TICK_H_PX = 11
  const FALLBACK_BG = '#ccc'
  /* ================== */

  const style = document.createElement('style')
  style.textContent = /* css */ `
    .topo-tick {
      position: absolute;
      width: 11px; height: 11px;
      background-size: contain; background-repeat: no-repeat;
      transform: translate(-50%, 0);
      pointer-events: none; z-index: 5;
    }
    .topo-tick.tick_dog {
      background-color: #c09b7a;
      border: 1px solid rgba(0,0,0,0.25);
      border-radius: 50%;
      padding: 1px;
      box-shadow: 0 0 2px rgba(0,0,0,0.25);
      box-sizing: content-box;
      transform: translate(-50%, 0) scale(0.75);
      transform-origin: center top;
    }
    .topo-grade {
      position: absolute;
      font-size: ${FONT_SIZE}px;
      line-height: ${FONT_SIZE + 1}px;
      border-radius: 2px;
      padding: 0 0px;
      /* padding: 0 ${PADDING_PX}px; */
      text-align: center;
      transform: translate(-50%, 0);
      pointer-events: none;
      z-index: 5;
      white-space: nowrap;
      border: 1.2px solid #000 !important;   /* darker, crisper edge */
      box-shadow: none !important;           /* cleaner flat look */
      color: #000;
      font-weight: 600;
    }
    /* Force readable text colors for specific grade bands */
    .topo-grade[data-band="beginner"],
    .topo-grade[data-band="experienced"] {
      color: #000 !important;
    }
    /* Hide our overlays whenever the topo SVG is hidden */
    .phototopo svg.topooverlay[style*="display: none"] ~ .topo-grade,
    .phototopo svg.topooverlay[style*="display: none"] ~ .topo-tick,
    .phototopo svg.topooverlay[style*="display: none"] ~ .topo-listicon,
    .phototopo svg.topooverlay.hide ~ .topo-grade,
    .phototopo svg.topooverlay.hide ~ .topo-tick,
    .phototopo svg.topooverlay.hide ~ .topo-listicon,
    .phototopo svg.topooverlay.is-hidden ~ .topo-grade,
    .phototopo svg.topooverlay.is-hidden ~ .topo-tick,
    .phototopo svg.topooverlay.is-hidden ~ .topo-listicon,
    .phototopo svg.topooverlay[style*="visibility: hidden"] ~ .topo-grade,
    .phototopo svg.topooverlay[style*="visibility: hidden"] ~ .topo-tick,
    .phototopo svg.topooverlay[style*="visibility: hidden"] ~ .topo-listicon,
    .phototopo svg.topooverlay[style*="opacity: 0"] ~ .topo-grade,
    .phototopo svg.topooverlay[style*="opacity: 0"] ~ .topo-tick,
    .phototopo svg.topooverlay[style*="opacity: 0"] ~ .topo-listicon {
      display: none !important;
    }

    .phototopo {
      margin-bottom: 20px !important;
    }

    .topo-listicon {
      position: absolute;
      width: 5px;     /* smaller */
      height: 5px;    /* smaller */
      border-radius: 50%;
      background: #419496;
      border: 1px solid #000;   /* thin border */
      transform: translate(-50%, 0);
      pointer-events: none;
      z-index: 6;
      box-shadow: 0 0 1px rgba(0,0,0,0.35); /* subtle due to reduced size */
    }
  `

  document.head.appendChild(style)

  let tickMap = {} // { nid: 'tick_flash' }
  let gradeMap = {} // { nid: '6b+' }
  let listMap = {} // { nid: true }
  let hasRendered = false

  // --- helpers ---
  const norm = s =>
    (s || '')
      .toString()
      .trim()
      .replace(/\u00A0/g, ' ') // NBSP -> space
      .replace(/[·•]/g, '+') // odd separators -> plus
      .replace(/\s+/g, '') // remove spaces inside (e.g., '6a +')
      .toLowerCase()

  const pickBandColor = gradeText => {
    const g = norm(gradeText)
    for (const key of Object.keys(GRADE_BANDS)) {
      const band = GRADE_BANDS[key]
      if (band.grades.map(norm).includes(g)) return band.color
    }
    return FALLBACK_BG
  }

  function textColorFor (bg) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bg)
    if (!m) return '#000'
    const r = parseInt(m[1], 16),
      g = parseInt(m[2], 16),
      b = parseInt(m[3], 16)
    const L =
      0.2126 * (r / 255) ** 2.2 +
      0.7152 * (g / 255) ** 2.2 +
      0.0722 * (b / 255) ** 2.2
    return L < 0.5 ? '#fff' : '#000'
  }

  function collectData () {
    listMap = {}
    tickMap = {}
    gradeMap = {}

    if (SHOW_TICKS) {
      document
        .querySelectorAll(
          '.tick_onsight, .tick_flash, .tick_redpoint, .tick_pinkpoint,.tick_lead, .tick_tr, .tick_dog, .tick_clean'
        )
        .forEach(icon => {
          const routeLink = icon
            .closest('.route')
            ?.querySelector('a[href*="/route/"]')
          if (!routeLink) return
          const m = routeLink.href.match(/\/route\/(\d+)/)
          if (m) tickMap[m[1]] = icon.className.match(/tick_[a-z]+/)[0]
        })
    }

    if (SHOW_GRADES) {
      document.querySelectorAll('.sticky-header').forEach(header => {
        const checkbox = header.querySelector('input[name="D:AscentNodeID"]')
        const gradeSpan = header.querySelector('.r-grade span[class*="gb"]')
        if (!checkbox || !gradeSpan) return
        const nid = checkbox.value?.trim()
        if (!nid) return
        gradeMap[nid] = gradeSpan.textContent.trim()
      })
    }

    // List membership
    if (SHOW_LIST_ICON) {
      document.querySelectorAll('.route[data-nid]').forEach(route => {
        const nid = route.dataset.nid
        const inList = !!route.querySelector('.title i.icon-circle')
        if (nid && inList) listMap[nid] = true
      })
    }
  }

  function renderOverlays () {
    const svgs = document.querySelectorAll('.phototopo svg')
    if (!svgs.length) return

    svgs.forEach(svg => {
      const img = svg
        .closest('.phototopo')
        ?.querySelector('img.fixedheightmedium')
      if (!img) return
      const container = svg.parentElement
      const vb = svg.viewBox.baseVal
      container.style.position = 'relative'

      svg.querySelectorAll('rect.routelabel[data-nid]').forEach(rect => {
        const nid = rect.dataset.nid
        const rectX = parseFloat(rect.getAttribute('x'))
        const rectY = parseFloat(rect.getAttribute('y'))
        const rectW = parseFloat(rect.getAttribute('width'))
        const rectH = parseFloat(rect.getAttribute('height'))
        const x = rectX + rectW / 2

        const baseLeftPx = (x / vb.width) * img.clientWidth
        const baseTopPx = ((rectY + rectH) / vb.height) * img.clientHeight
        let currentTopPx = baseTopPx

        // List icon (touching the number box from above)
        if (
          SHOW_LIST_ICON &&
          listMap[nid] &&
          !container.querySelector(`.topo-listicon[data-nid="${nid}"]`)
        ) {
          const el = document.createElement('span')
          el.className = 'topo-listicon'
          el.dataset.nid = nid

          const iconLeft = baseLeftPx

          const numberTop = (rectY / vb.height) * img.clientHeight
          const iconTop = numberTop - 2

          el.style.left = `${iconLeft}px`
          el.style.top = `${iconTop}px`
          container.appendChild(el)
        }

        // Grade box (just below number)
        if (
          SHOW_GRADES &&
          gradeMap[nid] &&
          !container.querySelector(`.topo-grade[data-nid="${nid}"]`)
        ) {
          const grade = gradeMap[nid]
          const bg = pickBandColor(grade)

          const el = document.createElement('span')
          el.className = 'topo-grade'
          el.dataset.nid = nid
          el.dataset.band = Object.keys(GRADE_BANDS).find(key =>
            GRADE_BANDS[key].grades.map(norm).includes(norm(grade))
          )
          el.textContent = grade
          el.style.background = bg
          el.style.color = textColorFor(bg)
          el.style.left = `${baseLeftPx}px`
          el.style.top = `${currentTopPx + GAP_PX - 6}px`

          container.appendChild(el)
          currentTopPx += GAP_PX + GRADE_H_PX
        }

        // Tick icon (flush below grade)
        if (
          SHOW_TICKS &&
          tickMap[nid] &&
          !container.querySelector(`.topo-tick[data-nid="${nid}"]`)
        ) {
          const tickClass = tickMap[nid]
          const el = document.createElement('span')
          el.className = `topo-tick ${tickClass}`
          el.dataset.nid = nid
          const srcEl = document.querySelector(`.${tickClass}`)
          if (srcEl)
            el.style.backgroundImage = getComputedStyle(srcEl).backgroundImage
          el.style.left = `${baseLeftPx}px`
          el.style.top = `${currentTopPx + GAP_PX - 6}px`
          container.appendChild(el)
          currentTopPx += GAP_PX + TICK_H_PX
        }
      })
    })

    hasRendered = true
  }

  function safeRender () {
    if (hasRendered) return
    collectData()
    renderOverlays()
  }

  setTimeout(safeRender, 1200)
  let t = null
  const observer = new MutationObserver(() => {
    if (t) clearTimeout(t)
    t = setTimeout(() => {
      hasRendered = false
      safeRender()
    }, 500)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})()
