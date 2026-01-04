// ==UserScript==
// @name         Langfinity Loby Defaults
// @namespace    http://tampermonkey.net/
// @version      2025-12-02.2
// @description  In the Langfinity Loby: turn off microphone & camera + remember last used name
// @author       KakkoiDev
// @match        https://langfinity.ai/meeting/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MSIgaGVpZ2h0PSI4MSIgdmlld0JveD0iMCAwIDgxIDgxIiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNNDkuMDM4NSAxNS41MjU5QzUyLjE4NDMgMTYuNjcwOCA1My45MjI1IDE5LjU1MTEgNTQuMDkxMSAyNC42NzcxQzU0LjI2MSAyOS44NDA0IDUyLjc1MTYgMzYuNTkwMyA1MC4wNTc4IDQzLjk5MTRDNDcuMzY0MSA1MS4zOTI0IDQ0LjE4MTYgNTcuNTMzNCA0MC43MzI2IDYxLjM3OTVDMzcuMzA4NSA2NS4xOTc4IDM0LjEyNTYgNjYuMjg2NyAzMC45Nzk3IDY1LjE0MkMyNy44MzM4IDYzLjk5NjggMjYuMDk1NiA2MS4xMTY3IDI1LjkyNyA1NS45OTA3QzI1Ljc1NzEgNTAuODI3NCAyNy4yNjY2IDQ0LjA3NzUgMjkuOTYwMyAzNi42NzY0QzMyLjY1NDEgMjkuMjc1NCAzNS44MzY1IDIzLjEzNDUgMzkuMjg1NiAxOS4yODgzQzQyLjcwOTcgMTUuNDcgNDUuODkyNiAxNC4zODA5IDQ5LjAzODUgMTUuNTI1OVoiIHN0cm9rZT0idXJsKCNhKSIgc3Ryb2tlLXdpZHRoPSI1LjE1MTI1Ii8+CiAgPHBhdGggZD0iTTY1LjMyNDQgNDkuNTQ1MkM2NC4yNjg0IDUyLjQ0NyA2MS41MDQ3IDU0LjEwNjggNTYuMzUzNCA1NC4yMDMxQzUxLjIwMjUgNTQuMjk5NCA0NC40NTE2IDUyLjc1MTYgMzcuMDQ0NSA1MC4wNTU2QzI5LjYzNzMgNDcuMzU5NiAyMy40NzEgNDQuMjA1OSAxOS41ODcgNDAuODIxMkMxNS43MDI4IDM3LjQzNjMgMTQuNjUyNSAzNC4zODgyIDE1LjcwODYgMzEuNDg2NEMxNi43NjQ4IDI4LjU4NDYgMTkuNTI4NyAyNi45MjQ4IDI0LjY4IDI2LjgyODVDMjkuODMwOCAyNi43MzIyIDM2LjU4MTcgMjguMjggNDMuOTg4OSAzMC45NzZDNTEuMzk2IDMzLjY3MiA1Ny41NjI0IDM2LjgyNTcgNjEuNDQ2MyA0MC4yMTA0QzY1LjMzMDYgNDMuNTk1MyA2Ni4zODExIDQ2LjY0MzQgNjUuMzI0NCA0OS41NDUyWiIgc3Ryb2tlPSJ1cmwoI2IpIiBzdHJva2Utd2lkdGg9IjUuMTUxMjUiLz4KICA8bWFzayBpZD0ibSIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iNDYiIHk9IjEzIiB3aWR0aD0iMTEiIGhlaWdodD0iMzUiPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00OS4yMzY2IDE4LjUwNzRDNTAuNDY5OSAxOS40MDAxIDUxLjM5NzcgMjEuMTQ5OSA1MS41MTY0IDI0Ljc1ODhDNTEuNjcwNCAyOS40Mzc3IDUwLjI4OCAzNS44MjQyIDQ3LjYzNzEgNDMuMTA3NUM0Ny4yODU2IDQ0LjA3MzIgNDYuOTI3MiA0NS4wMTI1IDQ2LjU2MjUgNDUuOTIzNUw1MS4zMzkxIDQ3Ljg1MjRDNTEuNzI5IDQ2Ljg3ODcgNTIuMTA4NiA0NS44ODMzIDUyLjQ3NzYgNDQuODY5M0M1Ny42OTAxIDMwLjU0ODUgNTguOTExMSAxNy42OTkyIDUxLjE1MjMgMTMuNjQ0NUw0OS4yMzY2IDE4LjUwNzRaIiBmaWxsPSIjRDlEOUQ5Ii8+CiAgPC9tYXNrPgogIDxnIG1hc2s9InVybCgjbSkiPgogICAgPHBhdGggZD0iTTQ5LjAzODUgMTUuNTI1OUM1Mi4xODQzIDE2LjY3MDggNTMuOTIyNSAxOS41NTExIDU0LjA5MTEgMjQuNjc3MUM1NC4yNjEgMjkuODQwNCA1Mi43NTE2IDM2LjU5MDMgNTAuMDU3OCA0My45OTE0QzQ3LjM2NDEgNTEuMzkyNCA0NC4xODE2IDU3LjUzMzQgNDAuNzMyNiA2MS4zNzk1QzM3LjMwODUgNjUuMTk3OCAzNC4xMjU2IDY2LjI4NjcgMzAuOTc5NyA2NS4xNDJDMjcuODMzOCA2My45OTY4IDI2LjA5NTYgNjEuMTE2NyAyNS45MjcgNTUuOTkwN0MyNS43NTcxIDUwLjgyNzQgMjcuMjY2NiA0NC4wNzc1IDI5Ljk2MDMgMzYuNjc2NEMzMi42NTQxIDI5LjI3NTQgMzUuODM2NSAyMy4xMzQ1IDM5LjI4NTYgMTkuMjg4M0M0Mi43MDk3IDE1LjQ3IDQ1Ljg5MjYgMTQuMzgwOSA0OS4wMzg1IDE1LjUyNTlaIiBzdHJva2U9InVybCgjYSkiIHN0cm9rZS13aWR0aD0iNS4xNTEyNSIvPgogIDwvZz4KICA8cGF0aCBkPSJNNDAuNTkzMSA3Ny4zNjc4QzYwLjkwNDggNzcuMzY3OCA3Ny4zNzA3IDYwLjkwMTkgNzcuMzcwNyA0MC41OTAxQzc3LjM3MDcgMjAuMjc4NCA2MC45MDQ4IDMuODEyNSA0MC41OTMxIDMuODEyNUMyMC4yODEzIDMuODEyNSAzLjgxNTQzIDIwLjI3ODQgMy44MTU0MyA0MC41OTAxQzMuODE1NDMgNjAuOTAxOSAyMC4yODEzIDc3LjM2NzggNDAuNTkzMSA3Ny4zNjc4WiIgc3Ryb2tlPSJ1cmwoI2MpIiBzdHJva2Utd2lkdGg9IjUuMTUxMjUiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjQ5LjkxOTQiIHkxPSIxMy4xMDU2IiB4Mj0iMzAuMDk4OCIgeTI9IjY3LjU2MjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjEyIiBzdG9wLWNvbG9yPSIjNjM5RUZGIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY1N0UzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC44OCIgc3RvcC1jb2xvcj0iI0ZGNUYyNCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjQ0Ljg2OTgiIHkxPSIyOC41NTU3IiB4Mj0iMzYuMTYzNSIgeTI9IjUyLjQ3NTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjEyIiBzdG9wLWNvbG9yPSIjRkY1RjI0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY1N0UzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC44OCIgc3RvcC1jb2xvcj0iIzYzOUVGRiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9Ijc0Ljk2NzQiIHkxPSI1NC4wMzcyIiB4Mj0iNS40MjUyIiB5Mj0iMjYuMzQ5MiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuMTIiIHN0b3AtY29sb3I9IiM2MzlFRkYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiNGRjU3RTMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjg4IiBzdG9wLWNvbG9yPSIjRkY1RjI0Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+Cg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557742/Langfinity%20Loby%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/557742/Langfinity%20Loby%20Defaults.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'inputName';
    const done = { microphone: false, camera: false, nameInput: false };

    function setReactInputValue(input, value) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype, 'value'
        ).set;
        nativeSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function clickOnce(selector, key) {
        if (done[key]) return;
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            done[key] = true;
        }
    }

    function setupNameInput() {
        if (done.nameInput) return;
        const input = document.querySelector('input[value="Guest"]');
        if (!input) return;

        const savedName = localStorage.getItem(STORAGE_KEY);
        if (savedName) setReactInputValue(input, savedName);

        input.addEventListener('input', (e) => {
            localStorage.setItem(STORAGE_KEY, e.target.value);
        });

        done.nameInput = true;
    }

    const observer = new MutationObserver(() => {
        clickOnce('button[data-lk-source="microphone"]', 'microphone');
        clickOnce('button[data-lk-source="camera"]', 'camera');
        setupNameInput();

        // Stop observing once all done
        if (Object.values(done).every(Boolean)) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();