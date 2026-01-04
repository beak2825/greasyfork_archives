// ==UserScript==
// @name         [2026] Freebitco.in Humanized Autoroller
// @namespace    https://greasyfork.org
// @version      4.1
// @description  Humanized autoroller using system clock only (65–80 min base), organic sleep window, loading bars, pending action display, and BTC balance awareness.
// @author       anon
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556795/%5B2026%5D%20Freebitcoin%20Humanized%20Autoroller.user.js
// @updateURL https://update.greasyfork.org/scripts/556795/%5B2026%5D%20Freebitcoin%20Humanized%20Autoroller.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********************************************************************
     *                     CONFIGURATION FLAGS
     ********************************************************************/

    // Master on/off
    let ENABLE_AUTOROLL = true;

    // Enable/disable WoF daily checks
    let ENABLE_WOF = true;

    // Enable/disable RP / Bonus handling
    let ENABLE_BONUS = true;

    // Min/max delay between rolls in minutes (core 65–80 window)
    const MIN_ROLL_DELAY_MIN = 65;
    const MAX_ROLL_DELAY_MIN = 80;

    // Sleep window local time (24h)
    const SLEEP_WINDOW_START_HOUR = 2;  // earliest possible start of sleep window (local)
    const SLEEP_WINDOW_END_HOUR   = 8;  // latest possible end

    // Default sleep block length (when no Free BTC bonus is active)
    const DEFAULT_MIN_SLEEP_HOURS = 4;
    const DEFAULT_MAX_SLEEP_HOURS = 6;

    // Shorter sleep block when Free BTC bonus is active
    const BONUS_MIN_SLEEP_HOURS   = 4;
    const BONUS_MAX_SLEEP_HOURS   = 4.5;

    // Storage keys (localStorage)
    const KEY_LAST_ROLL    = "bos_last_roll_2026";
    const KEY_SLEEP_DAY    = "bos_sleep_day_2026";
    const KEY_SLEEP_START  = "bos_sleep_start_2026";
    const KEY_SLEEP_END    = "bos_sleep_end_2026";
    const KEY_NEXT_ROLL_TS = "bos_next_roll_ts_2026";

    // Simple logging toggle
    const ENABLE_LOG = true;

    /********************************************************************
     *                     STATE VARIABLES
     ********************************************************************/

    let lastRollTimestamp = null;
    let nextRollTimestamp = null;

    let sleepStart = null;
    let sleepEnd   = null;

    let isFirstRun = false;

    // Transient label displayed in panel
    let pendingAction = "Initializing...";

    // Captcha mode bookkeeping
    let captchaMode = "unknown";

    /********************************************************************
     *                     GENERIC HELPERS
     ********************************************************************/

    function log(...args) {
        if (!ENABLE_LOG) return;
        console.log("[2026-Autoroller]", ...args);
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function toMsMinutes(m) {
        return m * 60 * 1000;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function safeGetItem(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            if (value === null || value === 'undefined' || value === 'NaN') {
                return defaultValue;
            }
            return value;
        } catch (e) {
            log("LocalStorage error for key: " + key);
            return defaultValue;
        }
    }

    // Format ms → "xh ym zs"
    function formatTime(ms) {
        if (ms < 0) ms = 0;
        let s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600);
        s -= h * 3600;
        const m = Math.floor(s / 60);
        s -= m * 60;
        return `${h}h ${m}m ${s}s`;
    }

    function formatShort(ms) {
        if (ms < 0) ms = 0;
        const totalMin = Math.round(ms / 60000);
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        if (h <= 0) {
            return `${m}m`;
        }
        return `${h}h ${m}m`;
    }

    function todayString() {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    }

    /********************************************************************
     *                     LOCAL STORAGE LOAD / SAVE
     ********************************************************************/

    function loadLastRollTimestamp() {
        const stored = safeGetItem(KEY_LAST_ROLL, null);
        if (stored !== null) {
            const n = parseInt(stored, 10);
            if (!isNaN(n) && n > 0) {
                lastRollTimestamp = n;
                return;
            }
        }
        // No stored roll → mark as first run
        lastRollTimestamp = null;
        isFirstRun = true;
        log("No previous roll timestamp found. First run.");
    }

    function saveLastRollTimestamp(ts) {
        lastRollTimestamp = ts;
        try {
            localStorage.setItem(KEY_LAST_ROLL, String(ts));
        } catch (e) {
            // ignore
        }
    }

    function loadNextRollTimestamp() {
        const stored = safeGetItem(KEY_NEXT_ROLL_TS, null);
        if (stored !== null) {
            const n = parseInt(stored, 10);
            if (!isNaN(n) && n > 0) {
                nextRollTimestamp = n;
                return;
            }
        }
        nextRollTimestamp = null;
    }

    function saveNextRollTimestamp(ts) {
        nextRollTimestamp = ts;
        try {
            localStorage.setItem(KEY_NEXT_ROLL_TS, String(ts));
        } catch (e) {
            // ignore
        }
    }

    function loadSleepBlock() {
        const today = todayString();
        const storedDay = localStorage.getItem(KEY_SLEEP_DAY);

        if (storedDay === today) {
            const s = parseInt(localStorage.getItem(KEY_SLEEP_START) || "0", 10);
            const e = parseInt(localStorage.getItem(KEY_SLEEP_END) || "0", 10);
            if (!isNaN(s) && !isNaN(e) && e > s) {
                sleepStart = s;
                sleepEnd = e;
                log("Loaded existing sleep block: " +
                    new Date(sleepStart).toLocaleTimeString() + " → " +
                    new Date(sleepEnd).toLocaleTimeString());
                return;
            }
        }

        // Otherwise: compute a new block for today
        pickNewSleepBlock(today);
    }

    /********************************************************************
     *                     SLEEP WINDOW LOGIC
     ********************************************************************/

    function isFreeBtcBonusActive() {
        try {
            const bonusEl = document.querySelector("#fp_multiplier_bonuses_main_div .bonus_span");
            if (!bonusEl) return false;
            const txt = bonusEl.innerText || "";
            // Example text: "1000% FREE BTC BONUS (3h 25m left)"
            return /FREE BTC BONUS/i.test(txt);
        } catch (e) {
            return false;
        }
    }

    function pickNewSleepBlock(today) {
        const bonusActive = isFreeBtcBonusActive();
        const minH = bonusActive ? BONUS_MIN_SLEEP_HOURS : DEFAULT_MIN_SLEEP_HOURS;
        const maxH = bonusActive ? BONUS_MAX_SLEEP_HOURS : DEFAULT_MAX_SLEEP_HOURS;

        const blockMs = rand(minH, maxH) * 60 * 60 * 1000;

        // Add day-to-day variation to sleep window
        const dayOffset = (new Date().getDay() * 7) % 60; // reserved for future use
        const windowStart = SLEEP_WINDOW_START_HOUR + (Math.random() * 0.5 - 0.25); // ±15 min variation
        const windowEnd   = SLEEP_WINDOW_END_HOUR   + (Math.random() * 0.5 - 0.25);

        const maxStartHour = windowEnd - blockMs / (60 * 60 * 1000);
        const startHour = rand(windowStart, Math.max(windowStart, maxStartHour));

        const base = new Date();
        base.setHours(0, 0, 0, 0); // midnight
        const start = new Date(base.getTime());
        const startHourInt = Math.floor(startHour);
        const startMinute  = Math.round((startHour - startHourInt) * 60);
        start.setHours(startHourInt, startMinute, 0, 0);

        sleepStart = start.getTime();
        sleepEnd   = sleepStart + blockMs;

        try {
            localStorage.setItem(KEY_SLEEP_DAY, today);
            localStorage.setItem(KEY_SLEEP_START, String(sleepStart));
            localStorage.setItem(KEY_SLEEP_END, String(sleepEnd));
        } catch (e) {
            // ignore
        }

        log(
            `New sleep block (${bonusActive ? "bonus-mode" : "normal"}): ` +
            new Date(sleepStart).toLocaleTimeString() + " → " +
            new Date(sleepEnd).toLocaleTimeString()
        );
    }

    function isInSleepWindow(nowMs) {
        if (!sleepStart || !sleepEnd) return false;
        return nowMs >= sleepStart && nowMs <= sleepEnd;
    }

    /********************************************************************
     *                     ROLL BUTTON / CAPTCHA HELPERS
     ********************************************************************/

    function isRollButtonReady() {
        const btn = document.querySelector("#free_play_form_button");
        if (!btn || btn.disabled || btn.offsetParent === null) return false;
        return /ROLL/i.test(btn.innerText || "");
    }

    function getCaptchaModeLabel() {
        const hcaptcha = document.querySelector("iframe[src*='hcaptcha.com']");
        const recaptcha = document.querySelector("iframe[src*='recaptcha']");
        if (hcaptcha && recaptcha) return "hCaptcha & reCAPTCHA?";
        if (hcaptcha) return "hCaptcha";
        if (recaptcha) return "reCAPTCHA";
        return "none / auto";
    }

    async function attemptCaptchaSolve() {
        const iframe = document.querySelector("iframe[src*='hcaptcha.com'], iframe[src*='recaptcha']");
        if (!iframe) {
            captchaMode = "none";
            log("No captcha iframe detected; continuing.");
            return true;
        }

        captchaMode = iframe.src.includes("hcaptcha") ? "hCaptcha" : "reCAPTCHA";

        pendingAction = "Captcha present (" + captchaMode + ")";
        log("Captcha iframe detected:", captchaMode);

        // We do NOT auto-solve; we only wait a bit and re-check
        await wait(3500 + Math.random() * 4500);

        const btn = document.querySelector("#free_play_form_button");
        if (btn && !btn.disabled && btn.offsetParent !== null) {
            // Button became enabled → presumably captcha completed manually
            pendingAction = "Captcha solved by user";
            log("Captcha appears solved (button enabled).");
            return true;
        }

        pendingAction = "Captcha still unresolved";
        return false;
    }

    /********************************************************************
     *                     WHEEL OF FORTUNE / BONUS HANDLING
     ********************************************************************/

    async function handleWoF() {
        if (!ENABLE_WOF) return;

        const wofBtn = document.querySelector("#free_wheel_play_btn, #wof_play_btn");
        if (!wofBtn) return;

        pendingAction = "Checking WoF";
        log("WoF button detected; attempting WoF flow...");
        await wait(1200 + Math.random() * 800);

        try {
            wofBtn.click();
            await wait(2000 + Math.random() * 1500);

            const spinBtn = document.querySelector("#wheel_play_btn");
            if (spinBtn) {
                pendingAction = "Spinning WoF";
                spinBtn.click();
                await wait(8000 + Math.random() * 4000);
            }
        } catch (e) {
            log("Error during WoF handling", e);
        } finally {
            const closeBtn = document.querySelector("#wof_close_btn, .wof_close, .close");
            if (closeBtn && closeBtn.click) {
                closeBtn.click();
            }
            await wait(800 + Math.random() * 700);
        }

        // If user has premium WoF link enabled, open it occasionally (low frequency)
        if (Math.random() < 0.2) {
            const premium = document.querySelector(".wof_premium_link");
            if (premium && premium.href) {
                window.open("https://freebitco.in/static/html/wof/wof-premium.html", "_blank");
                await wait(1000 + Math.random() * 1000);
            }
        }
    }

    async function handleBonus() {
        if (!ENABLE_BONUS) return;

        // Don't check every time - ~80% chance to skip
        if (Math.random() > 0.8) {
            return;
        }

        pendingAction = "Checking bonus / RP";

        // Add human-like delay before checking
        await wait(rand(800, 2000));

        const rewardsTab = document.querySelector(".rewards_link");
        if (!rewardsTab) return;

        rewardsTab.click();
        log("Navigating to rewards tab...");
        await wait(1200 + Math.random() * 600);

        const rpEl = document.querySelector(".user_reward_points");
        if (!rpEl) {
            log("Could not read reward points.");
            const freeplay = document.querySelector(".free_play_link");
            if (freeplay) freeplay.click();
            return;
        }

        let rp = parseFloat(rpEl.innerText.replace(/,/g, ""));
        if (isNaN(rp)) rp = 0;

        if (rp >= 4600) {
            const buyBtn = document.querySelector("#fp_bonus_rewards button");
            if (buyBtn) {
                pendingAction = "Buying 1000% Free BTC bonus";
                buyBtn.click();
                log("Attempted to buy 1000% Free BTC bonus.");
                await wait(1800 + Math.random() * 800);
            }
        }

        // Back to free play tab
        const freeplay = document.querySelector(".free_play_link");
        if (freeplay) {
            freeplay.click();
            await wait(400 + Math.random() * 400);
        }
    }

    /********************************************************************
     *                     ROLL FLOW & SCHEDULING
     ********************************************************************/

    function randomPostRollDelayMs() {
        const baseMin = MIN_ROLL_DELAY_MIN;
        const baseMax = MAX_ROLL_DELAY_MIN;

        // 10% chance of "distraction" - longer delay
        if (Math.random() < 0.10) {
            return toMsMinutes(rand(baseMax + 5, baseMax + 20));
        }

        // 5% chance of "eager" - slightly shorter delay (but not too short)
        if (Math.random() < 0.05) {
            const eagerMin = Math.max(baseMin - 3, 10);
            return toMsMinutes(rand(eagerMin, baseMin));
        }

        // Normal-ish distribution around the middle of the base range
        const mid = (baseMin + baseMax) / 2;
        const spread = (baseMax - baseMin) / 2;
        const skew = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;

        return toMsMinutes(mid + (skew * spread * 2));
    }

    function scheduleRandomCheckIn() {
        if (!ENABLE_AUTOROLL) return;

        // Only sometimes schedule a passive check-in (~15% chance)
        if (Math.random() > 0.15) return;

        const checkInDelay = rand(20, 45) * 60 * 1000; // 20–45 minutes

        setTimeout(() => {
            pendingAction = "Random check-in (no action)";
            log("Random check-in - verifying state");

            // Brief "thinking" window before returning to idle
            setTimeout(() => {
                pendingAction = "Waiting for next roll";
            }, rand(2000, 5000));
        }, checkInDelay);
    }

    function scheduleSleepWake() {
        const now = Date.now();
        const delay = sleepEnd - now;
        if (delay <= 0) {
            log("Sleep window ended; re-planning immediately.");
            pendingAction = "Sleep ended; re-planning";
            const today = todayString();
            if (localStorage.getItem(KEY_SLEEP_DAY) !== today) {
                pickNewSleepBlock(today);
            }
            scheduleNextRollOrImmediate();
            return;
        }

        pendingAction = "Sleeping until " +
            new Date(sleepEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        setPhase(now, delay);
        log("Inside sleep block. Will wake in " + formatTime(delay));
        setTimeout(() => {
            const today = todayString();
            if (localStorage.getItem(KEY_SLEEP_DAY) !== today) {
                pickNewSleepBlock(today);
            }
            scheduleNextRollOrImmediate();
        }, delay);
    }

    function scheduleNextRollOrImmediate() {
        const now = Date.now();

        // If sleeping, handle sleep first
        if (isInSleepWindow(now)) {
            scheduleSleepWake();
            return;
        }

        // First run: if button is ready, roll once to sync
        const btnReady = isRollButtonReady();
        if (isFirstRun && btnReady && ENABLE_AUTOROLL) {
            const jitter = 2000 + Math.random() * 3000;
            pendingAction = "Initial roll (first run) in " + formatShort(jitter);
            log("First run and button ready; scheduling initial roll.");
            setPhase(now, jitter);
            setTimeout(executeRollFlow, jitter);
            isFirstRun = false;
            return;
        }

        // If we have a nextRollTimestamp from a previous cycle, check it
        if (!nextRollTimestamp) {
            // If no schedule, create a fresh cycle
            const delay = randomPostRollDelayMs();
            const nextTs = now + delay;
            saveNextRollTimestamp(nextTs);
            setNextBar(now, delay);
            pendingAction = "Next roll in " + formatShort(delay);
            log("No next-roll timestamp; scheduling new cycle: " + formatTime(delay));
            if (ENABLE_AUTOROLL) {
                setPhase(now, delay);
                setTimeout(executeRollFlow, delay);
            }
            return;
        }

        const delta = nextRollTimestamp - now;
        if (!ENABLE_AUTOROLL) {
            pendingAction = "Autoroll paused (has schedule)";
            log("Autoroll disabled; not scheduling roll.");
            return;
        }

        if (delta <= 0) {
            // We are at or past scheduled time
            const jitter = 2000 + Math.random() * 3000;
            pendingAction = "Roll sequence starting";
            log("Next-roll time reached; executing roll soon.");
            setPhase(now, jitter);
            setTimeout(executeRollFlow, jitter);
        } else {
            // Wait until the scheduled time
            pendingAction = "Waiting for next roll";
            log("Next roll in " + formatTime(delta));
            setPhase(now, delta);
            setTimeout(executeRollFlow, delta);
        }
    }

    async function executeRollFlow() {
        if (!ENABLE_AUTOROLL) {
            log("Autoroll disabled; roll flow aborted.");
            pendingAction = "Autoroll paused";
            return;
        }

        const now = Date.now();
        let consecutiveFailures = parseInt(safeGetItem('consecutive_failures', '0') || '0', 10);
        if (isNaN(consecutiveFailures) || consecutiveFailures < 0) {
            consecutiveFailures = 0;
        }

        if (consecutiveFailures > 3) {
            const cooldown = 30 * 60 * 1000 + Math.random() * 30 * 60 * 1000; // 30–60 min
            pendingAction = "Multiple failures - extended cooldown";
            log("Taking extended cooldown after " + consecutiveFailures + " failures");

            localStorage.setItem('consecutive_failures', '0');
            const newNext = Date.now() + cooldown;
            saveNextRollTimestamp(newNext);
            setNextBar(Date.now(), cooldown);
            setPhase(Date.now(), cooldown);
            setTimeout(executeRollFlow, cooldown);
            return;
        }

        if (isInSleepWindow(now)) {
            scheduleSleepWake();
            return;
        }

        const btn = document.querySelector("#free_play_form_button");
        if (!btn || btn.disabled || btn.offsetParent === null) {
            // Button not ready at scheduled time → treat as missed window; create a new 65–80 min cycle
            pendingAction = "Button not ready; new cycle scheduled";
            log("Roll button not ready at scheduled time. Scheduling a fresh 65–80 min cycle.");

            // Count as a failure toward cooldown logic
            consecutiveFailures++;
            try {
                localStorage.setItem('consecutive_failures', String(consecutiveFailures));
            } catch (e) {
                // ignore
            }

            const newDelay = randomPostRollDelayMs();
            const newNext = Date.now() + newDelay;
            saveNextRollTimestamp(newNext);
            setNextBar(Date.now(), newDelay);
            setPhase(Date.now(), newDelay);
            setTimeout(executeRollFlow, newDelay);
            return;
        }

        pendingAction = "Human delay before interactions";
        // Human micro-delay before interacting
        const preDelay = 1500 + Math.random() * 2500;
        setPhase(now, preDelay);
        await wait(preDelay);

        // WoF & bonus handling (with tiny think-time between)
        await handleWoF();
        await wait(600 + Math.random() * 800);
        await handleBonus();

        // Captcha
        pendingAction = "Captcha check";
        if (!(await attemptCaptchaSolve())) {
            // More human-like retry: shorter initial attempts, then backing off
            const attempt = parseInt(safeGetItem('captcha_retry_count', '0') || '0', 10) || 0;
            let retryDelay;

            if (attempt < 2) {
                retryDelay = 5 * 60 * 1000 + Math.random() * 3 * 60 * 1000; // 5–8 min
            } else if (attempt < 4) {
                retryDelay = 10 * 60 * 1000 + Math.random() * 5 * 60 * 1000; // 10–15 min
            } else {
                retryDelay = 15 * 60 * 1000 + Math.random() * 10 * 60 * 1000; // 15–25 min
            }

            try {
                localStorage.setItem('captcha_retry_count', String(attempt + 1));
            } catch (e) {
                // ignore
            }

            const retryTs = Date.now() + retryDelay;
            saveNextRollTimestamp(retryTs);
            setNextBar(Date.now(), retryDelay);
            setPhase(Date.now(), retryDelay);
            pendingAction = "Captcha retry #" + (attempt + 1) + " in ~" + formatShort(retryDelay);
            log("Scheduling captcha retry #" + (attempt + 1) + " in " + formatTime(retryDelay));

            // Count as a failure toward cooldown logic
            consecutiveFailures++;
            try {
                localStorage.setItem('consecutive_failures', String(consecutiveFailures));
            } catch (e) {
                // ignore
            }

            setTimeout(executeRollFlow, retryDelay);
            return;
        }

        // Reset captcha retry counter on success
        try {
            localStorage.setItem('captcha_retry_count', '0');
        } catch (e) {
            // ignore
        }

        // Re-check button after flows
        const btn2 = document.querySelector("#free_play_form_button");
        if (!btn2 || btn2.disabled || btn2.offsetParent === null) {
            // Button disappeared or got disabled → schedule new full cycle

            // Count as a failure toward cooldown logic
            consecutiveFailures++;
            try {
                localStorage.setItem('consecutive_failures', String(consecutiveFailures));
            } catch (e) {
                // ignore
            }

            const newDelay = randomPostRollDelayMs();
            const newNext = Date.now() + newDelay;
            saveNextRollTimestamp(newNext);
            setNextBar(Date.now(), newDelay);
            setPhase(Date.now(), newDelay);
            pendingAction = "Button unavailable; new cycle scheduled";
            log("Roll button disappeared after flows. New 65–80 min cycle.");
            setTimeout(executeRollFlow, newDelay);
            return;
        }

        // Final micro-jitter before click
        pendingAction = "Rolling now...";
        const jitter = 800 + Math.random() * 1500;
        setPhase(Date.now(), jitter);
        await wait(jitter);

        log("Rolling now...");
        btn2.click();
        const rollTime = Date.now();
        saveLastRollTimestamp(rollTime);

        // Wait for result to settle
        pendingAction = "Waiting for roll result";
        const settleDelay = 7000 + Math.random() * 3000;
        setPhase(Date.now(), settleDelay);
        await wait(settleDelay);

        // Schedule next 65–80 min cycle using system clock only
        const delay = randomPostRollDelayMs();
        const nextTs = Date.now() + delay;
        saveNextRollTimestamp(nextTs);
        setNextBar(rollTime, delay);

        // Successful roll: reset failure counter
        try {
            localStorage.setItem('consecutive_failures', '0');
        } catch (e) {
            // ignore
        }

        pendingAction = "Next roll in " + formatShort(delay);
        log("Next cycle scheduled in " + formatTime(delay));

        setPhase(Date.now(), delay);
        setTimeout(executeRollFlow, delay);

        // Schedule a random human-style check-in that doesn't roll
        scheduleRandomCheckIn();
    }

    /********************************************************************
     *                    BTC BALANCE (SAT) DISPLAY
     ********************************************************************/

    function getCurrentBalanceSats() {
        try {
            const balEl = document.querySelector("#balance");
            if (!balEl) return null;
            const txt = (balEl.innerText || "").replace(/,/g, "").trim();
            const btc = parseFloat(txt);
            if (isNaN(btc)) return null;
            return Math.round(btc * 1e8);
        } catch (e) {
            return null;
        }
    }

    /********************************************************************
     *                    PROGRESS BAR PHASES
     ********************************************************************/

    let phaseStartMs = null;
    let phaseDurationMs = null;

    function setPhase(startMs, durationMs) {
        phaseStartMs = startMs;
        phaseDurationMs = durationMs;
    }

    let nextStartMs = null;
    let nextDurationMs = null;

    function setNextBar(startMs, durationMs) {
        nextStartMs = startMs;
        nextDurationMs = durationMs;
    }

    /********************************************************************
     *                    PANEL UI INJECTION
     ********************************************************************/

    function injectPanel() {
        if (document.querySelector("#bos_human_panel")) return;

        const container = document.createElement("div");
        container.id = "bos_human_panel";
        container.innerHTML = `
<div id="bos_human_header">
  <div id="bos_human_title">Humanized Autoroller</div>
  <div id="bos_human_badge">[2026] System-clock only</div>
</div>
<div id="bos_human_body">
  <div class="bos_row">
    <span class="bos_label">Status:</span>
    <span id="bos_status" class="bos_value">Initializing...</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Since last roll:</span>
    <span id="bos_since_last" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Next roll in:</span>
    <span id="bos_next_in" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Pending:</span>
    <span id="bos_pending_label" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Captcha:</span>
    <span id="bos_captcha_label" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Sleep:</span>
    <span id="bos_sleep_label" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">State:</span>
    <span id="bos_state_label" class="bos_value">–</span>
  </div>
  <div class="bos_row">
    <span class="bos_label">Balance:</span>
    <span id="bos_balance_label" class="bos_value">–</span>
  </div>

  <div class="bos_progress_block">
    <div class="bos_progress_label">Current phase</div>
    <div class="bos_progress_outer">
      <div id="bos_progress_bar" class="bos_progress_inner"></div>
    </div>
  </div>

  <div class="bos_progress_block">
    <div class="bos_progress_label">Next roll window</div>
    <div class="bos_progress_outer">
      <div id="bos_next_progress_bar" class="bos_progress_inner bos_next_bar"></div>
    </div>
  </div>

  <div class="bos_toggle_group">
    <label class="bos_toggle">
      <input type="checkbox" id="bos_toggle_autoroll" checked />
      <span>Autoroll</span>
    </label>
    <label class="bos_toggle">
      <input type="checkbox" id="bos_toggle_wof" checked />
      <span>WoF</span>
    </label>
    <label class="bos_toggle">
      <input type="checkbox" id="bos_toggle_bonus" checked />
      <span>Bonus / RP</span>
    </label>
    <button id="bos_skip" type="button">Skip to next roll</button>
  </div>
</div>
`;
        document.body.appendChild(container);

        GM_addStyle(`
#bos_human_panel {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 260px;
  background: rgba(5, 5, 10, 0.93);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #e5f5ff;
  z-index: 999999;
  box-shadow: 0 0 18px rgba(0,0,0,0.7);
  border: 1px solid rgba(120,255,255,0.5);
}
#bos_human_header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:4px;
}
#bos_human_title {
  font-size:14px;
  font-weight:bold;
  letter-spacing:0.04em;
  color:#7cf3ff;
  text-shadow: 0 0 6px rgba(0,255,255,0.6);
}
#bos_human_badge {
  font-size:11px;
  opacity:0.8;
  padding:2px 6px;
  border-radius:999px;
  border:1px solid rgba(124,243,255,0.5);
}
#bos_human_body {
  border-top:1px solid rgba(255,255,255,0.08);
  padding-top:6px;
}
.bos_row {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:4px;
}
.bos_label {
  opacity:0.85;
}
.bos_value {
  font-weight:bold;
}
.bos_progress_block {
  margin-top:6px;
}
.bos_progress_label {
  font-size:11px;
  opacity:0.7;
  margin-bottom:2px;
}
.bos_progress_outer {
  width:100%;
  height:6px;
  background:rgba(255,255,255,0.06);
  border-radius:4px;
  overflow:hidden;
}
.bos_progress_inner {
  height:100%;
  width:0%;
  background:linear-gradient(90deg, #7cf3ff, #4cffc9);
  transition:width 0.25s linear;
}
.bos_next_bar {
  background:linear-gradient(90deg, #ffa64d, #ff5f6b);
}
.bos_toggle_group {
  display:flex;
  gap:6px;
  margin-top:6px;
  flex-wrap:wrap;
}
.bos_toggle {
  display:flex;
  align-items:center;
  gap:4px;
  background:rgba(255,255,255,0.04);
  padding:2px 6px;
  border-radius:999px;
  cursor:pointer;
}
.bos_toggle input {
  margin:0;
}
#bos_skip {
  margin-left:auto;
  font-size:11px;
  padding:2px 8px;
  border-radius:999px;
  border:none;
  cursor:pointer;
  background:rgba(124,243,255,0.12);
  color:#e5f5ff;
}
#bos_skip:hover {
  background:rgba(124,243,255,0.22);
}
`);

        // Attach toggle logic
        const autoToggle = document.querySelector("#bos_toggle_autoroll");
        const wofToggle  = document.querySelector("#bos_toggle_wof");
        const bonusToggle = document.querySelector("#bos_toggle_bonus");
        const skipBtn    = document.querySelector("#bos_skip");

        autoToggle.addEventListener("change", () => {
            ENABLE_AUTOROLL = autoToggle.checked;
            pendingAction = ENABLE_AUTOROLL ? "Autoroll enabled" : "Autoroll paused";
            log("Autoroll set to", ENABLE_AUTOROLL);
            if (ENABLE_AUTOROLL) {
                scheduleNextRollOrImmediate();
            }
        });

        wofToggle.addEventListener("change", () => {
            ENABLE_WOF = wofToggle.checked;
            log("WoF handling set to", ENABLE_WOF);
        });

        bonusToggle.addEventListener("change", () => {
            ENABLE_BONUS = bonusToggle.checked;
            log("Bonus handling set to", ENABLE_BONUS);
        });

        skipBtn.addEventListener("click", () => {
            if (!ENABLE_AUTOROLL) {
                pendingAction = "Skip ignored; autoroll disabled.";
                return;
            }
            // Force immediate roll flow
            const jitter = 1000 + Math.random() * 2000;
            pendingAction = "Manual skip → rolling in " + formatShort(jitter);
            log("Manual skip requested; executing roll flow now (if allowed).");
            setPhase(Date.now(), jitter);
            setTimeout(() => {
                pendingAction = "Manual roll-check triggered";
                executeRollFlow();
            }, jitter);
        });

        syncToggleUI();

        let lastUpdate = 0;
        function smartUpdateUI() {
            const now = Date.now();
            if (now - lastUpdate < 1000) {
                requestAnimationFrame(smartUpdateUI);
                return;
            }

            lastUpdate = now;
            updateUIPanel();
            requestAnimationFrame(smartUpdateUI);
        }

        requestAnimationFrame(smartUpdateUI);
    }

    function syncToggleUI() {
        const autoToggle  = document.querySelector("#bos_toggle_autoroll");
        const wofToggle   = document.querySelector("#bos_toggle_wof");
        const bonusToggle = document.querySelector("#bos_toggle_bonus");
        if (autoToggle) autoToggle.checked = ENABLE_AUTOROLL;
        if (wofToggle) wofToggle.checked   = ENABLE_WOF;
        if (bonusToggle) bonusToggle.checked = ENABLE_BONUS;
    }

    function updateUIPanel() {
        const statusEl  = document.querySelector("#bos_status");
        const sinceEl   = document.querySelector("#bos_since_last");
        const nextInEl  = document.querySelector("#bos_next_in");
        const pendingEl = document.querySelector("#bos_pending_label");
        const captchaEl = document.querySelector("#bos_captcha_label");
        const sleepEl   = document.querySelector("#bos_sleep_label");
        const stateEl   = document.querySelector("#bos_state_label");
        const bonusEl   = document.querySelector("#bos_bonus_label");
        const balEl     = document.querySelector("#bos_balance_label");
        const skipBtn   = document.querySelector("#bos_skip");
        const progBar   = document.querySelector("#bos_progress_bar");
        const nextBar   = document.querySelector("#bos_next_progress_bar");

        if (!statusEl) return;

        if (!ENABLE_AUTOROLL) {
            statusEl.textContent = "PAUSED";
        } else {
            statusEl.textContent = "RUNNING";
        }

        // Since last roll
        const now = Date.now();
        const sinceRollMs = lastRollTimestamp ? (now - lastRollTimestamp) : null;
        const nextInMs    = nextRollTimestamp ? (nextRollTimestamp - now) : null;

        // Captcha mode
        const captchaLabel = getCaptchaModeLabel();

        // Sleep status
        const sleeping = isInSleepWindow(now);
        const sleepLabel = (sleepStart && sleepEnd)
            ? `${new Date(sleepStart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} → ${new Date(sleepEnd).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`
            : "Not set";

        const stateLabel = sleeping
            ? "SLEEPING"
            : (ENABLE_AUTOROLL ? "ACTIVE" : "MANUAL");

        if (sinceRollMs != null) {
            sinceEl.textContent = formatTime(sinceRollMs);
        } else {
            sinceEl.textContent = "No roll yet";
        }

        if (nextInMs != null && nextInMs > 0) {
            nextInEl.textContent = formatTime(nextInMs);
        } else {
            nextInEl.textContent = "Pending";
        }

        pendingEl.textContent = pendingAction || "Idle";
        captchaEl.textContent = captchaLabel;
        sleepEl.textContent   = sleepLabel;
        stateEl.textContent   = stateLabel;

        const balanceSats = getCurrentBalanceSats();
        if (balanceSats == null) {
            balEl.textContent = "—";
        } else {
            const green = balanceSats >= 30000;
            balEl.textContent = (balanceSats.toLocaleString() + " sats");
            if (green) {
                balEl.style.color = "#8bff9c";
            } else {
                balEl.style.color = "";
            }
        }

        // Progress bars
        if (phaseStartMs && phaseDurationMs && phaseDurationMs > 0) {
            const elapsed = now - phaseStartMs;
            let pct = Math.max(0, Math.min(100, (elapsed / phaseDurationMs) * 100));
            progBar.style.width = pct.toFixed(1) + "%";
        } else {
            progBar.style.width = "0%";
        }

        if (nextStartMs && nextDurationMs && nextDurationMs > 0) {
            const elapsed2 = now - nextStartMs;
            let pct2 = Math.max(0, Math.min(100, (elapsed2 / nextDurationMs) * 100));
            nextBar.style.width = pct2.toFixed(1) + "%";
        } else {
            nextBar.style.width = "0%";
        }

        if (skipBtn) {
            skipBtn.disabled = !ENABLE_AUTOROLL;
        }
    }

    /********************************************************************
     *                    INITIALIZATION
     ********************************************************************/

    function init() {
        if (!document.querySelector("#free_play_form_button")) {
            log("Freebitco.in page not ready yet, retrying init...");
            setTimeout(init, 2000 + Math.random() * 1500);
            return;
        }

        log("Initializing Humanized Autoroller [2026]...");

        loadLastRollTimestamp();
        loadNextRollTimestamp();
        loadSleepBlock();
        injectPanel();
        scheduleNextRollOrImmediate();
    }

    // Small delay to let the page boot
    setTimeout(init, 4000 + Math.random() * 3000);
})();

