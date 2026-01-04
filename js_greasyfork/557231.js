// ==UserScript==
// @name         Bouillon Unlocker
// @description  Ce script permet de choisir à l'avance le prix a gagner. Le score n'a aucune incidence.
// @version      0.3
// @match        https://bouillonlesite.com/Bouillon_Def/
// @run-at       document-end
// @namespace    bouillon
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557231/Bouillon%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/557231/Bouillon%20Unlocker.meta.js
// ==/UserScript==

(function () {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  function handleStylo() {
    console.log("Fonction Stylo");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = 200;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = 200;
  }

  function handleTicketDor() {
    console.log("Fonction Ticket d'or (coupe-file)");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = -100;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = 200;
  }

  function handleBadge() {
    console.log("Fonction Badge");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = -100;
    gameOptions.lotperdu = 200;
  }

  function handleSticker() {
    console.log("Fonction Sticker");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = -100;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = 200;
  }

  function handleToteBag() {
    console.log("Fonction Tote Bag");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = -100;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = 200;
  }

  function handleAffiche() {
    console.log("Fonction Affiche");
    gameOptions.lot1 = 200;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = -100;
  }

  function handleDefaite() {
    console.log("Fonction Défaite");
    gameOptions.lot1 = -100;
    gameOptions.lot2 = 200;
    gameOptions.lot3 = 200;
    gameOptions.lot4 = 200;
    gameOptions.lot5 = -100;
    gameOptions.lot6 = 200;
    gameOptions.lotticketdor = 200;
    gameOptions.lotperdu = 200;
  }

  function createMainOverlay() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.backdropFilter = "blur(12px)";
    overlay.style.webkitBackdropFilter = "blur(12px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.style.padding = "16px";
    overlay.style.boxSizing = "border-box";

    const box = document.createElement("div");
    box.style.backgroundColor = "#111111";
    box.style.padding = "20px";
    box.style.borderRadius = "16px";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.gap = "14px";
    box.style.width = "100%";
    box.style.maxWidth = "420px";
    box.style.color = "#ffffff";
    box.style.fontFamily =
      "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";

    const title = document.createElement("div");
    title.textContent = "Choisis une récompense";
    title.style.fontSize = "32px";
    title.style.fontWeight = "600";
    title.style.marginBottom = "4px";
    title.style.textAlign = "center";

    const select = document.createElement("select");
    select.style.padding = "10px 12px";
    select.style.borderRadius = "10px";
    select.style.border = "1px solid #444";
    select.style.fontSize = "16px";
    select.style.width = "100%";
    select.style.backgroundColor = "#1c1c1c";
    select.style.color = "#ffffff";
    select.style.outline = "none";
    select.style.appearance = "none";

    const options = [
      { value: "stylo", label: "Stylo" },
      { value: "ticket", label: "Ticket d'or (coupe-file)" },
      { value: "badge", label: "Badge" },
      { value: "sticker", label: "Sticker" },
      { value: "totebag", label: "Tote Bag" },
      { value: "affiche", label: "Affiche" },
      { value: "defaite", label: "Défaite" },
    ];

    options.forEach((opt) => {
      const optionEl = document.createElement("option");
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      select.appendChild(optionEl);
    });

    const button = document.createElement("button");
    button.textContent = "Start";
    button.style.padding = "12px 16px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.borderRadius = "999px";
    button.style.fontSize = "16px";
    button.style.fontWeight = "600";
    button.style.marginTop = "6px";
    button.style.width = "100%";
    button.style.background = "linear-gradient(135deg, #ffb800, #ff6b00)";
    button.style.color = "#000000";
    button.style.boxShadow = "0 8px 18px rgba(0,0,0,0.4)";
    button.style.touchAction = "manipulation";

    const actions = {
      stylo: handleStylo,
      ticket: handleTicketDor,
      badge: handleBadge,
      sticker: handleSticker,
      totebag: handleToteBag,
      affiche: handleAffiche,
      defaite: handleDefaite,
    };

    button.addEventListener("click", () => {
      const value = select.value;
      const fn = actions[value];
      if (typeof fn === "function") {
        fn();
      }
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });

    box.appendChild(title);
    box.appendChild(select);
    box.appendChild(button);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  const launched = getCookie("launched");
  console.log(launched);


  if (launched !== "1") {
    document.addEventListener("mousedown", (e) => {
      if (e.target === document.documentElement) {
        createMainOverlay();
      }
    });
  } else {
    deleteCookie("launched");
    window.location.reload();
  }
})();
