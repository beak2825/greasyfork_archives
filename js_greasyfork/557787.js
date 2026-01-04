// ==UserScript==
// @name         B站视频、直播、音乐解析
// @namespace    Eruru
// @version      1.0.4
// @description  获取视频、直播直链，下载音乐
// @author       Eruru
// @match        https://www.bilibili.com/video/*
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/audio/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.slim.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557787/B%E7%AB%99%E8%A7%86%E9%A2%91%E3%80%81%E7%9B%B4%E6%92%AD%E3%80%81%E9%9F%B3%E4%B9%90%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/557787/B%E7%AB%99%E8%A7%86%E9%A2%91%E3%80%81%E7%9B%B4%E6%92%AD%E3%80%81%E9%9F%B3%E4%B9%90%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href
    const liveRegex = /https:\/\/live\.bilibili\.com\/([0-9]+?)(?=\/|\?|$)/
    if(url.startsWith("https://live.bilibili.com/") && !liveRegex.test(url)){
        return
    }
    const panel = $(`<div style="z-index:999;background-color:white;top:64px;left:0px;position:fixed;font-size:16px;margin:0px;padding:0px;">`)
    $("body").append(panel)
    const topElement = $("<div>")
    panel.append(topElement)
    const button = $(`<button style="font-size:12px;width:28px;height:20px;padding:0px;margin:0px;">解析</button>`)
    topElement.append(button)
    const showButton = $(`<button style="font-size:12px;width:28px;height:20px;padding:0px;margin:0px;">收起</button>`)
    topElement.append(showButton)
    const resultElement = $(`<div style="overflow:auto;height:calc(100vh - 64px - 20px - 30px)">`)
    panel.append(resultElement)
    showButton.click(()=>{
        if(showButton.text()==="收起") {
            showButton.text("展开")
            resultElement.hide()
            return
        }
        showButton.text("收起")
        resultElement.show()
    })
    showButton.hide()
    resultElement.hide()
    $(window).scroll(function() {
        if($(this).scrollTop()===0){
            panel.show()
            return
        }
        panel.hide()
    })
    button.click(async () => {
        try{
            showButton.hide()
            resultElement.hide()
            const url = window.location.href
            if(url.startsWith("https://live.bilibili.com/")){
                const id = url.match(liveRegex)[1]
                console.log(`room id`, id)
                const response = await axios({
                    url:"https://api.live.bilibili.com/room/v1/Room/playUrl",
                    params:{
                        cid:id,
                        platform:"h5",
                        qn:10000
                    }
                })
                console.log(`room id ${id} response`, response)
                const responseUrl = response.data.data.durl[0].url
                console.log(`room id ${id} url`, responseUrl)
                navigator.clipboard.writeText(responseUrl)
                await notifyAsync("已复制到剪贴板")
                return
            }
            if(url.startsWith("https://www.bilibili.com/audio/")){
                const id = url.match(/https:\/\/www\.bilibili\.com\/audio\/au(.+?)(?=\/|\?|$)/)[1]
                console.log(`auid`, id)
                let response = await axios({
                    url:"https://www.bilibili.com/audio/music-service-c/web/song/info",
                    params:{
                        sid:id
                    }
                })
                console.log(`auid ${id} response`, response)
                const title = response.data.data.title
                console.log(`auid ${id} title`, title)
                response = await axios({
                    url:"https://www.bilibili.com/audio/music-service-c/web/url",
                    params:{
                        sid:id
                    }
                })
                console.log(`auid ${id} title ${title} response`, response)
                const responseUrl = response.data.data.cdns[0]
                console.log(`auid ${id} title ${title} url`, responseUrl)
                await saveFileAsync(responseUrl, { "Referer": "https://www.bilibili.com/" }, `${title}${getUrlExtension(responseUrl)}`)
                return
            }
            const bvid = url.match(/https:\/\/www\.bilibili\.com\/video\/(.+?)(?=\/|\?|$)/)[1]
            console.log("bvid", bvid)
            const response = await axios({
                url:"https://api.bilibili.com/x/web-interface/view",
                params:{
                    bvid:bvid
                }
            })
            console.log(`bvid ${bvid} response:`, response)
            const items = response.data.data.pages
            resultElement.empty()
            if(items.length === 1) {
                navigator.clipboard.writeText(await getVideoUrlAsync(items[0].cid, bvid, items[0].part))
                await notifyAsync("已复制到剪贴板")
                return
            }
            showButton.show()
            resultElement.show()
            for (const item of items) {
                const itemElement = $(`<div></div>`)
                resultElement.append(itemElement)
                const button = $(`<button style="width:100%;text-align:left;" data-cid="${item.cid}" data-part="${item.part}" data-bvid="${bvid}">${item.page} - ${item.part}</button>`)
                itemElement.append(button)
                button.click(async function () {
                    const cid = this.dataset.cid
                    const bvid = this.dataset.bvid
                    const part = this.dataset.part
                    navigator.clipboard.writeText(await getVideoUrlAsync(cid, bvid, part))
                    await notifyAsync("已复制到剪贴板")
                })
            }
        }catch(exception){
            console.error(exception)
            await notifyAsync(exception)
        }
    })
    async function delayAsync (milliseconds) {
        await new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    async function notifyAsync (text) {
        const element = $(`<span style="font-size:14px;padding:0px;margin:0px;">${text}</span>`)
        topElement.append(element)
        await delayAsync(3000)
        element.remove()
    }
    async function getVideoUrlAsync (cid, bvid, part) {
        console.log(`bvid ${bvid} part ${part} cid`, cid)
        const response = await axios({
            url:"https://api.bilibili.com/x/player/playurl",
            params:{
                cid:cid,
                bvid:bvid,
                platform:"html5",
                fnval:1,
                high_quality:1,
                qn:64
            }
        })
        console.log(`bvid ${bvid} part ${part} cid ${cid} response`, response)
        const responseUrl = response.data.data.durl[0].url
        console.log(`bvid ${bvid} part ${part} cid ${cid} url`, responseUrl)
        return responseUrl
    }
    async function saveFileAsync(url, headers = {}, defaultFilename = "download.bin") {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url,
                headers,
                responseType: "blob",
                onload: (res) => {
                    let filename = defaultFilename;
                    const dispo = res.responseHeaders?.match(/filename="?(.+?)"?(;|$)/i);
                    if (dispo && dispo[1]) {
                        filename = decodeURIComponent(dispo[1]);
                    }
                    const blobUrl = URL.createObjectURL(res.response);
                    GM_download({
                        url: blobUrl,
                        name: filename,
                        saveAs: true,
                        onload: () => {
                            URL.revokeObjectURL(blobUrl);
                            resolve({ ok: true, filename });
                        },
                        onerror: (e) => {
                            URL.revokeObjectURL(blobUrl);
                            reject(e);
                        }
                    });
                },
                onerror: (e) => {
                    reject(e);
                }
            });
        });
    }
    function getUrlExtension(url) {
        const match = url.match(/\/([^\/?#]+)(\.[a-zA-Z0-9]+)(?=[?#]|$)/);
        return match ? match[2].toLowerCase() : "";
    }
})();