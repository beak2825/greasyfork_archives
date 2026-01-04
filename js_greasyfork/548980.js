// ==UserScript==
// @name        IRT Teleportation Utils
// @description For those who have the tow truck keys
// @namespace   me.netux.site/user-scripts/irt-crschmidt/tow-truckers
// @match       https://irt.crschmidt.net/admin-tele.html
// @match       https://internet-roadtrip.neal.fun/
// @grant       unsafeWindow
// @grant       GM_getValue
// @version     1.0
// @author      Netux
// @downloadURL https://update.greasyfork.org/scripts/548980/IRT%20Teleportation%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/548980/IRT%20Teleportation%20Utils.meta.js
// ==/UserScript==

(() => {
  if (location.hostname === 'irt.crschmidt.net') {
    const storedToken = GM_getValue('irtAdminToken');

    const headingEl = document.querySelector('#heading');
    headingEl.addEventListener('keypress', (event) => {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();

      const newHeading = eval(headingEl.value || '');
      if (Number.isNaN(newHeading)) {
        return;
      }

      headingEl.value = newHeading;
      carMarker.setRotation((newHeading + 90) % 360);
    });

    const tokenEl = document.querySelector('#token');
    tokenEl.type = 'password';
    if (storedToken) {
      tokenEl.value = storedToken;
    }

    unsafeWindow.setCommand = new Proxy(unsafeWindow.setCommand, {
      apply(ogSetCommand, thisArg, args) {
        const result = ogSetCommand.apply(thisArg, args);
        const command = document.getElementById("fetch_command").value;
        const irtWindow = window.open('https://internet-roadtrip.neal.fun', '_blank', { popup: true });
        setTimeout(() => {
          irtWindow.postMessage({
            mod: GM.info.script.namespace,
            type: 'execute',
            args: {
              command
            }
          }, 'https://internet-roadtrip.neal.fun');
        }, 1500);
        return result;
      }
    })
  } else if (location.hostname === 'internet-roadtrip.neal.fun') {
    unsafeWindow.addEventListener('message', (event) => {
      if (event.origin !== 'https://irt.crschmidt.net') {
        return;
      }

      if (event.data.mod !== GM.info.script.namespace) {
        return;
      }

      switch (event.data.type) {
        case 'execute': {
          const { command } = event.data.args;
          (async () => {
            try {
              const result = await unsafeWindow.eval(`(async () => {${command}})()`);
              console.info(result);
              window.close();
            } catch (error) {
              console.error(error);
            }
          })()
        }
      }
    });
  }
})();
