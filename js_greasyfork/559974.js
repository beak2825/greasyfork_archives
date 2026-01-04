// ==UserScript==
// @name         TorrentBD GitHub Dark Theme
// @namespace    https://github.com/blackwall-erebus
// @version      0.1.7
// @description  Pure GitHub dark theme for TorrentBD
// @author       AnaDeArmas
// @credit 	     BENZiN & MoNu69
// @match       https://www.torrentbd.com/*
// @match       https://www.torrentbd.me/*
// @match       https://www.torrentbd.net/*
// @match       https://www.torrentbd.org/*
// @run-at      document-start
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559974/TorrentBD%20GitHub%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/559974/TorrentBD%20GitHub%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const css = `
	:root:root .dark-scheme {
		--body-bg: #010409;
		--main-bg: #0d1117;
		--nav-bg: #161b22;
		--text-color: #c9d1d9;
		--text-color-offset: #ffffff;
		--modal-color: #c1cdd2;
		--nav-alt-bg: #1f6feb;
		--border-color: #30363d;
		--link-color: #58a6ff;
		--link-hover-color: #1f6feb;
		--link-sp1-color: #8b949e;
		--link-sp1-hover-color: #58a6ff;
		--link-sp2-color: #1f6feb;
		--link-sp3-color: #388bfd;
		--btn-1-color: #238636;
		--btn-2-color: #2ea043;
		--progress-bar-bg: #0d1117;
		--success-color: #238636;
		--danger-color: #da3633;
		--warning-color: #d29922;
	}

	body.dark-scheme::-webkit-scrollbar,
	body.dark-scheme ::-webkit-scrollbar {
		width: 10px !important;
		height: 10px !important;
	}

	body.dark-scheme::-webkit-scrollbar-track,
	body.dark-scheme ::-webkit-scrollbar-track {
		background-color: var(--body-bg) !important;
	}

	body.dark-scheme::-webkit-scrollbar-thumb,
	body.dark-scheme ::-webkit-scrollbar-thumb {
		background-color: #484f58 !important;
		border-radius: 6px !important;
		border: 2px solid var(--body-bg) !important;
	}

	body.dark-scheme::-webkit-scrollbar-thumb:hover,
	body.dark-scheme ::-webkit-scrollbar-thumb:hover {
		background-color: #6e7681 !important;
	}

	body.dark-scheme {
		background: var(--body-bg) !important;
		color: var(--text-color) !important;
	}

	body.dark-scheme .card-panel {
		margin-top: 0 !important;
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
	}

	/* Torrent names in white */
	body.dark-scheme .torrent-name a {
		color: var(--text-color-offset) !important;
	}

	body.dark-scheme .torrent-name a:hover {
		color: var(--link-color) !important;
	}

	/* Transparent buttons with green borders */
	body.dark-scheme .btn,
	body.dark-scheme .btn-large {
		background-color: transparent !important;
		color: var(--btn-1-color) !important;
		border: 1px solid var(--btn-1-color) !important;
	}

	body.dark-scheme .btn:hover,
	body.dark-scheme .btn-large:not(#kuddus-trigger):hover {
		background-color: rgba(35, 134, 54, 0.1) !important;
		border-color: var(--btn-2-color) !important;
		color: var(--btn-2-color) !important;
	}

	body.dark-scheme .btn i,
	body.dark-scheme .btn-large i {
		color: var(--btn-1-color) !important;
	}

	body.dark-scheme .btn:hover i,
	body.dark-scheme .btn-large:hover i {
		color: var(--btn-2-color) !important;
	}

	body.dark-scheme .blue.darken-2,
	body.dark-scheme .blue.darken-3,
	body.dark-scheme .cyan.darken-2,
	body.dark-scheme .green.darken-1,
	body.dark-scheme .green.darken-2,
	body.dark-scheme .light-blue.darken-3,
	body.dark-scheme .teal,
	body.dark-scheme .teal.darken-1,
	body.dark-scheme .teal.darken-3 {
		background-color: transparent !important;
		color: var(--btn-1-color) !important;
		border: 1px solid var(--btn-1-color) !important;
	}

	body.dark-scheme .blue.darken-2:hover,
	body.dark-scheme .cyan.darken-2:hover,
	body.dark-scheme .teal.darken-1:hover,
	body.dark-scheme .light-blue.darken-3:hover {
		background-color: rgba(35, 134, 54, 0.1) !important;
		border-color: var(--btn-2-color) !important;
		color: var(--btn-2-color) !important;
	}

	body.dark-scheme .red.lighten-2,
	body.dark-scheme .red.lighten-3 {
		background-color: transparent !important;
		color: var(--danger-color) !important;
		border: 1px solid var(--danger-color) !important;
	}

	body.dark-scheme .red.lighten-2:hover,
	body.dark-scheme .red.lighten-3:hover {
		background-color: rgba(218, 54, 51, 0.1) !important;
		border-color: #b62324 !important;
		color: #b62324 !important;
	}

	body.dark-scheme .teal.lighten-2 {
		background-color: transparent !important;
		color: var(--link-sp2-color) !important;
		border: 1px solid var(--link-sp2-color) !important;
	}

	body.dark-scheme .teal.lighten-2:hover {
		background-color: rgba(31, 111, 235, 0.1) !important;
		border-color: var(--link-hover-color) !important;
		color: var(--link-hover-color) !important;
	}

	body.dark-scheme .orange.lighten-2 {
		background-color: transparent !important;
		color: var(--warning-color) !important;
		border: 1px solid var(--warning-color) !important;
	}

	body.dark-scheme .orange.lighten-2:hover {
		background-color: rgba(210, 153, 34, 0.1) !important;
		border-color: #bb8009 !important;
		color: #bb8009 !important;
	}

	/* NAT status indicator - filled green */
	body.dark-scheme .indicator-dot.green.darken-1 {
		background-color: var(--btn-1-color) !important;
		border-color: var(--btn-1-color) !important;
	}

	/* NAT closed/strict status - filled red */
	body.dark-scheme .indicator-dot.blue-grey.darken-2 {
		background-color: var(--danger-color) !important;
		border-color: var(--danger-color) !important;
	}

	/* Language filter pills and dropdowns */
	body.dark-scheme .tradiopill label {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .tradiopill input:checked + label {
		background-color: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
		border-color: var(--link-sp2-color) !important;
	}

	body.dark-scheme .tradiopill-select,
	body.dark-scheme .select-override {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .tradiopill-select option,
	body.dark-scheme .select-override option {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
	}

	/* Pagination Jump to styling - match button to input */
	body.dark-scheme .pagireborn-num {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .pagireborn-btn {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .pagireborn-btn:hover {
		background-color: rgba(31, 111, 235, 0.1) !important;
		border-color: var(--link-sp2-color) !important;
		color: var(--link-color) !important;
	}

	body.dark-scheme a {
		color: var(--link-color) !important;
	}

	body.dark-scheme a:hover {
		color: var(--link-hover-color) !important;
		text-decoration: underline !important;
	}

	body.dark-scheme .cnav-menu-item span {
		color: var(--link-color) !important;
		cursor: pointer;
	}

	body.dark-scheme .cnav-menu-item:hover span {
		color: var(--link-hover-color) !important;
	}

	body.dark-scheme .main-header,
	body.dark-scheme .sub-header,
	body.dark-scheme .fixed-pos {
		background: var(--nav-bg) !important;
		border-bottom: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .main-header--icon,
	body.dark-scheme .sub-header--title {
		color: var(--text-color) !important;
	}

	body.dark-scheme .blue-grey.darken-2 {
		background-color: var(--main-bg) !important;
	}

	body.dark-scheme input[type="text"],
	body.dark-scheme input[type="password"],
	body.dark-scheme input[type="email"],
	body.dark-scheme input[type="url"],
	body.dark-scheme input[type="time"],
	body.dark-scheme input[type="date"],
	body.dark-scheme input[type="datetime-local"],
	body.dark-scheme input[type="tel"],
	body.dark-scheme input[type="number"],
	body.dark-scheme textarea.materialize-textarea,
	body.dark-scheme select,
	body.dark-scheme .form-control {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
		color: var(--text-color) !important;
	}

	/* Transparent search input with backdrop blur */
	body.dark-scheme input[type="search"],
	body.dark-scheme #kuddus-trigger {
		background-color: rgba(13, 17, 23, 0.4) !important;
		border: 1px solid rgba(13, 17, 23, 0.4) !important;
		color: var(--text-color) !important;
		backdrop-filter: blur(8px) !important;
		-webkit-backdrop-filter: blur(8px) !important;
	}

	body.dark-scheme input[type="search"]:focus,
	body.dark-scheme #kuddus-trigger:focus {
		background-color: rgba(13, 17, 23, 0.6) !important;
		border-color: var(--link-sp2-color) !important;
		box-shadow: 0 0 0 3px rgba(13, 17, 23, 0.4) !important;
	}

	/* Search container/wrapper transparency */
	body.dark-scheme .search-wrapper,
	body.dark-scheme .search-container,
	body.dark-scheme #kuddus-wrapper {
		background-color: rgba(13, 17, 23, 0.4) !important;
		backdrop-filter: blur(10px) !important;
		-webkit-backdrop-filter: blur(10px) !important;
	}

	/* Kuddus search results container */
	body.dark-scheme #kuddus-results-container {
		background-color: rgba(13, 17, 23, 0.4) !important;
		backdrop-filter: blur(0px) !important;
		-webkit-backdrop-filter: blur(0px) !important;
	}

	body.dark-scheme input[type="text"]:focus,
	body.dark-scheme input[type="password"]:focus,
	body.dark-scheme input[type="email"]:focus,
	body.dark-scheme input[type="url"]:focus,
	body.dark-scheme input[type="time"]:focus,
	body.dark-scheme input[type="date"]:focus,
	body.dark-scheme input[type="datetime-local"]:focus,
	body.dark-scheme input[type="tel"]:focus,
	body.dark-scheme input[type="number"]:focus,
	body.dark-scheme textarea.materialize-textarea:focus,
	body.dark-scheme select:focus,
	body.dark-scheme .form-control:focus {
		border-color: var(--link-sp2-color) !important;
		box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3) !important;
	}

	body.dark-scheme input[type="text"]:focus:not([readonly]) + label,
	body.dark-scheme input[type="password"]:focus:not([readonly]) + label,
	body.dark-scheme input[type="email"]:focus:not([readonly]) + label,
	body.dark-scheme textarea.materialize-textarea:focus:not([readonly]) + label {
		color: var(--link-sp2-color) !important;
	}

	body.dark-scheme [type="checkbox"].filled-in:checked + label::after {
		border: 2px solid var(--btn-1-color) !important;
		background-color: var(--btn-1-color) !important;
	}

	body.dark-scheme [type="checkbox"]:checked + label::before {
		border-right: 2px solid var(--btn-1-color) !important;
		border-bottom: 2px solid var(--btn-1-color) !important;
	}

	body.dark-scheme [type="radio"].with-gap:checked + label::before,
	body.dark-scheme [type="radio"].with-gap:checked + label::after,
	body.dark-scheme [type="radio"]:checked + label::after {
		border: 2px solid var(--link-sp2-color) !important;
		background-color: var(--link-sp2-color) !important;
	}

	body.dark-scheme .pagination li.active,
	body.dark-scheme .paginator.active {
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}

	body.dark-scheme .dropdown-content {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .dropdown-content li:hover,
	body.dark-scheme .dropdown-content li.active,
	body.dark-scheme .dropdown-content li.selected {
		background-color: rgba(31, 111, 235, 0.15) !important;
	}

	body.dark-scheme .tabs .tab a {
		color: var(--link-sp1-color) !important;
	}

	body.dark-scheme .tabs .tab a:hover,
	body.dark-scheme .tabs .tab a.active {
		color: var(--text-color) !important;
	}

	body.dark-scheme .tabs .indicator {
		background-color: var(--link-sp2-color) !important;
	}

	body.dark-scheme table.striped > tbody > tr:nth-child(2n+1) {
		background-color: var(--main-bg) !important;
	}

	body.dark-scheme .collection,
	body.dark-scheme .collection .collection-item {
		background-color: var(--main-bg) !important;
		border-color: var(--border-color) !important;
	}

	body.dark-scheme .collection a.collection-item:hover {
		background-color: rgba(31, 111, 235, 0.1) !important;
	}

	body.dark-scheme .progress {
		background-color: rgba(31, 111, 235, 0.2) !important;
	}

	body.dark-scheme .progress .determinate {
		background-color: var(--link-sp2-color) !important;
	}

	body.dark-scheme .picker__box {
		background: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .picker__date-display {
		background-color: var(--link-sp2-color) !important;
	}

	body.dark-scheme .picker__weekday-display {
		background-color: var(--nav-bg) !important;
	}

	body.dark-scheme .picker__day--selected,
	body.dark-scheme .picker__day--selected:hover {
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}

	body.dark-scheme .picker__day.picker__day--today {
		color: var(--link-sp2-color) !important;
	}

	body.dark-scheme .modal {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .toast {
		background-color: var(--nav-bg) !important;
		color: var(--text-color) !important;
	}

	body.dark-scheme hr {
		border-color: var(--border-color) !important;
	}

	body.dark-scheme .card,
	body.dark-scheme .card-action {
		background-color: var(--main-bg) !important;
		border-color: var(--border-color) !important;
	}

	body.dark-scheme .switch label input[type="checkbox"]:checked + .lever {
		background-color: rgba(35, 134, 54, 0.5) !important;
	}

	body.dark-scheme .switch label input[type="checkbox"]:checked + .lever::after {
		background-color: var(--btn-1-color) !important;
	}

	body.dark-scheme .sidenav {
		background-color: var(--main-bg) !important;
		border-right: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .sidenav li:hover {
		background-color: rgba(31, 111, 235, 0.1) !important;
	}

	body.dark-scheme .collapsible,
	body.dark-scheme .collapsible-header,
	body.dark-scheme .collapsible-body {
		background-color: var(--main-bg) !important;
		border-color: var(--border-color) !important;
	}

	body.dark-scheme img:is([src*="smilies/hello.gif"],
	                       [src*="smilies/sticker-sq-yes.png"],
	                       [src*="smilies/sticker-sc-laugh.png"]) {
		filter: brightness(0.9) contrast(1.1);
	}

	body.dark-scheme .z-depth-1 {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
	}

	body.dark-scheme .z-depth-2 {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) !important;
	}

	/* Completion count styling */
	body.dark-scheme .orange100,
	body.dark-scheme .inline-item.orange100 {
		color: var(--warning-color) !important;
	}

	/* Torrent table completion column (9th column = completion count) */
	body.dark-scheme table tbody tr td:nth-child(9):not([class*="torrent-name"]):not([class*="tab-sortable"]) {
		color: var(--warning-color) !important;
	}

	/* Also target completion by checking if it's the last numeric cell in torrent rows */
	body.dark-scheme table tbody tr:has(td.torrent-name) td:last-child:not([colspan]):not(.torr-stats-cell) {
		color: var(--warning-color) !important;
	}

	/* Download icon styling */
	body.dark-scheme table tr td a[href*="download.php"] i.material-icons {
		color: var(--btn-1-color) !important;
	}

	body.dark-scheme table tr td a[href*="download.php"]:hover i.material-icons {
		color: var(--btn-2-color) !important;
	}

	/* Forum page title styling */
	body.dark-scheme .frtt,
	body.dark-scheme .forum-page-title {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
		border-left: 3px solid var(--link-sp2-color) !important;
		padding: 15px !important;
		margin-bottom: 20px !important;
	}

	body.dark-scheme .frtt h6,
	body.dark-scheme .forum-page-title h6 {
		color: var(--text-color-offset) !important;
		margin: 0 !important;
	}

	/* Shoutbox styling */
	body.dark-scheme #shout-send-container {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
		padding: 0 !important;
		margin: 0 !important;
	}

	body.dark-scheme .shoutbox-text {
		background-color: var(--body-bg) !important;
		border: 1px solid var(--border-color) !important;
		color: var(--text-color) !important;
		padding-left: 12px !important;
		padding-right: 12px !important;
	}

	body.dark-scheme .shoutbox-text:focus {
		border-color: var(--link-sp2-color) !important;
		box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3) !important;
		outline: none !important;
	}

	body.dark-scheme #shout-ibb-container {
		background-color: transparent !important;
		border: none !important;
	}

	body.dark-scheme .inline-submit-btn {
		background-color: transparent !important;
		color: var(--text-color) !important;
		border: none !important;
		transition: transform 0.2s ease !important;
	}

	body.dark-scheme .inline-submit-btn:hover {
		background-color: transparent !important;
		color: var(--text-color) !important;
		transform: translateY(-2px) !important;
	}

	body.dark-scheme .inline-submit-btn i,
	body.dark-scheme .inline-submit-btn svg {
		color: var(--text-color) !important;
		transition: color 0.2s ease !important;
	}

	body.dark-scheme .inline-submit-btn:hover i,
	body.dark-scheme .inline-submit-btn:hover svg {
		color: var(--link-color) !important;
	}

	body.dark-scheme #urlWindow {
		background-color: var(--main-bg) !important;
		border: 1px solid var(--border-color) !important;
	}

	body.dark-scheme .url-inputs {
		background-color: var(--body-bg) !important;
		border: 1px solid var(--border-color) !important;
		color: var(--text-color) !important;
		padding-left: 12px !important;
		padding-right: 12px !important;
	}

	body.dark-scheme .url-inputs:focus {
		border-color: var(--link-sp2-color) !important;
		box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3) !important;
		outline: none !important;
	}

	@media (max-width: 991px) {
		body.dark-scheme .cnav {
			top: auto;
			bottom: 0;
			box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.3);
		}
	}
	`;

	if (typeof GM_addStyle !== 'undefined') {
		GM_addStyle(css);
	} else {
		const styleNode = document.createElement('style');
		styleNode.textContent = css;
		(document.head || document.documentElement).appendChild(styleNode);
	}
})();