// ==UserScript==
// @name         CrunchySkip
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skip Intros, Credits and After Credits on Crunchyroll automatically!
// @author       Kriimaar
// @match        https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561075/CrunchySkip.user.js
// @updateURL https://update.greasyfork.org/scripts/561075/CrunchySkip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // I18N / CONFIG
    const LANG = {
        de: {
            langName: 'Deutsch',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'Intro automatisch überspringen',
            autoSkipCredits: 'Credits automatisch überspringen',
            skipAfterCredits: 'Nach den Credits überspringen',
            uiLanguage: 'UI-Sprache',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'Skip-Delay',
        },
        en: {
            langName: 'English',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'Auto Skip Intro',
            autoSkipCredits: 'Auto Skip Credits',
            skipAfterCredits: 'Skip After Credits',
            uiLanguage: 'UI Language',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'Skip delay',
        },
        es: {
            langName: 'Español',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'Saltar intro automáticamente',
            autoSkipCredits: 'Saltar créditos automáticamente',
            skipAfterCredits: 'Saltar después de los créditos',
            uiLanguage: 'Idioma de la UI',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'Retraso de salto',
        },
        fr: {
            langName: 'Français',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'Passer l’intro automatiquement',
            autoSkipCredits: 'Passer les crédits automatiquement',
            skipAfterCredits: 'Passer après le générique',
            uiLanguage: 'Langue de l’UI',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'Délai de saut',
        },
        it: {
            langName: 'Italiano',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'Salta intro automaticamente',
            autoSkipCredits: 'Salta crediti automaticamente',
            skipAfterCredits: 'Salta dopo i titoli di coda',
            uiLanguage: 'Lingua UI',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'Ritardo salto',
        },
        ja: {
            langName: '日本語',
            proTitle: 'CrunchySkip',
            autoSkipIntro: 'オープニング自動スキップ',
            autoSkipCredits: 'エンディング自動スキップ',
            skipAfterCredits: 'エンディング後をスキップ',
            uiLanguage: 'UI 言語',
            ok: 'OK',
            footer: 'Created by @Kriimaar',
            skipDelay: 'スキップ遅延',
        },
    };
    const LANG_KEYS = ['de', 'en', 'es', 'fr', 'it', 'ja'];

    const state = {
        uiLang: GM_getValue('cr_uiLang', 'de'),
        autoSkipIntro: GM_getValue('cr_autoSkipIntro', false),
        autoSkipOutro: GM_getValue('cr_autoSkipOutro', false),
        autoSkipAfterCredits: GM_getValue('cr_autoSkipAfterCredits', false),
        skipDelaySec: GM_getValue('cr_skipDelaySec', 0), // 0–10 Sekunden
    };

    const t = (k) => (LANG[state.uiLang] && LANG[state.uiLang][k]) || LANG.de[k] || k;
    const log = (...a) => console.log('[CrunchySkip]', ...a);

    const save = (k, v) => {
        log('state change:', k, '=>', v);
        state[k] = v;
        GM_setValue('cr_' + k, v);
    };

    let guiBtn = null;
    let menu = null;

    const cooldown = { last: 0, ms: 2500 };
    const inCooldown = () => Date.now() - cooldown.last < cooldown.ms;

    let creditsSkippedThisEpisode = false;
    let episodeId = null;

    // UI HELPER (TOAST)
    function toast(msg) {
        log('toast:', msg);
        const el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText =
            'position:fixed;top:16px;right:16px;z-index:99999;background:rgba(13,13,18,.95);color:#fff;' +
            'padding:6px 12px;border-radius:999px;font-size:12px;font-weight:500;opacity:0;transition:.2s;';
        document.body.appendChild(el);
        requestAnimationFrame(() => (el.style.opacity = '1'));
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 180);
        }, 1100);
    }

    // EPISODE TRACKING
    function episodeIdFromUrl() {
        try {
            return window.top.location.pathname || location.pathname || '';
        } catch {
            return location.pathname || '';
        }
    }

    function resetEpisodeIfNeeded() {
        const id = episodeIdFromUrl();
        if (id !== episodeId) {
            log('episode changed:', episodeId, '=>', id);
            episodeId = id;
            creditsSkippedThisEpisode = false;
        }
    }

    // SKIP DELAY
    function scheduleSkip(kind, clickFn) {
        const delayMs = (state.skipDelaySec || 0) * 1000;
        if (!delayMs) {
            log('scheduleSkip immediate for', kind);
            clickFn();
            return;
        }
        log('scheduleSkip in', delayMs, 'ms for', kind);
        setTimeout(() => {
            log('scheduled skip fired for', kind);
            clickFn();
        }, delayMs);
    }

    // SKIP LOGIC
    function triggerNextEpisode() {
        log('triggerNextEpisode() called');
        const btn =
            document.querySelector('[data-testid="next-episode-button"]') ||
            document.querySelector('[data-testid="vilos-next_button"]') ||
            document.querySelector('[aria-label*="Next Episode"]');
        if (btn) {
            log('next episode button found, clicking');
            btn.click();
            toast('Next episode');
            return;
        }
        log('next button not found, sending Shift+N');
        const ev = new KeyboardEvent('keydown', {
            key: 'N',
            code: 'KeyN',
            keyCode: 78,
            which: 78,
            shiftKey: true,
            bubbles: true,
        });
        document.dispatchEvent(ev);
        toast('Next episode (Shift+N)');
    }

    function checkSkip() {
        resetEpisodeIfNeeded();
        const video = document.querySelector('video');
        if (!video) return;

        const wrap = document.querySelector('[data-testid="skipButton"]');
        if (wrap) {
            const label = wrap.querySelector('[data-testid="skipIntroText"]');
            const txt = (label?.textContent || '').trim();
            const upper = txt.toUpperCase();
            const cur = video.currentTime || 0;
            const dur = video.duration || 0;
            const isOutroByTime = dur && cur > dur / 2;

            const isIntroLabel = upper.includes('OPENING') || upper.includes('INTRO');
            const isCreditsLabel = upper.includes('CREDITS') || upper.includes('ENDING') || upper.includes('OUTRO');

            const asIntro = isIntroLabel || (!isCreditsLabel && !isOutroByTime);
            const asOutro = isCreditsLabel || isOutroByTime;

            log('checkSkip(): label=', txt, 'cur/dur=', cur, '/', dur, 'asIntro=', asIntro, 'asOutro=', asOutro);

            if (!inCooldown()) {
                if (asIntro && state.autoSkipIntro) {
                    log('autoSkipIntro active, scheduling skip');
                    scheduleSkip('intro', () => {
                        (wrap.querySelector('[role="button"]') || wrap).click();
                        cooldown.last = Date.now();
                        toast('Intro auto skipped');
                    });
                } else if (asOutro && state.autoSkipOutro) {
                    log('autoSkipOutro active, scheduling skip');
                    scheduleSkip('outro', () => {
                        (wrap.querySelector('[role="button"]') || wrap).click();
                        cooldown.last = Date.now();
                        creditsSkippedThisEpisode = true;
                        toast('Credits auto skipped');
                    });
                }
            } else {
                log('in cooldown, no auto skip');
            }
        }

        if (state.autoSkipAfterCredits && creditsSkippedThisEpisode && video.duration) {
            const remaining = video.duration - (video.currentTime || 0);
            log('afterCredits check: remaining=', remaining);
            if (remaining > 10 && remaining < 60) {
                log('afterCredits condition met, jumping to next episode');
                creditsSkippedThisEpisode = false;
                triggerNextEpisode();
            }
        }
    }

    // TOGGLE STATE
    function setSwitch(row, on) {
        const pill = row.querySelector('.cs-switch');
        if (!pill) return;
        pill.textContent = on ? 'AN' : 'AUS';
        pill.style.background = on ? 'rgba(0,176,120,0.9)' : 'rgba(90,90,102,0.95)';
    }

    function toggleFlag(key, row) {
        log('toggleFlag:', key, 'current=', state[key]);
        save(key, !state[key]);
        setSwitch(row, state[key]);
        toast(state[key] ? 'AN' : 'AUS');
    }

    // LANGUAGE HANDLING
    function setUiLang(lang) {
        if (!LANG_KEYS.includes(lang)) return;
        log('setUiLang:', state.uiLang, '=>', lang);
        save('uiLang', lang);
        updateMenu();
        showMenu();
    }

    // MENU UPDATE
    function updateMenu() {
        if (!menu) return;
        log('updateMenu()');
        const titleEl = menu.querySelector('#cs-title');
        const footer = menu.querySelector('#cs-footer');
        const okBtn = menu.querySelector('#cs-ok');
        const intro = menu.querySelector('#cs-intro');
        const outro = menu.querySelector('#cs-outro');
        const after = menu.querySelector('#cs-after');
        const langCur = menu.querySelector('#cs-lang-current');
        const langList = menu.querySelector('#cs-lang-list');
        const delayLabel = menu.querySelector('#cs-delay-label');
        const delayRange = menu.querySelector('#cs-delay-range');
        const delayInput = menu.querySelector('#cs-delay-input');

        if (titleEl) titleEl.textContent = t('proTitle');
        if (footer) footer.textContent = t('footer');
        if (okBtn) okBtn.textContent = t('ok');

        if (intro) {
            intro.querySelector('.cs-label').textContent = t('autoSkipIntro');
            setSwitch(intro, state.autoSkipIntro);
        }
        if (outro) {
            outro.querySelector('.cs-label').textContent = t('autoSkipCredits');
            setSwitch(outro, state.autoSkipOutro);
        }
        if (after) {
            after.querySelector('.cs-label').textContent = t('skipAfterCredits');
            setSwitch(after, state.autoSkipAfterCredits);
        }

        if (delayLabel) delayLabel.textContent = state.skipDelaySec.toFixed(1) + ' s';
        if (delayRange) delayRange.value = state.skipDelaySec;
        if (delayInput) delayInput.value = state.skipDelaySec;

        if (langCur) langCur.textContent = `${t('uiLanguage')}: ${LANG[state.uiLang].langName}`;

        if (langList && !langList.dataset.built) {
            log('build language list');
            langList.innerHTML = '';
            LANG_KEYS.forEach((key) => {
                const div = document.createElement('div');
                div.textContent = LANG[key].langName;
                div.style.cssText =
                    'padding:5px 8px;border-radius:6px;font-size:12px;cursor:pointer;color:#f3f3f7;';
                div.addEventListener('mouseenter', () => (div.style.background = 'rgba(158,7,255,0.18)'));
                div.addEventListener('mouseleave', () => (div.style.background = 'transparent'));
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setUiLang(key);
                    langList.style.display = 'none';
                });
                langList.appendChild(div);
            });
            langList.dataset.built = '1';
        }
    }

    // MENU BUILD
    function buildMenu() {
        log('buildMenu()');
        menu = document.createElement('div');
        menu.id = 'cs-menu';
        menu.style.cssText =
            'position:fixed;display:none;opacity:0;transition:.15s;z-index:99999;pointer-events:auto;';

        menu.innerHTML = `
      <div style="
        background:#08090d;
        border-radius:14px;
        padding:10px 12px 8px;
        min-width:260px;max-width:280px;
        box-shadow:0 18px 40px rgba(0,0,0,0.85);
        font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        font-size:13px;color:#f4f4f8;
        border:1px solid rgba(255,255,255,0.05);
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="width:8px;height:8px;border-radius:999px;background:#00d489;"></div>
            <div id="cs-title" style="font-weight:600;">CrunchySkip</div>
          </div>
          <div style="position:relative;">
            <div id="cs-lang-current" style="
              font-size:11px;color:#d0d0de;
              cursor:pointer;padding:3px 7px;border-radius:999px;
              background:#111119;border:1px solid rgba(158,7,255,0.6);
            ">
              UI-Sprache
            </div>
            <div id="cs-lang-list" style="
              display:none;position:absolute;top:22px;right:0;
              background:#0a0a13;border-radius:8px;padding:4px;
              min-width:130px;max-height:180px;overflow:auto;
              border:1px solid rgba(158,7,255,0.6);
              box-shadow:0 12px 26px rgba(0,0,0,0.9);
            "></div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:4px;">
          <div id="cs-intro" style="
            padding:7px 8px;border-radius:10px;
            background:#101019;
            display:flex;justify-content:space-between;align-items:center;
            cursor:pointer;
          ">
            <span class="cs-label">Intro automatisch überspringen</span>
            <span class="cs-switch" style="
              min-width:32px;text-align:center;font-size:11px;
              padding:2px 6px;border-radius:999px;
              background:rgba(90,90,102,0.95);
            ">AUS</span>
          </div>
          <div id="cs-outro" style="
            padding:7px 8px;border-radius:10px;
            background:#101019;
            display:flex;justify-content:space-between;align-items:center;
            cursor:pointer;
          ">
            <span class="cs-label">Credits automatisch überspringen</span>
            <span class="cs-switch" style="
              min-width:32px;text-align:center;font-size:11px;
              padding:2px 6px;border-radius:999px;
              background:rgba(90,90,102,0.95);
            ">AUS</span>
          </div>
          <div id="cs-after" style="
            padding:7px 8px;border-radius:10px;
            background:#101019;
            display:flex;justify-content:space-between;align-items:center;
            cursor:pointer;
          ">
            <span class="cs-label">Nach den Credits überspringen</span>
            <span class="cs-switch" style="
              min-width:32px;text-align:center;font-size:11px;
              padding:2px 6px;border-radius:999px;
              background:rgba(90,90,102,0.95);
            ">AUS</span>
          </div>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:4px;padding-top:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:11px;color:#d0d0de;">${t('skipDelay')}</span>
            <span id="cs-delay-label" style="font-size:11px;color:#d0d0de;">
              ${state.skipDelaySec.toFixed(1)} s
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <input id="cs-delay-range" type="range" min="0" max="10" step="0.5"
                   value="${state.skipDelaySec}"
                   style="flex:1;appearance:none;height:4px;border-radius:999px;
                          background:#1a1a22;outline:none;">
            <input id="cs-delay-input" type="number" min="0" max="10" step="0.5"
                   value="${state.skipDelaySec}"
                   style="width:50px;background:#111119;border:1px solid rgba(255,255,255,0.12);
                          border-radius:6px;color:#f4f4f8;font-size:11px;padding:2px 4px;">
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <div id="cs-footer" style="font-size:10px;color:#7a7a86;">
            Created by @Kriimaar
          </div>
          <button id="cs-ok" type="button" style="
            cursor:pointer;padding:4px 14px;border-radius:999px;
            border:none;font-size:12px;font-weight:500;
            background:#9e07ff;color:#fff;
          ">
            OK
          </button>
        </div>
      </div>
    `;

        const intro = menu.querySelector('#cs-intro');
        const outro = menu.querySelector('#cs-outro');
        const after = menu.querySelector('#cs-after');
        intro?.addEventListener('click', (e) => {
            e.stopPropagation();
            log('click: toggle intro');
            toggleFlag('autoSkipIntro', intro);
        });
        outro?.addEventListener('click', (e) => {
            e.stopPropagation();
            log('click: toggle outro');
            toggleFlag('autoSkipOutro', outro);
        });
        after?.addEventListener('click', (e) => {
            e.stopPropagation();
            log('click: toggle afterCredits');
            toggleFlag('autoSkipAfterCredits', after);
        });

        const langCur = menu.querySelector('#cs-lang-current');
        const langList = menu.querySelector('#cs-lang-list');
        langCur?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!langList) return;
            const newState = langList.style.display === 'block' ? 'none' : 'block';
            log('click: lang selector, list ->', newState);
            langList.style.display = newState;
        });

        const delayRange = menu.querySelector('#cs-delay-range');
        const delayInput = menu.querySelector('#cs-delay-input');
        const delayLabel = menu.querySelector('#cs-delay-label');

        function updateDelay(val) {
            let v = parseFloat(val);
            if (isNaN(v)) v = 0;
            if (v < 0) v = 0;
            if (v > 10) v = 10;
            save('skipDelaySec', v);
            if (delayRange) delayRange.value = v;
            if (delayInput) delayInput.value = v;
            if (delayLabel) delayLabel.textContent = v.toFixed(1) + ' s';
            log('skip delay set to', v, 'seconds');
        }

        delayRange?.addEventListener('input', (e) => {
            e.stopPropagation();
            updateDelay(e.target.value);
        });
        delayInput?.addEventListener('input', (e) => {
            e.stopPropagation();
            updateDelay(e.target.value);
        });

        menu.querySelector('#cs-ok')?.addEventListener('click', () => {
            log('click: OK (hide menu)');
            hideMenu();
        });

        updateMenu();
        return menu;
    }

    // MENU POSITION / TOGGLE
    function positionMenu() {
        if (!guiBtn || !menu || menu.style.display !== 'block') return;
        const rect = guiBtn.getBoundingClientRect();
        const box = menu.firstElementChild.getBoundingClientRect();
        const margin = 8;
        let top = rect.top - box.height - margin;
        let left = rect.left + rect.width / 2 - box.width / 2;
        if (top < margin) top = rect.bottom + margin;
        left = Math.max(margin, Math.min(left, window.innerWidth - box.width - margin));
        log('positionMenu(): top=', top, 'left=', left);
        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
    }

    function showMenu() {
        if (!menu) return;
        log('showMenu()');
        menu.style.display = 'block';
        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            positionMenu();
        });
    }

    function hideMenu() {
        if (!menu || menu.style.display !== 'block') return;
        log('hideMenu()');
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 130);
    }

    // CONTROL BAR BUTTON
    function getControlsBar() {
        const fs = document.querySelector('[data-testid="vilos-fullscreen_button"]');
        if (!fs) return null;
        let row = fs.closest('.css-1dbjc4n');
        if (row && row.parentElement) row = row.parentElement;
        return row || null;
    }

function ensureGuiButton() {
  if (document.getElementById('cs-btn')) return;

  const bar = getControlsBar();
  if (!bar) return;

  const fullscreenBtn = bar.querySelector('[data-testid="vilos-fullscreen_button"]');
  if (!fullscreenBtn) return;

  const parent = fullscreenBtn.parentElement;

  // äußerer Button wie CR
  guiBtn = document.createElement('div');
  guiBtn.id = 'cs-btn';
  guiBtn.setAttribute('role', 'button');
  guiBtn.setAttribute('tabindex', '0');
  guiBtn.title = 'CrunchySkip';
  guiBtn.className = 'css-18t94o4 css-1dbjc4n r-1loqt21 r-10paoce r-1otgn73 r-1i6wzkk r-lrvibr';
  guiBtn.style.cssText = 'height:40px;width:40px;transition-duration:0.15s;margin-left:4px;';

  // innerer Wrapper wie bei fullscreen/settings
  const inner = document.createElement('div');
  inner.className = 'css-1dbjc4n r-b1u33m r-1ozmr9b r-1awozwy r-1niwhzg r-13awgt0 r-1777fci r-10paoce r-u4jnrj';
  inner.style.cssText = 'height:40px;max-height:40px;max-width:40px;min-width:40px;width:40px;';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'css-1dbjc4n r-1mlwlqe r-1udh08x r-417010';
  iconWrap.style.cssText = 'height:20px;width:20px;opacity:0.85;display:flex;align-items:center;justify-content:center;';

  const icon = document.createElement('span');
  icon.textContent = '≡';
  icon.style.cssText = 'display:block;line-height:1;font-size:18px;color:#fff;';

  iconWrap.appendChild(icon);
  inner.appendChild(iconWrap);
  guiBtn.appendChild(inner);

  guiBtn.addEventListener('mouseenter', () => (iconWrap.style.opacity = '1'));
  guiBtn.addEventListener('mouseleave', () => (iconWrap.style.opacity = '0.85'));
  guiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!menu) return;
    if (menu.style.display === 'block') hideMenu();
    else showMenu();
  });

  menu = buildMenu();
  guiBtn.appendChild(menu);

  parent.insertBefore(guiBtn, fullscreenBtn.nextSibling);
}



    // GLOBAL LISTENERS / INIT
    document.addEventListener('click', (e) => {
        const btn = document.getElementById('cs-btn');
        if (!btn || !menu) return;
        if (btn.contains(e.target) || menu.contains(e.target)) return;
        log('document click outside, hide menu');
        hideMenu();
    });

    window.addEventListener('resize', () => {
        log('window resize');
        positionMenu();
    });

    function initObserver() {
        log('initObserver()');
        const mo = new MutationObserver(() => {
            if (document.querySelector('video')) {
                ensureGuiButton();
                checkSkip();
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
        setInterval(checkSkip, 800);
    }

    log('script loaded, starting observer');
    initObserver();
})();
