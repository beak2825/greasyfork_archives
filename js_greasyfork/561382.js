// ==UserScript==
// @name         115批量清理/合并工具
// @namespace    com.cloud115.batch-clear
// @version      1.5
// @author       Cantona
// @license      MIT
// @description  批量选择文件夹后进行智能清理，支持多目录同时处理，支持文件合并
// @match        https://115.com/*
// @match        https://*.115.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561382/115%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561382/115%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #batch-clear-btn, #batch-merge-btn {
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
        #batch-clear-btn:hover, #batch-merge-btn:hover {
            background: #1677ff !important;
            color: #fff !important;
        }
        #batch-merge-btn {
            color: #52c41a !important;
            border-color: #52c41a !important;
        }
        #batch-merge-btn:hover {
            background: #52c41a !important;
        }
        #batch-clear-btn svg, #batch-merge-btn svg {
            width: 14px !important;
            height: 14px !important;
            fill: none !important;
            stroke: #1677ff !important;
            stroke-width: 2 !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
            transition: stroke 0.3s !important;
        }
        #batch-merge-btn svg {
            stroke: #52c41a !important;
        }
        #batch-clear-btn:hover svg, #batch-merge-btn:hover svg {
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
        #batch-clear-ui h2.merge {
            color: #52c41a;
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
        #batch-clear-ui input[type="number"], #batch-clear-ui input[type="text"] {
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
        #batch-clear-ui button.success {
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
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
        #batch-clear-ui .file-item {
            padding: 8px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
            background: #e3f2fd;
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
        #batch-clear-ui .info-box {
            background: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #0c5460;
        }
        #batch-clear-ui .hint-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            font-style: italic;
        }
    `);

    class BatchCleaner {
        constructor(selectedItems) {
            this.selectedFolders = selectedItems.folders;
            this.selectedFiles = selectedItems.files;
            this.allFilesToDelete = [];
            this.allDirsToDelete = [];
            this.ui = null;
            this.batchSize = 20;
            this.maxConcurrent = 1;
            this.skipSubtitles = true;
            this.preserveExtensions = ['.srt', '.ass', '.ssa', '.sub', '.idx', '.vtt', '.smi', '.sup'];
        }

        isPreservedFile(filename) {
            if (!this.skipSubtitles) return false;
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
                await this.sleep(1000);
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
                    await this.sleep(1500);
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
                                await this.sleep(300);
                            }
                        }
                    } catch (error) {
                        failCount += retryBatch.length;
                    }
                    
                    await this.sleep(800);
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
                await this.sleep(1000);
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
            this.updateStatus('正在分析选中的内容...');
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            
            console.log(`[批量清理] 大小上限: ${maxSizeMB} MB = ${maxSizeBytes} bytes`);
            
            this.allFilesToDelete = [];
            this.allDirsToDelete = [];

            // 先处理直接选中的文件
            if (this.selectedFiles.length > 0) {
                this.updateStatus(`分析直接选中的 ${this.selectedFiles.length} 个文件...`);
                
                for (const f of this.selectedFiles) {
                    console.log(`[文件检查] ${f.name}:`);
                    console.log(`  原始大小: ${f.size} bytes (${this.formatSize(f.size)})`);
                    console.log(`  大小上限: ${maxSizeBytes} bytes (${maxSizeMB} MB)`);
                    
                    // 检查文件大小
                    if (f.size >= maxSizeBytes) {
                        console.log(`  -> 跳过: 文件太大 (${f.size} >= ${maxSizeBytes})`);
                        continue;
                    }
                    
                    // 检查是否为保留文件（如字幕）
                    if (this.isPreservedFile(f.name)) {
                        console.log(`  -> 跳过: 保留文件`);
                        continue;
                    }
                    
                    console.log(`  -> 标记删除`);
                    this.allFilesToDelete.push({
                        id: f.fid,
                        name: f.name,
                        size: f.size,
                        parentFolder: '当前目录'
                    });
                }
            }

            // 再处理文件夹
            for (let folderIdx = 0; folderIdx < this.selectedFolders.length; folderIdx++) {
                const folder = this.selectedFolders[folderIdx];
                const folderCid = folder.cid;
                const folderName = folder.name;

                this.updateStatus(`分析第 ${folderIdx + 1}/${this.selectedFolders.length} 个文件夹: ${folderName}`);

                await this.analyzeDirectoryRecursive(folderCid, folderName, maxSizeBytes);
            }

            return {
                totalFiles: this.allFilesToDelete.length,
                totalDirs: this.allDirsToDelete.length,
                totalSize: this.allFilesToDelete.reduce((sum, f) => sum + f.size, 0) + 
                          this.allDirsToDelete.reduce((sum, d) => sum + d.totalSize, 0)
            };
        }

        async analyzeDirectoryRecursive(dirId, dirPath, maxSizeBytes) {
            try {
                const allItems = await this.getAllFiles(dirId, { includeDir: true });
                const files = allItems.filter(item => !this.isFolder(item));
                const dirs = allItems.filter(item => this.isFolder(item));

                const smallFiles = files.map(f => ({
                    id: f.fid,
                    name: f.n || f.name,
                    size: parseInt(f.s || f.size || 0),
                    parentFolder: dirPath
                })).filter(f => f.size < maxSizeBytes && !this.isPreservedFile(f.name));

                this.allFilesToDelete.push(...smallFiles);

                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    const subDirId = this.getFolderId(dir);
                    const subDirName = dir.n || dir.name;
                    
                    if (!subDirId) continue;
                    
                    await this.analyzeDirectoryRecursive(subDirId, `${dirPath}/${subDirName}`, maxSizeBytes);
                    
                    await this.sleep(1200);
                }

                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    const subDirId = this.getFolderId(dir);
                    const subDirName = dir.n || dir.name;
                    
                    if (!subDirId) continue;
                    
                    const alreadyMarked = this.allDirsToDelete.some(d => d.id === subDirId);
                    if (alreadyMarked) continue;
                    
                    const dirInfo = await this.analyzeDirContents({ id: subDirId, name: subDirName }, maxSizeBytes);
                    
                    if (dirInfo.isEmpty) {
                        this.allDirsToDelete.push({
                            id: subDirId,
                            name: subDirName,
                            fileCount: 0,
                            totalSize: 0,
                            reason: '空文件夹',
                            parentFolder: dirPath
                        });
                    } else if (dirInfo.allSmall && !dirInfo.hasSubDirs) {
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
                    
                    await this.sleep(1000);
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
                if (this.selectedFolders.length > 0) {
                    msg += `📂 处理 ${this.selectedFolders.length} 个文件夹\n`;
                }
                if (this.selectedFiles.length > 0) {
                    msg += `📄 处理 ${this.selectedFiles.length} 个直接选中的文件\n`;
                }
                msg += `\n`;
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
            
            let resultHtml = '<h3>✅ 清理完成</h3>';
            if (this.selectedFolders.length > 0) {
                resultHtml += `<p>📂 处理了 ${this.selectedFolders.length} 个文件夹</p>`;
            }
            if (this.selectedFiles.length > 0) {
                resultHtml += `<p>📄 处理了 ${this.selectedFiles.length} 个直接选中的文件</p>`;
            }
            resultHtml += `
                <p>📁 子文件夹: 成功 <strong>${dirSuccess}</strong>, 失败 ${dirFail}</p>
                <p>📄 文件: 成功 <strong>${fileSuccess}</strong>, 失败 ${fileFail}</p>
                <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒 | 速度: <strong>${speed}</strong> 个/秒</p>
                <p style="color: #28a745; font-size: 14px; margin-top: 15px; font-weight: bold;">✅ 3秒后自动刷新...</p>
            `;
            
            this.showResults(resultHtml);

            await this.sleep(3000);
            
            if (this.ui) this.ui.remove();
            
            try {
                if (window.top && window.top !== window) {
                    window.top.location.reload();
                } else if (window.parent && window.parent !== window) {
                    window.parent.location.reload();
                } else {
                    location.reload();
                }
            } catch (e) {
                location.reload();
            }
        }

        createUI() {
            if (this.ui) this.ui.remove();

            const folderListHtml = this.selectedFolders.map(f => 
                `<div class="folder-item">📁 ${f.name} (CID: ${f.cid})</div>`
            ).join('');
            
            const fileListHtml = this.selectedFiles.map(f => 
                `<div class="file-item">📄 ${f.name} (${this.formatSize(f.size)})</div>`
            ).join('');

            const container = document.createElement('div');
            container.id = 'batch-clear-ui';
            container.innerHTML = `
                <button class="close-btn" onclick="this.parentElement.remove()">×</button>

                <h2>🧹 批量清理工具</h2>

                <div class="success-box">
                    📂 已选择 <strong>${this.selectedFolders.length}</strong> 个文件夹<br>
                    📄 已选择 <strong>${this.selectedFiles.length}</strong> 个文件<br>
                    📦 批量模式: 20个/批，低频处理，避免风控
                </div>

                <div class="folder-list">
                    ${folderListHtml}
                    ${fileListHtml}
                </div>

                <div class="control-group">
                    <label>文件大小上限:</label>
                    <input type="number" id="maxSize" value="100" min="0" step="0.1"> MB
                    <span style="font-size: 12px; color: #666;">(仅删除小于此大小的文件)</span>
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
                    
                    const startTime = Date.now();
                    const maxSize = parseFloat(maxSizeInput.value);
                    this.skipSubtitles = skipSubtitlesCheckbox.checked;
                    this.updateStatus('正在分析文件...');
                    const result = await this.analyzeMultipleFolders(maxSize);
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

                    if (result.totalFiles === 0 && result.totalDirs === 0) {
                        this.updateStatus('✅ 未发现需要清理的内容');
                        let html = '<h3>📊 分析结果</h3>';
                        if (this.selectedFolders.length > 0) {
                            html += `<p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>`;
                        }
                        if (this.selectedFiles.length > 0) {
                            html += `<p>📄 已分析 ${this.selectedFiles.length} 个文件</p>`;
                        }
                        html += `
                            <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>
                            <p>✨ 所有文件都大于 ${maxSize}MB 或为保留文件</p>
                        `;
                        this.showResults(html);
                        oneClickBtn.disabled = false;
                        analyzeBtn.disabled = false;
                        return;
                    }

                    let html = '<h3>📊 分析结果</h3>';
                    if (this.selectedFolders.length > 0) {
                        html += `<p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>`;
                    }
                    if (this.selectedFiles.length > 0) {
                        html += `<p>📄 已分析 ${this.selectedFiles.length} 个文件</p>`;
                    }
                    html += `<p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>`;

                    if (result.totalDirs > 0) {
                        html += `<p>🗑️ 垃圾子文件夹: <strong>${result.totalDirs}</strong> 个</p>`;
                    }

                    if (result.totalFiles > 0) {
                        html += `<p>📄 小于${maxSize}MB的文件: <strong>${result.totalFiles}</strong> 个</p>`;
                    }

                    html += `<p>💾 可释放: <strong>${this.formatSize(result.totalSize)}</strong></p>`;
                    this.showResults(html);
                    
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

                    let html = '<h3>📊 分析结果</h3>';
                    if (this.selectedFolders.length > 0) {
                        html += `<p>📂 已分析 ${this.selectedFolders.length} 个文件夹</p>`;
                    }
                    if (this.selectedFiles.length > 0) {
                        html += `<p>📄 已分析 ${this.selectedFiles.length} 个文件</p>`;
                    }
                    html += `<p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>`;

                    if (result.totalDirs > 0) {
                        html += `<p>🗑️ 垃圾子文件夹: <strong>${result.totalDirs}</strong> 个</p>`;
                    }

                    if (result.totalFiles > 0) {
                        html += `<p>📄 小于${maxSize}MB的文件: <strong>${result.totalFiles}</strong> 个</p>`;
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

    // FileMerger 类代码保持不变... (由于字数限制省略,与之前版本相同)
    class FileMerger {
        constructor(selectedItems, currentDirCid) {
            this.selectedFolders = selectedItems.folders;
            this.selectedFiles = selectedItems.files;
            this.currentDirCid = currentDirCid;
            this.ui = null;
            this.mergeFolderName = '';
            this.mergeFolderId = null;
            this.allFiles = [];
            this.batchSize = 20;
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
                await this.sleep(1000);
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

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async createMergeFolder() {
            const response = await fetch('https://webapi.115.com/files/add', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `pid=${this.currentDirCid}&cname=${encodeURIComponent(this.mergeFolderName)}`
            });
            
            const result = await response.json();
            if (result.state) {
                this.mergeFolderId = result.cid;
                return result.cid;
            }
            throw new Error(result.error || '创建合并文件夹失败');
        }

        async findOrCreateMergeFolder() {
            if (!this.mergeFolderName) {
                this.mergeFolderId = this.currentDirCid;
                this.updateStatus(`✅ 将直接移动到当前目录 (CID: ${this.currentDirCid})`);
                return this.mergeFolderId;
            }

            this.updateStatus(`检查是否存在"${this.mergeFolderName}"文件夹...`);
            
            const items = await this.getAllFiles(this.currentDirCid, { includeDir: true });
            const existingFolder = items.find(item => 
                this.isFolder(item) && (item.n || item.name) === this.mergeFolderName
            );

            if (existingFolder) {
                this.mergeFolderId = this.getFolderId(existingFolder);
                this.updateStatus(`✅ 找到已存在的"${this.mergeFolderName}"文件夹`);
                return this.mergeFolderId;
            }

            this.updateStatus(`创建"${this.mergeFolderName}"文件夹...`);
            await this.createMergeFolder();
            this.updateStatus(`✅ 已创建"${this.mergeFolderName}"文件夹`);
            return this.mergeFolderId;
        }

        async collectAllFilesRecursive(dirId, dirPath) {
            try {
                const allItems = await this.getAllFiles(dirId, { includeDir: true });
                const files = allItems.filter(item => !this.isFolder(item));
                const dirs = allItems.filter(item => this.isFolder(item));

                for (const file of files) {
                    this.allFiles.push({
                        id: file.fid,
                        name: file.n || file.name,
                        size: parseInt(file.s || file.size || 0),
                        sourcePath: dirPath
                    });
                }

                for (const dir of dirs) {
                    const subDirId = this.getFolderId(dir);
                    const subDirName = dir.n || dir.name;
                    if (!subDirId) continue;
                    await this.collectAllFilesRecursive(subDirId, `${dirPath}/${subDirName}`);
                    await this.sleep(1000);
                }
            } catch (error) {
                console.error(`收集目录 ${dirPath} 文件失败:`, error);
            }
        }

        async collectAllFiles() {
            this.updateStatus('正在收集所有文件...');
            this.allFiles = [];

            if (this.selectedFiles.length > 0) {
                this.updateStatus(`收集直接选中的 ${this.selectedFiles.length} 个文件...`);
                for (const file of this.selectedFiles) {
                    this.allFiles.push({
                        id: file.fid,
                        name: file.name,
                        size: file.size,
                        sourcePath: '当前目录'
                    });
                }
            }

            if (this.selectedFolders.length > 0) {
                for (let i = 0; i < this.selectedFolders.length; i++) {
                    const folder = this.selectedFolders[i];
                    this.updateStatus(`收集第 ${i + 1}/${this.selectedFolders.length} 个文件夹: ${folder.name}`);
                    await this.collectAllFilesRecursive(folder.cid, folder.name);
                }
            }

            return this.allFiles;
        }

        async moveFilesBatch(fileIds, targetCid) {
            const fidParams = fileIds.map((fid, idx) => `fid[${idx}]=${fid}`).join('&');
            const response = await fetch('https://webapi.115.com/files/move', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `${fidParams}&pid=${targetCid}`
            });
            return await response.json();
        }

        async moveAllFiles() {
            if (this.allFiles.length === 0) {
                throw new Error('没有文件需要移动');
            }

            const fileIds = this.allFiles.map(f => f.id);
            const batches = [];
            for (let i = 0; i < fileIds.length; i += this.batchSize) {
                batches.push(fileIds.slice(i, i + this.batchSize));
            }

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                
                try {
                    const result = await this.moveFilesBatch(batch, this.mergeFolderId);
                    
                    if (result.state) {
                        successCount += batch.length;
                    } else {
                        failCount += batch.length;
                    }
                } catch (error) {
                    failCount += batch.length;
                }

                const processed = (i + 1) * this.batchSize;
                const progress = Math.round((Math.min(processed, fileIds.length) / fileIds.length) * 100);
                this.updateProgress(progress, `${Math.min(processed, fileIds.length)}/${fileIds.length}`);

                if (i < batches.length - 1) {
                    await this.sleep(1500);
                }
            }

            return { successCount, failCount };
        }

        formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        }

        async execute() {
            try {
                this.showProgressBar();
                const startTime = Date.now();

                await this.findOrCreateMergeFolder();
                
                await this.collectAllFiles();
                
                if (this.allFiles.length === 0) {
                    this.updateStatus('✅ 未发现需要移动的文件');
                    this.showResults(`
                        <h3>📊 合并结果</h3>
                        <p>📂 已扫描 ${this.selectedFolders.length} 个文件夹</p>
                        <p>📄 已选择 ${this.selectedFiles.length} 个文件</p>
                        <p>✨ 未发现需要移动的文件</p>
                    `);
                    return;
                }

                this.updateStatus(`开始移动 ${this.allFiles.length} 个文件...`);
                const result = await this.moveAllFiles();

                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                const totalSize = this.allFiles.reduce((sum, f) => sum + f.size, 0);

                const targetDesc = this.mergeFolderName ? 
                    `<strong>${this.mergeFolderName}</strong>` : 
                    `<strong>当前目录</strong> (CID: ${this.currentDirCid})`;

                this.updateProgress(100, '完成');
                this.showResults(`
                    <h3>✅ 合并完成</h3>
                    <p>📂 处理了 ${this.selectedFolders.length} 个文件夹</p>
                    <p>📄 处理了 ${this.selectedFiles.length} 个直接选中的文件</p>
                    <p>📁 目标位置: ${targetDesc}</p>
                    <p>✅ 移动成功: <strong>${result.successCount}</strong> 个文件</p>
                    <p>❌ 移动失败: ${result.failCount} 个文件</p>
                    <p>💾 总大小: <strong>${this.formatSize(totalSize)}</strong></p>
                    <p>⏱️ 耗时: <strong>${elapsed}</strong> 秒</p>
                    <p style="color: #28a745; font-size: 14px; margin-top: 15px; font-weight: bold;">✅ 3秒后自动刷新...</p>
                `);

                await this.sleep(3000);
                
                if (this.ui) this.ui.remove();
                
                try {
                    if (window.top && window.top !== window) {
                        window.top.location.reload();
                    } else if (window.parent && window.parent !== window) {
                        window.parent.location.reload();
                    } else {
                        location.reload();
                    }
                } catch (e) {
                    location.reload();
                }
            } catch (error) {
                alert('❌ 合并失败: ' + error.message);
                console.error(error);
            }
        }

        createUI() {
            if (this.ui) this.ui.remove();

            const folderListHtml = this.selectedFolders.map(f => 
                `<div class="folder-item">📁 ${f.name} (CID: ${f.cid})</div>`
            ).join('');
            
            const fileListHtml = this.selectedFiles.map(f => 
                `<div class="file-item">📄 ${f.name} (${this.formatSize(f.size)})</div>`
            ).join('');

            const container = document.createElement('div');
            container.id = 'batch-clear-ui';
            container.innerHTML = `
                <button class="close-btn" onclick="this.parentElement.remove()">×</button>

                <h2 class="merge">📦 文件合并工具</h2>

                <div class="success-box">
                    📂 已选择 <strong>${this.selectedFolders.length}</strong> 个文件夹<br>
                    📄 已选择 <strong>${this.selectedFiles.length}</strong> 个文件<br>
                    🎯 将所有文件移动到指定位置
                </div>

                <div class="info-box">
                    📍 当前目录 CID: <strong>${this.currentDirCid}</strong>
                </div>

                <div class="folder-list">
                    ${folderListHtml}
                    ${fileListHtml}
                </div>

                <div class="control-group">
                    <label>目标文件夹名称:</label>
                    <input type="text" id="mergeFolderName" value="" placeholder="留空则移动到当前目录" style="flex: 1; min-width: 200px;">
                </div>
                <div class="hint-text">💡 提示: 留空则直接移动到当前目录，输入名称则移动到当前目录下的指定子文件夹</div>

                <div class="button-group">
                    <button id="executeBtn" class="success">🚀 开始合并</button>
                </div>

                <div class="status" id="status">💡 点击"开始合并"将所有文件移动到指定位置</div>
                
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

        bindEvents() {
            const executeBtn = this.ui.querySelector('#executeBtn');
            const mergeNameInput = this.ui.querySelector('#mergeFolderName');

            executeBtn.onclick = async () => {
                try {
                    const inputName = mergeNameInput.value.trim();
                    this.mergeFolderName = inputName;
                    
                    executeBtn.disabled = true;
                    await this.execute();
                } catch (error) {
                    alert('❌ 失败: ' + error.message);
                    console.error(error);
                    executeBtn.disabled = false;
                }
            };
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

    function isFileListPage() {
        const url = window.location.href;
        return url.includes('115.com') && 
               !url.includes('/account/') && 
               !url.includes('/login') &&
               document.querySelector('#js_operate_box');
    }

    const OPERATE_BOX_SELECTOR = '#js_operate_box';
    const CLEAR_BUTTON_ID = 'batch-clear-btn';
    const MERGE_BUTTON_ID = 'batch-merge-btn';
    const POLL_MS = 2000;

    let lastSelectedItems = { folders: [], files: [] };
    let updateTimer = null;

    const update = () => {
        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
            try {
                if (!isFileListPage()) return;
                
                const box = document.querySelector(OPERATE_BOX_SELECTOR);
                if (!box) return;
                
                lastSelectedItems = getSelectedItems();
                const hasItems = lastSelectedItems.folders.length > 0 || lastSelectedItems.files.length > 0;
                
                const clearBtn = document.getElementById(CLEAR_BUTTON_ID);
                const mergeBtn = document.getElementById(MERGE_BUTTON_ID);
                
                if (hasItems && !clearBtn) {
                    createButtons(box);
                } else if (!hasItems && clearBtn) {
                    clearBtn.remove();
                }
                
                if (hasItems && !mergeBtn) {
                    createButtons(box);
                } else if (!hasItems && mergeBtn) {
                    mergeBtn.remove();
                }
            } catch (e) {
                // 静默失败
            }
        }, 100);
    };

    function initScript() {
        try {
            if (!isFileListPage()) {
                setTimeout(initScript, 5000);
                return;
            }
            
            const operateBox = document.querySelector(OPERATE_BOX_SELECTOR);
            if (!operateBox) {
                setTimeout(initScript, 1000);
                return;
            }
            
            const observer = new MutationObserver(() => update());
            observer.observe(operateBox.parentElement || operateBox, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
            
            setInterval(() => {
                if (isFileListPage()) update();
            }, POLL_MS);
            
            update();
        } catch (e) {
            console.error('115批量清理工具初始化失败:', e);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initScript, 2000);
        });
    } else {
        setTimeout(initScript, 2000);
    }

    function createButtons(box) {
        const hasItems = lastSelectedItems.folders.length > 0 || lastSelectedItems.files.length > 0;
        
        if (hasItems && !document.getElementById(CLEAR_BUTTON_ID)) {
            const clearBtn = document.createElement('a');
            clearBtn.id = CLEAR_BUTTON_ID;
            clearBtn.href = 'javascript:;';
            clearBtn.className = 'btn-operate';
            clearBtn.title = '对选中的文件夹和文件进行批量清理';
            clearBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
                <path d="M18 3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
                <line x1="12" y1="16" x2="12" y2="22"/>
            </svg><span>批量清理</span>`;
            clearBtn.addEventListener('click', handleClearClick);

            if (box.firstChild) {
                box.insertBefore(clearBtn, box.firstChild);
            } else {
                box.appendChild(clearBtn);
            }
        }

        if (hasItems && !document.getElementById(MERGE_BUTTON_ID)) {
            const mergeBtn = document.createElement('a');
            mergeBtn.id = MERGE_BUTTON_ID;
            mergeBtn.href = 'javascript:;';
            mergeBtn.className = 'btn-operate';
            mergeBtn.title = '将选中的文件夹和文件合并到指定目录';
            mergeBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg><span>文件合并</span>`;
            mergeBtn.addEventListener('click', handleMergeClick);

            if (box.firstChild) {
                box.insertBefore(mergeBtn, box.firstChild);
            } else {
                box.appendChild(mergeBtn);
            }
        }
    }

    function getSelectedItems() {
        const checked = Array.from(document.querySelectorAll('li input[type="checkbox"]:checked'));
        const selectedLis = Array.from(document.querySelectorAll('li.selected, li.hover'));
        const fromCheckbox = checked.map(cb => cb.closest('li')).filter(Boolean);
        const combined = [...fromCheckbox, ...selectedLis];
        const uniqueLis = Array.from(new Set(combined));

        const folders = [];
        const files = [];

        uniqueLis.forEach(li => {
            const cateId = li.getAttribute('cate_id');
            const fileId = li.getAttribute('file_id');
            
            // 优先使用原始size属性
            const sizeAttr = li.getAttribute('file_size');
            
            // 获取文件名
            const nameEl = li.querySelector('.file-name span, .file-name');
            const name = nameEl?.textContent?.trim() || '未知';
            
            if (cateId) {
                folders.push({ cid: cateId, name: name });
            } else if (fileId) {
                // 优先使用属性,其次解析文本
                let size = 0;
                if (sizeAttr) {
                    size = parseInt(sizeAttr);
                    console.log(`[getSelectedItems] ${name}: 从属性获取 file_size="${sizeAttr}" = ${size} bytes`);
                } else {
                    const sizeEl = li.querySelector('.size');
                    const sizeText = sizeEl?.textContent?.trim() || '0';
                    size = parseSizeText(sizeText);
                    console.log(`[getSelectedItems] ${name}: 从文本解析 "${sizeText}" = ${size} bytes`);
                }
                
                files.push({ 
                    fid: fileId, 
                    name: name,
                    size: size
                });
            }
        });

        return { folders, files };
    }

    function parseSizeText(text) {
        if (!text) return 0;
        
        // 清理文本
        text = text.trim().replace(/\s+/g, '');
        
        // 匹配各种格式: 17.00B, 242.00B, 2.27GB 等
        const match = text.match(/([\d,.]+)([KMGT]?B)/i);
        if (!match) {
            console.warn(`[parseSizeText] 无法解析: "${text}"`);
            return 0;
        }
        
        // 移除千位分隔符
        const value = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2].toUpperCase();
        
        const multipliers = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024,
            'TB': 1024 * 1024 * 1024 * 1024
        };
        
        const bytes = Math.round(value * (multipliers[unit] || 1));
        console.log(`[parseSizeText] "${text}" -> ${value} ${unit} = ${bytes} bytes`);
        
        return bytes;
    }

    function getCurrentDirCid() {
        try {
            let targetUrl = window.location.href;
            
            if (window.top && window.top !== window) {
                try {
                    targetUrl = window.top.location.href;
                } catch (e) {
                    if (window.parent && window.parent !== window) {
                        try {
                            targetUrl = window.parent.location.href;
                        } catch (e2) {
                            // 无法访问父窗口
                        }
                    }
                }
            }
            
            const match = targetUrl.match(/[?&]cid=(\d+)/);
            const cid = match ? match[1] : '0';
            
            console.log('[115批量工具] 当前目录CID:', cid);
            return cid;
        } catch (e) {
            console.error('[115批量工具] 获取CID失败:', e);
            return '0';
        }
    }

    function handleClearClick() {
        if (!lastSelectedItems.folders.length && !lastSelectedItems.files.length) {
            alert('请先勾选需要批量清理的文件夹或文件');
            return;
        }

        const cleaner = new BatchCleaner(lastSelectedItems);
        cleaner.start();
    }

    function handleMergeClick() {
        if (!lastSelectedItems.folders.length && !lastSelectedItems.files.length) {
            alert('请先勾选需要合并的文件夹或文件');
            return;
        }

        const currentCid = getCurrentDirCid();
        const merger = new FileMerger(lastSelectedItems, currentCid);
        merger.start();
    }

})();
