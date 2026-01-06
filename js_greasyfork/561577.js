// ==UserScript==
// @name         Group Sidebar Shop Divs by Categories
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  Groups divs into categories, 4 per row, centered, perfectly aligned
// @author       Silvia, arithmancer
// @match        https://www.grundos.cafe/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561577/Group%20Sidebar%20Shop%20Divs%20by%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/561577/Group%20Sidebar%20Shop%20Divs%20by%20Categories.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('load', function() {
    const aioImg = document.querySelector('.shops .aioImg');
    if (!aioImg) return;

    const foodAndDrink = [1, 14, 15, 16, 18, 20, 22, 30, 32, 34, 35, 37, 39, 42, 46, 47, 56];
    const books = [7, 38, 77, 78];
    const collectibles = [8, 58, 68];
    const petpets = [25, 26, 27, 31, 40, 44, 50, 52, 57, 61, 88];
    const toys = [3, 48, 74, 98];
    const magicAndBattle = [2, 9, 10];
    const others = [4, 5, 11, 12, 13, 17, 21, 53, 69, 79, 84];

    const divs = [...aioImg.querySelectorAll('div')];
    const shopMap = {};

    divs.forEach(div => {
      const link = div.querySelector('a');
      if (link) {
        const url = new URL(link.href, window.location.origin);
        const shopId = url.searchParams.get('shop_id');
        if (shopId) {
          shopMap[shopId] = div;
        }
      }
    });

    const categories = [
      { ids: foodAndDrink, className: 'c1', name: 'food & drink' },
      { ids: books, className: 'c2', name: 'books' },
      { ids: collectibles, className: 'c3', name: 'collectibles' },
      { ids: petpets, className: 'c4', name: 'petpets' },
      { ids: toys, className: 'c5', name: 'toys' },
      { ids: magicAndBattle, className: 'c6', name: 'magic & battle' },
      { ids: others, className: 'c7', name: 'other stuff' }
    ];

    const usedDivs = new Set();

    categories.forEach(category => {
      const wrapper = document.createElement('div');
      wrapper.classList.add(category.className);

      // Flex layout for perfect 4-per-row grid
      wrapper.style.display = 'flex';
      wrapper.style.flexWrap = 'wrap';
      wrapper.style.justifyContent = 'center';  // center rows
      wrapper.style.width = '100%';
      wrapper.style.margin = '0';
      wrapper.style.padding = '0';
      wrapper.style.rowGap = '2px';   // vertical spacing
      wrapper.style.columnGap = '2px'; // horizontal spacing

      category.ids.forEach(id => {
        const div = shopMap[id];
        if (div) {
          div.style.margin = '0';
          div.style.padding = '0';
          wrapper.appendChild(div);
          usedDivs.add(div);
        }
      });

      if (wrapper.children.length > 0) {
        const header = document.createElement('div');
        header.classList.add('aio-sub-header');
        header.textContent = category.name;
        wrapper.prepend(header);
        aioImg.appendChild(wrapper);
      }
    });

    // Default unknown shops to the bottom
    const unknownDivs = divs.filter(div => !usedDivs.has(div) && div.parentElement === aioImg);
    if (unknownDivs.length > 0) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('c-unknown');
      wrapper.style.display = 'flex';
      wrapper.style.flexWrap = 'wrap';
      wrapper.style.justifyContent = 'center';
      wrapper.style.width = '100%';
      wrapper.style.margin = '0';
      wrapper.style.padding = '0';
      wrapper.style.rowGap = '2px';
      wrapper.style.columnGap = '2px';

      const header = document.createElement('div');
      header.classList.add('aio-sub-header');
      header.textContent = 'unknown';
      wrapper.appendChild(header);

      unknownDivs.forEach(div => {
        div.style.margin = '0';
        div.style.padding = '0';
        wrapper.appendChild(div);
      });
      aioImg.appendChild(wrapper);
    }
  });
})();
