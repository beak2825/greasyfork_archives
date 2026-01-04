// ==UserScript==
// @name         splix-js-demodularizer
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  A vile trick that may aid you in executing your beloved scripts in the novel version of the client
// @author       You
// @match        https://splix.io/
// @grant        none
// @run-at       document-start
// ==/UserScript==

await(async function () {
    if (document.location.pathname !== "/") return;

    const verToInt = v => v.split(".").reduce((acc, n, i) => acc + parseInt(n) * Math.pow(100, 2 - i), 0)
    const getDemodVer = text => text?.match(/@version\s+(\d+\.\d+\.\d+)/)?.[1] || "0.0.0"
    const currentVersion = "0.2.4";

    if (verToInt(getDemodVer(localStorage.clientDemodCode)) > verToInt(currentVersion)) {
        await (new Function("return (async () => { " + localStorage.clientDemodCode + " })()"))()
    } else {
        if (localStorage.clientCode && !window.jsDemodularized && ![...document.scripts].some(s => s.innerText.includes("globalThis.IS_DEV_BUILD"))) {
            document.open("text/html")
            document.write(localStorage.clientCode)
            document.close()
            window.jsDemodularized = true
        }
        if (!window.locked) {
            async function bundleJS(url, visited = new Set()) {
                if (visited.has(url)) return ""
                visited.add(url)

                let response = await fetch(url + `?v=${Math.floor(Date.now() / 300000)}`)
                if (!response.ok) throw new Error(`Response status: ${response.status}, URL: ${url}`)
                let script = (await response.text()).replaceAll(/\bexport\b/g, "")

                const importRegex = /^import[\s\S]*?["'](.*)["'].*$/gm
                let match
                let result = script
                while ((match = importRegex.exec(script)) !== null) {
                    const importPath = match[1]
                    let importedCode
                    if (importPath.includes('deps/')) {
                        const parts = importPath.replace('../../deps/', '').split('/')
                        const cdnUrl = `https://cdn.jsdelivr.net/npm/@adlad/${parts[0].replace('adlad-', '')}@${parts[1]}/${parts.slice(2).join('/')}`
                        importedCode = await bundleJS(cdnUrl, visited)
                    } else if (importPath.startsWith('.')) {
                        importedCode = await bundleJS(new URL(importPath, url).toString(), visited)
                    }
                    result = result.replace(match[0], importedCode)
                }
                return result
            }

            window.locked = true;
            const loadScript = fetch(
                `https://update.greasyfork.org/scripts/551413/s-j-dt.js?v=${Math.floor(Date.now() / 3600000)}`
            ).then(r => r.text()).catch(() => null);

            let isUpdated = false;
            if (
                verToInt(localStorage.clientCode?.match(/@demod.*?\sv:(\d+\.\d+\.\d+)/)?.[1] || "0.0.0") < verToInt(currentVersion) ||
                Math.floor(Date.now() / 3600000) !== Math.floor((parseInt(localStorage.clientCode?.match(/@demod.*?\sts:(\d+)/)?.[1]) || 0) / 3600000)
            ) {
               const clientPath = "https://raw.githubusercontent.com/jespertheend/splix/refs/tags/v0.17.1/client/"
                const bundled = (await bundleJS(clientPath + "src/main.js"))
                    .replaceAll(/\s\ss\S+(\S)\S\1\S\1\S*s\S*/gm, "")
                    .replace(/IS_DEV_BUILD\s*=\s*true/, "IS_DEV_BUILD = false") +
                    `\n/* @demod v:${currentVersion} ts:${Date.now()} */`

                localStorage.demodularizerVersion = "0.2.3";
                localStorage.clientCode = (await (await fetch(clientPath + "index.html")).text())
                    .replace(/<script.*?\/main.*?<\/script>/, "")
                    .replace("</body>", `<script>${bundled}</script></body>`)

                isUpdated = true;
            }

            try {
                const latest = await loadScript;
                if (latest) {
                    const version = getDemodVer(latest);
                    const prevVersion = getDemodVer(localStorage.clientDemodCode);
                    if (version) {
                        localStorage.clientDemodCode = latest
                        if (verToInt(version) > verToInt(prevVersion)) {
                            isUpdated = true;
                            localStorage.removeItem('clientCode');
                        }
                    }
                }
            } catch { }

            if (isUpdated) {
                console.log(`reloading from ${currentVersion}`)
                console.clear();
                location.reload();
            }
        }
    }
})();