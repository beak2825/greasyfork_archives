// ==UserScript==
// @name         Customizable Vault Withdrawal Buttons
// @namespace    CustomizableVaultButtons
// @version      7.3.1
// @description  Vault buttons with all custom buttons managed in settings, drag-and-drop reorder (desktop + mobile), resettable to Beer/Casino, Reset, Magic (hidden if unset), compact Settings button, centered rows.
// @license      MIT
// @author       Titanic_, dreadedoutlaw
// @match        https://www.torn.com/properties.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551393/Customizable%20Vault%20Withdrawal%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/551393/Customizable%20Vault%20Withdrawal%20Buttons.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_TARGET = 10_000_000;
  const DEFAULT_BUTTONS = [
    { label: "Beer", amount: 1000 },
    { label: "Casino", amount: 1100000 }
  ];

  let playMoney = loadSetting("playMoney", DEFAULT_TARGET);
  let BUTTONS = loadSetting("buttons", [...DEFAULT_BUTTONS]);

  if (!window.__vaultBtnInterval) {
    tryInject();
    window.__vaultBtnInterval = setInterval(tryInject, 400);
  }

  function tryInject() {
    if (document.getElementById("custom-buttons")) return;

    const inputs = document.querySelectorAll(".input-money");
    if (!inputs.length) return;

    const firstInput = Array.from(inputs).find(isVisible) || inputs[0];
    const anchorForm =
      firstInput.closest("form") ||
      firstInput.closest(".input-money-group") ||
      firstInput.parentElement;
    if (!anchorForm || !anchorForm.parentNode) return;

    addElementsBefore(anchorForm);
  }

  function isVisible(el) {
    const s = window.getComputedStyle(el);
    return s && s.display !== "none" && s.visibility !== "hidden";
  }

  function addElementsBefore(anchor) {
    const parent = document.createElement("div");
    parent.id = "custom-buttons";
    renderButtons(parent);
    anchor.parentNode.insertBefore(parent, anchor);

    addGlobalStyle(`
#custom-buttons {
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:4px;
  padding:6px;
}
#custom-buttons .vault-btn {
  flex:0 0 auto;
  min-width:auto;
  padding:6px 12px;
  font-size:14px;
  border-radius:8px;
  text-align:center;
  display:inline-flex;
  justify-content:center;
  align-items:center;
  line-height:1.2;
}
#custom-buttons .magic-btn {
  background:#6a0dad;
  color:#fff;
  border:1.5px solid #8a2be2;
  font-weight:700;
}
#custom-buttons .settings-btn {
  flex:0 0 auto;
  min-width:36px;
  max-width:36px;
  padding:6px;
  font-size:16px;
  border-radius:8px;
  background:#2c2c2c; /* darker base */
  color:#fff;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border:1px solid #444;
}
#custom-buttons .settings-btn:hover {
  background:#3a3a3a; /* subtle hover */
}
.settings-modal {
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  background:#222;
  color:#fff;
  padding:16px;
  border-radius:8px;
  z-index:9999;
  box-shadow:0 0 20px rgba(0,0,0,.8);
  width:min(92vw, 500px);
}
.settings-modal h3 {margin:0 0 8px 0;font-size:16px;}
.settings-modal label {display:block;margin:8px 0 4px;}
.settings-modal input[type="text"], .settings-modal input[type="number"] {
  width:100%;
  padding:6px;
  border-radius:4px;
  border:1px solid #555;
  background:#111;
  color:#fff;
}
.settings-modal .row {display:flex;gap:8px;margin-top:12px;justify-content:flex-end;}
.settings-modal button {padding:6px 12px;border:none;border-radius:6px;cursor:pointer;}
.settings-modal .save-btn {background:#28a745;color:#fff;}
.settings-modal .cancel-btn {background:#dc3545;color:#fff;}
.settings-modal .reset-btn {background:#ffc107;color:#000;}
.btn-row {
  display:flex;
  gap:4px;
  margin-bottom:4px;
  align-items:center;
  padding:4px;
  border:1px solid #444;
  border-radius:4px;
}
.btn-row.dragging {opacity:0.5;}
.btn-row input {flex:1;}
.btn-row .btn-amount {width:100px;}
.btn-row .del-btn {
  background:#dc3545;
  color:#fff;
  border:none;
  border-radius:4px;
  cursor:pointer;
}
#add-btn {margin-top:6px;}
    `);
  }

  function renderButtons(container) {
    container.innerHTML = "";
    BUTTONS.forEach((b) => addButton(container, b.label, b.amount));
    addResetButton(container);
    if (Number.isFinite(playMoney) && playMoney > 0) {
      addMagicButton(container);
    }
    addSettingsButton(container);
  }

  function addButton(parent, label, amount) {
    const btn = createButton(label, () => adjustMoney(amount));
    parent.appendChild(btn);
  }

  function addResetButton(parent) {
    const btn = createButton("Reset", () => adjustMoney(0, true));
    parent.appendChild(btn);
  }

  function addMagicButton(parent) {
    const btn = createButton("Magic", () => {
      const walletNode = document.querySelector("[class^='value_'][data-money]");
      const amountOnHand = walletNode ? parseInt(walletNode.getAttribute("data-money") || "0", 10) : 0;
      const inputVisibleRight = document.querySelector("form.right .input-money");
      const inputVisibleLeft = document.querySelector("form.left .input-money");

      if (amountOnHand < playMoney && inputVisibleLeft) {
        inputVisibleLeft.value = String(playMoney - amountOnHand);
        inputVisibleLeft.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (amountOnHand > playMoney && inputVisibleRight) {
        inputVisibleRight.value = String(amountOnHand - playMoney);
        inputVisibleRight.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    btn.classList.add("magic-btn");
    parent.appendChild(btn);
  }

  function addSettingsButton(parent) {
    const btn = createButton("⚙️", () => openSettingsModal(parent));
    btn.title = "Settings";
    btn.classList.add("settings-btn");
    parent.appendChild(btn);
  }

  function openSettingsModal(container) {
    const modal = document.createElement("div");
    modal.className = "settings-modal";
    modal.innerHTML = `
      <h3>Settings</h3>
      <label>Magic Target</label>
      <input id="magic-input" type="number" min="0" step="1" value="${playMoney || ""}">
      <h4 style="margin-top:12px;">Custom Buttons (drag or touch to reorder)</h4>
      <div id="buttons-list"></div>
      <button id="add-btn">+ Add Button</button>
      <button id="reset-btn" class="reset-btn">Reset to Defaults</button>
      <div class="row">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    const list = modal.querySelector("#buttons-list");
    renderButtonEditors(list);

    modal.querySelector("#add-btn").onclick = () => {
      BUTTONS.push({ label: "New", amount: 0 });
      renderButtonEditors(list);
    };

    modal.querySelector("#reset-btn").onclick = () => {
      if (confirm("Reset buttons to defaults?")) {
        BUTTONS = [...DEFAULT_BUTTONS];
        renderButtonEditors(list);
      }
    };

    modal.querySelector(".save-btn").onclick = () => {
      const newMagic = parseInt(document.getElementById("magic-input").value, 10);
      playMoney = Number.isFinite(newMagic) && newMagic > 0 ? newMagic : null;
      saveSetting("playMoney", playMoney);

      const edited = [];
      list.querySelectorAll(".btn-row").forEach((row) => {
        const label = row.querySelector(".btn-label").value.trim();
        const amount = parseInt(row.querySelector(".btn-amount").value, 10);
        if (label && Number.isFinite(amount)) edited.push({ label, amount });
      });
      BUTTONS = edited;
      saveSetting("buttons", BUTTONS);

      renderButtons(container);
      modal.remove();
    };

    modal.querySelector(".cancel-btn").onclick = () => modal.remove();
  }

  function renderButtonEditors(container) {
    container.innerHTML = "";
    BUTTONS.forEach((b, i) => {
      const row = document.createElement("div");
      row.className = "btn-row";
      row.draggable = true;
      row.innerHTML = `
        <input class="btn-label" type="text" value="${b.label}">
        <input class="btn-amount" type="number" value="${b.amount}">
        <button class="del-btn">✖</button>
      `;
      const delBtn = row.querySelector(".del-btn");
      delBtn.onclick = () => {
        BUTTONS.splice(i, 1);
        renderButtonEditors(container);
      };

      // desktop drag
      row.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", i.toString());
        row.classList.add("dragging");
      });
      row.addEventListener("dragend", () => row.classList.remove("dragging"));
      row.addEventListener("dragover", (e) => e.preventDefault());
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
        const to = i;
        if (from !== to) {
          const [moved] = BUTTONS.splice(from, 1);
          BUTTONS.splice(to, 0, moved);
          renderButtonEditors(container);
        }
      });

      // mobile touch drag
      let fromIndex = null;
      row.addEventListener("touchstart", () => {
        fromIndex = i;
        row.classList.add("dragging");
      });
      row.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const rows = Array.from(container.querySelectorAll(".btn-row"));
        const over = rows.findIndex(r => {
          const rect = r.getBoundingClientRect();
          return touchY >= rect.top && touchY <= rect.bottom;
        });
        if (over >= 0 && over !== fromIndex) {
          const [moved] = BUTTONS.splice(fromIndex, 1);
          BUTTONS.splice(over, 0, moved);
          fromIndex = over;
          renderButtonEditors(container);
        }
      }, { passive: false });
      row.addEventListener("touchend", () => {
        row.classList.remove("dragging");
        renderButtonEditors(container);
      });

      container.appendChild(row);
    });
  }

  function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.type = "button";
    btn.classList.add("torn-btn", "vault-btn");
    btn.addEventListener("click", onClick, { passive: true });
    return btn;
  }

  function adjustMoney(amount, set = false) {
    const group = document.querySelector(".input-money-group");
    if (!group) return;
    const moneyInputs = group.querySelectorAll(".input-money");
    if (!moneyInputs.length) return;

    const inputVisible = moneyInputs[0];
    const inputHiddenProbe = parseInt(inputVisible.value.replace(/[, $]/g, "") || "0", 10);
    let current = Number.isFinite(inputHiddenProbe) ? inputHiddenProbe : 0;
    let newValue = set ? amount : current + amount;
    if (newValue < 0) newValue = 0;

    inputVisible.value = String(newValue);
    inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function saveSetting(key, value) {
    try { localStorage.setItem("VaultBtns_" + key, JSON.stringify(value)); } catch {}
  }
  function loadSetting(key, fallback) {
    try {
      const raw = localStorage.getItem("VaultBtns_" + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function addGlobalStyle(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    head.appendChild(style);
  }
})();