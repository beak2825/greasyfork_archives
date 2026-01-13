// ==UserScript==
// @name         116117 Arztsuche – Live Phone Availability & Details
// @name:en      116117 Arztsuche – Live Phone Availability & Details
// @name:de      116117 Arztsuche – Live Erreichbarkeit & Details
// @namespace    https://github.com/Bergiu/Aerztesuche-Scripts
// @version      0.5.4
// @description  Visualizes live telephone availability, offers expanded doctor details, and allows testing with fake times.
// @description:en Visualizes live telephone availability, offers expanded doctor details, and allows testing with fake times.
// @description:de Visualisiert die telefonische Erreichbarkeit in Echtzeit, bietet erweiterte Details und ermöglicht Tests mit simulierten Zeiten.
// @match        https://arztsuche.116117.de/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @author       Bergiu
// @homepageURL  https://github.com/Bergiu/Aerztesuche-Scripts
// @supportURL   https://github.com/Bergiu/Aerztesuche-Scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/562296/116117%20Arztsuche%20%E2%80%93%20Live%20Phone%20Availability%20%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/562296/116117%20Arztsuche%20%E2%80%93%20Live%20Phone%20Availability%20%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[GM] Ärzte Live Erreichbarkeit loaded');

    // --- 0. TEST MODE HELPER ---
    const FakeTime = {
        active: false,
        offset: 0, // Difference between target time and real time

        now() {
            if (this.active) {
                return new Date(Date.now() + this.offset);
            }
            return new Date();
        },

        set(inputStr) {
            if (!inputStr || !inputStr.trim()) {
                this.active = false;
                this.offset = 0;
                return;
            }

            // Try parsing "YYYY-MM-DD HH:MM"
            let d = new Date(inputStr);

            // If invalid, try parsing "HH:MM" for today
            if (isNaN(d.getTime())) {
                const parts = inputStr.split(':');
                if (parts.length === 2) {
                    const h = parseInt(parts[0]);
                    const m = parseInt(parts[1]);
                    if (!isNaN(h) && !isNaN(m)) {
                        d = new Date();
                        d.setHours(h);
                        d.setMinutes(m);
                        d.setSeconds(0);
                        d.setMilliseconds(0);
                    }
                }
            }

            if (!isNaN(d.getTime())) {
                this.offset = d.getTime() - Date.now();
                this.active = true;
            } else {
                alert("Ungültiges Format. Bitte 'YYYY-MM-DD HH:MM' oder 'HH:MM' nutzen.");
            }
        },

        toggleUI() {
            const current = this.now();
            // Default value format: YYYY-MM-DD HH:MM
            const defVal = [
                current.getFullYear(),
                String(current.getMonth()+1).padStart(2,'0'),
                String(current.getDate()).padStart(2,'0')
            ].join('-') + ' ' + [
                String(current.getHours()).padStart(2,'0'),
                String(current.getMinutes()).padStart(2,'0')
            ].join(':');

            let input = prompt("Datum & Zeit setzen (YYYY-MM-DD HH:MM) oder nur Zeit (HH:MM):\nLeer lassen zum Deaktivieren.", defVal);
            if(input !== null) {
                this.set(input);
                updateTestButton();
            }
        }
    };

    function updateTestButton() {
        // Only show if Dev Cache button exists
        const buttons = Array.from(document.querySelectorAll('button'));
        const cacheBtn = buttons.find(b => b.textContent && b.textContent.includes("Clear Dev Cache"));

        if (!cacheBtn) {
            // Remove if exists and cache button is gone
            const existing = document.getElementById('gm-test-time-btn');
            if(existing) existing.remove();
            return;
        }

        let btn = document.getElementById('gm-test-time-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'gm-test-time-btn';
            Object.assign(btn.style, {
                position: 'fixed',
                bottom: '10px',
                right: '120px',
                zIndex: 9999,
                padding: '5px 10px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
            });
            btn.onclick = () => FakeTime.toggleUI();
            document.body.appendChild(btn);
        }

        if (FakeTime.active) {
            const d = FakeTime.now();
            // Show Day + Time if not today, otherwise just time
            const now = new Date();
            let label = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            if (d.getDate() !== now.getDate() || d.getMonth() !== now.getMonth()) {
               label = `${d.getDate()}.${d.getMonth()+1}. ${label}`;
            }

            btn.textContent = `Test: ${label}`;
            btn.style.background = '#f59e0b'; // Orange when active
        } else {
            btn.textContent = "Set Test Time";
            btn.style.background = '#3b82f6';
        }
    }

    // Init UI
    setTimeout(updateTestButton, 2000);


    // --- 1. DATA HELPERS ---

    function isSameDay(date1, date2) {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    }

    function parseNteDate(nteString) {
        if (!nteString) return null;
        try {
            const [datePart, timePart] = nteString.split('@');
            return new Date(`${datePart}T${timePart}:00`);
        } catch (e) { return null; }
    }

    function checkIsPhoneOpenNow(tszArray) {
        if (!tszArray || !Array.isArray(tszArray)) return { isOpen: false, remaining: 0 };
        const now = FakeTime.now();
        // Use local YYYY-MM-DD
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d_day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d_day}`;

        const currentTimeVal = now.getHours() * 60 + now.getMinutes();

        const todayEntry = tszArray.find(d => d.d.startsWith(todayStr)); // startswith safe for iso
        // Note: The original code used d.d === todayStr. d.d from API is usually YYYY-MM-DD.
        // ISOString returns YYYY-MM-DDTHH:mm:ss.sssZ. split('T')[0] gives YYYY-MM-DD.
        // However, if FakeTime is shifted significantly, "today" might be different.
        // We rely on FakeTime.now() returning a Date object that behaves correctly.

        /*
           CAUTION: The original code compared `d.d` (string) with `now.toISOString().split('T')[0]`.
           The API `d.d` is YYYY-MM-DD.
           If we fake the time, `FakeTime.now()` returns a Date object with the fake time.
           If the fake time is today, it works. If we wanted to fake "tomorrow", we'd need to set the date accordingly.
           Currently `FakeTime.set` only changes hours/minutes of *today*. So this is fine.
        */

        if (!todayEntry || !todayEntry.typTsz) return { isOpen: false, remaining: 0 };

        for (const typObj of todayEntry.typTsz) {
            if (typObj.typ === '07' && typObj.sprechzeiten) {
                for (const zeit of typObj.sprechzeiten) {
                    const parts = zeit.z.split(' - ');
                    if (parts.length === 2) {
                        const [start, end] = parts;
                        const startVal = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
                        const endVal = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);

                        if (currentTimeVal >= startVal && currentTimeVal < endVal) {
                            return { isOpen: true, remaining: endVal - currentTimeVal };
                        }
                    }
                }
            }
        }
        return { isOpen: false, remaining: 0 };
    }

    function getTodayTimes(tszArray) {
        if (!tszArray || !Array.isArray(tszArray)) return 'Keine Daten';
        const now = FakeTime.now();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d_day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d_day}`;

        const todayEntry = tszArray.find(d => d.d.startsWith(todayStr));
        if (!todayEntry || !todayEntry.typTsz) return 'Keine Sprechzeiten heute';

        const times = [];
        for (const typObj of todayEntry.typTsz) {
            // 07 = Tel. Erreichbarkeit? Or general?
            // The user wants "Heutige Sprechzeiten".
            // Usually typ '01' is Sprechstunde, '07' is Telefon.
            // Let's grab all available times or specific ones?
            // The checkIsPhoneOpenNow uses '07'. Let's show those as they are "Phone Times".
            if (typObj.typ === '07' && typObj.sprechzeiten) {
                for (const zeit of typObj.sprechzeiten) {
                    times.push(zeit.z);
                }
            }
        }
        return times.length > 0 ? times.join(', ') : 'Heute geschlossen';
    }

    function mapRealDoctor(doc) {
        const now = FakeTime.now();
        const nowMs = now.getTime();
        const fullName = [doc.titel, doc.vorname, doc.name].filter(Boolean).join(' ');

        let category = 'Arzt';
        if (doc.ag && doc.ag.length > 0) category = doc.ag[0].value;
        else if (doc.fg && doc.fg.length > 0) category = doc.fg[0];

        const distKm = doc.distance ? (doc.distance / 1000).toFixed(1) : 0;

        let _remaining = 0;
        let _nextStart = null;
        let _isNow = false;

        const statusNow = checkIsPhoneOpenNow(doc.tsz);

        if (statusNow.isOpen) {
            _isNow = true;
            _remaining = statusNow.remaining;
            _nextStart = nowMs;
        } else {
            const nteDate = parseNteDate(doc.nteStart);
            if (nteDate && nteDate.getTime() > nowMs) {
                _nextStart = nteDate.getTime();
                _remaining = Math.round((_nextStart - nowMs) / 60000);
            }
        }

        return {
            name: fullName,
            phone: doc.tel || 'Keine Nummer',
            email: doc.email,
            website: doc.homepage || doc.url || doc.www,
            times: getTodayTimes(doc.tsz),
            category: category,
            distance: distKm,
            address: `${doc.strasse || ''} ${doc.hausnummer || ''}, ${doc.plz || ''} ${doc.ort || ''}`,
            _remaining: _remaining,
            _nextStart: _nextStart,
            _isNow: _isNow,
            raw: doc
        };
    }

    // --- 2. UI COMPONENTS ---

    function formatTimeLabel(remainingMin, isNow) {
        if (isNow) return `noch ${remainingMin} min`;
        if (remainingMin > 60) return `in ${(remainingMin/60).toFixed(1)}h`;
        return `in ${remainingMin} min`;
    }

    // Globaler State für aufgeklappte Karten
    const expandedDoctors = new Set();

    function createDoctorCard(d, type) {
        const wrapper = document.createElement('div');
        wrapper.className = 'doctor-card-wrapper';

        const isNow = type === 'now';
        const timeLeftStr = formatTimeLabel(d._remaining, isNow);

        const docId = d.raw && d.raw.id ? d.raw.id : d.name;
        const isExpanded = expandedDoctors.has(docId);

        wrapper.innerHTML = `
            <div class="doctor-card">
                <div class="card-header-row">
                    <div class="time-slot ${isNow ? 'active' : 'pending'}">
                        ${timeLeftStr}
                    </div>
                    <div class="header-actions">
                        ${isNow ? `
                        <a href="tel:${d.phone.replace(/\s/g,'')}" class="btn-icon call primary-pulse" title="Anrufen">📞</a>
                        ` : `
                        <button class="btn-icon reminder" title="Erinnerung erstellen">📅</button>
                        `}
                    </div>
                </div>

                <div class="doctor-main-info">
                    <div class="name-row">
                        <h3 class="doctor-name">${d.name}</h3>
                        <span class="doctor-dist">${d.distance} km</span>
                    </div>
                    <div class="doctor-meta">
                        <span class="doctor-phone">📞 ${d.phone}</span>
                        <span class="doctor-spec">${d.category}</span>
                    </div>
                </div>

                <div class="expander-bar" title="Details aufklappen">
                    <span class="expander-handle"></span>
                </div>
            </div>

            <div class="doctor-logs ${isExpanded ? 'open' : ''}">
                <div class="expanded-actions">
                     ${d.times ? `
                     <div class="opening-hours-row">
                        <span class="oh-label">Heutige Sprechzeiten:</span>
                        <span class="oh-value">${d.times}</span>
                     </div>` : ''}

                     <div class="doctor-contact-info">
                        ${d.address ? `
                        <div class="contact-row">
                            <span class="contact-value">📍 ${d.address}</span>
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}" target="_blank" class="btn-maps" title="Auf Karte zeigen">Karte</a>
                        </div>` : ''}

                        <div class="contact-row">
                            <span class="contact-value ${!d.email ? 'missing' : ''}">✉️ ${d.email || 'Keine Email hinterlegt'}</span>
                            <button class="btn-send-email ${!d.email ? 'disabled' : ''}" ${!d.email ? 'disabled' : ''} data-email="${d.email || ''}">Senden</button>
                        </div>

                        ${d.website ? `
                        <div class="contact-row">
                            <span class="contact-value">🌐 <a href="${d.website}" target="_blank" class="contact-link">${d.website}</a></span>
                        </div>` : ''}
                     </div>
                </div>
            </div>
        `;

        wrapper.querySelector('.expander-bar').onclick = () => {
            const logsDiv = wrapper.querySelector('.doctor-logs');
            const nowOpen = logsDiv.classList.toggle('open');
            if (nowOpen) expandedDoctors.add(docId);
            else expandedDoctors.delete(docId);
        };

        const emailBtn = wrapper.querySelector('.btn-send-email');
        if (emailBtn && d.email) {
            emailBtn.onclick = () => {
                 const subject = encodeURIComponent("Terminanfrage");

                 let salutation = "Sehr geehrte/r";
                 // Check Anrede from raw data
                 const anrede = d.raw && d.raw.anrede ? d.raw.anrede : '';

                 if (anrede === 'Herr') {
                     salutation = "Sehr geehrter Herr";
                 } else if (anrede === 'Frau') {
                     salutation = "Sehr geehrte Frau";
                 }

                 const body = encodeURIComponent(`${salutation} ${d.name},\n\n\nMit freundlichen Grüßen\n\n`);
                 window.open(`mailto:${d.email}?subject=${subject}&body=${body}`, '_blank');
            };
        }

        if(!isNow) {
             const reminderBtn = wrapper.querySelector('.btn-icon.reminder');
             if(reminderBtn) {
                 reminderBtn.onclick = () => {
                     const start = new Date(d._nextStart).toISOString().replace(/[-:]|\.000/g,'');
                     const end = new Date(d._nextStart + 30*60000).toISOString().replace(/[-:]|\.000/g,'');
                     window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(d.name)}&dates=${start}/${end}&details=${encodeURIComponent(d.phone)}`);
                 };
             }
        }

        return wrapper;
    }

    function renderNowSection(container, doctors) {
        if (doctors.length === 0) return;

        const section = document.createElement('div');
        section.className = 'now-section';

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Jetzt erreichbar';
        if (FakeTime.active) {
            title.textContent += ` (TEST: ${FakeTime.now().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})`;
        }
        section.appendChild(title);

        const listDiv = document.createElement('div');
        listDiv.className = 'doctors-list now-list';

        doctors.forEach(d => {
            listDiv.appendChild(createDoctorCard(d, 'now'));
        });
        section.appendChild(listDiv);

        const calledDoctors = [];
        if (calledDoctors.length > 0) {
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'called-toggle-container';
            toggleContainer.innerHTML = `<button class="btn-show-called">Zeige bereits angerufene (${calledDoctors.length})</button>`;
            section.appendChild(toggleContainer);
        }

        container.appendChild(section);
    }

    function renderSoonSection(container, doctors) {
        if (doctors.length === 0) return;

        const section = document.createElement('div');
        section.className = 'soon-section';

        const title = document.createElement('div');
        title.className = 'soon-title';
        title.textContent = 'Bald erreichbar';
        section.appendChild(title);

        const listDiv = document.createElement('div');
        listDiv.className = 'doctors-list soon-list';

        let expanded = false;
        const INITIAL_LIMIT = 2;
        const hasMore = doctors.length > INITIAL_LIMIT;

        const updateList = () => {
            listDiv.innerHTML = '';
            const limit = expanded ? doctors.length : INITIAL_LIMIT;
            doctors.slice(0, limit).forEach(d => {
                listDiv.appendChild(createDoctorCard(d, 'soon'));
            });
        };

        updateList();
        section.appendChild(listDiv);

        if (hasMore) {
            const btnMore = document.createElement('button');
            btnMore.className = 'btn-show-more';

            const updateBtnText = () => {
                btnMore.textContent = expanded
                    ? 'Weniger anzeigen'
                    : `${doctors.length - INITIAL_LIMIT} weitere anzeigen...`;
            };
            updateBtnText();

            btnMore.onclick = () => {
                expanded = !expanded;
                updateList();
                updateBtnText();
            };
            section.appendChild(btnMore);
        }

        container.appendChild(section);
    }

    // --- 3. MAIN RENDER CONTROLLER ---

    function renderLists(openNow, openSoon) {
        // New Parent: .search-results-container
        const parent = document.querySelector('.search-results-container');

        // If parent missing, remove our list (if exists) and return
        if (!parent) {
             const old = document.getElementById('gm-doctor-lists');
             if (old) old.remove();
             return;
        }

        let container = document.getElementById('gm-doctor-lists');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gm-doctor-lists';
            // Insert at the top of the search results
            parent.insertBefore(container, parent.firstChild);
        }

        // Clear content instead of removing node to prevent thrashing
        container.innerHTML = '';

        if (openNow.length === 0 && openSoon.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            emptyMsg.style.color = '#6b7280';
            emptyMsg.innerHTML = '<div style="font-size: 2rem;">😴</div><br>Keine Ärzte zu dieser Zeit erreichbar.';
            if (FakeTime.active) {
                const d = FakeTime.now();
                const now = new Date();
                let label = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                if (d.getDate() !== now.getDate() || d.getMonth() !== now.getMonth()) {
                     label = `${d.getDate()}.${d.getMonth()+1}. ${label}`;
                }
                emptyMsg.innerHTML += `<br><small style="color: #f59e0b">Test-Zeit: ${label}</small>`;
            }
            container.appendChild(emptyMsg);
            return;
        }

        console.log("Render lists")
        renderNowSection(container, openNow);
        renderSoonSection(container, openSoon);
    }




    // --- 5. MAIN LOOP ---

    let lastListRef = null;
    let lastRenderMinute = -1;

    setInterval(() => {

        const rootEl = unsafeWindow.document.querySelector('#app > div');
        if (!rootEl || !rootEl.__vue__) return;

        const comp = rootEl.__vue__;
        let rawList = comp.alleGefundenenPraxen || comp.praxen || (comp.searchResult ? comp.searchResult.arztPraxisDatas : null);

        if (!rawList && comp.$data && comp.$data.arztPraxisDatas) rawList = comp.$data.arztPraxisDatas;
        if (!rawList || !Array.isArray(rawList)) return;

        // Change Detection:
        // User requested to assume list reference doesn't change often to save perfs.
        // We will re-render if:
        // 1. FakeTime is active (dynamic)
        // 2. The rawList reference changes
        // 3. The current minute changes (to update countdowns "in X min")

        const now = FakeTime.now();
        const currentMinute = Math.floor(now.getTime() / 60000);

        if (FakeTime.active) updateTestButton();

        const isListChanged = rawList !== lastListRef;
        const isMinuteChanged = currentMinute !== lastRenderMinute;
        const isFakeTime = FakeTime.active;

        if (!isListChanged && !isMinuteChanged) {
             // Check if container was removed by Vue navigation
             if (document.querySelector('.search-results-container') && !document.getElementById('gm-doctor-lists')) {
                 console.log("[GM] Force Render: UI missing");
             } else {
                 return;
             }
        } else {
             console.log("[GM] Rerender:", { isListChanged, isMinuteChanged, isFakeTime });
        }

        lastListRef = rawList;
        lastRenderMinute = currentMinute;

        const openNow = [];
        const openSoon = [];

        for (const doc of rawList) {
            const mapped = mapRealDoctor(doc);

            if (mapped._isNow) {
                openNow.push(mapped);
            }
            else if (mapped._nextStart && isSameDay(mapped._nextStart, now)) {
                openSoon.push(mapped);
            }
        }

        openNow.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
        openSoon.sort((a,b) => a._remaining - b._remaining);

        renderLists(openNow, openSoon);

    }, 1000);

    // --- CSS ---
    GM_addStyle(`
        /* RESET & BASE */
        .calendar-container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Inter', sans-serif; }
        h3 { margin: 0; }

        /* --- GLOBAL SECTION TITLE (Default für andere Bereiche) --- */
        .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 2rem;
            text-align: center;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: block;
        }

        /* --- NOW SECTION OVERRIDES (GRÜN & KORRIGIERTE GRÖSSE) --- */
        .now-section {
            margin-bottom: 40px;
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #10b981;
            border-radius: 16px;
            padding: 2px;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2);
            overflow: hidden;
            margin-top: 20px;
        }

        .now-section .section-title {
            font-size: 1.4rem !important; /* Zwingt die Größe auf 1.4rem */
            color: #065f46 !important;    /* Zwingt die Farbe auf Dunkelgrün */
            background: none !important;  /* Entfernt den Gradienten */
            -webkit-text-fill-color: initial !important; /* Entfernt Transparenz */
            -webkit-background-clip: border-box !important; /* Entfernt Text-Clipping */
            margin: 16px 0 8px;
            display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        .now-section .section-title::before {
            content: ''; display: block; width: 12px; height: 12px;
            background-color: #10b981; border-radius: 50%; animation: pulse-dot 1.5s infinite;
        }

        .now-list { background: rgba(255, 255, 255, 0.6); border-radius: 14px; padding: 8px; }

        @keyframes pulse-dot {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* --- SOON SECTION (BLAU) --- */
        .soon-section {
            margin-bottom: 40px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #3b82f6;
            border-radius: 16px;
            padding: 2px;
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
            overflow: hidden;
        }
        .soon-title {
            margin: 16px 0 8px;
            font-size: 1.4rem !important; /* Konsistent mit Now Section */
            color: #1e40af;
            display: flex; justify-content: center; align-items: center; gap: 10px; font-weight: bold;
        }
        .soon-title::before { content: '🕒'; font-size: 1rem; }
        .soon-list {
            padding: 8px; background: rgba(255, 255, 255, 0.6);
            border-radius: 14px; display: flex; flex-direction: column; gap: 10px;
        }

        /* --- DOCTOR CARD STYLES --- */
        #gm-doctor-lists { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .doctors-list { display: flex; flex-direction: column; gap: 10px; }

        .doctor-card {
            background: white;
            border-bottom: 1px solid #f3f4f6;
            border-radius: 8px;
            padding: 12px 16px 4px;
            display: flex; flex-direction: column; gap: 8px;
            position: relative; transition: background 0.1s;
        }

        .card-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
        .header-actions { display: flex; gap: 8px; }

        .time-slot { font-size: 0.9rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; white-space: nowrap; }
        .time-slot.active { background: #10b981; color: white; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
        .time-slot.pending { background: #3b82f6; color: white; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2); }

        /* Buttons */
        .btn-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; position: relative; }
        .btn-icon.call { background: #10b981; color: white; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
        .btn-icon.call:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-icon.reminder { background: #3b82f6; color: white; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2); }
        .btn-icon.reminder:hover { transform: translateY(-1px); }
        .btn-icon.history { background: #f3f4f6; color: #4b5563; }
        .btn-icon.history:hover { background: #e5e7eb; }
        .primary-pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

        /* INFO & NAME */
        .doctor-main-info { display: flex; flex-direction: column; gap: 4px; margin-top: -4px; }
        .name-row { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }

        .doctor-name {
            font-size: 1.05rem !important; /* FIX: Zwingt Größe auf 1.05rem */
            font-weight: 600;
            color: #111827;
            margin: 0; line-height: 1.3;
        }

        .doctor-dist { font-size: 0.8rem; background: #f3f4f6; color: #6b7280; padding: 1px 6px; border-radius: 4px; white-space: nowrap; }
        .doctor-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.9rem; color: #6b7280; align-items: center; }

        /* EXPANDER & LOGS */
        .expander-bar { height: 12px; width: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-top: 4px; }
        .expander-bar:hover .expander-handle { background: #9ca3af; }
        .expander-handle { width: 40px; height: 4px; background: #e5e7eb; border-radius: 2px; transition: background 0.2s; }
        .doctor-logs { background: #f9fafb; border-top: 1px solid #f3f4f6; padding: 12px 16px; display: none; }
        .doctor-logs.open { display: block; }
        .expanded-actions { display: flex; flex-direction: column; gap: 8px; }
        .opening-hours-row { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #1e40af; }
        .oh-label { font-weight: 500; } .oh-value { font-weight: 700; }

        .doctor-contact-info { margin-top: 4px; display: flex; flex-direction: column; gap: 8px; padding: 10px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 4px;}
        .contact-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .contact-value { color: #374151; word-break: break-all; }
        .contact-value.missing { color: #9ca3af; font-style: italic; }
        .contact-link { color: #3b82f6; text-decoration: none; }
        .contact-link:hover { text-decoration: underline; }

        .btn-maps, .btn-send-email {
            padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px;
            font-size: 0.8rem; cursor: pointer; text-decoration: none; color: #374151; background: white;
            white-space: nowrap; transition: background 0.1s;
        }
        .btn-maps:hover, .btn-send-email:not(.disabled):hover { background: #f3f4f6; border-color: #9ca3af; }

        .btn-send-email.disabled { opacity: 0.5; cursor: not-allowed; background: #f9fafb; }

        .btn-show-more, .btn-show-called { width: 100%; padding: 12px; background: transparent; border: none; color: #3b82f6; font-weight: 600; cursor: pointer; border-top: 1px solid rgba(59, 130, 246, 0.1); transition: background 0.2s; }
        .btn-show-more:hover { background: rgba(59, 130, 246, 0.05); }
        .called-toggle-container { margin: 10px 0; text-align: center; }
        .btn-show-called { background: #f3f4f6; border: 1px solid #d1d5db; color: #6b7280; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; width: auto; }
    `);

})();