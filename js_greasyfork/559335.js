// ==UserScript==
// @name         med2 Toolbox
// @author       Wurstwasser
// @namespace    http://tampermonkey.net/
// @version      4.11
// @license MIT
// @description  Blendet Beiträge/Zitate ignorierter Nutzer und Threads im Dashboard aus, inkl. Panel mit Tabs und 3 Modi
// @match        https://www.med2-forum.de/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559335/med2%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/559335/med2%20Toolbox.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Zustand laden
  let ignoredUsers = GM_getValue("ignoredUsers", []);
  let ignoredThreads = GM_getValue("ignoredThreads", []);
  let filterMode = GM_getValue("filterMode", 1);
  // 1 = Nur Ignorierte, 2 = Ignorierte + Zitate, 3 = Ignorierte + zitierende Beiträge
  let panelVisible = false; // Start: eingeklappt

  // Beiträge filtern
  function filterPosts() {
    document.querySelectorAll('li[id^="post"]').forEach((li) => {
      const author = li
        .querySelector('div.messageAuthorContainer span[itemprop="name"]')
        ?.innerText.trim();
      if (author && ignoredUsers.includes(author)) {
        li.remove();
        return;
      }
      li.querySelectorAll("blockquote").forEach((bq) => {
        const link = bq.querySelector(".quoteBoxTitle a");
        if (!link) return;
        const quoted = link.textContent.trim();
        if (ignoredUsers.some((name) => quoted.includes(name))) {
          if (filterMode === 2) {
            bq.remove(); // nur Zitat entfernen
          } else if (filterMode === 3) {
            li.remove(); // gesamten Beitrag entfernen
          }
        }
      });
    });
  }

  // Threads im Dashboard filtern
  function filterThreads() {
    document.querySelectorAll("ol.wbbThread").forEach((thread) => {
      const titleEl = thread.querySelector("a.messageGroupLink.wbbTopicLink");
      if (!titleEl) return;
      const threadTitle = titleEl.innerText.trim().toLowerCase();

      // Teilstring-Suche: prüft, ob irgendein Keyword im Titel vorkommt
      if (
        ignoredThreads.some((keyword) =>
          threadTitle.includes(keyword.toLowerCase())
        )
      ) {
        thread.closest("li.tabularListRow")?.remove();
      }
    });
  }

  // Panel erstellen
  const panel = document.createElement("div");
  panel.id = "med2-toolbox";
  panel.style.cssText = `
        position:fixed; top:10px; right:10px;
        background:#fff; border:1px solid #ccc; padding:12px;
        z-index:9999; font-size:14px;
        box-shadow:0 0 10px rgba(0,0,0,0.3); border-radius:6px;
        font-family: Arial, sans-serif;
    `;
  panel.innerHTML = `
        <div id="toolboxHeader" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:nowrap;">
   <strong id="toolboxTitle" style="color:#007acc;">med2 Toolbox</strong>
   <div style="display:flex; align-items:center; gap:8px;">
      <button id="helpBtn" style="cursor:pointer; border:none; background:transparent; font-size:16px;">?</button>
      <button id="togglePanelBtn" style="cursor:pointer; border:none; background:transparent; font-size:16px;">☰</button>
   </div>
</div>



        <div id="panelContent">
              <div class="tab-bar" style="display:flex; border-bottom:1px solid #ccc; margin-bottom:12px; gap:6px;">
                <button id="tabUsers" class="active"
                    style="flex:1; padding:8px; border:1px solid #ccc; border-bottom:none; border-radius:6px 6px 0 0;
                           background:#eaeaea; font-weight:bold; cursor:pointer;">
                    Nutzer
                </button>
                <button id="tabThreads"
                    style="flex:1; padding:8px; border:1px solid #ccc; border-bottom:none; border-radius:6px 6px 0 0;
                           background:#f9f9f9; cursor:pointer;">
                    Fäden
                </button>
            </div>

            <!-- Nutzer-Tab -->
            <div id="tabContentUsers" style="display:block;">
                <div style="margin-bottom:12px;">
                    <strong>Filtermodus:</strong>
                    <select id="modeSelect" style="margin-left:8px; font-size:12px; padding:4px 8px;">
                        <option value="1" ${
                          filterMode === 1 ? "selected" : ""
                        }>Nur Ignorierte ausblenden</option>
                        <option value="2" ${
                          filterMode === 2 ? "selected" : ""
                        }>Ignorierte + deren Zitate ausblenden</option>
                        <option value="3" ${
                          filterMode === 3 ? "selected" : ""
                        }>Ignorierte + zitierende Beiträge ausblenden</option>
                    </select>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong id="usersHeader">Ignorierte Nutzer (0)</strong>
                    <button id="toggleUsersBtn" style="border:none; background:transparent; cursor:pointer;">▼</button>
                </div>
                <ul id="ignoredUsersList"
                    style="margin:8px 0; max-height:140px; overflow-y:auto; border:1px solid #ddd; border-radius:4px; padding:8px;"></ul>

                <div style="margin-top:12px; display:flex; gap:8px;">
                    <input type="text" id="addUserInput" placeholder="Name hinzufügen"
                           style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;">
                    <button id="addUserBtn" style="padding:6px 10px; border:1px solid #ccc; border-radius:4px; background:#f0f0f0;">+</button>
                </div>
            </div>

            <!-- Fäden-Tab -->
            <div id="tabContentThreads" style="display:none;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong id="threadsHeader">Ignorierte Fäden (0)</strong>
                    <button id="toggleThreadsBtn" style="border:none; background:transparent; cursor:pointer;">▼</button>
                </div>
                <ul id="ignoredThreadsList"
                    style="margin:8px 0; max-height:140px; overflow-y:auto; border:1px solid #ddd; border-radius:4px; padding:8px;"></ul>

                <div style="margin-top:12px; display:flex; gap:8px;">
                    <input type="text" id="addThreadInput" placeholder="Fadentitel hinzufügen (exakt)"
                           style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;">
                    <button id="addThreadBtn" style="padding:6px 10px; border:1px solid #ccc; border-radius:4px; background:#f0f0f0;">+</button>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(panel);

  // Responsive Styles
  const style = document.createElement("style");
  style.textContent = `
#med2-toolbox {
  width: 320px;
  max-width: 95vw;
  box-sizing: border-box;
}

/* Eingeklappt: Panel schmal, Titel ausgeblendet */
#med2-toolbox.collapsed {
  width: 50px;          /* schmale Breite */
  height: 45px;         /* gleiche Höhe */
  padding: 0;           /* kein zusätzliches Padding */
  display: flex;        /* Flex-Layout für zentrierte Inhalte */
  align-items: center;  /* vertikal mittig */
  justify-content: center; /* horizontal mittig */
}

#med2-toolbox.collapsed #toolboxHeader {
  margin: 0;            /* Abstand weg */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center; /* Icons mittig */
}

#med2-toolbox.collapsed #toolboxTitle {
  display: none;        /* Titel ausgeblendet */
}


/* Laptops */
@media (max-width: 1440px) {
  #med2-toolbox { width: 300px; }
  #med2-toolbox.collapsed { width: 40px; }
}

/* Tablets */
@media (max-width: 900px) {
  #med2-toolbox { width: 280px; }
  #med2-toolbox.collapsed { width: 40px; }
}

/* Smartphones */
@media (max-width: 600px) {
  #med2-toolbox { width: 240px; right: 10px; left: auto; }
  #med2-toolbox.collapsed { width: 40px; }
}
`;
  document.head.appendChild(style);

  // Referenzen
  const panelContent = document.getElementById("panelContent");
  const togglePanelBtn = document.getElementById("togglePanelBtn");
  const tabUsers = document.getElementById("tabUsers");
  const tabThreads = document.getElementById("tabThreads");
  const tabContentUsers = document.getElementById("tabContentUsers");
  const tabContentThreads = document.getElementById("tabContentThreads");
  const modeSelect = document.getElementById("modeSelect");
  const ignoredUsersList = document.getElementById("ignoredUsersList");
  const addUserInput = document.getElementById("addUserInput");
  const addUserBtn = document.getElementById("addUserBtn");
  const ignoredThreadsList = document.getElementById("ignoredThreadsList");
  const addThreadInput = document.getElementById("addThreadInput");
  const addThreadBtn = document.getElementById("addThreadBtn");
  const helpBtn = document.getElementById("helpBtn");

  // Help-Link
  helpBtn.addEventListener("click", () => {
    window.open("https://greasyfork.org/de/scripts/559335-med2-toolbox", "_blank");
  });

  panelContent.style.display = "none"; // Inhalt versteckt
  panel.classList.add("collapsed"); // Panel schmal

  togglePanelBtn.addEventListener("click", () => {
    panelVisible = !panelVisible;
    panelContent.style.display = panelVisible ? "block" : "none";
    panel.classList.toggle("collapsed", !panelVisible);
  });

  // Tabs schalten
  function activateTab(which) {
    const usersActive = which === "users";
    tabContentUsers.style.display = usersActive ? "block" : "none";
    tabContentThreads.style.display = usersActive ? "none" : "block";
    tabUsers.style.background = usersActive ? "#eaeaea" : "#f9f9f9";
    tabUsers.style.fontWeight = usersActive ? "bold" : "normal";
    tabThreads.style.background = usersActive ? "#f9f9f9" : "#eaeaea";
    tabThreads.style.fontWeight = usersActive ? "normal" : "bold";
  }
  tabUsers.addEventListener("click", () => activateTab("users"));
  tabThreads.addEventListener("click", () => activateTab("threads"));
  activateTab("users");

  // Moduswechsel
  modeSelect.addEventListener("change", () => {
    filterMode = parseInt(modeSelect.value, 10);
    GM_setValue("filterMode", filterMode);
    location.reload();
  });

  // Nutzerliste rendern
  function updateIgnoredUsersUI() {
    const count = ignoredUsers.length;
    document.getElementById(
      "usersHeader"
    ).innerText = `Ignorierte Nutzer (${count})`;

    ignoredUsersList.innerHTML = "";
    if (count === 0) {
      const li = document.createElement("li");
      li.textContent = "<leer>";
      li.style.fontStyle = "italic";
      ignoredUsersList.appendChild(li);
    } else {
      ignoredUsers.forEach((name) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        const span = document.createElement("span");
        span.textContent = name;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖"; // Entfernen-Symbol
        removeBtn.style.cssText =
          "border:none; background:transparent; cursor:pointer; color:#c00; font-size:14px;";
        removeBtn.title = "Nutzer entfernen";

        removeBtn.addEventListener("click", () => {
          ignoredUsers = ignoredUsers.filter((n) => n !== name);
          GM_setValue("ignoredUsers", ignoredUsers);
          alert(`${name} entfernt. Die Seite wird neu geladen.`);
          location.reload();
        });

        li.appendChild(span);
        li.appendChild(removeBtn);
        ignoredUsersList.appendChild(li);
      });
    }
  }

  // Threadliste rendern
  function updateIgnoredThreadsUI() {
    const count = ignoredThreads.length;
    document.getElementById(
      "threadsHeader"
    ).innerText = `Ignorierte Fäden (${count})`;

    ignoredThreadsList.innerHTML = "";
    if (count === 0) {
      const li = document.createElement("li");
      li.textContent = "<leer>";
      li.style.fontStyle = "italic";
      ignoredThreadsList.appendChild(li);
    } else {
      ignoredThreads.forEach((title) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        const span = document.createElement("span");
        span.textContent = title;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖"; // Entfernen-Symbol
        removeBtn.style.cssText =
          "border:none; background:transparent; cursor:pointer; color:#c00; font-size:14px;";
        removeBtn.title = "Faden entfernen";

        removeBtn.addEventListener("click", () => {
          ignoredThreads = ignoredThreads.filter((t) => t !== title);
          GM_setValue("ignoredThreads", ignoredThreads);
          alert(`"${title}" entfernt. Die Seite wird neu geladen.`);
          location.reload();
        });

        li.appendChild(span);
        li.appendChild(removeBtn);
        ignoredThreadsList.appendChild(li);
      });
    }
  }

  // Hinzufügen: Nutzer
  addUserBtn.addEventListener("click", () => {
    const name = addUserInput.value.trim();
    if (!name) return;
    if (!ignoredUsers.includes(name)) {
      ignoredUsers.push(name);
      GM_setValue("ignoredUsers", ignoredUsers);
      addUserInput.value = "";
      updateIgnoredUsersUI();
      filterPosts();
    } else {
      alert(`${name} steht bereits auf der Liste.`);
    }
  });

  // Hinzufügen: Fäden
  addThreadBtn.addEventListener("click", () => {
    const keyword = addThreadInput.value.trim();
    if (!keyword) return;
    if (!ignoredThreads.includes(keyword)) {
      ignoredThreads.push(keyword);
      GM_setValue("ignoredThreads", ignoredThreads);
      addThreadInput.value = "";
      updateIgnoredThreadsUI();
      filterThreads();
    } else {
      alert(`"${keyword}" steht bereits auf der Liste.`);
    }
  });

  // Initialisierung
  updateIgnoredUsersUI();
  updateIgnoredThreadsUI();
  filterPosts();
  filterThreads();

  // MutationObserver für dynamisch nachgeladene Inhalte
  const observer = new MutationObserver(() => {
    filterPosts();
    filterThreads();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();