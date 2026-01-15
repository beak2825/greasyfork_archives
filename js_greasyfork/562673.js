// ==UserScript==
// @name         Last.fm Automatic Edit Rules - Bulk Delete
// @namespace    https://greasyfork.org/en/users/1560377-scoblitz
// @version      1.9
// @description  Bulk delete automatic edit rules on Last.fm (Albums and Tracks)
// @author       Scoblitz
// @match        https://www.last.fm/*
// @icon         https://www.last.fm/static/images/lastfm_avatar_applemusic.b06eb8ad89be.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562673/Lastfm%20Automatic%20Edit%20Rules%20-%20Bulk%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/562673/Lastfm%20Automatic%20Edit%20Rules%20-%20Bulk%20Delete.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Check if we're on the correct page
  function isOnCorrectPage() {
    return window.location.href.includes('/settings/subscription/automatic-edits/');
  }

  // Create and inject the bulk delete button at the top
  function addBulkDeleteButton() {
    // Only add if we're on the right page and button doesn't exist
    if (!isOnCorrectPage() || document.getElementById('vm-bulk-delete-btn')) {
      return;
    }

    // Create button container - fixed at top of page
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'vm-bulk-delete-container';
    buttonContainer.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 10000;
      background-color: white;
      padding: 10px;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    // Create the bulk delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'vm-bulk-delete-btn';
    deleteBtn.textContent = '🗑️ Bulk Delete ALL';
    deleteBtn.style.cssText = `
      padding: 10px 16px;
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background-color 0.3s;
      white-space: nowrap;
    `;

    deleteBtn.addEventListener('mouseover', () => {
      deleteBtn.style.backgroundColor = '#b71c1c';
    });

    deleteBtn.addEventListener('mouseout', () => {
      deleteBtn.style.backgroundColor = '#d32f2f';
    });

    deleteBtn.addEventListener('click', handleBulkDelete);

    buttonContainer.appendChild(deleteBtn);
    document.body.appendChild(buttonContainer);
  }

  // Remove the button if it exists
  function removeButton() {
    const container = document.getElementById('vm-bulk-delete-container');
    if (container) {
      container.remove();
    }
  }

  // Check page and update button visibility
  function checkAndUpdateButton() {
    if (isOnCorrectPage()) {
      addBulkDeleteButton();
    } else {
      removeButton();
    }
  }

  // Get the current page type (Tracks or Albums)
  function getCurrentPageType() {
    return window.location.href.includes('/tracks') ? 'Tracks' : 'Albums';
  }

  // Get total count from page header (e.g., "398 Track Edits" or "150 Album Edits")
  function getTotalCount() {
    const headerElements = document.querySelectorAll('h2, h3, .header-title, [class*="heading"]');

    for (const element of headerElements) {
      const text = element.textContent.trim();
      // Look for patterns like "398 Track Edits" or "150 Album Edits"
      const match = text.match(/^(\d+)\s+(Track|Album)\s+Edits?$/i);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    // Fallback: look for any element with this pattern
    const allText = document.body.innerText;
    const match = allText.match(/(\d+)\s+(Track|Album)\s+Edits?/i);
    if (match) {
      return parseInt(match[1], 10);
    }

    return null;
  }

  // Get the first delete button on current page
  function getFirstDeleteButton() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    return allButtons.find(btn => {
      const hasTrash = btn.innerHTML.includes('trash');
      const hasDelete = btn.getAttribute('aria-label')?.toLowerCase().includes('delete');
      const hasClass = btn.className.includes('delete');
      return hasTrash || hasDelete || hasClass;
    });
  }

  // Wait for confirmation dialog and click it
  async function waitForAndClickConfirmation() {
    const maxAttempts = 40;
    for (let i = 0; i < maxAttempts; i++) {
      const confirmButton = Array.from(document.querySelectorAll('button.btn-primary'))
        .find(btn => btn.textContent.includes('DELETE') || btn.textContent.includes('Delete'));

      if (confirmButton) {
        confirmButton.click();
        await new Promise(resolve => setTimeout(resolve, 1800));
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }

  // Main bulk delete handler
  async function handleBulkDelete() {
    const pageType = getCurrentPageType();
    const initialTotal = getTotalCount();

    if (initialTotal === null) {
      alert('Could not determine total count. Please try refreshing the page.');
      return;
    }

    if (initialTotal === 0) {
      alert('No items to delete!');
      return;
    }

    // Show confirmation dialog
    const confirmed = confirm(
      `⚠️ You are about to delete ALL ${initialTotal} ${pageType} edit(s).\n\nThis will run continuously until all items are deleted.\nEstimated time: ${Math.ceil(initialTotal * 2 / 60)} minute(s).\n\nYou can stop at any time by refreshing the page.\n\nContinue?`
    );

    if (!confirmed) {
      return;
    }

    // Disable the button during processing
    const btn = document.getElementById('vm-bulk-delete-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';

    try {
      let deletedCount = 0;
      let lastTotal = initialTotal;
      let stuckCount = 0; // Track if we're stuck
      const maxStuckAttempts = 5;

      while (true) {
        // Check current total
        const currentTotal = getTotalCount();

        if (currentTotal === null) {
          console.warn('Lost track of total count');
          break;
        }

        if (currentTotal === 0) {
          console.log('All items deleted!');
          break;
        }

        // Update progress
        deletedCount = initialTotal - currentTotal;
        btn.textContent = `🗑️ Deleting... ${deletedCount}/${initialTotal} (${currentTotal} left)`;

        // Check if we're making progress
        if (currentTotal === lastTotal) {
          stuckCount++;
          if (stuckCount >= maxStuckAttempts) {
            console.warn('Stuck - no progress after multiple attempts');
            break;
          }
        } else {
          stuckCount = 0; // Reset stuck counter
          lastTotal = currentTotal;
        }

        // Get the first delete button
        const deleteButton = getFirstDeleteButton();

        if (!deleteButton) {
          console.log('No delete button found');
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue; // Try again after waiting
        }

        // Click the delete button
        deleteButton.click();

        // Wait for dialog
        await new Promise(resolve => setTimeout(resolve, 600));

        // Click confirmation
        await waitForAndClickConfirmation();

        // Wait for page to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Final count
      const finalTotal = getTotalCount() || 0;
      const totalDeleted = initialTotal - finalTotal;

      // Show completion message
      if (finalTotal === 0) {
        alert(`✅ SUCCESS! All ${totalDeleted} ${pageType} edits deleted!\n\nRefreshing page...`);
      } else {
        alert(`✓ Deleted ${totalDeleted} of ${initialTotal} ${pageType} edits.\n\n${finalTotal} remaining.\n\nYou can run again to continue, or this might be all that's available.\n\nRefreshing page...`);
      }

      // Reset button
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';

      // Refresh
      setTimeout(() => location.reload(), 1500);

    } catch (error) {
      console.error('Error during bulk delete:', error);
      alert(`Error occurred: ${error.message}\n\nRefreshing page...`);
      setTimeout(() => location.reload(), 1000);
    }
  }

  // Initialize when page is ready
  function init() {
    setTimeout(() => {
      checkAndUpdateButton();
    }, 500);

    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(checkAndUpdateButton, 500);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  init();
})();