// ==UserScript==
// @name         Auto Faction Vault
// @namespace    auto_faction_vault.biscuitius
// @version      1.3
// @description  Improvements and automation for the faction vault
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none


// Update 1.3 - Improved performance, fixed triple withdrawal button issue
// Update 1.2 - Fixed withdraw & deposit buttons not updating on-hand balance
// Update 1.1 - Minor UI fix

// @downloadURL https://update.greasyfork.org/scripts/564157/Auto%20Faction%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/564157/Auto%20Faction%20Vault.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Selectors
  const SELECTORS = {
    cashForm: '.cash > form:nth-child(1)',
    cashFormDiv: '.cash > form:nth-child(1) > div:nth-child(2)',
    cashFormSpan: '.cash > form:nth-child(1) > span:nth-child(1)',
    pointsForm: '.points > form:nth-child(1)',
    pointsFormDiv: '.points > form:nth-child(1) > div:nth-child(2)',
    pointsFormSpan: '.points > form:nth-child(1) > span:nth-child(1)',
    cashInput: '.cash > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    pointsInput: '.points > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(2)',
    maxButton: '.points > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)',
    userMoney: '#user-money',
    moneyBalance: '.money-balance'
  };

  // Withdraw button configurations
  const WITHDRAW_AMOUNTS = [2, 5, 10, 25, 50, 100, 250]; // in millions

  let moneyObserver = null;
  let isInitialized = false;

  function getRFC() {
    return $.cookie('rfc_v') || document.cookie.split('; ')
      .find(c => c.startsWith('rfc_v='))
      ?.split('=')[1];
  }

  function createButton(id, text, styles = '') {
    return `<a id="${id}" class="torn-btn" style="${styles}">${text}</a>`;
  }

  function insertButtons() {
    const cashFormDiv = $(SELECTORS.cashFormDiv);
    const pointsFormDiv = $(SELECTORS.pointsFormDiv);

    // Deposit section
    if (!$('#deposit').length && cashFormDiv.length) {
      $(`${SELECTORS.cashFormDiv} > span:nth-child(2)`).remove();
      cashFormDiv.append(createButton('deposit', 'Deposit'));
      cashFormDiv.append("<br style='clear:both'>");
      cashFormDiv.append(createButton('auto-vault-toggle', 'Enable Auto Deposit', 'margin-top:10px'));
      cashFormDiv.append(createButton('vault', 'Deposit All', 'margin-top:10px;margin-left:7px'));
    }

    // Move vault balance to points section
    if ($('.user-points').length && !$(SELECTORS.pointsFormSpan).find('.money-balance').length) {
      const cashOnHand = $(`${SELECTORS.cashFormSpan} > p:nth-child(2)`).clone();
      $(SELECTORS.pointsFormSpan).html('').append(cashOnHand);
      $(`${SELECTORS.pointsFormSpan} > p:nth-child(1)`).html((_, html) => 
        html.replace(/and a balance of /, 'Vault Balance: ')
      );
      $(SELECTORS.moneyBalance).css('font-weight', 'bold');
      $(`${SELECTORS.cashFormSpan} > p:nth-child(2)`).remove();
      $(`${SELECTORS.cashFormSpan} > p:nth-child(1)`).append(' on hand');
    }

    // Withdraw section
    if ($('.points .no-max-value').length) {
      pointsFormDiv.html('<div class="input-money-group"><span class="input-money-symbol">$<input type="button" class="wai-btn"></span><input class="amount input-money" type="text" data-money="0"></div>');
    }

    if (!$('#withdraw').length && pointsFormDiv.length) {
      pointsFormDiv.append(createButton('withdraw', 'Withdraw', 'margin-left:1px'));
      pointsFormDiv.append("<br style='clear:both'>");
      
      WITHDRAW_AMOUNTS.forEach((amount, index) => {
        const marginLeft = index === 0 ? '' : 'margin-left:7px;';
        pointsFormDiv.append(createButton(`withdraw-${amount}m`, `${amount}m`, `${marginLeft}margin-top:10px`));
      });
    }
  }

  function setupAutoVaultToggle() {
    const toggleButton = $('#auto-vault-toggle');
    const userMoneyElement = $(SELECTORS.userMoney)[0];
    
    if (!userMoneyElement || toggleButton.data('listener-attached')) return;
    
    toggleButton.data('listener-attached', true).on('click', function() {
      if (userMoneyElement.hasAttribute('data-listener')) {
        toggleButton.text('Enable Auto Deposit');
        userMoneyElement.removeAttribute('data-listener');
        if (moneyObserver) {
          moneyObserver.disconnect();
          moneyObserver = null;
        }
      } else {
        toggleButton.text('Disable Auto Deposit');
        userMoneyElement.setAttribute('data-listener', 'true');
        moneyObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-money') {
              const money = parseInt(userMoneyElement.getAttribute('data-money'), 10);
              if (money > 3000000) {
                const reactionTime = 160 + Math.floor(Math.random() * 80);
                setTimeout(vault, reactionTime);
              }
            }
          }
        });
        moneyObserver.observe(userMoneyElement, { attributes: true });
      }
    });
  }

  function deposit() {
    const amount = parseInt($(SELECTORS.cashInput).val(), 10);
    $.post(`https://www.torn.com/factions.php?rfcv=${getRFC()}`, {
      ajax: true,
      step: 'armouryDonate',
      type: 'cash',
      amount: amount
    });
  }

  function vault() {
    const amount = parseInt($(SELECTORS.userMoney)[0].getAttribute('data-money'), 10);
    $.post(`https://www.torn.com/factions.php?rfcv=${getRFC()}`, {
      ajax: true,
      step: 'armouryDonate',
      type: 'cash',
      amount: amount
    });
  }

  function withdraw(amount) {
    $.post(`https://www.torn.com/page.php?sid=factionsGiveMoney&rfcv=${getRFC()}`, {
      ajax: true,
      step: 'giveMoney',
      receiver: localStorage.getItem('sessionTokenOwner'),
      amount: parseInt(amount, 10)
    });
  }

  function attachEventListeners() {
    $('#deposit').off('click').on('click', deposit);
    $('#vault').off('click').on('click', vault);
    $('#withdraw').off('click').on('click', () => withdraw($(SELECTORS.pointsInput).val()));
    
    WITHDRAW_AMOUNTS.forEach(amount => {
      $(`#withdraw-${amount}m`).off('click').on('click', () => withdraw(amount * 1000000));
    });

    $(SELECTORS.maxButton).off('click').on('click', function() {
      const vaultMoney = $(SELECTORS.moneyBalance).text().replace(/,/g, '');
      $(SELECTORS.pointsInput).val(vaultMoney);
    });
    
    setupAutoVaultToggle();
  }

  function initialize() {
    if (isInitialized) return;
    
    insertButtons();
    
    if ($('#deposit').length && $('#withdraw').length) {
      attachEventListeners();
      isInitialized = true;
    }
  }

  // Use MutationObserver instead of setInterval for better performance
  const observer = new MutationObserver(() => {
    if (!isInitialized) {
      initialize();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial check
  $(document).ready(initialize);
})();

