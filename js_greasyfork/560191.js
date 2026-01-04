// ==UserScript==
// @name        Twitter → Wikipedia Cite tweet Copier (TL + 検索結果対応)
// @name:ja     X: Cite tweet for Wikipedia
// @namespace   https://greasyfork.org/ja/users/570127
// @version     1.8
// @description タイムライン・検索結果の各ツイートにも📋Citeボタンを追加（Wikipedia用）
// @author      universato
// @match       https://twitter.com/*
// @match       https://x.com/*
// @grant       GM_setClipboard
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/560191/Twitter%20%E2%86%92%20Wikipedia%20Cite%20tweet%20Copier%20%28TL%20%2B%20%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E5%AF%BE%E5%BF%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560191/Twitter%20%E2%86%92%20Wikipedia%20Cite%20tweet%20Copier%20%28TL%20%2B%20%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E5%AF%BE%E5%BF%9C%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log("[CiteTweet] TL対応スクリプト開始");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD形式

  // 📌 ツイートから情報を抽出してCiteを生成
  function generateCite(article) {
    const urlElem = article.querySelector('a[href*="/status/"][role="link"]');
    const urlMatch = urlElem ? urlElem.href.match(/(?:x|twitter)\.com\/([^\/]+)\/status\/(\d+)/) : null;
    if (!urlMatch) return null;

    const user = urlMatch[1];
    const id = urlMatch[2];

    const textElem = article.querySelector("div[data-testid='tweetText']");
    const text = textElem ? textElem.innerText.replace(/\s+/g, " ") : "";

    const timeElem = article.querySelector("time");
    const date = timeElem ? timeElem.getAttribute("datetime").split("T")[0] : "";

    const userNameBlock = article.querySelector("div[data-testid='User-Name']");
    let displayName = user;
    if (userNameBlock) {
      const spans = userNameBlock.querySelectorAll("span");
      const nameSpan = Array.from(spans).find(s => !s.textContent.startsWith("@") && s.textContent.trim());
      if (nameSpan) displayName = nameSpan.textContent.trim();
    }

    const cite = `<ref>{{Cite tweet ja |user=${user} |author=${displayName} |number=${id} |title=${text} |date=${date} |access-date=${today}}}</ref>`;
    return cite;
  }

  // 📌 ツイートにCiteボタンを追加
  function addButton(article) {
    if (article.querySelector(".cite-button")) return; // 重複防止

    const actionBar = article.querySelector("div[role='group']");
    if (!actionBar) return;

    const button = document.createElement("button");
    button.textContent = "📋Cite";
    button.className = "cite-button";
    Object.assign(button.style, {
      background: "none",
      border: "none",
      color: "var(--twitter-color, #1d9bf0)",
      cursor: "pointer",
      marginLeft: "6px",
      fontSize: "14px"
    });

    button.addEventListener("click", () => {
      const cite = generateCite(article);
      if (!cite) {
        alert("ツイート情報を取得できません。");
        return;
      }
      console.log("[CiteTweet] 生成されたCite:\n", cite);
      GM_setClipboard(cite);
      //alert("✅ Wikipedia用のCiteをコピーしました！");
      button.textContent = "✅ Copied!";
      setTimeout(() => (button.textContent = "📋Cite"), 1500);
    });

    actionBar.appendChild(button);
  }

  // 📌 MutationObserverで全ツイートを監視
  const observer = new MutationObserver(() => {
    const articles = document.querySelectorAll("article[role='article']");
    for (const article of articles) addButton(article);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
