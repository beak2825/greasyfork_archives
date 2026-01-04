// ==UserScript==
// @name         Discourse 表情选择器 (Emoji Picker) core lite
// @namespace    https://github.com/stevessr/bug-v3
// @version      1.2.5
// @description  Discourse 论坛表情选择器 - 核心功能 (Emoji picker for Discourse - Core features only)
// @author       stevessr
// @match        https://linux.do/*
// @match        https://meta.discourse.org/*
// @match        https://*.discourse.org/*
// @match        http://localhost:5173/*
// @exclude      https://linux.do/a/*
// @match        https://idcflare.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/stevessr/bug-v3
// @supportURL   https://github.com/stevessr/bug-v3/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554979/Discourse%20%E8%A1%A8%E6%83%85%E9%80%89%E6%8B%A9%E5%99%A8%20%28Emoji%20Picker%29%20core%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/554979/Discourse%20%E8%A1%A8%E6%83%85%E9%80%89%E6%8B%A9%E5%99%A8%20%28Emoji%20Picker%29%20core%20lite.meta.js
// ==/UserScript==

(function() {
'use strict';

(function() {
	async function fetchManifest(url) {
		try {
			if (typeof fetch === "undefined") return null;
			const manifestUrl = url ? `${url}/manifest.json` : "https://video2gif-pages.pages.dev/assets/json/manifest.json";
			const res = await fetch(manifestUrl, {
				cache: "no-cache",
				credentials: "omit"
			});
			if (!res.ok) return null;
			return await res.json();
		} catch (err) {
			return null;
		}
	}
	async function fetchGroup(groupId, url) {
		try {
			if (typeof fetch === "undefined") return null;
			const fileName = url ? `${url}/${groupId}.json` : `https://video2gif-pages.pages.dev/assets/json/${groupId}.json`;
			const res = await fetch(fileName, {
				cache: "no-cache",
				credentials: "omit"
			});
			if (!res.ok) return null;
			return await res.json();
		} catch (err) {
			return null;
		}
	}
	async function loadAndFilterDefaultEmojiGroups(url, hostname) {
		try {
			const manifest = await fetchManifest(url);
			if (!manifest || !Array.isArray(manifest.groups)) return [];
			const validGroups = (await Promise.all(manifest.groups.map(async (groupInfo) => {
				return await fetchGroup(groupInfo.id, url);
			}))).filter((group) => group !== null);
			if (!hostname) return validGroups;
			return validGroups.map((group) => {
				const filteredEmojis = group.emojis.filter((emoji) => {
					try {
						const url$1 = emoji.url;
						if (!url$1) return false;
						const emojiHostname = new URL(url$1).hostname;
						return emojiHostname === hostname || emojiHostname.endsWith("." + hostname);
					} catch (e) {
						return true;
					}
				});
				return {
					...group,
					emojis: filteredEmojis
				};
			}).filter((group) => group.emojis.length > 0);
		} catch (err) {
			console.warn("Error loading and filtering default emoji groups:", err);
			return [];
		}
	}
	var STORAGE_KEY = "emoji_extension_userscript_data";
	var SETTINGS_KEY = "emoji_extension_userscript_settings";
	var USAGE_STATS_KEY = "emoji_extension_userscript_usage_stats";
	const DEFAULT_USER_SETTINGS = {
		imageScale: 30,
		gridColumns: 4,
		outputFormat: "markdown",
		forceMobileMode: false,
		defaultGroup: "nachoneko",
		showSearchBar: true,
		enableFloatingPreview: true,
		enableCalloutSuggestions: true,
		enableBatchParseImages: true
	};
	function loadDataFromLocalStorage() {
		try {
			const groupsData = localStorage.getItem(STORAGE_KEY);
			let emojiGroups = [];
			if (groupsData) try {
				const parsed = JSON.parse(groupsData);
				if (Array.isArray(parsed) && parsed.length > 0) emojiGroups = parsed;
			} catch (e) {
				console.warn("[Userscript] Failed to parse stored emoji groups:", e);
			}
			if (emojiGroups.length === 0) emojiGroups = [];
			const settingsData = localStorage.getItem(SETTINGS_KEY);
			let settings = { ...DEFAULT_USER_SETTINGS };
			if (settingsData) try {
				const parsed = JSON.parse(settingsData);
				if (parsed && typeof parsed === "object") settings = {
					...settings,
					...parsed
				};
			} catch (e) {
				console.warn("[Userscript] Failed to parse stored settings:", e);
			}
			emojiGroups = emojiGroups.filter((g) => g.id !== "favorites");
			console.log("[Userscript] Loaded data from localStorage:", {
				groupsCount: emojiGroups.length,
				emojisCount: emojiGroups.reduce((acc, g) => acc + (g.emojis?.length || 0), 0),
				settings
			});
			return {
				emojiGroups,
				settings
			};
		} catch (error) {
			console.error("[Userscript] Failed to load from localStorage:", error);
			return {
				emojiGroups: [],
				settings: { ...DEFAULT_USER_SETTINGS }
			};
		}
	}
	async function loadDataFromLocalStorageAsync(hostname) {
		try {
			const local = loadDataFromLocalStorage();
			if (local.emojiGroups && local.emojiGroups.length > 0) return local;
			const remoteUrl = localStorage.getItem("emoji_extension_remote_config_url");
			const configUrl = remoteUrl && typeof remoteUrl === "string" && remoteUrl.trim().length > 0 ? remoteUrl : "https://video2gif-pages.pages.dev/assets/json";
			try {
				const groups = await loadAndFilterDefaultEmojiGroups(configUrl, hostname);
				if (groups && groups.length > 0) {
					try {
						localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
					} catch (e) {
						console.warn("[Userscript] Failed to persist fetched groups to localStorage", e);
					}
					return {
						emojiGroups: groups.filter((g) => g.id !== "favorites"),
						settings: local.settings
					};
				}
			} catch (err) {
				console.warn(`[Userscript] Failed to fetch config from ${configUrl}:`, err);
			}
			return {
				emojiGroups: [],
				settings: local.settings
			};
		} catch (error) {
			console.error("[Userscript] loadDataFromLocalStorageAsync failed:", error);
			return {
				emojiGroups: [],
				settings: { ...DEFAULT_USER_SETTINGS }
			};
		}
	}
	function saveDataToLocalStorage(data) {
		try {
			if (data.emojiGroups) localStorage.setItem(STORAGE_KEY, JSON.stringify(data.emojiGroups));
			if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
		} catch (error) {
			console.error("[Userscript] Failed to save to localStorage:", error);
		}
	}
	function addEmojiToUserscript(emojiData) {
		try {
			const data = loadDataFromLocalStorage();
			let userGroup = data.emojiGroups.find((g) => g.id === "user_added");
			if (!userGroup) {
				userGroup = {
					id: "user_added",
					name: "用户添加",
					icon: "⭐",
					order: 999,
					emojis: []
				};
				data.emojiGroups.push(userGroup);
			}
			if (!userGroup.emojis.some((e) => e.url === emojiData.url || e.name === emojiData.name)) {
				userGroup.emojis.push({
					packet: Date.now(),
					name: emojiData.name,
					url: emojiData.url
				});
				saveDataToLocalStorage({ emojiGroups: data.emojiGroups });
				console.log("[Userscript] Added emoji to user group:", emojiData.name);
			} else console.log("[Userscript] Emoji already exists:", emojiData.name);
		} catch (error) {
			console.error("[Userscript] Failed to add emoji:", error);
		}
	}
	function trackEmojiUsage(emojiName, emojiUrl) {
		try {
			const key = `${emojiName}|${emojiUrl}`;
			const statsData = localStorage.getItem(USAGE_STATS_KEY);
			let stats = {};
			if (statsData) try {
				stats = JSON.parse(statsData);
			} catch (e) {
				console.warn("[Userscript] Failed to parse usage stats:", e);
			}
			if (!stats[key]) stats[key] = {
				count: 0,
				lastUsed: 0
			};
			stats[key].count++;
			stats[key].lastUsed = Date.now();
			localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats));
		} catch (error) {
			console.error("[Userscript] Failed to track emoji usage:", error);
		}
	}
	function getPopularEmojis(limit = 20) {
		try {
			const statsData = localStorage.getItem(USAGE_STATS_KEY);
			if (!statsData) return [];
			const stats = JSON.parse(statsData);
			return Object.entries(stats).map(([key, data]) => {
				const [name, url] = key.split("|");
				return {
					name,
					url,
					count: data.count,
					lastUsed: data.lastUsed
				};
			}).sort((a, b) => b.count - a.count).slice(0, limit);
		} catch (error) {
			console.error("[Userscript] Failed to get popular emojis:", error);
			return [];
		}
	}
	function clearEmojiUsageStats() {
		try {
			localStorage.removeItem(USAGE_STATS_KEY);
			console.log("[Userscript] Cleared emoji usage statistics");
		} catch (error) {
			console.error("[Userscript] Failed to clear usage stats:", error);
		}
	}
	const userscriptState = {
		emojiGroups: [],
		settings: { ...DEFAULT_USER_SETTINGS },
		emojiUsageStats: {}
	};
	function createEl(tag, opts) {
		const el = document.createElement(tag);
		if (opts) {
			if (opts.width) el.style.width = opts.width;
			if (opts.height) el.style.height = opts.height;
			if (opts.className) el.className = opts.className;
			if (opts.text) el.textContent = opts.text;
			if (opts.placeholder && "placeholder" in el) el.placeholder = opts.placeholder;
			if (opts.type && "type" in el) el.type = opts.type;
			if (opts.value !== void 0 && "value" in el) el.value = opts.value;
			if (opts.style) el.style.cssText = opts.style;
			if (opts.src && "src" in el) el.src = opts.src;
			if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k]);
			if (opts.dataset) for (const k in opts.dataset) el.dataset[k] = opts.dataset[k];
			if (opts.innerHTML) el.innerHTML = opts.innerHTML;
			if (opts.title) el.title = opts.title;
			if (opts.alt && "alt" in el) el.alt = opts.alt;
			if (opts.id) el.id = opts.id;
			if (opts.on) for (const [evt, handler] of Object.entries(opts.on)) el.addEventListener(evt, handler);
		}
		return el;
	}
	function extractEmojiFromImage(img, titleElement) {
		const url = img.src;
		if (!url || !url.startsWith("http")) return null;
		let name = "";
		const parts = (titleElement.textContent || "").split("·");
		if (parts.length > 0) name = parts[0].trim();
		if (!name || name.length < 2) name = img.alt || img.title || extractNameFromUrl$1(url);
		name = name.trim();
		if (name.length === 0) name = "表情";
		return {
			name,
			url
		};
	}
	function extractEmojiDataFromLightboxWrapper(lightboxWrapper) {
		const results = [];
		const anchor = lightboxWrapper.querySelector("a.lightbox");
		const img = lightboxWrapper.querySelector("img");
		if (!anchor || !img) return results;
		const title = anchor.getAttribute("title") || "";
		const originalUrl = anchor.getAttribute("href") || "";
		const downloadUrl = anchor.getAttribute("data-download-href") || "";
		const imgSrc = img.getAttribute("src") || "";
		let name = title || img.getAttribute("alt") || "";
		if (!name || name.length < 2) name = extractNameFromUrl$1(originalUrl || downloadUrl || imgSrc);
		name = name.replace(/\\.(webp|jpg|jpeg|png|gif)$/i, "").trim() || "表情";
		const urlToUse = originalUrl || downloadUrl || imgSrc;
		if (urlToUse && urlToUse.startsWith("http")) results.push({
			name,
			url: urlToUse
		});
		return results;
	}
	function extractNameFromUrl$1(url) {
		try {
			const nameWithoutExt = (new URL(url).pathname.split("/").pop() || "").replace(/\.[^/.]+$/, "");
			const decoded = decodeURIComponent(nameWithoutExt);
			if (/^[0-9a-f]{8,}$/i.test(decoded) || decoded.length < 2) return "表情";
			return decoded || "表情";
		} catch {
			return "表情";
		}
	}
	function createAddButton$1(emojiData) {
		const link = createEl("a", {
			className: "image-source-link emoji-add-link",
			style: `
    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-size: inherit;
    font-family: inherit;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: 2px solid #ffffff;
    border-radius: 6px;
    padding: 4px 8px;
    margin: 0 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    font-weight: 600;
  `
		});
		link.addEventListener("mouseenter", () => {
			if (!link.innerHTML.includes("已添加") && !link.innerHTML.includes("失败")) {
				link.style.background = "linear-gradient(135deg, #3730a3, #5b21b6)";
				link.style.transform = "scale(1.05)";
				link.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
			}
		});
		link.addEventListener("mouseleave", () => {
			if (!link.innerHTML.includes("已添加") && !link.innerHTML.includes("失败")) {
				link.style.background = "linear-gradient(135deg, #4f46e5, #7c3aed)";
				link.style.transform = "scale(1)";
				link.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
			}
		});
		link.innerHTML = `
    <svg class="fa d-icon d-icon-plus svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
      <path d="M12 4c.55 0 1 .45 1 1v6h6c.55 0 1 .45 1 1s-.45 1-1 1h-6v6c0 .55-.45 1-1 1s-1-.45-1-1v-6H5c-.55 0-1-.45-1-1s.45-1 1-1h6V5c0-.55.45-1 1-1z"/>
    </svg>添加表情
  `;
		link.title = "添加到用户表情";
		link.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const originalHTML = link.innerHTML;
			const originalStyle = link.style.cssText;
			try {
				addEmojiToUserscript(emojiData);
				link.innerHTML = `
        <svg class="fa d-icon d-icon-check svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>已添加
      `;
				link.style.background = "linear-gradient(135deg, #10b981, #059669)";
				link.style.color = "#ffffff";
				link.style.border = "2px solid #ffffff";
				link.style.boxShadow = "0 2px 4px rgba(16, 185, 129, 0.3)";
				setTimeout(() => {
					link.innerHTML = originalHTML;
					link.style.cssText = originalStyle;
				}, 2e3);
			} catch (error) {
				console.error("[Emoji Extension Userscript] Failed to add emoji:", error);
				link.innerHTML = `
        <svg class="fa d-icon d-icon-times svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>失败
      `;
				link.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
				link.style.color = "#ffffff";
				link.style.border = "2px solid #ffffff";
				link.style.boxShadow = "0 2px 4px rgba(239, 68, 68, 0.3)";
				setTimeout(() => {
					link.innerHTML = originalHTML;
					link.style.cssText = originalStyle;
				}, 2e3);
			}
		});
		return link;
	}
	function processLightbox(lightbox) {
		if (lightbox.querySelector(".emoji-add-link")) return;
		const img = lightbox.querySelector(".mfp-img");
		const title = lightbox.querySelector(".mfp-title");
		if (!img || !title) return;
		const emojiData = extractEmojiFromImage(img, title);
		if (!emojiData) return;
		const addButton = createAddButton$1(emojiData);
		const sourceLink = title.querySelector("a.image-source-link");
		if (sourceLink) {
			const separator = document.createTextNode(" · ");
			title.insertBefore(separator, sourceLink);
			title.insertBefore(addButton, sourceLink);
		} else {
			title.appendChild(document.createTextNode(" · "));
			title.appendChild(addButton);
		}
	}
	function processAllLightboxes() {
		document.querySelectorAll(".mfp-wrap.mfp-gallery").forEach((lightbox) => {
			if (lightbox.classList.contains("mfp-wrap") && lightbox.classList.contains("mfp-gallery") && lightbox.querySelector(".mfp-img")) processLightbox(lightbox);
		});
	}
	function initOneClickAdd() {
		console.log("[Emoji Extension Userscript] Initializing one-click add functionality");
		setTimeout(processAllLightboxes, 500);
		new MutationObserver((mutations) => {
			let hasNewLightbox = false;
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList && element.classList.contains("mfp-wrap")) hasNewLightbox = true;
					}
				});
			});
			if (hasNewLightbox) setTimeout(processAllLightboxes, 100);
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) setTimeout(processAllLightboxes, 200);
		});
		initBatchParseButtons();
	}
	function createBatchParseButton(cookedElement) {
		const button = createEl("button", {
			className: "emoji-batch-parse-button",
			style: `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--tertiary-low);
      color: var(--d-button-default-icon-color);
      border-radius: 8px;
      padding: 8px 12px;
      margin: 10px 0;
      font-weight: 600;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    `
		});
		button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    一键解析并添加所有图片
  `;
		button.title = "解析当前内容中的所有图片并添加到用户表情";
		button.addEventListener("mouseenter", () => {
			if (!button.disabled) {
				button.style.background = "var(--tertiary-high)";
				button.style.transform = "scale(1.02)";
			}
		});
		button.addEventListener("mouseleave", () => {
			if (!button.disabled && !button.innerHTML.includes("已处理")) {
				button.style.background = "var(--tertiary-very-low)";
				button.style.transform = "scale(1)";
			}
		});
		button.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const originalHTML = button.innerHTML;
			const originalStyle = button.style.cssText;
			try {
				button.innerHTML = "正在解析...";
				button.style.background = "var(--primary-medium)";
				button.disabled = true;
				const lightboxWrappers = cookedElement.querySelectorAll(".lightbox-wrapper");
				const allEmojiData = [];
				lightboxWrappers.forEach((wrapper) => {
					const items = extractEmojiDataFromLightboxWrapper(wrapper);
					allEmojiData.push(...items);
				});
				if (allEmojiData.length === 0) throw new Error("未找到可解析的图片");
				let successCount = 0;
				for (const emojiData of allEmojiData) try {
					addEmojiToUserscript(emojiData);
					successCount++;
				} catch (e$1) {
					console.error("[Userscript OneClick] 添加图片失败", emojiData.name, e$1);
				}
				button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        已处理 ${successCount}/${allEmojiData.length} 张图片
      `;
				button.style.background = "linear-gradient(135deg, #10b981, #059669)";
				setTimeout(() => {
					button.innerHTML = originalHTML;
					button.style.cssText = originalStyle;
					button.disabled = false;
				}, 3e3);
			} catch (error) {
				console.error("[Userscript OneClick] Batch parse failed:", error);
				button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        解析失败
      `;
				button.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
				setTimeout(() => {
					button.innerHTML = originalHTML;
					button.style.cssText = originalStyle;
					button.disabled = false;
				}, 3e3);
			}
		});
		return button;
	}
	function processCookedContent(cookedElement) {
		if (cookedElement.querySelector(".emoji-batch-parse-button")) return;
		if (!cookedElement.querySelector(".lightbox-wrapper")) return;
		const batchButton = createBatchParseButton(cookedElement);
		cookedElement.insertBefore(batchButton, cookedElement.firstChild);
	}
	function processCookedContents() {
		document.querySelectorAll(".cooked").forEach((element) => {
			if (element.classList.contains("cooked") && element.querySelector(".lightbox-wrapper")) processCookedContent(element);
		});
	}
	function initBatchParseButtons() {
		setTimeout(processCookedContents, 500);
		new MutationObserver((mutations) => {
			let hasNewCooked = false;
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList && element.classList.contains("cooked")) hasNewCooked = true;
						if (element.querySelectorAll && element.querySelectorAll(".cooked").length > 0) hasNewCooked = true;
					}
				});
			});
			if (hasNewCooked) setTimeout(processCookedContents, 100);
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	function extractNameFromUrl(url) {
		try {
			const nameWithoutExt = (new URL(url).pathname.split("/").pop() || "").replace(/\.[^/.]+$/, "");
			const decoded = decodeURIComponent(nameWithoutExt);
			if (/^[0-9a-f]{8,}$/i.test(decoded) || decoded.length < 2) return "表情";
			return decoded || "表情";
		} catch {
			return "表情";
		}
	}
	function createAddButton(data) {
		const button = createEl("a", {
			className: "emoji-add-link",
			style: `
      color:#fff;
      border-radius:6px;
      padding:4px 8px;
      margin:0 2px;
      display:inline-flex;
      align-items:center;
      font-weight:600;
      text-decoration:none;
      border: 1px solid rgba(255,255,255,0.7);
      cursor: pointer;
    `,
			title: "添加到未分组表情"
		});
		button.innerHTML = `添加表情`;
		function addToUngrouped(emoji) {
			const data$1 = loadDataFromLocalStorage();
			let group = data$1.emojiGroups.find((g) => g.id === "ungrouped");
			if (!group) {
				group = {
					id: "ungrouped",
					name: "未分组",
					icon: "📦",
					order: 999,
					emojis: []
				};
				data$1.emojiGroups.push(group);
			}
			if (!group.emojis.some((e) => e.url === emoji.url || e.name === emoji.name)) {
				group.emojis.push({
					packet: Date.now(),
					name: emoji.name,
					url: emoji.url
				});
				saveDataToLocalStorage({ emojiGroups: data$1.emojiGroups });
			}
		}
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			try {
				addToUngrouped({
					name: data.name,
					url: data.url
				});
				const original = button.textContent || "";
				button.textContent = "已添加";
				button.style.background = "linear-gradient(135deg,#10b981,#059669)";
				setTimeout(() => {
					button.textContent = original || "添加表情";
					button.style.background = "";
				}, 1500);
			} catch (err) {
				console.warn("[Userscript] add emoji failed", err);
				const original = button.textContent || "";
				button.textContent = "失败";
				button.style.background = "linear-gradient(135deg,#ef4444,#dc2626)";
				setTimeout(() => {
					button.textContent = original || "添加表情";
					button.style.background = "linear-gradient(135deg, #4f46e5, #7c3aed)";
				}, 1500);
			}
		});
		return button;
	}
	function addEmojiButtonToPswp(container) {
		const topBar = container.querySelector(".pswp__top-bar") || (container.classList.contains("pswp__top-bar") ? container : null);
		if (!topBar) return;
		if (topBar.querySelector(".emoji-add-link")) return;
		const originalBtn = topBar.querySelector(".pswp__button--original-image");
		const downloadBtn = topBar.querySelector(".pswp__button--download-image");
		let imgUrl = "";
		if (originalBtn?.href) imgUrl = originalBtn.href;
		else if (downloadBtn?.href) imgUrl = downloadBtn.href;
		if (!imgUrl) return;
		let name = "";
		const captionTitle = document.querySelector(".pswp__caption-title");
		if (captionTitle?.textContent?.trim()) name = captionTitle.textContent.trim();
		if (!name) {
			if (originalBtn?.title) name = originalBtn.title;
			else if (downloadBtn?.title) name = downloadBtn.title;
		}
		if (!name || name.length < 2) name = extractNameFromUrl(imgUrl);
		name = name.trim() || "表情";
		const addButton = createAddButton({
			name,
			url: imgUrl
		});
		if (downloadBtn?.parentElement) downloadBtn.parentElement.insertBefore(addButton, downloadBtn.nextSibling);
		else topBar.appendChild(addButton);
	}
	function scanForPhotoSwipeTopBar() {
		document.querySelectorAll(".pswp__top-bar").forEach((topBar) => addEmojiButtonToPswp(topBar));
	}
	function observePhotoSwipeTopBar() {
		scanForPhotoSwipeTopBar();
		function debounce(fn, wait = 100) {
			let timer = null;
			return (...args) => {
				if (timer !== null) window.clearTimeout(timer);
				timer = window.setTimeout(() => {
					timer = null;
					fn(...args);
				}, wait);
			};
		}
		const debouncedScan = debounce(scanForPhotoSwipeTopBar, 100);
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.type === "childList" && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
					debouncedScan();
					return;
				}
				if (m.type === "attributes") {
					debouncedScan();
					return;
				}
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false
		});
		return observer;
	}
	function initPhotoSwipeTopbarUserscript() {
		scanForPhotoSwipeTopBar();
		observePhotoSwipeTopBar();
	}
	function detectRuntimePlatform() {
		try {
			const isMobileSize = window.innerWidth <= 768;
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			if (isMobileSize && (isMobileUserAgent || isTouchDevice)) return "mobile";
			else if (!isMobileSize && !isMobileUserAgent) return "pc";
			return "original";
		} catch {
			return "original";
		}
	}
	function getEffectivePlatform() {
		return detectRuntimePlatform();
	}
	function getPlatformUIConfig() {
		switch (getEffectivePlatform()) {
			case "mobile": return {
				emojiPickerMaxHeight: "60vh",
				emojiPickerColumns: 4,
				emojiSize: 32,
				isModal: true,
				useCompactLayout: true,
				showSearchBar: true,
				floatingButtonSize: 48
			};
			case "pc": return {
				emojiPickerMaxHeight: "400px",
				emojiPickerColumns: 6,
				emojiSize: 24,
				isModal: false,
				useCompactLayout: false,
				showSearchBar: true,
				floatingButtonSize: 40
			};
			default: return {
				emojiPickerMaxHeight: "350px",
				emojiPickerColumns: 5,
				emojiSize: 28,
				isModal: false,
				useCompactLayout: false,
				showSearchBar: true,
				floatingButtonSize: 44
			};
		}
	}
	function getPlatformToolbarSelectors() {
		const platform = getEffectivePlatform();
		const baseSelectors = [
			".d-editor-button-bar[role=\"toolbar\"]",
			".chat-composer__inner-container",
			".d-editor-button-bar"
		];
		switch (platform) {
			case "mobile": return [
				...baseSelectors,
				".mobile-composer .d-editor-button-bar",
				".discourse-mobile .d-editor-button-bar",
				"[data-mobile-toolbar]"
			];
			case "pc": return [
				...baseSelectors,
				".desktop-composer .d-editor-button-bar",
				".discourse-desktop .d-editor-button-bar",
				"[data-desktop-toolbar]"
			];
			default: return baseSelectors;
		}
	}
	function logPlatformInfo() {
		const buildPlatform = "original";
		const runtimePlatform = detectRuntimePlatform();
		const effectivePlatform = getEffectivePlatform();
		const config = getPlatformUIConfig();
		console.log("[Platform] Build target:", buildPlatform);
		console.log("[Platform] Runtime detected:", runtimePlatform);
		console.log("[Platform] Effective platform:", effectivePlatform);
		console.log("[Platform] UI config:", config);
		console.log("[Platform] Screen size:", `${window.innerWidth}x${window.innerHeight}`);
		console.log("[Platform] User agent mobile:", /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		console.log("[Platform] Touch device:", "ontouchstart" in window || navigator.maxTouchPoints > 0);
	}
	var _sharedPreview = null;
	function ensureHoverPreview() {
		if (_sharedPreview && document.body.contains(_sharedPreview)) return _sharedPreview;
		_sharedPreview = createEl("div", {
			className: "emoji-picker-hover-preview",
			style: "position:fixed;pointer-events:none;display:none;z-index:1000002;max-width:300px;max-height:300px;overflow:hidden;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.25);background:transparent;padding:6px;"
		});
		const img = createEl("img", {
			className: "emoji-picker-hover-img",
			style: "display:block;max-width:100%;max-height:220px;object-fit:contain;"
		});
		const label = createEl("div", {
			className: "emoji-picker-hover-label",
			style: "font-size:12px;color:var(--primary);margin-top:6px;text-align:center;"
		});
		_sharedPreview.appendChild(img);
		_sharedPreview.appendChild(label);
		document.body.appendChild(_sharedPreview);
		return _sharedPreview;
	}
	var themeStylesInjected = false;
	function injectGlobalThemeStyles() {
		if (themeStylesInjected || typeof document === "undefined") return;
		themeStylesInjected = true;
		document.head.appendChild(createEl("style", {
			id: "emoji-extension-theme-globals",
			text: `
    /* Global CSS variables for emoji extension theme support */
    :root {
      /* Light theme (default) */
      --emoji-modal-bg: #ffffff;
      --emoji-modal-text: #333333;
      --emoji-modal-border: #dddddd;
      --emoji-modal-input-bg: #ffffff;
      --emoji-modal-label: #555555;
      --emoji-modal-button-bg: #f5f5f5;
      --emoji-modal-primary-bg: #1890ff;
      
      --emoji-preview-bg: #ffffff;
      --emoji-preview-text: #222222;
      --emoji-preview-border: rgba(0,0,0,0.08);
      
      --emoji-button-gradient-start: #667eea;
      --emoji-button-gradient-end: #764ba2;
      --emoji-button-shadow: rgba(0, 0, 0, 0.15);
      --emoji-button-hover-shadow: rgba(0, 0, 0, 0.2);
    }
    
    /* Dark theme */
    @media (prefers-color-scheme: dark) {
      :root {
        --emoji-modal-bg: #2d2d2d;
        --emoji-modal-text: #e6e6e6;
        --emoji-modal-border: #444444;
        --emoji-modal-input-bg: #3a3a3a;
        --emoji-modal-label: #cccccc;
        --emoji-modal-button-bg: #444444;
        --emoji-modal-primary-bg: #1677ff;
        
        --emoji-preview-bg: rgba(32,33,36,0.94);
        --emoji-preview-text: #e6e6e6;
        --emoji-preview-border: rgba(255,255,255,0.12);
        
        --emoji-button-gradient-start: #4a5568;
        --emoji-button-gradient-end: #2d3748;
        --emoji-button-shadow: rgba(0, 0, 0, 0.3);
        --emoji-button-hover-shadow: rgba(0, 0, 0, 0.4);
      }
    }
  `
		}));
	}
	function ensureStyleInjected(id, css) {
		const style = document.createElement("style");
		style.id = id;
		style.textContent = css;
		document.documentElement.appendChild(style);
	}
	function injectEmojiPickerStyles() {
		if (typeof document === "undefined") return;
		if (document.getElementById("emoji-picker-styles")) return;
		injectGlobalThemeStyles();
		ensureStyleInjected("emoji-picker-styles", `
.emoji-picker-hover-preview{
  position:fixed;
  pointer-events:none;
  display:none;
  z-index:1000002;
  max-width:320px;
  max-height:320px;
  overflow:hidden;
  border-radius:8px;
  box-shadow:0 6px 20px rgba(0,0,0,0.32);
  background:var(--emoji-preview-bg);
  padding:8px;
  transition:opacity .3s ease, transform .12s ease;
  border: 1px solid var(--emoji-preview-border);
  backdrop-filter: blur(10px);
}
.emoji-picker-hover-preview img.emoji-picker-hover-img{
  display:block;
  max-width:100%;
  max-height:220px;
  object-fit:contain;
}
.emoji-picker-hover-preview .emoji-picker-hover-label{
  font-size:12px;
  color:var(--emoji-preview-text);
  margin-top:8px;
  text-align:center;
  word-break:break-word;
  font-weight: 500;
}
`);
	}
	function isImageUrl(value) {
		if (!value) return false;
		let v = value.trim();
		if (/^url\(/i.test(v)) {
			const inner = v.replace(/^url\(/i, "").replace(/\)$/, "").trim();
			if (inner.startsWith("\"") && inner.endsWith("\"") || inner.startsWith("'") && inner.endsWith("'")) v = inner.slice(1, -1).trim();
			else v = inner;
		}
		if (v.startsWith("data:image/")) return true;
		if (v.startsWith("blob:")) return true;
		if (v.startsWith("//")) v = "https:" + v;
		if (/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i.test(v)) return true;
		try {
			const url = new URL(v);
			const protocol = url.protocol;
			if (protocol === "http:" || protocol === "https:" || protocol.endsWith(":")) {
				if (/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i.test(url.pathname)) return true;
				if (/format=|ext=|type=image|image_type=/i.test(url.search)) return true;
			}
		} catch {}
		return false;
	}
	function isMobileView() {
		try {
			return getEffectivePlatform() === "mobile" || !!(userscriptState && userscriptState.settings && userscriptState.settings.forceMobileMode);
		} catch (e) {
			return false;
		}
	}
	function insertEmojiIntoEditor(emoji) {
		console.log("[Emoji Extension Userscript] Inserting emoji:", emoji);
		if (emoji.name && emoji.url) trackEmojiUsage(emoji.name, emoji.url);
		const selectors = [
			"textarea.d-editor-input",
			"textarea.ember-text-area",
			"#channel-composer",
			".chat-composer__input",
			"textarea.chat-composer__input"
		];
		const proseMirror = document.querySelector(".ProseMirror.d-editor-input");
		let textarea = null;
		for (const s of selectors) {
			const el = document.querySelector(s);
			if (el) {
				textarea = el;
				break;
			}
		}
		const contentEditable = document.querySelector("[contenteditable=\"true\"]");
		if (!textarea && !proseMirror && !contentEditable) {
			console.error("找不到输入框");
			return;
		}
		const dimensionMatch = emoji.url?.match(/_(\d{3,})x(\d{3,})\./);
		let width = "500";
		let height = "500";
		if (dimensionMatch) {
			width = dimensionMatch[1];
			height = dimensionMatch[2];
		} else if (emoji.width && emoji.height) {
			width = emoji.width.toString();
			height = emoji.height.toString();
		}
		const scale = userscriptState.settings?.imageScale || 30;
		const outputFormat = userscriptState.settings?.outputFormat || "markdown";
		if (textarea) {
			let insertText = "";
			if (outputFormat === "html") {
				const scaledWidth = Math.max(1, Math.round(Number(width) * (scale / 100)));
				const scaledHeight = Math.max(1, Math.round(Number(height) * (scale / 100)));
				insertText = `<img src="${emoji.url}" title=":${emoji.name}:" class="emoji only-emoji" alt=":${emoji.name}:" loading="lazy" width="${scaledWidth}" height="${scaledHeight}" style="aspect-ratio: ${scaledWidth} / ${scaledHeight};"> `;
			} else insertText = `![${emoji.name}|${width}x${height},${scale}%](${emoji.url}) `;
			const selectionStart = textarea.selectionStart;
			const selectionEnd = textarea.selectionEnd;
			textarea.value = textarea.value.substring(0, selectionStart) + insertText + textarea.value.substring(selectionEnd, textarea.value.length);
			textarea.selectionStart = textarea.selectionEnd = selectionStart + insertText.length;
			textarea.focus();
			const inputEvent = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			textarea.dispatchEvent(inputEvent);
		} else if (proseMirror) {
			const imgWidth = Number(width) || 500;
			const scaledWidth = Math.max(1, Math.round(imgWidth * (scale / 100)));
			const htmlContent = `<img src="${emoji.url}" alt="${emoji.name}" width="${width}" height="${height}" data-scale="${scale}" style="width: ${scaledWidth}px">`;
			try {
				const dataTransfer = new DataTransfer();
				dataTransfer.setData("text/html", htmlContent);
				const pasteEvent = new ClipboardEvent("paste", {
					clipboardData: dataTransfer,
					bubbles: true
				});
				proseMirror.dispatchEvent(pasteEvent);
			} catch (error) {
				try {
					document.execCommand("insertHTML", false, htmlContent);
				} catch (fallbackError) {
					console.error("无法向富文本编辑器中插入表情", fallbackError);
				}
			}
		} else if (contentEditable) try {
			if (outputFormat === "html") {
				const imgWidth = Number(width) || 500;
				const scaledWidth = Math.max(1, Math.round(imgWidth * (scale / 100)));
				const htmlContent = `<img src="${emoji.url}" alt="${emoji.name}" width="${width}" height="${height}" data-scale="${scale}" style="width: ${scaledWidth}px"> `;
				const sel = window.getSelection();
				if (sel && sel.rangeCount > 0) {
					const range = sel.getRangeAt(0);
					const frag = document.createRange().createContextualFragment(htmlContent);
					range.deleteContents();
					range.insertNode(frag);
					range.collapse(false);
					sel.removeAllRanges();
					sel.addRange(range);
				} else contentEditable.insertAdjacentHTML("beforeend", htmlContent);
			} else {
				const insertText = `![${emoji.name}|${width}x${height},${scale}%](${emoji.url}) `;
				const textNode = document.createTextNode(insertText);
				const sel = window.getSelection();
				if (sel && sel.rangeCount > 0) {
					const range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode(textNode);
					range.setStartAfter(textNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				} else contentEditable.appendChild(textNode);
			}
			const inputEvent = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			contentEditable.dispatchEvent(inputEvent);
		} catch (e) {
			console.error("无法向 contenteditable 插入表情", e);
		}
	}
	function createMobileEmojiPicker(groups) {
		const modal = createEl("div", {
			className: "modal d-modal fk-d-menu-modal emoji-picker-content",
			attrs: {
				"data-identifier": "emoji-picker",
				"data-keyboard": "false",
				"aria-modal": "true",
				role: "dialog"
			}
		});
		const modalContainerDiv = createEl("div", { className: "d-modal__container" });
		const modalBody = createEl("div", { className: "d-modal__body" });
		modalBody.tabIndex = -1;
		const emojiPickerDiv = createEl("div", { className: "emoji-picker" });
		const filterContainer = createEl("div", { className: "emoji-picker__filter-container" });
		const filterInputContainer = createEl("div", { className: "emoji-picker__filter filter-input-container" });
		const filterInput = createEl("input", {
			className: "filter-input",
			placeholder: "按表情符号名称搜索…",
			type: "text"
		});
		filterInputContainer.appendChild(filterInput);
		const closeButton = createEl("button", {
			className: "btn no-text btn-icon btn-transparent emoji-picker__close-btn",
			type: "button",
			innerHTML: `<svg class="fa d-icon d-icon-xmark svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>`,
			on: { click: () => {
				(modal.closest(".modal-container") || modal)?.remove();
				document.querySelector(".d-modal__backdrop")?.remove();
			} }
		});
		filterContainer.appendChild(filterInputContainer);
		filterContainer.appendChild(closeButton);
		const content = createEl("div", { className: "emoji-picker__content" });
		const sectionsNav = createEl("div", { className: "emoji-picker__sections-nav" });
		const scrollableContent = createEl("div", { className: "emoji-picker__scrollable-content" });
		const sections = createEl("div", {
			className: "emoji-picker__sections",
			attrs: { role: "button" }
		});
		groups.forEach((group, index) => {
			if (!group?.emojis?.length) return;
			const navButton = createEl("button", {
				className: `btn no-text btn-flat emoji-picker__section-btn ${index === 0 ? "active" : ""}`,
				attrs: {
					tabindex: "-1",
					"data-section": group.id,
					type: "button"
				}
			});
			const iconVal = group.icon || "📁";
			if (isImageUrl(iconVal)) {
				const img = createEl("img", {
					src: iconVal,
					alt: group.name || "",
					className: "emoji",
					style: "width: 18px; height: 18px; object-fit: contain;"
				});
				navButton.appendChild(img);
			} else navButton.textContent = String(iconVal);
			navButton.title = group.name;
			navButton.addEventListener("click", () => {
				sectionsNav.querySelectorAll(".emoji-picker__section-btn").forEach((btn) => btn.classList.remove("active"));
				navButton.classList.add("active");
				const target = sections.querySelector(`[data-section="${group.id}"]`);
				if (target) target.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
			sectionsNav.appendChild(navButton);
			const section = createEl("div", {
				className: "emoji-picker__section",
				attrs: {
					"data-section": group.id,
					role: "region",
					"aria-label": group.name
				}
			});
			const titleContainer = createEl("div", { className: "emoji-picker__section-title-container" });
			titleContainer.appendChild(createEl("h2", {
				className: "emoji-picker__section-title",
				text: group.name
			}));
			const sectionEmojis = createEl("div", { className: "emoji-picker__section-emojis" });
			group.emojis.forEach((emoji) => {
				if (!emoji || typeof emoji !== "object" || !emoji.url || !emoji.name) return;
				const img = createEl("img", {
					src: emoji.url,
					alt: emoji.name,
					className: "emoji",
					title: `:${emoji.name}:`,
					style: "width: 32px; height: 32px; object-fit: contain;",
					attrs: {
						"data-emoji": emoji.name,
						tabindex: "0",
						loading: "lazy"
					}
				});
				(function bindHover(imgEl, emo) {
					if (!userscriptState.settings?.enableFloatingPreview) return;
					const preview = ensureHoverPreview();
					const previewImg = preview.querySelector("img");
					const previewLabel = preview.querySelector(".emoji-picker-hover-label");
					let fadeTimer = null;
					function onEnter(e) {
						previewImg.src = emo.url;
						previewLabel.textContent = emo.name || "";
						preview.style.display = "block";
						preview.style.opacity = "1";
						preview.style.transition = "opacity 0.12s ease, transform 0.12s ease";
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						fadeTimer = window.setTimeout(() => {
							preview.style.opacity = "0";
							setTimeout(() => {
								if (preview.style.opacity === "0") preview.style.display = "none";
							}, 300);
						}, 5e3);
						move(e);
					}
					function move(e) {
						const pad = 12;
						const vw = window.innerWidth;
						const vh = window.innerHeight;
						const rect = preview.getBoundingClientRect();
						let left = e.clientX + pad;
						let top = e.clientY + pad;
						if (left + rect.width > vw) left = e.clientX - rect.width - pad;
						if (top + rect.height > vh) top = e.clientY - rect.height - pad;
						preview.style.left = left + "px";
						preview.style.top = top + "px";
					}
					function onLeave() {
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						preview.style.display = "none";
					}
					imgEl.addEventListener("mouseenter", onEnter);
					imgEl.addEventListener("mousemove", move);
					imgEl.addEventListener("mouseleave", onLeave);
				})(img, emoji);
				img.addEventListener("click", () => {
					insertEmojiIntoEditor(emoji);
					if (modal.parentElement) modal.parentElement.removeChild(modal);
				});
				img.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						insertEmojiIntoEditor(emoji);
						if (modal.parentElement) modal.parentElement.removeChild(modal);
					}
				});
				sectionEmojis.appendChild(img);
			});
			section.appendChild(titleContainer);
			section.appendChild(sectionEmojis);
			sections.appendChild(section);
		});
		filterInput.addEventListener("input", (e) => {
			const q = (e.target.value || "").toLowerCase();
			sections.querySelectorAll("img").forEach((img) => {
				const emojiName = (img.dataset.emoji || "").toLowerCase();
				img.style.display = q === "" || emojiName.includes(q) ? "" : "none";
			});
			sections.querySelectorAll(".emoji-picker__section").forEach((section) => {
				const visibleEmojis = section.querySelectorAll("img:not([style*=\"display: none\"])");
				section.style.display = visibleEmojis.length > 0 ? "" : "none";
			});
		});
		scrollableContent.appendChild(sections);
		content.appendChild(sectionsNav);
		content.appendChild(scrollableContent);
		emojiPickerDiv.appendChild(filterContainer);
		emojiPickerDiv.appendChild(content);
		modalBody.appendChild(emojiPickerDiv);
		modalContainerDiv.appendChild(modalBody);
		modal.appendChild(modalContainerDiv);
		return modal;
	}
	function createDesktopEmojiPicker(groups) {
		const picker = createEl("div", {
			className: "fk-d-menu -animated -expanded",
			style: "max-width: 400px; visibility: visible; z-index: 999999;",
			attrs: {
				"data-identifier": "emoji-picker",
				role: "dialog"
			}
		});
		const innerContent = createEl("div", { className: "fk-d-menu__inner-content" });
		const emojiPickerDiv = createEl("div", { className: "emoji-picker" });
		const filterContainer = createEl("div", { className: "emoji-picker__filter-container" });
		const filterDiv = createEl("div", { className: "emoji-picker__filter filter-input-container" });
		const searchInput = createEl("input", {
			className: "filter-input",
			placeholder: "按表情符号名称搜索…",
			type: "text"
		});
		filterDiv.appendChild(searchInput);
		filterContainer.appendChild(filterDiv);
		const content = createEl("div", { className: "emoji-picker__content" });
		const sectionsNav = createEl("div", { className: "emoji-picker__sections-nav" });
		const scrollableContent = createEl("div", { className: "emoji-picker__scrollable-content" });
		const sections = createEl("div", {
			className: "emoji-picker__sections",
			attrs: { role: "button" }
		});
		groups.forEach((group, index) => {
			if (!group?.emojis?.length) return;
			const navButton = createEl("button", {
				className: `btn no-text btn-flat emoji-picker__section-btn ${index === 0 ? "active" : ""}`,
				attrs: {
					tabindex: "-1",
					"data-section": group.id
				},
				type: "button"
			});
			const iconVal = group.icon || "📁";
			if (isImageUrl(iconVal)) {
				const img = createEl("img", {
					src: iconVal,
					alt: group.name || "",
					className: "emoji-group-icon",
					style: "width: 18px; height: 18px; object-fit: contain;"
				});
				navButton.appendChild(img);
			} else navButton.textContent = String(iconVal);
			navButton.title = group.name;
			navButton.addEventListener("click", () => {
				sectionsNav.querySelectorAll(".emoji-picker__section-btn").forEach((btn) => btn.classList.remove("active"));
				navButton.classList.add("active");
				const target = sections.querySelector(`[data-section="${group.id}"]`);
				if (target) target.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
			sectionsNav.appendChild(navButton);
			const section = createEl("div", {
				className: "emoji-picker__section",
				attrs: {
					"data-section": group.id,
					role: "region",
					"aria-label": group.name
				}
			});
			const titleContainer = createEl("div", { className: "emoji-picker__section-title-container" });
			const title = createEl("h2", {
				className: "emoji-picker__section-title",
				text: group.name
			});
			titleContainer.appendChild(title);
			const sectionEmojis = createEl("div", { className: "emoji-picker__section-emojis" });
			let added = 0;
			group.emojis.forEach((emoji) => {
				if (!emoji || typeof emoji !== "object" || !emoji.url || !emoji.name) return;
				const img = createEl("img", {
					width: "32px",
					height: "32px",
					className: "emoji",
					src: emoji.url,
					alt: emoji.name,
					title: `:${emoji.name}:`,
					attrs: {
						"data-emoji": emoji.name,
						tabindex: "0",
						loading: "lazy"
					}
				});
				(function bindHover(imgEl, emo) {
					if (!userscriptState.settings?.enableFloatingPreview) return;
					const preview = ensureHoverPreview();
					const previewImg = preview.querySelector("img");
					const previewLabel = preview.querySelector(".emoji-picker-hover-label");
					let fadeTimer = null;
					function onEnter(e) {
						previewImg.src = emo.url;
						previewLabel.textContent = emo.name || "";
						preview.style.display = "block";
						preview.style.opacity = "1";
						preview.style.transition = "opacity 0.12s ease, transform 0.12s ease";
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						fadeTimer = window.setTimeout(() => {
							preview.style.opacity = "0";
							setTimeout(() => {
								if (preview.style.opacity === "0") preview.style.display = "none";
							}, 300);
						}, 5e3);
						move(e);
					}
					function move(e) {
						const pad = 12;
						const vw = window.innerWidth;
						const vh = window.innerHeight;
						const rect = preview.getBoundingClientRect();
						let left = e.clientX + pad;
						let top = e.clientY + pad;
						if (left + rect.width > vw) left = e.clientX - rect.width - pad;
						if (top + rect.height > vh) top = e.clientY - rect.height - pad;
						preview.style.left = left + "px";
						preview.style.top = top + "px";
					}
					function onLeave() {
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						preview.style.display = "none";
					}
					imgEl.addEventListener("mouseenter", onEnter);
					imgEl.addEventListener("mousemove", move);
					imgEl.addEventListener("mouseleave", onLeave);
				})(img, emoji);
				img.addEventListener("click", () => {
					insertEmojiIntoEditor(emoji);
					picker.remove();
				});
				img.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						insertEmojiIntoEditor(emoji);
						picker.remove();
					}
				});
				sectionEmojis.appendChild(img);
				added++;
			});
			if (added === 0) {
				const msg = createEl("div", {
					text: `${group.name} 组暂无有效表情`,
					style: "padding: 20px; text-align: center; color: #999;"
				});
				sectionEmojis.appendChild(msg);
			}
			section.appendChild(titleContainer);
			section.appendChild(sectionEmojis);
			sections.appendChild(section);
		});
		searchInput.addEventListener("input", (e) => {
			const q = (e.target.value || "").toLowerCase();
			sections.querySelectorAll("img").forEach((img) => {
				const emojiName = img.getAttribute("data-emoji")?.toLowerCase() || "";
				img.style.display = q === "" || emojiName.includes(q) ? "" : "none";
			});
			sections.querySelectorAll(".emoji-picker__section").forEach((section) => {
				const visibleEmojis = section.querySelectorAll("img:not([style*=\"none\"])");
				const titleContainer = section.querySelector(".emoji-picker__section-title-container");
				if (titleContainer) titleContainer.style.display = visibleEmojis.length > 0 ? "" : "none";
			});
		});
		scrollableContent.appendChild(sections);
		content.appendChild(sectionsNav);
		content.appendChild(scrollableContent);
		emojiPickerDiv.appendChild(filterContainer);
		emojiPickerDiv.appendChild(content);
		innerContent.appendChild(emojiPickerDiv);
		picker.appendChild(innerContent);
		return picker;
	}
	async function createEmojiPicker() {
		const groups = userscriptState.emojiGroups;
		const mobile = isMobileView();
		try {
			injectEmojiPickerStyles();
		} catch (e) {
			console.warn("injectEmojiPickerStyles failed", e);
		}
		if (mobile) return createMobileEmojiPicker(groups);
		else return createDesktopEmojiPicker(groups);
	}
	function showTemporaryMessage(message, duration = 2e3) {
		const messageEl = createEl("div", {
			style: `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--emoji-modal-primary-bg);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 9999999;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: fadeInOut 2s ease-in-out;
    `,
			text: message
		});
		if (!document.querySelector("#tempMessageStyles")) {
			const style = createEl("style", {
				id: "tempMessageStyles",
				text: `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `
			});
			document.head.appendChild(style);
		}
		document.body.appendChild(messageEl);
		setTimeout(() => {
			try {
				messageEl.remove();
			} catch {}
		}, duration);
	}
	function createModalElement(options) {
		const modal = createEl("div", {
			style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
			className: options.className
		});
		const content = createEl("div", { style: `
      background: var(--secondary);
      color: var(--emoji-modal-text);
      border: 1px solid var(--emoji-modal-border);
      border-radius: 8px;
      padding: 24px;
      max-width: 90%;
      max-height: 90%;
      overflow-y: auto;
      position: relative;
    ` });
		if (options.title) {
			const titleElement = createEl("div", {
				style: `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      `,
				innerHTML: `
        <h2 style="margin: 0; color: var(--emoji-modal-text);">${options.title}</h2>
        <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
      `
			});
			content.appendChild(titleElement);
			const closeButton = content.querySelector("#closeModal");
			if (closeButton && options.onClose) closeButton.addEventListener("click", options.onClose);
		}
		if (options.content) {
			const contentDiv = createEl("div", { innerHTML: options.content });
			content.appendChild(contentDiv);
		}
		modal.appendChild(content);
		return modal;
	}
	function showPopularEmojisModal() {
		injectGlobalThemeStyles();
		const popularEmojis = getPopularEmojis(50);
		const contentHTML = `
    <div style="margin-bottom: 16px; padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 6px; border: 1px solid var(--emoji-modal-border);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 500; color: var(--emoji-modal-label);">表情按使用次数排序</span>
        <span style="font-size: 12px; color: var(--emoji-modal-text);">点击表情直接使用</span>
      </div>
      <div style="font-size: 12px; color: var(--emoji-modal-text);">
        总使用次数：${popularEmojis.reduce((sum, emoji) => sum + emoji.count, 0)}
      </div>
    </div>
    
    <div id="popularEmojiGrid" style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    ">
      ${popularEmojis.length === 0 ? "<div style=\"grid-column: 1/-1; text-align: center; padding: 40px; color: var(--emoji-modal-text);\">还没有使用过表情<br><small>开始使用表情后，这里会显示常用的表情</small></div>" : popularEmojis.map((emoji) => `
          <div class="popular-emoji-item" data-name="${emoji.name}" data-url="${emoji.url}" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            border: 1px solid var(--emoji-modal-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background: var(--emoji-modal-button-bg);
          ">
            <img src="${emoji.url}" alt="${emoji.name}" style="
              width: 40px;
              height: 40px;
              object-fit: contain;
              margin-bottom: 4px;
            ">
            <div style="
              font-size: 11px;
              font-weight: 500;
              color: var(--emoji-modal-text);
              text-align: center;
              word-break: break-all;
              line-height: 1.2;
              margin-bottom: 2px;
            ">${emoji.name}</div>
            <div style="
              font-size: 10px;
              color: var(--emoji-modal-text);
              opacity: 0.6;
              text-align: center;
            ">使用${emoji.count}次</div>
          </div>
        `).join("")}
    </div>
    
    ${popularEmojis.length > 0 ? `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--emoji-modal-border); font-size: 12px; color: var(--emoji-modal-text); opacity: 0.6; text-align: center;">
        统计数据保存在本地，清空统计将重置所有使用记录
      </div>
    ` : ""}
  `;
		const modal = createModalElement({
			title: `常用表情 (${popularEmojis.length})`,
			content: contentHTML,
			onClose: () => modal.remove()
		});
		const titleDiv = modal.querySelector("div:first-child > div:first-child, div:first-child > h2 + div");
		if (titleDiv) {
			const clearStatsButton = createEl("button", {
				id: "clearStats",
				text: "清空统计",
				style: "padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;"
			});
			titleDiv.appendChild(clearStatsButton);
			clearStatsButton.addEventListener("click", () => {
				if (confirm("确定要清空所有表情使用统计吗？此操作不可撤销。")) {
					clearEmojiUsageStats();
					modal.remove();
					showTemporaryMessage("表情使用统计已清空");
					setTimeout(() => showPopularEmojisModal(), 300);
				}
			});
		}
		const content = modal.querySelector("div:last-child");
		document.body.appendChild(modal);
		ensureStyleInjected("popular-emojis-styles", `
    .popular-emoji-item:hover {
      transform: translateY(-2px);
      border-color: var(--emoji-modal-primary-bg) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `);
		content.querySelectorAll(".popular-emoji-item").forEach((item) => {
			item.addEventListener("click", () => {
				const name = item.getAttribute("data-name");
				const url = item.getAttribute("data-url");
				if (name && url) {
					trackEmojiUsage(name, url);
					useEmojiFromPopular(name, url);
					modal.remove();
					showTemporaryMessage(`已使用表情: ${name}`);
				}
			});
		});
	}
	function useEmojiFromPopular(name, url) {
		const activeElement = document.activeElement;
		if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
			const textArea = activeElement;
			const format = userscriptState.settings.outputFormat;
			let emojiText = "";
			if (format === "markdown") emojiText = `![${name}](${url})`;
			else emojiText = `<img src="${url}" alt="${name}" style="width: ${userscriptState.settings.imageScale}px; height: ${userscriptState.settings.imageScale}px;">`;
			const start = textArea.selectionStart || 0;
			const end = textArea.selectionEnd || 0;
			const currentValue = textArea.value;
			textArea.value = currentValue.slice(0, start) + emojiText + currentValue.slice(end);
			const newPosition = start + emojiText.length;
			textArea.setSelectionRange(newPosition, newPosition);
			textArea.dispatchEvent(new Event("input", { bubbles: true }));
			textArea.focus();
		} else {
			const textAreas = document.querySelectorAll("textarea, input[type=\"text\"], [contenteditable=\"true\"]");
			const lastTextArea = Array.from(textAreas).pop();
			if (lastTextArea) {
				lastTextArea.focus();
				if (lastTextArea.tagName === "TEXTAREA" || lastTextArea.tagName === "INPUT") {
					const format = userscriptState.settings.outputFormat;
					let emojiText = "";
					if (format === "markdown") emojiText = `![${name}](${url})`;
					else emojiText = `<img src="${url}" alt="${name}" style="width: ${userscriptState.settings.imageScale}px; height: ${userscriptState.settings.imageScale}px;">`;
					const textarea = lastTextArea;
					textarea.value += emojiText;
					textarea.dispatchEvent(new Event("input", { bubbles: true }));
				}
			}
		}
	}
	var currentPicker = null;
	function closeCurrentPicker() {
		if (currentPicker) {
			currentPicker.remove();
			currentPicker = null;
		}
	}
	function injectCustomMenuButtons(menu) {
		if (menu.querySelector(".emoji-extension-menu-item")) return;
		let dropdownMenu = menu.querySelector("ul.dropdown-menu");
		if (!dropdownMenu) dropdownMenu = menu.querySelector("ul.chat-composer-dropdown__list");
		if (!dropdownMenu) {
			console.warn("[Emoji Extension Userscript] No dropdown-menu or chat-composer-dropdown__list found in expanded menu");
			return;
		}
		const isChatComposerMenu = dropdownMenu.classList.contains("chat-composer-dropdown__list");
		const itemClassName = isChatComposerMenu ? "chat-composer-dropdown__item emoji-extension-menu-item" : "dropdown-menu__item emoji-extension-menu-item";
		const btnClassName = isChatComposerMenu ? "btn btn-icon-text chat-composer-dropdown__action-btn btn-transparent" : "btn btn-icon-text";
		const emojiPickerItem = createEl("li", { className: itemClassName });
		const emojiPickerBtn = createEl("button", {
			className: btnClassName,
			type: "button",
			title: "表情包选择器",
			innerHTML: `
      <svg class="fa d-icon d-icon-smile svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-face-smile"></use></svg>
      <span class="d-button-label">表情包选择器</span>
    `
		});
		emojiPickerBtn.addEventListener("click", async (e) => {
			e.stopPropagation();
			if (menu.parentElement) menu.remove();
			if (currentPicker) {
				closeCurrentPicker();
				return;
			}
			currentPicker = await createEmojiPicker();
			if (!currentPicker) return;
			document.body.appendChild(currentPicker);
			currentPicker.style.position = "fixed";
			currentPicker.style.top = "0";
			currentPicker.style.left = "0";
			currentPicker.style.right = "0";
			currentPicker.style.bottom = "0";
			currentPicker.style.zIndex = "999999";
			setTimeout(() => {
				const handleClick = (e$1) => {
					if (currentPicker && !currentPicker.contains(e$1.target)) {
						closeCurrentPicker();
						document.removeEventListener("click", handleClick);
					}
				};
				document.addEventListener("click", handleClick);
			}, 100);
		});
		emojiPickerItem.appendChild(emojiPickerBtn);
		dropdownMenu.appendChild(emojiPickerItem);
		console.log("[Emoji Extension Userscript] Custom menu buttons injected");
	}
	function injectEmojiButton(toolbar) {
		if (toolbar.querySelector(".emoji-extension-button")) return;
		const isChatComposer = toolbar.classList.contains("chat-composer__inner-container");
		const button = createEl("button", {
			className: "btn no-text btn-icon toolbar__button nacho-emoji-picker-button emoji-extension-button",
			title: "表情包",
			type: "button",
			innerHTML: "🐈‍⬛"
		});
		const popularButton = createEl("button", {
			className: "btn no-text btn-icon toolbar__button nacho-emoji-popular-button emoji-extension-button",
			title: "常用表情",
			type: "button",
			innerHTML: "⭐"
		});
		if (isChatComposer) {
			button.classList.add("fk-d-menu__trigger", "emoji-picker-trigger", "chat-composer-button", "btn-transparent", "-emoji");
			button.setAttribute("aria-expanded", "false");
			button.setAttribute("data-identifier", "emoji-picker");
			button.setAttribute("data-trigger", "");
			popularButton.classList.add("fk-d-menu__trigger", "popular-emoji-trigger", "chat-composer-button", "btn-transparent", "-popular");
			popularButton.setAttribute("aria-expanded", "false");
			popularButton.setAttribute("data-identifier", "popular-emoji");
			popularButton.setAttribute("data-trigger", "");
		}
		button.addEventListener("click", async (e) => {
			e.stopPropagation();
			if (currentPicker) {
				closeCurrentPicker();
				return;
			}
			currentPicker = await createEmojiPicker();
			if (!currentPicker) return;
			document.body.appendChild(currentPicker);
			const buttonRect = button.getBoundingClientRect();
			if (currentPicker.classList.contains("modal") || currentPicker.className.includes("d-modal")) {
				currentPicker.style.position = "fixed";
				currentPicker.style.top = "0";
				currentPicker.style.left = "0";
				currentPicker.style.right = "0";
				currentPicker.style.bottom = "0";
				currentPicker.style.zIndex = "999999";
			} else {
				currentPicker.style.position = "fixed";
				const margin = 8;
				const vpWidth = window.innerWidth;
				const vpHeight = window.innerHeight;
				currentPicker.style.top = buttonRect.bottom + margin + "px";
				currentPicker.style.left = buttonRect.left + "px";
				const pickerRect = currentPicker.getBoundingClientRect();
				const spaceBelow = vpHeight - buttonRect.bottom;
				const neededHeight = pickerRect.height + margin;
				let top = buttonRect.bottom + margin;
				if (spaceBelow < neededHeight) top = Math.max(margin, buttonRect.top - pickerRect.height - margin);
				let left = buttonRect.left;
				if (left + pickerRect.width + margin > vpWidth) left = Math.max(margin, vpWidth - pickerRect.width - margin);
				if (left < margin) left = margin;
				currentPicker.style.top = top + "px";
				currentPicker.style.left = left + "px";
			}
			setTimeout(() => {
				const handleClick = (e$1) => {
					if (currentPicker && !currentPicker.contains(e$1.target) && e$1.target !== button) {
						closeCurrentPicker();
						document.removeEventListener("click", handleClick);
					}
				};
				document.addEventListener("click", handleClick);
			}, 100);
		});
		popularButton.addEventListener("click", (e) => {
			e.stopPropagation();
			closeCurrentPicker();
			showPopularEmojisModal();
		});
		try {
			if (isChatComposer) {
				const existingEmojiTrigger = toolbar.querySelector(".emoji-picker-trigger:not(.emoji-extension-button)");
				if (existingEmojiTrigger) {
					toolbar.insertBefore(button, existingEmojiTrigger);
					toolbar.insertBefore(popularButton, existingEmojiTrigger);
				} else {
					toolbar.appendChild(button);
					toolbar.appendChild(popularButton);
				}
			} else {
				toolbar.appendChild(button);
				toolbar.appendChild(popularButton);
			}
		} catch (error) {
			console.error("[Emoji Extension Userscript] Failed to inject button:", error);
		}
	}
	var domObserver = null;
	function setupDomObserver() {
		if (domObserver) return;
		domObserver = new MutationObserver((mutations) => {
			let hasChanges = false;
			for (const mutation of mutations) {
				if (mutation.type === "childList" && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
					hasChanges = true;
					break;
				}
				if (mutation.type === "attributes") {
					hasChanges = true;
					break;
				}
			}
			if (hasChanges) {}
		});
		domObserver.observe(document, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["class", "id"]
		});
		console.log("[Emoji Extension Userscript] DOM observer set up for force mobile mode");
	}
	var toolbarOptionsTriggerInitialized = false;
	var chatComposerTriggerInitialized = false;
	function setupForceMobileMenuTriggers() {
		if (!(userscriptState.settings?.forceMobileMode || false)) return;
		const portalContainer = document.querySelector("#d-menu-portals");
		if (!portalContainer) {
			console.log("[Emoji Extension Userscript] #d-menu-portals not found, skipping force mobile menu triggers");
			return;
		}
		console.log("[Emoji Extension Userscript] Force mobile mode enabled, setting up menu triggers");
		setupDomObserver();
		new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList.contains("toolbar-menu__options-content") || element.classList.contains("chat-composer-dropdown__content") || element.classList.contains("chat-composer-dropdown__menu-content")) {
							console.log("[Emoji Extension Userscript] Menu expanded in portal, injecting custom buttons");
							injectCustomMenuButtons(element);
						}
					}
				});
			});
		}).observe(portalContainer, {
			childList: true,
			subtree: true
		});
		new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList.contains("modal-container")) {
							let modalMenu = element.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
							if (!modalMenu) modalMenu = element.querySelector(".chat-composer-dropdown__menu-content[data-identifier=\"chat-composer-dropdown__menu\"]");
							if (modalMenu) {
								console.log("[Emoji Extension Userscript] Modal menu detected (immediate), injecting custom buttons");
								injectCustomMenuButtons(modalMenu);
							} else {
								const modalContentObserver = new MutationObserver(() => {
									let delayedMenu = element.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
									if (!delayedMenu) delayedMenu = element.querySelector(".chat-composer-dropdown__menu-content[data-identifier=\"chat-composer-dropdown__menu\"]");
									if (delayedMenu) {
										console.log("[Emoji Extension Userscript] Modal menu detected (delayed), injecting custom buttons");
										injectCustomMenuButtons(delayedMenu);
										modalContentObserver.disconnect();
									}
								});
								modalContentObserver.observe(element, {
									childList: true,
									subtree: true
								});
								setTimeout(() => modalContentObserver.disconnect(), 1e3);
							}
						}
					}
				});
			});
		}).observe(document.body, {
			childList: true,
			subtree: false
		});
		try {
			const existingModal = document.querySelector(".modal-container");
			if (existingModal) {
				const existingMenu = existingModal.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
				if (existingMenu) {
					console.log("[Emoji Extension Userscript] Found existing modal menu at init, injecting custom buttons");
					injectCustomMenuButtons(existingMenu);
				}
			}
		} catch (e) {}
		const toolbarOptionsTrigger = document.querySelector("button.toolbar-menu__options-trigger[data-identifier=\"toolbar-menu__options\"]:not(.emoji-detected)");
		if (toolbarOptionsTrigger) {
			toolbarOptionsTrigger.classList.add("emoji-detected");
			toolbarOptionsTrigger.classList.add("emoji-attached");
			if (!toolbarOptionsTrigger.dataset.emojiListenerAttached) {
				toolbarOptionsTrigger.addEventListener("click", () => {
					const checkMenu = (attempt = 0) => {
						const modalContainer = document.querySelector(".modal-container");
						let menu = null;
						if (modalContainer) menu = modalContainer.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
						if (!menu) menu = document.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
						if (menu) injectCustomMenuButtons(menu);
						else if (attempt < 5) setTimeout(() => checkMenu(attempt + 1), 20);
					};
					checkMenu();
				});
				toolbarOptionsTrigger.dataset.emojiListenerAttached = "true";
				console.log("[Emoji Extension Userscript] Toolbar options trigger listener added");
			}
			toolbarOptionsTriggerInitialized = true;
		}
		const chatComposerTrigger = document.querySelector("button.chat-composer-dropdown__trigger-btn[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger.chat-composer-dropdown__trigger-btn:not(.emoji-detected)");
		if (chatComposerTrigger) {
			chatComposerTrigger.classList.add("emoji-detected");
			chatComposerTrigger.classList.add("emoji-attached");
			if (!chatComposerTrigger.dataset.emojiListenerAttached) {
				chatComposerTrigger.addEventListener("click", () => {
					setTimeout(() => {
						const menu = document.querySelector(".chat-composer-dropdown__content[data-identifier=\"chat-composer-dropdown__menu\"], .chat-composer-dropdown__menu-content[data-identifier=\"chat-composer-dropdown__menu\"]");
						if (menu) injectCustomMenuButtons(menu);
					}, 100);
				});
				chatComposerTrigger.dataset.emojiListenerAttached = "true";
				console.log("[Emoji Extension Userscript] Chat composer trigger listener added");
			}
			chatComposerTriggerInitialized = true;
		}
	}
	var toolbarTriggersAttached = /* @__PURE__ */ new Set();
	var chatComposerTriggersAttached = /* @__PURE__ */ new Set();
	function setupForceMobileToolbarListeners() {
		if (!(userscriptState.settings?.forceMobileMode || false)) return;
		getPlatformToolbarSelectors().forEach((selector) => {
			Array.from(document.querySelectorAll(selector)).forEach((toolbar) => {
				try {
					Array.from(toolbar.querySelectorAll("button.toolbar-menu__options-trigger[data-identifier=\"toolbar-menu__options\"]:not(.emoji-detected):not(.emoji-attached), button.toolbar-menu__options-trigger:not(.emoji-detected):not(.emoji-attached)")).forEach((trigger) => {
						const triggerId = `toolbar-${trigger.id || Math.random().toString(36).substr(2, 9)}`;
						if (toolbarTriggersAttached.has(triggerId)) return;
						trigger.classList.add("emoji-detected");
						trigger.classList.add("emoji-attached");
						const handler = () => {
							const checkMenu = (attempt = 0) => {
								const modalContainer = document.querySelector(".modal-container");
								let menu = null;
								if (modalContainer) menu = modalContainer.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
								if (!menu) menu = document.querySelector(".toolbar-menu__options-content[data-identifier=\"toolbar-menu__options\"]");
								if (menu) injectCustomMenuButtons(menu);
								else if (attempt < 5) setTimeout(() => checkMenu(attempt + 1), 20);
							};
							checkMenu();
						};
						trigger.addEventListener("click", handler);
						trigger.dataset.emojiListenerAttached = "true";
						toolbarTriggersAttached.add(triggerId);
					});
					Array.from(toolbar.querySelectorAll("button.chat-composer-dropdown__trigger-btn:not(.emoji-detected):not(.emoji-attached), button.chat-composer-dropdown__menu-trigger:not(.emoji-detected):not(.emoji-attached), button.chat-composer-dropdown__trigger-btn:not(.emoji-detected):not(.emoji-attached), button.chat-composer-dropdown__menu-trigger:not(.emoji-detected):not(.emoji-attached)")).forEach((trigger) => {
						const triggerId = `chat-${trigger.id || Math.random().toString(36).substr(2, 9)}`;
						if (chatComposerTriggersAttached.has(triggerId)) return;
						trigger.classList.add("emoji-detected");
						trigger.classList.add("emoji-attached");
						const handler = () => {
							setTimeout(() => {
								const menu = document.querySelector(".chat-composer-dropdown__content[data-identifier=\"chat-composer-dropdown__menu\"], .chat-composer-dropdown__menu-content[data-identifier=\"chat-composer-dropdown__menu\"]");
								if (menu) injectCustomMenuButtons(menu);
							}, 80);
						};
						trigger.addEventListener("click", handler);
						trigger.dataset.emojiListenerAttached = "true";
						chatComposerTriggersAttached.add(triggerId);
					});
				} catch (e) {
					console.warn("[Emoji Extension Userscript] Failed to attach force-mobile listeners to toolbar", e);
				}
			});
		});
	}
	var _forceMobileToolbarIntervalId = null;
	var _domChangeCheckIntervalId = null;
	var _buttonExistenceCheckIntervalId = null;
	function startForceMobileToolbarListenerInterval(intervalMs = 1e3) {
		if (!(userscriptState.settings?.forceMobileMode || false)) return;
		if (_forceMobileToolbarIntervalId !== null) return;
		try {
			setupForceMobileToolbarListeners();
		} catch (e) {}
		_forceMobileToolbarIntervalId = window.setInterval(() => {
			try {
				setupForceMobileToolbarListeners();
			} catch (e) {}
		}, intervalMs);
	}
	function startDomChangeCheckInterval() {
		if (!(userscriptState.settings?.forceMobileMode || false)) return;
		if (_domChangeCheckIntervalId !== null) return;
		try {
			checkButtonsAndInjectIfNeeded();
		} catch (e) {}
		_domChangeCheckIntervalId = window.setInterval(() => {
			try {
				checkButtonsAndInjectIfNeeded();
			} catch (e) {}
		}, 1e3);
	}
	function startButtonExistenceCheckInterval() {
		if (_buttonExistenceCheckIntervalId !== null) return;
		_buttonExistenceCheckIntervalId = window.setInterval(() => {
			try {
				if (document.querySelectorAll(".emoji-extension-menu-item").length === 0) {
					setupForceMobileMenuTriggers();
					setupForceMobileToolbarListeners();
				}
			} catch (e) {}
		}, 1e4);
	}
	function checkButtonsAndInjectIfNeeded() {
		if (!(userscriptState.settings?.forceMobileMode || false)) return;
		const toolbarTrigger = document.querySelector("button.toolbar-menu__options-trigger[data-identifier=\"toolbar-menu__options\"]:not(.emoji-detected)");
		const chatComposerTrigger = document.querySelector("button.chat-composer-dropdown__trigger-btn[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger.chat-composer-dropdown__trigger-btn:not(.emoji-detected)");
		if (toolbarTrigger && !toolbarOptionsTriggerInitialized) {
			if (document.querySelector("button.toolbar-menu__options-trigger[data-identifier=\"toolbar-menu__options\"]:not(.emoji-detected)")) setupForceMobileMenuTriggers();
		}
		if (chatComposerTrigger && !chatComposerTriggerInitialized) {
			if (document.querySelector("button.chat-composer-dropdown__trigger-btn[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger[data-identifier=\"chat-composer-dropdown__menu\"]:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger.chat-composer-dropdown__trigger-btn:not(.emoji-detected)")) setupForceMobileMenuTriggers();
		}
		const selectors = getPlatformToolbarSelectors();
		for (const selector of selectors) {
			const elements = Array.from(document.querySelectorAll(selector));
			for (const toolbar of elements) if (Array.from(toolbar.querySelectorAll("button.toolbar-menu__options-trigger:not(.emoji-detected), button.chat-composer-dropdown__trigger-btn:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger:not(.emoji-detected), button.chat-composer-dropdown__menu-trigger.chat-composer-dropdown__trigger-btn:not(.emoji-detected)")).length > 0) {
				setupForceMobileToolbarListeners();
				break;
			}
		}
	}
	function startAllForceMobileIntervals() {
		startForceMobileToolbarListenerInterval(1e3);
		startDomChangeCheckInterval();
		startButtonExistenceCheckInterval();
	}
	function shouldSkipToolbarInjection() {
		if (!(userscriptState.settings?.forceMobileMode || false)) return false;
		return !!document.querySelector("#d-menu-portals");
	}
	function findAllToolbars() {
		if (shouldSkipToolbarInjection()) {
			console.log("[Emoji Extension Userscript] Force mobile mode with #d-menu-portals detected, skipping toolbar injection");
			return [];
		}
		const toolbars = [];
		const selectors = getPlatformToolbarSelectors();
		for (const selector of selectors) {
			const elements = document.querySelectorAll(selector);
			toolbars.push(...Array.from(elements));
		}
		return toolbars;
	}
	function attemptInjection() {
		const toolbars = findAllToolbars();
		let injectedCount = 0;
		toolbars.forEach((toolbar) => {
			if (!toolbar.querySelector(".emoji-extension-button")) {
				console.log("[Emoji Extension Userscript] Toolbar found, injecting button.");
				injectEmojiButton(toolbar);
				injectedCount++;
			}
		});
		setupForceMobileMenuTriggers();
		try {
			setupForceMobileToolbarListeners();
			try {
				startAllForceMobileIntervals();
			} catch (e) {}
		} catch (e) {}
		return {
			injectedCount,
			totalToolbars: toolbars.length
		};
	}
	function startPeriodicInjection() {
		setInterval(() => {
			findAllToolbars().forEach((toolbar) => {
				if (!toolbar.querySelector(".emoji-extension-button")) {
					console.log("[Emoji Extension Userscript] New toolbar found, injecting button.");
					injectEmojiButton(toolbar);
				}
			});
			setupForceMobileMenuTriggers();
			try {
				setupForceMobileToolbarListeners();
				startAllForceMobileIntervals();
			} catch (e) {}
		}, 3e4);
	}
	function userscriptNotify(message, type = "info", timeout = 4e3) {
		try {
			let container = document.getElementById("emoji-ext-userscript-toast");
			if (!container) {
				container = createEl("div", {
					attrs: {
						id: "emoji-ext-userscript-toast",
						"aria-live": "polite"
					},
					style: `
        position: fixed;
        right: 12px; 
        bottom: 12px; 
        z-index: 2147483646; 
        display:flex; 
        flex-direction:column; 
        gap:8px;
        `
				});
				try {
					if (document.body) document.body.appendChild(container);
					else document.documentElement.appendChild(container);
				} catch (e) {
					document.documentElement.appendChild(container);
				}
				container.style.position = "fixed";
				container.style.right = "12px";
				container.style.bottom = "12px";
				container.style.zIndex = String(2147483646);
				try {
					container.style.setProperty("z-index", String(2147483646), "important");
				} catch (_e) {}
				container.style.display = "flex";
				container.style.flexDirection = "column";
				container.style.gap = "8px";
				container.style.pointerEvents = "auto";
			}
			const el = createEl("div", {
				text: message,
				style: `padding:8px 12px; border-radius:6px; color:#fff; font-size:13px; max-width:320px; word-break:break-word; opacity:0; transform: translateY(8px); transition: all 220ms ease;`
			});
			if (type === "success") el.style.setProperty("background", "#16a34a", "important");
			else if (type === "error") el.style.setProperty("background", "#dc2626", "important");
			else el.style.setProperty("background", "#0369a1", "important");
			container.appendChild(el);
			el.offsetHeight;
			el.style.opacity = "1";
			el.style.transform = "translateY(0)";
			const id = setTimeout(() => {
				try {
					el.style.opacity = "0";
					el.style.transform = "translateY(8px)";
					setTimeout(() => el.remove(), 250);
				} catch (_e) {}
				clearTimeout(id);
			}, timeout);
			try {
				console.log("[UserscriptNotify] shown:", message, "type=", type);
			} catch (_e) {}
			return () => {
				try {
					el.remove();
				} catch (_e) {}
				clearTimeout(id);
			};
		} catch (_e) {
			return () => {};
		}
	}
	var floatingButton = null;
	var isButtonVisible = false;
	var FLOATING_BUTTON_STYLES = `
.emoji-extension-floating-container {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  z-index: 999999 !important;
}

.emoji-extension-floating-button {
  width: 56px !important;
  height: 56px !important;
  border-radius: 50% !important;
  background: transparent;
  border: none !important;
  box-shadow: 0 4px 12px var(--emoji-button-shadow) !important;
  cursor: pointer !important;
  color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
  opacity: 0.95 !important;
}

.emoji-extension-floating-button:hover { 
  transform: scale(1.05) !important;
 }
.emoji-extension-floating-button:active { transform: scale(0.95) !important; }

.emoji-extension-floating-button.secondary {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%) !important;
}

.emoji-extension-floating-button.hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateY(20px) !important;
}

@media (max-width: 768px) {
  .emoji-extension-floating-button { 
  width: 48px !important; 
  height: 48px !important; 
  font-size: 20px !important; }
  .emoji-extension-floating-container { bottom: 15px !important; right: 15px !important; }
}
`;
	function injectStyles() {
		injectGlobalThemeStyles();
		ensureStyleInjected("emoji-extension-floating-button-styles", FLOATING_BUTTON_STYLES);
	}
	function createManualButton() {
		const button = createEl("button", {
			className: "emoji-extension-floating-button",
			title: "手动注入表情按钮 (Manual Emoji Injection)",
			innerHTML: "🐈‍⬛"
		});
		button.addEventListener("click", async (e) => {
			e.stopPropagation();
			e.preventDefault();
			button.style.transform = "scale(0.9)";
			button.innerHTML = "⏳";
			try {
				if (attemptInjection().injectedCount > 0) {
					button.innerHTML = "✅";
					setTimeout(() => {
						button.innerHTML = "🐈‍⬛";
						button.style.transform = "scale(1)";
					}, 1500);
				} else {
					button.innerHTML = "❌";
					setTimeout(() => {
						button.innerHTML = "🐈‍⬛";
						button.style.transform = "scale(1)";
					}, 1500);
				}
			} catch (error) {
				button.innerHTML = "⚠️";
				setTimeout(() => {
					button.innerHTML = "🐈‍⬛";
					button.style.transform = "scale(1)";
				}, 1500);
				console.error("[Emoji Extension Userscript] Manual injection error:", error);
			}
		});
		return button;
	}
	async function invokeAutoRead(showNotify = false) {
		try {
			const fn = window.callAutoReadRepliesV2 || window.autoReadAllRepliesV2;
			console.log("[Emoji Extension] invokeAutoRead: found fn=", !!fn, " typeof=", typeof fn, " showNotify=", showNotify);
			if (fn && typeof fn === "function") {
				const res = await fn();
				console.log("[Emoji Extension] invokeAutoRead: fn returned", res);
				if (showNotify) userscriptNotify("自动阅读已触发", "success");
			} else {
				console.warn("[Emoji Extension] autoRead function not available on window");
				console.log("[Emoji Extension] invokeAutoRead: attempting userscriptNotify fallback");
				userscriptNotify("自动阅读功能当前不可用", "error");
			}
		} catch (err) {
			console.error("[Emoji Extension] auto-read menu invocation failed", err);
			if (showNotify) userscriptNotify("自动阅读调用失败：" + (err && err.message ? err.message : String(err)), "error");
		}
	}
	function createAutoReadMenuItem(variant = "dropdown") {
		if (variant === "dropdown") {
			const li$1 = createEl("li", { className: "submenu-item emoji-extension-auto-read" });
			const a = createEl("a", {
				className: "submenu-link",
				attrs: {
					href: "#",
					title: "像插件一样自动阅读话题 (Auto-read topics)"
				},
				innerHTML: `
      <svg class="fa d-icon d-icon-book svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#book"></use></svg>
      自动阅读
    `
			});
			a.addEventListener("click", async (e) => {
				e.preventDefault();
				e.stopPropagation();
				await invokeAutoRead(true);
			});
			li$1.appendChild(a);
			return li$1;
		}
		const li = createEl("li", {
			className: "submenu-item emoji-extension-auto-read sidebar-section-link-wrapper",
			style: "list-style: none; padding-left: 0;"
		});
		const btn = createEl("button", {
			className: "fk-d-menu__trigger sidebar-more-section-trigger sidebar-section-link sidebar-more-section-links-details-summary sidebar-row --link-button sidebar-section-link sidebar-row",
			attrs: {
				type: "button",
				title: "像插件一样自动阅读话题 (Auto-read topics)",
				"aria-expanded": "false",
				"data-identifier": "emoji-ext-auto-read",
				"data-trigger": ""
			},
			innerHTML: `
      <span class="sidebar-section-link-prefix icon">
        <svg class="fa d-icon d-icon-book svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#book"></use></svg>
      </span>
      <span class="sidebar-section-link-content-text">自动阅读</span>
    `,
			style: `
    background: transparent; 
    border: none;
    `
		});
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await invokeAutoRead(true);
		});
		li.appendChild(btn);
		return li;
	}
	function showFloatingButton() {
		if (userscriptState.settings?.forceMobileMode || false) {
			if (document.querySelector("#d-menu-portals")) {
				console.log("[Emoji Extension Userscript] Force mobile mode with #d-menu-portals detected, skipping floating button");
				return;
			}
		}
		if (floatingButton) return;
		injectStyles();
		const manual = createManualButton();
		const wrapper = createEl("div", { className: "emoji-extension-floating-container" });
		wrapper.appendChild(manual);
		document.body.appendChild(wrapper);
		floatingButton = wrapper;
		isButtonVisible = true;
		console.log("[Emoji Extension Userscript] Floating manual injection button shown (bottom-right)");
	}
	async function injectIntoUserMenu() {
		const SELECTOR_SIDEBAR = "#sidebar-section-content-community";
		const SELECTOR_OTHER_ANCHOR = "a.menu-item[title=\"其他服务\"], a.menu-item.vdm[title=\"其他服务\"]";
		const SELECTOR_OTHER_DROPDOWN = ".d-header-dropdown .d-dropdown-menu";
		for (;;) {
			const otherAnchor = document.querySelector(SELECTOR_OTHER_ANCHOR);
			if (otherAnchor) {
				const dropdown = otherAnchor.querySelector(SELECTOR_OTHER_DROPDOWN);
				if (dropdown) {
					dropdown.appendChild(createAutoReadMenuItem("dropdown"));
					isButtonVisible = true;
					console.log("[Emoji Extension Userscript] Auto-read injected into 其他服务 dropdown");
					return;
				}
			}
			const sidebar = document.querySelector(SELECTOR_SIDEBAR);
			if (sidebar) {
				sidebar.appendChild(createAutoReadMenuItem("sidebar"));
				isButtonVisible = true;
				console.log("[Emoji Extension Userscript] Auto-read injected into sidebar #sidebar-section-content-community");
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}
	async function showAutoReadInMenu() {
		injectStyles();
		try {
			await injectIntoUserMenu();
			return;
		} catch (e) {
			console.warn("[Emoji Extension Userscript] injecting menu item failed", e);
		}
	}
	function hideFloatingButton() {
		if (floatingButton) {
			floatingButton.classList.add("hidden");
			setTimeout(() => {
				if (floatingButton) {
					floatingButton.remove();
					floatingButton = null;
					isButtonVisible = false;
				}
			}, 300);
			console.log("[Emoji Extension Userscript] Floating manual injection button hidden");
		}
	}
	function autoShowFloatingButton() {
		if (!isButtonVisible) {
			console.log("[Emoji Extension Userscript] Auto-showing floating button due to injection difficulties");
			showFloatingButton();
		}
	}
	function checkAndShowFloatingButton() {
		if (userscriptState.settings?.forceMobileMode || false) {
			if (document.querySelector("#d-menu-portals")) {
				if (isButtonVisible) hideFloatingButton();
				return;
			}
		}
		const existingButtons = document.querySelectorAll(".emoji-extension-button");
		if (existingButtons.length === 0 && !isButtonVisible) setTimeout(() => {
			autoShowFloatingButton();
		}, 2e3);
		else if (existingButtons.length > 0 && isButtonVisible) hideFloatingButton();
	}
	function createE(tag, opts) {
		const el = document.createElement(tag);
		if (opts) {
			if (opts.wi) el.style.width = opts.wi;
			if (opts.he) el.style.height = opts.he;
			if (opts.class) el.className = opts.class;
			if (opts.text) el.textContent = opts.text;
			if (opts.ph && "placeholder" in el) el.placeholder = opts.ph;
			if (opts.type && "type" in el) el.type = opts.type;
			if (opts.val !== void 0 && "value" in el) el.value = opts.val;
			if (opts.style) el.style.cssText = opts.style;
			if (opts.src && "src" in el) el.src = opts.src;
			if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k]);
			if (opts.dataset) for (const k in opts.dataset) el.dataset[k] = opts.dataset[k];
			if (opts.in) el.innerHTML = opts.in;
			if (opts.ti) el.title = opts.ti;
			if (opts.alt && "alt" in el) el.alt = opts.alt;
			if (opts.id) el.id = opts.id;
			if (opts.accept && "accept" in el) el.accept = opts.accept;
			if (opts.multiple !== void 0 && "multiple" in el) el.multiple = opts.multiple;
			if (opts.role) el.setAttribute("role", opts.role);
			if (opts.tabIndex !== void 0) el.tabIndex = Number(opts.tabIndex);
			if (opts.ld && "loading" in el) el.loading = opts.ld;
			if (opts.on) for (const [evt, handler] of Object.entries(opts.on)) el.addEventListener(evt, handler);
			if (opts.child) opts.child.forEach((child) => el.appendChild(child));
		}
		return el;
	}
	const DOA = document.body.appendChild.bind(document.body);
	document.head.appendChild.bind(document.head);
	const DEBI = document.getElementById.bind(document);
	document.addEventListener.bind(document);
	const DQSA = document.querySelectorAll.bind(document);
	const DQS = document.querySelector.bind(document);
	async function postTimings(topicId, timings) {
		function readCsrfToken() {
			try {
				const meta = DQS("meta[name=\"csrf-token\"]");
				if (meta && meta.content) return meta.content;
				const input = DQS("input[name=\"authenticity_token\"]");
				if (input && input.value) return input.value;
				const match = document.cookie.match(/csrf_token=([^;]+)/);
				if (match) return decodeURIComponent(match[1]);
			} catch (e) {
				console.warn("[timingsBinder] failed to read csrf token", e);
			}
			return null;
		}
		const csrf = readCsrfToken() || "";
		const map = {};
		if (Array.isArray(timings)) for (let i = 0; i < timings.length; i++) map[i] = timings[i];
		else for (const k of Object.keys(timings)) {
			const key = Number(k);
			if (!Number.isNaN(key)) map[key] = timings[key];
		}
		const params = new URLSearchParams();
		let maxTime = 0;
		for (const idxStr of Object.keys(map)) {
			const idx = Number(idxStr);
			const val = String(map[idx]);
			params.append(`timings[${idx}]`, val);
			const num = Number(val);
			if (!Number.isNaN(num) && num > maxTime) maxTime = num;
		}
		params.append("topic_time", String(maxTime));
		params.append("topic_id", String(topicId));
		const url = `https://${window.location.hostname}/topics/timings`;
		const headers = {
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"x-requested-with": "XMLHttpRequest"
		};
		if (csrf) headers["x-csrf-token"] = csrf;
		const MAX_RETRIES = 5;
		const BASE_DELAY = 500;
		for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
			const resp = await fetch(url, {
				method: "POST",
				body: params.toString(),
				credentials: "same-origin",
				headers
			});
			if (resp.status !== 429) return resp;
			if (attempt === MAX_RETRIES) return resp;
			const retryAfter = resp.headers.get("Retry-After");
			let waitMs = 0;
			if (retryAfter) {
				const asInt = parseInt(retryAfter, 10);
				if (!Number.isNaN(asInt)) waitMs = asInt * 1e3;
				else {
					const date = Date.parse(retryAfter);
					if (!Number.isNaN(date)) waitMs = Math.max(0, date - Date.now());
				}
			}
			if (!waitMs) waitMs = BASE_DELAY * Math.pow(2, attempt) + Math.floor(Math.random() * BASE_DELAY);
			await new Promise((resolve) => setTimeout(resolve, waitMs));
		}
		throw new Error("postTimings: unexpected execution path");
	}
	function notify(message, type = "info", timeout = 4e3) {
		try {
			let container = DEBI("emoji-ext-toast-container");
			if (!container) {
				container = createE("div", {
					id: "emoji-ext-toast-container",
					style: `
          position: fixed;
          right: 12px;
          bottom: 12px;
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          gap: 8px;
        `
				});
				DOA(container);
			}
			const el = createE("div", {
				text: message,
				style: `
        padding: 8px 12px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        color: #ffffff;
        font-size: 13px;
        max-width: 320px;
        word-break: break-word;
        transform: translateY(20px);
      `
			});
			if (type === "success") el.style.background = "#16a34a";
			else if (type === "error") el.style.background = "#dc2626";
			else if (type === "transparent") el.style.background = "transparent";
			else if (type === "rainbow") {
				el.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)";
				el.style.backgroundSize = "400% 100%";
				el.style.animation = "color-shift 15s linear infinite";
				if (!DEBI("color-shift-keyframes")) DOA(createE("style", {
					id: "color-shift-keyframes",
					text: `
                @keyframes color-shift {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
              `
				}));
				el.style.animation = "color-shift 1s linear infinite";
			} else el.style.background = "#0369a1";
			container.appendChild(el);
			const id = setTimeout(() => {
				el.remove();
				clearTimeout(id);
			}, timeout);
			return () => {
				el.remove();
				clearTimeout(id);
			};
		} catch {
			try {
				alert(message);
			} catch {}
			return () => {};
		}
	}
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	async function fetchPostsForTopic(topicId) {
		const url = `/t/${topicId}/posts.json`;
		const resp = await fetch(url, { credentials: "same-origin" });
		if (!resp.ok) throw new Error(`failed to fetch posts.json: ${resp.status}`);
		const data = await resp.json();
		let posts = [];
		let totalCount = 0;
		if (data && data.post_stream && Array.isArray(data.post_stream.posts)) {
			posts = data.post_stream.posts;
			if (posts.length > 0 && typeof posts[0].posts_count === "number") totalCount = posts[0].posts_count + 1;
		}
		if ((!posts || posts.length === 0) && data && Array.isArray(data.posts)) posts = data.posts;
		if (!totalCount) {
			if (data && typeof data.highest_post_number === "number") totalCount = data.highest_post_number;
			else if (data && typeof data.posts_count === "number") totalCount = data.posts_count;
			else if (posts && posts.length > 0) totalCount = posts.length;
		}
		return {
			posts,
			totalCount
		};
	}
	function getCSRFToken() {
		try {
			const meta = document.querySelector("meta[name=\"csrf-token\"]");
			if (meta && meta.content) return meta.content;
			const meta2 = document.querySelector("meta[name=\"x-csrf-token\"]");
			if (meta2 && meta2.content) return meta2.content;
			const anyWin = window;
			if (anyWin && anyWin.csrfToken) return anyWin.csrfToken;
			if (anyWin && anyWin._csrf_token) return anyWin._csrf_token;
			const m = document.cookie.match(/(?:XSRF-TOKEN|_csrf)=([^;]+)/);
			if (m && m[1]) return decodeURIComponent(m[1]);
		} catch (e) {}
		return null;
	}
	async function setNotificationLevel(topicId, level = 1) {
		const token = getCSRFToken();
		if (!token) {
			notify("无法获取 CSRF token，未能设置追踪等级", "error");
			return;
		}
		const url = `${location.origin}/t/${topicId}/notifications`;
		const body = `notification_level=${encodeURIComponent(String(level))}`;
		try {
			const resp = await fetch(url, {
				method: "POST",
				headers: {
					accept: "*/*",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"x-csrf-token": token,
					"x-requested-with": "XMLHttpRequest",
					"discourse-logged-in": "true",
					"discourse-present": "true",
					priority: "u=1, i"
				},
				body,
				mode: "cors",
				credentials: "include"
			});
			if (!resp.ok) throw new Error(`设置追踪等级请求失败：${resp.status}`);
			notify(`话题 ${topicId} 的追踪等级已设置为 ${level}`, "rainbow");
		} catch (e) {
			notify("设置追踪等级失败：" + (e && e.message ? e.message : String(e)), "error");
		}
	}
	async function autoReadAll(topicId, startFrom = 1) {
		try {
			let tid = topicId || 0;
			if (!tid) {
				const m1 = window.location.pathname.match(/t\/topic\/(\d+)/);
				const m2 = window.location.pathname.match(/t\/(\d+)/);
				if (m1 && m1[1]) tid = Number(m1[1]);
				else if (m2 && m2[1]) tid = Number(m2[1]);
				else {
					const el = DQS("[data-topic-id]");
					if (el) tid = Number(el.getAttribute("data-topic-id")) || 0;
				}
			}
			if (!tid) {
				notify("无法推断 topic_id，自动阅读取消", "error");
				return;
			}
			notify(`开始自动阅读话题 ${tid} 的所有帖子...`, "info");
			const { posts, totalCount } = await fetchPostsForTopic(tid);
			if ((!posts || posts.length === 0) && !totalCount) {
				notify("未获取到任何帖子或总数信息", "error");
				return;
			}
			const total = totalCount || posts.length;
			const postNumbers = [];
			if (startFrom > total) {
				notify(`起始帖子号 ${startFrom} 超过总帖子数 ${total}，已跳过`, "transparent");
				return;
			}
			for (let n = startFrom; n <= total; n++) postNumbers.push(n);
			let BATCH_SIZE = Math.floor(Math.random() * 951) + 50;
			const ran = () => {
				BATCH_SIZE = Math.floor(Math.random() * 1e3) + 50;
			};
			for (let i = 0; i < postNumbers.length; i += BATCH_SIZE) {
				const batch = postNumbers.slice(i, i + BATCH_SIZE);
				ran();
				const timings = {};
				for (const pn of batch) timings[pn] = Math.random() * 1e4;
				try {
					await postTimings(tid, timings);
					notify(`已标记 ${Object.keys(timings).length} 个帖子为已读（发送）`, "success");
				} catch (e) {
					notify("发送阅读标记失败：" + (e && e.message ? e.message : String(e)), "error");
				}
				await sleep(500 + Math.floor(Math.random() * 1e3));
			}
			try {
				await setNotificationLevel(tid, 1);
			} catch (e) {}
			notify("自动阅读完成", "success");
		} catch (e) {
			notify("自动阅读异常：" + (e && e.message ? e.message : String(e)), "error");
		}
	}
	async function autoReadAllv2(topicId) {
		let tid = topicId || 0;
		if (!tid) {
			const m1 = window.location.pathname.match(/t\/topic\/(\d+)/);
			const m2 = window.location.pathname.match(/t\/(\d+)/);
			if (m1 && m1[1]) tid = Number(m1[1]);
			else if (m2 && m2[1]) tid = Number(m2[1]);
			else {
				const anchors = Array.from(DQSA("a[href]"));
				const seen = /* @__PURE__ */ new Set();
				for (const a of anchors) {
					const m = (a.getAttribute("href") || "").match(/^\/t\/topic\/(\d+)(?:\/(\d+))?$/);
					if (!m) continue;
					const id = Number(m[1]);
					const readPart = m[2] ? Number(m[2]) : void 0;
					const start = readPart && !Number.isNaN(readPart) ? readPart : 2;
					if (!id || seen.has(id)) continue;
					seen.add(id);
					await autoReadAll(id, start);
					await sleep(200);
				}
			}
		}
	}
	window.autoReadAllReplies = autoReadAll;
	window.autoReadAllRepliesV2 = autoReadAllv2;
	if (!window.autoReadAllRepliesV2) window.autoReadAllRepliesV2 = autoReadAllv2;
	async function initializeUserscriptData() {
		const data = await loadDataFromLocalStorageAsync(window.location.hostname).catch((err) => {
			console.warn("[Emoji Picker] loadDataFromLocalStorageAsync failed, falling back to sync loader", err);
			return loadDataFromLocalStorage();
		});
		userscriptState.emojiGroups = data.emojiGroups || [];
		userscriptState.settings = data.settings || userscriptState.settings;
	}
	function isDiscoursePage() {
		if (document.querySelectorAll("meta[name*=\"discourse\"], meta[content*=\"discourse\"], meta[property*=\"discourse\"]").length > 0) {
			console.log("[Emoji Picker] Discourse detected via meta tags");
			return true;
		}
		const generatorMeta = document.querySelector("meta[name=\"generator\"]");
		if (generatorMeta) {
			if ((generatorMeta.getAttribute("content")?.toLowerCase() || "").includes("discourse")) {
				console.log("[Emoji Picker] Discourse detected via generator meta");
				return true;
			}
		}
		if (document.querySelectorAll("#main-outlet, .ember-application, textarea.d-editor-input, .ProseMirror.d-editor-input").length > 0) {
			console.log("[Emoji Picker] Discourse elements detected");
			return true;
		}
		console.log("[Emoji Picker] Not a Discourse site");
		return false;
	}
	async function initializeEmojiFeature(maxAttempts = 10, delay = 1e3) {
		console.log("[Emoji Picker] Initializing...");
		logPlatformInfo();
		await initializeUserscriptData();
		try {
			if (userscriptState.settings?.enableBatchParseImages !== false) {
				initOneClickAdd();
				initPhotoSwipeTopbarUserscript();
				console.log("[Emoji Picker] One-click batch parse images enabled");
			} else console.log("[Emoji Picker] One-click batch parse images disabled by setting");
		} catch (e) {
			console.warn("[Emoji Picker] initOneClickAdd failed", e);
		}
		try {
			showAutoReadInMenu();
		} catch (e) {
			console.warn("[Emoji Picker] showAutoReadInMenu failed", e);
		}
		function exposeAutoReadWrapper() {
			try {
				const existing = window.autoReadAllRepliesV2;
				if (existing && typeof existing === "function") {
					window.callAutoReadRepliesV2 = (topicId) => {
						try {
							return existing(topicId);
						} catch (e) {
							console.warn("[Emoji Picker] callAutoReadRepliesV2 invocation failed", e);
						}
					};
					console.log("[Emoji Picker] callAutoReadRepliesV2 is exposed");
					return;
				}
				window.callAutoReadRepliesV2 = (topicId) => {
					try {
						const fn = window.autoReadAllRepliesV2;
						if (fn && typeof fn === "function") return fn(topicId);
					} catch (e) {
						console.warn("[Emoji Picker] callAutoReadRepliesV2 invocation failed", e);
					}
					console.warn("[Emoji Picker] autoReadAllRepliesV2 not available on this page yet");
				};
			} catch (e) {
				console.warn("[Emoji Picker] exposeAutoReadWrapper failed", e);
			}
		}
		exposeAutoReadWrapper();
		let attempts = 0;
		function attemptToolbarInjection() {
			attempts++;
			const result = attemptInjection();
			if (result.injectedCount > 0 || result.totalToolbars > 0) {
				console.log(`[Emoji Picker] Injection successful: ${result.injectedCount} buttons injected into ${result.totalToolbars} toolbars`);
				return;
			}
			if (attempts < maxAttempts) {
				console.log(`[Emoji Picker] Toolbar not found, attempt ${attempts}/${maxAttempts}. Retrying in ${delay / 1e3}s.`);
				setTimeout(attemptToolbarInjection, delay);
			} else {
				console.error("[Emoji Picker] Failed to find toolbar after multiple attempts.");
				console.log("[Emoji Picker] Showing floating button as fallback");
				showFloatingButton();
			}
		}
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attemptToolbarInjection);
		else attemptToolbarInjection();
		startPeriodicInjection();
		setInterval(() => {
			checkAndShowFloatingButton();
		}, 5e3);
	}
	if (isDiscoursePage()) {
		console.log("[Emoji Picker] Discourse detected, initializing emoji picker feature");
		initializeEmojiFeature();
	} else console.log("[Emoji Picker] Not a Discourse site, skipping injection");
})();

})();