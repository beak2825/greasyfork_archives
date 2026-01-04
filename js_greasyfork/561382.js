// ==UserScript==
// @name         115批量清理工具
// @namespace    com.cloud115.batch-clear
// @version      1.0.0
// @author       Cantona
// @license      MIT
// @description  批量选择文件夹后进行智能清理，支持多目录同时处理
// @match        https://115.com/*
// @match        https://*.115.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561382/115%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561382/115%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #batch-clear-btn {
            background: #fff !important;
            color: #1677ff !important;
            border: 1px solid #1677ff !important;
            border-radius: 4px !important;
            padding: 5px 12px !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            transition: all 0.3s !important;
        }
        #batch-clear-btn:hover {
            background: #1677ff !important;
            color: #fff !important;
        }
        #batch-clear-btn svg {
            width: 14px !important;
            height: 14px !important;
            fill: none !important;
            stroke: #1677ff !important;
            stroke-width: 2 !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
            transition: stroke 0.3s !important;
        }
        #batch-clear-btn:hover svg {
            stroke: #fff !important;
        }

        #batch-clear-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #667eea;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 99999;
            min-width: 650px;
            max-width: 850px;
            max-height: 85vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #batch-clear-ui h2 {
            margin: 0 0 20px 0;
            color: #667eea;
            font-size: 22px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        #batch-clear-ui .control-group {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        #batch-clear-ui label {
            font-weight: 600;
            color: #333;
            min-width: 120px;
        }
        #batch-clear-ui input[type="number"] {
            padding: 8px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
        }
        #batch-clear-ui input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        #batch-clear-ui .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        #batch-clear-ui .checkbox-group label {
            min-width: auto;
            cursor: pointer;
            user-select: none;
        }
        #batch-clear-ui .button-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
        #batch-clear-ui button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        #batch-clear-ui button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        #batch-clear-ui button:disabled {
            background: #cccccc;
            cursor: not-allowed;
            opacity: 0.6;
        }
        #batch-clear-ui button.danger {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        #batch-clear-ui .status {
            padding: 15px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 8px;
            margin: 15px 0;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            text-align: center;
        }
        #batch-clear-ui .folder-list {
            max-height: 200px;
            overflow-y: auto;
            border: 2px solid #f0f0f0;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            background: #fafafa;
        }
        #batch-clear-ui .folder-item {
            padding: 8px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
            background: #fff3e0;
            font-weight: 600;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        #batch-clear-ui .progress-bar {
            width: 100%;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        #batch-clear-ui .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
            color: white;
            font-size: 11px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #batch-clear-ui .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #f5576c;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            padding: 0;
            font-size: 20px;
            cursor: pointer;
        }
        #batch-clear-ui .results h3 {
            color: #667eea;
            font-size: 18px;
            margin: 15px 0 10px 0;
        }
        #batch-clear-ui .results p {
            margin: 8px 0;
            font-size: 14px;
            color: #555;
        }
        #batch-clear-ui .results strong {
            color: #667eea;
            font-weight: 700;
        }
        #batch-clear-ui .success-box {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #155724;
        }
    `);

    class BatchCleaner {
        constructor(selectedFolders) {
            this.selectedFolders = selectedFolders;
            this.allFilesToDelete = [];
            this.allDirsToDelete = [];
            this.ui = null;
            // 批量删除: 每批最多30个，更保守避免风控
            this.batchSize = 30;
            // 并发限制: 串行执行,避免触发风控
            this.maxConcurrent = 1;
            // 默认开启保留字幕
            this.skipSubtitles = true;
            // 需要保留的文件扩展名（字幕文件等）
            this.preserveExtensions = ['.srt', '.ass', '.ssa', '.sub', '.idx', '.vtt', '.smi', '.sup'];
        }

        // 检查是否为需要保留的文件（如字幕）
        isPreservedFile(filename) {
            if (!this.skipSubtitles) return false; // 如果未勾选保留字幕，则不保留任何文件
            if (!filename) return false;
            const lowerName = filename.toLowerCase();
            return this.preserveExtensions.some(ext => lowerName.endsWith(ext));
        }

        async getFilesAPI(params) {
            const queryParams = new URLSearchParams({
                aid: 1,
                cid: params.cid || 0,
                o: 'user_ptime',
                asc: 0,
                offset: params.offset || 0,
                show_dir: params.showdir ? 1 : 0,
                limit: params.limit || 1150,
                natsort: 0,
                format: 'json'
            });

            const response = await fetch(`https://webapi.115.com/files?${queryParams}`, {
                credentials: 'include'
            });

            const data = await response.json();
            if (data.state) {
                return data;
            }
            throw new Error(data.error || '获取文件列表失败');
        }

        async getAllFiles(cid, options = {}) {
            let allFiles = [];
            let offset = 0;
            const limit = 1150;

            while (true) {
                const result = await this.getFilesAPI({
                    cid: cid,
                    offset: offset,
                    limit: limit,
                    showdir: options.includeDir ? 1 : 0
                });

                if (!result.data || result.data.length === 0) break;
                allFiles = [...allFiles, ...result.data];
                offset += limit;
                if (result.data.length < limit || offset >= result.count) break;
                await this.sleep(800); // 增加延迟避免风控
            }

            return allFiles;
        }

        isFolder(item) {
            if (item.fol === 1 || item.fol === '1') return true;
            if (item.ico === 'folder') return true;
            if (item.is_dir === 1 || item.is_dir === '1') return true;
            if (item.cid && !item.fid && (!item.s || item.s === '0')) return true;
            return false;
        }

        getFolderId(item) {
            return item.cid || item.fid;
        }

        async analyzeDirContents(dir, maxSizeBytes) {
            try {
                const contents = await this.getAllFiles(dir.id, { includeDir: true });
                
                const files = contents.filter(item => !this.isFolder(item));
                const subDirs = contents.filter(item => this.isFolder(item));
                
                if (contents.length === 0) {
                    return { isEmpty: true, fileCount: 0, totalSize: 0 };
                }
                
                if (subDirs.length > 0) {
                    return { hasSubDirs: true, fileCount: files.length, subDirCount: subDirs.length };
                }
                
                // 检查是否有需要保留的文件（如字幕）
                const hasPreservedFiles = files.some(f => this.isPreservedFile(f.n || f.name));
                if (hasPreservedFiles) {
                    return { hasPreservedFiles: true, fileCount: files.length };
                }
                
                const fileSizes = files.map(f => parseInt(f.s || f.size || 0));
                const maxFileSize = Math.max(...fileSizes, 0);
                const totalSize = fileSizes.reduce((sum, size) => sum + size, 0);
                const allSmall = fileSizes.every(size => size < maxSizeBytes);
                
                return {
                    isEmpty: false,
                    allSmall: allSmall,
                    fileCount: files.length,
                    totalSize: totalSize,
                    maxFileSize: maxFileSize
                };
            } catch (error) {
                return { error: error.message };
            }
        }

        async deleteBatch(fileIds) {
            const fidParams = fileIds.map((fid, idx) => `fid[${idx}]=${fid}`).join('&');
            const response = await fetch('https://webapi.115.com/rb/delete', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: fidParams
            });
            return await response.json();
        }

        async deleteFilesSerial(fileIds) {
            if (fileIds.length === 0) return { successCount: 0, failCount: 0 };

            const batches = [];
            for (let i = 0; i < fileIds.length; i += this.batchSize) {
                batches.push(fileIds.slice(i, i + this.batchSize));
            }

            let successCount = 0;
            let failCount = 0;
            const failedIds = [];

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                
                try {
                    const result = await this.deleteBatch(batch);
                    
                    if (result.state) {
                        successCount += batch.length;
                    } else {
                        failedIds.push(...batch);
                    }
                } catch (error) {
                    failedIds.push(...batch);
                }

                const processed = (i + 1) * this.batchSize;
                const progress = Math.round((Math.min(processed, fileIds.length) / fileIds.length) * 100);
                this.updateProgress(progress, `${Math.min(processed, fileIds.length)}/${fileIds.length}`);

                if (i < batches.length - 1) {
                    await this.sleep(1000); // 增加延迟避免风控
                }
            }

            if (failedIds.length > 0) {
                for (let i = 0; i < failedIds.length; i += 50) {
                    const retryBatch = failedIds.slice(i, i + 50);
                    
                    try {
                        const result = await this.deleteBatch(retryBatch);
                        if (result.state) {
                            successCount += retryBatch.length;
                        } else {
                            for (const fid of retryBatch) {
                                try {
                                    const res = await fetch('https://webapi.115.com/rb/delete', {
                                        method: 'POST',
                                        credentials: 'include',
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                        body: `fid=${fid}`
                                    });
                                    const r = await res.json();
                                    if (r.state) {
                                        successCount++;
                                    } else {
                                        failCount++;
                                    }
                                } catch (e) {
                                    failCount++;
                                }
                                await this.sleep(200); // 增加延迟
                            }
                        }
                    } catch (error) {
                        failCount += retryBatch.length;
                    }
                    
                    await this.sleep(500); // 增加延迟
                }
            } else {
                failCount = fileIds.length - successCount;
            }

            return { successCount, failCount };
        }

        async deleteFoldersSerial(dirs) {
            if (dirs.length === 0) return { successCount: 0, failCount: 0 };

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                
                try {
                    const response = await fetch('https://webapi.115.com/rb/delete', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `fid=${dir.id}`
                    });
                    const result = await response.json();
                    
                    if (result.state) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch (error) {
                    failCount++;
                }

                this.updateProgress(Math.round(((i + 1) / dirs.length) * 100), `${i + 1}/${dirs.length} 文件夹`);
                await this.sleep(800); // 增加延迟避免风控
            }

            return { successCount, failCount };
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        }

        async analyzeMultipleFolders(maxSizeMB = 10) {
            this.updateStatus('正在分析选中的文件夹...');
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            
            this.allFilesToDelete = [];
            this.allDirsToDelete = [];

            for (let folderIdx = 0; folderIdx < this.selectedFolders.length; folderIdx++) {
                const folder = this.selectedFolders[folderIdx];
                const folderCid = folder.cid;
                const folderName = folder.name;

                this.updateStatus(`分析第 ${folderIdx + 1}/${this.selectedFolders.length} 个文件夹: ${folderName}`);

                // 递归分析这个文件夹及其所有子文件夹
                await this.analyzeDirectoryRecursive(folderCid, folderName, maxSizeBytes);
            }

            return {
                totalFiles: this.allFilesToDelete.length,
                totalDirs: this.allDirsToDelete.length,
                totalSize: this.allFilesToDelete.reduce((sum, f) => sum + f.size, 0) + 
                          this.allDirsToDelete.reduce((sum, d) => sum + d.totalSize, 0)
            };
        }

        // 递归分析目录及其所有子目录（深度优先，后序遍历）
        async analyzeDirectoryRecursive(dirId, dirPath, maxSizeBytes) {
            try {
                const allItems = await this.getAllFiles(dirId, { includeDir: true });
                const files = allItems.filter(item => !this.isFolder(item));
                const dirs = allItems.filter(item => this.isFolder(item));

                // 收集当前目录下的小文件（排除字幕等需要保留的文件）
                const smallFiles = files.map(f => ({
                    id: f.fid,
                    name: f.n || f.name,
                    size: parseInt(f.s || f.size || 0),
                    parentFolder: dirPath
                })).filter(f => f.size < maxSizeBytes && !this.isPreservedFile(f.name));

                this.allFilesToDelete.push(...smallFiles);

                // 先递归处理所有子文件夹（深度优先，确保一次性分析完整）
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    const subDirId = this.getFolderId(dir);
                    const subDirName = dir.n || dir.name;
                    
                    if (!subDirId) continue;
                    
                    // 无论什么情况都递归到底，确保完整分析
                    await this.analyzeDirectoryRecursive(subDirId, `${dirPath}/${subDirName}`, maxSizeBytes);
                    
                    await this.sleep(1000); // 增加延迟避免风控
                }

                // 递归完成后，再次检查所有子文件夹状态（可能子文件夹已被标记删除）
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    const subDirId = this.getFolderId(dir);
                    const subDirName = dir.n || dir.name;
                    
                    if (!subDirId) continue;
                    
                    // 检查这个文件夹是否已经在删除列表中
                    const alreadyMarked = this.allDirsToDelete.some(d => d.id === subDirId);
                    if (alreadyMarked) continue;
                    
                    // 再次获取最新状态（可能子内容已被删除）
                    const dirInfo = await this.analyzeDirContents({ id: subDirId, name: subDirName }, maxSizeBytes);
                    
                    if (dirInfo.isEmpty) {
                        // 空文件夹，标记删除
                        this.allDirsToDelete.push({
                            id: subDirId,
                            name: subDirName,
                            fileCount: 0,
                            totalSize: 0,
                            reason: '空文件夹',
                            parentFolder: dirPath
                        });
                    } else if (dirInfo.allSmall && !dirInfo.hasSubDirs) {
                        // 只包含小文件且无子目录，整个文件夹删除
                        this.allDirsToDelete.push({
                            id: subDirId,
                            name: subDirName,
                            fileCount: dirInfo.fileCount,
                            totalSize: dirInfo.totalSize,
                            maxFileSize: dirInfo.maxFileSize,
                            reason: `${dirInfo.fileCount}个小文件`,
                            parentFolder: dirPath
                        });
                    }
                    
                    await this.sleep(800); // 增加延迟避免风控
                }
            } catch (error) {
                console.error(`分析目录 ${dirPath} 失败:`, error);
            }
        }

        async executeDelete(skipConfirm = false) {
            const totalDirs = this.allDirsToDelete.length;
            const totalFiles = this.allFilesToDelete.length;
            
            if (totalDirs === 0 && totalFiles === 0) {
                if (!skipConfirm) alert('没有要删除的内容');
                return;
            }

            if (!skipConfirm) {
                const dirSize = this.formatSize(this.allDirsToDelete.reduce((sum, d) => sum + d.totalSize, 0));
                const fileSize = this.formatSize(this.allFilesToDelete.reduce((sum, f) => sum + f.size, 0));
                const estimatedTime = Math.ceil((totalDirs * 0.3) + (totalFiles / this.batchSize * 0.3));
                
                let msg = `⚠️ 确认删除\n\n`;
                msg += `📂 处理 ${this.selectedFolders.length} 个文件夹\n\n`;
                if (totalDirs > 0) {
                    msg += `📁 ${totalDirs} 个子文件夹 (${dirSize})\n`;
                }
                if (totalFiles > 0) {
                    msg += `📄 ${totalFiles} 个文件 (${fileSize})\n`;
                }
                msg += `\n⏱️ 预计: ${estimatedTime} 秒\n`;
                msg += `\n此操作不可撤销，是否继续？`;
                
                if (!window.confirm(msg)) return;
            }

            this.showProgressBar();
            const startTime = Date.now();

            let dirSuccess = 0, dirFail = 0;
            let fileSuccess = 0, fileFail = 0;

            if (totalDirs > 0) {
                this.updateStatus(`正在删除 ${totalDirs} 个文件夹...`);
                const result = await this.deleteFoldersSerial(this.allDirsToDelete);
                dirSuccess = result.successCount;
                dirFail = result.failCount;
            }

            if (totalFiles > 0) {
                this.updateStatus(`正在删除 ${totalFiles} 个文件...`);
                const fileIds = this.allFilesToDelete.map(f => f.id);
                const result = await this.deleteFilesSerial(fileIds);
                fileSuccess = result.successCount;
                fileFail = result.failCount;
            }

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const totalProcessed = dirSuccess + fileSuccess;
            const speed = (totalProcessed / parseFloat(elapsed)).toFixed(1);

            this.updateProgress(100, '完成');
            this.showResults(`
                <h3>✅ 清理完成</h3>
                <p>📂 处理了 ${this.selectedFolders.length} 个文件夹</p>
                <p>📁 子文件夹: 成功 <strong>${dirSuccess}</strong>, 失败 ${dirFail}</p>
                <p>📄 文件: 成功 <strong>${fileSuccess}</strong>, 失败 ${fileFail}</p>
                <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒 | 速度: <strong>${speed}</strong> 个/秒</p>
                <p style="color: #28a745; font-size: 14px; margin-top: 15px; font-weight: bold;">✅ 3秒后自动刷新...</p>
            `);

            await this.sleep(3000);
            
            // 关闭弹窗
            if (this.ui) this.ui.remove();
            
            // 刷新整个页面（包括可能的父级frame）
            try {
                // 优先刷新顶层窗口
                if (window.top && window.top !== window) {
                    window.top.location.reload();
                } else if (window.parent && window.parent !== window) {
                    window.parent.location.reload();
                } else {
                    location.reload();
                }
            } catch (e) {
                // 跨域限制时，退回到当前窗口刷新
                location.reload();
            }
        }

        createUI() {
            if (this.ui) this.ui.remove();

            const folderListHtml = this.selectedFolders.map(f => 
                `<div class="folder-item">📁 ${f.name} (CID: ${f.cid})</div>`
            ).join('');

            const container = document.createElement('div');
            container.id = 'batch-clear-ui';
            container.innerHTML = `
                <button class="close-btn" onclick="this.parentElement.remove()">×</button>

                <h2>🧹 批量清理工具</h2>

                <div class="success-box">
                    📂 已选择 <strong>${this.selectedFolders.length}</strong> 个文件夹<br>
                    📦 批量模式: 30个/批，低频处理，避免风控
                </div>

                <div class="folder-list">
                    ${folderListHtml}
                </div>

                <div class="control-group">
                    <label>文件大小上限:</label>
                    <input type="number" id="maxSize" value="100" min="0" step="0.1"> MB
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="skipSubtitles" checked>
                    <label for="skipSubtitles">🎬 保留字幕文件 (srt/ass/ssa/sub/vtt等)</label>
                </div>

                <div class="button-group">
                    <button id="oneClickBtn" class="danger">🚀 一键清理</button>
                    <button id="analyzeBtn">📊 智能分析</button>
                    <button id="deleteBtn" class="danger" disabled style="display:none;">2️⃣ 开始清理</button>
                </div>

                <div class="status" id="status">💡 点击"一键清理"自动分析并清理文件</div>
                
                <div id="progressContainer" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 0%">0%</div>
                    </div>
                </div>

                <div id="results" class="results"></div>
            `;

            document.body.appendChild(container);
            this.ui = container;
            this.bindEvents();
        }

        showProgressBar() {
            const container = this.ui?.querySelector('#progressContainer');
            if (container) container.style.display = 'block';
        }

        updateProgress(percent, text = '') {
            const fill = this.ui?.querySelector('#progressFill');
            if (fill) {
                fill.style.width = percent + '%';
                fill.textContent = text || (percent + '%');
            }
        }

        bindEvents() {
            const oneClickBtn = this.ui.querySelector('#oneClickBtn');
            const analyzeBtn = this.ui.querySelector('#analyzeBtn');
            const deleteBtn = this.ui.querySelector('#deleteBtn');
            const maxSizeInput = this.ui.querySelector('#maxSize');
            const skipSubtitlesCheckbox = this.ui.querySelector('#skipSubtitles');

            oneClickBtn.onclick = async () => {
                try {
                    oneClickBtn.disabled = true;
                    analyzeBtn.disabled = true;
                    
                    // 先分析
                    const startTime = Date.now();
                    const maxSize = parseFloat(maxSizeInput.value);
                    this.skipSubtitles = skipSubtitlesCheckbox.checked;
                    this.updateStatus('正在分析文件...');
                    const result = await this.analyzeMultipleFolders(maxSize);
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

                    if (result.totalFiles === 0 && result.totalDirs === 0) {
                        this.updateStatus('✅ 未发现需要清理的内容');
                        this.showResults(`
                            <h3>📊 分析结果</h3>
                            <p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>
                            <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>
                            <p>✨ 未发现需要清理的垃圾文件或文件夹</p>
                        `);
                        oneClickBtn.disabled = false;
                        analyzeBtn.disabled = false;
                        return;
                    }

                    // 显示分析结果
                    let html = `
                        <h3>📊 分析结果</h3>
                        <p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>
                        <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>
                    `;

                    if (result.totalDirs > 0) {
                        html += `<p>🗑️ 垃圾子文件夹: <strong>${result.totalDirs}</strong> 个</p>`;
                    }

                    if (result.totalFiles > 0) {
                        html += `<p>📄 散装小文件: <strong>${result.totalFiles}</strong> 个</p>`;
                    }

                    html += `<p>💾 可释放: <strong>${this.formatSize(result.totalSize)}</strong></p>`;
                    this.showResults(html);
                    
                    // 自动执行删除
                    this.updateStatus('正在自动清理...');
                    await this.sleep(1000);
                    await this.executeDelete(true);
                } catch (error) {
                    alert('❌ 失败: ' + error.message);
                    console.error(error);
                    oneClickBtn.disabled = false;
                    analyzeBtn.disabled = false;
                }
            };

            analyzeBtn.onclick = async () => {
                try {
                    analyzeBtn.disabled = true;
                    const startTime = Date.now();
                    const maxSize = parseFloat(maxSizeInput.value);
                    this.skipSubtitles = skipSubtitlesCheckbox.checked;
                    const result = await this.analyzeMultipleFolders(maxSize);
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

                    deleteBtn.disabled = (result.totalFiles + result.totalDirs) === 0;

                    let html = `
                        <h3>📊 分析结果</h3>
                        <p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>
                        <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>
                    `;

                    if (result.totalDirs > 0) {
                        html += `<p>🗑️ 垃圾子文件夹: <strong>${result.totalDirs}</strong> 个</p>`;
                    }

                    if (result.totalFiles > 0) {
                        html += `<p>📄 散装小文件: <strong>${result.totalFiles}</strong> 个</p>`;
                    }

                    html += `<p>💾 可释放: <strong>${this.formatSize(result.totalSize)}</strong></p>`;

                    this.showResults(html);
                    this.updateStatus(`✅ 分析完成 (${elapsed}秒)`);
                } catch (error) {
                    alert('❌ 失败: ' + error.message);
                    console.error(error);
                } finally {
                    analyzeBtn.disabled = false;
                }
            };

            deleteBtn.onclick = async () => {
                try {
                    deleteBtn.disabled = true;
                    await this.executeDelete(true);
                } catch (error) {
                    alert('❌ 删除失败: ' + error.message);
                    console.error(error);
                    deleteBtn.disabled = false;
                }
            };
        }

        updateStatus(message) {
            const status = this.ui?.querySelector('#status');
            if (status) status.textContent = message;
        }

        showResults(html) {
            const results = this.ui?.querySelector('#results');
            if (results) results.innerHTML = html;
        }

        start() {
            this.createUI();
        }
    }

    // 检查是否在文件列表页面
    function isFileListPage() {
        const url = window.location.href;
        // 只在115.com主域名且有文件列表容器时激活
        return url.includes('115.com') && 
               !url.includes('/account/') && 
               !url.includes('/login') &&
               document.querySelector('#js_operate_box');
    }

    // 集成到操作栏的按钮
    const OPERATE_BOX_SELECTOR = '#js_operate_box';
    const BUTTON_ID = 'batch-clear-btn';
    const POLL_MS = 2000; // 降低轮询频率：500ms -> 2000ms

    let lastFolders = [];
    let updateTimer = null;

    const update = () => {
        // 防抖：避免频繁调用
        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
            try {
                // 检查是否在正确的页面
                if (!isFileListPage()) return;
                
                const box = document.querySelector(OPERATE_BOX_SELECTOR);
                if (!box) return;
                
                lastFolders = getSelectedFolders();
                const hasFolder = lastFolders.length > 0;
                const btn = document.getElementById(BUTTON_ID);
                
                if (hasFolder && !btn) {
                    createButton(box);
                } else if (!hasFolder && btn) {
                    btn.remove();
                }
            } catch (e) {
                // 静默失败，不影响主页面
            }
        }, 100);
    };

    // 初始化脚本（延迟执行，避免干扰页面加载）
    function initScript() {
        try {
            // 检查页面是否准备好
            if (!isFileListPage()) {
                // 非文件列表页面，5秒后重试
                setTimeout(initScript, 5000);
                return;
            }
            
            const operateBox = document.querySelector(OPERATE_BOX_SELECTOR);
            if (!operateBox) {
                // 操作栏未加载，1秒后重试
                setTimeout(initScript, 1000);
                return;
            }
            
            // 只监听操作栏区域的变化，不监听整个页面
            const observer = new MutationObserver(() => update());
            observer.observe(operateBox.parentElement || operateBox, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['class'] // 只监听class变化
            });
            
            // 降低轮询频率
            setInterval(() => {
                if (isFileListPage()) update();
            }, POLL_MS);
            
            // 初始更新
            update();
        } catch (e) {
            console.error('115批量清理工具初始化失败:', e);
        }
    }
    
    // 延迟2秒启动，确保115页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initScript, 2000);
        });
    } else {
        setTimeout(initScript, 2000);
    }

    function createButton(box) {
        const btn = document.createElement('a');
        btn.id = BUTTON_ID;
        btn.href = 'javascript:;';
        btn.className = 'btn-operate';
        btn.title = '对选中的文件夹进行批量清理';
        btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
            <path d="M18 3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
            <line x1="12" y1="16" x2="12" y2="22"/>
        </svg><span>批量清理</span>`;
        btn.addEventListener('click', handleClick);

        if (box.firstChild) {
            box.insertBefore(btn, box.firstChild);
        } else {
            box.appendChild(btn);
        }
    }

    function getSelectedFolders() {
        const checked = Array.from(document.querySelectorAll('li[cate_id] input[type="checkbox"]:checked'));
        const selectedLis = Array.from(document.querySelectorAll('li[cate_id].selected, li[cate_id].hover'));
        const fromCheckbox = checked.map(cb => cb.closest('li[cate_id]')).filter(Boolean);
        const combined = [...fromCheckbox, ...selectedLis];
        return Array.from(new Set(combined));
    }

    function handleClick() {
        if (!lastFolders.length) {
            alert('请先勾选需要批量清理的文件夹');
            return;
        }
        
        const folders = lastFolders.map(li => ({
            cid: li.getAttribute('cate_id'),
            name: li.querySelector('.file-name span')?.textContent || '未知文件夹'
        })).filter(f => f.cid);

        if (folders.length === 0) {
            alert('未找到有效的文件夹');
            return;
        }

        const cleaner = new BatchCleaner(folders);
        cleaner.start();
    }

})();
