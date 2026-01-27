// ==UserScript==
// @name         SofaScore Image Tools
// @name:zh-TW   SofaScore 圖片工具
// @namespace    https://greasyfork.org/users/Roberto/sofascore-image-tools
// @version      3.7.1
// @description  Add copy/download buttons for team logos on SofaScore tournament/team pages (supports WebP via PNG conversion).
// @description:zh-TW  在 SofaScore 賽事/隊伍頁面的圖片旁添加複製與下載按鈕，並支援「下載全部 LOGO」（含 WebP 轉 PNG）。
// @author       Roberto
// @license      All Rights Reserved
// @match        https://www.sofascore.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sofascore.com
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564079/SofaScore%20Image%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/564079/SofaScore%20Image%20Tools.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 全域變數：標記是否正在下載
  let isDownloading = false;
  
  // 讀取開關狀態（預設為 true）
  let showImageButtons = localStorage.getItem('sofascore-show-image-buttons') !== 'false';

  // 添加樣式
  const style = document.createElement('style');
  style.textContent = `
      .img-tools-container {
          display: inline-flex;
          gap: 8px;
          margin-left: 10px;
          vertical-align: middle;
          position: relative;
          transition: opacity 0.3s ease;
      }
      
      .img-tools-container.hidden {
          display: none;
      }
      
      /* Knockout 專用小型按鈕容器 */
      .img-tools-container-small {
          display: inline-flex;
          gap: 4px;
          margin-left: 6px;
          vertical-align: middle;
          position: relative;
          transition: opacity 0.3s ease;
      }
      
      .img-tools-container-small.hidden {
          display: none;
      }
      
      /* 淺色模式按鈕樣式 */
      .img-tool-btn {
          width: 28px;
          height: 28px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          background: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #333333;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      /* Knockout 專用小型按鈕 */
      .img-tool-btn-small {
          width: 22px;
          height: 22px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #333333;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      .img-tool-btn:hover,
      .img-tool-btn-small:hover {
          background: #f8f9fa;
          border-color: rgba(0, 0, 0, 0.35);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .img-tool-btn:active,
      .img-tool-btn-small:active {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .img-tool-btn svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
      }
      
      .img-tool-btn-small svg {
          width: 13px;
          height: 13px;
          stroke: currentColor;
          stroke-width: 2.5;
      }
      
      /* 下載全部按鈕容器 - 固定在頂部 */
      .download-all-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          background: white;
          z-index: 100;
      }
      
      /* Knockout 專用小型下載全部按鈕容器 */
      .download-all-container-small {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          background: white;
          z-index: 100;
      }
      
      /* Switch 開關容器 */
      .switch-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #666666;
          user-select: none;
      }
      
      .switch-container-small {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #666666;
          user-select: none;
      }
      
      /* Switch 開關 */
      .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
      }
      
      .switch-small {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
      }
      
      .switch input,
      .switch-small input {
          opacity: 0;
          width: 0;
          height: 0;
      }
      
      .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .3s;
          border-radius: 24px;
      }
      
      .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      
      .switch-small .slider:before {
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
      }
      
      input:checked + .slider {
          background-color: #4caf50;
      }
      
      input:checked + .slider:before {
          transform: translateX(20px);
      }
      
      .switch-small input:checked + .slider:before {
          transform: translateX(16px);
      }
      
      .switch-label {
          font-weight: 500;
          white-space: nowrap;
      }
      
      /* 下載全部按鈕 */
      .download-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          color: #333333;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          font-weight: 500;
      }
      
      /* Knockout 專用小型下載全部按鈕 */
      .download-all-btn-small {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          color: #333333;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-size: 12px;
          font-weight: 500;
      }
      
      .download-all-btn:hover:not(:disabled),
      .download-all-btn-small:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: rgba(0, 0, 0, 0.35);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .download-all-btn:active:not(:disabled),
      .download-all-btn-small:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .download-all-btn:disabled,
      .download-all-btn-small:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
      }
      
      .download-all-btn svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          flex-shrink: 0;
      }
      
      .download-all-btn-small svg {
          width: 13px;
          height: 13px;
          stroke: currentColor;
          flex-shrink: 0;
      }
      
      .download-all-btn .btn-text,
      .download-all-btn-small .btn-text {
          white-space: nowrap;
      }
      
      /* 深色模式樣式 - 根據 html.dark 判斷 */
      html.dark .img-tool-btn,
      html.dark .img-tool-btn-small,
      html.dark .download-all-btn,
      html.dark .download-all-btn-small {
          background: #2d2d2d;
          border-color: rgba(255, 255, 255, 0.2);
          color: #e0e0e0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      
      html.dark .img-tool-btn:hover,
      html.dark .img-tool-btn-small:hover,
      html.dark .download-all-btn:hover:not(:disabled),
      html.dark .download-all-btn-small:hover:not(:disabled) {
          background: #3c3c3c;
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      }
      
      html.dark .download-all-container,
      html.dark .download-all-container-small {
          border-bottom-color: rgba(255, 255, 255, 0.08);
          background: #1a1a1a;
      }
      
      html.dark .switch-container,
      html.dark .switch-container-small {
          color: #b0b0b0;
      }
      
      html.dark .slider {
          background-color: #555;
      }
      
      html.dark input:checked + .slider {
          background-color: #66bb6a;
      }
      
      /* 淺色模式浮動提示訊息 */
      .copy-success-tip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 12px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 3px 12px rgba(76, 175, 80, 0.4);
          animation: tipFadeInOut 2s ease-in-out;
          pointer-events: none;
          z-index: 10000;
      }
      
      /* 小型提示訊息 */
      .copy-success-tip-small {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
          animation: tipFadeInOut 2s ease-in-out;
          pointer-events: none;
          z-index: 10000;
      }
      
      /* 提示訊息箭頭 */
      .copy-success-tip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #4caf50;
      }
      
      .copy-success-tip-small::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: #4caf50;
      }
      
      @keyframes tipFadeInOut {
          0% { 
              opacity: 0; 
              transform: translateY(-50%) translateX(-10px);
          }
          15% { 
              opacity: 1; 
              transform: translateY(-50%) translateX(0);
          }
          85% { 
              opacity: 1; 
              transform: translateY(-50%) translateX(0);
          }
          100% { 
              opacity: 0; 
              transform: translateY(-50%) translateX(10px);
          }
      }
      
      /* 深色模式下的提示訊息 */
      html.dark .copy-success-tip,
      html.dark .copy-success-tip-small {
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          box-shadow: 0 3px 12px rgba(102, 187, 106, 0.5);
      }
      
      html.dark .copy-success-tip::before,
      html.dark .copy-success-tip-small::before {
          border-right-color: #66bb6a;
      }
  `;
  document.head.appendChild(style);

  // Copy 圖示 SVG
  const copyIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
  `;

  // Download 圖示 SVG
  const downloadIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
  `;

  // 🔥 修正：通用圖片選擇器配置 - 使用更精確的選擇器
  const TAB_CONFIGS = {
      'total': {
          selector: '#tabpanel-total img[src*="img.sofascore.com/api/v1/team"]',
          buttonSize: 'normal',
          name: 'Total'
      },
      'standings': {
          selector: '#tabpanel-standings img[src*="img.sofascore.com/api/v1/team"]',
          buttonSize: 'normal',
          name: 'Standings'
      },
      'knockout': {
          selector: '#tabpanel-knockout img[src*="img.sofascore.com/api/v1/team"]',
          buttonSize: 'small',
          name: 'Knockout'
      }
  };

  // 🔥 新增：過濾可見且唯一的圖片
  function getUniqueVisibleImages(selector) {
      const images = document.querySelectorAll(selector);
      const uniqueImages = new Map(); // 使用 Map 來追蹤唯一的圖片（基於 src）
      const visibleImages = [];
      
      images.forEach(img => {
          // 檢查圖片是否可見
          const rect = img.getBoundingClientRect();
          const style = window.getComputedStyle(img);
          
          // 圖片必須：
          // 1. 有實際尺寸
          // 2. 不是 display: none
          // 3. 不是 visibility: hidden
          // 4. opacity 不為 0
          const isVisible = rect.width > 0 && 
                          rect.height > 0 && 
                          style.display !== 'none' && 
                          style.visibility !== 'hidden' && 
                          style.opacity !== '0';
          
          if (isVisible) {
              const src = img.src;
              // 只保留第一次出現的圖片（避免重複）
              if (!uniqueImages.has(src)) {
                  uniqueImages.set(src, img);
                  visibleImages.push(img);
              }
          }
      });
      
      return visibleImages;
  }

  // 簡化檔名：移除特殊字元和變音符號
  function sanitizeFilename(filename) {
      filename = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
      
      const charMap = {
          'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ā': 'a', 'ă': 'a', 'ą': 'a',
          'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ĕ': 'e', 'ė': 'e', 'ę': 'e', 'ě': 'e',
          'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ĩ': 'i', 'ī': 'i', 'ĭ': 'i', 'į': 'i',
          'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'ō': 'o', 'ŏ': 'o', 'ő': 'o',
          'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ũ': 'u', 'ū': 'u', 'ŭ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
          'ý': 'y', 'ÿ': 'y', 'ŷ': 'y',
          'ñ': 'n', 'ń': 'n', 'ņ': 'n', 'ň': 'n',
          'ç': 'c', 'ć': 'c', 'ĉ': 'c', 'ċ': 'c', 'č': 'c',
          'ś': 's', 'ŝ': 's', 'ş': 's', 'š': 's',
          'ž': 'z', 'ź': 'z', 'ż': 'z',
          'ď': 'd', 'đ': 'd',
          'ğ': 'g', 'ĝ': 'g', 'ġ': 'g', 'ģ': 'g',
          'ĥ': 'h', 'ħ': 'h',
          'ĵ': 'j',
          'ķ': 'k',
          'ĺ': 'l', 'ļ': 'l', 'ľ': 'l', 'ŀ': 'l', 'ł': 'l',
          'ŕ': 'r', 'ŗ': 'r', 'ř': 'r',
          'ţ': 't', 'ť': 't', 'ŧ': 't',
          'ŵ': 'w',
          'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Ā': 'A', 'Ă': 'A', 'Ą': 'A',
          'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ē': 'E', 'Ĕ': 'E', 'Ė': 'E', 'Ę': 'E', 'Ě': 'E',
          'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I', 'Ĩ': 'I', 'Ī': 'I', 'Ĭ': 'I', 'Į': 'I',
          'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ō': 'O', 'Ŏ': 'O', 'Ő': 'O',
          'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ũ': 'U', 'Ū': 'U', 'Ŭ': 'U', 'Ů': 'U', 'Ű': 'U', 'Ų': 'U',
          'Ý': 'Y', 'Ÿ': 'Y', 'Ŷ': 'Y',
          'Ñ': 'N', 'Ń': 'N', 'Ņ': 'N', 'Ň': 'N',
          'Ç': 'C', 'Ć': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Č': 'C',
          'Ś': 'S', 'Ŝ': 'S', 'Ş': 'S', 'Š': 'S',
          'Ž': 'Z', 'Ź': 'Z', 'Ż': 'Z',
          'Ď': 'D', 'Đ': 'D',
          'Ğ': 'G', 'Ĝ': 'G', 'Ġ': 'G', 'Ģ': 'G',
          'Ĥ': 'H', 'Ħ': 'H',
          'Ĵ': 'J',
          'Ķ': 'K',
          'Ĺ': 'L', 'Ļ': 'L', 'Ľ': 'L', 'Ŀ': 'L', 'Ł': 'L',
          'Ŕ': 'R', 'Ŗ': 'R', 'Ř': 'R',
          'Ţ': 'T', 'Ť': 'T', 'Ŧ': 'T',
          'Ŵ': 'W',
          'Ź': 'Z', 'Ż': 'Z', 'Ž': 'Z',
          'æ': 'ae', 'Æ': 'AE',
          'œ': 'oe', 'Œ': 'OE',
          'ß': 'ss',
          'þ': 'th', 'Þ': 'TH',
          'ð': 'd', 'Ð': 'D'
      };
      
      let result = '';
      for (let i = 0; i < filename.length; i++) {
          const char = filename[i];
          result += charMap[char] || char;
      }
      
      result = result.replace(/[<>:"/\\|?*]/g, '_');
      result = result.replace(/\s+/g, ' ').trim();
      result = result.replace(/_+/g, '_');
      
      if (!result || result.length === 0) {
          result = 'image';
      }
      
      return result;
  }

  // 將圖片轉換為 PNG Blob
  async function convertImageToPNG(img) {
      return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          image.crossOrigin = 'anonymous';
          
          image.onload = () => {
              try {
                  canvas.width = image.naturalWidth || image.width;
                  canvas.height = image.naturalHeight || image.height;
                  ctx.drawImage(image, 0, 0);
                  canvas.toBlob((blob) => {
                      if (blob) {
                          resolve(blob);
                      } else {
                          reject(new Error('無法轉換圖片'));
                      }
                  }, 'image/png');
              } catch (err) {
                  reject(err);
              }
          };
          
          image.onerror = () => reject(new Error('圖片載入失敗'));
          image.src = img.src;
      });
  }

  // 複製圖片到剪貼簿
  async function copyImageToClipboard(img, container) {
      try {
          const pngBlob = await convertImageToPNG(img);
          await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob })
          ]);
          showSuccessTip(container);
      } catch (err) {
          console.error('複製失敗:', err);
          try {
              const response = await fetch(img.src);
              const blob = await response.blob();
              await navigator.clipboard.write([
                  new ClipboardItem({ [blob.type]: blob })
              ]);
              showSuccessTip(container);
          } catch (fallbackErr) {
              console.error('備用複製方案也失敗:', fallbackErr);
              alert('複製失敗，請確保瀏覽器支援此功能');
          }
      }
  }

  // 顯示成功提示
  function showSuccessTip(container) {
      const oldTip = container.querySelector('.copy-success-tip, .copy-success-tip-small');
      if (oldTip) oldTip.remove();
      
      const tip = document.createElement('span');
      const isSmall = container.classList.contains('img-tools-container-small');
      tip.className = isSmall ? 'copy-success-tip-small' : 'copy-success-tip';
      tip.textContent = '複製成功';
      container.appendChild(tip);

      setTimeout(() => tip.remove(), 2000);
  }

  // 下載圖片
  async function downloadImage(img) {
      try {
          const pngBlob = await convertImageToPNG(img);
          const url = window.URL.createObjectURL(pngBlob);
          const a = document.createElement('a');
          a.href = url;
          
          let filename = img.alt || 'image';
          filename = sanitizeFilename(filename);
          a.download = filename + '.png';
          
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      } catch (err) {
          console.error('下載失敗:', err);
          try {
              const response = await fetch(img.src);
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              
              let ext = 'png';
              if (blob.type === 'image/webp') ext = 'webp';
              else if (blob.type === 'image/jpeg') ext = 'jpg';
              else if (blob.type === 'image/gif') ext = 'gif';
              
              let filename = img.alt || 'image';
              filename = sanitizeFilename(filename);
              a.download = filename + '.' + ext;
              
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          } catch (fallbackErr) {
              console.error('備用下載方案也失敗:', fallbackErr);
              alert('下載失敗');
          }
      }
  }

  // 🔥 修正：逐一下載所有 LOGO（使用過濾後的圖片）
  async function downloadAllLogos(button, tabId) {
      if (isDownloading) {
          console.log('[SofaScore Tools] 已經在下載中，忽略重複點擊');
          return;
      }
      
      isDownloading = true;
      const config = TAB_CONFIGS[tabId];
      console.log(`[SofaScore Tools] 開始下載全部 LOGO（${config.name}）`);
      
      try {
          button.disabled = true;
          
          // 🔥 使用過濾函數獲取唯一且可見的圖片
          const images = getUniqueVisibleImages(config.selector);
          
          if (images.length === 0) {
              alert('找不到任何圖片');
              button.disabled = false;
              isDownloading = false;
              return;
          }
          
          console.log(`[SofaScore Tools] 找到 ${images.length} 張唯一且可見的圖片`);
          
          const confirmed = confirm(`即將逐一下載 ${images.length} 張圖片\n\n注意：\n- 瀏覽器可能會詢問是否允許多個下載\n- 請點擊「允許」以繼續\n- 圖片會以 PNG 格式儲存\n\n是否繼續？`);
          
          if (!confirmed) {
              button.disabled = false;
              isDownloading = false;
              console.log('[SofaScore Tools] 用戶取消下載');
              return;
          }
          
          const filenameCount = {};
          let successCount = 0;
          let failCount = 0;
          
          for (let i = 0; i < images.length; i++) {
              const img = images[i];
              const textSpan = button.querySelector('.btn-text');
              if (textSpan) {
                  textSpan.textContent = `下載中 ${i + 1}/${images.length}`;
              }
              
              try {
                  console.log(`[SofaScore Tools] 處理圖片 ${i + 1}/${images.length}: ${img.alt || img.src}`);
                  const pngBlob = await convertImageToPNG(img);
                  
                  let filename = img.alt || `image_${i + 1}`;
                  filename = sanitizeFilename(filename);
                  
                  if (filenameCount[filename]) {
                      filenameCount[filename]++;
                      filename = `${filename}_${filenameCount[filename]}`;
                  } else {
                      filenameCount[filename] = 1;
                  }
                  
                  const url = window.URL.createObjectURL(pngBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${filename}.png`;
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  
                  await new Promise(resolve => setTimeout(resolve, 100));
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  
                  successCount++;
                  console.log(`[SofaScore Tools] ✅ 已下載 ${i + 1}/${images.length}: ${filename}.png`);
                  
                  await new Promise(resolve => setTimeout(resolve, 300));
                  
              } catch (err) {
                  failCount++;
                  console.error(`[SofaScore Tools] ❌ 下載圖片 ${i + 1} 失敗:`, err);
              }
          }
          
          console.log(`[SofaScore Tools] 下載完成！成功: ${successCount}, 失敗: ${failCount}`);
          
          const textSpan = button.querySelector('.btn-text');
          if (textSpan) {
              textSpan.textContent = '下載全部 LOGO';
          }
          button.disabled = false;
          isDownloading = false;
          
          if (failCount > 0) {
              alert(`下載完成！\n成功：${successCount} 張\n失敗：${failCount} 張\n\n請檢查瀏覽器的下載資料夾`);
          } else {
              alert(`成功下載 ${successCount} 張圖片！\n\n請檢查瀏覽器的下載資料夾`);
          }
          
      } catch (err) {
          console.error('[SofaScore Tools] 下載全部失敗:', err);
          alert(`下載失敗: ${err.message}`);
          
          const textSpan = button.querySelector('.btn-text');
          if (textSpan) {
              textSpan.textContent = '下載全部 LOGO';
          }
          button.disabled = false;
          isDownloading = false;
      }
  }

  // 切換按鈕顯示狀態
  function toggleImageButtons(show) {
      showImageButtons = show;
      localStorage.setItem('sofascore-show-image-buttons', show);
      
      const allContainers = document.querySelectorAll('.img-tools-container, .img-tools-container-small');
      allContainers.forEach(container => {
          if (show) {
              container.classList.remove('hidden');
          } else {
              container.classList.add('hidden');
          }
      });
      
      console.log(`[SofaScore Tools] 🔘 圖片按鈕${show ? '顯示' : '隱藏'}`);
  }

  // 檢查圖片是否已有工具按鈕
  function hasToolButtons(img) {
      const nextElement = img.nextSibling;
      return nextElement && nextElement.classList && 
             (nextElement.classList.contains('img-tools-container') || 
              nextElement.classList.contains('img-tools-container-small'));
  }

  // 為圖片添加工具按鈕
  function addToolButtons(img, isSmall = false) {
      if (hasToolButtons(img)) return;

      const container = document.createElement('span');
      container.className = isSmall ? 'img-tools-container-small' : 'img-tools-container';
      
      if (!showImageButtons) {
          container.classList.add('hidden');
      }

      const copyBtn = document.createElement('button');
      copyBtn.className = isSmall ? 'img-tool-btn-small' : 'img-tool-btn';
      copyBtn.innerHTML = copyIcon;
      copyBtn.title = '複製圖片';
      copyBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          copyImageToClipboard(img, container);
      };

      const downloadBtn = document.createElement('button');
      downloadBtn.className = isSmall ? 'img-tool-btn-small' : 'img-tool-btn';
      downloadBtn.innerHTML = downloadIcon;
      downloadBtn.title = '下載圖片';
      downloadBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          downloadImage(img);
      };

      container.appendChild(copyBtn);
      container.appendChild(downloadBtn);
      img.parentNode.insertBefore(container, img.nextSibling);
  }

  // 簡化規則 - standings 優先於 total
  function shouldSkipTab(tabId) {
      if (tabId === 'total') {
          const standingsPanel = document.querySelector('#tabpanel-standings');
          if (standingsPanel) {
              const style = window.getComputedStyle(standingsPanel);
              const isStandingsHidden = style.display === 'none' || 
                                       style.visibility === 'hidden' || 
                                       standingsPanel.hidden ||
                                       standingsPanel.getAttribute('aria-hidden') === 'true';
              
              if (!isStandingsHidden) {
                  console.log(`[SofaScore Tools] ⏭️ 跳過 total（因為 standings 存在）`);
                  return true;
              }
          }
      }
      return false;
  }

  // 添加「下載全部 LOGO」按鈕
  function addDownloadAllButton(tabId, isSmall = false) {
      if (shouldSkipTab(tabId)) {
          const tabPanel = document.querySelector(`#tabpanel-${tabId}`);
          if (tabPanel) {
              const existingButtons = tabPanel.querySelectorAll('[data-sofascore-tools="download-all-button"]');
              existingButtons.forEach(btn => {
                  console.log(`[SofaScore Tools] 🧹 清理 ${tabId} 中的舊按鈕`);
                  btn.remove();
              });
          }
          return false;
      }
      
      const tabPanel = document.querySelector(`#tabpanel-${tabId}`);
      if (!tabPanel) {
          return false;
      }
      
      const existingButton = tabPanel.querySelector('[data-sofascore-tools="download-all-button"]');
      
      if (existingButton) {
          const firstChild = tabPanel.firstElementChild;
          if (existingButton === firstChild) {
              return true;
          } else {
              console.log(`[SofaScore Tools] 🔄 按鈕位置不正確，重新調整 (${tabId})`);
              existingButton.remove();
          }
      }
      
      const container = document.createElement('div');
      container.className = isSmall ? 'download-all-container-small' : 'download-all-container';
      container.setAttribute('data-tab-id', tabId);
      container.setAttribute('data-sofascore-tools', 'download-all-button');
      
      const switchContainer = document.createElement('div');
      switchContainer.className = isSmall ? 'switch-container-small' : 'switch-container';
      
      const switchLabel = document.createElement('label');
      switchLabel.className = 'switch' + (isSmall ? '-small' : '');
      
      const switchInput = document.createElement('input');
      switchInput.type = 'checkbox';
      switchInput.checked = showImageButtons;
      switchInput.onchange = (e) => {
          toggleImageButtons(e.target.checked);
      };
      
      const slider = document.createElement('span');
      slider.className = 'slider';
      
      switchLabel.appendChild(switchInput);
      switchLabel.appendChild(slider);
      
      const labelText = document.createElement('span');
      labelText.className = 'switch-label';
      labelText.textContent = '顯示按鈕';
      
      switchContainer.appendChild(switchLabel);
      switchContainer.appendChild(labelText);
      
      const button = document.createElement('button');
      button.className = isSmall ? 'download-all-btn-small' : 'download-all-btn';
      button.innerHTML = `
          ${downloadIcon}
          <span class="btn-text">下載全部 LOGO</span>
      `;
      button.title = '逐一下載所有隊伍 LOGO（PNG 格式）';
      
      button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          downloadAllLogos(button, tabId);
      }, { capture: true });
      
      container.appendChild(switchContainer);
      container.appendChild(button);
      
      const firstChild = tabPanel.firstElementChild;
      if (firstChild) {
          tabPanel.insertBefore(container, firstChild);
      } else {
          tabPanel.appendChild(container);
      }
      
      console.log(`[SofaScore Tools] ✅ 已添加「下載全部 LOGO」按鈕和開關 (${tabId})`);
      return true;
  }

  // 檢查分頁是否可見
  function isTabVisible(tabId) {
      const tabPanel = document.querySelector(`#tabpanel-${tabId}`);
      if (!tabPanel) return false;
      
      const style = window.getComputedStyle(tabPanel);
      const isHidden = style.display === 'none' || 
                      style.visibility === 'hidden' || 
                      tabPanel.hidden ||
                      tabPanel.getAttribute('aria-hidden') === 'true';
      
      return !isHidden;
  }

  // 通用處理函數
  function processImages(tabId) {
      if (isDownloading) return;
      
      const config = TAB_CONFIGS[tabId];
      if (!config) return;
      
      if (!isTabVisible(tabId)) return;
      
      const images = document.querySelectorAll(config.selector);
      if (images.length === 0) return;
      
      console.log(`[SofaScore Tools] [${config.name}] 找到 ${images.length} 張圖片`);
      
      const isSmall = config.buttonSize === 'small';
      
      images.forEach((img) => {
          if (!hasToolButtons(img)) {
              addToolButtons(img, isSmall);
          }
      });
      
      addDownloadAllButton(tabId, isSmall);
  }

  // 為每個分頁創建處理器
  const tabProcessors = {};
  const tabObservers = {};
  const tabTimeouts = {};

  Object.keys(TAB_CONFIGS).forEach(tabId => {
      tabProcessors[tabId] = function() {
          if (tabTimeouts[tabId]) {
              clearTimeout(tabTimeouts[tabId]);
          }
          tabTimeouts[tabId] = setTimeout(() => {
              processImages(tabId);
          }, 800);
      };

      tabObservers[tabId] = new MutationObserver((mutations) => {
          if (isDownloading) return;
          
          const hasSignificantChange = mutations.some(mutation => {
              if (mutation.target.getAttribute && 
                  mutation.target.getAttribute('data-sofascore-tools') === 'download-all-button') {
                  return false;
              }
              
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                  const hasOurButton = Array.from(mutation.addedNodes).some(node => 
                      node.nodeType === 1 && 
                      node.getAttribute && 
                      node.getAttribute('data-sofascore-tools') === 'download-all-button'
                  );
                  if (hasOurButton) {
                      return false;
                  }
                  
                  const hasImageChange = Array.from(mutation.addedNodes).some(node => 
                      node.nodeType === 1 && 
                      (node.tagName === 'IMG' || node.querySelector('img'))
                  );
                  return hasImageChange;
              }
              
              if (mutation.type === 'attributes' && 
                  mutation.target.tagName === 'IMG' &&
                  (mutation.attributeName === 'src' || mutation.attributeName === 'alt')) {
                  return true;
              }
              
              return false;
          });
          
          if (hasSignificantChange && isTabVisible(tabId)) {
              tabProcessors[tabId]();
          }
      });
  });

  // 初始化函數
  function initTab(tabId) {
      const targetNode = document.querySelector(`#tabpanel-${tabId}`);
      if (targetNode) {
          tabObservers[tabId].observe(targetNode, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['src', 'alt'],
              characterData: false
          });
          
          if (isTabVisible(tabId)) {
              processImages(tabId);
          }
          
          console.log(`[SofaScore Tools] ✅ 已啟動並監控 #tabpanel-${tabId}`);
      } else {
          console.log(`[SofaScore Tools] ⏳ 等待 #tabpanel-${tabId} 載入...`);
          setTimeout(() => initTab(tabId), 500);
      }
  }

  // 監控整個 document
  const documentObserver = new MutationObserver((mutations) => {
      if (isDownloading) return;
      
      const hasNewImages = mutations.some(m => {
          if (m.addedNodes.length === 0) return false;
          
          const hasOurButton = Array.from(m.addedNodes).some(node => 
              node.nodeType === 1 && 
              node.getAttribute && 
              node.getAttribute('data-sofascore-tools') === 'download-all-button'
          );
          if (hasOurButton) return false;
          
          return Array.from(m.addedNodes).some(node => 
              node.nodeType === 1 && 
              (node.tagName === 'IMG' || node.querySelector('img'))
          );
      });
      
      if (!hasNewImages) return;
      
      Object.keys(TAB_CONFIGS).forEach(tabId => {
          if (isTabVisible(tabId) && tabProcessors[tabId]) {
              tabProcessors[tabId]();
          }
      });
  });

  // 啟動所有分頁
  function initAll() {
      Object.keys(TAB_CONFIGS).forEach(tabId => {
          initTab(tabId);
      });
      
      documentObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false
      });
      
      console.log('[SofaScore Tools] 🎨 深色模式判斷: html.dark');
      console.log(`[SofaScore Tools] 🔘 圖片按鈕預設：${showImageButtons ? '顯示' : '隱藏'}`);
      console.log('[SofaScore Tools] 🚀 已啟動所有功能');
  }

  // 啟動
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
  } else {
      initAll();
  }
})();