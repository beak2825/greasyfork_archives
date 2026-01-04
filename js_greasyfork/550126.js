// ==UserScript==
// @name         Local SoundCloud Downloader (single + playlist ZIP + cover art)
// @namespace    https://drumkits4.me/
// @version      0.6.0
// @license MIT
// @description  Download SoundCloud tracks individually or playlists as ZIP archives with cover art
// @author       83 (modified maple3142, optimized with ZIP support)
// @match        https://soundcloud.com/*
// @require      https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @downloadURL https://update.greasyfork.org/scripts/550126/Local%20SoundCloud%20Downloader%20%28single%20%2B%20playlist%20ZIP%20%2B%20cover%20art%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550126/Local%20SoundCloud%20Downloader%20%28single%20%2B%20playlist%20ZIP%20%2B%20cover%20art%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  streamSaver.mitm = "https://maple3142.github.io/StreamSaver.js/mitm.html";

  // Cache for storing resolved URLs and client ID
  const cache = {
    clientId: null,
    resolvedUrls: new Map(),
    trackCache: new Map(),
  };

  // Constants for better maintainability
  const CONSTANTS = {
    DELAY_BETWEEN_DOWNLOADS: 500,
    CACHE_TTL: 30 * 60 * 1000, // 30 minutes
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    FILENAME_SANITIZE_REGEX: /[\\/:"*?<>|]+/g,
    IGNORED_PATHS:
      /^\/(?:you|stations|discover|stream|upload|search|settings)(?:\/|$)/,
    ZIP_COMPRESSION_LEVEL: 6, // 0-9, higher = better compression but slower
  };

  function hook(obj, name, callback, type = "after") {
    const fn = obj[name];
    if (!fn) return () => {};

    obj[name] = function (...args) {
      const result = type === "before" ? callback.apply(this, args) : undefined;
      const fnResult = fn.apply(this, args);
      if (type === "after") callback.apply(this, args);
      return result !== undefined ? result : fnResult;
    };

    return () => {
      obj[name] = fn;
    };
  }

  function makeButton(label, variant = "secondary") {
    const el = document.createElement("button");
    el.textContent = label;
    el.className = `sc-button sc-button-medium sc-button-icon sc-button-responsive sc-button-${variant} sc-button-download`;
    return el;
  }

  async function getClientId() {
    if (cache.clientId) return cache.clientId;

    return new Promise((resolve) => {
      const restore = hook(
        XMLHttpRequest.prototype,
        "open",
        (method, url) => {
          try {
            const u = new URL(url, document.baseURI);
            const clientId = u.searchParams.get("client_id");
            if (clientId) {
              console.log("Client ID obtained:", clientId);
              cache.clientId = clientId;
              restore();
              resolve(clientId);
            }
          } catch (e) {
            console.error("Error extracting client ID:", e);
          }
        },
        "after"
      );
    });
  }

  const clientIdPromise = getClientId();
  let controller = null;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function sanitizeFilename(name) {
    return (
      name.replace(CONSTANTS.FILENAME_SANITIZE_REGEX, "").trim() || "untitled"
    );
  }

  async function fetchWithRetry(
    url,
    options = {},
    retries = CONSTANTS.MAX_RETRIES
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        if (response.status === 404) throw new Error("Resource not found");
        if (i === retries - 1) throw new Error(`HTTP ${response.status}`);
      } catch (err) {
        if (i === retries - 1) throw err;
        console.warn(`Retry ${i + 1}/${retries} for ${url}`);
        await sleep(CONSTANTS.RETRY_DELAY * (i + 1));
      }
    }
  }

  async function downloadStreamToFile(fetchUrl, filename) {
    try {
      const resp = await fetchWithRetry(fetchUrl);
      const contentLength = resp.headers.get("Content-Length");
      const ws = streamSaver.createWriteStream(filename, {
        size: contentLength ? Number(contentLength) : undefined,
      });

      const rs = resp.body;
      if (!rs) throw new Error("No response body");

      if (rs.pipeTo) {
        return rs.pipeTo(ws);
      }

      // Fallback for browsers without pipeTo
      const reader = rs.getReader();
      const writer = ws.getWriter();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
        await writer.close();
      } catch (err) {
        writer.abort();
        throw err;
      }
    } catch (err) {
      console.error(`Download failed for ${filename}:`, err);
      throw err;
    }
  }

  async function fetchAsArrayBuffer(url) {
    const response = await fetchWithRetry(url);
    return response.arrayBuffer();
  }

  async function resolveTranscodingUrl(transcoding, clientId) {
    const cacheKey = `${transcoding.url}_${clientId}`;

    if (cache.resolvedUrls.has(cacheKey)) {
      const cached = cache.resolvedUrls.get(cacheKey);
      if (Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return cached.url;
      }
      cache.resolvedUrls.delete(cacheKey);
    }

    const fetchUrl = `${transcoding.url}?client_id=${clientId}`;
    const res = await fetchWithRetry(fetchUrl);
    const json = await res.json();

    cache.resolvedUrls.set(cacheKey, {
      url: json.url,
      timestamp: Date.now(),
    });

    return json.url;
  }

  async function fetchFullTrack(id, clientId) {
    if (cache.trackCache.has(id)) {
      const cached = cache.trackCache.get(id);
      if (Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return cached.data;
      }
      cache.trackCache.delete(id);
    }

    const url = `https://api-v2.soundcloud.com/tracks/${id}?client_id=${clientId}`;
    const res = await fetchWithRetry(url);
    const data = await res.json();

    cache.trackCache.set(id, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  async function getTrackArrayBuffer(track, clientId) {
    // Ensure we have full track data with media
    if (!track.media?.transcodings?.length) {
      console.log(`Track ${track.id} incomplete, fetching full data...`);
      track = await fetchFullTrack(track.id, clientId);
    }

    // Prefer progressive download over HLS
    const progressive = track.media.transcodings.find(
      (t) => t.format?.protocol === "progressive"
    );

    if (!progressive) {
      // Fallback to HLS if no progressive available
      const hls = track.media.transcodings.find(
        (t) => t.format?.protocol === "hls"
      );
      if (!hls) {
        throw new Error("No suitable transcoding format available");
      }
      console.warn(
        `Using HLS format for ${track.title} (progressive not available)`
      );
    }

    const transcoding = progressive || track.media.transcodings[0];
    const actualUrl = await resolveTranscodingUrl(transcoding, clientId);

    return fetchAsArrayBuffer(actualUrl);
  }

  async function downloadTrackObject(track, clientId) {
    const buffer = await getTrackArrayBuffer(track, clientId);
    const cleanTitle = sanitizeFilename(track.title || `track-${track.id}`);
    const filename = `${cleanTitle}.mp3`;

    // Convert ArrayBuffer to Blob for download
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const ws = streamSaver.createWriteStream(filename, {
      size: blob.size,
    });

    const readableStream = blob.stream();
    await readableStream.pipeTo(ws);

    return filename;
  }

  async function getCoverArtBuffer(track) {
    let artUrl = null;

    // Priority 1: API artwork_url with highest quality
    if (track.artwork_url) {
      artUrl = track.artwork_url
        .replace("-large", "-t1080x1080")
        .replace("-small", "-t1080x1080")
        .replace("-badge", "-t1080x1080");
    }

    // Priority 2: Check DOM for artwork
    if (!artUrl) {
      const artSelectors = [
        ".sc-artwork[style*='background-image']",
        ".image__full[style*='background-image']",
        ".artwork[style*='background-image']",
      ];

      for (const selector of artSelectors) {
        const artEl = document.querySelector(selector);
        if (artEl) {
          const bg = artEl.style.backgroundImage;
          const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) {
            artUrl = match[1];
            break;
          }
        }
      }
    }

    if (!artUrl) return null;

    try {
      return await fetchAsArrayBuffer(artUrl);
    } catch (err) {
      console.warn("Could not fetch cover art:", err);
      return null;
    }
  }

  async function downloadCoverArt(track) {
    try {
      const buffer = await getCoverArtBuffer(track);
      if (!buffer) throw new Error("No cover art found");

      const cleanTitle = sanitizeFilename(track.title || `cover-${track.id}`);
      const filename = `${cleanTitle}-cover.jpg`;

      const blob = new Blob([buffer], { type: "image/jpeg" });
      const ws = streamSaver.createWriteStream(filename, {
        size: blob.size,
      });

      const readableStream = blob.stream();
      await readableStream.pipeTo(ws);

      console.log("Cover art downloaded:", filename);
      return filename;
    } catch (err) {
      console.error("Cover art download failed:", err);
      throw new Error(`Cover download failed: ${err.message}`);
    }
  }

  async function downloadPlaylistAsZip(result, clientId, progressCallback) {
    const zip = new JSZip();
    const playlistName = sanitizeFilename(
      result.title || "SoundCloud_Playlist"
    );
    const failed = [];
    const trackCount = result.tracks.length;

    // Try to add playlist cover art
    try {
      const coverBuffer = await getCoverArtBuffer(result);
      if (coverBuffer) {
        zip.file(`${playlistName}_cover.jpg`, coverBuffer);
        console.log("Added playlist cover to ZIP");
      }
    } catch (err) {
      console.warn("Could not add playlist cover:", err);
    }

    // Create a folder for tracks
    const tracksFolder = zip.folder("tracks");

    // Download all tracks
    for (let i = 0; i < trackCount; i++) {
      const track = result.tracks[i];
      const trackTitle = track.title || `Track ${track.id}`;

      if (progressCallback) {
        progressCallback(i + 1, trackCount, trackTitle);
      }

      console.log(`[${i + 1}/${trackCount}] Downloading: ${trackTitle}`);

      try {
        const buffer = await getTrackArrayBuffer(track, clientId);
        const cleanTitle = sanitizeFilename(trackTitle);

        // Add track number prefix for proper ordering
        const paddedNumber = String(i + 1).padStart(3, "0");
        const filename = `${paddedNumber}_${cleanTitle}.mp3`;

        tracksFolder.file(filename, buffer);
        console.log(`[${i + 1}/${trackCount}] ✓ Added to ZIP: ${filename}`);
      } catch (err) {
        console.warn(`[${i + 1}/${trackCount}] ✗ Failed: ${trackTitle}`, err);
        failed.push({
          index: i + 1,
          title: trackTitle,
          reason: err.message || String(err),
        });
      }

      // Small delay to avoid rate limiting
      if (i < trackCount - 1) {
        await sleep(CONSTANTS.DELAY_BETWEEN_DOWNLOADS);
      }
    }

    // Add a text file with track listing and any failures
    let infoContent = `${playlistName}\n${"=".repeat(playlistName.length)}\n\n`;
    infoContent += `Total Tracks: ${trackCount}\n`;
    infoContent += `Successfully Downloaded: ${trackCount - failed.length}\n`;
    infoContent += `Failed: ${failed.length}\n\n`;

    infoContent += "Track Listing:\n" + "-".repeat(30) + "\n";
    result.tracks.forEach((track, i) => {
      const status = failed.some((f) => f.index === i + 1) ? " [FAILED]" : "";
      infoContent += `${i + 1}. ${
        track.title || `Track ${track.id}`
      }${status}\n`;
    });

    if (failed.length > 0) {
      infoContent += "\n\nFailed Downloads:\n" + "-".repeat(30) + "\n";
      failed.forEach((f) => {
        infoContent += `${f.index}. ${f.title}\n   Reason: ${f.reason}\n\n`;
      });
    }

    zip.file("playlist_info.txt", infoContent);

    // Generate and download the ZIP file
    console.log("Generating ZIP file...");
    const blob = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: CONSTANTS.ZIP_COMPRESSION_LEVEL,
        },
      },
      (metadata) => {
        if (progressCallback && metadata.percent) {
          progressCallback(
            -1,
            -1,
            `Creating ZIP: ${Math.round(metadata.percent)}%`
          );
        }
      }
    );

    // Download the ZIP file
    const zipFilename = `${playlistName}.zip`;
    const ws = streamSaver.createWriteStream(zipFilename, {
      size: blob.size,
    });

    const readableStream = blob.stream();
    await readableStream.pipeTo(ws);

    return {
      filename: zipFilename,
      failed,
      totalSize: blob.size,
      successCount: trackCount - failed.length,
    };
  }

  async function createDownloadUI(result, clientId, toolbar) {
    // Remove existing download buttons
    toolbar.querySelectorAll(".sc-button-download").forEach((b) => b.remove());

    if (result.kind === "track") {
      const dlBtn = makeButton("Download");
      const coverBtn = makeButton("Cover");

      dlBtn.onclick = async () => {
        dlBtn.disabled = true;
        dlBtn.textContent = "Downloading...";
        try {
          const filename = await downloadTrackObject(result, clientId);
          dlBtn.textContent = "✓ Downloaded";
          setTimeout(() => {
            dlBtn.textContent = "Download";
            dlBtn.disabled = false;
          }, 2000);
        } catch (err) {
          console.error("Track download failed:", err);
          alert(`Download failed: ${err.message}`);
          dlBtn.textContent = "Download";
          dlBtn.disabled = false;
        }
      };

      coverBtn.onclick = async () => {
        coverBtn.disabled = true;
        coverBtn.textContent = "Getting...";
        try {
          await downloadCoverArt(result);
          coverBtn.textContent = "✓ Done";
          setTimeout(() => {
            coverBtn.textContent = "Cover";
            coverBtn.disabled = false;
          }, 2000);
        } catch (err) {
          alert(err.message);
          coverBtn.textContent = "Cover";
          coverBtn.disabled = false;
        }
      };

      toolbar.append(dlBtn, coverBtn);
      console.log("Single track downloader attached");
    } else if (result.kind === "playlist") {
      const dlZipBtn = makeButton("Download ZIP");
      const coverBtn = makeButton("Cover");

      dlZipBtn.onclick = async () => {
        const trackCount = result.tracks.length;
        const playlistTitle = result.title || "playlist";

        if (
          !confirm(
            `Download ${trackCount} tracks from "${playlistTitle}" as a ZIP file?\n\n` +
              `This will bundle all tracks into a single compressed archive.`
          )
        ) {
          return;
        }

        dlZipBtn.disabled = true;
        const originalText = dlZipBtn.textContent;
        const startTime = Date.now();

        try {
          const zipResult = await downloadPlaylistAsZip(
            result,
            clientId,
            (current, total, status) => {
              if (current === -1) {
                // ZIP generation progress
                dlZipBtn.textContent = status;
              } else {
                // Track download progress
                dlZipBtn.textContent = `${current}/${total}...`;
              }
            }
          );

          const elapsedTime = Math.round((Date.now() - startTime) / 1000);
          const sizeMB = (zipResult.totalSize / (1024 * 1024)).toFixed(2);

          if (zipResult.failed.length === 0) {
            alert(
              `✓ ZIP downloaded successfully!\n\n` +
                `File: ${zipResult.filename}\n` +
                `Tracks: ${zipResult.successCount}\n` +
                `Size: ${sizeMB} MB\n` +
                `Time: ${elapsedTime}s`
            );
          } else {
            const failedDetails = zipResult.failed
              .slice(0, 3)
              .map((f) => `• Track ${f.index}: ${f.title}`)
              .join("\n");
            const moreText =
              zipResult.failed.length > 3
                ? `\n...and ${
                    zipResult.failed.length - 3
                  } more (see playlist_info.txt in ZIP)`
                : "";

            alert(
              `ZIP downloaded with some failures\n\n` +
                `File: ${zipResult.filename}\n` +
                `Success: ${zipResult.successCount}/${trackCount} tracks\n` +
                `Failed: ${zipResult.failed.length}\n` +
                `Size: ${sizeMB} MB\n` +
                `Time: ${elapsedTime}s\n\n` +
                `Failed tracks:\n${failedDetails}${moreText}`
            );
            console.table(zipResult.failed);
          }
        } catch (err) {
          console.error("ZIP creation failed:", err);
          alert(`ZIP download failed: ${err.message}`);
        } finally {
          dlZipBtn.textContent = originalText;
          dlZipBtn.disabled = false;
        }
      };

      coverBtn.onclick = async () => {
        coverBtn.disabled = true;
        coverBtn.textContent = "Getting...";
        try {
          await downloadCoverArt(result);
          coverBtn.textContent = "✓ Done";
          setTimeout(() => {
            coverBtn.textContent = "Cover";
            coverBtn.disabled = false;
          }, 2000);
        } catch (err) {
          alert(err.message);
          coverBtn.textContent = "Cover";
          coverBtn.disabled = false;
        }
      };

      toolbar.append(dlZipBtn, coverBtn);
      console.log(`Playlist ZIP downloader attached (${trackCount} tracks)`);
    }
  }

  async function load(trigger) {
    console.log(`Loading (triggered by: ${trigger})`, location.href);

    // Skip non-content pages
    if (CONSTANTS.IGNORED_PATHS.test(location.pathname)) {
      console.log("Skipping non-content page");
      return;
    }

    try {
      const clientId = await clientIdPromise;

      // Cancel any pending operations
      if (controller) {
        controller.abort();
      }
      controller = new AbortController();

      const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(
        location.href
      )}&client_id=${clientId}`;

      const result = await fetchWithRetry(resolveUrl, {
        signal: controller.signal,
      }).then((r) => r.json());

      console.log("Resolved result:", result);

      // Wait for toolbar to be available
      let toolbar = document.querySelector(
        ".sc-button-toolbar .sc-button-group"
      );
      if (!toolbar) {
        // Try waiting for toolbar to appear
        await sleep(1000);
        toolbar = document.querySelector(".sc-button-toolbar .sc-button-group");
      }

      if (!toolbar) {
        console.warn("Toolbar not found, retrying in 2s...");
        setTimeout(() => load("retry"), 2000);
        return;
      }

      await createDownloadUI(result, clientId, toolbar);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Operation aborted");
      } else {
        console.error("Load error:", err);
      }
    }
  }

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => load("init"));
  } else {
    load("init");
  }

  // Listen for navigation changes
  hook(history, "pushState", () => load("pushState"), "after");
  window.addEventListener("popstate", () => load("popstate"));

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (controller) controller.abort();
  });

  console.log("SoundCloud Downloader v0.6.0 (ZIP) initialized");
})();