// ==UserScript==
// @name            Pixeldrain DL Bypass
// @namespace       https://greasyfork.org/users/821661
// @version         1.5.8
// @description     Adds direct-download buttons and links for Pixeldrain files using an alternate proxy — inspired by 'Pixeldrain Download Bypass' by hhoneeyy and MegaLime0
// @author          hdyzen
// @match           https://pixeldrain.com/*
// @match           https://pixeldrain.net/*
// @match           https://pixeldrain.dev/*
// @match           https://pixeldra.in/*
// @run-at          document-start
// @icon            https://www.google.com/s2/favicons?domain=pixeldrain.com/&sz=64
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/551561/Pixeldrain%20DL%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/551561/Pixeldrain%20DL%20Bypass.meta.js
// ==/UserScript==

const CONFIG = {
    defaultBypassURL: "pd-pass.hdyzen.xyz",
    customBypassURL: GM_getValue("custom_proxy", ""),
    jDownloaderURL: "http://127.0.0.1:9666/flash/addcnl",

    COMMANDS: {
        directDownload: {
            label: "Direct download",
            state: false,
        },
        bypassVideoLogged: {
            label: "Bypass video logged restriction",
            state: true,
            effect: modAllowPlayer,
        },
        scrollbarNames: {
            label: "Horizontal scrollbar for long names",
            state: false,
            effect: () => GM_addStyle(".container-names { overflow: scroll; } .file-name { overflow: initial }"),
        },
    },

    ON_ELEMENTS: {},
};

const selectedProxy = CONFIG.customBypassURL || CONFIG.defaultBypassURL;

function createButton(iconName, title, text) {
    const template = document.createElement("template");
    template.innerHTML = `
        <button class="toolbar_button svelte-jngqwx" title="${title}">
            <i class="icon">${iconName}</i>
            <span class="svelte-jngqwx">${text}</span>
        </button>
    `;

    return template.content.firstElementChild;
}

function showModal(title, content, extraContent = "") {
    const MODAL_HTML = `
        <div class="background svelte-1f8gt9n" style="z-index: 10001;" role="dialog">
            <div class="window svelte-1f8gt9n" role="dialog" aria-modal="true" style="max-height: 80%; max-width: 80%; ">
                <div class="header svelte-1f8gt9n">
                    <span class="title svelte-1f8gt9n" style="padding-inline: calc(2rem + 32px) 2rem;">${title}</span>
                    <button class="button svelte-1ef47mx round close-button">
                        <i class="icon">close</i>
                    </button>
                </div>
                <div class="body svelte-1f8gt9n" style="padding: 1rem;">
                    <div class="container svelte-1j8hfe6" style="display: flex; flex-direction: row;">
                        ${content}
                    </div>
                    <div class="container svelte-1j8hfe6" style="display: flex; flex-direction: row;">
                        ${extraContent}
                    </div>
                </div>
            </div>
        </div>
    `;

    const template = document.createElement("template");
    template.innerHTML = MODAL_HTML;

    const modalElement = template.content.firstElementChild;

    modalElement.addEventListener("click", (event) => {
        if (event.target.matches(".background") || event.target.closest(".close-button")) {
            modalElement.remove();
        }
    });

    document.body.prepend(modalElement);

    return () => modalElement.remove();
}

function downloadFile(fileName, fileID, el) {
    return new Promise((resolve, reject) => {
        const url = `https://${selectedProxy}/${fileID}`;

        if (CONFIG.COMMANDS.directDownload.state) {
            window.open(`${url}?download`, "_blank");
            return resolve();
        }

        GM_xmlhttpRequest({
            url,
            responseType: "blob",
            onload(event) {
                resolve(event);
                if (event.status !== 200) {
                    showModal("Download error", `The server probably blocked download of the file.`);
                    return;
                }

                const a = document.createElement("a");
                a.target = "_blank";
                a.href = URL.createObjectURL(event.response);
                a.download = fileName;
                a.click();
                el.style.setProperty("--loaded", "0");
            },
            onerror(event) {
                reject(event);
            },
            onprogress(event) {
                el.style.setProperty("--loaded", `${(event.loaded * el.clientWidth) / event.total}px`);
            },
        });
    });
}

async function massiveDownload(files, el) {
    for (const file of files) {
        try {
            if (file.availability || file.availability_message) {
                showModal(
                    file.availability,
                    `Error on download file: ${file.name}<br>Server availability message: ${file.availability_message}.<br>Trying to download other files.`,
                );
                continue;
            }

            const res = await downloadFile(file.name, file.id, el);

            if (res.loaded === 0) {
                throw new Error("0 bytes loaded from response.");
            }
        } catch (error) {
            console.error(`Failed to download ${file.name}:`, error);
            showModal("Download error", `Failed to download ${file.name}.`);
        }
    }
}

function copyURL(url) {
    navigator.clipboard
        .writeText(url)
        .then(() => showModal("URL copied", "The bypass URL has been copied to your clipboard."))
        .catch(() => showModal("Copy failed", "Could not copy the URL. Please copy it manually."));
}

function copyBypassURL(files) {
    const url = Array.isArray(files) ? files.map((file) => `https://${selectedProxy}/${file.id}`).join("\n") : `https://${selectedProxy}/${files.id}`;
    copyURL(url);
}

async function openBypassURL(file) {
    const w = window.open("about:blank", "_blank");
    const finalURL = file.proxyFinalURL || (await getFinalURL(`https://${selectedProxy}/${file.id}`));
    w.document.write(`
        <html style="background: #000;">
            <body style="margin:0">
            <video src="${finalURL}" controls autoplay style="width:100%;height:100%"></video>
            </body>
        </html>
    `);
    w.document.close();
}

function handleSingleFile(separator, fileData) {
    const { name, id } = fileData;
    const downloadButton = createButton("download", "Bypass download", "DL Bypass");
    const openButton = createButton("open_in_new", "Open bypass URL", "Open bypass");
    const copyButton = createButton("content_copy", "Copy bypass URL", "Copy bypass");
    const sendToJDownloaderButton = createButton("add_link", "Add link to JDownloader", "JD (Link)");

    const dlZipButton = createButton("archive", "Bypass download all files in zip", "DL (ZIP)");
    const copyZipButton = createButton("content_copy", "Copy all files in zip", "Copy (ZIP)");
    const showZipURLSButton = createButton("link", "Show bypass URLs in zip", "Show (ZIP)");
    const sendFileZipToJDButton = createButton("add_link", "Add links to JDownloader (ZIP)", "JD (ZIP)");

    downloadButton.addEventListener("click", () => downloadFile(name, id, downloadButton));
    openButton.addEventListener("click", async () => {
        openBypassURL(fileData);
    });
    copyButton.addEventListener("click", () => copyBypassURL(fileData));
    sendToJDownloaderButton.addEventListener("click", async () => {
        const finalURL = fileData.proxyFinalURL || (await getFinalURL(`https://${selectedProxy}/${fileData.id}`));
        fileData.proxyFinalURL = finalURL;
        sendToJDownloader(finalURL);
    });

    dlZipButton.addEventListener("click", async () => {
        const finalURL = fileData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        fileData.finalZipURL = zipURL;

        if (CONFIG.COMMANDS.directDownload.state) {
            window.open(zipURL, "_blank");
            return;
        }

        GM_xmlhttpRequest({
            url: zipURL,
            responseType: "blob",
            onload(event) {
                if (event.status !== 200) {
                    showModal("Download error", `The server probably blocked download of the file.`);
                    return;
                }

                const a = document.createElement("a");
                a.target = "_blank";
                a.href = URL.createObjectURL(event.response);
                a.download = `${fileData.id}.zip`;
                a.click();
            },
            onerror(event) {
                reject(event);
            },
        });
    });
    copyZipButton.addEventListener("click", async () => {
        const finalURL = fileData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        fileData.finalZipURL = zipURL;

        copyURL(zipURL);
    });
    showZipURLSButton.addEventListener("click", async () => {
        if (fileData.mime_type !== "application/zip") {
            showModal("Error", "This file is not a zip file. Please select a zip file to show its contents.");
            return;
        }

        const finalURL = await getFinalURL(`https://${selectedProxy}/${id}/zip`);
        const domain = finalURL.split("/")[2];
        const filesInZipElements = document.querySelectorAll(".file_preview a[href*='/info/zip']");
        const filesInZipURLS = [];
        let filesZipHTML = "";

        for (const file of filesInZipElements) {
            const fileURL = `https://${domain}${file.pathname}`;
            const fileName = file.previousSibling.previousSibling.previousSibling.previousSibling.textContent;
            filesInZipURLS.push(fileURL);

            filesZipHTML += `
            <a class="file-name" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="${fileName}" 
                href="${fileURL}">
                    ${fileName}
            </a>`;
        }

        const containerFileZipURLS = `<div class="indent container-names" style="display: flex; flex-direction: column;justify-content: center;align-items: center;">${filesZipHTML}</div>`;
        const containerFileInZipURLS = `<pre class="indent" style="padding-inline: .5rem;">${filesInZipURLS.join("\n")}</pre>`;

        showModal("Bypass URLs in zip", containerFileZipURLS + containerFileInZipURLS);
    });
    sendFileZipToJDButton.addEventListener("click", async () => {
        const finalURL = fileData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${fileData.id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        fileData.finalZipURL = zipURL;

        sendToJDownloader(zipURL);
    });

    separator.after(separator.cloneNode());
    separator.after(sendFileZipToJDButton);
    separator.after(showZipURLSButton);
    separator.after(copyZipButton);
    separator.after(dlZipButton);
    separator.after(separator.cloneNode());
    separator.after(sendToJDownloaderButton);
    separator.after(copyButton);
    separator.after(openButton);
    separator.after(downloadButton);
}

function handleFileList(separator, listData) {
    const availableFiles = [];
    const bypassURLS = [];
    let filesLinkHTML = "";

    for (const file of listData.files) {
        if (file.availability || file.availability_message) continue;

        availableFiles.push(file);
        bypassURLS.push(`https://${selectedProxy}/${file.id}`);

        filesLinkHTML += `
            <a class="file-name" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="${file.name}" 
                href="https://${selectedProxy}/${file.id}">
                    ${file.name}
            </a>`;
    }

    const containerFileURLS = `<div class="indent container-names" style="display: flex; flex-direction: column;justify-content: center;align-items: center;">${filesLinkHTML}</div>`;
    const containerBypassURLS = `<pre class="indent" style="padding-inline: .5rem;">${bypassURLS.join("\n")}</pre>`;

    const dlSelectedButton = createButton("download", "Bypass download selected file", "DL (Sel.)");
    const openButton = createButton("open_in_new", "Open bypass URL", "Open (Sel.)");
    const copyButton = createButton("content_copy", "Copy bypass url", "Copy (Sel.)");
    const sendSelectedToJDButton = createButton("add_link", "Add link to JDownloader", "JD (Sel.)");

    const dlAllButton = createButton("download", "Bypass download all files", "DL (All)");
    const copyAllButton = createButton("content_copy", "Copy all bypass url", "Copy (All)");
    const showUrlsButton = createButton("link", "Show bypass URLs", "Show (All)");
    const sendAllToJDButton = createButton("add_link", "Add links to JDownloader", "JD (All)");

    const dlZipButton = createButton("archive", "Bypass download all files in zip", "DL (ZIP)");
    const copyZipButton = createButton("content_copy", "Copy all files in zip", "Copy (ZIP)");
    const showZipURLSButton = createButton("link", "Show bypass URLs in zip", "Show (ZIP)");
    const sendFileZipToJDButton = createButton("add_link", "Add links to JDownloader (ZIP)", "JD (ZIP)");

    dlSelectedButton.addEventListener("click", () => {
        const selectedFile = getSelectedFile(listData);
        if (selectedFile.availability || selectedFile.availability_message) {
            showModal(selectedFile.availability, selectedFile.availability_message);
            return;
        }

        downloadFile(selectedFile.name, selectedFile.id, dlSelectedButton);
    });
    openButton.addEventListener("click", async () => {
        const selectedFile = getSelectedFile(listData);
        if (selectedFile.availability || selectedFile.availability_message) {
            showModal(selectedFile.availability, selectedFile.availability_message);
            return;
        }

        openBypassURL(selectedFile);
    });
    copyButton.addEventListener("click", () => {
        const selectedFile = getSelectedFile(listData);

        copyBypassURL(selectedFile);
    });
    sendSelectedToJDButton.addEventListener("click", async () => {
        const selectedFile = getSelectedFile(listData);
        const finalURL = selectedFile.proxyFinalURL || (await getFinalURL(`https://${selectedProxy}/${selectedFile.id}`));
        selectedFile.proxyFinalURL = finalURL;

        sendToJDownloader(finalURL);
    });

    dlAllButton.addEventListener("click", () => massiveDownload(listData.files, dlAllButton));
    copyAllButton.addEventListener("click", () => copyBypassURL(listData.files));
    showUrlsButton.addEventListener("click", () => showModal("Bypass URLs", containerFileURLS + containerBypassURLS));
    sendAllToJDButton.addEventListener("click", async () => {
        const promises = listData.files.map(async (file) => {
            const finalURL = file.proxyFinalURL || (await getFinalURL(`https://${selectedProxy}/${file.id}`));
            file.proxyFinalURL = finalURL;
            return finalURL;
        });
        const finalURLs = (await Promise.all(promises)).join("\r\n");

        sendToJDownloader(finalURLs);
    });

    dlZipButton.addEventListener("click", async () => {
        const finalURL = listData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${listData.id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        listData.finalZipURL = zipURL;

        if (CONFIG.COMMANDS.directDownload.state) {
            window.open(zipURL, "_blank");
            return;
        }

        GM_xmlhttpRequest({
            url: zipURL,
            responseType: "blob",
            onload(event) {
                if (event.status !== 200) {
                    showModal("Download error", `The server probably blocked download of the file.`);
                    return;
                }

                const a = document.createElement("a");
                a.target = "_blank";
                a.href = URL.createObjectURL(event.response);
                a.download = `${listData.id}.zip`;
                a.click();
            },
            onerror(event) {
                reject(event);
            },
        });
    });
    copyZipButton.addEventListener("click", async () => {
        const finalURL = listData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${listData.id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        listData.finalZipURL = zipURL;

        copyURL(zipURL);
    });
    showZipURLSButton.addEventListener("click", async () => {
        const selectedFile = getSelectedFile(listData);
        if (selectedFile.mime_type !== "application/zip") {
            showModal("Error", "This file is not a zip file. Please select a zip file to show its contents.");
            return;
        }

        const finalURL = await getFinalURL(`https://${selectedProxy}/${selectedFile.id}/zip`);
        const domain = finalURL.split("/")[2];
        const filesInZipElements = document.querySelectorAll(".file_preview a[href*='/info/zip']");
        const filesInZipURLS = [];
        let filesZipHTML = "";

        for (const file of filesInZipElements) {
            const fileURL = `https://${domain}${file.pathname}`;
            const fileName = file.previousSibling.previousSibling.previousSibling.previousSibling.textContent;
            filesInZipURLS.push(fileURL);

            filesZipHTML += `
            <a class="file-name" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="${fileName}" 
                href="${fileURL}">
                    ${fileName}
            </a>`;
        }

        const containerFileZipURLS = `<div class="indent container-names" style="display: flex; flex-direction: column;">${filesZipHTML}</div>`;
        const containerFileInZipURLS = `<pre class="indent" style="padding-inline: .5rem;">${filesInZipURLS.join("\n")}</pre>`;

        showModal("Bypass URLs in zip", containerFileZipURLS + containerFileInZipURLS);
    });
    sendFileZipToJDButton.addEventListener("click", async () => {
        const finalURL = listData.finalZipURL || (await getFinalURL(`https://${selectedProxy}/${listData.id}/zip`));
        const zipURL = finalURL.replace("/file/", "/list/");
        listData.finalZipURL = zipURL;

        sendToJDownloader(zipURL);
    });

    separator.after(separator.cloneNode());
    separator.after(sendFileZipToJDButton);
    separator.after(showZipURLSButton);
    separator.after(copyZipButton);
    separator.after(dlZipButton);
    separator.after(separator.cloneNode());
    separator.after(sendAllToJDButton);
    separator.after(showUrlsButton);
    separator.after(copyAllButton);
    separator.after(dlAllButton);
    separator.after(separator.cloneNode());
    separator.after(sendSelectedToJDButton);
    separator.after(copyButton);
    separator.after(openButton);
    separator.after(dlSelectedButton);
}

function registerCommands() {
    GM_registerMenuCommand(`Current proxy: ${CONFIG.customBypassURL || CONFIG.defaultBypassURL}`, () => {});
    GM_registerMenuCommand("Set custom proxy", () => {
        const proxyDomain = prompt("Set your custom proxy", GM_getValue("custom_proxy", ""));

        GM_setValue("custom_proxy", proxyDomain || "");

        unsafeWindow.location.reload();
    });

    for (const key in CONFIG.COMMANDS) {
        const command = CONFIG.COMMANDS[key];
        const savedState = GM_getValue(key, command.state);
        command.state = savedState;

        if (command.state) command.effect?.();

        GM_registerMenuCommand(`${savedState ? "⧯" : "⧮"} ${command.label || key}`, () => {
            GM_setValue(key, !command.state);
            unsafeWindow.location.reload();
        });
    }
}

function modAllowPlayer() {
    Object.defineProperty(unsafeWindow, "viewer_data", {
        get() {
            return this._viewer_data;
        },
        set(value) {
            if (value.type === "file") {
                value.api_response.allow_video_player = true;
            }

            if (value.type === "list") {
                for (const file of value.api_response.files) {
                    file.allow_video_player = true;
                }
            }

            this._viewer_data = value;
        },
    });
}

function mutationsHandler(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === "attributes") {
            onElement(mutation.target);

            continue;
        }

        for (const node of mutation.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            onElement(node);
        }
    }
}

function onElement(node) {
    for (const key in CONFIG.ON_ELEMENTS) {
        if (!node.matches(key)) continue;

        CONFIG.ON_ELEMENTS[key](node);
    }
}

function getFinalURL(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            method: "HEAD",
            timeout: 5000,
            onload(event) {
                resolve(event.finalUrl);
            },
            onerror: (ev) => {
                console.error("Error getting final URL", ev);
                showModal("Error getting final URL", "The proxy is probably down or blocking the request.");
                reject(ev);
            },
            ontimeout: (ev) => {
                console.error("Timeout getting final URL", ev);
                showModal("Timeout getting final URL", "The proxy is probably down or blocking the request.");
                reject(ev);
            },
        });
    });
}

function getSelectedFile(listData) {
    return listData.files.find((file) => file.selected);
}

function sendToJDownloader(urls) {
    const data = {
        urls,
        source: urls,
        referrer: "https://pixeldrain.com/",
    };

    GM_xmlhttpRequest({
        method: "POST",
        url: CONFIG.jDownloaderURL,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        onerror(ev) {
            console.error("Error sending to jDownloader", ev);
            showModal("Error sending to jDownloader", "jDownloader is probably closed or listening on another port.");
        },
    });
}

function initOnDOM() {
    CONFIG.viewer_data = unsafeWindow.viewer_data;
    CONFIG.api_response = unsafeWindow.viewer_data.api_response;
    CONFIG.dataType = unsafeWindow.viewer_data.type;

    if (!CONFIG.viewer_data) {
        console.warn("Viewer data not found. Script may not function correctly.");
        return;
    }

    const separator = document.querySelector(".toolbar > .separator.svelte-jngqwx");
    if (!separator) {
        console.warn("Toolbar separator not found. Cannot add buttons.");
        return;
    }

    GM_addStyle(`
        .file_preview_row:has(.gallery) :where([title="Bypass download selected file"], [title="Copy bypass url"], [title="Add link to JDownloader"], [title="Open bypass URL"], [title="Show bypass URLs in zip"], .toolbar .separator:nth-child(2)) { 
            display: none !important; 
        }
        [title="Bypass download"], [title="Bypass download selected file"], [title="Bypass download all files"], [title="Bypass download all files in zip"] { 
            box-shadow: inset var(--highlight_background) var(--loaded, 0) 0; 
            transition: 0.3s;
        }
        .file_preview_row:not(:has(.file_preview a[href*="/info/zip"])) [title="Show bypass URLs in zip"] {
            display: none;
        }
        .final-urls-loaded :where([title="Add link to JDownloader"], [title="Add links to JDownloader"]) {
            display: flex;
        }
        .file-name {
            max-width: 550px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .file-stats {
            position: fixed;
            bottom: 1.5rem;
            right: 0.5rem;
            background-color: var(--card_color);
            color: var(--body_text_color);
            border-radius: 8px;
            border: none;
            padding: .5rem;
            margin: 0;
            box-shadow: 2px 2px 10px -4px #000000;
        }
    `);

    switch (CONFIG.dataType) {
        case "file":
            handleSingleFile(separator, CONFIG.api_response);
            break;
        case "list":
            handleFileList(separator, CONFIG.api_response);
            break;
        default:
            console.warn(`File type "${CONFIG.dataType}" not supported.`);
    }
}

function init() {
    registerCommands();

    const observer = new MutationObserver(mutationsHandler);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", initOnDOM);
}

init();
