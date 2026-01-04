// ==UserScript==
// @name        KU LMS Video Metadata Logger
// @namespace   xplnprk
// @match       https://kucom.korea.ac.kr/em/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     1.1
// @author      explnprk
// @license     MIT License; https://opensource.org/licenses/MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @description Extracts video metadata from KU LMS player.
// @downloadURL https://update.greasyfork.org/scripts/552256/KU%20LMS%20Video%20Metadata%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/552256/KU%20LMS%20Video%20Metadata%20Logger.meta.js
// ==/UserScript==
(()=>{
  'use strict';
  // Variable for current video metadata.
  /*
   ********************
   * MUTATION OBSERVERS
   ********************
  */
  let currentVideo;
  // Check whether player is loaded and execute callback using MutationObserver.
  function checkPlayerLoad(onLoad) {
    VM.observe(document.body, () => {
      // Check vc-content-meta-title(class of title) is exist.
      if($('.vc-content-meta-title').length) {
        onLoad();
        return true;
      }
    });
  }
  GM_addStyle(`
    #log-floating-btn:not(:hover) {
      opacity: 0.2;
    }
  `);

  /*
   ********************
   * VIDEO METADATA UTILS
   ********************
  */

  // Retrive video data from id.
  function retriveVideoData(contentId, onReceive) {
    $.ajax({
      url: 'https://kucom.korea.ac.kr/viewer/ssplayer/uniplayer_support/content.php?content_id=' + contentId,
      type: 'GET',
      dataType: 'xml',
      success: (xml) => {
        onReceive(xml);
      }
    });
  }

  /*
   ********************
   * MAIN METADATA FUNCTION
   ********************
  */

  // Get comprehensive video metadata
  function getVideoMetadata() {
    return new Promise((resolve, reject) => {
      // Wait for player to load
      checkPlayerLoad(() => {
        try {
          // Find id from html attribute
          const id = $('html').attr("id").replace("-page", "");

          // Get video data from server
          retriveVideoData(id, (xml) => {
            try {
              // Extract content metadata from data xml
              const contentData = $(xml).find('content_metadata');
              const title = $(contentData).find('title').text();
              const author = $(contentData).find('author').find('name').text();
              const thumbnail = $(xml).find('content_thumbnail_uri').text();
              const uri = window.location.href;

              // Extract media information
              const mediaUri = $(xml).find('media_uri[method="progressive"][target="all"]').text();
              const pseudoUri = $(xml).find('media_uri[method="pseudo"]').text();
              const mainMedia = $(xml).find('main_media');

              // Build media files array
              const mediaFiles = [];
              $(mainMedia).each(function() {
                mediaFiles.push($(this).text());
              });

              // Create comprehensive metadata object
              const metadata = {
                id: id,
                title: title,
                author: author,
                thumbnail: thumbnail,
                uri: uri,
                mediaUri: mediaUri,
                pseudoUri: pseudoUri,
                mediaFiles: mediaFiles,
                mediaCount: mainMedia.length,
                timestamp: new Date().toISOString()
              };

              // Store current video metadata
              currentVideo = metadata;

              resolve(metadata);
            } catch (error) {
              reject(new Error('Failed to parse video metadata: ' + error.message));
            }
          });
        } catch (error) {
          reject(new Error('Failed to get video ID: ' + error.message));
        }
      });
    });
  }
   const STORE_NAME = 'ku-lms-logger';

   const initIndexedDB = () => {
     return new Promise((resolve, reject) => {
       const request = indexedDB.open('ku-lms-logger', 1);

       request.onerror = (event) => {
         console.error('IndexedDB 오류:', event.target.error);
         reject(event.target.error);
       };

       request.onsuccess = (event) => {
         console.log('IndexedDB 초기화 성공');
         resolve(event.target.result);
       };

       request.onupgradeneeded = (event) => {
         const db = event.target.result;
         if (!db.objectStoreNames.contains(STORE_NAME)) {
           db.createObjectStore(STORE_NAME, { keyPath: 'id' });
         }
       };
     });
   }

  const saveMetaDataIntoIndexedDB = async ({author, id, title, timestamp, uri}) => {
    // URI 유효성 검사
    if (typeof uri !== 'string' || uri.length === 0) {
      throw new Error('URI는 유효한 문자열이어야 합니다.');
    }

    try {
      const db = await initIndexedDB();

      // 중복 체크
      const checkDuplicate = () => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get(id);

          request.onsuccess = (event) => {
            resolve(event.target.result !== undefined);
          };

          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
      };

      const isDuplicate = await checkDuplicate();

      if (isDuplicate) {
        console.log(`ID ${id}는 이미 존재합니다. 저장을 건너뜁니다.`);
        return false;
      }

      // 데이터 저장
      const saveData = () => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.add({
            author,
            id,
            title,
            timestamp,
            uri
          });

          request.onsuccess = () => {
            console.log('메타데이터가 IndexedDB에 저장되었습니다:', {author, id, title, timestamp, uri});
            resolve(true);
          };

          request.onerror = (event) => {
            console.error('데이터 저장 오류:', event.target.error);
            reject(event.target.error);
          };
        });
      };

      return await saveData();

    } catch (error) {
      console.error('IndexedDB 저장 중 오류 발생:', error);
      throw error;
    }
  };

  // Get all metadata from IndexedDB
  const getAllMetadataFromIndexedDB = async () => {
    try {
      const db = await initIndexedDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('데이터 조회 중 오류 발생:', error);
      throw error;
    }
  };

  // Save button position to localStorage
  const saveButtonPosition = (x, y) => {
    localStorage.setItem('ku-lms-logger-button-position', JSON.stringify({ x, y }));
  };

  // Load button position from localStorage
  const loadButtonPosition = () => {
    const saved = localStorage.getItem('ku-lms-logger-button-position');
    if (saved) {
      return JSON.parse(saved);
    }
    return { x: window.innerWidth - 80, y: window.innerHeight - 80 }; // default position
  };

  // Create floating button
  const createFloatingButton = () => {
    const button = document.createElement('button');
    button.id = 'log-floating-btn';
    button.textContent = 'log';

    // Load saved position
    const position = loadButtonPosition();

    button.style.cssText = `
      position: fixed;
      left: ${position.x}px;
      top: ${position.y}px;
      z-index: 10000;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
      transition: all 0.3s ease;
      user-select: none;
    `;

    // Drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let dragStart = false;

    const startDrag = async (e) => {
      dragStart = true;
      await new Promise(resolve=>setTimeout(resolve, 100));
      if (!dragStart) return;
      isDragging = true;
      const rect = button.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;

      button.style.cursor = 'grabbing';
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
      button.style.transition = 'none'; // Remove transition during drag

      e.preventDefault();
      e.stopPropagation();
    };

    const drag = (e) => {
      if (!isDragging) return;

      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      // Keep button within viewport
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;

      button.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      button.style.top = Math.max(0, Math.min(y, maxY)) + 'px';

      e.preventDefault();
      e.stopPropagation();
    };

    const endDrag = () => {
      dragStart = false;
      if (!isDragging) return;

      isDragging = false;
      button.style.cursor = 'pointer';
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
      button.style.transition = 'all 0.3s ease'; // Restore transition after drag

      // Save position
      const rect = button.getBoundingClientRect();
      saveButtonPosition(rect.left, rect.top);
    };

    // Mouse events
    button.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile
    button.addEventListener('touchstart', (e) => {
      startDrag(e.touches[0]);
    });
    document.addEventListener('touchmove', (e) => {
      drag(e.touches[0]);
    });
    document.addEventListener('touchend', endDrag);

    // Click event (only when not dragging)
    button.addEventListener('click', (e) => {
      // Add a small delay to ensure isDragging state is properly set
      e.preventDefault();
      button.addEventListener('mouseup', ()=>{
        if (!isDragging) showModal();
      }, {once: true});
    });

    // Hover effects (only when not dragging)
    button.addEventListener('mouseenter', () => {
      if (!isDragging) {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
      }
    });

    button.addEventListener('mouseleave', () => {
      if (!isDragging) {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
      }
    });

    document.body.appendChild(button);
  };

  // Create modal HTML
  const createModal = () => {
    const modal = document.createElement('div');
    modal.id = 'log-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10001;
      overflow: auto;
      transition: opacity 0.3s ease;
    `;

    modal.innerHTML = /* html */`
      <div style="
        position: relative;
        background: white;
        margin: 2% auto;
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 1200px;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        ">
          <h2 style="margin: 0; color: #333;">동영상 로그</h2>
          <button id="close-modal" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">닫기</button>
        </div>

        <!-- Search Section -->
        <div id="search-section" style="
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            cursor: pointer;
          " id="search-header">
            <h3 style="margin: 0; color: #333;">검색</h3>
            <button id="search-toggle-btn" style="
              background: none;
              border: none;
              font-size: 18px;
              color: #666;
              cursor: pointer;
              padding: 5px;
              border-radius: 3px;
              transition: transform 0.3s ease, background-color 0.2s ease;
            " title="검색 섹션 접기/펼치기">▼</button>
          </div>
          <div id="search-content" style="
            transition: max-height 0.3s ease, opacity 0.3s ease;
            overflow: hidden;
          ">
          <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
            <input type="text" id="search-author" placeholder="작성자 검색..." style="
              flex: 1;
              min-width: 150px;
              padding: 8px 12px;
              border: 1px solid #ced4da;
              border-radius: 4px;
              font-size: 14px;
            ">
            <input type="text" id="search-title" placeholder="제목 검색..." style="
              flex: 1;
              min-width: 150px;
              padding: 8px 12px;
              border: 1px solid #ced4da;
              border-radius: 4px;
              font-size: 14px;
            ">
          </div>
          <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; align-items: center;">
            <label style="font-size: 14px; color: #495057; white-space: nowrap;">시작일:</label>
            <input type="date" id="search-start-date" style="
              padding: 8px 12px;
              border: 1px solid #ced4da;
              border-radius: 4px;
              font-size: 14px;
            ">
            <label style="font-size: 14px; color: #495057; white-space: nowrap;">종료일:</label>
            <input type="date" id="search-end-date" style="
              padding: 8px 12px;
              border: 1px solid #ced4da;
              border-radius: 4px;
              font-size: 14px;
            ">
            <button id="search-btn" style="
              background: #007bff;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">검색</button>
            <button id="clear-search-btn" style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">초기화</button>
          </div>
          <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
            <button id="export-csv-btn" style="
              background: #28a745;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">CSV 내보내기</button>
            <button id="import-csv-btn" style="
              background: #17a2b8;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">CSV 가져오기</button>
            <input type="file" id="csv-file-input" accept=".csv" style="display: none;">
          </div>
          <div id="search-results-info" style="
            font-size: 14px;
            color: #495057;
            margin-top: 10px;
          "></div>
          <div id="sync-status" style="
            font-size: 14px;
            color: #495057;
            margin-top: 5px;
            display: none;
          "></div>
          </div>
        </div>
        <span>제목 더블클릭하면 수정 가능</span>
        <div id="log-table-container" style="overflow-x: auto;">
          <table id="log-table" style="
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          ">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">ID</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">제목</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">작성자</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">시간</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">URI</th>
              </tr>
            </thead>
            <tbody id="log-table-body">
            </tbody>
          </table>
        </div>
        <div id="no-data" style="
          text-align: center;
          padding: 40px;
          color: #666;
          display: none;
        ">
          저장된 데이터가 없습니다.
        </div>
        <div id="no-search-results" style="
          text-align: center;
          padding: 40px;
          color: #666;
          display: none;
        ">
          검색 결과가 없습니다.
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Hover effects for opacity
    modal.addEventListener('mouseenter', () => {
      modal.style.opacity = '1';
    });

    modal.addEventListener('mouseleave', () => {
      modal.style.opacity = '0.2';
    });

    // Close button event
    document.getElementById('close-modal').addEventListener('click', hideModal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });

    // Search functionality
    let allData = []; // Store all data for filtering

    // Make functions globally accessible
    window.allData = allData;
    window.renderSearchResults = null;

    const filterData = (data, searchCriteria) => {
      return data.filter(item => {
        // Author filter
        if (searchCriteria.author && !item.author.toLowerCase().includes(searchCriteria.author.toLowerCase())) {
          return false;
        }

        // Title filter
        if (searchCriteria.title && !item.title.toLowerCase().includes(searchCriteria.title.toLowerCase())) {
          return false;
        }

        // Date range filter
        if (searchCriteria.startDate || searchCriteria.endDate) {
          const itemDate = new Date(item.timestamp);
          const startDate = searchCriteria.startDate ? new Date(searchCriteria.startDate) : null;
          const endDate = searchCriteria.endDate ? new Date(searchCriteria.endDate) : null;

          if (startDate && itemDate < startDate) {
            return false;
          }
          if (endDate && itemDate > endDate) {
            return false;
          }
        }

        return true;
      });
    };

    const renderSearchResults = (data) => {
      const tableBody = document.getElementById('log-table-body');
      const noData = document.getElementById('no-data');
      const noSearchResults = document.getElementById('no-search-results');
      const searchResultsInfo = document.getElementById('search-results-info');

      // Hide all status messages
      noData.style.display = 'none';
      noSearchResults.style.display = 'none';

      if (data.length === 0) {
        tableBody.innerHTML = '';
        if (allData.length === 0) {
          noData.style.display = 'block';
        } else {
          noSearchResults.style.display = 'block';
        }
        if (searchResultsInfo) {
          searchResultsInfo.textContent = '';
        }
        return;
      }

      // Show search results info
      if (searchResultsInfo) {
        searchResultsInfo.textContent = `검색 결과: ${data.length}개 (전체 ${allData.length}개 중)`;
      }

      tableBody.innerHTML = '';

      data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.cssText = `
          background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};
          transition: background 0.2s ease;
        `;
        const uri = new URL(item.uri);
        uri.search = '';
        const uriString = uri.toString();

        row.innerHTML = `
          <td style="padding: 12px; border: 1px solid #ddd; font-family: monospace;">${item.id}</td>
          <td class="title-cell" data-item-id="${item.id}" style="padding: 12px; border: 1px solid #ddd; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;" title="${item.title}">${item.title}</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${item.author}</td>
          <td style="padding: 12px; border: 1px solid #ddd; font-size: 12px;">${new Date(item.timestamp).toLocaleString('ko-KR')}</td>
          <td style="padding: 12px; border: 1px solid #ddd; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.uri}">
            <a href="${uriString}" target="_blank" style="color: #007bff; text-decoration: none;">링크</a>
          </td>
        `;

        // Hover effect
        row.addEventListener('mouseenter', () => {
          row.style.background = '#e3f2fd';
        });

        row.addEventListener('mouseleave', () => {
          row.style.background = index % 2 === 0 ? '#fff' : '#f8f9fa';
        });

        // Title edit functionality
        const titleCell = row.querySelector('.title-cell');
        titleCell.addEventListener('dblclick', () => {
          enableTitleEdit(titleCell, item);
        });

        tableBody.appendChild(row);
      });
    };

    // Make renderSearchResults globally accessible
    window.renderSearchResults = renderSearchResults;

    // Title editing functionality
    const enableTitleEdit = (cell, item) => {
      const originalTitle = item.title;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalTitle;
      input.style.cssText = `
        width: 100%;
        padding: 4px 8px;
        border: 2px solid #007bff;
        border-radius: 4px;
        font-size: 14px;
        background: #fff;
        outline: none;
      `;

      // Replace cell content with input
      cell.innerHTML = '';
      cell.appendChild(input);
      cell.style.background = '#e3f2fd';

      // Focus and select text
      input.focus();
      input.select();

      const saveEdit = async () => {
        const newTitle = input.value.trim();
        if (newTitle === originalTitle) {
          cancelTitleEdit(cell, originalTitle);
          return;
        }

        if (newTitle === '') {
          showSyncStatus('제목은 비어있을 수 없습니다.', 'error');
          cancelTitleEdit(cell, originalTitle);
          return;
        }

        try {
          showSyncStatus('제목을 업데이트하는 중...', 'info');
          await updateVideoTitleInDB(item.id, newTitle);

          // Update local data
          const updatedItem = allData.find(data => data.id === item.id);
          if (updatedItem) {
            updatedItem.title = newTitle;
          }

          // Update the cell content
          cell.innerHTML = newTitle;
          cell.style.background = '';
          cell.title = `${newTitle} (더블클릭하여 수정)`;

          showSyncStatus('제목이 성공적으로 업데이트되었습니다.', 'success');

          // Re-add the double-click event
          cell.addEventListener('dblclick', () => {
            enableTitleEdit(cell, updatedItem);
          });

        } catch (error) {
          console.error('제목 업데이트 오류:', error);
          showSyncStatus('제목 업데이트 중 오류가 발생했습니다.', 'error');
          cancelTitleEdit(cell, originalTitle);
        }
      };

      const cancelEdit = () => {
        cancelTitleEdit(cell, originalTitle);
      };

      // Event listeners with propagation prevention
      input.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        }
      });

      input.addEventListener('keyup', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('keypress', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('input', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('focus', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('blur', (e) => {
        e.stopPropagation();
        saveEdit();
      });

      input.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('mouseup', (e) => {
        e.stopPropagation();
      });
    };

    const cancelTitleEdit = (cell, originalTitle) => {
      cell.innerHTML = originalTitle;
      cell.style.background = '';
      cell.title = `${originalTitle} (더블클릭하여 수정)`;
    };

    const updateVideoTitleInDB = async (id, newTitle) => {
      try {
        const db = await initIndexedDB();

        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get(id);

          request.onsuccess = () => {
            const item = request.result;
            if (item) {
              item.title = newTitle;
              const updateRequest = store.put(item);

              updateRequest.onsuccess = () => resolve();
              updateRequest.onerror = () => reject(updateRequest.error);
            } else {
              reject(new Error('항목을 찾을 수 없습니다.'));
            }
          };

          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('IndexedDB 업데이트 오류:', error);
        throw error;
      }
    };

    const performSearch = () => {
      const author = document.getElementById('search-author').value.trim();
      const title = document.getElementById('search-title').value.trim();
      const startDate = document.getElementById('search-start-date').value;
      const endDate = document.getElementById('search-end-date').value;

      const searchCriteria = { author, title, startDate, endDate };
      const filteredData = filterData(allData, searchCriteria);
      renderSearchResults(filteredData);
    };

    const clearSearch = () => {
      document.getElementById('search-author').value = '';
      document.getElementById('search-title').value = '';
      document.getElementById('search-start-date').value = '';
      document.getElementById('search-end-date').value = '';
      renderSearchResults(allData);
    };

    // Make functions globally accessible
    window.performSearch = performSearch;
    window.clearSearch = clearSearch;

    // Search event listeners
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('clear-search-btn').addEventListener('click', clearSearch);

    // Real-time search on input
    document.getElementById('search-author').addEventListener('input', performSearch);
    document.getElementById('search-title').addEventListener('input', performSearch);
    document.getElementById('search-start-date').addEventListener('change', performSearch);
    document.getElementById('search-end-date').addEventListener('change', performSearch);

    // Search section toggle functionality
    let isSearchCollapsed = false;

    const saveSearchSectionState = (collapsed) => {
      localStorage.setItem('ku-lms-logger-search-collapsed', JSON.stringify(collapsed));
    };

    const loadSearchSectionState = () => {
      const saved = localStorage.getItem('ku-lms-logger-search-collapsed');
      return saved ? JSON.parse(saved) : false; // Default to expanded
    };

    const applySearchSectionState = (collapsed) => {
      const searchContent = document.getElementById('search-content');
      const toggleBtn = document.getElementById('search-toggle-btn');

      isSearchCollapsed = collapsed;

      if (collapsed) {
        // Collapse
        searchContent.style.maxHeight = '0';
        searchContent.style.opacity = '0';
        searchContent.style.padding = '0 15px';
        toggleBtn.textContent = '▶';
        toggleBtn.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        searchContent.style.maxHeight = '500px';
        searchContent.style.opacity = '1';
        searchContent.style.padding = '15px';
        toggleBtn.textContent = '▼';
        toggleBtn.style.transform = 'rotate(0deg)';
      }
    };

    const toggleSearchSection = () => {
      const newState = !isSearchCollapsed;
      applySearchSectionState(newState);
      saveSearchSectionState(newState);
    };

    // Search header click event
    document.getElementById('search-header').addEventListener('click', toggleSearchSection);

    // Toggle button hover effects
    const toggleBtn = document.getElementById('search-toggle-btn');
    toggleBtn.addEventListener('mouseenter', () => {
      toggleBtn.style.backgroundColor = '#e9ecef';
    });
    toggleBtn.addEventListener('mouseleave', () => {
      toggleBtn.style.backgroundColor = 'transparent';
    });

    // Load and apply saved search section state
    const savedSearchState = loadSearchSectionState();
    applySearchSectionState(savedSearchState);

    // CSV Export/Import functionality
    const exportToCSV = () => {
      try {
        const csvContent = convertToCSV(allData);
        const filename = `ku-lms-logger-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
        showSyncStatus('CSV 파일이 다운로드되었습니다.', 'success');
      } catch (error) {
        console.error('CSV 내보내기 오류:', error);
        showSyncStatus('CSV 내보내기 중 오류가 발생했습니다.', 'error');
      }
    };

    const convertToCSV = (data) => {
      if (data.length === 0) {
        return 'ID,Title,Author,Timestamp,URI\n';
      }

      const headers = ['ID', 'Title', 'Author', 'Timestamp', 'URI'];
      const csvRows = [headers.join(',')];

      data.forEach(item => {
        const row = [
          `"${item.id}"`,
          `"${item.title.replace(/"/g, '""')}"`,
          `"${item.author.replace(/"/g, '""')}"`,
          `"${item.timestamp}"`,
          `"${item.uri.replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });

      return csvRows.join('\n');
    };

    const downloadCSV = (csvContent, filename) => {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const importFromCSV = () => {
      const fileInput = document.getElementById('csv-file-input');
      fileInput.click();
    };

    const parseCSV = (csvText) => {
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;

        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
        if (values.length >= 5) {
          data.push({
            id: values[0],
            title: values[1],
            author: values[2],
            timestamp: values[3],
            uri: values[4]
          });
        }
      }

      return data;
    };

    const syncToIndexedDB = async (csvData) => {
      try {
        const db = await initIndexedDB();
        let addedCount = 0;
        let skippedCount = 0;

        for (const item of csvData) {
          // Check if item already exists
          const exists = await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(item.id);

            request.onsuccess = () => resolve(request.result !== undefined);
            request.onerror = () => reject(request.error);
          });

          if (!exists) {
            // Add new item
            await new Promise((resolve, reject) => {
              const transaction = db.transaction([STORE_NAME], 'readwrite');
              const store = transaction.objectStore(STORE_NAME);
              const request = store.add(item);

              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
            addedCount++;
          } else {
            skippedCount++;
          }
        }

        return { addedCount, skippedCount };
      } catch (error) {
        console.error('IndexedDB 동기화 오류:', error);
        throw error;
      }
    };

    const showSyncStatus = (message, type = 'info') => {
      const statusDiv = document.getElementById('sync-status');
      statusDiv.style.display = 'block';
      statusDiv.textContent = message;

      // Set color based on type
      if (type === 'success') {
        statusDiv.style.color = '#28a745';
      } else if (type === 'error') {
        statusDiv.style.color = '#dc3545';
      } else {
        statusDiv.style.color = '#495057';
      }

      // Hide after 5 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    };

    // CSV event listeners
    document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);
    document.getElementById('import-csv-btn').addEventListener('click', importFromCSV);

    document.getElementById('csv-file-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        showSyncStatus('CSV 파일을 읽는 중...', 'info');
        const csvText = await file.text();
        const csvData = parseCSV(csvText);

        showSyncStatus('IndexedDB에 동기화하는 중...', 'info');
        const result = await syncToIndexedDB(csvData);

        showSyncStatus(`동기화 완료: ${result.addedCount}개 추가, ${result.skippedCount}개 건너뜀`, 'success');

        // Refresh the data display
        allData = await getAllMetadataFromIndexedDB();
        window.allData = allData;
        renderSearchResults(allData);

      } catch (error) {
        console.error('CSV 가져오기 오류:', error);
        showSyncStatus('CSV 가져오기 중 오류가 발생했습니다.', 'error');
      }

      // Reset file input
      e.target.value = '';
    });
  };

  // Show modal and load data
  const showModal = async () => {
    const modal = document.getElementById('log-modal');
    const tableBody = document.getElementById('log-table-body');
    const noData = document.getElementById('no-data');

    modal.style.display = 'block';
    modal.style.opacity = '1'; // Show with full opacity when opened

    try {
      const data = await getAllMetadataFromIndexedDB();

      // Store data globally for search functionality
      window.allData = data;
      allData = data; // Update local variable

      if (data.length === 0) {
        tableBody.innerHTML = '';
        noData.style.display = 'block';
        return;
      }

      // Use the search functionality to render all data
      const searchResultsInfo = document.getElementById('search-results-info');
      if (searchResultsInfo) {
        searchResultsInfo.textContent = `전체 ${data.length}개 항목`;
      }

      // Render all data using the search render function
      if (window.renderSearchResults) {
        window.renderSearchResults(data);
      } else {
        // Fallback to original rendering if search function not available
        noData.style.display = 'none';
        tableBody.innerHTML = '';

        data.forEach((item, index) => {
          const row = document.createElement('tr');
          row.style.cssText = `
            background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};
            transition: background 0.2s ease;
          `;
          const uri = new URL(item.uri);
          uri.search = '';
          const uriString = uri.toString();

          row.innerHTML = `
            <td style="padding: 12px; border: 1px solid #ddd; font-family: monospace;">${item.id}</td>
            <td style="padding: 12px; border: 1px solid #ddd; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.title}">${item.title}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${item.author}</td>
            <td style="padding: 12px; border: 1px solid #ddd; font-size: 12px;">${new Date(item.timestamp).toLocaleString('ko-KR')}</td>
            <td style="padding: 12px; border: 1px solid #ddd; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.uri}">
              <a href="${uriString}" target="_blank" style="color: #007bff; text-decoration: none;">링크</a>
            </td>
          `;

          // Hover effect
          row.addEventListener('mouseenter', () => {
            row.style.background = '#e3f2fd';
          });

          row.addEventListener('mouseleave', () => {
            row.style.background = index % 2 === 0 ? '#fff' : '#f8f9fa';
          });

          tableBody.appendChild(row);
        });
      }

    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #dc3545;">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
  };

  // Hide modal
  const hideModal = () => {
    const modal = document.getElementById('log-modal');
    modal.style.display = 'none';
    modal.style.opacity = '0.2'; // Reset to default opacity
  };

  // Initialize metadata extraction when page loads
  (async()=>{
    try {
      await new Promise(resolve=>checkPlayerLoad(resolve));
      const metadata = await getVideoMetadata();
      const {author, id, title, timestamp, uri} = metadata;

      console.log('Video metadata extracted:', {author, id, title, timestamp, uri});

      // IndexedDB에 저장
      const saved = await saveMetaDataIntoIndexedDB({author, id, title, timestamp, uri});
      if (saved) {
        console.log('메타데이터가 성공적으로 저장되었습니다.');
      } else {
        console.log('중복된 데이터로 인해 저장이 건너뛰어졌습니다.');
      }
    } catch (error) {
      console.error('메타데이터 처리 중 오류 발생:', error);
    }
  })();

  // Initialize UI components
  (() => {
    // Create floating button and modal
    createFloatingButton();
    createModal();
  })();
})();
