// ==UserScript==
// @name         Popmundo - Activities ⚽ iOS
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  iOS Safari compatible version - Full modern UI, auto character switch, participant join, Turkish support
// @author       Gemini (iOS Modified)
// @match        https://*.popmundo.com/World/Popmundo.aspx/*
// @match        https://*.popmundo.com/World/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557413/Popmundo%20-%20Activities%20%E2%9A%BD%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/557413/Popmundo%20-%20Activities%20%E2%9A%BD%20iOS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // iOS Safari compatibility wrapper for GM functions
    const Storage = {
        get: (key, defaultValue) => {
            try {
                if (typeof GM_getValue !== 'undefined') {
                    return GM_getValue(key, defaultValue);
                }
                const val = localStorage.getItem('popscript_' + key);
                return val ? JSON.parse(val) : defaultValue;
            } catch (e) {
                console.warn('[PopScript] Storage get error:', e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem('popscript_' + key, JSON.stringify(value));
                }
            } catch (e) {
                console.warn('[PopScript] Storage set error:', e);
            }
        }
    };

    const addStyle = (css) => {
        try {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(css);
            } else {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        } catch (e) {
            console.warn('[PopScript] Style injection error:', e);
        }
    };

    // Default Constants
    let LOCALE_ID = '3200179';
    let ACTIVITY_NAME = '0000TTT';
    let ACTIVITY_VALUE = '2';
    const DELAY_SHORT = 2500;
    const DELAY_MEDIUM = 3000;
    const DELAY_LONG = 3500;
    const REDIRECT_DELAY = 2500;
    const RETRY_MAX_ATTEMPTS = 30;
    const RETRY_INTERVAL = 2500;
    const SWITCH_CHARACTER_DELAY = 3000;

    const KEY_SETTINGS = 'popscript_activity_settings_v2';
    const KEY_STATE = 'popscript_activity_state_v2';
    const KEY_JOINED_COUNT = 'popscript_participants_joined_v2';
    const KEY_RESUME_FLAG = 'resume_after_reload';
    const KEY_PREV_STATE = 'previous_state_before_switch';
    const KEY_RUNS_LEFT = 'popscript_runs_left';
    const KEY_CD_TIME = 'popscript_countdown_time';

    const $p = jQuery.noConflict(true);

    // Load settings
    let settings = Storage.get(KEY_SETTINGS, {});
    if (settings.localeId) { LOCALE_ID = settings.localeId; }
    if (settings.activityName) { ACTIVITY_NAME = settings.activityName; }
    if (settings.activityValue) { ACTIVITY_VALUE = settings.activityValue; }

    let TOTAL_RUNS = settings.totalRuns || 1;
    let CD_DURATION_MIN = settings.cdDurationMin || 30;

    let script_state = Storage.get(KEY_STATE, 'IDLE');
    let participantsJoined = Storage.get(KEY_JOINED_COUNT, 0);
    let runsLeft = Storage.get(KEY_RUNS_LEFT, TOTAL_RUNS);
    let cdTimeLeft = Storage.get(KEY_CD_TIME, 0);

    let activitiesUrl = `/World/Popmundo.aspx/Locale/Activities/${LOCALE_ID}`;
    let createUrl = `/World/Popmundo.aspx/Locale/CreateActivity/${LOCALE_ID}`;
    const localeUrl = '/World/Popmundo.aspx/Locale';
    const mainUrl = '/World/Popmundo.aspx';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function updateConstantsAndLinks(newLocaleId, newActivityName) {
        LOCALE_ID = newLocaleId;
        ACTIVITY_NAME = newActivityName;
        activitiesUrl = `/World/Popmundo.aspx/Locale/Activities/${LOCALE_ID}`;
        createUrl = `/World/Popmundo.aspx/Locale/CreateActivity/${LOCALE_ID}`;
    }

    function setState(s) {
        Storage.set(KEY_STATE, s);
        script_state = s;
    }

    function showPopup(message, duration = 3000) {
        addStyle(`#popscript-notification{position:fixed;bottom:10px;right:10px;background:linear-gradient(135deg,#ff6fa1,#ff4081);color:#fff;padding:10px 16px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:1000000;font-weight:500;font-size:0.9rem;opacity:0;transform:translateY(10px);transition:opacity .3s ease,transform .3s ease;max-width:90vw;} #popscript-notification.show{opacity:1;transform:translateY(0)}`);
        let $popup = $p('#popscript-notification');
        if (!$popup.length) {
            $popup = $p('<div id="popscript-notification"></div>');
            $p('body').append($popup);
        }
        $popup.html(message).addClass('show');
        setTimeout(() => {
            $popup.removeClass('show');
            setTimeout(() => $popup.remove(), 500);
        }, duration);
    }

    function resetCycle() {
        Storage.set(KEY_STATE, 'IDLE');
        Storage.set(KEY_JOINED_COUNT, 0);
        Storage.set(KEY_RESUME_FLAG, false);
        Storage.set(KEY_PREV_STATE, 'IDLE');
        Storage.set(KEY_CD_TIME, 0);
        script_state = 'IDLE';
        participantsJoined = 0;
        document.title = "Popmundo";
    }

    async function switchCharacter(targetUID) {
        const $ddl = $p("select[id$='ucCharacterBar_ddlCurrentCharacter']");
        const $btn = $p("input[id$='ucCharacterBar_btnChangeCharacter']");

        console.log("[PopScript] Switching to UID:", targetUID);
        if ($ddl.length && $btn.length && $ddl.val() !== targetUID) {
            showPopup(`Switching character... Please wait ${SWITCH_CHARACTER_DELAY/1000}s`, SWITCH_CHARACTER_DELAY);

            Storage.set(KEY_RESUME_FLAG, true);
            Storage.set(KEY_PREV_STATE, script_state);

            await delay(1200);
            $ddl.val(targetUID).trigger('change');
            await delay(1200);
            $btn[0].click();

            return true;
        }
        return false;
    }

    function findActivityLink() {
        const $table = $p('#tblupcoming');
        if ($table.length === 0) return null;
        let link = null;
        $table.find('a').each(function () {
            if ($p(this).text().trim().includes(ACTIVITY_NAME)) {
                link = $p(this);
                return false;
            }
        });
        return link;
    }

    async function waitForActivityLink(maxAttempts = RETRY_MAX_ATTEMPTS, interval = RETRY_INTERVAL) {
        let link = null;
        for (let i = 0; i < maxAttempts; i++) {
            link = findActivityLink();
            if (link && link.length) return link;
            await delay(interval);
        }
        return null;
    }

    function updateUIDsInPanel() {
        const currentChars = {};
        $p("select[id$='ucCharacterBar_ddlCurrentCharacter'] option").each(function() {
            const name = $p(this).text().trim();
            const uid = $p(this).val();
            if (uid !== '0' && name) currentChars[name] = uid;
        });
        $p('#ownerCharUID').val(currentChars[$p('#ownerCharName').val()] || 'UID Bulunamadı');
        $p('.participant-row').each(function() {
            const $row = $p(this);
            const name = $row.find('.participant-name').val();
            $row.find('.participant-uid').val(currentChars[name] || 'UID Bulunamadı');
        });
    }

    function saveSettings() {
        const selectedActivityValue = $p('#activitySelect').val();
        const newSettings = {
            localeId: $p('#localeIDInput').val().trim(),
            activityName: $p('#activityNameInput').val().trim(),
            activityValue: selectedActivityValue,
            ownerCharName: $p('#ownerCharName').val().trim(),
            ownerCharUID: $p('#ownerCharUID').val().trim(),
            totalRuns: parseInt($p('#totalRunsInput').val()) || 1,
            cdDurationMin: parseInt($p('#cdDurationInput').val()) || 30,
            participants: []
        };
        $p('.participant-row').each(function() {
            const name = $p(this).find('.participant-name').val().trim();
            const uid = $p(this).find('.participant-uid').val().trim();
            if (name && uid && !uid.includes('Bulunamadı')) {
                newSettings.participants.push({ name, uid });
            }
        });

        settings = newSettings;
        Storage.set(KEY_SETTINGS, settings);
        updateConstantsAndLinks(settings.localeId, settings.activityName);
        ACTIVITY_VALUE = settings.activityValue;
        TOTAL_RUNS = settings.totalRuns;
        CD_DURATION_MIN = settings.cdDurationMin;
    }

    // PART 2: UI Creation and Styles

    function createSettingsPanel() {
        addStyle(`
/* iOS-optimized styles */
#popscript-settings-panel,
#popscript-settings-panel *,
#popscript-notification,
.ui-dialog,
.ui-dialog * {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  -webkit-font-smoothing: antialiased !important;
  line-height: 1.4 !important;
  -webkit-tap-highlight-color: transparent !important;
}

#popscript-settings-button {
  position: fixed;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  background: #f7f7f7;
  color: #333;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}

.ui-dialog {
  border-radius: 12px !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3) !important;
  max-width: 95vw !important;
}

.ui-dialog .ui-dialog-titlebar {
  background: linear-gradient(135deg,#ff4081,#d81b60) !important;
  color: #fff !important;
  font-size: 1rem !important;
  padding: 12px !important;
  border: none !important;
  touch-action: manipulation !important;
}

#popscript-settings-panel.ui-widget-content {
  background: #fff;
  padding: 16px;
  border-radius: 0 0 12px 12px;
  max-height: 70vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

#popscript-settings-panel h3 {
  color: #d81b60;
  font-size: 1rem;
  margin: 12px 0 8px 0;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#popscript-settings-panel .box {
  border-radius: 8px;
  padding: 12px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

#popscript-settings-panel input[type=text],
#popscript-settings-panel input[type=number],
#popscript-settings-panel select {
  padding: 10px 12px;
  min-height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px !important;
  width: 100%;
  box-sizing: border-box;
  touch-action: manipulation;
}

#ownerCharUID, .participant-uid {
  background: #fce4ec;
  color: #ad1457;
  font-size: 14px !important;
}

.field-inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.field-inline label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.loop-settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.loop-settings-group input {
  text-align: center;
}

#popscript-settings-panel .warning {
  font-size: 13px;
  color: #666;
  margin: 12px 0;
  line-height: 1.5;
  padding: 10px;
  background: #fff3cd;
  border-radius: 6px;
}

#popscript-settings-panel .warning span {
  font-weight: 700;
  color: #d81b60;
}

.participant-row {
  display: grid;
  grid-template-columns: 1fr 120px 44px;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}

.remove-participant-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: #f8bbd0;
  color: #880e4f;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  touch-action: manipulation;
}

#popscript-settings-panel button {
  border-radius: 8px;
  font-size: 16px !important;
  padding: 12px;
  font-weight: 600;
  border: none;
  min-height: 44px;
  touch-action: manipulation;
  cursor: pointer;
}

#save-settings-btn {
  background: #4db6ac;
  color: #fff;
  width: 100%;
  margin-top: 8px;
}

#start-script-btn {
  background: #d81b60;
  color: #fff;
  width: 100%;
  font-weight: 700;
  margin-top: 12px;
}

#add-participant-btn {
  background: #ff80ab;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  min-height: 36px;
}

.input-group {
  padding: 8px 0;
  margin-bottom: 8px;
}

.input-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: #555;
  font-weight: 600;
}

#loopCountdownDisplay {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  text-align: center;
  margin: 12px 0;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 8px;
}
`);

        const uiHtml = `
<div id="popscript-settings-panel" title="PopScript: Aktivite Otomasyonu" style="display:none;">

<div class="box">
<h3>Global Script Ayarları</h3>
<div class="input-group">
<label for="localeIDInput">Locale ID (Mekan ID):</label>
<input type="text" id="localeIDInput" value="${LOCALE_ID}" placeholder="Mekan ID">
</div>
<div class="input-group">
<label for="activityNameInput">Aktivite Adı:</label>
<input type="text" id="activityNameInput" value="${ACTIVITY_NAME}" placeholder="0000TTT">
</div>

<div class="input-group">
<label for="activitySelect">Aktivite Seçin:</label>
<select id="activitySelect">
<option value="2">Beach Soccer</option>
<option value="1">Beach Volleyball</option>
<option value="3">Beach Tennis</option>
<option value="14">Basketball</option>
<option value="12">8-ball</option>
<option value="6">Dance Off</option>
<option value="16">Ice Hockey</option>
</select>
</div>
<button id="save-settings-btn">Global Ayarları Kaydet</button>
</div>

<p class="warning">
UYARI: Tüm karakterler Mekan ID <span id="currentLocaleDisplay">${LOCALE_ID}</span> konumunda olmalıdır.
Aktivite adı: <span id="currentActivityNameDisplay">${ACTIVITY_NAME}</span>.
<strong>Kalan Çalıştırma: <span id="currentRunsDisplay">${runsLeft}</span></strong>
</p>

<div class="field-inline">
<label for="ownerCharName">Owner İsim:</label>
<input type="text" id="ownerCharName" value="${settings.ownerCharName || ''}">
</div>

<div class="field-inline">
<label for="ownerCharUID">Owner UID:</label>
<input type="text" id="ownerCharUID" value="${settings.ownerCharUID || 'UID Bulunamadı'}" readonly>
</div>

<div class="box">
<h3>Döngü Ayarları</h3>
<div class="loop-settings-group">
<div class="input-group">
<label for="totalRunsInput">Toplam Çalıştırma:</label>
<input type="number" id="totalRunsInput" value="${TOTAL_RUNS}" min="1">
</div>
<div class="input-group">
<label for="cdDurationInput">Geri Sayım (dakika):</label>
<input type="number" id="cdDurationInput" value="${CD_DURATION_MIN}" min="1">
</div>
</div>
</div>

<div class="box">
<h3>
Katılımcılar
<button id="add-participant-btn">+</button>
</h3>
<div id="participants-list"></div>
</div>

<button id="start-script-btn">Başlat</button>

<div class="box">
<h3>Loop Countdown</h3>
<p id="loopCountdownDisplay">Not running</p>
</div>

</div>

<button id="popscript-settings-button">⚽</button>
`;
        $p('body').append(uiHtml);
        $p('#activitySelect').val(ACTIVITY_VALUE);

        function addParticipantRow(name = '', uid = '') {
            const row = $p(`
<div class="participant-row">
<input type="text" class="participant-name" value="${name}" placeholder="Katılımcı Adı">
<input type="text" class="participant-uid" value="${uid || 'UID Bulunamadı'}" readonly>
<button class="remove-participant-btn">X</button>
</div>
`);
            $p('#participants-list').append(row);
        }

        (settings.participants || []).forEach(p => addParticipantRow(p.name, p.uid));

        $p('#add-participant-btn').on('click touchend', e => {
            e.preventDefault();
            addParticipantRow();
            updateUIDsInPanel();
        });

        $p('#participants-list').on('click touchend', '.remove-participant-btn', function(e) {
            e.preventDefault();
            $p(this).closest('.participant-row').remove();
            saveSettings();
        });

        $p('#ownerCharName, .participant-name').on('input change', updateUIDsInPanel);

        $p('#save-settings-btn').on('click touchend', (e) => {
            e.preventDefault();
            const newLocaleId = $p('#localeIDInput').val().trim();
            if (newLocaleId && newLocaleId.match(/^\d+$/)) {
                saveSettings();
                $p('#currentLocaleDisplay').text(settings.localeId);
                $p('#currentActivityNameDisplay').text(settings.activityName);
                $p('#currentRunsDisplay').text(TOTAL_RUNS);
                showPopup(`Global ayarlar kaydedildi!`, 3000);
            } else {
                showPopup("Hata: Geçersiz Locale ID", 3000);
            }
        });

        const $selectedOption = $p("select[id$='ucCharacterBar_ddlCurrentCharacter'] option:selected");
        if ($selectedOption.val() && $selectedOption.val() !== '0' && !$p('#ownerCharName').val()) {
            $p('#ownerCharName').val($selectedOption.text().trim());
        }

        updateUIDsInPanel();

        $p('#popscript-settings-panel').dialog({
            autoOpen: false,
            modal: true,
            width: Math.min(420, window.innerWidth - 40),
            close: saveSettings
        });

        $p('#popscript-settings-button').on('click touchend', (e) => {
            e.preventDefault();
            updateUIDsInPanel();
            $p('#popscript-settings-panel').dialog('open');
        });

        $p('#start-script-btn').on('click touchend', (e) => {
            e.preventDefault();
            saveSettings();
            if (settings.ownerCharUID.includes('Bulunamadı') || settings.participants.some(p => p.uid.includes('Bulunamadı'))) {
                alert('Hata: UID Bulunamadı!');
                return;
            }
            if ((settings.participants || []).length === 0) {
                alert('Lütfen en az bir katılımcı ekleyin.');
                return;
            }
            if (!settings.localeId || !settings.activityName) {
                alert('Lütfen Locale ID ve Aktivite Adını girin.');
                return;
            }

            resetCycle();
            Storage.set(KEY_RUNS_LEFT, TOTAL_RUNS);
            runsLeft = TOTAL_RUNS;
            setState('CREATING_ACTIVITY');
            $p('#popscript-settings-panel').dialog('close');
            location.reload();
        });
    }

    function isMainPopmundoPage() {
        const path = window.location.pathname;
        return path === mainUrl || path === mainUrl + '/';
    }

    // PART 3: Main Script Logic - runScript()

    async function runScript() {
        script_state = Storage.get(KEY_STATE, 'IDLE');
        runsLeft = Storage.get(KEY_RUNS_LEFT, TOTAL_RUNS);

        if (cdTimeLeft === undefined || cdTimeLeft === null) {
            cdTimeLeft = Storage.get(KEY_CD_TIME, 0);
        }

        const currentUrl = window.location.href;
        const currentUID = $p("select[id$='ucCharacterBar_ddlCurrentCharacter']").val();

        // ===== COUNTDOWN STATE =====
        if (script_state === 'COUNTDOWN') {
            if (typeof cdTimeLeft === 'undefined' || cdTimeLeft === null) {
                cdTimeLeft = Storage.get(KEY_CD_TIME, 0);
            }

            // Check for winning point trigger (English and Turkish)
            const $rowsEnglish = $p("tr:contains('scores the winning point')");
            const $rowsTurkish = $p("tr:contains('galibiyet sayısını yaptı')");
            if ($rowsEnglish.length > 0 || $rowsTurkish.length > 0) {
                showPopup("🏆 Winning point detected! Skipping countdown...");
                console.log("[PopScript] Winning point detected – skipping countdown!");
                Storage.set(KEY_STATE, 'CREATING_ACTIVITY');
                Storage.set(KEY_JOINED_COUNT, 0);
                Storage.set(KEY_CD_TIME, 0);
                Storage.set(KEY_RESUME_FLAG, true);
                Storage.set(KEY_PREV_STATE, 'CREATING_ACTIVITY');
                window.location.reload();
                return;
            }

            if (cdTimeLeft <= 0) {
                if ((runsLeft || 0) > 0) {
                    setState('CREATING_ACTIVITY');
                    Storage.set(KEY_JOINED_COUNT, 0);
                    participantsJoined = 0;
                    Storage.set(KEY_CD_TIME, 0);
                    Storage.set(KEY_RESUME_FLAG, true);
                    Storage.set(KEY_PREV_STATE, 'CREATING_ACTIVITY');
                    window.location.reload();
                    return;
                } else {
                    resetCycle();
                    showPopup('All runs finished - script stopped.', 4000);
                    document.title = 'Popmundo - Automation Complete';
                    return;
                }
            }

            const mins = Math.floor(cdTimeLeft / 60);
            const secs = cdTimeLeft % 60;
            const countdownText = `Next run in ${mins}:${secs.toString().padStart(2,'0')} (Runs left: ${runsLeft})`;

            $p('#loopCountdownDisplay').text(countdownText);
            document.title = `⏳ ${mins}:${secs.toString().padStart(2,'0')} | Runs left: ${runsLeft}`;

            Storage.set(KEY_CD_TIME, cdTimeLeft);

            cdTimeLeft--;
            setTimeout(runScript, 1000);
            return;
        }

        // ===== CREATING_ACTIVITY STATE =====
        if (script_state === 'CREATING_ACTIVITY') {
            if (currentUID !== settings.ownerCharUID) {
                await switchCharacter(settings.ownerCharUID);
                return;
            }

            Storage.set(KEY_JOINED_COUNT, 0);
            participantsJoined = 0;

            Storage.set(KEY_STATE, 'FORM_FILLING');
            window.location.href = createUrl;
            return;
        }

        // ===== FORM_FILLING STATE =====
        if (script_state === 'FORM_FILLING' && currentUrl.includes(createUrl)) {
            await delay(DELAY_MEDIUM);
            const $ddl = $p('#ctl00_cphLeftColumn_ctl00_ddlActivityType');

            if ($ddl.length && $ddl.val() !== ACTIVITY_VALUE) {
                $ddl.val(ACTIVITY_VALUE);
                if (typeof __doPostBack === 'function') {
                    __doPostBack('ctl00$cphLeftColumn$ctl00$ddlActivityType','');
                } else {
                    $ddl[0].dispatchEvent(new Event('change', { bubbles: true }));
                }
                await delay(DELAY_LONG);
                return;
            }

            if ($ddl.val() === ACTIVITY_VALUE) {
                await delay(DELAY_SHORT);
                $p('#ctl00_cphLeftColumn_ctl00_txtActivityName').val(ACTIVITY_NAME);
                $p('#ctl00_cphLeftColumn_ctl00_txtTeam1Name').val('001');
                $p('#ctl00_cphLeftColumn_ctl00_txtTeam2Name').val('002');

                await delay(DELAY_SHORT);
                $p('#ctl00_cphLeftColumn_ctl00_btnCreateActivity')[0].click();
                Storage.set(KEY_STATE, 'SWITCH_TO_PARTICIPANT');
                await delay(DELAY_LONG);
                window.location.href = activitiesUrl;
                return;
            }
        }

        // ===== PARTICIPANT JOINING STATES =====
        if (['SWITCH_TO_PARTICIPANT','JOIN_GAME_PENDING','JOIN_GAME'].includes(script_state)) {
            if (participantsJoined >= settings.participants.length) {
                Storage.set(KEY_STATE, 'SWITCH_TO_OWNER');
                script_state = 'SWITCH_TO_OWNER';
                runScript();
                return;
            }

            const target = settings.participants[participantsJoined];
            if (currentUID !== target.uid || script_state === 'SWITCH_TO_PARTICIPANT') {
                Storage.set(KEY_STATE, 'JOIN_GAME_PENDING');
                if (await switchCharacter(target.uid)) return;
            }

            if (script_state === 'JOIN_GAME_PENDING') {
                Storage.set(KEY_STATE, 'JOIN_GAME');
                script_state = 'JOIN_GAME';
            }

            await delay(DELAY_SHORT);

            if (!currentUrl.includes('/Locale/Activity/')) {
                if (!currentUrl.includes(activitiesUrl)) {
                    await delay(DELAY_SHORT);
                    window.location.href = activitiesUrl;
                    return;
                }
                const $link = await waitForActivityLink();
                if ($link && $link.length) {
                    await delay(DELAY_SHORT);
                    $link[0].click();
                    await delay(DELAY_MEDIUM);
                    return;
                } else {
                    window.location.reload();
                    return;
                }
            }

            const $join = $p('#ctl00_cphLeftColumn_ctl00_btnSignUp');
            if ($join.length) {
                await delay(DELAY_SHORT);
                participantsJoined++;
                Storage.set(KEY_JOINED_COUNT, participantsJoined);
                Storage.set(KEY_STATE, 'SWITCH_TO_PARTICIPANT');
                $join[0].click();
                showPopup(`JOINED! ${target.name}`);
                await delay(DELAY_LONG);
                runScript();
                return;
            } else {
                participantsJoined++;
                Storage.set(KEY_JOINED_COUNT, participantsJoined);
                Storage.set(KEY_STATE, 'SWITCH_TO_PARTICIPANT');
                await delay(DELAY_MEDIUM);
                runScript();
                return;
            }
        }

        // ===== SWITCH_TO_OWNER STATE =====
        if (script_state === 'SWITCH_TO_OWNER') {
            if (currentUID !== settings.ownerCharUID) {
                Storage.set(KEY_STATE, 'LOCK_AND_START_PENDING');
                await switchCharacter(settings.ownerCharUID);
                return;
            }
            Storage.set(KEY_STATE, 'LOCK_AND_START_PENDING');
            script_state = 'LOCK_AND_START_PENDING';
            runScript();
            return;
        }

        // ===== LOCK_AND_START_PENDING STATE =====
        if (script_state === 'LOCK_AND_START_PENDING') {
            if (participantsJoined < settings.participants.length) {
                Storage.set(KEY_STATE, 'SWITCH_TO_PARTICIPANT');
                script_state = 'SWITCH_TO_PARTICIPANT';
                runScript();
                return;
            }
            Storage.set(KEY_STATE, 'LOCK_AND_START');
            script_state = 'LOCK_AND_START';
        }

        // ===== LOCK_AND_START STATE =====
        if (script_state === 'LOCK_AND_START' && currentUID === settings.ownerCharUID) {
            if (!currentUrl.includes('/Locale/Activity/')) {
                if (!currentUrl.includes(activitiesUrl)) {
                    await delay(DELAY_SHORT);
                    window.location.href = activitiesUrl;
                    return;
                }
                const $link = await waitForActivityLink();
                if ($link && $link.length) {
                    await delay(DELAY_SHORT);
                    $link[0].click();
                    await delay(DELAY_MEDIUM);
                    return;
                } else {
                    Storage.set(KEY_STATE, 'FINISHED');
                    runScript();
                    return;
                }
            }

            await delay(DELAY_SHORT);
            const $lock = $p('#ctl00_cphLeftColumn_ctl00_btnLock');
            const $start = $p('#ctl00_cphLeftColumn_ctl00_btnStart');

            if ($lock.length) {
                await delay(DELAY_SHORT);
                $lock[0].click();
                await delay(DELAY_MEDIUM);
                return;
            } else if ($start.length) {
                await delay(DELAY_SHORT);
                $start[0].click();
                await delay(DELAY_LONG);
            } else {
                Storage.set(KEY_STATE, 'FINISHED');
                runScript();
            }
        }

        // ===== FINISHED STATE =====
        if (script_state === 'FINISHED') {
            runsLeft--;
            Storage.set(KEY_RUNS_LEFT, runsLeft);
            script_state = 'FINISHED';

            $p('#currentRunsDisplay').text(runsLeft);

            if (runsLeft > 0) {
                cdTimeLeft = CD_DURATION_MIN * 60;

                Storage.set(KEY_CD_TIME, cdTimeLeft);
                setState('COUNTDOWN');

                $p('#loopCountdownDisplay').text(
                    `Next run in ${CD_DURATION_MIN}:00 (Runs left: ${runsLeft})`
                );
                showPopup(
                    `Döngü başarıyla tamamlandı. Kalan: ${runsLeft}. Geri sayım başladı...`,
                    5000
                );

                runScript();
            } else {
                resetCycle();
                Storage.set(KEY_RUNS_LEFT, TOTAL_RUNS);
                showPopup(
                    `Tüm döngüler tamamlandı (${TOTAL_RUNS}). Script durduruldu.`,
                    5000
                );
                document.title = "Popmundo - Automation Complete";
            }
        }
    }

    // PART 4: Page Ready Initialization and Helper Functions

    // ===== PAGE READY INITIALIZATION =====
    $p(document).ready(async function() {
        await delay(1000); // Extra delay for iOS

        const currentUrl = window.location.href;
        const resumeFlag = Storage.get(KEY_RESUME_FLAG, false);

        createSettingsPanel();
        updateConstantsAndLinks(LOCALE_ID, ACTIVITY_NAME);

        // Auto-click Yes on dialogs
        const $yesButton = $p('.ui-dialog-buttonset button:contains("Yes")');
        if ($yesButton.is(':visible')) {
            $yesButton[0].click();
        }

        if (resumeFlag) {
            const prev = Storage.get(KEY_PREV_STATE, 'IDLE');

            if (prev === 'CREATING_ACTIVITY') {
                if ($p("select[id$='ucCharacterBar_ddlCurrentCharacter']").val() !== settings.ownerCharUID) {
                    await switchCharacter(settings.ownerCharUID);
                    return;
                }
            }

            let targetUrl = localeUrl;
            if (['JOIN_GAME_PENDING','JOIN_GAME','SWITCH_TO_PARTICIPANT',
                 'LOCK_AND_START_PENDING','LOCK_AND_START'].includes(prev)) {
                targetUrl = activitiesUrl;
            } else if (prev === 'CREATING_ACTIVITY' || prev === 'FORM_FILLING') {
                targetUrl = createUrl;
            }

            if (isMainPopmundoPage()) {
                await delay(REDIRECT_DELAY);
            }

            if (!currentUrl.includes(targetUrl) || isMainPopmundoPage()) {
                Storage.set(KEY_RESUME_FLAG, false);
                Storage.set(KEY_PREV_STATE, 'IDLE');
                window.location.href = targetUrl;
                return;
            }

            Storage.set(KEY_RESUME_FLAG, false);
            Storage.set(KEY_PREV_STATE, 'IDLE');
        }

        if (['CREATING_ACTIVITY','FORM_FILLING','SWITCH_TO_PARTICIPANT',
             'JOIN_GAME_PENDING','JOIN_GAME','SWITCH_TO_OWNER',
             'LOCK_AND_START','LOCK_AND_START_PENDING','COUNTDOWN']
            .includes(script_state)) {
            await delay(500);
            runScript();
        }
    });

// ===== AUTO CONFIRM POPUP (English and Turkish) =====
    (function autoConfirmPopup() {
        const checkInterval = setInterval(() => {
            const $dialog = $p('.ui-dialog:visible');
            if ($dialog.length) {
                // Check for English "Yes" button
                let $yesBtn = $dialog.find('button.ui-button:contains("Yes")');
                // Check for Turkish "Evet" button
                if (!$yesBtn.length) {
                    $yesBtn = $dialog.find('button.ui-button:contains("Evet")');
                }
                if ($yesBtn.length) {
                    $yesBtn[0].click();
                    clearInterval(checkInterval);
                }
            }
        }, 1000);
    })();

    // ===== WINNING POINT TRIGGER CHECK =====
    function checkForWinningPointTrigger() {
        const $panel = $p('#ctl00_cphLeftColumn_ctl00_pnlMatch');
        if (!$panel.length || script_state !== 'IDLE' || runsLeft <= 0) return;

        const $rows = $panel.find('table.data tbody tr');
        let triggerFound = false;

        $rows.each(function () {
            const $tds = $p(this).find('td');
            if ($tds.length >= 2) {
                const eventText = $tds.eq(1).text().trim();
                if (eventText.endsWith('scores the winning point.') ||
                    eventText.endsWith('galibiyet sayısını yaptı.')) {
                    triggerFound = true;
                    return false;
                }
            }
        });

        if (triggerFound) {
            console.log('[PopScript] Winning point detected – triggering next match.');
            showPopup('🏆 Winning point detected! Starting next match...');
            Storage.set(KEY_STATE, 'CREATING_ACTIVITY');
            Storage.set(KEY_JOINED_COUNT, 0);
            Storage.set(KEY_RESUME_FLAG, true);
            Storage.set(KEY_PREV_STATE, 'CREATING_ACTIVITY');
            window.location.reload();
        }
    }

})();