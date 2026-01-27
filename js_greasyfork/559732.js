// ==UserScript==
// @name         Juxtaposition Pretendo Enhancer
// @namespace    https://github.com/ItsFuntum/Juxtaposition-Enhancer
// @version      2026-01-26
// @description  Userscript that improves Pretendo's Juxtaposition on the web.
// @author       Funtum
// @match        *://juxt.pretendo.network/*
// @grant        none
// @license      MIT
// @icon         https://juxt.pretendo.network/web/icons/icon-512x512.png
// @downloadURL https://update.greasyfork.org/scripts/559732/Juxtaposition%20Pretendo%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/559732/Juxtaposition%20Pretendo%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const communityPage = window.location.pathname.match(/^\/titles\/(\d+)/);
  const postsPage = window.location.pathname.match(/posts/);
  const myMii = document.querySelector(".mii-icon")?.src;
  const myMiiSubstring = myMii
    ? myMii.substring(0, myMii.lastIndexOf("/"))
    : null;

  // --- Wait until .community-info exists ---
  function waitForCommunityInfo(callback) {
    const container = document.querySelector(".community-info");
    if (container) return callback(container);

    const observer = new MutationObserver(() => {
      const container = document.querySelector(".community-info");
      if (container) {
        observer.disconnect();
        callback(container);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if ([...document.scripts].some((s) => s.src === src)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false; // important: preserves global execution order
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function isPaintingVisible(wrapper) {
    if (!wrapper) return false;

    const rect = wrapper.getBoundingClientRect();
    const style = getComputedStyle(wrapper);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  }

  function lockPaintingScroll(wrapper) {
    if (!isPaintingVisible(wrapper)) {
      return;
    }

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Lock page scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // Block ALL scroll-related events
    ["touchstart", "touchmove", "touchend", "wheel", "pointermove"].forEach(
      (evt) => {
        wrapper.addEventListener(evt, block, {
          passive: false,
          capture: true,
        });
      },
    );
  }

  function unlockPaintingScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  }

  function override_closePainting() {
    const wrapper = document.getElementById("painting-wrapper");
    if (!wrapper) return;

    const okBtn = wrapper.querySelector("button.primary");
    if (!okBtn) return;

    okBtn.onclick = (e) => {
      if (!isPaintingVisible(wrapper)) {
        console.log("OK clicked while painting hidden — ignored");
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      unlockPaintingScroll();
      savePainting(wrapper);
    };

    const cancelBtn = wrapper.querySelector(
      "#button-wrapper button:not(.primary)",
    );
    if (!cancelBtn) return;

    cancelBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      unlockPaintingScroll();
      wrapper.style.display = "none";
    };
  }

  function savePainting(wrapper) {
    if (!isPaintingVisible(wrapper)) {
      console.log("savePainting aborted: painting not visible");
      return;
    }

    const postPage = wrapper.previousElementSibling;
    if (!postPage) return;

    const canvas = wrapper.querySelector("#painting");
    const memoPreview = postPage.querySelector("#memo");

    if (!canvas) {
      console.warn("Painting canvas not found");
      return;
    }

    // Step 1: Get raw canvas data
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;

    // Step 2: Convert to black-and-white (bilevel)
    const bwData = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4 + 0];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      // Average + threshold
      const avg = (r + g + b) / 3;
      bwData[i] = avg > 127 ? 255 : 0;
    }

    // Step 3: Encode TGA (uncompressed, 32-bit)
    function encodeTGA(width, height, bwData) {
      const header = new Uint8Array(18);
      header[2] = 2; // Uncompressed true-color image
      header[12] = width & 0xff;
      header[13] = (width >> 8) & 0xff;
      header[14] = height & 0xff;
      header[15] = (height >> 8) & 0xff;
      header[16] = 32; // bits per pixel
      header[17] = 0x20; // top-left origin

      const pixels = new Uint8Array(width * height * 4);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          const val = bwData[i];
          const idx = (y * width + x) * 4;
          pixels[idx + 0] = val; // B
          pixels[idx + 1] = val; // G
          pixels[idx + 2] = val; // R
          pixels[idx + 3] = 255; // A
        }
      }

      const tga = new Uint8Array(header.length + pixels.length);
      tga.set(header, 0);
      tga.set(pixels, header.length);
      return tga;
    }

    const tgaData = encodeTGA(width, height, bwData);

    // Step 4: Compress TGA → TGAZ
    const tgaz = pako.deflate(tgaData, { level: 6 });

    // Step 5: Base64 encode
    const base64 = btoa(String.fromCharCode(...new Uint8Array(tgaz)));

    // Step 6: Update DOM
    if (memoPreview) {
      // Show canvas preview in UI
      memoPreview.src = canvas.toDataURL("image/png");
      memoPreview.style.display = "block";
    }

    const memoValue = postPage.querySelector("#memo-value");
    if (memoValue) memoValue.value = base64;

    wrapper.style.display = "none";
    document.body.style.overflow = "";
    console.log("Painting ready, TGAZ bytes:", tgaz.length);
  }

  function scaleToJuxtResolution(img) {
    const TARGETS = [
      { w: 800, h: 450 },
      { w: 400, h: 240 },
      { w: 320, h: 240 },
      { w: 640, h: 480 },
    ];

    const srcAspect = img.width / img.height;

    // Pick closest aspect ratio
    let target = TARGETS.reduce(
      (best, t) => {
        const diff = Math.abs(srcAspect - t.w / t.h);
        return diff < best.diff ? { t, diff } : best;
      },
      { t: TARGETS[0], diff: Infinity },
    ).t;

    const canvas = document.createElement("canvas");
    canvas.width = target.w;
    canvas.height = target.h;

    const ctx = canvas.getContext("2d");

    // Black bars
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale image to fit
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height,
    );

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const x = (canvas.width - drawW) / 2;
    const y = (canvas.height - drawH) / 2;

    ctx.drawImage(img, x, y, drawW, drawH);

    return canvas.toDataURL("image/jpeg", 0.92);
  }

  function processScreenshot(popup) {
    const screenshotValue = popup.querySelector("#screenshot-value");
    const preview = popup.querySelector("#screenshot-preview");
    const fileInput = popup.querySelector("#screenshot-input");

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (file.type !== "image/jpeg") {
        alert("Only JPEG screenshots are supported.");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result.toString();

        const img = new Image();
        img.onload = () => {
          const scaledDataUrl = scaleToJuxtResolution(img);

          // Strip prefix for server
          const base64 = scaledDataUrl.replace(/^data:image\/jpeg;base64,/, "");

          screenshotValue.value = base64;

          // Preview scaled image
          preview.src = scaledDataUrl;
          preview.style.display = "block";

          // Prevent uploading both screenshot AND memo (painting/drawing)
          const memoValue = popup.querySelector("#memo-value");
          if (memoValue) memoValue.value = "";
        };

        img.src = dataUrl;
      };

      reader.readAsDataURL(file);
    });
  }

  if (communityPage) {
    const communityId = communityPage[1];
    waitForCommunityInfo(async () => {
      const popupBackdrop = document.createElement("div");
      popupBackdrop.className = "modal-backdrop";
      popupBackdrop.style.display = "flex";
      document.body.appendChild(popupBackdrop);

      const postPage = document.createElement("div");
      postPage.id = "add-post-page";
      postPage.className = "add-post-page official-user-post";
      postPage.style.display = "flex";

      postPage.innerHTML = `
<form id="posts-form" data-is-own-title="1" data-is-identified="1" action="/posts/new" method="post">
  <input type="hidden" name="community_id" value="${communityId}">

  <div class="add-post-page-content">

    <div class="feeling-selector expression">
      <img src="${myMiiSubstring}/normal_face.png" id="mii-face" class="icon">
      <ul class="buttons">
        <li><input type="radio" class="feeling-button-normal" data-mii-face-url="${myMiiSubstring}/normal_face.png" name="feeling_id" value="0" checked></li>
        <li><input type="radio" class="feeling-button-happy" data-mii-face-url="${myMiiSubstring}/smile_open_mouth.png" name="feeling_id" value="1"></li>
        <li><input type="radio" class="feeling-button-like" data-mii-face-url="${myMiiSubstring}/wink_left.png" name="feeling_id" value="2"></li>
        <li><input type="radio" class="feeling-button-surprised" data-mii-face-url="${myMiiSubstring}/surprise_open_mouth.png" name="feeling_id" value="3"></li>
        <li><input type="radio" class="feeling-button-frustrated" data-mii-face-url="${myMiiSubstring}/frustrated.png" name="feeling_id" value="4"></li>
        <li><input type="radio" class="feeling-button-puzzled" data-mii-face-url="${myMiiSubstring}/sorrow.png" name="feeling_id" value="5"></li>
      </ul>
    </div>

    <div class="textarea-container textarea-with-menu active-text">
      <menu class="textarea-menu">
        <li class="textarea-menu-text">
          <input type="radio" data-sound="" onclick="openText()" name="_post_type" checked="" value="body">
        </li>
        <li class="textarea-menu-memo">
          <input type="radio" data-sound="" onclick="newPainting(false)" name="_post_type" value="painting">
        </li>
      </menu>

      <textarea id="new-post-text" name="body" class="textarea-text" maxlength="280" placeholder="Enter text here..."></textarea>

      <div id="new-post-memo" class="textarea-memo trigger" data-sound="" onclick="newPainting(false)" style="display: none;">
        <img id="memo" class="textarea-memo-preview">
        <input id="memo-value" type="hidden" name="painting">
      </div>
    </div>

    <label class="checkbox-container spoiler-button">
      Spoilers
      <input type="checkbox" id="spoiler" name="spoiler" value="true">
      <span class="checkmark"></span>
    </label>
  </div>

  <div class="screenshot-upload">
    <input type="file" id="screenshot-input" accept="image/jpeg">
    <input type="hidden" name="screenshot" id="screenshot-value">
    <img id="screenshot-preview" style="display:none; max-width:100%; border-radius:6px;">
  </div>

  <div id="button-wrapper">
    <input type="submit" class="post-button fixed-bottom-button" value="Post">
  </div>
</form>
`;

      const paintingWrapper = document.createElement("div");
      paintingWrapper.className = "painting-wrapper";
      paintingWrapper.style.display = "none";
      paintingWrapper.id = "painting-wrapper";
      Object.assign(paintingWrapper.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "100000",
      });

      paintingWrapper.innerHTML = `
<div id="painting-content">
  <div class="tools">
    <div>
      <button class="clear" onclick="clearCanvas()"></button>
      <button class="undo"></button>
    </div>
    <div>
      <ul class="buttons pencil">
        <li><input onclick="setPen(0)" type="radio" class="pencil small" name="tool" checked="" value="0"></li>
        <li><input onclick="setPen(1)" type="radio" class="pencil medium" name="tool" value="1"></li>
        <li><input onclick="setPen(2)" type="radio" class="pencil large" name="tool" value="2"></li>
      </ul>
      <ul class="buttons eraser">
        <li><input onclick="setEraser(0)" type="radio" class="eraser small" name="tool" value="0"></li>
        <li><input onclick="setEraser(1)" type="radio" class="eraser medium" name="tool" value="1"></li>
        <li><input onclick="setEraser(2)" type="radio" class="eraser large" name="tool" value="2"></li>
      </ul>
    </div>
  </div><canvas width="320" height="120" id="painting">Your browser does not support the HTML canvas tag.</canvas>
  <div id="button-wrapper"><button onclick="closePainting(false)">Cancel</button><button class="primary">OK</button></div>
</div>`;

      document.querySelector(".community-top").appendChild(postPage);
      document.querySelector(".community-top").appendChild(paintingWrapper);

      const canvas = paintingWrapper.querySelector("#painting");
      if (canvas) {
        canvas.style.touchAction = "none";
        const observer = new MutationObserver(() => {
          if (isPaintingVisible(paintingWrapper)) {
            lockPaintingScroll(paintingWrapper);
          }
        });

        observer.observe(paintingWrapper, {
          attributes: true,
          attributeFilter: ["style", "class"],
        });
      }

      await loadScriptOnce(
        "https://juxt.pretendo.network/js/painting.global.js",
      );
      await loadScriptOnce(
        "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js",
      );

      override_closePainting();
      processScreenshot(postPage);

      // --- Feeling selector: change Mii expression when clicking buttons ---
      const miiFace = postPage.querySelector("#mii-face");
      const feelingButtons = postPage.querySelectorAll(
        "input[name='feeling_id']",
      );

      feelingButtons.forEach((btn) => {
        btn.addEventListener("change", () => {
          const url = btn.dataset.miiFaceUrl;
          if (url) miiFace.src = url;
        });
      });
    });
  }

  // --- Instead of starting with just the observer ---
  async function addReplyBox() {
    const communityLink = document.querySelector(
      '.post-meta-wrapper h4 a[href^="/titles/"]',
    );
    if (!communityLink) return alert("Cannot find community link");
    const communityId = communityLink
      ? communityLink.href.split("/titles/")[1]
      : null;
    const popupBackdrop = document.createElement("div");
    popupBackdrop.className = "modal-backdrop";
    popupBackdrop.style.display = "flex";
    document.body.appendChild(popupBackdrop);

    const postsWrapper = document.querySelector(".posts-wrapper");
    if (!postsWrapper) return alert("Cannot find parent post ID");
    const postId = postsWrapper.id;

    const postPage = document.createElement("div");
    postPage.id = "add-post-page";
    postPage.className = "add-post-page official-user-post";
    postPage.style.display = "flex";

    postPage.innerHTML = `
<form id="posts-form" data-is-own-title="1" data-is-identified="1" action="/posts/${postId}/new" method="post">
  <input type="hidden" name="community_id" value="${communityId}">

  <div class="add-post-page-content">

    <div class="feeling-selector expression">
      <img src="${myMiiSubstring}/normal_face.png" id="mii-face" class="icon">
      <ul class="buttons">
        <li><input type="radio" class="feeling-button-normal" data-mii-face-url="${myMiiSubstring}/normal_face.png" name="feeling_id" value="0" checked></li>
        <li><input type="radio" class="feeling-button-happy" data-mii-face-url="${myMiiSubstring}/smile_open_mouth.png" name="feeling_id" value="1"></li>
        <li><input type="radio" class="feeling-button-like" data-mii-face-url="${myMiiSubstring}/wink_left.png" name="feeling_id" value="2"></li>
        <li><input type="radio" class="feeling-button-surprised" data-mii-face-url="${myMiiSubstring}/surprise_open_mouth.png" name="feeling_id" value="3"></li>
        <li><input type="radio" class="feeling-button-frustrated" data-mii-face-url="${myMiiSubstring}/frustrated.png" name="feeling_id" value="4"></li>
        <li><input type="radio" class="feeling-button-puzzled" data-mii-face-url="${myMiiSubstring}/sorrow.png" name="feeling_id" value="5"></li>
      </ul>
    </div>

    <div class="textarea-container textarea-with-menu active-text">
      <menu class="textarea-menu">
        <li class="textarea-menu-text">
          <input type="radio" data-sound="" onclick="openText()" name="_post_type" checked="" value="body">
        </li>
        <li class="textarea-menu-memo">
          <input type="radio" data-sound="" onclick="newPainting(false)" name="_post_type" value="painting">
        </li>
      </menu>

      <textarea id="new-post-text" name="body" class="textarea-text" maxlength="280" placeholder="Enter text here..."></textarea>

      <div id="new-post-memo" class="textarea-memo trigger" data-sound="" onclick="newPainting(false)" style="display: none;">
        <img id="memo" class="textarea-memo-preview">
        <input id="memo-value" type="hidden" name="painting">
      </div>
    </div>

    <label class="checkbox-container spoiler-button">
      Spoilers
      <input type="checkbox" id="spoiler" name="spoiler" value="true">
      <span class="checkmark"></span>
    </label>
  </div>

  <div class="screenshot-upload">
    <input type="file" id="screenshot-input" accept="image/jpeg">
    <input type="hidden" name="screenshot" id="screenshot-value">
    <img id="screenshot-preview" style="display:none; max-width:100%; border-radius:6px;">
  </div>

  <div id="button-wrapper">
    <input type="submit" class="post-button fixed-bottom-button" value="Post">
  </div>
</form>
`;

    const paintingWrapper = document.createElement("div");
    paintingWrapper.className = "painting-wrapper";
    paintingWrapper.style.display = "none";
    paintingWrapper.id = "painting-wrapper";
    Object.assign(paintingWrapper.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "100000",
    });

    paintingWrapper.innerHTML = `
<div id="painting-content">
  <div class="tools">
    <div>
      <button class="clear" onclick="clearCanvas()"></button>
      <button class="undo"></button>
    </div>
    <div>
      <ul class="buttons pencil">
        <li><input onclick="setPen(0)" type="radio" class="pencil small" name="tool" checked="" value="0"></li>
        <li><input onclick="setPen(1)" type="radio" class="pencil medium" name="tool" value="1"></li>
        <li><input onclick="setPen(2)" type="radio" class="pencil large" name="tool" value="2"></li>
      </ul>
      <ul class="buttons eraser">
        <li><input onclick="setEraser(0)" type="radio" class="eraser small" name="tool" value="0"></li>
        <li><input onclick="setEraser(1)" type="radio" class="eraser medium" name="tool" value="1"></li>
        <li><input onclick="setEraser(2)" type="radio" class="eraser large" name="tool" value="2"></li>
      </ul>
    </div>
  </div><canvas width="320" height="120" id="painting">Your browser does not support the HTML canvas tag.</canvas>
  <div id="button-wrapper"><button onclick="closePainting(false)">Cancel</button><button class="primary">OK</button></div>
</div>`;

    postsWrapper.appendChild(postPage);
    postsWrapper.appendChild(paintingWrapper);

    const canvas = paintingWrapper.querySelector("#painting");
    if (canvas) {
      canvas.style.touchAction = "none";
      const observer = new MutationObserver(() => {
        if (isPaintingVisible(paintingWrapper)) {
          lockPaintingScroll(paintingWrapper);
        }
      });

      observer.observe(paintingWrapper, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    await loadScriptOnce("https://juxt.pretendo.network/js/painting.global.js");
    await loadScriptOnce(
      "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js",
    );

    override_closePainting();
    processScreenshot(postPage);

    // --- Feeling selector: change Mii expression when clicking buttons ---
    const miiFace = postPage.querySelector("#mii-face");
    const feelingButtons = postPage.querySelectorAll(
      "input[name='feeling_id']",
    );

    feelingButtons.forEach((btn) => {
      btn.addEventListener("change", () => {
        const url = btn.dataset.miiFaceUrl;
        if (url) miiFace.src = url;
      });
    });
  }

  function addViewLikes() {
    const wrappers = document.querySelectorAll(".post-buttons-wrapper");
    const userMiiIconEl = document.querySelector(".mii-icon");
    if (!userMiiIconEl) return;

    const userMiiIcon_raw = userMiiIconEl.src;
    const userMiiIcon_base = userMiiIcon_raw.substring(
      0,
      userMiiIcon_raw.lastIndexOf("/") + 1,
    );

    wrappers.forEach((wrapper) => {
      const postsWrapper = wrapper.closest(".posts-wrapper");
      const postId = postsWrapper.id;
      const postMiiIcon_raw = postsWrapper.querySelector(".user-icon")?.src;
      if (!postMiiIcon_raw) return;

      const postMiiIcon_base = postMiiIcon_raw.substring(
        0,
        postMiiIcon_raw.lastIndexOf("/") + 1,
      );

      // Check if the post was made by the current user
      if (postMiiIcon_base != userMiiIcon_base) return;

      const empathyCount =
        postsWrapper.querySelector("h4[id^='count-']").textContent;
      if (empathyCount <= 0) return;

      if (wrapper.querySelector(".view-likers-btn")) return;

      if (!postsWrapper) return console.warn("Cannot find parent post ID");

      const btn = document.createElement("button");
      btn.textContent = "❤️ View Likers";
      btn.className = "view-likers-btn";
      Object.assign(btn.style, {
        marginLeft: "8px",
        background: "#222",
        color: "white",
        border: "1px solid #444",
        borderRadius: "6px",
        padding: "4px 8px",
        cursor: "pointer",
        fontSize: "12px",
      });

      wrapper.insertBefore(btn, wrapper.firstChild);

      btn.addEventListener("click", () => showYeahsPopup(postId));
    });
  }

  async function fetchYeahsID(postId) {
    try {
      const res = await fetch(`/users/downloadUserData.json`, {
        method: "GET",
        credentials: "include",
      });

      const localData = await res.json();

      // Find the post by postId
      const postData = localData.posts.find(
        (post) => post.id.toString() === postId,
      );
      if (!postData) return [];

      // Return an array of objects with id and Mii URL
      return postData.yeahs.map((pid) => ({
        id: pid,
        miiUrl: `https://r2-cdn.pretendo.cc/mii/${pid}/normal_face.png`,
      }));
    } catch (err) {
      console.error("Error fetching likers:", err);
      return [];
    }
  }

  async function showYeahsPopup(postId) {
    const likers = await fetchYeahsID(postId); // now contains [{id, miiUrl}, ...]
    if (!likers.length) return alert("No likes yet.");

    const popup = document.createElement("div");
    Object.assign(popup.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#171717ff",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid #444",
      zIndex: "99999",
      color: "white",
      width: "300px",
      maxHeight: "400px",
      overflowY: "auto",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });

    const title = document.createElement("h3");
    title.textContent = "❤️ Liked by:";
    title.style.marginTop = "0";
    popup.appendChild(title);

    const likersContainer = document.createElement("div");
    Object.assign(likersContainer.style, {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    });

    likers.forEach(({ id, miiUrl }) => {
      const link = document.createElement("a");
      link.href = `/users/${id}`;
      link.target = "_blank"; // Open in new tab

      const miiImg = document.createElement("img");
      miiImg.src = miiUrl;

      Object.assign(miiImg.style, {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "1px solid #444",
        cursor: "pointer",
      });

      miiImg.title = `User ID: ${id}`;

      link.appendChild(miiImg);
      likersContainer.appendChild(link);
    });

    popup.appendChild(likersContainer);

    const close = document.createElement("button");
    close.textContent = "Close";
    Object.assign(close.style, {
      marginTop: "10px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      background: "#000",
      color: "white",
    });
    close.onclick = () => popup.remove();
    popup.appendChild(close);

    document.body.appendChild(popup);
  }

  let applyEnhancements;

  if (postsPage) {
    applyEnhancements = () => {
      addReplyBoxIfNeeded();
      addViewLikes();
    };

    function addReplyBoxIfNeeded() {
      let wrapper = document.querySelector(".community-page-post-box #wrapper");
      if (wrapper && !wrapper.dataset.replybox) {
        wrapper.dataset.replybox = "1";
        addReplyBox(wrapper);
      }
    }
  } else {
    applyEnhancements = () => {
      addViewLikes();
    };
  }

  // Run immediately for already-loaded content
  applyEnhancements();

  // Observe future PJAX loads
  const observer = new MutationObserver(() => {
    applyEnhancements();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
