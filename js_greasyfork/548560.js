// ==UserScript==
// @name        Video Filter with Diagnostics
// @namespace   LuckyFemboyScripts
// @match       https://*.coomer.party/*
// @match       https://*.kemono.party/*
// @match       https://*.coomer.su/*
// @match       https://*.kemono.su/*
// @match       https://*.coomer.st/*
// @match       https://*.kemono.cr/*
// @grant        none
// @version     2.6969
// @description Filters posts on Coomer/Kemono sites by videos, blacklist, and minimum duration
// @author       LuckyFemboy
// @grant        GM_xmlhttpRequest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548560/Video%20Filter%20with%20Diagnostics.user.js
// @updateURL https://update.greasyfork.org/scripts/548560/Video%20Filter%20with%20Diagnostics.meta.js
// ==/UserScript==

// Configuración principal

// Configuración de idioma - 1: English, 2: Español
let language = 1;














const interfaceTexts = {
    title: {
        1: "Video Filter",
        2: "Filtro de Videos"
    },
    modes: {
        1: [
            { value: "onlyVideos", text: "Videos only" },
            { value: "videosAndBlacklist", text: "Videos + Blacklist" },
            { value: "blacklistOnly", text: "Blacklist only" },
            { value: "blacklistAndDuration", text: "Blacklist + Duration" },
            { value: "durationOnly", text: "Duration only" }
        ],
        2: [
            { value: "onlyVideos", text: "Solo videos" },
            { value: "videosAndBlacklist", text: "Videos y Blacklist" },
            { value: "blacklistOnly", text: "Solo Blacklist" },
            { value: "blacklistAndDuration", text: "Blacklist y duración mínima" },
            { value: "durationOnly", text: "Solo duración mínima" }
        ]
    },
    durationLabel: {
        1: "Minimum Duration (seconds):",
        2: "Duración Mínima (segundos):"
    },
    applyButton: {
        1: "Apply Filter",
        2: "Aplicar Filtro"
    },
    applyingText: {
        1: "Applying...",
        2: "Aplicando..."
    },
    completedText: {
        1: "Filter Completed",
        2: "Filtro Completado"
    },
    bannerText: {
        1: "⏳ Applying filters...",
        2: "⏳ Aplicando filtros..."
    }
};






// Blacklist
const authorBlacklist = ["", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "", "", "", "",

             // Favorites




        "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",
         "", "", "", "", "", "", "", "", "", "", "", "",]; // Fat or ugly

// 🔍 Verifica si el usuario está en la blacklist

let applyFilterButton = null; //

function isUserBlacklisted(userId) {
    return authorBlacklist.includes(userId);
}

const minimumVideoLength = 150; // Longitud mínima de video en segundos
const validURLs = [
    'https://coomer.su/posts',
    'https://coomer.su/posts?',
    'https://coomer.su/posts/popular',
    'https://coomer.su/onlyfans/user/',
    'https://coomer.su/fansly/user/',

    'https://coomer.st/posts',
    'https://coomer.st/posts?',
    'https://coomer.st/posts/popular',
    'https://coomer.st/onlyfans/user/',
    'https://coomer.st/fansly/user/'
];


(function () {
    'use strict';

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initializeScript();
        });
    } else {
        initializeScript();
    }

    function initializeScript() {
        console.log("Inicializando script...");
        createFilterUI();
        observeURLChanges();
        observePosts();
    }
})();

function createFilterUI() {
    document.querySelector('#filterContainer')?.remove();

    if (!isURLValid()) {
        console.log("URL no válida, no se mostrarán controles.");
        return;
    }

    console.log("Creando UI de filtros...");

    const container = document.createElement("div");
    container.id = "filterContainer";
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "#1e1e2e";
    container.style.border = "1px solid #313244";
    container.style.padding = "7px";
    container.style.borderRadius = "8px";
    container.style.zIndex = "9999";
    container.style.width = "224px";
    container.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#cdd6f4";
    container.style.fontSize = "12px";


  // Language switcher
const langContainer = document.createElement("div");
langContainer.style.marginBottom = "10px";
langContainer.style.textAlign = "center";

const langLabel = document.createElement("span");
langLabel.textContent = "Language: ";
langLabel.style.color = "#cdd6f4";
langLabel.style.fontSize = "11px";

const langSelect = document.createElement("select");
langSelect.style.backgroundColor = "#313244";
langSelect.style.color = "#cdd6f4";
langSelect.style.border = "1px solid #45475a";
langSelect.style.borderRadius = "3px";

const langOption1 = document.createElement("option");
langOption1.value = "1";
langOption1.text = "English";
langOption1.selected = language === 1;

const langOption2 = document.createElement("option");
langOption2.value = "2";
langOption2.text = "Español";
langOption2.selected = language === 2;

langSelect.appendChild(langOption1);
langSelect.appendChild(langOption2);

langSelect.onchange = function() {
    language = parseInt(this.value);
    createFilterUI(); // Recrear la UI con el nuevo idioma
};

langContainer.appendChild(langLabel);
langContainer.appendChild(langSelect);
container.appendChild(langContainer);


    const title = document.createElement("h3");
    title.textContent = interfaceTexts.title[language];
    title.style.marginTop = "0";
    title.style.marginBottom = "8px";
    title.style.color = "#f5c2e7";
    title.style.fontSize = "14px";
    title.style.borderBottom = "1px solid #45475a";
    title.style.paddingBottom = "5px";
    container.appendChild(title);

    const modeContainer = document.createElement("div");
    modeContainer.style.marginBottom = "10px";


    const select = document.createElement("select");
    select.id = "filterMode";
    select.style.width = "100%";
    select.style.padding = "5px";
    select.style.borderRadius = "5px";
    select.style.backgroundColor = "#313244";
    select.style.color = "#cdd6f4";
    select.style.border = "1px solid #45475a";
    select.style.fontSize = "12px";
interfaceTexts.modes[language].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.text = opt.text;
    if (opt.value === "durationOnly") option.selected = true;
    select.appendChild(option);
});

    modeContainer.appendChild(select);
    container.appendChild(modeContainer);

    const durationContainer = document.createElement("div");
    durationContainer.id = "durationContainer";
    durationContainer.style.marginBottom = "10px";
    durationContainer.style.display = "none";

    const durationLabel = document.createElement("label");
    durationLabel.textContent = interfaceTexts.durationLabel[language];
    durationLabel.style.display = "block";
    durationLabel.style.marginBottom = "4px";
    durationLabel.style.fontWeight = "bold";
    durationLabel.style.color = "#a6e3a1";
    durationLabel.style.fontSize = "12px";
    durationContainer.appendChild(durationLabel);

    const durationInput = document.createElement("input");
    durationInput.id = "minDurationInput";
    durationInput.type = "number";
    durationInput.min = "0";
    durationInput.value = minimumVideoLength;
    durationInput.style.width = "100%";
    durationInput.style.padding = "5px";
    durationInput.style.borderRadius = "5px";
    durationInput.style.backgroundColor = "#313244";
    durationInput.style.color = "#cdd6f4";
    durationInput.style.border = "1px solid #45475a";
    durationInput.style.fontSize = "12px";
    durationContainer.appendChild(durationInput);

    container.appendChild(durationContainer);

    const button = document.createElement("button");
    button.textContent = interfaceTexts.applyButton[language];
    button.style.width = "100%";
    button.style.padding = "6px";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#f38ba8";
    button.style.color = "#1e1e1e";
    button.style.border = "none";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.style.transition = "background-color 0.2s";

button.onmouseover = () => {
    if (button.dataset.status === "completed") {
        button.style.backgroundColor = "#c3f9c1";
    } else {
        button.style.backgroundColor = "#f5c2e7";
    }
};

button.onmouseout = () => {
    if (button.dataset.status === "completed") {
        button.style.backgroundColor = "#a6e3a1";
    } else {
        button.style.backgroundColor = "#f38ba8";
    }
};


    button.onclick = function () {
        const mode = select.value;
        const minDuration = parseInt(durationInput.value || minimumVideoLength, 10);
        applySelectedFilter(mode, minDuration);
    };

    applyFilterButton = button;

    container.appendChild(button);

    select.onchange = () => {
        const showDuration = select.value === "durationOnly" || select.value === "blacklistAndDuration";
        durationContainer.style.display = showDuration ? "block" : "none";


    if (applyFilterButton && applyFilterButton.dataset.status === "completed") {
        applyFilterButton.textContent = interfaceTexts.applyButton[language];
        applyFilterButton.style.backgroundColor = "#f38ba8";
        applyFilterButton.dataset.status = "";
    }
    };
    select.onchange();


    document.body.appendChild(container);
    select.dispatchEvent(new Event('change'));

}






function observeURLChanges() {
    let lastURL = location.href;

    new MutationObserver(() => {
        const currentURL = location.href;
        if (currentURL !== lastURL) {
            lastURL = currentURL;
            console.log("Cambio de URL detectado. Actualizando UI...");
            createFilterUI();
        }
    }).observe(document, { subtree: true, childList: true });
}


function observePosts() {
let attempts = 0;
let maxAttempts = 10
    function tryObserve() {
        const postsContainer = document.querySelector('.card-list__items');
        if (!postsContainer) {
            attempts++;
            if (attempts >= maxAttempts) {
                console.warn(`No se encontró el contenedor de posts tras ${attempts} intentos. Se detiene la búsqueda.`);
                return;
            }
            console.log(`Intento ${attempts}: Contenedor de posts no encontrado. Reintentando...`);
            setTimeout(tryObserve, 1000);
            return;
        }

        const observer = new MutationObserver(() => {
            console.log("Cambios detectados en los posts");
        });

        observer.observe(postsContainer, { childList: true, subtree: true });
        console.log("Observador activado.");
    }

    tryObserve();
}


function parsePostUrl(href) {
    if (!href) return null;
    const m = href.match(/^https?:\/\/[^/]+\/([^/]+)\/user\/([^/]+)\/post\/([^/?#]+)/i);
    if (!m) return null;
    return { service: m[1], creator_id: m[2], post_id: m[3] };
}



// Verificar URL
// ⛳️ Reemplazo completo de isURLValid() (elimina el const validURLs = [...] )
function isURLValid() {
    const { pathname } = window.location;

    // No mostrar controles en la vista de post individual
    if (/\/post\//.test(pathname)) return false;

    // Vistas de listado generales
    const isList =
        pathname.startsWith("/posts") ||
        pathname.startsWith("/popular") || // Kemono tiene /popular
        !!document.querySelector(".card-list__items");

    // Feeds de usuario de cualquier servicio (onlyfans, fansly, patreon, fanbox, fantia, gumroad, subscribestar, boosty, etc.)
    const isUserFeed = /^\/[a-z0-9_-]+\/user\/[^/]+\/?$/i.test(pathname);

    return Boolean(isList || isUserFeed);
}

let filterMode = ""; // Se setea desde applySelectedFilter()

function applySelectedFilter(mode, minDuration) {
    console.log(`Aplicando filtro: ${mode} | Duración mínima: ${minDuration}s`);

    filterMode = mode;

    if (applyFilterButton) {
        applyFilterButton.disabled = true;
        applyFilterButton.textContent = interfaceTexts.applyingText[language];
        applyFilterButton.style.backgroundColor = "#f9e2af";
        applyFilterButton.dataset.status = "applying";
    }

    const banner = document.createElement("div");
    banner.id = "filter-status-banner";
    banner.style = "position:fixed;top:0;left:0;right:0;padding:15px;background:#11111b;color:#a6e3a1;font-weight:bold;text-align:center;z-index:9998;font-size:16px;";
    banner.innerText = interfaceTexts.bannerText[language];
    document.body.appendChild(banner);

    setTimeout(() => {
        if (mode === "onlyVideos") filterVideos();
        else if (mode === "videosAndBlacklist") filterVideos();
        else if (mode === "blacklistOnly") filterVideos();
        else if (mode === "durationOnly") filterByDuration(minDuration);
        else if (mode === "blacklistAndDuration") filterByBlacklistAndDuration(minDuration);

        setTimeout(() => {
            banner.remove();
        }, 2000);
    }, 500);
}






async function filterVideos() {
    console.log("[INFO] Iniciando filtro de publicaciones sin video...");

    const cardList = await new Promise(resolve => {
        const existing = document.querySelector(".card-list__items");
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            const list = document.querySelector(".card-list__items");
            if (list) {
                observer.disconnect();
                resolve(list);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const posts = [...cardList.children];
    let totalEliminados = 0;

    const eliminados = [];
    const aprobados = [];

    for (const post of posts) {
        const postLink = post.querySelector("a")?.href;
        if (!postLink) continue;


        const parsed = parsePostUrl(postLink);
if (!parsed) return;
const { service, creator_id, post_id } = parsed;

        try {
            // Llamar a la API
            const base = window.location.origin;
const urlApi = `${base}/api/v1/${service}/user/${creator_id}/post/${post_id}`;


            let data;
try {
    data = await gmFetchJson(urlApi);
} catch (err) {
    console.warn(`[WARN] No se pudo obtener info del post ${post_id}`, err);
    return;
}



            const postData = data.post || {};

            const title = postData.title || "[Sin título]";
            const content = postData.content || "[Sin contenido]";
            const user = creator_id;

            const resultado = await postHasVideoAndCheckBlacklist(service, creator_id, post_id, filterMode, user);

            const videoUrls = resultado?.videoUrls || [];

            const info = {
                title,
                content,
                user,
                link: postLink,
                video: videoUrls.length ? videoUrls[0] : ""
            };

            if (!resultado?.passes) {
                let razon = "Desconocida";

                if (filterMode === "onlyVideos") {
                    razon = "No Video";
                } else if (filterMode === "blacklistOnly") {
                    razon = "blacklist";
                } else if (filterMode === "videosAndBlacklist") {
                    const noVideo = resultado?.videoUrls?.length === 0;
                    const enListaNegra = isUserBlacklisted(info.user);

                    if (noVideo && enListaNegra) {
                        razon = "No Video y Blacklist";
                    } else if (noVideo) {
                        razon = "No Video";
                    } else {
                        razon = "Blacklist";
                    }
                }

                eliminados.push({
                    ...info,
                    razon
                });

                post.style.display = "none";
                totalEliminados++;
            } else {
                aprobados.push(info);
            }

        } catch (e) {
            console.warn(`[ERROR] Excepción procesando post ${post_id}`, e);
        }
    }

    console.log(`[RESULTADO] Total de publicaciones eliminadas: ${totalEliminados}`);

    mostrarResultadosEnConsola(eliminados, aprobados);
}

async function probarDuracionVideo(service, creator_id, post_id) {
                const base = window.location.origin;
const url = `${base}/api/v1/${service}/user/${creator_id}/post/${post_id}`;
    try {
let data;
try {
    data = await gmFetchJson(url);
} catch (e) {
    console.log(`[ERROR] API no respondió para duración: ${url}`, e);
    return 0;
}


        const allUrls = extractVideoUrls(data);
        const videoUrls = dedupeUrls(allUrls).filter(esUrlVideo);

        if (videoUrls.length === 0) {
            console.log("[INFO] No se encontró ningún link real de video en la respuesta.");
            return 0;
        }

        let totalDuracion = 0;
        for (const videoUrl of videoUrls) {
            const duracion = await obtenerDuracionConVideoElement(videoUrl);
            totalDuracion += duracion || 0;
        }

        console.log(`[INFO] Duración total combinada del post ${post_id}: ${totalDuracion.toFixed(2)}s`);
        return totalDuracion;

    } catch (e) {
        console.log("[ERROR] Falló consulta para duración de video:", e);
        return 0;
    }
}

// === NUEVO gmFetchJson() — versión compatible con Coomer 2025 ===
async function gmFetchJson(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            headers: {
                // 🩵 Coomer/Kemono bloquea "application/json"
                "Accept": "text/css"
            },
            onload: (response) => {
                console.debug(`[FETCH OK] ${url} → ${response.status} (${(response.responseText || '').length} bytes)`);

                try {
                    const text = response.responseText?.trim() || "";

                    if (response.status === 403) {
                        console.warn(`[WARN] 403 recibido desde ${url}. Servidor requiere header 'text/css'.`);
                    }

                    if (!text) return reject("Respuesta vacía");

                    // En Coomer siempre responde con JSON aunque el header sea "text/css"
                    if (text.startsWith("{") || text.startsWith("[")) {
                        const data = JSON.parse(text);
                        console.log("✅ [gmFetchJson] Datos obtenidos:", data);
                        resolve(data);
                    } else {
                        console.warn("[WARN] Respuesta no es JSON. Fragmento:", text.slice(0, 150));
                        reject("Respuesta no JSON");
                    }
                } catch (e) {
                    console.error("[ERROR] al parsear JSON desde", url, e, response.responseText?.slice(0, 200));
                    reject(e);
                }
            },
            onerror: (err) => {
                console.error("[ERROR] Fallo en GM_xmlhttpRequest:", err);
                reject(err);
            }
        });
    });
}



function esUrlVideo(url) {
    const videoExts = ['.mp4', '.m4v', '.webm', '.mov', '.avi', '.mkv', '.flv', '.ogg'];
    url = url.toLowerCase();
    return videoExts.some(ext => url.endsWith(ext));
}

async function filterByDuration(minDuration, batchSize = 25) {
    console.log(`[INFO] Filtrando por duración mínima: ${minDuration}s (solo posts con videos)`);

    const cardList = await new Promise(resolve => {
        const existing = document.querySelector(".card-list__items");
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            const list = document.querySelector(".card-list__items");
            if (list) {
                observer.disconnect();
                resolve(list);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const posts = [...cardList.children];
    let totalEliminados = 0;

    const eliminados = [];
    const aprobados = [];

    async function procesarPost(post) {
        const postLink = post.querySelector("a")?.href;
        if (!postLink) return;

        const parsed = parsePostUrl(postLink);
if (!parsed) return;
const { service, creator_id, post_id } = parsed;

        try {
            const base = window.location.origin;
const urlApi = `${base}/api/v1/${service}/user/${creator_id}/post/${post_id}`;


let data;
try {
    data = await gmFetchJson(urlApi);
} catch (err) {
    console.warn(`[WARN] No se pudo obtener info del post ${post_id}`, err);
    return;
}


            const videoUrls = dedupeUrls(extractVideoUrls(data)).filter(esUrlVideo);

            if (videoUrls.length === 0) {
                eliminados.push({
                    title: data.post?.title || "[Sin título]",
                    razon: "No Video",
                    content: data.post?.content || "[Sin contenido]",
                    user: creator_id,
                    link: postLink,
                    video: "",

                });
                post.style.display = "none";
                totalEliminados++;
                return;
            }

let duracionReal = await probarDuracionVideo(service, creator_id, post_id);

if (typeof duracionReal !== "number" || isNaN(duracionReal)) {
    duracionReal = 0;
}
            if (duracionReal < minDuration) {
                eliminados.push({
                    title: data.post?.title || "[Sin título]",
                  razon: `Duración total menor a ${minDuration}s (${duracionReal.toFixed(2)}s)`,
                    content: data.post?.content || "[Sin contenido]",
                    user: creator_id,
                    link: postLink,
                    video: videoUrls[0],

                    duracionTotal: duracionReal.toFixed(2) + "s"
                });
                post.style.display = "none";
                totalEliminados++;
            } else {
                aprobados.push({
                    title: data.post?.title || "[Sin título]",
                    content: data.post?.content || "[Sin contenido]",
                    user: creator_id,
                    link: postLink,
                    video: videoUrls[0],
                    duracionTotal: duracionReal.toFixed(2) + "s"
                });
            }

        } catch (e) {
            console.warn(`[ERROR] Excepción procesando post ${post_id}`, e);
        }
    }

    // Función para procesar en batches paralelos
    for (let i = 0; i < posts.length; i += batchSize) {
        const batch = posts.slice(i, i + batchSize);
        await Promise.all(batch.map(procesarPost));
    }

    console.log(`[RESULTADO] Total de publicaciones eliminadas: ${totalEliminados}`);
    mostrarResultadosEnConsola(eliminados, aprobados);
}



async function filterByBlacklistAndDuration(minDuration, batchSize = 25) {
    console.log(`[INFO] Filtrando por blacklist y duración mínima: ${minDuration}s`);

    const cardList = await new Promise(resolve => {
        const existing = document.querySelector(".card-list__items");
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
            const list = document.querySelector(".card-list__items");
            if (list) {
                observer.disconnect();
                resolve(list);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const posts = [...cardList.children];
    let totalEliminados = 0;

    const eliminados = [];
    const aprobados = [];

    // Procesa un solo post
    async function procesarPost(post) {
        const postLink = post.querySelector("a")?.href;
        if (!postLink) return;

        const parsed = parsePostUrl(postLink);
if (!parsed) return;
const { service, creator_id, post_id } = parsed;

        try {
            const base = window.location.origin;
const urlApi = `${base}/api/v1/${service}/user/${creator_id}/post/${post_id}`;


let data;
try {
    data = await gmFetchJson(urlApi);
} catch (err) {
    console.warn(`[WARN] No se pudo obtener info del post ${post_id}`, err);
    return;
}

            const username = creator_id;

            // Rechazar por blacklist
            if (isUserBlacklisted(username)) {
                eliminados.push({
                    title: data.post?.title || "[Sin título]",
                  razon: "Blacklist",
                    content: data.post?.content || "[Sin contenido]",
                    user: username,
                    link: postLink,
                    video: "",

                    duracionTotal: "0s"
                });
                post.style.display = "none";
                totalEliminados++;
                return;
            }

            const videoUrls = dedupeUrls(extractVideoUrls(data)).filter(esUrlVideo);

            if (videoUrls.length === 0) {
                eliminados.push({
                    title: data.post?.title || "[Sin título]",
                    razon: "No Videos",
                    content: data.post?.content || "[Sin contenido]",
                    user: username,
                    link: postLink,
                    video: "",
                    duracionTotal: "0s"
                });
                post.style.display = "none";
                totalEliminados++;
                return;
            }

            let duracionReal = await probarDuracionVideo(service, creator_id, post_id);
            if (typeof duracionReal !== "number" || isNaN(duracionReal)) {
                duracionReal = 0;
            }

            if (duracionReal < minDuration) {
                eliminados.push({
                    title: data.post?.title || "[Sin título]",
                  razon: `Duración total menor a ${minDuration}s (${duracionReal.toFixed(2)}s)`,
                    content: data.post?.content || "[Sin contenido]",
                    user: username,
                    link: postLink,
                    video: videoUrls[0],

                    duracionTotal: duracionReal.toFixed(2) + "s"
                });
                post.style.display = "none";
                totalEliminados++;
            } else {
                aprobados.push({
                    title: data.post?.title || "[Sin título]",
                    content: data.post?.content || "[Sin contenido]",
                    user: username,
                    link: postLink,
                    video: videoUrls[0],
                    duracionTotal: duracionReal.toFixed(2) + "s"
                });
            }

        } catch (e) {
            console.warn(`[ERROR] Excepción procesando post ${post_id}`, e);
        }
    }

    // Ejecuta los posts por lotes en paralelo
    for (let i = 0; i < posts.length; i += batchSize) {
        const batch = posts.slice(i, i + batchSize);
        await Promise.all(batch.map(procesarPost));
    }

    console.log(`[RESULTADO] Total de publicaciones eliminadas: ${totalEliminados}`);
    mostrarResultadosEnConsola(eliminados, aprobados);
}


// === NUEVO extractVideoUrls() ===
function extractVideoUrls(data) {
  if (!data) return [];

  const urls = [];
  const base = window.location.origin;

  // 🔹 Formato nuevo (objeto con post, attachments, videos)
  if (data.post) {
    if (Array.isArray(data.videos)) {
      for (const vid of data.videos) {
        if (vid?.path) urls.push(`${base}/data${vid.path}`);
      }
    }
    if (Array.isArray(data.attachments)) {
      for (const att of data.attachments) {
        if (att?.path) urls.push(`${base}/data${att.path}`);
      }
    }
    if (data.post?.file?.path) {
      urls.push(`${base}/data${data.post.file.path}`);
    }
    return dedupeUrls(urls);
  }

  // 🔹 Formato tipo array (viejo o revisiones)
  if (Array.isArray(data)) {
    for (const revision of data) {
      if (revision?.file?.path) {
        urls.push(`${base}/data${revision.file.path}`);
      }
      if (Array.isArray(revision?.attachments)) {
        for (const att of revision.attachments) {
          if (att?.path) urls.push(`${base}/data${att.path}`);
        }
      }
    }
    return dedupeUrls(urls);
  }

  // 🔹 Fallback antiguo
  if (Array.isArray(data.videos)) {
    for (const v of data.videos) {
      const p = v?.path || v?.url; // algunos viejos usan url
      if (p) urls.push(`${base}/data${p}`);
    }
  }
  if (Array.isArray(data.post?.attachments)) {
    for (const a of data.post.attachments) {
      if (a?.path) urls.push(`${base}/data${a.path}`);
    }
  }

  // Unificar salida
  return dedupeUrls(urls);
}

function normalizePathToFullUrl(path) {
    if (!path) return "";
    // Si ya es una URL completa
    if (/^https?:\/\//i.test(path)) return path;
    // Asegurar el dominio correcto según el sitio actual
    const base = window.location.origin;
    return `${base}/data${path.startsWith("/") ? path : "/" + path}`;
}

function canonicalVideoKey(url) {
  try {
    const u = new URL(url, location.origin);
    // clave sin querystring, en minúscula
    return (u.origin + u.pathname).toLowerCase();
  } catch {
    // fallback si llega como path relativo
    return (url.split("?")[0] || url).toLowerCase();
  }
}

function dedupeUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const raw of urls || []) {
    const full = normalizePathToFullUrl(raw); // ya existe en tu script
    const key = canonicalVideoKey(full);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(full);
    }
  }
  return out;
}




function obtenerDuracionConVideoElement(url) {
    return new Promise((resolve) => {
        console.log(`[INFO] Intentando obtener duración real con video element para URL: ${url}`);

        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;

        const onLoadedMetadata = () => {
            const duracion = video.duration;
            console.log(`[DURACIÓN REAL] URL: ${url}, duración: ${duracion.toFixed(2)} segundos`);
            cleanup();
            resolve(duracion);
        };

        const onError = () => {
            console.log(`[WARN] No se pudo cargar metadata para URL: ${url}`);
            cleanup();
            resolve(0);
        };

        function cleanup() {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            video.src = "";
        }

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("error", onError);
    });
}

async function postHasVideoAndCheckBlacklist(service, creator_id, post_id, mode, username) {
                const base = window.location.origin;
const url = `${base}/api/v1/${service}/user/${creator_id}/post/${post_id}`;
    try {
let data;
try {
    data = await gmFetchJson(url);
} catch (e) {
    return { passes: false };
}

        const urls = dedupeUrls(extractVideoUrls(data)).filter(esUrlVideo);
const hasVideo = urls.length > 0;
const isBlacklisted = isUserBlacklisted(username);

let passes = true;
if (mode === "onlyVideos") {
    passes = hasVideo;
} else if (mode === "blacklistOnly") {
    passes = !isBlacklisted;
} else if (mode === "videosAndBlacklist") {
    passes = hasVideo && !isBlacklisted;
}

return {
    passes,
    videoUrls: urls
};

    } catch (e) {
        console.warn(`[ERROR] Fallo al obtener info de post ${post_id}`, e);
        return { passes: false };
    }
}





function mostrarResultadosEnConsola(eliminados, aprobados) {
    const incluirDuracion = (arr) => arr.some(p => p.duracionTotal !== undefined);

    console.log("✅ POSTS APROBADOS:");
    console.table(
        aprobados.map(p => {
            const base = {
                Título: p.title,
                Contenido: p.content,
                Usuario: p.user,
                Video: p.video ? "Sí" : "No",
                Link: p.video || "-"
            };
            if (incluirDuracion(aprobados)) {
                base["Duración total"] = p.duracionTotal || "N/A";
            }
            return base;
        })
    );

    console.log("\n❌ POSTS ELIMINADOS:");
    console.table(
        eliminados.map(p => {
            const base = {
                Título: p.title,
                "Razón de filtrado": p.razon || "Desconocida",
                Contenido: p.content,
                Usuario: p.user,
                Video: p.video ? "Sí" : "No",
                Link: p.video || "-"
            };
            if (incluirDuracion(eliminados)) {
                base["Duración total"] = p.duracionTotal || "N/A";
            }
            return base;
        })
    );
    if (applyFilterButton) {
        applyFilterButton.disabled = false;
        applyFilterButton.textContent = interfaceTexts.completedText[language];
        applyFilterButton.style.backgroundColor = "#a6e3a1";
        applyFilterButton.dataset.status = "completed";
    }
}

