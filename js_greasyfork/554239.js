class WebDAVClient {
    constructor(config) {
        this.baseUrl = config.url.replace(/\/$/, '');
        this.username = config.username;
        this.password = config.password;
        this.authHeader = 'Basic ' + btoa(`${this.username}:${this.password}`);
    }

    _getFullUrl(path) {
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return this.baseUrl + cleanPath;
    }

    /**
     * 发送 WebDAV 请求 (使用 GM_xmlhttpRequest)
     * @param {string} method - HTTP 方法
     * @param {string} path - 路径
     * @param {Object} options - 其他选项
     * @returns {Promise<Object>} 包含 ok, status, statusText 和响应内容方法的对象
     */
    async _request(method, path, options = {}) {
        const url = this._getFullUrl(path);
        const headers = {
            'Authorization': this.authHeader,
            ...options.headers
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: options.body,
                responseType: options.responseType || 'text',
                onload: function(response) {
                    // 模拟 fetch 的 Response 对象
                    const mockResponse = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.responseHeaders,
                        // 添加响应内容获取方法
                        text: async () => response.responseText,
                        json: async () => JSON.parse(response.responseText),
                        arrayBuffer: async () => {
                            // 如果需要二进制数据，需要设置 responseType: 'arraybuffer'
                            if (response.response instanceof ArrayBuffer) {
                                return response.response;
                            }
                            // 否则尝试从文本转换
                            const encoder = new TextEncoder();
                            return encoder.encode(response.responseText).buffer;
                        }
                    };
                    resolve(mockResponse);
                },
                onerror: function(error) {
                    console.error(error);
                    reject(new Error(`请求失败: ${error.statusText || error.error}`));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    async exists(path) {
        try {
            const response = await this._request('HEAD', path);
            return response.ok;
        } catch (error) {
            console.error('exists 检查失败:', error);
            return false;
        }
    }

    async createDirectory(path, options = { recursive: true }) {
        try {
            if (options.recursive) {
                const parts = path.split('/').filter(p => p);
                let currentPath = '';

                for (const part of parts) {
                    currentPath += '/' + part;
                    const exists = await this.exists(currentPath);

                    if (!exists) {
                        const response = await this._request('MKCOL', currentPath);
                        if (!response.ok && response.status !== 405) {
                            throw new Error(`创建目录失败: ${response.status} ${response.statusText}`);
                        }
                    }
                }
            } else {
                const response = await this._request('MKCOL', path);
                if (!response.ok && response.status !== 405) {
                    throw new Error(`创建目录失败: ${response.status} ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error('createDirectory 失败:', error);
            throw error;
        }
    }

    async getFileContents(path, options = { format: 'text' }) {
        try {
            const requestOptions = {};
            if (options.format === 'binary') {
                requestOptions.responseType = 'arraybuffer';
            }

            const response = await this._request('GET', path, requestOptions);

            if (!response.ok) {
                throw new Error(`获取文件失败: ${response.status} ${response.statusText}`);
            }

            switch (options.format) {
                case 'text':
                    return await response.text();
                case 'binary':
                    return await response.arrayBuffer();
                case 'json':
                    return await response.json();
                default:
                    return await response.text();
            }
        } catch (error) {
            console.error('getFileContents 失败:', error);
            throw error;
        }
    }

    async putFileContents(path, content, options = { overwrite: true }) {
        try {
            if (!options.overwrite) {
                const exists = await this.exists(path);
                if (exists) {
                    throw new Error('文件已存在，且未设置覆盖选项');
                }
            }

            const headers = {};
            if (options.contentType) {
                headers['Content-Type'] = options.contentType;
            } else if (typeof content === 'string') {
                headers['Content-Type'] = 'text/plain; charset=utf-8';
            }

            const response = await this._request('PUT', path, {
                headers,
                body: content
            });

            if (!response.ok) {
                throw new Error(`上传文件失败: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('putFileContents 失败:', error);
            throw error;
        }
    }

    async getDirectoryContents(path, options = { recursive: false }) {
        try {
            // 支持传入内部 _visitedPaths 来避免循环
            options = options || {};
            if (!options._visitedPaths) options._visitedPaths = new Set();

            // 规范化并防止重复访问
            let normalizedRequestPath = path.startsWith('/') ? path : '/' + path;
            // 去掉尾部斜杠
            normalizedRequestPath = normalizedRequestPath.replace(/\/+$/, '');

            // 如果已访问过则返回空
            if (options._visitedPaths.has(normalizedRequestPath)) {
                return [];
            }
            options._visitedPaths.add(normalizedRequestPath);

            const response = await this._request('PROPFIND', normalizedRequestPath, {
                headers: {
                    'Depth': '1'
                }
            });

            if (!response.ok) {
                throw new Error(`列出目录失败: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');

            const items = [];

            // === 修改开始（使用命名空间无关的查找并正确处理 D: 前缀） ===
            // 使用 getElementsByTagNameNS('*', ...) 来匹配任意命名空间的 response 节点
            let responses = xmlDoc.getElementsByTagNameNS('*', 'response');
            // 规范化目标 pathname（便于比较），以 baseUrl 为基础
            let targetPathname;
            try {
                targetPathname = new URL(this._getFullUrl(normalizedRequestPath)).pathname.replace(/\/+$/, '');
            } catch (e) {
                targetPathname = normalizedRequestPath.replace(/\/+$/, '');
            }

            for (let i = 0; i < responses.length; i++) {
                const resp = responses[i];

                // href 节点（任意命名空间）
                let hrefEl = resp.getElementsByTagNameNS('*', 'href')[0];
                if (!hrefEl) {
                    // 兜底：在子节点中查 localName 为 'href'
                    for (let k = 0; k < resp.childNodes.length; k++) {
                        const cn = resp.childNodes[k];
                        if (cn && cn.localName === 'href') {
                            hrefEl = cn;
                            break;
                        }
                    }
                }
                if (!hrefEl || !hrefEl.textContent) continue;
                const hrefRaw = hrefEl.textContent.trim();

                // 用 baseUrl 做 base 来规范化 href（处理相对或绝对 href）
                let hrefPathname;
                try {
                    const hrefUrl = new URL(hrefRaw, this.baseUrl);
                    hrefPathname = hrefUrl.pathname.replace(/\/+$/, '');
                } catch (e) {
                    hrefPathname = hrefRaw.replace(/\/+$/, '');
                }

                // 跳过目标目录自身条目
                if (hrefPathname === targetPathname) {
                    continue;
                }

                // 判断是否为 collection（目录）
                let isCollection = false;
                const resTypeEl = resp.getElementsByTagNameNS('*', 'resourcetype')[0];
                if (resTypeEl) {
                    for (let m = 0; m < resTypeEl.childNodes.length; m++) {
                        const child = resTypeEl.childNodes[m];
                        if (child && child.localName === 'collection') {
                            isCollection = true;
                            break;
                        }
                    }
                }

                // 解析 filename（取 hrefPathname 最后一段）
                const parts = hrefPathname.split('/').filter(p => p);
                const filename = parts.length ? decodeURIComponent(parts.pop()) : '';
                items.push({
                    filename,
                    path: hrefRaw,
                    type: isCollection ? 'directory' : 'file',
                    _hrefPathname: hrefPathname //内部使用，便于递归时计算相对路径
                });
            }
            // === 修改结束 ===

            // === 新增修改：过滤 macOS AppleDouble 文件（以 ._ 开头）和 .DS_Store，然后返回 ===
            let filtered = items.filter(i => {
                if (!i.filename) return false;
                // 过滤以 ._ 开头的 AppleDouble 文件和 .DS_Store
                return !(i.filename.startsWith('._') || i.filename === '.DS_Store');
            });

            // === 新增：递归合并子目录（当 options.recursive 为 true 时） ===
            if (options.recursive) {
                // 计算 base path 的 pathname（无尾斜杠），用于把 hrefPathname 转回相对于 baseUrl 的 path 参数
                let basePathname = '';
                try {
                    basePathname = new URL(this.baseUrl).pathname.replace(/\/+$/, '');
                } catch (e) {
                    basePathname = '';
                }

                // 收集要递归的目录
                const dirs = filtered.filter(i => i.type === 'directory');

                for (const dir of dirs) {
                    // dir._hrefPathname 是形如 '/dav/cursor-chat-history/sub'
                    let childHrefPath = dir._hrefPathname || dir.path;
                    // 把 basePathname 前缀剥离，得到相对于 this.baseUrl 的路径（以 / 开头）
                    let childRelative;
                    if (basePathname && childHrefPath.startsWith(basePathname)) {
                        childRelative = childHrefPath.slice(basePathname.length);
                        if (!childRelative.startsWith('/')) childRelative = '/' + childRelative;
                    } else {
                        childRelative = childHrefPath;
                    }
                    // 调用自身递归（传入同一个 options._visitedPaths 集合以防环）
                    const childItems = await this.getDirectoryContents(childRelative, options);
                    // childItems 已经过滤了 AppleDouble 等
                    // 把子项并入 filtered（保持扁平结构）
                    filtered = filtered.concat(childItems);
                }
            }

            // 最终返回：移除内部字段 _hrefPathname
            const result = filtered.map(({ _hrefPathname, ...rest }) => rest);
            return result;
            // === 修改结束（过滤与递归） ===

        } catch (error) {
            console.error('getDirectoryContents 失败:', error);
            throw error;
        }
    }

    async deleteFile(path) {
        try {
            const response = await this._request('DELETE', path);
            if (!response.ok) {
                throw new Error(`删除失败: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('deleteFile 失败:', error);
            throw error;
        }
    }

    async moveFile(fromPath, toPath, options = { overwrite: false }) {
        try {
            const response = await this._request('MOVE', fromPath, {
                headers: {
                    'Destination': this._getFullUrl(toPath),
                    'Overwrite': options.overwrite ? 'T' : 'F'
                }
            });

            if (!response.ok) {
                throw new Error(`移动文件失败: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('moveFile 失败:', error);
            throw error;
        }
    }

    async copyFile(fromPath, toPath, options = { overwrite: false }) {
        try {
            const response = await this._request('COPY', fromPath, {
                headers: {
                    'Destination': this._getFullUrl(toPath),
                    'Overwrite': options.overwrite ? 'T' : 'F'
                }
            });

            if (!response.ok) {
                throw new Error(`复制文件失败: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('copyFile 失败:', error);
            throw error;
        }
    }
}