// ==UserScript==
// @name        Persist video playback time
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @version     2.0
// @author      SHA
// @license     GNU GPLv3
// @description 19/07/2025, 16:12:36
// @downloadURL https://update.greasyfork.org/scripts/563173/Persist%20video%20playback%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/563173/Persist%20video%20playback%20time.meta.js
// ==/UserScript==

// (async () => {
//   for (let p of await GM.listValues()) {
//     if (p.startsWith('log ')) {
//       await GM.deleteValue(p);
//     }
//   }
// })();

class Video {
  id;
  element;
  currentTimeInterval;

  static async fromThisPage() {
    const video = new Video();
    await video.findElementAndId();
    return video;
  }

  async findElementAndId() {
    return new Promise((resolve, reject) => {
      const searchForVideo = () => {
        this.setElementFromDocument();
        if (this.element) {
          this.setIdFromUrl();
          resolve(true);
        } else {
          setTimeout(searchForVideo, 250);
        }
      };
      searchForVideo();
    });
  }

  setElementFromDocument() {
    this.element = document.querySelector("#primary video");
  }

  setIdFromUrl() {
    this.id = new URL(window.location.href).searchParams.get("v");
  }

  startSavingCurrentTime() {
    this.currentTimeInterval = setInterval(() => {
      this.storeCurrentTime();
    }, 5000);
  }

  stopSavingCurrentTime() {
    clearInterval(this.currentTimeInterval);
  }

  async storeCurrentTime() {
    let currentTime = this.element?.currentTime;
    if (!Number.isFinite(currentTime)) return;

    if (currentTime >= 5) {
      await GM.setValue(this.id, Math.floor(currentTime));
    }
    if (currentTime >= this.element.duration - 5) {
      //await GM.setValue(`log deleted ${this.id} at ${new Date()} `, {
      //  currentTime: this.element?.currentTime,
      //  duration: this.element?.duration,
      //});
      await GM.deleteValue(this.id);
    }
  }

  async seekStoredTime() {
    const savedTime = await GM.getValue(this.id);
    if (savedTime) {
      if (this.element.fastSeek) {
        this.element.fastSeek(savedTime);
      } else {
        this.element.currentTime = savedTime;
      }
    }
  }
}

let video = new Video();
console.log("script loaded: Persist video playback time");

const pageHasVideo = () => {
  return window.location.href.includes("watch");
};

const startVideoPlaybackTimePersistence = async () => {
  await video.findElementAndId();
  await video.seekStoredTime();
  video.startSavingCurrentTime();
};

window.addEventListener("load", (event) => {
  if (pageHasVideo()) {
    startVideoPlaybackTimePersistence();
  }
});

window.addEventListener("beforeunload", async (event) => {
  video?.stopSavingCurrentTime();
});

window.addEventListener("popstate", (event) => {
  if (pageHasVideo()) {
    startVideoPlaybackTimePersistence();
  } else {
    video?.stopSavingCurrentTime();
  }
});
