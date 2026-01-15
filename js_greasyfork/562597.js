// ==UserScript==
// @name        Steam Points Calculator
// @namespace   Violentmonkey Scripts
// @match       https://steamcommunity.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/14/2024, 12:47:35 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562597/Steam%20Points%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/562597/Steam%20Points%20Calculator.meta.js
// ==/UserScript==

let fe_points = {
  "1": 300,
  "2": 300,
  "3": 300,
  "4": 300,
  "5": 300,
  "6": 300,
  "7": 300,
  "8": 300,
  "9": 600,
  "10": 1200,
  "11": 2400,
  "12": 300,
  "13": 2400,
  "14": 600,
  "15": 1200,
  "16": 600,
  "17": 4800,
  "18": 300,
  "19": 600,
  "20": 1200,
  "21": 300,
  "22": 600,
  "23": 300
};

const se_price = 500;

const fe_collected = [...document.querySelectorAll(".workshopItemRatings .review_award_ctn .review_award.unpurchaseable")].map(v => {
	const key = v.getAttribute("data-reaction");
	const value = v.getAttribute("data-reactioncount");
	return {
        id: key,
        points: Number(value)
  };
});

const se_collected = [...document.querySelectorAll(".workshopItemRatings .review_award_ctn .review_award.purchaseable")].map(v => {
    const key = v.getAttribute("data-reaction");
	const value = v.getAttribute("data-reactioncount");
	return {
        id: key,
        points: Number(value)
  };
});

let total_fe = 0;
let count_fe = 0;

let total_se = 0;
let count_se = 0;

for (const i of fe_collected) {
  total_fe += fe_points[i.id] * i.points;
  count_fe += i.points;
}

for (const i of se_collected) {
  total_se += se_price;
  count_se += i.points;
}

const container = document.querySelector(".workshopItemRatings");
const elm = document.createElement("p");
elm.innerHTML = `Awards Calculator
<br><b>First Edition</b>:
<b>${count_fe}</b> award(s) given, totaling to <b>${total_fe.toLocaleString("en-us")}</b> points / <b>${(total_fe / 3).toLocaleString("en-us")}</b> points granted to author.
<br><b>Second Edition</b>:
<b>${count_se}</b> award(s) given, totaling to <b>${total_se.toLocaleString("en-us")}</b> points / No points granted to author.`;
container.appendChild(elm);