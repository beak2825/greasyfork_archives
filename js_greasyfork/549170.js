// ==UserScript==
// @name         Grepolis Noob Helper
// @namespace    https://greasyfork.org/en/users/1513995-tudor-buha
// @version      1.0
// @description  Troop saver + hotkeys (A=load+send, D=cancel, S=load, Alt+S=save) + attack timer coloring for Grepolis
// @author       Tudor
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @icon         https://www.grepolis.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/549170/Grepolis%20Noob%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549170/Grepolis%20Noob%20Helper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.__dbg_loaded) return;
  window.__dbg_loaded = true;

  const KEY = "dbgTroops";

  const W = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
  const $ = W.jQuery || window.jQuery;

  function getWin() {
    const $all = $('.attack_support_window');
    const $vis = $all.filter(':visible');
    return $vis.length ? $vis.first() : $all.first();
  }

  function getInputs($root) {
    return $root.find('input[type="text"], input[type="number"]');
  }

  function snapshot($root) {
    const data = {};
    getInputs($root).each((i, el) => {
      data[i] = el.value;
    });
    console.log("SNAPSHOT:", data);
    return data;
  }

  function apply($root, snap) {
    console.log("APPLY:", snap);
    getInputs($root).each((i, el) => {
      if (snap[i]) {
        el.value = snap[i];
        $(el).trigger('keyup').trigger('change');
      }
    });
  }

  function enhance() {
    const $w = getWin();
    if (!$w.length) return;

    if (!$('#dbg_buttons').length) {
     $w.find('.button_wrapper').first().before(`
  <div id="dbg_buttons" style="margin:.3em 0;">
    <button type="button" id="dbg_save">SAVE</button>
    <button type="button" id="dbg_load">LOAD</button>
  </div>`);

    }

    $("#dbg_save").off().on("click", () => {
      const snap = snapshot($w);
      GM_setValue(KEY, snap);
      console.log("SAVED:", snap);
    });

    $("#dbg_load").off().on("click", () => {
      const snap = GM_getValue(KEY, null);
      console.log("LOADED:", snap);
      if (snap) apply($w, snap);
    });
  }

  // Always try to enhance when ajax completes (Grepolis loads windows this way)
  $(document).ajaxComplete(() => setTimeout(enhance, 200));

  // Also hotkeys
  W.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 's' || e.key === 'S')) {
      const $w = getWin();
      if ($w.length) {
        const snap = snapshot($w);
        GM_setValue(KEY, snap);
        console.log("SAVED (Alt+S):", snap);
      }
    }
    if (e.key === 's' || e.key === 'S') {
      const snap = GM_getValue(KEY, null);
      console.log("LOADED (Alt+S):", snap);
      const $w = getWin();
      if ($w.length && snap) apply($w, snap);
    }
  });

})();
(function () {
  'use strict';

  const SAVE_KEY = 'dbgTroops'; // same as “Grepolis Troop Saver”
  const W = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
  const $ = W.jQuery || window.jQuery;

  function getAttackWindow() {
    const $vis = $('.attack_support_window:visible');
    return $vis.length ? $vis.first() : $('.attack_support_window').first();
  }

  function getInputs($root) {
    return $root.find('input[type="text"], input[type="number"]');
  }

  function applySnapshotToWindow($w, snap) {
    if (!snap) return false;
    let wroteAny = false;
    getInputs($w).each((i, el) => {
      if (Object.prototype.hasOwnProperty.call(snap, i)) {
        el.value = snap[i];
        $(el).trigger('input').trigger('keyup').trigger('change');
        wroteAny = true;
      }
    });
    return wroteAny;
  }

function clickSendInWindow($w) {
  if (!$w || !$w.length) return false;

  // new format (Attack = button_new)
  let $sendBtn = $w.find('.send_units_form .button_new:visible .caption').filter(function () {
    const text = $(this).text().trim().toLowerCase();
    return text.includes("attack") || text.includes("atac");
  }).first();

  if ($sendBtn.length) {
    $sendBtn.closest('.button_new').trigger('click');
    return true;
  }

  // alternative format (Support = <a class="button"><span class="middle">Sprijiniți</span></a>)
  let $supportBtn = $w.find('a.button:visible .middle').filter(function () {
    const text = $(this).text().trim().toLowerCase();
    return text.includes("sprij") || text.includes("support");
  }).first();

  if ($supportBtn.length) {
    $supportBtn.closest('a.button').trigger('click');
    return true;
  }

  // fallback after ids
  const tryIds = ['#btn_attack_town', '#btn_support_town'];
  for (const id of tryIds) {
    const $b = $w.find(id);
    if ($b.length) { $b.trigger('click'); return true; }
  }

  return false;
}




  function cancelLatestCommand() {
    try {
      const $activity = $('.activity.commands');
      $activity.trigger('mouseenter');
      setTimeout(() => {
        const $list = $('#toolbar_activity_commands_list .js-dropdown-item-list');
        if (!$list.length) return;
        const $firstItem = $list.children().first();
        if (!$firstItem.length) return;

        let $cancel =
          $firstItem.find('a.cancel:visible, a.delete:visible, .icon.js-cancel:visible, [class*="cancel"]:visible, [title*="Cancel"]:visible, [title*="Anule"]:visible, [title*="Cancelar"]:visible').first();

        if ($cancel.length) {
          $cancel.trigger('click');
        }
      }, 80);
    } catch (e) {}
  }

  function quickSend() {
    const snap = GM_getValue(SAVE_KEY, null);
    const $w = getAttackWindow();
    if (!$w || !$w.length) return;
    applySnapshotToWindow($w, snap);
    clickSendInWindow($w);
  }

  // --- hotkeys ---
  W.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;

    if (!e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        quickSend();
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        cancelLatestCommand();
      }
    }
  });

  setTimeout(() => {
    console.log('[QuickHotkeys] Ready. J = refill+send, L = cancel latest.');
  }, 1200);
})();
/* -------------------- storage -------------------- */
const SLOTS_KEY = "settingsColorSlots";
const LEGACY_SINGLE = "settingsTiming";
const LEGACY_MULTI  = "settingsTimings";

const DEFAULT_SLOTS = [
  { time: "", color: "#00ff66" },
  { time: "", color: "#00c0ff" },
  { time: "", color: "#ffae00" }
];

function parseTimes(str) {
  if (!str) return [];
  return String(str)
    .split(/\r?\n|,|;/)
    .map(s => s.trim())
    .filter(s => /^\d{2}:\d{2}:\d{2}$/.test(s));
}
function padTo3(arr) {
  const out = (arr || []).slice(0, 3).map(s => ({
    time: (s && typeof s.time === "string") ? s.time : "",
    color: (s && typeof s.color === "string" && /^#([0-9a-f]{6})$/i.test(s.color)) ? s.color : "#00ff66"
  }));
  while (out.length < 3) out.push({ time: "", color: "#00ff66" });
  return out;
}
function loadSlots() {
  let slots = GM_getValue(SLOTS_KEY, null);
  if (Array.isArray(slots)) return padTo3(slots);

  const legacyMulti = GM_getValue(LEGACY_MULTI, "");
  if (legacyMulti) {
    const times = parseTimes(legacyMulti).slice(0, 3);
    slots = DEFAULT_SLOTS.map((d, i) => ({ time: times[i] || "", color: d.color }));
    GM_setValue(SLOTS_KEY, slots);
    return slots;
  }
  const legacySingle = GM_getValue(LEGACY_SINGLE, "");
  if (/^\d{2}:\d{2}:\d{2}$/.test(legacySingle)) {
    slots = DEFAULT_SLOTS.slice();
    slots[0].time = legacySingle;
    GM_setValue(SLOTS_KEY, slots);
    return slots;
  }
  GM_setValue(SLOTS_KEY, DEFAULT_SLOTS);
  return DEFAULT_SLOTS.slice();
}
function saveSlots(slots) {
  const fixed = padTo3(slots);
  GM_setValue(SLOTS_KEY, fixed);
  GM_setValue(LEGACY_SINGLE, fixed[0]?.time || "");
  GM_setValue(LEGACY_MULTI, fixed.map(s => s.time).filter(Boolean).join("\n"));
}

/* -------------------- utils -------------------- */
function getArrivalText(ts) {
  const dt = Timestamp.toDate(ts);
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  const ss = String(dt.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/* -------------------- init -------------------- */
let SLOTS = loadSlots();

documentLoaded();
loadCSS();
observerAjax();
attachScript("moveFrame", moveFrame.toString());
moveFrame = new moveFrame();

function paintCommands() {
  // don’t skip if no slots, always paint
  const activeSlots = SLOTS.filter(s => /^\d{2}:\d{2}:\d{2}$/.test(s.time));

  let listElements;
  for (const obj of document.getElementsByClassName("js-dropdown-item-list")) {
    if (obj.childElementCount !== 0 && /movement/.test(obj.children[0].id)) {
      listElements = obj;
      break;
    }
  }
  if (!listElements || !listElements.children) return;

  for (const child of listElements.children) {
    if (child.children[0].children[1].children[2] != null) continue;

    const arrival = getArrivalText(child.dataset.timestamp);

    const indicator = document.createElement("div");
    indicator.className = "indicatorAankomst";

    const p = document.createElement("p");
    p.textContent = arrival;
    p.style.fontSize = "1.7em"; // font size if u wanna change it do it from here :D
    p.style.fontWeight = "bold";
    indicator.appendChild(p);

    const statusBox = document.createElement("div");
    indicator.appendChild(statusBox);

    child.children[0].children[1].appendChild(indicator);

    // default = red
    let matched = false;

    for (const slot of activeSlots) {
      if (slot.time === arrival) {
        p.style.color = slot.color;
        statusBox.setAttribute("style", `width:1em;background:${slot.color};margin-left:0.3em;`);
        matched = true;
        break;
      }
    }

    if (!matched) {
      p.style.color = "red";
      statusBox.setAttribute("style", "width:1em;background:red;margin-left:0.3em;");
    }
  }
}


function documentLoaded() {
  const interval = setInterval(function () {
    if (document.readyState === "complete" && $(".tb_activities.toolbar_activities .middle")[0]) {
      clearInterval(interval);
      addSettingsButton();

      const commandsObserver = new MutationObserver(paintCommands);
      commandsObserver.observe(
        document.getElementById("toolbar_activity_commands_list"),
        { attributes: true, subtree: true }
      );
    }
  }, 100);
}


/* -------------------- settings UI -------------------- */
function addSettingsButton() {
  const icon = document.createElement("div");
  icon.id = "GMESetupLink";
  icon.className = "btn_settings circle_button";

  const img = document.createElement("div");
  img.style.margin = "6px 0px 0px 5px";
  img.style.width = "22px";
  img.style.height = "22px";
  img.style.backgroundSize = "100%";

  icon.style.top = "12px";
  icon.style.right = "485px";
  icon.style.zIndex = "10000";
  icon.appendChild(img);

  document.getElementById("ui_box").appendChild(icon);
  $("#GMESetupLink").off().on("click", openSettingsMenu);
}

function openSettingsMenu() {
  let exists = false, titleObj = null;

  for (const obj of document.getElementsByClassName("ui-dialog-title")) {
    if (obj.innerHTML === "Attack Timer Settings") { exists = true; titleObj = obj; }
  }
  if (!exists) wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "Timer Settings");
  wnd.setContent("");

  for (const obj of document.getElementsByClassName("ui-dialog-title")) {
    if (obj.innerHTML === "Timer Settings") { titleObj = obj; }
  }

  wnd.setHeight(document.body.scrollHeight / 2 + 120);
  wnd.setTitle("Attack Timer Settings");

  const frame = titleObj.parentElement.parentElement.children[1].children[4];
  frame.innerHTML = "";

  const html = document.createElement("html");
  const body = document.createElement("div");
  const head = document.createElement("head");

  const h3 = document.createElement("h3");
  h3.innerHTML = "Configure Target Time(s):";
  body.appendChild(h3);

  const hint = document.createElement("div");
  hint.style.opacity = "0.8";
  hint.style.margin = "0 0 8px 0";
  hint.style.fontSize = "12px";
  hint.textContent = "Set up to 3 times. Each row: HH:MM:SS + color.";
  body.appendChild(hint);

  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = "140px 120px";
  container.style.gap = "8px 12px";
  container.style.alignItems = "center";
  container.style.width = "420px";

  for (let i = 0; i < 3; i++) {
    const slot = SLOTS[i] || { time: "", color: "#00ff66" };

    const timeInput = document.createElement("input");
    timeInput.type = "text";
    timeInput.placeholder = "HH:MM:SS";
    timeInput.value = slot.time || "";
    timeInput.id = `slot_time_${i}`;
    timeInput.style.width = "130px";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = /^#([0-9a-f]{6})$/i.test(slot.color) ? slot.color : "#00ff66";
    colorInput.id = `slot_color_${i}`;
    colorInput.style.width = "120px";
    colorInput.style.height = "26px";
    colorInput.style.padding = "0";

    container.appendChild(timeInput);
    container.appendChild(colorInput);
  }

  body.appendChild(container);

  const saveButton = createButton("settings_reload", "Save");
  saveButton.style.position = "absolute";
  saveButton.style.bottom = "0";
  saveButton.style.right = "0";
  body.appendChild(saveButton);

  html.appendChild(head);
  html.appendChild(body);
  frame.appendChild(html);

  $("#settings_reload").off().on("click", function () {
    const newSlots = [];
    for (let i = 0; i < 3; i++) {
      const t = (document.getElementById(`slot_time_${i}`)?.value || "").trim();
      const c = (document.getElementById(`slot_color_${i}`)?.value || "#00ff66").trim();
      newSlots.push({
        time: /^\d{2}:\d{2}:\d{2}$/.test(t) ? t : "",
        color: /^#([0-9a-f]{6})$/i.test(c) ? c : "#00ff66"
      });
    }
    SLOTS = padTo3(newSlots);
    saveSlots(SLOTS);
    window.location.reload();
  });
}

function createButton(id, text) {
  const el = document.createElement("div");
  el.className = "button_new";
  el.id = id;
  el.style.margin = "2px";
  el.appendChild(Object.assign(document.createElement("div"), { className: "left" }));
  el.appendChild(Object.assign(document.createElement("div"), { className: "right" }));
  const caption = document.createElement("div");
  caption.className = "caption js-caption";
  caption.innerHTML = text + '<div class="effect js-effect"></div>';
  el.appendChild(caption);
  return el;
}

/* -------------------- styles -------------------- */
function loadCSS() {
  const css = document.createElement("style");
  css.textContent = `
    .sandy-box .item.command { min-height: 70px !important; height: auto !important; }
    .indicatorAankomst { display:flex; align-items:center; gap:4px; line-height:1; }
    .indicatorAankomst p { margin:0; line-height:1; font-weight:bold; }
    .tb_activities.toolbar_activities .item .middle { overflow: visible !important; }
  `;
  document.head.appendChild(css);
}

/* -------------------- frame helper --------------------*/
function attachScript(f, A) {
  const c = document.createElement("script");
  c.type = "text/javascript";
  c.id = f;
  c.textContent = A;
  document.body.appendChild(c);
}

/* -------------------- ajax observer -------------------- */
function observerAjax() {
  $(document).ajaxComplete(function (e, xhr, opt) {
    try {
      const url = opt.url.split("?"); let action = "";
      if (url[1] && url[1].split(/&/)[1]) {
        action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
      }
      switch (action) {
        case "/town_info/attack":
        case "/town_info/support":
          break;
      }
    } catch (e) {}
  });
}
