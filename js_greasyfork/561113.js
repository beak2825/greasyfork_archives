// ==UserScript==
// @name        Cuberealm.io COOL-RAY XRAY SCRIPT
// @namespace   cooluser1481
// @match       https://cuberealm.io/*
// @version     1.0.1
// @author      cooluser1481
// @description A super simple and safe xray script
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/561113/Cuberealmio%20COOL-RAY%20XRAY%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/561113/Cuberealmio%20COOL-RAY%20XRAY%20SCRIPT.meta.js
// ==/UserScript==

(function() {
    const createOnceExecutor = (function() {
  let isFirstCall = true;
  return function(context, func) {
    const wrapper = isFirstCall
      ? function() {
        if (func) {
          const result = func.apply(context, arguments);
          func = null;
          return result;
        }
      }
      : function() {};
    isFirstCall = false;
    return wrapper;
  };
})();

const createWrapper = (function() {
  let isFirstCall = true;
  return function(context, func) {
    const wrapper = isFirstCall
      ? function() {
        if (func) {
          const result = func.apply(context, arguments);
          func = null;
          return result;
        }
      }
      : function() {};
    isFirstCall = false;
    return wrapper;
  };
})();

let webSocketLoaded = false;
// Array of block IDs to replace
const blocksToReplace = [4, 6, 9, 10];
const replacementBlockId = 78;

const webSocketProxy = new Proxy(window.WebSocket, {
  construct(target, args) {
    const ws = new target(...args);

    setTimeout(() => {
      showToast('COOLUSSR XRAY LOADED');
    }, 500);

    webSocketLoaded = true;

    ws.addEventListener('message', (event) => {
      const dataView = new DataView(event.data);

      if (dataView.getUint8(0) !== 17) {
        return;
      }

      switch (dataView.getUint8(1)) {
        case 1: {
          let offset = 16;
          if (dataView.getUint8(offset++) > 0) {
            const length = dataView.getUint16(offset);
            offset += 2;

            for (let i = 0; i < length; i++) {
              offset += 2;
              const currentBlockId = dataView.getUint16(offset);
              if (blocksToReplace.includes(currentBlockId)) {
                dataView.setUint16(offset, replacementBlockId);
              }
              offset += 2;
            }
          } else {
            for (let i = 0; i < 32768; i++) {
              const currentBlockId = dataView.getUint16(offset);
              if (blocksToReplace.includes(currentBlockId)) {
                dataView.setUint16(offset, replacementBlockId);
              }
              offset += 2;
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    });

    return ws;
  },
});
window.WebSocket = webSocketProxy;

const cssLink = {
  rel: 'stylesheet',
  type: 'text/css',
  href: 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
};
document.head.appendChild(
  Object.assign(document.createElement('link'), cssLink)
);

const scriptTag = {
  type: 'text/javascript',
  src: 'https://cdn.jsdelivr.net/npm/toastify-js',
};
document.head.appendChild(
  Object.assign(document.createElement('script'), scriptTag)
);

const showToast = (message) => {
  try {
    const toastConfig = {
      text: message,
      duration: 5000,
      gravity: 'top',
      close: true,
      position: 'center',
      backgroundColor:
        'linear-gradient(138deg, #009EFFFF, #39FF4AFF)',
    };
    window.Toastify(toastConfig).showToast();
  } catch {}
};

setTimeout(() => {
  showToast('coolussr xray enabled!'.toUpperCase());
}, 500);

setTimeout(() => {
  if (!webSocketLoaded && location.hash.startsWith('#')) {
    showToast('Failed to load xray, try reloading the tab.');
  }
}, 5000);
})();