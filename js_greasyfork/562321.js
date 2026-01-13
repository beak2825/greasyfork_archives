// ==UserScript==
// @name         247defensivedriving.com Course Countdown Assist
// @namespace    247defensivedriving
// @version      1.0
// @description  Adds live countdown in the title, sends a notification when the timer reaches zero and flashes the screen until there is interaction with the page.
// @match        https://www.247defensivedriving.com/*
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/562321/247defensivedrivingcom%20Course%20Countdown%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/562321/247defensivedrivingcom%20Course%20Countdown%20Assist.meta.js
// ==/UserScript==

(function () {
    const waitForElement = setInterval(() => {
        const timerInput = document.getElementById("time_spent");
        if (!timerInput) return;

        clearInterval(waitForElement);

        let flashInterval, titleInterval, overlay;
        const originalTitle = document.title;
        let notificationSent = false;
        let emojiToggle = false;

        titleInterval = setInterval(() => {
            if (timerInput.value !== "00:00:00") {
                document.title = timerInput.value || originalTitle;
            } else {
                const emoji = "🔔";
                document.title = emojiToggle ? `${emoji} ${timerInput.value} ${emoji}` : `${timerInput.value}`;
                emojiToggle = !emojiToggle;
            }
        }, 500);

        function sendNotification() {
            if (!("Notification" in window)) return;
            if (Notification.permission === "granted" && !notificationSent) {
                new Notification("Course page countdown finished");
                notificationSent = true;
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted" && !notificationSent) {
                        new Notification("Course page countdown finished");
                        notificationSent = true;
                    }
                });
            }
        }

        function startFlash() {
            if (overlay) return;

            overlay = document.createElement("div");
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(255, 0, 0, 0.5);
                z-index: 2147483647;
                pointer-events: none;
            `;
            document.body.appendChild(overlay);

            flashInterval = setInterval(() => {
                overlay.style.opacity = overlay.style.opacity === "1" ? "0" : "1";
            }, 300);

            window.focus();
            sendNotification();

            function stopFlash() {
                clearInterval(flashInterval);
                clearInterval(titleInterval);
                overlay.remove();
                overlay = null;
                document.title = originalTitle;
                removeEventListener("click", stopFlash);
                removeEventListener("keydown", stopFlash);
            }

            addEventListener("click", stopFlash, { once: true });
            addEventListener("keydown", stopFlash, { once: true });
        }

        const observer = new MutationObserver(() => {
            if (timerInput.value === "00:00:00") startFlash();
        });

        observer.observe(timerInput, { attributes: true, attributeFilter: ["value"] });

    }, 500);
})();