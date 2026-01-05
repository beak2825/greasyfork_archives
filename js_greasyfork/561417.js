// ==UserScript==
// @name         Learn Natively Manga Kotoba Sync
// @namespace    http://tampermonkey.net/
// @version      2025-01-04
// @description  Captures manga reading status changes on Learn Natively and queues them for syncing to Manga Kotoba.
// @author       Christopher Fritz
// @license      MIT
// @match        https://learnnatively.com/series/*
// @match        https://learnnatively.com/book/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561417/Learn%20Natively%20Manga%20Kotoba%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/561417/Learn%20Natively%20Manga%20Kotoba%20Sync.meta.js
// ==/UserScript==

/*
This userscript monitors reading status changes on Learn Natively for manga titles
and stores them in localStorage for later syncing to Manga Kotoba.

Key features:
- Only tracks manga (not light novels or other content)
- Parses volume numbers from titles (more reliable than LN's displayed "Book #")
- Deduplicates pending updates (keeps only the latest status per volume)
- Persists updates across page reloads using localStorage
- Provides a UI to view pending updates and trigger sync
- Syncs to Manga Kotoba API using token authentication
- Maps Learn Natively status format to Manga Kotoba API format

Configuration:
- Use Tampermonkey menu to set your API token and stopped mapping
- Tokens can be generated at: https://manga-kotoba.com/dashboard/tokens
- Stopped mapping: paused (default) or dropped
*/

;(function () {
  'use strict'

  // Constants
  const STORAGE_KEY = 'manga-kotoba-ln-pending-updates'
  const CONFIG_KEY_TOKEN = 'mk-api-token'
  const CONFIG_KEY_STOPPED_MAPPING = 'mk-stopped-mapping'
  const CONFIG_KEY_SKIP_SYNC_CONFIRM = 'mk-skip-sync-confirm'
  const CONFIG_KEY_SKIP_CLEAR_CONFIRM = 'mk-skip-clear-confirm'
  const DEFAULT_API_URL = 'https://manga-kotoba.com'
  const DEFAULT_STOPPED_MAPPING = 'paused'
  const DEBUG = true // Set to false in production
  const LN_API_ENDPOINT = '/update-user-book-quick-api/'

  // ========================================
  // Configuration Management
  // ========================================

  /**
   * Generic storage getter with GM/localStorage fallback
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  function getStorageValue(key, defaultValue = null) {
    if (typeof GM_getValue !== 'undefined') {
      return GM_getValue(key, defaultValue)
    }
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue

    // Handle boolean values
    if (defaultValue === true || defaultValue === false) {
      return stored === 'true'
    }
    return stored || defaultValue
  }

  /**
   * Generic storage setter with GM/localStorage fallback
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  function setStorageValue(key, value) {
    if (typeof GM_setValue !== 'undefined') {
      GM_setValue(key, value)
    } else {
      localStorage.setItem(key, value.toString())
    }
  }

  // Configuration accessors using generic storage functions
  const getApiToken = () => getStorageValue(CONFIG_KEY_TOKEN)
  const setApiToken = (token) => setStorageValue(CONFIG_KEY_TOKEN, token)
  const getStoppedMapping = () =>
    getStorageValue(CONFIG_KEY_STOPPED_MAPPING, DEFAULT_STOPPED_MAPPING)
  const setStoppedMapping = (mapping) => setStorageValue(CONFIG_KEY_STOPPED_MAPPING, mapping)
  const getSkipSyncConfirm = () => getStorageValue(CONFIG_KEY_SKIP_SYNC_CONFIRM, false)
  const setSkipSyncConfirm = (skip) => setStorageValue(CONFIG_KEY_SKIP_SYNC_CONFIRM, skip)
  const getSkipClearConfirm = () => getStorageValue(CONFIG_KEY_SKIP_CLEAR_CONFIRM, false)
  const setSkipClearConfirm = (skip) => setStorageValue(CONFIG_KEY_SKIP_CLEAR_CONFIRM, skip)

  /**
   * Get API URL from Tampermonkey storage
   * @returns {string}
   */
  function getApiUrl() {
    return DEFAULT_API_URL
  }

  /**
   * Show the settings panel
   */
  function showSettingsPanel() {
    const existingSettings = document.getElementById('mk-ln-settings-panel')
    if (existingSettings) {
      existingSettings.classList.add('visible')
      return
    }

    createSettingsPanel()
  }

  /**
   * Create and show the settings panel
   */
  function createSettingsPanel() {
    const settingsPanel = document.createElement('div')
    settingsPanel.id = 'mk-ln-settings-panel'
    settingsPanel.innerHTML = `
      <style>
        #mk-ln-settings-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10002;
          display: none;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #mk-ln-settings-panel.visible {
          display: flex;
        }
        #mk-ln-settings-panel .settings-modal {
          background: white;
          border-radius: 12px;
          width: 500px;
          max-width: 90vw;
          max-height: 80vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        #mk-ln-settings-panel .settings-header {
          background: var(--header-bg);
          color: white;
          padding: 20px;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #mk-ln-settings-panel .settings-header .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          opacity: 0.8;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #mk-ln-settings-panel .settings-header .close-btn:hover {
          opacity: 1;
        }
        #mk-ln-settings-panel .settings-content {
          padding: 24px;
        }
        #mk-ln-settings-panel .form-group {
          margin-bottom: 24px;
        }
        #mk-ln-settings-panel .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }
        #mk-ln-settings-panel .form-group .help-text {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        #mk-ln-settings-panel .form-group input[type="text"],
        #mk-ln-settings-panel .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        #mk-ln-settings-panel .form-group input[type="text"]:focus,
        #mk-ln-settings-panel .form-group select:focus {
          outline: none;
          border-color: var(--header-bg);
        }
        #mk-ln-settings-panel .form-group .token-link {
          display: inline-block;
          color: var(--header-bg);
          text-decoration: none;
          font-size: 13px;
          margin-top: 4px;
        }
        #mk-ln-settings-panel .form-group .token-link:hover {
          text-decoration: underline;
        }
        #mk-ln-settings-panel .settings-actions {
          padding: 20px 24px;
          border-top: 1px solid #e1e5e9;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        #mk-ln-settings-panel .settings-actions button {
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }
        #mk-ln-settings-panel .save-btn {
          background: var(--header-bg);
          color: white;
        }
        #mk-ln-settings-panel .save-btn:hover {
          background: #5a67d8;
        }
        #mk-ln-settings-panel .cancel-btn {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #e1e5e9;
        }
        #mk-ln-settings-panel .cancel-btn:hover {
          background: #e9ecef;
        }
      </style>
      <div class="settings-modal">
        <div class="settings-header">
          <span>Manga Kotoba Sync Settings</span>
          <button class="close-btn" id="mk-ln-close-settings">&times;</button>
        </div>
        <div class="settings-content">
          <div class="form-group">
            <label for="mk-token-input">API Token</label>
            <div class="help-text">
              Enter your Manga Kotoba API token. Make sure it has "Write" permission enabled.
            </div>
            <input type="text" id="mk-token-input" placeholder="Enter your API token..." />
            <a href="https://manga-kotoba.com/dashboard/tokens" target="_blank" class="token-link">
              Generate token at manga-kotoba.com →
            </a>
          </div>
          
          <div class="form-group">
            <label for="mk-stopped-mapping-select">Stopped Status Mapping</label>
            <div class="help-text">
              Choose how Learn Natively's "Stopped" status should be mapped in Manga Kotoba.
            </div>
            <select id="mk-stopped-mapping-select">
              <option value="paused">Paused</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div class="form-group">
            <label>Confirmation Preferences</label>
            <div class="help-text">
              Reset saved "Don't ask again" preferences for confirmation dialogs.
            </div>
            <button type="button" id="mk-reset-confirmations" style="
              padding: 8px 12px;
              border: 1px solid #ccc;
              border-radius: 6px;
              background: #f8f9fa;
              color: #666;
              cursor: pointer;
              font-size: 13px;
            ">Reset Confirmation Preferences</button>
          </div>
        </div>
        <div class="settings-actions">
          <button class="cancel-btn" id="mk-ln-cancel-settings">Cancel</button>
          <button class="save-btn" id="mk-ln-save-settings">Save Settings</button>
        </div>
      </div>
    `

    document.body.appendChild(settingsPanel)

    // Cache DOM elements and populate current values
    const elements = {
      tokenInput: document.getElementById('mk-token-input'),
      stoppedSelect: document.getElementById('mk-stopped-mapping-select'),
      closeBtn: document.getElementById('mk-ln-close-settings'),
      cancelBtn: document.getElementById('mk-ln-cancel-settings'),
      saveBtn: document.getElementById('mk-ln-save-settings'),
      resetBtn: document.getElementById('mk-reset-confirmations'),
    }

    elements.tokenInput.value = getApiToken() || ''
    elements.stoppedSelect.value = getStoppedMapping()

    // Add event listeners
    elements.closeBtn.addEventListener('click', closeSettingsPanel)
    elements.cancelBtn.addEventListener('click', closeSettingsPanel)
    elements.saveBtn.addEventListener('click', saveSettings)
    elements.resetBtn.addEventListener('click', () => {
      setSkipSyncConfirm(false)
      setSkipClearConfirm(false)
      alert(
        'Confirmation preferences have been reset. You will be asked for confirmation on sync and clear actions again.'
      )
    })

    // Close on background click
    settingsPanel.addEventListener('click', (e) => {
      if (e.target === settingsPanel) {
        closeSettingsPanel()
      }
    })

    // Show the panel
    settingsPanel.classList.add('visible')
  }

  /**
   * Close the settings panel
   */
  function closeSettingsPanel() {
    const panel = document.getElementById('mk-ln-settings-panel')
    if (panel) {
      panel.classList.remove('visible')
      setTimeout(() => panel.remove(), 300) // Remove after animation
    }
  }

  /**
   * Save settings from the form
   */
  function saveSettings() {
    // Cache DOM queries
    const tokenInput = document.getElementById('mk-token-input')
    const stoppedSelect = document.getElementById('mk-stopped-mapping-select')

    const token = tokenInput.value.trim()
    const stoppedMapping = stoppedSelect.value

    // Save the values
    if (token) {
      setApiToken(token)
    }
    setStoppedMapping(stoppedMapping)

    // Update UI
    updateTokenStatus()
    updatePanelContent()

    // Close the settings panel
    closeSettingsPanel()

    log('Configuration updated')
  }

  // Register Tampermonkey menu command for configuration
  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('⚙️ Configure Manga Kotoba Settings', showSettingsPanel)
  }

  // ========================================
  // Network Request Monitoring
  // ========================================

  /**
   * Check if URL is a Learn Natively status update endpoint
   * @param {string} url - URL to check
   * @param {boolean} hasBody - Whether request has a body
   * @returns {boolean}
   */
  function isStatusUpdateUrl(url, hasBody = false) {
    return typeof url === 'string' && url === LN_API_ENDPOINT && hasBody
  }

  /**
   * Process request body and handle API call
   * @param {*} body - Request body
   * @param {string} url - Request URL
   */
  function processRequestBody(body, url) {
    if (!body) return

    try {
      const bodyData = typeof body === 'string' ? JSON.parse(body) : body
      log('Request payload:', bodyData)
      handleLearnNativelyApiCall(bodyData, url)
    } catch (e) {
      log('Could not parse request body as JSON:', body)
      handleLearnNativelyApiCall({ rawBody: body }, url)
    }
  }

  /**
   * Set up network request interception to monitor Learn Natively API calls
   */
  function setupNetworkMonitoring() {
    log('Setting up network request monitoring...')
    log('Target API endpoint:', LN_API_ENDPOINT)

    // Store original methods
    const originalFetch = window.fetch
    const originalXHROpen = XMLHttpRequest.prototype.open
    const originalXHRSend = XMLHttpRequest.prototype.send

    // Intercept fetch requests
    window.fetch = function (url, options = {}) {
      // Log API-like fetch requests for debugging
      if (isStatusUpdateUrl(url, !!options.body)) {
        log('*** INTERCEPTED FETCH REQUEST - POTENTIAL STATUS UPDATE ***', { url, options })
        processRequestBody(options.body, url)
      }

      // Call original fetch
      return originalFetch.apply(this, arguments)
    }

    // Intercept XMLHttpRequest
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      this._url = url
      this._method = method

      return originalXHROpen.apply(this, arguments)
    }

    XMLHttpRequest.prototype.send = function (body) {
      log(isStatusUpdateUrl(this._url, !!body))
      if (isStatusUpdateUrl(this._url, !!body)) {
        log('*** INTERCEPTED XHR REQUEST - POTENTIAL STATUS UPDATE ***', {
          method: this._method,
          url: this._url,
          body: body,
        })
        processRequestBody(body, this._url)
      }

      return originalXHRSend.apply(this, arguments)
    }

    log('Network monitoring setup complete')
  }

  /**
   * Handle intercepted Learn Natively API calls
   * @param {Object} payload - The JSON payload sent to the API
   * @param {string} url - The full URL of the request
   */
  function handleLearnNativelyApiCall(payload, url) {
    log('*** LEARN NATIVELY API CALL DETECTED ***', { url, payload })

    // Handle raw form data if it's not JSON
    if (payload.rawBody) {
      log('Processing raw body data:', payload.rawBody)
      // Try to parse form data or query string
      if (typeof payload.rawBody === 'string') {
        try {
          // Try to parse as URLSearchParams (form data)
          const formData = new URLSearchParams(payload.rawBody)
          const parsedPayload = Object.fromEntries(formData.entries())
          log('Parsed form data:', parsedPayload)
          payload = parsedPayload
        } catch (e) {
          log('Could not parse as form data, using raw body')
        }
      }
    }

    // Check current page info for debugging
    const pageType = getPageType()
    const currentUrl = window.location.href
    log('Current page info:', {
      pageType,
      currentUrl,
      isManga: isMangaPage(),
      seriesId: getSeriesId(),
      seriesTitle: getSeriesTitle(),
    })

    // Check if this is a manga page - but process anyway for debugging
    const ismanga = isMangaPage()
    if (!ismanga) {
      log('Not on a manga page, but processing for debugging purposes')
    }

    // Extract information from the page
    const seriesId = getSeriesId()
    const seriesTitle = getSeriesTitle()

    log('Page extraction results:', { seriesId, seriesTitle, ismanga })

    // Try to process the payload even if page detection fails (for debugging)
    log('Attempting to process API payload...')
    const success = parseApiPayloadAndQueueUpdate(
      payload,
      seriesId || 'unknown',
      seriesTitle || 'Unknown Series'
    )
    if (success) {
      log('Successfully parsed and queued update from API payload')
    } else {
      log('Failed to parse API payload into update format')
    }
  }

  /**
   * Parse Learn Natively API payload and queue update
   * @param {Object} payload - The API payload
   * @param {string} lnSeriesId - The Learn Natively series ID
   * @param {string} seriesTitle - The series title
   * @returns {boolean} True if update was successfully queued
   */
  function parseApiPayloadAndQueueUpdate(payload, lnSeriesId, seriesTitle) {
    try {
      log('Parsing API payload:', payload)

      const status = payload.status
      const bookTitle = payload.title || payload.book_title || payload.bookTitle
      const itemId = payload.item

      log('Extracted fields:', { status, bookTitle, itemId, lnSeriesId, seriesTitle })

      if (!status) {
        log('Missing required status field in API payload:', { status })
        log('Available payload fields:', Object.keys(payload))
        return false
      }

      // Try to get volume title from multiple sources
      let volumeTitle = bookTitle

      // If we have an item ID, try to find the volume title on the page
      if (itemId && !volumeTitle) {
        volumeTitle = getVolumeNameFromItemId(itemId)
        if (volumeTitle) {
          log(`Found volume title from item ID "${itemId}": "${volumeTitle}"`)
        }
      }

      // If we still don't have a book title, try to get it from the page
      if (!volumeTitle) {
        const pageType = getPageType()
        if (pageType === 'book') {
          // Get book title from the page
          const titleEl = document.querySelector('div.topline-meta-data h1.obj-title')
          volumeTitle = titleEl?.textContent?.trim() || 'Unknown Volume'
        } else {
          volumeTitle = 'Unknown Volume'
        }
      }

      // Parse volume number from title if available
      const volumeNumber = volumeTitle ? parseVolumeNumber(volumeTitle) : null

      // Prepare update info - no book ID needed
      const updateInfo = {
        lnSeriesId,
        seriesTitle,
        volumeTitle,
        volumeNumber,
      }

      log('Prepared update info:', updateInfo)

      // Queue the update with the status from the API
      const success = mapStatusAndQueueUpdate(status, updateInfo)

      return !!success
    } catch (e) {
      log('Error parsing API payload:', e)
      return false
    }
  }

  // ========================================
  // Utility Functions
  // ========================================

  /**
   * Get volume name from item ID by querying the DOM
   * @param {string} itemId - The item ID from the API payload (e.g., "e0013c3f-5bd8-4f65-aea2-0a50db6bbd4b")
   * @returns {string|null} The volume title or null if not found
   */
  function getVolumeNameFromItemId(itemId) {
    if (!itemId) return null

    try {
      // Remove dashes and take first 10 characters
      const bookId = itemId.replace(/-/g, '').substring(0, 10)

      log(`Searching for volume with book ID: "${bookId}" (from item ID: "${itemId}")`)

      // Look for an anchor element with class "title" and matching href
      const selector = `a.title[href="/book/${bookId}/"]`
      const titleElement = document.querySelector(selector)

      if (titleElement) {
        const volumeTitle = titleElement.getAttribute('title') || titleElement.textContent?.trim()
        log(`Found volume title element:`, { selector, volumeTitle })
        return volumeTitle || null
      } else {
        log(`No element found with selector: "${selector}"`)

        // Debug: log all title links on the page for troubleshooting
        const allTitleLinks = document.querySelectorAll('a.title')
        log(`Found ${allTitleLinks.length} title links on page:`)
        allTitleLinks.forEach((link, index) => {
          log(
            `  ${index + 1}. href="${link.getAttribute('href')}" title="${link.getAttribute('title') || link.textContent?.trim()}"`
          )
        })

        return null
      }
    } catch (e) {
      log('Error extracting volume name from item ID:', e)
      return null
    }
  }

  /**
   * Debug logging helper
   */
  function log(...args) {
    if (DEBUG) {
      console.log('[MK-LN Sync]', ...args)
    }
  }

  /**
   * Show an enhanced confirmation dialog with "Don't ask again" option
   * @param {string} message - The confirmation message
   * @param {string} skipKey - The storage key for the skip preference ('sync' or 'clear')
   * @returns {Promise<boolean>} True if user confirmed, false if cancelled
   */
  function showEnhancedConfirm(message, skipKey) {
    return new Promise((resolve) => {
      // Check if user has previously chosen to skip this confirmation
      const skipConfirm = skipKey === 'sync' ? getSkipSyncConfirm() : getSkipClearConfirm()
      if (skipConfirm) {
        resolve(true)
        return
      }

      // Create modal dialog
      const modal = document.createElement('div')
      modal.id = 'mk-ln-confirm-modal'
      modal.innerHTML = `
        <style>
          #mk-ln-confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          #mk-ln-confirm-modal .confirm-dialog {
            background: white;
            border-radius: 12px;
            width: 400px;
            max-width: 90vw;
            overflow: hidden;
            animation: slideIn 0.2s ease-out;
          }
          #mk-ln-confirm-modal .confirm-header {
            background: var(--header-bg, #667eea);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 16px;
          }
          #mk-ln-confirm-modal .confirm-content {
            padding: 20px;
            line-height: 1.5;
            color: #333;
          }
          #mk-ln-confirm-modal .confirm-options {
            padding: 0 20px;
          }
          #mk-ln-confirm-modal .confirm-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666;
            margin-bottom: 16px;
          }
          #mk-ln-confirm-modal .confirm-checkbox input {
            margin: 0;
            transform: scale(1.1);
          }
          #mk-ln-confirm-modal .confirm-actions {
            padding: 16px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }
          #mk-ln-confirm-modal .confirm-actions button {
            padding: 10px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: background-color 0.2s;
          }
          #mk-ln-confirm-modal .confirm-btn {
            background: var(--header-bg, #667eea);
            color: white;
          }
          #mk-ln-confirm-modal .confirm-btn:hover {
            background: #5a67d8;
          }
          #mk-ln-confirm-modal .cancel-btn {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #e1e5e9;
          }
          #mk-ln-confirm-modal .cancel-btn:hover {
            background: #e9ecef;
          }
        </style>
        <div class="confirm-dialog">
          <div class="confirm-header">Confirm Action</div>
          <div class="confirm-content">${escapeHtml(message)}</div>
          <div class="confirm-options">
            <label class="confirm-checkbox">
              <input type="checkbox" id="mk-ln-dont-ask-again">
              <span>Don't ask again for this action</span>
            </label>
          </div>
          <div class="confirm-actions">
            <button class="cancel-btn" id="mk-ln-confirm-cancel">Cancel</button>
            <button class="confirm-btn" id="mk-ln-confirm-ok">OK</button>
          </div>
        </div>
      `

      document.body.appendChild(modal)

      // Add event listeners
      const handleConfirm = () => {
        const dontAskAgain = document.getElementById('mk-ln-dont-ask-again').checked
        if (dontAskAgain) {
          if (skipKey === 'sync') {
            setSkipSyncConfirm(true)
          } else if (skipKey === 'clear') {
            setSkipClearConfirm(true)
          }
        }
        modal.remove()
        resolve(true)
      }

      const handleCancel = () => {
        modal.remove()
        resolve(false)
      }

      document.getElementById('mk-ln-confirm-ok').addEventListener('click', handleConfirm)
      document.getElementById('mk-ln-confirm-cancel').addEventListener('click', handleCancel)

      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          handleCancel()
        }
      })

      // Handle Escape key
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleCancel()
          document.removeEventListener('keydown', handleKeyDown)
        }
      }
      document.addEventListener('keydown', handleKeyDown)
    })
  }

  /**
   * Show sync results in a user-friendly HTML modal
   * @param {Object} result - The sync result object
   * @param {Object} result.synced - Sync success stats
   * @param {Array} result.errors - Array of error objects
   * @param {Array} result.unmatchedSeries - Array of unmatched series IDs
   */
  function showSyncResultModal(result) {
    const { synced, errors, unmatchedSeries } = result

    // Create modal dialog
    const modal = document.createElement('div')
    modal.id = 'mk-ln-result-modal'
    modal.innerHTML = `
      <style>
        #mk-ln-result-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10003;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #mk-ln-result-modal .result-dialog {
          background: white;
          border-radius: 12px;
          width: 600px;
          max-width: 90vw;
          max-height: 80vh;
          overflow: hidden;
          animation: slideIn 0.2s ease-out;
        }
        #mk-ln-result-modal .result-header {
          background: #28a745;
          color: white;
          padding: 16px 20px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #mk-ln-result-modal .result-header.has-issues {
          background: #ffc107;
          color: #333;
        }
        #mk-ln-result-modal .result-header .close-btn {
          background: none;
          border: none;
          color: inherit;
          font-size: 24px;
          cursor: pointer;
          opacity: 0.8;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #mk-ln-result-modal .result-header .close-btn:hover {
          opacity: 1;
        }
        #mk-ln-result-modal .result-content {
          padding: 20px;
          max-height: 50vh;
          overflow-y: auto;
        }
        #mk-ln-result-modal .success-summary {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        #mk-ln-result-modal .issue-section {
          margin-bottom: 20px;
        }
        #mk-ln-result-modal .issue-section:last-child {
          margin-bottom: 0;
        }
        #mk-ln-result-modal .issue-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #mk-ln-result-modal .issue-title .icon {
          font-size: 16px;
        }
        #mk-ln-result-modal .error-list {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          max-height: 200px;
          overflow-y: auto;
        }
        #mk-ln-result-modal .error-item {
          padding: 12px 16px;
          border-bottom: 1px solid #e9ecef;
          font-size: 13px;
        }
        #mk-ln-result-modal .error-item:last-child {
          border-bottom: none;
        }
        #mk-ln-result-modal .error-message {
          color: #dc3545;
          font-weight: 500;
          margin-bottom: 4px;
        }
        #mk-ln-result-modal .error-details {
          color: #666;
          font-size: 12px;
          font-family: 'SFMono-Regular', Consolas, monospace;
          background: #f1f3f4;
          padding: 8px;
          border-radius: 4px;
          margin-top: 6px;
          white-space: pre-wrap;
          word-break: break-all;
        }
        #mk-ln-result-modal .unmatched-list {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          color: #856404;
        }
        #mk-ln-result-modal .unmatched-list ul {
          margin: 8px 0 0 0;
          padding-left: 20px;
        }
        #mk-ln-result-modal .unmatched-list li {
          margin-bottom: 4px;
        }
        #mk-ln-result-modal .result-actions {
          padding: 16px 20px;
          border-top: 1px solid #e1e5e9;
          display: flex;
          justify-content: flex-end;
        }
        #mk-ln-result-modal .result-actions button {
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: var(--header-bg, #667eea);
          color: white;
          transition: background-color 0.2s;
        }
        #mk-ln-result-modal .result-actions button:hover {
          background: #5a67d8;
        }
      </style>
      <div class="result-dialog">
        <div class="result-header ${errors?.length > 0 || unmatchedSeries?.length > 0 ? 'has-issues' : ''}">
          <span>${errors?.length > 0 || unmatchedSeries?.length > 0 ? '⚠️ Sync Complete (with issues)' : '✅ Sync Complete'}</span>
          <button class="close-btn" id="mk-ln-result-close">&times;</button>
        </div>
        <div class="result-content" id="mk-ln-result-content">
          <div class="success-summary">
            📚 Successfully updated <strong>${synced.volumeCount} volume(s)</strong> across <strong>${synced.seriesCount} series</strong>
          </div>
          ${
            unmatchedSeries?.length > 0
              ? `
            <div class="issue-section">
              <div class="issue-title">
                <span class="icon">🔍</span>
                Series not found in Manga Kotoba (${unmatchedSeries.length})
              </div>
              <div class="unmatched-list">
                These series weren't found in your Manga Kotoba database. Updates have been kept in the queue.
                <ul>
                  ${unmatchedSeries
                    .slice(0, 10)
                    .map((id) => `<li>Learn Natively ID: <code>${escapeHtml(id)}</code></li>`)
                    .join('')}
                  ${unmatchedSeries.length > 10 ? `<li><em>...and ${unmatchedSeries.length - 10} more</em></li>` : ''}
                </ul>
              </div>
            </div>
          `
              : ''
          }
          ${
            errors?.length > 0
              ? `
            <div class="issue-section">
              <div class="issue-title">
                <span class="icon">⚠️</span>
                Update errors (${errors.length})
              </div>
              <div class="error-list">
                ${errors
                  .map((error) => {
                    const errorMessage =
                      typeof error === 'string'
                        ? error
                        : error.message || error.error || 'Unknown error'
                    const errorDetails =
                      typeof error === 'object' ? JSON.stringify(error, null, 2) : null

                    return `
                    <div class="error-item">
                      <div class="error-message">${escapeHtml(errorMessage)}</div>
                      ${errorDetails ? `<div class="error-details">${escapeHtml(errorDetails)}</div>` : ''}
                    </div>
                  `
                  })
                  .join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
        <div class="result-actions">
          <button id="mk-ln-result-ok">OK</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners
    const handleClose = () => {
      modal.remove()
    }

    document.getElementById('mk-ln-result-close').addEventListener('click', handleClose)
    document.getElementById('mk-ln-result-ok').addEventListener('click', handleClose)

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        handleClose()
      }
    })

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
  }

  /**
   * Parse volume number from a title string
   * Ported from SqlGeneratorService.parseVolumeNumber() with decimal support
   *
   * @param {string} title - The volume title to parse
   * @returns {number|null} The parsed volume number (can be decimal) or null if not found
   */
  function parseVolumeNumber(title) {
    if (!title) return null

    // Normalize special characters
    const normalized = title.replace('（新装SP版）', ' ').trim()

    // Patterns to match volume numbers, ordered by specificity
    // Support both integer and decimal volume numbers (e.g., "18.5")
    const patterns = [
      /([^(（]+)[(（]([0-9０-９]+(?:\.[0-9０-９]+)?)[)）]/,
      /(.+)[\s\u3000]([0-9０-９]+(?:\.[0-9０-９]+)?)/,
      /(.+)[\s\u3000]第([0-9０-９]+(?:\.[0-9０-９]+)?)巻/,
      /(.+?)([0-9０-９]+(?:\.[0-9０-９]+)?)巻/,
      /(.+?)([0-9０-９]+(?:\.[0-9０-９]+)?)$/,
      /(.+\([^\)]+\))\(([0-9０-９]+(?:\.[0-9０-９]+)?)\)/,
    ]

    for (const pattern of patterns) {
      const match = normalized.match(pattern)
      if (match && match[2]) {
        // Normalize full-width digits to half-width
        const numberStr = match[2].normalize('NFKC')
        const parsed = parseFloat(numberStr)
        if (!isNaN(parsed)) {
          log(`Parsed volume number ${parsed} from title: "${title}"`)
          return parsed
        }
      }
    }

    log(`Could not parse volume number from title: "${title}"`)
    return null
  }

  /**
   * Get the current page type based on URL
   * @returns {'series'|'book'|null}
   */
  function getPageType() {
    const path = window.location.pathname
    if (path.startsWith('/series/')) return 'series'
    if (path.startsWith('/book/')) return 'book'
    return null
  }

  /**
   * Extract series ID from URL or DOM
   * @returns {string|null}
   */
  function getSeriesId() {
    const pageType = getPageType()

    if (pageType === 'series') {
      // Extract from URL: /series/<seriesId>/
      const match = window.location.pathname.match(/^\/series\/([^/]+)/)
      return match ? match[1] : null
    }

    if (pageType === 'book') {
      // Extract from DOM: div.obj-metadata div.series a[href]
      const seriesLink = document.querySelector('div.obj-metadata div.series a')
      if (seriesLink) {
        const href = seriesLink.getAttribute('href')
        const match = href?.match(/\/series\/([^/]+)/)
        return match ? match[1] : null
      }
    }

    return null
  }

  /**
   * Check if the current page is a manga page
   * @returns {boolean}
   */
  function isMangaPage() {
    const pageType = getPageType()

    if (pageType === 'series') {
      // Check div.media-type for "Manga"
      const mediaTypeEl = document.querySelector('div.media-type')
      if (mediaTypeEl) {
        const text = mediaTypeEl.textContent?.trim().toLowerCase() || ''
        return text.includes('manga')
      }
    }

    if (pageType === 'book') {
      // Check div.item-type for "Manga"
      const itemTypeEl = document.querySelector('div.item-type')
      if (itemTypeEl) {
        const text = itemTypeEl.textContent?.trim().toLowerCase() || ''
        return text.includes('manga')
      }
    }

    return false
  }

  /**
   * Get series title from the page
   * @returns {string|null}
   */
  function getSeriesTitle() {
    const pageType = getPageType()

    if (pageType === 'series') {
      const titleEl = document.querySelector('h1.obj-title')
      return titleEl?.textContent?.split(' (Series) ')[0]?.trim() || null
    }

    if (pageType === 'book') {
      // Get series title from the series link
      const seriesLink = document.querySelector('div.obj-metadata div.series a')
      return seriesLink?.textContent?.trim() || null
    }

    return null
  }

  // ========================================
  // LocalStorage Management
  // ========================================

  /**
   * Get pending updates from localStorage
   * @returns {Array} Array of pending update objects
   */
  function getPendingUpdates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('[MK-LN Sync] Error reading from localStorage:', e)
      return []
    }
  }

  /**
   * Save pending updates to localStorage
   * @param {Array} updates - Array of pending update objects
   */
  function savePendingUpdates(updates) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updates))
      log('Saved', updates.length, 'pending updates to localStorage')
    } catch (e) {
      console.error('[MK-LN Sync] Error saving to localStorage:', e)
    }
  }

  /**
   * Add a status update to the pending queue
   * Deduplicates by (lnSeriesId, volumeNumber) - keeps only the most recent
   *
   * @param {Object} update - The update object
   * @param {string} update.lnSeriesId - Learn Natively series ID
   * @param {string} update.seriesTitle - Series title
   * @param {string} update.volumeTitle - Volume title
   * @param {number|null} update.volumeNumber - Parsed volume number
   * @param {string} update.status - The new status from Learn Natively
   * @param {number} update.timestamp - When the update was captured
   */
  function addPendingUpdate(update) {
    const updates = getPendingUpdates()

    // Remove any existing update for the same series + volume
    // Use volume number if available, otherwise fall back to volume title
    const isDuplicate = (existing) => {
      if (existing.lnSeriesId !== update.lnSeriesId) return false

      const useVolumeNumber = update.volumeNumber !== null && existing.volumeNumber !== null
      return useVolumeNumber
        ? existing.volumeNumber === update.volumeNumber
        : existing.volumeTitle === update.volumeTitle
    }

    const filteredUpdates = updates.filter((existing) => !isDuplicate(existing))
    filteredUpdates.push(update)
    savePendingUpdates(filteredUpdates)

    log('Added pending update:', update)
    updatePendingCountBadge()

    // If the sync panel is currently visible, refresh its content
    const syncPanel = document.getElementById('mk-ln-sync-panel')
    if (syncPanel?.classList.contains('visible')) {
      updatePanelContent()
    }
  }

  /**
   * Clear all pending updates (called after successful sync)
   */
  function clearPendingUpdates() {
    localStorage.removeItem(STORAGE_KEY)
    log('Cleared all pending updates')
    updatePendingCountBadge()
  }

  // ========================================
  // Status Extraction
  // ========================================

  /**
   * Map status and queue update in the same chain
   * @param {string} status - The status from Learn Natively API
   * @param {Object} updateInfo - Information needed to create the update
   * @param {string} updateInfo.lnSeriesId - Learn Natively series ID
   * @param {string} updateInfo.seriesTitle - Series title
   * @param {string} updateInfo.volumeTitle - Volume title
   * @param {number|null} updateInfo.volumeNumber - Parsed volume number
   * @returns {string|null} The status or null if invalid
   */
  function mapStatusAndQueueUpdate(status, updateInfo) {
    // Log the status we received
    log(`Status from API: "${status}"`)

    // Basic validation - make sure we have a status
    if (!status) {
      log('No status provided')
      return null
    }

    // If we have the required info, queue the update
    if (updateInfo && updateInfo.lnSeriesId) {
      log(`Queuing update for "${updateInfo.volumeTitle}": ${status}`)

      addPendingUpdate({
        lnSeriesId: updateInfo.lnSeriesId,
        seriesTitle: updateInfo.seriesTitle,
        volumeTitle: updateInfo.volumeTitle,
        volumeNumber: updateInfo.volumeNumber,
        status: status,
        timestamp: Date.now(),
      })
    }

    return status
  }

  // ========================================
  // UI Components
  // ========================================

  /**
   * Create and inject the pending updates badge/button
   */
  function createPendingUpdatesBadge() {
    // Check if badge already exists
    if (document.getElementById('mk-ln-sync-badge')) return

    const badge = document.createElement('div')
    badge.id = 'mk-ln-sync-badge'
    badge.innerHTML = `
      <style>
        #mk-ln-sync-badge {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #mk-ln-sync-badge .badge-button {
          background: var(--header-bg);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s;
        }
        #mk-ln-sync-badge .badge-button:hover {
          transform: translateY(-2px);
        }
        #mk-ln-sync-badge .badge-count {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
        }
        #mk-ln-sync-badge .badge-button.empty {
          background: var(--header-bg);
        }
        #mk-ln-sync-panel {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 380px;
          max-height: 400px;
          background: white;
          border-radius: 12px;
          display: none;
          flex-direction: column;
          z-index: 10001;
          overflow: hidden;
        }
        #mk-ln-sync-panel.visible {
          display: flex;
        }
        #mk-ln-sync-panel .panel-header {
          background: var(--header-bg);
          color: white;
          padding: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #mk-ln-sync-panel .panel-header .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.8;
        }
        #mk-ln-sync-panel .panel-header .close-btn:hover {
          opacity: 1;
        }
        #mk-ln-sync-panel .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        #mk-ln-sync-panel .update-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 13px;
        }
        #mk-ln-sync-panel .update-item:last-child {
          margin-bottom: 0;
        }
        #mk-ln-sync-panel .update-series {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        #mk-ln-sync-panel .update-volume {
          color: #666;
          margin-bottom: 4px;
        }
        #mk-ln-sync-panel .update-status {
          color: #667eea;
          font-weight: 500;
        }
        #mk-ln-sync-panel .update-time {
          color: #999;
          font-size: 11px;
          margin-top: 4px;
        }
        #mk-ln-sync-panel .panel-actions {
          padding: 16px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 8px;
        }
        #mk-ln-sync-panel .panel-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        #mk-ln-sync-panel .panel-actions button:hover {
          opacity: 0.9;
        }
        #mk-ln-sync-panel .sync-btn {
          background: var(--header-bg);
          color: white;
          border: none;
        }
        #mk-ln-sync-panel .sync-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        #mk-ln-sync-panel .clear-btn {
          background: white;
          color: #dc3545;
          border: 1px solid #dc3545;
        }
        #mk-ln-sync-panel .settings-btn {
          background: white;
          color: #666;
          border: 1px solid #ccc;
        }
        #mk-ln-sync-panel .empty-state {
          text-align: center;
          color: #999;
          padding: 40px 20px;
        }
        #mk-ln-sync-panel .token-status {
          font-size: 11px;
          color: #666;
          text-align: center;
          padding: 8px;
          border-top: 1px solid #eee;
          background: #f9f9f9;
          line-height: 1.3;
          word-break: break-word;
        }
        #mk-ln-sync-panel .token-status.configured {
          color: #28a745;
        }
        #mk-ln-sync-panel .token-status.not-configured {
          color: #dc3545;
        }
        #mk-ln-sync-panel .import-link {
          font-size: 11px;
          color: #666;
          text-align: center;
          padding: 8px;
          border-top: 1px solid #eee;
          background: #f9f9f9;
          line-height: 1.3;
        }
        #mk-ln-sync-panel .import-link a {
          color: var(--header-bg, #667eea);
          text-decoration: none;
        }
        #mk-ln-sync-panel .import-link a:hover {
          text-decoration: underline;
        }
      </style>
      <button class="badge-button empty" id="mk-ln-sync-btn">
        <span>📚 MK Sync</span>
        <span class="badge-count" id="mk-ln-sync-count">0</span>
      </button>
      <div id="mk-ln-sync-panel">
        <div class="panel-header">
          <span>Pending Updates</span>
          <button class="close-btn" id="mk-ln-close-panel">&times;</button>
        </div>
        <div class="panel-content" id="mk-ln-panel-content">
          <div class="empty-state">No pending updates</div>
        </div>
        <div class="panel-actions">
          <button class="sync-btn" id="mk-ln-do-sync" disabled>Sync to Manga Kotoba</button>
          <button class="clear-btn" id="mk-ln-clear">Clear</button>
          <button class="settings-btn" id="mk-ln-settings">⚙️</button>
        </div>
        <div class="import-link">
          <a href="https://manga-kotoba.com/import/natively/upload" target="_blank">Import current Natively statuses →</a>
        </div>
        <div class="token-status" id="mk-ln-token-status"></div>
      </div>
    `

    document.body.appendChild(badge)

    // Set up event listeners
    document.getElementById('mk-ln-sync-btn').addEventListener('click', togglePanel)
    document.getElementById('mk-ln-close-panel').addEventListener('click', closePanel)
    document.getElementById('mk-ln-do-sync').addEventListener('click', handleSync)
    document.getElementById('mk-ln-clear').addEventListener('click', handleClear)
    document.getElementById('mk-ln-settings').addEventListener('click', () => {
      showSettingsPanel()
    })

    // Initial update
    updatePendingCountBadge()
    updatePanelContent()
    updateTokenStatus()
  }

  /**
   * Update the token status display in the panel
   */
  function updateTokenStatus() {
    const statusEl = document.getElementById('mk-ln-token-status')
    if (!statusEl) return

    const token = getApiToken()
    const url = getApiUrl()
    const stoppedMapping = getStoppedMapping()

    if (token) {
      statusEl.className = 'token-status configured'
      statusEl.textContent = `✓ Token configured • ${url.replace('https://', '')} • Stopped: ${stoppedMapping}`
    } else {
      statusEl.className = 'token-status not-configured'
      statusEl.textContent = '⚠ Token not configured - click ⚙️ to set up'
    }
  }

  /**
   * Toggle the panel visibility
   */
  function togglePanel() {
    const panel = document.getElementById('mk-ln-sync-panel')
    panel.classList.toggle('visible')
    if (panel.classList.contains('visible')) {
      updatePanelContent()
      updateTokenStatus()
    }
  }

  /**
   * Close the panel
   */
  function closePanel() {
    document.getElementById('mk-ln-sync-panel').classList.remove('visible')
  }

  /**
   * Update the pending count badge
   */
  function updatePendingCountBadge() {
    const count = getPendingUpdates().length

    // Cache DOM queries
    const elements = {
      count: document.getElementById('mk-ln-sync-count'),
      button: document.getElementById('mk-ln-sync-btn'),
      syncBtn: document.getElementById('mk-ln-do-sync'),
    }

    if (elements.count) elements.count.textContent = count
    if (elements.button) elements.button.classList.toggle('empty', count === 0)
    if (elements.syncBtn) elements.syncBtn.disabled = count === 0
  }

  /**
   * Update the panel content with current pending updates
   */
  function updatePanelContent() {
    const content = document.getElementById('mk-ln-panel-content')
    if (!content) return

    const updates = getPendingUpdates()

    if (updates.length === 0) {
      content.innerHTML = '<div class="empty-state">No pending updates</div>'
      return
    }

    // Sort by timestamp (newest first)
    updates.sort((a, b) => b.timestamp - a.timestamp)

    content.innerHTML = updates
      .map((update) => {
        const time = new Date(update.timestamp).toLocaleString()
        const volNum = update.volumeNumber !== null ? ` (Vol. ${update.volumeNumber})` : ''
        return `
          <div class="update-item">
            <div class="update-series">${escapeHtml(update.seriesTitle)}</div>
            <div class="update-volume">${escapeHtml(update.volumeTitle)}${volNum}</div>
            <div class="update-status">→ ${escapeHtml(update.status)}</div>
            <div class="update-time">${time}</div>
          </div>
        `
      })
      .join('')
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  /**
   * Set the sync button to loading state
   * @param {boolean} loading - Whether to show loading state
   */
  function setSyncButtonLoading(loading) {
    const syncBtn = document.getElementById('mk-ln-do-sync')
    if (!syncBtn) return

    if (loading) {
      syncBtn.disabled = true
      syncBtn.dataset.originalText = syncBtn.textContent
      syncBtn.textContent = 'Syncing...'
    } else {
      syncBtn.disabled = getPendingUpdates().length === 0
      if (syncBtn.dataset.originalText) {
        syncBtn.textContent = syncBtn.dataset.originalText
      }
    }
  }

  /**
   * Handle sync button click
   * Syncs pending updates to Manga Kotoba API
   */
  async function handleSync() {
    const updates = getPendingUpdates()
    if (updates.length === 0) {
      alert('No pending updates to sync.')
      return
    }

    // Check for API token
    const token = getApiToken()
    if (!token) {
      const configure = confirm(
        'API token not configured.\n\n' +
          'You need to set your Manga Kotoba API token before syncing.\n\n' +
          'Would you like to configure it now?'
      )
      if (configure) {
        showSettingsPanel()
      }
      return
    }

    // Show enhanced confirmation for sync action
    const shouldProceed = await showEnhancedConfirm(
      `Sync ${updates.length} pending update(s) to Manga Kotoba?`,
      'sync'
    )
    if (!shouldProceed) {
      return
    }

    const apiUrl = getApiUrl()
    const stoppedMapping = getStoppedMapping()
    const endpoint = `${apiUrl}/api/v1/ln/sync`

    log(`Syncing ${updates.length} updates to ${endpoint}`)
    log(`Using stoppedMapping: ${stoppedMapping}`)
    log(`Token length: ${token.length} characters`)
    log(`Token preview: ${token.substring(0, 8)}...${token.substring(token.length - 8)}`)
    setSyncButtonLoading(true)

    const requestBody = {
      updates: updates.map((u) => ({
        lnSeriesId: u.lnSeriesId,
        volumeNumber: u.volumeNumber,
        status: u.status,
        timestamp: u.timestamp,
      })),
      options: {
        stoppedMapping: stoppedMapping,
      },
    }

    log('Request payload:', requestBody)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      // Read response as text first, then try to parse as JSON
      const responseText = await response.text()
      log('Raw response:', { status: response.status, text: responseText })

      let result
      try {
        result = JSON.parse(responseText)
        log('Parsed JSON response:', result)
      } catch (jsonError) {
        // Handle non-JSON error responses
        log('Failed to parse JSON:', jsonError)

        const authError = response.status === 401 || response.status === 403
        if (authError) {
          const isUnauthorized = response.status === 401
          alert(
            (isUnauthorized ? 'Authentication failed' : 'Permission denied') +
              '.\n\n' +
              'Your API token may be ' +
              (isUnauthorized ? 'invalid or expired' : 'missing required permissions') +
              '.\n' +
              'Please generate a new token with "Update reading statuses" permission enabled.'
          )
        } else {
          alert(`Sync failed (${response.status}): ${responseText || response.statusText}`)
        }
        return
      }

      if (!response.ok) {
        // Handle error responses with JSON
        const authError = response.status === 401 || response.status === 403
        if (authError) {
          const isUnauthorized = response.status === 401
          alert(
            (isUnauthorized ? 'Authentication failed' : 'Permission denied') +
              '.\n\n' +
              'Your API token may be ' +
              (isUnauthorized ? 'invalid or expired' : 'missing required permissions') +
              '.\n' +
              'Please generate a new token with "Update reading statuses" permission enabled.'
          )
        } else {
          alert(`Sync failed: ${result.error || response.statusText}`)
        }
        return
      }

      // Success! Clear synced updates and show result
      const { synced, errors, unmatchedSeries } = result

      // Update pending updates based on results
      if (unmatchedSeries && unmatchedSeries.length > 0) {
        // Only keep updates for unmatched series
        const unmatchedSet = new Set(unmatchedSeries)
        const remainingUpdates = updates.filter((u) => unmatchedSet.has(u.lnSeriesId))
        savePendingUpdates(remainingUpdates)
      } else {
        // All updates synced successfully, clear everything
        clearPendingUpdates()
      }

      // Show results in modal
      showSyncResultModal({ synced, errors, unmatchedSeries })
      updatePanelContent()
      updatePendingCountBadge()
      closePanel()
    } catch (error) {
      log('Sync error:', error)

      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert(
          'Could not connect to Manga Kotoba.\n\n' +
            'Please check:\n' +
            '- Your internet connection\n' +
            '- The API URL in settings\n\n' +
            `Current URL: ${apiUrl}`
        )
      } else {
        alert(`Sync error: ${error.message}`)
      }
    } finally {
      setSyncButtonLoading(false)
    }
  }

  /**
   * Handle clear button click
   */
  async function handleClear() {
    const updates = getPendingUpdates()
    if (updates.length === 0) return

    const shouldProceed = await showEnhancedConfirm(
      `Clear ${updates.length} pending update(s)?`,
      'clear'
    )
    if (shouldProceed) {
      clearPendingUpdates()
      updatePanelContent()
      closePanel()
    }
  }

  // ========================================
  // Initialization
  // ========================================

  /**
   * Initialize the userscript on page load
   */
  function init() {
    log('*** INITIALIZING MANGA KOTOBA SYNC USERSCRIPT ***')
    log('Current URL:', window.location.href)
    log('Page type:', getPageType())
    log('Is manga page:', isMangaPage())

    // Set up network request monitoring first
    setupNetworkMonitoring()

    // Always create the UI badge
    createPendingUpdatesBadge()

    // Test the interception is working
    log('Network monitoring active. Try changing a reading status to see intercepted requests.')
    log('Looking for requests to:', LN_API_ENDPOINT)
  }

  // ========================================
  // Start
  // ========================================

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Also re-initialize on navigation (for SPA-like behavior)
  let lastUrl = window.location.href
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href
      log('URL changed, re-initializing...')
      // Small delay to let the new page content load
      setTimeout(init, 500)
    }
  })

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Listen for history navigation
  window.addEventListener('popstate', () => {
    log('Popstate event, re-initializing...')
    setTimeout(init, 500)
  })
})()
