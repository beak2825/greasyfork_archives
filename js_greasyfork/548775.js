// ==UserScript==
// @name            BrockDB Modernizer
// @name:ja         BrockDB Modernizer
// @name:vi         BrockDB Modernizer
// @namespace       https://t7ru.link/
// @version         1.33
// @description     Modernizes the BrockDB (Student Self Serve) site with a less crappy UI, proper Brock University branding, and fully functional mobile navigation.
// @description:ja  このスクリプトはBrockDB（Student Self Serve）の古臭いUIを刷新し、ブロック大学のブランド風に整えてモバイルでも快適に動作させる。
// @description:vi  Hiện đại hóa trang BrockDB (Student Self Serve) với giao diện nó đỡ tệ hơn, mang đúng thương hiệu của Đại học Brock, và điều khiển trên điện thoại hoạt động đầy đủ.
// @author          t7ru
// @match           https://my.brocku.ca/BrockDB/*
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/548775/BrockDB%20Modernizer.user.js
// @updateURL https://update.greasyfork.org/scripts/548775/BrockDB%20Modernizer.meta.js
// ==/UserScript==
(function() {
	'use strict';

	const meta = document.createElement('meta');
	meta.name = 'viewport';
	meta.content = 'width=device-width, initial-scale=1';
	document.head.insertBefore(meta, document.head.firstChild);

	const style = document.createElement('style');
	style.innerHTML = `
/* These are clones of https://brocku.ca//wp-content/themes/brocku-mu-base/css/fonts/ */
@font-face {
    font-family: 'Bliss Light';
    src: url('https://bin.t7ru.link/uploads/a01900d7a5d2') format('woff2'),
         url('https://bin.t7ru.link/uploads/ce6e18e964c0') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Bliss Bold';
    src: url('https://bin.t7ru.link/uploads/387247d5b81a') format('woff2'),
         url('https://bin.t7ru.link/uploads/ffe06925fa11') format('woff');
    font-weight: normal;
    font-style: normal;
}

:root {
    --black: #000;
    --gray: #f4f4f4;
    --gray-dark: #212124;
    --white: #fff;
    --brock-red: #c00;
    --brock-red-dark: #ac0000;
    --table-header: #f0f0f0;
    --table-footer: #f7f7f7;
    --table-pager:  #fcfcfc;
    --brock-red-light: #cc000024;
}

[data-theme="dark"] {
    --white: #000;
    --gray: #212124;
    --black: #fff;
    --gray-dark: #f4f4f4;
    --table-pager: #1e1e1e;
    --table-footer: #2c2c2c;
    --table-header: #3a3a3a;
    --brock-red-light: #cc00005c;
}

[data-theme="dark"] #ctl00_Content_Image1 {
    filter: invert();
}

@media (prefers-color-scheme: dark) {
    [data-theme="auto"] {
        --white: #000;
        --gray: #212124;
        --black: #fff;
        --gray-dark: #f4f4f4;
        --table-pager: #1e1e1e;
        --table-footer: #2c2c2c;
        --table-header: #3a3a3a;
        --brock-red-light: #cc00005c;
    }

    [data-theme="auto"] #ctl00_Content_Image1 {
        filter: invert();
    }
}

body {
    font-family: 'Bliss Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    font-size: 16px !important;
    line-height: 1.6 !important;
    background-color: var(--gray) !important;
    color: var(--black) !important;
    margin: 0 !important;
}

body.mobile-nav-active {
    overflow: hidden !important;
}

h1, .screentitle {
    font-family: 'Bliss Bold' !important;
    font-size: 1.8rem !important;
    font-weight: normal !important;
    color: var(--black) !important;
}

h2 {
    font-family: 'Bliss Bold' !important;
    font-size: 1.5rem !important;
    font-weight: normal !important;
    color: var(--brock-red);
}

h3 {
    font-family: 'Bliss Bold' !important;
    font-size: 1.25rem !important;
    font-weight: normal !important;
    color: var(--black) !important;
}

a {
    color: var(--brock-red) !important;
    text-decoration: none !important;
}

a[href^="http"] {
    border-bottom: 1px solid var(--brock-red-light);
}

a[href^="http"]:hover {
    border-bottom: 1px solid var(--brock-red-dark);
}

a:hover, a[href^="http"]:hover {
    color: var(--brock-red-dark) !important;
    text-decoration: none
}

.nav-toggle {
    display: none !important;
    position: fixed !important;
    top: 15px !important;
    left: 15px !important;
    z-index: 1400 !important;
    background: var(--brock-red) !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 8px !important;
    width: 44px !important;
    height: 44px !important;
    cursor: pointer !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 4px !important;
}

.nav-toggle .icon-bar {
    display: block !important;
    width: 22px !important;
    height: 2px !important;
    background: var(--white) !important;
    transition: all 0.3s ease-out !important;
}

.nav-toggle.active .icon-bar:nth-child(1) {
    transform: translateY(6px) rotate(45deg) !important;
}

.nav-toggle.active .icon-bar:nth-child(2) {
    opacity: 0 !important;
}

.nav-toggle.active .icon-bar:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg) !important;
}

.nav-overlay {
    display: none !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.5) !important;
    z-index: 1338 !important;
    opacity: 0 !important;
    transition: opacity 0.3s ease-out !important;
}

.nav-overlay.active {
    display: block !important;
    opacity: 1 !important;
}

#bodyHeader {
    border-top: 1px solid var(--gray-dark);
    position: fixed;
    bottom: 0;
    background-color: var(--gray);
    background-image: none;
    z-index: 1337;
}
.maintitlelogo {
    order: 2;
    margin-left: 19rem;
    position: absolute;
    max-height: 83px !important;
}

.MenuBottom { display: none !important; }

#headerLinks {
    display: flex !important;
    gap: 0.75rem !important;
    z-index: 1337;
    position: relative;
}

#header {
    border-bottom: 1px solid var(--brock-red);
    height: 83px;
    background-color: var(--white) !important;
}

#leftNav {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 280px !important;
    height: 100vh !important;
    background-color: var(--white) !important;
    border-right: 1px solid var(--gray-dark) !important;
    transition: transform 0.3s ease-in-out;
    z-index: 1339;
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
    margin: 0 !important;
}
#leftNavContents {
    padding: 1rem;
    overflow-y: auto;
    height: 100%;
}
#leftNav.active {
    transform: translateX(0) !important;
}

div[role="search"] {
    border-bottom: 1px solid var(--gray-dark) !important;
    padding-bottom: 1rem !important;
}

.search-input-container {
    position: relative !important;
    display: flex !important;
    align-items: stretch !important;
}

#ctl00_txtSearch {
    font-family: 'Bliss Light' !important;
    font-size: 0.95rem !important;
    padding: 0.75rem 1rem !important;
    border: 2px solid var(--black) !important;
    border-right: none !important;
    background: var(--gray) !important;
    flex: 1 !important;
    transition: all 0.2s ease-out !important;
    outline: none !important;
    margin: 0 !important;
    color: var(--black);
}

#ctl00_txtSearch:focus {
    border-color: var(--brock-red) !important;
    box-shadow: 0 0 0 1px var(--brock-red) !important;
}

#ctl00_SearchButton1 {
    background: var(--black) !important;
    border: 2px solid var(--black) !important;
    border-left: none !important;
    color: var(--white) !important;
    cursor: pointer !important;
    transition: all 0.2s ease-out !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 50px !important;
    box-sizing: border-box !important;
}

#ctl00_SearchButton1:hover {
    background: var(--brock-red) !important;
    background-image: none !important;
    border-color: var(--brock-red) !important;
}

#mainBody {
    margin-left: 280px !important;
    padding: 5px 1.5rem 2rem 1.5rem !important;
    transition: margin-left 0.3s ease-in-out;
}

.brockButton, .brockNavButton {
    font-family: 'Bliss Light' !important;
    background: var(--black) !important;
    border-radius: 0 !important;
    padding: 0.9rem 0.75rem !important;
    font-size: 0.9rem !important;
    color: var(--white) !important;
    cursor: pointer !important;
    transition: all 0.2s ease-out;
    line-height: 0;
    border: 0;
    box-shadow: none;
    -webkit-appearance: none;
}
.brockButton:hover, .brockNavButton:hover {
    background: var(--brock-red) !important;
}
#ctl00_PageNav_btnLogout {
    font-family: 'Bliss Light' !important;
    background: var(--brock-red) !important;
    color: var(--white) !important;
    border-color: var(--brock-red-dark) !important;
    font-weight: normal;
}
#ctl00_PageNav_btnLogout:hover {
    background: var(--brock-red-dark) !important;
}

.BrockTreeView { margin-top: 1rem; }

.BrockTreeView a {
    font-family: 'Bliss Light' !important;
    display: flex !important;
    align-items: center !important;
    padding: 0.4rem !important;
    border-radius: 0 !important;
    font-size: 0.95rem !important;
    color: var(--black) !important;
    text-decoration: none !important;
    line-height: 1.5;
    transition: all 0.25s;
}
.BrockTreeView a:hover, .BrockTreeView a:focus {
    background-color: var(--gray) !important;
    color: var(--brock-red) !important;
}
.BrockTreeView .AspNet-TreeView-Selected > a,
.BrockTreeView .AspNet-TreeView-Selected > a:hover {
    background-color: var(--brock-red) !important;
    color: var(--white) !important;
    font-family: 'Bliss Bold' !important;
    font-weight: normal !important;
}
li.AspNet-TreeView-Root > a {
    font-family: 'Bliss Bold' !important;
    font-weight: normal !important;
    font-size: 1rem !important;
    color: var(--black) !important;
}
li.AspNet-TreeView-Parent {
    margin-left: 1rem !important;
}
li.AspNet-TreeView-Leaf {
    margin-left: 1.5rem !important;
}

.AspNet-TreeView-Expand, .AspNet-TreeView-Collapse {
    float: left;
    width: 18px !important;
    height: 18px !important;
    margin-right: 0 !important;
    cursor: pointer !important;
    background-image: none !important;
    position: relative;
    display: inline-block;
    align-self: center;
}

.AspNet-TreeView-Expand::before, .AspNet-TreeView-Collapse::before {
    content: '+';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    line-height: 16px;
    font-size: 18px;
    font-weight: bold;
    font-family: monospace;
    text-align: center;
    color: var(--white);
    background-color: var(--black);
    border-radius: 0;
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-out;
}

.AspNet-TreeView-Collapse::before {
    content: '–';
    background-color: var(--brock-red);
    color: var(--white);
    transform: translate(-50%, -50%) rotate(180deg);
}

.theme-switch-container {
    margin: 1rem 0 !important;
    padding: 1rem !important;
    border: 1px solid var(--gray-dark) !important;
    background-color: var(--white) !important;
    border-radius: 0 !important;
}

.theme-switch-container h4 {
    font-family: 'Bliss Bold' !important;
    font-size: 1rem !important;
    color: var(--black) !important;
    margin: 0 0 0.75rem 0 !important;
    font-weight: normal !important;
}

.theme-switch-row {
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
    margin-bottom: 0.5rem !important;
}

.theme-switch {
    position: relative !important;
    display: inline-block !important;
    width: 48px !important;
    height: 24px !important;
    flex-shrink: 0 !important;
}

.theme-switch input {
    opacity: 0 !important;
}

.theme-slider {
    position: absolute !important;
    cursor: pointer !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: var(--gray-dark) !important;
    transition: 0.3s !important;
}

.theme-slider:before {
    position: absolute !important;
    content: "" !important;
    height: 18px !important;
    width: 18px !important;
    left: 3px !important;
    bottom: 3px !important;
    background-color: var(--white) !important;
    transition: 0.3s !important;
}

input:checked + .theme-slider {
    background-color: var(--brock-red) !important;
}

input:checked + .theme-slider:before {
    transform: translateX(24px) !important;
}

.theme-slider.disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
}

.theme-slider.disabled:before {
    opacity: 0.7 !important;
}

.theme-label {
    font-family: 'Bliss Light' !important;
    font-size: 0.9rem !important;
    color: var(--black) !important;
    cursor: pointer !important;
    user-select: none !important;
    flex: 1 !important;
}

.theme-label.disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
}

table { width: 100% !important; }

td, #maincontent {
    font-family: 'Bliss Light';
    font-size: 1em;
}

th { color: var(--brock-red); !important }

tfoot, thead, td, input { vertical-align: revert !important }

input[type="radio"] {
    vertical-align: baseline !important
}

.ajax__tab_header {
    display: flex !important;
    gap: 0.5rem;
}

.ajax__tab_header .ajax__tab_outer {
    border: none !important;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
}

.ajax__tab_header .ajax__tab_inner, .update_container {
    padding: 0 !important;
}

.ajax__tab_tab {
    font-family: 'Bliss Light' !important;
    padding: 0.5rem 1rem;
    font-size: 14px;
    font-weight: normal;
    border: 1px solid var(--brock-red) !important;
    border-radius: 0;
    transition: all 0.2s ease-out;
    border-bottom: 3px solid var(--black) !important;
    background: var(--white);
    outline: none !important;
}

.ajax__tab_tab:hover {
    color: var(--white) !important;
    background: var(--brock-red);
    border-bottom: 3px solid var(--brock-red-dark) !important;
}

.ajax__tab_active .ajax__tab_tab {
    font-family: 'Bliss Bold' !important;
    color: var(--white) !important;
    background: var(--brock-red) !important;
    font-weight: normal;
    border-bottom: 3px solid var(--brock-red-dark) !important;
    background-color: var(--brock-red) !important;
    pointer-events: none;
}

.Alert-Info, .Alert-Warning, .Alert-Error, .Alert-Success {
    border-radius: 0 !important;
}

.Alert h3 { color: var(--black) !important; }

#ctl00_Content_Image1 {
    width: 100%;
    max-width: 600px;
}

.gridPagerStyle {
    background-color: var(--table-pager) !important;
}

.ajax__tab_body,
.gridAlternatingItemStyle,
.gridItemStyle,
.gridFooterStyle {
    background-color: var(--table-footer) !important;
}

div.collapsible,
.gridHeaderStyle {
    background-color: var(--table-header) !important;
    color: inherit !important;
}

span[id^="ctl00_Content_"] {
    color: var(--black) !important;
}

#ctl00_Content_pnlMessage,
#tbUG1BrockCrds td[bgcolor="#ffffff"],
#tbUG1AvgCrds td[bgcolor="#ffffff"],
#tbUG1AvgCrds td[style*="background-color: #ffffff"] {
    background-color: var(--table-pager) !important;
}

#tbUG1CCRqr td[bgcolor="gainsboro"],
#tbUG1MaxCrs td[bgcolor="gainsboro"],
#tbUG1BrockCrdsTitle td[bgcolor="gainsboro"],
#tbUG1AvgCrdsTitle td[style*="background-color: #DCDCDC"] {
    background-color: var(--table-header) !important;
}

ctl00_Content_bdlUG1_ctl00_lbUG1AvgCrdTitle

div[style*="font-family: Arial"] {
    font-family: "Bliss Light" !important;
}

.well { background-color: var(--white) !important }
#ctl00_Content_pnlContactAdvisor,
#ctl00_Content_Panel2 { border-color: var(--white ) !important }
#ctl00_Content_lblVolunteer_Agreement_Text > h3 > strong > span { color: var(--black) !important }

@media screen and (min-width: 769px) {
    .nav-toggle {
        display: none !important;
    }
}

@media screen and (max-width: 768px) {
    .nav-toggle {
        display: flex !important;
    }

    #leftNav {
        transform: translateX(-100%) !important;
    }

    #leftNav.active {
        transform: translateX(0) !important;
    }

    #mainBody {
        margin-left: 0 !important;
        padding-top: 80px !important;
    }

    #header {
        padding-top: 4.25rem !important;
        height: auto !important;
        min-height: 83px !important;
    }

    .maintitlelogo {
        position: relative !important;
        order: 0 !important;
        margin: 0 auto 1rem auto !important;
        text-align: center !important;
    }

    #leftNavContents {
        -webkit-overflow-scrolling: touch !important;
        padding-top: 4.25rem;
    }

    .BrockTreeView a {
        min-height: 44px !important;
        padding: 0.75rem !important;
    }
}

@media screen and (max-width: 480px) {
    #headerLinks {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 !important;
    }

    .brockNavButton {
        width: 100% !important;
        max-width: 200px !important;
    }

    #mainBody {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
    }
}

@media print {
    body { background-color: var(--white) !important; }
    #leftNav, #header, #headerLinks, .nav-toggle, .nav-overlay, .printHide { display: none !important; }
    #mainBody { margin-left: 0 !important; padding: 0 !important; }
}
    `;
	document.head.appendChild(style);

	function initTheme() {
		const savedTheme = localStorage.getItem('brockdb-theme') || 'auto';
		document.documentElement.setAttribute('data-theme', savedTheme);
		return savedTheme;
	}

	function updateThemeControls(currentTheme) {
		const autoSwitch = document.getElementById('theme-auto');
		const lightSwitch = document.getElementById('theme-light');
		const darkSwitch = document.getElementById('theme-dark');
		const lightLabel = document.querySelector('label[for="theme-light"]');
		const darkLabel = document.querySelector('label[for="theme-dark"]');

		if (!autoSwitch || !lightSwitch || !darkSwitch) return;

		const isAuto = currentTheme === 'auto';

		autoSwitch.checked = isAuto;
		lightSwitch.checked = !isAuto && currentTheme === 'light';
		darkSwitch.checked = !isAuto && currentTheme === 'dark';
		lightSwitch.disabled = isAuto;
		darkSwitch.disabled = isAuto;

		const lightSlider = lightSwitch.nextElementSibling;
		const darkSlider = darkSwitch.nextElementSibling;

		if (isAuto) {
			lightSlider.classList.add('disabled');
			darkSlider.classList.add('disabled');
			lightLabel.classList.add('disabled');
			darkLabel.classList.add('disabled');
		} else {
			lightSlider.classList.remove('disabled');
			darkSlider.classList.remove('disabled');
			lightLabel.classList.remove('disabled');
			darkLabel.classList.remove('disabled');
		}
	}

	function setTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('brockdb-theme', theme);
		updateThemeControls(theme);
	}

	document.querySelectorAll('img.maintitlelogo').forEach(img => {
		if (!img.parentElement || img.parentElement.tagName.toLowerCase() !== 'a') {
			const link = document.createElement('a');
			link.href = './';
			img.parentNode.insertBefore(link, img);
			link.appendChild(img);
		}
	})

	const img = document.getElementById("ctl00_Content_Image1");
	const text = document.createElement("p");

	text.style.marginBottom = "1.25em";
	text.innerHTML = `
    Hey, thanks for using the BrockDB Modernizer, it may not mean much to anyone at all, but to me personally? I really appreciate you installing and using it.<br/>
    If today feels like a good day, perhaps share this script to any of your friends! Spread the joy, eh? ^^<br/>
    Have any questions, or even suggestions? Direct it to me at any of my socials, my site can be found <a href="https://t7ru.link/" target="_blank">here</a>.
    `;

	const themeContainer = document.createElement("div");
	themeContainer.className = "theme-switch-container";
	themeContainer.innerHTML = `
		<h4>Theme Settings</h4>
		<div class="theme-switch-row">
			<div class="theme-switch">
				<input type="checkbox" id="theme-auto" />
				<span class="theme-slider"></span>
			</div>
			<label for="theme-auto" class="theme-label">Auto (follow system)</label>
		</div>
		<div class="theme-switch-row">
			<div class="theme-switch">
				<input type="checkbox" id="theme-light" />
				<span class="theme-slider"></span>
			</div>
			<label for="theme-light" class="theme-label">Light mode</label>
		</div>
		<div class="theme-switch-row">
			<div class="theme-switch">
				<input type="checkbox" id="theme-dark" />
				<span class="theme-slider"></span>
			</div>
			<label for="theme-dark" class="theme-label">Dark mode</label>
		</div>
	`;

    const timeFormatContainer = document.createElement("div");
    timeFormatContainer.className = "theme-switch-container";
    timeFormatContainer.innerHTML = `
        <h4>Time Settings</h4>
        <div class="theme-switch-row">
            <div class="theme-switch">
                <input type="checkbox" id="time-12" />
                <span class="theme-slider"></span>
            </div>
            <label for="time-12" class="theme-label">Use 12-hour format in Student Schedule</label>
        </div>
    `;

	if (img?.parentNode) {
		img.parentNode.insertBefore(text, img);
		img.parentNode.insertBefore(themeContainer, img);
        img.parentNode.insertBefore(timeFormatContainer, img);
	}

	const currentTheme = initTheme();
	updateThemeControls(currentTheme);

	document.getElementById('theme-auto')?.addEventListener('change', function(e) {
		if (e.target.checked) {
			setTheme('auto');
		} else {
			setTheme('light');
		}
	});

	document.getElementById('theme-light')?.addEventListener('change', function(e) {
		if (e.target.checked && !e.target.disabled) {
			document.getElementById('theme-auto').checked = false;
			setTheme('light');
		}
	});

	document.getElementById('theme-dark')?.addEventListener('change', function(e) {
		if (e.target.checked && !e.target.disabled) {
			document.getElementById('theme-auto').checked = false;
			setTheme('dark');
		}
	});
	document.querySelectorAll('.theme-switch .theme-slider').forEach(slider => {
		slider.addEventListener('click', () => {
			const checkbox = slider.previousElementSibling;
			if (checkbox && !checkbox.disabled) {
				checkbox.checked = !checkbox.checked;
				checkbox.dispatchEvent(new Event('change'));
			}
		});
	});

    const savedTimeFormat = localStorage.getItem('brockdb-time') || '24';
    document.getElementById('time-12')?.addEventListener('change', function(e) {
        localStorage.setItem('brockdb-time', e.target.checked ? '12' : '24');
    });
    if (document.getElementById('time-12')) {
        document.getElementById('time-12').checked = savedTimeFormat === '12';
    }

	const nav = document.getElementById('leftNav');
	const header = document.getElementById('bodyHeader');
	const mainBody = document.getElementById('mainBody');

	if (nav && header && mainBody) {
		const toggle = document.createElement('button');
		toggle.className = 'nav-toggle';
		toggle.innerHTML = '<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>';
		toggle.setAttribute('aria-label', 'Toggle navigation');
		toggle.setAttribute('aria-expanded', 'false');

		document.body.appendChild(toggle);

		const overlay = document.createElement('div');
		overlay.className = 'nav-overlay';
		document.body.appendChild(overlay);

		const toggleNav = (e) => {
			if (e) e.stopPropagation();
			const isActive = nav.classList.contains('active');

			if (isActive) {
				nav.classList.remove('active');
				toggle.classList.remove('active');
				overlay.classList.remove('active');
				document.body.classList.remove('mobile-nav-active');
				toggle.setAttribute('aria-expanded', 'false');
			} else {
				nav.classList.add('active');
				toggle.classList.add('active');
				overlay.classList.add('active');
				document.body.classList.add('mobile-nav-active');
				toggle.setAttribute('aria-expanded', 'true');
			}
		};

		toggle.addEventListener('click', toggleNav);
		overlay.addEventListener('click', toggleNav);

		nav.addEventListener('click', (e) => {
			if (window.innerWidth <= 768 && e.target.tagName === 'A' && e.target.href) {
				if (e.target.classList.contains('AspNet-TreeView-ClickableNonLink') ||
					e.target.classList.contains('glyphicon') ||
					e.target.href.includes('javascript:void(0)')) {
					return;
				}
				toggleNav();
			}
		});

		window.addEventListener('resize', () => {
			if (window.innerWidth > 768 && nav.classList.contains('active')) {
				toggleNav();
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && nav.classList.contains('active')) {
				toggleNav();
			}
		});
	}

	const treeLinks = document.querySelectorAll('.BrockTreeView a');
	treeLinks.forEach(link => {
		link.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				link.click();
			}
		});
	});

	const logoImg = document.querySelector('#ctl00_image1.maintitlelogo');
	if (logoImg) {
		logoImg.src = 'https://bin.t7ru.link/uploads/ce3afee3dd0c';
	}

	function fixSearchBar() {
		const searchLabel = document.getElementById('ctl00_lblSearch');
		const searchInput = document.getElementById('ctl00_txtSearch');
		const searchButton = document.getElementById('ctl00_SearchButton1');
		const searchDiv = document.querySelector('div[role="search"]');

		if (searchLabel && searchInput && searchButton && searchDiv) {
			searchLabel.style.display = 'none';
			searchInput.placeholder = 'Search pages...';

			const newButton = document.createElement('button');
			newButton.type = 'button';
			newButton.id = 'ctl00_SearchButton1';
			newButton.name = 'ctl00$SearchButton1';
			newButton.title = 'Search pages';
			newButton.setAttribute('onclick', searchButton.getAttribute('onclick'));
			newButton.innerHTML = `
            <svg style="width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        `;

			const container = document.createElement('div');
			container.className = 'search-input-container';
			searchDiv.innerHTML = '';
			searchDiv.appendChild(searchLabel);
			searchDiv.appendChild(container);
			container.appendChild(searchInput);
			container.appendChild(newButton);
		} else {
			setTimeout(fixSearchBar, 100);
		}
	}

    function to12Hour(timeStr) {
        const [hourStr, minStr] = timeStr.split(':');
        let hour = parseInt(hourStr, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0 || hour === 24) {
            hour = 12;
        } else if (hour > 12) {
            hour -= 12;
        }
        return `${hour}:${minStr} ${period}`;
    }

    function convertTimeRange(rangeStr) {
        const match = rangeStr.match(/^(\d{2}:\d{2}) - (\d{2}:\d{2}) (.*)$/);
        if (!match) return rangeStr;
        const [, start, end, location] = match;
        const newStart = to12Hour(start);
        const newEnd = to12Hour(end);
        return `${newStart} - ${newEnd} ${location}`;
    }

    function applyTimeFormat() {
        const format = localStorage.getItem('brockdb-time') || '24';

        document.querySelectorAll('td.hour span').forEach(span => {
            const timeText = span.textContent.trim();
            if (!span.dataset.originalTime) {
                span.dataset.originalTime = timeText;
            }
            if (format === '12') {
                span.textContent = to12Hour(span.dataset.originalTime);
            } else {
                span.textContent = span.dataset.originalTime;
            }
        });

        document.querySelectorAll('span.class-time').forEach(span => {
            const text = span.textContent.trim();
            if (!span.dataset.originalText) {
                span.dataset.originalText = text;
            }
            if (format === '12') {
                span.textContent = convertTimeRange(span.dataset.originalText);
            } else {
                span.textContent = span.dataset.originalText;
            }
        });
    }

    function fixTimeFormat() {
        const table = document.getElementById('ctl00_Content_ScheduleControl1_ScheduleTable');
        if (table) {
            applyTimeFormat();
        } else {
            setTimeout(fixTimeFormat, 100);
        }
    }

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', fixSearchBar);
        document.addEventListener('DOMContentLoaded', fixTimeFormat);
	} else {
		fixSearchBar();
        fixTimeFormat();
	}
})();