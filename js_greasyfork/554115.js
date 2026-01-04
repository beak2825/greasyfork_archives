// ==UserScript==
// @name         Avatar Reorganizer
// @namespace    https://greasyfork.org/en/users/1349307-jellyworlddoesntexist
// @version      1.1
// @description  Reorganize avatar selection popup to show recent avatar first
// @author       jellyworlddoesntexist
// @match        https://www.neopets.com/settings/neoboards/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554115/Avatar%20Reorganizer.user.js
// @updateURL https://update.greasyfork.org/scripts/554115/Avatar%20Reorganizer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let hasRun = false;

	function reorganizeAvatars() {
		// Prevent multiple executions
		if (hasRun) return;

		const popupBody = document.querySelector('.popup-body__2020:has(.settings-avatars)');
		if (!popupBody) {
			return;
		}

		// Check if we've already reorganized
		if (document.getElementById('recent-avatar-section')) {
			hasRun = true;
			return;
		}

		hasRun = true;

		const avatarContainers = popupBody.querySelectorAll('.settings-avatars');
		if (avatarContainers.length < 2) {
			hasRun = false;
			return;
		}

		const basicAvatars = avatarContainers[0];
		const secretAvatars = avatarContainers[1];

		// Add IDs for easier reference
		basicAvatars.id = 'basic-avatars';
		secretAvatars.id = 'secret-avatars';

		// Remove the "Secret Avatars:" paragraph
		const secretLabel = Array.from(popupBody.querySelectorAll('p')).find(p => {
			const b = p.querySelector('b');
			return b && b.textContent.includes('Secret Avatars:');
		});

		if (secretLabel) {
			secretLabel.remove();
		}

		// Find the most recent avatar (last avatar in secret avatars)
		const allAvatars = Array.from(secretAvatars.querySelectorAll('.settings-av'));
		let mostRecentAvatar = null;

		// Start from the end to find the last avatar
		for (let i = allAvatars.length - 1; i >= 0; i--) {
			const img = allAvatars[i].querySelector('img');
			if (img) {
				// Clone the avatar so it appears in both places
				mostRecentAvatar = allAvatars[i].cloneNode(true);
				break;
			}
		}

		// Create recent avatar section
		if (mostRecentAvatar) {
			const recentSection = document.createElement('div');
			recentSection.id = 'recent-avatar-section';

			const recentHeader = document.createElement('p');
			const recentHeaderBold = document.createElement('b');
			recentHeaderBold.textContent = 'Most Recent Avatar:';
			recentHeader.appendChild(recentHeaderBold);
			recentSection.appendChild(recentHeader);

			const recentContainer = document.createElement('div');
			recentContainer.className = 'settings-avatars recent-avatar-container';
			recentContainer.appendChild(mostRecentAvatar);

			recentSection.appendChild(recentContainer);

			popupBody.insertBefore(recentSection, popupBody.firstChild);
		}

		// Move secret avatars before basic avatars
		popupBody.appendChild(secretAvatars);
		popupBody.appendChild(basicAvatars);

		injectCSS();
	}

	function injectCSS() {
		if (document.getElementById('avatar-reorganizer-css')) return;

		const style = document.createElement('style');
		style.id = 'avatar-reorganizer-css';
		style.textContent = `
						.popup-body__2020:has(.settings-avatars) {
								display: flex;
								flex-direction: column;
								gap: 20px;
						}

						.settings-avatars {
								display: grid !important;
								grid-template-columns: repeat(auto-fill, 60px);
								padding: 0 !important;
								gap: 15px !important;

								&:not(.recent-avatar-container) {
									padding-top: 30px !important;
									border-top: 1px solid #bbb;
							}
						}

						.settings-av {
								max-width: unset !important;
								border-radius: 2px !important;
								font-size: 10px;
								padding: 5px !important;

								img {
										margin-bottom: 5px;
								}
						}

						#recent-avatar-section {
								order: 1;

								p {
										display: block !important;
										margin-block: 5px 10px;
										font-weight: bold;
								}

								.recent-avatar-container {
										grid-template-columns: 60px;
								}
						}

						#secret-avatars {
								order: 2;
						}

						#basic-avatars {
								order: 3;
						}
				`;
		document.head.appendChild(style);
	}

	// Watch for the avatar popup to open
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' &&
				mutation.attributeName === 'style' &&
				mutation.target.id === 'SelectAvatarPopup' &&
				mutation.target.style.display === 'block') {
				// Reset hasRun when popup opens
				hasRun = false;
				// Small delay to ensure DOM is ready
				setTimeout(reorganizeAvatars, 100);
			}
		});
	});

	// Start observing when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			const avatarPopup = document.getElementById('SelectAvatarPopup');
			if (avatarPopup) {
				observer.observe(avatarPopup, {
					attributes: true,
					attributeFilter: ['style']
				});
			}
		});
	} else {
		const avatarPopup = document.getElementById('SelectAvatarPopup');
		if (avatarPopup) {
			observer.observe(avatarPopup, {
				attributes: true,
				attributeFilter: ['style']
			});
		}
	}
})();