// ==UserScript==
// @name         YouTube Screenshotter
// @namespace    https://www.youtube.com
// @version      2025-09-06
// @description  Takes a screenshot from a YouTube video in current quality, saves to the clipboard (Ctrl+Alt+Shift+Q) or a file (Ctrl+Alt+Shift+W).
// @author       CJMAXiK
// @license      MIT
// @match        https://www.youtube.com/watch*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @website      https://gist.github.com/cjmaxik/6211f5381c98fbd55267623de4650032
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548561/YouTube%20Screenshotter.user.js
// @updateURL https://update.greasyfork.org/scripts/548561/YouTube%20Screenshotter.meta.js
// ==/UserScript==

// SETTINGS
const slugifyTitle = false;
const screenshotTitle = "channelName"; // channelName (default), videoTitle, videoId

/**
 * @see https://byby.dev/js-slugify-string
 * @param {string} str
 */
function slugify(str) {
  if (!slugifyTitle) return str;

  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * @param {Blob} blob
 */
const saveToClipboard = (blob) => {
  try {
    navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    console.log("Screenshot copied to the clipboard!");
  } catch (err) {
    console.error("Clipboard is not accessible, saving to file instead", err);
    saveToFile(blob);
  }
};

/**
 * @param {Blob} blob
 */
const saveToFile = (blob) => {
  try {
    const data = {
      videoTitle: document
        .querySelector("ytd-watch-metadata #title > h1 > yt-formatted-string")
        .getAttribute("title"),
      videoId: new URL(window.location.href).searchParams.get("v"),
      channelName: document.querySelector("ytd-channel-name #text > a")
        .textContent,
    };
    const now = new Date();
    const currentTime = `${now.toDateString()} ${now.toLocaleTimeString()}`;

    const titlePrefix = data[screenshotTitle] ?? "Screenshot";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = slugify(`${titlePrefix} - ${currentTime}`) + ".png";
    link.click();
    URL.revokeObjectURL(link.href);

    console.log("Screenshot saved as a file!");
  } catch (err) {
    console.error("Save to file was unsuccessful", err);
  }
};

/**
 * @param {boolean} shouldDownload
 */
const screenshot = (shouldDownload) => {
  const video = document.querySelector("video");
  if (!video) throw new Error("Cannot find the video element, aborting...");

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (!blob) throw new Error("The blob is empty, aborting...");

    shouldDownload ? saveToFile(blob) : saveToClipboard(blob);
  });

  canvas.remove();
};

document.addEventListener("keydown", (e) => {
  // The shortcuts are:
  // - Ctrl+Alt+Shift+Q for clipboard
  // - Ctrl+Alt+Shift+W for file
  if (!e.ctrlKey || !e.altKey || !e.shiftKey) return;
  if (e.code !== "KeyQ" && e.code !== "KeyW") return;

  screenshot(e.code === "KeyW");
});
