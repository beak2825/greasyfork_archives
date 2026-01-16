// ==UserScript==
// @name         Inkbunny Quick Block & Favorite Buttons
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Adds quick block and favorite buttons to submission thumbnails. Uses the official Inkbunny API for favorite detection (credentials are sent only to inkbunny.net).
// @author       YourUsername
// @license      MIT
// @match        https://inkbunny.net/*
// @match        https://*.inkbunny.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562759/Inkbunny%20Quick%20Block%20%20Favorite%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/562759/Inkbunny%20Quick%20Block%20%20Favorite%20Buttons.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BLOCK_BUTTON_CLASS = "ib-quick-block-btn";
  const FAV_BUTTON_CLASS = "ib-quick-fav-btn";
  const CONTAINER_CLASS = "quick-action-buttons";
  const SID_STORAGE_KEY = "ib_quick_buttons_api_sid";
  const LOGIN_COOLDOWN_KEY = "ib_quick_buttons_login_cooldown";
  const LOGIN_COOLDOWN_MS = 60000; // 1 minute cooldown after cancelled login

  const SUBMISSION_SELECTOR = [
    "div.widget_thumbnailHugeCompleteFromSubmission",
    "div.widget_thumbnailLargeCompleteFromSubmission",
    "div.widget_thumbnailCompleteFromSubmission",
  ].join(", ");

  let cachedCurrentUserId = null;
  let cachedApiSid = GM_getValue(SID_STORAGE_KEY, null);
  let favoritedSubmissions = new Set();
  let checkedSubmissions = new Set();
  let checkInProgress = false;
  let loginInProgress = null;

  // Inject styles once
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .${CONTAINER_CLASS} {
        display: flex;
        justify-content: space-between;
        padding: 4px;
      }

      .${BLOCK_BUTTON_CLASS},
      .${FAV_BUTTON_CLASS} {
        width: 24px;
        height: 24px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        border: none;
        padding: 0;
        line-height: 1;
      }

      .${BLOCK_BUTTON_CLASS}:hover,
      .${FAV_BUTTON_CLASS}:hover {
        opacity: 1;
      }

      .${FAV_BUTTON_CLASS}[data-favorited="true"] {
        opacity: 1;
      }

      .ib-login-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .ib-login-modal {
        background: #2a2a2a;
        border-radius: 8px;
        padding: 24px;
        max-width: 360px;
        width: 90%;
        color: #fff;
        font-family: sans-serif;
      }

      .ib-login-modal h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
      }

      .ib-login-modal p {
        margin: 0 0 16px 0;
        font-size: 13px;
        color: #aaa;
      }

      .ib-login-modal input {
        width: 100%;
        padding: 10px;
        margin-bottom: 12px;
        border: 1px solid #444;
        border-radius: 4px;
        background: #1a1a1a;
        color: #fff;
        font-size: 14px;
        box-sizing: border-box;
      }

      .ib-login-modal input:focus {
        outline: none;
        border-color: #6a6aff;
      }

      .ib-login-modal-buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .ib-login-modal button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .ib-login-modal button.cancel {
        background: #444;
        color: #fff;
      }

      .ib-login-modal button.submit {
        background: #5a5aff;
        color: #fff;
      }

      .ib-login-modal button:hover {
        opacity: 0.9;
      }

      .ib-login-modal .error {
        color: #ff6b6b;
        font-size: 13px;
        margin-bottom: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  // Debounce utility
  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function getToken() {
    return document.querySelector('input[name="token"]')?.value;
  }

  async function getCurrentUserId() {
    if (cachedCurrentUserId) return cachedCurrentUserId;
    const res = await fetch("https://inkbunny.net/account.php");
    const html = await res.text();
    cachedCurrentUserId = html.match(/name="user_id" value="(\d+)"/)?.[1];
    return cachedCurrentUserId;
  }

  function clearApiSession() {
    cachedApiSid = null;
    GM_deleteValue(SID_STORAGE_KEY);
  }

  function isLoginOnCooldown() {
    const cooldownUntil = GM_getValue(LOGIN_COOLDOWN_KEY, null);
    if (!cooldownUntil) return false;
    if (Date.now() < cooldownUntil) return true;
    GM_deleteValue(LOGIN_COOLDOWN_KEY);
    return false;
  }

  function setLoginCooldown() {
    GM_setValue(LOGIN_COOLDOWN_KEY, Date.now() + LOGIN_COOLDOWN_MS);
  }

  function showLoginModal() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "ib-login-overlay";

      const modal = document.createElement("div");
      modal.className = "ib-login-modal";

      modal.innerHTML = `
        <h3>Inkbunny API Login</h3>
        <p>Authentication Required: Please enter your Inkbunny credentials to enable automatic favorite detection. This script communicates exclusively with the official Inkbunny API. Your login is used only to retrieve your favorite list and is stored locally in your browser's private script storage.</p>
        <div class="error" style="display: none;"></div>
        <input type="text" name="username" placeholder="Username" autocomplete="username">
        <input type="password" name="password" placeholder="Password" autocomplete="current-password">
        <div class="ib-login-modal-buttons">
          <button type="button" class="cancel">Cancel</button>
          <button type="button" class="submit">Login</button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      const usernameInput = modal.querySelector('input[name="username"]');
      const passwordInput = modal.querySelector('input[name="password"]');
      const errorDiv = modal.querySelector(".error");
      const cancelBtn = modal.querySelector("button.cancel");
      const submitBtn = modal.querySelector("button.submit");

      usernameInput.focus();

      function close(result) {
        overlay.remove();
        resolve(result);
      }

      cancelBtn.onclick = () => {
        setLoginCooldown();
        close(null);
      };

      overlay.onclick = (e) => {
        if (e.target === overlay) {
          setLoginCooldown();
          close(null);
        }
      };

      async function doLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
          errorDiv.textContent = "Please enter both username and password.";
          errorDiv.style.display = "block";
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        try {
          const res = await fetch("https://inkbunny.net/api_login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
          });
          const data = await res.json();

          if (data.error_code) {
            errorDiv.textContent = "Login failed: " + data.error_message;
            errorDiv.style.display = "block";
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
            return;
          }

          cachedApiSid = data.sid;
          GM_setValue(SID_STORAGE_KEY, data.sid);
          close(data.sid);
        } catch (e) {
          errorDiv.textContent = "Network error. Please try again.";
          errorDiv.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.textContent = "Login";
        }
      }

      submitBtn.onclick = doLogin;

      passwordInput.onkeydown = (e) => {
        if (e.key === "Enter") doLogin();
      };
    });
  }

  async function getApiSession() {
    if (cachedApiSid) return cachedApiSid;

    if (isLoginOnCooldown()) return null;

    if (loginInProgress) return loginInProgress;

    loginInProgress = showLoginModal();
    const result = await loginInProgress;
    loginInProgress = null;
    return result;
  }

  async function checkFavoritesViaApi(submissionIds) {
    if (submissionIds.length === 0) return;

    const [sid, userId] = await Promise.all([
      getApiSession(),
      getCurrentUserId(),
    ]);

    if (!sid || !userId) return;

    const batchSize = 100;
    for (let i = 0; i < submissionIds.length; i += batchSize) {
      const batch = submissionIds.slice(i, i + batchSize);

      const params = new URLSearchParams({
        sid,
        favs_user_id: userId,
        submission_ids: batch.join(","),
      });

      try {
        const res = await fetch(
          `https://inkbunny.net/api_search.php?${params}`
        );
        const data = await res.json();

        if (data.error_code) {
          console.error("API search failed:", data.error_message);
          if (data.error_code === 2) {
            clearApiSession();
            const newSid = await getApiSession();
            if (newSid) {
              params.set("sid", newSid);
              const retryRes = await fetch(
                `https://inkbunny.net/api_search.php?${params}`
              );
              const retryData = await retryRes.json();
              if (!retryData.error_code && retryData.submissions) {
                retryData.submissions.forEach((sub) => {
                  favoritedSubmissions.add(sub.submission_id);
                });
              }
            }
          }
          batch.forEach((id) => checkedSubmissions.add(id));
          continue;
        }

        if (data.submissions) {
          data.submissions.forEach((sub) => {
            favoritedSubmissions.add(sub.submission_id);
          });
        }

        batch.forEach((id) => checkedSubmissions.add(id));
      } catch (e) {
        console.error("Error checking favorites:", e);
      }
    }

    updateFavoriteButtons();
  }

  function updateFavoriteButtons() {
    document.querySelectorAll(`.${FAV_BUTTON_CLASS}`).forEach((btn) => {
      const subId = btn.dataset.submissionId;
      if (favoritedSubmissions.has(subId) && btn.dataset.favorited !== "true") {
        markAsFavorited(btn);
      }
    });
  }

  async function getTargetUserId(username) {
    const res = await fetch(`https://inkbunny.net/${username}`);
    const html = await res.text();
    return html.match(/user_id=(\d+)/)?.[1];
  }

  async function blockUser(username) {
    const token = getToken();
    const [me, them] = await Promise.all([
      getCurrentUserId(),
      getTargetUserId(username),
    ]);

    if (!token || !me || !them) return alert("Session error.");

    const body = new URLSearchParams({
      token,
      username,
      owner_user_id: me,
      return_to_user_id: them,
    });

    const res = await fetch(
      "https://inkbunny.net/block_artist_content_process.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    if (res.ok && !res.url.includes("error.php")) {
      document
        .querySelectorAll(`div[class*="widget_thumbnail"][class*="Submission"]`)
        .forEach((sub) => {
          if (sub.querySelector(`a[href="/${username}"]`)) sub.remove();
        });
    }
  }

  async function favoriteSubmission(submissionId, btn) {
    const token = getToken();
    if (!token) return alert("Session error.");

    const body = new URLSearchParams({
      token,
      stars: "1",
      add: "true",
      remove: "",
      submission_id: submissionId,
    });

    const res = await fetch("https://inkbunny.net/submissionfav_process.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: body.toString(),
    });

    if (res.ok) {
      markAsFavorited(btn);
      favoritedSubmissions.add(submissionId);
    } else {
      btn.style.opacity = "0.6";
    }
  }

  async function unfavoriteSubmission(submissionId, btn) {
    const token = getToken();
    if (!token) return alert("Session error.");

    const body = new URLSearchParams({
      token,
      stars: "1",
      add: "",
      remove: "true",
      submission_id: submissionId,
    });

    const res = await fetch("https://inkbunny.net/submissionfav_process.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: body.toString(),
    });

    if (res.ok) {
      markAsNotFavorited(btn);
      favoritedSubmissions.delete(submissionId);
    } else {
      btn.style.opacity = "1";
    }
  }

  function markAsFavorited(btn) {
    btn.textContent = "⭐";
    btn.title = "Remove from favorites";
    btn.dataset.favorited = "true";
  }

  function markAsNotFavorited(btn) {
    btn.textContent = "☆";
    btn.title = "Add to favorites";
    btn.dataset.favorited = "false";
  }

  function getSubmissionId(submission) {
    const link = submission.querySelector('a[href*="/s/"]');
    if (link) {
      const match = link.getAttribute("href").match(/\/s\/(\d+)/);
      return match?.[1];
    }
    return null;
  }

  function createButton(emoji, title, className) {
    const btn = document.createElement("span");
    btn.className = className;
    btn.textContent = emoji;
    btn.title = title;
    return btn;
  }

  function getOrCreateContainer(submission) {
    let container = submission.querySelector(`.${CONTAINER_CLASS}`);
    if (!container) {
      container = document.createElement("div");
      container.className = CONTAINER_CLASS;
      submission.appendChild(container);
    }
    return container;
  }

  function addButtons() {
    const submissions = document.querySelectorAll(SUBMISSION_SELECTOR);
    const uncheckedIds = [];

    submissions.forEach((submission) => {
      submission.style.height = "auto";

      const submissionId = getSubmissionId(submission);
      const userLink = submission.querySelector("a.widget_userNameSmall");

      if (submission.querySelector(`.${CONTAINER_CLASS}`)) return;

      const container = getOrCreateContainer(submission);

      // Add block button (left side)
      if (userLink) {
        const username = userLink.getAttribute("href").replace("/", "");
        const blockBtn = createButton(
          "🚫",
          `Block ${username}`,
          BLOCK_BUTTON_CLASS
        );
        blockBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          blockBtn.style.opacity = "0.2";
          blockUser(username);
        };
        container.appendChild(blockBtn);
      } else {
        const placeholder = document.createElement("span");
        placeholder.style.width = "24px";
        container.appendChild(placeholder);
      }

      // Add favorite button (right side)
      if (submissionId) {
        const isFavorited = favoritedSubmissions.has(submissionId);
        const favBtn = createButton(
          isFavorited ? "⭐" : "☆",
          isFavorited ? "Remove from favorites" : "Add to favorites",
          FAV_BUTTON_CLASS
        );
        favBtn.dataset.submissionId = submissionId;
        favBtn.dataset.favorited = isFavorited ? "true" : "false";

        favBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          favBtn.style.opacity = "0.3";
          if (favBtn.dataset.favorited === "true") {
            unfavoriteSubmission(submissionId, favBtn);
          } else {
            favoriteSubmission(submissionId, favBtn);
          }
        };

        container.appendChild(favBtn);

        if (!checkedSubmissions.has(submissionId)) {
          uncheckedIds.push(submissionId);
        }
      }
    });

    if (uncheckedIds.length > 0 && !checkInProgress) {
      checkInProgress = true;
      checkFavoritesViaApi(uncheckedIds).finally(() => {
        checkInProgress = false;
      });
    }
  }

  // Initialize
  injectStyles();
  addButtons();

  const debouncedAddButtons = debounce(addButtons, 250);

  new MutationObserver(() => {
    debouncedAddButtons();
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();