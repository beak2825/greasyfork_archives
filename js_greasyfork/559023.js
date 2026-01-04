// ==UserScript==
// @name         EzyBot - Major Cineplex
// @namespace    EzyBot - Major Cineplex
// @version      1.0
// @description  Automatically book available seats on Major Cineplex.
// @author       EzyBot - อีซี่บอท
// @icon         https://ezyisezy.github.io/easy/major.png
// @match        https://www.majorcineplex.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @resource     SWEETALERT2_CSS https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559023/EzyBot%20-%20Major%20Cineplex.user.js
// @updateURL https://update.greasyfork.org/scripts/559023/EzyBot%20-%20Major%20Cineplex.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_deleteValue("lastVersionCheck");
  const LOCAL_KEY = "ezybot_majorgroup",
    globalbot = ["ezybot", "major", GM_info?.script?.version];
  async function waitForBody() {
    document.body ||
      (await new Promise((e) => {
        const t = new MutationObserver(() => {
          document.body && (t.disconnect(), e());
        });
        t.observe(document.documentElement, { childList: !0, subtree: !0 });
      }));
  }
  async function waitForSwal() {
    await waitForBody();
    let e = 0;
    for (; void 0 === window.Swal && e++ < 100;)
      await new Promise((e) => setTimeout(e, 50));
  }
  function xorDecodeBase64(e, t = globalbot[0]) {
    const n = atob(e);
    let i = "";
    for (let e = 0; e < n.length; e++)
      i += String.fromCharCode(n.charCodeAt(e) ^ t.charCodeAt(e % t.length));
    return i;
  }
  const ENCODED_BASE = "DQ4NEhxOSlUYFxscSx8DGw0bEQ4RTBgbFxEcEBxaAR8PTQ==",
    BASE_URL = xorDecodeBase64(ENCODED_BASE),
    AUTH_URL = BASE_URL + "auth/" + globalbot[1],
    CONFIG_URL = BASE_URL + "config/" + globalbot[1];
  async function checkVersion() {
    const e = globalbot[2],
      t = new Date(Date.now() + 252e5).toISOString().slice(0, 10);
    if (GM_getValue("lastVersionCheck", "") !== t)
      try {
        const n = await fetch(CONFIG_URL),
          i = await n.json();
        i.version &&
          i.version !== e &&
          (await swalAlert(
            `📦 เวอร์ชัน ${i.version} พร้อมให้อัปเดตแล้ว`,
            "info",
            `คุณกำลังใช้เวอร์ชัน ${e}<br>กรุณาอัปเดตสคริปต์เป็นเวอร์ชันล่าสุด`
          )),
          GM_setValue("lastVersionCheck", t);
      } catch (e) { }
  }
  async function verifyLicense(e, t) {
    try {
      const n = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, id: t }),
      });
      return await n.json();
    } catch (e) {
      return { status: "error" };
    }
  }
  async function requireLogin() {
    const e = GM_getValue("majorAuth", null);
    if (e && e.email && e.id) {
      const t = await verifyLicense(e.email, e.id);
      if ("valid" === t.status) return !0;
      if ("expired" === t.status)
        return (
          GM_deleteValue("majorAuth"),
          await swalAlert(
            "🔒 สิทธิ์ใช้งานหมดอายุแล้ว",
            "error",
            "กรุณาติดต่อเพจ EzyBot - อีซี่บอท"
          ),
          !1
        );
      GM_deleteValue("majorAuth");
    }
    const t = await swalPrompt("📧 อีเมลเข้าสู่ระบบ", "", e?.email || "");
    if (!t) return !1;
    const n = await swalPrompt("🔑 รหัสผ่าน", "", e?.id || "");
    if (!n) return !1;
    const i = await verifyLicense(t, n);
    return "valid" === i.status
      ? (GM_setValue("majorAuth", { email: t, id: n }),
        await swalAlert("✅ เข้าสู่ระบบสำเร็จ", "success", "", 1e3),
        !0)
      : ("expired" === i.status
        ? await swalAlert("🔒 สิทธิ์ใช้งานหมดอายุแล้ว", "error", "")
        : await swalAlert("❌ ข้อมูลไม่ถูกต้อง", "error", ""),
        !1);
  }
  function getTodayDate() {
    const e = new Date();
    return `${String(e.getDate()).padStart(2, "0")}/${String(
      e.getMonth() + 1
    ).padStart(2, "0")}/${e.getFullYear()}`;
  }
  const config = loadHybridConfig();
  async function swalPrompt(e, t = "", n = "", i = null) {
    return (
      await waitForSwal(),
      new Promise((o) => {
        const a = { style: "text-align: center;" };
        i && (a.maxlength = String(i)),
          Swal.fire({
            title: e,
            input: "text",
            inputPlaceholder: t,
            inputValue: n,
            confirmButtonText: "ตกลง",
            showCancelButton: !0,
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#6b2932",
            buttonsStyling: !0,
            allowOutsideClick: !1,
            customClass: { confirmButton: "swal2-default-outline" },
            backdrop: !0,
            heightAuto: !1,
            inputAttributes: a,
            inputValidator: (e) => (e.trim() ? null : "จำเป็นต้องกรอกข้อมูลนี้"),
            didOpen: () => {
              const t = Swal.getInput();
              t &&
                e.includes("เบอร์โทร") &&
                ((t.placeholder = "0xxxxxxxxx"),
                  (t.maxLength = 10),
                  t.addEventListener("paste", (e) => {
                    e.preventDefault();
                    const t = (e.clipboardData || window.clipboardData)
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    document.execCommand("insertText", !1, t);
                  }),
                  t.addEventListener("input", () => {
                    t.value = t.value.replace(/\D/g, "").slice(0, 10);
                  }));
            },
          }).then((e) => {
            e.isDismissed ? o(null) : o(e.value?.trim() || "");
          });
      })
    );
  }
  async function swalConfirm(e, t = "") {
    return (
      await waitForSwal(),
      new Promise((n) => {
        Swal.fire({
          title: e,
          text: t,
          icon: "question",
          showCancelButton: !0,
          confirmButtonText: "ใช่",
          cancelButtonText: "ไม่ใช่",
          confirmButtonColor: "#6b2932",
          buttonsStyling: !0,
          allowOutsideClick: !1,
          customClass: { confirmButton: "swal2-default-outline" },
          backdrop: !0,
          heightAuto: !1,
        }).then((e) => n(e.isConfirmed));
      })
    );
  }
  async function swalAlert(e, t = "success", n = "", i = null) {
    await waitForSwal();
    const o = {
      title: e,
      icon: t,
      allowOutsideClick: !1,
      backdrop: !0,
      heightAuto: !1,
      confirmButtonColor: "#6b2932",
      buttonsStyling: !0,
      customClass: { confirmButton: "swal2-default-outline" },
    };
    i
      ? await Swal.fire({
        ...o,
        html: n,
        timer: i,
        showConfirmButton: !1,
        timerProgressBar: !0,
      })
      : await Swal.fire({ ...o, html: n, confirmButtonText: "ตกลง" });
  }
  async function initMenus() {
    let e = !1,
      t = "❌ ยังไม่ได้เข้าสู่ระบบ";
    const n = GM_getValue("majorAuth", null);
    if (n && n.email && n.id)
      try {
        const i = await verifyLicense(n.email, n.id);
        "valid" === i.status
          ? ((e = !0),
            GM_setValue("majorAuth", { ...n, exp: i.exp }),
            "unlimited" === i.exp
              ? (t = "สิทธิ์ใช้งานถาวร")
              : i.exp && (t = `🕒 ทดลองใช้งานถึง ${i.exp}`))
          : "expired" === i.status &&
          ((t = "หมดอายุแล้ว"), GM_deleteValue("majorAuth"));
      } catch (e) { }
    if (!e) {
      if (await requireLogin()) {
        e = !0;
        const n = GM_getValue("majorAuth", null);
        t =
          "unlimited" === n?.exp
            ? "สิทธิ์ใช้งานถาวร"
            : n?.exp
              ? `🕒 ทดลองใช้งานถึง ${n.exp}`
              : "🕒 ทดลองใช้งานถึง (รอตรวจสอบ)";
      } else t = "❌ ยังไม่ได้เข้าสู่ระบบ";
    }
    renderStatusPanel(e, t);
  }
  function loadHybridConfig() {
    let e;
    try {
      const t = localStorage.getItem(LOCAL_KEY);
      t && (e = JSON.parse(t));
    } catch { }
    return (
      e ||
      ((e = {
        startTime: GM_getValue("startTime", ""),
        movietitle: GM_getValue("movietitle", ""),
        cinema: GM_getValue("cinema", ""),
        showdate: GM_getValue("showdate", ""),
        theatre: GM_getValue("theatre", ""),
        showtime: GM_getValue("showtime", ""),
        numTickets: GM_getValue("numTickets", 1),
        selectAdjacent: GM_getValue("selectAdjacent", !1),
        selectCouple: GM_getValue("selectCouple", !0),
        inputEmail: GM_getValue("inputEmail", ""),
        inputMobile: GM_getValue("inputMobile", ""),
        isRunning: GM_getValue("isRunning", !0),
      }),
        localStorage.setItem(LOCAL_KEY, JSON.stringify(e))),
      e
    );
  }
  function saveHybridConfig(e) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(e));
    for (const [t, n] of Object.entries(e)) GM_setValue(t, n);
  }
  function validateConfig(e) {
    const t = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
    if (!e.movietitle.trim()) return "กรุณากรอกชื่อภาพยนตร์";
    if (!e.cinema.trim()) return "กรุณากรอกชื่อสาขา";
    if (!e.theatre.trim()) return "กรุณากรอกชื่อ/หมายเลขโรง";
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(e.showdate))
      return "รูปแบบวันฉายไม่ถูกต้อง (dd/mm/yyyy)";
    {
      const [t, n, i] = e.showdate.split("/").map(Number);
      if (n < 1 || n > 12 || t < 1 || t > 31)
        return "วันหรือเดือนในวันฉายไม่ถูกต้อง";
    }
    const n = t.exec(e.showtime);
    if (!n) return "รูปแบบเวลาฉายไม่ถูกต้อง (hh:mm หรือ hh:mm:ss)";
    {
      const e = Number(n[1]),
        t = Number(n[2]);
      if (e < 0 || e > 23 || t < 0 || t > 59)
        return "เวลาฉายต้องอยู่ระหว่าง 00:00 ถึง 23:59";
    }
    const i = t.exec(e.startTime);
    if (!i) return "รูปแบบเวลาเริ่มไม่ถูกต้อง (hh:mm หรือ hh:mm:ss)";
    {
      const e = Number(i[1]),
        t = Number(i[2]);
      if (e < 0 || e > 23 || t < 0 || t > 59)
        return "เวลาเริ่มต้องอยู่ระหว่าง 00:00:00 ถึง 23:59:59";
    }
    if (
      e.inputEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.inputEmail.trim())
    )
      return "รูปแบบอีเมลไม่ถูกต้อง (เช่น name@example.com)";
    if (e.inputMobile.trim() && !/^0\d{9}$/.test(e.inputMobile.trim()))
      return "หมายเลขโทรศัพท์ไม่ถูกต้อง (ต้องมี 10 หลักและขึ้นต้นด้วย 0)";
    const o = parseInt(e.numTickets);
    return isNaN(o) || o <= 0 ? "จำนวนที่นั่งไม่ถูกต้อง" : null;
  }
  function getConfigFromInputs(e) {
    const t = {
      movietitle: "#cfg_movie",
      cinema: "#cfg_cinema",
      showdate: "#cfg_showdate",
      theatre: "#cfg_theatre",
      showtime: "#cfg_showtime",
      numTickets: "#cfg_numTickets",
      selectAdjacent: "#cfg_adjacent",
      selectCouple: "#cfg_couple",
      inputEmail: "#cfg_email",
      inputMobile: "#cfg_mobile",
      startTime: "#cfg_starttime",
      isRunning: "#botToggle",
    },
      n = {};
    for (const [i, o] of Object.entries(t)) {
      const t = e.querySelector(o);
      t &&
        ("checkbox" === t.type
          ? (n[i] = t.checked)
          : "number" === t.type
            ? (n[i] = parseInt(t.value, 10) || 0)
            : (n[i] = (t.value || "").trim()));
    }
    const i = [
      ["movietitle", "string"],
      ["cinema", "string"],
      ["showdate", "string"],
      ["theatre", "string"],
      ["showtime", "string"],
      ["numTickets", "number"],
      ["inputEmail", "string"],
      ["inputMobile", "string"],
      ["startTime", "string"],
    ];
    for (const [e, t] of i) typeof n[e] !== t && (n[e] = "number" === t ? 0 : "");
    return n;
  }
  function fillInputsFromConfig(e, t) {
    const n = (t, n) => {
      const i = e.querySelector(t);
      i && (i.value = n ?? "");
    },
      i = (t, n) => {
        const i = e.querySelector(t);
        i && (i.checked = !!n);
      };
    n("#cfg_movie", t.movietitle),
      n("#cfg_cinema", t.cinema),
      n("#cfg_showdate", t.showdate),
      n("#cfg_theatre", t.theatre),
      n("#cfg_showtime", t.showtime),
      n("#cfg_numTickets", t.numTickets),
      i("#cfg_adjacent", t.selectAdjacent),
      i("#cfg_couple", t.selectCouple),
      n("#cfg_email", t.inputEmail),
      n("#cfg_mobile", t.inputMobile),
      n("#cfg_starttime", t.startTime),
      i("#botToggle", t.isRunning);
  }
  async function renderStatusPanel(e, t) {
    const n = loadHybridConfig();
    document.body || (await waitForBody());
    const i = GM_getValue("panelCollapsed", !1);
    document.getElementById("ezybot-status-panel")?.remove();
    const o = `\n  <div id="ezybot-status-panel" class="${i ? "collapsed" : ""
      }">\n    <div class="ezybot-header">\n      <div><span>🤖 EzyBot - Major Cineplex</span></div>\n      <div class="ezybot-license">${t}</div>\n    </div>\n  </div>`;
    document.body.insertAdjacentHTML("beforeend", o);
    const a = document.getElementById("ezybot-status-panel");
    if (
      (GM_addStyle(
        '\n        #kbank_dialog { background: none !important; }\n  #kbank_dialog iframe {\n    background: rgba(255, 255, 255, 0.75) !important;\n    border-radius: 1rem !important;\n  }\n  #swal2-title, .swal2-actions {\n    user-select: none !important;\n    -webkit-user-select: none !important;\n  }\n\n  @keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n    .navbar-header {\n    z-index: 99999 !important;\n    }\n\n  #ezybot-status-panel {\n    position: fixed;\n    right: 10px;\n    top: 110px;\n    width: 270px;\n    background: rgba(0,0,0,0.7);\n    color: #fff;\n    font-family: "DB Gin Siam X", sans-serif;\n    font-size: 17px;\n    padding: 10px;\n    border-radius: 10px;\n    z-index: 9999;\n    box-shadow: 0 0 10px rgba(0,0,0,0.4);\n    backdrop-filter: blur(6px);\n    transition: opacity .35s ease, transform 0.5s ease-out;\n    will-change: opacity, transform;\n    opacity: 1;\n    max-height: 90vh;\n    overflow: hidden;\n    animation: fadeIn .15s ease-in-out;\n  }\n\n\n  /* ✨ Only content collapses — header remains visible */\n  #ezybot-status-panel.collapsed .ezybot-content {\n    max-height: 0 !important;\n    opacity: 0;\n    margin-top: 0;\n    overflow: hidden;\n    transition: max-height 0.3s ease-in, opacity 0.3s ease-in;\n  }\n\n  #ezybot-status-panel .ezybot-content {\n    overflow: auto;\n    max-height: 75dvh;\n    opacity: 1;\n    transition: max-height 0.35s ease-out, opacity 0.35s ease-out, margin-top 0.35s ease-out;\n    scrollbar-width: none;\n  -ms-overflow-style: none;\n  }\n\n  .ezybot-content ::-webkit-scrollbar {\n    width: 0px;\n    background: transparent; /* make scrollbar transparent */\n  }\n\n  /* HEADER — always visible even when collapsed */\n  .ezybot-header {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n    font-weight: 700;\n    cursor: pointer;\n    position: relative;\n    border-radius: 6px;\n    padding: 4px 8px;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n\n  /* 🟢 Compact Toggle Switch (40x24) */\n  .switch {\n    position: relative;\n    display: inline-block;\n    width: 40px;\n    height: 24px;\n    margin-left: 6px;\n    margin-bottom: 0px;\n  }\n\n  .switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n  }\n\n  .slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #888;\n    transition: 0.4s;\n    border-radius: 24px;\n  }\n\n  .slider:before {\n    position: absolute;\n    content: "";\n    height: 16px;\n    width: 16px;\n    left: 4px;\n    bottom: 4px;\n    background-color: white;\n    transition: 0.4s;\n    border-radius: 50%;\n  }\n\n  input:checked + .slider {\n    background-color: #ff283c;\n  }\n\n  input:checked + .slider:before {\n    transform: translateX(16px);\n  }\n\n  .slider.round {\n    border-radius: 24px;\n  }\n\n  .slider.round:before {\n    border-radius: 50%;\n  }\n\n\n  .ezybot-license {\n    font-size: 13px;\n    color: #ecb63e;\n    text-align: center;\n  }\n\n  .ezybot-section {\n    margin-bottom: 8px;\n    display: flex;\n    flex-direction: column;\n    gap: 5px;\n  }\n  .ezybot-section h2 {\n    margin: 6px 0 4px;\n    font-size: 18px;\n    font-weight: 700;\n    border-bottom: 1px solid rgba(255,255,255,0.25);\n    user-select: none;\n    -webkit-user-select: none;\n  }\n\n  .field {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin: 3px 0;\n  }\n\n\n  .field input {\n  outline-offset: -1px !important;\n  margin-right: 1px;\n}\n.field input:focus, .field input:focus-visible, .field input:focus-within {\noutline: 1px solid #d2aa5a !important;\n}\n  .field label {\n    flex: 1;\n    text-align: left;\n    padding-right: 4px;\n    white-space: nowrap;.field input.invalid\n    margin-bottom: 0 !important;\n    color: #d2aa5a;\n    font-weight: 600;\n    flex: 30%;\n    margin-bottom: 0 !important;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n    .field input[type="text"] {\n      text-transform: uppercase;\n\n    }\n  .field input[type="text"],\n  .field input[type="number"],\n  .field input[type="email"] {\n    flex: 1.2;\n    min-width: 100px;\n    border: none;\n    border-radius: 5px;\n    padding: 2px 5px;\n    font-size: 15px;\n    flex: 70%;\n  }\n\n  .field input::-webkit-outer-spin-button,\n.field input::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0; /* <-- Apparently some margin are still there even though it\'s hidden */\n}\n\n.field input[type=number] {\n    -moz-appearance:textfield; /* Firefox */\n}\n\n  .field.dual-checks {\n  display: flex;\n  align-items: center;\n  margin-top: 4px;\n}\n\n.field.dual-checks label {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  white-space: nowrap;\n  color: #fff;\n  font-weight: 600;\n}\n\n.field.dual-checks input[type="checkbox"] {\n  margin-right: 5px;\n  transform: scale(1.2);\n  accent-color: #d2aa5a;\n}\n\n.field.dual-checks label:has(input:checked) {\n  color: #d2aa5a;\n}\n  .ezybot-buttons {\n    text-align: center;\n    margin-top: 10px;\n  }\n  .ezybot-buttons button {\n    background: #c5a25e;\n    color: #000;\n    border: none;\n    padding: 5px 10px;\n    border-radius: 6px;\n    cursor: pointer;\n    font-size: 16px;\n    margin: 0 5px;\n    transition: opacity 0.25s;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n  .ezybot-buttons button:hover {\n    opacity: 0.8;\n  }\n  .field  input {\n    background: rgba(255, 255, 255, 0.2);\n    color: #fff;\n  }\n  .field  input.invalid {\n  outline: 1px solid #ff6666 !important;\n    transition: border-color 0.25s ease;\n\n}\n\n'
      ),
        !e || t.includes("ยังไม่ได้เข้าสู่ระบบ") || t.includes("หมดอายุ"))
    )
      return;
    a.querySelector(".ezybot-header > div").insertAdjacentHTML(
      "beforeend",
      '\n    <label class="switch"><input type="checkbox" id="botToggle"><span class="slider round"></span></label>\n  '
    );
    const r = `\n    <div class="ezybot-content">\n      <div class="ezybot-section">\n        <h2>#1 รอบภาพยนตร์</h2>\n        <div class="field"><label>เรื่อง</label><input id="cfg_movie" type="text" placeholder="ภาษาเดียวกับหน้าเว็บ"></div>\n        <div class="field"><label>สาขา</label><input id="cfg_cinema" type="text" placeholder="ภาษาเดียวกับหน้าเว็บ"></div>\n        <div class="field"><label>วันฉาย</label><input id="cfg_showdate" type="text" placeholder="dd/mm/yyyy"></div>\n        <div class="field"><label>โรง</label><input id="cfg_theatre" type="text" placeholder="เช่น PAVALAI, GLS, 4DX, 1"></div>\n        <div class="field"><label>รอบฉาย</label><input id="cfg_showtime" type="text" placeholder="hh:mm"></div>\n      </div>\n      <div class="ezybot-section">\n        <h2>#2 เลือกที่นั่ง</h2>\n        <div class="field"><label>จำนวน</label><input id="cfg_numTickets" type="number" min="1" style="width:60px"></div>\n        <div class="field dual-checks">\n          <label><input id="cfg_adjacent" type="checkbox"> ที่นั่งติดกัน</label>\n          <label><input id="cfg_couple" type="checkbox"> โซฟา/ที่นั่งคู่</label>\n        </div>\n      </div>\n      <div class="ezybot-section">\n        <h2>#3 ผู้ซื้อตั๋ว</h2>\n        <div class="field"><label>อีเมล</label><input id="cfg_email" type="email" placeholder="เช่น name@example.com"></div>\n        <div class="field"><label>เบอร์โทร</label><input id="cfg_mobile" type="text" maxlength="10" placeholder="08xxxxxxxx"></div>\n      </div>\n      <div class="ezybot-section">\n        <h2>#4 เวลาเริ่ม</h2>\n        <div class="field"><label>เวลาเริ่ม</label><input id="cfg_starttime" type="text" placeholder="${new Date().toLocaleTimeString(
      "en-GB",
      { hour12: !1 }
    )}"></div>\n      </div>\n      <div class="ezybot-buttons" style="text-align:center;margin-top:10px;">\n        <button id="btnSave" style="margin-right:8px;">💾 บันทึกข้อมูล</button>\n        <button id="btnReset">♻️ รีเซ็ตข้อมูล</button>\n      </div>\n    </div>`;
    a.insertAdjacentHTML("beforeend", r);
    const l = a.querySelector("#botToggle");
    "boolean" == typeof n.isRunning || (n.isRunning = !1),
      (l.checked = n.isRunning),
      fillInputsFromConfig(a, n),
      saveHybridConfig(n);
    const s = {
      "#cfg_showdate": (e) => {
        const t = e.trim().replace(/[^\d/]/g, "");
        if (/^\d{3,4}$/.test(t)) {
          return `${3 === t.length ? "0" + t.slice(0, 1) : t.slice(0, 2)
            }/${t.slice(-2)}/${new Date().getFullYear()}`;
        }
        const n = t
          .split("/")
          .map((e) => e.trim())
          .filter(Boolean);
        if (n.length < 2) return e;
        let [i, o, a = new Date().getFullYear()] = n.map(Number);
        return (
          a < 100 && (a = 2e3 + a),
          isNaN(i) || isNaN(o) || isNaN(a)
            ? e
            : ((i = Math.min(Math.max(1, i), 31)),
              (o = Math.min(Math.max(1, o), 12)),
              `${String(i).padStart(2, "0")}/${String(o).padStart(
                2,
                "0"
              )}/${a}`)
        );
      },
      "#cfg_showtime": (e) => {
        let t = e.trim().replace(/\./g, ":");
        if (/^\d{3,4}$/.test(t)) {
          const e = 3 === t.length ? "0" + t.slice(0, 1) : t.slice(0, 2),
            n = t.slice(-2);
          t = `${e}:${n}`;
        }
        const n = /^(\d{1,2}):(\d{1,2})$/.exec(t);
        if (n) {
          let e = Number(n[1]),
            t = Number(n[2]);
          return (
            24 === e && 0 === t && (e = 0),
            (e = Math.min(Math.max(0, e), 23)),
            (t = Math.min(Math.max(0, t), 59)),
            `${String(e).padStart(2, "0")}:${String(t).padStart(2, "0")}`
          );
        }
        return t;
      },
      "#cfg_starttime": (e) => {
        let t = e.trim().replace(/\./g, ":");
        if (/^\d{3,4}$/.test(t)) {
          const e = 3 === t.length ? "0" + t.slice(0, 1) : t.slice(0, 2),
            n = t.slice(-2);
          t = `${e}:${n}:00`;
        }
        const n = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(t);
        if (n) {
          let e = Number(n[1]),
            t = Number(n[2]),
            i = Number(n[3] || 0);
          return (
            24 === e && 0 === t && 0 === i && (e = 0),
            (e = Math.min(Math.max(0, e), 23)),
            (t = Math.min(Math.max(0, t), 59)),
            (i = Math.min(Math.max(0, i), 59)),
            `${String(e).padStart(2, "0")}:${String(t).padStart(
              2,
              "0"
            )}:${String(i).padStart(2, "0")}`
          );
        }
        return t;
      },
    },
      c = a.querySelector("#cfg_mobile");
    if (c) {
      const e = (e) => e.replace(/\D/g, "").slice(0, 10);
      c.addEventListener("input", () => (c.value = e(c.value))),
        c.addEventListener("paste", (t) => {
          t.preventDefault(),
            document.execCommand(
              "insertText",
              !1,
              e(t.clipboardData.getData("text"))
            );
        });
    }
    Object.entries(s).forEach(([e, t]) => {
      const n = a.querySelector(e);
      if (!n) return;
      const i = () => {
        const e = n.value.trim(),
          i = t(e);
        e &&
          i !== e &&
          ((n.value = i),
            (n.style.transition = "background-color .3s"),
            (n.style.backgroundColor = "rgba(210,170,90,0.25)"),
            setTimeout(
              () => (n.style.backgroundColor = "rgba(255,255,255,0.2)"),
              400
            ),
            n.dispatchEvent(new Event("input", { bubbles: !0 })));
      };
      n.addEventListener("blur", i),
        n.addEventListener("paste", (e) => {
          e.preventDefault(),
            document.execCommand(
              "insertText",
              !1,
              t(e.clipboardData.getData("text"))
            ),
            setTimeout(i, 20);
        });
    });
    a.querySelector(".ezybot-header").addEventListener("click", (e) => {
      if (!e.target.closest(".switch")) {
        const e = a.classList.toggle("collapsed");
        GM_setValue("panelCollapsed", e);
      }
    }),
      a.querySelector("#btnSave").addEventListener("click", async () => {
        const e = getConfigFromInputs(a);
        a.querySelectorAll("input").forEach((e) => e.classList.remove("invalid"));
        const t = validateConfig(e);
        if (t) {
          swalAlert("ข้อผิดพลาด", "error", t);
          const e = {
            ภาพยนตร์: "#cfg_movie",
            สาขา: "#cfg_cinema",
            วันฉาย: "#cfg_showdate",
            โรง: "#cfg_theatre",
            เวลาฉาย: "#cfg_showtime",
            เวลาเริ่ม: "#cfg_starttime",
            อีเมล: "#cfg_email",
            โทรศัพท์: "#cfg_mobile",
          };
          for (const [n, i] of Object.entries(e))
            t.includes(n) && a.querySelector(i)?.classList.add("invalid");
        } else
          saveHybridConfig(e),
            swalAlert(
              "✅ บันทึกข้อมูลแล้ว",
              "success",
              "ข้อมูลถูกบันทึกเรียบร้อย",
              1200
            );
      }),
      a.querySelector("#btnReset").addEventListener("click", async () => {
        if (!(await swalConfirm("รีเซ็ตข้อมูลทั้งหมดหรือไม่?"))) return;
        localStorage.removeItem(LOCAL_KEY),
          [
            "startTime",
            "movietitle",
            "cinema",
            "showdate",
            "theatre",
            "showtime",
            "numTickets",
            "selectAdjacent",
            "selectCouple",
            "inputEmail",
            "inputMobile",
            "isRunning",
          ].forEach((e) => GM_deleteValue(e));
        const e = (() => {
          a
            .querySelectorAll("input[type='text'], input[type='email']")
            .forEach((e) => (e.value = "")),
            a
              .querySelectorAll("input[type='checkbox']")
              .forEach((e) => (e.checked = !1));
          const e = a.querySelector("#cfg_numTickets");
          e && (e.value = 1);
          const t = a.querySelector("#cfg_starttime");
          if (t) {
            const e = new Date().toLocaleTimeString("en-GB", { hour12: !1 });
            return (t.value = t.placeholder = e), e;
          }
          return null;
        })();
        a.querySelectorAll("input").forEach((e) => e.classList.remove("invalid"));
        saveHybridConfig({
          movietitle: "",
          cinema: "",
          showdate: "",
          theatre: "",
          showtime: "",
          numTickets: 1,
          selectAdjacent: !1,
          selectCouple: !1,
          inputEmail: "",
          inputMobile: "",
          startTime: e,
          isRunning: !1,
        }),
          (l.checked = !1),
          window.dispatchEvent(new CustomEvent("EZYBOT_STOP")),
          await swalAlert("รีเซ็ตข้อมูลเรียบร้อยแล้ว", "success", "", 1e3);
      }),
      l.addEventListener("change", async (e) => {
        const t = getConfigFromInputs(a);
        if (
          (a
            .querySelectorAll("input")
            .forEach((e) => e.classList.remove("invalid")),
            e.target.checked)
        ) {
          const n = validateConfig({ ...t, inputEmail: "", inputMobile: "" });
          if (n && !/อีเมล|เบอร์/.test(n)) {
            (e.target.checked = !1),
              swalAlert("ไม่สามารถเริ่มบอทได้", "error", n);
            const t = {
              ภาพยนตร์: "#cfg_movie",
              สาขา: "#cfg_cinema",
              วันฉาย: "#cfg_showdate",
              โรง: "#cfg_theatre",
              เวลาฉาย: "#cfg_showtime",
              เวลาเริ่ม: "#cfg_starttime",
              อีเมล: "#cfg_email",
              โทรศัพท์: "#cfg_mobile",
            };
            for (const [e, i] of Object.entries(t))
              n.includes(e) && a.querySelector(i)?.classList.add("invalid");
            return;
          }
          (t.isRunning = !0),
            saveHybridConfig(t),
            Object.assign(config, t),
            window.dispatchEvent(new CustomEvent("EZYBOT_START"));
        } else
          (t.isRunning = !1),
            saveHybridConfig(t),
            Object.assign(config, t),
            window.dispatchEvent(new CustomEvent("EZYBOT_STOP"));
      });
    const u = {
      "#cfg_movie": (e) => e.trim().length > 0,
      "#cfg_cinema": (e) => e.trim().length > 0,
      "#cfg_showdate": (e) => /^\d{2}\/\d{2}\/\d{4}$/.test(e.trim()),
      "#cfg_theatre": (e) => e.trim().length > 0,
      "#cfg_showtime": (e) => {
        const t = e.trim(),
          n = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(t);
        if (!n) return !1;
        const i = Number(n[1]),
          o = Number(n[2]);
        return i >= 0 && i <= 23 && o >= 0 && o <= 59;
      },
      "#cfg_starttime": (e) => {
        const t = e.trim(),
          n = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(t);
        if (!n) return !1;
        const i = Number(n[1]),
          o = Number(n[2]);
        return i >= 0 && i <= 23 && o >= 0 && o <= 59;
      },
      "#cfg_email": (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()),
      "#cfg_mobile": (e) => !e || /^0\d{9}$/.test(e.trim()),
      "#cfg_numTickets": (e) => parseInt(e) > 0,
    };
    Object.entries(u).forEach(([e, t]) => {
      const n = a.querySelector(e);
      n &&
        ["input", "blur"].forEach((e) =>
          n.addEventListener(e, () => n.classList.toggle("invalid", !t(n.value)))
        );
    });
  }
  initMenus();
  const TIMEOUT = 3e3;
  function getCurrentTimeString() {
    const e = new Date();
    return `${String(e.getHours()).padStart(2, "0")}:${String(
      e.getMinutes()
    ).padStart(2, "0")}:${String(e.getSeconds()).padStart(2, "0")}`;
  }
  function waitForStartTime() {
    return new Promise((e) => {
      if (!config.startTime) return;
      const t = () => {
        getCurrentTimeString() >= config.startTime
          ? e()
          : requestAnimationFrame(t);
      };
      t();
    });
  }
  async function handleCinemaSelection() {
    if (!config.cinema) return;
    const e = config.cinema.trim().toLowerCase(),
      t = e.split(/\s+/).filter(Boolean),
      n = e.includes("imax") || e.includes("ไอแมกซ์"),
      i = Array.from(
        document.querySelectorAll('.bcp-list a[href^="/cinema/"], .bcbl-branches')
      );
    if (!i.length) return;
    let o = { element: null, score: -1 };
    for (const a of i) {
      const i = (a.textContent || "").toLowerCase(),
        r = (a.getAttribute("href") || "").toLowerCase(),
        l = (a.dataset.branchTitle || "").toLowerCase(),
        s = l.length > 0 ? l : i.trim();
      if (t.every((e) => s.includes(e) || i.includes(e) || r.includes(e))) {
        if ((s.includes("imax") || s.includes("ไอแมกซ์")) && !n) continue;
        let t = 0;
        (t =
          s === e
            ? 1e3
            : s.startsWith(e)
              ? 500 + (e.length / s.length) * 100
              : 100 - s.length / 50 + 100),
          t > o.score && ((o.score = t), (o.element = a));
      }
    }
    const a = o.element;
    if (a) {
      const e = new URL(a.getAttribute("href") || a.href, location.origin).href;
      a.click(),
        setTimeout(() => {
          const t = a.href || a.getAttribute("href");
          (!document.querySelector("#seatPlan") && location.href.endsWith(t)) ||
            (location.href = e);
        }, 800);
    }
  }
  function normalizeDate(e) {
    const t = e.split(/[\/\-]/).map((e) => e.trim());
    if (3 !== t.length) return null;
    let n = parseInt(t[0], 10),
      i = parseInt(t[1], 10),
      o = parseInt(t[2], 10);
    o < 100 && (o += 2e3);
    const a = String(n).padStart(2, "0");
    return `${o}-${String(i).padStart(2, "0")}-${a}`;
  }
  function normalizeTime(e) {
    return e.replace(".", ":").replace(/^\d(?=\:)/, (e) => "0" + e);
  }
  function sleep(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  async function waitUntil(e, { timeout: t = 15e3, interval: n = 100 } = {}) {
    const i = Date.now();
    for (; ;) {
      const o = e();
      if (o) return o;
      if (Date.now() - i > t) return null;
      await sleep(n);
    }
  }
  function containsText(e, t) {
    return e && e.textContent.toLowerCase().includes(t.toLowerCase());
  }
  function theatreMatches(e, t) {
    const n = e.toLowerCase(),
      i = t.toLowerCase().trim();
    if (!i) return !1;
    if (/^\d+$/.test(i)) {
      return (
        !!new RegExp(`theatre\\s*${i}\\b`).test(n) ||
        new RegExp(`\\b${i}\\b`).test(n)
      );
    }
    return n.includes(i);
  }
  async function clickShowDate() {
    if (
      !(await waitUntil(() => document.querySelector(".bsw-showdate"), {
        timeout: 15e3,
      }))
    )
      return !1;
    const e = normalizeDate(config.showdate);
    if (!e) return !1;
    const t = document.querySelector(
      `.bsw-showdate a.datelink[data-date="${e}"]`
    );
    return !!t && (await sleep(100), t.click(), !0);
  }
  async function findMovieCard() {
    const e = await waitUntil(
      () => {
        const e = document.querySelectorAll(".bscbbm-cover-title");
        for (const t of e) if (containsText(t, config.movietitle)) return t;
        return null;
      },
      { timeout: 3e3 }
    );
    if (!e) return null;
    const t = e.closest(".bscbb-movie");
    return t
      ? (t.scrollIntoView({ behavior: "auto", block: "center" }),
        await sleep(50),
        t)
      : null;
  }
  async function findTheatreBlock(e) {
    const t = await waitUntil(
      () => {
        const t = e.querySelectorAll(".bscbbm-theatre-list");
        for (const e of t) {
          const t = e.querySelector(".bscbbm-theatre-list-name");
          if (t && theatreMatches(t.textContent, config.theatre)) return e;
        }
        return null;
      },
      { timeout: 3e3 }
    );
    if (!t) return null;
    t.querySelector(".bscbbm-theatre-list-name");
    return t;
  }
  async function clickShowtime(e) {
    const t = normalizeTime(config.showtime),
      n = await waitUntil(
        () => {
          const n = e.querySelectorAll(".bscbbm-theatre-list-time a");
          for (const e of n)
            if (normalizeTime(e.textContent.trim()) === t) return e;
          return null;
        },
        { timeout: 3e3 }
      );
    if (!n) return !1;
    let i = !1;
    function o() {
      if (i) return !1;
      const e = document.querySelector(".swal2-popup.swal2-modal.swal2-show"),
        t = e ? e.querySelector("#swal2-title") : null;
      if (!e || !t) return !1;
      const n = t.textContent.trim();
      if (n.includes("ยังไม่เปิดจำหน่ายตั๋ว") || /not\s+yet\s+open/i.test(n)) {
        i = !0;
        const t = e.querySelector("button.swal2-confirm");
        return t && t.click(), location.reload(), !0;
      }
      return !1;
    }
    const a = new MutationObserver(() => o());
    a.observe(document.body, { childList: !0, subtree: !0 }), n.click(), o();
    const r = Date.now(),
      l = setInterval(() => {
        (i || o() || Date.now() - r > 6e3) && (clearInterval(l), a.disconnect());
      }, 100);
    return !0;
  }
  async function waitForSeatPlanEl() {
    const e = await waitUntil(() => document.querySelector("#seatPlan"), {
      timeout: 3e3,
    });
    return e;
  }
  function getRowName(e) {
    return e.getAttribute("data-row-name");
  }
  function getSeatNumber(e) {
    return parseInt(e.getAttribute("data-seat-id"), 10);
  }
  function isAvailable(e) {
    return (
      "nrs" === e.getAttribute("data-reserve") &&
      e.classList.contains("btn-default")
    );
  }
  function clickSeat(e) {
    e.click(), sleep(10);
  }
  function sortCenterOut(e) {
    if (!e.length) return [];
    const t = e.map(getSeatNumber),
      n = (Math.min(...t) + Math.max(...t)) / 2;
    return e.sort((e, t) => {
      const i = Math.abs(getSeatNumber(e) - n),
        o = Math.abs(getSeatNumber(t) - n);
      return i === o ? getSeatNumber(e) - getSeatNumber(t) : i - o;
    });
  }
  function findContiguousCenterOut(e, t, n) {
    if (e.length < t) return null;
    const i = Array.from(n.querySelectorAll("td.list-td")),
      o = [];
    let a = [],
      r = -1;
    new Map(e.map((e) => [getSeatNumber(e), e]));
    for (const e of i) {
      const t = e.querySelector("a.seat-movie");
      if (t && isAvailable(t)) {
        const e = getSeatNumber(t);
        -1 !== r && e !== r + 1 && (a.length && o.push(a), (a = [])),
          a.push(t),
          (r = e);
      } else
        "none" !== e.style.border ||
          t ||
          (a.length && (o.push(a), (a = []), (r = -1)));
    }
    a.length && o.push(a);
    const l = e.length
      ? (Math.min(...e.map(getSeatNumber)) +
        Math.max(...e.map(getSeatNumber))) /
      2
      : 0,
      s = [];
    for (const e of o) {
      if (e.length < t) continue;
      const n = e.map(getSeatNumber).sort((e, t) => e - t);
      for (let e = 0; e <= n.length - t; e++)
        if (n.slice(e, e + t).every((t, i) => t === n[e] + i)) {
          const i = (n[e] + n[e + t - 1]) / 2;
          s.push({ nums: n.slice(e, e + t), dist: Math.abs(i - l) });
        }
    }
    if (!s.length) return null;
    s.sort((e, t) => e.dist - t.dist);
    const c = s[0].nums;
    return e
      .filter((e) => c.includes(getSeatNumber(e)))
      .sort((e, t) => getSeatNumber(e) - getSeatNumber(t));
  }
  async function autoSelectSeats(e) {
    const t = Array.from(e.querySelectorAll("a.seat-movie")),
      n = {},
      i = {},
      o = [];
    for (const t of e.querySelectorAll("tr.tablerow")) {
      const e = t.querySelector("a.seat-movie");
      if (e) {
        const a = getRowName(e);
        (n[a] = []), (i[a] = t), o.push(a);
      }
    }
    for (const e of t) {
      const t = getRowName(e);
      n[t] && n[t].push(e);
    }
    if (!o.length) return void setTimeout(() => location.reload(), 1e3);
    const a = o.indexOf("VP");
    -1 !== a && (o.splice(a, 1), o.push("VP"));
    let r = config.numTickets,
      l = [],
      s = !1;
    for (const e of o) {
      let t = n[e] || [];
      const o = t.filter(
        (e) =>
          e.classList.contains("800e00") ||
          ("yes" === e.getAttribute("data-seat-ispackage") &&
            "pair" === e.getAttribute("data-seat-group-type"))
      ),
        a = t.filter((e) => !o.includes(e));
      if (config.selectCouple)
        if (config.selectCouple && 1 === config.numTickets) {
          if (o.length > 0) continue;
          t = a;
        } else
          config.selectCouple && config.numTickets >= 2 && (t = o.length ? o : a);
      else t = a;
      const c = t.filter((e) => isAvailable(e));
      if ((c.length && (s = !0), c.length < r)) continue;
      let u;
      if (config.selectCouple && config.numTickets >= 2 && o.includes(c[0])) {
        const e = Math.ceil(r / 2);
        u = sortCenterOut(c).slice(0, e);
        const t = new Set();
        for (const e of u)
          if (
            (r >= 2 && !t.has(e) && (clickSeat(e), t.add(e), l.push(e), (r -= 2)),
              r <= 0)
          )
            break;
        if (r <= 0) break;
      } else if (
        ((u =
          config.selectAdjacent && r > 1
            ? findContiguousCenterOut(c, r, i[e])
            : sortCenterOut(c).slice(0, r)),
          u && u.length === r)
      ) {
        const e = new Set();
        for (const t of u) e.has(t) || (clickSeat(t), e.add(t));
        l.push(...u), (r = 0);
        break;
      }
    }
    0 === r ? waitForBuyButton() : setTimeout(() => location.reload(), 1e3);
  }
  function waitForBuyButton() {
    const e = new MutationObserver(() => {
      if (
        document.querySelectorAll("a.seat-movie.btn-success").length >=
        config.numTickets
      ) {
        const t = document.querySelector("#buy.btn-showtime-buy");
        if (t && null !== t.offsetParent) {
          e.disconnect(), setTimeout(() => t.click(), 150);
          const n = config.inputEmail && "" !== config.inputEmail.trim(),
            i = config.inputMobile && "" !== config.inputMobile.trim();
          if (n && i) waitForUserInfo();
          else {
            const e = loadHybridConfig();
            (e.isRunning = !1), saveHybridConfig(e);
            const t = document.querySelector(
              "#ezybot-status-panel input[type='checkbox']"
            );
            t && (t.checked = !1),
              window.dispatchEvent(new CustomEvent("EZYBOT_STOP"));
          }
        }
      }
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class", "style"],
    });
  }
  async function waitForUserInfo() {
    const e = await waitUntil(() => document.querySelector("#user-info"), {
      timeout: 3e3,
    });
    if (!e) return;
    const t = e.querySelector('input[name="email"], .payment_input.email'),
      n = e.querySelector('input[name="phone"], .payment_input.phone');
    t &&
      ((t.value = config.inputEmail),
        t.dispatchEvent(new Event("input", { bubbles: !0 }))),
      n &&
      ((n.value = config.inputMobile),
        n.dispatchEvent(new Event("input", { bubbles: !0 })));
    const i = await waitUntil(() => document.querySelector("#kbankButton"), {
      timeout: 1e4,
    });
    if (!i) return;
    let o = !1;
    const a = unsafeWindow.console.log;
    const r = unsafeWindow.alert;
    function l() {
      try {
        setTimeout(() => {
          try {
            for (let e = 0; e < 9999; e++) clearInterval(e), clearTimeout(e);
            (window.onbeforeunload = null),
              (unsafeWindow.onbeforeunload = null),
              (location.href = location.href);
          } catch (e) {
            location.reload(!0);
          }
        }, 300);
      } catch (e) {
        location.reload(!0);
      }
    }
    try {
      unsafeWindow.console.log = function (...e) {
        try {
          a.apply(unsafeWindow.console, e);
        } catch { }
        o ||
          (e.some((e) => "string" == typeof e && e.includes("unpass")) &&
            ((o = !0), l()));
      };
    } catch { }
    try {
      unsafeWindow.alert = function (e) {
        if (!o) {
          if ("string" == typeof e && e.includes("ขออภัยค่ะ"))
            return (o = !0), void l();
          try {
            r(e);
          } catch { }
        }
      };
    } catch { }
    i.click(),
      setTimeout(() => {
        if (!o) {
          const e = loadHybridConfig();
          (e.isRunning = !1), saveHybridConfig(e);
          const t = document.querySelector(
            '#ezybot-status-panel input[type="checkbox"]'
          );
          t && (t.checked = !1),
            window.dispatchEvent(new CustomEvent("EZYBOT_STOP"));
        }
      }, 3e3);
  }
  async function autoNavigateMovieAndBranch() {
    await sleep(250);
    const e = await waitUntil(
      () => document.querySelector(".box-quick-bar-details"),
      { timeout: 8e3 }
    ),
      t = await waitUntil(() => document.querySelector(".box-quick-branches"), {
        timeout: 8e3,
      });
    if (!e || !t) return;
    const n = e.querySelectorAll("a.bqmlm-select");
    let i = null;
    for (const e of n) {
      if (
        (e.dataset.movieTitle || e.textContent || "")
          .trim()
          .toLowerCase()
          .includes(config.movietitle.toLowerCase())
      ) {
        i = e;
        break;
      }
    }
    if (!i) return;
    i.click();
    const o = await waitUntil(
      () => {
        const e = t.querySelectorAll("a.bcbl-branches");
        return e.length ? e : null;
      },
      { timeout: 8e3 }
    );
    if (!o) return;
    let a = { element: null, score: -1 };
    const r = config.cinema.trim().toLowerCase(),
      l = r.split(/\s+/).filter(Boolean),
      s = r.includes("imax") || r.includes("ไอแมกซ์");
    for (const e of o) {
      const t = (e.dataset.branchTitle || e.textContent || "")
        .replace(/\s+/g, " ")
        .normalize("NFC")
        .trim()
        .toLowerCase();
      if (l.every((e) => t.includes(e))) {
        if ((t.includes("imax") || t.includes("ไอแมกซ์")) && !s) continue;
        let n = 0;
        (n =
          t === r
            ? 1e3
            : t.startsWith(r)
              ? 500 + (r.length / t.length) * 100
              : 100 - t.length / 50 + 100),
          n > a.score && ((a.score = n), (a.element = e));
      }
    }
    let c = a.element;
    if (!c) return;
    c.click();
    const u = await waitUntil(
      () => document.querySelector("#go_showtime.btn-qs-showtime"),
      { timeout: 6e3 }
    );
    u && setTimeout(() => u.click(), 500);
  }
  function domReady(e) {
    "loading" === document.readyState
      ? window.addEventListener("DOMContentLoaded", e)
      : e();
  }
  let botInitialized = !1,
    botRunning = !1;
  async function ensureBotInitialized() {
    if (botInitialized) return !0;
    await checkVersion();
    return !!(await requireLogin()) && ((botInitialized = !0), !0);
  }
  async function run() {
    if (botRunning) return;
    (botRunning = !0), waitForBody();
    let e = !1;
    function t(t) {
      e ||
        ((e = !0),
          setTimeout(() => {
            autoSelectSeats(t);
          }, 250));
    }
    const n = new MutationObserver(() => {
      const e = document.querySelector("#seatPlan");
      e && (n.disconnect(), t(e));
    }),
      i = document.querySelector("#seatPlan");
    if (i) return n.disconnect(), void t(i);
    const o = (await clickShowDate()) ? await findMovieCard() : null,
      a = o ? await findTheatreBlock(o) : null,
      r = (!!a && (await clickShowtime(a)), await waitForSeatPlanEl());
    r && !e && (n.disconnect(), t(r)), (botRunning = !1);
  }
  window.addEventListener("EZYBOT_START", async () => {
    if (!(await ensureBotInitialized())) return;
    if (!loadHybridConfig().isRunning) return;
    await waitForStartTime();
    const e = location.href.replace(/[#?].*$/, "");
    /^https:\/\/www\.majorcineplex\.com\/cinema\/?$/.test(e)
      ? handleCinemaSelection()
      : /^https:\/\/www\.majorcineplex\.com\/booking2(?:\/|$)/.test(e) ||
        /^https:\/\/www\.majorcineplex\.com\/cinema\/.+/.test(e)
        ? run()
        : /^https:\/\/www\.majorcineplex\.com\/movie(?:\/|$|\/.+)/.test(e) &&
        (await autoNavigateMovieAndBranch());
  }),
    window.addEventListener("EZYBOT_STOP", () => {
      botRunning = !1;
    }),
    domReady(async () => {
      if (!loadHybridConfig().isRunning) return;
      if (!(await ensureBotInitialized())) return;
      await waitForStartTime();
      const e = location.href.replace(/[#?].*$/, "");
      if (/^https:\/\/www\.majorcineplex\.com\/cinema\/?$/.test(e))
        "complete" === document.readyState ||
          "interactive" === document.readyState
          ? handleCinemaSelection()
          : window.addEventListener("DOMContentLoaded", handleCinemaSelection);
      else {
        if (
          /^https:\/\/www\.majorcineplex\.com\/booking2(?:\/|$)/.test(e) ||
          /^https:\/\/www\.majorcineplex\.com\/cinema\/.+/.test(e)
        )
          return await sleep(250), void run();
        if (/^https:\/\/www\.majorcineplex\.com\/payment(?:\/|$|\/.+)/.test(e));
        else {
          await sleep(250);
          const e = await waitUntil(
            () => document.querySelector(".box-quick-bar-details"),
            { timeout: 8e3 }
          ),
            t = await waitUntil(
              () => document.querySelector(".box-quick-branches"),
              { timeout: 8e3 }
            );
          if (!e || !t) return;
          const n = e.querySelectorAll("a.bqmlm-select");
          let i = null;
          for (const e of n) {
            if (
              (e.dataset.movieTitle || e.textContent || "")
                .trim()
                .toLowerCase()
                .includes(config.movietitle.toLowerCase())
            ) {
              i = e;
              break;
            }
          }
          if (!i) return;
          i.click();
          const o = await waitUntil(
            () => {
              const e = t.querySelectorAll("a.bcbl-branches");
              return e.length ? e : null;
            },
            { timeout: 8e3 }
          );
          if (!o) return;
          let a = { element: null, score: -1 };
          const r = config.cinema.trim().toLowerCase(),
            l = r.split(/\s+/).filter(Boolean),
            s = r.includes("imax") || r.includes("ไอแมกซ์");
          for (const e of o) {
            const t = (e.dataset.branchTitle || e.textContent || "")
              .replace(/\s+/g, " ")
              .normalize("NFC")
              .trim()
              .toLowerCase();
            if (l.every((e) => t.includes(e))) {
              if ((t.includes("imax") || t.includes("ไอแมกซ์")) && !s) continue;
              let n = 0;
              (n =
                t === r
                  ? 1e3
                  : t.startsWith(r)
                    ? 500 + (r.length / t.length) * 100
                    : 100 - t.length / 50 + 100),
                n > a.score && ((a.score = n), (a.element = e));
            }
          }
          let c = a.element;
          if (!c) return;
          c.click();
          const u = await waitUntil(
            () => document.querySelector("#go_showtime.btn-qs-showtime"),
            { timeout: 6e3 }
          );
          u && setTimeout(() => u.click(), 500);
        }
      }
    });

})();