// ==UserScript==
// @name         Perplexity Length Indicator Updated
// @namespace    https://lugia19.com
// @version      0.7.1
// @description  Adds character/token count indicator to Perplexity conversations (Russian, with limit)
// @author       lugia19 (modified by user request)
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556037/Perplexity%20Length%20Indicator%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/556037/Perplexity%20Length%20Indicator%20Updated.meta.js
// ==/UserScript==


(function () {
	'use strict';

	const CHECK_INTERVAL = 30000; // Check every 30 seconds
	const RETRY_INTERVAL = 1000; // Retry every 1 second
	const MAX_RETRY_TIME = 30000; // Retry for up to 30 seconds

	// --- Новые настройки ---
	const TOKEN_LIMIT = 32000; // Лимит токенов для предупреждения
	const NORMAL_COLOR = '#B19CD9'; // Нежно-фиолетовый цвет
    const LIMIT_COLOR = '#ef4444'; // Красный цвет (для предупреждения)
	const ALERT_MESSAGE = 'Внимание: достигнут лимит токенов (32000+). \n\nРекомендуется создать новый чат, чтобы избежать проблем: Перплексити начинает терять контекст.';
	// --- Конец новых настроек ---

	let lengthIndicator = null;
	let injectionAttempts = 0;
	let injectionStartTime = 0;
	let injectionRetryTimer = null;
	let alertShown = false; // Флаг, чтобы показывать предупреждение только один раз
	const originalFetch = window.fetch;

	function isConversationPage() {
		// *** ИСПРАВЛЕННАЯ СТРОКА ***
		return window.location.href.match(/https:\/\/www\.perplexity\.ai\/search\/.*-.*$/);
	}

	function getConversationId() {
		const match = window.location.href.match(/https:\/\/www\.perplexity\.ai\/search\/(.*)/);
		return match ? match[1] : null;
	}

	function isLengthIndicatorPresent() {
		return document.querySelector('.perplexity-length-indicator') !== null;
	}

	function injectLengthIndicator() {
		// Find the bottom right container with the help button
		const languageButton = document.querySelector('[data-testid="interface-language-select"]');
		const bottomRightContainer = languageButton?.parentElement?.parentElement
		if (!bottomRightContainer) return false;

		// Create our indicator
		lengthIndicator = document.createElement('span');
		lengthIndicator.className = 'perplexity-length-indicator';

		// Start hidden if not on a conversation page
		if (!isConversationPage()) {
			lengthIndicator.style.display = 'none';
		}

		// Create token counter with styled text
		const counter = document.createElement('div');
		counter.className = 'bg-offsetPlus dark:bg-offsetPlusDark text-textMain dark:text-textMainDark md:hover:text-textOff md:dark:hover:text-textOffDark !bg-background dark:border-borderMain/25 dark:!bg-offset border shadow-subtle border-borderMain/50 font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-full cursor-pointer origin-center whitespace-nowrap inline-flex text-sm h-8 px-3';
		counter.style.display = 'flex';
		counter.style.alignItems = 'center';
		counter.style.justifyContent = 'center';

		// Create the text span with new color and text
		const textSpan = document.createElement('span');
		textSpan.className = 'font-medium';
		textSpan.style.color = NORMAL_COLOR; // Используем нежно-фиолетовый
		textSpan.textContent = 'Токены: 0'; // Используем русский текст

		counter.appendChild(textSpan);

		// Add components to the indicator
		lengthIndicator.appendChild(counter);

		// Add the indicator at the beginning of the container (before the help button)
		bottomRightContainer.insertBefore(lengthIndicator, bottomRightContainer.firstChild);

		// Reset injection retry counters
		clearTimeout(injectionRetryTimer);
		injectionAttempts = 0;
		injectionStartTime = 0;

		return true;
	}

	async function updateLengthIndicator() {
		// If not on a conversation page, hide the indicator
		if (!isConversationPage()) {
			if (lengthIndicator) {
				lengthIndicator.style.display = 'none';
			}
			return;
		}

		// On conversation page, show the indicator
		if (lengthIndicator) {
			lengthIndicator.style.display = '';
		}

		const conversationId = getConversationId();
		if (!conversationId) return;

		try {
			const response = await fetch(`https://www.perplexity.ai/rest/thread/${conversationId}?with_schematized_response=true&limit=9999`);
			const data = await response.json();

			let charCount = 0;

			if (data.entries && Array.isArray(data.entries)) {
				data.entries.forEach(entry => {
					// Add query string length
					if (entry.query_str) {
						charCount += entry.query_str.length;
					}

					// Add response text length
					if (entry.blocks && Array.isArray(entry.blocks)) {
						entry.blocks.forEach(block => {
							if (block.intended_usage === "ask_text" &&
								block.markdown_block &&
								block.markdown_block.answer) {
								charCount += block.markdown_block.answer.length;
							}
						});
					}
				});
			}

			// Estimate tokens (char count / 4)
			const tokenCount = Math.round(charCount / 4);

			// Update the indicator
			if (lengthIndicator) {
				const counterSpan = lengthIndicator.querySelector('span.font-medium');
				if (counterSpan) {
					// Обновляем текст
					counterSpan.textContent = `Токены: ${tokenCount}`;

					// Проверяем лимит, обновляем цвет и показываем предупреждение
					if (tokenCount >= TOKEN_LIMIT) {
						counterSpan.style.color = LIMIT_COLOR; // Красный
						if (!alertShown) {
							alert(ALERT_MESSAGE);
							alertShown = true; // Показываем предупреждение только один раз
						}
					} else {
						counterSpan.style.color = NORMAL_COLOR; // Фиолетовый
					}
				}
			}

		} catch (error) {
			console.error('Error fetching conversation data:', error);
		}
	}

	function startInjectionRetry() {
		// Start tracking injection attempts
		if (injectionStartTime === 0) {
			injectionStartTime = Date.now();
		}

		// Try to inject the indicator
		const injected = injectLengthIndicator();

		// If successful, update the indicator and stop retrying
		if (injected) {
			updateLengthIndicator();
			return;
		}

		// Check if we've reached the maximum retry time
		injectionAttempts++;
		const elapsedTime = Date.now() - injectionStartTime;

		if (elapsedTime < MAX_RETRY_TIME) {
			// Continue retrying
			injectionRetryTimer = setTimeout(startInjectionRetry, RETRY_INTERVAL);
		} else {
			// Reset counters after max retry time
			injectionAttempts = 0;
			injectionStartTime = 0;
			console.log('Failed to inject length indicator after maximum retry time');
		}
	}

	function checkAndUpdate() {
		if (!isLengthIndicatorPresent()) {
			// Start the retry process for injection
			startInjectionRetry();
		} else {
			updateLengthIndicator();
		}
	}

	// Setup fetch interception using the provided pattern
	window.fetch = async (...args) => {
		const [input, config] = args;

		let url;
		if (input instanceof URL) {
			url = input.href;
		} else if (typeof input === 'string') {
			url = input;
		} else if (input instanceof Request) {
			url = input.url;
		}

		const method = config?.method || (input instanceof Request ? input.method : 'GET');
		// Proceed with the original fetch
		const response = await originalFetch(...args);

		// Check if this is a request to the perplexity_ask endpoint
		if (url && url.includes('perplexity.ai/rest/sse/perplexity_ask') && method === 'POST') {
			// Wait a bit for the response to be processed and update
			console.log("UPDATING, GOT RESPONSE!")
			setTimeout(checkAndUpdate, 10000);
		}

		return response;
	};

	// Initial check
	setTimeout(checkAndUpdate, 1000);

	// Set up interval for regular checks
	setInterval(checkAndUpdate, CHECK_INTERVAL);

	// Listen for URL changes (for single-page apps)
	let lastUrl = window.location.href;
	new MutationObserver(() => {
		if (lastUrl !== window.location.href) {
			lastUrl = window.location.href;
			alertShown = false; // Сбрасываем флаг предупреждения при смене чата
			// Update the visibility based on new URL
			if (lengthIndicator) {
				lengthIndicator.style.display = isConversationPage() ? '' : 'none';
			}
			setTimeout(checkAndUpdate, 1000); // Check after URL change
		}
	}).observe(document, { subtree: true, childList: true });
})();