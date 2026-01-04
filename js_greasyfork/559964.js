// ==UserScript==
// @name         ChatGPT Notion Connector Fix
// @namespace    https://gist.github.com/khanra17/b640ebaa12a3bd5cc7f7d3a1cb39f5ec/raw/chatgpt-notion-fix.user.js
// @version      1.0
// @description  Fixes the broken Notion connector in ChatGPT by injecting metadata into the list_accessible and system_hints API responses
// @author       khanra17
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559964/ChatGPT%20Notion%20Connector%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559964/ChatGPT%20Notion%20Connector%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Define the Notion Connector Object (for list_accessible)
    const NOTION_CONNECTOR = {
        "id": "connector_37316be7febe4224b3d31465bae4dbd7",
        "name": "Notion",
        "description": "Search and reference your Notion pages",
        "branding": null,
        "app_metadata": {
            "review": { "status": "UNSET" },
            "categories": ["PRODUCTIVITY"],
            "sub_categories": null,
            "seo_description": null,
            "screenshots": null,
            "developer": null,
            "version": null,
            "version_id": null,
            "version_notes": null,
            "first_party_type": null,
            "first_party_requires_install": null
        },
        "distribution_channel": "DEFAULT_OAI_CATALOG",
        "connector_type": "SERVICE",
        "labels": { "retrievable": "true" },
        "logo_url": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNC42NjQ3IDE0LjM1NzVDMTUuNTg5MyAxNS4xMDggMTUuOTM0NSAxNS4wNTEgMTcuNjY5OCAxNC45MzU0TDM0LjAyODggMTMuOTUzOEMzNC4zNzcyIDEzLjk1MzggMzQuMDg3NCAxMy42MDU0IDMzLjk3MTggMTMuNTQ4NEwzMS4yNTQ4IDExLjU4NTFDMzAuNzMzOSAxMS4xODEzIDMwLjA0MDQgMTAuNzE3NCAyOC43MTIgMTAuODMzTDEyLjg3MDggMTEuOTg4OEMxMi4yOTQ0IDEyLjA0NTggMTIuMTc4OCAxMi4zMzU2IDEyLjQwODQgMTIuNTY2OEwxNC42NjQ3IDE0LjM1NzVaTTE1LjY0NjMgMTguMTcwMlYzNS4zODFDMTUuNjQ2MyAzNi4zMDczIDE2LjEwODcgMzYuNjUyNCAxNy4xNTA1IDM2LjU5NTRMMzUuMTI3NyAzNS41NTUyQzM2LjE2NzkgMzUuNDk4MiAzNi4yODM1IDM0Ljg2MTcgMzYuMjgzNSAzNC4xMDk2VjE3LjAxNDNDMzYuMjgzNSAxNi4yNjM4IDM1Ljk5NTMgMTUuODU4NSAzNS4zNTg4IDE1LjkxNzFMMTYuNTcxIDE3LjAxNDNDMTUuODc3NSAxNy4wNzEzIDE1LjY0NjMgMTcuNDE4MSAxNS42NDYzIDE4LjE3MDJaTTMzLjM5NTUgMTkuMDkzM0MzMy41MDk1IDE5LjYxMjYgMzMuMzk1NSAyMC4xMzM1IDMyLjg3MyAyMC4xOTIxTDMyLjAwNjkgMjAuMzY0N1YzMy4wNzA5QzMxLjI1NDggMzMuNDc2MyAzMC41NjEzIDMzLjcwNTggMjkuOTgzNCAzMy43MDU4QzI5LjA1ODcgMzMuNzA1OCAyOC44Mjc2IDMzLjQxNzcgMjguMTM0MSAzMi41NTE2TDIyLjQ2NzMgMjMuNjU2NFYzMi4yNjM0TDI0LjI2MTIgMzIuNjY3MkMyNC4yNjEyIDMyLjY2NzIgMjQuMjYxMiAzMy43MDU4IDIyLjgxNDEgMzMuNzA1OEwxOC44MjU3IDMzLjkzN0MxOC43MTAxIDMzLjcwNTggMTguODI1NyAzMy4xMjk1IDE5LjIzMSAzMy4wMTM5TDIwLjI3MTMgMzIuNzI1OFYyMS4zNDYzTDE4LjgyNTcgMjEuMjMwOEMxOC43MTAxIDIwLjcwOTggMTguOTk5OCAxOS45NTkzIDE5LjgwODkgMTkuOTAwOEwyNC4wODcxIDE5LjYxMjZMMjkuOTgzNCAyOC42MjQ5VjIwLjY1MjhMMjguNDc5MiAyMC40ODAzQzI4LjM2NTIgMTkuODQzOCAyOC44Mjc2IDE5LjM4MyAyOS40MDU1IDE5LjMyNDRMMzMuMzk1NSAxOS4wOTMzWk0xMS41NDA3IDEwLjQyOTNMMjguMDE2OSA5LjIxNjQyQzMwLjAzODggOS4wNDIyNSAzMC41NTk3IDkuMTU5NDIgMzEuODMyNyAxMC4wODI1TDM3LjA5MSAxMy43Nzk2QzM3Ljk1ODcgMTQuNDE0NSAzOC4yNDg0IDE0LjU4NzEgMzguMjQ4NCAxNS4yODA2VjM1LjU1NTJDMzguMjQ4NCAzNi44MjY2IDM3Ljc4NjEgMzcuNTc3MSAzNi4xNjc5IDM3LjY5MjdMMTcuMDMzMyAzOC44NDg1QzE1LjgxODkgMzguOTA1NSAxNS4yNDEgMzguNzMyOSAxNC42MDQ1IDM3LjkyMzhMMTTAuNzMxNyAzMi44OTgzQzEwLjAzODIgMzEuOTczNyA5Ljc1IDMxLjI4MTggOS43NSAzMC40NzExVjEyLjQ0OTZDOS43NSAxMS40MTA5IDEwLjIxMDggMTAuNTQ0OCAxMS41NDA3IDEwLjQyOTNaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K",
        "logo_url_dark": null,
        "actions": null
    };

    // 2. Define the Notion System Hint (for system_hints)
    // The logo here is the decoded SVG from the base64 above, as required by the hints endpoint.
    const NOTION_SYSTEM_HINT = {
        "system_hint": "connector:connector_37316be7febe4224b3d31465bae4dbd7",
        "name": "Notion",
        "description": "Search and reference your Notion pages",
        "action_label": "Notion",
        "short_label": "Notion",
        "logo": `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="24" fill="white"/><path d="M14.6647 14.3575C15.5893 15.108 15.9345 15.051 17.6698 14.9354L34.0288 13.9538C34.3772 13.9538 34.0874 13.6054 33.9718 13.5484L31.2548 11.5851C30.7339 11.1813 30.0404 10.7174 28.712 10.833L12.8708 11.9888C12.2944 12.0458 12.1788 12.3356 12.4084 12.5668L14.6647 14.3575ZM15.6463 18.1702V35.381C15.6463 36.3073 16.1087 36.6524 17.1505 36.5954L35.1277 35.5552C36.1679 35.4982 36.2835 34.8617 36.2835 34.1096V17.0143C36.2835 16.2638 35.9953 15.8585 35.3588 15.9171L16.571 17.0143C15.8775 17.0713 15.6463 17.4181 15.6463 18.1702ZM33.3955 19.0933C33.5095 19.6126 33.3955 20.1335 32.873 20.1921L32.0069 20.3647V33.0709C31.2548 33.4763 30.5613 33.7058 29.9834 33.7058C29.0587 33.7058 28.8276 33.4177 28.1341 32.5516L22.4673 23.6564V32.2634L24.2612 32.6672C24.2612 32.6672 24.2612 33.7058 22.8141 33.7058L18.8257 33.937C18.7101 33.7058 18.8257 33.1295 19.231 33.0139L20.2713 32.7258V21.3463L18.8257 21.2308C18.7101 20.7098 18.9998 19.9593 19.8089 19.9008L24.0871 19.6126L29.9834 28.6249V20.6528L28.4792 20.4803C28.3652 19.8438 28.8276 19.383 29.4055 19.3244L33.3955 19.0933ZM11.5407 10.4293L28.0169 9.21642C30.0388 9.04225 30.5597 9.15942 31.8327 10.0825L37.091 13.7796C37.9587 14.4145 38.2484 14.5871 38.2484 15.2806V35.5552C38.2484 36.8266 37.7861 37.5771 36.1679 37.6927L17.0333 38.8485C15.8189 38.9055 15.241 38.7329 14.6045 37.9238L10.7317 32.8983C10.0382 31.9737 9.75 31.2818 9.75 30.4711V12.4496C9.75 11.4109 10.2108 10.5448 11.5407 10.4293Z" fill="black"/></svg>`,
        "required_features": [],
        "required_models": [],
        "required_conversation_modes": ["primary_assistant", "gizmo_interaction"],
        "allow_in_temporary_chat": true,
        "disable_tinting": true,
        "composer_bar_button_info": null,
        "suggested_prompt": {
            "theme": "#27C0A6",
            "title": "Use Notion",
            "subtitle": "Invoke connector actions",
            "sort_order": 3,
            "badge": null
        },
        "regex_matches": null,
        "is_auto": false,
        "category": "tool",
        "persist_between_messages": true,
        "requires_opt_in": false,
        "model_alias": null,
        "estimated_duration_seconds": null,
        "hide_from_initial_selection": true,
        "badge_text": null,
        "is_dangerous": false,
        "is_connector": true,
        "keyword_invocations": ["@notion", "notion"],
        "can_connect": false,
        "aliases": []
    };

    const originalFetch = window.fetch;

    window.fetch = async function(resource, config) {
        let url = resource;
        if (resource instanceof Request) {
            url = resource.url;
        }

        // --- INTERCEPTION 1: list_accessible ---
        if (url && url.indexOf('backend-api/aip/connectors/list_accessible') > -1) {
            try {
                const response = await originalFetch(resource, config);
                // Clone so the app can still read the original stream if needed (though we return a new one)
                const data = await response.clone().json();

                if (data && Array.isArray(data.connectors)) {
                    const exists = data.connectors.some(c => c.id === NOTION_CONNECTOR.id);
                    if (!exists) {
                        // Insert at the beginning or end.
                        // The user asked to "add Notion in the list".
                        data.connectors.push(NOTION_CONNECTOR);
                        console.log('ChatGPT Notion Fix: Injected connector into list_accessible');
                    }
                }

                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (error) {
                console.error('ChatGPT Notion Fix: Error intercepting list_accessible', error);
                return originalFetch(resource, config);
            }
        }

        // --- INTERCEPTION 2: system_hints ---
        if (url && url.indexOf('backend-api/system_hints') > -1) {
            try {
                const response = await originalFetch(resource, config);
                const data = await response.clone().json();

                if (data && Array.isArray(data.system_hints)) {
                    // Check if Notion hint already exists
                    const exists = data.system_hints.some(h =>
                        h.system_hint === NOTION_SYSTEM_HINT.system_hint ||
                        h.name === "Notion"
                    );

                    if (!exists) {
                        data.system_hints.push(NOTION_SYSTEM_HINT);
                        console.log('ChatGPT Notion Fix: Injected hint into system_hints');
                    }
                }

                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (error) {
                console.error('ChatGPT Notion Fix: Error intercepting system_hints', error);
                return originalFetch(resource, config);
            }
        }

        return originalFetch(resource, config);
    };

    console.log('ChatGPT Notion Connector Fix: Active (intercepting list_accessible & system_hints)');
})();