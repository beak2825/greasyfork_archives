// ==UserScript==
// @name         DuoHacker Duolingo Cheat
// @description  DuoHacker is the Best-Free-Powerful Duolingo cheat with Fast Farming XP and Gems , High Farming streaks.
// @namespace    https://twisk.fun
// @version      1.0.2
// @author       mintdevs
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://github.com/helloticc/DuoHacker/blob/main/DuoHacker.png?raw=true
// @grant        none
// @license      MIT
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/561041/DuoHacker%20Duolingo%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/561041/DuoHacker%20Duolingo%20Cheat.meta.js
// ==/UserScript==
const VERSION = "1.0.1";
const SAFE_DELAY = 2000;
const FAST_DELAY = 300;
let jwt, defaultHeaders, userInfo, sub;
let isRunning = false;
let currentMode = 'safe';
let currentTheme = 'dark';
let totalEarned = {
    xp: 0,
    gems: 0,
    streak: 0,
    lessons: 0
};
let farmingStats = {
    sessions: 0,
    errors: 0,
    startTime: null
};
let farmingInterval = null;
const getJwtToken = () => {
    let match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
    if (match) {
        return match[2];
    }
    return null;
};
const decodeJwtToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
};
const formatHeaders = (jwt) => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + jwt,
    "User-Agent": navigator.userAgent,
});
const getUserInfo = async (sub) => {
    const userInfoUrl = `https://www.duolingo.com/2023-05-23/users/${sub}?fields=id,username,fromLanguage,learningLanguage,streak,totalXp,level,numFollowers,numFollowing,gems,creationDate,streakData,picture,hasPlus`;
    const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: defaultHeaders,
    });
    return await response.json();
};
const sendRequestWithDefaultHeaders = async ({
    url,
    payload,
    headers = {},
    method = "GET"
}) => {
    const mergedHeaders = {
        ...defaultHeaders,
        ...headers
    };
    return await fetch(url, {
        method,
        headers: mergedHeaders,
        body: payload ? JSON.stringify(payload) : undefined,
    });
};
const farmXpOnce = async () => {
    const startTime = Math.floor(Date.now() / 1000);
    const fromLanguage = userInfo.fromLanguage;
    const completeUrl = `https://stories.duolingo.com/api2/stories/en-${fromLanguage}-the-passport/complete`;
    const payload = {
        awardXp: true,
        isFeaturedStoryInPracticeHub: false,
        completedBonusChallenge: true,
        mode: "READ",
        isV2Redo: false,
        isV2Story: false,
        isLegendaryMode: true,
        masterVersion: false,
        maxScore: 0,
        numHintsUsed: 0,
        score: 0,
        startTime: startTime,
        fromLanguage: fromLanguage,
        learningLanguage: "en",
        hasXpBoost: false,
        happyHourBonusXp: 449,
    };
    return await sendRequestWithDefaultHeaders({
        url: completeUrl,
        payload: payload,
        method: "POST",
    });
};
const farmGemOnce = async () => {
    const idReward = "SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-2-GEMS";
    const patchUrl = `https://www.duolingo.com/2023-05-23/users/${sub}/rewards/${idReward}`;
    const patchData = {
        consumed: true,
        learningLanguage: userInfo.learningLanguage,
        fromLanguage: userInfo.fromLanguage,
    };
    return await sendRequestWithDefaultHeaders({
        url: patchUrl,
        payload: patchData,
        method: "PATCH",
    });
};
const farmSessionOnce = async (startTime, endTime) => {
    const sessionPayload = {
        challengeTypes: [
            "assist", "characterIntro", "characterMatch", "characterPuzzle", "characterSelect",
            "characterTrace", "characterWrite", "completeReverseTranslation", "definition",
            "dialogue", "extendedMatch", "extendedListenMatch", "form", "freeResponse",
            "gapFill", "judge", "listen", "listenComplete", "listenMatch", "match", "name",
            "listenComprehension", "listenIsolation", "listenSpeak", "listenTap",
            "orderTapComplete", "partialListen", "partialReverseTranslate", "patternTapComplete",
            "radioBinary", "radioImageSelect", "radioListenMatch", "radioListenRecognize",
            "radioSelect", "readComprehension", "reverseAssist", "sameDifferent", "select",
            "selectPronunciation", "selectTranscription", "svgPuzzle", "syllableTap",
            "syllableListenTap", "speak", "tapCloze", "tapClozeTable", "tapComplete",
            "tapCompleteTable", "tapDescribe", "translate", "transliterate",
            "transliterationAssist", "typeCloze", "typeClozeTable", "typeComplete",
            "typeCompleteTable", "writeComprehension",
        ],
        fromLanguage: userInfo.fromLanguage,
        isFinalLevel: false,
        isV2: true,
        juicy: true,
        learningLanguage: userInfo.learningLanguage,
        smartTipsVersion: 2,
        type: "GLOBAL_PRACTICE",
    };
    const sessionRes = await sendRequestWithDefaultHeaders({
        url: "https://www.duolingo.com/2023-05-23/sessions",
        payload: sessionPayload,
        method: "POST",
    });
    const sessionData = await sessionRes.json();
    const updateSessionPayload = {
        ...sessionData,
        heartsLeft: 0,
        startTime: startTime,
        enableBonusPoints: false,
        endTime: endTime,
        failed: false,
        maxInLessonStreak: 9,
        shouldLearnThings: true,
    };
    const updateRes = await sendRequestWithDefaultHeaders({
        url: `https://www.duolingo.com/2023-05-23/sessions/${sessionData.id}`,
        payload: updateSessionPayload,
        method: "PUT",
    });
    return await updateRes.json();
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const logToConsole = (message, type = 'info') => {
    const console = document.getElementById('_console_output');
    if (!console) return;
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `_log_entry _${type}`;
    entry.innerHTML = `
    <span class="_log_time">${timestamp}</span>
    <span class="_log_msg">${message}</span>
  `;
    console.appendChild(entry);
    console.scrollTop = console.scrollHeight;
    while (console.children.length > 50) {
        console.removeChild(console.firstChild);
    }
};
const updateEarnedStats = () => {
    const elements = {
        xp: document.getElementById('_earned_xp'),
        gems: document.getElementById('_earned_gems'),
        streak: document.getElementById('_earned_streak'),
        lessons: document.getElementById('_earned_lessons')
    };
    if (elements.xp) elements.xp.textContent = totalEarned.xp.toLocaleString();
    if (elements.gems) elements.gems.textContent = totalEarned.gems.toLocaleString();
    if (elements.streak) elements.streak.textContent = totalEarned.streak;
    if (elements.lessons) elements.lessons.textContent = totalEarned.lessons.toLocaleString();
};
const updateFarmingTime = () => {
    if (!farmingStats.startTime) return;
    const elapsed = Date.now() - farmingStats.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeElement = document.getElementById('_farming_time');
    if (timeElement) {
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};
const updateUserInfo = () => {
    if (!userInfo) return;
    const elements = {
        username: document.getElementById('_username'),
        user_details: document.getElementById('_user_details'),
        currentStreak: document.getElementById('_current_streak'),
        currentGems: document.getElementById('_current_gems'),
        currentXp: document.getElementById('_current_xp')
    };
    if (elements.username) elements.username.textContent = userInfo.username;
    if (elements.user_details) {
        elements.user_details.textContent = `${userInfo.fromLanguage} → ${userInfo.learningLanguage}`;
    }
    if (elements.currentStreak) elements.currentStreak.textContent = userInfo.streak?.toLocaleString() || '0';
    if (elements.currentGems) elements.currentGems.textContent = userInfo.gems?.toLocaleString() || '0';
    if (elements.currentXp) elements.currentXp.textContent = userInfo.totalXp?.toLocaleString() || '0';
    updateAvatarDisplay();
};
const updateAvatarDisplay = () => {
    const mainAvatarEl = document.querySelector('._avatar');
    if (mainAvatarEl) {
        if (userInfo && userInfo.picture) {
            let hqUrl = userInfo.picture.replace(/\/(medium|large|small)$/, '/xlarge');
            if (!hqUrl.endsWith('/xlarge') && hqUrl.includes('duolingo.com/ssr-avatars')) {
                hqUrl += '/xlarge';
            }
            mainAvatarEl.innerHTML = `<img src="${hqUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" draggable="false">`;
        } else {
            mainAvatarEl.innerHTML = '<span style="font-size: 28px;">👤</span>';
        }
    }
};
const initializeFarming = async () => {
    try {
        jwt = getJwtToken();
        if (!jwt) {
            logToConsole('Please login to Duolingo and reload', 'error');
            return false;
        }
        defaultHeaders = formatHeaders(jwt);
        const decodedJwt = decodeJwtToken(jwt);
        sub = decodedJwt.sub;
        userInfo = await getUserInfo(sub);
        if (userInfo && userInfo.username) {
            updateUserInfo();
            const mainContent = document.getElementById('_main_content');
            if (mainContent) {
                mainContent.style.display = 'flex';
            }
            return true;
        }
    } catch (error) {
        logToConsole(`Init error: ${error.message}`, 'error');
        return false;
    }
};
const farmXP = async (delayMs) => {
    while (isRunning) {
        try {
            const response = await farmXpOnce();
            if (response.ok) {
                const data = await response.json();
                const earned = data?.awardedXp || 0;
                totalEarned.xp += earned;
                updateEarnedStats();
                logToConsole(`Earned ${earned} XP`, 'success');
            }
            await delay(delayMs);
        } catch (error) {
            logToConsole(`XP farming error: ${error.message}`, 'error');
            await delay(delayMs * 2);
        }
    }
};
const farmGems = async (delayMs) => {
    while (isRunning) {
        try {
            const response = await farmGemOnce();
            if (response.ok) {
                totalEarned.gems += 30;
                updateEarnedStats();
                logToConsole('Earned 30 gems', 'success');
            }
            await delay(delayMs);
        } catch (error) {
            logToConsole(`Gem farming error: ${error.message}`, 'error');
            await delay(delayMs * 2);
        }
    }
};
const farmStreak = async () => {
    logToConsole('Starting streak farming...', 'info');
    const hasStreak = !!userInfo.streakData?.currentStreak;
    const startStreakDate = hasStreak ? userInfo.streakData.currentStreak.startDate : new Date();
    const startFarmStreakTimestamp = Math.floor(new Date(startStreakDate).getTime() / 1000);
    let currentTimestamp = hasStreak ? startFarmStreakTimestamp - 86400 : startFarmStreakTimestamp;
    while (isRunning) {
        try {
            await farmSessionOnce(currentTimestamp, currentTimestamp + 60);
            currentTimestamp -= 86400;
            totalEarned.streak++;
            userInfo.streak++;
            updateUserInfo();
            updateEarnedStats();
            logToConsole(`Streak increased to ${userInfo.streak}`, 'success');
            await delay(currentMode === 'safe' ? SAFE_DELAY : FAST_DELAY);
        } catch (error) {
            logToConsole(`Streak farming error: ${error.message}`, 'error');
            await delay((currentMode === 'safe' ? SAFE_DELAY : FAST_DELAY) * 2);
        }
    }
};
const farmAll = async (delayMs) => {
    isRunning = true;
    farmingStats.startTime = Date.now();
    document.getElementById('_start_farming').style.display = 'none';
    document.getElementById('_stop_farming').style.display = 'block';
    logToConsole(`Started Farm All in ${currentMode} mode`, 'success');
    const timer = setInterval(updateFarmingTime, 1000);
    let cycle = 0;
    try {
        while (isRunning) {
            cycle++;
            logToConsole(`--- Cycle ${cycle} ---`, 'info');
            if (!isRunning) break;
            try {
                logToConsole('Farming XP...', 'info');
                const response = await farmXpOnce();
                if (response.ok) {
                    const data = await response.json();
                    const earned = data?.awardedXp || 0;
                    totalEarned.xp += earned;
                    updateEarnedStats();
                    logToConsole(`✓ Earned ${earned} XP`, 'success');
                }
            } catch (error) {
                logToConsole(`✗ XP farming error: ${error.message}`, 'error');
            }
            await delay(delayMs);
            if (!isRunning) break;
            try {
                logToConsole('Farming Gems...', 'info');
                const response = await farmGemOnce();
                if (response.ok) {
                    totalEarned.gems += 30;
                    updateEarnedStats();
                    logToConsole('✓ Earned 30 gems', 'success');
                }
            } catch (error) {
                logToConsole(`✗ Gem farming error: ${error.message}`, 'error');
            }
            await delay(delayMs);
            if (!isRunning) break;
            try {
                logToConsole('Farming Streak...', 'info');
                const hasStreak = !!userInfo.streakData?.currentStreak;
                const startStreakDate = hasStreak ? userInfo.streakData.currentStreak.startDate : new Date();
                const startFarmStreakTimestamp = Math.floor(new Date(startStreakDate).getTime() / 1000);
                let currentTimestamp = hasStreak ? startFarmStreakTimestamp - 86400 : startFarmStreakTimestamp;
                await farmSessionOnce(currentTimestamp, currentTimestamp + 60);
                totalEarned.streak++;
                userInfo.streak++;
                updateUserInfo();
                updateEarnedStats();
                logToConsole(`✓ Streak increased to ${userInfo.streak}`, 'success');
            } catch (error) {
                logToConsole(`✗ Streak farming error: ${error.message}`, 'error');
            }
            await delay(delayMs);
        }
    } catch (error) {
        logToConsole(`❌ Farm All error: ${error.message}`, 'error');
    } finally {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('_start_farming').style.display = 'block';
        document.getElementById('_stop_farming').style.display = 'none';
    }
};
const startFarming = async () => {
    if (isRunning) return;
    const selectedOption = document.querySelector('._option_btn._selected');
    if (!selectedOption) {
        logToConsole('Please select a farming option', 'error');
        return;
    }
    const type = selectedOption.dataset.type;
    const delayMs = currentMode === 'safe' ? SAFE_DELAY : FAST_DELAY;
    if (type === 'farm_all') {
        if (confirm('Farm All will combine XP, Gems, and Streak farming. Continue?')) {
            await farmAll(delayMs);
        }
        return;
    }
    isRunning = true;
    farmingStats.startTime = Date.now();
    document.getElementById('_start_farming').style.display = 'none';
    document.getElementById('_stop_farming').style.display = 'block';
    logToConsole(`Started ${type} farming in ${currentMode} mode`, 'success');
    const timer = setInterval(updateFarmingTime, 1000);
    try {
        switch (type) {
            case 'xp':
                await farmXP(delayMs);
                break;
            case 'gems':
                await farmGems(delayMs);
                break;
            case 'streak_farm':
                await farmStreak();
                break;
        }
    } catch (error) {
        logToConsole(`Farming error: ${error.message}`, 'error');
    } finally {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('_start_farming').style.display = 'block';
        document.getElementById('_stop_farming').style.display = 'none';
    }
};
const stopFarming = () => {
    if (!isRunning) return;
    isRunning = false;
    document.getElementById('_start_farming').style.display = 'block';
    document.getElementById('_stop_farming').style.display = 'none';
    logToConsole('Farming stopped', 'info');
};
const setInterfaceVisible = (visible) => {
    const container = document.getElementById("_container");
    const backdrop = document.getElementById("_backdrop");
    if (container && backdrop) {
        container.style.display = visible ? "flex" : "none";
        backdrop.style.display = visible ? "block" : "none";
    }
};
const isInterfaceVisible = () => {
    const container = document.getElementById("_container");
    return container && container.style.display !== "none";
};
const toggleInterface = () => {
    setInterfaceVisible(!isInterfaceVisible());
};
const applyTheme = (theme) => {
    currentTheme = theme;
    localStorage.setItem('duofarmer_theme', theme);
    const container = document.getElementById("_container");
    if (container) {
        container.className = container.className.replace(/theme-\w+/, `theme-${theme}`);
    }
};
const initInterface = () => {
    const containerHTML = `
  <div id="_backdrop"></div>
  <div id="_container" class="theme-${currentTheme}">
    <div id="_header">
      <div class="_header_top">
        <div class="_brand">
<a href="https://twisk.fun" target="_blank" rel="noopener noreferrer">
  <div class="_logo_container">
    <div class="_logo"
         style="
           display: flex;
           align-items: center;
           justify-content: center;
           width: 40px;
           height: 40px;
           border-radius: 50%;
           overflow: hidden;
           border: 2px solid #1E88E5;
         "
    >
      <img src="https://github.com/helloticc/DuoHacker/blob/main/DuoHacker.png?raw=true"
           alt="Rocket"
           style="
             width: 110%;
             height: 110%;
             object-fit: cover;
           "
      >
    </div>
  </div>
</a>
<a href="https://twisk.fun" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
  <div class="_brand_text">
    <h1>DuoHacker</h1>
    <span class="_version_badge">Basic</span>
  </div>
</a>
        </div>
        <div id="_hh_notice" class="_hh_notice" role="status" aria-live="polite">
  <div class="_hh_notice_left">
    <div class="_hh_notice_title">Join our server</div>
    <div class="_hh_notice_sub">Get update announcements & changelogs.</div>
  </div>
  <button id="_hh_join_btn" class="_hh_notice_btn" type="button">
    Join
  </button>
</div>
        <div class="_header_controls">
<button id="_minimize_btn" class="_control_btn _minimize" title="Minimize">
            <span style="font-size: 18px;">➖</span>
</button>
<button id="_close_btn" class="_control_btn _close" title="Close">
            <span style="font-size: 18px;">✖️</span>
</button>
        </div>
      </div>
    </div>
    <div id="_main_content" style="display:flex">
      <div class="_profile_card">
        <div class="_profile_header">
          <div class="_avatar">
            <span style="font-size: 28px;">👤</span>
          </div>
          <div class="_profile_info">
            <h2 id="_username">Loading...</h2>
            <p id="_user_details">Fetching data...</p>
          </div>
        </div>
        <div class="_stats_row">
          <div class="_stat_item">
<div class="_stat_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="XP Icon"></div>
            <div class="_stat_info">
              <span class="_stat_value" id="_current_xp">0</span>
              <span class="_stat_label">Total XP</span>
            </div>
          </div>
          <div class="_stat_item">
<div class="_stat_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg" alt="streak Icon"></div>
            <div class="_stat_info">
              <span class="_stat_value" id="_current_streak">0</span>
              <span class="_stat_label">Streak</span>
            </div>
          </div>
          <div class="_stat_item">
<div class="_stat_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="gem Icon"></div>
            <div class="_stat_info">
              <span class="_stat_value" id="_current_gems">0</span>
              <span class="_stat_label">Gems</span>
            </div>
          </div>
        </div>
      </div>
      <div class="_mode_section">
        <h3>Select Farming Mode</h3>
        <div class="_mode_cards">
          <div class="_mode_card ${currentMode === 'safe' ? '_active' : ''}" data-mode="safe">
<div class="_mode_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/5187f6694476a769d4a4e28149867e3e.svg" alt="Safe Mode Icon">
</div>
            <h4>Safe Mode</h4>
            <p>Slow but undetectable farming</p>
            <div class="_mode_specs">
              <span class="_spec">2s delay</span>
              <span class="_spec">100% safe</span>
            </div>
          </div>
          <div class="_mode_card ${currentMode === 'fast' ? '_active' : ''}" data-mode="fast">
<div class="_mode_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="Fast Mode Icon">
</div>
            <h4>Fast Mode</h4>
            <p>Quick farming with risk</p>
            <div class="_mode_specs">
              <span class="_spec">0.3s delay</span>
              <span class="_spec">Use carefully</span>
            </div>
          </div>
        </div>
      </div>
<div class="_options_section">
  <h3>Farming Options</h3>
  <div class="_option_grid">
    <button class="_option_btn" data-type="xp">
<div class="_option_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="XP Icon">
</div>
      <span>Farm XP</span>
    </button>
    <button class="_option_btn" data-type="gems">
<div class="_option_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="Gems Icon">
</div>
      <span>Farm Gem</span>
    </button>
    <button class="_option_btn" data-type="streak_farm">
<div class="_option_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg" alt="Streak Icon">
</div>
      <span>Farm Streak</span>
    </button>
            <button class="_option_btn" data-type="farm_all">
<div class="_option_icon">
  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/784035717e2ff1d448c0f6cc4efc89fb.svg" alt="FA Icon">
</div>
      <span>Farm All</span>
    </button>
  </div>
</div>
      <div class="_control_panel">
        <button id="_start_farming" class="_start_btn">
          <span class="_btn_text">Start Farming</span>
        </button>
        <button id="_stop_farming" class="_stop_btn" style="display:none">
          <span class="_btn_text">Stop Farming</span>
        </button>
      </div>
      <div class="_live_stats">
        <h3>Live Statistics</h3>
        <div class="_stats_grid">
          <div class="_live_stat">
<div class="_live_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="XP Earned Icon"></div>
            <div class="_live_data">
              <span id="_earned_xp">0</span>
              <small>XP Earned</small>
            </div>
          </div>
          <div class="_live_stat">
<div class="_live_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="Gems Earned Icon"></div>
            <div class="_live_data">
              <span id="_earned_gems">0</span>
              <small>Gems Earned</small>
            </div>
          </div>
          <div class="_live_stat">
<div class="_live_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg" alt="Streak Gained Icon"></div>
            <div class="_live_data">
              <span id="_earned_streak">0</span>
              <small>Streak Gained</small>
            </div>
          </div>
          <div class="_live_stat">
<div class="_live_icon"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/974e284761265b0eb6c9fd85243c5c4b.svg" alt="time Icon"></div>
            <div class="_live_data">
              <span id="_farming_time">00:00</span>
              <small>Time Elapsed</small>
            </div>
          </div>
        </div>
      </div>
      <div class="_console_section">
        <div class="_console_header">
          <h3>Activity Log</h3>
          <button id="_clear_console" class="_clear_btn">Clear</button>
        </div>
        <div id="_console_output" class="_console">
          <div class="_log_entry _info">
            <span class="_log_time">${new Date().toLocaleTimeString()}</span>
            <span class="_log_msg">DuoHacker Basic initialized</span>
          </div>
        </div>
      </div>
    </div>
<div class="_footer">
    <span>© 2026 DuoHacker Lite</span>
    <div class="_footer_socials">
<a href="https://twisk.fun/discord" target="_blank" title="Discord">
  <img
    alt="Discord"
    src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%20256%20256%27%20preserveAspectRatio%3D%27xMidYMid%20meet%27%3E%3Cg%20transform%3D%27translate(0%2C24)%27%3E%3Cpath%20fill%3D%27%23fff%27%20d%3D%27M216.9%2016.5A208.1%20208.1%200%200%200%20164.7%200c-2.3%204-4.4%208.2-6.2%2012.5a192.5%20192.5%200%200%200-61%200C95.6%208.2%2093.4%204%2091.1%200A208.3%20208.3%200%200%200%2038.9%2016.5C6.6%2064.6-2%20111.4%201.8%20157.6c18.9%2014%2041%2024.8%2064.7%2031.6%205.2-7.1%209.8-14.7%2013.6-22.8-7.5-2.8-14.7-6.2-21.6-10.1%201.8-1.3%203.6-2.7%205.2-4.1%2041.7%2019.6%2086.9%2019.6%20128.1%200%201.7%201.4%203.4%202.8%205.2%204.1-6.9%204-14.1%207.3-21.6%2010.1%203.9%208.1%208.5%2015.7%2013.6%2022.8%2023.7-6.8%2045.8-17.6%2064.7-31.6%204.5-54-7.7-100.3-37.4-141.1ZM85.8%20135.3c-12.5%200-22.8-11.5-22.8-25.6%200-14%2010.1-25.6%2022.8-25.6%2012.7%200%2023%2011.5%2022.8%2025.6%200%2014.1-10.1%2025.6-22.8%2025.6Zm84.4%200c-12.5%200-22.8-11.5-22.8-25.6%200-14%2010.1-25.6%2022.8-25.6%2012.7%200%2023%2011.5%2022.8%2025.6%200%2014.1-10.1%2025.6-22.8%2025.6Z%27/%3E%3C/g%3E%3C/svg%3E"
  />
</a>
        <a href="https://greasyfork.org/en/users/1510019-duohackerdevs" target="_blank" title="Greasy Fork">
            <img
              alt="Greasy Fork"
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%2024%2024%27%3E%3Crect%20x%3D%273%27%20y%3D%274%27%20width%3D%2718%27%20height%3D%2716%27%20rx%3D%272%27%20fill%3D%27none%27%20stroke%3D%27%23fff%27%20stroke-width%3D%272%27/%3E%3Cpath%20d%3D%27M7%208h10M7%2012h10M7%2016h7%27%20stroke%3D%27%23fff%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27/%3E%3C/svg%3E"
            >
        </a>
        <a href="https://twisk.fun" target="_blank" title="Website">
            <img
              alt="Website"
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23FFF%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Ccircle%20cx%3D%2712%27%20cy%3D%2712%27%20r%3D%2710%27/%3E%3Cline%20x1%3D%272%27%20y1%3D%2712%27%20x2%3D%2722%27%20y2%3D%2712%27/%3E%3Cpath%20d%3D%27M12%202a15.3%2015.3%200%200%201%204%2010%2015.3%2015.3%200%200%201-4%2010%2015.3%2015.3%200%200%201-4-10%2015.3%2015.3%200%200%201%204-10z%27/%3E%3C/svg%3E"
            >
        </a>
    </div>
</div>
  </div>
<div id="_fab_container">
    <div id="_fab">
        <img src="https://raw.githubusercontent.com/helloticc/DuoHacker/refs/heads/main/DuoHacker.png" alt="Toggle Menu">
    </div>
</div>
`;
const style = document.createElement("style");
style.textContent = `
/* =========================
   HelperHub Clean UI (tokens-first)
   ========================= */
:root{
  /* Brand palette (from your image) */
  --hh-purple:#8364F3;
  --hh-mid:#8298ED;
  --hh-cyan:#81CBE6;
  --hh-white:#F8F8F8;
  /* Surfaces */
  --surface-0: rgba(255,255,255,.06);
  --surface-1: rgba(255,255,255,.08);
  --surface-2: rgba(255,255,255,.10);
  /* Borders */
  --border-0: rgba(255,255,255,.14);
  --border-1: rgba(255,255,255,.18);
  /* Text */
  --text-0: rgba(255,255,255,.92);
  --text-1: rgba(255,255,255,.72);
  --text-2: rgba(255,255,255,.55);
  /* Radius / shadow / motion */
  --r-lg: 20px;
  --r-md: 16px;
  --r-sm: 12px;
  --sh-1: 0 10px 30px rgba(0,0,0,.28);
  --sh-2: 0 18px 60px rgba(0,0,0,.35);
  --ease: cubic-bezier(.2,.8,.2,1);
  --t: 160ms var(--ease);
  /* Glass */
  --blur: 18px;
  --sat: 160%;
}
._hh_notice{
  margin: 12px 18px 0 18px;
  padding: 12px 12px 12px 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background:
    linear-gradient(90deg, rgba(131,100,243,.18), rgba(130,152,237,.12), rgba(129,203,230,.16)),
    rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 10px 30px rgba(0,0,0,.22);
}
._hh_notice_left{
  display:flex;
  flex-direction:column;
  gap: 2px;
  min-width: 0;
}
._hh_notice_title{
  font-weight: 800;
  font-size: 13px;
  color: rgba(255,255,255,.92);
  letter-spacing: .2px;
}
._hh_notice_sub{
  font-size: 12px;
  color: rgba(255,255,255,.70);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._hh_notice_btn{
  flex: 0 0 auto;
  padding: 10px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: 800;
  letter-spacing: .2px;
  background: linear-gradient(90deg, #8364F3, #8298ED, #81CBE6);
  box-shadow: 0 12px 26px rgba(0,0,0,.22);
  transition: transform var(--t), filter var(--t);
}
._hh_notice_btn:hover{ transform: translateY(-1px); filter: brightness(1.03); }
._hh_notice_btn:active{ transform: translateY(0px) scale(.98); }
/* Reset-ish for the overlay scope */
#_container, #_container * { box-sizing: border-box; }
#_container{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* Backdrop */
#_backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9998;
}
/* Container: DuoRain-like “clean glass + soft gradients” */
#_container{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 920px);
  max-height: min(90vh, 820px);
  z-index: 9999;
  border-radius: var(--r-lg);
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 8% 8%, rgba(131,100,243,.28), transparent 55%),
    radial-gradient(1000px 520px at 92% 12%, rgba(129,203,230,.22), transparent 55%),
    rgba(255,255,255,.06);
  backdrop-filter: blur(var(--blur)) saturate(var(--sat));
  -webkit-backdrop-filter: blur(var(--blur)) saturate(var(--sat));
  border: 1px solid var(--border-0);
  box-shadow: var(--sh-2);
  display: flex;
  flex-direction: column;
}
/* Header */
#_header{
  padding: 16px 18px;
  background: linear-gradient(
    90deg,
    rgba(131,100,243,.18),
    rgba(130,152,237,.12),
    rgba(129,203,230,.16)
  );
  border-bottom: 1px solid rgba(255,255,255,.10);
}
._header_top{ display:flex; align-items:center; justify-content:space-between; gap: 12px; }
._brand{ display:flex; align-items:center; gap: 12px; }
._brand_text{ display:flex; align-items:center; gap: 10px; line-height: 1; }
._brand_text h1{
  margin: 0;
  font-size: 18px;
  font-weight: 750;
  color: var(--text-0);
  letter-spacing: .2px;
}
._version_badge{
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.16);
  color: var(--text-0);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
}
/* Controls: glass pills, not solid neon */
._header_controls{ display:flex; gap: 8px; }
._control_btn{
  width: 36px; height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.10);
  color: var(--text-0);
  cursor: pointer;
  transition: transform var(--t), background var(--t), border-color var(--t);
}
._control_btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.14);
  border-color: rgba(255,255,255,.20);
}
/* Main layout */
#_main_content{
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
}
/* Cards */
._profile_card,
._mode_card,
._live_stat,
._console_section{
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: var(--r-md);
}
._profile_card{ padding: 16px; }
._profile_header{ display:flex; align-items:center; gap: 12px; margin-bottom: 14px; }
._avatar{
  width: 56px; height: 56px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(131,100,243,.75), rgba(129,203,230,.65));
  box-shadow: 0 10px 28px rgba(0,0,0,.22);
  display:flex; align-items:center; justify-content:center;
  color: white;
}
._profile_info h2{
  margin: 0 0 3px 0;
  font-size: 18px;
  font-weight: 750;
  color: var(--text-0);
}
._profile_info p{ margin: 0; color: var(--text-1); font-size: 12px; }
/* Small icon button */
._icon_btn{
  width: 36px; height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.10);
  color: var(--text-0);
  cursor: pointer;
  transition: transform var(--t), background var(--t);
}
._icon_btn:hover{ transform: translateY(-1px); background: rgba(255,255,255,.14); }
._icon_btn._primary{
  border: none;
  background: linear-gradient(90deg, var(--hh-purple), var(--hh-mid), var(--hh-cyan));
  color: white;
}
/* Stats row */
._stats_row{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
._stat_item{
  display:flex; align-items:center; gap: 10px;
  padding: 12px;
  border-radius: var(--r-sm);
  background: rgba(0,0,0,.10);
  border: 1px solid rgba(255,255,255,.10);
  transition: background var(--t), transform var(--t);
}
._stat_item:hover{ background: rgba(255,255,255,.08); transform: translateY(-1px); }
._stat_value{ color: var(--text-0); font-weight: 750; }
._stat_label{ color: var(--text-2); font-size: 11px; }
/* Section titles */
._mode_section h3,
._options_section h3,
._live_stats h3,
._console_header h3{
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 750;
  color: var(--text-0);
}
/* Mode cards */
._mode_cards{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
._mode_card{
  padding: 14px;
  text-align:center;
  cursor:pointer;
  transition: transform var(--t), background var(--t), border-color var(--t);
}
._mode_card:hover{ transform: translateY(-2px); background: rgba(255,255,255,.10); }
._mode_card._active{
  border-color: rgba(130,152,237,.55);
  background:
    linear-gradient(90deg, rgba(131,100,243,.18), rgba(129,203,230,.14));
}
._mode_card h4{ margin: 6px 0 6px; color: var(--text-0); font-size: 14px; }
._mode_card p{ margin: 0 0 10px; color: var(--text-1); font-size: 12px; }
._mode_specs{ display:flex; justify-content:center; gap: 6px; }
._spec{
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.08);
  color: var(--text-2);
  font-size: 11px;
}
/* Options */
._option_grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
._option_btn{
  border-radius: var(--r-sm);
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: var(--text-0);
  padding: 12px;
  cursor: pointer;
  display:flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform var(--t), background var(--t), border-color var(--t);
}
._option_btn:hover{ transform: translateY(-2px); background: rgba(255,255,255,.10); }
._option_btn._selected{
  border: none;
  background: linear-gradient(90deg, var(--hh-purple), var(--hh-mid), var(--hh-cyan));
  color: white;
}
/* CTA buttons: gradient brand (clean) */
._control_panel{ display:flex; justify-content:center; gap: 10px; }
._start_btn, ._stop_btn{
  padding: 12px 28px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.10);
  color: var(--text-0);
  cursor:pointer;
  transition: transform var(--t), filter var(--t), background var(--t);
}
._start_btn{
  border: none;
  background: linear-gradient(90deg, var(--hh-purple), var(--hh-mid), var(--hh-cyan));
  color: white;
}
._start_btn:hover, ._stop_btn:hover{ transform: translateY(-2px); filter: brightness(1.03); }
/* Live stats grid */
._stats_grid{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
._live_stat{ padding: 12px; display:flex; align-items:center; gap: 10px; }
._live_data span{ color: var(--text-0); font-weight: 750; }
._live_data small{ color: var(--text-2); }
/* Console */
._console_section{ overflow: hidden; }
._console_header{
  display:flex; justify-content:space-between; align-items:center;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,.10);
}
._clear_btn{
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.08);
  color: var(--text-1);
  padding: 6px 10px;
  cursor:pointer;
}
._console{
  height: 140px;
  overflow:auto;
  padding: 12px 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
}
._log_time{ color: var(--text-2); }
._log_msg{ color: var(--text-1); }
._log_entry._success ._log_msg{ color: rgba(129,203,230,.95); }
._log_entry._error ._log_msg{ color: rgba(255,120,120,.95); }
._log_entry._info ._log_msg{ color: rgba(130,152,237,.95); }
/* Footer */
._footer{
  padding: 12px 18px;
  border-top: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  color: var(--text-2);
  display:flex; justify-content:space-between; align-items:center;
  font-size: 11px;
}
/* Floating button */
#_fab{
  width: 58px; height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.16);
  background: linear-gradient(90deg, rgba(131,100,243,.85), rgba(130,152,237,.80), rgba(129,203,230,.80));
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
  transition: transform var(--t), filter var(--t);
}
#_fab:hover{ transform: scale(1.06); filter: brightness(1.03); }
/* Responsive */
@media (max-width: 768px){
  ._stats_row, ._mode_cards, ._stats_grid{ grid-template-columns: 1fr; }
  ._control_panel{ flex-direction: column; }
  ._start_btn, ._stop_btn{ width: 100%; justify-content:center; }
}
/* Reduce motion */
@media (prefers-reduced-motion: reduce){
  #_container *{ transition: none !important; animation: none !important; }
}
#_fab_container{
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 10001; /* higher than #_backdrop (9999) */
  cursor: pointer;
}
#_fab{
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,.16);
  background: linear-gradient(90deg, #8364F3, #8298ED, #81CBE6);
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
  transition: transform var(--t), filter var(--t);
}
#_fab:hover{ transform: scale(1.06); filter: brightness(1.03); }
#_fab img{
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: block;
  object-fit: cover;
}
`;
document.head.appendChild(style);
    const container = document.createElement("div");
    container.innerHTML = containerHTML;
    document.body.appendChild(container);
    setInterfaceVisible(true);
};
const addEventListeners = () => {
    document.getElementById('_fab')?.addEventListener('click', toggleInterface);
    document.getElementById('_minimize_btn')?.addEventListener('click', () => {
        setInterfaceVisible(false);
    });
    document.getElementById('_close_btn')?.addEventListener('click', () => {
        if (isRunning) {
            if (confirm('Farming is active. Are you sure you want to close?')) {
                stopFarming();
                setInterfaceVisible(false);
            }
        } else {
            setInterfaceVisible(false);
        }
    });
    document.querySelectorAll('._mode_card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('._mode_card').forEach(c => c.classList.remove('_active'));
            card.classList.add('_active');
            currentMode = card.dataset.mode;
            logToConsole(`Switched to ${currentMode} mode`, 'info');
        });
    });
    document.querySelectorAll('._option_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('._option_btn').forEach(b => b.classList.remove('_selected'));
            btn.classList.add('_selected');
        });
    });
    document.getElementById('_start_farming')?.addEventListener('click', startFarming);
    document.getElementById('_stop_farming')?.addEventListener('click', stopFarming);
    document.getElementById('_clear_console')?.addEventListener('click', () => {
        const console = document.getElementById('_console_output');
        if (console) {
            console.innerHTML = '';
            logToConsole('Console cleared', 'info');
        }
    });
    const DISCORD_URL = "https://twisk.fun/discord";
function openDiscordNewTab(){
  try{
    GM_openInTab(DISCORD_URL, { active: true, insert: true, setParent: true });
  }catch{
    window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
  }
}
document.getElementById("_hh_join_btn")?.addEventListener("click", () => {
  openDiscordNewTab();
});
};
(async () => {
    try {
        initInterface();
        applyTheme(currentTheme);
        addEventListeners();
        const success = await initializeFarming();
        if (success) {
            logToConsole('DuoHacker Basic ready', 'success');
        } else {
            logToConsole('Failed to initialize. Please make sure you are logged in to Duolingo.', 'error');
        }
    } catch (error) {
        console.error('Init failed:', error);
    }
})();