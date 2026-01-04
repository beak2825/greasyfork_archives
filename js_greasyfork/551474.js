// ==UserScript==
// @name         [GC] - Quick Offer TP
// @namespace    https://greasyfork.org
// @match        https://www.grundos.cafe/island/tradingpost/createoffer/*
// @version      0.1
// @license      MIT
// @description  Archive of cupcait's quickoffer script
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/551474/%5BGC%5D%20-%20Quick%20Offer%20TP.user.js
// @updateURL https://update.greasyfork.org/scripts/551474/%5BGC%5D%20-%20Quick%20Offer%20TP.meta.js
// ==/UserScript==


async function initiateNewTrade() {
  const inventItems = document.querySelectorAll('.trade-item');
  const dets = document.querySelector('details');
dets.removeAttribute('open');

  let checkedCount = 0;
  const counterDisplay = createCounterDisplay(checkedCount);
  const itemButtons = document.querySelector('#tp-buttons');
  const autoSelect = createSelectButtons();
  const createBtn = document.querySelector('.center input.form-control');
  const container = document.createElement('div');
  container.id = "newContainer";

  document.querySelector('#tp-buttons').insertAdjacentElement('afterend', container);
    container.append(counterDisplay);
    container.append(autoSelect);
    container.append(createBtn);

    //document.querySelector('.big-gap').replaceWith(itemButtons)


  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', event => handleCheckboxChange(event, counterDisplay));
  });

}
function updateCheckedCount() {
  const counterDisplay = document.getElementById('checkedCounter');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
  counterDisplay.textContent = `Selected: ${checkedCount}`;
}

function createCounterDisplay(initialCount) {
  const counterDisplay = document.createElement('span');
  counterDisplay.id = 'checkedCounter';
  counterDisplay.textContent = `Selected: ${initialCount}`;
  return counterDisplay;
}

function createSelectButtons() {
  const selectMax = document.createElement('button');
  const selectNone = document.createElement('button');
  const buttonCont = document.createElement('span');
  selectMax.id = 'selectMax';
  selectNone.id = 'selectNone';
  buttonCont.append(selectMax, selectNone);
  selectMax.textContent = "Select 30";
  selectNone.textContent = "Clear All";


  selectMax.addEventListener('click', (event) => {
    event.preventDefault();
    selectMaxAction();
  });
  selectNone.addEventListener('click', (event) => {
    event.preventDefault();
    selectNoneAction();
  });

  return buttonCont;
}
function selectNoneAction() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateCheckedCount();
}
function selectMaxAction() {
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let selectedCount = 0;

checkboxes.forEach(checkbox => {
  if (selectedCount >= 30) {
    return;
  }
  let parent = checkbox.parentElement;
  let hidden = false;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (style.display === 'none') {
      hidden = true;
      break;
    }
    parent = parent.parentElement;
  }
  if (!hidden) {
    checkbox.checked = true;
    selectedCount++;
  }
});

  updateCheckedCount();
}
function createCounterDisplay(initialCount) {
  const counterDisplay = document.createElement('span');
  counterDisplay.id = 'checkedCounter';
  counterDisplay.textContent = `Selected: ${initialCount}`;
  return counterDisplay;
}

initiateNewTrade();