// ==UserScript==
// @name         39C3 Fahrplan Event Filter
// @namespace    ccc
// @version      0.1
// @description  Fügt im Sidebar-Menü eine Checkbox hinzu, um Security-Talks zu filtern
// @match        https://fahrplan.events.ccc.de/congress/2025/fahrpla*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558148/39C3%20Fahrplan%20Event%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558148/39C3%20Fahrplan%20Event%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addCheckBox(sidebar_selector, change_visibility) {
    // Sidebar-Element ermitteln
    const sidebar = document.querySelector("#" + sidebar_selector);
    if (!sidebar) return;

    // Container wählen
    const menu = sidebar.querySelector('ul');
    if (!menu) return;

    // Checkbox-Element bauen
    const li = document.createElement('li');
    li.style.listStyle = 'none';
    li.style.margin = '0.5em 0';

    const label = document.createElement('label');
    label.style.cursor = 'pointer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = sidebar_selector + "_checkbox";
    checkbox.style.margin = '0.5em';

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('Nur Security Talks'));

    li.appendChild(label);

    // Checkbox ans Menüende einfügen
  	menu.appendChild(li);

    // herausfinden, welche Vorträge "Security"-Talks sind.
    function isSecurityTalk(eventElem) {
      const trackElem = eventElem.querySelector('.track-bg-security');
      return trackElem != null;
    }
    
		// Alle Event-Elemente einsammeln
    const allEvents = Array.from(document.querySelectorAll('.event'));
    if (allEvents.length === 0) {
      	// Keine Events gefunden, nichts weiter tun
      return;
    }

    // Klick-Handler für die Checkbox: Events filtern
    checkbox.addEventListener('change', function () {

      const onlySecurity = checkbox.checked;

      allEvents.forEach(ev => {
        const isSec = isSecurityTalk(ev);

        if (!onlySecurity) {
          // Filter aus: alles anzeigen
          ev.style.display = '';
        } else {
          // Filter an: nur Security Talks anzeigen
          ev.style.display = isSec ? '' : 'none';
        }
      });
    });
  }

  addCheckBox("top-bar-sidebar");
  addCheckBox("top-bar-sidebar-popover");

})();
