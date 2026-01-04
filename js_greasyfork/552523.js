// ==UserScript==
// @name         Reddit自动中文翻译
// @name:zh-CN   Reddit自动中文翻译
// @namespace    https://greasyfork.org/zh-CN/scripts/552523-redditautochinesetranslator
// @version      2.0.8
// @description  自动将Reddit页面跳转到中文翻译版本，通过添加tl=zh-hans参数。支持开关控制，智能检测页面是否支持翻译。
// @license      MIT
// @author       Qbeenslee
// @copyright    Qbeenslee.com
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/login*
// @exclude      https://www.reddit.com/register*
// @connect      www.reddit.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @homepage     https://github.com/qbeenslee/tampermonkey
// @homepageURL  https://github.com/qbeenslee/tampermonkey
// @supportURL   https://github.com/qbeenslee/tampermonkey/issues
// @contributionURL https://github.com/qbeenslee/tampermonkey/issues
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PCFET0NUWVBFIHN2ZyAgUFVCTElDICctLy9XM0MvL0RURCBTVkcgMS4xLy9FTicgICdodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQnPjxzdmcgaGVpZ2h0PSIxMDAlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iMTAwJSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzZXJpZj0iaHR0cDovL3d3dy5zZXJpZi5jb20vIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggZD0iTTUxMiwyNjAuMDAzYzAsLTMwLjk0NCAtMjUuMDgxLC01Ni4wMjUgLTU2LjAyNSwtNTYuMDI1Yy0xNS4xMDQsMCAtMjguNzg3LDYuMDA1IC0zOC44NjIsMTUuNzIxYy0zOC4yOTYsLTI3LjYzNCAtOTEuMDYxLC00NS40ODUgLTE0OS44MzMsLTQ3LjUzNGwyNS41MjMsLTEyMC4wNzdsODMuMzg1LDE3LjcyNWMxLjAxMywyMS4yMDEgMTguMzc4LDM4LjEyIDM5LjgyNiwzOC4xMmMyMi4xMDYsMCA0MC4wMiwtMTcuOTE5IDQwLjAyLC00MC4wMmMwLC0yMi4xMDEgLTE3LjkxNCwtNDAuMDIgLTQwLjAyLC00MC4wMmMtMTUuNzIyLDAgLTI5LjE4OCw5LjE0OSAtMzUuNzI5LDIyLjMzNWwtOTMuMTEsLTE5Ljc5MWMtMi41ODgsLTAuNTYzIC01LjMwMywtMC4wNTQgLTcuNTI3LDEuMzk2Yy0yLjIyOSwxLjQ0NSAtMy43ODcsMy43MTQgLTQuMzQsNi4zMTJsLTI4LjQ5OSwxMzMuOThjLTU5LjYzMSwxLjY1NyAtMTEzLjI0MywxOS41MyAtMTUyLjAzNCw0Ny40NzFjLTEwLjA2NywtOS42NTMgLTIzLjY5OSwtMTUuNjE4IC0zOC43NDUsLTE1LjYxOGMtMzAuOTQ0LDAgLTU2LjAzLDI1LjA4MSAtNTYuMDMsNTYuMDI1YzAsMjIuNzY3IDEzLjYwMSw0Mi4zMjQgMzMuMTA0LDUxLjA4NmMtMC44NjQsNS41NjkgLTEuMzM3LDExLjIxOSAtMS4zMzcsMTYuOTVjMCw4Ni4xOTQgMTAwLjMzNiwxNTYuMDY4IDIyNC4xMDksMTU2LjA2OGMxMjMuNzcsMCAyMjQuMTA5LC02OS44NzQgMjI0LjEwOSwtMTU2LjA2OGMwLC01LjY5IC0wLjQ2MywtMTEuMzA1IC0xLjMxNCwtMTYuODMzYzE5LjYyLC04LjcxNiAzMy4zMjksLTI4LjM0MSAzMy4zMjksLTUxLjIwM1oiIHN0eWxlPSJmaWxsOiNmMDQ5MjM7ZmlsbC1ydWxlOm5vbnplcm87Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/552523/Reddit%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/552523/Reddit%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ==================== 配置常量 ====================
	const CONFIG = {
		AUTO_TRANSLATE_KEY: 'autoChineseTranslateEnabled', // 本地存储键名
		CONTAINER_CLASS: 'rat-auto-translate-container', // 按钮容器类名
		DEBOUNCE_DELAY: 100, // 防抖延迟（毫秒）
		// 已是中文的subreddit列表（无需翻译）
		CHINESE_SUBREDDITS: [
			'China_irl',
			'weibo_read',
			'USstocks2discuss',
			'dashuju',
			'Chinatown_irl',
			'taiwanica',
			'China_teahouse',
			// 可以继续添加其他中文subreddit
		],
	};

	// ==================== 状态管理 ====================
	// 获取持久化状态
	let autoTranslateEnabled = GM_getValue(CONFIG.AUTO_TRANSLATE_KEY, false);

	// ==================== URL管理工具 ====================
	const urlManager = {
		// 检查当前是否在列表页（首页或subreddit列表页）
		isListPage() {
			const {pathname} = globalThis.location;
			// 首页
			if (pathname === '/' || pathname === '') {
				return true;
			}

			// Subreddit列表页（不包含帖子详情页）
			if (/^\/r\/[^/]+(\/)?$/.test(pathname)) {
				return true;
			}

			return false;
		},

		// 检查当前是否在中文subreddit中
		isChineseSubreddit() {
			const match = globalThis.location.pathname.match(/^\/r\/([^/]+)\//);
			if (!match) {
				return false;
			}

			const subredditName = match[1];
			return CONFIG.CHINESE_SUBREDDITS.includes(subredditName);
		},

		// 检查URL是否有show=original参数
		hasShowOriginal() {
			return new URLSearchParams(globalThis.location.search).has('show');
		},

		// 检查URL是否有tl=zh-hans参数
		hasTranslation() {
			return new URLSearchParams(globalThis.location.search).get('tl') === 'zh-hans';
		},

		// 获取去除show=original参数的URL
		getUrlWithoutShowOriginal() {
			const url = new URL(globalThis.location.href);
			const parameters = new URLSearchParams(url.search);
			parameters.delete('show');
			url.search = parameters.toString();
			return url.toString();
		},

		// 获取添加tl=zh-hans参数的URL
		getUrlWithTranslation() {
			const url = new URL(globalThis.location.href);
			const parameters = new URLSearchParams(url.search);
			parameters.delete('show'); // 移除show参数避免冲突
			parameters.set('tl', 'zh-hans');
			url.search = parameters.toString();
			return url.toString();
		},

		// 获取去除tl参数的URL
		getUrlWithoutTranslation() {
			const url = new URL(globalThis.location.href);
			const parameters = new URLSearchParams(url.search);
			parameters.delete('tl');
			url.search = parameters.toString();
			return url.toString();
		},
	};

	// ==================== 样式注入 ====================
	// 添加CSS样式
	GM_addStyle(`
		.rat-auto-translate-container {
			display: flex;
			align-items: center;
			margin-left: 6em;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			gap: 8px;
		}

		.rat-auto-translate-label {
			font-size: 14px;
			font-weight: 500;
			color: var(--newCommunityTheme-bodyText);
			white-space: nowrap;
		}

		.rat-auto-translate-switch {
			position: relative;
			display: inline-block;
			width: 51px;
			height: 31px;
		}

		.rat-auto-translate-switch input {
			opacity: 0;
			width: 0;
			height: 0;
		}

		.rat-auto-translate-slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ccc;
			transition: .4s;
			border-radius: 34px;
		}

		.rat-auto-translate-slider:before {
			position: absolute;
			content: "";
			height: 27px;
			width: 27px;
			left: 2px;
			bottom: 2px;
			background-color: white;
			transition: .4s;
			border-radius: 50%;
			box-shadow: 0 1px 3px rgba(0,0,0,0.3);
		}

		input:checked + .rat-auto-translate-slider {
			background-color: #4CD964;
		}

		input:checked + .rat-auto-translate-slider:before {
			transform: translateX(20px);
		}

		/* 禁用状态 */
		.rat-auto-translate-container.rat-disabled {
			opacity: 0.5;
		}

		.rat-auto-translate-container.rat-disabled .rat-auto-translate-slider {
			cursor: not-allowed;
		}

		.rat-auto-translate-container.rat-disabled input {
			pointer-events: none;
		}
	`);

	// ==================== 翻译检测 ====================
	// 检查页面是否支持翻译
	function checkTranslationAvailable(callback) {
		const testUrl = urlManager.getUrlWithTranslation();

		GM_xmlhttpRequest({
			method: 'GET',
			url: testUrl,
			onload(response) {
				const isTranslated = validateTranslationResponse(response, testUrl);
				console.log(`翻译检查: ${testUrl}, 最终URL: ${response.finalUrl || testUrl}, 支持翻译: ${isTranslated}`);
				callback(isTranslated);
			},
			onerror() {
				console.log(`翻译检查失败: ${testUrl}`);
				callback(false);
			},
		});
	}

	// 验证翻译响应是否有效
	function validateTranslationResponse(response, testUrl) {
		const finalUrl = response.finalUrl || testUrl;
		const finalUrlObject = new URL(finalUrl);
		const pageContent = response.responseText;

		// 检查URL参数和状态码
		const hasTranslationParameter = finalUrlObject.searchParams.get('tl') === 'zh-hans';
		const isValidStatus = response.status === 200;

		// 检查是否重定向到错误页面
		const isNoThinkPage = finalUrl.includes('/no_think')
			|| pageContent.includes('/no_think')
			|| pageContent.includes('no_think');

		// 检查是否有网络错误
		const hasNetworkError = response.status === 0
			|| pageContent.includes('ERR_TUNNEL_CONNECTION_FAILED')
			|| pageContent.includes('net::ERR_');

		// 检查是否是有效的Reddit帖子页面
		const hasPostContent = pageContent.includes('data-testid="post-container"')
			|| pageContent.includes('class="Post"')
			|| (pageContent.includes('post-title') && pageContent.includes('Comments'));

		// 检查页面是否包含翻译标识
		const hasTranslationInTitle = pageContent.includes('>Translated<')
			|| pageContent.includes('翻译')
			|| pageContent.includes('translated');

		// 检查页面语言属性
		const hasChineseLangAttr = pageContent.includes('lang="zh"')
			|| pageContent.includes('lang="zh-CN"')
			|| pageContent.includes('lang="zh-Hans"');

		// 输出调试信息
		console.log('Translation check debug info:', {
			status: response.status,
			finalUrl,
			hasTranslationParam: hasTranslationParameter,
			isNoThinkPage,
			hasNetworkError,
			hasPostContent,
			hasTranslationInTitle,
			hasChineseLangAttr,
		});

		// 验证逻辑：必须满足所有条件
		return isValidStatus
			&& hasTranslationParameter
			&& !isNoThinkPage
			&& !hasNetworkError
			&& hasPostContent
			&& (hasTranslationInTitle || hasChineseLangAttr || pageContent.includes('tl=zh-hans'));
	}

	// ==================== UI组件管理 ====================
	// 注入按钮到页面
	function injectButton() {
		// 如果按钮已存在，先移除
		const existingContainer = document.querySelector(`.${CONFIG.CONTAINER_CLASS}`);
		if (existingContainer) {
			existingContainer.remove();
		}

		// 查找导航栏和logo
		const nav = document.querySelector('nav');
		if (!nav) {
			console.log('未找到导航栏');
			return;
		}

		const logo = nav.querySelector('a[href="/"]');
		if (!logo) {
			console.log('未找到Reddit logo');
			return;
		}

		// 创建按钮容器
		const container = document.createElement('div');
		container.className = CONFIG.CONTAINER_CLASS;

		// 创建标签
		const label = document.createElement('span');
		label.className = 'rat-auto-translate-label';
		label.textContent = '自动翻译';

		// 创建Switch开关
		const switchContainer = document.createElement('label');
		switchContainer.className = 'rat-auto-translate-switch';

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';

		const slider = document.createElement('span');
		slider.className = 'rat-auto-translate-slider';

		// 组装Switch
		switchContainer.append(checkbox);
		switchContainer.append(slider);

		// 组装容器
		container.append(label);
		container.append(switchContainer);

		// 插入到logo后面
		logo.parentNode.insertBefore(container, logo.nextSibling);

		// 更新按钮状态
		updateButtonState(container, checkbox, label);

		// 添加事件监听
		setupEventListeners(container, checkbox, label);
	}

	// 设置按钮为禁用状态
	function setButtonDisabled(container, checkbox, label) {
		checkbox.checked = false;
		container.classList.add('rat-disabled');
		label.textContent = '无法翻译';
		// 注意：这里不自动关闭autoTranslateEnabled，让用户知道他们确实开启了自动翻译
		// 只是当前页面不支持翻译而已
	}

	// 更新按钮状态
	function updateButtonState(container, checkbox, label) {
		// 检查是否是列表页
		if (urlManager.isListPage()) {
			checkbox.checked = false;
			container.classList.add('rat-disabled');
			label.textContent = '不翻译该页面';
			return;
		}

		// 检查是否是中文subreddit
		if (urlManager.isChineseSubreddit()) {
			checkbox.checked = false;
			container.classList.add('rat-disabled');
			label.textContent = '已是中文';
			return;
		}

		if (autoTranslateEnabled) {
			if (urlManager.hasTranslation()) {
				// 开启状态：当前已在翻译页面
				checkbox.checked = true;
				container.classList.remove('rat-disabled');
				label.textContent = '自动翻译';
			} else {
				// 检查翻译可用性
				container.classList.add('rat-disabled');
				label.textContent = '检查中...';

				checkTranslationAvailable(hasTranslation => {
					if (hasTranslation) {
						// 有翻译结果，跳转到翻译页面
						const translatedUrl = urlManager.getUrlWithTranslation();
						console.log(`跳转到翻译页面: ${translatedUrl}`);
						globalThis.location.href = translatedUrl;
					} else {
						// 无翻译结果，禁用按钮
						setButtonDisabled(container, checkbox, label);
					}
				});
			}
		} else {
			// 关闭状态
			checkbox.checked = false;
			container.classList.remove('rat-disabled');
			label.textContent = '自动翻译';
		}
	}

	// 设置事件监听
	function setupEventListeners(container, checkbox, label) {
		checkbox.addEventListener('change', function () {
			// 如果是中文subreddit，不处理切换
			if (urlManager.isChineseSubreddit()) {
				this.checked = false;
				return;
			}

			// 如果是列表页，不处理切换
			if (urlManager.isListPage()) {
				this.checked = false;
				return;
			}

			if (this.checked) {
				// 切换到开启
				console.log('切换到开启状态');
				GM_setValue(CONFIG.AUTO_TRANSLATE_KEY, true);
				autoTranslateEnabled = true;

				checkTranslationAvailable(hasTranslation => {
					if (hasTranslation) {
						const translatedUrl = urlManager.getUrlWithTranslation();
						console.log(`跳转到翻译页面: ${translatedUrl}`);
						globalThis.location.href = translatedUrl;
					} else {
						// 无翻译结果，禁用按钮
						setButtonDisabled(container, checkbox, label);
					}
				});
			} else {
				// 切换到关闭
				console.log('切换到关闭状态');
				GM_setValue(CONFIG.AUTO_TRANSLATE_KEY, false);
				autoTranslateEnabled = false;

				if (urlManager.hasTranslation()) {
					const originalUrl = urlManager.getUrlWithoutTranslation();
					console.log(`跳转到原始页面: ${originalUrl}`);
					globalThis.location.href = originalUrl;
				}
			}
		});
	}

	// ==================== 初始化逻辑 ====================
	// 处理URL参数
	function handleUrlParameters() {
		// 检查是否有show=original参数，有则去除
		if (urlManager.hasShowOriginal()) {
			const cleanUrl = urlManager.getUrlWithoutShowOriginal();
			console.log(`检测到show=original参数，跳转到: ${cleanUrl}`);
			globalThis.location.href = cleanUrl;
			return true;
		}

		return false;
	}

	// 初始化函数
	function init() {
		console.log('Reddit自动中文翻译脚本初始化');

		// 处理URL参数
		if (handleUrlParameters()) {
			return; // 如果发生了跳转，等待页面重新加载
		}

		// 注入按钮
		injectButton();

		// 防抖处理按钮重新注入
		let debounceTimer = null;
		const debouncedInject = () => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				if (!document.querySelector(`.${CONFIG.CONTAINER_CLASS}`)) {
					console.log('重新注入按钮');
					injectButton();
				}
			}, CONFIG.DEBOUNCE_DELAY);
		};

		// 使用MutationObserver监听DOM变化
		const observer = new MutationObserver(debouncedInject);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// 监听URL变化
		globalThis.addEventListener('popstate', debouncedInject);
		globalThis.addEventListener('hashchange', debouncedInject);
	}

	// 启动脚本
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
