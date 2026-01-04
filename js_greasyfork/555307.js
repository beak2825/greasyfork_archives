// ==UserScript==
// @name         BookWalker Volume Downloader
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  Download all pages from a BookWalker volume
// @author       Christopher Fritz
// @match        https://viewer-trial.bookwalker.jp/*/viewer.html*
// @match        https://viewer.bookwalker.jp/*/viewer.html?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555307/BookWalker%20Volume%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555307/BookWalker%20Volume%20Downloader.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  // Delay time in miliseconds.  If you get blank images, increase this number and try again.  The higher the number, the slower the volume will take to fully download.
  const DELAY_STORAGE_KEY = 'bookwalker-delay-time'
  const savedDelay = localStorage.getItem(DELAY_STORAGE_KEY)
  let delayTime = savedDelay ? parseInt(savedDelay) : 2000

  let volumeName = '' // Will be set after DOM loads

  // UI element references
  let pageTransitionStatus,
    pageTransitionValue,
    spreadDoubleStatus,
    spreadDoubleValue,
    downloadButton,
    delayInput,
    pagePositionStatus,
    pagePositionValue,
    volumeNameInput

  // Create UI panel
  function createUI() {
    // Set up MutationObserver to watch for title changes
    const titleElement = document.querySelector('title')
    if (titleElement) {
      const titleObserver = new MutationObserver(() => {
        const newTitle = document.title
        if (newTitle && newTitle !== volumeName) {
          volumeName = newTitle
          if (volumeNameInput) {
            volumeNameInput.value = volumeName
          }
          console.log('Volume name updated to:', volumeName)
          // Stop observing once we have a title
          if (volumeName !== '') {
            titleObserver.disconnect()
          }
        }
      })

      titleObserver.observe(titleElement, {
        childList: true,
        characterData: true,
        subtree: true,
      })

      // Also try to set it immediately in case it's already available
      if (document.title) {
        volumeName = document.title
        console.log('Volume name set immediately to:', volumeName)
      }
    }

    const uiPanel = document.createElement('div')
    uiPanel.id = 'bookwalker-settings-panel'
    uiPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 280px;
    `

    uiPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">📊 Viewer Settings</div>
      <div id="page-transition-status" style="margin: 4px 0; display: flex; align-items: center; gap: 8px;">
        <span style="min-width: 20px;">⏳</span>
        <span>Page Transition: <span id="page-transition-value">checking...</span></span>
      </div>
      <div id="spread-double-status" style="margin: 4px 0; display: flex; align-items: center; gap: 8px;">
        <span style="min-width: 20px;">⏳</span>
        <span>Spread Double: <span id="spread-double-value">checking...</span></span>
      </div>
      <div id="page-position-status" style="margin: 4px 0; display: flex; align-items: center; gap: 8px;">
        <span style="min-width: 20px;">⏳</span>
        <span>Current Page: <span id="page-position-value">checking...</span></span>
      </div>
      <div style="margin-top: 12px; margin-bottom: 8px;">
        <label for="volume-name-input" style="display: block; margin-bottom: 4px; font-size: 12px;">
          Volume Name:
        </label>
        <input 
          id="volume-name-input" 
          type="text" 
          value="${document.title || ''}"
          placeholder="Waiting for title..."
          style="
            box-sizing: border-box;
            width: 100%;
            padding: 6px 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            font-size: 13px;
          "
        />
      </div>
      <div style="margin-top: 12px; margin-bottom: 8px;">
        <label for="delay-input" style="display: block; margin-bottom: 4px; font-size: 12px;">
          Delay Time (seconds):
        </label>
        <input 
          id="delay-input" 
          type="number" 
          min="2" 
          max="20" 
          value="${savedDelay ? savedDelay / 1000 : 2}" 
          step="1"
          style="
            box-sizing: border-box;
            width: 100%;
            padding: 6px 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            font-size: 13px;
          "
        />
      </div>
      <button id="download-button" style="
        margin-top: 4px;
        width: 100%;
        padding: 8px 12px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        font-size: 13px;
      " disabled>Download Volume</button>
    `

    document.body.appendChild(uiPanel)

    // Get UI elements
    pageTransitionStatus = document.getElementById('page-transition-status')
    pageTransitionValue = document.getElementById('page-transition-value')
    spreadDoubleStatus = document.getElementById('spread-double-status')
    spreadDoubleValue = document.getElementById('spread-double-value')
    pagePositionStatus = document.getElementById('page-position-status')
    pagePositionValue = document.getElementById('page-position-value')
    downloadButton = document.getElementById('download-button')
    delayInput = document.getElementById('delay-input')
    volumeNameInput = document.getElementById('volume-name-input')

    // Add button click handler
    downloadButton.addEventListener('click', startDownload)

    // Add delay input change handler
    delayInput.addEventListener('input', () => {
      const value = parseFloat(delayInput.value)
      if (value >= 2 && value <= 20) {
        delayTime = value * 1000
        localStorage.setItem(DELAY_STORAGE_KEY, delayTime)
        delayInput.style.borderColor = 'rgba(255, 255, 255, 0.3)'
      } else {
        delayInput.style.borderColor = '#f87171'
      }
      checkViewerSettings() // Re-check to enable/disable button
    })

    // Check settings after UI is created
    checkViewerSettings()

    // Set up MutationObserver to watch for page number changes
    const pageSliderElement = document.querySelector('#pageSliderCounter')
    if (pageSliderElement) {
      const observer = new MutationObserver(() => {
        updatePagePosition()
      })

      observer.observe(pageSliderElement, {
        childList: true,
        characterData: true,
        subtree: true,
      })

      // Initial update
      updatePagePosition()
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI)
  } else {
    createUI()
  }

  // Monitor localStorage for settings changes and update UI
  function checkViewerSettings() {
    const settingsData = localStorage.getItem('/NFBR_Settings/NFBR.SettingData')

    // Only update UI if elements exist
    if (!pageTransitionStatus) return

    let pageTransitionCorrect = false
    let spreadDoubleCorrect = false

    if (!settingsData) {
      pageTransitionStatus.querySelector('span:first-child').textContent = '⚠️'
      pageTransitionValue.textContent = 'not found'
      spreadDoubleStatus.querySelector('span:first-child').textContent = '⚠️'
      spreadDoubleValue.textContent = 'not found'
    } else {
      try {
        const settings = JSON.parse(settingsData)
        const pageTransition = settings.viewerPageTransitionAxis
        const spreadDouble = settings.viewerSpreadDouble

        // Update viewerPageTransitionAxis display
        if (pageTransition === 'vertical') {
          pageTransitionStatus.querySelector('span:first-child').textContent = '✅'
          pageTransitionValue.textContent = 'vertical'
          pageTransitionValue.style.color = '#4ade80'
          pageTransitionCorrect = true
        } else {
          pageTransitionStatus.querySelector('span:first-child').textContent = '❌'
          pageTransitionValue.textContent = pageTransition || 'unknown'
          pageTransitionValue.style.color = '#f87171'
        }

        // Update viewerSpreadDouble display
        if (spreadDouble === 'false' || spreadDouble === false) {
          spreadDoubleStatus.querySelector('span:first-child').textContent = '✅'
          spreadDoubleValue.textContent = 'false'
          spreadDoubleValue.style.color = '#4ade80'
          spreadDoubleCorrect = true
        } else {
          spreadDoubleStatus.querySelector('span:first-child').textContent = '❌'
          spreadDoubleValue.textContent = String(spreadDouble)
          spreadDoubleValue.style.color = '#f87171'
        }
      } catch (error) {
        console.error('❌ Error parsing NFBR.SettingData:', error)
        pageTransitionStatus.querySelector('span:first-child').textContent = '⚠️'
        pageTransitionValue.textContent = 'error'
        spreadDoubleStatus.querySelector('span:first-child').textContent = '⚠️'
        spreadDoubleValue.textContent = 'error'
      }
    }

    updatePagePosition()

    // Update button state separately to avoid circular calls
    updateButtonState()
  }

  // Update page position indicator
  function updatePagePosition() {
    if (!pagePositionStatus) return

    const pageSliderElement = document.querySelector('#pageSliderCounter')
    if (!pageSliderElement) {
      pagePositionStatus.querySelector('span:first-child').textContent = '⚠️'
      pagePositionValue.textContent = 'not found'
      return
    }

    const pageSliderText = pageSliderElement.textContent
    const currentPage = parseInt(pageSliderText.split('/')[0])

    if (currentPage === 1) {
      pagePositionStatus.querySelector('span:first-child').textContent = '✅'
      pagePositionValue.textContent = pageSliderText
      pagePositionValue.style.color = '#4ade80'
    } else {
      pagePositionStatus.querySelector('span:first-child').textContent = '⚠️'
      pagePositionValue.textContent = `${pageSliderText} (scroll to page 1)`
      pagePositionValue.style.color = '#fbbf24'
    }

    // Update button state when page changes
    updateButtonState()
  }

  // Update download button enabled/disabled state
  function updateButtonState() {
    if (!downloadButton) return

    const settingsData = localStorage.getItem('/NFBR_Settings/NFBR.SettingData')
    let pageTransitionCorrect = false
    let spreadDoubleCorrect = false

    if (settingsData) {
      try {
        const settings = JSON.parse(settingsData)
        pageTransitionCorrect = settings.viewerPageTransitionAxis === 'vertical'
        spreadDoubleCorrect =
          settings.viewerSpreadDouble === 'false' || settings.viewerSpreadDouble === false
      } catch (error) {
        // Ignore parsing errors for button state
      }
    }

    const delayValue = parseFloat(delayInput?.value || 2)
    const delayValid = delayValue >= 2 && delayValue <= 20
    const pageSliderElement = document.querySelector('#pageSliderCounter')
    const currentPage = pageSliderElement
      ? parseInt(pageSliderElement.textContent.split('/')[0])
      : 1
    const onPageOne = currentPage === 1
    const allCorrect = pageTransitionCorrect && spreadDoubleCorrect && delayValid && onPageOne

    downloadButton.disabled = !allCorrect
    downloadButton.style.opacity = allCorrect ? '1' : '0.5'
    downloadButton.style.cursor = allCorrect ? 'pointer' : 'not-allowed'
  }

  // Intercept localStorage.setItem to detect changes in real-time
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function (key, value) {
    // Call the original setItem
    originalSetItem.apply(this, arguments)

    // If the NFBR settings were changed, check them
    if (key === '/NFBR_Settings/NFBR.SettingData') {
      checkViewerSettings()
    }
  }

  // Also listen for storage events (fires when localStorage changes in other tabs/windows)
  window.addEventListener('storage', (e) => {
    if (e.key === '/NFBR_Settings/NFBR.SettingData') {
      checkViewerSettings()
    }
  })

  // Function for delaying code for a set amount of time.
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  // Track which images have already been downloaded.  This prevents downloading the same image multiple times.
  const downloadedPages = []

  // Download a single image from a canvas.
  function DownloadPage(canvas) {
    if (downloadedPages.includes(canvas.parentElement.id)) {
      return
    }
    // Get the current volume name from the input field
    const currentVolumeName = volumeNameInput?.value || volumeName
    const fileName = `${currentVolumeName} ${canvas.parentElement.id.replace('wideScreen', ' Page ')}.jpg`
    const image = canvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = image
    downloadLink.download = fileName
    downloadLink.click()
    // Remember that this image has been downloaded.
    downloadedPages.push(canvas.parentElement.id)
  }

  // Main download function - loops through canvases and downloads all images
  async function startDownload() {
    // Determine how many pages are expected.
    const pageCount = document.querySelector('#pageSliderCounter').textContent.split('/')[1]

    // Disable button during download
    if (downloadButton) {
      downloadButton.disabled = true
      downloadButton.textContent = 'Downloading...'
    }

    // Loops through canvases until all expected images have downloaded.
    while (downloadedPages.length < pageCount) {
      // Grab all available canvases.
      const canvases = document.querySelectorAll('canvas.default')

      // Track how many images are downloaded this iteration.
      let downloadedImageCount = 0
      for (let canvas of canvases) {
        canvas.scrollIntoView()

        if (downloadedPages.includes(canvas.parentElement.id)) {
          continue
        }

        // Wait for image to load.
        await delay(delayTime)

        DownloadPage(canvas)
        downloadedImageCount += 1

        // Update button text with progress
        if (downloadButton) {
          downloadButton.textContent = `Downloading... ${downloadedPages.length}/${pageCount}`
        }
      }

      // If no images were downloaded, then likely all images are downloaded, and the loop can be exited.  This situation shouldn't occur, but is here just in case.
      if (0 == downloadedImageCount) {
        console.log('Downloading complete!')
        break
      }
    }

    // Re-enable button after download
    if (downloadButton) {
      downloadButton.textContent = 'Download Complete!'
      setTimeout(() => {
        downloadButton.textContent = 'Download Volume'
        checkViewerSettings() // Re-check to enable if settings are still correct
      }, 3000)
    }
  }
})()