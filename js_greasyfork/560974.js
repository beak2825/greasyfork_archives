// ==UserScript==
// @name         Neopets Petpet Puddle Pro
// @namespace http://tampermonkey.net/
// @description  Reorganizes Petpet Puddle to display petpets in a 4-column grid
// @author       TheZuki10@clraik.com
// @version      1.0
// @match        *://*.neopets.com/pool/puddle.phtml*
// @icon https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @downloadURL https://update.greasyfork.org/scripts/560974/Neopets%20Petpet%20Puddle%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560974/Neopets%20Petpet%20Puddle%20Pro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    columnsPerRow: 4,
    cardMinWidth: '180px',
    gapSize: '15px',
    borderColor: '#999',
    borderRadius: '8px',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  };

  function initGridLayout() {
    // Find the main table containing petpets
    const petpetTable = document.querySelector('table[align="center"]');
    if (!petpetTable) {
      console.log('Petpet table not found');
      return;
    }

    // Get all the petpet cells
    const petpetCells = petpetTable.querySelectorAll('td[align="center"]');
    if (petpetCells.length === 0) {
      console.log('No petpet cells found');
      return;
    }

    // Create a new grid container
    const gridContainer = document.createElement('div');
    gridContainer.id = 'petpet-grid-container';
    gridContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${CONFIG.columnsPerRow}, minmax(${CONFIG.cardMinWidth}, 1fr));
      gap: ${CONFIG.gapSize};
      max-width: 1000px;
      margin: 20px auto;
      padding: 15px;
      box-sizing: border-box;
    `;

    // Move each petpet cell to the grid
    petpetCells.forEach((cell) => {
      const clonedCell = cell.cloneNode(true);

      // Check if this is a zapped petpet
      const isZapped = cell.getAttribute('bgcolor') === '#db5b5b';

      // Style the cloned cell as a card
      clonedCell.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 8px;
        background-color: ${isZapped ? '#db5b5b' : '#f9f9f9'};
        border: 2px solid ${CONFIG.borderColor};
        border-radius: ${CONFIG.borderRadius};
        box-shadow: 0 2px 6px ${CONFIG.shadowColor};
        width: 180px;
        height: 200px;
        box-sizing: border-box;
        transition: all 0.3s ease;
      `;

      // Add hover effect
      clonedCell.addEventListener('mouseenter', () => {
        clonedCell.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        clonedCell.style.transform = 'translateY(-2px)';
        if (isZapped) {
          clonedCell.style.backgroundColor = '#e74444';
          clonedCell.style.borderColor = '#c23838';
        } else {
          clonedCell.style.backgroundColor = '#fffacd';
          clonedCell.style.borderColor = '#d4af37';
        }
      });

      clonedCell.addEventListener('mouseleave', () => {
        clonedCell.style.boxShadow = `0 2px 6px ${CONFIG.shadowColor}`;
        clonedCell.style.transform = 'translateY(0)';
        clonedCell.style.backgroundColor = isZapped ? '#db5b5b' : '#f9f9f9';
        clonedCell.style.borderColor = CONFIG.borderColor;
      });

      // Style form elements inside
      const form = clonedCell.querySelector('form');
      if (form) {
        form.style.cssText = `
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          overflow: hidden;
          height: 100%;
        `;
        // Remove all <br> tags from form
        form.querySelectorAll('br').forEach(br => br.remove());
      }

      // Style select dropdowns
      const select = clonedCell.querySelector('select');
      if (select) {
        select.style.cssText = `
          padding: 4px 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          max-width: 95%;
        `;
      }

      // Style submit buttons
      const submitBtn = clonedCell.querySelector('input[type="submit"]');
      if (submitBtn) {
        submitBtn.style.cssText = `
          padding: 4px 8px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 2px;
          max-width: 90%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;

        submitBtn.addEventListener('mouseenter', () => {
          submitBtn.style.backgroundColor = '#45a049';
        });

        submitBtn.addEventListener('mouseleave', () => {
          submitBtn.style.backgroundColor = '#4CAF50';
        });
      }

      // Style the petpet image
      const img = clonedCell.querySelector('img');
      if (img) {
        img.style.cssText = `
          max-width: 70px;
          max-height: 70px;
          margin-bottom: 4px;
          display: block;
        `;
      }

      // Style the petpet name
      const span = clonedCell.querySelector('span.sf');
      if (span) {
        span.style.cssText = `
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 2px;
          word-wrap: break-word;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        `;
      }

      gridContainer.appendChild(clonedCell);
    });

    // Replace the original table with the grid
    petpetTable.parentNode.replaceChild(gridContainer, petpetTable);

    // Find and hide the original warning message
    const allDivs = document.querySelectorAll('div[align="center"]');
    let warningFound = false;
    allDivs.forEach(div => {
      const boldTag = div.querySelector('b[style*="color"]');
      if (boldTag && boldTag.textContent.includes('zapped')) {
        div.style.display = 'none';
        warningFound = true;
      }
    });

    // Create and add the new warning message at the top
    if (warningFound) {
      const warningContainer = document.createElement('div');
      warningContainer.style.cssText = `
        text-align: center;
        margin-bottom: 20px;
        margin-top: 10px;
        font-size: 13px;
        color: #ff0000;
        font-weight: bold;
      `;
      warningContainer.innerHTML = '<b>Petpets in red have been zapped and cannot be painted!</b>';
      gridContainer.parentNode.insertBefore(warningContainer, gridContainer);
    }

    // Add responsive behavior
    addResponsiveStyles();
  }

  function addResponsiveStyles() {
    // Create a style element for media queries
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 900px) {
        #petpet-grid-container {
          grid-template-columns: repeat(3, minmax(${CONFIG.cardMinWidth}, 1fr)) !important;
        }
      }

      @media (max-width: 600px) {
        #petpet-grid-container {
          grid-template-columns: repeat(2, minmax(150px, 1fr)) !important;
        }
      }

      @media (max-width: 400px) {
        #petpet-grid-container {
          grid-template-columns: 1fr !important;
        }
      }

      /* Red background for zapped petpets */
      td[bgcolor="#db5b5b"] {
        background-color: #db5b5b !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Wait for the page to load and then initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGridLayout);
  } else {
    initGridLayout();
  }
})();