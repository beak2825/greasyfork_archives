// ==UserScript==
// @name         Neopets: Fishing Log
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.4
// @description  Logs your pets' fishing
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        https://www.neopets.com/water/fishing.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/548712/Neopets%3A%20Fishing%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/548712/Neopets%3A%20Fishing%20Log.meta.js
// ==/UserScript==
/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    1. Logs your fishing, including items, item categories, the pet who got it, level ups, and the avatar
    2. Adds a log beneath your fishing page
    3. Adds options to add entries to that log and to edit an entry (look at the ID in the table and use that)
    4. Adds buttons to delete each entry
    5. Adds a way to export log data to code by using a prefix, a code to be repeated on each log entry, and a
       suffix. The pre-filled code is an example. Data may be added by using {{handlebars}}.
    6. Adds a way to customize datetime display. Check timeFormatSettings and change each to one of the allowed
       values, including "none" if you don't want to see that
    7. Adds a scheduled purge of your logged data. Change the values in purge to the number of years, months, and
       days you want to keep your log entries for. Set all to -1 to turn purging off (not recommended)
         Note: purging won't reset the IDs. This is intended behavior. IDs are unique.

    It was meant for the September 2025 Monthly Challenge of the Keepers of Neopia guild, but I figured more
    people might want to use it. Keep activateSep2025Challenge as false if you're "more people".
    Guild petpage: https://www.neopets.com/~dezys_baby

    Someday I'll publish an update documenting every single function. Today is not that day

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            Configuration
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const activateSep2025Challenge = true;
const timeFormatSettings = {
    // Possible values: pretty much any language. en-US, with the default values, looks like 'Sep 2, 08:04 PM'. en-UK looks like '2 Sept, 20:04'
    locale: "en-US",
    // Possible values: none, short (Sep), long (September), numeric (9), 2-digit (09), narrow (S)
    month: "short",
    // Possible values: none, numeric (2), 2-digit (02)
    day: "numeric",
    // Possible values: none, numeric (2025), 2-digit (25)
    year: "none",
    // Possible values: none, numeric (8 PM or 20 depending on locale), 2-digit (08 PM or 20 depending on locale)
    hour: "2-digit",
    // Possible values: none, numeric (4), 2-digit (04)
    minute: "2-digit",
    // Possible values: none, numeric (3), 2-digit (03)
    second: "none",
    // Possible values: none, decisecond (5), centisecond (54), millisecond (543)
    fraction: "none"
}
// Default setting: purges once every 45 days.
const purge = {
    // Each "year" here is composed of 365 days, regardless of leap years
    years: 0,
    // Each "month" here is composed of 30 days
    months: 1,
    // Each "day" here resets every 24 hours, not every ti
    days: 15
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
               Storage
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const retrieveId = async () => parseInt(await GM.getValue("fishing-log-id", 1)) + 1;

const usedId = async () => GM.setValue("fishing-log-id", await retrieveId());

const store = (id, data) => GM.setValue(`fishing-log-${id}`, data);

const retrieve = (id) => GM.getValue(`fishing-log-${id}`, defaultValues[id]);

const getLog = async () => JSON.parse(await GM.getValue('fishing-log', "[]"));

const storeLog = (log) => GM.setValue('fishing-log', JSON.stringify(log));

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
             Data Helpers
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const timeFormat = (key) => (!timeFormatSettings[key] || timeFormatSettings[key] === "none") ? undefined : timeFormatSettings[key];

const toTimeString = (dateTime) => new Date(dateTime).toLocaleString(timeFormat("locale"), {month: timeFormat("month"), day: timeFormat("day"), year: timeFormat("year"), hour: timeFormat("hour"), minute: timeFormat("minute"), second: timeFormat("second"), fractionalSecondDigits: timeFormat("fraction")});

const slugify = (name) => {
  return name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const httpGet = (theUrl) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

const getCategory = (itemData) => {
    for (let i = 0; i < categoryRules.length; i++) {
        if(categoryRules[i](itemData)) {
            return i;
        }
    }
    return categoryRules.length;
};

const rewordAction = (action) => {
    const category = fishingPoints[action][0];
    if(category === "Level") return "Leveled up";
    if(category === "Avatar") return "Got the avatar";
    return `Caught a ${category}`;
}

const getFishingPoints = (category) => fishingPoints[category][1];

const sumPoints = async () => {
    const log = await getLog();
    return log.reduce((agg, curr) => agg + getFishingPoints(curr.a), 0);
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
           Log Processing
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const attemptPurge = async () => {
    const time = 1000 * 60 * 60 * 24 * (purge.days + (30 * purge.months) + (365 * purge.years));
    const now = (new Date()).getTime();
    const log = await getLog();
    await storeLog(log.filter(entry => now - entry.t < time));
}

const editAction = (id, entry, log) => {
    const index = log.findIndex(entry => entry.id === parseInt(id));
    if(index === -1) throw "Couldn't find ID";
    log[index] = entry;
    return log;
}

const addAction = (entry, log) => {
    log.push(entry);
    usedId();
    return log;
}

const saveAction = async (pet, actionId, detail, category, time, id=undefined) => {
    const log = await getLog();
    const entry = {
        p: pet ?? '',
        a: actionId ?? '',
        d: detail ?? '',
        c: category ?? '',
        t: (time ? new Date(time) : new Date()).getTime(),
        id: id ?? await retrieveId()
    }
    await storeLog(id ? editAction(id, entry, log) : addAction(entry, log));
}

const format = async (entry, isTableLog) => {
    const treated = dataTreatment.reduce(
        (agg, [name, treatment]) => agg.replaceAll(`{{${name}}}`, treatment(entry)),
        await retrieve('format' + (isTableLog ? 'Table' : ''))
    );
    return treated.replaceAll("{{id}}", entry.id);
}

const formatLog = async (isTableLog, columns) => {
    const log = await sortLog(columns);
    const beingFormattedLog = log.map(async (entry) => await format(entry, isTableLog));
    const formattedLog = await Promise.all(beingFormattedLog);
    return formattedLog.join("\n");
}

const fillLog = async (isTableLog, columns) => {
    const log = await getLog();
    if(isTableLog) return formatLog(isTableLog, columns);
    return (await retrieve('prefix')) + (await formatLog(isTableLog, columns)) + (await retrieve('suffix'));
}

const sortLog = async (columns) => {
    columns = columns.sort((a, b) => a.order - b.order);
    const log = (await getLog()).sort((a, b) => {
        for (let i = 0; i < columns.length; i++) {
            const name = columns[i].name;
            if(columns[i].signal !== 0) {
                let res = 0;
                if(name === "points") res = getFishingPoints(a.a) - getFishingPoints(b.a);
                else if (isNaN(a[name])) res = a[name].localeCompare(b[name]);
                else res = a[name] - b[name];
                if(res !== 0) return res * columns[i].signal;
            }
        }
        return 0;
    });
    return log;
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
              UI Helpers
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const getOrder = () => {
    return [...document.getElementsByClassName("fishing-log-sort")].map(column => {
        const name = column.id.replace("fishing-log-sort-", "");
        return {
            name: (name === "id" || name === "points") ? name : name[0],
            order: column.dataset.order,
            signal: (column.dataset.order < 0 || column.indeterminate) ? 0 : (column.checked ? -1 : 1)
        }
    });
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            Event Handlers
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const onSortingChange = (e) => {
    if (e.target.readOnly) {
        e.target.checked = false;
        e.target.readOnly = false;
    }
    else if (!e.target.checked) {
        e.target.readOnly = true;
        e.target.indeterminate = true;
    }
    [...document.getElementsByClassName("fishing-log-sort")].filter(el => el.dataset.order !== "-1").sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order)).forEach((el, i) => {
        el.dataset.order = (e.target.indeterminate ? i : i + 1);
    });
    e.target.dataset.order = e.target.indeterminate ? "-1" : "0";
    update();
}

const onTextAreaClick = (e) => {
    const textarea = e.target;
    const value = textarea.value;
    navigator.clipboard.writeText(textarea.value);
    textarea.value = '✔️ Copied';
    setTimeout(() => {textarea.value = value}, 500);
}

const onToggleMode = (e) => {
    const add = e.target.checked;
    [...document.getElementsByClassName("fishing-log-manual-id")].forEach(inputOrLabel => {
        inputOrLabel.disabled = !document.getElementById("fishing-log-manual-id").disabled;
        inputOrLabel.classList.toggle("hidden");
    });
    document.querySelectorAll(".mode-toggle .add, .mode-toggle .edit").forEach(label => label.classList.toggle("active"));
    document.querySelectorAll(".fishing-log-manual legend, .fishing-log-manual button").forEach(txt => {
        txt.textContent = txt.textContent.replace(add ? "Add" : "Edit", add ? "Edit": "Add");
        txt.classList.toggle("is-edit");
    });

}

const onSubmit = async (e) => {
    const inputs = dataTreatment.slice(0, -2).map(([inputName, _]) => document.getElementById(`fishing-log-manual-${inputName}`).value);
    inputs.push((new Date(document.getElementById("fishing-log-manual-time").value)).getTime());
    if(e.target.classList.contains("is-edit")) inputs.push(parseInt(document.getElementById('fishing-log-manual-id').value));
    saveAction(...inputs);
    const buttonText = e.target.textContent;
    e.target.textContent = '✔️ Saved';
    setTimeout(() => {e.target.textContent = buttonText}, 500);
    update();
}

const onIdChange = async (e) => {
    const log = await getLog();
    const entry = log.find(potentialEntry => potentialEntry.id === parseInt(e.target.value));
    if(!entry) e.target.classList.add("invalid");
    else {
        e.target.classList.remove("invalid");
        dataTreatment.slice(0, -2).forEach(([inputName, _]) => {
            document.getElementById(`fishing-log-manual-${inputName}`).value = entry[inputName[0]]
        });
        document.getElementById(`fishing-log-manual-time`).value = (new Date(entry.t)).toISOString().slice(0, 16);
    }
}

const onDelete = async (e) => {
    const log = await getLog();
    const index = log.findIndex(entry => entry.id === parseInt(e.target.dataset.id));
    if (index === -1) return console.error("Couldn't find entry with ID" + e.dataset.id);
    storeLog(log.splice(0, index).concat(log.splice(index + 1)));
    update();
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
            Init / Update
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const update = async () => {
    const order = getOrder();
    document.getElementById("fishing-challenge-log").value = await fillLog(false, order);
    document.querySelectorAll("#fishing-log-table-header ~ tr").forEach(tr => tr.remove());
    document.getElementById("fishing-log-table-header").insertAdjacentHTML("afterEnd", await fillLog(true, order));
    if(activateSep2025Challenge) document.getElementById("fishing-log-points").textContent = await sumPoints();
}

const initFormatting = async (formattingId) => {
    const input = document.getElementById(`fishing-log-${formattingId}`);
    input.value = await retrieve(formattingId);
    input.onchange = async () => {
        await store(formattingId, input.value);
        update();
    }
}

const initEvents = () => {
    document.getElementById("fishing-challenge-log").onclick = onTextAreaClick;
    document.getElementById("fishing-log-mode").onchange = onToggleMode;
    document.getElementById("fishing-log-manual-submit").onclick = onSubmit;
    document.getElementById("fishing-log-manual-id").onchange = onIdChange;
    document.querySelectorAll(".fishing-log-sort").forEach(el => {
        el.onchange = onSortingChange;
        if(el.readOnly) el.indeterminate = true;
    });
    document.querySelectorAll(".fishing-log-log button").forEach(button => {
        button.onclick = onDelete;
    });
}

const createLog = async () => {
    document.head.insertAdjacentHTML("beforeEnd", `<style>${css}</style>`);
    document.getElementsByClassName("button-yellow__2020")[2].parentElement.parentElement.insertAdjacentHTML("beforeEnd", html);
    ['prefix', 'format', 'suffix'].forEach(initFormatting);
    document.getElementById("fishing-log-log").innerHTML = defaultValues.prefixTable + defaultValues.suffix;
    await update();
    initEvents();
}

async function onFishing() {
    const pet = document.getElementsByClassName("profile-dropdown-link")[0].innerText;
    const item = document.querySelector(".item-single__2020 + p b").innerText;
    const itemData = httpGet(`https://itemdb.com.br/api/v1/items/${slugify(item)}`);
    await saveAction(pet, getCategory(itemData), item, itemData.category);
    // et, actionId, detail, category, time, id=undefined
    if(document.querySelector('img[src="https://images.neopets.com/neoboards/avatars/fishsquid.gif"]')) await saveAction(pet, 10, 'Fishing - Titanic Squid', "Got the avatar");
    const levelIncrease = document.querySelector(".item-single__2020 ~ br + p b");
    if (levelIncrease) await saveAction(pet, 11, levelIncrease.innerText, "Leveled up");
}

/*
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
              Constants
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆
*/

const defaultValues = {
    log: "[]",
    prefix: `<table><tbody>\n<tr><th>Time</th><th>Pet</th>${activateSep2025Challenge ? '<th>Action</th>' : ''}<th>Category</th><th>Details</th>${activateSep2025Challenge ? '<th>Points</th>' : ''}</tr>`,
    prefixTable: `<table><tbody>\n<tr id="fishing-log-table-header">
    <th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-id" data-order="0"><label for="fishing-log-sort-id" aria-label="Sort by Id">Id</label></th>
    <th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-time" data-order="-1" readonly><label for="fishing-log-sort-time" aria-label="Sort by Time">Time</label></th>
    <th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-pet" data-order="-1" readonly><label for="fishing-log-sort-pet" aria-label="Sort by Pet">Pet</label></th>
    ${activateSep2025Challenge ? '<th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-action" data-order="-1" readonly><label for="fishing-log-sort-action" aria-label="Sort by Action">Action</label></th>' : ''}
    <th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-category" data-order="-1" readonly><label for="fishing-log-sort-category" aria-label="Sort by Category">Category</label></th>
    <th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-details" data-order="-1" readonly><label for="fishing-log-sort-details" aria-label="Sort by Details">Details</label></th>
    ${activateSep2025Challenge ? '<th><input type="checkbox" class="fishing-log-sort" id="fishing-log-sort-points" data-order="-1" readonly><label for="fishing-log-sort-points" aria-label="Sort by Points">Points</label></th>' : ''}
    <th>Delete?</th>
    </tr>`,
    format: `<tr><td>{{time}}</td><td>{{pet}}</td>${activateSep2025Challenge ? '<td>{{action}}</td>' : ''}<td>{{category}}</td><td>{{details}}</td>${activateSep2025Challenge ? '<td>{{points}}</td>' : ''}</tr>`,
    formatTable: `<tr><td>{{id}}</td><td>{{time}}</td><td>{{pet}}</td>${activateSep2025Challenge ? '<td>{{action}}</td>' : ''}<td>{{category}}</td><td>{{details}}</td>${activateSep2025Challenge ? '<td>{{points}}</td>' : ''}<td><button data-id="{{id}}" type="button">Delete</button></td></tr>`,
    suffix: "\n</tbody></table>"
}

const categoryRules = [
    (d) => d.name.includes("Paint Brush"),
    (d) => d.name.includes("Transmogrification"),
    (d) => (d.rarity > 84 && d.rarity < 101) || (d.rarity > 104 && d.rarity !== 180),
    (d) => d.category.includes("Book"),
    (d) => d.isBD,
    (d) => d.category === "Gardening",
    (d) => d.category.includes("Petpet"),
    (d) => d.category === "Food" && d.name.toLowerCase().includes("fish"),
    (d) => d.category === "Food" && d.name.includes("Squid")
];

const dataTreatment = [
    ["pet", (e) => e.p],
    ["action", (e) => rewordAction(e.a)],
    ["details", (e) => (e.a === 11 ? 'Level ' : '') + e.d],
    ["category", (e) => e.c],
    ["time", (e) => toTimeString(e.t)],
    ["points", (e) => getFishingPoints(e.a)]
];

const fishingPoints = [
    ["Paint Brush", 6],
    ["Transmogrification Potion", 5],
    ["Rare Item", 4],
    ["Book", 3],
    ["Battledome Item", 2],
    ["Gardening Item", 2],
    ["Petpet", 2],
    ["Fish", 1],
    ["Squid", 1],
    ["Misc Item", 1],
    ["Avatar", 5],
    ["Level", 10]
]

const css = `
.fishing-log {
    line-height: 0.75em;
}
.fishing-log summary {
    padding: 1em 1em 0;
}
.fishing-log[open] + .fishing-log-wrapper {
    max-height: 1000px;
    transition: max-height 750ms ease-out;
}
.fishing-log-wrapper {
    box-sizing: border-box;
    max-height: 0;
    overflow: scroll;
    padding: 0 10px;
    border: 2px solid transparent;
    transition: max-height 750ms ease-out;

    ul {
        margin: 0;
        padding: 0;
    }
}
.fishing-log-controls {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.5em;
    margin: 1em 0;

    details, textarea, .fishing-log-wrapper, .points {
        grid-column: span 2;
    }
    textarea {
        height: 5em;
    }
    .caption {
        font-size: 0.8125em;
        text-align: left;
        margin: 0.5em 0 1em;
        flex-grow: 1;
    }
}
.fishing-log-manual {
    .mode-toggle {
        grid-column: span 2;
        margin: auto;
    }
    label.toggle {
        width: 2em;
        display: inline-block;
        border-radius: 50px;
        position: relative;
        transition: all .3s ease;
        transform-origin: 20% center;
        cursor: pointer;
        background: transparent;
        border: 3px solid #000;
        height: 1em;
        vertical-align: middle;
        margin: 0 0.5em;
    }
    label.toggle::before {
        content: "";
        display: block;
        position: absolute;
        width: 0.5em;
        height: 0.5em;
        top: 0.05em;
        left: 0.1em;
        border-radius: 2em;
        border: 3px solid #000;
        background: #000;
        transition: .3s ease;
    }
    input[type="checkbox"]:checked ~ .toggle::before {
        transform: translateX(1em);
    }
    input[type="checkbox"] ~ .edit, input[type="checkbox"] ~ .add {
        color: gray;
    }
    input[type="checkbox"] ~ .active {
        color: black;
    }
    fieldset {
        display: grid;
        grid-template-columns: 7em 1fr;
        gap: 0.5em;
    }
    .hidden {
        opacity: 0;
        transform: scaley(0);
        transition: transform 500ms ease-in-out, opacity 200ms ease-in-out;
    }
    .fishing-log-manual-id:not(.hidden) {
        opacity: 1;
        transform: scaley(100%);
        transition: transform 500ms ease-in-out, opacity 200ms ease-in-out;
    }
    .invalid {
        border: 2px solid red;
    }
}
.fishing-log-log {
    max-height: 300px;
    overflow: auto;

    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }
    td, th {
        border: 1px solid black;
        padding: 0.5em;
    }
    .fishing-log-sort {
        display: none;
    }
    .fishing-log-sort + label {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .fishing-log-sort + label::after {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M14 14H2m8-4H2m4-4H2m16 12H2m17-4V4m0 0l3 3m-3-3l-3 3'/%3E%3C/svg%3E");
    }
    .fishing-log-sort:indeterminate + label::after {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M10 14H2m6-4H2m4-4H2m10 12H2m17 2V4m0 16l3-3m-3 3l-3-3m3-13l3 3m-3-3l-3 3'/%3E%3C/svg%3E");
    }
    .fishing-log-sort:checked + label::after {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M14 10H2m8 4H2m4 4H2M18 6H2m17 4v10m0 0l3-3m-3 3l-3-3'/%3E%3C/svg%3E");
    }
}`;

const html = `
<details class="fishing-log">
    <summary>Fishing Log</summary>
</details>
<div class="fishing-log-wrapper">
    <div class="fishing-log-log" id="fishing-log-log"></div>
    <details class="fishing-log">
        <summary>Export</summary>
    </details>
    <div class="fishing-log-controls fishing-log-wrapper">
        ${activateSep2025Challenge ? '<p class="points">Your total points: <span id="fishing-log-points"></span></p>' : ''}
        <label for="fishing-log-prefix">Prefix</label>
        <input type="text" id="fishing-log-prefix">
        <label for="fishing-log-format">Formatting</label>
        <input type="text" id="fishing-log-format">
        <label for="fishing-log-suffix">Suffix</label>
        <input type="text" id="fishing-log-suffix">
        <details class="fishing-log">
            <summary>Each log entry will follow the format you specify. Expand for replacement options.</summary>
        </details>
        <div class="fishing-log-wrapper">
            <ul>
                <li><dfn>{{pet}}</dfn> - The name of the pet who was fishing when something happened</li>
                ${activateSep2025Challenge ? '<li><dfn>{{action}}</dfn> - The challenge action that was performed</li>' : ''}
                <li><dfn>{{category}}</dfn> - The category of the fished item, "Leveled up", or "Got the avatar"</li>
                <li><dfn>{{details}}</dfn> - The name of the item being fished, or the level your neopet is now</li>
                <li><dfn>{{time}}</dfn> - When the action happened</li>
                <li><dfn>{{id}}</dfn> - The id of the action, only useful for editing</li>
        </div>
        <textarea id="fishing-challenge-log"></textarea>
    </div>
    <details class="fishing-log">
        <summary>Add/Edit</summary>
    </details>
    <form class="fishing-log-manual fishing-log-wrapper">
        <fieldset id="fishing-log-add-entry">
            <legend>Add Manual Entry</legend>
            <div class="mode-toggle">
                <input type="checkbox" id="fishing-log-mode" class="hidden">
                <label for="fishing-log-mode" class="add active">Add Mode</label><label for="fishing-log-mode" class="toggle"></label><label for="fishing-log-mode" class="edit">Edit Mode</label>
            </div>
            <label for="fishing-log-manual-id" class="hidden fishing-log-manual-id">ID</label>
            <input type="number" id="fishing-log-manual-id" class="fishing-log-manual-id hidden" disabled>
            <label for="fishing-log-manual-time">Time</label>
            <input type="datetime-local" id="fishing-log-manual-time">
            <label for="fishing-log-manual-pet">Pet</label>
            <input type="text" id="fishing-log-manual-pet">
            ${activateSep2025Challenge ? '<label for="fishing-log-manual-action">Action</label>' : ''}
            ${activateSep2025Challenge ? '<select id="fishing-log-manual-action"><option value="' + fishingPoints.map(([actionName, _], i) => i + '">' + actionName).join('</option>\n<option value="') + '</option></select>' : ''}
            <label for="fishing-log-manual-category">Category</label>
            <input type="text" id="fishing-log-manual-category">
            <label for="fishing-log-manual-details">Details</label>
            <input type="text" id="fishing-log-manual-details">
            <button id="fishing-log-manual-submit" type="button">Add Entry</button>
        </fieldset>
    </form>
</div>`;

(async function() {
    'use strict';
    await attemptPurge();
    if(document.getElementsByClassName("item-single__2020").length > 0) onFishing();
    createLog();
})();
