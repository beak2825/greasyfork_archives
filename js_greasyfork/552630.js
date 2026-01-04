// ==UserScript==
// @name        mechacomic.jp ripper
// @namespace   adrian
// @match       https://mechacomic.jp/viewer/index.html*
// @grant       none
// @version     1.0
// @author      adrian
// @grant       GM_registerMenuCommand
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @license MIT
// @description no
// @downloadURL https://update.greasyfork.org/scripts/552630/mechacomicjp%20ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/552630/mechacomicjp%20ripper.meta.js
// ==/UserScript==

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

async function createDecryptFunc(keyHex) {
  const key = await window.crypto.subtle.importKey(
    "raw",
    fromHexString(keyHex),
    "AES-CBC",
    false,
    ["decrypt"]
  );
  return async (raw) => {
    const data = {
      cipherText: raw.slice(16),
      iv: raw.slice(0, 16),
    };
    return await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: data.iv },
      key,
      data.cipherText
    );
  };
}

function toPng(webp) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = URL.createObjectURL(new Blob([webp]));
    image.crossOrigin = "anonymous";
    image.onload = (e) => {
      canvas.width = image.width;
      canvas.height = image.height;
      URL.revokeObjectURL(e.target.src);
      context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          resolve(data);
        },
        "image/png",
        100
      );
    };
    image.onerror = (e) => reject(e);
  });
}

const downloadImages = async () => {
  const progressBar = document.createElement("div");
  progressBar.id = "dl-progress";
  progressBar.textContent = "Starting...";
  progressBar.style.padding = "20px";
  progressBar.style.backgroundColor = "black";
  progressBar.style.borderRadius = "10px";
  progressBar.style.border = "1px solid white";
  progressBar.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
  progressBar.style.position = "fixed";
  progressBar.style.left = "50%";
  progressBar.style.top = "50%";
  progressBar.style.transform = "translate(-50%,-50%)";
  progressBar.style.zIndex = "9999";
  progressBar.style.fontSize = "20px";
  progressBar.style.color = "white";
  document.body.appendChild(progressBar);

  const params = new URLSearchParams(window.location.search);
  const metadata = JSON.parse(decodeURIComponent(params.get("chapter")));
  const imageListPath = params.get("contents_page");
  const keyPath = params.get("cryptokey");
  const dir = params.get("directory");
  const key = await fetch(keyPath).then((t) => t.text());
  const apiData = await fetch(imageListPath).then((t) => t.json());
  const images = apiData.pages.map((image) => {
    const imageOptions = apiData.images[image.image];
    const path = imageOptions.find((o) => o.format === "webp").src;
    return `${dir}${path}`;
  });

  console.log(images);
  progressBar.textContent = `${images.length} images found.`;
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
    bufferedWrite: true,
  });
  const decrypt = await createDecryptFunc(key);
  let progress = 1;
  await Promise.all(
    images.map(async (image, i) => {
      const response = await fetch(image);
      if (!response.ok) {
        progressBar.textContent = `failed to fetch image ${i + 1}/${
          images.length
        }`;
        throw new Error("Failed to fetch image");
      }
      const arrayBuffer = await response.arrayBuffer();
      const decryptedData = await decrypt(new Uint8Array(arrayBuffer));
      zipWriter.add(
        `${i + 1}.png`,
        new zip.BlobReader(await toPng(decryptedData)),
        {}
      );
      progressBar.textContent = `fetched and decrypted image ${progress}/${images.length}`;
      console.log("done with ", i + 1);
    })
  );
  console.log("image fetching done. generating zip");
  progressBar.textContent = "image fetching done. generating zip";
  const blobURL = URL.createObjectURL(await zipWriter.close());
  const link = document.createElement("a");
  link.href = blobURL;
  link.download = `${metadata.name || document.title}.zip`;
  link.click();
  progressBar.textContent = "done.";
  setTimeout(() => progressBar.remove(), 1000);
};

const updateButton = () => {
  console.log("loading");
  let dlButton = document.body.querySelector("#dl-button");
  if (!dlButton) {
    dlButton = document.createElement("button");
    dlButton.id = "dl-button";
    dlButton.textContent = "Download";
    dlButton.style.padding = "5px 12px";
    dlButton.style.backgroundColor = "#ef0029";
    dlButton.style.borderRadius = "8px";
    dlButton.style.border = "3px solid #000";
    dlButton.style.boxShadow = "0 4px 0 #000";
    dlButton.style.position = "fixed";
    dlButton.style.right = "5px";
    dlButton.style.bottom = "5px";
    dlButton.style.zIndex = "9999";
    dlButton.style.fontSize = ".75rem";
    dlButton.style.fontWeight = "800";
    dlButton.style.color = "white";
    dlButton.addEventListener("click", () => downloadImages());
    document.body.appendChild(dlButton);
  }
};

updateButton();

VM.shortcut.register("cm-s", downloadImages);
VM.shortcut.enable();

GM_registerMenuCommand("Download Images (Ctrl/Cmd + S)", () =>
  downloadImages()
);
