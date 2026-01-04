// ==UserScript==
// @name         Минимальные недельные требования для Tanks Blitz
// @version      0.1.2
// @namespace    *://blitz-commander.by
// @description  Скрипт для сайта blitz-commander.by. Если не работает перезагрузите страницу
// @author       XAOCiT
// @match        *://blitz-commander.by/clan/*
// @icon         https://cdn-icons-png.flaticon.com/128/942/942355.png
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555331/%D0%9C%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20Tanks%20Blitz.user.js
// @updateURL https://update.greasyfork.org/scripts/555331/%D0%9C%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20Tanks%20Blitz.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const minimumRequirements = [2, 8, 14, 21, 30, 40, 40]; // нормы выполнения за 1-7 дней
  const maxDayOfline = 4; // сколько дней можно отсуствовать
  function getData() {
    const elementMinValues = document.querySelectorAll(".elementMinValue");
    if (elementMinValues.length > 0) {
      elementMinValues.forEach((DomMinValue) => DomMinValue.remove());
    }

    const listRows = document.querySelectorAll(".ui-table__row");
    listRows.forEach((DomItem) => {
      const dateHtml = DomItem.querySelector(".ui-table__cell:last-of-type");
      const date = +dateHtml.textContent.split(" ")[0]; //'408 дн. 27.09.2024' => 408
      const minimumRequirement = getMinimumRequirement(minimumRequirements, date);
      createElementMinValue(dateHtml, minimumRequirement, "beforeend");
    });
    getLatOnline(listRows);
  }

  let observerUsersTimer;
  function runObserverUsers() {
    let observerUsers = new MutationObserver(function (mutations, observer) {
      if (observerUsersTimer) clearTimeout(observerUsersTimer);
      observerUsersTimer = setTimeout(() => {
        getData();
      }, 2000);
    });
    observerUsers.observe(document.querySelector(".page-section:last-of-type"), {
      characterData: false,
      attributes: false,
      childList: true,
      subtree: true,
    });
  }
  setTimeout(runObserverUsers, 4100);
  setTimeout(getData, 4000);

  function getLatOnline(listRows) {
    if (!listRows.length) return;
    listRows.forEach((rowDom) => {
      if (!rowDom.hasAttribute("style")) return;
      rowDom.removeAttribute("style");
    });
    listRows.forEach((rowDom) => createBorderRow(rowDom));
  }

  function createBorderRow(rowDom) {
    const lastOnlineDate = rowDom
      .querySelector(".ui-table__cell:nth-last-child(2) .clan-members-table-desktop__sub")
      .textContent.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
    const lastDays = getDays(lastOnlineDate);
    console.log(lastDays);
    if (lastDays < maxDayOfline) return;
    rowDom.setAttribute("style", " background-color: yellow; font-size: 20px;");
  }

  function getDays(date) {
    const pastDate = new Date(date); // Прошедшая дата
    const currentDate = new Date(); // Текущая дата
    const differenceTime = currentDate.getTime() - pastDate.getTime(); // Разница в миллисекундах
    const days = Math.round(differenceTime / (1000 * 3600 * 24));
    return days;
  }

  function getMinimumRequirement(minimumRequirements, date) {
    let minimumRequirement;
    switch (date) {
      case 0:
      case 1:
        minimumRequirement = minimumRequirements[0];
        break;

      case 2:
        minimumRequirement = minimumRequirements[1];
        break;

      case 3:
        minimumRequirement = minimumRequirements[2];
        break;
      case 4:
        minimumRequirement = minimumRequirements[3];
        break;

      case 5:
        minimumRequirement = minimumRequirements[4];
        break;
      case 6:
        minimumRequirement = minimumRequirements[5];
        break;

      default:
        minimumRequirement = minimumRequirements[6];
        break;
    }
    return minimumRequirement;
  }

  function createElementMinValue(dateHtml, minimumRequirement, insertType = "beforeend") {
    const minimumRequirementBlock = ` <div class="elementMinValue" style="color: red; fontsize: 20px; font-weight:15px">${minimumRequirement} </div>`;
    dateHtml.insertAdjacentHTML(insertType, minimumRequirementBlock);
  }
})();
