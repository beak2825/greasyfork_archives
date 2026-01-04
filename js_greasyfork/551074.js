// ==UserScript==
// @name            Memoiren des rebus
// @version         1.0
// @license         All Rights Reserved
// @author          Fan
// @namespace       Fan
// @description     Die unvergesslichen Momente des 2. Chefs
// @require         https://cdn.jsdelivr.net/npm/croner@9/dist/croner.umd.js
// @match           https://*.leitstellenspiel.de
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/551074/Memoiren%20des%20rebus.user.js
// @updateURL https://update.greasyfork.org/scripts/551074/Memoiren%20des%20rebus.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  if (!csrfToken) {
    return;
  }

  new Cron('0 18 * * *', {protect:true}, async () => {
    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('authenticity_token', csrfToken);
    formData.append('alliance_chat[message]', '@all nabend Verband');

    await fetch('/alliance_chats', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams(formData)
    });
  });
})();
