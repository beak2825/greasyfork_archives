// ==UserScript==
// @name         Neopets QuickSave Pro
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Save, organize, and track your favorite Neopets pages with ease. Create custom categories, manage daily visits, and set smart NST→local reminders — all in one streamlined dashboard.
// @author       Thezuki10@clraik.com
// @match        *://*.neopets.com/*
// @license      Thezuki10
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554224/Neopets%20QuickSave%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554224/Neopets%20QuickSave%20Pro.meta.js
// ==/UserScript==

(function() {
'use strict';

// Prevent multiple loads and execution in frames
if (window.self !== window.top) {
  // We're in an iframe/frame, don't load
  return;
}

if (window.__neopetsQuickSaveLoaded) {
  // Already loaded, don't load again
  return;
}
window.__neopetsQuickSaveLoaded = true;

// Add error logging for OUR script only
window.addEventListener('error', function(e) {
  // Ignore errors from Neopets
  if (e.message && (e.message.includes('designMode') || e.message.includes('dataset'))) {
    return;
  }

  // Only alert if error is from our script
  if (e.filename && e.filename.includes('tampermonkey')) {
    console.error('QuickSave Script error:', e.error);
    alert('QuickSave Script error: ' + e.message);
  }
}, true);

try {
  // Test localStorage
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage is working');
} catch(e) {
  alert('localStorage is blocked or unavailable: ' + e.message);
}
  // ============================================================================
  // CONSTANTS MODULE
  // ============================================================================
  const Constants = {
    STORAGE_KEY: "neopetsQuickPagesV4.0",
    STATE_KEY: "neopetsQuickPagesPanelOpen",
    EXPANDED_KEY: "neopetsQuickPagesLastExpandedCatV4",
    PANEL_ID: 'neopetsQuickSavePanel_v4_3',
    STYLE_ID: 'neopetsQuickSaveStyle_v4_3',
    DAYS: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    MAX_REMINDERS_PER_LINK: 3
  };

  // ============================================================================
  // DATA STORAGE MODULE
  // Input: none (reads from localStorage)
  // Output: { [categoryName: string]: CategoryData }
  // ============================================================================
  const DataStorage = {
    /**
     * Get all data from storage
     * @returns {Object} - Map of category names to CategoryData objects
     */
    getData() {
      const raw = JSON.parse(localStorage.getItem(Constants.STORAGE_KEY) || "{}");
      return DataNormalizer.normalize(raw);
    },

    /**
     * Save data to storage
     * @param {Object} data - Map of category names to CategoryData objects
     * @returns {void}
     */
    setData(data) {
      localStorage.setItem(Constants.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Get panel open state
     * @returns {boolean}
     */
    getPanelState() {
      return localStorage.getItem(Constants.STATE_KEY) === "true";
    },

    /**
     * Set panel open state
     * @param {boolean} isOpen
     * @returns {void}
     */
    setPanelState(isOpen) {
      localStorage.setItem(Constants.STATE_KEY, String(isOpen));
    },

    /**
     * Get last expanded category
     * @returns {string|null}
     */
    getExpandedCategory() {
      return localStorage.getItem(Constants.EXPANDED_KEY);
    },

    /**
     * Set last expanded category
     * @param {string|null} categoryName
     * @returns {void}
     */
    setExpandedCategory(categoryName) {
      if (categoryName) {
        localStorage.setItem(Constants.EXPANDED_KEY, categoryName);
      } else {
        localStorage.removeItem(Constants.EXPANDED_KEY);
      }
    },

  };

  // ============================================================================
  // DATA NORMALIZER MODULE
  // Input: raw storage data
  // Output: normalized data structure
  // ============================================================================
  const DataNormalizer = {
    /**
     * Normalize raw storage data
     * @param {Object} raw - Raw data from storage
     * @returns {Object} - Normalized data structure
     */
normalize(raw) {
      const normalized = {};
      for (let cat in raw) {
        if (!raw[cat] || !Array.isArray(raw[cat].items)) continue;
        normalized[cat] = {
          bgColor: raw[cat].bgColor || 'lightgray',
          textColor: raw[cat].textColor || 'black',
          showSavedLinks: raw[cat].showSavedLinks !== false,
          showVisitedToday: raw[cat].showVisitedToday !== false,
          showLastVisit: raw[cat].showLastVisit !== false,
showTrackedURL: raw[cat].showTrackedURL !== false,
          items: raw[cat].items.map(item => this.normalizeItem(item))
        };
      }
      return normalized;
    },

    /**
     * Normalize a single item
     * @param {Object} item - Raw item data
     * @returns {Object} - Normalized item
     */
    normalizeItem(item) {
      return {
        url: item.url || '',
        name: item.name || '',
        track: !!item.track,
        lastSeen: item.lastSeen || '',
        note: typeof item.note === 'string' ? item.note : '',
        reminders: this.normalizeReminders(item)
      };
    },

    /**
     * Normalize reminders for an item
     * @param {Object} item - Item with potential reminder data
     * @returns {Array} - Array of normalized reminder objects
     */
    normalizeReminders(item) {
      if (!Array.isArray(item.reminders)) {
        return this.migrateOldReminders(item);
      }
      return item.reminders.slice(0, Constants.MAX_REMINDERS_PER_LINK).map(r => ({
        label: typeof r.label === 'string' ? r.label : (r.name || 'Reminder'),
        days: Array.isArray(r.days) ? r.days : (Array.isArray(r.reminderDays) ? r.reminderDays : []),
        time: typeof r.time === 'string' ? r.time : (typeof r.reminderTime === 'string' ? r.reminderTime : ''),
        repeat: typeof r.repeat === 'boolean' ? r.repeat : (typeof r.repeatReminder === 'boolean' ? r.repeatReminder : true)
      }));
    },

    /**
     * Migrate old reminder format to new format
     * @param {Object} item - Item with old reminder format
     * @returns {Array} - Array of reminder objects
     */
    migrateOldReminders(item) {
      if (Array.isArray(item.reminderDays) || typeof item.reminderTime === 'string') {
        const days = Array.isArray(item.reminderDays) ? item.reminderDays : [];
        const time = typeof item.reminderTime === 'string' ? item.reminderTime : '';
        const repeat = typeof item.repeatReminder === 'boolean' ? item.repeatReminder : true;
        if (time) {
          return [{
            label: 'Reminder',
            days: days,
            time: time,
            repeat: repeat
          }];
        }
      }
      return [];
    }
  };

  // ============================================================================
  // DATE/TIME UTILITIES MODULE
  // Input: various date/time strings and objects
  // Output: formatted strings, comparisons
  // ============================================================================
  const DateTimeUtils = {
    /**
     * Get today's date in Pacific timezone
     * @returns {string} - Date in YYYY-MM-DD format
     */
    getTodayPacific() {
      return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    },

    /**
     * Check if a date is today in Pacific timezone
     * @param {string} lastSeen - ISO date string
     * @returns {boolean}
     */
    isVisitedToday(lastSeen) {
      if (!lastSeen) return false;
      try {
        const pacificDate = new Date(lastSeen).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
        return pacificDate === this.getTodayPacific();
      } catch (e) {
        return false;
      }
    },

    /**
     * Get current time in Pacific timezone
     * @returns {Object} - { day: string, date: string, time: string }
     */
    getPacificNow() {
      const now = new Date();
      const pstNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      return {
        day: Constants.DAYS[pstNow.getDay()],
        date: pstNow.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }),
        time: pstNow.toTimeString().slice(0, 5)
      };
    },

    /**
     * Get local timezone abbreviation
     * @returns {string}
     */
    getLocalTimezoneAbbr() {
      try {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' });
        const parts = formatter.formatToParts(date);
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        return tzPart ? tzPart.value : '';
      } catch (e) {
        return '';
      }
    },

    /**
     * Convert 24-hour time to 12-hour format
     * @param {string} timeStr - Time in HH:MM format
     * @returns {string} - Time in 12-hour format with AM/PM
     */
    formatTime12Hour(timeStr) {
      if (!timeStr) return '';
      const [hhStr, mmStr] = timeStr.split(':');
      let hh = parseInt(hhStr || '0', 10);
      const mm = mmStr || '00';
      const ampm = hh >= 12 ? 'PM' : 'AM';
      let displayH = hh % 12;
      if (displayH === 0) displayH = 12;
      return `${displayH}:${mm} ${ampm}`;
    },

    /**
     * Convert PST time to local time with timezone
     * @param {string} timeStr - Time in HH:MM format (PST)
     * @returns {string} - Formatted local time with timezone
     */
    convertPSTToLocal(timeStr) {
      if (!timeStr) return '';
      try {
        const nowLocal = new Date();
        const localMinutesNow = nowLocal.getHours() * 60 + nowLocal.getMinutes();
        const pstFormatter = new Intl.DateTimeFormat('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles' });
        const pstFormatted = pstFormatter.format(new Date());
        const [pstHStr, pstMStr] = pstFormatted.split(':');
        const pstMinutesNow = parseInt(pstHStr, 10) * 60 + parseInt(pstMStr, 10);
        let diff = localMinutesNow - pstMinutesNow;
        if (diff > 720) diff -= 1440;
        if (diff < -720) diff += 1440;
        const [remHStr, remMStr] = timeStr.split(':');
        const remMinutes = (parseInt(remHStr || '0', 10) * 60) + parseInt(remMStr || '0', 10);
        let localMinutes = remMinutes + diff;
        localMinutes = ((localMinutes % 1440) + 1440) % 1440;
        const localH = Math.floor(localMinutes / 60);
        const localM = localMinutes % 60;
        const localDate = new Date(); localDate.setHours(localH, localM, 0, 0); const localTimeStr = localDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); const tzAbbr = this.getLocalTimezoneAbbr(); return tzAbbr ? `${localTimeStr} ${tzAbbr}` : localTimeStr;
      } catch (e) {
        return timeStr;
      }
    }
  };

  // ============================================================================
  // URL UTILITIES MODULE
  // Input: URLs as strings
  // Output: normalized URLs, comparisons
  // ============================================================================
  const URLUtils = {
    /**
     * Get base URL without query parameters
     * @param {string} url - Full URL
     * @returns {string} - Base URL
     */
    getBaseURL(url) {
      return (url || "").split('?')[0];
    },

    /**
     * Check if current page matches saved URL
     * @param {string} savedUrl - Saved URL
     * @param {string} currentUrl - Current page URL
     * @returns {boolean}
     */
    matchesCurrentPage(savedUrl, currentUrl) {
      const savedBase = this.getBaseURL(savedUrl);
      return savedBase && currentUrl.startsWith(savedBase);
    }
  };

  // ============================================================================
  // CATEGORY OPERATIONS MODULE
  // Input: data object, category name, category properties
  // Output: modified data object
  // ============================================================================
  const CategoryOps = {
    /**
     * Create or update a category
     * @param {Object} data - Full data object
     * @param {string} name - Category name
     * @param {Object} props - { bgColor, textColor }
     * @returns {Object} - Modified data object
     */

upsertCategory(data, name, props = {}) {
      if (!data[name]) {
        data[name] = {
          bgColor: props.bgColor || 'lightgray',
          textColor: props.textColor || 'black',
          showSavedLinks: props.showSavedLinks !== false,
          showVisitedToday: props.showVisitedToday !== false,
          showLastVisit: props.showLastVisit !== false,
showTrackedURL: props.showTrackedURL !== false,
          items: []
        };
      } else {
        if (props.bgColor) data[name].bgColor = props.bgColor;
        if (props.textColor) data[name].textColor = props.textColor;
        if (props.showSavedLinks !== undefined) data[name].showSavedLinks = props.showSavedLinks;
        if (props.showVisitedToday !== undefined) data[name].showVisitedToday = props.showVisitedToday;
        if (props.showLastVisit !== undefined) data[name].showLastVisit = props.showLastVisit;
if (props.showTrackedURL !== undefined) data[name].showTrackedURL = props.showTrackedURL;
      }
      return data;
    },

    /**
     * Rename a category
     * @param {Object} data - Full data object
     * @param {string} oldName - Old category name
     * @param {string} newName - New category name
     * @returns {Object} - Modified data object
     */
    renameCategory(data, oldName, newName) {
      if (oldName === newName || !data[oldName]) return data;
      data[newName] = data[oldName];
      delete data[oldName];
      return data;
    },

    /**
     * Delete a category
     * @param {Object} data - Full data object
     * @param {string} name - Category name
     * @returns {Object} - Modified data object
     */
    deleteCategory(data, name) {
      delete data[name];
      return data;
    },

    /**
     * Get statistics for a category
     * @param {Object} categoryData - Category data object
     * @returns {Object} - { total, visitedToday, pending, lastVisit }
     */
    getCategoryStats(categoryData) {
      let visitedToday = 0;
      let pending = 0;
      let tracked = 0;
      let lastVisit = null;

      categoryData.items.forEach(item => {
        if (item.lastSeen) {
          if (!lastVisit || new Date(item.lastSeen) > new Date(lastVisit)) {
            lastVisit = item.lastSeen;
          }
        }
        if (DateTimeUtils.isVisitedToday(item.lastSeen)) {
          visitedToday++;
        } else if (item.track) {
          pending++;
        }
        if (item.track) {
          tracked++;
        }
      });

      return {
        total: categoryData.items.length,
        visitedToday,
        pending,
        tracked,
        lastVisit
      };
    }
  };

  // ============================================================================
  // ITEM OPERATIONS MODULE
  // Input: data object, category name, item properties
  // Output: modified data object
  // ============================================================================
  const ItemOps = {
    /**
     * Add item to category
     * @param {Object} data - Full data object
     * @param {string} categoryName - Category name
     * @param {Object} item - Item object { url, name, track, note }
     * @returns {Object} - Modified data object
     */
    addItem(data, categoryName, item) {
      if (!data[categoryName]) {
        data = CategoryOps.upsertCategory(data, categoryName);
      }
      const exists = data[categoryName].items.some(it => it.url === item.url);
      if (!exists) {
        data[categoryName].items.push({
          url: item.url || '',
          name: item.name || '',
          track: !!item.track,
          lastSeen: new Date().toISOString(),
          note: item.note || '',
          reminders: []
        });
      }
      // Note: If exists is true, the item is silently not added (already handled in UI)
      return data;
    },

    /**
     * Update an item
     * @param {Object} data - Full data object
     * @param {string} categoryName - Category name
     * @param {string} oldUrl - Original URL (identifier)
     * @param {Object} updates - Updated properties
     * @returns {Object} - Modified data object
     */
    updateItem(data, categoryName, oldUrl, updates) {
      if (!data[categoryName]) return data;
      data[categoryName].items = data[categoryName].items.map(item => {
        if (item.url === oldUrl) {
          return { ...item, ...updates };
        }
        return item;
      });
      return data;
    },

    /**
     * Delete an item
     * @param {Object} data - Full data object
     * @param {string} categoryName - Category name
     * @param {string} url - Item URL
     * @returns {Object} - Modified data object
     */
    deleteItem(data, categoryName, url) {
      if (!data[categoryName]) return data;
      data[categoryName].items = data[categoryName].items.filter(item => item.url !== url);
      return data;
    },

    /**
     * Move item between categories
     * @param {Object} data - Full data object
     * @param {string} fromCategory - Source category
     * @param {string} toCategory - Target category
     * @param {string} url - Item URL
     * @returns {Object} - Modified data object
     */
    moveItem(data, fromCategory, toCategory, url) {
      if (fromCategory === toCategory || !data[fromCategory]) return data;
      const item = data[fromCategory].items.find(it => it.url === url);
      if (!item) return data;

      // Remove from source
      data[fromCategory].items = data[fromCategory].items.filter(it => it.url !== url);

      // Add to target
      if (!data[toCategory]) {
        data = CategoryOps.upsertCategory(data, toCategory);
      }
      const exists = data[toCategory].items.some(it => it.url === url);
      if (!exists) {
        data[toCategory].items.push(item);
      }

      return data;
    },

    /**
     * Reorder items within a category
     * @param {Object} data - Full data object
     * @param {string} categoryName - Category name
     * @param {number} fromIndex - Source index
     * @param {number} toIndex - Target index
     * @returns {Object} - Modified data object
     */
    reorderItems(data, categoryName, fromIndex, toIndex) {
      if (!data[categoryName]) return data;
      const items = data[categoryName].items;
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return data;
    },

    /**
     * Mark item as visited
     * @param {Object} data - Full data object
     * @param {string} url - Current page URL
     * @returns {Object} - Modified data object
     */
    markVisited(data, url) {
      const currentBase = URLUtils.getBaseURL(url);
      for (let cat in data) {
        data[cat].items = data[cat].items.map(item => {
          if (URLUtils.matchesCurrentPage(item.url, url)) {
            item.lastSeen = new Date().toISOString();
          }
          return item;
        });
      }
      return data;
    },

    /**
     * Count pending items across all categories
     * @param {Object} data - Full data object
     * @returns {number} - Count of pending tracked items
     */
    countPending(data) {
      let total = 0;
      for (let cat in data) {
        data[cat].items.forEach(item => {
          if (item.track && !DateTimeUtils.isVisitedToday(item.lastSeen)) {
            total++;
          }
        });
      }
      return total;
    },
/**
 * Sort items alphabetically and numerically within a category
 * @param {Object} data - Full data object
 * @param {string} categoryName - Category name
 * @returns {Object} - Modified data object
 */
sortItems(data, categoryName) {
  if (!data[categoryName]) return data;

  data[categoryName].items.sort((a, b) => {
    const nameA = (a.name || a.url).toLowerCase();
    const nameB = (b.name || b.url).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return data;
}
  };

  // ============================================================================
  // REMINDER OPERATIONS MODULE
  // Input: item object, reminder data
  // Output: modified item object, reminder checks
  // ============================================================================
  const ReminderOps = {
    /**
     * Add reminder to item
     * @param {Object} item - Item object
     * @param {Object} reminder - { label, days, time, repeat }
     * @returns {Object} - Modified item
     */
    addReminder(item, reminder) {
      if (!item.reminders) item.reminders = [];
      if (item.reminders.length < Constants.MAX_REMINDERS_PER_LINK) {
        item.reminders.push({
          label: reminder.label || 'Reminder',
          days: reminder.days || [],
          time: reminder.time || '',
          repeat: reminder.repeat !== false
        });
      }
      return item;
    },

    /**
     * Update reminder at index
     * @param {Object} item - Item object
     * @param {number} index - Reminder index
     * @param {Object} updates - Updated reminder properties
     * @returns {Object} - Modified item
     */
    updateReminder(item, index, updates) {
      if (!item.reminders || !item.reminders[index]) return item;
      item.reminders[index] = { ...item.reminders[index], ...updates };
      return item;
    },

    /**
     * Delete reminder at index
     * @param {Object} item - Item object
     * @param {number} index - Reminder index
     * @returns {Object} - Modified item
     */
    deleteReminder(item, index) {
      if (!item.reminders) return item;
      item.reminders.splice(index, 1);
      return item;
    },

    /**
     * Format reminder text for display
     * @param {Object} reminder - Reminder object
     * @returns {string|null} - Formatted text or null
     */
    formatReminderText(reminder) {
      if (!reminder || !reminder.time) return null;
      const timeNST12 = DateTimeUtils.formatTime12Hour(reminder.time);
      const local = DateTimeUtils.convertPSTToLocal(reminder.time);
      return `${timeNST12} NST - ${local}`;
    },

    /**
     * Check if reminder should fire
     * @param {Object} reminder - Reminder object
     * @param {Object} now - { day, date, time } from getPacificNow
     * @returns {boolean}
     */
    shouldFire(reminder, now) {
      if (!reminder.time || !Array.isArray(reminder.days)) return false;
      return reminder.days.includes(now.day) && reminder.time === now.time;
    },

    /**
     * Get unique key for reminder
     * @param {string} url - Item URL
     * @param {Object} reminder - Reminder object
     * @param {string} date - Date string
     * @returns {string}
     */
    getReminderKey(url, reminder, date) {
      return `${url}_${date}_${reminder.time}_${reminder.label}`;
    }
  };

  // ============================================================================
  // IMPORT/EXPORT MODULE
  // Input: data object or file
  // Output: JSON string or parsed data
  // ============================================================================
  const ImportExport = {
    /**
     * Export data as JSON file
     * @param {Object} data - Full data object
     * @returns {void} - Triggers download
     */
    exportToFile(data) {
      const clean = {};
      for (let cat in data) {
        clean[cat] = {
          bgColor: data[cat].bgColor,
          textColor: data[cat].textColor,
          items: data[cat].items.map(it => ({
            url: it.url,
            name: it.name,
            track: it.track,
            lastSeen: it.lastSeen,
            note: it.note || '',
            reminders: (it.reminders || []).map(r => ({
              label: r.label,
              days: r.days || [],
              time: r.time || '',
              repeat: !!r.repeat
            }))
          }))
        };
      }
      const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "neopets_pages_backup.json";
      a.click();
      URL.revokeObjectURL(a.href);
    },

    /**
     * Import data from file
     * @param {File} file - JSON file
     * @param {Function} onSuccess - Callback on success
     * @param {Function} onError - Callback on error
     * @returns {void}
     */
    importFromFile(file, onSuccess, onError) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (typeof parsed !== "object") {
            onError("Invalid file format");
            return;
          }
          onSuccess(parsed);
        } catch (err) {
          onError("Failed to parse file");
        }
      };
      reader.readAsText(file);
    }
  };

  // ============================================================================
  // AUTO VISIT TRACKER
  // Input: none (auto-runs)
  // Output: updates data storage
  // ============================================================================
  const AutoVisitTracker = {
    /**
     * Mark current page as visited if tracked
     * @returns {void}
     */
    track() {
      let data = DataStorage.getData();
      const currentUrl = window.location.href;
      let updated = false;

      for (let cat in data) {
        data[cat].items.forEach(item => {
          if (URLUtils.matchesCurrentPage(item.url, currentUrl)) {
            if (!DateTimeUtils.isVisitedToday(item.lastSeen)) {
              item.lastSeen = new Date().toISOString();
              updated = true;
            }
          }
        });
      }

      if (updated) {
        DataStorage.setData(data);
      }
    }
  };

  // ============================================================================
  // UI COMPONENTS MODULE
  // Input: various data and callbacks
  // Output: DOM elements
  // ============================================================================
  const UIComponents = {
    /**
     * Create modal dialog
     * @param {string} title - Modal title
     * @returns {HTMLElement} - Modal element
     */
createModal(title) {
  const modal = document.createElement("div");
modal.className = 'npq-modal';
  modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-image:url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);background-repeat:repeat;background-size:288px 446px;image-rendering:pixelated;border:1px solid #333;padding:24px;z-index:10000;min-width:500px;max-width:600px;font-family:"Cafeteria","Arial Bold",sans-serif;font-size:14px;border-radius:8px;box-shadow:4px 4px 12px rgba(0,0,0,0.4);';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title-' + Date.now());

      const header = document.createElement("h3");
      header.id = 'modal-title-' + Date.now();
      header.textContent = title;
      header.style.cssText = 'margin-top:0;font-size:16px;';
      modal.appendChild(header);

      return modal;
    },

    /**
     * Create button element
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {Object} style - Additional styles
     * @returns {HTMLElement}
     */

    createButton(text, onClick, style = {}) {
      const btn = document.createElement('button');
      btn.textContent = text;
      if (onClick) {
        btn.onclick = onClick;
        btn.ontouchend = (e) => {
          e.preventDefault();
          onClick(e);
        };
      }
      Object.assign(btn.style, style);
      return btn;
    },

    /**
     * Create input element
     * @param {string} type - Input type
     * @param {string} value - Initial value
     * @param {string} placeholder - Placeholder text
     * @returns {HTMLElement}
     */
    createInput(type, value = '', placeholder = '') {
      const input = document.createElement('input');
      input.type = type;
      input.value = value;
      input.placeholder = placeholder;
      return input;
    }
  };

  // ============================================================================
  // MAIN UI CONTROLLER
  // Coordinates all UI interactions and data updates
  // ============================================================================
  const UIController = {
    elements: {
      panel: null,
      saveBtn: null,
      seeBtn: null,
      listPanel: null,
      seeAlert: null,
      exportBtn: null,
      importBtn: null
    },

    /**
     * Initialize the UI
     * @returns {void}
     */
    init() {
      if (document.getElementById(Constants.PANEL_ID)) return;

      this.injectStyles();
      this.createPanel();
      this.attachEventHandlers();
      this.restoreState();
    },

    /**
     * Inject CSS styles
     * @returns {void}
     */
    injectStyles() {
      if (document.getElementById(Constants.STYLE_ID)) return;
      const style = document.createElement('style');
      style.id = Constants.STYLE_ID;
style.textContent = `
  .reminder-block { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; margin-top: 3px; font-size: 14px; font-family: "Cafeteria", "Arial Bold", sans-serif; }
  .reminder-line { margin-top: 2px; }
  .reminder-label { font-weight: bold; }
 .inline-reminders-wrapper { margin-top: 8px; border: none; padding: 8px; border-radius: 6px; background: transparent; }
  .tz-icon { display: inline-block; margin-left: 4px; font-size: 14px; color: #666; cursor: help; }
  .note-block { font-size: 14px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; margin-top: 6px; background: #fffdf7; white-space: pre-wrap; font-family: "Cafeteria", "Arial Bold", sans-serif; }

/* Neopets-style buttons - SCOPED TO THIS SCRIPT ONLY */
  #neopetsQuickSavePanel_v4_3 button,
  .npq-modal button {
    background: linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51));
    border: 0.8px solid white;
    border-radius: 15px;
    box-shadow: rgb(246,226,80) 0 0 0 1px inset,
                rgb(196,124,25) 0 -3px 2px 3px inset,
                rgb(253,249,220) 0 2px 0 1px inset,
                rgb(0,0,0) 0 0 0 2px;
    color: rgb(0,0,0);
    font-family: "Cafeteria", "Arial Bold", sans-serif;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    padding: 8px 16px;
    min-height: 32px;
    text-align: center;
  }

  #neopetsQuickSavePanel_v4_3 button:hover,
  .npq-modal button:hover {
    background: linear-gradient(to bottom, rgb(250, 230, 90), rgb(240, 185, 60));
  }

  #neopetsQuickSavePanel_v4_3 button:active,
  .npq-modal button:active {
    background: linear-gradient(to bottom, rgb(235, 178, 51), rgb(246, 226, 80));
  }

/* Small icon buttons */
.icon-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  min-height: unset;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
  cursor: pointer;
}

.icon-btn:hover {
  opacity: 0.8;
  background-color: transparent !important;
  background-image: inherit;
  transform: scale(1.1);
}

.icon-btn:active {
  background-color: transparent !important;
  transform: scale(0.95);
}

/* Mobile floating action button */
.npq-fab {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51));
  border: 2px solid rgb(0,0,0);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  z-index: 9998;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.npq-fab img {
  width: 32px;
  height: 32px;
}

.npq-fab:active {
  transform: scale(0.9);
}

/* Mobile modal overlay */
.npq-mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: none;
}

.npq-mobile-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 90vh;
  background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
  background-repeat: repeat;
  background-size: 288px 446px;
  image-rendering: pixelated;
  border-radius: 16px 16px 0 0;
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10000;
  box-sizing: border-box;
}

/* Mobile media queries */
@media (max-width: 768px) {
  .npq-fab {
    display: flex;
  }

  #neopetsQuickSavePanel_v4_3 {
    display: none !important;
  }

  .npq-modal {
    width: 90% !important;
    min-width: unset !important;
    max-width: unset !important;
    padding: 16px !important;
    font-size: 12px !important;
  }

.npq-mobile-panel {
    text-align: center !important;
  }

  .npq-mobile-panel > div {
    text-align: center !important;
  }

  .npq-mobile-panel button {
    margin-left: auto !important;
    margin-right: auto !important;
  }

  @media (max-width: 768px) {
    .icon-btn {
      display: inline-block !important;
      margin-left: 5px !important;
      margin-right: 5px !important;
    }

    .item-row {
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 4px !important;
    }

    .item-row > button:first-of-type {
      width: auto !important;
      max-width: none !important;
      flex: 1 !important;
      min-width: 120px !important;
      text-align: center !important;
      margin: 0 auto 8px auto !important;
      display: block !important;
    }

    .item-row > input[type="checkbox"],
    .item-row > .icon-btn {
      display: inline-block !important;
      margin: 0 5px !important;
      vertical-align: middle !important;
    }
  }

  .npq-modal h3 {
    font-size: 14px !important;
  }

#neopetsQuickSavePanel_v4_3 button,
  .npq-modal button,
  .npq-mobile-panel button {
    font-size: 12px !important;
    padding: 6px 10px !important;
    min-height: 28px !important;
    min-width: unset !important;
  }

  .reminder-block {
    font-size: 11px !important;
  }

  .note-block {
    font-size: 11px !important;
  }

input[type="text"],
  input[type="time"],
  input[type="color"],
  select,
  textarea {
    font-size: 14px !important;
  }

  .npq-mobile-panel .npq-mobile-panel > div {
    max-width: 100%;
    overflow: hidden;
  }

.npq-mobile-panel button {
    word-wrap: break-word;
    white-space: normal;
  }
}

`;
      document.head.appendChild(style);
    },

    /**
     * Create main panel
     * @returns {void}
     */
    createPanel() {
      const panel = document.createElement('div');
      panel.id = Constants.PANEL_ID;
      panel.style.cssText = 'position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:9999;background-image:url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);background-repeat:repeat;background-size:288px 446px;image-rendering:pixelated;border:1px solid #999;padding:10px;border-radius:8px 0 0 8px;font-size:12px;font-family:Arial,serif;box-shadow:2px 2px 5px rgba(0,0,0,0.3);text-align:center;';
     this.elements.saveBtn = UIComponents.createButton('SAVE', () => this.showSaveModal(), {
  margin: '5px',
  cursor: 'pointer',
  minWidth: '100px',
  minHeight: '37px',
  title: 'Save URLs'
});
this.elements.seeBtn = UIComponents.createButton('SEE', () => this.toggleList(), {
  margin: '5px',
  cursor: 'pointer',
  minWidth: '100px',
  minHeight: '37px',
  title: 'Display saved URLs and categories'
});
      // Create container for icon and count
const alertContainer = document.createElement('span');
alertContainer.style.cssText = 'display:inline-flex;align-items:center;margin-left:5px;';

// Warning icon
const warningIcon = document.createElement('img');
warningIcon.src = 'https://images.neopets.com/themes/004_bir_a2e60/events/warning.png';
warningIcon.style.cssText = 'width:16px;height:16px;margin-right:3px;display:none;';
warningIcon.alt = 'Warning';

// Count text (no circle background)
this.elements.seeAlert = document.createElement('span');
this.elements.seeAlert.style.cssText = 'color:red;font-size:12px;font-weight:bold;display:none;';

alertContainer.appendChild(warningIcon);
alertContainer.appendChild(this.elements.seeAlert);
this.elements.seeBtn.appendChild(alertContainer);

// Store reference to icon for show/hide
this.elements.warningIcon = warningIcon;

     this.elements.exportBtn = UIComponents.createButton('EXPORT', () => this.exportData(), { margin: '5px', cursor: 'pointer', minHeight: '32px', padding: '6px 14px', title: 'Export saved URLs and preferences' });
this.elements.importBtn = UIComponents.createButton('IMPORT', () => this.importData(), { margin: '10px', cursor: 'pointer', minHeight: '32px', padding: '6px 14px', title: 'Import saved URLs and preferences' });

      this.elements.listPanel = document.createElement('div');
this.elements.listPanel.style.cssText = 'display:none;max-height:500px;overflow-y:auto;margin-top:10px;background:transparent;border:none;padding:5px;text-align:left;';

      panel.appendChild(this.elements.saveBtn);
      panel.appendChild(this.elements.seeBtn);
      panel.appendChild(this.elements.listPanel);
    document.body.appendChild(panel);

      this.elements.panel = panel;

      // Create mobile floating action button
      const fab = document.createElement('button');
      fab.className = 'npq-fab';
      fab.setAttribute('aria-label', 'Open Quick Save');
      const fabImg = document.createElement('img');
      fabImg.src = 'https://images.neopets.com/themes/h5/basic/images/premiumportal-icon.png';
      fabImg.alt = 'Quick Save';
      fab.appendChild(fabImg);
      fab.onclick = () => this.openMobilePanel();
      document.body.appendChild(fab);
      this.elements.fab = fab;

      // Create mobile overlay and panel
      const overlay = document.createElement('div');
      overlay.className = 'npq-mobile-overlay';
      overlay.onclick = () => this.closeMobilePanel();
      document.body.appendChild(overlay);
      this.elements.mobileOverlay = overlay;

      const mobilePanel = document.createElement('div');
      mobilePanel.className = 'npq-mobile-panel';
      mobilePanel.setAttribute('role', 'dialog');
      mobilePanel.setAttribute('aria-modal', 'true');
      mobilePanel.setAttribute('aria-label', 'Quick Save Panel');
      overlay.appendChild(mobilePanel);
      this.elements.mobilePanel = mobilePanel;
    },

    /**
     * Attach event handlers
     * @returns {void}
     */
attachEventHandlers() {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && this.elements.listPanel && this.elements.listPanel.style.display === 'block') {
      this.renderList();
    }
  });

  // Touch event support for better mobile interaction
  document.addEventListener('touchstart', function(e) {
    // Passive listener for scroll performance
  }, { passive: true });
},

    /**
     * Open mobile panel
     * @returns {void}
     */
    openMobilePanel() {
      this.elements.mobileOverlay.style.display = 'block';
      this.elements.mobilePanel.setAttribute('aria-hidden', 'false');
      this.renderMobilePanel();
    },

    /**
     * Close mobile panel
     * @returns {void}
     */
    closeMobilePanel() {
      this.elements.mobileOverlay.style.display = 'none';
      this.elements.mobilePanel.setAttribute('aria-hidden', 'true');
    },

/**
     * Render mobile panel content
     * @returns {void}
     */
    renderMobilePanel() {
      const data = DataStorage.getData();
      this.elements.mobilePanel.innerHTML = '';

// Save button
      const saveBtn = UIComponents.createButton('SAVE', () => {
        this.closeMobilePanel();
        this.showSaveModal();
      }, {
        margin: '5px',
        cursor: 'pointer',
        minWidth: '120px',
        width: '45%',
        maxWidth: '180px',
        minHeight: '32px'
      });

      // See/Close button
      const seeBtn = UIComponents.createButton('CLOSE', () => {
        this.closeMobilePanel();
      }, {
        margin: '5px',
        cursor: 'pointer',
        minWidth: '120px',
        width: '45%',
        maxWidth: '180px',
        minHeight: '32px'
      });

      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'text-align:center;margin-bottom:10px;';
      btnRow.appendChild(saveBtn);
      btnRow.appendChild(seeBtn);
      this.elements.mobilePanel.appendChild(btnRow);

// Categories list
      if (Object.keys(data).length === 0) {
        const emptyContainer = document.createElement('div');
        emptyContainer.style.cssText = 'text-align:center;padding:20px;';

        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'No saved pages.';
        emptyMsg.style.cssText = 'font-style:italic;margin-bottom:15px;';
        emptyContainer.appendChild(emptyMsg);

        const importBtn = UIComponents.createButton('Import URLs', () => {
          this.closeMobilePanel();
          this.importData();
        }, {
          margin: '5px auto',
          cursor: 'pointer',
          minHeight: '32px',
          padding: '6px 14px',
          display: 'block',
          width: '90%',
          maxWidth: '250px'
        });
        emptyContainer.appendChild(importBtn);

        this.elements.mobilePanel.appendChild(emptyContainer);
      } else {
        const categoriesContainer = document.createElement('div');
        categoriesContainer.style.cssText = 'margin-bottom:16px;';

        for (let cat in data) {
          const categoryBox = this.renderCategory(cat, data[cat], DataStorage.getExpandedCategory());
          categoriesContainer.appendChild(categoryBox);
        }

        this.elements.mobilePanel.appendChild(categoriesContainer);
      }

// Export/Import buttons at bottom - only show if data exists
      if (Object.keys(data).length > 0) {
        const btnWrapper = document.createElement('div');
        btnWrapper.style.cssText = 'text-align:center;margin-top:10px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.1);';

        const exportBtn = UIComponents.createButton('EXPORT', () => {
          this.exportData();
        }, { margin: '5px', cursor: 'pointer', minHeight: '32px', padding: '6px 14px', minWidth: '120px', width: '45%', maxWidth: '180px' });

        const importBtn = UIComponents.createButton('IMPORT', () => {
          this.importData();
        }, { margin: '10px', cursor: 'pointer', minHeight: '32px', padding: '6px 14px', minWidth: '120px', width: '45%', maxWidth: '180px' });

        btnWrapper.appendChild(exportBtn);
        btnWrapper.appendChild(importBtn);
        this.elements.mobilePanel.appendChild(btnWrapper);
      }

      this.updateAlert();
    },

    /**
     * Restore saved state
     * @returns {void}
     */
    restoreState() {
      if (DataStorage.getPanelState()) {
        this.elements.listPanel.style.display = 'block';
        this.renderList();
      }
      this.updateAlert();
    },

    /**
     * Update alert badge
     * @returns {void}
     */
    updateAlert() {
  const data = DataStorage.getData();
  const pending = ItemOps.countPending(data);
  const hasAlerts = pending > 0;

  this.elements.seeAlert.style.display = hasAlerts ? 'inline-block' : 'none';
  if (this.elements.warningIcon) {
    this.elements.warningIcon.style.display = hasAlerts ? 'inline-block' : 'none';
  }

  if (hasAlerts) {
    this.elements.seeAlert.textContent = `${pending}`;
  }
},

    /**
     * Toggle list panel
     * @returns {void}
     */
    toggleList() {
      const isVisible = this.elements.listPanel.style.display === 'block';
      this.elements.listPanel.style.display = isVisible ? 'none' : 'block';
      DataStorage.setPanelState(!isVisible);
      if (!isVisible) this.renderList();
    },

    /**
     * Show save page modal
     * @returns {void}
     */
    showSaveModal() {
      const data = DataStorage.getData();
      const url = window.location.href;
      const modal = UIComponents.createModal("Save Page");

      const nameInput = UIComponents.createInput('text', document.title || url, 'Link name');
      nameInput.style.cssText = 'width:95%;margin-bottom:10px;';

      const urlInput = UIComponents.createInput('text', url, 'Link URL');
      urlInput.style.cssText = 'width:95%;margin-bottom:10px;';

      const manualLabel = document.createElement("div");
      manualLabel.textContent = "Add a Category:";
      const manualCatInput = UIComponents.createInput('text', '', 'New category');
      manualCatInput.style.cssText = 'width:95%;margin-bottom:10px;';

      const catLabel = document.createElement("div");
      catLabel.textContent = "Or choose an existing category:";
      const categorySelect = document.createElement("select");
      categorySelect.style.cssText = 'width:95%;margin-bottom:10px;';

      const blankOpt = document.createElement("option");
      blankOpt.value = "";
      blankOpt.textContent = "-- Select Category --";
      categorySelect.appendChild(blankOpt);

      for (let cat in data) {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      }

      const saveBtn = UIComponents.createButton('Save Page', () => {
        const name = nameInput.value.trim();
        const linkUrl = urlInput.value.trim();
        let category = manualCatInput.value.trim() || categorySelect.value;

        if (!category) {
          alert("Category required");
          return;
        }

        let currentData = DataStorage.getData();

        // Check if URL already exists in ANY category
        const existingCategories = [];
        for (let cat in currentData) {
          if (currentData[cat].items && currentData[cat].items.some(item => item.url === linkUrl)) {
            existingCategories.push(cat);
          }
        }

        if (existingCategories.length > 0) {
          if (existingCategories.includes(category)) {
            alert("You have already saved this URL in this category.");
            return;
          } else {
            // Show confirmation dialog for saving in different category
            this.showDuplicateConfirmation(existingCategories, category, linkUrl, name, modal);
            return;
          }
        }

        currentData = ItemOps.addItem(currentData, category, { url: linkUrl, name: name });
        DataStorage.setData(currentData);
        this.updateAlert();
        alert("Saved in: " + category);
        document.body.removeChild(modal);
      }, { marginRight: '10px' });

      const cancelBtn = UIComponents.createButton('Cancel', () => {
        document.body.removeChild(modal);
      });

      modal.appendChild(document.createTextNode("Name:"));
      modal.appendChild(document.createElement("br"));
      modal.appendChild(nameInput);
      modal.appendChild(document.createElement("br"));
      modal.appendChild(document.createTextNode("URL:"));
      modal.appendChild(document.createElement("br"));
      modal.appendChild(urlInput);
      modal.appendChild(document.createElement("br"));
      modal.appendChild(manualLabel);
      modal.appendChild(manualCatInput);
      modal.appendChild(catLabel);
      modal.appendChild(categorySelect);
      modal.appendChild(document.createElement("br"));
      modal.appendChild(saveBtn);
      modal.appendChild(cancelBtn);
      document.body.appendChild(modal);
    },

    /**
     * Export data to file
     * @returns {void}
     */
    exportData() {
      const data = DataStorage.getData();
      ImportExport.exportToFile(data);
    },

/**
     * Show confirmation dialog for duplicate URL in different category
     * @param {Array} existingCategories - Categories that already contain the URL
     * @param {string} targetCategory - Target category to save in
     * @param {string} linkUrl - URL to save
     * @param {string} name - Link name
     * @param {HTMLElement} originalModal - Original save modal to remove
     * @returns {void}
     */
    showDuplicateConfirmation(existingCategories, targetCategory, linkUrl, name, originalModal) {
      const confirmModal = UIComponents.createModal("Duplicate URL");

      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = 'margin-bottom:12px;font-size:14px;line-height:1.6;';
      messageDiv.innerHTML = `<strong>This URL is already saved in:</strong><br>${existingCategories.join(', ')}<br><br>Do you want to save it again in "<strong>${targetCategory}</strong>"?`;

      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'margin-top:16px;text-align:center;';

      const continueBtn = UIComponents.createButton('Save Anyway', () => {
        let currentData = DataStorage.getData();
        currentData = ItemOps.addItem(currentData, targetCategory, { url: linkUrl, name: name });
        DataStorage.setData(currentData);
        this.updateAlert();
        alert("Saved in: " + targetCategory);
        document.body.removeChild(originalModal);
        document.body.removeChild(confirmModal);
        this.renderList();
      }, { marginRight: '10px' });

      const cancelBtn = UIComponents.createButton('Cancel', () => {
        document.body.removeChild(confirmModal);
      });

      btnRow.appendChild(continueBtn);
      btnRow.appendChild(cancelBtn);

      confirmModal.appendChild(messageDiv);
      confirmModal.appendChild(btnRow);
      document.body.appendChild(confirmModal);
    },

    /**
     * Export data to file
     * @returns {void}
     */
    exportData() {
      const data = DataStorage.getData();
      ImportExport.exportToFile(data);
    },

    /**
     * Import data from file
     * @returns {void}
     */
    importData() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = () => {
        if (input.files.length > 0) {
          ImportExport.importFromFile(
            input.files[0],
            (parsedData) => {
              DataStorage.setData(parsedData);
              alert("Data imported successfully.");
              this.renderList();
            },
            (error) => {
              alert(error);
            }
          );
        }
      };
      input.click();
    },

    /**
     * Render the list of categories and items
     * @returns {void}
     */
    renderList() {
      const data = DataStorage.getData();
      const lastExpanded = DataStorage.getExpandedCategory();
      this.elements.listPanel.innerHTML = "";

      // Update mobile panel if it's open
      if (this.elements.mobileOverlay && this.elements.mobileOverlay.style.display === 'block') {
        this.renderMobilePanel();
      }

if (Object.keys(data).length === 0) {
        const emptyContainer = document.createElement('div');
        emptyContainer.style.cssText = 'text-align:center;padding:4px;';

        const emptyText = document.createElement('i');
        emptyText.textContent = 'No saved pages.';
        emptyText.style.cssText = 'display:block;margin-bottom:4px;';
        emptyContainer.appendChild(emptyText);

        const importBtn = UIComponents.createButton('Import URLs', () => {
          this.importData();
        }, {
          margin: '5px auto',
          cursor: 'pointer',
          minHeight: '32px',
          padding: '6px 14px',
          display: 'block',
          width: '90%'
        });
        emptyContainer.appendChild(importBtn);

        this.elements.listPanel.appendChild(emptyContainer);
        return;
      }

for (let cat in data) {
        const categoryBox = this.renderCategory(cat, data[cat], lastExpanded);
        this.elements.listPanel.appendChild(categoryBox);
      }

      // Add export/import buttons at bottom

      const btnWrapper = document.createElement("div");
btnWrapper.style.cssText = 'text-align:center;margin-top:10px;padding-top:8px;border-top:none;';
      btnWrapper.appendChild(this.elements.exportBtn);
      btnWrapper.appendChild(this.elements.importBtn);
      this.elements.listPanel.appendChild(btnWrapper);

      this.updateAlert();
    },

    /**
     * Darken a color by a percentage
     * @param {string} color - Color in rgb() or hex format
     * @param {number} percent - Percentage to darken (0-100)
     * @returns {string} - Darkened color in rgb() format
     */
    darkenColor(color, percent) {
      // Parse RGB color
      let r, g, b;

      if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          r = parseInt(matches[0]);
          g = parseInt(matches[1]);
          b = parseInt(matches[2]);
        }
      } else if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      } else {
        return color; // Return original if can't parse
      }

      // Darken
      r = Math.max(0, Math.floor(r * (1 - percent / 100)));
      g = Math.max(0, Math.floor(g * (1 - percent / 100)));
      b = Math.max(0, Math.floor(b * (1 - percent / 100)));

      return `rgb(${r},${g},${b})`;
    },

    /**
     * Render a single category
     * @param {string} catName - Category name
     * @param {Object} categoryData - Category data
     * @param {string|null} lastExpanded - Last expanded category name
     * @returns {HTMLElement}
     */
    renderCategory(catName, categoryData, lastExpanded) {
      const stats = CategoryOps.getCategoryStats(categoryData);

      const box = document.createElement("div");
box.style.cssText = `
  background: linear-gradient(to bottom, ${categoryData.bgColor || 'rgb(246, 226, 80)'}, ${this.darkenColor(categoryData.bgColor || 'rgb(246, 226, 80)', 20)});
  color: ${categoryData.textColor || 'rgb(54,54,54)'};
  padding: 10px 10px 6px 10px;
  margin-bottom: 10px;
  border: 0.8px solid white;
  border-radius: 15px;
  box-shadow: ${categoryData.bgColor || 'rgb(246,226,80)'} 0 0 0 1px inset,
              ${this.darkenColor(categoryData.bgColor || 'rgb(196,124,25)', 30)} 0 -3px 2px 3px inset,
              rgb(253,249,220) 0 2px 0 1px inset,
              rgb(0,0,0) 0 0 0 2px;
`;

      const catTitle = document.createElement("div");
catTitle.style.cssText = 'font-weight:bold;cursor:pointer;margin-bottom:8px;font-family:"Cafeteria","Arial Bold",sans-serif;font-size:18px;';
catTitle.setAttribute('role', 'button');
catTitle.setAttribute('aria-expanded', lastExpanded === catName ? 'true' : 'false');
catTitle.setAttribute('aria-controls', 'category-content-' + catName.replace(/\s+/g, '-'));

catTitle.setAttribute('tabindex', '0');

// Category name
const catNameSpan = document.createElement('span');
catNameSpan.textContent = catName;
catNameSpan.style.cssText = 'display:block;font-size:18px;margin-bottom:8px;word-wrap:break-word;';

catTitle.appendChild(catNameSpan);

// Stats display - vertical layout
const statsDiv = document.createElement('div');
statsDiv.style.cssText = `font-size:14px;color:${categoryData.textColor || 'black'};margin-left:10px;margin-bottom:4px;line-height:1.4;`;

let statsHTML = '';
if (categoryData.showSavedLinks !== false) {
  statsHTML += `Saved Links: ${stats.total}<br>`;
}
if (categoryData.showVisitedToday !== false) {
  statsHTML += `Visited Today: ${stats.visitedToday}<br>`;
}
if (categoryData.showTrackedURL !== false) {
  statsHTML += `Tracked URLs: ${stats.tracked}<br>`;
}

// Count reminders for today
const now = DateTimeUtils.getPacificNow();
let remindersToday = 0;
categoryData.items.forEach(item => {
  if (Array.isArray(item.reminders)) {
    item.reminders.forEach(r => {
      if (ReminderOps.shouldFire(r, now) || (Array.isArray(r.days) && r.days.includes(now.day) && r.time)) {
        remindersToday++;
      }
    });
  }
});

if (remindersToday > 0) {
  statsHTML += `Reminders Today: ${remindersToday}<br>`;
}

statsDiv.innerHTML = statsHTML;
catTitle.appendChild(statsDiv);

if (stats.lastVisit && categoryData.showLastVisit !== false) {
  const lastSeenText = document.createElement("div");
  lastSeenText.style.cssText = `font-size:14px;margin-left:10px;margin-top:2px;margin-bottom:4px;color:${categoryData.textColor || 'black'};font-family:"Cafeteria","Arial Bold",sans-serif;`;
  lastSeenText.textContent = `Last page visit: ${new Date(stats.lastVisit).toLocaleString()}`;
  catTitle.appendChild(lastSeenText);
}

  const editBtn = UIComponents.createButton('Edit', (e) => {
  e.stopPropagation();
  this.showEditCategoryModal(catName, categoryData);
}, {
  fontSize: '14px',
  marginLeft: '5px',
  padding: '4px 12px',
  minHeight: '28px',
  marginTop: '6px',
  marginBottom: '4px',
  title: 'Edit category options'
});
const deleteBtn = UIComponents.createButton('Delete', (e) => {
  e.stopPropagation();
  this.deleteCategory(catName);
}, {
  fontSize: '14px',
  marginLeft: '5px',
  padding: '4px 12px',
  minHeight: '28px',
  marginTop: '6px',
  marginBottom: '4px',
  title: 'Delete whole category and saved URLs'
});
const rankBtn = UIComponents.createButton('Rank', (e) => {
  e.stopPropagation();
  this.rankCategory(catName);
}, {
  fontSize: '14px',
  marginLeft: '5px',
  padding: '4px 12px',
  minHeight: '28px',
  marginTop: '6px',
  marginBottom: '4px',
  title: 'Rank alphabetically the URLs'
});

const upBtn = UIComponents.createButton('⬆', (e) => {
  e.stopPropagation();
  this.moveCategoryUp(catName);
}, {
  fontSize: '14px',
  marginLeft: '5px',
  padding: '4px 12px',
  minHeight: '28px',
  marginTop: '6px',
  marginBottom: '4px',
  title: 'Move category up',
  width: '32px'
});

const downBtn = UIComponents.createButton('⬇', (e) => {
  e.stopPropagation();
  this.moveCategoryDown(catName);
}, {
  fontSize: '14px',
  marginLeft: '5px',
  padding: '4px 12px',
  minHeight: '28px',
  marginTop: '6px',
  marginBottom: '4px',
  title: 'Move category down',
  width: '32px'
});


      catTitle.appendChild(editBtn);
      catTitle.appendChild(deleteBtn);
catTitle.appendChild(rankBtn);
  catTitle.appendChild(upBtn);
      catTitle.appendChild(downBtn);

      const linksDiv = document.createElement("div"); linksDiv.id = 'category-content-' + catName.replace(/\s+/g, '-'); linksDiv.style.cssText = 'display:none;margin-top:5px;';

categoryData.items.forEach((item, idx) => {
  const itemElem = this.renderItem(catName, item, idx, categoryData);
  linksDiv.appendChild(itemElem);
});

catTitle.onclick = (e) => {
        // Don't close mobile panel when clicking category
        e.stopPropagation();
        const isOpen = linksDiv.style.display === 'block';
        linksDiv.style.display = isOpen ? 'none' : 'block';
        catTitle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        DataStorage.setExpandedCategory(isOpen ? null : catName);
      };

      // Keyboard support
      catTitle.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          catTitle.onclick();
        }
      };
      if (lastExpanded === catName) {
        linksDiv.style.display = 'block';
      }

      box.appendChild(catTitle);
      box.appendChild(linksDiv);
      return box;
    },

/**
     * Render a single item
     * @param {string} catName - Category name
     * @param {Object} item - Item data
     * @param {number} idx - Item index
     * @param {Object} categoryData - Category data object
     * @returns {HTMLElement}
     */
    renderItem(catName, item, idx, categoryData) {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = 'display:flex;flex-direction:column;margin-bottom:5px;border-bottom:3px dashed #000;padding-bottom:3px;';

      const row = document.createElement("div");
      row.style.cssText = 'display:flex;align-items:center;';
      row.classList.add('item-row');

      const linkNameText = item.name || item.url;
      const linkBtn = UIComponents.createButton(linkNameText, () => { window.location.href = item.url; }, {
        flex: 'none',
        width: '50%',
        maxWidth: '200px',
        textAlign: 'left',
        padding: '6px 12px',
        cursor: 'pointer',
        minHeight: '32px',
        fontSize: '14px',
        overflow: 'hidden',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      });

      linkBtn.title = item.name || item.url;

      // Add track icon if needed
      if (item.track && !DateTimeUtils.isVisitedToday(item.lastSeen)) {
        const trackIcon = document.createElement('img');
        trackIcon.src = 'https://images.neopets.com/themes/004_bir_a2e60/events/warning.png';
        trackIcon.style.cssText = 'width:16px;height:16px;margin-left:8px;vertical-align:middle;';
        trackIcon.alt = 'Pending';
        linkBtn.appendChild(trackIcon);
      }

      const trackBox = document.createElement("input");
      trackBox.type = "checkbox";
      trackBox.checked = item.track;
      trackBox.title = "Track daily";
      trackBox.style.marginLeft = "5px";
      trackBox.onchange = () => this.toggleTrack(catName, item.url, trackBox.checked);

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.style.cssText = 'margin-left:5px;width:24px;height:24px;padding:0;min-height:unset;border:none;box-shadow:none;background:transparent url(https://images.neopets.com/themes/020_ppl_3c22d/events/battle_accept.png) center/contain no-repeat;cursor:pointer;';
      editBtn.title = 'Edit link';
      editBtn.setAttribute('aria-label', 'Edit ' + (item.name || item.url));
      editBtn.onclick = () => this.showEditItemModal(catName, item);
      editBtn.ontouchend = (e) => {
        e.preventDefault();
        this.showEditItemModal(catName, item);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn';
      deleteBtn.style.cssText = 'margin-left:5px;width:24px;height:24px;padding:0;min-height:unset;border:none;box-shadow:none;background:transparent url(https://images.neopets.com/themes/h5/common/images/invalid.png) center/contain no-repeat;cursor:pointer;';
      deleteBtn.title = 'Delete link';
      deleteBtn.setAttribute('aria-label', 'Delete ' + (item.name || item.url));
      deleteBtn.onclick = () => this.deleteItem(catName, item);
      deleteBtn.ontouchend = (e) => {
        e.preventDefault();
        this.deleteItem(catName, item);
      };

      const newTabBtn = document.createElement('button');
      newTabBtn.className = 'icon-btn';
      newTabBtn.style.cssText = 'margin-left:5px;width:24px;height:24px;padding:0;min-height:unset;border:none;box-shadow:none;background:transparent url(https://images.neopets.com/themes/h5/birthday/images/explore-icon.png) center/contain no-repeat;cursor:pointer;';
      newTabBtn.title = 'Open in new tab';
      newTabBtn.setAttribute('aria-label', 'Open ' + (item.name || item.url) + ' in new tab');
      newTabBtn.onclick = () => window.open(item.url, '_blank');
      newTabBtn.ontouchend = (e) => {
        e.preventDefault();
        window.open(item.url, '_blank');
      };

      row.appendChild(linkBtn);
      row.appendChild(trackBox);
      row.appendChild(editBtn);
      row.appendChild(deleteBtn);
      row.appendChild(newTabBtn);

      const visitInfo = this.createVisitInfo(item, categoryData);
      const reminderSection = this.createReminderSection(item);

      // Create notes button and div only if notes exist
      let notesBtn = null;
      let noteDiv = null;

      if (item.note && item.note.trim()) {
        notesBtn = UIComponents.createButton('Notes', null, {
          fontSize: '14px',
          marginLeft: '10px',
          marginTop: '4px',
          display: 'block',
          width: '200px',
          maxWidth: '50%',
          textAlign: 'left',
          padding: '6px 12px'
        });

        noteDiv = document.createElement("div");
        noteDiv.classList.add('note-block');
        noteDiv.style.cssText = 'display:none;margin-left:12px;max-height:100px;overflow-y:auto;';
        noteDiv.textContent = item.note;

        notesBtn.onclick = (e) => {
          e.stopPropagation();
          noteDiv.style.display = noteDiv.style.display === 'none' ? 'block' : 'none';
        };
      }

       wrapper.appendChild(row);

      // Only append reminder section if reminders exist
      if (item.reminders && item.reminders.length > 0) {
        wrapper.appendChild(reminderSection.button);
        wrapper.appendChild(reminderSection.div);
      }

      // Only append notes if they exist
      if (notesBtn && noteDiv) {
        wrapper.appendChild(notesBtn);
        wrapper.appendChild(noteDiv);
      }

      // Visit info goes last
      wrapper.appendChild(visitInfo);

      return wrapper;
    },

    /**
     * Create visit info display
     * @param {Object} item - Item data
     * @returns {HTMLElement}
     */
createVisitInfo(item, categoryData) {
  const visitInfo = document.createElement("div");
  visitInfo.style.cssText = `font-size:17px;margin-left:10px;margin-top:8px;color:${categoryData.textColor || '#444'};font-family:"Cafeteria","Arial Bold",sans-serif;`;

      const labelSpan = document.createElement("span");
      const timeSpan = document.createElement("span");
      timeSpan.style.marginLeft = "6px";

      if (!item.lastSeen) {
        labelSpan.textContent = "You have not visited this page yet.";
        labelSpan.style.fontWeight = "bold";
      } else if (DateTimeUtils.isVisitedToday(item.lastSeen)) {
        labelSpan.textContent = "Visited today at";
        timeSpan.textContent = " " + new Date(item.lastSeen).toLocaleTimeString();
      } else {
        labelSpan.textContent = "Last visited:";
        labelSpan.style.fontWeight = "bold";
        timeSpan.textContent = " " + new Date(item.lastSeen).toLocaleString();
      }

      visitInfo.appendChild(labelSpan);
      visitInfo.appendChild(timeSpan);
      return visitInfo;
    },

/**
     * Format days for reminder display
     * @param {Array} days - Array of day abbreviations
     * @returns {string} - Formatted days string
     */
    formatReminderDays(days) {
      if (!days || days.length === 0) return '';

      const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const sortedDays = days.slice().sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

      // Check for consecutive days
      const indices = sortedDays.map(d => dayOrder.indexOf(d));
      let isConsecutive = true;
      for (let i = 1; i < indices.length; i++) {
        if (indices[i] !== indices[i-1] + 1) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive && sortedDays.length > 2) {
        return `${sortedDays[0].toUpperCase()} - ${sortedDays[sortedDays.length - 1].toUpperCase()}`;
      } else {
        return sortedDays.map(d => d.toUpperCase()).join(', ');
      }
    },

    /**
     * Create reminder section
     * @param {Object} item - Item data
     * @returns {Object} - { button, div }
     */
    createReminderSection(item) {
      const totalReminders = (item.reminders || []).length;

const button = UIComponents.createButton(
  totalReminders > 0 ? `Reminders (${totalReminders})` : "Reminders",
  null,
  {
    fontSize: '14px',
    marginLeft: '10px',
    marginTop: '4px',
    display: 'block',
    width: '200px',
    maxWidth: '50%',
    textAlign: 'left',
    padding: '6px 12px'
  }
);
      const div = document.createElement('div');
div.classList.add('reminder-block');
div.style.cssText = 'display:none;margin-left:12px;margin-top:4px;font-size:12px;max-height:100px;overflow-y:auto;';

button.onclick = (e) => {
        e.stopPropagation();
        div.style.display = div.style.display === 'none' ? 'block' : 'none';
        div.innerHTML = '';
        if (!item.reminders || item.reminders.length === 0) {
          div.textContent = 'No reminders set for this page.';
          return;
        }
        item.reminders.forEach(r => {
          const p = document.createElement('div');
          p.classList.add('reminder-line');
          const text = ReminderOps.formatReminderText(r);
          if (text && r.days && r.days.length > 0) {
            const daysText = this.formatReminderDays(r.days);
            p.textContent = `${r.label}: ${text} | ${daysText}`;
          } else if (text) {
            p.textContent = `${r.label}: ${text}`;
          }
          div.appendChild(p);
        });
      };

      return { button, div };
    },

    /**
     * Show edit category modal
     * @param {string} catName - Category name
     * @param {Object} categoryData - Category data
     * @returns {void}
     */
    showEditCategoryModal(catName, categoryData) {
      const modal = UIComponents.createModal("Edit Category");

const nameLabel = document.createElement('div');
nameLabel.textContent = "Change category name:";
nameLabel.style.cssText = 'margin-bottom:4px;font-weight:bold;';

const nameInput = UIComponents.createInput('text', catName);
nameInput.style.cssText = 'width:95%;margin-bottom:10px;padding:4px;';

const bgLabel = document.createElement('div');
bgLabel.textContent = "Choose background color for category";
bgLabel.style.cssText = 'margin-bottom:4px;margin-top:8px;font-weight:bold;';

const bgPicker = UIComponents.createInput('color', categoryData.bgColor || '#d3d3d3');
bgPicker.style.cssText = 'margin-bottom:10px;display:block;';

const txtLabel = document.createElement('div');
txtLabel.textContent = "Choose title color for category";
txtLabel.style.cssText = 'margin-bottom:4px;font-weight:bold;';

const txtPicker = UIComponents.createInput('color', categoryData.textColor || '#000000');
txtPicker.style.cssText = 'display:block;margin-bottom:10px;';

const displayLabel = document.createElement('div');
displayLabel.textContent = "Display Options:";
displayLabel.style.cssText = 'margin-bottom:8px;margin-top:12px;font-weight:bold;';

const showSavedLinksChk = document.createElement('input');
showSavedLinksChk.type = 'checkbox';
showSavedLinksChk.checked = categoryData.showSavedLinks !== false;
const showSavedLinksLbl = document.createElement('label');
showSavedLinksLbl.style.cssText = 'display:block;margin-bottom:6px;';
showSavedLinksLbl.appendChild(showSavedLinksChk);
showSavedLinksLbl.appendChild(document.createTextNode(' Display Saved Links'));

const showVisitedTodayChk = document.createElement('input');
showVisitedTodayChk.type = 'checkbox';
showVisitedTodayChk.checked = categoryData.showVisitedToday !== false;
const showVisitedTodayLbl = document.createElement('label');
showVisitedTodayLbl.style.cssText = 'display:block;margin-bottom:6px;';
showVisitedTodayLbl.appendChild(showVisitedTodayChk);
showVisitedTodayLbl.appendChild(document.createTextNode(' Display Visited Today'));

const showLastVisitChk = document.createElement('input');
showLastVisitChk.type = 'checkbox';
showLastVisitChk.checked = categoryData.showLastVisit !== false;
const showLastVisitLbl = document.createElement('label');
showLastVisitLbl.style.cssText = 'display:block;margin-bottom:10px;';
showLastVisitLbl.appendChild(showLastVisitChk);
showLastVisitLbl.appendChild(document.createTextNode(' Display Overall Last Page Visit'));

const showTrackedURLChk = document.createElement('input');
showTrackedURLChk.type = 'checkbox';
showTrackedURLChk.checked = categoryData.showTrackedURL !== false;
const showTrackedURLLbl = document.createElement('label');
showTrackedURLLbl.style.cssText = 'display:block;margin-bottom:10px;';
showTrackedURLLbl.appendChild(showTrackedURLChk);
showTrackedURLLbl.appendChild(document.createTextNode(' Display Tracked URLs'));

const saveBtn = UIComponents.createButton('Save', () => {
        const newName = nameInput.value.trim() || catName;
        let data = DataStorage.getData();

        data = CategoryOps.upsertCategory(data, newName, {

  bgColor: bgPicker.value,
  textColor: txtPicker.value,
  showSavedLinks: showSavedLinksChk.checked,
  showVisitedToday: showVisitedTodayChk.checked,
  showLastVisit: showLastVisitChk.checked,
  showTrackedURL: showTrackedURLChk.checked
});

        if (newName !== catName) {
          data[newName].items = categoryData.items;
          data = CategoryOps.deleteCategory(data, catName);

          const expanded = DataStorage.getExpandedCategory();
          if (expanded === catName) {
            DataStorage.setExpandedCategory(newName);
          }
        }

        DataStorage.setData(data);
        document.body.removeChild(modal);
        this.renderList();
      });

modal.appendChild(nameLabel);
modal.appendChild(nameInput);
modal.appendChild(bgLabel);
modal.appendChild(bgPicker);
modal.appendChild(txtLabel);
modal.appendChild(txtPicker);
modal.appendChild(displayLabel);
modal.appendChild(showSavedLinksLbl);
modal.appendChild(showVisitedTodayLbl);
modal.appendChild(showLastVisitLbl);
modal.appendChild(showTrackedURLLbl);
modal.appendChild(saveBtn);
document.body.appendChild(modal);

    },

    /**
     * Delete category
     * @param {string} catName - Category name
     * @returns {void}
     */
    deleteCategory(catName) {
      if (!confirm("Delete category '" + catName + "'?")) return;

      let data = DataStorage.getData();
      data = CategoryOps.deleteCategory(data, catName);
      DataStorage.setData(data);

      const expanded = DataStorage.getExpandedCategory();
      if (expanded === catName) {
        DataStorage.setExpandedCategory(null);
      }

      this.renderList();
    },

/**
 * Sort all items in a category alphabetically
 * @param {string} catName - Category name
 * @returns {void}
 */
rankCategory(catName) {
  let data = DataStorage.getData();
  data = ItemOps.sortItems(data, catName);
  DataStorage.setData(data);
  this.renderList();
},

/**
 * Move category up in the list
 * @param {string} catName - Category name
 * @returns {void}
 */
moveCategoryUp(catName) {
  let data = DataStorage.getData();
  const keys = Object.keys(data);
  const currentIndex = keys.indexOf(catName);

  if (currentIndex <= 0) {
    alert("Category is already at the top.");
    return;
  }

  // Swap with previous
  const newData = {};
  keys.forEach((key, idx) => {
    if (idx === currentIndex - 1) {
      newData[catName] = data[catName];
    } else if (idx === currentIndex) {
      newData[keys[currentIndex - 1]] = data[keys[currentIndex - 1]];
    } else {
      newData[key] = data[key];
    }
  });

  DataStorage.setData(newData);
  this.renderList();
},

/**
 * Move category down in the list
 * @param {string} catName - Category name
 * @returns {void}
 */
moveCategoryDown(catName) {
  let data = DataStorage.getData();
  const keys = Object.keys(data);
  const currentIndex = keys.indexOf(catName);

  if (currentIndex >= keys.length - 1) {
    alert("Category is already at the bottom.");
    return;
  }

  // Swap with next
  const newData = {};
  keys.forEach((key, idx) => {
    if (idx === currentIndex) {
      newData[keys[currentIndex + 1]] = data[keys[currentIndex + 1]];
    } else if (idx === currentIndex + 1) {
      newData[catName] = data[catName];
    } else {
      newData[key] = data[key];
    }
  });

  DataStorage.setData(newData);
  this.renderList();
},

    /**
     * Show edit item modal
     * @param {string} catName - Category name
     * @param {Object} item - Item data
     * @returns {void}
     */
    showEditItemModal(catName, item) {
      const data = DataStorage.getData();
      const modal = UIComponents.createModal("Edit Link");

      const nameLabel = document.createElement('div');
      nameLabel.textContent = "Site Name:";
      nameLabel.style.cssText = 'margin-bottom:4px;font-weight:bold;';

const nameInput = UIComponents.createInput('text', item.name);
nameInput.style.cssText = 'width:95%;margin-bottom:10px;padding:4px;';

const urlLabel = document.createElement('div');
urlLabel.textContent = "Site URL:";
urlLabel.style.cssText = 'margin-bottom:4px;font-weight:bold;';

const urlInput = UIComponents.createInput('text', item.url);
urlInput.style.cssText = 'width:95%;margin-bottom:10px;padding:4px;';

      const moveLabel = document.createElement('div');
      moveLabel.textContent = "Move to category:";
      moveLabel.style.marginTop = '6px';

      const moveSelect = document.createElement('select');
      moveSelect.style.cssText = 'width:95%;margin-bottom:8px;';
      for (let c in data) {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        moveSelect.appendChild(opt);
      }
      moveSelect.value = catName;

      const notesLabel = document.createElement('div');
      notesLabel.textContent = "Notes:";
      notesLabel.style.marginTop = '6px';

      const notesTextarea = document.createElement('textarea');
      notesTextarea.style.cssText = 'width:95%;min-height:60px;margin-bottom:6px;';
      notesTextarea.value = item.note || '';

      const manageRemBtn = UIComponents.createButton('Manage Reminders', null, { marginTop: '0', width: '100%', textAlign: 'left', padding: '8px' });
      const inlineRemContainer = document.createElement('div');
      inlineRemContainer.style.cssText = 'display:none;margin-top:8px;';

      const manager = this.buildRemindersManager(item, () => {
        let currentData = DataStorage.getData();
        DataStorage.setData(currentData);
        this.renderList();
      });
      inlineRemContainer.appendChild(manager);

      manageRemBtn.onclick = () => {
        if (inlineRemContainer.style.display === 'none') {
          inlineRemContainer.style.display = 'block';
          manageRemBtn.textContent = 'Hide Reminders';
        } else {
          inlineRemContainer.style.display = 'none';
          manageRemBtn.textContent = 'Manage Reminders';
        }
      };

      const buttonRow = document.createElement('div');
      buttonRow.style.cssText = 'margin-top:12px;padding-top:8px;';

      const saveBtn = UIComponents.createButton('Save', () => {
        const targetCategory = moveSelect.value || catName;
        const updatedItem = {
          url: urlInput.value.trim(),
          name: nameInput.value.trim(),
          lastSeen: item.lastSeen || '',
          track: item.track || false,
          reminders: (item.reminders || []).slice(0, Constants.MAX_REMINDERS_PER_LINK),
          note: notesTextarea.value || ''
        };

        let currentData = DataStorage.getData();

        if (targetCategory === catName) {
          currentData = ItemOps.updateItem(currentData, catName, item.url, updatedItem);
        } else {
          currentData = ItemOps.deleteItem(currentData, catName, item.url);
          currentData = ItemOps.addItem(currentData, targetCategory, updatedItem);
          currentData[targetCategory].items[currentData[targetCategory].items.length - 1] = updatedItem;

          const expanded = DataStorage.getExpandedCategory();
          if (expanded === catName) {
            DataStorage.setExpandedCategory(targetCategory);
          }
        }

        DataStorage.setData(currentData);
        document.body.removeChild(modal);
        this.renderList();
      }, { marginRight: '8px' });

      const cancelBtn = UIComponents.createButton('Cancel', () => {
        document.body.removeChild(modal);
      });

modal.appendChild(nameLabel);
      modal.appendChild(nameInput);
      modal.appendChild(urlLabel);
      modal.appendChild(urlInput);
      modal.appendChild(moveLabel);
      modal.appendChild(moveSelect);
      modal.appendChild(notesLabel);
      modal.appendChild(notesTextarea);
      modal.appendChild(manageRemBtn);
      modal.appendChild(inlineRemContainer);
      buttonRow.appendChild(saveBtn);
      buttonRow.appendChild(cancelBtn);
      modal.appendChild(buttonRow);
      document.body.appendChild(modal);
    },

    /**
     * Build reminders manager UI
     * @param {Object} item - Item with reminders
     * @param {Function} onSave - Callback when reminders change
     * @returns {HTMLElement}
     */
    buildRemindersManager(item, onSave) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('inline-reminders-wrapper');

      const listArea = document.createElement('div');
      listArea.style.cssText = 'max-height:260px;overflow-y:auto;';

      const rebuild = () => {
        listArea.innerHTML = '';
        (item.reminders || []).forEach((r, idx) => {
          const card = this.createReminderCard(item, r, idx, rebuild, onSave);
          listArea.appendChild(card);
        });

        const canAdd = (item.reminders || []).length < Constants.MAX_REMINDERS_PER_LINK;
        const addWrapper = document.createElement('div');
        addWrapper.style.marginTop = '8px';

        if (canAdd) {
          const addBtn = UIComponents.createButton('Add Reminder', () => {
            item = ReminderOps.addReminder(item, { label: 'Reminder', days: [], time: '', repeat: true });
            rebuild();
            onSave && onSave();
          });
          addWrapper.appendChild(addBtn);
        } else {
          const msg = document.createElement('div');
          msg.textContent = 'Maximum of 3 reminders reached.';
          addWrapper.appendChild(msg);
        }
        listArea.appendChild(addWrapper);
      };

      rebuild();
      wrapper.appendChild(listArea);
      return wrapper;
    },

    /**
     * Create reminder card
     * @param {Object} item - Parent item
     * @param {Object} reminder - Reminder data
     * @param {number} idx - Reminder index
     * @param {Function} rebuild - Rebuild UI callback
     * @param {Function} onSave - Save callback
     * @returns {HTMLElement}
     */
    createReminderCard(item, reminder, idx, rebuild, onSave) {
      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #eee;padding:8px;margin-bottom:6px;border-radius:6px;background:transparent;';

      const labelInput = UIComponents.createInput('text', reminder.label || '', 'Label (e.g., "Gallery Submit")');
      labelInput.style.cssText = 'width:95%;margin-bottom:6px;';

      const timeInput = UIComponents.createInput('time', reminder.time || '');
      timeInput.style.cssText = 'display:block;margin-bottom:6px;';

      const daysDiv = document.createElement('div');
      daysDiv.style.marginBottom = '6px';
      Constants.DAYS.forEach(d => {
        const lbl = document.createElement('label');
        lbl.style.marginRight = '6px';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.value = d;
        chk.checked = Array.isArray(reminder.days) && reminder.days.includes(d);
        lbl.appendChild(chk);
        lbl.appendChild(document.createTextNode(d));
        daysDiv.appendChild(lbl);
      });

      const repeatChk = document.createElement('input');
      repeatChk.type = 'checkbox';
      repeatChk.checked = !!reminder.repeat;
      const repeatLabel = document.createElement('label');
      repeatLabel.style.display = 'block';
      repeatLabel.appendChild(repeatChk);
      repeatLabel.appendChild(document.createTextNode(' Repeat weekly'));

      const btnRow = document.createElement('div');
      btnRow.style.marginTop = '6px';

      const saveBtn = UIComponents.createButton('Save', () => {
        const selectedDays = [];
        daysDiv.querySelectorAll('input[type=checkbox]').forEach(chk => {
          if (chk.checked) selectedDays.push(chk.value);
        });

        item = ReminderOps.updateReminder(item, idx, {
          label: labelInput.value.trim() || 'Reminder',
          time: timeInput.value,
          days: selectedDays,
          repeat: repeatChk.checked
        });

        onSave && onSave();
        rebuild();
      });

      const deleteBtn = UIComponents.createButton('Delete', () => {
        if (confirm('Delete this reminder?')) {
          item = ReminderOps.deleteReminder(item, idx);
          onSave && onSave();
          rebuild();
        }
      }, { marginLeft: '8px' });

      btnRow.appendChild(saveBtn);
      btnRow.appendChild(deleteBtn);

      const localPreview = document.createElement('div');
      localPreview.style.cssText = 'margin-top:6px;font-size:12px;color:#555;';
      if (reminder.time) {
        const localTime = DateTimeUtils.convertPSTToLocal(reminder.time);
        localPreview.innerHTML = `Local time: ${localTime}`;
      }

      timeInput.onchange = () => {
        if (timeInput.value) {
          const localTime = DateTimeUtils.convertPSTToLocal(timeInput.value);
          localPreview.innerHTML = `Local time: ${localTime}`;
        } else {
          localPreview.textContent = '';
        }
      };

      card.appendChild(labelInput);
      card.appendChild(timeInput);
      card.appendChild(daysDiv);
      card.appendChild(repeatLabel);
      card.appendChild(localPreview);
      card.appendChild(btnRow);

      return card;
    },

    /**
     * Toggle item tracking
     * @param {string} catName - Category name
     * @param {string} url - Item URL
     * @param {boolean} checked - New track state
     * @returns {void}
     */
    toggleTrack(catName, url, checked) {
      let data = DataStorage.getData();
      data = ItemOps.updateItem(data, catName, url, { track: checked });
      DataStorage.setData(data);
      this.renderList();
    },

    /**
     * Delete item
     * @param {string} catName - Category name
     * @param {Object} item - Item data
     * @returns {void}
     */
    deleteItem(catName, item) {
      if (!confirm("Delete page '" + item.name + "'?")) return;

      let data = DataStorage.getData();
      data = ItemOps.deleteItem(data, catName, item.url);
      DataStorage.setData(data);
      this.renderList();
    }
  };

  // ============================================================================
  // INITIALIZATION AND AUTO-START
  // ============================================================================

  /**
   * Initialize application
   * @returns {void}
   */
  function init() {
    // Auto-mark current page as visited
    AutoVisitTracker.track();

    // Initialize UI
    UIController.init();

    // Setup mutation observer to recreate panel if removed
    const observer = new MutationObserver(() => {
      if (!document.getElementById(Constants.PANEL_ID)) {
        UIController.init();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Expose render function for manual calls
    window._neopets_quick_save_renderList = () => {
      UIController.renderList();
    };
  }

  // Start on load - more robust
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded
  init();
}

// Backup: also try on window load
window.addEventListener('load', function() {
  if (!document.getElementById(Constants.PANEL_ID)) {
    init();
  }
});

})();

// ============================================================================
// MODULE INTERFACE DOCUMENTATION
// ============================================================================
/*

CONSTANTS
---------
- All configuration values (storage keys, IDs, max limits, etc.)

DataStorage
-----------
Input: none (reads localStorage)
Output: Data objects, state values
Methods:
  - getData() → Object
  - setData(data: Object) → void
  - getPanelState() → boolean
  - setPanelState(isOpen: boolean) → void
  - getExpandedCategory() → string|null
  - setExpandedCategory(categoryName: string|null) → void
  - wasReminderShown(key: string) → boolean
  - markReminderShown(key: string) → void

DataNormalizer
--------------
Input: Raw storage data
Output: Normalized data structures
Methods:
  - normalize(raw: Object) → Object
  - normalizeItem(item: Object) → Object
  - normalizeReminders(item: Object) → Array
  - migrateOldReminders(item: Object) → Array

DateTimeUtils
-------------
Input: Date strings, time strings
Output: Formatted dates/times, comparisons
Methods:
  - getTodayPacific() → string (YYYY-MM-DD)
  - isVisitedToday(lastSeen: string) → boolean
  - getPacificNow() → { day: string, date: string, time: string }
  - getLocalTimezoneAbbr() → string
  - formatTime12Hour(timeStr: string) → string
  - convertPSTToLocal(timeStr: string) → string

URLUtils
--------
Input: URL strings
Output: Normalized URLs, comparisons
Methods:
  - getBaseURL(url: string) → string
  - matchesCurrentPage(savedUrl: string, currentUrl: string) → boolean

CategoryOps
-----------
Input: Data object, category properties
Output: Modified data object
Methods:
  - upsertCategory(data: Object, name: string, props: Object) → Object
  - renameCategory(data: Object, oldName: string, newName: string) → Object
  - deleteCategory(data: Object, name: string) → Object
  - getCategoryStats(categoryData: Object) → { total, visitedToday, pending, lastVisit }

ItemOps
-------
Input: Data object, item properties
Output: Modified data object
Methods:
  - addItem(data: Object, categoryName: string, item: Object) → Object
  - updateItem(data: Object, categoryName: string, oldUrl: string, updates: Object) → Object
  - deleteItem(data: Object, categoryName: string, url: string) → Object
  - moveItem(data: Object, fromCategory: string, toCategory: string, url: string) → Object
  - reorderItems(data: Object, categoryName: string, fromIndex: number, toIndex: number) → Object
  - markVisited(data: Object, url: string) → Object
  - countPending(data: Object) → number

ReminderOps
-----------
Input: Item object, reminder data
Output: Modified item, formatted text, checks
Methods:
  - addReminder(item: Object, reminder: Object) → Object
  - updateReminder(item: Object, index: number, updates: Object) → Object
  - deleteReminder(item: Object, index: number) → Object
  - formatReminderText(reminder: Object) → string|null
  - shouldFire(reminder: Object, now: Object) → boolean
  - getReminderKey(url: string, reminder: Object, date: string) → string

ImportExport
------------
Input: Data object or file
Output: Downloads file or parsed data
Methods:
  - exportToFile(data: Object) → void (triggers download)
  - importFromFile(file: File, onSuccess: Function, onError: Function) → void

AutoVisitTracker
----------------
Input: none (reads current URL)
Output: Updates data storage
Methods:
  - track() → void

UIComponents
------------
Input: Various parameters for UI elements
Output: DOM elements
Methods:
  - createModal(title: string) → HTMLElement
  - createButton(text: string, onClick: Function, style: Object) → HTMLElement
  - createInput(type: string, value: string, placeholder: string) → HTMLElement

UIController
------------
Input: User interactions, data changes
Output: DOM updates, data saves
Methods:
  - init() → void
  - injectStyles() → void
  - createPanel() → void
  - attachEventHandlers() → void
  - restoreState() → void
  - updateAlert() → void
  - toggleList() → void
  - showSaveModal() → void
  - exportData() → void
  - importData() → void
  - renderList() → void
  - renderCategory(catName: string, categoryData: Object, lastExpanded: string|null) → HTMLElement
  - renderItem(catName: string, item: Object, idx: number) → HTMLElement
  - createVisitInfo(item: Object) → HTMLElement
  - createReminderSection(item: Object) → { button: HTMLElement, div: HTMLElement }
  - showEditCategoryModal(catName: string, categoryData: Object) → void
  - deleteCategory(catName: string) → void
  - showEditItemModal(catName: string, item: Object) → void
  - buildRemindersManager(item: Object, onSave: Function) → HTMLElement
  - createReminderCard(item: Object, reminder: Object, idx: number, rebuild: Function, onSave: Function) → HTMLElement
  - toggleTrack(catName: string, url: string, checked: boolean) → void
  - deleteItem(catName: string, item: Object) → void

DATA STRUCTURES
---------------

CategoryData:
{
  bgColor: string,
  textColor: string,
  items: Array<ItemData>
}

ItemData:
{
  url: string,
  name: string,
  track: boolean,
  lastSeen: string (ISO date),
  note: string,
  reminders: Array<ReminderData>
}

ReminderData:
{
  label: string,
  days: Array<string>, // ['Sun', 'Mon', ...]
  time: string, // HH:MM format
  repeat: boolean
}

*/
