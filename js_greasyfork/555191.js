// ==UserScript==
// @name         Ouo Auto-Clicker
// @description  Automatically clicks verification and submit buttons on ouo.io and ouo.press to skip manual interaction.
// @version      1.1
// @author       Jan Gaida
// @license      GPLv3
// @match        *://*.ouo.io/*
// @exclude      *://*.ouo.io
// @exclude      *://*.ouo.io/auth
// @exclude      *://*.ouo.io/auth/*
// @match        *://*.ouo.press/*
// @exclude      *://*.ouo.press
// @exclude      *://*.ouo.press/auth
// @exclude      *://*.ouo.press/auth/*
// @grant        none
// @run-at       document-body
// @icon         https://cdn.jsdelivr.net/gh/JanGaida/ouo-auto-clicker@main/assets/icon.svg
// @namespace    https://github.com/JanGaida/ouo-auto-clicker
// @supportURL   https://github.com/JanGaida/ouo-auto-clicker/issues
// @downloadURL https://update.greasyfork.org/scripts/555191/Ouo%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/555191/Ouo%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Config ---

    const config = {

        /**
         * Automatically mark this page as handled once the script runs.
         * If true, the script will not execute again on the same page (prevents re-entry).
         */
        preventReEntry: true,

        /**
         * Whether the script should override the disabled state of buttons.
         * If true, disabled verification buttons will be force-enabled before clicking.
         * If false, the script will wait for the page to enable the button naturally.
         */
        forceEnableButton: true,

        /**
         * Overlay configuration.
         * Displays a semi-transparent overlay while automation runs, optionally allowing user abort.
         */
        overlay: {
            /**
             * Show the overlay while automation is running.
             * Set to false to disable visual feedback.
             */
            enabled: true,

            /**
             * Alpha transparency for the overlay background (0 = fully transparent, 1 = fully opaque).
             * Used as fallback if the template does not explicitly set opacity.
             */
            alpha: 0.6,

            /**
             * Font size for overlay text.
             * Can be:
             * - number → pixels
             * - CSS string → e.g., '1rem'
             * - "auto" → automatically scales with viewport width
             */
            textSize: 'auto',

            /**
             * HTML template for the overlay.
             * Supports placeholders that are automatically replaced at runtime:
             * - {{overlayId}}    → id of the overlay
             * - {{message}}      → main overlay message (i18n)
             * - {{abortMessage}} → message shown for abort/pause
             * - {{fontSize}}     → dynamically determined font size
             */
            template: `
                <div id="{{overlayId}}" style="
                    position:fixed;top:0;left:0;right:0;bottom:0;
                    z-index:2147483647;display:flex;align-items:center;justify-content:center;
                    cursor:pointer;
                ">
                    <div style="
                        width:100%;height:100%;
                        display:flex;align-items:flex-start;justify-content:center;
                        background:rgba(26,26,26,{{alpha}});
                        backdrop-filter: blur(1px);
                        padding-top:25vh;
                    ">
                        <div style="
                            text-align:center;padding:14px 20px;border-radius:8px;
                            background: rgba(0,0,0,0.85); color: white;
                            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                            max-width:90%;
                            font-size:{{fontSize}};
                        ">
                            <div style="font-weight:600;margin-bottom:6px;font-size:16px;">{{message}}</div>
                            <div style="opacity:0.85;font-size:12px;">{{abortMessage}}</div>
                        </div>
                    </div>
                </div>
            `,

            /**
             * The identifier to use for the root-element of overlay.
             */
            id: '__OUO_AUTO_CLICKER_OVERLAY__'
        },

        /**
         * Configuration for the Landing page.
         * The script uses this to detect the page and locate the verification button.
         */
        landingPage: {
            /**
             * Regular expression to detect whether the current URL is a Landing page.
             * Matches URLs like "https://ouo.io/{linkId}" or "https://ouo.press/{linkId}".
             */
            urlRegex: /^https?:\/\/ouo\.(io|press)\/[^\/]+$/i,

            /**
             * CSS selectors to locate candidate buttons for verification.
             * The script checks all these selectors for visible, enabled elements.
             */
            buttonSelectors: ['button', 'input[type="button"]', 'input[type="submit"]', 'div[role="button"]'],

            /**
             * Substrings to match against the button's text or value (case-insensitive).
             * A button is considered a verification candidate if its text/value contains any of these patterns.
             */
            buttonTextPatterns: ['human', 'verify', 'not a robot'],
        },

        /**
         * Configuration for the Go page.
         * The script uses this to detect the page, locate the form, and click the submit-form button.
         */
        goPage: {
            /**
             * Regular expression to detect whether the current URL is a Go page.
             * Matches URLs like "https://ouo.io/go/{linkId}" or "https://ouo.press/go/{linkId}".
             */
            urlRegex: /^https?:\/\/ouo\.(io|press)\/go\/[^\/]+$/i,

            /**
             * The ID of the form element to wait for and submit.
             * The script will poll for this form using `goPagePollFormInterval`.
             */
            formId: 'form-go',

            /**
             * CSS selectors used as fallback to click the submit/go button.
             * These are used if `form.submit()` doesn't navigate automatically.
             */
            goButtonSelectors: ['button[type="submit"]', 'button'],
        },

        /**
         * Logging configuration.
         */
        logging: {

            /**
             * Script identifier used in logs and debugging.
             * Helps differentiate messages if multiple scripts are running.
             */
            scriptId: 'Ouo Auto-Clicker',

            /**
             * Enable or disable logging to the browser console.
             * - true: Logs debug messages with timestamps.
             * - false: Suppresses debug output.
             */
            useConsoleOutput: true,
        },

        /**
         * Timing values in milliseconds (ms).
         *
         * Note:
         *     0ms = Immediately (actually 4ms)
         *   100ms = 0.1 s
         *  1000ms = 1.0 s
         * 30000ms = 30.0 s
         */
        intervals: {

            // --- Landing Page ---

            /**
             * Delay before clicking the verification button on the landing page.
             * Gives the page time to load fully to avoid race conditions.
             * Recommended: 25–1000 ms.
             */
            landingPageImHumanClickDelay: 25,

            // --- Go Page ---

            /**
             * Interval in milliseconds to poll for the submit form on the go page.
             * The script repeatedly checks if the form is present.
             * Recommended: 25–500 ms for fast detection without overloading the DOM.
             */
            goPagePollFormInterval: 25,

            /**
             * Delay in milliseconds before attempting a fallback click on the submit button.
             * Only triggered if the form.submit() call does not navigate.
             * Recommended: 25–500 ms.
             */
            goPageFallbackSubmitDelay: 25,

            // --- Global ---

            /**
             * Maximum total time in milliseconds to retry the click-automation before giving up.
             * After this period, the script will stop polling and abort.
             * Recommended: 20000–60000 ms.
             */
            globalMaxRetryWait: 20000,
        },

        /**
         * Handles internationalization (i18n) for overlay messages.
         */
        i18n: {
            /**
             * Fallback language used when either browser does not report a proper language or when the specified translation is not yet available.
             */
            fallbackLanguage: 'en',

            /**
             * The translations object maps ISO 639-1 language codes to message pairs.
             * Regional variants (like 'pt-BR' or 'es-MX') are automatically mapped to their base code ('pt', 'es', etc.).
             * 
             * Note: Most of these have been generated using a LLM; feel free to expand these, improve the translation or report unsuitable translations.
             */
            translations: {
                en: { // English
                    message: 'Automatically redirecting — please wait',
                    abortMessage: 'Click here to abort',
                },
                de: { // German
                    message: 'Automatische Weiterleitung — bitte warten',
                    abortMessage: 'Klicken Sie hier, um abzubrechen',
                },
                fr: { // French
                    message: 'Redirection automatique — veuillez patienter',
                    abortMessage: 'Cliquez ici pour annuler',
                },
                es: { // Spanish
                    message: 'Redirigiendo automáticamente — por favor espera',
                    abortMessage: 'Haz clic aquí para cancelar',
                },
                it: { // Italian
                    message: 'Reindirizzamento automatico — attendere prego',
                    abortMessage: 'Fai clic qui per annullare',
                },
                pt: { // Portuguese
                    message: 'Redirecionamento automático — aguarde por favor',
                    abortMessage: 'Clique aqui para cancelar',
                },
                nl: { // Dutch
                    message: 'Automatisch doorsturen — even geduld',
                    abortMessage: 'Klik hier om te annuleren',
                },
                pl: { // Polish
                    message: 'Automatyczne przekierowanie — proszę czekać',
                    abortMessage: 'Kliknij tutaj, aby anulować',
                },
                sv: { // Swedish
                    message: 'Automatisk vidarebefordran — vänligen vänta',
                    abortMessage: 'Klicka här för att avbryta',
                },
                no: { // Norwegian
                    message: 'Automatisk videresending — vennligst vent',
                    abortMessage: 'Klikk her for å avbryte',
                },
                da: { // Danish
                    message: 'Automatisk videresendelse — vent venligst',
                    abortMessage: 'Klik her for at annullere',
                },
                fi: { // Finnish
                    message: 'Automaattinen uudelleenohjaus — odota hetki',
                    abortMessage: 'Napsauta tästä peruuttaaksesi',
                },
                cs: { // Czech
                    message: 'Automatické přesměrování — čekejte prosím',
                    abortMessage: 'Kliknutím sem zrušíte',
                },
                sk: { // Slovak
                    message: 'Automatické presmerovanie — čakajte prosím',
                    abortMessage: 'Kliknutím sem zrušíte',
                },
                hu: { // Hungarian
                    message: 'Automatikus átirányítás — kérem, várjon',
                    abortMessage: 'Kattintson ide a megszakításhoz',
                },
                ro: { // Romanian
                    message: 'Redirecționare automată — vă rugăm să așteptați',
                    abortMessage: 'Faceți clic aici pentru a anula',
                },
                bg: { // Bulgarian
                    message: 'Автоматично пренасочване — моля, изчакайте',
                    abortMessage: 'Щракнете тук, за да отмените',
                },
                el: { // Greek
                    message: 'Αυτόματη ανακατεύθυνση — παρακαλώ περιμένετε',
                    abortMessage: 'Κάντε κλικ εδώ για ακύρωση',
                },
                uk: { // Ukrainian
                    message: 'Автоматичне перенаправлення — будь ласка, зачекайте',
                    abortMessage: 'Натисніть тут, щоб скасувати',
                },
                ru: { // Russian
                    message: 'Автоматическое перенаправление — пожалуйста, подождите',
                    abortMessage: 'Нажмите здесь, чтобы отменить',
                },
                sr: { // Serbian
                    message: 'Аутоматско преусмеравање — молимо сачекајте',
                    abortMessage: 'Кликните овде да откажете',
                },
                hr: { // Croatian
                    message: 'Automatsko preusmjeravanje — molimo pričekajte',
                    abortMessage: 'Kliknite ovdje da otkažete',
                },
                sl: { // Slovenian
                    message: 'Samodejna preusmeritev — prosimo, počakajte',
                    abortMessage: 'Kliknite tukaj za preklic',
                },
                lt: { // Lithuanian
                    message: 'Automatinis nukreipimas — prašome palaukti',
                    abortMessage: 'Spustelėkite čia, kad atšauktumėte',
                },
                lv: { // Latvian
                    message: 'Automātiska novirzīšana — lūdzu, uzgaidiet',
                    abortMessage: 'Noklikšķiniet šeit, lai atceltu',
                },
                et: { // Estonian
                    message: 'Automaatne ümbersuunamine — palun oodake',
                    abortMessage: 'Klõpsake siin, et tühistada',
                },
                tr: { // Turkish
                    message: 'Otomatik yönlendirme — lütfen bekleyin',
                    abortMessage: 'İptal etmek için buraya tıklayın',
                },
                ar: { // Arabic (Egyptian)
                    message: 'يتم إعادة التوجيه تلقائيًا — من فضلك انتظر',
                    abortMessage: 'اضغط هنا للإلغاء',
                },
                hi: { // Hindi
                    message: 'स्वचालित पुनर्निर्देशन — कृपया प्रतीक्षा करें',
                    abortMessage: 'रद्द करने के लिए यहाँ क्लिक करें',
                },
                id: { // Indonesian
                    message: 'Mengalihkan secara otomatis — harap tunggu',
                    abortMessage: 'Klik di sini untuk membatalkan',
                },
                zh: { // Mandarin Chinese (Simplified)
                    message: '正在自动跳转 — 请稍候',
                    abortMessage: '点击此处取消',
                },
                ja: { // Japanese
                    message: '自動リダイレクト中 — しばらくお待ちください',
                    abortMessage: 'ここをクリックして中止',
                },
                ko: { // Korean
                    message: '자동으로 이동 중 — 잠시만 기다려 주세요',
                    abortMessage: '여기를 클릭하여 중단',
                },
                th: { // Thai
                    message: 'กำลังเปลี่ยนเส้นทางอัตโนมัติ — โปรดรอ',
                    abortMessage: 'คลิกที่นี่เพื่อยกเลิก',
                },
                vi: { // Vietnamese
                    message: 'Đang tự động chuyển hướng — vui lòng chờ',
                    abortMessage: 'Nhấp vào đây để hủy',
                },
                fa: { // Persian (Farsi)
                    message: 'در حال انتقال خودکار — لطفاً صبر کنید',
                    abortMessage: 'برای لغو اینجا کلیک کنید',
                },
                he: { // Hebrew
                    message: 'מועבר אוטומטית — אנא המתן',
                    abortMessage: 'לחץ כאן לביטול',
                },
                ms: { // Malay
                    message: 'Mengalih secara automatik — sila tunggu',
                    abortMessage: 'Klik di sini untuk membatalkan',
                },
                tl: { // Filipino / Tagalog
                    message: 'Awtomatikong nagre-redirect — pakihintay',
                    abortMessage: 'I-click dito upang kanselahin',
                },
                ur: { // Urdu
                    message: 'خودکار طور پر ری ڈائریکٹ ہو رہا ہے — براہ کرم انتظار کریں',
                    abortMessage: 'منسوخ کرنے کے لیے یہاں کلک کریں',
                },
                sw: { // Swahili
                    message: 'Inapeleka kiotomatiki — tafadhali subiri',
                    abortMessage: 'Bofya hapa kughairi',
                },
                ta: { // Tamil
                    message: 'தானாக மாற்றி இயக்கப்படுகிறது — தயவுசெய்து காத்திருங்கள்',
                    abortMessage: 'ரத்து செய்ய இங்கே கிளிக் செய்யவும்',
                },
                mr: { // Marathi
                    message: 'स्वयंचलित पुनर्निर्देशन — कृपया प्रतीक्षा करा',
                    abortMessage: 'रद्द करण्यासाठी येथे क्लिक करा',
                },
            },
        },

    };

    // --- Runtime flags ---

    /**
     * Wether the script has been paused by the user.
     */
    let isPaused = false;

    // --- Logging helper ---

    /**
     * Logs a message to the console with timestamp and script name.
     * @param {...any} messages - The message(s) to log.
     */
    function log(...messages) {
        if (!config.logging.useConsoleOutput) return;
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${config.logging.scriptId}]`;
        console.log(prefix, ...messages);
    }

    // --- Overlay helpers ---

    /**
     * Create the overlay from the template string in config.overlay.template.
     * Replaces {{message}}, {{abortMessage}} and {{alpha}} placeholders.
     */
    function createOverlay() {
        if (!config.overlay.enabled) return;
        if (document.getElementById(config.overlay.id)) return;

        // Update the texts
        applyTranslations();

        // Prepare html by replacing placeholders
        let html = config.overlay.template
            .replace(/{{\s*overlayId\s*}}/g, escapeHtml(config.overlay.id))
            .replace(/{{\s*message\s*}}/g, escapeHtml(config.overlay.message))
            .replace(/{{\s*abortMessage\s*}}/g, escapeHtml(config.overlay.abortMessage))
            .replace(/{{\s*alpha\s*}}/g, Number(config.overlay.alpha).toFixed(2))
            .replace(/{{\s*fontSize\s*}}/g, getResponsiveTextSize());

        // Use a template element to parse the HTML string safely
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        const node = tpl.content.firstElementChild;
        if (!node) {
            log('❌ Overlay template produced no nodes; skipping overlay.');
            return;
        }

        // Ensure the root overlay has the expected ID (in case user changed template)
        node.id = config.overlay.id;

        // Attach click handler to abort/pause
        node.addEventListener('click', onOverlayClick, { capture: true });

        // Append to document
        document.documentElement.appendChild(node);
        log('🖼️ Overlay created');
    }

    /**
     * Remove the overlay from the DOM if present.
     */
    function removeOverlay() {
        const overlay = document.getElementById(config.overlay.id);
        if (overlay) {
            overlay.removeEventListener('click', onOverlayClick, { capture: true });
            overlay.remove();
            log('🗑️ Overlay removed');
        }
    }

    /**
     * Overlay click handler: pauses/aborts automation and removes overlay.
     * @param {MouseEvent} e - click event on the overlay
     */
    function onOverlayClick(e) {
        isPaused = true;
        window.__OUO_AUTO_CLICKER_PAUSED__ = true;
        log('⏸️ User clicked overlay — automation paused/aborted by user.');
        removeOverlay();
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Returns text size (px or rem) based on config.overlay.textSize.
     * If set to "auto", scales with viewport width.
     */
    function getResponsiveTextSize() {
        if (config.overlay.textSize === 'auto') {
            const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (vw < 500) return '16px';
            if (vw < 900) return '18px';
            return '20px';
        }
        return typeof config.overlay.textSize === 'number'
            ? `${config.overlay.textSize}px`
            : config.overlay.textSize || '18px';
    }

    // --- Helper utilities ---

    /**
     * Minimal HTML escape for template injection safety (only used for small texts).
     * @param {string} str
     * @returns {string}
     */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // --- Core automation functions ---

    /**
     * Attempts to find and click the verification button on the landing page.
     * The click is scheduled with a configurable delay (firstClickDelay).
     * @returns {boolean} True if a candidate button was found and a click scheduled; false otherwise.
     */
    function clickVerificationButton() {
        if (isPaused) {
            log('⏸️ clickVerificationButton skipped (paused).');
            return false;
        }

        const buttons = document.querySelectorAll(config.landingPage.buttonSelectors.join(', '));
        for (const btn of buttons) {
            const text = (btn.textContent || btn.value || '').toLowerCase().trim();
            if (config.landingPage.buttonTextPatterns.some(pattern => text.includes(pattern)) && btn.offsetParent !== null) {
                // Forcefully enable the button?
                if (config.forceEnableButton && btn.disabled) {
                    btn.disabled = false;
                    log('🔓 Button was disabled — forcing enabled state.');
                }
                // Automate the click
                if (!btn.disabled) {
                    const handler = () => {
                        if (isPaused) {
                            log('⏸️ Scheduled verification click aborted (paused).');
                            return;
                        }
                        try {
                            btn.click();
                            log('✅ Verification button clicked.');
                        } catch (err) {
                            log('❌ Error clicking verification button:', err);
                            removeOverlay();
                        }
                    };
                    setTimeout(handler, config.intervals.landingPageImHumanClickDelay);
                    log(`🕒 Verification click scheduled in ${config.intervals.landingPageImHumanClickDelay} ms`);
                    return true;
                }
                // Wait until the button is enabled
                else {
                    const startTime = Date.now();
                    const retryInterval = setInterval(() => {
                        if (isPaused) {
                            clearInterval(retryInterval);
                            log('⏸️ Retry cancelled (paused).');
                            return;
                        }
                        if (!btn.disabled) {
                            clearInterval(retryInterval);
                            try {
                                btn.click();
                                log('✅ Verification button clicked after retry.');
                            } catch (err) {
                                log('❌ Error clicking verification button after retry:', err);
                                removeOverlay();
                            }
                        } else if (Date.now() - startTime > config.intervals.maxRetryTime) {
                            clearInterval(retryInterval);
                            log('⏰ Timeout: Button not enabled within', config.landingPage.maxRetryTime, 'ms');
                            removeOverlay();
                        }
                    }, config.landingPage.retryInterval);
                    log(`🔄 Retrying to click verification button every ${config.landingPage.retryInterval} ms...`);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Waits for the submit form to appear, then triggers submission.
     * Uses interval polling until form is detected or timeout.
     */
    function waitForFormAndSubmit() {
        if (isPaused) {
            log('⏸️ waitForFormAndSubmit cancelled (paused).');
            return;
        }
        const form = document.getElementById(config.goPage.formId);
        if (form) {
            submitForm(form);
        } else {
            const start = Date.now();
            const interval = setInterval(() => {
                if (isPaused) {
                    clearInterval(interval);
                    log('⏸️ waitForFormAndSubmit cancelled (paused).');
                    return;
                }
                const form = document.getElementById(config.goPage.formId);
                if (form) {
                    clearInterval(interval);
                    submitForm(form);
                } else if (Date.now() - start > config.intervals.globalMaxRetryWait) {
                    clearInterval(interval);
                    log('⏰ Timeout: form not found within', config.intervals.globalMaxRetryWait, 'ms');
                    removeOverlay();
                }
            }, config.intervals.goPagePollFormInterval);
        }
    }

    /**
     * Submits the specified form directly, with fallback to clicking a submit button.
     * @param {HTMLFormElement} form - The form element to submit.
     */
    function submitForm(form) {
        if (isPaused) {
            log('⏸️ submitForm skipped (paused).');
            return;
        }
        log('✅ Form found, submitting...');
        try {
            form.submit();
            log('📤 Form submitted.');
            // Fallback: Click submit button if form.submit() fails to navigate
            setTimeout(() => {
                if (isPaused) {
                    log('⏸️ Fallback submit skipped (paused).');
                    return;
                }
                const submitButton = form.querySelector(config.goPage.goButtonSelectors.join(', '));
                if (submitButton && !submitButton.disabled) {
                    try {
                        log('🖱️ Fallback: Submit button clicked.');
                        submitButton.click();
                    } catch (err) {
                        log('❌ Error clicking fallback submit button:', err);
                        removeOverlay();
                    }
                }
            }, config.intervals.goPageFallbackSubmitDelay);
        } catch (error) {
            // Always report fatal errors to console; also log if debug enabled
            console.error(`[${config.logging.scriptId}] ❌ Uncaught error during submit:`, error);
            log('❌ Submit error:', error);
            removeOverlay();
        }
    }

    /**
     * Main automation runner.
     * Handles auto-disable checks, overlay management and dispatches logic based on current URL.
     */
    function runAutomation() {
        try {
            if (config.preventReEntry && window.__OUO_AUTO_CLICKER_DONE__) {
                log('⚙️ Script already executed on this page. Skipping...');
                return;
            }
            // Mark as done early to avoid re-entrance; user abort sets paused flag instead.
            window.__OUO_AUTO_CLICKER_DONE__ = true;

            if (config.overlay.enabled) {
                createOverlay();
            }

            const currentUrl = window.location.href;

            if (config.landingPage.urlRegex.test(currentUrl)) {
                log('🌐 Landing page detected. Clicking verification button...');
                const clicked = clickVerificationButton();
                if (!clicked) {
                    log('❌ Verification button not found. Script aborted.');
                    removeOverlay();
                }
            } else if (config.goPage.urlRegex.test(currentUrl)) {
                log('🌐 Submit page detected. Submitting form...');
                waitForFormAndSubmit();
            } else {
                log('❌ Unknown page. Script aborted.');
                removeOverlay();
            }
        } catch (error) {
            console.error(`[${config.logging.scriptId}] ❌ Uncaught error:`, error);
            log('❌ Uncaught error:', error);
            removeOverlay();
        }
    }

    // --- Internationalization ---

    /**
     * Detects the user's browser language and returns the base language code (e.g. 'de' from 'de-DE').
     */
    function detectLanguage() {
        const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        const baseLang = lang.split('-')[0];
        return baseLang ? baseLang : config.i18n.fallbackLanguage.toLowerCase();
    }

    /**
     * Applies i18n translations to overlay config depending on browser language.
     */
    function applyTranslations() {
        const lang = detectLanguage();
        const t = config.i18n.translations[lang] || config.i18n.translations[config.i18n.fallbackLanguage.toLowerCase()];
        config.overlay.message = t.message;
        config.overlay.abortMessage = t.abortMessage;
        log(`🌍 Language set to ${lang.toUpperCase()} — Overlay texts updated.`);
    }

    // --- Script entrypoint ---

    runAutomation();
})();
