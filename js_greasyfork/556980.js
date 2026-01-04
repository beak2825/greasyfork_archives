// ==UserScript==
// @name         E-METR (Unlocker)
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @author       NX
// @icon         https://xodim.e-metrologiya.uz/back/app-assets/images/ico/favicon.ico
// @description  It's a simple hack for editing contracts, unblock dates of start testing, restore old services
// @match        https://xodim.e-metrologiya.uz/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556980/E-METR%20%28Unlocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556980/E-METR%20%28Unlocker%29.meta.js
// ==/UserScript==

(function () {

'use strict';

/* ============================================================
   UTILFO
============================================================ */

const waitVue = () => new Promise(resolve => {
    const t = setInterval(() => {
        const app = document.querySelector("#app")?.__vue__;
        if (app) { clearInterval(t); resolve(app); }
    }, 300);
});

const toast = msg => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.style = `
      position: fixed; top: 20px; left: 20px;
      background: #000; color: #fff;
      padding: 10px 16px; border-radius: 8px;
      font-size: 15px; z-index: 999999999;
      opacity: 0; transition: .25s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.style.opacity = 1, 40);
    setTimeout(() => { el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 1700);
};

/* ============================================================
   YANGI XIZMAT TURLARI
============================================================ */

const NEW = [
    { id: 4, name: "Ўлчаш воситаларини қиёслаш" },
    { id: 6, name: "Синов воситаларини метрологик аттестациядан ўтказиш" },
    { id: 7, name: "Ўлчаш воситаларини калибрлаш" },
    { id: 20, name: "Ўлчаш комплексларини метрологик аттестациядан ўтказиш" }
  ];

/* ============================================================
   OFFLINE APPEAL — xizmatlarni tiklash
============================================================ */

function findSelect(vm, arr = []) {
    if (!vm) return arr;
    if (vm.$options?.name === "vue-multiselect") arr.push(vm);
    vm.$children?.forEach(c => findSelect(c, arr));
    return arr;
  }

  async function setNew() {
    const app = await waitVue();
    const list = findSelect(app);
    if (!list.length) return toast("❗ Xatolik: multiselect topilmadi!");

    const ms = list[1] || list[0];
    const parents = [ms.$parent, ms.$parent?.$parent, ms.$parent?.$parent?.$parent];

    parents.forEach(p => {
      if (!p) return;
      if (p.types) p.types = NEW;
      if (p.device?.types) p.device.types = NEW;
      if (p.form?.types) p.form.types = NEW;
    });

    ms.options = NEW;
    if (ms.$data) ms.$data.internalOptions = NEW;
    ms.$forceUpdate();
    ms.$parent?.$forceUpdate();

    toast("✅ Xizmatlar tiklandi!");
  }

/* ============================================================
   VDP DATEPICKER — sanalarni ochish (VDP)
============================================================ */

async function unlockDates() {
    const app = await waitVue();

    function findPickers(vm, arr = []) {
        if (!vm) return arr;
        if (
            vm.$options?.name?.includes("datepicker") ||
            vm.$el?.classList?.contains("vdp-datepicker")
        ) arr.push(vm);

        vm.$children?.forEach(c => findPickers(c, arr));
        return arr;
    }

    const pickers = findPickers(app);

    pickers.forEach(dp => {
        dp.isDateDisabled = () => false;
        dp.disabledDates = [];
        dp.$forceUpdate();
    });

    document.querySelectorAll(".vdp-datepicker__calendar .disabled").forEach(el => {
        el.classList.remove("disabled");
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.cursor = "pointer";
    });

    toast("📅 Sanalar to'liq ochildi!");
}

/* ============================================================
   FLATPICKR — “Дата поверки”
============================================================ */

function unlockFlatpickr2() {

    const fpInput = document.querySelector('#datePicker');
    if (!fpInput) return toast("❗ Bu funksiya boshqa sertifikat turi uchun!");

    const fp = fpInput._flatpickr;
    if (!fp) return toast("❗ Flatpickr instance topilmadi!");

    // 1) CHEKLOVLARNI O‘CHIRAMIZ
    fp.set('minDate', null);
    fp.set('maxDate', null);

    // 2) Blocklangan sanalarni tozalaymiz
    fp.set('disable', []);
    fp.set('enable', []);

    // 3) Oylik ko‘rinish — bitta oy
    fp.set('showMonths', 1);

    // 4) Oylab tanlash — dropdown
    fp.set('monthSelectorType', 'dropdown');

    // 5) readonly olib tashlanadi
    fpInput.removeAttribute('readonly');

    // 6) qayta chizamiz
    fp.redraw();

    toast("📅 Sanalar to‘liq ochildi!");
}

/* ============================================================
   APPLICATION UPDATE — sizning original patch
============================================================ */

function patchApplicationMultiselects() {

    function findVue(vm, arr = []) {
        if (!vm) return arr;
        if (vm.$options?.name === "vue-multiselect") arr.push(vm);
        vm.$children?.forEach(c => findVue(c, arr));
        return arr;
    }

    const app = document.querySelector("#app")?.__vue__;
    if (!app) return toast("Vue topilmadi!");

    const selects = findVue(app);

    selects.forEach(ms => {
        ms.options = NEW;
        if (ms.$data) ms.$data.internalOptions = NEW;
        ms.$forceUpdate();
    });

    toast("🔧 Xizmatlar tiklandi!");
}

/* ============================================================
   PANEL WIDGET
============================================================ */

function createPanel(content) {

    const toggle = document.createElement("div");
    toggle.innerHTML = "⚙️";
    toggle.style = `
      position:fixed;bottom:20px;left:20px;width:48px;height:48px;
      background:#1976d2;color:#fff;border-radius:12px;
      display:flex;align-items:center;justify-content:center;
      font-size:26px;cursor:pointer;z-index:999999999;
      box-shadow:0 3px 14px rgba(0,0,0,.35);
    `;
    document.body.appendChild(toggle);

    const panel = document.createElement("div");
    panel.style = `
      position:fixed;bottom:80px;left:20px;width:260px;padding:14px;
      background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.25);
      display:none;z-index:999999999;
    `;
    panel.innerHTML = content;
    document.body.appendChild(panel);

    toggle.onclick = () =>
        panel.style.display =
        panel.style.display === "none" ? "block" : "none";
}

/* ============================================================
   ROUTING
============================================================ */

const url = location.href;

/* OFFLINE APPEAL */
if (url.includes("/reviewer/offline-appeal/")) {
    createPanel(`
      <button id="btn-new"
        style="width:100%;padding:10px;background:#1976d2;color:white;border-radius:8px;">
        ✅ Xizmatlarni tiklash
      </button>
    `);
    document.getElementById("btn-new").onclick = setNew;
}

/* CONTRACTS */
else if (url.includes("/reviewer/contracts")) {
    createPanel(`<div style="font-weight:bold;font-size:14px;margin-bottom:6px;">📄 Shartnomalarni o‘zgartirish</div>
      <input id="appId" placeholder="Ariza raqami..." style="width:100%;padding:8px;margin-bottom:8px;">
      <button id="btn-open" style="width:100%;padding:10px;background:#0288d1;color:white;border-radius:8px;">
        🔗 Ochish
      </button>
    `);

    document.getElementById("btn-open").onclick = () => {
        const id = document.getElementById("appId").value.trim();
        if (!id) return alert("Raqam kiriting!");
        window.open(`https://xodim.e-metrologiya.uz/reviewer/application/${id}/update?update=${id}&comment=null`, "_blank");
    };
}

/* CERTIFICATE (VDP + Flatpickr)*/
else if (url.includes("/comparator/certificate/")) {
    createPanel(`
      <button id="btn-unlock"
        style="width:100%;padding:10px;background:#2e7d32;color:white;border-radius:8px;margin-bottom:8px;">
        📅 Sanalarni ochish <br>(asosiy)
      </button>

      <button id="btn-unlock2"
        style="width:100%;padding:10px;background:#3949ab;color:white;border-radius:8px;">
        📅 Sanalarni ochish <br>(boshqa turdagi)
      </button>
    `);

    document.getElementById("btn-unlock").onclick = unlockDates;
    document.getElementById("btn-unlock2").onclick = unlockFlatpickr2;
}

/* APPLICATION UPDATE */
else if (url.includes("/reviewer/application/")) {

    createPanel(`
      <div style="font-weight:bold;text-align:center;margin-bottom:10px;color:#4a148c;">
        ⚠️ Har xizmat tanlanganda va yaratilganda takrorlang
      </div>
      <button id="btn-patch"
        style="width:100%;padding:12px;background:#8e24aa;color:white;border:none;border-radius:10px;margin-bottom:8px;">
        🔧 Xizmatlarni tiklash
      </button>

    `);

    document.getElementById("btn-patch").onclick = patchApplicationMultiselects;
    document.getElementById("btn-flat").onclick = unlockFlatpickr2;
}

})();
