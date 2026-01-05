// ==UserScript==
// @name         WME Draw Borders France
// @version      2025.12.22.001
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAABCJJREFUWIWtl09oHFUcx7/fN7vJ1jSlrUp2c2oCPRjddGcGoV5sqBSk0IKCh4JF0RwC2grVIP6B1pOIIJWIlygIWkEsUvVYWrGnXmYmzcqqKK0HkdWW7aFKd5PZ9/WQ3WWzyW4nyf5gYd7v/d77fub33vzePiKheZ53GsCJRnMuDMN3ko7tZU6SINd1jxtjPiR5X+M3lc1mr5fL5cWtApgkQSQPreN70ff93FYBEmUgm80WSB7oANgj6ZVcLrc/l8vFQ0NDv1cqlfpGAVJJgkjebm9LugbgNwBHSB4GcHjHjh0V3/e/qtfr3xhjTgI4BOCGpBNRFF3qOve9xPP5/Hg6nb4GYIjkrKQoDMMrAOKJiYndmUzmGIDnAfgk18wn6Q7J8SAIbm0GgJ7nXSY5Za09F0XRs90CJycnH3Ec5zmSp0iu2lvW2qNRFH2/3riem9B13ZdITkkq12q1k71iFxcXf4qiaBbAr+1+SarX6ze6jesKkM/nx0m+K0nW2plSqVTpBdAmeELSnTbXv3Ec/7VRAKbT6U9Jbpf05cLCwrdJxAEgiqJLJMettUcl/UhyOJPJvN8tft094Lruy8aYOUnlarX6cNK377RCobDXGLMIYFDSVBRFVzpj1tSBfD4/7jjOeQBpa+3xYrG4sBlxACiXy5XR0VFD8iCA/bt27Zq/efPmqlrRWgLP8057nndrYGDgl82kvpvdvXv3PUk/k3xo27Ztr3f2G2Cl1pM8Q/J+AOlG3+WtigNAqVRakjQjyUp6s1Ao7F0D0KXWT/UDAAAaa/8ZyYwxZt513SO+7z/QApC05jtdz7cVq1ars42qeMAY852k667rPmEAII7js5Jam03SQhzHZ/sJkEqlRgFsb7ZJDpOcMwBQLBZvA3gVAKy1V8MwfLTh65s5jjO2zlkx1voKrLUjDbI/AMT9FAeApaWlBUnqcF9sHcckswAg6e9+iwPA4ODgGZKUVG2Kx3E83Q4wAgDGmHK/xX3fnwbwgqT/SD4WBEGx2dcCkDRCEtbavmbA8zxf0tyKhGbCMCy297f2QDMD/VyCiYmJ3QDOk8xI+jiKoi86Y9YAGGP6BWAymcw5knustVdrtdqpdYOaD5KyALC8vNwXANd1T5N8UtI/cRw/UyqVlnoBkOSDkjQwMLBlgEKhcJjk25JiAMeKxeKf3WJTAJDP58ewcghVgiBY3qRuyvO8xyXtJDnf+F/4VhAEPQ81ep53EMAFksOSRPKDIAhe24jyvn37djqO8wPJQpv7QhAETwPoLD6rqQF8RHIYWFkHSadc1x0HkDgTJMc6xGGtXbyXeBNgrGMyknwqqXgvqCRxKQAXARxpOhpH5gw2kAFrrWuMeaPdJ+liIoA4jqdTqdQnaLtKhWHY9SrVxb72PK+Gtut7FEWfJxn4P1GVx29d/9ycAAAAAElFTkSuQmCC
// @description  Affiche les limites des villes et départements français
// @author       Sebiseba & Electrochock1974
// @copyright    Sebiseba 2017-2025 (Inspired by Draw Border - ©giovanni-cortinovis)
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/*/user*
// @grant        GM_xmlhttpRequest
// @connect      api.wazefrance.com
// @connect      radars.securite-routiere.gouv.fr
// @connect      signalement.adresse.data.gouv.fr
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace Sebiseba
// @downloadURL https://update.greasyfork.org/scripts/8138/WME%20Draw%20Borders%20France.user.js
// @updateURL https://update.greasyfork.org/scripts/8138/WME%20Draw%20Borders%20France.meta.js
// ==/UserScript==

(function () {
    var DBFhandleClass, DBFhandleClass2, CitiesOld = [], StatesOld = [], StatesPROld = [], Cty_Layer = [], Dpt_Layer = [], PR_Layer = [], Cam_Layer = [], Ban_Layer = [], Equip_Layer = [], Etabl_Layer = [], RS_Layer = [], debug = 'true', wmeSDK;
    var icon_DrB = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAABCJJREFUWIWtl09oHFUcx7/fN7vJ1jSlrUp2c2oCPRjddGcGoV5sqBSk0IKCh4JF0RwC2grVIP6B1pOIIJWIlygIWkEsUvVYWrGnXmYmzcqqKK0HkdWW7aFKd5PZ9/WQ3WWzyW4nyf5gYd7v/d77fub33vzePiKheZ53GsCJRnMuDMN3ko7tZU6SINd1jxtjPiR5X+M3lc1mr5fL5cWtApgkQSQPreN70ff93FYBEmUgm80WSB7oANgj6ZVcLrc/l8vFQ0NDv1cqlfpGAVJJgkjebm9LugbgNwBHSB4GcHjHjh0V3/e/qtfr3xhjTgI4BOCGpBNRFF3qOve9xPP5/Hg6nb4GYIjkrKQoDMMrAOKJiYndmUzmGIDnAfgk18wn6Q7J8SAIbm0GgJ7nXSY5Za09F0XRs90CJycnH3Ec5zmSp0iu2lvW2qNRFH2/3riem9B13ZdITkkq12q1k71iFxcXf4qiaBbAr+1+SarX6ze6jesKkM/nx0m+K0nW2plSqVTpBdAmeELSnTbXv3Ec/7VRAKbT6U9Jbpf05cLCwrdJxAEgiqJLJMettUcl/UhyOJPJvN8tft094Lruy8aYOUnlarX6cNK377RCobDXGLMIYFDSVBRFVzpj1tSBfD4/7jjOeQBpa+3xYrG4sBlxACiXy5XR0VFD8iCA/bt27Zq/efPmqlrRWgLP8057nndrYGDgl82kvpvdvXv3PUk/k3xo27Ztr3f2G2Cl1pM8Q/J+AOlG3+WtigNAqVRakjQjyUp6s1Ao7F0D0KXWT/UDAAAaa/8ZyYwxZt513SO+7z/QApC05jtdz7cVq1ars42qeMAY852k667rPmEAII7js5Jam03SQhzHZ/sJkEqlRgFsb7ZJDpOcMwBQLBZvA3gVAKy1V8MwfLTh65s5jjO2zlkx1voKrLUjDbI/AMT9FAeApaWlBUnqcF9sHcckswAg6e9+iwPA4ODgGZKUVG2Kx3E83Q4wAgDGmHK/xX3fnwbwgqT/SD4WBEGx2dcCkDRCEtbavmbA8zxf0tyKhGbCMCy297f2QDMD/VyCiYmJ3QDOk8xI+jiKoi86Y9YAGGP6BWAymcw5knustVdrtdqpdYOaD5KyALC8vNwXANd1T5N8UtI/cRw/UyqVlnoBkOSDkjQwMLBlgEKhcJjk25JiAMeKxeKf3WJTAJDP58ewcghVgiBY3qRuyvO8xyXtJDnf+F/4VhAEPQ81ep53EMAFksOSRPKDIAhe24jyvn37djqO8wPJQpv7QhAETwPoLD6rqQF8RHIYWFkHSadc1x0HkDgTJMc6xGGtXbyXeBNgrGMyknwqqXgvqCRxKQAXARxpOhpH5gw2kAFrrWuMeaPdJ+liIoA4jqdTqdQnaLtKhWHY9SrVxb72PK+Gtut7FEWfJxn4P1GVx29d/9ycAAAAAElFTkSuQmCC";
    console.log('WME Draw Borders France : ' + GM_info.script.version + ' starting');
    // --- CLUSTER PANNEAUX (globals) ---
    var RS_pending = [];
    var RS_CLUSTER_THRESH_M = 5;
    var Cty_LastZoom = null;
    var Cty_BboxOld = null;

    // === Config API updates ===
    const API_BASE = 'https://api.wazefrance.com';
    const UPDATES_ENDPOINT = API_BASE + '/updates';
    window.adresses_list = [];

    function getId(node) { return document.getElementById(node); }
    function getElementsByClassName(classname, node) {
        node || (node = document.getElementsByTagName('body')[0]);
        for (var a = [], re = new RegExp('\\b' + classname + '\\b'), els = node.getElementsByTagName('*'), i = 0, j = els.length; i < j; i++) { re.test(els[i].className) && a.push(els[i]); }
        return a;
    }
    function isJsonString(str) {
        try { JSON.parse(str); }
        catch (e) { return false; }
        return true;
    }
    function deltaDate(adresseDate) {
        let diffTime = Math.abs(new Date().valueOf() - new Date(adresseDate).valueOf());
        let days = diffTime / (24 * 60 * 60 * 1000);
        let hours = (days % 1) * 24;
        let minutes = (hours % 1) * 60;
        [days, hours, minutes] = [Math.floor(days), Math.floor(hours), Math.floor(minutes)]
        var delta = days + 'j ' + hours + 'h ' + minutes + 'm';
        return delta;
    }
    function addScriptsMenu() {
        if (typeof getElementsByClassName('collapsible-GROUP__SCRIPTS', getId('layer-switcher-region'))[0] != 'object') {
            if ('undefined' === typeof localStorage.posScriptMenu) { localStorage.setItem('posScriptMenu', '["top"]'); }

            var menuParent = getElementsByClassName('togglers', getId('layer-switcher-region'))[0];

            var scriptMenu = document.createElement('li');
            scriptMenu.className = "group";

            var scriptMenuContent = document.createElement('div');
            scriptMenuContent.className = 'layer-switcher-toggler-tree-category';
            scriptMenuContent.innerHTML = '<wz-button id="developScript" color="clear-icon" size="xs"><i class="toggle-category w-icon w-icon-caret-down"></i></wz-button>' +
                '<wz-toggle-switch disabled="false" checked id="layer-switcher-group__scripts" class="layer-switcher-group__scripts" tabindex="0" name="" value=""></wz-toggle-switch>' +
                '<label class="label-text" for="layer-switcher-group__scripts">Scripts</label>';
            scriptMenu.appendChild(scriptMenuContent);
            var groupScripts = document.createElement('ul');
            groupScripts.className = "collapsible-GROUP__SCRIPTS";
            scriptMenu.appendChild(groupScripts);

            if (JSON.parse(localStorage.posScriptMenu)[0] == 'top') { menuParent.insertBefore(scriptMenu, menuParent.firstChild); }
            else { menuParent.appendChild(scriptMenu); }

            getId('developScript').addEventListener('click', function (e) {
                if (groupScripts.className == 'collapsible-GROUP__SCRIPTS') {
                    groupScripts.className = 'collapsible-GROUP__SCRIPTS collapse-layer-switcher-group';
                    this.innerHTML = '<i class="toggle-category w-icon w-icon-caret-down upside-down"></i>';
                } else {
                    groupScripts.className = 'collapsible-GROUP__SCRIPTS';
                    this.innerHTML = '<i class="toggle-category w-icon w-icon-caret-down"></i>';
                }
            });
            getId('layer-switcher-group__scripts').addEventListener('click', function (e) {
                if (groupScripts.className == 'collapsible-GROUP__SCRIPTS') {
                    groupScripts.className = 'collapsible-GROUP__SCRIPTS collapse-layer-switcher-group';
                    getId('developScript').innerHTML = '<i class="toggle-category w-icon w-icon-caret-down upside-down"></i>';
                } else {
                    groupScripts.className = 'collapsible-GROUP__SCRIPTS';
                    getId('developScript').innerHTML = '<i class="toggle-category w-icon w-icon-caret-down"></i>';
                }
            });
            var lng = I18n.locale;
            if (lng == 'fr') { var title = "Position menu des scripts", top = "En haut", bottom = "En bas"; }
            else if (lng == 'es') { var title = "Posición del menú de script", top = "En alto", bottom = "Abajo"; }
            else { var title = "Scripts menu position", top = "On top", bottom = "On bottom"; }

            var optionPosMenu = document.createElement('div');
            optionPosMenu.className = 'settings__form-group';
            optionPosMenu.innerHTML = '<wz-label html-for="">' + title + '</wz-label><span style="padding-right:15px;">' + bottom + ' </span><wz-toggle-switch name="posScriptMenu" id="posScriptMenu" checked=' + (JSON.parse(localStorage.posScriptMenu)[0] == 'top' ? "true" : "false") + ' class="alert-settings-visibility-toggle" tabindex="0" value=""> ' + top + '<input type="checkbox" name="posScriptMenu" value="" style="display: none; visibility: hidden;"></wz-toggle-switch>';
            //getElementsByClassName('settings__form', getId('sidepanel-prefs'))[0].appendChild(optionPosMenu);
            //getId('posScriptMenu').addEventListener('click', function (e) {
            //    menuParent.removeChild(scriptMenu);
            //    if (getId('posScriptMenu').checked == true) {
            //        menuParent.insertBefore(scriptMenu, menuParent.firstChild);
            //        localStorage.setItem('posScriptMenu', JSON.stringify(["top"]));
            //    } else {
            //        menuParent.appendChild(scriptMenu);
            //        localStorage.setItem('posScriptMenu', JSON.stringify(["bottom"]));
            //    }
            //})
            if ('undefined' === typeof localStorage.posScriptMenu || !isJsonString(localStorage.posScriptMenu)) { localStorage.setItem('posScriptMenu', '[]'); }
        }
    }
    function addTooltipToCheckbox(checkboxId, tooltipText) {
        var checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            // Création du conteneur div qui utilisera Flexbox pour aligner le texte et l'icône
            var container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between';

            // Assurez-vous que le texte actuel est enveloppé dans un élément, par exemple un span
            var textSpan = document.createElement('span');
            textSpan.textContent = checkbox.textContent;
            checkbox.textContent = ''; // Enlever le texte actuel du checkbox

            // Création du tooltip avec l'icône d'information
            var tooltipContainer = document.createElement('wz-rich-tooltip');
            tooltipContainer.className = "sc-wz-rich-tooltip-h sc-wz-rich-tooltip-s";
            tooltipContainer.setAttribute("hide-delay-ms", "200");

            var tooltip = document.createElement('wz-tooltip');
            tooltip.className = "sc-wz-rich-tooltip sc-wz-rich-tooltip-s";

            var tooltipSource = document.createElement('wz-tooltip-source');
            tooltipSource.className = "sc-wz-tooltip-source-h sc-wz-tooltip-source-s";

            var tooltipTarget = document.createElement('wz-tooltip-target');
            tooltipTarget.className = "sc-wz-tooltip-target-h sc-wz-tooltip-target-s";

            var infoIcon = document.createElement('i');
            infoIcon.className = "w-icon w-icon-info layer-selector-info-icon";
            infoIcon.title = tooltipText;

            tooltipTarget.appendChild(infoIcon);
            tooltipSource.appendChild(tooltipTarget);
            tooltip.appendChild(tooltipSource);
            tooltipContainer.appendChild(tooltip);

            // Ajout du texte et du tooltip au conteneur
            container.appendChild(textSpan); // Ajoutez le texte en premier
            container.appendChild(tooltipContainer); // Ensuite, ajoutez l'icône d'information

            // Ajout du conteneur dans le checkbox
            checkbox.appendChild(container);
        }
    }

    function DBFstep1() {
        if (typeof (W.map) == 'undefined') { window.setTimeout(DBFstep1, 500); return; }
        if (typeof (W.model) === 'undefined') { window.setTimeout(DBFstep1, 500); return; }
        if (typeof (OpenLayers) === 'undefined') { window.setTimeout(DBFstep1, 500); return; }
        if (document.querySelector('.togglers') === null) { window.setTimeout(DBFstep1, 500); return; }
        DBFhandle = getId("user-info"); if (typeof (DBFhandle) == 'undefined') { window.setTimeout(DBFstep1, 500); return; }
        DBFhandleClass = getElementsByClassName("nav-tabs", DBFhandle)[0]; if (typeof (DBFhandleClass) === 'undefined') { window.setTimeout(DBFstep1, 500); return; }
        DBFhandleClass2 = getElementsByClassName("tab-content", DBFhandle)[0]; if (typeof (DBFhandleClass2) === 'undefined') { window.setTimeout(DBFstep1, 500); return; }

        wmeSDK = getWmeSdk({ scriptId: "dbf_sdk", scriptName: "Draw Borders France" });

        wmeSDK.Shortcuts.createShortcut({
            callback: () => {
                document.getElementById('layerBanVisib').click();
            },
            description: "Activer/Désactiver le calque BAN",
            shortcutId: "ban_switch",
            shortcutKeys: "C+B",
        });

        wmeSDK.Shortcuts.createShortcut({
            callback: () => {
            },
            description: "Autofill BAN : Ctrl + M avec la souris sur le point du numéro souhaité (LVL 5)",
            shortcutId: "ban_autofill",
            shortcutKeys: "C+M",
        });

        wmeSDK.Shortcuts.createShortcut({
            callback: () => {
                wmeSDK.Map.setZoomLevel({ zoomLevel: 19 });
            },
            description: "Zoom niveau 19",
            shortcutId: "ban_zoom_level",
            shortcutKeys: "A+97",
        });

        window.setTimeout(DBFstep2, 500);
    }
    function DBFstep2() {
        if ('undefined' === typeof localStorage.speedCamList || !isJsonString(localStorage.speedCamList)) { localStorage.setItem('speedCamList', '[]'); }
        if ('undefined' === typeof localStorage.DBFsettings || !isJsonString(localStorage.DBFsettings)) { localStorage.setItem('DBFsettings', '{"optionDBF0":false,"optionDBF1":true,"optionDBF2":false,"optionDBF3":false,"optionDBF4":true,"optionDBF5":false,"optionDBF6":false}'); }

        // WME Layers check
        addScriptsMenu();
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Limites Villes", false, LayerVilToggled);
        checklayer("__WME_Draw_Border_Cty");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Limites Départements", false, LayerDepToggled);
        checklayer("__WME_Draw_Border_Dpt");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Points Routiers", false, LayerPRToggled);
        checklayer("__WME_Draw_Border_PR");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Radars", false, LayerCamToggled);
        checklayer("__WME_Draw_Border_Cam");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Infos BAN ", false, LayerBanToggled);
        checklayer("__WME_Draw_Border_Ban");
        addTooltipToCheckbox("layer-switcher-item_infos_ban", "Affiche les adresses tirées de la BAN à partir du zoom 19.");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Equipements", false, LayerEquipToggled);
        checklayer("__WME_Draw_Border_Equip");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Etablissements", false, LayerEtablToggled);
        checklayer("__WME_Draw_Border_Etabl");
        WazeWrap.Interface.AddLayerCheckbox("_scripts", "Panneaux routiers - icones", false, LayerRSToggled);
        checklayer("__WME_Draw_Border_RS");

        W.map.events.register("moveend", null, show_border);
        W.map.events.register('zoomend', null, show_border);
        W.map.events.register('mergeend', null, show_border);

        W.map.events.register("moveend", null, load_ban);
        W.map.events.register('zoomend', null, load_ban);
        W.map.events.register('mergeend', null, load_ban);
        W.selectionManager.events.register('selectionchanged', null, load_ban);
        W.model.actionManager.events.register("afterclearactions", null, load_ban);
        W.model.actionManager.events.register("afterundoaction", null, load_ban);

        getId('layer-switcher-item_infos_ban_').addEventListener('click', function (e) {
            if ($('#layer-switcher-item_infos_ban_').prop('checked') === true && $('#layer-switcher-item_house_numbers').prop('checked') === false) { $('#layer-switcher-item_house_numbers').click(); }
            if (Ban_Layer.visibility === true) { getId('layerBanVisib').style.backgroundColor = '#bbffcc'; }
            else { getId('layerBanVisib').style.backgroundColor = '#fac3c3'; }
            load_ban();
        });
        insertScriptHTML();
        load_radar(); // Just one time on launch
    }
    const DBF_DEFAULT_STYLES = {
        city: {
            strokeColor: "#ce00ce",
            strokeWidth: 2,
            fontSize: 12,
            fontColor: "#000000",
            showLabel: false
        },
        dep: {
            strokeColor: "#b20000",
            strokeWidth: 5,
            fontSize: 24,
            fontColor: "#b20000"
        },
        ban: {
            verifiedStroke: "#00dd00",
            unverifiedStroke: "#ff8000",
            textMissing: "#ff0000",
            textExisting: "#0000ff",
            strokeWidth: 10,
            fontSize: 12
        },
        equip: {
            strokeColor: "#2d792d",
            strokeWidth: 10,
            fontSize: 12,
            fontColor: "#33ff33"
        },
        etabl: {
            strokeColor: "#690069",
            strokeWidth: 10,
            fontSize: 12,
            fontColor: "#ff77ff"
        },
        radar: {
            strokeColor: "#ff0000",
            strokeWidth: 10,
            fontSize: 12,
            fontColor: "#ffff00"
        },
        pr: {
            strokeColor: "#3380ff",
            strokeWidth: 10,
            fontSize: 12,
            fontColor: "#33ffee"
        },
        rs: {
            scale: 1.0
        }
    };

    function DBF_getStyles() {
        let stored = {};
        try {
            stored = JSON.parse(localStorage.DBFstyles || '{}');
        } catch (e) {
            stored = {};
        }
        // merge simple
        const base = JSON.parse(JSON.stringify(DBF_DEFAULT_STYLES));
        Object.keys(stored).forEach(layerKey => {
            if (!base[layerKey]) base[layerKey] = {};
            Object.assign(base[layerKey], stored[layerKey]);
        });
        return base;
    }

    function DBF_saveStyles(styles) {
        localStorage.DBFstyles = JSON.stringify(styles);
    }

    function insertScriptHTML() {
        var Scss = document.createElement('style');
        Scss.type = 'text/css';
        Scss.innerHTML = `

/* ————————————————
   DBF GLOBAL LOOK
———————————————— */
#dbf-panel{
  padding:12px;
  font-family: Inter, Roboto, Arial;
  color:#1f2937;
}
#dbf-panel *{
  box-sizing:border-box;
}
.userscripts-api-docs-link-container{
    display:none !important;
}

/* ————————————————
   HEADER
———————————————— */
#dbf-header{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 14px;
  background:var(--wz-bg-secondary,#f3f4f6);
  border-radius:12px;
  border:1px solid #e5e7eb;
  margin-bottom:14px;
}
#dbf-header .dbf-title{
  font-size:15px;
  font-weight:800;
}
#dbf-header .dbf-version{
  font-size:11px;
  padding:3px 8px;
  border-radius:6px;
  background:#e0e7ff;
  color:#4338ca;
  font-weight:600;
}

/* ————————————————
   CARDS
———————————————— */
.dbf-card{
  background:#fff;
  border-radius:12px;
  border:1px solid #e5e7eb;
  margin:12px 0;
  overflow: visible !important;
  box-shadow:0 1px 2px rgba(0,0,0,.05);
}
.dbf-card__head{
  padding:12px 16px;
  border-bottom:1px solid #e5e7eb;
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:#fafafa;
}
.dbf-card__title{
  font-size:14px;
  font-weight:700;
  display:flex;
  align-items:center;
  gap:8px;
}
.dbf-card__body{
  padding:12px 16px;
  animation:fadeIn .25s ease;
}

/* ————————————————
   BADGES / CHIPS
———————————————— */
.dbf-chip a{
  background:#f9fafb;
  padding:6px 12px;
  border-radius:999px;
  border:1px solid #d1d5db;
  font-size:12px;
  text-decoration:none;
  color:#111;
  display:flex;
  align-items:center;
  gap:6px;
  transition:.2s;
}
.dbf-chip a:hover{
  background:#eef2ff;
  border-color:#c7d2fe;
}

/* loading */
.dbf-chip.loading a{
  background:#eef2ff;
  border-color:#93c5fd;
}
.dbf-chip.loading a .dbf-spinner{
  width:9px;
  height:9px;
  border-radius:50%;
  background:#2563eb;
  animation:dbf-blink .75s infinite alternate;
}

/* ————————————————
   PILLS
———————————————— */
.dbf-pill{
  background:#f9fafb;
  border:1px solid #d1d5db;
  padding:7px 12px;
  border-radius:10px;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
  text-align:center;
  transition:.2s;
}
.dbf-pill:hover{
  background:#eef2ff;
}

/* STATES */
.dbf-pill--ok{
  background:#ecfdf5;
  border-color:#6ee7b7;
  color:#047857;
}
.dbf-pill--ko{
  background:#fff7ed;
  border-color:#fdba74;
  color:#c2410c;
}

/* ————————————————
   LEGEND DOTS
———————————————— */
.dbf-dot{
  width:12px;
  height:12px;
  border-radius:50%;
  display:inline-block;
  margin-right:6px;
}
.dbf-dot--red{ background:#ef4444; }
.dbf-dot--green{ background:#22c55e; }

/* tags */
.dbf-tag{ color:#ea580c; }
.dbf-tag2{ color:#0284c7; }

/* ————————————————
   WARNINGS
———————————————— */
#dbf-warning{
  background:#fef2f2;
  border-left:4px solid #dc2626;
  padding:10px 12px;
  color:#7f1d1d;
  border-radius:6px;
  font-size:12px;
  line-height:1.4;
  margin-top:10px;
}

/* ————————————————
   SUB-TABS
———————————————— */
#dbf-subtabs{
  display:flex;
  gap:8px;
  margin-bottom:10px;
  padding-left:4px;
}
#dbf-subtabs li a{
  padding:6px 12px;
  border-radius:8px;
  background:#f3f4f6;
  font-size:12px;
  font-weight:600;
  color:#374151;
}
#dbf-subtabs li.active a{
  background:#2563eb;
  color:#2563eb;
}
/* Tout ce qui est dans ton panneau doit respecter la largeur disponible */
#dbf-panel{
  max-width: 100%;
  word-break: break-word;
}

/* Les cartes remplissent la largeur sans la dépasser */
#dbf-panel .dbf-card,
#dbf-panel .dbf-card__head,
#dbf-panel .dbf-card__body{
  width:100%;
  min-width:0;
}

/* Barre des updates : retour à la ligne automatique */
#dbf-updates-bar{
  display:flex;
  flex-wrap:wrap;
  gap:4px;
  max-width:100%;
}

/* Les chips ne doivent jamais dépasser */
.dbf-chip{
  max-width:100%;
}
.dbf-chip a{
  max-width:100%;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* Grilles (kpis / légende) : autoriser le shrink */
.dbf-kpis > *,
.dbf-legend > *{
  min-width:0;
}

/* ————————————————
   ICON GRID (panneaux)
———————————————— */
#rsLegendContainer > div{
  border-radius:10px;
  border:1px solid #e5e7eb;
  background:white;
  padding:10px;
  transition:.2s;
}
#rsLegendContainer > div:hover{
  background:#f9fafb;
  border-color:#c7d2fe;
}

/* Empêcher le double scroll dans le panneau du script */
#sidepanel-DrawBordersFR{
  overflow: visible !important;
}

/* La tab-content interne ne doit pas fixer de hauteur */
#sidepanel-DrawBordersFR .tab-content{
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
}

/* ————————————————
   FIX VISIBILITÉ DES TABS (Paramètres / Panneaux)
———————————————— */

/* Ajouter un espace en haut du panneau */
#dbf-panel {
    padding-top: 1px !important;
}

/* Supprime le carré blanc derrière les onglets */
#dbf-panel wz-tabs::part(container) {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

/* supprime aussi le fond blanc de l'onglet non sélectionné */
#dbf-panel wz-tab::part(button) {
    background: transparent !important;
}

/* et laisse SEUL l’onglet actif avec son vrai style */
#dbf-panel wz-tab[selected]::part(button) {
    background: #e5e7eb !important;
    color:#111 !important;
    font-weight:600 !important;
}

}

/* Onglet non sélectionné : texte gris */
#dbf-panel wz-tab:not([selected])::part(button) {
    color: #6b7280 !important;
}

/* ————————————————
   ANIMATIONS
———————————————— */
@keyframes fadeIn{
  from{opacity:0;transform:translateY(3px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes dbf-blink{
  from{opacity:.4;}
  to{opacity:1;}
}
.dbf-results{
  border:1px solid #ccc;
  background:#fff;
  max-height:200px;
  overflow:auto;
  display:none;
}
.dbf-item{
  padding:6px;
  cursor:pointer;
}
.dbf-item:hover{
  background:#eef2ff;
}
js
Copier le code

`;

        document.body.appendChild(Scss);



        // Onglet DrawBorders FR (icône dans la barre du sidepanel)
        var DBFnewtab = document.createElement('li');
        DBFnewtab.innerHTML = "<a href='#sidepanel-DrawBordersFR' data-toggle='tab'><img src=" + icon_DrB + " style='height:16px;'></a>";
        DBFhandleClass.appendChild(DBFnewtab);

        // ----- contenu Paramètres (comme avant) -----
        var DBFcontent =
            `<div id="dbf-panel">

     <div class="dbf-card">
       <div class="dbf-card__head">
         <div class="dbf-card__title">Sources & mises à jour <span class="dbf-sub">(survol = date)</span></div>
         <wz-button id="dbf-refresh-updates" size="sm" color="secondary">Rafraîchir</wz-button>
       </div>
       <div class="dbf-card__body">
         <div id="dbf-updates-bar"></div>
         <div id="dbf-warning">⚠️ Données issues de sources officielles (BAN, panneaux, etc.). Elles peuvent évoluer, être mal positionnées ou incomplètes&nbsp;: vérifiez toujours sur le terrain avant toute édition.</div>
       </div>
     </div>

     <div class="dbf-card">
       <div class="dbf-card__head">
         <div class="dbf-card__title">Infos BAN</div>
         <div class="dbf-sub">Contrôles rapides</div>
       </div>
       <div class="dbf-card__body">
         <div class="dbf-kpis" style="margin-bottom:10px">
           <div id="layerBanVisib" class="dbf-pill dbf-pill--ok" title="CTRL+B">Calque BAN</div>
           <div id="layerHNVisib" class="dbf-pill dbf-pill--ok">Calque HN</div>
           <div id="zoomBanValue" class="dbf-pill">Zoom: —</div>
         </div>
         <div class="dbf-sub">Nombre de numéros BAN chargés : <b id="banQty">0</b></div>
       </div>
     </div>

     <div class="dbf-card">
  <div class="dbf-card__head">
    <div class="dbf-card__title">Signalement BAN</div>
    <div class="dbf-sub">Vérification commune</div>
  </div>

  <div class="dbf-card__body">

<div class="dbf-search">
  <input id="dbf-ban-search" placeholder="Rechercher une adresse BAN…" />
  <div id="dbf-ban-results" class="dbf-results"></div>
</div>

    <div id="dbfSignalementResult" style="margin-top:10px"></div>
    </div>
    <div id="dbfSignalementActions" style="margin-top:10px;display:none">
  <wz-button id="dbfCopyMail" size="sm" color="secondary">
    📋 Copier le modèle de mail
  </wz-button>
</div>


  </div>
</div>


     <div class="dbf-card">
       <div class="dbf-card__head">
         <div class="dbf-card__title">Limites, PR, Radars, Équipements</div>
       </div>
       <div class="dbf-card__body">
         <div id="zoomMiscValue" class="dbf-pill">Zoom: —</div>
         <div class="dbf-legend" style="margin-top:12px">
           <div><span class="dbf-dot dbf-dot--red"></span>Non certifié</div>
           <div><span class="dbf-dot dbf-dot--green"></span>Certifié</div>
           <div class="dbf-tag">Non présent sur WME</div>
           <div class="dbf-tag2">Présent sur WME</div>
         </div>
       </div>
     </div>

     <div class="dbf-card">
       <div class="dbf-card__head"><div class="dbf-card__title">Options</div></div>
       <div class="dbf-card__body">
         <div class="settings__form-group">
           <wz-checkbox name="optionDBF0" id="optionDBF0">Afficher uniquement les n° non renseignés<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF1" id="optionDBF1">Afficher uniquement les données certifiées<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF2" id="optionDBF2">Afficher les anciens noms de communes<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF6" id="optionDBF6">Masquer le nom de la commune<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF8" id="optionDBF8">Afficher uniquement les n° de rue<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF3" id="optionDBF3">Afficher l'ancienneté des données<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF4" id="optionDBF4">Déplacement de la carte initialise les données<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF7" id="optionDBF7">Afficher uniquement les lieux-dits<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF9" id="optionDBF9">Supprimer lieu-dit dans le nom de rue<input type="checkbox" style="display:none"></wz-checkbox>
           <wz-checkbox name="optionDBF5" id="optionDBF5">Afficher uniquement les infos d'une rue<input type="checkbox" style="display:none"></wz-checkbox>
         </div>
       </div>
     </div>

     <div class="dbf-card">
       <div class="dbf-card__head"><div class="dbf-card__title">Rue sélectionnée</div></div>
       <div class="dbf-card__body">
         <wz-body2 class="alert-settings-period-label" id="selectedRoad"></wz-body2>
         <div class="region-switcher" style="margin-top:10px;">
           <wz-select id="DBFselectRoad" name="selectRue" label="Rues disponibles" value="">
             <wz-option value="">---</wz-option>
             <input name="selectRue" style="display:none">
           </wz-select>
         </div>
       </div>
     </div>
     <div id="dbf-footer" style="margin-top:25px; padding-top:15px; border-top:1px solid #e5e7eb;">
  <div id="dbf-header" style="margin-bottom:0;">
    <div class="dbf-title">WME Draw Borders France</div>
    <div class="dbf-version">v${GM_info.script.version}</div>
    <div class="dbf-right">
      <a href="https://greasyfork.org/fr/scripts/8138-wme-draw-borders-france" target="_blank">Documentation</a>
    </div>
  </div>
  <div id="loadBanData" style="display:none"></div>
<div id="loadMiscData" style="display:none"></div>
</div>
   </div>`;

        // ----- contenu Panneaux -----
        var RScontent =
            "<div style='margin:8px 0 10px;'>"
        + "<wz-label>Informations Panneaux</wz-label>"
        + "<div id='rsLegendContainer' style='display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;'></div>"
        + "<div style='margin-top:10px;display:flex;gap:8px;align-items:center'>"
        + "<wz-button id='rsLegendRefresh' size='sm'>Rafraichir</wz-button>"
        + "<wz-body2 id='rsLegendStatus' style='color:#666'></wz-body2>"
        + "</div>"
        + "</div>";
        // ----- contenu Personnalisation -----
        var CustomContent =
            `<div id="dbf-custom-panel" style="padding:8px 4px">

    <div class="dbf-card">
  <div class="dbf-card__head"><div class="dbf-card__title">Villes (CITY)</div></div>
  <div class="dbf-card__body">
    <label>Couleur du trait</label>
    <input id="dbfCityStroke" type="color" value="#ce00ce">
    <label style="margin-left:8px">Épaisseur</label>
    <input id="dbfCityStrokeWidth" type="number" min="1" max="20" value="2" style="width:70px">
    <br>
    <label style="margin-top:6px;display:inline-block">Couleur du texte</label>
    <input id="dbfCityFontColor" type="color" value="#000000">
    <label style="margin-left:8px">Taille texte</label>
    <input id="dbfCityFontSize" type="number" min="8" max="40" value="12" style="width:70px">

    <br>
    <label style="margin-top:6px;display:inline-block">Afficher le nom</label>
    <input id="dbfCityShowLabel" type="checkbox" checked>
  </div>
</div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">Départements (DEP)</div></div>
      <div class="dbf-card__body">
        <label>Couleur du trait</label>
        <input id="dbfDepStroke" type="color" value="#b20000">
        <label style="margin-left:8px">Épaisseur</label>
        <input id="dbfDepStrokeWidth" type="number" min="1" max="20" value="5" style="width:70px">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur du texte</label>
        <input id="dbfDepFontColor" type="color" value="#b20000">
        <label style="margin-left:8px">Taille texte</label>
        <input id="dbfDepFontSize" type="number" min="8" max="40" value="24" style="width:70px">
      </div>
    </div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">BAN</div></div>
      <div class="dbf-card__body">
        <label>Couleur trait vérifié (vert)</label>
        <input id="dbfBanVerifiedStroke" type="color" value="#00dd00">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur trait non vérifié (rouge)</label>
        <input id="dbfBanUnverifiedStroke" type="color" value="#ff8000">
        <br>
        <label style="margin-top:6px;display:inline-block">Texte manquant (rouge)</label>
        <input id="dbfBanTextMissing" type="color" value="#ff0000">
        <br>
        <label style="margin-top:6px;display:inline-block">Texte déjà présent (bleu)</label>
        <input id="dbfBanTextExisting" type="color" value="#0000ff">
        <br>
        <label style="margin-top:6px;display:inline-block">Grosseur du point</label>
        <input id="dbfBanStrokeWidth" type="number" min="1" max="25" value="10" style="width:70px">
        <label style="margin-left:8px">Taille du texte</label>
        <input id="dbfBanFontSize" type="number" min="8" max="30" value="12" style="width:70px">
      </div>
    </div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">Établissements / Équipements</div></div>
      <div class="dbf-card__body">
        <h5>Équipements</h5>
        <label>Couleur point/trait</label>
        <input id="dbfEquipStroke" type="color" value="#2d792d">
        <label style="margin-left:8px">Grosseur</label>
        <input id="dbfEquipStrokeWidth" type="number" min="1" max="25" value="10" style="width:70px">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur texte</label>
        <input id="dbfEquipFontColor" type="color" value="#33ff33">
        <label style="margin-left:8px">Taille texte</label>
        <input id="dbfEquipFontSize" type="number" min="8" max="30" value="12" style="width:70px">

        <hr>

        <h5>Établissements</h5>
        <label>Couleur point/trait</label>
        <input id="dbfEtablStroke" type="color" value="#690069">
        <label style="margin-left:8px">Grosseur</label>
        <input id="dbfEtablStrokeWidth" type="number" min="1" max="25" value="10" style="width:70px">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur texte</label>
        <input id="dbfEtablFontColor" type="color" value="#ff77ff">
        <label style="margin-left:8px">Taille texte</label>
        <input id="dbfEtablFontSize" type="number" min="8" max="30" value="12" style="width:70px">
      </div>
    </div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">Radars</div></div>
      <div class="dbf-card__body">
        <label>Couleur point/trait</label>
        <input id="dbfRadarStroke" type="color" value="#ff0000">
        <label style="margin-left:8px">Grosseur point</label>
        <input id="dbfRadarStrokeWidth" type="number" min="1" max="25" value="10" style="width:70px">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur texte</label>
        <input id="dbfRadarFontColor" type="color" value="#ffff00">
        <label style="margin-left:8px">Taille texte</label>
        <input id="dbfRadarFontSize" type="number" min="8" max="30" value="12" style="width:70px">
      </div>
    </div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">Points routiers (PR)</div></div>
      <div class="dbf-card__body">
        <label>Couleur point/trait</label>
        <input id="dbfPrStroke" type="color" value="#3380ff">
        <label style="margin-left:8px">Grosseur point</label>
        <input id="dbfPrStrokeWidth" type="number" min="1" max="25" value="10" style="width:70px">
        <br>
        <label style="margin-top:6px;display:inline-block">Couleur texte</label>
        <input id="dbfPrFontColor" type="color" value="#33ffee">
        <label style="margin-left:8px">Taille texte</label>
        <input id="dbfPrFontSize" type="number" min="8" max="30" value="12" style="width:70px">
      </div>
    </div>

    <div class="dbf-card">
      <div class="dbf-card__head"><div class="dbf-card__title">Panneaux routiers (icônes)</div></div>
      <div class="dbf-card__body">
        <label>Grosseur des panneaux (pourcentage)</label>
        <input id="dbfRsScale" type="number" min="50" max="200" value="100" style="width:80px"> %
        <p style="font-size:11px;color:#6b7280;margin-top:6px">
          100% = taille actuelle, 50% = moitié, 200% = deux fois plus gros.
        </p>
      </div>
    </div>

    <div style="margin-top:10px">
      <wz-button id="dbfCustomApply" color="secondary">Appliquer</wz-button>
      <wz-button id="dbfCustomReset" color="secondary" style="margin-left:6px">Réinitialiser</wz-button>
    </div>

  </div>`;


        // ----- section unique + sous-onglets -----
        var DBFaddon = document.createElement('section');
        DBFaddon.id = "sidepanel-DrawBordersFR";
        DBFaddon.className = 'tab-pane';

        DBFaddon.innerHTML =
            "<ul class='nav nav-tabs' id='dbf-subtabs' style='margin:0 0 10px 0;'>"
            + "<li class='active'><a href='#dbf-pane-settings'>Parametres</a></li>"
            + "<li><a href='#dbf-pane-signs'>Panneaux</a></li>"
            + "<li><a href='#dbf-pane-custom'>Personnalisation</a></li>"
            + "</ul>"
            + "<div class='tab-content'>"
            + "<div class='tab-pane active' id='dbf-pane-settings'>" + DBFcontent + "</div>"
            + "<div class='tab-pane' id='dbf-pane-signs'>" + RScontent + "</div>"
            + "<div class='tab-pane' id='dbf-pane-custom'>" + CustomContent + "</div>"
            + "</div>";

        DBFhandleClass2.appendChild(DBFaddon);


        // switch sous-onglets
        (function () {
            var tabs = DBFaddon.querySelector('#dbf-subtabs');
            tabs.addEventListener('click', function (ev) {
                var a = ev.target.closest('a'); if (!a) return;
                ev.preventDefault();
                Array.from(tabs.querySelectorAll('li')).forEach(li => li.classList.remove('active'));
                a.parentElement.classList.add('active');
                DBFaddon.querySelectorAll('.tab-content .tab-pane').forEach(p => p.classList.remove('active'));
                var pane = DBFaddon.querySelector(a.getAttribute('href'));
                if (pane) pane.classList.add('active');
                if (a.getAttribute('href') === '#dbf-pane-signs') RS_renderLegend();
            }, false);
        })();

        // rendu panneaux (utilise RS_buildIcon(code,value))
        function RS_renderLegend() {
            var cont = document.getElementById("rsLegendContainer");
            var status = document.getElementById("rsLegendStatus");
            if (!cont) return;
            cont.innerHTML = "";
            if (status) status.textContent = "Génération…";

            const items = [
                { code: "EB10", label: "EB10 (entrée agglo – vierge)" },
                { code: "EB20", label: "EB20 (sortie agglo – vierge)" },
                { code: "B14", value: "30", label: "B14-30" },
                { code: "B14", value: "50", label: "B14-50" },
                { code: "B14", value: "70", label: "B14-70" },
                { code: "B31", label: "B31 (fin d’interdictions)" },
                { code: "B33", value: "70", label: "B33-70 (fin de limitation)" },
                { code: "C107", label: "C107 (route réglementée – début)" },
                { code: "C108", label: "C108 (route réglementée – fin)" },
                { code: "C207", label: "C207 (début autoroute)" },
                { code: "C208", label: "C208 (fin autoroute)" },
                // Distances / étendue
                { code: "M1", value: "350", label: "M1 – 350 m" },
                { code: "M1", value: "1200", label: "M1 – 1,2 km" },
                { code: "M2", value: "500", label: "M2 – étendue 500 m" },
                { code: "M2", value: "2000", label: "M2 – étendue 2 km" },

                // Directions
                { code: "M3A", value: "droite", label: "M3a – flèche à droite" },
                { code: "M3A", value: "gauche", label: "M3a – flèche à gauche" },
                { code: "M3D", label: "M3d – flèche vers le bas (voie)" },

                // Catégories de véhicules / matières
                { code: "M4A", label: "M4a – voiture (≤ 3,5 t)" },
                { code: "M4B", label: "M4b – bus / TC" },
                { code: "M4C", label: "M4c – moto" },
                { code: "M4F", value: "3.5", label: "M4f – masse 3,5 t" },
                { code: "M4F", value: "≤ 7.5", label: "M4f – masse ≤ 7,5 t" },
                { code: "M4G", label: "M4g – marchandises (camion)" },
                { code: "M4K", label: "M4k – matières inflammables" },
                { code: "M4L", label: "M4l – matières polluantes" },
                { code: "M4M", label: "M4m – matières dangereuses (ADR)" },
                { code: "M4X", label: "M4x – remorque > 250 kg" },

                // Rappel
                { code: "M9Z", label: "M9z – RAPPEL" }
            ];

            items.forEach(function (it) {
                var card = document.createElement("div");
                card.style.cssText = "border:1px solid #e2e4e7;border-radius:8px;padding:8px;background:#fff;";

                var title = document.createElement("div");
                title.style.cssText = "font-weight:600;font-size:12px;margin-bottom:6px;word-break:break-word;";
                title.textContent = it.label || (it.code + (it.value ? (" " + it.value) : ""));
                card.appendChild(title);

                var prev = document.createElement("div");
                prev.style.cssText = "display:flex;align-items:center;justify-content:center;min-height:84px;margin-bottom:6px;";
                var icon = null;
                try {
                    // si code M*, passe par le générateur panonceau
                    if (/^M/i.test(it.code)) icon = RS_buildPanonceau(it.code, it.value, 120);
                    else icon = RS_buildIcon(it.code, it.value);
                } catch (e) { console.error("[RS] RS_buildIcon error", it, e); }
                if (icon && icon.uri) {
                    var img = document.createElement("img");
                    img.src = icon.uri;
                    img.width = Math.min(icon.w || 80, 100);
                    img.height = Math.min(icon.h || 80, 100);
                    img.alt = title.textContent;
                    prev.appendChild(img);
                } else {
                    prev.innerHTML = "<span style='color:#c00;font-size:12px;'>Erreur rendu</span>";
                }
                card.appendChild(prev);

                var meta = document.createElement("div");
                meta.style.cssText = "font-family:monospace;font-size:11px;color:#444;margin-bottom:2px;";
                meta.textContent = "code: " + it.code + (it.value ? (" | value: " + it.value) : "");
                card.appendChild(meta);

                // petit footer neutre pour garder une structure stable (remplace l'ancien <details>)
                var spacer = document.createElement("div");
                spacer.style.cssText = "height:0;";
                card.appendChild(spacer);

                cont.appendChild(card);
            });

            if (status) status.textContent = "OK (" + items.length + " panneaux)";
        }

        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'rsLegendRefresh') RS_renderLegend();
        }, true);
        document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'dbfCopyMail') {
        if (!window.DBF_currentSignalementData) return;

        const text = DBF_buildMailTemplate(window.DBF_currentSignalementData);

        navigator.clipboard.writeText(text).then(() => {
            e.target.textContent = "✅ Modèle copié";
            setTimeout(() => {
                e.target.textContent = "📋 Copier le modèle de mail";
            }, 2000);
        }).catch(() => {
            alert("Impossible de copier le texte automatiquement.");
        });
    }
}, true);


        document.addEventListener('change', function (e) {
            if (e.target && e.target.id === 'dbfSignalementSelect') {
                const val = e.target.value;
                const box = document.getElementById('dbfSignalementResult');
                if (!val || !box) return;

                box.innerHTML = `<div class="dbf-chip loading"><a>Vérification… <span class="dbf-spinner"></span></a></div>`;

                checkSignalement(val, result => {
                    renderResult(box, result);
                });
            }
        }, true);


        // si l’onglet Panneaux est déjà actif (reload)
        setTimeout(function () {
            var pane = DBFaddon.querySelector('#dbf-pane-signs');
            if (pane && pane.classList.contains('active')) RS_renderLegend();
        }, 300);

        /*var DBFaddon=document.createElement('section');
        DBFaddon.id="sidepanel-DrawBordersFR";
        DBFaddon.innerHTML=DBFcontent;
        DBFaddon.className='tab-pane';
        DBFhandleClass2.appendChild(DBFaddon);*/


        var settings = JSON.parse(localStorage.DBFsettings);
        (settings.optionDBF0 === true ? getId('optionDBF0').checked = 'checked' : getId('optionDBF0').checked = 'false');
        (settings.optionDBF1 === true ? getId('optionDBF1').checked = 'checked' : getId('optionDBF1').checked = 'false');
        (settings.optionDBF2 === true ? getId('optionDBF2').checked = 'checked' : getId('optionDBF2').checked = 'false');
        (settings.optionDBF3 === true ? getId('optionDBF3').checked = 'checked' : getId('optionDBF3').checked = 'false');
        (settings.optionDBF4 === true ? getId('optionDBF4').checked = 'checked' : getId('optionDBF4').checked = 'false');
        (settings.optionDBF5 === true ? getId('optionDBF5').checked = 'checked' : getId('optionDBF5').checked = 'false');
        (settings.optionDBF6 === true ? getId('optionDBF6').checked = 'checked' : getId('optionDBF6').checked = 'false');
        (settings.optionDBF7 === true ? getId('optionDBF7').checked = 'checked' : getId('optionDBF7').checked = 'false');
        (settings.optionDBF8 === true ? getId('optionDBF8').checked = 'checked' : getId('optionDBF8').checked = 'false');
        (settings.optionDBF9 === true ? getId('optionDBF9').checked = 'checked' : getId('optionDBF9').checked = 'false');

        getId('optionDBF0').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF0').checked ? a.optionDBF0 = true : a.optionDBF0 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF1').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF1').checked ? a.optionDBF1 = true : a.optionDBF1 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF2').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF2').checked ? a.optionDBF2 = true : a.optionDBF2 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF3').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF3').checked ? a.optionDBF3 = true : a.optionDBF3 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF4').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF4').checked ? a.optionDBF4 = true : a.optionDBF4 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF5').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF5').checked ? a.optionDBF5 = true : a.optionDBF5 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF6').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF6').checked ? a.optionDBF6 = true : a.optionDBF6 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF7').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            if (getId('optionDBF7').checked) { a.optionDBF7 = true; a.optionDBF8 = false; getId('optionDBF8').checked = "false"; } else { a.optionDBF7 = false; }
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF8').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            if (getId('optionDBF8').checked) { a.optionDBF8 = true; a.optionDBF7 = false; getId('optionDBF7').checked = "false"; } else { a.optionDBF8 = false; }
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('optionDBF9').addEventListener('click', function (e) {
            var a = JSON.parse(localStorage.DBFsettings);
            (getId('optionDBF9').checked ? a.optionDBF9 = true : a.optionDBF9 = false)
            localStorage.setItem('DBFsettings', JSON.stringify(a));
            load_ban();
        });
        getId('layerBanVisib').addEventListener('click', function (e) {
            getId('layer-switcher-item_infos_ban_').click();
            if (Ban_Layer.visibility === true) { getId('layerBanVisib').style.backgroundColor = '#bbffcc'; }
            else { getId('layerBanVisib').style.backgroundColor = '#fac3c3'; }
            load_ban();
        });
        getId('layerHNVisib').addEventListener('click', function (e) {
            getId('layer-switcher-item_house_numbers').click();
            if ($('#layer-switcher-item_house_numbers').prop('checked') === true) { getId('layerHNVisib').style.backgroundColor = '#bbffcc'; }
            else { getId('layerHNVisib').style.backgroundColor = '#fac3c3'; }
            load_ban();
        });
        getId('zoomBanValue').addEventListener('click', function (e) {
            W.map.getOLMap().zoomTo("19");
            if (W.map.getZoom() < 19) { getId('zoomBanValue').style.backgroundColor = '#fac3c3'; }
            else { getId('zoomBanValue').style.backgroundColor = '#bbffcc'; }
            load_ban();
        });
        getId('DBFselectRoad').addEventListener('change', function (e) { load_ban(); });

        getId('zoomBanValue').innerHTML = "Zoom: " + W.map.getZoom();
        if (W.map.getZoom() < 19) { getId('zoomBanValue').style.backgroundColor = '#fac3c3'; }
        else { getId('zoomBanValue').style.backgroundColor = '#bbffcc'; }

        getId('zoomMiscValue').innerHTML = "Zoom: " + W.map.getZoom();
        if (W.map.getZoom() < 13) { getId('zoomMiscValue').style.backgroundColor = '#fac3c3'; }
        else { getId('zoomMiscValue').style.backgroundColor = '#bbffcc'; }

        if (Ban_Layer.visibility === true) { getId('layerBanVisib').style.backgroundColor = '#bbffcc'; }
        else { getId('layerBanVisib').style.backgroundColor = '#fac3c3'; }

        if ($('#layer-switcher-item_house_numbers').prop('checked') === true) { getId('layerHNVisib').style.backgroundColor = '#bbffcc'; }
        else { getId('layerHNVisib').style.backgroundColor = '#fac3c3'; }
        // Charger /updates au chargement
        try {
            fetchUpdatesGM()
                .then(renderUpdatesBar)
                .catch(err => {
                console.error('[DBF] /updates error:', err);
                renderUpdatesBar([]);
            });
        } catch (e) {
            console.error('[DBF] updates init failed:', e);
        }
        document.getElementById('dbf-refresh-updates').addEventListener('click', function () {
            const btn = this;
            btn.disabled = true;
            btn.textContent = "Chargement…";

            fetchUpdatesGM()
                .then(updates => {
                renderUpdatesBar(updates);
                btn.textContent = "Rafraîchir";
                btn.disabled = false;
            })
                .catch(err => {
                console.error("[DBF] refresh error:", err);
                btn.textContent = "Erreur";
                setTimeout(() => {
                    btn.textContent = "Rafraîchir";
                    btn.disabled = false;
                }, 1500);
            });
        });
        DBF_initCustomPanel();


    }
    function setCheck(id, value) {
        var el = document.getElementById(id);
        if (el) el.checked = !!value;
    }

    function DBF_initCustomPanel() {
        var styles = DBF_getStyles();
        function setVal(id, value) {
            var el = document.getElementById(id);
            if (el && value !== undefined && value !== null) el.value = value;
        }

        // CITY
        setVal("dbfCityStroke", styles.city.strokeColor);
        setVal("dbfCityStrokeWidth", styles.city.strokeWidth);
        setVal("dbfCityFontColor", styles.city.fontColor);
        setVal("dbfCityFontSize", styles.city.fontSize);
        setCheck("dbfCityShowLabel", styles.city.showLabel);


        // DEP
        setVal("dbfDepStroke", styles.dep.strokeColor);
        setVal("dbfDepStrokeWidth", styles.dep.strokeWidth);
        setVal("dbfDepFontColor", styles.dep.fontColor);
        setVal("dbfDepFontSize", styles.dep.fontSize);

        // BAN
        setVal("dbfBanVerifiedStroke", styles.ban.verifiedStroke);
        setVal("dbfBanUnverifiedStroke", styles.ban.unverifiedStroke);
        setVal("dbfBanTextMissing", styles.ban.textMissing);
        setVal("dbfBanTextExisting", styles.ban.textExisting);
        setVal("dbfBanStrokeWidth", styles.ban.strokeWidth);
        setVal("dbfBanFontSize", styles.ban.fontSize);

        // EQUIP
        setVal("dbfEquipStroke", styles.equip.strokeColor);
        setVal("dbfEquipStrokeWidth", styles.equip.strokeWidth);
        setVal("dbfEquipFontColor", styles.equip.fontColor);
        setVal("dbfEquipFontSize", styles.equip.fontSize);

        // ETABL
        setVal("dbfEtablStroke", styles.etabl.strokeColor);
        setVal("dbfEtablStrokeWidth", styles.etabl.strokeWidth);
        setVal("dbfEtablFontColor", styles.etabl.fontColor);
        setVal("dbfEtablFontSize", styles.etabl.fontSize);

        // RADAR
        setVal("dbfRadarStroke", styles.radar.strokeColor);
        setVal("dbfRadarStrokeWidth", styles.radar.strokeWidth);
        setVal("dbfRadarFontColor", styles.radar.fontColor);
        setVal("dbfRadarFontSize", styles.radar.fontSize);

        // PR
        setVal("dbfPrStroke", styles.pr.strokeColor);
        setVal("dbfPrStrokeWidth", styles.pr.strokeWidth);
        setVal("dbfPrFontColor", styles.pr.fontColor);
        setVal("dbfPrFontSize", styles.pr.fontSize);

        // PANNEAUX
        setVal("dbfRsScale", Math.round((styles.rs.scale || 1) * 100));

        // Bouton Appliquer
        var btnApply = document.getElementById("dbfCustomApply");
        if (btnApply) {
            btnApply.addEventListener("click", function () {
                var s = DBF_getStyles();

                function num(id, def) {
                    var el = document.getElementById(id);
                    var v = el ? Number(el.value) : NaN;
                    return isNaN(v) ? def : v;
                }
                function col(id, def) {
                    var el = document.getElementById(id);
                    return el && el.value ? el.value : def;
                }

                s.city = {
                    strokeColor: col("dbfCityStroke", s.city.strokeColor),
                    strokeWidth: num("dbfCityStrokeWidth", s.city.strokeWidth),
                    fontColor: col("dbfCityFontColor", s.city.fontColor),
                    fontSize: num("dbfCityFontSize", s.city.fontSize),
                    showLabel: document.getElementById("dbfCityShowLabel").checked
                };

                s.dep = {
                    strokeColor: col("dbfDepStroke", s.dep.strokeColor),
                    strokeWidth: num("dbfDepStrokeWidth", s.dep.strokeWidth),
                    fontColor: col("dbfDepFontColor", s.dep.fontColor),
                    fontSize: num("dbfDepFontSize", s.dep.fontSize)
                };

                s.ban = {
                    verifiedStroke: col("dbfBanVerifiedStroke", s.ban.verifiedStroke),
                    unverifiedStroke: col("dbfBanUnverifiedStroke", s.ban.unverifiedStroke),
                    textMissing: col("dbfBanTextMissing", s.ban.textMissing),
                    textExisting: col("dbfBanTextExisting", s.ban.textExisting),
                    strokeWidth: num("dbfBanStrokeWidth", s.ban.strokeWidth),
                    fontSize: num("dbfBanFontSize", s.ban.fontSize)
                };

                s.equip = {
                    strokeColor: col("dbfEquipStroke", s.equip.strokeColor),
                    strokeWidth: num("dbfEquipStrokeWidth", s.equip.strokeWidth),
                    fontColor: col("dbfEquipFontColor", s.equip.fontColor),
                    fontSize: num("dbfEquipFontSize", s.equip.fontSize)
                };

                s.etabl = {
                    strokeColor: col("dbfEtablStroke", s.etabl.strokeColor),
                    strokeWidth: num("dbfEtablStrokeWidth", s.etabl.strokeWidth),
                    fontColor: col("dbfEtablFontColor", s.etabl.fontColor),
                    fontSize: num("dbfEtablFontSize", s.etabl.fontSize)
                };

                s.radar = {
                    strokeColor: col("dbfRadarStroke", s.radar.strokeColor),
                    strokeWidth: num("dbfRadarStrokeWidth", s.radar.strokeWidth),
                    fontColor: col("dbfRadarFontColor", s.radar.fontColor),
                    fontSize: num("dbfRadarFontSize", s.radar.fontSize)
                };

                s.pr = {
                    strokeColor: col("dbfPrStroke", s.pr.strokeColor),
                    strokeWidth: num("dbfPrStrokeWidth", s.pr.strokeWidth),
                    fontColor: col("dbfPrFontColor", s.pr.fontColor),
                    fontSize: num("dbfPrFontSize", s.pr.fontSize)
                };

                var rsScalePct = num("dbfRsScale", 100);
                s.rs = {
                    scale: rsScalePct / 100.0
                };

                DBF_saveStyles(s);
                DBF_applyLiveUpdates();
            });
        }

        // Bouton Reset
        var btnReset = document.getElementById("dbfCustomReset");
        if (btnReset) {
            btnReset.addEventListener("click", function () {
                if (confirm("Réinitialiser tous les styles aux valeurs par défaut ?")) {
                    localStorage.removeItem("DBFstyles");
                    location.reload();
                }
            });
        }
    }

    function DBF_applyLiveUpdates() {
        console.log("[DBF] Mise à jour des style");

        // 1. Forcer OpenLayers à recalculer les styles
        var layers = W.map.layers;

        layers.forEach(function (layer) {
            if (!layer || !layer.uniqueName) return;

            if (
                layer.uniqueName == "__WME_Draw_Border_Cty" ||
                layer.uniqueName == "__WME_Draw_Border_Dpt" ||
                layer.uniqueName == "__WME_Draw_Border_Ban" ||
                layer.uniqueName == "__WME_Draw_Border_Equip" ||
                layer.uniqueName == "__WME_Draw_Border_Etabl" ||
                layer.uniqueName == "__WME_Draw_Border_Cam" ||
                layer.uniqueName == "__WME_Draw_Border_PR" ||
                layer.uniqueName.includes("__WME_DrawSigns")
            ) {
                try {
                    layer.redraw();
                } catch (e) {
                    console.error("Erreur redraw:", layer.uniqueName, e);
                }
            }
        });

        console.log("[DBF] Styles mis à jour immédiatement !");
    }

    let DBF_poll_delay = 60000;
    let DBF_poll_timer = null;

    function pollUpdates() {

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.wazefrance.com/updates",
            timeout: 10000,
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const updates = data.updates || [];

                    renderUpdatesBar(updates);

                    const anyRunning = updates.some(u => u.en_cours == 1);

                    if (anyRunning) {
                        DBF_poll_delay = 15000;
                    } else {
                        DBF_poll_delay = 60000;
                    }

                } catch (err) {
                    console.error("[DBF] update polling error:", err);
                }

                DBF_poll_timer = setTimeout(pollUpdates, DBF_poll_delay);
            },

            onerror: function() {
                console.warn("[DBF] Erreur GM_xmlhttpRequest, retry dans 30s");
                DBF_poll_delay = 30000;
                DBF_poll_timer = setTimeout(pollUpdates, DBF_poll_delay);
            }
        });
    }

    pollUpdates();

    function fetchUpdatesGM() {
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: 'GET',
                url: UPDATES_ENDPOINT,
                headers: { 'Accept': 'application/json' },
                onload: function(res){
                    try {
                        if (res.status < 200 || res.status >= 300) return reject(new Error('HTTP ' + res.status));
                        const json = JSON.parse(res.responseText || '{}');
                        resolve(Array.isArray(json.updates) ? json.updates : []);
                    } catch(e){ reject(e); }
                },
                onerror: function(err){ reject(err); }
            });
        });
    }

    function renderUpdatesBar(updates) {
        const el = document.getElementById('dbf-updates-bar');
        if (!el) return;

        el.style.display = 'none';
        el.innerHTML = '';

        if (!updates || !updates.length) return;

        // Ordre souhaité
        const pref = ['ban','panneaux','sante','sirene','dep','commune','equip / etab'];

        // Normalisation des noms dans une map
        const byName = new Map();
        updates.forEach(u =>
                        byName.set(String((u.nom || '').trim().toLowerCase()), u)
                       );

        // Tri ordonné
        const ordered = [];
        pref.forEach(n => {
            const u = byName.get(n);
            if (u) ordered.push(u);
        });

        updates.forEach(u => {
            const n = String((u.nom || '').trim().toLowerCase());
            if (!pref.includes(n)) ordered.push(u);
        });

        // Construction UI
        ordered.forEach((u, i) => {
            const chip = document.createElement('span');
            chip.className = 'dbf-chip' + (u.en_cours == 1 ? ' loading' : '');

            const a = document.createElement('a');
            a.href = u.lien || '#';
            a.target = '_blank';

            // --- TEXTE DANS LE CHIP -------------------------------------
            if (u.en_cours == 1) {
                // Affichage : nom + pourcentage + point bleu animé
                a.innerHTML = `
                [${u.nom}]
                <strong style="color:#2563eb">${u.progress || 0}%</strong>
                <span class="dbf-spinner"></span>
            `;
            } else {
                // Si pas en cours → nom seulement
                a.textContent = `[${u.nom}]`;
                a.title = 'Dernière mise à jour : ' + (u.date || '—');
            }

            chip.appendChild(a);
            el.appendChild(chip);

            // Séparateur " | "
            if (i < ordered.length - 1) {
                const pipe = document.createElement('span');
                pipe.className = 'dbf-pipe';
                pipe.textContent = '|';
                el.appendChild(pipe);
            }
        });

        // Affichage final
        el.style.display = 'flex';
    }

    function LayerVilToggled(checked) { Cty_Layer.setVisibility(checked); }
    function LayerDepToggled(checked) { Dpt_Layer.setVisibility(checked); }
    function LayerPRToggled(checked) { PR_Layer.setVisibility(checked); }
    function LayerCamToggled(checked) { Cam_Layer.setVisibility(checked); }
    function LayerBanToggled(checked) { Ban_Layer.setVisibility(checked); }
    function LayerEquipToggled(checked) { Equip_Layer.setVisibility(checked); }
    function LayerEtablToggled(checked) { Etabl_Layer.setVisibility(checked); }
    function LayerRSToggled(checked) { RS_Layer.setVisibility(checked); }

    function show_border() {

        getId('zoomMiscValue').innerHTML = "Zoom: " + W.map.getZoom();
        if (W.map.getZoom() < 13) { getId('zoomMiscValue').style.backgroundColor = '#fac3c3'; return; }
        else { getId('zoomMiscValue').style.backgroundColor = '#bbffcc'; }

        var Cty_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Cty"; });
        var Dpt_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Dpt"; });
        var PR_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_PR"; });
        var Cam_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Cam"; });
        var Equip_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Equip"; });
        var Etabl_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Etabl"; });
        var RS_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_RS"; });

        //On récupère les infos de la carte et vérification de la présence de toutes les données nécessaires
        let lonlat = new OpenLayers.LonLat(W.map.getProjectedCenter().lon, W.map.getProjectedCenter().lat);
        lonlat.transform(W.Config.map.projection.local, W.Config.map.projection.remote);
        let pt = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
        var clat = pt.y;
        var clon = pt.x;
        var zoomLevel = W.map.getZoom();
        if (!clat || !clon || !zoomLevel) {
            console.error("Latitude, longitude ou zoomLevel manquant dans l'URL");
            return;
        }

        // RS_Layer.visibility - Panneaux routiers (icônes)
        if (RS_Layer && RS_Layer.visibility === true) {
            // zoom mini pour lisibilité
            getId('zoomMiscValue').innerHTML = "Zoom: " + W.map.getZoom();
            if (W.map.getZoom() < 16) { getId('zoomMiscValue').style.backgroundColor = '#fac3c3'; }
            else { getId('zoomMiscValue').style.backgroundColor = '#bbffcc'; }

            // coordonnées centre
            let lonlat = new OpenLayers.LonLat(W.map.getProjectedCenter().lon, W.map.getProjectedCenter().lat);
            lonlat.transform(W.Config.map.projection.local, W.Config.map.projection.remote);
            let clat = lonlat.lat, clon = lonlat.lon, zoomLevel = W.map.getZoom();
            if (!clat || !clon || !zoomLevel) return;

            try {
                getId('loadMiscData').style.backgroundColor = '#bbffcc';

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.wazefrance.com/rs?lat=' + clat + '&lon=' + clon + '&zoom=' + zoomLevel,
                    onload: function (response) {
                        if (response.status === 200) {
                            var data = JSON.parse(response.responseText);
                            var list = data.rs || [];

                            // reset file + calque
                            RS_pending = [];
                            RS_Layer.removeAllFeatures();

                            // on met en file
                            for (var i = 0; i < list.length; i++) {
                                var it = list[i];
                                RS_queueSign(
                                    { code: it.panneau_code, value: it.panneau_value },
                                    it.pannonceau_code ? { code: it.pannonceau_code, value: it.pannonceau_value } : null,
                                    it.longitude, it.latitude
                                );
                            }

                            // on rend les clusters (un seul SVG par groupe à ≤ 5 m)
                            RS_renderClusters();

                            getId('loadMiscData').style.backgroundColor = '#ffffff';
                        } else {
                            getId('loadMiscData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (err) {
                        console.error("RS fetch error:", err);
                        getId('loadMiscData').style.backgroundColor = '#fac3c3';
                    }
                });
            } catch (ex) {
                console.error(ex);
                getId('loadMiscData').style.backgroundColor = '#fac3c3';
            }
        }

        // Cty_Layer.visibility - Limites villes
        if (Cty_Layer.visibility === true) {

            var extent = W.map.getExtent();
            var minLon = extent.left  !== undefined ? extent.left  : extent[0];
            var minLat = extent.bottom !== undefined ? extent.bottom : extent[1];
            var maxLon = extent.right !== undefined ? extent.right : extent[2];
            var maxLat = extent.top   !== undefined ? extent.top   : extent[3];

            var bbox = [
                Number(minLon.toFixed(6)),
                Number(minLat.toFixed(6)),
                Number(maxLon.toFixed(6)),
                Number(maxLat.toFixed(6))
            ];

            var zoomLevel = W.map.getZoom();

            // Détecter si c'est un zoom ou un pan
            var isZoomChange = (Cty_LastZoom !== null && zoomLevel !== Cty_LastZoom);
            Cty_LastZoom = zoomLevel;

            if (debug) {
                console.log("[COMMUNES DEBUG] Zoom:", zoomLevel, "isZoomChange:", isZoomChange);
                console.log("[COMMUNES DEBUG] BBOX:", bbox);
            }

            // Option : ne pas charger si trop dézoomé
            if (zoomLevel < 10) {
                if (debug) console.log("[COMMUNES DEBUG] Zoom trop faible, pas de requête communes.");
                return;
            }

            // Si la BBOX n'a pas changé, on ne fait rien
            if (JSON.stringify(Cty_BboxOld) === JSON.stringify(bbox)) {
                if (debug) console.log("WME Draw Borders France: BBOX inchangée, pas de nouvelle requête communes");
                return;
            }

            Cty_BboxOld = bbox.slice();

            try {
                getId('loadMiscData').style.backgroundColor = '#bbffcc';

                var datas = JSON.stringify({ bbox: bbox });

                if (debug) {
                    console.log("[COMMUNES DEBUG] XHR SEND /communes", datas);
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    url: 'https://api.wazefrance.com/communes',
                    data: datas,
                    onload: function (response) {
                        if (response.status == 200 || response.status == '200') {
                            var data = JSON.parse(response.responseText);
                            var temp_city = "", c = 0;

                            // 🧹 PAN : on nettoie TOUT et on repart uniquement avec cette BBOX
                            if (!isZoomChange) {
                                if (debug) console.log("[COMMUNES DEBUG] PAN détecté → removeAllFeatures()");
                                Cty_Layer.removeAllFeatures();
                            } else {
                                if (debug) console.log("[COMMUNES DEBUG] ZOOM détecté → on conserve les communes existantes");
                            }

                            // Maintenant on dessine toutes les communes renvoyées par l'API
                            for (var i = 0; i < data.length; i++) {
                                let name = data[i].name;
                                let coords = data[i].coord;

                                Cty_Borders_DrawBorder(name, coords);
                                c++;
                                if (debug) temp_city = temp_city + name + ", ";
                            }

                            if (debug) {
                                console.log("WME Draw Borders France: " + c + " communes dessinées pour la BBOX", temp_city);
                            }

                            getId('loadMiscData').style.backgroundColor = '#ffffff';
                        } else {
                            console.error("Erreur API /communes :", response.status, response.statusText);
                            getId('loadMiscData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (error) {
                        console.error("Erreur réseau /communes :", error);
                        getId('loadMiscData').style.backgroundColor = '#fac3c3';
                    }
                });
            } catch (ex) {
                console.error(`${SCRIPT_NAME} /communes bbox:`, ex);
            }
        }

        //Dpt_Layer.visibility - Limites départements
        if (Dpt_Layer.visibility === true) {
            if (W.model.states.objects.length === 0) return;

            // Collect list if unique states from the segments
            var States = [], temp_state = "";
            for (var sid in W.model.states.objects) {
                var state = W.model.states.getObjectById(sid).attributes;
                if (state.countryID == "73") {
                    state = state.name.replace(/[èé]/g, "e").replace(/[ô]/g, 'o').replace(/\'/g, '_').replace(/ /g, '_');
                    States.push({ name: state });
                    if (debug) { temp_state = temp_state + state + ", "; }
                }
            }
            if (debug) { console.log("Départements demandés : ", temp_state); }

            // Get Data
            try {
                if (JSON.stringify(StatesOld) != JSON.stringify(States)) {
                    getId('loadMiscData').style.backgroundColor = '#bbffcc';
                    if (debug) { console.log("XHR SEND ", States); }
                    var datas = JSON.stringify(States);

                    GM_xmlhttpRequest({
                        method: 'POST',
                        headers: { "Content-Type": "application/JSON" },
                        url: 'https://api.wazefrance.com/dep',
                        data: datas,
                        onload: function (response) {
                            if (response.status == '200') {
                                var data = JSON.parse(response.responseText);
                                var temp_city = "", c = 0;
                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        Dpt_Borders_DrawBorder(data[i].name, data[i].coord); c++;
                                        if (debug) { temp_state = temp_state + data[i].name + ", "; }
                                    }
                                }
                                if (debug) { console.log("WME Draw Borders France: " + c + " départements reçus ", temp_state); }
                                getId('loadMiscData').style.backgroundColor = '#ffffff';
                            } else {
                                getId('loadMiscData').style.backgroundColor = '#fac3c3';
                            }
                        },
                        onerror: function (error) {
                            console.error("Erreur réseau :", error);
                        }
                    });

                    StatesOld = States;
                } else {
                    if (debug) { console.log("WME Draw Borders France: Pas de nouveaux Départements détectés"); }
                }
            } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
        }

        //PR_Layer.visibility - Points routiers
        if (PR_Layer.visibility === true) {
            //Get Data
            try {
                getId('loadMiscData').style.backgroundColor = '#bbffcc';
                var ret = GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.wazefrance.com/pr?lat=' + clat + '&lon=' + clon + '&zoom=' + zoomLevel,
                    onload: function (response) {
                        if (response.status == '200') {
                            var r = JSON.parse(response.responseText), r = r.pr;
                            if (r.length > 0) {
                                for (var i = 0; r[i]; i++) {
                                    PR_Borders_DrawBorder(r[i].numero, r[i].longitude, r[i].latitude);
                                }
                            }
                            if (debug) { console.log("WME Draw Borders France: Points Routiers chargés", JSON.parse(response.responseText)); }
                            getId('loadMiscData').style.backgroundColor = '#ffffff';
                        } else {
                            getId('loadMiscData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (error) {
                        console.error("Erreur réseau :", error);
                    }
                });
            } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
        }

        //Equip_Layer.visibility - Rond-Poin, Parking
        if (Equip_Layer.visibility === true) {
            //Get Data
            try {
                getId('loadMiscData').style.backgroundColor = '#bbffcc';

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.wazefrance.com/equipement_data?lat=' + clat + '&lon=' + clon + '&zoom=' + zoomLevel,
                    onload: function (response) {
                        if (response.status == '200') {
                            var r = JSON.parse(response.responseText), r = r.equipements;
                            if (debug) { console.log("WME Draw Borders France: Equipements chargés", JSON.parse(response.responseText)); }
                            if (r.length > 0) {
                                for (var i = 0; r[i]; i++) {
                                    Equip_Borders_DrawBorder("(" + r[i].nature + ")\n" + r[i].toponyme, r[i].lon, r[i].lat);
                                }
                            }
                            getId('loadMiscData').style.backgroundColor = '#ffffff';
                        } else {
                            getId('loadMiscData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (error) {
                        console.error("Erreur réseau :", error);
                    }
                });
            } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
        }

        //Etabl_Layer.visibility - Etablissement, Ecole
        if (Etabl_Layer.visibility === true) {
            //Get Data
            try {
                getId('loadMiscData').style.backgroundColor = '#bbffcc';
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.wazefrance.com/combined_data?lat=' + clat + '&lon=' + clon + '&zoom=' + zoomLevel,
                    onload: function (response) {
                        if (response.status == '200') {
                            var r = JSON.parse(response.responseText), r = r.établissements;
                            if (debug) { console.log("WME Draw Borders France: Etablissements chargés", JSON.parse(response.responseText)); }
                            if (r.length > 0) {
                                for (var i = 0; r[i]; i++) {
                                    Etabl_Borders_DrawBorder(r[i].appellation_officielle + "\n(" + r[i].adresse_uai + ")", r[i].longitude, r[i].latitude);
                                }
                            }
                            getId('loadMiscData').style.backgroundColor = '#ffffff';
                        } else {
                            getId('loadMiscData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (error) {
                        console.error("Erreur réseau :", error);
                    }
                });
            } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
        }

        //Cam_Layer.visibility
        if (Cam_Layer.visibility === true) {
            var listCam = localStorage.speedCamList;
            if (listCam) {
                var a = JSON.parse(listCam);
                if (debug) { console.log(a); }
                for (var i = 0; i < a.length; i++) { Cam_Borders_DrawBorder(a[i].typeLabel, a[i].lng, a[i].lat); }
            }
        }
    }
    function load_radar() {

        getId('zoomMiscValue').innerHTML = "Zoom: " + W.map.getZoom();
        if (W.map.getZoom() < 13) { getId('zoomMiscValue').style.backgroundColor = '#fac3c3'; return; }
        else { getId('zoomMiscValue').style.backgroundColor = '#bbffcc'; }

        var listCam = localStorage.speedCamList;
        //Get Data
        getId('loadMiscData').style.backgroundColor = '#bbffcc';
        try {
            var ret = GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://radars.securite-routiere.gouv.fr/radars/all?_format=json',
                onload: function (response) {
                    if (response.status == '200') {
                        if (_.isEqual(JSON.parse(listCam), JSON.parse(response.responseText)) !== true && response.responseText) {
                            console.log("WME Draw Borders France: Mise à jour de la liste des radars");
                            localStorage.setItem('speedCamList', response.responseText);
                        }
                        getId('loadMiscData').style.backgroundColor = '#ffffff';
                    } else {
                        getId('loadMiscData').style.backgroundColor = '#fac3c3';
                    }
                },
                onerror: function (error) {
                    console.error("Erreur réseau :", error);
                }
            });
        } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
    }
    function load_ban() {

        var Ban_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Ban"; });
        if (Ban_Layer.visibility === true) { getId('layerBanVisib').style.backgroundColor = '#bbffcc'; }
        else { getId('layerBanVisib').style.backgroundColor = '#fac3c3'; }

        if ($('#layer-switcher-item_house_numbers').prop('checked') === true) { getId('layerHNVisib').style.backgroundColor = '#bbffcc'; }
        else { getId('layerHNVisib').style.backgroundColor = '#fac3c3'; }

        getId('zoomBanValue').innerHTML = "Zoom: " + W.map.getZoom();
        if (W.map.getZoom() < 19) { getId('zoomBanValue').style.backgroundColor = '#fac3c3'; return; }
        else { getId('zoomBanValue').style.backgroundColor = '#bbffcc'; }

        if (Ban_Layer.visibility === true) {
            if (getId('optionDBF4').checked) { Ban_Layer.destroyFeatures(); checklayer("__WME_Draw_Border_Ban"); }
            else { Ban_Layer.redraw(); }

            //try {
            getId('loadBanData').style.backgroundColor = '#bbffcc';
            //Liste les noms de rue à l'écran
            var streetList = [];
            for (var i in W.model.streets.objects) {
                let streetObj = W.model.streets.objects[i];
                if (!streetObj || !streetObj.attributes) continue;

                var streetName = streetObj.attributes.name;

                if (streetName != "") {
                    if (streetList.indexOf(streetName) == - 1) {
                        streetList.push(streetName);
                    }
                }
            }
            streetList.sort();

            //Création du menu déroulant après l'avoir vidé (actualisation), mis l'option par défaut et, éventuellement, la rue sélectionnée
            var tmp = getId('DBFselectRoad').value;
            getId('DBFselectRoad').innerHTML = "";
            getId('selectedRoad').innerHTML = "";
            var cList = document.createElement('wz-option');
            cList.value = "";
            cList.innerHTML = "---";
            getId('DBFselectRoad').appendChild(cList);
            if (tmp != "") {
                cList = document.createElement('wz-option');
                cList.value = tmp;
                cList.innerHTML = tmp;
                getId('DBFselectRoad').appendChild(cList);
            }

            //On complète avec les autres rues
            for (var k = 0; streetList[k]; k++) {
                if (tmp != streetList[k]) {
                    cList = document.createElement('wz-option');
                    cList.value = streetList[k];
                    cList.innerHTML = streetList[k];
                    getId('DBFselectRoad').appendChild(cList);
                }
            }

            //Segment sélectionné à l'écran
            let sel = W.selectionManager.getSelectedWMEFeatures();
            if (sel && sel[0] && sel[0].featureType === 'segment') {
                let seg = W.model.segments.objects[sel[0].id];
                if (seg && seg.attributes) {
                    let streetObj = W.model.streets.objects[seg.attributes.primaryStreetID];
                    if (streetObj && streetObj.attributes) {
                        getId('selectedRoad').innerHTML = streetObj.attributes.name;
                    } else {
                        getId('selectedRoad').innerHTML = "";
                    }
                }
            }


            //Liste des n° de rue déjà existants sur la carte
            var HNdone = [];
            for (var i in W.model.segmentHouseNumbers.objects) {
                if (typeof W.model.segmentHouseNumbers.objects[i].attributes.segID != "null"
                    && typeof W.model.segments.objects[W.model.segmentHouseNumbers.objects[i].attributes.segID] != "undefined") {

                    // Mise en mémoire des noms de rue et ville
                    let segId = W.model.segmentHouseNumbers.objects[i].attributes.segID;
                    let segment = W.model.segments.objects[segId];
                    if (!segment || !segment.attributes) continue;

                    let streetId = segment.attributes.primaryStreetID;
                    let streetObj = W.model.streets.objects[streetId];
                    if (!streetObj || !streetObj.attributes) continue;

                    let streetName = streetObj.attributes.name;
                    streetName = streetName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                    let cityObj = W.model.cities.objects[streetObj.attributes.cityID];
                    if (!cityObj || !cityObj.attributes) continue;

                    let cityName = cityObj.attributes.name;
                    cityName = cityName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                    if (cityName.indexOf("(") > 0) { cityName = cityName.substring(cityName.indexOf("(") + 1).replace(")", ""); } // On garde le nom de la commune principale si sous-commune
                    HNdone.push(W.model.segmentHouseNumbers.objects[i].attributes.number + " " + streetName + " " + cityName);

                    // Mise en mémoire des noms de rue et ville alt
                    if (typeof W.model.segments.objects[segId].attributes.streetIDs[0] != "undefined") {
                        for (var j = 0; j < W.model.segments.objects[segId].attributes.streetIDs.length; j++) {
                            let altStreetId = segment.attributes.streetIDs[j];
                            let altStreetObj = W.model.streets.objects[altStreetId];
                            if (!altStreetObj || !altStreetObj.attributes) continue;

                            let streetAltName = altStreetObj.attributes.name;
                            streetAltName = streetAltName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                            let cityObj = W.model.cities.objects[streetObj.attributes.cityID];
                            if (!cityObj || !cityObj.attributes) continue;

                            let cityName = cityObj.attributes.name;
                            cityName = cityName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

                            if (cityName.indexOf("(") > 0) { cityName = cityName.substring(cityName.indexOf("(") + 1).replace(")", ""); } // On garde le nom de la commune principale si sous-commune
                            HNdone.push(W.model.segmentHouseNumbers.objects[i].attributes.number + " " + streetAltName + " " + cityName);
                        }
                    }
                }
            }

            //Liste des POI résidentiels déjà existants sur la carte
            for (var i in W.model.venues.objects) {
                if (typeof W.model.venues.objects[i].attributes.residential != "null"
                    && typeof W.model.venues.objects[i].attributes.streetID != "undefined"
                    && typeof W.model.streets.objects[W.model.venues.objects[i].attributes.streetID] != "undefined") {
                    let venue = W.model.venues.objects[i];
                    if (!venue || !venue.attributes) continue;

                    let streetObj = W.model.streets.objects[venue.attributes.streetID];
                    if (!streetObj || !streetObj.attributes) continue;

                    let streetName = streetObj.attributes.name;
                    streetName = streetName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                    let cityObjAlt = W.model.cities.objects[streetObj.attributes.cityID];
                    if (!cityObjAlt || !cityObjAlt.attributes) continue;

                    let cityName = cityObjAlt.attributes.name;
                    cityName = cityName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                    if (cityName.indexOf("(") > 0) { cityName = cityName.substring(cityName.indexOf("(") + 1).replace(")", ""); } // On garde le nom de la commune principale si sous-commune
                    HNdone.push(W.model.venues.objects[i].attributes.houseNumber + " " + streetName + " " + cityName);
                }
            }

            //On récupère les infos de la carte et vérification de la présence de toutes les données nécessaires
            let lonlat = new OpenLayers.LonLat(W.map.getProjectedCenter().lon, W.map.getProjectedCenter().lat);
            lonlat.transform(W.Config.map.projection.local, W.Config.map.projection.remote);
            let pt = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            var clat = pt.y;
            var clon = pt.x;
            var extent = W.map.getExtent();
            var minLon = extent[0];
            var minLat = extent[1];
            var maxLon = extent[2];
            var maxLat = extent[3];
            var bbox = [minLon, minLat, maxLon, maxLat];
            var zoomLevel = W.map.getZoom();
            //console.log("[BAN DEBUG] Zoom:", zoomLevel);
            //console.log("[BAN DEBUG] BBOX:", bbox);
            if (!clat || !clon || !zoomLevel) {
                console.error("Latitude, longitude ou zoomLevel manquant dans l'URL");
                return;
            }

            // Requête à l'API Flask
            var bboxParam = bbox.map(function (n) { return Number(n).toFixed(6); }).join(',');
            console.log("[BAN DEBUG] URL API:", 'https://api.wazefrance.com/combined_data?bbox=' + bboxParam + '&zoom=' + zoomLevel);
            try {
                var ret = GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.wazefrance.com/combined_data?bbox=' + bboxParam + '&zoom=' + zoomLevel,
                    onload: function (response) {
                        if (response.status == '200') {

                            const correction = {
                                "mal ": "maréchal ",
                                "av ": "avenue ",
                                "oe": "œ", "œ": "oe",
                                "ae": "æ", "æ": "ae",
                                //" jean ": "jean-",
                                //" marie ": "marie-",
                                " st ": " saint-",
                                " saint ": " saint-",
                                "zone artisanale ": "z.a. "
                            };

                            var adresses = JSON.parse(response.responseText);

                            //Numéros de rue
                            if (debug) { console.log("N° BAN", adresses.info_ban); }

                            var a = adresses.info_ban;
                            getId('banQty').innerHTML = a.length;
                            adresses_list = a.map(x => ({
                                id_raw: x.id,
                                id_signalement: x.id.split('_').slice(0, 3).join('_'),
                                numero: x.numero + (x.rep ?? ""),
                                voie: x.nom_voie,
                                commune: x.nom_commune,
                                lon: x.lon,
                                lat: x.lat
                            }));
                            setTimeout(DBF_initBanSearch, 0);
                            (a.length > 199 ? getId('banQty').style.color = "red" : getId('banQty').style.color = "black")

                            for (var i = 0; i < a.length; i++) {
                                var adresse = a[i], nomRueCorr;
                                var nomRueBan = adresse.numero + (adresse.rep != null ? adresse.rep : "") + " " + adresse.nom_voie;
                                var NumeroRue = adresse.numero + (adresse.rep != null ? adresse.rep : "");
                                var nomCommuneBAN = adresse.nom_commune;

                                nomRueCorr = nomRueBan.toLowerCase();
                                Object.keys(correction).forEach((key) => {
                                    nomRueCorr = nomRueCorr.replaceAll(key, correction[key]);
                                    nomCommuneBAN = nomCommuneBAN.replaceAll(key, correction[key]);
                                });

                                nomRueCorr = nomRueCorr.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace("’", "'");
                                var nomCommuneCorr = nomCommuneBAN.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

                                if (getId('optionDBF9').checked == true) {
                                    if (nomRueCorr.search(" - ") != "-1") { nomRueCorr = nomRueCorr.substring(0, nomRueCorr.search(" - ")); }
                                }

                                // Appel à Ban_Borders_DrawBorder avec le format attendu après avoir testé si le n° existe déjà sur WME
                                var state, Ville = nomCommuneBAN;
                                ((HNdone.indexOf(nomRueCorr + " " + nomCommuneCorr) == "-1") ? state = 'no' : state = 'yes')

                                if (getId('optionDBF0').checked == true && state == 'yes') { continue; } // On bloque l'affichage des n° renseignés sur WME
                                if (getId('optionDBF1').checked == true && adresse.certification_commune == 0) { continue; } // On bloque l'affichage des n° non certifiés
                                if (getId('optionDBF2').checked == true && adresse.nom_ancienne_commune != null) { Ville = "\n" + adresse.nom_ancienne_commune + ' (' + nomCommuneBAN + ')'; } // On affiche l'ancien nom de commune
                                if (getId('optionDBF3').checked == true && adresse.date_ajout_modif != null) { Ville = Ville + '\n' + deltaDate(adresse.date_ajout_modif); } // On affiche l'age de l'info
                                if (getId('optionDBF5').checked == true && (getId('selectedRoad').innerHTML != "" || getId('DBFselectRoad').value != "")) {
                                    if (getId('selectedRoad').innerHTML != "") { var selectedRoad = getId('selectedRoad').innerHTML; } // Rue sélectionnée
                                    else if (getId('DBFselectRoad').value != "") { var selectedRoad = getId('DBFselectRoad').value; } // Sinon rue dans le menu déroulant
                                    var adres = adresse.nom_voie;
                                    adres = adres.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace("’", "'").toLowerCase();
                                    var selectRoad = selectedRoad.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace("’", "'").toLowerCase();
                                    if (selectRoad != adres) { continue; } // On bloque si ce n'est pas la rue sélectionnée
                                }
                                if (getId('optionDBF7').checked == false) {
                                    if (getId('optionDBF8').checked == true) { Ban_Borders_DrawBorder(NumeroRue, adresse.lon, adresse.lat, state, adresse.certification_commune); }
                                    else {
                                        if (getId('optionDBF6').checked == true) { Ban_Borders_DrawBorder(nomRueBan, adresse.lon, adresse.lat, state, adresse.certification_commune); }
                                        else { Ban_Borders_DrawBorder(nomRueBan + "\n" + Ville, adresse.lon, adresse.lat, state, adresse.certification_commune); }
                                    }
                                }
                            }

                            //Lieux-dits
                            if (debug) { console.log("Lieux-dits", adresses.lieux_dits); }
                            var b = adresses.lieux_dits;
                            for (var i = 0; i < b.length; i++) {
                                var lieux = b[i], lieudit2;
                                var lieudit = lieux.nom_lieu_dit;

                                Object.keys(correction).forEach((key) => {
                                    lieudit = lieudit.replaceAll(key, correction[key]);
                                });

                                lieudit2 = lieudit.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace("’", "'").toLowerCase();
                                if (getId('optionDBF6').checked == true) { var Ville = ""; } else { var Ville = "\n" + (lieux.nom_commune || ""); }


                                // Appel à Ban_Borders_DrawBorder avec le format attendu après avoir testé si le n° existe déjà sur WME
                                var state;
                                ((HNdone.indexOf(lieudit2) == "-1") ? state = 'no' : state = 'yes')

                                if (getId('optionDBF0').checked == true && state == 'yes') { continue; } // On bloque l'affichage des lieux-dits renseignés sur WME
                                if (getId('optionDBF8').checked == false) { Ban_Borders_DrawBorder(lieudit + Ville, lieux.lon, lieux.lat, "", ""); }
                            }
                            getId('loadBanData').style.backgroundColor = '#ffffff';
                        } else {
                            getId('loadBanData').style.backgroundColor = '#fac3c3';
                        }
                    },
                    onerror: function (error) { console.error("Erreur réseau :", error); }
                });
            } catch (ex) { console.error(`${SCRIPT_NAME}:`, ex); }
        }
    }

    function checklayer(layer) {
        var layers = W.map.getLayersBy("uniqueName", layer);
        if (layers.length === 0) {
            var DBF_style = new OpenLayers.Style({
                pointRadius: 2,
                fontWeight: "normal",
                label: "${labelText}",
                fontFamily: "Tahoma, Courier New",
                labelOutlineColor: "#FFFFFF",
                labelOutlineWidth: 2,
                fontColor: '#000000',
                fontSize: "10px"
            });
            if (layer == "__WME_Draw_Border_RS") {
                // style par défaut (sera écrasé par externalGraphic)
                var RS_style = new OpenLayers.Style({
                    pointRadius: 16,
                    fill: true, fillColor: "#ffffff", fillOpacity: 0.0,
                    stroke: false,
                    label: "${labelText}",
                    fontColor: "#000000",
                    fontSize: "12px",
                    labelOutlineColor: "#ffffff",
                    labelOutlineWidth: 3
                });
                RS_Layer = new OpenLayers.Layer.Vector("Panneaux (icônes)", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(RS_style)
                });
                RS_Layer.setVisibility(false);
                W.map.addLayer(RS_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Panneaux routiers (icônes)";
            }
            if (layer == "__WME_Draw_Border_Cty") {
                Cty_Layer = new OpenLayers.Layer.Vector("Limites Villes", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Cty_Layer.setVisibility(false);
                W.map.addLayer(Cty_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Villes";
            }
            if (layer == "__WME_Draw_Border_Dpt") {
                Dpt_Layer = new OpenLayers.Layer.Vector("Limites Departements", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Dpt_Layer.setVisibility(false);
                W.map.addLayer(Dpt_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Departements";
            }
            if (layer == "__WME_Draw_Border_PR") {
                PR_Layer = new OpenLayers.Layer.Vector("Points Routiers", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                PR_Layer.setVisibility(false);
                W.map.addLayer(PR_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "PR";
            }
            if (layer == "__WME_Draw_Border_Cam") {
                Cam_Layer = new OpenLayers.Layer.Vector("Radars", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Cam_Layer.setVisibility(false);
                W.map.addLayer(Cam_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Radars";
            }
            if (layer == "__WME_Draw_Border_Ban") {
                Ban_Layer = new OpenLayers.Layer.Vector("Infos BAN", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Ban_Layer.setVisibility(false);
                W.map.addLayer(Ban_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "BAN";
            }
            if (layer == "__WME_Draw_Border_Equip") {
                Equip_Layer = new OpenLayers.Layer.Vector("Equipements", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Equip_Layer.setVisibility(false);
                W.map.addLayer(Equip_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Equipements";
            }
            if (layer == "__WME_Draw_Border_Etabl") {
                Etabl_Layer = new OpenLayers.Layer.Vector("Etablissements", {
                    displayInLayerSwitcher: true,
                    uniqueName: layer,
                    styleMap: new OpenLayers.StyleMap(DBF_style)
                });
                Etabl_Layer.setVisibility(false);
                W.map.addLayer(Etabl_Layer);
                I18n.translations[I18n.locale].layers.name[layer] = "Etablissements";
            }
        }
    }
    function Cty_Borders_DrawBorder(Name, coordinateString) {
        var Cty_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Cty"; });
        if (!Cty_Layer) return;
        if (!coordinateString || !coordinateString.trim()) return;

        var parts = coordinateString.split('|');

        if (parts.length > 1) {
            for (var i = 0; i < parts.length; i++) {
                var coords = parts[i].trim();
                if (!coords) continue;

                var geom = Geometrize(Name, coords);
                if (geom) {
                    var poly = new OpenLayers.Feature.Vector(geom, null, new Cty_Borders_Style(Name));
                    Cty_Layer.addFeatures(poly);
                }
            }
        } else {
            var geom = Geometrize(Name, coordinateString.trim());
            if (geom) {
                var poly = new OpenLayers.Feature.Vector(geom, null, new Cty_Borders_Style(Name));
                Cty_Layer.addFeatures(poly);
            }
        }
    }

    function Dpt_Borders_DrawBorder(Name, coordinateString) {
        var Dpt_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Dpt"; });
        if (!Dpt_Layer) {
            return;
        }

        var parts = coordinateString.split('|');

        if (parts.length > 1) {

            for (var i = 0; i < parts.length; i++) {
                var coords = parts[i].trim();

                var geom = Geometrize(Name, coords);
                if (geom) {
                    var poly = new OpenLayers.Feature.Vector(geom, null, new Dpt_Borders_Style(Name));
                    Dpt_Layer.addFeatures(poly);
                }
            }

        } else {
            var geom = Geometrize(Name, coordinateString.trim());
            if (geom) {
                var poly = new OpenLayers.Feature.Vector(geom, null, new Dpt_Borders_Style(Name));
                Dpt_Layer.addFeatures(poly);
            }
        }
    }
    function PR_Borders_DrawBorder(Name, lon, lat) {
        var poly = new OpenLayers.Feature.Vector(Geometrize(Name, lon + ";" + lat), null, new PR_Borders_Style(Name));
        var PR_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_PR"; });
        PR_Layer.addFeatures(poly);
    }
    function Cam_Borders_DrawBorder(Name, lon, lat) {
        var poly = new OpenLayers.Feature.Vector(Geometrize(Name, lon + ";" + lat), null, new Cam_Borders_Style(Name));
        var Cam_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Cam"; });
        Cam_Layer.addFeatures(poly);
    }
    function Ban_Borders_DrawBorder(Name, lon, lat, status, verif) {
        const s = DBF_getStyles().ban;

        var labelColor;
        if (status === "yes") {
            // déjà présent sur WME
            labelColor = s.textExisting || "#0000ff";
        } else {
            // manquant
            labelColor = s.textMissing || "#ff0000";
        }

        var strokeColor;
        if (verif == "1") {
            strokeColor = s.verifiedStroke || "#00dd00";
        } else {
            strokeColor = s.unverifiedStroke || "#ff8000";
        }

        var strokeWidth = s.strokeWidth || 10;
        var fontSize = s.fontSize || 12;

        var poly = new OpenLayers.Feature.Vector(
            Geometrize(Name, lon + ";" + lat),
            null,
            new Ban_Borders_Style(Name, labelColor, strokeColor, strokeWidth, fontSize)
        );

        var Ban_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Ban"; });
        Ban_Layer.addFeatures(poly);

        // On garde la logique z-index (nouveaux en haut)
        if (status !== "yes") {
            setTimeout(function () {
                Ban_Layer.removeFeatures([poly]);
                Ban_Layer.addFeatures([poly]);
            }, 0);
        }
    }
    function Equip_Borders_DrawBorder(Name, lon, lat) {
        var poly = new OpenLayers.Feature.Vector(Geometrize(Name, lon + ";" + lat), null, new Equip_Borders_Style(Name));
        var Equip_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Equip"; });
        Equip_Layer.addFeatures(poly);
    }
    function Etabl_Borders_DrawBorder(Name, lon, lat) {
        var poly = new OpenLayers.Feature.Vector(Geometrize(Name, lon + ";" + lat), null, new Etabl_Borders_Style(Name));
        var Etabl_Layer = W.map.layers.find(function (l) { return l.uniqueName == "__WME_Draw_Border_Etabl"; });
        Etabl_Layer.addFeatures(poly);
    }
    function RS_DrawSignWithPanonceau(main, pano, lon, lat) {
        // panneau principal
        var mainIcon = RS_buildIcon(main.code, main.value);
        var pt = new OpenLayers.Geometry.Point(lon, lat)
        .transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject());

        var mainStyle = {
            externalGraphic: mainIcon.uri,
            graphicWidth: mainIcon.w,
            graphicHeight: mainIcon.h,
            graphicXOffset: -mainIcon.w / 2,
            graphicYOffset: -mainIcon.h / 2,
            graphicOpacity: 1.0
        };
        RS_Layer.addFeatures([new OpenLayers.Feature.Vector(pt.clone(), null, mainStyle)]);

        // panonceau (optionnel) : on le met juste sous le panneau
        if (pano && pano.code) {
            var mIcon = RS_buildPanonceau(pano.code, pano.value, mainIcon.w);
            var mStyle = {
                externalGraphic: mIcon.uri,
                graphicWidth: mIcon.w,
                graphicHeight: mIcon.h,
                graphicXOffset: -mIcon.w / 2,
                graphicYOffset: (-mainIcon.h / 2) + (mainIcon.h / 2) + 6, // sous le panneau
                graphicOpacity: 1.0
            };
            RS_Layer.addFeatures([new OpenLayers.Feature.Vector(pt.clone(), null, mStyle)]);
        }
    }

    function Cty_Borders_Style(Name) {
        const s = DBF_getStyles().city;

        this.fill = false;
        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";

        if (s.showLabel) {
            this.label = Name;
            this.fontSize = (s.fontSize || 12) + "px";
            this.fontColor = s.fontColor;
        } else {
            this.label = "";
        }
    }


    function Dpt_Borders_Style(Name) {
        const s = DBF_getStyles().dep;

        this.fill = false;
        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";

        this.label = Name.replace(/_/g, "'");
        this.fontSize = (s.fontSize || 24) + "px";
        this.fontColor = s.fontColor;
        this.fontWeight = "bold";
    }

    function PR_Borders_Style(Name) {
        const s = DBF_getStyles().pr;

        this.fill = false;
        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";
        this.label = "PR" + Name;
        this.labelYOffset = 10;
        this.fontSize = (s.fontSize || 12) + "px";
        this.fontColor = s.fontColor;
        this.labelOutlineColor = s.strokeColor;
        this.labelOutlineWidth = 3;
    }

    function Cam_Borders_Style(Name) {
        const s = DBF_getStyles().radar;

        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";
        this.label = Name;
        this.labelYOffset = 13;
        this.fontSize = (s.fontSize || 12) + "px";
        this.fontColor = s.fontColor;
        this.labelOutlineColor = s.strokeColor;
        this.labelOutlineWidth = 3;
    }

    function Ban_Borders_Style(Name, labelColor, strokeColor, strokeWidth, fontSize) {
        this.fill = false;
        this.stroke = true;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.strokeDashstyle = "solid";

        this.label = Name;
        this.labelYOffset = 22;
        this.fontSize = fontSize + "px";
        this.fontColor = labelColor;

        this.labelOutlineColor = "#ffffff";
        this.labelOutlineWidth = 4;
    }
    function Equip_Borders_Style(Name) {
        const s = DBF_getStyles().equip;

        this.fill = false;
        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";

        this.label = Name;
        this.labelYOffset = 10;
        this.fontSize = (s.fontSize || 12) + "px";
        this.fontColor = s.fontColor;
        this.labelOutlineColor = s.strokeColor;
        this.labelOutlineWidth = 3;
    }
    function Etabl_Borders_Style(Name) {
        const s = DBF_getStyles().etabl;

        this.fill = false;
        this.stroke = true;
        this.strokeColor = s.strokeColor;
        this.strokeWidth = s.strokeWidth;
        this.strokeDashstyle = "solid";

        this.label = Name;
        this.labelYOffset = 10;
        this.fontSize = (s.fontSize || 12) + "px";
        this.fontColor = s.fontColor;
        this.labelOutlineColor = s.strokeColor;
        this.labelOutlineWidth = 3;
    }

    function RS_getScale() {
        try {
            var s = DBF_getStyles().rs;
            return s.scale || 1.0;
        } catch (e) {
            return 1.0;
        }
    }

    function Geometrize(Name, coordinateString) {
        var tempVector = coordinateString.split(" ");
        var polyPoints = new Array(tempVector.length);
        for (var i = 0; i < tempVector.length; i++) {
            var coordinateVector = tempVector[i].split(";");
            polyPoints[i] = new OpenLayers.Geometry.Point(coordinateVector[0], coordinateVector[1]).transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject());
        }
        var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));
        return polygon;
    }
    function RS_buildIcon(code, value) {
        code = (code || "").toUpperCase();
        function uri(svg) { return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22"); }

        if (code === "B14" || code.startsWith("B14")) {

            var v = (value && value !== "NULL") ? String(value) : "";
            if (!v) {
                var m = code.match(/^B14[\s\-_]?(\d{1,3})$/i);
                if (m) v = m[1];
            }
            v = (v || "").replace(/[^\d]/g, "");

            var s = 32;
            var svg =
                '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 100 100">'
            + '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#d81e05" stroke-width="12"/>'
            + (v ? '<text x="50" y="63" font-family="Arial,Helvetica" font-size="44" font-weight="700" text-anchor="middle" fill="#000">' + v + '</text>' : '')
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

        if (code === "B33" || code.startsWith("B33")) {
            let v = (value && value !== "NULL") ? String(value) : "";
            if (!v) {
                const m = code.match(/^B33[\s\-_]?(\d{1,3})$/i);
                if (m) v = m[1];
            }
            v = (v || "").replace(/[^\d]/g, "");

            const s = 32;
            const bandAngle = -35;
            const bandWidth = 18;
            const halo = 8;

            const svg =
                  '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 100 100">'
            + '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#000" stroke-width="4"/>'
            + '<defs><clipPath id="b33clip"><circle cx="50" cy="50" r="42"/></clipPath></defs>'
            + '<g clip-path="url(#b33clip)">'
            + '<g transform="translate(50,50) rotate(' + bandAngle + ') translate(-50,-50)">'
            + '<line x1="-20" y1="50" x2="120" y2="50" stroke="#000" stroke-width="' + bandWidth + '" stroke-linecap="butt"/>'
            + '</g>'
            + '</g>'
            + (v ? '<text x="50" y="63" text-anchor="middle" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="none" stroke="#fff" stroke-width="' + halo + '" stroke-linejoin="round" paint-order="stroke"><tspan>' + v + '</tspan></text>' : '')
            + (v ? '<text x="50" y="63" text-anchor="middle" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="#000"><tspan>' + v + '</tspan></text>' : '')
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }


        if (code === "B31") {
            var s = 32;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="576" height="576" viewBox="-0.944 -0.944 576 576">'
            + '  <circle stroke="#000000" stroke-width="0.1764" stroke-linecap="round" stroke-linejoin="round" cx="287.056" cy="287.056" r="286.968"/>'
            + '  <path fill="#FFFFFF" stroke="#000000" stroke-width="0.1764" stroke-linecap="round" stroke-linejoin="round"'
            + '        d="M125.736,378.429 l218.521-218.53 l98.938-97.348 C334.725,-12.889,187.828,0.014,94.169,93.208 C0.51,186.403,-13.123,333.233,61.777,442.078 L125.736,378.429z"/>'
            + '  <path fill="#FFFFFF" stroke="#000000" stroke-width="0.1764" stroke-linecap="round" stroke-linejoin="round"'
            + '        d="M511.886,131.385 l-71.274,71.385 L228.789,414.754 l-97.521,97.053 c108.646,75.308,255.606,62.118,349.105,-31.333 C573.873,387.023,587.139,240.069,511.886,131.385z"/>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

        if (code === "EB10") {
            var s = 60;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="177.07678" viewBox="0 0 500 177.07678">'
            + '  <path fill="#ffffff" stroke="#000000" stroke-width="0.85" d="M29.004,0.425c-15.681,0-28.579,12.898-28.579,28.579v119.069c0,15.681,12.898,28.579,28.579,28.579h441.992c15.681,0,28.579-12.898,28.579-28.579V29.004c0-15.681-12.898-28.579-28.579-28.579H29.004z"/>'
            + '  <path fill="#ff0000" d="M29.004,9.212h441.992c10.965,0,19.792,8.827,19.792,19.792v119.069c0,10.965-8.827,19.792-19.792,19.792H29.004c-10.965,0-19.792-8.827-19.792-19.792V29.004c0-10.965,8.827-19.792,19.792-19.792z"/>'
            + '  <rect x="31" y="29.85" width="438" height="117.38" fill="#ffffff"/>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

        if (code === "EB20") {
            var s = 60;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="177.07678" viewBox="0 0 500 177.07678">'
            + '  <path fill="#ffffff" stroke="#000000" stroke-width="0.85" d="M29.004,0.425c-15.681,0-28.579,12.898-28.579,28.579v119.069c0,15.681,12.898,28.579,28.579,28.579h441.992c15.681,0,28.579-12.898,28.579-28.579V29.004c0-15.681-12.898-28.579-28.579-28.579H29.004z"/>'
            + '  <path fill="#000000" d="M29.004,9.213c-10.965,0-19.792,8.827-19.792,19.792v119.068c0,10.965,8.827,19.792,19.792,19.792h441.992c10.965,0,19.792-8.827,19.792-19.792V29.004c0-10.965-8.827-19.792-19.792-19.792H29.004z"/>'
            + '  <rect x="30.1" y="23.8" width="440" height="124" fill="#ffffff"/>'
            + '  <path fill="#ff0000" d="M410.97,23.8L24.39,149.62c0.93,2.24,3.14,3.81,5.71,3.81h58.48L475.66,27.45c-0.97-2.14-3.1-3.65-5.61-3.65H410.97z"/>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }
        if (code === "C107") {
            var s = 32;
            var svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="574.93799" height="574.93799" viewBox="0 0 574.93799 574.93799">
    <path d="m 41.496,574.438 h 491.947 c 10.872,0 21.3,-4.318 28.988,-12.007 7.688,-7.688 12.007,-18.115 12.007,-28.988 V 41.496 c 0,-10.873 -4.319,-21.3 -12.007,-28.988 C 554.742,4.819 544.314,0.5 533.442,0.5 H 41.496 C 30.623,0.5 20.196,4.819 12.508,12.507 4.819,20.195 0.5,30.623 0.5,41.496 v 491.947 c 0,10.873 4.319,21.3 12.007,28.988 7.688,7.688 18.116,12.007 28.989,12.007 z"
          style="fill:#ffffff;stroke:#000000;stroke-linecap:round;stroke-linejoin:round"/>
    <path d="m 544.919,529.72 c 0,6.744 -5.468,12.214 -12.214,12.214 H 42.659 c -6.746,0 -12.214,-5.47 -12.214,-12.214 V 41.173 c 0,-6.746 5.468,-12.214 12.214,-12.214 h 490.046 c 6.746,0 12.214,5.469 12.214,12.214 V 529.72 z"
          style="fill:#0000ff;stroke:#000000"/>
    <path d="m 438.34344,248.84928 -28.56671,-101.00762 -9.81224,-5.31619 -217.50475,-1.77206 -13.083,7.08825 -34.95775,101.00762 c -14.48636,2.2568 -19.97153,9.01419 -23.91899,16.54043 l 0,96.87161 27.80135,0 0,72.65461 49.06123,0 0,-72.65461 201.15102,0 0,74.42667 49.06122,0 0,-74.42667 22.89524,0 0,-95.69141 c -4.43579,-11.03152 -12.36985,-16.71902 -22.12662,-17.72063 z m -270.66095,0 24.59276,-81.51492 196.2449,3.54412 19.37264,77.9708 -240.2103,0 z"
          style="fill:#ffffff;stroke:#ffffff;stroke-width:6;stroke-linejoin:round;"/>
    <circle cx="164.735" cy="301.609" r="18.57" fill="#0000ff"/>
    <circle cx="366.497" cy="301.609" r="18.57" fill="#0000ff"/>
  </svg>
  `;

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }
        if (code === "C108") {
            var s = 32;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="574.938" height="574.938" viewBox="0 0 574.938 574.938">'
            + '  <path fill="#FFFFFF" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
            + '        d="M41.496,574.438h491.945c10.872,0,21.3-4.318,28.988-12.007c7.688-7.688,12.007-18.115,12.007-28.988V41.496'
            + '           c0-10.873-4.319-21.302-12.007-28.988C554.74,4.819,544.314,0.5,533.442,0.5H41.496c-10.873,0-21.302,4.317-28.988,12.007'
            + '           C4.819,20.195,0.5,30.623,0.5,41.496v491.945c0,10.873,4.317,21.3,12.007,28.988C20.195,570.117,30.623,574.438,41.496,574.438z"/>'
            + '  <path fill="#0000FF" d="M42.659,28.959c-6.746,0-12.216,5.468-12.216,12.214v456.786l477.582-469H42.659z"/>'
            + '  <path fill="#0000FF" stroke="#000000" d="M80.775,541.934h451.929c6.746,0,12.216-5.47,12.216-12.214V79.202L80.775,541.934z"/>'
            + '  <path fill="#FFFFFF" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"'
            + '        d="M438.343,248.849l-28.566-101.007l-9.813-5.316l-217.504-1.771l-13.083,7.089L134.419,248.85'
            + '           c-14.486,2.257-19.973,9.015-23.919,16.541v96.871h27.801v72.653h49.062v-72.653h201.15v74.427h49.062v-74.427h22.896V266.57'
            + '           C456.033,255.538,448.1,249.851,438.343,248.849L438.343,248.849z M167.683,248.849l24.593-81.515l196.244,3.544'
            + '           l19.373,77.971H167.683z"/>'
            + '  <circle fill="#0000FF" cx="165.063" cy="300.662" r="18.56"/>'
            + '  <circle fill="#0000FF" cx="410.595" cy="300.131" r="18.56"/>'
            + '  <rect x="180.636" y="427.969" fill="#0000FF" width="18" height="16.667"/>'
            + '  <path fill="#FF0000" d="M544.919,41.173c0-6.745-5.47-12.214-12.216-12.214h-24.678l-477.582,469v31.761'
            + '        c0,6.744,5.47,12.214,12.216,12.214h38.115L544.919,79.202V41.173z"/>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

        if (code === "C207") {
            var s = 32;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="575.1" height="575.1" viewBox="-0.322 -0.549 575.09998 575.09998">'
            + '  <rect x="0.728" y="0.501" width="573" height="573" rx="40.973" ry="40.973"'
            + '        fill="#ffffff" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
            + '  <rect x="28.177" y="27.95" width="518.102" height="518.102" rx="13.524" ry="13.524" fill="#0056a4"/>'
            + '  <g transform="matrix(1.1017437,0,0,1.1017437,-1225.6245,-409.94628)" fill="#ffffff">'
            + '    <path d="m1512.8729,845.14553-38.8177-234.10417h-74.1146l4.6875,234.10417z" />'
            + '    <path d="m1461.3208,532.80699-18.4479-112.78124h-46.4844l2.1927,112.78124z" />'
            + '    <path d="m1233.1854,845.14553 38.7812-234.10417h74.151l-4.7239,234.10417z" />'
            + '    <path d="m1284.7374,532.80699 18.4063-112.78124h46.526l-2.2291,112.78124z" />'
            + '    <path d="m1373.102,590.97366h114.6719c8.6563,0.11453,19.2031,5.55729,20.6771,14.58854l5.1406,44.90104h32.125V605.7497'
            + '             c-0.3021-8.92187,3.3229-14.77604,18.5937-14.85416l24.2292,0.0781v-29.63022h-430.7916v29.63021l24.1875-0.0781'
            + '             c15.2708,0.0781,18.8958,5.9323,18.6354,14.85416v44.71355h32.125l5.1041-44.90104'
            + '             c1.5105-9.03125,12.0157-14.47396,20.6719-14.58855z" />'
            + '  </g>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

        if (code === "C208") {
            var s = 32;
            var svg = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" width="575.1" height="575.1" viewBox="-0.322 -0.549 575.09998 575.09998">'
            + '  <rect x="0.728" y="0.501" width="573" height="573" rx="40.973" ry="40.973"'
            + '        fill="#ffffff" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
            + '  <rect x="28.177" y="27.95" width="518.102" height="518.102" rx="13.524" ry="13.524" fill="#0056a4"/>'
            + '  <g transform="matrix(1.1017437,0,0,1.1017437,-1225.6245,-409.94628)" fill="#ffffff">'
            + '    <path d="m1512.8729,845.14553-38.8177-234.10417h-74.1146l4.6875,234.10417z" />'
            + '    <path d="m1461.3208,532.80699-18.4479-112.78124h-46.4844l2.1927,112.78124z" />'
            + '    <path d="m1233.1854,845.14553 38.7812-234.10417h74.151l-4.7239,234.10417z" />'
            + '    <path d="m1284.7374,532.80699 18.4063-112.78124h46.526l-2.2291,112.78124z" />'
            + '    <path d="m1373.102,590.97366h114.6719c8.6563,0.11453,19.2031,5.55729,20.6771,14.58854l5.1406,44.90104h32.125V605.7497'
            + '             c-0.3021-8.92187,3.3229-14.77604,18.5937-14.85416l24.2292,0.0781v-29.63022h-430.7916v29.63021l24.1875-0.0781'
            + '             c15.2708,0.0781,18.8958,5.9323,18.6354,14.85416v44.71355h32.125l5.1041-44.90104'
            + '             c1.5105-9.03125,12.0157-14.47396,20.6719-14.58855z" />'
            + '  </g>'
            + '  <path fill="#d40000" d="M -374.64375 -335.11506 L -374.64375 334.79404 L -396.47843 356.62872 C -401.77646 361.92675 -410.30681 361.92813 -415.60484 356.6301 L -437.43814 334.7968 L -437.43814 -335.11782 L -415.60484 -356.95113 C -410.30681 -362.24916 -401.77646 -362.24778 -396.47843 -356.94975 L -374.64375 -335.11506 z "'
            + '        transform="matrix(-0.70710678,-0.70710678,-0.70710678,0.70710678,0,0)"/>'
            + '</svg>';

            var scale = RS_getScale();
            return { uri: uri(svg), w: s * scale, h: s * scale };
        }

    }
    function RS_buildPanonceau(code, value, refWidth) {
        code = (code || "").toUpperCase().trim();
        value = (value || "").trim();

        function uri(svg) {
            return "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
        }

        function fmtDistance(v) {
            if (!v) return "";
            const s = String(v).replace(",", ".").replace(/\s+/g, "");
            const m = s.match(/^([\d.]+)\s*(km|m)?$/i);
            if (!m) return v;
            let num = parseFloat(m[1]);
            const unit = (m[2] || "m").toLowerCase();
            if (unit === "km") return (num + "").replace(".", ",") + " km";
            if (num >= 1000) return (Math.round(num) / 1000 + "").replace(".", ",") + " km";
            return Math.round(num) + " m";
        }

        const baseW = Math.max(84, Math.min(refWidth || 120, 140));
        const baseH = 26;
        let w = baseW, h = baseH, txt = "";

        if (code === "M9Z") txt = "RAPPEL";
        else if (code === "M1") {
            txt = fmtDistance(value || "");
            h = 32;
            const fs = 18;
            const pad = 14;
            const ff = "Arial Narrow, Arial, Helvetica, sans-serif";
            const emW = fs * 0.62;
            w = Math.max(84, Math.round(pad * 2 + emW * (txt.length || 4)));

            const r = 6;
            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="3"/>` +
                  `<text x="${w / 2}" y="${h / 2 + fs * 0.38}" font-family="${ff}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="#000">${txt}</text>` +
                  `</svg>`;
            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }
        if (code === "M9Z") txt = "RAPPEL";

        else if (code === "M1") {
            txt = fmtDistance(value || "");
            h = 32;
            const fs = 18, pad = 14, ff = "Arial Narrow, Arial, Helvetica, sans-serif";
            const emW = fs * 0.62;
            w = Math.max(84, Math.round(pad * 2 + emW * (txt.length || 4)));
            const r = 6;
            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="3"/>` +
                  `<text x="${w / 2}" y="${h / 2 + fs * 0.38}" font-family="${ff}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="#000">${txt}</text>` +
                  `</svg>`;
            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M3A") {
            const dir = String(value || "droite").trim().toLowerCase();
            const isLeft = ["gauche", "2", "left", "l"].includes(dir);

            const w = 32, h = 32;
            const r = 6, stroke = 3;

            const officialPathD =
                  "m -38.631499,-5.8489465 12.908216,0.125613 -0.125661,-12.9081605 -3.139567,-3.139567 0.03919,9.625895 -14.84153,-14.84153 -3.195849,3.195848 14.841531,14.8415213 -9.625897,-0.03918 z";

            const margin = 4;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const vbW = 27.289993, vbH = 27.289966;

            const s = Math.min(innerW / vbW, innerH / vbH);

            const preTranslateX = 50;
            const preTranslateY = 30;

            const arrowGroupRight =
                  `<g transform="translate(${margin},${margin}) scale(${s}) translate(${preTranslateX},${preTranslateY})">` +
                  `<path d="${officialPathD}" fill="#000" stroke="none"/>` +
                  `</g>`;

            const arrowGroup = isLeft
            ? `<g transform="translate(${w},0) scale(-1,1)">${arrowGroupRight}</g>`
            : arrowGroupRight;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="${stroke}"/>` +
                  arrowGroup +
                  `</svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M2") {
            const txt = fmtDistance(value || "");
            const h = 32, fs = 18, ff = "Arial Narrow, Arial, Helvetica, sans-serif";
            const pad = 14, emW = fs * 0.62, arrowSpace = 26;
            let w = Math.max(100, Math.round(pad * 2 + Math.max(4, txt.length) * emW + arrowSpace * 2));
            const r = 6, leftX = 18, rightX = w - 18, shaftTop = 9, shaftBot = h - 6, headW = 7, headY = shaftTop;
            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="3"/>` +
                  `<line x1="${leftX}" y1="${shaftBot}" x2="${leftX}" y2="${shaftTop}" stroke="#000" stroke-width="3" stroke-linecap="round"/>` +
                  `<path d="M ${leftX - headW},${shaftTop + 8} L ${leftX},${headY} L ${leftX + headW},${shaftTop + 8} Z" fill="#000"/>` +
                  `<line x1="${rightX}" y1="${shaftBot}" x2="${rightX}" y2="${shaftTop}" stroke="#000" stroke-width="3" stroke-linecap="round"/>` +
                  `<path d="M ${rightX - headW},${shaftTop + 8} L ${rightX},${headY} L ${rightX + headW},${shaftTop + 8} Z" fill="#000"/>` +
                  `<text x="${w / 2}" y="${h / 2 + fs * 0.38}" font-family="${ff}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="#000">${txt}</text>` +
                  `</svg>`;
            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M3D") {
            const w = 32;
            const h = 32;
            const r = 6;
            const stroke = 3;

            const centerX = w / 2;
            const shaftTop = 6;
            const shaftBot = h - 10;
            const headLen = 7;
            const headHalf = 6;
            const yHead = h - 6;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="${stroke}"/>` +

                  `<line x1="${centerX}" y1="${shaftTop}" x2="${centerX}" y2="${shaftBot}" stroke="#000" stroke-width="${stroke}" stroke-linecap="round"/>` +

                  `<polygon points="
        ${centerX - headHalf},${yHead - headLen}
        ${centerX},${yHead}
        ${centerX + headHalf},${yHead - headLen}
      " fill="#000"/>` +
                  `</svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M4A") {
            const w = 56, h = 32;
            const r = 6, stroke = 3;

            const srcW = 739, srcH = 300;
            const layerShiftY = -752.36218;

            const margin = 4;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const s = Math.min(innerW / srcW, innerH / srcH);

            const carBody = `M 117.77367,953.22223
    c -5.15811,-0.32025 -10.06219,-1.08759 -10.58836,-9.56006
    v -29.85149
    c 0.53272,-8.53723 6.95609,-13.44232 14.0008,-13.97577
    l 122.69341,-11.06439 80.17858,-80.17858 h 200.07085
    l 76.34743,76.34744 h 20.70822
    c 7.09313,0.25401 9.58524,2.5844 10.57946,10.57947
    v 57.75511 H 117.77367 Z`;

            const window1 = `M 412.68588,884.31495 H 289.74518
    c -6.72863,-0.28913 -8.14501,-4.1394 -5.65759,-8.45926
    l 49.06428,-49.06428 h 79.53401 z`;

            const window2 = `M 428.55051,884.31495 H 536.46337
    c 5.90615,-0.28913 7.1494,-10.08864 4.96602,-14.4085
    l -43.06683,-43.11504 h -69.81205 z`;

            const wheelsGroup =
                  `<g transform="matrix(1.2606884,0,0,1.2606884,-9.4267,524.78681)">
       <path d="m 186.54661,371.66315
                c 0,16.41058 -13.3034,29.71398 -29.71398,29.71398
                  -16.41058,0 -29.71399,-13.3034 -29.71399,-29.71398
                0,-16.41058 13.30341,-29.71399 29.71399,-29.71399
                16.41058,0 29.71398,13.30341 29.71398,29.71399 z"
             transform="matrix(1.1818181,0,0,1.1818181,-24.860346,-98.719168)"
             fill="#000" stroke="#ffffff" stroke-width="2.53846169"/>
       <path d="m 186.54661,371.66315
                c 0,16.41058 -13.3034,29.71398 -29.71398,29.71398
                  -16.41058,0 -29.71399,-13.3034 -29.71399,-29.71398
                0,-16.41058 13.30341,-29.71399 29.71399,-29.71399
                16.41058,0 29.71398,13.30341 29.71398,29.71399 z"
             transform="matrix(1.1818181,0,0,1.1818181,261.38805,-97.289084)"
             fill="#000" stroke="#ffffff" stroke-width="2.53846169"/>
     </g>`;

            const pictogram =
                  `<g transform="translate(${margin},${margin})
                   scale(${s})
                   translate(0,${layerShiftY})">
       <path d="${carBody}" fill="#000" stroke="#000" stroke-width="1.26068842"/>
       <path d="${window1}" fill="#ffffff" stroke="none"/>
       <path d="${window2}" fill="#ffffff" stroke="none"/>
       ${wheelsGroup}
     </g>`;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg"
         width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
       <rect x="1.5" y="1.5" rx="${r}" ry="${r}"
             width="${w - 3}" height="${h - 3}"
             fill="#fff" stroke="#000" stroke-width="${stroke}"/>
       ${pictogram}
     </svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4B") {
            const w = 56, h = 32;
            const r = 6, stroke = 3;

            const srcW = 739, srcH = 300;
            const layerShiftY = -752.36218;
            const margin = 4;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const s = Math.min(innerW / srcW, innerH / srcH);

            const busBody = `
    m 65.006101,994.17227
      c -13.360978,-1.705 -27.614236,-6.09796 -26.665427,-26.64158
      l 0,-52.43286
      c 2.117675,-15.55105 12.575772,-17.836 19.573551,-20.40632
      l 18.004892,-67.13505
      c 0.503673,-1.75637 -1.051869,-2.91108 -4.993629,-2.8805
      l -5.919387,0 0,-39.10151
      609.356929,0
      c 16.27003,1.27046 15.11737,11.16552 15.29477,15.2811
      l 0,193.31672 z`;

            const frontWhite = `
    m 86.58393,823.54872
      33.267,0
      c 3.86906,-0.18291 5.41985,1.55363 5.2863,5.384
      l 0,58.58648
      c -0.0773,4.91784 -3.24827,6.66062 -6.74699,6.87169
      l -45.49008,0
      c -4.581395,-0.10657 -6.502362,-0.60194 -6.051431,-6.16327
      6.701842,-21.63965 17.089221,-63.46302 19.735201,-64.6789 z`;

            const winRects = [
                { x: 137.76866, y: 823.8363, w: 124.95871, h: 70.855232, ry: 6.1679206 },
                { x: 275.42181, y: 823.8363, w: 124.95871, h: 70.855232, ry: 6.1679206 },
                { x: 411.58569, y: 823.8363, w: 124.95871, h: 70.855232, ry: 6.1679206 },
                { x: 548.0332, y: 823.8363, w: 124.95871, h: 70.855232, ry: 6.1679206 },
            ];

            const wheelsGroup = `
    <g transform="matrix(1.2623691,0,0,1.2612398,-13.855469,526.51775)">
      <path
        d="m 186.54661,371.66315
           c 0,16.41058 -13.3034,29.71398 -29.71398,29.71398
             -16.41058,0 -29.71399,-13.3034 -29.71399,-29.71398
           0,-16.41058 13.30341,-29.71399 29.71399,-29.71399
           16.41058,0 29.71398,13.30341 29.71398,29.71399 z"
        transform="matrix(1.4211617,0,0,1.4211617,-58.328645,-166.65405)"
        fill="#000" stroke="#ffffff" stroke-width="2.53846169"/>
      <path
        d="m 186.54661,371.66315
           c 0,16.41058 -13.3034,29.71398 -29.71398,29.71398
             -16.41058,0 -29.71399,-13.3034 -29.71399,-29.71398
           0,-16.41058 13.30341,-29.71399 29.71399,-29.71399
           16.41058,0 29.71398,13.30341 29.71398,29.71399 z"
        transform="matrix(1.4211617,0,0,1.4211617,204.52558,-168.45783)"
        fill="#000" stroke="#ffffff" stroke-width="2.53846169"/>
    </g>`;

            let windowsSvg = winRects.map(r =>
                                          `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" ry="${r.ry}" fill="#ffffff" stroke="none"/>`
                                         ).join("");

            const pictogram =
                  `<g transform="translate(${margin},${margin}) scale(${s}) translate(0,${layerShiftY})">
       <path d="${busBody}" fill="#000" stroke="none"/>
       ${windowsSvg}
       <path d="${frontWhite}" fill="#ffffff" stroke="none"/>
       ${wheelsGroup}
     </g>`;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
       <rect x="1.5" y="1.5" rx="${r}" ry="${r}"
             width="${w - 3}" height="${h - 3}"
             fill="#fff" stroke="#000" stroke-width="${stroke}"/>
       ${pictogram}
     </svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M4C") {
            const w = 56, h = 32;
            const r = 6, stroke = 3;

            const srcW = 430, srcH = 175;
            const layerShiftY = -877.36219;

            const margin = 4;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const s = Math.min(innerW / srcW, innerH / srcH);

            const motoGroup = `
    <g transform="matrix(0.70621469,0,0,0.70621469,276.36309,364.04201)">
      <path d="m -205.64013,832.76137 c -29.961,0 -54.25,23.617 -54.25,52.75 0,29.133 24.289,52.75 54.25,52.75 29.961,0 54.25,-23.617 54.25,-52.75 0,-29.133 -24.289,-52.75 -54.25,-52.75 z m 0,89 c -20.297,0 -36.75,-16.175 -36.75,-36.13 0,-19.954 16.453,-36.13 36.75,-36.13 20.297,0 36.75,16.176 36.75,36.13 0,19.955 -16.453,36.13 -36.75,36.13 z"
            fill="#000"/>
      <path d="m 24.35987,833.76137 c -29.961,0 -54.25,23.617 -54.25,52.75 0,29.133 24.289,52.75 54.25,52.75 29.961,0 54.25,-23.617 54.25,-52.75 0,-29.133 -24.289,-52.75 -54.25,-52.75 z m 0,89 c -20.297,0 -36.75,-16.175 -36.75,-36.13 0,-19.954 16.453,-36.13 36.75,-36.13 20.297,0 36.75,16.176 36.75,36.13 0,19.955 -16.453,36.13 -36.75,36.13 z"
            fill="#000"/>
      <!-- (les deux ellipses ci-dessous ont un stroke rouge dans le fichier ; on les supprime ou on met noir pour cohérence) -->
      <!-- Elles ne sont pas indispensables au pictogramme ; on peut les omettre. -->

      <polygon transform="translate(-374.35913,563.79237)"
               points="217.469,234.969 167.469,311.969 177.969,318.469 234.969,242.469"
               fill="#000"/>
      <path d="m -108.70513,893.75737 c 3.17,1.29 19.07,0.916 22.788,-0.996 l 60.027,0 59.5,-91 -129.5,0 0,43.116 c -0.823,-0.074 -1.656,-0.116 -2.5,-0.116 -14.636,0 -26.5,11.417 -26.5,25.5 0,10.562 6.674,19.625 16.185,23.496"
            fill="#000"/>
      <rect x="-17.390137" y="880.76135" width="104" height="13.5" fill="#000"/>
      <polygon transform="translate(-374.35913,563.79237)"
               points="389.969,274.969 375.969,281.969 389.469,310.469 401.469,307.469"
               fill="#000"/>
      <polygon transform="translate(-374.35913,563.79237)"
               points="192.469,225.969 194.469,219.469 198.469,215.969 209.969,216.469 217.969,220.469 224.469,225.969 227.969,221.469 232.969,209.469 236.969,204.469 240.969,202.969 246.969,201.469 253.469,200.469 264.469,198.469 267.969,200.969 269.469,204.969 242.969,211.969 238.469,219.469 249.969,224.469 276.969,226.469 286.469,227.469 294.969,230.469 303.969,235.969 309.969,244.969 265.469,290.969 255.969,287.469 255.469,279.969 249.469,278.969 241.969,278.469 234.469,275.469 228.969,270.469 221.969,258.469 217.469,251.969 212.469,249.469 198.469,249.969 193.969,244.469 191.969,237.969 191.969,231.469"
               fill="#000"/>
      <polygon transform="translate(-374.35913,563.79237)"
               points="407.219,237.969 412.719,262.969 423.219,266.469 430.219,270.469 436.719,274.969 443.719,281.969 448.219,287.969 452.719,298.469 453.719,303.969 439.219,305.969 402.719,277.969 378.719,279.469 367.219,248.469 399.219,239.469"
               fill="#000"/>
      <rect x="-101.89014" y="836.26135" width="19.5" height="15" fill="#000"/>
      <rect x="-105.64014" y="881.26135" width="95" height="12.75" fill="#000"/>
    </g>`;

            const pictogram =
                  `<g transform="translate(${margin},${margin}) scale(${s}) translate(0,${layerShiftY})">
       ${motoGroup}
     </g>`;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
       <rect x="1.5" y="1.5" rx="${r}" ry="${r}"
             width="${w - 3}" height="${h - 3}"
             fill="#fff" stroke="#000" stroke-width="${stroke}"/>
       ${pictogram}
     </svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4F") {
            const raw = String(value || "").trim();

            function fmtTonnage(s) {
                if (!s) return "> 3,5 t";
                const m = s.replace(/\s+/g, "")
                .match(/^([<>]=?|≤|≥)?\s*([\d.,]+)\s*(t|tonnes?)?$/i);
                if (!m) {
                    const withT = /t\b/i.test(s) ? s : (s + " t");
                    return withT.replace(/\./g, ",").replace(/\s*t\b/i, " t");
                }
                let op = m[1] || "";
                let num = m[2] || "";
                if (op === "<=") op = "≤";
                if (op === ">=") op = "≥";
                num = num.replace(",", ".");
                const n = isNaN(parseFloat(num)) ? num : String(parseFloat(num));
                const withComma = n.replace(".", ",");
                return (op ? op + " " : "") + withComma + " t";
            }

            const txt = fmtTonnage(raw);

            const h = 32;
            const fs = 18;
            const ff = "Arial Narrow, Arial, Helvetica, sans-serif";
            const pad = 14;
            const emW = fs * 0.62;
            let w = Math.max(84, Math.round(pad * 2 + emW * Math.max(4, txt.length)));
            const r = 6;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                  `<rect x="1.5" y="1.5" rx="${r}" ry="${r}" width="${w - 3}" height="${h - 3}" fill="#fff" stroke="#000" stroke-width="3"/>` +
                  `<text x="${w / 2}" y="${h / 2 + fs * 0.38}" font-family="${ff}" font-size="${fs}" font-weight="700" text-anchor="middle" fill="#000">${txt}</text>` +
                  `</svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }

        else if (code === "M4G") {
            const w = 56, h = 32;
            const r = 6, stroke = 3;


            const srcW = 430.79999, srcH = 300;
            const layerShiftY = -752.36218;

            const margin = 3;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const s = Math.min(innerW / srcW, innerH / srcH);

            const truckGroup = `
    <g transform="matrix(1.2622928,0,0,1.2622928,291.45569,962.24437)">
      <path
        id="path3854"
        d="m 73.980186,7.1260033 -269.173716,0 0,-13.92117 4.89407,0 0,-34.2130303 c -1.01195,-5.5112 8.30559,-8.29403 9.34322,-6.84261 l 3.91487,-37.595009 c 0.15177,-4.079433 1.30083,-7.765569 8.78241,-8.074555 l 32.23916,0 0,-27.003639 c -0.31061,-7.22221 4.15984,-8.92065 8.58958,-8.58958 l 194.205856,0 c 7.20455,0 7.37569,5.73912 7.20455,7.20455 z"
        style="fill:#000000;stroke:none"/>
      <path
        id="path3862"
        d="m -133.35497,-46.395227 0,-36.246535 c -0.15336,-1.375633 0.31576,-2.952489 -2.75822,-2.764563 l -27.73547,0 c -1.80037,-0.117556 -5.33706,1.004371 -5.2866,5.29875 l -2.98807,33.712348 z"
        style="fill:#ffffff;stroke:none"/>
      <g transform="translate(-232.92973,-137.90311)" id="g3850">
        <path
          d="m 235.36017,128.13559 c 0,15.72607 -12.74851,28.47458 -28.47458,28.47458 -15.72608,0 -28.47458,-12.74851 -28.47458,-28.47458 0,-15.72608 12.7485,-28.474577 28.47458,-28.474577 15.72607,0 28.47458,12.748497 28.47458,28.474577 z"
          transform="matrix(1.0966518,0,0,1.0966518,-135.87723,4.4701928)"
          style="fill:#000000;stroke:#ffffff;stroke-width:3"/>
        <path
          d="m 235.36017,128.13559 c 0,15.72607 -12.74851,28.47458 -28.47458,28.47458 -15.72608,0 -28.47458,-12.74851 -28.47458,-28.47458 0,-15.72608 12.7485,-28.474577 28.47458,-28.474577 15.72607,0 28.47458,12.748497 28.47458,28.474577 z"
          transform="matrix(1.0966518,0,0,1.0966518,23.227608,4.4701928)"
          style="fill:#000000;stroke:#ffffff;stroke-width:3"/>
      </g>
    </g>`;

            const pictogram =
                  `<g transform="translate(${margin},${margin}) scale(${s}) translate(0,${layerShiftY})">
       ${truckGroup}
     </g>`;

            const svg =
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
       <rect x="1.5" y="1.5" rx="${r}" ry="${r}"
             width="${w - 3}" height="${h - 3}"
             fill="#fff" stroke="#000" stroke-width="${stroke}"/>
       ${pictogram}
     </svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4K") {
            const w = 64, h = 24;
            const r = 6, stroke = 3;

            const srcW = 300, srcH = 304.54999;
            const layerShiftY = -747.81217;

            const margin = 4;
            const innerW = w - margin * 2;
            const innerH = h - margin * 2;

            const s = Math.min(innerW / srcW, innerH / srcH);

            const pictogram = `
    <g transform="translate(${margin},${margin}) scale(${s}) translate(0,${layerShiftY})">
      <g transform="matrix(0.54883723,0,0,0.54883723,-507.16318,1051.4543)">
        <g transform="translate(449.10268,-577.25898)">
          <path style="fill:#000000;stroke:none"
            d="m 606.35593,366.10169 47.80225,12.80882 -24.54791,23.3145 77.60084,-19.04195 15.54478,43.92573 17.23397,-25.76397 12.4964,30.9989 10.95914,-33.50898 19.31855,27.65167 6.05407,-42.68482 80.04472,22.07894 -36.89062,-26.55914 64.21432,-13.2197 0,90.88984 c 0.77768,11.64719 -7.77725,18.79831 -16.84322,21.61016 l 0,49.25848 c -0.0479,9.74322 -2.28104,10.63087 -6.05484,10.48729 l -22.22906,0 c -2.75466,-0.0245 -8.24106,-0.0433 -8.26271,-8.26271 l 0,-51.48306 -180.82627,0 0,50.21187 c 0.0938,7.11842 -2.54828,9.24216 -5.5044,9.5339 l -25.79857,0 c -3.09648,-0.21747 -4.00256,0.82064 -5.56144,-5.56144 l 0,-54.18433 c -11.15662,-0.56558 -17.9871,-10.1699 -18.75,-18.75 z" />
          <g transform="translate(451.66094,0.00652086)">
            <circle fill="#ffffff" r="19.9" cx="191.9" cy="431.7"/>
            <circle fill="#ffffff" r="19.9" cx="402.8" cy="431.7"/>
          </g>
        </g>
        <path fill="#ff0000" stroke="none"
          d="m 1175.927,-406.93856 26.2976,-105.66737 27.9661,109.87817 19.3856,-24.70868 2.2245,30.19068 53.7077,-60.69916 -23.517,60.06356 63.8771,-19.06779 -43.5381,47.66949 30.5085,-1.27119 -49.5763,40.04238 79.1314,-7.62712 -68.1674,52.91313 67.5318,-20.49788 -77.5424,62.92373 84.5339,17.16102 -107.733,24.47033 17.7966,11.75848 -47.6695,-14.30085 -5.0848,32.41526 -15.2542,-21.61017 -9.8517,22.88135 -12.3941,-20.97457 -14.6186,22.24576 -13.9831,-35.27543 -51.8008,12.71187 13.3474,-8.58051 -97.5635,-28.2839 76.7592,-9.70409 -57.3736,-24.61794 50.2118,-6.99153 -33.3686,-28.91949 39.7246,6.99153 -61.3348,-62.28814 74.2361,22.04033 -66.609,-100.21829 85.1695,38.13559 -18.1144,-28.6017 36.2288,19.70339 -5.0847,-58.15678 z"/>
      </g>
    </g>`;

            const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect x="1.5" y="1.5" rx="${r}" ry="${r}"
            width="${w - 3}" height="${h - 3}"
            fill="#fff" stroke="#000" stroke-width="${stroke}"/>
      ${pictogram}
    </svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4L") {
            const w = 64, h = 24;
            const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="304.55" viewBox="0 0 300 304.55">
  <g transform="translate(0,-747.81217)">
    <g transform="matrix(0.50372367,0,0,0.50372367,-427.73823,976.95041)">
      <rect ry="65.451103" y="-452.08929" x="851.85663" height="599.09375" width="590.15643"
            style="fill:#ffffff;stroke:#000000;stroke-width:5.40820599;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"/>
      <g transform="translate(847.16351,-429.66106)">
        <g>
          <path d="m 78.425932,402.36217 c 5.965599,-0.45215 18.557406,-3.56983 29.315738,-2.18131 32.54649,4.20062 62.42662,15.14849 88.02104,15.23024 33.82733,2.06358 63.57905,-17.52909 95.00108,-16.13215 46.10819,-0.0985 50.15768,17.07323 102.68963,16.73849 21.94807,0.943 54.65605,-9.06431 82.43011,-15.06238 13.1364,-2.83693 23.22253,-1.42985 37.29645,0.11064 3.68767,0.40364 10.91423,0.34143 10.91423,0.34143"
                style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"/>
          <path d="m 77.801453,449.16774 c 5.965599,-0.45215 18.557406,-3.56983 29.315737,-2.18131 32.54649,4.20062 62.42662,15.14849 88.02104,15.23024 33.82733,2.06358 63.57905,-17.52909 95.00108,-16.13215 46.10819,-0.0985 50.15768,17.07323 102.68963,16.73849 21.94807,0.943 54.65605,-9.06431 82.43011,-15.06238 13.1364,-2.83693 23.22253,-1.42985 37.29645,0.11064 3.68767,0.40364 10.91423,0.34143 10.91423,0.34143"
                style="fill:none;stroke:#000000;stroke-width:15;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"/>
          <path d="m 142.69068,348.30508 315.73093,0"
                style="fill:none;stroke:#000000;stroke-width:7;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"/>
          <path d="m 154.13136,338.76749 c 0.19183,3.67259 1.52419,6.3136 3.58825,6.21504 l 20.59265,0 c 1.59917,0.16968 4.19409,-1.37571 5.05638,-5.05639 l 0,-24.03631 97.41418,0 c 12.92078,22.43128 32.34204,12.43435 38.87589,0 l 96.01926,0 0,23.55181 c 0.28625,2.73868 2.83775,5.87619 5.7537,5.7537 l 18.1131,0 c 2.05269,0.15662 6.32225,-1.37103 6.95947,-6.95947 l 0,-66.88322 c 0.13288,-1.95421 -1.38941,-5.05082 -5.28083,-5.28083 l -20.77951,0 c -1.8143,-0.0933 -4.9887,1.55761 -4.76593,4.76593 l 0,21.85293 -48.04237,0 0,-15.57204 -135.72854,0 0,15.57204 -48.53842,0 0,-21.22567 -5.39319,-5.39319 -17.52813,0 -6.31596,6.31596 z"
                style="fill:#000000;stroke:none"/>
        </g>
        <!-- ellipse rouge officielle (chemin elliptique transformé) -->
        <path d="m 446.50426,249.494 c 0,23.85687 -65.4499,43.19668 -146.18645,43.19668 -80.73655,0 -146.18645,-19.33981 -146.18645,-43.19668 0,-23.85686 65.4499,-43.19667 146.18645,-43.19667 80.73655,0 146.18645,19.33981 146.18645,43.19667 z"
              style="fill:#ff0000;stroke:none"
              transform="matrix(0.99999995,0,0,1.9676022,4.6167523e-6,-283.20814)"/>
      </g>
    </g>
  </g>
</svg>`.trim();

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4M") {
            const w = 64, h = 24;
            const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="430" height="366" id="svg3864" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="France_road_sign_M4m.svg">
    <defs id="defs3866"/>
    <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.6871719" inkscape:cx="-7.8266119" inkscape:cy="57.852457" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="false" inkscape:snap-bbox="true" inkscape:bbox-paths="true" inkscape:bbox-nodes="true" inkscape:snap-bbox-edge-midpoints="true" inkscape:snap-bbox-midpoints="true" inkscape:object-paths="true" inkscape:snap-intersection-paths="true" inkscape:object-nodes="true" inkscape:snap-smooth-nodes="true" inkscape:snap-midpoints="true" inkscape:snap-object-midpoints="true" inkscape:snap-center="true" inkscape:snap-page="true" showguides="true" inkscape:guide-bbox="true" inkscape:window-width="1440" inkscape:window-height="788" inkscape:window-x="0" inkscape:window-y="1" inkscape:window-maximized="1"/>
    <metadata id="metadata3869">
        <rdf:RDF>
            <cc:Work rdf:about="">
                <dc:format>image/svg+xml</dc:format>
                <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
                <dc:title/>
            </cc:Work>
        </rdf:RDF>
    </metadata>
    <g inkscape:label="Calque 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-686.36219)">
        <rect style="fill:#ffffff;stroke:#000000;stroke-width:2.209692;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="rect2995" width="427.79013" height="363.79031" x="1.1049371" y="687.46704" ry="64.742134"/>
        <g id="g4285" transform="matrix(1.384742,0,0,1.384742,965.48278,2.0987819)">
            <polygon transform="translate(-829.3453,340.32404)" id="polygon4244" points="328.114,357.475 335.096,356.991 335.096,351.176 340.085,345.361 354.383,345.361 359.371,351.176 359.371,393.329 354.716,399.143 340.085,399.627 335.428,394.298 335.096,387.999 328.114,387.999 328.114,376.371 293.531,378.309 285.883,382.186 277.237,378.793 243.32,375.886 243.32,387.999 236.004,387.999 236.004,393.813 232.347,398.659 215.721,399.143 212.396,393.813 212.728,351.661 216.385,345.848 231.682,345.848 236.004,350.691 236.336,356.991 243.652,357.475 243.652,368.619 277.57,366.682 284.885,362.805 293.531,366.195 328.114,368.619 " style="stroke:#000000;stroke-width:0.17640001;stroke-linecap:round;stroke-linejoin:round"/>
            <rect id="rect4246" height="4.8449998" width="167.925" y="667.27502" x="-625.92828" style="stroke:#000000;stroke-width:5;stroke-linecap:round;stroke-linejoin:round"/>
            <polygon transform="translate(-829.3453,340.32404)" id="polygon4248" points="341.393,298.614 234.724,299.831 234.724,189.119 341.393,189.119 " style="fill:none;stroke:#ffff00;stroke-width:0.17640001;stroke-linecap:round;stroke-linejoin:round"/>
            <polygon transform="translate(-829.3453,340.32404)" id="polygon4250" points="363.061,314.43 212.223,313.213 224.724,175.736 350.56,175.736 " style="stroke:#000000;stroke-width:7;stroke-linecap:round;stroke-linejoin:round"/>
            <rect id="rect4252" height="121" width="112" y="524.38104" x="-598.28827" style="fill:#f17e01"/>
        </g>
    </g>
</svg>`;

            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else if (code === "M4X") {
            const w = 64, h = 24;
            const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="430" height="160" version="1.1">
  <g transform="translate(0,-892.36219)">
    <rect style="fill:#ffffff;stroke:#000000;stroke-width:1.46001;stroke-miterlimit:4;stroke-dasharray:none"
          width="428.53983" height="158.53999" x="0.73009604" y="893.0921" ry="28.214649"/>
    <g transform="matrix(0.73971716,0,0,0.73971716,228.63796,270.88608)">
      <path d="m 251.93691,931.63933 c 0,-37.371 -49.1,-67.667 -109.667,-67.667 -60.567,0 -109.667,30.295 -109.667,67.667 0,0.223 0.01,0.444 0.014,0.667 l -0.013,0 0,72.66697 84.358,0 c 0.536,-13.34297 11.732,-23.99997 25.476,-23.99997 13.741,0 24.938,10.657 25.474,23.99997 l 84.025,0 0,-72.66697 -0.014,0 c 0.004,-0.222 0.014,-0.444 0.014,-0.667 z m -126.334,13.082 0,0.085 -54,0 0,-0.214 c -9.042,-1.309 -16,-9.134 -16,-18.62 0,-9.486 6.958,-17.311 16,-18.62 l 0,-0.214 54,0 0,0.085 c 9.527,0.852 17.001,8.915 17.001,18.749 0,9.834 -7.474,17.898 -17.001,18.749 z m 102.667,30.419 c 0,9.572 -8.581,17.333 -19.166,17.333 -10.523,0 -19.059,-7.672 -19.158,-17.167 l -0.009,0 0,-53.333 c 0,-9.573 8.581,-17.333 19.167,-17.333 10.585,0 19.166,7.76 19.166,17.333 0,0.736 -0.067,1.458 -0.166,2.169 l 0,48.827 c 0.098,0.714 0.166,1.434 0.166,2.171 z"
            style="fill:#000000;stroke:none"/>
      <ellipse ry="13.667" rx="14" cy="924.47333" cx="209.10394" style="fill:#000000;stroke:none"/>
      <ellipse ry="23" rx="22.875" cy="1006.9733" cx="142.5199" style="fill:#000000;stroke:none"/>
      <rect height="10" width="30" y="994.97333" x="9.7698994" style="fill:#000000;stroke:none"/>
      <path d="m -282.33616,1004.6011 c -2.97667,-0.1849 -5.80674,-0.6277 -6.11039,-5.51703 l 0,-17.22687 c 0.30743,-4.92671 4.01426,-7.75737 8.07967,-8.06522 l 70.80463,-6.3851 46.26993,-46.26993 115.458067,0 44.0590258,44.05903 11.9504218,0 c 4.0933454,0.14659 5.5315064,1.49142 6.1052574,6.10526 l 0,33.32966 -280.661362,0 z"
            style="fill:#000000;stroke:#000000;stroke-width:0.72752553px;stroke-linecap:butt;stroke-linejoin:miter"/>
      <circle cx="-238.98311" cy="1005.0933" r="26.5" style="fill:#ffffff;stroke:none"/>
      <circle cx="-30.730089" cy="1006.1337" r="26.5" style="fill:#ffffff;stroke:none"/>
      <circle r="23.5" cy="1005.0933" cx="-238.98311" style="fill:#000000;stroke:none"/>
      <circle r="23.5" cy="1006.1337" cx="-30.730089" style="fill:#000000;stroke:none"/>
      <path d="m -112.14648,964.83563 -70.94734,0 c -3.883,-0.16685 -4.70037,-2.38879 -3.26492,-4.88172 l 28.31431,-28.3143 45.89795,0 z"
            style="fill:#ffffff;stroke:none"/>
      <path d="m -102.99122,964.83563 62.274987,0 c 3.408356,-0.16685 4.125818,-5.82201 2.86582,-8.31494 l -24.85326,-24.88108 -40.287547,0 z"
            style="fill:#ffffff;stroke:none"/>
    </g>
  </g>
</svg>`;
            var scale = RS_getScale();
            return { uri: uri(svg), w: w * scale, h: h * scale };
        }


        else txt = (code + (value && value !== "NULL" ? " " + value : ""));

        const svg =
              '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
              '<rect x="1.5" y="1.5" rx="4" ry="4" width="' + (w - 3) + '" height="' + (h - 3) + '" fill="#fff" stroke="#000" stroke-width="3"/>' +
              '<text x="' + (w / 2) + '" y="' + (h / 2 + 6) + '" font-family="Arial,Helvetica" font-size="14" font-weight="700" text-anchor="middle" fill="#000">' + (txt || "") + '</text>' +
              '</svg>';

        var scale = RS_getScale();
        return { uri: uri(svg), w: w * scale, h: h * scale };
    }

    function RS_queueSign(main, pano, lon, lat) {
        var mainIcon = RS_buildIcon(main.code, main.value);
        var panoIcon = (pano && pano.code) ? RS_buildPanonceau(pano.code, pano.value, mainIcon.w) : null;

        var pt = new OpenLayers.Geometry.Point(lon, lat)
        .transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject());

        RS_pending.push({
            pt3857: { x: pt.x, y: pt.y },
            pt4326: { lon: lon, lat: lat },
            mainIcon: mainIcon,
            panoIcon: panoIcon
        });
    }

    function RS_renderClusters() {
        if (!RS_Layer) RS_Layer = W.map.layers.find(l => l.uniqueName == "__WME_Draw_Border_RS");
        if (!RS_Layer) return;

        RS_Layer.removeAllFeatures();

        var clusters = [];
        RS_pending.forEach(item => {
            var found = null;
            for (var c of clusters) {
                var dx = item.pt3857.x - c.anchor.x;
                var dy = item.pt3857.y - c.anchor.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d <= RS_CLUSTER_THRESH_M) { found = c; break; }
            }
            if (!found) {
                clusters.push({ anchor: { x: item.pt3857.x, y: item.pt3857.y }, items: [item] });
            } else {
                found.items.push(item);
                var n = found.items.length;
                found.anchor.x = (found.anchor.x * (n - 1) + item.pt3857.x) / n;
                found.anchor.y = (found.anchor.y * (n - 1) + item.pt3857.y) / n;
            }
        });

        clusters.forEach(c => {
            var composite = RS_buildCompositeSVG(c.items);
            var geom = new OpenLayers.Geometry.Point(c.anchor.x, c.anchor.y);
            var feat = new OpenLayers.Feature.Vector(geom, null, {
                externalGraphic: composite.uri,
                graphicWidth: composite.w,
                graphicHeight: composite.h,
                graphicXOffset: -composite.w / 2,
                graphicYOffset: -composite.h / 2,
                graphicOpacity: 1.0
            });
            RS_Layer.addFeatures([feat]);
        });

        RS_pending = [];
    }

    function RS_buildCompositeSVG(items) {
        var pad = 6;
        var vpad = 4;
        var parts = [];
        var x = 0, maxH = 0;

        items.forEach(it => {
            var m = it.mainIcon;
            var p = it.panoIcon;

            var cellW = Math.max(m.w, p ? p.w : 0);
            var cellH = m.h + (p ? (vpad + p.h) : 0);

            var mX = x + (cellW - m.w) / 2;
            var mY = 0;

            var pTag = "";
            if (p) {
                var pX = x + (cellW - p.w) / 2;
                var pY = m.h + vpad;
                pTag = '<image x="' + pX + '" y="' + pY + '" width="' + p.w + '" height="' + p.h + '" href="' + p.uri + '"/>';
            }

            parts.push(
                '<image x="' + mX + '" y="' + mY + '" width="' + m.w + '" height="' + m.h + '" href="' + m.uri + '"/>' + pTag
            );

            x += cellW + pad;
            if (cellH > maxH) maxH = cellH;
        });

        var totalW = Math.max(1, x - pad);
        var totalH = Math.max(1, maxH);

        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + totalW + '" height="' + totalH + '" viewBox="0 0 ' + totalW + ' ' + totalH + '">'
        + parts.join('')
        + '</svg>';

        return {
            uri: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
            w: totalW,
            h: totalH
        };
    }

    function getSignalementId(banId) {
        if (!banId) return null;
        return banId.split('_').slice(0, 3).join('_');
    }

function checkSignalement(banId, callback) {
    const id = getSignalementId(banId);
    if (!id) return;

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.wazefrance.com/api/signalement_status/${id}`,
        onload: res => {
            try {
                const data = JSON.parse(res.responseText);
                data.id = id;
                callback(data);
            } catch {
                callback({ accepted: false, error: true });
            }
        },
        onerror: () => callback({ accepted: false, error: true })
    });
}

function renderResult(container, data) {
    if (data.error) {
        container.innerHTML = "❌ Erreur lors de la vérification";
        return;
    }

    window.DBF_currentSignalementData = {
        id: data.id,
        numero: data.numero,
        voie: data.voie,
        commune: data.commune
    };

    document.getElementById('dbfSignalementActions').style.display = 'block';

    if (data.accepted) {
        container.innerHTML = `
            ✅ Commune participante<br>
            <a target="_blank"
               href="https://signalement.adresse.data.gouv.fr/#/${data.id}">
               ✏️ Modifier / Demander suppression
            </a>
        `;
    } else {
        container.innerHTML = `
            ❌ Signalements désactivés<br>
            ${data.emails?.length
                ? `<a href="mailto:${data.emails[0]}">📧 Contacter la mairie</a>`
                : "📧 Contact mairie indisponible"}
        `;
    }
}



function DBF_initBanSearch(){
  const input = document.getElementById('dbf-ban-search');
  const box   = document.getElementById('dbf-ban-results');

  input.addEventListener('input',()=>{
    const q = input.value.toLowerCase();
    box.innerHTML = '';

    if(!q){
      box.style.display='none';
      return;
    }

    const hits = adresses_list
      .filter(a => `${a.numero} ${a.voie} ${a.commune}`.toLowerCase().includes(q))
      .slice(0,30);

    hits.forEach(a=>{
      const d = document.createElement('div');
      d.className = 'dbf-item';
      d.textContent = `${a.numero} – ${a.voie} (${a.commune})`;
      d.onclick = ()=>{
        input.value = d.textContent;
        box.style.display='none';
        checkSignalement(a.id_raw, r =>
          renderResult(document.getElementById('dbfSignalementResult'), r)
        );
      };
      box.appendChild(d);
    });

    box.style.display='block';
  });
}

function DBF_buildMailTemplate(data) {
    return `Objet : Signalement d’une anomalie d’adresse – ${data.commune}

Madame, Monsieur,

Je me permets de vous contacter en tant qu’éditeur bénévole de la carte Waze,
utilisée quotidiennement par de nombreux usagers (automobilistes, services de secours,
livraisons, transports, etc.).

Dans le cadre d’un travail d’amélioration de la précision cartographique sur votre commune,
j’ai identifié une anomalie concernant une adresse référencée dans la Base Adresse Nationale (BAN).

Adresse concernée :
– Identifiant BAN : ${data.id}
– Adresse : ${data.numero} ${data.voie}
– Commune : ${data.commune}

Cette incohérence peut entraîner des erreurs de guidage ou de localisation pour les usagers.
N’ayant pas la possibilité de soumettre un signalement directement via la plateforme nationale
pour votre commune, je me permets donc de vous en informer par ce message.

Je reste bien entendu à votre disposition pour tout complément d’information utile
(coordonnées, capture d’écran, contexte d’usage, etc.).

Je vous remercie par avance pour l’attention portée à ce signalement.

Cordialement,

[Votre nom]
Éditeur bénévole Waze
`;
}





    function getUserRankDBF(){try{return W?.loginManager?.user?.attributes?.rank??null}catch(t){return null}}function waitRank(){const t=getUserRankDBF();if(null===t)return setTimeout(waitRank,300);window.DBF_USER_RANK=t,window.DBF_USER_CAN_AUTOFILL=!(t<=1)}function parseWmeMouseSpan(t){if(!window.DBF_USER_CAN_AUTOFILL)return;if(!t)return null;const n=String(t).trim().match(/^\s*([+-]?\d+(?:\.\d+)?)\s*[ ,;]\s*([+-]?\d+(?:\.\d+)?)\s*$/);if(!n)return null;const e=parseFloat(n[1]),i=parseFloat(n[2]);if(!isFinite(e)||!isFinite(i))return null;let r,s;return Math.abs(e)<=90&&Math.abs(i)>90?(r=e,s=i):Math.abs(e)>90&&Math.abs(i)<=90?(s=e,r=i):(r=e,s=i),{lon:s,lat:r}}function sanitySwapIfWeird(t){if(!window.DBF_USER_CAN_AUTOFILL)return;if(!t)return t;if(t.lon>=-10&&t.lon<=15&&t.lat>=40&&t.lat<=55)return t;const n={lon:t.lat,lat:t.lon};return n.lon>=-10&&n.lon<=15&&n.lat>=40&&n.lat<=55?n:t}function tickMouseSpan(){if(!window.DBF_USER_CAN_AUTOFILL)return;const t=document.querySelector(".wz-map-ol-control-span-mouse-position");if(!t)return;const n=parseWmeMouseSpan(t.textContent||t.innerText||"");n&&(lastMouseLL=sanitySwapIfWeird(n),lastMouseTS=Date.now())}function haversine(t,n,e,i){if(!window.DBF_USER_CAN_AUTOFILL)return;const r=t=>t*Math.PI/180,s=r(i-n),o=r(e-t),a=Math.sin(s/2)**2+Math.cos(r(n))*Math.cos(r(i))*Math.sin(o/2)**2;return 12742e3*Math.asin(Math.sqrt(a))}function pickNearestFromList(t,n,e){if(!window.DBF_USER_CAN_AUTOFILL)return;let i=null,r=1/0;for(const e of t){const t=Number(e.lon),s=Number(e.lat);if(!isFinite(t)||!isFinite(s))continue;const o=haversine(n.lon,n.lat,t,s);o<r&&(r=o,i={...e,dist:o})}return!i||i.dist>e?null:i}window.DBF_USER_CAN_AUTOFILL=!1,window.DBF_USER_RANK=null,waitRank(),setInterval(tickMouseSpan,200),document.addEventListener("keydown",(function(t){if(!window.DBF_USER_CAN_AUTOFILL)return;if(!t.ctrlKey||"m"!==t.key.toLowerCase())return;if(!adresses_list||!adresses_list.length)return;if(!lastMouseLL||Date.now()-lastMouseTS>4e3)return;const n=t=>t&&null!==t.offsetParent;let e=null;const i=document.activeElement;if(i&&"INPUT"===i.tagName&&i.classList.contains("number")&&n(i))e=i;else{const t=document.querySelector(".house-number.is-active input.number, .content.active input.number");n(t)&&(e=t)}if(!e)return;const r=pickNearestFromList(adresses_list,lastMouseLL,50);if(!r)return;const s=r.numero,o=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value")?.set;o?o.call(e,s):e.value=s,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),document.activeElement&&document.activeElement.blur&&document.activeElement.blur()}));
    DBFstep1();
})();