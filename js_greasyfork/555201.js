// ==UserScript==
// @name        Steam Keys prices
// @namespace   Violentmonkey Scripts
// @match        *://store.steampowered.com/wishlist/id/*
// @match        *://store.steampowered.com/app/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM_xmlhttpRequest
// @run-at      document-end
// @version     1.1.0
// @author      vfyxe
// @description Display lowest key price on Steam store page.
// @downloadURL https://update.greasyfork.org/scripts/555201/Steam%20Keys%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/555201/Steam%20Keys%20prices.meta.js
// ==/UserScript==

class KeysPrice extends HTMLElement {
  constructor() {
    super();
    console.log('KeysPrice', this);
  }

  connectedCallback() {

    this.innerHTML = '<div class="loading-text"><strong>Game keys:</strong> Searching for prices...</div>';
    const searchName = this.dataset.searchName;
    const url = `https://gg.deals/game/${searchName}/`;

    const handleFailed = () => {
      this.innerHTML =  '<div class="loading-text"><strong>Game keys:</strong> Failed to find game</div>';
      const buttonLink = document.createElement('a');
      buttonLink.innerHTML = '<span>Search Game</span';
      buttonLink.classList = 'keys-price__link btn_blue_steamui';
      buttonLink.href = `https://gg.deals/search/?title=${searchName.replaceAll('-','+')}`;
      buttonLink.target = '__blank'
      this.appendChild(buttonLink);
    }

    try {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (response) => {
          const html = response.responseText;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const discountEl = doc.querySelector('.best-deal') || doc.querySelector('.lowest-recorded');
          if (!discountEl) {
            handleFailed();
            return;
          }

          this.innerHTML = discountEl.innerHTML;

          const buttonLink = document.createElement('a');
          buttonLink.innerHTML = '<span>View Keys</span';
          buttonLink.classList = 'keys-price__link btn_blue_steamui';
          buttonLink.href = url;
          buttonLink.target = '__blank'
          this.appendChild(buttonLink);
        },
        onerror: (error) => {
          console.error('Error fetching from Keyshop:', error);
          handleFailed();
        },
      });
    } catch (error) {
      console.error('Error fetching from Keyshop:', error);
      handleFailed();
    }
  }
}

window.customElements.define('keys-price', KeysPrice);

const createKeysPrice = (steamAtc, searchName, makeChild) => {
  // const gameName = document.querySelector('#appHubAppName').textContent;
  const el = document.createElement('keys-price');
  el.dataset.searchName = searchName;
  makeChild === true
    ? steamAtc.appendChild(el)
    : steamAtc.insertAdjacentElement('afterend', el);
  console.log('steamAtc', steamAtc);
  console.log('el', el);
}

const handleizeString = (string) => {
  return string.toLowerCase().replaceAll('_', '-').replaceAll('--', '-')
    .replace('-viii', '-8')
    .replace('-xiii', '-13')
    .replace('-vii', '-7')
    .replace('-xii', '-12')
    .replace('-vi', '-6')
    .replace('-xi', '-11')
    .replace('-iv', '-4')
    .replace('-ix', '-9')
    .replace('-iii', '-3')
    .replace('-ii', '-2')
}

const handlePanel = (steamAtc) => {
  if (steamAtc.querySelector('keys-price') || !steamAtc.querySelector('button[type="button"]')) return;
  setTimeout(() => {
    const link = steamAtc.querySelector('a');
    if (!link) return;
    const searchName = handleizeString(link.href.split('?')[0].split('/').filter(Boolean).pop())
    createKeysPrice(steamAtc, searchName, true);
  }, 300);
};

window.onload = (event) => {
  if (window.location.href.includes('/app/')) {
    const steamAtcs = [...document.querySelectorAll('.game_purchase_action')];
    const searchName = handleizeString(window.location.href.split('?')[0].split('/').filter(Boolean).pop());
    createKeysPrice(steamAtcs[0], searchName);
  } else if (window.location.href.includes('/wishlist/')) {
    new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.('.Panel[data-index]')) handlePanel(node);
          node.querySelectorAll?.('.Panel[data-index]').forEach(handlePanel);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });

    setTimeout(() => document.querySelectorAll('.Panel[data-index]').forEach(handlePanel), 2000);
  }
}

const css = document.createElement('style');

css.textContent = `
  keys-price {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 16px;
    bottom: -17px;
    left: 16px;
    overflow-x: auto;
    white-space: nowrap;
    text-align: right;
    background-color: #000000;
    padding: 2px 2px 2px 0px;
    border-radius: 2px;
  }

  .Panel[data-index] {
    position: relative!important;
  }

  keys-price .loading-text {
    padding: 0 10px;
  }

  keys-price * {
    line-height: 32px;
    text-decoration: none;
  }

  keys-price .game-info-price-label {
    padding: 0 10px;
  }

  keys-price .game-header-price {
    display: flex;
    flex-direction: row-reverse;
  }

  keys-price .best.label {
    display: none;
  }

  keys-price .price-best,
  keys-price .price-hl {
    font-family: "Motiva Sans", Sans-serif;
    font-weight: normal;
    font-weight: 500;
    color: #BEEE11;
    background: #4c6b22;
    font-size: 25px;
    text-align: center;
    height: 32px;
  }

  keys-price .price-best span,
  keys-price .price-hl span{
    padding: 0 6px;
  }

  keys-price .price-hl {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  keys-price .historical.label {
    font-size: 14px;
    padding-right: 3px;
    font-weight: 300;
  }

  keys-price .price {
    color: #BEEE11;
    background: #344654;
    font-size: 16px;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 6px;
  }

  keys-price .keys-price__link {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #c3e1f8;
    background: transparent;
    text-shadow: 1px 1px 0px rgba( 0, 0, 0, 0.3 );
    font-size: 15px;
    margin-left: 2px;
  }

  keys-price .keys-price__link > span {
    display: inline-block;
    padding: 0 18px;
		background: #75b022;
		background: -webkit-linear-gradient( top, #75b022 5%, #588a1b 95%);
	  background: linear-gradient( to bottom, #75b022 5%, #588a1b 95%);
    background: linear-gradient( to right, #9a47ff 5%, #3610be 60%);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    background-position: 25%; background-size: 330% 100%;
    min-height: 32px;
  }

  keys-price .keys-price__link:hover > span {
    background: linear-gradient( to right, #956eff 5%, #6a41ff 60%)!important;
  }
`;

setTimeout(() => {
  document.body.appendChild(css);
},100);

