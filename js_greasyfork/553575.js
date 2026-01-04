// ==UserScript==
// @name        zmiana_rozdzielczosci_firefox
// @namespace   r-a-y/browser/screen
// @description Alters attempts at fingerprinting your screen resolution. Compatible with Firefox via script injection.
// @include     *
// @version     1.2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/553575/zmiana_rozdzielczosci_firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/553575/zmiana_rozdzielczosci_firefox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const adresy = [
    "screenresolutiontest.com",
    "sklep.kaufland.pl",
    "leaflets.kaufland.com",
    "google.pl",
    "google.com",
    "lotto.pl",
    "www.lotto.pl",
    "lotto.com",
    "www.lotto.com"
  ];

  const url = "" + window.location;
  const containsUrl = adresy.some(adres => url.includes(adres));
  if (containsUrl) return;

  const resolutions = [
    { width: 1920, height: 1080, chance: 23 },
    { width: 1650, height: 1080, chance: 14 },
    { width: 1920, height: 1200, chance: 10 },
    { width: 2560, height: 1440, chance: 6 },
    { width: 2560, height: 1600, chance: 4 },
    { width: 3840, height: 2160, chance: 3 },
    { width: 1600, height: 1200, chance: 5 },
    { width: 1600, height: 900, chance: 5 },
    { width: 1440, height: 900, chance: 5 },
    { width: 1400, height: 1050, chance: 5 },
    { width: 1366, height: 768, chance: 10 },
    { width: 1280, height: 768, chance: 4 },
    { width: 1024, height: 600, chance: 2 },
    { width: 1280, height: 800, chance: 3 },
    { width: 800, height: 600, chance: 1 }
  ];

  function weightedRandom(options) {
    const total = options.reduce((sum, opt) => sum + opt.chance, 0);
    let rand = Math.random() * total;
    for (let opt of options) {
      if (rand < opt.chance) return opt;
      rand -= opt.chance;
    }
    return options[0];
  }

  function getCookie(cname) {
    try {
      let name = cname + "=";
      let ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length);
        }
      }
    } catch (e) {}
    return "";
  }

  // wybór rozdzielczości w sandbox (Tampermonkey)
  let selectedResolution;
  const cookieVal = getCookie('resolution');
  if (cookieVal) {
    try { selectedResolution = JSON.parse(cookieVal); } catch (e) { selectedResolution = null; }
  }
  if (!selectedResolution) {
    selectedResolution = weightedRandom(resolutions);
    // ustaw ciasteczko na poziomie strony (wstrzyknięty skrypt też ustawi, ale ustawiamy tu by mieć trwałość)
    try { document.cookie = "resolution=" + JSON.stringify(selectedResolution) + "; path=/"; } catch (e) {}
  }

  // wstrzyknięcie skryptu do kontekstu strony z osadzoną wartością selectedResolution
  const injected = `
    (function() {
      try {
        const randomResolution = ${JSON.stringify(selectedResolution)};
        // zabezpieczenia: próby nadpisania tylko jeśli możliwe
        function safeDefine(obj, prop, getter) {
          try {
            Object.defineProperty(obj, prop, { get: getter, configurable: true });
          } catch (e) {
            try {
              // fallback: nadpisanie przy użyciu __defineGetter__ (starsze silniki)
              if (obj && obj.__defineGetter__) obj.__defineGetter__(prop, getter);
            } catch (err) {}
          }
        }

        // screen
        if (window && window.screen) {
          safeDefine(window.screen, 'width', function() { return randomResolution.width; });
          safeDefine(window.screen, 'height', function() { return randomResolution.height; });
          safeDefine(window.screen, 'availWidth', function() { return randomResolution.width; });
          safeDefine(window.screen, 'availHeight', function() { return randomResolution.height; });
        }

        // window sizes
        safeDefine(window, 'innerWidth', function() { return randomResolution.width; });
        safeDefine(window, 'innerHeight', function() { return randomResolution.height; });
        safeDefine(window, 'outerWidth', function() { return randomResolution.width; });
        safeDefine(window, 'outerHeight', function() { return randomResolution.height; });

        // devicePixelRatio
        safeDefine(window, 'devicePixelRatio', function() { return 1; });

        // zapisz cookie w kontekście strony (zapewnia trwałość też dla skryptów strony)
        try { document.cookie = "resolution=" + JSON.stringify(randomResolution) + "; path=/"; } catch (e) {}

      } catch (e) {}
    })();`;

  const script = document.createElement('script');
  script.textContent = injected;
  // wstaw jak najwcześniej
  const root = document.documentElement || document.head || document.body;
  if (root) {
    try { root.prepend(script); } catch (e) { (document.head||document.documentElement||document.body).appendChild(script); }
    // usuń tag, nie potrzebny po wykonaniu
    setTimeout(() => { script.parentNode && script.parentNode.removeChild(script); }, 50);
  } else {
    // fallback: append later
    (document.head || document.documentElement || document.body || document).appendChild(script);
    setTimeout(() => { script.parentNode && script.parentNode.removeChild(script); }, 50);
  }

})();
