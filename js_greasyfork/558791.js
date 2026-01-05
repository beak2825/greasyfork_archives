// ==UserScript==
// @name         Auto Jawab Kuisioner Cetak ETS/EAS UPN "Veteran" Jawa Timur
// @version      1.0
// @description  Otomatis memilih jawaban kuisioner (tidak termasuk memilih dosen favorit)
// @author       @mrhuwaidi
// @match        https://registrasi.upnjatim.ac.id/lp3m/html/lp3m/*
// @grant        none
// @icon         https://upnjatim.ac.id/favicon.ico
// @icon64       https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://upnjatim.ac.id/&size=64
// @namespace https://greasyfork.org/users/1536475
// @downloadURL https://update.greasyfork.org/scripts/558791/Auto%20Jawab%20Kuisioner%20Cetak%20ETSEAS%20UPN%20%22Veteran%22%20Jawa%20Timur.user.js
// @updateURL https://update.greasyfork.org/scripts/558791/Auto%20Jawab%20Kuisioner%20Cetak%20ETSEAS%20UPN%20%22Veteran%22%20Jawa%20Timur.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const pilihan = [
    { value: 'Setuju', prob: 0.5 },
    { value: 'Sangat Setuju', prob: 0.4 },
    { value: 'Kurang Setuju', prob: 0.1 }
  ];

  function pilihDenganProbabilitas() {
    const rand = Math.random();
    let total = 0;
    for (const item of pilihan) {
      total += item.prob;
      if (rand < total) {
        return item.value;
      }
    }
    return pilihan[0].value;
  }

  function jawabPerTd() {
    const tds = document.querySelectorAll('td');

    tds.forEach(td => {
      const radios = td.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        const targetValue = pilihDenganProbabilitas();
        let dipilih = false;

        radios.forEach(radio => {
          if (!dipilih && radio.value === targetValue) {
            radio.checked = true;
            dipilih = true;
          }
        });
      }
    });
  }

  window.addEventListener('load', () => {
    setTimeout(jawabPerTd, 1000);
  });
})();