// ==UserScript==
// @name           Wplace Region Downloader
// @namespace      https://greasyfork.org/ru/users/1556543-jimorosuto
// @version        0.3.1
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

  /* Icons */
  const icons = {
    close: `<svg viewBox="0 -960 960 960" fill="currentColor" class="size-4">
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path>
    </svg>`,
    download: `<svg viewBox="0 -960 960 960" fill="currentColor" class="size-4.5">
      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
    </svg>`,
    copy: `<svg viewBox="0 -960 960 960" fill="currentColor" class="size-4.5">
      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
    </svg>`,
    pick: `<svg viewBox="0 -960 960 960" class="wprd-pick-icon size-4.5">
      <path d="M480.21-480Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM480-191q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Zm0-456Z" fill="currentColor"/>
    </svg>`,
    toggle: `<svg viewBox="0 -960 960 960" fill="currentColor" class="size-4.5">
      <path d="M696-84v-108H588v-72h108v-108h72v108h108v72H768v108h-72ZM192-192v-192h72v120h120v72H192Zm0-384v-192h192v72H264v120h-72Zm504 0v-120H576v-72h192v192h-72Z"/>
    </svg>`,
    cornerFirst: `<svg width="14" height="14" viewBox="0 -960 960 960">
      <path d="M717-192 288-621v237h-72v-360h360v72H339l429 429-51 51Z" fill="currentColor"/>
    </svg>`,
    cornerSecond: `<svg viewBox="0 -960 960 960" class="size-3">
      <path d="M384-216v-72h237L192-717l51-51 429 429v-237h72v360H384Z" fill="currentColor"/>
    </svg>`,
  }
  const icon = name => icons[name] || ""

  /* State */
  let popupVisible = false
  let pendingPoint = null
  const chunkCoords = { first: { x: null, y: null }, second: { x: null, y: null } }
  const pixelCoords = { first: { x: null, y: null }, second: { x: null, y: null } }

  /* UI */
  const root = document.createElement("div")
  root.id = "wprd-popup"
  root.style.display = "none"
  root.classList = "absolute bottom-3 px-2 z-50 w-full"
  root.innerHTML = `
    <div class="rounded-t-box bg-base-100 border-base-300 sm:rounded-b-box w-full border-t">
      <div class="flex gap-2 px-3 pt-3 pl-4">
        <div class="flex grow gap-1"><h2>Wplace Region Downloader</h2></div>
        <button id="wprd-close" class="btn btn-circle btn-sm">${icon("close")}</button>
      </div>
      ${pointBlock("first", t.firstPoint)}
      ${pointBlock("second", t.secondPoint)}
      <div class="flex justify-center gap-1.5 hide-scrollbar overflow-x-auto pb-2 sm:pb-3">
        <button id="wprd-download" class="btn btn-primary disabled:opacity-90 disabled:cursor-not-allowed flex items-center gap-2" disabled>
          <div class="wprd-button-icon">${icon("download")}</div>
          <span class="wprd-button-label">${t.download}</span>
        </button>
        <button id="wprd-copy" class="btn btn-primary btn-circle disabled:opacity-90 disabled:cursor-not-allowed flex items-center justify-center" disabled>
          <div class="wprd-button-icon">${icon("copy")}</div>
        </button>
      </div>
    </div>
  `
  document.body.appendChild(root)

  function pointBlock(id, label) {
    const cornerSvg = id == "first" ? icon("cornerFirst") : icon("cornerSecond")
    return `
      <div class="mb-3 px-3">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-1 font-medium">
            ${cornerSvg}
            <span class="text-sm">${label}</span>
          </div>
        </div>
        <div class="relative flex items-center justify-center gap-1">
          <label class="input w-full"><input id="${id}-cx" placeholder="CX" maxlength="4"></label>
          <label class="input w-full"><input id="${id}-cy" placeholder="CY" maxlength="4"></label>
          <label class="input w-full"><input id="${id}-px" placeholder="PX" maxlength="4"></label>
          <label class="input w-full"><input id="${id}-py" placeholder="PY" maxlength="4"></label>
          <button id="${id}-pick" class="btn btn-sm btn-circle">${icon("pick")}</button>
        </div>
      </div>
    `
  }

  /* Styles */
  const style = document.createElement("style")
  style.textContent = `

    #wprd-popup {
      width: min(100vw - 24px, 350px);
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
      animation: wprd-swing 1.4s linear infinite;
      transform-origin: bottom center;
    }
  `
  document.head.appendChild(style)

  const el = (id) => document.getElementById(id)
  const downloadBtn = el("wprd-download")
  const copyBtn = el("wprd-copy")

  /* Sync */
  function syncToInputs() {
    ["first", "second"].forEach(p => {
      el(`${p}-cx`).value = chunkCoords[p].x ?? ""
      el(`${p}-cy`).value = chunkCoords[p].y ?? ""
      el(`${p}-px`).value = pixelCoords[p].x ?? ""
      el(`${p}-py`).value = pixelCoords[p].y ?? ""
    })
  }

  function syncFromInputs() {
    ["first", "second"].forEach(p => {
      const vals = [el(`${p}-cx`).value.trim(), el(`${p}-cy`).value.trim(), el(`${p}-px`).value.trim(), el(`${p}-py`).value.trim()]
      chunkCoords[p].x = vals[0] ? +vals[0] : null
      chunkCoords[p].y = vals[1] ? +vals[1] : null
      pixelCoords[p].x = vals[2] ? Math.min(999, Math.max(0, +vals[2])) : null
      pixelCoords[p].y = vals[3] ? Math.min(999, Math.max(0, +vals[3])) : null
    })
    const isEnabled = Object.values(chunkCoords).every(c => c.x !== null && c.y !== null) &&
      Object.values(pixelCoords).every(c => c.x !== null && c.y !== null)

    downloadBtn.disabled = !isEnabled
    copyBtn.disabled = !isEnabled
  }

  root.querySelectorAll("input").forEach(i => i.addEventListener("input", syncFromInputs))

  /* Pick */
  el("first-pick").onclick = () => pick("first")
  el("second-pick").onclick = () => pick("second")

  function clearPickStyles() {
    ["first", "second"].forEach(p => {
      document.querySelector(`#${p}-pick .wprd-pick-icon`)
        .classList.remove("swing", "text-primary")
    })
  }

  function pick(point) {
    clearPickStyles()
    pendingPoint = point
    document.querySelector(`#${point}-pick .wprd-pick-icon`)
      .classList.add("swing", "text-primary")
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
    } catch {}
    return res
  }

  /* Download */
  function setButtonLoading(button, loading) {
    const iconContainer = button.querySelector(".wprd-button-icon")

    if (loading) {
      button.disabled = true
      iconContainer.innerHTML = '<div class="wprd-spinner"></div>'
    } else {
      button.disabled = false
    }
  }

  async function fetchInBatches(tasks, limit = 6) {
    const results = []
    let idx = 0

    async function worker() {
      while (idx < tasks.length) {
        const cur = idx++
        results[cur] = await tasks[cur]()
      }
    }

    await Promise.all(Array.from({ length: limit }, worker))
    return results
  }

  async function buildRegionImage() {
    syncFromInputs()

    const allSet =
      Object.values(chunkCoords).every(c => c.x !== null && c.y !== null) &&
      Object.values(pixelCoords).every(c => c.x !== null && c.y !== null)
    if (!allSet) return null

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

    const base = document.createElement("canvas")
    base.width = widthChunks * TILE_SIZE
    base.height = heightChunks * TILE_SIZE
    const ctx = base.getContext("2d")

    const tasks = []
    for (let y = c.y1; y <= c.y2; y++) {
      for (let x = c.x1; x <= c.x2; x++) {
        const dx = x - c.x1
        const dy = y - c.y1
        tasks.push(async () => {
          try {
            const r = await fetch(`${chunkTemplateUrl}${x}/${y}.png`)
            if (!r.ok) return
            const b = await r.blob()
            const img = await createImageBitmap(b)
            ctx.drawImage(img, dx * TILE_SIZE, dy * TILE_SIZE)
            img.close?.()
          } catch (e) {
            console.warn(`Failed to load tile ${x}/${y}`, e)
          }
        })
      }
    }

    await fetchInBatches(tasks, 6)

    const crop = calcCropRect()
    const rx = crop.x - c.x1 * TILE_SIZE
    const ry = crop.y - c.y1 * TILE_SIZE

    const out = document.createElement("canvas")
    out.width = crop.w
    out.height = crop.h
    out.getContext("2d").drawImage(base, rx, ry, crop.w, crop.h, 0, 0, crop.w, crop.h)

    return await new Promise(resolve => out.toBlob(blob => resolve(blob)))
  }

  downloadBtn.onclick = async () => {
    setButtonLoading(downloadBtn, true)

    const blob = await buildRegionImage()

    if (blob) {
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `wplace-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(a.href)

      downloadBtn.querySelector(".wprd-button-icon").innerHTML = icon("download")
      downloadBtn.querySelector(".wprd-button-label").textContent = t.download
    }

    setButtonLoading(downloadBtn, false)
    syncFromInputs()
  }

  copyBtn.onclick = async () => {
    setButtonLoading(copyBtn, true)

    const blob = await buildRegionImage()

    if (blob) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        copyBtn.querySelector(".wprd-button-icon").innerHTML = icon("copy")
      } catch (err) {
        copyBtn.querySelector(".wprd-button-icon").textContent = "!"
        setTimeout(() => { copyBtn.querySelector(".wprd-button-icon").innerHTML = icon("copy")}, 2000)
      }
    }

    setButtonLoading(copyBtn, false)
    syncFromInputs()
  }

  el("wprd-close").onclick = () => {
    popupVisible = false
    root.style.display = "none"
  }

  /* Toggle button */
  function injectBtn(container) {
    if (!container || container.querySelector("#wprd-toggle-btn")) return
    const btn = document.createElement("button")
    btn.id = "wprd-toggle-btn"
    btn.className = "btn btn-sm btn-circle"
    btn.innerHTML = icon("toggle")
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