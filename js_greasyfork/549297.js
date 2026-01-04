// ==UserScript==
// @name         Screen Recorder
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      1.2
// @description  chromium-based only
// @author       ぐらんぴ
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource     alertifyCSS  https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css
// @resource     alertifyTheme https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css
// @resource     alertifyJS https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549297/Screen%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/549297/Screen%20Recorder.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("alertifyCSS"))
GM_addStyle(GM_getResourceText("alertifyTheme"))

const alertifyScript = GM_getResourceText("alertifyJS")
const scriptTag = document.createElement("script")
scriptTag.textContent = alertifyScript
document.head.appendChild(scriptTag)

let recorder, chunks = [], isRecording = false
let combinedStream, logInterval, startTime
const registeredVideos = new WeakSet()

const $C = (tag, props = {}, styles = {}) => {
    const el = document.createElement(tag)
    Object.assign(el, props)
    Object.assign(el.style, styles)
    return el
}

const settings = {
    videoBitsPerSecond: 20000000,      // 20 Mbps
    frameRate: { ideal: 60, max: 120 },// { ideal: 30, max: 60 }, { ideal: 60, max: 120 }
    cursor: "always",                  // motion, never
    mimeType: undefined,               //'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'
}

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox")

async function videoRecord(videoEl) {
    try {
        const videoStream = isFirefox
            ? videoEl.mozCaptureStream(settings.frameRate.ideal)
            : videoEl.captureStream(settings.frameRate.ideal)

        const audioCtx = new AudioContext()
        const srcNode = audioCtx.createMediaElementSource(videoEl)
        const destNode = audioCtx.createMediaStreamDestination()
        srcNode.connect(destNode)
        srcNode.connect(audioCtx.destination)

        let micStream = null
        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (e) {
            console.warn("Mic access failed:", e)
        }

        const tracks = [
            ...videoStream.getVideoTracks(),
            ...destNode.stream.getAudioTracks(),
            ...(micStream ? micStream.getAudioTracks() : [])
        ]
        combinedStream = new MediaStream(tracks)

        startRecorder()
        alertify.notify("📹 Video recording started", "success", 5)
    } catch (err) {
        alertify.alert("Video record failed: " + (err && err.message ? err.message : err))
        console.error("Video record failed:", err)
    }
}

async function screenRecord() {
    try {
        const constraints = {
            video: { cursor: settings.cursor, frameRate: settings.frameRate },
            audio: isFirefox ? false : true
        }
        const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints)

        let micStream = null
        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (e) {
            console.warn("Mic access failed:", e)
        }

        const tracks = [
            ...displayStream.getVideoTracks(),
            ...displayStream.getAudioTracks(),
            ...(micStream ? micStream.getAudioTracks() : [])
        ]
        combinedStream = new MediaStream(tracks)

        startRecorder()
        alertify.notify("📺 Screen recording started", "success", 5)
    } catch (err) {
        alertify.alert("Screen record failed: " + (err && err.message ? err.message : err))
        console.error("Screen record failed:", err)
    }
}

function startRecorder() {
    const mimeCandidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
    ];

    let mime = null;
    if (settings.mimeType) {
        try {
            if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(settings.mimeType)) {
                mime = settings.mimeType;
            }
        } catch (e) {}
    }

    if (!mime) {
        for (const m of mimeCandidates) {
            try {
                if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; }
            } catch (err) {}
        }
    }

    const bps = Number(settings.videoBitsPerSecond) || undefined;
    const options = mime
        ? { mimeType: mime, bitsPerSecond: bps }
        : (bps ? { bitsPerSecond: bps } : undefined);

    try {
        recorder = options ? new MediaRecorder(combinedStream, options) : new MediaRecorder(combinedStream);
    } catch (err) {
        console.warn("MediaRecorder new failed with options, retrying without options:", err);
        recorder = new MediaRecorder(combinedStream);
    }

    chunks = [];

    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }
    recorder.onstop = saveRecording
    recorder.start(1000)

    startTime = Date.now()
    logInterval = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        const sizeMB = (chunks.reduce((sum, c) => sum + c.size, 0) / (1024 * 1024)).toFixed(2)
        console.log(`⏱️ ${elapsed}s elapsed, 💾 ${sizeMB} MB recorded`)
    }, 10000)

    isRecording = true
}

function stopCapture() {
    if (!recorder || recorder.state === "inactive") return
    recorder.stop()
    if (combinedStream) combinedStream.getTracks().forEach(t => t.stop())
    clearInterval(logInterval)
    isRecording = false
    console.log("⏹️ Recording stopped")
}

function saveRecording() {
    const defaultName = `${new Date().toISOString().replace(/[:.]/g, "-")}`
    const filename = prompt("Enter filename:", defaultName) || defaultName

    let blobType = 'video/webm'
    try {
        if (recorder && recorder.mimeType) blobType = recorder.mimeType
    } catch (e) {}

    const blob = new Blob(chunks, { type: blobType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    chunks = []
    console.log(`💾 Saved: ${filename}.webm`)
}

// Firefox only: show floating button
function createScreenRecButton() {
    const btn = $C("button", {
        textContent: "🖥️ Screen REC/SAVE",
        onclick: () => isRecording ? stopCapture() : screenRecord()
    }, {
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: "9999",
        padding: "8px 12px",
        fontSize: "14px",
        background: "#444",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    })

    document.body.appendChild(btn)
}

if (!isFirefox) {
    GM_registerMenuCommand("🖥️ Screen REC/SAVE", () => {
        isRecording ? stopCapture() : screenRecord()
    })
} else {
    createScreenRecButton()
}

setInterval(() => {
    document.querySelectorAll("video").forEach((videoEl, i) => {
        if (registeredVideos.has(videoEl)) return

        const label = videoEl.getAttribute("title") || videoEl.getAttribute("aria-label") || `Video ${i + 1}`
        GM_registerMenuCommand(`🎥 Video REC/SAVE: ${label}`, () => {
            isRecording ? stopCapture() : videoRecord(videoEl)
        })

        registeredVideos.add(videoEl)
        console.log(`🆕 Registered video: ${label}`)
    })
}, 5000)