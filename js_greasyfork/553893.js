// ==UserScript==
// @name         DSL Line Health Monitor (Simple Version)
// @namespace    https://waleedkamal.dev/
// @version      1.0.0
// @description  Shows your DSL line health in simple terms with color-coded status and clear explanations for everyday users
// @author       Waleed Kamal
// @match        *://192.168.1.1/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/4e/DSL_icon.svg
// @homepage     https://github.com/waleedkamal
// @supportURL   https://github.com/waleedkamal/issues
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553893/DSL%20Line%20Health%20Monitor%20%28Simple%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553893/DSL%20Line%20Health%20Monitor%20%28Simple%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_URL = 'https://192.168.1.1/api/ntwk/dslinfo';

  // Evaluate and explain each DSL metric
  const evaluate = (key, value) => {
    if (key.includes('Margin')) {
      if (value >= 9)
        return { text: 'Excellent', color: 'lime', desc: 'Your signal is clean and stable.' };
      if (value >= 6)
        return { text: 'Fair', color: 'orange', desc: 'Might experience minor drops occasionally.' };
      return { text: 'Poor', color: 'red', desc: 'Expect frequent disconnections or slow internet.' };
    }
    if (key.includes('Attenuation')) {
      if (value <= 20)
        return { text: 'Excellent', color: 'lime', desc: 'Strong line, very close to exchange.' };
      if (value <= 30)
        return { text: 'Good', color: 'orange', desc: 'Some signal loss, but still fine.' };
      return { text: 'Weak', color: 'red', desc: 'High loss — far from exchange or old cables.' };
    }
    if (key.includes('CurrRate')) {
      if (value >= 20000)
        return { text: 'Very Fast', color: 'lime', desc: 'High-speed VDSL connection.' };
      if (value >= 8000)
        return { text: 'Moderate', color: 'orange', desc: 'Average speed, acceptable performance.' };
      return { text: 'Slow', color: 'red', desc: 'Below normal, possible line or noise issue.' };
    }
    return { text: '-', color: 'gray', desc: '' };
  };

  // Create floating info panel
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '10px';
  panel.style.right = '10px';
  panel.style.background = 'rgba(0,0,0,0.85)';
  panel.style.color = 'white';
  panel.style.padding = '14px';
  panel.style.borderRadius = '12px';
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.zIndex = 99999;
  panel.style.maxWidth = '320px';
  panel.style.fontSize = '13px';
  panel.style.lineHeight = '1.5';
  panel.textContent = 'Checking DSL status...';
  document.body.appendChild(panel);

  // Fetch DSL info from router API
  fetch(API_URL, { method: 'GET' })
    .then(res => res.text())
    .then(text => {
      // Remove "while(1);" prefix and parse JSON safely
      const jsonText = text.replace(/^while\s*\(1\)\s*;\s*\/\*/, '').replace(/\*\/$/, '');
      const data = JSON.parse(jsonText);

      let html = `<b style="font-size:14px;">📡 DSL Line Report</b><br>`;
      html += `<b>Status:</b> ${data.Status}<br>`;
      html += `<b>Mode:</b> ${data.Modulation}<br><hr style="border:0.5px solid #555;">`;

      const keys = [
        'DownMargin',
        'UpMargin',
        'DownAttenuation',
        'UpAttenuation',
        'DownCurrRate',
        'UpCurrRate'
      ];
      let warnings = [];

      for (const key of keys) {
        const val = data[key];
        const s = evaluate(key, val);
        html += `<div><b>${key.replace('Down', 'Downstream ').replace('Up', 'Upstream ')}</b>: 
                  <span style="color:${s.color}">${val}</span> dB 
                  <span style="color:${s.color}">(${s.text})</span><br>
                  <i style="color:#ccc">${s.desc}</i></div><br>`;
        if (s.color === 'red' || s.color === 'orange') warnings.push(`${key} = ${s.text}`);
      }

      html += '<hr style="border:0.5px solid #555;">';

      if (warnings.length === 0) {
        html += `<b style="color:lime">✅ Your DSL line is healthy and stable.</b><br>
                 <i>You should enjoy smooth browsing, streaming, and gaming.</i>`;
      } else if (warnings.some(w => w.includes('red'))) {
        html += `<b style="color:red">⚠️ Serious line issues detected.</b><br>
                 <i>Possible causes: old cables, noisy phone line, bad splitter, or distance from the exchange.<br>
                 Effects: slow speed, buffering, or frequent disconnects.</i>`;
      } else {
        html += `<b style="color:orange">⚠️ Your line is borderline.</b><br>
                 <i>You might notice slower speeds or brief drops during busy hours.<br>
                 Try replacing the splitter or checking phone cables.</i>`;
      }

      panel.innerHTML = html;
    })
    .catch(err => {
      panel.textContent = '⚠️ Error: Unable to fetch DSL info.';
      console.error(err);
    });
})();
