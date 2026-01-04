// ==UserScript==
// @name         T24 Close Popups (tracked only)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Đóng nhanh các popup/iframe T24 đã mở sau khi load script (Alt+X hoặc nút CLOSE POPUPS)
// @match        *://*/BrowserWeb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551433/T24%20Close%20Popups%20%28tracked%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551433/T24%20Close%20Popups%20%28tracked%20only%29.meta.js
// ==/UserScript==
(function () {
  'use strict';
  if (!window.name?.toLowerCase().includes('menu')) return;

  const tracked = [];

  // Hook window.open để theo dõi popup
  (function patchOpen(){
    const origOpen = window.open;
    window.open = function () {
      const w = origOpen.apply(this, arguments);
      try { if (w) tracked.push(w); } catch {}
      return w;
    };
  })();

  // Hàm đóng popup đã track
  function closeTracked() {
    let closed = 0;
    for (const w of tracked) {
      try {
        if (w && !w.closed) {
          w.close();
          closed++;
        }
      } catch {}
    }
    alert(`🔒 Đã đóng ${closed} cửa sổ phụ (chỉ track được sau khi script chạy).`);
  }

  // Nút UI
  const btn = document.createElement('button');
  btn.id = 'nut-close-popups';
  btn.textContent = 'CLOSE POPUPS';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '60px',
    left: '20px',
    zIndex: 99999,
    padding: '10px 14px',
    background: '#b91c1c',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,.3)',
    fontSize: '13px',
    width: '160px'
  });
  btn.onclick = closeTracked;
  document.body.appendChild(btn);

  // Phím tắt Alt+X
  document.addEventListener('keydown', (e)=>{
    if (e.altKey && e.key.toLowerCase()==='x') {
      e.preventDefault();
      closeTracked();
    }
  });

  console.log('✅ Close Popups sẵn sàng (Alt+X + nút).');
})();