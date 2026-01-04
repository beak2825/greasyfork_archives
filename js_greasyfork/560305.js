// ==UserScript==
// @name         MSL Logger
// @namespace    http://greasyfork.org/
// @version      0.1.1
// @description  Decrypts Netflix MSL messages and logs them
// @author       DevLARLEY
// @license      CC BY-NC-ND 4.0
// @noframes
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560305/MSL%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/560305/MSL%20Logger.meta.js
// ==/UserScript==

(async () => {
    const proxy = (object, method, handler) => {
        if (Object.hasOwnProperty.call(object, method)) {
            const original = object[method];
            Object.defineProperty(object, method, {
                value: new Proxy(original, {apply: handler})
            });
        }
    };

    const decode = {
        b64: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
        b64Text: s => atob(s),
        utf8: s => new TextDecoder("utf-8").decode(s)
    };

    /* https://github.com/Netflix/msl/blob/63721e8fa2fee08b1e194b15cf906933590b6467/core/src/main/javascript/util/LzwCompression.js */
    function lzwUncompress(data, maxDeflateRatio) {
        let BYTE_SIZE = 8;
        let BYTE_RANGE = 256;

        let UNCOMPRESS_DICTIONARY = [];
        for (let ui = 0; ui < BYTE_RANGE; ++ui) {
            UNCOMPRESS_DICTIONARY[ui] = [ui];
        }

        let dictionary = UNCOMPRESS_DICTIONARY.slice();

        let codeIndex = 0;
        let codeOffset = 0;
        let bits = BYTE_SIZE;
        let uncompressed = new Uint8Array(Math.ceil(data.length * 1.5));
        let index = 0;
        let nextIndex = 0;
        let prevvalue = [];

        while (codeIndex < data.length) {
            let bitsAvailable = (data.length - codeIndex) * BYTE_SIZE - codeOffset;
            if (bitsAvailable < bits)
                break;

            let code = 0;
            let bitsDecoded = 0;
            while (bitsDecoded < bits) {
                let bitlen = Math.min(bits - bitsDecoded, BYTE_SIZE - codeOffset);
                let msbits = data[codeIndex];

                msbits <<= codeOffset;
                msbits &= 0xff;
                msbits >>>= BYTE_SIZE - bitlen;

                bitsDecoded += bitlen;
                codeOffset += bitlen;
                if (codeOffset === BYTE_SIZE) {
                    codeOffset = 0;
                    ++codeIndex;
                }

                code |= (msbits & 0xff) << (bits - bitsDecoded);
            }

            let value = dictionary[code];

            if (prevvalue.length === 0) {
                ++bits;
            } else {
                if (!value) {
                    prevvalue.push(prevvalue[0]);
                } else {
                    prevvalue.push(value[0]);
                }

                dictionary[dictionary.length] = prevvalue;
                prevvalue = [];

                if (dictionary.length === (1 << bits))
                    ++bits;

                if (!value)
                    value = dictionary[code];
            }

            nextIndex = index + value.length;

            if (nextIndex > maxDeflateRatio * data.length)
                throw new Error("Deflate ratio " + maxDeflateRatio + " exceeded. Aborting uncompression.");

            if (nextIndex >= uncompressed.length) {
                let u = new Uint8Array(Math.ceil(nextIndex * 1.5));
                u.set(uncompressed);
                uncompressed = u;
            }

            uncompressed.set(value, index);
            index = nextIndex;

            prevvalue = prevvalue.concat(value);
        }

        return uncompressed.subarray(0, index);
    }

    const db = indexedDB.open('netflix.player');
    db.onsuccess = e => {
        const namedatapairs = e.target.result.transaction('namedatapairs').objectStore('namedatapairs');
        namedatapairs.get('mslstore').onsuccess = e => {
            db.encryptionKey = e.target.result.data.encryptionKey;
        }
    };

    const parseObjects = (str) => {
        return str.split('}{')
            .map((s, i, arr) => {
                if (i > 0) s = '{' + s;
                if (i < arr.length - 1) s = s + '}';
                return JSON.parse(s);
            });
    }

    async function decryptCipherEnvelope(envelope) {
        const plaintext = await crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: decode.b64(envelope.iv)
            },
            db.encryptionKey,
            decode.b64(envelope.ciphertext)
        );

        return JSON.parse(decode.utf8(plaintext));
    }

    async function decryptPayloadChunks(chunks) {
        const parts = [];

        for (const chunk of chunks) {
            const chunkJson = JSON.parse(decode.b64Text(chunk.payload));
            const decryptedJson = await decryptCipherEnvelope(chunkJson);

            let appData = decode.b64(decryptedJson.data);
            if (decryptedJson.compressionalgo === "LZW") {
                appData = decode.utf8(lzwUncompress(appData, 200));
            } else if (decryptedJson.compressionalgo === "GZIP") {
                const ds = new DecompressionStream("gzip");
                const stream = new Blob([appData]).stream().pipeThrough(ds);
                const buffer = await new Response(stream).arrayBuffer();
                appData = decode.utf8(new Uint8Array(buffer));
            } else {
                appData = decode.utf8(appData);
            }

            parts.push(appData);
        }

        return JSON.parse(parts.join(""));
    }

    async function decryptHeader(header) {
        const tokendata = JSON.parse(decode.b64Text(header.mastertoken.tokendata));

        const headerdataCipher = JSON.parse(decode.b64Text(header.headerdata));
        const headerdata = await decryptCipherEnvelope(headerdataCipher);

        return { tokendata, headerdata }
    }

    async function handleCadmiumData(type, data, url) {
        if (!db.encryptionKey)
            return;

        const mslObjects = parseObjects(data);
        const header = await decryptHeader(mslObjects[0]);
        const payload = await decryptPayloadChunks(mslObjects.slice(1));

        console.groupCollapsed(
            `%c MSL %c [%s]%c Message ID: %c%s%c, Sender: %c%s%c, Time: %c%s%c`,
            `background: #0F5257; color: white;`, `color: white; font-weight: bold;`, type, "color: white",
            "color: #8AA2A9", header.headerdata.messageid, "color: white",
            "color: #8AA2A9", header.headerdata.sender, "color: white",
            "color: #8AA2A9", (new Date(header.headerdata.timestamp * 1000)).toLocaleString(), "color: white",
        );

            console.groupCollapsed("[HEADER]");
            console.log(header.headerdata);

                console.groupCollapsed("[MASTER TOKEN]");
                console.log(header.tokendata);
                console.groupEnd();

            console.groupEnd();

            console.groupCollapsed("[PAYLOAD]");
            console.log(payload);
            console.groupEnd();

        console.groupEnd();
    }

    proxy(XMLHttpRequest.prototype, "open", (target, thisArg, args) => {
        const [method, url] = args;

        thisArg.requestMethod = method;
        thisArg.requestURL = url;

        return Reflect.apply(target, thisArg, args);
    });

    proxy(XMLHttpRequest.prototype, "send", async (target, thisArg, args) => {
        const body = args[0];

        if (thisArg.requestMethod === "POST" && thisArg.requestURL.includes("cadmium") && !!body && typeof body === "string") {
            thisArg.addEventListener("readystatechange", async () => {
                if (thisArg.readyState === 4) {
                    await handleCadmiumData("RESPONSE", thisArg.responseText, thisArg.requestURL);
                }
            });
            await handleCadmiumData("REQUEST", body, thisArg.requestURL);
        }

        return Reflect.apply(target, thisArg, args);
    });
})();