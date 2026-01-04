// ==UserScript==
// @name         Neopets - Daily Quest Helper
// @description  Adds styled buttons to daily quests instead of links
// @version      2025.11.20
// @license      GNU GPLv3
// @match        *://*.neopets.com/questlog/
// @author       based on work by zara-kayn & FB user suggestion to add blue button styles
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/nchub/np/images/membership/icon-premiumquest.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555087/Neopets%20-%20Daily%20Quest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555087/Neopets%20-%20Daily%20Quest%20Helper.meta.js
// ==/UserScript==

(() => {
  const btnClass = 'button-default__2020 button-blue__2020 btn-single__2020';
  const maxBtnWidth = '250px';

// Randomize which shop users visit to any foodshop (except Refreshments)
  const shopTypes = [1, 14, 15, 16, 18, 20, 22, 30, 34, 35, 37, 39, 42, 46, 47, 49, 56, 62, 66, 72, 81, 90, 95, 101, 105, 112];
  function randomShop() {
    const randomIndex = Math.floor(Math.random() * shopTypes.length);
    return `https://www.neopets.com/objects.phtml?type=shop&obj_type=${shopTypes[randomIndex]}`;
  }

// Button Styling
  const btn = (url, txt) => {
    const b = document.createElement('button');
    b.className = btnClass;
    b.textContent = txt;
    b.style.maxWidth = maxBtnWidth;
    b.onclick = () => window.open(url, '_blank');
    return b;
  };

// Pair Quest Keywords with targets
  const quests = [
    ["Customise one", [["https://www.neopets.com/customise/", "Customise"]]],
    ["the NC Mall", [["https://ncmall.neopets.com/mall/search.phtml?page=1&cat=&type=browse&limit=24", "NC Mall"]]],
    ["Battledome", [["https://www.neopets.com/dome/arena.phtml", "Battledome"]]],
    ["Fishing", [["https://www.neopets.com/water/fishing.phtml", "Go Fish"]]],
    ["Play any Game", [["https://www.neopets.com/games/h5game.phtml?game_id=1391", "Fashion Fever"]]],
    ["Purchase item(s)", [
      [randomShop(), "Random Shop"],
      ["https://www.neopets.com/faerieland/springs.phtml", "Healing Springs"]
    ]],
    ["Wheel of Mediocrity", [["https://www.neopets.com/prehistoric/mediocrity.phtml", "Mediocrity"]]],
    ["Wheel of Excitement", [["https://www.neopets.com/faerieland/wheel.phtml", "Excitement"]]],
    ["Wheel of Knowledge", [["https://www.neopets.com/medieval/knowledge.phtml", "Knowledge"]]],
    ["Wheel of Misfortune", [
        ["https://www.neopets.com/quickref.phtml", "Switch Pet"],
        ["https://www.neopets.com/halloween/wheel/index.phtml", "Misfortune"]]],
    ["Groom one", [
      ["https://www.neopets.com/safetydeposit.phtml?obj_name=&category=10", "SDB Grooming"],
      ["https://www.neopets.com/inventory.phtml", "Inventory"]]],
    ["with any toy", [
      ["https://www.neopets.com/safetydeposit.phtml?obj_name=&category=5", "SDB Toys"],
      ["https://www.neopets.com/inventory.phtml", "Inventory"]]],
    ["Read a book", [
      ["https://www.neopets.com/safetydeposit.phtml?obj_name=&category=6", "SDB Books"],
      ["https://www.neopets.com/inventory.phtml", "Inventory"]]],
  ];

  const addBtns = () => {
    let n = 0;
    document.querySelectorAll('.ql-quest-details').forEach(q => {
      const d = q.querySelector('.ql-quest-description');
      const b = q.querySelector('.ql-quest-buttons');
      if (!d || !b || d.dataset.linksAdded) return;

// Special instructions for purchase an item quest
      for (const [match, links] of quests) {
        if (d.textContent.includes(match)) {
          links.reverse().forEach(([url, label]) => {
            if (label === "Random Food Shop") {
              const button = document.createElement('button');
              button.className = btnClass;
              button.textContent = label;
              button.style.maxWidth = maxBtnWidth;
              button.onclick = () => {
                const dynamicUrl = randomShop();
                window.open(dynamicUrl, '_blank');
              };
              b.prepend(button);
            } else {
              b.prepend(btn(url, label));
            }
          });
          d.dataset.linksAdded = '1';
          n += links.length;
          break;
        }
      }
    });
    return n;
  };

// Wait before executing methods to let page finish loading
  const wait = () => {
    let t = 0, max = 50;
    const i = setInterval(() => {
      t++;
      const loader = document.getElementById('QuestLogLoader'),
            content = document.getElementById('QuestLogContent'),
            ready = content && content.children.length;
      if (!loader || loader.style.display === 'none' || ready || t >= max) {
        if (addBtns() || t >= max) {
          clearInterval(i);
          if (content) new MutationObserver(addBtns).observe(content, { childList: true, subtree: true });
        }
      }
    }, 200);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wait);
  } else {
    wait();
  }
})();