// ==UserScript==
// @name        TBD - Combined Shoutbox Tools
// @namespace   GTmonkey Scripts
// @match       https://www.torrentbd.com/
// @match       https://www.torrentbd.me/
// @match       https://www.torrentbd.net/
// @match       https://www.torrentbd.org/
// @exclude     *?account-login
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.1
// @run-at      document-end
// @author      BENZiN + 5ifty6ix
// @license     MIT
// @description Combined script with Easy mentioning + Shoutbox Notifier + Url Helper.
// @icon       https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @downloadURL https://update.greasyfork.org/scripts/558010/TBD%20-%20Combined%20Shoutbox%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/558010/TBD%20-%20Combined%20Shoutbox%20Tools.meta.js
// ==/UserScript==

// ===== Main Scripts Links ====
// https://greasyfork.org/scripts/546367  &  https://greasyfork.org/scripts/454697
// ==================

;(() => {
  // ===========================
  // CONFIGURATION
  // ===========================
  const enableEasyMention = 1
  const enableUrlBtn = 1
  const enableNotifier = 1

  const processedMessages = window.localStorage.getItem("TBD_processed_messages")
    ? JSON.parse(window.localStorage.getItem("TBD_processed_messages"))
    : []
  const MAX_PROCESSED_MESSAGES = 200

  // ===========================
  // GLOBAL STYLES
  // ===========================
  let css = ""

  // Easy Mention Styles
  const easyMentionStyles = `
        .shout-user {
            user-select: none;
        }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]) {
            cursor: pointer;
            position: relative;
        }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover {
            margin-left: -1.5em;
        }
        .chromium span.shout-time:has(+ .shout-user [href^="account"])::after {
            content: "";
            margin-left: .5em;
            height: 1em;
            rotate: 180deg;
            display: none;
            width: 1em;
        }
        .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover::after {
            display: inline-block;
        }
        .firefox span.shout-time {
            cursor: pointer;
            position: relative;
        }
        .firefox span.shout-time:hover {
            margin-left: -1.5em;
        }
        .firefox span.shout-time::after {
            content: "";
            margin-left: .5em;
            height: 1em;
            rotate: 180deg;
            display: none;
            width: 1em;
        }
        .firefox span.shout-time:hover::after {
            display: inline-block;
        }
        .dark-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>');
        }
        .light-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>');
        }
        .dark-scheme.firefox span.shout-time::after {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>');
        }
        .light-scheme.firefox span.shout-time::after {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>');
        }
    `

  // URL Button Styles
  const urlBtnStyles = `
        #shout-ibb-container {
            display: flex;
            gap: 0 .5rem;
            margin-right: 0;
            padding-right: .5rem;
            right: 0;
            position: absolute;
        }
        #shout-send-container {
            position: relative;
        }
        #urlWindow {
            position: absolute;
            width: 100%;
            left: 0;
            flex-flow: wrap;
            bottom: 7px;
            gap: 0.5rem;
            display: flex;
            transition: visibility 0s linear .2s, opacity .1s linear .1s, translate .2s linear;
            visibility: hidden;
            background: var(--main-bg);
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            opacity: 0;
        }
        .spotlight #urlWindow {
            bottom: 28px;
        }
        #urlWindow.show {
            visibility: visible;
            translate: 0 -30px;
            transition-delay: 0s;
            opacity: 1;
        }
        .url-inputs {
            height: 37px;
            color: var(--text-color) !important;
            background: var(--main-bg);
            padding: 0px .5rem;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            border-left: none;
            border-right: none;
            outline: 0;
        }
        .spotlight .url-inputs {
            height: 60px;
        }
        #urlField {
            flex: 1 1 100%;
        }
        #labelField {
            flex: 4 1 auto;
            border-right: 1px solid var(--border-color);
        }
        #submitURL {
            flex: 1 1 auto;
            background: transparent;
            border: 1px solid var(--border-color);
            border-right: none;
            color: var(--text-color);
            font-weight: 600;
            font-size: 0.9rem;
        }
        #urlBtn i {
            line-height: 37px;
            font-size: 0.9rem;
            font-weight: 600;
            font-family: inherit;
            user-select: none;
        }
        input.shoutbox-text {
            width: auto !important;
        }
        input#shout_text {
            padding-right: 170px;
        }
        .spotlight input#shout_text {
            padding-left: .5rem;
            padding-right: calc(220px - .5rem);
        }
        @media(max-width: 767px) {
            .spotlight input#shout_text {
                padding-right: calc(200px - .5rem);
            }
            .spotlight #shout-ibb-container {
                padding-right: .5rem;
            }
        }
    `

  // Notifier Styles
  const notifierStyles = `
        #sbn-modal-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        #sbn-container { background-color: #2c2c2c; color: #e0e0e0; border: 1px solid #4a4a4a; border-radius: 16px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        #sbn-header { padding: 24px; text-align: center; position: relative; }
        #sbn-header h1 { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 8px 0; }
        #sbn-header p { font-size: 14px; color: #a0a0a0; margin: 0; }
        #sbn-close-btn { position: absolute; top: 05px; right: 10px; border: none; background: none; color: #888; cursor: pointer; font-size: 24px; font-weight: bold; transition: color .2s; padding: 4px; line-height: 1; }
        #sbn-close-btn:hover { color: #fff; }
        #sbn-content { padding: 0 24px 24px 24px; }
        .sbn-form-group { margin-bottom: 24px; }
        .sbn-form-group:last-child { margin-bottom: 0; }
        #sbn-content label { display: block; margin-bottom: 8px; font-weight: 500; color: #CFCFCF; font-size: 13px; }
        .sbn-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        #sbn-reset-keywords { background: none; border: none; color: #FF453A; font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; }
        #sbn-reset-keywords:hover { text-decoration: underline; }
        #sbn-username-display { background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; color: #fff; padding: 12px 16px; font-size: 16px; min-height: 45px; box-sizing: border-box; }
        #sbn-keywords { width: 100%; height: 180px; resize: none; background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; color: #fff; padding: 10px; font-size: 14px; box-sizing: border-box; }
        #sbn-keywords:focus { outline: none; border-color: #888; }
        .sbn-controls-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
        #sbn-color-picker-wrapper { position: relative; width: 100%; height: 44px; border: 1px solid #555; border-radius: 8px; overflow: hidden; }
        #sbn-color { position: absolute; top: -5px; left: -5px; width: calc(100% + 10px); height: calc(100% + 10px); border: none; padding: 0; cursor: pointer; }
        .sbn-volume-control { display: flex; align-items: center; gap: 12px; height: 44px; background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; padding: 0 20px; box-sizing: border-box; }
        #sbn-volume-icon { color: #a0a0a0; width: 24px; height: 24px; flex-shrink: 0; }
        #sbn-volume { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: #4a4a4a; border-radius: 3px; outline: none; }
        #sbn-volume::-webkit-slider-runnable-track { background: #4a4a4a; border-radius: 3px; height: 7px; margin-right: -5px; margin-left: -5px; }
        #sbn-volume::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: #d1d5db; border-radius: 50%; cursor: pointer; margin-top: -6px; }
        #sbn-volume::-moz-range-track { background: #4a4a4a; border-radius: 3px; height: 6px; }
        #sbn-volume::-moz-range-thumb { width: 18px; height: 18px; background: #d1d5db; border-radius: 50%; cursor: pointer; border: none; }
        #sbn-settings-btn { cursor: pointer; margin-left: 10px; display: inline-flex; align-items: center; color: #9e9e9e; transition: color .2s ease; }
        #sbn-settings-btn:hover { color: #fff; }
        #sbn-settings-btn svg { width: 20px; height: 20px; }
    `

  css += easyMentionStyles + urlBtnStyles + notifierStyles

  // ===========================
  // DETECTOR FUNCTION
  // ===========================
  function detectUsername() {
    const allRankElements = document.querySelectorAll(".tbdrank")
    for (const rankElement of allRankElements) {
      if (!rankElement.closest("#shoutbox-container")) {
        if (rankElement && rankElement.firstChild && rankElement.firstChild.nodeType === Node.TEXT_NODE) {
          return rankElement.firstChild.nodeValue.trim()
        }
      }
    }
    return "Not Found"
  }

  // ===========================
  // NOTIFIER SETTINGS
  // ===========================
  const settings = {
    username: window.localStorage.getItem("TBD_shout_username") || detectUsername() || "",
    keywords: window.localStorage.getItem("TBD_shout_keywords")
      ? JSON.parse(window.localStorage.getItem("TBD_shout_keywords"))
      : [],
    soundVolume: window.localStorage.getItem("TBD_shout_soundVolume")
      ? Number.parseFloat(window.localStorage.getItem("TBD_shout_soundVolume"))
      : 0.5,
    highlightColor: window.localStorage.getItem("TBD_shout_highlightColor") || "#2E4636",
  }

  // ===========================
  // NOTIFIER FUNCTIONS
  // ===========================
  function playSound() {
    if (settings.soundVolume < 0.01) return
    try {
      const audio = new Audio(
        "https://raw.githubusercontent.com/5ifty6ix/custom-sounds/refs/heads/main/new-notification-010-352755.mp3",
      )
      audio.volume = settings.soundVolume
      audio.play()
    } catch (e) {
      console.error("Shoutbox Notifier: Could not play custom sound.", e)
    }
  }

  function notifyUser() {
    if (!document.title.startsWith("(1)")) {
      document.title = "(1) " + document.title
    }
    playSound()
  }

  function highlightShout(shoutElement) {
    shoutElement.style.backgroundColor = settings.highlightColor
    shoutElement.style.borderLeft = "3px solid #14a76c"
    shoutElement.style.paddingLeft = "5px"
  }

  function checkShout(shoutElement) {
    if (!shoutElement || !shoutElement.id) return
    const messageBody = shoutElement.querySelector(".shout-text")
    if (!messageBody) return
    const messageText = messageBody.textContent.toLowerCase()
    const activeUsername = settings.username && settings.username !== "Not Found" ? [settings.username] : []
    const allKeywords = [...activeUsername, ...settings.keywords]
      .filter((k) => k && k.trim() !== "")
      .map((k) => k.toLowerCase())
    if (allKeywords.length === 0) return
    let keywordFound = false
    for (const keyword of allKeywords) {
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const keywordRegex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i")
      if (keywordRegex.test(messageText)) {
        highlightShout(shoutElement)
        keywordFound = true
        break
      }
    }
    if (keywordFound) {
      if (!processedMessages.includes(shoutElement.id)) {
        notifyUser()
        processedMessages.push(shoutElement.id)
        if (processedMessages.length > MAX_PROCESSED_MESSAGES) {
          processedMessages.shift()
        }
        window.localStorage.setItem("TBD_processed_messages", JSON.stringify(processedMessages))
      }
    }
  }

  // ===========================
  // EASY MENTION FUNCTION
  // ===========================
  function easyMention() {
    if (window.location.pathname !== "/") return
    const shout = document.querySelector("#shout_text")
    if (navigator.vendor == "") {
      if (!document.body.classList.contains("firefox")) document.body.classList.add("firefox")
    } else {
      if (!document.body.classList.contains("chromium")) document.body.classList.add("chromium")
    }
    let name

    document.addEventListener("click", (e) => {
      if (document.body.classList.contains("chromium")) {
        if (!e.target.matches(".chromium .shout-time:has(+ .shout-user [href^='account'])")) return
      } else if (document.body.classList.contains("firefox")) {
        if (!e.target.matches(".firefox .shout-time")) return
      }
      if ((name = e.target.nextElementSibling.querySelector('[href^="account"] span'))) {
        if (shout.value != "" && shout.value.slice(-1) != " ") shout.value += " "
        shout.value += "@" + name.innerText.trim() + " "
      }
    })
  }

  // ===========================
  // URL BUTTON FUNCTION
  // ===========================
  function urlBtn() {
    if (window.location.pathname !== "/") return
    if (window.location.search.includes("spotlight")) document.body.classList.add("spotlight")

    const shout = document.querySelector("#shout_text")
    const ibbCont = document.querySelector("#shout-ibb-container")
    const shoutCont = document.querySelector("#shout-send-container")

    const urlWindow = document.createElement("div")
    urlWindow.id = "urlWindow"
    shoutCont.appendChild(urlWindow)

    const showUrlWindow = () => {
      urlWindow.classList.add("show")
      shoutCont.querySelectorAll("[id^='spotlight']").forEach((spotlight) => {
        if (spotlight.classList.contains("shiner")) {
          spotlight.classList.remove("shiner")
          spotlight.classList.add("fader")
        }
      })
    }

    const hideUrlWindow = () => urlWindow.classList.remove("show")

    const toggleUrlWindow = () => {
      if (urlWindow.classList.contains("show")) {
        hideUrlWindow()
      } else {
        showUrlWindow()
      }
    }

    const initHeight = window.innerHeight
    window.onresize = () => {
      if (window.innerHeight < initHeight && urlWindow.classList.contains("show")) shoutCont.scrollIntoView(false)
    }

    const urlField = document.createElement("input")
    urlField.id = "urlField"
    urlField.classList.add("url-inputs")
    urlField.placeholder = "URL"
    urlWindow.appendChild(urlField)
    urlField.onmouseover = () => urlField.focus()

    const labelField = document.createElement("input")
    labelField.id = "labelField"
    labelField.classList.add("url-inputs")
    labelField.placeholder = "Label (Optional)"
    urlWindow.appendChild(labelField)

    const submitURL = document.createElement("input")
    submitURL.type = "button"
    submitURL.id = "submitURL"
    submitURL.value = "Submit"
    urlWindow.appendChild(submitURL)

    const urlBtn = document.createElement("span")
    urlBtn.id = "urlBtn"
    urlBtn.innerHTML = `<i class="material-icons">URL</i>`
    urlBtn.classList.add("inline-submit-btn")
    ibbCont.insertBefore(urlBtn, ibbCont.childNodes[4])

    document.addEventListener("click", (e) => {
      if (!e.target.matches("#urlBtn i")) return
      if (shout.value != "") shout.value += " "
      toggleUrlWindow()
      urlField.focus()
    })

    document.addEventListener("click", (e) => {
      if (!e.target.matches(".inline-submit-btn:not(#urlBtn) i")) return
      hideUrlWindow()
    })

    const clearFields = () => {
      urlField.value = ""
      labelField.value = ""
    }

    const urlTagCreate = () => {
      const rawURL = urlField.value.trim()
      const label = labelField.value

      if (rawURL.length > 150) return "URL is too long.\nConsider shortening it using URL shorteners."
      if (!/^https:\/\//i.test(rawURL)) return "Please enter a safe https URL."
      if (!/^https:\/\/.*\./i.test(rawURL)) return "Please make sure the URL is correct."

      if (shout.value != "" && shout.value.slice(-1) != " ") shout.value += " "

      if (label != "") {
        shout.value += `[url=${rawURL}]${label}[/url] `
      } else {
        shout.value += `[url]${rawURL}[/url] `
      }
      hideUrlWindow()
      clearFields()
      shout.focus()
    }

    submitURL.onclick = () => {
      const error = urlTagCreate()
      if (typeof error != "undefined" || error != null) {
        alert(error)
        clearFields()
      }
    }

    document.addEventListener("keypress", (e) => {
      if (e.target.matches(".url-inputs")) {
        if (e.key === "Enter") {
          const error = urlTagCreate()
          if (typeof error != "undefined" || error != null) {
            alert(error)
            clearFields()
          }
        }
      }
    })
  }

  // ===========================
  // SETTINGS UI
  // ===========================
  function createSettingsUI() {
    const uiWrapper = document.createElement("div")
    uiWrapper.id = "sbn-modal-wrapper"
    uiWrapper.style.display = "none"
    uiWrapper.innerHTML = `
            <div id="sbn-container">
                <div id="sbn-header">
                    <h1>Shoutbox Notifier</h1>
                    <p>Get notified when your username or any specific words appear in the Shoutbox</p>
                    <button id="sbn-close-btn" title="Close">×</button>
                </div>
                <div id="sbn-content">
                    <div class="sbn-form-group">
                        <label>Username</label>
                        <div id="sbn-username-display">Detecting...</div>
                    </div>
                    <div class="sbn-form-group">
                        <div class="sbn-label-row">
                            <label for="sbn-keywords">Other Keywords (One per line)</label>
                            <button id="sbn-reset-keywords">Reset</button>
                        </div>
                        <textarea id="sbn-keywords" placeholder="Add other keywords here..."></textarea>
                    </div>
                    <div class="sbn-controls-row">
                        <div class="sbn-form-group">
                            <label>Highlight Colour</label>
                            <div id="sbn-color-picker-wrapper">
                                <input type="color" id="sbn-color">
                            </div>
                        </div>
                        <div class="sbn-form-group">
                            <label for="sbn-volume">Notification Volume</label>
                            <div class="sbn-volume-control">
                                <div id="sbn-volume-icon"></div>
                                <input type="range" id="sbn-volume" min="0" max="100" step="1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    document.body.appendChild(uiWrapper)

    const settingsButton = document.createElement("div")
    settingsButton.id = "sbn-settings-btn"
    settingsButton.title = "Shoutbox Notifier Settings"
    settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" /></svg>`
    settingsButton.addEventListener("click", (e) => {
      e.stopPropagation()
      uiWrapper.style.display = "flex"
      loadSettings()
    })

    const titleElement = document.querySelector("#shoutbox-container .content-title h6.left")
    if (titleElement) {
      titleElement.style.display = "flex"
      titleElement.style.alignItems = "center"
      titleElement.appendChild(settingsButton)
    }

    const usernameDisplay = document.getElementById("sbn-username-display")
    const keywordsInput = document.getElementById("sbn-keywords")
    const resetKeywordsBtn = document.getElementById("sbn-reset-keywords")
    const colorInput = document.getElementById("sbn-color")
    const colorPickerWrapper = document.getElementById("sbn-color-picker-wrapper")
    const volumeSlider = document.getElementById("sbn-volume")
    const volumeIconContainer = document.getElementById("sbn-volume-icon")
    const closeBtn = document.getElementById("sbn-close-btn")

    function loadSettings() {
      const detectedUser = detectUsername()
      settings.username = detectedUser
      window.localStorage.setItem("TBD_shout_username", settings.username)
      usernameDisplay.textContent = settings.username
      settings.keywords = window.localStorage.getItem("TBD_shout_keywords")
        ? JSON.parse(window.localStorage.getItem("TBD_shout_keywords"))
        : []
      settings.highlightColor = window.localStorage.getItem("TBD_shout_highlightColor") || "#2E4636"
      settings.soundVolume = window.localStorage.getItem("TBD_shout_soundVolume")
        ? Number.parseFloat(window.localStorage.getItem("TBD_shout_soundVolume"))
        : 0.5
      keywordsInput.value = settings.keywords.join("\n")
      colorInput.value = settings.highlightColor
      colorPickerWrapper.style.backgroundColor = settings.highlightColor
      volumeSlider.value = settings.soundVolume * 100
      updateVolumeIcon()
    }

    const volumeIcons = {
      mute: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>`,
      on: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>`,
    }

    function updateVolumeIcon() {
      const value = Number.parseFloat(volumeSlider.value)
      if (value == 0) {
        volumeIconContainer.innerHTML = volumeIcons.mute
      } else {
        volumeIconContainer.innerHTML = volumeIcons.on
      }
    }

    closeBtn.addEventListener("click", () => {
      uiWrapper.style.display = "none"
    })
    uiWrapper.addEventListener("click", (event) => {
      if (event.target.id === "sbn-modal-wrapper") {
        uiWrapper.style.display = "none"
      }
    })

    resetKeywordsBtn.addEventListener("click", () => {
      keywordsInput.value = ""
      settings.keywords = []
      window.localStorage.setItem("TBD_shout_keywords", JSON.stringify(settings.keywords))
    })

    keywordsInput.addEventListener("input", () => {
      settings.keywords = keywordsInput.value
        .split("\n")
        .map((k) => k.trim())
        .filter((k) => k)
      window.localStorage.setItem("TBD_shout_keywords", JSON.stringify(settings.keywords))
    })

    colorInput.addEventListener("input", () => {
      settings.highlightColor = colorInput.value
      colorPickerWrapper.style.backgroundColor = colorInput.value
      window.localStorage.setItem("TBD_shout_highlightColor", settings.highlightColor)
    })

    volumeSlider.addEventListener("input", () => {
      settings.soundVolume = Number.parseFloat(volumeSlider.value) / 100
      window.localStorage.setItem("TBD_shout_soundVolume", settings.soundVolume)
      updateVolumeIcon()
    })

    loadSettings()
  }

  // ===========================
  // INITIALIZE ALL FEATURES
  // ===========================
  window.addEventListener("load", () => {
    if (enableEasyMention) easyMention()
    if (enableUrlBtn) urlBtn()

    if (enableNotifier) {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.classList.contains("shout-item")) {
                checkShout(node)
              }
            })
          }
        }
      })

      function startObserver() {
        const shoutbox = document.getElementById("shouts-container")
        if (shoutbox) {
          shoutbox.querySelectorAll(".shout-item").forEach(checkShout)
          observer.observe(shoutbox, {
            childList: true,
          })
        } else {
          setTimeout(startObserver, 500)
        }
      }

      createSettingsUI()
      startObserver()
    }
  })

  // Apply styles
  if (typeof css !== "undefined" || css !== null) {
    const styleNode = document.createElement("style")
    styleNode.appendChild(document.createTextNode(css))
    ;(document.querySelector("head") || document.documentElement).appendChild(styleNode)
  }

  // Extra features
  document.querySelector("#shout_text")?.setAttribute("autocapitalize", "on")
  document
    .querySelector("meta[name='viewport']")
    ?.setAttribute(
      "content",
      "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no",
    )
})()
