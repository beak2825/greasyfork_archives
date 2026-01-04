// ==UserScript==
// @name One Click Downloader for OnlyFans – Images & Videos
// @namespace OCDownloader
// @version 4.1
// @description Adds one-click download buttons for images and videos...
// @author lavimEodãF
// @match https://onlyfans.com/*
// @grant GM_download
// @icon https://i.imgur.com/BYAVdXU.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558282/One%20Click%20Downloader%20for%20OnlyFans%20%E2%80%93%20Images%20%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/558282/One%20Click%20Downloader%20for%20OnlyFans%20%E2%80%93%20Images%20%20Videos.meta.js
// ==/UserScript==

(function() {
    console.log("One Click Downloader script running...");

    /** Extrai o nome de usuário da URL atual. */
    function extractUsernameFromUrl() {
    const parts = window.location.pathname.split("/").filter(Boolean);

    if (parts.length === 0) return "homepage_generic"; // raiz
    if (parts[0] === "my") {
        if (parts[1] === "chats" && parts[2] === "chat" && parts[3]) return "chat_generic";
        if (parts.includes("collections")) return "feed_generic";
        return "feed_generic";
    }

    // Corrigido: ID numérico seguido de username
    if (/^\d+$/.test(parts[0]) && parts[1]) return parts[1];

    if (!["settings", "notifications", "discover"].includes(parts[0])) return parts[0];
    return "profile_generic";
}


    const observer = new MutationObserver(processMedia);
    observer.observe(document.body, { childList: true, subtree: true });

    // Mantido o modalObserver, mas ele já possui a verificação de urlUsername.endsWith("_generic")
    const modalObserver = new MutationObserver(() => {
        const urlUsername = extractUsernameFromUrl();
        // Esta condição impede a exibição do botão de download no popup de feeds e homepage.
        if (urlUsername.endsWith("_generic")) return;

        const modalImgs = document.querySelectorAll("div[role='dialog'] img:not([data-backup])");
        modalImgs.forEach(modalImg => {
            modalImg.dataset.backup = "true";
            const btnContainer = document.createElement("div");
            Object.assign(btnContainer.style, {
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "6px",
                zIndex: "10000"
            });
            // NOTA: O botão no modal de imagem (popup) SEMPRE aponta para a source/original,
            // então não há "Compressed" para remover aqui.
            const btnOriginal = createButton("⬇ Source", () => modalImg.src, modalImg);
            btnContainer.appendChild(btnOriginal);
            if (getComputedStyle(modalImg.parentElement).position === "static") {
                modalImg.parentElement.style.position = "relative";
            }
            modalImg.parentElement.appendChild(btnContainer);
        });
    });
    modalObserver.observe(document.body, { childList: true, subtree: true });

    /** Gera o nome de arquivo, omitindo a data em chats e popups específicos */
    function generateFileName(url, media) {
        let profileName = extractUsernameFromUrl();
        let includeDate = true;

        // URLs específicas sem data
        const noDateUrls = [
            "/my/chats/chat/",
            "/jewelzblu"
        ];
        for (const pattern of noDateUrls) {
            if (window.location.pathname.startsWith(pattern)) {
                includeDate = false;
                break;
            }
        }

        let dateStr = "";
        try {
            // 1. Tenta encontrar o elemento de data no post.
            let postElement = media.closest(".b-post__wrapper") || media.closest(".b-chat__message");
            let linkEl = postElement?.querySelector("a.b-post__date");

            if (linkEl && includeDate) {
                const dateTitle = linkEl.querySelector("span")?.title;
                const dateText = linkEl.querySelector("span")?.textContent.trim();
                const months = { Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06",
                                 Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12" };
                let day="", month="", year="";
                if (dateTitle) {
                    const tMatch = dateTitle.match(/(\w{3}) (\d{1,2}),/);
                    if (tMatch) { month = months[tMatch[1]]; day = tMatch[2].padStart(2,"0"); }
                    const yMatch = dateText?.match(/(\d{4})$/);
                    year = yMatch ? yMatch[1] : new Date().getFullYear();
                    if (year && month && day) dateStr = `${year}-${month}-${day}`;
                }
            }

            // 2. Lógica de extração de nome de usuário específica para feeds e chats.
            if (profileName.endsWith("_generic")) {
                // Procura o link do avatar ou nome de usuário dentro do post
                let userLink = postElement?.querySelector("a.g-avatar")
                             || postElement?.querySelector("a.b-username");

                const href = userLink?.getAttribute("href");
                const profileMatch = href?.match(/^\/([^\/]+)/); // Pega o nome após a primeira barra

                if (profileMatch && profileMatch[1]) {
                    profileName = profileMatch[1];
                } else {
                    // Fallback para casos genéricos sem link de usuário encontrado
                    profileName = (profileName === "chat_generic") ? "chat_user" : "unknown_user";
                }
            }
        } catch(e) {
            console.log("Erro ao gerar nome de arquivo, fallback aplicado", e);
        }

        // 3. Monta o nome do arquivo.
        const fileId = url.split("?")[0].split("/").pop();
        if (includeDate && dateStr) return `${dateStr}_${profileName}_${fileId}`;
        return `${profileName}_${fileId}`;
    }

    function processMedia() {
        const medias = document.querySelectorAll("img.b-post__media__img:not([data-backup]), video:not([data-backup])");
        medias.forEach(media => {
            media.dataset.backup = "true";
            let wrapper = media.closest(".b-post__media__item-inner") || media.parentElement;
            if (!wrapper) return;
            if (getComputedStyle(wrapper).position === "static") wrapper.style.position = "relative";

            const btnContainer = document.createElement("div");
            Object.assign(btnContainer.style, {
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "6px",
                zIndex: "1000"
            });

            const isVideo = media.tagName === "VIDEO" || media.closest(".video-js-placeholder-wrapper");
            const isImage = media.tagName === "IMG" && media.classList.contains("b-post__media__img") && !isVideo;

            if (isImage) {
                // REMOVIDO: const btnCompressed = createButton("⬇ Compressed", async () => media.src, media);
                const btnOriginal = createButton("⬇ Source", async () => {
                    media.click();
                    const originalUrl = await new Promise(resolve => {
                        const interval = setInterval(() => {
                            const bigImg = document.querySelector("div[role='dialog'] img");
                            if (bigImg && bigImg.src) { clearInterval(interval); resolve(bigImg.src); }
                        }, 100);
                        setTimeout(() => { clearInterval(interval); resolve(media.src); }, 5000);
                    });
                    const closeBtn = document.querySelector(".pswp__button--close, button[aria-label='Close (Esc)']");
                    if (closeBtn) closeBtn.click();
                    return originalUrl;
                }, media);
                // REMOVIDO: btnContainer.appendChild(btnCompressed);
                btnContainer.appendChild(btnOriginal);
                wrapper.appendChild(btnContainer);
            } else if (isVideo) {
                const infoMsg = document.createElement("div");
                infoMsg.innerText = "▶ PLAY TO DOWNLOAD!";
                Object.assign(infoMsg.style, {
                    position: "absolute",
                    top: "70%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    zIndex: "1000",
                    textAlign: "center"
                });
                wrapper.appendChild(infoMsg);

                const btnVideo = createButton("⬇ Download Video", async () => {
                    media.play();
                    await new Promise(r => setTimeout(r, 300));
                    return media.src;
                }, media);
                btnVideo.style.display = "none";
                btnContainer.appendChild(btnVideo);
                wrapper.appendChild(btnContainer);

                media.addEventListener("play", () => {
                    infoMsg.style.display = "none";
                    btnVideo.style.display = "flex";
                });
            }
        });
    }

    function createButton(text, getUrlFunc, media) {
        const btn = document.createElement("button");
        btn.innerText = text;
        Object.assign(btn.style, {
            padding: "6px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            border: "1px solid white",
            cursor: "pointer",
            backdropFilter: "blur(3px)"
        });
        btn.addEventListener("click", async e => {
            e.stopPropagation();
            e.preventDefault();
            const url = await getUrlFunc();
            const name = generateFileName(url, media);
            GM_download({ url, name });
            btn.innerText = "✔️ Saved";
            btn.style.background = "rgba(20,170,60,0.85)";
        });
        return btn;
    }
})();