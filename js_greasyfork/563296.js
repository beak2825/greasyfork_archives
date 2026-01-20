// ==UserScript==
// @name         Torn - VAULT TEST SCRIPT
// @namespace    quick.vault.test
// @version      0.1
// @description  Adds a button below your name (on the sidebar view) that will vault all of your on-hand cash when clicked. A change to a value that isn't zero will turn the button red.
// @author       Baccy
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563296/Torn%20-%20VAULT%20TEST%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/563296/Torn%20-%20VAULT%20TEST%20SCRIPT.meta.js
// ==/UserScript==

/*
INSPIRED BY MITZA'S GHOST TRADE AUTO DESPOIT SCRIPT
https://gist.githubusercontent.com/mitza0505/f400d1c33df959a9d31c8597a54f4e86/raw/8436ea3f6bf565347fb255cedca8ca061352bf83/bank.js
*/

(function() {
    'use strict';

	GM_addStyle(`
		.quick-btn-restyled {
			color: #f0f0f0;
			background-color: #1e1e1e;
			border: 1px solid #333;
			border-radius: 8px;
			padding: 25px 0;
			font-size: 30px;
			font-weight: 600;
			text-transform: uppercase;
			text-decoration: none;
			box-sizing: border-box;
			width: 150px;
			margin: auto;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			line-height: 1;
			transition: all 0.2s ease-in-out;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		}
		.quick-btn-restyled:hover {
			background-color: #2a2a2a;
			border-color: #444;
			color: #ffffff;
			cursor: pointer;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
		}
		.quick-btn-restyled:active {
			background-color: #111;
			transform: scale(0.98);
		}
	`);

    let bankAllButton = null;

    function addButton() {
        if (document.querySelector('.duckwowowvault')) return;

        const id = Array.from(document.querySelectorAll('a'))
        .map(a => a.href.match(/p=properties&ID=(\d+)/))
        .find(match => match)?.[1];
        if (!id || !/^\d+$/.test(id)) {
            alert('Property ID not found');
            return;
        }

        let rfc;
        rfc = getRFC('v');
        if (!rfc) rfc = getRFC('id');
        if (!rfc) {
            alert('RFC not found');
            return;
        }
        const url = `https://www.torn.com/properties.php?rfcv=${rfc}`;

        let container = document.querySelector(`[class*='point-block']`);
        if(!container) container = document.querySelector(`[class='points-mobile___gpalH']`).children[0];
        bankAllButton = document.createElement('button');
        bankAllButton.className = 'quick-btn-restyled duckwowowvault';
        bankAllButton.textContent = 'Vault';
        bankAllButton.style = 'top: 3px';
        bankAllButton.style = 'display:block';
        bankAllButton.id='customTradeBtn';
        bankAllButton.addEventListener('click', () => {
            const deposit = document.querySelector('#user-money').getAttribute('data-money');
            if (!deposit || deposit === '0') return;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `step=vaultProperty&deposit=${deposit}&ID=${id}`
            })
                .then(response => response.json())
                .then(data => {
                console.log(data);
            });
        });

        function cashWatcher() {
            const element = document.querySelector('#user-money');
            const cash = parseInt(element.getAttribute('data-money'));

            const observer = new MutationObserver(() => {
                const cash = parseInt(element.getAttribute('data-money'));

                if (cash > 0) bankAllButton.style.background = 'red';
                else bankAllButton.style.background = '';
            });
            observer.observe(element, { attributes: true, attributeFilter: ['data-money'] });
        }

        container.parentElement.insertBefore(bankAllButton, container);
        cashWatcher();
    }

    function getRFC(id) {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].split('=');
            if (id === 'v' && name === 'rfc_v') {
                return value;
            } else if (id === 'id' && name === 'rfc_id') {
                return value;
            }
        }
        return null;
    }


    const observer = new MutationObserver(() => {
        if (window.location.href.includes('tab=vault') && document.querySelector(`[class='bar___Bv5Ho life___PlnzK bar-desktop___p5Cas']`)) addButton();
        if (bankAllButton && document.querySelector('.vault-opt')?.style.display === 'none') bankAllButton.style.display = 'none';
        else if (bankAllButton && document.querySelector('.vault-opt')?.style.display !== 'none') bankAllButton.style.display = 'block';
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.href.includes('tab=vault') && document.querySelector(`[class='bar___Bv5Ho life___PlnzK bar-desktop___p5Cas']`)) addButton();

    setTimeout(() => {
        if (!window.location.href.includes('tab=vault')) alert('"tab=vault" not found in the URL');
        if (!document.querySelector(`[class='bar___Bv5Ho life___PlnzK bar-desktop___p5Cas']`)) alert(`[class='bar___Bv5Ho life___PlnzK bar-desktop___p5Cas'] element not found on the page for button placement`);
    }, 5000);
})();