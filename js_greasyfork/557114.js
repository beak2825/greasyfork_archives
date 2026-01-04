// ==UserScript==
// @name         Ultimate Anti-Adblock Killer PRO
// @namespace    https://tampermonkey.net/
// @version      1.1.0
// @description  The definitive tool: Aggressive neutralization, Anti-Adblock Killer, Persistent Zapper, AND MORE.
// @author       Tauã B. Kloch Leite
// @icon         https://img.icons8.com/?size=100&id=gH0WS8lRy7Ph&format=png&color=000000
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557114/Ultimate%20Anti-Adblock%20Killer%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/557114/Ultimate%20Anti-Adblock%20Killer%20PRO.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const host = window.location.hostname;

    // =============================================
    // 0. SPECIAL DOMAIN FIXES (PRIORITY)
    // =============================================
    // Estas funções rodam INDEPENDENTE da lista de exceções,
    // pois são correções cirúrgicas para sites específicos.

    function runKissAnimeFix() {
        console.log('⚡ [UAAK] KissAnime Logic Activated');
        setTimeout(() => {
            const container = document.getElementById('player_container');
            const warning = document.querySelector('.error_movie, .alert-warning');

            if (container) {
                // Remove aviso vermelho
                if (warning) warning.remove();
                // Força o vídeo real direto do servidor oficial
                container.innerHTML = `
                    <iframe src="https://am.vidstream.vip/embed.html"
                            width="100%" height="480"
                            frameborder="0" scrolling="no"
                            allowfullscreen style="width:100%;height:100%;"></iframe>
                `;
                console.log('Vídeo carregado direto do vidstream!');
            }
        }, 2500); // 2.5 segundos é o tempo perfeito na maioria dos episódios
    }

    function runTV3Fix() {
        console.log('⚡ [UAAK] TV3.lv Logic Activated');

        // 1. AVISO (Apenas na janela principal, não dentro de iframes pequenos)
        if (window.top === window.self) {
            setTimeout(() => {
                const n = document.createElement('div');
                n.style.cssText = "position:fixed;top:20px;right:20px;background:#ed8936;color:white;padding:15px;border-radius:8px;z-index:2147483647;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.5);max-width:320px;font-size:14px;border-left: 5px solid #fff;";
                n.innerHTML = "⚠️ <b>ATTENTION REQUIRED</b><br><br>To play videos on this site, you must <b>DISABLE</b> your AdBlocker (ABP, uBlock, etc).<br><br>Please turn it OFF specifically for <b>play.tv3.lv</b> to proceed.";

                const close = document.createElement('div');
                close.innerHTML = "✖";
                close.style.cssText = "position:absolute;top:5px;right:10px;cursor:pointer;font-weight:bold;";
                close.onclick = () => n.remove();
                n.appendChild(close);

                document.body.appendChild(n);
                setTimeout(() => n.remove(), 15000); // 15 segundos
            }, 1500);
        }

        // 2. ADGUARD SCRIPTLETS REPLICA (Essencial para o player funcionar)
        try {
            Object.defineProperty(win.Object.prototype, 'isNoAds', {
                get: function() { return function() { return true; }; },
                set: function() {},
                configurable: true
            });
        } catch(e) {}

        // Cookie Force (Engana o player achando que não tem adblock)
        try {
            const setCookie = () => {
                document.cookie = "__adblocker=false; path=/; domain=.tv3.lv; max-age=31536000";
                document.cookie = "__adblocker=false; path=/; domain=play.tv3.lv; max-age=31536000";
            };
            setCookie();
            win.addEventListener('beforeunload', setCookie);
            setInterval(setCookie, 1000);
        } catch(e) {}

        // NptTech Block (Bloqueia o detector específico do site)
        try {
            Object.defineProperty(win, 'setNptTechAdblockerCookie', {
                get: function() { throw new ReferenceError('UAAK Blocked Property'); },
                set: function() {}
            });
        } catch(e) {}

        // Mock Google/Freewheel
        const mockObj = {
            addEventListener: (e,cb) => { if(e.match(/loaded|end|complete/i)) setTimeout(cb, 10); },
            setTargeting: () => {}, refresh: () => {}, display: () => {}
        };
        if(!win.googletag) win.googletag = { cmd: [], pubads: () => mockObj };
        if(!win.tv3) win.tv3 = { ad: { isAdBlocking: false } };

        // 3. NETWORK BLOCKER (Bloqueia domínios de anúncios na raiz)
        const adDomains = ['stickyadstv.com', 'fwmrm.net', 'npttech.com', 'doubleclick.net', 'gemius.pl'];
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);
            if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'src' && adDomains.some(d => value.includes(d))) return;
                    return originalSetAttribute.call(this, name, value);
                };
                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        if (adDomains.some(d => value.includes(d))) return;
                        this.setAttribute('src', value);
                    },
                    get: function() { return this.getAttribute('src'); },
                    configurable: true
                });
            }
            return element;
        };

        // 4. VISUAL CLEANUP (CSS Específico para o TV3)
        const css = '.c-player-popup, .c-player-popup--dark, .c-paused-overlay, .qc-cmp2-container, .fc-ab-dialog, .c-freewheel__info-container { display: none !important; visibility: hidden !important; pointer-events: none !important; }';
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // CHECK E EXECUÇÃO DAS FUNÇÕES ESPECÍFICAS
    // KissAnime
    if (host.includes('kissanime.com.ru')) {
        runKissAnimeFix();
    }
    // TV3 (Cobre tv3.lv e play.tv3.lv)
    if (host.includes('tv3.lv')) {
        runTV3Fix();
    }

    // =============================================
    // 0. CLOUDFLARE CHECK (ORIGINAL CODE START)
    // =============================================

    function isCloudflare() {
        try {
            const title = document.title;
            if (title === 'Just a moment...' || title.includes('Attention Required!')) return true;
            if (document.getElementById('challenge-form') || document.getElementById('cf-wrapper')) return true;
        } catch(e) {}
        return false;
    }

    if (isCloudflare()) return;

    function injectBait() {
        const baitVars = ['adsbygoogle', 'adblock', 'google_ad_client', 'showAds', 'adBlockDetected', 'hasAdBlocker'];
        baitVars.forEach(varName => {
            if (!win[varName]) {
                Object.defineProperty(win, varName, {
                    get: function() { return varName === 'adsbygoogle' ? [] : true; },
                    set: function() {},
                    configurable: true
                });
            }
        });
    }
    injectBait();

    // =============================================
    // 1. CONFIGURATION & STATE
    // =============================================

    const exceptionSites = [
        'google.com', 'facebook.com', 'youtube.com', 'amazon.com', 'twitter.com',
        'instagram.com', 'linkedin.com', 'netflix.com', 'microsoft.com', 'apple.com',
        'wikipedia.org', 'reddit.com', 'whatsapp.com', 'tiktok.com', 'office.com',
        'zoom.us', 'x.com', 'discord.com', 'twitch.tv', 'spotify.com',
        'googleusercontent.com', 'paypal.com', 'ebay.com', 'aliexpress.com', 'walmart.com',
        'target.com', 'bestbuy.com', 'hulu.com', 'disneyplus.com', 'primevideo.com',
        'bankofamerica.com', 'chase.com', 'wellsfargo.com', 'capitalone.com', 'dropbox.com',
        'drive.google.com', 'docs.google.com', 'mail.google.com', 'outlook.com', 'hotmail.com',
        'yahoo.com', 'github.com', 'gitlab.com', 'stackoverflow.com', 'medium.com',
        'quora.com', 'pinterest.com', 'tumblr.com', 'flickr.com', 'imgur.com', 'wordpress.com',
        'blogger.com', 'shopify.com', 'etsy.com', 'airbnb.com', 'booking.com', 'expedia.com',
        'tripadvisor.com', 'craigslist.org', 'indeed.com', 'monster.com', 'glassdoor.com',
        'webmd.com', 'mayoclinic.org', 'healthline.com', 'cdc.gov', 'who.int', 'weather.com',
        'accuweather.com', 'espn.com', 'nba.com', 'nfl.com', 'mlb.com', 'nhl.com',
        'businessinsider.com', 'techcrunch.com', 'mashable.com', 'cnet.com', 'arstechnica.com',
        'wired.com', 'theverge.com', 'gizmodo.com', 'engadget.com', 'adobe.com', 'autodesk.com',
        'salesforce.com', 'oracle.com', 'ibm.com', 'intel.com', 'nvidia.com', 'amd.com',
        'dell.com', 'hp.com', 'lenovo.com', 'asus.com', 'acer.com', 'msi.com', 'logitech.com',
        'razer.com', 'steampowered.com', 'epicgames.com', 'origin.com', 'battle.net', 'ea.com',
        'ubisoft.com', 'rockstargames.com', 'playstation.com', 'xbox.com', 'nintendo.com',
        'riotgames.com', 'roblox.com', 'minecraft.net', 'notion.so', 'trello.com', 'asana.com',
        'slack.com', 'basecamp.com', 'atlassian.com', 'jira.com',
        'confluence.com',
        'figma.com', 'sketch.com', 'canva.com', 'behance.net',
        // EXCEÇÕES ESPECÍFICAS PARA GARANTIR FUNCIONAMENTO DOS PLAYERS
        'kissanime.com.ru', 'tv3.lv', 'play.tv3.lv',
        'dribbble.com', 'dailymotion.com', 'soundcloud.com', 'bandcamp.com', 'shutterstock.com', 'gettyimages.com',
        'istockphoto.com', 'adobe.stock.com', 'unsplash.com', 'pexels.com', 'pixabay.com',
        'freepik.com', 'udemy.com', 'coursera.org', 'edx.org', 'khanacademy.org', 'skillshare.com',
        'lynda.com', 'pluralsight.com', 'codecademy.com', 'freecodecamp.org', 'udacity.com',
        'futurelearn.com', 'academia.edu', 'researchgate.net', 'scholar.google.com', 'jstor.org',
        'sciencedirect.com', 'ieee.org', 'acm.org', 'springer.com', 'wiley.com', 'tandfonline.com',
        'sagepub.com', 'oup.com', 'cambridge.org', 'nature.com',
        'sciencemag.org',
        'cell.com', 'thelancet.com', 'nejm.org', 'jamanetwork.com', 'bmj.com', 'who.int', 'fda.gov',
        'nih.gov', 'nasa.gov', 'space.com', 'esa.int', 'nationalgeographic.com', 'discovery.com',
        'history.com', 'britannica.com', 'howstuffworks.com', 'ted.com', 'kickstarter.com',
        'indiegogo.com', 'gofundme.com', 'patreon.com', 'substack.com', 'onlyfans.com',
        'fiverr.com', 'upwork.com', 'freelancer.com', '99designs.com', 'toptal.com', 'gun.io',
        'wix.com', 'squarespace.com', 'weebly.com', 'godaddy.com', 'namecheap.com', 'bluehost.com',
        'hostgator.com', 'siteground.com', 'cloudflare.com', 'akamai.com', 'fastly.com',
        'aws.amazon.com', 'azure.microsoft.com', 'cloud.google.com',
        'digitalocean.com', 'deviantart.com', 'vimeo.com',
        'linode.com', 'vultr.com', 'heroku.com', 'greasyfork.org', 'vercel.com', 'netlify.com', 'cloudinary.com',
        'imgix.com',
        'nytimes.com', 'washingtonpost.com', 'wsj.com', 'bloomberg.com', 'ft.com',
        'theguardian.com', 'usatoday.com', 'bbc.com', 'cnn.com', 'reuters.com',
        'globo.com', 'uol.com.br', 'folha.uol.com.br', 'estadao.com.br', 'abril.com.br',
        'terra.com.br', 'r7.com', 'metropoles.com', 'gazetadopovo.com.br',
        'chatgpt.com', 'gemini.google.com', 'openai.com', 'deepseek.com', 'claude.ai', 'anthropic.com',
        'perplexity.ai', 'poe.com', 'mistral.ai', 'huggingface.co', 'character.ai',
        'midjourney.com', 'leonardo.ai', 'civitai.com', 'grok.com', 'jasper.ai', 'copy.ai',
        'sora.com', 'runwayml.com', 'stability.ai', 'blackbox.ai', 'phind.com'
    ];
    let exceptions = JSON.parse(localStorage.getItem('antiAdblockExceptions') || '[]');
    let userFilters = JSON.parse(localStorage.getItem('antiAdblockUserFilters') || '{}');
    let blockedCount = 0;
    let isZapperActive = false;
    let isAggressiveMode = false;
    let isPaused = false;
    let isPopupBlocker = localStorage.getItem('uaakPopupBlocker') === 'true';

    function checkExceptionStatus() {
        const hostname = window.location.hostname;
        if (exceptionSites.some(site => hostname.includes(site))) return true;
        if (exceptions.some(exception => hostname.includes(exception))) return true;
        return false;
    }

    isPaused = checkExceptionStatus();

    // =============================================
    // NOTIFICATION SYSTEM
    // =============================================

    function showNotification(message, duration = 3000, type = 'normal') {
        if (!document.body) {
            setTimeout(() => showNotification(message, duration, type), 100);
            return;
        }

        const existing = document.querySelectorAll('.anti-adblock-notification');
        existing.forEach(el => el.remove());

        const n = document.createElement('div');
        n.className = 'anti-adblock-notification';

        let borderCol = '#4299e1';
        if (type === 'danger') borderCol = '#f56565';
        if (type === 'success') borderCol = '#48bb78';
        if (type === 'warning') borderCol = '#ed8936';
        n.style.cssText = `position:fixed;top:20px;right:20px;background:#2d3748;color:white;padding:15px 20px;border-radius:8px;z-index:2147483647;font-family:Arial,sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.5);border-left:5px solid ${borderCol};max-width:350px;white-space:pre-line;pointer-events:none;animation: fadeIn 0.3s ease-out;`;
        n.textContent = message;

        const styleAnim = document.createElement('style');
        styleAnim.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }';
        n.appendChild(styleAnim);

        document.body.appendChild(n);
        setTimeout(() => {
            n.style.opacity = '0';
            n.style.transition = 'opacity 0.5s';
            setTimeout(() => n.remove(), 500);
        }, duration);
    }

    // =============================================
    // ANTI-POPUP ENGINE
    // =============================================

    function togglePopupBlocker() {
        isPopupBlocker = !isPopupBlocker;
        localStorage.setItem('uaakPopupBlocker', isPopupBlocker);
        if (isPopupBlocker) {
            showNotification("🚫 POPUP BLOCKER: ON\nNew tabs will be blocked.\nHold CTRL to open links.", 4000, 'danger');
        } else {
            showNotification("✅ POPUP BLOCKER: OFF\nNormal navigation restored.", 3000, 'success');
        }
    }

    const nativeOpen = window.open;
    function isCtrlPressed(e) {
        return (e && e.ctrlKey) || (window.event && window.event.ctrlKey);
    }

    function hookedOpen(url, target, features) {
        if (isPopupBlocker) {
            if (!isCtrlPressed(window.event)) {
                console.log('[UAAK] Popup blocked:', url);
                showNotification(`🚫 Popup Blocked!\nHold CTRL to allow.`, 2000, 'danger');
                return null;
            }
        }
        return nativeOpen.apply(this, arguments);
    }

    window.open = hookedOpen;
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.open = hookedOpen;
    }

    window.addEventListener('click', function(e) {
        if (!isPopupBlocker) return;
        if (e.ctrlKey) return;
        const targetLink = e.target.closest('a');
        if (targetLink) {
            if (targetLink.target === '_blank') {
                e.preventDefault();
                e.stopPropagation();
                showNotification("🚫 New Tab Blocked!\nHold CTRL to open.", 1500, 'danger');
                return;
            }
        }
    }, true);

    // =============================================
    // MENU & COMMANDS
    // =============================================

    function addException() {
        const h = window.location.hostname;
        if (!exceptions.includes(h)) {
            exceptions.push(h);
            localStorage.setItem('antiAdblockExceptions', JSON.stringify(exceptions));
            showNotification(`✅ ${h} added to exceptions`);
            setTimeout(() => location.reload(), 1000);
        }
    }

    function removeException() {
        const h = window.location.hostname;
        exceptions = exceptions.filter(site => site !== h && !h.includes(site));
        localStorage.setItem('antiAdblockExceptions', JSON.stringify(exceptions));
        showNotification(`❌ ${h} removed from exceptions\nReloading...`);
        setTimeout(() => location.reload(), 1000);
    }

    function removeAllDomainExceptions() {
        const h = window.location.hostname;
        exceptions = exceptions.filter(site => !site.includes(h));
        localStorage.setItem('antiAdblockExceptions', JSON.stringify(exceptions));
        if (userFilters[h]) {
            delete userFilters[h];
            localStorage.setItem('antiAdblockUserFilters', JSON.stringify(userFilters));
        }
        showNotification(`🗑️ Full Reset for ${h}\nReloading...`);
        setTimeout(() => location.reload(), 1000);
    }

    function undoManualZaps() {
        const h = window.location.hostname;
        if (userFilters[h]) {
            delete userFilters[h];
            localStorage.setItem('antiAdblockUserFilters', JSON.stringify(userFilters));
            showNotification(`↩️ Manual Blocks cleared for ${h}\nReloading...`);
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(`ℹ️ No manual blocks found for ${h}`);
        }
    }

    function showHelp() {
        const helpText = `
🛡️ Ultimate Anti-Adblock Killer (v1.1.0)

• Alt + P → 🚫 Block Popups [${isPopupBlocker ? 'ON' : 'OFF'}]
• Ctrl+Shift+Z → ⚡ Zapper Mode
• Ctrl+Shift+E → Exception List
• Ctrl+Shift+X → Reset ALL

To open blocked links: HOLD CTRL + CLICK
        `.trim();
        showNotification(helpText, 6000);
    }

    GM_registerMenuCommand(`🚫 Toggle Anti-Popup [${isPopupBlocker ? 'ON' : 'OFF'}] (Alt+P)`, togglePopupBlocker);
    GM_registerMenuCommand('➕ Add to exceptions', addException);
    GM_registerMenuCommand('➖ Remove from exceptions', removeException);
    GM_registerMenuCommand('↩️ Undo Manual Zaps', undoManualZaps);
    GM_registerMenuCommand('🗑️ Full Reset (Domain)', removeAllDomainExceptions);
    GM_registerMenuCommand('⚡ Toggle Zapper Mode', toggleZapper);
    GM_registerMenuCommand('❓ Help / Stats', showHelp);

    window.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            togglePopupBlocker();
            return;
        }

        if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'e': e.preventDefault(); e.stopImmediatePropagation(); isPaused && !exceptionSites.some(s => window.location.hostname.includes(s)) ? removeException() : addException(); break;
                case 'x': e.preventDefault(); removeAllDomainExceptions(); break;
                case 'h': e.preventDefault(); showHelp(); break;
                case 'z': e.preventDefault(); toggleZapper(); break;
            }
        }
    }, true);

    // =============================================
    // VIDEO SAFEGUARD
    // =============================================

    function isVideoPlayer(el, isManualZap = false) {
        if (!el || !el.tagName) return false;
        const tag = el.tagName.toLowerCase();

        if (isManualZap) {
            if (tag === 'video') return true;
            if (el.id === 'movie_player' || el.classList.contains('html5-video-player')) return true;
            return false;
        }

        const cls = (el.className || '').toString().toLowerCase();
        const id = (el.id || '').toString().toLowerCase();
        if (tag === 'video' || tag === 'iframe' || tag === 'object' || tag === 'embed') return true;
        if (id === 'player' || cls.includes('player') || cls.includes('video-wrapper')) return true;
        if (cls.includes('play') || id.includes('play') || cls.includes('overlay')) {
            if (el.querySelector('svg') || el.innerText.includes('▶')) return true;
        }
        if (el.querySelector('iframe, video, object, embed')) return true;
        return false;
    }

    function isPlayerIframe() {
        try {
            if (window.self === window.top) return false;
            if (document.querySelector('video, canvas, embed, object')) return true;
            if (window.location.href.includes('player') || window.location.href.includes('video') || window.location.href.includes('embed')) return true;
            return false;
        } catch (e) { return false; }
    }

    // =============================================
    // ZAPPER MODE (PERSISTENT)
    // =============================================

    function getCssPath(el) {
        if (!(el instanceof Element)) return;
        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id && !/\d{3,}/.test(el.id) && el.id.length < 30) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                var sib = el, nth = 1;
                while (sib = sib.previousElementSibling) { if (sib.nodeName.toLowerCase() == selector) nth++; }
                if (nth != 1) selector += ":nth-of-type("+nth+")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }

    function saveUserBlock(element) {
        const selector = getCssPath(element);
        const host = window.location.hostname;
        if (!userFilters[host]) userFilters[host] = [];
        if (!userFilters[host].includes(selector)) {
            userFilters[host].push(selector);
            localStorage.setItem('antiAdblockUserFilters', JSON.stringify(userFilters));
        }
    }

    function applyUserBlocks() {
        const host = window.location.hostname;
        if (!userFilters[host]) return;
        userFilters[host].forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.style.display !== 'none') {
                        if (!isVideoPlayer(el, false)) {
                            hideElementRobustly(el);
                            blockedCount++;
                        }
                    }
                });
            } catch(e) {}
        });
    }

    function toggleZapper() {
        isZapperActive = !isZapperActive;
        if (isZapperActive) {
            showNotification("⚡ Zapper Mode ACTIVE\nClick to delete elements\nPress ESC to Exit", 4000, 'warning');
            addStyle(`
                .uaak-zapper-active * {
                    cursor: crosshair !important;
                    pointer-events: auto !important;
                    user-select: none !important;
                }
                .uaak-zapper-hover {
                    outline: 4px solid #ff0000 !important;
                    box-shadow: inset 0 0 50px rgba(255, 0, 0, 0.5) !important;
                    background: rgba(255, 0, 0, 0.1) !important;
                    z-index: 2147483647 !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            `);
            document.body.classList.add('uaak-zapper-active');
            document.addEventListener('mouseover', zapperHover, true);
            document.addEventListener('mouseout', zapperUnhover, true);
            document.addEventListener('click', zapperClick, true);
            document.addEventListener('mousedown', zapperSuppress, true);
            document.addEventListener('mouseup', zapperSuppress, true);
            document.addEventListener('keydown', zapperKey, true);
        } else {
            showNotification("Zapper Mode: OFF");
            document.body.classList.remove('uaak-zapper-active');
            document.removeEventListener('mouseover', zapperHover, true);
            document.removeEventListener('mouseout', zapperUnhover, true);
            document.removeEventListener('click', zapperClick, true);
            document.removeEventListener('mousedown', zapperSuppress, true);
            document.removeEventListener('mouseup', zapperSuppress, true);
            document.removeEventListener('keydown', zapperKey, true);
            document.querySelectorAll('.uaak-zapper-hover').forEach(el => el.classList.remove('uaak-zapper-hover'));
        }
    }

    function zapperHover(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('uaak-zapper-hover');
    }

    function zapperUnhover(e) {
        e.target.classList.remove('uaak-zapper-hover');
    }

    function zapperSuppress(e) {
        if (!isZapperActive) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    function zapperClick(e) {
        if (!isZapperActive) return;
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        if (e.target.tagName === 'BODY' || e.target.tagName === 'HTML') return;

        if (isVideoPlayer(e.target, true)) {
            showNotification("⚠️ Protected Video Element", 1000);
            return;
        }

        saveUserBlock(e.target);
        hideElementRobustly(e.target);
        blockedCount++;
        forceJailbreak();
        showNotification("💥 Zapped!");
    }

    function zapperKey(e) { if (e.key === 'Escape') toggleZapper(); }

    // =============================================
    // CORE ENGINE
    // =============================================

    var enable_debug = false;
    var adblock_pattern = /ad-block|adblock|ad block|blocking ads|bloqueur|bloqueador|Werbeblocker|آدبلوك بلس|блокировщиком/i;
    var disable_pattern = /kapat|disabl|désactiv|desactiv|desativ|deaktiv|detect|enabled|turned off|turn off|απενεργοποίηση|запрещать|állítsd le|publicités|рекламе|verhindert|advert|kapatınız|allow|permitir|whitelist/i;
    var premium_pattern = /premium|upgrade|subscription|subscribe|assine|assinatura|s'abonner|suscribirse|member access|read the full|paywall|register free|create a free account|log in|great deal|limited time offer|support us|keep reading|this is not a paywall|unlock this article|funding choices|sankaku infinite|ad-free browsing|az-pur/i;
    var cookie_pattern = /cookie|consent|gdpr|lgpd|privacy policy|política de privacidade|aceitar|accept|agree|allow|advertising and tracking|with advertising|agreed/i;
    var tagNames_pattern = /b|center|div|font|i|iframe|s|span|section|u/i;
    var is_core_protected = false;
    var classes = [];

    function debug( msg, val ) {
        if ( !enable_debug ) return;
        console.log( '%c ANTI-ADBLOCKER \n','color: white; background-color: red', msg );
    }

    function addStyle(str) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(str);
            return;
        }
        var style = document.createElement('style');
        style.textContent = str;
        (document.body || document.head || document.documentElement).appendChild(style);
    }

    function randomInt( min, max ) {
        if ( max === undefined ) { max = min; min = 0; }
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    function getRandomName( size ) {
        var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var name = '';
        for (var i = 0; i < (size||randomInt(10,20)); ++i) {
            name += charset.charAt( Math.floor( Math.random() * charset.length) );
        }
        return name;
    }

    function addRandomClass( el ) {
        let name = getRandomName();
        el.classList.add( name );
        return name;
    }

    function isElementFixed( el ) {
        if (el instanceof Element) {
          return window.getComputedStyle(el).getPropertyValue('position') == 'fixed';
        }
    }

    function isNotHidden( el ) {
        if (el instanceof Element) {
          return window.getComputedStyle(el).getPropertyValue('display') != 'none';
        }
    }

    function isBlackoutModal( el ) {
        if (el instanceof Element) {
          if (isVideoPlayer(el)) return false;
          var style = window.getComputedStyle( el );
          if (style.position !== 'fixed' && style.position !== 'absolute') return false;
          var top = parseInt( style.top ) || 0;
          var left = parseInt( style.left ) || 0;
          var right = parseInt( style.right ) || 0;
          var bottom = parseInt( style.bottom ) || 0;
          var coversHeight = el.offsetHeight >= window.innerHeight * 0.9;
          var coversWidth = el.offsetWidth >= window.innerWidth * 0.9;
          var anchored = (top <= 5 && left <= 5) || (right <= 5 && bottom <= 5) ||
          (top <= 5 && right <= 5);
          return coversHeight && coversWidth && anchored;
        }
        return false;
    }

    function isAntiAdblockText( value ) {
        if (cookie_pattern.test(value) && (value.length < 350)) return true;
        if (adblock_pattern.test( value ) && disable_pattern.test( value )) return true;
        if (premium_pattern.test(value) && (value.toLowerCase().includes('ads') || value.toLowerCase().includes('account') || value.toLowerCase().includes('continue') || value.toLowerCase().includes('offer') || value.toLowerCase().includes('access') || value.toLowerCase().includes('subscri'))) return true;
        return false;
    }

    function isModalWindows( el ) {
        if (el.className && (el.className.includes('pop_content') || el.className.includes('fc-ab-dialog') || el.className.includes('qc-cmp2'))) return true;
        return isElementFixed ( el ) && ( isAntiAdblockText( el.textContent ) || isBlackoutModal( el ) );
    }

    function isSafetyHeader( el ) {
        if (!el || !el.getBoundingClientRect) return false;
        if (el.tagName === 'HEADER' || el.tagName === 'NAV' || el.tagName === 'ASIDE') return true;
        if (el.closest('[data-elementor-type="header"]')) return true;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 5 && rect.height < 300 && rect.width > window.innerWidth * 0.8) {
             if (el.querySelector('nav') || el.querySelector('[role="navigation"]') || el.querySelector('.menu')) return true;
        }
        if (rect.width < 400 && rect.height > window.innerHeight * 0.5) {
            if (!isAntiAdblockText(el.innerText)) return true;
        }
        return false;
    }

    function isSafetyContent(el) {
        if (!el) return false;
        if (el.tagName === 'IFRAME') {
             if (el.src.includes('cp.finanzen.net') || el.src.includes('contentpass') || el.title.includes('Contentpass')) return false;
        }
        if (el.id === 'cmpwrapper' || el.className.includes('cmpwrapper')) return false;
        const idClass = (el.id + " " + el.className).toLowerCase();
        if (isAggressiveMode) {
            if (idClass.includes('fides') || idClass.includes('privacy') || idClass.includes('consent') || idClass.includes('gateway') || idClass.includes('modal') || idClass.includes('paywall')) {
                return false;
            }
        }
        if (isVideoPlayer(el)) return true;
        if (isElementFixed(el) && premium_pattern.test(el.innerText)) return false;
        if (el.tagName === 'ARTICLE' || el.tagName === 'MAIN') return true;
        if (el.innerText && el.innerText.length > 600) return true;
        if (el.querySelectorAll('p').length > 5) return true;
        return false;
    }

    function forceContentRestore(el) {
        el.classList.add('uaak-force-visible');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('max-height', 'none', 'important');

        if (isAggressiveMode) {
            el.style.setProperty('display', 'block', 'important');
            el.style.setProperty('z-index', '9999', 'important');
        }
    }

    function protectCore() {
        if ( is_core_protected ) return;
        if (typeof unsafeWindow === 'undefined') {
          const unsafeWindow = window;
        }

        const $_removeChild = unsafeWindow.Node.prototype.removeChild;
        unsafeWindow.Node.prototype.removeChild = function( node ) {
            if (isCloudflare()) return $_removeChild.apply( this, arguments );
            if ( node.nodeName == 'HEAD' || node.nodeName == 'BODY' ) return debug( 'Blocked delete ' + node.nodeName, node );
            if (node.nodeType === 1 && isSafetyContent(node)) return node;
            $_removeChild.apply( this, arguments );
        };
        const $_innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        if ($_innerHTML && $_innerHTML.set) {
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function (value) {
                    if (isCloudflare()) return $_innerHTML.set.call(this, value);
                    if ( this.nodeName == 'BODY' || isAntiAdblockText( value ) ) return debug( 'Blocked innerHTML change', value );
                    try { return $_innerHTML.set.call(this, value); } catch(e) {}
                },
                get: function() { return $_innerHTML.get.call(this); },
                configurable: true
            });
        }
        is_core_protected = true;
    }

    function forceJailbreak() {
        if (isCloudflare()) return;
        [document.documentElement, document.body].forEach(el => {
            if(!el) return;
            el.classList.add('uaak-force-scroll');
            el.style.setProperty('overflow', 'visible', 'important');
            el.style.setProperty('overflow-y', 'auto', 'important');
            el.style.setProperty('position', 'static', 'important');
            el.style.setProperty('touch-action', 'auto', 'important');
            if (window.getComputedStyle(el).position === 'fixed')
            {
                 el.style.setProperty('position', 'static', 'important');
            }
        });
        const lockedWrappers = document.querySelectorAll('#__next, #main-content, .main-wrapper, [class*="overflow-hidden"]');
        lockedWrappers.forEach(el => {
            el.style.setProperty('overflow', 'visible', 'important');
            el.style.setProperty('height', 'auto', 'important');
        });
        if (document.body) {
            const badClasses = ['modal-open', 'no-scroll', 'stop-scrolling', 'adblock-blur', 'fides-overlay-modal-link-shown', 'nyt-hide-scroll', 'overflow-hidden', 'mdpDeblocker-blur', 'mdpDeblocker-style-compact', 'mdpDeblocker-style-full'];
            document.body.classList.forEach(cls => {
                if (badClasses.some(bc => cls.includes(bc))) document.body.classList.remove(cls);
            });
        }
    }

    function removeShadows() {
        if (isPlayerIframe()) return;
        document.querySelectorAll('div, section, .modal-backdrop, .fade.in, .fc-dialog-overlay').forEach(el => {
            if (isVideoPlayer(el)) return;
            const style = window.getComputedStyle(el);
            if ((style.position === 'fixed' || style.position === 'absolute') &&
                parseInt(style.height) > window.innerHeight * 0.8 &&
                parseInt(style.width) > window.innerWidth * 0.8) {
                const bgColor = style.backgroundColor;
                const isOverlay = bgColor.includes('rgba') || style.opacity < 1 || style.filter.includes('blur') || el.className.includes('backdrop') || el.className.includes('overlay');
                if (isOverlay) {
                     if (!isSafetyHeader(el) && !isSafetyContent(el)) {
                         hideElementRobustly(el);
                     }
                }
            }
        });
    }

    // New Auto Click for Consent
    function tryAutoClickConsent() {
        const buttons = document.querySelectorAll('button, div[role="button"], a.btn');
        buttons.forEach(btn => {
            const text = btn.innerText.toLowerCase();
            if (text.includes('continue with ads') ||
                text.includes('kostenfrei weiterlesen') ||
                (text.includes('confirm') && btn.closest('.qc-cmp2-footer'))) {
                if (btn.offsetParent !== null) {
                    btn.click();
                }
            }
        });
    }

    function cleanBackgroundWrappers() {
        if (isPlayerIframe()) return;
        if (document.querySelector('.vi-gateway-container, #gateway-content, #fides-overlay, #fides-overlay-wrapper')) {
            isAggressiveMode = true;
        }

        const specificBlockList = [
            '.pop_content', '.fc-ab-dialog', '.fc-dialog-overlay',
            '.qc-cmp2-container', '.qc-usp-ui-content',
            '.cmp_verticalLayout', '.cmp_paywall', // Abendzeitung and others
            '.cmp-root-container', '#cmp-root-container' // SHADOW DOM HOST KILLER
        ];
        document.querySelectorAll(specificBlockList.join(', ')).forEach(el => hideElementRobustly(el));

        if (isAggressiveMode) {
            const nytSelectors = [
                '.vi-gateway-container', '#gateway-content', '.css-1bd8bfl',
                '.css-1k28tcn-formStyles-formStyles-EnterEmailSsoBottom',
                '[data-testid="onsite-messaging-unit-gateway"]',
                '.fides-overlay', '#fides-overlay', '#fides-overlay-wrapper', '#fides-modal', '.fides-modal-container'
            ];
            document.querySelectorAll(nytSelectors.join(', ')).forEach(el => hideElementRobustly(el));
            document.querySelectorAll('#app, #site-content, #main, .main-content, #story, article').forEach(el => {
                forceContentRestore(el);
            });
        }

        document.querySelectorAll('.background, .backdrop, .modal-paywall-overlay').forEach(el => {
            if (isVideoPlayer(el)) return;
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' && parseInt(style.height) > window.innerHeight * 0.9) {
                if (!isSafetyContent(el)) hideElementRobustly(el);
            }
        });
        removeShadows();
    }

    function removeBackStuff() {
        if (isPlayerIframe()) return;
        document.querySelectorAll( 'b,center,div,font,i,iframe,s,span,section,u' ).forEach( ( el ) => {
            if (isSafetyContent(el)) forceContentRestore(el);
            else if ( isBlackoutModal( el ) && !isSafetyHeader(el) ) hideElementRobustly(el);
            else if ( (/blur/i).test( window.getComputedStyle(el).filter ) ) forceContentRestore(el);
        });
        cleanBackgroundWrappers();
        setTimeout( forceJailbreak, 50);
    }

    function hideElementRobustly(el) {
        if(!el) return;
        if (isVideoPlayer(el)) return;
        if (isPlayerIframe()) return;

        el.removeAttribute('id');
        el.removeAttribute('class');
        var class_name = addRandomClass( el );
        classes.push( class_name );
        el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');
        addStyle( '.' + class_name + '{ display: none !important; }' );
    }

    function checkModals() {
        if (isCloudflare()) return;
        if (isPlayerIframe()) return;
        var modalFound = false;
        document.querySelectorAll( 'b,center,div,font,i,iframe,s,span,section,u' ).forEach( ( el ) => {
            if ( isModalWindows( el ) && isNotHidden( el ) ) {
                modalFound = true;
                removeModal( el );
            }
        });
        if ( modalFound ) setTimeout( removeBackStuff, 150);
    }

    function removeModal( el, isNew ) {
        if ( (new RegExp(classes.join('|'))).test( el.classList ) ) return;
        if (isSafetyHeader(el)) return;

        if (el.className && (el.className.includes('pop_content') || el.className.includes('fc-ab-dialog') || el.className.includes('qc-cmp2'))) {
             hideElementRobustly(el);
             return;
        }

        if (isAntiAdblockText(el.textContent)) {
             hideElementRobustly(el);
             blockedCount++;
             try {
                var p = el.parentElement;
                if (p && window.getComputedStyle(p).position === 'fixed') hideElementRobustly(p);
             } catch(e){}

             if (isNew) setTimeout( removeBackStuff, 150);
             forceJailbreak();
             return;
        }

        if (isSafetyContent(el)) {
            forceContentRestore(el);
            return;
        }

        hideElementRobustly(el);
        blockedCount++;
        forceJailbreak();
    }

    // =============================================
    // EXECUTION
    // =============================================

    window.addEventListener('DOMContentLoaded', (event) => {
        if (isCloudflare()) return;

        classes.push( getRandomName() );
        applyUserBlocks();

        setTimeout(() => {
            if (isPaused) {
                showNotification(`⛔ Ultimate Anti-Adblock Killer\nPAUSED (Exceptions List)`);
            } else {
                let status = isPopupBlocker ? "\n🛡️ Anti-Popup ON" : "";
                showNotification(`🛡️ Ultimate Anti-Adblock Killer\nACTIVE & Protecting${status}`);
            }
        }, 1000);

        if (!isPaused) {
            if (isPlayerIframe()) return;

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var observer = new MutationObserver( (mutations) => {
                mutations.forEach( (mutation) => {
                    if ( mutation.addedNodes.length ) {
                        Array.prototype.forEach.call( mutation.addedNodes, ( el ) => {
                            if ( !tagNames_pattern.test ( el.tagName ) ) return;
                            if ( isModalWindows( el ) && isNotHidden( el ) ) {
                                removeModal( el, true );
                            }
                        });
                    }
                });
                applyUserBlocks();
                // Persistent Zapper Check on Mutation
            });
            if (document.body) {
                observer.observe(document.body, { childList : true, subtree : true });
            }

            setTimeout( function() { checkModals(); }, 150 );
            setTimeout(function(){ document.querySelectorAll('iframe[id^="google_ads_iframe"]').forEach(el => el.style.display='none'); }, 2000);

            let checkCount = 0;
            let checkInterval = setInterval(() => {
                checkModals();
                removeBackStuff();
                cleanBackgroundWrappers();
                applyUserBlocks(); // Persistent Zapper Check in Loop
                tryAutoClickConsent(); // Auto-Clicker
                checkCount++;
                if(checkCount > 40) clearInterval(checkInterval);
            }, 1000);
            // Long term maintenance
            setInterval(() => {
                applyUserBlocks();
            }, 3000);
            protectCore();
        }

        addStyle(`
            /* FORCE SCROLL UNLOCK */
            html, body {
                overflow: auto !important;
                overflow-y: auto !important;
                position: static !important;
                height: auto !important;
                width: auto !important;
                touch-action: auto !important;
            }
            .uaak-force-scroll, body.scroll_on, html.scroll_on { overflow: visible !important; overflow-y: auto !important; }
            .hide_modal, .pop_content, .fc-ab-dialog, .fc-dialog-overlay { display: none !important; }
            .un_blur, .uaak-force-visible {
                filter: none !important; opacity: 1 !important; visibility: visible !important; max-height: none !important;
            }
            /* Quantcast & Generic CMPs */
            .qc-cmp2-container, .qc-usp-ui-content, .qc-usp-container,
            .cmp_verticalLayout, .cmp_header, .cmp_mainContent,
            .cmp-root-container, #cmp-root-container,
            #onetrust-banner-sdk, .onetrust-pc-dark-filter, #CybotCookiebotDialog,
            .cookie-notice, #cookie-law-info-bar, .cookie-banner,
            #didomi-host, .osano-cm-window, #usercentrics-root,
            .message-overlay, .message-container,
            div[id^="sp_message_container"],
            div[class*="sp_choice_type"],
            div[id="notice"][class*="message"] {
                display: none !important;
            }
            /* Specific Fix for Finanzen.net / Contentpass */
            iframe[src*="cp.finanzen.net"],
            iframe[title="Contentpass First Layer"],
            iframe[src*="contentpass"],
            .cmpwrapper,
            #cmpwrapper {
                display: none !important;
                pointer-events: none !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
            }
            /* GHOST IMAGE KILLER */
            img[width="99999"], img[height="99999"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
            /* WAPO & GENERIC PAYWALL FIXES */
            [id^="paywall-"], [id="payment-methods"], #subs-turnstile-hook-wall-reg,
            #strategy__monthly, #strategy__annual,
            #wall-bottom-drawer, [data-bundle-name^="regwall-"],
            [data-qa="wall-background"], .regwall-overlay {
                display: none !important;
            }
            body.overflow-hidden, html.overflow-hidden {
                overflow: visible !important;
                position: static !important;
            }
        `);
    });

    window.addEventListener('load', (event) => {
        if (isCloudflare()) return;
        setTimeout( function() {
            if (!isPaused && !isPlayerIframe()) {
                checkModals();
                forceJailbreak();
            }
        }, 1500 );
    });
})();