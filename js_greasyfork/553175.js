// ==UserScript==
// @name         Lottery Chance
// @namespace    lottery_chance.biscuitius
// @version      1.0
// @description  Displays your chance of winning the lottery based on tickets owned
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/page.php?sid=lottery
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/553175/Lottery%20Chance.user.js
// @updateURL https://update.greasyfork.org/scripts/553175/Lottery%20Chance.meta.js
// ==/UserScript==

const dailyDimeContainer = $("#daily-dime");
const luckyShotContainer = $("#lucky-shot");
const holyGrailContainer = $("#holy-grail");

const dailyDimeTicketElement = dailyDimeContainer.find(".tickets");
const luckyShotTicketElement = luckyShotContainer.find(".tickets");
const holyGrailTicketElement = holyGrailContainer.find(".tickets");

const dailyDimeOwnedTicketsElement = dailyDimeContainer.find(".totalTickets");
const luckyShotOwnedTicketsElement = luckyShotContainer.find(".totalTickets");
const holyGrailOwnedTicketsElement = holyGrailContainer.find(".totalTickets");

const dailyDimeDescription = dailyDimeContainer.find(".desc");
const luckyShotDescription = luckyShotContainer.find(".desc");
const holyGrailDescription = holyGrailContainer.find(".desc");

function calculateLotteryChance(ticketsOwned, totalTickets) {
  if (totalTickets === 0) return 0;
  return ((ticketsOwned / totalTickets) * 100).toFixed(6);
}

function updateLotteryChance() {
  const dailyDimeTotalTickets =
    parseInt(dailyDimeTicketElement.text().replace(/,/g, "")) || 0;
  const luckyShotTotalTickets =
    parseInt(luckyShotTicketElement.text().replace(/,/g, "")) || 0;
  const holyGrailTotalTickets =
    parseInt(holyGrailTicketElement.text().replace(/,/g, "")) || 0;

  const dailyDimeTicketsOwned =
    parseInt(dailyDimeOwnedTicketsElement.text().replace(/,/g, "")) || 0;
  const luckyShotTicketsOwned =
    parseInt(luckyShotOwnedTicketsElement.text().replace(/,/g, "")) || 0;
  const holyGrailTicketsOwned =
    parseInt(holyGrailOwnedTicketsElement.text().replace(/,/g, "")) || 0;

  const dailyDimeChance = calculateLotteryChance(
    dailyDimeTicketsOwned,
    dailyDimeTotalTickets
  );
  const luckyShotChance = calculateLotteryChance(
    luckyShotTicketsOwned,
    luckyShotTotalTickets
  );
  const holyGrailChance = calculateLotteryChance(
    holyGrailTicketsOwned,
    holyGrailTotalTickets
  );

  dailyDimeDescription.find(".lottery-chance").remove();
  luckyShotDescription.find(".lottery-chance").remove();
  holyGrailDescription.find(".lottery-chance").remove();
  dailyDimeDescription.append(
    `<div class="lottery-chance" style="margin-top: 5px; font-weight: bold;">Current Chance: ${dailyDimeChance}%</div>`
  );
  luckyShotDescription.append(
    `<div class="lottery-chance" style="margin-top: 5px; font-weight: bold;">Current Chance: ${luckyShotChance}%</div>`
  );
  holyGrailDescription.append(
    `<div class="lottery-chance" style="margin-top: 5px; font-weight: bold;">Current Chance: ${holyGrailChance}%</div>`
  );
}

setInterval(updateLotteryChance, 500);
