// ==UserScript==
// @name         poipiku图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从poipiku下载图片，需要先输入密码
// @author       shadows
// @include      /^https://poipiku\.com/\d+/\d+\.html/
// @icon         http://poipiku.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.6.61/dist/zip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550572/poipiku%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/550572/poipiku%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

    'use strict';
GM_registerMenuCommand("下载",clickButton);
async function clickButton(event) {
    event.stopPropagation();
    event.preventDefault();
    const name = document.querySelector("h2.IllustItemUserName >a").text;
    const images = document.querySelectorAll('.IllustItemThubExpand img.IllustItemThumbImg');
    const targetLength = images.length.toString().length;
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    let imagesData = [];
        images.forEach((img, idx) =>imagesData.push({url: img.src.replace(/_640\.jpg$/, ''),filename: `${(idx + 1).toString().padStart(targetLength,'0')}.jpg`,zipWriter: zipWriter}));
    await asyncPool(10, imagesData, imageWorker);
    const zipFile = await zipWriter.close();
    saveBlob(zipFile , `${name}.zip`);
}

async function imageWorker(item) {
    let image = await getBlobFromUrl(item.url);
    console.log(`${item.filename} have downloaded.`);
    //item.zip.file(item.filename, image);
    await item.zipWriter.add(item.filename, new zip.BlobReader(image));
}
/**
 * @param poolLimit 并发控制数 (>= 1)
 * @param array 参数数组
 * @param iteratorFn 异步任务，返回 promise 或是 async 方法
 * https://www.luanzhuxian.com/post/60c2c548.html
 */
function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0
    const ret = [] // Promise.all(ret) 的数组
    const executing = []
    const enqueue = function() {
        // array 遍历完，进入 Promise.all 流程
        if (i === array.length) {
            return Promise.resolve()
        }

        // 每调用一次 enqueue，就初始化一个 promise，并放入 ret 队列
        const item = array[i++]
        const p = Promise.resolve().then(() => iteratorFn(item, array))
        ret.push(p)

        // 插入 executing 队列，即正在执行的 promise 队列，并且 promise 执行完毕后，会从 executing 队列中移除
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e)

        // 每当 executing 数组中 promise 数量达到 poolLimit 时，就利用 Promise.race 控制并发数，完成的 promise 会从 executing 队列中移除，并触发 Promise.race 也就是 r 的回调，继续递归调用 enqueue，继续 加入新的 promise 任务至 executing 队列
        let r = Promise.resolve()
        if (executing.length >= poolLimit) {
            r = Promise.race(executing)
        }

        // 递归，链式调用，直到遍历完 array
        return r.then(() => enqueue())
    }

    return enqueue().then(() => Promise.all(ret))
}

function saveBlob(content,name) {
    const fileUrl = window.URL.createObjectURL(content);
    const anchorElement = document.createElement('a');
    anchorElement.href = fileUrl;
    anchorElement.download = name;
    anchorElement.style.display = 'none';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    anchorElement.remove();
    window.URL.revokeObjectURL(fileUrl);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const xmlHttpRequest = (typeof(GM_xmlhttpRequest) === 'undefined') ? GM.xmlHttpRequest : GM_xmlhttpRequest;
function getBlobFromUrl(url) {
    return new Promise((resolve, reject) => {
        xmlHttpRequest({
            method: "GET",
            url: url,
            responseType: "blob", // 返回 blob 类型
            headers: {
                "Cookie": document.cookie
            },
            onload: function(response) {
                resolve(response.response);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}