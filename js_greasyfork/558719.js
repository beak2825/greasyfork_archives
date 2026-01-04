// ==UserScript==
// @name        TorrentBD Scrap forum
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.net/forums.php*
// @match       https://www.torrentbd.com/forums.php*
// @version     1.0
// @author      TheMyth
// @icon        data:image/png;base64,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
// @run-at      document-end
// @license     MIT
// @description 7/30/2024, 3:06:29 AM
// @downloadURL https://update.greasyfork.org/scripts/558719/TorrentBD%20Scrap%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/558719/TorrentBD%20Scrap%20forum.meta.js
// ==/UserScript==

// Constants
const STORAGE_KEY = 'ourLinks';
const BUTTON_STYLES = `
  position: fixed;
  bottom: 0;
  right: 20px;
  border-radius: 4px;
  margin: 6px 8px;
  padding: 6px 14px;
  border: none;
  opacity: 0.7;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

/**
 * Creates a reusable IndexedDB storage manager
 * @param {string} dbName - Name of the database
 * @param {string} storeName - Name of the object store
 * @param {number} version - Database version
 * @returns {Object} - Database interface object with CRUD methods
 */
function createIndexedDBStorage(dbName, storeName, version = 1) {
  console.log(`Creating IndexedDB storage: ${dbName}, store: ${storeName}, version: ${version}`);
  const dbManager = {
    instance: null,

    // Initialize the database
    init() {
      console.log(`Initializing IndexedDB: ${dbName}`);
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        request.onerror = (event) => {
          console.error(`IndexedDB error in ${dbName}:`, event.target.errorCode);
          reject(event.target.errorCode);
        };

        request.onsuccess = (event) => {
          this.instance = event.target.result;
          console.log(`Successfully connected to IndexedDB: ${dbName}`);
          resolve(this.instance);
        };

        request.onupgradeneeded = (event) => {
          console.log(`Creating/upgrading object store: ${storeName}`);
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
            console.log(`Object store created: ${storeName}`);
          }
        };
      });
    },

    // Save data with specified key
    save(key, data) {
      console.log(`Saving data with key: ${key} (size: ${String(data).length} chars)`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          console.error('Database not initialized for save operation');
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ id: key, content: data });

        request.onsuccess = () => {
          console.log(`Successfully saved data for key: ${key}`);
          resolve();
        };
        request.onerror = (event) => {
          console.error(`Error saving data for key ${key}:`, event.target.errorCode);
          reject(event.target.errorCode);
        };
      });
    },

    // Retrieve data by key
    get(key) {
      console.log(`Retrieving data for key: ${key}`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          console.error('Database not initialized for get operation');
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result ? request.result.content : '';
          console.log(`Retrieved data for key: ${key} (found: ${!!request.result}, size: ${String(result).length} chars)`);
          resolve(result);
        };
        request.onerror = (event) => {
          console.error(`Error retrieving data for key ${key}:`, event.target.errorCode);
          reject(event.target.errorCode);
        };
      });
    },

    // Delete data by key
    delete(key) {
      console.log(`Deleting data for key: ${key}`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          console.error('Database not initialized for delete operation');
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          console.log(`Successfully deleted data for key: ${key}`);
          resolve();
        };
        request.onerror = (event) => {
          console.error(`Error deleting data for key ${key}:`, event.target.errorCode);
          reject(event.target.errorCode);
        };
      });
    },

    // Get all keys in the store
    getAllKeys() {
      console.log(`Retrieving all keys from: ${storeName}`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    },

    // Get all data in the store
    getAll() {
      console.log(`Retrieving all data from: ${storeName}`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    },

    // Clear all data in the store
    clear() {
      console.log(`Clearing all data from: ${storeName}`);
      return new Promise((resolve, reject) => {
        if (!this.instance) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.instance.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.errorCode);
      });
    },

    // Close the database connection
    close() {
      console.log(`Closing connection to IndexedDB: ${dbName}`);
      if (this.instance) {
        this.instance.close();
        this.instance = null;
      }
    }
  };

  return dbManager;
}

// Create our storage instance
const db = createIndexedDBStorage('forumScraperDB', 'scrapedContent');

// Create UI elements
function createScrapButton() {
  const scrapBtn = document.createElement("button");
  scrapBtn.textContent = "Scrap";
  scrapBtn.setAttribute("title", "Scrap Forum Content");
  scrapBtn.style.cssText = BUTTON_STYLES;

  // Add hover effect
  scrapBtn.addEventListener('mouseover', () => scrapBtn.style.opacity = '1');
  scrapBtn.addEventListener('mouseout', () => scrapBtn.style.opacity = '0.7');

  scrapBtn.addEventListener("click", getPostInfo);
  document.body.appendChild(scrapBtn);

  // Create download button
  checkAndCreateDownloadButton();
}

// Check for existing data and create download button if needed
async function checkAndCreateDownloadButton() {
  try {
    await db.init();
    const existingContent = await db.get(STORAGE_KEY);

    if (existingContent && existingContent.length > 0) {
      console.log(`Found existing content (${existingContent.length} chars), creating download button`);
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download Saved";
      downloadBtn.setAttribute("title", "Download Previously Scraped Content");
      downloadBtn.style.cssText = BUTTON_STYLES + `
        right: 140px;
        background-color: #2196F3;
      `;

      // Add hover effect
      downloadBtn.addEventListener('mouseover', () => downloadBtn.style.opacity = '1');
      downloadBtn.addEventListener('mouseout', () => downloadBtn.style.opacity = '0.7');

      downloadBtn.addEventListener("click", downloadSavedContent);
      document.body.appendChild(downloadBtn);
    }
  } catch (error) {
    console.error("Error checking for saved content:", error);
    // Try localStorage fallback
    const localContent = localStorage.getItem(STORAGE_KEY);
    if (localContent && localContent.length > 0) {
      console.log(`Found existing localStorage content (${localContent.length} chars), creating download button`);
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download Saved";
      downloadBtn.setAttribute("title", "Download Previously Scraped Content");
      downloadBtn.style.cssText = BUTTON_STYLES + `
        right: 140px;
        background-color: #2196F3;
      `;

      // Add hover effect
      downloadBtn.addEventListener('mouseover', () => downloadBtn.style.opacity = '1');
      downloadBtn.addEventListener('mouseout', () => downloadBtn.style.opacity = '0.7');

      downloadBtn.addEventListener("click", downloadSavedContent);
      document.body.appendChild(downloadBtn);
    }
  }
}

// Download saved content without scraping current page
async function downloadSavedContent() {
  try {
    // Initialize DB if not already done
    await db.init();

    // Get saved content
    let savedContent = await db.get(STORAGE_KEY);

    if (savedContent && savedContent.length > 0) {
      const forumName = document.querySelector("#middle-block > div.frtt.margin-b-20.forum-page-title");
      const fileName = forumName?.textContent || "forum-content";

      // Get current timestamp in format YYYY-MM-DD_HH-MM-SS
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

      // Add timestamp to filename
      const filenameWithTimestamp = `${fileName.trim()}_${timestamp}.md`;

      console.log(`Preparing download of saved content: ${filenameWithTimestamp} (${savedContent.length} chars)`);
      downloadContent(savedContent, filenameWithTimestamp);

      if (confirm("Clear saved content after download?")) {
        await db.delete(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    } else {
      alert("No saved content found in IndexedDB");
    }
  } catch (error) {
    console.error("Error downloading saved content from IndexedDB:", error);

    // Fallback to localStorage
    const localContent = localStorage.getItem(STORAGE_KEY);
    if (localContent && localContent.length > 0) {
      const forumName = document.querySelector("#middle-block > div.frtt.margin-b-20.forum-page-title");
      const fileName = forumName?.textContent || "forum-content";

      // Get current timestamp in format YYYY-MM-DD_HH-MM-SS
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

      // Add timestamp to filename
      const filenameWithTimestamp = `${fileName.trim()}_${timestamp}.md`;

      console.log(`Preparing download from localStorage: ${filenameWithTimestamp} (${localContent.length} chars)`);
      downloadContent(localContent, filenameWithTimestamp);

      if (confirm("Clear saved content after download?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    } else {
      alert("No saved content found in localStorage either");
    }
  }
}

// Convert HTML to Markdown
function htmlToMarkdown(html) {
  console.log(`Converting HTML to Markdown (HTML size: ${html.length} chars)`);

  // Create a temporary div to hold the HTML and filter out elements with class "body"
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove elements with class "body"
  const elementsWithBodyClass = tempDiv.querySelectorAll('.body');
  console.log(`Found ${elementsWithBodyClass.length} elements with class "body" to remove`);
  elementsWithBodyClass.forEach(element => {
    element.parentNode.removeChild(element);
  });

  // Helper function to process nodes
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tagName = node.tagName.toLowerCase();
    const children = Array.from(node.childNodes).map(processNode).join('');

    switch (tagName) {
      case 'h1': return `# ${children}\n\n`;
      case 'h2': return `## ${children}\n\n`;
      case 'h3': return `### ${children}\n\n`;
      case 'h4': return `#### ${children}\n\n`;
      case 'h5': return `##### ${children}\n\n`;
      case 'h6': return `###### ${children}\n\n`;
      case 'p': return `${children}\n\n`;
      case 'strong':
      case 'b': return `**${children}**`;
      case 'em':
      case 'i': return `*${children}*`;
      case 'u': return `_${children}_`;
      case 'strike': return `~~${children}~~`;
      case 'code': return `\`${children}\``;
      case 'pre': return `\`\`\`\n${children}\n\`\`\`\n\n`;
      case 'ul': return `${children}\n`;
      case 'ol': return `${children}\n`;
      case 'li': return `* ${children}\n`;
      case 'blockquote': return `> ${children.split('\n').join('\n> ')}\n\n`;
      case 'a': return `[${children}](${node.getAttribute('href') || '#'})`;
      case 'img': return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`;
      case 'br': return '\n';
      case 'hr': return '---\n\n';
      case 'table': return `\n${children}\n`;
      case 'tr': return `${children}|\n`;
      case 'th':
      case 'td': return `| ${children} `;
      case 'div': return `${children}\n\n`;
      default: return children;
    }
  }

  let markdown = '';
  Array.from(tempDiv.childNodes).forEach(node => {
    markdown += processNode(node);
  });

  // Clean up repeated newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  console.log(`Conversion complete (Markdown size: ${markdown.length} chars)`);
  return markdown;
}

// Get post information
async function getPostInfo() {
  let output = "";

  // Gather post content
  const postElements = document.querySelectorAll(".post-body:not(.container)");

  postElements.forEach((post, index) => {
    const markdown = htmlToMarkdown(post.innerHTML);
    output += `${index+1}.\n${markdown}\n\n---\n`;
  });

  const nextElement = document.querySelector('a[title="Next page"]');
  console.log(`Next page element found: ${!!nextElement}`);

  if (nextElement) {
    try {
      // Initialize DB if not already done
      console.log('Initializing database connection');
      await db.init();

      // Save current progress and navigate to next page
      const currentOutput = await db.get(STORAGE_KEY) || "";
      console.log(`Current stored content size: ${currentOutput.length} chars`);
      console.log(`New content size: ${output.length} chars`);
      console.log(`Total content size to store: ${(currentOutput + output).length} chars`);

      await db.save(STORAGE_KEY, currentOutput + output);

      // Also use localStorage as fallback
      try {
        console.log('Attempting to save to localStorage as backup');
        localStorage.setItem(STORAGE_KEY, currentOutput + output);
      } catch (e) {
        console.warn("localStorage quota exceeded, using IndexedDB only", e);
      }

      console.log(`Navigating to next page: ${nextElement.href}`);
      window.location.href = nextElement.href;
    } catch (error) {
      console.error("Error in IndexedDB operations:", error);
      alert("Error saving scraped content. Try using localStorage fallback.");

      // Fallback to localStorage
      console.log('Falling back to localStorage');
      const currentOutput = localStorage.getItem(STORAGE_KEY) || "";
      localStorage.setItem(STORAGE_KEY, currentOutput + output);
      console.log(`Navigating to next page: ${nextElement.href}`);
      window.location.href = nextElement.href;
    }
  } else {
    console.log('Final page reached, preparing to download content');
    // Download complete content
    const forumName = document.querySelector("#middle-block > div.frtt.margin-b-20.forum-page-title");
    const fileName = forumName?.textContent || "forum-content";

    // Get current timestamp in format YYYY-MM-DD_HH-MM-SS
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

    // Add timestamp to filename
    const filenameWithTimestamp = `${fileName.trim()}_${timestamp}.md`;

    console.log(`Forum title detected: "${fileName}" with timestamp: ${timestamp}`);

    try {
      // Initialize DB if not already done
      console.log('Initializing database for final data retrieval');
      await db.init();

      // Combine stored content with current page
      console.log('Retrieving all stored content');
      let completeOutput = await db.get(STORAGE_KEY);
      completeOutput = (completeOutput || "") + output;
      console.log(`Total content size for download: ${completeOutput.length} chars`);

      // Create and trigger download
      console.log(`Preparing download for file: ${filenameWithTimestamp}`);
      downloadContent(completeOutput, filenameWithTimestamp);

      // Clean up storage
      console.log('Cleaning up storage');
      await db.delete(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      console.log('Storage cleanup complete');
    } catch (error) {
      console.error("Error in final data processing:", error);
      alert("Error retrieving scraped content. Trying localStorage fallback.");

      // Fallback to localStorage
      console.log('Falling back to localStorage for final data');
      const completeOutput = (localStorage.getItem(STORAGE_KEY) || "") + output;
      console.log(`Total content size from localStorage: ${completeOutput.length} chars`);
      downloadContent(completeOutput, filenameWithTimestamp);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

// Helper function to download content
function downloadContent(content, filename) {
  console.log(`Initiating download: ${filename} (size: ${content.length} chars)`);
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = URL.createObjectURL(blob);

  document.body.appendChild(link);
  console.log('Download link created and appended to document');
  link.click();
  console.log('Download triggered');

  // Clean up
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
  console.log('Download resources cleaned up');
}

// Initialize
(async function init() {
  try {
    await db.init();
    console.log("IndexedDB initialized successfully");
    // Check if there's previously stored content
    const existingContent = await db.get(STORAGE_KEY);
    if (existingContent) {
      console.log(`Found previously stored content (size: ${existingContent.length} chars)`);
    } else {
      console.log('No previously stored content found');
    }
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    // Check localStorage fallback
    const localContent = localStorage.getItem(STORAGE_KEY);
    if (localContent) {
      console.log(`Found previously stored content in localStorage (size: ${localContent.length} chars)`);
    }
  }

  createScrapButton();
})();
