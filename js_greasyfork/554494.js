// ==UserScript==
// @name         ESJ轻小说下载器EPUB版 (带图片下载, 遵循网站简繁设置)
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  批量下载ESJ轻小说，并保存为带图片的EPUB文件，根据用户在网站上选择的简繁设置进行转换。
// @author       牛逼
// @connect      www.esjzone.cc
// @connect      images.novelpia.com
// @connect      *
// @match        https://www.esjzone.cc/detail/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_info
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/554494/ESJ%E8%BD%BB%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8EPUB%E7%89%88%20%28%E5%B8%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%2C%20%E9%81%B5%E5%BE%AA%E7%BD%91%E7%AB%99%E7%AE%80%E7%B9%81%E8%AE%BE%E7%BD%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554494/ESJ%E8%BD%BB%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8EPUB%E7%89%88%20%28%E5%B8%A6%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%2C%20%E9%81%B5%E5%BE%AA%E7%BD%91%E7%AB%99%E7%AE%80%E7%B9%81%E8%AE%BE%E7%BD%AE%29.meta.js
// ==/UserScript==

let OpenCC_Converter = null;
let Download_Errors = "";
function ConsoleError() {
  console.error(arguments);
  Download_Errors += "\n" + Array.from(arguments).join(" ");
  return arguments.length;
}

/* global JSZip, saveAs, OpenCC */
(function () {
  "use strict";

  // === Constants ===
  const NOVEL_ID = window.location.pathname.match(/\/detail\/(\d+)/)?.[1];
  if (!NOVEL_ID) return;

  // === EPUB Templates ===
  const EPUB_TEMPLATES = {
    MIMETYPE: "application/epub+zip",
    CONTAINER:
      '<?xml version="1.0"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n  <rootfiles>\n    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n  </rootfiles>\n</container>',
  };

  /**
   * 根据全局设置有条件地进行简繁转换。
   */
  function conditionalConvert(text) {
    if (OpenCC_Converter !== null) {
      return OpenCC_Converter(text);
    }
    return text;
  }

  /**
   * Generates the chapter HTML content.
   */
  function createChapterHtml(chapterTitle, chapterContent, resourceInputs) {
    const lang = document.documentElement.lang;
    if (lang === null) lang = "zh-CN";
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
    <title>${chapterTitle}</title>
    ${resourceInputs}
</head>
<body>
    <h2 class="title">${chapterTitle}</h2>
    <div class="main-content">
        ${chapterContent}
    </div>
</body>
</html>`;
  }

  /**
   * Generates the content.opf file.
   * ADDED: allResources parameter for CSS manifest items.
   */
  function createContentOpf(
    novelTitle,
    novelAuthor,
    chapters,
    allImages,
    allResources
  ) {
    const date = new Date().toISOString().split("T")[0];
    const uniqueId =
      "urn:uuid:" +
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    const manifestItems = chapters
      .map(
        (c, i) =>
          `<item id="chapter${i + 1}" href="chapter${
            i + 1
          }.html" media-type="application/xhtml+xml"/>`
      )
      .join("\n    ");

    const imageManifest = allImages
      .map((img) => {
        const ext = img.fileName.split(".").pop().toLowerCase();
        const mime =
          ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : ext === "png"
            ? "image/png"
            : "image/jpeg";
        return `<item id="${img.id}" href="${img.fileName}" media-type="${mime}"/>`;
      })
      .join("\n    ");

    // NEW: Resource manifest for CSS files
    const resourceManifest = allResources
      .map((res) => {
        // 假设这里只处理 text/css 资源
        return `<item id="${res.id}" href="${res.fileName}" media-type="${res.type}"/>`;
      })
      .join("\n    ");

    const spineItems = chapters
      .map((c, i) => `<itemref idref="chapter${i + 1}"/>`)
      .join("\n    ");

    // 标题和作者使用条件转换
    const convertedTitle = conditionalConvert(novelTitle);
    const convertedAuthor = conditionalConvert(novelAuthor);

    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="pub-id">${uniqueId}</dc:identifier>
    <dc:title>${convertedTitle}</dc:title>
    <dc:language>zh-CN</dc:language>
    <dc:creator id="creator">${convertedAuthor}</dc:creator>
    <meta property="file-as" refines="#creator">${convertedAuthor}</meta>
    <dc:contributor id="contributor">ESJ下载器 Userscript</dc:contributor>
    <meta property="file-as" refines="#contributor">ESJ下载器</meta>
    <meta property="dcterms:modified">${date}T00:00:00Z</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${manifestItems}
    ${imageManifest}
    ${resourceManifest} 
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;
  }

  /**
   * Generates the toc.ncx file.
   */
  function createTocNcx(novelTitle, chapters) {
    const navPoints = chapters
      .map(
        (c, i) =>
          `<navPoint id="navpoint-${i + 1}" playOrder="${i + 1}">
      <navLabel>
        <text>${conditionalConvert(c.title)}</text>
      </navLabel>
      <content src="chapter${i + 1}.html"/>
    </navPoint>`
      )
      .join("\n    ");

    const convertedTitle = conditionalConvert(novelTitle);

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${convertedTitle}</text>
  </docTitle>
  <navMap>
    ${navPoints}
  </navMap>
</ncx>`;
  }

  // === Fetching & Extraction Helpers ===

  function fetchResource(url, responseType = "text", headers = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: responseType,
        headers: headers,
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.response);
          } else {
            reject(
              `Error fetching ${url}: Status ${response.status} (${response.statusText})`
            );
          }
        },
        onerror: function (error) {
          reject(
            `Network error fetching ${url}: ${
              error.message || JSON.stringify(error)
            }`
          );
        },
      });
    });
  }

  /**
   * Extracts novel content from the chapter HTML and processes images and other resources.
   * ADDED: resourceMap parameter and CSS handling logic.
   */
  function extractAndProcessContent(chapterHtml, imageMap, resourceMap) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(chapterHtml, "text/html");
    const contentDiv = doc.querySelector(".forum-content");

    if (!contentDiv) {
      ConsoleError("Could not find .forum-content div.");
      return {
        content: "<p>内容提取失败，请检查章节页面结构是否变化。</p>",
        imagePromises: [],
        resourcePromises: [], // NEW
      };
    }

    const imagePromises = [];
    const resourcePromises = []; // NEW

    // 1. NEW: 处理 CSS 资源 (<link rel="stylesheet">)
    const $links = doc.querySelectorAll('link[rel="stylesheet"]');
    let resourceCounter = resourceMap.size;

    $links.forEach(($link) => {
      const originalUrl = $link.href;
      if (!originalUrl) {
        return;
      }

      if (resourceMap.has(originalUrl)) {
        // 如果已处理，直接替换链接并跳过下载
        const resourceInfo = resourceMap.get(originalUrl);
        $link.href = `${resourceInfo.fileName}`;
        return;
      }

      resourceCounter++;
      // 使用 style_1.css 作为本地文件名，便于区分
      const localFileName = `styles/style_${resourceCounter}.css`;
      const resourceId = `style${resourceCounter}`;

      resourceMap.set(originalUrl, {
        data: null,
        fileName: localFileName,
        id: resourceId,
        url: originalUrl,
        status: "pending",
        type: "text/css",
      });

      // 替换链接，使其指向 EPUB 内部文件 (注意：link 元素在 head 中，但我们会先处理它)
      $link.href = localFileName;

      // 下载 CSS 内容 (responseType 默认为 text)
      const resourcePromise = fetchResource(originalUrl, "text")
        .then((text) => {
          const info = resourceMap.get(originalUrl);
          info.data = text;
          info.status = "success";
          resourceMap.set(originalUrl, info);
        })
        .catch((error) => {
          const info = resourceMap.get(originalUrl);
          info.status = "failed";
          resourceMap.set(originalUrl, info);
          ConsoleError(`CSS 资源下载失败: ${originalUrl}`, error);
        });

      resourcePromises.push(resourcePromise);
    });

    // 2. 处理图片资源 (原逻辑)
    const $images = contentDiv.querySelectorAll("img");
    let imageCounter = imageMap.size;

    $images.forEach(($img) => {
      const originalUrl = $img.src;
      if (!originalUrl) {
        return;
      }

      if (imageMap.has(originalUrl)) {
        const imageInfo = imageMap.get(originalUrl);
        $img.src = imageInfo.fileName;
        return;
      }

      imageCounter++;
      const urlParts = originalUrl.split("/");
      const originalFileName = urlParts[urlParts.length - 1].split("?")[0];
      const ext = originalFileName.includes(".")
        ? originalFileName.split(".").pop()
        : "jpg";
      const localFileName = `images/img_${imageCounter}.${ext}`;
      const imageId = `img${imageCounter}`;

      imageMap.set(originalUrl, {
        data: null,
        fileName: localFileName,
        id: imageId,
        url: originalUrl,
        status: "pending",
      });

      $img.src = localFileName;
      $img.setAttribute("epub:type", "pagebreak");

      const imageHeaders = {
        Referer: window.location.origin + "/",
      };

      const imagePromise = fetchResource(
        originalUrl,
        "arraybuffer",
        imageHeaders
      )
        .then((arrayBuffer) => {
          const info = imageMap.get(originalUrl);
          info.data = arrayBuffer;
          info.status = "success";
          imageMap.set(originalUrl, info);
        })
        .catch((error) => {
          const info = imageMap.get(originalUrl);
          info.status = "failed";
          imageMap.set(originalUrl, info);
          ConsoleError(`图片下载失败: ${originalUrl}`, error);
        });

      imagePromises.push(imagePromise);
    });

    let contentHtml = contentDiv.innerHTML;

    // 清理内容
    contentHtml = contentHtml.replace(
      /^(\s*<p><br><\/p>\s*)+|(\s*<p><br><\/p>\s*)+$/g,
      ""
    );
    contentHtml = contentHtml.replace(/style="[^"]*"/g, "");

    // 简繁转换
    contentHtml = conditionalConvert(contentHtml);

    return {
      content: contentHtml,
      imagePromises: imagePromises,
      resourcePromises: resourcePromises,
    };
  }

  // === Main Logic ===

  /**
   * Main download process
   */
  async function batchDownload() {
    // 简繁体设置逻辑 (保持不变)
    const activeSwitch = document.querySelector(".trans.active");
    if (activeSwitch) {
      const dataEncode = activeSwitch.getAttribute("data-encode");
      if (dataEncode === "1") {
        OpenCC_Converter = OpenCC.Converter({ from: "t", to: "cn" });
      } else if (dataEncode === "2") {
        OpenCC_Converter = OpenCC.Converter({ from: "cn", to: "t" });
      } else {
        OpenCC_Converter = null;
      }
    }

    if (
      !confirm(
        "确定开始批量下载并生成带图片的EPUB文件吗？\n\n注意：下载带图片和外部CSS的小说可能需要较长时间，请耐心等待。"
      )
    ) {
      return;
    }

    Download_Errors = "";

    const $status = document.getElementById("batch-download-button");
    $status.textContent = "下载中 (0%)";
    $status.disabled = true;

    try {
      // 1. 获取小说标题和作者 (保持不变)
      const novelTitleElement = document.querySelector("h2.p-t-10.text-normal");
      const novelTitle = novelTitleElement
        ? novelTitleElement.textContent.trim()
        : "未知书名";

      const authorListItem = document.querySelector("ul.book-detail li strong");
      let novelAuthor = "未知作者";

      if (authorListItem && authorListItem.textContent.includes("作者:")) {
        const authorAnchor = authorListItem.parentElement.querySelector("a");
        if (authorAnchor) {
          novelAuthor = authorAnchor.textContent.trim();
        }
      } else {
        const genericAuthorAnchor = document.querySelector(
          'ul.book-detail li a[href*="/tags/"]'
        );
        if (genericAuthorAnchor) {
          novelAuthor = genericAuthorAnchor.textContent.trim();
        }
      }

      // 2. 获取章节列表 (保持不变)
      const $chapterLinks = document.querySelectorAll(
        '#integration a[href*="/forum/"]'
      );

      if ($chapterLinks.length === 0) {
        alert("未找到章节链接！");
        $status.textContent = "批量下载";
        $status.disabled = false;
        return;
      }

      const chapters = Array.from($chapterLinks)
        .map(($a, index) => {
          const titleElement = $a.querySelector("p") || $a;
          let title = titleElement.textContent.trim();
          return {
            id: index + 1,
            title: title,
            url: $a.href,
            content: null,
          };
        })
        .filter((c) => c.title);

      // 3. 顺序获取章节内容并处理图片/CSS资源
      const imageMap = new Map();
      const resourceMap = new Map(); // NEW: CSS 资源映射
      let allImagePromises = [];
      let allResourcePromises = []; // NEW: CSS 资源 Promises
      const totalChapters = chapters.length;

      for (let i = 0; i < totalChapters; i++) {
        const chapter = chapters[i];
        $status.textContent = `下载章节 (${i + 1}/${totalChapters})`;

        const html = await fetchResource(chapter.url, "text");

        // UPDATED: 传递 resourceMap
        const result = extractAndProcessContent(html, imageMap, resourceMap);
        chapter.content = result.content;
        allImagePromises = allImagePromises.concat(result.imagePromises);
        allResourcePromises = allResourcePromises.concat(
          result.resourcePromises
        ); // NEW
      }

      // 4. 下载所有图片和 CSS 资源 (并发执行)
      const allDownloadPromises = allImagePromises.concat(allResourcePromises); // NEW

      if (allDownloadPromises.length > 0) {
        $status.textContent = `下载资源 (0/${
          imageMap.size + resourceMap.size
        })`;
        const updateProgress = () => {
          const finishedCount =
            Array.from(imageMap.values()).filter(
              (img) => img.status !== "pending"
            ).length +
            Array.from(resourceMap.values()).filter(
              (res) => res.status !== "pending"
            ).length;
          $status.textContent = `下载资源 (${finishedCount}/${
            imageMap.size + resourceMap.size
          })`;
        };
        const interval = setInterval(updateProgress, 1000);
        await Promise.allSettled(allDownloadPromises);
        clearInterval(interval);
        updateProgress();
      }

      const validChapters = chapters.filter(
        (c) => c.content !== null && c.content.length > 0
      );
      const successfulImages = Array.from(imageMap.values()).filter(
        (img) => img.status === "success" && img.data
      );
      // NEW: 过滤成功的 CSS 资源
      const successfulResources = Array.from(resourceMap.values()).filter(
        (res) => res.status === "success" && res.data
      );

      if (validChapters.length === 0) {
        alert("所有章节内容获取失败，无法生成EPUB文件。");
        $status.textContent = "批量下载";
        $status.disabled = false;
        return;
      }

      // 5. 生成 EPUB 结构 (使用 JSZip)
      $status.textContent = "生成EPUB...";
      const zip = new JSZip();
      zip.file("mimetype", EPUB_TEMPLATES.MIMETYPE, { compression: "STORE" });
      zip.file("META-INF/container.xml", EPUB_TEMPLATES.CONTAINER);
      const OEBPS = zip.folder("OEBPS");

      let resourceInputs = "";
      resourceMap.values().forEach((res) => {
        resourceInputs += `    <link rel="stylesheet" type="text/css" href="${res.fileName}"/>\n`;
      });

      validChapters.forEach((chapter, index) => {
        const fileName = `chapter${index + 1}.html`;
        const convertedTitle = conditionalConvert(chapter.title);
        const htmlContent = createChapterHtml(
          convertedTitle,
          chapter.content,
          resourceInputs
        );
        OEBPS.file(fileName, htmlContent);
      });

      successfulImages.forEach((img) => {
        OEBPS.file(img.fileName, img.data, { binary: true });
      });

      // NEW: 打包所有成功的 CSS 资源
      successfulResources.forEach((res) => {
        OEBPS.file(res.fileName, res.data); // CSS 是文本数据
      });

      // UPDATED: 传递 successfulResources
      const contentOpf = createContentOpf(
        novelTitle,
        novelAuthor,
        validChapters,
        successfulImages,
        successfulResources
      );
      const tocNcx = createTocNcx(novelTitle, validChapters);

      OEBPS.file("content.opf", contentOpf);
      OEBPS.file("toc.ncx", tocNcx);

      // 6. 生成 Blob 并下载 (保持不变)
      zip
        .generateAsync(
          {
            type: "blob",
            mimeType: "application/epub+zip",
            compression: "STORE",
          },
          function update(metadata) {
            $status.textContent = `生成EPUB (${metadata.percent.toFixed(2)}%)`;
          }
        )
        .then(function (content) {
          const cleanTitle = conditionalConvert(novelTitle).replace(
            /[\\/:*?"<>|]/g,
            "_"
          );
          const fileName = `${cleanTitle}.epub`;

          saveAs(content, fileName);

          $status.textContent = "下载完成";
          setTimeout(() => {
            $status.textContent = "批量下载";
            $status.disabled = false;
          }, 3000);

          if (Download_Errors) {
            alert(
              `EPUB 生成完成，但在下载过程中出现一些错误，请检查控制台以获取详细信息。${Download_Errors}`
            );
          }
        })
        .catch(function (error) {
          console.error("EPUB 生成或下载失败:", error);
          alert(
            `EPUB 生成或下载失败，请检查控制台错误信息。错误: ${
              error.message || error
            }`
          );
          $status.textContent = "批量下载";
          $status.disabled = false;
        });
    } catch (e) {
      console.error("批量下载失败:", e);
      alert(`批量下载失败: ${e.message}`);
      $status.textContent = "批量下载";
      $status.disabled = false;
    }
  }

  // === Initialization (保持不变) ===

  function init() {
    // 1. 注入样式
    GM_addStyle(`
            #batch-download-button {
                color: #fff !important;
                background-color: #007bff !important; /* Blue color */
                border-color: #007bff !important;
            }
            #batch-download-button:hover {
                background-color: #0056b3 !important;
                border-color: #004085 !important;
            }
        `);

    // 2. 找到按钮容器
    const spButtonsDiv = document
      .getElementById("integration")
      ?.querySelector(".sp-buttons.mb-3");

    if (spButtonsDiv) {
      // 3. 创建新的 '批量下载' 按钮
      const downloadButton = document.createElement("button");
      downloadButton.id = "batch-download-button";
      downloadButton.className = "btn btn-primary m-r-10";
      downloadButton.innerHTML = '<i class="icon-download"></i>批量下载';

      // 4. 绑定点击事件
      downloadButton.addEventListener("click", batchDownload);

      // 5. 插入按钮
      const gotoForumButton = spButtonsDiv.querySelector(
        'a[href*="/forum/"][href*=".html"]:not([data-book])'
      );

      if (gotoForumButton) {
        gotoForumButton.after(downloadButton);
      } else {
        spButtonsDiv.appendChild(downloadButton);
      }
    }
  }

  // 等待页面加载完成
  window.addEventListener("load", init);
})();
