// ==UserScript==
// @name         8chan reveal spoilers + static apng thumbnails
// @version      1.0
// @description  Enhanced spoiler reveal and static APNG thumbnails for 8chan
// @license      MIT
// @namespace    kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @author       kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @match        *://8chan.moe/*/res/*
// @match        *://8chan.se/*/res/*
// @match        *://8chan.cc/*/res/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/res/*
// @match        *://8chan.moe/*/last/*
// @match        *://8chan.se/*/last/*
// @match        *://8chan.cc/*/last/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/last/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553292/8chan%20reveal%20spoilers%20%2B%20static%20apng%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/553292/8chan%20reveal%20spoilers%20%2B%20static%20apng%20thumbnails.meta.js
// ==/UserScript==

(function() {
	'use strict';

	class SpoilerAPNGHandler {
		constructor() {
			this.settings = {
				spoilerReveal: true,
				staticAPNG: true,
				apngBorders: true,
				debugStuff: false
			};

			this.constants = {
				SPOILER_SRC: '/v/custom.spoiler',
				MAX_THUMBNAIL_SIZE: { width: 220, height: 220 },
				APNG_BORDER: '3px solid yellow',
				SPOILER_MINI_SIZE: { width: 24, height: 21 },
				SVG_COLOR_BG: 'rgba(0,0,0,0.6)',
				SVG_COLOR_ICON: 'rgba(255,255,0,1)',
			};

			this.selectors = {
				POSTS_CONTAINER: '.divPosts',
				QUOTE_TOOLTIP: '.quoteTooltip',
				THREAD_LIST: '#threadList',
				SPOILER_IMAGE: 'img[src*="spoiler"], img[data-spoiler*="true"]',
				IMAGE_LINK: 'a.imgLink',
				UPLOAD_CELL: '.uploadCell',
				DIMENSION_LABEL: '.dimensionLabel'
			};

			this.observers = {};
			this.init();
		}

		async init() {
			await this.loadSettings();
			this.registerMenuCommands();
			this.setupEventListeners();
			this.setupObservers();
			this.processPage();
		}

		async loadSettings() {
			this.settings.spoilerReveal = await GM.getValue('spoilerRevealEnabled', true);
			this.settings.staticAPNG = await GM.getValue('staticApngEnabled', true);
			this.settings.apngBorders = await GM.getValue('addBordersToApng', true);
			this.settings.debugStuff = await GM.getValue('debugStuff', false);

			console.log('Settings loaded:', this.settings);
		}

		async saveSettings() {
			await GM.setValue('spoilerRevealEnabled', this.settings.spoilerReveal);
			await GM.setValue('staticApngEnabled', this.settings.staticAPNG);
			await GM.setValue('addBordersToApng', this.settings.apngBorders);
			await GM.setValue('debugStuff', this.settings.debugStuff);
		}

		registerMenuCommands() {
			GM.registerMenuCommand('Toggle Spoiler Reveal', () => this.toggleSpoilerReveal(), 's');
			GM.registerMenuCommand('Toggle Static APNG', () => this.toggleStaticAPNG(), 'p');
		}

		async toggleSpoilerReveal() {
			this.settings.spoilerReveal = !this.settings.spoilerReveal;
			await this.saveSettings();
			this.processSpoilers();
			console.log(`Spoiler reveal ${this.settings.spoilerReveal ? 'ENABLED' : 'DISABLED'}`);
		}

		async toggleStaticAPNG() {
			this.settings.staticAPNG = !this.settings.staticAPNG;
			await this.saveSettings();
			this.processAPNGs();
			console.log(`Static APNGs ${this.settings.staticAPNG ? 'ENABLED' : 'DISABLED'}`);
		}

		setupEventListeners() {
			const postsContainer = document.querySelector(this.selectors.POSTS_CONTAINER);
			if (postsContainer) {
				postsContainer.addEventListener('click', this.handleQuoteClick.bind(this));
			}
		}

		setupObservers() {
			const thread = document.querySelector(this.selectors.THREAD_LIST);
			const quoteTooltip = document.querySelector(this.selectors.QUOTE_TOOLTIP);

			if (thread) {
				this.observers.thread = new MutationObserver(this.handleNewPosts.bind(this));
				this.observers.thread.observe(thread, { childList: true });
			}

			if (quoteTooltip) {
				this.observers.quoteTooltip = new MutationObserver(this.handleQuoteHover.bind(this));
				this.observers.quoteTooltip.observe(quoteTooltip, { childList: true });
			}
		}

		handleNewPosts(mutations) {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === 1 && node.classList.contains('postCell')) {
						this.processElement(node);
					}
				}
			}
		}

		handleQuoteHover(mutations) {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === 1 && node.classList.contains('innerPost')) {
						const post = node.parentElement;
						if (post) {
							this.processElement(post);
						}
					}
				}
			}
		}

		handleQuoteClick(event) {
			const quoteLink = event.target.closest('.quoteLink');
			if (quoteLink && quoteLink.nextElementSibling?.classList.contains('inlineQuote')) {
				setTimeout(() => {
					this.processElement(quoteLink.nextElementSibling);
				}, 0);
			}
		}

		processPage() {
			this.processSpoilers();
			this.processAPNGs();
		}

		processElement(element = document) {
			this.processSpoilers(element);
			this.processAPNGs(element);
		}

		processSpoilers(element = document) {
			const spoilerImages = element.querySelectorAll(this.selectors.SPOILER_IMAGE);

			spoilerImages.forEach(image => {
				this.processSpoilerImage(image);
			});
		}

		processSpoilerImage(image) {
			// Only process actual spoiler images
			if (!image.src.includes('spoiler') && !image.getAttribute('data-spoiler')) {
				return;
			}

			// Clean up attributes
			image.removeAttribute('width');
			image.removeAttribute('height');
			image.setAttribute('data-spoiler', 'true');

			const imgLink = image.closest(this.selectors.IMAGE_LINK);
			if (!imgLink) return;

			if (this.settings.spoilerReveal) {
				this.revealSpoilerImage(image, imgLink);
			} else {
				this.hideSpoilerImage(image, imgLink);
			}

			this.ensureSpoilerMini(image, imgLink);

			if (this.settings.debugStuff) {
				const debug_isSpoiler = document.createElement('span');
				debug_isSpoiler.innerHTML = `isSpoiler`;
				image.closest(this.selectors.UPLOAD_CELL)?.querySelector('.uploadDetails').appendChild(debug_isSpoiler);
			}
		}

		revealSpoilerImage(image, imgLink) {
			const fileName = imgLink.href.split('/').pop();
			const dimensionLabel = imgLink.closest(this.selectors.UPLOAD_CELL)?.querySelector(this.selectors.DIMENSION_LABEL);
			const dataFilemime = imgLink.getAttribute('data-filemime');

			if (dimensionLabel && /^image\/(?!gif$).+$/.test(dataFilemime)) {
				const dimensions = this.parseDimensions(dimensionLabel.textContent);

				if (dimensions && dimensions.width <= this.constants.MAX_THUMBNAIL_SIZE.width &&
					dimensions.height <= this.constants.MAX_THUMBNAIL_SIZE.height) {
					// Use full image for small images
					image.src = `/.media/${fileName}`;
				} else {
					// Use thumbnail
					image.src = `/.media/t_${fileName.split('.')[0]}`;
				}
			} else {
				// Use thumbnail for other file types
				image.src = `/.media/t_${fileName.split('.')[0]}`;
			}
		}

		hideSpoilerImage(image, imgLink) {
			image.src = this.constants.SPOILER_SRC;
			const spoilerMini = imgLink.querySelector('.sp0iler-mini');
			if (spoilerMini) {
				spoilerMini.style.display = 'none';
			}
		}

		parseDimensions(dimensionText) {
			const match = dimensionText.trim().match(/^(\d+)[x×](\d+)$/);
			return match ? { width: parseInt(match[1]), height: parseInt(match[2]) } : null;
		}

		ensureSpoilerMini(image, imgLink) {
			if (imgLink.querySelector('.sp0iler-mini')) return;

			const spoilerMini = this.createSpoilerMini();
			imgLink.style.position = 'relative';
			imgLink.appendChild(spoilerMini);

			// Observe image for display changes
			const styleObserver = new MutationObserver(() => {
				spoilerMini.style.display = image.style.display;
			});
			styleObserver.observe(image, { attributes: true });
		}

		createSpoilerMini() {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.classList.add('sp0iler-mini');
			Object.assign(svg.style, {
				position: 'absolute',
				top: '0px',
				right: '2px',
				width: `${this.constants.SPOILER_MINI_SIZE.width}px`,
				height: `${this.constants.SPOILER_MINI_SIZE.height}px`,
				opacity: '1',
				zIndex: '0'
			});
			svg.setAttribute('viewBox', '0 -0.5 24 21');
			svg.setAttribute('shape-rendering', 'crispEdges');
			svg.innerHTML = this.getSpoilerMiniPath();

			return svg;
		}

		getSpoilerMiniPath() {
			// Your existing SVG path data here (shortened for example)
			return `
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M0 0h1M2 1h1M14 1h1M8 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M1 0h4M7 0h3M12 0h1M14 0h4M19 0h3M0 1h2M3 1h1M6 1h2M9 1h5M16 1h5M22 1h2M0 19h1M2 19h2M5 19h7M18 19h3M22 19h2M0 20h2M4 20h1M6 20h1M9 20h2M15 20h4M22 20h2" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M5 0h1M10 0h1M13 0h1M18 0h1M13 19h1M14 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M6 0h1M22 0h1M4 15h1M14 19h2M11 20h1M19 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M11 0h1M2 20h1M13 20h1M20 20h2" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M23 0h1M17 19h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M4 1h1M12 19h1M5 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M5 1h1M22 2h1M6 5h1M8 5h1M23 5h1M1 6h1M4 6h1M6 9h1M17 9h1M2 11h1M8 11h1M8 13h1M17 13h1M5 15h1M23 15h1M23 16h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M8 1h1M15 1h1M4 19h1M16 19h1M12 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M21 1h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M0 2h1M3 2h4M8 2h3M12 2h1M14 2h3M18 2h4M23 2h1M0 3h3M21 3h3M0 4h1M2 4h1M5 4h1M7 4h1M10 4h1M14 4h3M18 4h1M0 5h3M4 5h2M7 5h1M9 5h1M15 5h1M17 5h1M22 5h1M0 6h1M2 6h1M5 6h1M8 6h1M17 6h2M21 6h2M0 7h3M5 7h2M12 7h1M19 7h1M22 7h2M1 8h2M4 8h1M10 8h4M16 8h1M18 8h2M21 8h3M0 9h1M5 9h1M8 9h3M16 9h1M18 9h1M21 9h2M1 10h2M4 10h2M8 10h2M15 10h4M21 10h3M0 11h1M4 11h1M7 11h1M15 11h2M18 11h1M21 11h2M0 12h2M5 12h3M9 12h2M13 12h2M17 12h3M21 12h3M0 13h2M4 13h3M10 13h4M15 13h2M18 13h2M22 13h2M0 14h2M4 14h2M7 14h1M9 14h1M13 14h6M21 14h3M0 15h2M6 15h3M10 15h1M13 15h1M19 15h1M0 16h1M2 16h1M5 16h3M9 16h3M13 16h3M17 16h3M21 16h1M0 17h2M23 17h1M0 18h2M3 18h1M5 18h3M9 18h3M13 18h1M17 18h3M22 18h2" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M1 2h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M2 2h1M13 2h1M6 4h1M12 4h1M14 5h1M19 6h1M11 7h1M5 8h1M7 10h1M10 10h1M9 11h2M2 13h1M14 15h2M18 15h1M4 16h1M8 18h1M16 18h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M7 2h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M11 2h1M1 4h1M8 4h1M22 4h1M23 6h1M7 7h1M16 7h2M7 9h1M19 9h1M14 11h1M17 11h1M8 14h1M19 14h1M9 15h1M17 15h1M22 15h1M22 16h1M2 17h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M17 2h1M4 4h1M11 4h1M19 5h1M21 5h1M7 6h1M15 6h1M7 8h1M6 10h1M19 10h1M5 11h2M15 12h1M9 13h1M2 15h1M8 16h1M12 16h1M2 18h1M4 18h1M12 18h1M15 18h1M21 19h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M3 3h1M3 5h1M20 6h1M9 8h1M3 10h1M20 13h1M4 17h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M4 3h1M6 3h5M12 3h1M14 3h5M20 3h1M20 4h1M13 5h1M3 6h1M9 6h6M3 7h1M9 7h2M13 7h2M20 7h1M14 8h2M20 8h1M3 9h1M13 9h3M20 9h1M13 10h1M20 10h1M3 11h1M11 11h3M20 11h1M12 12h1M20 12h1M11 14h1M20 14h1M11 15h2M20 15h1M20 16h1M3 17h1M5 17h3M10 17h2M16 17h5" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M5 3h1M11 3h1M3 4h1M11 5h1M8 7h1M11 12h1M15 17h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M13 3h1M20 5h1M3 13h1M3 14h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M19 3h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M9 4h1M19 4h1M21 4h1M16 6h1M18 7h1M0 8h1M6 8h1M17 8h1M1 9h1M4 9h1M11 9h1M0 10h1M19 11h1M23 11h1M16 12h1M21 13h1M2 14h1M21 15h1M22 17h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M13 4h1M4 7h1M11 10h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M17 4h1M23 4h1M16 5h1M12 9h1M23 9h1M2 12h1M7 13h1M10 14h1M16 15h1M1 16h1M16 16h1M21 17h1M14 18h1M20 18h2" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M10 5h1M3 8h1M14 10h1M8 17h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M12 5h1M8 8h1M13 17h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M18 5h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M6 6h1M4 12h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M15 7h1M12 10h1M12 14h1M12 17h1M14 17h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M21 7h1M2 9h1M8 12h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M1 11h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M3 12h1M3 15h1M9 17h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M14 13h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M6 14h1" />
			<path stroke="${this.constants.SVG_COLOR_ICON}" d="M3 16h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M1 19h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M3 20h1" />
			<path stroke="${this.constants.SVG_COLOR_BG}" d="M7 20h1" />
			`;
		}

		processAPNGs(element = document) {
			const apngLinks = element.querySelectorAll(
				'a.imgLink[data-filemime="image/png"], a.imgLink[data-filemime="image/apng"]'
			);

			apngLinks.forEach(imgLink => {
				if (!this.settings.staticAPNG) {
					this.restoreAPNG(imgLink);
				} else {
					this.convertAPNGtoStatic(imgLink);
				}
			});
		}

		restoreAPNG(imgLink) {
			const img = imgLink.querySelector('img:not(.imgExpanded)');
			if (img) {
				// Only restore to original if we stored the original source
				if (img.hasAttribute('data-original-src')) {
					img.src = img.getAttribute('data-original-src');
					img.removeAttribute('data-original-src');
				}
				img.style.border = '';
				img.removeAttribute('apng-processed');
			}
		}

		convertAPNGtoStatic(imgLink) {
			const img = imgLink.querySelector('img:not(.imgExpanded)');
			if (!img || img.hasAttribute('apng-processed')) {
				return;
			}

			// Skip images with /t_ in their src, they are always static
			if (img.src.includes('/t_')) return;
			// Skip
			if (img.src.includes('data:image/png;base64,')) return;
			// Skip spoiler images
			if (img.src.includes('spoiler')) return;

			// Skip if image is too large for thumbnail processing
			const dimensionLabel = imgLink.closest(this.selectors.UPLOAD_CELL)?.querySelector(this.selectors.DIMENSION_LABEL);
			if (!dimensionLabel) return;

			const dimensions = this.parseDimensions(dimensionLabel.textContent);
			if (!dimensions || dimensions.width > this.constants.MAX_THUMBNAIL_SIZE.width || dimensions.height > this.constants.MAX_THUMBNAIL_SIZE.height) {
				return;
			}

			// Store original source for restoration
			img.setAttribute('data-original-src', img.src);
			img.setAttribute('apng-processed', 'true');

			GM.xmlHttpRequest({
				method: 'GET',
				url: img.src,
				responseType: 'arraybuffer',
				onload: (response) => {
					this.handleAPNGResponse(response, img)
				},
				onerror: () => {
					console.warn('Failed to load APNG:', img.src);
					this.restoreAPNGImage(img);
				}
			});
		}

		handleAPNGResponse(response, img) {
			try {
				const buffer = response.response;

				if (!this.isAPNG(buffer)) {
					//console.log('Not an APNG, skipping:', img.src);
					this.restoreAPNGImage(img);
					return;
				}

				if (this.settings.debugStuff) {
					const debug_isAPNG = document.createElement('span');
					debug_isAPNG.innerHTML = `isAPNG`;
					img.closest(this.selectors.UPLOAD_CELL)?.querySelector('.uploadDetails').appendChild(debug_isAPNG);
				}

				if (this.settings.apngBorders) {
					img.style.border = this.constants.APNG_BORDER;
				}

				this.convertToStaticFrame(buffer, img);
			} catch (error) {
				console.error('APNG conversion error:', error);
				this.restoreAPNGImage(img);
			}
		}

		restoreAPNGImage(img) {
			if (img.hasAttribute('data-original-src')) {
				img.src = img.getAttribute('data-original-src');
				img.removeAttribute('data-original-src');
			}
			img.style.border = '';
			img.removeAttribute('apng-processed');
		}

		isAPNG(buffer) {
			const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
			const view = new DataView(buffer);

			// Check PNG signature
			for (let i = 0; i < pngSignature.length; i++) {
				if (view.getUint8(i) !== pngSignature[i]) return false;
			}

			// Look for acTL chunk (APNG marker)
			let offset = 8;
			while (offset < view.byteLength) {
				const length = view.getUint32(offset);
				const type = String.fromCharCode(
					view.getUint8(offset + 4),
					view.getUint8(offset + 5),
					view.getUint8(offset + 6),
					view.getUint8(offset + 7)
				);

				if (type === 'acTL') return true;
				if (type === 'IEND') break;

				offset += 12 + length;
			}

			return false;
		}

		convertToStaticFrame(buffer, img) {
			const blob = new Blob([buffer], { type: 'image/png' });
			const reader = new FileReader();

			reader.onload = (e) => {
				const apngImage = new Image();
				apngImage.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = apngImage.naturalWidth;
					canvas.height = apngImage.naturalHeight;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(apngImage, 0, 0);

					// Replace with static frame
					img.src = canvas.toDataURL('image/png');
				};
				apngImage.onerror = () => {
					console.warn('Failed to load APNG image');
					this.restoreAPNGImage(img);
				};
				apngImage.src = e.target.result;
			};

			reader.onerror = () => {
				console.warn('Failed to read APNG blob');
				this.restoreAPNGImage(img);
			};

			reader.readAsDataURL(blob);
		}

		destroy() {
			Object.values(this.observers).forEach(observer => observer.disconnect());
		}
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => new SpoilerAPNGHandler());
	} else {
		new SpoilerAPNGHandler();
	}
})();