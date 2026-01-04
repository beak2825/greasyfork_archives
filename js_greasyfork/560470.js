// ==UserScript==
// @name        Ficbook FB2 & EPUB Export
// @namespace   http://tampermonkey.net/
// @version     1.1.4
// @build       2025-12-28 15:08
// @description Download books from Ficbook in FB2 and EPUB formats
// @author      tsuki8neko
// @match       https://ficbook.net/readfic/*
// @grant       none
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/560470/Ficbook%20FB2%20%20EPUB%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/560470/Ficbook%20FB2%20%20EPUB%20Export.meta.js
// ==/UserScript==


;// ./src/core/getTitle.js
function getTitle() {
    return document.querySelector("h1.heading[itemprop='name']")?.innerText.trim() || "Фанфик";
}

;// ./src/core/getAuthors.js
function getAuthors() {
    const hat = document.querySelector(".fanfic-hat-body");
    const authorsNodes = hat.querySelectorAll(".creator-info .creator-username");
    return Array.from(authorsNodes).map(a => ({
        name: a.innerText.trim(),
        url: a.href
    }));
}

;// ./src/core/getMeta.js
function getExtraData() {
    const findBlock = (label) =>
        Array.from(document.querySelectorAll(".description .mb-10"))
            .find(n => n.querySelector("strong")?.innerText.includes(label));

    // --- ФЭНДОМ ---
    const fandomBlock = findBlock("Фэндом:");
    let fandom = fandomBlock
        ? Array.from(fandomBlock.querySelectorAll("a")).map(a => a.innerText.trim()).join(", ")
        : "";

    // // Фикс для ориджиналов — если фэндом пустой
    // if (!fandom || fandom.trim() === "") {
    //     // Ищем ссылку на ориджиналы
    //     const origLink = document.querySelector('a[href*="/fanfiction/no_fandom/originals"]');
    //     if (origLink) {
    //         fandom = origLink.innerText.trim(); // "Ориджиналы"
    //     } else {
    //         fandom = "Ориджинал"; // fallback на случай редких вариантов
    //     }
    // }

    // --- РАЗМЕР ---
    const sizeBlock = findBlock("Размер:");
    let size = "";
    if (sizeBlock) {
        const match = sizeBlock.innerText.match(/(\d[\d\s]*\d)\s*слов/);
        size = match ? match[1] : "";
    }

    // --- ТЕГИ ---
    const tagsNode = document.querySelector(".description .tags");
    const tags = tagsNode
        ? Array.from(tagsNode.querySelectorAll("a")).map(a => a.innerText.trim()).join(", ")
        : "";

    // --- ОПИСАНИЕ ---
    const description = document.querySelector(".description .js-public-beta-description")?.innerText.trim() || "";

    // --- ПРИМЕЧАНИЯ ---
    const notes = document.querySelector(".description .js-public-beta-author-comment")?.innerText.trim() || "";

    // --- ПУБЛИКАЦИЯ НА ДРУГИХ РЕСУРСАХ ---
    const otherPublicationBlock = findBlock("Публикация на других ресурсах:");
    const otherPublication = otherPublicationBlock
        ? otherPublicationBlock.innerText.trim()
        : "";

    return { fandom, size, tags, description, notes, otherPublication };
}

function getDirectionRatingStatus() {
    const direction = document.querySelector(".fanfic-badges .badge-with-icon.direction .badge-text")?.innerText.trim() || "";
    const rating = document.querySelector(".fanfic-badges .badge-with-icon[class*='badge-rating'] .badge-text")?.innerText.trim() || "";
    const status = document.querySelector(".fanfic-badges .badge-with-icon[class*='badge-status'] .badge-text")?.innerText.trim() || "";
    return { direction, rating, status };
}

;// ./src/utils/escapeXml.js
function escapeXml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

;// ./src/utils/textToParagraphs.js


function textToParagraphs(text) {
    return text.split(/\n+/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${escapeXml(line)}</p>`)
        .join("\n");
}

;// ./src/core/getChapter.js


async function getChapter(url) {
    let res = await fetch(url);
    let html = await res.text();
    let doc = new DOMParser().parseFromString(html, "text/html");

    let title = doc.querySelector(".title-area h2, .part-title h3")?.innerText.trim() || "Глава";

    // Удаляем дату на странице главы
    doc.querySelectorAll(".part-date").forEach(el => el.remove());

    // Удаляем дату и отзывы на странице содержания
    doc.querySelectorAll(".part-info").forEach(el => el.remove());

    let contentNode = doc.querySelector("#part_content");
    if (contentNode) {

        // Удаляем служебные элементы внутри текста
        contentNode.querySelectorAll(
            ".js-collapsible, .js-text-settings-collapse-button, .ad, .part-footer, .chapter-time, .text_settings, .tags"
        ).forEach(el => el.remove());

        // Удаляем заголовки внутри текста
        contentNode.querySelector("h1, h2, h3")?.remove();
    }

    let content = contentNode ? contentNode.innerText : "";

    return {
        title,
        plain: content.trim(),
        xhtml: textToParagraphs(content)
    };
}

;// ./src/utils/delay.js
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

;// ./src/utils/generateFileName.js
function sanitizeFilePart(str) {
    return str.replace(/\s+/g, "_").replace(/[\\/:*?"<>|]+/g, "");
}

function generateFileBaseName(mainAuthorName, title) {
    return `${sanitizeFilePart(mainAuthorName)}-_-${sanitizeFilePart(title)}`;
}

;// ./src/fb2/fb2Header.js



function buildFb2Header({
                                   title,
                                   mainAuthor,
                                   coauthors,
                                   direction,
                                   rating,
                                   size,
                                   status,
                                   tags,
                                   description,
                                   notes,
                                   otherPublication,
                                   fandom
                               }) {
    return `<?xml version="1.0" encoding="utf-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">
    <stylesheet type="text/css">
        .body{font-family : Verdana, Geneva, Arial, Helvetica, sans-serif;}
        .p{margin:0.5em 0 0 0.3em; padding:0.2em; text-align:justify;}
    </stylesheet>
    <description>
        <title-info>

            <author>
                <username>${escapeXml(mainAuthor.name)}</username>
                <first-name>${escapeXml(mainAuthor.name)}</first-name>
                <home-page>${escapeXml(mainAuthor.url)}</home-page>
            </author>

            <book-title>${escapeXml(title)}</book-title>

            <annotation>
                <p><strong>${escapeXml(title)}</strong> (${escapeXml(location.href)})</p>
                <p><strong>Направленность:</strong> ${escapeXml(direction)}</p>
                <p><strong>Автор:</strong> ${escapeXml(mainAuthor.name)} (${escapeXml(mainAuthor.url)})</p>
                ${coauthors ? `<p><strong>Соавторы:</strong> ${escapeXml(coauthors)}</p>` : ""}
                <p><strong>Фэндом:</strong> ${escapeXml(fandom || "")}</p>
                <p><strong>Рейтинг:</strong> ${escapeXml(rating)}</p>
                <p><strong>Размер:</strong> ${escapeXml(size)} слов</p>
                <p><strong>Статус:</strong> ${escapeXml(status)}</p>
                <p><strong>Метки:</strong> ${escapeXml(tags || "")}</p>
                <p><strong>Описание:</strong></p>
                ${textToParagraphs(description)}
                <p><strong>Примечания:</strong></p>
                ${textToParagraphs(notes)}
                <p><strong>Публикация на других ресурсах:</strong> ${escapeXml(otherPublication || "")}</p>
            </annotation>

            <date value="${new Date().toISOString().split("T")[0]}">${new Date().toLocaleDateString()}</date>
            <lang>ru</lang>

        </title-info>

        <document-info>
            <program-used>https://ficbook.net</program-used>
            <date value="${new Date().toISOString()}">${new Date().toLocaleString()}</date>
            <src-url>${escapeXml(location.href)}</src-url>
            <id>${Date.now()}</id>
        </document-info>
    </description>
`;
}

;// ./src/fb2/fb2Toc.js
function buildFb2Toc(tocEntries) {
    return `
<body name="toc">
    <section>
        <title><p>Оглавление</p></title>
        ${tocEntries.map(ch => `
        <p><a xlink:href="#${ch.id}">${ch.title}</a></p>
        `).join("")}
    </section>
</body>
`;
}

;// ./src/fb2/fb2Body.js
function buildFb2Body(fb2Chapters) {
    return `
<body>
${fb2Chapters}
</body>
</FictionBook>
`;
}

;// ./src/fb2/fb2Builder.js











async function createFB2(onProgress = () => {}, isCancelled = () => false) {
    const title = getTitle();
    const authors = getAuthors();
    if (!authors.length) {
        alert("Авторы не найдены, возможно, изменился HTML Ficbook.");
        return;
    }
    const mainAuthor = authors[0];
    const coauthors = authors.slice(1).map(a => a.name).join(", ");

    const { fandom, size, tags, description, notes, otherPublication } = getExtraData();
    const { direction, rating, status } = getDirectionRatingStatus();

    let fb2Header = buildFb2Header({
        title,
        mainAuthor,
        coauthors,
        direction,
        rating,
        size,
        status,
        tags,
        description,
        notes,
        otherPublication,
        fandom
    });

    let fb2Chapters = "";
    let tocEntries = [];
    let chapterIndex = 1;

    let rawChapters = Array.from(document.querySelectorAll(".list-of-fanfic-parts .part-link"))
        .filter(ch => {
            if (!ch.href) return false;
            if (ch.href.includes("/all-parts")) return false;
            let clean = ch.href.split("#")[0];
            let last = clean.split("/").pop();
            return /^\d+$/.test(last);
        });

    let chapters = [];
    let seen = new Set();
    for (let ch of rawChapters) {
        if (!seen.has(ch.href)) {
            seen.add(ch.href);
            chapters.push(ch);
        }
    }

    const total = chapters.length;

    for (let chapter of chapters) {

        if (isCancelled()) throw new Error("cancelled");

        onProgress(chapterIndex, total);

        if (isCancelled()) throw new Error("cancelled");

        await delay(800 + Math.random() * 700);

        if (isCancelled()) throw new Error("cancelled");

        let { title: chTitle, xhtml } = await getChapter(chapter.href);

        if (isCancelled()) throw new Error("cancelled");

        // НУМЕРАЦИЯ В ОГЛАВЛЕНИИ (теперь с •)
        tocEntries.push({
            id: `ch${chapterIndex}`,
            title: `•\u2003${chTitle}`
        });

        // НУМЕРАЦИЯ В ТЕКСТЕ FB2 (теперь с •)
        fb2Chapters += `
        <section id="ch${chapterIndex}">
            <title><p>•\u2003${chTitle}</p></title>
            ${xhtml}
        </section>`;


        chapterIndex++;
    }

    let fb2Toc = buildFb2Toc(tocEntries);
    let fb2Body = buildFb2Body(fb2Chapters);

    const baseName = generateFileBaseName(mainAuthor.name, title);
    const fileName = `${baseName}.fb2`;

    let blob = new Blob(
        [fb2Header + fb2Toc + fb2Body],
        { type: "text/xml" }
    );

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

;// ./src/epub/epubCss.js
const epubCss = `
body {
    margin: 0;
    padding: 0 8%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.6;
    font-size: 1em;
}
h1, h2, h3 {
    font-weight: 700;
    margin: 1.2em 0 0.6em;
}
h1 {
    font-size: 1.6em;
    text-align: center;
}
p {
    margin: 0.6em 0;
}
strong {
    font-weight: 700;
}
.title-page {
    margin-top: 20%;
    text-align: center;
}
.title-page h1 {
    font-size: 1.8em;
    margin-bottom: 0.4em;
}
.title-page h2 {
    font-size: 1.2em;
    margin-top: 0;
    color: #555;
}
.meta-block {
    margin-top: 2em;
    font-size: 0.9em;
    color: #555;
}
.meta-block p {
    margin: 0.2em 0;
}
`;

;// ./src/epub/epubTemplates.js



function buildTitlePage({
                                   title,
                                   mainAuthor,
                                   coauthors,
                                   direction,
                                   rating,
                                   size,
                                   status,
                                   tags,
                                   description,
                                   notes,
                                   otherPublication,
                                   fandom
                               }) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <title>${escapeXml(title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <div class="title-page">
        <h1>${escapeXml(title)}</h1>
        <h2>${escapeXml(mainAuthor.name)}</h2>

        <div class="meta-block">
            <p><strong>Направленность:</strong> ${escapeXml(direction)}</p>
            <p><strong>Автор:</strong> ${escapeXml(mainAuthor.name)}</p>
            ${coauthors ? `<p><strong>Соавторы:</strong> ${escapeXml(coauthors)}</p>` : ""}
            <p><strong>Фэндом:</strong> ${escapeXml(fandom)}</p>
            <p><strong>Рейтинг:</strong> ${escapeXml(rating)}</p>
            <p><strong>Размер:</strong> ${escapeXml(size)} слов</p>
            <p><strong>Статус:</strong> ${escapeXml(status)}</p>
            <p><strong>Метки:</strong> ${escapeXml(tags)}</p>
        </div>
    </div>

    <h2>Описание</h2>
    ${textToParagraphs(description)}

    ${notes ? `<h2>Примечания</h2>\n${textToParagraphs(notes)}` : ""}

    ${otherPublication ? `<h2>Публикация на других ресурсах</h2>\n<p>${escapeXml(otherPublication)}</p>` : ""}

</body>
</html>
`.trim();
}

function buildChapterPage(ch) {
    return `
<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <title>${escapeXml(ch.title)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <h1>${escapeXml(ch.title)}</h1>
    ${ch.content}
</body>
</html>
`.trim();
}

function buildTocXhtml(chapters) {
    const tocItems = chapters.map(ch => `
        <li><a href="${escapeXml(ch.file)}">${escapeXml(ch.title)}</a></li>
    `).join("\n");

    return `
<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <title>Оглавление</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <h1>Оглавление</h1>
    <ol>
        ${tocItems}
    </ol>
</body>
</html>
`.trim();
}

;// ./src/epub/epubOpf.js


function buildOpf({ title, mainAuthor, description, chapters }) {
    const now = new Date();
    const isoDate = now.toISOString().split("T")[0];

    const manifest = [
        `<item id="css" href="style.css" media-type="text/css"/>`,
        `<item id="titlepage" href="titlepage.xhtml" media-type="application/xhtml+xml"/>`,
        `<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml"/>`,
        ...chapters.map(ch =>
            `<item id="${ch.id}" href="${ch.file}" media-type="application/xhtml+xml"/>`
        ),
        `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`
    ].join("\n        ");

    const spine = [
        `<itemref idref="titlepage"/>`,
        `<itemref idref="toc"/>`,
        ...chapters.map(ch => `<itemref idref="${ch.id}"/>`)
    ].join("\n        ");

    return `
<?xml version="1.0" encoding="utf-8"?>
<package version="2.0"
    xmlns="http://www.idpf.org/2007/opf"
    unique-identifier="BookId">

        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
            <dc:title>${escapeXml(title)}</dc:title>
            <dc:creator>${escapeXml(mainAuthor.name)}</dc:creator>
            <dc:language>ru</dc:language>
            <dc:identifier id="BookId">urn:uuid:${Date.now()}</dc:identifier>
            <dc:date>${isoDate}</dc:date>
            <dc:subject>fiction</dc:subject>
            <dc:description>${escapeXml(description.slice(0, 500))}</dc:description>
            <meta name="source" content="${escapeXml(location.href)}"/>
        </metadata>
        <manifest>
            ${manifest}
        </manifest>
        <spine toc="ncx">
            ${spine}
        </spine>
    </package>
`.trim();
}

;// ./src/epub/epubNcx.js


function buildNcx(title, chapters) {
    const navPoints = chapters.map((ch, i) => `
        <navPoint id="navPoint-${i + 2}" playOrder="${i + 2}">
            <navLabel><text>${escapeXml(ch.title)}</text></navLabel>
            <content src="${ch.file}"/>
        </navPoint>
    `).join("\n");

    return `
<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/"
    version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle>
        <text>${escapeXml(title)}</text>
    </docTitle>
    <navMap>
        <navPoint id="navPoint-1" playOrder="1">
            <navLabel><text>Оглавление</text></navLabel>
            <content src="toc.xhtml"/>
        </navPoint>
        ${navPoints}
    </navMap>
</ncx>
`.trim();
}

;// ./src/epub/epubBuilder.js











/**
 * createEPUB(onProgress, isCancelled)
 *
 * onProgress(current, total) — вызывается перед загрузкой каждой главы
 * isCancelled() — функция, возвращающая true, если пользователь нажал "Остановить"
 */
async function createEPUB(onProgress = () => {}, isCancelled = () => false) {
    // JSZip loader
    if (!window.JSZip) {
        await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            s.onload = resolve;
            s.onerror = () => reject(new Error("Не удалось загрузить JSZip"));
            document.head.appendChild(s);
        });
    }

    const title = getTitle();
    const authors = getAuthors();
    if (!authors.length) {
        alert("Авторы не найдены, возможно, изменился HTML Ficbook.");
        return;
    }
    const mainAuthor = authors[0];
    const coauthors = authors.slice(1).map(a => a.name).join(", ");

    const { fandom, size, tags, description, notes, otherPublication } = getExtraData();
    const { direction, rating, status } = getDirectionRatingStatus();

    // ---------- СБОР СПИСКА ГЛАВ (как в FB2) ----------
    let rawChapters = Array.from(document.querySelectorAll(".list-of-fanfic-parts .part-link"))
        .filter(ch => {
            if (!ch.href) return false;
            if (ch.href.includes("/all-parts")) return false;
            let clean = ch.href.split("#")[0];
            let last = clean.split("/").pop();
            return /^\d+$/.test(last);
        });

    let chaptersList = [];
    let seen = new Set();
    for (let ch of rawChapters) {
        if (!seen.has(ch.href)) {
            seen.add(ch.href);
            chaptersList.push(ch);
        }
    }

    const total = chaptersList.length;
    const chapters = [];
    let index = 1;

    // ---------- ЗАГРУЗКА ГЛАВ ----------
    for (let chapter of chaptersList) {

        // Проверяем отмену ДО загрузки
        if (isCancelled()) throw new Error("cancelled");

        // Прогресс
        onProgress(index, total);

        // Проверяем отмену
        if (isCancelled()) throw new Error("cancelled");

        // Делаем задержку (как FB2)
        await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

        // Проверяем отмену
        if (isCancelled()) throw new Error("cancelled");

        // Загружаем главу
        let { title: chTitle, xhtml } = await getChapter(chapter.href);

        // Проверяем отмену
        if (isCancelled()) throw new Error("cancelled");

        chapters.push({
            id: `chapter${index}`,
            file: `chapter${index}.xhtml`,
            title: chTitle,
            content: xhtml
        });

        index++;
    }

    // ---------- СБОР EPUB ----------
    const zip = new JSZip();

    // mimetype
    zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

    // META-INF/container.xml
    zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0"
    xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf"
            media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`);

    // CSS
    zip.file("OEBPS/style.css", epubCss.trim());

    // Title page
    zip.file("OEBPS/titlepage.xhtml", buildTitlePage({
        title,
        mainAuthor,
        coauthors,
        direction,
        rating,
        size,
        status,
        tags,
        description,
        notes,
        otherPublication,
        fandom
    }));

    // Chapters
    chapters.forEach(ch => {
        zip.file(`OEBPS/${ch.file}`, buildChapterPage(ch));
    });

    // TOC XHTML
    zip.file("OEBPS/toc.xhtml", buildTocXhtml(chapters));

    // content.opf
    zip.file("OEBPS/content.opf", buildOpf({
        title,
        mainAuthor,
        description,
        chapters
    }));

    // toc.ncx
    zip.file("OEBPS/toc.ncx", buildNcx(title, chapters));

    // ---------- Генерация EPUB ----------
    const baseName = generateFileBaseName(mainAuthor.name, title);
    const fileName = `${baseName}.epub`;

    const blob = await zip.generateAsync({
        type: "blob",
        mimeType: "application/epub+zip"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

;// ./src/ui/buttons.js
function createButtons(createFB2, createEPUB) {
    // === ГЛОБАЛЬНЫЙ СЧЁТЧИК АКТИВНЫХ ЗАГРУЗОК ===
    let activeDownloads = 0;

    function updateStopButton() {
        stopBtn.style.display = activeDownloads > 0 ? "block" : "none";
    }

    const container = document.createElement("div");
    container.id = "ficbook-export-buttons";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "10000";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";

    function createButton(label, bgColor) {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.style.padding = "8px 12px";
        btn.style.borderRadius = "999px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.background = bgColor;
        btn.style.color = "#fff";
        btn.style.fontSize = "13px";
        btn.style.fontWeight = "600";
        btn.style.opacity = "0.9";
        btn.style.transition = "opacity 0.15s ease, transform 0.1s ease";
        return btn;
    }

    const fb2Btn = createButton("Скачать FB2", "#3b82f6");
    const epubBtn = createButton("Скачать EPUB", "#16a34a");
    const stopBtn = createButton("Остановить загрузку", "#dc2626");
    stopBtn.style.display = "none";

    // === ГЛОБАЛЬНАЯ ОТМЕНА ВСЕХ ЗАГРУЗОК ===
    let cancelCallbacks = [];

    stopBtn.onclick = () => {
        stopBtn.textContent = "Остановка...";
        cancelCallbacks.forEach(cb => cb());
        cancelCallbacks = [];
        activeDownloads = 0;
        updateStopButton();
    };

    // === ОБЁРТКА ДЛЯ ЗАПУСКА ЛЮБОЙ ЗАГРУЗКИ ===
    function runDownload(startFn, button, label) {
        let cancelled = false;

        // регистрируем отмену
        cancelCallbacks.push(() => cancelled = true);

        activeDownloads++;
        updateStopButton();

        button.disabled = true;
        button.textContent = label;

        startFn(
            (current, total) => {
                if (cancelled) throw new Error("cancelled");
                button.textContent = `${label}: Загружается глава ${current}/${total}`;
            },
            () => cancelled
        )
            .catch(err => {
                if (err.message === "cancelled") {
                    button.textContent = "Отменено";
                }
            })
            .finally(() => {
                // удаляем callback отмены
                cancelCallbacks = cancelCallbacks.filter(cb => cb !== (() => cancelled = true));

                activeDownloads--;
                updateStopButton();

                button.disabled = false;
                button.textContent = label;
                stopBtn.textContent = "Остановить загрузку";
            });
    }

    // FB2
    fb2Btn.onclick = () => {
        runDownload(createFB2, fb2Btn, "Скачать FB2");
    };

    // EPUB
    epubBtn.onclick = () => {
        runDownload(createEPUB, epubBtn, "Скачать EPUB");
    };

    container.appendChild(stopBtn);
    container.appendChild(fb2Btn);
    container.appendChild(epubBtn);
    document.body.appendChild(container);
}

;// ./src/main.js




function insertButtons() {
    if (!document.querySelector("#ficbook-export-buttons")) {
        console.log("Вставляем кнопки");
        createButtons(createFB2, createEPUB);
    }
}

// 1. Запускаем сразу
insertButtons();

// 2. Если DOM ещё не готов — подождём
document.addEventListener("DOMContentLoaded", insertButtons);

// 3. Подстраховка: если Ficbook перерисует страницу
const observer = new MutationObserver(insertButtons);
observer.observe(document.body, { childList: true, subtree: true });

