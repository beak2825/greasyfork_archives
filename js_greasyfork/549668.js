// ==UserScript==
// @name         Market Mug Scout
// @namespace    market_mug_scout.biscuitius
// @version      1.3
// @description  Helps to find profitable mugs in the market
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/549668/Market%20Mug%20Scout.user.js
// @updateURL https://update.greasyfork.org/scripts/549668/Market%20Mug%20Scout.meta.js
// ==/UserScript==

const API_KEY = "mUhXm7HlVROv8R5e";
const HEADERS = {
  accept: "application/json",
  Authorization: `ApiKey ${API_KEY}`,
};
const MUG_PERCENT = 5;
const PROFIT_THRESHOLD = 100000;

// const CompanyTypes = {
//   1: "Hair Salon",
//   2: "Law Firm",
//   3: "Flower Shop",
//   4: "Car Dealership",
//   5: "Clothing Store",
//   6: "Gun Shop",
//   7: "Game Shop",
//   8: "Candle Shop",
//   9: "Toy Shop",
//   10: "Adult Novelties",
//   11: "Cyber Cafe",
//   12: "Grocery Store",
//   13: "Theater",
//   14: "Sweet Shop",
//   15: "Cruise Line",
//   16: "Television Network",
//   17: "Non-existent",
//   18: "Zoo",
//   19: "Firework Stand",
//   20: "Property Broker",
//   21: "Furniture Store",
//   22: "Gas Station",
//   23: "Music Store",
//   24: "Nightclub",
//   25: "Pub",
//   26: "Gents Strip Club",
//   27: "Restaurant",
//   28: "Oil Rig",
//   29: "Fitness Center",
//   30: "Mechanic Shop",
//   31: "Amusement Park",
//   32: "Lingerie Store",
//   33: "Meat Warehouse",
//   34: "Farm",
//   35: "Software Corporation",
//   36: "Ladies Strip Club",
//   37: "Private Security Firm",
//   38: "Mining Corporation",
//   39: "Detective Agency",
//   40: "Logistics Management",
// };

const iconHospital = `<li style="background-position: -252px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconTravelling = `<li style="background-position: -1260px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconCompany = `<li style="background-position: -1296px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconFederal = `<li style="background-position: -1242px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconJail = `<li style="background-position: -270px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconNewbie = `<li style="background-position: -1278px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconPoor = `<li style="background-position: -1424px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;
const iconOffline = `<li style="background-position: -18px 0; position: absolute; left: 125px; top: 9px; width:16px; height:16px; background-image: url('/images/v2/icons/user_status_icons.svg')"></li>`;

let uiMode = 0; // 0 = Desktop UI, 1 = Mobile UI
let tableSelector = "";
let rowSelector = "";
let anonSelector = "";
let priceSelector = "";
let quantitySelector = "";
let linkSelector = "";

const myID = localStorage.getItem("sessionTokenOwner");
// console.log(`Logged in as user ${myID}`);
let myLevel = 0;
let myLife = 0;
let myAge = 0;
let myXanaxTaken = 0;
let myRefillsUsed = 0;
let myCansUsed = 0;

(async () => {
  const myUserProfile = await fetchUserProfile(myID);
  myLevel = parseInt(myUserProfile.level);
  myLife = parseInt(myUserProfile.life);
  myAge = parseInt(myUserProfile.age);
  const myUserStats = await fetchUserStats(myID);
  myXanaxTaken = parseInt(myUserStats.xanaxTaken);
  myRefillsUsed = parseInt(myUserStats.refillsUsed);
  myCansUsed = parseInt(myUserStats.cansUsed);

  const observer = new MutationObserver(() => {
    let listings;

    if (document.querySelector(".price___Uwiv2")) {
      // console.log("Found listings in desktop UI.");
      uiMode = 0;
      tableSelector = ".sellerList___kgAh_";
      rowSelector = ".sellerRow___AI0m6";
      anonSelector = ".anonymous___P3s5s";
      priceSelector = ".price___Uwiv2";
      quantitySelector = ".available___xegv_";
      linkSelector = ".honorWrap___BHau4";
      observer.disconnect();
      main();
      setupMainObserver();
    }

    if (document.querySelector(".price___v8rRx")) {
      // console.log("Found listings in mobile UI.");
      uiMode = 1;
      tableSelector = ".sellerList___e4C9_";
      rowSelector = ".sellerRow___Ca2pK";
      anonSelector = ".anonymous___P3s5s";
      priceSelector = ".price___v8rRx";
      quantitySelector = ".available___jtANf";
      linkSelector = ".honorWrap___BHau4";
      observer.disconnect();
      main();
      setupMainObserver();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

function setupMainObserver() {
  const listingTable = document.querySelector(tableSelector);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        main();
      }
    });
  });
  observer.observe(listingTable, { childList: true, subtree: true });
}

function main() {
  listings = document.querySelectorAll(rowSelector);
  listings = Array.from(listings).slice(1);
  listings.forEach(async (listing) => {
    const priceCell = listing.querySelector(priceSelector);
    if (listing.dataset.processed) return;
    listing.dataset.processed = "true";

    const { userID, priceStr, quantityStr } = scrapeListing(listing);
    let mugProfit = 0;
    if (priceStr) {
      const price = parseInt(priceStr.replace(/[^0-9]/g, ""));
      const quantity = parseInt(quantityStr.replace(/[^0-9]/g, ""));
      mugProfit = parseInt(price * quantity * (MUG_PERCENT / 100));
    }

    if (!userID) {
      listing.parentNode.style.backgroundColor = "#702525ff";
      priceCell.innerHTML += iconOffline;
      return;
    } else if (priceStr && mugProfit < PROFIT_THRESHOLD) {
      listing.parentNode.style.backgroundColor = "#702525ff";
      priceCell.innerHTML += iconPoor;
      return;
    } else {
      const userProfile = await fetchUserProfile(userID);
      const { level, life, status, age } = userProfile;
      if (status === "Hospital") {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconHospital;
        return;
      } else if (status === "Travelling") {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconTravelling;
        return;
      } else if (status === "Federal") {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconFederal;
        return;
      } else if (status === "Jail") {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconJail;
        return;
      } else if (age < 14) {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconNewbie;
        return;
      }

      const userJob = await fetchUserJob(userID);
      const { companyType, companyRating } = userJob;
      if (companyType === 5 && companyRating >= 7) {
        listing.parentNode.style.backgroundColor = "#702525ff";
        priceCell.innerHTML += iconCompany;
        return;
      } else {
        const userStats = await fetchUserStats(userID);
        const { xanaxTaken, refillsUsed, cansUsed } = userStats;

        const mugBox = document.createElement("div");
        mugBox.style.position = "absolute";
        mugBox.style.fontSize = "8px";
        mugBox.style.textAlign = "left";
        mugBox.style.left = "122px";
        mugBox.style.top = "1px";

        if (level > myLevel) {
          mugBox.innerHTML += `<strong style="color: #c50c0cff;">lvl ${level}</strong>`;
        } else if (level < myLevel) {
          mugBox.innerHTML += `<strong style="color: #4CAF50;">lvl ${level}</strong>`;
        } else if (level === myLevel) {
          mugBox.innerHTML += `<strong style="color: #d6b810ff;">lvl ${level}</strong>`;
        }

        if (life > myLife) {
          mugBox.innerHTML += ` - <strong style="color: #c50c0cff;">${life.toLocaleString()}hp</strong>`;
        } else if (life < myLife) {
          mugBox.innerHTML += ` - <strong style="color: #4CAF50;">${life.toLocaleString()}hp</strong>`;
        } else if (life === myLife) {
          mugBox.innerHTML += ` - <strong style="color: #d6b810ff;">${life.toLocaleString()}hp</strong>`;
        } else {
          console.error(
            `Something went wrong comparing life (${life}) and myLife: (${myLife})`
          );
        }

        if (age > myAge) {
          mugBox.innerHTML += ` - <strong style="color: #c50c0cff;">${age.toLocaleString()}d</strong><br>`;
        } else if (age < myAge) {
          mugBox.innerHTML += ` - <strong style="color: #4CAF50;">${age.toLocaleString()}d</strong><br>`;
        } else if (age === myAge) {
          mugBox.innerHTML += ` - <strong style="color: #d6b810ff;">${age.toLocaleString()}d</strong><br>`;
        } else {
          console.error(
            `Something went wrong comparing age (${age}) and myAge: (${myAge})`
          );
        }

        if (xanaxTaken > myXanaxTaken) {
          mugBox.innerHTML += `<strong style="color: #c50c0cff;">Xanax: ${xanaxTaken.toLocaleString()}</strong><br>`;
        } else if (xanaxTaken < 28) {
          mugBox.innerHTML += `<strong style="color: #4CAF50;">Xanax: ${xanaxTaken.toLocaleString()}</strong><br>`;
        } else if (xanaxTaken === myXanaxTaken) {
          mugBox.innerHTML += `<strong style="color: #d6b810ff;">Xanax: ${xanaxTaken.toLocaleString()}</strong><br>`;
        } else {
          console.error(
            `Something went wrong comparing xanaxTaken (${xanaxTaken}) and myXanaxTaken: (${myXanaxTaken})`
          );
        }

        if (refillsUsed > myRefillsUsed) {
          mugBox.innerHTML += `<strong style="color: #c50c0cff;">Refill: ${refillsUsed.toLocaleString()}</strong><br>`;
        } else if (refillsUsed < myRefillsUsed) {
          mugBox.innerHTML += `<strong style="color: #4CAF50;">Refill: ${refillsUsed.toLocaleString()}</strong><br>`;
        } else if (refillsUsed === myRefillsUsed) {
          mugBox.innerHTML += `<strong style="color: #d6b810ff;">Refill: ${refillsUsed.toLocaleString()}</strong><br>`;
        } else {
          console.error(
            `Something went wrong comparing refillsUsed (${refillsUsed}) and myRefillsUsed: (${myRefillsUsed})`
          );
        }

        if (cansUsed > myCansUsed) {
          mugBox.innerHTML += `<strong style="color: #c50c0cff;">Cans: ${cansUsed.toLocaleString()}</strong><br>`;
        } else if (cansUsed < myCansUsed) {
          mugBox.innerHTML += `<strong style="color: #4CAF50;">Cans: ${cansUsed.toLocaleString()}</strong><br>`;
        } else if (cansUsed === myCansUsed) {
          mugBox.innerHTML += `<strong style="color: #d6b810ff;">Cans: ${cansUsed.toLocaleString()}</strong><br>`;
        } else {
          console.error(
            `Something went wrong comparing cansUsed (${cansUsed}) and myCansUsed: (${myCansUsed})`
          );
        }

        mugBox.innerHTML += `<strong style="color: #cacacaff; position: absolute; bottom: 9px; right: -59px; text-align: right;">$${mugProfit.toLocaleString()}</strong><br>`;

        priceCell.appendChild(mugBox);
      }
    }
  });
}

function scrapeListing(listing) {
  if (listing.querySelector(".anonymous___P3s5s")) {
    return { userID: null, priceStr: null, quantityStr: null };
  }
  const priceStr = listing.querySelector(priceSelector).textContent;
  const quantityStr = listing.querySelector(quantitySelector).textContent;
  const link = listing.querySelector(linkSelector).firstChild.href;
  const userID = link.match(/ID=(\d+)/)[1];
  return { userID, priceStr, quantityStr };
}

async function fetchUserProfile(userID) {
  let level, life, status, age;
  try {
    const profileRes = await fetch(
      `https://api.torn.com/v2/user/${userID}/profile`,
      { headers: HEADERS }
    );
    const profileData = await profileRes.json();
    level = parseInt(profileData.profile.level);
    life = parseInt(profileData.profile.life.current);
    status = profileData.profile.status.state;
    age = parseInt(profileData.profile.age);
    return {
      level,
      life,
      status,
      age,
    };
  } catch (error) {
    console.error(`Error fetching profile for user ${userID}:`, error);
  }
}

async function fetchUserJob(userID) {
  let companyType, companyRating;
  try {
    const jobRes = await fetch(`https://api.torn.com/v2/user/${userID}/job`, {
      headers: HEADERS,
    });
    const jobData = await jobRes.json();
    if (jobData.job === null || jobData.job.type === "job") {
      companyType = null;
      companyRating = null;
    } else if (jobData.job.type === "company") {
      companyType = jobData.job.type_id;
      companyRating = jobData.job.rating;
    }
    return { companyType, companyRating };
  } catch (error) {
    console.error(`Error fetching job for user ${userID}:`, error);
  }
}

async function fetchUserStats(userID) {
  let xanaxTaken, refillsUsed, cansUsed;

  try {
    const personalStatsRes = await fetch(
      `https://api.torn.com/v2/user/${userID}/personalstats?cat=popular`,
      {
        headers: HEADERS,
      }
    );
    const personalStatsData = await personalStatsRes.json();
    xanaxTaken = personalStatsData.personalstats.drugs.xanax;
    refillsUsed = personalStatsData.personalstats.other.refills.energy;
    cansUsed = personalStatsData.personalstats.items.used.energy_drinks;
    return {
      xanaxTaken,
      refillsUsed,
      cansUsed,
    };
  } catch (error) {
    console.error(`Error fetching stats for user ${userID}:`, error);
  }
}
