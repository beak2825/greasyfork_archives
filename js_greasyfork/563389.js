// ==UserScript==
// @name         BotC homebrew script Prettyprinter
// @namespace    http://tampermonkey.net/
// @version      2026-01-25
// @description  improves the print of scripts with much content
// @author       You
// @match        https://script.bloodontheclocktower.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloodontheclocktower.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563389/BotC%20homebrew%20script%20Prettyprinter.user.js
// @updateURL https://update.greasyfork.org/scripts/563389/BotC%20homebrew%20script%20Prettyprinter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CustomScript
    {
        /** Swaps the Almanac URL for a list of character names*/
        static addAlmanac(almanacUrl, listOfCharacterNames)
        {
            for (let characterName of listOfCharacterNames)
            {
                characterName = characterName.toLowerCase().replaceAll(/[^\d\w]/g, "");

                let link = document.querySelector(`[id^="${characterName}"].item .character-name a`);
                let [_, entryName] = link.href.split("#");
                let [name] = entryName.split("_", 1);
                let almanacName = /[^\/]+(?=\/almanac\.html$)/.exec(almanacUrl)[0]
                almanacName = almanacName.replaceAll(/[^\d\w_]/g, "");

                link.href = `${almanacUrl}#${name}_${almanacName}`;
            }
        }

        static adjustCharacterImages(almanacNames)
        {
            for (let image of Array.from(document.querySelectorAll(`:is([id$=_${almanacNames.join("],[id$=_")}]) .icon-container img`)))
            {
                image.style.transform = "translateY(0.5lh)";
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

            almanachLink.value = `https://www.bloodstar.xyz/p/Elmar/trust-me-bro/almanac.html`;

            CustomScript.addAlmanac("https://www.bloodstar.xyz/p/Elmar/homebrew/almanac.html",
                    ["pope", "dowser", "samurai", "traitor", "romantic", "sinisterfog", "shredder", "shopkeeper", "sleepwalker", "vice", "fantasist"]
            );

            homebrewJinxesInput.value =
`  Pope / Shredder: The Pope-protected player cannot be chosen for assassination (except if a Demon assassinates the self-protected Pope).
  Pope / Punk: The Punk cannot get the Pope token.
  Anarchist / Samurai: A Samurai player can only kill an Anarchist when the Samurai has another character that only counts as Outsider this game.
  Putin / Anarchist: If Putin chooses the Anarchist player, the Anarchist registers as good (otherwise evil).
  Trump / Anarchist: The Anarchist *might* register as good to Trump.
  Sectarian / Romantic: The Sectarian *might* learn that the Romantic is in play.`;

            let page3 = (document.querySelector("page-three"));
            if (page3) page3.style.breakBefore = "avoid";
            if (page3) page3.style.breakAfter = "avoid";
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

            almanachLink.value = `https://www.bloodstar.xyz/p/Elmar/trust-me-bro/almanac.html`;

            homebrewJinxesInput.value =
`  Legionatic / Anarchist: The Anarchist *might* register as good to Legion.
  Legionatic / Spy: If a Legionatic has a drunk spy ability, they see no Legionatic characters in the grimoire but the Legionatics' drunk abilities plus 1 demon.
  Spy / Poppy Snitch: If the Poppy Snitch has their ability, the Spy does not see the Grimoire.
  Spy / Wicked: Both cannot be in play together.
  Soulmate: The Soulmate ability is drunk for players who learnt a current demon (e.g. via minion info).
  Atheist: In an atheist game, the story teller manipulates ≤ 1 person's abilities, misregisters ≤ X players as evil minions/demons, fakes minion signals & has 1 demon ability. [X = regular # of evil]
  Alsaahir: The Alsaahir's guess applies to the actual character type, else (if incorrect) to the misregistered one.
  Alsaahir / Legionatic: Alsaahir may guess the Townsfolk & Outsider players instead.
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

    console.log("start prettyprint BotC script");

    let form = document.createElement("form");
    form.innerHTML = `
    <label>Almanach-URL: </label>
    <input id="almanach-url-input" name="almanach-url" placeholder="&lt;URL&gt;" autocomplete="off" size="100">
    <label>Homebrew Jinxes: (Format: <code>‹character›/‹character›…: ‹description›</code>)</label>
    <textarea id="homebrew-jinxes-input" cols="100" oninput="event.target.style.height = '5px'; event.target.style.height = event.target.scrollHeight + 'px'"></textarea>
    `;

    let metadataForm = document.getElementById("metadata");
    metadataForm.prepend(form);

    var almanachLink = document.getElementById(`almanach-url-input`);
    var homebrewJinxesInput = document.getElementById(`homebrew-jinxes-input`);

    function formatPageForPrint()
    {
        let scriptName = document.getElementById("script-name-input").value;
        CustomScript.format(scriptName);

        let scriptNameElement = document.querySelector("#title .script-name");
        let link = document.createElement("a");
        link.textContent = scriptNameElement.textContent;
        link.href = almanachLink.value;
        scriptNameElement.replaceChildren(link);

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

        let page2 = (document.querySelector("page-two"));
        if (page2) page2.style.breakBefore = "avoid";
        if (page2) page2.style.breakAfter = "avoid";
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
        jinxEntry.classList.add("item");
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
        icon.classList.add("jinx-icon");
        icon.onclick = () => { document.getElementById(`${id}`).scrollIntoView({ behavior: 'smooth', block: 'center' }) };
        icon.src = nameUrlPairs[1][1];

        characterJinxesTray.append(icon);
    }

    function getUrlsFromCharacter(characterString)
    {
        return document.querySelector(`img[id^="${characterString}"][id$="-icon-script"]`).src;
    }
})();