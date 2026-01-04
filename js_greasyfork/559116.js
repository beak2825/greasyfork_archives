// ==UserScript==
// @name         fuckRegionTelepo
// @match        https://ff14bjz.sdo.com/RegionKanTelepo
// @run-at       document-start
// @description  No More 陆行鸟 火爆
// @version      0.0.1
// @license      MIT
// @namespace https://greasyfork.org/users/1548623
// @downloadURL https://update.greasyfork.org/scripts/559116/fuckRegionTelepo.user.js
// @updateURL https://update.greasyfork.org/scripts/559116/fuckRegionTelepo.meta.js
// ==/UserScript==

(function () {
  const script = document.createElement('script');
  script.textContent = `
    (function () {
      const originalFetch = window.fetch;
      //console.log('[PAGE] fetch hook installed');

      window.fetch = async function (...args) {
        const resp = await originalFetch.apply(this, args);

        try {
          const input = args[0];
          const url = input instanceof Request ? input.url : input;

          // 命中目标 API
          if (typeof url === 'string' && url.includes('queryGroupListTravelTarget')) {
            //console.log('[PAGE] target fetch hit:', url);

            const clone = resp.clone();
            const text = await clone.text();

            //console.log('[PAGE] raw response:', text);

            const json = JSON.parse(text);

            if (
              json &&
              json.data &&
              typeof json.data.groupList === 'string'
            ) {
              const list = JSON.parse(json.data.groupList);

              if (Array.isArray(list)) {
                list.forEach(g => {
                  if (g.state === 2 || g.state === 1) {
                    g.state = 0; // <===
                  }
                });

                json.data.groupList = JSON.stringify(list);

                //console.log('[PAGE] modified groupList:', list);

                return new Response(JSON.stringify(json), {
                  status: resp.status,
                  headers: resp.headers
                });
              }
            }
          }
        } catch (e) {
          //console.error('[PAGE] fetch hook error:', e);
        }

        return resp;
      };
    })();
  `;

  document.documentElement.appendChild(script);
  script.remove();
})();
