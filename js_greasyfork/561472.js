// ==UserScript==
// @name         findElementsBySelectorAndTextContains
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Find Elements By Selector And Text Contains
// @author       maanimis
// @grant        none
// ==/UserScript==

function findElementsBySelectorAndTextContains(selector, text) {
  const elements = document.querySelectorAll(selector);

  return Array.from(elements).filter(
    (el) => el.textContent && el.textContent.includes(text)
  );
}
