// ==UserScript==
// @name         better-bh
// @namespace    ocalectu/better-bh
// @version      0.0.1
// @description  Adds useful QoL features when browsing boundhub
// @license      GNU GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAnFBMVEUaGhoaHB0bGxsaGxwbFRMcDwoQEhWghlsUFRf/2o6tkGFMQzMNW3oZHiAMDxMMYYIIeKQFh7phUz2lj2HGpG3SrnOXf1cABA1qWkEyLSY8Niu7nGmzlWUbFxX1yoX804r/5pV2ZEcNbpMRSF4jIh//3ZBeTDQAjMsHg7QAfrvEo2zjvn0SWXQeAwAIdJ7qx4J8aUmHck8DkccBmdXThxiHAAAAt0lEQVQYlT2O2xaCIBREj3JAVAJNydTK7Iqplfn//xZWth/3mjUzsPQsSw5/Ej9Ntb9i7iyCW8azdZXz2QSpFXlVfAUhEOgiDMsNw601LiJ4/m5X7Wt5OKJDUCibOOV5fb5cFXUcaoztkACZDhpBFwsaRdOKlLL1mq6ntL8bSB7PYUj9IjZCKfGKYNC6bcuQxWNsGe/AOWNMMnyJHnHqcL9Y8Sv9MQk7+xcEx8+PyMyJrToiIdiJN5hDDp5C9Lj9AAAAAElFTkSuQmCC
// @match        https://www.boundhub.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560362/better-bh.user.js
// @updateURL https://update.greasyfork.org/scripts/560362/better-bh.meta.js
// ==/UserScript==

(function (JSZip) {
  'use strict';

  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_download = (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var ContainerType = ((ContainerType2) => {
    ContainerType2["ALBUM"] = "album";
    ContainerType2["VIDEO"] = "video";
    ContainerType2["CATEGORY"] = "category";
    ContainerType2["MESSAGES"] = "messages";
    ContainerType2["CONVERSATIONS"] = "conversations";
    return ContainerType2;
  })(ContainerType || {});
  const HOSTNAME = "http://localhost:3000";
  const DELAY = 1e3;
  const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const settingKeys = {
    hostname: "hostname",
    hideAds: "hide-ads",
    scrape: "scrape",
    unhidePrivate: "unhide-private"
  };
  const settingValues = [
    {
      key: settingKeys.scrape,
      title: "Scrape on browse",
      type: "boolean",
      default: false
    },
    {
      key: settingKeys.hostname,
      title: "Scrape Destination Hostname",
      type: "string",
      default: HOSTNAME
    },
    {
      key: settingKeys.hideAds,
      title: "Hide Ads (doesn't affect video player)",
      type: "boolean",
      default: false
    },
    {
      key: settingKeys.unhidePrivate,
      title: "Make private videos easier to see",
      type: "boolean",
      default: true
    }
  ];
  const settingDefaults = settingValues.reduce((prev, item) => ({ ...prev, [item.key]: item.default }), {});
  const PREFIX = "better-bh";
  const videoContainerIds = {
    list: "list_videos_most_recent_videos",
    popular: "list_videos_videos_watched_right_now_items",
    latest: "list_videos_latest_videos_list",
    common: "list_videos_common_videos_list",
    favorite: "list_videos_favourite_videos",
    uploaded: "list_videos_uploaded_videos",
    related: "list_videos_related_videos",
    private: "list_videos_private_videos"
  };
  const singleVideoId = "tab_video_info";
  const singleAlbumId = "tab_album_info";
  const videoCommentId = "video_comments_video_comments_items";
  const albumCommentId = "album_comments_album_comments_items";
  const categoryContainerIds = {
    list: "list_categories_categories_list_items"
  };
  const messagesContainerIds = {
    messages: "list_messages_my_conversation_messages_items"
  };
  const conversationsContainerIds = {
    conversations: "list_members_my_conversations"
  };
  const albumContainerIds = {
    common: "list_albums_common_albums_list",
    related: "list_albums_related_albums",
    private: "list_albums_private_albums",
    favorite: "list_albums_my_favourite_albums",
    uploaded: "list_albums_created_albums"
  };
  const pageDefinitions = {
    videos: {
      segmentMatch: ["/videos", ""],
      containerIds: [
        {
          id: videoContainerIds.list,
          type: ContainerType.VIDEO
        },
        {
          id: videoContainerIds.popular,
          type: ContainerType.VIDEO
        },
        {
          id: videoContainerIds.related,
          type: ContainerType.VIDEO
        }
      ]
    },
    albums: {
      segmentMatch: ["/albums"],
      containerIds: [
        {
          id: albumContainerIds.common,
          type: ContainerType.ALBUM
        },
        {
          id: albumContainerIds.related,
          type: ContainerType.ALBUM
        }
      ]
    },
    latest: {
      segmentMatch: ["/latest-updates"],
      containerIds: [
        {
          id: videoContainerIds.latest,
          type: ContainerType.VIDEO
        }
      ]
    },
    categories: {
      segmentMatch: ["/categories"],
      containerIds: [
        {
          id: categoryContainerIds.list,
          type: ContainerType.CATEGORY
        },
        {
          id: videoContainerIds.common,
          type: ContainerType.VIDEO
        }
      ]
    },
    members: {
      segmentMatch: ["/members"],
      containerIds: [
        {
          id: videoContainerIds.private,
          type: ContainerType.VIDEO
        },
        {
          id: videoContainerIds.favorite,
          type: ContainerType.VIDEO
        },
        {
          id: videoContainerIds.uploaded,
          type: ContainerType.VIDEO
        },
        {
          id: albumContainerIds.private,
          type: ContainerType.ALBUM
        },
        {
          id: albumContainerIds.favorite,
          type: ContainerType.ALBUM
        },
        {
          id: albumContainerIds.uploaded,
          type: ContainerType.ALBUM
        }
      ]
    },
    messages: {
      segmentMatch: ["/messages"],
      containerIds: [
        {
          id: conversationsContainerIds.conversations,
          type: ContainerType.CONVERSATIONS
        },
        {
          id: messagesContainerIds.messages,
          type: ContainerType.MESSAGES
        }
      ]
    },
    common: {
      segmentMatch: ["/top-rated", "/most-popular", "/sites", "/models", "/channels"],
      containerIds: [
        {
          id: videoContainerIds.common,
          type: ContainerType.VIDEO
        }
      ]
    }
  };
  function stringOrInt(input, force = false) {
    try {
      if (force) {
        return parseInt(input);
      } else {
        if (input.length > 0 && input.endsWith("%")) {
          return parseInt(input.substring(0, input.length - 1)) / 100;
        }
        return parseInt(input);
      }
    } catch {
      return input;
    }
  }
  function processRelativeDate(input, replaceExtra) {
    if (input === void 0) {
      return {
        filtered: input
      };
    }
    const exclude = ["\n", "	", ...replaceExtra ?? []];
    let filteredInput = input;
    for (const item of exclude) {
      filteredInput = filteredInput.replaceAll(item, "");
    }
    return {
      filtered: filteredInput,
      date: void 0
    };
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  async function processCategories(rootNode) {
    let result = [];
    $(rootNode).find(".item").each((_, item) => {
      const processed = processCategoryItem(item);
      if (processed !== void 0) {
        result.push(processed);
      }
    });
    console.log(result);
    await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/categories`, {
      method: "POST",
      body: JSON.stringify({ items: result })
    });
  }
  function processCategoryItem(item) {
    const url = $(item).attr("href");
    if (url === void 0) {
      return void 0;
    }
    const id = url.replace(/\/$/, "").split("/").pop();
    if (id === void 0) {
      return void 0;
    }
    const name = $(item).attr("title");
    if (name === void 0) {
      return void 0;
    }
    const thumbnailUrl = $(item).find(".thumb").attr("src");
    if (thumbnailUrl === void 0) {
      return void 0;
    }
    const split = $(item).find(".videos").text().trim().split(" ");
    if (split.length === 0) {
      return void 0;
    }
    const videos = stringOrInt(split[0]);
    const ratingPercentString = $(item).find(".rating").text().trim();
    try {
      const rating = parseInt(ratingPercentString.substring(0, ratingPercentString.length - 1)) / 100;
      return {
        url,
        id,
        name,
        thumbnailUrl,
        videos,
        ratingPercentString,
        rating
      };
    } catch (e) {
      console.error(e);
      return void 0;
    }
  }
  function getCommonDetails(commentId, relatedId) {
    console.log("getItemDetails");
    const url = window.location.pathname;
    let slashSplit = url.replace(/\/$/, "").split("/");
    const stringId = slashSplit.pop();
    const id = slashSplit.pop();
    if (id === void 0) {
      return void 0;
    }
    const title = $(".headline h2").text().trim();
    const detailsBlock = $(".block-details").first();
    const infoBlock = $(detailsBlock).find(".info").first();
    const firstInfoItemBlock = $(infoBlock).find(".item").first();
    const viewsText = $($(firstInfoItemBlock).find("span")[1]).find("em").first().text();
    const description = $($(infoBlock).find(".item")[1]).find("em").text();
    const categories = $($(infoBlock).find(".item")[2]).find("a").map(function() {
      return $(this).text();
    }).get();
    const tags = $($(infoBlock).find(".item")[3]).find("a").map(function() {
      return $(this).text();
    }).get();
    const userBlock = $(detailsBlock).find(".block-user").first();
    const username = $(userBlock).find(".username").first().find("a").first().text().trim();
    const userUrl = $(userBlock).find(".username").first().find("a").first().attr("href");
    const userId = userUrl?.replace(/\/$/, "").split("/").pop();
    const avatarUrl = $(userBlock).find(".avatar").first().find("img").first().attr("src");
    const related = getRelatedIds(relatedId);
    const comments = $(`#${commentId}`).find(".item").map(function() {
      const userA = $(this).find(".image").first().find("a").first();
      console.log(userA.length);
      let userInfo = {
        name: $(this).find(".username").first().text().trim(),
        url: void 0,
        id: $(this).attr("data-comment-id"),
        avatarUrl: void 0
      };
      if (userA.length > 0) {
        userInfo = {
          name: $(userA).attr("title") || $(this).find(".username").first().text().trim(),
          url: $(userA).attr("href"),
          id: $(userA).attr("href")?.replace(/\/$/, "").split("/").pop(),
          avatarUrl: $(userA).find("img").first().attr("src")
        };
      }
      const relativeDate = processRelativeDate($(this).find(".comment-info").first().text().trim().split("	").pop());
      const comment = {
        user: userInfo,
        relativeDateString: relativeDate.filtered,
        dateExtracted: new Date(),
        rating: stringOrInt($(this).find(".comment-rating").first().text()),
        content: $(this).find(".original-text").first().text()
      };
      return comment;
    }).get();
    const isPrivate = $(".no-player").length > 0;
    const ratingContainer = $(".rating-container");
    const voteTextRaw = $(ratingContainer).find(".voters").first().text().trim();
    const votePercentageText = voteTextRaw.split("(")[0].trim();
    const voteAmountText = voteTextRaw.split("(")[1].split("votes")[0].trim();
    console.log("Basic processing done");
    let viewCount = viewsText ? parseInt(viewsText.split(" ").join("")) : void 0;
    let ratingPercent = parseInt(votePercentageText.substring(0, votePercentageText.length - 1)) / 100;
    let voteAmount = stringOrInt(voteAmountText);
    const fullItem = {
      title,
      id,
      stringId,
      viewCount,
      description,
      tags,
      categories,
      related,
      user: {
        name: username,
        url: userUrl,
        id: userId,
        avatarUrl
      },
      comments,
      isPrivate: isPrivate ? isPrivate : void 0,
      ratingPercent,
      voteAmount,
      ratingPercentString: votePercentageText
    };
    return fullItem;
  }
  function getCommonItemDetails(itemNode) {
    const aNode = $(itemNode).find("a").first();
    const url = $(aNode).attr("href");
    if (url === void 0) {
      return void 0;
    }
    let slashSplit = url.replace(/\/$/, "").split("/");
    slashSplit.pop();
    let id = slashSplit.pop();
    if (id === void 0) {
      return void 0;
    }
    const isPrivate = $(aNode).find(".line-private").length > 0;
    const viewsText = $(aNode).find(".views").text().trim().split(" views")[0].split(" ").join("");
    const ratingPercentString = $(aNode).find(".rating").text().trim();
    try {
      let viewCount = stringOrInt(viewsText);
      let ratingPercent = parseInt(ratingPercentString.substring(0, ratingPercentString.length - 1)) / 100;
      return {
        id,
        url,
        viewCount,
        ratingPercent,
        ratingPercentString,
        isPrivate
      };
    } catch (e) {
      console.error(e);
      return void 0;
    }
  }
  function getDurationOrImageCountText(node) {
    if (node === void 0) {
      const detailsBlock = $(".block-details").first();
      const infoBlock = $(detailsBlock).find(".info").first();
      const firstInfoItemBlock = $(infoBlock).find(".item").first();
      const text = $(firstInfoItemBlock).find("span").first().find("em").first().text().trim();
      return text;
    } else {
      if ($(node).find(".photos").length > 0) {
        return $(node).find(".photos").first().text().trim();
      } else {
        return $(node).find(".duration").first().text().trim();
      }
    }
  }
  function getScreenshots(selector) {
    return $(selector).find(".item").map(function() {
      const screenshot = {
        url: $(this).attr("href"),
        contentUrl: $(this).find("img").first().attr("src")
      };
      return screenshot;
    }).get();
  }
  function getRelatedIds(containerId) {
    const related = $(`#${containerId}`).find(".item").map(function() {
      const processed = getCommonItemDetails(this);
      if (processed !== void 0) {
        return processed.id;
      }
    }).get();
    return related;
  }
  async function processVideoList(rootNode) {
    let result = [];
    $(rootNode).find(".item").each((_, item) => {
      const processed = processVideoItem(item);
      if (processed !== void 0) {
        result.push(processed);
      }
    });
    console.log(result);
    if (result.length === 0) {
      return;
    }
    await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/video_items`, {
      method: "POST",
      body: JSON.stringify({ items: result })
    });
  }
  async function processSingleVideo() {
    console.log("processSingleVideo");
    const common = getCommonDetails(videoCommentId, videoContainerIds.related);
    if (common === void 0) {
      return void 0;
    }
    const durationText = getDurationOrImageCountText();
    const durationSplit = durationText.split(" ");
    const screenshots = getScreenshots(".block-screenshots");
    console.log("Basic processing done");
    try {
      let secondsString = durationSplit.pop();
      let minutesString = durationSplit.pop();
      if (secondsString === void 0 || minutesString === void 0) {
        console.log("secondsString, minutesString undefined");
        return;
      }
      secondsString = secondsString.substring(0, secondsString.length - 3);
      minutesString = minutesString.substring(0, minutesString.length - 3);
      let length = parseInt(minutesString) * 60 + parseInt(secondsString);
      const fullItem = {
        ...common,
        length,
        screenshots
      };
      console.log(fullItem);
      await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/video_info`, {
        method: "POST",
        body: JSON.stringify(fullItem)
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }
  function processVideoItem(itemNode) {
    const common = getCommonItemDetails(itemNode);
    if (common === void 0) {
      return void 0;
    }
    const durationText = getDurationOrImageCountText(itemNode);
    const durationSplit = durationText.split(":");
    try {
      let secondsString = durationSplit.pop();
      let minutesString = durationSplit.pop();
      if (secondsString === void 0 || minutesString === void 0) {
        return void 0;
      }
      secondsString = secondsString.substring(0, secondsString.length - 1);
      minutesString = minutesString.substring(0, minutesString.length - 1);
      let length = parseInt(minutesString) * 60 + parseInt(secondsString);
      return {
        ...common,
        length
      };
    } catch (e) {
      console.error(e);
      return void 0;
    }
  }
  function waitForVideo() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Video did not load within 10 seconds"));
      }, 1e4);
      const checkVideo = () => {
        const video = document.querySelector("video");
        if (video && video.src) {
          clearTimeout(timeout);
          console.log("Video Downloader: Video loaded successfully");
          resolve();
        } else {
          setTimeout(checkVideo, 500);
        }
      };
      checkVideo();
    });
  }
  async function loadVideo() {
    const fpUiElement = document.querySelector(".fp-ui");
    if (fpUiElement) {
      fpUiElement.click();
      console.log("Video Downloader: Clicked fp-ui element");
      await waitForVideo();
    } else {
      const video = document.querySelector("video");
      if (video)
        return;
      throw new Error("Video player not found. Make sure you are on a video page.");
    }
  }
  async function handleVideoDownload() {
    try {
      console.log("newnew");
      await loadVideo();
    } catch {
      const url = window.location.pathname;
      let slashSplit = url.replace(/\/$/, "").split("/");
      slashSplit.pop();
      const id = slashSplit.pop();
      if (id === void 0) {
        throw new Error("Unable to get ID from title, make sure the page is correct.");
      }
      let contentUrl = await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/get_download`, {
        method: "POST",
        body: JSON.stringify({ id })
      }).then((response) => response.json());
      if (contentUrl === void 0 || !contentUrl.success) {
        throw new Error("Unable to get contentUrl, make sure server is correct.");
      }
      var vLink = document.createElement("a");
      vLink.setAttribute("href", contentUrl.link);
      vLink.setAttribute("download", `${id}.mp4`);
      vLink.click();
      return;
    }
    let video = document.querySelector("video");
    if (!video || !video.src) {
      video = document.querySelector("source");
      if (!video || !video.src) {
        throw new Error("Video source not found. Make sure the video is loaded first.");
      }
    }
    const filename = getFilenameFromUrl(document.URL);
    await downloadVideo(video.src, filename);
  }
  function getFilenameFromUrl(url) {
    try {
      let split = url.split("/");
      console.log(split[split.length - 3]);
      return `${split[split.length - 3]}.mp4`;
    } catch {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split("/").pop();
        if (!filename || filename === "" || !filename.includes(".")) {
          const timestamp = ( new Date()).toISOString().replace(/[:.]/g, "-");
          return `video-${timestamp}.mp4`;
        }
        return filename;
      } catch (error) {
        console.error("Video Downloader: Error parsing URL:", error);
        const timestamp = ( new Date()).toISOString().replace(/[:.]/g, "-");
        return `video-${timestamp}.mp4`;
      }
    }
  }
  async function downloadVideo(url, filename) {
    try {
      console.log("Video Downloader: Opening video URL...");
      console.log("Video Downloader: URL:", url);
      console.log("Video Downloader: Filename:", filename);
      if (!url || url === "") {
        throw new Error("Video URL is empty or invalid");
      }
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("blob:")) {
        throw new Error("Video URL is not a valid HTTP/HTTPS/blob URL: " + url);
      }
      console.log("Video Downloader: Opening video URL in new tab...");
      try {
        console.log("Video Downloader: Auto-downloading MP4...");
        console.log("Video Downloader: URL:", url);
        console.log("Video Downloader: Filename:", filename);
        _GM_download({
          url,
          name: filename,
          onerror: (e) => console.error("download error", e),
          ontimeout: () => console.error("download timeout"),
          onload: () => console.error("download load")
        });
        console.log("Video Downloader: Auto-download started for", filename);
      } catch (error) {
        console.error("Video Downloader: Auto-download failed:", error);
      }
      console.log("Video Downloader: Video URL opened successfully");
    } catch (error) {
      console.error("Video Downloader: Error opening video URL:", {
        error,
        url,
        filename
      });
      throw error;
    }
  }
  async function handleAlbumDownload() {
    const titleElement = document.querySelector(".headline");
    const title = titleElement ? titleElement.innerText.trim() : "album";
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, "_").substring(0, 100);
    const imagesContainer = document.querySelector(".images");
    if (!imagesContainer) {
      throw new Error("Images container not found");
    }
    const imageUrls = [...imagesContainer.children].map((child) => child.href).filter((href) => href);
    if (imageUrls.length === 0) {
      throw new Error("No images found in album");
    }
    console.log(`Video Downloader: Found ${imageUrls.length} images in album`);
    await downloadAlbumAsZip(imageUrls, cleanTitle);
  }
  async function downloadAlbumAsZip(imageUrls, albumTitle) {
    try {
      console.log("Video Downloader: Starting album download...");
      console.log("Video Downloader: Album title:", albumTitle);
      console.log("Video Downloader: Image count:", imageUrls.length);
      if (typeof JSZip === "undefined") {
        throw new Error("JSZip library is not available. Please reload the extension.");
      }
      console.log("Video Downloader: JSZip library ready, creating ZIP...");
      const zip = new JSZip();
      let downloadedCount = 0;
      const progressDiv = document.createElement("div");
      progressDiv.id = "download-progress";
      progressDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
      progressDiv.innerHTML = `Downloading album... 0/${imageUrls.length}`;
      document.body.appendChild(progressDiv);
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const imageUrl = imageUrls[i];
          console.log(`Video Downloader: Downloading image ${i + 1}/${imageUrls.length}: ${imageUrl}`);
          const response = await fetch(imageUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            headers: {
              "Accept": "image/*"
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const blob = await response.blob();
          console.log(`Video Downloader: Image ${i + 1} blob size: ${blob.size} bytes, type: ${blob.type}`);
          let extension = ".jpg";
          if (imageUrl.includes(".png")) extension = ".png";
          else if (imageUrl.includes(".gif")) extension = ".gif";
          else if (imageUrl.includes(".webp")) extension = ".webp";
          else if (blob.type.includes("png")) extension = ".png";
          else if (blob.type.includes("gif")) extension = ".gif";
          else if (blob.type.includes("webp")) extension = ".webp";
          const filename = `image_${String(i + 1).padStart(3, "0")}${extension}`;
          const arrayBuffer = await blob.arrayBuffer();
          zip.file(filename, arrayBuffer);
          downloadedCount++;
          progressDiv.innerHTML = `Downloading album... ${downloadedCount}/${imageUrls.length}`;
          console.log(`Video Downloader: Added ${filename} to ZIP`);
        } catch (error) {
          console.warn(`Failed to download image ${i + 1}:`, error);
        }
      }
      progressDiv.innerHTML = "Creating ZIP file...";
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${albumTitle}.zip`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(progressDiv);
      console.log("Video Downloader: Album download completed");
    } catch (error) {
      console.error("Video Downloader: Album download failed:", error);
      throw new Error("Failed to download album, see console for details");
    }
  }
  async function extractUsers(rootNode) {
    const mainUrl = window.location.pathname;
    const userId = mainUrl?.replace(/\/$/, "").split("/").pop();
    if (userId === void 0) {
      return void 0;
    }
    const username = $(rootNode).find(".main-container-user").first().find(".headline").first().find("a").eq(1).text().trim();
    const messages = $(rootNode).find(".item:not(.me):not(.grouped)");
    let avatarUrl = void 0;
    $(messages).each((_, item) => {
      if (avatarUrl !== void 0) {
        return;
      }
      let foundUrl = $(item).find(".image").first().find("img").first().attr("src");
      if (foundUrl !== void 0) {
        avatarUrl = foundUrl;
        return;
      }
    });
    const memberMenu = $(rootNode).find(".member-menu").first();
    const meAvatarUrl = $(memberMenu).find("img").first().attr("src");
    if (meAvatarUrl === void 0) {
      return void 0;
    }
    const meUsername = $(memberMenu).find("img").first().attr("alt");
    if (meUsername === void 0) {
      return void 0;
    }
    const dotSplit = meAvatarUrl.split(".");
    dotSplit.pop();
    const otherArgs = dotSplit.pop();
    const meId = otherArgs?.replace(/\/$/, "").split("/").pop();
    if (meId === void 0) {
      return void 0;
    }
    const result = {
      user: {
        name: username,
        url: `https://www.boundhub.com/members/${userId}`,
        id: userId,
        avatarUrl: avatarUrl === BLANK_IMAGE ? void 0 : avatarUrl
      },
      me: {
        name: meUsername,
        url: `https://www.boundhub.com/members/${meId}`,
        id: meId,
        avatarUrl: meAvatarUrl === BLANK_IMAGE ? void 0 : meAvatarUrl
      }
    };
    console.log("extractUsers", result);
    return result;
  }
  async function processConversations(rootNode) {
    let result = [];
    for (const item of $(rootNode).find(".item").toArray()) {
      const processed = await processConversationItem(item);
      if (processed !== void 0) {
        result.push(processed);
      }
    }
    console.log("processConversations", result);
    await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/conversations`, {
      method: "POST",
      body: JSON.stringify({ items: result })
    });
  }
  async function processConversationItem(item) {
    const a = $(item).find("a").first();
    const messageUrl = $(a).attr("href");
    const userId = messageUrl?.replace(/\/$/, "").split("/").pop();
    const id = userId;
    if (id === void 0 || messageUrl === void 0) {
      return void 0;
    }
    const userUrl = `https://www.boundhub.com/members/${userId}`;
    const username = $(a).attr("title") || $(a).find(".title").first().text().trim();
    const avatar = $(a).find("img").first().get(0);
    let avatarUrl = void 0;
    if (avatar !== void 0) {
      if (avatar.complete) {
        avatarUrl = $(avatar).attr("src");
      } else {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`Failed to wait for pic loading`));
          }, 3e4);
          avatar.addEventListener("load", function() {
            clearTimeout(timer);
            return resolve();
          });
          if (avatar.complete) {
            clearTimeout(timer);
            return resolve();
          }
        }).catch(() => null);
      }
    }
    const relativeDate = processRelativeDate($(a).find(".added").first().text().trim());
    const relativeDateString = relativeDate.filtered;
    const messageCountString = $(a).find(".views").first().text().trim();
    return {
      id,
      url: messageUrl,
      user: {
        name: username,
        url: userUrl,
        id: userId,
        avatarUrl: avatarUrl === BLANK_IMAGE ? void 0 : avatarUrl
      },
      messageCount: stringOrInt(messageCountString),
      relativeDateString,
      dateExtracted: new Date()
    };
  }
  async function processMessages(rootNode) {
    const mainNode = $(".main-content").first().get(0);
    if (mainNode === void 0) {
      console.warn("Failed to find main-content");
      return;
    }
    const users = await extractUsers(mainNode);
    if (users === void 0) {
      console.warn("Failed to find users");
      return;
    }
    let result = [];
    $(rootNode).find(".item").each((_, item) => {
      const processed = processMessageItem(item, users.user, users.me);
      if (processed !== void 0) {
        result.push(processed);
      }
    });
    console.log("processMessages", result);
    await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/messages`, {
      method: "POST",
      body: JSON.stringify({ items: result })
    });
  }
  function processMessageItem(item, user, me) {
    let id = $(item).attr("data-message-id");
    if (id === void 0) {
      id = $(item).find(".added").first().attr("data-message-id");
      if (id === void 0) {
        return void 0;
      }
    }
    let originalText = $(item).find(".message-text");
    let content = "";
    if ($(originalText).find(".original-text").length > 0) {
      $(originalText).find(".original-text").first().find("img").each((_, item2) => {
        $(item2).replaceWith(`${$(item2).attr("alt")}`);
      });
      content = $(originalText).find(".original-text").first().text().trim();
    } else {
      content = $(originalText).text().trim();
    }
    const relativeDate = processRelativeDate($(item).find(".added").first().text().trim(), ["(unread)"]);
    let relativeDateString = relativeDate.filtered;
    let isMe = $(item).hasClass("me");
    return {
      id,
      from: isMe ? me : user,
      to: isMe ? user : me,
      relativeDateString,
      dateExtracted: new Date(),
      content
    };
  }
  function getSettingInput(value) {
    const id = `${PREFIX}-${value.key}`;
    return `
    <div class="row">
        <label for="${id}" class="field-label">${value.title}</label>
        ${value.type === "string" ? `<input type="text" name="${id}" id="${id}" class="textfield" value="${_GM_getValue(value.key, value.default)}" maxlength="253" placeholder="${value.title}">` : `<input type="checkbox" class="checkbox" id="${id}" name="${id}" ${_GM_getValue(value.key, value.default) ? "checked" : ""}>`}
    </div>
    `;
  }
  function initSettings() {
    $("body").append(`
        <dialog class="${PREFIX}-settings-dialog">
            <div class="center-content">
                <strong class="popup-title">Better BH Settings</strong>
                <div class="dialog-content">
                    <form id="${PREFIX}-settings-form" method="dialog">
                        ${settingValues.map((value) => getSettingInput(value))}
                    </form>
                </div>
                <a title="Close" class="${PREFIX}-close-settings fancybox-item fancybox-close" href="javascript:;"></a>
            </div>
        </dialog>
    `);
    setDialogOpen(false);
    $(`.${PREFIX}-close-settings`).on("click", () => {
      settingValues.forEach((settingValue) => {
        const id = `${PREFIX}-${settingValue.key}`;
        if (settingValue.type === "string") {
          const value = $(`#${id}`).val();
          console.log(settingValue.key, value);
          _GM_setValue(settingValue.key, value);
        } else {
          const value = $(`#${id}`).is(":checked");
          console.log(settingValue.key, value);
          _GM_setValue(settingValue.key, value);
        }
      });
      setDialogOpen(false);
    });
  }
  function setDialogOpen(open) {
    if (open) {
      $(`.${PREFIX}-settings-dialog`).show();
    } else {
      $(`.${PREFIX}-settings-dialog`).hide();
    }
  }
  async function processAlbumList(rootNode) {
    let result = [];
    $(rootNode).find(".item").each((_, item) => {
      const processed = processAlbumItem(item);
      if (processed !== void 0) {
        result.push(processed);
      }
    });
    console.log(result);
    if (result.length === 0) {
      return;
    }
    await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/album_items`, {
      method: "POST",
      body: JSON.stringify({ items: result })
    });
  }
  async function processSingleAlbum() {
    console.log("processSingleAlbum");
    const common = getCommonDetails(albumCommentId, albumContainerIds.related);
    if (common === void 0) {
      return void 0;
    }
    const imageCountText = getDurationOrImageCountText();
    const screenshots = getScreenshots(".images");
    console.log("Basic processing done");
    try {
      let imageCount = stringOrInt(imageCountText);
      const fullItem = {
        ...common,
        imageCount,
        images: screenshots
      };
      console.log(fullItem);
      await fetch(`${await _GM_getValue("hostname", HOSTNAME)}/api/bh/album_info`, {
        method: "POST",
        body: JSON.stringify(fullItem)
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }
  function processAlbumItem(itemNode) {
    const common = getCommonItemDetails(itemNode);
    if (common === void 0) {
      return void 0;
    }
    const imageCountText = getDurationOrImageCountText(itemNode);
    const imageCountSplit = imageCountText.split("photo");
    try {
      let imageCount = stringOrInt(imageCountSplit[0]);
      return {
        ...common,
        imageCount
      };
    } catch (e) {
      console.error(e);
      return void 0;
    }
  }
  function segmentMatches(pathname) {
    let keys = [];
    for (const key of Object.keys(pageDefinitions)) {
      const pageDefinition = pageDefinitions[key];
      let matches = false;
      for (const matcher of pageDefinition.segmentMatch) {
        if (typeof matcher === "string") {
          if (matcher.length <= 1) {
            if (pathname === (matcher.length === 0 ? "/" : matcher)) {
              matches = true;
              break;
            }
          } else {
            if (pathname.includes(matcher)) {
              matches = true;
              break;
            }
          }
        } else {
          if (pathname.match(matcher)) {
            matches = true;
            break;
          }
        }
      }
      if (matches) {
        keys.push(key);
      }
    }
    return keys;
  }
  function isSupportedPage(pathname) {
    for (const pageDefinition of Object.values(pageDefinitions)) {
      let matches = false;
      for (const matcher of pageDefinition.segmentMatch) {
        if (typeof matcher === "string") {
          if (matcher.length <= 1) {
            if (pathname === (matcher.length === 0 ? "/" : matcher)) {
              matches = true;
              break;
            }
          } else {
            if (pathname.includes(matcher)) {
              matches = true;
              break;
            }
          }
        } else {
          if (pathname.match(matcher)) {
            matches = true;
            break;
          }
        }
      }
      if (matches) {
        return matches;
      }
    }
    return false;
  }
  function isCorrectDomain() {
    const hostname = window.location.hostname;
    return hostname.includes("boundhub.com") || hostname.includes("www.boundhub.com");
  }
  function isSingleVideo() {
    const singleVideo = document.getElementById(singleVideoId);
    return singleVideo !== void 0 && singleVideo !== null;
  }
  function isSingleAlbum() {
    const singleAlbum = document.getElementById(singleAlbumId);
    return singleAlbum !== void 0 && singleAlbum !== null;
  }
  async function processContainer(container) {
    await delay(DELAY);
    const node = document.getElementById(container.id);
    if (node === void 0 || node === null) {
      console.log("Container ID isnt on page:", container.id);
      return;
    }
    if (container.type === ContainerType.ALBUM) {
      console.log("Processing ALBUM:", container.id);
      processAlbumList(node);
      const singleAlbum = document.getElementById(singleAlbumId);
      if (singleAlbum !== void 0 && singleAlbum !== null) {
        processSingleAlbum();
      }
    } else if (container.type === ContainerType.VIDEO) {
      console.log("Processing VIDEO:", container.id);
      processVideoList(node);
      const singleVideo = document.getElementById(singleVideoId);
      if (singleVideo !== void 0 && singleVideo !== null) {
        processSingleVideo();
      }
    } else if (container.type === ContainerType.CATEGORY) {
      console.log("Processing CATEGORY:", container.id);
      processCategories(node);
    } else if (container.type === ContainerType.MESSAGES) {
      console.log("Processing MESSAGES:", container.id);
      processMessages(node);
    } else if (container.type === ContainerType.CONVERSATIONS) {
      console.log("Processing CONVERSATIONS:", container.id);
      processConversations(node);
    } else {
      console.log("Unknown container id type");
    }
  }
  function createDownloadButton(buttonText = "Download") {
    if (document.getElementById("video-downloader-btn")) {
      return;
    }
    const tabsMenu = document.querySelector(".tabs-menu ul");
    if (!tabsMenu) {
      console.log("Video Downloader: Tabs menu not found, retrying...");
      setTimeout(() => createDownloadButton(buttonText), 1e3);
      return;
    }
    const downloadBtn = document.createElement("li");
    downloadBtn.id = "video-downloader-btn";
    downloadBtn.innerHTML = `<a href="#" class="toggle-button download-button">${buttonText}</a>`;
    tabsMenu.insertBefore(downloadBtn, tabsMenu.firstChild);
    const anchor = downloadBtn.querySelector("a");
    if (anchor === null) {
      console.warn("Failed to create download button");
      return;
    }
    anchor.addEventListener("click", handleDownloadClick);
    console.log("Video Downloader: Download button added");
  }
  async function handleDownloadClick(event) {
    event.preventDefault();
    $(".download-button").addClass("disable-click");
    try {
      if (isSingleVideo()) {
        await handleVideoDownload();
      } else if (isSingleAlbum()) {
        await handleAlbumDownload();
      }
      $(".download-button").removeClass("disable-click");
    } catch (error) {
      console.error("Video Downloader Error:", error);
      alert("Download failed, see console for details");
    }
  }
  function init() {
    console.log("Scraper: init");
    if (isCorrectDomain() && isSupportedPage(window.location.pathname)) {
      const definitions = segmentMatches(window.location.pathname);
      for (const key of definitions) {
        const definition = pageDefinitions[key];
        for (const container of definition.containerIds) {
          processContainer(container);
        }
      }
      if (isSingleVideo() || isSingleAlbum()) {
        createDownloadButton("Download");
      }
    } else if (!isCorrectDomain()) {
      console.log("Scraper: Not on correct domain, skipping");
    } else {
      console.log("Scraper: Not a supported page type, skipping");
    }
    const network = $(".top-links").first().find(".network").first();
    $(network).find("ul li").each((index, item) => {
      if (index === 0) {
        let a = $(item).find("a");
        $(a).attr("target", "").attr("href", "javascript:void(0)").text("Better BH Settings").attr("id", "better-bh-settings-open").on("click", () => {
          setDialogOpen(true);
        });
      } else {
        $(item).html("");
      }
    });
    initSettings();
  }
  (async () => {
    if (document.readyState === "loading") {
      console.log("Scraper: DOMContentLoaded");
      document.addEventListener("DOMContentLoaded", () => {
        init();
      });
    } else {
      init();
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(async (mutation) => {
        if (mutation.type === "childList") {
          for (const entry of mutation.addedNodes) {
            await delay(DELAY);
            const id = jQuery(entry).attr("id");
            if (id === void 0) {
              return;
            }
            const node = document.getElementById(id);
            if (node === void 0 || node === null) {
              return;
            }
            if (Object.values(videoContainerIds).includes(id)) {
              console.log("Scraper: video found", id);
              processVideoList(node);
            } else if (Object.values(categoryContainerIds).includes(id)) {
              console.log("Scraper: category found", id);
              processCategories(node);
            } else if (Object.values(messagesContainerIds).includes(id)) {
              console.log("Scraper: messages found", id);
              processMessages(node);
            } else if (Object.values(conversationsContainerIds).includes(id)) {
              console.log("Scraper: conversations found", id);
              processConversations(node);
            } else if (Object.values(albumContainerIds).includes(id)) {
              console.log("Scraper: album found", id);
              processAlbumList(node);
            }
          }
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    _GM_addStyle(`
        ${Boolean(_GM_getValue(settingKeys.hideAds, settingDefaults[settingKeys.hideAds])) ? `
        .ta4ble, .spo8nsor, .to3op, .p8lace {
            display: none;
        }
        ` : ""}
        ${Boolean(_GM_getValue(settingKeys.unhidePrivate, settingDefaults[settingKeys.unhidePrivate])) ? `
        .item.private .thumb {
            opacity: 1 !important;
        }
        ` : ""}
        .disable-click {
            pointer-events: none;
        }
        .${PREFIX}-settings-dialog {
            z-index: 100000;
            position: absolute;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background: none;
            background-color: rgba(17, 13, 13, 0.65);

            .center-content {
                position: relative;
                max-width: 600px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                border-radius: 4px;

                .popup-title {
                    width: 100%;
                }
            }

            .dialog-content {
                position: relative;
                background-color: #2c2c2c;
                padding: 20px;
                width: 560px;
                border-radius: 4px;
                color: #444;
            }
        }
    `);
  })();

})(JSZip);