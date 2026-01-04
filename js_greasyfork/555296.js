// ==UserScript==
// @name         Walki Gangów Timer + TOP12 AutoClick (stabilna v2.1)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Timer z powiadomieniem i dźwiękiem + automatyczne klikanie TOP12 (tylko raz na jedno odliczanie). Nie klika po ponownym wejściu, jeśli timer nadal trwa.
// @match        https://g2.gangsters.pl/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/555296/Walki%20Gang%C3%B3w%20Timer%20%2B%20TOP12%20AutoClick%20%28stabilna%20v21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555296/Walki%20Gang%C3%B3w%20Timer%20%2B%20TOP12%20AutoClick%20%28stabilna%20v21%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**************************************************************************
   *  USTAWIENIA / STAŁE
   **************************************************************************/
  const STORAGE_KEY = "gangFightTimerEnd";
  const SETTINGS_KEY = "gangFightTimerSettings_v2";
  const CLICK_STATE_KEY = "gangFightClickDone"; // "1" = już kliknięto w tym cyklu
  const MAX_ITEMS = 12;
  const CLICK_DELAY_MS = 50;

  /**************************************************************************
   *  FUNKCJE POMOCNICZE (time parsing/display)
   **************************************************************************/
  function parseTime(str) {
    const parts = str.split(':').map(Number);
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]);
  }
  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  /**************************************************************************
   *  UI - licznik
   **************************************************************************/
  const timerBox = document.createElement("div");
  timerBox.style.position = "fixed";
  timerBox.style.top = "10px";
  timerBox.style.right = "10px";
  timerBox.style.minWidth = "120px";
  timerBox.style.padding = "8px 10px";
  timerBox.style.backgroundColor = "rgba(0,0,0,0.85)";
  timerBox.style.color = "lime";
  timerBox.style.fontWeight = "bold";
  timerBox.style.textAlign = "center";
  timerBox.style.borderRadius = "8px";
  timerBox.style.zIndex = 99999;
  timerBox.style.fontSize = "14px";
  timerBox.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
  timerBox.innerHTML = `<div id="g_timer_text">--:--:--</div>`;
  document.body.appendChild(timerBox);

  const ctrlRow = document.createElement("div");
  ctrlRow.style.marginTop = "6px";
  ctrlRow.style.display = "flex";
  ctrlRow.style.justifyContent = "center";
  ctrlRow.style.gap = "6px";
  timerBox.appendChild(ctrlRow);

  const enableBtn = document.createElement("button");
  enableBtn.textContent = "Włącz powiadomienia";
  enableBtn.style.fontSize = "12px";
  enableBtn.style.cursor = "pointer";
  ctrlRow.appendChild(enableBtn);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.style.fontSize = "12px";
  resetBtn.style.cursor = "pointer";
  ctrlRow.appendChild(resetBtn);

  const statusText = document.createElement("div");
  statusText.style.fontSize = "11px";
  statusText.style.marginTop = "6px";
  statusText.style.color = "#aaa";
  timerBox.appendChild(statusText);

  const style = document.createElement("style");
  style.textContent = `@keyframes gblink { 50% { opacity: 0.3; } }`;
  document.head.appendChild(style);

  /**************************************************************************
   *  POWIADOMIENIA / DŹWIĘK (z oryginalnego v1.9)
   **************************************************************************/
  let settings = { soundEnabled: false, notificationsEnabled: false };
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    if (s) settings = JSON.parse(s);
  } catch (e) {}

  let audioCtx = null;
  let canPlaySound = false;
  if (settings.soundEnabled || settings.notificationsEnabled) {
    enableBtn.textContent = "Uprawnienia aktywne";
    enableBtn.disabled = true;
  }

  function showNotification() {
    try {
      const script = document.createElement("script");
      script.textContent = `
        (function() {
          try {
            if (Notification.permission === "granted") {
              new Notification("💣 Walka gangów", {
                body: "Czas minął!",
                icon: "https://g2.gangsters.pl/images/g2/module/gang/fights/icon.png"
              });
            } else {
              Notification.requestPermission().then(p => {
                if (p === "granted") {
                  new Notification("💣 Walka gangów", {
                    body: "Czas minął!",
                    icon: "https://g2.gangsters.pl/images/g2/module/gang/fights/icon.png"
                  });
                } else {
                  alert("💣 Czas walki minął!");
                }
              });
            }
          } catch (e) {
            alert("💣 Czas walki minął!");
          }
        })();
      `;
      document.documentElement.appendChild(script);
      script.remove();
    } catch (e) {
      alert("💣 Czas walki minął!");
    }
  }

  function initAudioContextIfNeeded() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn("AudioContext error:", e);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(()=>{});
    }
  }
  function playBeep() {
    if (!canPlaySound || !audioCtx) return;
    try {
      const ctx = audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Beep error:", e);
    }
  }

  enableBtn.addEventListener("click", () => {
    Notification.requestPermission().then((perm) => {
      settings.notificationsEnabled = (perm === "granted");
      try {
        initAudioContextIfNeeded();
        if (audioCtx) {
          canPlaySound = true;
          settings.soundEnabled = true;
        }
      } catch (e) {
        console.warn("Nie udało się włączyć audio:", e);
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      enableBtn.textContent = "Uprawnienia aktywne";
      enableBtn.disabled = true;
      statusText.textContent = `Powiad.: ${settings.notificationsEnabled ? "TAK" : "NIE"}, Dźwięk: ${settings.soundEnabled ? "TAK" : "NIE"}`;
    });
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CLICK_STATE_KEY);
    document.getElementById("g_timer_text").textContent = "--:--:--";
    const existingDot = timerBox.querySelector('.g_done_dot');
    if (existingDot) existingDot.remove();
    statusText.textContent = "Zresetowano licznik";
    setTimeout(()=>statusText.textContent="", 2000);
  });

  /**************************************************************************
   *  LICZNIK (logika odliczania)
   **************************************************************************/
  let intervalId = null;
  function clearCountdown() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startCountdownIfValid(endTime) {
    clearCountdown();
    const remaining0 = Math.floor((endTime - Date.now()) / 1000);
    if (remaining0 <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      document.getElementById("g_timer_text").textContent = "--:--:--";
      return;
    }

    let finished = false;
    document.getElementById("g_timer_text").textContent = formatTime(remaining0);
    statusText.textContent = "Licznik aktywny";

    intervalId = setInterval(()=> {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remaining > 0) {
        document.getElementById("g_timer_text").textContent = formatTime(remaining);
      } else if (!finished) {
        finished = true;
        clearCountdown();
        intervalId = null;
        document.getElementById("g_timer_text").textContent = "";
        const dot = document.createElement("div");
        dot.className = "g_done_dot";
        dot.style.width = "18px";
        dot.style.height = "18px";
        dot.style.backgroundColor = "lime";
        dot.style.borderRadius = "50%";
        dot.style.margin = "0 auto";
        dot.style.boxShadow = "0 0 12px 3px lime";
        dot.style.animation = "gblink 1s infinite";
        timerBox.appendChild(dot);

        showNotification();
        if (settings.soundEnabled) {
          try { initAudioContextIfNeeded(); canPlaySound = !!audioCtx; } catch {}
          if (settings.soundEnabled && canPlaySound && audioCtx) playBeep();
        }

        // koniec odliczania — reset flagi auto-kliknięcia
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CLICK_STATE_KEY);
        statusText.textContent = "Koniec!";
        setTimeout(()=>statusText.textContent="", 4000);
      }
    }, 1000);
  }

  // detectAndStoreFromPage: zapisuje STORAGE_KEY TYLKO jeśli nie ma aktywnego timera
  function detectAndStoreFromPage() {
    try {
      if (location.href.includes("module=gang/fights")) {
        const timerEl = document.querySelector("#fightTimer");
        if (timerEl) {
          const fightSeconds = parseTime(timerEl.textContent.trim()) + 1;
          const endTimestamp = Date.now() + fightSeconds * 1000;
          const prev = localStorage.getItem(STORAGE_KEY);
          if (!prev || parseInt(prev,10) <= Date.now()) {
            // zapisujemy tylko gdy nie było aktywnego timera (to traktujemy jako START)
            localStorage.setItem(STORAGE_KEY, String(endTimestamp));
            return endTimestamp; // nowy start
          } else {
            // istnieje aktywny timer -> nie nadpisujemy (nie traktujemy jako nowy start)
            return null;
          }
        }
      }
    } catch (e) { console.warn("detect error", e); }
    return null;
  }

  /**************************************************************************
   *  TOP12: tworzenie obrazków i auto-klik (zabezpieczone)
   **************************************************************************/
  const IMAGE_URLS = Array.from({length: MAX_ITEMS}, (_, i) =>
    `https://raw.githubusercontent.com/mleko95/tamper-images/70738b3522631717874d4184bb12b0212d303224/${i+1}.svg`
  );

  function createRankImage(rank) {
    const wrapper = document.createElement('div');
    wrapper.style.width = '28px';
    wrapper.style.height = '40px';
    wrapper.style.background = '#263238';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.marginBottom = '4px';
    wrapper.style.borderRadius = '4px';
    const img = document.createElement('img');
    img.src = IMAGE_URLS[rank];
    img.dataset.tamperRank = String(rank);
    img.style.width = '28px';
    img.style.height = '40px';
    wrapper.appendChild(img);
    wrapper.className = 'lvl-rank-wrapper';
    return wrapper;
  }

  // mapa rank -> img element (pierwsze wystąpienie tego ranku)
  const rankToImg = new Array(MAX_ITEMS).fill(null);
  let clickedThisTab = false;     // zabezpieczenie wewnątrz jednej zakładki
  let pendingClickBecauseTimerJustStarted = false; // ustawione gdy wykryto START timera i zarezerwowano kliknięcie

  // Funkcja klikająca obrazy w kolejności rank 0..MAX_ITEMS-1
  function clickRankImagesInOrder() {
    if (clickedThisTab) return;
    const imgs = [];
    for (let r=0; r<MAX_ITEMS; r++) {
      const img = rankToImg[r];
      if (img) imgs.push(img);
    }
    if (imgs.length === 0) {
      // nic do kliknięcia teraz
      return;
    }
    clickedThisTab = true;
    imgs.forEach((img, i) => {
      setTimeout(()=> {
        try { img.click(); } catch(e){ console.warn("click error", e); }
      }, i * CLICK_DELAY_MS);
    });
  }

  // jeśli ikony nie są jeszcze w DOM - stwórz observer, który wykona kliknięcie po ich dodaniu
  function ensureClickWhenIconsAppearOnce() {
    // Jeśli już zrobiono klikanie w tej zakładce - nic nie rób
    if (clickedThisTab) return;
    // Jeśli rankToImg ma już elementy - kliknij natychmiast
    if (rankToImg.some(x=>x)) {
      clickRankImagesInOrder();
      return;
    }
    // Stwórz jednorazowego observera
    const obs = new MutationObserver((mutations, o) => {
      if (rankToImg.some(x=>x)) {
        clickRankImagesInOrder();
        o.disconnect();
      }
    });
    obs.observe(document.body, {childList: true, subtree: true});
    // safety timeout: po 8s wyłącz obserwatora (nie chcemy go trzymać na stałe)
    setTimeout(()=>obs.disconnect(), 8000);
  }

  // główna funkcja uruchamiana przy START timera
  function handleTimerStartDetected() {
    // jeśli już kliknięto globalnie - nie rób nic
    if (localStorage.getItem(CLICK_STATE_KEY) === "1") {
      // już zarezerwowane / wykonane gdzie indziej
      return;
    }
    // natychmiast rezerwujemy globalnie (zanim zaczniemy czekać na obrazki)
    try {
      localStorage.setItem(CLICK_STATE_KEY, "1");
    } catch(e) { console.warn("Cannot set click flag", e); }
    pendingClickBecauseTimerJustStarted = true;
    // Spróbuj natychmiast kliknąć; jeśli obrazki jeszcze nie są, observer doda wykonanie
    ensureClickWhenIconsAppearOnce();
  }

  /**************************************************************************
   *  OBSERVER: wstawianie rank-ów nad nickami oraz uzupełnianie rankToImg
   **************************************************************************/
  function computeTopLvlArrayFromUsers(users) {
    const lvls = Array.from(users).map(u => {
      const t = u.querySelector('a > div:nth-child(2)');
      if (!t) return -1;
      const m = t.textContent.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : -1;
    }).filter(x=>x>=0);
    const uniqueSorted = [...new Set(lvls)].sort((a,b)=>b-a).slice(0, MAX_ITEMS);
    return uniqueSorted;
  }

  const domObserver = new MutationObserver((mutations) => {
    const WG = document.getElementById('opponentGangsters');
    if (!WG) return;
    const users = WG.querySelectorAll('div.user');
    if (!users || users.length === 0) return;
    const topLvls = computeTopLvlArrayFromUsers(users);

    users.forEach(user => {
      const divs = user.querySelectorAll('a > div');
      if (divs.length < 2) return;
      const nickDiv = divs[0];
      const lvlDiv = divs[1];
      const match = lvlDiv.textContent.match(/(\d+)\s*lvl/i);
      if (!match) return;
      const lvl = parseInt(match[1], 10);
      const rank = topLvls.indexOf(lvl);
      if (rank === -1) return;

      // jeśli nie ma wrappera z obrazkiem - dodaj
      if (!user.querySelector('.lvl-rank-wrapper')) {
        const rankWrapper = createRankImage(rank);
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        nickDiv.parentElement.insertBefore(wrapper, nickDiv);
        wrapper.appendChild(rankWrapper);
        wrapper.appendChild(nickDiv);
        // zarejestruj img dla danego ranku, jeśli jeszcze nie jest obecne
        const img = rankWrapper.querySelector('img');
        if (img && !rankToImg[rank]) {
          rankToImg[rank] = img;
        }
      } else {
        // jeśli wrapper już był (np. przy kolejnym mutation), upewnij się, że rankToImg ma referencję
        const existingImg = user.querySelector('.lvl-rank-wrapper img');
        if (existingImg) {
          const r = parseInt(existingImg.dataset.tamperRank||'-1', 10);
          if (r>=0 && !rankToImg[r]) rankToImg[r] = existingImg;
        }
      }
    });

    // Jeżeli timer właśnie wystartował i zarezerwowano auto-klik, to kliknij teraz gdy obrazki będą dostępne
    if (pendingClickBecauseTimerJustStarted) {
      pendingClickBecauseTimerJustStarted = false;
      ensureClickWhenIconsAppearOnce();
    }
  });

  // obserwuj całe body; observer dba o to, żeby dopisać ranki gdy lista się pojawi/zmieni
  domObserver.observe(document.body, { childList: true, subtree: true });

  /**************************************************************************
   *  LOGIKA START/LOAD/CHANGE timera — uruchamianie auto-klik tylko przy START
   **************************************************************************/
  // sprawdzamy co było wcześniej (wartość przed uruchomieniem skryptu)
  const prevEndRaw = localStorage.getItem(STORAGE_KEY);
  const prevEnd = prevEndRaw ? parseInt(prevEndRaw, 10) : null;

  // wykrycie, czy to ta zakładka właśnie zaczęła timer (detectAndStoreFromPage zapisuje tylko, gdy nie było aktywnego timera)
  const detectedNewEnd = detectAndStoreFromPage();

  // jeśli wykryliśmy nowy end (czyli to jest NOWY start), uruchamiamy countdown i obsługę startu
  if (detectedNewEnd && detectedNewEnd > Date.now()) {
    // start w tej zakładce
    try { startCountdownIfValid(detectedNewEnd); } catch(e){}
    // to jest moment START -> rezerwuj i kliknij raz
    handleTimerStartDetected();
  } else if (prevEnd && prevEnd > Date.now()) {
    // timer już był aktywny przed załadowaniem skryptu -> ustaw countdown, ale NIE traktujemy tego jako "start" (nie klikamy)
    startCountdownIfValid(prevEnd);
    // w tym przypadku jeśli CLICK_STATE_KEY nie istnieje i timer był startowany w innej zakładce,
    // nie klikamy — tak jak chciałeś: nie klikać przy wejściu w trakcie odliczania.
  } else {
    // brak aktywnego timera
    document.getElementById("g_timer_text").textContent = "--:--:--";
  }

  // reaguj na zmiany w localStorage (np. timer start/stop w innej karcie)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      const oldVal = e.oldValue ? parseInt(e.oldValue,10) : null;
      const newVal = e.newValue ? parseInt(e.newValue,10) : null;
      const now = Date.now();
      // START: nowy end w przyszłości i wcześniej nie było aktywnego timera -> traktujemy jako start
      if (newVal && newVal > now && (!oldVal || oldVal <= now)) {
        // timer wystartował (gdzieś). Uruchom countdown i jednorazowe klikanie
        try { startCountdownIfValid(newVal); } catch(e){}
        handleTimerStartDetected();
      }
      // KONSEKWENCJA: zakończenie timera (np. newVal==null lub newVal<=now) - startCountdownIfValid obsługuje usunięcie flag
      if ((!newVal || newVal <= now) && oldVal && oldVal > now) {
        // timer zakończył się - localStorage powinien zostać usunięty przez skrypt, ale zabezpieczamy
        localStorage.removeItem(CLICK_STATE_KEY);
        clickedThisTab = false;
      }
    }
  });

  // periodic safety check (w razie, gdy storage event nie wystąpi)
  setInterval(() => {
    const endRaw = localStorage.getItem(STORAGE_KEY);
    const end = endRaw ? parseInt(endRaw,10) : null;
    if (end && end > Date.now()) {
      // jeśli timer aktywny, upewnij się, że countdown działa
      if (!intervalId) startCountdownIfValid(end);
    } else {
      // timer nieaktywny
      if (intervalId) { clearCountdown(); }
    }
  }, 5000);

  statusText.textContent = `Powiad.: ${settings.notificationsEnabled ? "TAK" : "NIE"}, Dźwięk: ${settings.soundEnabled ? "TAK" : "NIE"}`;

})();
