// ==UserScript==
// @name               Bahamut AniMad Shows Extractor
// @name:zh-TW         巴哈姆特動畫瘋節目擷取器
// @description        Extract and generate FFmpeg command to download shows from Bahamut AniMad.
// @description:zh-TW  從巴哈姆特動畫瘋擷取及産生 FFmpeg 節目下載命令。
// @icon               data:image/webp;base64,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
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.1
// @license            MIT
// @match              https://ani.gamer.com.tw/animeVideo.php
// @match              https://ani.gamer.com.tw/animeVideo.php?*
// @run-at             document-start
// @grant              GM.setClipboard
// @require            https://update.greasyfork.org/scripts/494512/1373878/gm-inject.js
// @require            https://unpkg.com/m3u8-parser@7.2.0/dist/m3u8-parser.min.js
// @downloadURL https://update.greasyfork.org/scripts/560966/Bahamut%20AniMad%20Shows%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/560966/Bahamut%20AniMad%20Shows%20Extractor.meta.js
// ==/UserScript==

const EVENT_KEY = crypto.randomUUID();

const scriptWrapper = document.createElement("div");
scriptWrapper.style.display = "none";

const shadowRoot = scriptWrapper.attachShadow({ mode: "closed" });

const script = document.createElement("script");
script.addEventListener("load", () =>
{
    GM.injectPageScript(
    ({ EVENT_KEY }) =>
    {
        xhook.after((request, response) =>
        {
            if (String(request.url).includes("/playlist_advance.m3u8"))
            {
                window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:foundManifest`,
                    {
                        detail: JSON.stringify(
                            {
                                requestUrl: String(request.url),
                                manifest: response.text
                            }),
                    }));
            }
        });

    },
    { EVENT_KEY });
});
script.src = "https://unpkg.com/xhook@1.6.2/dist/xhook.min.js";

shadowRoot.append(script);
(document.head ?? document.documentElement).append(scriptWrapper);

window.addEventListener(`${EVENT_KEY}:foundManifest`, async ({ detail }) =>
{
    const { requestUrl, manifest } = JSON.parse(detail);

    const parser = new m3u8Parser.Parser();
    parser.push(manifest);
    parser.end();

    let currentBandwidth = 0;
    let currentUrl = null;
    for (const { uri, attributes } of parser.manifest.playlists)
    {
        if (attributes.BANDWIDTH > currentBandwidth)
        {
            currentBandwidth = attributes.BANDWIDTH;
            currentUrl = uri;
        }
    }

    if (currentUrl)
    {
        const command = generateCommand(new URL(currentUrl, requestUrl).href);
        await GM.setClipboard(command);
        alert("Copied FFmpeg command into the clipboard.");
    }
    else
    {
        alert("Failed to extract M3U8 playlist.");
    }
});

function escapeDoubleQuotes(string)
{
    return string.replaceAll(/([$`"\\])/g, "\\$1");
}

function generateCommand(url)
{
    const title = document.querySelector(".anime_name > h1").innerText;
    return `ffmpeg -reconnect 1 -reconnect_streamed 1 -reconnect_on_network_error 1 -reconnect_max_retries 10 -user_agent "${escapeDoubleQuotes(navigator.userAgent)}" -headers "Origin: ${escapeDoubleQuotes(location.origin)}" -i "${escapeDoubleQuotes(url)}" -c copy "${escapeDoubleQuotes(title)}.mp4"`;
}