// ==UserScript==
// @name         Bonk.io Win/Loss Tracker (Bonkverse, verified)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Tracks your Bonk.io wins & losses with server-side verified accounts using BonkBot API. Secure sessions, rate limiting, and server-determined usernames only. Auto-cleans session on tab close.
// @author       you
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551009/Bonkio%20WinLoss%20Tracker%20%28Bonkverse%2C%20verified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551009/Bonkio%20WinLoss%20Tracker%20%28Bonkverse%2C%20verified%29.meta.js
// ==/UserScript==

(() => {
  console.log("Loading Bonk.io Win/Loss Tracker (Bonkverse, verified)...");

  // ---------- Config ----------
  const API_BASE = "https://bonkverse.io";
  const API_REQUEST_VERIFICATION = `${API_BASE}/api/request_verification/`;
  const API_COMPLETE_VERIFICATION = `${API_BASE}/api/complete_verification/`;
  const API_WINS = `${API_BASE}/api/wins/`;
  const API_LOSSES = `${API_BASE}/api/losses/`;
  const API_HEARTBEAT = `${API_BASE}/api/heartbeat/`;
  const API_STOP = `${API_BASE}/api/stop_tracking/`;

  // Make sure to update version above as well
  const VERSION = "4.0";

  // ---------- State ----------
  let currentUser = null;
  let winsTotal = 0;
  let lossesTotal = 0;
  let lastWinName = null;
  let lastWinTime = 0;
  let lastLossName = null;
  let lastLossTime = 0;
  let statusMessage = "";
  let sessionToken = null;
  let heartbeatTimer = null;
  let verificationId = null;
  let verificationRoom = null;

  // ---------- Utils ----------
  function getCurrentMap() {
    const el = document.getElementById("newbonklobby_maptext");
    return el ? (el.textContent || "").trim() : null;
  }

  function setStatus(msg, color = "#aaa") {
    statusMessage = `<div style="margin-top:6px; font-size:12px; color:${color};">${msg}</div>`;
    updateUI();
  }

  // ---------- Verification Flow ----------
  function startVerification() {
    setStatus("⏳ Requesting verification room...");
    fetch(API_REQUEST_VERIFICATION, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          verificationId = data.verification_id;
          verificationRoom = data.room_url;
          setStatus(
            `🔗 Join room to verify: <a href="${verificationRoom}" target="_blank" style="color:#6cf">Click here</a>`,
            "#80ff80"
          );
          pollVerification();
        } else {
          setStatus(`❌ Failed: ${data.reason}`, "#ff4d4d");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("❌ Error contacting server.", "#ff4d4d");
      });
  }

  function pollVerification() {
    const start = Date.now();
    const interval = setInterval(() => {
      fetch(API_COMPLETE_VERIFICATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_id: verificationId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            clearInterval(interval);
            currentUser = data.username;
            sessionToken = data.token;
            setStatus(`✅ Verified as ${currentUser}`, "#80ff80");

            document.getElementById("startTrackBtn").style.display = "none";
            document.getElementById("stopTrackBtn").style.display = "inline-block";

            heartbeatTimer = setInterval(() => {
              fetch(API_HEARTBEAT, {
                method: "POST",
                headers: { Authorization: "Bearer " + sessionToken },
              });
            }, 30000);
          } else {
            const reason = (data.reason || "").toLowerCase();
            if (reason.includes("not verified yet")) {
              // still pending
            } else {
              clearInterval(interval);
              setStatus(`❌ Verification failed: ${data.reason}`, "#ff4d4d");
              document.getElementById("stopTrackBtn").style.display = "none";
              document.getElementById("startTrackBtn").style.display = "inline-block";
            }
          }

          if (Date.now() - start > 70000) {
            clearInterval(interval);
            setStatus("❌ Verification timed out", "#ff4d4d");
            document.getElementById("stopTrackBtn").style.display = "none";
            document.getElementById("startTrackBtn").style.display = "inline-block";
          }
        })
        .catch((err) => {
          console.error("pollVerification error:", err);
          clearInterval(interval);
          setStatus("❌ Error contacting server.", "#ff4d4d");
          document.getElementById("stopTrackBtn").style.display = "none";
          document.getElementById("startTrackBtn").style.display = "inline-block";
        });
    }, 3000);
  }

  // ---------- Session Stop ----------
  function stopTracking(sync = false) {
    if (!sessionToken) return;
    if (sync && navigator.sendBeacon) {
      const headers = { type: "application/json" };
      const blob = new Blob([JSON.stringify({})], headers);
      navigator.sendBeacon(API_STOP, blob);
    } else {
      fetch(API_STOP, {
        method: "POST",
        headers: { Authorization: "Bearer " + sessionToken },
      }).finally(() => {
        clearInterval(heartbeatTimer);
        sessionToken = null;
        currentUser = null;
        setStatus("ℹ️ Tracking stopped", "#aaa");
        document.getElementById("stopTrackBtn").style.display = "none";
        document.getElementById("startTrackBtn").style.display = "inline-block";
      });
    }
  }

  // ---------- UI ----------
  function injectUI() {
    if (!document.getElementById("winTrackerBox")) {
      const box = document.createElement("div");
      box.id = "winTrackerBox";
      box.innerHTML = `
        <div id="winTrackerHeader">
          <span id="winTrackerTitle">🏆 Bonkverse Tracker v${VERSION}</span>
          <button id="winTrackerToggle">–</button>
        </div>
        <div id="winTrackerContent"></div>
        <div id="winTrackerControls" style="margin:10px; display:flex; gap:10px; justify-content:center;">
          <button id="startTrackBtn" class="bv-btn bv-btn-start">▶ Verify & Start</button>
          <button id="stopTrackBtn" class="bv-btn bv-btn-stop" style="display:none;">⏹ Stop</button>
        </div>
        <div style="margin-top:8px; font-size:12px; color:#aaa;">
          Check your rank:
          <a href="https://bonkverse.io/leaderboards/wins/today/" target="_blank" style="color:#00e6c3; text-decoration:underline;">
            Bonkverse Wins
          </a> |
          <a href="https://bonkverse.io/leaderboards/losses/today/" target="_blank" style="color:#ff4d4d; text-decoration:underline;">
            Bonkverse Losses
          </a>
        </div>
      `;

      Object.assign(box.style, {
        position: "fixed",
        top: "100px",
        right: "20px",
        background: "rgba(26,39,51,0.9)",
        border: "2px solid #009688",
        boxShadow: "0px 0px 12px rgba(0, 230, 195, 0.6)",
        borderRadius: "10px",
        fontFamily: '"Oxanium", sans-serif',
        color: "#ddd",
        zIndex: "99999",
        minWidth: "240px",
        textAlign: "center",
        userSelect: "none",
      });

      const header = box.querySelector("#winTrackerHeader");
      Object.assign(header.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,150,136,0.2)",
        padding: "6px 10px",
        cursor: "move",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      });

      makeDraggable(box, header);

      const toggleBtn = box.querySelector("#winTrackerToggle");
      Object.assign(toggleBtn.style, {
        background: "none",
        border: "none",
        color: "#ddd",
        fontSize: "16px",
        cursor: "pointer"
      });
      toggleBtn.addEventListener("click", () => {
        const content = box.querySelector("#winTrackerContent");
        const controls = box.querySelector("#winTrackerControls");
        if (content.style.display === "none") {
          content.style.display = "block";
          controls.style.display = "flex";
          toggleBtn.textContent = "–";
        } else {
          content.style.display = "none";
          controls.style.display = "none";
          toggleBtn.textContent = "+";
        }
      });

      document.body.appendChild(box);

      document.getElementById("startTrackBtn").onclick = startVerification;
      document.getElementById("stopTrackBtn").onclick = () => stopTracking(false);
    }
  }

  function makeDraggable(el, handle) {
    let offsetX = 0, offsetY = 0, dragging = false;
    handle.onmousedown = (e) => {
      dragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.onmousemove = (e) => {
        if (dragging) {
          el.style.left = e.clientX - offsetX + "px";
          el.style.top = e.clientY - offsetY + "px";
          el.style.right = "auto";
        }
      };
      document.onmouseup = () => {
        dragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  function updateUI() {
    injectUI();
    const content = document.querySelector("#winTrackerContent");
    if (content) {
      if (currentUser) {
        const mapName = getCurrentMap() || "Unknown";
        content.innerHTML = `
          <div style="margin:8px 0;">👤 <span style="color:#6cf">${currentUser}</span></div>
          <div>🏆 Wins this session: <span style="color:#00ffcc">${winsTotal}</span></div>
          <div>💀 Losses this session: <span style="color:#ff4d4d">${lossesTotal}</span></div>
          <div>🗺 Map: <span style="color:#ffcc00">${mapName}</span></div>
          ${statusMessage}
        `;
      } else {
        content.innerHTML = `<div style="color:#ff4d4d">❌ Not verified</div>${statusMessage}`;
      }
    }
  }

  // ---------- API send ----------
  function sendWinToServer(username) {
    if (!sessionToken) return;
    const mapName = getCurrentMap();
    const now = Date.now();
    if (now - lastWinTime < 5000) return;
    lastWinTime = now;

    fetch(API_WINS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionToken,
      },
      body: JSON.stringify({ username, ts: now, map_name: mapName || "Unknown" }),
    });
  }

  function sendLossToServer(username) {
    if (!sessionToken) return;
    const mapName = getCurrentMap();
    const now = Date.now();
    if (now - lastLossTime < 5000) return;
    lastLossTime = now;

    fetch(API_LOSSES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionToken,
      },
      body: JSON.stringify({ username, ts: now, map_name: mapName || "Unknown" }),
    });
  }

  // ---------- Detect win/loss ----------
  function updateResult() {
    const topEl = document.getElementById("ingamewinner_top");
    if (!topEl) return;
    const winnerName = (topEl.textContent || "").trim();
    if (!currentUser || !winnerName) return;

      const teamNames = ["red team", "blue team", "yellow team", "green team"];

    if (winnerName === currentUser && lastWinName !== winnerName) {
      winsTotal++;
      lastWinName = winnerName;
      console.log(`Win detected for ${winnerName} → total=${winsTotal}`);
      updateUI();
      sendWinToServer(currentUser);
    } 
    else if (winnerName !== currentUser && lastLossName !== winnerName) {
      // 🛑 Skip team-based wins
      const lower = winnerName.toLowerCase();
      if (teamNames.includes(lower)) {
        console.log(`Ignoring team result: ${winnerName}`);
        return;
      }

      lossesTotal++;
      lastLossName = winnerName;
      console.log(`Loss detected for ${currentUser} → total=${lossesTotal}`);
      updateUI();
      sendLossToServer(currentUser);
    }

  }

  // ---------- Winner observer ----------
  function hookWinnerObserver() {
    const target = document.getElementById("ingamewinner");
    if (!target) {
      setTimeout(hookWinnerObserver, 1000);
      return;
    }
    const observer = new MutationObserver(() => {
      const visible = target.style.visibility !== "hidden";
      if (visible) updateResult();
      else {
        lastWinName = null;
        lastLossName = null;
      }
    });
    observer.observe(target, { attributes: true, attributeFilter: ["style"], subtree: true });
    console.log("Win/Loss Tracker: observer attached to #ingamewinner");
  }

  // ---------- Inject CSS ----------
  const style = document.createElement("style");
  style.textContent = `
    .bv-btn {
      padding: 8px 14px;
      border-radius: 10px;
      font-family: "Oxanium", sans-serif;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: border-color .15s ease, transform .05s ease, box-shadow .2s ease;
      border: 1px solid rgba(0, 230, 195, .35);
      background: linear-gradient(180deg, rgba(0,150,136,.25), rgba(0,150,136,.15));
      color: #fff;
      text-shadow: 0 0 4px rgba(0,0,0,0.6);
    }
    .bv-btn:hover {
      border-color: rgba(0,230,195,.75);
      box-shadow: 0 0 8px rgba(0,230,195,.6);
    }
    .bv-btn:active {
      transform: translateY(1px) scale(.97);
    }
    .bv-btn-start {
      background: linear-gradient(180deg, rgba(40,167,69,.4), rgba(40,167,69,.2));
      border-color: rgba(40,167,69,.55);
    }
    .bv-btn-start:hover {
      border-color: rgba(40,167,69,.9);
      box-shadow: 0 0 10px rgba(40,167,69,.7);
    }
    .bv-btn-stop {
      background: linear-gradient(180deg, rgba(220,53,69,.4), rgba(220,53,69,.2));
      border-color: rgba(220,53,69,.55);
    }
    .bv-btn-stop:hover {
      border-color: rgba(220,53,69,.9);
      box-shadow: 0 0 10px rgba(220,53,69,.7);
    }
  `;
  document.head.appendChild(style);

  // ---------- Init ----------
  hookWinnerObserver();
  setInterval(updateUI, 2000);
  window.addEventListener("beforeunload", () => stopTracking(true));
})();
