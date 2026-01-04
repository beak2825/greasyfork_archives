// ==UserScript==
// @name         Battledome Keyboard Interface
// @description  Control Neopets Battledome using keyboard. Includes HUD with tappable/clickable keys
// @version      2025.09.10
// @license      GNU GPLv3
// @match        https://www.neopets.com/dome/arena.phtml*
// @author       Posterboy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @namespace    https://youtube.com/@Neo_Posterboy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549006/Battledome%20Keyboard%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/549006/Battledome%20Keyboard%20Interface.meta.js
// ==/UserScript==

(() => {

  const d = document, w = window, q = s => d.querySelector(s), qa = s => [...d.querySelectorAll(s)];
  const WK = ['A','S','D','F','J','K','L',';'], AK = ['1','2','3','4','5','6','7','8','9','0','-'], BK = ['Z','X','C','V','B','N','M',',','.'];
  const BTN = {
    // Action Buttons can be reassigned to any key on Q or Z rows. See Line 201 for more.
    X: { s: ['#start', '#fight'], l: 'Fight' },
    C: { s: '#skipreplay', l: '🔄⏩' },
    V: { s: '.end_ack.collect', l: 'Collect' },
    B: { s: '#bdplayagain', l: 'Play Again' },
    N: { s: '#bdnewfight', l: 'New Fight' },
    M: { s: '#bdexit', l: 'Exit' }
  };

//===========================
// Keyboard Background Images
//===========================

const bgImages = [
  'https://images.neopets.com/bd2/h5/barracks/images/barracks_popup_banner.png',
  'https://images.neopets.com/games/new_tradingcards/lg_sloth_plot_2004.gif',
  'https://images.neopets.com/themes/h5/common/signup/images/bg-jhudora.png',
  'https://images.neopets.com/wheels/h5/excitement/images/bg.png',
  'https://images.neopets.com/ncmall/collectibles/09_08/nc-collectible.jpg',
  'https://portal.neopets.com/images/neopass/banner-top-mobile.png',
  'https://images.neopets.com/themes/h5/altadorcup/images/hp-bg-top.png'
];

let currentBgIndex = parseInt(localStorage.getItem('bdKeyboardBgIndex')) || 0;

const cycleBackground = () => {
  currentBgIndex = (currentBgIndex + 1) % bgImages.length;
  const hud = document.getElementById('keyboard-hud');
  if (hud) {
    hud.style.backgroundImage = `url(${bgImages[currentBgIndex]})`;
    localStorage.setItem('bdKeyboardBgIndex', currentBgIndex);
  }
};

  //=======================
  // Gather/Set Information
  //=======================

  let vKeyPressed = false, weaponSelectCount = 0, lastEquippedWeaponUrl = null;
  const getWeapons = () => qa('#p1equipment ul li').filter(li => li.querySelector('img.item'));
  const getAbilities = () => qa('#p1ability td[title]');
  const getItemInfo = (url, n = 1) => {
    let count = 0;
    for (const item of qa('#p1equipment ul li img.item')) {
      if (item.src === url && ++count === n) {
        return { id: item.id, name: item.alt, node: item };
      }
    }
    return null;
  };
  const getAbilityInfo = url => {
    for(const node of qa('#p1ability td[title]')){
      const inner = node.children[0]?.innerHTML||'', m = inner.match(/img src=\"(.*?)\"/);
      if(!m) continue;
      let nodeurl = m[1].includes('https:')?m[1]:'https:'+m[1];
      if(nodeurl===url){
        if(node.children[0].classList.contains('cooldown')) return -1;
        return {id:node.children[0].getAttribute('data-ability'),name:node.title,node};
      }
    }
    return null;
  };

  //======================
  // Equip Items/Abilities
  //======================

  const selectSlot = (slot, item, n = 1) => {
    const isAbility = slot.id === 'p1am';
    const info = isAbility ? getAbilityInfo(item) : getItemInfo(item, n);
    if (info === -1 && isAbility) { alert('WARNING: cooldown!'); return true; }
    if (info === null) { alert(`ERROR: Item not equipped!\nURL: ${item}`); return true; }

    const slotid = slot.id.slice(0, -1), input = q(`#${slotid}`);
    if (input) input.value = info.id;
    slot.classList.add('selected');
    const bg = slot.children[1].style;
    bg.backgroundPosition = '0 0';
    bg.backgroundSize = '60px 60px';
    bg.backgroundImage = `url("${item}")`;

    if (!isAbility) {
      info.node.style.display = 'none';
      slot.addEventListener('click', () => info.node.removeAttribute('style'));
    }

    return false;
  };

  w.selectSlot = selectSlot;

  let _weaponImgs = [], _abilityImgs = [];

  //==================
  // Keyboard Mapping
  //==================

  const setupKeyboard = (weaponImgs, abilityImgs) => {
    _weaponImgs = weaponImgs.map(li => li.querySelector('img'));
    _abilityImgs = abilityImgs.map(td => td.querySelector('img'));

d.addEventListener('keydown', e => {
  const key = e.key.toUpperCase();

//Prevent page from scrolling when pressing spacebar
  if (e.key === ' ') {
    e.preventDefault();
    cycleBackground();
    return;
  }

      const wIdx = WK.indexOf(key);
      if (wIdx !== -1 && _weaponImgs[wIdx]) {
        const img = _weaponImgs[wIdx];
        const slotId = weaponSelectCount % 2 === 0 ? 'p1e1m' : 'p1e2m';
        const slot = q(`#${slotId}`);

        let occurrence = 1;
        if (weaponSelectCount % 2 === 1) {
          occurrence = (img.src === lastEquippedWeaponUrl) ? 2 : 1;
        } else {
          lastEquippedWeaponUrl = img.src;
        }

        if (slot) {
          selectSlot(slot, img.src, occurrence);
          weaponSelectCount++;
        }
        return;
      }

      const aIdx = AK.indexOf(key);
      if (aIdx !== -1 && _abilityImgs[aIdx]) {
        const slot = q('#p1am');
        if (slot) selectSlot(slot, _abilityImgs[aIdx].src);
        return;
      }

      if (key === 'V') vKeyPressed = true;
      if (key === 'B' && !vKeyPressed) return;

      if (BTN[key]) {
        const target = q(BTN[key].s);
        if (target) target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });

    ['#p1e1m', '#p1e2m'].forEach(id => {
      const el = q(id);
      if (el) {
        el.addEventListener('click', () => {
          weaponSelectCount = 0;
          lastEquippedWeaponUrl = null;
        });
      }
    });
  };

  //============================
  // "Play Again" Bug Prevention
  //============================

  (() => {
    let unlocked = false;
    const observer = new MutationObserver(() => {
      const c = q('.end_ack.collect');
      if (c && !c.__guarded) {
        c.__guarded = true;
        c.addEventListener('click', () => { unlocked = true; }, { once: true });
      }

      const p = q('#bdplayagain');
      if (p && !p.__guarded) {
        p.__guarded = true;
        p.addEventListener('click', e => {
          if (!unlocked) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        }, true);
      }
    });
    observer.observe(d.body, { childList: true, subtree: true });
  })();

  //=================
  // HUD Construction
  //=================

  const createKey = (label, imgSrc = null, actionLabel = null) => {
    const key = d.createElement('div');
    Object.assign(key.style, {
      width: '65px', height: '60px', margin: '4px', backgroundColor: 'rgba(51,51,51,0.85)',
      border: '1px solid #555', borderRadius: '6px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '14px', position: 'relative', cursor: 'pointer', userSelect: 'none',
    });
    key.className = 'keyboard-key';

    if (imgSrc) {
      const img = d.createElement('img');
      img.src = imgSrc;
      Object.assign(img.style, { width: '36px', height: '36px', objectFit: 'contain' });
      key.appendChild(img);
    }

    const labelEl = d.createElement('span');
    labelEl.textContent = label;
    labelEl.style.marginTop = '2px';
    labelEl.style.fontWeight = 'bold';
    labelEl.style.color = '#fff';
    key.appendChild(labelEl);

    if (actionLabel) {
      const desc = d.createElement('div');
      desc.textContent = actionLabel;
      Object.assign(desc.style, { fontSize: '12px', color: '#fff', marginTop: '2px', fontWeight: 'bold' });
      key.appendChild(desc);
    }

      // Change these if you remap keys on lines 15-20. Fight Button is yellow and Collect button is green
    if (label === 'X') { // This is your Fight Button
      key.style.backgroundColor = 'yellow';
      labelEl.style.color = '#000';
      if (actionLabel) key.lastChild.style.color = '#000';
    } else if (label === 'V') { // This is your Collect Button
      key.style.backgroundColor = 'green';
      labelEl.style.color = '#fff';
      if (actionLabel) key.lastChild.style.color = '#fff';
    }

    key.onclick = () => {
      const keyLabel = label.toUpperCase();
      const wIdx = WK.indexOf(keyLabel);
      if (wIdx !== -1) {
        const img = _weaponImgs[wIdx];
        const slotId = weaponSelectCount % 2 === 0 ? 'p1e1m' : 'p1e2m';
        const slot = q(`#${slotId}`);

        let occurrence = 1;
        if (weaponSelectCount % 2 === 1) {
          occurrence = (img.src === lastEquippedWeaponUrl) ? 2 : 1;
        } else {
          lastEquippedWeaponUrl = img.src;
        }

        if (slot && img) {
          selectSlot(slot, img.src, occurrence);
          weaponSelectCount++;
        }
        return;
      }

      const aIdx = AK.indexOf(keyLabel);
      if (aIdx !== -1) {
        const img = _abilityImgs[aIdx];
        const slot = q('#p1am');
        if (slot && img) {
          selectSlot(slot, img.src);
        }
        return;
      }

      if (BTN[keyLabel]) {
        const target = q(BTN[keyLabel].s);
        if (target) target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }

      if (keyLabel === 'V') vKeyPressed = true;
    };

    return key;
  };

  const createHUD = (weapons, abilities) => {
    const container = d.createElement('div');
    container.id = 'keyboard-hud';
    Object.assign(container.style, {
      width: '980px', margin: '20px auto', padding: '10px', backgroundColor: '#111',
      border: '2px solid #666', borderRadius: '10px',
      backgroundImage: `url(${bgImages[currentBgIndex]})`,
      backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat',
      userSelect: 'none',
    });

    const wImgs = weapons.map(li => li.querySelector('img'));
    const aImgs = abilities.map(td => td.querySelector('img'));
    const layout = [AK, ['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L',';'], BK];

    layout.forEach(row => {
      const rowEl = d.createElement('div');
      Object.assign(rowEl.style, { display: 'flex', justifyContent: 'center', marginTop: '6px' });
      row.forEach(key => {
        const wIdx = WK.indexOf(key), aIdx = AK.indexOf(key), btn = BTN[key];
        let keyEl;
        if (wIdx !== -1 && wImgs[wIdx]) keyEl = createKey(key, wImgs[wIdx].src);
        else if (aIdx !== -1 && aImgs[aIdx]) keyEl = createKey(key, aImgs[aIdx].src);
        else if (btn) keyEl = createKey(key, null, btn.l);
        else keyEl = createKey(key);
        rowEl.appendChild(keyEl);
      });
      container.appendChild(rowEl);
    });

    const spacebarRow = d.createElement('div');
    Object.assign(spacebarRow.style, { display: 'flex', justifyContent: 'center', marginTop: '10px' });
    const spacebarKey = d.createElement('div');
    spacebarKey.className = 'keyboard-key';
    Object.assign(spacebarKey.style, {
      width: '530px', height: '50px', margin: '4px', backgroundColor: 'rgba(51,51,51,0.85)',
      border: '1px solid #555', borderRadius: '6px', display: 'flex',
      justifyContent: 'center', alignItems: 'center', userSelect: 'none', cursor: 'default',
    });
    const spaceLabel = d.createElement('span');
    spaceLabel.textContent = 'SPACE (Press to change background)';
    Object.assign(spaceLabel.style, { color: '#fff', fontWeight: 'bold', fontSize: '16px', userSelect: 'none' });
    spacebarKey.appendChild(spaceLabel);
    spacebarRow.appendChild(spacebarKey);
    container.appendChild(spacebarRow);

    const status = q('#statusmsg');
    if (status?.parentNode) status.parentNode.insertBefore(container, status.nextSibling);
  };

  //===========
  // Initialize
  //===========

  const init = () => {
    const weapons = getWeapons(), abilities = getAbilities();
    if (!weapons.length && !abilities.length) return;
    createHUD(weapons, abilities);
    setupKeyboard(weapons, abilities);
      /* Optional feature to auto scroll to bottom of page so that keyboard is more visible.
      w.scrollTo(0, d.body.scrollHeight); */
  };

  w.addEventListener('load', init);

})();
