// ==UserScript==
// @name         Instyler Time Tracker
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Adds a smart time tracking dashboard. Allows for easy check-in/out and break tracking.
// @author       Gemini
// @match        https://app.instyler.de/Admin/Admin?appId=INSTYLER*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547733/Instyler%20Time%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/547733/Instyler%20Time%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.instylerTimeTrackerLoaded) return;
    window.instylerTimeTrackerLoaded = true;

    const CHECK_IN_KEY = 'checkInWerkstudent';
    const BREAK_START_KEY = 'breakStartWerkstudent';
    let userResourceId = null;

    function timeToMinutes(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    function getSessionId() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('sessionId');
        } catch (e) {
            console.error("Error parsing URL for sessionId:", e);
            return null;
        }
    }

   async function fetchResourceId(sessionId) {
    console.log("Fetching user Resource ID...");
    const formData = new URLSearchParams({ appId: 'INSTYLER', sessionId });
 
    try {
        const response = await fetch('https://app6088.instyler.de/Account/GetLoginStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: formData
        });
 
        if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
 
        const data = await response.json();
        console.log("Login status response:", data); // 👈 helpful for debugging
 
        if (!data?.isauth || !data?.user) {
            throw new Error("Login status response is invalid or missing user info.");
        }
 
        const resourceId = data.user.Resource || data.user.ID;
 
        if (!resourceId) {
            throw new Error("Neither Resource nor fallback ID found in user object.");
        }
 
        console.log("Successfully fetched Resource ID:", resourceId);
        return resourceId;
 
    } catch (error) {
        console.error('Error fetching Resource ID:', error);
        alert(`Could not get your user ID. Error: ${error.message}`);
        return null;
    }
}

    function sendCheckOutRequest(fromTime, toTime) {
        const sessionId = getSessionId();
        if (!sessionId || !userResourceId) {
            alert("Could not find Session ID or Resource ID. Cannot check out.");
            return;
        }

        console.log(`Sending booking from ${fromTime} to ${toTime}`);

        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const formData = new URLSearchParams();

        const dataObject = {
            Date: dateString,
            ResourceID: userResourceId,
            From: String(fromTime),
            To: String(toTime),
            ID: crypto.randomUUID()
        };

        for (const key in dataObject) {
            formData.append(`data[0].${key}`, dataObject[key]);
        }
        formData.append('appId', 'INSTYLER');
        formData.append('sessionId', sessionId);
        formData.append('windowId', 'userscript-window');
        formData.append('requestId', `req-${crypto.randomUUID()}`);

        fetch('https://app6088.instyler.de/DailyAV/Write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: formData
            })
            .then(response => response.ok ? response.json() : Promise.reject(`Server status: ${response.status}`))
            .then(data => {
                console.log('Check-out Success:', data);
                if (data.result === "ok") {
                    localStorage.removeItem(CHECK_IN_KEY);
                    updateButtonState();
                } else {
                    alert(`Server returned an error: ${data.error || 'Unknown error'}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Failed to send check-out request. See console for details.`);
            });
    }

    function sendBreakRequest(startTimeMs, durationMinutes) {
        const sessionId = getSessionId();
        if (!sessionId || !userResourceId) {
            alert("Could not find Session ID or Resource ID. Cannot log break.");
            return;
        }

        console.log(`Sending break request. Start: ${new Date(startTimeMs).toLocaleTimeString()}, Duration: ${durationMinutes}m`);

        const formData = new URLSearchParams();
        const bookingId = crypto.randomUUID();

        formData.append('data[0]._NEW', '1');
        formData.append('data[0].ID', bookingId);
        formData.append('data[0].Type', 'pause');
        formData.append('data[0].Fragments[0].ResourceID', userResourceId);
        formData.append('data[0].Fragments[0].Start', String(startTimeMs));
        formData.append('data[0].Fragments[0].Duration', String(durationMinutes));

        formData.append('appId', 'INSTYLER');
        formData.append('sessionId', sessionId);
        formData.append('windowId', `userscript-window-${crypto.randomUUID()}`);
        formData.append('requestId', `req-${crypto.randomUUID()}`);

        fetch('https://app6088.instyler.de/Booking/Write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: formData
            })
            .then(response => response.ok ? response.json() : Promise.reject(`Server status: ${response.status}`))
            .then(data => {
                console.log('Break Log Success:', data);
                if (data.result === "ok") {
                    localStorage.removeItem(BREAK_START_KEY);
                    updateButtonState();
                } else {
                    alert(`Server returned an error while logging break: ${data.error || 'Unknown error'}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Failed to send break request. See console for details.`);
            });
    }

    function endBreak() {
        const storedBreakData = JSON.parse(localStorage.getItem(BREAK_START_KEY) || '{}');

        if (!storedBreakData.localMinutes || !storedBreakData.utcTimestamp) {
            console.error("Could not parse break start data from localStorage.");
            localStorage.removeItem(BREAK_START_KEY);
            updateButtonState();
            return;
        }

        const nowInMinutes = timeToMinutes(new Date());
        const durationMinutes = Math.max(1, nowInMinutes - storedBreakData.localMinutes);
        const startTimeMs = storedBreakData.utcTimestamp;

        const SERVER_OFFSET_MS = 40 * 60 * 1000;
        const adjustedStartTimeMs = startTimeMs - SERVER_OFFSET_MS;

        console.log(`Ending break of ${durationMinutes} minutes...`);
        console.log(`Original Start: ${new Date(startTimeMs).toLocaleString()}, Adjusted & Sent: ${new Date(adjustedStartTimeMs).toLocaleString()}`);

        sendBreakRequest(adjustedStartTimeMs, durationMinutes);
    }

    function handleButtonClick() {
        const isCheckedIn = localStorage.getItem(CHECK_IN_KEY);
        const isOnBreak = localStorage.getItem(BREAK_START_KEY);

        if (isOnBreak) {
            endBreak();
        } else if (isCheckedIn) {
            const fromTime = parseInt(isCheckedIn, 10);
            const toTime = timeToMinutes(new Date());

            if (toTime <= fromTime) {
                if (!confirm("Check-out time is the same as or earlier than check-in time. Are you sure you want to log this entry?")) {
                    return;
                }
            }
            console.log(`Checking out...`);
            sendCheckOutRequest(fromTime, toTime);
        } else {
            const nowInMinutes = timeToMinutes(new Date());
            localStorage.setItem(CHECK_IN_KEY, nowInMinutes);
            console.log(`Checked in at ${new Date().toLocaleTimeString()}, stored as ${nowInMinutes}`);
            updateButtonState();
        }
    }

    function handleButtonRightClick(event) {
        event.preventDefault();

        const isCheckedIn = localStorage.getItem(CHECK_IN_KEY);
        const isOnBreak = localStorage.getItem(BREAK_START_KEY);

        if (isOnBreak) {
            endBreak();
        } else if (isCheckedIn) {
            const now = new Date();
            const breakStartData = {
                localMinutes: timeToMinutes(now),
                utcTimestamp: now.getTime()
            };
            localStorage.setItem(BREAK_START_KEY, JSON.stringify(breakStartData));
            console.log(`Break started at ${now.toLocaleTimeString()}`);
            updateButtonState();
        }
    }

    function createDashboardElements() {
        const logoElement = document.getElementById('seres-sysmenulogo');
        if (!logoElement) return false;

        const container = document.createElement('div');
        container.id = 'time-tracker-dashboard';

        const button = document.createElement('button');
        button.id = 'werkstudent-checkin-btn';
        button.addEventListener('click', handleButtonClick);
        button.addEventListener('contextmenu', handleButtonRightClick);

        container.appendChild(button);

        logoElement.parentNode.replaceChild(container, logoElement);
        return true;
    }

    function updateButtonState() {
        const button = document.getElementById('werkstudent-checkin-btn');
        if (!button) return;

        const isCheckedIn = localStorage.getItem(CHECK_IN_KEY);
        const isOnBreak = localStorage.getItem(BREAK_START_KEY);

        if (isOnBreak) {
            button.textContent = 'End Break';
            button.title = 'Click or Right-Click to End Break';
            button.style.backgroundColor = '#f0ad4e';
            button.style.borderColor = '#eea236';
        } else if (isCheckedIn) {
            button.textContent = 'Check Out';
            button.title = 'Click to Check Out | Right-Click for Break';
            button.style.backgroundColor = '#d9534f';
            button.style.borderColor = '#d43f3a';
        } else {
            button.textContent = 'Check In';
            button.title = 'Click to Check In';
            button.style.backgroundColor = '#5cb85c';
            button.style.borderColor = '#4cae4c';
        }
    }

    async function initialize() {
        const sessionId = getSessionId();
        if (!sessionId) {
            console.log("Instyler Time Tracker: No sessionId found.");
            return;
        }

        userResourceId = await fetchResourceId(sessionId);
        if (!userResourceId) {
            console.error("Instyler Time Tracker: Could not get Resource ID. Script will not initialize.");
            return;
        }

        GM_addStyle(`
            #time-tracker-dashboard {
                z-index: 100010; position: fixed; top: 10px; left: 50px;
                display: flex; align-items: center; gap: 10px;
width: 93px;
  height: 40px;
            }
            #werkstudent-checkin-btn {
                font-family: Roboto, Arial, sans-serif;
                padding: 4px 4px;
                border-radius: 5px;
                color: white;
                border: solid 1px #fff;
                cursor: pointer;
                transition: background-color 0.2s ease, transform 0.1s ease, filter 0.2s ease;
                box-sizing: border-box;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: normal;
                outline: 1px solid white;
                width: 100%;
                height: 100%;
                position: relative;

            }
            #werkstudent-checkin-btn:hover { filter: brightness(1.1); }
            #werkstudent-checkin-btn:active { transform: scale(0.98); }
        `);

        const observer = new MutationObserver((mutations, obs) => {
            const logo = document.getElementById('seres-sysmenulogo');
            if (logo) {
                console.log("Logo found, creating dashboard.");
                if (createDashboardElements()) {
                    updateButtonState();
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initialize();

})();