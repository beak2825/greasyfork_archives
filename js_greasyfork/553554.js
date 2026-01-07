// ==UserScript==
// @name         Neopets: Lottery Numbers Generator
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Generates not-so-random numbers for you to play in the lottery, making sure you repeat as little numbers as possible to increase your chances of winning. And it actually works! Unlike 90% of the lottery userscripts!
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
    This script works as of October 19th, 2025. It doesn't use GM3 and does the following:
    - Generates numbers for you to play in the lottery
    - Ensures these numbers are only repeated the minimum possible amount of times between different tickets
    - Buys and generates at the same time
    - Adds a button for you to buy your lucky numbers instead of random ones. The button disappears after you buy them.
    - Adds both buttons to a fixed location so you don't have to move your mouse between tickets
    - Makes both buttons unclickable while the server is processing your request so it doesn't give you an error page

    I tried making my own script but gave up in the middle. Math hurts my head.
    The idea of interleaving numbers is from https://www.andrew.cmu.edu/user/kmliu/neopets/lottery2.html

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// Add your lucky numbers here! If you'd like to get rid of the lucky button instead, change "true" to "false"
const enableLuckyButton = true;
const luckyNumbers = [1, 2, 3, 4, 5, 6];
const verbose = true;

const inputNames = ["one", "two", "three", "four", "five", "six"];

const interleave = (array) => {
    const res = [];
    const a = array.slice(0, Math.floor(array.length / 2));
    const b = array.slice(Math.ceil(array.length / 2));
    for(var i = 0; i < a.length; i++) {
        res[i * 2] = a[i]; 
        res[i * 2 + 1] = b[i]; 
    }
    return res;
}

const fisherYatesShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const interleaveNTimes = (array, n) => {
    if(n === 0) return array;
    return interleaveNTimes(interleave(array), n - 1);
}

const getCurrentNumbers = () => [...document.querySelector(".content p:nth-of-type(3)").childNodes]
                                .filter((e, i) => i % 4 === 2)
                                .flatMap(txt => txt.textContent.match(/\d+/g).map(num => parseInt(num)))
                                .sort((a, b) => a - b);

const getRemoveFrom = (currentNumbers) => {
    return currentNumbers
    .filter((number, index) => currentNumbers.findIndex(n => n === number) === index)
    .map(number => [number, Array.from(new Array(Math.min(currentNumbers.filter(n => n === number).length, 4)), (e, i) => fisherYatesShuffle([0, 1, 2, 3])[i])]);
}

const isValidArray = (array, previousTicketNumbers) => {
    if(array.some((number, index) => array.findIndex(n => n === number) !== index)) return false;
    for(let i = 0; i < previousTicketNumbers.length; i += 6)
        if(previousTicketNumbers.slice(i, i + 6).every(number => array.findIndex(n => n === number) !== -1)) return false;
    return true;
}

const createTicketNumbers = (currentNumbers, attempts = 0) => {
    if(attempts > 250) throw new Error("Too many shuffling attempts!");
    const removeFrom = getRemoveFrom(currentNumbers);
    const numbers = Array.from(new Array(4), () => Array.from(new Array(30), (_, i) => i + 1));
    removeFrom.forEach(([number, arrays]) => arrays.forEach(array => numbers[array] = numbers[array].slice(0, number - 1).concat(numbers[array].slice(number))));
    let interleaved = Array.from(new Array(4), () => []);
    for(let i = 0; i < 3; i++)
        interleaved[i] = interleaveNTimes(fisherYatesShuffle(numbers[i]), i * 2);
    const result = interleaved.flat();
    if(isValidArray(result.slice(0, 6), currentNumbers)) return result;
    return createTicketNumbers(currentNumbers, attempts + 1);
}

const getRandomTicketNumbers = (currentNumbers) => {
    if(currentNumbers.length === 6) return currentNumbers;
    const newNumber = Math.ceil(Math.random() * 30);
    return getRandomTicketNumbers(currentNumbers.includes(newNumber) ? currentNumbers : currentNumbers.concat([newNumber]));
}

const fillTicket = (numbers) => {
    const sorted = numbers.sort((a, b) => a - b);
    inputNames.forEach((name, index) => {
        document.querySelector(`input[name="${name}"]`).value = sorted[index];
    });
}

const fillLotteryNumbers = () => {
    const currentNumbers = getCurrentNumbers();
    if(currentNumbers.length >= 120) return false;
    try {
        const numbers = createTicketNumbers(currentNumbers);
        if(verbose) console.log(`Generated ticket numbers (only the first six will be used): [${numbers.join(', ')}]`);
        fillTicket(numbers.slice(0, 6));
    } catch (e) {
        console.error(e);
        document.querySelector(".content p:nth-of-type(2)").insertAdjacentHTML("beforeBegin", `<p style="color:darkred">Something went wrong! You can buy non-optimized numbers like usual or refresh the page.</p><p style="color:red;">${e}</p>`);
        fillTicket(getRandomTicketNumbers(currentNumbers));
    }
    return true;
}

const addLuckyButton = (form) => {
    if(!enableLuckyButton) return;
    const orderedLucky = luckyNumbers.sort((a, b) => a - b);
    const alreadyPlayed = [...document.querySelector(".content p:nth-of-type(3)").childNodes]
        .filter((e, i) => i % 4 === 2).
        some(t => t.textContent.replace(":", "").trim() === orderedLucky.join(" "));
    if(alreadyPlayed) return;
    const luckyButton = document.createElement("input");
    luckyButton.type = "button";
    luckyButton.value = "Buy Your Lucky Ticket!";
    luckyButton.style = "padding: 1em;"
    document.querySelector('input[form="lottery"]').insertAdjacentElement("afterEnd", luckyButton);
    luckyButton.addEventListener("click", () => {
        luckyNumbers.forEach((n, i) => document.querySelector(`input[name="${inputNames[i]}"]`).value = n);
        form.submit();
    });
    return luckyButton;
}

const moveButton = (form) => {
    const button = form.querySelector('input[type="submit"]');
    document.querySelector(".content p:nth-of-type(2)").insertAdjacentElement("beforeBegin", button);
    form.id = "lottery";
    button.setAttribute("form", "lottery");
    button.style = "padding: 1em;";
    return button;
}

const changeHTML = (canBuy) => {
    const form = document.querySelector('form[action="process_lottery.phtml"]');
    const buyButton = moveButton(form);
    if(canBuy) {
        const luckyButton = addLuckyButton(form);
        form.addEventListener("submit", () => {
            buyButton.disabled = true;
            luckyButton.disabled = true;
        })
    }
    else {
        buyButton.disabled = true;
        buyButton.value = "All 20 tickets have been bought!"
        document.querySelectorAll('input[size="2"]').forEach(input => input.disabled = true);
    }
}

(function() {
    'use strict';
    const canBuy = fillLotteryNumbers();
    changeHTML(canBuy);
})();
