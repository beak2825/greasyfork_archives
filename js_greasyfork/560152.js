// ==UserScript==
// @name        Redirect to wiki.nixos.org
// @namespace   Violentmonkey Scripts
// @match       https://nixos.wiki/*
// @version     1.0.0
// @author      Henrique Kirch Heck
// @description the nixos.org people have a new wiki
// @icon        https://brand.nixos.org/logos/nixos-logomark-default-gradient-recommended.svg
// @license     GPL-3.0-or-later
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/560152/Redirect%20to%20wikinixosorg.user.js
// @updateURL https://update.greasyfork.org/scripts/560152/Redirect%20to%20wikinixosorg.meta.js
// ==/UserScript==

//#region src/index.ts
const url = new URL(window.document.location.href);
const search = url.searchParams.get("search");
if (search !== null) {
	url.pathname = "/w/index.php";
	url.search = new URLSearchParams({ search }).toString();
}
url.host = "wiki.nixos.org";
window.document.location.href = url.href;

//#endregion