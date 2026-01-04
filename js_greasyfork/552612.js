// ==UserScript==
// @name             WarEra: Inventory Equipment Icon Toggle
// @namespace        -
// @version          0.17.9-beta-2025Oct15-3
// @description      Add an option in the Inventory interface to toggle the visibility of Equipment icons, allowing more content to be displayed at once.
// @author           LianSheng
// @match            https://app.warera.io/*
// @grant            none
// @run-at           document-idle
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/552612/WarEra%3A%20Inventory%20Equipment%20Icon%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/552612/WarEra%3A%20Inventory%20Equipment%20Icon%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(_ => {
        if (location.href.endsWith("inventory")) {
            const html = `
<div id="__show_icon_container__" class="_1dnmndyahi _1dnmndyafk _1dnmndyajg _1dnmndyjt7 _1dnmndykfp" style="bottom: -12px; right: 20px;">
  <label class="switch-container">
    Show Icon
    <div class="switch">
      <input id="_showIconSwitch" type="checkbox" checked>
      <span class="slider"></span>
    </div>
  </label>
  <style>
    .switch-container {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: sans-serif;
      font-size: 14px;
    }

    .switch {
      position: relative;
      width: 40px;
      height: 20px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: linear-gradient(to right, #4caf50 50%, #f44336 50%);
      background-size: 200% 100%;
      background-position: right;
      border-radius: 20px;
      transition: background-position 0.2s;
    }

    .slider::before {
      content: "";
      position: absolute;
      height: 16px;
      width: 16px;
      left: 2px;
      top: 2px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }

    input:checked+.slider {
      background-position: left;
    }

    input:checked+.slider::before {
      transform: translateX(20px);
    }
  </style>
</div>`;
            const topMenuElem = document.querySelector("#layoutUserMenu");

            if (topMenuElem === null) {
                return;
            }

            if (!topMenuElem.querySelector("#__show_icon_container__")) {
                topMenuElem.insertAdjacentHTML("beforeend", html);
            }

            let switchElem = topMenuElem.querySelector("#_showIconSwitch");

            const weaponElems = document.querySelectorAll("._1dnmndy1oz._1dnmndyk0p._1dnmndyk87._1dnmndyafk._1dnmndyajg._1dnmndyjtc > ._1dnmndykfk");
            const notWeaponElems = document.querySelectorAll("._1dnmndy1oz._1dnmndyago._1dnmndyk0p._1dnmndyk87._1dnmndyafk._1dnmndyajg._1dnmndyjtc > ._1dnmndykfk");
            const equipmentElems = [...weaponElems, ...notWeaponElems];
            switchElem.onchange = () => {
                if (switchElem.checked) {
                    equipmentElems.forEach(e => {
                        const box = e.querySelector("[class='_1dnmndykfk']");
                        const icon = e.querySelector("img");

                        box.style.height = "48px";
                        icon.style.display = "";
                    });
                } else {
                    equipmentElems.forEach(e => {
                        const box = e.querySelector("[class='_1dnmndykfk']");
                        const icon = e.querySelector("img");

                        box.style.height = "0px";
                        icon.style.display = "none";

                    });
                }
            }
        } else {
            const containerElem = document.querySelector("#__show_icon_container__");

            if(containerElem !== null) {
                containerElem.remove();
            }
        }
    }, 50);
})();
