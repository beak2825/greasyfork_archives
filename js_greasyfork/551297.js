// ==UserScript==
// @name         Discord - WebSocket Logger
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Connect to Discord WebSocket and log messages using a bot token
// @author       wormpilled
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551297/Discord%20-%20WebSocket%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/551297/Discord%20-%20WebSocket%20Logger.meta.js
// ==/UserScript==


// BY THE WAY NEVER ALLOW AUTO-UPDATES TO SCRIPTS LIKE THIS THAT DEAL WITH IMPORTANT STUFF !!!

(function () {
	"use strict";
	
	const DISCORD_GATEWAY_URL = "wss://gateway.discord.gg/?v=9&encoding=json";
	const PING_INTERVAL = 41250; // 81 seconds in milliseconds
	let BOT_TOKEN;

	// Fetch the token from localStorage
	function getToken() {
		window.dispatchEvent(new Event("beforeunload"));
		const iframe = document.createElement("iframe");
		document.body.appendChild(iframe);
		const token = JSON.parse(iframe.contentWindow.localStorage.token);
		document.body.removeChild(iframe);
		return token;
	}

	// Send a ping to keep the WebSocket connection alive
	function sendPing(ws) {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ op: 1, d: null }));
			console.info("Ping sent");
		}
	}

	// Handle incoming WebSocket messages
	function handleMessage(event) {
		try {
			const data = JSON.parse(event.data);
			console.warn(data);

			if (data.t === "MESSAGE_CREATE") {
				console.info("New message in channel:", data.d.channel_id, data.d.content);

				const mentions = data.d?.mentions?.map(mention => mention.id);
				if (mentions?.length) {
					console.info("Mentions:", mentions);
				} else {
					console.info("No mentions found in the data");
				}
			}
		} catch (error) {
			console.error("Error parsing WebSocket message:", error);
		}
	}

	// Setup WebSocket connection
	function setupWebSocket() {
		const ws = new WebSocket(DISCORD_GATEWAY_URL);

		ws.addEventListener("open", () => {
			console.info("Connected to Discord WebSocket");

			const identifyPayload = {
				op: 2,
				d: {
					token: BOT_TOKEN,
					capabilities: 32767,
					properties: {
						os: "Linux",
						browser: "Firefox",
						device: "",
						system_locale: "en-US",
						browser_user_agent:
						"Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
												browser_version: "126.0",
											referrer: "https://discord.com/",
											referring_domain: "discord.com",
											release_channel: "stable",
											client_event_source: null,
					},
				},
			};

			ws.send(JSON.stringify(identifyPayload));
			setInterval(() => sendPing(ws), PING_INTERVAL);
		});

		ws.addEventListener("message", handleMessage);
		ws.addEventListener("error", error => console.error("WebSocket error:", error));
		ws.addEventListener("close", event => {
			console.info(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
			setupWebSocket();
		});
	}

	// Wait for Discord to fully load before setting up WebSocket
	function waitForDiscordLoad() {
		if (document.readyState === "complete") {
			BOT_TOKEN = getToken();
			setupWebSocket();
		} else {
			setTimeout(waitForDiscordLoad, 1000);
		}
	}

	waitForDiscordLoad();
})();
