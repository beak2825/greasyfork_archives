// ==UserScript==
// @name         Slash Key Local Accelerator
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Accelerate timers when holding the Backslash key
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556007/Slash%20Key%20Local%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/556007/Slash%20Key%20Local%20Accelerator.meta.js
// ==/UserScript==

(function () {
  const key = '__accel__';
  let accelFactor = +localStorage.getItem(key) || 5;
  let slashPressed = false;

  const originalTimeout = window.setTimeout;
  const originalInterval = window.setInterval;

  // Dynamic setInterval: checks key state before each iteration
  window.setInterval = (fn, delay) => {
    let id;
    function runner() {
      fn();
      const factor = slashPressed ? accelFactor : 1;
      id = originalTimeout(runner, delay / factor);
    }
    id = originalTimeout(runner, delay);
    return id;
  };

  // Dynamic setTimeout: applies factor at creation
  window.setTimeout = (fn, delay) => {
    const factor = slashPressed ? accelFactor : 1;
    return originalTimeout(fn, delay / factor);
  };

  // Listen for Backslash key
  window.addEventListener('keydown', e => {
    if (e.code === 'Backslash') slashPressed = true;
  });
  window.addEventListener('keyup', e => {
    if (e.code === 'Backslash') slashPressed = false;
  });

  // Settings panel
  window.addEventListener('load', () => {
    const tab = Object.assign(document.createElement('div'), {
      textContent: '⏱', title: 'Set acceleration factor'
    });
    Object.assign(tab.style, {
      position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)',
      width: '20px', height: '60px', background: '#444', color: '#fff',
      textAlign: 'center', lineHeight: '60px', cursor: 'pointer',
      borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px',
      zIndex: 99998, fontSize: '16px', opacity: 0.6
    });
    document.body.appendChild(tab);

    const box = document.createElement('div');
    box.innerHTML = `
      <input id="factor" type="number" placeholder="${accelFactor}" style="width:100%;margin-bottom:6px;">
      <button style="width:100%;">Save</button>
      <div style="font-size:11px;color:#ccc;margin-top:4px;text-align:center;">
        Hold \\ key to accelerate
      </div>
    `;
    Object.assign(box.style, {
      position: 'fixed', top: '50%', right: '-160px', transform: 'translateY(-50%)',
      width: '140px', background: '#222', color: '#fff', padding: '8px',
      borderRadius: '8px 0 0 8px', fontFamily: 'sans-serif', fontSize: '13px',
      boxShadow: '0 0 6px rgba(0,0,0,0.3)', transition: 'right 0.3s ease',
      zIndex: 99999
    });
    document.body.appendChild(box);

    tab.onclick = () => {
      box.style.right = box.style.right === '0px' ? '-160px' : '0px';
    };

    box.querySelector('button').onclick = () => {
      const val = parseInt(box.querySelector('#factor').value, 10);
      if (val > 0) {
        localStorage.setItem(key, val);
        accelFactor = val;
        alert(`✔ Acceleration factor ${val} saved. Refresh the page.`);
        box.style.right = '-160px';
      }
    };
  });
})();
