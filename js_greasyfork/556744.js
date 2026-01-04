// ==UserScript==
// @name        Sharepoint Video Transcript Downloader
// @namespace   Violentmonkey Scripts
// @match       *://*.sharepoint.com/*/stream.aspx*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description Download transcripts of SharePoint Stream videos with the download button disabled
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556744/Sharepoint%20Video%20Transcript%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556744/Sharepoint%20Video%20Transcript%20Downloader.meta.js
// ==/UserScript==

var mediaData, transcriptData;
function getData(callback) {
    if (!mediaData || !transcriptData) {
        const infoUrl = new URL(g_fileInfo[".spItemUrl"].replace("/_api/v2.0/", "/_api/v2.1/"));
        infoUrl.search = "?select=media%2Ftranscripts%2CaudioTracks&%24expand=media%2Ftranscripts%2Cmedia%2FaudioTracks";
        fetch(infoUrl.toString()).then((res) => res.json()).then((media) => {
            mediaData = media;
            infoUrl.pathname += `/media/transcripts/${mediaData.media.transcripts[0].id}/streamContent`;
            infoUrl.search = "?format=json&applyhighlights=false&applymediaedits=false";
            fetch(infoUrl.toString()).then((res) => res.json()).then((transcript) => {
                transcriptData = transcript;
                callback();
            });
        });
    } else {
        callback();
    }
}
const observer = new MutationObserver(() => {
    const disabledBtn = document.querySelector("button#downloadTranscript.is-disabled");
    if (disabledBtn) {
        const textBtn = document.createElement("button");
        textBtn.className = "sp-Stream-command-bar-far-buttons";
        textBtn.style.cssText = "background-color: white; cursor: pointer;";
        textBtn.innerHTML = '<span class="ms-Button-label" style="color: black;">Download Text</span>';
        const vttBtn = textBtn.cloneNode(true);
        vttBtn.children[0].innerText = "Download VTT";
        textBtn.addEventListener("click", () => getData(() => {
            const entries = [];
            transcriptData.entries.forEach((e) => entries.push(`${e.startOffset.split(".")[0]}  ${e.speakerDisplayName}\n${e.text}\n`));
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([entries.join("\n")], { type: "text/plain" }));
            link.download = mediaData.media.transcripts[0].displayName.replace(/\.[^/.]+$/, "") + ".txt";
            link.click();
        }));
        vttBtn.addEventListener("click", () => getData(() => {
            window.open(mediaData.media.transcripts[0].temporaryDownloadUrl, "_blank");
        }));
        disabledBtn.parentNode.replaceChild(vttBtn, disabledBtn);
        vttBtn.parentNode.insertBefore(textBtn, vttBtn);
    }
    let disabledTooltip = document.querySelector("div#transcriptDownloadDisableTooltip--tooltip");
    if (disabledTooltip) {
        while (!disabledTooltip.classList.contains("ms-Tooltip")) {
            disabledTooltip = disabledTooltip.parentNode;
        }
        disabledTooltip.remove();
    }
});
observer.observe(document.body, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
});