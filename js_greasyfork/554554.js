// ==UserScript==
// @name         EKW → Jeden PDF
// @namespace    https://twoja-kancelaria/
// @version      3.4.0
// @description  Pobiera wszystkie działy KW w jednym PDF
// @match        https://przegladarka-ekw.ms.gov.pl/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554554/EKW%20%E2%86%92%20Jeden%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/554554/EKW%20%E2%86%92%20Jeden%20PDF.meta.js
// ==/UserScript==
 
(function () {
  if (window.top !== window.self) return;
 
  const BTN_ID = "ekw-pdf-btn";
 
  const style = document.createElement("style");
  style.textContent = `
    #${BTN_ID}{
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
      padding: 10px 14px; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,.2);
      background: #0b5ed7; color: #fff; font-weight: 600; cursor: pointer; border: 0;
    }
    #${BTN_ID}:hover { background: #0a52c0; }
    #${BTN_ID}:disabled { background: #6c757d; cursor: not-allowed; }
    @media print { #${BTN_ID}{ display:none !important; } }
  `;
  document.documentElement.appendChild(style);
 
  if (!document.getElementById(BTN_ID)) {
    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.textContent = "Pobierz KW jako PDF";
    document.body.appendChild(btn);
 
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Pobieranie...";
      try {
        await buildAndPrint(btn);
      } catch (err) {
        console.error("Błąd:", err);
        alert("Błąd: " + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Pobierz KW jako PDF";
      }
    });
  }
 
  function extractKWNumber() {
    const h2 = document.querySelector('h2');
    if (h2) {
      const match = h2.textContent.match(/NR\s+([A-Z0-9/]+)/);
      if (match) return match[1].replace(/\//g, '-');
    }
    return "NIEZNANY";
  }
 
  function today() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const hh = String(d.getHours()).padStart(2,"0");
    const min = String(d.getMinutes()).padStart(2,"0");
    return `z dnia ${yyyy}-${mm}-${dd} o godz ${hh}-${min}`;
  }
 
  function todayFormatted() {
    const d = new Date();
    const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
                    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  }
 
  function todayTime() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    return `${hh}:${mm}`;
  }
 
  function loadSectionInIframe(dzialValue) {
    return new Promise((resolve, reject) => {
      const forms = Array.from(document.querySelectorAll('#nawigacja form'));
      const form = forms.find(f => {
        const input = f.querySelector('input[name="dzialKsiegi"]');
        return input && input.value === dzialValue;
      });
 
      if (!form) {
        reject(new Error(`Nie znaleziono formularza dla ${dzialValue}`));
        return;
      }
 
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
 
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error(`Timeout przy ładowaniu ${dzialValue}`));
      }, 15000);
 
      iframe.onload = function() {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const content = iframeDoc.querySelector('#contentDzialu');
 
          if (content) {
            clearTimeout(timeout);
            const cloned = content.cloneNode(true);
            document.body.removeChild(iframe);
            resolve(cloned);
          } else {
            clearTimeout(timeout);
            document.body.removeChild(iframe);
            reject(new Error('Nie znaleziono #contentDzialu w iframe'));
          }
        } catch (err) {
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          reject(err);
        }
      };
 
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const clonedForm = form.cloneNode(true);
 
      iframeDoc.body.appendChild(clonedForm);
      clonedForm.submit();
    });
  }
 
  async function buildAndPrint(btn) {
    const dzialy = [
      {name: 'Dział I-O', value: 'DIO'},
      {name: 'Dział I-Sp', value: 'DIS'},
      {name: 'Dział II', value: 'DII'},
      {name: 'Dział III', value: 'DIII'},
      {name: 'Dział IV', value: 'DIV'}
    ];
 
    const sections = [];
 
    for (const dzial of dzialy) {
      btn.textContent = `Pobieranie ${dzial.name}...`;
      const content = await loadSectionInIframe(dzial.value);
      sections.push({label: dzial.name, content: content});
    }
 
    const kw = extractKWNumber();
    const filename = `${kw} ${today()}`;
 
    const win = window.open("", "_blank");
    if (!win) {
      alert("Odblokuj popupy dla tej strony!");
      return;
    }
 
    const linkStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => `<link rel="stylesheet" href="${link.href}">`)
      .join('\n');
 
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  ${linkStyles}
  <style>
    @page { margin: 15mm; size: A4; }
    @media screen {
      body {
        background: #1e3a5f;
        color: white;
        padding: 20px;
        font-family: Arial, sans-serif;
        max-width: 210mm;
        margin: 0 auto;
      }
      .pdf-header {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
      }
      .pdf-header h1 {
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0;
        color: white;
      }
      .pdf-header p {
        font-size: 14px;
        margin: 5px 0;
        color: white;
      }
      .section-wrapper {
        margin: 30px 0;
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0 0 20px 0;
        padding: 10px;
        background: rgba(255,255,255,0.1);
        border-left: 4px solid #0b5ed7;
        color: white;
      }
      .section-separator {
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,0.4);
        margin: 40px 0;
        border: none;
        display: block;
      }
      table.tbOdpis {
        background: white;
        color: black;
      }
    }
    @media print {
      body {
        background: white !important;
        color: black !important;
        padding: 0;
        max-width: 100%;
      }
      .pdf-header {
        background: #f8f9fa !important;
        padding: 15px;
        border: 2px solid #dee2e6;
        margin-bottom: 20px;
      }
      .pdf-header h1 {
        color: black !important;
      }
      .pdf-header p {
        color: black !important;
      }
      .section-wrapper {
        margin: 20px 0;
        background: transparent !important;
        padding: 0;
      }
      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 0;
        padding: 8px;
        background: #f0f0f0 !important;
        border-left: 4px solid #0b5ed7;
        color: black !important;
        page-break-after: avoid;
      }
      .section-separator {
        width: 100%;
        height: 2px;
        background: #000 !important;
        margin: 30px 0;
        border: none;
        display: block;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <h1>KSIĘGA WIECZYSTA NR ${kw.replace(/-/g, '/')}</h1>
    <p>Pobrano: ${todayFormatted()} ${todayTime()}</p>
  </div>
</body>
</html>`);
 
    const body = win.document.body;
 
    sections.forEach((sec, index) => {
      if (index > 0) {
        const separator = win.document.createElement('div');
        separator.className = 'section-separator';
        body.appendChild(separator);
      }
 
      const wrapper = win.document.createElement('div');
      wrapper.className = 'section-wrapper';
 
      const title = win.document.createElement('div');
      title.className = 'section-title';
      title.textContent = sec.label;
 
      wrapper.appendChild(title);
      wrapper.appendChild(sec.content);
      body.appendChild(wrapper);
    });
 
    win.document.close();
 
    setTimeout(() => {
      win.focus();
      win.print();
    }, 1000);
  }
})();