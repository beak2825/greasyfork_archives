// ==UserScript==
// @name         eventsTimer in Torn beta
// @namespace    NearestEventTimer in Torn beta
// @version      1.0.9tornbeta7
// @grant        GM_getValue
// @grant        GM_setValue
// @description  ljovcheg  [3191064]
// @author       ljovcheg  [3191064] 
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @license      mit
// @connect   ne.level5.ee
// @connect   torn.com
// @downloadURL https://update.greasyfork.org/scripts/555117/eventsTimer%20in%20Torn%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/555117/eventsTimer%20in%20Torn%20beta.meta.js
// ==/UserScript==


(function () {
    'use strict';
    throwRed(`started | v${GM_info.script?.version || null}`);



    let apiKey;;
    let events;
    let userEventStartTime;
    let nearestEvent;
    let sortedEvents;

    let use_tce = false;

    let tornClockSearchAttempt = 0

    let div;    // timer div object


    //  List of Torn events that uses user start time
    let eventsWithUserTimte = [
        "Valentine's Day",
        "St Patrick's Day",
        "Easter Egg Hunt",
        "420 Day",
        "Museum Day",
        "World Blood Donor Day",
        "World Population Day",
        "World Tiger Day",
        "International Beer Day",
        "Tourism Day",
        "CaffeineCon 2025",
        "Trick or Treat",
        "World Diabetes Day",
        "Slash Wednesday",
        "Christmas town"
    ]

    const updateInterval = 1800; //30min


    async function injectDiv() {

        if (document.getElementById("eventTimer")) {
            checkCache();
            return;
        }
        // let tornClock = document.querySelector(".tc-clock-tooltip");

        let tornClock = await waitForElement('.tc-clock-tooltip', { timeout: 2000 });

        let p = tornClock.appendChild(document.createElement("div"));
        p.addEventListener("click", divClicked);
        p.innerHTML = `<div id="eventTimer">...</div>`;
        div = document.getElementById('eventTimer');
        checkCache();

        if (window.location.href.toLowerCase().indexOf('preferences.php') !== -1) {
            injectSettings();
        }

        /*
        if (tornClock) {
            let p = tornClock.appendChild(document.createElement("div"));
            p.addEventListener("click", divClicked);
            p.innerHTML = `<div id="eventTimer">...</div>`;
            div = document.getElementById('eventTimer');
            checkCache();
        } else {
            //  lets try again 

            if (tornClockSearchAttempt < 3) {
                tornClockSearchAttempt++;
                throwRed(`.tc-clock-tooltip not found, ${tornClockSearchAttempt} try`);
                setTimeout(() => {
                    injectDiv();
                }, 300);
            } else {
                throwRed(`.tc-clock-tooltip not found :(`);
            }

        }
            */
    }

    // Wait for an element to appear in the DOM.
    // - selector: CSS selector (e.g. '#map')
    // - options.root: Node to observe (default: document)
    // - options.timeout: ms to give up (optional)
    // - options.signal: AbortSignal to cancel (optional)
    function waitForElement(selector, { root = document, timeout, signal } = {}) {
        return new Promise((resolve, reject) => {
            // 1) Synchronous fast path
            const found = (root instanceof Document ? root : root.ownerDocument).querySelector(selector);
            if (found) return resolve(found);

            // 2) Abort/timeout handling
            let timerId;
            const onAbort = () => {
                cleanup();
                reject(new DOMException('Aborted', 'AbortError'));
            };
            if (signal) {
                if (signal.aborted) return onAbort();
                signal.addEventListener('abort', onAbort, { once: true });
            }
            if (typeof timeout === 'number') {
                timerId = setTimeout(() => {
                    cleanup();
                    // reject(new Error(`Timeout waiting for "${selector}"`));
                }, timeout);
            }

            // 3) Observe DOM mutations
            const observer = new MutationObserver(() => {
                const el = (root instanceof Document ? root : root.ownerDocument).querySelector(selector);
                if (el) {
                    cleanup();
                    resolve(el);
                }
            });

            // Observe subtree changes so we catch inserts anywhere under root
            observer.observe(root === document ? document.documentElement : root, {
                childList: true,
                subtree: true
            });

            // 4) Also run once after DOMContentLoaded if we started super early
            const onReady = () => {
                const el = (root instanceof Document ? root : root.ownerDocument).querySelector(selector);
                if (el) {
                    cleanup();
                    resolve(el);
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onReady, { once: true });
            }

            function cleanup() {
                observer.disconnect();
                document.removeEventListener('DOMContentLoaded', onReady);
                if (signal) signal.removeEventListener('abort', onAbort);
                if (timerId) clearTimeout(timerId);
            }
        });
    }


    async function injectSettings() {

        let contentDiv = await waitForElement('.preferences-container', { timeout: 10000 });


        const targetDiv = document.querySelector('div[name="test"]');
        const details = document.createElement('details');
        details.className = 'eventTimer-settings';


        // Optional: Add a summary element (the visible header of the details)
        const summary = document.createElement('summary');
        summary.textContent = 'eventTimer | settings';
        details.appendChild(summary);

        // Optional: Add some content inside the details
        const content = document.createElement('div');
        content.textContent = 'Settings content goes here';
        content.className = 'preferences-wrap cont-gray border-round eventTimer-settings-content'
        details.appendChild(content);

        contentDiv.appendChild(details);

        updateSettings();
        /*
        let html = `
            test
        `
        let div = contentDiv.appendChild(document.createElement("div"));



        div.innerHTML = html;
        */
        //console.log('Found element:', contentDiv);
        // You can safely interact with it here:
        //contentDiv.style.border = '2px solid red';


    }
    async function updateSettings() {
        let contentDiv = await waitForElement('.eventTimer-settings-content', { timeout: 2000 });
        let tceHTML = '';
        if (use_tce) {

            let watchEvents = "";
            let hostEvents = "";

            const tceData = await TCE_fetch({ action: 'home' });

            if (tceData) {

                let froms = ['host', 'watch'];

                for (let f = 0; f < froms.length; f++) {
                    let from = froms[f];
                    let data = '';

                    for (let i = 0; i < tceData[from].length; i++) {
                        let event = tceData[from][i];
                        console.log(event)
                        data += `
                            <li class='eventTimer-settings-event'>
                                <div style="width:20%">
                                    <p><b>
                                        ${event.name}
                                    </b></p>
                                    <p>
                                       ${(from !== 'host') ? event.host : ""}
                                    </p>
                                </div>
                                <div style="width:60%">
                                   <p> ${unixSecondsToUTCString(event.start)} - ${unixSecondsToUTCString(event.end)}</p>
                                   <p> ${event.description}</p>
                                </div>
                                <div class="event-control">
                                    <button  class="btn-event-share torn-btn silver" event_id='${event.id}'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="34" viewBox="0 0 24 24"><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1m-4 5V3M9 6l3-3l3 3"/></svg>
                                    </button>
                                    <button class="btn-event-remove torn-btn silver" event_name='${event.name}' event_id='${event.id}' from='${from}'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="34" viewBox="0 0 24 24"><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            </li>
                        `
                    }
                    if (from === 'host') {
                        hostEvents = data;
                    } else {
                        watchEvents = data;
                    }
                }





                /*
                for (let i = 0; i < 4; i++) {
                    watchEvents += `
                    <li class='eventTimer-settings-event'>
                        <div style="width:20%">
                            <p><b>Event name ${i}</b></p>
                            <p>Event time</p>
                        </div>
                         <div style="width:60%">
                            Description
                        </div>
                        <div class="event-control">
                            <button id="eventTimer-addHost2" class="torn-btn silver">X</button>
                            <button id="eventTimer-addHost2" class="torn-btn silver">X</button>
                        </div>
                    </li>
                `
                }
                */
            }
            console.log(tceData)




            tceHTML = `
                <div class="eventTimer-settings-tce">
                    <h1>Hosted events</h1>
                    <!--
                    <div>
                        <button id="eventTimer-addHost" class="torn-btn silver">Host new event</button>
                    </div>
                    -->
                    <details id="hostEventForm">
                        <summary>Add new event</summary>
                        <form>
                            <div class="row">
                                <div class="field">
                                    <label for="ev-title">Title *</label>
                                    <input id="ev-title" type="text" required placeholder="">
                                </div>
                                <div class="field">
                                    <label for="ev-description">Description</label>
                                    <input id="ev-description" type="text" >
                                </div>
                            </div>
                          

                             <div class="row">
                                <div class="field">
                                    <label for="ev-date-start">Date start *</label>
                                    <input id="ev-date-start" type="date"  required>
                                </div>
                                <div class="field">
                                    <label for="ev-time-start">Time  start*</label>
                                    <input id="ev-time-start" type="time" required >
                                </div>

                                <div class="field">
                                    <label for="ev-date-end">Date end *</label>
                                    <input id="ev-date-end" type="date" required>
                                </div>
                                <div class="field">
                                    <label for="ev-time-end">Time  end*</label>
                                    <input id="ev-time-end" type="time"  required>
                                </div>
                            </div>
                            <div class="footer">
                                <button id="eventAdd" class="torn-btn silver">Host event</button>
                            </div>
                        </form>
                        
                    </details>
           
                     ${hostEvents}

                    <h1>Your watchlist</h1>
                    <div>
                        <button id="eventTimer-addWatch" class="torn-btn silver">Add event to watchlist</button>
                    </div>
                    

                    <ul>
                        ${watchEvents}
                    </ul>
                </div>
            `;
        }

        let mainHTML = `
            <div>
                <label for="eventTimer-settings-apikey" class="eventTimer-label">API key:</label>
                <input type="text" id="eventTimer-settings-apikey" value='${apiKey}'>
                <button id="eventTimer-btnSetApiKey" class="torn-btn silver">Set</button>

                <hr/>

                <div>
                    <input class="checkbox-css" type="checkbox" id="eventTimer-settings-participate" name="eventTimer-settings-participate" ${(use_tce) ? "checked" : ""}>
                    <label for="eventTimer-settings-participate" class="marker-css">Participate in custom events</label>
                </div>

                ${(use_tce) ? tceHTML : ""}
            </div>
        `



        /*
        use_tce
        */


        contentDiv.innerHTML = mainHTML;

        const input_apikey = document.getElementById('eventTimer-settings-apikey');
        document.getElementById('eventTimer-btnSetApiKey').addEventListener("click", e => {
            apiKey = input_apikey.value;
            GM_setValue('timer_api_key', apiKey);
            fetchData();
        });

        const participate_checkbox = document.getElementById('eventTimer-settings-participate');
        participate_checkbox.addEventListener("change", e => {
            const isChecked = e.target.checked;
            use_tce = isChecked;
            GM_setValue('use_tce', use_tce);
            fetchData();
        });

        const buttonAddWatch = document.getElementById('eventTimer-addWatch');
        if (buttonAddWatch) {
            buttonAddWatch.addEventListener("click", e => {
                let p = prompt('Enter event id');
                if (p) {
                    addWatch(p)
                }
                //fetchData();
            });
        }

        const eventAdd = document.getElementById('eventAdd');
        if (eventAdd) {
            eventAdd.addEventListener("click", e => {

                e.preventDefault();               // extra safety
                e.stopPropagation();              // optional

                hostNewEvent();



            });
        }



        document.querySelectorAll('.btn-event-share').forEach(el => el.addEventListener('click', event => {
            let event_id = event.currentTarget.getAttribute("event_id");
            if (event_id) shareEvent(event_id);
        }));

        document.querySelectorAll('.btn-event-remove').forEach(el => el.addEventListener('click', event => {
            let event_id = event.currentTarget.getAttribute("event_id");
            let from = event.currentTarget.getAttribute("from");
            let event_name = event.currentTarget.getAttribute("event_name");

            if (event_id && from) removeEvent(event_name, event_id, from);
        }));



    }



    injectDiv();

    function getUnixFromDateTime(dateStr, timeStr) {
        if (!dateStr || !timeStr) return null;
        const d = new Date(`${dateStr}T${timeStr}Z`);
        return Number.isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
    }

    async function hostNewEvent(params) {
        const eventTitle = document.getElementById('ev-title').value;
        const eventDescription = document.getElementById('ev-description').value;
        const eventDateStart = document.getElementById('ev-date-start').value;
        const eventTimeStart = document.getElementById('ev-time-start').value;
        const eventDateEnd = document.getElementById('ev-date-end').value;
        const eventTimeEnd = document.getElementById('ev-time-end').value;

        let eventStart = getUnixFromDateTime(eventDateStart, eventTimeStart);
        let eventEnd = getUnixFromDateTime(eventDateEnd, eventTimeEnd);
        let dif = eventEnd - eventStart;

        if (dif < 0) {
            alert(`Ending time can't be less than starting time`);
            return;
        }
        if (!eventTitle || !eventDateStart || !eventDateEnd || !eventTimeStart || !eventTimeEnd) {
            alert(`Something is missing`);
            return;
        }

        console.log("OK")

        let response = await TCE_fetch({
            action: "addevent",
            title: eventTitle,
            start: eventStart,
            end: eventEnd,
            description: eventDescription,
            public: false,
            hostName: "TESTER"
        });


        if (response.error) {
            alert(response.message);
            return;
        }

        updateSettings();

    }

    function checkCache() {
        let currentTimeStamp = Math.round(Date.now() / 1000);

        //  read cache
        apiKey = GM_getValue('timer_api_key', null);
        events = GM_getValue('events', null);
        use_tce = GM_getValue('use_tce', false);


        userEventStartTime = GM_getValue('userEventStartTime', null);


        let lastUpdated = GM_getValue('updated', null);
        if (!apiKey) {
            throwRed("No api key")
            setText("limited apy key needed");
            return;
        }
        if (!lastUpdated || currentTimeStamp - lastUpdated > updateInterval || !events || !userEventStartTime) {
            fetchData();
        } else {
            setEventTimes("cache");
        }




    }
    async function fetchData() {
        setText("fetching torn...");
        const tornData = await GM_fetch('torn', 'calendar');
        if (tornData.calendar) {
            let json = tornData.calendar;
            if (json.events && json.competitions) {
                events = json["events"].concat(json.competitions);
            } else {
                events = json.events;
            }
            GM_setValue('events', events)
        } else if (tornData.error) {
            throwRed(tornData.error);
            setText(tornData.error.error);

            events = [];
            GM_setValue('events', events);
            return;
        } else {
            throwRed(tornData);
            setText("Something is wrong");
            return;
        }

        setText("fetching user...");
        const userData = await GM_fetch('user', 'calendar,timestamp');
        if (userData.calendar) {
            let json = userData.calendar;
            if (json.start_time) {
                userEventStartTime = json.start_time.toLowerCase().split(" tct")[0];
                GM_setValue('userEventStartTime', userEventStartTime);
            }
        } else if (userData.error) {
            throwRed(tornData.error);
            setText(userData.error.error);
            return;
        }

        if (use_tce) {
            setText("fetching tce...");
            console.log("fetching tce...")

            const tceEvents = await TCE_fetch({ action: 'getevents' });

            events = events.concat(tceEvents);
            GM_setValue('events', events)
        }
        console.log(events)



        let currentTimeStamp = Math.round(Date.now() / 1000);
        GM_setValue('updated', currentTimeStamp);

        setEventTimes("fetch");
        updateSettings();
    }



    function setEventTimes(from = null) {
        //if (from) throwRed(`Came here from ${from}`);

        // setting evetns start/end times with user start time if needed

        /*
        events.push({
            title: "Test event",
            start: 1761999300,
            end: 1762172100
        })
            */


        events.forEach(event => {
            let eventStartTime = event.start;
            let eventEndTime = event.end;
            let isEventWithUserTime = (eventsWithUserTimte.indexOf(event.title) !== -1) ? true : false;

            if (isEventWithUserTime) {
                eventStartTime = setTimeOnUnix(event.start, userEventStartTime);
                eventEndTime = setTimeOnUnix(event.end, userEventStartTime);
                event.userTimeAffect = true;
            }

            event.start = eventStartTime;
            event.end = eventEndTime;

        });

        getNearestEvent();

    }

    function getNearestEvent() {
        let currentTimeStamp = Math.round(Date.now() / 1000);

        if (!events || events.length === 0) return null;



        let eventsList = [];
        events.forEach(event => {
            event.startDiff = (event.start - currentTimeStamp);
            event.endDiff = (event.end - currentTimeStamp);

            if (event.startDiff >= 0 || event.endDiff >= 0) eventsList.push(event)
            //console.log(event.title, event.startDiff, event.endDiff)
        });

        const now = Math.floor(Date.now() / 1000); // current timestamp in seconds

        const upcomingOrActiveEvents = events.filter(e => !(e.startDiff < 0 && e.endDiff < 0));

        // Optional: sort after filtering (same logic as before)
        sortedEvents = upcomingOrActiveEvents.sort((a, b) => {
            const aActive = a.startDiff <= 0 && a.endDiff >= 0;
            const bActive = b.startDiff <= 0 && b.endDiff >= 0;

            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;

            if (aActive && bActive) return a.endDiff - b.endDiff;
            if (a.startDiff > 0 && b.startDiff > 0) return a.startDiff - b.startDiff;

            return a.startDiff - b.startDiff;
        });


        // Active events (sorted by soonest ending)
        const activeEvents = sortedEvents.filter(e => now >= e.start && now <= e.end);


        //console.log("Active events:", activeEvents);
        //console.log("Sorted events:", sortedEvents);

        nearestEvent = sortedEvents[0];

        showTimer();
        // console.log(events);
        // console.log(eventsList)
    }
    function showTimer() {
        let currentTimeStamp = Math.round(Date.now() / 1000);
        let difTime = 0;
        let val = "in";
        let currentEvent = false;
        if (nearestEvent.startDiff > 0) {
            difTime = nearestEvent.start - currentTimeStamp;
            if (div.classList.contains('currentEvent')) {
                div.classList.remove("currentEvent")
            }
        } else {
            if (!div.classList.contains('currentEvent')) {
                div.classList.add("currentEvent")
            }
            difTime = nearestEvent.end - currentTimeStamp;
            val = "ends";
            currentEvent = true;
        }

        let text = `
            ${nearestEvent.title}<br>
            <b>${val}: ${secondsToTime(difTime)}</b>
        `;
        /*
        if (currentEvent && sortedEvents[1].startDiff > 0) {
            let nextDiff = sortedEvents[1].start - currentTimeStamp;;
            text += `
            
                <br/>${sortedEvents[1].title}<br/>
                <b>in: ${secondsToTime(nextDiff)}</b>
            `;
        }
            */
        setText(text)

        if (difTime < 0) {
            throwRed(`Event ${nearestEvent.title} is over.`)
            getNearestEvent();
            return;
        }

        setTimeout(showTimer, 1000);
    }

    function secondsToTime(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400); // 1 day = 86400 seconds
        totalSeconds %= 86400;

        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Pad with leading zeros
        const paddedHours = hours < 10 ? "0" + hours : hours;
        const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const paddedSeconds = seconds < 10 ? "0" + seconds : seconds;

        if (days > 0) {
            // Include days, show full time
            return `${days} day${days > 1 ? "s" : ""} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else if (hours > 0) {
            // Hours, minutes, seconds
            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else if (minutes > 0) {
            // Only minutes and seconds
            return `${paddedMinutes} min ${paddedSeconds} sec`;
        } else {
            // Only seconds
            return `${paddedSeconds} sec`;
        }
    }



    function setTimeOnUnix(unixTime, timeString) {

        const [targetHour, targetMinute] = timeString.split(":").map(Number);


        const date = new Date(unixTime * 1000);


        date.setUTCHours(targetHour);
        date.setUTCMinutes(targetMinute);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);



        return Math.floor(date.getTime() / 1000);

    }




    function divClicked() {
        window.location.href = '/preferences.php';
        // window.open('/preferences.php');
        /*
        if (apiKey === null) apiKey = '';
        let w = prompt("Api key", apiKey);
        if (w || w === "" && w !== null) {
            //save key
            GM_setValue('timer_api_key', w);
            apiKey = w;
        }
        if (apiKey && w !== null) fetchData();
        */

    }
    function setText(data) {
        div.innerHTML = data
    }
    function throwRed(data) {
        console.log(`%ceventsTimer${(typeof data !== 'object') ? ': ' + data : ''}`, 'background: #212c37; color: white;padding:10px; border-radius:3px;', (typeof data === 'object') ? data : '');
    }

    async function GM_fetch(page, selections) {

        throwRed(`GM_fetch https://api.torn.com/v2/${page}/?selections=${selections}&key=${apiKey}`);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/v2/${page}/?selections=${selections}&key=${apiKey}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                onload: function (response) {
                    throwRed(`GM_fetch onload`);
                    try {
                        if (!response || !response.responseText) {
                            throwRed(`GM_fetch Empty response`);
                            reject("Empty response");
                            return reject(new Error("Empty response"));
                        }



                        const json = JSON.parse(response.responseText);
                        console.log('GM_fetch', json)
                        resolve(json);

                    } catch (err) {
                        throwRed(`GM_fetch ERROR1, ${err}`);
                        reject(err);
                    }
                },
                onerror: function (err) {
                    throwRed(`GM_fetch ERROR2, ${err}`);
                    reject(err);
                },
            });
        });
    }


    async function TCE_fetch(options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://ne.level5.ee/ne.php`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                data: JSON.stringify(options),
                onload: function (response) {
                    try {
                        if (!response || !response.responseText) {
                            return reject(new Error("Empty response"));
                        }
                        const json = JSON.parse(response.responseText);
                        resolve(json);

                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                },
            });
        });
    }

    async function removeEvent(event_name, event_id, from) {
        if (!confirm(`Remove ${event_name}?`)) return;

        const tceData = await TCE_fetch({ action: 'removeevent', event_id: event_id, from: from });
        if (tceData.error) {
            alert(tceData.message);
            return;
        }

        fetchData();
    }
    async function addWatch(event_id) {
        const tceData = await TCE_fetch({ action: 'addwatch', event_id: event_id });
        if (tceData.error) {
            alert(tceData.message);
            return;
        }

        fetchData();
    }
    function unixSecondsToUTCString(unixSeconds) {
        const d = new Date(unixSeconds * 1000);
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // months are 0-based
        const year = d.getUTCFullYear();
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const minutes = String(d.getUTCMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    function shareEvent(eventID) {
        navigator.clipboard.writeText(eventID);
        alert(`Event id has been copied to clipboard\n${eventID}`);
    }


    GM_addStyle(`
        .currentEvent{
            border: 2px solid rgba(97, 119, 0, 1) !important;
            /*background-color: rgba(85, 255, 0, 0.3) !important;*/
            /*color: rgba(255, 255, 255, 0.9);*/
        }   
        #eventTimer {
            background-color: rgba(0, 0, 0, 0.5);
            margin-top: 5px;
            margin-bottom: 7px;
            border-radius: 5px;
            padding: 7px;
            overflow: hidden;
            cursor: pointer;

            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; 
            line-height: 16px;
            font-weight: 100;
            font-size: 11px;
            
        }
        #eventTimer:hover{
            background-color: rgba(0, 0, 0, 0.9);
        }
        .eventtimer-modal-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.8);
            display: flex; align-items: center; justify-content: center; z-index: 999999999;
        }

        .eventTimer-settings {
            margin-top: 10px;
        }

        .eventTimer-settings > summary {
            list-style: none;
            cursor: pointer;
            background-color: #212c37;
            color: #fff;
            padding: 10px;
            border-radius: 5px;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .eventTimer-settings > summary::before {
            content: '+';
            display: inline-block;
            margin-right: 5px;
        }

        .eventTimer-settings[open] > summary::before {
            content: '-';
        }

        .eventTimer-settings > :not(summary) {
            padding: 10px;
        }

        .eventTimer-settings input{
            height: 14px;
            line-height: 14px;
            margin-right: 8px;
            padding: 9px 10px;
            text-align: left;
            vertical-align: top;
            /* width: 178px; */
        }
        
        .eventTimer-settings hr{
            margin-top: 10px !important;
            margin-bottom: 10px !important;
        }

        .eventTimer-settings h1{
            font-size: 14px !important;
            margin-top: 10px !important;;
            margin-bottom: 10px !important;
        }

        .eventTimer-label{
            display: block;
            margin-bottom: 10px;
        }
        .eventTimer-settings-tce{
            margin-top:10px;
        }

        .eventTimer-settings li{
            align-content: center;
            align-items: start;
            /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
            /* border-color: var(--preferences-api-divider); */
            display: flex;
            flex-wrap: wrap;
            font-size: 12px;
            line-height: 16px;
            /* padding: 10px 0; */
            background-color: rgba(0, 0, 0, 0.1);
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 2px;
            margin-top: 2px;;
            flex-wrap: wrap;
            font-size: 12px;
            line-height: 16px;
        }
        .event-control{
            width: 20%;
            text-align: right;
            display: flex;
            flex-direction: column;
            height: 34px;
            justify-content: center;
            flex-wrap: wrap;
            column-gap: 3px;
        }
            /*
        .event-control button {
            background: transparent;
        }

        .event-control button:hover{
            background: rgba(0,0,0,0.3);
        }
            */

        #hostEventForm{margin-bottom:20px;}
        #hostEventForm form .field { margin: 10px 0; }
        #hostEventForm form .field label { display: block; font-size: 0.9rem; margin-bottom: 4px; }
        #hostEventForm form .row { display: flex; gap: 10px; }
        #hostEventForm form .row .field { flex: 1; }
        #hostEventForm footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }

         #hostEventForm input{
            width: 100%;
               box-sizing: border-box;
               height: 34px;
               
            }
    `);
})();