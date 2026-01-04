// ==UserScript==
// @name         Language reactor subtitle extender
// @namespace    http://tampermonkey.net/
// @version      3.3
// @license MIT
// @description  So that Yomitan (or other popup dictionary) can pick up full sentence.
// @author       Birudo
// @match        *://www.youtube.com/watch*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/549263/Language%20reactor%20subtitle%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/549263/Language%20reactor%20subtitle%20extender.meta.js
// ==/UserScript==
// src/interceptor.ts
var interceptors = {
  onResponseReady: []
};
function proxy(config) {
  if (config.onResponseReady) {
    interceptors.onResponseReady.push(config.onResponseReady);
  }
  return () => {
    interceptors.onResponseReady = interceptors.onResponseReady.filter((handler) => handler !== config.onResponseReady);
  };
}
function main() {
  if (window.__XHR_INTERCEPTOR_INSTALLED__)
    return;
  window.__XHR_INTERCEPTOR_INSTALLED__ = true;
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  function onRequestOpen(xhr, method, url, async, user, password) {}
  function onRequestSend(xhr, body) {
    return { proceed: true, newBody: body };
  }
  function onResponseReady(xhr) {}
  XMLHttpRequest.prototype.open = function(method, url, async = true, user, password) {
    try {
      this._method = method;
    } catch (e) {}
    try {
      this._url = url;
    } catch (e) {}
    try {
      this._async = async;
    } catch (e) {}
    try {
      this._openArgs = { method, url, async, user, password };
    } catch (e) {}
    try {
      onRequestOpen(this, method, url, async, user, password);
    } catch (e) {
      console.error("onRequestOpen error", e);
    }
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    try {
      if (!this._reqHeaders)
        this._reqHeaders = {};
      this._reqHeaders[name] = value;
    } catch (e) {}
    return origSetRequestHeader.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(body) {
    let decision = { proceed: true, newBody: body };
    try {
      decision = onRequestSend(this, body) || decision;
    } catch (e) {
      console.error("onRequestSend error", e);
    }
    if (!decision.proceed) {
      try {
        this.abort();
      } catch (e) {}
      try {
        const ev = new Event("error");
        this.dispatchEvent(ev);
      } catch (e) {}
      return;
    }
    const _this = this;
    const handler = function() {
      if (_this.readyState === 4) {
        let respDecision = {
          modify: false
        };
        try {
          interceptors.onResponseReady.reduce((acc, handler2) => {
            const result = handler2(_this);
            return {
              modify: acc.modify || result.modify,
              newResponseText: result.newResponseText || acc.newResponseText
            };
          }, respDecision);
        } catch (e) {
          console.error("onResponseReady error", e);
        }
        if (respDecision && respDecision.modify) {
          try {
            const newText = respDecision.newResponseText === undefined ? "" : String(respDecision.newResponseText);
            try {
              Object.defineProperty(_this, "responseText", {
                configurable: true,
                enumerable: true,
                get() {
                  return newText;
                }
              });
            } catch (e) {
              console.warn("Could not override responseText:", e);
            }
            try {
              Object.defineProperty(_this, "response", {
                configurable: true,
                enumerable: true,
                get() {
                  return newText;
                }
              });
            } catch (e) {
              console.warn("Could not override response:", e);
            }
          } catch (e) {
            console.error("Failed to apply response override", e);
          }
        }
      }
    };
    this.addEventListener("readystatechange", handler);
    return origSend.call(this, decision.newBody);
  };
  try {
    const proto = XMLHttpRequest.prototype;
    if (!proto.__xhrPatchedToString) {
      proto.__xhrPatchedToString = true;
      const origToString = proto.toString;
      proto.toString = function() {
        try {
          return origToString.call(this);
        } catch (e) {
          return "[object XMLHttpRequest]";
        }
      };
    }
  } catch (e) {}
}
main();

// src/index.user.ts
var subtitleMap = new Map;
(() => {
  proxy({
    onResponseReady: (xhr) => {
      if (!xhr.responseURL.includes("/timedtext")) {
        return { modify: false };
      }
      const url = new URL(xhr.responseURL);
      const lang = url.searchParams.get("lang");
      const tlang = url.searchParams.get("tlang");
      if (lang) {
        subtitleMap.set(tlang ?? lang, xhr);
      } else {
        console.error("No language found in /timedtext request.");
      }
      return { modify: false };
    }
  });
  function observeSelector(selector, callback) {
    function startObserving(element) {
      const observer = new MutationObserver((mutations) => {
        callback(mutations, element);
      });
      observer.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });
      console.log(`Now observing: ${selector}`);
    }
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      startObserving(existingElement);
      return;
    }
    const bodyObserver = new MutationObserver((mutations, observer) => {
      const element = document.querySelector(selector);
      if (element) {
        startObserving(element);
        observer.disconnect();
      }
    });
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  const getCurrentSubtitleLanguage = getCurrentSubtitleLanguageFactory();
  const getPlayerInstance = getPlayerInstanceFactory();
  function addSubtitleExtensionElements() {
    if (document.querySelector(".subtitle-extension-before")) {
      return;
    }
    const originalSubtitleEle = document.querySelector("#lln-subs");
    if (!originalSubtitleEle) {
      console.error(`No #lln-subs found`);
      return;
    }
    const currentSubtitleLanguage = getCurrentSubtitleLanguage();
    if (!currentSubtitleLanguage) {
      console.error(`Got empty, null or undefined language code from body attribute: "lln-sublangcode_g", current languageCode: ${currentSubtitleLanguage}. `);
      return;
    }
    console.log(`Current language: ${currentSubtitleLanguage}`);
    function findClosestLanguageCode(target) {
      const subtitleMapKeys = Array.from(subtitleMap.keys());
      if (subtitleMapKeys.includes(target)) {
        return target;
      }
      return subtitleMapKeys.filter((key) => {
        if (key.includes(target)) {
          return true;
        }
      }).sort((a, b) => a.length - b.length)[0] || null;
    }
    const closestLanguageCode = findClosestLanguageCode(currentSubtitleLanguage);
    if (!closestLanguageCode) {
      console.error(`No closest language code found in the subtitleMap for current language: ${currentSubtitleLanguage}. `);
      return;
    }
    console.log(`Current language **code**: ${closestLanguageCode}`);
    const targetTimedTextRes = subtitleMap.get(closestLanguageCode);
    if (!targetTimedTextRes) {
      console.error(`No corresponded XHR found for current language code: ${currentSubtitleLanguage}.`);
      return;
    }
    const player = getPlayerInstance();
    if (!player) {
      console.error("No player instance found;");
      return;
    }
    const timedTextData = (() => {
      try {
        return JSON.parse(targetTimedTextRes.responseText);
      } catch (error) {
        console.error("Error when parser timedText response to JSON.");
      }
    })();
    if (!timedTextData) {
      console.error("timedText response is empty.");
      return;
    }
    const currentVideoMs = player.getCurrentTime() * 1000;
    const currentSegIndex = timedTextData.events.findIndex(({ dDurationMs: durationMs, tStartMs: startMs }) => currentVideoMs >= startMs && currentVideoMs <= startMs + durationMs);
    const { afterSegments, beforeSegments } = timedTextData.events.reduce((acc, current) => {
      if (current.tStartMs + current.dDurationMs < currentVideoMs) {
        return {
          ...acc,
          beforeSegments: [...acc.beforeSegments, current]
        };
      }
      if (current.tStartMs > currentVideoMs) {
        return {
          ...acc,
          afterSegments: [...acc.afterSegments, current]
        };
      }
      return acc;
    }, {
      beforeSegments: [],
      afterSegments: []
    });
    const joinTimedText = (segments) => segments.map((e) => e.segs[0].utf8).join(" ");
    const beforeText = joinTimedText(beforeSegments);
    const afterText = joinTimedText(afterSegments);
    function hideElement(ele) {
      ele.style.display = "inline-block";
      ele.style.width = "0";
      ele.style.height = "0";
      ele.style.overflow = "hidden";
    }
    const spanBefore = document.createElement("span");
    spanBefore.className = "subtitle-extension-before";
    spanBefore.textContent = beforeText + (beforeText.endsWith(" ") ? "" : " ");
    hideElement(spanBefore);
    const spanAfter = document.createElement("span");
    spanAfter.className = "subtitle-extension-after";
    spanAfter.textContent = (afterText.startsWith(" ") ? "" : " ") + afterText;
    hideElement(spanAfter);
    const firstChild = originalSubtitleEle.firstChild;
    if (firstChild && firstChild.nextSibling) {
      originalSubtitleEle.insertBefore(spanBefore, firstChild.nextSibling);
    } else if (firstChild) {
      originalSubtitleEle.appendChild(spanBefore);
    } else {
      originalSubtitleEle.appendChild(spanBefore);
    }
    const lastChild = originalSubtitleEle.lastChild;
    if (lastChild && lastChild.previousSibling) {
      originalSubtitleEle.insertBefore(spanAfter, lastChild);
    } else {
      originalSubtitleEle.appendChild(spanAfter);
    }
  }
  observeSelector("#lln-main-subs", () => {
    addSubtitleExtensionElements();
  });
})();
function getCurrentSubtitleLanguageFactory() {
  const body = document.body;
  return () => {
    return body.getAttribute("lln-sublangcode_g");
  };
}
function getPlayerInstanceFactory() {
  let player = document.getElementById("movie_player");
  return function() {
    if (!player) {
      player = document.getElementById("movie_player");
    }
    return player;
  };
}
