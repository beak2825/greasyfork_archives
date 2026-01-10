// ==UserScript==
// @name         Mokuro Reader Manga Kotoba Integration
// @namespace    http://tampermonkey.net/
// @version      2026-01-10
// @description  Integrates matching Manga Kotoba reading statuses with Mokuro Reader.
// @author       Christopher Fritz
// @license MIT
// @match        https://reader.mokuro.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562134/Mokuro%20Reader%20Manga%20Kotoba%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/562134/Mokuro%20Reader%20Manga%20Kotoba%20Integration.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  const mangaKotobaApiUrl = 'https://manga-kotoba.com/api'
  let mangaKotobaToken = localStorage.getItem('manga-kotoba-token') || ''

  if (!mangaKotobaToken) {
    console.warn(
      'Manga Kotoba token not set in localStorage under "manga-kotoba-token". Integration disabled.'
    )
    return
  }

  // Flag to ensure UI initialization only runs once
  let uiInitialized = false

  // Monitor URL changes for single-page applications (SPAs)
  let lastUrl = ''

  // Load store series and volume mappings from localStorage
  let storeSeriesVolumeMap = {}
  let mappedSeries = JSON.parse(localStorage.getItem('manga-kotoba-series-map')) || {}
  let mappedVolumes = JSON.parse(localStorage.getItem('manga-kotoba-volume-map')) || {}

  // Create a MutationObserver to detect DOM changes that might indicate navigation
  const observer = new MutationObserver(() => {
    handleUrlChange()
  })

  // Start observing the document with the configured parameters
  observer.observe(document, { subtree: true, childList: true })

  // Also listen for the popstate event (back/forward navigation)
  window.addEventListener('popstate', () => {
    handleUrlChange()
  })

  // Listen for hashchange events
  window.addEventListener('hashchange', () => {
    handleUrlChange()
  })

  // Initialize UI elements on first page load
  initializeUI()

  // Initial check
  handleUrlChange()

  // Function to display "no changes" modal
  function showNoChangesModal() {
    // Remove any existing modal
    const existingModal = document.getElementById('manga-kotoba-sync-modal')
    if (existingModal) {
      existingModal.remove()
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div')
    modalOverlay.id = 'manga-kotoba-sync-modal'
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `

    // Create modal content
    const modalContent = document.createElement('div')
    modalContent.style.cssText = `
      background-color: var(--color-gray-950);
      border-color: var(--color-gray-700);
      border-style: var(--tw-border-style);
      border-width: 1px;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    `

    // Create header
    const header = document.createElement('h2')
    header.textContent = 'Manga Kotoba Sync'
    header.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: bold;
    `
    modalContent.appendChild(header)

    // Create message
    const message = document.createElement('div')
    message.style.cssText = `
      color: var(--color-gray-400);
      margin-bottom: 16px;
      text-align: center;
    `
    message.textContent = 'No changes to sync since last sync.'
    modalContent.appendChild(message)

    // Create close button
    const closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    closeButton.style.cssText = `
      color: white;
      padding: 8px 16px;
      border: solid thin var(--color-gray-600);
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `
    closeButton.addEventListener('click', () => {
      modalOverlay.remove()
    })
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = 'var(--color-gray-500)'
    })
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = ''
    })

    modalContent.appendChild(closeButton)

    modalOverlay.appendChild(modalContent)
    document.body.appendChild(modalOverlay)

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove()
      }
    })
  }

  // Function to display sync results in a modal
  function showSyncResultsModal(syncResults) {
    // Remove any existing modal
    const existingModal = document.getElementById('manga-kotoba-sync-modal')
    if (existingModal) {
      existingModal.remove()
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div')
    modalOverlay.id = 'manga-kotoba-sync-modal'
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `

    // Create modal content
    const modalContent = document.createElement('div')
    modalContent.style.cssText = `
      background-color: var(--color-gray-950);
      border-color: var(--color-gray-700);
      border-style: var(--tw-border-style);
      border-width: 1px;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      max-height: 80vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    `

    // Create header
    const header = document.createElement('h2')
    header.textContent = 'Manga Kotoba Sync Results'
    header.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: bold;
    `
    modalContent.appendChild(header)

    // Count totals
    let totalSeries = syncResults.length
    let seriesUpdated = 0
    let seriesNotFound = 0
    let seriesNoChange = 0
    let totalVolumes = 0
    let volumesUpdated = 0
    let volumesNotFound = 0
    let volumesNoChange = 0

    syncResults.forEach((series) => {
      if (series.seriesStatus === 'updated') seriesUpdated++
      else if (series.seriesStatus === 'not_found') seriesNotFound++
      else if (series.seriesStatus === 'no_change') seriesNoChange++

      series.volumes.forEach((volume) => {
        totalVolumes++
        if (volume.volumeStatus === 'updated') volumesUpdated++
        else if (volume.volumeStatus === 'not_found') volumesNotFound++
        else if (volume.volumeStatus === 'no_change') volumesNoChange++
      })
    })

    // Create summary section
    const summary = document.createElement('div')
    summary.style.cssText = `
      color: var(--color-white);
      background-color: var(--color-gray-800);
      padding: 12px;
      margin-bottom: 16px;
      border-color: var(--color-gray-700);
      border-style: var(--tw-border-style);
      border-width: 1px;
      border-radius: var(--radius-lg);
    `
    summary.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Summary:</strong></div>
      <div style="margin-left: 16px; color: var(--color-gray-400);">
        <div>Series: ${totalSeries} total (${seriesUpdated} updated, ${seriesNoChange} no change, ${seriesNotFound} not found)</div>
        <div>Volumes: ${totalVolumes} total (${volumesUpdated} updated, ${volumesNoChange} no change, ${volumesNotFound} not found)</div>
      </div>
    `
    modalContent.appendChild(summary)

    // Create results list
    const resultsList = document.createElement('div')
    resultsList.style.cssText = `
      margin-bottom: 16px;
    `

    syncResults.forEach((series) => {
      const seriesDiv = document.createElement('div')
      seriesDiv.style.cssText = `
        color: var(--color-gray-400);
        background-color: var(--color-gray-800);
        padding: 12px;
        margin-bottom: 16px;
        border-color: var(--color-gray-700);
        border-style: var(--tw-border-style);
        border-width: 1px;
        border-radius: var(--radius-lg);
      `

      // Series header
      const seriesHeader = document.createElement('div')
      seriesHeader.style.cssText = `
        color: var(--color-white);
        font-weight: bold;
        margin-bottom: 8px;
      `

      const statusBadge = getStatusBadge(series.seriesStatus)
      const calculatedStatus = series.calculatedStatus
        ? ` → ${getReadableStatus(series.calculatedStatus)}`
        : ''
      seriesHeader.innerHTML = `${series.title} ${statusBadge}${calculatedStatus}`

      seriesDiv.appendChild(seriesHeader)

      // Volumes list
      if (series.volumes && series.volumes.length > 0) {
        const volumesList = document.createElement('div')
        volumesList.style.cssText = `
          margin-left: 16px;
        `

        series.volumes.forEach((volume) => {
          const volumeDiv = document.createElement('div')
          volumeDiv.style.cssText = `
            margin-bottom: 4px;
            font-size: 14px;
          `

          const volumeBadge = getStatusBadge(volume.volumeStatus)
          volumeDiv.innerHTML = `Vol ${volume.volumeNumber}: ${volume.title} ${volumeBadge} → ${getReadableStatus(volume.status)}`

          volumesList.appendChild(volumeDiv)
        })

        seriesDiv.appendChild(volumesList)
      }

      resultsList.appendChild(seriesDiv)
    })

    modalContent.appendChild(resultsList)

    // Create close button
    const closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    closeButton.style.cssText = `
      color: white;
      padding: 8px 16px;
      border: solid thin var(--color-gray-600);
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `
    closeButton.addEventListener('click', () => {
      modalOverlay.remove()
    })
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = 'var(--color-gray-500)'
    })
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = ''
    })

    modalContent.appendChild(closeButton)

    modalOverlay.appendChild(modalContent)
    document.body.appendChild(modalOverlay)

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove()
      }
    })
  }

  // Helper function to get status badge HTML
  function getStatusBadge(status) {
    const badges = {
      updated:
        '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 4px;">UPDATED</span>',
      not_found:
        '<span style="background-color: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 4px;">NOT FOUND</span>',
      no_change:
        '<span style="background-color: #6b7280; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 4px;">NO CHANGE</span>',
    }
    return badges[status] || ''
  }

  // Helper function to get readable status name
  function getReadableStatus(statusCode) {
    const statuses = {
      r: 'Reading',
      p: 'Paused',
      o: 'Owned',
      w: 'Wishlist',
      f: 'Finished',
      d: 'Dropped',
      u: 'Uninterested',
    }
    return statuses[statusCode] || statusCode
  }

  // Function to handle Manga Kotoba Sync button click
  function handleMangaKotobaSync() {
    /*
      Volumes are stored as key/value pairs with volumeUID as key.
      The value may include these keys:
      * series_uuid
      * series_title
      * volume_title
      * progress
      * completed
      * addedOn
      * lastProgressUpdate
    */

    const volumes = JSON.parse(localStorage.getItem('volumes'))
    if (!volumes || Object.keys(volumes).length === 0) {
      console.error('No volumes found in localStorage under "volumes". Cannot sync.')
      alert('No volumes found to sync.')
      return
    }
    console.log('Volumes:')
    console.log(volumes)

    // Fix volumes with null lastProgressUpdate by setting it to addedOn
    let volumesUpdated = false
    Object.entries(volumes).forEach(([volumeUID, volumeData]) => {
      if (!volumeData.lastProgressUpdate && volumeData.addedOn) {
        volumes[volumeUID].lastProgressUpdate = volumeData.addedOn
        volumesUpdated = true
        console.log(`Updated volume ${volumeUID} lastProgressUpdate to ${volumeData.addedOn}`)
      }
    })

    // Save updated volumes back to localStorage if any were modified
    if (volumesUpdated) {
      localStorage.setItem('volumes', JSON.stringify(volumes))
      console.log('Updated volumes saved to localStorage')
    }

    // Get the last sync timestamp
    const lastSyncTimestamp = localStorage.getItem('manga-kotoba-last-sync')
    const lastSyncDate = lastSyncTimestamp ? new Date(lastSyncTimestamp) : null

    console.log('Last sync date:', lastSyncDate)

    /*
      Do not submit the full information to Manga Kotoba.  Instead, extract the necessary
      fields for Manga Kotoba to update statuses.

      The data to send needs to be an array of key value pairs of series_title and an
      array of volumes for that series title.  Each volume in the array needs to include
      volume_title and reading status.
    */

    // Group volumes by series_title, filtering by lastProgressUpdate
    const seriesMap = new Map()
    let updatedVolumesCount = 0

    Object.entries(volumes).forEach(([volumeUID, volumeData]) => {
      // Skip volumes that haven't been updated since last sync
      if (lastSyncDate && volumeData.lastProgressUpdate) {
        const volumeUpdateDate = new Date(volumeData.lastProgressUpdate)
        if (volumeUpdateDate < lastSyncDate) {
          return // Skip this volume
        }
      }
      console.log('Volume last progress update date:', volumeData.lastProgressUpdate)
      console.log(volumeData)

      updatedVolumesCount++
      const seriesTitle = volumeData.series_title

      if (!seriesMap.has(seriesTitle)) {
        seriesMap.set(seriesTitle, {
          title: seriesTitle,
          volumes: [],
        })
      }

      // Statuses are:
      // o - owned
      // r - reading
      // f - finished
      // TODO: Should this use "paused" if the user hasn't read in a while?
      seriesMap.get(seriesTitle).volumes.push({
        title: volumeData.volume_title,
        status: volumeData.completed ? 'f' : volumeData.progress > 1 ? 'r' : 'o',
      })
    })

    // Check if there are any volumes to sync
    if (updatedVolumesCount === 0) {
      console.log('No volumes have been updated since last sync.')
      showNoChangesModal()
      return
    }

    // Convert map to array for submission
    const syncData = Array.from(seriesMap.values())

    console.log('Prepared sync data for Manga Kotoba:')
    console.log(syncData)
    console.log(`Syncing ${updatedVolumesCount} updated volume(s)`)

    // Submit syncData to Manga Kotoba API
    fetch(`${mangaKotobaApiUrl}/v1/sync/progress`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mangaKotobaToken}`,
      },
      body: JSON.stringify(syncData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sync failed with status: ${response.status}`)
        }
        return response.json()
      })
      .then((result) => {
        console.log('Sync successful:', result)

        // Update the last sync timestamp on successful sync
        const now = new Date().toISOString()
        localStorage.setItem('manga-kotoba-last-sync', now)
        console.log('Last sync timestamp updated to:', now)

        showSyncResultsModal(result)
      })
      .catch((error) => {
        console.error('Sync error:', error)
        alert(`Sync error: ${error.message}`)
      })
  }

  // Function to initialize UI elements (runs only once)
  function initializeUI() {
    if (uiInitialized) {
      return
    }

    // Wait for the nav element to be available
    waitForContent('nav')
      .then((navElement) => {
        // Navigate three divs deep
        let currentElement = navElement
        for (let i = 0; i < 3; i++) {
          const divElement = currentElement.querySelector('div')
          if (!divElement) {
            console.error(`Could not find div at depth ${i + 1} inside nav element`)
            return
          }
          currentElement = divElement
        }

        // Create and append the button
        const button = document.createElement('button')
        button.className = 'flex h-6 w-6 items-center justify-center whitespace-nowrap'
        button.title = 'Manga Kotoba Sync'
        button.textContent = 'MK 🗘'
        button.addEventListener('click', handleMangaKotobaSync)
        currentElement.appendChild(button)

        uiInitialized = true
        console.log('Manga Kotoba Sync button added to UI')
      })
      .catch((error) => {
        console.error('Failed to initialize UI:', error)
      })
  }

  // Function to wait for content to load after navigation
  function waitForContent(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Check if element already exists
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector))
      }

      // Set up mutation observer to watch for the element
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      // Set timeout to reject if element never appears
      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Timeout waiting for selector: ${selector}`))
      }, timeout)
    })
  }

  // Function to find and map series in Manga Kotoba
  async function findAndMapSeries(seriesUID, seriesTitle) {
    // Check if we already have a mapping
    if (mappedSeries.hasOwnProperty(seriesUID)) {
      return mappedSeries[seriesUID]
    }

    // Try to get Manga Kotoba ID for this series
    const queryUrl = `${mangaKotobaApiUrl}/series/find/` + encodeURIComponent(seriesTitle)
    const response = await fetch(queryUrl)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()

    // If there was a result, update the mappedSeries object and write back to localStorage
    if (result && result.id) {
      mappedSeries[seriesUID] = result.id
      localStorage.setItem('manga-kotoba-series-map', JSON.stringify(mappedSeries))
      return result.id
    }

    console.log(`No mapping found for Mokuro series UID ${seriesUID} in Manga Kotoba.`)
    return null
  }

  // Function to handle URL changes
  async function handleUrlChange() {
    const currentUrl = window.location.href
    if (currentUrl === lastUrl) {
      return // No change in URL
    }

    lastUrl = currentUrl

    console.log('Detected URL change to:', currentUrl)

    let urlParts = location.hash.split('/')
    let page = urlParts[1] // catalogue, series, or reader
    console.log(`Current page: ${page}`)
    // Get series and volume information from the URL.
    let seriesUID = urlParts[2]
    let volumeUID = urlParts[3]
    let seriesTitle = ''

    switch (page) {
      case 'catalogue':
        // We're on the catalogue page; no action needed.
        return
      case 'series':
        try {
          // Wait for the h3 element to be loaded
          const h3Element = await waitForContent('h3')
          seriesTitle = h3Element.textContent.trim()
        } catch (error) {
          console.error('Failed to load series page content:', error)
        }
        break
      case 'reader':
        // We're on the reader page; proceed to check mappings.
        // You might want to wait for reader-specific content here too
        /*try {
          // Wait for reader content to load (adjust selector as needed)
          await waitForContent('.mokuro-panel, .reader-container, main', 2000)
        } catch (error) {
          console.warn('Reader content not detected, proceeding anyway:', error)
        }*/
        return
      default:
        // Unknown page type; exit.
        return
    }

    // Find and map the series to Manga Kotoba
    const mkSeriesId = await findAndMapSeries(seriesUID, seriesTitle)

    if (mkSeriesId) {
      // Get the user's reading status for this series from Manga Kotoba API
      const queryUrl = `${mangaKotobaApiUrl}/v1/series/${mkSeriesId}/status`
      const response = await fetch(queryUrl, {
        headers: {
          Authorization: `Bearer ${mangaKotobaToken}`,
        },
      })
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const result = await response.json()
      console.log('Manga Kotoba series status:', result)

      let mkVolumeId = null

      if (mappedVolumes.hasOwnProperty(volumeUID)) {
        mkVolumeId = mappedVolumes[volumeUID]
      }

      // Now you can use mkSeriesId and mkVolumeId as needed
      // For example, you might want to fetch reading status from Manga Kotoba API
    }
  }
})()
