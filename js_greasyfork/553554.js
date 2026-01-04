// ==UserScript==
// @name         Neopets: Lottery Numbers Generator
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.1.1
// @description  Generates not-so-random numbers for you to play in the lottery, making sure you repeat as few numbers as possible to increase your chances of winning.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/games/lottery.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/553554/Neopets%3A%20Lottery%20Numbers%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/553554/Neopets%3A%20Lottery%20Numbers%20Generator.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Generates numbers for you to play in the lottery
    - Ensures these numbers are only repeated the minimum possible amount of times between different tickets
    - Buys and generates at the same time
    - Adds a button for you to buy your lucky numbers instead of random ones. The button disappears after you buy them.
    - Adds both buttons to a fixed location so you don't have to move your mouse between tickets
    - Makes both buttons unclickable while the server is processing your request so it doesn't give you an error page

    inb4 "Why another lottery script?", mine actually gets you tickets as diverse as possible, which increases your
    chances of winning as per https://www.neopets.com/ntimes/index.phtml?section=456732&week=398
    There are other scripts that claim to do the same but really don't. In testing, mine had a maximum of 4 numbers in
    common with another ticket, only once, and it was in my lucky number. Usually it gets 2-3, which is unavoidable.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// Add your lucky numbers here! If you'd like to get rid of the lucky button instead, change "true" to "false"
const enableLuckyButton = true;
const luckyNumbers = [0, 0, 0, 0, 0, 0];
const verbose = false;

const inputNames = ["one", "two", "three", "four", "five", "six"];

const rand = (n) => Math.floor(Math.random() * n);

const scoreTickets = (tickets) => {
  let total = 0;
  for (let i = 0; i < tickets.length; i++) {
    for (let j = i + 1; j < tickets.length; j++) {
      total += Array.from(tickets[i]).filter((number) =>
        tickets[j].has(number),
      ).length;
    }
  }
  return total;
};

const trySwap = (tickets, score, fixedCount) => {
  if(tickets.length < 1) return 0;
  const ticketIndex = rand(tickets.length - fixedCount) + fixedCount;
  const currentTicket = Array.from(tickets[ticketIndex]);
  const numberIndex = rand(6);
  let delta = 0;

  const candidates = [];
  for (let number = 1; number <= 30; number++)
    if (!tickets[ticketIndex].has(number)) candidates.push(number);
  if (candidates.length === 0) return;
  const currentCandidate = candidates[rand(candidates.length)];

  for (let j = 0; j < tickets.length; j++)
    if (j !== ticketIndex)
      delta +=
        tickets[j].has(currentCandidate) - tickets[j].has(currentTicket[numberIndex]);

  // You can have a worse score. As a treat
  if (delta < 0 || Math.random() < 0.001) {
    tickets[ticketIndex].delete(currentTicket[numberIndex]);
    tickets[ticketIndex].add(currentCandidate);
    return score + delta;
  }
};

function generateTickets(fixedTickets) {
  let tickets = fixedTickets.map(ticket => new Set(ticket));
  for (let i = 0; i < 20 - fixedTickets.length; i++)
    tickets.push(getRandomTicketNumbers(tickets));
  let total = scoreTickets(tickets);
  for (let step = 0; step < 8000; step++) {
    const newScore = trySwap(tickets, total, fixedTickets.length);
    if (newScore || newScore === 0) total = newScore;
  }
  if (verbose)
    console.log(
      "Final overlap score:",
      total,
      ". All chosen tickets:",
      tickets,
    );
  return tickets[fixedTickets.length];
}

const getCurrentTickets = () =>
  [...document.querySelector(".content p:nth-of-type(3)").childNodes]
    .filter((e, i) => i % 4 === 2)
    .map((txt) =>
      txt.textContent
        .match(/\d+/g)
        .map((num) => parseInt(num))
        .sort((a, b) => a - b),
    );

const getRandomTicketNumbers = (disallowedList, currentNumbers = new Set()) => {
  if (currentNumbers.size === 6) {
    return disallowedList.some(ticket => ticket.union(currentNumbers).size === 6)
      ? getRandomTicketNumbers(disallowedList)
      : currentNumbers;
  }
  const newNumber = Math.ceil(Math.random() * 30);
  return getRandomTicketNumbers(disallowedList, currentNumbers.add(newNumber));
};

const fillTicket = (numbers) => {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  inputNames.forEach((name, index) => {
    document.querySelector(`input[name="${name}"]`).value = sorted[index];
  });
};

const fillLotteryNumbers = () => {
  const currentTickets = getCurrentTickets();
  if (currentTickets.length >= 20) return false;
  try {
    const numbers = generateTickets(currentTickets);
    fillTicket(numbers);
  } catch (e) {
    console.error(e);
    document
      .querySelector(".content p:nth-of-type(2)")
      .insertAdjacentHTML(
        "beforeBegin",
        `<p style="color:darkred">Something went wrong! You can buy non-optimized numbers like usual or refresh the page.</p><p style="color:red;">${e}</p>`,
      );
    fillTicket(getRandomTicketNumbers(currentTickets));
  }
  return true;
};

const addLuckyButton = (form) => {
  if (!enableLuckyButton) return;
  const orderedLucky = luckyNumbers.sort((a, b) => a - b);
  const alreadyPlayed = [
    ...document.querySelector(".content p:nth-of-type(3)").childNodes,
  ]
    .filter((e, i) => i % 4 === 2)
    .some(
      (t) => t.textContent.replace(":", "").trim() === orderedLucky.join(" "),
    );
  if (alreadyPlayed) return;
  const luckyButton = document.createElement("input");
  luckyButton.type = "button";
  luckyButton.value = "Buy Your Lucky Ticket!";
  luckyButton.style = "padding: 1em;";
  document
    .querySelector('input[form="lottery"]')
    .insertAdjacentElement("afterEnd", luckyButton);
  luckyButton.addEventListener("click", () => {
    luckyNumbers.forEach(
      (n, i) =>
        (document.querySelector(`input[name="${inputNames[i]}"]`).value = n),
    );
    form.submit();
  });
  return luckyButton;
};

const moveButton = (form) => {
  const button = form.querySelector('input[type="submit"]');
  document
    .querySelector(".content p:nth-of-type(2)")
    .insertAdjacentElement("beforeBegin", button);
  form.id = "lottery";
  button.setAttribute("form", "lottery");
  button.style = "padding: 1em;";
  return button;
};

const changeHTML = (canBuy) => {
  const form = document.querySelector('form[action="process_lottery.phtml"]');
  const buyButton = moveButton(form);
  if (canBuy) {
    const luckyButton = addLuckyButton(form);
    form.addEventListener("submit", () => {
      buyButton.disabled = true;
      if(luckyButton) luckyButton.disabled = true;
    });
  } else {
    buyButton.disabled = true;
    buyButton.value = "All 20 tickets have been bought!";
    document
      .querySelectorAll('input[size="2"]')
      .forEach((input) => (input.disabled = true));
  }
};

(function () {
  "use strict";
  const canBuy = fillLotteryNumbers();
  changeHTML(canBuy);
})();
