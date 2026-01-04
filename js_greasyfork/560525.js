// ==UserScript==
// @name        WuolahExtra
// @description UserScript para Wuolah
// @namespace   Violentmonkey Scripts
// @match       https://wuolah.com/*
// @version     1.5.15
// @homepage    https://github.com/pablouser1/WuolahExtra
// @author      Pablo Ferreiro
// @license     MIT
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @require     https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @resource    gulagcleaner_wasm https://cdn.jsdelivr.net/npm/gulagcleaner_wasm/gulagcleaner_wasm_bg.wasm
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.getResourceUrl
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/560525/WuolahExtra.user.js
// @updateURL https://update.greasyfork.org/scripts/560525/WuolahExtra.meta.js
// ==/UserScript==

const { createObjectURL: origcreateObjectURL } = window.URL;
const { fetch: origFetch } = window;

let wasm;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} data
* @param {boolean} force_naive
* @returns {Uint8Array}
*/
function clean_pdf(data, force_naive) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.clean_pdf(retptr, ptr0, len0, force_naive);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance);
}

var Log;
(function (Log) {
    Log[Log["DEBUG"] = 0] = "DEBUG";
    Log[Log["INFO"] = 1] = "INFO";
    Log[Log["ERROR"] = 2] = "ERROR";
})(Log || (Log = {}));
var Log$1 = Log;

class Misc {
    static logValues = Object.values(Log$1);
    static log(msg, mode = Log$1.DEBUG) {
        const data = `[WuolahExtra] (${Misc.logValues[mode]}) ${msg}`;
        switch (mode) {
            case Log$1.DEBUG:
                if (GM_config.get("debug")) {
                    console.debug(data);
                }
                break;
            case Log$1.INFO:
                console.log(data);
                break;
            case Log$1.ERROR:
                console.error(data);
                break;
        }
    }
    static getPath(url_str) {
        try {
            const url = new URL(url_str);
            const path = url.pathname;
            return path;
        }
        catch {
            return url_str;
        }
    }
    static isPdf(data) {
        const arr = new Uint8Array(data).subarray(0, 5);
        let header = "";
        for (const b of arr) {
            header += b.toString(16);
        }
        return header === "255044462d";
    }
    static async extractPDFName(pdfBuffer) {
        try {
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);
            const title = pdfDoc.getTitle() ?? "Untitled";
            return title;
        }
        catch (error) {
            Misc.log(`Error extracting PDF metadata, ${error}`, Log$1.ERROR);
            return "";
        }
    }
    static async initGulag() {
        Misc.log("Injecting WASM", Log$1.DEBUG);
        const url = await GM.getResourceUrl("gulagcleaner_wasm");
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        initSync(buf);
    }
    static getCookie(name) {
        const nameLenPlus = name.length + 1;
        return (document.cookie
            .split(";")
            .map((c) => c.trim())
            .filter((cookie) => {
            return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
            .map((cookie) => {
            return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || "");
    }
}

class Api {
    static BASE_URL = "https://api.wuolah.com/v2";
    static TOKEN_KEY = "token";
    static async folder(id) {
        const params = new URLSearchParams();
        params.append("filter[uploadId]", id.toString());
        params.append("pagination[page]", "0");
        params.append("pagination[pageSize]", "9999");
        params.append("pagination[withCount]", "false");
        const res = await origFetch(`${Api.BASE_URL}/documents?${params.toString()}`, Api._buildInit());
        const json = await res.json();
        return json.data;
    }
    static async docUrl(id) {
        const body = {
            adblockDetected: false,
            ads: [],
            fileId: id,
            machineId: "",
            noAdsWithCoins: false,
            qrData: null,
            referralCode: "",
            ubication17ExpectedPubs: 0,
            ubication17RequestedPubs: 0,
            ubication1ExpectedPubs: 0,
            ubication1RequestedPubs: 0,
            ubication2ExpectedPubs: 0,
            ubication2RequestedPubs: 0,
            ubication3ExpectedPubs: 0,
            ubication3RequestedPubs: 0,
        };
        const bodyStr = JSON.stringify(body);
        const res = await origFetch(`${Api.BASE_URL}/download`, {
            method: "POST",
            body: bodyStr,
            ...Api._buildInit(),
        });
        if (!res.ok) {
            return null;
        }
        const data = await res.json();
        return data.url;
    }
    static async docData(url) {
        const res = await origFetch(url);
        const buf = await res.arrayBuffer();
        return buf;
    }
    static _getToken() {
        return Misc.getCookie(Api.TOKEN_KEY);
    }
    static _buildInit() {
        return {
            headers: {
                Authorization: `Bearer ${Api._getToken()}`,
            },
        };
    }
}

var ClearMethods;
(function (ClearMethods) {
    ClearMethods["NONE"] = "none";
    ClearMethods["GULAG"] = "gulag";
    ClearMethods["TROLAH"] = "trolah";
    ClearMethods["PDFLIB"] = "pdflib";
})(ClearMethods || (ClearMethods = {}));
var ClearMethods$1 = ClearMethods;

const xmlRequestPromise = (details) => {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            ...details,
            responseType: 'arraybuffer',
            onload: resolve,
            onerror: reject
        });
    });
};

const openBlob = (obj, filename = "", revokeWhenOpened = true) => {
    const url = origcreateObjectURL(obj);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    if (filename !== "")
        a.setAttribute("download", filename);
    a.setAttribute("target", "_blank");
    a.click();
    a.remove();
    if (revokeWhenOpened) {
        window.URL.revokeObjectURL(url);
    }
};
const clearGulag = (buf) => {
    return clean_pdf(new Uint8Array(buf), false);
};
const clearTrolah = async (buf, basico) => {
    try {
        const data = new FormData();
        data.append('file', new Blob([buf], {
            type: "application/pdf"
        }));
        data.append('modo_basico', basico.toString());
        const res = await xmlRequestPromise({
            url: 'https://trolah.pp.ua/process_pdf',
            method: 'POST',
            data
        });
        if (res.response === null) {
            return buf;
        }
        return res.response;
    }
    catch (e) {
        alert("¡No se pudo obtener el PDF de TrolahCleaner, usando PDF original!\nConsulta https://github.com/pablouser1/WuolahExtra para más información");
        return buf;
    }
};
const clearPDFLib = async (buf) => {
    const doc = await PDFLib.PDFDocument.load(buf);
    doc.removePage(0);
    const data = await doc.save();
    return data;
};
const handlePDF = async (origData) => {
    let data;
    const clearMethod = GM_config.get("clear_pdf").toString();
    switch (clearMethod) {
        case ClearMethods$1.PDFLIB:
            data = await clearPDFLib(origData);
            break;
        case ClearMethods$1.GULAG:
            data = clearGulag(origData);
            break;
        case ClearMethods$1.TROLAH:
            const basico = GM_config.get("trolah_basic");
            data = await clearTrolah(origData, basico.valueOf());
            break;
        case ClearMethods$1.NONE:
            data = origData;
            break;
        default:
            alert("Invalid clear method! Fallback to original pdf");
            data = origData;
    }
    return data;
};

class Hooks {
    static BEFORE = [
        {
            id: "no-analytics",
            endpoint: /^\/v2\/events$/,
            func: Hooks.noAnalytics,
            cond: () => GM_config.get("no_analytics"),
        },
    ];
    static AFTER = [
        {
            id: "make-pro",
            endpoint: /^\/v2\/me$/,
            func: Hooks.makePro,
        },
        {
            id: "force-dark",
            endpoint: /^\/v2\/user-preferences\/me$/,
            func: Hooks.forceDark,
            cond: () => GM_config.get("force_dark"),
        },
        {
            id: "no-ui-ads",
            endpoint: /^\/v2\/a-d-s$/,
            func: Hooks.noUiAds,
            cond: () => GM_config.get("clean_ui"),
        },
        {
            id: "folder-download",
            endpoint: /^\/v2\/group-downloads\/uploads/,
            func: Hooks.folderDownload,
            cond: () => GM_config.get("folder_download"),
        },
    ];
    static noAnalytics(_input, init) {
        if (init) {
            Misc.log("Eliminando eventos", Log$1.INFO);
            init.body = JSON.stringify({
                events: [],
            });
        }
    }
    static makePro(res) {
        if (res.ok) {
            Misc.log("Haciendo usuario pro client-side", Log$1.INFO);
            const json = () => res
                .clone()
                .json()
                .then((d) => ({ ...d, isPro: true, subscriptionId: "prod_OiP9d4lmwvm0Ba", subscriptionTier: "tier_3", verifiedSubscriptionTier: true }));
            res.json = json;
        }
    }
    static forceDark(res) {
        if (res.ok) {
            Misc.log("Forzando tema oscuro", Log$1.INFO);
            const json = () => res
                .clone()
                .json()
                .then((d) => ({
                ...d, item: {
                    theme: "wuolah-theme-dark"
                }
            }));
            res.json = json;
        }
    }
    static noUiAds(res) {
        if (res.ok) {
            Misc.log("Eliminando ui ads", Log$1.INFO);
            const json = async () => {
                return { items: [] };
            };
            res.json = json;
        }
    }
    static folderDownload(res) {
        const zip = new JSZip();
        const url = res.url;
        const id = parseInt(url.substring(url.lastIndexOf("/") + 1));
        if (isNaN(id)) {
            Misc.log("¡Error al obtener id de la carpeta!", Log$1.INFO);
            return;
        }
        Misc.log(`Descargando carpeta ${id}`, Log$1.INFO);
        Api.folder(id).then(async (docs) => {
            let failed = false;
            let i = 0;
            while (!failed && i < docs.length) {
                const doc = docs[i];
                const url = await Api.docUrl(doc.id);
                if (url !== null) {
                    let buf = await Api.docData(url);
                    if (doc.fileType === "application/pdf") {
                        buf = await handlePDF(buf);
                    }
                    zip.file(doc.name, buf, { binary: true });
                    i++;
                }
                else {
                    failed = true;
                    alert(`No se pudo descargar el archivo ${doc.name}, ¿quizás es un problema de captcha? Se ha interrumpido la descarga de la carpeta`);
                }
            }
            if (!failed) {
                zip.generateAsync({ type: "base64" }).then(bs64 => {
                    const a = document.createElement('a');
                    a.href = "data:application/zip;base64," + bs64;
                    a.setAttribute("download", `${id}.zip`);
                    a.click();
                    a.remove();
                }).catch(err => {
                    Misc.log(err, Log$1.ERROR);
                });
            }
        });
    }
}

class FetchWrapper {
    debug = false;
    before = [];
    after = [];
    addHooks(h) {
        if (h.before !== undefined) {
            this.before = h.before;
        }
        if (h.after !== undefined) {
            this.after = h.after;
        }
    }
    async entrypoint(input, init) {
        this.beforeHandler(input, init);
        const res = await origFetch(input, init);
        this.afterHandler(res);
        return res;
    }
    setDebug(debug) {
        this.debug = debug;
    }
    beforeHandler(input, init) {
        const path = Misc.getPath(input.toString());
        const h = this.before.find((item) => this._finder(item, path));
        if (h !== undefined) {
            if (this.debug) {
                console.log(`${h.id} PRE`, { input, init });
            }
            h.func(input, init);
            if (this.debug) {
                console.log(`${h.id} POST`, { input, init });
            }
        }
    }
    afterHandler(res) {
        const path = Misc.getPath(res.url);
        const h = this.after.find((item) => this._finder(item, path));
        if (h !== undefined) {
            if (this.debug) {
                console.log(`${h.id} PRE`, { res });
            }
            h.func(res);
            if (this.debug) {
                console.log(`${h.id} POST`, { res });
            }
        }
    }
    _finder(item, path) {
        const found = item.endpoint.test(path);
        if (found) {
            return item.cond === undefined ? true : item.cond();
        }
        return false;
    }
}

const addOptions = () => GM.registerMenuCommand("Config", () => GM_config.open());

const objectURLWrapper = (obj) => {
    if (!(obj instanceof Blob && obj.type === "application/octet-stream")) {
        return origcreateObjectURL(obj);
    }
    obj.arrayBuffer().then(async (buf) => {
        if (!Misc.isPdf(buf)) {
            openBlob(obj);
            return;
        }
        const title = Misc.extractPDFName(buf);
        Misc.log("Limpiando documento", Log$1.INFO);
        const data = await handlePDF(buf);
        if (data === null) {
            return;
        }
        const newBlob = new Blob([data], { type: "application/pdf" });
        openBlob(newBlob, await title);
    });
    return "javascript:void(0)";
};

Misc.log("STARTING", Log$1.INFO);
const fetchWrapper = new FetchWrapper();
fetchWrapper.addHooks({
    before: Hooks.BEFORE,
    after: Hooks.AFTER,
});
GM_config.init({
    id: "wuolahextra",
    fields: {
        debug: {
            type: "checkbox",
            label: "Modo debugging",
            default: false,
        },
        clear_pdf: {
            type: "select",
            label: "Método de limpieza de PDF",
            options: Object.values(ClearMethods$1),
            default: ClearMethods$1.GULAG,
        },
        clean_ui: {
            type: "checkbox",
            label: "Limpia distracciones en la interfaz",
            default: true,
        },
        no_analytics: {
            type: "checkbox",
            label: "Desactivar analíticas",
            default: true,
        },
        force_dark: {
            type: "checkbox",
            label: "Forzar modo oscuro",
            default: false,
        },
        folder_download: {
            type: "checkbox",
            label: "[EXPERIMENTAL] Descargar carpeta",
            title: "¡Esta función aún está en desarrollo!",
            default: false,
        },
        trolah_basic: {
            type: "checkbox",
            label: "[TrolahCleaner] Activar modo básico",
            default: false
        }
    },
    events: {
        init: () => {
            if (GM_config.get("debug")) {
                fetchWrapper.setDebug(true);
            }
            const clearMethod = GM_config.get("clear_pdf").toString();
            if (clearMethod !== ClearMethods$1.NONE) {
                Misc.log("Overriding createObjectURL", Log$1.DEBUG);
                unsafeWindow.URL.createObjectURL = objectURLWrapper;
            }
            if (clearMethod === ClearMethods$1.GULAG) {
                Misc.initGulag();
            }
        },
        save: () => {
            const ok = confirm("Los cambios se han guardado, ¿quieres refrescar la página para aplicar los cambios?");
            if (ok) {
                window.location.reload();
            }
        },
    },
});
unsafeWindow.fetch = (...args) => fetchWrapper.entrypoint(...args);
addOptions();
