// ==UserScript==
// @name         Observe
// @license      MIT
// @version      2.2
// @description  Observe and wait for elements
// @author       tukars
// @match        *://*/*
// ==/UserScript==

(function () {
	const timeStamp = function () {
		const now = new Date();
		const pad = (num, size) => String(num).padStart(size, "0");

		const hours = pad(now.getHours(), 2);
		const minutes = pad(now.getMinutes(), 2);
		const seconds = pad(now.getSeconds(), 2);
		const milliseconds = pad(now.getMilliseconds(), 3);

		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	};

	const contextPrint = function (message, ENABLE_DEBUG_LOGGING) {
		const messageTime = () => `[${message}] ${timeStamp()} -`;

		const log = function (...args) {
			console.log(messageTime(), ...args);
		};
		const warn = function (...args) {
			console.warn(messageTime(), ...args);
		};
		const error = function (...args) {
			console.error(messageTime(), ...args);
		};
		const info = function (...args) {
			console.info(messageTime(), ...args);
		};
		var debug = function (...args) {
			console.debug(messageTime(), ...args);
		};
		if (!ENABLE_DEBUG_LOGGING) {
			debug = function () { };
		}

		return { log, warn, error, info, debug };
	};

	const observeChildren = function (element, config, callback) {
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					callback(Array.from(mutation.addedNodes));
				}
			}
		});
		const use_config = config || { childList: true, subtree: false };
		observer.observe(element, use_config);
		return observer;
	};

	const observeChildrenWithFilter = function (element, config, filter, callback) {
		return observeChildren(element, config, (addedNodes) =>
			callback(addedNodes.filter(filter))
		);
	};
	
	const observeChildrenWithSelector = function(element, config, selector, callback) {
		return observeChildrenWithFilter(
			element,
			config,
			(node) =>
				node.nodeType === Node.ELEMENT_NODE &&
				node.matches(selector),
			callback
		);
	};
	
	const observeAndHandle = function(
		element, selector, fun, config = { childList: true, subtree: true } 
	) { 
		return observeChildrenWithSelector(element, config, selector, (nodes) => 
			nodes.forEach((node) => fun(node))
		);
	};

	async function waitForElement(selector, timeoutMs = 0, parent = document) {
		return new Promise((resolve, reject) => {
			const element = parent.querySelector(selector);
			if (element) {
				resolve(element);
				return;
			}
			const observer = observeChildren(parent, { childList: true, subtree: true }, () => {
				const el = parent.querySelector(selector);
				if (!el) { return; }
				
				observer.disconnect();
				resolve(el);
			});
			
			if (timeoutMs == 0) { return; }
			
			setTimeout(() => {
				observer.disconnect();
				reject(new Error(`waitForElement timed out after ${timeoutMs}ms for selector: "${selector}"`));
			}, timeoutMs);
		});
	}
	
	const NAMESPACE = { author: "tukars", library: "Observe" };
	const assign = function (namespace, object) {
		const root = "userscript";
		const domain = "com";
		const author = namespace.author;
		const library = namespace.library;
		window[root] = window[root] || {};
		window[root][domain] = window[root][domain] || {};
		window[root][domain][author] = window[root][domain][author] || {};
		if (window[root][domain][author][library]) { return; }
		window[root][domain][author][library] = object;
	}

	assign(NAMESPACE, {
		timeStamp,
		contextPrint,
		observeChildren,
		observeChildrenWithFilter,
		observeChildrenWithSelector,
		observeAndHandle,
		waitForElement
	});
})();