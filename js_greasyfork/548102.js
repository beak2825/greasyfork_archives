// ==UserScript==
// @name         [GC] - Virtupets.net Quest Calculator
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @version      1.0
// @license      MIT
// @description  Calculate cost of quests using Virtupets API without having to check each item and do mental math. Staff approved script via ticket.
// @author       Cupkait
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/548102/%5BGC%5D%20-%20Virtupetsnet%20Quest%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/548102/%5BGC%5D%20-%20Virtupetsnet%20Quest%20Calculator.meta.js
// ==/UserScript==


const path = window.location.pathname;

async function fetchQuestData(questDiv) {
const questList = document.querySelectorAll('.quest_text,.shop-item,.quest-item,.centered-item');

  const questArray = Array.from(questList).map(item => item.querySelector('strong').textContent);

  try {
    const response = await bulkShopWizardPrices(questArray);
    const data = await response.json();

    const tableHTML = createTableHTML(data);
    questDiv.innerHTML = tableHTML;
  } catch (error) {
    console.error('Error:', error);
    questDiv.innerHTML = `<p>Error fetching quest data. Please try again later.</p>`;
  }
}

function createTableHTML(data) {
  let tableHTML = '<table><tr><th colspan="3" style="background-color: #4abdb8; font-size: 16px;"><strong>Virtupets.net Quest Calculator</strong></th></tr><tr><th>Item Name</th><th>Price</th><th>Date Priced</th></tr>';
  let totalPrice = 0;

  data.forEach(item => {
    const date = new Date(item.time);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    totalPrice += item.price;

    tableHTML += `<tr><td>${item.name}</td><td>${item.price.toLocaleString()} NP</td><td>${formattedDate}</td></tr>`;
  });

  tableHTML += `<tr><td><strong>Total Estimated Cost: ${totalPrice.toLocaleString()} NP</strong></td><td></td></tr>`;
  tableHTML += '</table><span class="disclaimer">Prices always subject to change. To update an outdated price, download <a href="https://greasyfork.org/en/scripts/490596-gc-virtupets-data-collector">this script</a> before searching it on the Shop Wizard. Report errors or suggestions to @Cupkait!</span>';
  return tableHTML;
}

function appendQuestDiv(anchor) {
  const questDiv = document.createElement('div');
  questDiv.classList.add('quest-div');
  anchor.append(questDiv);
  return questDiv;
}

if (path.includes('/accept/')) {
  const anchor = document.querySelector('.itemList').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else if (path.includes('/complete/') && document.querySelector('#page_content .flex-column').textContent.includes("Deadline")) {
  const anchor = document.querySelector('#quest_grid').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else if (path.includes('/complete/')) {
  // do nothing, all done!

} else if (path.includes('/snowfaerie/')) {
  const anchor = document.querySelector('#taelia_grid').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv);

} else {
  const anchor = document.querySelector('.itemList').previousElementSibling;
  const questDiv = appendQuestDiv(anchor);
  fetchQuestData(questDiv); 
}

const questStyle = document.createElement('style');
questStyle.innerHTML = `
.quest-div {
  display: grid;
  border: 2px solid black;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  }

.quest-div td {
  padding: 5px;
}

.disclaimer {
font-style:italic;
font-size:10px;
margin-top:-5px;
margin-bottom:2px;
padding-left:10%;
padding-right:10%;
}
`;

document.body.append(questStyle);
