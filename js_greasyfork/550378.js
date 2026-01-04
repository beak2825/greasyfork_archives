// ==UserScript==
// @name         文泉学堂保护装置
// @namespace    http://tampermonkey.net/
// @version      2025-11-27
// @description  把文泉学堂的书籍下载成 PDF 文件。
// @author       RebelPotato
// @match        https://lib-tsinghua.wqxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wqxuetang.com
// @require      https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550378/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E4%BF%9D%E6%8A%A4%E8%A3%85%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/550378/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E4%BF%9D%E6%8A%A4%E8%A3%85%E7%BD%AE.meta.js
// ==/UserScript==
// This is free and unencumbered software released into the public domain.
// For more information, please refer to <https://unlicense.org/>

const vault = {};
vault.log = console.log;
const aCanvas = document.createElement("canvas");
const aCtx = aCanvas.getContext("2d");
vault.drawImage = Object.getPrototypeOf(aCtx).drawImage;

window.revert = () => {
  console.log = vault.log;
  Object.getPrototypeOf(aCtx).drawImage = vault.drawImage;
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadPage(page, scale) {
  page.scrollIntoView({ behavior: "smooth" });

  let imgs;
  const now = Date.now();
  while (1) {
    imgs = [...page.getElementsByClassName("plg")[0].childNodes];
    if (imgs.length >= 6) break;
    await sleep(500 * (1 + Math.random()));
    window.scrollBy(0, window.innerHeight * 0.1 * (Math.random() - 0.3));
  }
  await sleep(1000 * (1 + Math.random()));
  const elapsed = Date.now() - now;
  vault.log(`Page loaded in ${elapsed.toFixed(1)}s.`);
  await sleep(elapsed * 0.5 * (1 + Math.random()) * 3); // advanced technique to avoid detection
  page.scrollIntoView({ behavior: "smooth" });

  const data = imgs.map((img) => ({
    img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    left: parseFloat(img.style.left.slice(0, -2)),
  }));
  data.sort((a, b) => a.left - b.left);
  let currentOffset = 0;
  data.forEach((item) => {
    item.offset = currentOffset;
    currentOffset += item.width;
  });
  const imgWidth = currentOffset;
  const imgHeight = Math.max(...data.map((d) => d.height));

  vault.log(`Page size: ${imgWidth}x${imgHeight}, preparing canvas...`);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgWidth * scale;
  canvas.height = imgHeight * scale;
  const drawImage = vault.drawImage.bind(ctx);
  for (const d of data) {
    drawImage(d.img, d.offset * scale, 0, d.width * scale, d.height * scale);
  }

  return {
    width: canvas.width,
    height: canvas.height,
    url: canvas.toDataURL("image/webp", 1),
  };
}

window.dl = async function (start, end, scale = 1.0) {
  revert();
  vault.log(`Downloading pages [${start}, ${end}) with scale ${scale}.`);
  const { jsPDF } = window.jspdf;
  // get page count
  const pb = document.getElementById("pb");
  let pages = [...pb.childNodes].filter(
    (e) => e instanceof HTMLDivElement && e.hasAttribute("index")
  );
  pages = pages.slice(start, end);

  let doc;
  for (let i = 0; i < pages.length; i++) {
    vault.log(`Processing page ${i + 1}/${pages.length}`);
    const img = await downloadPage(pages[i], scale);
    vault.log(
      `Adding page ${i + 1}/${pages.length}: ${img.width}x${img.height}`
    );
    if (!doc) doc = new jsPDF({ format: [img.width, img.height], unit: "px" });
    else doc.addPage([img.width, img.height]);
    doc.addImage(img.url, "WEBP", 0, 0, img.width, img.height);
  }

  const title = document.querySelector(".read-header-name").innerText;
  vault.log(`Saving PDF: as ${title}.pdf`);
  doc.save(title + ".pdf");
};
window.dl_scale = 1.0;

GM_registerMenuCommand("Download", (ev) => {
  const input = prompt("Enter page range (e.g., 1-10):", "1-10");
  const [start, end] = input.split("-").map((x) => parseInt(x.trim()));
  if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
    alert("Invalid page range.");
    return;
  }
  alert(
    `Starting download from page ${start} to ${end} with scale ${window.dl_scale}.`
  );
  window.dl(start - 1, end, window.dl_scale);
});

GM_registerMenuCommand("Set Scale", (ev) => {
  const input = prompt(
    "Enter scale factor (e.g., 1.0 for original size, 0.5 for half size):",
    window.dl_scale.toString()
  );
  const scale = parseFloat(input);
  if (isNaN(scale) || scale <= 0) {
    alert("Invalid scale factor.");
    return;
  }
  window.dl_scale = scale;
  alert(`Scale factor set to ${window.dl_scale}.`);
});
