// ==UserScript==
// @name         Graffiti 🎨
// @namespace    anon
// @version      3.1
// @description  Premium glassmorphism UI with hard reloads
// @match        https://*.popmundo.com/World/Popmundo.aspx/City/Locales/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562920/Graffiti%20%F0%9F%8E%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562920/Graffiti%20%F0%9F%8E%A8.meta.js
// ==/UserScript==

(function() {
  // === STATE ===
  let timers = [];
  const clearTimers = () => {
    for (const t of timers) clearTimeout(t);
    timers = [];
  };

  const visited = JSON.parse(localStorage.getItem("chk_graffiti_visited") || "[]");
  const localeLinks = [...document.querySelectorAll("a[href*='/Locale/']")].map(a => a.href);
  const unvisited = localeLinks.filter(h => !visited.includes(h));
  let currentIndex = 0;

  // === PREMIUM GLASS UI ===
  const backdrop = document.createElement('div');
  backdrop.style = `
    position: fixed; bottom: 16px; right: 16px;
    width: 260px; z-index: 9999;
  `;
  document.body.appendChild(backdrop);

  const container = document.createElement('div');
  container.style = `
    background: rgba(17, 24, 39, 0.7);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-radius: 18px;
    padding: 16px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 20px 60px -10px rgba(0, 0, 0, 0.5),
      0 10px 40px -10px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
  `;
  backdrop.appendChild(container);

  // Ambient glow effect
  const glow = document.createElement('div');
  glow.style = `
    position: absolute; top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15), transparent 50%);
    pointer-events: none; opacity: 0.6;
  `;
  container.appendChild(glow);

  const innerContent = document.createElement('div');
  innerContent.style = 'position: relative; z-index: 1;';
  container.appendChild(innerContent);

  // Header
  const header = document.createElement('div');
  header.style = `
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  `;
  innerContent.appendChild(header);

  const titleSection = document.createElement('div');
  titleSection.style = 'display: flex; align-items: center; gap: 10px;';
  header.appendChild(titleSection);

  const iconWrapper = document.createElement('div');
  iconWrapper.style = `
    width: 32px; height: 32px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  `;
  iconWrapper.textContent = '🎨';
  titleSection.appendChild(iconWrapper);

  const titleText = document.createElement('div');
  titleText.style = `
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.5px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;
  titleText.textContent = 'Graffiti';
  titleSection.appendChild(titleText);

  const statusDot = document.createElement('div');
  statusDot.style = `
    width: 8px; height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
  header.appendChild(statusDot);

  // Stats Card
  const statsCard = document.createElement('div');
  statsCard.style = `
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 10px;
  `;
  innerContent.appendChild(statsCard);

  const statsRow = document.createElement('div');
  statsRow.style = `
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  `;
  statsCard.appendChild(statsRow);

  const createStat = (label, value) => {
    const stat = document.createElement('div');
    stat.style = 'flex: 1;';

    const statLabel = document.createElement('div');
    statLabel.style = `
      color: rgba(255, 255, 255, 0.5);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
      font-weight: 500;
    `;
    statLabel.textContent = label;
    stat.appendChild(statLabel);

    const statValue = document.createElement('div');
    statValue.style = `
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      font-family: 'SF Mono', Monaco, monospace;
    `;
    statValue.textContent = value;
    stat.appendChild(statValue);

    return { container: stat, valueEl: statValue };
  };

  const scannedStat = createStat('Scanned', '0');
  const remainingStat = createStat('Remaining', unvisited.length);
  statsRow.appendChild(scannedStat.container);
  statsRow.appendChild(remainingStat.container);

  // Status message
  const statusMessage = document.createElement('div');
  statusMessage.style = `
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    line-height: 1.4;
  `;
  statusMessage.textContent = 'Initializing...';
  statsCard.appendChild(statusMessage);

  // Progress section
  const progressSection = document.createElement('div');
  progressSection.style = `
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px;
  `;
  innerContent.appendChild(progressSection);

  const progressHeader = document.createElement('div');
  progressHeader.style = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  `;
  progressSection.appendChild(progressHeader);

  const progressLabel = document.createElement('div');
  progressLabel.style = `
    color: rgba(255, 255, 255, 0.5);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  `;
  progressLabel.textContent = 'Progress';
  progressHeader.appendChild(progressLabel);

  const progressPercent = document.createElement('div');
  progressPercent.style = `
    color: #10b981;
    font-size: 12px;
    font-weight: 700;
    font-family: 'SF Mono', Monaco, monospace;
  `;
  progressPercent.textContent = '0%';
  progressHeader.appendChild(progressPercent);

  const progressTrack = document.createElement('div');
  progressTrack.style = `
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    height: 6px;
    overflow: hidden;
    position: relative;
  `;
  progressSection.appendChild(progressTrack);

  const progressBar = document.createElement('div');
  progressBar.style = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    border-radius: 6px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
    position: relative;
  `;
  progressTrack.appendChild(progressBar);

  const progressShine = document.createElement('div');
  progressShine.style = `
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shine 2s infinite;
  `;
  const shineStyle = document.createElement('style');
  shineStyle.textContent = `
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;
  document.head.appendChild(shineStyle);
  progressBar.appendChild(progressShine);

  const updateUI = (msg, status = 'active', percent = 0) => {
    statusMessage.textContent = msg;
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${Math.round(percent)}%`;
    scannedStat.valueEl.textContent = currentIndex;
    remainingStat.valueEl.textContent = unvisited.length - currentIndex;

    if (status === 'cooldown') {
      statusDot.style.background = '#f59e0b';
      statusDot.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.8)';
      progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
      progressBar.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
      progressPercent.style.color = '#f59e0b';
      glow.style.background = 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.15), transparent 50%)';
    } else if (status === 'error') {
      statusDot.style.background = '#ef4444';
      statusDot.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.8)';
      progressBar.style.background = '#ef4444';
      progressBar.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
      progressPercent.style.color = '#ef4444';
      glow.style.background = 'radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.15), transparent 50%)';
    } else if (status === 'complete') {
      statusDot.style.background = '#8b5cf6';
      statusDot.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.8)';
      progressBar.style.background = 'linear-gradient(90deg, #8b5cf6, #6366f1)';
      progressBar.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
      progressPercent.style.color = '#8b5cf6';
      glow.style.background = 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.15), transparent 50%)';
    } else {
      statusDot.style.background = '#10b981';
      statusDot.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.8)';
      progressBar.style.background = 'linear-gradient(90deg, #10b981, #3b82f6)';
      progressBar.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
      progressPercent.style.color = '#10b981';
      glow.style.background = 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15), transparent 50%)';
    }
  };

  // === COOLDOWN CONTROL ===
  const isLocked = () => sessionStorage.getItem("chk_graffiti_lock") === "1";
  const lock = () => sessionStorage.setItem("chk_graffiti_lock", "1");
  const unlock = () => sessionStorage.removeItem("chk_graffiti_lock");

  const startCooldown = () => {
    clearTimers();
    lock();

    let remaining = 210;
    const tick = () => {
      const mins = Math.floor(remaining/60);
      const secs = remaining%60;
      const percent = ((210-remaining)/210)*100;
      updateUI(`⏱️ Cooldown ${mins}:${secs.toString().padStart(2,'0')}`, 'cooldown', percent);

      if (remaining-- > 0) {
        const t = setTimeout(tick, 1000);
        timers.push(t);
      } else {
        unlock();
        updateUI('Cooldown complete, reloading...', 'active', 100);
        window.location.reload();
      }
    };
    tick();
  };

  // === SPRAY ===
  const useSpraypaint = () => {
    if (isLocked()) {
      updateUI('Cooldown active, waiting...', 'cooldown');
      return;
    }

    updateUI('Opening inventory...', 'active');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `/World/Popmundo.aspx/Character/Items/`;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const t1 = setTimeout(() => {
        const doc = iframe.contentDocument;
        const sprayRow = [...doc.querySelectorAll("tr")]
          .find(r => {
            const hasSpray = r.textContent.includes("Can of spraypaint") || r.textContent.includes("Sprey Boya Kutusu");
            const hasButton = r.querySelector("input[title='Use']") || r.querySelector("input[title='Kullan']");
            return hasSpray && hasButton;
          });

        if (!sprayRow) {
          updateUI('No spraypaint found, skipping', 'error');
          currentIndex++;
          const t = setTimeout(checkNextLocale, 1000);
          timers.push(t);
          return;
        }

        updateUI('Using spraypaint...', 'active');
        const useButton = sprayRow.querySelector("input[title='Use']") || sprayRow.querySelector("input[title='Kullan']");
        useButton.click();

        const startTime = Date.now();
        const maxWait = 15000;
        let handled = false;

        const pollNotification = () => {
          if (handled || isLocked()) return;
          const notif = iframe.contentDocument?.querySelector("#notifications .notification-real");
          const text = notif?.textContent?.trim()?.toLowerCase() || "";

          if (text) {
            handled = true;
            lock();
            clearTimers();

            if (text.includes("fsssssssst!")) {
              updateUI('Spray successful! Reloading...', 'active', 100);
            } else if (text.includes("graffiti painting") && text.includes("more recently")) {
              updateUI('Cooldown triggered, reloading...', 'cooldown');
            } else {
              updateUI('Spray complete, reloading...', 'active');
            }

            setTimeout(() => window.location.reload(), 1500);
            return;
          }

          if (Date.now() - startTime > maxWait) {
            if (!handled && !isLocked()) {
              updateUI('Timeout, reloading...', 'error');
              window.location.reload();
            }
            return;
          }

          const t = setTimeout(pollNotification, 1000);
          timers.push(t);
        };

        const t2 = setTimeout(pollNotification, 2000);
        timers.push(t2);
      }, 2000);
      timers.push(t1);
    };
  };

  // === SCAN ===
  const checkNextLocale = () => {
    if (isLocked()) {
      updateUI('Waiting for cooldown...', 'cooldown');
      return;
    }
    if (currentIndex >= unvisited.length) {
      updateUI('All locales scanned successfully', 'complete', 100);
      return;
    }

    const percent = (currentIndex / unvisited.length) * 100;
    const localeUrl = unvisited[currentIndex];
    updateUI(`Checking locale ${currentIndex+1} of ${unvisited.length}`, 'active', percent);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = localeUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const t = setTimeout(() => {
        try {
          const doc = iframe.contentDocument;
          const graffiti = doc.querySelector("#ctl00_cphLeftColumn_ctl00_divGraffiti");
          if (graffiti) {
            updateUI(`Locale already painted, skipping`, 'active', percent);
            visited.push(localeUrl);
            localStorage.setItem("chk_graffiti_visited", JSON.stringify(visited));
            iframe.remove();
            currentIndex++;
            const nt = setTimeout(checkNextLocale, 1000);
            timers.push(nt);
          } else {
            updateUI(`Moving to locale...`, 'active', percent);
            const id = localeUrl.split("/").pop();
            const moveFrame = document.createElement('iframe');
            moveFrame.style.display = 'none';
            moveFrame.src = `/World/Popmundo.aspx/Locale/MoveToLocale/${id}`;
            document.body.appendChild(moveFrame);

            visited.push(localeUrl);
            localStorage.setItem("chk_graffiti_visited", JSON.stringify(visited));

            const nt = setTimeout(() => useSpraypaint(), 4000);
            timers.push(nt);
          }
        } catch {
          updateUI('Error scanning locale, skipping', 'error', percent);
          iframe.remove();
          currentIndex++;
          const nt = setTimeout(checkNextLocale, 1000);
          timers.push(nt);
        }
      }, 2000);
      timers.push(t);
    };
  };

  // === START ===
  if (isLocked()) {
    updateUI('Resuming cooldown...', 'cooldown');
    startCooldown();
  } else {
    updateUI('Starting scan...', 'active');
    checkNextLocale();
  }
})();