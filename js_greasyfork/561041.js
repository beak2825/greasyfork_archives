// ==UserScript==
// @name         Duolingo DuoHacker
// @description  Best Free Duolingo Hack with XP Farming, Gems Farming, Streaks Farming, even Free Supers are here!
// @namespace    https://twisk.fun
// @version      1.1.0
// @author       mintdevs
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://github.com/helloticc/DuoHacker/blob/main/DuoHacker.png?raw=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561041/Duolingo%20DuoHacker.user.js
// @updateURL https://update.greasyfork.org/scripts/561041/Duolingo%20DuoHacker.meta.js
// ==/UserScript==
const VERSION = "1.1.0";
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
<a href="#" target="_blank" rel="noopener noreferrer">
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
<a href="#" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
  <div class="_brand_text">
    <h1>DuoHacker</h1>
    
  </div>
</a>
        </div>
<div class="_header_controls">
<button id="_hh_bell_btn" class="_control_btn _bell" title="Announcements" aria-label="Announcements">
  <svg class="_hh_bell_svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path d="M12 22a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 22Z" fill="currentColor"></path>
    <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" fill="currentColor" opacity=".9"></path>
  </svg>
  <span id="_hh_bell_badge" class="_hh_bell_badge" aria-hidden="true">1</span>
</button>

<button id="_hh_settings_btn" class="_control_btn _settings" title="Settings" aria-label="Settings">
  <svg class="_hh_gear_svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.11-.2-.35-.28-.57-.2l-2.39.96c-.5-.38-1.04-.7-1.64-.94l-.47-2.55c-.04-.22-.24-.38-.47-.38h-3.86c-.23 0-.43.16-.47.38l-.47 2.55c-.6.24-1.15.56-1.64.94l-2.39-.96c-.22-.08-.46 0-.57.2L2.71 7.93c-.11.2-.06.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.11.2.35.28.57.2l2.39-.96c.5.38 1.04.7 1.64.94l.47 2.55c.04.22.24.38.47.38h3.86c.23 0 .43-.16.47-.38l.47-2.55c.6-.24 1.15-.56 1.64-.94l2.39.96c.22.08.46 0 .57-.2l1.92-3.32c.11-.2.06-.47-.12-.61l-2.03-1.58ZM12 15.6c-1.99 0-3.6-1.61-3.6-3.6S10.01 8.4 12 8.4s3.6 1.61 3.6 3.6-1.61 3.6-3.6 3.6Z"/>
  </svg>
</button>

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
            <span class="_log_msg">DuoHacker initialized</span>
          </div>
        </div>
      </div>
    </div>
<div class="_footer">
    <span>© 2026 DuoHacker</span>
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
    linear-gradient(90deg, rgba(var(--hh-purple-rgb), .18), rgba(var(--hh-indigo-rgb), .12), rgba(var(--hh-cyan-rgb), .16)),
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
  transform: translate(-50%, -50%) scale(var(--hh-ui-scale, 1));
  transform-origin: center;
width: min(92vw, 920px);
  max-height: min(90vh, 820px);
  z-index: 9999;
  border-radius: var(--r-lg);
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 8% 8%, rgba(var(--hh-purple-rgb), .28), transparent 55%),
    radial-gradient(1000px 520px at 92% 12%, rgba(var(--hh-cyan-rgb), .22), transparent 55%),
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
    rgba(var(--hh-purple-rgb), .18),
    rgba(var(--hh-indigo-rgb), .12),
    rgba(var(--hh-cyan-rgb), .16)
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
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
  background: linear-gradient(135deg, rgba(var(--hh-purple-rgb), .75), rgba(var(--hh-cyan-rgb), .65));
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
  border-color: rgba(var(--hh-indigo-rgb), .55);
  background:
    linear-gradient(90deg, rgba(var(--hh-purple-rgb), .18), rgba(var(--hh-cyan-rgb), .14));
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
._log_entry._success ._log_msg{ color: rgba(var(--hh-cyan-rgb), .95); }
._log_entry._error ._log_msg{ color: rgba(255,120,120,.95); }
._log_entry._info ._log_msg{ color: rgba(var(--hh-indigo-rgb), .95); }
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
  background: linear-gradient(90deg, rgba(var(--hh-purple-rgb), .85), rgba(var(--hh-indigo-rgb), .80), rgba(var(--hh-cyan-rgb), .80));
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

  #_hh_updates_notice._hh_un_closing{ animation: none; }
  #_hh_updates_notice ._hh_un_btn{ transition: none; }
}


/* --- Announcements bell + dash (optional) --- */
._header_controls ._control_btn._bell{
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
._header_controls ._control_btn._bell ._hh_bell_svg{
  display:block;
  color: rgba(255,255,255,.92);
}
._hh_bell_badge{
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .2px;
  color: #fff;
  background: #ff3b30;
  border: 2px solid rgba(18,18,20,.95);
  box-shadow: 0 6px 14px rgba(0,0,0,.25);
}

/* Panel */
#_hh_announce_panel{
  position: fixed;
  width: min(360px, calc(100vw - 24px));
  max-width: 360px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(18,18,20,.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--sh-2);
  z-index: 2147483646;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  display: none;
  transform-origin: top right;
}
#_hh_announce_panel._open{
  animation: _hh_ap_in .22s cubic-bezier(.2,.8,.2,1) both;
}
#_hh_announce_panel._hh_ap_closing{
  animation: _hh_ap_out .18s ease both;
}

#_hh_announce_panel ._hh_ap_head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 12px 12px 8px;
}
#_hh_announce_panel ._hh_ap_title{
  font-weight: 900;
  font-size: 13px;
  color: rgba(255,255,255,.95);
  letter-spacing: .3px;
}
#_hh_announce_panel ._hh_ap_x{
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
#_hh_announce_panel ._hh_ap_x:hover{ background: rgba(255,255,255,.10); }

#_hh_announce_panel ._hh_ap_body{ padding: 0 12px 12px; }
#_hh_announce_panel ._hh_ap_card{
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.05);
  padding: 12px;
}
#_hh_announce_panel ._hh_ap_card_title{
  font-weight: 900;
  font-size: 13px;
  color: rgba(255,255,255,.95);
  margin-bottom: 6px;
}
#_hh_announce_panel ._hh_ap_card_sub{
  font-size: 12.5px;
  line-height: 1.35;
  color: rgba(255,255,255,.76);
  margin-bottom: 10px;
}
#_hh_announce_panel ._hh_ap_actions{
  display:flex;
  gap: 8px;
}
#_hh_announce_panel ._hh_ap_btn{
  appearance:none;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  padding: 8px 10px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 12.5px;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease, border-color .12s ease;
}
#_hh_announce_panel ._hh_ap_btn:hover{ background: rgba(255,255,255,.10); }
#_hh_announce_panel ._hh_ap_btn:active{ transform: translateY(1px); }
#_hh_announce_panel ._hh_ap_btn._primary{
  border-color: rgba(var(--hh-purple-rgb), .35);
  background: rgba(var(--hh-purple-rgb), .22);
}
#_hh_announce_panel ._hh_ap_btn._primary:hover{ background: rgba(var(--hh-purple-rgb), .30); }

@keyframes _hh_ap_in{
  from{ opacity: 0; transform: translateY(-4px) scale(.98); }
  to  { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes _hh_ap_out{
  from{ opacity: 1; transform: translateY(0) scale(1); }
  to  { opacity: 0; transform: translateY(-2px) scale(.985); }
}

@media (prefers-reduced-motion: reduce){
  #_hh_announce_panel._open{ animation: none; }
  #_hh_announce_panel._hh_ap_closing{ animation: none; }
  #_hh_announce_panel ._hh_ap_btn{ transition: none; }
}


/* Make header control SVGs perfectly centered */
._control_btn svg{ display:block; pointer-events:none; }
._control_btn._bell ._hh_bell_svg{ transform: translateY(0.5px); } /* optical centering */
._control_btn._settings ._hh_gear_svg{ transform: translateY(0.5px); }



/* --- Settings panel (Theme) --- */
#_hh_settings_panel{
  position: fixed;
  width: min(420px, calc(100vw - 24px));
  max-width: 420px;
  border-radius: var(--r-lg);
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(18,18,20,.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--sh-2);
  z-index: 2147483646;
  display: none;
  transform-origin: top right;
}
#_hh_settings_panel._open{ animation: _hh_sp_in .22s cubic-bezier(.2,.8,.2,1) both; }
#_hh_settings_panel._hh_sp_closing{ animation: _hh_sp_out .18s ease both; }

#_hh_settings_panel ._hh_sp_head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 12px 12px 8px;
}
#_hh_settings_panel ._hh_sp_title{
  font-weight: 950;
  font-size: 13px;
  color: rgba(255,255,255,.95);
  letter-spacing: .35px;
}
#_hh_settings_panel ._hh_sp_x{
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
#_hh_settings_panel ._hh_sp_x:hover{ background: rgba(255,255,255,.10); }

#_hh_settings_panel ._hh_sp_body{ padding: 0 12px 12px; display:flex; flex-direction:column; gap: 12px; }
#_hh_settings_panel ._hh_sp_section{
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.05);
  padding: 12px;
}
#_hh_settings_panel ._hh_sp_h2{
  font-weight: 950;
  font-size: 12.5px;
  color: rgba(255,255,255,.92);
  margin-bottom: 8px;
  letter-spacing: .25px;
}
#_hh_settings_panel ._hh_sp_note{
  font-size: 12.5px;
  line-height: 1.35;
  color: rgba(255,255,255,.72);
  margin-bottom: 8px;
}

#_hh_settings_panel ._hh_sp_grid{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
#_hh_settings_panel ._hh_sp_field{
  display:flex;
  flex-direction:column;
  gap: 6px;
}
#_hh_settings_panel ._hh_sp_field span{
  font-size: 11.5px;
  color: rgba(255,255,255,.78);
  display:flex;
  align-items:center;
  justify-content: space-between;
}
#_hh_settings_panel ._hh_sp_field b{ font-weight: 950; color: rgba(255,255,255,.92); }
#_hh_settings_panel ._hh_sp_field input[type="color"]{
  width: 100%;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.06);
  padding: 4px;
  cursor: pointer;
}
#_hh_settings_panel ._hh_sp_field input[type="range"]{ width: 100%; }
#_hh_settings_panel ._hh_sp_field._wide{ grid-column: 1 / -1; }

#_hh_settings_panel ._hh_sp_actions{
  display:flex;
  gap: 8px;
  margin-top: 10px;
}
#_hh_settings_panel ._hh_sp_btn{
  appearance:none;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.92);
  padding: 8px 10px;
  border-radius: 12px;
  font-weight: 900;
  font-size: 12.5px;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease, border-color .12s ease;
}
#_hh_settings_panel ._hh_sp_btn:hover{ background: rgba(255,255,255,.10); }
#_hh_settings_panel ._hh_sp_btn:active{ transform: translateY(1px); }
#_hh_settings_panel ._hh_sp_btn._primary{
  border-color: rgba(var(--hh-purple-rgb), .35);
  background: rgba(var(--hh-purple-rgb), .22);
}
#_hh_settings_panel ._hh_sp_btn._primary:hover{ background: rgba(var(--hh-purple-rgb), .30); }

#_hh_settings_panel ._hh_sp_code{
  width: 100%;
  min-height: 78px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(10,10,12,.35);
  color: rgba(255,255,255,.92);
  padding: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.35;
}

@keyframes _hh_sp_in{
  from{ opacity: 0; transform: translateY(-4px) scale(.985); }
  to  { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes _hh_sp_out{
  from{ opacity: 1; transform: translateY(0) scale(1); }
  to  { opacity: 0; transform: translateY(-2px) scale(.985); }
}

@media (prefers-reduced-motion: reduce){
  #_hh_settings_panel._open{ animation: none; }
  #_hh_settings_panel._hh_sp_closing{ animation: none; }
  #_hh_settings_panel ._hh_sp_btn{ transition: none; }
}

`;
document.head.appendChild(style);
    const container = document.createElement("div");
    container.innerHTML = containerHTML;
    document.body.appendChild(container);
    setInterfaceVisible(true);

    // --- Announcements bell (Discord updates) ---
    // Note: This is optional and does NOT gate any functionality.
    const DISCORD_UPDATES_URL = "https://twisk.fun/discord";
    const ANNOUNCEMENTS_SEEN_KEY = "_hh_ann_seen_v1";

    const hasSeenAnnouncement = () => {
        try { return Boolean(localStorage.getItem(ANNOUNCEMENTS_SEEN_KEY)); } catch { return false; }
    };
    const markAnnouncementSeen = () => {
        try { localStorage.setItem(ANNOUNCEMENTS_SEEN_KEY, String(Date.now())); } catch {}
        const badge = document.getElementById("_hh_bell_badge");
        if (badge) badge.style.display = "none";
        const bell = document.getElementById("_hh_bell_btn");
        if (bell) bell.setAttribute("data-hh-hasnew", "false");
    };

    const setBellNewState = () => {
        const badge = document.getElementById("_hh_bell_badge");
        const bell = document.getElementById("_hh_bell_btn");
        if (!badge || !bell) return;
        const isNew = !hasSeenAnnouncement();
        badge.style.display = isNew ? "inline-flex" : "none";
        bell.setAttribute("data-hh-hasnew", isNew ? "true" : "false");
    };

    const ensureAnnouncementPanel = () => {
        let panel = document.getElementById("_hh_announce_panel");
        if (panel) return panel;

        panel = document.createElement("div");
        panel.id = "_hh_announce_panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "false");
        panel.setAttribute("aria-label", "Announcements");
        panel.innerHTML = `
          <div class="_hh_ap_head">
            <div class="_hh_ap_title">Announcements</div>
            <button type="button" class="_hh_ap_x" id="_hh_ap_x" aria-label="Close">×</button>
          </div>
          <div class="_hh_ap_body">
            <div class="_hh_ap_card">
              <div class="_hh_ap_card_title">Get update announcements</div>
              <div class="_hh_ap_card_sub">Optional: join our Discord for changelogs and release notes.</div>
              <div class="_hh_ap_actions">
                <button type="button" class="_hh_ap_btn _primary" id="_hh_ap_join">Join</button>
                <button type="button" class="_hh_ap_btn" id="_hh_ap_close">Close</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        const closePanel = () => {
            panel.classList.add("_hh_ap_closing");
            panel.addEventListener("animationend", () => {
                panel.classList.remove("_open", "_hh_ap_closing");
                panel.style.display = "none";
            }, { once: true });
            setTimeout(() => {
                panel.classList.remove("_open", "_hh_ap_closing");
                panel.style.display = "none";
            }, 250);
        };

        document.getElementById("_hh_ap_x")?.addEventListener("click", () => closePanel());
        document.getElementById("_hh_ap_close")?.addEventListener("click", () => closePanel());
        document.getElementById("_hh_ap_join")?.addEventListener("click", () => {
            window.open(DISCORD_UPDATES_URL, "_blank", "noopener,noreferrer");
            markAnnouncementSeen();
            closePanel();
        });

        // Click outside closes
        document.addEventListener("mousedown", (e) => {
            if (!panel.classList.contains("_open")) return;
            const bell = document.getElementById("_hh_bell_btn");
            if (panel.contains(e.target)) return;
            if (bell && bell.contains(e.target)) return;
            closePanel();
        });

        // ESC closes
        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            if (!panel.classList.contains("_open")) return;
            closePanel();
        });

        // Expose for toggler
        panel._hhClose = closePanel;
        return panel;
    };

    const positionPanelNearBell = (panel) => {
        const bell = document.getElementById("_hh_bell_btn");
        if (!bell || !panel) return;

        const rect = bell.getBoundingClientRect();
        const margin = 10;

        // Set visible for measurement
        panel.style.display = "block";
        panel.style.left = "0px";
        panel.style.top = "0px";

        const pw = panel.offsetWidth || 320;
        const ph = panel.offsetHeight || 220;

        let top = rect.bottom + margin;
        let left = rect.right - pw;

        // Clamp to viewport
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (left < margin) left = margin;
        if (left + pw > vw - margin) left = vw - margin - pw;

        if (top + ph > vh - margin) {
            // Place above if not enough space below
            top = rect.top - margin - ph;
        }
        if (top < margin) top = margin;

        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
    };

    const toggleAnnouncements = () => {
        const panel = ensureAnnouncementPanel();
        const isOpen = panel.classList.contains("_open");
        if (isOpen) {
            panel._hhClose?.();
            return;
        }

        positionPanelNearBell(panel);
        panel.classList.add("_open");
        panel.classList.remove("_hh_ap_closing");
        panel.style.display = "block";

        // Mark as seen once user opens the announcements dash
        if (!hasSeenAnnouncement()) markAnnouncementSeen();
    };

    // Wire bell button
    const initAnnouncementsBell = () => {
        const bell = document.getElementById("_hh_bell_btn");
        if (!bell) return;
        setBellNewState();

        bell.addEventListener("click", (e) => {
            e.preventDefault();
            toggleAnnouncements();
        });
        // Reposition on resize/scroll if open
        window.addEventListener("resize", () => {
            const panel = document.getElementById("_hh_announce_panel");
            if (panel?.classList.contains("_open")) positionPanelNearBell(panel);
        });
        window.addEventListener("scroll", () => {
            const panel = document.getElementById("_hh_announce_panel");
            if (panel?.classList.contains("_open")) positionPanelNearBell(panel);
        }, true);
    };

    initAnnouncementsBell();


    // --- Theme + Settings (export/import) ---
    const THEME_STORAGE_KEY = "_hh_theme_v1";

    const THEME_DEFAULT = {
        // Primary gradient colors used by the UI
        purple: "#8364f3",
        indigo: "#8298ed",
        cyan: "#81cbe6",
        // UI controls
        scale: 1.0,      // 0.85 - 1.25
        radius: 16,      // px
        blur: 18         // px
    };

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const safeJsonParse = (str) => {
        try { return JSON.parse(str); } catch { return null; }
    };

    const b64EncodeUtf8 = (str) => {
        try { return btoa(unescape(encodeURIComponent(str))); } catch { return ""; }
    };
    const b64DecodeUtf8 = (b64) => {
        try { return decodeURIComponent(escape(atob(b64))); } catch { return null; }
    };

    const normalizeTheme = (t) => {
        const out = { ...THEME_DEFAULT, ...(t || {}) };
        // sanitize
        const isHex = (v) => typeof v === "string" && /^#([0-9a-fA-F]{6})$/.test(v.trim());
        if (!isHex(out.purple)) out.purple = THEME_DEFAULT.purple;
        if (!isHex(out.indigo)) out.indigo = THEME_DEFAULT.indigo;
        if (!isHex(out.cyan)) out.cyan = THEME_DEFAULT.cyan;

        out.scale = clamp(Number(out.scale) || THEME_DEFAULT.scale, 0.85, 1.25);
        out.radius = clamp(Math.round(Number(out.radius) || THEME_DEFAULT.radius), 10, 28);
        out.blur = clamp(Math.round(Number(out.blur) || THEME_DEFAULT.blur), 8, 28);

        return out;
    };

    const getStoredTheme = () => {
        try {
            const raw = localStorage.getItem(THEME_STORAGE_KEY);
            if (!raw) return { ...THEME_DEFAULT };
            return normalizeTheme(safeJsonParse(raw));
        } catch {
            return { ...THEME_DEFAULT };
        }
    };

    const saveTheme = (theme) => {
        try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme)); } catch {}
    };

    const hexToRgb = (hex) => {
        const h = String(hex || '').trim().replace('#','');
        if (!/^[0-9a-fA-F]{6}$/.test(h)) return '131,100,243';
        const r = parseInt(h.slice(0,2), 16);
        const g = parseInt(h.slice(2,4), 16);
        const b = parseInt(h.slice(4,6), 16);
        return `${r},${g},${b}`;
    };

    const applyTheme = (theme) => {
        const t = normalizeTheme(theme);
        let styleEl = document.getElementById("_hh_theme_style");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "_hh_theme_style";
            document.head.appendChild(styleEl);
        }
        const rSm = clamp(t.radius - 4, 6, 24);
        const rMd = t.radius;
        const rLg = clamp(t.radius + 6, 10, 36);

        styleEl.textContent = `:root{
  --hh-purple: ${t.purple};
  --hh-indigo: ${t.indigo};
  --hh-cyan: ${t.cyan};

  /* Backwards-compat tokens used by existing UI */
  --purple: ${t.purple};
  --indigo: ${t.indigo};
  --cyan: ${t.cyan};

  /* RGB helpers for alpha backgrounds */
  --hh-purple-rgb: ${hexToRgb(t.purple)};
  --hh-indigo-rgb: ${hexToRgb(t.indigo)};
  --hh-cyan-rgb: ${hexToRgb(t.cyan)};

  --hh-ui-scale: ${t.scale};
  --blur: ${t.blur}px;

  /* Radius tokens used throughout */
  --r-sm: ${rSm}px;
  --r-md: ${rMd}px;
  --r-lg: ${rLg}px;
}`.trim();
        return t;
    };

    // Apply theme on load
    let _hhTheme = applyTheme(getStoredTheme());

    const ensureSettingsPanel = () => {
        let panel = document.getElementById("_hh_settings_panel");
        if (panel) return panel;

        panel = document.createElement("div");
        panel.id = "_hh_settings_panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "false");
        panel.setAttribute("aria-label", "Settings");
        panel.innerHTML = `
          <div class="_hh_sp_head">
            <div class="_hh_sp_title">Settings</div>
            <button type="button" class="_hh_sp_x" id="_hh_sp_x" aria-label="Close">×</button>
          </div>

          <div class="_hh_sp_body">
            <div class="_hh_sp_section">
              <div class="_hh_sp_h2">Theme</div>

              <div class="_hh_sp_grid">
                <label class="_hh_sp_field">
                  <span>Gradient 1</span>
                  <input id="_hh_th_purple" type="color" value="${_hhTheme.purple}" />
                </label>

                <label class="_hh_sp_field">
                  <span>Gradient 2</span>
                  <input id="_hh_th_indigo" type="color" value="${_hhTheme.indigo}" />
                </label>

                <label class="_hh_sp_field">
                  <span>Gradient 3</span>
                  <input id="_hh_th_cyan" type="color" value="${_hhTheme.cyan}" />
                </label>

                <label class="_hh_sp_field _wide">
                  <span>UI scale <b id="_hh_th_scale_label">${_hhTheme.scale.toFixed(2)}×</b></span>
                  <input id="_hh_th_scale" type="range" min="0.85" max="1.25" step="0.01" value="${_hhTheme.scale}">
                </label>

                <label class="_hh_sp_field _wide">
                  <span>Corner radius <b id="_hh_th_radius_label">${_hhTheme.radius}px</b></span>
                  <input id="_hh_th_radius" type="range" min="10" max="28" step="1" value="${_hhTheme.radius}">
                </label>

                <label class="_hh_sp_field _wide">
                  <span>Blur <b id="_hh_th_blur_label">${_hhTheme.blur}px</b></span>
                  <input id="_hh_th_blur" type="range" min="8" max="28" step="1" value="${_hhTheme.blur}">
                </label>
              </div>

              <div class="_hh_sp_actions">
                <button type="button" class="_hh_sp_btn" id="_hh_th_reset">Reset</button>
                <button type="button" class="_hh_sp_btn _primary" id="_hh_th_save">Save</button>
              </div>
            </div>

            <div class="_hh_sp_section">
              <div class="_hh_sp_h2">Theme code</div>
              <div class="_hh_sp_note">
                Export your theme as a code other users can paste to apply the same look.
              </div>
              <textarea id="_hh_th_code" class="_hh_sp_code" spellcheck="false" placeholder="Theme code will appear here..."></textarea>

              <div class="_hh_sp_actions">
                <button type="button" class="_hh_sp_btn" id="_hh_th_export">Export</button>
                <button type="button" class="_hh_sp_btn _primary" id="_hh_th_import">Import & Apply</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        const closePanel = () => {
            panel.classList.add("_hh_sp_closing");
            panel.addEventListener("animationend", () => {
                panel.classList.remove("_open", "_hh_sp_closing");
                panel.style.display = "none";
            }, { once: true });
            setTimeout(() => {
                panel.classList.remove("_open", "_hh_sp_closing");
                panel.style.display = "none";
            }, 240);
        };

        panel._hhClose = closePanel;

        document.getElementById("_hh_sp_x")?.addEventListener("click", () => closePanel());

        // Click outside closes
        document.addEventListener("mousedown", (e) => {
            if (!panel.classList.contains("_open")) return;
            const btn = document.getElementById("_hh_settings_btn");
            if (panel.contains(e.target)) return;
            if (btn && btn.contains(e.target)) return;
            closePanel();
        });

        // ESC closes
        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            if (!panel.classList.contains("_open")) return;
            closePanel();
        });

        const readInputs = () => normalizeTheme({
            purple: document.getElementById("_hh_th_purple")?.value,
            indigo: document.getElementById("_hh_th_indigo")?.value,
            cyan: document.getElementById("_hh_th_cyan")?.value,
            scale: document.getElementById("_hh_th_scale")?.value,
            radius: document.getElementById("_hh_th_radius")?.value,
            blur: document.getElementById("_hh_th_blur")?.value
        });

        const syncLabels = () => {
            const t = readInputs();
            const sL = document.getElementById("_hh_th_scale_label");
            const rL = document.getElementById("_hh_th_radius_label");
            const bL = document.getElementById("_hh_th_blur_label");
            if (sL) sL.textContent = `${t.scale.toFixed(2)}×`;
            if (rL) rL.textContent = `${t.radius}px`;
            if (bL) bL.textContent = `${t.blur}px`;
        };

        const onChangeLive = () => {
            const t = readInputs();
            _hhTheme = applyTheme(t);
            syncLabels();
        };

        ["_hh_th_purple","_hh_th_indigo","_hh_th_cyan"].forEach(id => {
            document.getElementById(id)?.addEventListener("input", onChangeLive);
        });
        ["_hh_th_scale","_hh_th_radius","_hh_th_blur"].forEach(id => {
            document.getElementById(id)?.addEventListener("input", onChangeLive);
        });

        document.getElementById("_hh_th_save")?.addEventListener("click", () => {
            const t = readInputs();
            _hhTheme = applyTheme(t);
            saveTheme(_hhTheme);
            logToConsole("Theme saved.", "success");
        });

        document.getElementById("_hh_th_reset")?.addEventListener("click", () => {
            _hhTheme = applyTheme({ ...THEME_DEFAULT });
            saveTheme(_hhTheme);
            // Reset UI inputs
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val); };
            setVal("_hh_th_purple", _hhTheme.purple);
            setVal("_hh_th_indigo", _hhTheme.indigo);
            setVal("_hh_th_cyan", _hhTheme.cyan);
            setVal("_hh_th_scale", _hhTheme.scale);
            setVal("_hh_th_radius", _hhTheme.radius);
            setVal("_hh_th_blur", _hhTheme.blur);
            syncLabels();
            logToConsole("Theme reset.", "info");
        });

        document.getElementById("_hh_th_export")?.addEventListener("click", () => {
            const t = readInputs();
            const code = b64EncodeUtf8(JSON.stringify(t));
            const ta = document.getElementById("_hh_th_code");
            if (ta) ta.value = code;
        });

        document.getElementById("_hh_th_import")?.addEventListener("click", () => {
            const ta = document.getElementById("_hh_th_code");
            const raw = (ta?.value || "").trim();
            if (!raw) { logToConsole("Paste a theme code first.", "warn"); return; }

            const jsonStr = b64DecodeUtf8(raw);
            if (!jsonStr) { logToConsole("Invalid theme code.", "error"); return; }

            const obj = safeJsonParse(jsonStr);
            if (!obj) { logToConsole("Invalid theme JSON.", "error"); return; }

            const t = normalizeTheme(obj);
            _hhTheme = applyTheme(t);
            saveTheme(_hhTheme);

            // Update inputs
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val); };
            setVal("_hh_th_purple", _hhTheme.purple);
            setVal("_hh_th_indigo", _hhTheme.indigo);
            setVal("_hh_th_cyan", _hhTheme.cyan);
            setVal("_hh_th_scale", _hhTheme.scale);
            setVal("_hh_th_radius", _hhTheme.radius);
            setVal("_hh_th_blur", _hhTheme.blur);
            syncLabels();
            logToConsole("Theme imported & applied.", "success");
        });

        syncLabels();
        return panel;
    };

    const positionPanelNearButton = (panel, btnId) => {
        const btn = document.getElementById(btnId);
        if (!btn || !panel) return;

        const rect = btn.getBoundingClientRect();
        const margin = 10;

        panel.style.display = "block";
        panel.style.left = "0px";
        panel.style.top = "0px";

        const pw = panel.offsetWidth || 360;
        const ph = panel.offsetHeight || 420;

        let top = rect.bottom + margin;
        let left = rect.right - pw;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (left < margin) left = margin;
        if (left + pw > vw - margin) left = vw - margin - pw;

        if (top + ph > vh - margin) {
            top = rect.top - margin - ph;
        }
        if (top < margin) top = margin;

        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
    };

    const toggleSettings = () => {
        const panel = ensureSettingsPanel();
        const isOpen = panel.classList.contains("_open");
        if (isOpen) { panel._hhClose?.(); return; }

        positionPanelNearButton(panel, "_hh_settings_btn");
        panel.classList.add("_open");
        panel.classList.remove("_hh_sp_closing");
        panel.style.display = "block";
    };

    const initSettingsButton = () => {
        const btn = document.getElementById("_hh_settings_btn");
        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSettings();
        });
        window.addEventListener("resize", () => {
            const panel = document.getElementById("_hh_settings_panel");
            if (panel?.classList.contains("_open")) positionPanelNearButton(panel, "_hh_settings_btn");
        });
        window.addEventListener("scroll", () => {
            const panel = document.getElementById("_hh_settings_panel");
            if (panel?.classList.contains("_open")) positionPanelNearButton(panel, "_hh_settings_btn");
        }, true);
    };

    initSettingsButton();


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
};
(async () => {
    try {
        initInterface();
        applyTheme(currentTheme);
        addEventListeners();
        const success = await initializeFarming();
        if (success) {
            logToConsole('DuoHacker ready', 'success');
        } else {
            logToConsole('Failed to initialize. Please make sure you are logged in to Duolingo.', 'error');
        }
    } catch (error) {
        console.error('Init failed:', error);
    }
})();
