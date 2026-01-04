// ==UserScript==
// @name         Local SoundCloud Downloader (with cover->ID3)
// @namespace    https://blog.maple3142.net/
// @version      0.2.1
// @description  Download SoundCloud without external service + embed cover art into MP3 ID3 metadata.
// @author       maple3142 + modified by ChatGPT
// @match        https://soundcloud.com/*
// @require      https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-id3-writer@4.0.0/dist/browser-id3-writer.min.js
// @grant        none
// @license      MIT
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @downloadURL  https://update.greasyfork.org/scripts/394837/Local%20SoundCloud%20Downloader.user.js
// @updateURL    https://update.greasyfork.org/scripts/394837/Local%20SoundCloud%20Downloader.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

streamSaver.mitm = "https://maple3142.github.io/StreamSaver.js/mitm.html";

function hook(obj, name, callback, type) {
    const fn = obj[name];
    obj[name] = function (...args) {
        if (type === "before") callback.apply(this, args);
        fn.apply(this, args);
        if (type === "after") callback.apply(this, args);
    };
    return () => {
        // restore
        obj[name] = fn;
    };
}

function triggerDownload(url, name) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = name;
    a.click();
    a.remove();
}

const btn = {
    init() {
        this.el = document.createElement("button");
        this.el.textContent = "Download";
        this.el.classList.add("sc-button");
        this.el.classList.add("sc-button-medium");
        this.el.classList.add("sc-button-icon");
        this.el.classList.add("sc-button-responsive");
        this.el.classList.add("sc-button-secondary");
        this.el.classList.add("sc-button-download");
    },
    cb() {
        const par = document.querySelector(".sc-button-toolbar .sc-button-group");
        if (par && this.el.parentElement !== par)
            par.insertAdjacentElement("beforeend", this.el);
    },
    attach() {
        this.detach();
        this.observer = new MutationObserver(this.cb.bind(this));
        this.observer.observe(document.body, { childList: true, subtree: true });
        this.cb();
    },
    detach() {
        if (this.observer) this.observer.disconnect();
    }
};

btn.init();

function getClientId() {
    return new Promise((resolve) => {
        const restore = hook(
            XMLHttpRequest.prototype,
            "open",
            function (method, url) {
                const u = new URL(url, document.baseURI);
                const clientId = u.searchParams.get("client_id");
                if (!clientId) return;
                console.log("got clientId", clientId);
                restore();
                resolve(clientId);
            },
            "after"
        );
    });
}

const clientIdPromise = getClientId();
let controller = null;

// helper: try to build best artwork url
function artworkBestUrl(track) {
    // track.artwork_url often contains e.g. -large.jpg ; try t500x500 or original; fallback to user avatar
    let art = track.artwork_url || (track.user && track.user.avatar_url) || null;
    if (
        !art &&
        track.publisher_metadata &&
        track.publisher_metadata.artwork &&
        track.publisher_metadata.artwork.url
    ) {
        art = track.publisher_metadata.artwork.url;
    }
    if (!art) return null;
    // replace size placeholders commonly used by SoundCloud
    return art.replace("-large", "-t500x500").replace("-crop", "-t500x500");
}

// fetch arrayBuffer with simple error handling
async function fetchArrayBuffer(url, signal) {
    const resp = await fetch(url, { signal });
    if (!resp.ok) throw new Error("Fetch failed: " + resp.status);
    return resp.arrayBuffer();
}

async function load(by) {
    btn.detach();
    console.log("load by", by, location.href);
    if (
        /^(\/(you|stations|discover|stream|upload|search|settings))/.test(
            location.pathname
        )
    )
        return;
    const clientId = await clientIdPromise;
    if (controller) {
        controller.abort();
        controller = null;
    }
    controller = new AbortController();
    const result = await fetch(
        `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(
            location.href
        )}&client_id=${clientId}`,
        { signal: controller.signal }
    )
        .then((r) => r.json())
        .catch((e) => {
            console.warn("resolve failed", e);
            return {};
        });
    console.log("result", result);
    if (result.kind !== "track") return;
    btn.el.onclick = async () => {
        try {
            const progressive =
                result.media &&
                result.media.transcodings &&
                result.media.transcodings.find(
                    (t) => t.format && t.format.protocol === "progressive"
                );
            if (!progressive) {
                alert("Sorry, downloading this music is currently unsupported.");
                return;
            }
            // get the actual progressive audio URL
            const { url } = await fetch(
                progressive.url + `?client_id=${clientId}`
            ).then((r) => r.json());
            // fetch audio as ArrayBuffer (required to write ID3)
            const audioBuf = await fetchArrayBuffer(url);
            // try to fetch artwork
            let coverBuf = null;
            const artUrl = artworkBestUrl(result);
            if (artUrl) {
                try {
                    // SoundCloud sometimes returns SVG/other or redirects — let errors be caught
                    coverBuf = await fetchArrayBuffer(artUrl);
                } catch (e) {
                    console.warn("cover fetch failed", e);
                    coverBuf = null;
                }
            }

            // Use browser-id3-writer to set tags
            // ID3Writer is provided by browser-id3-writer (required at top)
            let filename = (result.title || "track") + ".mp3";
            // sanitize filename a bit
            filename = filename.replace(/[\/\\?%*:|"<>]/g, "_");

            let taggedBlob = null;
            try {
                const writer = new ID3Writer(audioBuf);
                // Basic tags
                if (result.title) writer.setFrame("TIT2", result.title);
                if (result.user && result.user.username)
                    writer.setFrame("TPE1", [result.user.username]);
                if (
                    result.publisher_metadata &&
                    result.publisher_metadata.album_title
                ) {
                    writer.setFrame("TALB", result.publisher_metadata.album_title);
                } else if (result.title) {
                    // optional: nothing
                }
                // add cover if available
                if (coverBuf) {
                    // attempt to detect mime from first bytes (jpeg/png)
                    let mime = "image/jpeg"; // default
                    const dv = new Uint8Array(coverBuf);
                    if (dv[0] === 0x89 && dv[1] === 0x50 && dv[2] === 0x4e)
                        mime = "image/png";
                    writer.setFrame("APIC", {
                        type: 3,
                        data: coverBuf,
                        description: "Cover",
                        mime: mime
                    });
                }
                writer.addTag();
                taggedBlob = writer.getBlob();
            } catch (e) {
                console.warn("ID3 tagging failed, falling back to raw file", e);
                // if tagging failed, fallback to raw audio
                taggedBlob = new Blob([audioBuf], { type: "audio/mpeg" });
            }

            // Attempt to save using StreamSaver (good for large files)
            // Note: StreamSaver supports streaming a blob stream to disk: taggedBlob.stream()
            try {
                const fileStream = streamSaver.createWriteStream(filename, {
                    size: taggedBlob.size
                });
                // Use readable stream from blob and pipe to streamSaver
                const readable = taggedBlob.stream();
                if (readable.pipeTo) {
                    await readable.pipeTo(fileStream);
                } else {
                    // fallback: manual pump
                    const reader = readable.getReader();
                    const writer = fileStream.getWriter();
                    const pump = () =>
                        reader
                            .read()
                            .then(({ done, value }) =>
                                done ? writer.close() : writer.write(value).then(pump)
                            );
                    await pump();
                }
            } catch (e) {
                // fallback to normal download via object URL
                console.warn("StreamSaver failed, fallback to anchor download", e);
                const urlObj = URL.createObjectURL(taggedBlob);
                triggerDownload(urlObj, filename);
                // release object URL after a while
                setTimeout(() => URL.revokeObjectURL(urlObj), 60 * 1000);
            }
        } catch (err) {
            console.error("Download failed", err);
            alert("Download error: " + (err.message || err));
        }
    };
    btn.attach();
    console.log("attached");
}

load("init");
hook(history, "pushState", () => load("pushState"), "after");
window.addEventListener("popstate", () => load("popstate"));