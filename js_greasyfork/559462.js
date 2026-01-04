// ==UserScript==
// @name         2026最新可用-百度网盘SVIP高速解析直链的不限速下载助手 | HcxBaiduDownload
// @namespace    https://tampermonkey.net/
// @author       huancaixi
// @version      1.0.5
// @description  百度网盘文件高速下载工具，自动处理文件重命名，支持小于150M文件快速下载
// @match        https://pan.baidu.com/disk/main*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        unsafeWindow
// @connect      pan.baidu.com
// @connect      baidupcs.com
// @connect      fc-mp-29d4e8f2-0ccc-4944-8cc2-6d0cd0564714.next.bspapp.com
// @license      MIT
// @icon         data:image/jpg;base64,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
// @homepage     https://greasyfork.org/zh-CN/scripts/559462-2026%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-hcxbaidudownload
// @downloadURL https://update.greasyfork.org/scripts/559462/2026%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%7C%20HcxBaiduDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/559462/2026%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%7C%20HcxBaiduDownload.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    DEBUG_MODE: false,
    LOG_PREFIX: "[HcxBaiduDownload]",
    FILE_PATTERN: /^.+\..+\.pdf$/i,
    WAIT_TIME_AFTER_RENAME: 3000,
    BUTTON_TEXT: "极速下载",
    BUTTON_CLASS: "hcx-baidu-download-btn",
    DOWNLOAD_COUNT_KEY: "hcx_download_count",
    VERIFY_INTERVAL: 3,
    QRCODE_URL: "https://huancaixi.vip/assets/image/wx_miniapp_pan.jpg",
  };

  const Logger = {
    info: (...args) =>
      CONFIG.DEBUG_MODE && console.log(CONFIG.LOG_PREFIX, ...args),
    warn: (...args) =>
      CONFIG.DEBUG_MODE && console.warn(CONFIG.LOG_PREFIX, ...args),
    error: (...args) => console.error(CONFIG.LOG_PREFIX, ...args),
  };

  // ==================== DOM 工具类 ====================
  class DomHelper {
    static getFileListTable() {
      const xpath =
        "/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/table/tbody";
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue;
    }

    static getFileNameFromRow(row) {
      const linkElement = row.querySelector("td:nth-child(2) a[title]");
      if (linkElement) {
        return (
          linkElement.getAttribute("title") ||
          linkElement.textContent ||
          ""
        ).trim();
      }
      return "";
    }

    static getFileIdFromRow(row) {
      const id = row.getAttribute("data-id") || row.getAttribute("node-key");
      return id ? parseInt(id) : null;
    }

    static isFileRow(fileName) {
      // 文件名包含扩展名（有点号），文件夹通常没有扩展名
      return fileName.indexOf(".") >= 0;
    }

    static getLastCellFromRow(row) {
      const cells = row.querySelectorAll("td");
      return cells.length > 0 ? cells[cells.length - 1] : null;
    }
  }

  // ==================== 路径工具类 ====================
  class PathHelper {
    static getCurrentDirectory() {
      const hashMatch = location.hash.match(/[?&]path=([^&]+)/);
      let path = hashMatch ? decodeURIComponent(hashMatch[1]) : "/";

      if (!path.startsWith("/")) path = "/" + path;
      if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

      return path;
    }

    static buildFullPath(fileName) {
      const directory = this.getCurrentDirectory();
      const cleanName = String(fileName || "").replace(/^\/+/, "");
      return directory === "/" ? `/${cleanName}` : `${directory}/${cleanName}`;
    }
  }

  // ==================== Token 管理类 ====================
  class TokenManager {
    static getBdsToken() {
      try {
        const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

        if (win?.locals?.userInfo?.bdstoken) {
          Logger.info("Token 获取成功:", win.locals.userInfo.bdstoken);
          return win.locals.userInfo.bdstoken;
        }

        Logger.warn("无法获取 BDS Token");
        return null;
      } catch (err) {
        Logger.error("获取 Token 异常:", err);
        return null;
      }
    }
  }

  // ==================== API 请求类 ====================
  class BaiduPanAPI {
    static buildDownloadUrl(filePath) {
      const url = new URL("https://pan.baidu.com/api/locatedownload");
      const params = {
        clienttype: "0",
        app_id: "250528",
        web: "1",
        channel: "chunlei",
        path: filePath,
        origin: "pdf",
        use: "1",
      };

      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value)
      );

      const token = TokenManager.getBdsToken();
      if (token) url.searchParams.set("bdstoken", token);

      return url.toString();
    }

    static async renameFileOnServer(fileId, originalPath, newName) {
      const url = new URL("https://pan.baidu.com/api/filemanager");
      const params = {
        async: "2",
        onnest: "fail",
        opera: "rename",
        clienttype: "0",
        app_id: "250528",
        web: "1",
      };

      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value)
      );

      const token = TokenManager.getBdsToken();
      if (token) url.searchParams.set("bdstoken", token);

      const fileList = JSON.stringify([
        {
          id: fileId,
          path: originalPath,
          newname: newName,
        },
      ]);

      Logger.info("重命名请求:", { fileId, originalPath, newName });

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: url.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Referer: "https://pan.baidu.com/",
            "X-Requested-With": "XMLHttpRequest",
          },
          data: `filelist=${encodeURIComponent(fileList)}`,
          responseType: "json",
          anonymous: false,
          onload: (response) => {
            try {
              const data =
                response.response ?? JSON.parse(response.responseText || "{}");
              Logger.info("重命名响应:", data);

              if (data.errno === 0) {
                resolve(data);
              } else {
                reject(
                  new Error(
                    `重命名失败 [${data.errno}]: ${
                      data.show_msg || data.errmsg || "未知错误"
                    }`
                  )
                );
              }
            } catch (err) {
              Logger.error("解析响应失败:", err);
              reject(err);
            }
          },
          onerror: (err) => {
            Logger.error("请求失败:", err);
            reject(err);
          },
          ontimeout: (err) => {
            Logger.error("请求超时:", err);
            reject(err);
          },
        });
      });
    }

    static async getDownloadLink(filePath) {
      const apiUrl = this.buildDownloadUrl(filePath);

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: apiUrl,
          responseType: "json",
          anonymous: false,
          headers: {
            Referer: "https://pan.baidu.com/",
            "X-Requested-With": "XMLHttpRequest",
          },
          onload: (response) => {
            try {
              const data =
                response.response ?? JSON.parse(response.responseText || "{}");
              Logger.info("下载链接响应:", data);

              const dlink = this._extractDownloadLink(data);
              if (dlink) {
                resolve(dlink);
              } else {
                // 提示基础版无法下载大于150mb文件
                const errorMsg =
                  "基础版无法下载大于150MB文件，请升级账户或选择较小的文件";
                this._showErrorDialog(errorMsg);
                reject(new Error(errorMsg));
              }
            } catch (err) {
              reject(err);
            }
          },
          onerror: reject,
          ontimeout: reject,
        });
      });
    }

    static _extractDownloadLink(obj) {
      if (!obj || typeof obj !== "object") return null;

      if (typeof obj.dlink === "string" && obj.dlink) return obj.dlink;
      if (obj.data?.dlink) return obj.data.dlink;

      for (const key in obj) {
        if (obj[key] && typeof obj[key] === "object") {
          const result = this._extractDownloadLink(obj[key]);
          if (result) return result;
        }
      }

      return null;
    }

    static _showErrorDialog(message) {
      // 创建遮罩层
      const overlay = document.createElement("div");
      overlay.className = "hcx-error-overlay";

      // 创建错误提示弹窗
      const modal = document.createElement("div");
      modal.className = "hcx-error-modal";
      modal.innerHTML = `
        <div class="hcx-error-header">
          <h3>⚠️ 下载失败</h3>
        </div>
        <div class="hcx-error-body">
          <p class="hcx-error-message">${message}</p>
        </div>
        <div class="hcx-error-footer">
          <button type="button" class="hcx-error-confirm">确定</button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      const confirmBtn = modal.querySelector(".hcx-error-confirm");

      // 关闭弹窗函数
      const closeModal = () => {
        overlay.remove();
      };

      // 确定按钮
      confirmBtn.addEventListener("click", () => {
        closeModal();
      });

      // 点击遮罩层关闭
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });

      // 自动聚焦按钮
      setTimeout(() => confirmBtn.focus(), 100);
    }
  }

  // ==================== 下载管理类 ====================
  class DownloadManager {
    static async downloadFile(downloadUrl, fileName, onProgress) {
      const saveName = fileName.replace(/\.pdf$/i, "");

      try {
        await this._downloadViaBlob(downloadUrl, saveName, onProgress);
        Logger.info("下载完成:", saveName);
      } catch (err) {
        Logger.warn("Blob下载失败，尝试备用方案:", err);
        try {
          await this._downloadViaGM(downloadUrl, saveName);
        } catch (err2) {
          Logger.error("所有下载方式均失败:", err2);
          throw err2;
        }
      }
    }

    static _downloadViaBlob(url, saveName, onProgress) {
      return new Promise((resolve, reject) => {
        Logger.info("使用 Blob 下载:", saveName);

        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: "arraybuffer",
          anonymous: false,
          headers: { Referer: "https://pan.baidu.com/" },
          onprogress: (event) => {
            if (event.lengthComputable) {
              const progress = event.loaded / event.total;
              if (onProgress) onProgress(progress);

              const progressPercent = (progress * 100).toFixed(1);
              if (progressPercent % 10 < 0.2)
                Logger.info(`下载进度: ${progressPercent}%`);
            }
          },
          onload: (response) => {
            try {
              const contentType =
                (response.responseHeaders || "")
                  .match(/content-type:\s*([^\r\n]+)/i)?.[1]
                  ?.trim() || "application/octet-stream";

              const buffer = response.response;
              if (!buffer) throw new Error("响应数据为空");

              const blob = new Blob([buffer], { type: contentType });
              const blobUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = blobUrl;
              link.download = saveName;
              document.body.appendChild(link);
              link.click();
              link.remove();

              setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          onerror: reject,
          ontimeout: reject,
        });
      });
    }

    static _downloadViaGM(url, saveName) {
      return new Promise((resolve, reject) => {
        try {
          GM_download({
            url: url,
            name: saveName,
            headers: { Referer: "https://pan.baidu.com/" },
            onload: () => {
              Logger.info("GM_download 完成");
              resolve();
            },
            onerror: (err) => {
              Logger.warn("GM_download 失败:", err);
              reject(err);
            },
            ontimeout: () => {
              Logger.warn("GM_download 超时");
              reject(new Error("下载超时"));
            },
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  }

  // ==================== 验证码管理类 ====================
  class VerifyManager {
    static getDownloadCount() {
      const count = localStorage.getItem(CONFIG.DOWNLOAD_COUNT_KEY);
      return count ? parseInt(count) : 0;
    }

    static incrementDownloadCount() {
      const count = this.getDownloadCount() + 1;
      localStorage.setItem(CONFIG.DOWNLOAD_COUNT_KEY, count.toString());
      return count;
    }

    static resetDownloadCount() {
      localStorage.setItem(CONFIG.DOWNLOAD_COUNT_KEY, "0");
    }

    static needsVerification() {
      const count = this.getDownloadCount();
      return count > 0 && count % 3 === 0;
    }

    static async verifyCode(code) {
      return new Promise((resolve, reject) => {
        const verifyUrl = `https://fc-mp-29d4e8f2-0ccc-4944-8cc2-6d0cd0564714.next.bspapp.com/api/system/checkPanCode?code=${encodeURIComponent(
          code
        )}`;

        Logger.info("验证验证码:", code);

        GM_xmlhttpRequest({
          method: "GET",
          url: verifyUrl,
          responseType: "json",
          timeout: 10000,
          onload: (response) => {
            try {
              const data =
                response.response ?? JSON.parse(response.responseText || "{}");
              Logger.info("验证响应:", data);

              if (data.errCode === 0) {
                if (data.data === true) {
                  Logger.info("验证码正确");
                  resolve(true);
                } else {
                  Logger.warn("验证码错误");
                  reject(new Error("验证码错误或已过期"));
                }
              } else {
                reject(new Error(`验证失败: ${data.errMsg || "未知错误"}`));
              }
            } catch (err) {
              Logger.error("解析验证响应失败:", err);
              reject(err);
            }
          },
          onerror: (err) => {
            Logger.error("验证请求失败:", err);
            reject(new Error("网络请求失败"));
          },
          ontimeout: () => {
            Logger.error("验证请求超时");
            reject(new Error("验证超时，请重试"));
          },
        });
      });
    }

    static showVerifyModal() {
      return new Promise((resolve, reject) => {
        // 创建遮罩层
        const overlay = document.createElement("div");
        overlay.className = "hcx-verify-overlay";

        // 创建弹窗
        const modal = document.createElement("div");
        modal.className = "hcx-verify-modal";
        modal.innerHTML = `
          <div class="hcx-verify-header">
            <h3>支持开发者</h3>
            <button class="hcx-verify-close" type="button">&times;</button>
          </div>
          <div class="hcx-verify-body">
            <p class="hcx-verify-message">
              为了支持开发者持续更新，请前往小程序观看广告后获取验证码<br>
              您已使用 <strong>${this.getDownloadCount()}</strong> 次下载功能
            </p>
            <div class="hcx-verify-qrcode">
              <img src="${
                CONFIG.QRCODE_URL
              }" alt="小程序二维码" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22200%22 height=%22200%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2214%22>小程序二维码</text></svg>'">
              <p class="hcx-verify-qr-tip">扫码进入小程序</p>
            </div>
            <div class="hcx-verify-input-group">
              <input type="text" class="hcx-verify-input" placeholder="请输入验证码" maxlength="10">
              <button type="button" class="hcx-verify-submit">提交验证</button>
            </div>
            <div class="hcx-verify-error" style="display: none; margin-top: 12px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 6px; color: #c33; font-size: 13px; text-align: center;"></div>
          </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const input = modal.querySelector(".hcx-verify-input");
        const submitBtn = modal.querySelector(".hcx-verify-submit");
        const closeBtn = modal.querySelector(".hcx-verify-close");
        const errorDiv = modal.querySelector(".hcx-verify-error");

        // 关闭弹窗函数
        const closeModal = () => {
          overlay.remove();
        };

        // 显示错误提示
        const showError = (message) => {
          errorDiv.textContent = message;
          errorDiv.style.display = "block";
          input.style.borderColor = "#fcc";
        };

        // 隐藏错误提示
        const hideError = () => {
          errorDiv.style.display = "none";
          input.style.borderColor = "#e0e0e0";
        };

        // 提交验证码
        submitBtn.addEventListener("click", async () => {
          const code = input.value.trim();
          if (!code) {
            showError("请输入验证码");
            input.focus();
            return;
          }

          hideError();
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.textContent = "验证中...";

          try {
            await this.verifyCode(code);
            Logger.info("验证通过");
            this.resetDownloadCount();
            closeModal();
            resolve(true);
          } catch (err) {
            Logger.warn("验证失败:", err.message);
            showError(err.message);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            input.focus();
            input.select();
          }
        });

        // 按Enter键提交
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter" && !submitBtn.disabled) {
            submitBtn.click();
          }
        });

        // 输入时隐藏错误提示
        input.addEventListener("input", hideError);

        // 关闭按钮
        closeBtn.addEventListener("click", () => {
          closeModal();
          reject(new Error("用户取消验证"));
        });

        // 点击遮罩层关闭
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            closeModal();
            reject(new Error("用户取消验证"));
          }
        });

        // 自动聚焦输入框
        setTimeout(() => input.focus(), 100);
      });
    }
  }

  // ==================== 文件处理类 ====================
  class FileProcessor {
    static needsRename(fileName) {
      return !CONFIG.FILE_PATTERN.test(fileName);
    }

    static async process(row, button, onProgress) {
      const originalName = DomHelper.getFileNameFromRow(row);
      if (!originalName) throw new Error("无法获取文件名");

      let currentName = originalName;
      let shouldRestore = false;

      // 开始处理
      if (onProgress) onProgress(0); // 0%

      // 检查是否需要重命名
      if (this.needsRename(currentName)) {
        const fileId = DomHelper.getFileIdFromRow(row);
        if (!fileId) throw new Error("无法获取文件ID");

        const renamedName = `${currentName}.pdf`;
        const originalPath = PathHelper.buildFullPath(currentName);

        Logger.info(`准备重命名: ${currentName} -> ${renamedName}`);
        if (onProgress) onProgress(0.05); // 5%

        await BaiduPanAPI.renameFileOnServer(fileId, originalPath, renamedName);

        currentName = renamedName;
        shouldRestore = true;

        if (onProgress) onProgress(0.1); // 10%

        // 等待服务器更新
        await this._sleep(CONFIG.WAIT_TIME_AFTER_RENAME);
      }

      if (onProgress) onProgress(0.15); // 15%

      try {
        // 获取下载链接
        const filePath = PathHelper.buildFullPath(currentName);
        const downloadUrl = await BaiduPanAPI.getDownloadLink(filePath);

        if (onProgress) onProgress(0.2); // 20%

        // 下载文件 (占80%的进度，从20%到100%)
        // this._updateButtonText(button, '下载中........');
        await DownloadManager.downloadFile(
          downloadUrl,
          currentName,
          (downloadProgress) => {
            // 下载进度占 20% - 100%
            if (onProgress) onProgress(0.2 + downloadProgress * 0.8);
          }
        );
      } catch (error) {}

      // 下载完成后，如果需要恢复文件名
      if (shouldRestore) {
        const fileId = DomHelper.getFileIdFromRow(row);
        const renamedPath = PathHelper.buildFullPath(currentName);
        await BaiduPanAPI.renameFileOnServer(fileId, renamedPath, originalName);
        Logger.info(`已恢复原文件名: ${currentName} -> ${originalName}`);
      }

      if (onProgress) onProgress(1); // 100%
    }

    static _updateButtonText(button, text) {
      button.textContent = text;
    }

    static _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  // ==================== 按钮管理类 ====================
  class ButtonManager {
    static createDownloadButton() {
      const button = document.createElement("button");
      button.type = "button";
      button.className = CONFIG.BUTTON_CLASS;

      // 创建按钮内部结构
      button.innerHTML = `
        <span class="hcx-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="icon" viewBox="0 0 1024 1024"><path fill="#FEAC33" d="M328.2 97.4h415.7c43.6 0 71.1 47 49.8 85L691.4 372.8c-11.5 21.4 4 47.3 28.3 47.3h96c33.4 0 48.8 41.6 23.4 63.3L338.8 912.9c-32.5 27.9-81.6-2.1-71.7-43.7L336 579.5c2.7-18.7-11.7-35.4-30.6-35.4h-53.9c-18 0-32.2-15.3-30.8-33.2l25.1-337c3.2-43.2 39.2-76.5 82.4-76.5"/><path fill="#FEAC33" d="M793.7 182.4c21.4-38-6.1-85-49.8-85h-98.5c55.3 18.4 105.3 48.2 147.5 86.5zm-465.5-85c-43.3 0-79.2 33.4-82.4 76.5l-.1 1.6c40.1-34.3 86.8-61.1 138-78.1zm10.6 815.5 38.2-32.8c-35.9-12.7-69.6-30.2-100.2-51.7l-9.7 40.7c-2.8 11.8-.9 22.7 4.1 31.5 12.3 8.2 25 15.9 38.1 23 10 .4 20.4-2.9 29.5-10.7"/><path fill="#FEB133" d="M496.4 113.6c107.2 0 203.3 47.2 268.7 122l27.8-51.7c-42.1-38.3-92.2-68.1-147.5-86.5H383.6c-51.2 17.1-97.9 43.8-138 78.1l-3.3 44.4c64.8-65.6 154.7-106.3 254.1-106.3m-53.2 709.7c-55.5-8.3-106.8-29.4-150.9-60.2l-15.6 65.4c30.6 21.5 64.2 39 100.2 51.7z"/><path fill="#FEB633" d="M478.3 151c108 0 202.7 57.1 255.5 142.9l31.3-58.2c-65.4-74.8-161.5-122-268.7-122-99.4 0-189.3 40.7-254 106.3l-3.8 50.8C293.3 198 380.3 151 478.3 151m283.1 399.1 77.7-66.7c25.4-21.7 10.1-63.3-23.4-63.3h-39.1c1 10.1 1.6 20.4 1.6 30.8 0 34.7-5.9 68.1-16.8 99.2M533.6 745.7c-17.9 3.3-36.4 5.1-55.3 5.1-63.3 0-122-19.6-170.4-53.1l-15.6 65.4c44.1 30.8 95.4 51.9 150.9 60.2z"/><path fill="#FFBC34" d="M220.7 510.9c-1.2 15.5 9.3 29.1 23.8 32.4-9.8-18.8-17.1-39-21.8-60.2zm239.5-322.5c111.9 0 206.1 75.7 234.4 178.6l39.3-73.1C681 208.1 586.3 151 478.3 151c-98 0-185 47-239.7 119.7l-5.5 74.2c34.8-91.5 123.3-156.5 227.1-156.5m73.4 557.3 227.8-195.6c10.9-31.1 16.8-64.4 16.8-99.2 0-10.4-.5-20.7-1.6-30.8h-56.9c-6.4 0-12.2-1.8-17.1-4.9.4 5.3.5 10.7.5 16.1 0 134.2-108.8 243-243 243-50.7 0-97.8-15.5-136.7-42.1l-15.6 65.4c48.4 33.5 107.1 53.1 170.4 53.1 19 .1 37.5-1.7 55.4-5"/><path fill="#FFC134" d="M703.2 431.4c0-5.4-.2-10.8-.5-16.1-13.5-8.5-19.7-26.7-11.2-42.4l3.1-5.8C666.3 264 572.1 188.4 460.2 188.4c-103.7 0-192.3 65-227.1 156.5l-10.3 138.3c4.6 21.2 12 41.4 21.8 60.2 2.2.5 4.6.8 7 .8h53.9c2.3 0 4.4.2 6.6.7-34.5-33.8-56-80.9-56-133 0-102.8 83.3-186.1 186.1-186.1s186 83.2 186 186-83.3 186.1-186.1 186.1c-40.3 0-77.6-12.8-108.1-34.6 2 4.9 2.8 10.5 2 16.2l-12.5 52.7c39 26.6 86 42.1 136.7 42.1 134.2 0 243-108.7 243-242.9"/><path fill="#FFC634" d="M628.2 411.8c0-102.8-83.3-186.1-186.1-186.1S256 309 256 411.8c0 52.1 21.4 99.2 56 133 10.1 2.2 18.3 9.3 22.1 18.5 30.5 21.8 67.8 34.6 108.1 34.6 102.6 0 186-83.3 186-186.1m-333.5-19.5c0-71.4 57.8-129.2 129.2-129.2s129.2 57.8 129.2 129.2-57.8 129.2-129.2 129.2-129.2-57.8-129.2-129.2"/><path fill="#FFCB34" d="M294.7 392.3a129.2 129.2 0 1 0 258.4 0 129.2 129.2 0 1 0-258.4 0"/><path fill="#FFA820" d="M310.1 932.8c-9.5 0-19.1-2.6-27.8-8-20-12.2-29.5-34.9-24-57.7l68.8-289.3c.8-6.2-1.1-12.4-5.2-17.1-4.2-4.8-10.2-7.6-16.6-7.6h-53.9c-11.1 0-21.7-4.7-29.3-12.8s-11.4-19.1-10.6-30.1l25.1-337c1.7-23.1 12-44.6 29-60.4s39.2-24.5 62.4-24.5h415.7c23.7 0 45 12.2 57 32.7 12 20.4 12.2 45 .6 65.6L699.3 377c-3.9 7.2-3.7 15.8.5 22.8 4.2 7.1 11.6 11.3 19.8 11.3h96c19 0 35.6 11.5 42.2 29.4 6.6 17.9 1.5 37.4-13 49.7L344.6 919.8c-10 8.6-22.2 13-34.5 13m18.1-826.4c-18.6 0-36.4 7-50.1 19.7s-22 29.9-23.3 48.5l-25.1 337c-.5 6.2 1.6 12 5.8 16.5s9.9 7 16.1 7h53.9c11.6 0 22.6 5 30.2 13.8s11 20.4 9.3 31.9l-.2.8-68.9 289.7c-4.4 18.3 5.4 31.7 15.9 38.1s26.9 8.9 41.2-3.3l500.3-429.5c10.6-9 10.9-21.3 7.8-29.8-3.1-8.5-11.4-17.6-25.3-17.6h-96c-14.6 0-27.8-7.5-35.3-20s-7.8-27.7-.9-40.6L785.9 178c8.4-15 8.3-32.9-.4-47.8s-24.2-23.8-41.5-23.8z"/><path fill="#FFE3B4" d="m632 363-38.2 73.7c-3.5 6.8 1.4 15 9.1 15h62.6c12.3 0 18.4 14.9 9.6 23.5L534.5 613.9c-5.1 5-13.5-.4-11-7.1l27.4-73.5c2.4-6.4-2.4-13.3-9.2-13.3h-51c-14.3 0-25.1-13-22.5-27.1L493 360.2c3.1-16.5 17.6-28.5 34.4-28.4l85.9.3c15.8 0 26 16.8 18.7 30.9"/><path fill="#FFF" d="M301.5 322.9c-9.9-.7-17.4-9.2-16.8-19.2l8.2-123.8c.7-9.9 9.2-17.4 19.2-16.8s17.4 9.2 16.8 19.2l-8.2 123.8c-.7 10-9.3 17.5-19.2 16.8m-4.6 69.5c-9.9-.7-17.4-9.2-16.8-19.2l.7-10.5c.7-9.9 9.2-17.4 19.2-16.8 9.9.7 17.4 9.2 16.8 19.2l-.7 10.5c-.7 9.9-9.3 17.4-19.2 16.8"/></svg></span>
        <span class="hcx-btn-text">${CONFIG.BUTTON_TEXT}</span>
        <span class="hcx-btn-progress-text">0%</span>
      `;

      return button;
    }

    static updateProgress(button, percent) {
      // 更新进度条
      const translateValue = -100 + percent;
      button.style.setProperty("--progress-x", `${translateValue}%`);

      // 更新进度文本
      const progressText = button.querySelector(".hcx-btn-progress-text");
      if (progressText) {
        progressText.textContent = `${Math.round(percent)}%`;
        progressText.style.opacity = percent > 0 ? "1" : "0";
      }

      // 更新按钮文本（可选）
      const btnText = button.querySelector(".hcx-btn-text");
      if (btnText && percent > 0 && percent < 100) {
        if (percent < 20) {
          btnText.textContent = "准备中...";
        } else if (percent < 100) {
          btnText.textContent = "下载中...";
        }
      }
    }

    static resetProgress(button) {
      button.style.setProperty("--progress-x", "-100%");

      const progressText = button.querySelector(".hcx-btn-progress-text");
      if (progressText) {
        progressText.textContent = "0%";
        progressText.style.opacity = "0";
      }

      const btnText = button.querySelector(".hcx-btn-text");
      if (btnText) {
        btnText.textContent = CONFIG.BUTTON_TEXT;
      }
    }

    static async handleClick(row, button) {
      try {
        // 检查是否需要验证
        if (VerifyManager.needsVerification()) {
          try {
            const btnText = button.querySelector(".hcx-btn-text");
            if (btnText) btnText.textContent = "需要验证...";
            await VerifyManager.showVerifyModal();
            Logger.info("验证通过，继续下载");
          } catch (err) {
            Logger.warn("验证取消:", err.message);
            this.resetProgress(button);
            return;
          }
        }

        button.disabled = true;

        await FileProcessor.process(row, button, (progress) => {
          // 直接使用 FileProcessor 返回的进度 (0 - 1)
          this.updateProgress(button, progress * 100);
        });

        // 完成：100%
        this.updateProgress(button, 100);

        // 显示完成状态
        const btnText = button.querySelector(".hcx-btn-text");
        if (btnText) btnText.textContent = "✓ 完成";

        // 增加下载次数
        VerifyManager.incrementDownloadCount();

        button.disabled = false;

        // 重置进度条
        setTimeout(() => this.resetProgress(button), 1500);
      } catch (err) {
        Logger.error("处理失败:", err);
        const btnText = button.querySelector(".hcx-btn-text");
        if (btnText) btnText.textContent = "✗ 失败，重试";
        this.resetProgress(button);
        setTimeout(() => {
          this.resetProgress(button);
          button.disabled = false;
        }, 2000);
      }
    }

    static injectButton(row, index) {
      // 避免重复注入
      if (row.querySelector(`.${CONFIG.BUTTON_CLASS}`)) return;

      const fileName = DomHelper.getFileNameFromRow(row);
      if (!fileName) return;

      // 只为文件添加按钮（文件名包含扩展名）
      if (!DomHelper.isFileRow(fileName)) {
        return;
      }

      const targetCell = DomHelper.getLastCellFromRow(row);
      if (!targetCell) return;

      const button = this.createDownloadButton();
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.handleClick(row, button);
      });

      targetCell.appendChild(button);
      Logger.info(`已注入按钮 #${index}:`, fileName);
    }
  }

  // ==================== 页面监控类 ====================
  class PageMonitor {
    static injectAllButtons() {
      const tableBody = DomHelper.getFileListTable();
      if (!tableBody) return;

      const rows = tableBody.querySelectorAll(":scope > tr");
      Logger.info(`扫描文件列表，共 ${rows.length} 行`);

      rows.forEach((row, index) => {
        ButtonManager.injectButton(row, index);
      });
    }

    static startMonitoring() {
      // 初始注入
      this.injectAllButtons();

      // 创建防抖函数
      const debounce = (fn, delay = 50) => {
        let timer = null;
        return () => {
          if (timer) return;
          timer = setTimeout(() => {
            timer = null;
            fn();
          }, delay);
        };
      };

      // 监听 DOM 变化
      const observer = new MutationObserver(
        debounce(() => this.injectAllButtons(), 50)
      );
      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });

      // 监听历史记录变化
      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        const result = originalPushState.apply(this, args);
        setTimeout(() => PageMonitor.injectAllButtons(), 100);
        return result;
      };

      window.addEventListener("popstate", () => {
        setTimeout(() => PageMonitor.injectAllButtons(), 100);
      });
    }
  }

  // ==================== 样式注入 ====================
  // 直接在 DOM 中插入 CSS link 标签
  function injectStyles() {
    const cssUrl = 'https://huancaixi.vip/assets/css/baidu_download.css';
    
    // 创建 link 元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.type = 'text/css';
    link.onerror = () => {
      Logger.warn('外部CSS加载失败，使用备用样式');
    };
    
    // 插入到 head 中
    document.head.appendChild(link);
    Logger.info('CSS link 已插入到 DOM');
  }
  // ==================== 启动脚本 ====================
  Logger.info("脚本已加载，开始监控页面...");
  
  // 注入样式
  injectStyles();
  
  // 启动页面监控
  PageMonitor.startMonitoring();
})();
