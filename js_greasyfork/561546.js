// ==UserScript==
// @name           Wplace Region Downloader
// @namespace      https://greasyfork.org/ru/users/1556543-jimorosuto
// @version        0.1.0
// @description    Allows downloading a selected region from wplace.live as a single image.
// @description:ru Позволяет скачивать выбранный регион с wplace.live в виде одного изображения.
// @author         Jimorosuto
// @match          https://wplace.live/*
// @grant          unsafeWindow
// @grant          GM_download
// @run-at         document-end
// @icon           https://wplace.live/favicon.ico
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/561546/Wplace%20Region%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561546/Wplace%20Region%20Downloader.meta.js
// ==/UserScript==


(() => {
  const TILE_SIZE = 1000
  const chunkTemplateUrl = "https://backend.wplace.live/files/s0/tiles/"

  /* i18n */
  const lang = navigator.language.slice(0, 2).toLowerCase()
  const translations = {
    en: {
      firstPoint: "First point",
      secondPoint: "Second point",
      download: "Download",
    },
    ru: {
      firstPoint: "Первая точка",
      secondPoint: "Вторая точка",
      download: "Скачать",
    },
  }
  const t = translations[lang] || translations.en

  /* State */
  let popupVisible = false
  let pendingPoint = null
  const chunkCoords = { first: { x: null, y: null }, second: { x: null, y: null } }
  const pixelCoords = { first: { x: null, y: null }, second: { x: null, y: null } }

  /* UI */
  const root = document.createElement("div")
  root.id = "wprd-popup"
  root.style.display = "none"
  root.innerHTML = `
    <div class="text-center font-medium mb-2">
      Wplace Region Downloader
    </div>
    ${pointBlock("first", t.firstPoint)}
    ${pointBlock("second", t.secondPoint)}
    <div class="flex justify-center mt-2">
      <button class="btn btn-success wprd-download disabled:opacity-90 disabled:cursor-not-allowed" disabled>
        <span class="wprd-download-label">${t.download}</span>
      </button>
    </div>
  `
  document.body.appendChild(root)

  function pointBlock(id, label) {
    const corner = id === "first"
      ? "M717-192 288-621v237h-72v-360h360v72H339l429 429-51 51Z"
      : "M384-216v-72h237L192-717l51-51 429 429v-237h72v360H384Z"
    return `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-1 font-medium">
            <svg width="14" height="14" viewBox="0 -960 960 960">
              <path d="${corner}" fill="currentColor"/>
            </svg>
            <span>${label}</span>
          </div>
          <button class="btn btn-sm btn-circle ${id}-pick">
          <svg class="wprd-pick-icon" width="20px" height="20px" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
            <path d="M480.21-480Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM480-191q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Zm0-456Z" fill="currentColor"/>
          </svg>
          </button>
        </div>
        <div class="grid gap-1" style="grid-template-columns: repeat(4, 1fr);">
          <input class="${id}-cx wprd-input" placeholder="CX">
          <input class="${id}-cy wprd-input" placeholder="CY">
          <input class="${id}-px wprd-input" placeholder="PX">
          <input class="${id}-py wprd-input" placeholder="PY">
        </div>
      </div>
    `
  }

  /* Styles */
  const style = document.createElement("style")
  style.textContent = `
    #wprd-popup {
      position: fixed;
      left: 12px;
      bottom: 12px;
      width: 320px;
      padding: 12px;
      border-radius: 12px;
      z-index: 9999;
      font-size: 13px;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #111;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }

    .wprd-input {
      width: 100%;
      padding: 4px;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #d1d5db;
      background: inherit;
      color: inherit;
      font-size: 12px;
    }

    .wprd-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: wprd-spin 0.8s linear infinite;
    }

    @keyframes wprd-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes wprd-swing {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(15deg); }
      75% { transform: rotate(-15deg); }
      100% { transform: rotate(0deg); }
    }

    .wprd-pick-icon.swing {
      animation: wprd-swing 1.4s ease-in-out infinite;
      transform-origin: bottom center;
    }
  `
  document.head.appendChild(style)

  const q = (s) => root.querySelector(s)
  const downloadBtn = q(".wprd-download")

  /* Sync */
  function syncToInputs() {
    ["first", "second"].forEach(p => {
      q(`.${p}-cx`).value = chunkCoords[p].x ?? ""
      q(`.${p}-cy`).value = chunkCoords[p].y ?? ""
      q(`.${p}-px`).value = pixelCoords[p].x ?? ""
      q(`.${p}-py`).value = pixelCoords[p].y ?? ""
    })
  }

  function syncFromInputs() {
    ["first", "second"].forEach(p => {
      const vals = [q(`.${p}-cx`).value.trim(), q(`.${p}-cy`).value.trim(), q(`.${p}-px`).value.trim(), q(`.${p}-py`).value.trim()]
      chunkCoords[p].x = vals[0] ? +vals[0] : null
      chunkCoords[p].y = vals[1] ? +vals[1] : null
      pixelCoords[p].x = vals[2] ? +vals[2] : null
      pixelCoords[p].y = vals[3] ? +vals[3] : null
    })
    downloadBtn.disabled = !Object.values(chunkCoords).every(c => c.x !== null && c.y !== null) ||
      !Object.values(pixelCoords).every(c => c.x !== null && c.y !== null)
  }

  root.querySelectorAll("input").forEach(i => i.addEventListener("input", syncFromInputs))

  /* Pick */
  q(".first-pick").onclick = () => pick("first")
  q(".second-pick").onclick = () => pick("second")

  function clearPickStyles() {
    ["first", "second"].forEach(p => {
      q(`.${p}-pick .wprd-pick-icon`)
        .classList.remove("swing", "text-primary")
    })
  }

  function pick(point) {
    clearPickStyles()
    pendingPoint = point
    q(`.${point}-pick .wprd-pick-icon`).classList.add("swing", "text-primary")
  }

  function resetPick() {
    clearPickStyles()
    pendingPoint = null
  }

  /* Fetch override */
  const w = unsafeWindow
  const origFetch = w.fetch.bind(w)
  w.fetch = async (...args) => {
    const res = await origFetch(...args)
    try {
      const url = new URL(args[0], location.href)
      const x = url.searchParams.get("x")
      const y = url.searchParams.get("y")
      if (pendingPoint && x !== null && y !== null) {
        const point = pendingPoint
        const parts = url.pathname.split("/")
        const chunkX = Number(parts.at(-2))
        const chunkYStr = parts.at(-1)
        const chunkY = chunkYStr ? Number(chunkYStr.replace(".png", "")) : null
        if (!isNaN(chunkX) && !isNaN(chunkY)) {
          chunkCoords[point] = { x: chunkX, y: chunkY }
          pixelCoords[point] = { x: Number(x), y: Number(y) }
          pendingPoint = null
          syncToInputs()
          syncFromInputs()
          resetPick()
        }
      }
    } catch { }
    return res
  }

  /* DOWNLOAD */

  function setDownloading(state) {
    const btn = downloadBtn
    const label = btn.querySelector(".wprd-download-label")

    if (state) {
      btn.disabled = true
      label.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="wprd-spinner"></span>
        <span>Загрузка…</span>
      </span>
    `
    } else {
      label.textContent = t.download
      syncFromInputs()
    }
  }

  q(".wprd-download").onclick = async () => {
    syncFromInputs()
    const allSet =
      Object.values(chunkCoords).every(c => c.x !== null && c.y !== null) &&
      Object.values(pixelCoords).every(c => c.x !== null && c.y !== null)
    if (!allSet) return

    setDownloading(true)

    function calcCropRect() {
      const p1 = { x: chunkCoords.first.x * TILE_SIZE + pixelCoords.first.x, y: chunkCoords.first.y * TILE_SIZE + pixelCoords.first.y }
      const p2 = { x: chunkCoords.second.x * TILE_SIZE + pixelCoords.second.x, y: chunkCoords.second.y * TILE_SIZE + pixelCoords.second.y }
      const left = Math.min(p1.x, p2.x)
      const top = Math.min(p1.y, p2.y)
      return {
        x: left,
        y: top,
        w: Math.max(p1.x, p2.x) - left + 1,
        h: Math.max(p1.y, p2.y) - top + 1,
      }
    }

    const organize = (a, b) => ({ x1: Math.min(a.x, b.x), y1: Math.min(a.y, b.y), x2: Math.max(a.x, b.x), y2: Math.max(a.y, b.y) })
    const c = organize(chunkCoords.first, chunkCoords.second)
    const widthChunks = c.x2 - c.x1 + 1
    const heightChunks = c.y2 - c.y1 + 1

    try {
      const imgs = []
      for (let y = c.y1; y <= c.y2; y++) {
        for (let x = c.x1; x <= c.x2; x++) {
          const r = await fetch(`${chunkTemplateUrl}${x}/${y}.png`)
          if (!r.ok) continue
          const b = await r.blob()
          imgs.push(await createImageBitmap(b))
        }
      }

      const base = document.createElement("canvas")
      base.width = widthChunks * TILE_SIZE
      base.height = heightChunks * TILE_SIZE
      const ctx = base.getContext("2d")

      let idx = 0
      for (let y = 0; y < heightChunks; y++) {
        for (let x = 0; x < widthChunks; x++) {
          if (imgs[idx]) ctx.drawImage(imgs[idx], x * TILE_SIZE, y * TILE_SIZE)
          idx++
        }
      }

      const crop = calcCropRect()
      const rx = crop.x - c.x1 * TILE_SIZE
      const ry = crop.y - c.y1 * TILE_SIZE

      const out = document.createElement("canvas")
      out.width = crop.w
      out.height = crop.h
      out.getContext("2d").drawImage(base, rx, ry, crop.w, crop.h, 0, 0, crop.w, crop.h)

      out.toBlob((blob) => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `wplace-region-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(a.href)
      })
    } finally {
      setDownloading(false)
    }
  }

  /* Toggle button */
  function injectBtn(container) {
    if (!container || container.querySelector("#wprd-toggle-btn")) return
    const btn = document.createElement("button")
    btn.id = "wprd-toggle-btn"
    btn.className = "btn btn-sm btn-circle"
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
        <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-168h72v168h168v72H216Zm360 0v-72h168v-168h72v168q0 29.7-21.15 50.85Q773.7-144 744-144H576ZM144-576v-168q0-29.7 21.15-50.85Q186.3-816 216-816h168v72H216v168h-72Zm600 0v-168H576v-72h168q29.7 0 50.85 21.15Q816-773.7 816-744v168h-72Z"/>
      </svg>
    `
    btn.onclick = () => {
      popupVisible = !popupVisible
      root.style.display = popupVisible ? "block" : "none"
    }
    container.appendChild(btn)
  }

  new MutationObserver(() => {
    const c = document.querySelector(".absolute.left-2.top-2.flex-col")
    if (c) injectBtn(c)
  }).observe(document.body, { childList: true, subtree: true })
})()