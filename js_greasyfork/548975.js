// ==UserScript==
// @name         Tetrio fumen
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Fumen Compatibility with tetrio
// @author       mkjl
// @match        https://tetr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tetr.io
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/548975/Tetrio%20fumen.user.js
// @updateURL https://update.greasyfork.org/scripts/548975/Tetrio%20fumen.meta.js
// ==/UserScript==

// --- SETTINGS --- //
let imageMode = (localStorage.getItem("fumen-imageMode") == 'true');
const delay = 1000; // delay between swapping pages
const colors = {
    T: { text: "#b94bc6", normal: "#9739a2", highlight: "#d958e9", skim: "#b94bc6" },
    I: { text: "#5cc7f9", normal: "#42afe1", highlight: "#6ceaff", skim: "#5cc7f9" },
    J: { text: "#2c84da", normal: "#1165b5", highlight: "#339bff", skim: "#2c84da" },
    L: { text: "#f99e4c", normal: "#f38927", highlight: "#ffba59", skim: "#f99e4c" },
    O: { text: "#f9df6c", normal: "#f6d03c", highlight: "#ffff7f", skim: "#f9df6c" },
    S: { text: "#70d36d", normal: "#51b84d", highlight: "#84f880", skim: "#70d36d" },
    Z: { text: "#f96c67", normal: "#eb4f65", highlight: "#ff7f79", skim: "#f96c67" },
    X: { normal: "#868686", highlight: "#dddddd", skim: "#bdbdbd" },
};
// ---------------- //

const cellSize = 22;
const numcols = 10;
//importing dependencies
let decoder;
let workerScript;

(async function () {
    // tetris-fumen decoder
    const tetrisFumen = await import(
        "https://cdn.jsdelivr.net/npm/tetris-fumen/+esm"
    );
    decoder = tetrisFumen.decoder;

    // gif.js
    await import("https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.min.js");

    // gif.js worker
    const response = await fetch(
        "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
        { redirect: "follow" }
    );
    const blob = await response.blob();
    workerScript = URL.createObjectURL(blob);




    const roomChatInput = document.querySelector("#chat_input");
    const ingameChatInput = document.querySelector("#ingame_chat_input");

    function captureInputOnEnter(input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const message = input.value;
                if (message.startsWith(`/fumen image`)){
                    setImageMode(true);
                }else if(message.startsWith(`/fumen text`)){
                    setImageMode(false);
                }
            }
        });
    }

    captureInputOnEnter(roomChatInput);
    captureInputOnEnter(ingameChatInput);
})();

let intervals = [];

window.addEventListener("load", async function () {
    // colored text
    const style = document.createElement("style");
    style.textContent = Object.keys(colors)
        .map(
            (tetrimino) =>
                `.chat_message.fumen .${tetrimino} {color: ${colors[tetrimino].text ?? colors[tetrimino].normal};}`
        )
        .join("\n");
    document.head.appendChild(style);

    const roomChat = document.querySelector("#room_chat");
    const ingameChat = document.querySelector("#ingame_chat");

    const chatObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const chat = mutation.target;
            for (const node of mutation.addedNodes) {
                if(node.children[1].innerHTML == "Unknown command /fumen"){
                    node.children[0].innerHTML = `[FUMEN]`
                    node.children[1].innerHTML = `Set to ${imageMode ? "image mode" : "text mode"}`
                }
                processMessage(chat, node);
            }
        }
    });

    chatObserver.observe(roomChat, { childList: true });
    chatObserver.observe(ingameChat, { childList: true });

});

async function processMessage(chat, node) {
    if (!node.classList?.contains("chat_message")) return;
    let content = node.classList.contains("fumen")?node.getAttribute("fumen"):node.children[1].innerHTML;

    if(!content.startsWith("v115@"))return;

    let pages;
    try {
        pages = decoder.decode(content);
    } catch (e) {
        //invalid fumen code
        console.warn("Invalid fumen code:", content);
        node.classList.add("pingchat");
        return;
    }

    node.classList.add("fumen");
    node.setAttribute("fumen", content);

    if (imageMode) {
        const image = document.createElement("img");
        image.src = await getDataURL(pages);
        image.style.border = "1px solid #b7b7b7";
        node.children[1].innerHTML = "";
        node.children[1].append(image);
        image.onload = () => {
            chat.scrollTop = chat.scrollHeight;
        };
    } else {
        var current = 0;

        function renderPage(node, page) {
            const numRows = Math.max(...pages.map(getRows));
            node.children[1].innerHTML = `+----------+\n${(
                "__________\n".repeat(numRows) +
                pages[page].field.str(true, "\n", false)
            )
                .replaceAll(/_/g, " ")
                .replaceAll(/([TIJLOSZX])/g, `<span class="$1">$1</span>`)
                .split("\n")
                .slice(-numRows - 1, -1)
                .map((e) => "|" + e + "|")
                .join("\n")}\n+----------+`;

            chat.scrollTop = chat.scrollHeight; // thanks monkeyboy
        }
        renderPage(node, current);

        if (pages.length == 1) return;
        intervals.push(setInterval(() => {
            current = (current + 1) % pages.length;
            renderPage(node, current);
        }, delay));
    }
}

function setImageMode(mode) {
    imageMode = mode
    localStorage.setItem("fumen-imageMode", imageMode)

    for(const interval of intervals){
        clearInterval(interval);
        intervals = [];
    }

    document.querySelectorAll(`.chat_message.fumen`).forEach(node => {
        processMessage(node.parentElement, node);
    })
}

// --- IMAGE PROCESSING --- //
async function getDataURL(pages) {
    if (pages.length === 1) {
        const canvas = draw(pages[0], getRows(pages[0]));
        return canvas.toDataURL("image/png");
    }
    if (pages.length > 1) {
        try {
            const gifUrl = await drawFumens(pages, 0);
            return gifUrl;
        } catch (err) {
            throw new Error();
        }
    }
    return null;
}

function getRows(page) {
    let numrows = 0;
    const field = page.field;
    for (let i = 0; i < numcols; i++) {
        for (let j = 0; j < 23; j++) {
            if (field.at(i, j) != "_") {
                numrows = Math.max(numrows, j);
            }
        }
    }
    return numrows + 1;
}

function draw(page, numrows) {
    const upHeight = cellSize / 5;
    var field = page.field;

    const width = cellSize * numcols;
    const height = (numrows + 0.2) * cellSize;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numcols; i++) {
        for (let j = 0; j < numrows; j++) {
            if (field.at(i, j) != "_") {
                // all blocks
                let rowClear = page.flags.lock;
                for (let n = j * 10; n < j * 10 + 10; n++) {
                    if (page._field.field.pieces[n] == 0) {
                        rowClear = false;
                        break;
                    }
                }

                context.fillStyle =
                    colors[field.at(i, j)][rowClear ? "skim" : "normal"];

                context.fillRect(
                    i * cellSize,
                    height - (j + 1) * cellSize - 1,
                    cellSize,
                    cellSize + 1
                );
                if (field.at(i, j + 1) == "_" || j == numrows - 1) {
                    // all highlights
                    context.fillStyle = colors[field.at(i, j)].highlight;
                    context.fillRect(
                        i * cellSize,
                        height - upHeight - (j + 1) * cellSize,
                        cellSize,
                        upHeight
                    );
                }
            }
        }
    }
    return canvas;
}

async function drawFumens(pages, start = 0, end = pages.length) {
    return new Promise((resolve) => {
        let numrows = Math.max(...pages.map(getRows)) + 1;

        const width = cellSize * numcols;
        const height = (numrows + 0.2) * cellSize;

        const gif = new GIF({
            workers: 2,
            workerScript,
            quality: 10,
            width,
            height,
            transparent: 0x000000,
        });

        for (let i = start; i < end; i++) {
            const canvas = draw(pages[i], numrows);
            const ctx = canvas.getContext("2d");
            gif.addFrame(ctx, { delay });
        }

        gif.on("finished", function (blob) {
            resolve(URL.createObjectURL(blob));
        });
        gif.render();
    });
}
