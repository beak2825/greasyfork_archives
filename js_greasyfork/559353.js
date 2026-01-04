// ==UserScript==
// @name         BetterPronote++
// @namespace    http://tampermonkey.net/
// @version      8.2.0
// @description  Ultimate customizable theme and enhancement suite for Pronote
// @author       Camille Daguin
// @license      Personal Use Only - No modifications or redistribution
// @match        https://*/pronote/*
// @match        https://*/pronote/eleve.html*
// @match        https://*.index-education.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559353/BetterPronote%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/559353/BetterPronote%2B%2B.meta.js
// ==/UserScript==

(function() {
"use strict";

// Bundled modules

// Module: settings
const predefinedThemes = {
  rose: {
    primaryColor: "#ff69b4",
    lightColor: "#ffc0cb",
    backgroundColor: "#fff5f9",
  },
  bleu: {
    primaryColor: "#4a90e2",
    lightColor: "#7fc4fd",
    backgroundColor: "#f0f8ff",
  },
  vert: {
    primaryColor: "#50c878",
    lightColor: "#90ee90",
    backgroundColor: "#f0fff0",
  },
  violet: {
    primaryColor: "#9370db",
    lightColor: "#dda0dd",
    backgroundColor: "#faf0ff",
  },
  orange: {
    primaryColor: "#ff8c00",
    lightColor: "#ffd700",
    backgroundColor: "#fff8f0",
  },
};

const defaultSettings = {
  enableTheme: true,
  themePreset: "custom", // "rose", "bleu", "vert", "violet", "orange", "custom"
  primaryColor: "#ff69b4",
  lightColor: "#ffc0cb",
  backgroundColor: "#fff5f9",
  borderRadius: 20,
  hideProfilePic: false,
  customTitle: "",
  compactMode: false,
  hideFooter: false,
  hideUserName: false,
  customSchoolName: "",
  enableNoteEditing: false,
  enableHomeworkExport: true,
  // Advanced Features
  enableGradeColoring: true,
  enableQuickCopy: true,
  // Mobile & Accessibility
  mobileOptimized: false,
  largeTouchTargets: false,
  simplifiedLayout: false,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  // Animations
  animationsEnabled: true,
};

const settings = {};
for (let key in defaultSettings) {
  settings[key] = GM_getValue(key, defaultSettings[key]);
}


// Module: modalUI
function generateModalHTML(settings, predefinedThemes) {
  return `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 30px; border-radius: 20px; max-width: 600px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
              <h2 style="color: ${
                settings.primaryColor
              }; margin-top: 0;">🚀 BetterPronote++ Settings</h2>
              <p style="font-size: 12px; color: #666; margin: 5px 0 15px 0;">Created by Camille Daguin</p>

              <div style="margin: 20px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="enableTheme" ${
                        settings.enableTheme ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Activer le thème rose</span>
                  </label>
              </div>

              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${settings.primaryColor};">🎨 Couleurs</h3>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Couleur principale :</label>
                  <input type="color" id="primaryColor" value="${
                    settings.primaryColor
                  }" style="width: 100%; height: 40px; border-radius: 10px; border: 2px solid #ddd;">
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Couleur claire :</label>
                  <input type="color" id="lightColor" value="${
                    settings.lightColor
                  }" style="width: 100%; height: 40px; border-radius: 10px; border: 2px solid #ddd;">
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Couleur de fond :</label>
                  <input type="color" id="backgroundColor" value="${
                    settings.backgroundColor
                  }" style="width: 100%; height: 40px; border-radius: 10px; border: 2px solid #ddd;">
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Thème prédéfini :</label>
                  <select id="themePreset" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #ddd;">
                      <option value="custom" ${
                        settings.themePreset === "custom" ? "selected" : ""
                      }>Personnalisé</option>
                      <option value="rose" ${
                        settings.themePreset === "rose" ? "selected" : ""
                      }>Rose</option>
                      <option value="bleu" ${
                        settings.themePreset === "bleu" ? "selected" : ""
                      }>Bleu</option>
                      <option value="vert" ${
                        settings.themePreset === "vert" ? "selected" : ""
                      }>Vert</option>
                      <option value="violet" ${
                        settings.themePreset === "violet" ? "selected" : ""
                      }>Violet</option>
                      <option value="orange" ${
                        settings.themePreset === "orange" ? "selected" : ""
                      }>Orange</option>
                  </select>
              </div>



              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${settings.primaryColor};">✨ Apparence</h3>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Arrondi des coins (px) : <span id="radiusValue">${
                    settings.borderRadius
                  }</span></label>
                  <input type="range" id="borderRadius" min="0" max="30" value="${
                    settings.borderRadius
                  }" style="width: 100%;">
              </div>



              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${
                settings.primaryColor
              };">🎭 Masquer des éléments</h3>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="hideProfilePic" ${
                        settings.hideProfilePic ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Masquer la photo de profil</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="hideUserName" ${
                        settings.hideUserName ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Masquer "Espace Élèves - Nom Prénom"</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="hideFooter" ${
                        settings.hideFooter ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Masquer le footer</span>
                  </label>
              </div>

              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${
                settings.primaryColor
              };">✏️ Personnalisation</h3>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Texte personnalisé en haut :</label>
                  <input type="text" id="customTitle" value="${
                    settings.customTitle
                  }" placeholder="Ex: Bon courage !" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #ddd;">
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: block; margin-bottom: 5px;">Nom du lycée personnalisé :</label>
                  <input type="text" id="customSchoolName" value="${
                    settings.customSchoolName
                  }" placeholder="Laisser vide pour garder l'original" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #ddd;">
              </div>

                    <div style="margin: 15px 0;">
                        <label style="display: flex; align-items: center; margin-bottom: 10px;">
                            <input type="checkbox" id="compactMode" ${
                              settings.compactMode ? "checked" : ""
                            }>
                            <span style="margin-left: 10px;">Mode compact</span>
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: flex; align-items: center; margin-bottom: 10px;">
                            <input type="checkbox" id="enableNoteEditing" ${
                              settings.enableNoteEditing ? "checked" : ""
                            }>
                            <span style="margin-left: 10px;">Modifier les notes (visuel seulement)</span>
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <button id="resetNoteModifications" style="padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 10px; cursor: pointer;">
                            🔄 Réinitialiser les notes modifiées
                        </button>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: flex; align-items: center; margin-bottom: 10px;">
                            <input type="checkbox" id="enableGradeColoring" ${
                              settings.enableGradeColoring ? "checked" : ""
                            }>
                            <span style="margin-left: 10px;">Coloration automatique des notes</span>
                        </label>
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: flex; align-items: center; margin-bottom: 10px;">
                            <input type="checkbox" id="enableQuickCopy" ${
                              settings.enableQuickCopy ? "checked" : ""
                            }>
                            <span style="margin-left: 10px;">Copie rapide des notes et devoirs</span>
                        </label>
                    </div>



              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${
                settings.primaryColor
              };">📱 Mobile & Accessibilité</h3>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="mobileOptimized" ${
                        settings.mobileOptimized ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Optimisation mobile</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="largeTouchTargets" ${
                        settings.largeTouchTargets ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Cibles tactiles larges</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="highContrast" ${
                        settings.highContrast ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Contraste élevé</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="reducedMotion" ${
                        settings.reducedMotion ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Réduire les animations</span>
                  </label>
              </div>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="largeText" ${
                        settings.largeText ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Texte agrandi</span>
                  </label>
              </div>



              <hr style="margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: ${settings.primaryColor};">🎨 Animations</h3>

              <div style="margin: 15px 0;">
                  <label style="display: flex; align-items: center; margin-bottom: 10px;">
                      <input type="checkbox" id="animationsEnabled" ${
                        settings.animationsEnabled ? "checked" : ""
                      }>
                      <span style="margin-left: 10px;">Animations activées</span>
                  </label>
              </div>



              <div style="display: flex; gap: 10px; margin-top: 30px;">
                  <button id="saveSettings" style="flex: 1; padding: 12px; background: ${
                    settings.primaryColor
                  }; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">
                      💾 Enregistrer
                  </button>
                  <button id="resetSettings" style="flex: 1; padding: 12px; background: #666; color: white; border: none; border-radius: 10px; cursor: pointer;">
                      🔄 Réinitialiser
                  </button>
                  <button id="closeSettings" style="padding: 12px 20px; background: #ddd; color: #333; border: none; border-radius: 10px; cursor: pointer;">
                      ✖️
                  </button>
              </div>
          </div>
      </div>
  `;
}


// Module: modal
function ouvrirParametres() {
  const modal = document.createElement("div");
  modal.id = "pronote-settings-modal";
  modal.innerHTML = generateModalHTML(settings, predefinedThemes);

  document.body.appendChild(modal);

  document.getElementById("borderRadius").addEventListener("input", (e) => {
    document.getElementById("radiusValue").textContent = e.target.value;
  });

  document.getElementById("themePreset").addEventListener("change", (e) => {
    const preset = e.target.value;
    if (preset !== "custom" && predefinedThemes[preset]) {
      document.getElementById("primaryColor").value =
        predefinedThemes[preset].primaryColor;
      document.getElementById("lightColor").value =
        predefinedThemes[preset].lightColor;
      document.getElementById("backgroundColor").value =
        predefinedThemes[preset].backgroundColor;
    }
  });

  document.getElementById("saveSettings").addEventListener("click", () => {
    settings.enableTheme = document.getElementById("enableTheme").checked;
    settings.primaryColor = document.getElementById("primaryColor").value;
    settings.lightColor = document.getElementById("lightColor").value;
    settings.backgroundColor = document.getElementById("backgroundColor").value;
    settings.borderRadius = parseInt(
      document.getElementById("borderRadius").value
    );
    settings.hideProfilePic = document.getElementById("hideProfilePic").checked;
    settings.customTitle = document.getElementById("customTitle").value;
    settings.compactMode = document.getElementById("compactMode").checked;
    settings.hideFooter = document.getElementById("hideFooter").checked;
    settings.hideUserName = document.getElementById("hideUserName").checked;
    settings.customSchoolName =
      document.getElementById("customSchoolName").value;
    settings.enableNoteEditing =
      document.getElementById("enableNoteEditing").checked;
    settings.enableGradeColoring = document.getElementById(
      "enableGradeColoring"
    ).checked;
    settings.enableQuickCopy =
      document.getElementById("enableQuickCopy").checked;

    settings.themePreset = document.getElementById("themePreset").value;
    settings.mobileOptimized =
      document.getElementById("mobileOptimized").checked;
    settings.largeTouchTargets =
      document.getElementById("largeTouchTargets").checked;
    settings.highContrast = document.getElementById("highContrast").checked;
    settings.reducedMotion = document.getElementById("reducedMotion").checked;
    settings.largeText = document.getElementById("largeText").checked;
    settings.animationsEnabled =
      document.getElementById("animationsEnabled").checked;

    for (let key in settings) {
      GM_setValue(key, settings[key]);
    }

    modal.remove();
    location.reload();
  });

  document.getElementById("resetSettings").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment réinitialiser tous les paramètres ?")) {
      for (let key in defaultSettings) {
        GM_setValue(key, defaultSettings[key]);
      }
      modal.remove();
      location.reload();
    }
  });

  document
    .getElementById("resetNoteModifications")
    .addEventListener("click", () => {
      if (
        confirm(
          "Voulez-vous vraiment réinitialiser toutes les modifications de notes ?"
        )
      ) {
        GM_setValue("noteModifications", {});
        alert("Les modifications de notes ont été réinitialisées.");
        location.reload(); // Recharger pour voir les changements
      }
    });

  document.getElementById("closeSettings").addEventListener("click", () => {
    modal.remove();
  });
}


// Module: styles
function generateColorStyles() {
  return `
    /* Arrière-plan */
    body#id_body,
    .interface_affV {
        background: ${settings.backgroundColor} !important;
        color: #000000 !important;
    }

    /* Header */
    .ObjetBandeauEspace {
        background: ${settings.primaryColor} !important;
    }

    /* Menu */
    .objetBandeauEntete_menu {
        background: ${settings.primaryColor} !important;
    }

    /* Tous les boutons */
    .ieBouton,
    button.small-bt,
    .themeBoutonNeutre {
        background: ${settings.primaryColor} !important;
        color: white !important;
        border-radius: ${settings.borderRadius}px !important;
        border: none !important;
        padding: 8px 20px !important;
    }

    /* Boutons "Tout voir" */
    .widget header .cta-conteneur {
        overflow: visible !important;
    }

    .widget header button {
        white-space: nowrap !important;
        color: white !important;
    }

    .widget header button span {
        color: white !important;
    }

    /* Tags */
    .ie-chips,
    .tag-style {
        background: ${settings.primaryColor} !important;
        color: white !important;
        border-radius: ${settings.borderRadius}px !important;
        padding: 5px 15px !important;
    }

    /* Notes */
    .as-info {
        background: ${settings.primaryColor} !important;
        color: white !important;
        border-radius: ${settings.borderRadius}px !important;
        padding: 8px 15px !important;
    }

    /* Date */
    .date-contain {
        background: ${settings.lightColor} !important;
        color: ${settings.primaryColor} !important;
        padding: 8px 12px !important;
        border-radius: ${settings.borderRadius - 10}px !important;
        font-weight: bold !important;
    }

    /* Détail note */
    .Zone-DetailsNotes header {
        border-bottom: 2px solid ${settings.lightColor} !important;
        padding-bottom: 15px !important;
    }

    .Zone-DetailsNotes .ie-titre {
        color: ${settings.primaryColor} !important;
    }

    .details-notes dt {
        color: ${settings.primaryColor} !important;
        font-weight: bold !important;
    }

    /* Radio buttons */
    .iecb.as-chips {
        border-radius: ${settings.borderRadius}px !important;
        transition: all 0.3s ease !important;
    }

    .iecb.as-chips.is-checked {
        background: ${settings.primaryColor} !important;
        color: white !important;
    }

    .iecb.as-chips:not(.is-checked) {
        background: ${settings.lightColor} !important;
        color: ${settings.primaryColor} !important;
    }

    .iecb.as-chips:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1) !important;
    }

    /* Zone tri */
    .objetBandeauEntete_thirdmenu {
        background: ${settings.lightColor} !important;
        padding: 10px !important;
    }

    /* Select */
    .ocb_cont.as-select {
        background: white !important;
        border: 2px solid ${settings.lightColor} !important;
        border-radius: ${settings.borderRadius - 5}px !important;
    }

    .ocb_cont.as-select:hover {
      border-color: ${settings.primaryColor} !important;
    }

    /* Dropdown */
    .deroulant-conteneur-show-hide {
        border-radius: ${settings.borderRadius - 5}px !important;
        border: 2px solid ${settings.lightColor} !important;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15) !important;
    }

    .as-li:hover {
        background: ${settings.lightColor} !important;
        color: ${settings.primaryColor} !important;
    }

    .as-li[aria-selected="true"] {
        background: ${settings.primaryColor} !important;
        color: white !important;
    }

    /* Modale */
    .ObjetFenetre_Espace {
        border-radius: ${settings.borderRadius}px !important;
        border: 3px solid ${settings.primaryColor} !important;
    }

    .Fenetre_Titre {
        background: ${settings.primaryColor} !important;
        color: white !important;
        border-radius: ${settings.borderRadius - 5}px ${
    settings.borderRadius - 5
  }px 0 0 !important;
    }
  `;
}

function generateLayoutStyles() {
  return `
    /* Bandeaux (banners) - remove border-radius */
    .objetbandeauentete_global,
    .ObjetBandeauEspace,
    .objetBandeauEntete_menu,
    .objetBandeauEntete_secondmenu,
    .objetBandeauEntete_thirdmenu {
        border-radius: 0 !important;
    }

    /* Buttons inside banners should also be square */
    .objetBandeauEntete_secondmenu .btnImage,
    .objetBandeauEntete_secondmenu .btnImageIcon,
    .objetBandeauEntete_menu .btnImage,
    .objetBandeauEntete_menu .btnImageIcon {
        border-radius: 0 !important;
    }

    /* Widgets */
    .widget,
    section.widget {
        border-radius: ${settings.borderRadius}px !important;
        border: 2px solid ${settings.lightColor} !important;
        overflow: visible !important;
    }

    /* Header des widgets */
    .widget header {
        background: ${settings.lightColor} !important;
        border-radius: ${settings.borderRadius - 2}px ${
    settings.borderRadius - 2
  }px 0 0 !important;
    }

    .widget header h2,
    .widget header h3,
    .widget header span {
        color: ${settings.primaryColor} !important;
    }

    /* Emploi du temps */
    .liste-cours li {
        border-radius: ${settings.borderRadius - 5}px !important;
        margin: 8px 0 !important;
    }

    /* Travail à faire */
    .conteneur-item {
        border-radius: ${settings.borderRadius - 5}px !important;
        margin: 10px 0 !important;
    }

    /* Notes */
    .liste-clickable li {
        border-radius: ${settings.borderRadius - 8}px !important;
        margin: 8px 0 !important;
    }

    /* Inputs */
    input[type="text"],
    input[type="search"],
    .ocb_cont,
    .ocb-libelle {
        border-radius: ${settings.borderRadius - 5}px !important;
        border: 2px solid ${settings.lightColor} !important;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 12px !important;
    }

    ::-webkit-scrollbar-thumb {
        background: ${settings.primaryColor} !important;
        border-radius: 10px !important;
    }

    ::-webkit-scrollbar-track {
        background: ${settings.backgroundColor} !important;
        border-radius: 10px !important;
    }

    /* Footer */
    footer.ObjetBandeauPied {
        background: ${settings.primaryColor} !important;
        border-radius: ${settings.borderRadius}px ${
    settings.borderRadius
  }px 0 0 !important;
        ${settings.hideFooter ? "display: none !important;" : ""}
    }

    footer a,
    .ObjetBandeauPied a,
    .ibp-command {
        color: white !important;
    }

    /* Submenu */
    .submenu-wrapper {
        border-radius: ${settings.borderRadius - 5}px !important;
    }

    /* Photo profil */
    .ibe_util_photo {
        ${settings.hideProfilePic ? "display: none !important;" : ""}
    }

    .ibe_util_photo img {
        border-radius: 50% !important;
    }

    /* Wrapper */
    .wrapper-cols {
        padding: ${settings.compactMode ? "5px" : "10px"} !important;
    }

    /* Zone sans événements */
    .no-events {
        border-radius: ${settings.borderRadius - 5}px !important;
        background: ${settings.backgroundColor} !important;
        padding: 20px !important;
    }

    /* Checkbox */
    .iecb span {
        border-radius: 8px !important;
    }

    /* Hover */
    .liste-clickable li:hover,
    .conteneur-item:hover,
    .liste-cours li:hover {
        background: ${settings.backgroundColor} !important;
        transition: background 0.3s ease !important;
    }

    /* Second menu */
    .objetBandeauEntete_secondmenu {
        background: ${settings.lightColor} !important;
    }

    /* Menu items */
    .item-menu_niveau0,
    .item-menu_niveau1,
    .item-menu_niveau2 {
        border-radius: ${settings.borderRadius - 10}px !important;
        margin: 2px 5px !important;
    }

    /* Boutons icône */
    .btnImage,
    .btnImageIcon {
        border-radius: 50% !important;
    }

    /* Lien wrapper */
    .wrapper-link {
        border-radius: ${settings.borderRadius - 8}px !important;
    }

    /* Liste des notes */
    .ListeDernieresNotes,
    .InterfaceDernieresNotes {
        background: white !important;
        border-radius: ${settings.borderRadius}px !important;
        border: 2px solid ${settings.lightColor} !important;
    }

    /* Cellules de notes */
    .liste_celluleGrid {
        border-radius: ${settings.borderRadius - 10}px !important;
        margin: 5px 0 !important;
        transition: all 0.3s ease !important;
    }

    .liste_celluleGrid:hover {
        background: ${settings.backgroundColor} !important;
        transform: translateX(3px) !important;
    }

    .liste_celluleGrid.selected {
        background: ${settings.lightColor} !important;
        border-left: 4px solid ${settings.primaryColor} !important;
    }

    /* Notes affichées */
    .note-devoir {
        background: ${settings.primaryColor} !important;
        color: white !important;
        padding: 5px 15px !important;
        border-radius: ${settings.borderRadius}px !important;
        font-weight: bold !important;
    }

    /* Détail note */
    .Zone-DetailsNotes {
        background: white !important;
        border-radius: ${settings.borderRadius}px !important;
        border: 2px solid ${settings.lightColor} !important;
        padding: 20px !important;
    }
  `;
}

function generateResponsiveStyles() {
  return `
    /* Mobile Optimizations */
    ${
      settings.mobileOptimized
        ? `
    @media (max-width: 768px) {
        .widget {
            margin: 8px 4px !important;
            padding: 12px !important;
        }

        .widget header {
            padding: 12px 8px !important;
            font-size: 14px !important;
        }

        ${
          settings.largeTouchTargets
            ? `
        button, .ieBouton, input, select {
            min-height: 44px !important;
            min-width: 44px !important;
        }
        `
            : ""
        }

        ${
          settings.simplifiedLayout
            ? `
        .submenu-wrapper,
        .objetBandeauEntete_secondmenu {
            display: none !important;
        }

        .widget:not(:has(.important-content)) {
            opacity: 0.6;
        }
        `
            : ""
        }
    }
    `
        : ""
    }

    /* Responsive */
    @media (max-width: 768px) {
        .widget {
            margin: 10px 5px !important;
        }
        .wrapper-cols {
            padding: 5px !important;
        }
    }

    /* Mode compact */
    ${
      settings.compactMode
        ? `
        .widget {
            margin: 5px !important;
        }
        .widget header {
            padding: 8px !important;
        }
        .liste-cours li,
        .conteneur-item,
        .liste-clickable li {
            margin: 4px 0 !important;
            padding: 8px !important;
        }
    `
        : ""
    }
  `;
}

function generateAccessibilityStyles() {
  return `
    /* Accessibility */
    ${
      settings.highContrast
        ? `
    .widget {
      border: 3px solid #000 !important;
    }

    .widget header {
      background: #000 !important;
      color: #fff !important;
    }
    `
        : ""
    }

    ${
      settings.reducedMotion
        ? `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    `
        : ""
    }

    ${
      settings.largeText
        ? `
    body, .widget, .widget header h2, .widget header h3 {
      font-size: 1.2em !important;
    }
    `
        : ""
    }

    /* Animation Controls */
    ${
      !settings.animationsEnabled
        ? `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
    `
        : `
    .widget:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
      transition: all 0.3s ease !important;
    }
    `
    }
  `;
}

function generateCSS() {
  return `
    ${generateColorStyles()}
    ${generateLayoutStyles()}
    ${generateResponsiveStyles()}
    ${generateAccessibilityStyles()}

    /* Coloration automatique des notes selon la performance */
    ${
      settings.enableGradeColoring
        ? `
    .note-devoir.grade-excellent {
        background: #228B22 !important; /* Vert pour excellent (16-20/20) */
    }

    .note-devoir.grade-good {
        background: #4169E1 !important; /* Bleu/cyan pour bien (12-15/20) */
    }

    .note-devoir.grade-average {
        background: #FF8C00 !important; /* Orange pour moyen (10-11/20) */
    }

    .note-devoir.grade-poor {
        background: #DC143C !important; /* Rouge pour faible (<10/20) */
    }

    .note-devoir.grade-absent {
        background: #808080 !important; /* Gris pour absence */
    }
    `
        : ""
    }
  `;
}


// Module: noteEditing
function enableNoteEditing() {
  const noteModifications = GM_getValue("noteModifications", {});

  function getNoteId(noteElement) {
    // Vérifier si l'élément a déjà un ID attribué
    if (noteElement.hasAttribute("data-note-id")) {
      return noteElement.getAttribute("data-note-id");
    }

    // Essayer de trouver le contexte (matière et date) pour créer un ID plus stable
    let contextId = "";

    // Vérifier si on est dans une popup détail
    const detailContainer = noteElement.closest(".Zone-DetailsNotes");
    if (detailContainer) {
      // Dans la popup détail, chercher le titre et la date
      const titleElement = detailContainer.querySelector(".ie-titre");
      const dateMatch = detailContainer.textContent.match(
        /Note du (\d{1,2} \w+ \d{4})/
      );
      const dateText = dateMatch ? dateMatch[1] : null;

      if (titleElement && dateText) {
        const title = titleElement.textContent.trim();
        contextId = title + "|" + dateText;
      }
    } else {
      // Dans la liste principale
      const noteContainer = noteElement.closest(".liste_celluleGrid");

      if (noteContainer) {
        // Chercher le titre de la matière
        const titleElement = noteContainer.querySelector(".titre-principal");
        const dateElement = noteContainer.querySelector(".date-contain");

        if (titleElement && dateElement) {
          const title = titleElement.textContent.trim();
          const date =
            dateElement.getAttribute("datetime") ||
            dateElement.textContent.trim();
          contextId = title + "|" + date;
        }
      }
    }

    // Si on n'a pas trouvé de contexte, utiliser l'ancienne méthode
    if (!contextId) {
      const originalText = noteElement.textContent.trim();
      const parentElement = noteElement.parentElement;
      const siblingIndex = parentElement
        ? Array.from(parentElement.children).indexOf(noteElement)
        : 0;

      contextId = originalText + "|" + siblingIndex;
    }

    // Utiliser un hash simple du contexte
    let hash = 0;
    for (let i = 0; i < contextId.length; i++) {
      hash = (hash * 31 + contextId.charCodeAt(i)) & 0x7fffffff;
    }

    const noteId = hash.toString(36);
    noteElement.setAttribute("data-note-id", noteId);
    return noteId;
  }

  // Fonction pour restaurer une note modifiée
  function restoreModifiedNote(noteElement) {
    const noteId = getNoteId(noteElement);
    const modifiedValue = noteModifications[noteId];
    if (modifiedValue) {
      const originalText = noteElement.textContent.trim();
      let maxNote = "";
      if (originalText.includes("/")) {
        maxNote = originalText.split("/")[1]?.trim() || "";
      }
      noteElement.innerHTML = "";
      noteElement.textContent = modifiedValue;
      if (maxNote) {
        const slashSpan = document.createElement("span");
        slashSpan.textContent = "/" + maxNote;
        noteElement.appendChild(slashSpan);
      }
    }
  }

  // Fonction pour rendre une note éditable
  function makeNoteEditable(noteElement) {
    const originalText = noteElement.textContent.trim();

    // Extraire la partie note (avant le /)
    let noteValue = originalText;
    let maxNote = "";

    if (originalText.includes("/")) {
      const parts = originalText.split("/");
      noteValue = parts[0].trim();
      maxNote = parts[1] ? parts[1].trim() : "";
    }

    // Créer un input temporaire
    const input = document.createElement("input");
    input.type = "text";
    input.value = noteValue;
    input.style.cssText = `
      background: white;
      border: 2px solid ${settings.primaryColor};
      border-radius: ${settings.borderRadius}px;
      padding: 2px 6px;
      font-size: inherit;
      font-weight: bold;
      color: ${settings.primaryColor};
      width: 60px;
      text-align: center;
    `;

    // Remplacer le contenu par l'input
    noteElement.innerHTML = "";
    noteElement.appendChild(input);
    input.focus();
    input.select();

    // Fonction pour sauvegarder
    function saveNote() {
      const newValue = input.value.trim();
      if (newValue !== "") {
        // Sauvegarder la modification
        const noteId = getNoteId(noteElement);
        noteModifications[noteId] = newValue;
        GM_setValue("noteModifications", noteModifications);

        // Nettoyer le contenu existant et définir la nouvelle valeur
        noteElement.innerHTML = "";
        noteElement.textContent = newValue;
        if (maxNote) {
          const slashSpan = document.createElement("span");
          slashSpan.textContent = "/" + maxNote;
          noteElement.appendChild(slashSpan);
        }
      } else {
        // Restaurer l'original si vide
        noteElement.textContent = originalText;
      }
      noteElement.style.cursor = "pointer";
      noteElement.title = "Cliquez pour modifier";
    }

    // Événements
    input.addEventListener("blur", saveNote);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveNote();
      } else if (e.key === "Escape") {
        // Annuler
        noteElement.textContent = originalText;
        noteElement.style.cursor = "pointer";
        noteElement.title = "Cliquez pour modifier";
      }
    });
  }

  // Attendre que les notes soient chargées et ajouter les event listeners
  function addNoteEditingListeners() {
    // Approche simplifiée : rendre tous les éléments de notes directement cliquables
    function makeNoteClickable(noteElement) {
      if (!noteElement.hasAttribute("data-editable")) {
        // Attribuer un ID persistant
        getNoteId(noteElement);

        noteElement.setAttribute("data-editable", "true");
        noteElement.style.cursor = "pointer";
        noteElement.title = "Cliquez pour modifier";

        // Restaurer la note modifiée si elle existe
        restoreModifiedNote(noteElement);

        // Ajouter event listener directement sur l'élément note
        noteElement.addEventListener("click", (e) => {
          e.stopPropagation(); // Empêcher la propagation
          makeNoteEditable(noteElement);
        });
      }
    }

    // Sélectionner toutes les notes
    document.querySelectorAll(".note-devoir").forEach(makeNoteClickable);

    // Sélectionner aussi toutes les notes dans la section détail
    document.querySelectorAll(".details-notes dd").forEach((ddElement) => {
      const text = ddElement.textContent.trim();
      // Rendre modifiables toutes les notes numériques dans la popup détail
      if (
        /^\d+[\.,]\d+$/.test(text) ||
        (/\d/.test(text) && text.includes("/"))
      ) {
        makeNoteClickable(ddElement);
      }
    });
  }

  // Observer les changements dans le DOM pour les nouvelles notes
  const observer = new MutationObserver(() => {
    addNoteEditingListeners();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Observer aussi les changements dans les popups détails
  const detailObserver = new MutationObserver(() => {
    // Quand une popup détail apparaît, restaurer les modifications
    setTimeout(() => {
      document.querySelectorAll(".details-notes dt").forEach((dtElement) => {
        if (dtElement.textContent.trim() === "Note élève :") {
          const ddElement = dtElement.nextElementSibling;
          if (ddElement && ddElement.tagName === "DD") {
            if (!ddElement.hasAttribute("data-editable")) {
              ddElement.setAttribute("data-editable", "true");
              ddElement.style.cursor = "pointer";
              ddElement.title = "Cliquez pour modifier";

              // Restaurer la modification si elle existe
              restoreModifiedNote(ddElement);

              ddElement.addEventListener("click", () => {
                makeNoteEditable(ddElement);
              });
            }
          }
        }
      });
    }, 500); // Délai pour s'assurer que le contenu est chargé
  });

  detailObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Vérifier périodiquement les nouvelles popups détail
  setInterval(() => {
    document.querySelectorAll(".details-notes dd").forEach((ddElement) => {
      const dtElement = ddElement.previousElementSibling;
      if (
        dtElement &&
        dtElement.tagName === "DT" &&
        dtElement.textContent.trim() === "Note élève :"
      ) {
        if (!ddElement.hasAttribute("data-editable")) {
          ddElement.setAttribute("data-editable", "true");
          ddElement.style.cursor = "pointer";
          ddElement.title = "Cliquez pour modifier";
          restoreModifiedNote(ddElement);
          ddElement.addEventListener("click", () =>
            makeNoteEditable(ddElement)
          );
        }
      }
    });
  }, 1000);

  // Ajouter les listeners initiaux
  addNoteEditingListeners();
}


// Module: gradeColoring
function enableGradeColoring() {
  function applyGradeColoring() {
    document.querySelectorAll(".note-devoir").forEach((noteElement) => {
      noteElement.classList.remove(
        "grade-excellent",
        "grade-good",
        "grade-average",
        "grade-poor",
        "grade-absent"
      );

      const text = noteElement.textContent.trim();

      if (text.toLowerCase().includes("abs")) {
        noteElement.classList.add("grade-absent");
        return;
      }

      const gradeMatch = text.match(/^(\d+[\.,]?\d*)(?:[\/\\](\d+))?/);
      if (gradeMatch) {
        let grade = parseFloat(gradeMatch[1].replace(",", "."));
        const scale = gradeMatch[2] ? parseInt(gradeMatch[2]) : 20;

        if (scale === 10) {
          grade = grade * 2;
        }

        const normalizedGrade = Math.round(grade);
        if (normalizedGrade >= 16) {
          noteElement.classList.add("grade-excellent");
        } else if (normalizedGrade >= 12) {
          noteElement.classList.add("grade-good");
        } else if (normalizedGrade >= 10) {
          noteElement.classList.add("grade-average");
        } else {
          noteElement.classList.add("grade-poor");
        }
      }
    });
  }

  applyGradeColoring();

  const observer = new MutationObserver(() => {
    applyGradeColoring();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


// Module: quickCopy
function enableQuickCopy() {
  function addQuickCopyListeners() {
    document.querySelectorAll(".note-devoir").forEach((noteElement) => {
      if (!noteElement.hasAttribute("data-copy-enabled")) {
        noteElement.setAttribute("data-copy-enabled", "true");
        noteElement.style.cursor = "pointer";
        noteElement.title = "Cliquez pour copier les informations";

        noteElement.addEventListener("click", (e) => {
          if (e.ctrlKey || e.metaKey) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          const noteContainer = noteElement.closest(".liste_celluleGrid");
          if (noteContainer) {
            const subjectElement =
              noteContainer.querySelector(".titre-principal");
            const subject = subjectElement
              ? subjectElement.textContent.trim()
              : "Matière inconnue";
            const grade = noteElement.textContent.trim();

            const copyText = `Note : ${grade} | Matière : ${subject}`;
            navigator.clipboard.writeText(copyText).then(() => {
              const originalText = noteElement.textContent;
              noteElement.textContent = "✅ Copié !";
              setTimeout(() => {
                noteElement.textContent = originalText;
              }, 1000);
            });
          }
        });
      }
    });

    document.querySelectorAll(".conteneur-item").forEach((homeworkElement) => {
      if (!homeworkElement.hasAttribute("data-copy-enabled")) {
        homeworkElement.setAttribute("data-copy-enabled", "true");
        homeworkElement.style.cursor = "pointer";
        homeworkElement.title =
          "Cliquez pour copier les informations du devoir";

        homeworkElement.addEventListener("click", (e) => {
          if (e.ctrlKey || e.metaKey) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          const subjectElement =
            homeworkElement.querySelector(".titre-matiere");
          const dateElement = homeworkElement.querySelector(".ie-sous-titre");
          const descriptionElement =
            homeworkElement.querySelector(".description");

          const subject = subjectElement
            ? subjectElement.textContent.trim()
            : "Matière inconnue";
          const date = dateElement
            ? dateElement.textContent.trim()
            : "Date inconnue";
          const description = descriptionElement
            ? descriptionElement.textContent.trim()
            : "Description inconnue";

          const copyText = `Date : ${date} | Matière : ${subject} | Travail à faire : ${description}`;
          navigator.clipboard.writeText(copyText).then(() => {
            const originalCursor = homeworkElement.style.cursor;
            homeworkElement.style.cursor = "default";
            homeworkElement.style.backgroundColor = "#d4edda";
            setTimeout(() => {
              homeworkElement.style.cursor = originalCursor;
              homeworkElement.style.backgroundColor = "";
            }, 1000);
          });
        });
      }
    });
  }

  addQuickCopyListeners();

  const observer = new MutationObserver(() => {
    addQuickCopyListeners();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


// Module: theme
function waitForElement(selector, callback, maxWait = 10000) {
  const startTime = Date.now();
  const check = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else if (Date.now() - startTime < maxWait) {
      setTimeout(check, 100);
    }
  };
  check();
}

function applyTheme() {
  if (settings.hideUserName) {
    waitForElement(".ibe_util_texte", (userName) => {
      userName.style.display = "none";
    });
  }

  if (settings.customSchoolName && settings.customSchoolName.trim() !== "") {
    waitForElement(".ibe_etab", (schoolName) => {
      const icon = schoolName.querySelector("i");
      const textNode = Array.from(schoolName.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.textContent = settings.customSchoolName;
      } else {
        schoolName.textContent = settings.customSchoolName;
        if (icon) schoolName.insertBefore(icon, schoolName.firstChild);
      }
    });
  }

  const style = document.createElement("style");
  style.setAttribute("data-tampermonkey-rose", "true");
  style.textContent = generateCSS();
  document.head.appendChild(style);

  if (settings.customTitle && settings.customTitle.trim() !== "") {
    const customDiv = document.createElement("div");
    customDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${settings.primaryColor};
      color: white;
      padding: 10px 20px;
      border-radius: ${settings.borderRadius}px;
      z-index: 9999;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    customDiv.textContent = settings.customTitle;
    document.body.appendChild(customDiv);
  }

  if (settings.enableNoteEditing) {
    enableNoteEditing();
  }

  if (settings.enableGradeColoring) {
    enableGradeColoring();
  }

  if (settings.enableQuickCopy) {
    enableQuickCopy();
  }

  console.log("🚀 BetterPronote++ activated! 🚀");
}


// Module: exportHomework
function enableHomeworkExport() {
  function addExportButton() {
    // Look for the homework container
    const homeworkContainer = document.querySelector(".conteneur-liste-CDT");
    if (!homeworkContainer) return;

    // Check if buttons already exist
    if (document.querySelector(".export-buttons-container")) return;

    // Create container for both buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "export-buttons-container";
    buttonContainer.style.cssText =
      "display: flex; gap: 0.5rem; margin-bottom: 1rem; margin-left: 1rem;";

    // TXT Export Button
    const txtButton = document.createElement("button");
    txtButton.className =
      "themeBoutonNeutre small-bt ieBouton ie-ripple NoWrap ieBoutonDefautSansImage";
    txtButton.innerHTML = "📄 TXT";
    txtButton.title = "Exporter en format texte";

    txtButton.addEventListener("click", () => {
      const homeworkData = extractHomeworkData();
      const txtContent = formatHomeworkAsText(homeworkData);
      downloadTextFile(txtContent, "devoirs.txt");
    });

    // ICS Export Button
    const icsButton = document.createElement("button");
    icsButton.className =
      "themeBoutonNeutre small-bt ieBouton ie-ripple NoWrap ieBoutonDefautSansImage";
    icsButton.innerHTML = "📅 ICS";
    icsButton.title = "Exporter vers calendrier (Google Calendar, Outlook...)";

    icsButton.addEventListener("click", () => {
      const homeworkData = extractHomeworkData();
      const icsContent = formatHomeworkAsICS(homeworkData);
      downloadTextFile(icsContent, "devoirs.ics", "text/calendar");
    });

    buttonContainer.appendChild(txtButton);
    buttonContainer.appendChild(icsButton);

    // Insert buttons at the top of the homework list
    const firstElement = homeworkContainer.querySelector(".liste-date");
    if (firstElement && firstElement.parentNode) {
      firstElement.parentNode.insertBefore(buttonContainer, firstElement);
    }
  }

  function extractHomeworkData() {
    const homeworkData = [];

    // Find all date sections
    document.querySelectorAll(".liste-date > li").forEach((dateSection) => {
      const dateHeader = dateSection.querySelector("h2");
      if (!dateHeader) return;

      const dateText = dateHeader.textContent.trim().replace(/^Pour\s+/, "");
      const dateId = dateSection.querySelector("div[id]")?.id || "";

      const assignments = [];

      // Find all assignments for this date
      dateSection.querySelectorAll(".conteneur-item").forEach((item) => {
        const subjectElement = item.querySelector(".titre-matiere");
        const dateInfoElement = item.querySelector(".ie-sous-titre");
        const descriptionElement = item.querySelector(".description");
        const statusElement = item.querySelector(".tag-style");

        const subject = subjectElement ? subjectElement.textContent.trim() : "";
        const dateInfo = dateInfoElement
          ? dateInfoElement.textContent.trim()
          : "";
        const description = descriptionElement
          ? descriptionElement.textContent.trim()
          : "";
        const status = statusElement
          ? statusElement.textContent.trim()
          : "Non spécifié";

        assignments.push({
          subject,
          dateInfo,
          description,
          status,
        });
      });

      if (assignments.length > 0) {
        homeworkData.push({
          date: dateText,
          dateId,
          assignments,
        });
      }
    });

    return homeworkData;
  }

  function formatHomeworkAsText(homeworkData) {
    let text =
      "EXPORT DES DEVOIRS - " + new Date().toLocaleDateString("fr-FR") + "\n";
    text += "=".repeat(50) + "\n\n";

    homeworkData.forEach((dateGroup) => {
      text += `📅 ${dateGroup.date}\n`;
      text += "-".repeat(30) + "\n";

      dateGroup.assignments.forEach((assignment, index) => {
        text += `${index + 1}. ${assignment.subject}\n`;
        text += `   Statut: ${assignment.status}\n`;
        text += `   ${assignment.dateInfo}\n`;
        if (assignment.description) {
          text += `   Description: ${assignment.description.replace(
            /\n/g,
            "\n   "
          )}\n`;
        }
        text += "\n";
      });

      text += "\n";
    });

    text += "=".repeat(50) + "\n";
    text += "Généré par BetterPronote++\n";

    return text;
  }

  function formatHomeworkAsICS(homeworkData) {
    let ics = "BEGIN:VCALENDAR\n";
    ics += "VERSION:2.0\n";
    ics += "PRODID:-//BetterPronote++//Homework Export//FR\n";
    ics += "CALSCALE:GREGORIAN\n";
    ics += "METHOD:PUBLISH\n";

    const now = new Date();
    const timestamp = formatDateForICS(now);

    // Mappage des matières vers des emojis pour plus de visuel
    const subjectEmojis = {
      MATHEMATIQUES: "🔢",
      FRANCAIS: "📖",
      "HISTOIRE-GEOGRAPHIE": "🌍",
      ANGLAIS: "🇬🇧",
      ESPAGNOL: "🇪🇸",
      ALLEMAND: "🇩🇪",
      "PHYSIQUE-CHIMIE": "⚗️",
      "SCIENCES VIE & TERRE": "🧬",
      SES: "💰",
      "ENS. MORAL & CIVIQUE": "⚖️",
      EPS: "⚽",
      "ARTS PLASTIQUES": "🎨",
      MUSIQUE: "🎵",
      TECHNOLOGIE: "🔧",
    };

    homeworkData.forEach((dateGroup) => {
      const dueDate = parseFrenchDate(dateGroup.date);
      if (!dueDate) return; // Skip if date parsing failed

      dateGroup.assignments.forEach((assignment, index) => {
        const eventId = `homework-${
          dateGroup.dateId || dateGroup.date.replace(/\s+/g, "-")
        }-${index}@betterpronote`;

        // Déterminer l'emoji pour la matière
        const emoji = Object.keys(subjectEmojis).find((key) =>
          assignment.subject.toUpperCase().includes(key)
        )
          ? subjectEmojis[
              Object.keys(subjectEmojis).find((key) =>
                assignment.subject.toUpperCase().includes(key)
              )
            ]
          : "📚";

        ics += "BEGIN:VEVENT\n";
        ics += `UID:${eventId}\n`;
        ics += `DTSTART;VALUE=DATE:${formatDateForICS(dueDate, true)}\n`;
        ics += `DTEND;VALUE=DATE:${formatDateForICS(
          new Date(dueDate.getTime() + 24 * 60 * 60 * 1000),
          true
        )}\n`; // End date is next day

        // Titre = le devoir (description) ou matière si pas de description
        const eventTitle =
          assignment.description && assignment.description.trim()
            ? assignment.description.trim().split("\n")[0].substring(0, 100) // Première ligne, max 100 chars
            : assignment.subject;

        ics += `SUMMARY:${escapeICSText(eventTitle)}\n`;

        // Description avec emojis et sans statut
        let description = `📚 Matière: ${assignment.subject}\n`;
        // Extraire seulement la partie date sans [X Jours]
        const dateOnly = assignment.dateInfo.replace(/\s*\[\d+\s*Jours?\]/, "");
        description += `📅 ${dateOnly}`;

        if (assignment.description && assignment.description.trim()) {
          // Ajouter le reste de la description si elle fait plus d'une ligne
          const descriptionLines = assignment.description.trim().split("\n");
          if (descriptionLines.length > 1) {
            description += `\n\n📝 Détails:\n${descriptionLines
              .slice(1)
              .join("\n")}`;
          }
        }

        description += `\n\n🤖 Exporté depuis BetterPronote++`;

        ics += `DESCRIPTION:${escapeICSText(description)}\n`;

        ics += "END:VEVENT\n";
      });
    });

    ics += "END:VCALENDAR\n";
    return ics;
  }

  function calculateUrgency(dateInfo) {
    // Analyse la date pour déterminer l'urgence
    const dayMatch = dateInfo.match(/\[(\d+)\s*Jours?\]/);
    if (dayMatch) {
      const daysLeft = parseInt(dayMatch[1]);
      if (daysLeft <= 1) return 1; // Urgent
      if (daysLeft <= 3) return 5; // Important
      if (daysLeft <= 7) return 7; // Normal
    }
    return 9; // Faible
  }

  function parseFrenchDate(dateString) {
    // Handle various French date formats like "lundi 17 novembre", "mardi 18 novembre", "aujourd'hui", etc.
    const today = new Date();

    // Handle "aujourd'hui"
    if (dateString.toLowerCase().includes("aujourd'hui")) {
      return today;
    }

    // Extract date components - look for patterns like "17 novembre", "18 novembre", etc.
    const dateMatch = dateString.match(/(\d{1,2})\s+(\w+)\s*(\d{4})?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const monthName = dateMatch[2].toLowerCase();
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();

      const monthNames = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
      };

      const month = monthNames[monthName];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        // If the date is in the past and we're in December, assume it's next year
        if (date < today && today.getMonth() === 11 && month < 6) {
          date.setFullYear(year + 1);
        }
        return date;
      }
    }

    // If parsing fails, return null
    return null;
  }

  function formatDateForICS(date, dateOnly = false) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (dateOnly) {
      return `${year}${month}${day}`;
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  function escapeICSText(text) {
    // Escape special characters for ICS format
    return text
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/;/g, "\\;") // Escape semicolons
      .replace(/,/g, "\\,") // Escape commas
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "") // Remove carriage returns
      .replace(/:/g, "\\:"); // Escape colons (though not strictly required)
  }

  function downloadTextFile(
    content,
    filename,
    mimeType = "text/plain;charset=utf-8"
  ) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  // Add button initially
  addExportButton();

  // Watch for DOM changes to add button if homework content loads dynamically
  const observer = new MutationObserver(() => {
    addExportButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


// Module: index
// GM_registerMenuCommand("⚙️ BetterPronote++ Settings", ouvrirParametres);

if (!settings.enableTheme) return;

setTimeout(() => {
  applyTheme();

  // Enable features based on settings
  if (settings.enableHomeworkExport) {
    enableHomeworkExport();
  }
}, 1000);


})();

(function() {
"use strict";

// Bundled modules

// Module: exportHomework
function enableHomeworkExport() {
  function addExportButton() {
    // Look for the homework container
    const homeworkContainer = document.querySelector(".conteneur-liste-CDT");
    if (!homeworkContainer) return;

    // Check if buttons already exist
    if (document.querySelector(".export-buttons-container")) return;

    // Create container for both buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "export-buttons-container";
    buttonContainer.style.cssText =
      "display: flex; gap: 0.5rem; margin-bottom: 1rem; margin-left: 1rem;";

    // TXT Export Button
    const txtButton = document.createElement("button");
    txtButton.className =
      "themeBoutonNeutre small-bt ieBouton ie-ripple NoWrap ieBoutonDefautSansImage";
    txtButton.innerHTML = "📄 TXT";
    txtButton.title = "Exporter en format texte";

    txtButton.addEventListener("click", () => {
      const homeworkData = extractHomeworkData();
      const txtContent = formatHomeworkAsText(homeworkData);
      downloadTextFile(txtContent, "devoirs.txt");
    });

    // ICS Export Button
    const icsButton = document.createElement("button");
    icsButton.className =
      "themeBoutonNeutre small-bt ieBouton ie-ripple NoWrap ieBoutonDefautSansImage";
    icsButton.innerHTML = "📅 ICS";
    icsButton.title = "Exporter vers calendrier (Google Calendar, Outlook...)";

    icsButton.addEventListener("click", () => {
      const homeworkData = extractHomeworkData();
      const icsContent = formatHomeworkAsICS(homeworkData);
      downloadTextFile(icsContent, "devoirs.ics", "text/calendar");
    });

    buttonContainer.appendChild(txtButton);
    buttonContainer.appendChild(icsButton);

    // Insert buttons at the top of the homework list
    const firstElement = homeworkContainer.querySelector(".liste-date");
    if (firstElement && firstElement.parentNode) {
      firstElement.parentNode.insertBefore(buttonContainer, firstElement);
    }
  }

  function extractHomeworkData() {
    const homeworkData = [];

    // Find all date sections
    document.querySelectorAll(".liste-date > li").forEach((dateSection) => {
      const dateHeader = dateSection.querySelector("h2");
      if (!dateHeader) return;

      const dateText = dateHeader.textContent.trim().replace(/^Pour\s+/, "");
      const dateId = dateSection.querySelector("div[id]")?.id || "";

      const assignments = [];

      // Find all assignments for this date
      dateSection.querySelectorAll(".conteneur-item").forEach((item) => {
        const subjectElement = item.querySelector(".titre-matiere");
        const dateInfoElement = item.querySelector(".ie-sous-titre");
        const descriptionElement = item.querySelector(".description");
        const statusElement = item.querySelector(".tag-style");

        const subject = subjectElement ? subjectElement.textContent.trim() : "";
        const dateInfo = dateInfoElement
          ? dateInfoElement.textContent.trim()
          : "";
        const description = descriptionElement
          ? descriptionElement.textContent.trim()
          : "";
        const status = statusElement
          ? statusElement.textContent.trim()
          : "Non spécifié";

        assignments.push({
          subject,
          dateInfo,
          description,
          status,
        });
      });

      if (assignments.length > 0) {
        homeworkData.push({
          date: dateText,
          dateId,
          assignments,
        });
      }
    });

    return homeworkData;
  }

  function formatHomeworkAsText(homeworkData) {
    let text =
      "EXPORT DES DEVOIRS - " + new Date().toLocaleDateString("fr-FR") + "\n";
    text += "=".repeat(50) + "\n\n";

    homeworkData.forEach((dateGroup) => {
      text += `📅 ${dateGroup.date}\n`;
      text += "-".repeat(30) + "\n";

      dateGroup.assignments.forEach((assignment, index) => {
        text += `${index + 1}. ${assignment.subject}\n`;
        text += `   Statut: ${assignment.status}\n`;
        text += `   ${assignment.dateInfo}\n`;
        if (assignment.description) {
          text += `   Description: ${assignment.description.replace(
            /\n/g,
            "\n   "
          )}\n`;
        }
        text += "\n";
      });

      text += "\n";
    });

    text += "=".repeat(50) + "\n";
    text += "Généré par BetterPronote++\n";

    return text;
  }

  function formatHomeworkAsICS(homeworkData) {
    let ics = "BEGIN:VCALENDAR\n";
    ics += "VERSION:2.0\n";
    ics += "PRODID:-//BetterPronote++//Homework Export//FR\n";
    ics += "CALSCALE:GREGORIAN\n";
    ics += "METHOD:PUBLISH\n";

    const now = new Date();
    const timestamp = formatDateForICS(now);

    // Mappage des matières vers des emojis pour plus de visuel
    const subjectEmojis = {
      MATHEMATIQUES: "🔢",
      FRANCAIS: "📖",
      "HISTOIRE-GEOGRAPHIE": "🌍",
      ANGLAIS: "🇬🇧",
      ESPAGNOL: "🇪🇸",
      ALLEMAND: "🇩🇪",
      "PHYSIQUE-CHIMIE": "⚗️",
      "SCIENCES VIE & TERRE": "🧬",
      SES: "💰",
      "ENS. MORAL & CIVIQUE": "⚖️",
      EPS: "⚽",
      "ARTS PLASTIQUES": "🎨",
      MUSIQUE: "🎵",
      TECHNOLOGIE: "🔧",
    };

    homeworkData.forEach((dateGroup) => {
      const dueDate = parseFrenchDate(dateGroup.date);
      if (!dueDate) return; // Skip if date parsing failed

      dateGroup.assignments.forEach((assignment, index) => {
        const eventId = `homework-${
          dateGroup.dateId || dateGroup.date.replace(/\s+/g, "-")
        }-${index}@betterpronote`;

        // Déterminer l'emoji pour la matière
        const emoji = Object.keys(subjectEmojis).find((key) =>
          assignment.subject.toUpperCase().includes(key)
        )
          ? subjectEmojis[
              Object.keys(subjectEmojis).find((key) =>
                assignment.subject.toUpperCase().includes(key)
              )
            ]
          : "📚";

        ics += "BEGIN:VEVENT\n";
        ics += `UID:${eventId}\n`;
        ics += `DTSTART;VALUE=DATE:${formatDateForICS(dueDate, true)}\n`;
        ics += `DTEND;VALUE=DATE:${formatDateForICS(
          new Date(dueDate.getTime() + 24 * 60 * 60 * 1000),
          true
        )}\n`; // End date is next day

        // Titre = le devoir (description) ou matière si pas de description
        const eventTitle =
          assignment.description && assignment.description.trim()
            ? assignment.description.trim().split("\n")[0].substring(0, 100) // Première ligne, max 100 chars
            : assignment.subject;

        ics += `SUMMARY:${escapeICSText(eventTitle)}\n`;

        // Description avec emojis et sans statut
        let description = `📚 Matière: ${assignment.subject}\n`;
        // Extraire seulement la partie date sans [X Jours]
        const dateOnly = assignment.dateInfo.replace(/\s*\[\d+\s*Jours?\]/, "");
        description += `📅 ${dateOnly}`;

        if (assignment.description && assignment.description.trim()) {
          // Ajouter le reste de la description si elle fait plus d'une ligne
          const descriptionLines = assignment.description.trim().split("\n");
          if (descriptionLines.length > 1) {
            description += `\n\n📝 Détails:\n${descriptionLines
              .slice(1)
              .join("\n")}`;
          }
        }

        description += `\n\n🤖 Exporté depuis BetterPronote++`;

        ics += `DESCRIPTION:${escapeICSText(description)}\n`;

        ics += "END:VEVENT\n";
      });
    });

    ics += "END:VCALENDAR\n";
    return ics;
  }

  function calculateUrgency(dateInfo) {
    // Analyse la date pour déterminer l'urgence
    const dayMatch = dateInfo.match(/\[(\d+)\s*Jours?\]/);
    if (dayMatch) {
      const daysLeft = parseInt(dayMatch[1]);
      if (daysLeft <= 1) return 1; // Urgent
      if (daysLeft <= 3) return 5; // Important
      if (daysLeft <= 7) return 7; // Normal
    }
    return 9; // Faible
  }

  function parseFrenchDate(dateString) {
    // Handle various French date formats like "lundi 17 novembre", "mardi 18 novembre", "aujourd'hui", etc.
    const today = new Date();

    // Handle "aujourd'hui"
    if (dateString.toLowerCase().includes("aujourd'hui")) {
      return today;
    }

    // Extract date components - look for patterns like "17 novembre", "18 novembre", etc.
    const dateMatch = dateString.match(/(\d{1,2})\s+(\w+)\s*(\d{4})?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const monthName = dateMatch[2].toLowerCase();
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();

      const monthNames = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
      };

      const month = monthNames[monthName];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        // If the date is in the past and we're in December, assume it's next year
        if (date < today && today.getMonth() === 11 && month < 6) {
          date.setFullYear(year + 1);
        }
        return date;
      }
    }

    // If parsing fails, return null
    return null;
  }

  function formatDateForICS(date, dateOnly = false) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (dateOnly) {
      return `${year}${month}${day}`;
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  function escapeICSText(text) {
    // Escape special characters for ICS format
    return text
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/;/g, "\\;") // Escape semicolons
      .replace(/,/g, "\\,") // Escape commas
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "") // Remove carriage returns
      .replace(/:/g, "\\:"); // Escape colons (though not strictly required)
  }

  function downloadTextFile(
    content,
    filename,
    mimeType = "text/plain;charset=utf-8"
  ) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  // Add button initially
  addExportButton();

  // Watch for DOM changes to add button if homework content loads dynamically
  const observer = new MutationObserver(() => {
    addExportButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


})();