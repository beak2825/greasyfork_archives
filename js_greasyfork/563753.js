// ==UserScript==
// @name         Bandcamp Downloader (w/ metadata)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2026-01-23-2
// @description  Download the preview 128kbps audio file from Bandcamp, complete with filled out metadata for the audio files.
// @author       sudoker0
// @match        https://*.bandcamp.com/album/*
// @match        https://*.bandcamp.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B
// @require      https://cdn.jsdelivr.net/npm/browser-id3-writer@4.1.0/dist/browser-id3-writer.min.js
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @connect      bandcamp.com
// @connect      bcbits.com
// @downloadURL https://update.greasyfork.org/scripts/563753/Bandcamp%20Downloader%20%28w%20metadata%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563753/Bandcamp%20Downloader%20%28w%20metadata%29.meta.js
// ==/UserScript==

/*jshint esversion: 8 */
const ALBUM_REGEX = /.*\.bandcamp\.com\/album/
const TRACK_REGEX = /.*\.bandcamp\.com\/track/

let state_isDownloading = false

function log(...msg) {
    console.log("[Bandcamp Scraper]", ...msg)
}

function logger(elm, msg) {
    log(msg)
    elm.innerText = "> " + msg
}

async function writeMp3Tag(buffer, artist, album, title, release_year, track_num, total_tracks, art_id) {
    // https://stackoverflow.com/questions/65085046/how-do-i-pull-album-art-thumbnail-from-bandcamp#69481878
    const art_img = await GM.xmlHttpRequest({
        url: `https://f4.bcbits.com/img/a${art_id}_5.jpg`,
        method: 'GET',
        responseType: "arraybuffer"
    })

    const writer = new ID3Writer(buffer);
    writer.setFrame('TIT2', title)
        .setFrame('TPE1', [artist])
        .setFrame('TALB', album)
        .setFrame('TRCK', `${track_num}/${total_tracks}`)
        .setFrame('TYER', release_year)
        .setFrame('APIC', {
            type: 3,
            data: art_img.response,
            description: 'Album pibcture',
        });
    writer.addTag();
    return writer.arrayBuffer
}

async function downloadData(data, statusTxt) {
    const trackSelectElms = document.querySelectorAll(".bd-track-select")
    let selectedTracks = [...trackSelectElms].filter(v => v.checked).map(v => v.getAttribute("data-trackNum"))

    // OVERRIDE for track
    if (TRACK_REGEX.test(location.href)) {
        selectedTracks = [...Object.keys(data.tracks)]
    }

    if (selectedTracks.length == 0) {
        alert("No track selected yet!")
        return
    }

    logger(statusTxt, "Now downloading...")

    var zip = new JSZip();
    let cnt = 1
    logger(statusTxt, `Now downloading ${selectedTracks.length} track(s)...`)
    for (let trackNum of selectedTracks) {
        const trackData = data.tracks[trackNum]
        logger(statusTxt, `(${cnt++}/${selectedTracks.length}) Downloading ${trackData.title}...`)
        log("Fetching", trackData.link)
        const trackResponse = await GM.xmlHttpRequest({
            method: 'GET',
            url: trackData.link,
            responseType: "arraybuffer"
        });

        const trackTitle = data.tracks[trackNum].title

        let buffer = trackResponse.response
        logger(statusTxt, `Writing metadata for ${trackTitle}...`)
        let modifiedBuffer = await writeMp3Tag(buffer, data.artist, data.album, trackTitle, data.release_year, trackNum, trackSelectElms.length, data.art_id)
        zip.file(`${data.artist} - ${data.album} - ${trackNum}. ${trackTitle}.mp3`, modifiedBuffer, { binary: true })
    }
    logger(statusTxt, `Adding cover image...`)
    const art_img = await GM.xmlHttpRequest({
        url: `https://f4.bcbits.com/img/a${data.art_id}_1.png`,
        method: 'GET',
        responseType: "arraybuffer"
    })
    zip.file(`cover.png`, art_img.response, { binary: true })
    logger(statusTxt, `Zipping files...`)
    const blob = await zip.generateAsync({type:"blob",compression: "DEFLATE", compressionOptions: { level: 5 }})
    logger(statusTxt, `File zipped! Ready to download...`)
    await GM.download({ url: blob, name: `${data.artist} - ${data.album}.zip`, saveAs: true }).catch(e => {})
    logger(statusTxt, `Ready!`)
}

function createContainer(afterElm, data) {
    const rootElm = document.createElement("div")
    rootElm.style.margin = "2em 0"

    const headerTxt = document.createElement("h3")
    headerTxt.innerText = "Download (128Kbps file)"
    const infoTxt = document.createElement("p")
    infoTxt.innerText = "Select track(s) to download. This may take a while depending on your Internet connection, as assets are streamed from the server."
    const infoTxt2 = document.createElement("p")
    infoTxt2.innerText = "Will download this track as a zipped MP3 file."

    const selectElm = document.createElement("div")
    selectElm.style.width = "100%"
    selectElm.style['max-height'] = "120px"
    selectElm.style.display = "flex"
    selectElm.style["flex-direction"] = "column"
    selectElm.style.overflow = "auto"
    selectElm.style.margin = "1em 0em"

    const selectAllButton = document.createElement("a")
    selectAllButton.role = "button"
    selectAllButton.innerText = "Select All"
    selectAllButton.onclick = () => {
        if (state_isDownloading) return
        document.querySelectorAll(".bd-track-select").forEach(v => { v.checked = true })
    }

    const deselectAllButton = document.createElement("a")
    deselectAllButton.role = "button"
    deselectAllButton.innerText = "Deselect All"
    deselectAllButton.onclick = () => {
        if (state_isDownloading) return
        document.querySelectorAll(".bd-track-select").forEach(v => { v.checked = false })
    }

    const controlContainer = document.createElement("div")
    controlContainer.style.display = "flex"
    controlContainer.style["flex-direction"] = "row"
    controlContainer.style.gap = "1em"
    controlContainer.append(selectAllButton, deselectAllButton)
    selectElm.append(controlContainer)

    for (const trackNum in data.tracks) {
        const labelElm = document.createElement("label")
        const checkboxElm = document.createElement("input")
        checkboxElm.type = "checkbox"
        checkboxElm.name = data.tracks[trackNum].id
        checkboxElm.setAttribute("data-trackNum", trackNum)
        checkboxElm.classList.add("bd-track-select")
        checkboxElm.style["margin-right"] = "8px"
        labelElm.innerText = trackNum + ". " + data.tracks[trackNum].title
        labelElm.prepend(checkboxElm)
        selectElm.append(labelElm)
    }

    const downloadButton = document.createElement("a")
    const statusTxt = document.createElement("p")
    logger(statusTxt, "Ready!")
    downloadButton.innerText = "Download"
    downloadButton.role = "button"
    downloadButton.classList.add("buy-link")
    downloadButton.onclick = async () => {
        if (state_isDownloading) return
        downloadButton.innerText = "Downloading..."
        document.querySelectorAll(".bd-track-select").forEach(v => v.setAttribute("disabled", ""))
        try {
            state_isDownloading = true
            await downloadData(data, statusTxt)
        } catch (e) {
            alert("A problem has occured! See console for more detail.")
            console.error(e)
        }
        state_isDownloading = false
        downloadButton.innerText = "Download"
        document.querySelectorAll(".bd-track-select").forEach(v => v.removeAttribute("disabled"))
    }

    if (ALBUM_REGEX.test(location.href)) {
        rootElm.append(headerTxt, infoTxt, selectElm, statusTxt, downloadButton)
    } else if (TRACK_REGEX.test(location.href)) {
        rootElm.append(headerTxt, infoTxt2, statusTxt, downloadButton)
    }
    afterElm.after(rootElm)
}

(async function() {
    'use strict';

    try {
        const albumData = JSON.parse(document.head.querySelector("script[data-tralbum]").getAttribute("data-tralbum"))
        const trackInfo = albumData.trackinfo
        log(`Loaded ${trackInfo.length} track(s)`)

        const data = {
            "album": albumData.current.title,
            "artist": albumData.artist,
            "release_year": new Date(albumData.current.release_date).getFullYear(),
            "art_id": albumData.art_id,
            "tracks": {}
        }
        for (const v of trackInfo) {
            data.tracks[v.track_num] = { "title": v.title, "link": v.file["mp3-128"], "id": v.track_id }
        }
        const elmToInsert = document.querySelector("#trackInfoInner .inline_player")
        createContainer(elmToInsert, data)
    } catch (e) {
        log("Error while loading track/album data", e)
    }
})();