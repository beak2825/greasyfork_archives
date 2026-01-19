// ==UserScript==
// @name         Block PDF Modification (materialDownload case 9)
// @namespace    https://ez.vtbs.ai/
// @version      1.2
// @description  阻止站点对PDF进行任何改写/加水印，改为直接下载原始PDF
// @author       you
// @match        *://academy.easy-group.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548870/Block%20PDF%20Modification%20%28materialDownload%20case%209%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548870/Block%20PDF%20Modification%20%28materialDownload%20case%209%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 开关：如需临时关闭，控制台执行 window.__blockPdfWatermark = false
    window.__blockPdfWatermark = true;

    // 1) 针对 PDF Blob 的 arrayBuffer() 进行“软拒绝”，触发站点代码的 try/catch 兜底下载原文件
    const origArrayBuffer = Blob.prototype.arrayBuffer;
    if (typeof origArrayBuffer === "function") {
        Blob.prototype.arrayBuffer = function () {
            try {
                // 仅拦截 PDF；其余类型不受影响
                const isPdf =
                    (this.type && this.type.toLowerCase() === "application/pdf") ||
                    // 有些响应未正确设置 type，可再用 size/header 判定；简单保守：若 URL 中含 pdf，可在 XHR 钩子中标记（见下）
                    false;

                if (window.__blockPdfWatermark && isPdf) {
                    // 直接拒绝，令上层 modifyPdf 抛错，从而走到fallback：使用 c.response 原样下载
                    return Promise.reject(new Error("[Userscript] block PDF modification"));
                }
            } catch (e) {
                // 忽略判定异常，回退到原方法
            }
            return origArrayBuffer.call(this);
        };
    }

    // 2) 辅助：标记“明显的 PDF 下载 XHR”，以便在某些站点未设置 Blob.type 时也能识别
    //    我们给 XHR 实例打一个 __isPdfUrl 标记，再在 FileReader/arrayBuffer 判定时也可使用。
    //    这里主要预留扩展，当前脚本未强制使用该标记。
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        try {
            // 简单判断：链接或参数中带 .pdf
            this.__isPdfUrl = /\.pdf(\?|$)/i.test(url);
        } catch (e) {
            /* noop */
        }
        return origOpen.apply(this, arguments);
    };

    // 3) 可选的进一步保险：拦截 pdf-lib 的加载（若全局可见），使其不可用，同样会触发 fallback。
    //    仅在站点把 pdf-lib 暴露到全局时有效；否则没有副作用。
    Object.defineProperty(window, "PDFLib", {
        configurable: true,
        get() {
            if (window.__blockPdfWatermark) {
                // 返回一个“假”对象，调用时会抛错，从而触发 fallback
                return new Proxy(
                    {},
                    {
                        get() {
                            throw new Error("[Userscript] PDFLib disabled by userscript");
                        },
                    }
                );
            }
            return undefined;
        },
        set(v) {
            // 站点若尝试设置 PDFLib，全局仍然可见；此处不阻断 set
            Object.defineProperty(window, "PDFLib", { value: v, writable: true, configurable: true });
        },
    });
})();
