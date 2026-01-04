class webdav {
    constructor(account, password) {
        this.account = account;
        this.password = password;
        this.headers = { "authorization": `Basic ${btoa(this.account + ':' + this.password)}` };
    }

    create_folder(path) {
        let url = `https://dav.jianguoyun.com/dav/${path}/`
        let type = "MKCOL"
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: this.headers,
                    url: url,
                    onload: complete,
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    }

    upload_file(path, name, data) {
        let url = `https://dav.jianguoyun.com/dav/${path}/${name}`
        let type = "PUT" // 上传
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    data: data,
                    headers: this.headers,
                    url: url,
                    onload: function (response) {
                        if (response.status == 201 || response.status == 204) {
                            complete(true);
                        } else {
                            console.error(response);
                            complete(false);
                        }
                    },
                    onerror: error,
                    ontimeout: error
                })
            }
        )

    }

    download_file(path, name) {
        let url = `https://dav.jianguoyun.com/dav/${path}/${name}`
        let type = "GET" // 下载
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: this.headers,
                    url: url,
                    onload: function (response) {
                        if (response.status == 200) {
                            complete(response.responseText)
                        } else {
                            console.error(response)
                            complete(false)
                        }
                    },
                    onerror: error,
                    ontimeout: error
                })
            }
        )

    }

    get_all_files(path, depth) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PROPFIND",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: {
                    "Authorization": `Basic ${btoa(this.account + ':' + this.password)}`,
                    "Depth": depth
                },
                onload: function (response) {
                    if (response.status == 207) {
                        const parser = new DOMParser();
                        const xml_doc = parser.parseFromString(response.responseText, "text/xml");
                        const responses = Array.from(xml_doc.getElementsByTagNameNS("DAV:", "response"));
                        const urls = responses
                            .map(res => {
                                const href = res.getElementsByTagNameNS("DAV:", "href")[0]?.textContent;
                                const propstat = res.getElementsByTagNameNS("DAV:", "propstat")[0];
                                const status = propstat?.getElementsByTagNameNS("DAV:", "status")[0]?.textContent || "";
                                if (!status.includes("200 OK")) return null;

                                const resourcetype = propstat.getElementsByTagNameNS("DAV:", "resourcetype")[0];
                                const is_collection = resourcetype?.getElementsByTagNameNS("DAV:", "collection").length > 0;
                                return href + (is_collection ? "/" : "");
                            }).filter(Boolean);
                        resolve(urls);
                    }
                    else {
                        console.error(response);
                        reject(new Error("The request failed with status code " + response.status));
                    }
                }
            });
        });
    }

    exists(path) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: this.headers,
                onload: function (response) {
                    const status = response.status;
                    if (status == 200) {
                        resolve(true);
                    }
                    else if (status == 404) {
                        resolve(false);
                    } else if (status == 403) {
                        resolve(false);
                    } else {
                        reject("The status code is " + status + " and the status text is " + response.statusText);
                    }
                }
            })
        })
    }

    run(file_name, filters, callback) {
        const time = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
        const update_name = `${file_name}-${time}.json`;
        if (GM_getValue('UploadTiem', null) != time) {
            const ScriptData = {};
            GM_listValues().forEach((key) => {
                if (filters.indexOf(key) == -1) {
                    ScriptData[key] = GM_getValue(key);
                }
            })
            const update_data = JSON.stringify(ScriptData);
            const update_path = "application/" + file_name;
            this.exists(update_path).then(async r => {
                if (!r) { // 文件夹不存在则创建文件夹
                    await this.create_folder(update_path)
                }
                console.log(file_name, update_path, update_name, update_data);
                const status = await this.upload_file(update_path, update_name, update_data);
                if (status) {
                    console.log(file_name, "上传成功");
                    GM_setValue('UploadTiem', time);
                    if (callback != null) {//回调
                        callback.call(this);
                    }
                    return true;
                }
                return false;
            })
        }
    }
}