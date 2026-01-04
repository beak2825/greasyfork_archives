// ==UserScript==
// @name               Auto Dark Mode for Nyaa
// @description        Switch between light/dark based on browser setting.
// @namespace          https://greasyfork.org/en/users/1466117
// @icon               https://icons.duckduckgo.com/ip3/nyaa.si.ico
// @version            1.1.4
// @license            MIT
// @match              https://nyaa.si/*
// @match              https://sukebei.nyaa.si/*
// @run-at             document-idle
// @inject-into        page
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/560320/Auto%20Dark%20Mode%20for%20Nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/560320/Auto%20Dark%20Mode%20for%20Nyaa.meta.js
// ==/UserScript==

if (GM.info.scriptHandler === "Greasemonkey")
{
    window.setThemeDark = window.eval("setThemeDark");
    window.setThemeLight = window.eval("setThemeLight");
}

const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function isDarkTheme()
{
    return document.body.classList.contains("dark");
}

function updateTheme({ matches: isDarkMode })
{
    if (isDarkTheme() !== isDarkMode)
    {
        isDarkMode ? setThemeDark() : setThemeLight();
    }
}
