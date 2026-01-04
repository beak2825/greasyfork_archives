// ==UserScript==
// @name         WME Google Status Scanner
// @namespace    https://greasyfork.org/users/velezss
// @version      1.0
// @description  Scans visible places for Google Maps issues (Closed & Far). Dessigned only for Mac computers.
// @author       velezss
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560767/WME%20Google%20Status%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/560767/WME%20Google%20Status%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("WME Scanner: Loaded.");

    let isScanning = false;
    let isBusy = false;
    const checkedVenues = new Set();
    let lastStoppedVenueId = null; // Smart Skip memory

    // --- NUCLEAR AUDIO ENGINE (Prevents browser throttling on Mac/Background) ---
    let audioCtx = null;
    let worker = null;

    function startNuclearAudio() {
        if (audioCtx) { try { audioCtx.close(); } catch(e){} audioCtx = null; }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Configuration to force the browser to keep the tab active
        oscillator.type = 'square';
        oscillator.frequency.value = 50; // 50Hz
        gainNode.gain.value = 0.005; // Very low volume, just enough for the OS to detect "audio playing"
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
    }

    function stopNuclearAudio() {
        if (audioCtx) { audioCtx.close(); audioCtx = null; }
    }

    // --- WEB WORKER (Independent Timer) ---
    function startWorker() {
        if (!worker) {
            const blob = new Blob([`
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        self.timer = setInterval(() => postMessage('tick'), 250); // 250ms tick
                    } else if (e.data === 'stop') {
                        clearInterval(self.timer);
                    }
                };
            `], { type: 'application/javascript' });
            worker = new Worker(URL.createObjectURL(blob));
            worker.onmessage = function(e) { if (e.data === 'tick') processQueueStep(); };
        }
        worker.postMessage('start');
    }

    function stopWorker() {
        if (worker) worker.postMessage('stop');
    }

    // --- UI INITIALIZATION ---
    function bootstrap() {
        const wazeAvailable = (typeof W !== 'undefined' && typeof W.map !== 'undefined' && typeof W.selectionManager !== 'undefined');
        if (!wazeAvailable) {
            setTimeout(bootstrap, 1000);
            return;
        }
        addButton();
    }

    function addButton() {
        if (document.getElementById('btn-wme-scanner')) return;

        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
            zIndex: '99999', display: 'flex', gap: '5px'
        });

        const btn = document.createElement('button');
        btn.id = 'btn-wme-scanner';
        btn.innerHTML = '▶ START SCAN';
        Object.assign(btn.style, {
            padding: '8px 20px', backgroundColor: '#673AB7', color: 'white',
            border: '2px solid white', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)', minWidth: '160px', textAlign: 'left'
        });
        btn.onclick = toggleScan;

        const btnReset = document.createElement('button');
        btnReset.innerHTML = '🔄';
        btnReset.title = "Reset scanned history";
        Object.assign(btnReset.style, {
            padding: '8px 12px', backgroundColor: '#444', color: 'white',
            border: '2px solid white', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
        });
        btnReset.onclick = () => {
            checkedVenues.clear();
            lastStoppedVenueId = null;
            alert("History cleared. Next scan will start from scratch.");
            updateBtn(document.getElementById('btn-wme-scanner'));
        };

        container.appendChild(btn);
        container.appendChild(btnReset);
        document.body.appendChild(container);
    }

    function updateBtn(btn, textOverride) {
        let audioIcon = "🔇";
        if (audioCtx && audioCtx.state === 'running') audioIcon = "🔊"; // Active Audio Indicator

        if (textOverride) {
            btn.innerHTML = `${audioIcon} ${textOverride}`;
            return;
        }

        if (isScanning) {
            btn.innerHTML = `${audioIcon} STOP`;
            btn.style.backgroundColor = '#F44336';
        } else {
            if (checkedVenues.size > 0) {
                btn.innerHTML = `▶ CONTINUE`;
                btn.style.backgroundColor = '#4CAF50';
            } else {
                btn.innerHTML = '▶ START SCAN';
                btn.style.backgroundColor = '#673AB7';
            }
        }
    }

    async function toggleScan() {
        const btn = document.getElementById('btn-wme-scanner');

        if (isScanning) {
            // STOP
            isScanning = false;
            stopWorker();
            stopNuclearAudio();
            updateBtn(btn);
            document.title = "Waze Map Editor";
            return;
        }

        // START
        // Smart Skip: If we resume, automatically skip the last venue we stopped at
        if (lastStoppedVenueId) {
            checkedVenues.add(lastStoppedVenueId);
            console.log("Scanner: Skipping previously stopped venue:", lastStoppedVenueId);
            lastStoppedVenueId = null;
        }

        isScanning = true;
        startNuclearAudio();
        startWorker();
        updateBtn(btn);
        console.log("Scanner: Started.");
    }

    // --- MAIN LOGIC LOOP ---
    async function processQueueStep() {
        if (!isScanning || isBusy) return;
        isBusy = true;

        try {
            // UI Updates
            const stats = getScanStats();
            const btn = document.getElementById('btn-wme-scanner');
            if (stats.total > 0) {
                const current = stats.processed + 1;
                const statusText = `${current} / ${stats.total}`;
                updateBtn(btn, statusText);
                document.title = `Scan ${statusText}`;
            }

            // Get next candidate
            let nextVenue = getNextCandidate();

            if (!nextVenue) {
                isScanning = false;
                stopWorker();
                stopNuclearAudio();
                alert("✅ Scan complete. No more issues found in current view.");
                updateBtn(document.getElementById('btn-wme-scanner'));
                document.title = "Waze Map Editor";
                isBusy = false;
                return;
            }

            // Select Venue
            W.selectionManager.unselectAll();
            await new Promise(r => window.setTimeout(r, 50)); // Wait for UI
            W.selectionManager.setSelectedModels([nextVenue]);

            // Analyze Sidebar Colors
            let result = await analyzeSidebar();

            if (result.status === 'FOUND') {
                console.log(`🛑 ISSUE DETECTED (${result.reason}):`, nextVenue.attributes.name);

                // Remember this venue ID so we can skip it if the user clicks Continue
                lastStoppedVenueId = nextVenue.attributes.id;

                isScanning = false;
                stopWorker();
                stopNuclearAudio();
                updateBtn(document.getElementById('btn-wme-scanner'));
                document.title = `🛑 ${result.reason}!`;

                highlightSidebarBox(result.colorCode);

                let msg = `🛑 STOPPED: ${result.reason}\n\nPlace: "${nextVenue.attributes.name}"`;
                alert(msg);
            } else {
                // If Open or Ignored (Orange), mark as checked
                checkedVenues.add(nextVenue.attributes.id);
            }

        } catch (e) {
            console.error("Scanner Error:", e);
        }
        isBusy = false;
    }

    function getScanStats() {
        if (!W.model || !W.model.venues) return { total: 0, processed: 0 };
        let venues = W.model.venues.getObjectArray();
        let total = 0;
        let processed = 0;
        venues.forEach(v => {
            let visible = v.geometry && W.map.getExtent().intersectsBounds(v.geometry.getBounds());
            if (!visible) return;
            if (v.attributes.residential) return;
            total++;
            if (checkedVenues.has(v.attributes.id) || !hasExternalProvider(v)) processed++;
        });
        return { total, processed };
    }

    function getNextCandidate() {
        if (!W.model || !W.model.venues) return null;
        let venues = W.model.venues.getObjectArray();
        return venues.find(v => {
            // 1. Visible
            if (!v.geometry || !W.map.getExtent().intersectsBounds(v.geometry.getBounds())) return false;
            // 2. Not checked yet
            if (checkedVenues.has(v.attributes.id)) return false;
            // 3. Ignore Residential Places (RPP)
            if (v.attributes.residential) { checkedVenues.add(v.attributes.id); return false; }
            // 4. Ignore places without Google Link
            if (!hasExternalProvider(v)) { checkedVenues.add(v.attributes.id); return false; }
            return true;
        });
    }

    function hasExternalProvider(venue) {
        let p = venue.attributes.externalProviderIDs;
        return p && Array.isArray(p) && p.length > 0;
    }

    // --- COLOR ANALYSIS ---
    function analyzeSidebar() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 15; // 1.5 seconds max wait

            const checkInt = setInterval(() => {
                attempts++;
                const targetDivs = document.querySelectorAll('.external-provider-content');

                if (targetDivs.length > 0) {
                    let foundType = null;
                    let foundColor = null;

                    targetDivs.forEach(div => {
                        const bg = window.getComputedStyle(div).backgroundColor;
                        const rgbMatch = bg.match(/\d+/g);

                        if (rgbMatch && rgbMatch.length >= 3) {
                            const r = parseInt(rgbMatch[0]);
                            const g = parseInt(rgbMatch[1]);
                            const b = parseInt(rgbMatch[2]);

                            // 1. CLOSED (Red/Pink): High Red, Low Green, Low-Med Blue
                            // Ref: rgb(255, 170, 170)
                            if (r > 240 && g > 150 && g < 190 && b > 150) {
                                foundType = 'CLOSED (RED)';
                                foundColor = 'red';
                            }

                            // 2. FAR/MISMATCH (Blue/Cyan): High Green, High Blue
                            // Ref: rgb(224, 255, 255)
                            else if (g > 200 && b > 200 && r < 235) { // r<235 avoids white
                                foundType = 'FAR (BLUE)';
                                foundColor = 'blue';
                            }

                            // 3. CHECK DATA (Yellow): High Red, High Green, Low Blue
                            // Ref: rgb(255, 255, 200)
                            else if (r > 230 && g > 230 && b < 210) {
                                foundType = 'CHECK (YELLOW)';
                                foundColor = '#FFC107';
                            }

                            // 4. ORANGE (Duplicate): High Red, Med Green, LOW Blue -> IGNORE
                            // Ref: rgb(255, 200, 100)
                        }
                    });

                    if (foundType) {
                        clearInterval(checkInt);
                        resolve({ status: 'FOUND', reason: foundType, colorCode: foundColor });
                        return;
                    }

                    // If loaded but neutral color (White or Orange) after 700ms, assume Safe
                    if (attempts > 7) {
                         clearInterval(checkInt);
                         resolve({ status: 'OPEN' });
                         return;
                    }
                }

                if (attempts >= maxAttempts) {
                    clearInterval(checkInt);
                    resolve({ status: 'TIMEOUT' });
                }
            }, 100);
        });
    }

    function highlightSidebarBox(colorName) {
        const targetDivs = document.querySelectorAll('.external-provider-content');
        targetDivs.forEach(div => {
             const bg = window.getComputedStyle(div).backgroundColor;
             // Highlight non-white backgrounds
             if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)') {
                 div.scrollIntoView({ behavior: "smooth", block: "center" });
                 div.style.border = `5px solid ${colorName || 'red'}`;
                 div.style.boxShadow = `0 0 15px ${colorName || 'red'}`;
             }
        });
    }

    bootstrap();
})();