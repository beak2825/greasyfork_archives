// ==UserScript==
// @name         Jellyfin MPC Player
// @version      1.0
// @description  Allows playing local files in Media Player Classic from the Jellyfin web interface.
// @author       danegergo
// @match        http://localhost:8096/*
// @namespace https://greasyfork.org/users/1525707
// @downloadURL https://update.greasyfork.org/scripts/552408/Jellyfin%20MPC%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/552408/Jellyfin%20MPC%20Player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MPC_HC_URL = 'http://localhost:13579';
  const VIDEO_EXTENSIONS = [
    'mkv',
    'avi',
    'mov',
    'mp4',
    'm4v',
    'mpeg',
    'mpg',
    'wmv',
  ];
  const PLAY_BUTTON_SELECTORS =
    '[data-mode=play],[data-mode=resume],[data-action=resume]';

  const getPlayButtons = async () => {
    for (let i = 0; i < 10; ++i) {
      const buttons = document.querySelectorAll(PLAY_BUTTON_SELECTORS);
      if (buttons.length) return buttons;
      await new Promise((r) => setTimeout(r, 200));
    }
    return [];
  };

  const getUserId = async () => {
    return ApiClient.getCurrentUser()
      .then((r) => r.Id)
      .catch((e) => {
        console.error('Error fetching user:', e);
        return null;
      });
  };

  const getItem = async (userId, itemId) => {
    return ApiClient.getItem(userId, itemId).catch((e) => {
      console.error(`Error fetching item ${itemId}:`, e);
      return null;
    });
  };

  const removeDataAttributesAndListeners = (element) => {
    element.removeAttribute('data-mode');
    element.removeAttribute('data-action');

    const newElement = element.cloneNode(true);
    element.replaceWith(newElement);
    return newElement;
  };

  const getListItemId = (element) => {
    while (element && !element.hasAttribute('data-id')) {
      element = element.parentNode;
    }
    return element?.getAttribute('data-id') ?? null;
  };

  const playFileInMPC = async (itemId) => {
    const userId = await getUserId();
    if (!userId) return;

    const item = await getItem(userId, itemId);
    if (!item) return;

    const extension = item.Path.split('\\').pop().split('.').pop();
    const path = VIDEO_EXTENSIONS.includes(extension)
      ? item.Path
      : `${item.Path}\\BDMV\\index.bdmv`; // assume Blu-ray structure

    fetch(`${MPC_HC_URL}/browser.html?path=${encodeURIComponent(path)}`).catch(
      (error) => {
        console.error('HTTP request error:', error);
      }
    );
    console.log('Playing: ', path);
  };

  const attachPlayHandlers = async () => {
    console.log('Attaching MCP play handlers...');
    const buttons = await getPlayButtons();
    if (!buttons.length) {
      console.error('No play buttons found.');
      return;
    }

    const itemId = /id=(.*?)&serverId/.exec(window.location.hash)?.[1];
    if (!itemId) {
      // list view
      for (let button of buttons) {
        button = removeDataAttributesAndListeners(button);
        const itemId = getListItemId(button);
        if (!itemId) continue;

        button.addEventListener('click', (e) => {
          e.stopPropagation();
          playFileInMPC(itemId);
        });
      }
    } else {
      // details view
      for (let button of buttons) {
        button = removeDataAttributesAndListeners(button);
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          playFileInMPC(itemId);
        });
      }
    }

    console.log('MCP play handlers attached.');
  };

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    attachPlayHandlers();
    window.addEventListener('hashchange', attachPlayHandlers);
    window.addEventListener('viewshow', attachPlayHandlers);
  }
})();
