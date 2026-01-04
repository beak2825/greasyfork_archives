// ==UserScript==
// @name         打包下载
// @namespace    Yr
// @version      3.0.4
// @description  Enhanced download of wnacg
// @author       yanagiragi
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @match        http*://*.wnacg.com/photos-index-page-*.html
// @match        http*://*.wnacg.org/photos-index-page-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @match        http*://*.wnacg.org/photos-index-aid-*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/559936/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/559936/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var a = document.createElement('a');
    var tab = $('.uwthumb')[0];
    if (!tab) return;

    // === 样式修改开始 ===
    a.className = "btn"; // 添加 btn 类，使其拥有按钮外观
    a.style.cssText = "width:130px; margin-top: 5px; color: white;"; // 设置宽度
    // === 样式修改结束 ===

    a.text = "打包下载";
    a.onclick = onClick;
    tab.append(a);

    var is_downloading = false
    let curWwwPath = window.document.location.href
    var aid = curWwwPath.substring(curWwwPath.indexOf("aid") + 4, curWwwPath.lastIndexOf(".html"))
    var title = $('#bodywrap h2').text()
    var finished = 0
    var erred = 0
    var total = 0

    function request(url, overridType) {
        return new Promise((resolve, reject) => {
            let request_config = {
                url,
                method: 'GET',
                timeout: 100000,
                onload: response => {
                    console.log(`fetch ${url} success`)
                    resolve(response)
                },
                onerror: error => {
                    console.log(`fetch ${url} onerror`)
                    console.log(error)
                    reject(error);
                },
                ontimeout: () => {
                    console.log(`fetch ${url} ontimeout`)
                    reject(`timeout:${url}`);
                },
            }
            if (overridType) {
                request_config['overrideMimeType'] = 'text/plain; charset=x-user-defined'
            }
            GM_xmlhttpRequest(request_config);
        })
    }
    function retry_request(url, overridType) {
        return new Promise((resolve, reject) => {
            request(url, overridType).then(resp => {
                resolve(resp)
            }).catch(e => {
                console.log(e)
                //retry
                request(url, overridType).then(resp => {
                    resolve(resp)
                }).catch(e => {
                    console.log(e)
                    reject(e)
                })
            })
        })
    }
    function getImgList(aid) {
        return new Promise((resolve, reject) => {
            retry_request("/photos-gallery-aid-" + aid + ".html", false).then(gallery_resp => {
                let rawText = gallery_resp.response;
                rawText = rawText.split('\n');
                let raw = "";
                for (let i = 2; i < rawText.length - 5; i++) {
                    rawText[i] = rawText[i].substring(18);
                    rawText[i] = rawText[i].substring(0, rawText[i].indexOf('");'));
                    rawText[i] = rawText[i].replace(/\\/g, "");
                    raw += rawText[i];
                }
                raw += 'imglist;'
                let imglist = eval(raw);
                imglist.splice(-1, 1)//去掉最后一个无用的图片
                a.text = '列表加载成功!'
                resolve(imglist)
            }).catch(e => {
                console.log(e)
                a.text = '列表加载失败!'
                reject('empty')
            })
        })
    }
    function get_img(img_url) {
        return new Promise((resolve, reject) => {
            retry_request(img_url, true).then(resp => {
                let resp_text = resp.responseText;
                let data = new Uint8Array(resp_text.length);
                let i = 0;
                while (i < resp_text.length) {
                    data[i] = resp_text.charCodeAt(i);
                    i++;
                }
                resp.type
                let blob = new Blob([data], { type: `image/${getSuffix(img_url)}` });
                resolve(blob)
            }).catch(e => {
                reject()
            })
        })
    }
    function onClick() {
        if (is_downloading) {
            alert("正在下载中")
            return
        }
        startDownload()
    }
    function prefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
    function updateProgress() {
        a.text = `下载中:${finished}/${total},失败:${erred}`
    }
    function getSuffix(url) {
        let suffix = 'png'
        let dot_index = url.lastIndexOf('.')
        if (dot_index > 0) {
            suffix = url.substring(dot_index + 1)
        }
        return suffix
    }

    function GetCategory() {
        let el = document.querySelector('.asTBcell.uwconn label');
        let raw = el ? el.textContent : '';
        raw = raw.replace(/分類：/, '').replace(/ /g, '').replace(/\//g, '');
        return encodeURIComponent(raw);
    }

    function startDownload() {
        let zip = new JSZip()

        let zipTitle = title;
        try {
            const category = decodeURIComponent(GetCategory());
            if (category) {
                zipTitle = `[${category}] ${title}`;
            }
        } catch (e) {
            console.error(e);
        }

        let folder = zip.folder(zipTitle)
        is_downloading = true
        finished = 0
        erred = 0
        a.text = "准备下载..."
        getImgList(aid).then(imgList => {
            total = imgList.length
            updateProgress()
            let promises = []
            for (let i = 0; i < imgList.length; i++) {
                let p = get_img(`https:${imgList[i].url}`)
                let img_name = `${prefixInteger(i, 5)}.${getSuffix(imgList[i].url)}`
                p.then(blob => {
                    folder.file(img_name, blob, { binary: true })
                    finished++
                    updateProgress()
                }).catch(e => {
                    erred++
                    updateProgress()
                })
                promises.push(p)
            }
            Promise.all(promises).then(() => {
                a.text = '下载完成，正在压缩...'
                zip.generateAsync({ type: 'blob', base64: true },
                    function (metadata) {
                        a.text = "正在压缩:" + metadata.percent.toFixed(2) + " %";
                    })
                    .then(content => {
                        saveAs(content, `${zipTitle}.zip`)
                        if (erred > 0) {
                            a.text = `保存成功!其中失败${erred}个，点击重试`
                        } else {
                            a.text = "保存成功!"
                            // 这里去掉了自动恢复“打包下载”的逻辑
                        }
                        is_downloading = false
                    })
            }).catch(e => {
                a.text = "打包失败!"
                is_downloading = false
            })
        }).catch(e => {
            a.text = "获取列表失败!"
            is_downloading = false
        })
    }
})();