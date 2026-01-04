// ==UserScript==
// @name         SchaleDB Audio CORP fix for Firefox
// @namespace    kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @version      0001
// @description  This script fixes broken audio elements that won't play due to CORP by replacing audio elements with iframes.
// @author       kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @icon         https://www.google.com/s2/favicons?sz=64&domain=schaledb.com
// @match        *://schaledb.com/*
// @grant        none
// @license      CC0 1.0
// @downloadURL https://update.greasyfork.org/scripts/557109/SchaleDB%20Audio%20CORP%20fix%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/557109/SchaleDB%20Audio%20CORP%20fix%20for%20Firefox.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function replaceAudioWithIframe() {
		const audioElements = document.body.querySelectorAll('audio');

		audioElements.forEach((audio, index) => {
			const source = audio.querySelector('source');
			if (source && source.src) {
				const uniqueId = 'audio-iframe-' + index;
				let iframeId = uniqueId;

				if (source.src) {
					try {
						// Ensure src has a protocol for consistent parsing
						const url = new URL(source.src, window.location.origin);
						const parts = url.pathname.split("/").filter(Boolean); // remove empty strings

						if (parts.length === 3) {
							iframeId = parts.slice(1, 3).join("/");
						}
					} catch (e) {
						// fallback if URL constructor fails
						iframeId = uniqueId;
					}
				}

				const iframe = document.createElement('iframe');
				iframe.id = iframeId;
				//iframe.sandbox = 'allow-scripts allow-same-origin';
				//iframe.allow = 'autoplay';

				const audioHTML = `
					<!DOCTYPE html>
					<html>
                    <head>
                        <meta charset="utf-8">
                        <title>Audio Player</title>
                        <style>
							body {
								margin: 0;
								padding: 0;
								background: transparent;
								overflow: clip;
							}
							audio {
								width: 100%;
								height: 40px;
								overflow: clip;
								color-scheme: dark;
							}
						</style>
					</head>
					<body>
						<audio controls preload="metadata" src="${source.src}">
							Audio element not supported.
						</audio>
						<script>
							// Set volume to 0.2 when the audio element is ready
							document.addEventListener('DOMContentLoaded', function() {
								const audio = document.querySelector('audio');
								audio.volume = 0.2;
							});
						</script>
					</body>
					</html>
				`;

				iframe.src = source.src; // If a browser does not support the srcdoc attribute, it will fall back to the URL in the src attribute.
				iframe.srcdoc = audioHTML;
				iframe.width = '300';
				iframe.height = '40';
				iframe.overflow = 'clip';
				iframe.style.background = 'transparent';
				iframe.style.backgroundColor = 'transparent';
				iframe.style.border = '0px none transparent';
				iframe.style.padding = '0px';
				iframe.style.overflow = 'hidden';

				audio.parentNode.replaceChild(iframe, audio);
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', replaceAudioWithIframe);
	} else {
		replaceAudioWithIframe();
	}

	const observer = new MutationObserver(function(mutations) {
		let shouldRun = false;
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length) {
				shouldRun = true;
			}
		});
		if (shouldRun) {
			setTimeout(replaceAudioWithIframe, 250);
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
})();