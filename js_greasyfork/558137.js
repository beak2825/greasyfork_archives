// ==UserScript==
// @author       Dougmarqs
// @name         Neopets Closet - Advanced Remove Tools [by dougmarqs]
// @version      2.1
// @description  Adds per-item "All" buttons and global "Remove All on Page" / "Clear All" at top (next to Go) and bottom (next to Move selected items). Buttons are green and will NOT submit the page.
// @match        https://www.neopets.com/closet.phtml*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1545323
// @downloadURL https://update.greasyfork.org/scripts/558137/Neopets%20Closet%20-%20Advanced%20Remove%20Tools%20%5Bby%20dougmarqs%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/558137/Neopets%20Closet%20-%20Advanced%20Remove%20Tools%20%5Bby%20dougmarqs%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (typeof window.$ === 'undefined') {
    console.error('jQuery not found on this page.');
    return;
  }

  $(function () {

    // ---------- helpers ----------
    function setRemoveInputsToQty() {
      const closetTable = $("table:contains('Image')").first();
      closetTable.find("tr").each(function () {
        const row = $(this);
        const qtyCell = row.find("td:nth-last-child(2) b");
        const inputBox = row.find("td:last-child input[type='text']");
        if (qtyCell.length && inputBox.length) {
          const qty = parseInt(qtyCell.text().trim(), 10);
          if (!isNaN(qty)) inputBox.val(qty).attr('data-remove_val', 'y');
        }
      });
    }

    function clearAllRemoveInputs() {
      $("table:contains('Image')").first()
        .find("td:last-child input[type='text']")
        .val('0').removeAttr('data-remove_val');
    }

    function makeGreenButton(label, onClick) {
      return $('<button type="button">')
        .text(label)
        .css({
          backgroundColor: '#28a745',
          color: '#ffffff',
          border: 'none',
          padding: '6px 10px',
          marginLeft: '6px',
          marginRight: '2px',
          fontSize: '12px',
          cursor: 'pointer',
          borderRadius: '4px',
          fontWeight: '600'
        })
        .on('click', function (e) {
          // prevent any form submission or bubbling
          e.preventDefault();
          e.stopPropagation();
          try { onClick(e); } catch (err) { console.error(err); }
          return false;
        });
    }

    // ---------- per-item "All" buttons ----------
    const closetTable = $("table:contains('Image')").first();
    closetTable.find("tr").each(function () {
      const row = $(this);
      const qtyCell = row.find("td:nth-last-child(2) b");
      const inputBox = row.find("td:last-child input[type='text']");
      if (qtyCell.length && inputBox.length) {
        const qty = parseInt(qtyCell.text().trim(), 10);
        if (!isNaN(qty)) {
          const btn = $('<button type="button">')
            .text('All')
            .css({
              marginLeft: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '3px'
            })
            .on('click', function (e) {
              e.preventDefault(); e.stopPropagation();
              inputBox.val(qty).attr('data-remove_val', 'y');
              return false;
            });
          inputBox.after(btn);
        }
      }
    });

    // ---------- TOP: place buttons next to the "Go" button ----------
    // Target the form's Go button that controls per_page/page (prefer the one with selects)
    let topGoBtn = $("input[type='submit'][value='Go']").filter(function () {
      const form = $(this).closest('form');
      return form.find("select[name='per_page'], select[name='page']").length > 0;
    }).first();

    // fallback to the first Go if none matched
    if (!topGoBtn.length) topGoBtn = $("input[type='submit'][value='Go']").first();

    if (topGoBtn.length) {
      const topForm = topGoBtn.closest('form');

      // create container for neat placement
      const topWrapper = $('<span>').css({ marginLeft: '6px', display: 'inline-block' });

      const topRemoveBtn = makeGreenButton('Remove All on Page', setRemoveInputsToQty);
      const topClearBtn = makeGreenButton('Clear All', clearAllRemoveInputs);

      topWrapper.append(topRemoveBtn).append(topClearBtn);

      // place after the Go button (so it's visually next to it)
      topGoBtn.after(topWrapper);
    } else {
      // if no Go found, insert at top of closet table as fallback
      const fallbackTop = $('<div>').css({ textAlign: 'center', margin: '8px 0' });
      fallbackTop.append(makeGreenButton('Remove All on Page', setRemoveInputsToQty));
      fallbackTop.append(makeGreenButton('Clear All', clearAllRemoveInputs));
      closetTable.before(fallbackTop);
    }

    // ---------- BOTTOM: place buttons next to "Move selected items" ----------
    const bottomMoveBtn = $("input[type='submit'][value='Move selected items']").first();
    if (bottomMoveBtn.length) {
      const bottomTd = bottomMoveBtn.closest('td');
      const bottomWrapper = $('<span>').css({ marginLeft: '6px' });

      // create bottom buttons (same behaviour)
      const bottomRemoveBtn = makeGreenButton('Remove All on Page', setRemoveInputsToQty);
      const bottomClearBtn = makeGreenButton('Clear All', clearAllRemoveInputs);

      bottomWrapper.append(bottomRemoveBtn).append(bottomClearBtn);

      // append to the same cell as Move selected items
      bottomTd.append(bottomWrapper);
    } else {
      // fallback: append at end of closet table
      const fallbackBottom = $('<div>').css({ textAlign: 'center', margin: '8px 0' });
      fallbackBottom.append(makeGreenButton('Remove All on Page', setRemoveInputsToQty));
      fallbackBottom.append(makeGreenButton('Clear All', clearAllRemoveInputs));
      closetTable.after(fallbackBottom);
    }

  });
})();
