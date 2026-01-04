// ==UserScript==
// @name         sora 2 advanced bio editor
// @namespace    http://alexbadi.es
// @version      1.0.0
// @description  format your bio :yay:
// @author       Alex Badi
// @match        https://sora.chatgpt.com/profile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/552508/sora%202%20advanced%20bio%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/552508/sora%202%20advanced%20bio%20editor.meta.js
// ==/UserScript==

(async function waitForContainer() {
  const container = document.querySelector(
    "section.relative.flex.w-full.flex-col.items-center.text-center > div.flex.w-full.flex-wrap.items-center.justify-center.gap-3"
  );

  if (!container) return setTimeout(waitForContainer, 500);
  if (container.childElementCount < 2) return setTimeout(waitForContainer, 500);
  if (container.querySelector(".advanced-bio-btn")) return;

  let __wp;
  window.webpackChunk_N_E.push([
    [Math.random()],
    {},
    (r) => {
      __wp = r;
    },
  ]);

  const wp98121 = __wp(98121);
  const wp92964 = __wp(92964);
  const toast = wp98121?.Am;

  let network = null;
  let authHeaders = null;

  if (__wp(72038)?.ZP) {
    network = __wp(72038).ZP;
    try {
      authHeaders = await network.getAuthHeaders?.();
    } catch (e) {
      console.warn("getAuthHeaders failed, will fallback to accessToken");
      toast.warn("Couldn't get Auth Headers, will fallback to Session");
    }
  } else {
    console.warn("__wp(72038).ZP not found, will fallback to accessToken");
    toast.warn(
      "wp(72038).ZP not found, will fallback to Session. Sora probably updated."
    );
  }

  let authToken = "";

  async function getAccessToken() {
    if (!wp92964?.hP) return null;
    const session = await wp92964.hP();
    if (!session?.accessToken || typeof session.accessToken !== "string")
      return null;
    return session.accessToken;
  }

  const originalFetch = window.fetch;
  async function ensureAuthToken() {
    if (authHeaders) return;
    if (!authToken) {
      const token = await getAccessToken();
      if (!token) return;
      authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }

  window.fetch = async function (url, options = {}) {
    await ensureAuthToken();
    if (!authHeaders) {
      toast.warn(
        "Session failed, fallback to Fetch modification. Please update your bio first."
      );
      if (!options.headers) options.headers = {};
      if (!options.headers.Authorization && authToken) {
        options.headers.Authorization = authToken;
      }
    }
    return originalFetch(url, options);
  };

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "advanced-bio-btn inline-flex gap-1.5 items-center justify-center whitespace-nowrap text-sm font-semibold focus-visible:outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-default data-[disabled=true]:opacity-50 group/button relative shadow-inset-stroke text-token-text-primary hover:bg-token-bg-active data-[state=open]:bg-token-bg-active hover:shadow-none data-[state=open]:shadow-none py-2 rounded-full h-11 flex-1 px-12";
  button.textContent = "Advanced bio editor";

  button.addEventListener("click", async () => {
    if (!authHeaders && !authToken) {
      const token = await getAccessToken();
      if (!token) {
        toast?.warning("Please edit your current bio to continue.");
        return;
      }
      authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const main = document.querySelector("main");
    if (!main) return;

    const overlay = document.createElement("div");
    overlay.setAttribute("data-state", "open");
    overlay.className = "fixed inset-0 z-dialog bg-black/80";
    overlay.style.pointerEvents = "auto";

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("data-state", "open");
    dialog.className =
      "dialog-content surface-popover fixed left-1/2 top-1/2 z-dialog grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-2xl p-6 shadow-2xl bg-token-bg-primary py-12";
    dialog.tabIndex = -1;

    dialog.innerHTML = `
        <div class="relative">
            <button type="button" id="closeModalBtn" class="fixed left-3 top-2 z-dialog h-8 w-8 flex items-center justify-center rounded-full bg-tertiary p-1 opacity-70 hover:opacity-100">✕</button>
            <div class="max-h-[calc(100svh-4rem)] overflow-y-auto">
                <div class="mx-auto flex w-full max-w-md flex-col items-center gap-4">
                <div class="flex flex-col items-center text-center gap-1">
                    <h2 class="font-semibold text-2xl">Edit your bio</h2>
                    <p class="text-sm max-w-64">You can use new lines and add ASCII images.</p>
                </div>
                <div class="w-full">
                    <div class="pl-4 text-xs text-token-text-secondary">Your biography</div>
                    <textarea id="bioTextarea" class="mt-2 w-full max-w-[42ch] rounded-xl bg-token-bg-lighter" style="padding: 12px; height: 250px; font-family: monospace; font-size: 16px; white-space: pre-wrap; overflow-wrap: break-word;"></textarea>
                    <button type="button" id="centerSelectionButton" class="h-8 w-8 flex items-center justify-centerp-1 opacity-70 hover:opacity-100" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 7C5 6.44772 5.44772 6 6 6H18C18.5523 6 19 6.44772 19 7C19 7.55228 18.5523 8 18 8H6C5.44772 8 5 7.55228 5 7ZM5 12C5 11.4477 5.44772 11 6 11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H6C5.44772 13 5 12.5523 5 12ZM8 17C8 16.4477 8.44772 16 9 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H9C8.44772 18 8 17.5523 8 17Z" fill="#fff"></path>
                    </svg>
                    </button>
                </div>
                <div class="flex flex-col gap-2 py-2 tablet:flex-row tablet:gap-6 rounded-xl bg-token-bg-lighter" style="padding: 25px;margin-bottom: 10px;">
                    <div class="flex shrink-0 flex-col gap-2 tablet:w-3/5" style="width: 80% !important;">
                    <div class="font-semibold">Reload after editing</div>
                    <div class="leading-[18px] text-token-text-secondary">
                        <div>It is recommended to reload the page after editing.</div>
                    </div>
                    </div>
                    <div>
                    <button type="button" role="switch" aria-checked="false" data-state="unchecked" value="off" class="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-6 w-11 focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary" id="rswitch">
                        <span data-state="unchecked" class="pointer-events-none block rounded-full shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5 h-5 w-5 bg-background"></span>
                    </button>
                    </div>
                </div>
                <div class="flex w-full gap-4">
                    <button id="doneBtn" class="inline-flex gap-1.5 items-center justify-center text-sm font-semibold bg-token-bg-inverse text-token-text-inverse px-3 py-2 rounded-full h-12 flex-1 disabled:opacity-50">
                    <div style="height: 16px;width: 16px;">
                        <div class="spin_loader"></div>
                    </div> Done
                    </button>
                </div>
            </div>
        </div>
        `;

    const style = document.createElement("style");
    style.id = "spin-loader-style";
    style.textContent = `
        @keyframes spinrotation { 100% { transform: rotate(360deg); } }
                    .spin_loader {
                        animation: spinrotation 1s linear infinite;
                        aspect-ratio: 1/1;
                        border: .2rem solid #d9d9d9;
                        border-bottom-color: #2e2e2e;
                        border-radius: 50%;
                        box-sizing: border-box;
                        display: inline-block;
                        height: 100%;
                    }

        button:disabled .spin_loader {
        display: inline-block;
        }

        button:not(:disabled) .spin_loader {
        display: none;
        }
  `;

    document.head.appendChild(style);

    main.appendChild(overlay);
    main.appendChild(dialog);

    const textarea = document.getElementById("bioTextarea");
    const centerBtn = document.getElementById("centerSelectionButton");

    centerBtn.addEventListener("click", () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;

      const selectedText = textarea.value.slice(start, end);

      const maxChars = 42;

      const lines = selectedText.split("\n");

      const centeredLines = lines.map((line) => {
        const trimmed = line.trim();
        const spacesToAdd = Math.floor((maxChars - trimmed.length) / 2);
        const padding = " ".repeat(Math.max(0, spacesToAdd));
        return padding + trimmed;
      });

      const newText = centeredLines.join("\n");

      textarea.setRangeText(newText, start, end, "end");

      textarea.selectionStart = start;
      textarea.selectionEnd = start + newText.length;
      textarea.focus();
    });

    let ischecked = false;
    const switchEl = dialog.querySelector("#rswitch");
    const switchHandle = dialog.querySelector("#rswitch span");

    function setChecked(value) {
      switchEl.setAttribute("aria-checked", value.toString());
      switchEl.setAttribute("data-state", value ? "checked" : "unchecked");
      switchEl.setAttribute("value", (value && "on") || "off");
      switchHandle.setAttribute("data-state", value ? "checked" : "unchecked");

      ischecked = value;
    }

    dialog.querySelector("#rswitch").onclick = function () {
      setChecked(!ischecked);
    };

    dialog.querySelector("#closeModalBtn").addEventListener("click", () => {
      overlay.remove();
      dialog.remove();
    });

    const originalBioElement = document.querySelector(
      "body > main > div.h-full.max-h-screen.min-h-screen.w-full > div.h-full.max-h-screen.min-h-screen.w-full > div > div > div > div > div > section.relative.flex.w-full.flex-col.items-center.gap-4.text-center.tablet\\:max-w-md > div.flex.w-full.flex-col.items-center.gap-2 > div:nth-child(2) > button"
    );
    const secondaryBioElement = document.querySelector(
      "body > main > div.h-full.max-h-screen.min-h-screen.w-full > div.h-full.max-h-screen.min-h-screen.w-full > div > div > div > div > div > section.relative.flex.w-full.flex-col.items-center.gap-4.text-center.tablet\\:max-w-md > div.flex.w-full.flex-col.items-center.gap-2 > div:nth-child(2)"
    );
    const currentBio =
      originalBioElement?.innerText || secondaryBioElement?.innerText || "";
    dialog.querySelector("#bioTextarea").value = currentBio;

    async function done(doReload) {
      dialog.querySelector("#doneBtn").disabled = true;
      const bioText = dialog.querySelector("#bioTextarea").value;

      let userId = null;
      let deviceId = null;

      if (__STATSIG_SDK__) {
        const currentUser = __STATSIG_SDK__.getCurrentUser();
        userId = currentUser.userID;
        deviceId = currentUser.customIDs.stableID;
      } else {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.includes("user")) {
            userId = key.split("/")[1];
            break;
          }
        }
        const store = JSON.parse(
          localStorage.getItem("STATSIG_LOCAL_STORAGE_INTERNAL_STORE_V4") ||
            "{}"
        );
        const firstKey = Object.keys(store)[0];
        deviceId = store[firstKey]?.stableIDUsed;
      }

      if (!userId || !deviceId) {
        console.error("Cannot find userId or deviceId");
        toast.error("Cannot find userId or deviceId");
        dialog.querySelector("#doneBtn").disabled = false;
        return;
      }

      try {
        const response = await fetch(
          `https://sora.chatgpt.com/backend/project_y/profile/${userId}`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "content-type": "application/json",
              "oai-device-id": deviceId,
              Authorization: authHeaders?.Authorization || authToken,
            },
            body: JSON.stringify({ description: bioText }),
            credentials: "include",
          }
        );
        if (!response.ok) {
          toast.error(`Response wasn't ok. Status: ${response.status}`);
        } else {
          toast.success(`Your bio was edited! Congrats!`);
          if (doReload) {
            setTimeout(() => {
              toast.success(`Reloading`);
              window.location.reload();
            }, 1000);
          }
        }
        if (originalBioElement) {
          originalBioElement.innerText = bioText;
          originalBioElement.outerText = bioText;
        }
        console.log("Bio updated successfully!");
      } catch (err) {
        console.error("Failed to update bio:", err);
      }

      overlay.remove();
      dialog.remove();
      style.remove();
    }

    dialog.querySelector("#doneBtn").addEventListener("click", async () => {
      await done(ischecked);
    });
  });

  container.appendChild(button);
})();
