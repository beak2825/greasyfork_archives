// ==UserScript==
// @name         摸鱼神器网页版(Thief-Book in Browser)增加隐蔽选项
// @namespace    No Space
// @version      1.4.8
// @description  浏览器隐蔽阅读神器，仅支持TXT。F4唤醒/隐藏，具备自动滚屏、书签、隐形模式等功能。
// @author       CyberLazyBoy----elizabeth62dxbolf3o3ym5t@gmail.com
// @license      MIT
// @match        http*://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561705/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%28Thief-Book%20in%20Browser%29%E5%A2%9E%E5%8A%A0%E9%9A%90%E8%94%BD%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/561705/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88%28Thief-Book%20in%20Browser%29%E5%A2%9E%E5%8A%A0%E9%9A%90%E8%94%BD%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        let text = '请打开文件 (仅支持 .txt)\nF4:唤醒/隐藏 | 鼠标移至左下角:设置';
        let lines = [];
        let lineLength = 20;
        let pointer = 0;
        let keyNextLine = 'Period';
        let keyPreLine = 'Comma';
        let keyHide = 'F4';
        let keyTimer = 'Enter';

        // --- 核心设置 ---
        let hide = true; // 默认隐藏
        let showMouseShortcuts = false; // 默认关闭悬浮窗
        // ---------------

        let progress = 0;
        let timer = null;
        let timerInterval = 3000;
        let bookmode = false;
        let fileCoder = GM_getValue("thief-book-encoder","utf-8");
        let currentBookName = "";
        let allBookmarks = GM_getValue("thief-book-manual-bookmarks", {});
        let opacityVal = parseFloat(GM_getValue("thief-book-opacity", 0.5));
        let customColor = GM_getValue("thief-book-custom-color", "#555555");
        let fontSizeVal = parseInt(GM_getValue("thief-book-font-size-val", 11));

        var newStyle = document.createElement("style");
        newStyle.innerHTML =
            '        :root {' +
            '            --thief-book-font-size: ' + fontSizeVal + 'px;' +
            '            --thief-book-font-color: ' + customColor + ';' +
            '            --thief-book-bg-color: transparent;' +
            '            --thief-book-font-family: Arial, "Microsoft YaHei", sans-serif;' +
            '        }' +
            '        .thief-book-line-box {' +
            '            position: fixed;' +
            '            left: 2px;' +
            '            bottom: 0px;' +
            '            z-index: 99998;' +
            '            pointer-events: none;' +
            '        }' +
            '        .thief-book-line {' +
            '            font-size: var(--thief-book-font-size);' +
            '            color: var(--thief-book-font-color);' +
            '            font-family: var(--thief-book-font-family);' +
            '            text-align:left;' +
            '            background-color: var(--thief-book-bg-color);' +
            '            height: 20px;' +
            '            line-height: 20px;' +
            '            padding-left: 5px;' +
            '            white-space: pre;' +
            '            transition: opacity 0.2s;' +
            '        }' +
            '        .thief-book-mouse-area {' +
            '            position: fixed;' +
            '            left: 0;' +
            '            bottom: 0;' +
            '            z-index: 99999;' +
            '            height: 40px;' +
            '            width: 300px;' +
            '        }' +
            '        .thief-book-mouse-area:hover .thief-book-settings-area {' +
            '            opacity: 1 !important;' +
            '            pointer-events: auto;' +
            '        }' +
            '        .thief-book-settings-area {' +
            '            position: fixed;' +
            '            left: 10px;' +
            '            bottom: 30px;' +
            '            display: flex;' +
            '            flex-wrap: wrap;' +
            '            width: 340px;' +
            '            transition: 0.3s;' +
            '            background: rgba(240,240,240,0.95);' +
            '            padding: 8px;' +
            '            border-radius: 4px;' +
            '            box-shadow: 0 2px 8px rgba(0,0,0,0.15);' +
            '            opacity: 0;' +
            '            pointer-events: none;' +
            '            border: 1px solid #ccc;' +
            '        }' +
            '        .thief-book-icon {' +
            '            cursor: pointer;' +
            '            font-size: 16px; width:24px; height:24px;' +
            '            text-align: center; line-height: 24px;' +
            '            margin: 2px;' +
            '        }' +
            '        .thief-book-icon:hover {' +
            '            background-color: #ccc;' +
            '            border-radius: 2px;' +
            '        }' +
            '        .thief-book-slider {' +
            '            height: 10px;' +
            '            width: 60px;' +
            '            margin: 8px 5px;' +
            '        }' +
            '        #thief-book-colorPicker {' +
            '            width: 20px; height: 20px;' +
            '            border: 1px solid #999;' +
            '            padding: 0;' +
            '            margin: 4px;' +
            '            cursor: pointer;' +
            '            background: none;' +
            '        }' +
            '        #thief-book-bookmark-panel {' +
            '            display: none;' +
            '            position: absolute;' +
            '            bottom: 70px; left: 10px;' +
            '            width: 250px; max-height: 300px;' +
            '            background: #fff; border: 1px solid #999;' +
            '            overflow-y: auto; z-index: 100000;' +
            '            box-shadow: 0 2px 10px rgba(0,0,0,0.2);' +
            '            font-size: 12px;' +
            '        }' +
            '        .thief-book-bm-item {' +
            '            padding: 5px; border-bottom: 1px solid #eee;' +
            '            cursor: pointer; display: flex; justify-content: space-between;' +
            '        }' +
            '        .thief-book-bm-item:hover { background: #f0f0f0; }' +
            '        .thief-book-bm-del { color: red; margin-left: 5px; font-weight: bold; }' +
            '        #thief-book-searchbox{' +
            '            border: 1px solid #666;' +
            '            display: none;' +
            '            width: 300px;' +
            '            height: 120px;' +
            '            position: absolute;' +
            '            margin:auto;' +
            '            top: 0px;left: 0px;bottom: 0px;right: 0px;' +
            '            background-color: #fff;' +
            '            font-size: 13px;' +
            '            z-index: 99999;' +
            '            box-shadow: 0 0 10px rgba(0,0,0,0.2);' +
            '        }' +
            '        #thief-book-searchbox-title{' +
            '            width: 100%; height: 24px; line-height: 24px;' +
            '            background-color: #f0f0f0; color: #333;' +
            '            text-align: center; font-weight: bold;' +
            '        }' +
            '        .thief-book-search-lines{' +
            '            margin:8px; display: flex; justify-content: space-between;' +
            '        }' +
            '        .thief-book-search-buttons{' +
            '            border: 1px solid #ccc; height:20px; line-height:20px;' +
            '            width: 70px; background-color: #f9f9f9;' +
            '            text-align: center; font-size: 12px; cursor: pointer;' +
            '        }' +
            '        #thief-book-mouseShortcuts{' +
            '            position: absolute;' +
            '            border: 1px solid #ddd;' +
            '            top: 500px;' +
            '            left: 10px;' +
            '            height:20px;' +
            '            width:100px;' +
            '            display: flex;' +
            '            justify-content: space-between;' +
            '            margin: auto;' +
            '            z-index:99999;' +
            '            background: #fff;' +
            '            box-shadow: 0 1px 3px rgba(0,0,0,0.1);' +
            '        }' +
            '        .thief-book-floatIcon{' +
            '            width:25%; text-align: center; cursor: pointer; font-size: 12px; line-height: 20px;' +
            '        }';
        document.head.appendChild(newStyle);

        var newDiv = document.createElement("div");
        newDiv.id = "thief-book-div";
        newDiv.innerHTML =
            '<div id="thief-book-leftCorner" class="thief-book-mouse-area">\n' +
            '    <div id="thief-book-settings" class="thief-book-settings-area">\n' +
            '        <div style="display:flex; align-items:center; width:100%; margin-bottom:5px; border-bottom:1px solid #eee;">' +
            '           <span style="font-size:10px; color:#999; margin-right:5px;">设置</span>' +
            '           <div id="thief-book-currentcoder" style="font-size:10px; margin-right:5px;">utf-8</div>' +
            '           <div id="thief-book-changecoder" title="点击切换编码">转码</div>' +
            '        </div>\n' +
            '        <label class="thief-book-icon" title="打开小说 (.txt)">📂\n' +
            '            <input type="file" id="thief-book-selectFile" accept=".txt" style="display:none">\n' +
            '        </label>\n' +
            '        <label title="进度">\n' +
            '            <input id="thief-book-progressSlider" class="thief-book-slider" style="width:80px" type="range" min="0" max="2" value="0">\n' +
            '        </label>\n' +
            '        <label title="自定义颜色">\n' +
            '            <input type="color" id="thief-book-colorPicker" value="'+ customColor +'">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <input id="thief-book-opacitySlider" class="thief-book-slider" type="range" min="0.05" max="1" step="0.05" title="透明度" value="'+ opacityVal +'">\n' +
            '        </label>\n' +
            '        <label>\n' +
            '            <input id="thief-book-lineLengthSlider" class="thief-book-slider" type="range" min="5" max="150" title="行宽" value="20" style="width:40px">\n' +
            '        </label>\n' +
            '        <div id="thief-book-timer" class="thief-book-icon" title="自动滚屏">⏱️</div>' +
            '        <div id="thief-book-search" class="thief-book-icon" title="搜索">🔍</div>' +
            '        <div id="thief-book-bookmark" class="thief-book-icon" title="书签管理 (左键查看，右键添加)">🔖</div>' +
            '        <div id="thief-book-increaseFontsize" class="thief-book-icon" title="字体+">A+</div>' +
            '        <div id="thief-book-decreaseFontsize" class="thief-book-icon" title="字体-">A-</div>' +
            '        <div id="thief-book-showMouseShortcuts" class="thief-book-icon" title="开关悬浮窗">🎮</div>' +
            '    </div>\n' +
            '    <div id="thief-book-lineBox" class="thief-book-line-box"></div>\n' +
            '</div>\n' +
            '<div id="thief-book-bookmark-panel"></div>\n' +
            '<div id="thief-book-searchbox">\n' +
            '   <div id="thief-book-searchbox-title">查找内容</div>\n' +
            '   <div class="thief-book-search-lines">\n' +
            '       <input type="text" id="thief-book-search-text" style="width:100%">\n' +
            '   </div>\n' +
            '   <div class="thief-book-search-lines">\n' +
            '       <div id="thief-book-search-prev" class="thief-book-search-buttons">上一个</div>\n' +
            '       <div id="thief-book-search-next" class="thief-book-search-buttons">下一个</div>\n' +
            '       <div id="thief-book-search-close" class="thief-book-search-buttons">关闭</div>\n' +
            '   </div>\n' +
            '</div>' +
            '<div id="thief-book-mouseShortcuts">\
                <div style="display: flex;">\
                    <div id="thief-book-onoffDiv" class="thief-book-floatIcon">❌</div>\
                    <div id="thief-book-prelineDiv" class="thief-book-floatIcon">⬅️</div>\
                    <div id="thief-book-nextlineDiv" class="thief-book-floatIcon">➡️</div>\
                    <div id="thief-book-timerOnoffDiv" class="thief-book-floatIcon">⏱️</div>\
            </div></div>';
        document.body.appendChild(newDiv);

        document.getElementById('thief-book-currentcoder').innerText = fileCoder;
        applyOpacity(opacityVal);
        parseText(false);

        let savedLeft = GM_getValue("thief-book-mouseshortcuts-left", "10px");
        let savedTop = GM_getValue("thief-book-mouseshortcuts-top", "500px");
        let mouseShortcutEl = document.getElementById('thief-book-mouseShortcuts');
        mouseShortcutEl.style.left = savedLeft;
        mouseShortcutEl.style.top = savedTop;

        document.getElementById('thief-book-colorPicker').addEventListener('input', function(){
            customColor = this.value;
            document.documentElement.style.setProperty("--thief-book-font-color", customColor);
            GM_setValue("thief-book-custom-color", customColor);
        });
        document.getElementById('thief-book-opacitySlider').addEventListener('input', function(){
            opacityVal = this.value;
            this.title = "透明度【" + opacityVal + "】";
            applyOpacity(opacityVal);
            GM_setValue("thief-book-opacity", opacityVal);
        });

        document.getElementById('thief-book-selectFile').addEventListener('change', function(){ initBook(); })

        document.getElementById('thief-book-progressSlider').addEventListener('input', function(){
            if(!bookmode) return;
            pointer = parseInt(this.value);
            if(lines.length > 1) {
                progress = pointer / (lines.length - 1);
            }
            printLine(true);
            saveProgress();
        })
        document.getElementById('thief-book-progressSlider').addEventListener('mousedown', function(){
            if(!bookmode) return;
            pointer = parseInt(this.value);
            printLine(true);
        })

        document.getElementById('thief-book-lineLengthSlider').addEventListener('input', function(){
            lineLength = parseInt(this.value);
            this.title = "行宽【" + lineLength + "】";
            if(bookmode)GM_setValue("thief-book-linelength", lineLength);
            parseText(true);
        })
        document.getElementById('thief-book-progressSlider').addEventListener('mouseup', function(){
            if(!bookmode) return;
            pointer = parseInt(this.value);
            if(lines.length > 1) {
                progress = pointer / (lines.length - 1);
            }
            printLine();
            saveProgress();
        })
        document.getElementById('thief-book-timer').addEventListener('click', function(){
            if(timer){clearTimer();} else{startTimer();}
        })

        document.getElementById('thief-book-bookmark').addEventListener('click', function(e){
            toggleBookmarkPanel();
            e.preventDefault();
        });
        document.getElementById('thief-book-bookmark').addEventListener('contextmenu', function(e){
            e.preventDefault();
            addBookmark();
        });

        function toggleBookmarkPanel() {
            let panel = document.getElementById('thief-book-bookmark-panel');
            if(panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                renderBookmarks();
                panel.style.display = 'block';
            }
        }

        function addBookmark() {
            if(!bookmode || !currentBookName) { alert("请先打开一本书"); return; }
            let bms = allBookmarks[currentBookName] || [];
            let preview = lines[pointer] ? lines[pointer].substring(0, 20) : "Empty";
            bms.push({
                pos: pointer,
                text: preview + "...",
                time: new Date().toLocaleTimeString()
            });
            allBookmarks[currentBookName] = bms;
            GM_setValue("thief-book-manual-bookmarks", allBookmarks);
            alert("书签已添加: " + preview);
        }

        function removeBookmark(index) {
            if(!bookmode) return;
            let bms = allBookmarks[currentBookName];
            if(bms) {
                bms.splice(index, 1);
                allBookmarks[currentBookName] = bms;
                GM_setValue("thief-book-manual-bookmarks", allBookmarks);
                renderBookmarks();
            }
        }

        function renderBookmarks() {
            let panel = document.getElementById('thief-book-bookmark-panel');
            panel.innerHTML = '<div style="padding:5px; background:#eee; font-weight:bold; border-bottom:1px solid #ccc">书签列表 (点击跳转)</div>';

            let bms = allBookmarks[currentBookName];
            if(!bms || bms.length === 0) {
                panel.innerHTML += '<div style="padding:10px; color:#666;">暂无书签，请右键点击书签图标添加。</div>';
                return;
            }

            bms.forEach((bm, index) => {
                let div = document.createElement('div');
                div.className = 'thief-book-bm-item';
                div.innerHTML = `<span>[${bm.time}] ${bm.text}</span> <span class="thief-book-bm-del">×</span>`;
                div.addEventListener('click', function(e) {
                    if(e.target.className !== 'thief-book-bm-del') {
                        gotoLine(bm.pos);
                        panel.style.display = 'none';
                    }
                });
                div.querySelector('.thief-book-bm-del').addEventListener('click', function() {
                    removeBookmark(index);
                });
                panel.appendChild(div);
            });
        }

        document.getElementById('thief-book-search').addEventListener('click', function(){
            document.getElementById('thief-book-searchbox').style.display = "block";
            setTimeout(()=>document.getElementById('thief-book-search-text').focus(), 100);
        })
        document.getElementById('thief-book-search-next').addEventListener('click', function(){
            t_search(document.getElementById('thief-book-search-text').value, "next", pointer);
        })
        document.getElementById('thief-book-search-prev').addEventListener('click', function(){
            t_search(document.getElementById('thief-book-search-text').value, "prev", pointer);
        })
        document.getElementById('thief-book-search-close').addEventListener('click', function(){
            document.getElementById('thief-book-searchbox').style.display = "none";
            saveProgress();
        })
        document.getElementById('thief-book-changecoder').addEventListener('click', function(){ tryFileCoder(); })
        document.getElementById('thief-book-showMouseShortcuts').addEventListener('click', function(){
            showMouseShortcuts = !showMouseShortcuts;
            printLine();
        })
        document.getElementById('thief-book-increaseFontsize').addEventListener('click', function(){
            fontSizeVal++;
            document.documentElement.style.setProperty("--thief-book-font-size", `${fontSizeVal}px`);
            GM_setValue("thief-book-font-size-val", fontSizeVal);
        })
        document.getElementById('thief-book-decreaseFontsize').addEventListener('click', function(){
            fontSizeVal--;
            document.documentElement.style.setProperty("--thief-book-font-size", `${fontSizeVal}px`);
            GM_setValue("thief-book-font-size-val", fontSizeVal);
        })
        mouseShortcutEl.addEventListener('mousedown', function(event){
            let xbox = event.clientX - mouseShortcutEl.offsetLeft;
            let ybox = event.clientY - mouseShortcutEl.offsetTop;
            function divOndrag(eve){
                let x = eve.clientX;
                let y = eve.clientY;
                mouseShortcutEl.style.left = (x - xbox) + "px";
                mouseShortcutEl.style.top = (y - ybox) + "px";
            };
            document.addEventListener('mousemove', divOndrag);
            document.addEventListener('mouseup', function(){
                document.removeEventListener("mousemove",divOndrag);
                GM_setValue("thief-book-mouseshortcuts-left", mouseShortcutEl.style.left);
                GM_setValue("thief-book-mouseshortcuts-top", mouseShortcutEl.style.top);
            });
        })
        mouseShortcutEl.addEventListener('wheel', function(event) {
            if(event.deltaY > 0){ if(!hide)nextLine(); }
            if(event.deltaY < 0){ if(!hide)preLine(); }
            event.stopPropagation(); event.preventDefault();
        })
        document.getElementById('thief-book-onoffDiv').addEventListener('click', function(){ onOff(); })
        document.getElementById('thief-book-prelineDiv').addEventListener('click', function(){ if(!hide)preLine(); })
        document.getElementById('thief-book-nextlineDiv').addEventListener('click', function(){ if(!hide)nextLine(); })
        document.getElementById('thief-book-timerOnoffDiv').addEventListener('click', function(){
            let clickEvent = new Event('click');
            document.getElementById('thief-book-timer').dispatchEvent(clickEvent);
        })

        window.addEventListener('keydown', function(e) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.code === keyNextLine) { if(!hide)nextLine(); }
            else if (e.code === keyPreLine) { if(!hide)preLine(); }
            else if (e.code === keyHide) { onOff(); }
            else if (e.code === keyTimer) { if(!hide){ if(timer){clearTimer();} else{startTimer();} } }
        });

        function applyOpacity(val) {
            document.getElementById('thief-book-lineBox').style.opacity = val;
        }

        function initBook(){
            let oSelect = document.getElementById('thief-book-selectFile');
            let file = oSelect.files[0];
            if(!file) return;

            let old_bookname = GM_getValue("thief-book-bookname", "");
            currentBookName = file.name;
            let keepProgress = (old_bookname === file.name);

            if(!keepProgress) {
                GM_setValue("thief-book-bookname", file.name);
                GM_setValue("thief-book-progress", 0);
                progress = 0;
            } else {
                progress = parseFloat(GM_getValue("thief-book-progress", 0));
            }
            bookmode = true;
            document.getElementById('thief-book-settings').classList.add('thief-book-semi-hide');

            loadTxt(file, keepProgress);
        }

        function loadTxt(file, keepProgress) {
            let fr = new FileReader();
            fr.onload = function(){
                text = fr.result;
                parseText(keepProgress);
            }
            fr.readAsText(file, fileCoder);
        }

        function parseText(keepProgress) {
            lines = parseLines(text);
            if (lines.length === 0) lines = ["Empty File"];

            if (keepProgress) {
                pointer = Math.round(progress * (lines.length - 1));
            } else { pointer = 0; progress = 0; }
            
            if(pointer >= lines.length) pointer = lines.length - 1;

            let slider = document.getElementById('thief-book-progressSlider')
            slider.min = 0;
            slider.max = lines.length - 1;
            printLine();
        }

        function parseLines(text) {
            text = text.replace(/\r/g, "");
            let i = 0,j = 0, lines = [], tmpline = "";
            while (j < text.length) {
                if (j - i > lineLength || text[j] === '\n') {
                    tmpline = text.slice(i, j+1);
                    if(tmpline.length<=3){
                        if(lines.length > 0) {
                            lines[lines.length - 1] = lines[lines.length - 1] + tmpline;
                        } else { lines.push(tmpline); }
                    }else{ lines.push(tmpline); }
                    i = ++j; continue;
                }
                j++;
            }
            if (j > i) lines.push(text.slice(i, j));
            return lines;
        }

        function nextLine() {
            if (pointer < lines.length - 1) { 
                pointer++; 
                if(lines.length > 1) progress = pointer / (lines.length - 1);
            } else{ clearTimer(); }
            printLine(); saveProgress();
        }
        function preLine() {
            if (pointer > 0) { 
                pointer--; 
                if(lines.length > 1) progress = pointer / (lines.length - 1);
            }
            printLine(); saveProgress();
        }
        function onOff() {
            hide = !hide; printLine(); clearTimer();
        }
        function startTimer(){
            if(timer){clearInterval(timer)};
            timer = setInterval(nextLine, timerInterval);
            document.getElementById('thief-book-timer').innerHTML = "⏳";
        }
        function clearTimer(){
            if(timer){ clearInterval(timer); timer=null; }
            document.getElementById('thief-book-timer').innerHTML = "⏱️";
        }

        function printLine(multiLine) {
            let ui = [document.getElementById('thief-book-leftCorner'), document.getElementById('thief-book-mouseShortcuts')];
            if (hide) {
                ui.forEach(el => el.style.display = 'none');
                document.getElementById('thief-book-searchbox').style.display = "none";
                document.getElementById('thief-book-bookmark-panel').style.display = "none";
            } else {
                document.getElementById('thief-book-leftCorner').style.display = "block";
                document.getElementById('thief-book-mouseShortcuts').style.display = showMouseShortcuts ? 'block' : 'none';
            }

            document.getElementById('thief-book-lineBox').innerHTML = '';
            
            if(pointer >= lines.length) pointer = lines.length - 1;
            if(pointer < 0) pointer = 0;

            createLine(pointer);
            document.getElementById('thief-book-progressSlider').value = pointer;

            function createLine(i) {
                let newLine = document.createElement('div');
                newLine.classList.add('thief-book-line');
                
                let line = lines[i];
                if(typeof line === 'undefined') line = "Wait...";

                if (line.length < lineLength) line += '　'.repeat(lineLength - line.length);
                
                let currentPer = 0;
                if(lines.length > 1) {
                    currentPer = (pointer / (lines.length - 1)) * 100;
                }
                
                let progText = (pointer === lines.length - 1) ? 'End' : (currentPer.toFixed(1) + '%');
                newLine.innerText = progText + ' | ' + line;
                document.getElementById('thief-book-lineBox').append(newLine);
            }
        }

        function saveProgress(){
            if(!bookmode || lines.length <= 1) return;
            let iProgress = pointer / (lines.length - 1);
            if(iProgress >= 0 && iProgress <= 1) {
                progress = iProgress;
                GM_setValue("thief-book-progress", iProgress);
            }
        }

        function t_search(stext, direction, from){
            if(!stext) return;
            let start = (direction === 'next') ? from + 1 : from - 1;
            if(direction === 'next'){
                 for(let i=start; i<lines.length; i++){
                     if(lines[i].includes(stext)) { gotoLine(i); return; }
                 }
            } else {
                 for(let i=start; i>=0; i--){
                     if(lines[i].includes(stext)) { gotoLine(i); return; }
                 }
            }
            alert("无结果");
        }

        function gotoLine(intLine){ 
            pointer = intLine; 
            if(lines.length > 1) progress = pointer / (lines.length - 1);
            printLine(); 
            saveProgress();
        }

        function tryFileCoder(){
            let encodingList = ['utf-8','gb2312','gbk','big5'];
            let i = encodingList.indexOf(fileCoder) + 1;
            if(i>=encodingList.length) i=0;
            fileCoder = encodingList[i];
            GM_setValue("thief-book-encoder", fileCoder);
            document.getElementById('thief-book-currentcoder').innerText = fileCoder;
            initBook();
        }
    })();
})();