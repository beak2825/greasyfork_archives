// ==UserScript==
// @name         loadouts
// @version      2.1.2
// @author       olesien [2187764] & Pyrit [2111649]
// @description  Load & show loadouts
// @license      CC-NC-ND
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @connect      ultimata.net
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/551892/loadouts.user.js
// @updateURL https://update.greasyfork.org/scripts/551892/loadouts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class State extends EventTarget {
    value;
    constructor(initial) {
      super();
      this.value = initial;
    }
    update(partial) {
      this.value = { ...this.value, ...partial };
      this.dispatchEvent(new Event("state"));
    }
    on(cb) {
      this.addEventListener("state", () => cb(this.value));
    }
  }
  class ZippedState extends State {
    constructor(state1, state2) {
      super([state1.value, state2.value]);
      state1.on((state) => {
        this.value = [state, this.value[1]];
        this.dispatchEvent(new Event("state"));
      });
      state2.on((state) => {
        this.value = [this.value[0], state];
        this.dispatchEvent(new Event("state"));
      });
    }
  }
  var _GM = (() => typeof GM != "undefined" ? GM : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function xmlHttpRequestImpl(details) {
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    const timeoutController = new AbortController();
    const timeoutSignal = timeoutController.signal;
    const {
      url,
      method,
      headers,
      timeout,
      data,
      onabort,
      onerror,
      onload,
      onloadend,
      onreadystatechange,
      ontimeout
    } = details;
    setTimeout(() => timeoutController.abort(), timeout ?? 3e4);
    const prom = new Promise((res, rej) => {
      try {
        if (!url) {
          rej("No URL supplied");
        }
        abortSignal.addEventListener("abort", () => rej("Request aborted"));
        timeoutSignal.addEventListener("abort", () => rej("Request timed out"));
        if (!method || method.toLowerCase() !== "post") {
          PDA_httpGet(url, headers ?? {}).then(res).catch(rej);
        } else {
          PDA_httpPost(url, headers ?? {}, data ?? "").then(res).catch(rej);
        }
      } catch (e) {
        rej(e);
      }
    }).then((r) => {
      onload?.call(r, r);
      onloadend?.call(r, r);
      onreadystatechange?.call(r, r);
      return r;
    }).catch((e) => {
      switch (true) {
        case e === "Request aborted":
          e = new DOMException("Request aborted", "AbortError");
          if (onabort) return onabort();
          else if (onerror) return onerror?.call(e, e);
          else throw e;
        case e === "Request timed out":
          e = new DOMException("Request timed out", "TimeoutError");
          if (ontimeout) return ontimeout();
          else if (onerror) return onerror?.call(e, e);
          else throw e;
        case e === "No URL supplied":
          e = new TypeError("Failed to fetch: No URL supplied");
          if (onerror) return onerror?.call(e, e);
          else throw e;
        default:
          if (!e || !(e instanceof Error)) e = new Error(e ?? "Unknown Error");
          if (onerror) return onerror?.call(e, e);
          else throw e;
      }
    });
    return { abortController, prom };
  }
  class UserscriptApi {
    gm;
    unsafeWindow;
    constructor() {
      if (typeof _GM !== "undefined" && "getValue" in _GM) {
        _GM.getValue;
        _GM.setValue;
        _GM.deleteValue;
        _GM.xmlHttpRequest;
        this.gm = _GM;
      } else {
        this.gm = {
          async getValue(key, fallback) {
            const value = localStorage.getItem(key);
            if (value) {
              return JSON.parse(value);
            } else {
              return fallback;
            }
          },
          async setValue(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
          },
          async deleteValue(key) {
            localStorage.removeItem(key);
          },
          xmlHttpRequest(details) {
            const { abortController } = xmlHttpRequestImpl(details);
            if (!details || typeof details !== "object")
              throw new TypeError("Invalid details passed to GM_xmlHttpRequest");
            return { abort: () => abortController.abort() };
          }
        };
      }
      if (typeof _unsafeWindow !== "undefined") {
        this.unsafeWindow = _unsafeWindow;
      } else {
        this.unsafeWindow = window;
      }
    }
  }
  const API = new UserscriptApi();
  const ultimataCss = "button{display:inline-block;border:1px solid #3d7aae;color:#3d7aae;border-radius:5px;font-size:9px;background-color:transparent}button:hover{border-color:#366d9b;color:#366d9b;cursor:pointer}p{line-height:14px}span,p{font-size:11px;margin:0}h1{font-size:15px}.modal-root{z-index:200000;background-color:#000000b3;display:flex;top:0;left:0;width:100%;height:100%;position:fixed;justify-content:center;overflow:scroll}.overflow-container{min-height:1000px;padding-top:100px}.container{max-width:40rem;display:flex;justify-content:flex-end;border-color:#3f3f46;background-color:#27272a;padding:.5rem;border-radius:10px}.button-danger{color:#f33e14;border-color:#f33e14}.button-danger:hover{color:#e2340c;border-color:#e2340c}.form-element{display:flex}.form-container{display:flex;flex-direction:column;justify-content:flex-start;gap:.75rem}label{font-size:14px}.buttons{display:flex;flex-direction:row;gap:.5rem;justify-content:flex-end}table{width:100%;border-collapse:collapse;table-layout:fixed}td{border:solid 1px rgb(63,63,70);padding:.25rem;vertical-align:top}input{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;border-radius:5px;background-color:#3f3f46;padding:5px;font-size:11px;line-height:14px;color:#fafafa;margin-left:5px}";
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  const scopedStyles = d(ultimataCss);
  const BASE_URL = `https://ultimata.net/api/v1/loadout`;
  const ULTIMATA_STATE = new State({
    sendState: "ready",
    fetchState: "ready",
    mountedUi: false,
    rendered: false,
    sentNotif: false
  });
  function init$3() {
    const origFetch = API.unsafeWindow.fetch;
    API.unsafeWindow.fetch = (async (info, config) => {
      const response = await origFetch(info, config);
      let url;
      if (info instanceof Request) {
        url = info.url;
      } else if (info instanceof URL) {
        url = info.href;
      } else {
        url = info;
      }
      if (url.indexOf("attackData") !== -1) {
        const data = await response.clone().json();
        ULTIMATA_STATE.update({ DB: data?.DB });
      }
      return response;
    });
    ULTIMATA_STATE.on((state) => {
      if (!state.DB || !state.DB.defenderItems || !state.DB.defenderAmmoStatus || ULTIMATA_STATE.value.sendState !== "ready")
        return;
      const attackData = {
        player_id: state.DB.defenderUser.userID,
        json: {
          defenderItems: state.DB.defenderItems,
          defenderAmmoStatus: state.DB.defenderAmmoStatus,
          defenderAmmoPreferences: state.DB.defenderAmmoPreferences
        }
      };
      const url = `${BASE_URL}/addloadout?key=${ULTIMATA_STATE.value.key}`;
      API.gm.xmlHttpRequest({
        method: "POST",
        url,
        onload: () => {
          ULTIMATA_STATE.update({ sendState: "sent", sentNotif: true });
          setTimeout(() => ULTIMATA_STATE.update({ sentNotif: false }), 5e3);
        },
        onerror: (error) => {
          console.error(error);
          ULTIMATA_STATE.update({ sendState: "sent" });
        },
        data: JSON.stringify(attackData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      ULTIMATA_STATE.update({ sendState: "sending" });
    });
    ULTIMATA_STATE.on((state) => {
      if (state.loadout || !state.key || state.fetchState !== "ready") return;
      const url = new URL(window.location.href);
      const playerId = url.searchParams.get("user2ID");
      console.log("playerId:", playerId);
      const playerIdNum = playerId ? Number(playerId) : null;
      console.log("playerIdNum:", playerIdNum);
      if (playerIdNum) {
        const url2 = `${BASE_URL}/getloadout?key=${state.key}&playerId=${playerIdNum}`;
        API.gm.xmlHttpRequest({
          method: "GET",
          url: url2,
          onload: async (response) => {
            const res = JSON.parse(response.responseText);
            if (res.data?.loadout && res.data.loadout !== null) {
              const loadout = JSON.parse(res.data.loadout);
              ULTIMATA_STATE.update({ loadout, fetchState: "fetched" });
            } else if (res.error && res.message === "Key is invalid") {
              await API.gm.deleteValue("ultimata-key");
              ULTIMATA_STATE.update({ key: void 0, fetchState: "ready" });
            } else {
              ULTIMATA_STATE.update({ fetchState: "fetched" });
            }
          },
          onerror: (error) => {
            console.error(error);
            ULTIMATA_STATE.update({ fetchState: "fetched" });
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      ULTIMATA_STATE.update({ fetchState: "fetching" });
    });
    ULTIMATA_STATE.on((state) => {
      console.log("[ultimata]:", state);
    });
    DOM_STATE.on((state) => {
      if (state.uiRoot && !ULTIMATA_STATE.value.mountedUi) {
        const shadow = state.uiRoot.attachShadow({ mode: "closed" });
        shadow.appendChild(scopedStyles);
        const root = document.createElement("div");
        ULTIMATA_STATE.on((ultimata) => {
          if (ultimata.sentNotif) {
            root.innerHTML = "<span>Updated loadout!</span>";
          } else {
            root.innerHTML = `
<span>Loadout Script:</span>
<button id="key-button">${ULTIMATA_STATE.value.key ? "Remove Key" : "Set Key"}</button>
`;
            const tosHost = document.createElement("div");
            document.body.appendChild(tosHost);
            const tosShadow = tosHost.attachShadow({ mode: "closed" });
            const keyButton = root.querySelector(
              "#key-button"
            );
            ULTIMATA_STATE.on((ultimataState) => {
              if (ultimataState.key) {
                keyButton.innerText = "Remove Key";
              } else {
                keyButton.innerText = "Set key";
              }
            });
            keyButton.addEventListener("click", () => {
              if (ULTIMATA_STATE.value.key) {
                API.gm.deleteValue("ultimata-key");
                ULTIMATA_STATE.update({ key: void 0 });
              } else {
                tosShadow.innerHTML = `
<div class="modal-root">
    <div class="overflow-container">
        <div class="container">
            <form class="form-container">
                <h1>Terms of service</h1>
                <table>
                    <thead>
                        <tr>
                            <td><p>Data Storage</p></td>
                            <td><p>Data Sharing</p></td>
                            <td><p>Purpose of Use</p></td>
                            <td><p>Key Storage & Sharing</p></td>
                            <td><p>Key Access Level</p></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><p>Temporary - less than a day (for verifying user API key to prevent abuse and restricting access; then cached to prevent API key spam</p></td>
                            <td><p>Faction (for the loadouts), data from the key itself; nobody</p></td>
                            <td><p>Competitive advantage for the loadouts, and security for the keys (so other people don't send bad data to the server)</p></td>
                            <td><p>Stored / Used only for automation (cached for a short period)</p></td>
                            <td><p>Public</p></td>
                        </tr>
                    </tbody>
                </table>
                <label for="key-input" class="form-element">Key (public):<input id="key-input" name="key-input"></input></label>
                <div class="buttons">
                    <button class="button-danger" id="cancel">Cancel</button>
                    <button type="submit">Agree & confirm</button>
                </div>
            </form>
        </div>
    </div>
</div>
`;
                tosShadow.appendChild(scopedStyles.cloneNode(true));
                const form = tosShadow.querySelector("form");
                form.addEventListener("submit", async (event) => {
                  event.preventDefault();
                  const keyInput = form.elements.namedItem(
                    "key-input"
                  );
                  const key = keyInput.value;
                  await API.gm.setValue("ultimata-key", key);
                  ULTIMATA_STATE.update({ key });
                  tosShadow.innerHTML = "";
                });
                const cancel = tosShadow.querySelector(
                  "#cancel"
                );
                cancel.addEventListener("click", () => {
                  tosShadow.innerHTML = "";
                });
              }
            });
          }
        });
        shadow.appendChild(root);
        ULTIMATA_STATE.update({ mountedUi: true });
      }
    });
    API.gm.getValue("ultimata-key").then((value) => {
      if (value) {
        ULTIMATA_STATE.update({ key: value });
      }
    });
  }
  const DOM_STATE = new State({});
  function init$2() {
    const observer = new MutationObserver((_, observer2) => {
      const panels = document.querySelectorAll(`[class^="playerArea"]`);
      if (panels.length === 1) {
        observer2.disconnect();
        console.log("[DOM]: Assuming mobile");
        const mobileRoot = panels[0].parentElement;
        const playerHeader = mobileRoot?.querySelector(`[class^="header_"]`);
        if (mobileRoot && playerHeader) {
          if (!DOM_STATE.value.mobileSelection) {
            const updateSelectedPlayer = () => {
              if (Array.from(playerHeader.classList).some(
                (c) => c.startsWith("active")
              )) {
                DOM_STATE.update({ mobileSelection: "self" });
                ULTIMATA_STATE.update({ rendered: false });
              } else {
                DOM_STATE.update({ mobileSelection: "target" });
                ULTIMATA_STATE.update({ rendered: false });
              }
            };
            const observer3 = new MutationObserver(updateSelectedPlayer);
            observer3.observe(playerHeader, { attributeFilter: ["class"] });
            updateSelectedPlayer();
          }
          DOM_STATE.update({ mobileRoot });
        }
      } else if (panels.length === 2) {
        observer2.disconnect();
        console.log("[DOM]: Assuming desktop");
        const desktopRoot = panels[1].parentElement;
        if (desktopRoot) {
          DOM_STATE.update({ desktopRoot });
        }
      }
      if (panels.length) {
        const resultPanels = document.querySelectorAll(`[class^="result"]`);
        if (resultPanels.length) {
          DOM_STATE.update({ uiRoot: resultPanels[resultPanels.length - 1] });
        }
      }
    });
    DOM_STATE.on((state) => console.log("[DOM]:", state));
    observer.observe(document, { subtree: true, childList: true });
  }
  function init$1() {
    const combined = new ZippedState(DOM_STATE, ULTIMATA_STATE);
    combined.on(([dom, ultimata]) => {
      const panel = dom.desktopRoot;
      const loadout = ultimata.loadout;
      if (!panel || !loadout || ultimata.rendered) return;
      const background = panel.querySelector(`[class^="modal"]`);
      if (background) {
        background.style.background = "none";
      }
      const fmt = (v) => {
        if (v == null) return "0";
        const n = Number(v);
        return Number.isInteger(n) ? String(n) : n.toFixed(2);
      };
      const domSlots = {
        weapon_main: panel.querySelector("#weapon_main"),
        weapon_second: panel.querySelector("#weapon_second"),
        weapon_melee: panel.querySelector("#weapon_melee"),
        weapon_temp: panel.querySelector("#weapon_temp"),
        weapon_fists: panel.querySelector("#weapon_fists"),
        weapon_boots: panel.querySelector("#weapon_boots")
      };
      Object.values(domSlots).forEach((el) => {
        if (el) el.innerHTML = "";
      });
      function escapeHtml(s = "") {
        return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      function largeEmptyTemplate(label) {
        return `
              <div class="ultimata-item-border glow-default-border"></div>
              <div class="ultimata-top">
                <div class="ultimata-top-marker" id="defender_${label}">
                  <span>${label}</span>
                </div>
              </div>
              <figure class="ultimata-weapon-image">
                <img src="/images/items/silhouettes/${label.toLowerCase()}.svg" class="blank___RpGQA">
              </figure>
              <div class="ultimata-bottom">
                <div role="button" tabindex="0" class="ultimata-bottom-marker">
                  <span data-is-tooltip-opened="false">Standard</span>
                </div>
              </div>`;
      }
      function populateEmpty(bonuses) {
        const rendered = `<div class="ultimata-container"><i class="bonus-attachment-blank-bonus-25" data-bonus-attachment-title="" data-bonus-attachment-description="" data-is-tooltip-opened="false"></i></div>`;
        while (bonuses.length < 2) {
          bonuses.push({ rendered });
        }
        return bonuses;
      }
      function renderWeaponToEl(targetEl, item, label, small = false) {
        if (!targetEl) return;
        if (small) {
          const idImg = item?.ID ? item.ID : label === "Fists" ? 999 : 1e3;
          targetEl.className = `weaponWrapperSmall___z0L51 weaponSlot___w0v_V defender___jWmeI ${item?.glowClass ? `${item.glowClass}___nH9MI` : "glow-default___Dgaii"} withoutGradient___NFxG1`;
          targetEl.innerHTML = `
                  <div class="ultimata-item-border ${item?.glowClass ? `${item.glowClass}-border` : "glow-default-border"}"></div>
                  <figure class="ultimata-weapon-image">
                    <img alt="${item?.name ? item.name : label}" src="/images/items/${idImg}/large.png" loading="lazy">
                  </figure>`;
          return;
        }
        if (!item) {
          targetEl.className = `ultimata-weapon-wrapper emptySlot___B57Gn`;
          targetEl.innerHTML = largeEmptyTemplate(label);
          return;
        }
        const glowClass = item.glowClass || "glow-default-border";
        const dmg = fmt(item.dmg ?? null);
        const acc = fmt(item.acc);
        const name = item.name || "";
        const id = item.ID || "";
        const equipSlot = item.equipSlot?.toString();
        let ammoSlot;
        if ((equipSlot === "1" || equipSlot === "2") && loadout?.defenderAmmoStatus[equipSlot]) {
          ammoSlot = loadout?.defenderAmmoStatus[equipSlot];
        } else {
          ammoSlot = "Standard";
        }
        const ammo = ammoSlot || "Standard";
        console.log(item);
        const attachmentsTop = (item.currentUpgrades || []).map((up) => {
          const title = up.title ?? "";
          const desc = up.hoverover ?? up.desc ?? "";
          const icon = up.icon ?? title?.toLowerCase().replace(/\s+/g, "-");
          return `<div class="ultimata-container">
                        <i class="bonus-attachment-${icon}"
                            title="${escapeHtml(up.hoverover)}"
                            data-bonus-attachment-title="${escapeHtml(title)}"
                            data-bonus-attachment-description="${escapeHtml(desc)}"
                            data-is-tooltip-opened="false"
                        ></i>
                    </div>`;
        }).join("");
        const attachmentsBottom = populateEmpty(
          Object.values(item.currentBonuses || {})
        ).map((b) => {
          if ("rendered" in b) return b.rendered;
          const title = b.title || "";
          const desc = b.hoverover || b.desc || "";
          const icon = b.icon || title?.toLowerCase().replace(/\s+/g, "-");
          return `<div class="ultimata-container">
                        <i class="bonus-attachment-${icon}"
                            title="${escapeHtml(b.hoverover)}"
                            data-bonus-attachment-title="${escapeHtml(title)}"
                            data-bonus-attachment-description="${escapeHtml(desc)}"
                            data-is-tooltip-opened="false"
                        ></i>
                    </div>`;
        }).join("");
        targetEl.className = `ultimata-weapon-wrapper`;
        if (glowClass !== "glow-default-border") {
          targetEl.style.background = `var(--attack-items-glow-hoverable-background-color) var(--items-${glowClass}-linear-gradient)`;
        }
        targetEl.setAttribute("role", "button");
        targetEl.setAttribute("tabindex", "0");
        targetEl.setAttribute("aria-label", `Attack with ${name}`);
        const normLabel = label.toLowerCase();
        targetEl.innerHTML = `
              <div class="ultimata-item-border ${glowClass}-border"></div>
              <div class="ultimata-top">
                <div class="ultimata-item-props">${attachmentsTop}</div>
                <div class="ultimata-top-marker" id="defender_${label}">
                  <span>${label}</span>
                </div>
                <div class="ultimata-item-props">${attachmentsBottom}</div>
              </div>
              <figure class="ultimata-weapon-image">
                <img alt="${name}" src="/images/items/${id}/large.png" loading="lazy">
              </figure>
              <div class="ultimata-bottom">
                <div class="ultimata-item-stats">
                  <i class="bonus-attachment-item-damage-bonus" aria-label="Damage"></i>
                  <span id="damage-value_defender_${normLabel}">${dmg}</span>
                </div>
                <div role="button" tabindex="0" class="ultimata-bottom-marker">
                  <span>${ammo}</span>
                </div>
                <div class="ultimata-item-stats">
                  <i class="bonus-attachment-item-accuracy-bonus" aria-label="Accuracy"></i>
                  <span id="accuracy-value_defender_${normLabel}">${acc}</span>
                </div>
              </div>`;
      }
      const armourList = [];
      const weaponMap = {};
      for (const key of Object.keys(loadout.defenderItems || {})) {
        const arr = loadout.defenderItems[key].item;
        if (!arr || !arr[0]) continue;
        const item = arr[0];
        if (item.slotsMap && String(item.slotsMap).trim() !== "") {
          armourList.push(item);
          continue;
        }
        if (Number(item.ID) === 999) {
          weaponMap.weapon_fists = item;
          continue;
        }
        if (Number(item.ID) === 1e3) {
          weaponMap.weapon_boots = item;
          continue;
        }
        switch (Number(item.equipSlot)) {
          case 1:
            weaponMap.weapon_main = item;
            break;
          case 2:
            weaponMap.weapon_second = item;
            break;
          case 3:
            weaponMap.weapon_melee = item;
            break;
          case 5:
            weaponMap.weapon_temp = item;
            break;
default:
            if (!weaponMap.weapon_temp) weaponMap.weapon_temp = item;
        }
      }
      renderWeaponToEl(
        domSlots.weapon_main,
        weaponMap.weapon_main || null,
        "Primary"
      );
      renderWeaponToEl(
        domSlots.weapon_second,
        weaponMap.weapon_second || null,
        "Secondary"
      );
      renderWeaponToEl(
        domSlots.weapon_melee,
        weaponMap.weapon_melee || null,
        "Melee"
      );
      renderWeaponToEl(
        domSlots.weapon_temp,
        weaponMap.weapon_temp || null,
        "Temporary"
      );
      renderWeaponToEl(
        domSlots.weapon_fists,
        weaponMap.weapon_fists || null,
        "Fists",
        true
      );
      renderWeaponToEl(
        domSlots.weapon_boots,
        weaponMap.weapon_boots || null,
        "Kick",
        true
      );
      const armourWrap = panel.querySelector(".armoursWrap___xqZGV");
      if (armourWrap) {
        armourWrap.innerHTML = "";
        const priority = (it) => {
          const mask = it.slotsMapMask || "";
          if (mask) return 40;
          const sm = String(it.slotsMap || "").toUpperCase();
          if (sm.includes("HEAD")) return 30;
          if (sm.includes("CHEST") || sm.includes("BODY")) return 10;
          if (sm.includes("LEGS")) return 15;
          if (sm.includes("FEET")) return 5;
          return 20;
        };
        armourList.sort((a2, b) => priority(a2) - priority(b));
        let z = 10;
        for (const item of armourList) {
          const container = document.createElement("div");
          container.className = "armourContainer___zL52C";
          container.style.zIndex = (z++).toString();
          let html = "";
          if (item.slotsMapMask) {
            html += `<div class="mask___CtIsZ">
                         <img alt="" class="itemImg___B8FMH" src="/images/v2/items/masks/${item.slotsMapMask}.png">
                       </div>`;
          }
          html += `<div class="armour___fLnYY">
                     <img alt="" class="itemImg___B8FMH" src="/images/v2/items/model-items/${item.ID}m.png">
                   </div>`;
          container.innerHTML = html;
          armourWrap.appendChild(container);
        }
      }
      ULTIMATA_STATE.update({ rendered: true });
    });
  }
  function init() {
    const combined = new ZippedState(DOM_STATE, ULTIMATA_STATE);
    combined.on(([dom, ultimata]) => {
      if (!ultimata.loadout || !dom.mobileRoot || ultimata.DB?.attackStatus !== "notStarted" || ultimata.rendered)
        return;
      const domSlots = {
        primary: dom.mobileRoot.querySelector("#weapon_main"),
        secondary: dom.mobileRoot.querySelector("#weapon_second"),
        melee: dom.mobileRoot.querySelector("#weapon_melee"),
        temp: dom.mobileRoot.querySelector("#weapon_temp"),
        armour: dom.mobileRoot.querySelector(`[class^="armoursWrap"]`)
      };
      function escapeHtml(s = "") {
        return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      const renderWeapon = (element, item) => {
        if (!item) return;
        const glowClass = item.glowClass ?? "glow-default-border";
        const name = item.name ?? "";
        const id = item.ID;
        const equipSlot = item.equipSlot?.toString();
        let ammoSlot;
        if ((equipSlot === "1" || equipSlot === "2") && ultimata.loadout?.defenderAmmoStatus[equipSlot]) {
          ammoSlot = ultimata.loadout.defenderAmmoStatus[equipSlot];
        } else {
          ammoSlot = "Standard";
        }
        const ammo = ammoSlot || "Standard";
        const emptyAttachment = `<div class="ultimata-container"><i class="bonus-attachment-blank-bonus-25" data-bonus-attachment-title="" data-bonus-attachment-description="" data-is-tooltip-opened="false"></i></div>`;
        const mods = (item.currentUpgrades || []).map((up) => {
          const title = up.title ?? "";
          const desc = up.hoverover ?? up.desc ?? "";
          const icon = up.icon ?? title?.toLowerCase().replace(/\s+/g, "-");
          return `<div class="ultimata-container">
                        <i class="bonus-attachment-${icon}"
                            title="${escapeHtml(up.hoverover)}"
                            data-bonus-attachment-title="${escapeHtml(title)}"
                            data-bonus-attachment-description="${escapeHtml(desc)}"
                            data-is-tooltip-opened="false"
                        ></i>
                    </div>`;
        });
        while (mods.length < 2) {
          mods.push(emptyAttachment);
        }
        const bonuses = Object.values(item.currentBonuses || {}).map((b) => {
          const title = b.title || "";
          const desc = b.hoverover || b.desc || "";
          const icon = b.icon || title?.toLowerCase().replace(/\s+/g, "-");
          return `<div class="ultimata-container">
                        <i class="bonus-attachment-${icon}"
                            title="${escapeHtml(b.hoverover)}"
                            data-bonus-attachment-title="${escapeHtml(title)}"
                            data-bonus-attachment-description="${escapeHtml(desc)}"
                            data-is-tooltip-opened="false"
                        ></i>
                    </div>`;
        });
        while (bonuses.length < 2) {
          bonuses.push(emptyAttachment);
        }
        element.className = "ultimata-weapon-wrapper";
        if (glowClass !== "glow-default-border") {
          element.style.background = `var(--attack-items-glow-hoverable-background-color) var(--items-${glowClass}-linear-gradient)`;
        }
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", `Attack with ${name}`);
        element.innerHTML = `
              <div class="ultimata-item-border ${glowClass}-border"></div>
              <div class="ultimata-top">
                <div class="ultimata-item-props">${mods.join("")}</div>
                <div class="ultimata-item-props">${bonuses.join("")}</div>
              </div>
              <figure class="ultimata-weapon-image">
                <img alt="${name}" src="/images/items/${id}/large.png" loading="lazy">
              </figure>
              <div class="ultimata-bottom">
                <div role="button" tabindex="0" class="ultimata-bottom-marker">
                  <span>${ammo}</span>
                </div>
              </div>`;
      };
      const renderArmour = (item, zIndex) => {
        if (!item) return;
        const container = document.createElement("div");
        container.style.zIndex = zIndex.toString();
        container.classList.add("ultimata-armour-container");
        container.innerHTML = `<img class="ultimata-armour-image" src="/images/v2/items/model-items/${item.ID}f.png">`;
        domSlots.armour?.appendChild(container);
      };
      const defenderItems = ultimata.loadout.defenderItems;
      if (dom.mobileSelection === "self") {
        renderWeapon(
          domSlots.primary,
          defenderItems["1"]?.item[0]
        );
        renderWeapon(
          domSlots.secondary,
          defenderItems["2"]?.item[0]
        );
        renderWeapon(domSlots.melee, defenderItems["3"]?.item[0]);
        renderWeapon(domSlots.temp, defenderItems["5"]?.item[0]);
        Array.from(
          dom.mobileRoot.querySelectorAll(".ultimata-armour-container")
        ).forEach((el) => {
          el.remove();
        });
      } else if (dom.mobileSelection === "target") {
        for (const index of [4, 6, 7, 8, 9]) {
          renderArmour(defenderItems[index.toString()]?.item[0], index);
        }
      }
      ULTIMATA_STATE.update({ rendered: true });
    });
    combined.on(([dom, ultimata]) => {
      if (ultimata.rendered && ultimata.DB?.attackStatus !== "notStarted" && dom.mobileRoot) {
        Array.from(
          dom.mobileRoot.querySelectorAll(".ultimata-armour-container")
        ).forEach((el) => {
          el.remove();
        });
      }
    });
  }
  const stylesCss = ".ultimata-container{display:flex}.ultimata-item-border{box-sizing:border-box;height:100%;position:absolute;top:0;width:100%;z-index:-1}.ultimata-top,.ultimata-bottom{align-items:center;display:flex;font-size:11px;justify-content:space-around}.ultimata-bottom{color:#9c9c9c}.ultimata-top-marker,.ultimata-bottom-marker{align-items:center;background:var(--attack-weaponbox-border-color);box-shadow:var(--attack-weaponbox-marker-shadow);color:var(--attack-weaponbox-marker-color);display:flex;flex:0 0 61px;height:18px;justify-content:center;margin:-2px 0;text-wrap:nowrap}.ultimata-top-marker{background:var(--attack-weaponbox-border-color) linear-gradient(to bottom,#fff0 11.3%,#ffffff1a);border-radius:0 0 5px 5px;box-shadow:inset 0 -1px #ffffff1a,0 0 2px #00000040}.ultimata-bottom-marker{cursor:pointer;background:var(--attack-weaponbox-border-color) linear-gradient(to top,#fff0 11.3%,#ffffff1a);border-radius:5px 5px 0 0;box-shadow:inset 0 1px #ffffff1a,0 0 2px #00000040}.ultimata-item-props{display:flex;font-size:9.5px;height:14px;justify-content:center;overflow:hidden;align-items:flex-end;filter:var(--attack-item-props-filter);flex:0 0 42px;gap:6px}.ultimata-item-stats{display:flex;font-size:9.5px;height:14px;justify-content:center;overflow:hidden;align-items:center;filter:var(--attack-item-props-filter);flex:1}.ultimata-item-stats span{margin-left:2px;color:var(--attack-bonus-info-color);font-size:11px;letter-spacing:-.5px}.ultimata-weapon-image{text-align:center;width:100%;opacity:.5}@media screen and (max-width:600px){.ultimata-weapon-image img{max-width:76px}.ultimata-bottom-marker{border-radius:0;box-shadow:none;margin-bottom:0;background:transparent}.ultimata-weapon-wrapper{height:100px;flex:1}.ultimata-item-props{flex:1;gap:4px;height:16px}}.ultimata-weapon-wrapper{height:100px;width:100%;background-color:var(--attack-weaponbox-background);border:2px solid var(--attack-weaponbox-border-color);box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;position:relative;z-index:0}.ultimata-weapon-wrapper:not(:last-child){margin-bottom:1px}.ultimata-armour-container{position:absolute}.ultimata-armour-image{position:relative}";
  const styles = d(stylesCss);
  document.head.appendChild(styles);
  init$1();
  init();
  init$3();
  init$2();

})();