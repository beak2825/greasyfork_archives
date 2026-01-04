// ==UserScript==
// @name        Mute AI news
// @namespace   Violentmonkey Scripts
// @match       https://git.news/*
// @grant       none
// @version     1.1
// @author      QuentinWidlocher
// @description 16/10/2025, 09:58:29
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/552760/Mute%20AI%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/552760/Mute%20AI%20news.meta.js
// ==/UserScript==

const aiWords = [
  "ai",
  "llm",
  "llms",
  "claude",
  "gpt",
  "mcp",
  "agent",
  "agents",
  "agentic",
  "neural",
  "genai",
]

const aiWordsRegex = new RegExp(`(\\s|\\w*-)?(${aiWords.join('|')})(\\s|\\w*-|\\.)`, 'i')

const observer = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      const [news] = mutation.addedNodes;
      const item = news?.querySelector(".newsfeed-item")

      if (item && aiWordsRegex.test(item.innerText)) {
        item.style.opacity = 0.3;
      }
    }
  }
});

observer.observe(document.querySelector(".newsfeed"), { attributes: false, childList: true, subtree: true });