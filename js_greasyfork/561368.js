// ==UserScript==
// @name         Stellar Blade Wplace Tool
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  JSON Config + Custom Overlay Delete + Region Status System (Chunks Disabled)
// @author       luke77_7
// @match        https://wplace.live/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561368/Stellar%20Blade%20Wplace%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/561368/Stellar%20Blade%20Wplace%20Tool.meta.js
// ==/UserScript==

(async function() {
'use strict';

// ============================================
// 🆕 GITHUB JSON CONFIGURATION
// ============================================
const GITHUB_CONFIG = {
  JSON_URL: 'https://raw.githubusercontent.com/kwbr1/Nk-SB-ov/refs/heads/main/overlays.json',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  FALLBACK_CHECK_INTERVAL: 60 * 1000 // 1 minuto
};

let baseOverlays = [];

let REGIONS = {};

const REGION = {
  name: "World",
  chunks: []
};

const CHUNK_WIDTH = 1000;
const CHUNK_HEIGHT = 1000;
const MAX_IMAGE_DIMENSION = 5000;

// ============================================
// PERFORMANCE CONFIGURATION
// ============================================
const PERFORMANCE_CONFIG = {
  MAX_WORKER_POOL: 4,
  MAX_CACHE_SIZE: 50,
  MAX_CONCURRENT_PROCESSING: 6,
  PROCESSING_THROTTLE_MS: 50,
  CHUNK_PRIORITY_RADIUS: 2,
  ENABLE_PROGRESSIVE_LOADING: true,
  DECOMPACT_CACHE_SIZE: 100
};

// ============================================
// LOCALSTORAGE FOR PERSISTENT STATE
// ============================================
const STORAGE_KEYS = {
  PANEL_STATE: 'dot_panel_expanded',
  OVERLAY_MODE: 'dot_overlay_mode',
  CUSTOM_OVERLAYS: 'dot_custom_overlays',
  JSON_CACHE: 'dot_json_cache',
  JSON_TIMESTAMP: 'dot_json_timestamp'
};

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

// ============================================
// 🆕 JSON CONFIG LOADER FROM GITHUB
// ============================================
async function loadConfigFromGitHub(forceRefresh = false) {
  try {
    const cachedTimestamp = loadFromStorage(STORAGE_KEYS.JSON_TIMESTAMP, 0);
    const now = Date.now();

    // Verifica se precisa atualizar
    if (!forceRefresh && (now - cachedTimestamp) < GITHUB_CONFIG.CACHE_DURATION) {
      const cached = loadFromStorage(STORAGE_KEYS.JSON_CACHE, null);
      if (cached) {
        console.log('📦 Using cached config from GitHub');
        return cached;
      }
    }

    console.log('🌐 Fetching config from GitHub...');
    const response = await fetch(GITHUB_CONFIG.JSON_URL, {
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const config = await response.json();

    // Valida estrutura
    if (!config.overlays || !Array.isArray(config.overlays)) {
      throw new Error('Invalid JSON structure: missing overlays array');
    }
    if (!config.regions || typeof config.regions !== 'object') {
      throw new Error('Invalid JSON structure: missing regions object');
    }

    // Salva cache
    saveToStorage(STORAGE_KEYS.JSON_CACHE, config);
    saveToStorage(STORAGE_KEYS.JSON_TIMESTAMP, now);

    console.log(`✅ Config loaded: ${config.overlays.length} overlays, ${Object.keys(config.regions).length} regions`);
    return config;

  } catch (error) {
    console.error('❌ Error loading config from GitHub:', error);

    // Tenta usar cache antigo
    const cached = loadFromStorage(STORAGE_KEYS.JSON_CACHE, null);
    if (cached) {
      console.warn('⚠️ Using old cached config due to fetch error');
      return cached;
    }

    // Fallback vazio
    console.warn('⚠️ No cache available, using empty config');
    return {
      overlays: [],
      regions: {}
    };
  }
}

// ============================================
// IMAGE OPTIMIZATION UTILITY
// ============================================
async function optimizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const img = new Image();

        img.onload = async () => {
          let width = img.width;
          let height = img.height;

          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            console.log(`🔧 Resizing image from ${img.width}x${img.height} to ${width}x${height}`);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              console.log(`✅ Image optimized: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`);
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png', 0.9);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ============================================
// INDEXEDDB FOR CUSTOM OVERLAY IMAGES
// ============================================
const CUSTOM_DB_NAME = 'DOT_CustomOverlays';
const CUSTOM_DB_VERSION = 1;
const CUSTOM_STORE_NAME = 'images';

class CustomOverlayDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CUSTOM_DB_NAME, CUSTOM_DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(CUSTOM_STORE_NAME)) {
          db.createObjectStore(CUSTOM_STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async saveImage(id, blob) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([CUSTOM_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(CUSTOM_STORE_NAME);
        const request = store.put({ id, blob, timestamp: Date.now() });

        request.onsuccess = () => {
          console.log(`💾 Image saved to IndexedDB: ${id}`);
          resolve();
        };
        request.onerror = () => {
          console.error('IndexedDB save error:', request.error);
          reject(request.error);
        };

        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(transaction.error);
        };

      } catch (error) {
        console.error('Save image error:', error);
        reject(error);
      }
    });
  }

  async getImage(id) {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([CUSTOM_STORE_NAME], 'readonly');
        const store = transaction.objectStore(CUSTOM_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);

      } catch (error) {
        console.error('Get image error:', error);
        reject(error);
      }
    });
  }

  async deleteImage(id) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([CUSTOM_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(CUSTOM_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log(`🗑️ Image deleted from IndexedDB: ${id}`);
          resolve();
        };
        request.onerror = () => reject(request.error);

      } catch (error) {
        console.error('Delete image error:', error);
        reject(error);
      }
    });
  }
}

const customOverlayDB = new CustomOverlayDB();

// ============================================
// REGION NAVIGATION SYSTEM
// ============================================
let mapInstance = null;
let mapHooked = false;

Object.defineProperty(Object.prototype, 'transform', {
  configurable: true,
  enumerable: false,
  set: function(value) {
    if (!mapHooked && value && typeof value.setZoom === 'function' && typeof this.getCanvas === 'function') {
      mapHooked = true;
      mapInstance = this;
      console.log('✅ Map instance captured for navigation!');

      delete Object.prototype.transform;

      this.transform = value;
      return;
    }

    Object.defineProperty(this, 'transform', {
      value: value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
});

function navigateToRegion(regionKey) {
  const region = REGIONS[regionKey];

  if (!region) {
    currentSelection = "region";
    updateDisplay();
    updateDownloadButton();
    return;
  }

  if (mapInstance && typeof mapInstance.flyTo === 'function') {
    try {
      mapInstance.flyTo({
        center: [parseFloat(region.lng), parseFloat(region.lat)],
        zoom: region.zoom,
        animate: true
      });

      console.log(`🚀 Navigating to: ${region.name}`);

      currentSelection = "region";
      updateDisplay();

    } catch (error) {
      console.error('Error navigating with flyTo:', error);
      const newUrl = `https://wplace.live/?lat=${region.lat}&lng=${region.lng}&zoom=${region.zoom}`;
      window.location.href = newUrl;
    }
  } else {
    console.warn('Map not available, using URL navigation');
    const newUrl = `https://wplace.live/?lat=${region.lat}&lng=${region.lng}&zoom=${region.zoom}`;
    window.location.href = newUrl;
  }
}

// ============================================
// OPTIMIZED WEB WORKER POOL (SEM COLOR COUNT!)
// ============================================
class WorkerPool {
  constructor(size = PERFORMANCE_CONFIG.MAX_WORKER_POOL) {
    this.size = size;
    this.workers = [];
    this.availableWorkers = [];
    this.jobQueue = [];
    this.pendingJobs = new Map();
    this.jobId = 0;
    this.activeJobs = 0;

    this.init();
  }

  init() {
    const workerCode = `
      self.onmessage = function(e) {
        const { jobId, originalData, overlayData, width, height } = e.data;

        try {
          const resultData = new Uint8ClampedArray(originalData.length);
          let wrongPixels = 0;
          let totalTargetPixels = 0;

          for (let i = 0; i < originalData.length; i += 4) {
            if (overlayData[i + 3] !== 0) {
              totalTargetPixels++;

              const samePixel = originalData[i] === overlayData[i] &&
                              originalData[i+1] === overlayData[i+1] &&
                              originalData[i+2] === overlayData[i+2] &&
                              originalData[i+3] === overlayData[i+3];

              if (!samePixel) {
                wrongPixels++;
                
                resultData[i] = overlayData[i];
                resultData[i+1] = overlayData[i+1];
                resultData[i+2] = overlayData[i+2];
                resultData[i+3] = overlayData[i+3];
              } else {
                resultData[i] = 0;
                resultData[i+1] = 255;
                resultData[i+2] = 0;
                resultData[i+3] = 255;
              }
            } else {
              resultData[i] = 0;
              resultData[i+1] = 0;
              resultData[i+2] = 0;
              resultData[i+3] = 0;
            }
          }

          self.postMessage({
            jobId: jobId,
            success: true,
            resultData: resultData,
            wrongPixels: wrongPixels,
            totalTarget: totalTargetPixels
          }, [resultData.buffer]);

        } catch (error) {
          self.postMessage({
            jobId: jobId,
            success: false,
            error: error.message
          });
        }
      };
    `;

    try {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);

      for (let i = 0; i < this.size; i++) {
        const worker = new Worker(workerUrl);

        worker.onmessage = (e) => {
          this.handleWorkerResponse(e.data, worker);
        };

        worker.onerror = (error) => {
          console.error(`❌ Worker ${i} Error:`, error);
        };

        this.workers.push(worker);
        this.availableWorkers.push(worker);
      }

      console.log(`✅ Worker Pool initialized with ${this.size} workers`);

    } catch (error) {
      console.error('❌ Failed to create Worker Pool:', error);
    }
  }

  handleWorkerResponse(data, worker) {
    const { jobId, success } = data;
    const job = this.pendingJobs.get(jobId);

    if (!job) {
      this.availableWorkers.push(worker);
      this.activeJobs--;
      this.processQueue();
      return;
    }

    this.pendingJobs.delete(jobId);
    this.availableWorkers.push(worker);
    this.activeJobs--;

    if (success) {
      job.resolve(data);
    } else {
      job.reject(new Error(data.error || 'Unknown worker error'));
    }

    this.processQueue();
  }

  async processPixelDiff(originalData, overlayData, width, height, priority = 0) {
    const jobId = ++this.jobId;

    return new Promise((resolve, reject) => {
      const job = {
        jobId,
        originalData,
        overlayData,
        width,
        height,
        priority,
        resolve,
        reject,
        timeout: setTimeout(() => {
          this.pendingJobs.delete(jobId);
          reject(new Error('Worker timeout (10s)'));
        }, 10000)
      };

      this.jobQueue.push(job);
      this.jobQueue.sort((a, b) => b.priority - a.priority);

      this.processQueue();
    });
  }

  processQueue() {
    while (this.availableWorkers.length > 0 &&
           this.jobQueue.length > 0 &&
           this.activeJobs < PERFORMANCE_CONFIG.MAX_CONCURRENT_PROCESSING) {

      const worker = this.availableWorkers.pop();
      const job = this.jobQueue.shift();

      this.activeJobs++;
      this.pendingJobs.set(job.jobId, job);

      try {
        const originalClone = new Uint8ClampedArray(job.originalData.data);
        const overlayClone = new Uint8ClampedArray(job.overlayData.data);

        worker.postMessage({
          jobId: job.jobId,
          originalData: originalClone,
          overlayData: overlayClone,
          width: job.width,
          height: job.height
        }, [originalClone.buffer, overlayClone.buffer]);

      } catch (error) {
        this.pendingJobs.delete(job.jobId);
        this.availableWorkers.push(worker);
        this.activeJobs--;
        clearTimeout(job.timeout);
        job.reject(error);
      }
    }
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.jobQueue = [];
    this.pendingJobs.clear();
  }
}

const workerPool = new WorkerPool();

// ============================================
// ADVANCED LRU CACHE FOR DECOMPACTED DATA
// ============================================
class LRUCache {
  constructor(maxSize = PERFORMANCE_CONFIG.DECOMPACT_CACHE_SIZE) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);

    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.has(key)) {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    }

    if (this.cache.size >= this.maxSize) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value);
    this.accessOrder.push(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  get size() {
    return this.cache.size;
  }
}

const decompactCache = new LRUCache();

// ============================================
// CHUNK PROCESSING THROTTLE
// ============================================
class ChunkProcessingThrottle {
  constructor() {
    this.processingQueue = new Map();
    this.isProcessing = false;
    this.lastProcessTime = 0;
  }

  async addToQueue(chunkKey, processFn, priority = 0) {
    if (this.processingQueue.has(chunkKey)) {
      return this.processingQueue.get(chunkKey);
    }

    const promise = new Promise(async (resolve, reject) => {
      const queueItem = { processFn, priority, resolve, reject };
      this.processingQueue.set(chunkKey, promise);

      if (!this.isProcessing) {
        this.processQueue();
      }
    });

    return promise;
  }

  async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.processingQueue.size > 0) {
      const now = Date.now();
      const timeSinceLastProcess = now - this.lastProcessTime;

      if (timeSinceLastProcess < PERFORMANCE_CONFIG.PROCESSING_THROTTLE_MS) {
        await new Promise(resolve =>
          setTimeout(resolve, PERFORMANCE_CONFIG.PROCESSING_THROTTLE_MS - timeSinceLastProcess)
        );
      }

      const [chunkKey, promise] = this.processingQueue.entries().next().value;
      this.processingQueue.delete(chunkKey);

      this.lastProcessTime = Date.now();
    }

    this.isProcessing = false;
  }

  clear() {
    this.processingQueue.clear();
    this.isProcessing = false;
  }
}

const chunkThrottle = new ChunkProcessingThrottle();

// Interception system
const CHUNK_DETECTOR = {
  lastKnownChunk: null,
  clickData: null,
  interceptHistory: [],
  maxHistory: 5,
  currentChunkCoords: null
};

// User data
const USER_DATA = {
  username: "Loading...",
  droplets: 0,
  totalPixelsPainted: 0,
  currentLevel: 0,
  nextLevelIn: 0,
  lastUpdate: 0,
  previousLevel: 0
};

// Level-up notification system
const LEVEL_NOTIFICATION = {
  enabled: true,
  normalSound: null,
  specialSound: null,
  normalSoundURL: '',
  specialSoundURL: '',

  init() {
    if (this.normalSoundURL) {
      try {
        this.normalSound = new Audio();
        this.normalSound.volume = 0.5;
        this.normalSound.preload = 'auto';
        this.normalSound.addEventListener('error', (e) => {
          console.error('Error loading normal sound:', e);
          this.normalSound = null;
        });
        this.normalSound.addEventListener('canplaythrough', () => {
          console.log('Normal sound loaded successfully');
        });
        this.normalSound.src = this.normalSoundURL;
      } catch (error) {
        console.error('Error initializing normal sound:', error);
        this.normalSound = null;
      }
    }

    if (this.specialSoundURL) {
      try {
        this.specialSound = new Audio();
        this.specialSound.volume = 0.7;
        this.specialSound.preload = 'auto';
        this.specialSound.addEventListener('error', (e) => {
          console.error('Error loading special sound:', e);
          this.specialSound = null;
        });
        this.specialSound.addEventListener('canplaythrough', () => {
          console.log('Special sound loaded successfully');
        });
        this.specialSound.src = this.specialSoundURL;
      } catch (error) {
        console.error('Error initializing special sound:', error);
        this.specialSound = null;
      }
    }

    console.log('Notification system initialized');
    if (!this.normalSoundURL && !this.specialSoundURL) {
      console.warn('⚠️ No sounds configured. Only visual notifications will be shown.');
    }
  },

  play(isSpecial = false) {
    if (!this.enabled) return;
    const sound = isSpecial ? this.specialSound : this.normalSound;
    if (!sound) return;

    try {
      sound.currentTime = 0;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Error playing sound:', err.message);
        });
      }
    } catch (error) {
      console.warn('Error reproducing sound:', error);
    }
  },

  checkLevelUp(newLevel) {
    if (USER_DATA.previousLevel > 0 && newLevel > USER_DATA.previousLevel) {
      const isCentenary = newLevel % 100 === 0;
      const message = isCentenary
        ? `LEVEL ${newLevel}! CENTENARY REACHED!`
        : `Level Up! You reached level ${newLevel}!`;

      console.log(`🎉 ${message}`);
      this.play(isCentenary);
      this.showVisualNotification(message, isCentenary);
    }
    USER_DATA.previousLevel = newLevel;
  },

  showVisualNotification(message, isSpecial) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: ${isSpecial ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #4CAF50, #45a049)'};
      color: white; padding: 20px 40px; border-radius: 12px; font-size: 24px; font-weight: bold;
      z-index: 99999; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      animation: levelUpPulse 0.5s ease-in-out; text-align: center;
    `;

    if (!document.getElementById('levelup-animation-style')) {
      const style = document.createElement('style');
      style.id = 'levelup-animation-style';
      style.textContent = `
        @keyframes levelUpPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transition = 'opacity 0.5s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 6000);
  }
};

const LEVEL_REQUIREMENTS = {
  getPixelsForNextLevel(currentLevel, pixelsPainted) {
    const floorLevel = Math.floor(currentLevel);
    const requiredPixels = Math.pow(floorLevel * Math.pow(30, 0.65), 1 / 0.65);
    const remaining = Math.ceil(requiredPixels - pixelsPainted);
    return Math.max(0, remaining);
  }
};

// Global state
let overlays = [];
let perChunkStats = {};
let currentSelection = "region";
let overlayMode = "original";
let overlayPixelCounts = new Map();
let loadedImages = new WeakMap();
let pixelCounter, percentageCounter;
let overlayBoundingBoxes = [];
let clickCount = 0;

const OVERLAY_MODES = ["overlay", "original"];

let maxCacheSize = PERFORMANCE_CONFIG.MAX_CACHE_SIZE;
const overlayChunkMap = new Map();

async function extractUserData() {
  try {
    const response = await fetch('https://backend.wplace.live/me', {
      credentials: 'include'
    });

    if (!response.ok) {
      console.warn('Unable to fetch user data');
      return;
    }

    const data = await response.json();
    USER_DATA.username = `${data.name} #${data.id}`;
    USER_DATA.droplets = data.droplets || 0;
    USER_DATA.totalPixelsPainted = data.pixelsPainted || 0;

    const newLevel = Math.floor(data.level) || 0;
    LEVEL_NOTIFICATION.checkLevelUp(newLevel);

    USER_DATA.currentLevel = newLevel;
    USER_DATA.nextLevelIn = LEVEL_REQUIREMENTS.getPixelsForNextLevel(data.level, data.pixelsPainted);
    USER_DATA.lastUpdate = Date.now();

    console.log('✅ User data updated:', USER_DATA);

  } catch (error) {
    console.warn('Error extracting user data:', error);
  }
}

function injectChunkIntoPixelWindow() {
  let lastProcessedChunk = null;
  let isProcessing = false;

  const tryUpdate = () => {
    if (isProcessing) return;
    const chunkData = CHUNK_DETECTOR.lastKnownChunk;
    if (!chunkData) return;

    const chunkKey = `${chunkData.tileX},${chunkData.tileY},${chunkData.pixelX},${chunkData.pixelY}`;
    if (chunkKey === lastProcessedChunk) return;

    const existingElement = document.querySelector("#dot-chunk-info");
    if (existingElement) {
      const currentText = existingElement.textContent;
      const expectedText = `(Chunk: ${chunkData.tileX}, ${chunkData.tileY})`;
      if (currentText === expectedText) {
        lastProcessedChunk = chunkKey;
        return;
      }
    }

    isProcessing = true;
    lastProcessedChunk = chunkKey;
    updateChunkInPixelWindow();
    setTimeout(() => { isProcessing = false; }, 200);
  };

  setInterval(tryUpdate, 1000);

  const observer = new MutationObserver((mutations) => {
    const hasPixelWindow = document.querySelector('span.whitespace-nowrap');
    if (hasPixelWindow) {
      setTimeout(tryUpdate, 150);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function updateCacheSize() {
  const uniqueChunks = overlayChunkMap.size;
  maxCacheSize = Math.max(PERFORMANCE_CONFIG.MAX_CACHE_SIZE, Math.ceil(uniqueChunks * 1.5));
  console.log(`📊 Cache adjusted: ${maxCacheSize} slots for ${uniqueChunks} chunks with overlays`);
}

function getDecompactedImageData(overlay) {
  if (!overlay._isCompacted) {
    return overlay.imageData;
  }

  const cacheKey = `${overlay.url}_${overlay.chunk[0]}_${overlay.chunk[1]}`;

  const cached = decompactCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const decompacted = decompactImageData(overlay.imageData);
  decompactCache.set(cacheKey, decompacted);

  return decompacted;
}

function buildOverlayChunkMap() {
  overlayChunkMap.clear();
  overlays.forEach(overlay => {
    const chunkKey = `${overlay.chunk[0]},${overlay.chunk[1]}`;
    if (!overlayChunkMap.has(chunkKey)) {
      overlayChunkMap.set(chunkKey, []);
    }
    overlayChunkMap.get(chunkKey).push(overlay);
  });
  console.log(`📍 Map built: ${overlayChunkMap.size} unique chunks with overlays`);
}

function preloadAdjacentOverlayChunks(centerChunkX, centerChunkY) {
  if (!PERFORMANCE_CONFIG.ENABLE_PROGRESSIVE_LOADING) return;

  setTimeout(() => {
    const radius = PERFORMANCE_CONFIG.CHUNK_PRIORITY_RADIUS;
    let preloadedCount = 0;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const targetX = centerChunkX + dx;
        const targetY = centerChunkY + dy;
        const chunkKey = `${targetX},${targetY}`;

        if (overlayChunkMap.has(chunkKey)) {
          const chunkOverlays = overlayChunkMap.get(chunkKey);
          chunkOverlays.forEach(overlay => {
            const cacheKey = `${overlay.url}_${overlay.chunk[0]}_${overlay.chunk[1]}`;
            if (!decompactCache.has(cacheKey)) {
              getDecompactedImageData(overlay);
              preloadedCount++;
            }
          });
        }
      }
    }

    if (preloadedCount > 0) {
      console.log(`⚡ Preloaded ${preloadedCount} chunks near [${centerChunkX},${centerChunkY}]`);
    }
  }, 100);
}

function compactImageData(imageData) {
  const data = imageData.data;
  const nonZeroPixels = [];

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      const pixelIndex = i / 4;
      nonZeroPixels.push({
        pos: pixelIndex,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3]
      });
    }
  }

  return {
    width: imageData.width,
    height: imageData.height,
    pixels: nonZeroPixels,
    originalSize: data.length,
    compactSize: nonZeroPixels.length * 20
  };
}

function decompactImageData(compactData) {
  const imageData = new ImageData(compactData.width, compactData.height);
  const data = imageData.data;

  compactData.pixels.forEach(pixel => {
    const i = pixel.pos * 4;
    data[i] = pixel.r;
    data[i + 1] = pixel.g;
    data[i + 2] = pixel.b;
    data[i + 3] = pixel.a;
  });

  return imageData;
}

const canvasPool = {
  available: [],
  inUse: new Set(),

  get(width = CHUNK_WIDTH, height = CHUNK_HEIGHT) {
    let canvas = this.available.find(c => c.width === width && c.height === height);
    if (!canvas) {
      canvas = typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(width, height)
        : document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    } else {
      this.available.splice(this.available.indexOf(canvas), 1);
    }
    this.inUse.add(canvas);
    return canvas;
  },

  release(canvas) {
    if (this.inUse.has(canvas)) {
      this.inUse.delete(canvas);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.available.push(canvas);

      if (this.available.length > 12) {
        this.available.shift();
      }
    }
  }
};

function updateChunkInPixelWindow() {
  const chunkData = CHUNK_DETECTOR.lastKnownChunk;
  if (!chunkData) return;

  const tileX = chunkData.tileX;
  const tileY = chunkData.tileY;
  const pixelX = chunkData.pixelX;
  const pixelY = chunkData.pixelY;

  const displayX = parseInt(tileX) % 4 * 1000 + parseInt(pixelX);
  const displayY = parseInt(tileY) % 4 * 1000 + parseInt(pixelY);

  const oldElement = document.querySelector("#dot-chunk-info");
  if (oldElement) {
    oldElement.parentElement?.remove();
  }

  const oldButton = document.querySelector("#dot-upload-button");
  if (oldButton) {
    oldButton.parentElement?.remove();
  }

  const allSpans = document.querySelectorAll("span.whitespace-nowrap");

  for (let i = 0; i < allSpans.length; i++) {
    const parentSpan = allSpans[i];
    const text = parentSpan.textContent.trim();

    if (text.startsWith(`Pixel: ${displayX}, ${displayY}`)) {
      const hasChunkInside = parentSpan.querySelector('.chunk-info, #dot-chunk-info');
      if (hasChunkInside) {
        hasChunkInside.remove();
      }

      const container = document.createElement("div");
      container.id = "dot-chunk-container";
      container.style.cssText = "margin-left: calc(var(--spacing)*3); display: flex; align-items: center; gap: 8px;";

      const chunkSpan = document.createElement("span");
      chunkSpan.id = "dot-chunk-info";
      chunkSpan.textContent = `(Chunk: ${tileX}, ${tileY})`;
      chunkSpan.style = "font-size: small;";

      const uploadBtn = document.createElement("button");
      uploadBtn.id = "dot-upload-button";
      uploadBtn.textContent = "📤";
      uploadBtn.title = "Upload overlay at this position";
      uploadBtn.style.cssText = `
        padding: 2px 6px; font-size: 14px;
        background: linear-gradient(135deg, #64B5F6, #42A5F5);
        color: white; border: none; border-radius: 4px;
        cursor: pointer; transition: all 0.2s ease;
      `;

      uploadBtn.addEventListener('mouseenter', () => {
        uploadBtn.style.background = "linear-gradient(135deg, #42A5F5, #1E88E5)";
      });

      uploadBtn.addEventListener('mouseleave', () => {
        uploadBtn.style.background = "linear-gradient(135deg, #64B5F6, #42A5F5)";
      });

      uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openUploadModal(tileX, tileY, pixelX, pixelY);
      });

      container.appendChild(chunkSpan);
      container.appendChild(uploadBtn);

      try {
        const insertTarget = parentSpan.parentNode.parentNode.parentNode;
        insertTarget.insertAdjacentElement("afterend", container);
      } catch (error) {
        console.error("❌ Error inserting:", error);
      }

      return;
    }
  }
}

// ============================================
// OPTIMIZED FETCH INTERCEPTION (SEM COLOR COUNTING!)
// ============================================
const originalFetch = window.fetch;
window.fetch = new Proxy(originalFetch, {
  apply: async function(target, thisArg, argList) {
    const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];
    let url;

    try {
      url = new URL(urlString);
    } catch(e) {
      return target.apply(thisArg, argList);
    }

    if (url.pathname.includes('/pixel') && argList[1]?.method === 'POST') {
      const response = await target.apply(thisArg, argList);

      if (response.ok) {
        USER_DATA.totalPixelsPainted++;
        USER_DATA.nextLevelIn = Math.max(0, USER_DATA.nextLevelIn - 1);
        updateUserDisplay();

        setTimeout(async () => {
          await extractUserData();
          updateUserDisplay();
        }, 100);

        console.log('Pixel painted! Checking level-up...');
      }

      return response;
    }

    if (url.pathname.includes('/shop') || url.pathname.includes('/purchase')) {
      const response = await target.apply(thisArg, argList);

      if (response.ok) {
        setTimeout(async () => {
          await extractUserData();
          updateUserDisplay();
        }, 100);
      }

      return response;
    }

    if (url.pathname.includes('/pixel')) {
      const pathParts = url.pathname.split("?")[0].split("/").filter(t => t && !isNaN(Number(t)));
      const urlParams = new URLSearchParams(url.search);
      const pixelCoords = [urlParams.get("x"), urlParams.get("y")];

      if (pathParts.length >= 2 && pixelCoords[0] && pixelCoords[1]) {
        const tileX = parseInt(pathParts[0]);
        const tileY = parseInt(pathParts[1]);
        const pixelX = parseInt(pixelCoords[0]);
        const pixelY = parseInt(pixelCoords[1]);

        const interceptedData = {
          tileX: tileX,
          tileY: tileY,
          pixelX: pixelX,
          pixelY: pixelY,
          timestamp: Date.now()
        };

        console.log(`🔵 INTERCEPTED: Tile [${tileX}, ${tileY}] Pixel [${pixelX}, ${pixelY}]`);

        CHUNK_DETECTOR.lastKnownChunk = interceptedData;
        CHUNK_DETECTOR.currentChunkCoords = [tileX, tileY, pixelX, pixelY];

        CHUNK_DETECTOR.interceptHistory.unshift(interceptedData);
        if (CHUNK_DETECTOR.interceptHistory.length > CHUNK_DETECTOR.maxHistory) {
          CHUNK_DETECTOR.interceptHistory.length = CHUNK_DETECTOR.maxHistory;
        }

        if (CHUNK_DETECTOR.clickData &&
            Date.now() - CHUNK_DETECTOR.clickData.timestamp < 500) {
          CHUNK_DETECTOR.clickData.interceptedChunk = {
            tileX: tileX,
            tileY: tileY,
            pixelX: pixelX,
            pixelY: pixelY
          };
        }

        preloadAdjacentOverlayChunks(tileX, tileY);

        requestAnimationFrame(() => {
          updateChunkInPixelWindow();
          setTimeout(() => updateChunkInPixelWindow(), 100);
          setTimeout(() => updateChunkInPixelWindow(), 300);
        });
      }
    }

    if (overlayMode === "overlay" && url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
      const matches = overlays.filter(o => url.pathname.endsWith(o.chunksString));
      if (matches.length > 0) {
        try {
          const startTime = performance.now();

          const originalResponse = await target.apply(thisArg, argList);
          if (!originalResponse.ok) return originalResponse;

          const originalBlob = await originalResponse.blob();
          const originalImage = await blobToImage(originalBlob);
          const width = originalImage.width, height = originalImage.height;

          const canvas = canvasPool.get(width, height);
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          ctx.drawImage(originalImage, 0, 0, width, height);

          const originalData = ctx.getImageData(0, 0, width, height);

          const resultData = new ImageData(
            new Uint8ClampedArray(originalData.data),
            width,
            height
          );

          const pathParts = url.pathname.split("/");
          const chunkX = parseInt(pathParts[pathParts.length - 2]);
          const chunkY = parseInt(pathParts[pathParts.length - 1].split(".")[0]);

          const currentChunk = CHUNK_DETECTOR.lastKnownChunk;
          let priority = 0;
          if (currentChunk) {
            const distance = Math.abs(chunkX - currentChunk.tileX) + Math.abs(chunkY - currentChunk.tileY);
            priority = Math.max(0, 10 - distance);
          }

          for (const match of matches) {
            try {
              const decompactedData = getDecompactedImageData(match);

              const workerResult = await workerPool.processPixelDiff(
                originalData,
                decompactedData,
                width,
                height,
                priority
              );

              if (!workerResult.success) {
                console.error('Worker failed, skipping overlay:', match.name);
                continue;
              }

              const dr = resultData.data;
              const workerData = workerResult.resultData;

              for (let i = 0; i < workerData.length; i += 4) {
                if (workerData[i + 3] !== 0) {
                  dr[i] = workerData[i];
                  dr[i + 1] = workerData[i + 1];
                  dr[i + 2] = workerData[i + 2];
                  dr[i + 3] = workerData[i + 3];
                }
              }

              const chunkKey = `${match.chunk[0]},${match.chunk[1]}`;
              if (!perChunkStats[chunkKey]) perChunkStats[chunkKey] = {};

              perChunkStats[chunkKey][match.url] = {
                overlayUrl: match.url,
                wrongPixels: workerResult.wrongPixels,
                totalTarget: workerResult.totalTarget,
                timestamp: Date.now()
              };

              const processingTime = performance.now() - startTime;
              if (processingTime > 100) {
                console.log(`⚡ Processed ${match.name} in ${processingTime.toFixed(1)}ms (Pool)`);
              }

            } catch (workerError) {
              console.error('Error processing overlay with worker:', match.name, workerError);
              continue;
            }
          }

          ctx.putImageData(resultData, 0, 0);
          updateDisplay();

          let mergedBlob;
          if (typeof canvas.convertToBlob === 'function') {
            mergedBlob = await canvas.convertToBlob();
          } else {
            mergedBlob = await new Promise(resolve => canvas.toBlob(resolve));
          }

          canvasPool.release(canvas);

          const totalTime = performance.now() - startTime;
          if (totalTime > 150) {
            console.log(`✅ Chunk processed in ${totalTime.toFixed(1)}ms total`);
          }

          return new Response(mergedBlob, { headers: { "Content-Type": "image/png" } });

        } catch (error) {
          console.error('Error in general processing:', error);
          return target.apply(thisArg, argList);
        }
      }
    }
    else if (overlayMode === "chunks") {
      if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
        try {
          const parts = url.pathname.split("/");
          const [chunk1, chunk2] = [parts.at(-2), parts.at(-1).split(".")[0]];

          const canvas = canvasPool.get();
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          ctx.strokeRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
          ctx.font = '30px Arial';
          ctx.fillStyle = 'red';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${chunk1}, ${chunk2}`, CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2);

          let mergedBlob;
          if (typeof canvas.convertToBlob === 'function') {
            mergedBlob = await canvas.convertToBlob();
          } else {
            mergedBlob = await new Promise(resolve => canvas.toBlob(resolve));
          }

          canvasPool.release(canvas);
          return new Response(mergedBlob, { headers: { "Content-Type": "image/png" } });
        } catch (error) {
          console.error('Error in chunks mode:', error);
          return target.apply(thisArg, argList);
        }
      }
    }

    return target.apply(thisArg, argList);
  }
});

function getCorrectChunkData() {
  if (CHUNK_DETECTOR.clickData && CHUNK_DETECTOR.clickData.interceptedChunk) {
    const data = CHUNK_DETECTOR.clickData.interceptedChunk;
    return {
      chunkX: data.tileX,
      chunkY: data.tileY,
      pixelX: data.pixelX,
      pixelY: data.pixelY
    };
  }

  if (CHUNK_DETECTOR.lastKnownChunk &&
      Date.now() - CHUNK_DETECTOR.lastKnownChunk.timestamp < 1000) {
    const data = CHUNK_DETECTOR.lastKnownChunk;
    return {
      chunkX: data.tileX,
      chunkY: data.tileY,
      pixelX: data.pixelX,
      pixelY: data.pixelY
    };
  }

  const recentData = CHUNK_DETECTOR.interceptHistory.find(data =>
    Date.now() - data.timestamp < 2000
  );

  if (recentData) {
    return {
      chunkX: recentData.tileX,
      chunkY: recentData.tileY,
      pixelX: recentData.pixelX,
      pixelY: recentData.pixelY
    };
  }

  return null;
}

function calculateRegionChunks() {
  const chunkSet = new Set();
  baseOverlays.forEach(overlay => {
    chunkSet.add(`${overlay.chunk[0]},${overlay.chunk[1]}`);
  });

  REGION.chunks = Array.from(chunkSet).map(chunkStr => {
    const [x, y] = chunkStr.split(',').map(Number);
    return [x, y];
  });
}

function updateRegionChunksFromLoadedOverlays() {
  const chunkSet = new Set();
  overlays.forEach(overlay => {
    chunkSet.add(`${overlay.chunk[0]},${overlay.chunk[1]}`);
  });

  REGION.chunks = Array.from(chunkSet).map(chunkStr => {
    const [x, y] = chunkStr.split(',').map(Number);
    return [x, y];
  });
}

function getOverlayTotalPixels(overlayUrl) {
  if (overlayPixelCounts.has(overlayUrl)) {
    return overlayPixelCounts.get(overlayUrl);
  }

  let totalPixels = 0;
  overlays.filter(o => o.url === overlayUrl).forEach(overlay => {
    if (overlay._isCompacted) {
      totalPixels += overlay.imageData.pixels.length;
    } else {
      const data = overlay.imageData.data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) totalPixels++;
      }
    }
  });

  overlayPixelCounts.set(overlayUrl, totalPixels);
  return totalPixels;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const result = { img, width: img.naturalWidth, height: img.naturalHeight };
      loadedImages.set(img, result);
      resolve(result);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      reject(error);
    };
    img.src = URL.createObjectURL(blob);
  });
}

function findCoordinateElement() {
  const selectors = [
    'span.whitespace-nowrap',
    '[class*="pixel"]',
    '[class*="coord"]'
  ];

  for (const selector of selectors) {
    try {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent || element.innerText || '';
        if (text.includes('Pixel:') && /\d{4},\s*\d{4}/.test(text)) {
          return element;
        }
      }
    } catch(e) {}
  }

  const allSpans = document.querySelectorAll('span');
  for (const span of allSpans) {
    const text = span.textContent || span.innerText || '';
    if (text.includes('Pixel:') && /\d{4},\s*\d{4}/.test(text)) {
      return span;
    }
  }

  return null;
}

function convertDisplayToRealCoord(displayCoord) {
  const coordStr = displayCoord.toString();
  if (coordStr.length === 4) {
    return parseInt(coordStr.substring(1));
  }
  return displayCoord;
}

function extractCoordinatesFromClick() {
  const coordElement = findCoordinateElement();
  if (coordElement) {
    const text = coordElement.textContent || coordElement.innerText || '';
    const pixelPattern = /Pixel:\s*(\d{4}),\s*(\d{4})/;
    const match = text.match(pixelPattern);

    if (match) {
      const displayX = parseInt(match[1]);
      const displayY = parseInt(match[2]);
      const realX = convertDisplayToRealCoord(displayX);
      const realY = convertDisplayToRealCoord(displayY);
      const chunkData = getCorrectChunkData();

      if (chunkData) {
        return {
          x: realX,
          y: realY,
          displayX: displayX,
          displayY: displayY,
          chunkX: chunkData.chunkX,
          chunkY: chunkData.chunkY,
          fromInterception: true
        };
      } else {
        const chunkX = Math.floor(displayX / CHUNK_WIDTH);
        const chunkY = Math.floor(displayY / CHUNK_HEIGHT);
        return {
          x: realX,
          y: realY,
          displayX: displayX,
          displayY: displayY,
          chunkX: chunkX,
          chunkY: chunkY,
          fromInterception: false
        };
      }
    }
  }

  const chunkData = getCorrectChunkData();
  if (chunkData) {
    return {
      x: chunkData.pixelX,
      y: chunkData.pixelY,
      displayX: chunkData.pixelX,
      displayY: chunkData.pixelY,
      chunkX: chunkData.chunkX,
      chunkY: chunkData.chunkY,
      fromInterception: true
    };
  }

  return null;
}

function calculateOverlayBoundingBoxes() {
  overlayBoundingBoxes.length = 0;

  for (const overlay of overlays) {
    let hasVisiblePixels = false;

    if (overlay._isCompacted) {
      hasVisiblePixels = overlay.imageData.pixels.length > 0;
    } else {
      const data = overlay.imageData.data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
          hasVisiblePixels = true;
          break;
        }
      }
    }

    if (hasVisiblePixels) {
      overlayBoundingBoxes.push({
        url: overlay.url,
        name: overlay.name,
        chunkX: overlay.chunk[0],
        chunkY: overlay.chunk[1],
        overlay: overlay,
        hasVisiblePixels: true
      });
    }
  }
}

function detectClickedOverlay(worldX, worldY, clickChunkX, clickChunkY) {
  const overlaysInChunk = overlayBoundingBoxes.filter(bbox =>
    bbox.chunkX === clickChunkX && bbox.chunkY === clickChunkY
  );

  if (overlaysInChunk.length === 0) {
    return null;
  }

  for (const bbox of overlaysInChunk) {
    const relativeX = worldX % CHUNK_WIDTH;
    const relativeY = worldY % CHUNK_HEIGHT;
    const clampedX = Math.max(0, Math.min(CHUNK_WIDTH - 1, relativeX));
    const clampedY = Math.max(0, Math.min(CHUNK_HEIGHT - 1, relativeY));
    const pixelIndex = (clampedY * CHUNK_WIDTH + clampedX) * 4 + 3;

    let hasPixelAtPosition = false;

    if (bbox.overlay._isCompacted) {
      const linearIndex = clampedY * CHUNK_WIDTH + clampedX;
      hasPixelAtPosition = bbox.overlay.imageData.pixels.some(pixel => pixel.pos === linearIndex && pixel.a > 0);
    } else {
      hasPixelAtPosition = bbox.overlay.imageData &&
        pixelIndex >= 0 &&
        pixelIndex < bbox.overlay.imageData.data.length &&
        bbox.overlay.imageData.data[pixelIndex] > 0;
    }

    if (hasPixelAtPosition) {
      return bbox;
    }
  }

  return null;
}

function fallbackToRegion() {
  if (currentSelection !== "region") {
    currentSelection = "region";
    updateDisplay();
    return true;
  }
  return false;
}

// ============================================
// 🆕 DELETE CUSTOM OVERLAY FUNCTION
// ============================================
async function deleteCustomOverlay(customId, overlayName) {
  if (!confirm(`Are you sure you want to delete "${overlayName}"?`)) {
    return;
  }

  try {
    console.log(`🗑️ Deleting custom overlay: ${overlayName} (${customId})`);

    await customOverlayDB.deleteImage(customId);

    const savedOverlays = loadFromStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, []);
    const filtered = savedOverlays.filter(o => o.id !== customId);
    saveToStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, filtered);

    const baseIndex = baseOverlays.findIndex(o => o.customId === customId);
    if (baseIndex > -1) {
      baseOverlays.splice(baseIndex, 1);
    }

    overlays = overlays.filter(o => o.customId !== customId);

    updateRegionChunksFromLoadedOverlays();
    calculateOverlayBoundingBoxes();
    buildOverlayChunkMap();
    updateCacheSize();

    updateMenuWithCustomOverlays();

    console.log(`✅ Custom overlay "${overlayName}" deleted successfully!`);

  } catch (error) {
    console.error(`❌ Error deleting overlay:`, error);
    alert(`Error deleting overlay: ${error.message}`);
  }
}

// ============================================
// OPTIMIZED: CUSTOM OVERLAY LOADING FROM STORAGE
// ============================================
async function loadCustomOverlaysFromStorage() {
  const savedOverlays = loadFromStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, []);

  if (savedOverlays.length === 0) {
    console.log('📦 No custom overlays saved');
    return;
  }

  console.log(`📦 Loading ${savedOverlays.length} custom overlay(s)...`);

  const BATCH_SIZE = 2;
  for (let i = 0; i < savedOverlays.length; i += BATCH_SIZE) {
    const batch = savedOverlays.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (savedOverlay) => {
      try {
        console.log(`⏳ Loading: ${savedOverlay.name}`);

        const imageData = await customOverlayDB.getImage(savedOverlay.id);

        if (!imageData || !imageData.blob) {
          console.warn(`⚠️ Image not found for ${savedOverlay.name}, removing from list`);
          const savedList = loadFromStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, []);
          const filtered = savedList.filter(o => o.id !== savedOverlay.id);
          saveToStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, filtered);
          return;
        }

        const blob = imageData.blob;
        const blobUrl = URL.createObjectURL(blob);

        const customOverlay = {
          url: blobUrl,
          chunk: savedOverlay.chunk,
          coords: savedOverlay.coords,
          name: savedOverlay.name,
          isCustom: true,
          customId: savedOverlay.id
        };

        baseOverlays.push(customOverlay);

        const { img, width, height } = await loadImage(blobUrl);

        const absoluteX = savedOverlay.chunk[0] * CHUNK_WIDTH + savedOverlay.coords[0];
        const absoluteY = savedOverlay.chunk[1] * CHUNK_HEIGHT + savedOverlay.coords[1];

        const startChunkX = Math.floor(absoluteX / CHUNK_WIDTH);
        const startChunkY = Math.floor(absoluteY / CHUNK_HEIGHT);
        const endChunkX = Math.floor((absoluteX + width - 1) / CHUNK_WIDTH);
        const endChunkY = Math.floor((absoluteY + height - 1) / CHUNK_HEIGHT);

        console.log(`📐 Image ${savedOverlay.name}: ${width}x${height}px, absolute position [${absoluteX}, ${absoluteY}]`);
        console.log(`📍 Covers chunks X:[${startChunkX} to ${endChunkX}], Y:[${startChunkY} to ${endChunkY}]`);

        for(let chunkY = startChunkY; chunkY <= endChunkY; chunkY++) {
          for(let chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {

            const chunkAbsoluteX = chunkX * CHUNK_WIDTH;
            const chunkAbsoluteY = chunkY * CHUNK_HEIGHT;

            const imageOffsetX = absoluteX - chunkAbsoluteX;
            const imageOffsetY = absoluteY - chunkAbsoluteY;

            const overlayCanvas = canvasPool.get();
            const overlayCtx = overlayCanvas.getContext("2d");

            overlayCtx.clearRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
            overlayCtx.drawImage(img, imageOffsetX, imageOffsetY, width, height);

            const imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
            const compactedData = compactImageData(imageData);

            overlays.push({
              url: blobUrl,
              name: savedOverlay.name,
              chunk: [chunkX, chunkY],
              coords: savedOverlay.coords,
              width, height,
              chunksString: `/${chunkX}/${chunkY}.png`,
              imageData: compactedData,
              _isCompacted: true,
              isCustom: true,
              customId: savedOverlay.id
            });

            canvasPool.release(overlayCanvas);
          }
        }

        console.log(`✅ Loaded: ${savedOverlay.name}`);

      } catch (error) {
        console.error(`❌ Error loading ${savedOverlay.name}:`, error);
        const savedList = loadFromStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, []);
        const filtered = savedList.filter(o => o.id !== savedOverlay.id);
        saveToStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, filtered);
      }
    }));

    if (i + BATCH_SIZE < savedOverlays.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}

// ============================================
// 🆕 initializeOverlays() - LOADS FROM GITHUB JSON!
// ============================================
async function initializeOverlays() {
  console.log('🚀 Starting overlay loading (JSON Config Mode)...');

  try {
    await customOverlayDB.init();
    console.log('✅ IndexedDB initialized');
  } catch (error) {
    console.warn('⚠️ IndexedDB not available:', error);
  }

  const config = await loadConfigFromGitHub();
  
  baseOverlays = config.overlays || [];
  REGIONS = config.regions || {};
  
  console.log(`📋 Loaded from JSON: ${baseOverlays.length} overlays, ${Object.keys(REGIONS).length} regions`);

  calculateRegionChunks();

  for (const base of baseOverlays) {
    if (base.isCustom) continue;

    try {
      console.log(`📥 Loading: ${base.name}`);
      const { img, width, height } = await loadImage(base.url);

      const x0 = base.coords[0], y0 = base.coords[1];
      const dxMin = Math.floor(x0 / CHUNK_WIDTH);
      const dxMax = Math.floor((x0 + width - 1) / CHUNK_WIDTH);
      const dyMin = Math.floor(y0 / CHUNK_HEIGHT);
      const dyMax = Math.floor((y0 + height - 1) / CHUNK_HEIGHT);

      for(let dy = dyMin; dy <= dyMax; dy++) {
        for(let dx = dxMin; dx <= dxMax; dx++) {
          const chunkX = base.chunk[0] + dx;
          const chunkY = base.chunk[1] + dy;
          const localX = x0 - dx * CHUNK_WIDTH;
          const localY = y0 - dy * CHUNK_HEIGHT;

          const overlayCanvas = canvasPool.get();
          const overlayCtx = overlayCanvas.getContext("2d");

          overlayCtx.clearRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
          overlayCtx.drawImage(img, localX, localY, width, height);
          const imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);

          const compactedData = compactImageData(imageData);

          overlays.push({
            url: base.url,
            name: base.name,
            chunk: [chunkX, chunkY],
            coords: base.coords,
            width, height,
            chunksString: `/${chunkX}/${chunkY}.png`,
            imageData: compactedData,
            _isCompacted: true
          });

          canvasPool.release(overlayCanvas);
        }
      }
      console.log(`✅ ${base.name} loaded`);
    } catch (e) {
      console.error(`❌ Error: ${base.url}`, e);
    }
  }

  await loadCustomOverlaysFromStorage();

  updateRegionChunksFromLoadedOverlays();
  calculateOverlayBoundingBoxes();
  buildOverlayChunkMap();
  updateCacheSize();
  baseOverlays.forEach(overlay => getOverlayTotalPixels(overlay.url));

  console.log(`📊 Total: ${overlays.length} overlays loaded`);
}

async function addCustomOverlay(file, name, chunkX, chunkY, pixelX, pixelY, progressDiv, progressFill) {
  console.log(`📤 Adding custom overlay: ${name} (Optimized Mode)`);
  console.log(`📍 Position: Chunk [${chunkX}, ${chunkY}], Pixel [${pixelX}, ${pixelY}]`);

  try {
    if (progressDiv) progressDiv.textContent = "🔧 Optimizing image...";
    if (progressFill) progressFill.style.width = "15%";
    const optimizedBlob = await optimizeImageFile(file);

    const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (progressDiv) progressDiv.textContent = "💾 Saving to storage...";
    if (progressFill) progressFill.style.width = "25%";
    await customOverlayDB.saveImage(customId, optimizedBlob);

    const blobUrl = URL.createObjectURL(optimizedBlob);

    const customOverlay = {
      url: blobUrl,
      chunk: [chunkX, chunkY],
      coords: [pixelX, pixelY],
      name: name,
      isCustom: true,
      customId: customId
    };

    baseOverlays.push(customOverlay);

    const savedOverlays = loadFromStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, []);
    savedOverlays.push({
      id: customId,
      name: name,
      chunk: [chunkX, chunkY],
      coords: [pixelX, pixelY],
      timestamp: Date.now()
    });
    saveToStorage(STORAGE_KEYS.CUSTOM_OVERLAYS, savedOverlays);

    if (progressDiv) progressDiv.textContent = "🎨 Processing overlay...";
    if (progressFill) progressFill.style.width = "35%";
    await new Promise(resolve => setTimeout(resolve, 50));

    const { img, width, height } = await loadImage(blobUrl);

    const absoluteX = chunkX * CHUNK_WIDTH + pixelX;
    const absoluteY = chunkY * CHUNK_HEIGHT + pixelY;

    const startChunkX = Math.floor(absoluteX / CHUNK_WIDTH);
    const startChunkY = Math.floor(absoluteY / CHUNK_HEIGHT);
    const endChunkX = Math.floor((absoluteX + width - 1) / CHUNK_WIDTH);
    const endChunkY = Math.floor((absoluteY + height - 1) / CHUNK_HEIGHT);

    const totalChunks = (endChunkX - startChunkX + 1) * (endChunkY - startChunkY + 1);
    let processedChunks = 0;

    console.log(`📐 Image: ${width}x${height}px at absolute position [${absoluteX}, ${absoluteY}]`);
    console.log(`📍 Will occupy ${totalChunks} chunk(s): X:[${startChunkX} to ${endChunkX}], Y:[${startChunkY} to ${endChunkY}]`);

    const CHUNK_BATCH_SIZE = 3;
    const allChunkCoords = [];

    for(let currentChunkY = startChunkY; currentChunkY <= endChunkY; currentChunkY++) {
      for(let currentChunkX = startChunkX; currentChunkX <= endChunkX; currentChunkX++) {
        allChunkCoords.push([currentChunkX, currentChunkY]);
      }
    }

    for (let i = 0; i < allChunkCoords.length; i += CHUNK_BATCH_SIZE) {
      const batch = allChunkCoords.slice(i, i + CHUNK_BATCH_SIZE);

      await Promise.all(batch.map(async ([currentChunkX, currentChunkY]) => {
        const chunkAbsoluteX = currentChunkX * CHUNK_WIDTH;
        const chunkAbsoluteY = currentChunkY * CHUNK_HEIGHT;

        const imageOffsetX = absoluteX - chunkAbsoluteX;
        const imageOffsetY = absoluteY - chunkAbsoluteY;

        const overlayCanvas = canvasPool.get();
        const overlayCtx = overlayCanvas.getContext("2d");

        overlayCtx.clearRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
        overlayCtx.drawImage(img, imageOffsetX, imageOffsetY, width, height);

        const imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
        const compactedData = compactImageData(imageData);

        overlays.push({
          url: blobUrl,
          name: name,
          chunk: [currentChunkX, currentChunkY],
          coords: [pixelX, pixelY],
          width, height,
          chunksString: `/${currentChunkX}/${currentChunkY}.png`,
          imageData: compactedData,
          _isCompacted: true,
          isCustom: true,
          customId: customId
        });

        canvasPool.release(overlayCanvas);

        processedChunks++;

        const progress = 35 + Math.floor((processedChunks / totalChunks) * 50);
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (progressDiv) {
          progressDiv.textContent = `🎨 Processing... ${processedChunks}/${totalChunks} chunks`;
        }

        console.log(`  ✓ Chunk [${currentChunkX}, ${currentChunkY}] processed (offset: ${imageOffsetX}, ${imageOffsetY})`);
      }));

      if (i + CHUNK_BATCH_SIZE < allChunkCoords.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    console.log(`✅ Custom overlay "${name}" added successfully with ${processedChunks} chunk(s)!`);

    if (progressDiv) progressDiv.textContent = "⚡ Finalizing...";
    if (progressFill) progressFill.style.width = "90%";

    updateRegionChunksFromLoadedOverlays();
    calculateOverlayBoundingBoxes();
    buildOverlayChunkMap();
    updateCacheSize();
    getOverlayTotalPixels(blobUrl);

  } catch (error) {
    console.error(`❌ Error processing overlay: ${error}`);
    throw error;
  }
}

function updateMenuWithCustomOverlays() {
  const menuList = document.getElementById("overlay-menu-list");
  if (!menuList) return;

  const existingPanel = document.getElementById("side-panel");
  if (existingPanel) {
    existingPanel.remove();
  }

  const existingExpand = document.getElementById("expand-button");
  if (existingExpand) {
    existingExpand.remove();
  }

  createUI();
  updateDisplay();
}

function updateDisplay() {
  let totalWrong = 0, totalPixels = 0;

  const isRegionView = currentSelection.startsWith('region:') || currentSelection === "region";

  if (isRegionView) {
    for (const chunk of REGION.chunks) {
      const chunkKey = `${chunk[0]},${chunk[1]}`;
      const chunkData = perChunkStats[chunkKey];
      if (chunkData) {
        for (const overlayStats of Object.values(chunkData)) {
          totalWrong += overlayStats.wrongPixels || 0;
          totalPixels += overlayStats.totalTarget || 0;
        }
      }
    }
  } else {
    for (const [chunkKey, chunkData] of Object.entries(perChunkStats)) {
      if (chunkData[currentSelection]) {
        const overlayStats = chunkData[currentSelection];
        totalWrong += overlayStats.wrongPixels || 0;
        totalPixels += overlayStats.totalTarget || 0;
      }
    }
  }

  if (totalPixels === 0) {
    const selectedOverlay = baseOverlays.find(o => o.url === currentSelection);
    if (selectedOverlay) {
      totalPixels = getOverlayTotalPixels(currentSelection);
    }
  }

  const percentage = totalPixels > 0 ? ((totalPixels - totalWrong) / totalPixels * 100) : 0;

  if (pixelCounter && percentageCounter) {
    pixelCounter.textContent = `Missing: ${totalWrong.toLocaleString()} / ${totalPixels.toLocaleString()}`;
    percentageCounter.textContent = `Complete: ${percentage.toFixed(2)}%`;
  }
}

function updateDownloadButton() {
  const downloadButton = document.getElementById("download-overlay-button");
  if (downloadButton) {
    const isRegion = currentSelection.startsWith('region:') || currentSelection === "region";
    downloadButton.style.display = isRegion ? "none" : "block";
  }
}

function downloadCurrentOverlay() {
  if (currentSelection.startsWith('region:') || currentSelection === "region") return;

  const selectedOverlay = baseOverlays.find(o => o.url === currentSelection);
  if (!selectedOverlay) return;

  if (selectedOverlay.url.includes('imgur.com') || selectedOverlay.url.includes('http')) {
    fetch(selectedOverlay.url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${selectedOverlay.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      })
      .catch(() => { window.open(selectedOverlay.url, '_blank'); });
  }
}

function updateUserDisplay() {
  const userInfoDiv = document.getElementById("user-info-display");
  if (userInfoDiv) {
    const pixelsRemaining = USER_DATA.nextLevelIn;
    userInfoDiv.innerHTML = `
      <div style="color: #4CAF50; font-weight: bold; margin-bottom: 4px;">👤 ${USER_DATA.username}</div>
      <div style="color: #2196F3; font-size: 10px;">💧 Droplets: ${USER_DATA.droplets.toLocaleString()}</div>
      <div style="color: #FF9800; font-size: 10px;">🎨 Pixels: ${USER_DATA.totalPixelsPainted.toLocaleString()}</div>
      <div style="color: #9C27B0; font-size: 10px;">📊 Level: ${USER_DATA.currentLevel}</div>
      <div style="color: #E91E63; font-size: 10px;">⬆️ Next level: ${pixelsRemaining.toLocaleString()} pixels</div>
    `;
  }
}

function openUploadModal(chunkX, chunkY, pixelX, pixelY) {
  const existingModal = document.querySelector("#dot-upload-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "dot-upload-modal";
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.8); display: flex; align-items: center;
    justify-content: center; z-index: 99999; backdrop-filter: blur(4px);
  `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1e1e1e, #2a2a2a); padding: 24px;
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    max-width: 450px; width: 90%; border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  modalContent.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #64B5F6; font-size: 18px;">📤 Upload Large Image (Optimized)</h3>
    <div style="background: rgba(100, 181, 246, 0.1); padding: 8px; border-radius: 6px; margin-bottom: 16px; font-size: 12px; color: #90CAF9;">
      <strong>Position:</strong> Chunk [${chunkX}, ${chunkY}] • Pixel [${pixelX}, ${pixelY}]
      <br><strong>Max size:</strong> 5000x5000 pixels (auto-optimized)
    </div>
    <input type="file" id="modal-file-input" accept="image/png,image/jpeg,image/jpg,image/webp" style="width: 100%; margin-bottom: 12px; padding: 8px; background: rgba(44, 44, 44, 0.9); color: white; border: 1px solid rgba(64, 64, 64, 0.8); border-radius: 6px; cursor: pointer;">
    <input type="text" id="modal-name-input" placeholder="Overlay name" style="width: 100%; margin-bottom: 16px; padding: 8px; background: rgba(44, 44, 44, 0.9); color: white; border: 1px solid rgba(64, 64, 64, 0.8); border-radius: 6px; font-size: 14px;">
    <div id="modal-progress" style="display: none; margin-bottom: 16px; color: #90CAF9; font-size: 12px; text-align: center;"></div>
    <div id="modal-progress-bar" style="display: none; width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 16px; overflow: hidden;">
      <div id="modal-progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #64B5F6, #42A5F5); transition: width 0.3s ease;"></div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button id="modal-cancel-btn" style="flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.1); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">Cancel</button>
      <button id="modal-upload-btn" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #64B5F6, #42A5F5); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">✨ Add</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  const fileInput = modal.querySelector("#modal-file-input");
  const nameInput = modal.querySelector("#modal-name-input");
  const cancelBtn = modal.querySelector("#modal-cancel-btn");
  const uploadBtn = modal.querySelector("#modal-upload-btn");
  const progressDiv = modal.querySelector("#modal-progress");
  const progressBar = modal.querySelector("#modal-progress-bar");
  const progressFill = modal.querySelector("#modal-progress-fill");

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  cancelBtn.addEventListener('click', () => {
    modal.remove();
  });

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    const name = nameInput.value.trim();

    if (!file) {
      alert("Please select an image!");
      return;
    }

    if (!name) {
      alert("Please enter a name for the overlay!");
      return;
    }

    uploadBtn.disabled = true;
    cancelBtn.disabled = true;
    progressDiv.style.display = "block";
    progressBar.style.display = "block";

    try {
      progressDiv.textContent = "⏳ Optimizing image...";
      progressFill.style.width = "10%";
      await new Promise(resolve => setTimeout(resolve, 100));

      await addCustomOverlay(file, name, chunkX, chunkY, pixelX, pixelY, progressDiv, progressFill);

      progressDiv.textContent = "✅ Added successfully!";
      progressFill.style.width = "100%";
      uploadBtn.textContent = "✅ Done!";

      updateMenuWithCustomOverlays();

      setTimeout(() => {
        modal.remove();
      }, 1500);

    } catch (error) {
      console.error("Error adding overlay:", error);
      progressDiv.textContent = `❌ Error: ${error.message}`;
      progressDiv.style.color = "#f44336";
      uploadBtn.textContent = "✨ Add";
      uploadBtn.disabled = false;
      cancelBtn.disabled = false;
      progressBar.style.display = "none";
    }
  });

  setTimeout(() => nameInput.focus(), 100);
}

// ============================================
// 🆕 createUI() - WITH REGION COLORS & DELETE BUTTON!
// ============================================
function createUI() {
  const existingCounter = document.getElementById("pixel-counter");
  if (existingCounter) existingCounter.remove();
  const existingPanel = document.getElementById("side-panel");
  if (existingPanel) existingPanel.remove();

  const counterContainer = document.createElement("div");
  counterContainer.id = "pixel-counter";
  Object.assign(counterContainer.style, {
    position: "fixed", top: "5px", left: "50%", transform: "translateX(-50%)",
    zIndex: "10000", padding: "6px 10px", fontSize: "12px",
    fontFamily: "Arial, sans-serif", backgroundColor: "rgba(0,0,0,0.66)",
    color: "white", borderRadius: "6px", pointerEvents: "none",
    backdropFilter: "blur(3px)", lineHeight: "1.25", textAlign: "center"
  });
  document.body.appendChild(counterContainer);

  pixelCounter = document.createElement("div");
  percentageCounter = document.createElement("div");
  counterContainer.appendChild(pixelCounter);
  counterContainer.appendChild(percentageCounter);

  const sidePanel = document.createElement("div");
  sidePanel.id = "side-panel";
  Object.assign(sidePanel.style, {
    position: "fixed", top: "170px", left: "10px",
    backgroundColor: "rgba(20, 20, 20, 0.1)", color: "white", fontSize: "11px",
    padding: "15px", borderRadius: "12px", zIndex: "10000", width: "200px",
    pointerEvents: "auto", backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "visible"
  });
  document.body.appendChild(sidePanel);

  const panelContent = document.createElement("div");
  panelContent.id = "panel-content";
  panelContent.style.cssText = "transition: opacity 0.3s ease, transform 0.3s ease;";

  const toggleButton = document.createElement("button");
  toggleButton.id = "panel-toggle";
  toggleButton.innerHTML = "◀";
  toggleButton.title = "Click to hide menu";
  Object.assign(toggleButton.style, {
    position: "absolute", top: "8px", right: "8px",
    width: "24px", height: "24px", backgroundColor: "rgba(76, 175, 80, 0.9)",
    color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
    fontSize: "12px", fontWeight: "bold", zIndex: "10002",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", transition: "all 0.3s ease",
    display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "auto"
  });

  const expandButton = document.createElement("button");
  expandButton.id = "expand-button";
  expandButton.innerHTML = "▶";
  expandButton.title = "Click to expand menu";
  Object.assign(expandButton.style, {
    position: "fixed", top: "178px", left: "5px",
    width: "24px", height: "24px", backgroundColor: "rgba(76, 175, 80, 0.9)",
    color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
    fontSize: "12px", fontWeight: "bold", zIndex: "10003",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.4)", transition: "all 0.3s ease",
    display: "none", alignItems: "center", justifyContent: "center", pointerEvents: "auto"
  });

  document.body.appendChild(expandButton);

  let panelExpanded = loadFromStorage(STORAGE_KEYS.PANEL_STATE, true);

  function togglePanel() {
    panelExpanded = !panelExpanded;
    saveToStorage(STORAGE_KEYS.PANEL_STATE, panelExpanded);

    if (panelExpanded) {
      sidePanel.style.display = "block";
      panelContent.style.display = "block";
      toggleButton.innerHTML = "◀";
      toggleButton.title = "Click to hide menu";
      toggleButton.style.display = "flex";
      expandButton.style.display = "none";

      setTimeout(() => {
        panelContent.style.opacity = "1";
        panelContent.style.transform = "translateX(0)";
      }, 100);

    } else {
      panelContent.style.opacity = "0";
      panelContent.style.transform = "translateX(-20px)";

      setTimeout(() => {
        sidePanel.style.display = "none";
        toggleButton.style.display = "none";
        expandButton.style.display = "flex";
      }, 200);
    }
  }

  if (!panelExpanded) {
    sidePanel.style.display = "none";
    toggleButton.style.display = "none";
    expandButton.style.display = "flex";
    panelContent.style.opacity = "0";
  }

  toggleButton.addEventListener('click', togglePanel);
  expandButton.addEventListener('click', togglePanel);

  sidePanel.appendChild(toggleButton);

  const menuContainer = document.createElement("div");
  menuContainer.id = "overlay-menu-container";
  menuContainer.style.cssText = `
    width: 100%; margin-bottom: 10px; background: rgba(44, 44, 44, 0.9);
    border: 2px solid rgba(64, 64, 64, 0.8); border-radius: 8px; overflow: hidden;
  `;

  const menuList = document.createElement("div");
  menuList.id = "overlay-menu-list";
  menuList.style.cssText = `max-height: 120px; overflow-y: auto; overflow-x: hidden;`;

  const scrollbarStyle = document.createElement('style');
  scrollbarStyle.textContent = `
    #overlay-menu-list::-webkit-scrollbar { width: 8px; }
    #overlay-menu-list::-webkit-scrollbar-track { background: rgba(30, 30, 30, 0.5); border-radius: 4px; }
    #overlay-menu-list::-webkit-scrollbar-thumb { background: rgba(76, 175, 80, 0.7); border-radius: 4px; }
    #overlay-menu-list::-webkit-scrollbar-thumb:hover { background: rgba(76, 175, 80, 0.9); }
  `;
  document.head.appendChild(scrollbarStyle);

  const regionEntries = Object.entries(REGIONS).sort((a, b) => {
    const progressA = a[1].progress || "completed";
    const progressB = b[1].progress || "completed";
    
    if (progressA === "in progress" && progressB !== "in progress") return -1;
    if (progressA !== "in progress" && progressB === "in progress") return 1;
    return 0;
  });

  regionEntries.forEach(([key, region]) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.dataset.value = `region:${key}`;
    item.textContent = region.name;
    
    const progress = region.progress || "completed";
    const textColor = progress === "in progress" ? "#ff5252" : "#4CAF50";
    const hoverBg = progress === "in progress" ? "rgba(255, 82, 82, 0.3)" : "rgba(76, 175, 80, 0.3)";
    const selectedBg = progress === "in progress" ? "rgba(255, 82, 82, 0.5)" : "rgba(76, 175, 80, 0.5)";
    
    item.style.cssText = `
      padding: 10px 12px; font-size: 12px; color: ${textColor}; cursor: pointer;
      transition: all 0.2s ease; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-weight: 500;
    `;

    item.addEventListener('mouseenter', () => { item.style.background = hoverBg; });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('selected')) item.style.background = "transparent";
    });

    item.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(i => {
        i.classList.remove('selected');
        if (!i.matches(':hover')) i.style.background = "transparent";
      });

      item.classList.add('selected');
      item.style.background = selectedBg;

      const value = item.dataset.value;
      if (value.startsWith('region:')) {
        const regionKey = value.replace('region:', '');
        navigateToRegion(regionKey);
        setTimeout(() => {
          document.querySelectorAll('.menu-item').forEach(i => {
            i.classList.remove('selected');
            if (!i.matches(':hover')) i.style.background = "transparent";
          });
        }, 500);
      } else {
        currentSelection = value;
        updateDisplay();
        updateDownloadButton();
      }
    });

    menuList.appendChild(item);
  });

  const separator = document.createElement("div");
  separator.style.cssText = `
    height: 2px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); margin: 4px 0;
  `;
  menuList.appendChild(separator);

  const sortedOverlays = [...baseOverlays].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );

  sortedOverlays.forEach((overlay, index) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.dataset.value = overlay.url;
    item.style.cssText = `
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 12px; font-size: 12px; color: #ffffff; cursor: pointer;
      transition: all 0.2s ease; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    `;

    const textSpan = document.createElement("span");
    let icon = "🎨";
    if (overlay.isCustom) icon = "🖼️";
    else if (overlay.name.toLowerCase().includes("luke")) icon = "👤";
    else if (overlay.name.toLowerCase().includes("gam")) icon = "🎮";
    else if (overlay.name.toLowerCase().includes("michael")) icon = "⭐";
    else if (index % 4 === 0) icon = "🎯";
    else if (index % 4 === 1) icon = "🚀";
    else if (index % 4 === 2) icon = "💎";
    else if (index % 4 === 3) icon = "🔥";

    textSpan.textContent = `${icon} ${overlay.name}`;
    textSpan.style.cssText = "flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

    item.appendChild(textSpan);

    if (overlay.isCustom && overlay.customId) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Delete this overlay";
      deleteBtn.style.cssText = `
        margin-left: 8px; padding: 2px 6px; font-size: 12px;
        background: rgba(244, 67, 54, 0.8); color: white;
        border: none; border-radius: 4px; cursor: pointer;
        transition: all 0.2s ease; flex-shrink: 0;
      `;

      deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.background = "rgba(244, 67, 54, 1)";
      });

      deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.background = "rgba(244, 67, 54, 0.8)";
      });

      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await deleteCustomOverlay(overlay.customId, overlay.name);
      });

      item.appendChild(deleteBtn);
    }

    item.addEventListener('mouseenter', () => { item.style.background = "rgba(255, 152, 0, 0.3)"; });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('selected')) item.style.background = "transparent";
    });

    item.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(i => {
        i.classList.remove('selected');
        if (!i.matches(':hover')) i.style.background = "transparent";
      });

      item.classList.add('selected');
      item.style.background = "rgba(255, 152, 0, 0.5)";

      currentSelection = item.dataset.value;
      updateDisplay();
      updateDownloadButton();
    });

    menuList.appendChild(item);
  });

  menuContainer.appendChild(menuList);
  panelContent.appendChild(menuContainer);

  const downloadButton = document.createElement("button");
  downloadButton.id = "download-overlay-button";
  downloadButton.textContent = "📥 Download";
  Object.assign(downloadButton.style, {
    width: "100%", marginBottom: "12px", padding: "10px", fontSize: "12px",
    background: "linear-gradient(135deg, #4CAF50, #45a049)", color: "white",
    border: "none", borderRadius: "8px", cursor: "pointer", display: "none",
    fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
  });

  downloadButton.addEventListener('click', () => { downloadCurrentOverlay(); });
  panelContent.appendChild(downloadButton);

  const userInfoSection = document.createElement("div");
  userInfoSection.id = "user-info-display";
  userInfoSection.style.cssText = `
    font-size: 10px; color: #aaa; margin-top: 12px; text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 8px;
    line-height: 1.4; background: rgba(255, 255, 255, 0.02); border-radius: 6px; padding: 8px;
  `;
  userInfoSection.innerHTML = `
    <div style="color: #4CAF50; font-weight: bold;">⚡ DOT v16.7.1</div>
    <div style="color: #888; font-size: 9px; margin-top: 2px;">Chunks Disabled</div>
  `;
  panelContent.appendChild(userInfoSection);

  sidePanel.appendChild(panelContent);
}

function createModeToggleButton() {
  const existingButton = document.getElementById("mode-toggle-button");
  if (existingButton) existingButton.remove();

  const button = document.createElement("button");
  button.id = "mode-toggle-button";

  overlayMode = loadFromStorage(STORAGE_KEYS.OVERLAY_MODE, "original");
  
  if (overlayMode === "chunks") {
    overlayMode = "original";
    saveToStorage(STORAGE_KEYS.OVERLAY_MODE, overlayMode);
  }

  button.textContent = overlayMode === "overlay" ? "🎨 Overlay" : "🖼️ Original";
  button.title = "Click to toggle modes (or press O twice)";

  Object.assign(button.style, {
    position: "fixed", top: "110px", right: "8px", zIndex: "10000",
    padding: "10px 16px", fontSize: "14px", fontWeight: "600",
    background: overlayMode === "overlay" ? 
                "linear-gradient(135deg, #4CAF50, #45a049)" :
                "linear-gradient(135deg, #2196F3, #1976D2)",
    color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif", backdropFilter: "blur(10px)"
  });

  button.addEventListener('mouseenter', () => {
    button.style.transform = "scale(1.05)";
    button.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.4)";
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  });

  button.addEventListener('click', () => { cycleModeWithButton(); });

  document.body.appendChild(button);
  adjustButtonPosition();
}

function adjustButtonPosition() {
  const nativeButtonsContainer = document.querySelector('div.absolute.top-2.right-2.z-30');
  const modeButton = document.getElementById("mode-toggle-button");

  if (nativeButtonsContainer && modeButton) {
    const rect = nativeButtonsContainer.getBoundingClientRect();
    const bottomPosition = rect.bottom + 8;
    modeButton.style.top = `${bottomPosition}px`;
  }
}

function updateModeButtonText() {
  const button = document.getElementById("mode-toggle-button");
  if (!button) return;

  const modeConfig = {
    overlay: { 
      text: "🎨 Overlay", 
      background: "linear-gradient(135deg, #4CAF50, #45a049)", 
      description: "Overlay Mode Active" 
    },
    original: { 
      text: "🖼️ Original", 
      background: "linear-gradient(135deg, #2196F3, #1976D2)", 
      description: "Original Mode Active" 
    }
  };

  const config = modeConfig[overlayMode] || modeConfig.original;
  button.textContent = config.text;
  button.style.background = config.background;
  button.title = `${config.description} - Click to toggle`;
}

function cycleModeWithButton() {
  const currentIndex = OVERLAY_MODES.indexOf(overlayMode);
  overlayMode = OVERLAY_MODES[(currentIndex + 1) % OVERLAY_MODES.length];

  saveToStorage(STORAGE_KEYS.OVERLAY_MODE, overlayMode);

  console.log(`🔄 Mode changed to: ${overlayMode}`);

  updateModeButtonText();

  document.getElementById("pixel-counter").style.display = "block";

  const panelExpanded = loadFromStorage(STORAGE_KEYS.PANEL_STATE, true);
  if (panelExpanded) {
    document.getElementById("side-panel").style.display = "block";
    document.getElementById("expand-button").style.display = "none";
  } else {
    document.getElementById("side-panel").style.display = "none";
    document.getElementById("expand-button").style.display = "flex";
  }

  if (overlayMode !== "original") {
    updateDisplay();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'o') {
    clickCount++;
    if (clickCount === 1) {
      setTimeout(() => { clickCount = 0; }, 300);
    } else if (clickCount === 2) {
      clickCount = 0;
      cycleModeWithButton();
    }
  }
});

document.addEventListener('click', (event) => {
  if (overlayMode !== "overlay") return;

  setTimeout(() => {
    const coords = extractCoordinatesFromClick();
    if (!coords) {
      console.warn('⚠️ Unable to extract coordinates from click');
      return;
    }

    const worldX = coords.displayX;
    const worldY = coords.displayY;
    const clickChunkX = coords.chunkX;
    const clickChunkY = coords.chunkY;

    console.log(`🖱️ Click detected at [${worldX}, ${worldY}] chunk [${clickChunkX}, ${clickChunkY}]`);

    const clickedOverlay = detectClickedOverlay(worldX, worldY, clickChunkX, clickChunkY);

    if (clickedOverlay) {
      console.log(`✅ Overlay detected: ${clickedOverlay.name}`);
      currentSelection = clickedOverlay.url;

      document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('selected');
        if (!item.matches(':hover')) {
          item.style.background = "transparent";
        }

        if (item.dataset.value === clickedOverlay.url) {
          item.classList.add('selected');
          item.style.background = "rgba(255, 152, 0, 0.5)";

          const menuList = document.getElementById("overlay-menu-list");
          if (menuList) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });

      updateDisplay();
      updateDownloadButton();
    } else {
      console.log('❌ No overlay found at this position');
      const didFallback = fallbackToRegion();
      if (didFallback) {
        console.log('↩️ Returning to region view');
      }
    }
  }, 50);
}, true);

async function initialize() {
  console.log('🚀 Starting Stellar Blade Wplace Tool v16.7.1...');
  console.log('⚡ Chunks mode DISABLED - Only Overlay/Original toggle available');
  console.log('🆕 Features: JSON Config from GitHub + Custom Overlay Delete + Region Status Colors');
  console.log(`⚙️ GitHub JSON URL: ${GITHUB_CONFIG.JSON_URL}`);
  console.log(`⚙️ Configuration:
    - Worker Pool: ${PERFORMANCE_CONFIG.MAX_WORKER_POOL} workers
    - Max Cache: ${PERFORMANCE_CONFIG.MAX_CACHE_SIZE} slots
    - Concurrent Processing: ${PERFORMANCE_CONFIG.MAX_CONCURRENT_PROCESSING} chunks
    - Decompact Cache: ${PERFORMANCE_CONFIG.DECOMPACT_CACHE_SIZE} slots
  `);

  LEVEL_NOTIFICATION.init();

  await initializeOverlays();

  createUI();
  updateDisplay();

  injectChunkIntoPixelWindow();

  await extractUserData();
  updateUserDisplay();

  createModeToggleButton();

  const observer = new MutationObserver(() => {
    if (!document.getElementById("mode-toggle-button")) {
      createModeToggleButton();
    }
    adjustButtonPosition();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('resize', adjustButtonPosition);

  setInterval(async () => {
    if (Date.now() - USER_DATA.lastUpdate > 30000) {
      await extractUserData();
      updateUserDisplay();
    }
  }, 10000);

  console.log('✅ Stellar Blade Wplace Tool v16.7.1 initialized!');
  console.log('📌 Press "O" twice OR click button to toggle Overlay/Original modes');
  console.log('🗑️ Custom overlays can be deleted with trash button');
  console.log('🌐 Overlays & Regions loaded from GitHub JSON');
  console.log(`📊 Performance Stats:
    - LRU Cache: ${decompactCache.size}/${PERFORMANCE_CONFIG.DECOMPACT_CACHE_SIZE}
    - Worker Pool: ${workerPool.size} workers active
    - Canvas Pool: ${canvasPool.available.length} available
  `);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

})();
