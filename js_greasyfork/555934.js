// ==UserScript==
// @name         Xhamster Auto Unlock Playlists v.5
// @namespace    http://tampermonkey.net/
// @version      5.00
// @description  Auto Unlock Playlists on click on auto unlock button - Delete Not available too OK
// @icon         https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @author       You
// @match        https://xhamster.com/my/favorites/*
// @match        https://xhamster.com/my/favorites/videos/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/555934/Xhamster%20Auto%20Unlock%20Playlists%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/555934/Xhamster%20Auto%20Unlock%20Playlists%20v5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let isSuspended = false;
  let processedPlaylists = new Set();
  let intervalId = null;

  // Function to get the playlist ID
  function getPlaylistId() {
    try {
      const playlistLink = document.querySelector('a[href*="/my/favorites/videos/"]');
      if (playlistLink) {
        const url = playlistLink.href;
        const id = url.match(/\/my\/favorites\/videos\/(\d+)/);
        if (id) {
          return id[1];
        }
      }
    } catch (error) {
      console.error('Error getting playlist ID:', error);
    }
    return null;
  }

  // Function to check for error messages
  function checkForErrors() {
    try {
      const errorMessage = document.querySelector('[class^="message-"][class*="state-error-"]');
      return errorMessage !== null;
    } catch (error) {
      console.error('Error checking for errors:', error);
    }
    return false;
  }

  // Function to unlock a playlist
  function unlockPlaylist() {
    if (isSuspended) {
      return;
    }

    const playlistId = getPlaylistId();
    if (processedPlaylists.has(playlistId)) {
      console.log('Already processed this playlist. Skipping.');
      return;
    }

    if (!playlistId) {
      return;
    }

    processedPlaylists.add(playlistId);

    try {
      // Find the edit button
      const editButtonSelector = '[data-role="favorites-video-collections"]:has([id="lock"]) [class*="hasLeftIcon-"]';
      const editButton = document.querySelector(editButtonSelector);
      if (editButton) {
        editButton.click();

        // Wait for the modal to open
        waitForElement('.dialog-desktop-container.desktop-dialog-open [class^="container"] [class^="dropdownWrapper-"]', () => {
          const dropdown = document.querySelector('.dialog-desktop-container.desktop-dialog-open [class^="container"] [class^="dropdownWrapper-"]');
          if (dropdown) {
            dropdown.click();

            // Wait for the dropdown menu to open
            waitForElement('.dialog-desktop-container.desktop-dialog-open [class^="container"] [class^="dropdownWrapper-"] li:first-of-type', () => {
              const unlockOption = document.querySelector('.dialog-desktop-container.desktop-dialog-open [class^="container"] [class^="dropdownWrapper-"] li:first-of-type');
              if (unlockOption) {
                unlockOption.click();

                // Wait for the save button to be clickable
                waitForElement('.dialog-desktop-container.desktop-dialog-open:has([class^="container"] [class^="dropdownWrapper-"]) .desktop-dialog__footer.row.without-paddings button + button', () => {
                  const saveButton = document.querySelector('.dialog-desktop-container.desktop-dialog-open:has([class^="container"] [class^="dropdownWrapper-"]) .desktop-dialog__footer.row.without-paddings button + button');
                  if (saveButton) {
                    saveButton.click();

                    // Check for errors after saving
                    setTimeout(() => {
                      if (checkForErrors()) {
                        isSuspended = true;
                        console.log('Error detected. Auto-unlock suspended. Please edit manually and resume.');
                      } else {
                        // Store the unlocked playlist
                        const unlockedPlaylists = GM_getValue('unlockedPlaylists', []);
                        if (!unlockedPlaylists.includes(playlistId)) {
                          unlockedPlaylists.push(playlistId);
                                                    GM_setValue('unlockedPlaylists', unlockedPlaylists);
                        }

                        // Check for locked and private video items and delete them
                        checkAndDeleteLockedVideos();
                        checkAndDeletePrivateVideos();
                        checkAndDeleteErrorVideos();
                      }
                    }, 500); // Adjust timeout as needed
                  }
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error unlocking playlist:', error);
    }
  }

  // Function to handle manual editing
  function handleManualEditing() {
    isSuspended = false;
    unlockPlaylist();
  }

// Function to open all locked playlists in a new tab
function openLockedPlaylistsInNewTab(event) {
  event.preventDefault();
  event.stopPropagation();
  const lockedPlaylistLinks = document.querySelectorAll('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage main .width-wrap .user-content-section .side-column + .content-column [data-role="favorites-video-collections"] [class^="root-"] [class^="userCollection-"] a:has([id="lock"])');
  lockedPlaylistLinks.forEach((link, index) => {
    setTimeout(() => {
      link.dataset.autoOpened = 'true'; // Add a custom attribute
      link.classList.add('auto-opened-link'); // Add a custom class
      GM_openInTab(link.href, { active: false });
    }, index * 3000); // Delay opening each tab by 1 second
  });
}




  // Function to check and delete locked video items
  function checkAndDeleteLockedVideos() {
    const lockedVideoItems = document.querySelectorAll('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage[data-role="layoutPage"] main .width-wrap .user-content-section .side-column[data-role="nav"] + .content-column > [data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text)');
    lockedVideoItems.forEach((videoItem, index) => {
      setTimeout(() => {
        // Find the delete button
        const deleteButton = videoItem.querySelector('.video-thumb__trigger');
        if (deleteButton) {
          deleteButton.click();

          // Wait for the dropdown menu to open
          waitForElement('.xh-dropdown:has(.video-thumb__trigger) span', () => {
            const deleteOption = videoItem.querySelector('.xh-dropdown:has(.video-thumb__trigger) span');
            if (deleteOption) {
              deleteOption.click();

              // Wait for the save button to be clickable
              waitForElement('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]', () => {
                const saveButton = document.querySelector('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]');
                if (saveButton) {
                  saveButton.click();
                }
              });
            }
          });
        }
      }, index * 2000); // Delay processing each video item by 2 seconds
    });
  }

  // Function to check and delete private video items
  function checkAndDeletePrivateVideos() {
    const privateVideoItems = document.querySelectorAll('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage[data-role="layoutPage"] main .width-wrap .user-content-section .side-column[data-role="nav"] + .content-column > [data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text, .xh-icon.lock)');
    privateVideoItems.forEach((videoItem, index) => {
      setTimeout(() => {
        // Find the delete button
        const deleteButton = videoItem.querySelector('.video-thumb__trigger');
        if (deleteButton) {
          deleteButton.click();

          // Wait for the dropdown menu to open
          waitForElement('.xh-dropdown:has(.video-thumb__trigger) span', () => {
            const deleteOption = videoItem.querySelector('.xh-dropdown:has(.video-thumb__trigger) span');
            if (deleteOption) {
              deleteOption.click();

              // Wait for the save button to be clickable
                            waitForElement('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]', () => {
                const saveButton = document.querySelector('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]');
                if (saveButton) {
                  saveButton.click();
                }
              });
            }
          });
        }
      }, index * 2000); // Delay processing each video item by 2 seconds
    });
  }

  // Function to check and delete error video items
  function checkAndDeleteErrorVideos() {
    const errorVideoItems = document.querySelectorAll('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage[data-role="layoutPage"] main .width-wrap .user-content-section .side-column[data-role="nav"] + .content-column > [data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-image-container__status-text, .xh-icon.photo-error2)');
    errorVideoItems.forEach((videoItem, index) => {
      setTimeout(() => {
        // Find the delete button
        const deleteButton = videoItem.querySelector('.video-thumb__trigger');
        if (deleteButton) {
          deleteButton.click();

          // Wait for the dropdown menu to open
          waitForElement('.xh-dropdown:has(.video-thumb__trigger) span', () => {
            const deleteOption = videoItem.querySelector('.xh-dropdown:has(.video-thumb__trigger) span');
            if (deleteOption) {
              deleteOption.click();

              // Wait for the save button to be clickable
              waitForElement('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]', () => {
                const saveButton = document.querySelector('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]');
                if (saveButton) {
                  saveButton.click();
                }
              });
            }
          });
        }
      }, index * 2000); // Delay processing each video item by 2 seconds
    });
  }

   // NOT AVAIABLE
  // Function to check and delete Not Avaible video items
  function checkAndDeleteErrorVideos() {
    const errorVideoItems = document.querySelectorAll('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage[data-role="layoutPage"] main .width-wrap .user-content-section .side-column[data-role="nav"] + .content-column > [data-role="favorites-video-collections"] > [class*="isDesktop-"] > [class^="header-"] + .thumb-list.thumb-list--sidebar .thumb-list__item.video-thumb.video-thumb--type-video:has(.thumb-plug, #lock)');
    errorVideoItems.forEach((videoItem, index) => {
      setTimeout(() => {
        // Find the delete button
        const deleteButton = videoItem.querySelector('.video-thumb__trigger');
        if (deleteButton) {
          deleteButton.click();

          // Wait for the dropdown menu to open
          waitForElement('.xh-dropdown:has(.video-thumb__trigger) span', () => {
            const deleteOption = videoItem.querySelector('.xh-dropdown:has(.video-thumb__trigger) span');
            if (deleteOption) {
              deleteOption.click();

              // Wait for the save button to be clickable
              waitForElement('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]', () => {
                const saveButton = document.querySelector('.desktop-dialog.desktop-dialog--small.favorites-remove-collection .desktop-dialog__footer button[class*="color-brand-"]');
                if (saveButton) {
                  saveButton.click();
                }
              });
            }
          });
        }
      }, index * 2000); // Delay processing each video item by 2 seconds
    });
  }


  // Function to wait for an element to appear
  function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        callback();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Add the button to the page
  const button = document.createElement('button');
  button.textContent = 'Open All Locked Playlists in New Tab';
  button.className = 'OpenLockedPlaylists';
  button.style.margin = '10px';
  button.style.padding = '10px';
  button.style.backgroundColor = '#007bff';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', openLockedPlaylistsInNewTab);

  // Function to add button to page
  function addButton() {
    //const targetElement = document.querySelector('.user-page.favorites-page body .main-wrap[data-role="main-wrap"] .layoutPage main .width-wrap .user-content-section .side-column + .content-column [data-role="favorites-video-collections"] [class="separator-6f95e"] + [class^="root-"]:has([class^="userCollection-"]) header [class^="h4-bold-"]');
      // header:has(.xh-icon.playlists2) [class^="h4-bold-"]
      const targetElement = document.querySelector('header:has(.xh-icon.playlists2) [class^="h4-bold-"]');

    if (targetElement) {
      targetElement.parentNode.insertBefore(button, targetElement);
      console.log('Button added successfully.');
    } else {
      setTimeout(addButton, 1000); // Try again after 1 second
    }
  }

  addButton();

  // Call the function to unlock the playlist
  intervalId = setInterval(unlockPlaylist, 1000); // Call the function every second

  // Clean up interval when leaving the page
  window.onbeforeunload = function() {
    clearInterval(intervalId);
  };

  // Add an event listener for manual editing
  document.addEventListener('click', (event) => {
    if (event.target.matches('button[class*="saveButton-"]')) {
      handleManualEditing();
    }
  });

  // Add an event listener to detect when the user manually saves changes
  document.addEventListener('click', (event) => {
    if (event.target.matches('button[class*="saveButton-"]')) {
      setTimeout(() => {
        if (!checkForErrors()) {
          handleManualEditing();
        } else {
          console.log('Manual save detected but errors found. Please correct and try again.');
        }
      }, 500); // Adjust timeout as needed
    }
  });

  // Prevent navigation away from the playlist page when opening new tabs
  document.addEventListener('click', (event) => {
    if (event.target.matches('.OpenLockedPlaylists')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
})();