// ==UserScript==
// @name         OJ Batch User Adder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds buttons to bulk-add students to private contests
// @author       You
// @match        https://oj-test.iiit.ac.in/admin/judge/contest/*/change/*
// @match        https://oj-test.iiit.ac.in/admin/judge/contest/add/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563082/OJ%20Batch%20User%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/563082/OJ%20Batch%20User%20Adder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- DATA CONFIGURATION ---

  const SECTION_A = [
    "2025111020", "2025111009", "2025111003", "2025111031", "2025111019",
    "2022115002", "2025101085", "2025101052", "2025101061", "2025101002",
    "2025101080", "2025101065", "2025101027", "2025111017", "2025111004",
    "2025101005", "2025101062", "2025101047", "2025101059", "2025101024",
    "2025101026", "2025111030", "2025101070", "2025101037", "2025101040",
    "2025101068", "2025111001", "2025101013", "2025101050", "2025101007",
    "2025101053", "2025101036", "2025101028", "2025101071", "2025101051",
    "2025101153", "2025101077", "2025101057", "2025101055", "2024101147",
    "2025101097", "2025101031", "2025111022", "2025101158", "2025111014",
    "2025101022", "2025101043", "2025101090", "2025101012", "2025101083",
    "2025101072", "2025101056", "2025101006", "2025101010", "2025101003",
    "2025111006", "2025101045", "2025111025", "2025101084", "2025111012",
    "2025111023", "2025101093", "2025111013", "2025101058", "2025101060",
    "2025101082", "2025101041", "2025101067", "2025101044", "2025111015",
    "2025101046", "2025101073", "2025101095", "2025101018", "2025101096",
    "2025111027", "2025101015", "2025101032", "2025101087", "2025101004",
    "2025101156", "2025101066", "2025111026", "2025101023", "2025101069",
    "2025101091", "2025111028", "2025101014", "2024113008", "2025101038",
    "2025101094", "2025111029", "2025101088", "2025101033", "2025101054",
    "2025101016", "2024115020", "2025111008", "2025111002", "2025101049",
    "2025111018", "2025101081", "2025111024", "2025101042", "2025111021",
    "2025101029", "2025101076", "2025101019", "2025101035", "2025101078",
    "2025101074", "2025111033", "2025101034", "2025101030", "2025101079",
    "2025101157", "2025101119", "2025101063", "2025101089", "2025101092",
    "2025101020", "2025101075", "2025101011", "2025111016", "2025111007",
    "2025111011", "2025111010", "2025101064", "2025101008", "2025101155",
    "2025101021", "2025111005", "2025101017", "2019101115", "2025101154",
    "2025101025", "2025101086", "2025101009", "2025101048", "2025111032"
  ];

  const SECTION_B = [
    "2023102035", "2024101082", "2024102022", "2025102002", "2025102003",
    "2025102004", "2025102007", "2025102009", "2025102010", "2025102011",
    "2025102012", "2025102013", "2025102014", "2025102015", "2025102016",
    "2025102017", "2025102019", "2025102020", "2025102022", "2025102023",
    "2025102024", "2025102025", "2025102027", "2025102028", "2025102029",
    "2025102030", "2025102031", "2025102032", "2025102033", "2025102034",
    "2025102035", "2025102036", "2025102037", "2025102038", "2025102039",
    "2025102040", "2025102041", "2025102044", "2025102045", "2025102046",
    "2025102047", "2025102048", "2025102049", "2025102050", "2025102051",
    "2025102052", "2025102053", "2025102054", "2025102055", "2025102056",
    "2025102057", "2025102058", "2025102059", "2025102060", "2025102061",
    "2025102062", "2025102063", "2025102064", "2025102065", "2025102066",
    "2025102067", "2025102068", "2025102069", "2025102070", "2025102071",
    "2025102072", "2025102073", "2025102074", "2025102075", "2025102076",
    "2025102077", "2025102078", "2025102080", "2025102081", "2025102082",
    "2025102083", "2025102084", "2025102085", "2025102086", "2025102088",
    "2025102089", "2025102090", "2025102091", "2025102092", "2025102093",
    "2025102094", "2025102096", "2025102097", "2025102098", "2025102099",
    "2025102100", "2025102101", "2025102102", "2025102103", "2025102104",
    "2025102105", "2025102106", "2025102107", "2025102108", "2025102109",
    "2025102110", "2025102111", "2025102112", "2025111034", "2025111035",
    "2025111036", "2025111037", "2025111038", "2025111039", "2025112001",
    "2025112002", "2025112003", "2025112004", "2025112005", "2025112006",
    "2025112007", "2025112008", "2025112009", "2025112010", "2025112011",
    "2025112012", "2025112013", "2025112014", "2025112015", "2025112016",
    "2025112017", "2025112018", "2025112019", "2025112020", "2025112021",
    "2025112022"
  ];

  const SECTION_C = [
    "2025117015", "2025101143", "2025113020", "2025115001", "2025114001",
    "2025101147", "2025101120", "2025101114", "2025101110", "2025101113",
    "2025114012", "2025113023", "2025113001", "2025101118", "2025114004",
    "2025115008", "2024115011", "2025117010", "2025115018", "2025115012",
    "2025113007", "2025101117", "2025117003", "2025101106", "2025101112",
    "2025101145", "2025113011", "2025115013", "2025115017", "2025101122",
    "2025115009", "2025117012", "2025101148", "2025101116", "2025101102",
    "2025117001", "2025115011", "2025115014", "2025113019", "2025117007",
    "2025117005", "2025101159", "2025101152", "2025117002", "2025101123",
    "2025113008", "2025115002", "2025101124", "2025101121", "2025101140",
    "2025113004", "2025101135", "2025114014", "2025113014", "2025113024",
    "2025113005", "2025114011", "2025101139", "2025113016", "2025113022",
    "2025117006", "2025113017", "2025101104", "2025101127", "2025117009",
    "2025114017", "2025115005", "2025101146", "2025101136", "2025101129",
    "2025101107", "2025114005", "2025117014", "2025117008", "2025113009",
    "2025101133", "2025101103", "2025101144", "2025114015", "2025101150",
    "2025101132", "2025115007", "2025101134", "2025113006", "2025101100",
    "2025113010", "2025114007", "2025115016", "2025101142", "2025115015",
    "2025101130", "2025101098", "2025101109", "2025101105", "2025101115",
    "2025101149", "2025113018", "2025113003", "2025117013", "2025101131",
    "2025113021", "2025101099", "2025101108", "2025101138", "2025101141",
    "2025101101", "2025114010", "2025114009", "2025114002", "2025113012",
    "2025113002", "2025114003", "2025117011", "2025101111", "2025101125",
    "2025113015", "2025101128", "2025114013", "2025115006", "2025114016",
    "2025101151", "2025113013", "2025115010", "2025114006", "2025115004",
    "2025114008", "2025101137", "2025117004", "2025101126"
  ];

  // --- UI INJECTION ---

  // Find the container div
  const targetDiv = document.querySelector('.form-row.field-private_contestants');

  if (targetDiv) {
    // Create a helper row that matches Django admin structure
    const batchRow = document.createElement('div');
    batchRow.style.cssText = `
            padding: 8px 0;
            margin-top: 6px;
        `;

    // Use flex-container like Django admin does for proper label alignment
    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex-container';

    // Label (matching Django admin label style)
    const label = document.createElement('label');
    label.innerText = 'Quick add:';
    flexContainer.appendChild(label);

    // Right side wrapper for buttons + status
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

    // Button group
    const btnGroup = document.createElement('div');
    btnGroup.style.cssText = `
            display: inline-flex;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        `;

    // Add Buttons
    btnGroup.appendChild(createButton('A', SECTION_A, false));
    btnGroup.appendChild(createButton('B', SECTION_B, true));
    btnGroup.appendChild(createButton('C', SECTION_C, true));
    controlsWrapper.appendChild(btnGroup);

    // Status indicator (inline, minimal)
    const statusArea = document.createElement('span');
    statusArea.id = 'batch-add-status';
    statusArea.style.cssText = `
            font-size: 12px;
            color: #888;
        `;
    controlsWrapper.appendChild(statusArea);

    flexContainer.appendChild(controlsWrapper);
    batchRow.appendChild(flexContainer);

    // Append AFTER the existing content (below the field)
    targetDiv.appendChild(batchRow);
  }

  function createButton (text, userList, addBorder) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.type = 'button';
    btn.style.cssText = `
            padding: 6px 14px;
            cursor: pointer;
            background: #79aec8;
            color: #fff;
            border: none;
            ${addBorder ? 'border-left: 1px solid rgba(255,255,255,0.2);' : ''}
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: background 0.15s ease;
        `;

    btn.onmouseenter = () => { btn.style.background = '#417690'; };
    btn.onmouseleave = () => { btn.style.background = '#79aec8'; };

    btn.onclick = () => runBatch(userList, 'Section ' + text);
    return btn;
  }

  // --- LOGIC ---

  function runBatch (usersToAdd, sectionName) {
    const $select = window.jQuery('#id_private_contestants');
    const statusEl = document.getElementById('batch-add-status');
    const ajaxUrl = $select.data('ajax--url');

    if (!$select.length || !ajaxUrl) {
      alert('Error: Could not find the Select2 element or AJAX URL.');
      return;
    }

    statusEl.innerHTML = `Adding ${sectionName}...`;
    statusEl.style.color = '#666';
    let processed = 0;
    let addedCount = 0;

    usersToAdd.forEach(username => {
      window.jQuery.ajax({
        type: 'GET',
        url: ajaxUrl,
        data: { term: username },
        dataType: 'json'
      }).then(function (data) {
        const match = data.results.find(u => u.text.trim() === username);

        if (match) {
          if ($select.find("option[value='" + match.id + "']").length) {
            console.log(`Skipping ${username}: Already added.`);
          } else {
            var option = new Option(match.text, match.id, true, true);
            $select.append(option).trigger('change');
            $select.trigger({
              type: 'select2:select',
              params: { data: match }
            });
            addedCount++;
            console.log(`Added ${username}`);
          }
        } else {
          console.warn(`User not found: ${username}`);
        }

        processed++;
        statusEl.innerHTML = `${sectionName}: ${processed}/${usersToAdd.length}`;

        if (processed === usersToAdd.length) {
          statusEl.innerHTML = `✓ ${sectionName}: +${addedCount} added`;
          statusEl.style.color = '#28a745';
        }
      });
    });
  }

})();