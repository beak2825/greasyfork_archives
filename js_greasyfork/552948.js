// ==UserScript==
// @name         Netflix Advanced Skipper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Script avanzato per Netflix: salta intro, recap, 'Are you still watching?', e passa automaticamente all'episodio successivo. Configurabile via menu, con storage persistente, logging opzionale, supporto multi-lingua, e monitoraggio robusto del player.
// @author       Boranga
// @match        https://www.netflix.com/watch/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552948/Netflix%20Advanced%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/552948/Netflix%20Advanced%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurazione predefinita
    const DEFAULT_SETTINGS = {
        skipIntro: true,
        skipRecap: true,
        skipStillWatching: true,
        autoNextEpisode: true,
        logging: false,
        introThreshold: 30, // Secondi iniziali per skip intro
        endThreshold: 0.95, // Percentuale fine video per next episode
        pollInterval: 1000 // Intervallo polling in ms
    };

    // Carica impostazioni da storage
    let settings = GM_getValue('netflixSkipperSettings', DEFAULT_SETTINGS);

    // Funzione per salvare impostazioni
    function saveSettings() {
        GM_setValue('netflixSkipperSettings', settings);
        GM_notification({ text: 'Impostazioni salvate', title: 'Netflix Skipper', timeout: 3000 });
    }

    // Funzione di logging condizionale
    function log(message) {
        if (settings.logging) {
            console.log('[Netflix Advanced Skipper] ' + message);
        }
    }

    // Selettori multi-lingua e robusti (basati su data-uia e aria-label)
    const SELECTORS = {
        skipIntro: '[data-uia="player-skip-intro"], button[aria-label*="Skip Intro"], button[aria-label*="Salta intro"], button[aria-label*="Skip Opening"], button[aria-label*="Salta apertura"]',
        skipRecap: '[data-uia="player-skip-recap"], button[aria-label*="Skip Recap"], button[aria-label*="Salta riassunto"], button[aria-label*="Skip Previously On"], button[aria-label*="Salta precedentemente"]',
        stillWatching: '[data-uia="interrupt-autoplay-continue"], button[aria-label*="Continue Watching"], button[aria-label*="Continua a guardare"], button[data-uia="continue-watching"]',
        nextEpisode: '[data-uia="next-episode-seamless-button"], button[aria-label*="Next Episode"], button[aria-label*="Prossimo episodio"], .next-episode-button, [data-uia="next-episode-button"]'
    };

    // Flag per prevenire click multipli
    let flags = {
        skippedIntro: false,
        skippedRecap: false,
        continuedWatching: false,
        nextEpisode: false
    };

    // Reset flag dopo timeout
    function resetFlag(flagName, timeout = 5000) {
        setTimeout(() => { flags[flagName] = false; }, timeout);
    }

    // Funzione generica per cliccare un bottone se presente e abilitato
    function clickButton(selector, settingKey, flagName, message) {
        if (!settings[settingKey]) return;
        const btn = document.querySelector(selector);
        if (btn && !flags[flagName]) {
            btn.click();
            flags[flagName] = true;
            log(message);
            resetFlag(flagName);
            return true;
        }
        return false;
    }

    // Funzione per monitorare il player video
    function monitorPlayer() {
        const video = document.querySelector('video');
        if (!video) return;

        const currentTime = video.currentTime;
        const duration = video.duration;

        // Skip intro se entro threshold iniziale
        if (settings.skipIntro && currentTime < settings.introThreshold) {
            clickButton(SELECTORS.skipIntro, 'skipIntro', 'skippedIntro', 'Intro saltata');
        }

        // Skip recap (solitamente dopo intro)
        if (settings.skipRecap && currentTime > 10 && currentTime < 120) { // Assumi recap entro primi 2 min
            clickButton(SELECTORS.skipRecap, 'skipRecap', 'skippedRecap', 'Recap saltato');
        }

        // Skip still watching (modal overlay)
        clickButton(SELECTORS.stillWatching, 'skipStillWatching', 'continuedWatching', 'Continua a guardare cliccato');

        // Auto-next episode se vicino alla fine
        if (settings.autoNextEpisode && duration && (currentTime / duration > settings.endThreshold)) {
            clickButton(SELECTORS.nextEpisode, 'autoNextEpisode', 'nextEpisode', 'Passato all\'episodio successivo');
        }
    }

    // Observer per cambiamenti DOM (Netflix è una SPA)
    let observer;
    function initObserver() {
        if (observer) return;
        observer = new MutationObserver(() => {
            monitorPlayer();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        log('Observer DOM avviato');
    }

    // Hook eventi video
    function hookVideoEvents() {
        document.addEventListener('play', monitorPlayer, true);
        document.addEventListener('timeupdate', monitorPlayer, true);
        document.addEventListener('ended', () => {
            if (settings.autoNextEpisode) {
                clickButton(SELECTORS.nextEpisode, 'autoNextEpisode', 'nextEpisode', 'Episodio finito: next cliccato');
            }
        }, true);
    }

    // Setup menu comandi per configurazione
    function setupMenu() {
        GM_registerMenuCommand('Toggle Skip Intro', () => {
            settings.skipIntro = !settings.skipIntro;
            saveSettings();
            log(`Skip Intro: ${settings.skipIntro ? 'ON' : 'OFF'}`);
        });

        GM_registerMenuCommand('Toggle Skip Recap', () => {
            settings.skipRecap = !settings.skipRecap;
            saveSettings();
            log(`Skip Recap: ${settings.skipRecap ? 'ON' : 'OFF'}`);
        });

        GM_registerMenuCommand('Toggle Skip Still Watching', () => {
            settings.skipStillWatching = !settings.skipStillWatching;
            saveSettings();
            log(`Skip Still Watching: ${settings.skipStillWatching ? 'ON' : 'OFF'}`);
        });

        GM_registerMenuCommand('Toggle Auto Next Episode', () => {
            settings.autoNextEpisode = !settings.autoNextEpisode;
            saveSettings();
            log(`Auto Next Episode: ${settings.autoNextEpisode ? 'ON' : 'OFF'}`);
        });

        GM_registerMenuCommand('Toggle Logging', () => {
            settings.logging = !settings.logging;
            saveSettings();
            log(`Logging: ${settings.logging ? 'ON' : 'OFF'}`);
        });

        GM_registerMenuCommand('Reset Impostazioni', () => {
            settings = { ...DEFAULT_SETTINGS };
            saveSettings();
            log('Impostazioni resettate');
        });
    }

    // Inizializzazione
    window.addEventListener('load', () => {
        setupMenu();
        initObserver();
        hookVideoEvents();
        setInterval(monitorPlayer, settings.pollInterval); // Polling fallback
        log('Script avviato con impostazioni: ' + JSON.stringify(settings));
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (observer) observer.disconnect();
    });

})();