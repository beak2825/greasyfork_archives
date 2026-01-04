// ==UserScript==
// @name           Multi Transfer Artifacts
// @author         Neleus
// @namespace      Neleus
// @description    Мультипередача артефактов
// @version        1.1
// @match          https://www.heroeswm.ru/inventory.php*
// @match          https://mirror.heroeswm.ru/inventory.php*
// @match          https://lordswm.com/inventory.php*
// @match          https://my.lordswm.com/inventory.php*
// @grant          none
// @license        GNU GPLv3
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/557820/Multi%20Transfer%20Artifacts.user.js
// @updateURL https://update.greasyfork.org/scripts/557820/Multi%20Transfer%20Artifacts.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // ==================== CONSTANTS ====================
  const DATA = document.documentElement.innerHTML

  // Find player ID
  let userID = null

  // Desktop: pl_hunter_stat link
  const idMatch = /pl_hunter_stat\.php\?id=(\d+)/.exec(DATA)
  if (idMatch) userID = idMatch[1]

  // Mobile fallback: cookie
  if (!userID) {
    const cookieMatch = document.cookie.match(/pl_id=(\d+)/)
    if (cookieMatch) userID = cookieMatch[1]
  }

  if (!userID) return

  const STORAGE_KEY = userID + "_translist"

  let IMG_LINK = "https://dcdn.heroeswm.ru/i/"
  if (/lordswm/.test(location.origin)) {
    IMG_LINK = "https://cfcdn.lordswm.com/i/"
  } else if (/mirror/.test(location.origin)) {
    IMG_LINK = "https://qcdn.heroeswm.ru/i/"
  }

  // ==================== STYLES ====================
  const styles = `
    .mtrans-container {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      box-sizing: border-box;
    }
    .mtrans-btn-anim {
      border-radius: 5px;
      animation: .5s linear infinite alternate mtrans-btn-anim;
    }
    @keyframes mtrans-btn-anim {
      from { outline: 4px dashed #aac7f500; }
      to { outline: 4px dashed #aac7f5ff; }
    }
    .mtrans-footer input, .mtrans-footer select { margin: 5px 0; }
    #btn_transfer { margin-top: 10px; padding: 4px; width: 100%; }
    .mtrans-header { width: 235px; text-align: center; }
    #art-name { height: 30px; font-weight: bold; word-wrap: break-word; font-size: 12px; }
    .mtrans-arts {
      width: 455px;
      height: 192px;
      overflow-y: scroll;
      padding: 2px;
      border: 1px dashed #aaa;
      box-sizing: border-box;
    }
    .mtrans-pool { font-size: 9pt; border: 1px dashed #aaa; }
    .mtrans-poolarts { padding: 0 4px; height: 156px; overflow-y: scroll; }
    .pool-element { display: grid; grid-template-columns: 1fr 45px 50px; }
    .pool-element > div { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pool-header { text-align: center; padding: 2px; background: #dde; }
    .pool-selected { outline: 1px dotted #aaa; }
    .mtrans-item { display: inline-block; margin: 2px !important; }
    .mtrans-selected { outline: 1px solid #000; }
    .mtrans-dur { position: absolute; font-size: 90%; top: 1px; left: 1px; z-index: 2; background: #fff8; pointer-events: none; }
    .dur-warn { color: #fff; background: #f008; }
    .ppb-warn { border: 2px solid #f00; }
    .mtrans-chk { position: absolute; top: 1px; right: 1px; z-index: 2; }
    .mtrans-pbar { width: 100%; display: none; }
    .mtrans-badge { outline: 3px dashed #ACE; }
    .no-events { pointer-events: none; }
    #inv_menu_mtrans { display: none; }
    #inv_menu_mtrans img { filter: hue-rotate(90deg) saturate(2); }
    .thin-scrollbar::-webkit-scrollbar { width: 7px; }
    .thin-scrollbar::-webkit-scrollbar-thumb { background: #fff; border-radius: 5px; }
    .thin-scrollbar::-webkit-scrollbar-track { background: #5554; }

    @media (max-width: 600px) {
      .mtrans-container { grid-template-columns: 1fr; padding: 5px; }
      .mtrans-header { width: 100%; margin-bottom: 10px; }
      .mtrans-arts { width: 100%; height: 150px; }
      .mtrans-footer { width: 100%; }
      .mtrans-footer input[type="text"] { width: 50px !important; }
      #renter { width: 100% !important; max-width: 200px !important; }
      .mtrans-pool { width: 100%; }
      .pool-element { grid-template-columns: 1fr 40px 45px; font-size: 8pt; }
      .mtrans-poolarts { height: 120px; }
      #art-name { font-size: 11px; height: auto; min-height: 30px; }
    }
  `

  const styleElement = document.createElement("style")
  styleElement.textContent = styles
  document.head.appendChild(styleElement)

  // ==================== UTILITY FUNCTIONS ====================
  const $ = (selector, context = document) => context.querySelector(selector)

  const loadPage = async (url) => {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    return new TextDecoder("windows-1251").decode(buffer)
  }

  const getStorage = (key, defaultValue = null) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const setStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }

  const getTranslist = () => getStorage(STORAGE_KEY, {})
  const saveTranslist = (list) => setStorage(STORAGE_KEY, list)

  // ==================== ARTS EXTRACTION ====================
  let INV_ARTS_OBJ = {}

  const getArtsFromPage = (attempt = 1) => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.textContent = `
        if (typeof arts !== 'undefined') {
          const obj = {};
          arts.forEach((s, t) => obj[t] = Object.values(s));
          window.postMessage({ type: 'HWM_ARTS', data: obj }, '*');
        }
      `
      document.body.appendChild(script)
      script.remove()

      let resolved = false
      const handler = (e) => {
        if (resolved) return
        if (e.data?.type === "HWM_ARTS") {
          resolved = true
          window.removeEventListener("message", handler)
          resolve(e.data.data)
        }
      }
      window.addEventListener("message", handler)

      setTimeout(() => {
        if (resolved) return
        window.removeEventListener("message", handler)
        if (attempt < 3) {
          setTimeout(() => resolve(getArtsFromPage(attempt + 1)), 500)
        } else {
          resolve({})
        }
      }, 2000)
    })
  }

  // ==================== HELPER FUNCTIONS ====================
  const getFriendsList = async () => {
    const page = await loadPage("friends.php")
    const matches = [...page.matchAll(/([\wа-яё\-\(\) ]+) \[/gi)]
    return matches.map(m => `<option value="${m[1]}">${m[1]}</option>`).join("")
  }

  const getIndex = (artId) => Object.keys(INV_ARTS_OBJ).find(t => INV_ARTS_OBJ[t][0] == artId) || -1

  const parseSuffix = (mods) => {
    return [...mods.matchAll(/\w\d+/g)].map(m => `<img src="${IMG_LINK}mods_png/24/${m[0]}.png">`).join("")
  }

  const urlencode = (str) => {
    let result = ""
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i)
      if (code >= 1040 && code <= 1103) code -= 848
      if (code === 1025) code = 168
      if (code === 1105) code = 184
      result += /[A-Za-z0-9\-_.~]/.test(String.fromCharCode(code))
        ? String.fromCharCode(code)
        : "%" + code.toString(16).toUpperCase().padStart(2, "0")
    }
    return result
  }

  const setMTransferBadges = (translist, container) => {
    document.querySelectorAll(".mtrans-badge").forEach(el => el.classList.remove("mtrans-badge"))
    for (let artId in translist) {
      const idx = getIndex(artId)
      const el = $(`[art_idx="${idx}"]`, container)
      if (el) el.classList.add("mtrans-badge")
    }
  }

  // ==================== POOL FUNCTIONS ====================
  const poolToSession = (poolData) => sessionStorage.setItem("mtrans", JSON.stringify(poolData))

  const checkBattlesCount = (poolData) => {
    for (let artId in poolData.arts) {
      const el = $(`[data-id="${artId}"]`)
      if (!el) continue
      const durDiv = el.firstChild
      const warn = poolData.arts[artId].dur1 < poolData.battles && poolData.selected.includes(artId)
      durDiv.classList.toggle("dur-warn", warn)
    }
  }

  const checkPPB = (poolData, artId) => {
    const ppbInput = $("#ppb")
    if (!ppbInput || !poolData.arts[artId]) return
    const warn = poolData.battles > 0 && poolData.arts[artId].ppb === 0 && poolData.selected.includes(artId)
    ppbInput.classList.toggle("ppb-warn", warn)
  }

  const checkTransEnable = (poolData, button) => {
    const hasZeroPPB = poolData.battles > 0 && poolData.selected.some(id => poolData.arts[id]?.ppb === 0)
    button.disabled = poolData.selected.length === 0 || poolData.days === 0 || !poolData.renter || hasZeroPPB
  }

  const showPool = (poolData, selectedItem) => {
    let html = '<div class="pool-element pool-header"><div>Артефакт</div><div>Сумма</div><div>Комиссия</div></div><div class="mtrans-poolarts thin-scrollbar">'
    let num = 1, totalSum = 0, totalComm = 0

    for (let artId of poolData.selected) {
      const art = poolData.arts[artId]
      const sum = art.ppb * Math.min(poolData.battles, art.dur1)
      const comm = sum < 50 && sum > 0 ? 1 : Math.round(sum / 100)
      totalSum += sum
      totalComm += comm
      art.summ = sum
      const isSelected = selectedItem?.dataset.id === artId
      html += `<div class="pool-element${isSelected ? " pool-selected" : ""}"><div>${num++}. ${art.name} [${art.dur1}/${art.dur2}]</div><div>${sum}</div><div>${comm}</div></div>`
    }

    html += "</div>"
    $("#pool").innerHTML = html
    $("#summ").textContent = totalSum
    $("#comm").textContent = totalComm
  }

  const setSelected = (poolData, selectedItem) => {
    const ppbInput = $("#ppb"), artNameDiv = $("#art-name")
    const removeBtn = $("#btn_remove"), saveBtn = $("#btn_save")

    if (!selectedItem) {
      artNameDiv.textContent = "Перетащите артефакты на эту вкладку"
      ppbInput.value = 0
      ppbInput.disabled = removeBtn.disabled = saveBtn.disabled = true
      return
    }

    $(".mtrans-selected")?.classList.remove("mtrans-selected")
    selectedItem.classList.add("mtrans-selected")

    const artId = selectedItem.dataset.id
    const art = poolData.arts[artId]
    checkPPB(poolData, artId)
    artNameDiv.textContent = `${art.name} [${art.dur1}/${art.dur2}]`
    ppbInput.value = art.ppb
    ppbInput.disabled = removeBtn.disabled = saveBtn.disabled = false
  }

  // ==================== TRANSFER EXECUTION ====================
  const transferPool = async (poolData) => {
    const errorDiv = $("#mtrans-error"), progressBar = $(".mtrans-pbar")
    progressBar.style.display = "block"
    errorDiv.innerHTML = "<br>"

    const sign = /sign='(\w+)/.exec(DATA)[1]
    const step = 100 / poolData.selected.length

    for (let artId of poolData.selected) {
      const response = await fetch("art_transfer.php", {
        method: "POST",
        redirect: "manual",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${artId}&nick=${urlencode(poolData.renter)}&gold=${poolData.arts[artId].summ}&sendtype=2&dtime=${poolData.days}&bcount=${poolData.battles}&rep_price=0&art_id=&sign=${sign}`,
      })

      if (response.ok) {
        progressBar.style.display = "none"
        const buffer = await response.arrayBuffer()
        const html = new TextDecoder("windows-1251").decode(buffer)
        const doc = new DOMParser().parseFromString(html, "text/html")
        errorDiv.append($("td>font", doc))
        $("#btn_transfer").disabled = false
        return
      }
      progressBar.value += step
    }

    sessionStorage.setItem("redirect", "true")
    location.reload()
  }

  // ==================== MULTI TRANSFER PANEL ====================
  const MTPanel = async (container, friendsOptions, translist) => {
    const poolData = { arts: {}, selected: [], days: 0, hours: 0, battles: 0, renter: "" }

    let html = '<div class="mtrans-container"><div class="mtrans-header"><div id="art-name"></div>'
    html += '<br>Стоимость боя <input id="ppb" type="text" maxlength="4" size="4" placeholder="0">'
    html += "<br><br><button id=btn_save>Сохранить цену</button><br><br><button id=btn_remove>Убрать артефакт</button>"
    html += '</div><div class="mtrans-arts thin-scrollbar">'

    const sortedIds = Object.keys(translist).sort((a, b) => getIndex(a) - getIndex(b))
    for (let artId of sortedIds) {
      const idx = getIndex(artId)
      if (idx === -1 || !INV_ARTS_OBJ[idx] || INV_ARTS_OBJ[idx][12] !== 0 || INV_ARTS_OBJ[idx][20] === 1) continue

      const art = INV_ARTS_OBJ[idx]
      const imgMatch = /artifacts\/((?:\w+\/)*[\w-]+)/.exec(art[7])
      poolData.arts[artId] = { name: art[3] + art[8], ppb: translist[artId], dur1: art[5], dur2: art[6] }

      html += `<div class="inventory_item_div mtrans-item" data-id="${artId}" art_idx="${idx}">`
      html += `<div class="mtrans-dur">${art[5]}/${art[6]}</div><input type="checkbox" class="mtrans-chk">`
      html += `<img src="${IMG_LINK}art_fon_100x100.png" height="100%">`
      html += `<img src="${IMG_LINK}artifacts/${imgMatch?.[1] || ""}.png" height="100%" class="cre_mon_image2">`
      html += `<div class="art_mods no-events">${parseSuffix(art[8])}</div></div>`
    }

    html += '</div><div class="mtrans-footer">'
    html += `<select style="width:100%" id="friends"><option selected disabled>Выбрать получателя</option>${friendsOptions}</select><br>`
    html += 'Получатель <input id="renter" type="text" style="width:155px"><br>Передать через:<br>'
    html += '<input style="width:42px" id="hours" type="text" maxlength="3" placeholder="0"> час.'
    html += ' <input style="width:42px" id="days" type="text" maxlength="3" placeholder="0"> дн.'
    html += ' <input style="width:24px" id="bcount" type="text" maxlength="2" placeholder="0"> боёв<br>'
    html += 'Стоимость: <span id="summ">0</span> Комиссия: <span id="comm">0</span>'
    html += '<button id="btn_transfer">Передать</button></div>'
    html += '<div id="pool" class="mtrans-pool"></div></div><progress class="mtrans-pbar" max="100" value="0"></progress><div id="mtrans-error"></div>'

    container.innerHTML = html

    const renterInput = $("#renter"), bcountInput = $("#bcount")
    const daysInput = $("#days"), hoursInput = $("#hours"), transferBtn = $("#btn_transfer")
    let currentItem = $(".mtrans-item")

    // Restore session
    const saved = sessionStorage.getItem("mtrans")
    if (saved) {
      const s = JSON.parse(saved)
      poolData.renter = renterInput.value = s.renter || ""
      poolData.battles = s.battles || 0
      poolData.days = s.days || 0
      poolData.hours = s.hours || 0
      bcountInput.value = poolData.battles || ""
      daysInput.value = poolData.days || ""
      hoursInput.value = poolData.hours || ""
      poolData.selected = s.selected?.filter(id => id in poolData.arts) || []
      poolData.selected.forEach(id => {
        const cb = $(`[data-id="${id}"] .mtrans-chk`)
        if (cb) cb.checked = true
      })
    }

    showPool(poolData, currentItem)
    poolToSession(poolData)
    setSelected(poolData, currentItem)
    checkTransEnable(poolData, transferBtn)
    checkBattlesCount(poolData)

    // Events
    transferBtn.onclick = () => { transferBtn.disabled = true; transferPool(poolData) }

    $(".mtrans-arts").onclick = (e) => {
      if (e.target.tagName === "IMG") {
        currentItem = e.target.parentNode
        setSelected(poolData, currentItem)
        showPool(poolData, currentItem)
      }
      if (e.target.tagName === "INPUT") {
        const artId = e.target.parentNode.dataset.id
        if (e.target.checked) poolData.selected.push(artId)
        else poolData.selected = poolData.selected.filter(id => id !== artId)
        currentItem = e.target.parentNode
        setSelected(poolData, currentItem)
        showPool(poolData, currentItem)
        poolToSession(poolData)
        checkTransEnable(poolData, transferBtn)
        checkBattlesCount(poolData)
      }
    }

    $("#btn_save").onclick = () => {
      const artId = currentItem.dataset.id
      poolData.arts[artId].ppb = translist[artId] = +$("#ppb").value
      saveTranslist(translist)
      showPool(poolData, currentItem)
      poolToSession(poolData)
      checkPPB(poolData, artId)
      checkTransEnable(poolData, transferBtn)
    }

    $("#btn_remove").onclick = () => {
      const artId = currentItem.dataset.id
      delete translist[artId]
      delete poolData.arts[artId]
      poolData.selected = poolData.selected.filter(id => id !== artId)
      currentItem.remove()
      saveTranslist(translist)
      currentItem = $(".mtrans-item")
      setSelected(poolData, currentItem)
      showPool(poolData, currentItem)
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
    }

    renterInput.oninput = () => {
      poolData.renter = renterInput.value.trim()
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
    }

    $("#friends").onchange = (e) => {
      poolData.renter = renterInput.value = e.target.value
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
    }

    daysInput.oninput = () => {
      poolData.days = Math.min(365, +daysInput.value) || 0
      poolData.hours = poolData.days * 24
      hoursInput.value = poolData.hours || ""
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
    }

    hoursInput.oninput = () => {
      const hours = +hoursInput.value
      if (!hours || hours < 0.1) return
      poolData.hours = hours
      poolData.days = +(hours / 24).toFixed(3)
      daysInput.value = poolData.days
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
    }

    bcountInput.oninput = () => {
      poolData.battles = +bcountInput.value || 0
      showPool(poolData, currentItem)
      poolToSession(poolData)
      checkTransEnable(poolData, transferBtn)
      checkBattlesCount(poolData)
      if (currentItem) checkPPB(poolData, currentItem.dataset.id)
    }
  }

  // ==================== MOBILE SUPPORT ====================
  const setupMobileSupport = (container) => {
    const invMenu = $("#inv_menu")
    if (!invMenu) return

    const buttonsContainer = $("#inv_item_buttons")
    if (!buttonsContainer || $("#inv_menu_mtrans")) return

    const btn = document.createElement("div")
    btn.className = "inv_item_select"
    btn.id = "inv_menu_mtrans"
    btn.innerHTML = `<img class="inv_item_select_img show_hint" hint="В мультипередачу" src="${IMG_LINK}inv_im/btn_art_transfer.png">`
    buttonsContainer.insertBefore(btn, buttonsContainer.lastElementChild)

    btn.onclick = (e) => {
      e.stopPropagation()
      const artIdx = invMenu.getAttribute("art_idx")
      if (!artIdx || !INV_ARTS_OBJ[artIdx]) return

      const artId = INV_ARTS_OBJ[artIdx][0]
      if (INV_ARTS_OBJ[artIdx][23] === 0) return alert("Этот артефакт нельзя передать")

      const translist = getTranslist()
      if (artId in translist) return alert("Уже в списке мультипередачи")

      translist[artId] = 0
      saveTranslist(translist)
      setMTransferBadges(translist, container)

      const s = document.createElement("script")
      s.textContent = "if(typeof inv_menu_hide==='function')inv_menu_hide();"
      document.body.appendChild(s)
      s.remove()
    }

    const updateVisibility = () => {
      const artIdx = invMenu.getAttribute("art_idx")
      if (!artIdx || artIdx === "-1" || !INV_ARTS_OBJ[artIdx]) {
        btn.style.display = "none"
        return
      }
      const artId = INV_ARTS_OBJ[artIdx][0]
      const canTransfer = INV_ARTS_OBJ[artIdx][23] !== 0
      btn.style.display = (canTransfer && !(artId in getTranslist())) ? "block" : "none"
    }

    new MutationObserver(updateVisibility).observe(invMenu, { attributes: true, attributeFilter: ["art_idx", "style"] })
  }

  // ==================== MAIN ====================
  const multiTransfer = async (container) => {
    const tabsBlock = $(".filter_tabs_block")
    if (!tabsBlock) return

    const mtransIcon = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round"><path d="M5 9h14l-4-4M5 15h14l-4 4"/></svg>')}`
    tabsBlock.insertAdjacentHTML("beforeend",
      `<div id="mtrans_btn" hint="mtrans" title="Мультипередача" style="background:url('${mtransIcon}') no-repeat center, #fff; background-size: 20px;" class="filter_tab filter_tab_for_hover"></div>`)

    const mtransBtn = $("#mtrans_btn")
    let translist = getTranslist()
    setMTransferBadges(translist, container)

    const friendsOptions = await getFriendsList()

    mtransBtn.onclick = () => {
      const active = $(".filter_tab_active")
      if (active !== mtransBtn) {
        active?.classList.replace("filter_tab_active", "filter_tab_for_hover")
        mtransBtn.classList.replace("filter_tab_for_hover", "filter_tab_active")
        $("#return_all_rents")?.style.setProperty("display", "none")
        translist = getTranslist()
        MTPanel(container, friendsOptions, translist)
      }
    }

    let draggedIndex = null, draggedArtId = null

    container.ondragstart = (e) => {
      let target = e.target
      while (target && !(draggedIndex = target.getAttribute("art_idx"))) target = target.parentNode
      if (!draggedIndex || !INV_ARTS_OBJ[draggedIndex]) return
      draggedArtId = INV_ARTS_OBJ[draggedIndex][0]
      if (INV_ARTS_OBJ[draggedIndex][23] !== 0 && !(draggedArtId in translist)) {
        mtransBtn.classList.add("mtrans-btn-anim")
      }
    }

    mtransBtn.ondragover = (e) => {
      if (draggedIndex && INV_ARTS_OBJ[draggedIndex]?.[23] !== 0 && !(draggedArtId in translist)) {
        e.preventDefault()
      }
    }

    document.ondragend = () => mtransBtn.classList.remove("mtrans-btn-anim")
    tabsBlock.ondrop = () => mtransBtn.classList.remove("mtrans-btn-anim")

    mtransBtn.ondrop = () => {
      if (draggedArtId && !(draggedArtId in translist)) {
        translist[draggedArtId] = 0
        saveTranslist(translist)
        setMTransferBadges(translist, container)
      }
    }

    if (sessionStorage.getItem("redirect")) {
      sessionStorage.removeItem("redirect")
      mtransBtn.click()
    }
  }

  // ==================== INIT ====================
  const init = async () => {
    if (document.readyState !== "complete") {
      await new Promise(r => window.addEventListener("load", r, { once: true }))
    }

    INV_ARTS_OBJ = await getArtsFromPage()
    if (!Object.keys(INV_ARTS_OBJ).length) return

    const container = $("#inventory_block") || $(".inventory_items_block") || document.body

    setupMobileSupport(container)
    await multiTransfer(container)

    const invContainer = $("#inventory_block") || $(".inventory_items_block")
    if (invContainer) {
      new MutationObserver(async () => {
        INV_ARTS_OBJ = await getArtsFromPage()
        if ($(".filter_tab_active")?.getAttribute("hint") !== "mtrans") {
          setMTransferBadges(getTranslist(), invContainer)
        }
      }).observe(invContainer, { childList: true, subtree: true })
    }
  }

  init()
})()
