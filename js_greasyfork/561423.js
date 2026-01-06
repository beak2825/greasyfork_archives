// ==UserScript==
// @name        Milovana: Data Extractor
// @namespace   wompi72
// @author      wompi72
// @version     1.0.3
// @description Extract data from teases
// @match       https://milovana.com/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561423/Milovana%3A%20Data%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/561423/Milovana%3A%20Data%20Extractor.meta.js
// ==/UserScript==

function displayJsonData(data) {
    function formatValue(v) {
        if (typeof v !== "number" || Math.abs(v) < 1000) {
            return v;
        }

        const thousands = Math.floor(Math.log10(Math.abs(v)) / 3);
        const base = Math.floor(v / 1000 ** thousands);

        return `${base}${"k".repeat(thousands)}`;
    }

    const displayData = Object.entries(data)
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join(", ");
    return displayData;
}

(function() {
    'use strict';

    class DataScraper {
        cached_data = {}

        init() {
            this.cached_data = JSON.parse(localStorage.getItem("TeaseDataData") || "{}")
        }
        downloadJson(teaseId, teaseTitle) {
            const jsonSourceUrl = this.getJsonSourceUrl(teaseId)
            fetch(jsonSourceUrl).then(res => res.blob()).then(blob => {
                const fileName = teaseTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                const fullFileName = `${fileName}.json`;
                this._download(blob, fullFileName);
            });
        }
        downloadSimplifiedJson(teaseId, teaseTitle) {
            const jsonSourceUrl = this.getJsonSourceUrl(teaseId)
            fetch(jsonSourceUrl).then(res => res.json()).then(jsonData => {
                let parserClass;
                if ("galleries" in jsonData) {
                    parserClass = new EOSTeaseSimplifier()
                } else {
                    parserClass = new FlashTeaseSimplifier()
                }
                const simplifiedData = parserClass.parseData(jsonData);

                const fileName = teaseTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                const fullFileName = `${fileName}_simplified.json`;
                const jsonString = JSON.stringify(simplifiedData, null, 4);
                const blob = new Blob([jsonString], { type: 'application/json' });
                this._download(blob, fullFileName);
            });
        }

        save_data(data, teaseId) {
            this.cached_data[teaseId] = data
            localStorage.setItem("TeaseDataData", JSON.stringify(this.cached_data))
        }
        get_data(teaseId) {
            return this.cached_data[teaseId] || null
        }

        async getTeaseSummary(teaseId) {
            const url = this.getJsonSourceUrl(teaseId);
            const res = await fetch(url);
            if (!res.ok) {
                console.error(res);
                return
            }
            let data = await res.json();
            let summary;
            if ("galleries" in data) {
                summary = new EOSTeaseSimplifier().summarizeData(data);
            } else {
                summary = new FlashTeaseSimplifier().summarizeData(data);
            }

            this.save_data(summary, teaseId)
            return summary;
        }

        getJsonSourceUrl(teaseId) {
            return `https://milovana.com/webteases/geteosscript.php?id=${teaseId}`;
        }

        _download(jsonData, fileName) {
            const url = window.URL.createObjectURL(jsonData);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    const scraper = new DataScraper();
    scraper.init()

    const TEASE_TYPES = {
        EOS: "EOS",
        FLASH: "FLASH",
    }

    class DisplayData {
        display() {
            this.addCSS()
            document.querySelectorAll(".tease").forEach(teaseEl => {
                try {
                    this.addDisplay(teaseEl)
                } catch (error) {
                    console.error(`Error processing tease element: ${error.message}`);
                }
            })
        }

        addDisplay(teaseEl) {
            const bubbleEl = teaseEl.querySelector(".bubble");
            const titleEl = bubbleEl.querySelector("h1 a");
            const teaseId = titleEl.href.match(/id=(\d+)/)[1];
            const teaseTitle = titleEl.textContent;
            const teaseTypeImg = titleEl.querySelector("img");
            if (teaseTypeImg==null) return;

            let teaseType;
            if (teaseTypeImg.classList.contains("eosticon")) {
                teaseType = TEASE_TYPES.EOS
            } else if (teaseTypeImg.classList.contains("flashticon")) {
                teaseType = TEASE_TYPES.FLASH
            } else {
                return;
            }

            const parentContainerEl= this._createDiv(["flex-row", "data-buttons-container"], bubbleEl);
            const dataContainerEl = this._createDiv(["data-display"], parentContainerEl);
            const buttonContainerEl = this._createDiv(["data-display"], parentContainerEl);
            if (scraper.get_data(teaseId) != null) {
                this._displayData(scraper.get_data(teaseId), dataContainerEl)
            }

            this._createButton("Json", ["data-button", "tease_data_button"], buttonContainerEl, () => {
                scraper.downloadJson(teaseId, teaseTitle)
            });
            this._createButton("Simple", ["data-button", "tease_data_button"], buttonContainerEl, () => {
                scraper.downloadSimplifiedJson(teaseId, teaseTitle)
            });
            this._createButton("Summary", ["parse-data-button", "tease_data_button"], buttonContainerEl, async () => {
                buttonContainerEl.querySelector(".parse-data-button").disabled = true;
                const data = await scraper.getTeaseSummary(teaseId);
                this._displayData(data, dataContainerEl);
            });
        }

        _createDiv(classes, parent) {
            const div = document.createElement("div");
            div.classList.add(...classes);
            parent.appendChild(div);
            return div;
        }
        _createButton(text, classes, parent, onClick) {
            const button = document.createElement("button");
            button.textContent = text;
            button.addEventListener("click", onClick);
            button.classList.add(...classes);
            parent.appendChild(button);
            return button;
        }

        addCSS() {
            const style = document.createElement('style');
            style.textContent = `
.tease .bubble {
    height: unset !important;
    min-height: 100px;
}
.tease .bubble .desc {
    min-height: 60px;
}
.tease .info .tags {
    margin-left: 155px;
}
.flex-row {
    display: flex;
}
.data-buttons-container {
    justify-content: space-between;
    height: 1.0rem;
    font-size: 0.5rem;
}
.tease_data_button  {
    background-color: #a36666;
    color: #ffffff;
    border: none;
    border-radius: 2px;
    padding: 2px 4px;
    cursor: pointer;
    transition: opacity 0.2s;
    margin: 0 2px;
}
#mv-sidebar button:hover {
    opacity: 0.9;
}
#mv-sidebar button:active {
    transform: translateY(1px);
}
.data-display {
    margin: auto 0;
}
    `
            document.head.appendChild(style);
        }

        _displayData(data, dataContainerEl) {
            dataContainerEl.innerText = displayJsonData(data);
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value) && value.length === 0) return true;
        return value === null || value === undefined || value == "";
    }

    class EOSTeaseSimplifier {
        constructor() {
            this.htmlPattern = /<\/?(strong|span|p|em|b|i)(?:\s+[^>]*)?>/gi;
            this.scriptNewlinePattern = /(\\r)*(\\n)+/g;
        }

        parseData(rawData) {
            const pageData = { ...rawData.pages };

            let initScript = this.preParseInitScripts(rawData.init || "");
            if (!isEmpty(initScript)) {
                pageData["__init_scripts"] = initScript;
            }

            const sortedEntries = Object.entries(pageData).sort((a, b) => {
                const naturalSort = (str) => str.replace(/\d+/g, (m) => m.padStart(10, '0'));
                return naturalSort(a[0]).localeCompare(naturalSort(b[0]));
            });

            const sortedPageData = Object.fromEntries(sortedEntries);

            return this.parsePages(sortedPageData);
        }

        parsePages(pages) {
            return this.parseElement(pages)
        }

        parseElement(inData) {
            if (Array.isArray(inData)) {
                return this.parseList(inData);
            } else if (inData !== null && typeof inData === 'object') {
                return this.parseDict(inData);
            } else {
                return inData;
            }
        }

        parseDict(inData) {
            if ("say" in inData) {
                let text = inData.say.label || "";
                return this.parseText(text);
            }

            if ("eval" in inData) {
                return `> SCRIPT:${inData.eval.script}`;
            }

            if ("image" in inData) {
                return "Image";
            }

            if ("goto" in inData) {
                return `> GOTO:${inData.goto.target}`;
            }

            if ("timer" in inData) {
                const timerData = inData.timer;

                return this.parseTimer(timerData);
            }

            if ("if" in inData) {
                const ifData = inData.if;
                if (ifData.condition === "true" && isEmpty(ifData.elseCommands)) {
                    return this.parseElement(ifData.commands);
                }
                const out = {
                    [`If (${ifData.condition})`]: this.parseElement(ifData.commands)
                };
                if (ifData.elseCommands) {
                    out["else"] = this.parseElement(ifData.elseCommands);
                }
                return out;
            }

            if ("choice" in inData) {
                const options = inData.choice.options || [];
                return this.parseChoices(options);
            }

            if ("audio.play" in inData) {
                const suffix = "loops" in inData["audio.play"] && inData["audio.play"].loops > 0 ? ` (${inData["audio.play"].loops} loops)` : "";

                return `> Audio: ${inData["audio.play"].locator}${suffix}`;
            }
            if ("prompt" in inData) {
                return `> Prompt: ${inData.prompt.variable}`
            }

            const outData = {};
            for (const [key, value] of Object.entries(inData)) {
                outData[key] = this.parseElement(value);
            }
            return outData;
        }

        parseTimer(timerData) {
            let key = `> Timer ${timerData.duration}`;
            if (timerData.style) key += ` (${timerData.style})`;
            if (timerData.isAsync) key += " (async)";

            const commands = this.parseElement(timerData.commands || []);
            if (isEmpty(commands)) {
                return key;
            }
            if (commands.length === 1) {
                return `${key} -${commands[0]}`;
            }
            return {[key]: commands};
        }

        parseText(text) {
            let cleaned = text.replace(this.htmlPattern, '');
            return cleaned.replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&quot;/g, "'");
        }

        parseList(inData) {
            const out = [];
            for (const element of inData) {
                const parsed = this.parseElement(element);
                if (parsed === "Image" || isEmpty(parsed)) continue;
                out.push(parsed);
            }
            return out;
        }

        parseChoices(options) {
            const out = {};
            options.forEach(option => {
                out[`Choice: ${option.label}`] = this.parseElement(option.commands);
            });

            const values = Object.values(out);
            const labels = options.map(o => o.label).join(', ');

            if (values.length === 0 || values.every(v => isEmpty(v))) {
                return `> Choice: ${labels}`;
            }
            if (values.length === 1 && values[0].length === 1) {
                return `> Choice: ${labels} -${values[0]}`;
            }
            if (values.every(v => JSON.stringify(v) === JSON.stringify(values[0]))) {
                return {[`Choice: ${labels}`]: values[0]};
            }
            if (values.every(v => v.length === 1)) {
                const outList = []
                for (const [key, value] of Object.entries(out)) {
                    outList.push(`> ${key} -${value[0]}`);
                }
                return outList;
            }

            return out;
        }

        preParseInitScripts(script) {
            if (isEmpty(script)) return [];
            const normalized = script.replace(this.scriptNewlinePattern, "\n");
            return normalized.split("\n").filter(line => line.trim() !== "");
        }

        summarizeData(data) {
            const parsed = {
                pages: 0,
                words: 0,
                scriptWords: 0,
                meaningfulChoices: 0,
                storage: false,
            }
            for (const page of Object.values(data.pages)) {
                parsed.pages += 1;
                this._summarizePage(page, parsed);
            }
            this._summarizeScript(data.init || "", parsed)
            return parsed;
        }

        _summarizePage(page, parsed) {
            return this._summarizeData(page, parsed);
        }

        _summarizeData(inData, parsed) {
            if (Array.isArray(inData)) {
                for (const item of inData) {
                    this._summarizeData(item, parsed);
                }
                return;
            }
            if (typeof inData !== "object") return;
            this._summarizeDict(inData, parsed);
        }


        _summarizeDict(inData, parsed) {
            if (Object.hasOwn(inData, "say")) {
                parsed.words += inData.say.label.split(" ").length;
            } else if (Object.hasOwn(inData, "choice")) {
                this._summarizeBranches(inData.choice.options, parsed);
            } else if (Object.hasOwn(inData, "if")) {
                const ifData = [{
                    commands: inData.if.commands,
                }]
                if (Object.hasOwn(inData.if, "elseCommands")) {
                    ifData.push({
                        commands: inData.if.elseCommands,
                    })
                }
                this._summarizeBranches(ifData, parsed, false, inData.if.condition == "true");
            } else if (Object.hasOwn(inData, "eval")) {
                this._summarizeScript(inData.eval.script, parsed);
            }
        }
        _summarizeBranches(choices, parsed, checkAtLeastTwo=true, isNotMeaningful=false) {
            let meaningfulChoicesFound = false;
            for (const choice of choices) {
                this._summarizeData(choice.commands, parsed);
                if (!isNotMeaningful && meaningfulChoicesFound || (checkAtLeastTwo && choices.length < 2)) continue;
                if (this._hasRelevantChoice(choice.commands)) {
                    meaningfulChoicesFound = true;
                }
            }

            if (!isNotMeaningful && meaningfulChoicesFound) {
                parsed.meaningfulChoices += 1;
            }
        }

        _hasRelevantChoice(choiceResults) {
            for (const command of choiceResults) {
                if (Object.hasOwn(command, "goto") || Object.hasOwn(command, "eval")){
                    return  true;
                }
            }
            return false
        }

        _summarizeScript(script, parsed) {
            if (script.includes("teaseStorage")) {
                parsed.storage = true;
            }
            script = script.replace(/\r\n?|\n/g, "\n");

            // Remove comments while preserving string literals
            script = script.replace(
                /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\/\/.*|\/\*[\s\S]*?\*\//g,
                (match, stringLiteral) => (stringLiteral ? stringLiteral : "")
            );

            // Count words (alphanumeric + underscore)
            const words = script.match(/\b[A-Za-z0-9_]+\b/g);
            parsed.scriptWords += words ? words.length : 0;
        }

    }

    class FlashTeaseSimplifier extends EOSTeaseSimplifier {
        parsePages(pages) {
            const out = {};
            for (const [key, value] of Object.entries(pages)) {
                if (value.length > 1) {
                    out[key] = this.parseElement(value);
                } else {
                    out[key] = this.parseElement(value[0]);
                }
            }
            return out;
        }

        parseDict(inData) {
            if (isEmpty(inData)) {return null}

            if ("nyx.page" in inData) {
                const pageData = inData["nyx.page"];
                let parsePage = [this.parseText(pageData.text)];
                if ("action" in pageData) {
                    parsePage.push(
                        this.parseElement(pageData.action)
                    )
                }
                return parsePage;
            }

            if ("nyx.buttons" in inData) {
                const options = inData["nyx.buttons"] || [];
                return this.parseChoices(options);
            }

            if ("nyx.vert" in inData) {
                return this.parseElement(inData["nyx.vert"].elements);
            }

            if ("goto" in inData) {
                return `> GOTO:${inData.goto.target}`;
            }

            if ("nyx.timer" in inData) {
                const timerData = inData["nyx.timer"];

                return this.parseTimer(timerData);
            }

            const outData = {};
            for (const [key, value] of Object.entries(inData)) {
                outData[key] = this.parseElement(value);
            }
            return outData;
        }

        _summarizePage(page, parsed) {
            if (page.length > 1) {
                return this._summarizeData(page, parsed);
            } else {
                return this._summarizeData(page[0], parsed);
            }
        }

        _summarizeDict(inData, parsed) {
            if ("nyx.page" in inData) {
                const pageData = inData["nyx.page"];

                parsed.words += pageData.text.split(" ").length;
                if ("action" in pageData) {
                    this._summarizeDict(pageData.action, parsed);
                }
                return;
            }

            if ("nyx.buttons" in inData) {
                const options = this._summaryButtonOptions(inData["nyx.buttons"]);
                this._summarizeOptions(options, parsed);
            }
            if ("nyx.vert" in inData) {
                const options = []
                for (const element of inData["nyx.vert"].elements) {
                    if ("nyx.buttons" in element) {
                        options.push(...this._summaryButtonOptions(element["nyx.buttons"]));
                    }
                    if ("nyx.timer" in element) {
                        options.push(element["nyx.timer"].commands[0].goto.target)
                    }
                }
                this._summarizeOptions(options, parsed);
            }
        }

        _summaryButtonOptions(buttonOptions) {
            const options = []
            for (const option of buttonOptions) {
                options.push(option.commands[0].goto.target);
            }
            return options;
        }

        _summarizeOptions(options, parsed) {
            if (options.length <= 1) {
                return;
            }
            if (options.every(v => JSON.stringify(v) === JSON.stringify(options[0]))) {
                return;
            }
            parsed.meaningfulChoices += 1;
        }
    }

    if (window.location.href.includes("webteases/") && !window.location.href.includes("showtease")) {
        new DisplayData().display()

        const observer = new MutationObserver(() => new DisplayData().display());
        observer.observe(document.querySelector("#tease_list"), { childList: true, subtree: false });
    }

    function sidebar_integration() {
        if (!window.sidebar ||  !window.location.href.includes("showtease")) return;
        const section = window.sidebar.addSection("tease_data","Tease Data");
        const cached_data = scraper.get_data(window.pageData.id);

        const dataDisplay = window.sidebar.addText("Click on Summary to display tease data", section, ["width-100"])

        function _displayData(data) {
            const text = displayJsonData(data);
            dataDisplay.innerHTML = text.split(", ").join("<br>");
        }

        if (cached_data) {
            _displayData(cached_data)
        }

        const showButton = window.sidebar.addButton(cached_data ? "Refresh Summary" : "Summary", async () => {
            const new_data = await scraper.getTeaseSummary(window.pageData.id);
            _displayData(new_data);

            showButton.disabled = true;
        }, section)
        window.sidebar.addButton("Download Json", () => {
            scraper.downloadJson(window.pageData.id, window.pageData.title);
        }, section)
        window.sidebar.addButton("Download Simplified", () => {
            scraper.downloadSimplifiedJson(window.pageData.id, window.pageData.title);
        }, section)
    }

    setTimeout(sidebar_integration, 1000);
})();
