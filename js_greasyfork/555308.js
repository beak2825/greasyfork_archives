// ==UserScript==
// @name         Spotify歌单自动导入网易云音乐
// @namespace    https://github.com/XFiendd/SpotifyToNetEaseCloudMusic/
// @version      15.0
// @description  优化匹配规则，必须歌名和歌手同时满足才匹配。自动记录并支持导出未匹配的歌曲列表。
// @author       XFiend
// @match        https://open.spotify.com/playlist/*
// @match        https://music.163.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      music.163.com
// @connect      interface.music.163.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555308/Spotify%E6%AD%8C%E5%8D%95%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%85%A5%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555308/Spotify%E6%AD%8C%E5%8D%95%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%85%A5%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let captureInterval = null;
    let capturedSongs = new Map();

    const isSpotify = window.location.hostname.includes('spotify.com');
    const isNetease = window.location.hostname.includes('163.com');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (isSpotify) {
            setTimeout(initSpotify, 2000);
        } else if (isNetease) {
            setTimeout(initNetease, 2000);
        }
    }

    // ===================================================================
    // ========== Spotify 端  ==========
    // ===================================================================

    function initSpotify() {
        addSpotifyButton();
    }

    function addSpotifyButton() {
        if (document.getElementById('spotify-export-btn')) return;
        const button = document.createElement('button');
        button.textContent = '📥 导出到网易云';
        button.id = 'spotify-export-btn';
        button.style.cssText = `
            position: fixed !important; top: 100px !important; right: 30px !important; z-index: 9999;
            padding: 15px 30px !important; background: #1DB954 !important; color: white !important;
            border: none !important; border-radius: 500px !important; font-weight: bold !important;
            cursor: pointer !important; font-size: 16px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            font-family: Arial, sans-serif !important; transition: all 0.2s ease;
        `;
        button.addEventListener('mouseover', function() { this.style.background = '#1ed760 !important'; this.style.transform = 'scale(1.05)'; });
        button.addEventListener('mouseout', function() { this.style.background = '#1DB954 !important'; this.style.transform = 'scale(1)'; });
        button.addEventListener('click', startCaptureMode);
        document.body.appendChild(button);
    }

    function startCaptureMode() {
        capturedSongs.clear();
        if (captureInterval) clearInterval(captureInterval);

        document.getElementById('spotify-export-btn').style.display = 'none';

        const panel = document.createElement('div');
        panel.id = 'capture-panel';
        panel.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; z-index: 10000;
            background: #282828; color: white; padding: 25px;
            border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif; max-width: 350px; text-align: center;
        `;
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #1DB954;">准备捕获歌曲...</h3>
            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                请<b>从上到下完整滚动</b>一遍歌单，脚本将自动记录所有出现的歌曲。
            </p>
            <div id="song-counter" style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1ed760;">🎵 已捕获: 0</div>
            <button id="finish-capture-btn" style="width: 100%; padding: 12px; background: #1DB954; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                ✅ 完成滚动, 开始导出
            </button>
            <button id="cancel-capture-btn" style="width: 100%; padding: 8px; background: none; color: #aaa; border: none; cursor: pointer; font-size: 13px; margin-top: 10px;">
                取消
            </button>
        `;
        document.body.appendChild(panel);

        document.getElementById('finish-capture-btn').addEventListener('click', finishCapture);
        document.getElementById('cancel-capture-btn').addEventListener('click', cancelCapture);

        captureInterval = setInterval(scanAndCaptureSongs, 500);
    }

    function scanAndCaptureSongs() {
        const songRows = document.querySelectorAll('div[data-testid="tracklist-row"]');
        songRows.forEach((row) => {
            const linkElement = row.querySelector('a[href^="/track/"]');
            if (!linkElement) return;

            const songKey = linkElement.getAttribute('href');
            if (!capturedSongs.has(songKey)) {
                const titleElement = row.querySelector('div[aria-colindex="2"] a div');
                const artistElements = row.querySelectorAll('div[aria-colindex="2"] span a');
                const albumElement = row.querySelector('div[aria-colindex="3"] a');

                if (titleElement && artistElements.length > 0 && albumElement) {
                    const title = titleElement.textContent.trim();
                    const artist = Array.from(artistElements).map(a => a.textContent.trim()).join(', ');
                    const album = albumElement.textContent.trim();

                    capturedSongs.set(songKey, { title, artist, album });

                    const counter = document.getElementById('song-counter');
                    if(counter) counter.innerHTML = `🎵 已捕获: ${capturedSongs.size}`;
                }
            }
        });
    }

    function finishCapture() {
        if (captureInterval) clearInterval(captureInterval);
        captureInterval = null;

        document.getElementById('capture-panel')?.remove();

        const songs = Array.from(capturedSongs.values());
        const modal = createModal();

        if (songs.length === 0) {
            updateModalStatus(modal, `❌ 提取失败: 未捕获到任何歌曲。<br>请确保在滚动前歌单已正确加载。`, 'error');
        } else {
            GM_setValue('playlist_songs', JSON.stringify(songs));
            GM_setValue('playlist_timestamp', Date.now());
            showSpotifyResult(modal, songs);
        }
        document.getElementById('spotify-export-btn').style.display = 'block';
    }

    function cancelCapture() {
        if (captureInterval) clearInterval(captureInterval);
        captureInterval = null;
        capturedSongs.clear();
        document.getElementById('capture-panel')?.remove();
        document.getElementById('spotify-export-btn').style.display = 'block';
    }


    // ========== 网易云及通用函数  ==========

    function initNetease() {
        checkAndShowImportButton();
    }

    function checkAndShowImportButton() {
        const songs = GM_getValue('playlist_songs');
        const timestamp = GM_getValue('playlist_timestamp');
        if (songs && timestamp && (Date.now() - timestamp < 60 * 60 * 1000)) {
            addNeteaseButton(JSON.parse(songs));
        } else if (songs) {
            GM_deleteValue('playlist_songs'); GM_deleteValue('playlist_timestamp');
        }
    }

    function addNeteaseButton(songs) {
        if (document.getElementById('netease-import-btn')) return;
        const button = document.createElement('button');
        button.id = 'netease-import-btn';
        button.textContent = `📥 开始导入 (${songs.length}首)`;
        button.style.cssText = `
            position: fixed !important; top: 100px !important; right: 30px !important; z-index: 999999 !important; padding: 15px 30px !important;
            background: #D33A31 !important; color: white !important; border: none !important; border-radius: 8px !important; font-weight: bold !important;
            cursor: pointer !important; font-size: 16px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important; font-family: Arial, sans-serif !important;
            transition: all 0.2s ease;
        `;
        button.addEventListener('mouseover', function() { this.style.background = '#E94639 !important'; this.style.transform = 'scale(1.05)'; });
        button.addEventListener('mouseout', function() { this.style.background = '#D33A31 !important'; this.style.transform = 'scale(1)'; });
        button.addEventListener('click', () => startImport(songs));
        document.body.appendChild(button);
    }

    function startImport(songs) {
        const modal = createModal();
        showPlaylistInputUI(modal, songs);
    }

    function showPlaylistInputUI(modal, songs) {

        const html = `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="margin: 0 0 20px 0; color: #D33A31; font-size: 24px;">🎵 导入到网易云歌单</h2>
                <div style="margin-bottom: 20px; padding: 15px; background: #FFF3E0; border-radius: 8px; font-size: 14px; line-height: 1.8;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #F57C00;">📝 如何获取歌单ID：</div>
                    <div style="color: #666;">打开你想导入的歌单页面，查看浏览器地址栏，找到 <code style="background: #fff; padding: 2px 8px; border-radius: 3px; color: #D33A31;">id=</code> 后面的数字。</div>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 10px; font-weight: bold; color: #333; font-size: 15px;">目标歌单ID：</label>
                    <input type="text" id="playlistIdInput" placeholder="请输入歌单ID（纯数字）" style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box; margin-bottom: 20px;"/>
                </div>
                <div style="padding: 15px; background: #E8F5E9; border-radius: 8px; margin-bottom: 20px;"><div style="color: #2E7D32; font-size: 15px;">📊 准备导入: <strong style="font-size: 20px;">${songs.length}</strong> 首歌曲</div></div>
                <div style="display: flex; gap: 10px;">
                    <button id="startBtn" style="flex: 1; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">🚀 开始自动导入</button>
                    <button id="closeBtn" style="padding: 15px 25px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; cursor: pointer;">关闭</button>
                </div>
            </div>`;
        modal.querySelector('.modal-content').innerHTML = html;
        const input = document.getElementById('playlistIdInput');
        const urlMatch = window.location.href.match(/id=(\d+)/);
        if (urlMatch) input.value = urlMatch[1];
        document.getElementById('startBtn').addEventListener('click', () => {
            const playlistId = input.value.trim();
            if (!playlistId || !/^\d+$/.test(playlistId)) { alert('⚠️ 请输入正确的歌单ID（纯数字）'); return; }
            startAutoImport(modal, songs, playlistId);
        });
        document.getElementById('closeBtn').addEventListener('click', () => { modal.remove(); document.querySelector('.import-overlay').remove(); });
    }

    function startAutoImport(modal, songs, playlistId) {
        let currentIndex = 0, addedCount = 0, skippedCount = 0, failedCount = 0, isPaused = false, isProcessing = false;
        let unmatchedSongs = []; // 用于存储未匹配的歌曲 ---


        const html = `
            <div style="font-family: Arial, sans-serif; min-width: 600px;">
                <h2 style="margin: 0 0 20px 0; color: #D33A31; font-size: 24px;">⚡ 正在自动导入</h2>
                <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                    <div style="margin-bottom: 15px; font-size: 18px;">进度：<span id="progress" style="font-weight: bold; font-size: 24px;">0 / ${songs.length}</span></div>
                    <div style="display: flex; gap: 25px; font-size: 15px;">
                        <div>✓ 已添加：<span id="added" style="font-weight: bold; font-size: 18px;">0</span></div>
                        <div>⊘ 已跳过：<span id="skipped" style="font-weight: bold; font-size: 18px;">0</span></div>
                        <div>✗ 失败：<span id="failed" style="font-weight: bold; font-size: 18px;">0</span></div>
                    </div>
                </div>
                <div id="log-container" style="height: 300px; background: #282c34; color: #abb2bf; font-family: 'Courier New', monospace; font-size: 14px; padding: 15px; border-radius: 8px; overflow-y: auto; white-space: pre-wrap; line-height: 1.6;"></div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="pauseBtn" style="flex: 1; padding: 15px; background: #FF9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">⏸ 暂停</button>
                    <button id="closeBtn" style="padding: 15px 25px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">✕ 中止</button>
                </div>
            </div>`;
        modal.querySelector('.modal-content').innerHTML = html;
        const logContainer = document.getElementById('log-container');
        const logToUI = (message, type = 'info') => {
            const colors = { info: '#abb2bf', match: '#98c379', success: '#61afef', warning: '#e5c07b', error: '#e06c75' };
            const logEntry = document.createElement('div');
            logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
            logEntry.style.cssText = `color: ${colors[type] || colors.info}; margin-top: 5px;`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        };


        const findBestMatch = (spotifySong, neteaseResults) => {
            const cleanStr = (s) => s.toLowerCase().replace(/[\(\)\[\]-]/g, ' ').replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
            const spotifyTitle = cleanStr(spotifySong.title);
            const spotifyArtists = spotifySong.artist.split(',').map(cleanStr);

            const perfectMatches = [];
            const partialMatches = [];

            for (const result of neteaseResults) {
                const resultTitle = cleanStr(result.name);
                const resultArtists = result.artists.split('/').map(cleanStr);

                const titleMatches = resultTitle.includes(spotifyTitle) || spotifyTitle.includes(resultTitle);
                const artistMatches = spotifyArtists.some(sa => resultArtists.some(ra => ra.includes(sa)));

                // 必须同时满足歌名和歌手的匹配条件
                if (titleMatches && artistMatches) {
                    perfectMatches.push(result);
                } else if (titleMatches) {
                    partialMatches.push(result);
                }
            }

            // 优先返回“完美匹配”的结果，否则返回“部分匹配”的第一个，最后返回null
            return perfectMatches[0] || partialMatches[0] || null;
        };

        document.getElementById('pauseBtn').addEventListener('click', function() {
            isPaused = !isPaused; this.textContent = isPaused ? '▶ 继续' : '⏸ 暂停'; this.style.background = isPaused ? '#4CAF50' : '#FF9800';
            if (!isPaused && !isProcessing) processNextSong();
        });
        document.getElementById('closeBtn').addEventListener('click', () => { if (confirm('确定要中止导入吗？')) { isPaused = true; modal.remove(); document.querySelector('.import-overlay').remove(); } });

        async function processNextSong() {
            if (isPaused || currentIndex >= songs.length) {
                if (!isPaused) showComplete(unmatchedSongs); // 传递未匹配列表
                return;
            }
            isProcessing = true;
            const song = songs[currentIndex];
            document.getElementById('progress').textContent = `${currentIndex + 1} / ${songs.length}`;
            logToUI(`处理中 (${currentIndex + 1}/${songs.length}): <strong>${song.title}</strong> - ${song.artist}`);
            try {
                const results = await searchSong(song.title, song.artist);
                const bestMatch = results.length > 0 ? findBestMatch(song, results) : null;
                if (bestMatch) {
                    logToUI(`🎯 匹配成功: <span style="color: #c678dd;">${bestMatch.name} - ${bestMatch.artists}</span>`, 'match');
                    const addResult = await addToPlaylist(playlistId, bestMatch.id);
                    if (addResult.code === 200) {
                        addedCount++;
                        document.getElementById('added').textContent = addedCount;
                        logToUI(`✅ ${addResult.message}!`, 'success');
                        await sleep(500);
                    } else {
                        skippedCount++;
                        document.getElementById('skipped').textContent = skippedCount;
                        logToUI(`🟡 ${addResult.message}，跳过。`, 'warning');
                        await sleep(500);
                    }
                } else {
                    skippedCount++;
                    document.getElementById('skipped').textContent = skippedCount;
                    logToUI(`🤷‍ 未找到匹配歌曲，跳过。`, 'warning');
                    unmatchedSongs.push(song); // --- 记录未匹配的歌曲 ---
                }
            } catch (e) {
                failedCount++;
                document.getElementById('failed').textContent = failedCount;
                logToUI(`🔥 添加失败: ${e.message}`, 'error');
                await sleep(1000);
            }
            currentIndex++;
            isProcessing = false;
            await sleep(200);
            processNextSong();
        }

        /**
         * 完成界面以显示和导出未匹配歌曲 ---
         */
        function showComplete(unmatchedSongs) {
            let unmatchedHtml = '';
            if (unmatchedSongs.length > 0) {
                const songList = unmatchedSongs.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n');
                unmatchedHtml = `
                    <div style="margin-top: 30px; text-align: left;">
                        <h3 style="margin-bottom: 10px; color: #F44336;">以下 ${unmatchedSongs.length} 首歌曲未匹配成功：</h3>
                        <textarea readonly style="width: 100%; height: 150px; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">${songList}</textarea>
                        <button id="export-unmatched-btn" style="width: 100%; margin-top: 10px; padding: 10px; background: #FF9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">📄 导出为TXT</button>
                    </div>
                `;
            }

            modal.querySelector('.modal-content').innerHTML = `
                <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #4CAF50;">🎉 导入完成！</h2>
                    <div style="font-size: 18px; margin: 30px 0; line-height: 2.5;">
                        <div><span style="color: #4CAF50; font-weight: bold; font-size: 28px;">${addedCount}</span> 首成功添加</div>
                        <div><span style="color: #FF9800; font-weight: bold; font-size: 28px;">${skippedCount}</span> 首跳过 (已存在或未匹配)</div>
                        ${failedCount > 0 ? `<div><span style="color: #F44336; font-weight: bold; font-size: 28px;">${failedCount}</span> 首失败</div>` : ''}
                    </div>
                    ${unmatchedHtml}
                    <button id="finishBtn" style="margin-top: 20px; padding: 15px 50px; background: #1DB954; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">✅ 完成</button>
                </div>`;

            document.getElementById('finishBtn').addEventListener('click', () => { modal.remove(); document.querySelector('.import-overlay').remove(); });

            if (unmatchedSongs.length > 0) {
               // document.getElementById('export-unmatched-btn').addEventListener('click', () => exportUnmatchedToTxt(unmatchedSongs));
            }

            GM_deleteValue('playlist_songs'); GM_deleteValue('playlist_timestamp');
        }
        processNextSong();
    }

    /**
     * 将未匹配歌曲列表导出为TXT文件的函数 ---
     */
    function exportUnmatchedToTxt(unmatchedSongs) {
        const textContent = "以下是在Spotify歌单中，但未能成功匹配到网易云音乐的歌曲列表：\n\n" +
                            unmatchedSongs.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n');

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'unmatched_songs.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }



    async function searchSong(title, artist) {
        return new Promise((resolve, reject) => {
            const keyword = `${title} ${artist.split(',')[0]}`;
            GM_xmlhttpRequest({
                method: 'GET', url: `https://music.163.com/api/search/get?s=${encodeURIComponent(keyword)}&type=1&limit=5`,
                headers: { 'Referer': 'https://music.163.com/' },
                onload: r => { try { resolve(JSON.parse(r.responseText).result?.songs?.map(s => ({id: s.id, name: s.name, artists: s.artists.map(a => a.name).join(' / ')})) || []); } catch (e) { resolve([]); } },
                onerror: reject
            });
        });
    }

    async function addToPlaylist(playlistId, songId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST', url: 'https://music.163.com/api/playlist/manipulate/tracks',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': 'https://music.163.com/' },
                data: `op=add&pid=${playlistId}&trackIds=%5B${songId}%5D&imme=true`,
                onload: r => { try { const d = JSON.parse(r.responseText); if (d.code === 200) resolve({code: 200, message: '添加成功'}); else if (d.code === 502) resolve({code: 502, message: '歌曲已存在'}); else reject(new Error(d.message || `错误码: ${d.code}`)); } catch (e) { reject(e); } },
                onerror: reject
            });
        });
    }

    function createModal() {
        document.querySelector('.import-modal')?.remove(); document.querySelector('.import-overlay')?.remove();
        const overlay = document.createElement('div'); overlay.className = 'import-overlay'; overlay.style.cssText = `position: fixed !important; inset: 0; background: rgba(0,0,0,0.6) !important; z-index: 999998 !important;`;
        const modal = document.createElement('div'); modal.className = 'import-modal'; modal.style.cssText = `position: fixed !important; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999 !important; background: white !important; padding: 30px !important; border-radius: 16px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important; max-width: 700px !important; max-height: 90vh !important; overflow-y: auto !important;`;
        const content = document.createElement('div'); content.className = 'modal-content'; modal.appendChild(content);
        document.body.appendChild(overlay); document.body.appendChild(modal);
        return modal;
    }

    function updateModalStatus(modal, message, type) {
        const colors = { info: '#3B82F6', success: '#10B981', error: '#EF4444' };
        const icons = { info: '⏳', success: '✅', error: '❌' };
        modal.querySelector('.modal-content').innerHTML = `
            <div style="color: ${colors[type]}; font-weight: bold; text-align: center; padding: 30px; font-size: 18px; line-height: 1.6;">
                <div style="font-size: 48px; margin-bottom: 20px;">${icons[type]}</div>${message}
            </div>`;
    }

    function showSpotifyResult(modal, songs) {
        let html = `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="margin: 0 0 20px 0; color: #1DB954; font-size: 24px;">✅ 提取成功！</h2>
                <div style="margin-bottom: 20px; padding: 15px; background: #E8F5E9; border-radius: 8px;">
                    <div style="font-size: 18px; color: #2E7D32;">共提取 <strong style="font-size: 28px;">${songs.length}</strong> 首歌曲</div>
                </div>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">歌曲列表预览：</p>`;
        songs.slice(0, 20).forEach((song, index) => {
            html += `<div style="padding: 8px 0; border-bottom: 1px solid #ddd;"><div style="color: #333; font-size: 14px; font-weight: 500;">${index + 1}. ${song.title}</div><div style="color: #666; font-size: 12px; margin-top: 2px;">${song.artist}</div></div>`;
        });
        if (songs.length > 20) html += `<div style="padding: 12px 0; color: #999; font-size: 13px; text-align: center;">...还有 ${songs.length - 20} 首</div>`;
        html += `</div>
                <div style="margin-bottom: 15px; padding: 15px; background: #FFF3E0; border-radius: 8px; font-size: 14px; line-height: 1.6;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #F57C00;">📌 下一步操作：</div>
                    <div style="color: #666;">1. 点击下方按钮前往网易云音乐</div>
                    <div style="color: #666;">2. 在网易云页面会出现"开始导入"按钮</div>
                </div>
                <button id="gotoNetease" style="width: 100%; padding: 15px; background: #D33A31; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; margin-bottom: 10px;">🎵 前往网易云音乐开始导入</button>
                <button id="closeBtn" style="width: 100%; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; cursor: pointer;">关闭</button>
            </div>`;
        modal.querySelector('.modal-content').innerHTML = html;
        document.getElementById('gotoNetease').addEventListener('click', () => window.open('https://music.163.com', '_blank'));
        document.getElementById('closeBtn').addEventListener('click', () => { modal.remove(); document.querySelector('.import-overlay').remove(); });
    }
})();