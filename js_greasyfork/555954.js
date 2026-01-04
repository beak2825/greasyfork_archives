// ==UserScript==
// @name         FV - Explorer Buff Frozen Leaf Fairy Shortcut
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.1
// @description  Adds a Snow Festival Frozen Leaf Fairy shortcut to explorers.
// @author       necroam
// @match        https://www.furvilla.com/career/explorer/*
// @match        https://www.furvilla.com/museum/items?village_id=0&rarity=&is_tep=1&is_special_new=1&color_rarity=&species_rarity=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555954/FV%20-%20Explorer%20Buff%20Frozen%20Leaf%20Fairy%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/555954/FV%20-%20Explorer%20Buff%20Frozen%20Leaf%20Fairy%20Shortcut.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ITEM_NAME = 'Snow Festival Frozen Leaf Fairy';
  const ITEM_IMG = 'https://www.furvilla.com/img/items/1/1422-snow-festival-frozen-leaf-fairy.png';
  const ITEM_LINK = 'https://www.furvilla.com/museum/items?village_id=0&rarity=&is_tep=1&is_special_new=1&color_rarity=&species_rarity=';

  const createEl = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    Object.assign(el, props);
    if (props.style) Object.assign(el.style, props.style);
    children.forEach(child => el.appendChild(child));
    return el;
  };

  const getFairyInventoryCount = async () => {
    try {
      const res = await fetch(ITEM_LINK, { credentials: 'include' });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const block = [...doc.querySelectorAll('.inventory-item-info')]
        .find(el => el.textContent.includes(ITEM_NAME));
      const count = block?.parentElement?.querySelector('.label-info')?.textContent.match(/\d+/)?.[0];
      return count ? Math.min(parseInt(count), 10) : 0;
    } catch (e) {
      console.error('Inventory fetch failed:', e);
      return 10;
    }
  };

  const injectFairyReminder = async () => {
    const container = document.querySelector('.registration-well');
    const br = container?.querySelector('label + div + br');
    const csrf = document.querySelector('input[name="_token"]')?.value;
    if (!container || !br || !csrf) return;

    const count = await getFairyInventoryCount();
    if (count < 1) {
      br.insertAdjacentElement('afterend', createEl('div', {
        textContent: `You have no ${ITEM_NAME}s!`,
        style: { textAlign: 'center', color: '#c00', fontWeight: 'bold' }
      }));
      return;
    }

    const modal = createEl('div', {
      className: 'modal fade in',
      id: 'itemModal',
      tabIndex: -1,
      role: 'dialog',
      style: { display: 'none', paddingRight: '20px', zIndex: '1050' }
    });

    modal.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-content item-modal-content">
          <div class="logo" style="background-image: url('${ITEM_IMG}')"></div>
          <div class="modal-header">
            <a href="#" class="close" id="fairy-close"><img src="https://www.furvilla.com/img/btn-close.png" alt="Close"></a>
            <h2 class="modal-title align-center">${ITEM_NAME}</h2>
          </div>
          <div class="modal-body">
            <p class="text-center">
              <span class="label label-litepurple">Limited</span>
              <span class="label label-default">Event - TEP</span>
              <span class="label label-default">Supply - Special</span>
            </p>
            <p><small><b>Recycling Points:</b> 25 Fur Gems</small></p>
            <hr>
            <center><i>This fairy is enjoying the Snow Festival! Grants one extra explore item for next ten explore turns.</i></center>
            <hr>
            <select name="quantity" class="input quantity" style="position: absolute; left: -9999px;">
              ${Array.from({ length: count }, (_, i) => `<option value="${i + 1}"${i === 0 ? ' selected' : ''}>${i + 1}</option>`).join('')}
            </select>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
              <button type="button" class="btn" id="fairy-confirm">Use</button>
              <button type="button" class="btn" id="fairy-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const backdropStyle = createEl('style', {
      textContent: `
        #fairy-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }
      `
    });

    const message = createEl('div', {
      id: 'fairy-message',
      style: { textAlign: 'center', color: '#c00', marginTop: '6px', fontWeight: 'bold', display: 'none' }
    });

    const img = createEl('img', {
      src: ITEM_IMG,
      alt: ITEM_NAME,
      style: { display: 'block', margin: '10px auto 4px', maxWidth: '100px', cursor: 'pointer' }
    });

    const linkWrapper = createEl('strong', {
      style: { display: 'block', textAlign: 'center', marginTop: '6px', color: '#c00' }
    }, [
      createEl('a', {
        href: ITEM_LINK,
        textContent: 'Make sure the item is in your Inventory!',
        target: '_blank'
      })
    ]);

    img.addEventListener('click', () => {
      document.body.appendChild(createEl('div', {
        className: 'modal-backdrop fade in',
        id: 'fairy-backdrop'
      }));
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
    });

    const closeModal = () => {
      modal.style.display = 'none';
      document.getElementById('fairy-backdrop')?.remove();
    };

    modal.querySelector('#fairy-close').addEventListener('click', closeModal);
    modal.querySelector('#fairy-cancel').addEventListener('click', closeModal);

    modal.querySelector('#fairy-confirm').addEventListener('click', async () => {
      const quantity = parseInt(modal.querySelector('select[name="quantity"]').value);
      try {
        const res = await fetch('https://www.furvilla.com/use/fairy/frozen-leaf', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `_token=${encodeURIComponent(csrf)}&quantity=${encodeURIComponent(quantity)}`
        });
        const text = await res.text();
        if (res.ok && !text.includes('You do not have any of this item')) {
          modal.remove();
          document.getElementById('fairy-backdrop')?.remove();
          location.reload(true);
        } else {
          message.textContent = `No ${ITEM_NAME} was used!`;
          message.style.display = 'block';
          closeModal();
        }
      } catch (e) {
        console.error(e);
        alert('Something went wrong using the fairy. Please try again.');
        message.textContent = `No ${ITEM_NAME} was used!`;
        message.style.display = 'block';
        closeModal();
      }
    });

    document.head.appendChild(backdropStyle);
    document.body.appendChild(modal);
    br.insertAdjacentElement('afterend', createEl('hr', { style: { margin: '12px 0' } }));
    br.nextElementSibling.insertAdjacentElement('afterend', createEl('label', { textContent: 'Hey Listen!' }));
    br.nextElementSibling.nextElementSibling.insertAdjacentElement('afterend', createEl('div', {
      textContent: `You might have a Frozen Leaf Fairy in your inventory!
      Click the fairy!`
    }));
    br.nextElementSibling.nextElementSibling.nextElementSibling.insertAdjacentElement('afterend', img);
    img.insertAdjacentElement('afterend', linkWrapper);
    linkWrapper.insertAdjacentElement('afterend', message);
  };

  const interval = setInterval(() => {
    const ready = document.querySelector('.registration-well label + div + br');
    const tokenReady = document.querySelector('input[name="_token"]');
    if (ready && tokenReady) {
      clearInterval(interval);
      injectFairyReminder();
    }
  }, 100);
})();
