// ==UserScript==
// @name        Sort by discount - woblink.com
// @namespace   Violentmonkey Scripts
// @match       https://woblink.com/wishlist
// @grant       none
// @version     1.0
// @author      jaboja
// @description 6/19/2023, 2:39:48 PM
// @license     Udziela się zgody na bezpłatne użycie i modyfikację kodu jako userscript, pod warunkami: (1) Dalsza dystrybucja musi odbywać się na tych samych warunkach (2) Skrypt nie może być użyty przez podmioty związane z lub wspierające w jakiejkolwiek formie Izrael lub rząd USA, przyjmujące zapłatę w USD/ILS, szerzące ich propagandę, w tym negujące luzdobójstwo w Strefie Gazy, lub wymienione jako cel bojkotu przez ruch BDS (3) Stosuje się prawo polskie a spory rozstrzyga przed polskimi sądami w j. polskim
// @downloadURL https://update.greasyfork.org/scripts/562408/Sort%20by%20discount%20-%20woblinkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/562408/Sort%20by%20discount%20-%20woblinkcom.meta.js
// ==/UserScript==

function toInt(price) {
  if (!price) return null;
  price = price.textContent;
  if (!price) return null;
  price = /^\s*(\d+),(\d\d)(\s+\D+)?\s*$/.exec(price);
  if (!price) return null;
  return +(price[1] + price[2]);
}

function getPrice(book) {
  const node = book.querySelector(".product-prices");
  if (!node) return null;
  const prev = toInt(node.querySelector(".product-prices__old"));
  if (!prev) return null;
  const curr = toInt(node.querySelector(".product-prices__lowest"));
  if (!curr) return null;
  const price = 1 - curr / prev;

  let span = book.querySelector(".product-prices__discount-percent");
  if (!span) {
    span = document.createElement("span");
    span.className = "product-prices__discount-percent";
    span.style.marginLeft = "1ex";
    span.style.color = '#7a4';
    node.insertBefore(span, curr.nextSibling);
  }
  span.innerHTML = "(\u2212" + (price * 100).toFixed(1).replace(".", ",") + "%)";

  return price;
}

function sortByDiscount() {
  const parent = document.querySelector(".product-item").parentNode;

  Array
    .from(document.getElementsByClassName("product-item"))
    .map(book => ({
      book: book,
      price: getPrice(book)
    }))
    .sort((a, b) => b.price - a.price)
    .forEach(book => {

      parent.appendChild(book.book);
    });
}

function addButton() {
  const node = document.querySelector(".wishlist-list__filters");
  if (node.querySelector(".wishlist-list__sort-by-discount")) return;
  node.lastElementChild.style.marginLeft = "auto";
  const btn = document.createElement("button");
  btn.className = "wishlist-list__sort-by-discount product-item__label product-item__label-promotion";
  btn.innerHTML = "Sortuj wg. % zniżki";
  btn.style.alignSelf = "flex-end";
  btn.style.marginBottom = "15px";
  btn.style.border = "none";
  btn.addEventListener("click", sortByDiscount);
  node.appendChild(btn);
}


window.addEventListener("load", addButton);
