// ==UserScript==
// @name         EIT Study
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  SRS buttons, redirect to current problem, daily countdown; system-design items behave like LC problems (score/queue/timers) + a mini toast. Adds Q/A image block with locked "Show answer" until countdown hits zero. Removes Easy/Good buttons after time thresholds.
// @author       You
// @license      MIT
// @match        https://leetcode.com/*
// @match        https://*.leetcode.com/*
// @match        https://facebook.com/*
// @match        https://www.facebook.com/*
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtu.be/*
// @match        https://linkedin.com/*
// @match        https://www.linkedin.com/*
// @exclude      https://www.youtube.com/embed/*
// @exclude      https://m.youtube.com/embed/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @resource     hljsCSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css
// @run-at       document-end
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/555463/EIT%20Study.user.js
// @updateURL https://update.greasyfork.org/scripts/555463/EIT%20Study.meta.js
// ==/UserScript==

/* ----------------------------------------------
   Config
---------------------------------------------- */
const DAILY_TIME_LIMIT_SECONDS = 30 * 60; // 30 minutes

/* ----------------------------------------------
   Main
---------------------------------------------- */
if (window.location.hostname.includes('leetcode.com')) {

    /* ----------------------------------------------
       Study items (LC + System Design)
    ---------------------------------------------- */
    let study_items = [];
    let system_design_items = []; // filled during bootstrap
    let srs_items = [];           // filled during bootstrap

    const IMGUR_CLIENT_ID = "d70305e7c3ac5c6";
    const IMGUR_ALBUM_HASH = "IeC17Kq";
    const CACHE_KEY = "eit_study_items_v1";
    const CACHE_TTL_HOURS = 24;

    // Force refresh with Ctrl+Alt+R
    document.addEventListener("keydown", async (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") {
            await GM.setValue(CACHE_KEY, null);
            console.log("[EIT] Cache cleared. Reloading to refetch.");
            location.reload();
        }
    });

    async function main() {
        try {
            const cached = await GM.getValue(CACHE_KEY, null);
            if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_HOURS * 3600 * 1000) {
                unsafeWindow.study_items = Array.isArray(cached.items) ? cached.items : [];
                console.log(`[EIT] Loaded ${unsafeWindow.study_items.length} study items from cache.`);
                return;
            }

            const images = await fetchAlbumImagesV3(IMGUR_ALBUM_HASH, IMGUR_CLIENT_ID);
            const items = buildStudyItems(images);
            study_items = items;
            unsafeWindow.study_items = items;

            await GM.setValue(CACHE_KEY, { timestamp: Date.now(), items });
            console.log(`[EIT] Fetched and cached ${items.length} items from Imgur.`);
        } catch (err) {
            console.error("[EIT] Error in main():", err);
            unsafeWindow.study_items = [];
        }
    }

    function fetchAlbumImagesV3(hash, clientId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.imgur.com/3/album/${hash}/images`,
                headers: { Authorization: `Client-ID ${clientId}` },
                onload: (res) => {
                    try {
                        const json = JSON.parse(res.responseText);
                        console.log("json.data:", json.data);
                        if (json && json.success) resolve(json.data || []);
                        else reject(new Error("Imgur v3 API error"));
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    function buildStudyItems(images) {
        // Normalize name: strip extension, lowercase, collapse separators
        const norm = (s) =>
        (s || "")
        .replace(/\.(png|jpe?g|gif|webp|bmp|svg)$/i, "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

        // Try to parse labels "questionN" / "qN" / "answerN" / "aN" / "ansN"
        const parseLabel = (name) => {
            const q = name.match(/^(?:question|q)(\d+)$/);
            if (q) return { kind: "q", index: Number(q[1]) };
            const a = name.match(/^(?:answer|ans|a)(\d+)$/);
            if (a) return { kind: "a", index: Number(a[1]) };
            return null;
        };

        // Enrich with stable sort keys for fallback pairing
        const enriched = images.map((img, i) => ({
            idx: i,
            dt: typeof img.datetime === "number" ? img.datetime : 0,
            name: norm(img.title || img.name || ""),
            link: img.link,
        }));

        // 1) Labeled pairing
        const bucket = new Map(); // index -> { q?:link, a?:link }
        const unlabeled = [];
        for (const it of enriched) {
            if (!it.name) {
                unlabeled.push(it);
                continue;
            }
            const meta = parseLabel(it.name);
            if (!meta) {
                unlabeled.push(it);
                continue;
            }
            if (!bucket.has(meta.index)) bucket.set(meta.index, {});
            const entry = bucket.get(meta.index);
            if (meta.kind === "q" && !entry.q) entry.q = it.link;
            if (meta.kind === "a" && !entry.a) entry.a = it.link;
        }

        const items = [];
        let labeledPairs = 0;
        const used = new Set();

        // Consume labeled pairs first
        const labeledIdx = Array.from(bucket.keys()).sort((a, b) => a - b);
        for (const n of labeledIdx) {
            const { q, a } = bucket.get(n);
            if (q && a) {
                items.push({
                    type: "eit-study",
                    question: q,
                    answer: a,
                    playground: "https://leetcode.com/playground/3Du5jhPL",
                    difficulty: "Medium",
                });
                labeledPairs++;
                used.add(q);
                used.add(a);
            }
        }

        // 2) Fallback: order-based pairing for everything not used above
        const leftovers = enriched
        .filter((it) => !used.has(it.link))
        .sort((a, b) => (a.dt - b.dt) || (a.idx - b.idx));

        let orderPairs = 0;
        for (let i = 0; i + 1 < leftovers.length; i += 2) {
            items.push({
                type: "eit-study",
                question: leftovers[i].link,
                answer: leftovers[i + 1].link,
                playground: "https://leetcode.com/playground/3Du5jhPL",
                difficulty: "Medium",
            });
            orderPairs++;
        }

        console.log(
            `[EIT] buildStudyItems — labeled pairs: ${labeledPairs}, order-based pairs: ${orderPairs}, total: ${items.length}`
        );

        return items;
    }

    // --- NEW: wait helper to ensure study_items are ready before using them
    async function waitForStudyItems(timeoutMs = 8000, pollMs = 50) {
        const start = Date.now();
        while (true) {
            const arr = unsafeWindow.study_items;
            if (Array.isArray(arr) && arr.length > 0) return arr;
            if (Date.now() - start > timeoutMs) return Array.isArray(arr) ? arr : [];
            await new Promise(r => setTimeout(r, pollMs));
        }
    }

    /* ----------------------------------------------
       Timer globals
    ---------------------------------------------- */
    let remainingTimeToday = DAILY_TIME_LIMIT_SECONDS;
    let timerIntervalId = null;
    let timerDisplayElement = null;
    let isPageVisible = true;
    let isWindowFocused = true;

    // For Easy/Good button visibility logic
    let mainDetailsElement = null;
    let easyButton = null;
    let goodButton = null;

    // Per-item timing and UI refs (PERSISTED)
    let perQuestionSpentSeconds = 0;
    let perQuestionTargetSeconds = 7 * 60; // default Medium; SD will override
    let solutionCountdownEl = null;
    let difficultyBadgeEl = null;
    let currentKeyCached = null;

    // Q/A UI refs (system-design)
    let currentSDItem = null;
    let questionImgEl = null;
    let answerImgEl = null;
    let showAnswerBtn = null;

    /* ----------------------------------------------
       Utility / Timer functions
    ---------------------------------------------- */
    function updateEasyButtonVisibility() {
        if (!easyButton) return;
        if (!isWindowFocused || window.location.pathname.includes('/submissions/')) {
            easyButton.style.display = 'none';
        } else {
            // default visible
        }
    }

    function getDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    }

    function formatTime(totalSeconds) {
        if (totalSeconds < 0) totalSeconds = 0;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
    }

    function formatMinSec(totalSeconds) {
        if (totalSeconds < 0) totalSeconds = 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return [minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
    }

    // ---------- Per-item persistence (localStorage) ----------
    function pq_getMap() {
        try {
            return JSON.parse(localStorage.getItem('lc_perQuestionTimers') || '{}');
        } catch {
            return {};
        }
    }

    function pq_saveMap(map) {
        localStorage.setItem('lc_perQuestionTimers', JSON.stringify(map));
    }

    function pq_load(key) {
        const map = pq_getMap();
        return map[key] || null;
    }

    function pq_save(key, spent, target) {
        const map = pq_getMap();
        map[key] = {
            spent: Number(spent) || 0,
            target: Number(target) || 0
        };
        pq_saveMap(map);
    }

    function pq_reset(key) {
        const map = pq_getMap();
        delete map[key];
        pq_saveMap(map);
    }

    // ---------- Daily timer (GM.* cross-domain) ----------
    async function loadAndResetDailyTimer() {
        const today = getDateString();
        const lastDate = await GM.getValue('leetcodeTimer_lastDate', null);
        let savedRemainingTime = parseInt(await GM.getValue('leetcodeTimer_remainingTime', '0'), 10);

        if (lastDate !== today) {
            remainingTimeToday = DAILY_TIME_LIMIT_SECONDS;
            await GM.setValue('leetcodeTimer_lastDate', today);
            await GM.setValue('leetcodeTimer_remainingTime', remainingTimeToday.toString());
        } else {
            remainingTimeToday = Math.min(isNaN(savedRemainingTime) ? 0 : savedRemainingTime, DAILY_TIME_LIMIT_SECONDS);
            if (remainingTimeToday < 0) remainingTimeToday = 0;
        }
    }

    async function saveTimerProgress() {
        await GM.setValue('leetcodeTimer_remainingTime', remainingTimeToday.toString());
    }

    function updateTimerDisplay() {
        if (!timerDisplayElement) return;
        if (remainingTimeToday <= 0) {
            timerDisplayElement.innerText = "Time's up!";
            timerDisplayElement.style.color = 'green';
        } else {
            timerDisplayElement.innerText = `${formatTime(remainingTimeToday)}`;
            timerDisplayElement.style.color = '#aed6f1';
        }
    }

    function refreshShowAnswerButton() {
        if (!showAnswerBtn) return;
        const remaining = Math.max(perQuestionTargetSeconds - perQuestionSpentSeconds, 0);
        if (remaining > 0) {
            showAnswerBtn.disabled = true;
            showAnswerBtn.textContent = `Show answer (locked ${formatMinSec(remaining)})`;
            showAnswerBtn.style.cursor = 'not-allowed';
            showAnswerBtn.style.opacity = '0.6';
        } else {
            showAnswerBtn.disabled = false;
            showAnswerBtn.textContent = 'Show answer';
            showAnswerBtn.style.cursor = 'pointer';
            showAnswerBtn.style.opacity = '1';
        }
    }

    function updatePerQuestionDisplays() {
        const remaining = Math.max(perQuestionTargetSeconds - perQuestionSpentSeconds, 0);

        if (solutionCountdownEl) {
            if (remaining > 0) {
                solutionCountdownEl.style.color = '#ffda79';
            } else {
                solutionCountdownEl.innerText = `You can check the solution now 🎉`;
                solutionCountdownEl.style.color = '#8aff8a';
            }
        }

        refreshShowAnswerButton();
    }

    function getCurrentKey() {
        const parts = window.location.pathname.split('/');
        const idx = parts.indexOf('problems');
        if (idx !== -1) {
            return parts[idx + 1]; // LC slug
        }
        const m = window.location.pathname.match(/^\/playground\/([^\/?#]+)/);
        if (m) return `sd:${m[1]}`;
        return null;
    }

    function detectDifficultyAndTarget() {
        // Defaults
        let difficulty = 'Medium';
        let target = 7 * 60;
        const pathname = window.location.pathname;

        // --- System Design playgrounds: derive difficulty from your study list ---
        if (/^\/playground\//.test(pathname)) {
            const m = pathname.match(/^\/playground\/([^\/?#]+)/);
            const pgId = m ? m[1] : null;

            // Find matching SD item by playground id
            const sdItem = pgId ?
                  (system_design_items || []).find(sd => (sd.playground || '').includes(pgId)) :
            null;

            // Use the item's difficulty if present; default to Easy
            difficulty = (sdItem && sdItem.difficulty) ? sdItem.difficulty : 'Easy';
        } else {
            // --- Regular LeetCode problem pages ---
            try {
                const diffEl = document.querySelector('[class*="text-difficulty-"], .text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
                const txt = (diffEl?.textContent || '').trim();
                if (/easy/i.test(txt)) difficulty = 'Easy';
                else if (/hard/i.test(txt)) difficulty = 'Hard';
                else if (/medium/i.test(txt)) difficulty = 'Medium';
                else {
                    const cls = diffEl?.className || '';
                    if (/text-difficulty-easy/i.test(cls)) difficulty = 'Easy';
                    else if (/text-difficulty-hard/i.test(cls)) difficulty = 'Hard';
                    else if (/text-difficulty-medium/i.test(cls)) difficulty = 'Medium';
                }
            } catch (_) { /* noop */ }
        }
        console.log("difficulty:", difficulty)

        // Target mapping
        if (difficulty === 'Easy') target = 5 * 60;

        else if (difficulty === 'Medium') target = 7 * 60;
        else if (difficulty === 'Hard') target = 10 * 60;

        // Prefer stored values for this key if present
        const key = getCurrentKey();
        const stored = key ? pq_load(key) : null;

        perQuestionTargetSeconds = (stored?.target > 0) ? stored.target : target;
        perQuestionSpentSeconds = (stored?.spent > 0) ? stored.spent : 0;

        if (difficultyBadgeEl) {
            difficultyBadgeEl.textContent = difficulty; // e.g., "Easy", "Medium", "Hard"
            difficultyBadgeEl.className = `relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary ${
                difficulty === 'Easy' ? 'text-difficulty-easy' :
            difficulty === 'Hard' ? 'text-difficulty-hard' :
            'text-difficulty-medium'
        }`;
        }
    }

    function shouldCountDown() {
        return isPageVisible && isWindowFocused;
    }

    /** Remove Easy/Good once time thresholds are crossed. */
    function timeBasedButtonPruning() {
        if (perQuestionSpentSeconds > perQuestionTargetSeconds && easyButton) {
            if (easyButton.parentElement) easyButton.parentElement.removeChild(easyButton);
            easyButton = null;
        }
        if (perQuestionSpentSeconds >= (2 * perQuestionTargetSeconds) && goodButton) {
            if (goodButton.parentElement) goodButton.parentElement.removeChild(goodButton);
            goodButton = null;
        }
    }

    function startDailyTimer() {
        if (timerIntervalId) clearInterval(timerIntervalId);

        timerIntervalId = setInterval(() => {
            if (shouldCountDown()) {
                perQuestionSpentSeconds++;

                if (currentKeyCached) {
                    pq_save(currentKeyCached, perQuestionSpentSeconds, perQuestionTargetSeconds);
                }

                if (remainingTimeToday > 0) {
                    remainingTimeToday--;
                    void saveTimerProgress();
                }
            }

            timeBasedButtonPruning();
            updateTimerDisplay();
            updatePerQuestionDisplays();
        }, 1000);
    }

    /* ----------------------------------------------
       Visibility/Focus events
    ---------------------------------------------- */
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
        updateEasyButtonVisibility();
    });

    window.addEventListener('focus', () => {
        isWindowFocused = true;
        updateEasyButtonVisibility();
    });

    window.addEventListener('blur', () => {
        isWindowFocused = false;
        updateEasyButtonVisibility();
    });

    /* ----------------------------------------------
       SRS (Again/Good/Easy) config
    ---------------------------------------------- */
    const BUTTONS = ['Again', 'Good', 'Easy'];
    const BUTTON_COLORS = { 'Again': 'red', 'Good': 'orange', 'Easy': 'green' };
    const moveSteps = { 'Again': 1, 'Good': 3, 'Easy': 5 };
    const BASE_WINDOW = 10;
    const EASY_THRESHOLD = 2;
    const EASY_COMPLETION = 3; // weighted target: Easy=1, Good=0.5

    function loadProgress() {
        return JSON.parse(localStorage.getItem('leetcodeSR') || '{}');
    }

    function saveProgress(key, status) {
        const progress = loadProgress();
        progress[key] = progress[key] || [];
        progress[key].push(status);
        localStorage.setItem('leetcodeSR', JSON.stringify(progress));
    }

    function calculateCompletionScore(key) {
        const progress = loadProgress();
        const statuses = progress[key] || [];
        let score = 0;
        for (const status of statuses) {
            if (status === 'Easy') score += 1;
            else if (status === 'Good') score += 0.5;
        }
        return score;
    }

    function isCompleted(key) {
        return calculateCompletionScore(key) >= EASY_COMPLETION;
    }

    function getWindowSize() {
        const progress = loadProgress();
        let windowSize = BASE_WINDOW;

        const firstWindowKeys = srs_items
        .slice(0, windowSize)
        .map(it => it.key)
        .filter(key => !isCompleted(key));

        const easyCount = firstWindowKeys.reduce((acc, key) => {
            return acc + (progress[key]?.filter(s => s === 'Easy').length || 0);
        }, 0);

        if (easyCount >= EASY_THRESHOLD) windowSize += 2;
        return Math.min(windowSize, srs_items.length);
    }

    function goToNextProblem(buttonType) {
        const key = getCurrentKey();
        if (!key) return;

        // 1) Record SRS status
        saveProgress(key, buttonType);

        // 2) Reset Solution Unlock for THIS key immediately
        perQuestionSpentSeconds = 0;
        pq_save(key, 0, perQuestionTargetSeconds);
        updatePerQuestionDisplays();

        // 3) Queue/cooldown + navigate logic
        localStorage.setItem('leetcodeCurrent', window.location.href);
        const remainingItems = srs_items.filter(it => !isCompleted(it.key));

        let queue = JSON.parse(localStorage.getItem('leetcodeQueue') || '[]');
        const steps = moveSteps[buttonType] || 1;
        queue.push({ key, cooldown: steps });
        localStorage.setItem('leetcodeQueue', JSON.stringify(queue));

        queue = queue
            .map(item => ({ ...item, cooldown: item.cooldown - 1 }))
            .filter(item => item.cooldown > 0);
        localStorage.setItem('leetcodeQueue', JSON.stringify(queue));

        let nextItem = null;
        for (const it of remainingItems) {
            if (!queue.some(item => item.key === it.key)) {
                nextItem = it;
                break;
            }
        }

        if (!nextItem) {
            alert('All items completed or cooling down!');
            return;
        }

        localStorage.setItem('leetcodeCurrent', nextItem.nav);
        window.location.href = nextItem.nav;
    }

    /* ------------------------------------------
       Q/A Section (for System-Design items)
    ------------------------------------------ */
    function buildQASection(container, item) {
        if (!item || !item.question) return;

        const qaWrap = document.createElement('div');
        qaWrap.style.marginTop = '10px';
        qaWrap.style.textAlign = 'center';

        // Question image
        questionImgEl = document.createElement('img');
        questionImgEl.src = item.question;
        questionImgEl.alt = 'Question';
        questionImgEl.style.width = '35vw';
        questionImgEl.style.maxWidth = 'none';
        questionImgEl.style.borderRadius = '8px';
        questionImgEl.style.display = 'block';
        questionImgEl.style.margin = '0 auto 10px';

        // "Show answer" button (locked by countdown)
        showAnswerBtn = document.createElement('button');
        showAnswerBtn.textContent = 'Show answer (locked)';
        showAnswerBtn.disabled = true;
        Object.assign(showAnswerBtn.style, {
            background: 'transparent',
            color: '#8aff8a',
            border: '2px solid #8aff8a',
            borderRadius: '6px',
            padding: '8px 14px',
            cursor: 'not-allowed',
            opacity: '0.6',
            fontWeight: 'bold',
            marginBottom: '10px'
        });

        // Answer image (hidden until unlocked & clicked)
        answerImgEl = document.createElement('img');
        answerImgEl.src = item.answer || '';
        answerImgEl.alt = 'Answer';
        answerImgEl.style.maxWidth = '520px';
        answerImgEl.style.width = '100%';
        answerImgEl.style.borderRadius = '8px';
        answerImgEl.style.display = 'none';
        answerImgEl.style.margin = '10px auto 0';

        showAnswerBtn.addEventListener('click', () => {
            if (showAnswerBtn.disabled) return;
            if (answerImgEl.src) {
                answerImgEl.style.display = 'block';
                answerImgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        qaWrap.appendChild(questionImgEl);
        qaWrap.appendChild(showAnswerBtn);
        qaWrap.appendChild(answerImgEl);
        container.appendChild(qaWrap);

        refreshShowAnswerButton();
    }

    /* ------------------------------------------
       UI: container + progress + buttons
    ------------------------------------------ */
    function createUI() {
        const container = document.createElement('div');
        container.id = 'lc-srs-container';
        container.style.position = 'fixed';
        container.style.top = '5%';
        container.style.left = '5%';
        container.style.width = '90%';
        container.style.height = '90%';
        container.style.background = 'rgba(30, 30, 30, 0.95)';

        // Daily timer display
        timerDisplayElement = document.createElement('div');
        timerDisplayElement.style.marginBottom = '8px';
        timerDisplayElement.style.fontWeight = 'bold';
        timerDisplayElement.style.fontSize = '16px';
        timerDisplayElement.style.color = '#aed6f1';
        timerDisplayElement.style.textAlign = 'center';
        container.appendChild(timerDisplayElement);

        // Difficulty badge
        difficultyBadgeEl = document.createElement('div');
        difficultyBadgeEl.className = `
  relative inline-flex items-center justify-center
  text-caption px-2 py-1 gap-1 rounded-full
  bg-fill-secondary text-difficulty-medium dark:text-difficulty-medium
  mx-auto my-1
`;
        difficultyBadgeEl.style.display = 'block';
        difficultyBadgeEl.style.margin = '4px auto';
        difficultyBadgeEl.style.width = 'fit-content';
        difficultyBadgeEl.textContent = 'Medium';
        container.appendChild(difficultyBadgeEl);

        // Solution countdown
        solutionCountdownEl = document.createElement('div');
        solutionCountdownEl.style.marginBottom = '10px';
        solutionCountdownEl.style.fontSize = '14px';
        solutionCountdownEl.style.textAlign = 'center';
        solutionCountdownEl.style.color = '#ffda79';
        container.appendChild(solutionCountdownEl);

        // Overall progress
        const progressText = document.createElement('div');
        progressText.style.marginBottom = '8px';
        progressText.style.fontWeight = 'bold';
        progressText.style.fontSize = '16px';
        progressText.style.color = '#eee';
        progressText.style.textAlign = 'center';
        container.appendChild(progressText);

        // Current item progress
        const individualProgressText = document.createElement('div');
        individualProgressText.style.marginBottom = '15px';
        individualProgressText.style.fontSize = '14px';
        individualProgressText.style.color = '#bbb';
        individualProgressText.style.textAlign = 'center';
        container.appendChild(individualProgressText);

        // If we're on a system-design item with images, build Q/A UI above buttons
        if (currentSDItem && currentSDItem.question) {
            buildQASection(container, currentSDItem);
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        container.appendChild(buttonContainer);

        function updateCompletion() {
            const progress = loadProgress();
            const allKeys = srs_items.map(it => it.key);
            const completed = allKeys.filter(key => isCompleted(key)).length;
            const total = allKeys.length;
            const percentOverall = Math.round((completed / total) * 100);
            progressText.innerText = `Overall Progress: ${completed}/${total} (${percentOverall}%)`;

            const currentKey = getCurrentKey();
            if (currentKey) {
                const currentScore = calculateCompletionScore(currentKey);
                const percentCurrent = Math.round((currentScore / 3) * 100);
                individualProgressText.innerText = `Current Item: ${currentScore.toFixed(1)}/3 (${percentCurrent}%)`;
                individualProgressText.style.color = currentScore >= 3 ? '#8aff8a' : '#bbb';
            }
        }

        BUTTONS.forEach(btn => {
            const b = document.createElement('button');
            b.innerText = btn;
            b.style.margin = '0 7px';
            b.style.color = BUTTON_COLORS[btn];
            b.style.fontWeight = 'bold';
            b.style.background = 'transparent';
            b.style.border = `2px solid ${BUTTON_COLORS[btn]}`;
            b.style.borderRadius = '5px';
            b.style.padding = '8px 15px';
            b.style.cursor = 'pointer';
            b.style.transition = 'all 0.2s ease';
            b.style.fontSize = '14px';

            b.onmouseover = () => { b.style.background = BUTTON_COLORS[btn]; b.style.color = 'white'; };
            b.onmouseout  = () => { b.style.background = 'transparent';      b.style.color = BUTTON_COLORS[btn]; };

            b.onclick = () => { goToNextProblem(btn); updateCompletion(); };

            if (btn === 'Easy') easyButton = b;
            if (btn === 'Good') goodButton = b;

            buttonContainer.appendChild(b);
        });

        document.body.appendChild(container);

        // Initialize difficulty/targets from page, then seed storage for this key if needed
        detectDifficultyAndTarget();
        if (currentKeyCached) {
            const existing = pq_load(currentKeyCached);
            if (!existing) pq_save(currentKeyCached, perQuestionSpentSeconds, perQuestionTargetSeconds);
        }
        updatePerQuestionDisplays();
        updateCompletion();

        // Enforce time-based removal on initial render
        timeBasedButtonPruning();
    }

    /* ------------------------------------------
       "Accepted" Centering (still LC-only)
    ------------------------------------------ */
    let overlayEl = null;

    function ensureSrsStyles() {
        if (document.getElementById('lc-srs-styles')) return;
        const style = document.createElement('style');
        style.id = 'lc-srs-styles';
        style.textContent = `
      #lc-srs-container.lc-centered {
        min-width: 380px !important;
        padding: 28px !important;
        border-radius: 14px !important;
        box-shadow: 0 12px 48px rgba(0,0,0,0.7) !important;
        background: rgba(30, 30, 30, 0.85) !important;
        transform: translate(-50%, -50%) scale(1.2) !important;
      }
      #lc-srs-container.lc-centered div {
        font-size: 18px !important;
      }
      #lc-srs-container.lc-centered button {
        font-size: 20px !important;
        padding: 16px 32px !important;
        border-width: 3px !important;
        border-radius: 10px !important;
        min-width: 110px !important;
        font-weight: 700 !important;
        letter-spacing: 0.6px !important;
        transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease !important;
      }
    `;
        document.head.appendChild(style);
    }

    /* ------------------------------------------
       BOOTSTRAP (wait for study_items, then derive lists, then start)
    ------------------------------------------ */
    (async () => {
        try {
            await main(); // populate unsafeWindow.study_items (from cache or Imgur)
        } catch (e) {
            console.error("[EIT] main() error; continuing with empty items.", e);
            unsafeWindow.study_items = [];
        }

        // Wait until non-empty or timeout (still proceed gracefully on timeout)
        const items = await waitForStudyItems(8000);
        study_items = items; // keep local in sync

        // --- Build derived collections only now ---
        const leetcode_links = study_items.filter(i => i.type === 'leetcode').map(i => i.url);

        system_design_items = study_items.filter(i => i.type === 'system-design' || i.type === 'eit-study');

        // Back-compat alias: reference -> url
        system_design_items.forEach(i => { if (!i.reference) i.reference = i.url; });
        system_design_items.forEach((item, idx) => {
            if (item.playground && !/\d+$/.test(item.playground)) {
                item.playground = `${item.playground}${idx + 1}`;
            }
        });

        // Helper to extract playground id
        function getPlaygroundId(u) {
            const m = (u || '').match(/\/playground\/([^\/?#]+)/);
            return m ? m[1] : null;
        }

        srs_items = [
            ...study_items
            .filter(i => i.type === 'leetcode')
            .map(i => ({
                key: i.url.split('/').slice(-2, -1)[0], // slug
                nav: i.url,
                kind: 'leetcode',
                title: i.title
            })),
            ...system_design_items
            .filter(i => i.playground)
            .map(i => {
                const pid = getPlaygroundId(i.playground);
                return {
                    key: pid ? `sd:${pid}` : `sd:${i.playground}`,
                    nav: i.playground,
                    kind: 'system-design',
                    title: i.title,
                    url: i.url,            // for toast
                    question: i.question,  // question image
                    answer: i.answer,      // answer image
                    difficulty: i.difficulty
                };
            })
        ];

        // --- Page bootstrap (unchanged logic, but runs AFTER lists exist) ---
        if (window.location.pathname === '/') {
            const current = localStorage.getItem('leetcodeCurrent');
            if (current) window.location.href = current;

        } else if (window.location.pathname.includes('/problems/')) {
            // Save current item whenever you're on one
            localStorage.setItem('leetcodeCurrent', window.location.href);

            // Track key; do NOT reset per-item timer on navigation/refresh
            const key = getCurrentKey();
            if (key !== currentKeyCached) {
                currentKeyCached = key;
                const stored = pq_load(key);
                if (stored) {
                    perQuestionSpentSeconds = stored.spent || 0;
                    if (stored.target > 0) perQuestionTargetSeconds = stored.target;
                } else {
                    perQuestionSpentSeconds = 0;
                }
            }

            // Not an SD item on problem pages
            currentSDItem = null;

            // Build UI
            createUI();

            // Optional helper UI, if available
            if (typeof createPythonTipsUI === 'function') {
                try { createPythonTipsUI(); } catch (_) {}
            }

            // Timer init
            loadAndResetDailyTimer();
            updateTimerDisplay();

            // Ensure difficulty read after DOM settles
            setTimeout(() => {
                detectDifficultyAndTarget();
                // Ensure storage is seeded after final target detection
                if (currentKeyCached && !pq_load(currentKeyCached)) {
                    pq_save(currentKeyCached, perQuestionSpentSeconds, perQuestionTargetSeconds);
                }
                updatePerQuestionDisplays();
                timeBasedButtonPruning();
            }, 800);

            startDailyTimer();

            // Persist both daily and per-item timers on unload
            window.addEventListener('beforeunload', () => {
                if (currentKeyCached) {
                    pq_save(currentKeyCached, perQuestionSpentSeconds, perQuestionTargetSeconds);
                }
            });
            window.addEventListener('beforeunload', saveTimerProgress);

            // Hook elements for Easy button visibility
            const allSummariesInDocument = document.querySelectorAll('summary');
            for (const summaryEl of allSummariesInDocument) {
                if (summaryEl.innerText.trim() === 'Common Python Methods & Templates') {
                    mainDetailsElement = summaryEl.parentElement;
                    break;
                }
            }
            easyButton = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Easy');

            if (mainDetailsElement && easyButton) {
                mainDetailsElement.addEventListener('toggle', updateEasyButtonVisibility);
            }
            updateEasyButtonVisibility();

        } else if (window.location.pathname.startsWith('/playground/')) {
            // Track key; do NOT reset per-item timer on navigation/refresh
            const key = getCurrentKey();
            if (key !== currentKeyCached) {
                currentKeyCached = key;
                const stored = pq_load(key);
                if (stored) {
                    perQuestionSpentSeconds = stored.spent || 0;
                    if (stored.target > 0) perQuestionTargetSeconds = stored.target;
                } else {
                    perQuestionSpentSeconds = 0;
                }
            }

            // Identify the matching System Design item first (so UI can render Q/A)
            const m = location.pathname.match(/^\/playground\/([^\/?#]+)/);
            const pgId = m ? m[1] : null;
            currentSDItem = null;
            if (pgId) {
                const item = srs_items.find(i => i.kind === 'system-design' && i.key === `sd:${pgId}`);
                if (item) {
                    const full = system_design_items.find(sd => (sd.playground || '').includes(pgId)) || {};
                    currentSDItem = {
                        ...item,
                        title: full.title || item.title,
                        topic: full.topic || '',
                        url: full.url || item.url
                    };
                }
            }

            // Build UI (aware of currentSDItem -> Q/A section)
            createUI();
            loadAndResetDailyTimer();
            updateTimerDisplay();

            // After DOM settles, set SD defaults and seed storage
            setTimeout(() => {
                detectDifficultyAndTarget();
                if (currentKeyCached && !pq_load(currentKeyCached)) {
                    pq_save(currentKeyCached, perQuestionSpentSeconds, perQuestionTargetSeconds);
                }
                updatePerQuestionDisplays();
                timeBasedButtonPruning();
            }, 300);

            startDailyTimer();
        }
    })();

} else {
    /* ----------------------------------------------
       Distraction Redirect (Facebook, YouTube, LinkedIn)
       - run only in top-level window to avoid firing inside embedded iframes
    ---------------------------------------------- */
    (async function handleDistractionRedirect() {
        if (window.top !== window.self) return;
        const distractions = ['facebook.com', 'youtube.com', 'linkedin.com'];
        const onDistractionSite = distractions.some(domain => window.location.hostname.includes(domain));
        if (onDistractionSite) {
            // Ensure the daily timer is reset when a new day starts (cross-domain)
            const today = (() => {
                const now = new Date();
                return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            })();

            const lastDate = await GM.getValue('leetcodeTimer_lastDate', null);
            if (lastDate !== today) {
                await GM.setValue('leetcodeTimer_lastDate', today);
                await GM.setValue('leetcodeTimer_remainingTime', String(DAILY_TIME_LIMIT_SECONDS));
            }

            // Using GM storage so state is shared across domains
            const remainingTime = parseInt(await GM.getValue('leetcodeTimer_remainingTime', '0'), 10);
            const leetcodeDomain = 'leetcode.com';

            // If user still has LeetCode time left, redirect back
            if (remainingTime > 0 && (!window.location.hostname.includes(leetcodeDomain))) {
                const message = document.createElement('div');
                message.textContent = "⏰ Redirecting you to LeetCode...";
                Object.assign(message.style, {
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#333',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    opacity: '0',
                    transition: 'opacity 0.5s ease'
                });

                document.body.appendChild(message);
                requestAnimationFrame(() => { message.style.opacity = '1'; });

                setTimeout(() => {
                    window.location.href = 'https://leetcode.com';
                }, 500);
            }
        }
    })();
}
