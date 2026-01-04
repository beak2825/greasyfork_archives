// ==UserScript==
// @name         Google Classroom - Show Inline Attachments
// @namespace    https://example.com/userscripts
// @license      MIT
// @version      1.0
// @description  Show post attachments inline in the Classroom stream (adds a materials block inside each post)
// @author       @krispy-snacc (https://github.com/krispy-snacc)
// @match        https://classroom.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557995/Google%20Classroom%20-%20Show%20Inline%20Attachments.user.js
// @updateURL https://update.greasyfork.org/scripts/557995/Google%20Classroom%20-%20Show%20Inline%20Attachments.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const mimemap = {
        "application/acad": ["AutoCAD", "generic", 701, 2],
        "application/bzip2": ["Compressed archive", "archive", 781, 2],
        "application/dxf": ["AutoCAD", "generic", 702, 2],
        "application/epub+zip": ["EPUB", "generic", 703, 2],
        "application/gzip": ["Compressed archive", "archive", 771, 2],
        "application/gzip-compressed": [
            "Compressed archive",
            "archive",
            782,
            2,
        ],
        "application/gzipped": ["Compressed archive", "archive", 783, 2],
        "application/illustrator": ["Adobe Illustrator", "generic", 762, 2],
        "application/javascript": ["Javascript", "text", 741, 1],
        "application/msexcel": ["Microsoft Excel", "excel", 768, 1],
        "application/mspowerpoint": [
            "Microsoft PowerPoint",
            "powerpoint",
            767,
            1,
        ],
        "application/msword": ["Microsoft Word", "word", 704, 1],
        "application/octet-stream": ["Binary", "generic", 705, 2],
        "application/pdf": ["PDF", "pdf", 706, 3],
        "application/photoshop": ["Adobe Photoshop", "image", 744, 1],
        "application/pkcs7-signature": ["PKCS7 signature", "generic", 707, 2],
        "application/postscript": ["PostScript", "generic", 708, 2],
        "application/rar": ["Compressed archive", "archive", 772, 2],
        "application/rtf": ["Rich text", "text", 709, 1],
        "application/tar": ["Compressed archive", "archive", 773, 2],
        "application/vnd.android.package-archive": [
            "Android Package",
            "generic",
            710,
            2,
        ],
        "application/vnd.google-apps.appmaker": [
            "Google App Maker",
            "generic",
            798,
            2,
        ],
        "application/vnd.google-apps.document": [
            "Google Docs",
            "document",
            711,
            1,
        ],
        "application/vnd.google-apps.drawing": [
            "Google Drawings",
            "drawing",
            712,
            1,
        ],
        "application/vnd.google-apps.drive-sdk.796396377186": [
            "Google My Maps",
            "map",
            788,
            1,
        ],
        "application/vnd.google-apps.drive-sdk.770102487694": [
            "Google Earth",
            "earth",
            716,
            1,
        ],
        "application/vnd.google-apps.earth": ["Google Earth", "earth", 806, 1],
        "application/vnd.google-apps.flix": ["Google Vids", "vid", 813, 1],
        "application/vnd.google-apps.folder": [
            "Google Drive Folder",
            "folder",
            745,
            1,
        ],
        "application/vnd.google-apps.form": ["Google Forms", "form", 713, 2],
        "application/vnd.google-apps.freebird": [
            "Google Forms",
            "form",
            746,
            2,
        ],
        "application/vnd.google-apps.fusiontable": [
            "Google Fusion Tables",
            "fusion",
            764,
            1,
        ],
        "application/vnd.google-apps.jam": [
            "Google Jamboard",
            "generic",
            799,
            2,
        ],
        "application/vnd.google-apps.kix": ["Google Docs", "document", 747, 1],
        "application/vnd.google-apps.mail-layout": [
            "Email layout",
            "mail_layout",
            811,
            1,
        ],
        "application/vnd.google-apps.map": ["Google My Maps", "map", 789, 1],
        "application/vnd.google-apps.presentation": [
            "Google Slides",
            "presentation",
            714,
            1,
        ],
        "application/vnd.google-apps.punch": [
            "Google Slides",
            "presentation",
            748,
            1,
        ],
        "application/vnd.google-apps.ritz": [
            "Google Sheets",
            "spreadsheet",
            765,
            1,
        ],
        "application/vnd.google-apps.scenes": ["Google Vids", "vid", 814, 1],
        "application/vnd.google-apps.script": [
            "Google Apps Script",
            "script",
            766,
            1,
        ],
        "application/vnd.google-apps.shortcut": [
            "Google Drive shortcut",
            "shortcut",
            805,
            1,
        ],
        "application/vnd.google-apps.drive-sdk.107985930432": [
            "Google Sites",
            "site",
            804,
            1,
        ],
        "application/vnd.google-apps.drive-sdk.803534686002": [
            "Google Sites",
            "site",
            803,
            1,
        ],
        "application/vnd.google-apps.drive-sdk.897606708560": [
            "Google Sites",
            "site",
            763,
            1,
        ],
        "application/vnd.google-apps.site": ["Google Sites", "site", 797, 1],
        "application/vnd.google-apps.spreadsheet": [
            "Google Sheets",
            "spreadsheet",
            715,
            1,
        ],
        "application/vnd.google-apps.video": ["Google Video", "video", 742, 1],
        "application/vnd.google-apps.vid": ["Google Vids", "vid", 815, 1],
        "application/vnd.google-apps.project": [
            "Google Workbook",
            "generic",
            817,
            1,
        ],
        "application/vnd.google-earth.kmz": [
            "Google Earth Pro",
            "earth",
            807,
            1,
        ],
        "application/vnd.google.colaboratory": [
            "Google Colab",
            "colaboratory",
            801,
            1,
        ],
        "application/vnd.google.colaboratory.corp": [
            "Google Colab",
            "colaboratory",
            802,
            1,
        ],
        "application/vnd.google-gemini.gem": ["Gemini Gem", "generic", 816, 2],
        "application/vnd.google-gsuite.document-blob": [
            "Encrypted Google Docs",
            "generic",
            808,
            1,
        ],
        "application/vnd.google-gsuite.encrypted": [
            "Client-side encrypted",
            "generic",
            812,
            2,
        ],
        "application/vnd.google-gsuite.presentation-blob": [
            "Encrypted Google Slides",
            "generic",
            809,
            1,
        ],
        "application/vnd.google-gsuite.spreadsheet-blob": [
            "Encrypted Google Sheets",
            "generic",
            810,
            1,
        ],
        "application/vnd.ms-excel": ["Microsoft Excel", "excel", 717, 1],
        "application/vnd.ms-excel.sheet.binary.macroenabled.12": [
            "Microsoft Excel",
            "excel",
            749,
            1,
        ],
        "application/vnd.ms-excel.sheet.macroenabled.12": [
            "Microsoft Excel",
            "excel",
            750,
            1,
        ],
        "application/vnd.ms-excel.template.macroenabled.12": [
            "Microsoft Excel",
            "excel",
            791,
            1,
        ],
        "application/vnd.ms-powerpoint": [
            "Microsoft PowerPoint",
            "powerpoint",
            718,
            1,
        ],
        "application/vnd.ms-powerpoint.presentation.macroenabled.12": [
            "Microsoft PowerPoint",
            "powerpoint",
            751,
            1,
        ],
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12": [
            "Microsoft PowerPoint",
            "powerpoint",
            752,
            1,
        ],
        "application/vnd.ms-powerpoint.template.macroenabled.12": [
            "Microsoft PowerPoint",
            "powerpoint",
            753,
            1,
        ],
        "application/vnd.ms-project": ["Microsoft Project", "generic", 719, 2],
        "application/vnd.ms-word": ["Microsoft Word", "generic", 769, 2],
        "application/vnd.ms-word.document.macroenabled.12": [
            "Microsoft Word",
            "word",
            758,
            1,
        ],
        "application/vnd.ms-word.template.macroenabled.12": [
            "Microsoft Word",
            "word",
            790,
            1,
        ],
        "application/vnd.ms-works": ["Microsoft Works", "generic", 720, 2],
        "application/vnd.ms-xpsdocument": ["Microsoft XPS", "generic", 721, 2],
        "application/vnd.oasis.opendocument.graphics": [
            "OpenOffice Draw",
            "generic",
            761,
            2,
        ],
        "application/vnd.oasis.opendocument.presentation": [
            "OpenOffice Impress",
            "powerpoint",
            760,
            1,
        ],
        "application/vnd.oasis.opendocument.spreadsheet": [
            "OpenOffice Calc",
            "excel",
            722,
            1,
        ],
        "application/vnd.oasis.opendocument.text": [
            "OpenOffice Writer",
            "word",
            757,
            1,
        ],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            ["Microsoft PowerPoint", "powerpoint", 724, 1],
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
            ["Microsoft PowerPoint", "powerpoint", 754, 1],
        "application/vnd.openxmlformats-officedocument.presentationml.template":
            ["Microsoft PowerPoint", "powerpoint", 755, 1],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            "Microsoft Excel",
            "excel",
            759,
            1,
        ],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
            ["Microsoft Excel", "excel", 792, 1],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            ["Microsoft Word", "word", 723, 1],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
            ["Microsoft Word", "word", 756, 1],
        "application/vnd.visio": ["Microsoft Visio", "generic", 725, 2],
        "application/x-7z-compressed": [
            "Compressed archive",
            "generic",
            726,
            2,
        ],
        "application/x-bzip": ["Compressed archive", "archive", 774, 2],
        "application/x-bzip-compressed-tar": [
            "Compressed archive",
            "archive",
            775,
            2,
        ],
        "application/x-bzip2": ["Compressed archive", "archive", 776, 2],
        "application/x-dosexec": ["Unknown", "generic", 795, 2],
        "application/x-gtar": ["Compressed archive", "archive", 784, 2],
        "application/x-gtar-compressed": [
            "Compressed archive",
            "archive",
            785,
            2,
        ],
        "application/x-gunzip": ["Compressed archive", "archive", 786, 2],
        "application/x-font-ttf": ["TrueType font", "generic", 727, 2],
        "application/x-gzip": ["Compressed archive", "archive", 728, 2],
        "application/x-gzip-compressed": [
            "Compressed archive",
            "archive",
            777,
            2,
        ],
        "application/x-httpd-php": ["PHP", "generic", 729, 2],
        "application/x-iwork-keynote-sffkey": [
            "iWork Keynote",
            "generic",
            730,
            2,
        ],
        "application/x-iwork-numbers-sffnumbers": [
            "iWork Numbers",
            "generic",
            731,
            2,
        ],
        "application/x-iwork-pages-sffpages": [
            "iWork Pages",
            "generic",
            732,
            2,
        ],
        "application/x-javascript": ["Javascript", "text", 743, 1],
        "application/vnd.google-apps.drive-sdk.7081045131": [
            "Lucidchart",
            "generic",
            800,
            2,
        ],
        "application/x-lzh": ["Compressed archive", "generic", 733, 2],
        "application/x-ms-publisher": [
            "Microsoft Publisher",
            "generic",
            734,
            2,
        ],
        "application/x-ms-shortcut": ["Windows shortcut", "generic", 735, 2],
        "application/x-ms-wmz": ["Windows Media Player", "generic", 736, 2],
        "application/x-msdos-program": ["Unknown", "generic", 793, 2],
        "application/x-msi": ["Unknown", "generic", 796, 2],
        "application/x-rar": ["Compressed archive", "archive", 770, 2],
        "application/x-rar-compressed": [
            "Compressed archive",
            "generic",
            737,
            2,
        ],
        "application/x-shockwave-flash": ["Adobe Flash", "generic", 738, 2],
        "application/x-tar": ["Compressed archive", "archive", 778, 2],
        "application/x-tgz": ["Compressed archive", "archive", 787, 2],
        "application/x-tex": ["LaTeX", "generic", 739, 2],
        "application/x-zip": ["Compressed archive", "archive", 779, 2],
        "application/x-zip-compressed": [
            "Compressed archive",
            "archive",
            780,
            2,
        ],
        "application/xml": ["Unknown", "generic", 794, 2],
        "application/zip": ["Compressed archive", "archive", 740, 2],
        "audio/3gp": ["Audio", "audio", 107, 1],
        "audio/flac": ["Audio", "audio", 110, 1],
        "audio/m4a": ["Audio", "audio", 111, 1],
        "audio/midi": ["Audio", "audio", 101, 1],
        "audio/mp3": ["Audio", "audio", 112, 1],
        "audio/mp4a-latm": ["Audio", "audio", 102, 1],
        "audio/mpeg": ["Audio", "audio", 103, 1],
        "audio/mpeg3": ["Audio", "audio", 104, 1],
        "audio/ogg": ["Audio", "audio", 108, 1],
        "audio/x-ms-wma": ["Audio", "audio", 105, 1],
        "audio/x-wav": ["Audio", "audio", 106, 1],
        "audio/wav": ["Audio", "audio", 109, 1],
        "image/bmp": ["Image", "image", 301, 1],
        "image/gif": ["Image", "image", 302, 1],
        "image/heic": ["Image", "image", 329, 1],
        "image/heif": ["Image", "image", 330, 1],
        "image/jpeg": ["Image", "image", 303, 1],
        "image/png": ["Image", "image", 304, 1],
        "image/svg+xml": ["Image", "image", 309, 1],
        "image/tiff": ["Image", "image", 305, 1],
        "image/vnd.adobe.photoshop": ["Image", "image", 326, 1],
        "image/vnd.dwg": ["Image", "image", 306, 1],
        "image/vnd.microsoft.icon": ["Image", "image", 327, 1],
        "image/x-adobe-dng": ["Image", "image", 310, 1],
        "image/x-canon-cr2": ["Raw image", "image", 311, 1],
        "image/x-canon-crw": ["Raw image", "image", 312, 1],
        "image/x-coreldraw": ["Image", "image", 307, 1],
        "image/x-fuji-raf": ["Raw image", "image", 313, 1],
        "image/x-icon": ["Image", "image", 328, 1],
        "image/x-kodak-kdc": ["Raw image", "image", 314, 1],
        "image/x-minolta-mrw": ["Raw image", "image", 315, 1],
        "image/x-nikon-nef": ["Raw image", "image", 317, 1],
        "image/x-nikon-nrw": ["Raw image", "image", 318, 1],
        "image/x-olympus-orf": ["Raw image", "image", 319, 1],
        "image/x-panasonic-rw2": ["Raw image", "image", 320, 1],
        "image/x-pentax-pef": ["Raw image", "image", 321, 1],
        "image/x-photoshop": ["Adobe Photoshop", "image", 308, 1],
        "image/x-ms-bmp": ["Image", "image", 316, 1],
        "image/x-sony-sr2": ["Raw image", "image", 323, 1],
        "image/x-sony-srf": ["Raw image", "image", 324, 1],
        "image/x-raw": ["Raw image", "image", 322, 1],
        "image/webp": ["Image", "image", 325, 1],
        "multipart/x-gzip": ["Compressed archive", "archive", 1001, 2],
        "multipart/x-rar": ["Compressed archive", "archive", 1002, 2],
        "multipart/x-tar": ["Compressed archive", "archive", 1005, 2],
        "multipart/x-zip": ["Compressed archive", "archive", 1003, 2],
        "multipart/zip": ["Compressed archive", "archive", 1004, 2],
        "text/calendar": ["Calendar", "text", 501, 1],
        "text/css": ["CSS", "text", 502, 1],
        "text/csv": ["CSV", "text", 503, 1],
        "text/ecmascript": ["ECMAScript", "text", 515, 1],
        "text/html": ["HTML", "text", 504, 1],
        "text/javascript": ["Javascript", "text", 516, 1],
        "text/plain": ["Text", "text", 505, 1],
        "text/vcard": ["vCard", "text", 520, 1],
        "text/x-c++hdr": ["C++", "text", 518, 1],
        "text/x-c++src": ["C++", "text", 507, 1],
        "text/x-chdr": ["C", "text", 517, 1],
        "text/x-csrc": ["C", "text", 506, 1],
        "text/x-hwp": ["Hangul", "text", 508, 1],
        "text/x-java": ["Java", "text", 509, 1],
        "text/x-java-source": ["Java", "text", 510, 1],
        "text/x-objcsrc": ["Objective-C", "text", 511, 1],
        "text/x-sql": ["SQL", "text", 512, 1],
        "text/x-url": ["URL", "text", 519, 1],
        "text/x-vcard": ["vCard", "text", 513, 1],
        "text/xml": ["XML", "text", 514, 1],
        "video/3gpp": ["Video", "video", 601, 1],
        "video/avi": ["Video", "video", 602, 1],
        "video/dv": ["Video", "video", 619, 1],
        "video/flv": ["Video", "video", 603, 1],
        "video/mkv": ["Video", "video", 622, 1],
        "video/mp2p": ["Video", "video", 618, 1],
        "video/mp2t": ["Video", "video", 617, 1],
        "video/mp4": ["Video", "video", 604, 1],
        "video/mpeg": ["Video", "video", 605, 1],
        "video/mpv": ["Video", "video", 616, 1],
        "video/ogg": ["Video", "video", 615, 1],
        "video/quicktime": ["Video", "video", 606, 1],
        "video/webm": ["Video", "video", 614, 1],
        "video/x-dv": ["Video", "video", 613, 1],
        "video/x-flv": ["Adobe Flash", "video", 607, 1],
        "video/x-m4v": ["Video", "video", 610, 1],
        "video/x-matroska": ["Video", "video", 612, 1],
        "video/x-ms-asf": ["Video", "video", 611, 1],
        "video/x-ms-wmv": ["Windows Media Player", "video", 608, 1],
        "video/x-msvideo": ["Video", "video", 609, 1],
        "video/x-shockwave-flash": ["Adobe Flash", "video", 620, 1],
        "video/x-youtube": ["YouTube", "youtube", 621, 2],
        "chemical/x-gamess-input": ["Chemical Model", "generic", 201, 2],
        "gzip/document": ["Compressed archive", "archive", 1101, 2],
        "message/rfc822": ["Message", "message", 401, 1],
        "link/article": ["Article", "generic", 8, 1],
        "model/gltf-binary": ["GLB", "model", 1201, 1],
    };

    const INLINE_CLASS = "n8F6Jd-gc-inline-materials";
    const ATTACH_LINK_CLASS = "gc-inline-attach-link";
    const PROCESSED_ATTR = "data-gc-inline-processed";

    // Track inserted elements to re-insert if removed
    const insertedElements = new Map();

    function getClassId() {
        const url = window.location.href;
        const match = url.match(/\/c\/([^\/]+)/);
        return match ? match[1] : null;
    }

    function getUserId() {
        const url = window.location.href;
        const match = url.match(/\/u\/(\d+)\//);
        return match ? match[1] : "0";
    }

    // Fetch attachments for a post using the same Classroom batchexecute RPC
    async function fetchPostAttachments(postId, classId, userId) {
        // postId is base64 encoded by caller, classId is already base64 from URL
        const postIdDecoded = atob(postId);
        const classIdDecoded = atob(classId);

        const body =
            "f.req=%5B%5B%5B%22tQShAc%22%2C%22%5B%5B%5B%5C%22" +
            encodeURIComponent(postIdDecoded) +
            "%5C%22%2C%5B%5C%22" +
            encodeURIComponent(classIdDecoded) +
            "%5C%22%5D%5D%5D%2C%5B%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2Cnull%2Cnull%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=" +
            encodeURIComponent(window.IJ_values[42]);

        try {
            const res = await fetch(
                "https://classroom.google.com/u/" +
                    userId +
                    "/_/ClassroomUi/data/batchexecute?rpcids=tQShAc&source-path=%2Fu%2F" +
                    userId +
                    "%2Fc%2F" +
                    classId +
                    "%2Fm%2F" +
                    postId +
                    "%2Fdetails&soc-app=1&soc-platform=1&soc-device=1&rt=c",
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type":
                            "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    referrer: "https://classroom.google.com/",
                    body: body,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            );

            const text = await res.text();
            const lines = text.split("\n");
            if (lines.length < 4) return [];

            const cleaned = lines[3];
            const parsed = JSON.parse(JSON.parse(cleaned)[0][2]);
            const data = parsed[1][0][2];
            const attachments =
                (data &&
                    data[data.length - 1] &&
                    data[data.length - 1][0] &&
                    data[data.length - 1][0][7]) ||
                [];

            return attachments.map(function (a) {
                return {
                    name: a[0],
                    fileId: a[2],
                    viewUrl: a[6],
                    previewUrl: a[5],
                    attId: a[17],
                    downloadUrl:
                        "https://drive.google.com/uc?export=download&id=" +
                        a[2] +
                        "&authuser=" +
                        userId,
                    mime: a[4] || "",
                    mimeD:
                        a[4] in mimemap
                            ? mimemap[a[4]]
                            : ["Unknown", "generic", 1],
                };
            });
        } catch (e) {
            console.error("[GC Inline] fetchPostAttachments error", e);
            return [];
        }
    }

    // Helper function to create element with attributes
    function createElement(tag, attrs, children) {
        const el = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach((key) => {
                if (key === "className") {
                    el.className = attrs[key];
                } else {
                    el.setAttribute(key, attrs[key]);
                }
            });
        }
        if (children) {
            children.forEach((child) => {
                if (typeof child === "string") {
                    el.appendChild(document.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
        }
        return el;
    }

    // Create an inline attachments block and append to the post's material container
    function renderInlineAttachments(postEl, attachments) {
        if (!attachments || attachments.length === 0) return;
        if (postEl.querySelector("." + INLINE_CLASS)) return; // already added

        const extIcons = {
            pdf: { icon: "icon_12_pdf_list.png", retina: "icon_3_pdf_x32.png" },
            document: {
                icon: "icon_1_document_x16.png",
                retina: "icon_1_document_x32.png",
            },
            image: {
                icon: "con_1_image_x16.png",
                retina: "icon_1_image_x32.png",
            },
            word: {
                icon: "icon_1_word_x16.png",
                retina: "icon_1_word_x32.png",
            },
            text: {
                icon: "icon_1_text_x16.png",
                retina: "icon_1_text_x32.png",
            },
            spreadsheet: {
                icon: "icon_1_spreadsheet_x16.png",
                retina: "icon_1_spreadsheet_x32.png",
            },
            form: {
                icon: "icon_2_form_x16.png",
                retina: "icon_2_form_x32.png",
            },
            audio: {
                icon: "icon_1_audio_x16.png",
                retina: "icon_1_audio_x32.png",
            },
        };

        // Build attachment elements using DOM methods
        const attachmentEls = attachments.map((a) => {
            const ext = (a.name || "").split(".").pop();
            const extImgUrl =
                "https://ssl.gstatic.com/docs/doclist/images/mediatype/" +
                `icon_${a.mimeD[3]}_${a.mimeD[1]}_x32.png`;
            const previewSrc = a.previewUrl
                ? a.previewUrl.slice(0, -7) + "=w105-h70-c"
                : "";

            return createElement(
                "div",
                {
                    className: "luto0c",
                    jsaction:
                        "click:LWntbc(HrdP0);error:dyBsCf(q4uQmd);JIbuQc:Rsbfue(Rsbfue);FzgWvd:MvKmtd",
                    "data-attachment-id": a.attId,
                },
                [
                    createElement(
                        "a",
                        {
                            className: "VkhHKd e7EEH nQaZq",
                            target: "_blank",
                            "aria-label": `Attachment: ${a.mimeD[0]}: ${a.name}`,
                            href: a.viewUrl,
                            jsname: "HrdP0",
                        },
                        [
                            createElement("div", { className: "DAnlhb" }),
                            createElement("div", { className: "gM4mlb" }),
                            createElement(
                                "div",
                                { className: "rzTfPe xSP5ic" },
                                [
                                    createElement("img", {
                                        src: extImgUrl,
                                        "aria-hidden": "true",
                                        role: "presentation",
                                        "data-iml": performance
                                            .now()
                                            .toString(),
                                    }),
                                ]
                            ),
                            createElement(
                                "div",
                                { className: "lIHx8b YVvGBb asQXV" },
                                [a.name]
                            ),
                        ]
                    ),
                    createElement(
                        "div",
                        { className: "pOf0gc QRiHXd M4LFnf" },
                        [
                            createElement(
                                "div",
                                { className: "riU7le FHXi2c" },
                                [
                                    createElement(
                                        "a",
                                        {
                                            className:
                                                "vwNuXe JkIgWb QRiHXd yixX5e",
                                            target: "_blank",
                                            "aria-label": `Attachment: ${a.mimeD[0]}: ${a.name}`,
                                            jsname: "HrdP0",
                                            href: a.viewUrl,
                                            title: a.name,
                                            "data-focus-id":
                                                "hSRGPd-" + a.attId,
                                        },
                                        [
                                            createElement(
                                                "div",
                                                { className: "MM30Lb" },
                                                [
                                                    createElement(
                                                        "div",
                                                        {
                                                            className:
                                                                "A6dC2c QDKOcc UtdKPb U0QIdc",
                                                        },
                                                        [a.name]
                                                    ),
                                                    createElement(
                                                        "div",
                                                        {
                                                            className:
                                                                "cSyPgb WInaFd QRiHXd",
                                                        },
                                                        [
                                                            createElement(
                                                                "div",
                                                                {
                                                                    className:
                                                                        "QRiHXd",
                                                                },
                                                                [
                                                                    createElement(
                                                                        "div",
                                                                        {
                                                                            className:
                                                                                "kRYv9b YVvGBb",
                                                                        },
                                                                        [
                                                                            a
                                                                                .mimeD[0],
                                                                        ]
                                                                    ),
                                                                ]
                                                            ),
                                                        ]
                                                    ),
                                                ]
                                            ),
                                            createElement(
                                                "div",
                                                {
                                                    className:
                                                        "bxp7vf bHOAdb Niache",
                                                },
                                                [
                                                    createElement("img", {
                                                        "aria-hidden": "true",
                                                        role: "presentation",
                                                        jsname: "q4uQmd",
                                                        src: previewSrc,
                                                        "data-mime-type":
                                                            a.mime,
                                                        "data-iml": performance
                                                            .now()
                                                            .toString(),
                                                    }),
                                                ]
                                            ),
                                        ]
                                    ),
                                ]
                            ),
                            createElement("div", { className: "QRiHXd" }),
                        ]
                    ),
                    createElement("div", {
                        jsaction: "rcuQ6b:rcuQ6b;JIbuQc:C6gOHd",
                        jscontroller: "DOfqJe",
                    }),
                ]
            );
        });

        // Create container for attachments
        const materialsContainer = createElement(
            "div",
            {
                className: "D7N6he bIICf MlZb9c d3aYgd",
                jscontroller: "Ni7LHb",
                jsaction:
                    "rcuQ6b:rcuQ6b;uwjiC:rcuQ6b;KtPeHe:rcuQ6b;IKzbTb:rcuQ6b;wuANJc:.CLIENT",
                jsname: "C2Qrw",
                "data-parent-id": "N2jS6b",
                "data-mode": "4",
                "data-exclude-cover-photo": "true",
                "data-copies-only": "false",
                "data-link-destination": "1",
                "data-show-originality-analyses": "false",
                "data-show-cover-photo-settings": "false",
                "data-forms-only": "false",
                "data-read-only": "false",
            },
            attachmentEls
        );

        // Create wrapper
        const wrapper = createElement(
            "div",
            {
                className: `bIICf dEODdf rhFKgc ${INLINE_CLASS}`,
                jsname: "UYewLd",
            },
            [
                createElement("div", {
                    jsaction: "rcuQ6b:rcuQ6b;KtPeHe:rcuQ6b;wuANJc:rcuQ6b",
                    className: "VOnHJ",
                    jscontroller: "TPuMf",
                    "data-parent-id": "N2jS6b",
                    jsname: "C2Qrw",
                }),
                materialsContainer,
                createElement("div", {
                    className: "D7N6he bIICf MlZb9c d3aYgd",
                    jscontroller: "Z2vwzc",
                    jsaction:
                        "rcuQ6b:rcuQ6b;uwjiC:rcuQ6b;wuANJc:rcuQ6b;voP7ud:rcuQ6b;nK3Vsc:hVCa3c;n7J2fb:GDCStd;IKzbTb:rcuQ6b;YCR7Tc:STeVHc",
                    jsmodel: "ibOfOb",
                    jsname: "C2Qrw",
                    "data-mode": "4",
                    "data-material-parent-id": "N2jS6b",
                }),
            ]
        );

        // Wrap in n8F6Jd container
        const outerContainer = createElement("div", { className: "n8F6Jd" }, [
            createElement(
                "div",
                {
                    jsaction:
                        "rcuQ6b:rcuQ6b;URgETb:rcuQ6b;uwjiC:rcuQ6b;ZQcBrc:rcuQ6b;wuANJc:.CLIENT;nK3Vsc:.CLIENT",
                    className: "sVNOQ",
                    jscontroller: "yP6Lwf",
                    jsmodel: "N2jS6b hGbFme BrMJ0e",
                    "data-is-edit-mode": "false",
                    "data-filter": "0",
                    "data-material-parent-id": "N2jS6b",
                    "data-stream-item-id": postEl.getAttribute(
                        "data-stream-item-id"
                    ),
                    "data-include-stream-item-materials": "true",
                },
                [
                    wrapper,
                    createElement("div", {
                        jsname: "QkPyvd",
                        className: "",
                        style: "display: none;",
                    }),
                ]
            ),
        ]);

        // Mark container to prevent Incremental DOM from removing it
        outerContainer.__gcInlineInjected = true;
        outerContainer.setAttribute("data-gc-injected", "true");

        // Insert into the post - should find .n4xnA element
        const insertTarget = postEl.querySelector(".n4xnA");
        if (insertTarget) {
            const postId = postEl.getAttribute("data-stream-item-id");

            // Remove any existing element for this post first
            if (insertedElements.has(postId)) {
                const oldElement = insertedElements.get(postId).element;
                if (oldElement && oldElement.parentNode) {
                    oldElement.remove();
                }
            }

            // Use requestAnimationFrame to batch DOM updates and reduce flickering
            requestAnimationFrame(() => {
                insertTarget.appendChild(outerContainer);

                // Track this element
                insertedElements.set(postId, {
                    element: outerContainer,
                    target: insertTarget,
                    postEl: postEl,
                });
            });
        } else {
            console.warn(
                "[GC Inline] .n4xnA element not found in post",
                postEl
            );
        }
    }

    async function addInlineForPost(postEl) {
        try {
            const postId = postEl.getAttribute("data-stream-item-id");
            if (!postId) return;
            const classId = getClassId();
            const userId = getUserId();
            if (!classId) return;

            const encodedPostId = btoa(postId);
            // classId from URL is already base64 encoded
            const encodedClassId = classId;

            const attachments = await fetchPostAttachments(
                encodedPostId,
                encodedClassId,
                userId
            );
            renderInlineAttachments(postEl, attachments);

            // Mark as processed
            postEl.setAttribute(PROCESSED_ATTR, "true");
        } catch (e) {
            console.error("[GC Inline] addInlineForPost error", e);
        }
    }

    function scanAndInject() {
        const posts = document.querySelectorAll(
            "div[data-include-stream-item-materials][data-stream-item-id]:not([" +
                PROCESSED_ATTR +
                "])"
        );

        if (posts.length === 0) return;

        // Disconnect observer to prevent triggering during our modifications
        observer.disconnect();

        posts.forEach(function (p) {
            // skip if already has inline block
            if (p.querySelector("." + INLINE_CLASS)) {
                p.setAttribute(PROCESSED_ATTR, "true");
                return;
            }

            // Don't inject if materials already exist on the page
            const hasMaterials = p.querySelector('a[jsname="HrdP0"], .D7N6he');
            if (hasMaterials) {
                p.setAttribute(PROCESSED_ATTR, "true");
                return;
            }

            // Fire and forget per post
            addInlineForPost(p);
        });

        // Reconnect observer after a short delay to let DOM settle
        setTimeout(() => {
            observer.observe(document.body, { childList: true, subtree: true });
        }, 100);
    }

    // Observe DOM for new posts
    const observer = new MutationObserver(function (mutations) {
        // Only scan if mutations include new posts being added
        let shouldScan = false;
        for (const mutation of mutations) {
            if (
                mutation.type === "childList" &&
                mutation.addedNodes.length > 0
            ) {
                for (const node of mutation.addedNodes) {
                    // Check if added node or its children contain stream items
                    if (node.nodeType === 1) {
                        // Element node
                        if (
                            node.hasAttribute?.("data-stream-item-id") ||
                            node.querySelector?.("[data-stream-item-id]")
                        ) {
                            shouldScan = true;
                            break;
                        }
                    }
                }
            }
            if (shouldScan) break;
        }

        if (shouldScan) {
            scanAndInject();
        }
    });

    // Persistent watcher to re-insert removed elements
    const reinsertWatcher = new MutationObserver(() => {
        insertedElements.forEach((data, postId) => {
            const { element, target, postEl } = data;

            // Check if element was removed
            if (element && !document.body.contains(element)) {
                // Check if target still exists
                if (target && document.body.contains(target)) {
                    // Re-insert
                    requestAnimationFrame(() => {
                        target.appendChild(element);
                    });
                } else {
                    // Target is gone, remove from tracking
                    insertedElements.delete(postId);
                }
            }
        });
    });

    // Start
    scanAndInject();
    observer.observe(document.body, { childList: true, subtree: true });
    reinsertWatcher.observe(document.body, { childList: true, subtree: true });

    console.log("[GC Inline] Initialized");
})();
