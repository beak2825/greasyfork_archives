// ==UserScript==
// @name      بهبود فونت و راست‌چین کردن سایتهای مشخص
// @namespace    http://nimabehkar.ir
// @version      0.9.4
// @description  ررر
// @author       NimaBhk
// @license      MIT License
// @match        *://gemini.google.com/*
// @match        *://chatgpt.com/*
// @match        *://app.todoist.com/*
// @match        *://grok.com/*
// @match        *://chat.deepseek.com/*
// @match        *://keep.google.com/*
// @match        *://claude.ai/*
// @match        *://idx.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560763/%D8%A8%D9%87%D8%A8%D9%88%D8%AF%20%D9%81%D9%88%D9%86%D8%AA%20%D9%88%20%D8%B1%D8%A7%D8%B3%D8%AA%E2%80%8C%DA%86%DB%8C%D9%86%20%DA%A9%D8%B1%D8%AF%D9%86%20%D8%B3%D8%A7%DB%8C%D8%AA%D9%87%D8%A7%DB%8C%20%D9%85%D8%B4%D8%AE%D8%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/560763/%D8%A8%D9%87%D8%A8%D9%88%D8%AF%20%D9%81%D9%88%D9%86%D8%AA%20%D9%88%20%D8%B1%D8%A7%D8%B3%D8%AA%E2%80%8C%DA%86%DB%8C%D9%86%20%DA%A9%D8%B1%D8%AF%D9%86%20%D8%B3%D8%A7%DB%8C%D8%AA%D9%87%D8%A7%DB%8C%20%D9%85%D8%B4%D8%AE%D8%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // اعمال فونت و استایل‌های عمومی
    GM_addStyle(`
        /* Import all fonts in one go */
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@700;800&family=Cairo+Play:wght@400;700&family=Handjet:wght@400&family=Lalezar&effect=3d-float&family=Noto+Nastaliq+Urdu:wght@500&family=Rubik:wght@300&display=swap');

        /* General font for all specified websites, with Rubik as fallbacks */
        body, p, div, span, h3, h4, h5, h6, li, td, th, button, input, textarea, select {
            font-family: 'Rubik', sans-serif !important;
        }
		/* General shadow for head titles /
		h1, h1 span, h1 strong, h1 b, h2, h2 span, h2 strong, h2 b {
			text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.6);
		} */

        h1, h1 span {
            font-family: 'Lalezar', 'Rubik', cursive !important;
            font-weight: 400 !important;
            font-size: 30px !important;
        }

        h1 strong, h1 b {
            font-family: 'Noto Nastaliq Urdu', 'Rubik', serif !important;
            font-weight: 500 !important; /* Noto Nastaliq Urdu Medium 500 */
            font-size: 28px !important;
        }

        h2, h2 span {
            font-family: 'Baloo Bhaijaan 2', 'Rubik', cursive !important;
            font-weight: 700 !important; /* Baloo Bhaijaan 2 Bold 700 */
            font-size: 20px !important;
        }

        h2 strong, h2 b {
            font-family: 'Cairo Play', 'Rubik', serif !important;
            font-weight: 700 !important;
            font-size: 25px !important;
        }

        /* Styles for bold normal text (paragraphs, divs, spans, etc.) */
        p strong, p b,
        div:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) strong, /* Ensures it doesn't override heading's direct strong tags if structure is complex */
        div:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) b,
        span strong, span b,
        li strong, li b,
        td strong, td b,
        th strong, th b {
            font-family: 'Baloo Bhaijaan 2', 'Rubik', sans-serif !important;
            font-weight: 800 !important;
			font-size: small !important;
			//background-color: rgba(250, 211, 62, 0.4);
        }

        /* Styles for italic normal text (paragraphs, divs, spans, etc.) */
        p em, p i,
        div:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) em,
        div:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) i,
        span em, span i,
        li em, li i,
        td em, td i,
        th em, th i {
            font-family: 'Handjet', 'Rubik', cursive !important;
            font-weight: 400 !important; /* Handjet Weight 400 */
            font-variation-settings: 'ELSH' 0.6 !important; /* Handjet Element Shape 0.6 */
        }

        /* Styles for code elements */
        pre, code, kbd, samp, tt { /* تگ‌های رایج برای نمایش کد */
            font-family: 'Cairo Play', 'Rubik', monospace !important; /* Cairo Play طبق درخواست، monospace به عنوان فونت پشتیبان نهایی برای کد */
            font-weight: 400 !important; /* وزن معمولی برای خوانایی کد */
            direction: ltr !important;   /* اطمینان از چینش چپ به راست برای کد */
            text-align: left !important;  /* اطمینان از تراز چپ برای کد */
            unicode-bidi: embed !important; /* کمک به ایزوله‌سازی بهتر جهت‌نمایی در محیط راست‌چین */
        }
        pre code {
            font-family: inherit !important; /* ارث‌بری فونت از تگ pre */
            font-weight: inherit !important; /* ارث‌بری وزن فونت از تگ pre */
            direction: inherit !important;   /* ارث‌بری جهت از تگ pre */
            text-align: inherit !important;  /* ارث‌بری تراز از تگ pre */
            background-color: transparent !important; /* جلوگیری از پس‌زمینه دوگانه */
            border: none !important;
            padding: 0 !important;
            unicode-bidi: inherit !important;
        }
    `);

    // بررسی آدرس سایت فعلی برای اعمال استایل‌های خاص
    const hostname = window.location.hostname;

    if (hostname === "gemini.google.com" || hostname === "chatgpt.com") {
        GM_addStyle(`
            p, div[class*="prose"] {
                direction: rtl !important;
                text-align: right !important;
            }
            textarea {
                direction: rtl !important;
                text-align: right !important;
            }
        `);
    } else if (hostname === "app.todoist.com") {
        GM_addStyle(`
            div, p, span {
                text-align: right !important;
                font-size: 15px !important; /* This might be overridden by new global styles for p, div, span if font-size is not specified there. Consider if this specific font-size is still needed or should be adapted. */
                font-weight: 900 !important; /* This will likely be overridden by new font rules if they target the same elements with !important */
                font-style: normal !important;
            }
            .task_content, .item_content {
                direction: rtl !important;
                text-align: right !important;
            }
            button.board_task__button {
                direction: rtl !important;
            }
            .public-DraftEditor-content, .ProseMirror, textarea, input[type="text"] {
                direction: rtl !important;
                text-align: right !important;
            }
        `);
    } else if (hostname === "grok.com") {
        GM_addStyle(`
            div, p {
                direction: rtl !important;
                text-align: right !important;
            }
            textarea[placeholder*="Message Grok"] {
                direction: rtl !important;
                text-align: right !important;
            }
        `);
    } else if (hostname === "chat.deepseek.com") {
        GM_addStyle(`
            #chat-input, textarea[placeholder*="Send a message"] {
                text-align: right !important;
                direction: rtl !important;
            }
            #root > div, div[class*="message_container"] {
                text-align: right !important;
                direction: rtl !important;
            }
            div[class*="message-content"], div[class*="prose"], div[class*="message-text"] {
                direction: rtl !important;
                text-align: right !important;
            }
            div[class*="message-content"] p, div[class*="prose"] p, div[class*="message-text"] p {
                direction: rtl !important;
                text-align: right !important;
            }
        `);
    } else if (hostname === "keep.google.com") {
		GM_addStyle(`
			.editable {
				direction: rtl !important;
				text-align: right !important;
			}
			.note-title-container .editable {
				direction: rtl !important;
				text-align: right !important;
			}

			/* Auto center align for H1 and H2 (Priority 2) */
			h1, h2 {
				text-align: center !important;
			}

			/* Italic Paragraph Text */
			p span[class*="-O807Gb"] {
				font-family: 'Rubik', cursive !important;
				font-weight: 400 !important;
				font-size: small;
				font-style: italic !important;
			}

			/* Bold Paragraph Text */
			p span[class*="-c8csvc"] {
				font-family: 'Baloo Bhaijaan 2', sans-serif !important;
				font-weight: 400 !important;
				font-style: normal !important;
				font-size: medium !important;
				// background-color: rgba(250, 211, 62, 0.4) !important;
			}

			/* Underlined AND Bold Paragraph Text */
			p span[class*="-c8csvc"][class*="-NowJzb"] {
				font-size: medium !important;
				text-decoration: none !important;
				background-color: rgba(255, 0, 0, 0.6) !important;
			}

			/* Bold H1 Text */
			h1 span[class*="-c8csvc"] {
				font-family: 'Noto Nastaliq Urdu', 'Rubik', serif !important;
				font-weight: 500 !important; /* Noto Nastaliq Urdu Medium 500 */
				font-size: 30px !important;
			}

			/* Bold H2 Text */
			h2 span[class*="-c8csvc"] {
				font-family: 'Cairo Play', 'Rubik', serif !important;
				font-weight: 400 !important;
				font-size: larger !important;
			}

			/* Underlined H1 Text */
			h1 span[class*="-NowJzb"] {
				text-shadow:
				 0px 0px 0 rgb(173,173,173),
				 1px 1px 0 rgb(134,134,134),
				 2px 2px 0 rgb(95,95,95),
				 3px 3px 0 rgb(56,56,56),
				 4px 4px 0 rgb(17,17,17),
				 5px 5px 0 rgb(-22,-22,-22),
				 6px 6px 5px rgba(0,0,0,0.5),
				 6px 6px 1px rgba(0,0,0,0.5),
				 0px 0px 5px rgba(0,0,0,.2) !important;
				text-decoration: none !important;
			}

			/* Underlined H2 Text */
			h2 span[class*="-NowJzb"] {
				text-shadow:
				-1px -1px 0 #D82C2A, 1px -1px 0 #D82C2A, -1px 1px 0 #D82C2A, 1px 1px 0 #D82C2A,
				 2px  2px 0 #D82C2A,
				 3px  3px 0 #D82C2A,
				 4px  4px 0 #D82C2A,
				 6px  6px 8px rgba(0,0,0,0.35) !important;
				text-decoration: none !important;
			}

			/* Forced alignment directives (Priority 1 - Highest) */
			.keep-style-forced-right {
				text-align: right !important;
			}
			.keep-style-forced-left {
				text-align: left !important;
			}
			.keep-style-forced-center {
				text-align: center !important;
			}

			/* Hide style directives when not in edit mode */
			.keep-style-directive {
				display: none !important;
			}
			[contenteditable="true"] .keep-style-directive,
			[contenteditable="true"].keep-style-directive {
				display: inline !important;
			}
	`);

		// Style directive processor for Google Keep
		(function() {
			'use strict';

			// Color name to hex mapping
			const colorMap = {
				'red': '#ff0000',
				'blue': '#0000ff',
				'green': '#008000',
				'white': '#ffffff',
				'black': '#000000',
				'yellow': '#ffff00',
				'orange': '#ffa500',
				'purple': '#800080',
				'pink': '#ffc0cb',
				'cyan': '#00ffff',
				'magenta': '#ff00ff',
				'lime': '#00ff00',
				'navy': '#000080',
				'maroon': '#800000',
				'olive': '#808000',
				'teal': '#008080',
				'aqua': '#00ffff',
				'silver': '#c0c0c0',
				'gray': '#808080',
				'grey': '#808080'
			};

			// Parse color code (supports hex with optional transparency)
			function parseColorCode(code) {
				// Check for transparency
				const transparencyMatch = code.match(/^([0-9a-fA-F]{3,6})%(\d+)$/);
				if (transparencyMatch) {
					const hex = transparencyMatch[1];
					const alpha = parseInt(transparencyMatch[2]) / 100;
					return { hex: normalizeHex(hex), alpha: alpha };
				}
				return { hex: normalizeHex(code), alpha: 1 };
			}

			// Normalize hex color (3 to 6 digits)
			function normalizeHex(hex) {
				if (hex.length === 3) {
					return '#' + hex.split('').map(c => c + c).join('');
				}
				return '#' + hex;
			}

			// Get color value (name or hex)
			function getColorValue(colorStr) {
				// Check for transparency in color name or hex
				const transparencyMatch = colorStr.match(/^([a-zA-Z0-9#]+)%(\d+)$/);
				if (transparencyMatch) {
					const baseColor = transparencyMatch[1];
					const alpha = parseInt(transparencyMatch[2]) / 100;
					const lowerColor = baseColor.toLowerCase();

					// Check if it's a named color
					if (colorMap[lowerColor]) {
						return { hex: colorMap[lowerColor], alpha: alpha };
					}
					// Try to parse as hex code
					if (/^[0-9a-fA-F]{3,6}$/i.test(baseColor)) {
						return { hex: normalizeHex(baseColor), alpha: alpha };
					}
					return null;
				}

				// No transparency
				const lowerColor = colorStr.toLowerCase();
				if (colorMap[lowerColor]) {
					return { hex: colorMap[lowerColor], alpha: 1 };
				}
				// Try to parse as hex code
				if (/^[0-9a-fA-F]{3,6}$/i.test(colorStr)) {
					return parseColorCode(colorStr);
				}
				return null;
			}

			// Process style directives in text
			function processStyleDirectives(element) {
				if (!element) return;

				const isEditable = element.getAttribute('contenteditable') === 'true' ||
								   element.closest('[contenteditable="true"]');

				// Get text content - handle both text nodes and HTML content
				let textContent = '';
				if (element.nodeType === Node.TEXT_NODE) {
					textContent = element.textContent;
				} else {
					// Get all text nodes
					const walker = document.createTreeWalker(
						element,
						NodeFilter.SHOW_TEXT,
						null,
						false
					);
					const textNodes = [];
					let node;
					while (node = walker.nextNode()) {
						textNodes.push(node);
					}
					if (textNodes.length === 0) return;

					// Get full text
					textContent = element.textContent || '';
				}

				if (!textContent.trim()) return;

				// Patterns for directives at start or end of text
				// :::color or :::hex = text color
				// ::color or ::hex = background color
				// :::r, :::l, :::c = alignment
				// Support multiple directives in sequence (with or without spaces)
				// Allow spaces before/after directives - spaces after directives are optional and should be removed
				const directivePattern = /(:::?)([a-zA-Z0-9]+(?:%\d+)?)/g;
				// Match directives at start: allow spaces before, between, and one optional space after
				const startPattern = /^(\s*)((?::::?[a-zA-Z0-9]+(?:%\d+)?)(?:\s+(?::::?[a-zA-Z0-9]+(?:%\d+)?))*)\s*/;
				// Match directives at end: allow one optional space before, spaces between, and spaces after
				const endPattern = /\s*((?::::?[a-zA-Z0-9]+(?:%\d+)?)(?:\s+(?::::?[a-zA-Z0-9]+(?:%\d+)?))*)(\s*)$/;

				const directives = [];
				let processedText = textContent;

				// Check start of text - find all directives at start
				const startMatch = textContent.match(startPattern);
				if (startMatch) {
					const startDirectives = startMatch[2]; // The directives part (without leading/trailing spaces)
					let match;
					const startRegex = new RegExp(directivePattern.source, 'g');
					while ((match = startRegex.exec(startDirectives)) !== null) {
						directives.push({
							fullMatch: match[0],
							prefix: match[1],
							value: match[2],
							position: 'start'
						});
					}
					// Remove all start directives including leading spaces and trailing space
					processedText = processedText.replace(startPattern, '');
				}

				// Check end of text - find all directives at end (after removing start directives)
				const endMatch = processedText.match(endPattern);
				if (endMatch) {
					const endDirectives = endMatch[1]; // The directives part (without leading/trailing spaces)
					let match;
					const endRegex = new RegExp(directivePattern.source, 'g');
					while ((match = endRegex.exec(endDirectives)) !== null) {
						directives.push({
							fullMatch: match[0],
							prefix: match[1],
							value: match[2],
							position: 'end'
						});
					}
					// Remove all end directives including leading space and trailing spaces
					processedText = processedText.replace(endPattern, '');
				}

				// Check for strikethrough directive (--- at start or end with space before/after)
				// Allow multiple spaces before/after
				const strikethroughStartPattern = /^\s+---\s+/;
				const strikethroughEndPattern = /\s+---\s+$/;
				let hasStrikethrough = false;

				if (strikethroughStartPattern.test(processedText) || strikethroughEndPattern.test(processedText)) {
					hasStrikethrough = true;
					processedText = processedText.replace(strikethroughStartPattern, '').replace(strikethroughEndPattern, '');
				}

				// Apply directives
				let hasAlignment = false;
				let alignmentValue = null;
				const styles = {};

				for (const dir of directives) {
					// Alignment directives (highest priority)
					if (dir.prefix === ':::' && (dir.value === 'r' || dir.value === 'l' || dir.value === 'c')) {
						hasAlignment = true;
						if (dir.value === 'r') alignmentValue = 'right';
						else if (dir.value === 'l') alignmentValue = 'left';
						else if (dir.value === 'c') alignmentValue = 'center';
					}
					// Color directives
					else {
						const colorInfo = getColorValue(dir.value);
						if (colorInfo) {
							if (dir.prefix === ':::') {
								// Text color
								if (colorInfo.alpha < 1) {
									const rgb = hexToRgb(colorInfo.hex);
									styles.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${colorInfo.alpha})`;
								} else {
									styles.color = colorInfo.hex;
								}
							} else if (dir.prefix === '::') {
								// Background color
								if (colorInfo.alpha < 1) {
									const rgb = hexToRgb(colorInfo.hex);
									styles.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${colorInfo.alpha})`;
								} else {
									styles.backgroundColor = colorInfo.hex;
								}
							}
						}
					}
				}

				// Apply styles to the element (not text node)
				const targetElement = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
				if (!targetElement) return;

				// Apply alignment (highest priority)
				if (hasAlignment && alignmentValue) {
					targetElement.classList.remove('keep-style-forced-right', 'keep-style-forced-left', 'keep-style-forced-center');
					targetElement.classList.add(`keep-style-forced-${alignmentValue}`);
					targetElement.style.setProperty('text-align', alignmentValue, 'important');
				}

				// Apply colors
				if (styles.color) {
					targetElement.style.setProperty('color', styles.color, 'important');
				}
				if (styles.backgroundColor) {
					targetElement.style.setProperty('background-color', styles.backgroundColor, 'important');
				}

				// Apply or remove strikethrough
				if (hasStrikethrough) {
					targetElement.style.setProperty('text-decoration', 'line-through', 'important');
				} else {
					// Remove strikethrough if directive is missing or incomplete
					// Check if element currently has strikethrough from our script
					if (targetElement.dataset.keepStyleStrikethrough === 'true' ||
						targetElement.style.textDecoration === 'line-through') {
						targetElement.style.removeProperty('text-decoration');
						// Also remove the data attribute if it exists
						delete targetElement.dataset.keepStyleStrikethrough;
					}
				}

				// Remove directives from text if not in edit mode
				if (!isEditable && (directives.length > 0 || hasStrikethrough) && processedText !== textContent) {
					// Store directives in data attribute for restoration when editing
					if (directives.length > 0) {
						targetElement.dataset.keepStyleDirectives = JSON.stringify(directives);
					}
					if (hasStrikethrough) {
						targetElement.dataset.keepStyleStrikethrough = 'true';
					}

					// Process text nodes within element to remove directives
					const walker = document.createTreeWalker(
						targetElement,
						NodeFilter.SHOW_TEXT,
						null,
						false
					);
					const textNodes = [];
					let node;
					while (node = walker.nextNode()) {
						textNodes.push(node);
					}

					if (textNodes.length > 0) {
						// Get full text content first
						let fullText = Array.from(textNodes).map(n => n.textContent).join('');

						// Remove strikethrough
						fullText = fullText.replace(strikethroughStartPattern, '');
						fullText = fullText.replace(strikethroughEndPattern, '');

						// Remove start directives
						if (startMatch) {
							fullText = fullText.replace(startPattern, '');
						}

						// Remove end directives
						if (endMatch) {
							fullText = fullText.replace(endPattern, '');
						}

						// Update text nodes - try to preserve structure
						if (textNodes.length === 1) {
							// Single text node - simple update
							textNodes[0].textContent = fullText;
						} else {
							// Multiple text nodes - update first and last, clear middle
							if (textNodes[0]) {
								// Put all text in first node for simplicity
								textNodes[0].textContent = fullText;
								// Clear other nodes
								for (let i = 1; i < textNodes.length; i++) {
									textNodes[i].textContent = '';
								}
							}
						}
					}
				}
			}

			// Restore directives to text when entering edit mode
			function restoreDirectives(element) {
				if (!element) return;
				const targetElement = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
				if (!targetElement) return;

				let shouldRestore = false;
				let startDirectives = '';
				let endDirectives = '';
				let startStrikethrough = false;
				let endStrikethrough = false;

				// Restore style directives
				if (targetElement.dataset.keepStyleDirectives) {
					try {
						const savedDirectives = JSON.parse(targetElement.dataset.keepStyleDirectives);
						const startDirs = savedDirectives.filter(d => d.position === 'start');
						const endDirs = savedDirectives.filter(d => d.position === 'end');

						if (startDirs.length > 0) {
							startDirectives = startDirs.map(d => d.fullMatch).join(' ');
							shouldRestore = true;
						}
						if (endDirs.length > 0) {
							endDirectives = endDirs.map(d => d.fullMatch).join(' ');
							shouldRestore = true;
						}
					} catch (e) {
						// Ignore parse errors
					}
				}

				// Restore strikethrough
				if (targetElement.dataset.keepStyleStrikethrough === 'true') {
					// Check if strikethrough was at start or end by checking current text
					const currentText = targetElement.textContent || '';
					// We'll add it at the end by default, but user can move it
					endStrikethrough = true;
					shouldRestore = true;
				}

				if (shouldRestore) {
					const walker = document.createTreeWalker(
						targetElement,
						NodeFilter.SHOW_TEXT,
						null,
						false
					);
					const textNodes = [];
					let node;
					while (node = walker.nextNode()) {
						textNodes.push(node);
					}

					if (textNodes.length > 0) {
						// Add start directives
						if (startDirectives) {
							if (textNodes[0]) {
								// Add space after directives
								textNodes[0].textContent = startDirectives + ' ' + textNodes[0].textContent;
							}
						}
						if (startStrikethrough) {
							if (textNodes[0]) {
								textNodes[0].textContent = ' --- ' + textNodes[0].textContent;
							}
						}

						// Add end directives
						if (endDirectives) {
							if (textNodes[textNodes.length - 1]) {
								// Add space before directives
								textNodes[textNodes.length - 1].textContent = textNodes[textNodes.length - 1].textContent + ' ' + endDirectives;
							}
						}
						if (endStrikethrough) {
							if (textNodes[textNodes.length - 1]) {
								textNodes[textNodes.length - 1].textContent = textNodes[textNodes.length - 1].textContent + ' --- ';
							}
						}
					}

					// Clear the data attributes so they don't get restored again
					delete targetElement.dataset.keepStyleDirectives;
					delete targetElement.dataset.keepStyleStrikethrough;
				}
			}

			// Convert hex to RGB
			function hexToRgb(hex) {
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : { r: 0, g: 0, b: 0 };
			}

			// Process all editable elements
			function processAllElements() {
				// Find all elements that might contain text (h1, h2, p, span with contenteditable)
				// Focus on Google Keep specific structure
				const selectors = [
					'h1', 'h2', 'p',
					'span.vIzZGf-fmcmS',
					'div.IZ65Hb-vIzZGf-L9AdLc-haAclf',
					'[contenteditable="true"]',
					'[contenteditable="false"]'
				];

				selectors.forEach(selector => {
					try {
						const elements = document.querySelectorAll(selector);
						elements.forEach(el => {
							// Skip if already processed recently
							if (el.dataset.keepStyleProcessed) {
								// Reset flag to allow reprocessing
								delete el.dataset.keepStyleProcessed;
							}
							// Check if element contains text nodes
							if (el.textContent && el.textContent.trim()) {
								processStyleDirectives(el);
							}
						});
					} catch (e) {
						console.warn('Error processing selector:', selector, e);
					}
				});
			}

			// Setup MutationObserver
			const observer = new MutationObserver(function(mutations) {
				let shouldProcess = false;
				mutations.forEach(function(mutation) {
					if (mutation.type === 'childList' || mutation.type === 'characterData') {
						shouldProcess = true;
					}
				});
				if (shouldProcess) {
					// Debounce processing
					clearTimeout(window.keepStyleProcessorTimeout);
					window.keepStyleProcessorTimeout = setTimeout(processAllElements, 100);
				}
			});

			// Start observing
			function startObserving() {
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					characterData: true
				});
			}

			// Initialize when DOM is ready
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', function() {
					processAllElements();
					startObserving();
				});
			} else {
				processAllElements();
				startObserving();
			}

			// Process on focus events (when entering edit mode) - restore directives
			document.addEventListener('focusin', function(e) {
				const target = e.target;
				const editableElement = target.getAttribute('contenteditable') === 'true'
					? target
					: target.closest('[contenteditable="true"]');

				if (editableElement) {
					// Restore directives immediately when entering edit mode
					setTimeout(() => {
						restoreDirectives(editableElement);
						// Process after a short delay to ensure directives are visible
						setTimeout(() => processStyleDirectives(editableElement), 100);
					}, 10);
				}
			});

			// Process on blur events (when leaving edit mode) - hide directives
			document.addEventListener('blur', function(e) {
				const target = e.target;
				const editableElement = target.getAttribute('contenteditable') === 'true'
					? target
					: target.closest('[contenteditable="true"]');

				if (editableElement) {
					// Process and hide directives when leaving edit mode
					setTimeout(() => {
						processStyleDirectives(editableElement);
					}, 50);
				}
			}, true); // Use capture phase to catch blur events

			// Process on Enter key - hide directives
			document.addEventListener('keydown', function(e) {
				if (e.key === 'Enter') {
					const target = e.target;
					const editableElement = target.getAttribute('contenteditable') === 'true'
						? target
						: target.closest('[contenteditable="true"]');

					if (editableElement) {
						// Process and hide directives on Enter
						setTimeout(() => {
							processStyleDirectives(editableElement);
						}, 50);
					}
				}
			}, true);

			// Process on input events (typing, deleting) - update styles in real-time
			// Use debouncing to avoid too many calls
			let inputTimeout = null;
			document.addEventListener('input', function(e) {
				const target = e.target;
				const editableElement = target.getAttribute('contenteditable') === 'true'
					? target
					: target.closest('[contenteditable="true"]');

				if (editableElement) {
					// Debounce processing
					clearTimeout(inputTimeout);
					inputTimeout = setTimeout(() => {
						processStyleDirectives(editableElement);
					}, 150);
				}
			}, true);

		})();
    } else if (hostname === "claude.ai") {
        GM_addStyle(`
            div.flex > div:first-child.h-screen p,
			div.flex > div:first-child.h-screen div {
                direction: rtl !important;
                text-align: right !important;
            }
            pre, code {
                direction: ltr !important;
                text-align: left !important;
            }

        `);

    } else if (hostname === "idx.google.com") {
        const idxStyle = `
            .He.Ta, div.H, .He {
                direction: rtl !important;
                text-align: right !important;
                font-weight: 900 !important;
                font-style: normal !important;
                font-family: 'Rubik', sans-serif !important;
            }
        `;

        // Function to inject style into a shadow root
        // این تابع استایل را به داخل روت‌های مخفی تزریق می‌کند
        const injectShadowStyle = (root) => {
            if (root && !root.querySelector('#my-custom-idx-style')) {
                const style = document.createElement('style');
                style.id = 'my-custom-idx-style';
                style.textContent = idxStyle;
                root.appendChild(style);
            }
        };

        // Recursive function to find all shadow roots
        // جستجوی بازگشتی برای پیدا کردن تمام روت‌های مخفی در صفحه
        const processElements = (nodes) => {
            nodes.forEach(node => {
                if (node.shadowRoot) {
                    injectShadowStyle(node.shadowRoot);
                    processAllShadows(node.shadowRoot); // Look deeper
                }
                if (node.children) {
                    processElements(Array.from(node.children));
                }
            });
        };

        const processAllShadows = (root) => {
            const elements = root.querySelectorAll('*');
            processElements(Array.from(elements));
        };

        // Monitor DOM for new shadow roots
        // پایش مداوم صفحه برای المان‌های جدیدی که لود می‌شوند
        const observer = new MutationObserver((mutations) => {
            processAllShadows(document);
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Initial run
        processAllShadows(document);

        // اضافه کردن استایل به سند اصلی برای اطمینان
        GM_addStyle(idxStyle);
    }

})();
