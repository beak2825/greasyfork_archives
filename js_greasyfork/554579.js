// ==UserScript==
// @name         Nonzee
// @description  Silly goober mod menu that just does shit
// @author       GuhCDN
// @match        https://cyganworld.bluefong2.repl.co/
// @match        http://bonzi.gay
// @match        https://bonzi.gay
// @icon         https://giggityfiles.github.io/favicon.ico
// @grant        none
// @license      GuhCDN
// @version 0.0.14.20251104
// @namespace https://greasyfork.org/users/1069905
// @downloadURL https://update.greasyfork.org/scripts/554579/Nonzee.user.js
// @updateURL https://update.greasyfork.org/scripts/554579/Nonzee.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var menuContent = `
    <div id='bg'><a href='#'>Background Options</a></div><br>
    <div id='menuoptions'><a href='#'>Menu Options</a></div><br>
    <div id='inject1'><a href='#'>Inject webntrack.js</a></div><br>
    <div id='inject2'><a href='#'>Inject flood.js</a></div>
  `;

  var menuButton = document.createElement('button');
  menuButton.innerText = 'Menu';
  menuButton.style.backgroundColor = 'red';
  menuButton.style.color = 'white';
  menuButton.style.position = 'fixed';
  menuButton.style.top = '10px';
  menuButton.style.right = '10px';

  var menuContainer = document.createElement('div');
  menuContainer.id = 'menuf';
  menuContainer.style.background = 'linear-gradient(180deg, black, gray)';
  menuContainer.style.color = 'white';
  menuContainer.style.width = '200px';
  menuContainer.style.height = '400px';
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = '50%';
  menuContainer.style.left = '50%';
  menuContainer.style.transform = 'translate(-50%, -50%)';
  menuContainer.style.fontFamily = '"Roboto Condensed", sans-serif';
  menuContainer.innerHTML = `
    <h3>Menu</h3>
    <hr>
    ${menuContent}
    <div id='close' style='bottom: 20px; position: absolute; width:100%; text-align:center;'>
      <br><br><button id='closeBtn' style='color: black;'>Close Menu</button>
    </div>
  `;
  menuContainer.style.display = 'none';

  document.body.appendChild(menuButton);
  document.body.appendChild(menuContainer);

  var robotoLink = document.createElement('link');
  robotoLink.rel = 'stylesheet';
  robotoLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap';
  document.head.appendChild(robotoLink);

  menuButton.addEventListener('click', function() {
    menuContainer.style.display = 'block';
    menuButton.style.display = 'none';
  });

  var closeButton = menuContainer.querySelector('#closeBtn');
  closeButton.addEventListener('click', function() {
    menuContainer.style.display = 'none';
    menuButton.style.display = 'block';
  });

  var inject1 = menuContainer.querySelector('#inject1 a');
  var inject2 = menuContainer.querySelector('#inject2 a');

  inject1.addEventListener('click', function(e) {
    e.preventDefault();
    if (inject1.getAttribute('data-injected') === 'true') return;
    var s1 = document.createElement('script');
    s1.src = 'https://cmd-hue.github.io/webntrack.js';
    s1.async = true;
    document.body.appendChild(s1);
    inject1.textContent = 'webntrack.js Injected';
    inject1.style.color = 'lime';
    inject1.setAttribute('data-injected', 'true');
  });

  inject2.addEventListener('click', function(e) {
    e.preventDefault();
    if (inject2.getAttribute('data-injected') === 'true') return;
    var s2 = document.createElement('script');
    s2.src = 'https://cmd-hue.github.io/flood.js';
    s2.async = true;
    document.body.appendChild(s2);
    inject2.textContent = 'flood.js Injected';
    inject2.style.color = 'lime';
    inject2.setAttribute('data-injected', 'true');
  });
})();

