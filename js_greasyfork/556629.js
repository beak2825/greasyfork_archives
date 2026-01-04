// ==UserScript==
// @name LDC OAuth 美化
// @namespace github.com/hmjz100
// @version 1.0.0
// @description 美化 LINUX DO/IDC Flare Connect 的认证页面
// @author Hmjz100
// @license AGPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^http(s)?://connect.(linux.do|idcflare.com)/oauth2/authorize?.*)$/
// @downloadURL https://update.greasyfork.org/scripts/556629/LDC%20OAuth%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/556629/LDC%20OAuth%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
	:root {
		--border-width: 2px;
		--border-radius: 0.5rem;
		--color-background: #ececec;
		--color-background-card: #fff;
		--color-text: #000;
		--color-primary: #444;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--color-background: #161b22;
			--color-background-card: #0d1117;
			--color-text: #fff;
			--color-primary: #ccc;
		}
	}

	*, :after, :before {
		box-sizing: inherit;
		margin: 0;
		padding: 0;
	}

	html {
		display: grid;
		/* 命名区域 */
		grid-template-areas: "main";
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
		/* 防止隐式轨道破坏布局 */
		grid-auto-rows: 0; /* 新增行高 */
		grid-auto-columns: 0; /* 新增列宽 */

		height: 100%;
		margin: 0;
		padding: 0;
		place-items: center;
		position: absolute;
		width: 100%;
		box-sizing: border-box;
		background-color: var(--color-background);
	}
	body.bg-gray-200 {
		grid-area: main;
		color: var(--color-primary);
		background-color: var(--color-background-card);
		border-radius: 2rem;
		padding: 1.25rem 2rem 1.5rem;
		font-family: Helvetica Neue, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji, Tahoma, Arial, sans-serif;
	}
	@media screen and (min-width:450px) {
		body.bg-gray-200 {
			margin: 2rem 0;
			width: 368px
		}
	}
	@media screen and (max-width:450px) {
		body.bg-gray-200 {
			margin: 1rem 0;
			width: 343px
		}
	}
	
	body .text-2xl.font-bold.mb-4 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
	}
	
	body .bg-white.p-6.rounded-lg {
		padding: unset;
		box-shadow: unset;
		background-color: unset;
	}
	
	body .bg-white.p-6.rounded-lg:has(.bg-red-500):has(.bg-blue-500) {
		text-align: center;
	}
	
	body .bg-white.p-6.rounded-lg:has(h2.text-xl.font-bold)::before {
		content: "认证";
		color: var(--color-text);
		font-size: 2em;
		font-weight: 400;
		display: block;
		width: 100%;
		text-align: center;
	}
	body .bg-white.p-6.rounded-lg > h2.text-xl.font-bold {
		display: none;
	}
	
	body .bg-white.p-6.rounded-lg:has(.bg-red-500):has(.bg-blue-500) a[href] {
		border-color: rgba(0, 0, 0, .1);
		border-radius: var(--border-radius);
		border-width: var(--border-width);
		color: #fff;
		display: flex;
		font-size: 1.1rem;
		font-weight: 500;
		justify-content: center;
		align-items: center;
		min-height: 55px;
		padding: .75rem 1rem;
		position: relative;
		transition: all .1s ease-in-out;
	}
	body .bg-white.p-6.rounded-lg:has(.bg-red-500):has(.bg-blue-500) a[href]+a[href] {
		margin-top: 1rem!important;
	}
	
	body .bg-white.p-6.rounded-lg:has(>p>a.text-blue-500) {
		text-align: center;
		
	}
	
	h1, p {
		color: var(--color-text);
		margin-top: 1rem!important;
		padding: 0 1rem!important;
		word-break: break-all;
	}
	
	p {
		font-size: 1.1rem;
		line-height: 2rem;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
