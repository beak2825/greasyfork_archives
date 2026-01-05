// ==UserScript==
// @name        Milovana: Data Extractor
// @namespace   wompi72
// @author      wompi72
// @version     1.0
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
                const simplifiedData = new TeaseSimplifier().parseData(jsonData);
                console.log(simplifiedData);
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

        async scrapeTease(teaseId) {
            const url = this.getJsonSourceUrl(teaseId);
            const res = await fetch(url);
            if (!res.ok) {
                console.error(res);
                return
            }
            return this.parseData(await res.json(), teaseId);
        }

        parseData(data, teaseId) {
            const parsed = {
                pages: 0,
                words: 0,
                scriptWords: 0,
                meaningfulChoices: 0,
                storage: false,
            }
            for (const page of Object.values(data.pages)) {
                parsed.pages += 1;
                this._parseData(page, parsed);
            }
            this._parseScript(data.init || "", parsed)
            this.save_data(parsed, teaseId)
            return parsed;
        }

        _parseData(inData, parsed) {
            if (Array.isArray(inData)) {
                for (const item of inData) {
                    this._parseData(item, parsed);
                }
                return;
            }
            if (typeof inData !== "object") return;

            if (Object.hasOwn(inData, "say")) {
                // count words of inData.say.label after removing html elements
                parsed.words += inData.say.label.split(" ").length;
            } else if (Object.hasOwn(inData, "choice")) {
                this._parseBranches(inData.choice.options, parsed);
            } else if (Object.hasOwn(inData, "if")) {
                const ifData = [{
                    commands: inData.if.commands,
                }]
                if (Object.hasOwn(inData.if, "elseCommands")) {
                    ifData.push({
                        commands: inData.if.elseCommands,
                    })
                }
                this._parseBranches(ifData, parsed, false, inData.if.condition == "true");
            } else if (Object.hasOwn(inData, "eval")) {
                this._parseScript(inData.eval.script, parsed);
            }
        }

        _parseBranches(choices, parsed, checkAtLeastTwo=true, isNotMeaningful=false) {
            let meaningfulChoicesFound = false;
            for (const choice of choices) {
                this._parseData(choice.commands, parsed);
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

        _parseScript(script, parsed) {
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
            if (teaseTypeImg==null || !teaseTypeImg.classList.contains("eosticon")) return;

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
            this._createButton("Show", ["parse-data-button", "tease_data_button"], buttonContainerEl, async () => {
                buttonContainerEl.querySelector(".parse-data-button").disabled = true;
                const data = await scraper.scrapeTease(teaseId);
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
        return value === null || value === undefined;
    }

    class TeaseSimplifier {
        constructor() {
            this.htmlPattern = /<\/?(strong|span|p|em)(?:\s+[^>]*)?>/gi;
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

            return this.parseElement(sortedPageData);
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
                let cleaned = text.replace(this.htmlPattern, '');
                return cleaned.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
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
                let key = `> Timer ${timerData.duration}`;
                if (timerData.style) key += ` (${timerData.style})`;
                if (timerData.isAsync) key += " (async)";

                const commands = this.parseElement(timerData.commands || []);
                if (isEmpty(commands)) {
                    return key;
                }
                return { [key]: commands };
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
                const out = {};
                const options = inData.choice.options || [];

                options.forEach(option => {
                    out[`Choice: ${option.label}`] = this.parseElement(option.commands);
                });

                const values = Object.values(out);
                const labels = options.map(o => o.label).join(', ');

                if (values.every(v => isEmpty(v))) {
                    return `> Choice: ${labels}`;
                }

                if (values.length > 1 && values.every(v => JSON.stringify(v) === JSON.stringify(values[0]))) {
                    return { [`Choice: ${labels}`]: values[0] };
                }

                return out;
            }

            if ("audio.play" in inData) {
                const suffix = "loops" in inData["audio.play"] && inData["audio.play"].loops > 0 ? ` (${inData["audio.play"].loops} loops)` : "";

                return `> Audio: ${inData["audio.play"].locator}${suffix}`;
            }

            const outData = {};
            for (const [key, value] of Object.entries(inData)) {
                outData[key] = this.parseElement(value);
            }
            return outData;
        }

        parseList(inData) {
            const out = [];
            for (const element of inData) {
                const parsed = this.parseElement(element);
                if (parsed === "Image") continue;
                out.push(parsed);
            }
            return out;
        }

        preParseInitScripts(script) {
            if (isEmpty(script)) return [];
            const normalized = script.replace(this.scriptNewlinePattern, "\n");
            return normalized.split("\n").filter(line => line.trim() !== "");
        }
    }

    if (window.location.href.includes("webteases/") && !window.location.href.includes("showtease")) {
        new DisplayData().display()

        const observer = new MutationObserver(() => new DisplayData().display());
        observer.observe(document.querySelector("#tease_list"), { childList: true, subtree: false });
    }

    function sidebar_integration() {
        if (!window.pageData || window.pageData.type !== TEASE_TYPES.eos) return;
        const section = window.sidebar.addSection("tease_data","Tease Data");
        const cached_data = scraper.get_data(window.pageData.id);

        const dataDisplay = window.sidebar.addText("Click on Show to display tease data", section)

        function _displayData(data) {
            const text = displayJsonData(data);
            dataDisplay.innerHTML = text.split(", ").join("<br>");
        }

        if (cached_data) {
            _displayData(cached_data)
        }

        const showButton = window.sidebar.addButton(cached_data ? "Refresh Data" : "Show", async () => {
            const new_data = await scraper.scrapeTease(window.pageData.id);
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

    setTimeout(sidebar_integration, 500);
})();
