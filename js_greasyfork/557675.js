// ==UserScript==
// @name        Torn Chat Banking Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       none
// @version     1.02
// @author      Bilbosaggings[2323763]
// @description Makes faction chat messages relating to banking withdrawals into clickable links that direct you to the give-to-user page with the requesters ID and Money ammount prefilled to help make banking requests a bit smoother.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557675/Torn%20Chat%20Banking%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557675/Torn%20Chat%20Banking%20Helper.meta.js
// ==/UserScript==

const scriptKey = 'TornChatBankingHelper';

function waitForElement(selector, target = document.body) {
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
}

const log = (...args) => console.log(`[${scriptKey}]: `, ...args);

const err = (...args) => console.error(`[${scriptKey}]: `, ...args);

const processCurrentMessages = async (chatElement) => {
  const messages = await waitForElement('[class^="list"]', chatElement);

  if (!messages) return;

  const children = messages.children;

  if (!children) return;

  for (let i = 0; i < children.length; i++) handleMessage(children[i]);
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

const handleMessage = async (messageElement) => {
  const getValueFromBankString = (message) => {
    if (!message) return null;

    const regex = /\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)([kmb]?)\b/gi;

    const matches = [...message.matchAll(regex)];

    if (!matches.length) return null;

    const targetMatch =
      matches.find((m) => ['k', 'm', 'b'].includes(m[2])) ??
      matches[matches.length - 1];

    const [, value, sign] = targetMatch;

    let numericValue = parseFloat(value.replace(/,/g, ''));

    switch (sign) {
      case 'k':
        numericValue *= 1000;
        break;
      case 'm':
        numericValue *= 1000000;
        break;
      case 'b':
        numericValue *= 1000000000;
        break;
    }

    return numericValue;
  };

  if (!messageElement) return;

  const message = await waitForElement('[class*="message"]', messageElement);

  if (!message) return;

  if (message.getAttribute(scriptKey) === 'true') return;

  message.setAttribute(scriptKey, 'true');

  const messageText = message.innerText;
  const normalised = messageText.trim().toLowerCase();

  const searchStrings = ['bank', 'banke', 'banker', 'bankers'];
  const isMessageForBanker = searchStrings.some((string) =>
    normalised.includes(string),
  );

  if (!isMessageForBanker) return;

  const moneyValue = getValueFromBankString(normalised);

  if (!moneyValue) return;

  const sender = messageElement.querySelector('[class*="sender_"]');

  const senderId = sender.href ? sender.href.split('XID=')[1] : 0;

  if (senderId === 0) return;

  // const paymentLink = `https://www.torn.com/factions.php?step=your#/tab=controls&addMoneyTo=${senderId}&money=${moneyValue}`;
  const paymentLink = `https://www.torn.com/factions.php?step=your#/tab=controls&giveMoneyTo=${senderId}&money=${moneyValue}`;

  // log("New Message: ", { message: messageText, link: paymentLink })

  setTimeout(() => {
    message.innerHTML = `<a href="${paymentLink}" style="color:inherit">${message.innerText}</a>`;
    messageElement.style.border = '1.5px solid green';
  }, 0);
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
    const chat = document.querySelector('[id^="faction-"]');

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
})();
