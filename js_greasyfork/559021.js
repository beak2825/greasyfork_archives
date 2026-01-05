// ==UserScript==
// @name          Ratsit Profile Extractor
// @namespace     https://www.ratsit.se/
// @version       4.4.3
// @description   Extracts profile information from Ratsit in a pop-up.
// @match         https://www.ratsit.se/*
// @icon          https://www.ratsit.se/favicon.ico
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/559021/Ratsit%20Profile%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/559021/Ratsit%20Profile%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (!/\/\d{8}-/.test(window.location.pathname)) return;

  const INITIAL_WIDTH = 700;
  const INITIAL_HEIGHT = 700;
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 400;

  const COLOR_POPUP_BG = '#1a1a1a';
  const COLOR_CONTROL_BAR = '#252525';
  const COLOR_FOOTER_BAR = '#222';
  const COLOR_DIVIDER = '#333';
  const COLOR_TEXT_DEFAULT = '#e0e0e0';
  const COLOR_EDIT_BG = '#353840';
  const COLOR_TEXT_EDITING = '#ffffff';
  const COLOR_EDIT_ACTIVE = '#353840';

  function capitalizeFirstLetter(str) {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function clean(str) {
    return str
      .replace(/[ö]/gi, 'o')
      .replace(/[äå]/gi, 'a')
      .replace(/[é]/gi, 'e');
  }
  function fixCity(str) {
    return str.replace(/Göteborg/gi, 'Gothenburg');
  }
  function fixPhone(raw) {
    const d = raw.replace(/\D/g, '').replace(/^46/, '').replace(/^0/, '');
    if (!d || d.length < 6) return '';
    return `(0)${d.slice(0, 2)} ${d.slice(2)}`;
  }
  function fixDate(txt) {
    const mon = {
      januari: '01', februari: '02', mars: '03', april: '04',
      maj: '05', juni: '06', juli: '07', augusti: '08',
      september: '09', oktober: '10', november: '11', december: '12'
    };
    const m = txt.toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/);
    if (!m) return '';
    return `${m[1].padStart(2, '0')}/${mon[m[2]]}/${m[3]}`;
  }

  function extract() {
    const output = [];
    const name = document.querySelector('h1')?.innerText.trim();
    if (name) {
      output.push(name);
      output.push('');
    }
    let street = '', postal = '', lan = '';
    const divs = Array.from(document.querySelectorAll('div'));
    for (let i = 0; i < divs.length - 1; i++) {
      const a = divs[i].innerText.trim();
      const b = divs[i + 1].innerText.trim();
      if (
        /^[A-Za-zÅÄÖåäöéÉ\s\-\.]+\s+\d/.test(a) &&
        /^\d{3}\s?\d{2}\s+[A-Za-zÅÄÖåäöéÉ]/.test(b)
      ) {
        let cleanedStreet = a.replace(/\s+lgh\s+\d+/i, '');
        street = capitalizeFirstLetter(clean(cleanedStreet));
        const cleanedPostal = clean(fixCity(b));
        const postalParts = cleanedPostal.split(/(\d{3}\s?\d{2})/);
        postal = postalParts.map((part, idx) => {
          if (idx === 0 || /^\d/.test(part)) return part;
          return capitalizeFirstLetter(part.trim());
        }).join(' ').replace(/\s+/g, ' ').trim();
        break;
      }
    }
    const lm = document.body.innerText.match(/Län:\s*([^\n(]+)/i);
    if (lm) lan = clean(lm[1].trim());
    if (street) output.push(street);
    if (postal) output.push(postal);
    if (lan) output.push(`(lan ${lan})`);

    const phones = new Set();
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      const parentDiv = a.closest('div');
      if (parentDiv) {
        const strongTag = parentDiv.querySelector('strong');
        if (strongTag && strongTag.innerText.trim() && strongTag.innerText.trim() !== name) {
          return;
        }
      }
      let p = a;
      for (let i = 0; i < 5; i++) {
        p = p.parentElement;
        if (!p) break;
        if (p.innerText.includes(name)) {
          const fixed = fixPhone(a.innerText);
          if (fixed) phones.add(fixed);
          break;
        }
      }
    });
    if (phones.size) {
      output.push('');
      phones.forEach(p => output.push(p));
    }
    const m = document.body.innerText.match(/är gift med\s+([^\n]+)/i);
    if (m) {
      output.push('');
      const spouseName = capitalizeFirstLetter(clean(m[1].trim().split(' ')[0]));
      output.push(`Spouse's name: ${spouseName}`);
    }
    document.querySelectorAll('p').forEach(p => {
      if (p.innerText.includes('Födelsedag:')) {
        const d = fixDate(p.innerText);
        if (d) {
          output.push('');
          output.push(`Date of birth: ${d}`);
        }
      }
    });
    const roles = {
      'Ordförande': 'Chairman',
      'Verkställande direktör': 'CEO',
      'VD': 'CEO',
      'Extern VD': 'CEO',
      'Vice VD': 'Deputy CEO',
      'Styrelseledamot': 'Board Member',
      'Styrelsesuppleant': 'Deputy Board Member',
      'Vice ordförande': 'Deputy Chairman'
    };
    const skip = ['Verklig Huvudman', 'Revisor', 'Innehavare'];
    const comp = new Map();
    document.querySelectorAll('table tbody tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < 4) return;
      const cname = clean(tds[0].innerText.trim());
      const status = tds[2].innerText;
      const role = tds[3].innerText;
      if (!status.includes('Aktiv')) return;
      if (skip.some(s => role.includes(s))) return;
      const rs = new Set();
      for (const [sv, en] of Object.entries(roles)) {
        if (role.includes(sv)) rs.add(en);
      }
      if (!rs.size) return;
      if (!comp.has(cname)) comp.set(cname, new Set());
      rs.forEach(r => comp.get(cname).add(r));
    });
    if (comp.size) {
      output.push('');
      output.push('Other positions:');
      const rolePriority = { 'CEO': 1, 'Chairman': 2, 'Deputy Chairman': 3, 'Deputy CEO': 4, 'Deputy Board Member': 5, 'Board Member': 6 };
      comp.forEach((rs, cn) => {
        let rolesArray = Array.from(rs);
        if ((rolesArray.includes('Chairman') || rolesArray.includes('Deputy Chairman')) && rolesArray.includes('Board Member')) {
          rolesArray = rolesArray.filter(r => r !== 'Board Member');
        }
        const sortedRoles = rolesArray.sort((a, b) => (rolePriority[a] || 999) - (rolePriority[b] || 999));
        output.push(`- ${cn}, ${sortedRoles.join(', ')}`);
      });
    }

    // ADDED SOURCE
    output.push('');
    output.push('ratsit');

    return output.join('\n');
  }

  function show(txt) {
    document.getElementById('ratsitPop')?.remove();
    const popup = document.createElement('div');
    popup.id = 'ratsitPop';
    const buttonStyle = `background: #3a3a3a; color: ${COLOR_TEXT_DEFAULT}; border: 1px solid #555; border-radius: 4px; cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s; font-weight: bold;`;
    const smallButtonStyle = `${buttonStyle} padding: 4px 8px; font-size: 14px;`;
    const mainButtonStyle = `${buttonStyle} flex:1; padding: 6px 12px; font-size: 14px;`;

    popup.innerHTML = `
      <div id="popupContainer" style="position:fixed; top:60px; right:20px; width:${INITIAL_WIDTH}px; height:${INITIAL_HEIGHT}px; max-width:90vw; background:${COLOR_POPUP_BG}; border:2px solid ${COLOR_DIVIDER}; border-radius:12px; z-index:999999; font-family:Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden; min-width:${MIN_WIDTH}px; min-height:${MIN_HEIGHT}px;">
        <div id="rDragHandle" style="padding:10px 14px; background:${COLOR_CONTROL_BAR}; display:flex; justify-content:flex-end; align-items:center; border-bottom:1px solid ${COLOR_DIVIDER}; cursor: grab;">
          <button id="rClose" style="background:none; border:none; color:#888; font-size:20px; cursor:pointer; padding:4px 8px; border-radius:4px;">✕</button>
        </div>
        <textarea id="rText" style="flex:1; background:${COLOR_POPUP_BG}; color:${COLOR_TEXT_DEFAULT}; border:none; padding:16px; font-family:monospace; font-size:13px; resize:none; outline:none;" readonly>${txt}</textarea>
        <div id="rControlBar" style="padding:10px 14px 4px 14px; display:flex; gap:8px; align-items:center; background:${COLOR_FOOTER_BAR}; border-top:1px solid ${COLOR_DIVIDER}; position: relative;">
          <button id="rEdit" style="${mainButtonStyle}">Edit</button>
          <button id="rCopy" style="${mainButtonStyle}">Copy</button>
          <div id="rCopyFeedback" style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: ${COLOR_CONTROL_BAR}; color: ${COLOR_TEXT_DEFAULT}; padding: 4px 10px; border-radius: 6px; font-size: 24px; opacity: 0; pointer-events: none; transition: opacity 0.3s ease-out; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">🍻 Copied!</div>
        </div>
        <div style="padding:4px 14px 10px 14px; display:flex; gap:8px; justify-content:center; align-items:center; background:${COLOR_FOOTER_BAR}; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
          <button id="rZoomIn" title="Zoom in" style="${smallButtonStyle}">+</button>
          <button id="rZoomOut" title="Zoom out" style="${smallButtonStyle}">-</button>
        </div>
        <div id="rResizeLeftDown" style="position:absolute; bottom:0; left:0; width:16px; height:16px; cursor:sw-resize; background: linear-gradient(45deg, transparent 40%, #555 40%);"></div>
      </div>`;

    document.body.appendChild(popup);
    const container = popup.querySelector('#popupContainer');
    const dragHandle = popup.querySelector('#rDragHandle');
    const ta = popup.querySelector('#rText');
    const editBtn = popup.querySelector('#rEdit');
    const copyBtn = popup.querySelector('#rCopy');
    const closeBtn = popup.querySelector('#rClose');
    const zoomIn = popup.querySelector('#rZoomIn');
    const zoomOut = popup.querySelector('#rZoomOut');
    const resizeLeftDown = popup.querySelector('#rResizeLeftDown');

    let isEditing = false, fontSize = 13, isDragging = false, isResizingLD = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight, startLeft;

    dragHandle.onmousedown = (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
        container.style.removeProperty('right');
        container.style.left = `${rect.left}px`; container.style.top = `${rect.top}px`;
        e.preventDefault();
    };
    resizeLeftDown.onmousedown = (e) => {
        isResizingLD = true;
        startX = e.clientX; startY = e.clientY;
        startWidth = container.offsetWidth; startHeight = container.offsetHeight;
        startLeft = container.offsetLeft;
        e.preventDefault();
    };
    document.onmousemove = (e) => {
        if (isDragging) { container.style.left = `${e.clientX - offsetX}px`; container.style.top = `${e.clientY - offsetY}px`; }
        if (isResizingLD) {
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            container.style.width = `${Math.max(MIN_WIDTH, startWidth - dx)}px`;
            container.style.left = `${startLeft + dx}px`;
            container.style.height = `${Math.max(MIN_HEIGHT, startHeight + dy)}px`;
        }
    };
    document.onmouseup = () => { isDragging = false; isResizingLD = false; };
    editBtn.onclick = () => {
      isEditing = !isEditing;
      ta.readOnly = !isEditing;
      ta.style.background = isEditing ? COLOR_EDIT_BG : COLOR_POPUP_BG;
      editBtn.textContent = isEditing ? 'Done' : 'Edit';
    };
    copyBtn.onclick = () => { GM_setClipboard(ta.value); popup.querySelector('#rCopyFeedback').style.opacity = '1'; setTimeout(() => { popup.querySelector('#rCopyFeedback').style.opacity = '0'; }, 1500); };
    closeBtn.onclick = () => popup.remove();
    zoomIn.onclick = () => { fontSize++; ta.style.fontSize = fontSize + 'px'; };
    zoomOut.onclick = () => { fontSize--; ta.style.fontSize = fontSize + 'px'; };
  }
  window.addEventListener('load', () => show(extract()));
})();