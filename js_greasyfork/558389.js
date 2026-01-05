// ==UserScript==
// @name         YouTube To Gemini 自动总结与字幕
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  YouTube 首页/搜索分段缩略图网格100%修复，Gemini一键总结. Mobile & Desktop
// @author       Jerry
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @homepage    https://greasyfork.org/en/scripts/558389
// @downloadURL https://update.greasyfork.org/scripts/558389/YouTube%20To%20Gemini%20%E8%87%AA%E5%8A%A8%E6%80%BB%E7%BB%93%E4%B8%8E%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/558389/YouTube%20To%20Gemini%20%E8%87%AA%E5%8A%A8%E6%80%BB%E7%BB%93%E4%B8%8E%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

// modified from https://greasyfork.org/en/scripts/547127

(function () {
	'use strict';

	// --- 性能优化变量 ---
	let debounceTimer = null;
	let lastProcessedCount = 0;
	// 修复问题2：使用Map替代WeakSet，可以清理和重新处理
	const processedElements = new Map(); // key: element, value: {videoId, timestamp}
	const ELEMENT_CACHE_TIME = 60000; // 1分钟后允许重新处理
	// 添加重试计数器，限制重试次数
	let retryCount = 0;
	const MAX_RETRIES = 5;

	// --- 终极分段网格修复 CSS ---
	// 只对首页和搜索结果页面应用网格布局修复
	GM_addStyle(`
    /* 首页和搜索页面网格布局 - 排除Shorts区域 */
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents) {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 24px 16px !important;
        width: 100% !important;
        margin: 0 auto !important;
        --ytd-rich-grid-items-per-row: 2 !important;
        --ytd-rich-grid-max-width: none !important;
    }
    @media (min-width: 1000px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents) {
            grid-template-columns: repeat(3, 1fr) !important;
            --ytd-rich-grid-items-per-row: 3 !important;
        }
    }
    @media (min-width: 1400px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents) {
            grid-template-columns: repeat(4, 1fr) !important;
            --ytd-rich-grid-items-per-row: 4 !important;
        }
    }
    @media (min-width: 1700px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents),
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents:not(ytd-rich-shelf-renderer #contents) {
            grid-template-columns: repeat(5, 1fr) !important;
            --ytd-rich-grid-items-per-row: 5 !important;
        }
    }

    /* 确保只在首页和搜索页面修改布局结构 - 排除Shorts区域 */
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row),
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > .ytd-rich-grid-row,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > .ytd-rich-grid-row,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div,
    body[data-is-home-page="true"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row),
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > .ytd-rich-grid-row,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > .ytd-rich-grid-row,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div,
    body[data-page-subtype="home"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div > #contents,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row),
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #contents,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > #dismissible > #contents,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #contents,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > #dismissible > #contents,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > .ytd-rich-grid-row,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > .ytd-rich-grid-row,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div,
    body[data-page-type="search"] ytd-rich-grid-row:not(ytd-rich-shelf-renderer ytd-rich-grid-row) > div > div > #contents {
        display: contents !important;
    }

    /* 视频项修复 - 仅限首页和搜索页面，排除Shorts区域 */
    body[data-is-home-page="true"] ytd-rich-item-renderer:not(ytd-rich-shelf-renderer ytd-rich-item-renderer),
    body[data-is-home-page="true"] ytd-grid-video-renderer:not(ytd-rich-shelf-renderer ytd-grid-video-renderer),
    body[data-is-home-page="true"] ytd-rich-grid-media:not(ytd-rich-shelf-renderer ytd-rich-grid-media),
    body[data-page-subtype="home"] ytd-rich-item-renderer:not(ytd-rich-shelf-renderer ytd-rich-item-renderer),
    body[data-page-subtype="home"] ytd-grid-video-renderer:not(ytd-rich-shelf-renderer ytd-grid-video-renderer),
    body[data-page-subtype="home"] ytd-rich-grid-media:not(ytd-rich-shelf-renderer ytd-rich-grid-media),
    body[data-page-type="search"] ytd-rich-item-renderer:not(ytd-rich-shelf-renderer ytd-rich-item-renderer),
    body[data-page-type="search"] ytd-grid-video-renderer:not(ytd-rich-shelf-renderer ytd-grid-video-renderer),
    body[data-page-type="search"] ytd-rich-grid-media:not(ytd-rich-shelf-renderer ytd-rich-grid-media) {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
    }

    /* 弹性项 - 仅首页和搜索页面，排除Shorts区域 */
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer:not(ytd-rich-shelf-renderer),
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents > ytd-reel-shelf-renderer:not(ytd-rich-shelf-renderer),
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer:not(ytd-rich-shelf-renderer),
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-reel-shelf-renderer:not(ytd-rich-shelf-renderer),
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer:not(ytd-rich-shelf-renderer),
    body[data-page-type="search"] ytd-rich-renderer > #contents > ytd-reel-shelf-renderer:not(ytd-rich-shelf-renderer) {
        grid-column: 1 / -1 !important;
        width: 100% !important;
        margin: 16px 0 !important;
    }

    /* 保持Shorts区域的原始样式，不应用任何自定义样式 */
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents > ytd-rich-shelf-renderer,
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-shelf-renderer,
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents > ytd-rich-shelf-renderer {
        /* 移除所有自定义样式，让YouTube使用原生样式 */
    }

    /* 搜索页面修复 */
    ytd-search ytd-video-renderer {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
    }

    ytd-search ytd-thumbnail {
        position: relative !important;
        z-index: 5 !important;
    }
    `);

	// --- Gemini 按钮与交互 ---
	const PROMPT_KEY = 'geminiPrompt';
	const TITLE_KEY = 'videoTitle';
	const ORIGINAL_TITLE_KEY = 'geminiOriginalVideoTitle';
	const TIMESTAMP_KEY = 'timestamp';
	const ACTION_TYPE_KEY = 'geminiActionType';
	const VIDEO_TOTAL_DURATION_KEY = 'geminiVideoTotalDuration';
	const FIRST_SEGMENT_END_TIME_KEY = 'geminiFirstSegmentEndTime';
	const SUMMARY_BUTTON_ID = 'gemini-summarize-btn';
	const SUBTITLE_BUTTON_ID = 'gemini-subtitle-btn';
	const THUMBNAIL_BUTTON_CLASS = 'gemini-thumbnail-btn';
	const THUMBNAIL_PROCESSED_FLAG = 'data-gemini-processed';
	const YOUTUBE_NOTIFICATION_ID = 'gemini-yt-notification';
	const YOUTUBE_CONFIRMATION_ID = 'gemini-yt-confirmation';
	// 修复问题3：添加唯一会话ID
	const SESSION_ID_KEY = 'geminiSessionId';

	// 恢复原始通知样式
	const YOUTUBE_NOTIFICATION_STYLE = {
		position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
		backgroundColor: 'rgba(0,0,0,0.85)', color: 'white', padding: '15px 35px 15px 20px',
		borderRadius: '8px', zIndex: '99999', maxWidth: 'calc(100% - 40px)', textAlign: 'left',
		boxSizing: 'border-box', whiteSpace: 'pre-wrap',
		boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
	};
	const YOUTUBE_CONFIRMATION_STYLE = {
		position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
		backgroundColor: 'rgba(33, 33, 33, 0.95)', color: 'white', padding: '20px 25px',
		borderRadius: '12px', zIndex: '999999', maxWidth: 'calc(100% - 60px)', minWidth: '300px',
		boxSizing: 'border-box', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
		display: 'flex', flexDirection: 'column', gap: '15px'
	};

	// 缩略图按钮样式
	GM_addStyle(`
    .${THUMBNAIL_BUTTON_CLASS} {
        position: absolute !important;
        top: 5px !important;
        right: 5px !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 4px 8px !important;
        font-size: 12px !important;
        cursor: pointer !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        transition: opacity 0.2s ease;
    }
    .${THUMBNAIL_BUTTON_CLASS}:hover {
        background-color: rgba(0, 0, 0, 0.9) !important;
    }

    /* 搜索页面视频预览时的特殊处理 */
    ytd-search .ytp-inline-preview-scrim ~ .${THUMBNAIL_BUTTON_CLASS},
    ytd-search video ~ .${THUMBNAIL_BUTTON_CLASS},
    ytd-search .html5-video-player ~ .${THUMBNAIL_BUTTON_CLASS} {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        z-index: 99999 !important;
    }

    /* 确保搜索页面的按钮在视频预览时仍然可见 */
    ytd-search ytd-video-renderer:has(video) .${THUMBNAIL_BUTTON_CLASS},
    ytd-search ytd-video-renderer:has(.ytp-inline-preview-scrim) .${THUMBNAIL_BUTTON_CLASS} {
        opacity: 1 !important;
        z-index: 99999 !important;
    }

    .gemini-confirmation-btn {
        padding: 8px 20px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }
    .gemini-confirmation-confirm {
        background-color: #1a73e8;
        color: white;
    }
    .gemini-confirmation-confirm:hover {
        background-color: #0d65d9;
    }
    .gemini-confirmation-cancel {
        background-color: #5f6368;
        color: white;
        margin-right: 10px;
    }
    .gemini-confirmation-cancel:hover {
        background-color: #494c50;
    }

    /* 视频页面tldr按钮样式 - 强制可见性 */
    #${SUMMARY_BUTTON_ID} {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        display: inline-flex !important;
    }

    /* 防止YouTube隐藏按钮 */
    ytd-watch-metadata #${SUMMARY_BUTTON_ID},
    #owner #${SUMMARY_BUTTON_ID} {
        visibility: visible !important;
        opacity: 1 !important;
        display: inline-flex !important;
        pointer-events: auto !important;
    }
		    `);

	// 辅助函数
	function showNotification(elementId, message, styles, duration = 15000) {
		let existing = document.getElementById(elementId);
		if (existing) {
			clearTimeout(parseInt(existing.dataset.timeoutId));
			existing.remove();
		}
		const notif = document.createElement('div');
		notif.id = elementId;
		notif.textContent = message;
		Object.assign(notif.style, styles);
		document.body.appendChild(notif);
		const btn = document.createElement('button');
		btn.textContent = '✕';
		Object.assign(btn.style, { position: 'absolute', top: '5px', right: '10px', background: 'transparent', border: 'none', color: 'inherit', fontSize: '16px', cursor: 'pointer', padding: '0', lineHeight: '1' });
		btn.onclick = () => notif.remove();
		notif.appendChild(btn);
		notif.dataset.timeoutId = setTimeout(() => notif.remove(), duration).toString();
		return notif;
	}

	function showConfirmation(elementId, title, message, videoInfo, onConfirm, onCancel, styles) {
		let existing = document.getElementById(elementId);
		if (existing) existing.remove();

		const dialog = document.createElement('div');
		dialog.id = elementId;
		Object.assign(dialog.style, styles);
		document.body.appendChild(dialog);

		const titleElem = document.createElement('h3');
		titleElem.textContent = title;
		titleElem.style.margin = '0 0 10px 0';
		titleElem.style.fontSize = '18px';

		const messageElem = document.createElement('div');
		messageElem.textContent = message;
		messageElem.style.marginBottom = '15px';
		messageElem.style.fontSize = '14px';

		const videoTitleElem = document.createElement('div');
		videoTitleElem.textContent = `视频标题: ${videoInfo.title}`;
		videoTitleElem.style.marginBottom = '5px';
		videoTitleElem.style.fontWeight = 'bold';

		const videoIdElem = document.createElement('div');
		videoIdElem.textContent = `视频ID: ${videoInfo.id}`;
		videoIdElem.style.fontSize = '12px';
		videoIdElem.style.color = '#aaa';
		videoIdElem.style.marginBottom = '15px';

		const buttonsContainer = document.createElement('div');
		buttonsContainer.style.display = 'flex';
		buttonsContainer.style.justifyContent = 'flex-end';
		buttonsContainer.style.gap = '10px';

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = '取消';
		cancelBtn.className = 'gemini-confirmation-btn gemini-confirmation-cancel';
		cancelBtn.onclick = () => {
			dialog.remove();
			if (onCancel) onCancel();
		};

		const confirmBtn = document.createElement('button');
		confirmBtn.textContent = '确认';
		confirmBtn.className = 'gemini-confirmation-btn gemini-confirmation-confirm';
		confirmBtn.onclick = () => {
			dialog.remove();
			if (onConfirm) onConfirm(videoInfo);
		};

		buttonsContainer.appendChild(cancelBtn);
		buttonsContainer.appendChild(confirmBtn);

		dialog.appendChild(titleElem);
		dialog.appendChild(messageElem);
		dialog.appendChild(videoTitleElem);
		dialog.appendChild(videoIdElem);
		dialog.appendChild(buttonsContainer);

		return dialog;
	}

	function copyToClipboard(text) {
    GM_setClipboard(text);
		// navigator.clipboard.writeText(text).catch(() => {
		// 	const ta = document.createElement('textarea');
		// 	ta.value = text;
		// 	ta.style.position = 'fixed'; ta.style.opacity = '0';
		// 	document.body.appendChild(ta);
		// 	ta.select();
		// 	try { document.execCommand('copy'); } catch { }
		// 	document.body.removeChild(ta);
		// });
	}

	function isVideoPage() {
		return window.location.pathname === '/watch' && new URLSearchParams(window.location.search).has('v');
	}

	// 验证YouTube视频ID格式
	function isValidYouTubeVideoId(id) {
		return id && typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id);
	}

	// 检测是否为广告视频
	function isAdVideo(element) {
		return element.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-ad-inline-playback-meta-block, .badge-style-type-ad') !== null;
	}

	// 生成唯一会话ID
	function generateSessionId() {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	// --- 优化后的视频信息提取函数 ---
	function getVideoInfoFromElement(element) {
		console.log('[Gemini Debug] getVideoInfoFromElement called for:', element);

		// 修复问题2：检查缓存是否过期
		const cached = processedElements.get(element);
		if (cached && (Date.now() - cached.timestamp < ELEMENT_CACHE_TIME)) {
			console.log('[Gemini Debug] Element in cache, skipping');
			return null; // 仍在缓存期内
		}

		let videoId = '';
		let videoTitle = '';

		// 优化：优先检查最可能的数据属性
		const possibleIdSources = [
			() => element.dataset?.videoId,
			() => element.getAttribute('video-id'),
			() => {
				// 优化的链接查找 - 使用更精确的选择器
				const link = element.querySelector('a[href*="/watch?v="]');
				if (link) {
					const match = link.href.match(/\/watch\?v=([^&]+)/);
					return match?.[1];
				}
			},
			() => {
				// 优化的缩略图查找
				const img = element.querySelector('img[src*="/vi/"], img[src*="i.ytimg.com"]');
				if (img) {
					const match = img.src.match(/\/vi\/([^\/]+)\//) || img.src.match(/\/([A-Za-z0-9_-]{11})\/[\w]+\.jpg/);
					return match?.[1];
				}
			},
			() => {
				// 正常视频的H3标题链接查找
				const titleLink = element.querySelector('h3 a[href*="/watch?v="]');
				if (titleLink) {
					const match = titleLink.href.match(/\/watch\?v=([^&]+)/);
					return match?.[1];
				}
			}
		];

		// 按优先级尝试获取视频ID
		for (let i = 0; i < possibleIdSources.length; i++) {
			const getSource = possibleIdSources[i];
			const id = getSource();
			console.log(`[Gemini Debug] ID source ${i} returned:`, id);
			if (isValidYouTubeVideoId(id)) {
				videoId = id;
				console.log('[Gemini Debug] Valid video ID found:', videoId);
				break;
			}
		}

		if (!videoId) {
			console.log('[Gemini Debug] No valid video ID found');
		}

		// 优化的标题提取 - 按优先级排序，包含移动端选择器
		const titleSelectors = [
			// 移动端 YouTube (ytm-) 选择器
			'.media-item-headline',
			'.media-item-info h3',
			'h3.ytm-video-meta-headline',
			'h3 span.ytm-video-meta-headline',
			'.compact-media-item-headline',
			'h3 span',  // 移动端标题通常在h3>span中
			// 桌面端 YouTube (ytd-) 选择器
			'#video-title',
			'h3 a[title]',
			'h3 a',  // 正常视频的H3链接
			'h3 .ytd-video-renderer', // 正常视频的H3内容
			'.title[title]',
			'yt-formatted-string[title]',
			'span[title]',
			'.ytd-video-renderer h3', // 正常视频的H3容器
			'.ytd-video-renderer h3 a' // 正常视频的H3链接
		];

		for (let i = 0; i < titleSelectors.length; i++) {
			const selector = titleSelectors[i];
			const titleElement = element.querySelector(selector);
			console.log(`[Gemini Debug] Title selector ${i} "${selector}":`, titleElement);
			if (titleElement) {
				const possibleTitle = titleElement.textContent?.trim() ||
					titleElement.getAttribute('title')?.trim();
				console.log(`[Gemini Debug] Extracted title:`, possibleTitle);
				if (possibleTitle && possibleTitle.length > 5) {
					videoTitle = possibleTitle;
					console.log('[Gemini Debug] Valid title found:', videoTitle);
					break;
				}
			}
		}

		// 验证结果
		if (!isValidYouTubeVideoId(videoId) || !videoTitle) {
			console.log('[Gemini Debug] Validation failed:', {
				videoId,
				isValidId: isValidYouTubeVideoId(videoId),
				videoTitle,
				hasTitleLength: videoTitle?.length
			});
			return null;
		}

		// 更新缓存
		processedElements.set(element, {
			videoId: videoId,
			timestamp: Date.now()
		});

		console.log('[Gemini Debug] Video info extracted successfully:', {
			id: videoId,
			title: videoTitle,
			url: `https://www.youtube.com/watch?v=${videoId}`
		});

		return {
			id: videoId,
			title: videoTitle,
			url: `https://www.youtube.com/watch?v=${videoId}`
		};
	}

	function processVideoSummary(videoInfo) {
		// const prompt = `请分析这个YouTube视频: ${videoInfo.url}\n\n先根据视频内容回答标题的问题(如果有的话)，再提供一个全面的摘要，包括主要观点、关键见解和视频中讨论的重要细节，以结构化的方式分解内容，并包括任何重要的结论或要点。`;
    // Jerry
    const prompt = `Analyze the video at ${videoInfo.url} If the title contains a question, answer it first. Then provide a comprehensive summary in the language of the video (Force Simplified Chinese for any Chinese videos, English for English videos). The summary should clearly present the main points, key insights, and important details, organized in a structured manner, and conclude with any significant takeaways or conclusions discussed in the video.`;

		// 修复问题3：生成唯一会话ID
		const sessionId = generateSessionId();

		GM_setValue(PROMPT_KEY, prompt);
		GM_setValue(TITLE_KEY, videoInfo.title);
		GM_setValue(ORIGINAL_TITLE_KEY, videoInfo.title);
		GM_setValue(TIMESTAMP_KEY, Date.now());
		GM_setValue(ACTION_TYPE_KEY, 'summary');
		GM_setValue(SESSION_ID_KEY, sessionId);

		window.open('https://gemini.google.com/', '_blank');

		// showNotification(
		// 	YOUTUBE_NOTIFICATION_ID,
		// 	`已跳转到 Gemini！\n系统将尝试自动输入提示词并发送请求。\n\n视频: "${videoInfo.title}"\n\n(如果自动操作失败，提示词已复制到剪贴板，请手动粘贴)`,
		// 	YOUTUBE_NOTIFICATION_STYLE,
		// 	10000
		// );

		copyToClipboard(prompt);
	}

	function handleThumbnailButtonClick(event, videoInfo) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			if (event.cancelable) event.returnValue = false;
		}

		if (!videoInfo || !videoInfo.url || !videoInfo.title) {
			showNotification(
				YOUTUBE_NOTIFICATION_ID,
				"无法获取视频信息，请尝试直接在视频页面使用总结功能。",
				{ ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
				5000
			);
			return false;
		}

		if (!isValidYouTubeVideoId(videoInfo.id)) {
			showNotification(
				YOUTUBE_NOTIFICATION_ID,
				`获取到的视频ID格式无效: ${videoInfo.id}\n请尝试直接在视频页面使用总结功能。`,
				{ ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
				5000
			);
			return false;
		}

		// 直接调用处理函数，跳过确认对话框
		processVideoSummary(videoInfo);

		return false;
	}

	// --- 优化后的缩略图按钮添加函数 ---
	function addThumbnailButtons() {
		console.log('[Gemini Debug] addThumbnailButtons called');
		if (isVideoPage()) {
			console.log('[Gemini Debug] On video page, skipping');
			return;
		}

		const isSearchPage = window.location.pathname === '/results';
		const isSubscriptionPage = window.location.pathname === '/feed/subscriptions';
		console.log('[Gemini Debug] Page info:', {
			pathname: window.location.pathname,
			isSearchPage,
			isSubscriptionPage
		});

		// 使用更广泛的选择器来捕获所有视频元素
		const videoElementSelectors = isSearchPage ? [
			'ytd-search ytd-video-renderer',
			'ytd-video-renderer',
			'ytd-video-renderer:has(ytd-thumbnail)',
			'ytd-video-renderer:has(#thumbnail)',
			'ytd-video-renderer:has(h3 a[href*="/watch?v="])'
		] : [
			'ytd-rich-item-renderer',
			'ytd-grid-video-renderer',
			'ytd-compact-video-renderer',
			'ytd-playlist-video-renderer',
			'ytd-video-renderer',
			'ytm-video-with-context-renderer',
			'ytm-compact-video-renderer',
			'ytm-item-section-renderer ytd-grid-video-renderer',
			'ytd-rich-item-renderer:has(ytd-thumbnail)',
			'ytd-grid-video-renderer:has(#thumbnail)',
			'ytd-compact-video-renderer:has(ytd-thumbnail)',
			'ytd-playlist-video-renderer:has(ytd-thumbnail)',
			'ytd-video-renderer:has(ytd-thumbnail)',
			'ytd-rich-item-renderer:has(h3 a[href*="/watch?v="])',
			'ytd-grid-video-renderer:has(h3 a[href*="/watch?v="])',
			'ytd-compact-video-renderer:has(h3 a[href*="/watch?v="])',
			'ytd-playlist-video-renderer:has(h3 a[href*="/watch?v="])',
			'ytd-video-renderer:has(h3 a[href*="/watch?v="])'
		];

		let processedCount = 0;
		const elements = document.querySelectorAll(videoElementSelectors.join(','));
		console.log('[Gemini Debug] Found video elements:', elements.length);

		// 优化：如果元素数量没有变化，且已经处理过相同数量，则跳过
		if (elements.length === lastProcessedCount && elements.length > 0) {
			// 快速验证是否所有元素都已处理
			let allProcessed = true;
			for (const element of elements) {
				if (!element.hasAttribute(THUMBNAIL_PROCESSED_FLAG)) {
					allProcessed = false;
					break;
				}
			}
			if (allProcessed) return;
		}

		elements.forEach(element => {
			// 优化：更快的已处理检查
			if (element.hasAttribute(THUMBNAIL_PROCESSED_FLAG)) {
				processedCount++;
				return;
			}

			// 跳过广告视频
			if (isAdVideo(element)) {
				console.log('[Gemini Debug] Skipping ad video');
				element.setAttribute(THUMBNAIL_PROCESSED_FLAG, 'true');
				return;
			}

			// 优化：更精确的缩略图容器查找
			let thumbnailContainer = element.querySelector('ytd-thumbnail a, ytd-thumbnail, ytm-thumbnail-cover, #thumbnail, a[href*="/watch?v="]:has(img), #thumbnail-container, .media-item-thumbnail-container');
			if (!thumbnailContainer) {
				// 备用：查找第一个包含图片的链接
				thumbnailContainer = element.querySelector('a:has(img)');
			}
			if (!thumbnailContainer) {
				console.log('[Gemini Debug] No thumbnail container found for element:', element);
				return;
			}

			console.log('[Gemini Debug] Found thumbnail container:', thumbnailContainer);

			const videoInfo = getVideoInfoFromElement(element);
			if (!videoInfo) {
				console.log('[Gemini Debug] No video info for element');
				return;
			}

			console.log('[Gemini Debug] Video info:', videoInfo);

			const button = document.createElement('button');
			button.className = THUMBNAIL_BUTTON_CLASS;
			// button.textContent = '📝 总结';
      // Jerry
      button.textContent = '📝 tldr';
			// button.title = '使用Gemini总结此视频';
      button.title = 'Watch Video with Gemini';

			console.log('[Gemini Debug] Created button:', button);

			// 优化：简化事件处理
			const eventHandler = (e) => {
				if (e.type === 'click') {
					return handleThumbnailButtonClick(e, videoInfo);
				}
				e.stopPropagation();
				e.preventDefault();
				return false;
			};

			button.addEventListener('click', eventHandler, { capture: true, passive: false });
			button.addEventListener('mousedown', eventHandler, { capture: true, passive: false });

			// 搜索页面特殊处理
			if (isSearchPage) {
				// 监听视频预览
				const observer = new MutationObserver((mutations) => {
					for (const mutation of mutations) {
						if (mutation.addedNodes.length > 0) {
							for (const node of mutation.addedNodes) {
								if (node.nodeType === Node.ELEMENT_NODE &&
									(node.tagName === 'VIDEO' ||
										node.classList?.contains('ytp-inline-preview-scrim') ||
										node.classList?.contains('html5-video-player'))) {
									// 强制显示按钮
									button.style.opacity = '1';
									button.style.zIndex = '99999';
									button.style.pointerEvents = 'auto';
									button.style.visibility = 'visible';
								}
							}
						}
					}
				});

				observer.observe(element, {
					childList: true,
					subtree: true
				});

				// 保存observer引用以便清理
				button._observer = observer;
			}

			// 确保容器有相对定位
			if (getComputedStyle(thumbnailContainer).position === 'static') {
				thumbnailContainer.style.position = 'relative';
			}
			// 确保容器不会overflow hidden隐藏按钮
			if (getComputedStyle(thumbnailContainer).overflow === 'hidden') {
				thumbnailContainer.style.overflow = 'visible';
			}

			thumbnailContainer.appendChild(button);
			// 强制显示按钮
			button.style.display = 'flex';
			button.style.opacity = '1';
			button.style.visibility = 'visible';
			element.setAttribute(THUMBNAIL_PROCESSED_FLAG, 'true');
			processedCount++;

			console.log('[Gemini Debug] Button appended and styled. Final button styles:', {
				display: button.style.display,
				opacity: button.style.opacity,
				visibility: button.style.visibility,
				position: window.getComputedStyle(button).position,
				zIndex: window.getComputedStyle(button).zIndex,
				inDOM: document.body.contains(button)
			});
		});

		lastProcessedCount = elements.length;
		console.log('[Gemini Debug] Processed:', processedCount, 'Total elements:', elements.length);
	}

	// --- 优化后的智能防抖函数 ---
	function debouncedAddThumbnailButtons() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			addThumbnailButtons();
			debounceTimer = null;
		}, 200); // 200ms防抖，平衡响应性和性能
	}

	// --- 优化后的缩略图按钮系统设置 ---
	function setupThumbnailButtonSystem() {
		// 立即执行一次
		addThumbnailButtons();

		// 优化：使用防抖的MutationObserver
		const obs = new MutationObserver(() => {
			// 只在非视频页面执行
			if (!isVideoPage()) {
				debouncedAddThumbnailButtons();
			}
		});

		obs.observe(document.body, {
			childList: true,
			subtree: true,
			// 优化：只观察必要的属性变化
			attributes: false,
			attributeOldValue: false,
			characterData: false,
			characterDataOldValue: false
		});

		// 优化：保留setInterval作为备用，但频率降低
		setInterval(() => {
			if (!isVideoPage()) {
				// 只在元素数量发生变化时才执行
				const currentElementCount = document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-video-renderer, ytd-video-renderer:has(h3 a[href*="/watch?v="])').length;
				if (currentElementCount !== lastProcessedCount) {
					addThumbnailButtons();
				}
			}
		}, 3000); // 从1500ms增加到3000ms

		// 页面加载完成后执行
		if (document.readyState === 'complete') {
			setTimeout(addThumbnailButtons, 800);
		} else {
			window.addEventListener('load', () => setTimeout(addThumbnailButtons, 800), { once: true });
		}
	}

	// --- 视频页面按钮功能 (修复容器选择，支持移动端) ---
	function addYouTubeActionButtons() {
		if (!isVideoPage()) {
			removeYouTubeActionButtonsIfExists();
			return;
		}

		if (document.getElementById(SUMMARY_BUTTON_ID) || document.getElementById(SUBTITLE_BUTTON_ID)) {
			// 按钮已存在，重置重试计数器
			retryCount = 0;
			return;
		}

		// 检查是否为移动版YouTube
		const isMobile = window.location.hostname.includes('m.youtube.com') ||
			document.querySelector('ytm-app') !== null;

		let subscribeButtonContainer;
		let container;

		if (isMobile) {
			// 移动版YouTube选择器
			subscribeButtonContainer = document.querySelector('ytm-slim-owner-renderer .slim-owner-subscribe-button') ||
				document.querySelector('ytm-subscribe-button-renderer') ||
				document.querySelector('.slim-owner-subscribe-button');

			if (subscribeButtonContainer) {
				// 在移动端，我们需要找到合适的父容器
				container = subscribeButtonContainer.closest('ytm-slim-owner-renderer') ||
					subscribeButtonContainer.parentElement;
			}
		} else {
			// 桌面版YouTube选择器
			subscribeButtonContainer = document.querySelector('#subscribe-button') ||
				document.querySelector('ytd-watch-metadata #subscribe-button') ||
				document.querySelector('ytd-watch-metadata ytd-subscribe-button-renderer')?.parentElement;

			if (subscribeButtonContainer) {
				// 查找Subscribe按钮的父容器（通常是ytd-watch-metadata或其内部的flex容器）
				container = subscribeButtonContainer.parentElement ||
					document.querySelector('ytd-watch-metadata') ||
					document.querySelector('#owner');
			}
		}

		if (!subscribeButtonContainer) {
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				console.log(`YouTube Gemini Script: 无法找到Subscribe按钮容器 (${isMobile ? '移动版' : '桌面版'}), 重试 ${retryCount}/${MAX_RETRIES}`);
			} else if (retryCount === MAX_RETRIES) {
				console.warn('YouTube Gemini Script: 达到最大重试次数，停止尝试添加按钮');
				retryCount++; // 增加以避免重复输出此警告
			}
			return;
		}

		if (!container) {
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				console.log(`YouTube Gemini Script: 无法找到合适的容器来放置按钮, 重试 ${retryCount}/${MAX_RETRIES}`);
			}
			return;
		}

		// 成功找到容器，重置重试计数器
		retryCount = 0;

		const buttonsWrapper = document.createElement('div');
		buttonsWrapper.style.display = 'inline-flex';
		buttonsWrapper.style.alignItems = 'center';
		buttonsWrapper.style.marginLeft = '8px';
		buttonsWrapper.style.gap = '8px';
		buttonsWrapper.style.position = 'relative';
		buttonsWrapper.style.zIndex = '1000';
		buttonsWrapper.style.visibility = 'visible';
		buttonsWrapper.style.opacity = '1';

		const subtitleButton = document.createElement('button');
		subtitleButton.id = SUBTITLE_BUTTON_ID;
		// subtitleButton.textContent = '🎯 生成字幕';  // Jerry
    subtitleButton.textContent = '🎯 subtitle';
		Object.assign(subtitleButton.style, {
			// backgroundColor: '#28a745',  // Jerry
			backgroundColor: 'green',
			color: 'white',
			border: 'none',
			borderRadius: '18px',
			padding: '0 16px',
			margin: '0 8px 0 0',
			cursor: 'pointer',
			fontWeight: '500',
			height: '36px',
			// display: 'inline-flex',
            display: 'none',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '14px',
			zIndex: '100',
			whiteSpace: 'nowrap',
			transition: 'all 0.2s ease'
		});

		const summaryButton = document.createElement('button');
		summaryButton.id = SUMMARY_BUTTON_ID;
		// summaryButton.textContent = '📝 Gemini摘要'; // Jerry
    summaryButton.textContent = '📝 tldr';
		Object.assign(summaryButton.style, {
			// backgroundColor: '#1a73e8',  // Jerry
			backgroundColor: 'green',
			color: 'white',
			border: 'none',
			borderRadius: '18px',
			padding: '0 16px',
			margin: '0',
			cursor: 'pointer',
			fontWeight: '500',
			height: '36px',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '14px',
			zIndex: '100',
			whiteSpace: 'nowrap',
			transition: 'all 0.2s ease'
		});

		const mediaQuery = window.matchMedia('(max-width: 768px)');
		const adjustForMobile = () => {
			if (mediaQuery.matches) {
				subtitleButton.style.fontSize = '12px';
				subtitleButton.style.padding = '0 10px';
				subtitleButton.style.height = '32px';
				summaryButton.style.fontSize = '12px';
				summaryButton.style.padding = '0 10px';
				summaryButton.style.height = '32px';
			} else {
				subtitleButton.style.fontSize = '14px';
				subtitleButton.style.padding = '0 16px';
				subtitleButton.style.height = '36px';
				summaryButton.style.fontSize = '14px';
				summaryButton.style.padding = '0 16px';
				summaryButton.style.height = '36px';
			}
		};

		mediaQuery.addEventListener('change', adjustForMobile);
		// adjustForMobile(); // not adjust Jerry

		subtitleButton.addEventListener('click', handleGenerateSubtitlesClick);
		summaryButton.addEventListener('click', handleSummarizeClick);

		buttonsWrapper.appendChild(subtitleButton);
		buttonsWrapper.appendChild(summaryButton);

		// 修复：将按钮wrapper插入到Subscribe按钮容器之后
		if (subscribeButtonContainer.nextElementSibling) {
			container.insertBefore(buttonsWrapper, subscribeButtonContainer.nextElementSibling);
		} else {
			container.appendChild(buttonsWrapper);
		}

		// 确保按钮可见性
		function ensureVisibility() {
			if (buttonsWrapper && buttonsWrapper.style.display === 'none') {
				buttonsWrapper.style.display = 'inline-flex';
				buttonsWrapper.style.visibility = 'visible';
				buttonsWrapper.style.opacity = '1';
			}
			if (summaryButton && summaryButton.style.display === 'none') {
				summaryButton.style.display = 'inline-flex';
				summaryButton.style.visibility = 'visible';
				summaryButton.style.opacity = '1';
			}
		}

		// MutationObserver 监听样式变化
		const observer = new MutationObserver(ensureVisibility);
		observer.observe(buttonsWrapper, { attributes: true, attributeFilter: ['style', 'class'] });
		observer.observe(summaryButton, { attributes: true, attributeFilter: ['style', 'class'] });

		// setInterval 定期检查，5秒后自动停止
		let checkCount = 0;
		const maxChecks = 10; // 5秒 (10次 × 500ms)
		const visibilityInterval = setInterval(() => {
			checkCount++;
			if (checkCount >= maxChecks || !document.body.contains(buttonsWrapper)) {
				clearInterval(visibilityInterval);
				return;
			}
			ensureVisibility();
		}, 500);

		// 立即执行一次
		ensureVisibility();

		console.log('YouTube Gemini Script: 按钮已成功插入到Subscribe按钮旁边');
	}

	function handleSummarizeClick() {
		const youtubeUrl = window.location.href;
		const urlParams = new URLSearchParams(window.location.search);
		const videoId = urlParams.get('v');

		if (!isValidYouTubeVideoId(videoId)) {
			showNotification(
				YOUTUBE_NOTIFICATION_ID,
				"无法获取有效的视频ID，请确认当前是否在YouTube视频页面。",
				{ ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
				5000
			);
			return;
		}

		const titleSelectors = [
			'h1.ytd-watch-metadata',
			'#video-title',
			'#title h1',
			'.title',
			'yt-formatted-string.ytd-watch-metadata'
		];

		let videoTitle = '';
		for (const selector of titleSelectors) {
			const titleElement = document.querySelector(selector);
			if (titleElement) {
				videoTitle = titleElement.textContent?.trim();
				if (videoTitle) break;
			}
		}

		if (!videoTitle) {
			videoTitle = document.title.replace(/ - YouTube$/, '').trim() || 'Unknown Video';
		}

		const videoInfo = {
			id: videoId,
			title: videoTitle,
			url: youtubeUrl
		};

		processVideoSummary(videoInfo);
	}

	function handleGenerateSubtitlesClick() {
		const youtubeUrl = window.location.href;
		const titleElement = document.querySelector('h1.ytd-watch-metadata, #video-title, #title h1, .title');
		const videoTitle = titleElement?.textContent?.trim() || document.title.replace(/ - YouTube$/, '').trim() || 'Unknown Video';
		let videoDurationInSeconds = 0;
		const durationMeta = document.querySelector('meta[itemprop="duration"]');
		if (durationMeta?.content) {
			const match = durationMeta.content.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
			if (match) {
				videoDurationInSeconds = 0;
				if (match[1]) videoDurationInSeconds += parseInt(match[1].replace('H', '')) * 3600;
				if (match[2]) videoDurationInSeconds += parseInt(match[2].replace('M', '')) * 60;
				if (match[3]) videoDurationInSeconds += parseInt(match[3].replace('S', ''));
			}
		}

		if (videoDurationInSeconds <= 0) {
			showNotification(YOUTUBE_NOTIFICATION_ID, "无法获取视频时长，无法启动字幕任务。", { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' }, 15000);
			return;
		}

		const firstSegmentEnd = Math.min(videoDurationInSeconds, 1200);
		// const prompt = `${youtubeUrl}\n1.不要添加自己的语言\n2.变成简体中文，流畅版本。\n\nYouTube\n请提取此视频从00:00:00到${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)}的完整字幕文本。`;
    // Jerry
    const prompt = `${youtubeUrl} Please extract the full subtitle text of this video from 00:00:00 to ${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)}, without adding your own wording and keeping the transcript in its original language.`;

		// 修复问题3：生成唯一会话ID
		const sessionId = generateSessionId();

		GM_setValue(PROMPT_KEY, prompt);
		GM_setValue(TITLE_KEY, `${videoTitle} (字幕 00:00:00-${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)})`);
		GM_setValue(ORIGINAL_TITLE_KEY, videoTitle);
		GM_setValue(TIMESTAMP_KEY, Date.now());
		GM_setValue(ACTION_TYPE_KEY, 'subtitle');
		GM_setValue(VIDEO_TOTAL_DURATION_KEY, videoDurationInSeconds);
		GM_setValue(FIRST_SEGMENT_END_TIME_KEY, firstSegmentEnd);
		GM_setValue(SESSION_ID_KEY, sessionId);

		showNotification(YOUTUBE_NOTIFICATION_ID, `已跳转到 Gemini 生成字幕: 00:00:00 - ${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)}...\n"${videoTitle}"`, YOUTUBE_NOTIFICATION_STYLE, 15000);
		window.open('https://gemini.google.com/', '_blank');
		copyToClipboard(prompt);
	}

	function removeYouTubeActionButtonsIfExists() {
		[SUMMARY_BUTTON_ID, SUBTITLE_BUTTON_ID].forEach(id => {
			const button = document.getElementById(id);
			if (button) button.remove();
		});
	}

	// --- 页面类型检测函数 ---
	function detectYouTubePageType() {
		if (!document.body) return;

		let isHomePage = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
		let isChannelPage = window.location.pathname.includes('/channel/') ||
			window.location.pathname.includes('/c/') ||
			window.location.pathname.includes('/user/') ||
			window.location.pathname.includes('/@');
		let isSearchPage = window.location.pathname === '/results';

		if (isHomePage) {
			document.body.setAttribute('data-is-home-page', 'true');
			document.body.setAttribute('data-page-subtype', 'home');
		} else {
			document.body.removeAttribute('data-is-home-page');
		}

		if (isChannelPage) {
			document.body.setAttribute('data-page-subtype', 'channels');
		} else if (isSearchPage) {
			document.body.setAttribute('data-page-type', 'search');
		}
	}

	// 修复问题1：添加更可靠的URL变化检测
	function setupUrlChangeDetection() {
		let lastUrl = location.href;

		// 监听popstate事件（浏览器前进/后退）
		window.addEventListener('popstate', function () {
			if (location.href !== lastUrl) {
				lastUrl = location.href;
				handleUrlChange();
			}
		});

		// 监听YouTube的导航事件
		document.addEventListener('yt-navigate-finish', function () {
			if (location.href !== lastUrl) {
				lastUrl = location.href;
				handleUrlChange();
			}
		});

		// 备用：仍然保留MutationObserver
		const urlObserver = new MutationObserver(() => {
			if (location.href !== lastUrl) {
				lastUrl = location.href;
				handleUrlChange();
			}
		});

		urlObserver.observe(document, { subtree: true, childList: true });

		// 处理URL变化的函数
		function handleUrlChange() {
			// 清理缓存和observers
			processedElements.forEach((value, element) => {
				const button = element.querySelector(`.${THUMBNAIL_BUTTON_CLASS}`);
				if (button?._observer) {
					button._observer.disconnect();
				}
			});
			processedElements.clear();
			lastProcessedCount = 0;
			// 重置重试计数器
			retryCount = 0;

			setTimeout(() => {
				detectYouTubePageType();
				if (isVideoPage()) {
					addYouTubeActionButtons();
					// 额外重试确保按钮添加成功
					setTimeout(addYouTubeActionButtons, 1500);
				} else {
					removeYouTubeActionButtonsIfExists();
				}
			}, 800);
		}
	}

	// --- 页面初始化 (优化版) ---
	if (window.location.hostname.includes('youtube.com')) {
		detectYouTubePageType();

		// 修复问题1：使用新的URL检测系统
		setupUrlChangeDetection();

		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			setupThumbnailButtonSystem();
			setTimeout(addYouTubeActionButtons, 800);
			// 额外的重试机制，确保按钮能够添加
			setTimeout(addYouTubeActionButtons, 2000);

			// 优化：减少检查频率，限制重试次数
			setInterval(() => {
				if (isVideoPage()) {
					if (!document.getElementById(SUMMARY_BUTTON_ID) || !document.getElementById(SUBTITLE_BUTTON_ID)) {
						if (retryCount < MAX_RETRIES) {
							addYouTubeActionButtons();
						}
					}
				}
				detectYouTubePageType();
			}, 8000); // 从5000ms增加到8000ms
		} else {
			document.addEventListener('DOMContentLoaded', () => {
				detectYouTubePageType();
				setupThumbnailButtonSystem();
				setTimeout(addYouTubeActionButtons, 800);
			}, { once: true });
		}
	} else if (window.location.hostname.includes('gemini.google.com')) {
		console.log('YouTube to Gemini: Script loaded on Gemini page');

		// Add double-click to close tab functionality (mobile only)
		const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.matchMedia('(max-width: 768px)').matches;
		
		if (isMobileDevice) {
			document.addEventListener('dblclick', () => {
				console.log('YouTube to Gemini: Double-click detected on mobile, closing tab');
				window.close();
			});
			console.log('YouTube to Gemini: Mobile device detected, double-click to close enabled');
		} else {
			console.log('YouTube to Gemini: Desktop device detected, double-click to close disabled');
		}

		// 修复问题3：增加会话ID验证
		const prompt = GM_getValue(PROMPT_KEY);
		const timestamp = GM_getValue(TIMESTAMP_KEY, 0);
		const actionType = GM_getValue(ACTION_TYPE_KEY);
		const sessionId = GM_getValue(SESSION_ID_KEY);

		const referrerIsYouTube = document.referrer.includes('youtube.com');

		console.log('YouTube to Gemini: Checking conditions:', {
			hasPrompt: !!prompt,
			hasActionType: !!actionType,
			hasSessionId: !!sessionId,
			timeDiff: Date.now() - timestamp,
			referrerIsYouTube: referrerIsYouTube,
			referrer: document.referrer
		});

		// Session ID validation is sufficient - referrer check removed because window.open creates new tab without YouTube referrer
		if (prompt && actionType && sessionId &&
			Date.now() - timestamp <= 60000) { // Within 1 minute

			console.log('YouTube to Gemini: All conditions met, will attempt auto-fill in 2 seconds');

			setTimeout(() => {
				console.log('YouTube to Gemini: Starting auto-fill process');

				// Enhanced textarea selectors for Gemini desktop and mobile
				const textarea = document.querySelector(
					'div[contenteditable="true"][data-placeholder],' +
					'div.ql-editor[contenteditable="true"],' +
					'rich-textarea div[contenteditable="true"],' +
					'div[role="textbox"][contenteditable="true"],' +
					'textarea,' +
					'div[contenteditable="true"]'
				);

				if (textarea) {
					console.log('YouTube to Gemini: Found textarea:', {
						element: textarea,
						className: textarea.className,
						tagName: textarea.tagName,
						isContentEditable: textarea.isContentEditable,
						parentElement: textarea.parentElement?.className
					});

					// Focus first to activate the input
					textarea.focus();
					textarea.click();

					// Aggressive text insertion for contenteditable divs
					if (textarea.isContentEditable) {
						// Method 1: Clear and set via multiple methods
						textarea.innerHTML = '';
						textarea.textContent = '';

						// Method 2: Use document.execCommand if available
						try {
							textarea.focus();
							document.execCommand('selectAll', false, null);
							document.execCommand('delete', false, null);
							document.execCommand('insertText', false, prompt);
						} catch (e) {
							console.log('YouTube to Gemini: execCommand failed, using fallback');
						}

						// Method 3: Set textContent as fallback
						textarea.textContent = prompt;

						// Method 4: Insert as paragraph elements (Quill editor style)
						if (!textarea.textContent || textarea.textContent.length === 0) {
							const lines = prompt.split('\n');
							textarea.innerHTML = lines.map(line => `<p>${line || '<br>'}</p>`).join('');
						}

						// Method 5: Try innerText
						if (!textarea.textContent || textarea.textContent.length === 0) {
							textarea.innerText = prompt;
						}
					} else {
						// For regular textarea/input elements
						textarea.value = prompt;
					}

					console.log('YouTube to Gemini: Text set, content:', textarea.textContent?.substring(0, 50));

					// Trigger comprehensive event sequence
					const events = [
						new Event('focus', { bubbles: true }),
						new Event('click', { bubbles: true }),
						new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: prompt }),
						new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: prompt }),
						new Event('change', { bubbles: true, cancelable: true }),
						new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'a' }),
						new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'a' }),
						new Event('blur', { bubbles: true })
					];

					events.forEach(event => {
						try {
							textarea.dispatchEvent(event);
						} catch (e) {
							console.log('YouTube to Gemini: Event dispatch failed:', e);
						}
					});

					// Re-focus after all events
					textarea.focus();

					setTimeout(() => {
						// Verify text was set
						const currentText = textarea.value || textarea.textContent || textarea.innerText;
						console.log('YouTube to Gemini: Current textarea content:', currentText?.substring(0, 100));

						// Enhanced button selectors for both desktop and mobile Gemini
						const sendBtn = document.querySelector(
							'button.send-button,' +
							'button[aria-label*="Send message"],' +
							'button[aria-label*="Send"],' +
							'button[aria-label*="发送"],' +
							'button[aria-label*="提交"],' +
							'.send-button-container button,' +
							'button[mattooltip*="Send"],' +
							'button[data-node-type*="send"]'
						);

						console.log('YouTube to Gemini: Found send button:', {
							button: sendBtn,
							disabled: sendBtn?.disabled,
							ariaDisabled: sendBtn?.getAttribute('aria-disabled'),
							className: sendBtn?.className
						});

						if (sendBtn && !sendBtn.disabled && sendBtn.getAttribute('aria-disabled') !== 'true') {
							sendBtn.click();
							console.log('YouTube to Gemini: Send button clicked');

							// 立即清理，避免重复使用
							setTimeout(() => {
								GM_deleteValue(PROMPT_KEY);
								GM_deleteValue(TITLE_KEY);
								GM_deleteValue(ORIGINAL_TITLE_KEY);
								GM_deleteValue(TIMESTAMP_KEY);
								GM_deleteValue(ACTION_TYPE_KEY);
								GM_deleteValue(VIDEO_TOTAL_DURATION_KEY);
								GM_deleteValue(FIRST_SEGMENT_END_TIME_KEY);
								GM_deleteValue(SESSION_ID_KEY);
							}, 1000);
						} else {
							console.warn('YouTube to Gemini: Could not click send button - please check console logs above');
						}
					}, 800);
				} else {
					console.warn('YouTube to Gemini: Could not find textarea. Available elements:', {
						allContentEditable: document.querySelectorAll('[contenteditable="true"]').length,
						allTextareas: document.querySelectorAll('textarea').length,
						richTextarea: document.querySelector('rich-textarea'),
						qlEditor: document.querySelector('.ql-editor')
					});
				}
			}, 2000);
		} else {
			console.warn('YouTube to Gemini: Conditions not met for auto-fill:', {
				hasPrompt: !!prompt,
				promptPreview: prompt?.substring(0, 50),
				hasActionType: !!actionType,
				actionType: actionType,
				hasSessionId: !!sessionId,
				timeSinceStore: Date.now() - timestamp,
				withinTimeLimit: Date.now() - timestamp <= 60000,
				referrerIsYouTube: referrerIsYouTube,
				actualReferrer: document.referrer
			});
		}
	}
})();