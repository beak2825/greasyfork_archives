// ==UserScript==
// @name         Zhihu Blacklist Helper (Fixed API)
// @namespace    
// @version      3.3
// @description  Efficiently hide blocked content on Zhihu. Fixed "Block" button stuck on loading.
// @match        *://www.zhihu.com/*
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557865/Zhihu%20Blacklist%20Helper%20%28Fixed%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557865/Zhihu%20Blacklist%20Helper%20%28Fixed%20API%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Store = {
        get config() {
            return GM_getValue("Config", {
                hideBlocked: false,
                tempShow: false
            });
        },
        set config(val) { GM_setValue("Config", val); },
        get blockedList() { return GM_getValue("blockedIdList", []); },
        set blockedList(val) { GM_setValue("blockedIdList", [...new Set(val)]); }
    };

    class ZhihuBlocker {
        constructor() {
            this.observer = null;
            this.isFetching = false;
            this.init();
        }

        async init() {
            if (Store.blockedList.length === 0) await this.syncBlockList();
            this.scanPage();
            this.startObserver();
            this.injectFloatingButton();
            this.fixCopy();
        }

        // Helper to get XSRF token from cookies (Required for blocking)
        getXsrfToken() {
            // Try common cookie name variations
            const patterns = [
                /_xsrf=([^;]+)/,
                /xsrf-token=([^;]+)/,
                /XSRF-TOKEN=([^;]+)/,
                /xsrf_token=([^;]+)/
            ];

            for (const pattern of patterns) {
                const match = document.cookie.match(pattern);
                if (match) return decodeURIComponent(match[1]);
            }

            return '';
        }

        async syncBlockList() {
            if (this.isFetching) return;
            this.isFetching = true;
            let offset = 0;
            let isEnd = false;
            let newBlockedList = [];

            const btn = document.getElementById('zbh-float-btn');
            if(btn) btn.textContent = "⏳";

            try {
                while (!isEnd) {
                    const response = await fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?limit=20&offset=${offset}`);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const json = await response.json();
                    if (!json.data) break;
                    json.data.forEach(user => {
                        if (user.id) newBlockedList.push(String(user.id));
                    });
                    if (json.paging && json.paging.is_end === false) offset += 20;
                    else isEnd = true;
                }
                Store.blockedList = newBlockedList;
                console.log(`[ZBH] Synced ${newBlockedList.length} users.`);
                if(btn) btn.textContent = "⚙️";
            } catch (err) {
                console.error("[ZBH] Sync failed", err);
                if(btn) {
                    btn.textContent = "❌";
                    btn.title = "Sync failed. Click to retry.";
                    setTimeout(() => {
                        btn.textContent = "⚙️";
                        btn.title = "";
                    }, 3000);
                }
            } finally {
                this.isFetching = false;
            }
        }

        startObserver() {
            const config = { childList: true, subtree: true };
            let timeout;
            this.observer = new MutationObserver((mutations) => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => this.scanPage(), 100);
            });
            this.observer.observe(document.body, config);
        }

        scanPage() {
            const listItems = document.querySelectorAll('.List-item, .Card.TopstoryItem');
            const blockedIds = Store.blockedList;

            listItems.forEach(item => {
                if (item.dataset.zbhProcessed === "true") {
                    this.applyVisibility(item, item.dataset.zbhIsBlocked === "true");
                    return;
                }

                const contentItem = item.querySelector('.ContentItem');
                if (!contentItem) return;

                // 1. Get Hash ID (Stable ID for checking if blocked)
                let authorId = "";
                let type = "";
                try {
                    const extra = JSON.parse(contentItem.getAttribute("data-za-extra-module") || "{}");
                    authorId = String(extra.card?.content?.author_member_hash_id || "");
                    type = extra.card?.content?.type || "";
                } catch (e) {}

                if (!authorId) return;

                // 2. Get User Slug (Required for API Calls) - CRITICAL FIX
                // We look for the user link inside the item
                const userLink = item.querySelector('.UserLink-link');
                let userSlug = "";
                let userName = "User";

                if (userLink) {
                    // Extract slug from href like "/people/example-user"
                    const href = userLink.getAttribute('href') || "";
                    const parts = href.split('/');
                    // usually the last part, but sometimes there are query params
                    userSlug = parts[parts.length - 1] || parts[parts.length - 2];
                    userName = userLink.innerText;
                } else {
                    // Fallback for some layouts
                    const zop = JSON.parse(contentItem.getAttribute("data-zop") || "{}");
                    userName = zop.authorName || "User";
                }

                // If we can't find a slug, we can't provide a block button
                if (!userSlug && type === "Answer") return;

                const isBlocked = blockedIds.includes(authorId);

                if (type === "Answer") {
                    this.injectBlockButton(item, userSlug, authorId, isBlocked);
                }

                item.dataset.zbhProcessed = "true";
                item.dataset.zbhIsBlocked = isBlocked ? "true" : "false";
                item.dataset.zbhAuthorName = userName;
                this.applyVisibility(item, isBlocked);
            });
        }

        applyVisibility(item, isBlocked) {
            const cfg = Store.config;
            const content = item.querySelector('.ContentItem') || item.firstElementChild;
            let placeholder = item.querySelector('.zbh-placeholder');

            if (!isBlocked) {
                if (content) content.hidden = false;
                if (placeholder) placeholder.hidden = true;
                item.style.display = '';
                return;
            }

            if (cfg.hideBlocked) {
                if (cfg.tempShow) {
                    if (content) content.hidden = true;
                    if (!placeholder) {
                        placeholder = document.createElement('div');
                        placeholder.className = 'zbh-placeholder';
                        placeholder.style.cssText = "background:#f6f6f6; color:#999; text-align:center; padding:10px; cursor:pointer; margin-bottom:10px; border-radius:4px;";
                        placeholder.textContent = `🚫 Blocked content from ${item.dataset.zbhAuthorName} (Click to view)`;
                        placeholder.onclick = () => { content.hidden = false; placeholder.hidden = true; };
                        item.appendChild(placeholder);
                    } else {
                        placeholder.hidden = false;
                    }
                } else {
                    if (content) content.hidden = true;
                    item.style.display = 'none';
                }
            } else {
                if (content) content.hidden = false;
                item.style.display = '';
            }
        }

        injectBlockButton(item, slug, id, isBlocked) {
            const authorInfo = item.querySelector('.AuthorInfo');
            if (!authorInfo || authorInfo.querySelector('.zbh-btn')) return;

            const btn = document.createElement('button');
            btn.className = `Button zbh-btn ${isBlocked ? 'Button--red' : 'Button--blue'}`;
            btn.textContent = isBlocked ? "Blocked" : "Block";
            btn.style.cssText = "margin-left: 10px; padding: 0 8px; height: 24px; line-height: 22px; font-size: 12px;";

            btn.onclick = async (e) => {
                e.stopPropagation();
                await this.toggleBlockAction(slug, id, btn);
            };
            authorInfo.appendChild(btn);
        }

        async toggleBlockAction(slug, id, btnElement) {
            const isBlocked = btnElement.classList.contains('Button--red');
            const method = isBlocked ? "DELETE" : "POST";
            const url = `https://www.zhihu.com/api/v4/members/${slug}/actions/block`;

            // Check for XSRF token before making request
            const xsrfToken = this.getXsrfToken();
            if (!xsrfToken) {
                btnElement.textContent = "Login required";
                btnElement.title = "Please log in to Zhihu";
                setTimeout(() => {
                    btnElement.textContent = isBlocked ? "Blocked" : "Block";
                    btnElement.title = "";
                }, 2000);
                return;
            }

            btnElement.disabled = true;
            btnElement.textContent = "...";

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'x-xsrf-token': xsrfToken, // Security Header
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    let list = Store.blockedList;
                    if (isBlocked) list = list.filter(x => x !== id);
                    else list.push(id);
                    Store.blockedList = list;

                    const newStatus = !isBlocked;
                    btnElement.classList.toggle('Button--red', newStatus);
                    btnElement.classList.toggle('Button--blue', !newStatus);
                    btnElement.textContent = newStatus ? "Blocked" : "Block";
                    btnElement.title = "";

                    // Force a re-scan to update UI visibility immediately
                    document.querySelectorAll(`[data-zbh-processed]`).forEach(el => {
                         // Only re-process the item we just clicked to save performance
                         if(el.contains(btnElement)) {
                             el.removeAttribute('data-zbh-processed');
                         }
                    });
                    this.scanPage();
                } else {
                    // Better error messages based on status code
                    let errorMsg;
                    if (res.status === 401 || res.status === 403) {
                        errorMsg = "Auth failed";
                    } else if (res.status === 429) {
                        errorMsg = "Rate limited";
                    } else {
                        errorMsg = `Error ${res.status}`;
                    }
                    console.error(`[ZBH] Block action failed: ${res.status}`);
                    btnElement.textContent = errorMsg;
                    btnElement.title = `Failed to ${isBlocked ? 'unblock' : 'block'}. Click to retry.`;
                    setTimeout(() => {
                        btnElement.textContent = isBlocked ? "Blocked" : "Block";
                        btnElement.title = "";
                    }, 2500);
                }
            } catch (err) {
                console.error("[ZBH] Network error:", err);
                btnElement.textContent = "Network error";
                btnElement.title = "Check your connection";
                setTimeout(() => {
                    btnElement.textContent = isBlocked ? "Blocked" : "Block";
                    btnElement.title = "";
                }, 2500);
            } finally {
                btnElement.disabled = false;
            }
        }

        injectFloatingButton() {
            if(document.getElementById('zbh-float-btn')) return;
            const btn = document.createElement('div');
            btn.id = 'zbh-float-btn';
            btn.textContent = "⚙️";
            btn.style.cssText = `position: fixed; bottom: 80px; right: 20px; width: 40px; height: 40px; background: white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); text-align: center; line-height: 40px; font-size: 20px; cursor: pointer; z-index: 9999; user-select: none; transition: transform 0.2s;`;
            btn.onmouseenter = () => btn.style.transform = "scale(1.1)";
            btn.onmouseleave = () => btn.style.transform = "scale(1)";
            btn.onclick = () => this.toggleSettingsPanel();
            document.body.appendChild(btn);
        }

        toggleSettingsPanel() {
            let panel = document.getElementById('zbh-panel');
            let overlay = document.getElementById('zbh-overlay');
            if (panel) {
                panel.remove();
                if (overlay) overlay.remove();
                return;
            }

            const cfg = Store.config;

            // Create overlay backdrop
            overlay = document.createElement('div');
            overlay.id = 'zbh-overlay';
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 9998; cursor: pointer;`;

            // Create panel
            panel = document.createElement('div');
            panel.id = 'zbh-panel';
            panel.style.cssText = `position: fixed; bottom: 130px; right: 20px; z-index: 9999; background: white; border: 1px solid #ebebeb; padding: 15px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; min-width: 250px;`;

            const createCheck = (label, key) => `<div style="margin-bottom: 8px;"><label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="zbh-${key}" ${cfg[key] ? 'checked' : ''} style="margin-right:8px;">${label}</label></div>`;

            panel.innerHTML = `<div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">Blacklist Helper</div>${createCheck("Hide items completely", "hideBlocked")}${createCheck("Show 'Blocked' placeholder", "tempShow")}<div style="margin-top:15px; display:flex; justify-content:space-between;"><button id="zbh-refresh" style="cursor:pointer; background:none; border:none; color:#175199;">🔄 Sync</button><button id="zbh-save" style="cursor:pointer; background:#0084ff; color:white; border:none; padding:5px 10px; border-radius:4px;">Save</button></div>`;

            // Append overlay and panel
            document.body.appendChild(overlay);
            document.body.appendChild(panel);

            // Close panel when clicking outside (on overlay)
            overlay.onclick = () => {
                panel.remove();
                overlay.remove();
            };

            // Prevent panel clicks from closing the overlay
            panel.onclick = (e) => {
                e.stopPropagation();
            };

            document.getElementById('zbh-save').onclick = () => {
                Store.config = {
                    hideBlocked: document.getElementById('zbh-hideBlocked').checked,
                    tempShow: document.getElementById('zbh-tempShow').checked
                };
                panel.remove();
                overlay.remove();
                document.querySelectorAll('[data-zbh-processed]').forEach(el => el.removeAttribute('data-zbh-processed'));
                this.scanPage();
            };
            document.getElementById('zbh-refresh').onclick = async () => {
                 document.getElementById('zbh-refresh').textContent = "Syncing...";
                 await this.syncBlockList();
                 document.getElementById('zbh-refresh').textContent = "Done!";
            };
        }

        fixCopy() { document.addEventListener('copy', (e) => e.stopPropagation(), true); }
    }

    new ZhihuBlocker();
})();