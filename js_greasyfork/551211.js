// ==UserScript==
// @name         Set Portainer Items per Page to All
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically set Items per page to 'All' in Portainer
// @author       CASKexe
// @match        *://192.168.0.__:9443/containers*
// @match        *://192.168.0.__:9443/images*
// @match        *://192.168.0.__:9443/templates/custom*
// @match        *://192.168.0.__:9443/docker/networks*
// @match        *://192.168.0.__:9443/docker/volumes*
// @match        *://192.168.0.__:8000/containers*
// @match        *://192.168.0.__:8000/images*
// @match        *://192.168.0.__:8000/templates/custom*
// @match        *://192.168.0.__:8000/docker/networks*
// @match        *://192.168.0.__:8000/docker/volumes*
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzNiA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzUuNDkyMiAxNS45MjQ2QzM1LjM5MjIgMTUuODM5OCAzNC40OTQ1IDE1LjE0MzUgMzIuNTY2NiAxNS4xNDM1QzMyLjA2ODEgMTUuMTQzNSAzMS41NTI2IDE1LjE5NDIgMzEuMDU0MiAxNS4yNzk4QzMwLjY4ODMgMTIuNjgwOCAyOC41Nzc0IDExLjQyMzYgMjguNDk0NSAxMS4zNTYzTDI3Ljk3OSAxMS4wNTA1TDI3LjY0NjQgMTEuNTQzMkMyNy4yMzA5IDEyLjIwNTUgMjYuOTE1NCAxMi45NTMzIDI2LjczMjUgMTMuNzE3N0MyNi4zODM2IDE1LjE5NTggMjYuNTk5MSAxNi41ODg0IDI3LjMzMDkgMTcuNzc3NEMyNi40NDk1IDE4LjI4NjcgMjUuMDIwMSAxOC40MDU1IDI0LjcyMDggMTguNDIzSDEuMTE2MTRDMC41MDE0MDggMTguNDIzIDAuMDAyMTgxODggMTguOTMyMyAwLjAwMjE4MTg4IDE5LjU2MTNDLTAuMDMxMTUxNSAyMS42Njc2IDAuMzE3Njg2IDIzLjc3MzkgMS4wMzI0MiAyNS43NjEzQzEuODQ3MTUgMjcuOTM1OCAzLjA2MDMzIDI5LjU0OTQgNC42MjMxMiAzMC41MzQ4QzYuMzg1MTQgMzEuNjM5IDkuMjYxMTIgMzIuMjY3MiAxMi41MDIyIDMyLjI2NzJDMTMuOTY1IDMyLjI2NzIgMTUuNDI3OCAzMi4xMzA5IDE2Ljg3NDMgMzEuODU5MkMxOC44ODU5IDMxLjQ4NTMgMjAuODEzOSAzMC43NzI0IDIyLjU5MjkgMjkuNzM2M0MyNC4wNTU3IDI4Ljg2OTcgMjUuMzY4OSAyNy43NjYzIDI2LjQ4MjkgMjYuNDc1MUMyOC4zNjEyIDI0LjMxODEgMjkuNDc1MSAyMS45MDYgMzAuMjg5OCAxOS43NjU2SDMwLjYyMjRDMzIuNjY3NCAxOS43NjU2IDMzLjkzMDIgMTguOTMzMSAzNC42Mjg2IDE4LjIyMDJDMzUuMDkzNyAxNy43NzgyIDM1LjQ0MzMgMTcuMjM0OCAzNS42OTIyIDE2LjYyMzJMMzUuODQxOCAxNi4xODEyTDM1LjQ5MyAxNS45MjYyTDM1LjQ5MjIgMTUuOTI0NloiIGZpbGw9IiMwMDkxRTIiLz48L3N2Zz4K
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551211/Set%20Portainer%20Items%20per%20Page%20to%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/551211/Set%20Portainer%20Items%20per%20Page%20to%20All.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Run once the page is fully loaded
	window.addEventListener('load', function() {
		let interval = setInterval(function() {
			// Look for the pagination dropdown
			let dropdown = document.querySelector('.pagination select');
			if (dropdown && dropdown.value !== 'all') {
				// Set dropdown to 'all'
				dropdown.value = 'all';
				// Trigger change event so UI updates
				dropdown.dispatchEvent(new Event('change'));
				// Stop checking once it's applied
				clearInterval(interval);
			}
		}, 1000);
	});
})();