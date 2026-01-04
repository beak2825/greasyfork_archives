// ==UserScript==
// @name         E1Script
// @namespace    http://tampermonkey.net/
// @version      2025-12-13
// @description  Just Barss
// @author       NN
// @license      MIT
// @match        https://evades.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evades.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558436/E1Script.user.js
// @updateURL https://update.greasyfork.org/scripts/558436/E1Script.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const allCreatedElements = [];
  let settingsLauncherElement;
  let thirdAbilityValuePx = 0;
  let isUserExit;

  let userAreaIndex, userArea, userWorld;
  let userHero, userHeroColor;
  let userName;
  let isUserDead;

  function main() {
    settingsLauncherElement.firstChild.click();
    const checkSettingsInterval = setInterval(() => {
      if (document.querySelector(".settings")) {
        const settingsElement = document.querySelector(".settings");
        const displayLeaderboardElement = document.querySelector("#displayLeaderboard");
        if (!displayLeaderboardElement.checked) {
          displayLeaderboardElement.click();
          const settingsButtonElements = document.querySelectorAll(".settings-button")[2].click();
        }
        GM_addStyle(".settings { opacity: 1 !important }");
        settingsLauncherElement.firstChild.click();

        clearInterval(checkSettingsInterval);
      }
    }, 20);

    let xFactorbPressedCount;

    const pixelReleaserElement = document.createElement("div");
    allCreatedElements.push(pixelReleaserElement);
    pixelReleaserElement.id = "pixel-releaser";
    document.body.appendChild(pixelReleaserElement);

    const allLeaderboardPlayers = document.querySelectorAll(".leaderboard-name");
    allLeaderboardPlayers.forEach(span => {
      if (span.querySelector('b')) {
        userHero = span.querySelector(".leaderboard-hero").title;
        userHeroColor = span.querySelector(".leaderboard-hero").style.backgroundColor;
        if (span.parentElement.querySelector(".leaderboard-area").innerText.match(/\d+$/)?.[0]) {
          userAreaIndex = span.parentElement.querySelector(".leaderboard-area").innerText.match(/\d+$/)[0];
        } else {
          userAreaIndex = '';
        }
        userArea = span.parentElement.querySelector(".leaderboard-area").innerText.replace(/\s\d+$/, '');
        userWorld = (span.parentElement.classList[1].replace("-Dull", '').replace('-', ' ').trim() + ' ' + (span.parentElement.classList[2] ? span.parentElement.classList[2].replace("-Dull", '').trim() : '')).trim();
        userName = span.parentElement.title.replace(/\s*\[.*\]$/, '');
        if (span.parentElement.classList.contains("leaderboard-downed")) {
          isUserDead = true;
        } else {
          isUserDead = false;
        }
        const checkUserDivClassChanging = new MutationObserver(() => {
          if (span.parentElement.classList.contains("leaderboard-downed")) {
            isUserDead = true;
          } else {
            isUserDead = false;
          }
        });
        const checkLBAreaInnerText = new MutationObserver(() => {
          if (span.parentElement.querySelector(".leaderboard-area").innerText.match(/\d+$/)?.[0]) {
          userAreaIndex = span.parentElement.querySelector(".leaderboard-area").innerText.match(/\d+$/)[0];
        } else {
          userAreaIndex = '';
        }
          userArea = span.parentElement.querySelector(".leaderboard-area").innerText.replace(/\s\d+$/, '');
          if (xFactorbPressedCount % 2 === 1) {
            xFactorbPressedCount--;
          }
        });
        const checkUsersDivClasses = new MutationObserver(() => {
          userWorld = (span.parentElement.classList[1].replace("-Dull", '').replace('-', ' ').trim() + ' ' + (span.parentElement.classList[2] ? span.parentElement.classList[2].replace("-Dull", '').trim() : '')).trim();
        });
        checkUserDivClassChanging.observe(span.parentElement, { attributes: true, attributeFilter: ['class'] });
        checkLBAreaInnerText.observe(span.parentElement.querySelector(".leaderboard-area"), { characterData: true, subtree: true });
        checkUsersDivClasses.observe(span.parentElement, { attributes: true, attributeFilter: ["class"] });
      }
    });

    const chatInputElement = document.querySelector("#chat-input");
    const chatWindowElement = document.querySelector("#chat-window");
    const leaderboardElement = document.querySelector("#leaderboard");


    class Command {
      constructor(prefix, name, action) {
        this.prefix = prefix;
        this.name = name;
        this.action = action;
      }

      matches(input) {
        return input.toLowerCase() === this.prefix + this.name;
      }
      get isMononame() {
        if (typeof name === "object") {
          return false;
        } else {
          return true;
        }
      }
    }

    const commands = [
      new Command("!", "help", () => {
        const msg = document.createElement("div");
        const title = document.createElement("div");
        title.classList.add("chat-message");
        title.style.color = "rgb(225 0 0)";
        title.style.fontWeight = "800";
        title.style.fontSize = "18px";
        title.style.textAlign = "center";
        title.textContent = "Commands";
        msg.classList.add("chat-message");
        msg.style.color = "rgb(225 0 0)";
        msg.style.fontWeight = "700";
        msg.textContent = "============================\n• !lb - toggle leaderboard\n============================";
        chatWindowElement.appendChild(msg);
        msg.prepend(title);
      }),
      new Command("!", "lb", () => {
        leaderboardElement.classList.toggle("hide-leaderboard-custom");
      })
    ];


    chatInputElement.addEventListener("keydown", e => {
      if (e.code === "Enter") {
        const chatInputValue = chatInputElement.value.trim();
        if (chatInputValue.startsWith("!")) {
          for (const cmd of commands) {
            if (cmd.matches(chatInputValue)) {
              cmd.action();
              break;
            }
          }
          chatInputElement.value = "";
        }
        chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
      }
    });

    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    switch (userHero) {
      case "Chrono":
        chronoScript();
        console.log("Chrono script launched!");
        break;
      case "Reaper":
        reaperScript();
        console.log("Reaper script launched!");
        break;
      case "Jötunn":
        jotunnScript();
        console.log("Jötunn script launched!");
        break;
      case "Mirage":
        mirageScript();
        console.log("Mirage script launched!");
        break;
      case "Factorb":
        factorbScript();
        console.log("Factorb script launched!");
        break;
    }

    let cursorPosX, cursorPosY;

    const pressZ = new KeyboardEvent('keydown', {
      key: 'z',
      keyCode: 122,
      code: 'KeyZ',
      bubbles: true,
      cancelable: true
    });

    const pressJ = new KeyboardEvent('keydown', {
      key: 'j',
      keyCode: 74,
      code: 'KeyJ',
      bubbles: true,
      cancelable: true
    });

    document.addEventListener("mousemove", e => {
      cursorPosX = e.clientX;
      cursorPosY = e.clientY;
    });

    document.addEventListener("keydown", e => {
      if (e.code === "KeyY") {
        const rect = c.getBoundingClientRect();
        const x = Math.floor(cursorPosX - rect.left);
        const y = Math.floor(cursorPosY - rect.top);

        const d = ctx.getImageData(x, y, 1, 1).data;
        pixelReleaserElement.textContent = `R:${d[0]} G:${d[1]} B:${d[2]}\n x:${(cursorPosX - rect.left).toFixed(0)} y:${(cursorPosY - rect.top).toFixed(0)}`;
      }
    });



    let lastDeathCheck = 0;
    /*
    function gameLoop(timestamp) {
        if (timestamp - lastDeathCheck > 250) {
            isHeroUnderDeath();
            lastDeathCheck = timestamp;
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
    */


    GM_addStyle(`
          .settings {
            opacity: 0;
          }
          .hide-leaderboard-custom {
            opacity: 0;
            user-select: none !important;
            pointer-events: none !important;
          }
          #pixel-releaser {
            position: absolute;
            display: flex;
            left: 50%;
            top: 15%;
            z-index: 1000;
            transform: translate(-50%, -50%);
            min-width: 140px;
            height: 80px;
            border-radius: 8px;
            background-color: hsl(0 0% 60%);
            color: hsl(0 0% 25%);
            font-size: 30px;
            font-weight: 600;
            justify-content: center;
            align-items: center;
            opacity: 0.6;
            pointer-events: none;
            user-select: none;
          }

          #reaper-bar {
            position: absolute;
            overflow: hidden;
            top: 44%;
            left: 50.5%;
            transform: translate(-50%, -50%);
            z-index: 1500;
            width: 100px;
            height: 10px;
            border-radius: 20px;
            border: 1.5px solid hsl(0 0% 0%);
            background: transparent;
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
          }
          #reaper-duration-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1250;
            background-color: rgb(46 68 141);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 3.5s linear, background-color 3.5s ease-in;
          }
          #reaper-cooldown-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            z-index: 1200;
            background-color: rgb(15 22 47);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 5.5s linear;
          }

          #jotunn-aura-zone-1 {
            position: absolute;
            transform: translate(-50%, -50%);
            z-index: 1500;
            border-radius: 50%;
            background-color: rgb(92, 172, 255);
            opacity: 0.05;
            pointer-events: none;
            user-select: none;
          }

          #chrono-bar-2 {
            position: absolute;
            overflow: hidden;
            top: 44%;
            left: 50.5%;
            transform: translate(-50%, -50%);
            z-index: 1500;
            width: 100px;
            height: 10px;
            border-radius: 20px;
            border: 1.5px solid hsl(0 0% 0%);
            background: transparent;
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
          }
          #chrono-duration-bar-2 {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1250;
            background-color: rgb(26 169 138);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 3s linear, background-color 3s ease-in;
          }
          #chrono-cooldown-bar-2 {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            z-index: 1200;
            background-color: rgb(8 50 41);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 2s linear;
          }
          #chrono-bar-1 {
            position: absolute;
            overflow: hidden;
            left: 50.5%;
            transform: translate(-50%, -50%);
            z-index: 1500;
            width: 100px;
            height: 10px;
            border-radius: 20px;
            border: 1.5px solid hsl(0 0% 0%);
            background: transparent;
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
          }
          #chrono-duration-bar-1 {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1250;
            background-color: rgb(0 159 190);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 0s linear;
          }
          #chrono-cooldown-bar-1 {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            z-index: 1200;
            background-color: rgb(0 53 63);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 5.5s linear;
          }

          #mirage-bar {
            position: absolute;
            overflow: hidden;
            top: 44%;
            left: 50.5%;
            transform: translate(-50%, -50%);
            z-index: 1500;
            width: 100px;
            height: 10px;
            border-radius: 20px;
            border: 1.5px solid hsl(0 0% 0%);
            background: transparent;
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
          }
          #mirage-duration-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1250;
            background-color: rgb(11 18 106);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 3.5s linear;
          }
          #mirage-cooldown-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            z-index: 1200;
            background-color: rgb(3 5 32);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 5.5s linear;
          }

          #factorb-bar {
            position: absolute;
            overflow: hidden;
            top: 44%;
            left: 50.5%;
            transform: translate(-50%, -50%);
            z-index: 1500;
            width: 100px;
            height: 10px;
            border-radius: 20px;
            border: 1.5px solid hsl(0 0% 0%);
            background: transparent;
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
          }
          #factorb-duration-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1250;
            background-color: rgb(165 165 177);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 3s linear;
          }
          #factorb-cooldown-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            z-index: 1200;
            background-color: rgb(55 55 59);
            opacity: 0.9;
            pointer-events: none;
            user-select: none;
            transition: width 1s linear;
          }
        `);

    function getRGBCode(x, y) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      return d.join('').slice(0, -3);
    }

    function isHeroUnderDeath() {
      const cx = (678 + 619) / 2;
      const cy = (335 + 394) / 2;
      const R = cx - 619;
      const step = 0.05;

      for (let angle = 0; angle < Math.PI * 2; angle += step) {
        const x = Math.round(cx + R * Math.cos(angle));
        const y = Math.round(cy + R * Math.sin(angle));

        const data = ctx.getImageData(x, y, 1, 1).data;
        if (data.join('').slice(0, -3) === "000") {
          for (let n = 1; n <= 50; n++) {
            c.dispatchEvent(pressZ);
            c.dispatchEvent(pressJ);
          }
          pixelReleaserElement.textContent = "So close!";
          console.log("The enemy was so close!");
          return true;
        }
      }
      return false;
    }

    function chronoScript() {
      let chronoBar_2Element, chronoDurationBar_2Element, chronoCooldownBar_2Element;
      chronoBar_2Element = document.createElement("div");
      allCreatedElements.push(chronoBar_2Element);
      chronoBar_2Element.id = "chrono-bar-2";
      document.body.appendChild(chronoBar_2Element);

      barResizer(chronoBar_2Element, 50, 44);

      chronoDurationBar_2Element = document.createElement("div");
      allCreatedElements.push(chronoDurationBar_2Element);
      chronoDurationBar_2Element.id = "chrono-duration-bar-2";
      chronoBar_2Element.appendChild(chronoDurationBar_2Element);

      chronoCooldownBar_2Element = document.createElement("div");
      allCreatedElements.push(chronoCooldownBar_2Element);
      chronoCooldownBar_2Element.id = "chrono-cooldown-bar-2";
      chronoBar_2Element.appendChild(chronoCooldownBar_2Element);

      document.addEventListener("keydown", e => {
        if (e.code === "KeyX" && getRGBCode(getUsersXpx(866) - thirdAbilityValuePx, getUsersYpx(670)) === "26169138" && !isUserDead) {
          chronoDurationBar_2Element.style.transition = "width 3s linear";
          chronoCooldownBar_2Element.style.transition = "width 2s linear";
          chronoDurationBar_2Element.style.transition = "width 3s linear";
          chronoDurationBar_2Element.style.transition = "width 3s linear";

          chronoDurationBar_2Element.style.width = "0%";

          setTimeout(() => {
            chronoCooldownBar_2Element.style.width = "100%";

            setTimeout(() => {
              chronoCooldownBar_2Element.style.transition = "width 0s linear";
              chronoCooldownBar_2Element.style.width = "0%";
              chronoDurationBar_2Element.style.transition = "width 0s linear, background-color 0s ease-in";
              chronoDurationBar_2Element.style.width = "100%";
            }, 2050);
          }, 3050);
        }
      });

      let chronoBar_1Element, chronoDurationBar_1Element, chronoCooldownBar_1Element;
      chronoBar_1Element = document.createElement("div");
      allCreatedElements.push(chronoBar_1Element);
      chronoBar_1Element.id = "chrono-bar-1";
      document.body.appendChild(chronoBar_1Element);

      barResizer(chronoBar_1Element, 50, 42);

      chronoDurationBar_1Element = document.createElement("div");
      allCreatedElements.push(chronoDurationBar_1Element);
      chronoDurationBar_1Element.id = "chrono-duration-bar-1";
      chronoBar_1Element.appendChild(chronoDurationBar_1Element);

      chronoCooldownBar_1Element = document.createElement("div");
      allCreatedElements.push(chronoCooldownBar_1Element);
      chronoCooldownBar_1Element.id = "chrono-cooldown-bar-1";
      chronoBar_1Element.appendChild(chronoCooldownBar_1Element);

      document.addEventListener("keydown", e => {
        if (e.code === "KeyZ" && getRGBCode(getUsersXpx(783) - thirdAbilityValuePx, getUsersYpx(670)) === "0159190") {
          chronoDurationBar_1Element.style.transition = "width 0s linear";
          chronoDurationBar_1Element.style.width = "0";
          chronoCooldownBar_1Element.style.transition = "width 5.5s linear";
          chronoCooldownBar_1Element.style.width = "100%";

          setTimeout(() => {
            chronoCooldownBar_1Element.style.transition = "width 0s linear";
            chronoCooldownBar_1Element.style.width = "0";
            chronoDurationBar_1Element.style.width = "100%";
          }, 5550);
        }
      });
      allLeaderboardPlayers.forEach(span => {
        if (span.querySelector('b')) {
          let isHaveUsersDivDownedclass = isUserDead;
          let isUserChangedWorld;
          const checkUserDivClassChangingChrono = new MutationObserver(() => {
            if (!isHaveUsersDivDownedclass === !span.parentElement.classList.contains("leaderboard-downed")) {
              isUserChangedWorld = true;
            } else {
              isUserChangedWorld = false;
            }
            if (span.parentElement.classList.contains("leaderboard-downed")) {
              chronoCooldownBar_1Element.style.transition = "width 0s linear";
              chronoCooldownBar_1Element.style.width = "0";
              chronoDurationBar_1Element.style.width = "100%";
              chronoDurationBar_1Element.style.transition = "width 2.6s linear";
              chronoDurationBar_1Element.style.width = "0";

              setTimeout(() => {
                chronoDurationBar_1Element.style.transition = "width 0s linear";
                chronoDurationBar_1Element.style.width = "0";
              }, 2600);
            } else if (!span.parentElement.classList.contains("leaderboard-downed") && !isUserChangedWorld) {
              chronoDurationBar_1Element.style.transition = "width 0s linear";
              chronoDurationBar_1Element.style.width = "0";
            }
          });
          checkUserDivClassChangingChrono.observe(span.parentElement, { attributes: true, attributeFilter: ['class'] });
        }
      });
    }
    function reaperScript() {
      let reaperBarElement, reaperDurationBarElement, reaperCooldownBarElement;
      reaperBarElement = document.createElement("div");
      allCreatedElements.push(reaperBarElement);
      reaperBarElement.id = "reaper-bar";
      document.body.appendChild(reaperBarElement);

      barResizer(reaperBarElement, 50, 43.5);

      reaperDurationBarElement = document.createElement("div");
      allCreatedElements.push(reaperDurationBarElement);
      reaperDurationBarElement.id = "reaper-duration-bar";
      reaperBarElement.appendChild(reaperDurationBarElement);

      reaperCooldownBarElement = document.createElement("div");
      allCreatedElements.push(reaperCooldownBarElement);
      reaperCooldownBarElement.id = "reaper-cooldown-bar";
      reaperBarElement.appendChild(reaperCooldownBarElement);

      document.addEventListener("keydown", e => {
        if (e.code === "KeyX" && getRGBCode(getUsersXpx(866) - thirdAbilityValuePx, getUsersYpx(670)) === "4668141" && !isUserDead) {
          reaperDurationBarElement.style.transition = "width 3.5s linear, background-color 3.5s ease-in";
          reaperCooldownBarElement.style.transition = "width 5.5s linear";
          reaperDurationBarElement.style.transition = "background-color 0s ease-in, width 3.5s linear";
          reaperDurationBarElement.style.backgroundColor = "rgb(46 68 141)";
          reaperDurationBarElement.style.transition = "background-color 3.5s ease-in, width 3.5s linear";

          reaperDurationBarElement.style.width = "0%";
          reaperDurationBarElement.style.backgroundColor = "rgb(255 0 0)";

          setTimeout(() => {
            reaperCooldownBarElement.style.width = "100%";

            setTimeout(() => {
              reaperCooldownBarElement.style.transition = "width 0s linear";
              reaperCooldownBarElement.style.width = "0%";
              reaperDurationBarElement.style.transition = "width 0s linear, background-color 0s ease-in";
              reaperDurationBarElement.style.width = "100%";
              reaperDurationBarElement.style.backgroundColor = "rgb(46 68 141)";
            }, 5550);
          }, 3600);
        }
      });
    }
    function jotunnScript() {
      let jotunnAuraZone_1Element;
      jotunnAuraZone_1Element = document.createElement("div");
      allCreatedElements.push(jotunnAuraZone_1Element);
      jotunnAuraZone_1Element.id = "jotunn-aura-zone-1";
      document.body.appendChild(jotunnAuraZone_1Element);

      jotunnAuraZone_1Element.style.width = `${getUsersXSize(340)}px`;
      jotunnAuraZone_1Element.style.height = `${getUsersXSize(340)}px`;
      jotunnAuraZone_1Element.style.left = `${c.width * 0.5 + ((window.innerWidth - c.width) / 2)}px`;
      jotunnAuraZone_1Element.style.top = `${c.height * 0.5 + ((window.innerHeight - c.height) / 2)}px`;
      window.addEventListener("resize", () => {
        jotunnAuraZone_1Element.style.width = `${getUsersXSize(340)}px`;
        jotunnAuraZone_1Element.style.height = `${getUsersXSize(340)}px`;
        jotunnAuraZone_1Element.style.top = `${c.height * 0.5 + ((window.innerHeight - c.height) / 2)}px`;
        jotunnAuraZone_1Element.style.left = `${c.width * 0.5 + ((window.innerWidth - c.width) / 2)}px`;
      });
    }
    function mirageScript() {
      let mirageBarElement, mirageDurationBarElement, mirageCooldownBarElement;
      mirageBarElement = document.createElement("div");
      allCreatedElements.push(mirageBarElement);
      mirageBarElement.id = "mirage-bar";
      document.body.appendChild(mirageBarElement);

      barResizer(mirageBarElement, 50, 43.5);

      mirageDurationBarElement = document.createElement("div");
      allCreatedElements.push(mirageDurationBarElement);
      mirageDurationBarElement.id = "mirage-duration-bar";
      mirageBarElement.appendChild(mirageDurationBarElement);

      mirageCooldownBarElement = document.createElement("div");
      allCreatedElements.push(mirageCooldownBarElement);
      mirageCooldownBarElement.id = "mirage-cooldown-bar";
      mirageBarElement.appendChild(mirageCooldownBarElement);

      document.addEventListener("keydown", e => {
        if (e.code === "KeyX" && getRGBCode(getUsersXpx(866) - thirdAbilityValuePx, getUsersYpx(670)) === "6169154" && !isUserDead) {
          
        }
      });
    }
    function factorbScript() {
      let factorbBarElement, factorbDurationBarElement, factorbCooldownBarElement;
      xFactorbPressedCount = 0;
      factorbBarElement = document.createElement("div");
      allCreatedElements.push(factorbBarElement);
      factorbBarElement.id = "factorb-bar";
      document.body.appendChild(factorbBarElement);

      barResizer(factorbBarElement, 50, 43.5);

      factorbDurationBarElement = document.createElement("div");
      allCreatedElements.push(factorbDurationBarElement);
      factorbDurationBarElement.id = "factorb-duration-bar";
      factorbBarElement.appendChild(factorbDurationBarElement);

      factorbCooldownBarElement = document.createElement("div");
      allCreatedElements.push(factorbCooldownBarElement);
      factorbCooldownBarElement.id = "factorb-cooldown-bar";
      factorbBarElement.appendChild(factorbCooldownBarElement);

      document.addEventListener("keydown", e => {
        if (e.code === "KeyX" && getRGBCode(getUsersXpx(866) - thirdAbilityValuePx, getUsersYpx(670)) === "165165177" && !isUserDead) {
          xFactorbPressedCount++;
        }
        if (e.code === "KeyX" && getRGBCode(getUsersXpx(866) - thirdAbilityValuePx, getUsersYpx(670)) === "165165177" && !isUserDead && xFactorbPressedCount % 2 === 0) {
          setupHeroCooldownDuration(factorbDurationBarElement, factorbCooldownBarElement, 3, 1, "rgb(165 165 177)");
        }
      });
    }
    
    
    function setupHeroCooldownDuration(durationBarElement, cooldownBarElement, durationTime, cooldownTime, fillColor) {
      durationBarElement.style.transition = `width ${durationTime}s linear`;
      cooldownBarElement.style.transition = `width ${cooldownTime}s linear`;
      durationBarElement.style.transition = `width ${durationTime}s linear`;
      durationBarElement.style.backgroundColor = fillColor;
      durationBarElement.style.transition = `width ${durationTime}s linear`;

      durationBarElement.style.width = "0%";

      setTimeout(() => {
        cooldownBarElement.style.width = "100%";

        setTimeout(() => {
          cooldownBarElement.style.transition = "width 0s linear";
          cooldownBarElement.style.width = "0%";
          durationBarElement.style.transition = "width 0s linear";
          durationBarElement.style.width = "100%";
          durationBarElement.style.backgroundColor = fillColor;
        }, cooldownTime * 1000 + 50);
      }, durationTime * 1000 + 50);
    }


    function getUsersXpx(defaultXpx) {
      return Math.floor((defaultXpx * c.width) / 1298);
    }
    function getUsersYpx(defaultYpx) {
      return Math.floor((defaultYpx * c.height) / 730);
    }
    function getUsersXSize(defaultXSize) {
      return Math.floor((defaultXSize * window.innerWidth) / 1536);
    }
    function getUsersYSize(defaultYSize) {
      return Math.floor((defaultYSize * window.innerHeight) / 730);
    }
    function barResizer(barElement, barPositionXperc, barPositionYperc) {
      barElement.style.width = `${getUsersXSize(100)}px`;
      barElement.style.height = `${getUsersYpx(10)}px`;
      barElement.style.top = `${c.height * (barPositionYperc / 100) + ((window.innerHeight - c.height) / 2)}px`;
      barElement.style.left = `${c.width * (barPositionXperc / 100) + ((window.innerWidth - c.width) / 2)}px`;
      window.addEventListener("resize", () => {
        barElement.style.width = `${getUsersXSize(100)}px`;
        barElement.style.height = `${getUsersYpx(10)}px`;
        barElement.style.top = `${c.height * (barPositionYperc / 100) + ((window.innerHeight - c.height) / 2)}px`;
        barElement.style.left = `${c.width * (barPositionXperc / 100) + ((window.innerWidth - c.width) / 2)}px`;
      });
    }
  }

  const checkInterval = setInterval(() => {
    if (document.querySelector(".settings-launcher")) {
      [...document.querySelector(".settings-launcher").children].forEach(el => {
        if (el.tagName === "IMG" && el.src === "https://evades.io/options.0a0f55d5.webp") {
          clearInterval(checkInterval);

          settingsLauncherElement = document.querySelector(".settings-launcher");
          main();

          isUserExit = setInterval(() => {
            settingsLauncherElement = document.querySelector(".settings-launcher");
            if (!settingsLauncherElement) {
              allCreatedElements.forEach(el => {
                el.style.display = "none";
                el.style.pointerEvents = "none";
                el.style.userSelect = "none";
              });

              clearInterval(isUserExit);
            }
          }, 750);
        }
      });
    }
  }, 350);
})();