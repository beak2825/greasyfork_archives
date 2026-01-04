// ==UserScript==
// @name         Bandcamp download mp3s (single + bulk)
// @description  Adds per-track and bulk download links for Bandcamp preview mp3s
// @namespace    83BandcampScript
// @version      2
// @license      GPL-3.0-or-later
// @match        https://*.bandcamp.com/*
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @connect      bandcamp.com
// @connect      bcbits.com
// @icon         https://bandcamp.com/img/favicon/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/550125/Bandcamp%20download%20mp3s%20%28single%20%2B%20bulk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550125/Bandcamp%20download%20mp3s%20%28single%20%2B%20bulk%29.meta.js
// ==/UserScript==

/* globals GM, unsafeWindow, GM_download */
/* jshint asi: true, esversion: 8 */

(function () {
  function fixFilename (s) {
    const forbidden = '*"/\\[]:|,<>?\n\t\0'.split('')
    forbidden.forEach(char => { s = s.replace(char, '') })
    return s
  }

  function addTrackDownload (hoverdiv, t, albumArtist) {
    if (!t.file || !t.file['mp3-128']) return null
    const mp3 = t.file['mp3-128'].replace(/^\/\//, 'https://')
    const filename =
      (t.track_num > 9 ? '' : '0') +
      t.track_num +
      '. ' +
      fixFilename(albumArtist + ' - ' + t.title) +
      '.mp3'

    const a = document.createElement('a')
    a.className = 'downloaddisk'
    a.href = mp3
    a.download = filename
    a.textContent = '💾'
    a.addEventListener('click', function (ev) {
      ev.preventDefault()
      GM_download({ url: mp3, name: filename })
    })

    hoverdiv.appendChild(a)
    return { url: mp3, filename }
  }

  function addBulkButton (allTracks, albumTitle) {
    const btn = document.createElement('a')
    btn.textContent = '🔗💾'
    btn.style.marginLeft = '10px'
    btn.style.cursor = 'pointer'
    btn.style.fontSize = '1.2em'
    btn.title = 'Download all tracks'

    btn.addEventListener('click', (ev) => {
      ev.preventDefault()
      let delay = 0
      for (const track of allTracks) {
        setTimeout(() => {
          GM_download({ url: track.url, name: track.filename })
        }, delay)
        delay += 1000
      }
    })

    document.querySelector('.trackTitle')?.parentNode.prepend(btn)
  }

  setTimeout(function () {
    const TralbumData = unsafeWindow.TralbumData
    if (!TralbumData || !TralbumData.hasAudio || !TralbumData.trackinfo) return

    let hoverdivs = document.querySelectorAll('.download-col div')
    if (hoverdivs.length === 0) {
      hoverdivs = document.querySelectorAll('h2.trackTitle')
    }

    const allTracks = []
    for (let i = 0; i < TralbumData.trackinfo.length; i++) {
      const track = TralbumData.trackinfo[i]
      const entry = addTrackDownload(hoverdivs[i], track, TralbumData.artist)
      if (entry) allTracks.push(entry)
    }

    if (allTracks.length > 0) {
      addBulkButton(allTracks, TralbumData.current.title)
    }
  }, 500)
})()
