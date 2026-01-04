// ==UserScript==
// @license MIT
// @name         Youtube Save/Resume Progress(L)
// @namespace    https://greasyfork.org/zh-TW/users/4839
// @version      1.5.7
// @description  Have you ever closed a YouTube video by accident, or have you gone to another one and when you come back the video starts from 0? With this extension it won't happen anymore
// @author       Costin Alexandru Sandu
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/SaurusLex/YoutubeSaveResumeProgress/refs/heads/master/youtube_save_resume_progress_icon.jpg
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/553979/Youtube%20SaveResume%20Progress%28L%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553979/Youtube%20SaveResume%20Progress%28L%29.meta.js
// ==/UserScript==
//https://greasyfork.org/zh-TW/scripts/487305
(function () {
  "strict";
  var configData = {
    sanitizer: null,
    savedProgressAlreadySet: false,
    savingInterval: 1000,
    currentVideoId: null,
    lastSaveTime: 0,

  };


  // ref: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  }

  /*function executeFnInPageContext(fn) {
    const fnStringified = fn.toString()
    return window.eval('(' + fnStringified + ')' + '()')
  }*/

  function getVideoCurrentTime() {
    const player = document.querySelector("#movie_player");
    const currentTime = player.getCurrentTime();

    return currentTime;
  }

  function getVideoName() {
    const player = document.querySelector("#movie_player");
    const videoName = player.getVideoData().title;

    return videoName;
  }

  function getVideoId() {
    if (configData.currentVideoId) {
      return configData.currentVideoId;
    }
    const player = document.querySelector("#movie_player");
    const id = player.getVideoData().video_id;

    return id;
  }

  function playerExists() {
    const player = document.querySelector("#movie_player");
    const exists = Boolean(player);

    return exists;
  }

  function setVideoProgress(progress) {
    const player = document.querySelector("#movie_player");

    player.seekTo(progress);
  }

  function updateLastSaved(videoProgress) {
    const lastSaveEl = document.querySelector(".last-save-info-text");
    const lastSaveText = `記憶${fancyTimeFormat(videoProgress)}`;
    // This is for browsers that support Trusted Types
    const lastSaveInnerHtml = configData.sanitizer
      ? configData.sanitizer.createHTML(lastSaveText)
      : lastSaveText;

    if (lastSaveEl) {
      lastSaveEl.innerHTML = lastSaveInnerHtml;
    }
  }

  function saveVideoProgress() {
    const videoProgress = getVideoCurrentTime();
    updateLastSaved(videoProgress);
    const videoId = getVideoId();

    configData.currentVideoId = videoId;
    configData.lastSaveTime = Date.now();
    const idToStore = "Youtube_SaveResume_Progress-" + videoId;
    const progressData = {
      videoProgress,
      saveDate: Date.now(),
      videoName: getVideoName(),
    };

    window.localStorage.setItem(idToStore, JSON.stringify(progressData));
  }
  function getSavedVideoList() {
    const savedVideoList = Object.entries(window.localStorage).filter(
      ([key, value]) => key.includes("Youtube_SaveResume_Progress-")
    );
    return savedVideoList;
  }

  function getSavedVideoProgress() {
    const videoId = getVideoId();
    const idToStore = "Youtube_SaveResume_Progress-" + videoId;
    const savedVideoData = window.localStorage.getItem(idToStore);
    const { videoProgress } = JSON.parse(savedVideoData) || {};

    return videoProgress;
  }

  function videoHasChapters() {
    const chaptersSection = document.querySelector(
      '.ytp-chapter-container[style=""]'
    );
    const chaptersSectionDisplay = getComputedStyle(chaptersSection).display;
    return chaptersSectionDisplay !== "none";
  }

  function setSavedProgress() {
    const savedProgress = getSavedVideoProgress();
    setVideoProgress(savedProgress);
    configData.savedProgressAlreadySet = true;
  }

  // code ref: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async function onPlayerElementExist(callback) {
    await waitForElm("#movie_player");
    callback();
  }

  function isReadyToSetSavedProgress() {
    return (
      !configData.savedProgressAlreadySet &&
      playerExists() &&
      getSavedVideoProgress()
    );
  }
  function insertInfoElement(element) {
    const leftControls = document.querySelector(".ytp-left-controls");
    leftControls.appendChild(element);
    const chaptersContainerElelement = document.querySelector(
      ".ytp-chapter-container"
    );
    chaptersContainerElelement.style.flexBasis = "auto";
  }



  function createInfoUI() {
    const infoElContainer = document.createElement("div");
    infoElContainer.classList.add("last-save-info-container");
    const infoElText = document.createElement("span");


    const infoEl = document.createElement("div");
    infoEl.classList.add("last-save-info");
    infoElText.textContent = "記憶...";
    infoElText.classList.add("last-save-info-text");
    infoEl.appendChild(infoElText);

    infoElContainer.style.all = "initial";
    infoElContainer.style.fontFamily = "inherit";
    infoElContainer.style.fontSize = "1.3rem";
    infoElContainer.style.marginLeft = "0.5rem";
    infoElContainer.style.display = "flex";
    infoElContainer.style.alignItems = "center";

    infoEl.style.textShadow = "none";
    infoEl.style.background = "none";
    infoEl.style.color = "white";
    infoEl.style.padding = ".5rem";
    infoEl.style.borderRadius = ".5rem";

    infoElContainer.appendChild(infoEl);

    return infoElContainer;
  }





  function sanitizeScriptUrl(url) {
    return configData.sanitizer ? configData.sanitizer.createScriptURL(url) : url;
  }



  function initializeUI() {
    const infoEl = createInfoUI();
    insertInfoElement(infoEl);



  }

  function initialize() {
    if (
      window.trustedTypes &&
      window.trustedTypes.createPolicy &&
      !window.trustedTypes.defaultPolicy
    ) {
      const sanitizer = window.trustedTypes.createPolicy("default", {
        createHTML: (string, sink) => string,
        createScript: (string, sink) => string,
        createScriptURL: (string, sink) => string,
      });

      configData.sanitizer = sanitizer;
    }

    onPlayerElementExist(() => {
      initializeUI();
      if (isReadyToSetSavedProgress()) {
        setSavedProgress();
      }
    });

    setInterval(saveVideoProgress, configData.savingInterval);
  }

  initialize();
})();
