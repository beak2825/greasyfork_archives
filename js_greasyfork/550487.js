// ==UserScript==
// @name         Internet Roadtrip - Anti-botting system
// @description  This is how anti-bots are supposed to work, right? For neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/internet-roadtrip/not-a-robot-collab
// @version      1.1.0
// @author       Netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/*
// @match        https://embed.neal.fun/not-a-robot/*
// @icon         https://neal.fun/favicons/internet-roadtrip.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/550487/Internet%20Roadtrip%20-%20Anti-botting%20system.user.js
// @updateURL https://update.greasyfork.org/scripts/550487/Internet%20Roadtrip%20-%20Anti-botting%20system.meta.js
// ==/UserScript==

(async () => {
  if (location.hostname === 'embed.neal.fun') {
    GM_addStyle(`
    html {
      background-color: transparent !important;
    }

    body {
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
    }

    #__nuxt {
      width: 100%;
      max-height: 100%;
      margin: auto;
      padding-right: 8px;
      overflow: hidden auto;
      scrollbar-width: thin;
    }

    .captcha-container {
      background-color: white;
    }
    `);
    return;
  }

  const CSS_PREFIX = 'not-a-robot-anti-botting-system-';
  const cssClass = (... names) => names.map((name) => `${CSS_PREFIX}${name}`).join(' ');

  const dice = (min, max) => Math.random() * (max - min) + min;

  const MAX_NOT_A_ROBOT_LEVELS = 48;

  const containerVDOM = await IRF.vdom.container;

  GM_addStyle(`
  .${cssClass('frame')} {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: 9999;
    animation: ${cssClass('frame-fade-in')} 200ms linear;
  }

  .${cssClass('close-button')} {
    position: absolute;
    top: 50%;
    left: 0;
    width: 1.5rem;
    aspect-ratio: 1;
    translate: -100% -50%;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: white;

    &::after {
      content: url("https://neal.fun/lets-settle-this/no.svg");
      filter: grayscale(1) contrast(1);
    }
  }

  @keyframes ${cssClass('frame-fade-in')} {
    0% { scale: 0; }
    100% { scale: 1; }
  }
  `);

  const notARobotIframeContainer = document.createElement('div');
  notARobotIframeContainer.classList.add(cssClass('frame'));

  const notARobotCloseBtn = document.createElement('button');
  notARobotCloseBtn.classList.add(cssClass('close-button'));
  notARobotIframeContainer.appendChild(notARobotCloseBtn);

  const notARobotIframe = document.createElement('iframe');
  notARobotIframe.setAttribute('width', 400);
  notARobotIframe.setAttribute('height', 540);
  notARobotIframe.setAttribute('frameborder', '0');
  notARobotIframe.setAttribute('allow', 'camera'); // for level 39
  notARobotIframeContainer.appendChild(notARobotIframe);

  let lastSeenLevel = 0;
  let lastCompletedLevel = 0;
  let lastMessageHandler = null;

  function closePrevious() {
    notARobotIframeContainer.remove();
    if (lastMessageHandler) {
      window.removeEventListener('message', lastMessageHandler);
      lastMessageHandler = null;
    }
  }

  notARobotCloseBtn.addEventListener('click', closePrevious);

  containerVDOM.state.vote = new Proxy(containerVDOM.state.vote, {
    apply(ogVote, thisArg, args) {
      const callVote = () => ogVote.apply(thisArg, args);

      if (containerVDOM.data.voted) {
        return callVote();
      }

      const mode = GM_getValue('mode', 'random');
      const probability = GM_getValue('probability', 0.5);

      if (Math.random() > probability) {
        return callVote();
      }

      const minLevel = Math.max(1, GM_getValue('minLevel', 1));
      const maxLevel = Math.min(GM_getValue('maxLevel', MAX_NOT_A_ROBOT_LEVELS - 1), MAX_NOT_A_ROBOT_LEVELS + 1);

      let level;
      switch (mode) {
        case 'sequential': {
          if (lastCompletedLevel >= MAX_NOT_A_ROBOT_LEVELS) {
            return callVote();
          }

          level = lastCompletedLevel + 1;
          break;
        }
        case 'random': {
          do {
            level = Math.floor(dice(minLevel, maxLevel));
          } while (minLevel !== maxLevel && level === lastSeenLevel);
          break;
        }
        default: {
          console.warn('Unknown mode');
          return callVote();
        }
      }

      closePrevious();
      notARobotIframe.src = `https://embed.neal.fun/not-a-robot/embed/${level}`;

      const handleMessage = (event) => {
        if (event.origin !== 'https://embed.neal.fun') {
          return;
        }

        if (event.data?.type !== 'captcha-completed') {
          return;
        }


        lastCompletedLevel = level;
        closePrevious();
        callVote();
      };
      lastMessageHandler = handleMessage;

      window.addEventListener('message', handleMessage);

      document.body.appendChild(notARobotIframeContainer);
    }
  });
})();