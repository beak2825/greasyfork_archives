// ==UserScript==
// @name         Discourse 表情管理器 (Emoji Manager) mgr lite
// @namespace    https://github.com/stevessr/bug-v3
// @version      1.2.5
// @description  Discourse 论坛表情管理 - 设置、导入导出、分组编辑 (Emoji management for Discourse - Settings, import/export, group editor)
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
// @downloadURL https://update.greasyfork.org/scripts/554980/Discourse%20%E8%A1%A8%E6%83%85%E7%AE%A1%E7%90%86%E5%99%A8%20%28Emoji%20Manager%29%20mgr%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/554980/Discourse%20%E8%A1%A8%E6%83%85%E7%AE%A1%E7%90%86%E5%99%A8%20%28Emoji%20Manager%29%20mgr%20lite.meta.js
// ==/UserScript==

(function() {
'use strict';

(function() {
	var __defProp = Object.defineProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __export = (all) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		return target;
	};
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
	var init_default_emoji_loader = __esmMin((() => {}));
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
	function syncFromManager() {
		try {
			const managerGroups = localStorage.getItem("emoji_extension_manager_groups");
			const managerSettings = localStorage.getItem("emoji_extension_manager_settings");
			let updated = false;
			if (managerGroups) {
				const groups = JSON.parse(managerGroups);
				if (Array.isArray(groups)) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
					updated = true;
				}
			}
			if (managerSettings) {
				const settings = JSON.parse(managerSettings);
				if (typeof settings === "object") {
					localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
					updated = true;
				}
			}
			if (updated) console.log("[Userscript] Synced data from manager");
			return updated;
		} catch (error) {
			console.error("[Userscript] Failed to sync from manager:", error);
			return false;
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
	var STORAGE_KEY, SETTINGS_KEY, USAGE_STATS_KEY, DEFAULT_USER_SETTINGS;
	var init_userscript_storage = __esmMin((() => {
		init_default_emoji_loader();
		STORAGE_KEY = "emoji_extension_userscript_data";
		SETTINGS_KEY = "emoji_extension_userscript_settings";
		USAGE_STATS_KEY = "emoji_extension_userscript_usage_stats";
		DEFAULT_USER_SETTINGS = {
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
	}));
	var userscriptState;
	var init_state = __esmMin((() => {
		init_userscript_storage();
		userscriptState = {
			emojiGroups: [],
			settings: { ...DEFAULT_USER_SETTINGS },
			emojiUsageStats: {}
		};
	}));
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
	var init_platformDetection = __esmMin((() => {}));
	init_state();
	const __vitePreload = function preload(baseModule, deps, importerUrl) {
		let promise = Promise.resolve();
		function handlePreloadError(err$2) {
			const e$1 = new Event("vite:preloadError", { cancelable: true });
			e$1.payload = err$2;
			window.dispatchEvent(e$1);
			if (!e$1.defaultPrevented) throw err$2;
		}
		return promise.then((res) => {
			for (const item of res || []) {
				if (item.status !== "rejected") continue;
				handlePreloadError(item.reason);
			}
			return baseModule().catch(handlePreloadError);
		});
	};
	function ensureStyleInjected(id, css) {
		const style = document.createElement("style");
		style.id = id;
		style.textContent = css;
		document.documentElement.appendChild(style);
	}
	var init_injectStyles = __esmMin((() => {}));
	function injectManagerStyles() {
		if (__managerStylesInjected) return;
		__managerStylesInjected = true;
		ensureStyleInjected("emoji-manager-styles", `
    /* Modal backdrop */
    .emoji-manager-wrapper { 
      position: fixed; 
      top: 0; 
      left: 0; 
      right: 0; 
      bottom: 0; 
      z-index: 999999; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: rgba(0, 0, 0, 0.5);
    }
    
    /* Main modal panel */
    .emoji-manager-panel { 
      border-radius: 8px; 
      width: 90%; 
      height: 95%; 
      display: grid; 
      grid-template-columns: 300px 1fr; 
      grid-template-rows: 1fr auto;
      overflow: hidden; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.3); 
      background: var(--primary-low);
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
      .emoji-manager-panel {
        width: 100%;
        height: 100%;
        border-radius: 0;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
      }
    }
    
    /* Left panel - groups list */
    .emoji-manager-left { 
      background: var(--primary-very-low); 
      border-right: 1px solid #e9ecef; 
      display: flex; 
      flex-direction: column; 
      overflow: hidden; 
    }
    
    .emoji-manager-left-header { 
      display: flex; 
      align-items: center; 
      justify-content: space-between;
      padding: 16px; 
      background: var(--primary-low); 
    }
    
    .emoji-manager-left-header h3 {
      margin: 0;
      font-size: 18px;
      flex: 1;
    }
    
    /* Mobile: Left panel becomes a dropdown selector */
    @media (max-width: 768px) {
      .emoji-manager-left {
        border-right: none;
        border-bottom: 1px solid #e9ecef;
        max-height: none;
        overflow-y: visible;
      }
      
      .emoji-manager-left-header {
        padding: 12px 16px;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .emoji-manager-left-header h3 {
        font-size: 16px;
      }
      
      /* Hide the groups list on mobile */
      .emoji-manager-groups-list {
        display: none;
      }
      
      /* Hide add group row on mobile */
      .emoji-manager-addgroup-row {
        display: none;
      }
    }
    
    .emoji-manager-addgroup-row { 
      display: flex; 
      gap: 8px;
      padding: 12px; 
    }
    
    .emoji-manager-addgroup-row input {
      flex: 1;
      min-width: 0;
    }
    
    /* Group selector dropdown for mobile */
    .emoji-manager-group-selector {
      display: none;
      width: 100%;
      padding: 12px;
    }
    
    .emoji-manager-group-selector select {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background: var(--primary-very-low);
      color: var(--primary);
    }
    
    /* Mobile: Larger touch targets for add group */
    @media (max-width: 768px) {
      .emoji-manager-group-selector {
        display: block;
      }
      
      .emoji-manager-addgroup-row {
        padding: 12px 16px;
      }
      
      .emoji-manager-addgroup-row input,
      .emoji-manager-addgroup-row button {
        font-size: 16px;
        padding: 12px;
      }
    }
    
    .emoji-manager-groups-list { 
      background: var(--primary-very-low);
      flex: 1; 
      overflow-y: auto; 
      padding: 8px; 
    }
    
    .emoji-manager-groups-list > div { 
      margin-bottom: 4px; 
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s; 
    }
    
    .emoji-manager-groups-list > div:hover { 
      background: var(--d-selected); 
    }
    
    .emoji-manager-groups-list > div:focus { 
      outline: none; 
      box-shadow: inset 0 0 0 2px #007bff; 
      background: var(--d-selected); 
    }
    
    /* Mobile: Larger touch targets for group items */
    @media (max-width: 768px) {
      .emoji-manager-groups-list {
        padding: 8px 16px;
      }
      
      .emoji-manager-groups-list > div {
        padding: 16px 12px;
        margin-bottom: 8px;
        font-size: 15px;
      }
    }
    
    /* Right panel - emoji display and editing */
    .emoji-manager-right { 
      background: var(--primary-low); 
      display: flex; 
      flex-direction: column; 
      overflow: hidden; 
    }
    
    .emoji-manager-right-header { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding: 16px; 
      background: var(--primary-very-low);
      border-bottom: 1px solid #e9ecef;
    }
    
    .emoji-manager-right-header h4 {
      margin: 0;
      font-size: 16px;
      flex: 1;
    }
    
    /* Mobile: Sticky header and larger buttons */
    @media (max-width: 768px) {
      .emoji-manager-right-header {
        padding: 12px 16px;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .emoji-manager-right-header h4 {
        font-size: 15px;
      }
      
      .emoji-manager-right-header button {
        padding: 10px 16px;
        font-size: 14px;
      }
    }
    
    .emoji-manager-right-main { 
      flex: 1; 
      overflow-y: auto; 
      padding: 16px;
    }
    
    .emoji-manager-emojis { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
      gap: 12px; 
      padding: 0;
    }
    
    /* Mobile: Optimize grid for smaller screens */
    @media (max-width: 768px) {
      .emoji-manager-right-main {
        padding: 12px;
      }
      
      .emoji-manager-emojis {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
      }
    }
    
    @media (max-width: 480px) {
      .emoji-manager-emojis {
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        gap: 8px;
      }
    }
    
    .emoji-manager-card { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      padding: 12px; 
      background: var(--primary-medium); 
      border-radius: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .emoji-manager-card:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
    }
    
    /* Mobile: Better touch targets and spacing */
    @media (max-width: 768px) {
      .emoji-manager-card {
        padding: 10px;
        border-radius: 6px;
      }
      
      /* Disable hover effects on mobile */
      .emoji-manager-card:hover {
        transform: none;
        box-shadow: none;
      }
      
      /* Add active state for touch feedback */
      .emoji-manager-card:active {
        transform: scale(0.98);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
    }
    
    .emoji-manager-card-img { 
      max-width: 90%;
      max-height: 80px;
      object-fit: contain; 
      border-radius: 6px; 
      background: white; 
      margin-bottom: 8px;
    }
    
    .emoji-manager-card-name { 
      font-size: 12px; 
      color: var(--primary); 
      text-align: center; 
      width: 100%; 
      overflow: hidden; 
      white-space: nowrap; 
      text-overflow: ellipsis; 
      font-weight: 500; 
      margin-bottom: 8px;
    }
    
    .emoji-manager-card-actions { 
      display: flex; 
      gap: 6px; 
      width: 100%;
      justify-content: center;
    }
    
    /* Mobile: Larger buttons for touch */
    @media (max-width: 768px) {
      .emoji-manager-card-img {
        max-height: 70px;
        margin-bottom: 6px;
      }
      
      .emoji-manager-card-name {
        font-size: 11px;
        margin-bottom: 6px;
      }
      
      .emoji-manager-card-actions {
        gap: 8px;
      }
      
      .emoji-manager-card-actions .btn-sm {
        padding: 8px 12px;
        font-size: 13px;
        min-height: 36px;
        flex: 1;
      }
    }
    
    /* Add emoji form */
    .emoji-manager-add-emoji-form { 
      padding: 16px; 
      background: var(--primary-very-low); 
      border-top: 1px solid #e9ecef; 
      display: flex; 
      flex-wrap: wrap;
      gap: 8px; 
      align-items: center; 
    }
    
    .emoji-manager-add-emoji-form input {
      flex: 1;
      min-width: 150px;
    }
    
    .emoji-manager-add-emoji-form button {
      white-space: nowrap;
    }
    
    /* Mobile: Stack inputs vertically */
    @media (max-width: 768px) {
      .emoji-manager-add-emoji-form {
        padding: 12px 16px;
        flex-direction: column;
        align-items: stretch;
      }
      
      .emoji-manager-add-emoji-form input {
        width: 100%;
        min-width: 0;
        font-size: 16px;
        padding: 12px;
      }
      
      .emoji-manager-add-emoji-form button {
        width: 100%;
        padding: 12px;
        font-size: 15px;
        min-height: 44px;
      }
    }
    
    /* Footer */
    .emoji-manager-footer { 
      grid-column: 1 / -1;
      display: flex; 
      flex-wrap: wrap;
      justify-content: space-between; 
      gap: 12px;
      padding: 16px; 
      background: var(--primary-very-low); 
      border-top: 1px solid #e9ecef;
    }
    
    .emoji-manager-footer button {
      flex: 0 1 auto;
    }
    
    /* Mobile: Stack footer buttons */
    @media (max-width: 768px) {
      .emoji-manager-footer {
        padding: 12px 16px;
        flex-direction: column;
      }
      
      .emoji-manager-footer button {
        width: 100%;
        padding: 12px;
        font-size: 15px;
        min-height: 44px;
      }
    }
    
    /* Editor panel - popup modal */
    .emoji-manager-editor-panel { 
      position: fixed; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
      background: var(--primary-medium); 
      padding: 24px; 
      border-radius: 8px;
      z-index: 1000000; 
      max-width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    
    .emoji-manager-editor-panel input,
    .emoji-manager-editor-panel button {
      margin: 8px 0;
    }
    
    .emoji-manager-editor-preview { 
      max-width: 100%;
      max-height: 40vh;
      object-fit: contain;
      display: block;
      margin: 12px auto;
      border-radius: 6px;
      background: white;
    }
    
    /* Mobile: Full-width editor on small screens */
    @media (max-width: 768px) {
      .emoji-manager-editor-panel {
        width: calc(100% - 32px);
        max-width: none;
        padding: 20px;
        border-radius: 12px;
      }
      
      .emoji-manager-editor-panel input {
        font-size: 16px;
        padding: 12px;
        margin: 6px 0;
      }
      
      .emoji-manager-editor-panel button {
        padding: 12px;
        font-size: 15px;
        min-height: 44px;
      }
      
      .emoji-manager-editor-preview {
        max-height: 30vh;
      }
    }
    
    @media (max-width: 480px) {
      .emoji-manager-editor-panel {
        width: calc(100% - 16px);
        padding: 16px;
        max-height: 95vh;
      }
    }

    /* Hover preview (moved from inline styles) */
    .emoji-manager-hover-preview {
      position: fixed;
      pointer-events: none;
      z-index: 1000002;
      display: none;
      max-width: 60%;
      max-height: 60%;
      border: 1px solid rgba(0,0,0,0.1);
      object-fit: contain;
      background: var(--primary);
      padding: 4px;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    
    /* Mobile: Disable hover preview */
    @media (max-width: 768px) {
      .emoji-manager-hover-preview {
        display: none !important;
      }
    }
    
    /* Form styling */
    .form-control { 
      width: 100%; 
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.5;
      background: var(--primary-very-low);
      color: var(--primary);
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .btn { 
      padding: 8px 16px; 
      border: 1px solid transparent; 
      border-radius: 4px; 
      font-size: 14px; 
      font-weight: 500;
      cursor: pointer; 
      transition: all 0.2s; 
      color: var(--primary);
    }
    
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .btn:active {
      transform: translateY(0);
    }
    
    .btn-primary {
      background: #007bff;
      color: #fff;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .btn-sm { 
      padding: 6px 12px; 
      font-size: 13px; 
    }
    
    /* Mobile: Larger touch targets for buttons */
    @media (max-width: 768px) {
      .form-control {
        font-size: 16px;
        padding: 10px 12px;
      }
      
      .btn {
        min-height: 44px;
        padding: 10px 16px;
        font-size: 15px;
      }
      
      .btn:hover {
        transform: none;
      }
      
      .btn:active {
        transform: scale(0.98);
      }
      
      .btn-sm {
        padding: 8px 12px;
        font-size: 14px;
        min-height: 36px;
      }
    }
  `);
	}
	var __managerStylesInjected;
	var init_styles = __esmMin((() => {
		init_injectStyles();
		__managerStylesInjected = false;
	}));
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
	var init_createEl = __esmMin((() => {}));
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
	var _sharedPreview;
	var init_hoverPreview = __esmMin((() => {
		init_createEl();
		_sharedPreview = null;
	}));
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
	var themeStylesInjected;
	var init_themeSupport = __esmMin((() => {
		init_createEl();
		themeStylesInjected = false;
	}));
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
	var init_tempMessage = __esmMin((() => {
		init_createEl();
	}));
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
	var init_editorUtils = __esmMin((() => {
		init_createEl();
	}));
	var importExport_exports = /* @__PURE__ */ __export({ showImportExportModal: () => showImportExportModal });
	function showImportExportModal(currentGroupId) {
		injectGlobalThemeStyles();
		const currentGroup = currentGroupId ? userscriptState.emojiGroups.find((g) => g.id === currentGroupId) : null;
		const modal = createModalElement({
			title: "分组表情导入/导出",
			content: `
    ${currentGroup ? `
    <div style="margin-bottom: 24px; padding: 16px; background: var(--emoji-modal-button-bg); border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">当前分组信息</h3>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        ${currentGroup.icon?.startsWith("http") ? `<img src="${currentGroup.icon}" alt="图标" style="width: 24px; height: 24px; object-fit: contain;">` : `<span style="font-size: 20px;">${currentGroup.icon || "📁"}</span>`}
        <span style="font-weight: bold; color: var(--emoji-modal-text);">${currentGroup.name || currentGroup.id}</span>
      </div>
      <div style="color: var(--emoji-modal-text); font-size: 14px;">
        分组 ID: ${currentGroup.id} | 表情数量：${currentGroup.emojis?.length || 0}
      </div>
    </div>
    ` : ""}

    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">导出分组表情</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">选择要导出的分组:</label>
        <select id="exportGroupSelect" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          margin-bottom: 8px;
        ">
          ${currentGroup ? `<option value="${currentGroup.id}" selected>${currentGroup.name || currentGroup.id} (${currentGroup.emojis?.length || 0} 表情)</option>` : ""}
          ${userscriptState.emojiGroups.filter((g) => g.id !== currentGroupId).map((group) => `<option value="${group.id}">${group.name || group.id} (${group.emojis?.length || 0} 表情)</option>`).join("")}
        </select>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="exportGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">导出选中分组</button>
      </div>
    </div>

    <div>
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">导入分组表情</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">导入目标分组:</label>
        <select id="importTargetGroupSelect" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          margin-bottom: 8px;
        ">
          ${currentGroup ? `<option value="${currentGroup.id}" selected>${currentGroup.name || currentGroup.id}</option>` : ""}
          ${userscriptState.emojiGroups.filter((g) => g.id !== currentGroupId).map((group) => `<option value="${group.id}">${group.name || group.id}</option>`).join("")}
          <option value="__new__">创建新分组...</option>
        </select>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">上传分组文件:</label>
        <input type="file" id="importFile" accept=".json" style="margin-bottom: 8px; color: var(--emoji-modal-text);">
        <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7;">
          支持 JSON 格式的分组文件
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">或粘贴分组 JSON:</label>
        <textarea id="importText" placeholder="在此粘贴分组表情 JSON..." style="
          width: 100%;
          height: 120px;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          resize: vertical;
          font-family: monospace;
          font-size: 12px;
        "></textarea>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">导入选项:</label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="replace" checked style="margin-right: 8px;">
            替换现有表情 (清空目标分组后导入)
          </label>
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="merge" style="margin-right: 8px;">
            合并表情 (添加到现有表情中，跳过重复的)
          </label>
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="append" style="margin-right: 8px;">
            追加表情 (直接添加到现有表情后面)
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="importGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">导入到分组</button>
        <button id="previewImport" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">预览导入</button>
      </div>
    </div>
  `,
			onClose: () => modal.remove()
		});
		const content = modal.querySelector("div:last-child");
		document.body.appendChild(modal);
		function createDownload(data, filename) {
			const jsonString = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonString], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
		function parseImportData(jsonData) {
			try {
				const data = JSON.parse(jsonData);
				if (!data || typeof data !== "object") throw new Error("无效的 JSON 格式");
				return data;
			} catch (error) {
				throw new Error("JSON 解析失败：" + (error instanceof Error ? error.message : String(error)));
			}
		}
		content.querySelector("#exportGroup")?.addEventListener("click", () => {
			try {
				const selectedGroupId = content.querySelector("#exportGroupSelect").value;
				if (!selectedGroupId) {
					alert("请选择要导出的分组");
					return;
				}
				const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId);
				if (!group) {
					alert("找不到指定的分组");
					return;
				}
				const exportData = {
					type: "emoji_group",
					exportDate: (/* @__PURE__ */ new Date()).toISOString(),
					group: {
						id: group.id,
						name: group.name,
						icon: group.icon,
						emojis: group.emojis || [],
						order: group.order
					}
				};
				const timestamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-");
				createDownload(exportData, `emoji-group-${group.name || group.id}-${timestamp}.json`);
				showTemporaryMessage(`已导出分组 "${group.name || group.id}" (${group.emojis?.length || 0} 个表情)`);
			} catch (error) {
				console.error("Export group failed:", error);
				alert("导出分组失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
		content.querySelector("#importFile")?.addEventListener("change", (e) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const text = event.target?.result;
					const importTextarea = content.querySelector("#importText");
					if (importTextarea) importTextarea.value = text;
				};
				reader.onerror = () => {
					alert("文件读取失败");
				};
				reader.readAsText(file);
			}
		});
		content.querySelector("#previewImport")?.addEventListener("click", () => {
			try {
				const importText = content.querySelector("#importText").value.trim();
				if (!importText) {
					alert("请输入或选择要导入的内容");
					return;
				}
				const data = parseImportData(importText);
				let preview = "导入预览:\\n\\n";
				if (data.type === "emoji_group" && data.group) {
					const group = data.group;
					preview += `分组类型：单个表情分组\\n`;
					preview += `分组名称：${group.name || group.id || "Unnamed"}\\n`;
					preview += `分组 ID: ${group.id || "N/A"}\\n`;
					preview += `图标：${group.icon || "无"}\\n`;
					preview += `表情数量：${group.emojis?.length || 0}\\n\\n`;
					if (group.emojis && group.emojis.length > 0) {
						preview += `表情列表 (前 5 个):\\n`;
						group.emojis.slice(0, 5).forEach((emoji, index) => {
							preview += `  ${index + 1}. ${emoji.name || "Unnamed"} - ${emoji.url || "No URL"}\\n`;
						});
						if (group.emojis.length > 5) preview += `  ... 还有 ${group.emojis.length - 5} 个表情\\n`;
					}
				} else if (data.emojiGroups && Array.isArray(data.emojiGroups)) {
					preview += `分组类型：多个表情分组\\n`;
					preview += `分组数量：${data.emojiGroups.length}\\n\\n`;
					data.emojiGroups.slice(0, 3).forEach((group, index) => {
						preview += `${index + 1}. ${group.name || group.id || "Unnamed"} (${group.emojis?.length || 0} 表情)\\n`;
					});
					if (data.emojiGroups.length > 3) preview += `... 还有 ${data.emojiGroups.length - 3} 个分组\\n`;
				} else if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].url) {
					preview += `分组类型：表情数组 (带扩展字段)\\n`;
					preview += `表情数量：${data.length}\\n\\n`;
					const groupIds = [...new Set(data.map((emoji) => emoji.groupId).filter(Boolean))];
					if (groupIds.length > 0) preview += `包含的原始分组 ID: ${groupIds.join(", ")}\\n\\n`;
					if (data.length > 0) {
						preview += `表情列表 (前 5 个):\\n`;
						data.slice(0, 5).forEach((emoji, index) => {
							preview += `  ${index + 1}. ${emoji.name || emoji.id} - ${emoji.url}\\n`;
							if (emoji.groupId) preview += `     原分组：${emoji.groupId}\\n`;
						});
						if (data.length > 5) preview += `  ... 还有 ${data.length - 5} 个表情\\n`;
					}
				} else preview += "无法识别的格式，可能不是有效的分组导出文件";
				alert(preview);
			} catch (error) {
				alert("预览失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
		content.querySelector("#importGroup")?.addEventListener("click", () => {
			try {
				const importText = content.querySelector("#importText").value.trim();
				if (!importText) {
					alert("请输入或选择要导入的内容");
					return;
				}
				let targetGroupId = content.querySelector("#importTargetGroupSelect").value;
				if (targetGroupId === "__new__") {
					const newGroupName = prompt("请输入新分组的名称：");
					if (!newGroupName || !newGroupName.trim()) return;
					const newGroupId = "imported_" + Date.now();
					const newGroup = {
						id: newGroupId,
						name: newGroupName.trim(),
						icon: "📁",
						emojis: [],
						order: userscriptState.emojiGroups.length
					};
					userscriptState.emojiGroups.push(newGroup);
					targetGroupId = newGroupId;
				}
				if (!targetGroupId) {
					alert("请选择目标分组");
					return;
				}
				const targetGroup = userscriptState.emojiGroups.find((g) => g.id === targetGroupId);
				if (!targetGroup) {
					alert("找不到目标分组");
					return;
				}
				const data = parseImportData(importText);
				const importModeInputs = content.querySelectorAll("input[name=\"importMode\"]");
				const importMode = Array.from(importModeInputs).find((input) => input.checked)?.value || "replace";
				let importedEmojis = [];
				if (data.type === "emoji_group" && data.group && data.group.emojis) importedEmojis = data.group.emojis;
				else if (data.emojiGroups && Array.isArray(data.emojiGroups)) importedEmojis = data.emojiGroups.reduce((acc, group) => {
					return acc.concat(group.emojis || []);
				}, []);
				else if (Array.isArray(data.emojis)) importedEmojis = data.emojis;
				else if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].url) importedEmojis = data.map((emoji) => ({
					name: emoji.name || emoji.id || "unnamed",
					url: emoji.url,
					width: emoji.width,
					height: emoji.height,
					originalId: emoji.id,
					packet: emoji.packet,
					originalGroupId: emoji.groupId
				}));
				else {
					alert("无法识别的导入格式");
					return;
				}
				if (importedEmojis.length === 0) {
					alert("导入文件中没有找到表情数据");
					return;
				}
				let finalEmojis = [];
				switch (importMode) {
					case "replace":
						finalEmojis = importedEmojis;
						break;
					case "merge":
						const existingUrls = new Set((targetGroup.emojis || []).map((e) => e.url));
						const existingIds = new Set((targetGroup.emojis || []).map((e) => e.originalId || e.id).filter(Boolean));
						const newEmojis = importedEmojis.filter((e) => {
							if (existingUrls.has(e.url)) return false;
							if (e.originalId && existingIds.has(e.originalId)) return false;
							return true;
						});
						finalEmojis = [...targetGroup.emojis || [], ...newEmojis];
						break;
					case "append":
						finalEmojis = [...targetGroup.emojis || [], ...importedEmojis];
						break;
					default: finalEmojis = importedEmojis;
				}
				targetGroup.emojis = finalEmojis;
				saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
				const message = `成功导入 ${importedEmojis.length} 个表情到分组 "${targetGroup.name || targetGroup.id}"`;
				showTemporaryMessage(message);
				alert(message + "\\n\\n修改已保存，分组现在共有 " + finalEmojis.length + " 个表情");
				modal.remove();
			} catch (error) {
				console.error("Import group failed:", error);
				alert("导入分组失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
	}
	var init_importExport = __esmMin((() => {
		init_userscript_storage();
		init_themeSupport();
		init_tempMessage();
		init_editorUtils();
	}));
	function customAlert(message) {
		return new Promise((resolve) => {
			const backdrop = createEl("div", { style: `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
      ` });
			const dialog = createEl("div", { style: `
        background: #ffffff;
        color: #000000;
        padding: 20px;
        border-radius: 8px;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        min-width: 300px;
      ` });
			const messageEl = createEl("div", {
				text: message,
				style: "margin-bottom: 20px; word-wrap: break-word;"
			});
			const okButton = createEl("button", {
				text: "确定",
				className: "btn btn-primary",
				style: "padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white;"
			});
			okButton.addEventListener("click", () => {
				backdrop.remove();
				resolve();
			});
			dialog.appendChild(messageEl);
			dialog.appendChild(okButton);
			backdrop.appendChild(dialog);
			document.body.appendChild(backdrop);
			const handleEsc = (e) => {
				if (e.key === "Escape") {
					backdrop.remove();
					document.removeEventListener("keydown", handleEsc);
					resolve();
				}
			};
			document.addEventListener("keydown", handleEsc);
			backdrop.addEventListener("click", (e) => {
				if (e.target === backdrop) {
					backdrop.remove();
					document.removeEventListener("keydown", handleEsc);
					resolve();
				}
			});
		});
	}
	function customConfirm$1(message) {
		return new Promise((resolve) => {
			const backdrop = createEl("div", { style: `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
      ` });
			const dialog = createEl("div", { style: `
        background: #ffffff;
        color: #000000;
        padding: 20px;
        border-radius: 8px;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        min-width: 300px;
      ` });
			const messageEl = createEl("div", {
				text: message,
				style: "margin-bottom: 20px; word-wrap: break-word;"
			});
			const buttonContainer = createEl("div", { style: "display: flex; gap: 10px; justify-content: center;" });
			const cancelButton = createEl("button", {
				text: "取消",
				className: "btn",
				style: "padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #f8f9fa; color: #333;"
			});
			const okButton = createEl("button", {
				text: "确定",
				className: "btn btn-primary",
				style: "padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white;"
			});
			cancelButton.addEventListener("click", () => {
				backdrop.remove();
				resolve(false);
			});
			okButton.addEventListener("click", () => {
				backdrop.remove();
				resolve(true);
			});
			buttonContainer.appendChild(cancelButton);
			buttonContainer.appendChild(okButton);
			dialog.appendChild(messageEl);
			dialog.appendChild(buttonContainer);
			backdrop.appendChild(dialog);
			document.body.appendChild(backdrop);
			const handleEsc = (e) => {
				if (e.key === "Escape") {
					backdrop.remove();
					document.removeEventListener("keydown", handleEsc);
					resolve(false);
				}
			};
			document.addEventListener("keydown", handleEsc);
		});
	}
	function customPrompt(message, defaultValue = "") {
		return new Promise((resolve) => {
			const backdrop = createEl("div", { style: `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
      ` });
			const dialog = createEl("div", { style: `
        background: #ffffff;
        color: #000000;
        padding: 20px;
        border-radius: 8px;
        max-width: 90vw;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        min-width: 300px;
      ` });
			const messageEl = createEl("div", {
				text: message,
				style: "margin-bottom: 15px; word-wrap: break-word;"
			});
			const input = createEl("input", {
				attrs: {
					type: "text",
					value: defaultValue
				},
				className: "form-control",
				style: `
        width: 100%;
        padding: 8px 12px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      `
			});
			const buttonContainer = createEl("div", { style: "display: flex; gap: 10px; justify-content: center;" });
			const cancelButton = createEl("button", {
				text: "取消",
				className: "btn",
				style: "padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #f8f9fa; color: #333;"
			});
			const okButton = createEl("button", {
				text: "确定",
				className: "btn btn-primary",
				style: "padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white;"
			});
			cancelButton.addEventListener("click", () => {
				backdrop.remove();
				resolve(null);
			});
			okButton.addEventListener("click", () => {
				backdrop.remove();
				resolve(input.value);
			});
			setTimeout(() => {
				input.focus();
				input.select();
			}, 10);
			input.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					backdrop.remove();
					resolve(input.value);
				}
			});
			buttonContainer.appendChild(cancelButton);
			buttonContainer.appendChild(okButton);
			dialog.appendChild(messageEl);
			dialog.appendChild(input);
			dialog.appendChild(buttonContainer);
			backdrop.appendChild(dialog);
			document.body.appendChild(backdrop);
			const handleEsc = (e) => {
				if (e.key === "Escape") {
					backdrop.remove();
					document.removeEventListener("keydown", handleEsc);
					resolve(null);
				}
			};
			document.addEventListener("keydown", handleEsc);
		});
	}
	var init_dialog = __esmMin((() => {
		init_createEl();
	}));
	var init_utils = __esmMin((() => {
		init_dialog();
	}));
	function showGroupEditorModal() {
		injectGlobalThemeStyles();
		const modal = createModalElement({
			title: "表情分组编辑器",
			content: `
    <div style="margin-bottom: 20px; padding: 16px; background: var(--emoji-modal-button-bg);">
      <div>编辑说明</div>
      <div>
        • 点击分组名称或图标进行编辑<br>
        • 图标支持 emoji 字符或单个字符<br>
        • 修改会立即保存到本地存储<br>
        • 使用上移/下移按钮调整分组的显示顺序
      </div>
    </div>
    
    <div id="groupsList" style="display: flex; flex-wrap: wrap; gap: 16px; max-height: 70vh; overflow-y: auto; justify-content: flex-start;">
      ${userscriptState.emojiGroups.map((group, index) => `
        <div class="group-item" data-group-id="${group.id}" data-index="${index}" style="
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: var(--emoji-modal-button-bg);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 8px;
          width: calc(20% - 13px);
          min-width: 200px;
          box-sizing: border-box;
        ">
          <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
            <button class="delete-group" data-index="${index}" data-group-id="${group.id}" data-group-name="${group.name}" style="
              background: #dc3545;
              border: 1px solid #c82333;
              border-radius: 3px;
              padding: 4px 8px;
              cursor: pointer;
              font-size: 12px;
              color: white;
            " title="删除分组">🗑️</button>
          </div>` + (group.icon?.startsWith("https://") ? `<img class="group-icon-editor" src="${group.icon}" alt="图标" style="
            width: 100%;
            height: 100px;
            object-fit: contain;
            cursor: pointer;
          " data-group-id="${group.id}" title="点击编辑图标">` : `
          <div class="group-icon-editor" style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--secondary);
            font-size: 48px;
            user-select: none; -webkit-user-select: none;
            cursor: pointer;
            height: 100px;
            border-radius: 6px;
          " data-group-id="${group.id}" title="点击编辑图标">
            ${group.icon || "📁"}
          </div>`) + `<div style="display: flex; flex-direction: column; gap: 8px;">
            <input class="group-name-editor" 
                   type="text" 
                   value="${group.name || "Unnamed Group"}" 
                   data-group-id="${group.id}"
                   style="
                     background: var(--secondary);
                     color: var(--emoji-modal-text);
                     border: 1px solid var(--emoji-modal-border);
                     border-radius: 4px;
                     padding: 8px 12px;
                     font-size: 14px;
                     font-weight: 500;
                     width: 100%;
                     box-sizing: border-box;
                   " 
                   placeholder="分组名称" title="编辑分组名称">
            <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7;">
              ID: ${group.id}<br>
              表情数：${group.emojis ? group.emojis.length : 0}
            </div>
          </div>
          
          <div style="display: flex; gap: 4px; justify-content: center;">
            <button class="move-up" data-index="${index}" style="
              background: var(--emoji-modal-button-bg);
              border: 1px solid var(--emoji-modal-border);
              border-radius: 3px;
              padding: 6px 12px;
              cursor: pointer;
              font-size: 12px;
              color: var(--emoji-modal-text);
              flex: 1;
            " ${index === 0 ? "disabled" : ""}>↑ 上移</button>
            <button class="move-down" data-index="${index}" style="
              background: var(--emoji-modal-button-bg);
              border: 1px solid var(--emoji-modal-border);
              border-radius: 3px;
              padding: 6px 12px;
              cursor: pointer;
              font-size: 12px;
              color: var(--emoji-modal-text);
              flex: 1;
            " ${index === userscriptState.emojiGroups.length - 1 ? "disabled" : ""}>↓ 下移</button>
          </div>
        </div>
      `).join("")}
    </div>
    
    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--emoji-modal-border); display: flex; gap: 8px; justify-content: space-between;">
      <button id="openImportExport" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">分组导入/导出</button>
      <div style="display: flex; gap: 8px;">
        <button id="addNewGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">新建分组</button>
        <button id="saveAllChanges" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">保存所有更改</button>
      </div>
    </div>
  `,
			onClose: () => modal.remove()
		});
		const content = modal.querySelector("div:last-child");
		const modalContent = modal.querySelector("div > div");
		if (modalContent) {
			modalContent.style.width = "80vw";
			modalContent.style.maxWidth = "80vw";
		}
		document.body.appendChild(modal);
		ensureStyleInjected("group-editor-styles", `
    .group-item:hover {
      border-color: var(--emoji-modal-primary-bg) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .group-icon-editor:hover {
      background: var(--emoji-modal-primary-bg) !important;
      color: white;
    }
    .move-up:hover, .move-down:hover {
      background: var(--emoji-modal-primary-bg) !important;
      color: white;
    }
    .move-up:disabled, .move-down:disabled {
      opacity: 0.3;
      cursor: not-allowed !important;
    }
    .delete-group:hover {
      background: #c82333 !important;
      border-color: #bd2130 !important;
    }
    
    /* Responsive layout adjustments */
    @media (max-width: 1600px) {
      .group-item {
        width: calc(25% - 12px) !important;
      }
    }
    @media (max-width: 1200px) {
      .group-item {
        width: calc(33.333% - 11px) !important;
      }
    }
    @media (max-width: 900px) {
      .group-item {
        width: calc(50% - 8px) !important;
      }
    }
    @media (max-width: 600px) {
      .group-item {
        width: 100% !important;
        min-width: unset !important;
      }
    }
  `);
		content.querySelectorAll(".group-name-editor").forEach((input) => {
			input.addEventListener("change", (e) => {
				const target = e.target;
				const groupId = target.getAttribute("data-group-id");
				const newName = target.value.trim();
				if (groupId && newName) {
					const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
					if (group) {
						group.name = newName;
						showTemporaryMessage(`分组 "${newName}" 名称已更新`);
					}
				}
			});
		});
		content.querySelectorAll(".group-icon-editor").forEach((iconEl) => {
			iconEl.addEventListener("click", (e) => {
				const target = e.target;
				const groupId = target.getAttribute("data-group-id");
				if (groupId) customPrompt("请输入新的图标字符 (emoji 或单个字符):", target.textContent || "📁").then((newIcon) => {
					if (newIcon && newIcon.trim()) {
						const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
						if (group) {
							group.icon = newIcon.trim();
							target.textContent = newIcon.trim();
							showTemporaryMessage(`分组图标已更新为: ${newIcon.trim()}`);
						}
					}
				});
			});
		});
		content.querySelectorAll(".move-up").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const index = parseInt(e.target.getAttribute("data-index") || "0");
				if (index > 0) {
					const temp = userscriptState.emojiGroups[index];
					userscriptState.emojiGroups[index] = userscriptState.emojiGroups[index - 1];
					userscriptState.emojiGroups[index - 1] = temp;
					modal.remove();
					showTemporaryMessage("分组顺序已调整");
					setTimeout(() => showGroupEditorModal(), 300);
				}
			});
		});
		content.querySelectorAll(".move-down").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const index = parseInt(e.target.getAttribute("data-index") || "0");
				if (index < userscriptState.emojiGroups.length - 1) {
					const temp = userscriptState.emojiGroups[index];
					userscriptState.emojiGroups[index] = userscriptState.emojiGroups[index + 1];
					userscriptState.emojiGroups[index + 1] = temp;
					modal.remove();
					showTemporaryMessage("分组顺序已调整");
					setTimeout(() => showGroupEditorModal(), 300);
				}
			});
		});
		content.querySelectorAll(".delete-group").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const target = e.target;
				const index = parseInt(target.getAttribute("data-index") || "0");
				const groupName = target.getAttribute("data-group-name");
				customConfirm$1(`确认删除分组 "${groupName}"？\n\n该分组包含 ${userscriptState.emojiGroups[index].emojis?.length || 0} 个表情。\n删除后数据将无法恢复。`).then((confirmed) => {
					if (confirmed) {
						userscriptState.emojiGroups.splice(index, 1);
						modal.remove();
						showTemporaryMessage(`分组 "${groupName}" 已删除`);
						setTimeout(() => showGroupEditorModal(), 300);
					}
				});
			});
		});
		content.querySelector("#addNewGroup")?.addEventListener("click", () => {
			customPrompt("请输入新分组的名称:").then((groupName) => {
				if (groupName && groupName.trim()) {
					const newGroup = {
						id: "custom_" + Date.now(),
						name: groupName.trim(),
						icon: "📁",
						order: userscriptState.emojiGroups.length,
						emojis: []
					};
					userscriptState.emojiGroups.push(newGroup);
					modal.remove();
					showTemporaryMessage(`新分组 "${groupName.trim()}" 已创建`);
					setTimeout(() => showGroupEditorModal(), 300);
				}
			});
		});
		content.querySelector("#saveAllChanges")?.addEventListener("click", () => {
			saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
			showTemporaryMessage("所有更改已保存到本地存储");
		});
		content.querySelector("#openImportExport")?.addEventListener("click", () => {
			modal.remove();
			showImportExportModal();
		});
	}
	var init_groupEditor = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_themeSupport();
		init_tempMessage();
		init_injectStyles();
		init_editorUtils();
		init_importExport();
		init_utils();
	}));
	var manager_exports = /* @__PURE__ */ __export({ openManagementInterface: () => openManagementInterface });
	function createEditorPopup(groupId, index, renderGroups, renderSelectedGroup) {
		const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
		if (!group) return;
		const emo = group.emojis[index];
		if (!emo) return;
		const backdrop = createEl("div", { style: `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
  ` });
		const editorPanel = createEl("div", { className: "emoji-manager-editor-panel" });
		const editorTitle = createEl("h3", {
			text: "编辑表情",
			className: "emoji-manager-editor-title",
			style: "margin: 0 0 16px 0; text-align: center;"
		});
		const editorPreview = createEl("img", { className: "emoji-manager-editor-preview" });
		editorPreview.src = emo.url;
		const editorWidthInput = createEl("input", {
			className: "form-control",
			placeholder: "宽度 (px) 可选",
			value: emo.width ? String(emo.width) : ""
		});
		const editorHeightInput = createEl("input", {
			className: "form-control",
			placeholder: "高度 (px) 可选",
			value: emo.height ? String(emo.height) : ""
		});
		const editorNameInput = createEl("input", {
			className: "form-control",
			placeholder: "名称 (alias)",
			value: emo.name || ""
		});
		const editorUrlInput = createEl("input", {
			className: "form-control",
			placeholder: "表情图片 URL",
			value: emo.url || ""
		});
		const buttonContainer = createEl("div", { style: "display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;" });
		const editorSaveBtn = createEl("button", {
			text: "保存修改",
			className: "btn btn-primary"
		});
		const editorCancelBtn = createEl("button", {
			text: "取消",
			className: "btn"
		});
		buttonContainer.appendChild(editorCancelBtn);
		buttonContainer.appendChild(editorSaveBtn);
		editorPanel.appendChild(editorTitle);
		editorPanel.appendChild(editorPreview);
		editorPanel.appendChild(editorWidthInput);
		editorPanel.appendChild(editorHeightInput);
		editorPanel.appendChild(editorNameInput);
		editorPanel.appendChild(editorUrlInput);
		editorPanel.appendChild(buttonContainer);
		backdrop.appendChild(editorPanel);
		document.body.appendChild(backdrop);
		editorUrlInput.addEventListener("input", () => {
			editorPreview.src = editorUrlInput.value;
		});
		editorSaveBtn.addEventListener("click", () => {
			const newName = (editorNameInput.value || "").trim();
			const newUrl = (editorUrlInput.value || "").trim();
			const newWidth = parseInt((editorWidthInput.value || "").trim(), 10);
			const newHeight = parseInt((editorHeightInput.value || "").trim(), 10);
			if (!newName || !newUrl) {
				customAlert("名称和 URL 均不能为空");
				return;
			}
			emo.name = newName;
			emo.url = newUrl;
			if (!isNaN(newWidth) && newWidth > 0) emo.width = newWidth;
			else delete emo.width;
			if (!isNaN(newHeight) && newHeight > 0) emo.height = newHeight;
			else delete emo.height;
			renderGroups();
			renderSelectedGroup();
			backdrop.remove();
		});
		editorCancelBtn.addEventListener("click", () => {
			backdrop.remove();
		});
		backdrop.addEventListener("click", (e) => {
			if (e.target === backdrop) backdrop.remove();
		});
	}
	function openManagementInterface() {
		injectManagerStyles();
		const modal = createEl("div", {
			className: "emoji-manager-wrapper",
			attrs: {
				role: "dialog",
				"aria-modal": "true"
			}
		});
		const panel = createEl("div", { className: "emoji-manager-panel" });
		const left = createEl("div", { className: "emoji-manager-left" });
		const leftHeader = createEl("div", { className: "emoji-manager-left-header" });
		const title = createEl("h3", { text: "表情管理器" });
		const closeBtn = createEl("button", {
			text: "×",
			className: "btn",
			style: "font-size:20px; background:none; border:none; cursor:pointer;"
		});
		leftHeader.appendChild(title);
		leftHeader.appendChild(closeBtn);
		left.appendChild(leftHeader);
		const addGroupRow = createEl("div", { className: "emoji-manager-addgroup-row" });
		const addGroupInput = createEl("input", {
			placeholder: "新分组 id",
			className: "form-control"
		});
		const addGroupBtn = createEl("button", {
			text: "添加",
			className: "btn"
		});
		addGroupRow.appendChild(addGroupInput);
		addGroupRow.appendChild(addGroupBtn);
		left.appendChild(addGroupRow);
		const groupSelectorContainer = createEl("div", { className: "emoji-manager-group-selector" });
		const groupSelector = createEl("select", {
			className: "form-control",
			attrs: { "aria-label": "选择表情分组" }
		});
		groupSelectorContainer.appendChild(groupSelector);
		left.appendChild(groupSelectorContainer);
		const groupsList = createEl("div", { className: "emoji-manager-groups-list" });
		left.appendChild(groupsList);
		const right = createEl("div", { className: "emoji-manager-right" });
		const rightHeader = createEl("div", { className: "emoji-manager-right-header" });
		const groupTitle = createEl("h4");
		groupTitle.textContent = "";
		const deleteGroupBtn = createEl("button", {
			text: "删除分组",
			className: "btn",
			style: "background:#ef4444; color:#fff;"
		});
		rightHeader.appendChild(groupTitle);
		rightHeader.appendChild(deleteGroupBtn);
		right.appendChild(rightHeader);
		const managerRightMain = createEl("div", { className: "emoji-manager-right-main" });
		const emojisContainer = createEl("div", { className: "emoji-manager-emojis" });
		managerRightMain.appendChild(emojisContainer);
		const addEmojiForm = createEl("div", { className: "emoji-manager-add-emoji-form" });
		const emojiUrlInput = createEl("input", {
			placeholder: "表情图片 URL",
			className: "form-control"
		});
		const emojiNameInput = createEl("input", {
			placeholder: "名称 (alias)",
			className: "form-control"
		});
		const emojiWidthInput = createEl("input", {
			placeholder: "宽度 (px) 可选",
			className: "form-control"
		});
		const emojiHeightInput = createEl("input", {
			placeholder: "高度 (px) 可选",
			className: "form-control"
		});
		const addEmojiBtn = createEl("button", {
			text: "添加表情",
			className: "btn btn-primary",
			attrs: {
				"data-action": "add-emoji",
				"aria-label": "添加表情到当前分组"
			}
		});
		addEmojiForm.appendChild(emojiUrlInput);
		addEmojiForm.appendChild(emojiNameInput);
		addEmojiForm.appendChild(emojiWidthInput);
		addEmojiForm.appendChild(emojiHeightInput);
		addEmojiForm.appendChild(addEmojiBtn);
		managerRightMain.appendChild(addEmojiForm);
		right.appendChild(managerRightMain);
		const footer = createEl("div", { className: "emoji-manager-footer" });
		const exportBtn = createEl("button", {
			text: "分组导出",
			className: "btn"
		});
		const importBtn = createEl("button", {
			text: "分组导入",
			className: "btn"
		});
		const groupEditBtn = createEl("button", {
			text: "分组编辑",
			className: "btn",
			style: "background:#3b82f6; color:#fff;"
		});
		const restoreBtn = createEl("button", {
			text: "恢复默认配置",
			className: "btn",
			style: "background:#f97316; color:#fff;"
		});
		const exitBtn = createEl("button", {
			text: "退出",
			className: "btn"
		});
		exitBtn.addEventListener("click", () => modal.remove());
		const saveBtn = createEl("button", {
			text: "保存",
			className: "btn btn-primary"
		});
		const syncBtn = createEl("button", {
			text: "同步管理器",
			className: "btn"
		});
		groupEditBtn.addEventListener("click", () => {
			modal.remove();
			showGroupEditorModal();
		});
		restoreBtn.addEventListener("click", async () => {
			if (!await customConfirm("确认恢复到默认配置？此操作将清除当前所有分组和表情，且不可撤销！")) return;
			try {
				const defaultGroups = await loadAndFilterDefaultEmojiGroups(void 0, window.location.hostname);
				if (!defaultGroups || defaultGroups.length === 0) {
					await customAlert("无法加载默认配置，请检查网络连接");
					return;
				}
				userscriptState.emojiGroups = defaultGroups;
				saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
				renderGroups();
				renderSelectedGroup();
				await customAlert("已成功恢复到默认配置");
			} catch (error) {
				console.error("Failed to restore default configuration:", error);
				await customAlert("恢复默认配置失败：" + error);
			}
		});
		footer.appendChild(groupEditBtn);
		footer.appendChild(restoreBtn);
		footer.appendChild(syncBtn);
		footer.appendChild(exportBtn);
		footer.appendChild(importBtn);
		footer.appendChild(exitBtn);
		footer.appendChild(saveBtn);
		panel.appendChild(left);
		panel.appendChild(right);
		panel.appendChild(footer);
		modal.appendChild(panel);
		document.body.appendChild(modal);
		let selectedGroupId = null;
		function renderGroups() {
			groupsList.innerHTML = "";
			groupSelector.innerHTML = "";
			if (!selectedGroupId && userscriptState.emojiGroups.length > 0) selectedGroupId = userscriptState.emojiGroups[0].id;
			userscriptState.emojiGroups.forEach((g) => {
				const row = createEl("div", {
					style: "display:flex; justify-content:space-between; align-items:center; padding:6px; border-radius:4px; cursor:pointer;",
					text: `${g.name || g.id} (${(g.emojis || []).length})`,
					attrs: {
						tabindex: "0",
						"data-group-id": g.id
					}
				});
				const selectGroup = () => {
					selectedGroupId = g.id;
					renderGroups();
					renderSelectedGroup();
				};
				row.addEventListener("click", selectGroup);
				row.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						selectGroup();
					}
				});
				if (selectedGroupId === g.id) row.style.background = "#f0f8ff";
				groupsList.appendChild(row);
				const option = createEl("option", {
					text: `${g.name || g.id} (${(g.emojis || []).length})`,
					attrs: { value: g.id }
				});
				if (selectedGroupId === g.id) option.selected = true;
				groupSelector.appendChild(option);
			});
		}
		function showEditorFor(groupId, index) {
			createEditorPopup(groupId, index, renderGroups, renderSelectedGroup);
		}
		function renderSelectedGroup() {
			const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId) || null;
			groupTitle.textContent = group ? group.name || group.id : "";
			emojisContainer.innerHTML = "";
			if (!group) return;
			(Array.isArray(group.emojis) ? group.emojis : []).forEach((emo, idx) => {
				const card = createEl("div", { className: "emoji-manager-card" });
				const img = createEl("img", {
					src: emo.url,
					alt: emo.name,
					className: "emoji-manager-card-img"
				});
				const name = createEl("div", {
					text: emo.name,
					className: "emoji-manager-card-name"
				});
				const actions = createEl("div", { className: "emoji-manager-card-actions" });
				const edit = createEl("button", {
					text: "编辑",
					className: "btn btn-sm",
					attrs: {
						"data-action": "edit-emoji",
						"aria-label": `编辑表情 ${emo.name}`
					}
				});
				edit.addEventListener("click", () => {
					showEditorFor(group.id, idx);
				});
				const del = createEl("button", {
					text: "删除",
					className: "btn btn-sm",
					attrs: {
						"data-action": "delete-emoji",
						"aria-label": `删除表情 ${emo.name}`
					}
				});
				del.addEventListener("click", () => {
					group.emojis.splice(idx, 1);
					renderGroups();
					renderSelectedGroup();
				});
				emojiManagerConfig.injectionPoints.addButton(actions, edit);
				emojiManagerConfig.injectionPoints.addButton(actions, del);
				card.appendChild(img);
				card.appendChild(name);
				card.appendChild(actions);
				emojiManagerConfig.injectionPoints.insertCard(emojisContainer, card);
				bindHoverPreview(img, emo);
			});
		}
		function bindHoverPreview(targetImg, emo) {
			const preview = ensureHoverPreview();
			const previewImg = preview.querySelector("img");
			const previewLabel = preview.querySelector(".emoji-picker-hover-label");
			function onEnter(e) {
				if (previewImg) previewImg.src = emo.url;
				if (previewImg) {
					if (emo.width) previewImg.style.width = typeof emo.width === "number" ? emo.width + "px" : emo.width;
					else previewImg.style.width = "";
					if (emo.height) previewImg.style.height = typeof emo.height === "number" ? emo.height + "px" : emo.height;
					else previewImg.style.height = "";
				}
				if (previewLabel) previewLabel.textContent = emo.name || "";
				preview.style.display = "block";
				movePreview(e);
			}
			function movePreview(e) {
				const pad = 12;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const rect = preview.getBoundingClientRect();
				let left$1 = e.clientX + pad;
				let top = e.clientY + pad;
				if (left$1 + rect.width > vw) left$1 = e.clientX - rect.width - pad;
				if (top + rect.height > vh) top = e.clientY - rect.height - pad;
				preview.style.left = left$1 + "px";
				preview.style.top = top + "px";
			}
			function onLeave() {
				preview.style.display = "none";
			}
			targetImg.addEventListener("mouseenter", onEnter);
			targetImg.addEventListener("mousemove", movePreview);
			targetImg.addEventListener("mouseleave", onLeave);
		}
		addGroupBtn.addEventListener("click", async () => {
			const id = (addGroupInput.value || "").trim();
			if (!id) {
				await customAlert("请输入分组 id");
				return;
			}
			if (userscriptState.emojiGroups.find((g) => g.id === id)) {
				await customAlert("分组已存在");
				return;
			}
			userscriptState.emojiGroups.push({
				id,
				name: id,
				emojis: []
			});
			addGroupInput.value = "";
			const newIdx = userscriptState.emojiGroups.findIndex((g) => g.id === id);
			if (newIdx >= 0) selectedGroupId = userscriptState.emojiGroups[newIdx].id;
			renderGroups();
			renderSelectedGroup();
		});
		groupSelector.addEventListener("change", () => {
			selectedGroupId = groupSelector.value;
			renderGroups();
			renderSelectedGroup();
		});
		addEmojiBtn.addEventListener("click", async () => {
			if (!selectedGroupId) {
				await customAlert("请先选择分组");
				return;
			}
			const url = emojiManagerConfig.parsers.getUrl({ urlInput: emojiUrlInput });
			const name = emojiManagerConfig.parsers.getName({
				nameInput: emojiNameInput,
				urlInput: emojiUrlInput
			});
			const width = emojiManagerConfig.parsers.getWidth({ widthInput: emojiWidthInput });
			const height = emojiManagerConfig.parsers.getHeight({ heightInput: emojiHeightInput });
			if (!url || !name) {
				await customAlert("请输入 url 和 名称");
				return;
			}
			const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId);
			if (!group) return;
			group.emojis = group.emojis || [];
			const newEmo = {
				url,
				name
			};
			if (width !== void 0) newEmo.width = width;
			if (height !== void 0) newEmo.height = height;
			group.emojis.push(newEmo);
			emojiUrlInput.value = "";
			emojiNameInput.value = "";
			emojiWidthInput.value = "";
			emojiHeightInput.value = "";
			renderGroups();
			renderSelectedGroup();
		});
		deleteGroupBtn.addEventListener("click", async () => {
			if (!selectedGroupId) {
				await customAlert("请先选择分组");
				return;
			}
			const idx = userscriptState.emojiGroups.findIndex((g) => g.id === selectedGroupId);
			if (idx >= 0) {
				if (!await customConfirm("确认删除该分组？该操作不可撤销")) return;
				userscriptState.emojiGroups.splice(idx, 1);
				if (userscriptState.emojiGroups.length > 0) selectedGroupId = userscriptState.emojiGroups[Math.min(idx, userscriptState.emojiGroups.length - 1)].id;
				else selectedGroupId = null;
				renderGroups();
				renderSelectedGroup();
			}
		});
		exportBtn.addEventListener("click", () => {
			showImportExportModal(selectedGroupId || void 0);
		});
		importBtn.addEventListener("click", () => {
			showImportExportModal(selectedGroupId || void 0);
		});
		saveBtn.addEventListener("click", async () => {
			try {
				saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
				await customAlert("已保存");
			} catch (e) {
				await customAlert("保存失败：" + e);
			}
		});
		syncBtn.addEventListener("click", async () => {
			try {
				if (syncFromManager()) {
					const data = loadDataFromLocalStorage();
					userscriptState.emojiGroups = data.emojiGroups || [];
					userscriptState.settings = data.settings || userscriptState.settings;
					await customAlert("同步成功，已导入管理器数据");
					renderGroups();
					renderSelectedGroup();
				} else await customAlert("同步未成功，未检测到管理器数据");
			} catch (e) {
				await customAlert("同步异常：" + e);
			}
		});
		closeBtn.addEventListener("click", () => modal.remove());
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		renderGroups();
		if (userscriptState.emojiGroups.length > 0) {
			selectedGroupId = userscriptState.emojiGroups[0].id;
			const first = groupsList.firstChild;
			if (first) first.style.background = "#f0f8ff";
			renderSelectedGroup();
		}
	}
	var emojiManagerConfig;
	var init_manager = __esmMin((() => {
		init_styles();
		init_createEl();
		init_state();
		init_hoverPreview();
		init_userscript_storage();
		init_importExport();
		init_default_emoji_loader();
		init_groupEditor();
		init_utils();
		emojiManagerConfig = {
			selectors: {
				container: ".emoji-manager-emojis",
				card: ".emoji-manager-card",
				actionRow: ".emoji-manager-card-actions",
				editButton: ".btn.btn-sm:first-child",
				deleteButton: ".btn.btn-sm:last-child"
			},
			parsers: {
				getUrl: ({ urlInput }) => (urlInput.value || "").trim(),
				getName: ({ nameInput, urlInput }) => {
					const name = (nameInput.value || "").trim();
					if (!name && urlInput.value) return (urlInput.value.trim().split("/").pop() || "").replace(/\.[^.]+$/, "") || "表情";
					return name || "表情";
				},
				getWidth: ({ widthInput }) => {
					const val = (widthInput.value || "").trim();
					const parsed = parseInt(val, 10);
					return !isNaN(parsed) && parsed > 0 ? parsed : void 0;
				},
				getHeight: ({ heightInput }) => {
					const val = (heightInput.value || "").trim();
					const parsed = parseInt(val, 10);
					return !isNaN(parsed) && parsed > 0 ? parsed : void 0;
				}
			},
			injectionPoints: {
				addButton: (parent, button) => {
					parent.appendChild(button);
				},
				insertCard: (container, card) => {
					container.appendChild(card);
				}
			}
		};
	}));
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
	var init_popularEmojis = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_tempMessage();
		init_injectStyles();
		init_editorUtils();
	}));
	var settings_exports = /* @__PURE__ */ __export({ showSettingsModal: () => showSettingsModal });
	function showSettingsModal() {
		injectGlobalThemeStyles();
		const modal = createEl("div", { style: `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  ` });
		modal.appendChild(createEl("div", {
			style: `
    backdrop-filter: blur(10px);
    padding: 24px;
    overflow-y: auto;
    position: relative;
  `,
			innerHTML: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; color: var(--emoji-modal-text);">设置</h2>
      <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label); font-weight: 500;">图片缩放比例：<span id="scaleValue">${userscriptState.settings.imageScale}%</span></label>
      <input type="range" id="scaleSlider" min="5" max="150" step="5" value="${userscriptState.settings.imageScale}" 
             style="width: 100%; margin-bottom: 8px;">
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label); font-weight: 500;">输出格式:</label>
      <div style="display: flex; gap: 16px;">
        <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
          <input type="radio" name="outputFormat" value="markdown" ${userscriptState.settings.outputFormat === "markdown" ? "checked" : ""} style="margin-right: 4px;">
          Markdown
        </label>
        <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
          <input type="radio" name="outputFormat" value="html" ${userscriptState.settings.outputFormat === "html" ? "checked" : ""} style="margin-right: 4px;">
          HTML
        </label>
      </div>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="showSearchBar" ${userscriptState.settings.showSearchBar ? "checked" : ""} style="margin-right: 8px;">
        显示搜索栏
      </label>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="enableFloatingPreview" ${userscriptState.settings.enableFloatingPreview ? "checked" : ""} style="margin-right: 8px;">
        启用悬浮预览功能
      </label>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="enableCalloutSuggestions" ${userscriptState.settings.enableCalloutSuggestions ? "checked" : ""} style="margin-right: 8px;">
        在 textarea 中启用 Callout Suggestion（输入 [ 即可触发）
      </label>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="enableBatchParseImages" ${userscriptState.settings.enableBatchParseImages ? "checked" : ""} style="margin-right: 8px;">
        注入“一键解析并添加所有图片”按钮
      </label>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="forceMobileMode" ${userscriptState.settings.forceMobileMode ? "checked" : ""} style="margin-right: 8px;">
        强制移动模式 (在不兼容检测时也注入移动版布局)
      </label>
    </div>
    
    <div style="margin-bottom: 16px; padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 6px; border: 1px solid var(--emoji-modal-border);">
      <div style="font-weight: 500; color: var(--emoji-modal-label); margin-bottom: 8px;">高级功能</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="openGroupEditor" style="
          padding: 6px 12px; 
          background: var(--emoji-modal-primary-bg); 
          color: white; 
          border: none; 
          font-size: 12px;
        ">编辑分组</button>
        <button id="openPopularEmojis" style="
          padding: 6px 12px; 
          background: var(--emoji-modal-primary-bg); 
          color: white; 
          border: none; 
          font-size: 12px;
        ">常用表情</button>
        <button id="openImportExport" style="
          padding: 6px 12px; 
          background: var(--emoji-modal-primary-bg); 
          color: white; 
          border: none; 
          font-size: 12px;
        ">导入导出</button>
      </div>
    </div>
    
    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <button id="resetSettings" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">重置</button>
      <button id="saveSettings" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
    </div>
  `
		}));
		document.body.appendChild(modal);
		const content = modal.querySelector("div:last-child");
		const scaleSlider = content.querySelector("#scaleSlider");
		const scaleValue = content.querySelector("#scaleValue");
		content.querySelector("#closeModal")?.addEventListener("click", () => {
			modal.remove();
		});
		scaleSlider?.addEventListener("input", () => {
			if (scaleValue) scaleValue.textContent = scaleSlider.value + "%";
		});
		content.querySelector("#resetSettings")?.addEventListener("click", async () => {
			if (confirm("确定要重置所有设置吗？")) {
				userscriptState.settings = { ...DEFAULT_USER_SETTINGS };
				modal.remove();
			}
		});
		content.querySelector("#saveSettings")?.addEventListener("click", () => {
			userscriptState.settings.imageScale = parseInt(scaleSlider?.value || "30");
			const outputFormat = content.querySelector("input[name=\"outputFormat\"]:checked");
			if (outputFormat) userscriptState.settings.outputFormat = outputFormat.value;
			const showSearchBar = content.querySelector("#showSearchBar");
			if (showSearchBar) userscriptState.settings.showSearchBar = showSearchBar.checked;
			const enableFloatingPreview = content.querySelector("#enableFloatingPreview");
			if (enableFloatingPreview) userscriptState.settings.enableFloatingPreview = enableFloatingPreview.checked;
			const enableCalloutEl = content.querySelector("#enableCalloutSuggestions");
			if (enableCalloutEl) userscriptState.settings.enableCalloutSuggestions = !!enableCalloutEl.checked;
			const enableBatchEl = content.querySelector("#enableBatchParseImages");
			if (enableBatchEl) userscriptState.settings.enableBatchParseImages = !!enableBatchEl.checked;
			const forceMobileEl = content.querySelector("#forceMobileMode");
			if (forceMobileEl) userscriptState.settings.forceMobileMode = !!forceMobileEl.checked;
			saveDataToLocalStorage({ settings: userscriptState.settings });
			try {
				const remoteInput = content.querySelector("#remoteConfigUrl");
				if (remoteInput && remoteInput.value.trim()) localStorage.setItem("emoji_extension_remote_config_url", remoteInput.value.trim());
			} catch (e) {}
			alert("设置已保存");
			modal.remove();
		});
		content.querySelector("#openGroupEditor")?.addEventListener("click", () => {
			modal.remove();
			showGroupEditorModal();
		});
		content.querySelector("#openPopularEmojis")?.addEventListener("click", () => {
			modal.remove();
			showPopularEmojisModal();
		});
		content.querySelector("#openImportExport")?.addEventListener("click", () => {
			modal.remove();
			showImportExportModal();
		});
	}
	var init_settings = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_groupEditor();
		init_popularEmojis();
		init_importExport();
	}));
	function createSyncTarget(config) {
		switch (config.type) {
			case "webdav": return new WebDAVSyncTarget(config);
			case "s3": return new S3SyncTarget(config);
			case "cloudflare": return new CloudflareSyncTarget(config);
			default: throw new Error(`Unknown sync target type: ${config.type}`);
		}
	}
	var WebDAVSyncTarget, S3SyncTarget, CloudflareSyncTarget;
	var init_syncTargets = __esmMin((() => {
		WebDAVSyncTarget = class {
			config;
			constructor(config) {
				this.config = config;
			}
			getAuthHeader() {
				return `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`;
			}
			getFullUrl() {
				return `${this.config.url.replace(/\/$/, "")}/${this.config.path || "emoji-data.json"}`;
			}
			async test() {
				try {
					const url = this.getFullUrl();
					const response = await fetch(url, {
						method: "HEAD",
						headers: { Authorization: this.getAuthHeader() }
					});
					if (response.ok || response.status === 404) return {
						success: true,
						message: "WebDAV connection successful",
						timestamp: Date.now()
					};
					return {
						success: false,
						message: `WebDAV connection failed: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `WebDAV connection error: ${error}`,
						error
					};
				}
			}
			async push(data, onProgress) {
				try {
					onProgress?.({
						current: 0,
						total: 1,
						action: "push"
					});
					const url = this.getFullUrl();
					const response = await fetch(url, {
						method: "PUT",
						headers: {
							Authorization: this.getAuthHeader(),
							"Content-Type": "application/json; charset=UTF-8"
						},
						body: JSON.stringify(data, null, 2)
					});
					onProgress?.({
						current: 1,
						total: 1,
						action: "push"
					});
					if (response.ok || response.status === 201 || response.status === 204) return {
						success: true,
						message: "Data pushed to WebDAV successfully",
						timestamp: Date.now()
					};
					return {
						success: false,
						message: `Failed to push to WebDAV: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `Error pushing to WebDAV: ${error}`,
						error
					};
				}
			}
			async pull(onProgress) {
				try {
					onProgress?.({
						current: 0,
						total: 1,
						action: "pull"
					});
					const url = this.getFullUrl();
					const response = await fetch(url, {
						method: "GET",
						headers: {
							Authorization: this.getAuthHeader(),
							Accept: "application/json"
						}
					});
					onProgress?.({
						current: 1,
						total: 1,
						action: "pull"
					});
					if (response.ok) return {
						success: true,
						data: await response.json(),
						message: "Data pulled from WebDAV successfully"
					};
					if (response.status === 404) return {
						success: false,
						message: "No data found on WebDAV server",
						error: "File not found"
					};
					return {
						success: false,
						message: `Failed to pull from WebDAV: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `Error pulling from WebDAV: ${error}`,
						error
					};
				}
			}
		};
		S3SyncTarget = class {
			config;
			constructor(config) {
				this.config = config;
			}
			getObjectKey() {
				const path = this.config.path || "emoji-data.json";
				return path.startsWith("/") ? path.substring(1) : path;
			}
			async signRequest(method, url, body) {
				const date = (/* @__PURE__ */ new Date()).toISOString().replace(/[:-]|\.\d{3}/g, "");
				date.substring(0, 8);
				const headers = {
					"x-amz-date": date,
					"x-amz-content-sha256": "UNSIGNED-PAYLOAD"
				};
				if (body) headers["Content-Type"] = "application/json; charset=UTF-8";
				return headers;
			}
			getS3Url() {
				const endpoint = this.config.endpoint.replace(/\/$/, "");
				const bucket = this.config.bucket;
				const key = this.getObjectKey();
				if (endpoint.endsWith(".amazonaws.com") || endpoint === "s3.amazonaws.com") return `https://${bucket}.${endpoint}/${key}`;
				return `${endpoint}/${bucket}/${key}`;
			}
			async test() {
				try {
					const url = this.getS3Url();
					const headers = await this.signRequest("HEAD", url);
					const response = await fetch(url, {
						method: "HEAD",
						headers
					});
					if (response.ok || response.status === 404) return {
						success: true,
						message: "S3 connection successful",
						timestamp: Date.now()
					};
					return {
						success: false,
						message: `S3 connection failed: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `S3 connection error: ${error}`,
						error
					};
				}
			}
			async push(data, onProgress) {
				try {
					onProgress?.({
						current: 0,
						total: 1,
						action: "push"
					});
					const url = this.getS3Url();
					const body = JSON.stringify(data, null, 2);
					const headers = await this.signRequest("PUT", url, body);
					const response = await fetch(url, {
						method: "PUT",
						headers,
						body
					});
					onProgress?.({
						current: 1,
						total: 1,
						action: "push"
					});
					if (response.ok || response.status === 201 || response.status === 204) return {
						success: true,
						message: "Data pushed to S3 successfully",
						timestamp: Date.now()
					};
					return {
						success: false,
						message: `Failed to push to S3: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `Error pushing to S3: ${error}`,
						error
					};
				}
			}
			async pull(onProgress) {
				try {
					onProgress?.({
						current: 0,
						total: 1,
						action: "pull"
					});
					const url = this.getS3Url();
					const headers = await this.signRequest("GET", url);
					const response = await fetch(url, {
						method: "GET",
						headers
					});
					onProgress?.({
						current: 1,
						total: 1,
						action: "pull"
					});
					if (response.ok) return {
						success: true,
						data: await response.json(),
						message: "Data pulled from S3 successfully"
					};
					if (response.status === 404) return {
						success: false,
						message: "No data found on S3",
						error: "Object not found"
					};
					return {
						success: false,
						message: `Failed to pull from S3: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `Error pulling from S3: ${error}`,
						error
					};
				}
			}
		};
		CloudflareSyncTarget = class {
			config;
			constructor(config) {
				this.config = config;
			}
			getWriteAuthHeader() {
				return { Authorization: `Bearer ${this.config.authToken}` };
			}
			getReadAuthHeader() {
				return { Authorization: `Bearer ${this.config.authTokenReadonly || this.config.authToken}` };
			}
			getUrl() {
				return this.config.url.replace(/\/$/, "");
			}
			async test() {
				try {
					const url = this.getUrl() + "/";
					const response = await fetch(url, {
						method: "GET",
						headers: this.getReadAuthHeader()
					});
					if (response.ok) {
						await response.json();
						return {
							success: true,
							message: "Cloudflare Worker connection successful",
							timestamp: Date.now()
						};
					}
					return {
						success: false,
						message: `Cloudflare Worker connection failed: ${response.statusText}`,
						error: response.statusText
					};
				} catch (error) {
					return {
						success: false,
						message: `Cloudflare Worker connection error: ${error}`,
						error
					};
				}
			}
			async push(data, onProgress) {
				try {
					const baseUrl = this.getUrl();
					const headers = {
						...this.getWriteAuthHeader(),
						"Content-Type": "application/json; charset=UTF-8"
					};
					const itemsToPush = [{
						key: "settings",
						data: data.settings
					}, ...data.emojiGroups.map((g) => ({
						key: encodeURIComponent(g.name),
						data: g
					}))];
					const total = itemsToPush.length;
					let current = 0;
					onProgress?.({
						current,
						total,
						action: "push"
					});
					for (const item of itemsToPush) {
						const response = await fetch(`${baseUrl}/${item.key}`, {
							method: "POST",
							headers,
							body: JSON.stringify(item.data)
						});
						if (!response.ok) throw new Error(`Failed to push item ${item.key}: ${response.statusText}`);
						current++;
						onProgress?.({
							current,
							total,
							action: "push"
						});
					}
					return {
						success: true,
						message: `Data pushed to Cloudflare Worker successfully (${total} items).`,
						timestamp: Date.now()
					};
				} catch (error) {
					return {
						success: false,
						message: `Error pushing to Cloudflare Worker: ${error}`,
						error
					};
				}
			}
			async pull(onProgress) {
				try {
					const baseUrl = this.getUrl();
					const headers = this.getReadAuthHeader();
					let current = 0;
					onProgress?.({
						current,
						total: 1,
						action: "pull"
					});
					const listResponse = await fetch(`${baseUrl}/`, {
						method: "GET",
						headers
					});
					if (!listResponse.ok) throw new Error(`Failed to list keys: ${listResponse.statusText}`);
					const keys = await listResponse.json();
					const total = keys.length;
					onProgress?.({
						current,
						total,
						action: "pull"
					});
					const pulledItems = [];
					for (const key of keys) {
						const res = await fetch(`${baseUrl}/${key.name}`, {
							method: "GET",
							headers
						});
						if (!res.ok) {
							console.warn(`Failed to fetch key ${key.name}, skipping.`);
							continue;
						}
						const data = await res.json();
						pulledItems.push({
							key: key.name,
							data
						});
						current++;
						onProgress?.({
							current,
							total,
							action: "pull"
						});
					}
					const pulledData = { emojiGroups: [] };
					let version = "0.0.0";
					let timestamp = Date.now();
					for (const item of pulledItems) if (item.key === "settings") pulledData.settings = item.data;
					else pulledData.emojiGroups.push(item.data);
					if (pulledData.settings?.version) version = pulledData.settings.version;
					if (pulledData.settings?.timestamp) timestamp = pulledData.settings.timestamp;
					return {
						success: true,
						data: {
							settings: pulledData.settings || {},
							emojiGroups: pulledData.emojiGroups || [],
							version,
							timestamp
						},
						message: `Data pulled from Cloudflare Worker successfully (${pulledItems.length} items).`
					};
				} catch (error) {
					console.error("Error pulling from Cloudflare Worker:", error);
					return {
						success: false,
						message: `Error pulling from Cloudflare Worker: ${error}`,
						error
					};
				}
			}
		};
	}));
	var syncManager_exports = /* @__PURE__ */ __export({
		showSyncConfigModal: () => showSyncConfigModal,
		showSyncOperationsModal: () => showSyncOperationsModal
	});
	function loadSyncConfig() {
		try {
			const configData = localStorage.getItem(SYNC_CONFIG_KEY);
			if (configData) return JSON.parse(configData);
		} catch (error) {
			console.error("[Sync Manager] Failed to load sync config:", error);
		}
		return null;
	}
	function saveSyncConfig(config) {
		try {
			localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
			console.log("[Sync Manager] Sync config saved");
		} catch (error) {
			console.error("[Sync Manager] Failed to save sync config:", error);
		}
	}
	function createSyncDataFromState() {
		return {
			emojiGroups: userscriptState.emojiGroups,
			settings: userscriptState.settings,
			timestamp: Date.now(),
			version: "1.0"
		};
	}
	function applySyncDataToState(data) {
		const mergedData = mergeSyncData(createSyncDataFromState(), data);
		userscriptState.emojiGroups = mergedData.emojiGroups;
		userscriptState.settings = mergedData.settings;
		saveDataToLocalStorage({
			emojiGroups: userscriptState.emojiGroups,
			settings: userscriptState.settings
		});
	}
	function mergeSyncData(local, remote) {
		const mergedSettings = {
			...local.settings,
			...remote.settings
		};
		const localGroupsMap = new Map(local.emojiGroups.map((g) => [g.name, g]));
		const mergedGroups = [...local.emojiGroups];
		for (const remoteGroup of remote.emojiGroups) {
			const localGroup = localGroupsMap.get(remoteGroup.name);
			if (localGroup) {
				const localEmojisMap = new Map((localGroup.emojis || []).map((e) => [e.name, e]));
				for (const remoteEmoji of remoteGroup.emojis || []) localEmojisMap.set(remoteEmoji.name, remoteEmoji);
				localGroup.emojis = Array.from(localEmojisMap.values());
			} else mergedGroups.push(remoteGroup);
		}
		return {
			settings: mergedSettings,
			emojiGroups: mergedGroups,
			timestamp: remote.timestamp,
			version: remote.version
		};
	}
	function showSyncConfigModal() {
		const existingConfig = loadSyncConfig();
		const syncType = existingConfig?.type || "webdav";
		const modal = createModalElement({
			title: "同步配置",
			content: `
    <div style="margin-bottom: 16px; padding: 12px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; color: #92400e;">
      <div style="font-weight: bold; margin-bottom: 4px;">⚠️ 安全提示</div>
      <div style="font-size: 13px;">
        您的密码和密钥将以明文形式存储在浏览器的 localStorage 中。请确保：
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li>仅在受信任的设备上使用此功能</li>
          <li>使用强密码和独立的凭据</li>
          <li>定期更换密码和密钥</li>
        </ul>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">同步类型</h3>
      <select id="syncTypeSelect" style="
        width: 100%;
        padding: 8px;
        background: var(--emoji-modal-button-bg);
        color: var(--emoji-modal-text);
        border: 1px solid var(--emoji-modal-border);
        border-radius: 4px;
        margin-bottom: 16px;
      ">
        <option value="webdav" ${syncType === "webdav" ? "selected" : ""}>WebDAV</option>
        <option value="s3" ${syncType === "s3" ? "selected" : ""}>S3</option>
        <option value="cloudflare" ${syncType === "cloudflare" ? "selected" : ""}>Cloudflare Worker</option>
      </select>
    </div>

    <!-- Cloudflare Worker Configuration -->
    <div id="cloudflareConfig" style="display: ${syncType === "cloudflare" ? "block" : "none"};">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">Cloudflare Worker 配置</h3>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: var(--emoji-modal-label);">Worker URL:</label>
        <input type="text" id="cfWorkerUrl" placeholder="https://your-worker.workers.dev" value="${existingConfig?.type === "cloudflare" ? existingConfig.url : ""}" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
        ">
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: var(--emoji-modal-label);">读写授权密钥 (Auth Token):</label>
        <input type="password" id="cfAuthToken" value="${existingConfig?.type === "cloudflare" ? existingConfig.authToken : ""}" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
        ">
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: var(--emoji-modal-label);">只读授权密钥 (可选):</label>
        <input type="password" id="cfAuthTokenReadonly" value="${existingConfig?.type === "cloudflare" ? existingConfig.authTokenReadonly || "" : ""}" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
        ">
        <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7; margin-top: 4px;">
          如果提供，拉取数据时将优先使用此密钥。
        </div>
      </div>
    </div>

    <!-- WebDAV Configuration -->
    <div id="webdavConfig" style="display: ${syncType === "webdav" ? "block" : "none"};">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">WebDAV 配置</h3>
      <input type="text" id="webdavUrl" placeholder="服务器 URL" value="${existingConfig?.type === "webdav" ? existingConfig.url : ""}">
      <input type="text" id="webdavUsername" placeholder="用户名" value="${existingConfig?.type === "webdav" ? existingConfig.username : ""}">
      <input type="password" id="webdavPassword" placeholder="密码" value="${existingConfig?.type === "webdav" ? existingConfig.password : ""}">
      <input type="text" id="webdavPath" placeholder="文件路径 (可选)" value="${existingConfig?.type === "webdav" ? existingConfig.path || "" : ""}">
    </div>

    <!-- S3 Configuration -->
    <div id="s3Config" style="display: ${syncType === "s3" ? "block" : "none"};">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">S3 配置</h3>
      <input type="text" id="s3Endpoint" placeholder="Endpoint" value="${existingConfig?.type === "s3" ? existingConfig.endpoint : ""}">
      <input type="text" id="s3Region" placeholder="Region" value="${existingConfig?.type === "s3" ? existingConfig.region : ""}">
      <input type="text" id="s3Bucket" placeholder="Bucket" value="${existingConfig?.type === "s3" ? existingConfig.bucket : ""}">
      <input type="text" id="s3AccessKeyId" placeholder="Access Key ID" value="${existingConfig?.type === "s3" ? existingConfig.accessKeyId : ""}">
      <input type="password" id="s3SecretAccessKey" placeholder="Secret Access Key" value="${existingConfig?.type === "s3" ? existingConfig.secretAccessKey : ""}">
      <input type="text" id="s3Path" placeholder="路径前缀 (可选)" value="${existingConfig?.type === "s3" ? existingConfig.path || "" : ""}">
    </div>

    <div style="display: flex; gap: 8px; margin-top: 16px;">
      <button id="testConnection">测试连接</button>
      <button id="saveConfig">保存配置</button>
    </div>
  `,
			onClose: () => modal.remove()
		});
		document.body.appendChild(modal);
		const syncTypeSelect = modal.querySelector("#syncTypeSelect");
		const webdavConfigDiv = modal.querySelector("#webdavConfig");
		const s3ConfigDiv = modal.querySelector("#s3Config");
		const cloudflareConfigDiv = modal.querySelector("#cloudflareConfig");
		syncTypeSelect.addEventListener("change", () => {
			const selectedType = syncTypeSelect.value;
			webdavConfigDiv.style.display = selectedType === "webdav" ? "block" : "none";
			s3ConfigDiv.style.display = selectedType === "s3" ? "block" : "none";
			cloudflareConfigDiv.style.display = selectedType === "cloudflare" ? "block" : "none";
		});
		modal.querySelector("#testConnection")?.addEventListener("click", async () => {
			const config = getCurrentConfigFromModal(modal);
			if (!config) {
				showTemporaryMessage("请填写完整的配置信息", "error");
				return;
			}
			const btn = modal.querySelector("#testConnection");
			btn.disabled = true;
			btn.textContent = "测试中...";
			try {
				const result = await createSyncTarget(config).test();
				showTemporaryMessage(result.message, result.success ? "success" : "error");
			} catch (error) {
				showTemporaryMessage(`测试失败: ${error}`, "error");
			} finally {
				btn.disabled = false;
				btn.textContent = "测试连接";
			}
		});
		modal.querySelector("#saveConfig")?.addEventListener("click", () => {
			const config = getCurrentConfigFromModal(modal);
			if (!config) {
				showTemporaryMessage("请填写完整的配置信息", "error");
				return;
			}
			saveSyncConfig(config);
			showTemporaryMessage("配置已保存", "success");
			modal.remove();
		});
	}
	function getCurrentConfigFromModal(modal) {
		const syncType = modal.querySelector("#syncTypeSelect").value;
		if (syncType === "cloudflare") {
			const url = modal.querySelector("#cfWorkerUrl").value.trim();
			const authToken = modal.querySelector("#cfAuthToken").value.trim();
			const authTokenReadonly = modal.querySelector("#cfAuthTokenReadonly").value.trim();
			if (!url || !authToken) return null;
			return {
				type: "cloudflare",
				enabled: true,
				url,
				authToken,
				authTokenReadonly: authTokenReadonly || void 0
			};
		}
		if (syncType === "webdav") {
			const url = modal.querySelector("#webdavUrl").value.trim();
			const username = modal.querySelector("#webdavUsername").value.trim();
			const password = modal.querySelector("#webdavPassword").value.trim();
			const path = modal.querySelector("#webdavPath").value.trim();
			if (!url || !username || !password) return null;
			return {
				type: "webdav",
				enabled: true,
				url,
				username,
				password,
				path: path || void 0
			};
		} else if (syncType === "s3") {
			const endpoint = modal.querySelector("#s3Endpoint").value.trim();
			const region = modal.querySelector("#s3Region").value.trim();
			const bucket = modal.querySelector("#s3Bucket").value.trim();
			const accessKeyId = modal.querySelector("#s3AccessKeyId").value.trim();
			const secretAccessKey = modal.querySelector("#s3SecretAccessKey").value.trim();
			const path = modal.querySelector("#s3Path").value.trim();
			if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) return null;
			return {
				type: "s3",
				enabled: true,
				endpoint,
				region,
				bucket,
				accessKeyId,
				secretAccessKey,
				path: path || void 0
			};
		}
		return null;
	}
	function showPullPreviewModal(data, config, onConfirm) {
		const groupListHTML = data.emojiGroups.length > 0 ? `<ul>${data.emojiGroups.map((g) => `<li style="color: var(--emoji-modal-text);">${g.name}</li>`).join("")}</ul>` : "<p style=\"color: var(--emoji-modal-text);\">没有表情分组</p>";
		const modal = createModalElement({
			title: "确认合并恢复",
			content: `
    <div style="margin-bottom: 16px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">恢复预览</h3>
      <div style="padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 4px;">
        <div style="color: var(--emoji-modal-text); margin-bottom: 8px;">
          <strong>备份时间:</strong> ${new Date(data.timestamp).toLocaleString()}
        </div>
        <div style="color: var(--emoji-modal-text); margin-bottom: 8px;">
          <strong>表情分组数量:</strong> ${data.emojiGroups.length}
        </div>
        <div>
          <strong style="color: var(--emoji-modal-text);">分组列表:</strong>
          <div style="max-height: 150px; overflow-y: auto; border: 1px solid var(--emoji-modal-border); padding: 8px; border-radius: 4px; margin-top: 4px;">
            ${groupListHTML}
          </div>
        </div>
      </div>
    </div>
    <p style="color: #f59e0b; font-weight: bold;">将使用此备份与本地数据合并。此操作不可撤销。</p>
    <div style="display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end;">
      <button id="cancelPull">取消</button>
      <button id="confirmPull">确认合并</button>
    </div>
  `,
			onClose: () => modal.remove()
		});
		document.body.appendChild(modal);
		modal.querySelector("#confirmPull")?.addEventListener("click", () => {
			applySyncDataToState(data);
			config.lastSyncTime = Date.now();
			saveSyncConfig(config);
			showTemporaryMessage("数据合并成功，页面将刷新", "success");
			modal.remove();
			onConfirm();
			setTimeout(() => {
				window.location.reload();
			}, 1e3);
		});
		modal.querySelector("#cancelPull")?.addEventListener("click", () => {
			modal.remove();
		});
	}
	function showSyncOperationsModal() {
		const config = loadSyncConfig();
		if (!config) {
			showTemporaryMessage("请先配置同步设置", "error");
			showSyncConfigModal();
			return;
		}
		const lastSyncTime = config.lastSyncTime ? new Date(config.lastSyncTime).toLocaleString() : "从未同步";
		const modal = createModalElement({
			title: "同步管理",
			content: `
    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">同步状态</h3>
      <div style="padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 4px; margin-bottom: 16px;">
        <div style="color: var(--emoji-modal-text); margin-bottom: 4px;">
          <strong>同步类型:</strong> ${config.type.toUpperCase()}
        </div>
        <div style="color: var(--emoji-modal-text);">
          <strong>最后同步:</strong> ${lastSyncTime}
        </div>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div id="syncProgressContainer" style="display: none; margin-bottom: 16px;">
      <div id="syncProgressText" style="margin-bottom: 4px; color: var(--emoji-modal-text);"></div>
      <progress id="syncProgressBar" value="0" max="100" style="width: 100%;"></progress>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">同步操作</h3>
      
      <div style="margin-bottom: 16px;">
        <button id="pushData">⬆️ 推送 (Push) - 上传本地数据到服务器</button>
        <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7; margin-top: 4px;">
          将当前的表情分组和设置推送到远程服务器
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <button id="pullData">⬇️ 拉取 (Pull) - 从服务器合并数据</button>
        <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7; margin-top: 4px;">
          从远程服务器拉取数据并与本地数据合并
        </div>
      </div>

      <div>
        <button id="configSync">⚙️ 同步配置</button>
      </div>
    </div>
  `,
			onClose: () => modal.remove()
		});
		document.body.appendChild(modal);
		const progressContainer = modal.querySelector("#syncProgressContainer");
		const progressText = modal.querySelector("#syncProgressText");
		const progressBar = modal.querySelector("#syncProgressBar");
		const pullBtn = modal.querySelector("#pullData");
		const pushBtn = modal.querySelector("#pushData");
		const updateProgress = (progress) => {
			progressContainer.style.display = "block";
			progressText.textContent = `${progress.action === "push" ? "推送" : "拉取"}中... (${progress.current} / ${progress.total})`;
			progressBar.max = progress.total;
			progressBar.value = progress.current;
		};
		const hideProgress = () => {
			progressContainer.style.display = "none";
		};
		pushBtn.addEventListener("click", async () => {
			pushBtn.disabled = true;
			pullBtn.disabled = true;
			pushBtn.textContent = "推送中...";
			updateProgress({
				current: 0,
				total: 1,
				action: "push"
			});
			try {
				const target = createSyncTarget(config);
				const syncData = createSyncDataFromState();
				const result = await target.push(syncData, updateProgress);
				if (result.success) {
					config.lastSyncTime = Date.now();
					saveSyncConfig(config);
					showTemporaryMessage("数据推送成功", "success");
					modal.remove();
				} else showTemporaryMessage(`推送失败: ${result.message}`, "error");
			} catch (error) {
				showTemporaryMessage(`推送错误: ${error}`, "error");
			} finally {
				pushBtn.disabled = false;
				pullBtn.disabled = false;
				pushBtn.textContent = "⬆️ 推送 (Push) - 上传本地数据到服务器";
				hideProgress();
			}
		});
		pullBtn.addEventListener("click", async () => {
			pullBtn.disabled = true;
			pushBtn.disabled = true;
			pullBtn.textContent = "拉取中...";
			updateProgress({
				current: 0,
				total: 1,
				action: "pull"
			});
			try {
				const result = await createSyncTarget(config).pull(updateProgress);
				if (result.success && result.data) showPullPreviewModal(result.data, config, () => modal.remove());
				else showTemporaryMessage(`拉取失败: ${result.message}`, "error");
			} catch (error) {
				showTemporaryMessage(`拉取错误: ${error}`, "error");
			} finally {
				pullBtn.disabled = false;
				pushBtn.disabled = false;
				pullBtn.textContent = "⬇️ 拉取 (Pull) - 从服务器合并数据";
				hideProgress();
			}
		});
		modal.querySelector("#configSync")?.addEventListener("click", () => {
			modal.remove();
			showSyncConfigModal();
		});
	}
	var SYNC_CONFIG_KEY;
	var init_syncManager = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_editorUtils();
		init_tempMessage();
		init_syncTargets();
		SYNC_CONFIG_KEY = "emoji_extension_sync_config";
	}));
	init_userscript_storage();
	init_state();
	init_platformDetection();
	async function initializeUserscriptData() {
		const data = await loadDataFromLocalStorageAsync(window.location.hostname).catch((err) => {
			console.warn("[Manager] loadDataFromLocalStorageAsync failed, falling back to sync loader", err);
			return loadDataFromLocalStorage();
		});
		userscriptState.emojiGroups = data.emojiGroups || [];
		userscriptState.settings = data.settings || userscriptState.settings;
	}
	function isDiscoursePage() {
		if (document.querySelectorAll("meta[name*=\"discourse\"], meta[content*=\"discourse\"], meta[property*=\"discourse\"]").length > 0) {
			console.log("[Emoji Manager] Discourse detected via meta tags");
			return true;
		}
		const generatorMeta = document.querySelector("meta[name=\"generator\"]");
		if (generatorMeta) {
			if ((generatorMeta.getAttribute("content")?.toLowerCase() || "").includes("discourse")) {
				console.log("[Emoji Manager] Discourse detected via generator meta");
				return true;
			}
		}
		if (document.querySelectorAll("#main-outlet, .ember-application, textarea.d-editor-input, .ProseMirror.d-editor-input").length > 0) {
			console.log("[Emoji Manager] Discourse elements detected");
			return true;
		}
		console.log("[Emoji Manager] Not a Discourse site");
		return false;
	}
	async function initializeEmojiManager() {
		console.log("[Emoji Manager] Initializing...");
		logPlatformInfo();
		await initializeUserscriptData();
		const isMobileQuery = window.matchMedia("(max-width: 768px)");
		const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
		const isMobile = isMobileQuery.matches || isMobileUserAgent;
		const managerButton = document.createElement("button");
		managerButton.id = "emoji-manager-floating-button";
		managerButton.textContent = isMobile ? "⚙️" : "⚙️ 表情管理";
		managerButton.title = "Open Emoji Management Interface";
		Object.assign(managerButton.style, {
			position: "fixed",
			right: isMobile ? "16px" : "12px",
			bottom: isMobile ? "16px" : "12px",
			zIndex: "2147483647",
			padding: isMobile ? "14px 18px" : "12px 16px",
			borderRadius: isMobile ? "12px" : "8px",
			border: "none",
			background: "#1f2937",
			color: "#fff",
			fontSize: isMobile ? "16px" : "14px",
			fontWeight: "500",
			boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
			cursor: "pointer",
			transition: "transform 0.2s",
			minWidth: isMobile ? "56px" : "auto",
			minHeight: isMobile ? "56px" : "auto"
		});
		managerButton.addEventListener("mouseenter", () => {
			if (!isMobile) managerButton.style.transform = "scale(1.05)";
		});
		managerButton.addEventListener("mouseleave", () => {
			if (!isMobile) managerButton.style.transform = "scale(1)";
		});
		managerButton.addEventListener("touchstart", () => {
			managerButton.style.transform = "scale(0.95)";
		});
		managerButton.addEventListener("touchend", () => {
			managerButton.style.transform = "scale(1)";
		});
		managerButton.addEventListener("click", async () => {
			try {
				const { openManagementInterface: openManagementInterface$1 } = await __vitePreload(async () => {
					const { openManagementInterface: openManagementInterface$2 } = await Promise.resolve().then(() => (init_manager(), manager_exports));
					return { openManagementInterface: openManagementInterface$2 };
				}, void 0);
				openManagementInterface$1();
			} catch (e) {
				console.error("[Emoji Manager] Failed to open management interface:", e);
			}
		});
		const settingsButton = document.createElement("button");
		settingsButton.id = "emoji-settings-floating-button";
		settingsButton.textContent = isMobile ? "🔧" : "🔧 设置";
		settingsButton.title = "Open Settings";
		Object.assign(settingsButton.style, {
			position: "fixed",
			right: isMobile ? "16px" : "12px",
			bottom: isMobile ? "84px" : "70px",
			zIndex: "2147483647",
			padding: isMobile ? "12px 16px" : "10px 14px",
			borderRadius: isMobile ? "12px" : "8px",
			border: "none",
			background: "#374151",
			color: "#fff",
			fontSize: isMobile ? "15px" : "13px",
			fontWeight: "500",
			boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
			cursor: "pointer",
			transition: "transform 0.2s",
			minWidth: isMobile ? "52px" : "auto",
			minHeight: isMobile ? "52px" : "auto"
		});
		settingsButton.addEventListener("mouseenter", () => {
			if (!isMobile) settingsButton.style.transform = "scale(1.05)";
		});
		settingsButton.addEventListener("mouseleave", () => {
			if (!isMobile) settingsButton.style.transform = "scale(1)";
		});
		settingsButton.addEventListener("touchstart", () => {
			settingsButton.style.transform = "scale(0.95)";
		});
		settingsButton.addEventListener("touchend", () => {
			settingsButton.style.transform = "scale(1)";
		});
		settingsButton.addEventListener("click", async () => {
			try {
				const { showSettingsModal: showSettingsModal$1 } = await __vitePreload(async () => {
					const { showSettingsModal: showSettingsModal$2 } = await Promise.resolve().then(() => (init_settings(), settings_exports));
					return { showSettingsModal: showSettingsModal$2 };
				}, void 0);
				showSettingsModal$1();
			} catch (e) {
				console.error("[Emoji Manager] Failed to open settings:", e);
			}
		});
		const importExportButton = document.createElement("button");
		importExportButton.id = "emoji-importexport-floating-button";
		importExportButton.textContent = isMobile ? "📦" : "📦 导入/导出";
		importExportButton.title = "Import/Export Data";
		Object.assign(importExportButton.style, {
			position: "fixed",
			right: isMobile ? "16px" : "12px",
			bottom: isMobile ? "152px" : "128px",
			zIndex: "2147483647",
			padding: isMobile ? "12px 16px" : "10px 14px",
			borderRadius: isMobile ? "12px" : "8px",
			border: "none",
			background: "#374151",
			color: "#fff",
			fontSize: isMobile ? "15px" : "13px",
			fontWeight: "500",
			boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
			cursor: "pointer",
			transition: "transform 0.2s",
			minWidth: isMobile ? "52px" : "auto",
			minHeight: isMobile ? "52px" : "auto"
		});
		importExportButton.addEventListener("mouseenter", () => {
			if (!isMobile) importExportButton.style.transform = "scale(1.05)";
		});
		importExportButton.addEventListener("mouseleave", () => {
			if (!isMobile) importExportButton.style.transform = "scale(1)";
		});
		importExportButton.addEventListener("touchstart", () => {
			importExportButton.style.transform = "scale(0.95)";
		});
		importExportButton.addEventListener("touchend", () => {
			importExportButton.style.transform = "scale(1)";
		});
		importExportButton.addEventListener("click", async () => {
			try {
				const { showImportExportModal: showImportExportModal$1 } = await __vitePreload(async () => {
					const { showImportExportModal: showImportExportModal$2 } = await Promise.resolve().then(() => (init_importExport(), importExport_exports));
					return { showImportExportModal: showImportExportModal$2 };
				}, void 0);
				showImportExportModal$1();
			} catch (e) {
				console.error("[Emoji Manager] Failed to open import/export:", e);
			}
		});
		const syncButton = document.createElement("button");
		syncButton.id = "emoji-sync-floating-button";
		syncButton.textContent = isMobile ? "☁️" : "☁️ 同步";
		syncButton.title = "Sync with WebDAV/S3";
		Object.assign(syncButton.style, {
			position: "fixed",
			right: isMobile ? "16px" : "12px",
			bottom: isMobile ? "220px" : "186px",
			zIndex: "2147483647",
			padding: isMobile ? "12px 16px" : "10px 14px",
			borderRadius: isMobile ? "12px" : "8px",
			border: "none",
			background: "#374151",
			color: "#fff",
			fontSize: isMobile ? "15px" : "13px",
			fontWeight: "500",
			boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
			cursor: "pointer",
			transition: "transform 0.2s",
			minWidth: isMobile ? "52px" : "auto",
			minHeight: isMobile ? "52px" : "auto"
		});
		syncButton.addEventListener("mouseenter", () => {
			if (!isMobile) syncButton.style.transform = "scale(1.05)";
		});
		syncButton.addEventListener("mouseleave", () => {
			if (!isMobile) syncButton.style.transform = "scale(1)";
		});
		syncButton.addEventListener("touchstart", () => {
			syncButton.style.transform = "scale(0.95)";
		});
		syncButton.addEventListener("touchend", () => {
			syncButton.style.transform = "scale(1)";
		});
		syncButton.addEventListener("click", async () => {
			try {
				const { showSyncOperationsModal: showSyncOperationsModal$1 } = await __vitePreload(async () => {
					const { showSyncOperationsModal: showSyncOperationsModal$2 } = await Promise.resolve().then(() => (init_syncManager(), syncManager_exports));
					return { showSyncOperationsModal: showSyncOperationsModal$2 };
				}, void 0);
				showSyncOperationsModal$1();
			} catch (e) {
				console.error("[Emoji Manager] Failed to open sync manager:", e);
			}
		});
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => {
			document.body.appendChild(managerButton);
			document.body.appendChild(settingsButton);
			document.body.appendChild(importExportButton);
			document.body.appendChild(syncButton);
		});
		else {
			document.body.appendChild(managerButton);
			document.body.appendChild(settingsButton);
			document.body.appendChild(importExportButton);
			document.body.appendChild(syncButton);
		}
		console.log("[Emoji Manager] Initialization complete");
	}
	if (isDiscoursePage()) {
		console.log("[Emoji Manager] Discourse detected, initializing management interface");
		initializeEmojiManager();
	} else console.log("[Emoji Manager] Not a Discourse site, skipping initialization");
})();

})();