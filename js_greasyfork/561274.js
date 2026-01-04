// ==UserScript==
// @name         CRYSTAL's Torn Mail & Newsletter Templates
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Manage mail and faction newsletter templates with subject & content, modal popup, import/export, edit, load, delete
// @author       Crystal
// @match        https://www.torn.com/messages.php*
// @match        https://www.torn.com/factions.php*
// @grant        none
// @icon         https://raw.githubusercontent.com/Crystallized22/torn-assets/main/paw-icon.png
// @downloadURL https://update.greasyfork.org/scripts/561274/CRYSTAL%27s%20Torn%20Mail%20%20Newsletter%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/561274/CRYSTAL%27s%20Torn%20Mail%20%20Newsletter%20Templates.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const STORAGE_KEY = 'tornMailTemplates';

  // Utility function to debounce calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function getTemplates() {
    const data = localStorage.getItem(STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveTemplates(templates) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }

  // ✅ Editor support (iframe fallback + 2025 UI)
  function loadIntoEditor(htmlContent) {
    const iframe = document.querySelector('iframe.tox-edit-area__iframe');
    const editorBody = iframe?.contentDocument?.body;

    if (editorBody) {
      editorBody.innerHTML = htmlContent;
      editorBody.focus();
      return true;
    }

    const editableDiv = document.querySelector(
      '.message-editor [contenteditable="true"], div[contenteditable="true"]'
    );
    if (editableDiv) {
      editableDiv.innerHTML = htmlContent;
      editableDiv.dispatchEvent(new Event('input', { bubbles: true }));
      editableDiv.focus();
      return true;
    }

    console.warn('Could not find the message editor to load content.');
    return false;
  }

  // ✅ Robust subject field selector
  function loadSubject(subject) {
    const subjectInput =
      document.querySelector('input[placeholder*="Subject"]') ||
      document.querySelector('input[name="subject"]') ||
      document.querySelector('#subject') ||
      document.querySelector('.message-subject input[type="text"]') ||
      document.querySelector('input[type="text"]');

    if (subjectInput) {
      subjectInput.value = subject;
      subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.warn('Subject input not found.');
    }
  }

  function refreshQuickDropdownOptions() {
    const select = document.getElementById('quickTemplateSelect');
    if (!select) return;
    const templates = getTemplates();

    while (select.options.length > 1) {
      select.remove(1);
    }

    Object.keys(templates).sort().forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  function updateQuickDropdown() {
    refreshQuickDropdownOptions();
  }

  function createQuickTemplateDropdown() {
    if (window.innerWidth < 768) return; // Skip dropdown on mobile, use modal for templates
    const container = document.querySelector('.message-buttons-wrap') || document.querySelector('div[class*="buttons"]');
    if (!container || document.getElementById('quickTemplateSelect')) return;

    const select = document.createElement('select');
    select.id = 'quickTemplateSelect';
    select.style.marginLeft = '10px';
    select.style.padding = '5px';
    select.style.minWidth = '180px';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Load template…';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    select.addEventListener('change', () => {
      const templates = getTemplates();
      const key = select.value;
      if (!templates[key]) return;
      loadSubject(templates[key].subject || '');
      loadIntoEditor(templates[key].content || '');
      select.value = '';
    });

    container.appendChild(select);
    refreshQuickDropdownOptions();
  }

  function createTemplatesButton() {
    const container = document.querySelector('.message-buttons-wrap') || document.querySelector('div[class*="buttons"]');
    const isMobile = window.innerWidth < 768;

    if (!isMobile && (!container || document.getElementById('openTemplatesBtn'))) return;
    if (isMobile && document.getElementById('openTemplatesBtn')) return;

    const btn = document.createElement('button');
    btn.textContent = 'Templates';
    btn.id = 'openTemplatesBtn';
    btn.className = 'torn-btn';
    if (isMobile) {
      // Floating button on mobile
      btn.style.position = 'fixed';
      btn.style.top = '50%';
      btn.style.right = '20px';
      btn.style.transform = 'translateY(-50%)';
      btn.style.zIndex = '99999'; // Below modal
      btn.style.padding = '10px';
      btn.style.borderRadius = '50%';
      btn.style.width = '60px';
      btn.style.height = '60px';
      btn.style.fontSize = '12px';
      btn.style.backgroundColor = 'orange';
      document.body.appendChild(btn);
    } else {
      btn.style.marginLeft = '5px';
      if (container) container.appendChild(btn);
    }

    btn.addEventListener('click', () => {
      let modal = document.getElementById('templateModal');
      if (!modal) {
        createTemplateModal();
        modal = document.getElementById('templateModal');
      }
      modal.style.display = 'block';
    });
  }

  function createTemplateModal() {
    if (document.getElementById('templateModal')) return;

    const modal = document.createElement('div');
    modal.id = 'templateModal';
    Object.assign(modal.style, {
      position: 'fixed',
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      border: '2px solid #444',
      borderRadius: '8px',
      padding: '20px',
      zIndex: '100000',
      width: '90vw',
      maxWidth: '420px',
      height: 'auto',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    });

    modal.innerHTML = `
      <h3 style="margin-top: 0;">Manage Templates</h3>
      <label>Template Name:</label>
      <input id="templateNameInput" type="text" style="width:100%;margin-bottom:10px;" placeholder="Enter template name" />
      <label>Subject Line:</label>
      <input id="templateSubjectInput" type="text" style="width:100%;margin-bottom:10px;" placeholder="Enter subject line" />
      <label>Template Content (HTML allowed):</label>
      <textarea id="templateContentInput" style="width:100%;height:120px;margin-bottom:10px;" placeholder="Write your message..."></textarea>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button id="saveTemplateBtn" class="torn-btn">Save / Update</button>
        <button id="deleteTemplateBtn" class="torn-btn" disabled>Delete</button>
        <button id="exportTemplatesBtn" class="torn-btn">Export</button>
        <button id="importTemplatesBtn" class="torn-btn">Import</button>
      </div>
      <hr/>
      <div id="templateListSection">
        <label>Saved Templates:</label>
        <select id="templateListSelect" style="width:100%;margin-bottom:10px;">
          <option value="" disabled selected>Select a template to load</option>
        </select>
      </div>
      <div id="importSection" style="display:none;">
        <label>Paste JSON here:</label>
        <textarea id="importTextarea" style="width:100%;height:100px;margin-bottom:10px;"></textarea>
        <button id="confirmImportBtn" class="torn-btn">Confirm Import</button>
        <button id="cancelImportBtn" class="torn-btn">Cancel</button>
      </div>
      <div style="text-align:right;">
        <button id="closeTemplateModalBtn" class="torn-btn">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    const nameInput = modal.querySelector('#templateNameInput');
    const subjectInput = modal.querySelector('#templateSubjectInput');
    const contentInput = modal.querySelector('#templateContentInput');
    const saveBtn = modal.querySelector('#saveTemplateBtn');
    const deleteBtn = modal.querySelector('#deleteTemplateBtn');
    const exportBtn = modal.querySelector('#exportTemplatesBtn');
    const importBtn = modal.querySelector('#importTemplatesBtn');
    const listSelect = modal.querySelector('#templateListSelect');
    const closeBtn = modal.querySelector('#closeTemplateModalBtn');
    const importTextarea = modal.querySelector('#importTextarea');
    const confirmImportBtn = modal.querySelector('#confirmImportBtn');
    const cancelImportBtn = modal.querySelector('#cancelImportBtn');
    const templateListSection = modal.querySelector('#templateListSection');
    const importSection = modal.querySelector('#importSection');

    // Enable delete button when name input has value
    nameInput.addEventListener('input', () => {
      deleteBtn.disabled = !nameInput.value.trim();
    });

    // Load template when selected from list
    listSelect.addEventListener('change', () => {
      const name = listSelect.value;
      if (name) loadTemplate(name);
    });

    function clearInputs() {
      nameInput.value = '';
      subjectInput.value = '';
      contentInput.value = '';
      deleteBtn.disabled = true;
      listSelect.value = '';
    }

    function refreshModalTemplateList() {
      const templates = getTemplates();
      while (listSelect.options.length > 1) listSelect.remove(1);
      Object.keys(templates).sort().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        listSelect.appendChild(option);
      });
    }

    function loadTemplate(name) {
      const templates = getTemplates();
      if (!templates[name]) return;
      nameInput.value = name;
      subjectInput.value = templates[name].subject || '';
      contentInput.value = templates[name].content || '';
      deleteBtn.disabled = false;
      listSelect.value = name;
    }

    saveBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) return alert('Template name required.');
      const templates = getTemplates();
      templates[name] = {
        subject: subjectInput.value.trim(),
        content: contentInput.value.trim()
      };
      saveTemplates(templates);
      alert(`Saved "${name}"`);
      refreshModalTemplateList();
      updateQuickDropdown();
      deleteBtn.disabled = false;
    });

    deleteBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name || !confirm(`Delete "${name}"?`)) return;
      const templates = getTemplates();
      delete templates[name];
      saveTemplates(templates);
      alert(`Deleted "${name}"`);
      clearInputs();
      refreshModalTemplateList();
      updateQuickDropdown();
    });

    // ✅ Export templates
    exportBtn.addEventListener('click', () => {
      const templates = getTemplates();
      const dataStr = JSON.stringify(templates);
      navigator.clipboard.writeText(dataStr).then(() => {
        alert('Templates copied to clipboard!');
      }).catch(() => {
        alert('Could not copy to clipboard. Check browser permissions.');
      });
    });

    // ✅ Import templates
    importBtn.addEventListener('click', () => {
      templateListSection.style.display = 'none';
      importSection.style.display = 'block';
    });

    confirmImportBtn.addEventListener('click', () => {
      const json = importTextarea.value.trim();
      if (!json) return alert('No JSON provided.');
      try {
        const imported = JSON.parse(json);
        const templates = getTemplates();
        Object.assign(templates, imported);
        saveTemplates(templates);
        alert('Templates imported!');
        refreshModalTemplateList();
        updateQuickDropdown();
        importTextarea.value = '';
        importSection.style.display = 'none';
        templateListSection.style.display = 'block';
      } catch (e) {
        alert('Invalid JSON: ' + e.message);
      }
    });

    cancelImportBtn.addEventListener('click', () => {
      importTextarea.value = '';
      importSection.style.display = 'none';
      templateListSection.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Keyboard shortcuts
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
      } else if (e.key === 'Enter' && e.ctrlKey) {
        saveBtn.click();
      }
    });

    refreshModalTemplateList();
  }

  function initWhenEditorAppears() {
    const checkAndCreate = () => {
      if (window.location.hash.includes('p=compose') || window.location.hash.includes('tab=controls&option=newsletter')) {
        createQuickTemplateDropdown();
        createTemplatesButton();
      }
    };

    const debouncedCheck = debounce(checkAndCreate, 300); // Debounce to avoid excessive calls

    const observer = new MutationObserver(debouncedCheck);
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for hash changes
    window.addEventListener('hashchange', checkAndCreate);

    // Initial check in case the page loads with the hash already set
    checkAndCreate();
  }

  initWhenEditorAppears();

})();
