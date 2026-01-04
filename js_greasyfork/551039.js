// ==UserScript==
// @name         Chaturbate Chat, PM and User enter/leave Notifier for streamers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blink/show a frame when having unread PM, unread Chats (main chat) or when user enter or leaves a streamers room. With setting window that can toggle them on or off
// @author       Brsrk
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=32&domain=chaturbate.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @match        https://chaturbate.com/b/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/551039/Chaturbate%20Chat%2C%20PM%20and%20User%20enterleave%20Notifier%20for%20streamers.user.js
// @updateURL https://update.greasyfork.org/scripts/551039/Chaturbate%20Chat%2C%20PM%20and%20User%20enterleave%20Notifier%20for%20streamers.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define the specific text to monitor
  const monitorText = {
    before1: 'CHAT', // text to look for
    after1: 'CHAT \\(\\d+\\)', // regex pattern to match "CHAT (any number)"
    before2: 'PM', // text to look for
    after2: 'PM \\(\\d+\\)', // regex pattern to match "PM (any number)"
    before3: 'USERS', // text to look for
    after3: 'USERS \\(\\d+\\)', // regex pattern to match "USERS (any number)"
  };

  let previousTextContent = '';
  let previousUserCount = '';
  let blinkingBox = null;
  let blinkingFrame = null;
  let userBlinkingFrame = null;
  let titleBlinkInterval = null;
  let originalTitle = document.title;

  // Load settings from local storage
  let settings = {
    pmNotifications: GM_getValue('pmNotifications', true),
    userNotifications: GM_getValue('userNotifications', true),
    chatNotifications: GM_getValue('chatNotifications', true),
  };

  // Add CSS for blinking effect and settings menu
  const style = document.createElement('style');
  style.textContent = `
    #blinking-frame {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 10px solid red;
      animation: blink 1s infinite;
      z-index: 9999;
      pointer-events: none;
      box-sizing: border-box;
    }
    #user-blinking-frame-green {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 5px solid green;
      animation: blink-green 5s;
      z-index: 9997;
      pointer-events: none;
      box-sizing: border-box;
    }
    #user-blinking-frame-orange {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 2px solid orange;
      animation: blink-orange 5s;
      z-index: 9998;
      pointer-events: none;
      box-sizing: border-box;
    }
    @keyframes blink {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes blink-green {
      0% {
        opacity: 1;
      }
      20% {
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
      60% {
        opacity: 0;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes blink-orange {
      0% {
        opacity: 1;
      }
      20% {
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
      60% {
        opacity: 0;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    #settings-menu {
      position: fixed;
      top: 20px;
      right: 10px;
      background-color: #fff;
      padding: 10px;
      border: 1px solid #ddd;
      z-index: 10000;
      display: none;
    }
    #settings-menu-close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 5px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Create settings menu
  const settingsMenu = document.createElement('div');
  settingsMenu.id = 'settings-menu';
  settingsMenu.innerHTML = `
    <div id="settings-menu-close">X</div>
    <label><input type="checkbox" id="chat-notifications" ${settings.chatNotifications ? 'checked' : ''}> Main Chat Notifications</label><br>
    <label><input type="checkbox" id="pm-notifications" ${settings.pmNotifications ? 'checked' : ''}> PM Notifications</label><br>
    <label><input type="checkbox" id="user-notifications" ${settings.userNotifications ? 'checked' : ''}> User enter/leave Notification Frame</label>
  `;
  document.body.appendChild(settingsMenu);

  // Add event listeners to settings menu
  document.getElementById('pm-notifications').addEventListener('change', (e) => {
    settings.pmNotifications = e.target.checked;
    GM_setValue('pmNotifications', settings.pmNotifications);
  });
  document.getElementById('user-notifications').addEventListener('change', (e) => {
    settings.userNotifications = e.target.checked;
    GM_setValue('userNotifications', settings.userNotifications);
  });
  document.getElementById('chat-notifications').addEventListener('change', (e) => {
    settings.chatNotifications = e.target.checked;
    GM_setValue('chatNotifications', settings.chatNotifications);
  });
  document.getElementById('settings-menu-close').addEventListener('click', () => {
    settingsMenu.style.display = 'none';
  });

  // Register menu command
  GM_registerMenuCommand('Settings', () => {
    settingsMenu.style.display = 'block';
  });

  // Function to check for text changes
  function checkForChanges() {
    const textContent = document.body.textContent;

    if (textContent !== previousTextContent) {
      previousTextContent = textContent;

      // Check if the text content matches any of the after regex patterns
      const match1 = new RegExp(monitorText.after1).test(textContent);
      const match2 = new RegExp(monitorText.after2).test(textContent);
      const match3 = new RegExp(monitorText.after3).test(textContent);

      if ((match1 && settings.chatNotifications) || (match2 && settings.pmNotifications)) {
        // Show the blinking box and frame
        showBlinkingFrame();
      } else {
        // Hide the blinking box and frame
        hideBlinkingFrame();
      }

      // Blink page title (?)
      if (match2 && settings.pmNotifications) {
        blinkTitle('- ');
      } else {
        stopBlinkingTitle();
        document.title = originalTitle;
      }

      if (match3 && settings.userNotifications) {
        const userCountMatch = textContent.match(/USERS \((\d+)\)/);
        if (userCountMatch && userCountMatch[1] !== previousUserCount) {
          const currentUserCount = parseInt(userCountMatch[1]);
          if (previousUserCount !== '') {
            showUserBlinkingFrame(currentUserCount > parseInt(previousUserCount));
          }
          previousUserCount = userCountMatch[1];
        }
      }
    }
  }

  // Function to show the blinking frame
  function showBlinkingFrame() {
    if (!blinkingFrame) {
      blinkingFrame = document.createElement('div');
      blinkingFrame.id = 'blinking-frame';
      document.body.appendChild(blinkingFrame);
    }
  }

  // Function to hide the blinking frame
  function hideBlinkingFrame() {
    if (blinkingFrame) {
      blinkingFrame.remove();
      blinkingFrame = null;
    }
  }

  // Function to show the user blinking frame
  function showUserBlinkingFrame(increased) {
    if (userBlinkingFrame) {
      userBlinkingFrame.remove();
    }
    userBlinkingFrame = document.createElement('div');
    userBlinkingFrame.id = increased ? 'user-blinking-frame-green' : 'user-blinking-frame-orange';
    document.body.appendChild(userBlinkingFrame);
    setTimeout(() => {
      userBlinkingFrame.remove();
    }, 5000);
  }

  function blinkTitle(prefix) {
    stopBlinkingTitle();
    let visible = true;
    titleBlinkInterval = setInterval(() => {
      if (visible) {
        document.title = originalTitle;
        visible = false;
      } else {
        document.title = prefix + originalTitle;
        visible = true;
      }
    }, 1000);
  }

  function stopBlinkingTitle() {
    if (titleBlinkInterval) {
      clearInterval(titleBlinkInterval);
      titleBlinkInterval = null;
    }
  }

  // Continuously check for changes
  setInterval(checkForChanges, 1000); // Check every 1 second
})();