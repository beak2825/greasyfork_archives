// ==UserScript==
// @name         XChina Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在頁面底部自動添加所有圖片，並支持下載功能
// @license MIT
// @author       scbmark
// @match        https://tw.xchina.co/photo/id-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553716/XChina%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553716/XChina%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findServer() {
        const photos = document.getElementsByClassName("photos")[0];
        const firstPhoto = photos.getElementsByTagName("a")[0];
        const firstPhotoHref = firstPhoto.href;
        const severMatch = firstPhotoHref.match(/server=(\d)/);
        console.log(severMatch[1]);

        if (severMatch[1] == "1") {
            return "";
        }
        else {
            return severMatch[1]
        }

    }

    // 圖片下載功能
    function downloadImage(canvas, filename) {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("轉換 Canvas 失敗");
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, "image/png");
    }

    // 將網絡圖片轉換為 Canvas 並下載
    function downloadImageFromUrl(imageUrl, filename) {
        // 創建一個臨時圖片對象來加載圖片
        const img = new Image();
        img.crossOrigin = "anonymous";  // 嘗試解決跨域問題

        img.onload = function () {
            // 創建 Canvas 並繪製圖片
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // 使用提供的函數下載
            downloadImage(canvas, filename);
        };

        img.onerror = function () {
            alert(`圖片 ${filename} 無法下載，可能是跨域限制。嘗試直接下載...`);
            // 備用方案：直接嘗試創建一個鏈接進行下載
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = filename;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // 加載圖片
        img.src = imageUrl;
    }

    // 下載整個圖集
    function downloadGallery(photoId, totalImages) {
        if (totalImages > 100) {
            if (!confirm(`即將下載 ${totalImages} 張圖片，數量較多，確定要繼續嗎？`)) {
                return;
            }
        }

        // 創建下載進度條
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1002;
            text-align: center;
        `;

        const progressText = document.createElement('div');
        progressText.textContent = '準備下載...';

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 10px;
            background-color: #444;
            margin-top: 10px;
            border-radius: 5px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background-color: #2ecc71;
            transition: width 0.3s;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消下載';
        cancelButton.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #e74c3c;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(cancelButton);
        document.body.appendChild(progressContainer);

        // 用於跟踪下載狀態
        let isCancelled = false;
        let completedCount = 0;

        cancelButton.addEventListener('click', function () {
            isCancelled = true;
            document.body.removeChild(progressContainer);
        });

        // 批量下載，使用延遲以避免同時發送太多請求
        const downloadNextImage = (index) => {
            if (isCancelled || index > totalImages) {
                if (!isCancelled) {
                    progressText.textContent = '下載完成！';
                    setTimeout(() => {
                        document.body.removeChild(progressContainer);
                    }, 2000);
                }
                return;
            }

            const imageNumber = index.toString().padStart(4, '0');
            const serverNumber = findServer();
            const imageUrl = `https://img.xchina.store/photos${serverNumber}/${photoId}/${imageNumber}.jpg`;
            const filename = `${photoId}_${imageNumber}.png`;

            progressText.textContent = `下載中: ${index} / ${totalImages}`;
            progressFill.style.width = `${(index / totalImages) * 100}%`;

            downloadImageFromUrl(imageUrl, filename);

            completedCount++;

            // 延遲下載下一張圖片
            setTimeout(() => {
                downloadNextImage(index + 1);
            }, 300);  // 300ms 延遲，可根據需要調整
        };

        // 開始下載第一張圖片
        downloadNextImage(1);
    }

    // 主函數
    function main() {
        // 創建一個按鈕並添加到頁面
        createButton();
    }

    // 創建按鈕
    function createButton() {
        // 創建按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;

        // 顯示圖集按鈕
        const showButton = document.createElement('button');
        showButton.textContent = '顯示完整圖集';
        showButton.id = 'show-gallery-button';
        showButton.style.cssText = `
            padding: 10px 20px;
            background-color: #ff6b81;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 下載圖集按鈕
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下載所有圖片';
        downloadButton.id = 'download-gallery-button';
        downloadButton.style.cssText = `
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 懸停效果
        const addHoverEffect = (button, originalColor, hoverColor) => {
            button.addEventListener('mouseover', function () {
                this.style.backgroundColor = hoverColor;
                this.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseout', function () {
                this.style.backgroundColor = originalColor;
                this.style.transform = 'scale(1)';
            });
        };

        addHoverEffect(showButton, '#ff6b81', '#ff4757');
        addHoverEffect(downloadButton, '#3498db', '#2980b9');

        // 點擊事件 - 生成圖集
        showButton.addEventListener('click', function () {
            // 檢查圖集是否已存在
            if (document.getElementById('custom-gallery')) {
                alert('圖集已存在！');
                return;
            }

            // 執行圖集生成
            loadGallery();

            // 顯示提示訊息
            const message = document.createElement('div');
            message.textContent = '圖集載入中，請稍候...';
            message.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 5px;
                z-index: 1001;
            `;
            document.body.appendChild(message);

            // 3秒後移除提示訊息
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        });

        // 點擊事件 - 下載圖集
        downloadButton.addEventListener('click', function () {
            // 獲取頁面 URL 和圖片數量
            const currentUrl = window.location.href;
            const idMatch = currentUrl.match(/id-([^.]+)\.html/);

            if (!idMatch || idMatch.length < 2) {
                alert('無法解析頁面 ID');
                return;
            }
            const photoId = idMatch[1];

            const imageNumId = document.getElementById("tab_1");
            const pCount = imageNumId.getElementsByClassName("fa fa-picture-o")[0].parentElement.textContent;
            const pCountMatch = pCount.match(/(\d+)P/);

            if (!pCountMatch || pCountMatch.length < 2) {
                alert('無法確定圖片數量');
                return;
            }
            const totalImages = parseInt(pCountMatch[1], 10);

            // 執行下載
            downloadGallery(photoId, totalImages);
        });

        // 添加按鈕到容器
        buttonContainer.appendChild(showButton);
        buttonContainer.appendChild(downloadButton);

        // 添加按鈕容器到頁面
        document.body.appendChild(buttonContainer);
    }

    // 加載圖集
    function loadGallery() {
        // 1. 獲取當前頁面 URL
        const currentUrl = window.location.href;

        // 2. 解析出 id 部分
        const idMatch = currentUrl.match(/id-([^.]+)\.html/);
        if (!idMatch || idMatch.length < 2) {
            alert('無法解析頁面 ID');
            return;
        }
        const photoId = idMatch[1];

        // 3. 查找頁面中包含「數字+p」的文字以確定圖片總數
        const imageNumId = document.getElementById("tab_1");
        const pCount = imageNumId.getElementsByClassName("fa fa-picture-o")[0].parentElement.textContent;
        console.log(pCount)
        const pCountMatch = pCount.match(/(\d+)P/);
        if (!pCountMatch || pCountMatch.length < 2) {
            alert('無法確定圖片數量');
            return;
        }
        const totalImages = parseInt(pCountMatch[1], 10);

        // 4. 創建圖集容器
        createGallery(photoId, totalImages);

        // 5. 滾動到圖集
        document.getElementById('custom-gallery').scrollIntoView({ behavior: 'smooth' });
    }

    // 創建圖集並添加到頁面
    function createGallery(photoId, totalImages) {
        // 創建圖集容器
        const galleryContainer = document.createElement('div');
        galleryContainer.id = 'custom-gallery';
        galleryContainer.style.cssText = `
            width: 100%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        `;

        // 添加標題
        const galleryTitle = document.createElement('h2');
        galleryTitle.textContent = '完整圖集';
        galleryTitle.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        `;
        galleryContainer.appendChild(galleryTitle);

        // 添加圖片計數資訊
        const countInfo = document.createElement('p');
        countInfo.textContent = `共 ${totalImages} 張圖片`;
        countInfo.style.textAlign = 'center';
        galleryContainer.appendChild(countInfo);

        // 創建圖片網格容器
        const imageGrid = document.createElement('div');
        imageGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        `;

        // 生成並添加所有圖片
        for (let i = 1; i <= totalImages; i++) {
            const imageNumber = i.toString().padStart(4, '0');
            const serverNumber = findServer();
            const imageUrl = `https://img.xchina.store/photos${serverNumber}/${photoId}/${imageNumber}.jpg`;

            // 創建圖片容器
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                position: relative;
                overflow: hidden;
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                aspect-ratio: 3/4;
            `;

            // 創建圖片元素
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
                cursor: pointer;
            `;

            // 添加圖片編號
            const numberLabel = document.createElement('div');
            numberLabel.textContent = i;
            numberLabel.style.cssText = `
                position: absolute;
                bottom: 5px;
                right: 5px;
                background-color: rgba(0, 0, 0, 0.6);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 12px;
            `;

            // 添加點擊事件 - 放大圖片
            img.addEventListener('click', function () {
                openFullImage(imageUrl, i, totalImages, photoId);
            });

            // 將元素添加到容器
            imageContainer.appendChild(img);
            imageContainer.appendChild(numberLabel);
            imageGrid.appendChild(imageContainer);
        }

        galleryContainer.appendChild(imageGrid);

        // 將整個圖集添加到頁面底部
        document.body.appendChild(galleryContainer);
    }

    // 打開全屏查看圖片
    function openFullImage(imageUrl, currentIndex, totalImages, photoId) {
        // 創建遮罩層
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        // 創建圖片容器
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            max-width: 90%;
            max-height: 80%;
            position: relative;
        `;

        // 創建圖片
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
        `;

        // 創建關閉按鈕
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '關閉';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(overlay);
        });

        // 創建導航按鈕
        const navContainer = document.createElement('div');
        navContainer.style.cssText = `
            display: flex;
            gap: 20px;
            margin-top: 20px;
        `;

        // 上一張按鈕
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '上一張';
        prevBtn.style.cssText = `
            padding: 10px 20px;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        prevBtn.addEventListener('click', function () {
            if (currentIndex > 1) {
                const prevIndex = currentIndex - 1;
                const imageNumber = prevIndex.toString().padStart(4, '0');
                const serverNumber = findServer();
                const newImageUrl = `https://img.xchina.store/photos${serverNumber}/${photoId}/${imageNumber}.jpg`;
                img.src = newImageUrl;
                currentIndex = prevIndex;
                counter.textContent = `${currentIndex} / ${totalImages}`;
            }
        });

        // 下一張按鈕
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '下一張';
        nextBtn.style.cssText = `
            padding: 10px 20px;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        nextBtn.addEventListener('click', function () {
            if (currentIndex < totalImages) {
                const nextIndex = currentIndex + 1;
                const imageNumber = nextIndex.toString().padStart(4, '0');
                const serverNumber = findServer();
                const newImageUrl = `https://img.xchina.store/photos${serverNumber}/${photoId}/${imageNumber}.jpg`;
                img.src = newImageUrl;
                currentIndex = nextIndex;
                counter.textContent = `${currentIndex} / ${totalImages}`;
            }
        });

        // 添加計數器
        const counter = document.createElement('div');
        counter.textContent = `${currentIndex} / ${totalImages}`;
        counter.style.cssText = `
            color: white;
            font-size: 16px;
            margin: 0 15px;
            display: flex;
            align-items: center;
        `;

        // 添加按鍵監聽，支持鍵盤導航
        document.addEventListener('keydown', function (e) {
            if (!document.body.contains(overlay)) return;

            if (e.key === 'ArrowLeft' || e.key === 'a') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        });

        // 組裝元素
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(counter);
        navContainer.appendChild(nextBtn);

        overlay.appendChild(closeBtn);
        overlay.appendChild(img);
        overlay.appendChild(navContainer);

        document.body.appendChild(overlay);
    }

    // 等待頁面完全加載後執行主函數
    window.addEventListener('load', main);
})();