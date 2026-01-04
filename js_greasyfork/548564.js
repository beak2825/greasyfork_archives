// ==UserScript==
// @name         Travel Airways Log Bot (GeoFS)
// @namespace    https://airtravel.neocities.org/flightlogger
// @version      1.2.2
// @description  Logs flights with crash detection, auto ICAO detection, session recovery & terrain-based AGL check for Travel Airways
// @match        http://*/geofs.php*
// @match        https://*/geofs.php*
// @author       31124呀
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548564/Travel%20Airways%20Log%20Bot%20%28GeoFS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548564/Travel%20Airways%20Log%20Bot%20%28GeoFS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WEBHOOK_URL = "https://discord.com/api/webhooks/1411315862048084020/Kr-E6vo1tGucV3JFlLoMPE-atz0btZUtIfWTWQ6sqqrxKQ7MPY4chpsWhvqmz3FtY_Cx";
  const STORAGE_KEY = "geofs_flight_logger_session";

  const SALARY_CONFIG = {
    baseRate: 800, // 基础时薪（元/小时）
    nightBonus: 1.2, // 夜间飞行加成
    internationalBonus: 1.5, // 国际航班加成
    butterBonus: 200, // 完美着陆奖金
    hardPenalty: -100, // 硬着陆罚款
    crashPenalty: -500000, // 坠机罚款
    minFlightTime: 0, // 最小计费时间（小时）
    nightHours: [22, 6] // 夜间时间段 [开始小时, 结束小时]
  };

  let flightStarted = false;
  let flightStartTime = null;
  let departureICAO = "UNKNOWN";
  let arrivalICAO = "UNKNOWN";
  let hasLanded = false;
  let monitorInterval = null;
  let firstGroundContact = false;
  let firstGroundTime = null;
  let panelUI, startButton, callsignInput;
  let airportsDB = [];
  let departureAirportData = null;
  let arrivalAirportData = null;
  let isPanelVisible = true;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

fetch("https://raw.githubusercontent.com/mwgg/Airports/master/airports.json")
  .then(r => r.json())
  .then(data => {
    airportsDB = Object.entries(data).map(([icao, info]) => ({
      icao,
      lat: info.lat,
      lon: info.lon,
      tz: info.tz || null,
      name: info.name || "",
      city: info.city || "",
      country: info.country || ""
    }));
    console.log(`✅ Loaded ${airportsDB.length} airports`);
  })
  .catch(err => console.error("❌ Airport DB load failed:", err));

  function getNearestAirport(lat, lon) {
    if (!airportsDB.length) return { icao: "UNKNOWN" };
    let nearest = null, minDist = Infinity;
    for (const ap of airportsDB) {
      const dLat = (ap.lat - lat) * Math.PI / 180;
      const dLon = (ap.lon - lon) * Math.PI / 180;
      const a = Math.sin(dLat/2) ** 2 +
        Math.cos(lat * Math.PI/180) * Math.cos(ap.lat * Math.PI/180) *
        Math.sin(dLon/2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = 6371 * c;
      if (dist < minDist) {
        minDist = dist;
        nearest = ap;
      }
    }
    if (nearest && minDist > 30) return null;
    return nearest || null;
  }

  function saveSession() {
    const session = {
      flightStarted,
      flightStartTime,
      departureICAO,
      callsign: callsignInput?.value.trim() || "Unknown",
      firstGroundContact,
      departureAirportData,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function promptForAirportICAO(type, lat, lon) {
    const locationStr = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    const icao = prompt(`❓ ${type} airport not found in database.\nLocation: ${locationStr}\n\nPlease enter the ICAO code manually (or leave empty for UNKNOWN):`);
    return icao ? icao.toUpperCase().trim() : "UNKNOWN";
  }

  function getAircraftName() {
    let raw = geofs?.aircraft?.instance?.aircraftRecord?.name || "Unknown";
    return raw.replace(/^\([^)]*\)\s*/, ""); // 去掉 (作者名) 部分
  }

  function formatTimeWithTimezone(timestamp, airportData) {
    let timeZone = 'UTC';
    let suffix = 'UTC';

    if (airportData && airportData.tz) {
      timeZone = airportData.tz;
      const date = new Date(timestamp);
      const timezoneName = date.toLocaleDateString('en', {
        timeZone: timeZone,
        timeZoneName: 'short'
      }).split(', ')[1] || timeZone.split('/')[1] || 'LT';
      suffix = timezoneName;
    }

    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: timeZone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${fmt.format(new Date(timestamp))} ${suffix}`;
  }

  function calculateSalary(flightData) {
    const flightHours = flightData.durationHours;
    const landingQuality = flightData.landingQuality;
    const takeoffTime = new Date(flightData.takeoff);
    const landingTime = new Date(flightData.landing);

    let baseSalary = Math.max(flightHours * SALARY_CONFIG.baseRate,
                             SALARY_CONFIG.minFlightTime * SALARY_CONFIG.baseRate);

    const takeoffHour = takeoffTime.getHours();
    const landingHour = landingTime.getHours();
    const isNightFlight = takeoffHour >= SALARY_CONFIG.nightHours[0] ||
                         takeoffHour < SALARY_CONFIG.nightHours[1] ||
                         landingHour >= SALARY_CONFIG.nightHours[0] ||
                         landingHour < SALARY_CONFIG.nightHours[1];

    if (isNightFlight) {
      baseSalary *= SALARY_CONFIG.nightBonus;
    }

    const isInternational = (departureAirportData && arrivalAirportData &&
                           departureAirportData.country !== arrivalAirportData.country);

    if (isInternational) {
      baseSalary *= SALARY_CONFIG.internationalBonus;
    }

    let landingBonus = 0;
    switch(landingQuality) {
      case "BUTTER":
        landingBonus = SALARY_CONFIG.butterBonus;
        break;
      case "HARD":
        landingBonus = SALARY_CONFIG.hardPenalty;
        break;
      case "CRASH":
        landingBonus = SALARY_CONFIG.crashPenalty;
        break;
    }

    const totalSalary = Math.max(0, baseSalary + landingBonus);

    return {
      base: Math.round(baseSalary),
      bonus: landingBonus,
      total: Math.round(totalSalary),
      isNight: isNightFlight,
      isInternational: isInternational,
      currency: "CNY"
    };
  }

  function sendLogToDiscord(data, salaryData) {
    const takeoffTime = formatTimeWithTimezone(data.takeoff, departureAirportData);
    const landingTime = formatTimeWithTimezone(data.landing, arrivalAirportData);

    let embedColor;
    switch(data.landingQuality) {
      case "BUTTER": embedColor = 0x00FF00; break;
      case "HARD": embedColor = 0xFF8000; break;
      case "CRASH": embedColor = 0xFF0000; break;
      default: embedColor = 0x0099FF; break;
    }

    // 构建工资信息字符串，包含奖金信息
    let salaryValue = `**Total**: ${salaryData.total} CNY`;
    if (salaryData.bonus !== 0) {
      salaryValue += `\n**Bonus**: ${salaryData.bonus > 0 ? '+' : ''}${salaryData.bonus} CNY`;
    }

    const message = {
      embeds: [{
        title: "🛫 Flight Report - GeoFS",
        color: embedColor,
        fields: [
          {
            name: "✈️ Flight Information",
            value: `**Flight no.**: ${data.pilot}\n**Pilot name**: ${geofs?.userRecord?.callsign || "Unknown"}\n**Aircraft**: ${data.aircraft}`,
            inline: false
          },
          {
            name: "📍 Route",
            value: `**Departure**: ${data.dep}\n**Arrival**: ${data.arr}`,
            inline: true
          },
          {
            name: "⏱️ Duration",
            value: `**Flight Time**: ${data.duration}`,
            inline: true
          },
          {
            name: "📊 Flight Data",
            value: `**V/S**: ${data.vs} fpm\n**G-Force**: ${data.gforce}\n**TAS**: ${data.ktrue} kts\n**GS**: ${data.gs} kts`,
            inline: true
          },
          {
            name: "🏁 Landing Quality",
            value: `**${data.landingQuality}**`,
            inline: true
          },
          {
            name: "💰 Salary",
            value: salaryValue,
            inline: true
          },
          {
            name: "🕓 Times",
            value: `**Takeoff**: ${takeoffTime}\n**Landing**: ${landingTime}`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "GeoFS Flight Logger"
        }
      }]
    };

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    }).then(() => console.log("✅ Flight log sent"))
      .catch(console.error);
  }

  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      zIndex: '10001',
      minWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease-in-out',
      textAlign: 'center'
    });

    switch(type) {
      case 'crash':
        toast.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        break;
      case 'success':
        toast.style.background = 'linear-gradient(135deg, #00C851, #007E33)';
        break;
      case 'warning':
        toast.style.background = 'linear-gradient(135deg, #ffbb33, #FF8800)';
        break;
      case 'salary':
        toast.style.background = 'linear-gradient(135deg, #33b5e5, #0099CC)';
        break;
      default:
        toast.style.background = 'linear-gradient(135deg, #2E86C1, #1B4F72)';
    }

    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
      }, 300);
    }, duration);
  }

  function monitorFlight() {
    if (!geofs?.animation?.values || !geofs.aircraft?.instance) return;
    const values = geofs.animation.values;
    const onGround = values.groundContact;
    const altitudeFt = values.altitude * 3.28084;
    const terrainFt = geofs.api?.map?.getTerrainAltitude?.() * 3.28084 || 0;
    const agl = altitudeFt - terrainFt;
    const [lat, lon] = geofs.aircraft.instance.llaLocation || [values.latitude, values.longitude];
    const now = Date.now();

    if (!flightStarted && !onGround && agl > 100) {
      flightStarted = true;
      flightStartTime = now;
      const nearestAirport = getNearestAirport(lat, lon);
      if (nearestAirport) {
        departureICAO = nearestAirport.icao;
        departureAirportData = nearestAirport;
      } else {
        departureICAO = promptForAirportICAO("Departure", lat, lon);
        departureAirportData = null;
      }
      saveSession();
      console.log(`🛫 Departure detected at ${departureICAO}`);
      showToast("🛫 起飞检测成功<br>开始记录飞行数据", 'success');
      if (panelUI) {
        panelUI.style.opacity = "0";
        setTimeout(() => panelUI.style.display = "none", 500);
      }
    }

    const elapsed = (now - flightStartTime) / 1000;
    if (flightStarted && !firstGroundContact && onGround) {
      if (elapsed < 1) return;
      const vs = values.verticalSpeed;

      if (vs <= -800) {
        showToast("💥 坠机检测<br>记录事故报告...", 'crash', 4000);
        const nearestAirport = getNearestAirport(lat, lon);
        if (nearestAirport) {
          arrivalICAO = "Crash";
          arrivalAirportData = nearestAirport;
        } else {
          arrivalICAO = "Crash";
          arrivalAirportData = null;
        }
      } else {
        const nearestAirport = getNearestAirport(lat, lon);
        if (nearestAirport) {
          arrivalICAO = nearestAirport.icao;
          arrivalAirportData = nearestAirport;
        } else {
          arrivalICAO = promptForAirportICAO("Arrival", lat, lon);
          arrivalAirportData = null;
        }
      }

      console.log(`🛬 Arrival detected at ${arrivalICAO}`);
      firstGroundContact = true;
      firstGroundTime = now;

      const g = (values.accZ / 9.80665).toFixed(2);
      const gs = values.groundSpeedKnt.toFixed(1);
      const tas = geofs.aircraft.instance.trueAirSpeed?.toFixed(1) || "N/A";
      const quality = (vs > -60) ? "BUTTER" : (vs > -800) ? "HARD" : "CRASH";
      const baseCallsign = callsignInput.value.trim() || "Unknown";
      const pilot = baseCallsign.toUpperCase().startsWith("TRA") ?
        baseCallsign : `TRA${baseCallsign}`;
      const aircraft = getAircraftName();
      const durationMin = Math.round((firstGroundTime - flightStartTime) / 60000);
      const durationHours = durationMin / 60;

      const hours = Math.floor(durationMin / 60);
      const minutes = durationMin % 60;
      const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      const flightDataForSalary = {
        durationHours: durationHours,
        landingQuality: quality,
        takeoff: flightStartTime,
        landing: firstGroundTime
      };

      const salaryData = calculateSalary(flightDataForSalary);

      sendLogToDiscord({
        pilot, aircraft,
        takeoff: flightStartTime,
        landing: firstGroundTime,
        dep: departureICAO,
        arr: arrivalICAO,
        duration: formattedDuration,
        durationHours: durationHours,
        vs: vs.toFixed(1),
        gforce: g,
        gs: gs,
        ktrue: tas,
        landingQuality: quality
      }, salaryData);

      let salaryMessage = `💰 工资结算: ${salaryData.total} CNY`;
      if (salaryData.bonus > 0) {
        salaryMessage += `<br>🎉 奖金: +${salaryData.bonus} CNY`;
      } else if (salaryData.bonus < 0) {
        salaryMessage += `<br>⚠️ 罚款: ${salaryData.bonus} CNY`;
      }

      if (salaryData.isNight) salaryMessage += "<br>🌙 包含夜间飞行加成";
      if (salaryData.isInternational) salaryMessage += "<br>🌍 包含国际航班加成";

      showToast(salaryMessage, 'salary', 5000);

      saveSession();
      clearSession();
      resetPanel();

      if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
      }
    }
  }

  function resetPanel() {
    flightStarted = false;
    hasLanded = false;
    firstGroundContact = false;
    flightStartTime = null;
    departureICAO = "UNKNOWN";
    arrivalICAO = "UNKNOWN";
    departureAirportData = null;
    arrivalAirportData = null;
    callsignInput.value = "";
    startButton.disabled = true;
    startButton.innerText = "📋 开始飞行记录";
    if (panelUI) {
      panelUI.style.display = "block";
      panelUI.style.opacity = "0.8";
    }
  }

  function disableKeyPropagation(input) {
    ["keydown", "keyup", "keypress"].forEach(ev =>
      input.addEventListener(ev, e => e.stopPropagation())
    );
  }

  function togglePanelVisibility() {
    isPanelVisible = !isPanelVisible;
    if (panelUI) {
      if (isPanelVisible) {
        panelUI.style.display = "block";
        setTimeout(() => {
          panelUI.style.opacity = "0.8";
        }, 10);
      } else {
        panelUI.style.opacity = "0";
        setTimeout(() => {
          panelUI.style.display = "none";
        }, 500);
      }
    }
  }

  function createSidePanel() {
    panelUI = document.createElement("div");
    Object.assign(panelUI.style, {
      position: "fixed",
      top: "80px",
      left: "20px",
      background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
      color: "white",
      padding: "15px",
      border: "2px solid #00C8FF",
      zIndex: "10000",
      width: "280px",
      fontSize: "14px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      transition: "all 0.3s ease",
      display: "block",
      opacity: "0.8",
      cursor: "move",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(10px)"
    });

    const titleBar = document.createElement("div");
    titleBar.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <span style="font-size: 18px; font-weight: bold; color: #00C8FF;">✈️ Travel Airways</span>
        </div>
        <div style="font-size: 12px; color: #888;">按 W 显示/隐藏</div>
      </div>
    `;
    titleBar.style.padding = "10px 15px";
    titleBar.style.margin = "-15px -15px 15px -15px";
    titleBar.style.background = "linear-gradient(135deg, #2d2d2d, #1a1a1a)";
    titleBar.style.cursor = "move";
    titleBar.style.borderRadius = "10px 10px 0 0";
    titleBar.style.userSelect = "none";
    titleBar.style.borderBottom = "2px solid #00C8FF";
    panelUI.appendChild(titleBar);

    const airlineLabel = document.createElement("div");
    airlineLabel.textContent = "航空公司: Travel Airways (TRA)";
    airlineLabel.style.marginBottom = "15px";
    airlineLabel.style.fontSize = "12px";
    airlineLabel.style.color = "#00C8FF";
    airlineLabel.style.textAlign = "center";
    airlineLabel.style.padding = "8px";
    airlineLabel.style.background = "rgba(0, 200, 255, 0.1)";
    airlineLabel.style.borderRadius = "6px";
    airlineLabel.style.border = "1px solid rgba(0, 200, 255, 0.3)";
    panelUI.appendChild(airlineLabel);

    const inputContainer = document.createElement("div");
    inputContainer.style.marginBottom = "15px";

    const inputLabel = document.createElement("div");
    inputLabel.textContent = "航班号 (数字部分):";
    inputLabel.style.marginBottom = "5px";
    inputLabel.style.color = "#00C8FF";
    inputLabel.style.fontSize = "12px";
    inputContainer.appendChild(inputLabel);

    callsignInput = document.createElement("input");
    callsignInput.placeholder = "例如: 123 → TRA123";
    callsignInput.style.width = "100%";
    callsignInput.style.padding = "10px";
    callsignInput.style.border = "1px solid #444";
    callsignInput.style.borderRadius = "6px";
    callsignInput.style.background = "rgba(255, 255, 255, 0.1)";
    callsignInput.style.color = "white";
    callsignInput.style.outline = "none";
    callsignInput.style.transition = "all 0.3s ease";
    callsignInput.addEventListener("focus", () => {
      callsignInput.style.borderColor = "#00C8FF";
      callsignInput.style.background = "rgba(255, 255, 255, 0.15)";
    });
    callsignInput.addEventListener("blur", () => {
      callsignInput.style.borderColor = "#444";
      callsignInput.style.background = "rgba(255, 255, 255, 0.1)";
    });
    disableKeyPropagation(callsignInput);
    callsignInput.onkeyup = () => {
      startButton.disabled = callsignInput.value.trim() === "";
      startButton.style.background = callsignInput.value.trim() === ""
        ? "linear-gradient(135deg, #666, #555)"
        : "linear-gradient(135deg, #00C851, #007E33)";
    };
    inputContainer.appendChild(callsignInput);
    panelUI.appendChild(inputContainer);

    startButton = document.createElement("button");
    startButton.innerText = "📋 开始飞行记录";
    startButton.disabled = true;
    Object.assign(startButton.style, {
      width: "100%",
      padding: "12px",
      background: "linear-gradient(135deg, #666, #555)",
      color: "white",
      border: "none",
      cursor: "pointer",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      marginBottom: "10px"
    });

    startButton.addEventListener("mouseover", function() {
      if (!this.disabled) {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 4px 12px rgba(0, 200, 133, 0.3)";
      }
    });

    startButton.addEventListener("mouseout", function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });

    startButton.onclick = () => {
      showToast("✅ 飞行记录已启动<br>准备起飞...", 'success');
      monitorInterval = setInterval(monitorFlight, 1000);
      startButton.innerText = "🟢 记录中...";
      startButton.disabled = true;
      startButton.style.background = "linear-gradient(135deg, #007E33, #005a25)";
    };

    panelUI.appendChild(startButton);

    const salaryInfo = document.createElement("div");
    salaryInfo.innerHTML = `
      <div style="background: rgba(0, 200, 255, 0.05); padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 200, 255, 0.2);">
        <div style="color: #00C8FF; font-size: 12px; margin-bottom: 5px;">💰 工资标准:</div>
        <div style="font-size: 11px; color: #aaa; line-height: 1.4;">
          • 基础: ${SALARY_CONFIG.baseRate} CNY/小时<br>
          • 夜间: ×${SALARY_CONFIG.nightBonus}<br>
          • 国际: ×${SALARY_CONFIG.internationalBonus}<br>
          • 完美着陆: +${SALARY_CONFIG.butterBonus} CNY
        </div>
      </div>
    `;
    panelUI.appendChild(salaryInfo);

    document.body.appendChild(panelUI);

    titleBar.addEventListener('mousedown', function(e) {
      isDragging = true;
      dragOffsetX = e.clientX - panelUI.getBoundingClientRect().left;
      dragOffsetY = e.clientY - panelUI.getBoundingClientRect().top;
      panelUI.style.cursor = "grabbing";
      panelUI.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4)";
    });

    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;

        const maxX = window.innerWidth - panelUI.offsetWidth;
        const maxY = window.innerHeight - panelUI.offsetHeight;

        panelUI.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        panelUI.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
      panelUI.style.cursor = "move";
      panelUI.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
    });
  }

  window.addEventListener("load", () => {
    console.log("✅ Travel Airways Flight Logger Loaded");
    createSidePanel();

    document.addEventListener('keydown', function(e) {
      if (e.key.toLowerCase() === 'w' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        togglePanelVisibility();
      }
    });
  });
})();
