// ==UserScript==
// @name        ABCya Games Paywall Bypass
// @namespace   https://greasyfork.org/users/1545341
// @match       *://www.abcya.com/*
// @grant       GM_getResourceText
// @version     2.5
// @license     MIT
// @author      abcenjoyer
// @description User script to bypass the paywall on ABCya games. Fullscreen button support requires synchronous page mode to work reliably, if you're using Violentmonkey on a Chromium-based browser.
// @run-at      document-start
// @inject-into page
// @resource    main.js https://www.abcya.com/client/main-353a87d78169b430c481.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558142/ABCya%20Games%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/558142/ABCya%20Games%20Paywall%20Bypass.meta.js
// ==/UserScript==

function hookMutation(selector, callback) {
  const observer = new MutationObserver((mutations) => {
    const element = document.querySelector(selector);

    if (element) {
      callback(element);
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

function createGameIFrame(gameName) {
  const gameFrame = document.createElement("iframe");

  gameFrame.id = "abcya-game-iframe";
  gameFrame.dataset.testid = gameFrame.id;
  gameFrame.frameborder = "0";
  gameFrame.allow = "accelerometer *;magnetometer *;gyroscope *;";

  gameFrame.title = gameName;
  gameFrame.src = "/gameproxy/" + gameName;

  return gameFrame;
}

function getBasename(pathname) {
  return pathname.split("/").reverse()[0];
}

function isGamePage(pathname) {
  // path section after /games/ must be the last
  return getBasename(pathname) === pathname.replace("/games/", "");
}

if (isGamePage(location.pathname)) {
  let newScript = GM_getResourceText("main.js");

  // remove code for fullscreen button paywall
  newScript = newScript.replace("if(rn(c.H0.free))", "");
  newScript = newScript.replace('else Fa(p),d(n.createElement(n.Fragment,null,n.createElement("div",{className:"modal-content-header"},Za("join.0")),n.createElement("p",null,Za("game.fullscreen.signup")),n.createElement("div",null,n.createElement("button",{type:"button",onClick:()=>{Ga({...p,interaction:"primary cta"}),xn(a.pathname,"game-fullscreen-modal"),qa("full screen","in content",Za("game.fullscreen.title.0"),a.pathname),t(La.SUBSCRIBE)},className:"button-flat-color pt-green round auto"},Za("join.3"),n.createElement(Tl,{className:"inline-arrow"}))))),nn(c.H0.free)&&d(n.createElement(n.Fragment,null,n.createElement("div",{className:"modal-content-header"},Za("join.0")),n.createElement("p",null,Za("game.fullscreen.upgrade")),n.createElement("div",null,n.createElement("button",{type:"button",onClick:()=>{Ga({...p,interaction:"primary cta"}),t({pathname:La.MANAGE,hash:(0,c.zr)("subscription")})},className:"button-flat-color pt-green round auto"},Za("manage.title.0"),n.createElement(Tl,{className:"inline-arrow"}))))),i(!0)', "");

  const newScriptElement = document.createElement("script");
  newScriptElement.textContent = newScript;

  hookMutation("head", (element) => {
    element.appendChild(newScriptElement);
  });

  hookMutation("script[src='/client/main-57a8e779cb9fe9a9c09a.js']", (element) => {
    element.remove();
  });

  // hook will never trigger if there is no game paywall
  hookMutation(".game-screenshots", (element) => {
    const parent = element.parentElement;

    element.remove();

    // game iframe belongs to the same parent as the screenshots used by the paywall
    parent.appendChild(createGameIFrame(getBasename(location.pathname)));
  });
}

// this script runs on page body load, so reload every time the URL is changed
unsafeWindow.history.pushState = function(_state, _title, url) {
  if (url) {
    location.href = url;
  }
};