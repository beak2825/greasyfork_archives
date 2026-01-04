// ==UserScript==
// @name         123云盘秒传JSON生成器（夸克网盘/天翼云盘）
// @name:zh-CN   123云盘秒传JSON生成器（夸克网盘/天翼云盘）
// @name:en      123pan RapidTransfer JSON Generator (Quark/Tianyi Cloud)
// @namespace    https://github.com/ekxs0109/123link
// @version      1.0.4
// @description  一键生成123云盘秒传JSON，支持夸克网盘、天翼云盘的个人文件和分享链接，配合123FastLink使用
// @description:zh-CN  一键生成123云盘秒传JSON，支持夸克网盘、天翼云盘的个人文件和分享链接，配合123FastLink使用
// @description:en  One-click generation of 123pan rapid transfer JSON, supports Quark and Tianyi Cloud personal files and share links, works with 123FastLink
// @author       ekxs
// @homepage     https://github.com/ekxs0109/123link
// @supportURL   https://github.com/ekxs0109/123link/issues
// @license      Apache-2.0
// @match        https://pan.quark.cn/*
// @match        https://drive.quark.cn/*
// @match        https://pan.quark.cn/s/*
// @match        https://drive.quark.cn/s/*
// @match        https://cloud.189.cn/web/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzRjYWY1MCIgZD0iTTI0IDRDMTIuOTUgNCA0IDEyLjk1IDQgMjRzOC45NSAyMCAyMCAyMCAyMC04Ljk1IDIwLTIwUzM1LjA1IDQgMjQgNHptLTQgMzBsLTgtOCAyLjgzLTIuODNMNTIgMjQuMzRsNi4xNy02LjE3TDYxIDIxbC0xMSAxMXoiLz48L3N2Zz4=
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @connect      drive.quark.cn
// @connect      drive-pc.quark.cn
// @connect      pc-api.uc.cn
// @connect      cloud.189.cn
// @downloadURL https://update.greasyfork.org/scripts/555404/123%E4%BA%91%E7%9B%98%E7%A7%92%E4%BC%A0JSON%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555404/123%E4%BA%91%E7%9B%98%E7%A7%92%E4%BC%A0JSON%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const utils = {
        getCachedCookie() {
            return GM_getValue("quark_cookie", "");
        },

        saveCookie(cookie) {
            GM_setValue("quark_cookie", cookie);
        },

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        },

        showCookieInputDialog(onSave, currentCookie = "") {
            const dialog = document.createElement("div");
            dialog.id = "quark-cookie-input-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 30px; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">设置夸克网盘Cookie</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 15px;">
              请打开浏览器开发者工具(F12) → Network → 找到任意请求 → 复制完整的Cookie值<br/>
              <strong>必须包含：__puus、__pus、ctoken 等关键Cookie</strong>
            </div>
            <textarea id="quark-cookie-input"
              placeholder="粘贴完整的Cookie字符串，例如：ctoken=xxx; __puus=xxx; __pus=xxx; ..."
              style="flex: 1; min-height: 200px; padding: 10px; border: 1px solid #d9d9d9; border-radius: 4px; font-family: monospace; font-size: 12px; resize: vertical;">${currentCookie}</textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
              <button id="quark-cookie-save-btn" style="padding: 8px 20px; background: #0d53ff; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
              <button id="quark-cookie-cancel-btn" style="padding: 8px 20px; background: #d9d9d9; color: #333; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
          </div>
        </div>
      `;
            document.body.appendChild(dialog);

            document.getElementById("quark-cookie-save-btn").onclick = () => {
                const cookie = document
                    .getElementById("quark-cookie-input")
                    .value.trim();
                if (!cookie) {
                    alert("Cookie不能为空");
                    return;
                }
                this.saveCookie(cookie);
                dialog.remove();
                GM_notification({
                    text: "Cookie已保存",
                    timeout: 2000,
                });
                if (onSave) {
                    onSave(cookie);
                }
            };

            document.getElementById("quark-cookie-cancel-btn").onclick = () => {
                dialog.remove();
            };
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find((key) => {
                return (
                    key.startsWith("__reactFiber$") ||
                    key.startsWith("__reactInternalInstance$")
                );
            });

            let domFiber = dom[key];

            if (domFiber == null) {
                return null;
            }

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = (fiber) => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type === "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };

            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }

            return compFiber.stateNode || compFiber;
        },

        findVue(dom, traverseUp = 0) {
            let i = 0;
            let el = dom;
            while (i < traverseUp) {
                if (!el) return null;
                el = el.parentElement;
                i++;
            }
            return el?.__vue__;
        },

        getCurrentPath() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const dirFid = urlParams.get("dir_fid");

                if (!dirFid || dirFid === "0") {
                    return "";
                }

                const breadcrumb = document.querySelector(".breadcrumb-list");
                if (breadcrumb) {
                    const items = breadcrumb.querySelectorAll(".breadcrumb-item");
                    const pathParts = [];

                    for (let i = 1; i < items.length; i++) {
                        const text = items[i].textContent.trim();
                        if (text) {
                            pathParts.push(text);
                        }
                    }

                    return pathParts.join("/");
                }

                return "";
            } catch (e) {
                return "";
            }
        },

        getSelectedList() {
            try {
                const fileListDom = document.getElementsByClassName("file-list")[0];

                if (!fileListDom) {
                    return [];
                }

                const reactObj = this.findReact(fileListDom);

                const props = reactObj?.props;

                if (props) {
                    const fileList = props.list || [];
                    const selectedKeys = props.selectedRowKeys || [];

                    const selectedList = [];
                    fileList.forEach(function (val) {
                        if (selectedKeys.includes(val.fid)) {
                            selectedList.push(val);
                        }
                    });

                    return selectedList;
                }

                return [];
            } catch (e) {
                return [];
            }
        },

        post(url, data, headers = {}) {
            return new Promise((resolve, reject) => {
                const requestData = JSON.stringify(data);
                const QUARK_UA =
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch";
                const defaultHeaders = {
                    "Content-Type": "application/json;charset=utf-8",
                    "User-Agent": QUARK_UA,
                    Origin: location.origin,
                    Referer: `${location.origin}/`,
                    Dnt: "",
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {...defaultHeaders, ...headers},
                    data: requestData,
                    onload: function (response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            reject(new Error("响应解析失败"));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error("网络请求失败"));
                    },
                });
            });
        },

        get(url, headers = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`请求失败: ${response.status}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error("网络请求失败"));
                    },
                });
            });
        },

        async getFolderFiles(folderId, folderPath = "", onProgress) {
            const API_URL =
                "https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc";
            const allFiles = [];
            let page = 1;
            const pageSize = 50;

            while (true) {
                const url = `${API_URL}&pdir_fid=${folderId}&_page=${page}&_size=${pageSize}&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code !== 0 || !result?.data?.list) {
                    break;
                }

                const items = result.data.list;
                for (const item of items) {
                    const itemPath = folderPath
                        ? `${folderPath}/${item.file_name}`
                        : item.file_name;

                    if (item.dir) {
                        const subFiles = await this.getFolderFiles(
                            item.fid,
                            itemPath,
                            onProgress,
                        );
                        allFiles.push(...subFiles);
                    } else if (item.file) {
                        allFiles.push({...item, path: itemPath});
                        if (onProgress) {
                            onProgress();
                        }
                    }
                }

                if (items.length < pageSize) {
                    break;
                }
                page++;
            }

            return allFiles;
        },

        async getShareFolderFiles(shareId, stoken, folderId, folderPath = "") {
            const allFiles = [];
            let page = 1;
            const pageSize = 100;

            while (true) {
                const url = `https://pc-api.uc.cn/1/clouddrive/share/sharepage/detail?pwd_id=${shareId}&stoken=${encodeURIComponent(
                    stoken,
                )}&pdir_fid=${folderId}&_page=${page}&_size=${pageSize}&pr=ucpro&fr=pc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            Referer: "https://pan.quark.cn/",
                        },
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code !== 0 || !result?.data?.list) {
                    break;
                }

                const items = result.data.list;
                for (const item of items) {
                    const itemPath = folderPath
                        ? `${folderPath}/${item.file_name}`
                        : item.file_name;

                    if (item.dir) {
                        const subFiles = await this.getShareFolderFiles(
                            shareId,
                            stoken,
                            item.fid,
                            itemPath,
                        );
                        allFiles.push(...subFiles);
                    } else if (item.file) {
                        allFiles.push({...item, path: itemPath});
                    }
                }

                if (items.length < pageSize) {
                    break;
                }
                page++;
            }

            return allFiles;
        },

        async getShareToken(shareId, passcode = "", cookie = "") {
            const API_URL = "https://pc-api.uc.cn/1/clouddrive/share/sharepage/token";

            try {
                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: API_URL,
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: cookie,
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            Referer: "https://pan.quark.cn/",
                        },
                        data: JSON.stringify({
                            pwd_id: shareId,
                            passcode: passcode,
                        }),
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code === 31001) {
                    throw new Error("请先登录网盘");
                }
                if (result?.code !== 0) {
                    throw new Error(
                        `获取token失败，代码：${result.code}，消息：${result.message}`,
                    );
                }

                return {
                    stoken: result.data.stoken,
                    title: result.data.title || ""
                };
            } catch (error) {
                throw error;
            }
        },

        async getFilesWithMd5(fileList, onProgress) {
            const API_URL =
                "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc";
            const BATCH_SIZE = 15;

            const data = [];
            let processed = 0;
            const validFiles = fileList.filter((item) => item.file === true);

            const pathMap = {};
            validFiles.forEach((file) => {
                pathMap[file.fid] = file.path;
            });

            for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
                const batch = validFiles.slice(i, i + BATCH_SIZE);
                const fids = batch.map((item) => item.fid);

                try {
                    const result = await this.post(API_URL, {fids});

                    if (result?.code === 31001) {
                        throw new Error("请先登录网盘");
                    }
                    if (result?.code !== 0) {
                        throw new Error(
                            `获取链接失败，代码：${result.code}，消息：${result.message}`,
                        );
                    }

                    if (result?.data) {
                        const filesWithPath = result.data.map((file) => {
                            const newFile = {
                                ...file,
                                path: pathMap[file.fid] || file.file_name,
                            };

                            let md5 = newFile.md5 || newFile.hash || newFile.etag || "";
                            md5 = this.decodeMd5(md5);

                            if (md5) {
                                newFile.md5 = md5;
                            }

                            return newFile;
                        });
                        data.push(...filesWithPath);
                    }

                    processed += batch.length;
                    if (onProgress) {
                        onProgress(processed, validFiles.length);
                    }

                    await this.sleep(1000);
                } catch (error) {
                    throw error;
                }
            }

            return data;
        },

        async scanQuarkShareFiles(
            shareId,
            stoken,
            cookie,
            parentFileId = 0,
            path = "",
            recursive = true
        ) {
            const fileItems = [];
            let page = 1;

            while (true) {
                const url = `https://pc-api.uc.cn/1/clouddrive/share/sharepage/detail?pwd_id=${shareId}&stoken=${encodeURIComponent(
                    stoken,
                )}&pdir_fid=${parentFileId}&_page=${page}&_size=100&pr=ucpro&fr=pc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            Cookie: cookie,
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
                            Referer: "https://pan.quark.cn/",
                        },
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result.code !== 0 || !result.data?.list) break;

                for (const item of result.data.list) {
                    const itemPath = path ? `${path}/${item.file_name}` : item.file_name;

                    if (item.dir) {
                        if (recursive) {
                            const subFiles = await this.scanQuarkShareFiles(
                                shareId,
                                stoken,
                                cookie,
                                item.fid,
                                itemPath,
                                true
                            );
                            fileItems.push(...subFiles);
                        }
                    } else {
                        fileItems.push({
                            fid: item.fid,
                            token: item.share_fid_token,
                            name: item.file_name,
                            size: item.size,
                            path: itemPath,
                        });
                    }
                }

                if (result.data.list.length < 100) break;
                page++;
            }

            return fileItems;
        },

        async batchGetShareFilesMd5(
            shareId,
            stoken,
            cookie,
            fileItems,
            onProgress,
        ) {
            const md5Map = {};
            const batchSize = 10;
            let totalProcessed = 0;


            for (let i = 0; i < fileItems.length; i += batchSize) {
                const batch = fileItems.slice(i, i + batchSize);
                const fids = batch.map((item) => item.fid);
                const tokens = batch.map((item) => item.token);


                try {
                    const requestBody = {
                        fids,
                        pwd_id: shareId,
                        stoken,
                        fids_token: tokens,
                    };


                    const md5Result = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: `https://pc-api.uc.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&uc_param_str=&__dt=${Math.floor(Math.random() * 4 + 1) * 60 * 1000}&__t=${Date.now()}`,
                            headers: {
                                "Content-Type": "application/json",
                                Cookie: cookie,
                                "User-Agent":
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/3.14.2 Chrome/112.0.5615.165 Electron/24.1.3.8 Safari/537.36 Channel/pckk_other_ch",
                                Referer: "https://pan.quark.cn/",
                                Accept: "application/json, text/plain, */*",
                                Origin: "https://pan.quark.cn",
                            },
                            data: JSON.stringify(requestBody),
                            onload: function (response) {
                                try {
                                    const parsed = JSON.parse(response.responseText);
                                    resolve(parsed);
                                } catch (e) {
                                    resolve({code: -1, message: "解析失败"});
                                }
                            },
                            onerror: (error) => {
                                resolve({code: -1, message: "网络错误"});
                            },
                        });
                    });


                    if (md5Result.code === 0 && md5Result.data) {
                        const dataList = Array.isArray(md5Result.data)
                            ? md5Result.data
                            : [md5Result.data];

                        dataList.forEach((item, idx) => {
                            const fid = fids[idx];
                            if (!fid) return;

                            let md5 = item.md5 || item.hash || "";
                            md5 = utils.decodeMd5(md5);

                            md5Map[fid] = md5;
                        });
                    } else {
                        fids.forEach((fid) => (md5Map[fid] = ""));
                    }
                } catch (e) {
                    fids.forEach((fid) => (md5Map[fid] = ""));
                }

                totalProcessed += batch.length;
                if (onProgress) {
                    onProgress(totalProcessed, fileItems.length);
                }

                await this.sleep(1000);
            }

            return md5Map;
        },

        generateRapidTransferJson(filesData) {
            const files = filesData.map((file) => ({
                path: file.path || file.file_name,
                etag: (file.etag || file.md5 || "").toLowerCase(),
                size: file.size,
            }));

            const totalSize = files.reduce((sum, f) => sum + f.size, 0);

            return {
                scriptVersion: "3.0.3",
                exportVersion: "1.0",
                usesBase62EtagsInExport: false,
                commonPath: "",
                files: files,
                totalFilesCount: files.length,
                totalSize: totalSize,
            };
        },

        showLoadingDialog(title, message) {
            const existingDialog = document.getElementById(
                "quark-json-loading-dialog",
            );
            if (existingDialog) {
                existingDialog.remove();
            }

            const dialog = document.createElement("div");
            dialog.id = "quark-json-loading-dialog";
            dialog.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 30px; border-radius: 8px; min-width: 350px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${title}</div>
                        <div id="quark-json-loading-message" style="font-size: 14px; color: #666; margin-bottom: 10px;">${message}</div>
                        <div id="quark-json-loading-detail" style="font-size: 12px; color: #999; margin-bottom: 10px; min-height: 18px;"></div>
                        <div style="margin-top: 15px;">
                            <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                                <div id="quark-json-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #0d53ff, #52c41a); transition: width 0.3s;"></div>
                            </div>
                            <div id="quark-json-progress-text" style="font-size: 13px; color: #666; margin-top: 8px; font-weight: 500;">0%</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
            return dialog;
        },

        updateProgress(processed, total, phase = "获取MD5") {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            const progressBar = document.getElementById("quark-json-progress-bar");
            const progressText = document.getElementById("quark-json-progress-text");

            if (messageEl) {
                messageEl.textContent = `正在${phase}...`;
            }
            if (detailEl) {
                detailEl.textContent = `已处理 ${processed} / ${total} 个文件`;
            }
            if (progressBar) {
                const percent = total > 0 ? ((processed / total) * 100).toFixed(1) : 0;
                progressBar.style.width = `${percent}%`;
            }
            if (progressText) {
                const percent = total > 0 ? ((processed / total) * 100).toFixed(1) : 0;
                progressText.textContent = `${percent}%`;
            }
        },

        updateScanProgress(count) {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            if (messageEl) {
                messageEl.textContent = "正在扫描文件...";
            }
            if (detailEl) {
                detailEl.textContent = `已发现 ${count} 个文件`;
            }
        },

        updateScanComplete(total) {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            if (messageEl) {
                messageEl.textContent = "扫描完成，准备获取MD5...";
            }
            if (detailEl) {
                detailEl.textContent = `共发现 ${total} 个文件`;
            }
        },

        closeLoadingDialog() {
            const dialog = document.getElementById("quark-json-loading-dialog");
            if (dialog) {
                dialog.remove();
            }
        },

        showResultDialog(json, shareTitle = "") {
            let currentJson = json;
            const updateJsonDisplay = () => {
                const jsonStr = JSON.stringify(currentJson, null, 2);
                const preEl = document.getElementById("quark-json-preview");
                if (preEl) {
                    preEl.textContent = jsonStr;
                }
                return jsonStr;
            };

            const jsonStr = JSON.stringify(json, null, 2);
            const dialog = document.createElement("div");
            const checkboxHtml = shareTitle ? `
                <div style="margin-bottom: 15px; padding: 10px; background: #f0f7ff; border-radius: 4px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="quark-json-commonpath-checkbox" checked style="margin-right: 8px; width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 14px; color: #333;">设置 commonPath 为分享标题：<strong>${shareTitle}</strong></span>
                    </label>
                </div>
            ` : '';

            dialog.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 30px; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">秒传JSON生成成功</div>
                        ${checkboxHtml}
                        <div style="flex: 1; overflow: auto; background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 15px;">
                            <pre id="quark-json-preview" style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${jsonStr}</pre>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="quark-json-copy-btn" style="padding: 8px 20px; background: #0d53ff; color: white; border: none; border-radius: 4px; cursor: pointer;">复制JSON</button>
                            <button id="quark-json-download-btn" style="padding: 8px 20px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">下载文件</button>
                            <button id="quark-json-close-btn" style="padding: 8px 20px; background: #d9d9d9; color: #333; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);

            if (shareTitle) {
                const newCommonPath = shareTitle ? shareTitle + "/" : "";
                currentJson = {...json, commonPath: newCommonPath};
                updateJsonDisplay();

                const checkbox = document.getElementById("quark-json-commonpath-checkbox");
                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        currentJson = {...json, commonPath: newCommonPath};
                    } else {
                        currentJson = {...json, commonPath: ""};
                    }
                    updateJsonDisplay();
                };
            }

            document.getElementById("quark-json-copy-btn").onclick = () => {
                const jsonStr = updateJsonDisplay();
                GM_setClipboard(jsonStr);
                this.showToast("已复制到剪贴板");
            };

            document.getElementById("quark-json-download-btn").onclick = () => {
                const jsonStr = updateJsonDisplay();
                const blob = new Blob([jsonStr], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const filename = (shareTitle ? shareTitle : "123link") + ".json";
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast("下载已开始");
            };

            document.getElementById("quark-json-close-btn").onclick = () => {
                dialog.remove();
            };
        },

        showError(message, showCookieButton = false) {
            const dialog = document.createElement("div");
            dialog.id = "quark-json-error-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
            <div style="background: white; padding: 24px; border-radius: 8px; width: 90%; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center;">
                <div style="color: #ff4d4f; margin-bottom: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </div>
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #333;">操作失败</div>
                <div style="font-size: 14px; color: #555; margin-bottom: 24px; text-align: center; white-space: pre-line;">${message}</div>
                <div style="display: flex; gap: 12px; justify-content: center; width: 100%;">
                    ${showCookieButton ? '<button id="quark-json-error-cookie-btn" style="flex: 1; padding: 10px 20px; background: #0d53ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">修改Cookie</button>' : ""}
                    <button id="quark-json-error-close-btn" style="flex: 1; padding: 10px 20px; background: #f0f0f0; color: #333; border: 1px solid #d9d9d9; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">确定</button>
                </div>
            </div>
        </div>
    `;
            document.body.appendChild(dialog);

            if (showCookieButton) {
                document.getElementById("quark-json-error-cookie-btn").onclick = () => {
                    dialog.remove();
                    this.showCookieInputDialog(null, this.getCachedCookie());
                };
            }

            document.getElementById("quark-json-error-close-btn").onclick = () => {
                dialog.remove();
            };
        },

        showToast(message) {
            const existingToast = document.getElementById("quark-json-toast");
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement("div");
            toast.id = "quark-json-toast";
            toast.textContent = message;
            toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, top 0.3s ease-in-out;
        `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = "1";
                toast.style.top = "40px";
            }, 10);

            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.top = "20px";
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 2500);
        },

        showUpdateDialog() {
            const version = GM_info.script.version;
            const dialog = document.createElement("div");
            dialog.id = "quark-json-update-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
            <div style="background: white; padding: 24px; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #333; text-align: center;">脚本更新 v${version}</div>
                <div style="font-size: 15px; color: #555; margin-bottom: 24px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;"><strong>修复</strong>：修复了夸克网盘个人文件和分享链接中Base64编码的MD5值无法正确解析的问题。</li>
                        <li style="margin-bottom: 10px;"><strong>优化</strong>：将MD5解码逻辑提取为独立工具函数，提高代码可维护性。</li>
                    </ul>
                </div>
                <div style="text-align: center;">
                    <button id="quark-json-update-close-btn" style="padding: 10px 30px; background: #0d53ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">我已知晓</button>
                </div>
            </div>
        </div>
    `;
            document.body.appendChild(dialog);

            document.getElementById("quark-json-update-close-btn").onclick = () => {
                dialog.remove();
            };
        },

        parseSize(sizeStr) {
            if (typeof sizeStr === "number") {
                return sizeStr;
            }
            if (typeof sizeStr !== "string") {
                return 0;
            }
            const sizeMatch = sizeStr.match(/^([\d.]+)\s*([a-z]+)/i);
            if (!sizeMatch) {
                const num = parseInt(sizeStr, 10);
                return isNaN(num) ? 0 : num;
            }
            const size = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toUpperCase();
            switch (unit) {
                case "G":
                case "GB":
                    return Math.round(size * 1024 * 1024 * 1024);
                case "M":
                case "MB":
                    return Math.round(size * 1024 * 1024);
                case "K":
                case "KB":
                    return Math.round(size * 1024);
                case "B":
                default:
                    return Math.round(size);
            }
        },

        decodeMd5(md5) {
            if (!md5 || !md5.includes("==")) {
                return md5 || "";
            }
            try {
                const binaryString = atob(md5);
                if (binaryString.length === 16) {
                    return Array.from(binaryString, (char) =>
                        char.charCodeAt(0).toString(16).padStart(2, "0"),
                    ).join("");
                }
                return "";
            } catch (e) {
                return "";
            }
        },
    };

    const tianyiService = {
        getSelectedFiles() {
            try {
                if (typeof unsafeWindow !== "undefined") {
                    let list;
                    if (/\/web\/share/.test(location.href)) {
                        list = unsafeWindow.shareUser?.getSelectedFileList();
                    } else {
                        list = unsafeWindow.file?.getSelectedFileList();
                    }
                    if (list && list.length > 0) {
                        return list;
                    }
                }
            } catch (e) {
                // ignore
            }

            const selectedItems = [];
            let selectedElements = document.querySelectorAll("li.c-file-item-select");

            if (selectedElements.length === 0) {
                const checkedBoxes = document.querySelectorAll(".ant-checkbox-checked");
                if (checkedBoxes.length > 0) {
                    selectedElements = Array.from(checkedBoxes)
                        .map((box) => box.closest("li.c-file-item"))
                        .filter((el) => el);
                }
            }

            if (selectedElements.length === 0) {
                return [];
            }

            selectedElements.forEach((itemEl) => {
                if (itemEl.__vue__) {
                    const vueInstance = itemEl.__vue__;
                    const fileData =
                        vueInstance.fileItem ||
                        vueInstance.fileInfo ||
                        vueInstance.item ||
                        vueInstance.file;
                    if (fileData) {
                        if (
                            !selectedItems.some(
                                (item) => item.fileId === (fileData.id || fileData.fileId),
                            )
                        ) {
                            const normalizedItem = {
                                fileId: fileData.id || fileData.fileId,
                                fileName: fileData.name || fileData.fileName,
                                isFolder: fileData.isFolder || fileData.fileCata === 2,
                                md5: fileData.md5,
                                size: fileData.size,
                            };
                            selectedItems.push(normalizedItem);
                        }
                    }
                }
            });
            return selectedItems;
        },

        async getPersonalFolderFiles(folderId, path = "", onProgress = null) {
            const files = [];
            let pageNum = 1;
            const pageSize = 100;

            while (true) {
                const appKey = "600100422";
                const timestamp = Date.now().toString();
                const urlParams = {
                    folderId: folderId,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    orderBy: "lastOpTime",
                    descending: "true",
                };

                const signParams = {
                    ...urlParams,
                    Timestamp: timestamp,
                    AppKey: appKey,
                };
                const signature = this.get189Signature(signParams);

                const url = `https://cloud.189.cn/api/open/file/listFiles.action?${new URLSearchParams(urlParams)}`;

                const text = await utils.get(url, {
                    Accept: "application/json;charset=UTF-8",
                    "Sign-Type": "1",
                    Signature: signature,
                    Timestamp: timestamp,
                    AppKey: appKey,
                });

                const data = JSON.parse(text);

                if (data.res_code !== 0) break;

                const fileList = data.fileListAO?.fileList || [];
                const folderList = data.fileListAO?.folderList || [];

                if (fileList.length === 0 && folderList.length === 0) break;

                for (const file of fileList) {
                    const filePath = path ? `${path}/${file.name}` : file.name;
                    files.push({
                        path: filePath,
                        etag: (file.md5 || "").toLowerCase(),
                        size: file.size,
                        fileId: file.id,
                    });
                    if (onProgress) onProgress();
                }

                for (const folder of folderList) {
                    const folderPath = path ? `${path}/${folder.name}` : folder.name;
                    const subFiles = await this.getPersonalFolderFiles(
                        folder.id,
                        folderPath,
                        onProgress,
                    );
                    files.push(...subFiles);
                }

                if (fileList.length + folderList.length < pageSize) break;
                pageNum++;
            }
            return files;
        },

        async getBaseShareInfo(shareUrl, sharePwd) {
            let match =
                shareUrl.match(/\/t\/([a-zA-Z0-9]+)/) ||
                shareUrl.match(/[?&]code=([a-zA-Z0-9]+)/);
            if (!match) throw new Error("无效的189网盘分享链接");

            const shareCode = match[1];
            let accessCode = sharePwd || "";

            if (!accessCode) {
                const cookieName = `share_${shareCode}`;
                const cookiePwd = utils.getCookie(cookieName);
                if (cookiePwd) {
                    accessCode = cookiePwd;
                } else {
                    try {
                        const decodedUrl = decodeURIComponent(shareUrl);
                        const pwdMatch = decodedUrl.match(
                            /[（(]访问码[：:]\s*([a-zA-Z0-9]+)/,
                        );
                        if (pwdMatch && pwdMatch[1]) {
                            accessCode = pwdMatch[1];
                        }
                    } catch (e) {
                        /* ignore decoding errors */
                    }
                }
            }

            let shareId = shareCode;

            if (accessCode) {
                const checkUrl = `https://cloud.189.cn/api/open/share/checkAccessCode.action?shareCode=${shareCode}&accessCode=${accessCode}`;
                try {
                    const checkText = await utils.get(checkUrl, {
                        Accept: "application/json;charset=UTF-8",
                        Referer: "https://cloud.189.cn/web/main/",
                    });
                    const checkData = JSON.parse(checkText);
                    if (checkData.shareId) shareId = checkData.shareId;
                } catch (e) {
                    /* ignore */
                }
            }

            const params = {shareCode, accessCode: accessCode};
            const timestamp = Date.now().toString();
            const appKey = "600100422";
            const signData = {...params, Timestamp: timestamp, AppKey: appKey};
            const signature = this.get189Signature(signData);
            const apiUrl = `https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?${new URLSearchParams(params)}`;

            const text = await utils.get(apiUrl, {
                Accept: "application/json;charset=UTF-8",
                "Sign-Type": "1",
                Signature: signature,
                Timestamp: timestamp,
                AppKey: appKey,
                Referer: "https://cloud.189.cn/web/main/",
            });

            let data;
            try {
                data = JSON.parse(
                    text.replace(
                        /"(id|fileId|parentId|shareId)":"?(\d{15,})"?/g,
                        '"$1":"$2"',
                    ),
                );
            } catch (e) {
                throw new Error("解析分享信息失败");
            }

            if (data.res_code !== 0) {
                if (data.res_code === 40401 && !accessCode)
                    throw new Error("该分享需要提取码，请输入提取码");
                throw new Error(`获取分享信息失败: ${data.res_message || "未知错误"}`);
            }

            return {
                shareId: data.shareId || shareId,
                shareMode: data.shareMode || "0",
                accessCode: accessCode,
                shareCode: shareCode,
                title: data.fileName || ""
            };
        },

        async get189ShareFiles(
            shareId,
            shareDirFileId,
            fileId,
            path = "",
            shareMode = "0",
            accessCode = "",
            shareCode = "",
            onProgress = null,
        ) {
            const files = [];
            let page = 1;

            while (true) {
                const params = {
                    pageNum: page.toString(),
                    pageSize: "100",
                    fileId: fileId.toString(),
                    shareDirFileId: shareDirFileId.toString(),
                    isFolder: "true",
                    shareId: shareId.toString(),
                    shareMode: shareMode,
                    iconOption: "5",
                    orderBy: "lastOpTime",
                    descending: "true",
                    accessCode: accessCode || "",
                };
                const queryString = new URLSearchParams(params).toString();
                const url = `https://cloud.189.cn/api/open/share/listShareDir.action?${queryString}`;

                const headers = {
                    Accept: "application/json;charset=UTF-8",
                    Referer: "https://cloud.189.cn/web/main/",
                };
                if (shareCode && accessCode) {
                    headers["Cookie"] = `share_${shareCode}=${accessCode}`;
                }

                const text = await utils.get(url, headers);
                let data;
                try {
                    const fixedText = text.replace(
                        /"(id|fileId|parentId|shareId)":(\d{15,})/g,
                        '"$1":"$2"',
                    );
                    data = JSON.parse(fixedText);
                } catch (e) {
                    break;
                }

                if (data.res_code !== 0) {
                    if (data.res_code === "FileNotFound" && path) {
                        console.log(
                            `[189] 警告：子文件夹 "${path}" 访问失败，189网盘分享可能需要登录才能访问子文件夹`,
                        );
                    }
                    break;
                }

                const fileList = data.fileListAO?.fileList || [];
                const folderList = data.fileListAO?.folderList || [];

                for (const file of fileList) {
                    const filePath = path ? `${path}/${file.name}` : file.name;
                    files.push({
                        path: filePath,
                        etag: (file.md5 || "").toLowerCase(),
                        size: file.size,
                    });
                    if (onProgress) onProgress();
                }

                for (const folder of folderList) {
                    const folderPath = path ? `${path}/${folder.name}` : folder.name;
                    const subFiles = await this.get189ShareFiles(
                        shareId,
                        folder.id,
                        folder.id,
                        folderPath,
                        shareMode,
                        accessCode,
                        shareCode,
                        onProgress,
                    );
                    files.push(...subFiles);
                }

                if (fileList.length + folderList.length < 100) {
                    break;
                }
                page++;
            }
            return files;
        },

        parseXMLResponse(xmlText) {
            const getTagValue = (xml, tagName) =>
                xml.match(new RegExp(`<${tagName}>([^<]*)<\/${tagName}>`, "i"))?.[1] ||
                null;
            return {
                res_code: parseInt(getTagValue(xmlText, "res_code") || "0"),
                res_message: getTagValue(xmlText, "res_message") || "",
                shareId: getTagValue(xmlText, "shareId") || "",
                fileId: getTagValue(xmlText, "fileId") || "",
                shareMode: getTagValue(xmlText, "shareMode") || "0",
                isFolder: getTagValue(xmlText, "isFolder") === "true",
                needAccessCode: getTagValue(xmlText, "needAccessCode") || "0",
                fileName: getTagValue(xmlText, "fileName") || "",
            };
        },

        get189Signature(params) {
            const sortedKeys = Object.keys(params).sort();
            const sortedParams = sortedKeys
                .map((key) => `${key}=${params[key]}`)
                .join("&");
            return this.simpleMD5(sortedParams);
        },

        simpleMD5(str) {
            function rotateLeft(value, shift) {
                return (value << shift) | (value >>> (32 - shift));
            }

            function addUnsigned(x, y) {
                const lsw = (x & 0xffff) + (y & 0xffff);
                const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xffff);
            }

            function F(x, y, z) {
                return (x & y) | (~x & z);
            }

            function G(x, y, z) {
                return (x & z) | (y & ~z);
            }

            function H(x, y, z) {
                return x ^ y ^ z;
            }

            function I(x, y, z) {
                return y ^ (x | ~z);
            }

            function FF(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function GG(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function HH(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function II(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function convertToWordArray(str) {
                const lWordCount = ((str.length + 8) >>> 6) + 1;
                const lMessageLength = lWordCount * 16;
                const lWordArray = new Array(lMessageLength - 1);
                let lBytePosition = 0;
                let lByteCount = 0;
                while (lByteCount < str.length) {
                    const lWordIndex = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordIndex] =
                        lWordArray[lWordIndex] |
                        (str.charCodeAt(lByteCount) << lBytePosition);
                    lByteCount++;
                }
                const lWordIndex = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordIndex] =
                    lWordArray[lWordIndex] | (0x80 << lBytePosition);
                lWordArray[lMessageLength - 2] = str.length << 3;
                lWordArray[lMessageLength - 1] = str.length >>> 29;
                return lWordArray;
            }

            function wordToHex(value) {
                let result = "";
                for (let i = 0; i <= 3; i++) {
                    const byte = (value >>> (i * 8)) & 255;
                    result += ("0" + byte.toString(16)).slice(-2);
                }
                return result;
            }

            const x = convertToWordArray(str);
            let a = 0x67452301,
                b = 0xefcdab89,
                c = 0x98badcfe,
                d = 0x10325476;
            const S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;
            const S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;
            const S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;
            const S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            for (let k = 0; k < x.length; k += 16) {
                const AA = a,
                    BB = b,
                    CC = c,
                    DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
                b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
                a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
                c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
                c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
                a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
                a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
                a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
                a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
                c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
                c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
                b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
                c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
                d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
                c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
                a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
                d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
                b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            return (
                wordToHex(a) +
                wordToHex(b) +
                wordToHex(c) +
                wordToHex(d)
            ).toLowerCase();
        },
    };

    async function generateJson() {
        try {
            const hostname = location.hostname;
            const path = location.pathname;

            if (hostname.includes("cloud.189.cn")) {
                if (path.startsWith("/web/main")) {
                    await generateTianyiHomeJson();
                } else {
                    await generateTianyiShareJson();
                }
            } else if (hostname.includes("quark.cn")) {
                const isSharePage = /^\/(s|share)\//.test(path);
                if (isSharePage) {
                    await generateShareJson();
                } else {
                    await generateHomeJson();
                }
            }
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateTianyiShareJson() {
        utils.showLoadingDialog("正在扫描文件", "准备中...");

        try {
            const selectedFiles = tianyiService.getSelectedFiles();

            if (selectedFiles.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("请先勾选要生成JSON的文件或文件夹");
                return;
            }

            const shareUrl = window.location.href;
            let sharePwd = "";

            const allFiles = [];
            let itemsProcessed = 0;
            let filesFound = 0;

            const onProgress = () => {
                filesFound++;
                utils.updateScanProgress(filesFound);
            };

            utils.updateProgress(0, selectedFiles.length, "扫描文件");
            utils.updateScanProgress(0);

            const {shareId, shareMode, accessCode, shareCode, title} =
                await tianyiService.getBaseShareInfo(shareUrl, sharePwd);

            for (const item of selectedFiles) {
                if (item.isFolder) {
                    const folderPath = item.fileName;
                    const subFiles = await tianyiService.get189ShareFiles(
                        shareId,
                        item.fileId,
                        item.fileId,
                        folderPath,
                        shareMode,
                        accessCode,
                        shareCode,
                        onProgress,
                    );
                    allFiles.push(...subFiles);
                } else {
                    allFiles.push({
                        path: item.fileName,
                        etag: (item.md5 || "").toLowerCase(),
                        size: item.size,
                    });
                    onProgress();
                }
                itemsProcessed++;
                utils.updateProgress(itemsProcessed, selectedFiles.length, "扫描文件");
            }

            utils.updateScanComplete(allFiles.length);
            await utils.sleep(300);

            const finalJson = utils.generateRapidTransferJson(allFiles);
            utils.closeLoadingDialog();
            utils.showResultDialog(finalJson, title);
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateTianyiHomeJson() {
        utils.showLoadingDialog("正在扫描文件", "准备中...");

        try {
            const selectedFiles = tianyiService.getSelectedFiles();
            if (selectedFiles.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("请先勾选要生成JSON的文件或文件夹");
                return;
            }

            const allFiles = [];
            let filesFound = 0;
            const onProgress = () => {
                filesFound++;
                utils.updateScanProgress(filesFound);
            };
            utils.updateScanProgress(0);

            for (const item of selectedFiles) {
                if (item.isFolder) {
                    const subFiles = await tianyiService.getPersonalFolderFiles(
                        item.fileId,
                        item.fileName,
                        onProgress,
                    );
                    allFiles.push(...subFiles);
                } else {
                    allFiles.push({
                        path: item.fileName,
                        size: item.size,
                        fileId: item.fileId,
                        etag: (item.md5 || "").toLowerCase(),
                    });
                    onProgress();
                }
            }

            utils.updateScanComplete(allFiles.length);
            await utils.sleep(300);

            const filesMissingMd5 = allFiles.filter((f) => !f.etag);
            if (filesMissingMd5.length > 0) {
                utils.updateProgress(0, filesMissingMd5.length, "获取MD5");
                let md5Processed = 0;

                for (const file of filesMissingMd5) {
                    try {
                        const details = await tianyiService.getPersonalFileDetails(
                            file.fileId,
                        );
                        file.etag = (details.md5 || "").toLowerCase();
                    } catch (e) {
                        console.error(`获取文件MD5失败: ${file.path}`, e);
                    }
                    md5Processed++;
                    utils.updateProgress(md5Processed, filesMissingMd5.length, "获取MD5");
                    await utils.sleep(100); // 防止请求过快
                }
            }

            const finalJson = utils.generateRapidTransferJson(allFiles);
            utils.closeLoadingDialog();
            utils.showResultDialog(finalJson);
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateHomeJson() {
        const selectedItems = utils.getSelectedList();

        if (selectedItems.length === 0) {
            utils.showError("请先勾选要生成JSON的文件或文件夹");
            return;
        }

        utils.showLoadingDialog("正在扫描文件", "准备中...");

        const currentPath = utils.getCurrentPath();

        const allFiles = [];
        let totalFilesFound = 0;

        for (const item of selectedItems) {
            if (item.file) {
                const filePath = currentPath
                    ? `${currentPath}/${item.file_name}`
                    : item.file_name;
                allFiles.push({...item, path: filePath});
                totalFilesFound++;
                utils.updateScanProgress(totalFilesFound);
            } else if (item.dir) {
                const folderPath = currentPath
                    ? `${currentPath}/${item.file_name}`
                    : item.file_name;
                const folderFiles = await utils.getFolderFiles(
                    item.fid,
                    folderPath,
                    () => {
                        totalFilesFound++;
                        utils.updateScanProgress(totalFilesFound);
                    },
                );
                allFiles.push(...folderFiles);
            }
        }

        if (allFiles.length === 0) {
            utils.closeLoadingDialog();
            utils.showError("没有找到任何文件");
            return;
        }

        const filesData = await utils.getFilesWithMd5(
            allFiles,
            (processed, total) => {
                utils.updateProgress(processed, total, "获取MD5");
            },
        );

        const json = utils.generateRapidTransferJson(filesData);

        utils.closeLoadingDialog();

        utils.showResultDialog(json);
    }

    async function generateShareJson() {
        const selectedItems = utils.getSelectedList();

        if (selectedItems.length === 0) {
            utils.showError("请先勾选要生成JSON的文件或文件夹");
            return;
        }

        const match = location.pathname.match(/\/(s|share)\/([a-zA-Z0-9]+)/);
        if (!match) {
            utils.showError("无法获取分享ID");
            return;
        }
        const shareId = match[2];

        let cookie = utils.getCachedCookie();

        if (!cookie || cookie.length < 10) {
            utils.showCookieInputDialog((newCookie) => {
                setTimeout(() => generateShareJson(), 100);
            });
            return;
        }

        utils.showLoadingDialog("正在扫描文件", "准备中...");

        try {

            const {stoken, title} = await utils.getShareToken(shareId, "", cookie);

            const allFileItems = [];
            let totalFilesFound = 0;

            for (const item of selectedItems) {
                if (item.file) {
                    const parentFid = item.pdir_fid;
                    const filesInParent = await utils.scanQuarkShareFiles(
                        shareId,
                        stoken,
                        cookie,
                        parentFid,
                        '',
                        false
                    );
                    const fileInfo = filesInParent.find(f => f.fid === item.fid);

                    if (fileInfo) {
                        const fileItem = {
                            fid: item.fid,
                            token: fileInfo.token,
                            name: item.file_name,
                            size: item.size,
                            path: item.file_name,
                        };
                        allFileItems.push(fileItem);
                    } else {
                        // Fallback to old logic if not found
                        const fileItem = {
                            fid: item.fid,
                            token: item.share_fid_token,
                            name: item.file_name,
                            size: item.size,
                            path: item.file_name,
                        };
                        allFileItems.push(fileItem);
                    }
                    totalFilesFound++;
                    utils.updateScanProgress(totalFilesFound);
                } else if (item.dir) {
                    const folderFiles = await utils.scanQuarkShareFiles(
                        shareId,
                        stoken,
                        cookie,
                        item.fid,
                        item.file_name,
                    );
                    allFileItems.push(...folderFiles);
                    totalFilesFound += folderFiles.length;
                    utils.updateScanProgress(totalFilesFound);
                }
            }


            if (allFileItems.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("没有找到任何文件", true);
                return;
            }

            utils.updateScanComplete(allFileItems.length);
            await utils.sleep(300);

            const md5Map = await utils.batchGetShareFilesMd5(
                shareId,
                stoken,
                cookie,
                allFileItems,
                (processed, total) => {
                    utils.updateProgress(processed, total, "获取分享文件MD5");
                },
            );

            const files = allFileItems.map((item) => ({
                path: item.path,
                etag: (md5Map[item.fid] || "").toLowerCase(),
                size: item.size,
            }));

            const json = {
                scriptVersion: "3.0.3",
                exportVersion: "1.0",
                usesBase62EtagsInExport: false,
                commonPath: "",
                files,
                totalFilesCount: files.length,
                totalSize: files.reduce((sum, f) => sum + f.size, 0),
            };

            utils.closeLoadingDialog();

            utils.showResultDialog(json, title);
        } catch (error) {
            utils.closeLoadingDialog();
            const errorMsg = error.message || "生成JSON失败";
            const isCookieError =
                errorMsg.includes("登录") ||
                errorMsg.includes("token") ||
                errorMsg.includes("Cookie") ||
                errorMsg.includes("23018");
            utils.showError(
                errorMsg +
                (isCookieError ? "\n\n可能是Cookie失效，请尝试更新Cookie" : ""),
                isCookieError,
            );
        }
    }

    function addButton() {
        const hostname = location.hostname;
        let container;

        if (document.getElementById("quark-json-generator-btn")) {
            return;
        }

        if (hostname.includes("cloud.189.cn")) {
            const isMainPage = location.pathname.startsWith("/web/main");

            if (isMainPage) {
                container = document.querySelector(
                    '[class*="FileHead_file-head-left"]',
                );
            } else {
                container = document.querySelector(".file-operate");
            }

            if (!container) return;

            const button = document.createElement("a");
            button.id = "quark-json-generator-btn";
            button.className = "btn";
            button.href = "javascript:;";
            button.textContent = "生成JSON";
            if (isMainPage) {
                button.style.cssText =
                    "width: 76px; height: 30px; padding: 0; border-radius: 4px; line-height: 30px; color: #fff; text-align: center; font-size: 12px; background: #52c41a; border: 1px solid #46a219; position: relative; display: block; margin-right: 12px;";
            } else {
                button.style.cssText =
                    "width: 116px; height: 36px; padding: 0; border-radius: 4px; line-height: 36px; color: #fff; text-align: center; font-size: 14px; background: #52c41a; border: 1px solid #46a219; position: relative; display: block;margin-right:20px;";
            }

            container.insertBefore(button, container.firstChild);

            if (!isMainPage) {
                const styleId = "quark-json-flex-style";
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
                  .outlink-box-b .file-operate {
                      display: flex !important;
                      flex-wrap: nowrap !important;
                      justify-content: flex-end !important;
                      align-items: center !important;
                      /* Override conflicting styles */
                      float: none !important;
                      text-align: unset !important;
                  }
                  .btn-save-as{
                  margin-left: 0 !important;
                  }
              `;
                    document.head.appendChild(style);
                }
            }

            button.onclick = generateJson;
        } else if (hostname.includes("quark.cn")) {
            const path = location.pathname;
            const isSharePage = /^\/(s|share)\//.test(path);
            if (isSharePage) {
                container = document.querySelector(".share-btns");
                if (!container) {
                    const alternatives = [
                        ".ant-layout-content .operate-bar",
                        ".share-detail-header .operate-bar",
                        ".share-header-btns",
                        ".share-operate-btns",
                        "[class*='share'][class*='btn']",
                        ".ant-btn-group",
                    ];
                    for (const selector of alternatives) {
                        container = document.querySelector(selector);
                        if (container) break;
                    }
                }
            } else {
                container = document.querySelector(".btn-operate .btn-main");
            }
            if (!container) return;

            const buttonWrapper = document.createElement("div");
            buttonWrapper.id = "quark-json-generator-btn";
            buttonWrapper.className = "ant-dropdown-trigger pl-button-json";

            const isSharePageQuark = /^\/(s|share)\//.test(location.pathname);
            if (isSharePageQuark) {
                buttonWrapper.style.cssText =
                    "display: inline-block; margin-left: 16px;";
                buttonWrapper.innerHTML = `
            <button type="button" class="ant-btn ant-btn-primary" style="background: #52c41a; border-color: #52c41a; height: 40px;">
                <svg style="width: 16px; height: 16px; margin-right: 4px; vertical-align: -3px;" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                <span>生成JSON</span>
            </button>`;
                container.appendChild(buttonWrapper);
            } else {
                buttonWrapper.style.cssText =
                    "display: inline-block; margin-right: 16px;";
                buttonWrapper.innerHTML = `
            <div class="ant-upload ant-upload-select ant-upload-select-text">
                <button type="button" class="ant-btn ant-btn-primary" style="background: #52c41a; border-color: #52c41a;">
                    <svg style="width: 16px; height: 16px; margin-right: 4px; vertical-align: -3px;" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                    <span>生成JSON</span>
                </button>
            </div>`;
                container.insertBefore(buttonWrapper, container.firstChild);
            }
            buttonWrapper.querySelector("button").onclick = generateJson;
        }
    }

    function init() {
        const SCRIPT_VERSION = GM_info.script.version;
        const LAST_VERSION = GM_getValue("last_version", "0");

        if (SCRIPT_VERSION > LAST_VERSION) {
            utils.showUpdateDialog();
            GM_setValue("last_version", SCRIPT_VERSION);
        }

        const hostname = location.hostname;
        if (hostname.includes("quark.cn") || hostname.includes("cloud.189.cn")) {
            const observer = new MutationObserver(() => {
                addButton();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            addButton();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
