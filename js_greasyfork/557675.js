// ==UserScript==
// @name        Torn Chat Banking Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       GM_addStyle
// @version     1.11
// @author      Bilbosaggings[2323763]
// @description Makes faction chat messages relating to banking withdrawals into clickable links that direct you to the give-to-user page with the requesters ID and Money ammount prefilled to help make banking requests a bit smoother. Also features a toggle that prevents withdrawls that would take the user into a negative balance.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557675/Torn%20Chat%20Banking%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557675/Torn%20Chat%20Banking%20Helper.meta.js
// ==/UserScript==

const scriptKey = 'TornChatBankingHelper';

const defaultSettings = {
  'script-allow-negative': false,
};

const log = (...args) => console.log(`[${scriptKey}]: `, ...args);

const err = (...args) => console.error(`[${scriptKey}]: `, ...args);

const waitForElement = async (selector, target = document.body) => {
  return new Promise((resolve) => {
    if (target.querySelector(selector)) {
      resolve(target.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (target.querySelector(selector)) {
        resolve(target.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(target, {
      subtree: true,
      childList: true,
    });
  });
};

let storageCache;

const clearStorage = () => {
  localStorage.removeItem(scriptKey);
  storageCache = null;
  log('Storage Cleared');
};

const getStorage = (key) => {
  const data = localStorage.getItem(scriptKey);

  const json = JSON.parse(data) ?? storageCache ?? defaultSettings;

  storageCache = json;

  return key ? json[key] : json;
};

const updateStorage = (key, value) => {
  const data = getStorage();

  data[key] = value;

  storageCache = data;

  localStorage.setItem(scriptKey, JSON.stringify(data));
};

const handleChatMessage = async (messageElement) => {
  const getValueFromBankString = (message) => {
    if (!message) return null;

    const thousandsDenominations = ['k', 'thousand', 'thousands'];

    const millionsDenominations = ['m', 'mil', 'million', 'millions'];

    const billionsDenominations = ['b', 'bn', 'billion', 'billions'];

    const moneyDenominations = [
      ...thousandsDenominations,
      ...millionsDenominations,
      ...billionsDenominations,
    ];

    const moneyDenominationsRegexSegment = moneyDenominations.join('|');

    const regex = new RegExp(
      '\\b(?:all|max(?:imum)?|full|bal(?:ance)|(?:between\\s+)?(?:[$£€]\\s*)?(?:\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)(?:\\s*(?:' +
        moneyDenominationsRegexSegment +
        '))?\\s*(?:-|to|–|—|and)\\s*(?:[$£€]\\s*)?(?:\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)(?:\\s*(?:' +
        moneyDenominationsRegexSegment +
        '))?|(?:[$£€]\\s*)?(\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)(?:\\s*(' +
        moneyDenominationsRegexSegment +
        '))?)\\b',
      'gi',
    );

    const matches = [...message.matchAll(regex)];

    if (!matches.length) return null;

    const targetMatch =
      matches.find((m) => moneyDenominations.includes(m[2])) ??
      matches[matches.length - 1];

    if (targetMatch[1] === undefined && targetMatch[2] === undefined)
      return 'SEND_FULL';

    const [_, value, sign] = targetMatch;

    let numericValue = parseFloat(value.replace(/,/g, ''));

    if (thousandsDenominations.includes(sign)) numericValue *= 1000;
    else if (millionsDenominations.includes(sign)) numericValue *= 1000000;
    else if (billionsDenominations.includes(sign)) numericValue *= 1000000000;

    return numericValue;
  };

  if (!messageElement) return;

  const message = await waitForElement('[class*="message"]', messageElement);

  if (!message) return;

  if (message.getAttribute(scriptKey) === 'true') return;

  message.setAttribute(scriptKey, 'true');

  const messageText = message.innerText;
  const normalised = messageText.trim().toLowerCase();

  const searchStrings = [
    'bank',
    'banke',
    'banker',
    'bankers',
    'withdraw',
    'balance',
    'vault',
  ];
  const isMessageForBanker = searchStrings.some((string) =>
    normalised.includes(string),
  );

  if (!isMessageForBanker) return;

  const moneyValue = getValueFromBankString(normalised);

  if (!moneyValue) return;

  const sender = messageElement.querySelector('[class*="sender_"]');

  const senderId = sender.href ? sender.href.split('XID=')[1] : 0;

  if (senderId === 0) return;

  const paymentLink = `https://www.torn.com/factions.php?step=your#/tab=controls&giveMoneyTo=${senderId}&money=${moneyValue}`;

  setTimeout(() => {
    message.innerHTML = `<a href="${paymentLink}" style="color:inherit">${message.innerText}</a>`;
    messageElement.style.border = '1.5px solid green';
  }, 0);
};

const processCurrentMessages = async (chatElement) => {
  const messages = await waitForElement('[class^="list"]', chatElement);

  if (!messages) return;

  const children = messages.children;

  if (!children) return;

  for (let i = 0; i < children.length; i++) handleChatMessage(children[i]);
};

const watchForNewMessages = async (chatElement) => {
  // const messages = chatElement.querySelector('[class^="list"]');
  const messages = await waitForElement('[class^="list"]', chatElement);

  const observer = new MutationObserver(() => {
    processCurrentMessages(chatElement);
  });

  observer.observe(messages, {
    childList: true,
    subtree: true,
  });

  return observer;
};

const handleGiveToUserPage = async () => {
  const urlParams = new URLSearchParams(
    window.location.hash.split('?')[1] ??
      window.location.hash.replace(/^#\/?/, ''),
  );

  if (
    !window.location.pathname.includes('factions.php') ||
    urlParams.get('tab') !== 'controls'
  )
    return;

  const getUsersBalance = async () => {
    const usersBalance = await waitForElement(
      '[class*="form"] p span[class*="nowrap"]',
    );

    const extractBalance = () => {
      const text = usersBalance.textContent;

      const match = text.match(/\$\s*([\d,]+)/);

      return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
    };

    const balance = extractBalance();

    if (balance !== null) return balance;

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const newBalance = extractBalance();

        if (newBalance !== null){
          observer.disconnect();

          resolve(newBalance);
        }
      });

      observer.observe(usersBalance, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
  };

  const createNegativeBalancesOption = () => {
    const container = document.createElement('div');
    container.id = `${scriptKey}-container-script-allow-negative`;
    container.className = 'choice-container';
    container.style.width = '100%';

    let checkedState = getStorage('script-allow-negative');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'script-allow-negative';
    input.className = 'radio-css dark-bg';
    input.checked = checkedState;

    input.onclick = async (e) => {
      checkedState = !checkedState;

      updateStorage('script-allow-negative', checkedState);

      const giveToUserButton = await waitForElement('[class*="ctaButton"]');

      if (!checkedState) {
        if (
          giveToUserButton.classList.contains(
            `${scriptKey}-disallow-negative-balances`,
          )
        )
          giveToUserButton.disabled = true;
        return;
      }

      giveToUserButton.disabled = false;
    };

    const label = document.createElement('label');
    label.className = 'marker-css';
    label.htmlFor = input.id;
    label.textContent = 'Allow Negative Balances';

    container.appendChild(input);
    container.appendChild(label);

    return container;
  };

  const insertNegativeBalancesOption = async () => {
    const radios = await waitForElement('[role="radiogroup"]');

    const element = createNegativeBalancesOption();

    if (radios.querySelector(`#${element.id}`)) return;

    radios.insertAdjacentElement('afterend', element);
  };

  const handleRedirect = async () => {
    const requestedAmmount = urlParams.get('money');

    if (!requestedAmmount) return;

    try {
      const balance = await getUsersBalance() ?? 0;

      const giveToUserButton = await waitForElement('[class*="ctaButton"]');
      giveToUserButton.disabled = false;

      const giveToUserInput = await waitForElement(
        'input.input-money:not([type="hidden"])',
      );

      if (requestedAmmount > balance || requestedAmmount === 'SEND_FULL')
        giveToUserInput.value = balance;
      else
        giveToUserInput.value = requestedAmmount;

      giveToUserInput.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
      err(`Error Updating Give-To-User Input.\n`, e);
    }
  };

  const interceptMoneySend = () => {
    document.addEventListener(
      'input',
      async (e) => {
        const target = e.target;

        if (!target?.matches('input.input-money:not([type="hidden"])')) return;

        const value = parseInt(target.value.replace(/,/g, ''), 10);

        if (!value || isNaN(value) || value === 0) return;

        const balance = await getUsersBalance();

        const giveToUserButton = await waitForElement('[class*="ctaButton"]');

        if (value < balance) {
          giveToUserButton.disabled = false;

          giveToUserButton.classList.remove(
            `${scriptKey}-disallow-negative-balances`,
          );

          return;
        } else {
          giveToUserButton.classList.add(
            `${scriptKey}-disallow-negative-balances`,
          );

          if (!getStorage('script-allow-negative'))
            giveToUserButton.disabled = true;
        }
      },
      true,
    );
  };

  try {
    log('Handling Redirect');
    await handleRedirect();
  } catch (e) {
    err('Error Handling Redirect. Error: ', e);
  }

  try {
    log('Inserting Negative Balances Option');
    await insertNegativeBalancesOption();
  } catch (e) {
    err('Error Adding Negative Balances Option. Error: ', e);
  }

  try {
    log('Intercepting Money Sends');
    interceptMoneySend();
  } catch (e) {
    err('Error Setting Intercept Money Sends. Error: ', e);
  }
};

(() => {
  let factionChat = null;
  let factionChatObserver = null;

  const detach = () => {
    if (
      !factionChatObserver ||
      typeof factionChatObserver.disconnect !== 'function'
    )
      return; //Pda fix

    factionChatObserver.disconnect();
    factionChatObserver = null;
    log('Disconnected Message Observer');
  };

  const chatObserver = new MutationObserver(() => {
    const chat = document.querySelector('div[class^="root"][id^="faction-"]');

    if (chat && !factionChat) {
      log('Chat is now visible');
      factionChat = chat;

      try {
        log('Processing Current Messages');
        processCurrentMessages(factionChat);
      } catch (error) {
        err('Error Processing Current Messages: ', error);
      } finally {
        log('Finished Processing Current Messages');
      }

      if (factionChatObserver) detach();

      try {
        log('Watching For New Messages In Faction Chat');
        factionChatObserver = watchForNewMessages(factionChat);
      } catch (error) {
        err('Error Watching For New Messages: ', error);
      }
    }
    if (!chat && factionChat) {
      log('Chat is not visible');
      factionChat = null;
      detach();
    }
  });

  chatObserver.observe(document.body, {
    subtree: true,
    childList: true,
  });

  handleGiveToUserPage();
})();

GM_addStyle(`
  .${scriptKey}-disallow-negative-balances {
    --btn-background: linear-gradient(
      180deg,
      #a42a2a 0%,
      #b03030 25%,
      #8f2323 60%,
      #7c1d1d 78%,
      #6b1717 100%
    ) !important;
    --btn-border: 1px solid #5a1414 !important;
    --btn-color: #ffffff !important;
    --btn-text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35) !important;

    background: var(--btn-background) !important;
    border: var(--btn-border) !important;
    color: var(--btn-color) !important;
    text-shadow: var(--btn-text-shadow) !important;

    cursor: pointer !important;
    transition: background 0.15s ease, filter 0.15s ease;
  }

  .${scriptKey}-disallow-negative-balances:hover:not(:disabled):not([aria-disabled="true"]) {
    --btn-background: linear-gradient(
      180deg,
      #b03030 0%,
      #c03535 25%,
      #9b2626 60%,
      #8a2020 78%,
      #781a1a 100%
    ) !important;
    background: var(--btn-background) !important;
    filter: brightness(1.1);
  }

  .${scriptKey}-disallow-negative-balances:active:not(:disabled):not([aria-disabled="true"]) {
    --btn-background: linear-gradient(
      180deg,
      #7c1d1d 0%,
      #8a2020 25%,
      #6b1717 60%,
      #5a1414 78%,
      #4a1010 100%
    ) !important;
    background: var(--btn-background) !important;
    filter: brightness(0.9);
  }

  .${scriptKey}-disallow-negative-balances:disabled,
  .${scriptKey}-disallow-negative-balances[aria-disabled="true"] {
    --btn-background: linear-gradient(
      180deg,
      #5f2a2a 0%,
      #6b2f2f 25%,
      #532222 60%,
      #471c1c 78%,
      #3d1717 100%
    ) !important;
    --btn-border: 1px solid #3a1212 !important;
    --btn-color: #e0bcbc !important;
    --btn-text-shadow: none !important;

    background: var(--btn-background) !important;
    border: var(--btn-border) !important;
    color: var(--btn-color) !important;

    cursor: not-allowed !important;
    opacity: 0.9 !important;
  }
`);
