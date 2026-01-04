// ==UserScript==
// @name         Pronote
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  ntm
// @author       Toi
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557154/Pronote.user.js
// @updateURL https://update.greasyfork.org/scripts/557154/Pronote.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const monWidgetComplet = `
    <section tabindex="-1" aria-labelledby="id_77_TitreText" id="id_77id_40" class="widget edt" style="height:100%;"><header title="Emploi du temps"><h2 class="sr-only" id="id_77_TitreText">Emploi du temps</h2><div class="cta-conteneur"><button id="id_77id_43" role="link" class="small-bt themeBoutonNeutre bg-white ieBouton ie-ripple NoWrap" tabindex="0" data-tooltip="default" aria-label="Tout voir"><span class="ieBtnContImg-img"><i class="ieBoutonIcon icon_affichage_widget" aria-hidden="true"></i><span>Tout voir</span></span></button></div></header><div class="filtre-conteneur"><div id="IE.Identite.collection.g21"><div class="ObjetCelluleDate input-wrapper "><i role="button" tabindex="0" class="icon_angle_left fix-bloc icon btnImageIcon btnImage" aria-labelledby="IE.Identite.collection.g21_labelwai id_tooltip_10" aria-describedby="IE.Identite.collection.g21_labelwai_c" data-tooltip="default" data-tooltip-id="id_tooltip_10"></i><div id="IE.Identite.collection.g21.cellule" class="fluid-bloc"><div class="input-wrapper"><div class="ocb_cont as-input as-date-picker ie-ripple"><div class="ocb-libelle ie-ripple-allowpass ie-ellipsis" tabindex="0" id="IE.Identite.collection.g21.cellule_Edit" role="button" aria-haspopup="dialog" style="width: 100px;" aria-labelledby="IE.Identite.collection.g21_labelwai IE.Identite.collection.g21_labelwai_c" data-tooltip="ellipsis">mar.&nbsp;18&nbsp;nov.</div><div class="ocb_bouton" role="presentation"></div></div></div></div><i role="button" tabindex="0" class="icon_angle_right fix-bloc icon btnImageIcon btnImage" style="flex: none;" aria-labelledby="IE.Identite.collection.g21_labelwai id_tooltip_11" aria-describedby="IE.Identite.collection.g21_labelwai_c" data-tooltip="default" data-tooltip-id="id_tooltip_11"></i><p class="sr-only" aria-hidden="true" id="IE.Identite.collection.g21_labelwai">Date</p><p class="sr-only" aria-hidden="true" id="IE.Identite.collection.g21_labelwai_c">mar. 18 nov.</p></div></div></div><div class="content-container overflow-auto" id="id_77id_41" role="presentation"><div id="id_77"><div class="text-center ie-titre-couleur-lowercase m-top m-bottom" role="heading" aria-level="3">Semaine Q2</div><ul class="liste-cours m-top-l"><li class="flex-contain" tabindex="0" id="fake-course-added">
    </li><li class="flex-contain" tabindex="0"><span class="sr-only">de 8h05 à 9h35 PHYSIQ.CHIMIE&amp;MATHS</span><div class="container-heures" aria-hidden="true"><div>8h05</div></div><div class="trait-matiere" style="background-color :#04FBFB;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">PHYSIQ.CHIMIE&amp;MATHS</li><li>DESMOULINS A.</li><li>[603 G1]</li><li>TP SCIENCES</li></ul></li><li class="flex-contain" tabindex="0"><span class="sr-only">de 9h35 à 10h45 FRANÇAIS</span><div class="container-heures" aria-hidden="true"><div>9h35</div></div><div class="trait-matiere" style="background-color :#21BBEF;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">FRANÇAIS</li><li>MARCHAL O.</li><li>[603 G1]</li><li>C02</li></ul></li><li class="flex-contain greyed" tabindex="0"><span class="sr-only">de 10h45 à 11h15 Pas de cours</span><div class="container-heures" aria-hidden="true"><div>10h45</div></div><div class="trait-matiere"></div><ul class="container-cours pas-de-cours" role="presentation"><li class="libelle-cours flex-contain" aria-hidden="true" role="presentation">Pas de cours</li></ul></li><li class="flex-contain" tabindex="0"><span class="sr-only">de 11h15 à 12h10 INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</span><div class="container-heures" aria-hidden="true"><div>11h15</div></div><div class="trait-matiere" style="background-color :#A65FFA;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</li><li>CAILLAUD A.</li><li>M21</li></ul></li><li class="flex-contain greyed " tabindex="0"><span class="sr-only">de 12h10 à 13h15 Pause Déjeuner</span><div class="container-heures" aria-hidden="true"><div>12h10</div><div>13h15</div></div><div class="trait-matiere"></div><ul class="container-cours demi-pension" aria-label="Pause Déjeuner"><li class="libelle-cours flex-contain" aria-hidden="true"></li></ul></li><li class="flex-contain" tabindex="0"><span class="sr-only">de 13h15 à 14h35 INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</span><div class="container-heures" aria-hidden="true"><div>13h15</div><div>14h35</div></div><div class="trait-matiere" style="background-color :#A65FFA;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</li><li>GOUTIER M.</li><li>[603 G1]</li><li>BM2</li><li class="container-etiquette"><div class="m-left-s tag-style ie-chips gd-blue-moyen">Cours déplacé</div></li></ul></li><li class="flex-contain cours-annule " tabindex="0"><span class="sr-only">de 14h40 à 16h20 INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</span><div class="container-heures" aria-hidden="true"><div>14h40</div></div><div class="trait-matiere" style="background-color :#A65FFA;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</li><li>DELANOUE F.</li><li>[603 G1]</li><li>M23, T05</li><li class="container-etiquette"><div class="m-left-s tag-style ie-chips gd-red-foncee">Prof./pers. absent</div></li></ul></li><li class="flex-contain cours-annule " tabindex="0"><span class="sr-only">de 16h20 à 17h45 INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</span><div class="container-heures" aria-hidden="true"><div>16h20</div><div>17h45</div></div><div class="trait-matiere" style="background-color :#A65FFA;"></div><ul class="container-cours "><li class="libelle-cours flex-contain" aria-hidden="true">INNOVATION TECHNOLOGIQUE, INGÉNIERIE ET DÉVELOPPEMENT DURABLE</li><li>GOUTIER M.</li><li>[603 G1]</li><li>BM2</li><li class="container-etiquette"><div class="m-left-s tag-style ie-chips gd-red-foncee">Cours annulé</div></li></ul></li></ul></div><div id="id_77id_44" class="as-footer" style="display: none;"></div></div></section>
    `;

    function remplacerWidget() {
        const widgetOriginal = document.querySelector('.widget.edt');

        if (widgetOriginal && !document.getElementById('fake-course-added')) {

            console.log("Pronote Hack: Widget trouvé, remplacement total...");

            const parser = new DOMParser();
            const doc = parser.parseFromString(monWidgetComplet, 'text/html');
            const nouveauWidget = doc.body.firstChild;

            const zoneDate = nouveauWidget.querySelector('.ocb-libelle');
            if (zoneDate) {
                zoneDate.innerText = "Aujourd'hui";
            }

            widgetOriginal.replaceWith(nouveauWidget);
        }
    }

    setInterval(remplacerWidget, 500);

})();