// ==UserScript==
// @name         Bing Rewards Auto Searcher (Custom Merge) — Type-Only Submit
// @namespace    brx-custom
// @version      0.2.1
// @description  Script4 flow (scroll), Script2 generator, Script1 random link iframe, Script3 rewards + cooldown, with strict typing-only submission to mimic manual searches (fresh cvid/params) on bing.com.
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @license      MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548004/Bing%20Rewards%20Auto%20Searcher%20%28Custom%20Merge%29%20%E2%80%94%20Type-Only%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/548004/Bing%20Rewards%20Auto%20Searcher%20%28Custom%20Merge%29%20%E2%80%94%20Type-Only%20Submit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // -------- Config (defaults) --------
  const DEFAULTS = {
    autoScroll: true,                  // Auto scroll ON by default
    openRandomLink: true,              // Open random link in iframe ON (desktop only)
    autoCooldown: true,                // Automatic cooldown ON
    cooldownThreshold: 3,              // After N consecutive no-progress events, rest
    cooldownSeconds: 320,              // 5 minutes 20 seconds
    intervalMin: 15,                   // interval min seconds
    intervalMax: 30,                   // interval max seconds
    totalSearches: 25,                 // default total searches per run
    collapsed: true,                   // UI collapsed by default
    jitterSeconds: 2,                  // extra ± jitter on interval
  };

  // Hard caps (safety)
  const HARD_CAP_DESKTOP = 40;
  const HARD_CAP_MOBILE = 30;

  // Device detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobile/i.test(navigator.userAgent);
  const deviceCap = isMobile ? HARD_CAP_MOBILE : HARD_CAP_DESKTOP;

  // Robust selectors for the Bing search input
  const SEARCH_INPUT_SELECTORS = [
    '#sb_form_q',
    '.b_searchbox',
    'input[name="q"]',
    '#searchboxinput',
    'textarea[name="q"]'
  ];

  // Results containers to detect readiness
  const RESULTS_READY_SELECTORS = [
    'ol#b_results', '#b_results', 'main#b_content', '.b_results', 'li.b_algo'
  ];

  // Random link iframe exclusions
  const EXCLUDE_DOMAINS = ["britannica.com", "sunshineseeker.com"];

  // Storage keys
  const KEY_SETTINGS = 'brx_settings';
  const KEY_STATE = 'brx_state';
  const KEY_LOCK = 'brx_active_lock';

  // In-memory state
  let settings = loadSettings();
  let state = loadState();
  let running = false;
  let countdownTimer = null;
  let heartbeatTimer = null;
  let actionTimer = null;
  let instanceId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  // Rewards progress tracking
  const rewards = {
    current: 0,
    total: 0,
    lastChecked: 0,
    completed: false,
    noProgressCount: 0
  };

  // Local run tracking
  const run = {
    done: 0,
    target: capToDevice(settings.totalSearches),
    startedAt: 0
  };

  // Add styles and UI
  addStyles();
  const ui = buildUI();
  renderUI();

  // Start/Stop
  ui.btnStartStop.addEventListener('click', () => {
    if (!running) startRun();
    else stopRun('Stopped by user');
  });

  ui.btnGear.addEventListener('click', () => {
    settings.collapsed = !settings.collapsed;
    saveSettings();
    renderUI();
  });

  // Settings inputs
  ui.chkAutoScroll.addEventListener('change', () => {
    settings.autoScroll = ui.chkAutoScroll.checked;
    saveSettings();
  });
  ui.chkOpenRandom.addEventListener('change', () => {
    settings.openRandomLink = ui.chkOpenRandom.checked;
    saveSettings();
  });
  ui.chkCooldown.addEventListener('change', () => {
    settings.autoCooldown = ui.chkCooldown.checked;
    saveSettings();
  });
  ui.inIntervalMin.addEventListener('change', onIntervalChange);
  ui.inIntervalMax.addEventListener('change', onIntervalChange);
  ui.inTotal.addEventListener('change', () => {
    const v = clampInt(ui.inTotal.value, 1, 100);
    settings.totalSearches = v;
    run.target = capToDevice(v);
    ui.inTotal.value = v;
    saveSettings();
    renderUI();
  });

  updateStatus('Idle. Ready.');

  // ------------- Core flow -------------

  async function startRun() {
    if (!acquireLock()) {
      updateStatus('Another Bing tab is active. Try closing it or wait 20s.');
      return;
    }
    running = true;
    run.done = 0;
    run.target = capToDevice(settings.totalSearches);
    rewards.current = 0;
    rewards.total = 0;
    rewards.lastChecked = 0;
    rewards.completed = false;
    rewards.noProgressCount = 0;
    run.startedAt = Date.now();
    updateStartStop();
    renderUI();
    startHeartbeat();

    await nextCycle();
  }

  function stopRun(reason) {
    running = false;
    clearCountdown();
    clearHeartbeat();
    clearActionTimer();
    releaseLock();
    updateStartStop();
    if (reason) updateStatus(reason);
  }

  async function nextCycle() {
    if (!running) return;

    if (run.done >= run.target) {
      stopRun(`Completed local target ${run.done}/${run.target}.`);
      return;
    }

    const input = await waitForSearchInput(6000);
    if (!input) {
      stopRun('Search box not found. Open a Bing search page/homepage and try again.');
      return;
    }

    const term = GetRandomSearchTerm();

    // STRICT TYPING + ENTER (no form.submit)
    const submitted = await submitSearchByTyping(input, term);
    if (!submitted) {
      await sleep(800);
      const input2 = await waitForSearchInput(2000);
      if (!input2 || !(await submitSearchByTyping(input2, term))) {
        stopRun('Failed to submit search.');
        return;
      }
    }

    await waitForResults(7000);

    if (settings.autoScroll) {
      await autoScrollFor3s();
    }

    if (!isMobile && settings.openRandomLink) {
      await sleep(1000);
      openRandomLinkIframe();
    }

    run.done++;
    renderUI();

    await checkRewardsAndCooldown();

    const waitSec = randomIntervalSeconds();
    await countdown(waitSec, 'Waiting');

    return nextCycle();
  }

  // ------------- Search helpers -------------

  function GetRandomSearchTerm() {
    const topics = [
      // Technology & Computing
      'AI', 'blockchain', 'cloud computing', 'programming', 'cybersecurity', 'software development',
      'web development', 'machine learning', 'data science', 'artificial intelligence', 'robotics',
      'quantum computing', 'internet of things', 'augmented reality', 'virtual reality', 'automation',
      'neural networks', 'deep learning', 'big data', 'database management', 'server administration',
      'network security', 'ethical hacking', 'penetration testing', 'digital forensics', 'cloud services',
      'microservices', 'containerization', 'devops', 'agile methodology', 'version control',
      // Devices & Hardware
      'smartphones', 'tablets', 'laptops', 'desktops', 'PC hardware', 'graphics cards', 'processors',
      'motherboards', 'RAM memory', 'storage drives', 'monitors', 'keyboards', 'gaming mice',
      'headphones', 'speakers', 'smart watches', 'fitness trackers', 'cameras', 'drones',
      'gaming consoles', 'VR headsets', 'smart home devices', 'routers', 'modems', 'printers',
      // Operating Systems & Software
      'linux', 'windows', 'macOS', 'android', 'iOS', 'ubuntu', 'debian', 'fedora', 'arch linux',
      'browsers', 'text editors', 'IDEs', 'password managers', 'antivirus software', 'VPN services',
      'note-taking apps', 'productivity tools', 'office suites', 'image editors', 'video editors',
      'music players', 'media converters', 'backup software', 'file managers', 'system utilities',
      // Creative & Design
      'graphic design', 'web design', 'UI design', 'UX design', 'logo design', 'branding',
      'photography', 'photo editing', 'digital art', 'illustration', 'animation', 'video production',
      'audio editing', 'music production', 'podcast creation', 'content creation', 'social media design',
      'print design', 'typography', 'color theory', 'composition techniques', 'lighting techniques',
      // Entertainment & Media
      'movies', 'TV shows', 'documentaries', 'anime', 'streaming services', 'gaming', 'video games',
      'mobile games', 'board games', 'music', 'podcasts', 'audiobooks', 'ebooks', 'comics',
      'manga', 'YouTube channels', 'Netflix series', 'Spotify playlists', 'gaming reviews',
      'movie reviews', 'entertainment news', 'celebrity news', 'music festivals', 'concerts',
      // Health & Wellness
      'health', 'fitness', 'nutrition', 'diet plans', 'exercise routines', 'mental health',
      'meditation', 'yoga', 'weight loss', 'muscle building', 'cardio workouts', 'strength training',
      'healthy recipes', 'supplements', 'vitamins', 'sleep improvement', 'stress management',
      'mindfulness', 'therapy techniques', 'healthcare', 'medical advice', 'wellness tips',
      // Business & Finance
      'finance', 'investing', 'stock market', 'cryptocurrency', 'trading', 'personal finance',
      'budgeting', 'saving money', 'retirement planning', 'insurance', 'real estate', 'business',
      'entrepreneurship', 'startups', 'marketing', 'digital marketing', 'SEO', 'social media marketing',
      'email marketing', 'content marketing', 'affiliate marketing', 'e-commerce', 'online business',
      // Education & Learning
      'education', 'online courses', 'tutorials', 'skill development', 'language learning',
      'programming languages', 'certifications', 'degree programs', 'study techniques', 'exam preparation',
      'research methods', 'academic writing', 'presentation skills', 'time management', 'productivity',
      'project management', 'leadership skills', 'communication skills', 'problem solving',
      // Science & Nature
      'science', 'physics', 'chemistry', 'biology', 'astronomy', 'space exploration', 'environment',
      'climate change', 'renewable energy', 'sustainability', 'ecology', 'wildlife', 'conservation',
      'scientific discoveries', 'research papers', 'laboratory techniques', 'experiments',
      'nature photography', 'outdoor activities', 'hiking', 'camping', 'gardening',
      // Travel & Lifestyle
      'travel', 'destinations', 'vacation planning', 'budget travel', 'luxury travel', 'backpacking',
      'hotels', 'restaurants', 'food', 'cooking', 'recipes', 'cuisine', 'wine', 'coffee',
      'lifestyle', 'home improvement', 'interior design', 'DIY projects', 'crafts', 'hobbies',
      'fashion', 'beauty', 'skincare', 'makeup', 'hairstyles', 'personal style',
      // Current Events & Society
      'news', 'current events', 'politics', 'world events', 'technology news', 'sports',
      'sports news', 'weather', 'local news', 'breaking news', 'social issues', 'history',
      'geography', 'culture', 'traditions', 'festivals', 'holidays', 'community events',
      'volunteer opportunities', 'charity work', 'social causes'
    ];

    const actions = [
      // [ ... The full expanded actions array as before ... ]
      'learn','study','research','understand','explore','discover','investigate','examine','analyze','review','evaluate','assess','compare','contrast','summarize','explain','clarify','demonstrate','teach','guide',
      'make','create','build','develop','design','construct','craft','generate','produce','manufacture','assemble','compose','write','draw','paint','sketch','illustrate','animate','record','film','photograph',
      'find','search','locate','identify','spot','detect','track','hunt','seek','look for','browse','scout','uncover','reveal','expose',
      'improve','optimize','enhance','upgrade','boost','increase','maximize','refine','polish','perfect','streamline','simplify','automate',
      'accelerate','strengthen','fix','repair','troubleshoot','debug','manage','organize','plan','schedule','arrange','coordinate','control',
      'monitor','track','supervise','oversee','maintain','update','sync','backup','archive','categorize','sort','filter','group',
      'install','setup','configure','customize','adjust','calibrate','initialize','activate','enable','disable','reset','restart',
      'reinstall','uninstall','remove','delete','clean','clear','buy','purchase','get','acquire','obtain','order','shop for',
      'select','choose','pick','decide','recommend','suggest','test','try','experiment','practice','train','exercise','simulate',
      'preview','sample','demo','trial','evaluate','validate','verify','share','post','publish','broadcast','announce','promote',
      'advertise','discuss','talk about','explain','present','showcase','display','download','access','open','load','import','export',
      'transfer','copy','paste','move','save','store','retrieve','fetch'
    ];

    const qualifiers = [
      // [ ... The full expanded qualifiers array as before ... ]
      'latest','newest','recent','updated','current','modern','new',
      '2024','2025','today','this year','upcoming','trending','popular',
      'fresh','cutting-edge','state-of-the-art','next-generation','best','top','premium','professional','high-quality','excellent',
      'superior','advanced','powerful','efficient','optimized','fast','quick','speedy','reliable','stable','secure','safe','trusted',
      'proven','tested','verified','certified','guaranteed','free','cheap','affordable','budget','low-cost','economical','discounted',
      'on sale','value','cost-effective','inexpensive','reasonable','competitive','premium','luxury','high-end','easy','simple','basic',
      'beginner','starter','introductory','novice','elementary','fundamental','advanced','expert','professional','intermediate','complex',
      'detailed','comprehensive','complete','full','thorough','extensive','in-depth','step-by-step','tutorial','guide','manual','handbook',
      'tips','tricks','hacks','secrets','strategies','techniques','methods','approaches','solutions','tools','resources','examples',
      'samples','small','compact','mini','micro','tiny','large','big','huge','massive','giant','full-size','portable','lightweight',
      'heavy-duty','popular','trending','viral','famous','well-known','mainstream','niche','specialized','custom','personalized',
      'tailored','unique','rare','exclusive','limited','special','featured','recommended','useful','practical','functional','versatile',
      'flexible','adaptable','convenient','handy','essential','necessary','important','critical','smart','intelligent','automated',
      'manual','interactive','intuitive','beautiful','attractive','stylish','elegant','sleek','modern','classic','vintage','retro',
      'minimalist','colorful','bright','dark','light','clean','neat','organized','structured'
    ];
    const useQualifier = Math.random() > 0.5;
    const action = pick(actions);
    const topic = pick(topics);
    const qualifier = pick(qualifiers);
    return useQualifier ? `${action} ${qualifier} ${topic}` : `${action} ${topic}`;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  async function submitSearchByTyping(input, term) {
    try {
      input.focus();
      // Clear any existing text via selection + backspace sequence
      selectAll(input);
      await tinyDelay();
      eraseSelection(input);
      await tinyDelay();

      // Type characters one-by-one with small random delays
      for (const ch of term.split('')) {
        typeChar(input, ch);
        await sleep(20 + Math.floor(Math.random()*60)); // ~20–80ms per char
      }

      // Small pause then press Enter
      await sleep(80 + Math.floor(Math.random()*170));
      pressEnter(input);
      return true;
    } catch {
      return false;
    }
  }

  function selectAll(el) {
    el.setSelectionRange(0, el.value.length);
    fireEvent(el, 'select');
  }

  function eraseSelection(el) {
    el.value = '';
    fireEvent(el, 'input');
    fireEvent(el, 'change');
  }

  function typeChar(el, ch) {
    // keydown
    const kd = new KeyboardEvent('keydown', { key: ch, code: keyCodeFromChar(ch), bubbles: true });
    el.dispatchEvent(kd);
    // input
    el.value = el.value + ch;
    const inp = new Event('input', { bubbles: true, cancelable: true });
    el.dispatchEvent(inp);
    // keyup
    const ku = new KeyboardEvent('keyup', { key: ch, code: keyCodeFromChar(ch), bubbles: true });
    el.dispatchEvent(ku);
  }

  function keyCodeFromChar(ch) {
    // Rough mapping for letters/numbers; browsers don’t require exact code here
    if (/^[a-z]$/i.test(ch)) return 'Key' + ch.toUpperCase();
    if (/^\d$/.test(ch)) return 'Digit' + ch;
    if (ch === ' ') return 'Space';
    return 'KeyA';
  }

  function pressEnter(el) {
    const kd = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
    const ku = new KeyboardEvent('keyup',   { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
    el.dispatchEvent(kd);
    el.dispatchEvent(ku);
  }

  function fireEvent(el, type) {
    const ev = new Event(type, { bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
  }

  function waitForSearchInput(ms) {
    const start = Date.now();
    return new Promise(resolve => {
      const tryFind = () => {
        for (const sel of SEARCH_INPUT_SELECTORS) {
          const input = document.querySelector(sel);
          if (input && isVisible(input)) return resolve(input);
        }
        if (Date.now() - start > ms) return resolve(null);
        setTimeout(tryFind, 200);
      };
      tryFind();
    });
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return !!(rect.width || rect.height) && getComputedStyle(el).visibility !== 'hidden';
  }

  function waitForResults(ms) {
    const start = Date.now();
    return new Promise(resolve => {
      const check = () => {
        for (const sel of RESULTS_READY_SELECTORS) {
          const el = document.querySelector(sel);
          if (el) return resolve(true);
        }
        if (Date.now() - start > ms) return resolve(false);
        setTimeout(check, 200);
      };
      check();
    });
  }

  async function autoScrollFor3s() {
    const t0 = Date.now();
    return new Promise(resolve => {
      const iv = setInterval(() => {
        if (!running) {
          clearInterval(iv);
          return resolve();
        }
        const amt = Math.floor(Math.random() * 300) + 100;
        const dir = Math.random() > 0.3 ? 1 : -1;
        window.scrollBy(0, amt * dir);
        if (Date.now() - t0 >= 3000) {
          clearInterval(iv);
          resolve();
        }
      }, 700);
    });
  }

  function openRandomLinkIframe() {
    try {
      let links = document.querySelectorAll('li.b_algo h2 a, .b_algoheader > a');
      if (!links || links.length === 0) return;

      const arr = Array.from(links).filter(a => {
        try {
          const li = a.closest('.b_algo');
          const metaText = li?.querySelector('.b_tpcn div.tpmeta')?.innerText?.toLowerCase() || '';
          const hrefHost = safeHostname(a.href);
          const excludedByMeta = EXCLUDE_DOMAINS.some(d => metaText.includes(d));
          const excludedByHref = EXCLUDE_DOMAINS.some(d => hrefHost.includes(d));
          return !(excludedByMeta || excludedByHref);
        } catch {
          return true;
        }
      });
      if (arr.length === 0) return;
      const randLink = pick(arr);

      const iframe = document.createElement('iframe');
      iframe.name = 'brxRandLinkFrame';
      iframe.style.width = '100%';
      iframe.style.height = '300px';
      iframe.style.border = '0';

      const parent = randLink.parentElement || randLink;
      parent.appendChild(iframe);

      randLink.target = 'brxRandLinkFrame';
      randLink.click();
    } catch {}
  }

  function safeHostname(href) {
    try { return new URL(href).hostname.toLowerCase(); } catch { return ''; }
  }

  // ------------- Rewards + cooldown -------------

  async function checkRewardsAndCooldown() {
    const opened = openRewardsSidebar();
    if (!opened) {
      updateRewardsUIUnavailable();
      return;
    }
    await sleep(1500);

    const parsed = parseRewardsFlyout();
    if (!parsed) {
      updateRewardsUIUnavailable();
      return;
    }

    if (settings.autoCooldown) {
      if (rewards.lastChecked > 0 && rewards.current <= rewards.lastChecked) {
        rewards.noProgressCount++;
      } else if (rewards.current > rewards.lastChecked) {
        rewards.noProgressCount = 0;
      }
      rewards.lastChecked = rewards.current;

      if (rewards.noProgressCount >= settings.cooldownThreshold) {
        rewards.noProgressCount = 0;
        await countdown(settings.cooldownSeconds, 'Resting');
      }
    }
  }

  function openRewardsSidebar() {
    try {
      const btn = document.querySelector('.points-container');
      if (btn) {
        btn.click();
        return true;
      }
    } catch {}
    return false;
  }

  function parseRewardsFlyout() {
    const iframes = document.querySelectorAll('iframe');
    for (const ifr of iframes) {
      let doc;
      try {
        doc = ifr.contentDocument || ifr.contentWindow?.document;
        if (!doc) continue;
      } catch {
        continue;
      }

      const all = doc.querySelectorAll('*');
      for (const el of all) {
        const text = (el.textContent || '').trim();
        if (text.includes('You earned') && text.includes('points already!')) {
          const m = text.match(/You earned\s*(\d+)\s*points already!/);
          if (m) {
            const totalPoints = parseInt(m[1], 10);
            rewards.current = totalPoints;
            rewards.total = totalPoints;
            rewards.completed = true;
            renderUI();
            return true;
          }
        }
      }

      const progEl = doc.querySelector('.daily_search_row span:last-child');
      if (progEl) {
        const progText = progEl.textContent || '';
        const m = progText.match(/(\d+)\s*\/\s*(\d+)/);
        if (m) {
          rewards.current = parseInt(m[1], 10);
          rewards.total = parseInt(m[12], 10);
          rewards.completed = rewards.current >= rewards.total;
          renderUI();
          return true;
        }
      }
    }
    return false;
  }

  function updateRewardsUIUnavailable() {
    renderUI();
  }

  // ------------- UI and helpers -------------

  function addStyles() {
    GM_addStyle(`
      #brx-box {
        position: fixed; top: 12px; right: 12px; z-index: 999999;
        font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        color: #222; background: #fff; border: 1px solid #e5e5e5;
        border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        width: 260px; overflow: hidden;
      }
      #brx-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 6px 8px; background: #f7f7f7; border-bottom: 1px solid #eee;
      }
      #brx-title { font-weight: 600; color: #333; }
      #brx-controls { display: flex; gap: 6px; }
      #brx-start {
        padding: 4px 8px; background: #0078d4; color: #fff; border: 0; border-radius: 4px;
        cursor: pointer; font-weight: 600;
      }
      #brx-start.stopping { background: #d83b01; }
      #brx-gear {
        width: 26px; height: 26px; border-radius: 4px; border: 1px solid #ddd; background: #fff;
        cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
      }
      #brx-body { padding: 8px; }
      #brx-status { color: #444; margin-bottom: 4px; }
      #brx-progress { color: #0078d4; font-weight: 600; margin-bottom: 4px; }
      #brx-countdown { color: #d83b01; font-weight: 600; margin-bottom: 6px; }
      #brx-settings { border-top: 1px solid #eee; margin-top: 8px; padding-top: 8px; }
      #brx-settings .row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px; margin: 4px 0; }
      #brx-settings label { color: #333; }
      #brx-settings input[type="number"] { width: 64px; padding: 2px 3px; }
      #brx-note { color: #666; font-size: 11px; margin-top: 6px; }
    `);
  }

  function buildUI() {
    const box = document.createElement('div');
    box.id = 'brx-box';
    box.innerHTML = `
      <div id="brx-head">
        <div id="brx-title">Rewards Helper</div>
        <div id="brx-controls">
          <button id="brx-start">Start</button>
          <button id="brx-gear" title="Settings">⚙️</button>
        </div>
      </div>
      <div id="brx-body">
        <div id="brx-status">Loading...</div>
        <div id="brx-progress">Local 0/0 | Rewards --/--</div>
        <div id="brx-countdown" style="display:none;"></div>
        <div id="brx-settings">
          <div class="row">
            <label>Auto Scroll (3s)</label>
            <input type="checkbox" id="brx-auto-scroll">
          </div>
          <div class="row">
            <label>Open Random Link (desktop)</label>
            <input type="checkbox" id="brx-open-random">
          </div>
          <div class="row">
            <label>Auto Cooldown</label>
            <input type="checkbox" id="brx-auto-cooldown">
          </div>
          <div class="row">
            <label>Interval Min (s)</label>
            <input type="number" id="brx-int-min" min="1" step="1">
          </div>
          <div class="row">
            <label>Interval Max (s)</label>
            <input type="number" id="brx-int-max" min="1" step="1">
          </div>
          <div class="row">
            <label>Total Searches</label>
            <input type="number" id="brx-total" min="1" step="1">
          </div>
          <div id="brx-note">Desktop cap ${HARD_CAP_DESKTOP}, Mobile cap ${HARD_CAP_MOBILE}. Uses typing-only submission (no URL construction).</div>
        </div>
      </div>
    `;
    document.body.appendChild(box);

    const btnStartStop = box.querySelector('#brx-start');
    const btnGear = box.querySelector('#brx-gear');
    const status = box.querySelector('#brx-status');
    const progress = box.querySelector('#brx-progress');
    const countdown = box.querySelector('#brx-countdown');
    const settingsBox = box.querySelector('#brx-settings');

    const chkAutoScroll = box.querySelector('#brx-auto-scroll');
    const chkOpenRandom = box.querySelector('#brx-open-random');
    const chkCooldown = box.querySelector('#brx-auto-cooldown');
    const inIntervalMin = box.querySelector('#brx-int-min');
    const inIntervalMax = box.querySelector('#brx-int-max');
    const inTotal = box.querySelector('#brx-total');

    chkAutoScroll.checked = settings.autoScroll;
    chkOpenRandom.checked = settings.openRandomLink;
    chkCooldown.checked = settings.autoCooldown;
    inIntervalMin.value = settings.intervalMin;
    inIntervalMax.value = settings.intervalMax;
    inTotal.value = settings.totalSearches;

    settingsBox.style.display = settings.collapsed ? 'none' : 'block';

    return {
      box, btnStartStop, btnGear,
      status, progress, countdown, settingsBox,
      chkAutoScroll, chkOpenRandom, chkCooldown,
      inIntervalMin, inIntervalMax, inTotal
    };
  }

  function renderUI() {
    ui.settingsBox.style.display = settings.collapsed ? 'none' : 'block';
    const rewardsPart = (rewards.total > 0 || rewards.current > 0)
      ? `${rewards.current}/${rewards.total || '--'}`
      : '--/--';
    ui.progress.textContent = `Local ${run.done}/${run.target} | Rewards ${rewardsPart}`;
  }

  function updateStartStop() {
    if (running) {
      ui.btnStartStop.textContent = 'Stop';
      ui.btnStartStop.classList.add('stopping');
    } else {
      ui.btnStartStop.textContent = 'Start';
      ui.btnStartStop.classList.remove('stopping');
    }
  }

  function updateStatus(msg) {
    ui.status.textContent = msg;
  }

  function showCountdown(sec, label) {
    ui.countdown.style.display = sec > 0 ? 'block' : 'none';
    if (sec > 0) ui.countdown.textContent = `${label}: ${sec}s`;
  }

  function clearCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    ui.countdown.style.display = 'none';
  }

  function countdown(seconds, label) {
    return new Promise(resolve => {
      let s = Math.max(1, Math.floor(seconds));
      clearCountdown();
      showCountdown(s, label);
      countdownTimer = setInterval(() => {
        s--;
        if (s <= 0) {
          clearCountdown();
          return resolve();
        }
        showCountdown(s, label);
      }, 1000);
    });
  }

  function onIntervalChange() {
    const min = clampInt(ui.inIntervalMin.value, 1, 300);
    const max = clampInt(ui.inIntervalMax.value, 1, 300);
    const fixed = min > max ? {min: max, max: min} : {min, max};
    settings.intervalMin = fixed.min;
    settings.intervalMax = fixed.max;
    ui.inIntervalMin.value = settings.intervalMin;
    ui.inIntervalMax.value = settings.intervalMax;
    saveSettings();
  }

  function randomIntervalSeconds() {
    const { intervalMin: a, intervalMax: b, jitterSeconds: j } = settings;
    const base = a + Math.random() * Math.max(0, b - a);
    const jitter = (Math.random() * (2*j) - j);
    return Math.max(1, Math.round(base + jitter));
  }

  function clampInt(v, min, max) {
    const n = parseInt(v, 10);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function capToDevice(wanted) {
    return Math.min(wanted, deviceCap);
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function tinyDelay() {
    return sleep(30 + Math.floor(Math.random()*70));
  }

  function clearActionTimer() {
    if (actionTimer) {
      clearTimeout(actionTimer);
      clearInterval(actionTimer);
      actionTimer = null;
    }
  }

  // ------------- Lock (single active tab) -------------

  function acquireLock() {
    const now = Date.now();
    try {
      const raw = GM_getValue(KEY_LOCK, null);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && now - obj.ts < 20000) {
          return false;
        }
      }
    } catch {}
    GM_setValue(KEY_LOCK, JSON.stringify({ id: instanceId, ts: now }));
    return true;
  }

  function refreshLock() {
    GM_setValue(KEY_LOCK, JSON.stringify({ id: instanceId, ts: Date.now() }));
  }

  function releaseLock() {
    try {
      const raw = GM_getValue(KEY_LOCK, null);
      const obj = raw ? JSON.parse(raw) : null;
      if (obj && obj.id === instanceId) {
        GM_setValue(KEY_LOCK, '');
      }
    } catch {}
  }

  function startHeartbeat() {
    clearHeartbeat();
    heartbeatTimer = setInterval(() => {
      if (!running) return;
      refreshLock();
    }, 10000);
  }

  function clearHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  // ------------- Settings/state persistence -------------

  function loadSettings() {
    const raw = GM_getValue(KEY_SETTINGS, null);
    let s = { ...DEFAULTS };
    if (raw) {
      try { s = { ...s, ...JSON.parse(raw) }; } catch {}
    }
    s.intervalMin = clampInt(s.intervalMin, 1, 300);
    s.intervalMax = clampInt(s.intervalMax, 1, 300);
    if (s.intervalMin > s.intervalMax) [s.intervalMin, s.intervalMax] = [s.intervalMax, s.intervalMin];
    s.totalSearches = clampInt(s.totalSearches, 1, 100);
    s.cooldownThreshold = clampInt(s.cooldownThreshold, 1, 10);
    s.cooldownSeconds = clampInt(s.cooldownSeconds, 10, 3600);
    return s;
  }

  function saveSettings() {
    GM_setValue(KEY_SETTINGS, JSON.stringify(settings));
  }

  function todayStr() {
    return new Date().toISOString().slice(0,10);
  }

  function loadState() {
    const raw = GM_getValue(KEY_STATE, null);
    const def = { date: todayStr(), lastRunDone: 0 };
    let st = { ...def };
    if (raw) {
      try { st = { ...st, ...JSON.parse(raw) }; } catch {}
    }
    if (st.date !== todayStr()) {
      st = { ...def };
      GM_setValue(KEY_STATE, JSON.stringify(st));
    }
    return st;
  }

  function saveState() {
    state.date = todayStr();
    state.lastRunDone = run.done;
    GM_setValue(KEY_STATE, JSON.stringify(state));
  }

  window.addEventListener('beforeunload', () => {
    saveState();
    releaseLock();
  });

})();
