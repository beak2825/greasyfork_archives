// ==UserScript==
// @name         Custom and nearest Torn events
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Description
// @author       ljovcheg  [3191064] 
// @license MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      https://tornscripts.co.za


// @downloadURL https://update.greasyfork.org/scripts/560816/Custom%20and%20nearest%20Torn%20events.user.js
// @updateURL https://update.greasyfork.org/scripts/560816/Custom%20and%20nearest%20Torn%20events.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const SCRIPT_VERSION = '2.0.1';
    if (typeof GM_info !== 'undefined' &&
        GM_info &&
        GM_info.script &&
        GM_info.script.version) {
        if (GM_info.script.version !== SCRIPT_VERSION) message('Incorrect version', true);
    }

    message(`CTE v ${SCRIPT_VERSION}`);


    //----- SETTINGS -------------------------------------------------------------

    const ICONS_DEFAULT = {
        error: 'fa-triangle-exclamation',
        loading: 'fa-spinner',
        event: 'fa-bell'
    }
    const TORN_EVENTS_ICONS = [
        { "Awareness Awareness Week": "fa-eye" },
        { "Weekend Road Trip": "fa-gauge-high" },
        { "Valentine's Day": "fa-heart" },
        { "Employee Appreciation Day": "fa-briefcase" },
        { "St Patrick's Day": "fa-clover" },
        { "420 Day": "fa-cannabis" },
        { "Museum Day": "fa-landmark" },
        { "World Blood Donor Day": "fa-hand-holding-droplet" },
        { "World Population Day": "fa-bullseye" },
        { "World Tiger Day": "fa-person-rifle" },
        { "International Beer Day": "fa-beer-mug-empty" },
        { "Tourism Day": "fa-plane-departure" },
        { "CaffeineCon": "fa-bolt" },
        { "Trick or Treat": "fa-ghost" },
        { "World Diabetes Day": "fa-candy-cane" },
        { "Black Friday": "fa-dollar-sign" },
        { "Slash Wednesday": "fa-bed-pulse" },
        { "Torn Anniversary": "fa-cake-candles" },
        { "Easter Egg Hunt": "fa-egg" },
        { "Christmas town": "fa-snowflake" },
        { "Elimination": "fa-skull-crossbones" },
    ]

    const STORAGE_NAME = 'cte_settings';
    const UPDATE_INTERVAL = 1800;
    let SETTINGS = {}
    let GLOBAL_DIVS = {};

    let allEvents = {}; // holder for all events

    let timeHandler; // holder for setTimeout to clear

    let TOOLTIP_ACTIONS = {
        clear() {
            GLOBAL_DIVS.cte_clock_holder?.attr('class', 'cte_clock_holder no-select');
            GLOBAL_DIVS.cte_clock_icon?.attr('class', `fa-solid`);
            GLOBAL_DIVS.cte_clock_events_holder?.html('')
        },
        loading(html) {
            clearTimeout(timeHandler);
            this.clear();

            this.small('...');
            GLOBAL_DIVS.cte_clock_events_holder?.text(html);
            GLOBAL_DIVS.cte_clock_icon?.attr('class', `fa-solid ${ICONS_DEFAULT.loading} loading-spin`);
        },
        error(html) {
            this.clear();
            GLOBAL_DIVS.cte_clock_holder?.addClass('cte_clock_error')
            GLOBAL_DIVS.cte_clock_icon?.attr('class', `fa-solid ${ICONS_DEFAULT.error}`);
            GLOBAL_DIVS.cte_clock_events_holder?.html(html);
            this.small('error');
        },
        active(icon = '') {
            GLOBAL_DIVS.cte_clock_holder?.attr('class', 'cte_clock_holder no-select cte_clock_active');
            this.icon(icon);
        },
        icon(icon = '') {
            GLOBAL_DIVS.cte_clock_icon?.attr('class', `fa-solid ${icon}`);
        },
        html(data) {
            GLOBAL_DIVS.cte_clock_events_holder?.html(data);
        },
        small(value) {
            GLOBAL_DIVS.cte_clock?.text(value);
        }
    }


    function initStorage() {
        SETTINGS = GM_getValue(STORAGE_NAME, {});
        if (SETTINGS.apiKey) return;

        // detect if no api key presented, try to get apikey from ols version
        let oldApiKey = GM_getValue('timer_api_key', null);
        if (oldApiKey) SETTINGS.apiKey = oldApiKey;


    }
    initStorage();


    //  generate tooltip
    generateTooltip();

    function detectOpenPages() {

        //  detect for preferences/settings and calendar pages

        if (window.location.href.toLowerCase().indexOf('preferences.php') !== -1) generateSettings();
        if (window.location.href.toLowerCase().indexOf('calendar.php') !== -1) generateCalendar();
    }
    detectOpenPages();


    //  GATHER ALL DATA   -------------------------------------------------------------


    function gatherData() {
        clearTimeout(timeHandler);
        TOOLTIP_ACTIONS.loading();

        //  Detecting if apiKey is available

        if (!SETTINGS.apiKey) {
            TOOLTIP_ACTIONS.error($('<div>', {
                html: "Api key not set<br/>Click <u>here</u> to open settings",
            }).on("click", function (e) {
                e.stopPropagation();
                window.open('preferences.php', '_self');
            }));
            return;
        }

        let currentTimeStamp = Math.round(Date.now() / 1000);


        //  Check if fetch is needed

        if (!SETTINGS.tornEvents || SETTINGS.tornEvents.length === 0 || !SETTINGS.lasetUpdate || currentTimeStamp - SETTINGS.lasetUpdate > UPDATE_INTERVAL) {
            fetchData();
            return;
        };


        //  Prepearing events list 

        allEvents = {};
        let preSortedEvents = [];
        let unSortedEvents = (SETTINGS.watchEvents ?? []).concat(SETTINGS.tornEvents ?? []);




        for (let i = 0; i < unSortedEvents.length; i++) {
            let tornEvent = unSortedEvents[i];
            let start = tornEvent.start;
            let end = tornEvent.end;
            if (tornEvent.fixed_start_time === false) {
                let isOneDayEvent = ((end - start) / 86400) < 1;
                // if it's a one day event with user start time add one day before and after.
                // Wtf Torn team, why not just put normal start/end timestamps into API? o_O
                if (isOneDayEvent) {
                    start = start - 86400;
                    end = end + 86400;
                }

                //  add user event start time
                start = setTimeOnUnix(start, SETTINGS.userStartTime || "00:00");
                end = setTimeOnUnix(end, SETTINGS.userStartTime || "00:00");

            }
            let event = {
                title: tornEvent.title,
                icon: (tornEvent.custom) ? tornEvent.icon : getEventIcon(tornEvent.title),
                start: start,
                end: end,
                originalInfo: tornEvent,
                custom: tornEvent.custom || false
            }

            preSortedEvents.push(event);
        }

        allEvents = getUpcomingEventsSorted(preSortedEvents);

        let html = '';
        let smallText = '';

        if (allEvents.ongoing_events.length > 0) {

            let icon = allEvents.ongoing_events[0].icon || ICONS_DEFAULT.event;

            TOOLTIP_ACTIONS.active(icon);

            //  There's one or more ongoing events. Showing ongoing + overlaping
            for (let i = 0; i < allEvents.ongoing_events.length; i++) {
                let event = allEvents.ongoing_events[i];
                let secondsLeft = secondsToTime(event.end - currentTimeStamp);

                html += `<div class='cte_clock_event'><div class="cte_clock_event_title">${event.title}</div>ends in ${secondsLeft}</div>`;

                if (i === 0) smallText = secondsLeft;
            }
            for (let i = 0; i < allEvents.overlapping_events.length; i++) {
                let event = allEvents.overlapping_events[i];
                let secondsLeft = secondsToTime(event.start - currentTimeStamp);

                html += `<div class='cte_clock_event'><div class="cte_clock_event_title">${event.title}</div>starts in ${secondsLeft}</div>`;
            }

        } else {
            let icon = allEvents.future_events[0].icon || ICONS_DEFAULT.event;
            TOOLTIP_ACTIONS.icon(icon);

            //  Showing frist future event
            let event = allEvents.future_events[0];
            let secondsLeft = secondsToTime(event.start - currentTimeStamp);
            smallText = secondsLeft;
            html += `<div class='cte_clock_event'><div class="cte_clock_event_title">${event.title}</div>starts in ${secondsLeft}</div>`;
        }

        TOOLTIP_ACTIONS.small(smallText)
        TOOLTIP_ACTIONS.html(html)

        timeHandler = setTimeout(() => {
            gatherData();
        }, 1000);

    }

    gatherData();




    //  GENERATE TOOLTIP    -------------------------------------------------------------

    function generateTooltip() {
        if ($('.cte_clock_holder').length > 0) return; // CTE clock somehowreaydy exists abort the mission

        message('generating tooltip');


        let tc_clock_tooltip = $('.tc-clock-tooltip');  // Torn clock tooltip
        let server_date_time = $('.server-date-time');  // Torn server time 
        if (!server_date_time.length === 0 || !tc_clock_tooltip.length === 0) {
            message('tc_clock_tooltip or server_date_time missing');
            return;
        }

        tc_clock_tooltip.html('');

        let cte_clock_holder = $('<div>', {
            id: 'cte_clock_holder',
            class: 'cte_clock_holder no-select cte_clock_active',
        }).appendTo(tc_clock_tooltip).on("click", function () {
            toggleTooltip();
        });

        server_date_time.appendTo(cte_clock_holder);

        let s = $('<span>', {
            class: 'cte_clock',
        }).appendTo(cte_clock_holder);

        let cte_clock_icon = $('<i>', {
            class: `fa-solid ${ICONS_DEFAULT.loading} loading-spin`,
        }).prependTo(s);
        let cte_clock = $('<span>', {
            text: "test"
        }).appendTo(s);

        let cte_clock_events_holder = $('<div>', {
            class: `cte_clock_events_holder`,
            text: 'loading' // <div class='cte_clock_event'><div class="cte_clock_event_title">Elimination</div>in 1 day</div>
        }).appendTo(cte_clock_holder);



        GLOBAL_DIVS.cte_clock_holder = cte_clock_holder;
        GLOBAL_DIVS.cte_clock = cte_clock;
        GLOBAL_DIVS.cte_clock_icon = cte_clock_icon;
        GLOBAL_DIVS.tc_clock_tooltip = tc_clock_tooltip;
        GLOBAL_DIVS.cte_clock_events_holder = cte_clock_events_holder;

        if (!SETTINGS.tooltipExpanded) cte_clock_events_holder.hide();
        if (SETTINGS.hideSmallTimer === true) cte_clock.hide();



    }
    function toggleTooltip() {
        GLOBAL_DIVS.cte_clock_events_holder.toggle();
        let isVisible = GLOBAL_DIVS.cte_clock_events_holder.is(":visible");
        SETTINGS.tooltipExpanded = isVisible;
        saveSettings();

        if (isVisible) gatherData();
        return;
    }


    //  GENERATE SETTINGS   -------------------------------------------------------------

    function generateSettings() {
        message('Generating settings')
        $(".cte_settings_holder").remove();

        let cte_settings_holder = $('<div>', {
            class: `cte_settings_holder`,
            html: `
                <div class="cte_title">Custom and nearest Torn events | ${SCRIPT_VERSION}</div>
                API key: <button class="cte_apiKey_button cte_apiKey"> </button>
               
                <!--<button class="cte_fetch_button"><i class="fa-solid fa-rotate"></i></button>-->

                <!--<button class="cte_gatherdata_button">gather data</button>-->
                <div style="padding: 10px 0;">
                    Use limited key. Or click here to generate custom (torn calendar, user calendar) api key
                </div>
                <div>
                    <input type="checkbox" id="cte_participiate_checkbox" name="cte_participiate_checkbox" ${(SETTINGS.participateCTE) ? 'checked' : ''} />
                    <label for="cte_participiate_checkbox">Participate in CTE</label>
                </div>

                <!--
                <div>
                    <input type="checkbox" id="cte_smallTimer_checkbox" name="cte_smallTimer_checkbox" ${(SETTINGS.hideSmallTimer) ? 'checked' : ''} />
                    <label for="cte_smallTimer_checkbox">Hide small timer</label>
                </div>
                -->
            `
        }).appendTo('.content-wrapper');

        function displayApiKey(div) {
            let key = '';
            if (SETTINGS.apiKey === null || SETTINGS.apiKey === '' || !SETTINGS.apiKey) {
                key = 'Api key not set';
            } else {
                key = "************" + SETTINGS.apiKey.slice(12);
            }
            div.text(key);
        }

        let cte_apiKey = $(".cte_apiKey");
        let cte_apiKey_button = $(".cte_apiKey_button");
        let cte_fetch_button = $(".cte_fetch_button");
        let cte_participiate_checkbox = $("#cte_participiate_checkbox");
        let cte_smallTimer_checkbox = $("#cte_smallTimer_checkbox");

        displayApiKey(cte_apiKey)

        cte_apiKey_button.on("click", function (e) {
            let w = prompt("Enter api key. Leave balnk to remove it");
            if (w || w === "") {
                if (w.length > 0 && w.length !== 16) {
                    alert('Api key must be 16 chars');
                    return;
                }
                SETTINGS.apiKey = w;
                displayApiKey(cte_apiKey);
                saveSettings();
                fetchData();
            }
        });

        cte_fetch_button.on("click", function (e) {
            fetchData();
        });



        cte_participiate_checkbox.change(async function (e) {
            e.stopPropagation();

            if (!this.checked) {

                let q = confirm("Disabling participation will remove all your hosted and watch events from server");
                if (q) {
                    TOOLTIP_ACTIONS.loading('removing CTE data...')
                    let answer = await CTE_fetch({ action: "removeall" });
                    if (answer.success === true) {
                        $("#cteData").remove();
                        if (SETTINGS.hostedEvents) delete SETTINGS.hostedEvents;
                        if (SETTINGS.watchEvents) delete SETTINGS.watchEvents;
                        gatherData();
                    } else {
                        alert('Error just happened. See the log and contact developer');
                        message(answer);
                        this.checked = true;
                        //gatherData();
                        return;
                    }
                } else {
                    this.checked = true;
                    return;
                }

            } else {
                let answer = await CTE_fetch();
                if (answer.success === true) {
                    SETTINGS.hostedEvents = answer.hostedEvents ?? [];
                    SETTINGS.watchEvents = answer.watchEvents ?? [];
                    saveSettings();
                    gatherData();
                }
                generateCTEdisplay();
            }

            SETTINGS.participateCTE = this.checked;
            saveSettings();
        });

        cte_smallTimer_checkbox.change(async function (e) {
            if (this.checked) {
                GLOBAL_DIVS.cte_clock.hide();
            } else {
                GLOBAL_DIVS.cte_clock.show();
            }
            SETTINGS.hideSmallTimer = this.checked;
            saveSettings();
        });
        if (SETTINGS.participateCTE) generateCTEdisplay();
    }


    //  GENERATE CTE WINDOW   -------------------------------------------------------------

    function generateCTEdisplay() {
        $("#cteData").remove();
        message('Generating CTE display');

        let currentTimeStamp = Math.round(Date.now() / 1000);

        let cteData = $('<div>', {
            id: 'cteData',
            html: `
                <button class='cteData_header cteData_header_addHost'><i class="fa-solid fa-plus"></i> Hosted events</button>
                <ul class="cte_hostedEvents_holder"></ul>
                
                <button style="margin-top:20px"class='cteData_header cteData_header_addWatch'><i class="fa-solid fa-plus"></i> Watched events</button>
                <ul class="cte_watchEvents_holder"></ul>             
            `
        }).appendTo($('.cte_settings_holder'));

        //  WATCH EVENTS
        let cte_watchEvents_holder = $(".cte_watchEvents_holder");
        let watchEvents = SETTINGS.watchEvents ?? [];
        for (let i = 0; i < watchEvents.length; i++) {
            let event = watchEvents[i];
            let ul = $('<ul>', {
                class: 'cteData_event',
                html: fillEvent(event)
            }).appendTo(cte_watchEvents_holder);
        }

        //  HOSTED EVENTS
        let cte_hostedEvents_holder = $(".cte_hostedEvents_holder");
        let hostedEvents = SETTINGS.hostedEvents ?? [];
        for (let i = 0; i < hostedEvents.length; i++) {
            let event = hostedEvents[i];
            let ul = $('<ul>', {
                class: 'cteData_event',
                html: fillEvent(event, true),
                eventid: event.id
            }).appendTo(cte_hostedEvents_holder);
            ul.attr('eventID', event.ud);
        }


        $(".cteEventDelete").on("click", async function (e) {
            let eventID = $(this).attr('eventid');
            let host = $(this).attr('host');

            let q = confirm(`Delete event?`);
            if (!q) return;

            TOOLTIP_ACTIONS.loading('deleting CTE event...')
            let answer = await CTE_fetch({
                action: "deleteevent",
                id: eventID,
                host: host
            });

            if (answer.success) {

                let cteData = await CTE_fetch();
                SETTINGS.hostedEvents = cteData.hostedEvents ?? [];
                SETTINGS.watchEvents = cteData.watchEvents ?? [];
                saveSettings();
                gatherData();
                $(".cteHostEvent").remove();

                detectOpenPages();

            } else {
                alert(`Error! ${answer.message}`);
                message(answer);
                gatherData();
            }

        });
        $(".cteEventEdit").on("click", function (e) {
            let eventID = $(this).attr('eventid');
            //TODO
        });
        $(".cteEventShare").on("click", function (e) {
            let eventID = $(this).attr('eventid');
            //event://sdasjdhasd

            navigator.clipboard.writeText(`event://${eventID}`);
            alert('Event share link has been copied to the clipboard')
        });
        $(".cteEventCopy").on("click", function (e) {
            let eventID = $(this).attr('eventid');
            //event://sdasjdhasd

            navigator.clipboard.writeText(`${eventID}`);
            alert('Event id has been copied to the clipboard')

        });



        function fillEvent(event, host = false) {

            let start = event.start;
            let end = event.end;
            let duration = getDatesBetween(start, end).length;
            let eventStatus = '';
            if (currentTimeStamp > start && currentTimeStamp < end) {
                eventStatus = `ends ${unixSecondsToGMT(event.end)}`;
            } else if (currentTimeStamp < start) {
                eventStatus = `starts ${unixSecondsToGMT(event.start)}`
            } else {
                eventStatus = 'finished';
            }
            //let eventStatus = (currentTimeStamp > start) ? `ends ${unixSecondsToGMT(event.end)}` : `starts ${unixSecondsToGMT(event.start)}`
            //secondsLeft = `ends in ${secondsToTime(event.end - currentTimeStamp)}`;

            let controls = `
                <i class="fa-solid fa-trash-can cteEventDelete" eventID="${event.id}" host=${host}></i>
                <!--<i class="fa-solid fa-pen-to-square cteEventEdit" eventID="${event.id}"></i>-->
                <i class="fa-solid fa-share-from-square cteEventShare" eventID="${event.id}"></i>
                <i class="fa-solid fa-clipboard cteEventCopy" eventID="${event.id}"></i>
            `;

            //if (!host) controls = `<i class="fa-solid fa-trash-can cteEventDelete" eventID="${event.id}"></i>`;

            let html = `
                <div class="cte_row">
                    <div class="cte_col">${event.title}</div>
                    <div class="cte_col">${eventStatus}</div>
                    <div class="cte_col cte_col_controls">
                        ${(controls)}
                    </div>
                </div>
            `



            //html = `${event.title} ${duration} day${duration > 1 ? "s" : ""} event | ${eventStatus}`;

            return html;
        }

        $(".cteData_header_addWatch").on("click", function (e) {
            let w = prompt("Enter event id");
            if (w) {
                addEventToWatch(w);
            }
        });
        $(".cteData_header_addHost").on("click", function (e) {
            generateHostNewEventWindow();
        });


    }


    async function generateHostNewEventWindow(data = {}) {
        let timestamp = Math.floor(Date.now() / 3600000) * 3600; // current time with 0 seconds

        let editing = data.editing ?? false;
        let eventID = data.eventID;
        let eventName = data.name ?? "";
        let eventIcon = data.name ?? ICONS_DEFAULT.event;
        let eventStart = data.start ?? timestamp;
        let eventEnd = data.end ?? timestamp + (15 * 60); // adding 15 mins by default

        function timeStampManipulation(value, format = 'todate') {
            if (format === 'todate') {
                const date = new Date(value * 1000);

                const dd = String(date.getUTCDate()).padStart(2, '0');
                const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
                const yyyy = String(date.getUTCFullYear())

                const hh = String(date.getUTCHours()).padStart(2, '0');
                const min = String(date.getUTCMinutes()).padStart(2, '0');

                return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
            } else {

                const [date, time] = value.split("T");
                const [year, month, day] = date.split("-").map(Number);
                const [hour, minute] = time.split(":").map(Number);

                const unixSecondsGMT = Math.floor(
                    Date.UTC(year, month - 1, day, hour, minute) / 1000
                );

                return unixSecondsGMT;
            }
        }


        //message(timeStampManipulation(1767713160));
        //message(timeStampManipulation('2026-01-06T15:26', 'tounix'))

        let cteData = $('<div>', {
            class: 'cteHostEvent',
            html: `

                    <div class="cteHostEvent_form">
                        <div class="cte_row">
                            <div class="cte_col">
                                <label for="cteHost_inputEventName">Event name</label>
                                <input type="text" id="cteHost_inputEventName" value="${eventName}">
                            </div>
                            <div class="cte_col">
                                <label for="cteHost_inputEventIcon">Event icon (use Fontawesome)</label>
                                <input type="text" id="cteHost_inputEventIcon" value="${eventIcon}"  list="fa-icons">
                                <i class="cteHost_eventIcon fa-solid ${eventIcon}"></i>
                            </div>
                            <div class="cte_col">
                                <label for="cteHost_inputEventStart">Start TCT</label>
                                <input type="datetime-local" id="cteHost_inputEventStart" value='${timeStampManipulation(eventStart, 'todate')}'>
                            </div>
                            <div class="cte_col">
                                <label for="cteHost_inputEventEnd">End</label>
                                <input type="datetime-local" id="cteHost_inputEventEnd" value='${timeStampManipulation(eventEnd, 'todate')}'>
                            </div>
                        </div>

                        <div class="cteHostEvent_form_footer cte_row">
                            <div>
                                <button class='cteHost_save cte_button_blue'>${(editing) ? 'Save' : 'Add'}</button>
                            </div>
                            <div>
                                <button class='cteHost_close'>Close</button>
                            </div>
                        </div>
                        
                    </div>

                    

                    <datalist id="fa-icons">
                        <option value="fa-home"></option>
                        <option value="fa-pluss"></option>
                        <option value="Mint"></option>
                        <option value="Strawberry"></option>
                        <option value="Vanilla"></option>
                    </datalist>


            `
        }).appendTo($('#cteData'));

        $("#cteHost_inputEventIcon").on("input", function (e) {
            $('.cteHost_eventIcon').attr('class', 'cteHost_eventIcon fa-solid ');
            $('.cteHost_eventIcon').addClass($(this).val().toLowerCase())

            //detect if icon exists

            const el = $('.cteHost_eventIcon')[0];
            const style = getComputedStyle(el, '::before');
            const content = style.content;

            let isIcon = content && content !== 'none' && content !== '""';

            if (!isIcon) $('.cteHost_eventIcon').addClass(ICONS_DEFAULT.event)
        });

        $(".cteHost_close").on("click", function (e) {
            $(".cteHostEvent").remove();
        });

        $(".cteHost_save").on("click", async function (e) {
            const eventNameInput = $("#cteHost_inputEventName").val();
            const eventIconInput = $(".cteHost_eventIcon").attr('class').split(' ').pop();
            const eventStartInput = (timeStampManipulation($("#cteHost_inputEventStart").val(), 'tounix'));
            const eventEndInput = (timeStampManipulation($("#cteHost_inputEventEnd").val(), 'tounix'));


            const dif = eventEndInput - eventStartInput;
            if (dif < 0) {
                alert(`Woah, something wrong with start and end time`);
                return;
            }
            if (eventNameInput.length > 30) {
                alert(`Event name is too ling. Should be 30 or less chars. Atm it's ${eventNameInput.length}`);
                return;
            }
            if (eventNameInput.trim().length === 0) {
                alert(`Event name can't be empty`);
                return;
            }

            $(this).prop("disabled", true);

            TOOLTIP_ACTIONS.loading('hosting CTE event...')
            let answer = await CTE_fetch({
                action: "hostevent", data: {
                    name: eventNameInput,
                    icon: eventIconInput,
                    start: eventStartInput,
                    end: eventEndInput,
                    id: eventID
                }
            });
            $(this).prop("disabled", false);
            if (answer.success) {

                let cteData = await CTE_fetch();
                SETTINGS.hostedEvents = cteData.hostedEvents ?? [];
                SETTINGS.watchEvents = cteData.watchEvents ?? [];
                saveSettings();
                gatherData();
                $(".cteHostEvent").remove();

                detectOpenPages();

            } else {
                alert(`Error! ${answer.message}`);
                message(answer);
                gatherData();
            }

            //fetchData();
            //gatherData();
            /*
            if (answer.success === true) {
                $("#cteData").remove();
                if (SETTINGS.hostedEvents) delete SETTINGS.hostedEvents;
                if (SETTINGS.watchEvents) delete SETTINGS.watchEvents;
                gatherData();
            */

        });



    }

    async function addEventToWatch(id) {
        if (!SETTINGS.participateCTE) return;

        TOOLTIP_ACTIONS.loading('adding CTE event...');
        let answer = await CTE_fetch({ action: "addwatch", id: id });
        let success = false;
        if (answer.success === true) {
            message('SUCCESS -- answer ---');
            message(answer);


            let cteData = await CTE_fetch();
            SETTINGS.hostedEvents = cteData.hostedEvents ?? [];
            SETTINGS.watchEvents = cteData.watchEvents ?? [];
            saveSettings();
            message("--- answer 2 ---")
            message(cteData);

            success = true;

        } else {
            let msg = 'Error just happened. See the log and contact developer';
            if (answer.message) msg = answer.message
            alert(`Error!\n${msg}`);
            message(answer);
        }

        message("--- settings before gather ---");
        message(SETTINGS);

        gatherData();

        if (success) detectOpenPages();
    }



    //  GENERATE CALENDAR    -------------------------------------------------------------

    function generateCalendar() {
        if (!SETTINGS.watchEvents || SETTINGS.watchEvents.length === 0) return;
        const monthTitleTextMap = new WeakMap();


        const observer = new MutationObserver(mutations => {
            let foundPropperDiv = false;
            for (const mutation of mutations) {
                // --- 1 & 2: detect new calendar / month-view / monthTitle elements ---
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        const el = /** @type {HTMLElement} */ (node);

                        // 1) div with class 'calendar___KkLtY' appears
                        if (el.matches('div.calendar___KkLtY') || el.querySelector('div.calendar___KkLtY')) {
                            //message('calendar___KkLtY appeared:', el);
                            foundPropperDiv = true;
                        }

                        // 2) div with class 'month-view' appears
                        if (el.matches('div.month-view') || el.querySelector('div.month-view')) {
                            //message('month-view appeared:', el);
                            foundPropperDiv = true;
                        }

                        // Track any month titles that appear in this subtree (or the node itself)
                        if (el.matches('.monthTitle___ulJOS')) {
                            monthTitleTextMap.set(el, (el.textContent || '').trim());
                        }
                        el.querySelectorAll?.('.monthTitle___ulJOS').forEach(titleEl => {
                            monthTitleTextMap.set(titleEl, (titleEl.textContent || '').trim());
                        });
                    }
                }

                // --- 3: detect text content change of .monthTitle___ulJOS ---
                if (
                    mutation.type === 'characterData' ||
                    mutation.type === 'childList' ||
                    mutation.type === 'attributes'
                ) {
                    const rawTarget =
                        mutation.target.nodeType === Node.ELEMENT_NODE
                            ? /** @type {HTMLElement} */ (mutation.target)
                            : mutation.target.parentElement;

                    if (!rawTarget) continue;

                    const monthTitleEl = rawTarget.closest('.monthTitle___ulJOS');
                    if (!monthTitleEl) continue;

                    const newText = (monthTitleEl.textContent || '').trim();
                    const oldText = monthTitleTextMap.get(monthTitleEl);

                    // First time we see this title via mutations: just initialize
                    if (oldText === undefined) {
                        monthTitleTextMap.set(monthTitleEl, newText);
                        continue;
                    }

                    if (oldText !== newText) {
                        /*
                        message('monthTitle___ulJOS text changed:', {
                            from: oldText,
                            to: newText,
                            element: monthTitleEl
                        });
                        */
                        monthTitleTextMap.set(monthTitleEl, newText);
                        foundPropperDiv = true;
                    }
                }
            }
            if (foundPropperDiv) {

                //  MANIPULATE WITH CALENDAR

                setCalendarElements();
            }
        });

        'content-wrapper'
        const calendarRoot = document.querySelector('.content-wrapper');

        if (calendarRoot) {
            observer.observe(calendarRoot, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
        /*
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            // attributes: true,
            characterData: true
        });
        */

        function setCalendarElements() {

            $(".cte_calendar_active").prop("onclick", null).off("click");
            $(".cte_calendar_active").removeClass('cte_calendar_active');
            $(".cte_calendar_active_overlap").removeClass('cte_calendar_active_overlap');


            function unixToID(timestampInSeconds) {
                const date = new Date(timestampInSeconds * 1000);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = date.getFullYear();

                return `${day}${month}${year}`;
            }




            const customEvents = [
                ...allEvents.ongoing_events,
                ...allEvents.future_events,
                ...allEvents.overlapping_events
            ].filter(event => event.custom === true);

            for (let i = 0; i < customEvents.length; i++) {
                let event = customEvents[i];
                let start = event.start;
                let end = event.end;
                let id = unixToID(start);

                let activeDates = getDatesBetween(start, end);
                message(activeDates)
                for (let d = 0; d < activeDates.length; d++) {
                    let div = $(`[id*="${activeDates[d]}"]`).first();
                    if (div.length === 0) continue;

                    //let numberWrapper = div.find(`[class*="numberWrapper"]`);
                    //if (numberWrapper.length === 0) continue;
                    //numberWrapper.addClass('cte_calendar_active')
                    //numberWrapper.css('color', 'red')
                    if (!div.hasClass('cte_calendar_active')) {
                        div.addClass('cte_calendar_active');
                        div.attr('cte-event-name', event.title);

                        div.on("click", function (e) {
                            /*
                            if ($(".cte_calendar_event_info").length > 0) {
                                $(".cte_calendar_event_info").remove();
                                return;
                            }
                            */

                            $(".cte_calendar_event_info").remove();

                            e.stopPropagation();
                            let attr = $(this).attr("cte-event-name").split(";").join('\n');
                            alert(`Custom events:\n${attr}`)
                            /*
                            message(this);
                            let pos = $(this).position();

                            let holder = $('<div>', {
                                class: 'cte_calendar_event_info',

                                html: 'loading data...'
                            }).appendTo($(".calendar-container"));

                            /*
                            let left = pos.left - 158;
                            if (left < 0) left = 0;

                            holder.css('left', `${left}px`)
                            */
                        });
                    } else {
                        div.addClass('cte_calendar_active_overlap');
                        let oldattr = div.attr('cte-event-name')
                        div.attr('cte-event-name', `${oldattr};${event.title}`);
                    }

                }

                //message(getDatesBetween(start, end))

                /*
                let div = $(`[id*="${id}"]`);
                if (div.length === 0) continue;
    
                let numberWrapper = div.find(`[class*="numberWrapper"]`);
                if (numberWrapper.length === 0) continue;
                
                numberWrapper.css('color', 'red')
                */
                //message(numberWrapper)
            }

            // message(customEvents)

        }
    }

    function getDatesBetween(startUnix, endUnix) {
        const dates = [];

        // Convert seconds → milliseconds
        let current = new Date(startUnix * 1000);
        const end = new Date(endUnix * 1000);

        while (current <= end) {
            const dd = String(current.getDate()).padStart(2, "0");
            const mm = String(current.getMonth() + 1).padStart(2, "0");
            const yyyy = current.getFullYear();

            dates.push(`${dd}${mm}${yyyy}`);

            // Move to next day
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }


    //  LINK DETECTOR    -------------------------------------------------------------






    // You provide this somewhere globally:
    function onEventClicked(eventId, el) {
        let w = confirm(`Add event ${eventId} to your watch list?`);
        if (w) {
            addEventToWatch(eventId);
        }
        //message("Event clicked:", eventId, el);
    }

    (() => {
        // Match event:// then "payload" until whitespace or common punctuation terminators
        // You can tweak the stop chars based on your content.
        const EVENT_RE = /event:\/\/([^\s<>"'`)\]}.,!?;:]+)/g;

        // Prevent re-processing inside these tags
        const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "BUTTON", "A"]);

        function isSkippableNode(node) {
            const p = node.parentElement;
            if (!p) return true;
            return SKIP_TAGS.has(p.tagName) || p.closest("[data-eventlink-processed] button");
        }

        function makeButton(eventId) {
            const btn = document.createElement("button");
            btn.type = "button";
            //btn.textContent = `event://${eventId}`;
            btn.textContent = `Add to CTE: ${eventId}`;
            btn.className = "cte_event_quicklink";
            btn.dataset.eventId = eventId;
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                onEventClicked(eventId, btn);
            });
            return btn;
        }

        function processTextNode(textNode) {
            if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
            if (isSkippableNode(textNode)) return;

            const text = textNode.nodeValue;
            if (!text || !text.includes("event://")) return;

            EVENT_RE.lastIndex = 0;
            let match;
            let lastIdx = 0;

            const frag = document.createDocumentFragment();
            let replaced = false;

            while ((match = EVENT_RE.exec(text)) !== null) {
                replaced = true;

                const fullMatchStart = match.index;
                const fullMatchEnd = EVENT_RE.lastIndex;
                const eventId = match[1];

                // text before match
                if (fullMatchStart > lastIdx) {
                    frag.appendChild(document.createTextNode(text.slice(lastIdx, fullMatchStart)));
                }

                // the button for this event://...
                frag.appendChild(makeButton(eventId));

                lastIdx = fullMatchEnd;
            }

            if (!replaced) return;

            // remaining text after last match
            if (lastIdx < text.length) {
                frag.appendChild(document.createTextNode(text.slice(lastIdx)));
            }

            // Replace the original text node
            const parent = textNode.parentNode;
            if (parent) parent.replaceChild(frag, textNode);
        }

        function walkAndProcess(root) {
            // TreeWalker over text nodes only
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        if (!node.nodeValue || !node.nodeValue.includes("event://")) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (isSkippableNode(node)) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    },
                }
            );

            const toProcess = [];
            let n;
            while ((n = walker.nextNode())) toProcess.push(n);
            toProcess.forEach(processTextNode);
        }
        if (SETTINGS.participateCTE === true) {
            // Initial pass
            walkAndProcess(document.body);

            // Watch for new content (ticker/chat)
            const obs = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    // new nodes added
                    for (const node of m.addedNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            processTextNode(node);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            // Avoid repeatedly processing the same subtree too aggressively
                            walkAndProcess(node);
                        }
                    }

                    // text changed
                    if (m.type === "characterData" && m.target?.nodeType === Node.TEXT_NODE) {
                        processTextNode(m.target);
                    }
                }
            });


            obs.observe(document.body, {
                subtree: true,
                childList: true,
                characterData: true,
            });

            // Optional: expose a manual re-scan hook
            window.rescanEventLinks = () => walkAndProcess(document.body);
        }

    })();




    /************************************************************************************************
        MAIN FUNCTIONS
    *************************************************************************************************/

    async function fetchData() {

        let currentTimeStamp = Math.round(Date.now() / 1000);

        let fetchInterval = 1; //TODO
        if (currentTimeStamp - SETTINGS.lasetUpdate <= fetchInterval) {
            message(`You need wait ${fetchInterval - (currentTimeStamp - SETTINGS.lasetUpdate)} second(s) before manual fetch`, true)
            return;
        }

        //----- FETCH TORN CALENDAR -----------------------------------------

        message('fetching Torn data...')
        TOOLTIP_ACTIONS.loading('fetching Torn data...');

        const calendarData = await GM_fetch({ url: `https://api.torn.com/v2/torn/?selections=calendar&key=${SETTINGS.apiKey}` });

        if (calendarData.error) {
            TOOLTIP_ACTIONS.error(calendarData.error.error);
            return;
        }


        let json = calendarData.calendar;
        if (json.events && json.competitions) {
            SETTINGS.tornEvents = json["events"].concat(json.competitions);
        } else {
            SETTINGS.tornEvents = json.events;
        }



        //----- FETCH USER CALENDAR -----------------------------------------

        message('fetching Torn user data...');
        TOOLTIP_ACTIONS.loading('fetching Torn user data...');

        const userData = await GM_fetch({ url: `https://api.torn.com/v2/user/?selections=calendar&key=${SETTINGS.apiKey}` });
        if (userData.error) {
            TOOLTIP_ACTIONS.error(userData.error.error);
            return;
        }

        currentTimeStamp = Math.round(Date.now() / 1000);
        SETTINGS.lasetUpdate = currentTimeStamp;
        SETTINGS.userStartTime = userData.calendar.start_time;


        //----- FETCH CTE  -----------------------------------------


        if (SETTINGS.participateCTE) {
            message('fetching CTE data...');
            TOOLTIP_ACTIONS.loading('fetching CTE data...');
            let shaKey = await sha256(SETTINGS.apiKey)
            //const cteData =  await GM_fetch(`https://level5.ee/warehouse/torn/cte/index.php`, 'POST', { action: "test" }, { 'Authorization': `Bearer ${shaKey}` });
            const cteData = await CTE_fetch();
            if (cteData.success === true) {
                message("success");
                message(cteData)
                SETTINGS.hostedEvents = cteData.hostedEvents ?? [];
                SETTINGS.watchEvents = cteData.watchEvents ?? [];
            } else {
                TOOLTIP_ACTIONS.error('Error fetching CTE');
                message(['ERROR in fetchData() for CTE', cteData], true);
                return;
            }


        }




        saveSettings();
        gatherData();
        //detectOpenPages(); //TODO
    }

    function setTimeOnUnix(unixTime, timeString) {
        const match = timeString.match(/^(\d{1,2}:\d{2})/);
        if (!match) return null;

        const [targetHour, targetMinute] = match[1].split(":").map(Number);
        //const [targetHour, targetMinute] = timeString.split(":").map(Number);


        const date = new Date(unixTime * 1000);


        date.setUTCHours(targetHour);
        date.setUTCMinutes(targetMinute);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);



        return Math.floor(date.getTime() / 1000);

    }

    function unixSecondsToGMT(unixSeconds) {
        const date = new Date(unixSeconds * 1000);

        const dd = String(date.getUTCDate()).padStart(2, '0');
        // const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const mmm = String(date.getUTCMonth())
        const yyyy = String(date.getUTCFullYear())

        const hh = String(date.getUTCHours()).padStart(2, '0');
        const min = String(date.getUTCMinutes()).padStart(2, '0');
        const ss = String(date.getUTCSeconds()).padStart(2, '0');

        let mm_names = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']


        return `${dd} ${mm_names[mmm]} ${hh}:${min}:${ss}`;
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

        if (days === 1) {
            // Include days, show full time
            return `${days} day${days > 1 ? "s" : ""} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        } else if (days > 1) {
            // Include days, show full time
            //return `${days} day${days > 1 ? "s" : ""} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
            return `${days} day${days > 1 ? "s" : ""}`;
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

    function getUpcomingEventsSorted(events) {
        const now = Math.floor(Date.now() / 1000); // UTC seconds

        const ongoing_events = [];
        const future_events = [];
        const overlapping_events = [];

        // Ignore fully past events
        const nonPast = events.filter(e => e.end >= now);

        // Ongoing events
        for (const e of nonPast) {
            if (e.start <= now && now <= e.end) {
                ongoing_events.push(e);
            }
        }

        // Future events (start in the future)
        const futureCandidates = nonPast.filter(e => e.start > now);

        for (const e of futureCandidates) {
            // Only consider overlaps with ONGOING events
            const overlapsOngoing = ongoing_events.some(ongoing =>
                ongoing.start <= e.start && e.start <= ongoing.end
                // equivalently: e.start <= ongoing.end (since ongoing.start <= now < e.start)
            );

            if (overlapsOngoing) overlapping_events.push(e);
            else future_events.push(e);
        }

        // Sort each category by start time
        ongoing_events.sort((a, b) => a.start - b.start);
        future_events.sort((a, b) => a.start - b.start);
        overlapping_events.sort((a, b) => a.start - b.start);

        return { ongoing_events, future_events, overlapping_events };
    }



    function getEventIcon(eventName) {
        eventName = eventName.toLowerCase();

        for (const obj of TORN_EVENTS_ICONS) {
            const key = Object.keys(obj)[0];
            if (eventName.includes(key.toLowerCase())) {
                return obj[key];
            }
        }
        return null;
    }

    function saveSettings() {
        //message("SAVING SETTINGS", SETTINGS)
        GM_setValue(STORAGE_NAME, SETTINGS);
    }
    function message(msg, error = false) {
        let func = 'log';
        let spec = false;
        if (error === true) func = 'warn';
        if (error && typeof error === 'string') {
            func = error;
            spec = true;
        }

        if (func === 'log' || func === 'warn') {
            console[func](`%cCTE`, 'background: #212c37; color: white;padding:5px; border-radius:3px;', msg);
        } else {
            console.log(`%c↓ CTE ↓`, 'background: #212c37; color: white;padding:5px; border-radius:3px;');
            console[func](msg);
        }



        //console[func](`%cCTE`, 'background: #212c37; color: white;padding:5px; border-radius:3px;', msg);

    }



    async function sha256(str) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest("SHA-256", buf);
        return [...new Uint8Array(hash)]
            .map(x => x.toString(16).padStart(2, "0"))
            .join("");
    }




    async function GM_fetch(options) {

        let url = options.url || null;
        let method = options.method || 'GET';
        let data = options.data || {};
        let headers = options.headers || {};

        if (url === null) return ({ error: true });


        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json", //application/x-www-form-urlencoded
                    ...headers
                },
                onload: function (response) {
                    try {
                        if (!response || !response.responseText) {
                            message(response)
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

    async function CTE_fetch(data = {}) {
        //let url = `https://level5.ee/warehouse/torn/cte/index.php`;
        let url = `https://cte.tornscripts.co.za/`;

        let shaKey = await sha256(SETTINGS.apiKey)

        let headers = {
            'Authorization': `Bearer ${shaKey}`
        }

        let cteData = await GM_fetch({
            url: url,
            method: 'POST',
            data: data,
            headers: headers
        });


        return cteData;

    }


    GM_addStyle(`
        /*  OVERWRITE TORN STYLE    */

        .tc-clock-tooltip{
            width: max-content !important;
            left: calc(100% + 60px) !important;
            transform: translateX(-100%);
            padding: 0 !important;
        }
         .d .toolbar .tc-clock.sticky .tc-clock-tooltip {
            left: unset !important;
            transform: translateX(0);
        }
        .cte_title{
            font-weight: bold;
            color: orange;
            margin-bottom: 20px;
        }
        .cte_clock_holder{
            margin: 2px;
            border-radius: 5px;
            padding: 2px 6px;
            cursor: pointer;
        }

        .cte_clock{
            margin-left: 5px;
            padding-left: 5px;
            border-left: 1px solid rgba(255, 255, 255, 0.3);
            font-weight: normal;
        }

        .fa-solid{
            margin-right: 4px;
        }


         .cte_clock_events_holder{
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: block;
            padding: 3px 0;
            font-weight: normal;
            margin-top: 3px;
        }








        /*
        :root {
            --cte_main_padding_left: 7px;
        }
        .tc-clock-tooltip{
            width: max-content !important;
            left: calc(100% + 60px) !important;
            transform: translateX(-100%);
            padding: 0 !important;
            padding-left: var(--cte_main_padding_left) !important;
        }
        .d .toolbar .tc-clock.sticky .tc-clock-tooltip {
            left: unset !important;
            transform: translateX(0);
        }
        
        .fa-solid{
            margin-right: 4px;
        }
        .cte_clock_holder{
            display: inline-block;
            margin-left: 6px;
            padding: 2px 8px;
            border-radius: 3px;
            margin-top: 1px;
            margin-bottom: 1px;
            margin-right: 1px;
            position:relative;
            min-width: 20px;

            font-weight: normal;
            text-shadow: none;
        }
        .cte_clock_holder:before{
            content: '';
            display: block;
            position: absolute;
            top: 0;
            width: 1px;
            background-color: rgba(255,255,255,0.4);
            left: -1px;
            transform: translateY(30%);
            height: 60%;
        }
        .cte_clock_events_holder{
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: block;
            margin-right: var(--cte_main_padding_left);
            padding: 3px 0;
            font-weight: normal;
        }
            */






        .cte_clock_event{
            line-height: 13px;
            padding: 2px;
        }
        .cte_clock_event:not(:first-child){
            margin-top: 2px;
            padding-top: 2px;
            border-top: 1px solid rgba(255,255,255,0.2)
        }


        .cte_clock_event_title{
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding: 2px;
            max-width: 240px;
        }

        /* .tc-clock-tooltip:hover .cte_clock_holder{ */
        .cte_clock_holder:hover{
            background-color: rgba(28, 26, 26, 1) !important;
        }
        .cte_clock_icon{
            position: relative;
        }
        .cte_clock_active{
            border: 1px solid rgba(97, 119, 0, 1);
            background-color: rgb(54, 72, 46);
            color: #fff !important;
        }
        .cte_torn_clock_active svg{
           /* fill: rgba(137, 167, 3, 1) !important;*/
        }
        .cte_clock_error{
            border: 1px solid rgba(119, 0, 0, 1);
            background-color: rgba(74, 50, 48, 1);
        }
        .cte_torn_clock_error svg{
            /*fill: rgba(160, 3, 3, 1) !important;*/
            
        }

        .cte_calendar_active{
            /*border: 1px solid red !important;*/
            background-color: rgba(182, 201, 99, 0.3) !important;
            box-shadow: 0px 0px 0px 1px #66761f inset;
            border-radius: 5px;
        }
            
        .cte_calendar_active:hover{
            background-color: rgba(182, 201, 99, 0.9) !important;
        }
        
        body.dark-mode .cte_calendar_active {
            background-color: rgba(77, 90, 22, 0.4) !important;
        }
        body.dark-mode .cte_calendar_active:hover {
             background-color: rgba(182, 201, 99, 0.5) !important;
        }
      
        .cte_calendar_active_overlap{
            /*position: relative;*/

            box-shadow: 0px 0px 0px 3px #66761f inset;
        }

        .cte_calendar_event_info{
            padding: 2px 2px 10px;
            position: absolute;
            width: 316px;
            position: absolute;
            background-color: var(--calendar-tooltip-bg);
            border-radius: 5px;
            z-index: 99999;
            box-shadow: var(--calendar-tooltip-box-shadow);
            margin-top: 10px;
        }
        .cte_calendar_event_info:after{
            content: "";
            position: absolute;
            bottom: -6px;           /* adjust position as needed */
            left: 50%;
            transform: translateX(-50%);

            width: 0;
            height: 0;

            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #000; 
        }
        /*
         .cte_calendar_active_overlap:after{
            content: "";
            position: absolute;
            right: 4px;   
            bottom: 4px;  

            width: 0;
            height: 0;

            border-left: 10px solid transparent;
            border-top: 10px solid transparent;
            border-right: 0;
            border-bottom: 10px solid #000;
        }
        */
       
        
        
        .cte_settings_holder{
            padding: 10px;
            background-color: #131a2a;
            margin-top: 10px;
            border-radius: 5px;
            color: lightgray;
        }
        .cte_settings_holder button{
            border: 1px solid rgba(0,0,0,0.5);  
            padding: 10px; 
            background-color: #3a4246;
            border-radius: 4px;
            color: rgba(255, 255, 255, 0.8);
        }
       
        .cte_button_blue{
            background-color: #3d84a8 !important;
        }
        .cte_settings_holder button:hover{
            background-color: #000 !important;
        }
        
        
        #cteData{
            border-top: 1px solid rgba(132, 137, 140, 1);
            margin-top: 10px;
            padding-top: 10px;
            position: relative;
        }



        #cteData *{
            box-sizing:border-box;
        }

        .cteData_event{
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            margin-bottom: 2px;
        }

        .cte_col_controls{
             flex-direction: row-reverse !important;
            /*justify-content: space-between;*/
            gap: 40px;
        }
        .cteHostEvent{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            background-color: rgba(19, 26, 42, 0.9);
        }
        .cteHostEvent_form{
            margin: 5px;
            padding: 5px;
            padding-top: 10px;
            background-color: #2c3244;
            border: 1px solid #4a5060;
            
            border-radius: 3px;
        }
        .cteHostEvent_form_footer{
            padding-top: 15px;
            padding-bottom: 10px;
            justify-content: center;
        }

        .cteHost_title{
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 6px;
        }


        .cteHostEvent_form label{
            display: block;
            margin-bottom: 4px;
        }

        .cteHostEvent_form input, .cteHostEvent_form select{
            width: 100%;
            padding: 5px;
            font-size: 12px;
            border: 0;
            background-color: rgba(255,255,255,0.4);
            color: #000;
        }
        .cteHostEvent_form input:focus, .cteHostEvent_form select:focus{
            background-color: rgba(255,255,255,0.8);
        }
        #cteHost_inputEventIcon{
            padding-left: 25px;
            
        }

        .cteHost_eventIcon{
            position: absolute;
            padding: 22px 10px;
            color: #000;
        }


        .cte_row {
            display: flex;
            gap: 16px; /* space between columns */
            flex-wrap: wrap; /* IMPORTANT */
        }

        .cte_col {
            flex: 1; /* each column takes equal width */
            display: flex;
            flex-direction: column;
        }
        .cte_col--full {
            flex: 0 0 100%;
            width: 100%;
        }

        .cteHost_save, .cteHost_close{
            width: 100%;
            min-width: 170px;
        }

     

        /* Small screens (mobile) */
        @media (max-width: 768px) {
            .cte_row {
                flex-direction: column;
            }
                .cte_col {
                    width: 100%;
                }
        }


  
        .cteData_header{
            font-weight: bold;
            margin: 8px 0px;
        }
        .cte_event_quicklink{
            color: #74c0fc;
            border: none !important;
            background-color: #444040;
            padding: 3px 12px;
            border-radius: 4px;
        }
        .cte_event_quicklink:hover{
             background-color: #000000ff;
             color: #ffffffff;
        }
        .no-select{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .loading-spin{
            animation:spin 3s linear infinite;
        }
            
        @keyframes spin { 
            100% { 
                -webkit-transform: rotate(360deg); 
                transform:rotate(360deg); 
            } 
        }

        /*********************************************************************************************************
        FA
        *********************************************************************************************************/

        @font-face {
            font-family: "Font Awesome 6 Free";
            font-style: normal;
            font-weight: 900;
            font-display: block;
            src: url("data:font/woff2;base64,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") format("woff2");
        }
        .fa{font-family:var(--fa-style-family,"Font Awesome 6 Free");font-weight:var(--fa-style,900)}.fa,.fa-brands,.fa-classic,.fa-regular,.fa-sharp-solid,.fa-solid,.fab,.far,.fas{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:var(--fa-display,inline-block);font-style:normal;font-variant:normal;line-height:1;text-rendering:auto}.fa-classic,.fa-regular,.fa-solid,.far,.fas{font-family:"Font Awesome 6 Free"}.fa-brands,.fab{font-family:"Font Awesome 6 Brands"}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-2xs{font-size:.625em;line-height:.1em;vertical-align:.225em}.fa-xs{font-size:.75em;line-height:.08333em;vertical-align:.125em}.fa-sm{font-size:.875em;line-height:.07143em;vertical-align:.05357em}.fa-lg{font-size:1.25em;line-height:.05em;vertical-align:-.075em}.fa-xl{font-size:1.5em;line-height:.04167em;vertical-align:-.125em}.fa-2xl{font-size:2em;line-height:.03125em;vertical-align:-.1875em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:var(--fa-li-margin,2.5em);padding-left:0}.fa-ul>li{position:relative}.fa-li{left:calc(var(--fa-li-width, 2em)*-1);position:absolute;text-align:center;width:var(--fa-li-width,2em);line-height:inherit}.fa-border{border-radius:var(--fa-border-radius,.1em);border:var(--fa-border-width,.08em) var(--fa-border-style,solid) var(--fa-border-color,#eee);padding:var(--fa-border-padding,.2em .25em .15em)}.fa-pull-left{float:left;margin-right:var(--fa-pull-margin,.3em)}.fa-pull-right{float:right;margin-left:var(--fa-pull-margin,.3em)}.fa-beat{animation-name:fa-beat;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-bounce{animation-name:fa-bounce;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))}.fa-fade{animation-name:fa-fade;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))}.fa-beat-fade,.fa-fade{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s)}.fa-beat-fade{animation-name:fa-beat-fade;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))}.fa-flip{animation-name:fa-flip;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-shake{animation-name:fa-shake;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-shake,.fa-spin{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal)}.fa-spin{animation-name:fa-spin;animation-duration:var(--fa-animation-duration,2s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-spin-reverse{--fa-animation-direction:reverse}.fa-pulse,.fa-spin-pulse{animation-name:fa-spin;animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,steps(8))}@media (prefers-reduced-motion:reduce){.fa-beat,.fa-beat-fade,.fa-bounce,.fa-fade,.fa-flip,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse{animation-delay:-1ms;animation-duration:1ms;animation-iteration-count:1;transition-delay:0s;transition-duration:0s}}@keyframes fa-beat{0%,90%{transform:scale(1)}45%{transform:scale(var(--fa-beat-scale,1.25))}}@keyframes fa-bounce{0%{transform:scale(1) translateY(0)}10%{transform:scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0)}30%{transform:scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em))}50%{transform:scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0)}57%{transform:scale(1) translateY(var(--fa-bounce-rebound,-.125em))}64%{transform:scale(1) translateY(0)}to{transform:scale(1) translateY(0)}}@keyframes fa-fade{50%{opacity:var(--fa-fade-opacity,.4)}}@keyframes fa-beat-fade{0%,to{opacity:var(--fa-beat-fade-opacity,.4);transform:scale(1)}50%{opacity:1;transform:scale(var(--fa-beat-fade-scale,1.125))}}@keyframes fa-flip{50%{transform:rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg))}}@keyframes fa-shake{0%{transform:rotate(-15deg)}4%{transform:rotate(15deg)}8%,24%{transform:rotate(-18deg)}12%,28%{transform:rotate(18deg)}16%{transform:rotate(-22deg)}20%{transform:rotate(22deg)}32%{transform:rotate(-12deg)}36%{transform:rotate(12deg)}40%,to{transform:rotate(0deg)}}@keyframes fa-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.fa-rotate-90{transform:rotate(90deg)}.fa-rotate-180{transform:rotate(180deg)}.fa-rotate-270{transform:rotate(270deg)}.fa-flip-horizontal{transform:scaleX(-1)}.fa-flip-vertical{transform:scaleY(-1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{transform:scale(-1)}.fa-rotate-by{transform:rotate(var(--fa-rotate-angle,0))}.fa-stack{display:inline-block;height:2em;line-height:2em;position:relative;vertical-align:middle;width:2.5em}.fa-stack-1x,.fa-stack-2x{left:0;position:absolute;text-align:center;width:100%;z-index:var(--fa-stack-z-index,auto)}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:var(--fa-inverse,#fff)}

        .fa-0:before{content:"\\30"}.fa-1:before{content:"\\31"}.fa-2:before{content:"\\32"}.fa-3:before{content:"\\33"}.fa-4:before{content:"\\34"}.fa-5:before{content:"\\35"}.fa-6:before{content:"\\36"}.fa-7:before{content:"\\37"}.fa-8:before{content:"\\38"}.fa-9:before{content:"\\39"}.fa-fill-drip:before{content:"\\f576"}.fa-arrows-to-circle:before{content:"\\e4bd"}.fa-chevron-circle-right:before,.fa-circle-chevron-right:before{content:"\\f138"}.fa-at:before{content:"\\40"}.fa-trash-alt:before,.fa-trash-can:before{content:"\\f2ed"}.fa-text-height:before{content:"\\f034"}.fa-user-times:before,.fa-user-xmark:before{content:"\\f235"}.fa-stethoscope:before{content:"\\f0f1"}.fa-comment-alt:before,.fa-message:before{content:"\\f27a"}.fa-info:before{content:"\\f129"}.fa-compress-alt:before,.fa-down-left-and-up-right-to-center:before{content:"\\f422"}.fa-explosion:before{content:"\\e4e9"}.fa-file-alt:before,.fa-file-lines:before,.fa-file-text:before{content:"\\f15c"}.fa-wave-square:before{content:"\\f83e"}.fa-ring:before{content:"\\f70b"}.fa-building-un:before{content:"\\e4d9"}.fa-dice-three:before{content:"\\f527"}.fa-calendar-alt:before,.fa-calendar-days:before{content:"\\f073"}.fa-anchor-circle-check:before{content:"\\e4aa"}.fa-building-circle-arrow-right:before{content:"\\e4d1"}.fa-volleyball-ball:before,.fa-volleyball:before{content:"\\f45f"}.fa-arrows-up-to-line:before{content:"\\e4c2"}.fa-sort-desc:before,.fa-sort-down:before{content:"\\f0dd"}.fa-circle-minus:before,.fa-minus-circle:before{content:"\\f056"}.fa-door-open:before{content:"\\f52b"}.fa-right-from-bracket:before,.fa-sign-out-alt:before{content:"\\f2f5"}.fa-atom:before{content:"\\f5d2"}.fa-soap:before{content:"\\e06e"}.fa-heart-music-camera-bolt:before,.fa-icons:before{content:"\\f86d"}.fa-microphone-alt-slash:before,.fa-microphone-lines-slash:before{content:"\\f539"}.fa-bridge-circle-check:before{content:"\\e4c9"}.fa-pump-medical:before{content:"\\e06a"}.fa-fingerprint:before{content:"\\f577"}.fa-hand-point-right:before{content:"\\f0a4"}.fa-magnifying-glass-location:before,.fa-search-location:before{content:"\\f689"}.fa-forward-step:before,.fa-step-forward:before{content:"\\f051"}.fa-face-smile-beam:before,.fa-smile-beam:before{content:"\\f5b8"}.fa-flag-checkered:before{content:"\\f11e"}.fa-football-ball:before,.fa-football:before{content:"\\f44e"}.fa-school-circle-exclamation:before{content:"\\e56c"}.fa-crop:before{content:"\\f125"}.fa-angle-double-down:before,.fa-angles-down:before{content:"\\f103"}.fa-users-rectangle:before{content:"\\e594"}.fa-people-roof:before{content:"\\e537"}.fa-people-line:before{content:"\\e534"}.fa-beer-mug-empty:before,.fa-beer:before{content:"\\f0fc"}.fa-diagram-predecessor:before{content:"\\e477"}.fa-arrow-up-long:before,.fa-long-arrow-up:before{content:"\\f176"}.fa-burn:before,.fa-fire-flame-simple:before{content:"\\f46a"}.fa-male:before,.fa-person:before{content:"\\f183"}.fa-laptop:before{content:"\\f109"}.fa-file-csv:before{content:"\\f6dd"}.fa-menorah:before{content:"\\f676"}.fa-truck-plane:before{content:"\\e58f"}.fa-record-vinyl:before{content:"\\f8d9"}.fa-face-grin-stars:before,.fa-grin-stars:before{content:"\\f587"}.fa-bong:before{content:"\\f55c"}.fa-pastafarianism:before,.fa-spaghetti-monster-flying:before{content:"\\f67b"}.fa-arrow-down-up-across-line:before{content:"\\e4af"}.fa-spoon:before,.fa-utensil-spoon:before{content:"\\f2e5"}.fa-jar-wheat:before{content:"\\e517"}.fa-envelopes-bulk:before,.fa-mail-bulk:before{content:"\\f674"}.fa-file-circle-exclamation:before{content:"\\e4eb"}.fa-circle-h:before,.fa-hospital-symbol:before{content:"\\f47e"}.fa-pager:before{content:"\\f815"}.fa-address-book:before,.fa-contact-book:before{content:"\\f2b9"}.fa-strikethrough:before{content:"\\f0cc"}.fa-k:before{content:"\\4b"}.fa-landmark-flag:before{content:"\\e51c"}.fa-pencil-alt:before,.fa-pencil:before{content:"\\f303"}.fa-backward:before{content:"\\f04a"}.fa-caret-right:before{content:"\\f0da"}.fa-comments:before{content:"\\f086"}.fa-file-clipboard:before,.fa-paste:before{content:"\\f0ea"}.fa-code-pull-request:before{content:"\\e13c"}.fa-clipboard-list:before{content:"\\f46d"}.fa-truck-loading:before,.fa-truck-ramp-box:before{content:"\\f4de"}.fa-user-check:before{content:"\\f4fc"}.fa-vial-virus:before{content:"\\e597"}.fa-sheet-plastic:before{content:"\\e571"}.fa-blog:before{content:"\\f781"}.fa-user-ninja:before{content:"\\f504"}.fa-person-arrow-up-from-line:before{content:"\\e539"}.fa-scroll-torah:before,.fa-torah:before{content:"\\f6a0"}.fa-broom-ball:before,.fa-quidditch-broom-ball:before,.fa-quidditch:before{content:"\\f458"}.fa-toggle-off:before{content:"\\f204"}.fa-archive:before,.fa-box-archive:before{content:"\\f187"}.fa-person-drowning:before{content:"\\e545"}.fa-arrow-down-9-1:before,.fa-sort-numeric-desc:before,.fa-sort-numeric-down-alt:before{content:"\\f886"}.fa-face-grin-tongue-squint:before,.fa-grin-tongue-squint:before{content:"\\f58a"}.fa-spray-can:before{content:"\\f5bd"}.fa-truck-monster:before{content:"\\f63b"}.fa-w:before{content:"\\57"}.fa-earth-africa:before,.fa-globe-africa:before{content:"\\f57c"}.fa-rainbow:before{content:"\\f75b"}.fa-circle-notch:before{content:"\\f1ce"}.fa-tablet-alt:before,.fa-tablet-screen-button:before{content:"\\f3fa"}.fa-paw:before{content:"\\f1b0"}.fa-cloud:before{content:"\\f0c2"}.fa-trowel-bricks:before{content:"\\e58a"}.fa-face-flushed:before,.fa-flushed:before{content:"\\f579"}.fa-hospital-user:before{content:"\\f80d"}.fa-tent-arrow-left-right:before{content:"\\e57f"}.fa-gavel:before,.fa-legal:before{content:"\\f0e3"}.fa-binoculars:before{content:"\\f1e5"}.fa-microphone-slash:before{content:"\\f131"}.fa-box-tissue:before{content:"\\e05b"}.fa-motorcycle:before{content:"\\f21c"}.fa-bell-concierge:before,.fa-concierge-bell:before{content:"\\f562"}.fa-pen-ruler:before,.fa-pencil-ruler:before{content:"\\f5ae"}.fa-people-arrows-left-right:before,.fa-people-arrows:before{content:"\\e068"}.fa-mars-and-venus-burst:before{content:"\\e523"}.fa-caret-square-right:before,.fa-square-caret-right:before{content:"\\f152"}.fa-cut:before,.fa-scissors:before{content:"\\f0c4"}.fa-sun-plant-wilt:before{content:"\\e57a"}.fa-toilets-portable:before{content:"\\e584"}.fa-hockey-puck:before{content:"\\f453"}.fa-table:before{content:"\\f0ce"}.fa-magnifying-glass-arrow-right:before{content:"\\e521"}.fa-digital-tachograph:before,.fa-tachograph-digital:before{content:"\\f566"}.fa-users-slash:before{content:"\\e073"}.fa-clover:before{content:"\\e139"}.fa-mail-reply:before,.fa-reply:before{content:"\\f3e5"}.fa-star-and-crescent:before{content:"\\f699"}.fa-house-fire:before{content:"\\e50c"}.fa-minus-square:before,.fa-square-minus:before{content:"\\f146"}.fa-helicopter:before{content:"\\f533"}.fa-compass:before{content:"\\f14e"}.fa-caret-square-down:before,.fa-square-caret-down:before{content:"\\f150"}.fa-file-circle-question:before{content:"\\e4ef"}.fa-laptop-code:before{content:"\\f5fc"}.fa-swatchbook:before{content:"\\f5c3"}.fa-prescription-bottle:before{content:"\\f485"}.fa-bars:before,.fa-navicon:before{content:"\\f0c9"}.fa-people-group:before{content:"\\e533"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:"\\f253"}.fa-heart-broken:before,.fa-heart-crack:before{content:"\\f7a9"}.fa-external-link-square-alt:before,.fa-square-up-right:before{content:"\\f360"}.fa-face-kiss-beam:before,.fa-kiss-beam:before{content:"\\f597"}.fa-film:before{content:"\\f008"}.fa-ruler-horizontal:before{content:"\\f547"}.fa-people-robbery:before{content:"\\e536"}.fa-lightbulb:before{content:"\\f0eb"}.fa-caret-left:before{content:"\\f0d9"}.fa-circle-exclamation:before,.fa-exclamation-circle:before{content:"\\f06a"}.fa-school-circle-xmark:before{content:"\\e56d"}.fa-arrow-right-from-bracket:before,.fa-sign-out:before{content:"\\f08b"}.fa-chevron-circle-down:before,.fa-circle-chevron-down:before{content:"\\f13a"}.fa-unlock-alt:before,.fa-unlock-keyhole:before{content:"\\f13e"}.fa-cloud-showers-heavy:before{content:"\\f740"}.fa-headphones-alt:before,.fa-headphones-simple:before{content:"\\f58f"}.fa-sitemap:before{content:"\\f0e8"}.fa-circle-dollar-to-slot:before,.fa-donate:before{content:"\\f4b9"}.fa-memory:before{content:"\\f538"}.fa-road-spikes:before{content:"\\e568"}.fa-fire-burner:before{content:"\\e4f1"}.fa-flag:before{content:"\\f024"}.fa-hanukiah:before{content:"\\f6e6"}.fa-feather:before{content:"\\f52d"}.fa-volume-down:before,.fa-volume-low:before{content:"\\f027"}.fa-comment-slash:before{content:"\\f4b3"}.fa-cloud-sun-rain:before{content:"\\f743"}.fa-compress:before{content:"\\f066"}.fa-wheat-alt:before,.fa-wheat-awn:before{content:"\\e2cd"}.fa-ankh:before{content:"\\f644"}.fa-hands-holding-child:before{content:"\\e4fa"}.fa-asterisk:before{content:"\\2a"}.fa-check-square:before,.fa-square-check:before{content:"\\f14a"}.fa-peseta-sign:before{content:"\\e221"}.fa-header:before,.fa-heading:before{content:"\\f1dc"}.fa-ghost:before{content:"\\f6e2"}.fa-list-squares:before,.fa-list:before{content:"\\f03a"}.fa-phone-square-alt:before,.fa-square-phone-flip:before{content:"\\f87b"}.fa-cart-plus:before{content:"\\f217"}.fa-gamepad:before{content:"\\f11b"}.fa-circle-dot:before,.fa-dot-circle:before{content:"\\f192"}.fa-dizzy:before,.fa-face-dizzy:before{content:"\\f567"}.fa-egg:before{content:"\\f7fb"}.fa-house-medical-circle-xmark:before{content:"\\e513"}.fa-campground:before{content:"\\f6bb"}.fa-folder-plus:before{content:"\\f65e"}.fa-futbol-ball:before,.fa-futbol:before,.fa-soccer-ball:before{content:"\\f1e3"}.fa-paint-brush:before,.fa-paintbrush:before{content:"\\f1fc"}.fa-lock:before{content:"\\f023"}.fa-gas-pump:before{content:"\\f52f"}.fa-hot-tub-person:before,.fa-hot-tub:before{content:"\\f593"}.fa-map-location:before,.fa-map-marked:before{content:"\\f59f"}.fa-house-flood-water:before{content:"\\e50e"}.fa-tree:before{content:"\\f1bb"}.fa-bridge-lock:before{content:"\\e4cc"}.fa-sack-dollar:before{content:"\\f81d"}.fa-edit:before,.fa-pen-to-square:before{content:"\\f044"}.fa-car-side:before{content:"\\f5e4"}.fa-share-alt:before,.fa-share-nodes:before{content:"\\f1e0"}.fa-heart-circle-minus:before{content:"\\e4ff"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:"\\f252"}.fa-microscope:before{content:"\\f610"}.fa-sink:before{content:"\\e06d"}.fa-bag-shopping:before,.fa-shopping-bag:before{content:"\\f290"}.fa-arrow-down-z-a:before,.fa-sort-alpha-desc:before,.fa-sort-alpha-down-alt:before{content:"\\f881"}.fa-mitten:before{content:"\\f7b5"}.fa-person-rays:before{content:"\\e54d"}.fa-users:before{content:"\\f0c0"}.fa-eye-slash:before{content:"\\f070"}.fa-flask-vial:before{content:"\\e4f3"}.fa-hand-paper:before,.fa-hand:before{content:"\\f256"}.fa-om:before{content:"\\f679"}.fa-worm:before{content:"\\e599"}.fa-house-circle-xmark:before{content:"\\e50b"}.fa-plug:before{content:"\\f1e6"}.fa-chevron-up:before{content:"\\f077"}.fa-hand-spock:before{content:"\\f259"}.fa-stopwatch:before{content:"\\f2f2"}.fa-face-kiss:before,.fa-kiss:before{content:"\\f596"}.fa-bridge-circle-xmark:before{content:"\\e4cb"}.fa-face-grin-tongue:before,.fa-grin-tongue:before{content:"\\f589"}.fa-chess-bishop:before{content:"\\f43a"}.fa-face-grin-wink:before,.fa-grin-wink:before{content:"\\f58c"}.fa-deaf:before,.fa-deafness:before,.fa-ear-deaf:before,.fa-hard-of-hearing:before{content:"\\f2a4"}.fa-road-circle-check:before{content:"\\e564"}.fa-dice-five:before{content:"\\f523"}.fa-rss-square:before,.fa-square-rss:before{content:"\\f143"}.fa-land-mine-on:before{content:"\\e51b"}.fa-i-cursor:before{content:"\\f246"}.fa-stamp:before{content:"\\f5bf"}.fa-stairs:before{content:"\\e289"}.fa-i:before{content:"\\49"}.fa-hryvnia-sign:before,.fa-hryvnia:before{content:"\\f6f2"}.fa-pills:before{content:"\\f484"}.fa-face-grin-wide:before,.fa-grin-alt:before{content:"\\f581"}.fa-tooth:before{content:"\\f5c9"}.fa-v:before{content:"\\56"}.fa-bangladeshi-taka-sign:before{content:"\\e2e6"}.fa-bicycle:before{content:"\\f206"}.fa-rod-asclepius:before,.fa-rod-snake:before,.fa-staff-aesculapius:before,.fa-staff-snake:before{content:"\\e579"}.fa-head-side-cough-slash:before{content:"\\e062"}.fa-ambulance:before,.fa-truck-medical:before{content:"\\f0f9"}.fa-wheat-awn-circle-exclamation:before{content:"\\e598"}.fa-snowman:before{content:"\\f7d0"}.fa-mortar-pestle:before{content:"\\f5a7"}.fa-road-barrier:before{content:"\\e562"}.fa-school:before{content:"\\f549"}.fa-igloo:before{content:"\\f7ae"}.fa-joint:before{content:"\\f595"}.fa-angle-right:before{content:"\\f105"}.fa-horse:before{content:"\\f6f0"}.fa-q:before{content:"\\51"}.fa-g:before{content:"\\47"}.fa-notes-medical:before{content:"\\f481"}.fa-temperature-2:before,.fa-temperature-half:before,.fa-thermometer-2:before,.fa-thermometer-half:before{content:"\\f2c9"}.fa-dong-sign:before{content:"\\e169"}.fa-capsules:before{content:"\\f46b"}.fa-poo-bolt:before,.fa-poo-storm:before{content:"\\f75a"}.fa-face-frown-open:before,.fa-frown-open:before{content:"\\f57a"}.fa-hand-point-up:before{content:"\\f0a6"}.fa-money-bill:before{content:"\\f0d6"}.fa-bookmark:before{content:"\\f02e"}.fa-align-justify:before{content:"\\f039"}.fa-umbrella-beach:before{content:"\\f5ca"}.fa-helmet-un:before{content:"\\e503"}.fa-bullseye:before{content:"\\f140"}.fa-bacon:before{content:"\\f7e5"}.fa-hand-point-down:before{content:"\\f0a7"}.fa-arrow-up-from-bracket:before{content:"\\e09a"}.fa-folder-blank:before,.fa-folder:before{content:"\\f07b"}.fa-file-medical-alt:before,.fa-file-waveform:before{content:"\\f478"}.fa-radiation:before{content:"\\f7b9"}.fa-chart-simple:before{content:"\\e473"}.fa-mars-stroke:before{content:"\\f229"}.fa-vial:before{content:"\\f492"}.fa-dashboard:before,.fa-gauge-med:before,.fa-gauge:before,.fa-tachometer-alt-average:before{content:"\\f624"}.fa-magic-wand-sparkles:before,.fa-wand-magic-sparkles:before{content:"\\e2ca"}.fa-e:before{content:"\\45"}.fa-pen-alt:before,.fa-pen-clip:before{content:"\\f305"}.fa-bridge-circle-exclamation:before{content:"\\e4ca"}.fa-user:before{content:"\\f007"}.fa-school-circle-check:before{content:"\\e56b"}.fa-dumpster:before{content:"\\f793"}.fa-shuttle-van:before,.fa-van-shuttle:before{content:"\\f5b6"}.fa-building-user:before{content:"\\e4da"}.fa-caret-square-left:before,.fa-square-caret-left:before{content:"\\f191"}.fa-highlighter:before{content:"\\f591"}.fa-key:before{content:"\\f084"}.fa-bullhorn:before{content:"\\f0a1"}.fa-globe:before{content:"\\f0ac"}.fa-synagogue:before{content:"\\f69b"}.fa-person-half-dress:before{content:"\\e548"}.fa-road-bridge:before{content:"\\e563"}.fa-location-arrow:before{content:"\\f124"}.fa-c:before{content:"\\43"}.fa-tablet-button:before{content:"\\f10a"}.fa-building-lock:before{content:"\\e4d6"}.fa-pizza-slice:before{content:"\\f818"}.fa-money-bill-wave:before{content:"\\f53a"}.fa-area-chart:before,.fa-chart-area:before{content:"\\f1fe"}.fa-house-flag:before{content:"\\e50d"}.fa-person-circle-minus:before{content:"\\e540"}.fa-ban:before,.fa-cancel:before{content:"\\f05e"}.fa-camera-rotate:before{content:"\\e0d8"}.fa-air-freshener:before,.fa-spray-can-sparkles:before{content:"\\f5d0"}.fa-star:before{content:"\\f005"}.fa-repeat:before{content:"\\f363"}.fa-cross:before{content:"\\f654"}.fa-box:before{content:"\\f466"}.fa-venus-mars:before{content:"\\f228"}.fa-arrow-pointer:before,.fa-mouse-pointer:before{content:"\\f245"}.fa-expand-arrows-alt:before,.fa-maximize:before{content:"\\f31e"}.fa-charging-station:before{content:"\\f5e7"}.fa-shapes:before,.fa-triangle-circle-square:before{content:"\\f61f"}.fa-random:before,.fa-shuffle:before{content:"\\f074"}.fa-person-running:before,.fa-running:before{content:"\\f70c"}.fa-mobile-retro:before{content:"\\e527"}.fa-grip-lines-vertical:before{content:"\\f7a5"}.fa-spider:before{content:"\\f717"}.fa-hands-bound:before{content:"\\e4f9"}.fa-file-invoice-dollar:before{content:"\\f571"}.fa-plane-circle-exclamation:before{content:"\\e556"}.fa-x-ray:before{content:"\\f497"}.fa-spell-check:before{content:"\\f891"}.fa-slash:before{content:"\\f715"}.fa-computer-mouse:before,.fa-mouse:before{content:"\\f8cc"}.fa-arrow-right-to-bracket:before,.fa-sign-in:before{content:"\\f090"}.fa-shop-slash:before,.fa-store-alt-slash:before{content:"\\e070"}.fa-server:before{content:"\\f233"}.fa-virus-covid-slash:before{content:"\\e4a9"}.fa-shop-lock:before{content:"\\e4a5"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:"\\f251"}.fa-blender-phone:before{content:"\\f6b6"}.fa-building-wheat:before{content:"\\e4db"}.fa-person-breastfeeding:before{content:"\\e53a"}.fa-right-to-bracket:before,.fa-sign-in-alt:before{content:"\\f2f6"}.fa-venus:before{content:"\\f221"}.fa-passport:before{content:"\\f5ab"}.fa-thumb-tack-slash:before,.fa-thumbtack-slash:before{content:"\\e68f"}.fa-heart-pulse:before,.fa-heartbeat:before{content:"\\f21e"}.fa-people-carry-box:before,.fa-people-carry:before{content:"\\f4ce"}.fa-temperature-high:before{content:"\\f769"}.fa-microchip:before{content:"\\f2db"}.fa-crown:before{content:"\\f521"}.fa-weight-hanging:before{content:"\\f5cd"}.fa-xmarks-lines:before{content:"\\e59a"}.fa-file-prescription:before{content:"\\f572"}.fa-weight-scale:before,.fa-weight:before{content:"\\f496"}.fa-user-friends:before,.fa-user-group:before{content:"\\f500"}.fa-arrow-up-a-z:before,.fa-sort-alpha-up:before{content:"\\f15e"}.fa-chess-knight:before{content:"\\f441"}.fa-face-laugh-squint:before,.fa-laugh-squint:before{content:"\\f59b"}.fa-wheelchair:before{content:"\\f193"}.fa-arrow-circle-up:before,.fa-circle-arrow-up:before{content:"\\f0aa"}.fa-toggle-on:before{content:"\\f205"}.fa-person-walking:before,.fa-walking:before{content:"\\f554"}.fa-l:before{content:"\\4c"}.fa-fire:before{content:"\\f06d"}.fa-bed-pulse:before,.fa-procedures:before{content:"\\f487"}.fa-shuttle-space:before,.fa-space-shuttle:before{content:"\\f197"}.fa-face-laugh:before,.fa-laugh:before{content:"\\f599"}.fa-folder-open:before{content:"\\f07c"}.fa-heart-circle-plus:before{content:"\\e500"}.fa-code-fork:before{content:"\\e13b"}.fa-city:before{content:"\\f64f"}.fa-microphone-alt:before,.fa-microphone-lines:before{content:"\\f3c9"}.fa-pepper-hot:before{content:"\\f816"}.fa-unlock:before{content:"\\f09c"}.fa-colon-sign:before{content:"\\e140"}.fa-headset:before{content:"\\f590"}.fa-store-slash:before{content:"\\e071"}.fa-road-circle-xmark:before{content:"\\e566"}.fa-user-minus:before{content:"\\f503"}.fa-mars-stroke-up:before,.fa-mars-stroke-v:before{content:"\\f22a"}.fa-champagne-glasses:before,.fa-glass-cheers:before{content:"\\f79f"}.fa-clipboard:before{content:"\\f328"}.fa-house-circle-exclamation:before{content:"\\e50a"}.fa-file-arrow-up:before,.fa-file-upload:before{content:"\\f574"}.fa-wifi-3:before,.fa-wifi-strong:before,.fa-wifi:before{content:"\\f1eb"}.fa-bath:before,.fa-bathtub:before{content:"\\f2cd"}.fa-underline:before{content:"\\f0cd"}.fa-user-edit:before,.fa-user-pen:before{content:"\\f4ff"}.fa-signature:before{content:"\\f5b7"}.fa-stroopwafel:before{content:"\\f551"}.fa-bold:before{content:"\\f032"}.fa-anchor-lock:before{content:"\\e4ad"}.fa-building-ngo:before{content:"\\e4d7"}.fa-manat-sign:before{content:"\\e1d5"}.fa-not-equal:before{content:"\\f53e"}.fa-border-style:before,.fa-border-top-left:before{content:"\\f853"}.fa-map-location-dot:before,.fa-map-marked-alt:before{content:"\\f5a0"}.fa-jedi:before{content:"\\f669"}.fa-poll:before,.fa-square-poll-vertical:before{content:"\\f681"}.fa-mug-hot:before{content:"\\f7b6"}.fa-battery-car:before,.fa-car-battery:before{content:"\\f5df"}.fa-gift:before{content:"\\f06b"}.fa-dice-two:before{content:"\\f528"}.fa-chess-queen:before{content:"\\f445"}.fa-glasses:before{content:"\\f530"}.fa-chess-board:before{content:"\\f43c"}.fa-building-circle-check:before{content:"\\e4d2"}.fa-person-chalkboard:before{content:"\\e53d"}.fa-mars-stroke-h:before,.fa-mars-stroke-right:before{content:"\\f22b"}.fa-hand-back-fist:before,.fa-hand-rock:before{content:"\\f255"}.fa-caret-square-up:before,.fa-square-caret-up:before{content:"\\f151"}.fa-cloud-showers-water:before{content:"\\e4e4"}.fa-bar-chart:before,.fa-chart-bar:before{content:"\\f080"}.fa-hands-bubbles:before,.fa-hands-wash:before{content:"\\e05e"}.fa-less-than-equal:before{content:"\\f537"}.fa-train:before{content:"\\f238"}.fa-eye-low-vision:before,.fa-low-vision:before{content:"\\f2a8"}.fa-crow:before{content:"\\f520"}.fa-sailboat:before{content:"\\e445"}.fa-window-restore:before{content:"\\f2d2"}.fa-plus-square:before,.fa-square-plus:before{content:"\\f0fe"}.fa-torii-gate:before{content:"\\f6a1"}.fa-frog:before{content:"\\f52e"}.fa-bucket:before{content:"\\e4cf"}.fa-image:before{content:"\\f03e"}.fa-microphone:before{content:"\\f130"}.fa-cow:before{content:"\\f6c8"}.fa-caret-up:before{content:"\\f0d8"}.fa-screwdriver:before{content:"\\f54a"}.fa-folder-closed:before{content:"\\e185"}.fa-house-tsunami:before{content:"\\e515"}.fa-square-nfi:before{content:"\\e576"}.fa-arrow-up-from-ground-water:before{content:"\\e4b5"}.fa-glass-martini-alt:before,.fa-martini-glass:before{content:"\\f57b"}.fa-rotate-back:before,.fa-rotate-backward:before,.fa-rotate-left:before,.fa-undo-alt:before{content:"\\f2ea"}.fa-columns:before,.fa-table-columns:before{content:"\\f0db"}.fa-lemon:before{content:"\\f094"}.fa-head-side-mask:before{content:"\\e063"}.fa-handshake:before{content:"\\f2b5"}.fa-gem:before{content:"\\f3a5"}.fa-dolly-box:before,.fa-dolly:before{content:"\\f472"}.fa-smoking:before{content:"\\f48d"}.fa-compress-arrows-alt:before,.fa-minimize:before{content:"\\f78c"}.fa-monument:before{content:"\\f5a6"}.fa-snowplow:before{content:"\\f7d2"}.fa-angle-double-right:before,.fa-angles-right:before{content:"\\f101"}.fa-cannabis:before{content:"\\f55f"}.fa-circle-play:before,.fa-play-circle:before{content:"\\f144"}.fa-tablets:before{content:"\\f490"}.fa-ethernet:before{content:"\\f796"}.fa-eur:before,.fa-euro-sign:before,.fa-euro:before{content:"\\f153"}.fa-chair:before{content:"\\f6c0"}.fa-check-circle:before,.fa-circle-check:before{content:"\\f058"}.fa-circle-stop:before,.fa-stop-circle:before{content:"\\f28d"}.fa-compass-drafting:before,.fa-drafting-compass:before{content:"\\f568"}.fa-plate-wheat:before{content:"\\e55a"}.fa-icicles:before{content:"\\f7ad"}.fa-person-shelter:before{content:"\\e54f"}.fa-neuter:before{content:"\\f22c"}.fa-id-badge:before{content:"\\f2c1"}.fa-marker:before{content:"\\f5a1"}.fa-face-laugh-beam:before,.fa-laugh-beam:before{content:"\\f59a"}.fa-helicopter-symbol:before{content:"\\e502"}.fa-universal-access:before{content:"\\f29a"}.fa-chevron-circle-up:before,.fa-circle-chevron-up:before{content:"\\f139"}.fa-lari-sign:before{content:"\\e1c8"}.fa-volcano:before{content:"\\f770"}.fa-person-walking-dashed-line-arrow-right:before{content:"\\e553"}.fa-gbp:before,.fa-pound-sign:before,.fa-sterling-sign:before{content:"\\f154"}.fa-viruses:before{content:"\\e076"}.fa-square-person-confined:before{content:"\\e577"}.fa-user-tie:before{content:"\\f508"}.fa-arrow-down-long:before,.fa-long-arrow-down:before{content:"\\f175"}.fa-tent-arrow-down-to-line:before{content:"\\e57e"}.fa-certificate:before{content:"\\f0a3"}.fa-mail-reply-all:before,.fa-reply-all:before{content:"\\f122"}.fa-suitcase:before{content:"\\f0f2"}.fa-person-skating:before,.fa-skating:before{content:"\\f7c5"}.fa-filter-circle-dollar:before,.fa-funnel-dollar:before{content:"\\f662"}.fa-camera-retro:before{content:"\\f083"}.fa-arrow-circle-down:before,.fa-circle-arrow-down:before{content:"\\f0ab"}.fa-arrow-right-to-file:before,.fa-file-import:before{content:"\\f56f"}.fa-external-link-square:before,.fa-square-arrow-up-right:before{content:"\\f14c"}.fa-box-open:before{content:"\\f49e"}.fa-scroll:before{content:"\\f70e"}.fa-spa:before{content:"\\f5bb"}.fa-location-pin-lock:before{content:"\\e51f"}.fa-pause:before{content:"\\f04c"}.fa-hill-avalanche:before{content:"\\e507"}.fa-temperature-0:before,.fa-temperature-empty:before,.fa-thermometer-0:before,.fa-thermometer-empty:before{content:"\\f2cb"}.fa-bomb:before{content:"\\f1e2"}.fa-registered:before{content:"\\f25d"}.fa-address-card:before,.fa-contact-card:before,.fa-vcard:before{content:"\\f2bb"}.fa-balance-scale-right:before,.fa-scale-unbalanced-flip:before{content:"\\f516"}.fa-subscript:before{content:"\\f12c"}.fa-diamond-turn-right:before,.fa-directions:before{content:"\\f5eb"}.fa-burst:before{content:"\\e4dc"}.fa-house-laptop:before,.fa-laptop-house:before{content:"\\e066"}.fa-face-tired:before,.fa-tired:before{content:"\\f5c8"}.fa-money-bills:before{content:"\\e1f3"}.fa-smog:before{content:"\\f75f"}.fa-crutch:before{content:"\\f7f7"}.fa-cloud-arrow-up:before,.fa-cloud-upload-alt:before,.fa-cloud-upload:before{content:"\\f0ee"}.fa-palette:before{content:"\\f53f"}.fa-arrows-turn-right:before{content:"\\e4c0"}.fa-vest:before{content:"\\e085"}.fa-ferry:before{content:"\\e4ea"}.fa-arrows-down-to-people:before{content:"\\e4b9"}.fa-seedling:before,.fa-sprout:before{content:"\\f4d8"}.fa-arrows-alt-h:before,.fa-left-right:before{content:"\\f337"}.fa-boxes-packing:before{content:"\\e4c7"}.fa-arrow-circle-left:before,.fa-circle-arrow-left:before{content:"\\f0a8"}.fa-group-arrows-rotate:before{content:"\\e4f6"}.fa-bowl-food:before{content:"\\e4c6"}.fa-candy-cane:before{content:"\\f786"}.fa-arrow-down-wide-short:before,.fa-sort-amount-asc:before,.fa-sort-amount-down:before{content:"\\f160"}.fa-cloud-bolt:before,.fa-thunderstorm:before{content:"\\f76c"}.fa-remove-format:before,.fa-text-slash:before{content:"\\f87d"}.fa-face-smile-wink:before,.fa-smile-wink:before{content:"\\f4da"}.fa-file-word:before{content:"\\f1c2"}.fa-file-powerpoint:before{content:"\\f1c4"}.fa-arrows-h:before,.fa-arrows-left-right:before{content:"\\f07e"}.fa-house-lock:before{content:"\\e510"}.fa-cloud-arrow-down:before,.fa-cloud-download-alt:before,.fa-cloud-download:before{content:"\\f0ed"}.fa-children:before{content:"\\e4e1"}.fa-blackboard:before,.fa-chalkboard:before{content:"\\f51b"}.fa-user-alt-slash:before,.fa-user-large-slash:before{content:"\\f4fa"}.fa-envelope-open:before{content:"\\f2b6"}.fa-handshake-alt-slash:before,.fa-handshake-simple-slash:before{content:"\\e05f"}.fa-mattress-pillow:before{content:"\\e525"}.fa-guarani-sign:before{content:"\\e19a"}.fa-arrows-rotate:before,.fa-refresh:before,.fa-sync:before{content:"\\f021"}.fa-fire-extinguisher:before{content:"\\f134"}.fa-cruzeiro-sign:before{content:"\\e152"}.fa-greater-than-equal:before{content:"\\f532"}.fa-shield-alt:before,.fa-shield-halved:before{content:"\\f3ed"}.fa-atlas:before,.fa-book-atlas:before{content:"\\f558"}.fa-virus:before{content:"\\e074"}.fa-envelope-circle-check:before{content:"\\e4e8"}.fa-layer-group:before{content:"\\f5fd"}.fa-arrows-to-dot:before{content:"\\e4be"}.fa-archway:before{content:"\\f557"}.fa-heart-circle-check:before{content:"\\e4fd"}.fa-house-chimney-crack:before,.fa-house-damage:before{content:"\\f6f1"}.fa-file-archive:before,.fa-file-zipper:before{content:"\\f1c6"}.fa-square:before{content:"\\f0c8"}.fa-glass-martini:before,.fa-martini-glass-empty:before{content:"\\f000"}.fa-couch:before{content:"\\f4b8"}.fa-cedi-sign:before{content:"\\e0df"}.fa-italic:before{content:"\\f033"}.fa-table-cells-column-lock:before{content:"\\e678"}.fa-church:before{content:"\\f51d"}.fa-comments-dollar:before{content:"\\f653"}.fa-democrat:before{content:"\\f747"}.fa-z:before{content:"\\5a"}.fa-person-skiing:before,.fa-skiing:before{content:"\\f7c9"}.fa-road-lock:before{content:"\\e567"}.fa-a:before{content:"\\41"}.fa-temperature-arrow-down:before,.fa-temperature-down:before{content:"\\e03f"}.fa-feather-alt:before,.fa-feather-pointed:before{content:"\\f56b"}.fa-p:before{content:"\\50"}.fa-snowflake:before{content:"\\f2dc"}.fa-newspaper:before{content:"\\f1ea"}.fa-ad:before,.fa-rectangle-ad:before{content:"\\f641"}.fa-arrow-circle-right:before,.fa-circle-arrow-right:before{content:"\\f0a9"}.fa-filter-circle-xmark:before{content:"\\e17b"}.fa-locust:before{content:"\\e520"}.fa-sort:before,.fa-unsorted:before{content:"\\f0dc"}.fa-list-1-2:before,.fa-list-numeric:before,.fa-list-ol:before{content:"\\f0cb"}.fa-person-dress-burst:before{content:"\\e544"}.fa-money-check-alt:before,.fa-money-check-dollar:before{content:"\\f53d"}.fa-vector-square:before{content:"\\f5cb"}.fa-bread-slice:before{content:"\\f7ec"}.fa-language:before{content:"\\f1ab"}.fa-face-kiss-wink-heart:before,.fa-kiss-wink-heart:before{content:"\\f598"}.fa-filter:before{content:"\\f0b0"}.fa-question:before{content:"\\3f"}.fa-file-signature:before{content:"\\f573"}.fa-arrows-alt:before,.fa-up-down-left-right:before{content:"\\f0b2"}.fa-house-chimney-user:before{content:"\\e065"}.fa-hand-holding-heart:before{content:"\\f4be"}.fa-puzzle-piece:before{content:"\\f12e"}.fa-money-check:before{content:"\\f53c"}.fa-star-half-alt:before,.fa-star-half-stroke:before{content:"\\f5c0"}.fa-code:before{content:"\\f121"}.fa-glass-whiskey:before,.fa-whiskey-glass:before{content:"\\f7a0"}.fa-building-circle-exclamation:before{content:"\\e4d3"}.fa-magnifying-glass-chart:before{content:"\\e522"}.fa-arrow-up-right-from-square:before,.fa-external-link:before{content:"\\f08e"}.fa-cubes-stacked:before{content:"\\e4e6"}.fa-krw:before,.fa-won-sign:before,.fa-won:before{content:"\\f159"}.fa-virus-covid:before{content:"\\e4a8"}.fa-austral-sign:before{content:"\\e0a9"}.fa-f:before{content:"\\46"}.fa-leaf:before{content:"\\f06c"}.fa-road:before{content:"\\f018"}.fa-cab:before,.fa-taxi:before{content:"\\f1ba"}.fa-person-circle-plus:before{content:"\\e541"}.fa-chart-pie:before,.fa-pie-chart:before{content:"\\f200"}.fa-bolt-lightning:before{content:"\\e0b7"}.fa-sack-xmark:before{content:"\\e56a"}.fa-file-excel:before{content:"\\f1c3"}.fa-file-contract:before{content:"\\f56c"}.fa-fish-fins:before{content:"\\e4f2"}.fa-building-flag:before{content:"\\e4d5"}.fa-face-grin-beam:before,.fa-grin-beam:before{content:"\\f582"}.fa-object-ungroup:before{content:"\\f248"}.fa-poop:before{content:"\\f619"}.fa-location-pin:before,.fa-map-marker:before{content:"\\f041"}.fa-kaaba:before{content:"\\f66b"}.fa-toilet-paper:before{content:"\\f71e"}.fa-hard-hat:before,.fa-hat-hard:before,.fa-helmet-safety:before{content:"\\f807"}.fa-eject:before{content:"\\f052"}.fa-arrow-alt-circle-right:before,.fa-circle-right:before{content:"\\f35a"}.fa-plane-circle-check:before{content:"\\e555"}.fa-face-rolling-eyes:before,.fa-meh-rolling-eyes:before{content:"\\f5a5"}.fa-object-group:before{content:"\\f247"}.fa-chart-line:before,.fa-line-chart:before{content:"\\f201"}.fa-mask-ventilator:before{content:"\\e524"}.fa-arrow-right:before{content:"\\f061"}.fa-map-signs:before,.fa-signs-post:before{content:"\\f277"}.fa-cash-register:before{content:"\\f788"}.fa-person-circle-question:before{content:"\\e542"}.fa-h:before{content:"\\48"}.fa-tarp:before{content:"\\e57b"}.fa-screwdriver-wrench:before,.fa-tools:before{content:"\\f7d9"}.fa-arrows-to-eye:before{content:"\\e4bf"}.fa-plug-circle-bolt:before{content:"\\e55b"}.fa-heart:before{content:"\\f004"}.fa-mars-and-venus:before{content:"\\f224"}.fa-home-user:before,.fa-house-user:before{content:"\\e1b0"}.fa-dumpster-fire:before{content:"\\f794"}.fa-house-crack:before{content:"\\e3b1"}.fa-cocktail:before,.fa-martini-glass-citrus:before{content:"\\f561"}.fa-face-surprise:before,.fa-surprise:before{content:"\\f5c2"}.fa-bottle-water:before{content:"\\e4c5"}.fa-circle-pause:before,.fa-pause-circle:before{content:"\\f28b"}.fa-toilet-paper-slash:before{content:"\\e072"}.fa-apple-alt:before,.fa-apple-whole:before{content:"\\f5d1"}.fa-kitchen-set:before{content:"\\e51a"}.fa-r:before{content:"\\52"}.fa-temperature-1:before,.fa-temperature-quarter:before,.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:"\\f2ca"}.fa-cube:before{content:"\\f1b2"}.fa-bitcoin-sign:before{content:"\\e0b4"}.fa-shield-dog:before{content:"\\e573"}.fa-solar-panel:before{content:"\\f5ba"}.fa-lock-open:before{content:"\\f3c1"}.fa-elevator:before{content:"\\e16d"}.fa-money-bill-transfer:before{content:"\\e528"}.fa-money-bill-trend-up:before{content:"\\e529"}.fa-house-flood-water-circle-arrow-right:before{content:"\\e50f"}.fa-poll-h:before,.fa-square-poll-horizontal:before{content:"\\f682"}.fa-circle:before{content:"\\f111"}.fa-backward-fast:before,.fa-fast-backward:before{content:"\\f049"}.fa-recycle:before{content:"\\f1b8"}.fa-user-astronaut:before{content:"\\f4fb"}.fa-plane-slash:before{content:"\\e069"}.fa-trademark:before{content:"\\f25c"}.fa-basketball-ball:before,.fa-basketball:before{content:"\\f434"}.fa-satellite-dish:before{content:"\\f7c0"}.fa-arrow-alt-circle-up:before,.fa-circle-up:before{content:"\\f35b"}.fa-mobile-alt:before,.fa-mobile-screen-button:before{content:"\\f3cd"}.fa-volume-high:before,.fa-volume-up:before{content:"\\f028"}.fa-users-rays:before{content:"\\e593"}.fa-wallet:before{content:"\\f555"}.fa-clipboard-check:before{content:"\\f46c"}.fa-file-audio:before{content:"\\f1c7"}.fa-burger:before,.fa-hamburger:before{content:"\\f805"}.fa-wrench:before{content:"\\f0ad"}.fa-bugs:before{content:"\\e4d0"}.fa-rupee-sign:before,.fa-rupee:before{content:"\\f156"}.fa-file-image:before{content:"\\f1c5"}.fa-circle-question:before,.fa-question-circle:before{content:"\\f059"}.fa-plane-departure:before{content:"\\f5b0"}.fa-handshake-slash:before{content:"\\e060"}.fa-book-bookmark:before{content:"\\e0bb"}.fa-code-branch:before{content:"\\f126"}.fa-hat-cowboy:before{content:"\\f8c0"}.fa-bridge:before{content:"\\e4c8"}.fa-phone-alt:before,.fa-phone-flip:before{content:"\\f879"}.fa-truck-front:before{content:"\\e2b7"}.fa-cat:before{content:"\\f6be"}.fa-anchor-circle-exclamation:before{content:"\\e4ab"}.fa-truck-field:before{content:"\\e58d"}.fa-route:before{content:"\\f4d7"}.fa-clipboard-question:before{content:"\\e4e3"}.fa-panorama:before{content:"\\e209"}.fa-comment-medical:before{content:"\\f7f5"}.fa-teeth-open:before{content:"\\f62f"}.fa-file-circle-minus:before{content:"\\e4ed"}.fa-tags:before{content:"\\f02c"}.fa-wine-glass:before{content:"\\f4e3"}.fa-fast-forward:before,.fa-forward-fast:before{content:"\\f050"}.fa-face-meh-blank:before,.fa-meh-blank:before{content:"\\f5a4"}.fa-parking:before,.fa-square-parking:before{content:"\\f540"}.fa-house-signal:before{content:"\\e012"}.fa-bars-progress:before,.fa-tasks-alt:before{content:"\\f828"}.fa-faucet-drip:before{content:"\\e006"}.fa-cart-flatbed:before,.fa-dolly-flatbed:before{content:"\\f474"}.fa-ban-smoking:before,.fa-smoking-ban:before{content:"\\f54d"}.fa-terminal:before{content:"\\f120"}.fa-mobile-button:before{content:"\\f10b"}.fa-house-medical-flag:before{content:"\\e514"}.fa-basket-shopping:before,.fa-shopping-basket:before{content:"\\f291"}.fa-tape:before{content:"\\f4db"}.fa-bus-alt:before,.fa-bus-simple:before{content:"\\f55e"}.fa-eye:before{content:"\\f06e"}.fa-face-sad-cry:before,.fa-sad-cry:before{content:"\\f5b3"}.fa-audio-description:before{content:"\\f29e"}.fa-person-military-to-person:before{content:"\\e54c"}.fa-file-shield:before{content:"\\e4f0"}.fa-user-slash:before{content:"\\f506"}.fa-pen:before{content:"\\f304"}.fa-tower-observation:before{content:"\\e586"}.fa-file-code:before{content:"\\f1c9"}.fa-signal-5:before,.fa-signal-perfect:before,.fa-signal:before{content:"\\f012"}.fa-bus:before{content:"\\f207"}.fa-heart-circle-xmark:before{content:"\\e501"}.fa-home-lg:before,.fa-house-chimney:before{content:"\\e3af"}.fa-window-maximize:before{content:"\\f2d0"}.fa-face-frown:before,.fa-frown:before{content:"\\f119"}.fa-prescription:before{content:"\\f5b1"}.fa-shop:before,.fa-store-alt:before{content:"\\f54f"}.fa-floppy-disk:before,.fa-save:before{content:"\\f0c7"}.fa-vihara:before{content:"\\f6a7"}.fa-balance-scale-left:before,.fa-scale-unbalanced:before{content:"\\f515"}.fa-sort-asc:before,.fa-sort-up:before{content:"\\f0de"}.fa-comment-dots:before,.fa-commenting:before{content:"\\f4ad"}.fa-plant-wilt:before{content:"\\e5aa"}.fa-diamond:before{content:"\\f219"}.fa-face-grin-squint:before,.fa-grin-squint:before{content:"\\f585"}.fa-hand-holding-dollar:before,.fa-hand-holding-usd:before{content:"\\f4c0"}.fa-bacterium:before{content:"\\e05a"}.fa-hand-pointer:before{content:"\\f25a"}.fa-drum-steelpan:before{content:"\\f56a"}.fa-hand-scissors:before{content:"\\f257"}.fa-hands-praying:before,.fa-praying-hands:before{content:"\\f684"}.fa-arrow-right-rotate:before,.fa-arrow-rotate-forward:before,.fa-arrow-rotate-right:before,.fa-redo:before{content:"\\f01e"}.fa-biohazard:before{content:"\\f780"}.fa-location-crosshairs:before,.fa-location:before{content:"\\f601"}.fa-mars-double:before{content:"\\f227"}.fa-child-dress:before{content:"\\e59c"}.fa-users-between-lines:before{content:"\\e591"}.fa-lungs-virus:before{content:"\\e067"}.fa-face-grin-tears:before,.fa-grin-tears:before{content:"\\f588"}.fa-phone:before{content:"\\f095"}.fa-calendar-times:before,.fa-calendar-xmark:before{content:"\\f273"}.fa-child-reaching:before{content:"\\e59d"}.fa-head-side-virus:before{content:"\\e064"}.fa-user-cog:before,.fa-user-gear:before{content:"\\f4fe"}.fa-arrow-up-1-9:before,.fa-sort-numeric-up:before{content:"\\f163"}.fa-door-closed:before{content:"\\f52a"}.fa-shield-virus:before{content:"\\e06c"}.fa-dice-six:before{content:"\\f526"}.fa-mosquito-net:before{content:"\\e52c"}.fa-bridge-water:before{content:"\\e4ce"}.fa-person-booth:before{content:"\\f756"}.fa-text-width:before{content:"\\f035"}.fa-hat-wizard:before{content:"\\f6e8"}.fa-pen-fancy:before{content:"\\f5ac"}.fa-digging:before,.fa-person-digging:before{content:"\\f85e"}.fa-trash:before{content:"\\f1f8"}.fa-gauge-simple-med:before,.fa-gauge-simple:before,.fa-tachometer-average:before{content:"\\f629"}.fa-book-medical:before{content:"\\f7e6"}.fa-poo:before{content:"\\f2fe"}.fa-quote-right-alt:before,.fa-quote-right:before{content:"\\f10e"}.fa-shirt:before,.fa-t-shirt:before,.fa-tshirt:before{content:"\\f553"}.fa-cubes:before{content:"\\f1b3"}.fa-divide:before{content:"\\f529"}.fa-tenge-sign:before,.fa-tenge:before{content:"\\f7d7"}.fa-headphones:before{content:"\\f025"}.fa-hands-holding:before{content:"\\f4c2"}.fa-hands-clapping:before{content:"\\e1a8"}.fa-republican:before{content:"\\f75e"}.fa-arrow-left:before{content:"\\f060"}.fa-person-circle-xmark:before{content:"\\e543"}.fa-ruler:before{content:"\\f545"}.fa-align-left:before{content:"\\f036"}.fa-dice-d6:before{content:"\\f6d1"}.fa-restroom:before{content:"\\f7bd"}.fa-j:before{content:"\\4a"}.fa-users-viewfinder:before{content:"\\e595"}.fa-file-video:before{content:"\\f1c8"}.fa-external-link-alt:before,.fa-up-right-from-square:before{content:"\\f35d"}.fa-table-cells:before,.fa-th:before{content:"\\f00a"}.fa-file-pdf:before{content:"\\f1c1"}.fa-bible:before,.fa-book-bible:before{content:"\\f647"}.fa-o:before{content:"\\4f"}.fa-medkit:before,.fa-suitcase-medical:before{content:"\\f0fa"}.fa-user-secret:before{content:"\\f21b"}.fa-otter:before{content:"\\f700"}.fa-female:before,.fa-person-dress:before{content:"\\f182"}.fa-comment-dollar:before{content:"\\f651"}.fa-briefcase-clock:before,.fa-business-time:before{content:"\\f64a"}.fa-table-cells-large:before,.fa-th-large:before{content:"\\f009"}.fa-book-tanakh:before,.fa-tanakh:before{content:"\\f827"}.fa-phone-volume:before,.fa-volume-control-phone:before{content:"\\f2a0"}.fa-hat-cowboy-side:before{content:"\\f8c1"}.fa-clipboard-user:before{content:"\\f7f3"}.fa-child:before{content:"\\f1ae"}.fa-lira-sign:before{content:"\\f195"}.fa-satellite:before{content:"\\f7bf"}.fa-plane-lock:before{content:"\\e558"}.fa-tag:before{content:"\\f02b"}.fa-comment:before{content:"\\f075"}.fa-birthday-cake:before,.fa-cake-candles:before,.fa-cake:before{content:"\\f1fd"}.fa-envelope:before{content:"\\f0e0"}.fa-angle-double-up:before,.fa-angles-up:before{content:"\\f102"}.fa-paperclip:before{content:"\\f0c6"}.fa-arrow-right-to-city:before{content:"\\e4b3"}.fa-ribbon:before{content:"\\f4d6"}.fa-lungs:before{content:"\\f604"}.fa-arrow-up-9-1:before,.fa-sort-numeric-up-alt:before{content:"\\f887"}.fa-litecoin-sign:before{content:"\\e1d3"}.fa-border-none:before{content:"\\f850"}.fa-circle-nodes:before{content:"\\e4e2"}.fa-parachute-box:before{content:"\\f4cd"}.fa-indent:before{content:"\\f03c"}.fa-truck-field-un:before{content:"\\e58e"}.fa-hourglass-empty:before,.fa-hourglass:before{content:"\\f254"}.fa-mountain:before{content:"\\f6fc"}.fa-user-doctor:before,.fa-user-md:before{content:"\\f0f0"}.fa-circle-info:before,.fa-info-circle:before{content:"\\f05a"}.fa-cloud-meatball:before{content:"\\f73b"}.fa-camera-alt:before,.fa-camera:before{content:"\\f030"}.fa-square-virus:before{content:"\\e578"}.fa-meteor:before{content:"\\f753"}.fa-car-on:before{content:"\\e4dd"}.fa-sleigh:before{content:"\\f7cc"}.fa-arrow-down-1-9:before,.fa-sort-numeric-asc:before,.fa-sort-numeric-down:before{content:"\\f162"}.fa-hand-holding-droplet:before,.fa-hand-holding-water:before{content:"\\f4c1"}.fa-water:before{content:"\\f773"}.fa-calendar-check:before{content:"\\f274"}.fa-braille:before{content:"\\f2a1"}.fa-prescription-bottle-alt:before,.fa-prescription-bottle-medical:before{content:"\\f486"}.fa-landmark:before{content:"\\f66f"}.fa-truck:before{content:"\\f0d1"}.fa-crosshairs:before{content:"\\f05b"}.fa-person-cane:before{content:"\\e53c"}.fa-tent:before{content:"\\e57d"}.fa-vest-patches:before{content:"\\e086"}.fa-check-double:before{content:"\\f560"}.fa-arrow-down-a-z:before,.fa-sort-alpha-asc:before,.fa-sort-alpha-down:before{content:"\\f15d"}.fa-money-bill-wheat:before{content:"\\e52a"}.fa-cookie:before{content:"\\f563"}.fa-arrow-left-rotate:before,.fa-arrow-rotate-back:before,.fa-arrow-rotate-backward:before,.fa-arrow-rotate-left:before,.fa-undo:before{content:"\\f0e2"}.fa-hard-drive:before,.fa-hdd:before{content:"\\f0a0"}.fa-face-grin-squint-tears:before,.fa-grin-squint-tears:before{content:"\\f586"}.fa-dumbbell:before{content:"\\f44b"}.fa-list-alt:before,.fa-rectangle-list:before{content:"\\f022"}.fa-tarp-droplet:before{content:"\\e57c"}.fa-house-medical-circle-check:before{content:"\\e511"}.fa-person-skiing-nordic:before,.fa-skiing-nordic:before{content:"\\f7ca"}.fa-calendar-plus:before{content:"\\f271"}.fa-plane-arrival:before{content:"\\f5af"}.fa-arrow-alt-circle-left:before,.fa-circle-left:before{content:"\\f359"}.fa-subway:before,.fa-train-subway:before{content:"\\f239"}.fa-chart-gantt:before{content:"\\e0e4"}.fa-indian-rupee-sign:before,.fa-indian-rupee:before,.fa-inr:before{content:"\\e1bc"}.fa-crop-alt:before,.fa-crop-simple:before{content:"\\f565"}.fa-money-bill-1:before,.fa-money-bill-alt:before{content:"\\f3d1"}.fa-left-long:before,.fa-long-arrow-alt-left:before{content:"\\f30a"}.fa-dna:before{content:"\\f471"}.fa-virus-slash:before{content:"\\e075"}.fa-minus:before,.fa-subtract:before{content:"\\f068"}.fa-chess:before{content:"\\f439"}.fa-arrow-left-long:before,.fa-long-arrow-left:before{content:"\\f177"}.fa-plug-circle-check:before{content:"\\e55c"}.fa-street-view:before{content:"\\f21d"}.fa-franc-sign:before{content:"\\e18f"}.fa-volume-off:before{content:"\\f026"}.fa-american-sign-language-interpreting:before,.fa-asl-interpreting:before,.fa-hands-american-sign-language-interpreting:before,.fa-hands-asl-interpreting:before{content:"\\f2a3"}.fa-cog:before,.fa-gear:before{content:"\\f013"}.fa-droplet-slash:before,.fa-tint-slash:before{content:"\\f5c7"}.fa-mosque:before{content:"\\f678"}.fa-mosquito:before{content:"\\e52b"}.fa-star-of-david:before{content:"\\f69a"}.fa-person-military-rifle:before{content:"\\e54b"}.fa-cart-shopping:before,.fa-shopping-cart:before{content:"\\f07a"}.fa-vials:before{content:"\\f493"}.fa-plug-circle-plus:before{content:"\\e55f"}.fa-place-of-worship:before{content:"\\f67f"}.fa-grip-vertical:before{content:"\\f58e"}.fa-arrow-turn-up:before,.fa-level-up:before{content:"\\f148"}.fa-u:before{content:"\\55"}.fa-square-root-alt:before,.fa-square-root-variable:before{content:"\\f698"}.fa-clock-four:before,.fa-clock:before{content:"\\f017"}.fa-backward-step:before,.fa-step-backward:before{content:"\\f048"}.fa-pallet:before{content:"\\f482"}.fa-faucet:before{content:"\\e005"}.fa-baseball-bat-ball:before{content:"\\f432"}.fa-s:before{content:"\\53"}.fa-timeline:before{content:"\\e29c"}.fa-keyboard:before{content:"\\f11c"}.fa-caret-down:before{content:"\\f0d7"}.fa-clinic-medical:before,.fa-house-chimney-medical:before{content:"\\f7f2"}.fa-temperature-3:before,.fa-temperature-three-quarters:before,.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:"\\f2c8"}.fa-mobile-android-alt:before,.fa-mobile-screen:before{content:"\\f3cf"}.fa-plane-up:before{content:"\\e22d"}.fa-piggy-bank:before{content:"\\f4d3"}.fa-battery-3:before,.fa-battery-half:before{content:"\\f242"}.fa-mountain-city:before{content:"\\e52e"}.fa-coins:before{content:"\\f51e"}.fa-khanda:before{content:"\\f66d"}.fa-sliders-h:before,.fa-sliders:before{content:"\\f1de"}.fa-folder-tree:before{content:"\\f802"}.fa-network-wired:before{content:"\\f6ff"}.fa-map-pin:before{content:"\\f276"}.fa-hamsa:before{content:"\\f665"}.fa-cent-sign:before{content:"\\e3f5"}.fa-flask:before{content:"\\f0c3"}.fa-person-pregnant:before{content:"\\e31e"}.fa-wand-sparkles:before{content:"\\f72b"}.fa-ellipsis-v:before,.fa-ellipsis-vertical:before{content:"\\f142"}.fa-ticket:before{content:"\\f145"}.fa-power-off:before{content:"\\f011"}.fa-long-arrow-alt-right:before,.fa-right-long:before{content:"\\f30b"}.fa-flag-usa:before{content:"\\f74d"}.fa-laptop-file:before{content:"\\e51d"}.fa-teletype:before,.fa-tty:before{content:"\\f1e4"}.fa-diagram-next:before{content:"\\e476"}.fa-person-rifle:before{content:"\\e54e"}.fa-house-medical-circle-exclamation:before{content:"\\e512"}.fa-closed-captioning:before{content:"\\f20a"}.fa-hiking:before,.fa-person-hiking:before{content:"\\f6ec"}.fa-venus-double:before{content:"\\f226"}.fa-images:before{content:"\\f302"}.fa-calculator:before{content:"\\f1ec"}.fa-people-pulling:before{content:"\\e535"}.fa-n:before{content:"\\4e"}.fa-cable-car:before,.fa-tram:before{content:"\\f7da"}.fa-cloud-rain:before{content:"\\f73d"}.fa-building-circle-xmark:before{content:"\\e4d4"}.fa-ship:before{content:"\\f21a"}.fa-arrows-down-to-line:before{content:"\\e4b8"}.fa-download:before{content:"\\f019"}.fa-face-grin:before,.fa-grin:before{content:"\\f580"}.fa-backspace:before,.fa-delete-left:before{content:"\\f55a"}.fa-eye-dropper-empty:before,.fa-eye-dropper:before,.fa-eyedropper:before{content:"\\f1fb"}.fa-file-circle-check:before{content:"\\e5a0"}.fa-forward:before{content:"\\f04e"}.fa-mobile-android:before,.fa-mobile-phone:before,.fa-mobile:before{content:"\\f3ce"}.fa-face-meh:before,.fa-meh:before{content:"\\f11a"}.fa-align-center:before{content:"\\f037"}.fa-book-dead:before,.fa-book-skull:before{content:"\\f6b7"}.fa-drivers-license:before,.fa-id-card:before{content:"\\f2c2"}.fa-dedent:before,.fa-outdent:before{content:"\\f03b"}.fa-heart-circle-exclamation:before{content:"\\e4fe"}.fa-home-alt:before,.fa-home-lg-alt:before,.fa-home:before,.fa-house:before{content:"\\f015"}.fa-calendar-week:before{content:"\\f784"}.fa-laptop-medical:before{content:"\\f812"}.fa-b:before{content:"\\42"}.fa-file-medical:before{content:"\\f477"}.fa-dice-one:before{content:"\\f525"}.fa-kiwi-bird:before{content:"\\f535"}.fa-arrow-right-arrow-left:before,.fa-exchange:before{content:"\\f0ec"}.fa-redo-alt:before,.fa-rotate-forward:before,.fa-rotate-right:before{content:"\\f2f9"}.fa-cutlery:before,.fa-utensils:before{content:"\\f2e7"}.fa-arrow-up-wide-short:before,.fa-sort-amount-up:before{content:"\\f161"}.fa-mill-sign:before{content:"\\e1ed"}.fa-bowl-rice:before{content:"\\e2eb"}.fa-skull:before{content:"\\f54c"}.fa-broadcast-tower:before,.fa-tower-broadcast:before{content:"\\f519"}.fa-truck-pickup:before{content:"\\f63c"}.fa-long-arrow-alt-up:before,.fa-up-long:before{content:"\\f30c"}.fa-stop:before{content:"\\f04d"}.fa-code-merge:before{content:"\\f387"}.fa-upload:before{content:"\\f093"}.fa-hurricane:before{content:"\\f751"}.fa-mound:before{content:"\\e52d"}.fa-toilet-portable:before{content:"\\e583"}.fa-compact-disc:before{content:"\\f51f"}.fa-file-arrow-down:before,.fa-file-download:before{content:"\\f56d"}.fa-caravan:before{content:"\\f8ff"}.fa-shield-cat:before{content:"\\e572"}.fa-bolt:before,.fa-zap:before{content:"\\f0e7"}.fa-glass-water:before{content:"\\e4f4"}.fa-oil-well:before{content:"\\e532"}.fa-vault:before{content:"\\e2c5"}.fa-mars:before{content:"\\f222"}.fa-toilet:before{content:"\\f7d8"}.fa-plane-circle-xmark:before{content:"\\e557"}.fa-cny:before,.fa-jpy:before,.fa-rmb:before,.fa-yen-sign:before,.fa-yen:before{content:"\\f157"}.fa-rouble:before,.fa-rub:before,.fa-ruble-sign:before,.fa-ruble:before{content:"\\f158"}.fa-sun:before{content:"\\f185"}.fa-guitar:before{content:"\\f7a6"}.fa-face-laugh-wink:before,.fa-laugh-wink:before{content:"\\f59c"}.fa-horse-head:before{content:"\\f7ab"}.fa-bore-hole:before{content:"\\e4c3"}.fa-industry:before{content:"\\f275"}.fa-arrow-alt-circle-down:before,.fa-circle-down:before{content:"\\f358"}.fa-arrows-turn-to-dots:before{content:"\\e4c1"}.fa-florin-sign:before{content:"\\e184"}.fa-arrow-down-short-wide:before,.fa-sort-amount-desc:before,.fa-sort-amount-down-alt:before{content:"\\f884"}.fa-less-than:before{content:"\\3c"}.fa-angle-down:before{content:"\\f107"}.fa-car-tunnel:before{content:"\\e4de"}.fa-head-side-cough:before{content:"\\e061"}.fa-grip-lines:before{content:"\\f7a4"}.fa-thumbs-down:before{content:"\\f165"}.fa-user-lock:before{content:"\\f502"}.fa-arrow-right-long:before,.fa-long-arrow-right:before{content:"\\f178"}.fa-anchor-circle-xmark:before{content:"\\e4ac"}.fa-ellipsis-h:before,.fa-ellipsis:before{content:"\\f141"}.fa-chess-pawn:before{content:"\\f443"}.fa-first-aid:before,.fa-kit-medical:before{content:"\\f479"}.fa-person-through-window:before{content:"\\e5a9"}.fa-toolbox:before{content:"\\f552"}.fa-hands-holding-circle:before{content:"\\e4fb"}.fa-bug:before{content:"\\f188"}.fa-credit-card-alt:before,.fa-credit-card:before{content:"\\f09d"}.fa-automobile:before,.fa-car:before{content:"\\f1b9"}.fa-hand-holding-hand:before{content:"\\e4f7"}.fa-book-open-reader:before,.fa-book-reader:before{content:"\\f5da"}.fa-mountain-sun:before{content:"\\e52f"}.fa-arrows-left-right-to-line:before{content:"\\e4ba"}.fa-dice-d20:before{content:"\\f6cf"}.fa-truck-droplet:before{content:"\\e58c"}.fa-file-circle-xmark:before{content:"\\e5a1"}.fa-temperature-arrow-up:before,.fa-temperature-up:before{content:"\\e040"}.fa-medal:before{content:"\\f5a2"}.fa-bed:before{content:"\\f236"}.fa-h-square:before,.fa-square-h:before{content:"\\f0fd"}.fa-podcast:before{content:"\\f2ce"}.fa-temperature-4:before,.fa-temperature-full:before,.fa-thermometer-4:before,.fa-thermometer-full:before{content:"\\f2c7"}.fa-bell:before{content:"\\f0f3"}.fa-superscript:before{content:"\\f12b"}.fa-plug-circle-xmark:before{content:"\\e560"}.fa-star-of-life:before{content:"\\f621"}.fa-phone-slash:before{content:"\\f3dd"}.fa-paint-roller:before{content:"\\f5aa"}.fa-hands-helping:before,.fa-handshake-angle:before{content:"\\f4c4"}.fa-location-dot:before,.fa-map-marker-alt:before{content:"\\f3c5"}.fa-file:before{content:"\\f15b"}.fa-greater-than:before{content:"\\3e"}.fa-person-swimming:before,.fa-swimmer:before{content:"\\f5c4"}.fa-arrow-down:before{content:"\\f063"}.fa-droplet:before,.fa-tint:before{content:"\\f043"}.fa-eraser:before{content:"\\f12d"}.fa-earth-america:before,.fa-earth-americas:before,.fa-earth:before,.fa-globe-americas:before{content:"\\f57d"}.fa-person-burst:before{content:"\\e53b"}.fa-dove:before{content:"\\f4ba"}.fa-battery-0:before,.fa-battery-empty:before{content:"\\f244"}.fa-socks:before{content:"\\f696"}.fa-inbox:before{content:"\\f01c"}.fa-section:before{content:"\\e447"}.fa-gauge-high:before,.fa-tachometer-alt-fast:before,.fa-tachometer-alt:before{content:"\\f625"}.fa-envelope-open-text:before{content:"\\f658"}.fa-hospital-alt:before,.fa-hospital-wide:before,.fa-hospital:before{content:"\\f0f8"}.fa-wine-bottle:before{content:"\\f72f"}.fa-chess-rook:before{content:"\\f447"}.fa-bars-staggered:before,.fa-reorder:before,.fa-stream:before{content:"\\f550"}.fa-dharmachakra:before{content:"\\f655"}.fa-hotdog:before{content:"\\f80f"}.fa-blind:before,.fa-person-walking-with-cane:before{content:"\\f29d"}.fa-drum:before{content:"\\f569"}.fa-ice-cream:before{content:"\\f810"}.fa-heart-circle-bolt:before{content:"\\e4fc"}.fa-fax:before{content:"\\f1ac"}.fa-paragraph:before{content:"\\f1dd"}.fa-check-to-slot:before,.fa-vote-yea:before{content:"\\f772"}.fa-star-half:before{content:"\\f089"}.fa-boxes-alt:before,.fa-boxes-stacked:before,.fa-boxes:before{content:"\\f468"}.fa-chain:before,.fa-link:before{content:"\\f0c1"}.fa-assistive-listening-systems:before,.fa-ear-listen:before{content:"\\f2a2"}.fa-tree-city:before{content:"\\e587"}.fa-play:before{content:"\\f04b"}.fa-font:before{content:"\\f031"}.fa-table-cells-row-lock:before{content:"\\e67a"}.fa-rupiah-sign:before{content:"\\e23d"}.fa-magnifying-glass:before,.fa-search:before{content:"\\f002"}.fa-ping-pong-paddle-ball:before,.fa-table-tennis-paddle-ball:before,.fa-table-tennis:before{content:"\\f45d"}.fa-diagnoses:before,.fa-person-dots-from-line:before{content:"\\f470"}.fa-trash-can-arrow-up:before,.fa-trash-restore-alt:before{content:"\\f82a"}.fa-naira-sign:before{content:"\\e1f6"}.fa-cart-arrow-down:before{content:"\\f218"}.fa-walkie-talkie:before{content:"\\f8ef"}.fa-file-edit:before,.fa-file-pen:before{content:"\\f31c"}.fa-receipt:before{content:"\\f543"}.fa-pen-square:before,.fa-pencil-square:before,.fa-square-pen:before{content:"\\f14b"}.fa-suitcase-rolling:before{content:"\\f5c1"}.fa-person-circle-exclamation:before{content:"\\e53f"}.fa-chevron-down:before{content:"\\f078"}.fa-battery-5:before,.fa-battery-full:before,.fa-battery:before{content:"\\f240"}.fa-skull-crossbones:before{content:"\\f714"}.fa-code-compare:before{content:"\\e13a"}.fa-list-dots:before,.fa-list-ul:before{content:"\\f0ca"}.fa-school-lock:before{content:"\\e56f"}.fa-tower-cell:before{content:"\\e585"}.fa-down-long:before,.fa-long-arrow-alt-down:before{content:"\\f309"}.fa-ranking-star:before{content:"\\e561"}.fa-chess-king:before{content:"\\f43f"}.fa-person-harassing:before{content:"\\e549"}.fa-brazilian-real-sign:before{content:"\\e46c"}.fa-landmark-alt:before,.fa-landmark-dome:before{content:"\\f752"}.fa-arrow-up:before{content:"\\f062"}.fa-television:before,.fa-tv-alt:before,.fa-tv:before{content:"\\f26c"}.fa-shrimp:before{content:"\\e448"}.fa-list-check:before,.fa-tasks:before{content:"\\f0ae"}.fa-jug-detergent:before{content:"\\e519"}.fa-circle-user:before,.fa-user-circle:before{content:"\\f2bd"}.fa-user-shield:before{content:"\\f505"}.fa-wind:before{content:"\\f72e"}.fa-car-burst:before,.fa-car-crash:before{content:"\\f5e1"}.fa-y:before{content:"\\59"}.fa-person-snowboarding:before,.fa-snowboarding:before{content:"\\f7ce"}.fa-shipping-fast:before,.fa-truck-fast:before{content:"\\f48b"}.fa-fish:before{content:"\\f578"}.fa-user-graduate:before{content:"\\f501"}.fa-adjust:before,.fa-circle-half-stroke:before{content:"\\f042"}.fa-clapperboard:before{content:"\\e131"}.fa-circle-radiation:before,.fa-radiation-alt:before{content:"\\f7ba"}.fa-baseball-ball:before,.fa-baseball:before{content:"\\f433"}.fa-jet-fighter-up:before{content:"\\e518"}.fa-diagram-project:before,.fa-project-diagram:before{content:"\\f542"}.fa-copy:before{content:"\\f0c5"}.fa-volume-mute:before,.fa-volume-times:before,.fa-volume-xmark:before{content:"\\f6a9"}.fa-hand-sparkles:before{content:"\\e05d"}.fa-grip-horizontal:before,.fa-grip:before{content:"\\f58d"}.fa-share-from-square:before,.fa-share-square:before{content:"\\f14d"}.fa-child-combatant:before,.fa-child-rifle:before{content:"\\e4e0"}.fa-gun:before{content:"\\e19b"}.fa-phone-square:before,.fa-square-phone:before{content:"\\f098"}.fa-add:before,.fa-plus:before{content:"\\2b"}.fa-expand:before{content:"\\f065"}.fa-computer:before{content:"\\e4e5"}.fa-close:before,.fa-multiply:before,.fa-remove:before,.fa-times:before,.fa-xmark:before{content:"\\f00d"}.fa-arrows-up-down-left-right:before,.fa-arrows:before{content:"\\f047"}.fa-chalkboard-teacher:before,.fa-chalkboard-user:before{content:"\\f51c"}.fa-peso-sign:before{content:"\\e222"}.fa-building-shield:before{content:"\\e4d8"}.fa-baby:before{content:"\\f77c"}.fa-users-line:before{content:"\\e592"}.fa-quote-left-alt:before,.fa-quote-left:before{content:"\\f10d"}.fa-tractor:before{content:"\\f722"}.fa-trash-arrow-up:before,.fa-trash-restore:before{content:"\\f829"}.fa-arrow-down-up-lock:before{content:"\\e4b0"}.fa-lines-leaning:before{content:"\\e51e"}.fa-ruler-combined:before{content:"\\f546"}.fa-copyright:before{content:"\\f1f9"}.fa-equals:before{content:"\\3d"}.fa-blender:before{content:"\\f517"}.fa-teeth:before{content:"\\f62e"}.fa-ils:before,.fa-shekel-sign:before,.fa-shekel:before,.fa-sheqel-sign:before,.fa-sheqel:before{content:"\\f20b"}.fa-map:before{content:"\\f279"}.fa-rocket:before{content:"\\f135"}.fa-photo-film:before,.fa-photo-video:before{content:"\\f87c"}.fa-folder-minus:before{content:"\\f65d"}.fa-store:before{content:"\\f54e"}.fa-arrow-trend-up:before{content:"\\e098"}.fa-plug-circle-minus:before{content:"\\e55e"}.fa-sign-hanging:before,.fa-sign:before{content:"\\f4d9"}.fa-bezier-curve:before{content:"\\f55b"}.fa-bell-slash:before{content:"\\f1f6"}.fa-tablet-android:before,.fa-tablet:before{content:"\\f3fb"}.fa-school-flag:before{content:"\\e56e"}.fa-fill:before{content:"\\f575"}.fa-angle-up:before{content:"\\f106"}.fa-drumstick-bite:before{content:"\\f6d7"}.fa-holly-berry:before{content:"\\f7aa"}.fa-chevron-left:before{content:"\\f053"}.fa-bacteria:before{content:"\\e059"}.fa-hand-lizard:before{content:"\\f258"}.fa-notdef:before{content:"\\e1fe"}.fa-disease:before{content:"\\f7fa"}.fa-briefcase-medical:before{content:"\\f469"}.fa-genderless:before{content:"\\f22d"}.fa-chevron-right:before{content:"\\f054"}.fa-retweet:before{content:"\\f079"}.fa-car-alt:before,.fa-car-rear:before{content:"\\f5de"}.fa-pump-soap:before{content:"\\e06b"}.fa-video-slash:before{content:"\\f4e2"}.fa-battery-2:before,.fa-battery-quarter:before{content:"\\f243"}.fa-radio:before{content:"\\f8d7"}.fa-baby-carriage:before,.fa-carriage-baby:before{content:"\\f77d"}.fa-traffic-light:before{content:"\\f637"}.fa-thermometer:before{content:"\\f491"}.fa-vr-cardboard:before{content:"\\f729"}.fa-hand-middle-finger:before{content:"\\f806"}.fa-percent:before,.fa-percentage:before{content:"\\25"}.fa-truck-moving:before{content:"\\f4df"}.fa-glass-water-droplet:before{content:"\\e4f5"}.fa-display:before{content:"\\e163"}.fa-face-smile:before,.fa-smile:before{content:"\\f118"}.fa-thumb-tack:before,.fa-thumbtack:before{content:"\\f08d"}.fa-trophy:before{content:"\\f091"}.fa-person-praying:before,.fa-pray:before{content:"\\f683"}.fa-hammer:before{content:"\\f6e3"}.fa-hand-peace:before{content:"\\f25b"}.fa-rotate:before,.fa-sync-alt:before{content:"\\f2f1"}.fa-spinner:before{content:"\\f110"}.fa-robot:before{content:"\\f544"}.fa-peace:before{content:"\\f67c"}.fa-cogs:before,.fa-gears:before{content:"\\f085"}.fa-warehouse:before{content:"\\f494"}.fa-arrow-up-right-dots:before{content:"\\e4b7"}.fa-splotch:before{content:"\\f5bc"}.fa-face-grin-hearts:before,.fa-grin-hearts:before{content:"\\f584"}.fa-dice-four:before{content:"\\f524"}.fa-sim-card:before{content:"\\f7c4"}.fa-transgender-alt:before,.fa-transgender:before{content:"\\f225"}.fa-mercury:before{content:"\\f223"}.fa-arrow-turn-down:before,.fa-level-down:before{content:"\\f149"}.fa-person-falling-burst:before{content:"\\e547"}.fa-award:before{content:"\\f559"}.fa-ticket-alt:before,.fa-ticket-simple:before{content:"\\f3ff"}.fa-building:before{content:"\\f1ad"}.fa-angle-double-left:before,.fa-angles-left:before{content:"\\f100"}.fa-qrcode:before{content:"\\f029"}.fa-clock-rotate-left:before,.fa-history:before{content:"\\f1da"}.fa-face-grin-beam-sweat:before,.fa-grin-beam-sweat:before{content:"\\f583"}.fa-arrow-right-from-file:before,.fa-file-export:before{content:"\\f56e"}.fa-shield-blank:before,.fa-shield:before{content:"\\f132"}.fa-arrow-up-short-wide:before,.fa-sort-amount-up-alt:before{content:"\\f885"}.fa-house-medical:before{content:"\\e3b2"}.fa-golf-ball-tee:before,.fa-golf-ball:before{content:"\\f450"}.fa-chevron-circle-left:before,.fa-circle-chevron-left:before{content:"\\f137"}.fa-house-chimney-window:before{content:"\\e00d"}.fa-pen-nib:before{content:"\\f5ad"}.fa-tent-arrow-turn-left:before{content:"\\e580"}.fa-tents:before{content:"\\e582"}.fa-magic:before,.fa-wand-magic:before{content:"\\f0d0"}.fa-dog:before{content:"\\f6d3"}.fa-carrot:before{content:"\\f787"}.fa-moon:before{content:"\\f186"}.fa-wine-glass-alt:before,.fa-wine-glass-empty:before{content:"\\f5ce"}.fa-cheese:before{content:"\\f7ef"}.fa-yin-yang:before{content:"\\f6ad"}.fa-music:before{content:"\\f001"}.fa-code-commit:before{content:"\\f386"}.fa-temperature-low:before{content:"\\f76b"}.fa-biking:before,.fa-person-biking:before{content:"\\f84a"}.fa-broom:before{content:"\\f51a"}.fa-shield-heart:before{content:"\\e574"}.fa-gopuram:before{content:"\\f664"}.fa-earth-oceania:before,.fa-globe-oceania:before{content:"\\e47b"}.fa-square-xmark:before,.fa-times-square:before,.fa-xmark-square:before{content:"\\f2d3"}.fa-hashtag:before{content:"\\23"}.fa-expand-alt:before,.fa-up-right-and-down-left-from-center:before{content:"\\f424"}.fa-oil-can:before{content:"\\f613"}.fa-t:before{content:"\\54"}.fa-hippo:before{content:"\\f6ed"}.fa-chart-column:before{content:"\\e0e3"}.fa-infinity:before{content:"\\f534"}.fa-vial-circle-check:before{content:"\\e596"}.fa-person-arrow-down-to-line:before{content:"\\e538"}.fa-voicemail:before{content:"\\f897"}.fa-fan:before{content:"\\f863"}.fa-person-walking-luggage:before{content:"\\e554"}.fa-arrows-alt-v:before,.fa-up-down:before{content:"\\f338"}.fa-cloud-moon-rain:before{content:"\\f73c"}.fa-calendar:before{content:"\\f133"}.fa-trailer:before{content:"\\e041"}.fa-bahai:before,.fa-haykal:before{content:"\\f666"}.fa-sd-card:before{content:"\\f7c2"}.fa-dragon:before{content:"\\f6d5"}.fa-shoe-prints:before{content:"\\f54b"}.fa-circle-plus:before,.fa-plus-circle:before{content:"\\f055"}.fa-face-grin-tongue-wink:before,.fa-grin-tongue-wink:before{content:"\\f58b"}.fa-hand-holding:before{content:"\\f4bd"}.fa-plug-circle-exclamation:before{content:"\\e55d"}.fa-chain-broken:before,.fa-chain-slash:before,.fa-link-slash:before,.fa-unlink:before{content:"\\f127"}.fa-clone:before{content:"\\f24d"}.fa-person-walking-arrow-loop-left:before{content:"\\e551"}.fa-arrow-up-z-a:before,.fa-sort-alpha-up-alt:before{content:"\\f882"}.fa-fire-alt:before,.fa-fire-flame-curved:before{content:"\\f7e4"}.fa-tornado:before{content:"\\f76f"}.fa-file-circle-plus:before{content:"\\e494"}.fa-book-quran:before,.fa-quran:before{content:"\\f687"}.fa-anchor:before{content:"\\f13d"}.fa-border-all:before{content:"\\f84c"}.fa-angry:before,.fa-face-angry:before{content:"\\f556"}.fa-cookie-bite:before{content:"\\f564"}.fa-arrow-trend-down:before{content:"\\e097"}.fa-feed:before,.fa-rss:before{content:"\\f09e"}.fa-draw-polygon:before{content:"\\f5ee"}.fa-balance-scale:before,.fa-scale-balanced:before{content:"\\f24e"}.fa-gauge-simple-high:before,.fa-tachometer-fast:before,.fa-tachometer:before{content:"\\f62a"}.fa-shower:before{content:"\\f2cc"}.fa-desktop-alt:before,.fa-desktop:before{content:"\\f390"}.fa-m:before{content:"\\4d"}.fa-table-list:before,.fa-th-list:before{content:"\\f00b"}.fa-comment-sms:before,.fa-sms:before{content:"\\f7cd"}.fa-book:before{content:"\\f02d"}.fa-user-plus:before{content:"\\f234"}.fa-check:before{content:"\\f00c"}.fa-battery-4:before,.fa-battery-three-quarters:before{content:"\\f241"}.fa-house-circle-check:before{content:"\\e509"}.fa-angle-left:before{content:"\\f104"}.fa-diagram-successor:before{content:"\\e47a"}.fa-truck-arrow-right:before{content:"\\e58b"}.fa-arrows-split-up-and-left:before{content:"\\e4bc"}.fa-fist-raised:before,.fa-hand-fist:before{content:"\\f6de"}.fa-cloud-moon:before{content:"\\f6c3"}.fa-briefcase:before{content:"\\f0b1"}.fa-person-falling:before{content:"\\e546"}.fa-image-portrait:before,.fa-portrait:before{content:"\\f3e0"}.fa-user-tag:before{content:"\\f507"}.fa-rug:before{content:"\\e569"}.fa-earth-europe:before,.fa-globe-europe:before{content:"\\f7a2"}.fa-cart-flatbed-suitcase:before,.fa-luggage-cart:before{content:"\\f59d"}.fa-rectangle-times:before,.fa-rectangle-xmark:before,.fa-times-rectangle:before,.fa-window-close:before{content:"\\f410"}.fa-baht-sign:before{content:"\\e0ac"}.fa-book-open:before{content:"\\f518"}.fa-book-journal-whills:before,.fa-journal-whills:before{content:"\\f66a"}.fa-handcuffs:before{content:"\\e4f8"}.fa-exclamation-triangle:before,.fa-triangle-exclamation:before,.fa-warning:before{content:"\\f071"}.fa-database:before{content:"\\f1c0"}.fa-mail-forward:before,.fa-share:before{content:"\\f064"}.fa-bottle-droplet:before{content:"\\e4c4"}.fa-mask-face:before{content:"\\e1d7"}.fa-hill-rockslide:before{content:"\\e508"}.fa-exchange-alt:before,.fa-right-left:before{content:"\\f362"}.fa-paper-plane:before{content:"\\f1d8"}.fa-road-circle-exclamation:before{content:"\\e565"}.fa-dungeon:before{content:"\\f6d9"}.fa-align-right:before{content:"\\f038"}.fa-money-bill-1-wave:before,.fa-money-bill-wave-alt:before{content:"\\f53b"}.fa-life-ring:before{content:"\\f1cd"}.fa-hands:before,.fa-sign-language:before,.fa-signing:before{content:"\\f2a7"}.fa-calendar-day:before{content:"\\f783"}.fa-ladder-water:before,.fa-swimming-pool:before,.fa-water-ladder:before{content:"\\f5c5"}.fa-arrows-up-down:before,.fa-arrows-v:before{content:"\\f07d"}.fa-face-grimace:before,.fa-grimace:before{content:"\\f57f"}.fa-wheelchair-alt:before,.fa-wheelchair-move:before{content:"\\e2ce"}.fa-level-down-alt:before,.fa-turn-down:before{content:"\\f3be"}.fa-person-walking-arrow-right:before{content:"\\e552"}.fa-envelope-square:before,.fa-square-envelope:before{content:"\\f199"}.fa-dice:before{content:"\\f522"}.fa-bowling-ball:before{content:"\\f436"}.fa-brain:before{content:"\\f5dc"}.fa-band-aid:before,.fa-bandage:before{content:"\\f462"}.fa-calendar-minus:before{content:"\\f272"}.fa-circle-xmark:before,.fa-times-circle:before,.fa-xmark-circle:before{content:"\\f057"}.fa-gifts:before{content:"\\f79c"}.fa-hotel:before{content:"\\f594"}.fa-earth-asia:before,.fa-globe-asia:before{content:"\\f57e"}.fa-id-card-alt:before,.fa-id-card-clip:before{content:"\\f47f"}.fa-magnifying-glass-plus:before,.fa-search-plus:before{content:"\\f00e"}.fa-thumbs-up:before{content:"\\f164"}.fa-user-clock:before{content:"\\f4fd"}.fa-allergies:before,.fa-hand-dots:before{content:"\\f461"}.fa-file-invoice:before{content:"\\f570"}.fa-window-minimize:before{content:"\\f2d1"}.fa-coffee:before,.fa-mug-saucer:before{content:"\\f0f4"}.fa-brush:before{content:"\\f55d"}.fa-mask:before{content:"\\f6fa"}.fa-magnifying-glass-minus:before,.fa-search-minus:before{content:"\\f010"}.fa-ruler-vertical:before{content:"\\f548"}.fa-user-alt:before,.fa-user-large:before{content:"\\f406"}.fa-train-tram:before{content:"\\e5b4"}.fa-user-nurse:before{content:"\\f82f"}.fa-syringe:before{content:"\\f48e"}.fa-cloud-sun:before{content:"\\f6c4"}.fa-stopwatch-20:before{content:"\\e06f"}.fa-square-full:before{content:"\\f45c"}.fa-magnet:before{content:"\\f076"}.fa-jar:before{content:"\\e516"}.fa-note-sticky:before,.fa-sticky-note:before{content:"\\f249"}.fa-bug-slash:before{content:"\\e490"}.fa-arrow-up-from-water-pump:before{content:"\\e4b6"}.fa-bone:before{content:"\\f5d7"}.fa-table-cells-row-unlock:before{content:"\\e691"}.fa-user-injured:before{content:"\\f728"}.fa-face-sad-tear:before,.fa-sad-tear:before{content:"\\f5b4"}.fa-plane:before{content:"\\f072"}.fa-tent-arrows-down:before{content:"\\e581"}.fa-exclamation:before{content:"\\21"}.fa-arrows-spin:before{content:"\\e4bb"}.fa-print:before{content:"\\f02f"}.fa-try:before,.fa-turkish-lira-sign:before,.fa-turkish-lira:before{content:"\\e2bb"}.fa-dollar-sign:before,.fa-dollar:before,.fa-usd:before{content:"\\24"}.fa-x:before{content:"\\58"}.fa-magnifying-glass-dollar:before,.fa-search-dollar:before{content:"\\f688"}.fa-users-cog:before,.fa-users-gear:before{content:"\\f509"}.fa-person-military-pointing:before{content:"\\e54a"}.fa-bank:before,.fa-building-columns:before,.fa-institution:before,.fa-museum:before,.fa-university:before{content:"\\f19c"}.fa-umbrella:before{content:"\\f0e9"}.fa-trowel:before{content:"\\e589"}.fa-d:before{content:"\\44"}.fa-stapler:before{content:"\\e5af"}.fa-masks-theater:before,.fa-theater-masks:before{content:"\\f630"}.fa-kip-sign:before{content:"\\e1c4"}.fa-hand-point-left:before{content:"\\f0a5"}.fa-handshake-alt:before,.fa-handshake-simple:before{content:"\\f4c6"}.fa-fighter-jet:before,.fa-jet-fighter:before{content:"\\f0fb"}.fa-share-alt-square:before,.fa-square-share-nodes:before{content:"\\f1e1"}.fa-barcode:before{content:"\\f02a"}.fa-plus-minus:before{content:"\\e43c"}.fa-video-camera:before,.fa-video:before{content:"\\f03d"}.fa-graduation-cap:before,.fa-mortar-board:before{content:"\\f19d"}.fa-hand-holding-medical:before{content:"\\e05c"}.fa-person-circle-check:before{content:"\\e53e"}.fa-level-up-alt:before,.fa-turn-up:before{content:"\\f3bf"}
        .fa-sr-only,.fa-sr-only-focusable:not(:focus),.sr-only,.sr-only-focusable:not(:focus){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
                
    `);
})();