// ==UserScript==
// @name        Midnight and third of the night times for Mawaqit.net
// @namespace   Violentmonkey Scripts
// @match       https://mawaqit.net/*
// @grant       none
// @version     1.0
// @author      SHA
// @license     GNU GPLv3
// @description Show the times of midnight and the first third of the night.
// @downloadURL https://update.greasyfork.org/scripts/563172/Midnight%20and%20third%20of%20the%20night%20times%20for%20Mawaqitnet.user.js
// @updateURL https://update.greasyfork.org/scripts/563172/Midnight%20and%20third%20of%20the%20night%20times%20for%20Mawaqitnet.meta.js
// ==/UserScript==

const dict = {
  en: {
    oneThirdOfTheNight: "first third",
    midnight: "midnight",
  },
  de: {
    oneThirdOfTheNight: "Nachtdrittel",
    midnight: "Nachtmitte",
  },
  ar: {
    oneThirdOfTheNight: "ثلث الليل",
    midnight: "نصف الليل",
  },
};

let lang = window.location.pathname.split("/")[1];
if (!dict.hasOwnProperty(lang)) lang = "en";
const t = dict[lang];

window.addEventListener("load", (event) => {
  const maghrebHoursAndMinutes = document.querySelector(".prayers > div:nth-child(4) > div:nth-child(2) > div:nth-child(1)").textContent.split(":");
  const shuruqHoursAndMinutes =  document.querySelector(".prayers > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)").textContent.split(":");

  const maghreb = new Date();
  maghreb.setHours(maghrebHoursAndMinutes[0]);
  maghreb.setMinutes(maghrebHoursAndMinutes[1]);

  const shuruq = new Date(maghreb.getTime() + 24*60*60*1000);
  shuruq.setHours(shuruqHoursAndMinutes[0]);
  shuruq.setMinutes(shuruqHoursAndMinutes[1]);

  const wholeNight = shuruq - maghreb;
  const oneThirdOfTheNight = new Date(maghreb.getTime() + (wholeNight/3))
  const midnight = new Date(maghreb.getTime() + (wholeNight/2))

  const displayElement = document.querySelector(".prayers > div:nth-child(5) > div:nth-child(3)");
  displayElement.style.display = "block";
  displayElement.style.fontSize = "1.5vw";
  displayElement.innerHTML = `
    <span>${t.oneThirdOfTheNight} ${oneThirdOfTheNight.getHours()}:${String(oneThirdOfTheNight.getMinutes()).padStart(2, "0")}</span>
    <br />
    <span>${t.midnight} ${midnight.getHours()}:${String(midnight.getMinutes()).padStart(2, "0")}</span>
`;
});



