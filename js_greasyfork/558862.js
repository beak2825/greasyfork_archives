// ==UserScript==
// @name         Injecty
// @namespace    injecty
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @version      1.0.1
// @description  A js injector suporting wayyyyyyyy to many file/text hosting services
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558862/Injecty.user.js
// @updateURL https://update.greasyfork.org/scripts/558862/Injecty.meta.js
// ==/UserScript==

const hasTM = false
if (typeof GM_info !== "undefined"){hasTM = true;}
console.log("Injecty has loaded");
console.log("Creating Injecty Container");
const containor = document.createElement("div");
containor.style.position = "fixed";
containor.style.top = "0";
containor.style.left = "0";
containor.style.width = "100%";
containor.style.background = "#222";
containor.style.padding = "10px";
containor.style.display = "flex";
containor.style.gap = "10px";
containor.style.alignItems = "center";
containor.className = "injecty-container";
console.log("Creating Injecty Text Input");
const input = document.createElement("input");
input.type = "text";
input.placeholder = "InjectyLink Here";
input.style.flex = "1";
input.style.padding = "8px";
console.log("Creating Injecty Inject Button");
const btn = document.createElement("button");
btn.textContent = "Inject";
btn.style.padding = "8px 16px";
btn.style.cursor = "pointer";
btn.addEventListener("click", () => {
    const url = input.value.trim().replace('dropbox/', 'https://dl.dropboxusercontent.com/s/').replace('pastebin/', 'https://pastebin.com/raw/').replace('googledrive/', 'https://drive.google.com/uc?export=view&id=').replace('github/', 'https://raw.githubusercontent.com/').replace('githubgist/', 'https://gist.githubusercontent.com/').replace('gitlabsnip/', 'https://gitlab.com/snippets/').replace('uguuse/', 'https://uguu.se/').replace('hastebin/', 'https://hastebin.com/raw/').replace('fileio/', 'https://file.io/').replace('catboxmoe/', 'https://files.catbox.moe/').replace('archive/', 'https://archive.org/download/').replace('sourceforge/', 'https://downloads.sourceforge.net/project/').replace('blackblazeb2/', 'https://f000.backblazeb2.com/file/').replace('tildeverse/', 'https://tilde.team/~').replace('wasabi/', 'https://s3.us-west-1.wasabisys.com/').replace('codecommit/', 'https://git-codecommit.us-east-1.amazonaws.com/v1/repos/').replace('storjlinksharing/', 'https://link.storjshare.io/raw/').replace('arweave/', 'https://arweave.net/').replace('onedrive/', 'https://onedrive.live.com/download?resid=').replace('pcloud/', 'https://u.pcloud.link/publink/download?code=').replace('yandex/', 'https://downloader.disk.yandex.com/disk/').replace('filen/', 'https://gateway.filen.io/d/').replace('krakenfiles/', 'https://krakenfiles.com/download/').replace('bayfiles/', 'https://cdn.bayfiles.com/').replace('pixeldrain/', 'https://pixeldrain.com/api/file/').replace('filegarden/', 'https://filegarden.com/api/file/').replace('gofile/', 'https://storeX.gofile.io/download/').replace('sendcm/', 'https://send.cm/dl/').replace('uploadee/', 'https://www.upload.ee/download/').replace('tusfiles/', 'https://tusfiles.com/d/').replace('uptobox/', 'https://uptobox.com/dl/').replace('filedropper/', 'https://www.filedropper.com/download_file.php?file_id=').replace('filemail/', 'https://download.filemail.com/');
    if (hasTM) {
            // Tampermonkey
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: (resp) => {
                    try {
                        eval(resp.responseText);
                        console.log(`Injected ${url} via Tampermonkey`);
                    } catch (e) {
                        console.error("Injecty Tampermonkey error:", e);
                    }
                },
                onerror: () => alert("Injecty failed to load the script.")
            });
        } else {
            // Bookmarklet/Console
            try {
                var script = document.createElement("script");
                script.src = url;
                script.onload = () => {
                    console.log(`Injected ${url} via bookmarklet/console mode`);
                };
            }
            catch (e) {
                console.error("Injecty bookmarklet/console inject error:", e);
            }
        }
});
containor.appendChild(input);
containor.appendChild(btn);
document.body.appendChild(containor);
document.body.style.paddingTop = "60px";