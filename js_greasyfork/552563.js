// ==UserScript==
// @name         PTE  Pixiv→Eagle 标签管理
// @name:en      PTE  Pixiv→Eagle Tag Manager
// @author       Mliechoy
// @version      1.4
// @description        一键导入 Pixiv 图片/动图到 Eagle；支持详情/列表/勾选三种模式；实时进度/ETA/可取消；面板可拖拽并记忆位置；本地或 Eagle 模式切换；作者文件夹自动归档。
// @description:en     One-click import Pixiv to Eagle (ugoira→GIF); detail/list/selected modes; progress & ETA; cancel; draggable panel with position memory; local only.
// @description:ja     Pixiv を Eagle にワンクリックで取り込み（ugoira→GIF 含む）；詳細/一覧/選択の取り込み；進捗・ETA・キャンセル；ドラッグ可能＆位置記憶のパネル；ローカル通信。
// @description:zh-TW  一鍵匯入 Pixiv 至 Eagle（含 ugoira→GIF）；支援詳情/列表/勾選；進度列/ETA/可取消；面板可拖曳並記憶位置；僅本機通訊。
// @match        https://www.pixiv.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      localhost
// @connect      127.0.0.1
// @connect      i.pximg.net
// @connect      cdn.jsdelivr.net
// @connect      api.deepseek.com
// @connect      api.openai.com
// @connect      api.groq.com
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-idle
// @license      MIT
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://www.pixiv.net
// @icon64       https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=64&url=https://www.pixiv.net
// @homepage     https://github.com/Mlietial/Save-Pixiv-picture-to-eagle
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @require      https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.min.js
// @require      https://unpkg.com/pinyin-pro
// @namespace https://pte-script.example
// @downloadURL https://update.greasyfork.org/scripts/552563/PTE%20%20Pixiv%E2%86%92Eagle%20%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/552563/PTE%20%20Pixiv%E2%86%92Eagle%20%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******************** 常量 & 工具 ********************/
  const BIG_GIF_LIMIT = 40 * 1024 * 1024; // 约 40MB：ugoira→GIF 体积超过此值时优先切换为本地模式
  const INDEXEDDB_THRESHOLD = 1000; // 标签数超过此数量时，自动升级到 IndexedDB 存储
  const FILTER_THRESHOLD = 500; // 过滤标签/作品数超过此数量时，自动升级到 IndexedDB 存储
  const MAX_CONCURRENT_REQUESTS = 3; // 最多同时发起的网络请求数
  const EAGLE = { base: 'http://localhost:41595', api: { add: '/api/item/addFromURLs', list: '/api/folder/list', create: '/api/folder/create', update: '/api/folder/update' } };
  
  // 翻译 API 默认配置
  const TRANSLATE_PROVIDERS = {
    none: { name: 'Pixiv官方翻译', url: '', model: '' },
    ollama: { name: 'Ollama', url: 'http://localhost:11434/v1/chat/completions', model: 'qwen2.5:14b' },
    groq: { name: 'Groq', url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    openai: { name: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
    gemini: { name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', model: 'gemini-1.5-flash' },
    custom: { name: '自定义 API', url: '', model: '' }
  };
  
  // 获取翻译配置
  const getTranslateConfig = () => {
    const allConfigs = LS.get('translateApiConfigs', {});
    const provider = LS.get('translateProvider', 'none');
    const config = allConfigs[provider] || {};
    return { provider, apiKey: config.apiKey || '', customUrl: config.customUrl || '', customModel: config.customModel || '' };
  };
  const LSKEY = 'pxeMini';
  const LS = {
    get(k, d) {
      try {
        const val = localStorage.getItem(LSKEY + ':' + k);
        if (val === null) return d;
        try { return JSON.parse(val); } catch { return val; }
      } catch { return d; }
    },
    set(k, v) { try { localStorage.setItem(LSKEY + ':' + k, typeof v === 'string' ? v : JSON.stringify(v)); } catch { } }
  };

  /******************** IndexedDB 标签存储 ********************/
  const TagDB = (() => {
    let db = null;
    let isAvailable = true; // IndexedDB 可用性标志
    const DB_NAME = 'PTE_TagDB';
    const STORE_NAME = 'data';

    // 错误恢复：检查 IndexedDB 是否可用
    const checkIndexedDBAvailable = async () => {
      try {
        const test = indexedDB.open('__PTE_TEST__');
        return await new Promise((resolve) => {
          test.onsuccess = () => {
            test.result.close();
            indexedDB.deleteDatabase('__PTE_TEST__');
            resolve(true);
          };
          test.onerror = () => resolve(false);
        });
      } catch {
        return false;
      }
    };

    const open = () => new Promise((resolve, reject) => {
      if (!isAvailable) {
        reject(new Error('IndexedDB 不可用，已降级到 localStorage'));
        return;
      }
      
      const req = indexedDB.open(DB_NAME, 1);
      req.onerror = () => {
        isAvailable = false;
        console.warn('[PTE] IndexedDB 不可用，自动降级到 localStorage');
        reject(new Error('IndexedDB 打开失败'));
      };
      req.onsuccess = () => { db = req.result; resolve(db); };
      req.onupgradeneeded = (e) => {
        try {
          const database = e.target.result;
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            const store = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        } catch (err) {
          isAvailable = false;
          console.warn('[PTE] IndexedDB 初始化失败:', err);
        }
      };
    });

    const ensureOpen = async () => {
      if (!db) await open();
    };

    const getItem = async (key) => {
      try {
        if (!isAvailable) return null;
        await ensureOpen();
        return new Promise((resolve) => {
          const tx = db.transaction([STORE_NAME], 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result?.value || null);
          req.onerror = () => {
            isAvailable = false;
            resolve(null);
          };
        });
      } catch (e) {
        isAvailable = false;
        console.warn('[PTE] IndexedDB getItem 失败，降级到 localStorage:', e.message);
        return null;
      }
    };

    const setItem = async (key, value) => {
      try {
        if (!isAvailable) return false;
        await ensureOpen();
        return new Promise((resolve) => {
          const tx = db.transaction([STORE_NAME], 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put({ key, value, timestamp: Date.now() });
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => {
            isAvailable = false;
            resolve(false);
          };
        });
      } catch (e) {
        isAvailable = false;
        console.warn('[PTE] IndexedDB setItem 失败，降级到 localStorage:', e.message);
        return false;
      }
    };

    return {
      // 标签翻译 - 混合存储模式：优先读 localStorage，超过阈值时使用 IndexedDB
      async getAllTags() {
        try {
          if (!isAvailable) {
            const lsTags = LS.get('tagTranslations', {});
            return (lsTags && typeof lsTags === 'object') ? lsTags : {};
          }
          
          const lsTags = LS.get('tagTranslations', {});
          const tagCount = lsTags && typeof lsTags === 'object' ? Object.keys(lsTags).length : 0;
          
          if (tagCount > 0 && tagCount < INDEXEDDB_THRESHOLD) {
            return lsTags;
          }
          
          await ensureOpen();
          return new Promise((resolve) => {
            const tx = db.transaction([STORE_NAME], 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get('tags');
            req.onsuccess = () => {
              const tags = req.result?.value || {};
              resolve((tags && typeof tags === 'object') ? tags : {});
            };
            req.onerror = () => {
              console.warn('[PTE] getAllTags IndexedDB 读取失败');
              resolve({});
            };
          });
        } catch (e) {
          isAvailable = false;
          console.warn('[PTE] getAllTags 失败，恢复 localStorage:', e.message);
          const fallback = LS.get('tagTranslations', {});
          return (fallback && typeof fallback === 'object') ? fallback : {};
        }
      },

      async saveTags(tagsObj) {
        try {
          const tagCount = tagsObj && typeof tagsObj === 'object' ? Object.keys(tagsObj).length : 0;
          
          if (!isAvailable) {
            LS.set('tagTranslations', tagsObj);
            return true;
          }
          
          if (tagCount < INDEXEDDB_THRESHOLD) {
            LS.set('tagTranslations', tagsObj);
            return true;
          }
          
          await ensureOpen();
          return new Promise((resolve) => {
            const tx = db.transaction([STORE_NAME], 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put({ key: 'tags', value: tagsObj, timestamp: Date.now() });
            tx.oncomplete = () => {
              try { localStorage.removeItem(LSKEY + ':tagTranslations'); } catch { }
              resolve(true);
            };
            tx.onerror = () => {
              isAvailable = false;
              LS.set('tagTranslations', tagsObj);
              resolve(true);
            };
          });
        } catch (e) {
          isAvailable = false;
          console.warn('[PTE] saveTags 失败，降级到 localStorage:', e.message);
          LS.set('tagTranslations', tagsObj);
          return true;
        }
      },

      // 过滤标签
      async getExcludeTags() {
        if (!isAvailable) {
          return LS.get('excludeTags', '') || '';
        }
        
        const lsVal = LS.get('excludeTags', '');
        const count = lsVal ? lsVal.split(',').filter(Boolean).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          return lsVal || '';
        }
        
        try {
          const val = await getItem('excludeTags');
          return val || '';
        } catch (e) {
          isAvailable = false;
          return LS.get('excludeTags', '') || '';
        }
      },

      async saveExcludeTags(tagsStr) {
        if (!isAvailable) {
          LS.set('excludeTags', tagsStr);
          return true;
        }
        
        const count = tagsStr ? tagsStr.split(',').filter(Boolean).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          LS.set('excludeTags', tagsStr);
          return true;
        }
        
        try {
          return await setItem('excludeTags', tagsStr);
        } catch (e) {
          isAvailable = false;
          LS.set('excludeTags', tagsStr);
          return true;
        }
      },

      async getExcludeTagsWithTime() {
        if (!isAvailable) {
          return LS.get('excludeTagsWithTime', {}) || {};
        }
        
        const lsVal = LS.get('excludeTagsWithTime', {});
        const count = lsVal && typeof lsVal === 'object' ? Object.keys(lsVal).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          return lsVal || {};
        }
        
        try {
          const val = await getItem('excludeTagsWithTime');
          return val || {};
        } catch (e) {
          isAvailable = false;
          return LS.get('excludeTagsWithTime', {}) || {};
        }
      },

      async saveExcludeTagsWithTime(timeMap) {
        if (!isAvailable) {
          LS.set('excludeTagsWithTime', timeMap);
          return true;
        }
        
        const count = timeMap && typeof timeMap === 'object' ? Object.keys(timeMap).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          LS.set('excludeTagsWithTime', timeMap);
          return true;
        }
        
        try {
          return await setItem('excludeTagsWithTime', timeMap);
        } catch (e) {
          isAvailable = false;
          LS.set('excludeTagsWithTime', timeMap);
          return true;
        }
      },

      // 过滤作品
      async getExcludeWorksTags() {
        if (!isAvailable) {
          return LS.get('excludeWorksTags', '') || '';
        }
        
        const lsVal = LS.get('excludeWorksTags', '');
        const count = lsVal ? lsVal.split(',').filter(Boolean).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          return lsVal || '';
        }
        
        try {
          const val = await getItem('excludeWorksTags');
          return val || '';
        } catch (e) {
          isAvailable = false;
          return LS.get('excludeWorksTags', '') || '';
        }
      },

      async saveExcludeWorksTags(tagsStr) {
        if (!isAvailable) {
          LS.set('excludeWorksTags', tagsStr);
          return true;
        }
        
        const count = tagsStr ? tagsStr.split(',').filter(Boolean).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          LS.set('excludeWorksTags', tagsStr);
          return true;
        }
        
        return await setItem('excludeWorksTags', tagsStr);
      },

      async getExcludeWorksWithTime() {
        if (!isAvailable) {
          return LS.get('excludeWorksWithTime', {}) || {};
        }
        
        const lsVal = LS.get('excludeWorksWithTime', {});
        const count = lsVal && typeof lsVal === 'object' ? Object.keys(lsVal).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          return lsVal || {};
        }
        
        try {
          const val = await getItem('excludeWorksWithTime');
          return val || {};
        } catch (e) {
          isAvailable = false;
          // 降级：返回 localStorage
          return LS.get('excludeWorksWithTime', {}) || {};
        }
      },

      async saveExcludeWorksWithTime(timeMap) {
        // 如果 IndexedDB 不可用，保存到 localStorage
        if (!isAvailable) {
          LS.set('excludeWorksWithTime', timeMap);
          return true;
        }
        
        const count = timeMap && typeof timeMap === 'object' ? Object.keys(timeMap).length : 0;
        
        if (count < FILTER_THRESHOLD) {
          LS.set('excludeWorksWithTime', timeMap);
          return true;
        }
        
        try {
          return await setItem('excludeWorksWithTime', timeMap);
        } catch (e) {
          isAvailable = false;
          LS.set('excludeWorksWithTime', timeMap);
          return true;
        }
      },

      async migrateFromLocalStorage() {
        try {
          if (await getItem('migrationCompleted')) {
            return false;
          }

          let migrated = false;
          
          const oldTags = LS.get('tagTranslations', {});
          const tagCount = oldTags && typeof oldTags === 'object' ? Object.keys(oldTags).length : 0;
          
          if (tagCount >= INDEXEDDB_THRESHOLD && tagCount > 0) {
            await this.saveTags(oldTags);
            console.log('[PTE] 已将 localStorage 标签迁移到 IndexedDB，共', tagCount, '条');
            migrated = true;
          } else if (tagCount > 0) {
            console.log('[PTE] 标签数（' + tagCount + '条）未达到迁移阈值（' + INDEXEDDB_THRESHOLD + '），保持使用 localStorage');
          }

          const oldExcludeTags = LS.get('excludeTags', '');
          if (oldExcludeTags) {
            await this.saveExcludeTags(oldExcludeTags);
            migrated = true;
          }

          const oldExcludeTagsTime = LS.get('excludeTagsWithTime', {});
          if (oldExcludeTagsTime && Object.keys(oldExcludeTagsTime).length > 0) {
            await this.saveExcludeTagsWithTime(oldExcludeTagsTime);
            migrated = true;
          }

          // 迁移过滤作品
          const oldExcludeWorks = LS.get('excludeWorksTags', '');
          if (oldExcludeWorks) {
            await this.saveExcludeWorksTags(oldExcludeWorks);
            migrated = true;
          }

          const oldExcludeWorksTime = LS.get('excludeWorksWithTime', {});
          if (oldExcludeWorksTime && Object.keys(oldExcludeWorksTime).length > 0) {
            await this.saveExcludeWorksWithTime(oldExcludeWorksTime);
            migrated = true;
          }

          if (migrated) {
            await setItem('migrationCompleted', true);
          }

          return migrated;
        } catch (e) {
          isAvailable = false;
          console.warn('[PTE] 数据迁移失败，IndexedDB 可能已损坏:', e.message);
          return false;
        }
      },

      // 清除 IndexedDB
      async clearCorruptedDB() {
        try {
          if (db) {
            db.close();
            db = null;
          }
          indexedDB.deleteDatabase(DB_NAME);
          isAvailable = true;
          console.log('[PTE] IndexedDB 已清除并重新初始化');
          return true;
        } catch (e) {
          console.warn('[PTE] 清除 IndexedDB 失败:', e.message);
          return false;
        }
      },

      // 导出所有数据
      async exportAllData() {
        try {
          const tags = await this.getAllTags();
          const excludeTags = await this.getExcludeTags();
          const excludeTagsWithTime = await this.getExcludeTagsWithTime();
          const excludeWorksTags = await this.getExcludeWorksTags();
          const excludeWorksWithTime = await this.getExcludeWorksWithTime();

          return {
            version: '1.4',
            exportTime: new Date().toISOString(),
            tags: tags || {},
            excludeTags: excludeTags || '',
            excludeTagsWithTime: excludeTagsWithTime || {},
            excludeWorksTags: excludeWorksTags || '',
            excludeWorksWithTime: excludeWorksWithTime || {},
            stats: {
              tagsCount: tags ? Object.keys(tags).length : 0,
              excludeTagsCount: excludeTags ? excludeTags.split(',').filter(Boolean).length : 0,
              excludeWorksCount: excludeWorksTags ? excludeWorksTags.split(',').filter(Boolean).length : 0
            }
          };
        } catch (e) {
          isAvailable = false;
          console.warn('[PTE] 导出数据失败，尝试从 localStorage 恢复:', e.message);
          try {
            const tags = LS.get('tagTranslations', {});
            const excludeTags = LS.get('excludeTags', '');
            const excludeTagsWithTime = LS.get('excludeTagsWithTime', {});
            const excludeWorksTags = LS.get('excludeWorksTags', '');
            const excludeWorksWithTime = LS.get('excludeWorksWithTime', {});
            
            return {
              version: '1.4',
              exportTime: new Date().toISOString(),
              tags: tags || {},
              excludeTags: excludeTags || '',
              excludeTagsWithTime: excludeTagsWithTime || {},
              excludeWorksTags: excludeWorksTags || '',
              excludeWorksWithTime: excludeWorksWithTime || {},
              stats: {
                tagsCount: Object.keys(tags || {}).length,
                excludeTagsCount: (excludeTags || '').split(',').filter(Boolean).length,
                excludeWorksCount: (excludeWorksTags || '').split(',').filter(Boolean).length,
                recoveryNote: '数据由 localStorage 恢复'
              }
            };
          } catch (fallbackErr) {
            console.error('[PTE] 从 localStorage 恢复数据也失败:', fallbackErr.message);
            return null;
          }
        }
      },

      // 导入所有数据
      async importAllData(data) {
        try {
          if (!data || typeof data !== 'object') return false;

          if (data.tags && typeof data.tags === 'object') {
            await this.saveTags(data.tags);
          }

          if (data.excludeTags) {
            await this.saveExcludeTags(data.excludeTags);
          }
          if (data.excludeTagsWithTime) {
            await this.saveExcludeTagsWithTime(data.excludeTagsWithTime);
          }

          if (data.excludeWorksTags) {
            await this.saveExcludeWorksTags(data.excludeWorksTags);
          }
          if (data.excludeWorksWithTime) {
            await this.saveExcludeWorksWithTime(data.excludeWorksWithTime);
          }

          return true;
        } catch (e) {
          isAvailable = false;
          console.warn('[PTE] 导入数据失败，尝试降级处理:', e.message);
          try {
            if (data.tags && typeof data.tags === 'object') {
              LS.set('tagTranslations', data.tags);
            }
            if (data.excludeTags) {
              LS.set('excludeTags', data.excludeTags);
            }
            if (data.excludeTagsWithTime) {
              LS.set('excludeTagsWithTime', data.excludeTagsWithTime);
            }
            if (data.excludeWorksTags) {
              LS.set('excludeWorksTags', data.excludeWorksTags);
            }
            if (data.excludeWorksWithTime) {
              LS.set('excludeWorksWithTime', data.excludeWorksWithTime);
            }
            console.log('[PTE] 数据已降级到 localStorage 保存');
            return true;
          } catch (fallbackErr) {
            console.error('[PTE] 降级保存也失败:', fallbackErr.message);
            return false;
          }
        }
      }
    };
  })();

  // 已下载作品记录（用于复选框高亮）
  const DOWNLOADED_KEY = 'downloadedIllusts';
  const downloadedMap = (() => {
    const raw = LS.get(DOWNLOADED_KEY, {});
    if (typeof raw === 'string') try { return JSON.parse(raw) || {}; } catch { return {}; }
    return (raw && typeof raw === 'object') ? raw : {};
  })();

  function saveDownloadedMap() {
    try { LS.set(DOWNLOADED_KEY, downloadedMap); } catch { }
  }

  function recordDownloadedId(id) {
    if (!id) return;
    downloadedMap[id] = Date.now();
    const ids = Object.keys(downloadedMap);
    if (ids.length > 500) ids.sort((a, b) => (downloadedMap[b] || 0) - (downloadedMap[a] || 0)).slice(500).forEach(oldId => { delete downloadedMap[oldId]; });
    saveDownloadedMap();
  }

  // 全局 Hook LS.set 防止重复劫持（修复递归风险）
  (function initLSHook() {
    if (LS._hooked) return;
    const _originalLSset = LS.set.bind(LS);
    LS.set = (k, v) => {
      _originalLSset(k, v);
      if (k === 'useUploadAsAddDate') {
        window.dispatchEvent(new CustomEvent('pte-setting-change', { detail: { key: k, value: v } }));
      }
    };
    LS._hooked = true;
  })();

  /******************** 动图格式配置 ********************/
  function getUgoiraFormat() {
    return LS.get('ugoiraFormat', 'gif');
  }
  function toggleUgoiraFormat() {
    const current = getUgoiraFormat();
    const formats = ['gif', 'apng', 'webm'];
    const nextIdx = (formats.indexOf(current) + 1) % formats.length;
    const newFormat = formats[nextIdx];
    LS.set('ugoiraFormat', newFormat);
    showToast(`动图格式已切换为: ${newFormat.toUpperCase()}`);
  }

  /******************** 描述保存配置 ********************/
  function getSaveDescription() {
    return LS.get('saveDescription', true);
  }
  function toggleSaveDescription() {
    const current = getSaveDescription();
    LS.set('saveDescription', !current);
    showToast(`作品描述保存已${!current ? '开启 ✅' : '关闭 ❌'}`);
  }

  /******************** 延迟配置 ********************/
  function getTagExtractDelay() {
    return LS.get('tagExtractDelay', 300);
  }
  function setTagExtractDelay(ms) {
    LS.set('tagExtractDelay', Math.max(100, ms));
  }
  function getDownloadDelay() {
    const min = LS.get('downloadDelayMin', 800);
    const max = LS.get('downloadDelayMax', 1200);
    return { min: Math.max(100, min), max: Math.max(min + 100, max) };
  }
  function setDownloadDelay(minMs, maxMs) {
    LS.set('downloadDelayMin', Math.max(100, minMs));
    LS.set('downloadDelayMax', Math.max(minMs + 100, maxMs));
  }

  const sanitize = s => (s || '').replace(/[\r\n]+/g, ' ').replace(/[\/\\:*?"<>|]/g, '_').trim();
  const lower = s => (s || '').toLowerCase();

  // 拼音匹配函数
  const pinyinMatch = (text, query) => {
    if (!query) return true;
    const queryLower = query.toLowerCase();

    // 直接匹配中文
    if (text.toLowerCase().includes(queryLower)) {
      return true;
    }

    // pinyin-pro 库匹配
    try {
      if (typeof window !== 'undefined') {
        let pinyinLib = null;
        if (window.pinyinPro && typeof window.pinyinPro.pinyin === 'function') {
          pinyinLib = window.pinyinPro;
        } else if (window.pinyin && typeof window.pinyin.pinyin === 'function') {
          pinyinLib = window.pinyin;
        }

        if (pinyinLib) {
          const pinyinArray = pinyinLib.pinyin(text, {
            toneType: 'none',
            type: 'array'
          });

          if (Array.isArray(pinyinArray) && pinyinArray.length > 0) {
            let fullPinyin = '';
            let firstLetters = '';

            for (const p of pinyinArray) {
              if (p && p.length > 0) {
                fullPinyin += p;
                firstLetters += p[0];
              }
            }

            if (fullPinyin.includes(queryLower) || firstLetters.includes(queryLower)) {
              return true;
            }
          }
        }
      }
    } catch (e) {
      // 错误时返回 false
    }

    return false;
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 规范化标签键（去首尾引号/特殊引号，trim）
  function normalizeKey(k) {
    if (k == null) return '';
    try {
      let s = String(k).trim();
      s = s.replace(/^['"\u2018\u2019\u201C\u201D]+|['"\u2018\u2019\u201C\u201D]+$/g, '');
      return s;
    } catch (e) { return String(k); }
  }

  /******************** 从已保存列表查找翻译 ********************/
  function findTranslationFromSaved(text) {
    const savedTranslations = LS.get('tagTranslations', {});
    if (!text) return null;
    const norm = normalizeKey(text);
    // 1) 直接按规范化键查找
    if (savedTranslations && Object.prototype.hasOwnProperty.call(savedTranslations, norm)) {
      const v = savedTranslations[norm];
      return typeof v === 'string' ? v : v.translation;
    }
    // 2) 再尝试不区分大小写的匹配（兼容旧数据）
    const lowerText = lower(text);
    for (const [original, value] of Object.entries(savedTranslations)) {
      if (lower(original) === lowerText) {
        return typeof value === 'string' ? value : value.translation;
      }
    }
    return null;
  }

  /******************** 通用翻译函数 ********************/
  async function translateWithQwen(text, targetLang = 'zh') {
    // 优先从已保存列表查找翻译
    const savedTranslation = findTranslationFromSaved(text);
    if (savedTranslation) {
      debugLog('TRANSLATE', '使用已保存翻译', { text, translation: savedTranslation });
      return savedTranslation;
    }

    // 获取翻译配置
    const config = getTranslateConfig();
    const provider = TRANSLATE_PROVIDERS[config.provider];
    
    // 如果选择"Pixiv官方翻译"，从页面或API获取官方翻译
    if (config.provider === 'none') {
      try {
        // 方案1：尝试从页面DOM中查找翻译（最快）
        const pageTranslation = document.querySelector(`a.gtm-new-work-translate-tag-event-click[href*="${encodeURIComponent(text)}"]`)?.textContent?.trim();
        if (pageTranslation && pageTranslation !== text) {
          debugLog('TRANSLATE', '使用Pixiv页面中文翻译', { text, translation: pageTranslation });
          return pageTranslation;
        }

        // 方案2：从API获取标签信息
        const illustId = location.pathname.match(/\/illust\/(\d+)/)?.[1];
        if (illustId) {
          const currentTags = await getJSON(`https://www.pixiv.net/ajax/illust/${illustId}`);
          if (currentTags?.body?.tags?.tags) {
            const tagData = currentTags.body.tags.tags.find(t => t?.tag === text);
            // 尝试各种可能的翻译字段
            if (tagData?.translation?.zh) {
              debugLog('TRANSLATE', '使用Pixiv API中文翻译(zh)', { text, translation: tagData.translation.zh });
              return tagData.translation.zh;
            } else if (tagData?.romanized) {
              debugLog('TRANSLATE', '使用Pixiv API罗马字', { text, translation: tagData.romanized });
              return tagData.romanized;
            } else if (tagData?.translation?.en) {
              debugLog('TRANSLATE', '使用Pixiv API英文翻译', { text, translation: tagData.translation.en });
              return tagData.translation.en;
            }
          }
        }
      } catch (e) {
        debugLog('TRANSLATE', 'Pixiv官方翻译获取失败', { text, error: e.message });
      }
      // 如果没有找到官方翻译，返回原文
      return text;
    }
    
    // 如果未配置provider，返回原文
    if (!provider) {
      return text;
    }
    
    // 需要 API Key 的服务检查
    if (['groq', 'openai', 'deepseek', 'gemini', 'custom'].includes(config.provider) && !config.apiKey) {
      console.warn('[翻译] 未配置 API Key');
      return text;
    }

    try {
      const systemPrompt = targetLang === 'zh'
        ? '你是专业的日语翻译，专门翻译动漫、游戏相关标签。要求：1.只输出简体中文翻译结果，不要任何解释或前缀；2.日文角色名要翻译成通用中文译名（如チルノ→琪露诺）；3.结果必须是纯中文，不保留日文；4.所有括号必须使用中文括号（），不使用()或其他异形括号。'
        : 'You are a professional translator. Only output the translation result, nothing else. Use normal parentheses () for any brackets.';
      
      const userPrompt = targetLang === 'zh'
        ? `翻译成中文：${text}`
        : `Translate to ${targetLang}: ${text}`;

      // Gemini 使用不同的 API 格式
      if (config.provider === 'gemini') {
        return await translateWithGemini(text, config.apiKey, provider.model, systemPrompt, userPrompt);
      }

      // OpenAI 兼容格式（Ollama, Groq, OpenAI, DeepSeek, Custom）
      const url = config.provider === 'custom' ? config.customUrl : provider.url;
      const model = config.provider === 'custom' ? config.customModel : provider.model;
      
      const headers = { 'Content-Type': 'application/json' };
      if (config.provider !== 'ollama') {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          headers: headers,
          data: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 200,
            temperature: 0.1,
            stream: false
          }),
          timeout: 30000,
          onload: (res) => {
            try {
              if (res.status === 200) {
                const data = JSON.parse(res.responseText);
                const result = data.choices?.[0]?.message?.content?.trim() || '';
                if (result && result.length > 0) {
                  resolve(result);
                  return;
                }
              } else {
                console.warn('[翻译] API 错误:', res.status, res.responseText);
              }
              resolve(text);
            } catch (e) {
              console.warn('[翻译] 响应解析失败:', e);
              resolve(text);
            }
          },
          onerror: (e) => {
            console.warn('[翻译] 连接失败:', e);
            resolve(text);
          },
          ontimeout: () => {
            console.warn('[翻译] 请求超时');
            resolve(text);
          }
        });
      });
    } catch (e) {
      console.warn('[翻译] 错误:', e);
      return text;
    }
  }

  // Gemini API 单独处理（格式不同）
  async function translateWithGemini(text, apiKey, model, systemPrompt, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
        }),
        timeout: 30000,
        onload: (res) => {
          try {
            if (res.status === 200) {
              const data = JSON.parse(res.responseText);
              const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
              if (result) { resolve(result); return; }
            }
            resolve(text);
          } catch { resolve(text); }
        },
        onerror: () => resolve(text),
        ontimeout: () => resolve(text)
      });
    });
  }

  /******************** 运行参数 ********************/
  const CFG = {
    filters: { bookmarkMin: 0, excludeTags: LS.get('excludeTags', ''), pageRange: '' },
    ui: { x: 24, y: 24, margin: 16 },
    feature: { useUploadAsAddDate: !!LS.get('useUploadAsAddDate', false), translateTags: !!LS.get('translateTags', false) },
    mode: LS.get('mode', 'eagle')
  };

  /******************** Eagle API ********************/
  
  // 请求队列管理器 - 控制并发数，防止过多同时请求
  const RequestQueue = (() => {
    let running = 0;
    const queue = [];
    
    const process = async () => {
      if (running >= MAX_CONCURRENT_REQUESTS || queue.length === 0) return;
      
      running++;
      const { fn, resolve, reject } = queue.shift();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        running--;
        process(); // 继续处理队列中的下一个请求
      }
    };
    
    return {
      async run(fn) {
        return new Promise((resolve, reject) => {
          queue.push({ fn, resolve, reject });
          process();
        });
      }
    };
  })();
  
  function xhr({ url, method = 'GET', data = null, timeout = 30000, raw = false }) {
    return RequestQueue.run(() => new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method,
        data: data ? (raw ? data : JSON.stringify(data)) : null,
        headers: { 'Content-Type': 'application/json' },
        timeout,
        onload: (res) => { try { resolve(JSON.parse(res.responseText || '{}')); } catch { resolve({}); } },
        onerror: () => reject(new Error('Eagle连接失败')),
        ontimeout: () => reject(new Error('Eagle请求超时'))
      });
    }));
  }

  async function listFolders() { const r = await xhr({ url: EAGLE.base + EAGLE.api.list }); return (r && r.data) || r.folders || []; }
  async function createFolder(name, parentId) {
    const payload = parentId ? { folderName: name, parent: parentId } : { folderName: name, isRoot: true };
    const r = await xhr({ url: EAGLE.base + EAGLE.api.create, method: 'POST', data: payload });
    return r?.data?.id || r?.id || r?.folderId;
  }
  async function updateFolderDesc(id, desc) { await xhr({ url: EAGLE.base + EAGLE.api.update, method: 'POST', data: { folderId: id, newDescription: desc, description: desc } }); }
  function flattenFolders(tree) {
    const out = []; const st = [...(Array.isArray(tree) ? tree : [tree])].filter(Boolean);
    while (st.length) { const f = st.shift(); out.push(f); if (f.children?.length) st.push(...f.children); }
    return out;
  }
  async function addToEagle(items, folderId) {
    const payload = { items, folderId };
    const json = JSON.stringify(payload);
    return await xhr({ url: EAGLE.base + EAGLE.api.add, method: 'POST', data: json, raw: true });
  }
  /******************** Toast 提示 ********************/
  function showToast(message, duration = 3000) {
    console.log('[PTE]', message);
    const id = 'pte-toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = id;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 2147483648,
      maxWidth: '80vw',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
      animation: 'pte-toast-in 0.3s ease-out',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    });
    toast.textContent = message;


    if (!document.getElementById('pte-toast-style')) {
      const style = document.createElement('style');
      style.id = 'pte-toast-style';
      style.textContent = `
        @keyframes pte-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pte-toast-out {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'pte-toast-out 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function showConfirm(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #fff; border: 2px solid #409eff; border-radius: 8px;
      padding: 20px; z-index: 2147483648;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      min-width: 280px; max-width: 400px;
    `;

    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.6;';
    messageEl.textContent = message;
    dialog.appendChild(messageEl);

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = `
      padding: 8px 16px; border: 1px solid #d9d9d9; border-radius: 6px;
      background: #f5f5f5; color: #666; cursor: pointer; font-size: 12px;
      font-weight: 600;
    `;
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      mask.remove();
      dialog.remove();
      onCancel && onCancel();
    };
    btnContainer.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = `
      padding: 8px 16px; border: none; border-radius: 6px;
      background: #409eff; color: #fff; cursor: pointer; font-size: 12px;
      font-weight: 600;
    `;
    confirmBtn.textContent = '确定';
    confirmBtn.onclick = () => {
      mask.remove();
      dialog.remove();
      onConfirm && onConfirm();
    };
    btnContainer.appendChild(confirmBtn);

    dialog.appendChild(btnContainer);

    const mask = document.createElement('div');
    mask.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: transparent; z-index: 2147483647; pointer-events: none;';

    document.body.appendChild(mask);
    document.body.appendChild(dialog);

    confirmBtn.focus();
  }

  /******************** 页面工具 & Fetch 包装 ********************/
  const aborters = new Set();
  function cancelInflight() { aborters.forEach(a => { try { a.abort(); } catch { } }); aborters.clear(); }

  async function fetchUrl(url, options = {}) {
    const { type = 'json', credentials = 'include', signal = null } = options;
    const ctrl = signal ? null : new AbortController();
    const sig = signal || ctrl?.signal;
    if (ctrl) aborters.add(ctrl);
    try {
      const res = await fetch(url, { credentials, signal: sig });
      return type === 'json' ? await res.json() : type === 'text' ? await res.text() : type === 'arrayBuffer' ? await res.arrayBuffer() : res;
    } finally { if (ctrl) aborters.delete(ctrl); }
  }
  const getJSON = url => fetchUrl(url, { type: 'json' });
  const getTEXT = url => fetchUrl(url, { type: 'text' });

  const isUser = () => /\/users\/\d+/.test(location.pathname);
  const isArtwork = () => /\/artworks\/\d+/.test(location.pathname);

  const allIllustIds = async (uid) => {
    const r = await getJSON(`https://www.pixiv.net/ajax/user/${uid}/profile/all`);
    const ill = Object.keys(r.body?.illusts || {});
    const man = Object.keys(r.body?.manga || {});
    return [...new Set([...ill, ...man])];
  };
  function ogTitle(html) { const m = html.match(/<meta[^>]+property=['"]og:title['"][^>]*content=['"]([^'"]+)['\"]/i); return m ? sanitize(m[1]) : ''; }
  async function illustInfoAndPages(id) {
    const tryFetch = async () => {
      const info = await getJSON(`https://www.pixiv.net/ajax/illust/${id}`);
      const pages = await getJSON(`https://www.pixiv.net/ajax/illust/${id}/pages`);
      const b = info.body || {};
      const pageUrls = (pages.body || []).map(p => p.urls?.original).filter(Boolean);
      const tagList = Array.isArray(b.tags?.tags) ? b.tags.tags : [];
      const tags = tagList.map(t => t?.tag).filter(Boolean);
      let description = b.description || '';
      if (description) {
        description = description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
      }
      return {
        title: sanitize(b.title || `pixiv_${id}`),
        tags, pageUrls,
        userId: b.userId,
        userName: sanitize(b.userName || b.userAccount || ''),
        illustType: b.illustType,
        bookmarkCount: b.bookmarkCount || 0,
        uploadDate: b.uploadDate,
        description: description
      };
    };

    let meta = await tryFetch();

    if ((!meta.tags?.length) || /^pixiv_\d+$/.test(meta.title) || !meta.userId || !meta.userName) {
      const baseDelay = getTagExtractDelay();
      for (let i = 0; i < 2; i++) {
        await sleep(baseDelay + i * baseDelay);
        const nx = await tryFetch();
        if ((!meta.tags?.length) && nx.tags?.length) meta.tags = nx.tags;
        if (/^pixiv_\d+$/.test(meta.title) && !/^pixiv_\d+$/.test(nx.title)) meta.title = nx.title;
        if (!meta.uploadDate && nx.uploadDate) meta.uploadDate = nx.uploadDate;
        if (!meta.userId && nx.userId) meta.userId = nx.userId;
        if (!meta.userName && nx.userName) meta.userName = nx.userName;
        if (!meta.description && nx.description) meta.description = nx.description;
      }
      if (/^pixiv_\d+$/.test(meta.title)) {
        try {
          const html = await getTEXT(`https://www.pixiv.net/artworks/${id}`);
          const og = ogTitle(html);
          if (og) meta.title = og;
        } catch { }
      }
    }

    if (!meta.tags?.length) {
      meta.tags = meta.userName ? [meta.userName] : [];
    } else {
      meta.tags = Array.from(new Set([meta.userName, ...meta.tags].filter(Boolean)));
    }
    return meta;
  }

  async function ugoiraMeta(id) { return await getJSON(`https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`); }
  function parseRange(str) {
    if (!str) return null; const s = str.trim(); if (!s) return null;
    const a = s.match(/^(\d+)-(\d+)$/); if (a) { const x = +a[1], y = +a[2]; if (x > 0 && y >= x) return [x, y]; }
    const b = s.match(/^(\d+)$/); if (b) { const n = +b[1]; if (n > 0) return [n, n]; } return null;
  }

  /******************** Welcome Modal ********************/
  let PTE_VER = '';

  try {
    if (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) {
      PTE_VER = GM_info.script.version;
    } else if (document.currentScript && document.currentScript.textContent) {
      const match = /@version\s+([0-9.]+)/i.exec(document.currentScript.textContent);
      if (match) PTE_VER = match[1];
    }
  } catch (e) {
  }

  function createWelcomeModal(updatedAtTs) {
    if (document.getElementById('pteWelcome')) return;

    var mask = document.createElement('div');
    mask.id = 'pteWelcome';
    Object.assign(mask.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,.35)',
      backdropFilter: 'blur(2px)',
      zIndex: 2147483647,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    var box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(560px,92vw)',
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0 12px 40px rgba(0,0,0,.18)',
      padding: '16px 18px',
      fontSize: '13px',
      color: '#444',
      lineHeight: '1.6',
      maxHeight: '80vh', overflow: 'auto'
    });
    box.innerHTML = ''
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">'
      + '<div style="font-size:18px;font-weight:700;color:#1f6fff;">PTE 已更新 ✅</div>'
      + '<span style="margin-left:auto;color:#999;font-size:12px">v' + PTE_VER + '</span>'
      + '</div>'
      + '<div style="color:#999;font-size:12px;margin-bottom:8px;">版本号：v' + PTE_VER + '</div>'
      + '<div>'
      + '<p>右上角工具条：<b style="color:#409eff">E（蓝）</b> = Eagle 模式，<b style="color:#f1a72e">D（橙）</b> = 本地模式。</p>'
      + '<p>详情页六键：<code>此作</code> / <code>本页</code> / <code>仅勾选</code> / <code>全选</code> / <code>全不选</code> / <code>下一页</code>。</p><p>顶部工具条新增并固定"🕒 投稿时间→添加日期"开关（点击切换；关闭时灰度显示）。</p>'
      + '<p>第二页：🔁 反选 · 📁 选择下载目录（左下） · 📜 公告 · ⬅️ 上一页（右下）。</p>'
      + '<p><b style="color:#ff4d4f">大动图说明：</b> 当 ugoira→GIF 体积过大（约 &gt;40MB）时，脚本会自动从 Eagle 模式切换为"保存到本地"模式，并保存到下载目录下的 <code>Pixiv/作者名_作者ID/作品ID.gif</code>，以避免浏览器 / 油猴在导入 Eagle 时因消息过长而卡住。</p>'
      + '<p style="color:#666">小技巧：点击绿灯检查 Eagle；点"➖"可缩小为悬浮圆点。</p>'
      + '<p style="margin-top:6px"><b>没看到弹窗/工具条？</b> 如果脚本已启动但首次没看到，UI 可能在浏览器窗口右侧；请尝试将浏览器窗口<b>拉宽</b>即可看见。</p>'
      + '<p><b>连续多选：</b> 在列表/缩略图页，先点击左侧的勾选框选中一项，然后按住 <kbd>Shift</kbd> 再点击另一项，<b>两者之间的范围</b>会被一次性选中。</p>'
      + '</div>'
      + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">'
      + '<button id="pxeWelcomeOk" style="padding:6px 14px;border:none;border-radius:8px;background:#409eff;color:#fff;cursor:pointer;font-weight:600">我知道了</button>'
      + '</div>';
    mask.appendChild(box);
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
    var ok = box.querySelector('#pxeWelcomeOk');
    if (ok) ok.addEventListener('click', function () { mask.remove(); });
  }

  /******************** 操作历史记录函数 ********************/
  function addOperationLog(action, details) {
    try {
      let logs = LS.get('operationLogs', []);
      if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch { logs = []; }
      if (!Array.isArray(logs)) logs = [];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      logs.push({ action, details, timestamp: timeStr, date: now.toISOString().split('T')[0] });
      debugLog('LOG', '添加操作日志', { action, details, timestamp: timeStr });
      if (logs.length > 20) logs = logs.slice(-20);
      LS.set('operationLogs', logs);
      const historyDiv = document.getElementById('pteOperationHistory');
      if (historyDiv) updateOperationHistory();
    } catch(e) { }
  }

  var savedTags = {};
  var tagManagerModalUpdateCallback = null;
  var isTagLibraryInitialized = false;
  
  (async () => {
    try {
      const migrated = await TagDB.migrateFromLocalStorage();
      savedTags = await TagDB.getAllTags();
      isTagLibraryInitialized = true;
      
      if (Object.keys(savedTags).length > 0) {
        if (migrated) showToast?.(`✅ 标签库已升级为大容量存储，共 ${Object.keys(savedTags).length} 条标签`);
        console.log('[PTE] 已加载标签库，共', Object.keys(savedTags).length, '条');
        if (typeof tagManagerModalUpdateCallback === 'function') {
          tagManagerModalUpdateCallback();
        }
      }
      const autoBackupMode = getAutoBackupMode();
      if (autoBackupMode && autoBackupMode !== 'off') {
        startAutoBackup(autoBackupMode);
      }
    } catch (e) {
      console.warn('[PTE] 标签库初始化失败:', e);
      try {
        const isIDBAvailable = await new Promise((resolve) => {
          const test = indexedDB.open('__PTE_HEALTHCHECK__');
          test.onsuccess = () => {
            test.result.close();
            indexedDB.deleteDatabase('__PTE_HEALTHCHECK__');
            resolve(true);
          };
          test.onerror = () => resolve(false);
        });
        if (!isIDBAvailable) {
          showToast?.('⚠️ IndexedDB 不可用，已自动降级到 localStorage，部分功能可能受限');
          console.warn('[PTE] IndexedDB 不可用，已降级到 localStorage');
          setTimeout(() => {
            const repairBtn = document.querySelector('#pteRepairDB');
            if (repairBtn) repairBtn.style.display = 'inline-block';
          }, 1000);
        }
      } catch { }
      savedTags = {};
    }
  })();

  /******************** 备份管理 ********************/
  let autoBackupTimer = null;
  
  const BackupManager = {
    saveBackup: (data) => {
      try {
        const tagsCount = data.stats?.tagsCount || 0;
        if (tagsCount === 0) {
          console.log('[PTE] 标签为空，跳过保存备份');
          return false;
        }
        
        const backups = LS.get('pteBackups', []);
        if (!Array.isArray(backups)) backups = [];
        
        const backup = {
          timestamp: Date.now(),
          date: new Date().toLocaleString('zh-CN'),
          stats: data.stats || {},
          tags: data.tags || {},
          excludeTags: data.excludeTags || '',
          excludeTagsWithTime: data.excludeTagsWithTime || {},
          excludeWorksTags: data.excludeWorksTags || '',
          excludeWorksWithTime: data.excludeWorksWithTime || {},
          isAuto: true
        };
        
        backups.unshift(backup);
        if (backups.length > 10) backups.pop();
        
        LS.set('pteBackups', backups);
        return true;
      } catch (e) {
        console.warn('[PTE] 保存备份信息失败:', e);
        return false;
      }
    },

    getBackups: () => {
      try {
        const backups = LS.get('pteBackups', []);
        return Array.isArray(backups) ? backups : [];
      } catch (e) {
        return [];
      }
    },

    async exportAndBackup() {
      try {
        const data = await TagDB.exportAllData();
        if (data) {
          BackupManager.saveBackup(data);
          return data;
        }
      } catch (e) {
        console.warn('[PTE] 导出并备份数据失败:', e);
      }
      return null;
    },

    async autoBackup() {
      try {
        const data = await TagDB.exportAllData();
        if (data) {
          BackupManager.saveBackup(data);
          console.log('[PTE] 自动备份成功，已保留最近 10 个版本');
          return true;
        }
      } catch (e) {
        console.warn('[PTE] 自动备份失败:', e.message);
      }
      return false;
    }
  };

  function startAutoBackup(mode) {
    if (autoBackupTimer) clearInterval(autoBackupTimer);
    
    let interval = 0;
    if (mode === 'daily') {
      interval = 24 * 60 * 60 * 1000;
    } else if (mode === 'weekly') {
      interval = 7 * 24 * 60 * 60 * 1000;
    } else if (mode === 'monthly') {
      interval = 30 * 24 * 60 * 60 * 1000;
    } else {
      return;
    }
    BackupManager.autoBackup();
    autoBackupTimer = setInterval(() => {
      BackupManager.autoBackup();
    }, interval);
    
    console.log('[PTE] 自动备份已启动，间隔:', mode);
  }

  function stopAutoBackup() {
    if (autoBackupTimer) {
      clearInterval(autoBackupTimer);
      autoBackupTimer = null;
      console.log('[PTE] 自动备份已关闭');
    }
  }

  const getAutoBackupMode = () => {
    return LS.get('autoBackup', 'off');
  }

  async function saveTagsToStore() {
    try {
      await TagDB.saveTags(savedTags);
    } catch (e) {
      console.warn('[PTE] 保存标签失败:', e);
    }
  }

  let saveTagsDebounceTimer = null;
  
  function saveTags(newTags = null) {
    if (newTags) Object.assign(savedTags, newTags);
    if (saveTagsDebounceTimer) clearTimeout(saveTagsDebounceTimer);
    saveTagsDebounceTimer = setTimeout(() => {
      saveTagsToStore();
      saveTagsDebounceTimer = null;
    }, 500);
  }

  let saveExcludeFiltersDebounceTimer = null;
  
  async function saveExcludeFilters(type = 'tag') {
    try {
      // 清除之前的定时器
      if (saveExcludeFiltersDebounceTimer) clearTimeout(saveExcludeFiltersDebounceTimer);
      
      // 500ms 后执行保存（防止频繁写入）
      saveExcludeFiltersDebounceTimer = setTimeout(async () => {
        if (type === 'tag') {
          await TagDB.saveExcludeTags(Array.from(excludeTagsSet).join(','));
          await TagDB.saveExcludeTagsWithTime(excludeTagsWithTime);
        } else {
          await TagDB.saveExcludeWorksTags(Array.from(excludeWorksSet).join(','));
          await TagDB.saveExcludeWorksWithTime(excludeWorksWithTime);
        }
        saveExcludeFiltersDebounceTimer = null;
      }, 500);
    } catch (e) {
      console.warn('[PTE] 保存过滤数据失败:', e);
    }
  }

  function updateOperationHistory() {
    try {
      let logs = LS.get('operationLogs', []);
      if (typeof logs === 'string') try { logs = JSON.parse(logs); } catch { logs = []; }
      const historyDiv = document.getElementById('pteOperationHistory');
      if (!historyDiv || !Array.isArray(logs) || logs.length === 0) { historyDiv && (historyDiv.innerHTML = '<div style="color:#999;">暂无操作记录</div>'); return; }
      let html = logs.slice(-2).reverse().map(log => `<div style="font-size:11px;color:#333;">${log.action}${log.details ? ' - ' + log.details : ''} <span style="color:#999;margin-left:8px;">${log.timestamp}</span></div>`).join('');
      historyDiv.innerHTML = html;
    } catch(e) { }
  }

  /******************** 统一标签管理弹窗 ********************/

  // Debug 日志函数
  const debugLog = (category, message, data = null) => {
    const settings = LS.get('tagManagerSettings', { debugMode: false });
    if (settings.debugMode) console.log(`[${new Date().toLocaleTimeString('zh-CN')}] [PTE-${category}] ${message}`, data || '');
  };


  async function createSettingsModal() {
    if (document.getElementById('pteSettingsModal')) return;

    const mask = document.createElement('div');
    mask.id = 'pteSettingsModal';
    Object.assign(mask.style, {
      position: 'fixed', inset: '0',
      background: 'transparent',
      backdropFilter: 'none',
      zIndex: 2147483647,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      pointerEvents: 'auto'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(550px,90vw)',
      borderRadius: '12px',
      background: '#fff',
      boxShadow: '0 12px 40px rgba(0,0,0,.25)',
      padding: '24px',
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6',
      position: 'relative',
      pointerEvents: 'auto'
    });

    const currentFormat = getUgoiraFormat();
    const currentSaveDesc = getSaveDescription();

    box.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:2px solid #409eff;padding-bottom:12px;">
        <div style="font-size:16px;font-weight:700;color:#1f6fff;">⚙️ 导入设置</div>
        <button id="pteSettingsClose" style="width:28px;height:28px;border:none;border-radius:50%;background:#f0f0f0;color:#666;cursor:pointer;font-weight:600;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>
      </div>

      <div style="display:flex;gap:20px;margin-bottom:20px;">
        <!-- 左侧：格式和描述 -->
        <div style="flex:1;min-width:200px;padding-right:20px;border-right:1px solid #e0e0e0;">
          <!-- 动图保存格式 -->
          <div style="margin-bottom:20px;">
            <div style="font-weight:600;color:#333;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">🖼️</span>
              <span>动图保存格式</span>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="pte-format-btn" data-format="gif" style="flex:1;padding:6px 8px;border:2px solid ${currentFormat === 'gif' ? '#409eff' : '#d9d9d9'};border-radius:4px;background:${currentFormat === 'gif' ? '#e3f2fd' : 'white'};color:${currentFormat === 'gif' ? '#409eff' : '#666'};cursor:pointer;font-weight:600;font-size:11px;">GIF</button>
              <button class="pte-format-btn" data-format="apng" style="flex:1;padding:6px 8px;border:2px solid ${currentFormat === 'apng' ? '#409eff' : '#d9d9d9'};border-radius:4px;background:${currentFormat === 'apng' ? '#e3f2fd' : 'white'};color:${currentFormat === 'apng' ? '#409eff' : '#666'};cursor:pointer;font-weight:600;font-size:11px;">APNG</button>
              <button class="pte-format-btn" data-format="webm" style="flex:1;padding:6px 8px;border:2px solid ${currentFormat === 'webm' ? '#409eff' : '#d9d9d9'};border-radius:4px;background:${currentFormat === 'webm' ? '#e3f2fd' : 'white'};color:${currentFormat === 'webm' ? '#409eff' : '#666'};cursor:pointer;font-weight:600;font-size:11px;">WebM</button>
            </div>
            <div style="font-size:12px;color:#666;margin-top:8px;padding:8px;background:#f5f5f5;border-radius:6px;">
              💡 GIF: 兼容性好，文件较大 | APNG: 无损动图，文件较小 | WebM: 现代格式，体积最小
            </div>
          </div>

          <!-- 保存作品描述 -->
          <div style="margin-bottom:0;">
            <div style="font-weight:600;color:#333;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">📝</span>
              <span>保存作品描述</span>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="pte-desc-btn" data-desc="true" style="flex:1;padding:10px;border:2px solid ${currentSaveDesc ? '#67c23a' : '#d9d9d9'};border-radius:6px;background:${currentSaveDesc ? '#f0f9ff' : 'white'};color:${currentSaveDesc ? '#67c23a' : '#666'};cursor:pointer;font-weight:600;font-size:12px;">开启</button>
              <button class="pte-desc-btn" data-desc="false" style="flex:1;padding:10px;border:2px solid ${!currentSaveDesc ? '#f56c6c' : '#d9d9d9'};border-radius:6px;background:${!currentSaveDesc ? '#fef0f0' : 'white'};color:${!currentSaveDesc ? '#f56c6c' : '#666'};cursor:pointer;font-weight:600;font-size:12px;">关闭</button>
            </div>
            <div style="font-size:12px;color:#666;margin-top:8px;padding:8px;background:#f5f5f5;border-radius:6px;">
              💡 启用后，作品的描述信息会一同保存到 Eagle
            </div>
          </div>
        </div>

        <!-- 右侧：延迟设置 -->
        <div style="flex:1;min-width:200px;padding-left:0px;">
          <div style="font-weight:600;color:#333;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">⏱️</span>
            <span>延迟设置</span>
          </div>
          
          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#666;margin-bottom:6px;">标签提取延迟 (ms)：</label>
            <input id="pteTagExtractDelay" type="number" min="100" max="5000" step="100" value="${getTagExtractDelay()}" style="width:140px;padding:6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;box-sizing:border-box;">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#666;margin-bottom:6px;">下载间隔最小 (ms)：</label>
            <input id="pteDownloadDelayMin" type="number" min="100" max="5000" step="100" value="${getDownloadDelay().min}" style="width:140px;padding:6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;box-sizing:border-box;">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#666;margin-bottom:6px;">下载间隔最大 (ms)：</label>
            <input id="pteDownloadDelayMax" type="number" min="200" max="10000" step="100" value="${getDownloadDelay().max}" style="width:140px;padding:6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;box-sizing:border-box;">
          </div>

          <div style="font-size:11px;color:#999;word-break:break-word;">
            💡 标签提取延迟：随机延迟防止被限流<br>
            💡 下载间隔：随机延迟防止被限流
          </div>
        </div>
      </div>

      <div style="display:flex;gap:10px;padding-top:12px;border-top:1px solid #e0e0e0;">
        <button id="pteSettingsOk" style="flex:1;padding:10px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:13px;">关闭</button>
      </div>
    `;

    mask.appendChild(box);
    document.body.appendChild(mask);

    const closeBtn = box.querySelector('#pteSettingsClose');
    const okBtn = box.querySelector('#pteSettingsOk');
    const formatBtns = box.querySelectorAll('.pte-format-btn');
    const descBtns = box.querySelectorAll('.pte-desc-btn');

    const cleanup = () => {
      if (mask && mask.parentNode) {
        mask.parentNode.removeChild(mask);
      }
    };

    closeBtn.addEventListener('click', cleanup);
    okBtn.addEventListener('click', () => {
      try {
        const tagDelayEl = box.querySelector('#pteTagExtractDelay');
        const dlMinEl = box.querySelector('#pteDownloadDelayMin');
        const dlMaxEl = box.querySelector('#pteDownloadDelayMax');
        const autoBackupEl = box.querySelector('#pteAutoBackup');
        
        if (tagDelayEl && tagDelayEl.value) setTagExtractDelay(parseInt(tagDelayEl.value) || 300);
        if (dlMinEl && dlMaxEl) {
          const minVal = parseInt(dlMinEl.value) || 800;
          const maxVal = parseInt(dlMaxEl.value) || 1200;
          setDownloadDelay(minVal, Math.max(minVal + 100, maxVal));
        }
        
        showToast('延迟设置已保存 ✅');
      } catch (e) { console.warn('[PTE] 保存延迟设置失败', e); }
      cleanup();
    });

    // 格式选择按钮
    formatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.getAttribute('data-format');
        LS.set('ugoiraFormat', format);
        
        let msg = `动图格式已设置为: ${format.toUpperCase()}`;
        if (format === 'gif' || format === 'apng') {
          msg += '\n 文件超过 45MB 时会自动切换到本地模式保存';
        } else if (format === 'webm') {
          msg += '\n💡 WebM 文件最小，支持直接上传 Eagle';
        }
        
        showToast(msg);
        cleanup();
        createSettingsModal();
      });
    });

    // 描述保存按钮
    descBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const desc = btn.getAttribute('data-desc') === 'true';
        LS.set('saveDescription', desc);
        showToast(`作品描述保存已${desc ? '开启 ✅' : '关闭 ❌'}`);
        cleanup();
        createSettingsModal();
      });
    });
    mask.addEventListener('click', (e) => {
      if (e.target === mask) e.stopPropagation();
    });
  }

  // 备份历史查看模态框
  async function createTagManagerModal() {
    if (document.getElementById('pteTagManager')) return;

    const mask = document.createElement('div');
    mask.id = 'pteTagManager';
    Object.assign(mask.style, {
      position: 'fixed', inset: '0',
      background: 'transparent',
      backdropFilter: 'none',
      zIndex: 2147483647,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      pointerEvents: 'none'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: '1200px',
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0 12px 40px rgba(0,0,0,.18)',
      padding: '20px',
      fontSize: '13px',
      color: '#444',
      lineHeight: '1.6',
      maxHeight: '800px', 
      overflow: 'auto',
      position: 'absolute',
      pointerEvents: 'auto'
    });

    // 直接从 localStorage 读取最新的排除标签
    const excludedTags = LS.get('excludeTags', '') || CFG.filters.excludeTags || '';

    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;border-bottom:2px solid #409eff;padding-bottom:12px;cursor:grab;user-select:none;" id="pteDragHandle" onmousedown="return true;">
        <div style="font-size:18px;font-weight:700;color:#1f6fff;">🏷️ 标签管理中心 <span style="font-size:12px;color:#999;font-weight:400;">快捷键：T | 还原位置快捷键：V | 💡 可拖动</span></div>
        <button id="pteBackupHistory" style="padding:6px 12px;border:none;border-radius:4px;background:#ff9800;color:#fff;cursor:pointer;font-weight:600;font-size:11px;white-space:nowrap;display:flex;align-items:center;gap:4px;">📜 备份历史</button>
        <button id="pteBackupExport" style="padding:6px 12px;border:none;border-radius:4px;background:#67c23a;color:#fff;cursor:pointer;font-weight:600;font-size:11px;white-space:nowrap;">导出备份</button>
        <button id="pteBackupImport" style="padding:6px 12px;border:none;border-radius:4px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:11px;white-space:nowrap;">导入备份</button>
        <button id="pteRepairDB" style="padding:6px 12px;border:none;border-radius:4px;background:#f56c6c;color:#fff;cursor:pointer;font-weight:600;font-size:11px;white-space:nowrap;display:none;" title="仅在 IndexedDB 损坏时出现">修复数据库</button>
        <span style="margin-left:auto;color:#666;font-size:12px;">已保存翻译: ${Object.keys(savedTags).length} | 已排除: ${excludedTags.split(',').filter(Boolean).length}</span>
      </div>

      <!-- 操作历史 -->
      <div style="background:#e8f4f8;border-left:4px solid #00bcd4;padding:12px;border-radius:4px;margin-bottom:8px;">
        <div style="font-weight:600;color:#00695c;margin-bottom:4px;font-size:12px;">📋 最近操作</div>
        <div id="pteOperationHistory" style="font-size:11px;color:#00695c;max-height:50px;overflow-y:auto;line-height:1.6;">
          <div style="color:#999;">暂无操作记录</div>
        </div>
      </div>

      <!-- 三列布局 -->
      <div style="display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:12px;align-items:stretch;height:400px;">
	  
        <!-- 左列：排除标签 -->
        <div style="display:flex;flex-direction:column;border:1px solid #e0e0e0;border-radius:8px;padding:12px;background:#fafafa;height:100%;min-height:0;overflow:hidden;">
          <!-- 模式切换标签页 -->
          <div style="display:flex;margin-bottom:8px;border-bottom:2px solid #e0e0e0;">
            <button id="pteExcludeModeTag" class="pte-exclude-tab active" style="flex:1;padding:6px 8px;border:none;border-bottom:2px solid #409eff;margin-bottom:-2px;background:transparent;color:#409eff;cursor:pointer;font-size:11px;font-weight:600;">🏷️ 过滤标签</button>
            <button id="pteExcludeModeWork" class="pte-exclude-tab" style="flex:1;padding:6px 8px;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;background:transparent;color:#999;cursor:pointer;font-size:11px;font-weight:600;">📦 过滤作品</button>
          </div>
          <!-- 模式说明 -->
          <div id="pteExcludeModeDesc" style="font-size:10px;color:#666;margin-bottom:6px;padding:4px 6px;background:#e3f2fd;border-radius:3px;">导入时移除这些标签（作品正常导入）</div>
          <div style="font-weight:600;color:#f57c00;margin-bottom:8px;display:flex;align-items:center;gap:6px;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span id="pteExcludeTitle">🚫 过滤标签</span>
              <span style="font-size:11px;color:#999;font-weight:400;" id="pteExcludedCount">(0)</span>
            </div>
            <div style="display:flex;gap:4px;">
              <input id="pteExcludeSearch" type="text" placeholder="搜索" style="width:80px;padding:4px 6px;border:1px solid #d9d9d9;border-radius:3px;font-size:10px;box-sizing:border-box;" />
              <div style="position:relative;">
                <button id="pteExcludeSort" style="width:24px;height:24px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;" title="点击切换排序方式">↑</button>
                <div id="pteSortMenu" style="display:none;position:absolute;top:100%;right:-8px;margin-top:2px;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:10000;width:fit-content;">
                  <div data-sort="alpha-asc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="字母升序">A→Z</div>
                  <div data-sort="alpha-desc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="字母降序">Z→A</div>
                  <div data-sort="time-new" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="最新添加优先">新→旧</div>
                  <div data-sort="time-old" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;white-space:nowrap;" title="最早添加优先">旧→新</div>
                </div>
              </div>
            </div>
          </div>
          <div id="pteExcludeList" style="height:320px;overflow-y:auto;margin-bottom:6px;padding:8px;border:1px solid #d9d9d9;border-radius:6px;background:#fff;display:flex;flex-direction:column;gap:6px;"></div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:auto;">
            <div style="display:flex;gap:6px;">
            <button id="pteExcludeImport" style="flex:1;padding:10px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导入</button>
            <button id="pteExcludeExport" style="flex:1;padding:10px;border:none;border-radius:6px;background:#67c23a;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导出</button>
          </div>
            <div style="display:flex;gap:6px;">
            <button id="pteExcludeSave" style="flex:1;padding:10px;border:none;border-radius:6px;background:#ff9800;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">保存</button>
            <button id="pteExcludeReset" style="flex:1;padding:10px;border:1px solid #f56c6c;border-radius:6px;background:#fff;color:#f56c6c;cursor:pointer;font-weight:600;font-size:12px;">清空</button>
          </div>
          </div>
        </div>

        <!-- 中列：翻译区域（合并版） -->
        <div style="display:flex;flex-direction:column;border:1px solid #e0e0e0;border-radius:8px;padding:12px;background:#fafafa;min-height:0;height:100%;overflow:hidden;">
          <!-- 标题栏 -->
          <div style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
            <div style="font-weight:600;color:#1976d2;margin-bottom:6px;font-size:12px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
              <span>📝 标签翻译</span>
              <div style="display:flex;gap:4px;align-items:center;">
                <input id="pteManualTransInput" type="text" placeholder="输入标签" style="width:80px;padding:4px 6px;border:1px solid #d9d9d9;border-radius:3px;font-size:10px;box-sizing:border-box;" />
                <button id="pteManualTransAdd" style="width:24px;height:24px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;">+</button>
                <button id="pteExcludeAll" title="全部排除&#10;点击: 全部添加到过滤标签&#10;Ctrl+点击: 全部添加到过滤作品" style="width:24px;height:24px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;">⊗</button>
                <button id="pteClearAllTags" title="清空所有标签" style="width:24px;height:24px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;">✕</button>
                <button id="pteClearTransResult" title="标签管理设置" style="width:24px;height:24px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:12px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;">⚙️</button>
              </div>
            </div>
            <!-- 统一标签列表 -->
            <div id="pteUnifiedTagList" style="height:320px;overflow-y:auto;padding:8px;border:1px solid #d9d9d9;border-radius:6px;background:#f9f9f9;display:flex;flex-direction:column;gap:6px;margin-bottom:8px;">
              <div style="color:#999;text-align:center;padding:30px 10px;font-size:12px;">暂无标签，点击"提取标签"按钮</div>
            </div>
            <textarea id="pteTransInput" style="display:none;" placeholder="每行一个"></textarea>
          </div>

          <!-- 操作按钮 -->
          <div style="display:flex;flex-direction:column;gap:4px;margin-top:auto;">
            <div style="display:flex;gap:6px;">
              <button id="pteExtractTags" style="flex:1;padding:10px;border:none;border-radius:6px;background:#ff9800;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">提取标签</button>
              <button id="pteTranslateAll" style="flex:1;padding:10px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">一键翻译</button>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="pteListExport" style="flex:0.44;padding:10px;border:none;border-radius:6px;background:#67c23a;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导出列表</button>
              <button id="pteListImport" style="flex:0.44;padding:10px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导入列表</button>
              <button id="pteSaveAll" style="flex:1;padding:10px;border:none;border-radius:6px;background:#67c23a;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">保存全部</button>
            </div>
          </div>
        </div>

        <!-- 右列：已保存和工具 -->
        <div style="display:flex;flex-direction:column;border:1px solid #e0e0e0;border-radius:8px;padding:12px;background:#fafafa;;height:100%;min-height:0;overflow:hidden">
          <div style="font-weight:600;color:#388e3c;margin-bottom:8px;font-size:12px;display:flex;align-items:center;gap:6px;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span>📌 已保存翻译</span>
              <span style="font-size:11px;color:#999;font-weight:400;" id="pteSavedCount">(0)</span>
            </div>
            <div style="display:flex;gap:4px;align-items:center;">
              <input id="pteSavedSearch" type="text" placeholder="搜索翻译" autocomplete="off" style="width:80px;padding:4px 6px;border:1px solid #d9d9d9;border-radius:3px;font-size:10px;box-sizing:border-box;" />
              <div style="position:relative;">
                <button id="pteSavedSort" style="width:24px;height:24px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;font-weight:600;flex-shrink:0;display:flex;align-items:center;justify-content:center;" title="点击切换排序方式">↑</button>
                <div id="pteSavedSortMenu" style="display:none;position:absolute;top:100%;right:-8px;margin-top:2px;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:10000;width:fit-content;">
                  <div data-sort="tag-asc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="原始标签升序">标A→Z</div>
                  <div data-sort="tag-desc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="原始标签降序">标Z→A</div>
                  <div data-sort="trans-asc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="翻译升序">译A→Z</div>
                  <div data-sort="trans-desc" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="翻译降序">译Z→A</div>
                  <div data-sort="time-new" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;border-bottom:1px solid #f0f0f0;white-space:nowrap;" title="最新添加优先">新→旧</div>
                  <div data-sort="time-old" style="padding:8px 12px;cursor:pointer;font-size:11px;color:#333;white-space:nowrap;" title="最早添加优先">旧→新</div>
                </div>
              </div>
            </div>
          </div>
          <div id="pteSavedList" style="height:320px;overflow-y:auto;margin-bottom:8px;padding:8px;border:1px solid #d9d9d9;border-radius:6px;background:#fff;display:flex;flex-direction:column;gap:6px;">
          </div>
          <div style="display:flex;gap:6px;flex-direction:column;margin-bottom:0px;margin-top:auto;">
            <div style="display:flex;gap:6px;">
              <button id="pteSavedImport" style="flex:1;padding:10px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导入</button>
              <button id="pteSavedExport" style="flex:1;padding:10px;border:none;border-radius:6px;background:#67c23a;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导出</button>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="pteSavedSave" style="flex:1;padding:10px;border:none;border-radius:6px;background:#ff9800;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">保存</button>
              <button id="pteSavedReset" style="flex:1;padding:10px;border:1px solid #f56c6c;border-radius:6px;background:#fff;color:#f56c6c;cursor:pointer;font-weight:600;font-size:12px;">清空</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐藏的文件输入框 -->
      <input id="pteFileImportInput" type="file" style="display:none;" accept=".txt,.csv">

      <!-- 导入选择窗口 -->
      <div id="pteImportDialog" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:2px solid #409eff;border-radius:8px;padding:20px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);min-width:400px;max-width:600px;">
        <div style="font-weight:600;color:#1f6fff;margin-bottom:16px;font-size:14px;">📥 导入数据</div>
        <textarea id="pteImportTextarea" placeholder="在此粘贴导入内容..." style="width:100%;height:200px;padding:10px;border:1px solid #d9d9d9;border-radius:6px;font-family:monospace;font-size:12px;resize:none;box-sizing:border-box;"></textarea>
        <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end;">
          <button id="pteImportCancel" style="padding:8px 16px;border:1px solid #d9d9d9;border-radius:6px;background:#f5f5f5;color:#666;cursor:pointer;font-weight:600;font-size:12px;">取消</button>
          <button id="pteImportConfirm" style="padding:8px 16px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">导入</button>
        </div>
      </div>

      <!-- 导入对话框背景遮罩 -->
      <div id="pteImportMask" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:9998;"></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;align-items:center;margin-top:20px;padding-top:16px;margin-bottom:0;">
        <button id="pteNavPrevWork" style="padding:8px 14px;border:1px solid #409eff;border-radius:6px;background:#e3f2fd;color:#1976d2;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.2s;" title="跳转到上一个作品">上一个</button>
        <button id="pteNavNextWork" style="padding:8px 14px;border:1px solid #409eff;border-radius:6px;background:#e3f2fd;color:#1976d2;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.2s;" title="跳转到下一个作品">下一个</button>
        <button id="pteManagerClose" style="padding:10px 24px;border:1px solid #d9d9d9;border-radius:8px;background:#fff;color:#666;cursor:pointer;font-weight:600;font-size:14px;">关闭</button>
      </div>
    `;

    mask.appendChild(box);
    document.body.appendChild(mask);

    // ========== 拖动功能 ==========
    const dragHandle = box.querySelector('#pteDragHandle');
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let pendingX = null;
    let pendingY = null;
    let animFrameId = null;

    // 读取保存的位置
    const savedPos = LS.get('pteDragPos', null);
    if (savedPos) {
      box.style.top = savedPos.y + 'px';
      box.style.left = savedPos.x + 'px';
    } else {
      // 初始化：居中显示
      box.style.top = '50%';
      box.style.left = '50%';
      box.style.transform = 'translate(-50%, -50%)';
    }

    // 添加 will-change 以提示浏览器优化
    box.style.willChange = 'transform';

    if (dragHandle) {
      dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = box.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        // 移除 transform，使用绝对位置
        if (box.style.transform) {
          box.style.transform = 'none';
        }
        // 拖动时降低其他元素的指针事件
        mask.style.pointerEvents = 'none';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 使用 requestAnimationFrame 来平滑拖动
        pendingX = e.clientX - dragOffsetX;
        pendingY = e.clientY - dragOffsetY;

        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(() => {
          if (pendingX !== null && pendingY !== null) {
            // 允许拖出视口（不限制边界）
            box.style.top = pendingY + 'px';
            box.style.left = pendingX + 'px';
          }
        });
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          if (animFrameId) cancelAnimationFrame(animFrameId);
          // 保存位置
          const rect = box.getBoundingClientRect();
          LS.set('pteDragPos', { x: rect.left, y: rect.top });
        }
      });
    }

    // 初始化"保存全部"按钮状态（默认禁用）
    const saveAllBtn = box.querySelector('#pteSaveAll');
    saveAllBtn.disabled = true;
    saveAllBtn.style.opacity = '0.5';
    saveAllBtn.style.cursor = 'not-allowed';

    // 作品导航功能
    const setupWorkNavigation = () => {
      const prevBtn = box.querySelector('#pteNavPrevWork');
      const nextBtn = box.querySelector('#pteNavNextWork');

      if (!prevBtn || !nextBtn) return;

      // 更新导航按钮状态（独立函数，可被重复调用）
      const updateNavButtonState = () => {
        // 触发Pixiv原生的导航按钮（无刷新切换）
        const triggerPixivNavigation = (direction) => {
          // 方法1：尝试找到按钮类名中包含prev/next的元素
          const allButtons = document.querySelectorAll('button, a, div[role="button"]');
          for (let btn of allButtons) {
            const classList = btn.getAttribute('class') || '';
            const ariaLabel = btn.getAttribute('aria-label') || '';
            const title = btn.getAttribute('title') || '';
            const text = btn.textContent || '';

            const isPrev = classList.includes('prev') || ariaLabel.includes('前') || title.includes('前') || text.includes('前');
            const isNext = classList.includes('next') || ariaLabel.includes('后') || ariaLabel.includes('次') || title.includes('后') || text.includes('后');

            if (direction === 'prev' && isPrev) {
              btn.click();
              return true;
            }
            if (direction === 'next' && isNext) {
              btn.click();
              return true;
            }
          }

          // 方法2：模拟键盘事件让Pixiv本身处理
          const event = new KeyboardEvent('keydown', {
            key: direction === 'prev' ? 'ArrowLeft' : 'ArrowRight',
            code: direction === 'prev' ? 'ArrowLeft' : 'ArrowRight',
            keyCode: direction === 'prev' ? 37 : 39,
            bubbles: true,
            cancelable: true
          });
          document.dispatchEvent(event);
          return true;
        };

        // 获取当前作品ID
        const getCurrentWorkId = () => {
          const match = location.pathname.match(/\/artworks\/(\d+)/);
          return match ? match[1] : null;
        };

        // 获取页面上所有作品的ID列表
        const getAllWorkIds = () => {
          const controls = Array.from(document.querySelectorAll('[class*="pp-control"]'));
          const ids = controls
            .map(el => el.getAttribute('illustid'))
            .filter(Boolean);
          return [...new Set(ids)]; // 去重
        };

        const currentId = getCurrentWorkId();
        const allIds = getAllWorkIds();
        const currentIndex = currentId ? allIds.indexOf(currentId) : -1;

        // 禁用/启用上一个按钮
        if (currentIndex <= 0 || allIds.length === 0) {
          prevBtn.disabled = true;
          prevBtn.style.opacity = '0.5';
          prevBtn.style.cursor = 'not-allowed';
        } else {
          prevBtn.disabled = false;
          prevBtn.style.opacity = '1';
          prevBtn.style.cursor = 'pointer';
          prevBtn.onclick = () => triggerPixivNavigation('prev');
        }

        // 禁用/启用下一个按钮
        if (currentIndex < 0 || currentIndex >= allIds.length - 1 || allIds.length === 0) {
          nextBtn.disabled = true;
          nextBtn.style.opacity = '0.5';
          nextBtn.style.cursor = 'not-allowed';
        } else {
          nextBtn.disabled = false;
          nextBtn.style.opacity = '1';
          nextBtn.style.cursor = 'pointer';
          nextBtn.onclick = () => triggerPixivNavigation('next');
        }
      };

      // 初始更新
      updateNavButtonState();

      // 监听DOM变化，当pp-control加载出来时重新更新按钮状态
      const observer = new MutationObserver((mutations) => {
        // 检查是否有pp-control相关的变化
        let shouldUpdate = false;
        for (let mutation of mutations) {
          if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
            const hasControl = document.querySelectorAll('[class*="pp-control"]').length > 0;
            if (hasControl) {
              shouldUpdate = true;
              break;
            }
          }
        }
        if (shouldUpdate) {
          updateNavButtonState();
        }
      });

      // 观察页面变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['illustid']
      });

      // 标签管理器关闭时停止观察
      const originalRemove = mask.remove.bind(mask);
      mask.remove = function() {
        observer.disconnect();
        originalRemove();
      };
    };

    setupWorkNavigation();

    // 显示已保存的翻译
    // ========== 虚拟滚动配置 ==========
    const VIRTUAL_SCROLL_CONFIG = {
      itemHeight: 36,        // 每项高度 (padding + border + gap)
      containerHeight: 233,  // 容器可见高度
      bufferSize: 5,         // 上下缓冲区行数
      threshold: 50          // 超过此数量启用虚拟滚动
    };
    
    // 虚拟滚动状态
    let virtualScrollState = {
      allEntries: [],        // 所有数据
      filteredEntries: [],   // 筛选后的数据（搜索时使用）
      isSearching: false,    // 是否在搜索模式
      scrollHandler: null    // 滚动事件处理器引用
    };

    // 渲染单个项的 HTML
    const renderItemHTML = (original, translation, index) => {
      const origEscaped = original.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const transEscaped = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `<div style="padding:6px 8px;border:1px solid #d9d9d9;border-radius:4px;background:#e3f2fd;font-size:11px;display:flex;align-items:center;gap:4px;box-sizing:border-box;height:${VIRTUAL_SCROLL_CONFIG.itemHeight}px;" data-original="${origEscaped}" data-index="${index}">
        <span style="color:#1f6fff;font-weight:600;width:60px;max-width:60px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;" title="${origEscaped}">${origEscaped}</span>
        <span style="color:#999;flex-shrink:0;">→</span>
        <input type="text" class="pteEditTranslation" data-original="${origEscaped}" value="${transEscaped}" style="flex:1;padding:2px 4px;border:1px solid #d9d9d9;border-radius:3px;font-size:11px;min-width:40px;display:none;box-sizing:border-box;" />
        <span class="pteTransDisplay" style="color:#666;min-width:40px;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;word-break:break-all;margin-right:auto;" title="${transEscaped}">${transEscaped}</span>
        <button class="pteEditTag" data-tag="${origEscaped}" style="padding:0 4px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;">✏️</button>
        <button class="pteSaveEdit" data-tag="${origEscaped}" style="padding:0 4px;border:none;border-radius:3px;background:#67c23a;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;display:none;user-select:none;">💾</button>
        <button class="pteDeleteTag" data-tag="${origEscaped}" style="padding:0 4px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;">✕</button>
      </div>`;
    };

    // 虚拟滚动核心渲染函数
    const renderVirtualItems = (savedListEl) => {
      const { itemHeight, containerHeight, bufferSize } = VIRTUAL_SCROLL_CONFIG;
      const entries = virtualScrollState.isSearching ? virtualScrollState.filteredEntries : virtualScrollState.allEntries;
      
      const spacer = savedListEl.querySelector('#pteVirtualSpacer');
      const content = savedListEl.querySelector('#pteVirtualContent');
      if (!spacer || !content) return;
      
      const totalHeight = entries.length * itemHeight;
      spacer.style.height = totalHeight + 'px';
      
      const scrollTop = savedListEl.scrollTop;
      const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
      const endIdx = Math.min(entries.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize);
      
      // 定位内容区域
      content.style.top = (startIdx * itemHeight) + 'px';
      
      // 渲染可见项
      let html = '';
      for (let i = startIdx; i < endIdx; i++) {
        const [original, transData] = entries[i];
        const translation = typeof transData === 'string' ? transData : transData.translation;
        html += renderItemHTML(original, translation, i);
      }
      content.innerHTML = html;
    };

    const updateSavedList = (isInitializing = false) => {
      const savedListEl = box.querySelector('#pteSavedList');
      const countEl = box.querySelector('#pteSavedCount');
      
      // 移除旧的滚动监听器
      if (virtualScrollState.scrollHandler) {
        savedListEl.removeEventListener('scroll', virtualScrollState.scrollHandler);
        virtualScrollState.scrollHandler = null;
      }
      
      savedListEl.innerHTML = '';

      if (Object.keys(savedTags).length === 0) {
        // 检查是否还在加载中：只有全局标签库未初始化完成时才显示"加载中"
        if (!isTagLibraryInitialized) {
          savedListEl.innerHTML = '<div style="color:#999;text-align:center;padding:30px 10px;font-size:12px;">📦 数据加载中...（如数据量较大，可能需要数秒）</div>';
        } else {
          // 已初始化完成，但确实没有数据
          savedListEl.innerHTML = '<div style="color:#999;text-align:center;padding:30px 10px;font-size:12px;">暂无保存的翻译</div>';
        }
        virtualScrollState.allEntries = [];
      } else {
        // 获取排序模式
        let entries = Object.entries(savedTags).map(([original, trans]) => {
          // 兼容旧常规模式
          if (typeof trans === 'string') {
            return [original, { translation: trans, timestamp: 0 }];
          }
          return [original, trans];
        });

        // 应用排序
        const sortMode = LS.get('savedSortMode', 'tag-asc') || 'tag-asc';
        if (sortMode === 'tag-asc') {
          entries.sort((a, b) => a[0].localeCompare(b[0]));
        } else if (sortMode === 'tag-desc') {
          entries.sort((a, b) => b[0].localeCompare(a[0]));
        } else if (sortMode === 'trans-asc') {
          entries.sort((a, b) => {
            const transA = typeof a[1] === 'string' ? a[1] : a[1].translation;
            const transB = typeof b[1] === 'string' ? b[1] : b[1].translation;
            return transA.localeCompare(transB);
          });
        } else if (sortMode === 'trans-desc') {
          entries.sort((a, b) => {
            const transA = typeof a[1] === 'string' ? a[1] : a[1].translation;
            const transB = typeof b[1] === 'string' ? b[1] : b[1].translation;
            return transB.localeCompare(transA);
          });
        } else if (sortMode === 'time-new') {
          entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
        } else if (sortMode === 'time-old') {
          entries.sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));
        }
        
        // 保存到虚拟滚动状态
        virtualScrollState.allEntries = entries;
        virtualScrollState.filteredEntries = entries;
        virtualScrollState.isSearching = false;

        // 启用虚拟滚动（超过阈值时）
        if (entries.length > VIRTUAL_SCROLL_CONFIG.threshold) {
          const { itemHeight } = VIRTUAL_SCROLL_CONFIG;
          const totalHeight = entries.length * itemHeight;
          
          // 创建虚拟滚动 DOM 结构
          savedListEl.innerHTML = `
            <div id="pteVirtualSpacer" style="position:relative;width:100%;height:${totalHeight}px;">
              <div id="pteVirtualContent" style="position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;gap:0;"></div>
            </div>
          `;
          
          // 初始渲染
          renderVirtualItems(savedListEl);
          
          // 滚动事件（防抖）
          let scrollTimeout;
          virtualScrollState.scrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => renderVirtualItems(savedListEl), 16); // ~60fps
          };
          savedListEl.addEventListener('scroll', virtualScrollState.scrollHandler, { passive: true });
          
          // 事件委托
          savedListEl.onclick = handleSavedListClick;
        } else {
          // 非初始化或数据少于100条时，用原来的 createElement 方式
          for (const [original, transData] of entries) {
            const translation = typeof transData === 'string' ? transData : transData.translation;
            const div = document.createElement('div');
            div.style.cssText = 'padding:6px 8px;border:1px solid #d9d9d9;border-radius:4px;background:#e3f2fd;font-size:11px;display:flex;align-items:center;gap:4px;';

            const origSpan = document.createElement('span');
            origSpan.style.cssText = 'color:#1f6fff;font-weight:600;width:60px;max-width:60px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;';
            origSpan.title = original;
            origSpan.textContent = original;
            div.appendChild(origSpan);

            const arrow = document.createElement('span');
            arrow.style.cssText = 'color:#999;flex-shrink:0;';
            arrow.textContent = '→';
            div.appendChild(arrow);

            // 编辑框
            const input = document.createElement('input');
            input.type = 'text';
            input.value = translation;
            input.className = 'pteEditTranslation';
            input.setAttribute('data-original', original);
            input.style.cssText = 'flex:1;padding:2px 4px;border:1px solid #d9d9d9;border-radius:3px;font-size:11px;min-width:40px;display:none;box-sizing:border-box;';
            div.appendChild(input);

            const transSpan = document.createElement('span');
            transSpan.style.cssText = 'color:#666;min-width:40px;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;word-break:break-all;margin-right:auto;';
            transSpan.textContent = translation;
            transSpan.title = translation;
            transSpan.className = 'pteTransDisplay';
            div.appendChild(transSpan);

            // 编辑按钮
            const editBtn = document.createElement('button');
            editBtn.className = 'pteEditTag';
            editBtn.setAttribute('data-tag', original);
            editBtn.style.cssText = 'padding:0 4px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;';
            editBtn.textContent = '✏️';
            editBtn.onclick = (e) => {
              e.stopPropagation();
              const isEditing = input.style.display !== 'none';
              input.style.display = isEditing ? 'none' : 'block';
              transSpan.style.display = isEditing ? 'block' : 'none';
              editBtn.textContent = isEditing ? '✏️' : '✕';
              saveBtn.style.display = isEditing ? 'none' : 'block';
              if (!isEditing) input.focus();
            };
            div.appendChild(editBtn);

            // 保存修改按钮
            const saveBtn = document.createElement('button');
            saveBtn.className = 'pteSaveEdit';
            saveBtn.setAttribute('data-tag', original);
            saveBtn.style.cssText = 'padding:0 4px;border:none;border-radius:3px;background:#67c23a;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;display:none;user-select:none;';
            saveBtn.textContent = '💾';
            saveBtn.onclick = (e) => {
              e.stopPropagation();
              if (excludeTagsSet.has(original)) {
                showToast(`❌ 此标签在排除列表中，无法保存`);
                return;
              }
              const newTranslation = input.value.trim();
              if (!newTranslation) {
                showToast('翻译不能为空');
                return;
              }
              savedTags[original] = { translation: newTranslation, timestamp: Date.now() };
              saveTags();
              const lines = transInput.value.split('\n');
              const filtered = lines.filter(line => line.trim() !== original);
              transInput.value = filtered.join('\n');
              updateTransInputList();
              updateSavedList();
              const searchInput = box.querySelector('#pteSavedSearch');
              if (searchInput && searchInput.value.trim()) {
                searchInput.dispatchEvent(new Event('input'));
              }
              updateTransResultAfterExclude();
              addOperationLog('保存翻译', `${original} → ${newTranslation}`);
              updateOperationHistory();
              showToast(`✅ 已保存修改：${original}`);
            };
            div.appendChild(saveBtn);

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'pteDeleteTag';
            deleteBtn.setAttribute('data-tag', original);
            deleteBtn.style.cssText = 'padding:0 4px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;';
            deleteBtn.textContent = '✕';
            deleteBtn.onclick = (e) => {
              e.stopPropagation();
              delete savedTags[original];
              saveTags();
              const currentText = transInput.value.trim();
              const lines = currentText ? currentText.split('\n') : [];
              if (!lines.includes(original)) {
                lines.push(original);
                transInput.value = lines.join('\n');
              }
              updateSavedList();
              updateTransInputList();
              const searchInput = box.querySelector('#pteSavedSearch');
              if (searchInput && searchInput.value.trim()) {
                searchInput.dispatchEvent(new Event('input'));
              }
              // 将标签添加回待翻译状态
              if (!unifiedTagState[original]) {
                unifiedTagState[original] = { status: 'pending', translation: '' };
              }
              updateUnifiedTagList();
              addOperationLog('删除翻译', original);
              updateOperationHistory();
              showToast(`✅ 已删除翻译，回到待翻译区：${original}`);
            };
            div.appendChild(deleteBtn);

            savedListEl.appendChild(div);
          }
        }
      }
      countEl.textContent = `(${Object.keys(savedTags).length})`;
    };

    // 事件委托处理函数
    const handleSavedListClick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const div = btn.closest('div[data-original]');
      const original = div?.getAttribute('data-original');
      if (!original) return;

      const input = div.querySelector('.pteEditTranslation');
      const transSpan = div.querySelector('.pteTransDisplay');
      const editBtn = div.querySelector('.pteEditTag');
      const saveBtn = div.querySelector('.pteSaveEdit');

      if (btn.classList.contains('pteEditTag')) {
        e.stopPropagation();
        const isEditing = input.style.display !== 'none';
        input.style.display = isEditing ? 'none' : 'block';
        transSpan.style.display = isEditing ? 'block' : 'none';
        editBtn.textContent = isEditing ? '✏️' : '✕';
        saveBtn.style.display = isEditing ? 'none' : 'block';
        if (!isEditing) input.focus();
      } else if (btn.classList.contains('pteSaveEdit')) {
        e.stopPropagation();
        if (excludeTagsSet.has(original)) {
          showToast(`❌ 此标签在排除列表中，无法保存`);
          return;
        }
        const newTranslation = input.value.trim();
        if (!newTranslation) {
          showToast('翻译不能为空');
          return;
        }
        savedTags[original] = { translation: newTranslation, timestamp: Date.now() };
        saveTags();
        const lines = transInput.value.split('\n');
        const filtered = lines.filter(line => line.trim() !== original);
        transInput.value = filtered.join('\n');
        updateTransInputList();
        updateSavedList();
        const searchInput = box.querySelector('#pteSavedSearch');
        if (searchInput && searchInput.value.trim()) {
          searchInput.dispatchEvent(new Event('input'));
        }
        updateTransResultAfterExclude();
        addOperationLog('保存翻译', `${original} → ${newTranslation}`);
        updateOperationHistory();
        showToast(`✅ 已保存修改：${original}`);
      } else if (btn.classList.contains('pteDeleteTag')) {
        e.stopPropagation();
        delete savedTags[original];
        saveTags();
        const currentText = transInput.value.trim();
        const lines = currentText ? currentText.split('\n') : [];
        if (!lines.includes(original)) {
          lines.push(original);
          transInput.value = lines.join('\n');
        }
        updateSavedList();
        updateTransInputList();
        const searchInput = box.querySelector('#pteSavedSearch');
        if (searchInput && searchInput.value.trim()) {
          searchInput.dispatchEvent(new Event('input'));
        }
        // 将标签添加回待翻译状态
        if (!unifiedTagState[original]) {
          unifiedTagState[original] = { status: 'pending', translation: '' };
        }
        updateUnifiedTagList();
        addOperationLog('删除翻译', original);
        updateOperationHistory();
        showToast(`✅ 已删除翻译，回到待翻译区：${original}`);
      }
    };

    updateSavedList(true); // 初始化时传入 true，用 innerHTML 快速渲染
    
    // 注册更新回调：当全局标签库加载完成时自动刷新
    tagManagerModalUpdateCallback = () => {
      updateSavedList(false);
      updateUnifiedTagList();
    };

    // ========== 两个独立列表 ==========
    // 过滤标签列表（导入时移除这些标签）
    let excludeTagsSet = new Set(
      excludedTags.split(',')
        .map(t => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    );
    
    // 过滤作品列表（跳过含这些标签的作品）
    let excludeWorksTagsStr = LS.get('excludeWorksTags', '');
    let excludeWorksSet = new Set(
      excludeWorksTagsStr.split(',')
        .map(t => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    );
    
    // 当前模式：'tag' = 过滤标签，'work' = 过滤作品
    let currentExcludeMode = 'tag';

    // 排除标签的排序和时间戳
    let excludeTagsWithTime = LS.get('excludeTagsWithTime', {});
    let excludeWorksWithTime = LS.get('excludeWorksWithTime', {});
    let excludeSortMode = LS.get('excludeSortMode', 'alpha-asc'); // 'alpha-asc', 'alpha-desc', 'time-new', 'time-old'

    // 初始化时间戳（仅第一次）
    let initialized = LS.get('excludeTagsTimeInitialized', false);
    if (!initialized && excludeTagsSet.size > 0) {
      const now = Date.now();
      for (const tag of excludeTagsSet) {
        if (!excludeTagsWithTime[tag]) {
          excludeTagsWithTime[tag] = now;
        }
      }
      saveExcludeFilters('tag');
      LS.set('excludeTagsTimeInitialized', true);
    }
    
    // 获取当前模式的数据
    const getCurrentSet = () => currentExcludeMode === 'tag' ? excludeTagsSet : excludeWorksSet;
    const getCurrentTimeMap = () => currentExcludeMode === 'tag' ? excludeTagsWithTime : excludeWorksWithTime;
    const getStorageKey = () => currentExcludeMode === 'tag' ? 'excludeTags' : 'excludeWorksTags';
    const getTimeStorageKey = () => currentExcludeMode === 'tag' ? 'excludeTagsWithTime' : 'excludeWorksWithTime';

    const applySorting = () => {
      const currentSet = getCurrentSet();
      const timeMap = getCurrentTimeMap();
      let sortedTags = Array.from(currentSet);
      switch (excludeSortMode) {
        case 'alpha-asc':
          sortedTags.sort();
          break;
        case 'alpha-desc':
          sortedTags.sort().reverse();
          break;
        case 'time-new':
          sortedTags.sort((a, b) => (timeMap[b] || 0) - (timeMap[a] || 0));
          break;
        case 'time-old':
          sortedTags.sort((a, b) => (timeMap[a] || 0) - (timeMap[b] || 0));
          break;
      }
      return sortedTags;
    };

    // 虚拟滚动配置（左侧列表）
    const EXCLUDE_ITEM_HEIGHT = 32; // 每项高度
    const EXCLUDE_BUFFER = 5; // 缓冲区
    let excludeScrollTop = 0;
    let excludeSearchKeyword = ''; // 搜索关键词

    const updateExcludeList = () => {
      const excludeListEl = box.querySelector('#pteExcludeList');
      const countEl = box.querySelector('#pteExcludedCount');
      const titleEl = box.querySelector('#pteExcludeTitle');
      const descEl = box.querySelector('#pteExcludeModeDesc');
      const currentSet = getCurrentSet();
      const timeMap = getCurrentTimeMap();
      let sortedTags = applySorting();
      
      // 搜索过滤
      if (excludeSearchKeyword) {
        sortedTags = sortedTags.filter(tag => tag.toLowerCase().includes(excludeSearchKeyword));
      }
      
      // 更新标题和说明
      if (currentExcludeMode === 'tag') {
        titleEl.textContent = '🏷️ 过滤标签';
        descEl.textContent = '导入时移除这些标签（作品正常导入）';
        descEl.style.background = '#e3f2fd';
      } else {
        titleEl.textContent = '📦 过滤作品';
        descEl.textContent = '跳过含这些标签的作品（整个作品不导入）';
        descEl.style.background = '#fff3e0';
      }

      // 显示过滤后的数量和总数量
      const displayCount = excludeSearchKeyword ? `${sortedTags.length}/${currentSet.size}` : currentSet.size;

      if (sortedTags.length === 0) {
        excludeListEl.innerHTML = '';
        excludeListEl.style.position = '';
        const emptyText = excludeSearchKeyword 
          ? '未找到匹配的标签' 
          : (currentExcludeMode === 'tag' ? '暂无过滤标签' : '暂无过滤作品标签');
        excludeListEl.innerHTML = `<div style="color:#999;text-align:center;padding:30px 10px;font-size:12px;">${emptyText}</div>`;
        countEl.textContent = `(${displayCount})`;
        return;
      }

      // 虚拟滚动渲染
      const containerHeight = excludeListEl.clientHeight || 200;
      const totalHeight = sortedTags.length * EXCLUDE_ITEM_HEIGHT;
      const visibleCount = Math.ceil(containerHeight / EXCLUDE_ITEM_HEIGHT) + EXCLUDE_BUFFER * 2;
      
      const renderExcludeItems = () => {
        const scrollTop = excludeListEl.scrollTop;
        const startIndex = Math.max(0, Math.floor(scrollTop / EXCLUDE_ITEM_HEIGHT) - EXCLUDE_BUFFER);
        const endIndex = Math.min(sortedTags.length, startIndex + visibleCount);
        
        excludeListEl.innerHTML = '';
        excludeListEl.style.position = 'relative';
        
        // 占位容器
        const spacer = document.createElement('div');
        spacer.style.height = totalHeight + 'px';
        spacer.style.position = 'relative';
        excludeListEl.appendChild(spacer);
        
        // 渲染可见项
        for (let i = startIndex; i < endIndex; i++) {
          const tag = sortedTags[i];
          const div = document.createElement('div');
          div.style.cssText = `position:absolute;top:${i * EXCLUDE_ITEM_HEIGHT}px;left:0;right:0;height:${EXCLUDE_ITEM_HEIGHT - 6}px;padding:6px 8px;border:1px solid #d9d9d9;border-radius:4px;background:#ffebee;font-size:11px;display:flex;align-items:center;gap:6px;box-sizing:border-box;margin:0 8px;width:calc(100% - 16px);`;

          const tagSpan = document.createElement('span');
          tagSpan.style.cssText = 'color:#c62828;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          tagSpan.textContent = tag;
          tagSpan.title = tag;
          div.appendChild(tagSpan);

          // Pixiv搜索按钮
          const pixivBtn = document.createElement('button');
          pixivBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;margin-left:auto;min-width:20px;';
          pixivBtn.textContent = 'P';
          pixivBtn.title = '在Pixiv搜索此标签';
          pixivBtn.onclick = (e) => {
            e.stopPropagation();
            window.open(`https://www.pixiv.net/tags/${encodeURIComponent(tag)}/illustrations`, '_blank');
          };
          div.appendChild(pixivBtn);

          const deleteBtn = document.createElement('button');
          deleteBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;flex-shrink:0;user-select:none;min-width:20px;';
          deleteBtn.textContent = '✕';
          deleteBtn.onclick = (e) => {
            e.stopPropagation();
            const currentSet = getCurrentSet();
            const timeMap = getCurrentTimeMap();
            currentSet.delete(tag);
            delete timeMap[tag];
            // 立即保存到 localStorage
            const tagsStr = Array.from(currentSet).join(',');
            LS.set(getStorageKey(), tagsStr);
            LS.set(getTimeStorageKey(), timeMap);

            // 同步到中间列：添加到待翻译区
            const currentText = transInput.value.trim();
            const lines = currentText ? currentText.split('\n') : [];
            if (!lines.includes(tag)) {
              lines.push(tag);
              transInput.value = lines.join('\n');
            }
            updateTransInputList();
            
            if (currentExcludeMode === 'tag') {
              updateTransResultAfterExclude();
            }

            // 同时从已保存翻译中删除该标签
            if (savedTags[tag]) {
              delete savedTags[tag];
              saveTags();
              updateSavedList();
            }
            updateExcludeList();
            const modeText = currentExcludeMode === 'tag' ? '过滤标签' : '过滤作品标签';
            showToast(`✅ 已移除${modeText}：${tag}`);
          };
          div.appendChild(deleteBtn);

          spacer.appendChild(div);
        }
      };
      
      // 移除旧的滚动监听
      excludeListEl.onscroll = null;
      // 添加新的滚动监听
      excludeListEl.onscroll = () => {
        requestAnimationFrame(renderExcludeItems);
      };
      
      // 初始渲染
      renderExcludeItems();
      countEl.textContent = `(${displayCount})`;
    };
    updateExcludeList();
    
    // 标签页切换事件
    const tabTag = box.querySelector('#pteExcludeModeTag');
    const tabWork = box.querySelector('#pteExcludeModeWork');
    
    tabTag.onclick = () => {
      if (currentExcludeMode === 'tag') return;
      currentExcludeMode = 'tag';
      tabTag.style.borderBottomColor = '#409eff';
      tabTag.style.color = '#409eff';
      tabWork.style.borderBottomColor = 'transparent';
      tabWork.style.color = '#999';
      updateExcludeList();
    };
    
    tabWork.onclick = () => {
      if (currentExcludeMode === 'work') return;
      currentExcludeMode = 'work';
      tabWork.style.borderBottomColor = '#ff9800';
      tabWork.style.color = '#ff9800';
      tabTag.style.borderBottomColor = 'transparent';
      tabTag.style.color = '#999';
      updateExcludeList();
    };

    // 翻译结果实时更新（排除后）- 适配统一列表
    const updateTransResultAfterExclude = () => {
      // 检查统一状态中是否有被排除的标签或已保存的翻译
      Object.keys(unifiedTagState).forEach(tag => {
        const lowerTag = lower(tag);
        const isExcluded = Array.from(excludeTagsSet).some(ex => lower(ex) === lowerTag);
        const hasSaved = !!findTranslationFromSaved(tag);
        if (isExcluded || hasSaved) {
          delete unifiedTagState[tag];
        }
      });
      // 更新显示
      if (typeof updateUnifiedTagList === 'function') {
        updateUnifiedTagList();
      }
    };

    // ========== 统一标签状态管理 ==========
    // 状态: pending(待翻译), translating(翻译中), translated(已翻译)
    const unifiedTagState = {};
    
    // 翻译相关
    const transInput = box.querySelector('#pteTransInput');
    const unifiedTagList = box.querySelector('#pteUnifiedTagList');

    // 统一标签列表渲染
    const updateUnifiedTagList = () => {
      const tags = transInput.value.trim().split('\n').map(t => t.trim()).filter(Boolean);

      if (tags.length === 0 && Object.keys(unifiedTagState).length === 0) {
        unifiedTagList.innerHTML = '<div style="color:#999;text-align:center;padding:30px 10px;font-size:12px;">暂无标签，点击"提取标签"按钮</div>';
        updateSaveAllButtonState();
        return;
      }

      unifiedTagList.innerHTML = '';
      const fragment = document.createDocumentFragment();

      // 合并：待翻译标签 + 已有翻译状态的标签
      const allTags = new Set([...tags, ...Object.keys(unifiedTagState)]);
      
      allTags.forEach(tag => {
        const state = unifiedTagState[tag] || { status: 'pending', translation: '' };
        const div = document.createElement('div');
        div.setAttribute('data-tag', tag);
        div.setAttribute('data-status', state.status);
        
        // 根据状态设置不同样式
        if (state.status === 'translated') {
          div.style.cssText = 'padding:6px 8px;border:1px solid #67c23a;border-radius:4px;background:#f0f9eb;font-size:11px;display:flex;align-items:center;gap:6px;';
        } else if (state.status === 'translating') {
          div.style.cssText = 'padding:6px 8px;border:1px solid #409eff;border-radius:4px;background:#ecf5ff;font-size:11px;display:flex;align-items:center;gap:6px;';
        } else {
          div.style.cssText = 'padding:6px 8px;border:1px solid #d9d9d9;border-radius:4px;background:#e3f5ff;font-size:11px;display:flex;align-items:center;gap:6px;';
        }

        // 状态图标
        const statusIcon = document.createElement('span');
        statusIcon.style.cssText = 'flex-shrink:0;font-size:12px;';
        if (state.status === 'translated') {
          statusIcon.textContent = '✅';
        } else if (state.status === 'translating') {
          // 旋转圆圈loading
          statusIcon.style.cssText = 'flex-shrink:0;width:12px;height:12px;border:2px solid transparent;border-top:2px solid #409eff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;';
          statusIcon.textContent = '';
        } else {
          statusIcon.textContent = '⏳';
        }
        div.appendChild(statusIcon);

        // 原标签
        const tagSpan = document.createElement('span');
        tagSpan.style.cssText = 'color:#1976d2;font-weight:600;width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;';
        tagSpan.title = tag;
        tagSpan.textContent = tag;
        div.appendChild(tagSpan);

        if (state.status === 'translated') {
          // 已翻译：
          const arrow = document.createElement('span');
          arrow.style.cssText = 'color:#999;flex-shrink:0;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;';
          arrow.textContent = '→';
          div.appendChild(arrow);

          const input = document.createElement('input');
          input.type = 'text';
          input.value = state.translation;
          input.className = 'pteUnifiedTransEdit';
          input.setAttribute('data-tag', tag);
          input.style.cssText = 'flex:1;min-width:50px;padding:2px 4px;border:1px solid #d9d9d9;border-radius:3px;font-size:11px;box-sizing:border-box;';
          input.oninput = () => {
            unifiedTagState[tag].translation = input.value;
          };
          div.appendChild(input);
        } else if (state.status === 'translating') {
          // 翻译中：显示加载提示
          const loadingText = document.createElement('span');
          loadingText.style.cssText = 'color:#409eff;font-size:10px;margin-left:auto;';
          loadingText.textContent = '翻译中...';
          div.appendChild(loadingText);
        }

        // 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display:flex;gap:3px;flex-shrink:0;margin-left:auto;';

        // 通用搜索按钮（所有状态都有）
        // Pixiv搜索按钮
        const pixivBtn = document.createElement('button');
        pixivBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-size:10px;user-select:none;min-width:28px;';
        pixivBtn.textContent = 'P搜';
        pixivBtn.title = '在Pixiv搜索此标签';
        pixivBtn.onclick = (e) => {
          e.stopPropagation();
          window.open(`https://www.pixiv.net/tags/${encodeURIComponent(tag)}/illustrations`, '_blank');
        };
        btnContainer.appendChild(pixivBtn);

        // 搜索引擎按钮
        const searchBtn = document.createElement('button');
        searchBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#ffc107;color:#fff;cursor:pointer;font-size:10px;user-select:none;min-width:24px;';
        searchBtn.textContent = '🔍';
        searchBtn.onclick = (e) => {
          e.stopPropagation();
          const settings = LS.get('tagManagerSettings', { searchEngine: 'google', customEngineUrl: '' });
          const engineUrls = {
            google: `https://www.google.com/search?q=${encodeURIComponent(tag)}`,
            baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(tag)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(tag)}`,
            'yahoo-jp': `https://search.yahoo.co.jp/search?p=${encodeURIComponent(tag)}`,
            goo: `https://search.goo.ne.jp/web.jsp?MT=${encodeURIComponent(tag)}`,
            sogou: `https://www.sogou.com/web?query=${encodeURIComponent(tag)}`
          };
          let searchUrl = engineUrls[settings.searchEngine] || engineUrls.google;
          if (settings.searchEngine === 'custom' && settings.customEngineUrl) {
            searchUrl = settings.customEngineUrl.replace('{tag}', encodeURIComponent(tag));
          }
          window.open(searchUrl, '_blank');
        };
        btnContainer.appendChild(searchBtn);

        if (state.status === 'pending') {
          // 待翻译状态：显示翻译按钮

          // 单个翻译按钮
          const translateBtn = document.createElement('button');
          translateBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#67c23a;color:#fff;cursor:pointer;font-size:10px;user-select:none;min-width:24px;';
          translateBtn.textContent = '译';
          translateBtn.title = '翻译此标签';
          translateBtn.onclick = async (e) => {
            e.stopPropagation();
            unifiedTagState[tag] = { status: 'translating', translation: '' };
            updateUnifiedTagList();
            try {
              const translation = await translateWithQwen(tag, 'zh');
              unifiedTagState[tag] = { status: 'translated', translation };
            } catch (err) {
              unifiedTagState[tag] = { status: 'pending', translation: '' };
              showToast(`❌ 翻译失败: ${tag}`);
            }
            updateUnifiedTagList();
          };
          btnContainer.appendChild(translateBtn);
        } else if (state.status === 'translated') {
          // 已翻译状态：显示保存按钮
          
          // 保存按钮
          const saveBtn = document.createElement('button');
          saveBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#67c23a;color:#fff;cursor:pointer;font-size:10px;user-select:none;min-width:24px;';
          saveBtn.textContent = '💾';
          saveBtn.title = '保存此翻译';
          saveBtn.onclick = (e) => {
            e.stopPropagation();
            const input = div.querySelector('.pteUnifiedTransEdit');
            const translation = input ? input.value.trim() : state.translation;
            if (!translation) {
              showToast('翻译不能为空');
              return;
            }
            savedTags[tag] = { translation, timestamp: Date.now() };
            saveTags();
            // 从待翻译区和状态中移除
            const lines = transInput.value.split('\n');
            transInput.value = lines.filter(line => line.trim() !== tag).join('\n');
            delete unifiedTagState[tag];
            updateUnifiedTagList();
            updateSavedList();
            const searchInput = box.querySelector('#pteSavedSearch');
            if (searchInput && searchInput.value.trim()) {
              searchInput.dispatchEvent(new Event('input'));
            }
            addOperationLog('保存翻译', `${tag} → ${translation}`);
            updateOperationHistory();
            showToast(`✅ 已保存：${tag}`);
          };
          btnContainer.appendChild(saveBtn);
        }

        // 排除/删除按钮（所有状态都有）
        const deleteBtn = document.createElement('button');
        deleteBtn.style.cssText = 'padding:2px 6px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-size:10px;user-select:none;min-width:24px;';
        deleteBtn.textContent = '✕';
        deleteBtn.title = '排除此标签\n点击: 添加到过滤标签\nCtrl+点击: 添加到过滤作品';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          
          if (e.ctrlKey) {
            // Ctrl+点击: 添加到过滤作品
            excludeWorksSet.add(tag);
            excludeWorksWithTime[tag] = Date.now();
            saveExcludeFilters('works');
            // 从待翻译区和状态中移除
            const lines = transInput.value.split('\n');
            transInput.value = lines.filter(line => line.trim() !== tag).join('\n');
            delete unifiedTagState[tag];
            updateUnifiedTagList();
            // 自动切换到过滤作品标签页
            if (currentExcludeMode !== 'work') {
              currentExcludeMode = 'work';
              const tabTag = box.querySelector('#pteExcludeModeTag');
              const tabWork = box.querySelector('#pteExcludeModeWork');
              tabWork.style.borderBottomColor = '#ff9800';
              tabWork.style.color = '#ff9800';
              tabTag.style.borderBottomColor = 'transparent';
              tabTag.style.color = '#999';
            }
            updateExcludeList();
            showToast(`✅ 已添加到过滤作品: ${tag}`);
          } else {
            // 普通点击: 添加到过滤标签
            excludeTagsSet.add(tag);
            excludeTagsWithTime[tag] = Date.now();
            saveExcludeFilters('tag');
            // 从待翻译区和状态中移除
            const lines = transInput.value.split('\n');
            transInput.value = lines.filter(line => line.trim() !== tag).join('\n');
            delete unifiedTagState[tag];
            updateUnifiedTagList();
            // 自动切换到过滤标签标签页
            if (currentExcludeMode !== 'tag') {
              currentExcludeMode = 'tag';
              const tabTag = box.querySelector('#pteExcludeModeTag');
              const tabWork = box.querySelector('#pteExcludeModeWork');
              tabTag.style.borderBottomColor = '#409eff';
              tabTag.style.color = '#409eff';
              tabWork.style.borderBottomColor = 'transparent';
              tabWork.style.color = '#999';
            }
            updateExcludeList();
            showToast(`✅ 已添加到过滤标签: ${tag}`);
          }
        };
        btnContainer.appendChild(deleteBtn);

        div.appendChild(btnContainer);
        fragment.appendChild(div);
      });

      unifiedTagList.appendChild(fragment);
      updateSaveAllButtonState();
    };

    // 更新"保存全部"按钮状态
    const updateSaveAllButtonState = () => {
      const translatedCount = Object.values(unifiedTagState).filter(s => s.status === 'translated').length;
      const saveAllBtn = box.querySelector('#pteSaveAll');
      saveAllBtn.disabled = translatedCount === 0;
      saveAllBtn.style.opacity = translatedCount > 0 ? '1' : '0.5';
      saveAllBtn.style.cursor = translatedCount > 0 ? 'pointer' : 'not-allowed';
    };

    // 兼容旧代码的别名
    const updateTransInputList = updateUnifiedTagList;

    // 监听textarea的变化
    transInput.addEventListener('input', updateUnifiedTagList);

    // 监听搜索框的变化（支持虚拟滚动）
    const searchInput = box.querySelector('#pteSavedSearch');
    searchInput.addEventListener('input', () => {
      const searchText = searchInput.value.trim();
      const savedListEl = box.querySelector('#pteSavedList');
      
      // 检查是否使用虚拟滚动
      const isVirtualScroll = savedListEl.querySelector('#pteVirtualSpacer') !== null;
      
      if (isVirtualScroll) {
        // 虚拟滚动模式：筛选数据并重新渲染
        if (searchText) {
          virtualScrollState.filteredEntries = virtualScrollState.allEntries.filter(([original, transData]) => {
            const translation = typeof transData === 'string' ? transData : transData.translation;
            return pinyinMatch(translation, searchText);
          });
          virtualScrollState.isSearching = true;
        } else {
          virtualScrollState.filteredEntries = virtualScrollState.allEntries;
          virtualScrollState.isSearching = false;
        }
        
        // 重置滚动位置并重新渲染
        savedListEl.scrollTop = 0;
        renderVirtualItems(savedListEl);
      } else {
        // 非虚拟滚动模式：直接操作 DOM
        const items = savedListEl.querySelectorAll('div[data-original]');
        items.forEach(item => {
          const transSpan = item.querySelector('.pteTransDisplay');
          if (transSpan) {
            const trans = transSpan.textContent;
            const matches = pinyinMatch(trans, searchText);
            item.style.display = matches ? 'flex' : 'none';
          }
        });
      }
    });

    // 手动添加待翻译标签
    const manualTransInput = box.querySelector('#pteManualTransInput');
    const manualTransAddBtn = box.querySelector('#pteManualTransAdd');

    manualTransAddBtn.onclick = () => {
      const tag = manualTransInput.value.trim();
      if (!tag) {
        showToast('❌ 请输入标签');
        return;
      }

      // 检查是否已存在
      const existingTags = transInput.value.trim().split('\n').map(t => t.trim()).filter(Boolean);
      if (existingTags.includes(tag)) {
        showToast(`⚠️ 标签已存在`);
        return;
      }

      // 检查是否在排除列表中
      if (excludeTagsSet.has(tag)) {
        showToast(`❌ 此标签在排除列表中`);
        return;
      }

      // 添加标签
      if (transInput.value.trim()) {
        transInput.value += '\n' + tag;
      } else {
        transInput.value = tag;
      }

      manualTransInput.value = '';
      updateTransInputList();
      addOperationLog('手动添加待翻译', tag);
      updateOperationHistory();
      showToast(`✅ 已添加待翻译标签：${tag}`);
      manualTransInput.focus();
    };

    // 回车键添加
    manualTransInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        manualTransAddBtn.click();
      }
    });

    // 清空所有标签按钮
    const clearAllTagsBtn = box.querySelector('#pteClearAllTags');
    clearAllTagsBtn.onclick = () => {
      if (transInput.value.trim()) {
        showConfirm('确定要清空所有标签吗？此操作不可撤销。', () => {
          transInput.value = '';
          updateTransInputList();
          addOperationLog('清空标签列表', '');
          updateOperationHistory();
          showToast('✅ 已清空所有标签');
        });
      } else {
        showToast('⚠️ 列表已为空');
      }
    };

    // 全部排除按钮
    const excludeAllBtn = box.querySelector('#pteExcludeAll');
    excludeAllBtn.onclick = (e) => {
      const allTags = transInput.value.trim().split('\n').map(t => t.trim()).filter(Boolean);
      
      if (allTags.length === 0) {
        showToast('⚠️ 没有标签可排除');
        return;
      }

      const confirmMsg = `确定要排除全部 ${allTags.length} 个标签吗？${e.ctrlKey ? '\n(将添加到过滤作品)' : '\n(将添加到过滤标签)'}`;
      
      showConfirm(confirmMsg, () => {
        if (e.ctrlKey) {
          // Ctrl+点击: 全部添加到过滤作品
          allTags.forEach(tag => {
            excludeWorksSet.add(tag);
            excludeWorksWithTime[tag] = Date.now();
          });
          saveExcludeFilters('works');
          
          // 自动切换到过滤作品标签页
          if (currentExcludeMode !== 'work') {
            currentExcludeMode = 'work';
            const tabTag = box.querySelector('#pteExcludeModeTag');
            const tabWork = box.querySelector('#pteExcludeModeWork');
            tabWork.style.borderBottomColor = '#ff9800';
            tabWork.style.color = '#ff9800';
            tabTag.style.borderBottomColor = 'transparent';
            tabTag.style.color = '#999';
          }
          
          // 清空标签列表
          transInput.value = '';
          updateTransInputList();
          updateExcludeList();
          addOperationLog('全部排除到过滤作品', `${allTags.length} 个`);
          updateOperationHistory();
          showToast(`✅ 已全部添加到过滤作品: ${allTags.length} 个标签`);
        } else {
          // 普通点击: 全部添加到过滤标签
          allTags.forEach(tag => {
            excludeTagsSet.add(tag);
            excludeTagsWithTime[tag] = Date.now();
          });
          saveExcludeFilters('tag');
          
          // 更新中间列的翻译结果展示
          updateTransResultAfterExclude();
          
          // 清空标签列表
          transInput.value = '';
          updateTransInputList();
          updateExcludeList();
          addOperationLog('全部排除到过滤标签', `${allTags.length} 个`);
          updateOperationHistory();
          showToast(`✅ 已全部添加到过滤标签: ${allTags.length} 个标签`);
        }
      });
    };

    // 提取选中作品标签
    box.querySelector('#pteExtractTags').onclick = async () => {
      let checkboxes = null;
      const settings = LS.get('tagManagerSettings', {});
      let useAuthorCrosPages = false;

      // 如果在作者页面并启用了跨页提取，先尝试抓取作者全部作品ID
      if (isUser() && settings.authorCrossPages) {
        try {
          const uid = location.pathname.match(/\/users\/(\d+)/)?.[1];
          if (uid) {
            // 先获取作者全部作品数量
            const ids = await allIllustIds(uid);
            if (ids && ids.length) {
              // 有勾选的作品吗？
              const checkedBoxes = document.querySelectorAll('.pxe-mini-checkbox:checked');

              // 如果既有勾选的作品，又启用了跨页，需要二次确认（只在设置中启用此功能时）
              if (checkedBoxes.length > 0 && ids.length > checkedBoxes.length && settings.confirmExtractMode) {
                // 弹出确认对话框（使用和标签管理器相同的风格）
                const confirmed = await new Promise(resolve => {
                  const confirmMask = document.createElement('div');
                  confirmMask.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    z-index: 2147483647;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
                  `;

                  const confirmBox = document.createElement('div');
                  confirmBox.style.cssText = `
                    width: min(420px, 85vw);
                    border-radius: 16px;
                    background: #fff;
                    box-shadow: 0 12px 40px rgba(0,0,0,.18);
                    padding: 20px;
                    font-size: 13px;
                    color: #444;
                    line-height: 1.6;
                  `;

                  confirmBox.innerHTML = `
                    <div style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #ff9800;">⚠️ 检测到多个提取选项</div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 20px; line-height: 1.8;">
                      <div style="margin-bottom: 12px;">
                        <span style="color: #333;">您同时：</span>
                      </div>
                      <div style="margin-left: 16px; margin-bottom: 8px;">
                        🔹 勾选了 <strong style="color: #ff9800; font-size: 14px;">${checkedBoxes.length}</strong> 个作品
                      </div>
                      <div style="margin-left: 16px; margin-bottom: 12px;">
                        🔹 启用了作者跨页提取（全部 <strong style="color: #ff9800; font-size: 14px;">${ids.length}</strong> 个作品）
                      </div>
                      <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-left: 4px solid #ff9800; border-radius: 4px; font-size: 12px;">
                        💡 请选择您要提取哪个？
                      </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                      <button id="pteConfirmCheckOnly" style="padding: 8px 16px; border: 1px solid #d9d9d9; border-radius: 4px; background: white; color: #333; cursor: pointer; font-size: 12px; font-weight: 500;">只提取勾选</button>
                      <button id="pteConfirmAll" style="padding: 8px 16px; border: none; border-radius: 4px; background: #ff9800; color: white; cursor: pointer; font-size: 12px; font-weight: 600;">全部作品</button>
                    </div>
                  `;

                  confirmMask.appendChild(confirmBox);
                  document.body.appendChild(confirmMask);

                  const checkOnlyBtn = confirmBox.querySelector('#pteConfirmCheckOnly');
                  const allBtn = confirmBox.querySelector('#pteConfirmAll');

                  checkOnlyBtn.onclick = () => {
                    confirmMask.remove();
                    resolve('checked');
                  };

                  allBtn.onclick = () => {
                    confirmMask.remove();
                    resolve('all');
                  };

                  // ESC 和点击外部关闭
                  const handleEsc = (e) => {
                    if (e.key === 'Escape') {
                      confirmMask.remove();
                      document.removeEventListener('keydown', handleEsc);
                      resolve(null);
                    }
                  };

                  confirmMask.onclick = (e) => {
                    if (e.target === confirmMask) {
                      confirmMask.remove();
                      document.removeEventListener('keydown', handleEsc);
                      resolve(null);
                    }
                  };

                  document.addEventListener('keydown', handleEsc);
                });

                if (confirmed === 'checked') {
                  // 用户选择只提取勾选的
                  checkboxes = document.querySelectorAll('.pxe-mini-checkbox:checked');
                } else if (confirmed === 'all') {
                  // 用户选择提取全部
                  checkboxes = ids.map(id => ({ value: id }));
                  useAuthorCrosPages = true;
                } else {
                  // 用户取消
                  return;
                }
              } else {
                // 没有勾选作品，或者勾选的和全部作品数量相同，直接提取全部
                checkboxes = ids.map(id => ({ value: id }));
                useAuthorCrosPages = true;
              }
            }
          }
        } catch (e) {
          console.error('获取作者全部作品失败:', e);
        }
      }

      // 如果没有使用作者跨页，使用页面上勾选的复选框
      if (!checkboxes) {
        checkboxes = document.querySelectorAll('.pxe-mini-checkbox:checked');

        // 如果在详情页且没有勾选作品，则提取当前作品
        if (!checkboxes.length && isArtwork()) {
          const currentId = location.pathname.match(/\/artworks\/(\d+)/)?.[1];
          if (currentId) {
            checkboxes = [{ value: currentId }]; // 伪造一个checkbox对象
          }
        }
      }

      if (!checkboxes || (Array.isArray(checkboxes) ? checkboxes.length === 0 : checkboxes.length === 0)) {
        showToast('请先勾选要导入的作品，或在作品/作者页面使用，或在设置中开启作者跨页提取');
        return;
      }

      const extractBtn = box.querySelector('#pteExtractTags');
      extractBtn.disabled = false; // 保持启用状态以便切换暂停/继续
      extractBtn.textContent = useAuthorCrosPages ? '⏳ 跨页提取中...' : '⏳ 提取中...';

      // 暂停控制
      let isPaused = false;
      let pauseResolve = null;

      // 改变提取按钮的功能为暂停/继续
      const originalOnclick = extractBtn.onclick;
      extractBtn.onclick = (e) => {
        e.stopPropagation();
        isPaused = !isPaused;
        if (isPaused) {
          // 暂停：显示"已暂停 xx/xx"
          extractBtn.textContent = `⏸ 已暂停 ${processed}/${totalWorks}`;
        } else {
          // 继续：显示"▶ 继续提取"
          extractBtn.textContent = '▶ 继续提取';
        }
        if (!isPaused && pauseResolve) {
          pauseResolve();
          pauseResolve = null;
        }
      };

      const allTags = new Set();
      let processed = 0;
      let failed = 0;
      const failedIds = [];
      const totalWorks = checkboxes.length;

      // 从作业提取标签
      for (const checkbox of checkboxes) {
        // 检查暂停状态
        while (isPaused) {
          // 当暂停时，持续显示"已暂停 xx/xx"
          extractBtn.textContent = `⏸ 已暂停 ${processed}/${totalWorks}`;
          await new Promise(resolve => {
            pauseResolve = resolve;
          });
        }

        try {
          // 获取作品ID的多种方式
          let illustId = null;

          // 方法1：从checkbox的value属性获取
          if (checkbox.value && /^\d+$/.test(checkbox.value)) {
            illustId = checkbox.value;
          }

          // 方法2：从checkbox的data-id属性获取
          if (!illustId && checkbox.dataset?.id) {
            illustId = checkbox.dataset.id;
          }

          // 方法3：从nearby的 a 标签获取ID
          if (!illustId && checkbox.closest) {
            const link = checkbox.closest('[class*="item"], [class*="illust"], article')?.querySelector('a[href*="/artworks/"]');
            if (link) {
              const match = link.href.match(/\/artworks\/(\d+)/);
              if (match) illustId = match[1];
            }
          }

          // 方法4：从 name 属性获取（有些 checkbox 的 name 可能包含 ID）
          if (!illustId && checkbox.name) {
            const match = checkbox.name.match(/\d+/);
            if (match) illustId = match[0];
          }

          if (!illustId) {
            console.warn('无法获取作品ID');
            failed++;
            extractBtn.textContent = `已提取${processed}/${totalWorks}`;
            continue;
          }

          // 官方API获取信息
          try {
            // 使用设置的请求间隔，带随机抖动（±30%）以避免固定节奏被识别
            const settings = LS.get('tagManagerSettings', {});
            const baseInterval = (settings.requestInterval && Number(settings.requestInterval) >= 0) ? Number(settings.requestInterval) : 1000;
            const jitter = Math.round(baseInterval * 0.6);
            const delay = Math.max(0, baseInterval + (Math.random() * 2 - 1) * jitter);
            await new Promise(resolve => setTimeout(resolve, delay));

            const info = await getJSON(`https://www.pixiv.net/ajax/illust/${illustId}`);
            if (info.body?.tags?.tags) {
              const tagList = info.body.tags.tags;
              // 提取原始标签（日文或英文），翻译由用户在标签管理器中手动执行
              const tags = tagList.map(t => t?.tag).filter(Boolean);

              tags.forEach(t => allTags.add(t));
              processed++;
              // 只在未暂停时更新显示
              if (!isPaused) {
                extractBtn.textContent = `已提取${processed}/${totalWorks}`;
              }
            } else {
              failed++;
              failedIds.push(illustId);
              // 只在未暂停时更新显示
              if (!isPaused) {
                extractBtn.textContent = `已提取${processed}/${totalWorks}`;
              }
            }
          } catch (e) {
            console.error(`获取作品 ${illustId} 的标签失败:`, e);
            failed++;
            failedIds.push(illustId);
            // 只在未暂停时更新显示
            if (!isPaused) {
              extractBtn.textContent = `已提取${processed}/${totalWorks}`;
            }
          }
        } catch (e) {
          console.error('提取标签失败:', e);
            failed++;
            // illustId may be undefined here
            if (illustId) failedIds.push(illustId);
          // 只在未暂停时更新显示
          if (!isPaused) {
            extractBtn.textContent = `已提取${processed}/${totalWorks}`;
          }
        }
      }

      if (allTags.size === 0) {
        showToast(`未能提取到标签（成功${processed}件，失败${failed}件）。请检查：\n1. 是否在 Pixiv 列表页或详情页\n2. 是否正确勾选了作品`);
        extractBtn.disabled = false;
        extractBtn.textContent = '提取标签';
        // 恢复按钮功能
        extractBtn.onclick = originalOnclick;
        // 移除暂停按钮行
        const pauseBtnRow = box.querySelector('#ptePauseBtn')?.parentElement;
        if (pauseBtnRow) pauseBtnRow.remove();
        return;
      }

      // 检查是否已翻译
      const savedTranslations = LS.get('tagTranslations', {});
      const savedTagsList = Object.keys(savedTranslations);

      // 提取标签到输入框
      const existingTags = transInput.value.trim().split('\n').filter(Boolean);

      // 直接从 allTags 中移除已保存的标签（不区分大小写）
      const tagsToFilter = new Set();
      allTags.forEach(t => {
        const isSaved = savedTagsList.some(st => lower(st) === lower(t));
        const isExcluded = Array.from(excludeTagsSet).some(ex => {
          const lowerEx = lower(ex);
          return lower(t).includes(lowerEx) || lowerEx.includes(lower(t));
        });
        if (!isSaved && !isExcluded) {
          tagsToFilter.add(t);
        }
      });

      // 过滤：不重复（不在输入框中）
      const newTags = Array.from(tagsToFilter).filter(t => !existingTags.includes(t));

      // 最重要：以实际待翻译区为准
      const actualTransInputCount = transInput.value.trim().split('\n').filter(Boolean).length;

      // 重新梳理：所有标签应该被完整分类为：已保存 + 已排除 + 待翻译 + 新标签
      // 使用互斥分类方式，结合 allTags 和实际待翻译区
      const allTagsInUse = new Set([...Array.from(allTags), ...existingTags]);  // 合并 allTags 和实际待翻译区的标签

      const tagClassification = {};  // 记录每个标签的分类

      Array.from(allTagsInUse).forEach(t => {
        // 先检查是否已保存（不区分大小写）
        const isSaved = savedTagsList.some(st => lower(st) === lower(t));
        if (isSaved) {
          tagClassification[t] = 'saved';
        } else {
          // 再检查是否已排除（精确匹配）
          const lowerTag = lower(t);
          const isExcluded = Array.from(excludeTagsSet).some(ex => {
            return lower(ex) === lowerTag;
          });
          if (isExcluded) {
            tagClassification[t] = 'excluded';
          } else if (existingTags.includes(t)) {
            tagClassification[t] = 'existing';
          } else {
            tagClassification[t] = 'new';
          }
        }
      });

      // 计算各分类数量
      const classifiedSaved = Object.entries(tagClassification).filter(([_, c]) => c === 'saved');
      const classifiedExcluded = Object.entries(tagClassification).filter(([_, c]) => c === 'excluded');
      const classifiedExisting = Object.entries(tagClassification).filter(([_, c]) => c === 'existing');
      const classifiedNew = Object.entries(tagClassification).filter(([_, c]) => c === 'new');

      const savedCount = classifiedSaved.length;
      const excludedCount = classifiedExcluded.length;
      const existingInTransInputCount = classifiedExisting.length;
      const totalTagsCount = allTagsInUse.size;

      // Debug 日志：标签分类结果
      debugLog('EXTRACT', '标签分类完成', {
        total: totalTagsCount,
        new: classifiedNew.length,
        saved: classifiedSaved.length,
        excluded: classifiedExcluded.length,
        existing: classifiedExisting.length,
        savedTags: classifiedSaved.map(([t, _]) => t), // 显示具体的已保存标签
        excludedTags: classifiedExcluded.map(([t, _]) => t), // 显示具体的已排除标签
        newTags: classifiedNew.map(([t, _]) => t).slice(0, 10) // 只显示前10个
      });

      if (classifiedNew.length === 0) {
        const messages = [`所有标签已处理 (共${totalTagsCount}个)`];
        if (savedCount > 0) messages.push(`${savedCount}个已保存`);
        if (excludedCount > 0) messages.push(`${excludedCount}个已排除`);
        if (existingInTransInputCount > 0) messages.push(`${existingInTransInputCount}个待翻译区中已有`);

        // 清空待翻译区（因为所有标签都已处理）
        transInput.value = '';

        // 记录操作
        addOperationLog('提取标签', `无新标签（共${totalTagsCount}个：${savedCount}个已保存，${excludedCount}个已排除，${existingInTransInputCount}个待翻译）`);
        updateOperationHistory();
        // 确保待翻译列表显示
        updateTransInputList();
        showToast(messages.join('，'));
      } else {
        // 只添加新标签，追加到之前的内容（避免覆盖用户原有待翻译项）
        const newTagsList = classifiedNew.map(([t, _]) => t);
        const combined = Array.from(new Set([...existingTags, ...newTagsList]));
        transInput.value = combined.join('\n');
        updateTransInputList();
        const msgParts = [`✅ 已提取 ${classifiedNew.length} 个新标签（共${totalTagsCount}个）`];
        if (savedCount > 0) msgParts.push(`${savedCount}个已保存被过滤`);
        if (excludedCount > 0) msgParts.push(`${excludedCount}个已排除`);
        if (existingInTransInputCount > 0) msgParts.push(`${existingInTransInputCount}个待翻译区中已有`);
        msgParts.push(`成功${processed}个作品`);
        addOperationLog('提取标签', `${classifiedNew.length}个新标签，共${totalTagsCount}个（${savedCount}个已保存，${excludedCount}个已排除，${existingInTransInputCount}个待翻译）`);
        updateOperationHistory();
        // 在控制台输出失败的作品ID，便于排查
        if (failedIds.length) console.warn('[PTE] 提取时以下作品获取标签失败：', failedIds);
        showToast(msgParts.join('，'));
      }

      extractBtn.disabled = false;
      extractBtn.textContent = '提取标签';
      // 恢复按钮功能
      extractBtn.onclick = originalOnclick;
      // 移除暂停按钮行
      const pauseBtnRow = box.querySelector('#ptePauseBtn')?.parentElement;
      if (pauseBtnRow) pauseBtnRow.remove();
    };

    // 一键翻译所有待翻译标签
    box.querySelector('#pteTranslateAll').onclick = async () => {
      const tags = transInput.value.split('\n').map(t => t.trim()).filter(Boolean);
      if (!tags.length) {
        showToast('请输入至少一个标签');
        return;
      }

      // 检查是否所有标签都已翻译
      const pendingTags = tags.filter(tag => !unifiedTagState[tag] || unifiedTagState[tag].status !== 'translated');
      if (pendingTags.length === 0) {
        showToast('✅ 所有标签都已翻译完成');
        return;
      }

      const btn = box.querySelector('#pteTranslateAll');
      btn.disabled = true;
      btn.textContent = `⏳ 翻译中 (0/${pendingTags.length})...`;

      // 将待翻译标签设置为翻译中状态
      pendingTags.forEach(tag => {
        unifiedTagState[tag] = { status: 'translating', translation: '' };
      });
      updateUnifiedTagList();

      // 并发翻译（限制并发数，默认 5）
      const concurrency = LS.get('translateConcurrency', 5) || 5;

      async function parallelLimit(items, limit, worker, onProgress) {
        let idx = 0;
        let completed = 0;
        const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
          while (true) {
            let i;
            // 取下一个索引
            if (idx < items.length) {
              i = idx++;
            } else break;

            const item = items[i];
            try {
              await worker(item, i);
            } catch (e) {
              // worker 内部负责记录错误状态
            }
            completed++;
            if (typeof onProgress === 'function') onProgress(completed, items.length);
          }
        });
        await Promise.all(runners);
      }

      // worker：翻译单个标签并更新状态
      const worker = async (tag) => {
        try {
          const translation = await translateWithQwen(tag, 'zh');
          unifiedTagState[tag] = { status: 'translated', translation };
        } catch (err) {
          unifiedTagState[tag] = { status: 'pending', translation: '' };
          debugLog('TRANSLATE', '翻译失败', { tag, error: err && err.message ? err.message : err });
        }
      };

      // 开始并发翻译
      btn.textContent = `⏳ 翻译中 (0/${pendingTags.length})...`;
      await parallelLimit(pendingTags, concurrency, async (tag) => {
        await worker(tag);
        // 每个完成后实时更新 UI（在进度回调里也会更新一次）
        updateUnifiedTagList();
      }, (done, total) => {
        btn.textContent = `⏳ 翻译中 (${done}/${total})...`;
      });

      btn.disabled = false;
      btn.textContent = '一键翻译';

      addOperationLog('翻译标签', `${pendingTags.length} 个`);
      updateOperationHistory();
      showToast(`✅ 翻译完成（${pendingTags.length} 个）`);
    };

    // 清空翻译结果
    box.querySelector('#pteClearTransResult').onclick = () => {
      // 打开标签管理设置功能
      const settingsDialog = document.createElement('div');
      settingsDialog.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:2px solid #409eff;border-radius:8px;padding:20px;z-index:2147483648;box-shadow:0 4px 16px rgba(0,0,0,0.2);min-width:400px;max-width:600px;';
      settingsDialog.innerHTML = `
        <div style="font-weight:600;color:#1f6fff;margin-bottom:16px;font-size:14px;">⚙️ 标签管理设置</div>
        <div style="color:#666;margin-bottom:16px;font-size:12px;line-height:1.8;">
          <div style="margin-bottom:12px;">
            <label style="display:block;margin-bottom:6px;font-weight:600;">搜索引擎选择</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="google" style="cursor:pointer;" />
                <span>Google</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="baidu" style="cursor:pointer;" />
                <span>Baidu</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="bing" style="cursor:pointer;" />
                <span>Bing</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="yahoo-jp" style="cursor:pointer;" />
                <span>Yahoo Japan</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="goo" style="cursor:pointer;" />
                <span>Goo</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="sogou" style="cursor:pointer;" />
                <span>Sogou</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="radio" name="searchEngine" value="custom" style="cursor:pointer;" />
                <span>自定义</span>
              </label>
            </div>
            <div style="color:#999;font-size:11px;margin-bottom:8px;">用于待翻译区的搜索按钮</div>
            <div style="display:none;" id="customEngineDiv" style="margin-bottom:8px;">
              <label style="display:block;margin-bottom:4px;font-size:11px;font-weight:600;">自定义搜索 URL</label>
              <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
                <input type="text" id="customEngineUrl" placeholder="输入网站名称或完整 URL" style="flex:1;padding:6px;border:1px solid #d9d9d9;border-radius:3px;font-size:11px;box-sizing:border-box;" />
                <button id="customEnginePresets" style="padding:6px 12px;border:1px solid #d9d9d9;border-radius:3px;background:#f5f5f5;color:#666;cursor:pointer;font-size:11px;white-space:nowrap;">📋 内置</button>
              </div>
              <div id="presetMenu" style="display:none;position:absolute;background:#fff;border:1px solid #d9d9d9;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:10000;min-width:200px;max-height:300px;overflow-y:auto;">
                <div style="padding:6px;">
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="pixiv-dic">Pixiv百科</div>
                  <hr style="margin:4px 0;border:none;border-top:1px solid #e0e0e0;" />
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="bing-translate">Bing翻译</div>
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="baidu">百度翻译</div>
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="deepl">DeepL翻译</div>
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="google-translate">Google翻译</div>
                  <div style="padding:6px;cursor:pointer;hover:background:#f0f0f0;" data-preset="youdao">有道翻译</div>
                </div>
              </div>
              <div style="color:#999;font-size:10px;margin-top:8px;">💡 URL 格式说明：<br/>格式：https://site.com/search?q={tag}<br/>其中 {tag} 会被替换为搜索词</div>
              <div style="color:#999;font-size:10px;margin-top:4px;">💡 提示：输入网站名称（如 "pixiv"）会自动识别，或输入完整 URL</div>
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <input type="checkbox" id="settingDebugMode" style="cursor:pointer;" />
              <span style="cursor:default;">Debug 模式</span>
            </label>
            <div style="color:#999;font-size:11px;margin-left:24px;">启用后会在浏览器控制台输出详细日志</div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <input type="checkbox" id="settingConfirmExtractMode" style="cursor:pointer;" />
              <span style="cursor:default;">跨页提取时显示确认对话框</span>
            </label>
            <div style="color:#999;font-size:11px;margin-left:24px;">启用后，如果同时有勾选和跨页提取选项，会弹出对话框让你二次确认</div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <input type="checkbox" id="settingAuthorCrossPages" style="cursor:pointer;" />
              <span style="cursor:default;">在作者详情页跨页提取所有作品标签（逐页抓取）</span>
            </label>
            <div style="color:#999;font-size:11px;margin-left:24px;">启用后在作者详情页点击“提取标签”会抓取作者所有作品（可能较慢）</div>
          </div>
          <div style="margin-bottom:12px;padding-top:12px;border-top:1px dashed #e0e0e0;">
            <label style="display:block;margin-bottom:6px;font-weight:600;"> 翻译 API 设置</label>
            <div style="margin-bottom:8px;">
              <select id="settingTranslateProvider" style="width:100%;padding:6px;border:1px solid #d9d9d9;border-radius:3px;font-size:12px;">
                <option value="none">Pixiv官方翻译（优先）</option>
                <option value="ollama">Ollama</option>
                <option value="groq">Groq</option>
                <option value="openai">OpenAI</option>
                <option value="deepseek">DeepSeek</option>
                <option value="gemini">Google Gemini</option>
                <option value="custom">自定义 API</option>
              </select>
            </div>
            <div id="translateApiKeyDiv" style="display:none;margin-bottom:8px;">
              <input type="password" id="settingTranslateApiKey" placeholder="输入 API Key" style="width:100%;padding:6px;border:1px solid #d9d9d9;border-radius:3px;font-size:12px;box-sizing:border-box;" />
            </div>
            <div id="translateCustomDiv" style="display:none;">
              <input type="text" id="settingTranslateCustomUrl" placeholder="API URL (如 https://api.example.com/v1/chat/completions)" style="width:100%;padding:6px;border:1px solid #d9d9d9;border-radius:3px;font-size:12px;box-sizing:border-box;margin-bottom:6px;" />
              <input type="text" id="settingTranslateCustomModel" placeholder="模型名称 (如 gpt-4o-mini)" style="width:100%;padding:6px;border:1px solid #d9d9d9;border-radius:3px;font-size:12px;box-sizing:border-box;" />
            </div>
          </div>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="settingsCancel" style="padding:8px 16px;border:1px solid #d9d9d9;border-radius:6px;background:#f5f5f5;color:#666;cursor:pointer;font-weight:600;font-size:12px;">取消</button>
          <button id="settingsSave" style="padding:8px 16px;border:none;border-radius:6px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">保存设置</button>
        </div>
      `;

      const settingsMask = document.createElement('div');
      settingsMask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:transparent;z-index:2147483646;pointer-events:none;';

      document.body.appendChild(settingsMask);
      document.body.appendChild(settingsDialog);

      // 加载当前设置
      const currentSettings = LS.get('tagManagerSettings', { searchEngine: 'google', customEngineUrl: '', debugMode: false, confirmExtractMode: false });

      const searchEngineRadios = settingsDialog.querySelectorAll('input[name="searchEngine"]');
      searchEngineRadios.forEach(radio => {
        if (radio.value === currentSettings.searchEngine) {
          radio.checked = true;
        }
      });

      const customEngineDiv = settingsDialog.querySelector('#customEngineDiv');
      const customEngineInput = settingsDialog.querySelector('#customEngineUrl');
      customEngineInput.value = currentSettings.customEngineUrl || '';

      // 加载复选框设置
      const debugModeCheckbox = settingsDialog.querySelector('#settingDebugMode');
      const authorCrossPagesCheckbox = settingsDialog.querySelector('#settingAuthorCrossPages');
      const confirmExtractModeCheckbox = settingsDialog.querySelector('#settingConfirmExtractMode');
      debugModeCheckbox.checked = currentSettings.debugMode || false;
      authorCrossPagesCheckbox.checked = currentSettings.authorCrossPages || false;
      confirmExtractModeCheckbox.checked = currentSettings.confirmExtractMode || false;

      // 翻译 API 设置
      const translateConfig = getTranslateConfig();
      const translateProviderSelect = settingsDialog.querySelector('#settingTranslateProvider');
      const translateApiKeyDiv = settingsDialog.querySelector('#translateApiKeyDiv');
      const translateApiKeyInput = settingsDialog.querySelector('#settingTranslateApiKey');
      const translateCustomDiv = settingsDialog.querySelector('#translateCustomDiv');
      const translateCustomUrlInput = settingsDialog.querySelector('#settingTranslateCustomUrl');
      const translateCustomModelInput = settingsDialog.querySelector('#settingTranslateCustomModel');
      
      translateProviderSelect.value = translateConfig.provider || 'none';
      translateApiKeyInput.value = translateConfig.apiKey || '';
      translateCustomUrlInput.value = translateConfig.customUrl || '';
      translateCustomModelInput.value = translateConfig.customModel || '';
      
      // 显示/隐藏 API Key 和自定义字段
      const updateTranslateUI = () => {
        const provider = translateProviderSelect.value;
        // 加载对应provider的API配置
        const allConfigs = LS.get('translateApiConfigs', {});
        const config = allConfigs[provider] || {};
        translateApiKeyInput.value = config.apiKey || '';
        translateCustomUrlInput.value = config.customUrl || '';
        translateCustomModelInput.value = config.customModel || '';
        
        // 显示/隐藏字段
        translateApiKeyDiv.style.display = ['groq', 'openai', 'deepseek', 'gemini', 'custom'].includes(provider) ? 'block' : 'none';
        translateCustomDiv.style.display = provider === 'custom' ? 'block' : 'none';
      };
      updateTranslateUI();
      translateProviderSelect.addEventListener('change', updateTranslateUI);

      // 切换自定义引擎输入框的显示
      searchEngineRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (radio.value === 'custom') {
            customEngineDiv.style.display = 'block';
          } else {
            customEngineDiv.style.display = 'none';
          }
        });
      });

      // 初始化显示状态
      if (currentSettings.searchEngine === 'custom') {
        customEngineDiv.style.display = 'block';
      }

      // 预设菜单功能
      const presetMenu = settingsDialog.querySelector('#presetMenu');
      const presetsBtn = settingsDialog.querySelector('#customEnginePresets');
      const presetItems = presetMenu.querySelectorAll('[data-preset]');

          customEnginePresets.onclick = (e) => {
            e.stopPropagation();
            const presetMenu = settingsDialog.querySelector('#presetMenu');
            presetMenu.style.display = presetMenu.style.display === 'none' ? 'block' : 'none';
          };

          customEngineInput.addEventListener('click', (e) => {
            e.stopPropagation();
          });

      presetItems.forEach(item => {
        item.onclick = () => {
          const preset = item.dataset.preset;
          // 根据预设值直接填入对应的URL
          const presetUrls = {
            'pixiv-dic': 'https://dic.pixiv.net/a/{tag}',
            'wiki-ja': 'https://ja.wikipedia.org/wiki/{tag}',
            'moegirl': 'https://zh.moegirl.org.cn/{tag}',
            'bluearchive': 'https://wiki.biligame.com/ba/Students',
            'bluearchive-gk': 'https://www.gamekee.com/ba/',
            'azurlane': 'https://wiki.biligame.com/azurlane/{tag}',
            'bilibili-wiki': 'https://wiki.biligame.com/{tag}',
            'google-translate': 'https://translate.google.com/?text={tag}',
            'deepl': 'https://www.deepl.com/translator#en/ja/{tag}',
            'youdao': 'https://fanyi.youdao.com/#/text?text={tag}',
            'baidu': 'https://fanyi.baidu.com/#en/zh/{tag}',
            'bing-translate': 'https://www.bing.com/translator'
          };
          customEngineInput.value = presetUrls[preset] || preset;
          presetMenu.style.display = 'none';
        };
      });

      // 点击其他地方关闭菜单
      document.addEventListener('click', (e) => {
        if (!customEngineDiv.contains(e.target)) {
          presetMenu.style.display = 'none';
        }
      });

      const debugCheckbox = settingsDialog.querySelector('#settingDebugMode');
      debugCheckbox.checked = currentSettings.debugMode || false;

      // 保存按钮
      settingsDialog.querySelector('#settingsSave').onclick = () => {
        const selectedEngine = settingsDialog.querySelector('input[name="searchEngine"]:checked').value;
        let customUrl = customEngineInput.value.trim();

        // 如果选择自定义且输入了URL，自动识别和补全
        if (selectedEngine === 'custom' && customUrl) {
          // 自动识别常见的搜索引擎（支持模糊匹配）
          const urlPatterns = [
            { keywords: ['pixiv', 'dic', '百科'], url: 'https://dic.pixiv.net/a/{tag}' },
            { keywords: ['wiki', '维基'], url: 'https://ja.wikipedia.org/wiki/{tag}' },
            { keywords: ['bilibili', '网页'], url: 'https://wiki.biligame.com/{tag}' },
            { keywords: ['google', '谷歌'], url: 'https://translate.google.com/?text={tag}' },
            { keywords: ['deepl', '深蓝'], url: 'https://www.deepl.com/translator#en/ja/{tag}' },
            { keywords: ['youdao', '有道'], url: 'https://fanyi.youdao.com/#/text?text={tag}' },
            { keywords: ['baidu', '百度'], url: 'https://fanyi.baidu.com/#en/zh/{tag}' },
            { keywords: ['bing', '必应'], url: 'https://www.bing.com/translator' }
          ];

          const lowerInput = customUrl.toLowerCase();

          // 检查输入是否匹配任何已知的模式（模糊匹配）
          for (const pattern of urlPatterns) {
            if (pattern.keywords.some(keyword => lowerInput.includes(keyword))) {
              customUrl = pattern.url;
              break;
            }
          }
        }

        const settings = {
          searchEngine: selectedEngine,
          customEngineUrl: customUrl,
          debugMode: debugModeCheckbox.checked,
          authorCrossPages: authorCrossPagesCheckbox.checked,
          confirmExtractMode: confirmExtractModeCheckbox.checked
        };
        LS.set('tagManagerSettings', settings);
        
        // 保存翻译 API 配置 - 按provider独立存储
        const provider = translateProviderSelect.value;
        const allConfigs = LS.get('translateApiConfigs', {});
        allConfigs[provider] = {
          apiKey: translateApiKeyInput.value.trim(),
          customUrl: translateCustomUrlInput.value.trim(),
          customModel: translateCustomModelInput.value.trim()
        };
        LS.set('translateApiConfigs', allConfigs);
        LS.set('translateProvider', provider);
        
        debugLog('STORAGE', 'localStorage 保存设置', { tagManagerSettings: settings, translateApiConfigs: allConfigs });
        settingsDialog.remove();
        settingsMask.remove();

        showToast('✅ 设置已保存');
        addOperationLog('修改设置', '标签管理设置');
        updateOperationHistory();
      };

      // 取消按钮
      settingsDialog.querySelector('#settingsCancel').onclick = () => {
        settingsDialog.remove();
        settingsMask.remove();
      };
    };

    // 导出列表（待翻译区的标签，JSON格式，可包含已填写的临时翻译）
    box.querySelector('#pteListExport').onclick = () => {
      const lines = transInput.value.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        showToast('待翻译区没有标签');
        return;
      }

      const tagsData = {};
      let exportedWithTrans = 0;

      lines.forEach(tag => {
        const t = tag.trim();
        if (!t) return;

        // 如果待翻译列表里已经有“临时翻译”，就一起导出
        const st = unifiedTagState?.[t];
        if (st && st.status === 'translated' && st.translation && String(st.translation).trim()) {
          tagsData[t] = String(st.translation).trim();
          exportedWithTrans++;
        } else {
          tagsData[t] = ''; // 仍然允许空值（未翻译）
        }
      });

      const data = { savedTags: tagsData };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `PTE待翻译标签.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addOperationLog('导出待翻译标签', `${lines.length} 个（含翻译 ${exportedWithTrans} 个）`);
      updateOperationHistory();
      showToast(`✅ 已导出 ${lines.length} 个待翻译标签（含翻译 ${exportedWithTrans} 个）`);
    };

    // 导入列表（从JSON文件导入标签到待翻译区）
    box.querySelector('#pteListImport').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            const tagsToImport = data.savedTags || data;

            if (!tagsToImport || Object.keys(tagsToImport).length === 0) {
              showToast('❌ 无效的JSON格式或没有标签数据');
              return;
            }

            const isExcludedTag = (tag) => {
              const lowerTag = lower(tag);
              return Array.from(excludeTagsSet).some(ex => lower(ex) === lowerTag);
            };

            const totalRead = Object.keys(tagsToImport).length;
            let filledTransCount = 0;        // JSON 中“已填写翻译”的条目数（不管是否重复）
            let appliedToExistingCount = 0;  // 翻译回灌到已存在标签（重复项）的数量
            let skippedExcludedCount = 0;    // 跳过排除标签数量

            // 获取当前待翻译区的标签（用于统计 duplicate + 判断是否是“已存在”）
            const currentLines = transInput.value.split('\n').filter(line => line.trim());
            const currentSet = new Set(currentLines.map(l => l.trim()));

            // 把导入 JSON 里的“翻译值”回灌到 unifiedTagState，让待翻译列表立刻出现输入框（无需再点翻译按钮）
            for (const [rawTag, rawVal] of Object.entries(tagsToImport)) {
              const t = (rawTag || '').trim();
              if (!t) continue;

              // 导入时跳过排除标签
              if (isExcludedTag(t)) { skippedExcludedCount++; continue; }

              // 兼容 value 是 string 或 {translation:"..."} 两种格式
              let trans = '';
              if (typeof rawVal === 'string') trans = rawVal;
              else if (rawVal && typeof rawVal === 'object') trans = rawVal.translation || '';

              trans = String(trans || '').trim();

              if (trans) {
                filledTransCount++;
                if (currentSet.has(t)) appliedToExistingCount++;
                unifiedTagState[t] = { status: 'translated', translation: trans };
              } else {
                // 没翻译：别覆盖已有 translated
                if (!unifiedTagState[t]) unifiedTagState[t] = { status: 'pending', translation: '' };
              }
            }

            // 添加新标签到待翻译区（同时跳过排除标签）
            const newTags = Object.keys(tagsToImport)
              .map(t => (t || '').trim())
              .filter(t => t && !isExcludedTag(t) && !currentSet.has(t));

            if (newTags.length > 0) {
              const existingContent = transInput.value.trim();
              transInput.value = existingContent ? (existingContent + '\n' + newTags.join('\n')) : newTags.join('\n');
            }

            updateTransInputList();

            const validRead = totalRead - skippedExcludedCount; // 读到的非排除标签数量
            const duplicates = validRead - newTags.length;

            let message = `✅ 已导入 ${validRead} 个待翻译标签`;
            if (filledTransCount > 0) {
              message += `，其中 ${filledTransCount} 个已填写翻译（已即时显示）`;
              if (appliedToExistingCount > 0) message += `（覆盖已存在 ${appliedToExistingCount} 个）`;
            }
            if (skippedExcludedCount > 0) message += `，已跳过 ${skippedExcludedCount} 个排除标签`;
            if (duplicates > 0) message += `（其中 ${duplicates} 个重复）`;

            addOperationLog('导入待翻译标签', `${validRead} 个（已填翻译 ${filledTransCount} 个，跳过 ${skippedExcludedCount} 个）`);
            updateOperationHistory();
            showToast(message);

          } catch (err) {
            showToast('❌ 文件解析失败或JSON格式错误');
          }
        };

        reader.readAsText(file);
      };

      input.click();
    };

    // 保存所有已翻译的标签
    box.querySelector('#pteSaveAll').onclick = () => {
      const translatedTags = Object.entries(unifiedTagState).filter(([_, state]) => state.status === 'translated');
      if (!translatedTags.length) {
        showToast('没有翻译结果可保存');
        return;
      }
      let count = 0;
      const tagsToRemoveFromInput = [];
      translatedTags.forEach(([tag, state]) => {
        const translation = state.translation.trim();
        // 检查是否在排除列表中
        if (!excludeTagsSet.has(tag) && translation) {
          savedTags[tag] = { translation: translation, timestamp: Date.now() };
          tagsToRemoveFromInput.push(tag);
          count++;
          // 从统一状态中移除
          delete unifiedTagState[tag];
        }
      });
      // 从待翻译区移除已保存的标签
      if (tagsToRemoveFromInput.length > 0) {
        const lines = transInput.value.split('\n');
        const filtered = lines.filter(line => !tagsToRemoveFromInput.includes(line.trim()));
        transInput.value = filtered.join('\n');
      }
      saveTags();
      updateSavedList();
      updateUnifiedTagList();
      if (count > 0) {
        addOperationLog('保存翻译', `${count} 个`);
        updateOperationHistory();
        showToast(`✅ 已保存 ${count} 个翻译`);
      } else {
        showToast('❌ 没有可保存的翻译（排除列表中的标签不能保存）');
      }
    };


    // 左侧排除标签 - 导出
    box.querySelector('#pteExcludeExport').onclick = () => {
      const currentSet = getCurrentSet();
      const timeMap = getCurrentTimeMap();
      const modeText = currentExcludeMode === 'tag' ? '过滤标签' : '过滤作品标签';
      const fileName = currentExcludeMode === 'tag' ? 'PTE过滤标签.json' : 'PTE过滤作品.json';
      // 导出列表
      const data = {
        type: currentExcludeMode,
        tags: Array.from(currentSet),
        tagsWithTime: timeMap
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addOperationLog(`导出${modeText}`, `${currentSet.size} 个`);
      updateOperationHistory();
      showToast(`✅ 已导出 ${currentSet.size} 个${modeText}`);
    };

    // 左侧排除标签 - 导入
    const createFileInput = (callback) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.csv';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            callback(event.target.result);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    // 通用导入处理函数（必须在导入对话框初始化之前定义）
    const processImport = (content, type) => {
      if (type === 'exclude') {
        const currentSet = getCurrentSet();
        const timeMap = getCurrentTimeMap();
        const modeText = currentExcludeMode === 'tag' ? '过滤标签' : '过滤作品标签';

        let tags = content.trim();

        if (tags.startsWith('[') && tags.endsWith(']')) {
          try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
              tags = parsed.join(',');
            }
          } catch (e) {}
        }
        
        // 兼容新格式的 JSON 导入
        if (tags.startsWith('{') && tags.endsWith('}')) {
          try {
            const parsed = JSON.parse(tags);
            if (parsed.tags && Array.isArray(parsed.tags)) {
              tags = parsed.tags.join(',');
              // 导入时间戳
              if (parsed.tagsWithTime) {
                Object.assign(timeMap, parsed.tagsWithTime);
              }
            }
          } catch (e) {}
        }

        tags = tags
          .replace(/^["']|["']$/gm, '')
          .replace(/[\n\r\t]+/g, ',')
          .replace(/\s*[,，]\s*/g, ',')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
          .join(',');

        if (tags) {
          const tagCount = tags.split(',').length;
          const now = Date.now();
          tags.split(',').forEach(t => {
            const trimmedTag = t.trim();
            currentSet.add(trimmedTag);
            if (!timeMap[trimmedTag]) {
              timeMap[trimmedTag] = now;
            }
          });
          LS.set(getStorageKey(), Array.from(currentSet).join(','));
          LS.set(getTimeStorageKey(), timeMap);
          updateExcludeList();
          if (currentExcludeMode === 'tag') {
            updateTransResultAfterExclude();
          }
          showToast(`✅ 已导入 ${tagCount} 个${modeText}`);
        } else {
          showToast('❌ 内容为空或格式错误');
        }
      } else if (type === 'saved') {

        // JSON格式
        if (content.startsWith('{') && content.endsWith('}')) {
          try {
            const data = JSON.parse(content);
            if (data.savedTags && typeof data.savedTags === 'object') {
              const now = Date.now();
              let imported = 0;
              Object.keys(data.savedTags).forEach(rawKey => {
                const value = data.savedTags[rawKey];
                const key = normalizeKey(rawKey);
                // 兼容旧格式和新格式；将条目保存为 { translation, timestamp }
                if (typeof value === 'string') {
                  savedTags[key] = { translation: value, timestamp: now };
                  imported++;
                } else if (typeof value === 'object' && value.translation) {
                  savedTags[key] = { translation: value.translation, timestamp: value.timestamp || now };
                  imported++;
                }
              });
              if (imported > 0) {
                saveTags();
                updateSavedList();
                showToast(`✅ 已导入 ${imported} 个翻译`);
              } else {
                showToast('❌ JSON格式错误：没有有效的翻译数据');
              }
              return;
            }
          } catch (e) {
            // 失败继续文本
          }
        }

        // 文本模式
        const lines = content.trim().split('\n').filter(Boolean);
        let imported = 0;

        lines.forEach(line => {
          const [original, translation] = line.split('|').map(s => s.trim());
          if (original && translation) {
            imported++;
          }
        });

        if (imported === 0) {
          showToast('❌ 格式错误，应为：原始标签|翻译\n每行一条或JSON格式');
          return;
        }

        lines.forEach(line => {
          const [original, translation] = line.split('|').map(s => s.trim());
          if (original && translation) {
            savedTags[original] = { translation: translation, timestamp: Date.now() };
          }
        });

        saveTags();
        // 更新所有相关UI
        updateSavedList();
        updateTransResultAfterExclude();
        showToast(`✅ 已导入 ${imported} 个翻译`);
      }
    };


    const importDialog = box.querySelector('#pteImportDialog');
    const importMask = box.querySelector('#pteImportMask');
    const fileInput = box.querySelector('#pteFileImportInput');

    const showImportDialog = (type) => {
      currentImportType = type;
      importDialog.style.display = 'block';
      importMask.style.display = 'block';
    };

    const hideImportDialog = () => {
      importDialog.style.display = 'none';
      importMask.style.display = 'none';
      currentImportType = null;
    };

    // 备份历史 - 查看和还原按钮
    box.querySelector('#pteBackupHistory').onclick = async () => {
      const backups = BackupManager.getBackups();
      
      if (!backups || backups.length === 0) {
        showToast('📭 暂无备份历史');
        return;
      }

      const backupListHtml = backups.map((backup, idx) => `
        <div style="padding:8px;border:1px solid #e0e0e0;border-radius:4px;background:#f9f9f9;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:12px;color:#333;margin-bottom:2px;">
              ${idx === 0 ? '🟢' : '⚪'} 备份 #${backups.length - idx}
            </div>
            <div style="font-size:11px;color:#666;margin-bottom:2px;">
              ${backup.date}
            </div>
            <div style="font-size:11px;color:#999;">
              标签: ${backup.stats?.tagsCount || 0} | 过滤标签: ${backup.stats?.excludeTagsCount || 0} | 过滤作品: ${backup.stats?.excludeWorksCount || 0}
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px;">
            <button data-backup-idx="${idx}" class="pte-restore-backup" style="padding:4px 8px;border:none;border-radius:3px;background:#409eff;color:#fff;cursor:pointer;font-weight:600;font-size:11px;">还原</button>
            <button data-backup-idx="${idx}" class="pte-delete-backup" style="padding:4px 8px;border:none;border-radius:3px;background:#f56c6c;color:#fff;cursor:pointer;font-weight:600;font-size:11px;">删除</button>
          </div>
        </div>
      `).join('');

      const historyModal = document.createElement('div');
      historyModal.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,.35);
        backdrop-filter: blur(2px);
        z-index: 2147483648;
        display: flex; align-items: center; justify-content: center;
      `;

      const historyBox = document.createElement('div');
      Object.assign(historyBox.style, {
        width: 'min(600px,90vw)',
        borderRadius: '12px',
        background: '#fff',
        boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        padding: '20px',
        fontSize: '13px',
        color: '#444',
        lineHeight: '1.6',
        maxHeight: '600px',
        overflow: 'auto'
      });

      historyBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;border-bottom:2px solid #409eff;padding-bottom:12px;">
          <div style="font-size:16px;font-weight:700;color:#1f6fff;">📜 备份历史 (共 ${backups.length} 个)</div>
          <button id="pteBackupClearAll" style="margin-left:auto;padding:6px 12px;border:1px solid #f56c6c;border-radius:4px;background:#fff;color:#f56c6c;cursor:pointer;font-weight:600;font-size:11px;">清空所有</button>
        </div>
        <div id="pteBackupList" style="max-height:450px;overflow-y:auto;">
          ${backupListHtml}
        </div>
      `;

      historyModal.appendChild(historyBox);
      document.body.appendChild(historyModal);

      historyBox.querySelector('#pteBackupClearAll').onclick = () => {
        if (!confirm('确定要清空所有备份吗？此操作无法撤销。')) return;
        LS.set('pteBackups', []);
        showToast('✅ 所有备份已清空');
        historyModal.remove();
      };

      historyBox.querySelectorAll('.pte-restore-backup').forEach(btn => {
        btn.onclick = async () => {
          const idx = parseInt(btn.getAttribute('data-backup-idx'));
          const backup = backups[idx];
          
          if (!confirm(`确定要还原到 ${backup.date} 的备份吗？\n\n现有的标签将被覆盖。`)) return;
          
          try {
            showToast('⏳ 正在还原备份...');
            
            // 构造完整的导入数据
            const importData = {
              version: '1.4',
              exportTime: new Date().toISOString(),
              tags: backup.tags || {},
              excludeTags: backup.excludeTags || '',
              excludeTagsWithTime: backup.excludeTagsWithTime || {},
              excludeWorksTags: backup.excludeWorksTags || '',
              excludeWorksWithTime: backup.excludeWorksWithTime || {},
              stats: backup.stats || {}
            };
            
            const success = await TagDB.importAllData(importData);
            if (success) {
              Object.assign(savedTags, backup.tags || {});
              excludeTagsSet.clear();
              (backup.excludeTags || '').split(',').filter(Boolean).forEach(t => excludeTagsSet.add(t));
              Object.assign(excludeTagsWithTime, backup.excludeTagsWithTime || {});
              
              excludeWorksSet.clear();
              (backup.excludeWorksTags || '').split(',').filter(Boolean).forEach(t => excludeWorksSet.add(t));
              Object.assign(excludeWorksWithTime, backup.excludeWorksWithTime || {});
              
              updateSavedList();
              updateExcludeList();
              addOperationLog('还原备份', `备份时间: ${backup.date}`);
              updateOperationHistory();
              
              showToast(`✅ 已还原到 ${backup.date} 的备份`);
              historyModal.remove();
            } else {
              showToast('❌ 还原失败');
            }
          } catch (e) {
            console.warn('[PTE] 还原备份失败:', e);
            showToast('❌ 还原备份失败');
          }
        };
      });

      historyBox.querySelectorAll('.pte-delete-backup').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.getAttribute('data-backup-idx'));
          if (!confirm('确定要删除这个备份吗？')) return;
          
          backups.splice(idx, 1);
          LS.set('pteBackups', backups);
          showToast('✅ 备份已删除');
          historyModal.remove();
        };
      });

      historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
          historyModal.remove();
        }
      });
    };

    // 完整备份 - 导出按钮（标题栏）
    box.querySelector('#pteBackupExport').onclick = async () => {
      try {
        showToast('⏳ 正在导出完整备份...');
        
        const data = await BackupManager.exportAndBackup();
        
        if (!data) {
          showToast('❌ 导出失败，已尝试从 localStorage 恢复。请尝试重新导出。');
          return;
        }
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PTE-完整备份-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addOperationLog('导出完整备份', `标签${data.stats.tagsCount}、过滤${data.stats.excludeTagsCount + data.stats.excludeWorksCount}`);
        updateOperationHistory();
        
        // 检查是否有恢复标记
        const recoveryNote = data.stats.recoveryNote ? '（数据由 localStorage 恢复）' : '';
        showToast(`✅ 已导出完整备份（标签${data.stats.tagsCount}、过滤${data.stats.excludeTagsCount + data.stats.excludeWorksCount}）${recoveryNote}`);
      } catch (e) {
        console.warn('[PTE] 导出失败:', e.message);
        showToast('❌ 导出失败。若问题持续，请刷新页面重试或联系开发者。');
      }
    };

    // 完整备份 - 导入按钮（标题栏）
    box.querySelector('#pteBackupImport').onclick = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const data = JSON.parse(event.target.result);
              
              if (data.version && data.exportTime) {
                // 完整备份格式
                showToast('⏳ 正在导入完整备份...');
                
                const success = await TagDB.importAllData(data);
                if (success) {
                  // 刷新内存数据
                  Object.assign(savedTags, data.tags || {});
                  excludeTagsSet.clear();
                  const excludeStr = data.excludeTags || '';
                  excludeStr.split(',').filter(Boolean).forEach(t => excludeTagsSet.add(t));
                  Object.assign(excludeTagsWithTime, data.excludeTagsWithTime || {});
                  
                  excludeWorksSet.clear();
                  const worksStr = data.excludeWorksTags || '';
                  worksStr.split(',').filter(Boolean).forEach(t => excludeWorksSet.add(t));
                  Object.assign(excludeWorksWithTime, data.excludeWorksWithTime || {});
                  
                  // 刷新 UI
                  updateSavedList();
                  updateExcludeList();
                  addOperationLog('导入完整备份', `标签${data.stats.tagsCount}、过滤${data.stats.excludeTagsCount + data.stats.excludeWorksCount}`);
                  updateOperationHistory();
                  
                  // 检查是否有恢复标记
                  const recoveryNote = data.stats?.recoveryNote ? '（数据由降级存储恢复）' : '';
                  showToast(`✅ 已导入完整备份（标签${data.stats.tagsCount}、过滤${data.stats.excludeTagsCount + data.stats.excludeWorksCount}）${recoveryNote}`);
                } else {
                  showToast('❌ 导入备份失败。可能是 IndexedDB 不可用，请尝试刷新页面。');
                }
              } else {
                showToast('❌ 请选择完整备份文件（必须包含 version 和 exportTime）');
              }
            } catch (err) {
              console.warn('[PTE] 导入失败:', err.message);
              showToast('❌ 文件解析失败。请确保文件是有效的 JSON 格式。');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    // 修复 IndexedDB - 清除损坏的数据库
    box.querySelector('#pteRepairDB').onclick = async () => {
      if (!confirm('是否清除损坏的 IndexedDB？\n\n注：清除后数据将保留在 localStorage 中，脚本会自动从 localStorage 恢复。')) {
        return;
      }
      
      try {
        showToast('⏳ 正在修复数据库...');
        const success = await TagDB.clearCorruptedDB();
        
        if (success) {
          showToast('✅ 数据库已清除，脚本已降级到 localStorage 工作模式');
          // 隐藏修复按钮
          box.querySelector('#pteRepairDB').style.display = 'none';
          
          // 刷新页面以完全恢复
          setTimeout(() => {
            if (confirm('建议刷新页面以完全恢复。是否现在刷新？')) {
              location.reload();
            }
          }, 1000);
        } else {
          showToast('❌ 清除失败，请尝试手动清除浏览器数据');
        }
      } catch (e) {
        console.error('[PTE] 修复失败:', e);
        showToast('❌ 修复失败，请尝试手动清除浏览器数据');
      }
    };

    // 左侧排除标签 - 导入按钮
    box.querySelector('#pteExcludeImport').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              if (data.excludeTags && Array.isArray(data.excludeTags)) {
                // 清空待添加的数据
                excludeTagsSet.clear();
                // 添加新数据
                data.excludeTags.forEach(tag => {
                  excludeTagsSet.add(tag);
                });
                excludeTagsWithTime = data.excludeTagsWithTime || {};
                // 添加时间戳
                const now = Date.now();
                data.excludeTags.forEach(tag => {
                  if (!excludeTagsWithTime[tag]) {
                    excludeTagsWithTime[tag] = now;
                  }
                });
                // 保存数据
                const tagsStr = Array.from(excludeTagsSet).join(',');
                saveExcludeFilters('tag');
                updateExcludeList();
                updateTransResultAfterExclude();
                addOperationLog('导入排除标签', `${data.excludeTags.length} 个`);
                updateOperationHistory();
                showToast(`✅ 已导入 ${data.excludeTags.length} 个排除标签`);
              } else {
                showToast('❌ JSON格式错误');
              }
            } catch (err) {
              showToast('❌ 文件解析失败');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    // 右侧已保存翻译 - 导入按钮（仅导入翻译）
    box.querySelector('#pteSavedImport').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              if (data.savedTags && typeof data.savedTags === 'object') {
                // 确保有时间戳
                const now = Date.now();
                Object.keys(data.savedTags).forEach(key => {
                  const value = data.savedTags[key];
                  // 兼容旧格式和新格式
                  if (typeof value === 'string') {
                    data.savedTags[key] = { translation: value, timestamp: now };
                  } else if (typeof value === 'object' && !value.timestamp) {
                    value.timestamp = now;
                  }
                });
                // 合并数据
                Object.assign(savedTags, data.savedTags);
                saveTags();
                updateSavedList();
                addOperationLog('导入翻译', `${Object.keys(data.savedTags).length} 个`);
                updateOperationHistory();
                showToast(`✅ 已导入 ${Object.keys(data.savedTags).length} 个翻译`);
              } else {
                showToast('❌ JSON格式错误');
              }
            } catch (err) {
              showToast('❌ 文件解析失败');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    // 导入对话框
    const confirmBtn = box.querySelector('#pteImportConfirm');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        const textarea = box.querySelector('#pteImportTextarea');
        const content = textarea.value.trim();
        if (!content) {
          showToast('❌ 请粘贴导入内容');
          return;
        }
        hideImportDialog();
        processImport(content, currentImportType);
      };
    } else {
      console.warn('导入确认按钮未找到');
    }

    const cancelBtn = box.querySelector('#pteImportCancel');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        hideImportDialog();
      };
    }

    // 遮罩点击关闭对话框
    importMask.onclick = hideImportDialog;

    // 处理文件输入
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        processImport(event.target.result, currentImportType);
      };
      reader.readAsText(file);
    };

    // 搜索排除标签
    const excludeSearchInput = box.querySelector('#pteExcludeSearch');
    
    excludeSearchInput.oninput = () => {
      excludeSearchKeyword = excludeSearchInput.value.trim().toLowerCase();
      updateExcludeList();
    };

    // 排除标签排序
    const sortBtn = box.querySelector('#pteExcludeSort');
    const sortMenu = box.querySelector('#pteSortMenu');

    const sortModeLabels = {
      'alpha-asc': 'A→Z',
      'alpha-desc': 'Z→A',
      'time-new': '新→旧',
      'time-old': '旧→新'
    };

    const sortModeDesc = {
      'alpha-asc': 'A→Z',
      'alpha-desc': 'Z→A',
      'tag-asc': '标A→Z',
      'tag-desc': '标Z→A',
      'trans-asc': '译A→Z',
      'trans-desc': '译Z→A',
      'time-new': '新→旧',
      'time-old': '旧→新'
    };

    sortBtn.onclick = (e) => {
      e.stopPropagation();
      sortMenu.style.display = sortMenu.style.display === 'none' ? 'block' : 'none';
    };

    sortMenu.querySelectorAll('div[data-sort]').forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const newMode = item.getAttribute('data-sort');
        excludeSortMode = newMode;
        LS.set('excludeSortMode', excludeSortMode);
        updateExcludeList();
        sortMenu.style.display = 'none';
        showToast(`✅ 已切换排序为: ${sortModeDesc[excludeSortMode]}`);
      };
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', (e) => {
      if (!sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
        sortMenu.style.display = 'none';
      }
    });

    // 已保存翻译排序
    const savedSortBtn = box.querySelector('#pteSavedSort');
    const savedSortMenu = box.querySelector('#pteSavedSortMenu');
    let savedSortMode = LS.get('savedSortMode', 'alpha-asc') || 'alpha-asc';

    savedSortBtn.onclick = (e) => {
      e.stopPropagation();
      savedSortMenu.style.display = savedSortMenu.style.display === 'none' ? 'block' : 'none';
    };

    savedSortMenu.querySelectorAll('div[data-sort]').forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const newMode = item.getAttribute('data-sort');
        savedSortMode = newMode;
        LS.set('savedSortMode', savedSortMode);
        updateSavedList();
        savedSortMenu.style.display = 'none';
        showToast(`✅ 已切换排序为: ${sortModeDesc[savedSortMode]}`);
      };
    });

    // 点击页面其他地方关闭已保存翻译的排序菜单
    document.addEventListener('click', (e) => {
      if (!savedSortBtn.contains(e.target) && !savedSortMenu.contains(e.target)) {
        savedSortMenu.style.display = 'none';
      }
    });

    // 左侧排除标签 - 保存
    box.querySelector('#pteExcludeSave').onclick = () => {
      const currentSet = getCurrentSet();
      const timeMap = getCurrentTimeMap();
      const tags = Array.from(currentSet).join(',');
      LS.set(getStorageKey(), tags);
      LS.set(getTimeStorageKey(), timeMap);
      LS.set('excludeSortMode', excludeSortMode);
      
      if (currentExcludeMode === 'tag') {
        CFG.filters.excludeTags = tags;
      }
      
      const sortModeNames = { 'alpha-asc': 'A→Z', 'alpha-desc': 'Z→A', 'time-new': '新→旧', 'time-old': '旧→新' };
      const modeText = currentExcludeMode === 'tag' ? '过滤标签' : '过滤作品标签';
      addOperationLog(`保存${modeText}`, `${currentSet.size} 个`);
      updateOperationHistory();
      showToast(`✅ 已保存 ${currentSet.size} 个${modeText}（排序: ${sortModeNames[excludeSortMode]}）`);
    };

    // 清空前要求确认
    box.querySelector('#pteExcludeReset').onclick = () => {
      const modeText = currentExcludeMode === 'tag' ? '过滤标签' : '过滤作品标签';
      // 创建自定义确认对话框
      const confirmDialog = document.createElement('div');
      confirmDialog.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:2px solid #f56c6c;border-radius:8px;padding:20px;z-index:2147483648;box-shadow:0 4px 16px rgba(0,0,0,0.2);min-width:300px;';
      confirmDialog.innerHTML = `
        <div style="font-weight:600;color:#f56c6c;margin-bottom:16px;font-size:14px;">⚠️ 确认清空</div>
        <div style="color:#666;margin-bottom:20px;font-size:12px;">确定要清空所有${modeText}吗？此操作无法撤销。</div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="pteConfirmCancel" style="padding:8px 16px;border:1px solid #d9d9d9;border-radius:6px;background:#f5f5f5;color:#666;cursor:pointer;font-weight:600;font-size:12px;">取消</button>
          <button id="pteConfirmOk" style="padding:8px 16px;border:none;border-radius:6px;background:#f56c6c;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">清空</button>
        </div>
      `;

      const mask = document.createElement('div');
      mask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:2147483647;';

      document.body.appendChild(mask);
      document.body.appendChild(confirmDialog);

      const cancelBtn = confirmDialog.querySelector('#pteConfirmCancel');
      const okBtn = confirmDialog.querySelector('#pteConfirmOk');

      const cleanup = () => {
        document.body.removeChild(mask);
        document.body.removeChild(confirmDialog);
      };

      cancelBtn.onclick = cleanup;
      mask.onclick = cleanup;

      okBtn.onclick = () => {
        cleanup();
        // 执行清空操作
        if (currentExcludeMode === 'tag') {
          excludeTagsSet.clear();
          excludeTagsWithTime = {};
          CFG.filters.excludeTags = '';
          saveExcludeFilters('tag');
          updateTransResultAfterExclude();
          
          // 清除 IndexedDB 中的数据
          try {
            const dbRequest = indexedDB.open('PTE_TagDB');
            dbRequest.onsuccess = (e) => {
              const db = e.target.result;
              const tx = db.transaction(['data'], 'readwrite');
              const store = tx.objectStore('data');
              store.delete('excludeTags');
              store.delete('excludeTagsWithTime');
            };
          } catch (e) {
            console.warn('[PTE] 清除 IndexedDB 过滤标签失败:', e);
          }
        } else {
          excludeWorksSet.clear();
          excludeWorksWithTime = {};
          saveExcludeFilters('works');
          
          // 清除 IndexedDB 中的数据
          try {
            const dbRequest = indexedDB.open('PTE_TagDB');
            dbRequest.onsuccess = (e) => {
              const db = e.target.result;
              const tx = db.transaction(['data'], 'readwrite');
              const store = tx.objectStore('data');
              store.delete('excludeWorksTags');
              store.delete('excludeWorksWithTime');
            };
          } catch (e) {
            console.warn('[PTE] 清除 IndexedDB 过滤作品失败:', e);
          }
        }
        updateExcludeList();
        addOperationLog(`清空${modeText}`, '');
        updateOperationHistory();
        showToast(`✅ 已清空${modeText}列表`);
      };
    };

    // 导出已保存翻译
    box.querySelector('#pteSavedExport').onclick = () => {
      // 按当前排序模式导出（仅翻译）
      const sortMode = LS.get('savedSortMode', 'tag-asc') || 'tag-asc';
      let entries = Object.entries(savedTags);

      if (sortMode === 'tag-asc') {
        entries.sort((a, b) => a[0].localeCompare(b[0]));
      } else if (sortMode === 'tag-desc') {
        entries.sort((a, b) => b[0].localeCompare(a[0]));
      } else if (sortMode === 'trans-asc') {
        entries.sort((a, b) => {
          const transA = typeof a[1] === 'string' ? a[1] : a[1].translation;
          const transB = typeof b[1] === 'string' ? b[1] : b[1].translation;
          return transA.localeCompare(transB);
        });
      } else if (sortMode === 'trans-desc') {
        entries.sort((a, b) => {
          const transA = typeof a[1] === 'string' ? a[1] : a[1].translation;
          const transB = typeof b[1] === 'string' ? b[1] : b[1].translation;
          return transB.localeCompare(transA);
        });
      } else if (sortMode === 'time-new') {
        entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
      } else if (sortMode === 'time-old') {
        entries.sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));
      }

      // 转为简化格式：只导出翻译文本，不包含时间戳
      const exportTags = {};
      entries.forEach(([key, value]) => {
        exportTags[key] = typeof value === 'string' ? value : value.translation;
      });

      const data = {
        savedTags: exportTags
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PTE翻译结果.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addOperationLog('导出翻译', `${Object.keys(savedTags).length} 个`);
      updateOperationHistory();
      showToast(`✅ 已导出 ${Object.keys(savedTags).length} 个翻译（按${sortMode}排序）`);
    };

    // 右侧已保存翻译 - 保存
    box.querySelector('#pteSavedSave').onclick = () => {
      const content = JSON.stringify(savedTags);
      saveTags();
      addOperationLog('保存翻译', `${Object.keys(savedTags).length} 个`);
      updateOperationHistory();
      showToast(`✅ 已保存 ${Object.keys(savedTags).length} 个翻译`);
    };

    // 清空已保存翻译
    box.querySelector('#pteSavedReset').onclick = () => {
      // 创建自定义确认对话框
      const confirmDialog = document.createElement('div');
      confirmDialog.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:2px solid #f56c6c;border-radius:8px;padding:20px;z-index:2147483648;box-shadow:0 4px 16px rgba(0,0,0,0.2);min-width:300px;';
      confirmDialog.innerHTML = `
        <div style="font-weight:600;color:#f56c6c;margin-bottom:16px;font-size:14px;">⚠️ 确认清空</div>
        <div style="color:#666;margin-bottom:20px;font-size:12px;">确定要清空所有已保存的翻译吗？此操作无法撤销。</div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="pteConfirmCancel" style="padding:8px 16px;border:1px solid #d9d9d9;border-radius:6px;background:#f5f5f5;color:#666;cursor:pointer;font-weight:600;font-size:12px;">取消</button>
          <button id="pteConfirmOk" style="padding:8px 16px;border:none;border-radius:6px;background:#f56c6c;color:#fff;cursor:pointer;font-weight:600;font-size:12px;">清空</button>
        </div>
      `;

      const mask = document.createElement('div');
      mask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:2147483647;';

      document.body.appendChild(mask);
      document.body.appendChild(confirmDialog);

      const cancelBtn = confirmDialog.querySelector('#pteConfirmCancel');
      const okBtn = confirmDialog.querySelector('#pteConfirmOk');

      const cleanup = () => {
        document.body.removeChild(mask);
        document.body.removeChild(confirmDialog);
      };

      cancelBtn.onclick = cleanup;
      mask.onclick = cleanup;

      okBtn.onclick = async () => {
        cleanup();
        // 执行清空操作
        for (const key in savedTags) {
          delete savedTags[key];
        }
        // 清除 localStorage
        try {
          localStorage.removeItem(LSKEY + ':tagTranslations');
        } catch { }
        
        // 删除 IndexedDB 中的数据
        try {
          const dbRequest = indexedDB.open('PTE_TagDB');
          dbRequest.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction(['data'], 'readwrite');
            const store = tx.objectStore('data');
            store.delete('tags');
          };
        } catch (e) {
          console.warn('[PTE] 清除 IndexedDB 数据失败:', e);
        }
        
        // 更新所有相关UI
        updateSavedList();
        updateUnifiedTagList();
        updateTransResultAfterExclude();
        addOperationLog('清空翻译', '');
        updateOperationHistory();
        showToast('✅ 已清空已保存翻译');
      };
    };

    // 初始化操作历史显示
    updateOperationHistory();

    // 关闭前清空待翻译区的数据
    const saveBeforeClose = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      // 关闭时不保存，清空待翻译数据
      try {
        localStorage.removeItem(LSKEY + ':manualTags');
      } catch { }
      if (mask && mask.parentNode) {
        mask.parentNode.removeChild(mask);
      }
      return false;
    };

    // 关闭
    const closeBtn = box.querySelector('#pteManagerClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', saveBeforeClose);
    }
    // 防止误触背景：改为需要点击关闭按钮才能关闭
    mask.addEventListener('click', (e) => { if (e.target === mask) e.stopPropagation(); });

    // 监听 localStorage 变化，实现静默同步
    window.addEventListener('storage', (event) => {
      if (event.key === 'tagTranslations') {
        savedTags = LS.get('tagTranslations', {});
        updateSavedList();
      } else if (event.key === 'excludeTags') {
        excludeTagsSet = new Set(LS.get('excludeTags', []));
        excludeTagsWithTime = LS.get('excludeTagsWithTime', {});
        updateExcludeList();
      }
    });
  }


  /******************** 模式 & 本地下载工具 ********************/
  const COLOR = { eagle: '#409eff', disk: '#f1a72e' }; // 蓝(鹰) / 偏黄(本地)
  function fmtIndex(i, total) { const w = String(total).length; return String(i).padStart(w, '0'); }
  function inferExtFromUrl(u) {
    const m = u.match(/\.([a-zA-Z0-9]+)(?:\?|$)/); return m ? ('.' + m[1].toLowerCase()) : '.jpg';
  }

  function gmDownloadWithHeaders(url, name, headers) {
    // Disk 模式 + FS
    if (typeof PTE_FS !== 'undefined' && PTE_FS && PTE_FS.root && (typeof CFG === 'object') && CFG.mode === 'disk') {
      return (async () => {
        const ab = await gmFetchBinary(url, { headers: headers || {} });
        const blob = new Blob([ab]);
        await saveBlobAsWithPath(name, blob);
      })();
    }
    // 回退：GM_download（无法创建子目录，仅作兜底）
    return new Promise((resolve, reject) => {
      try {
        GM_download({
          url,
          name,
          saveAs: false,
          headers: headers || {},
          onload: resolve,
          onerror: reject,
          ontimeout: reject
        });
      } catch (e) { reject(e); }
    });
  }

  // ====== FS Access helpers (user-gesture required once) ======
  let PTE_FS = { root: null, picked: false };
  async function ptePickDownloadsRoot() {
    if (!('showDirectoryPicker' in window)) { showToast('当前浏览器不支持选择目录（需要 Chrome/Edge 版本较新）'); return false; }
    try {
      const root = await window.showDirectoryPicker({ id: 'pte-download-root', mode: 'readwrite', startIn: 'downloads' });
      PTE_FS.root = root; PTE_FS.picked = true;
      showToast('已选择下载目录：Downloads/Pixiv');
      return true;
    } catch (e) {
      console.warn('目录选择取消或失败', e);
      showToast('未选择目录，继续使用浏览器默认下载（无法创建子文件夹）');
      return false;
    }
  }
  async function pteSaveWithFS(path, blob) {
    if (!PTE_FS.root) return false;
    try {
      const parts = path.split('/').filter(Boolean);
      let dir = PTE_FS.root;
      for (let i = 0; i < parts.length - 1; i++) {
        dir = await dir.getDirectoryHandle(parts[i], { create: true });
      }
      const fname = parts[parts.length - 1];
      const fileHandle = await dir.getFileHandle(fname, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (e) {
      console.warn('FS Access 写入失败，回退 GM_download', e);
      return false;
    }
  }

  async function saveBlobAsWithPath(path, blob) {
    const url = URL.createObjectURL(blob);
    try {
      if (PTE_FS.root) {
        const ok = await pteSaveWithFS(path, blob);
        if (ok) { URL.revokeObjectURL(url); return; }
      }
    } catch (e) { console.warn(e); }
    return new Promise((resolve, reject) => {
      const cleanup = () => { setTimeout(() => URL.revokeObjectURL(url), 2000); };
      try {
        GM_download({
          url, name: path, saveAs: false,
          onload: () => { cleanup(); resolve(); },
          onerror: (e) => { cleanup(); reject(e); },
          ontimeout: (e) => { cleanup(); reject(e); }
        });
      } catch (e) { cleanup(); reject(e); }
    });
  }

  // 统一请求处理
  function gmFetch(url, options = {}) {
    const { method = 'GET', body = null, headers = {}, responseType = 'text' } = options;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method, url, data: body, headers,
        responseType: responseType === 'json' ? 'text' : responseType,
        onload: (res) => {
          if (responseType === 'json') {
            try { resolve(JSON.parse(res.responseText || '{}')); } catch { resolve({}); }
          } else {
            resolve(res.response || res.responseText);
          }
        },
        onerror: reject,
        ontimeout: reject
      });
    });
  }

  // 向后兼容的快捷函数
  function gmFetchBinary(url, options = {}) {
    return gmFetch(url, { ...options, responseType: 'arraybuffer' });
  }
  function gmFetchText(url, options = {}) {
    return gmFetch(url, { ...options, responseType: 'text' });
  }
  async function ensureFflateLoaded() {
    if (window.fflate) return;
    throw new Error('fflate 未加载（@require 失败）');
  }
  let __gifWorkerURL = null;
  async function ensureGifLibLoaded() {
    if (!window.GIF) throw new Error('gif.js 未加载（@require 失败）');
    if (!__gifWorkerURL) {
      const workerCode = await gmFetchText('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js');
      __gifWorkerURL = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    }
  }
  function guessMime(name) { return name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'; }
  function decodeImageFromU8(u8, mime) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([u8], { type: mime });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  /******************** APNG 转换（动态加载依赖）********************/
  async function ensurePakoLoaded() {
    if (window.pako) return;
    const code = await gmFetchText('https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js');
    eval(code);
    if (!window.pako) throw new Error('pako 加载失败');
  }

  async function ensureUpngLoaded() {
    if (window.UPNG) return;
    try {
      const code = await gmFetchText('https://cdn.jsdelivr.net/npm/upng-js@2.1.0/UPNG.min.js');
      eval(code);
      if (!window.UPNG) throw new Error('UPNG 库加载后仍未定义');
      console.log('[PTE] UPNG.js 加载成功');
    } catch (e) {
      console.error('[PTE] UPNG.js 加载失败:', e.message);
      throw new Error(`UPNG库加载失败: ${e.message}`);
    }
  }

  async function convertUgoiraToApngBlob(artId) {
    try {
      // 加载依赖
      await ensureFflateLoaded();
      await ensurePakoLoaded();
      await ensureUpngLoaded();

      const meta = await ugoiraMeta(artId);
      const zipUrl = meta?.body?.originalSrc || meta?.body?.src;
      const frames = meta?.body?.frames || [];
      if (!zipUrl || !frames.length) throw new Error('无法获取动图元数据');

      const zipBuf = await gmFetchBinary(zipUrl, { responseType: 'arraybuffer', headers: { referer: 'https://www.pixiv.net/' } });
      const entries = window.fflate.unzipSync(new Uint8Array(zipBuf));

      if (!entries || frames.length === 0) {
        throw new Error('动图数据不完整');
      }

      // 准备第一帧以获取尺寸
      const first = frames[0];
      const firstBytes = entries[first.file];
      if (!firstBytes) throw new Error('压缩包缺少首帧: ' + first.file);
      const firstImg = await decodeImageFromU8(firstBytes, guessMime(first.file));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const width = firstImg.width;
      const height = firstImg.height;
      canvas.width = width;
      canvas.height = height;

      const framesData = [];
      const delays = [];

      // 绘制每一帧并收集 Buffer
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        const bytes = entries[f.file];
        if (!bytes) throw new Error('压缩包缺少帧: ' + f.file);
        const img = await decodeImageFromU8(bytes, guessMime(f.file));

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);

        // UPNG 需要 RGBA 的 ArrayBuffer
        const imageData = ctx.getImageData(0, 0, width, height).data.buffer;
        framesData.push(imageData);
        delays.push(f.delay || 100); // Pixiv 延迟单位是 ms
      }

      // 编码为 APNG (cnum = 0 表示无损压缩)
      const pngBuf = window.UPNG.encode(framesData, width, height, 0, delays);
      const blob = new Blob([pngBuf], { type: 'image/apng' });
      console.log(`[PTE] APNG 转换成功: ${artId}, 大小: ${blob.size} bytes`);
      return blob;
    } catch (e) {
      console.error(`[PTE] APNG 转换失败: ${artId}`, e.message);
      throw e;
    }
  }

  async function convertUgoiraToWebmBlob(artId) {
    try {
      await ensureFflateLoaded();
      const meta = await ugoiraMeta(artId);
      const zipUrl = meta?.body?.originalSrc || meta?.body?.src;
      const frames = meta?.body?.frames || [];
      if (!zipUrl || !frames.length) throw new Error('无法获取动图元数据');

      const zipBuf = await gmFetchBinary(zipUrl, { responseType: 'arraybuffer', headers: { referer: 'https://www.pixiv.net/' } });
      const entries = window.fflate.unzipSync(new Uint8Array(zipBuf));

      // 准备第一帧以获取尺寸
      const first = frames[0];
      const firstBytes = entries[first.file];
      if (!firstBytes) throw new Error('压缩包缺少首帧: ' + first.file);
      const firstImg = await decodeImageFromU8(firstBytes, guessMime(first.file));

      const canvas = document.createElement('canvas');
      canvas.width = firstImg.width;
      canvas.height = firstImg.height;
      const ctx = canvas.getContext('2d');

      // 使用 MediaRecorder 录制 WebM
      const stream = canvas.captureStream(60); // 60fps
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      return new Promise(async (resolve, reject) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          console.log(`[PTE] WebM 转换成功: ${artId}, 大小: ${blob.size} bytes`);
          resolve(blob);
        };

        try {
          mediaRecorder.start();
          
          // 绘制每一帧，根据延迟计算应该重绘多少次
          for (let i = 0; i < frames.length; i++) {
            const f = frames[i];
            const bytes = entries[f.file];
            if (!bytes) throw new Error('压缩包缺少帧: ' + f.file);
            const img = await decodeImageFromU8(bytes, guessMime(f.file));
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // 简单延迟实现：根据帧延迟决定是否重绘
            const delay = Math.max(20, f.delay || 100);
            const frameCount = Math.max(1, Math.round(delay / (1000 / 60))); // 转换为60fps下的帧数
            
            for (let j = 0; j < frameCount; j++) {
              await new Promise(r => setTimeout(r, 1000 / 60));
            }
          }
          
          mediaRecorder.stop();
        } catch (e) {
          mediaRecorder.stop();
          reject(e);
        }
      });
    } catch (e) {
      console.error(`[PTE] WebM 转换失败: ${artId}`, e.message);
      throw e;
    }

  }

  // GIF 转换逻辑
  const GifHelper = {
    async convertToGifBlob(artId) {
      await ensureFflateLoaded();
      await ensureGifLibLoaded();
      const meta = await ugoiraMeta(artId);
      const zipUrl = meta?.body?.originalSrc || meta?.body?.src;
      const frames = meta?.body?.frames || [];
      if (!zipUrl || !frames.length) throw new Error('无法获取动图元数据');
      const zipBuf = await gmFetchBinary(zipUrl, { responseType: 'arraybuffer', headers: { referer: 'https://www.pixiv.net/' } });
      const entries = window.fflate.unzipSync(new Uint8Array(zipBuf));
      const first = frames[0];
      const firstBytes = entries[first.file];
      if (!firstBytes) throw new Error('压缩包缺少首帧: ' + first.file);
      const firstImg = await decodeImageFromU8(firstBytes, guessMime(first.file));
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = firstImg.width; canvas.height = firstImg.height;
      const gif = new window.GIF({ workers: 2, quality: 10, width: canvas.width, height: canvas.height, workerScript: __gifWorkerURL });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(firstImg, 0, 0);
      gif.addFrame(ctx, { copy: true, delay: Math.max(20, first.delay || 100) });
      for (let i = 1; i < frames.length; i++) {
        const f = frames[i];
        const bytes = entries[f.file];
        if (!bytes) throw new Error('压缩包缺少帧: ' + f.file);
        const img = await decodeImageFromU8(bytes, guessMime(f.file));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        gif.addFrame(ctx, { copy: true, delay: Math.max(20, f.delay || 100) });
      }
      const blob = await new Promise(resolve => { gif.on('finished', b => resolve(b)); gif.render(); });
      return blob;
    },

    // 根据配置选择格式并转换
    async convertUgoiraToBlob(artId) {
      const format = getUgoiraFormat();
      try {
        switch (format) {
          case 'apng':
            try {
              console.log(`[PTE] 开始APNG转换: ${artId}`);
              const apngBlob = await convertUgoiraToApngBlob(artId);
              console.log(`[PTE] APNG转换成功: ${artId}, 大小: ${apngBlob.size}`);
              return apngBlob;
            } catch (e) {
              console.error(`[PTE] APNG转换失败，回退到GIF:`, e.message);
              showToast(`⚠️ APNG转换失败，已自动使用GIF格式`);
              return await this.convertToGifBlob(artId);
            }
          case 'webm':
            try {
              console.log(`[PTE] 开始WebM转换: ${artId}`);
              const webmBlob = await convertUgoiraToWebmBlob(artId);
              console.log(`[PTE] WebM转换成功: ${artId}, 大小: ${webmBlob.size}`);
              return webmBlob;
            } catch (e) {
              console.error(`[PTE] WebM转换失败，回退到GIF:`, e.message);
              showToast(`⚠️ WebM转换失败，已自动使用GIF格式`);
              return await this.convertToGifBlob(artId);
            }
          case 'gif':
          default:
            return await this.convertToGifBlob(artId);
        }
      } catch (e) {
        console.error(`[PTE] 格式转换异常:`, e.message);
        showToast(`⚠️ 转换失败，已使用GIF格式`);
        return await this.convertToGifBlob(artId);
      }
    },

    // 获取格式后缀
    getFormatExt() {
      const format = getUgoiraFormat();
      switch (format) {
        case 'apng':
          return '.png';
        case 'webm':
          return '.webm';
        case 'gif':
        default:
          return '.gif';
      }
    },

    async saveAndGetDataURL(artId, title, { saveLocal = true, savePath = null, needDataURL = true } = {}) {
      const blob = await this.convertUgoiraToBlob(artId);
      const safeTitle = sanitize(title || '');
      const baseName = safeTitle || `pixiv_${artId}`;
      const trimmedBase = baseName.length > 80 ? baseName.slice(0, 80) : baseName;
      const ext = this.getFormatExt();
      const name = `${trimmedBase}${ext}`;

      if (saveLocal) {
        if (savePath) {
          await saveBlobAsWithPath(savePath, blob);
        } else {
          saveBlobAs(name, blob);
        }
      }

      let dataURL = null;
      if (needDataURL) {
        dataURL = await blobToDataURL(blob);
      }

      return { blob, dataURL, name };
    }
  };
  function saveBlobAs(filename, blob) {
    const url = URL.createObjectURL(blob);
    const cleanup = () => setTimeout(() => URL.revokeObjectURL(url), 2000);
    try {
      if (typeof GM_download === 'function') {
        GM_download({ url, name: filename, saveAs: false, onload: cleanup, ontimeout: cleanup, onerror: () => { cleanup(); fallback(); } });
        return;
      }
    } catch { cleanup(); }
    fallback();
    function fallback() {
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); cleanup();
    }
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /******************** 导入 / 合并行为 ********************/
  async function importMode(mode) {
    cancel = false; aborters.clear();

    if (mode === 'one') {
      const id = location.pathname.match(/artworks\/(\d+)/)?.[1];
      if (!id) { showToast('未识别到作品ID'); return; }
      return importOne(id, /*mergeGif*/ true);
    }

    showScan();

    let ids = []; const onUser = isUser();

    if (mode === 'selected') {
      const cbs = [...document.querySelectorAll('.pxe-mini-checkbox:checked')];
      ids = [...new Set(cbs.map(cb => cb.dataset.id).filter(Boolean))];
      updScan(ids.length, 0, true);
    } else if (mode === 'page') {
      ids = collectIdsFromPage(); updScan(ids.length, 0, true);
    } else if (mode === 'all') {
      if (onUser) {
        const m = location.pathname.match(/users\/(\d+)/); if (!m) { closeScan(); showToast('未识别到用户ID'); return; }
        const uid = m[1]; ids = await allIllustIds(uid); updScan(ids.length, 0, true);
      } else {
        ids = collectIdsFromPage(); updScan(ids.length, 0, true);
      }
    }

    if (cancel) { closeScan(); return; }
    if (!ids.length) { closeScan(); showToast(mode === 'selected' ? '请先勾选作品' : '未在本页找到作品'); return; }

    // 读取两个独立列表
    // 过滤标签列表（导入时移除这些标签）
    const excludeTagsStr = LS.get('excludeTags', '') || CFG.filters.excludeTags || '';
    // 过滤作品列表（跳过含这些标签的作品）
    const excludeWorksStr = LS.get('excludeWorksTags', '') || '';

    // 修正标签中的引号和特殊字符
    const cleanExcludeTag = (tag) => {
      return lower(tag.trim().replace(/^["']|["']$/g, ''));
    };
    // 处理过滤标签列表
    const filterTagsSet = new Set(
      excludeTagsStr.split(',').map(cleanExcludeTag).filter(Boolean)
    );
    console.log('[PTE] 过滤标签列表加载:', Array.from(filterTagsSet));
    // 处理过滤作品列表
    const filterWorksSet = new Set(
      excludeWorksStr.split(',').map(cleanExcludeTag).filter(Boolean)
    );
    const savedTranslations = LS.get('tagTranslations', {});

    // 创建不区分大小写的翻译查询函数
    const getTranslationCaseInsensitive = (tag) => {
      // 先尝试精确匹配
      if (savedTranslations[tag]) {
        return savedTranslations[tag];
      }
      // 再尝试不区分大小写匹配
      const lowerTag = tag.toLowerCase();
      for (const [key, value] of Object.entries(savedTranslations)) {
        if (key.toLowerCase() === lowerTag) {
          return value;
        }
      }
      return null;
    };

    // 标签优化流程（使用过滤标签列表）
    const cleanTags = (tags) => {
      if (!filterTagsSet.size) return tags || [];
      return (tags || []).filter(t => {
        const lowerTag = lower(t);
        return !filterTagsSet.has(lowerTag);
      });
    };

    // 检查作品是否包含过滤作品标签
    const hasExcludedTags = (tags) => {
      if (!filterWorksSet.size) return false;
      return (tags || []).some(t => {
        const lowerTag = lower(t);
        return filterWorksSet.has(lowerTag);
      });
    };

    const processTagsWithTranslation = (tags) => {
      // 第1步：先过排除规则
      const filtered = cleanTags(tags || []);
      // 第2步：应用翻译（不区分大小写）
      const translated = filtered.map(t => {
        const trans = getTranslationCaseInsensitive(t);
        if (!trans) return t;
        // 兼容旧格式(字符串)和新格式(对象)
        return typeof trans === 'string' ? trans : trans.translation || t;
      });
      // 第3步：去重
      return Array.from(new Set(translated));
    };

    closeScan(); showImport(ids.length); let kept = []; let done = 0; let ok = 0; let skipped = 0; updImport(0, ids.length, 0);
    for (const id of ids) {
      if (cancel) break;
      try {
        const info = await illustInfoAndPages(id); if (cancel) break;

        // 检查是否需要跳过含过滤作品标签的作品
        if (hasExcludedTags(info.tags)) {
          skipped++;
          done++;
          updImport(done, ids.length, ok);
          continue;
        }

        const baseCommon = { website: `https://www.pixiv.net/artworks/${id}` };
        const modTime = (CFG.feature.useUploadAsAddDate && info.uploadDate) ? new Date(info.uploadDate).getTime() : undefined;
        // 如果启用了描述保存，从 info 中获取描述
        const shouldSaveDesc = getSaveDescription();
        if (shouldSaveDesc && info.description) {
          baseCommon.annotation = info.description;
        }
        if (CFG.mode === 'eagle') {
          let items = [];
          if (info.illustType === 2) {
            // ugoira→GIF/APNG/WebM：优先 Eagle，超閾转本地
            const blob = await GifHelper.convertUgoiraToBlob(id);
            if (blob.size > BIG_GIF_LIMIT) {
              console.log(`[PTE] 检测到超大动图，大小 ${(blob.size / 1024 / 1024).toFixed(1)}MB，转本地保存`);
              const savePath = `${id}${GifHelper.getFormatExt()}`;
              await saveBlobAsWithPath(savePath, blob);
              console.log(`[PTE] 超大动图已保存`);
              bigGifFallbacks.push({ id, size: blob.size, path: savePath, userName: info.userName, userId: info.userId });
              ok++;
              recordDownloadedId(id);
              markDownloadedCheckboxes();
            } else {
              const ext = GifHelper.getFormatExt();
              const name = `${id}${ext}`;
              const dataURL = await blobToDataURL(blob);
              const processedTags = processTagsWithTranslation(info.tags || []);
              const finalTags = [...processedTags, info.userName].filter(Boolean).filter(t => {
                const lt = lower(t);
                const shouldFilter = filterTagsSet.has(lt);
                if (shouldFilter) console.log('[PTE] 过滤标签:', t);
                return !shouldFilter;
              });
              const one = { url: dataURL, name: name, tags: Array.from(new Set(finalTags)) };
              if (modTime) one.modificationTime = modTime;
              items.push({ ...baseCommon, ...one });
            }
          } else {
            const rng = parseRange(CFG.filters.pageRange); const urls = info.pageUrls || [];
            let use = urls; if (rng) use = urls.filter((_, i) => { const p = i + 1; return p >= rng[0] && p <= rng[1]; });
            let i = 0;
            items = use.map(u => {
              const processedTags = processTagsWithTranslation(info.tags || []);
              const finalTags = [...processedTags, info.userName].filter(Boolean).filter(t => {
                const lt = lower(t);
                const shouldFilter = filterTagsSet.has(lt);
                if (shouldFilter) console.log('[PTE] 过滤标签:', t);
                return !shouldFilter;
              });
              const one = { url: u, name: use.length > 1 ? `${info.title}_P${++i}` : info.title, tags: Array.from(new Set(finalTags)), headers: { referer: 'https://www.pixiv.net/' } };
              if (modTime) one.modificationTime = modTime;
              return { ...baseCommon, ...one };
            });
          }
          const fid = await ensureArtistFolder(info.userId, info.userName);
          if (!fid) {
            console.warn(`[PTE] 跳过作品 ${id}：无法创建/获取文件夹`);
            done++;
            updImport(done, ids.length, ok);
            continue; // 跳过此作品
          }
          if (items.length) { await addToEagle(items, fid); ok++; recordDownloadedId(id); markDownloadedCheckboxes(); }
        } else {
          // Disk 模式：保存到 Downloads/ 目录
          if (info.illustType === 2) {
            const savePath = `${id}.gif`;
            await GifHelper.saveAndGetDataURL(id, info.title, { saveLocal: true, savePath, needDataURL: false });
            ok++;
            recordDownloadedId(id);
            markDownloadedCheckboxes();
          } else {
            const rng = parseRange(CFG.filters.pageRange); const urls = info.pageUrls || [];
            let use = urls; if (rng) use = urls.filter((_, i) => { const p = i + 1; return p >= rng[0] && p <= rng[1]; });
            const total = use.length || 1;
            for (let i = 0; i < use.length; i++) {
              const u = use[i]; const ext = inferExtFromUrl(u);
              const fname = total > 1 ? `${id}_${fmtIndex(i + 1, total)}${ext}` : `${id}${ext}`;
              await gmDownloadWithHeaders(u, fname, { referer: 'https://www.pixiv.net/' });
            }
            ok++;
            recordDownloadedId(id);
            markDownloadedCheckboxes();
          }
        }
      } catch (e) { console.warn('[导入失败]', id, e); }
      done++; updImport(done, ids.length, ok);
      // 使用用户自定义延迟，防止触发 Pixiv WAF
      const { min: minDelay, max: maxDelay } = getDownloadDelay();
      const dynamicDelay = minDelay + Math.random() * (maxDelay - minDelay);
      await sleep(dynamicDelay);
      if (cancel) break;
    }
    const filtered = done - ok;
    let msg = cancel ? `已取消。处理${done}，成功${ok}` : `导入完成！处理${done}，成功${ok}`;
    if (skipped > 0) {
      msg += `，已跳过${skipped}个（含过滤作品标签）`;
    }
    if (bigGifFallbacks && bigGifFallbacks.length) {
      const lines = bigGifFallbacks.map(f => `- 作品 ${f.id}（约 ${(f.size / 1024 / 1024).toFixed(1)}MB）已自动切换为“保存到本地”，路径：${f.path}`);
      msg += `\n\n以下动图因体积较大，已自动使用本地模式保存（未导入 Eagle）：\n${lines.join('\n')}\n\n原因：浏览器/油猴在导入超大 GIF 到 Eagle 时，可能触发内部“消息长度超限”(Message length exceeded maximum allowed length)，从而导致任务卡住。当前版本通过自动切换本地模式规避此问题。`;
    }
    showToast(msg, 5000);
    bigGifFallbacks = [];
    document.getElementById('pxeMiniProg')?.remove();
  }

  async function importOne(id, mergeGif = false) {
    cancel = false;
    try {
      const info = await illustInfoAndPages(id);

      // 读取两个独立列表
      // 过滤标签列表（导入时移除这些标签）
      const excludeTagsStr = LS.get('excludeTags', '') || CFG.filters.excludeTags || '';
      // 过滤作品列表（跳过含这些标签的作品）
      const excludeWorksStr = LS.get('excludeWorksTags', '') || '';

      // 检查是否需要跳过含过滤作品标签的作品
      if (excludeWorksStr) {
        const excludeWorksList = excludeWorksStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const hasExcluded = (info.tags || []).some(t => excludeWorksList.includes(t.toLowerCase()));
        if (hasExcluded) {
          showToast('❌ 此作品包含过滤作品列表中的标签，已跳过保存');
          return;
        }
      }

      // 获取已保存的翻译
      const savedTranslations = LS.get('tagTranslations', {});

      // 创建不区分大小写的翻译查询函数
      const getTranslationCaseInsensitive = (tag) => {
        // 先尝试精确匹配
        if (savedTranslations[tag]) {
          return savedTranslations[tag];
        }
        // 再尝试不区分大小写匹配
        const lowerTag = tag.toLowerCase();
        for (const [key, value] of Object.entries(savedTranslations)) {
          if (key.toLowerCase() === lowerTag) {
            return value;
          }
        }
        return null;
      };

      // 应用标签过滤（使用过滤标签列表）
      const cleanExcludeTag = (tag) => {
        return lower(tag.trim().replace(/^["']|["']$/g, ''));
      };
      const filterTagsList = excludeTagsStr
        .split(',')
        .map(cleanExcludeTag)
        .filter(Boolean);
        // 将列表转换为 Set，供下文的快速 has() 检查使用
        const filterTagsSet = new Set(filterTagsList);
      const cleanTags = (tags) => {
        if (!filterTagsList.length) return tags || [];
        return (tags || []).filter(t => {
          const lowerTag = lower(t);
          return !filterTagsList.includes(lowerTag);
        });
      };

      // 应用翻译：将标签替换为已保存的翻译（如果存在），然后去重
      const processTagsWithTranslation = (tags) => {
        // 第1步：先过排除规则
        const filtered = cleanTags(tags || []);
        // 第2步：应用翻译（不区分大小写）
        const translated = filtered.map(t => {
          const trans = getTranslationCaseInsensitive(t);
          if (!trans) return t;
          // 兼容旧格式（字符串）和新格式（对象）
          return typeof trans === 'string' ? trans : (trans.translation || t);
        });
        // 第3步：去重（这样可以避免两个不同日文标签翻译成同一个中文标签时出现重复）
        return Array.from(new Set(translated));
      };

      // 统一的标题截断处理
      const truncateTitle = (title) => {
        const safeTitle = sanitize(title || '');
        const baseName = safeTitle || `pixiv_${id}`;
        return baseName.length > 80 ? baseName.slice(0, 80) : baseName;
      };

      const baseCommon = { website: `https://www.pixiv.net/artworks/${id}` };
      const modTime = (CFG.feature.useUploadAsAddDate && info.uploadDate) ? new Date(info.uploadDate).getTime() : undefined;
      const rng = parseRange(CFG.filters.pageRange); const urls = info.pageUrls || [];
      if (CFG.mode === 'eagle') {
        const fid = await ensureArtistFolder(info.userId, info.userName);
        if (!fid) {
          showToast('❌ 无法创建作品文件夹，请检查 Eagle 连接和文件夹名称有效性');
          return;
        }
        let items = [];
        if (info.illustType === 2) {
          // 根据选择的格式转换动图
          const blob = await GifHelper.convertUgoiraToBlob(id);
          const ext = GifHelper.getFormatExt();
          if (blob.size > BIG_GIF_LIMIT) {
            console.log(`[PTE] 检测到超大动图，大小 ${(blob.size / 1024 / 1024).toFixed(1)}MB，转本地保存`);
            const savePath = `${id}${ext}`;
            await saveBlobAsWithPath(savePath, blob);
            console.log(`[PTE] 超大动图已保存`);
            showToast(`已完成：动图体积约 ${(blob.size / 1024 / 1024).toFixed(1)}MB，已自动切换为“保存到本地”模式并保存到\n${savePath}\n\n原因：浏览器/油猴在导入超大 GIF 到 Eagle 时，可能触发内部“消息长度超限”限制，导致任务卡住。`, 4000);
            recordDownloadedId(id);
            markDownloadedCheckboxes();
            return;
          } else {
            const name = `${id}${ext}`;
            const dataURL = await blobToDataURL(blob);
            const processedTags = processTagsWithTranslation(info.tags || []);
            const finalTags = [...processedTags, info.userName].filter(Boolean).filter(t => {
              const lt = lower(t);
              const shouldFilter = filterTagsSet.has(lt);
              if (shouldFilter) console.log('[PTE] 过滤标签:', t);
              return !shouldFilter;
            });
            const one = { url: dataURL, name: name, tags: Array.from(new Set(finalTags)) };
            if (modTime) one.modificationTime = modTime;
            const shouldSaveDesc = getSaveDescription();
            if (shouldSaveDesc && info.description) {
              one.annotation = info.description;
            }
            items.push({ ...baseCommon, ...one });
          }
        } else {
          let use = urls; if (rng) use = urls.filter((_, i) => { const p = i + 1; return p >= rng[0] && p <= rng[1]; }); let i = 0;
          const baseName = truncateTitle(info.title);
          const processedTags = processTagsWithTranslation(info.tags || []);
          const finalTags = [...processedTags, info.userName].filter(Boolean).filter(t => {
            const lt = lower(t);
            const shouldFilter = filterTagsSet.has(lt);
            if (shouldFilter) console.log('[PTE] 过滤标签:', t);
            return !shouldFilter;
          });
          const shouldSaveDesc = getSaveDescription();
          items = use.map(u => {
            const itemName = use.length > 1 ? `${baseName}_P${++i}` : baseName;
            const one = { url: u, name: itemName, tags: Array.from(new Set(finalTags)), headers: { referer: 'https://www.pixiv.net/' } };
            if (modTime) one.modificationTime = modTime;
            if (shouldSaveDesc && info.description) {
              one.annotation = info.description;
            }
            return { ...baseCommon, ...one };
          });
        }
        if (items.length) { await addToEagle(items, fid); recordDownloadedId(id); markDownloadedCheckboxes(); }
        const formatMsg = info.illustType === 2 ? `（${getUgoiraFormat().toUpperCase()} 已导入）` : '';
        showToast('已完成：已发送到 Eagle' + formatMsg);
      } else {
        // Disk 模式：保存到 Downloads/Pixiv/ 目录
        const baseDir = `Pixiv`;
        if (info.illustType === 2) {
          const savePath = `${baseDir}/${id}.gif`;
          await GifHelper.saveAndGetDataURL(id, info.title, { saveLocal: true, savePath, needDataURL: false });
        } else {
          let use = urls; if (rng) use = urls.filter((_, i) => { const p = i + 1; return p >= rng[0] && p <= rng[1]; });
          const total = use.length || 1;
          for (let i = 0; i < use.length; i++) {
            const u = use[i]; const ext = inferExtFromUrl(u);
            const fname = total > 1 ? `${id}_${fmtIndex(i + 1, total)}${ext}` : `${id}${ext}`;
            await gmDownloadWithHeaders(u, fname, { referer: 'https://www.pixiv.net/' });
          }
        }
        recordDownloadedId(id);
        markDownloadedCheckboxes();
        showToast(`已完成：已保存到本地`);
      }
    } catch (e) { showToast('发送/下载失败：' + (e && e.message || e), 4000); }
  }


  /******************** 作者文件夹 ********************/
  async function ensureArtistFolder(uid, userName, parentId = null) {
    // 根据作者 uid / 名称在 Eagle 中找到或创建对应文件夹，并写入 pid 备注
    const hasUid = uid !== undefined && uid !== null && uid !== '';
    const uidStr = hasUid ? String(uid) : '';
    const pidRe = /pid\s*=\s*(\d+)/;

    // 第1步：优先按 pid 查找（最可靠）
    if (hasUid) {
      const folders = await listFolders();
      const all = flattenFolders(folders);
      const hit = all.find(f => pidRe.test(f.description || '') && f.description.match(pidRe)[1] === uidStr);
      if (hit?.id) {
        // 检测作者改名：PID相同但文件夹名称与新的userName不同
        const hitName = hit.folderName || hit.name;
        const safe = sanitize(userName || hitName);
        if (safe && hitName !== safe && userName) {
          // 自动更新文件夹名称
          try {
            await renameFolder(hit.id, safe);
            console.log(`[PTE] 已更新作者文件夹名称: ${hitName} → ${safe}`);
          } catch (e) {
            console.warn(`[PTE] 更新文件夹名称失败: ${e?.message}`);
          }
        }
        return hit.id;
      }
    }

    // 第2步：按名称查找
    const safe = sanitize(userName || (hasUid ? `Pixiv_${uidStr}` : 'Pixiv_Unknown'));
    if (!safe?.length) {
      console.error('[PTE] 错误：文件夹名称为空', { userName, uidStr });
      return null;
    }

    const folders = await listFolders();
    const all = flattenFolders(folders);
    const same = all.find(f => (f.folderName || f.name) === safe);
    
    if (same?.id) {
      if (hasUid) {
        try { await updateFolderDesc(same.id, `pid = ${uidStr}`); } catch { }
      }
      return same.id;
    }

    // 第3步：创建新文件夹
    try {
      const id = await createFolder(safe, parentId);
      if (!id) {
        console.error(`[PTE] 错误：文件夹创建失败（返回空 ID）: ${safe}`);
        return null;
      }
      if (hasUid) {
        try { await updateFolderDesc(id, `pid = ${uidStr}`); } catch { }
      }
      return id;
    } catch (e) {
      console.error(`[PTE] 错误：文件夹创建异常: ${safe}`, e);
      return null;
    }
  }
  // 作者详情页插入打开作者文件夹按钮
  (() => {
    const BTN_ID = 'pte-open-author-folder-userpage';
    const isUserPage = () => /^\/users\/\d+/.test(location.pathname);
    const getUid = () => location.pathname.match(/\/users\/(\d+)/)?.[1];
    const EAGLE_BASE = () => EAGLE?.base || 'http://localhost:41595';

    function createBtn(userName, uid) {
      const b = document.createElement('button');
      b.id = BTN_ID;
      b.type = 'button';
      b.textContent = '📁 作者文件夹';
      b.title = '打开作者文件夹';
      Object.assign(b.style, {
        marginLeft: '8px',display: 'inline-flex',alignItems: 'center',
        justifyContent: 'center',height: '24px',minWidth: '24px',
        padding: '0 8px',borderRadius: '999px',border: '1px solid #FD9E16',
        background: '#fff',cursor: 'pointer',lineHeight: '1'
      });

      b.onclick = async () => {
        try {
          if (typeof checkEagle === 'function' && !(await checkEagle())) {
            return showToast?.('❌ Eagle 未连接/未启动');
          }
          const fid = await ensureArtistFolder(uid, userName || `user_${uid}`);
          if (!fid) return showToast?.('❌ 未获取作者文件夹');
          window.open(`${EAGLE_BASE()}/folder?id=${encodeURIComponent(fid)}`, '_blank', 'noopener,noreferrer');
          showToast?.('✅ 已打开作者文件夹');
        } catch (e) {
          showToast?.('❌ 打开失败：' + (e?.message || e));
        }
      };
      return b;
    }

    function mount() {
      if (!isUserPage() || document.getElementById(BTN_ID)) return;
      const host = document.querySelector('div.sc-850fcf14-4.bktDCX');
      if (!host) return;

      const userName = host.querySelector('h1')?.textContent?.trim() || '';
      const uid = getUid();
      if (!uid) return;

      host.appendChild(createBtn(userName, uid));
    }

    new MutationObserver(mount).observe(document.documentElement, { childList: true, subtree: true });
    let last = location.href;
    setInterval(() => { if (location.href !== last) { last = location.href; setTimeout(mount, 250); } }, 500);
    mount();
  })();

  /******************** 作品详情页：打开作者文件夹按钮 ********************/
  (function initOpenAuthorFolderBtn() {
    const BTN_ID = 'pte-open-author-folder-btn';
    const EAGLE_BASE = () => EAGLE?.base || 'http://localhost:41595';
    const isArtworkPage = () => /^\/artworks\/\d+/.test(location.pathname);
    const getArtworkId = () => location.pathname.match(/artworks\/(\d+)/)?.[1];

    const toast = (msg) => {
      try { (typeof showToast === 'function') ? showToast(msg) : alert(msg); }
      catch { alert(msg); }
    };

    async function fetchIllustInfo(illustId) {
      const r = await fetch(`https://www.pixiv.net/ajax/illust/${illustId}`, {
        credentials: 'include',
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      });
      const j = await r.json();
      if (!j?.body?.userId) throw new Error('Pixiv 信息获取失败');
      return { userId: j.body.userId, userName: j.body.userName };
    }

    async function openAuthorFolderInEagle() {
      try {
        if (!isArtworkPage()) return toast('❌ 当前页面不是作品详情页');
        if (typeof checkEagle === 'function' && !(await checkEagle())) return toast('❌ Eagle 未连接/未启动');
        const illustId = getArtworkId();
        if (!illustId) return toast('❌ 未能识别作品ID');
        const info = await fetchIllustInfo(illustId);
        if (!info?.userId) return toast('❌ 未能获取作者信息');
        if (typeof ensureArtistFolder !== 'function') return toast('❌ 缺少 ensureArtistFolder()');

        const fid = await ensureArtistFolder(info.userId, info.userName);
        if (!fid) return toast('❌ 未能创建/获取作者文件夹');

        window.open(`${EAGLE_BASE()}/folder?id=${encodeURIComponent(fid)}`, '_blank', 'noopener,noreferrer');
        toast('✅ 已打开作者文件夹');
      } catch (e) {
        toast('❌ 打开作者文件夹失败：' + (e?.message || e));
      }
    }

    function makeBtn() {
      const btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.type = 'button';
      btn.textContent = '📁 作者文件夹';
      btn.title = '打开作者文件夹';
      Object.assign(btn.style, {
        display: 'inline-flex',alignItems: 'center',gap: '6px',padding: '6px 10px',
        borderRadius: '999px',border: '1px solid #FD9E16',background: '#fff',
        cursor: 'pointer',fontSize: '12px',lineHeight: '12px',zIndex: 2147483002,
        position: 'relative',marginRight: '8px',whiteSpace: 'nowrap'
      });
      btn.onclick = openAuthorFolderInEagle;
      return btn;
    }

    function mountBtn() {
      if (!isArtworkPage() || document.getElementById(BTN_ID)) return;
      const btn = makeBtn();
      const likeBtn = [...document.querySelectorAll('button.style_button__c7Nvf svg path')]
        .find(p => p.getAttribute('d')?.trim().startsWith('M2,6 C0.8954305,6'))
        ?.closest('button');
      likeBtn?.parentElement?.insertBefore(btn, likeBtn);
    }

    const boot = () => setTimeout(mountBtn, 300);
    (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();

    let lastUrl = location.href;
    setInterval(() => { if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(mountBtn, 400); } }, 500);

    const mo = new MutationObserver(mountBtn);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();


  /******************** 勾选框（同 0.9.5.4） ********************/
  let lastChecked = null;

  function addDownloadedBadge(cb) {
    const id = cb?.dataset?.id;
    if (!id || !downloadedMap[id]) return;
    const host = cb.parentElement;
    if (!host || host.querySelector('.pxe-dl-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'pxe-dl-badge';
    badge.textContent = '已下';
    Object.assign(badge.style, {
      position: 'absolute',
      top: '4px',
      left: '28px',
      padding: '1px 4px',
      fontSize: '10px',
      color: '#fff',
      background: '#10b981',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      pointerEvents: 'none',
      zIndex: 2147483002
    });
    host.appendChild(badge);
    cb.title = (cb.title || '') + ' 已下载';
  }

  function markDownloadedCheckboxes() {
    document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => addDownloadedBadge(cb));
  }

  function addCheck(a) {
    const m = a.href.match(/artworks\/(\d+)/); if (!m) return;
    const id = m[1];
    
    // 排除非作品链接：用户页面链接等
    // 检查链接路径是否包含 /users/（用户主页链接）
    if (a.href.includes('/users/') && !a.href.includes('/artworks/')) return;
    
    // 检查图片，排除头像（如果有图片的话）
    const img = a.querySelector('img');
    if (img) {
      const imgSrc = img.src || img.dataset.src || '';
      // 排除头像图片
      if (imgSrc.includes('user-profile') || imgSrc.includes('/user/')) return;
    }
    
    if (document.querySelector(`.pxe-mini-checkbox[data-id="${id}"]`)) return;
    let host = a.closest('div[role="listitem"], div[data-testid], figure, li, article, a');
    if (!host) host = a.parentElement || a;
    function findPositionedAncestor(el) {
      let p = el;
      while (p && p !== document.body) {
        const pos = getComputedStyle(p).position;
        if (pos && pos !== 'static') return p;
        p = p.parentElement;
      }
      return null;
    }
    const container = findPositionedAncestor(host) || host;
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'pxe-mini-checkbox';
    cb.dataset.id = id;
    Object.assign(cb.style, {
      position: 'absolute', top: '6px', left: '6px', zIndex: 2147483001,
      width: '18px', height: '18px', accentColor: '#409EFF', cursor: 'pointer'
    });
    cb.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.shiftKey && lastChecked) {
        const all = Array.from(new Map(Array.from(document.querySelectorAll('.pxe-mini-checkbox')).map(x => [x.dataset.id, x])).values());
        const i1 = all.indexOf(lastChecked), i2 = all.indexOf(cb);
        const [s, e2] = [Math.min(i1, i2), Math.max(i1, i2)];
        for (let i = s; i <= e2; i++) all[i].checked = cb.checked;
      }
      lastChecked = cb.checked ? cb : null;
    });
    container.appendChild(cb);
    addDownloadedBadge(cb);
  }
  function scan() { document.querySelectorAll('a[href*="/artworks/"]:not([data-pxe-mini])').forEach(a => { a.dataset.pxeMini = 1; addCheck(a); }); }
  function watch() { scan(); if (!watch._mo) { watch._mo = new MutationObserver(m => { if (m.some(x => x.addedNodes.length)) scan(); }); watch._mo.observe(document.body, { childList: true, subtree: true }); } }

  /******************** 进度条盒子 & UI ********************/
  let cancel = false, t0 = 0, bigGifFallbacks = [];

  function box(id, title) {
    const w = document.createElement('div'); w.id = id; Object.assign(w.style, { position: 'fixed', top: '14px', right: '14px', zIndex: 2147483000 });
    w.innerHTML = `<div style="width:334px;padding:8px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.18);background:#fff;font-size:12px;">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
      <div id="${id}-left" style="display:flex;align-items:center;gap:6px;">
        <div style="font-weight:600;color:#333;white-space:nowrap;">${title}</div>
        <button id="${id}-led" title="检查 Eagle (点击重载工具条)" style="border:none;background:transparent;padding:0;cursor:pointer;line-height:1;">●</button>
      </div>
      <div id="${id}-eta" style="margin-left:6px;color:#888;font-size:12px;"></div>
      <button id="${id}-close" style="margin-left:auto;padding:2px 6px;border:none;background:#909399;color:#fff;border-radius:4px;cursor:pointer;">关闭</button>
    </div>
    <div style="flex:1;border:1px solid #e6e6e6;height:16px;border-radius:4px;overflow:hidden;background:#f5f7fa;margin-bottom:6px;">
      <div id="${id}-bar" style="width:0%;height:100%;background:#409eff;color:#fff;text-align:center;line-height:16px;">0%</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      <div id="${id}-txt" style="color:#666;"></div>
      <button id="${id}-cancel" style="margin-left:auto;padding:2px 6px;border:none;background:#f56c6c;color:#fff;border-radius:4px;cursor:pointer;">取消</button>
    </div>
  </div>`;
    document.body.appendChild(w);
    w.querySelector(`#${id}-close`).onclick = () => w.remove();
    w.querySelector(`#${id}-cancel`).onclick = () => { if (cancel) return; cancel = true; cancelInflight(); const b = w.querySelector(`#${id}-bar`); b.style.background = '#f56c6c'; b.textContent = '取消中...'; };
    w.querySelector(`#${id}-led`).onclick = () => { document.getElementById('pxeMiniBar')?.remove(); setTimeout(mountBar, 0); checkEagleLed(w.querySelector(`#${id}-led`)); };
    checkEagleLed(w.querySelector(`#${id}-led`));
    return w;
  }

  // 统一的进度更新函数（避免 updScan / updImport 重复）
  function updateProgress(boxId, { done = 0, total = 0, ok = 0, collectPhase = false } = {}) {
    const b = document.querySelector(`#${boxId}-bar`);
    const t = document.querySelector(`#${boxId}-txt`);
    const e = document.querySelector(`#${boxId}-eta`);

    if (collectPhase) {
      if (b) { b.style.width = '0%'; b.textContent = '收集中'; }
      if (t) { t.textContent = `已找到 ${done} 个作品ID`; }
      return;
    }

    const p = total > 0 ? Math.round(done / total * 100) : 0;
    if (b) { b.style.width = Math.max(1, p) + '%'; b.textContent = `${p}%`; }
    if (t) { t.textContent = `${done} / ${total} 作品 (成功:${ok})`; }

    const dt = (Date.now() - t0) / 1000;
    // 需要至少 1 秒且 done >= 1 才能计算速度
    if (dt >= 1 && done > 0) {
      const rate = done / dt;
      const remain = total - done;
      const eta = rate > 0 ? Math.round(remain / rate) : 0;
      if (e) { e.textContent = `ETA ${Math.floor(eta / 60)}m${eta % 60}s`; }
    } else if (e) {
      // 数据不足，显示占位符
      e.textContent = '计算中...';
    }
  }

  function showScan() { cancel = false; t0 = Date.now(); document.getElementById('pxeScan')?.remove(); const el = box('pxeScan', '扫描作品'); el.querySelector('#pxeScan-txt').textContent = '正在收集作品ID...'; updateProgress('pxeScan', { done: 0, total: 0, collectPhase: true }); }
  function closeScan() { document.getElementById('pxeScan')?.remove(); }
  function showImport(total) { cancel = false; t0 = Date.now(); document.getElementById('pxeMiniProg')?.remove(); const el = box('pxeMiniProg', 'PTE'); el.querySelector('#pxeMiniProg-txt').textContent = `0 / ${total} 作品`; }

  // 向后兼容的旧函数（现在委托给 updateProgress）
  function updScan(done, total, collectPhase) {
    updateProgress('pxeScan', { done, total, collectPhase });
  }
  function updImport(done, total, ok = 0) {
    updateProgress('pxeMiniProg', { done, total, ok });
    if (done === total && !cancel) { setTimeout(() => document.getElementById('pxeMiniProg')?.remove(), 1200); }
  }

  /******************** Eagle 连接指示 ********************/
  async function checkEagle() { try { const r = await xhr({ url: EAGLE.base + EAGLE.api.list }); return !!(r && (r.data || r.folders)); } catch { return false; } }
  async function checkEagleLed(el) {
    const ok = await checkEagle();
    if (!el) return ok;
    el.textContent = '●';
    el.style.color = ok ? '#10b981' : '#ef4444';
    el.title = (ok ? 'Eagle 已连接' : 'Eagle 未连接') + '（点击重载工具条）';
    return ok;
  }

  /******************** 收集ID ********************/
  function collectIdsFromPage() {
    const anchors = Array.from(document.querySelectorAll('a[href*="/artworks/"]'));
    return [...new Set(anchors.map(a => a.href.match(/artworks\/(\d+)/)?.[1]).filter(Boolean))];
  }

  /******************** 极简长条 UI（保持 0.9.5.4） ********************/
  function isCollapsed() { return !!LS.get('collapsed', false); }
  function setCollapsed(v, pos) {
    LS.set('collapsed', !!v);
    const bar = document.getElementById('pxeMiniBar');
    if (!v) {
      // 还原：优先用当前小圆点中心作为 anchor
      if (bar) {
        try {
          const r = bar.getBoundingClientRect();
          const anchor = { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
          localStorage.setItem(LSKEY + ':anchor', JSON.stringify(anchor));
          // 同时把当前左上角写回 barPos，作为还原时的基准
          LS.set('barPos', { x: Math.round(r.left), y: Math.round(r.top) });
        } catch { }
        bar.remove();
      }
      // 重新挂载为面板
      mountBar();
      return;
    } else {
      // 缩小：允许传入目标左上角 pos（来自缩小按钮计算），否则保留现有 barPos
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        LS.set('barPos', { x: Math.floor(pos.x), y: Math.floor(pos.y) });
      }
      if (bar) bar.remove();
      mountBar();
      return;
    }
  }
  function enableCollapsedDragOrClick(bar, m) {
    let dragging = false, moved = false, sx = 0, sy = 0;

    function clamp(x, y, w, h) {
      const nx = Math.min(window.innerWidth - m - w, Math.max(m, x));
      const ny = Math.min(window.innerHeight - m - h, Math.max(m, y));
      return { x: nx, y: ny };
    }

    bar.addEventListener('pointerdown', (ev) => {
      dragging = true; moved = false; sx = ev.clientX; sy = ev.clientY;
      try { bar.setPointerCapture(ev.pointerId); } catch { }
      bar.style.cursor = 'grabbing';
    });

    bar.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      const r = bar.getBoundingClientRect();
      const w = r.width, h = r.height;
      const pos = clamp(r.left + dx, r.top + dy, w, h);
      bar.style.left = pos.x + 'px';
      bar.style.top = pos.y + 'px';
      sx = ev.clientX; sy = ev.clientY;
    });

    function finish(ev) {
      if (!dragging) return;
      dragging = false; bar.style.cursor = 'grab';
      try {
        const r = bar.getBoundingClientRect();
        localStorage.setItem(LSKEY + ':barPos', JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }));
      } catch { }
      if (!moved) {
        // 视为点击：展开面板
        setCollapsed(false);
      }
      try { bar.releasePointerCapture(ev.pointerId); } catch { }
    }

    bar.addEventListener('pointerup', finish);
    bar.addEventListener('pointercancel', finish);
  }

  /** 拖动整块面板（非最小化状态）。handleEl 存在时，只允许拖动 handleEl 区域 */
  function enableDrag(box, margin, handleEl) {
    const target = handleEl || box;
    let dragging = false, sx = 0, sy = 0;

    function clamp(x, y, w, h) {
      const nx = Math.min(window.innerWidth - margin - w, Math.max(margin, x));
      const ny = Math.min(window.innerHeight - margin - h, Math.max(margin, y));
      return { x: nx, y: ny };
    }

    target.addEventListener('pointerdown', (ev) => {
      // 只允许左键 / 触摸
      if (ev.button !== undefined && ev.button !== 0) return;
      dragging = true;
      try { target.setPointerCapture(ev.pointerId); } catch { }
      const r = box.getBoundingClientRect();
      sx = ev.clientX - r.left;
      sy = ev.clientY - r.top;
      document.body.style.userSelect = 'none';
    });

    target.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const r = box.getBoundingClientRect();
      const { x, y } = clamp(ev.clientX - sx, ev.clientY - sy, r.width, r.height);
      box.style.left = x + 'px';
      box.style.top = y + 'px';
    });

    function finish(ev) {
      if (!dragging) return;
      dragging = false;
      try { target.releasePointerCapture(ev.pointerId); } catch { }
      document.body.style.userSelect = '';
      try {
        const r = box.getBoundingClientRect();
        localStorage.setItem(LSKEY + ':barPos', JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }));
      } catch { }
    }
    target.addEventListener('pointerup', finish);
    target.addEventListener('pointercancel', finish);
  }

  function mountBar() {
    if (document.getElementById('pxeMiniBar')) return;
    const m = CFG.ui.margin; const pos = LS.get('barPos', { x: CFG.ui.x, y: CFG.ui.y });
    const bar = document.createElement('div'); bar.id = 'pxeMiniBar'; document.body.appendChild(bar);

    const colW = 32, gapX = 10, pad = 10, cols = 3;
    const fixedW = cols * colW + (cols - 1) * gapX + pad * 2;

    if (isCollapsed()) {
      Object.assign(bar.style, {
        position: 'fixed', zIndex: 2147483647, left: pos.x + 'px', top: pos.y + 'px',
        width: '40px', height: '40px', borderRadius: '999px', background: '#409eff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: '700', fontSize: '16px',
        boxShadow: '0 6px 22px rgba(0,0,0,.12)', userSelect: 'none', cursor: 'grab'
      });
      bar.style.background = (CFG.mode === 'disk' ? COLOR.disk : COLOR.eagle);
      bar.textContent = (CFG.mode === 'disk' ? 'D' : 'E');
      bar.title = '展开 (单击) / 拖动 (移动位置)';
      enableCollapsedDragOrClick(bar, m);
      return;
    }

    Object.assign(bar.style, {
      position: 'fixed', zIndex: 2147483647, left: pos.x + 'px', top: pos.y + 'px',
      background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,.08)', borderRadius: '12px',
      boxShadow: '0 6px 22px rgba(0,0,0,.12)', boxSizing: 'border-box',
      padding: `8px ${pad}px`, overflow: 'hidden', userSelect: 'none',
      width: fixedW + 'px', maxWidth: `calc(100vw - ${m * 2}px)`
    });

    // 顶部：标题(蓝色粗体 PTE) + 绿灯 + 时钟 + D/E + 缩小
    const topRow = document.createElement('div');
    Object.assign(topRow.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' });

    const title = document.createElement('div'); title.textContent = 'PTE';
    title.style.cssText = 'font-size:12px;cursor:move;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700;color:#1f6fff;flex-shrink:0;';

    // 中间容器：绿灯、时钟、D/E 平均分配
    const middleGroup = document.createElement('div');
    Object.assign(middleGroup.style, { display: 'flex', alignItems: 'center', gap: '4px', flex: '1', justifyContent: 'space-around', minWidth: '0' });

    const led = document.createElement('button'); led.textContent = '●'; led.title = '检查 Eagle (点击重载工具条)';
    led.style.cssText = 'border:none;background:transparent;padding:0;cursor:pointer;line-height:1;color:#10b981;font-size:12px;flex:0 1 auto;';
    led.onclick = () => { const r = bar.getBoundingClientRect(); LS.set('barPos', { x: r.left, y: r.top }); bar.remove(); setTimeout(mountBar, 0); };
    checkEagleLed(led);



    // 顶部模式指示：显示 'E' 或 'D'，仅用字体颜色区分；点击可切换
    const modeMark = document.createElement('button'); modeMark.setAttribute('data-pxe-mode-mark', '1');
    function updateModeMark() {
      const disk = (CFG.mode === 'disk');
      modeMark.textContent = disk ? 'D' : 'E';
      modeMark.title = disk ? '本地模式（点击切换）' : 'Eagle 模式（点击切换）';
      modeMark.style.cssText = 'border:none;background:transparent;padding:0;width:16px;height:18px;'
        + 'font-size:12px;font-weight:700;cursor:pointer;line-height:18px;text-align:center;flex:0 1 auto;'
        + 'color:' + (disk ? COLOR.disk : COLOR.eagle) + ';';
    }
    updateModeMark();
    modeMark.onclick = () => { CFG.mode = (CFG.mode === 'disk' ? 'eagle' : 'disk'); try { LS.set('mode', CFG.mode); } catch { } updateModeMark(); render(); };

    // 顶部时钟（仅在开启时显示；点击即可关闭并消失）
    const topClockBox = document.createElement('span');

    function updateTopClock() {
      // 顶部工具条始终显示“投稿时间→添加日期”开关
      const on = !!CFG.feature.useUploadAsAddDate;
      try {
        topClockBox.style.display = 'inline-block';
        topClockBox.textContent = '🕒';
        topClockBox.title = on ? '投稿时间→添加日期：已启用（点击关闭）' : '投稿时间→添加日期：未启用（点击开启）';
        topClockBox.style.cssText = [
          'cursor:pointer',
          'font-size:12px',
          'line-height:1',
          'padding:0 2px',
          'flex:0 1 auto',
          on ? 'filter:none' : 'filter:grayscale(100%) opacity(0.55)'
        ].join(';');
        topClockBox.onclick = () => {
          CFG.feature.useUploadAsAddDate = !CFG.feature.useUploadAsAddDate;
          try { LS.set('useUploadAsAddDate', CFG.feature.useUploadAsAddDate); } catch (e) { }
          updateTopClock();
          try { render && render(); } catch (e) { }
        };
      } catch (e) {
        // 若顶部容器不存在，降级隐藏
        try {
          topClockBox.style.display = 'none';
          topClockBox.textContent = '';
          topClockBox.removeAttribute('title');
          topClockBox.onclick = null;
        } catch (_) { }
      }
    }
    // 初始渲染一次
    updateTopClock();
    // 监听 LS.set 变化事件（已在全局初始化）
    window.addEventListener('pte-setting-change', (e) => {
      if (e.detail.key === 'useUploadAsAddDate') { try { updateTopClock(); } catch(e) { } }
    });

    const shrink = document.createElement('button'); shrink.textContent = '➖'; shrink.title = '缩小';
    shrink.style.cssText = 'padding:0 4px;height:20px;border:none;background:transparent;color:#6b7280;border-radius:4px;cursor:pointer;font-size:16px;flex-shrink:0;';
    shrink.onclick = () => {
      const sr = shrink.getBoundingClientRect();
      const size = 40; const m = CFG.ui.margin;
      let x = sr.right - size; let y = sr.top - Math.max(0, (size - sr.height) / 2);
      x = Math.min(window.innerWidth - m - size, Math.max(m, x));
      y = Math.min(window.innerHeight - m - size, Math.max(m, y));
      try { localStorage.setItem(LSKEY + ':anchor', JSON.stringify({ x: x + size / 2, y: y + size / 2 })); } catch { }
      setCollapsed(true, { x: Math.floor(x), y: Math.floor(y) });
    };

    middleGroup.append(led, topClockBox, modeMark);
    topRow.append(title, middleGroup, shrink);
    bar.appendChild(topRow);
    // 用 anchor(小圆点中心) 来精确对齐缩小按钮：
    // 计算缩小按钮相对整个面板的中心偏移，然后把面板左上角设置为 anchor - 偏移
    try {
      const anchorRaw = localStorage.getItem(LSKEY + ':anchor');
      if (anchorRaw) {
        const anchor = JSON.parse(anchorRaw);
        const br = bar.getBoundingClientRect();
        const sr = shrink.getBoundingClientRect();
        const relX = (sr.left - br.left) + sr.width / 2;
        const relY = (sr.top - br.top) + sr.height / 2;
        let nx = Math.round(anchor.x - relX);
        let ny = Math.round(anchor.y - relY);
        const m = CFG.ui.margin;
        const vw = window.innerWidth, vh = window.innerHeight;
        // 夹取，保证面板完整可见
        nx = Math.max(m, Math.min(vw - m - br.width, nx));
        ny = Math.max(m, Math.min(vh - m - br.height, ny));
        bar.style.left = nx + 'px';
        bar.style.top = ny + 'px';
        try { localStorage.setItem(LSKEY + ':barPos', JSON.stringify({ x: nx, y: ny })); } catch { }
        try { localStorage.removeItem(LSKEY + ':anchor'); } catch { }
      }
    } catch { }
    // 网格按钮
    const grid = document.createElement('div');
    Object.assign(grid.style, { display: 'grid', gridTemplateColumns: 'repeat(3, 32px)', justifyContent: 'start', justifyItems: 'center', gap: '6px 10px', alignItems: 'center' });
    bar.appendChild(grid);
    grid.style.gridAutoRows = '28px';


    // 统一按钮尺寸 & 顶部模式同步
    const BTN = 40; // 与第一页一致（如需调整，改这里即可）
    function syncModeMark() {
      const el = document.querySelector('[data-pxe-mode-mark="1"]');
      if (!el) return;
      const disk = (CFG.mode === 'disk');
      el.textContent = disk ? 'D' : 'E';
      el.title = disk ? '本地模式（点击切换）' : 'Eagle 模式（点击切换）';
      el.style.color = disk ? COLOR.disk : COLOR.eagle;
    }


    function iconBtn(emoji, tip, onClick, opts = {}) {
      const b = document.createElement('button'); b.textContent = emoji; b.title = tip;
      const bg = opts.bg || '#409eff';
      b.style.cssText = `width:32px;height:28px;margin:0;box-sizing:border-box;padding:0;border:none;background:${bg};border-radius:8px;box-shadow:0 1px 2px rgba(0,0,0,.06);cursor:pointer;font-size:16px;line-height:28px;text-align:center;text-align:center;text-align:center;text-align:center;text-align:center;`;
      b.onclick = onClick; return b;
    }
    function spacer() { const b = document.createElement('button'); b.title = ''; b.disabled = true; b.style.cssText = `width:${BTN}px;height:${BTN}px;padding:0;border:none;background:transparent;border-radius:8px;opacity:0;pointer-events:none;`; return b; }
    function invertSelection() { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = !cb.checked; }); }

    const onArtwork = isArtwork();
    const onUserPage = isUser();
    const state = { page: 1 };

    const render = () => {
      grid.innerHTML = '';
      if (state.page === 1) {
        if (onUserPage) {
          grid.append(
            iconBtn('🌐', '作者全部\n快捷键: A\n需按3次', () => importMode('all')),
            iconBtn('📄', '本页\n快捷键: P\n需按3次', () => importMode('page')),
            iconBtn('✅', '仅勾选\n快捷键: O\n需按3次', () => importMode('selected')),
            iconBtn('☑️', '全选\n快捷键: S', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = true; }); }),
            iconBtn('◻️', '全不选\n快捷键: N', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = false; }); }),
            iconBtn('➡️', '下一页', () => { state.page = 2; render(); })
          );
        } else if (onArtwork) {
          // 详情页：六键布局，顺序：此作 | 本页 | 仅勾选 | 全选 | 全不选 | 下一页
          grid.append(
            iconBtn('🎯', '此作', () => importMode('one')),
            iconBtn('📄', '本页\n快捷键: P\n需按3次', () => importMode('page')),
            iconBtn('✅', '仅勾选\n快捷键: O\n需按3次', () => importMode('selected')),
            iconBtn('☑️', '全选\n快捷键: S', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = true; }); }),
            iconBtn('◻️', '全不选\n快捷键: N', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = false; }); }),
            iconBtn('➡️', '下一页', () => { state.page = 2; render(); })
          );
        } else {
          grid.append(
            iconBtn('🌐', '本页全部\n快捷键: P\n需按3次', () => importMode('page')),
            iconBtn('📄', '本页\n快捷键: P\n需按3次', () => importMode('page')),
            iconBtn('✅', '仅勾选\n快捷键: O\n需按3次', () => importMode('selected')),
            iconBtn('☑️', '全选\n快捷键: S', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = true; }); }),
            iconBtn('◻️', '全不选\n快捷键: N', () => { document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = false; }); }),
            iconBtn('➡️', '下一页', () => { state.page = 2; render(); })
          );
        }
      } else {
        // 第二页：反选 + 模式切换(E/D) + 选择下载目录 + 公告按钮 + 上一页（已将“投稿时间→添加日期”移动到顶部工具条）

        const btnInvert = iconBtn('🔁', '反选\n快捷键: R', invertSelection);
        const btnTagManager = iconBtn('🏷️', '标签管理\n快捷键: T', async () => { await createTagManagerModal(); });
        const btnSettings = iconBtn('⚙️', '设置\n格式/描述', async () => { await createSettingsModal(); });
        const btnPick = iconBtn('📁', '选择下载目录', async () => { await ptePickDownloadsRoot(); }, { bg: '#f1a72e' });
        const btnNotice = iconBtn('📜', '公告', () => { createWelcomeModal(Date.now()); });
        const btnBack = iconBtn('⬅️', '上一页', () => { state.page = 1; render(); });
        try {
          grid.style.gridTemplateColumns = 'repeat(3, 32px)';
          btnInvert.style.gridColumn = '1';
          btnInvert.style.gridRow = '1';
          btnTagManager.style.gridColumn = '2';
          btnTagManager.style.gridRow = '1';
          btnSettings.style.gridColumn = '3';
          btnSettings.style.gridRow = '1';
          btnPick.style.gridColumn = '1';
          btnPick.style.gridRow = '2';
          btnNotice.style.gridColumn = '2';
          btnNotice.style.gridRow = '2';
          btnBack.style.gridColumn = '3';
          btnBack.style.gridRow = '2';
        } catch (e) { }
        grid.append(btnInvert, btnTagManager, btnSettings, btnPick, btnNotice, btnBack);
      }
    };

    render();
    enableDrag(bar, m, title);
  }

  watch();
  setTimeout(mountBar, 0);

  try {
    // Use existing LS helper if available; otherwise namespaced localStorage shim
    var _LS = (typeof LS !== 'undefined' && LS && typeof LS.get === 'function')
      ? LS
      : {
        get: function (k, d) {
          try {
            var v = localStorage.getItem('pxeMini:' + k);
            return v !== null ? JSON.parse(v) : d;
          } catch (e) { return d; }
        },
        set: function (k, v) {
          try {
            localStorage.setItem('pxeMini:' + k, JSON.stringify(v));
          } catch (e) { }
        }
      };

    function fmtTime(ts) {
      try {
        return new Date(ts).toLocaleString('zh-CN', { hour12: false });
      } catch (e) {
        return '' + ts;
      }
    }

    function createWelcomeModal(updatedAtTs) {
      if (document.getElementById('pteWelcome')) return;
      var mask = document.createElement('div');
      mask.id = 'pteWelcome';
      Object.assign(mask.style, {
        position: 'fixed', inset: '0',
        background: 'rgba(0,0,0,.35)',
        backdropFilter: 'blur(2px)',
        zIndex: 2147483647,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      });
      var box = document.createElement('div');
      Object.assign(box.style, {
        width: 'min(560px,92vw)',
        borderRadius: '16px',
        background: '#fff',
        boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        padding: '16px 18px',
        fontSize: '13px',
        color: '#444',
        lineHeight: '1.6',
        maxHeight: '80vh', overflow: 'auto'
      });
      box.innerHTML = ''
        + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">'
        + '<div style="font-size:18px;font-weight:700;color:#1f6fff;">PTE 已更新 ✅</div>'
        + '<span style="margin-left:auto;color:#999;font-size:12px">v' + PTE_VER + '</span>'
        + '</div>'
        + '<div style="color:#999;font-size:12px;margin-bottom:8px;">版本号：v' + PTE_VER + '</div>'
        + '<div>'
        + '<p>右上角工具条：<b style="color:#409eff">E（蓝）</b> = Eagle 模式，<b style="color:#f1a72e">D（橙）</b> = 本地模式。</p>'
        + '<p>详情页六键：<code>此作</code> / <code>本页</code> / <code>仅勾选</code> / <code>全选</code> / <code>全不选</code> / <code>下一页</code>。</p><p>顶部工具条新增并固定“🕒 投稿时间→添加日期”开关（点击切换；关闭时灰度显示）。</p>'
        + '<p>第二页：🔁 反选 · 🏷️ 标签管理 · ⚙️ 设置 · 📁 下载目录 · 📜 公告 · ⬅️ 上一页。</p>'
        + '<p><b style="color:#ff4d4f">大动图说明：</b> 当 ugoira→GIF 体积过大（约 &gt;40MB）时，脚本会自动从 Eagle 模式切换为“保存到本地”模式，并保存到下载目录下的 <code>Pixiv/作者名_作者ID/作品ID.gif</code>，以避免浏览器 / 油猴在导入 Eagle 时因消息过长而卡住。</p>'
        + '<p style="color:#666">小技巧：点击绿灯检查 Eagle；点“➖”可缩小为悬浮圆点。</p>'
        + '<p style="margin-top:6px"><b>没看到弹窗/工具条？</b> 如果脚本已启动但首次没看到，UI 可能在浏览器窗口右侧；请尝试将浏览器窗口<b>拉宽</b>即可看见。</p>'
        + '<p><b>连续多选：</b> 在列表/缩略图页，先点击左侧的勾选框选中一项，然后按住 <kbd>Shift</kbd> 再点击另一项，<b>两者之间的范围</b>会被一次性选中。</p>'
        + '</div>'
        + '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">'
        + '<button id="pxeWelcomeOk" style="padding:6px 14px;border:none;border-radius:8px;background:#409eff;color:#fff;cursor:pointer;font-weight:600">我知道了</button>'
        + '</div>';
      mask.appendChild(box);
      document.body.appendChild(mask);
      mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
      var ok = box.querySelector('#pxeWelcomeOk');
      if (ok) ok.addEventListener('click', function () { mask.remove(); });
    }

    function showWelcomePerVersion() {
      var hasShown = _LS.get('welcomeShownOnce', false);

      // Only show welcome modal once in the user's lifetime
      if (!hasShown) {
        var now = Date.now();
        _LS.set('welcomeAt', now);
        _LS.set('welcomeVer', PTE_VER);
        _LS.set('welcomeShownOnce', true);
        // Show after DOM ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { createWelcomeModal(now); }, 200); }, { once: true });
        } else {
          setTimeout(function () { createWelcomeModal(now); }, 200);
        }
      }
    }

    // Schedule after the script's own UI mounts; using a slight delay avoids racing existing layout code
    setTimeout(showWelcomePerVersion, 600);
  } catch (e) { /* silent */ }

  // 快捷键支持：按 T 键快速打开/关闭标签管理器
  // 按键计数器：用于防误触（A、P、O需要按3次才能激活）
  const keyPressCounter = { a: 0, p: 0, o: 0, aTimer: null, pTimer: null, oTimer: null };

  document.addEventListener('keydown', (e) => {
    // 检查是否在输入框或textarea中
    const isInInput = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

    // 小键盘 ← 和 → 用于在作品间导航（使用Pixiv原生的导航机制）
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !isInInput) {
      e.preventDefault();
      // 查找Pixiv原生的导航按钮并点击
      const direction = e.key === 'ArrowLeft' ? 'prev' : 'next';
      const navBtn = document.querySelector(`[class*="${direction}"]`);
      if (navBtn) {
        navBtn.click();
      }
    }

    // 按 V 键还原标签管理器位置到中心
    if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !isInInput) {
      e.preventDefault();
      const tagManager = document.getElementById('pteTagManager');

      if (tagManager) {
        // 标签管理器
        const box = tagManager.querySelector('div[style*="position: absolute"]');
        if (box) {
          box.style.top = '50%';
          box.style.left = '50%';
          box.style.transform = 'translate(-50%, -50%)';
          LS.set('pteDragPos', null);
          showToast('✅ 标签管理器已还原到中心位置');
        }
      } else {
        showToast('⚠️ 标签管理器未打开');
      }
    }

    // 按 T 键打开/关闭标签管理（但不在输入框中时）
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !isInInput) {
      e.preventDefault();
      const tagManager = document.getElementById('pteTagManager');
      if (tagManager) {
        // 标签管理器已打开，关闭它
        tagManager.remove();
      } else {
        // 未打开，打开它
        createTagManagerModal();
      }
    }

    // 选择操作快捷键（不在输入框中时）
    if (!isInInput) {
      // A - 作者全部（需要按3次才能激活）
      if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        clearTimeout(keyPressCounter.aTimer);
        keyPressCounter.a++;
        if (keyPressCounter.a >= 3) {
          importMode('all');
          keyPressCounter.a = 0;
        } else {
          // 2秒内没有继续按，重置计数器
          keyPressCounter.aTimer = setTimeout(() => { keyPressCounter.a = 0; }, 2000);
        }
      }
      // P - 本页（需要按3次才能激活）
      else if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        clearTimeout(keyPressCounter.pTimer);
        keyPressCounter.p++;
        if (keyPressCounter.p >= 3) {
          importMode('page');
          keyPressCounter.p = 0;
        } else {
          // 2秒内没有继续按，重置计数器
          keyPressCounter.pTimer = setTimeout(() => { keyPressCounter.p = 0; }, 2000);
        }
      }
      // N - 全不选
      else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = false; });
      }
      // R - 反选
      else if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = !cb.checked; });
      }
      // S - 全选
      else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        document.querySelectorAll('.pxe-mini-checkbox').forEach(cb => { cb.checked = true; });
      }
      // O - 仅勾选（需要按3次才能激活）
      else if (e.key.toLowerCase() === 'o' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        clearTimeout(keyPressCounter.oTimer);
        keyPressCounter.o++;
        if (keyPressCounter.o >= 3) {
          importMode('selected');
          keyPressCounter.o = 0;
        } else {
          // 2秒内没有继续按，重置计数器
          keyPressCounter.oTimer = setTimeout(() => { keyPressCounter.o = 0; }, 2000);
        }
      }
    }
  }, false);
})();
/* === /PTE Welcome Modal (auto-insert) === */
