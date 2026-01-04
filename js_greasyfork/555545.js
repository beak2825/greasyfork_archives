// ==UserScript==
// @name         Aar318's Twitch Chat Text-to-Speech
// @namespace    http://tampermonkey.net/
// @version      1.64
// @description  Twitch TTS
// @homepage     https://greasyfork.org/en/scripts/555545-aar318-s-twitch-chat-text-to-speech
// @author       Aar318
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555545/Aar318%27s%20Twitch%20Chat%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/555545/Aar318%27s%20Twitch%20Chat%20Text-to-Speech.meta.js
// ==/UserScript==

const excludedUsers = [
    'AutoMod',
    'BotRixOficial',
    'Fossabot',
    'Frostytoolsdotcom',
    'nightbot',
    'PokemonCommunityGame',
    'SoundAlerts',
    'streamlabs',
    'streamelements',
    'wizebot',
    'wzbot',
    'thevioletrealm'
];

const customNameMap = {
    'xthexpanx': 'Spanks',
    'hor318': 'Darling',
    'firehazard_official': 'Hot Pocket',
    // 'username': 'CustomSpokenName',
};

function getEffectiveNameMap() {
    return Object.assign({}, customNameMap, ttsSettings.customNameMap || {});
}

function findButtonContainer() {
    const searchBarContainer = document.querySelector(
        '#root > div.Layout-sc-1xcs6mc-0.bBgSPF > div.Layout-sc-1xcs6mc-0.hodpZn > nav > div > div.Layout-sc-1xcs6mc-0.hCMJIV'
    );
    if (searchBarContainer) {
        const candidate = searchBarContainer.querySelector('div > div.Layout-sc-1xcs6mc-0.eLLosC') || searchBarContainer;
        return candidate;
    }
    const candidates = [
        '#root nav div div[class*="Layout"][class*="Actions"]',
        'nav a[href="/directory/following"] ~ div',
        'nav a[href="/settings"] ~ div',
        '#root nav div > div',
        '#root nav [class*="Layout"]:last-child'
    ];
    for (const sel of candidates) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    const nav = document.querySelector('#root nav') || document.querySelector('nav');
    if (nav) return nav;
    return null;
}

const chatSelector = '.chat-scrollable-area__message-container';
const messageSelector = '.text-fragment';

const DEFAULT_VOLUME = 1.0;
const SETTINGS_KEY = 'twitch-tts-settings';
const storedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
const DEFAULT_VOICE = storedSettings?.selectedVoice || 'Microsoft Zira - English (United States)';

const AUTOCOMPLETE_MAX = 5000;
const AUTOCOMPLETE_TTL_MS = 30 * 60 * 1000;
const usernameLRU = new Map();
let chatObserver = null;

function normalizeName(name) {
    return (name || '').toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '');
}

const USER_CACHE_KEY = 'tts-username-cache-v1';

let _saveUsernameCacheTimer = null;
function scheduleSaveUsernameCache(delay = 1000) {
  if (_saveUsernameCacheTimer) return;
  _saveUsernameCacheTimer = setTimeout(() => {
    _saveUsernameCacheTimer = null;
    saveUsernameCache();
  }, delay);
}

function saveUsernameCache() {
  try {
    const arr = Array.from(usernameLRU.entries());
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('[TTS] saveUsernameCache error', e);
  }
}

function loadUsernameCache() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    usernameLRU.clear();
    for (const [k, v] of arr) {
      if (typeof k === 'string' && v && typeof v.original === 'string') {
        usernameLRU.set(k, { original: v.original, lastSeen: v.lastSeen || Date.now() });
      }
    }
  } catch (e) {
    console.warn('[TTS] loadUsernameCache error', e);
  }
}

function addChatUser(name) {
    if (!name) return;
    const norm = normalizeName(name);
    if (usernameLRU.has(norm)) {
        const entry = usernameLRU.get(norm);
        entry.lastSeen = Date.now();
        usernameLRU.delete(norm);
        usernameLRU.set(norm, entry);
    } else {
        usernameLRU.set(norm, { original: name, lastSeen: Date.now() });
        if (usernameLRU.size > AUTOCOMPLETE_MAX) {
            const firstKey = usernameLRU.keys().next().value;
            usernameLRU.delete(firstKey);
        }
        scheduleSaveUsernameCache();
    }
}

function pruneUsernameCache() {
    if (!AUTOCOMPLETE_TTL_MS) return;
    const cutoff = Date.now() - AUTOCOMPLETE_TTL_MS;
    for (const [k, v] of usernameLRU) {
        if (v.lastSeen < cutoff) usernameLRU.delete(k);
        else break;
    }
}

function getUsernameCandidates(prefix, limit = 50) {
    if (!prefix) return [];
    const lower = normalizeName(prefix);
    const results = [];
    const entries = Array.from(usernameLRU.entries()).reverse();
    for (const [norm, data] of entries) {
        if (norm.startsWith(lower)) {
            results.push(data.original);
            if (results.length >= limit) break;
        }
    }
    try {
        const effective = getEffectiveNameMap() || {};
        for (const k of Object.keys(effective)) {
            if (k.toLowerCase().startsWith(prefix.toLowerCase()) && !results.includes(k)) {
                results.push(k);
                if (results.length >= limit) break;
            }
        }
    } catch (e) {}
    return results.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

window.TTSAutocomplete = {
    addChatUser,
    getUsernameCandidates,
    pruneUsernameCache,
    _debug_size: () => usernameLRU.size
};

async function seedChatUsersFromTMI() {
  try {
    const path = window.location.pathname.split('/').filter(Boolean);
    const channel = path[0] || null;
    if (!channel) return false;

    const url = `https://tmi.twitch.tv/group/user/${encodeURIComponent(channel)}/chatters`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data || !data.chatters) return false;

    const groups = Object.values(data.chatters);
    groups.forEach(list => {
      if (Array.isArray(list)) {
        list.forEach(name => addChatUser(name));
      }
    });
    console.log('[TTS] Seeded username cache from TMI:', window.TTSAutocomplete._debug_size());
    return true;
  } catch (err) {
    console.warn('[TTS] TMI seed failed:', err);
    return false;
  }
}

function seedChatUsersFromDOM(limit = 5000) {
  try {
    const selectors = [
      '.chat-line__message .chat-author',
      '.chat-line__message-container .chat-author',
      '.chat-line .chat-author',
      'span[data-a-user]',
      '[data-test-selector="chat-message-username"]',
      '.chat-line__username, .chat-author__display-name'
    ];
    const set = new Set();

    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const txt = (el.textContent || el.getAttribute('data-a-user') || '').trim();
        if (txt) set.add(txt);
      });
      if (set.size >= limit) break;
    }

    const chatContainer = document.querySelector(chatSelector);
    if (chatContainer) {
      chatContainer.querySelectorAll('[data-a-user], [data-test-selector="chat-message-username"]').forEach(el => {
        const txt = (el.textContent || el.getAttribute('data-a-user') || '').trim();
        if (txt) set.add(txt);
      });
    }

    Array.from(set).slice(0, limit).forEach(name => addChatUser(name));
    console.log('[TTS] Seeded username cache from DOM:', window.TTSAutocomplete._debug_size());
    return set.size > 0;
  } catch (e) {
    console.warn('[TTS] DOM seed failed:', e);
    return false;
  }
}

async function seedChatUsers() {
  const ok = await seedChatUsersFromTMI();
  if (!ok) seedChatUsersFromDOM();
}

setInterval(pruneUsernameCache, 5 * 60 * 1000);
setInterval(() => {
    seedChatUsers().catch(e => console.warn('[TTS] periodic seedChatUsers error', e));
}, 5 * 60 * 1000); // refresh username cache every 5 minutes
setInterval(saveUsernameCache, 60 * 1000);

function isDarkMode() {
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    || document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');
}

function applyHolidayTheme() {
    if (!ttsSettings || ttsSettings.themeEnabled === false) {
        document.body.classList.remove(
            'holiday-tts-newyear','holiday-tts-mlk','holiday-tts-presidents','holiday-tts-valentine',
            'holiday-tts-stpatricks','holiday-tts-memorial','holiday-tts-juneteenth','holiday-tts-independence',
            'holiday-tts-labor','holiday-tts-halloween','holiday-tts-veterans','holiday-tts-thanksgiving','holiday-tts-christmas'
        );
        return '';
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekday = today.getDay();

    let holidayClassTTS = '';
    let emoji = '';

    if ((month === 12 && day === 31) || (month === 1 && day === 1)) { holidayClassTTS = 'holiday-tts-newyear'; emoji = '🎉'; }
    else if (month === 1 && weekday === 1 && day >= 15 && day <= 21) { holidayClassTTS = 'holiday-tts-mlk'; emoji = '👑'; }
    else if (month === 2 && weekday === 1 && day >= 15 && day <= 21) { holidayClassTTS = 'holiday-tts-presidents'; emoji = '🇺🇸'; }
    else if (month === 2 && day === 14) { holidayClassTTS = 'holiday-tts-valentine'; emoji = '❤️'; }
    else if (month === 3 && day >= 15 && day <= 17) { holidayClassTTS = 'holiday-tts-stpatricks'; emoji = '☘️'; }
    else if (month === 5 && weekday === 1) {
        const d = new Date(year, 5, 0);
        const lastMonday = d.getDate() - ((d.getDay() + 6) % 7);
        if (day === lastMonday || day === lastMonday - 1 || day === lastMonday - 2) { holidayClassTTS = 'holiday-tts-memorial'; emoji = '🇺🇸'; }
    }
    else if (month === 6 && day === 19) { holidayClassTTS = 'holiday-tts-juneteenth'; emoji = '✊'; }
    else if (month === 7 && day >= 2 && day <= 4) { holidayClassTTS = 'holiday-tts-independence'; emoji = '🎆'; }
    else if (month === 9 && weekday === 1 && day <= 7) { holidayClassTTS = 'holiday-tts-labor'; emoji = '🇺🇸'; }
    else if (month === 10 && day >= 29 && day <= 31) { holidayClassTTS = 'holiday-tts-halloween'; emoji = '🎃'; }
    else if (month === 11 && day === 11) { holidayClassTTS = 'holiday-tts-veterans'; emoji = '🇺🇸'; }
    else if (month === 11) {
        const fourthThursday = new Date(year, 10, 1);
        let thursCount = 0;
        while (fourthThursday.getMonth() === 10) {
            if (fourthThursday.getDay() === 4) thursCount++;
            if (thursCount === 4) break;
            fourthThursday.setDate(fourthThursday.getDate() + 1);
        }
        const fourthThursdayDate = fourthThursday.getDate();
        if (day === fourthThursdayDate || day === fourthThursdayDate - 1 || day === fourthThursdayDate - 2) { holidayClassTTS = 'holiday-tts-thanksgiving'; emoji = '🦃'; }
    }
    else if (month === 12 && day >= 10 && day <= 25) { holidayClassTTS = 'holiday-tts-christmas'; emoji = '🎄'; }

    document.body.classList.remove(
        'holiday-tts-newyear','holiday-tts-mlk','holiday-tts-presidents','holiday-tts-valentine',
        'holiday-tts-stpatricks','holiday-tts-memorial','holiday-tts-juneteenth','holiday-tts-independence',
        'holiday-tts-labor','holiday-tts-halloween','holiday-tts-veterans','holiday-tts-thanksgiving','holiday-tts-christmas'
    );

    if (holidayClassTTS) {
        document.body.classList.add(holidayClassTTS);
        console.log(`[TTS] Holiday theme applied: ${holidayClassTTS} ${emoji}`);
    }

    return emoji || '';
}

function formatNameMapForTextarea(mapObj) {
    if (!mapObj || typeof mapObj !== 'object') return '';
    return Object.keys(mapObj)
        .map(k => `${k}:${mapObj[k]}`)
        .join('\n');
}

function ensureCustomNameMapIsObject() {
  if (ttsSettings && typeof ttsSettings.customNameMap === 'object') return;
  if (typeof ttsSettings.customNameMap === 'string') {
    try {
      const parsed = JSON.parse(ttsSettings.customNameMap);
      if (parsed && typeof parsed === 'object') {
        ttsSettings.customNameMap = Object.fromEntries(
          Object.entries(parsed).map(([k,v]) => [k, String(v)])
        );
        return;
      }
    } catch(e){}
  }
  ttsSettings.customNameMap = {};
}

function parseNameMapFromTextarea(text) {
    const out = {};
    if (!text || !text.trim()) return out;

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    const looksLikeSimple = lines.length > 0 && lines.every(l => /^[^:]+:[\s\S]+$/.test(l));
    if (looksLikeSimple) {
        for (const line of lines) {
            const idx = line.indexOf(':');
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx + 1).trim();
            if (key) out[key] = val;
        }
        return out;
    }

    try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') {
            for (const [k, v] of Object.entries(parsed)) {
                out[k] = String(v);
            }
            return out;
        }
    } catch (e) {
    }

    for (const line of lines) {
        const idx = line.indexOf(':');
        if (idx > 0) {
            const key = line.slice(0, idx).trim().replace(/^"|"$/g, '');
            const val = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
            if (key) out[key] = val;
        }
    }
    return out;
}

function populateNameMapTextarea() {
    const ta = document.getElementById('tts-name-map-textarea');
    if (!ta) return;

    const map = ttsSettings.customNameMap || {};
    const entries = Object.entries(map);
    if (entries.length === 0) {
        ta.value = '';
        return;
    }

    const sorted = entries.sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

    ta.value = sorted.map(([k, v]) => `${k}:${v}`).join('\n');
}

function saveNameMapFromTextarea() {
    const ta = document.getElementById('tts-name-map-textarea');
    if (!ta) return;

    const parsed = parseNameMapFromTextarea(ta.value);
    const normalized = {};
    for (const [k, v] of Object.entries(parsed)) normalized[k] = String(v).trim();
    ttsSettings.customNameMap = normalized;

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    ta.value = Object.keys(normalized)
        .sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map(k => `${k}:${normalized[k]}`)
        .join('\n');

    console.log('[TTS] Saved customNameMap (normalized):', ttsSettings.customNameMap);
}

const style = document.createElement('style');
style.textContent = `
.tts-button {
    font-family: "Helvetica Neue", sans-serif;
    font-weight: 500;
    color: white;
    background-color: #9147FF;
    border: none;
    width: 100px;
    height: 30px;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 20px;
    position: relative;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease, outline-color 0.2s ease, background-color 0.2s ease;
}

.tts-button.enabled {
    outline: 2px solid #4CAF50;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tts-button.loading {
    cursor: wait;
    background-color: #666;
    pointer-events: none;
    outline: 2px solid #ff4444;
    opacity: 0.7;
    pointer-events: none;
}

.tts-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tts-settings-panel {
    position: absolute;
    top: 100%;
    right: 0;
    background: rgba(0,0,0,0.1);
    padding: 10px;
    border-radius: 10px;
    margin-top: 5px;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    width: 250px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

/* HOLIDAY THEMES */
body.holiday-tts-newyear .tts-button { background: #ffd700; color: #000; border: 1px solid #000 !important; }
body.holiday-tts-mlk .tts-button { background: #2c3e50; color: white; border: 1px solid #ecf0f1 !important; }
body.holiday-tts-presidents .tts-button { background: #1abc9c; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-valentine .tts-button { background: #e84393; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-stpatricks .tts-button { background: #2ecc71; color: white; border: 1px solid #27ae60 !important; }
body.holiday-tts-memorial .tts-button { background: #34495e; color: white; border: 1px solid #bdc3c7 !important; }
body.holiday-tts-juneteenth .tts-button { background: #16a085; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-independence .tts-button { background: linear-gradient(to right, #b22234, #ffffff, #3c3b6e); color: #3c3b6e; border: 1px solid #3c3b6e !important; }
body.holiday-tts-labor .tts-button { background: #2980b9; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-halloween .tts-button { background: #e67e22; color: #000; border: 1px solid #000000 !important; }
body.holiday-tts-veterans .tts-button { background: #7f8c8d; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-thanksgiving .tts-button { background: #d35400; color: white; border: 1px solid #ffffff !important; }
body.holiday-tts-christmas .tts-button { background: #c0392b; color: white; border: 1px solid #27ae60 !important; }
`;
document.head.appendChild(style);

let ttsSettings = storedSettings || {
    enabled: false,
    selectedVoice: DEFAULT_VOICE,
    volume: DEFAULT_VOLUME,
    themeEnabled: true,
    customNameMap: {},
    emojiCompressionEnabled: true,
    emojiCompressionMinRepeat: 2
};

ensureCustomNameMapIsObject();
loadUsernameCache();
localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
applyHolidayTheme();

window.addEventListener('load', () => {
    loadUsernameCache();
    seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers (on load) error', e));
    setTimeout(() => {
        seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers (delayed) error', e));
    }, 3000);
}); // ensure we seed once on load (and again shortly after to catch late DOM)

loadUsernameCache();
setupUI();
watchForChatAndSeed();

console.log('[TTS] Initial settings:', ttsSettings);
console.log('[TTS] localStorage value:', localStorage.getItem(SETTINGS_KEY));

function debugSpeak(message, voiceName) {
    if (!window.speechSynthesis || synth.speaking || isSpeaking || currentUtterance !== null) {
        console.log('[TTS] Skipping debugSpeak — already speaking');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === voiceName)
                      || window.speechSynthesis.getVoices()[0];
    utterance.volume = (ttsSettings.volume ?? DEFAULT_VOLUME);
    utterance.lang = 'en-US';

    try {
        synth.speak(utterance);
    } catch (error) {
        console.error('[TTS] Error speaking debug message:', error);
    }
}

function resetTTS() {
    localStorage.removeItem(SETTINGS_KEY);
    ttsSettings = {
        enabled: false,
        selectedVoice: 'Microsoft Zira - English (United States)',
        volume: DEFAULT_VOLUME
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    console.log('[TTS] Settings reset to defaults:', ttsSettings);
}

let messageQueue = [];
let isSpeaking = false;
const synth = window.speechSynthesis;

function getAvailableVoices() {
    return window.speechSynthesis.getVoices().map(voice => ({
        name: voice.name,
        lang: voice.lang
    }));
}

function populateVoiceSelect() {
    const voiceSelectEl = document.getElementById('tts-voice-select');
    if (!voiceSelectEl) return;

    const voices = window.speechSynthesis.getVoices();
    voiceSelectEl.innerHTML = '';

    const uniqueMap = new Map();
    voices.forEach(voice => {
        const key = `${voice.name}||${voice.lang}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, { name: voice.name, lang: voice.lang });
    });

    const uniqueVoices = Array.from(uniqueMap.values());
    uniqueVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.text = `${voice.name} (${voice.lang})`;
        voiceSelectEl.appendChild(option);
    });

    if (ttsSettings.selectedVoice) {
        const found = uniqueVoices.find(v => v.name === ttsSettings.selectedVoice)
            || uniqueVoices.find(v => v.name && v.name.includes(ttsSettings.selectedVoice));
        if (found) {
            voiceSelectEl.value = found.name;
        }
    }
}

window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
let currentUtterance = null;

function speakTest() {
    const testPhrase = "This is a test using A a r 3 1 8's TTS script";
    const previewButton = document.getElementById('tts-preview-button');

    if (previewButton) previewButton.classList.add('loading');

    const attemptSpeak = (attempt = 0) => {
        const voices = synth.getVoices();
        if ((!voices || voices.length === 0) && attempt < 6) {
            setTimeout(() => attemptSpeak(attempt + 1), 250);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(testPhrase);

        const selectEl = document.getElementById('tts-voice-select');
        const selectedName = (selectEl && selectEl.value) ? selectEl.value : ttsSettings.selectedVoice;

        let selectedVoice = voices.find(v => v.name === selectedName)
            || voices.find(v => v.name && selectedName && v.name.includes(selectedName))
            || voices.find(v => v.lang === 'en-US')
            || voices[0] || null;

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.volume = (ttsSettings.volume ?? DEFAULT_VOLUME);
        utterance.lang = (selectedVoice && selectedVoice.lang) ? selectedVoice.lang : 'en-US';
        utterance.rate = 1.0;

        utterance.onend = () => {
            if (previewButton) previewButton.classList.remove('loading');
        };
        utterance.onerror = () => {
            if (previewButton) previewButton.classList.remove('loading');
        };

        try {
            synth.speak(utterance);
        } catch (err) {
            console.error('[TTS] speakTest error:', err);
            if (previewButton) previewButton.classList.remove('loading');
        }
    };

    attemptSpeak(0);
}

function processNextMessage() {
    if (isSpeaking || synth.speaking || currentUtterance !== null) return;
    if (messageQueue.length === 0) return;

    const next = messageQueue.shift();
    const { username, message, retries = 0 } = next;

    console.log(`[TTS] Processing message: ${username}: ${message} (retry ${retries})`);
    speakMessage(next);
}

let speakLock = false;

function speakMessage(messageObj) {
    if (speakLock || isSpeaking || synth.speaking) return;

    speakLock = true;
    const { username, message, retries = 0 } = messageObj;
    const utterance = new SpeechSynthesisUtterance(`${username}: ${message}`);
    const voices = synth.getVoices();

    if (!voices || voices.length === 0) {
        console.warn('[TTS] No voices available yet. Retrying...');
        setTimeout(() => {
            speakLock = false;
            messageQueue.unshift(messageObj);
            processNextMessage();
        }, 500);
        return;
    }

    let selectedVoice = voices.find(v => v.name === ttsSettings.selectedVoice)
    || voices.find(v => v.name && ttsSettings.selectedVoice && v.name.includes(ttsSettings.selectedVoice))
    || voices.find(v => v.lang === 'en-US')
    || voices[0];

    utterance.voice = selectedVoice;
    utterance.volume = (ttsSettings.volume ?? DEFAULT_VOLUME);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        currentUtterance = utterance;
        console.log('[TTS] Started speaking:', utterance.text);
    };

    utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        speakLock = false;
        setTimeout(processNextMessage, 250);
    };

    utterance.onerror = (event) => {
        isSpeaking = false;
        currentUtterance = null;
        speakLock = false;

        if (event.error === 'interrupted' && retries < 2) {
            messageQueue.unshift({ username, message, retries: retries + 1 });
        } else {
            console.warn('[TTS] Skipping message after repeated interruptions');
        }

        setTimeout(processNextMessage, 0);
    };

    synth.speak(utterance);
}

function isEmoji(ch) {
  try {
    return /\p{Emoji}/u.test(ch);
  } catch (e) {
    return /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(ch);
  }
}

function compressEmojiRuns(text) {
  if (!ttsSettings.emojiCompressionEnabled) return text;
  const minRepeat = Math.max(2, ttsSettings.emojiCompressionMinRepeat || 2);
  const chars = Array.from(text);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (isEmoji(ch)) {
      let j = i + 1;
      while (j < chars.length && chars[j] === ch) j++;
      const count = j - i;
      if (count >= minRepeat) {
        out += `${ch} x${count}`;
      } else {
        out += chars.slice(i, j).join('');
      }
      i = j - 1;
    } else {
      out += ch;
    }
  }
  return out;
}

function preprocessMessageText(text) {
    let t = text.replace(/\B!([a-zA-Z0-9_]+)/g, 'Exclamation $1');
    t = compressEmojiRuns(t);
    return t;
}

const recentMessages = new Set();

function handleChatMessage(messageElement) {
    if (!messageElement || !ttsSettings.enabled) return;

    const messageContainer = messageElement.closest(
        '.chat-line__message, .chat-line__message-container, .chat-line, .message'
    );
    if (!messageContainer) return;

    const chatData = extractUsernameAndMessage(messageElement);
    if (!chatData || shouldExcludeUser(chatData.username)) {
        messageContainer.dataset.spoken = 'true';
        return;
    }
    addChatUser(chatData.username);

    let messageText = preprocessMessageText(chatData.message.trim());
    if (messageText.length === 0) {
        messageContainer.dataset.spoken = 'true';
        return;
    }

    const key = `${chatData.username}:${messageText}`;
    const now = Date.now();

    if (recentMessages.has(key)) {
        console.log('[TTS] Duplicate detected globally, skipping:', key, 'at', now);
        messageContainer.dataset.spoken = 'true';
        return;
    }

    recentMessages.add(key);
    console.log('[TTS] Added to recentMessages:', key, 'at', now);

    setTimeout(() => {
        recentMessages.delete(key);
        console.log('[TTS] Expired from recentMessages:', key, 'at', Date.now());
    }, 30000); // 30 seconds

    chatData.message = messageText;
    console.log('[TTS] Queueing message:', {
        username: chatData.username,
        message: chatData.message,
        containerId: messageContainer.getAttribute('id'),
        fragments: messageContainer.querySelectorAll('.text-fragment').length
    });

    messageQueue.push({ ...chatData, retries: 0 });
    messageContainer.dataset.spoken = 'true';
    if (!isSpeaking) processNextMessage();
}

function extractUsernameAndMessage(element) {
    const messageContainer = element.closest(
        '.chat-line__message, .chat-line__message-container, .chat-line, .message'
    );
    if (!messageContainer) {
        console.log('[TTS] Could not find message container');
        return null;
    }

    let usernameSpan = messageContainer.querySelector(
        '.chat-author, span[data-a-user], [data-test-selector="chat-message-username"]'
    );
    let username = usernameSpan ? usernameSpan.textContent.trim() : 'Unknown';

    const effectiveMap = getEffectiveNameMap();
    const lookupKey = username.toLowerCase();
    let mapped = undefined;
    for (const [k, v] of Object.entries(effectiveMap)) {
        if (k.toLowerCase() === lookupKey) { mapped = v; break; }
    }
    if (mapped) username = mapped;

    const fragments = messageContainer.querySelectorAll('.text-fragment');
    console.log(`[TTS] Extracting from container: ${fragments.length} fragments`, {
        containerId: messageContainer.getAttribute('id'),
        usernameGuess: username
    });

    const messageText = Array.from(fragments)
        .map(el => el.textContent)
        .join(' ')
        .trim();

    console.log(`[TTS] Extracted: Username="${username}", Message="${messageText}"`);
    return { username, message: messageText };
}

function debounceProcessMessages(elements) {
    clearTimeout(debounceProcessMessages.timer);
    debounceProcessMessages.timer = setTimeout(() => {
        const seenKeys = new Set();
        elements.forEach(el => {
            const chatData = extractUsernameAndMessage(el);
            if (!chatData) return;
            const key = `${chatData.username}:${chatData.message.trim()}`;
            if (seenKeys.has(key)) {
                console.log('[TTS] Duplicate in same batch, skipping:', key, 'at', Date.now());
                return;
            }
            seenKeys.add(key);
            handleChatMessage(el);
        });
    }, 100);
}

function watchForChatAndSeed() {
  const root = document.querySelector('#root') || document.body;
  if (!root) return;

  const mo = new MutationObserver((mutations, obs) => {
    const chat = document.querySelector(chatSelector);
    if (chat) {
      seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers (observer) error', e));
      seedChatUsersFromDOM();
      obs.disconnect();
    }
  });

  mo.observe(root, { childList: true, subtree: true });
}



function setupUI() {
    console.log('[TTS] Creating UI container...');
    const container = document.createElement('div');
    container.className = 'tts-button-container';
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.gap = '8px';

    const ttsButton = document.createElement('button');
    ttsButton.className = 'tts-button';
    ttsButton.textContent = 'TTS';
    const emoji = applyHolidayTheme();
    ttsButton.textContent = emoji ? `${emoji} TTS` : 'TTS';

    const settingsWrapper = document.createElement('span');
    settingsWrapper.style.position = 'relative';
    settingsWrapper.style.display = 'inline-block';

    const settingsButton = document.createElement('button');
    settingsButton.className = 'tts-button';
    settingsButton.textContent = 'Settings';

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'tts-settings-panel';
    settingsPanel.style.display = 'none';
    settingsPanel.style.position = 'absolute';
    settingsPanel.style.left = 'calc(100% + 8px)';
    settingsPanel.style.top = '0';
    settingsPanel.style.right = 'unset';
    settingsPanel.style.zIndex = '10000';
    settingsPanel.style.maxHeight = '60vh';
    settingsPanel.style.overflowY = 'auto';
    settingsPanel.style.width = 'auto';
    settingsPanel.style.minWidth = '300px';
    settingsPanel.style.maxWidth = '520px';
    settingsPanel.style.padding = '12px';
    settingsPanel.style.background = isDarkMode() ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.98)';
    settingsPanel.style.color = isDarkMode() ? '#fff' : '#000';
    settingsPanel.style.borderRadius = '10px';
    settingsPanel.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
    settingsPanel.style.pointerEvents = 'auto';
    settingsPanel.style.boxSizing = 'border-box';

    settingsButton.addEventListener('click', () => {
        console.log('[TTS] Settings button clicked!');
        const visible = settingsPanel.style.display === 'block';
        settingsPanel.style.display = visible ? 'none' : 'block';
        if (!visible) {
            populateVoiceSelect();
            populateNameMapTextarea();
                (function enableNameMapAutocompleteForPanel() {
                    const ta = document.getElementById('tts-name-map-textarea');
                    if (!ta) return;
                    if (ta._ttsAutocompleteAttached) return;
                    ta._ttsAutocompleteAttached = true;

                    let cycleIndex = -1;
                    let lastCandidates = [];
                    let lastPrefix = null;
                    let lastStart = null;

                    function getCandidates(prefix) {
                        if (!prefix) return [];
                        const fromCache = window.TTSAutocomplete.getUsernameCandidates(prefix, 200);
                        const recent = Array.from(recentMessages).map(k => k.split(':')[0]);
                        const combined = Array.from(new Set([...fromCache, ...recent]));
                        return combined.filter(k => k && k.toLowerCase().startsWith(prefix.toLowerCase()))
                            .sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                    }

                    function getTokenAtCaret(textarea) {
                        const pos = textarea.selectionStart;
                        const text = textarea.value;
                        let start = pos - 1;
                        while (start >= 0) {
                            const ch = text[start];
                            if (/\s|:|=/.test(ch)) { start++; break; }
                            start--;
                        }
                        if (start < 0) start = 0;
                        const token = text.slice(start, pos);
                        return { token, start, end: pos };
                    }

                    function handleTab(e) {
                        const key = e.key || (e.keyCode === 9 ? 'Tab' : '');
                        if (key !== 'Tab') return;
                        if (document.activeElement !== ta) return;

                        e.preventDefault();

                        const { token, start, end } = getTokenAtCaret(ta);
                        if (lastPrefix === null || lastStart === null || start !== lastStart) {
                            lastPrefix = token;
                            lastStart = start;
                            lastCandidates = getCandidates(lastPrefix);
                            cycleIndex = -1;
                        }

                        if (!lastPrefix) return;
                        if (!lastCandidates || lastCandidates.length === 0) return;

                        cycleIndex = e.shiftKey ? (cycleIndex <= 0 ? lastCandidates.length - 1 : cycleIndex - 1)
                        : (cycleIndex + 1) % lastCandidates.length;

                        const chosen = lastCandidates[cycleIndex];

                        const before = ta.value.slice(0, lastStart);
                        const after = ta.value.slice(end);
                        const suffix = after.startsWith(':') ? '' : ':';
                        ta.value = before + chosen + suffix + after;
                        const newPos = before.length + chosen.length;
                        ta.setSelectionRange(newPos, newPos);
                        ta.focus();

                        console.log('[TTS] autocomplete: replaced', lastPrefix, '→', chosen);
                    }

                    ta.addEventListener('keydown', handleTab, true);

                    function resetCycle() {
                        lastPrefix = null;
                        lastStart = null;
                        lastCandidates = [];
                        cycleIndex = -1;
                    }

                    ta.addEventListener('input', resetCycle);
                    ta.addEventListener('click', resetCycle);
                    ta.addEventListener('keyup', (e) => {
                        const navKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
                        if (navKeys.includes(e.key)) resetCycle();
                    });
                })();
            requestAnimationFrame(() => {
                const maxH = Math.min(window.innerHeight * 0.6, 800);
                settingsPanel.style.maxHeight = `${maxH}px`;
                settingsPanel.style.height = 'auto';
                const needed = Math.min(settingsPanel.scrollHeight + 8, maxH);
                settingsPanel.style.height = needed + 'px';
            });
        }
    });

    document.addEventListener('click', (e) => {
        try {
            const clickedInside = settingsWrapper.contains(e.target);
            if (!clickedInside && settingsPanel.style.display === 'block') {
                settingsPanel.style.display = 'none';
            }
        } catch (err) {
            console.warn('[TTS] click handler error', err);
        }
    });

    const emojiToggle = document.createElement('input');
    emojiToggle.type = 'checkbox';
    emojiToggle.checked = !!ttsSettings.emojiCompressionEnabled;
    const emojiToggleLabel = document.createElement('label');
    emojiToggleLabel.textContent = 'Compress repeated emoji (e.g. 😭 x3)';
    emojiToggleLabel.style.marginLeft = '8px';
    const emojiRow = document.createElement('div');
    emojiRow.style.display = 'flex';
    emojiRow.style.alignItems = 'center';
    emojiRow.style.gap = '8px';
    emojiRow.style.margin = '8px 0';
    emojiRow.appendChild(emojiToggle);
    emojiRow.appendChild(emojiToggleLabel);

    const emojiMinInput = document.createElement('input');
    emojiMinInput.type = 'number';
    emojiMinInput.min = '2';
    emojiMinInput.max = '10';
    emojiMinInput.value = ttsSettings.emojiCompressionMinRepeat || 2;
    emojiMinInput.style.width = '56px';
    emojiMinInput.style.marginLeft = '8px';
    const emojiMinLabel = document.createElement('label');
    emojiMinLabel.textContent = 'Min repeat';
    emojiMinLabel.style.marginLeft = '8px';
    emojiRow.appendChild(emojiMinLabel);
    emojiRow.appendChild(emojiMinInput);

    emojiToggle.onchange = () => {
        ttsSettings.emojiCompressionEnabled = emojiToggle.checked;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    };
    emojiMinInput.onchange = () => {
        const v = parseInt(emojiMinInput.value, 10) || 2;
        ttsSettings.emojiCompressionMinRepeat = Math.max(2, v);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    };

    settingsPanel.appendChild(emojiRow);

    const nameMapLabel = document.createElement('div');
    nameMapLabel.textContent = 'Custom name mappings (JSON or lines key:value)';
    nameMapLabel.style.marginTop = '8px';
    settingsPanel.appendChild(nameMapLabel);

    const nameMapTextarea = document.createElement('textarea');
    nameMapTextarea.id = 'tts-name-map-textarea';
    nameMapTextarea.style.width = '100%';
    nameMapTextarea.style.minHeight = '80px';
    nameMapTextarea.style.boxSizing = 'border-box';
    nameMapTextarea.style.marginTop = '6px';
    settingsPanel.appendChild(nameMapTextarea);

    const mappingsRow = document.createElement('div');
    mappingsRow.style.display = 'flex';
    mappingsRow.style.gap = '8px';
    mappingsRow.style.marginTop = '8px';

    const saveMappingsBtn = document.createElement('button');
    saveMappingsBtn.className = '';
    saveMappingsBtn.textContent = 'Save Mappings';
    saveMappingsBtn.addEventListener('click', () => {
        saveNameMapFromTextarea();
    });

    const clearMappingsBtn = document.createElement('button');
    clearMappingsBtn.className = '';
    clearMappingsBtn.textContent = 'Clear Custom';
    clearMappingsBtn.addEventListener('click', () => {
        ttsSettings.customNameMap = {};
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        populateNameMapTextarea();
    });

    mappingsRow.appendChild(saveMappingsBtn);
    mappingsRow.appendChild(clearMappingsBtn);
    settingsPanel.appendChild(mappingsRow);

    const holidayRow = document.createElement('div');
    holidayRow.style.display = 'flex';
    holidayRow.style.alignItems = 'center';
    holidayRow.style.gap = '8px';
    holidayRow.style.margin = '8px 0';

    const holidayToggle = document.createElement('input');
    holidayToggle.type = 'checkbox';
    holidayToggle.checked = !!ttsSettings.themeEnabled;
    const holidayLabel = document.createElement('label');
    holidayLabel.textContent = 'Enable Holiday Themes';
    holidayLabel.style.marginLeft = '8px';

    holidayToggle.onchange = () => {
        ttsSettings.themeEnabled = holidayToggle.checked;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        applyHolidayTheme();
    };

    holidayRow.appendChild(holidayToggle);
    holidayRow.appendChild(holidayLabel);
    settingsPanel.appendChild(holidayRow);

    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'tts-voice-select';
    voiceSelect.style.boxSizing = 'border-box';
    voiceSelect.style.width = '100%';
    voiceSelect.style.height = '30px';
    voiceSelect.style.borderRadius = '6px';
    voiceSelect.style.border = '1px solid rgba(0,0,0,0.12)';
    voiceSelect.style.background = isDarkMode() ? 'rgba(30,30,30,0.95)' : '#fff';
    voiceSelect.style.color = isDarkMode() ? '#fff' : '#000';
    settingsPanel.appendChild(voiceSelect);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = String(Math.round(((ttsSettings.volume ?? DEFAULT_VOLUME) * 100)));
    slider.style.width = '100%';
    slider.style.marginTop = '8px';
    slider.addEventListener('input', () => {
        const v = Math.max(0, Math.min(100, parseInt(slider.value, 10) || 0));
        ttsSettings.volume = v / 100;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        volumeLabel.textContent = `Volume: ${Math.round((ttsSettings.volume ?? DEFAULT_VOLUME) * 100)}%`;
    });
    settingsPanel.appendChild(slider);

    const controlsRow = document.createElement('div');
    controlsRow.style.display = 'flex';
    controlsRow.style.alignItems = 'center';
    controlsRow.style.gap = '8px';
    controlsRow.style.margin = '8px 0';
    controlsRow.style.width = '100%';

    const volumeLabel = document.createElement('label');
    volumeLabel.textContent = `Volume: ${Math.round(((ttsSettings.volume ?? DEFAULT_VOLUME) * 100))}%`;
    volumeLabel.style.flex = '0 0 auto';
    volumeLabel.style.minWidth = '80px';
    controlsRow.appendChild(volumeLabel);

    const previewIconButton = document.createElement('button');
    previewIconButton.className = 'tts-button';
    previewIconButton.id = 'tts-preview-button';
    previewIconButton.setAttribute('aria-label', 'Play voice preview');
    previewIconButton.title = 'Play voice preview';
    previewIconButton.style.width = '36px';
    previewIconButton.style.height = '30px';
    previewIconButton.style.padding = '0';
    previewIconButton.style.borderRadius = '8px';
    previewIconButton.style.display = 'inline-flex';
    previewIconButton.style.alignItems = 'center';
    previewIconButton.style.justifyContent = 'center';
    previewIconButton.style.flex = '0 0 auto';
    previewIconButton.style.marginLeft = 'auto';
    previewIconButton.style.background = 'transparent';
    previewIconButton.style.boxShadow = 'none';
    previewIconButton.style.border = 'none';
    previewIconButton.style.cursor = 'pointer';
    previewIconButton.style.color = 'inherit';
    previewIconButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16.5 12c0-1.77-.77-3.36-2-4.47v8.94c1.23-1.11 2-2.7 2-4.47z" opacity="0.9"/></svg>';
    previewIconButton.addEventListener('click', (e) => {
        e.stopPropagation();
        speakTest();
    });

    controlsRow.appendChild(previewIconButton);
    settingsPanel.appendChild(controlsRow);

    const saveRow = document.createElement('div');
    saveRow.style.display = 'flex';
    saveRow.style.alignItems = 'center';
    saveRow.style.justifyContent = 'flex-start';
    saveRow.style.margin = '8px 0 0 0';
    saveRow.style.width = '100%';

    const saveSettingsBtn = document.createElement('button');
    saveSettingsBtn.className = '';
    saveSettingsBtn.textContent = 'Save Settings';
    saveSettingsBtn.addEventListener('click', () => {
    const selectEl = document.getElementById('tts-voice-select');
        if (selectEl && selectEl.value) {
            ttsSettings.selectedVoice = selectEl.value;
        }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        populateNameMapTextarea();
        populateVoiceSelect();
        settingsPanel.style.display = 'none';
    });

    saveRow.appendChild(saveSettingsBtn);
    settingsPanel.appendChild(saveRow);

    settingsWrapper.appendChild(settingsButton);
    settingsWrapper.appendChild(settingsPanel);
    container.appendChild(ttsButton);
    container.appendChild(settingsWrapper);

    try {
        seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers (post-setup) error', e));
        seedChatUsersFromDOM();
    } catch (e) {
        console.warn('[TTS] immediate seeding failed', e);
    }

    ttsButton.addEventListener('click', async () => {
    console.log('[TTS] TTS button clicked!');
    ttsButton.classList.add('loading');
    try {
        ttsSettings.enabled = !ttsSettings.enabled;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        ttsButton.classList.toggle('enabled', ttsSettings.enabled);

        if (ttsSettings.enabled) {
            seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers error', e));
        }

        await new Promise(resolve => {
            if (window.speechSynthesis.getVoices().length > 0) {
                resolve();
            } else {
                const checkVoices = setInterval(() => {
                    if (window.speechSynthesis.getVoices().length > 0) {
                        clearInterval(checkVoices);
                        resolve();
                    }
                }, 100);
            }
        });

        ttsButton.classList.remove('loading');

        if (ttsSettings.enabled) {
            enableTTS();
            debugSpeak('TTS Enabled', ttsSettings.selectedVoice);
        } else {
            disableTTS();
            debugSpeak('TTS Disabled', ttsSettings.selectedVoice);
        }
    } catch (error) {
        console.error('[TTS] Error initializing TTS:', error);
        ttsButton.classList.remove('loading');
        ttsButton.classList.toggle('enabled', !ttsSettings.enabled);
    }
});

    const btnContainer = findButtonContainer();
    if (btnContainer) {
        btnContainer.appendChild(container);
    } else {
        document.body.appendChild(container);
    }
}

    watchForChatAndSeed();
    populateVoiceSelect();

function initializeTTS() {
    console.log('[TTS] Initializing TTS...');
    const existingContainer = document.querySelector('.tts-button-container');
    if (existingContainer) {
        console.log('[TTS] UI already exists, removing old instance...');
        existingContainer.remove();
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
        try {
            ttsSettings = JSON.parse(savedSettings);
            if (typeof ttsSettings.themeEnabled !== 'boolean') {
                ttsSettings.themeEnabled = true;
            }
            ttsSettings.enabled = false;
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
        } catch (e) {
            console.error('[TTS] Error parsing saved settings:', e);
            ttsSettings = {
                enabled: false,
                selectedVoice: DEFAULT_VOICE,
                volume: DEFAULT_VOLUME,
                themeEnabled: true
            };
        }
    } else {
        console.log('[TTS] No saved settings found, using defaults');
        ttsSettings = {
            enabled: false,
            selectedVoice: DEFAULT_VOICE,
            volume: DEFAULT_VOLUME,
            themeEnabled: true
        };
    }

    addButtonContainer();
    initialize();
}

function addButtonContainer() {
    console.log('[TTS] addButtonContainer: start');
    if (document.querySelector('.tts-button-container')) {
        console.log('[TTS] addButtonContainer: UI already present, skipping.');
        return;
    }

    function insertAfter(newNode, referenceNode) {
        if (!referenceNode || !referenceNode.parentNode) {
            document.body.appendChild(newNode);
            return;
        }
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    const ui = setupUI();
    console.log('[TTS] addButtonContainer: created UI element');

    const headerSelector = '#root > div.Layout-sc-1xcs6mc-0.bBgSPF > div.Layout-sc-1xcs6mc-0.hodpZn > nav > div > div.Layout-sc-1xcs6mc-0.hCMJIV';
    const header = document.querySelector(headerSelector);
    console.log('[TTS] addButtonContainer: headerSelector result:', header);

    if (header) {
        try {
            insertAfter(ui, header.lastElementChild || header);
            console.log('[TTS] addButtonContainer: appended UI to header (headerSelector).');
            return;
        } catch (e) {
            console.error('[TTS] addButtonContainer: error appending to header:', e);
        }
    }

    try {
        const fb = (typeof findButtonContainer === 'function') ? findButtonContainer() : null;
        console.log('[TTS] addButtonContainer: findButtonContainer() returned:', fb);
        if (fb) {
            insertAfter(ui, fb.lastElementChild || fb);
            console.log('[TTS] addButtonContainer: appended UI to findButtonContainer() target.');
            return;
        }
    } catch (e) {
        console.error('[TTS] addButtonContainer: findButtonContainer() threw:', e);
    }

    ui.style.position = 'fixed';
    ui.style.top = '12px';
    ui.style.right = '12px';
    ui.style.zIndex = '100000';
    document.body.appendChild(ui);
    console.log('[TTS] addButtonContainer: final fallback appended UI to body (fixed top-right).');
}

let lastChannel = window.location.pathname.split('/').filter(Boolean)[0] || '';
setInterval(() => {
    const channel = window.location.pathname.split('/').filter(Boolean)[0] || '';
    if (channel && channel !== lastChannel) {
        lastChannel = channel;
        console.log('[TTS] Channel changed, reseeding username cache for', channel);
        // usernameLRU.clear(); // clear username cache if you want a fresh start
        seedChatUsers().catch(e => console.warn('[TTS] reseed error', e));
    }
}, 2000);

initializeTTS();

function shouldExcludeUser(username) {
    return excludedUsers.some(excluded =>
        username.toLowerCase().includes(excluded.toLowerCase())
    );
}

function setupChatObserver(container) {
    if (!container) return;
    if (chatObserver) {
        try { chatObserver.disconnect(); } catch (e) {}
        chatObserver = null;
    }

    chatObserver = new MutationObserver(mutations => {
        const added = [];
        for (const m of mutations) {
            if (!m.addedNodes) continue;
            m.addedNodes.forEach(node => {
                try {
                    if (node.querySelectorAll) {
                        node.querySelectorAll(messageSelector).forEach(el => added.push(el));
                        // also handle the node itself if it matches
                        if (node.matches && node.matches(messageSelector)) added.push(node);
                    }
                } catch (err) { /* defensive */ }
            });
        }
        if (added.length) debounceProcessMessages(added);
    });

    try {
        chatObserver.observe(container, { childList: true, subtree: true });
        console.log('[TTS] Chat observer attached');
            try {
                chatObserver.observe(container, { childList: true, subtree: true });
                console.log('[TTS] Chat observer attached');

                seedChatUsers().catch(e => console.warn('[TTS] seedChatUsers (observer attach) error', e));
            } catch (err) {
                console.warn('[TTS] Failed to observe chat container', err);
            }
    } catch (err) {
        console.warn('[TTS] Failed to observe chat container', err);
    }
}

function enableTTS() {
    try {
        if (chatObserver) {
            console.log('[TTS] enableTTS called but observer already exists');
            return;
        }

        const container = document.querySelector(chatSelector);
        if (container) {
            setupChatObserver(container);
        } else {
            console.log('[TTS] Chat container not found, retrying...');
            const retry = setInterval(() => {
                const el = document.querySelector(chatSelector);
                if (el) {
                    clearInterval(retry);
                    setupChatObserver(el);
                }
            }, 500);
        }
    } catch (err) {
        console.error('[TTS] enableTTS error', err);
        throw err;
    }
}

function disableTTS() {
    try {
        if (chatObserver) {
            try { chatObserver.disconnect(); } catch (e) {}
            chatObserver = null;
            console.log('[TTS] Chat observer disconnected');
        }
    } catch (err) {
        console.warn('[TTS] disableTTS error', err);
    }

    messageQueue = [];
    try { synth.cancel(); } catch (e) {}
    isSpeaking = false;
    currentUtterance = null;
}

async function initialize() {
    console.log('[TTS] Starting initialization...');
    window.speechSynthesis.onvoiceschanged = () => checkVoices();
    checkVoices();

    if (!document.querySelector('.tts-button-container')) {
        addButtonContainer();
        console.log('[TTS] UI injected.');
    } else {
        console.log('[TTS] UI already present, skipping reinjection.');
    }

    const waitForChat = setInterval(() => {
        const chatElement = document.querySelector(chatSelector);
        if (chatElement) {
            clearInterval(waitForChat);
            console.log('[TTS] Chat container found.');
            if (ttsSettings.enabled) {
                enableTTS();
            }
        }
    }, 800);
}

function checkVoices() {
    const voices = synth.getVoices();
    if (voices.length === 0) {
        setTimeout(checkVoices, 1000);
        return;
    }

    const saved = ttsSettings.selectedVoice || '';
    const match = voices.find(v => v.name === saved)
        || voices.find(v => saved && v.name && v.name.includes(saved));

    if (match) {
        ttsSettings.selectedVoice = match.name;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    } else {
        const ziraVoice = voices.find(v => v.name === 'Microsoft Zira - English (United States)');
        const englishVoice = voices.find(v => v.lang === 'en-US') || voices[0];
        ttsSettings.selectedVoice = (ziraVoice ? ziraVoice.name : englishVoice.name);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ttsSettings));
    }

    populateVoiceSelect();
}

function logAvailableVoices() {
    const voices = window.speechSynthesis.getVoices();
    console.log('[TTS] Available voices:');
    voices.forEach(voice => {
        console.log(`- ${voice.name} (${voice.lang})`);
    });
}

setTimeout(logAvailableVoices, 1000);
