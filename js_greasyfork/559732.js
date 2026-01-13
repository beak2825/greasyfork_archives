// ==UserScript==
// @name         Juxtaposition Pretendo Enhancer
// @namespace    https://github.com/ItsFuntum/Juxtaposition-Enhancer
// @version      2026-01-12
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

  if (communityPage) {
    const communityId = communityPage[1];
    waitForCommunityInfo(() => {
      const popupBackdrop = document.createElement("div");
      popupBackdrop.className = "modal-backdrop";
      popupBackdrop.style.display = "flex";
      document.body.appendChild(popupBackdrop);

      const popup = document.createElement("div");
      popup.id = "add-post-page";
      popup.className = "add-post-page official-user-post";
      popup.style.display = "flex";

      popup.innerHTML = `
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
          <input type="radio" name="_post_type" checked value="body">
        </li>
        <li class="textarea-menu-memo">
          <input type="radio" name="_post_type" value="painting">
        </li>
      </menu>

      <textarea id="new-post-text" name="body" class="textarea-text" maxlength="280" placeholder="Enter text here..."></textarea>

      <div id="new-post-memo" class="textarea-memo" style="display:none">
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

  <div id="button-wrapper">
    <input type="submit" class="post-button fixed-bottom-button" value="Post">
  </div>
</form>
`;

      document.querySelector(".community-top").appendChild(popup);

      // --- Feeling selector: change Mii expression when clicking buttons ---
      const miiFace = popup.querySelector("#mii-face");
      const feelingButtons = popup.querySelectorAll("input[name='feeling_id']");

      feelingButtons.forEach((btn) => {
        btn.addEventListener("change", () => {
          const url = btn.dataset.miiFaceUrl;
          if (url) miiFace.src = url;
        });
      });
    });
  }

  // --- Instead of starting with just the observer ---
  async function addReplyBox(wrapper) {
    const communityLink = document.querySelector(
      '.post-meta-wrapper h4 a[href^="/titles/"]'
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

    const popup = document.createElement("div");
    popup.id = "add-post-page";
    popup.className = "add-post-page official-user-post";
    popup.style.display = "flex";

    popup.innerHTML = `
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
          <input type="radio" name="_post_type" checked value="body">
        </li>
        <li class="textarea-menu-memo">
          <input type="radio" name="_post_type" value="painting">
        </li>
      </menu>

      <textarea id="new-post-text" name="body" class="textarea-text" maxlength="280" placeholder="Enter text here..."></textarea>

      <div id="new-post-memo" class="textarea-memo" style="display:none">
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

  <div id="button-wrapper">
    <input type="submit" class="post-button fixed-bottom-button" value="Reply">
  </div>
</form>
`;

    postsWrapper.appendChild(popup);

    // --- Feeling selector: change Mii expression when clicking buttons ---
    const miiFace = popup.querySelector("#mii-face");
    const feelingButtons = popup.querySelectorAll("input[name='feeling_id']");

    feelingButtons.forEach((btn) => {
      btn.addEventListener("change", () => {
        const url = btn.dataset.miiFaceUrl;
        if (url) miiFace.src = url;
      });
    });
  }

  function addViewLikes() {
    const wrappers = document.querySelectorAll(".post-buttons-wrapper");
    const userMiiIcon_raw = document.querySelector(".mii-icon").src;
    const userMiiIcon_base = userMiiIcon_raw.substring(
      0,
      userMiiIcon_raw.lastIndexOf("/") + 1
    );

    wrappers.forEach((wrapper) => {
      const postsWrapper = wrapper.closest(".posts-wrapper");
      const postId = postsWrapper.id;
      const postMiiIcon_raw = postsWrapper.querySelector(".user-icon ").src;
      const postMiiIcon_base = postMiiIcon_raw.substring(
        0,
        postMiiIcon_raw.lastIndexOf("/") + 1
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
        (post) => post.id.toString() === postId
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