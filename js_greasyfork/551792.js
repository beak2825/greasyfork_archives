// ==UserScript==
// @name:en         Auto-PROXY-SF
// @description:en  Advanced proxy redirection with intelligent instance selection, automatic scraping, shortlink bypassing and full configuration.
// @name         Auto-PROXY-SF
// @description  Zaawansowane przekierowanie proxy z inteligentnym wyborem instancji, automatycznym scrapingiem, omijaniem shortlinków i pełną konfiguracją.
// @namespace    https://anonymousik.is-a.dev/userscripts
// @version      2.0.2
// @author       Anonymousik
// @homepageURL  https://anonymousik.is-a.dev
// @supportURL   https://anonymousik.is-a.dev
// @license      AGPL-3.0-only
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @require      https://update.greasyfork.org/scripts/528923/1599357/MonkeyConfig%20Mod.js
// @run-at       document-start
// @connect      api.invidious.io
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      searx.space
// @connect      codeberg.org
// @connect      nadeko.net
// @connect      puffyan.us
// @connect      yewtu.be
// @connect      tux.pizza
// @connect      privacydev.net
// @connect      nitter.net
// @connect      xcancel.com
// @connect      poast.org
// @connect      nitter.it
// @connect      unixfox.eu
// @connect      spike.codes
// @connect      privacy.com.de
// @connect      dcs0.hu
// @connect      lunar.icu
// @connect      artemislena.eu
// @connect      searx.be
// @connect      mdosch.de
// @connect      tiekoetter.com
// @connect      bus-hit.me
// @connect      pabloferreiro.es
// @connect      habedieeh.re
// @connect      pussthecat.org
// @connect      totaldarkness.net
// @connect      rip
// @connect      citizen4.eu
// @connect      iket.me
// @connect      vern.cc
// @connect      antifandom.com
// @connect      whatever.social
// @connect      hostux.net
// @connect      *
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48dGV4dCB5PSI0MDAiIGZvbnQtc2l6ZT0iNDAwIj7wn5S3PC90ZXh0Pjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/551792/Auto-PROXY-SF.user.js
// @updateURL https://update.greasyfork.org/scripts/551792/Auto-PROXY-SF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Zmienne Globalne ===
    let scriptConfig;
    const MONKEY_CONFIG_LOADED = typeof MonkeyConfig !== 'undefined';

    if (!MONKEY_CONFIG_LOADED) {
        console.error(
            '[Auto-PROXY-SF] BŁĄD KRYTYCZNY: Biblioteka MonkeyConfig Mod nie została załadowana. ' +
            'Interfejs konfiguracyjny będzie niedostępny. Skrypt będzie działał z ustawieniami domyślnymi. ' +
            'Sprawdź, czy adres URL w dyrektywie @require jest poprawny oraz czy masz aktywne połączenie z internetem.'
        );
    }

    const CONFIG = {
        VERSION: '2.0.2',
        HEALTH_CHECK_INTERVAL: 300000,
        INSTANCE_TIMEOUT: 5000,
        SCRAPER_TIMEOUT: 15000,
        PARALLEL_CHECKS: 6,
        MAX_RETRY_ATTEMPTS: 3,
        SCRAPER_UPDATE_INTERVAL: 43200000,
        MIN_INSTANCE_SCORE: 30,
        CACHE_EXPIRY: 86400000,
        QUEUE_DELAY: 100,
        EXPONENTIAL_BACKOFF_BASE: 1000,
        MAX_BACKOFF_DELAY: 30000
    };

    const GMCompat = {
        getValue: typeof GM !== 'undefined' && GM.getValue ? GM.getValue : GM_getValue,
        setValue: typeof GM !== 'undefined' && GM.setValue ? GM.setValue : GM_setValue,
        deleteValue: typeof GM !== 'undefined' && GM.deleteValue ? GM.deleteValue : GM_deleteValue,
        xmlHttpRequest: typeof GM !== 'undefined' && GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest,
        registerMenuCommand: typeof GM !== 'undefined' && GM.registerMenuCommand ? GM.registerMenuCommand : GM_registerMenuCommand,
        unregisterMenuCommand: typeof GM !== 'undefined' && GM.unregisterMenuCommand ? GM.unregisterMenuCommand : GM_unregisterMenuCommand,
        notification: typeof GM !== 'undefined' && GM.notification ? GM.notification : GM_notification,
        openInTab: typeof GM !== 'undefined' && GM.openInTab ? GM.openInTab : GM_openInTab
    };

    const configDefinition = {
        title: 'Konfiguracja Auto-PROXY-SF',
        menuCommand: true,
        params: {
            enabled: { label: 'Włącz Auto-PROXY-SF', type: 'checkbox', default: true },
            network: { label: 'Preferowana sieć', type: 'select', options: ['clearnet', 'i2p'], default: 'clearnet' },
            autoRedirect: { label: 'Automatyczne przekierowanie strony', type: 'checkbox', default: true },
            linkRewriting: { label: 'Dynamiczne przepisywanie linków', type: 'checkbox', default: true },
            bypassShortlinks: { label: 'Omijaj skrócone linki (shortlinki)', type: 'checkbox', default: true },
            showLoadingPage: { label: 'Pokazuj animację ładowania', type: 'checkbox', default: true },
            autoUpdateInstances: { label: 'Automatyczna aktualizacja instancji', type: 'checkbox', default: true },
            notificationsEnabled: { label: 'Włącz powiadomienia', type: 'checkbox', default: true },
            minInstanceScore: { label: 'Minimalna ocena instancji', type: 'number', default: 30, min: 0, max: 100 },
            healthCheckInterval: { label: 'Częstotliwość sprawdzania (minuty)', type: 'number', default: 5, min: 1, max: 60 },
            instanceTimeout: { label: 'Limit czasu instancji (sekundy)', type: 'number', default: 5, min: 1, max: 30 },
            parallelChecks: { label: 'Równoległe sprawdzanie instancji', type: 'number', default: 6, min: 1, max: 20 },
            services: {
                label: 'Włączone serwisy', type: 'section',
                children: {
                    invidious: { label: 'YouTube → Invidious', type: 'checkbox', default: true },
                    nitter: { label: 'Twitter/X → Nitter', type: 'checkbox', default: true },
                    libreddit: { label: 'Reddit → Libreddit', type: 'checkbox', default: true },
                    teddit: { label: 'Reddit → Teddit', type: 'checkbox', default: true },
                    searx: { label: 'Google → SearX', type: 'checkbox', default: true },
                    proxitok: { label: 'TikTok → ProxiTok', type: 'checkbox', default: true },
                    rimgo: { label: 'Imgur → Rimgo', type: 'checkbox', default: true },
                    scribe: { label: 'Medium → Scribe', type: 'checkbox', default: true },
                    quetre: { label: 'Quora → Quetre', type: 'checkbox', default: true },
                    libremdb: { label: 'IMDB → LibreMDB', type: 'checkbox', default: true },
                    breezewiki: { label: 'Fandom → BreezeWiki', type: 'checkbox', default: true },
                    anonymousoverflow: { label: 'StackOverflow → AnonymousOverflow', type: 'checkbox', default: true },
                    bibliogram: { label: 'Instagram → Bibliogram', type: 'checkbox', default: true },
                    wikiless: { label: 'Wikipedia → Wikiless', type: 'checkbox', default: true }
                }
            }
        },
        events: {
            save: function() {
                console.log('[Auto-PROXY-SF] Konfiguracja została pomyślnie zapisana.');
                if (scriptConfig.get('notificationsEnabled')) {
                    showNotification('Konfiguracja zapisana', 'Ustawienia zostały zaktualizowane.');
                }
                if (window.autoProxyInstance) {
                    window.autoProxyInstance.setupMenu();
                }
            }
        }
    };

    // === Inicjalizacja Konfiguracji (z trybem awaryjnym) ===
    if (MONKEY_CONFIG_LOADED) {
        try {
            scriptConfig = new MonkeyConfig(configDefinition);
        } catch (error) {
            console.error('[Auto-PROXY-SF] Wystąpił błąd podczas inicjalizacji MonkeyConfig:', error);
            // Awaryjne przejście do obiektu zastępczego, jeśli konstruktor zawiedzie
            scriptConfig = createFallbackConfig();
        }
    } else {
        scriptConfig = createFallbackConfig();
    }
    
    function createFallbackConfig() {
        // Tworzy mapę domyślnych wartości
        const defaults = {};
        for (const key in configDefinition.params) {
            const param = configDefinition.params[key];
            defaults[key] = param.default;
            if (param.children) {
                for (const childKey in param.children) {
                    defaults[`services.${childKey}`] = param.children[childKey].default;
                }
            }
        }
        // Zwraca obiekt zastępczy
        return {
            get: function(key) {
                return key in defaults ? defaults[key] : true;
            },
            set: function() {
                 console.warn('[Auto-PROXY-SF] Próba zapisu ustawień w trybie awaryjnym. Zmiany nie zostaną zapisane.');
            },
            open: function() {
                alert(
                    'Panel konfiguracyjny Auto-PROXY-SF jest niedostępny.\n\n' +
                    'Powód: Zewnętrzna biblioteka "MonkeyConfig Mod" nie została załadowana.\n\n' +
                    'Możliwe przyczyny:\n' +
                    '- Problemy z połączeniem internetowym.\n' +
                    '- Chwilowa niedostępność serwisu GreasyFork.\n' +
                    '- Zmiana adresu URL biblioteki w skrypcie.\n\n' +
                    'Skrypt działa w tle z domyślnymi ustawieniami.'
                );
            },
            isFallback: true
        };
    }
    
    function showNotification(title, message) {
        if (scriptConfig.get('notificationsEnabled')) {
            try {
                GMCompat.notification({ text: message, title: 'Auto-PROXY-SF: ' + title, timeout: 4000 });
            } catch (error) {
                console.log(`[Auto-PROXY-SF] ${title}: ${message}`);
            }
        }
    }

    const SHORTLINK_PATTERNS = [
        /^(?:www\.)?(?:bit\.ly|bitly\.com|goo\.gl|ow\.ly|short\.io|tiny\.cc|tinyurl\.com|is\.gd|buff\.ly|adf\.ly|bc\.vc|linkbucks\.com|shorte\.st|ouo\.io|ouo\.press|clk\.sh|exe\.io|linkshrink\.net|shrinkme\.io|gplinks\.in|droplink\.co|earnl\.xyz|try2link\.com|mboost\.me|du-link\.in)$/i,
        /^(?:www\.)?(?:1ink\.cc|123link\.top|1cloudfile\.com|1fichier\.com|2короткая\.ссылка|4links\.org|4slink\.com|7r6\.com|adfly\.fr|adrinolinks\.in|aegispro\.xyz|aiotpay\.com|aiotpay\.in)$/i,
        /^(?:www\.)?(?:al\.ly|allcryptoz\.net|android-news\.org|apkadmin\.com|appsfire\.org|arabylinks\.online|atglinks\.com|ay\.live|bc\.game|beastapk\.com|bdlinks\.pw|besturl\.link|bluemediafile\.com)$/i,
        /^(?:www\.)?(?:boost\.ink|bootdey\.com|cespapa\.com|clicksfly\.com|clk\.wiki|clkmein\.com|clksh\.com|coincroco\.com|coinsward\.com|compucalitv\.com|crazyslink\.in|criptologico\.com)$/i,
        /^(?:www\.)?(?:cryptorotator\.com|cuon\.io|cut-urls\.com|cutt\.ly|cutt\.us|cuttly\.com|cutwin\.com|cybertechng\.com|dailyuploads\.net|datanodes\.to|dddrive\.me|de\.gl|destyy\.com)$/i,
        /^(?:www\.)?(?:dfe\.bz|digitalproductreviews\.com|directlinks\.online|dlmob\.pw|dosya\.co|drhd\.link|drive\.google\.com|dropgalaxy\.com|droplink\.co|dz-linkk\.com|earn4link\.in|earnmony\.xyz)$/i,
        /^(?:www\.)?(?:earnow\.online|easycut\.io|easysky\.in|efukt\.link|eklablog\.com|emturbovid\.com|enagato\.com|eni\.ch|escheat\.com|exey\.io|extra-mili\.com|ezvn\.link|f\.xeovo\.com)$/i,
        /^(?:www\.)?(?:faceclips\.net|faucetcrypto\.com|fc-lc\.xyz|fc\.lc|file-upload\.com|file-upload\.net|filecrypt\.cc|filecrypt\.co|filerio\.in|flashlink\.online|flvto\.ch|forex\.world)$/i,
        /^(?:www\.)?(?:forexmab\.com|forextraderz\.com|freecoursesite\.com|freethescience\.com|fulltchat\.app|fx4vip\.com|gadgetlove\.me|gadgetsreviewer\.com|gamesmega\.net|gatling\.link)$/i,
        /^(?:www\.)?(?:gdr\.vip|gdtot\.fun|gdurl\.com|geradaurl\.com|get\.app\.link|getmega\.net|geturl\.link|gistify\.com|goo-gl\.me|goo-gl\.ru\.com|gplinks\.co|gplinks\.in)$/i
    ];
    const BYPASS_DOMAINS = new Set(['bit.ly', 'bitly.com', 'goo.gl', 'ow.ly', 'short.io', 'tiny.cc', 'tinyurl.com', 'is.gd', 'buff.ly', 'adf.ly', 'bc.vc', 'linkbucks.com', 'shorte.st', 'ouo.io', 'ouo.press', 'clk.sh', 'exe.io', 'linkshrink.net', 'shrinkme.io', 'gplinks.in', 'droplink.co', 'earnl.xyz', 'try2link.com', 'mboost.me', 'du-link.in']);
    const INSTANCE_SOURCES = { invidious: [{ url: 'https://api.invidious.io/instances.json', type: 'json', parser: 'invidiousAPI', priority: 1 }, { url: 'https://raw.githubusercontent.com/iv-org/documentation/master/docs/instances.md', type: 'markdown', parser: 'markdownTable', priority: 2 }], nitter: [{ url: 'https://raw.githubusercontent.com/zedeus/nitter/master/instances.json', type: 'json', parser: 'nitterJSON', priority: 1 }, { url: 'https://github.com/zedeus/nitter/wiki/Instances', type: 'html', parser: 'githubWiki', priority: 2 }], libreddit: [{ url: 'https://raw.githubusercontent.com/libreddit/libreddit-instances/master/instances.json', type: 'json', parser: 'genericJSON', priority: 1 }], searx: [{ url: 'https://searx.space/data/instances.json', type: 'json', parser: 'searxSpace', priority: 1 }], proxitok: [{ url: 'https://raw.githubusercontent.com/pablouser1/ProxiTok/master/instances.md', type: 'markdown', parser: 'markdownList', priority: 1 }], rimgo: [{ url: 'https://codeberg.org/rimgo/instances/raw/branch/main/instances.json', type: 'json', parser: 'genericJSON', priority: 1 }] };
    const STATIC_INSTANCES = { clearnet: { invidious: ['https://inv.nadeko.net', 'https://vid.puffyan.us', 'https://yewtu.be', 'https://inv.tux.pizza', 'https://invidious.privacydev.net', 'https://inv.riverside.rocks', 'https://yt.artemislena.eu', 'https://invidious.flokinet.to'], nitter: ['https://nitter.net', 'https://xcancel.com', 'https://nitter.privacydev.net', 'https://nitter.poast.org', 'https://nitter.it', 'https://nitter.unixfox.eu', 'https://nitter.1d4.us', 'https://nitter.kavin.rocks'], libreddit: ['https://libreddit.spike.codes', 'https://libreddit.privacy.com.de', 'https://libreddit.dcs0.hu', 'https://libreddit.lunar.icu', 'https://reddit.artemislena.eu', 'https://lr.riverside.rocks'], teddit: ['https://teddit.net', 'https://teddit.privacydev.net', 'https://teddit.hostux.net'], searx: ['https://searx.be', 'https://search.mdosch.de', 'https://searx.tiekoetter.com', 'https://search.bus-hit.me', 'https://searx.work', 'https://searx.fmac.xyz'], proxitok: ['https://proxitok.pabloferreiro.es', 'https://proxitok.privacy.com.de', 'https://tok.habedieeh.re', 'https://proxitok.pussthecat.org'], rimgo: ['https://rimgo.pussthecat.org', 'https://rimgo.totaldarkness.net', 'https://rimgo.bus-hit.me', 'https://rimgo.privacydev.net'], scribe: ['https://scribe.rip', 'https://scribe.citizen4.eu', 'https://scribe.bus-hit.me', 'https://scribe.privacydev.net'], quetre: ['https://quetre.iket.me', 'https://quetre.pussthecat.org', 'https://quetre.privacydev.net', 'https://quetre.projectsegfau.lt'], libremdb: ['https://libremdb.iket.me', 'https://ld.vern.cc', 'https://lmdb.hostux.net'], breezewiki: ['https://antifandom.com', 'https://breezewiki.nadeko.net', 'https://bw.vern.cc'], anonymousoverflow: ['https://code.whatever.social', 'https://overflow.hostux.net', 'https://ao.vern.cc'], bibliogram: ['https://bibliogram.art', 'https://bibliogram.snopyta.org'], wikiless: ['https://wikiless.org', 'https://wikiless.northboot.xyz'] }, i2p: { invidious: ['http://inv.vern.i2p', 'http://inv.cn.i2p', 'http://ytmous.i2p', 'http://tube.i2p'], nitter: ['http://tm4rwkeysv3zz3q5yacyr4rlmca2c4etkdobfvuqzt6vsfsu4weq.b32.i2p', 'http://nitter.i2p'], libreddit: ['http://woo5ugmoomzbtaq6z46q4wgei5mqmc6jkafqfi5c37zni7xc4ymq.b32.i2p', 'http://reddit.i2p'], teddit: ['http://k62ptris7p72aborr4zoanee7xai6wguucveptwgxs5vbgt7qzpq.b32.i2p', 'http://teddit.i2p'], searx: ['http://ransack.i2p', 'http://mqamk4cfykdvhw5kjez2gnvse56gmnqxn7vkvvbuor4k4j2lbbnq.b32.i2p'], wikiless: ['http://wikiless.i2p'], proxitok: ['http://qr.vern.i2p'] } };
    const SERVICE_PATTERNS = { invidious: { regex: /^(?:www\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com|m\.youtube\.com)$/, priority: 10, pathBuilder: (url) => { const v = url.searchParams.get('v'); if (v) return `/watch?v=${v}`; const p = url.pathname.match(/^\/(watch|embed|shorts|live)\/([^/?]+)/); if (p) return `/${p[1]}/${p[2]}${url.search}`; return url.pathname + url.search; } }, nitter: { regex: /^(?:www\.)?(?:twitter\.com|x\.com|mobile\.twitter\.com|mobile\.x\.com)$/, priority: 9, pathBuilder: (url) => url.pathname + url.search }, libreddit: { regex: /^(?:www\.)?(?:old\.)?(?:new\.)?reddit\.com$/, priority: 8, pathBuilder: (url) => url.pathname + url.search }, teddit: { regex: /^(?:www\.)?(?:old\.)?reddit\.com$/, priority: 7, pathBuilder: (url) => url.pathname + url.search }, searx: { regex: /^(?:www\.)?(?:google\.com|google\.[a-z]{2,3}|bing\.com|duckduckgo\.com|yahoo\.com)$/, pathCheck: /^\/search/, priority: 8, pathBuilder: (url) => { const q = url.searchParams.get('q') || url.searchParams.get('query'); return q ? `/search?q=${encodeURIComponent(q)}` : '/'; } }, proxitok: { regex: /^(?:www\.)?(?:tiktok\.com|m\.tiktok\.com)$/, priority: 7, pathBuilder: (url) => url.pathname + url.search }, rimgo: { regex: /^(?:www\.)?(?:imgur\.com|i\.imgur\.com|m\.imgur\.com)$/, priority: 6, pathBuilder: (url) => url.pathname + url.search }, scribe: { regex: /^(?:www\.)?medium\.com$|^[^.]+\.medium\.com$/, priority: 6, pathBuilder: (url) => url.pathname + url.search }, quetre: { regex: /^(?:www\.)?quora\.com$/, priority: 5, pathBuilder: (url) => url.pathname + url.search }, libremdb: { regex: /^(?:www\.)?imdb\.com$/, priority: 5, pathBuilder: (url) => url.pathname + url.search }, breezewiki: { regex: /^[^.]+\.fandom\.com$|^[^.]+\.wikia\.com$/, priority: 4, pathBuilder: (url) => `/${url.hostname.split('.')[0]}${url.pathname}${url.search}` }, anonymousoverflow: { regex: /^(?:www\.)?stackoverflow\.com$|^(?:www\.)?stackexchange\.com$/, pathCheck: /^\/questions/, priority: 4, pathBuilder: (url) => url.pathname + url.search }, bibliogram: { regex: /^(?:www\.)?instagram\.com$/, priority: 6, pathBuilder: (url) => url.pathname + url.search }, wikiless: { regex: /^(?:www\.)?(?:[a-z]{2,3}\.)?wikipedia\.org$/, priority: 5, pathBuilder: (url) => url.pathname + url.search } };

    // === Klasy Główne (bez zmian w logice) ===
    class LoadingPage { static show(targetUrl, instanceUrl, service) { const h = new URL(instanceUrl).hostname, s = service.charAt(0).toUpperCase() + service.slice(1), c = `<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Auto-PROXY-SF - Przekierowanie</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;color:#fff;overflow:hidden}.container{text-align:center;padding:2rem;max-width:600px;animation:fadeIn .5s ease-in}@keyframes fadeIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.logo{font-size:4rem;margin-bottom:1rem;animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}h1{font-size:2.5rem;margin-bottom:.5rem;font-weight:700;text-shadow:2px 2px 4px rgba(0,0,0,.3)}.version{font-size:.9rem;opacity:.7;margin-bottom:1rem}.subtitle{font-size:1.2rem;margin-bottom:2rem;opacity:.9}.loader{width:60px;height:60px;border:5px solid rgba(255,255,255,.3);border-top:5px solid #fff;border-radius:50%;margin:2rem auto;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.status{font-size:1rem;margin-top:2rem;padding:1.5rem;background:rgba(255,255,255,.1);border-radius:10px;backdrop-filter:blur(10px)}.service-info{font-size:1.1rem;font-weight:600;margin-bottom:.5rem;color:#ffd700}.instance-info{margin-top:.5rem;font-size:.9rem;opacity:.8;word-break:break-all}.progress-bar{width:100%;height:4px;background:rgba(255,255,255,.2);border-radius:2px;margin-top:2rem;overflow:hidden}.progress-fill{height:100%;background:#fff;width:0;animation:progress 2.5s ease-in-out}@keyframes progress{0%{width:0}100%{width:100%}}.footer{margin-top:3rem;font-size:.85rem;opacity:.7}.footer a{color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.3);transition:border-color .3s}.footer a:hover{border-bottom-color:#fff}.particles{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1}</style></head><body><div class="container"><div class="logo">🔏</div><h1>Auto-PROXY-SF</h1><p class="version">v${CONFIG.VERSION}</p><p class="subtitle">Trwa przekierowanie do serwisu dbającego o prywatność...</p><div class="loader"></div><div class="status"><p class="service-info">Przekierowanie do instancji ${s}</p><p>Proszę czekać, szukamy dla Ciebie najlepszej instancji.</p><p class="instance-info">Instancja: ${h}</p></div><div class="progress-bar"><div class="progress-fill"></div></div><div class="footer"><a href="https://anonymousik.is-a.dev" target="_blank" rel="noopener">Strona główna</a> | <a href="${targetUrl}" target="_blank" rel="noopener">Oryginalny URL</a></div></div><canvas class="particles"></canvas><script>setTimeout(()=>{window.location.replace('${targetUrl}')},2500);const canvas=document.querySelector('.particles'),ctx=canvas.getContext('2d');canvas.width=window.innerWidth,canvas.height=window.innerHeight;let particles=[],particleCount=100;class Particle{constructor(){this.x=Math.random()*canvas.width,this.y=Math.random()*canvas.height,this.size=Math.random()*2+1,this.speedX=Math.random()*2-1,this.speedY=Math.random()*2-1,this.color="rgba(255, 255, 255, 0.5)"}update(){this.x+=this.speedX,this.y+=this.speedY,this.size>.1&&(this.size-=.01)}draw(){ctx.fillStyle=this.color,ctx.beginPath(),ctx.arc(this.x,this.y,this.size,0,2*Math.PI),ctx.fill()}}function initParticles(){for(let t=0;t<particleCount;t++)particles.push(new Particle)}function animateParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let t=0;t<particles.length;t++)particles[t].update(),particles[t].draw(),particles[t].size<=.1&&(particles.splice(t,1),particles.push(new Particle),t--);requestAnimationFrame(animateParticles)}initParticles(),animateParticles(),window.addEventListener("resize",()=>{canvas.width=window.innerWidth,canvas.height=window.innerHeight,particles=[],initParticles()});<\/script></body></html>`; document.documentElement.innerHTML = c; } }
    class Scraper { constructor() { this.scrapedInstances = {}; } async initialize() { try { const d = JSON.parse(await GMCompat.getValue('scrapedInstances', '{}')); if (d.timestamp && Date.now() - d.timestamp < CONFIG.SCRAPER_UPDATE_INTERVAL) { this.scrapedInstances = d.instances; console.log('[Auto-PROXY-SF] Załadowano instancje z pamięci podręcznej.'); } else if (scriptConfig.get('autoUpdateInstances')) { console.log('[Auto-PROXY-SF] Dane instancji są przestarzałe. Aktualizuję.'); await this.updateAll(); } } catch (e) { console.error('[Auto-PROXY-SF] Błąd inicjalizacji scrapera:', e); if (scriptConfig.get('autoUpdateInstances')) await this.updateAll(); } } async updateAll(force = false) { if (!force) { const l = await GMCompat.getValue('lastScraperUpdate', 0); if (Date.now() - l < CONFIG.SCRAPER_UPDATE_INTERVAL) return; } showNotification('Aktualizacja instancji', 'Pobieranie najnowszych list...'); await Promise.all(Object.keys(INSTANCE_SOURCES).map(s => this.scrapeService(s))); await GMCompat.setValue('scrapedInstances', JSON.stringify({ instances: this.scrapedInstances, timestamp: Date.now() })); await GMCompat.setValue('lastScraperUpdate', Date.now()); showNotification('Aktualizacja zakończona', 'Listy instancji zostały zaktualizowane.'); } async scrapeService(service) { const sources = INSTANCE_SOURCES[service].sort((a, b) => a.priority - b.priority); let inst = new Set(); for (const s of sources) { try { const d = await this.fetchSource(s.url); const p = this['parse' + s.parser.charAt(0).toUpperCase() + s.parser.slice(1)]; if (p) p.call(this, d).forEach(i => inst.add(i)); } catch (e) { console.warn(`[Auto-PROXY-SF] Błąd pobierania źródła ${s.url}:`, e); } } this.scrapedInstances[service] = [...inst]; console.log(`[Auto-PROXY-SF] Zebrano ${this.scrapedInstances[service].length} instancji dla ${service}.`); } fetchSource(url) { return new Promise((resolve, reject) => { GMCompat.xmlHttpRequest({ method: 'GET', url, timeout: CONFIG.SCRAPER_TIMEOUT, onload: r => r.status >= 200 && r.status < 300 ? resolve(r.responseText) : reject(`HTTP Error ${r.status}`), onerror: reject, ontimeout: () => reject('Timeout') }); }); } parseInvidiousAPI(d) { try { return JSON.parse(d).map(i => i[1] && i[1].uri && i[1].type === 'https' && i[1].api !== false ? i[1].uri : null).filter(Boolean); } catch (e) { return []; } } parseNitterJSON(d) { try { const j = JSON.parse(d); let i = []; if (j.hosts) i = j.hosts.map(h => h.url).filter(Boolean); else if (Array.isArray(j)) i = j.filter(u => typeof u === 'string'); return i.map(u => u.replace(/\/$/, '')); } catch (e) { return []; } } parseGenericJSON(d) { try { const j = JSON.parse(d); if (Array.isArray(j)) return j.map(i => (typeof i === 'string' ? i : i.url || i.uri || i.instance) || null).filter(Boolean).map(u => u.replace(/\/$/, '')); if (j.instances) return this.parseGenericJSON(JSON.stringify(j.instances)); return []; } catch (e) { return []; } } parseSearxSpace(d) { try { const j = JSON.parse(d); return Object.entries(j.instances).filter(([, i]) => i.http?.status_code === 200 && i.network_type !== 'tor').map(([u]) => (u.startsWith('http') ? u : `https://${u}`).replace(/\/$/, '')); } catch (e) { return []; } } parseMarkdownTable(d) { const u = new Set(); d.split('\n').forEach(l => { (l.match(/https?:\/\/[^\s)\]|<>"]+/g) || []).forEach(m => u.add(m.replace(/\/$/, ''))); }); return [...u]; } parseMarkdownList(d) { return this.parseMarkdownTable(d); } parseGithubWiki(d) { const u = new Set(); (d.match(/https?:\/\/[^\s<>"'\)]+/g) || []).forEach(m => { const c = m.replace(/[.,;!?]+$/, '').replace(/\/$/, ''); if (c && !/github\.(com|usercontent)/.test(c)) u.add(c); }); return [...u]; } getInstances(s) { return this.scrapedInstances[s] || []; } }
    class HealthMonitor { constructor() { this.healthData = {}; this.checking = new Set(); this.checkQueue = []; this.queueProcessing = false; } async initialize() { try { this.healthData = JSON.parse(await GMCompat.getValue('healthData', '{}')); this.cleanExpiredData(); } catch (e) { this.healthData = {}; } } cleanExpiredData() { const n = Date.now(), t = CONFIG.CACHE_EXPIRY; Object.keys(this.healthData).forEach(u => { if (n - this.healthData[u].lastCheck > t) delete this.healthData[u]; }); } async checkHealth(url) { if (this.checking.has(url)) return; const c = this.healthData[url]; if (c && Date.now() - c.lastCheck < scriptConfig.get('healthCheckInterval') * 60000) return c.healthy; return new Promise(r => { this.checkQueue.push({ url, resolve: r }); this.processQueue(); }); } async processQueue() { if (this.queueProcessing || this.checkQueue.length === 0) return; this.queueProcessing = true; while (this.checkQueue.length > 0) { const batch = this.checkQueue.splice(0, scriptConfig.get('parallelChecks')); await Promise.all(batch.map(i => this.performHealthCheck(i.url).then(i.resolve))); } this.queueProcessing = false; } performHealthCheck(url) { this.checking.add(url); const t = scriptConfig.get('instanceTimeout') * 1000; return new Promise(r => { const s = Date.now(); const fin = (h, l) => { this.checking.delete(url); this.updateHealth(url, h, l); GMCompat.setValue('healthData', JSON.stringify(this.healthData)); r(h); }; const tid = setTimeout(() => fin(false, null), t); GMCompat.xmlHttpRequest({ method: 'HEAD', url, timeout: t, anonymous: true, headers: { 'User-Agent': `Auto-PROXY-SF/${CONFIG.VERSION}` }, onload: res => { clearTimeout(tid); fin(res.status >= 200 && res.status < 400, Date.now() - s); }, onerror: () => { clearTimeout(tid); fin(false, null); }, ontimeout: () => { clearTimeout(tid); fin(false, null); } }); }); } updateHealth(url, h, l) { const d = this.healthData[url] || { healthy: false, lastCheck: 0, failures: 0, successes: 0, latencies: [], avgLatency: 0, reliability: 0 }; d.healthy = h; d.lastCheck = Date.now(); if (h) { d.successes++; d.failures = Math.max(0, d.failures - 1); if (l != null) { d.latencies.push(l); if (d.latencies.length > 10) d.latencies.shift(); d.avgLatency = Math.round(d.latencies.reduce((a, b) => a + b, 0) / d.latencies.length); } } else { d.failures++; } const total = d.successes + d.failures; d.reliability = total > 0 ? (d.successes / total) * 100 : 0; this.healthData[url] = d; } getScore(url) { const d = this.healthData[url]; if (!d?.healthy) return 0; let s = 40 + Math.max(5, 30 - Math.floor((d.avgLatency || 500) / 100) * 3) + (d.reliability >= 90 ? 20 : d.reliability >= 70 ? 15 : d.reliability >= 50 ? 10 : 5) + Math.max(0, 10 - d.failures); return Math.min(100, s); } getBestInstance(inst) { if (!inst?.length) return null; const min = scriptConfig.get('minInstanceScore'); const s = inst.map(u => ({ u, s: this.getScore(u) })).filter(i => i.s >= min).sort((a, b) => b.s - a.s); if (s.length > 0) return s[0].u; return inst[0]; } }
    class InstanceManager { constructor(s) { this.scraper = s; this.healthMonitor = new HealthMonitor(); } async initialize() { await this.healthMonitor.initialize(); } async getInstances(s) { if (scriptConfig.get('network') === 'i2p') return STATIC_INSTANCES.i2p[s] || []; const scr = this.scraper.getInstances(s), sta = STATIC_INSTANCES.clearnet[s] || []; return [...new Set([...scr, ...sta])]; } async getBestInstance(s, r = 0) { const i = await this.getInstances(s); if (i.length === 0) return null; await Promise.all(i.slice(0, scriptConfig.get('parallelChecks') * 2).map(u => this.healthMonitor.checkHealth(u))); const b = this.healthMonitor.getBestInstance(i); if (!b && r < CONFIG.MAX_RETRY_ATTEMPTS) { await new Promise(res => setTimeout(res, CONFIG.EXPONENTIAL_BACKOFF_BASE * 2 ** r)); return this.getBestInstance(s, r + 1); } return b; } }
    class URLProcessor { constructor(m) { this.manager = m; this.processed = new WeakSet(); } detectService(h, p) { const srv = Object.keys(SERVICE_PATTERNS).sort((a, b) => SERVICE_PATTERNS[b].priority - SERVICE_PATTERNS[a].priority); for (const s of srv) { if (!scriptConfig.get(`services.${s}`)) continue; const pat = SERVICE_PATTERNS[s]; if (pat.regex.test(h) && (!pat.pathCheck || pat.pathCheck.test(p))) return s; } return null; } async processURL(origUrl) { try { let url = new URL(origUrl); if (scriptConfig.get('bypassShortlinks') && this.isShortlink(url.hostname)) { const finalUrl = await this.bypassShortlink(url.href); url = new URL(finalUrl); } const service = this.detectService(url.hostname, url.pathname); if (!service) return null; const inst = await this.manager.getBestInstance(service); if (!inst) return null; return inst + SERVICE_PATTERNS[service].pathBuilder(url); } catch (e) { return null; } } isShortlink(h) { if (BYPASS_DOMAINS.has(h)) return true; for (const p of SHORTLINK_PATTERNS) if (p.test(h)) return true; return false; } bypassShortlink(url) { return new Promise(r => { GMCompat.xmlHttpRequest({ method: 'HEAD', url, onload: res => r(res.finalUrl && res.finalUrl !== url ? res.finalUrl : url), onerror: () => r(url), ontimeout: () => r(url) }); }); } rewriteLinks() { const obs = new MutationObserver(m => m.forEach(mu => mu.addedNodes.forEach(n => { if (n.nodeType === 1) { n.querySelectorAll('a[href]').forEach(l => this.processLink(l)); if (n.matches?.('a[href]')) this.processLink(n); } }))); obs.observe(document.documentElement, { childList: true, subtree: true }); document.querySelectorAll('a[href]').forEach(l => this.processLink(l)); } async processLink(l) { if (this.processed.has(l) || !l.href.startsWith('http')) return; this.processed.add(l); const n = await this.processURL(l.href); if (n) l.href = n; } }

    // === Główna klasa Aplikacji ===
    class AutoProxySF {
        constructor() {
            this.scraper = new Scraper();
            this.instanceManager = new InstanceManager(this.scraper);
            this.urlProcessor = new URLProcessor(this.instanceManager);
            this.menuCommands = {};
        }

        async initialize() {
            if (!scriptConfig.get('enabled')) {
                console.log('[Auto-PROXY-SF] Skrypt jest wyłączony w konfiguracji.');
                return;
            }
            console.log(`[Auto-PROXY-SF] Inicjalizacja v${CONFIG.VERSION}`);

            // Inicjalizacja tylko jeśli nie jesteśmy w trybie awaryjnym dla konfiguracji
            if (!scriptConfig.isFallback) {
                await this.scraper.initialize();
                await this.instanceManager.initialize();
            }

            this.setupMenu();

            if (scriptConfig.get('autoRedirect')) {
                this.handlePageRedirect();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
            } else {
                this.onDOMLoaded();
            }
        }

        onDOMLoaded() {
            if (scriptConfig.get('linkRewriting')) {
                this.urlProcessor.rewriteLinks();
            }
        }

        async handlePageRedirect() {
            const newUrl = await this.urlProcessor.processURL(window.location.href);
            if (newUrl) {
                const service = this.urlProcessor.detectService(new URL(window.location.href).hostname, window.location.pathname);
                if (scriptConfig.get('showLoadingPage')) {
                    LoadingPage.show(newUrl, new URL(newUrl).origin, service || 'prywatny');
                } else {
                    window.location.replace(newUrl);
                }
            }
        }

        setupMenu() {
            Object.values(this.menuCommands).forEach(id => { try { if (id) GMCompat.unregisterMenuCommand(id); } catch (e) {} });
            this.menuCommands = {};
            
            // Dodaje polecenie otwarcia konfiguracji tylko jeśli nie jesteśmy w trybie awaryjnym
            if (!scriptConfig.isFallback && MONKEY_CONFIG_LOADED) {
                 this.menuCommands.config = GMCompat.registerMenuCommand('⚙️ Otwórz Konfigurację', () => scriptConfig.open());
            }

            const onOff = (val) => val ? 'WŁ' : 'WYŁ';

            this.menuCommands.forceUpdate = GMCompat.registerMenuCommand('➡️ Wymuś aktualizację list instancji', async () => {
                showNotification('Aktualizacja ręczna', 'Wymuszanie aktualizacji list instancji...');
                await this.scraper.updateAll(true);
            });
            this.menuCommands.clearCache = GMCompat.registerMenuCommand('🗑️ Wyczyść pamięć podręczną stanu', async () => {
                await GMCompat.deleteValue('healthData');
                await this.instanceManager.healthMonitor.initialize();
                showNotification('Wyczyszczono pamięć podręczną', 'Dane o stanie instancji zostały usunięte.');
            });
            
            // Te opcje nie będą działać w trybie awaryjnym, ale zostawiamy je dla spójności
            this.menuCommands.toggleRedirect = GMCompat.registerMenuCommand(`🔄 Przełącz przekierowanie: ${onOff(scriptConfig.get('autoRedirect'))}`, () => {
                if (scriptConfig.isFallback) { alert('Ta opcja jest niedostępna w trybie awaryjnym.'); return; }
                const current = scriptConfig.get('autoRedirect');
                scriptConfig.set('autoRedirect', !current);
                showNotification('Automatyczne przekierowanie', `Przekierowanie jest teraz ${!current ? 'WŁĄCZONE' : 'WYŁĄCZONE'}.`);
                this.setupMenu();
            });
            this.menuCommands.toggleLinks = GMCompat.registerMenuCommand(`🔗 Przełącz przepisywanie linków: ${onOff(scriptConfig.get('linkRewriting'))}`, () => {
                if (scriptConfig.isFallback) { alert('Ta opcja jest niedostępna w trybie awaryjnym.'); return; }
                const current = scriptConfig.get('linkRewriting');
                scriptConfig.set('linkRewriting', !current);
                showNotification('Przepisywanie linków', `Przepisywanie linków jest teraz ${!current ? 'WŁĄCZONE' : 'WYŁĄCZONE'}.`);
                this.setupMenu();
            });
        }
    }

    // === Uruchomienie Skryptu ===
    (async function() {
        // Czekaj na gotowość MonkeyConfig, jeśli istnieje
        if (MONKEY_CONFIG_LOADED && typeof MonkeyConfig.isReady === 'function') {
            await MonkeyConfig.isReady();
        }
        const autoProxy = new AutoProxySF();
        window.autoProxyInstance = autoProxy;
        autoProxy.initialize().catch(err => {
            console.error('[Auto-PROXY-SF] Krytyczny błąd inicjalizacji:', err);
        });
    })();

})();


