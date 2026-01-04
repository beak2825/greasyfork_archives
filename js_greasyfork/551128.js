// ==UserScript==
// @name         Better Diep.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @homepage     https://github.com/x032205/diep_mod_menu
// @description  Cool UI (glaze), loop upgrade custom builds, render aim line, render factory guide circle and more.
// @author       @totallyjake / https://github.com/x032205
// @match        https://*.diep.io/*
// @resource     achievementSound https://cdn.uppbeat.io/audio-files/06ae18f31ba6d2a5dd6b6f941ae28d0a/5f195808a28ba022742372b56cfb888f/d5d7fc707f2eb7dd4e5b031ec0d4b2a5/STREAMING-ui-negative-whoosh-ding-jam-fx-1-00-04.mp3
// @resource     killsound https://cdn.uppbeat.io/audio-files/550fafd5d5403a2f6e11b6feefd0899e/acf6fcc54f1fc19647c6d2b81d0ae2b1/835ef3ed8a8ed41607b6805fa49fc47c/STREAMING-whoosh-clean-fast-bosnow-3-3-00-00.mp3
// @license      MIT
// @grant        GM_getResourceURL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @downloadURL https://update.greasyfork.org/scripts/551128/Better%20Diepio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/551128/Better%20Diepio%20Mod%20Menu.meta.js
// ==/UserScript==

const presets = [
  {
    "name": "Armor (penta, rocketeer, trappers) [ 0 / 6 / 6 / 0 / 7 / 7 / 7 / 0 ]",
    "build": "567567567567567567567232323232323"
  },
  {
    "name": "Balanced (overlord, fighter) [ 3 / 3 / 3 / 5 / 5 / 5 / 5 / 4 ]",
    "build": "567445674567456745671238123812388"
  },
  {
    "name": "Balanced Factory [ 2 / 3 / 0 / 5 / 6 / 7 / 6 / 4 ]",
    "build": "567456747654765476547566888821212"
  },
  {
    "name": "Bullet Umbrella (triangles) [ 0 / 1 / 2 / 2 / 7 / 7 / 7 / 7 ]",
    "build": "567445675675675675675678888888233"
  },
  {
    "name": "Hurricane (octo tank) [ 0 / 5 / 0 / 0 / 7 / 7 / 7 / 7 ]",
    "build": "256782567856728567856782567825678"
  },
  {
    "name": "Glass Cannon V1 (spread, factory, etc.) [ 0 / 0 / 0 / 5 / 7 / 7 / 7 / 7 ]",
    "build": "444445678567856785678567856785678"
  },
  {
    "name": "Glass Cannon V2 (spread, penta, etc.) [ 0 / 0 / 0 / 7 / 7 / 7 / 7 / 5 ]",
    "build": "444445678567856785678567856745674"
  },
  {
    "name": "Balanced Smasher (spike, landmine) [ 6 / 5 / 10 / 10 ]",
    "build": "11231113123233888883838"
  },
  {
    "name": "Full Ram Smasher (spike, landmine) [ 3 / 10 / 10 / 10 ]",
    "build": "123123123232388888238238"
  },
  {
    "name": "Rammer (triangles & annihilator) [ 5 / 7 / 7 / 0 / 0 / 0 / 7 / 7 ]",
    "build": "123123123123123888882382387777777"
  },
  {
    "name": "The 1M Overlord [ 2 / 3 / 0 / 7 / 7 / 7 / 0 / 7 ]",
    "build": "564456456456456888456456888822112"
  }
];

const UI_AUDIOS = [];

const achievementAudio = new Audio(GM_getResourceURL('achievementSound'));
UI_AUDIOS.push(achievementAudio);

const killaudio = new Audio(GM_getResourceURL('killsound'));
UI_AUDIOS.push(killaudio);

function updateUIAudioVolume() {
    const enabled = document.body.classList.contains("audio_switch-mode");
    UI_AUDIOS.forEach(audio => {
        audio.volume = enabled ? 0.65 : 0;
    });
}

function playUIAudio(audio) {
    const enabled = document.body.classList.contains("audio_switch-mode");
    if (!enabled) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
}

if (localStorage.getItem("mm_audio_switch_toggle") === "true") {
  document.body.classList.add("audio_switch-mode");
}

updateUIAudioVolume();

const savedWaveToggle = localStorage.getItem("mm_wave_switch_toggle");
if (savedWaveToggle === "true") {
  document.body.classList.add("wave-switch-mode");
} else {
  document.body.classList.remove("wave-switch-mode");
}


if (localStorage.getItem("mm_cool_switch_toggle") === "true") {
  document.body.classList.add("color-switch-mode");
}

if (localStorage.getItem("mm_UI_switch_toggle") === "true") {
  document.body.classList.add("UI-switch-mode");
}

let toggleKey = localStorage.getItem("mm_toggle_key") || "r";


(function () {
  "use strict";


  const backdrop = document.createElement("div");
  backdrop.id = "backdrop";

  const toggle_text = document.createElement("code");
  toggle_text.classList.add("watermark");
  toggle_text.textContent = "Better Diep.io Mod Menu | Ver: 0.9.2"

  backdrop.appendChild(toggle_text);

  const panel = document.createElement("div");
  panel.id = "panel";

  const side_panel = document.createElement("nav");
  panel.appendChild(side_panel);

  const separator = document.createElement("div");
  separator.classList.add("separator");
  panel.appendChild(separator);

  const display_panel = document.createElement("div");
  display_panel.classList.add("inner_panel");
  panel.appendChild(display_panel);

  const panelWidth = 650;
  const panelHeight = 450;

  document.body.appendChild(backdrop);
  backdrop.appendChild(panel);



  // Auto Respawn
  const auto_respawn = document.createElement("div");
  auto_respawn.classList.add("view-option");

  const auto_respawn_text = document.createElement("span");
  auto_respawn_text.textContent = "Auto respawn";

  const auto_respawn_label = document.createElement("label");
  auto_respawn_label.classList.add("switch");

  const auto_respawn_toggle = document.createElement("input");
  auto_respawn_toggle.setAttribute("type", "checkbox");
  auto_respawn_label.appendChild(auto_respawn_toggle);

  const auto_respawn_div = document.createElement("div");
  auto_respawn_label.appendChild(auto_respawn_div);

  auto_respawn.appendChild(auto_respawn_label);
  auto_respawn.appendChild(auto_respawn_text);

  // auto respawn input name box thing bro idk
  const respawn_name_input = document.createElement("input");
  respawn_name_input.type = "text";
  respawn_name_input.placeholder = "Name goes here.";
  respawn_name_input.style.marginLeft = "8px";
  respawn_name_input.style.width = "150px";
  respawn_name_input.maxLength = 15;
  respawn_name_input.classList.add("custom-input");
  respawn_name_input.value = localStorage.getItem("mm_respawn_name") || "";

  respawn_name_input.addEventListener("input", () =>
    localStorage.setItem("mm_respawn_name", respawn_name_input.value)
  );
  auto_respawn.appendChild(respawn_name_input);



  // Aim Line
  const view_line = document.createElement("div");
  view_line.classList.add("view-option");

  const view_line_text = document.createElement("span");
  view_line_text.textContent = "Aim line";

  const view_line_label = document.createElement("label");
  view_line_label.classList.add("switch");

  const view_line_toggle = document.createElement("input");
  view_line_toggle.setAttribute("type", "checkbox");
  view_line_label.appendChild(view_line_toggle);

  const view_line_div = document.createElement("div");
  view_line_label.appendChild(view_line_div);
  view_line.appendChild(view_line_label);
  view_line.appendChild(view_line_text);

  // Factory Circle
  const view_circle = document.createElement("div");
  view_circle.classList.add("view-option");

  const view_circle_text = document.createElement("span");
  view_circle_text.textContent = "Factory circle";

  const view_circle_label = document.createElement("label");
  view_circle_label.classList.add("switch");

  const view_circle_toggle = document.createElement("input");
  view_circle_toggle.setAttribute("type", "checkbox");
  view_circle_label.appendChild(view_circle_toggle);

  const view_circle_div = document.createElement("div");
  view_circle_label.appendChild(view_circle_div);
  view_circle.appendChild(view_circle_label);
  view_circle.appendChild(view_circle_text);

  // Render Collisions
  const render_collisions = document.createElement("div");
  render_collisions.classList.add("view-option");

  const render_collisions_text = document.createElement("span");
  render_collisions_text.textContent = "Render collisions";

  const render_collisions_label = document.createElement("label");
  render_collisions_label.classList.add("switch");

  const render_collisions_toggle = document.createElement("input");
  render_collisions_toggle.setAttribute("type", "checkbox");
  render_collisions_label.appendChild(render_collisions_toggle);

  const render_collisions_div = document.createElement("div");
  render_collisions_label.appendChild(render_collisions_div);
  render_collisions.appendChild(render_collisions_label);
  render_collisions.appendChild(render_collisions_text);

  render_collisions_toggle.addEventListener("change", function () {
    if (render_collisions_toggle.checked) {
      input.execute("ren_debug_collisions true");
    } else {
      input.execute("ren_debug_collisions false");
    }
    localStorage.setItem(
      "mm_render_collisions",
      render_collisions_toggle.checked,
    );
  });

  // Render Dark Mode
  const render_dm = document.createElement("div");
  render_dm.classList.add("view-option");

  const render_dm_text = document.createElement("span");
  render_dm_text.textContent = "Render dark mode";

  const render_dm_label = document.createElement("label");
  render_dm_label.classList.add("switch");

  const render_dm_toggle = document.createElement("input");
  render_dm_toggle.setAttribute("type", "checkbox");
  render_dm_label.appendChild(render_dm_toggle);

  const render_dm_div = document.createElement("div");
  render_dm_label.appendChild(render_dm_div);
  render_dm.appendChild(render_dm_label);
  render_dm.appendChild(render_dm_text);

  render_dm_toggle.addEventListener("change", function () {
    if (render_dm_toggle.checked) {
      input.execute("ren_dark_mode true");
    } else {
      input.execute("ren_dark_mode false");
    }
    localStorage.setItem("mm_render_dm", render_dm_toggle.checked);
  });

  // Render Ping
  const render_ping = document.createElement("div");
  render_ping.classList.add("view-option");

  const render_ping_text = document.createElement("span");
  render_ping_text.textContent = "Render ping";

  const render_ping_label = document.createElement("label");
  render_ping_label.classList.add("switch");

  const render_ping_toggle = document.createElement("input");
  render_ping_toggle.setAttribute("type", "checkbox");
  render_ping_label.appendChild(render_ping_toggle);

  const render_ping_div = document.createElement("div");
  render_ping_label.appendChild(render_ping_div);
  render_ping.appendChild(render_ping_label);
  render_ping.appendChild(render_ping_text);

  render_ping_toggle.addEventListener("change", function () {
    if (render_ping_toggle.checked) {
      input.execute("ren_latency true");
    } else {
      input.execute("ren_latency false");
    }
    localStorage.setItem(
      "mm_ren_latency", render_ping_toggle.checked,
    );
  });

  // Render FPS
  const render_fps = document.createElement("div");
  render_fps.classList.add("view-option");

  const render_fps_text = document.createElement("span");
  render_fps_text.textContent = "Render FPS & latency";

  const render_fps_label = document.createElement("label");
  render_fps_label.classList.add("switch");

  const render_fps_toggle = document.createElement("input");
  render_fps_toggle.setAttribute("type", "checkbox");
  render_fps_label.appendChild(render_fps_toggle);

  const render_fps_div = document.createElement("div");
  render_fps_label.appendChild(render_fps_div);
  render_fps.appendChild(render_fps_label);
  render_fps.appendChild(render_fps_text);

  render_fps_toggle.addEventListener("change", function () {
    if (render_fps_toggle.checked) {
      input.execute("ren_fps true");
    } else {
      input.execute("ren_fps false");
    }
    localStorage.setItem("mm_render_fps", render_fps_toggle.checked);
  });

  // Render Raw Health Values
  const render_rhw = document.createElement("div");
  render_rhw.classList.add("view-option");

  const render_rhw_text = document.createElement("span");
  render_rhw_text.textContent = "Render raw health values";

  const render_rhw_label = document.createElement("label");
  render_rhw_label.classList.add("switch");

  const render_rhw_toggle = document.createElement("input");
  render_rhw_toggle.setAttribute("type", "checkbox");
  render_rhw_label.appendChild(render_rhw_toggle);

  const render_rhw_div = document.createElement("div");
  render_rhw_label.appendChild(render_rhw_div);
  render_rhw.appendChild(render_rhw_label);
  render_rhw.appendChild(render_rhw_text);

  render_rhw_toggle.addEventListener("change", function () {
    if (render_rhw_toggle.checked) {
      input.execute("ren_raw_health_values true");
    } else {
      input.execute("ren_raw_health_values false");
    }
    localStorage.setItem("mm_render_raw_health", render_rhw_toggle.checked);
  });

  // Movement Prediction
  const predict_movement = document.createElement("div");
  predict_movement.classList.add("view-option");

  const predict_movement_text = document.createElement("span");
  predict_movement_text.textContent = "Enable movement prediction";

  const predict_movement_label = document.createElement("label");
  predict_movement_label.classList.add("switch");

  const predict_movement_toggle = document.createElement("input");
  predict_movement_toggle.setAttribute("type", "checkbox");
  predict_movement_label.appendChild(predict_movement_toggle);

  const predict_movement_div = document.createElement("div");
  predict_movement_label.appendChild(predict_movement_div);
  predict_movement.appendChild(predict_movement_label);
  predict_movement.appendChild(predict_movement_text);

  predict_movement_toggle.addEventListener("change", function () {
    if (predict_movement_toggle.checked) {
      input.execute("net_predict_movement true");
    } else {
      input.execute("net_predict_movement false");
    }
    localStorage.setItem(
      "mm_predict_movement",
      predict_movement_toggle.checked,
    );
  });

  // Render Timer
  const timer = document.createElement("div");
  timer.classList.add("view-option");

  const timer_text = document.createElement("span");
  timer_text.textContent = "Render timer";

  const timer_label = document.createElement("label");
  timer_label.classList.add("switch");

  const timer_toggle = document.createElement("input");
  timer_toggle.setAttribute("type", "checkbox");
  timer_label.appendChild(timer_toggle);

  const timer_div = document.createElement("div");
  timer_label.appendChild(timer_div);
  timer.appendChild(timer_label);
  timer.appendChild(timer_text);

  // Hide UI
  const hide_ui = document.createElement("div");
  hide_ui.classList.add("view-option");

  const hide_ui_text = document.createElement("span");
  hide_ui_text.textContent = "Hide game UI";

  const hide_ui_label = document.createElement("label");
  hide_ui_label.classList.add("switch");

  const hide_ui_toggle = document.createElement("input");
  hide_ui_toggle.setAttribute("type", "checkbox");
  hide_ui_label.appendChild(hide_ui_toggle);

  const hide_ui_div = document.createElement("div");
  hide_ui_label.appendChild(hide_ui_div);
  hide_ui.appendChild(hide_ui_label);
  hide_ui.appendChild(hide_ui_text);

  hide_ui_toggle.addEventListener("change", function () {
    if (hide_ui_toggle.checked) {
      input.execute("ren_ui false");
    } else {
      input.execute("ren_ui true");
    }
    localStorage.setItem("mm_hide_ui", hide_ui_toggle.checked);
  });

    // Render Debug Info
  const render_dbi = document.createElement("div");
  render_dbi.classList.add("view-option");

  const render_dbi_text = document.createElement("span");
  render_dbi_text.textContent = "Render debug info";

  const render_dbi_label = document.createElement("label");
  render_dbi_label.classList.add("switch");

  const render_dbi_toggle = document.createElement("input");
  render_dbi_toggle.setAttribute("type", "checkbox");
  render_dbi_label.appendChild(render_dbi_toggle);

  const render_dbi_div = document.createElement("div");
  render_dbi_label.appendChild(render_dbi_div);
  render_dbi.appendChild(render_dbi_label);
  render_dbi.appendChild(render_dbi_text);

  render_dbi_toggle.addEventListener("change", function () {
    if (render_dbi_toggle.checked) {
      input.execute("ren_debug_info true");
    } else {
      input.execute("ren_debug_info false ");
    }
    localStorage.setItem("mm_render_debug_info", render_dbi_toggle.checked);
  });

  // Render Kill Counter
  const render_kc = document.createElement("div");
  render_kc.classList.add("view-option");

  const render_kc_text = document.createElement("span");
  render_kc_text.textContent = "Render kill counter";

  const render_kc_label = document.createElement("label");
  render_kc_label.classList.add("switch");

  const render_kc_toggle = document.createElement("input");
  render_kc_toggle.setAttribute("type", "checkbox");
  render_kc_label.appendChild(render_kc_toggle);

  const render_kc_div = document.createElement("div");
  render_kc_label.appendChild(render_kc_div);
  render_kc.appendChild(render_kc_label);
  render_kc.appendChild(render_kc_text);

  // Load saved state
  const saved = localStorage.getItem("mm_render_kill_counter") === "true";
  render_kc_toggle.checked = saved;
  if (!saved && document.getElementById("v")) {
    document.getElementById("mm_render_kill_counter").style.display = "none";
  }

  render_kc_toggle.addEventListener("change", function () {
    const kc = document.getElementById("mm_render_kill_counter");
    if (!kc) return;

    if (render_kc_toggle.checked) {
      kc.style.display = "flex";
    } else {
      kc.style.display = "none";
    }

    localStorage.setItem("mm_render_kill_counter", render_kc_toggle.checked);
  });

  // Visual Tab
  const visual_tab = document.createElement("buttons");
  visual_tab.classList.add("tab_button", "active");
  side_panel.appendChild(visual_tab);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "#BBBBBB");
  svg.setAttribute("stroke-width", "2.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  svg.innerHTML =
    '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>';

  visual_tab.appendChild(svg);

  visual_tab.onclick = function () {

   display_panel.innerHTML = `<span><span class="text-muted">|</span>
   <span><span class="text-bold">Visuals</span><br><br>
   `;
    display_panel.appendChild(view_line);
    display_panel.appendChild(auto_respawn);
    display_panel.appendChild(predict_movement);
    display_panel.appendChild(view_circle);
    display_panel.appendChild(hide_ui);
    display_panel.appendChild(render_collisions);
    display_panel.appendChild(render_dm);
    display_panel.appendChild(render_dbi);
    display_panel.appendChild(render_fps);
    display_panel.appendChild(render_kc);
    display_panel.appendChild(render_ping);
    display_panel.appendChild(render_rhw);
    display_panel.appendChild(timer);
    setActiveTab(visual_tab);
  };

  const au_label = document.createElement("span");

  const au_autoset = document.createElement("div");
  au_autoset.classList.add("view-option");

  const au_autoset_text = document.createElement("span");
  au_autoset_text.textContent = "Keep build preset on respawn";

  const au_autoset_label = document.createElement("label");
  au_autoset_label.classList.add("switch");

    const au_input = document.createElement("input");
  au_input.ariaReadOnly = "true";
  au_input.style.width = "250px";
  au_input.setAttribute("type", "number");
  au_input.classList.add("custom-input");
  au_input.placeholder = "000000000000000000000000000000000";
  au_input.value = localStorage.getItem("diepModMenuBuild") || "";

  au_input.addEventListener("input", function () {
    if (au_input.value.length > 33) {
      au_input.value = au_input.value.slice(0, 33);
    }
    localStorage.setItem("diepModMenuBuild", au_input.value);
  });

  const au_autoset_toggle = document.createElement("input");
  au_autoset_toggle.setAttribute("type", "checkbox");
  au_autoset_label.appendChild(au_autoset_toggle);

  const au_autoset_div = document.createElement("div");
  au_autoset_label.appendChild(au_autoset_div);
  au_autoset.appendChild(au_autoset_label);
  au_autoset.appendChild(au_autoset_text);

  au_autoset_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_keep_build_on_spawn", au_autoset_toggle.checked);
  });

  // Presets
  const au_presets_label = document.createElement("span");
  au_presets_label.classList.add("subheading");
  au_presets_label.textContent = "Presets";

  const preset_panel = document.createElement("div");
  preset_panel.classList.add("preset-panel");

  presets.forEach((preset) => {
    const presetButtons = document.createElement("presetbuttons");
    presetButtons.textContent = preset.name;
    presetButtons.classList.add("presetbuttons");
    presetButtons.onclick = function () {
      au_input.value = preset.build;
      localStorage.setItem("diepModMenuBuild", preset.build);
      input.execute("game_stats_build " + preset.build);
    };
    preset_panel.appendChild(presetButtons);
  });

  // Auto Upgrade Tab
  const auto_upgrades_tab = document.createElement("buttons");
  auto_upgrades_tab.classList.add("tab_button");
  side_panel.appendChild(auto_upgrades_tab);

  const au_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  au_svg.setAttribute("width", "32");
  au_svg.setAttribute("height", "32");
  au_svg.setAttribute("viewBox", "0 0 24 24");
  au_svg.setAttribute("fill", "none");
  au_svg.setAttribute("stroke", "#BBBBBB");
  au_svg.setAttribute("stroke-width", "2.5");
  au_svg.setAttribute("stroke-linecap", "round");
  au_svg.setAttribute("stroke-linejoin", "round");

  au_svg.innerHTML =
    '<path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/>';

  auto_upgrades_tab.appendChild(au_svg);

  auto_upgrades_tab.onclick = function () {
      display_panel.innerHTML = `<span><span class="text-muted">|</span>
   <span><span class="text-bold">Custom build / Auto upgrade</span><br><br>
   `;
    display_panel.appendChild(au_label);
    display_panel.appendChild(au_input);
    display_panel.appendChild(au_autoset);
    display_panel.appendChild(au_presets_label);
    display_panel.appendChild(preset_panel);
    setActiveTab(auto_upgrades_tab);
  };

  //Settings tab
  const settings_tab = document.createElement("buttons");
  settings_tab.classList.add("tab_button");
  side_panel.appendChild(settings_tab);

  const settings_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  settings_svg.setAttribute("width", "32");
  settings_svg.setAttribute("height", "32");
  settings_svg.setAttribute("viewBox", "0 0 24 24");
  settings_svg.setAttribute("fill", "#bbbbbb");
  settings_svg.setAttribute("stroke", "#bbbbbb");
  settings_svg.setAttribute("stroke-width", "0.1");
  settings_svg.setAttribute("stroke-linecap", "round");
  settings_svg.setAttribute("stroke-linejoin", "round");

  settings_svg.innerHTML =
    '<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Settings"> <rect id="Rectangle" fill-rule="nonzero" x="0" y="0" width="24" height="24"> </rect> <circle id="Oval" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" cx="12" cy="12" r="3"> </circle> <path d="M10.069,3.36281 C10.7151,1.54573 13.2849,1.54573 13.931,3.3628 C14.338,4.5071 15.6451,5.04852 16.742,4.52713 C18.4837,3.69918 20.3008,5.51625 19.4729,7.25803 C18.9515,8.35491 19.4929,9.66203 20.6372,10.069 C22.4543,10.7151 22.4543,13.2849 20.6372,13.931 C19.4929,14.338 18.9515,15.6451 19.4729,16.742 C20.3008,18.4837 18.4837,20.3008 16.742,19.4729 C15.6451,18.9515 14.338,19.4929 13.931,20.6372 C13.2849,22.4543 10.7151,22.4543 10.069,20.6372 C9.66203,19.4929 8.35491,18.9515 7.25803,19.4729 C5.51625,20.3008 3.69918,18.4837 4.52713,16.742 C5.04852,15.6451 4.5071,14.338 3.3628,13.931 C1.54573,13.2849 1.54573,10.7151 3.36281,10.069 C4.5071,9.66203 5.04852,8.35491 4.52713,7.25803 C3.69918,5.51625 5.51625,3.69918 7.25803,4.52713 C8.35491,5.04852 9.66203,4.5071 10.069,3.36281 Z" id="Path" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round"> </path> </g> </g> </g></svg>/>';

  settings_tab.appendChild(settings_svg);

  settings_tab.onclick = function () {
    display_panel.innerHTML = `<span><span class="text-muted">|</span>
   <span><span class="text-bold">Settings</span><br><br>
   `;

  const cool_switch = document.createElement("div");
  cool_switch.classList.add("view-option");

  const cool_switch_text = document.createElement("span");
  cool_switch_text.textContent = "Monochrome switch color theme";


  const cool_switch_label = document.createElement("label");
  cool_switch_label.classList.add("switch");

  const cool_switch_toggle = document.createElement("input");
  cool_switch_toggle.setAttribute("type", "checkbox");
  cool_switch_label.appendChild(cool_switch_toggle);

  const cool_switch_div = document.createElement("div");
  cool_switch_label.appendChild(cool_switch_div);
  cool_switch.appendChild(cool_switch_label);
  cool_switch.appendChild(cool_switch_text);


if (localStorage.getItem("mm_cool_switch_toggle") === "true") {
  cool_switch_toggle.checked = true;
  document.body.classList.add("color-switch-mode");
}

  cool_switch_toggle.addEventListener("change", function () {
  if (cool_switch_toggle.checked) {
      document.body.classList.add("color-switch-mode");
      localStorage.setItem("mm_cool_switch_toggle", "true");
  } else {
      document.body.classList.remove("color-switch-mode");
      localStorage.setItem("mm_cool_switch_toggle", "false");
  }
});
      const audio_switch = document.createElement("div");
  audio_switch.classList.add("view-option");

  const audio_switch_text = document.createElement("span");
  audio_switch_text.textContent = "UI audio";

  const audio_switch_label = document.createElement("label");
  audio_switch_label.classList.add("switch");

  const audio_switch_toggle = document.createElement("input");
  audio_switch_toggle.setAttribute("type", "checkbox");
  audio_switch_label.appendChild(audio_switch_toggle);

  const audio_switch_div = document.createElement("div");
  audio_switch_label.appendChild(audio_switch_div);
  audio_switch.appendChild(audio_switch_label);
  audio_switch.appendChild(audio_switch_text);


if (localStorage.getItem("mm_audio_switch_toggle") === "true") {
  audio_switch_toggle.checked = true;
  document.body.classList.add("audio_switch-mode");
}

  audio_switch_toggle.addEventListener("change", function () {
  if (audio_switch_toggle.checked) {
      document.body.classList.add("audio_switch-mode");
      localStorage.setItem("mm_audio_switch_toggle", "true");
  } else {
      document.body.classList.remove("audio_switch-mode");
      localStorage.setItem("mm_audio_switch_toggle", "false");
  }

updateUIAudioVolume();

});

      const UI_switch = document.createElement("div");
  UI_switch.classList.add("view-option");

  const UI_switch_text = document.createElement("span");
  UI_switch_text.textContent = "Draggable UI";

  const UI_switch_label = document.createElement("label");
  UI_switch_label.classList.add("switch");

  const UI_switch_toggle = document.createElement("input");
  UI_switch_toggle.setAttribute("type", "checkbox");
  UI_switch_label.appendChild(UI_switch_toggle);

  const UI_switch_div = document.createElement("div");
  UI_switch_label.appendChild(UI_switch_div);
  UI_switch.appendChild(UI_switch_label);
  UI_switch.appendChild(UI_switch_text);


if (localStorage.getItem("mm_UI_switch_toggle") === "true") {
  UI_switch_toggle.checked = true;
  document.body.classList.add("UI-switch-mode");
}

  UI_switch_toggle.addEventListener("change", function () {
  if (UI_switch_toggle.checked) {
      document.body.classList.add("UI-switch-mode");
      localStorage.setItem("mm_UI_switch_toggle", "true");
  } else {
      document.body.classList.remove("UI-switch-mode");
      localStorage.setItem("mm_UI_switch_toggle", "false");
  }


});
  const wave_switch = document.createElement("div");
  wave_switch.classList.add("view-option");

  const wave_switch_text = document.createElement("span");
  wave_switch_text.textContent = "Wave effect";

  const wave_switch_label = document.createElement("label");
  wave_switch_label.classList.add("switch");

  const wave_switch_toggle = document.createElement("input");
  wave_switch_toggle.setAttribute("type", "checkbox");
  wave_switch_label.appendChild(wave_switch_toggle);

const savedWaveToggle = localStorage.getItem("mm_wave_switch_toggle");

if (savedWaveToggle === "true" || savedWaveToggle === null) {
  wave_switch_toggle.checked = true;
  document.body.classList.add("wave-switch-mode");
  localStorage.setItem("mm_wave_switch_toggle", "true");
} else {
  wave_switch_toggle.checked = false;
  document.body.classList.remove("wave-switch-mode");
}

wave_switch_toggle.addEventListener("change", () => {
  const isOn = wave_switch_toggle.checked;
  localStorage.setItem("mm_wave_switch_toggle", isOn ? "true" : "false");

  if (isOn) {
    document.body.classList.add("wave-switch-mode");
  } else {
    document.body.classList.remove("wave-switch-mode");
  }
});

    const wave_switch_div = document.createElement("div");
     wave_switch_label.appendChild(wave_switch_div);
     wave_switch.appendChild(wave_switch_label);
     wave_switch.appendChild(wave_switch_text);


    wave_switch_toggle.addEventListener("change", function () {
      if (wave_switch_toggle.checked) {
        document.body.classList.add("wave-switch-mode");
        localStorage.setItem("mm_wave_switch_toggle", "true");
      } else {
        document.body.classList.remove("wave-switch-mode");
        localStorage.setItem("mm_wave_switch_toggle", "false");
  }

});
    const keybind_div = document.createElement("div");
     keybind_div.classList.add("view-option");

    const keybind_text = document.createElement("span");
     keybind_text.textContent = "UI toggle key:";

    const keybind_input = document.createElement("input");
     keybind_input.setAttribute("type", "text");
     keybind_input.classList.add("other-custom-input");
     keybind_input.value = toggleKey;
     keybind_input.textContent = "[${toggleKey.toUpperCase()}]";

     keybind_input.addEventListener("keydown", function (e) {
       e.preventDefault();

  toggleKey = e.key;
  localStorage.setItem("mm_toggle_key", toggleKey);
  keybind_input.value = toggleKey;
});

    keybind_div.appendChild(keybind_text);
    keybind_div.appendChild(keybind_input);

    display_panel.appendChild(keybind_div);

    display_panel.appendChild(UI_switch);
      display_panel.appendChild(cool_switch);
    display_panel.appendChild(audio_switch);

    display_panel.appendChild(wave_switch);

      function resizeInputToText(input) {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    span.style.font = getComputedStyle(input).font;
    span.textContent = input.value || input.placeholder;
    document.body.appendChild(span);

    input.style.width = span.offsetWidth + 16 + 'px';
    document.body.removeChild(span);
}

resizeInputToText(keybind_input);

keybind_input.addEventListener('input', () => resizeInputToText(keybind_input));

keybind_input.addEventListener('keydown', (e) => {
    e.preventDefault();
    toggleKey = e.key;
    localStorage.setItem("mm_toggle_key", toggleKey);
    keybind_input.value = toggleKey;
    resizeInputToText(keybind_input);
});

    setActiveTab(settings_tab);
  };

  //Changelog / Update tab
  const update_tab = document.createElement("buttons");
  update_tab.classList.add("tab_button");
  side_panel.appendChild(update_tab);

  const update_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  update_svg.setAttribute("width", "32");
  update_svg.setAttribute("height", "32");
  update_svg.setAttribute("viewBox", "0 0 24 24");
  update_svg.setAttribute("fill", "none");
  update_svg.setAttribute("stroke", "#BBBBBB");
  update_svg.setAttribute("stroke-width", "2");
  update_svg.setAttribute("stroke-linecap", "round");
  update_svg.setAttribute("stroke-linejoin", "round");

  update_svg.innerHTML =
   '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#bbbbbb"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.4721 16.7023C17.3398 18.2608 15.6831 19.3584 13.8064 19.7934C11.9297 20.2284 9.95909 19.9716 8.25656 19.0701C6.55404 18.1687 5.23397 16.6832 4.53889 14.8865C3.84381 13.0898 3.82039 11.1027 4.47295 9.29011C5.12551 7.47756 6.41021 5.96135 8.09103 5.02005C9.77184 4.07875 11.7359 3.77558 13.6223 4.16623C15.5087 4.55689 17.1908 5.61514 18.3596 7.14656C19.5283 8.67797 20.1052 10.5797 19.9842 12.5023M19.9842 12.5023L21.4842 11.0023M19.9842 12.5023L18.4842 11.0023" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12L15 15" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'
  update_tab.appendChild(update_svg);

  update_tab.onclick = function () {
    display_panel.innerHTML = `<span><span class="text-muted">|</span>
   <span><span class="text-bold">Updates / Changelog</span><br><br>

   <span><span class="text-muted">_________________________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">December 31st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-bold">Version 0.9.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-bold">Made the timer automatically move when another number is added to the kill counter to prevent clipping.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-bold">Added hover and click animations to the kill counter and timer.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">yea.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">December 30th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.9.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Moved the achievement toast to the top of the screen.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Made the hover animations for the toasts look a bit better.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Changed the timer to match the kill counter UI.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Adjusted the switch animation to look a bit more dynamic.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Bruh.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">December 28th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.9</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a switch to the visuals tab to enable and disable dark mode.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Changed the achievement and kill toasts so that they match the diep theme a bit better.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Also made it so you can click on the achievement and kill toasts to dismiss them.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Also finally fixed the issue with the kill counter stopping at 1000, as well as adding 3 new achievements corresponding to lifetime kills.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">No updates in a month is crazy work.</span></span><br>
   <span style="font-size: 50%;"><span class="text-muted">Israel.io, delete all other games that are even remotely similar to mine.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 25th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9.5</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a switch in the visuals tab for rendering various debug information about the server you're on.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Also added a switch for showing your current session kills in the top left of the screen.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Changed the kill toast icon to a crosshair.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed random things.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Another 5000 switches to the visuals tab.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 21st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9.4</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">I messed up the date on the last update lol</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Lame ass update</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 21st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9.3</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">I also just now learned that the kill key that was being saved in localstorage only goes up to 1000, which means that lifetime kills are capped at 1000.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fuck.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">A "solution" you can do is to copy and paste this into the console then refresh the page:<br><br><div style="user-select:text !important; -webkit-user-select:text !important;"><span class="text-muted"><i>localStorage.setItem('A::8abd923027114f9e_1', '0');</div></i></span><br>
   <span style="font-size: 100%;"><span class="text-muted">⚠ DOING THIS WILL SET YOUR LIFETIME KILLS TO 0 ⚠ but I have literally no other solution I can be bothered to implement rn<br><br>
   <span style="font-size: 50%;"><span class="text-muted">I have no clue how to fix this.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-bold">⚠ Fixed with a new system of tracking kills as of version 0.9. ⚠</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 17th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">I now just learned that UI audio won't work unless you're on a non-chrominium browser due to autoplay policies or something lol.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Why is this a thing</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 17th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed issue with UI audio not playing unless you turn the switch off and on lmfao.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">How didn't I fix this earlier</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 16th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.9</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added audio to toasts.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added an option to enable the UI audio and changed some of the wording in the settings.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Aligned the kill toast and the achievement toast.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">ts 3mo</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 15th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.8</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added more achievements to the mod menu.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Mfw</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 14th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.7.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Adjusted the animations on the switches to look better.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">uh</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 13th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.7.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Made the tab tooltips look cooler when you hover over the corresponding tab and also moved them to the left since the right covered up some of the tabs text.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Also gave the tab tooltips a small delay so they aren't always showing up.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">lol</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 13th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.7</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added hover tooltips when you hover over a tab button.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">bruh</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 10th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.6</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the timer not dynamically scaling and bolding with different window sizes.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Fire.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 8th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.5.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the issue where the session kills wasn't counting until you opened the achievement tab.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">I suck at coding.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 7th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.5</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a toast at the bottom of the screen whenever you get a kill.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a session and lifetime kills to the achievement tab.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Awesome.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 2nd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.4</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Made it so you can set your own custom respawn name.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">(Kind of) Fixed the issue with the menu causing the game to essentially unfocus when you use a switch.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Awesome</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 2nd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.3.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">I forgot one toggle thing in the script and the ping didn't show awesome it works now.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">November 2nd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.3</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Renamed the "Render FPS & Ping" to "Render FPS & Latency" since that's what it actually is not ping lol.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added show Ping option to visuals.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 25th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the movement prediction in the visuals being flip-flopped since the update disables it by default now.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">This update sucks except for the shotgun tank lol</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 23rd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Updated "all" the things to work with the new update.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Removed the achievement button fix since it doesn't work anymore and you hover your mouse on the right side to view them now.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added another smasher build to the upgrades tab.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">More stuff soon... (lying x2)</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 20th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.8</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added achievements built into the mod menu.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">More stuff soon... (lying)</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 9th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.6</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a timer in the visuals tab.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Miscellaneous fixes and visual improvements.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">More stuff soon... (aura x2)</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 8th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.5</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a new visual option for disabling the client sided movement prediction.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Miscellaneous fixes lol.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">More stuff soon... (aura)</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 7th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.4</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a toggle for the waves in the background</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">bruh</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 6th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.3</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Readded the watermark and it now displays the version.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a wavy background thing that shows whenever the menu is open.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">bruh</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 5th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added another build for glass in the auto upgrades tab.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">Bro will do anything but add options to the settings tab</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 4th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the wrong script link in the last update lol.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 3rd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.7</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the achievement button not showing up.</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Rearranged the layout of the buttons on the side.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- Credit: "Oliver Grim" since i basically stole their code lol.</span></span><br>
   <span class="text-muted"><span style="font-size: 80%;">- Their script – <a href="https://greasyfork.org/en/scripts/533394-achievements-always-visible" target="_blank">Their Greasyfork Script (opens in a new tab)</a></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">I'm lowkey running out of things to add.</span></span><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 2nd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.6.1</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Polished up some animations.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- Some of them looked kind of weird.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- Waiter! Waiter! More 0.0.1 updates please!</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 2nd 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.6</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">A bunch of bugs got fixed.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 1st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.5.7</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the window drag since it broke unless you open the settings tab.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- Another tiny update so it's 0.0.1 again.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 1st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.5.6</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Fixed the settings switches because they broke and made the switches animation cooler</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- This is like the smallest update ever so it's a whole 0.0.1.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 1st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.5.5</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Made UI dragging toggleable.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- This wasn't worthy of a whole 0.1 of an update so it's 0.0.5 of an update instead.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">October 1st 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.5</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added the ability to drag around the UI</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- This took a while to make but it's pretty nifty.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">September 29th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.4</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Made it so the info tab toggle key matches the current toggle key.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">September 29th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.3</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added a customizable option for the UI toggle key.</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- That's it lmao</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">September 29th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.2</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added updates tab</span></span><br>
   <span style="font-size: 80%;"><span class="text-muted">- For showing updates to this UI wow crazy.</span></span><br><br>

   <span><span class="text-muted">________________________</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">September 27th - 29th 2025</span></span><br><br>
   <span style="font-size: 110%;"><span class="text-muted">Version 0.1!</span></span><br><br>
   <span style="font-size: 100%;"><span class="text-muted">Added the settings and info tab, along with an animation for opening and closing the UI.</span></span><br>
   <span class="text-muted"><span style="font-size: 80%;">Their script – <a href="https://greasyfork.org/en/scripts/464910-diep-io-mod-menu" target="_blank">The original UI</a></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">- I did add more but it's nothing too important.</span></span><br><br>
   <span style="font-size: 50%;"><span class="text-muted">bro is nonchalant</span></span><br>
   <span><span class="text-muted">_________________________________________</span><br><br>
`
    setActiveTab(update_tab);
  };

  //Info tab
  const info_tab = document.createElement("buttons");
  info_tab.classList.add("tab_button");
  side_panel.appendChild(info_tab);

  const info_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  info_svg.setAttribute("width", "32");
  info_svg.setAttribute("height", "32");
  info_svg.setAttribute("viewBox", "0 0 24 24");
  info_svg.setAttribute("fill", "#bbbbbb");
  info_svg.setAttribute("stroke", "#bbbbbb");
  info_svg.setAttribute("stroke-width", "0.1");
  info_svg.setAttribute("stroke-linecap", "round");
  info_svg.setAttribute("stroke-linejoin", "round");

  info_svg.innerHTML =
   '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#bbbbbb"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Warning / Info"> <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>'
   info_tab.appendChild(info_svg);

  //i fucking hated typing this
  info_tab.onclick = function () {
   display_panel.innerHTML = `
   <span><span class="text-muted">|</span>
   <span><span class="text-bold">Information</span></span><br><br>
   <span><span class="text-bold">[${toggleKey.toUpperCase()}]</span>
   <span><span class="text-muted">to toggle UI.</span><br><br>

   <span class="text-muted">Greasyfork link: <a href="https://greasyfork.org/en/scripts/551128-better-diep-io-mod-menu" target="_blank">Click here (Opens in a new tab)</a></span><br><br>

   <span><span class="text-bold">• Visuals tab</span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">Aim line: Displays a line on top of your tank that follows your cursor to help you aim better.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Auto respawn: Automatically respawns your tank after ~2 seconds when you die, along with a preset name that you can change in the textbox.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Enable movement prediction: Enables the client sided prediction for movement. This makes your movement smoother, but less accurate. This was enabled by default before the October 20th update.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Factory circle: Displays 3 circles on top of your screen which indicate how your factory drones will orbit your cursor based on its current position.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Hide game UI: Toggles the games UI on or off.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render collisions: Renders all of the current collisions and collidable debug info in the game, along with the bounds of the area that you are currently in.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render dark mode: Renders the games theming to be darker.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render debug info: Renders information about the server that you are currently playing on such as the amount of entities and the bandwidth being used.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render FPS & latency: Renders your current Frames Per Second along with your latency which is how long the game takes to register an input.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render kill counter: Renders a UI element at the top left of the screen that displays the amount of kills for your current session. It tracks kills in all the gamemodes except for the cycling mini-game modes (Breakout, Capture The Flag, Domination, Tag) and Sandbox.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render ping: Renders your "ping" which refers to how fast you get a response from the server.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render raw health values: Renders the current "raw health value" of your tank, other people's tanks, and shapes inside of their respective health bars.</span></span><br><br>
   <span style="font-size: 80%;"><span class="text-muted">Render timer: Renders a UI element at the top left of the screen that displays the hours, minutes, and seconds that you've been playing for on your current session.</span></span><br><br>

   <span style="font-size: 100%;"><span class="text-bold">• Custom build / Auto upgrade tab</span></span><br><br>

   <span style="font-size: 80%;"><span class="text-muted">Automatically upgrades your tank depending on the sequence of numbers that correspond to a certain upgrade (ex. 1 = Health Regen, 2 = Max Health etc...). Presets are in lines 18 - 63.</span></span>
`;

    setActiveTab(info_tab);

  };

  //Credits tab
  const credits_tab = document.createElement("buttons");
  credits_tab.classList.add("tab_button");
  side_panel.appendChild(credits_tab);

  const credit_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  credit_svg.setAttribute("width", "32");
  credit_svg.setAttribute("height", "32");
  credit_svg.setAttribute("viewBox", "0 0 24 24");
  credit_svg.setAttribute("fill", "none");
  credit_svg.setAttribute("stroke", "#BBBBBB");
  credit_svg.setAttribute("stroke-width", "0");
  credit_svg.setAttribute("stroke-linecap", "round");
  credit_svg.setAttribute("stroke-linejoin", "round");

  credit_svg.innerHTML =
    '<<svg fill="#bbbbbb" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#bbbbbb"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 35.9922 C 20.9452 35.9922 15.5077 38.5 13.1405 41.3125 C 9.9999 37.7968 8.1014 33.1328 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9219 33.1563 46.0234 37.8203 42.8593 41.3359 C 40.4921 38.5234 35.0546 35.9922 27.9999 35.9922 Z M 27.9999 32.0078 C 32.4999 32.0547 36.0390 28.2109 36.0390 23.1719 C 36.0390 18.4375 32.4765 14.5 27.9999 14.5 C 23.4999 14.5 19.9140 18.4375 19.9609 23.1719 C 19.9843 28.2109 23.4765 31.9609 27.9999 32.0078 Z"></path></g></svg>/>';

  credits_tab.appendChild(credit_svg);

  credits_tab.onclick = function () {
    display_panel.innerHTML = `<span><span class="text-muted">|</span>
   <span><span class="text-bold">Credits</span><br><br>
   <span><span class="text-muted">UI ''slightly'' modded by: </span><code>@totallyjake</code></span><br><br>
   <span>Dude who made the original UI:</span><br>
   <span><span class="text-muted">Discord: </span><code>@x03</code></span><br>
   <span>Github: <a href="https://github.com/x032205/" target="_blank">@x032205</a></span><br><br>
   <span>Original UI: <a href="https://greasyfork.org/en/scripts/464910-diep-io-mod-menu" target="_blank">Greasyfork Script</a></span><br><br>
   <span>Kill counter & timer UI "inspiration": <a href="https://havre.io/" target="_blank">Havre.io</a></span><br><br>
   <span>Sound effects – <a href="https://uppbeat.io/sfx" target="_blank">uppbeat.io</a></span><br><br>
   `;
    setActiveTab(credits_tab);
  };

  //Achievements tab
  const ach_tab = document.createElement("buttons");
  ach_tab.classList.add("tab_button");
  side_panel.appendChild(ach_tab);

  const ach_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  ach_svg.setAttribute("width", "32");
  ach_svg.setAttribute("height", "32");
  ach_svg.setAttribute("viewBox", "0 0 24 24");
  ach_svg.setAttribute("fill", "none");
  ach_svg.setAttribute("stroke", "#BBBBBB");
  ach_svg.setAttribute("stroke-width", "0");
  ach_svg.setAttribute("stroke-linecap", "round");
  ach_svg.setAttribute("stroke-linejoin", "round");

  ach_svg.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';

  ach_tab.appendChild(ach_svg);

ach_tab.onclick = function () {
  display_panel.innerHTML = `
    <span><span class="text-muted">|</span>
    <span class="text-bold">Statistics / Achievements</span><br><br>
    <div id="achievements-list" class="inner_panel"></div>
  `;
  setActiveTab(ach_tab);


(function () {
  // lifetime kill key
  const killKey = "A::8abd923027114f9e_1";

  const startKills = parseInt(localStorage.getItem(killKey) || "0");

  const killStatsBox = document.createElement("div");
  killStatsBox.classList.add("kills_panel");
  killStatsBox.style.cssText = `
    background: hsla(0, 0%, 10%, 0.6);
    border: 1px solid hsla(0, 0%, 100%, 0.1);
    border-radius: 8px;
    padding: 10px;
    margin-left: 4px;
    margin-bottom: 6px;
    width: fit-content;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1.5);
    color: #EEE;
    font-size: 14px;
  `;
  killStatsBox.innerHTML = `
    <div style="margin-bottom: 4px;">
      <span style="color: #bbbbbb; font-weight: 600;">Session Kills:</span>
      <span id="session-kills">0</span>
    </div>
    <div>
      <span style="color: #cccccc; font-weight: 600;">Lifetime Kills:</span>
      <span id="lifetime-kills">0</span>
    </div>
  `;

  const achievementsListContainer = document.getElementById("achievements-list");
  achievementsListContainer.parentNode.insertBefore(killStatsBox, achievementsListContainer);


})();


  const achievements = [
    { id: "play_1_hour", name: "Take a Break", desc: "Play for 1 hour in 1 session.", unlocked: false },
    { id: "play_5_hours", name: "Unemployed", desc: "Play for 5 hours in 1 session.", unlocked: false },
    { id: "play_10_hours", name: "No Life", desc: "Play for 10 hours in 1 session.", unlocked: false },
    { id: "Kills_1_1_session", name: "Getting Started", desc: "Get 1 kill in 1 session.", unlocked: false },
    { id: "Kills_10_1_session", name: "Tank Destroyer", desc: "Get 10 kills in 1 session.", unlocked: false },
    { id: "Kills_25_1_session", name: "Tank Obliterator", desc: "Get 25 kills in 1 session.", unlocked: false },
    { id: "Kills_50_1_session", name: "Tank Annihilator ", desc: "Get 50 kills in 1 session.", unlocked: false },
    { id: "Kills_100_1_session", name: "Massacre", desc: "Get 100 kills in 1 session.", unlocked: false },
    { id: "Kills_2500_lifetime", name: "Bro", desc: "Amass 2,500 lifetime kills.", unlocked: false },
    { id: "Kills_5000_lifetime", name: "The Chosen Tank", desc: "Amass 5,000 lifetime kills.", unlocked: false },
    { id: "Kills_10000_lifetime", name: "The Worst Achievement", desc: "Amass 10,000 lifetime kills.", unlocked: false },
  ];

  achievements.forEach(a => {
    a.unlocked = localStorage.getItem(`ach_${a.id}`) === "true";
  });

  const list = document.getElementById("achievements-list");
  list.innerHTML = achievements.map(a => `
    <div class="achievement-item" style="
      margin-left: -8px;
      padding: 6px;
      border-radius: 6px;
      margin-bottom: 6px;
      background: hsla(0, 0%, ${a.unlocked ? '25%' : '12%'}, 0.6);
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      width: fit-content;
      max-width: 100%;
    ">
      <svg width="20" height="20" fill="${a.unlocked ? '#1bfe94' : '#777'}" viewBox="0 0 24 24">
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#bbbbbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
      </svg>
      <div>
        <div style="font-weight:600; color:${a.unlocked ? '#EEEEEE' : '#AAAAAA'};">${a.name}</div>
        <div style="font-size:12px; color:#BBBBBB;">${a.desc}</div>
      </div>
    </div>
  `).join("");
};

  //Close tab
  const close_tab = document.createElement("close_button");
  close_tab.classList.add("close_tab_button");
  side_panel.appendChild(close_tab);

  const close_svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  close_svg.setAttribute("width", "32");
  close_svg.setAttribute("height", "32");
  close_svg.setAttribute("viewBox", "0 0 24 24");
  close_svg.setAttribute("fill", "#b30000");
  close_svg.setAttribute("stroke", "#b30000");
  close_svg.setAttribute("stroke-width", "0.1");
  close_svg.setAttribute("stroke-linecap", "round");
  close_svg.setAttribute("stroke-linejoin", "round");

  close_svg.innerHTML =
    '<svg viewBox="0 0 24 24" fill="bbbbbb" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z" fill="#bbbbbb"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#bbbbbb"></path> </g></svg>'
  close_tab.appendChild(close_svg);

  close_tab.onclick = function () {
     toggleDisplay("backdrop");
  };


  const style = document.createElement("style");
  style.textContent = `
    code { font-family: monospace; }

      #panel {
       position: absolute;
       font-family: 'Inter', sans-serif;
       opacity: 0;
       color: #EEEEEE;
       font-size: 16px;
       display: flex;
       flex-direction: row;
       max-width: 650px;
       max-height: 450px;
       width: 100%;
       height: 100%;
       padding: 12px;
       overflow-x: hidden;
       overflow-y: auto;
       transform-origin: center center;
       outline: 3px solid hsla(0, 0%, 40%, 0.2);
       transition: opacity 0.3s ease, transform 0.3s ease;
       gap: 6px;
       background: hsla(0, 0%, 10%, 0.7);
       backdrop-filter: blur(7px);
       -webkit-backdrop-filter: blur(7px);
       border-radius: 8px;
       z-index: 9999;
     }

     .achievement-item {
       overflow: visible;
       transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1.5);
     }

     .achievement-item:hover {
       padding: 10px 10px;
     }

     .achievement-item:active {
       transform: scale(0.95);
       padding: 5px 5px;
     }

    #achievements-list {
       max-height: calc(200vh - 200px);
       overflow-y: auto;
     }

    .kills_panel:hover {
       transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1.5);
       transform: scale(1.05);
       padding: 10px 10px;
    }

    .kills_panel:active {
       transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1.5);
       transform: scale(0.95);
       padding: 5px 5px;
    }

     body.color-switch-mode
     .switch div {
     background: gray;
     }

     body.color-switch-mode
     .switch input:checked + div {
      background: white;
     }

     .separator {
       width: 1px;
       height: 100%;
       background-color: hsla(0, 0%, 100%, 0.1);
     }

     buttons:active {
       transform: scale(0.9) rotate(3deg);
     }

     close_button:hover {
       box-shadow: 0 0 4px red;
       transform: scale(1.1);
     }

     close_button:active {
       transform: scale(0.9) rotate(4deg);
     }

     #backdrop {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 52;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
     }

      #backdrop.visible {
       opacity: 1;
       pointer-events: all;
     }

     #backdrop #panel {
      transform-origin: 50% 50%;
      transform: scale(0) translate(0%, 0%);
      opacity: 0;
     }


     #backdrop.visible #panel {
      transform-origin: 50% 50%;
      transform: scale(1) translate(0%, 0%);
      opacity: 1;
     }

    .switch {
      display: inline-block;
      font-size: 20px;
      height: 1em;
      width: 2em;
      border: 1px solid hsla(0, 0%, 100%, 0.0);
      background: rgb(50, 50, 50);
      border-radius: 1em;
      margin-right: 10px;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .switch input {
      position: fixed;
      opacity: 0;
      cursor: pointer;
    }

    .switch:hover {
      transform: scale(1.05);
      padding: 1px 1px;
    }

    .switch:active {
     transform: scale(0.95);
     padding: 0px 0px;
    }

    .switch div {
      font-size: 20px;
      height: 1em;
      width: 1em;
      border-radius: 1em;
      background: #e91640;
      transition: all 200ms cubic-bezier(0.4, 0.6, 0, 1.35);
      cursor: pointer;
    }

    .switch input:checked + div {
      transform: translate3d(100%, 0, 0);
      background: #1bfe94;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    a {
       color: #bbbbbb;
       transition: color 0.15s ease;
      }

    a:hover {
       color: #e8e8e8;
      }

    a:active {
       color: #959595;
      }

    .inner_panel {
      max-height:450px;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px;
      width: 100%;
      margin-left: 4px;
    }

    .tab_button {
      cursor: pointer;
      display: flex;
      width: 48px;
      height: 48px;
      justify-content: center;
      align-items: center;
      background: hsla(0, 0%, 20%, 0.5);
      border-radius: 4px;
      border: none;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .close_tab_button {
      position: absolute;
      left: 12px;
      top: 414px;
      cursor: pointer;
      display: flex;
      width: 48px;
      height: 48px;
      justify-content: center;
      align-items: center;
      background: hsla(0, 0%, 20%, 0.5);
      border-radius: 4px;
      border: none;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .close_button {
      color: #dC143C;
      background: hsla(0, 0%, 20%, 0.5);
      border: none;
      border-radius: 4px;
      padding: 6px 6px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .close_tab_button:hover,
     .close_tab_button.active {
     background: hsla(0, 100%, 40%, 1);
    }

    .presetbuttons {
      color: #EEEEEE;
      background: hsla(0, 0%, 20%, 0.5);
      border-radius: 4px;
      padding: 6px 12px;
      outline: 2px solid hsla(0, 0%, 100%, 0.0);
      cursor: pointer;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1.5);
    }

    .presetbuttons:hover {
      background: hsla(0, 0%, 30%, 0.5);
      transform: scale(1.015);
      outline: 2px solid hsla(0, 0%, 100%, 0.2);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
      padding: 10px 10px;
    }

    .presetbuttons:active {
      outline: 2px solid hsla(0, 0%, 100%, 0.5);
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1.5);
      background: hsla(0, 0%, 40%, 0.5);
      padding: 8px 8px;
      transform: scale(0.97);
    }

    .preset-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .inner_panel::-webkit-scrollbar {
     width: 4px;
    }

    .inner_panel::-webkit-scrollbar-track {
     background: rgba(255, 255, 255, 0.1);
     border-radius: 4px;
    }

    .inner_panel::-webkit-scrollbar-thumb {
     background: rgba(255, 255, 255, 0.3);
     border-radius: 4px;
    }

     .buttons {
      color: #EEEEEE;
      background: hsla(0, 0%, 20%, 0.5);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      transition: background 0.2s;
     }

     .buttons:hover {
      background: hsla(0, 0%, 30%, 0.5);
     }

    .tab_button:hover,
     .tab_button.active {
       padding: 1px 1px;
       box-shadow: 0 0 5px black;
       background: hsla(0, 0%, 60%, 0.5);
       scale: 1.1;
     }


    .tab_button.active {
      background: hsla(0, 0%, 50%, 0.5);
     }

    #backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 51;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }

    .blur_fade {
     opacity: 0.3;
     filter: blur(2px);
     transition: opacity 0.3s ease, filter 0.3s ease;
    }

     .watermark {
      position: fixed;
      top: 8px;
      left: 50%;
      opacity: 100%;
      filter: drop-shadow(0 0 0.25rem black);
      transform: translateX(-50%);
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 2);
     }

    .watermark:hover {
     transform: translateX(-50%) scale(1.05) rotate(0.5deg);
    }

    .watermark:active {
     transform: translateX(-50%) scale(0.95);
    }

     .subheading { font-weight: 600; }

     .view-option {
      filter: drop-shadow(0 0 0.25rem black);
      text-align: left;
      align-items: center;
      height: 28px;
      display: flex;
     }

     .respawn_name_input {
      margin-left: 0px;
      transform-origin: center center;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      color: #EEEEEE;
      background: hsla(0, 0%, 10%, 0.7);
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      border-radius: 4px;
      padding: 6px;
      outline: none;
     }

     .respawn_name_input:hover {
      background: hsla(0, 0%, 30%, 0.5);
      transform: scale(1.012);
      padding: 10px 10px;
      border: 1px solid hsla(0, 0%, 100%, 0.5);
      border-radius: 8px;
     }

     .respawn_name_input:active {
      background: hsla(0, 0%, 40%, 0.5);
      padding: 8px 8px;
      transform: scale(0.99);
     }

     .custom-input {
      margin-left: 0px;
      transform-origin: center center;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      color: #EEEEEE;
      background: hsla(0, 0%, 10%, 0.7);
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      border-radius: 4px;
      padding: 6px;
      outline: none;
     }

     .custom-input:hover {
      background: hsla(0, 0%, 30%, 0.5);
      transform: scale(1.012);
      padding: 10px 10px;
      border: 1px solid hsla(0, 0%, 100%, 0.5);
      border-radius: 8px;
     }

     .custom-input:active {
      background: hsla(0, 0%, 40%, 0.5);
      padding: 8px 8px;
      transform: scale(0.99);
     }

     .other-custom-input {
      margin-left: 4px;
      transform-origin: center center;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      color: #EEEEEE;
      background: hsla(0, 0%, 10%, 0.7);
      border: 1px solid hsla(0, 0%, 100%, 0.1);
      border-radius: 4px;
      padding: 6px;
      outline: none;
     }

     .other-custom-input:hover {
      background: hsla(0, 0%, 30%, 0.5);
      transform: scale(1.05);
      border: 1px solid hsla(0, 0%, 100%, 0.5);
      border-radius: 4px;
      padding: 7px 7px;
     }

     .tab-tooltip {
       position: absolute;
       left: 110%;
       top: 50%;
       background: rgba(20, 20, 20, 0.85);
       color: #fff;
       padding: 4px 8px;
       z-index: 53;
       font-size: 12px;
       white-space: nowrap;
       pointer-events: none;
       opacity: 0;
       filter: blur(2px);
       transform-origin: left center;
       border: 1px solid rgba(255, 255, 255, 0.1);
       border-radius: 6px;
       transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
       transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
       transition: filter 100ms cubic-bezier(0.4, 0, 0.2, 1)"
     }

     .other-custom-input:active {
      background: hsla(0, 0%, 40%, 0.5);
      padding: 6px 6px;
      transform: scale(0.99);
     }

     .text-muted {
      color: #BBBBBB;
     }

     .text-semi-muted {
      color: #c2c2c2;
     }

     input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
     }

     input[type=number] {
      -moz-appearance: textfield;
   `;

   (function () {


  //UI Kill counter
  const kc = document.createElement("div");
  kc.id = "mm_render_kill_counter";
  kc.style.cssText = `
    position: absolute;
    top: 7%;
    left: 0.65%;
    background: rgba(0,0,0,0.2);
    padding: 0.1% 0.5%;
    display: inline-block;
    align-items: center;
    gap: 1px;
    border-radius: 8px;
    border: 1px solid #555555;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 51;
    pointer-events: auto;
  `;
  kc.addEventListener("mousedown", () => {
  kc.style.backdropFilter = "blur(6px)";
  kc.style.transform = "scale(0.95) translateY(2px)";
  kc.style.background = "rgba(0,0,0,0.3)";
});

  kc.addEventListener("mouseup", () => {
  kc.style.backdropFilter = "blur(1px)";
  kc.style.transform = "scale(1) translateY(-2px)";
  kc.style.background = "rgba(0,0,0,0.2)";
});

  kc.addEventListener("mouseleave", () => {
  kc.style.backdropFilter = "blur(0px)";
  kc.style.boxShadow = "0 0px 8px rgba(0,0,0,0)";
  kc.style.transform = "scale(1) translateY(1px)";
  kc.style.background = "rgba(0,0,0,0.2)";
  kc.style.overflow = "visible";
});

  kc.addEventListener("mouseenter", () => {
  kc.style.backdropFilter = "blur(1px)";
  kc.style.boxShadow = "0 0px 8px rgba(0,0,0,0.5)";
  kc.style.transform = "scale(1.05) translateY(-2px)";
  kc.style.background = "rgba(0,0,0,0.2)";
  kc.style.overflow = "visible";
});

  const kcicon = document.createElement("div");
  kcicon.innerHTML = `
  <svg viewBox="2 -5 27 30" width="30" height="30" style="paint-order: stroke fill;">
  <path d="M21 11h-1.07A8 8 0 0 0 13 4.07V3a1 1 0 0 0-2 0v1.07A8 8 0 0 0 4.07 11H3a1 1 0 0 0 0 2h1.07A8 8 0 0 0 11 19.93V21a1 1 0 0 0 2 0v-1.07A8 8 0 0 0 19.93 13H21a1 1 0 0 0 0-2Zm-4 2h.91A6 6 0 0 1 13 17.91V17a1 1 0 0 0-2 0v.91A6 6 0 0 1 6.09 13H7a1 1 0 0 0 0-2h-.91A6 6 0 0 1 11 6.09V7a1 1 0 0 0 2 0v-.91A6 6 0 0 1 17.91 11H17a1 1 0 0 0 0 2Zm-5-2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z"
   fill="#ffffff" stroke="#000" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
  </svg>
  `;

  const count = document.createElement("span");
  count.textContent = "0";
  count.style.cssText = `
    color: #ffffff;
    font-size: 15px;
    display: inline-block;
    font-weight: 600;
    text-shadow:
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
      will-change: transform, opacity;
      transform: translateZ(0);
  `;

  kc.appendChild(kcicon);
  kc.appendChild(count);
  document.body.appendChild(kc);

  let lastSessionKills = 0;

setInterval(() => {
  if (window._mmSessionKills) {
    const kills = window._mmSessionKills.sessionKills;
    if (kills !== lastSessionKills) {
      count.textContent = kills;
      lastSessionKills = kills;
      repositionTimer();
    }
  }
}, 100);

  render_kc_toggle.checked = localStorage.getItem("mm_render_kill_counter") === "true";

  kc.style.display = render_kc_toggle.checked ? "flex" : "none";

  render_kc_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_render_kill_counter", render_kc_toggle.checked);
    kc.style.display = render_kc_toggle.checked ? "flex" : "none";
  });
  })();

  (function () {

  // UI playtime tracker
  const playtimeTimer = document.createElement("div");
  playtimeTimer.id = "mm_playtime_timer";
  playtimeTimer.style.cssText = `
    position: absolute;
    top: 7%;
    left: 4.75%;
    background: rgba(0,0,0,0.2);
    padding: 0.1% 0.5%;
    minWidth: 110px;
    justifyContent: flex-start;
    display: none;
    align-items: center;
    gap: 1px;
    border-radius: 8px;
    border: 1px solid #555555;
    z-index: 51;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 15px;
    pointer-events: auto;
    text-shadow:
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000;
  `;

  const timericon = document.createElement("div");
  timericon.innerHTML = `
 <svg viewBox="2 -5 27 30" width="30" height="30">
  <path
    d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
    fill="none"
    stroke="#000000"
    stroke-width="4.5"
    vector-effect="non-scaling-stroke"
  />

  <path
    d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
    fill="none"
    stroke="#FFFFFF"
    stroke-width="2"
    vector-effect="non-scaling-stroke"
  />
 </svg>
  `;

 const text = document.createElement("span");
  text.textContent = "0s";

  playtimeTimer.appendChild(timericon);
  playtimeTimer.appendChild(text);
  document.body.appendChild(playtimeTimer);

  playtimeTimer.addEventListener("mousedown", () => {
  playtimeTimer.style.transform = "scale(0.95) translateY(2px)";
  playtimeTimer.style.backdropFilter = "blur(6px)";
  playtimeTimer.style.background = "rgba(0,0,0,0.3)";
});

  playtimeTimer.addEventListener("mouseup", () => {
  playtimeTimer.style.transform = "scale(1.05) translateY(-2px)";
  playtimeTimer.style.backdropFilter = "blur(1px)";
  playtimeTimer.style.background = "rgba(0,0,0,0.2)";
});

  playtimeTimer.addEventListener("mouseenter", () => {
  playtimeTimer.style.transform = "scale(1.05) translateY(-1px)";
  playtimeTimer.style.boxShadow = "0 0px 8px rgba(0,0,0,0.5)";
  playtimeTimer.style.backdropFilter = "blur(1px)";
  playtimeTimer.style.background = "rgba(0,0,0,0.2)";
});

  playtimeTimer.addEventListener("mouseleave", () => {
  playtimeTimer.style.transform = "scale(1) translateY(1px)";
  playtimeTimer.style.boxShadow = "0 0px 8px rgba(0,0,0,0)";
  playtimeTimer.style.backdropFilter = "blur(0px)";
  playtimeTimer.style.background = "rgba(0,0,0,0.2)";

});

  timer_toggle.checked = localStorage.getItem("playtime_timer_on") === "true";
  playtimeTimer.style.display = timer_toggle.checked ? "flex" : "none";
  playtimeTimer.style.transition = "all 300ms cubic-bezier(0.4, 0, 0.2, 1)";

  timer_toggle.addEventListener("change", () => {
    localStorage.setItem("playtime_timer_on", timer_toggle.checked);
    playtimeTimer.style.display = timer_toggle.checked ? "flex" : "none";
  });

   window.totalSeconds = 0;

  function updatePlaytime() {
    window.totalSeconds++;

    if (!timer_toggle.checked) return;

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    let display = "";
    if (hrs > 0) display += `${hrs}h `;
    if (hrs > 0 || mins > 0) display += `${String(mins).padStart(2, "")}m `;
    display += `${String(secs).padStart(2, "")}s`;

    text.textContent = display;
  }

  setInterval(updatePlaytime, 1000);
})();

 function repositionTimer() {
  const kc = document.getElementById("mm_render_kill_counter");
  const timer = document.getElementById("mm_playtime_timer");
  if (!kc || !timer) return;

  const gapPx = 6;
  const kcRect = kc.getBoundingClientRect();

  timer.style.left = `${kcRect.left + kcRect.width + gapPx}px`;
 }


  //Fix issue with the game unfocusing i hate this shit fuck fuck fuck fuck fuck ufck fuck
  (function ensureGameFocus() {
  function findGameCanvas() {
    const canvases = [...document.querySelectorAll("canvas")];
    const visible = canvases.filter(c => c.clientWidth > 50 && c.clientHeight > 50);
    return visible.length ? visible[0] : canvases[0] || null;
  }

  const gameCanvas = findGameCanvas();
  if (!gameCanvas) return;

  if (!gameCanvas.hasAttribute("tabindex")) gameCanvas.setAttribute("tabindex", "-1");

  function focusCanvas() {
    try {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      gameCanvas.focus();
      return document.activeElement === gameCanvas;
    } catch (e) {
      return false;
    }
  }

  //Tab tooltip when you hover over a tab button (wow)
  const tabButtons = document.querySelectorAll(".tab_button");

    visual_tab.setAttribute("data-tooltip", "Visuals");
    auto_upgrades_tab.setAttribute("data-tooltip", "Build Presets");
    settings_tab.setAttribute("data-tooltip", "Settings");
    update_tab.setAttribute("data-tooltip", "Updates");
    info_tab.setAttribute("data-tooltip", "Information");
    credits_tab.setAttribute("data-tooltip", "Credits");
    ach_tab.setAttribute("data-tooltip", "Achievements");

  tabButtons.forEach((btn) => {
   const text = btn.getAttribute("data-tooltip") || "Tab";
   const tip = document.createElement("div");
   tip.className = "tab-tooltip";
   tip.textContent = text;
  document.body.appendChild(tip);

  let hoverTimer;
  let hideTimer;

  btn.addEventListener("mouseenter", () => {
    clearTimeout(hideTimer);
    hoverTimer = setTimeout(() => {
      const r = btn.getBoundingClientRect();
      tip.style.left = `${r.left - tip.offsetWidth - 6}px`;
      tip.style.top = `${r.top + r.height / 2}px`;
      void tip.offsetWidth;
      tip.style.transition = "none";
      tip.style.opacity = "0";
      tip.style.transform = "translateY(-40%)";
      tip.style.filter = "blur(0)";
      requestAnimationFrame(() => {
        tip.style.transition =
          "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1), filter 100ms cubic-bezier(0.4, 0, 0.2, 1)";
        tip.style.opacity = "1";
        tip.style.transform = "translateY(-50%)";
        tip.style.filter = "blur(0px)";
      });
    }, 500);
  });

  btn.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    hideTimer = setTimeout(() => {
      tip.style.opacity = "0";
      tip.style.transform = "translateY(-40%)";
      tip.style.filter = "blur(2px)";
    }, 100);
  });
});


  function clickCanvasFallback() {
    try {
      const evt = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: gameCanvas.getBoundingClientRect().left + 1,
        clientY: gameCanvas.getBoundingClientRect().top + 1,
        view: window,
      });
      gameCanvas.dispatchEvent(evt);
      const up = new MouseEvent("mouseup", Object.assign({}, evt));
      gameCanvas.dispatchEvent(up);
    } catch (e) {}
  }

  function refocusGame() {
    setTimeout(() => {
      const ok = focusCanvas();
      if (!ok) clickCanvasFallback();
    }, 5);
  }

  const controls = panel.querySelectorAll("input, button, label, select, textarea");
  controls.forEach(el => {
    el.addEventListener("click", refocusGame, { passive: true });
    el.addEventListener("change", refocusGame, { passive: true });
    el.addEventListener("mouseup", refocusGame, { passive: true });
    el.addEventListener("blur", refocusGame, { passive: true });
  });

  const backdropEl = document.getElementById("backdrop");
  if (backdropEl) {
    backdropEl.addEventListener("transitionend", () => {
      if (!backdropEl.classList.contains("visible")) refocusGame();
    });
  }
})();


 //kill toast notif uh
 (function () {
  const killKey = "mm_lifetime_kills";
  let lastKills = parseInt(localStorage.getItem(killKey) || "0");

  let container = document.getElementById("kill-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "kill-toast-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      left: "75px",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      zIndex: "12",
    });
    document.body.appendChild(container);
  }

  function showKillToast(name, count) {
    const killtoast = document.createElement("div");
    Object.assign(killtoast.style, {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 14px 14px 14px",
      borderRadius: "8px",
      background: "rgba(0,0,0,0.3)",
      border: "1px solid #555555",
      color: "rgba(255,255,255,1)",
      fontWeight: "600",
      backdropFilter: "blur(1px)",
      opacity: "0",
      filter: "blur(2px)",
      transform: "translateY(40px)",
      transition: "all 0.4s ease",
      overflow: "hidden",
      position: "relative",

    });


    killtoast.innerHTML = `
     <svg fill="#FFFFFF" stroke="#FFFFFF" viewBox="0 0 24 24" width="20" height="20" style="display:inline-block;vertical-align:middle"><path d="M21 11h-1.07A8 8 0 0 0 13 4.07V3a1 1 0 0 0-2 0v1.07A8 8 0 0 0 4.07 11H3a1 1 0 0 0 0 2h1.07A8 8 0 0 0 11 19.93V21a1 1 0 0 0 2 0v-1.07A8 8 0 0 0 19.93 13H21a1 1 0 0 0 0-2Zm-4 2h.91A6 6 0 0 1 13 17.91V17a1 1 0 0 0-2 0v.91A6 6 0 0 1 6.09 13H7a1 1 0 0 0 0-2h-.91A6 6 0 0 1 11 6.09V7a1 1 0 0 0 2 0v-.91A6 6 0 0 1 17.91 11H17a1 1 0 0 0 0 2Zm-5-2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z"/></svg>
     <span style="font-weight:600;">Kill #${count}</span>
    `;

  //kill toast removal system lmao
  if (killtoast._dismissed) return;

    killtoast.addEventListener("mousedown", () => {
      killtoast.style.transform = "scale(0.95) translateY(16px)";
      killtoast.style.background = "rgba(0,0,0,0.5)";
    });

    killtoast.addEventListener("mouseenter", () => {
      killtoast.style.transform = "scale(1.05) translateY(-3px)";
      killtoast.style.background = "rgba(0,0,0,0.4)";
      killtoast.style.boxShadow = "0 0px 8px rgba(0,0,0,0.5)";
      killtoast.style.color = "rgba(255,255,255,1)";
      killtoast.style.cursor = "pointer";
    });

    killtoast.addEventListener("mouseleave", () => {
      killtoast.style.transform = "scale(1) translateY(3px)";
      killtoast.style.background = "rgba(0,0,0,0.3)";
      killtoast.style.boxShadow = "0 0px 8px rgba(0,0,0,0)";
      killtoast.style.color = "rgba(255,255,255,0.8)";
    });

    killtoast.addEventListener("mousedown", () => {
      if (killtoast._dismissed) return;
    killtoast._dismissed = true;

  killtoast.style.opacity = "0";
  killtoast.style.filter = "blur(4px)";
  killtoast.style.transform = "scale(0.5) translateY(75px)";

  setTimeout(() => {
    killtoast.remove();
  }, 200);
});


    const killprogress = document.createElement("div");
    Object.assign(killprogress.style, {
      position: "absolute",
      bottom: "0",
      left: "0",
      height: "3px",
      width: "100%",
      background: "rgba(255,255,255,0.75)",
      backdropfilter: "blur(20px)",
      transformOrigin: "left center",
      transition: "transform 5s linear",
      transform: "scaleX(1)",
    });
    killtoast.appendChild(killprogress);

    container.appendChild(killtoast);
    requestAnimationFrame(() => {
      killtoast.style.opacity = "1";
      killtoast.style.filter = "blur(0px)";
      killtoast.style.transform = "translateY(0)";
      killprogress.style.transform = "scaleX(0)";
    });

     killtoast.getBoundingClientRect();

    setTimeout(() => {
      killtoast.style.opacity = "0";
      killtoast.style.transform = "scale(0.5) translateY(80px)";
      killtoast.style.filter = "blur(4px)";
      setTimeout(() => killtoast.remove(), 400);
    }, 5000);
  }

    setInterval(() => {
    const currentKills = parseInt(localStorage.getItem(killKey) || "0");
    if (currentKills > lastKills) {
      killaudio.currentTime = 0;
      playUIAudio(killaudio);
      const diff = currentKills - lastKills;
      for (let i = 0; i < diff; i++) {
        showKillToast("", lastKills + i + 1);
      }
      lastKills = currentKills;
    }
  }, 500);
})();


//Wavy panel line thing idk I thought this'd look cooler than it actually does
const topoCanvas = document.createElement("canvas");
topoCanvas.id = "topoBackground";
Object.assign(topoCanvas.style, {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  zIndex: "54",
  pointerEvents: "none",
  opacity: "0",
  transition: "opacity 0.3s ease",
});

document.body.insertBefore(topoCanvas, backdrop);

  const tctx = topoCanvas.getContext("2d");
  function resizeCanvas() {
    topoCanvas.width = window.innerWidth;
    topoCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let t = 0;
  let targetOpacity = 0;

  function drawWaveBackground() {
    tctx.clearRect(0, 0, topoCanvas.width, topoCanvas.height);

    if (
    backdrop.classList.contains("visible") &&
    document.body.classList.contains("wave-switch-mode")
  ) {
    targetOpacity = 0.2;
    const rows = 15;
    const spacing = topoCanvas.height / rows;

    for (let i = 0; i < rows; i++) {
      const y = i * spacing + Math.sin(t + i * 0.5) * 10;
      tctx.beginPath();
      tctx.moveTo(0, y);
      for (let x = 0; x <= topoCanvas.width; x += 20) {
        const offset = Math.sin((x * 0.02) + t + i) * 8;
        tctx.lineTo(x, y + offset);
      }
      tctx.strokeStyle = "rgba(255,255,255,0.15)";
      tctx.lineWidth = 1;
      tctx.stroke();
    }

    t += 0.03;
  } else {
    targetOpacity = 0;
  }



const currentOpacity = parseFloat(topoCanvas.style.opacity);
  topoCanvas.style.opacity = (currentOpacity + (targetOpacity - currentOpacity) * 0.1).toFixed(2);

  requestAnimationFrame(drawWaveBackground);
  }
  drawWaveBackground();


const confettiCanvas = document.createElement("canvas");
confettiCanvas.style.position = "fixed";
confettiCanvas.style.top = "0";
confettiCanvas.style.left = "0";
confettiCanvas.style.width = "100%";
confettiCanvas.style.height = "100%";
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.style.zIndex = "52";
document.body.appendChild(confettiCanvas);
const cctx = confettiCanvas.getContext("2d");

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);

let confettiParticles = [];

function createConfetti(x, y, width, count = 30) {
  for (let i = 0; i < count; i++) {

    const px = x + Math.random() * width;
    confettiParticles.push({
      x: px,
      y: y,
      width: Math.random() * 8 + 4,
      height: Math.random() * 4 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: -(Math.random() * 0.2 + 1),
      gravity: 0.1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      decay: Math.random() * 0.02 + 0.02
    });
  }
}

function drawConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];

    p.velocityY += p.gravity;
    p.x += p.velocityX;
    p.y += p.velocityY;
    p.rotation += p.rotationSpeed;
    p.opacity -= p.decay;

    if (p.opacity <= 0 || p.y > confettiCanvas.height) {
      confettiParticles.splice(i, 1);
      continue;
    }

    cctx.save();
    cctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    cctx.rotate((p.rotation * Math.PI) / 180);
    cctx.fillStyle = p.color.replace(")", `, ${p.opacity})`).replace("rgb", "rgba");
    cctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    cctx.restore();
  }

  requestAnimationFrame(drawConfetti);
}
drawConfetti();

const watermark = document.querySelector(".watermark");
if (watermark) {
  watermark.addEventListener("click", (e) => {
    const rect = watermark.getBoundingClientRect();
    createConfetti(rect.left, rect.top, rect.width, 100);
  });
}

const sessionKillAchievements = [
  { id: "Kills_1_1_session", amount: 1, unlocked: false },
  { id: "Kills_10_1_session", amount: 10, unlocked: false },
  { id: "Kills_25_1_session", amount: 25, unlocked: false },
  { id: "Kills_50_1_session", amount: 50, unlocked: false },
  { id: "Kills_100_1_session", amount: 100, unlocked: false },
];

const lifetimeKillAchievements = [
  { id: "Kills_2500_lifetime", amount: 5000, unlocked: false },
  { id: "Kills_5000_lifetime", amount: 5000, unlocked: false },
  { id: "Kills_10000_lifetime", amount: 10000, unlocked: false },
];


  //Achievements things
  function checkAchievements() {
  const achievements = [

    //Duration based achievements
    { id: "play_1_hour", condition: () => window.totalSeconds >= 3601 },
    { id: "play_5_hours", condition: () => window.totalSeconds >= 18001 },
    { id: "play_10_hours", condition: () => window.totalSeconds >= 36001 },

    //Kill based achievements
    { id: "Kills_1_1_session", condition: () => window._mmSessionKills && window._mmSessionKills.sessionKills >= 1 },
    { id: "Kills_10_1_session", condition: () => window._mmSessionKills && window._mmSessionKills.sessionKills >= 10 },
    { id: "Kills_25_1_session", condition: () => window._mmSessionKills && window._mmSessionKills.sessionKills >= 25 },
    { id: "Kills_50_1_session", condition: () => window._mmSessionKills && window._mmSessionKills.sessionKills >= 50 },
    { id: "Kills_100_1_session", condition: () => window._mmSessionKills && window._mmSessionKills.sessionKills >= 100 },
    { id: "Kills_2500_lifetime", condition: () => window._mm_lifetime_kills >= 2500 },
    { id: "Kills_5000_lifetime", condition: () => window._mm_lifetime_kills >= 5000 },
    { id: "Kills_10000_lifetime", condition: () => window._mm_lifetime_kills >= 10000 },
  ];

  achievements.forEach(a => {
    const key = `ach_${a.id}`;
    if (!localStorage.getItem(key) && a.condition()) {
      localStorage.setItem(key, "true");
      showAchievementToast(a.id);
      achievementAudio.currentTime = 0;
      playUIAudio(achievementAudio);
    }
  });
}

 (function () {
  const killkey = "A::8abd923027114f9e_1";
  const lifetime_kills = "mm_lifetime_kills";

  if (window._mmLifetimeTracker) return;
  window._mmLifetimeTracker = true;

  let lastGameKills = parseInt(localStorage.getItem(killkey) || "0", 10);

  if (localStorage.getItem(lifetime_kills) === null) {
    localStorage.setItem(lifetime_kills, "0");
  }

  window._mm_lifetime_kills = parseInt(
    localStorage.getItem(lifetime_kills),
    10
  );

  function updateLifetimeKills() {
    const currentGameKills = parseInt(
      localStorage.getItem(killkey) || "0",
      10
    );

    if (currentGameKills > lastGameKills) {
      const diff = currentGameKills - lastGameKills;
      window._mm_lifetime_kills += diff;
    }
    else if (currentGameKills < lastGameKills) {
      window._mm_lifetime_kills += currentGameKills;
    }

    lastGameKills = currentGameKills;

    localStorage.setItem(
      lifetime_kills,
      window._mm_lifetime_kills.toString()
    );
  }

  setInterval(updateLifetimeKills, 100);
})();


function showAchievementToast(id) {
  const achievementNames = {
    play_1_hour: "Take a Break",
    play_5_hours: "Unemployed",
    play_10_hours: "No Life",
    Kills_1_1_session: "Getting Started",
    Kills_10_1_session: "Tank Destroyer",
    Kills_25_1_session: "Tank Obliterator",
    Kills_50_1_session: "Tank Annihilator",
    Kills_100_1_session: "Massacre",
    Kills_2500_lifetime: "Bro",
    Kills_5000_lifetime: "The Chosen Tank",
    Kills_10000_lifetime: "The Worst Achievement",

  };

  const name = achievementNames[id] || "Achievement Unlocked";

  let container = document.getElementById("achievement-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "achievement-toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      zIndex: "12",
    });
    document.body.appendChild(container);
  }

  const ach_toast = document.createElement("div");
  Object.assign(ach_toast.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px 14px 14px",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(1px)",
    border: "1px solid #555555",
    color: "rgba(255,255,255,1)",
    fontWeight: "600",
    opacity: "0",
    filter: "blur(4px)",
    transform: "translateY(-20px)",
    transition: "all 0.4s ease",
    overflow: "hidden",
    position: "relative",
  });

   ach_toast.innerHTML = `
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="stroke:#FFFFFF; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;">
       <path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" />
     </svg>
     <span style="font-weight:600;">Achievement Unlocked: ${name}</span>
   `;

    //achievement toast removal system lmao
    if (ach_toast._dismissed) return;

    ach_toast.addEventListener("mousedown", () => {
      ach_toast.style.transform = "scale(0.97) translateY(-16px)";
      ach_toast.style.background = "rgba(0,0,0,0.5)";
      ach_toast.style.filter = "blur(2px)";
    });

    ach_toast.addEventListener("mouseenter", () => {
      ach_toast.style.transform = "scale(1.02) translateY(3px)";
      ach_toast.style.background = "rgba(0,0,0,0.4)";
      ach_toast.style.boxShadow = "0 0px 8px rgba(0,0,0,0.5)";
      ach_toast.style.color = "rgba(255,255,255,1)";
      ach_toast.style.cursor = "pointer";
    });

    ach_toast.addEventListener("mouseleave", () => {
      ach_toast.style.transform = "scale(1) translateY(-3px)";
      ach_toast.style.background = "rgba(0,0,0,0.3)";
      ach_toast.style.boxShadow = "0 0px 8px rgba(0,0,0,0)";
      ach_toast.style.color = "rgba(255,255,255,0.8)";
    });

    ach_toast.addEventListener("mousedown", () => {
      if (ach_toast._dismissed) return;
    ach_toast._dismissed = true;

  ach_toast.style.opacity = "0";
  ach_toast.style.transform = "scale(0.8) translateY(-50px)";

  setTimeout(() => {
    ach_toast.remove();
  }, 200);
});

  const progress = document.createElement("div");
  Object.assign(progress.style, {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "3px",
    width: "100%",
    background: "rgba(255,255,255,0.75)",
    transformOrigin: "left center",
    transition: "transform 7.5s linear",
    transform: "scaleX(1)",
  });

  ach_toast.appendChild(progress);
  container.appendChild(ach_toast);

  setTimeout(() => {
    ach_toast.style.opacity = "1";
    ach_toast.style.transform = "translateY(0)";
    progress.style.transform = "scaleX(0)";
    ach_toast.style.filter = "blur(0px)";
  }, 50);

  setTimeout(() => {
    ach_toast.style.opacity = "0";
    ach_toast.style.transform = "translateY(-40px) scale(0.8)";
    ach_toast.style.filter = "blur(4px)";
    setTimeout(() => ach_toast.remove(), 400);
  }, 7500);
}

(function() {
  const killKey = "A::8abd923027114f9e_1";
  const lifetimeKey = "mm_lifetime_kills";

  // Only initialize once
  if (!window._mmSessionKills) {
    window._mmSessionKills = {
      startKills: parseInt(localStorage.getItem(killKey) || "0"),
      sessionKills: 0,
      lastValue: parseInt(localStorage.getItem(killKey) || "0")
    };
  }

  if (!localStorage.getItem(lifetimeKey)) localStorage.setItem(lifetimeKey, "0");

  function updateKills() {
    let current = parseInt(localStorage.getItem(killKey) || "0");
    let lifetime = parseInt(localStorage.getItem(lifetimeKey) || "0");

    if (current > window._mmSessionKills.lastValue) {
      const diff = current - window._mmSessionKills.lastValue;
      window._mmSessionKills.sessionKills += diff;
      lifetime += diff;
      localStorage.setItem(lifetimeKey, lifetime);
    }

    window._mmSessionKills.lastValue = current;

    const lifetimeEl = document.getElementById("lifetime-kills");
    const sessionEl = document.getElementById("session-kills");

    if (lifetimeEl) lifetimeEl.textContent = lifetime;
    if (sessionEl) sessionEl.textContent = window._mmSessionKills.sessionKills;
  }

  setInterval(updateKills, 50);

  const achievementsListContainer = document.getElementById("achievements-list");
  if (achievementsListContainer) {
    new MutationObserver(() => updateKills())
      .observe(achievementsListContainer.parentNode, { childList: true, subtree: true });
  }
})();

//Reset kill key if it hits 1000
(function() {
  const killKey = "A::8abd923027114f9e_1";

  setInterval(() => {
    let current = parseInt(localStorage.getItem(killKey) || "0", 10);

    if (current >= 1000) {
      localStorage.setItem(killKey, "0");
    }
  }, 100);
})();


   let totalSeconds = 0;

   setInterval(() => {
     totalSeconds++;
     checkAchievements();
   }, 1000);

   //achievements end

  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);
  document.head.appendChild(style);

  function toggleDisplay(elementId) {
    const element = document.getElementById(elementId);
    if (element.classList.contains("visible")) {
    element.classList.remove("visible");
    } else {
    element.classList.add("visible");
  }
}

  function setActiveTab(activeTab) {
    [visual_tab, auto_upgrades_tab, settings_tab, update_tab, info_tab, credits_tab, ach_tab, close_tab].forEach((tab) =>
      tab.classList.remove("active"),
    );
    activeTab.classList.add("active");
  }

  let X, Y, x, y;
  let Z = false;
  let radius = [];

document.addEventListener("keydown", function (e) {
  const pressedKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const savedKey = toggleKey.length === 1 ? toggleKey.toLowerCase() : toggleKey;

  if (pressedKey === savedKey) {
    e.preventDefault();
    toggleDisplay("backdrop");
  }
});


  document.onmousemove = (event) => {
    x = event.clientX;
    y = event.clientY;
  };

  const canvas = document.createElement("canvas");
  canvas.style.zIndex = "11";
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.pointerEvents = "none";

  function getRadius() {
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    radius = [
      window.innerWidth * 0.17681239669,
      window.innerWidth * 0.06545454545,
      window.innerWidth * 0.16751239669,
      window.innerWidth * 0.36,
    ];
  }

  getRadius();
  window.addEventListener("resize", getRadius);

  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let lastRun = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (view_line_toggle.checked) {
      ctx.beginPath();
      ctx.moveTo(X, Y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 50;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(X, Y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.stroke();
    }

    if (view_circle_toggle.checked) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";

      ctx.beginPath();
      ctx.arc(X, Y, radius[3], 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, radius[1], 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, Z ? radius[0] : radius[2], 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Functions that run at a ~2 second cooldown
    if (Date.now() - lastRun >= 500) {
     if (auto_respawn_toggle.checked) {
      const respawnName = localStorage.getItem("mm_respawn_name");
     input.execute(`game_spawn ${respawnName}`);
}


      if (au_autoset_toggle.checked) {
        input.execute("game_stats_build " + au_input.value);
      }

      lastRun = Date.now();
    }

    requestAnimationFrame(draw);
  }
  draw();



  // Load saved toggle states
  auto_respawn_toggle.checked =
    localStorage.getItem("mm_auto_respawn") === "true";
  view_line_toggle.checked =
      localStorage.getItem("mm_view_line") === "true";
  view_circle_toggle.checked =
    localStorage.getItem("mm_view_circle") === "true";
  au_autoset_toggle.checked =
    localStorage.getItem("mm_keep_build_on_spawn") === "true";


  // Load + execute toggle states
  render_collisions_toggle.checked =
    localStorage.getItem("mm_render_collisions") === "true";

  render_dm_toggle.checked =
    localStorage.getItem("mm_render_dm") === "true";

  render_fps_toggle.checked =
      localStorage.getItem("mm_render_fps") === "true";

  render_ping_toggle.checked =
      localStorage.getItem("mm_ren_latency") === "true";

  render_rhw_toggle.checked =
    localStorage.getItem("mm_render_raw_health") === "true";

  hide_ui_toggle.checked =
      localStorage.getItem("mm_hide_ui") === "true";

  render_collisions_toggle.checked =
    localStorage.getItem("mm_render_collisions") === "true";

  render_dbi_toggle.checked =
    localStorage.getItem("mm_render_debug_info") === "true";

  predict_movement_toggle.checked =
    localStorage.getItem("mm_predict_movement") === "true";

  // Add event listeners to save toggle states
  auto_respawn_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_auto_respawn", auto_respawn_toggle.checked);
  });
  view_line_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_view_line", view_line_toggle.checked);
  });
  view_circle_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_view_circle", view_circle_toggle.checked);
  });
  predict_movement_toggle.addEventListener("change", function () {
    localStorage.setItem("mm_predict_movement", predict_movement_toggle.checked);
  });


  visual_tab.click();

// dragging logic for the panel
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

panel.style.position = "absolute";

panel.addEventListener("mousedown", (e) => {
  if (!document.body.classList.contains("UI-switch-mode")) return;
  isDragging = true;
  dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
  dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
  backdrop.style.transform = "";
  panel.style.transform = "";
});

  document.addEventListener("mousemove", function(e) {
    if (!isDragging) return;

    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;

    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    panel.style.left = newX + "px";
    panel.style.top = newY + "px";
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

  setTimeout(() => {
    if (input) {
      if (render_collisions_toggle.checked) {
        input.execute("ren_debug_collisions true");
      }
      if (render_fps_toggle.checked) {
        input.execute("ren_fps true");
      }
      if (render_rhw_toggle.checked) {
        input.execute("ren_raw_health_values true");
      }
      if (render_dm_toggle.checked) {
        input.execute("ren_dark_mode true");
      }
      if (render_ping_toggle.checked) {
        input.execute("ren_latency true");
      }
      if (hide_ui_toggle.checked) {
        input.execute("ren_ui false");
      }
      if (render_dbi_toggle.checked) {
        input.execute("ren_debug_info true");
      }
      if (predict_movement_toggle.checked) {
        input.execute("net_predict_movement true");
      }
    }
  }, 300);
})();
