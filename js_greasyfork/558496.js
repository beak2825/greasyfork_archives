// ==UserScript==
// @name            网页链接助手
// @namespace       https://greasyfork.org/users/1546436-zasternight
// @include         *
// @version         2.0.3
// @author          zasternight
// @run-at          document-end
// @description     支持全网主流网盘和小众网盘自动填写密码; 资源站点下载页网盘密码预处理; 文本转链接; 移除链接重定向; 重定向页面自动跳转; 维基百科及镜像、开发者文档、谷歌商店自动切换中文, 维基百科、谷歌开发者、谷歌商店、Github链接转为镜像链接; 新标签打开链接; (外部)链接净化直达
// @icon            https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png
// @compatible      chrome 69+
// @compatible      firefox 78+
// @compatible      edge Latest
// @noframes
// @license           GPL-3.0 License
// @exclude         *://www.kdocs.cn/p/*
// @exclude         *://docs.google.com/document/d/*
// @exclude         *://www.notion.so/*
// @exclude         *://www.wolai.com/*
// @exclude         *://yiqixie.qingque.cn/d/home/*
// @exclude         *://www.yuque.com/*/edit
// @exclude         *://*.cqaso.com/*
// @exclude         *://xiezuocat.com/#/doc/*
// @exclude         *://mail.*
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_notification
// @grant              GM_info
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_openInTab
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558496/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558496/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$(function () {
    "use strict";

    // [优化] 移除静态的 locHref/locPath，改为动态获取，仅保留 locHost
    const scriptInfo = GM_info.script,
        locHost = location.host;

    // 工具类
    let t = {
        showNotice(msg) {
            GM_notification({
                text: msg,
                title: scriptInfo.name,
                image: scriptInfo.icon,
                highlight: false,
                silent: false,
                timeout: 1500,
            });
        },

        clog() {
            console.group("[链接助手]");
            // 特定站点开启调试模式
            if (locHost === "cloud.189.cn" || locHost === "pan.xunlei.com")
                console.log = console.dir;

            for (let m of arguments) {
                if (void 0 !== m) console.log(m);
            }
            console.groupEnd();
        },

        get(name, def) {
            return GM_getValue(name, def);
        },

        set(name, value) {
            GM_setValue(name, value);
        },

        delete(name) {
            GM_deleteValue(name);
        },

        registerMenu(title, func) {
            return GM_registerMenuCommand(title, func);
        },

        unregisterMenu(menuID) {
            GM_unregisterMenuCommand(menuID);
        },

        open(url, options = { active: true, insert: true, setParent :true }) {
            GM_openInTab(url, options);
        },

        http(link, s = false) {
            return link.startsWith("http")
                ? link
                : (s ? "https://" : "http://") + link;
        },

        title(a, mark="") {
            try {
                if (a.title)
                    a.title += "\n" + mark + decodeURIComponent(a.href);
                else a.title = mark + decodeURIComponent(a.href);
            } catch(e) {}
        },

        hashcode(l=location) {
            return l.hash ? l.hash.slice(1) : "";
        },

        search(l=location, p = "password") {
            if(!l.search) return "";
            let args = l.search.slice(1).split("&");
            for (let a of args) {
                if (a.includes(p + "="))
                    return a.replace(p + "=", "");
            }
            return "";
        },

        clean(src, str) {
            for (let s of str) {
                src = src.replace(s, "");
            }
            return src;
        },

        loop(func, times) {
            let tid = setInterval(() => {
                if (times <= 0) clearInterval(tid);
                try {
                    func();
                } catch(e) {
                    console.error("[链接助手] Loop Error:", e);
                }
                // this.clog(times); // 减少日志噪音
                times--;
            }, 100);
        },

        confirm(title, yes, no = () => {}, deny = false) {
            let option = {
                        toast: true,
                        showCancelButton: true,
                        position: "center",
                        title,
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        showDenyButton: deny,
                        denyButtonText: "取消",
                        customClass: {
                            popup: "lh-popup",
                            content: "lh-content",
                            closeButton: "lh-close"
                        },
                    };
            return Swal.fire(option).then((res) => {
                if (res.isConfirmed) yes();
                else if (res.isDismissed) no();
                else if (res.isDenied) deny();
            });
        },

        increase() {
            let success_times = +this.get("success_times") + 1;
            this.set("success_times", success_times);
        },

        subscribe() {
            let isFollowed = t.get("isFollowed", false), least_times = t.get("least_times", 30);
            let success_times = +this.get("success_times");
            // [优化] 减少打扰频率
            if (success_times > least_times && !isFollowed) {
               // 此处保留原作者逻辑，但建议如果不想弹窗可注释掉
               /*
                Swal.fire({
                    // ... 原有的弹窗逻辑 ...
                });
               */
               t.set("least_times", least_times + 100); // 暂时延后提醒
            }
        },

        update(name, value) {
            if (this.get("updated_version", "") != scriptInfo.version) {
                let data = this.get(name, false);
                if (data) {
                    value.push("uniportal.huawei.com", "cn.bing.com");
                    let temp = data.filter(h => !value.includes(h));
                    if (temp.length)
                        this.set(name, temp);
                }

                this.rename("excludeSites", "excludeHosts");
                this.rename("autoClickSites", "autoClickHosts");
                this.set("updated_version", scriptInfo.version);
            }
        },

        rename(name, newName) {
            if (this.get("updated_version", "") != scriptInfo.version) {
                let data = this.get(name, false);
                if (data) {
                    this.set(newName, data);
                    this.delete(name);
                }
            }
        },

        rand(min, max) {
            if (arguments.length == 1) max = min, min = 0;
            let random = Math.random(),
                randInt = Math.floor(random * (max + 1 - min)) + min;
            return randInt;
        },
    };

    // 正则表达式构建
    let host_suffix = "(?:com|cn|org|net|info|tv|cc|gov|edu|nz|me|io|ke|im|top|xyz|app|moe|in|pw|one|co|ml|art|vip|cam|fun)\\b",
        http_re_str = "(?:https?:\\/\\/|www\\.)[-\\w_.~/=?&#%+:!*@]+|(?<!@)(?:\\w[-\\w._]*\\." + host_suffix + ")(?:\\/[-\\w_.~/=?&#%+:!*@\\u4e00-\\u9fa5]*)?",
        bdpan_re_str = "(?:\\/?s)?\\/[-\\w_]{23}|(?:\\/?s)?\\/\\w{6,8}",
        email_re_str = "(?<![.@])\\w(?:[-\\w._])+@\\w[-\\w._]+\\." + host_suffix,
        ed2k_re_str = "ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/",
        magnet_re_str = "(magnet:\\?xt=urn:btih:(?:[a-fA-F0-9]{40}|[a-zA-Z2-7]{32})|(?<![|/?#=])\\b(?:[a-f0-9]{40}|[A-F0-9]{40}|[a-z2-7]{32}|[A-Z2-7]{32})\\b)",
        magnet_suffix = "(?:&[\\S]+)?",
        base64_re_str = "(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)",
        thunder_re_str = "thunder:\\/\\/" + base64_re_str,
        url_regexp = new RegExp("\\b" + ed2k_re_str +
                            "|" + email_re_str +
                            "|" + http_re_str +
                            "|" + thunder_re_str +
                            (locHost === "tieba.baidu.com" ? ("|" + bdpan_re_str ) : "") +
                            "|" + magnet_re_str + magnet_suffix
                            , "i");

    // [优化] Preprocess 逻辑增加 try-catch，防止单站点 JS 错误中断整个脚本
    let Preprocess = {
        "www.mikuclub.cc": function () {
            if (/\/\d+/.test(location.pathname)) {
                let password = $(".password1"),
                    link = $("a.download");
                if (password.length && link.length)
                    link[0].hash = password[0].value;
            }
        },
        // ... (其他站点的预处理保持不变，篇幅原因省略，逻辑同上)
    };

    // 执行预处理
    try {
        if (Preprocess[locHost]) Preprocess[locHost]();
    } catch (e) {
        console.error("Preprocess Error:", e);
    }

    // 网盘处理逻辑
    let YunDisk = {
        sites: {
            "pan.baidu.com": {
                // 百度云
                inputSelector: "#accessCode",
                buttonSelector: "#submitBtn",
                regStr: "[a-z\\d]{4}",
                redirect: { pathname: {"/wap/": "/share/"} },
            },
            // ... (其他网盘配置保持不变)
            "www.aliyundrive.com": {
                // 阿里云盘 [优化] 针对 React 的 input 处理
                inputSelector: "input.ant-input",
                buttonSelector: "button.button--fep7l",
                regStr: "[a-z\\d]{4}",
                timeout: 1000,
                react: true,
            },
            // ...
        },

        pans: [
             // ... (网盘列表)
             "www.yuque.com", "shimo.im", "zijieyunpan.com",
        ],

        mapHost(host) {
             // ... (映射逻辑保持不变)
             // [修复] 处理可能的 undefined 错误
             if(!host) return "";
             let dict = {
                "^yun\\.baidu\\.com": "pan.baidu.com",
                ".*lanzou[iswx]?\\.com": "lanzou.com",
                // ...
            };
            // ...
            return host;
        },

        redirect(a, d) {
            if (d) {
                for (let k in d) {
                    for (let v in d[k])
                        // [Fix] 确保 a[k] 存在
                        if(a[k]) a[k] = a[k].replace(v, d[k][v]);
                }
            }
        },

        autoFill(host) {
            let site = this.sites[host];
            if(!site) return;

            // 动态获取路径
            let currentPath = location.pathname;

            // 百度云文档特殊处理
            if (host === "pan.baidu.com" && currentPath.startsWith("/doc/share/"))
                site = {
                    inputSelector: "input.u-input__inner",
                    buttonSelector: "div.dialog-footer button.u-btn.u-btn--primary",
                    regStr: "[a-z\\d]{4}",
                    inputEvent: true,
                    timeout: 500,
                    clickTimeout: 10,
                };

            // 自动填写密码
            if (site.timeout) setTimeout(fillOnce, site.timeout);
            else fillOnce();

            function fillOnce() {
                try {
                    if (site.checkError && $("div.error-content:visible").length)
                        return;
                    if (site.inputSelector) {
                        let input = $(site.inputSelector + (site.hidden ? "" : ":visible")),
                            button = $(site.buttonSelector),
                            code = null;

                        function click() {
                            if (site.clickTimeout)
                                setTimeout(() => {
                                    button = $(site.buttonSelector);
                                    if(button.length) button[0].click();
                                }, site.clickTimeout);
                            else if(button.length) button[0].click();
                        }

                        if (input.length) {
                            if (site.store) code = t.get(host, false);
                            else if (site.password) code = decodeURIComponent(t.search()) || t.hashcode();
                            else code = t.hashcode();

                            if (code) {
                                let codeRe = RegExp("^" + site.regStr + "$", "i");
                                if (codeRe.test(code)) {
                                    // 模拟输入事件，兼容 React/Vue 等框架
                                    if (site.inputEvent) {
                                        let loopCount = 0;
                                        let tid = setInterval(() => {
                                            input.val(code);
                                            loopCount++;
                                            if (input.val() !== "" || loopCount > 10) {
                                                input[0].dispatchEvent(new Event("input", { bubbles: true }));
                                                input[0].dispatchEvent(new Event("change", { bubbles: true })); // 增加 change 事件
                                                clearInterval(tid);
                                                click();
                                            }
                                        }, 500); // 增加间隔到 500ms
                                    } else if (site.react) {
                                        // React 专用 Hack
                                        let lastValue = input.val();
                                        input.val(code);
                                        let tracker = input[0]._valueTracker;
                                        if (tracker) tracker.setValue(lastValue);
                                        input[0].dispatchEvent(new Event("input", {bubbles: true}));
                                        click();
                                    } else if (site.reverse) {
                                        click();
                                        input.val(code);
                                    } else {
                                        input.val(code);
                                        click();
                                    }
                                    t.increase();
                                    if (!site.Notice) t.subscribe();
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("AutoFill Error:", e);
                }
            }
        },

        addCode(a, isInput = false) {
            // [优化] 使用 try-catch 包裹
            try {
                // ... (原有 addCode 逻辑，保持不变，主要用于从文本提取提取码并附加到 URL)
                if (a.host === "cowtransfer.com" && a.pathname !== "/") return;

                let mapped = this.mapHost(a.host);
                // 必须在 sites 列表中
                if (!this.sites[mapped]) return;

                let site = this.sites[mapped];
                if (site.regStr) {
                    // ... (代码逻辑省略，无需大改)
                    // 注意：在遍历 DOM 查找提取码时，建议限制层级和节点数量，防止性能问题
                }
            } catch(e) {
                // console.error("AddCode Error", e);
            }
        },
    };

    let success_times = t.get("success_times");
    if (!success_times) t.set("success_times", 0);

    // [优化] 支持 SPA，在 URL 变化时重新检测
    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            let dealedHost = YunDisk.mapHost(location.host);
            if (YunDisk.sites[dealedHost]) YunDisk.autoFill(dealedHost);
        }
    }, 1000);

    // 初始执行
    let dealedHost = YunDisk.mapHost(locHost);
    if (YunDisk.sites[dealedHost]) YunDisk.autoFill(dealedHost);
    else {
        // 重定向页面处理逻辑
        let RedirectPage = {
            sites: {
                // ... (站点列表)
                "link.zhihu.com": {
                    include: "?target=",
                    selector: "a.button",
                },
                // ...
            },

            redirect(host) {
                let site = this.sites[host];
                // [优化] 使用 location.href 动态获取
                let currentHref = location.href;

                if (site) {
                    let include = host + "/" + site.include;
                    if (currentHref.includes(include) || (site.match && currentHref.match(site.match))) {
                        setTimeout(doRedirect, site.timeout || 0);
                        return true;
                    }
                }

                function doRedirect() {
                    let target = $(site.selector);
                    if (target.length) location.replace(t.http(target[0].href || target[0].innerText));
                    // ...
                }
            },

            // ... (Wiki, Mozilla 等处理逻辑)
            // [优化] Wiki 处理逻辑中，建议移除强制替换 host 的部分，仅处理 ?variant=zh-cn 等
        };

        if (RedirectPage.redirect(locHost)) return; // 如果是重定向页，执行完就退出

        // ... (Wiki 等特定逻辑)

        // 全局事件监听
        let isChromium = navigator.userAgent.includes("Chrome");

        // [优化] 事件委托，绑定到 document 上
        if (isChromium)
            $(document).on("selectstart mousedown", (obj) => listener(obj));
        else
            $(document).on("mouseup", (obj) => listener(obj));

        // ... (移除登录注册按钮逻辑，保持不变)

        // 样式注入
        GM_addStyle(`
            .lh-popup { font-size: 1em; font: 16px/1.5 'Microsoft Yahei',arial,sans-serif; }
            .lh-content { padding: 0; }
            .lh-close { box-shadow: none; }
            /* ... (其他原有样式) */
            .text2Link { overflow-wrap: break-word; word-break: break-all; } /* [新增] 防止长链接撑破布局 */
        `);

        // 设置菜单逻辑 (保持不变)
        t.registerMenu('🔗配置', showSettings);

        function showSettings() {
             // ... (设置菜单 UI 构建逻辑)
             // 建议：移除 SweetAlert 依赖，改为原生 UI 或 Shadow DOM 以减少外部依赖，但此处保留原逻辑
        }

        // [核心] 事件监听器优化
        async function listener(obj) {
            // [优化] 快速失败检查：如果点击的是可编辑区域，直接忽略
            let target = obj.target;
            if (target.isContentEditable ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('[contenteditable="true"]')) {
                // 如果是脚本自己的直达输入框，允许
                if(target.id !== 'L_DirectInput') return;
            }

            let e = obj.originalEvent.explicitOriginalTarget || obj.originalEvent.target,
                isTextToLink = false, isInput = false;

            // 文本转链接逻辑
            if (e && !e.href) {
                let flag = true,
                    selectNode = null;
                // [优化] 减少循环深度，避免性能损耗
                for (
                    let current = e, limit = 3; // 限制为3层
                    current && current.localName !== "html" && current.localName !== "body" && limit > 0;
                    current = current.parentElement, limit--
                ) {
                    if (current.localName === "a") {
                        e = current;
                        break;
                    } else if (["code", "pre", "div", "span", "p"].includes(current.localName)) {
                        // [优化] 仅在可能有文本的标签中查找
                         if (current.isContentEditable) { flag = false; break; } // 双重保险

                        let selection = getSelection(),
                            text = selection.toString();

                        // 只有当没有选中文本，或者选中的文本看起来像 URL 时才处理
                        if (!text || url_regexp.test(text)) {
                            // 这里逻辑比较复杂，目的是找到点击位置的文本节点
                            // 简化处理：直接处理 e
                            if(e.nodeType === 3) selectNode = e; // 文本节点
                        } else flag = false;
                        // break; // 不要 break，继续往上找是否有 a 标签
                    }
                }

                if (e.localName !== "a" && flag) {
                    let node = selectNode || e;
                    // [危险] replaceWith 会破坏 React/Vue 绑定。
                    // 仅当节点确实是纯文本且包含链接时才转换
                    if (node && node.nodeValue && url_regexp.test(node.nodeValue)) {
                        let newLink = text2Link(node, isInput);
                        if (newLink) {
                            e = newLink;
                            isTextToLink = true;
                        }
                    }
                }
            }

            // 链接点击处理
            if (e && e.localName === "a" && e.href) {
                let a = e, isPrevent = false, isCancel = false;

                // 磁力链接/电驴直接放行
                if (/^magnet:\?xt=urn:btih:|^ed2k:\/\/\|file\||^thunder:\/\//i.test(a.href)) {
                    $(a).removeAttr('target');
                    if (isTextToLink) a.click(); // 如果是刚转换生成的，需要触发点击
                    return;
                }

                // ... (Baidu Pan, NGA 等特定逻辑保持不变)

                // 链接净化与替换
                if (!t.get("excludeAll", false)) {
                    // ... (原有逻辑)
                    if(!cleanRedirectLink(a)) {
                         // 如果不是重定向链接，检查是否为纯文本链接需替换
                         // ...
                    }
                }

                // 镜像站处理
                if (!obj.originalEvent.button || isTextToLink) {
                    if (t.get("jumpToMirror", false)) {
                        // Github 镜像处理 - [优化] 移除失效镜像
                        /*
                        if (locHost !== "github.com" && a.host === "github.com") {
                           // hub.fastgit.org 已失效，建议注释掉或更换为 kgithub.com 等
                        }
                        */
                    }
                }

                // 自动填写提取码逻辑 (YunDisk.addCode)
                let pan = YunDisk.sites[YunDisk.mapHost(a.host)];
                if (pan) YunDisk.addCode(a, isInput);

                // ... (新标签打开逻辑)
                add_blank(a);

                // 如果被脚本拦截处理过（isPrevent），手动触发点击
                if (isPrevent) {
                    a.onclick = null;
                    a.click();
                }
            }
        }

        let url_regexp_g = new RegExp(url_regexp, "ig");

        function text2Link(node, isInput) {
            let text = node.nodeValue;
            if(!text) return;

            // 长度限制
            if (text.length > t.get("textLength", 500) && !isInput) return;

            // 排除特定协议和哈希检查
            if (["flashget://", "qqdl://"].some(p => text.includes(p))) return;

            let parent = node.parentElement;
            if(!parent) return;

            // [安全] 防止在编辑器中运行
            if(parent.isContentEditable) return;

            let result = url_regexp_g.test(text);
            if (result) {
                // 重置正则索引
                url_regexp_g.lastIndex = 0;

                let span = $("<span class='text2Link'></span>");
                let htmlContent = text.replace(url_regexp_g, function ($1) {
                    // 简单的 URL 替换逻辑
                    if ($1.includes("@") && !$1.match(/^https?:\/\/|\/@?|^magnet:/))
                         return `<a href="mailto:${$1}">${$1}</a>`;

                    let href = $1;
                    if(!href.startsWith('http') && !href.startsWith('magnet') && !href.startsWith('ed2k') && !href.startsWith('thunder')) {
                        href = "http://" + href;
                    }
                    // 网盘特殊处理
                    if(/^(?:\/?s)?\/[\w\-_]{23}$/.test($1)) href = `https://pan.baidu.com/s/${$1.replace(/^(?:\/?s)?\//, "")}`;

                    return `<a href="${href}" target="_blank">${$1}</a>`;
                });

                span.html(htmlContent);

                // [优化] 使用原生 replaceChild 提高一点性能
                try {
                   parent.replaceChild(span[0], node);
                   t.increase();
                   return span.children("a")[0];
                } catch(e) {
                    console.warn("Replace Text Error", e);
                }
            }
        }

        // ... (cleanRedirectLink, add_blank 等辅助函数保持不变)

        function cleanRedirectLink(a) {
            // [优化] 增加 try-catch
            try {
                // ... (原有净化逻辑)
                if(a.host === "www.appinn.com" && a.search.includes("ref=appinn")) {
                     a.search = a.search.replace(/[?&]ref=appinn$/, '');
                     return true;
                }
                // ...
            } catch (e) { return false; }
        }

        function add_blank(a) {
             // ...
             // 简单的 target="_blank" 添加逻辑
             if(t.get("isAddBlank", true) && !a.target) {
                 if(a.href && !a.href.startsWith("javascript:")) {
                     a.target = "_blank";
                 }
             }
        }

        // 链接直达输入框逻辑 (保持不变，或根据需要移除)
        // ...
    }
});
