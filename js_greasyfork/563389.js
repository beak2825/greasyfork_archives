// ==UserScript==
// @name         BotC homebrew script Helper
// @namespace    http://tampermonkey.net/
// @version      2026-01-28
// @description  pretty formatting of large scripts, support homebrew jinxes and automatic synchronization with Bloodstar
// @author       You
// @match        https://script.bloodontheclocktower.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloodontheclocktower.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563389/BotC%20homebrew%20script%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563389/BotC%20homebrew%20script%20Helper.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    console.log("start prettyprint BotC script");

    let form = document.createElement("form");
    form.innerHTML = `
    <label for="characters-json-url">Bloodstar-JSON-URLs (newline-separated): </label><button id="update-almanac-jsons-button">Update</button>
    <textarea id="characters-json-url-input" name="characters-json-url" placeholder="&lt;URLs&gt;" cols="100" autocorrect="off" oninput="event.target.style.height = '5px'; event.target.style.height = event.target.scrollHeight + 'px'"></textarea>
    <label for="homebrew-jinxes">Homebrew Jinxes: (Format: <code>‹character›/‹character›…: ‹description›</code>)</label><button id="update-homebrew-jinxes-button">Update</button>
    <textarea id="homebrew-jinxes-input" name="homebrew-jinxes" cols="100" oninput="event.target.style.height = '5px'; event.target.style.height = event.target.scrollHeight + 'px'"></textarea>
    `;

    let metadataForm = document.getElementById("metadata");
    metadataForm.prepend(form);

    var jsonUrlInput = document.getElementById("characters-json-url-input");
    jsonUrlInput.value =
`https://www.bloodstar.xyz/p/Elmar/trust-me-bro/script.json?6f41d5de
https://www.bloodstar.xyz/p/Elmar/homebrew/script.json?703b36dd`;

    class Almanac
    {
        static create(jsonUrl, json)
        {
            return {
                jsonUrl: jsonUrl,
                name: Almanac.getAlmanacName(jsonUrl),
                json: json,
            };
        }

        static toHtmlUrl(jsonUrl)
        {
            return jsonUrl.replace(/\/[^\/]+$/, "/almanac.html");
        }

        static getAlmanacName(url)
        {
            let almanacName = /[^\/]+(?=\/[^\/]+$)/.exec(url)[0];

            almanacName = almanacName.replaceAll(/[^\d\w_]/g, "");
            return almanacName;
        }

        static getUpdatedUrl(href, almanacUrl)
        {
            let [_, entryName] = href.split("#");
            let [name, almanacName] = entryName.split("_");

            if (typeof(almanacUrl) !== "string")
                almanacUrl = almanacUrl[almanacName].json[0].almanac;

            return `${almanacUrl}#${name}_${almanacName}`;
        }
    }

    function getCharacterEntries(almanacNames)
    {
        return document.querySelectorAll(`:is([id$=_${almanacNames.join("],[id$=_")}]).item`);
    }

    class CustomScript
    {
        static adjustCharacterImages(almanacNames)
        {
            for (let characterEntry of Array.from(getCharacterEntries(almanacNames)))
            {
                let image = characterEntry.querySelector(`.icon-container img`);
                image.style.transform = "translateY(0.5lh)";
            }
        }

        static compressCharacterRosterMore(reducedGap)
        {
            for (let gridItem of Array.from(document.querySelectorAll(`#script .script .item`))) {
                gridItem.style.marginBottom = reducedGap;
            }
        }

        static format(scriptName)
        {
            let alphanumName = scriptName.replace(/[^\w\d]/g, '');
            CustomScript[alphanumName]();
        }

        static DearDictator()
        {
            CustomScript.adjustCharacterImages(["trustmebro", "homebrew"]);

            if (!homebrewJinxesInput.value.trim())
                homebrewJinxesInput.value =
`  Pope / Shredder: The Pope-protected player cannot be chosen for assassination (except if a Demon assassinates the self-protected Pope).
  Pope / Punk: The Punk cannot get the Pope token.
  Anarchist / Samurai: A Samurai player can only kill an Anarchist when the Samurai has another character that only counts as Outsider this game.
  Putin / Anarchist: If Putin chooses the Anarchist player, the Anarchist registers as good (otherwise evil).
  Trump / Anarchist: The Anarchist *might* register as good to Trump.
  Trump / Travel Agent: Trump cannot be quit by other abilities.
  Sectarian / Romantic: The Sectarian *might* learn that the Romantic is in play.`;


            compressCharacterRoster();
            CustomScript.compressCharacterRosterMore("-0.3lh");

            let travellersSection = document.querySelector("div.recommended-travellers-container");
            travellersSection.style.breakBefore = "always";

            let fabledAndLoricHeading = document.querySelector(`.fabled-and-loric-heading`);
            fabledAndLoricHeading.style.margin = "-1lh 0 -0.5lh";

            let firstNightContainer = document.querySelector(`.night-sheet .first-night-container`);
            firstNightContainer.style.marginTop = "-3lh";

            let page3 = (document.querySelector("page-three"));
            if (page3) page3.style.breakBefore = "avoid";
            if (page3) page3.style.breakAfter = "avoid";

            // make it fit on 5 pages
            let nightSheet = document.querySelector(`#script .night-sheet`);
            nightSheet.style.paddingBottom = "0";

            let firstNightList = document.querySelector(`page-three .first-night`);
            firstNightList.style.lineHeight = "1";
            let otherNightList = document.querySelector(`page-four .other-night`);
            otherNightList.style.lineHeight = "1";
        }

        static TrustMeBro()
        {
            CustomScript.adjustCharacterImages(["trustmebro"]);

            let demonSectionHeader = document.querySelector(`h3[data-for="demon"]`);
            demonSectionHeader.style.transform = "translateY(1lh)";

            let fabledSectionBelowDjinn = document.querySelector(`div.jinxes-container + div.item`);
            fabledSectionBelowDjinn.style.marginTop = "3.5lh";  // add a margin between the jinxes list and the fabled on the next page
            let jinxesEntryContainer = document.querySelector(`div.jinxes-container .jinxes`);
            jinxesEntryContainer.style.rowGap = "0"; // squeezing too many Jinxes onto the 2nd page

            let fabledLoricContainer = document.querySelector(".fabled-and-loric-container");
            fabledLoricContainer.style.transform = "translateY(-2lh)";

            if (!homebrewJinxesInput.value.trim())
                homebrewJinxesInput.value =
`  Legionatic / Anarchist: The Anarchist *might* register as good to Legion.
  Legionatic / Spy: If a Legionatic has a drunk spy ability, they see no Legionatic characters in the grimoire but the Legionatics' drunk abilities plus 1 demon.
  Spy / Poppy Snitch: If the Poppy Snitch has their ability, the Spy does not see the Grimoire.
  Spy / Wicked: Both cannot be in play together.
  Soulmate: The Soulmate ability is drunk for players who learnt the demon (e.g. via minion info).
  Atheist: In an atheist game, the story teller manipulates ≤ 1 person's abilities, misregisters ≤ X players as evil minions/demons, fakes minion signals & has 1 demon ability. [X = regular # of evil]
  Alsaahir: The Alsaahir's guess applies to the actual character type, else (if incorrect) to the misregistered one.
  Alsaahir / Legionatic: With Legionatic in play, the Alsaahir may guess the Townsfolk & Outsider players instead.
  Puzzlemaster / Legionatic: The Puzzledrunk is not a Legion(atic). When the sober+healthy puzzlemaster guesses right, they learn a 3rd non-Legion player.
  Puzzlemaster: The Puzzlemaster bypasses misregistration. If the Puzzlemaster guesses themself, they learn *another* non-demon player.
  Plotter: Outsiders/Minions who don't know their character type cannot be in play with the Plotter. [Lunatic, Puzzledrunk]
  Plotter / Wicked: If Plotter is in play, the Wicked gets equal to a Heretic.
  Diabolus / Sage: Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die.
  Polymath / Lunatic: If the Polymath is a Lunatic, the demon and Polymath don't know who is demon/Polymath.
  Trustmaker / Soulmate: A soulmate vessel nevertheless triggers the Trustmaker reward on death.`;

            let playerCountTableContainer = document.getElementById(`player-count-table`);
            playerCountTableContainer.style.width = "100%";
            playerCountTableContainer.innerHTML = `
  <table rules="cols">
    <tbody><tr>
      <th data-tl-key="keyword.player" data-tl-plural="">Players</th>
      <td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20+</td>
    </tr>
    <tr>
      <th data-tl-key="keyword.townsfolk" data-tl-plural="">Townsfolk</th>
      <td>2</td><td>3</td><td>4</td><td>5</td><td>5</td><td>5</td><td>6</td><td>7</td><td>7</td><td>8</td><td>9</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td>
    </tr>
    <tr>
      <th data-tl-key="keyword.outsider" data-tl-plural="">Outsiders</th>
      <td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td><td>4</td><td>4</td><td>4</td>
    </tr>
    <tr>
      <th data-tl-key="keyword.minion" data-tl-plural="">Minions</th>
      <td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>3</td><td>4</td><td>4</td><td>2</td><td>2</td><td>3</td>
    </tr>
    <tr>
      <th data-tl-key="keyword.demon" data-tl-plural="">Demons</th>
      <td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>2</td><td>2</td><td>2</td>
    </tr>
  </tbody></table>
`;
        }
    }

    var jsonUrls = new Set(jsonUrlInput.value.split("\n").map(line => line.trim()).filter(line => Boolean(line)));

    var homebrewJinxesInput = document.getElementById(`homebrew-jinxes-input`);

    function repairAlmanacLinks(almanacNames, charactersJsons)
    {
        for (let characterEntry of getCharacterEntries(almanacNames))
        {
            let link = characterEntry.querySelector(`.character-name a`);
            link.href = Almanac.getUpdatedUrl(link.href, charactersJsons);
        }
    }

    function isDefaultImageUrl(srcUrl)
    {
        return Boolean(srcUrl.match(/\/Generic_[a-z]+\.\w+$/i));
    }

    // stolen from official code
    function parseNightReminderText(text)
    {
        text += '\n';
        text = text.replaceAll(/\*(.*?)\*/g, (e, text) => `<b>${ text }</b>`);
        text = text.replaceAll(/\n(\t[\s\S]*?)\n([^\t]|$)/g, (e, t, a) => `<ul>${ t }
</ul>
        ${ a }`);
        text = text.replaceAll(/\t(.*?)\n/g, (e, t) => `<li>${ t }</li>`);
        text = text.replaceAll(':reminder:', '<i class="fa-solid fa-circle" style="font-size: 0.76em; color: #666;"></i>');
        return text;
    }

    function fillInNightSheets(characterObject)
    {
        let sectionSelector = [["firstNightReminder", ".first-night"], ["otherNightReminder", ".other-night"]];

        for (let [key, selector] of sectionSelector)
        {
            for (let nightEntry of document.querySelectorAll(`${selector} .item:has([data-type] a[href$="#${characterObject.id}"])`)) {

                if (!(key in characterObject))
                {
                    nightEntry.parentElement.removeChild(nightEntry);
                    continue;
                }

                let nightImage = nightEntry.querySelector(`img`);
                if (isDefaultImageUrl(nightImage.src))
                    nightImage.src = characterObject.image;

                let nightName = nightEntry.querySelector(`.night-sheet-char-name a`);
                if (nightName.textContent.trim() === '_')
                    nightName.textContent = characterObject.name;

                let nightReminder = nightEntry.querySelector(`.night-sheet-reminder`);
                if (nightReminder.textContent.trim() === '_')
                {
                    nightReminder.innerHTML = parseNightReminderText(characterObject[key]);
                }
            }
        }
    }

    function fillInAbilityAndNightSheet(almanacNames, charactersJsons)
    {
        for (let characterEntry of getCharacterEntries(almanacNames))
        {
            let characterName = characterEntry.getAttribute("id");

            let almanacName = characterName.split("_")[1];
            let json = charactersJsons[almanacName].json;
            let characterObject = json.find(object => object.id === characterName);

            // image
            let image = characterEntry.querySelector(`.icon-container img`);
            if (isDefaultImageUrl(image.src))
                image.src = characterObject.image;

            let name = characterEntry.querySelector(`.name-and-summary a`);
            if (name.textContent.trim() === '_')
                name.textContent = characterObject.name;

            let ability = characterEntry.querySelector(`.name-and-summary .character-summary`);
            if (ability.textContent.trim() === '_')
            {
                ability.textContent = characterObject.ability;
                ability.innerHTML = ability.innerHTML.replace(/(\[[^\]]+\])\s*$/, `<span class="setup-text">$1</span>`);
            }

            fillInNightSheets(characterObject);
        }
    }

    async function updateCharactersJSONs()
    {
        let charactersJsons = localStorage.getItem("charactersJsons");

        try {
            charactersJsons = JSON.parse(charactersJsons) ?? {};
        } catch (error) {
            charactersJsons = {};
        }

        let jsonPromises = [];

        let oldJsonUrls = new Set(Object.values(charactersJsons).map(almanac => almanac.jsonUrl));

        let loadedJsonUrls = new Set(jsonUrls);
        for (let urlText of loadedJsonUrls) {

            if (!urlText.startsWith("http"))
                urlText = "https://" + urlText;

            if (oldJsonUrls.has(urlText))  // if equal hash, no changes
            {
                console.log(`data found, skip loading ${urlText}`);
                oldJsonUrls.delete(urlText);
                loadedJsonUrls.delete(urlText);
                continue;
            }

            try {
                console.log(`fetch ${urlText}`);
                jsonPromises.push((await fetch(urlText)).json());
            } catch(error)
            {
                console.error(`could not load ${urlText}`, error);
                loadedJsonUrls.delete(urlText);
            }
        }

        oldJsonUrls.forEach(oldKey => { delete charactersJsons[Almanac.getAlmanacName(oldKey)]; });

        let newJsons = (await Promise.all(jsonPromises));
        for (let [index, jsonUrl] of Array.from(loadedJsonUrls).entries()) {

            let almanacObject = Almanac.create(jsonUrl, newJsons[index]);
            console.log(almanacObject);

            charactersJsons[almanacObject.name] = almanacObject;
        }

        localStorage.setItem("charactersJsons", JSON.stringify(charactersJsons));

        return charactersJsons;
    }

    var [charactersJsons, ] = await Promise.all([updateCharactersJSONs(), new Promise((resolve, reject) => { setTimeout(() => resolve(true), 1500); })]);

    function applyJsonData(charactersJsons) {
        let almanacNames = Object.keys(charactersJsons)
        repairAlmanacLinks(almanacNames, charactersJsons);

        fillInAbilityAndNightSheet(almanacNames, charactersJsons);
    }
    applyJsonData(charactersJsons);

    let updateAlmanacJsonsButton = document.getElementById("update-almanac-jsons-button");
    let updateAndApplyJsonData = () => updateCharactersJSONs().then(result => { charactersJsons = result; applyJsonData(charactersJsons); });
    updateAlmanacJsonsButton.addEventListener("click", (event) => {
        event.preventDefault();
        updateAndApplyJsonData();
    });

    let changeDetector = new MutationObserver((mutationList, observer) => {
        observer.takeRecords();
        updateAndApplyJsonData();
    });
    changeDetector.observe(document.getElementById("script"), { childList: true });

    function compressCharacterRoster()
    {
        for (let header of Array.from(document.querySelectorAll(`#script h3[data-for], print-box h3[data-for]`))) {
            header.style.marginTop = "0.5em";
            header.style.marginBottom = "0";
        }
    }

    function turnTitleIntoLink()
    {
        let scriptNameElement = document.querySelector("#title .script-name");
        let link = document.createElement("a");
        link.textContent = scriptNameElement.textContent;
        link.href = Almanac.toHtmlUrl(jsonUrlInput.value.split("\n", 1)[0]);
        scriptNameElement.replaceChildren(link);
    }

    function formatPageForPrint()
    {
        let scriptName = document.getElementById("script-name-input").value;
        CustomScript.format(scriptName);

        turnTitleIntoLink();

        let playerCountTable = document.querySelector("page-two #player-count-table");
        if (!playerCountTable)
            return;

        playerCountTable.getElementsByTagName("table")[0].setAttribute("rules", "cols");
        Array.from(playerCountTable.getElementsByTagName("th")).forEach(th => { th.style.paddingRight = ".5em"; th.setAttribute("contenteditable", true); });
        Array.from(playerCountTable.getElementsByTagName("td")).forEach(td => { td.style.minWidth = "1.2em"; td.setAttribute("contenteditable", true); });

        let travellersSection = document.querySelector("div.recommended-travellers-container");
        //let playerCountTable2 = document.querySelector("body > #player-count-table");
        let roster = (document.querySelector("page-one"));

        roster?.append(travellersSection, /*playerCountTable*/);

        let table = playerCountTable.querySelector("table");
        table.style.display = "block";
        table.style.width = "100%";
        table.style.lineHeight = "1";

        // widen the Jinxes and Bootlegger lists

        let jinxesContainer = document.querySelector(".jinxes-container");
        jinxesContainer.style.width = "100%";
        jinxesContainer.style.justifyContent = "start";
        addHomebrewJinxes(jinxesContainer);

        let bootleggerContainer = document.querySelector(".bootlegger-rules-container");
        bootleggerContainer.style.width = "100%";
        bootleggerContainer.style.justifyContent = "start";

        for (const node of document.querySelectorAll(".script-container .bootlegger-rules .rule"))
        {
            node.style.maxWidth = "none";
            let bulletPoint = node.parentElement.querySelector(".fa-circle")
            bulletPoint.style.scale = "1.0";
            bulletPoint.style.transform = "translateY(1em) scale(0.5)";
        }

        // page breaks
        let page2 = (document.querySelector("page-two"));
        if (page2) page2.style.breakBefore = "avoid";
        if (page2) page2.style.breakAfter = "avoid";
        if (page2) page2.style.marginBottom = "0";
        let page3 = (document.querySelector("page-three"));
        let page4 = (document.querySelector("page-four"));
        if (page4) page4.style.breakBefore = "avoid";
        if (page4) page4.style.breakAfter = "avoid";
    }

    let printButton = document.querySelector("#print-form button");
    printButton.addEventListener("click", formatPageForPrint);

    function addHomebrewJinxes(jinxesContainer)
    {
        let tableString = document.getElementById(`homebrew-jinxes-input`)?.value;
        let entries = tableString.split("\n").filter(s => Boolean(s.trim())).map(createJinxEntry).filter(entry => entry !== null);

        let jinxesEntryContainer = jinxesContainer.querySelector(`.jinxes`);

        entries.forEach(([characterNames, entry]) => {
            let lastEntryOfCharacter = jinxesEntryContainer.querySelector(`:nth-last-child(n of .item:has(.icons img[id^="${characterNames[0]}"]:first-child))`);

            if (lastEntryOfCharacter !== null) lastEntryOfCharacter.after(entry);
            else jinxesEntryContainer.append(entry);

            jinxesEntryContainer.setAttribute("nitems", Number(jinxesEntryContainer.getAttribute("nitems")) + 1);
        });
    }

    function createJinxEntry(jinxRowString)
    {
        let [charactersString, ...descriptionString] = jinxRowString.split(":");
        descriptionString = descriptionString.join(":");

        let characterNames = charactersString.split("/").map(n => n.trim().replace(/\s+/g, "").toLowerCase());
        let imageUrls = characterNames.map((name) => [name, getUrlsFromCharacter(name)]);
        let id = `${characterNames.join("-")}-jinx`;

        if (document.getElementById(id) !== null)
            return null;
        //console.log(characterNames, descriptionString);

        let jinxEntry = document.createElement("div");
        jinxEntry.setAttribute("id", id);
        jinxEntry.classList.add("item", "homebrew-jinx");
        jinxEntry.innerHTML = `
            <div class="icons">
            ${imageUrls.map(([name, url]) => `
                <img id="${name}-icon-jinxes" class="icon " src="${url}">
            `).join("")}
            </div>
            <div class="jinx-text" style="max-width: none">${descriptionString}</div>
        `;

        addSmallIconToRoster(id, imageUrls, descriptionString);

        return [characterNames, jinxEntry];
    }

    function addSmallIconToRoster(id, nameUrlPairs, descriptionString)
    {
        if (nameUrlPairs.length < 2) return;

        let sourceName = nameUrlPairs[0][0];
        let characterEntry = document.querySelector(`div[id^="${sourceName}"].item`);
        let characterNameElement = characterEntry.querySelector(`.character-name`);
        let characterJinxesTray = characterNameElement.querySelector(`.character-jinxes`);

        if (characterJinxesTray === null)
        {
            characterJinxesTray = document.createElement("div");
            characterJinxesTray.classList.add("character-jinxes");
            characterNameElement.append(characterJinxesTray);
        }

        if (characterEntry.getAttribute("data-type") === "fabled" || characterEntry.getAttribute("data-type") === "loric")
        {
            characterJinxesTray.style.transform = "translateY(-1lh)";
        }

        let icon = document.createElement("img");
        icon.title = descriptionString;
        icon.classList.add("jinx-icon", "homebrew-jinx-icon");
        icon.onclick = () => { document.getElementById(`${id}`).scrollIntoView({ behavior: 'smooth', block: 'center' }) };
        icon.src = nameUrlPairs[1][1];

        characterJinxesTray.append(icon);
    }

    function removeHomebrewJinxes()
    {
        for (let homebrewJinxEntry of Array.from(document.querySelectorAll(`.item.homebrew-jinx`))) {

            let container = homebrewJinxEntry.parentElement;
            container.removeChild(homebrewJinxEntry);
            container.setAttribute("nitems", Number(container.getAttribute("nitems")) - 1);
        }
    }

    function removeSmallIconsFromRoster()
    {
        for (let homebrewJinxIcon of Array.from(document.querySelectorAll(`.homebrew-jinx-icon`))) {
            let container = homebrewJinxIcon.parentElement;
            container.removeChild(homebrewJinxIcon);
        }
    }

    let updateHomebrewJinxesButton = document.getElementById("update-homebrew-jinxes-button");
    updateHomebrewJinxesButton.addEventListener("click", (event) => {
        event.preventDefault();
        removeHomebrewJinxes();
        removeSmallIconsFromRoster();
        addHomebrewJinxes(document.querySelector(".jinxes-container"));
    });

    function getUrlsFromCharacter(characterString)
    {
        return document.querySelector(`img[id^="${characterString}"][id$="-icon-script"]`).src;
    }
})();