// ==UserScript==
// @name         GGn Blur Adult Images
// @namespace    https://greasyfork.org/en/users/1466117
// @version      2.05
// @description  Blur adult images and blur titles on ggn game pages and request pages.
// @author       Mocha
// @license      MIT
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/requests.php*action=view*id=*
// @run-at       document-end
// @grant        none
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAsJxhHLBFOLQY5JwI5Lxc3JRRDLBY5Jwo0KBA+KRM+IgpFKxM9Kw5DMA87Jgs7Jhc+JRtGLhJCJgc9IxP/9vT49vb38vH/9/j//un49vX2+/7y9PX///44JBJEKAo5KBNjQBVNPRlLQCJUPhtcQRxTQhtVRSFXPBpoQRpNOx5NPh1XQR1RNBlrRCRoQRVXPhRjRiFbQjNbRjdhSipyWDNwVDyFZ0yJZjqQbUWJaDqNc0V1WzNqTzRVRTlOQjhdRytQPyxiQyxcPiV/cV6gnpamoKGhlZGqoI+Ze0qsilyIem6ZlZS1qZeWm5qHjZhjRy9cQylYRSKel362s6uQgm+LdEapnXueoqexlFu2nHiyqqukmI6EYzJ3ZEG0rqeEZE1nQCpvX1Our7OPgoSKZkisgEq2noC4tcS0nnW7t6yzrqWbflmQb0JzYUq9tKtpXlZeRyeFdWnezsKAbUqBcU3Bu7TJzNHIzMbUrHjV0sO0poKkgEqsoZnLy9nZzcNxZ1VbPy6Oe3Pn3NhtYFKFbEqjg06xj1O8nGHJqXTc3NCspZSffkyPcUJuWTliTClcRSVbRSJ9blT37dykk36AYj+cdESwg1C5jl2zi1v25tnSwraXc0+IYTpqTzVmSzZiQiVhQyZROSXFt6v16d2woY50YUaMe2HFt6CdgFTGuKH58+jJuaJ1WjhkVUKck4ZpUzdmRCxbQTBSQDW/s6n/+ev///H///TDwrSFbER6Z0a3saT48eD//+X//+7f3dVjTjJcRiNcSClYRSpUPyRhRixyVDlyUTd3VjyEXjuFXzxpUT1ZRDVsTC9UPCpSQDVpRylYQSdYQSddRCpfRixjSC1gRSpjRylrTi9pSilrSyhiRyxcRCxhRitbQy1YQCxeQiRlRjddPCxiRTBXPylNOiVTRS9SRi5TRixaSCtWRSphSipaRSVSQitXRitbRidUQyhdRSldQSJkRSRpSilhQyZiRSpgQiVlQyVeQy5UOytoRSRmQR9cRDJeQCdkPx1eRTEAAFxBAAAgVAAAaG4AAG9nAABzXAAASS4AAEVcAAByZQAAdGEAAGM7AABcUAAAZ3IAACBGAABlcwAAeDgAAFxT
// @downloadURL https://update.greasyfork.org/scripts/551173/GGn%20Blur%20Adult%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/551173/GGn%20Blur%20Adult%20Images.meta.js
// ==/UserScript==

(function() {
	const currentUrl = window.location.href;
	let tagContainer, tagSelector, selectorsToBlur, buttonParent;

	if (currentUrl.includes('torrents.php?id=')) {
		tagContainer = document.getElementById('group_tags');
		if (!tagContainer) return;
		tagSelector = '.group_tag a';
		selectorsToBlur = [
			'#group_cover img',
			'#group_screenshots img',
			'.similar_div img',
			'.trailer_div',
			'#display_name' // Add title selector for game pages
		];

		const tags = tagContainer.querySelectorAll(tagSelector);
		const adultTagLink = Array.from(tags).find(tag => /adult/i.test(tag.textContent));

		if (adultTagLink) {
			console.log("found tag");
			buttonParent = document.querySelector('#add_tags_link').parentElement;
			applyBlurLogic(selectorsToBlur, buttonParent);
		}
	} else if (currentUrl.includes('requests.php?action=view&id=')) {
		tagContainer = document.querySelector('.box.box_tags .stats.nobullet');
		if (!tagContainer) return;
		tagSelector = 'li a';
		selectorsToBlur = [
			'.box.box_albumart img',
			'.thin > h2' // Add title selector for request pages
		];

		const tags = tagContainer.querySelectorAll(tagSelector);
		const adultTagLink = Array.from(tags).find(tag => /adult/i.test(tag.textContent));

		if (adultTagLink) {
			buttonParent = document.querySelector('.box.box_tags');
			applyBlurLogic(selectorsToBlur, buttonParent);
		}
	}

	function applyBlurLogic(selectorsToBlur, buttonParent) {
		selectorsToBlur.forEach(selector => {
			document.querySelectorAll(selector).forEach(element => {
				element.style.filter = 'blur(12px)';
				element.style.transition = 'filter 0.3s';
				element.dataset.isHovered = 'false';
			});
		});

		const toggleBtn = document.createElement('button');
		toggleBtn.textContent = 'Show/Hide Adult Images';

		const submitBtn = document.getElementById('submit_button');
		if (submitBtn) {
			const computed = window.getComputedStyle(submitBtn);
			toggleBtn.style.cssText = `
				font-family: ${computed.fontFamily};
				font-size: ${computed.fontSize};
				font-weight: ${computed.fontWeight};
				color: ${computed.color};
				background-color: ${computed.backgroundColor};
				border: ${computed.border};
				border-radius: ${computed.borderRadius};
				padding: ${computed.padding};
				cursor: ${computed.cursor};
				text-align: center;
			`;
		} else {
			toggleBtn.style.marginLeft = '10px';
			toggleBtn.style.padding = '2px 6px';
			toggleBtn.style.fontSize = '0.8em';
			toggleBtn.style.cursor = 'pointer';
		}

		let blurred = true;
		let isKeyHeld = false;

		// Update blur state for all hovered elements
		function updateAllBlurStates() {
			if (!blurred) return; // Only apply hover logic when images are in blurred mode

			selectorsToBlur.forEach(selector => {
				document.querySelectorAll(selector).forEach(element => {
					const isHovered = element.dataset.isHovered === 'true';
					if (isHovered && isKeyHeld) {
						element.style.filter = 'none';
					} else if (blurred) {
						element.style.filter = 'blur(12px)';
					}
				});
			});
		}

		// Track key state and update all hovered images
		function handleKeyDown(e) {
			const wasKeyHeld = isKeyHeld;
			isKeyHeld = e.ctrlKey || e.altKey || e.metaKey;
			if (isKeyHeld !== wasKeyHeld) {
				updateAllBlurStates();
			}
		}

		function handleKeyUp(e) {
			const wasKeyHeld = isKeyHeld;
			isKeyHeld = e.ctrlKey || e.altKey || e.metaKey;
			if (isKeyHeld !== wasKeyHeld) {
				updateAllBlurStates();
			}
		}

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		// Add hover listeners to all blurred elements
		selectorsToBlur.forEach(selector => {
			document.querySelectorAll(selector).forEach(element => {
				element.addEventListener('mouseenter', function() {
					this.dataset.isHovered = 'true';
					if (blurred && isKeyHeld) {
						this.style.filter = 'none';
					}
				});

				element.addEventListener('mouseleave', function() {
					this.dataset.isHovered = 'false';
					if (blurred) {
						this.style.filter = 'blur(12px)';
					}
				});
			});
		});

		toggleBtn.addEventListener('click', () => {
			blurred = !blurred;
			selectorsToBlur.forEach(selector => {
				document.querySelectorAll(selector).forEach(element => {
					element.style.filter = blurred ? 'blur(12px)' : 'none';
				});
			});
		});

		const br = document.createElement('br');
		buttonParent.appendChild(br);
		buttonParent.appendChild(toggleBtn);
	}
})();