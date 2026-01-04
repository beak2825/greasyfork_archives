// ==UserScript==
// @name         FV - Animal Husbandry Better Stable Management
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Sort animals by item ID (rarity), toggle empty stables up/down, add Select All Stables/Animals toggles, and changes "Manage Stables" button to the header.
// @author       necroam
// @match        https://www.furvilla.com/career/stables/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556112/FV%20-%20Animal%20Husbandry%20Better%20Stable%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/556112/FV%20-%20Animal%20Husbandry%20Better%20Stable%20Management.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Toggle label helper
  function addToggle(th, labelText, targetClass) {
    const link = document.createElement('a');
    link.className = 'label label-primary serpent-all';
    link.href = '#';
    link.style.display = 'block';
    link.style.textAlign = 'center';
    link.style.marginTop = '4px';
    link.innerHTML = '<i class="fa fa-check-square-o"></i> ' + labelText;

    let checked = false;
    link.addEventListener('click', e => {
      e.preventDefault();
      checked = !checked;
      document.querySelectorAll('input.' + targetClass).forEach(cb => {
        if (cb.type === 'checkbox') cb.checked = checked;
      });
    });

    th.appendChild(link);
  }

  // Extract animal item ID from image src, ignoring the stable icon
  function getAnimalItemId(row) {
    const imgs = row.querySelectorAll('td img');
    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (src && !src.includes('/0/2-animal-stable.png')) {
        const match = src.match(/\/items\/\d+\/(\d+)-/);
        if (match) return parseInt(match[1], 10);
      }
    }
    return null;
  }

  // Sort label under Stable header
  function addSortLabel(th) {
    const link = document.createElement('a');
    link.className = 'label label-primary serpent-sort';
    link.href = '#';
    link.style.display = 'block';
    link.style.textAlign = 'center';
    link.style.marginTop = '4px';
    link.innerHTML =
      '<i class="fa-solid fa-arrow-down-up-across-line"></i> High ID to Low ID';

    let descending = true;
    link.addEventListener('click', e => {
      e.preventDefault();
      const tbody = th.closest('table')?.querySelector('tbody');
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr.stable-row'));
      const animalRows = rows.filter(r => getAnimalItemId(r) !== null);
      const emptyRows = rows.filter(r => getAnimalItemId(r) === null);

      animalRows.sort((a, b) => {
        const idA = getAnimalItemId(a);
        const idB = getAnimalItemId(b);
        return descending ? idB - idA : idA - idB;
      });

      const frag = document.createDocumentFragment();
      animalRows.forEach(r => frag.appendChild(r));
      emptyRows.forEach(r => frag.appendChild(r));
      tbody.innerHTML = '';
      tbody.appendChild(frag);

      descending = !descending;
      link.innerHTML =
        '<i class="fa-solid fa-arrow-down-up-across-line"></i> ' +
        (descending ? 'High ID to Low ID' : 'Low ID to High ID');
    });

    th.appendChild(link);
  }

  // Empty stables toggle under Stable header
  function addEmptyStablesLabel(th) {
    const link = document.createElement('a');
    link.className = 'label label-primary serpent-empty';
    link.href = '#';
    link.style.display = 'block';
    link.style.textAlign = 'center';
    link.style.marginTop = '4px';
    link.innerHTML = '<i class="fa-solid fa-arrow-up"></i> Empty Stables';

    let up = true;
    link.addEventListener('click', e => {
      e.preventDefault();
      const tbody = th.closest('table')?.querySelector('tbody');
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr.stable-row'));
      const emptyRows = rows.filter(
        r =>
          r.querySelector('input.export-stable-input') &&
          !r.querySelector('input.export-animal-input')
      );
      const nonEmptyRows = rows.filter(r => !emptyRows.includes(r));

      const frag = document.createDocumentFragment();
      if (up) {
        emptyRows.forEach(r => frag.appendChild(r));
        nonEmptyRows.forEach(r => frag.appendChild(r));
      } else {
        nonEmptyRows.forEach(r => frag.appendChild(r));
        emptyRows.forEach(r => frag.appendChild(r));
      }
      tbody.innerHTML = '';
      tbody.appendChild(frag);

      up = !up;
      link.innerHTML = up
        ? '<i class="fa-solid fa-arrow-up"></i> Empty Stables'
        : '<i class="fa-solid fa-arrow-down"></i> Empty Stables';
    });

    th.appendChild(link);
  }

  // Mirror Manage Stables button into header and submit form in a Firefox-safe way
  function mirrorManageButton() {
    const header = document.querySelector('h1.clearfix');
    const original = document.querySelector('#stables-submit');
    if (!header || !original) return;

    // Avoid duplicate proxy
    if (header.querySelector('#stables-submit-proxy')) return;

    const right = document.createElement('span');
    right.style.cssText = 'float:right; margin-left:10px;';

    const proxy = document.createElement('button');
    proxy.type = 'button';
    proxy.id = 'stables-submit-proxy';
    proxy.className = original.className; // preserve styling (e.g., 'btn big')
    proxy.textContent = original.value || 'Manage Stables';

    const disableText = original.getAttribute('data-disable-with') || 'Submitting...';

    proxy.addEventListener('click', () => {
      proxy.disabled = true;
      proxy.textContent = disableText;

      // Prefer requestSubmit for proper form submission (Firefox supports this)
      const form = original.form;
      if (form && typeof form.requestSubmit === 'function') {
        form.requestSubmit(original); // passes through native submit handlers
      } else if (original.click) {
        original.click(); // fallback
      } else if (form) {
        form.submit(); // last resort (may bypass onsubmit handlers)
      }

      // Re-enable proxy in case of client-side validation (navigation will cancel this anyway)
      setTimeout(() => {
        proxy.disabled = false;
        proxy.textContent = original.value || 'Manage Stables';
      }, 3000);
    });

    right.appendChild(proxy);
    header.appendChild(right);

    // Keep original in DOM for proper submission; optionally visually collapse its wrapper
    const wrapper = original.closest('p.align-center');
    if (wrapper) {
      wrapper.style.height = '0';
      wrapper.style.margin = '0';
      wrapper.style.padding = '0';
      wrapper.style.overflow = 'hidden';
      original.style.margin = '0';
    }
  }

  // Insert labels safely (throttled for Firefox)
  let inserting = false;
  function insertLabels() {
    if (inserting) return;
    inserting = true;
    setTimeout(() => {
      const ths = document.querySelectorAll('th.text-center');
      if (!ths.length) {
        inserting = false;
        return;
      }

      const thStableHeader = Array.from(ths).find(
        th => th.textContent.includes('Stable') && th.colSpan === 2
      );
      const thExportStable = Array.from(ths).find(th =>
        th.textContent.includes('Export Stable')
      );
      const thExportAnimal = Array.from(ths).find(th =>
        th.textContent.includes('Export Animal')
      );

      if (thStableHeader) {
        if (!thStableHeader.querySelector('.serpent-sort')) {
          addSortLabel(thStableHeader);
        }
        if (!thStableHeader.querySelector('.serpent-empty')) {
          addEmptyStablesLabel(thStableHeader);
        }
      }
      if (thExportStable && !thExportStable.querySelector('.serpent-all')) {
        addToggle(thExportStable, 'All Stables', 'export-stable-input');
      }
      if (thExportAnimal && !thExportAnimal.querySelector('.serpent-all')) {
        addToggle(thExportAnimal, 'All Animals', 'export-animal-input');
      }

      mirrorManageButton();
      inserting = false;
    }, 50);
  }

  const observer = new MutationObserver(insertLabels);
  observer.observe(document.body, { childList: true, subtree: true });
  insertLabels();
})();
