// ==UserScript==
// @name         WME Easy Storage Manager
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @author       Hiwi234, DevlinDelFuego
// @version      2025.10.12
// @description  Easy Storage Manager is a handy script that allows you to easily export and import local storage data for WME.
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        GM_xmlhttpRequest
// @connect      api.dropboxapi.com
// @connect      content.dropboxapi.com
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/552935/WME%20Easy%20Storage%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/552935/WME%20Easy%20Storage%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

  const ESM_DIAG = {
    log: (...args) => console.log('[ESM]', ...args),
    warn: (...args) => console.warn('[ESM]', ...args),
    error: (...args) => console.error('[ESM]', ...args)
  };
  window.addEventListener('error', (e) => {
    try { sessionStorage.setItem('ESM_DIAG_LAST_ERROR', `${e.message} at ${e.filename}:${e.lineno}`); } catch (err) {}
    ESM_DIAG.error('Unhandled error:', e.message);
  });
  window.addEventListener('unhandledrejection', (e) => {
    try { sessionStorage.setItem('ESM_DIAG_LAST_REJECTION', String(e.reason)); } catch (err) {}
    ESM_DIAG.error('Unhandled rejection:', e.reason);
  });
  // Compact UI styles to avoid blowing up the layout
  (function injectCompactStyles(){
    const css = `
      /* Compact buttons across all ESM variants */
      #esm-import, #esm-export,
      #esm-cloud-backup, #esm-cloud-restore,
      #esm-import-btn, #esm-export-btn,
      #esm-drive-backup-btn, #esm-drive-restore-btn {
        padding: 6px 10px !important;
        font-size: 12px !important;
        width: 100% !important;
        flex: 1 1 0 !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }
      /* Row containers: use CSS Grid for perfect equality with 4 equal columns */
      #esm-tab > div, #easy-storage-manager-tab > div {
        display: grid !important;
        width: 100% !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        gap: 8px !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
      }
      /* Fallback panel button container - also 4 equal columns */
      #esm-fallback-panel .btnRow,
      #esm-fallback-panel > div[style*="display: flex"] {
        display: grid !important;
        width: 100% !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        gap: 8px !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }
      @media (max-width: 768px) {
        #esm-tab > div, #easy-storage-manager-tab > div,
        #esm-fallback-panel .btnRow,
        #esm-fallback-panel > div[style*="display: flex"] {
          grid-template-columns: 1fr 1fr !important;
        }
      }
      @media (max-width: 480px) {
        #esm-tab > div, #easy-storage-manager-tab > div,
        #esm-fallback-panel .btnRow,
        #esm-fallback-panel > div[style*="display: flex"] {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    try {
      const style = document.createElement('style');
      style.id = 'esm-compact-styles';
      style.textContent = css;
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', function(){
          try { document.head.appendChild(style); } catch (_) {}
        });
      }
    } catch (_) {}
  })();

    let importedData; // Imported JSON data
    let applyButton; // Apply button element
    let scriptVersion = (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) ? GM_info.script.version : 'dev-local';
    const updateMessage = "<b>Changelog</b><br><br> - Full backup export/import now includes localStorage, sessionStorage, cookies, and IndexedDB. <br> - You can select which items to restore across all storage types and DB records. <br> - The page will refresh after importing to apply changes. <br> - Added Dropbox cloud backup and restore functionality. <br><br>";
    const REAPPLY_STASH_KEY = 'ESM_POST_RELOAD';
    // Sprachunterstützung (DE/EN) für UI-Texte
    const ESM_LANG = ((navigator.language || 'en').toLowerCase().startsWith('de')) ? 'de' : 'en';
    const ESM_I18N = {
      de: {
        panelTitle: 'Cloud-Backup (Dropbox) – Anleitung',
        show: 'Anzeigen',
        hide: 'Ausblenden',
        howTo: 'So aktivierst du die Online-Cloud:',
        step1: 'Bei Dropbox anmelden.',
        step2: 'App erstellen (kostenlos):',
        step3: 'In deiner App einen Generated access token erzeugen.',
        step4: 'Token unten eingeben und speichern.',
        genTokenLabel: 'Generated access token:',
        saveTokenBtn: 'Token speichern',
        clearTokenBtn: 'Abmelden',
        statusEnterToken: 'Bitte Token eingeben.',
        statusSavedValidated: 'Token gespeichert und validiert. Dropbox ist bereit.',
        statusSignedOut: 'Abgemeldet. Bitte neuen Token eingeben.',
        cloudBackup: '☁️ Cloud Sichern',
        cloudRestore: '☁️ Wiederherstellen',
        cloudBackupTitle: '☁️ Backup in Dropbox sichern',
        cloudRestoreTitle: '☁️ Aus Dropbox wiederherstellen'
      },
      en: {
        panelTitle: 'Cloud Backup (Dropbox) – Guide',
        show: 'Show',
        hide: 'Hide',
        howTo: 'How to enable cloud backup:',
        step1: 'Sign in to Dropbox.',
        step2: 'Create an app (free):',
        step3: 'Generate a personal access token in your app.',
        step4: 'Enter the token below and save it.',
        genTokenLabel: 'Generated access token:',
        saveTokenBtn: 'Save Token',
        clearTokenBtn: 'Sign out',
        statusEnterToken: 'Please enter a token.',
        statusSavedValidated: 'Token saved and validated. Dropbox is ready.',
        statusSignedOut: 'Signed out. Please enter a new token.',
        cloudBackup: '☁️ Cloud Backup',
        cloudRestore: '☁️ Restore',
        cloudBackupTitle: '☁️ Save backup to Dropbox',
        cloudRestoreTitle: '☁️ Restore from Dropbox'
      }
    };
    function t(key) {
      const langVal = (ESM_I18N[ESM_LANG] && ESM_I18N[ESM_LANG][key]) || null;
      const enVal = (ESM_I18N.en && ESM_I18N.en[key]) || null;
      const deVal = (ESM_I18N.de && ESM_I18N.de[key]) || null;
      return langVal || enVal || deVal || key;
    }
    // Extend language maps with additional UI texts for Import/Export & Drive
    try {
      Object.assign(ESM_I18N.de, {
        importExportDesc: 'Importiere eine Backup-JSON-Datei oder exportiere ein vollständiges Backup (localStorage, sessionStorage, Cookies, IndexedDB).',
        importBackup: '♻️ Wiederherstellen',
        exportBackup: '💾 Lokal Speichern',
        importBackupTitle: '♻️ Backup importieren',
        exportBackupTitle: '💾 Backup exportieren',
        driveBackupTitle: '☁️ Backup in Dropbox sichern',
        driveRestoreTitle: '☁️ Aus Dropbox wiederherstellen',
        importFunctionUnavailable: 'Import-Funktion nicht verfügbar',
        exportFunctionUnavailable: 'Export-Funktion nicht verfügbar',
        dropboxExportUnavailable: 'Dropbox Backup-Funktion nicht verfügbar',
        dropboxImportUnavailable: 'Dropbox Wiederherstellungs-Funktion nicht verfügbar',
        driveExportUnavailable: 'Dropbox Backup-Funktion nicht verfügbar',
        driveImportUnavailable: 'Dropbox Wiederherstellungs-Funktion nicht verfügbar',
        selectAll: 'Alle auswählen',
        deselectAll: 'Auswahl aufheben',
        apply: 'Anwenden',
        scriptTitle: 'Easy Storage Manager',
        fallbackDesc: 'Fallback-Panel aktiv. Importiere/Exportiere Backups und wähle Schlüssel zur Wiederherstellung.'
      });
      Object.assign(ESM_I18N.en, {
        importExportDesc: 'Import a backup JSON file or export a full backup (localStorage, sessionStorage, cookies, IndexedDB).',
        importBackup: '♻️ Restore',
        exportBackup: '💾 Save Local',
        importBackupTitle: '♻️ Import Backup',
        exportBackupTitle: '💾 Export Backup',
        driveBackupTitle: '☁️ Save backup to Dropbox',
        driveRestoreTitle: '☁️ Restore from Dropbox',
        importFunctionUnavailable: 'Import function not available',
        exportFunctionUnavailable: 'Export function not available',
        dropboxExportUnavailable: 'Dropbox export function not available',
        dropboxImportUnavailable: 'Dropbox restore function not available',
        driveExportUnavailable: 'Dropbox export function not available',
        driveImportUnavailable: 'Dropbox import function not available',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        apply: 'Apply',
        scriptTitle: 'Easy Storage Manager',
        fallbackDesc: 'Fallback panel active. Import/export backups and choose keys to restore.'
      });
    } catch (_) {}
    // Zusätzliche Texte für vollständige UI-Übersetzung (Alerts/Labels)
    try {
      Object.assign(ESM_I18N.de, {
        dropboxSaveSuccessPrefix: '✅ Backup erfolgreich in Dropbox gespeichert!',
        dropboxSaveFailedPrefix: '❌ Dropbox Backup fehlgeschlagen:',
        dropboxNoBackups: '❌ Keine Backup-Dateien in Dropbox gefunden.',
        invalidSelection: '❌ Ungültige Auswahl.',
        foreignBackupHint: 'Hinweis: Das Backup stammt von einer anderen Quelle. Aus Sicherheitsgründen werden Cookies und Session Storage standardmäßig nicht importiert.',
        dropboxLoadSuccessPrefix: '✅ Dropbox Backup erfolgreich geladen!',
        foundEntriesLabel: 'Gefundene Einträge:',
        invalidJson: '❌ Backup-Datei konnte nicht gelesen werden: Ungültiges JSON-Format.',
        dropboxRestoreFailedPrefix: '❌ Dropbox Wiederherstellung fehlgeschlagen:',
        fileReadSuccess: 'Datei erfolgreich gelesen',
        fileReadError: 'Fehler beim Lesen der Datei. Bitte erneut versuchen.',
        noKeysSelected: 'Keine Schlüssel ausgewählt. Nichts zu importieren.',
        fileLabel: 'Datei:',
        pathLabel: 'Pfad:',
        sizeLabel: 'Größe:',
        kb: 'KB'
      });
      Object.assign(ESM_I18N.en, {
        dropboxSaveSuccessPrefix: '✅ Backup saved to Dropbox successfully!',
        dropboxSaveFailedPrefix: '❌ Dropbox backup failed:',
        dropboxNoBackups: '❌ No backup files found in Dropbox.',
        invalidSelection: '❌ Invalid selection.',
        foreignBackupHint: 'Note: The backup originates from a different source. For security reasons, cookies and session storage are not imported by default.',
        dropboxLoadSuccessPrefix: '✅ Dropbox backup loaded successfully!',
        foundEntriesLabel: 'Found entries:',
        invalidJson: '❌ Could not read backup file: Invalid JSON format.',
        dropboxRestoreFailedPrefix: '❌ Dropbox restore failed:',
        fileReadSuccess: 'File read successfully',
        fileReadError: 'Error occurred while reading the file. Please try again.',
        noKeysSelected: 'No keys selected. Nothing to import.',
        fileLabel: 'File:',
        pathLabel: 'Path:',
        sizeLabel: 'Size:',
        kb: 'KB'
      });
    } catch (_) {}
    try {
      Object.assign(ESM_I18N.de, {
        restorePrompt: 'Welche Datei möchten Sie wiederherstellen?'
      });
      Object.assign(ESM_I18N.en, {
        restorePrompt: 'Which file would you like to restore?'
      });
    } catch (_) {}

    // Dropbox API Configuration
    const DROPBOX_CONFIG = {
      APP_KEY: '9fxl4soww5di6qt',
      APP_SECRET: '46inexcd3evrqik',
      ACCESS_TOKEN: null,
      REDIRECT_URI: 'http://localhost:8080/esm_dropbox_oauth.html',
      // Use same-origin Waze Dropbox endpoint to satisfy CSP
      PROXY_BASE_URL: '/dropbox',
      API_BASE_URL: 'https://api.dropboxapi.com/2',
      CONTENT_API_URL: 'https://content.dropboxapi.com/2'
    };

    let dropboxAuth = null;
    const DROPBOX_TOKEN_KEY = 'ESM_DROPBOX_TOKEN';
    const DROPBOX_ACCOUNT_CACHE_KEY = 'ESM_DROPBOX_ACCOUNT';
    const DROPBOX_REFRESH_TOKEN_KEY = 'ESM_DROPBOX_REFRESH_TOKEN';
    const DROPBOX_TOKEN_EXPIRES_KEY = 'ESM_DROPBOX_TOKEN_EXPIRES';
const DROPBOX_REDIRECT_URI_KEY = 'ESM_DROPBOX_REDIRECT_URI';
// Hook alerts to display bilingual messages for known keys
(function(){
  const origAlert = window.alert;
  const map = {
    'Import function not available': t('importFunctionUnavailable'),
    'Export function not available': t('exportFunctionUnavailable'),
    'Dropbox Backup-Funktion nicht verfügbar': t('dropboxExportUnavailable'),
    'Dropbox Wiederherstellungs-Funktion nicht verfügbar': t('dropboxImportUnavailable'),
  };
  window.alert = function(msg){
    const key = String(msg);
    const repl = map[key] || key;
    return origAlert(repl);
  };
})();

    function getRedirectUri() {
      const saved = localStorage.getItem(DROPBOX_REDIRECT_URI_KEY);
      if (saved && typeof saved === 'string' && saved.trim()) return saved.trim();
      return DROPBOX_CONFIG.REDIRECT_URI;
    }

    function setDropboxToken(token) {
      try {
        localStorage.setItem(DROPBOX_TOKEN_KEY, token);
        dropboxAuth = token;
        ESM_DIAG.log('Dropbox token gespeichert.');
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Token nicht speichern:', e);
      }
    }

    function clearDropboxToken() {
      try {
        localStorage.removeItem(DROPBOX_TOKEN_KEY);
        localStorage.removeItem(DROPBOX_REFRESH_TOKEN_KEY);
        localStorage.removeItem(DROPBOX_TOKEN_EXPIRES_KEY);
        dropboxAuth = null;
        sessionStorage.removeItem(DROPBOX_ACCOUNT_CACHE_KEY);
        ESM_DIAG.log('Dropbox-Token gelöscht.');
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Token nicht löschen:', e);
      }
    }

    async function promptForDropboxToken() {
      const hint = 'Bitte persönliches Dropbox Access Token eingeben (Bearer Token).\n' +
        'Anleitung: Öffne https://www.dropbox.com/developers/apps, wähle deine App,\n' +
        'erzeuge ein Access Token und füge es hier ein.';
      const token = prompt(hint);
      if (!token) throw new Error('Kein Dropbox-Token eingegeben');
      setDropboxToken(token.trim());
      // Validierung
      await getDropboxAccount(token.trim());
      return token.trim();
    }

    async function getDropboxAccount(accessToken) {
      // Cache lesen
      try {
        const cached = sessionStorage.getItem(DROPBOX_ACCOUNT_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (_) {}
      if (typeof GM_xmlhttpRequest !== 'function') {
        // Ohne GM können wir den Account nicht bequem validieren; Return minimal
        return { account_id: 'unknown', email: 'unknown' };
      }
      const res = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL}/users/get_current_account`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        // Body muss leer sein
      });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Dropbox-Token ungültig (${res.status})`);
      }
      let info;
      try { info = JSON.parse(res.responseText); } catch (_) { info = { account_id: 'unknown', email: 'unknown' }; }
      try { sessionStorage.setItem(DROPBOX_ACCOUNT_CACHE_KEY, JSON.stringify(info)); } catch (_) {}
      return info;
    }

    // Helfer global verfügbar machen
    try {
      window.ESM_setDropboxToken = setDropboxToken;
      window.ESM_clearDropboxToken = clearDropboxToken;
      window.ESM_promptDropboxToken = promptForDropboxToken;
      window.ESM_setDropboxRedirectUri = function (url) {
        try {
          if (typeof url !== 'string' || !url.trim()) throw new Error('Ungültige URL');
          const u = url.trim();
          localStorage.setItem(DROPBOX_REDIRECT_URI_KEY, u);
          DROPBOX_CONFIG.REDIRECT_URI = u; // live update
          ESM_DIAG.log('Dropbox Redirect-URI gesetzt:', u);
        } catch (e) {
          ESM_DIAG.error('Konnte Redirect-URI nicht setzen:', e);
        }
      };
      window.ESM_getDropboxRedirectUri = function () { return getRedirectUri(); };
    } catch (_) {}

    // ===== OAuth 2.0 (PKCE) Hilfsfunktionen =====
    function base64urlFromBytes(bytes) {
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }
    function generateCodeVerifier() {
      const bytes = new Uint8Array(64);
      crypto.getRandomValues(bytes);
      return base64urlFromBytes(bytes);
    }
    async function sha256Base64Url(input) {
      const data = new TextEncoder().encode(input);
      const hash = await crypto.subtle.digest('SHA-256', data);
      return base64urlFromBytes(new Uint8Array(hash));
    }
    function saveTokenResponse(token) {
      try {
        if (token.access_token) localStorage.setItem(DROPBOX_TOKEN_KEY, token.access_token);
        if (token.refresh_token) localStorage.setItem(DROPBOX_REFRESH_TOKEN_KEY, token.refresh_token);
        const expiresAt = token.expires_in ? (Date.now() + (token.expires_in * 1000)) : 0;
        localStorage.setItem(DROPBOX_TOKEN_EXPIRES_KEY, String(expiresAt));
        dropboxAuth = token.access_token || null;
      } catch (e) {
        ESM_DIAG.warn('Konnte Token-Antwort nicht speichern:', e);
      }
    }
    async function exchangeCodeForToken(code, verifier) {
      const body = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: DROPBOX_CONFIG.APP_KEY,
        code_verifier: verifier,
        redirect_uri: getRedirectUri()
      }).toString();
      const res = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL.replace('/2','')}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Token-Austausch fehlgeschlagen (${res.status}): ${res.responseText || ''}`);
      }
      let json; try { json = JSON.parse(res.responseText); } catch (_) { json = {}; }
      saveTokenResponse(json);
      return json;
    }
    async function refreshAccessToken() {
      const refreshToken = localStorage.getItem(DROPBOX_REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('Kein Refresh-Token vorhanden');
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: DROPBOX_CONFIG.APP_KEY
      }).toString();
      const res = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL.replace('/2','')}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Token-Refresh fehlgeschlagen (${res.status}): ${res.responseText || ''}`);
      }
      let json; try { json = JSON.parse(res.responseText); } catch (_) { json = {}; }
      saveTokenResponse(json);
      return json;
    }
    async function ensureDropboxAccessToken() {
      const token = localStorage.getItem(DROPBOX_TOKEN_KEY);
      const exp = parseInt(localStorage.getItem(DROPBOX_TOKEN_EXPIRES_KEY) || '0', 10);
      if (token && exp && (Date.now() < (exp - 60_000))) {
        dropboxAuth = token;
        return token;
      }
      if (localStorage.getItem(DROPBOX_REFRESH_TOKEN_KEY)) {
        const refreshed = await refreshAccessToken();
        return refreshed.access_token;
      }
      return null;
    }
    async function oauthDropboxPKCE() {
      const verifier = generateCodeVerifier();
      const challenge = await sha256Base64Url(verifier);
      const state = Math.random().toString(36).slice(2);
      try { sessionStorage.setItem('ESM_OAUTH_VERIFIER', verifier); sessionStorage.setItem('ESM_OAUTH_STATE', state); } catch (_) {}
      const redirectUri = getRedirectUri();
      // Warnung ausgeben, falls die Redirect-URI offensichtlich nicht produktionsfähig ist
      try {
        const u = new URL(redirectUri);
        if (u.protocol !== 'https:' && u.hostname !== 'localhost') {
          ESM_DIAG.warn('Redirect-URI ist nicht HTTPS. Dropbox verlangt im Live-Betrieb HTTPS.');
        }
      } catch (e) {
        ESM_DIAG.warn('Ungültige Redirect-URI-Konfiguration:', redirectUri);
      }
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: DROPBOX_CONFIG.APP_KEY,
        redirect_uri: redirectUri,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        token_access_type: 'offline',
        state
      }).toString();
      const authUrl = `https://www.dropbox.com/oauth2/authorize?${params}`;
      const w = window.open(authUrl, 'esm_dropbox_oauth', 'width=600,height=700');
      if (!w) throw new Error('Konnte OAuth-Fenster nicht öffnen');
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          window.removeEventListener('message', onMsg);
          reject(new Error('OAuth Zeitüberschreitung'));
        }, 180_000);
        function onMsg(e) {
          try {
            const data = e.data || {};
            if (data && data.type === 'ESM_DROPBOX_OAUTH_CODE') {
              window.removeEventListener('message', onMsg);
              clearTimeout(timer);
              const ver = sessionStorage.getItem('ESM_OAUTH_VERIFIER') || verifier;
              const st = sessionStorage.getItem('ESM_OAUTH_STATE');
              if (st && data.state && st !== data.state) {
                reject(new Error('Ungültiger OAuth state'));
                return;
              }
              exchangeCodeForToken(data.code, ver).then(resolve).catch(reject);
            }
          } catch (err) {
            // ignore
          }
        }
        window.addEventListener('message', onMsg);
      });
    }
    try { window.ESM_startDropboxOAuth = oauthDropboxPKCE; } catch (_) {}

    // Wrapper around GM_xmlhttpRequest to bypass page CSP when available
    function gmFetch(url, opts = {}) {
      const method = opts.method || 'GET';
      const headers = opts.headers || {};
      // Only include a request body if the caller provided one.
      // This avoids sending the literal string "null" to endpoints (e.g. Dropbox files/download)
      // that require an entirely empty request body.
      const hasBody = Object.prototype.hasOwnProperty.call(opts, 'body');
      let body = null;
      if (hasBody) {
        if (typeof opts.body === 'string') body = opts.body;
        else if (opts.body != null) body = JSON.stringify(opts.body);
      }
      const responseType = opts.responseType || 'text';
      return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') {
          reject(new Error('GM_xmlhttpRequest not available'));
          return;
        }
        try {
          const req = {
            url,
            method,
            headers,
            responseType,
            onload: (res) => resolve(res),
            onerror: (err) => reject(new Error(err && err.error ? err.error : 'GM request failed')),
            ontimeout: () => reject(new Error('GM request timeout'))
          };
          if (body != null) {
            req.data = body;
          }
          GM_xmlhttpRequest(req);
        } catch (e) {
          reject(e);
        }
      });
    }

    // Get safe, preferably native storage methods from a fresh iframe context (in case other scripts patch the prototype)
    function captureNativeStorage() {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
        document.documentElement.appendChild(iframe);
        const win = iframe.contentWindow;
        const methods = {
          getItem: win.Storage.prototype.getItem,
          setItem: win.Storage.prototype.setItem,
          removeItem: win.Storage.prototype.removeItem,
          key: win.Storage.prototype.key
        };
        iframe.parentNode.removeChild(iframe);
        return methods;
      } catch (e) {
        // Fallback to current (possibly patched) prototype
        return {
          getItem: Storage.prototype.getItem,
          setItem: Storage.prototype.setItem,
          removeItem: Storage.prototype.removeItem,
          key: Storage.prototype.key
        };
      }
    }
    const NativeStorage = captureNativeStorage();

    // Early recovery attempt immediately after script start,
    // so that protected keys are activated before other user scripts, if possible
    try { reapplyAfterReload(); } catch (_) { /* ignore */ }

    // ===== Einfache Anleitung & Token-Input (UI) für Dropbox Cloud =====
    // parent: optional Container; wenn gesetzt, wird das Panel inline im Skripte-Tab gerendert
    function injectDropboxHelpPanel(parent) {
      try {
        if (document.getElementById('esm-dropbox-help-panel')) return;
        const inline = !!parent;
        const hiddenKey = inline ? 'ESM_DROPBOX_HELP_TAB_HIDDEN' : 'ESM_DROPBOX_HELP_HIDDEN';
        const hidden = localStorage.getItem(hiddenKey) === '1';
        const wrapper = document.createElement('div');
        wrapper.id = 'esm-dropbox-help-panel';
        wrapper.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
        wrapper.style.color = '#111827';
        if (!inline) {
          wrapper.style.position = 'fixed';
          wrapper.style.bottom = '16px';
          wrapper.style.right = '16px';
          wrapper.style.zIndex = '2147483646';
        } else {
          wrapper.style.marginTop = '10px';
          wrapper.style.width = '100%';
        }

        const card = document.createElement('div');
        card.style.background = '#ffffff';
        card.style.border = '1px solid #e5e7eb';
        card.style.borderRadius = '12px';
        card.style.overflow = 'hidden';
        if (!inline) {
          card.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
          card.style.width = '340px';
          card.style.maxWidth = '90vw';
        } else {
          card.style.boxShadow = 'none';
          card.style.width = '100%';
          card.style.maxWidth = '100%';
        }

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.padding = '10px 12px';
        header.style.background = '#f9fafb';
        header.style.borderBottom = '1px solid #e5e7eb';
        const title = document.createElement('div');
        title.textContent = t('panelTitle');
        title.style.fontSize = '13px';
        title.style.fontWeight = '600';
        const controls = document.createElement('div');
        const btnHide = document.createElement('button');
        btnHide.textContent = hidden ? t('show') : t('hide');
        btnHide.style.fontSize = '12px';
        btnHide.style.border = '1px solid #d1d5db';
        btnHide.style.background = '#ffffff';
        btnHide.style.borderRadius = '8px';
        btnHide.style.padding = '4px 8px';
        btnHide.style.cursor = 'pointer';
        btnHide.addEventListener('click', () => {
          const contentVisible = content.style.display !== 'none';
          content.style.display = contentVisible ? 'none' : 'block';
          btnHide.textContent = contentVisible ? t('show') : t('hide');
          try { localStorage.setItem(hiddenKey, contentVisible ? '1' : '0'); } catch (_) {}
        });
        controls.appendChild(btnHide);
        header.appendChild(title);
        header.appendChild(controls);

        const content = document.createElement('div');
        content.style.padding = '12px';
        content.style.display = hidden ? 'none' : 'block';
        content.innerHTML = `
          <div style="font-size:12px; line-height:1.5;">
            <p style="margin:0 0 8px"><b>${t('howTo')}</b></p>
            <ol style="margin:0 0 10px 18px; padding:0;">
              <li>${t('step1')}</li>
              <li>${t('step2')} <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noopener">https://www.dropbox.com/developers/apps</a></li>
              <li>${t('step3')}</li>
              <li>${t('step4')}</li>
            </ol>
            <div style="margin:8px 0 4px">${t('genTokenLabel')}</div>
            <input id="esm-dropbox-token-input" type="text" placeholder="Dropbox Access Token" style="width:100%; box-sizing:border-box; font-size:12px; padding:6px 8px; border:1px solid #d1d5db; border-radius:8px;" />
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button id="esm-dropbox-token-save" style="flex:1; font-size:12px; border:1px solid #10b981; background:#10b981; color:#fff; border-radius:8px; padding:6px 8px; cursor:pointer;">${t('saveTokenBtn')}</button>
              <button id="esm-dropbox-token-clear" style="flex:1; font-size:12px; border:1px solid #ef4444; background:#ef4444; color:#fff; border-radius:8px; padding:6px 8px; cursor:pointer;">${t('clearTokenBtn')}</button>
            </div>
            <div id="esm-dropbox-token-status" style="margin-top:8px; font-size:12px; color:#374151;"></div>
          </div>
        `;

        card.appendChild(header);
        card.appendChild(content);
        wrapper.appendChild(card);
        if (inline && parent) {
          parent.appendChild(wrapper);
        } else {
          document.documentElement.appendChild(wrapper);
        }

        // Prefill input with stored token if available
        const input = content.querySelector('#esm-dropbox-token-input');
        const saveBtn = content.querySelector('#esm-dropbox-token-save');
        const clearBtn = content.querySelector('#esm-dropbox-token-clear');
        const statusEl = content.querySelector('#esm-dropbox-token-status');
        try {
          const stored = localStorage.getItem(DROPBOX_TOKEN_KEY);
          if (stored) input.value = stored;
        } catch (_) {}

        async function setStatus(msg, type) {
          statusEl.textContent = msg || '';
          statusEl.style.color = type === 'error' ? '#b91c1c' : (type === 'success' ? '#065f46' : '#374151');
        }

        saveBtn.addEventListener('click', async () => {
          const token = String(input.value || '').trim();
          if (!token) { setStatus(t('statusEnterToken'), 'error'); return; }
          try {
            setDropboxToken(token);
            // optional: validate account
            await getDropboxAccount(token);
            setStatus(t('statusSavedValidated'), 'success');
          } catch (e) {
            setStatus(`Fehler beim Speichern/Validieren: ${e && e.message ? e.message : e}`, 'error');
          }
        });

        clearBtn.addEventListener('click', async () => {
          try {
            clearDropboxToken();
            input.value = '';
            setStatus(t('statusSignedOut'), '');
          } catch (e) {
            setStatus(`Fehler beim Abmelden: ${e && e.message ? e.message : e}`, 'error');
          }
        });
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Hilfspanel nicht einfügen:', e);
      }
    }
    // Hinweis: Die Hilfe wird jetzt im Skripte-Tab inline eingefügt (siehe addScriptTab)

    // Authenticate with Dropbox (ohne OAuth, nur gespeicherter Access-Token)
    async function authenticateDropbox() {
      try {
        ESM_DIAG.log('Dropbox-Authentifizierung (nur Token) starten...');
        // Direkt gespeicherten Token verwenden
        const token = (dropboxAuth && String(dropboxAuth).trim()) || localStorage.getItem(DROPBOX_TOKEN_KEY);
        if (token && String(token).trim()) {
          try { await getDropboxAccount(token); } catch (_) {}
          dropboxAuth = String(token).trim();
          return dropboxAuth;
        }
        // Kein Token vorhanden -> Nutzer um persönlichen Access-Token bitten
        const manual = await promptForDropboxToken();
        dropboxAuth = manual;
        return manual;
      } catch (error) {
        ESM_DIAG.error('Dropbox-Authentifizierung (Token) fehlgeschlagen:', error);
        throw error;
      }
    }

    // Attempt to attach CSRF headers expected by waze.com endpoints
    function getCsrfHeaders() {
      try {
        const cookies = document.cookie.split(';').map(s => s.trim()).reduce((acc, cur) => {
          const idx = cur.indexOf('=');
          if (idx > -1) acc[cur.slice(0, idx)] = decodeURIComponent(cur.slice(idx + 1));
          return acc;
        }, {});
        const token = cookies['XSRF-TOKEN'] || cookies['xsrf-token'] || cookies['_csrf'] || cookies['csrf'] || cookies['csrf_token'] || cookies['X-CSRF-TOKEN'];
        if (!token) {
          ESM_DIAG.warn('No CSRF token cookie found for waze.com Dropbox endpoint');
          return {};
        }
        const headers = {
          'X-XSRF-TOKEN': token,
          'X-CSRF-TOKEN': token,
          'X-CSRF-Token': token
        };
        ESM_DIAG.log('Attached CSRF headers for waze.com Dropbox endpoint');
        return headers;
      } catch (e) {
        ESM_DIAG.warn('Failed to build CSRF headers:', e);
        return {};
      }
    }


    // Export backup to Dropbox
    async function exportToDropbox() {
      try {
        ESM_DIAG.log('Starting Dropbox backup...');

        // Token ermitteln (kein OAuth)
        const accessToken = await authenticateDropbox();

        // Generate backup data (same as local export)
        const backup = {
          meta: {
            exportedAt: new Date().toISOString(),
            origin: location.origin,
            scriptVersion,
            backupType: 'dropbox'
          },
          localStorage: (() => {
            const out = {};
            try {
              const len = window.localStorage.length;
              for (let i = 0; i < len; i++) {
                const k = NativeStorage.key.call(window.localStorage, i);
                if (k != null) {
                  out[k] = NativeStorage.getItem.call(window.localStorage, k);
                }
              }
            } catch (e) {
              Object.keys(window.localStorage).forEach(k => {
                try { out[k] = window.localStorage.getItem(k); } catch (_) { out[k] = null; }
              });
            }
            return out;
          })(),
          sessionStorage: (() => {
            const out = {};
            try {
              const len = window.sessionStorage.length;
              for (let i = 0; i < len; i++) {
                const k = NativeStorage.key.call(window.sessionStorage, i);
                if (k != null) {
                  out[k] = NativeStorage.getItem.call(window.sessionStorage, k);
                }
              }
            } catch (e) {
              Object.keys(window.sessionStorage).forEach(k => {
                try { out[k] = window.sessionStorage.getItem(k); } catch (_) { out[k] = null; }
              });
            }
            return out;
          })(),
          cookies: document.cookie
            .split(';')
            .map(c => {
              const [name, ...rest] = c.trim().split('=');
              return { name, value: rest.join('=') };
            })
            .filter(c => c.name),
          indexedDB: await backupIndexedDB()
        };

        const backupData = JSON.stringify(backup, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `wme_settings_backup_${timestamp}.json`;
        const account = await getDropboxAccount(accessToken);
        const userFolder = `/WME_Backups/${account && account.account_id ? account.account_id : 'unknown'}`;

        // Upload to Dropbox
        let result;
        if (typeof GM_xmlhttpRequest === 'function') {
          // Use GM_xmlhttpRequest to bypass CSP and talk to Dropbox directly
          ESM_DIAG.log('Uploading backup to Dropbox via GM_xmlhttpRequest...');
          const gmRes = await gmFetch(`${DROPBOX_CONFIG.CONTENT_API_URL}/files/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Authorization': `Bearer ${accessToken}`,
              'Dropbox-API-Arg': JSON.stringify({
                path: `${userFolder}/${fileName}`,
                mode: 'add',
                autorename: true
              })
            },
            body: backupData
          }).catch(err => {
            ESM_DIAG.error('Dropbox upload (GM) failed:', err);
            throw new Error(`Network error during Dropbox upload (GM): ${err.message}`);
          });
          if (gmRes.status < 200 || gmRes.status >= 300) {
            const errorText = gmRes.responseText || 'Unknown error';
            ESM_DIAG.error('Dropbox upload (GM) failed:', gmRes.status, errorText);
            throw new Error(`Upload failed: ${gmRes.status} - ${errorText}`);
          }
          try {
            result = JSON.parse(gmRes.responseText);
          } catch (err) {
            ESM_DIAG.error('Failed to parse upload response (GM):', err);
            throw new Error(`Invalid response format from Dropbox upload (GM): ${err.message}`);
          }
        } else {
          // Fallback to same-origin proxy (requires CSP + CSRF compliance in WME)
          ESM_DIAG.log('Uploading backup to Dropbox via same-origin proxy...');
          const response = await fetch(`${DROPBOX_CONFIG.PROXY_BASE_URL}/files/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                path: `${userFolder}/${fileName}`,
                mode: 'add',
                autorename: true
              }),
              ...getCsrfHeaders()
            },
            credentials: 'include',
            body: backupData
          }).catch(err => {
            ESM_DIAG.error('Dropbox upload fetch failed:', err);
            throw new Error(`Network error during Dropbox upload: ${err.message}`);
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            ESM_DIAG.error('Dropbox upload failed:', response.status, response.statusText, errorText);
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
          }

          result = await response.json().catch(err => {
            ESM_DIAG.error('Failed to parse upload response:', err);
            throw new Error(`Invalid response format from Dropbox upload: ${err.message}`);
          });
        }
        ESM_DIAG.log('Backup uploaded to Dropbox:', result);

        alert(`${t('dropboxSaveSuccessPrefix')}\n\n${t('fileLabel')} ${fileName}\n${t('pathLabel')} /WME_Backups/${fileName}\n${t('sizeLabel')} ${Math.round(backupData.length / 1024)} ${t('kb')}`);

      } catch (error) {
        ESM_DIAG.error('Dropbox backup failed:', error);
        alert(`${t('dropboxSaveFailedPrefix')}\n\n${error.message}`);
      }
    }

    // Import backup from Dropbox
    // Import backup from Dropbox
    async function importFromDropbox() {
      try {
        ESM_DIAG.log('Starting Dropbox restore...');

        // Token ermitteln (kein OAuth)
        let listJson;
        const accessToken = await authenticateDropbox();
        const account = await getDropboxAccount(accessToken);
        const userFolder = `/WME_Backups/${account && account.account_id ? account.account_id : 'unknown'}`;
        if (typeof GM_xmlhttpRequest === 'function') {
          ESM_DIAG.log('Listing backup files from Dropbox via GM_xmlhttpRequest...');
          const gmRes = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL}/files/list_folder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: { path: userFolder, recursive: false }
          }).catch(err => {
            ESM_DIAG.error('Dropbox list (GM) failed:', err);
            throw new Error(`Network error during Dropbox file listing (GM): ${err.message}`);
          });
          if (gmRes.status < 200 || gmRes.status >= 300) {
            const errorText = gmRes.responseText || 'Unknown error';
            ESM_DIAG.error('Dropbox list (GM) failed:', gmRes.status, errorText);
            throw new Error(`List request failed: ${gmRes.status} - ${errorText}`);
          }
          try {
            listJson = JSON.parse(gmRes.responseText);
          } catch (err) {
            ESM_DIAG.error('Failed to parse list response (GM):', err);
            throw new Error(`Invalid response format from Dropbox list (GM): ${err.message}`);
          }
        } else {
          ESM_DIAG.log('Listing backup files from Dropbox via same-origin proxy...');
          const listUrl = `${DROPBOX_CONFIG.PROXY_BASE_URL}/files/list_folder`;
          const listResponse = await fetch(listUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getCsrfHeaders()
            },
            credentials: 'include',
            body: JSON.stringify({
              path: userFolder,
              recursive: false
            })
          }).catch(err => {
            ESM_DIAG.error('Dropbox list fetch failed:', err);
            throw new Error(`Network error during Dropbox file listing: ${err.message}`);
          });
          if (!listResponse.ok) {
            const errorText = await listResponse.text().catch(() => 'Unknown error');
            ESM_DIAG.error('Dropbox list request failed:', listResponse.status, listResponse.statusText, errorText);
            throw new Error(`List request failed: ${listResponse.status} ${listResponse.statusText} - ${errorText}`);
          }
          listJson = await listResponse.json().catch(err => {
            ESM_DIAG.error('Failed to parse list response:', err);
            throw new Error(`Invalid response format from Dropbox list: ${err.message}`);
          });
        }

        const files = listJson.entries ? listJson.entries.filter(entry =>
          entry['.tag'] === 'file' && entry.name.includes('wme_settings_backup')
        ) : [];

        if (!files || files.length === 0) {
          alert(t('dropboxNoBackups'));
          return;
        }

        // Show file selection dialog
        let fileList = 'Verfügbare Backups in Dropbox:\n\n';
        files.forEach((file, index) => {
          const date = new Date(file.client_modified).toLocaleString('de-DE');
          const size = file.size ? `${Math.round(file.size / 1024)} KB` : 'Unbekannt';
          fileList += `${index + 1}. ${file.name}\n   Erstellt: ${date}\n   Größe: ${size}\n\n`;
        });

        const selection = prompt(`${fileList}${t('restorePrompt')} (1-${files.length})`);
        if (!selection) return;

        const fileIndex = parseInt(selection) - 1;
        if (fileIndex < 0 || fileIndex >= files.length) {
          alert(t('invalidSelection'));
          return;
        }

        const selectedFile = files[fileIndex];

        // Download the selected file from Dropbox
        let backupData;
        if (typeof GM_xmlhttpRequest === 'function') {
          ESM_DIAG.log('Downloading backup file from Dropbox via GM_xmlhttpRequest:', selectedFile.name);
          const gmRes = await gmFetch(`${DROPBOX_CONFIG.CONTENT_API_URL}/files/download`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Dropbox-API-Arg': JSON.stringify({ path: selectedFile.path_lower })
            },
            responseType: 'text'
          }).catch(err => {
            ESM_DIAG.error('Dropbox download (GM) failed:', err);
            throw new Error(`Network error during Dropbox download (GM): ${err.message}`);
          });
          if (gmRes.status < 200 || gmRes.status >= 300) {
            const errorText = gmRes.responseText || 'Unknown error';
            ESM_DIAG.error('Dropbox download (GM) failed:', gmRes.status, errorText);
            throw new Error(`Download failed: ${gmRes.status} - ${errorText}`);
          }
          backupData = gmRes.responseText;
        } else {
          ESM_DIAG.log('Downloading backup file from Dropbox via same-origin proxy:', selectedFile.name);
          const downloadUrl = `${DROPBOX_CONFIG.PROXY_BASE_URL}/files/download`;
          const downloadResponse = await fetch(downloadUrl, {
            method: 'POST',
            headers: {
              'Dropbox-API-Arg': JSON.stringify({ path: selectedFile.path_lower }),
              ...getCsrfHeaders()
            },
            credentials: 'include'
          }).catch(err => {
            ESM_DIAG.error('Dropbox download fetch failed:', err);
            throw new Error(`Network error during Dropbox download: ${err.message}`);
          });
          if (!downloadResponse.ok) {
            const errorText = await downloadResponse.text().catch(() => 'Unknown error');
            ESM_DIAG.error('Dropbox download failed:', downloadResponse.status, downloadResponse.statusText, errorText);
            throw new Error(`Download failed: ${downloadResponse.status} ${downloadResponse.statusText} - ${errorText}`);
          }
          backupData = await downloadResponse.text().catch(err => {
            ESM_DIAG.error('Failed to read download response:', err);
            throw new Error(`Failed to read backup data: ${err.message}`);
          });
        }

        try {
          const parsed = JSON.parse(backupData);
          importedData = parsed;
          let keyValuePairs = [];
          const originOk = !(parsed && parsed.meta && parsed.meta.origin) || parsed.meta.origin === location.origin;

          if (parsed && typeof parsed === 'object' && (parsed.localStorage || parsed.sessionStorage || parsed.cookies || parsed.indexedDB)) {
            if (parsed.localStorage) {
              for (const [k, v] of Object.entries(parsed.localStorage)) {
                keyValuePairs.push([`localStorage:${k}`, v]);
              }
            }
            if (parsed.sessionStorage && originOk) {
              for (const [k, v] of Object.entries(parsed.sessionStorage)) {
                keyValuePairs.push([`sessionStorage:${k}`, v]);
              }
            }
            if (Array.isArray(parsed.cookies) && originOk) {
              for (const c of parsed.cookies) {
                if (c && c.name != null) {
                  keyValuePairs.push([`cookie:${c.name}`, (c && typeof c.value !== 'undefined' && c.value !== null) ? c.value : '']);
                }
              }
            }
            if (Array.isArray(parsed.indexedDB)) {
              for (const dbBackup of parsed.indexedDB) {
                const dbName = (dbBackup && dbBackup.name) ? dbBackup.name : undefined;
                if (!dbName || !Array.isArray(dbBackup.stores)) continue;
                for (const storeBackup of dbBackup.stores) {
                  const storeName = (storeBackup && storeBackup.name) ? storeBackup.name : undefined;
                  if (!storeName || !Array.isArray(storeBackup.entries)) continue;
                  for (const entry of storeBackup.entries) {
                    const keyStr = JSON.stringify(entry.key);
                    const keyLabel = `indexedDB:${dbName}/${storeName}:${keyStr}`;
                    const valueObj = {
                      db: dbName,
                      store: storeName,
                      key: entry.key,
                      value: entry.value,
                      keyPath: (storeBackup && typeof storeBackup.keyPath !== 'undefined') ? storeBackup.keyPath : null,
                      autoIncrement: !!storeBackup.autoIncrement,
                      indexes: Array.isArray(storeBackup.indexes) ? storeBackup.indexes : []
                    };
                    keyValuePairs.push([keyLabel, valueObj]);
                  }
                }
              }
            }
          } else {
            keyValuePairs = Object.entries(parsed);
          }

          displayKeyList(keyValuePairs);
          if (applyButton) applyButton.style.display = 'block';

          if (!originOk) {
            alert(t('foreignBackupHint'));
          } else {
            alert(`${t('dropboxLoadSuccessPrefix')}\n\n${t('fileLabel')} ${selectedFile.name}\n${t('foundEntriesLabel')} ${keyValuePairs.length}`);
          }

        } catch (parseError) {
          ESM_DIAG.error('Failed to parse backup data:', parseError);
          alert(t('invalidJson'));
        }

      } catch (error) {
        ESM_DIAG.error('Dropbox restore failed:', error);
        alert(`${t('dropboxRestoreFailedPrefix')}\n\n${error.message}`);
      }
    }

    // Export local storage data to a JSON file
    async function backupIndexedDB() {
      const result = [];
      let dbs = [];
      try {
        if (indexedDB.databases) {
          dbs = await indexedDB.databases();
        }
      } catch (e) {
        dbs = [];
      }
      for (const info of dbs) {
        if (!info || !info.name) continue;
        const name = info.name;
        const metaVersion = info.version;
        const backupForDb = await new Promise((resolve) => {
          const req = indexedDB.open(name);
          req.onerror = () => resolve(null);
          req.onupgradeneeded = () => {
            // No schema changes on read
          };
          req.onsuccess = () => {
            const db = req.result;
            const storeBackups = [];
            const stores = Array.from(db.objectStoreNames);
            const perStorePromises = stores.map((storeName) => new Promise((res) => {
              try {
                const tx = db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const keyPath = store.keyPath || null;
                const autoIncrement = store.autoIncrement || false;
                const indexes = Array.from(store.indexNames).map((indexName) => {
                  const idx = store.index(indexName);
                  return { name: indexName, keyPath: idx.keyPath, unique: !!idx.unique, multiEntry: !!idx.multiEntry };
                });
                const out = { name: storeName, keyPath, autoIncrement, indexes, entries: [] };
                if (store.getAll && store.getAllKeys) {
                  const keysReq = store.getAllKeys();
                  const valsReq = store.getAll();
                  keysReq.onsuccess = () => {
                    const keys = keysReq.result || [];
                    valsReq.onsuccess = () => {
                      const vals = valsReq.result || [];
                      const len = Math.max(keys.length, vals.length);
                      for (let i = 0; i < len; i++) {
                        out.entries.push({ key: keys[i], value: vals[i] });
                      }
                      storeBackups.push(out);
                      res(true);
                    };
                    valsReq.onerror = () => { storeBackups.push(out); res(true); };
                  };
                  keysReq.onerror = () => { storeBackups.push(out); res(true); };
                } else {
                  const request = store.openCursor();
                  request.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                      out.entries.push({ key: cursor.key, value: cursor.value });
                      cursor.continue();
                    } else {
                      storeBackups.push(out);
                      res(true);
                    }
                  };
                  request.onerror = () => { storeBackups.push(out); res(true); };
                }
              } catch (err) {
                res(true);
              }
            }));
            Promise.all(perStorePromises).then(() => {
              const backupObj = { name, version: db.version || metaVersion || null, stores: storeBackups };
              db.close();
              resolve(backupObj);
            });
          };
        });
        if (backupForDb) result.push(backupForDb);
      }
      return result;
    }
    async function exportLocalStorage() {
      const backup = {
        meta: {
          exportedAt: new Date().toISOString(),
          origin: location.origin,
          scriptVersion
        },
        // Robust: Determine keys and read values ​​via the native storage API
        localStorage: (() => {
          const out = {};
          try {
            const len = window.localStorage.length;
            for (let i = 0; i < len; i++) {
              const k = NativeStorage.key.call(window.localStorage, i);
              if (k != null) {
                out[k] = NativeStorage.getItem.call(window.localStorage, k);
              }
            }
          } catch (e) {
            // Fallback if another script has patched key()/getItem
            Object.keys(window.localStorage).forEach(k => {
              try { out[k] = window.localStorage.getItem(k); } catch (_) { out[k] = null; }
            });
          }
          return out;
        })(),
        sessionStorage: (() => {
          const out = {};
          try {
            const len = window.sessionStorage.length;
            for (let i = 0; i < len; i++) {
              const k = NativeStorage.key.call(window.sessionStorage, i);
              if (k != null) {
                out[k] = NativeStorage.getItem.call(window.sessionStorage, k);
              }
            }
          } catch (e) {
            Object.keys(window.sessionStorage).forEach(k => {
              try { out[k] = window.sessionStorage.getItem(k); } catch (_) { out[k] = null; }
            });
          }
          return out;
        })(),
        cookies: document.cookie
          .split(';')
          .map(c => {
            const [name, ...rest] = c.trim().split('=');
            return { name, value: rest.join('=') };
          })
          .filter(c => c.name),
        indexedDB: await backupIndexedDB()
      };
      const data = JSON.stringify(backup, null, 2);
      const file = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `wme_settings_backup_${ts}.json`;
      a.click();
    }

    // Import local storage data from a JSON file
    function importLocalStorage() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const parsed = JSON.parse(reader.result);
            importedData = parsed;
            let keyValuePairs = [];
            const originOk = !(parsed && parsed.meta && parsed.meta.origin) || parsed.meta.origin === location.origin;
            if (parsed && typeof parsed === 'object' && (parsed.localStorage || parsed.sessionStorage || parsed.cookies || parsed.indexedDB)) {
              if (parsed.localStorage) {
                for (const [k, v] of Object.entries(parsed.localStorage)) {
                  keyValuePairs.push([`localStorage:${k}`, v]);
                }
              }
              if (parsed.sessionStorage && originOk) {
                for (const [k, v] of Object.entries(parsed.sessionStorage)) {
                  keyValuePairs.push([`sessionStorage:${k}`, v]);
                }
              }
              if (Array.isArray(parsed.cookies) && originOk) {
                for (const c of parsed.cookies) {
                  if (c && c.name != null) {
                    keyValuePairs.push([`cookie:${c.name}`, (c && typeof c.value !== 'undefined' && c.value !== null) ? c.value : '']);
                  }
                }
              }
              if (Array.isArray(parsed.indexedDB)) {
                for (const dbBackup of parsed.indexedDB) {
                  const dbName = (dbBackup && dbBackup.name) ? dbBackup.name : undefined;
                  if (!dbName || !Array.isArray(dbBackup.stores)) continue;
                  for (const storeBackup of dbBackup.stores) {
                    const storeName = (storeBackup && storeBackup.name) ? storeBackup.name : undefined;
                    if (!storeName || !Array.isArray(storeBackup.entries)) continue;
                    for (const entry of storeBackup.entries) {
                      const keyStr = JSON.stringify(entry.key);
                      const keyLabel = `indexedDB:${dbName}/${storeName}:${keyStr}`;
                      const valueObj = {
                        db: dbName,
                        store: storeName,
                        key: entry.key,
                        value: entry.value,
                        keyPath: (storeBackup && typeof storeBackup.keyPath !== 'undefined') ? storeBackup.keyPath : null,
                        autoIncrement: !!storeBackup.autoIncrement,
                        indexes: Array.isArray(storeBackup.indexes) ? storeBackup.indexes : []
                      };
                      keyValuePairs.push([keyLabel, valueObj]);
                    }
                  }
                }
              }
            } else {
              keyValuePairs = Object.entries(parsed);
            }
            displayKeyList(keyValuePairs);
            if (applyButton) applyButton.style.display = 'block';
            if (!originOk) {
              alert(t('foreignBackupHint'));
            } else {
              alert(t('fileReadSuccess'));
            }
          } catch (error) {
            // Only display the error message if the import fails
            console.error(error);
            alert(t('invalidJson'));
          };
        };
        reader.onerror = function () {
          alert(t('fileReadError'));
        };
        reader.readAsText(file);
      };
      input.click();
    }

    // Display the list of keys for selection
    function displayKeyList(keyValuePairs) {
      const container = document.getElementById('key-list-container');
      container.innerHTML = ''; // Clear existing list

      // Select All button
      const selectAllButton = document.createElement('button');
    selectAllButton.textContent = t('selectAll');
      selectAllButton.addEventListener('click', function () {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
      });
      container.appendChild(selectAllButton);

      // Deselect All button
      const deselectAllButton = document.createElement('button');
    deselectAllButton.textContent = t('deselectAll');
      deselectAllButton.addEventListener('click', function () {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      });
      container.appendChild(deselectAllButton);

      container.appendChild(document.createElement('br'));

      // Key checkboxes
      keyValuePairs.forEach(([key, value]) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = key;
        checkbox.value = key;
        checkbox.checked = true;
        container.appendChild(checkbox);

        const label = document.createElement('label');
        label.htmlFor = key;
        label.textContent = key;
        container.appendChild(label);

        const hiddenValue = document.createElement('input');
        hiddenValue.type = 'hidden';
        hiddenValue.value = typeof value === 'string' ? value : JSON.stringify(value);
        container.appendChild(hiddenValue);

        container.appendChild(document.createElement('br'));
      });

      // Apply button
      applyButton = document.createElement('button');
    applyButton.textContent = t('apply');
      applyButton.addEventListener('click', applyImport);
      container.appendChild(applyButton);
    }

    // Apply the selected key-value pairs from the JSON file
    async function applyImport() {
      const selectedPairs = getSelectedPairs();
      if (selectedPairs.length === 0) {
        alert('No keys selected. Nothing to import.');
        return;
      }

      const { counts, failures } = await applyPairs(selectedPairs);

      const summary = `Import Completed\n- localStorage: ${counts.local}\n- sessionStorage: ${counts.session}\n- Cookies: ${counts.cookie}\n- IndexedDB: ${counts.idb}` + (failures.length ? `\n\nError (first ${Math.min(5, failures.length)}):\n${failures.slice(0,5).join('\n')}${failures.length > 5 ? `\n... (${failures.length - 5} more)` : ''}` : '');
      alert(summary);

      // Prompt to refresh the page
      if (confirm('The import was successful. Press ok to refresh page.')) {
        try {
          // Stash for post-reload reapply to prevent other scripts from overwriting restored values during startup
          sessionStorage.setItem(REAPPLY_STASH_KEY, JSON.stringify({ origin: location.origin, items: selectedPairs }));
        } catch (e) {
          // ignore stash errors
        }
        location.reload();
      }
    }

    // Get the selected key-value pairs
    function getSelectedPairs() {
      const checkboxes = document.querySelectorAll('#key-list-container input[type="checkbox"]');
      const selectedPairs = [];
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const key = checkbox.value;
          const valueStr = checkbox.nextElementSibling.nextElementSibling.value;
          // For IndexedDB entries, the value is JSON-encoded; for all other storages, the string must remain unchanged
          if (key.startsWith('indexedDB:')) {
            let parsedValue;
            try {
              parsedValue = JSON.parse(valueStr);
            } catch (e) {
              parsedValue = valueStr; // Fallback in case something unexpected happens
            }
            selectedPairs.push([key, parsedValue]);
          } else {
            selectedPairs.push([key, valueStr]);
          }
        }
      });
      return selectedPairs;
    }

    // Helper to apply selected pairs across storage types and IndexedDB (inside IIFE)
    async function applyPairs(selectedPairs) {
      const counts = { local: 0, session: 0, cookie: 0, idb: 0 };
      const failures = [];
      const sourceOrigin = (importedData && importedData.meta && importedData.meta.origin) ? importedData.meta.origin : undefined;
      const sameOrigin = !sourceOrigin || sourceOrigin === location.origin;

      for (const [fullKey, value] of selectedPairs) {
        try {
          const colonIdx = fullKey.indexOf(':');
          if (colonIdx < 0) {
            // Fallback: without type prefix we treat it as localStorage
            localStorage.setItem(fullKey, value);
            counts.local++;
            continue;
          }
          const type = fullKey.slice(0, colonIdx);
          const rest = fullKey.slice(colonIdx + 1);

          if (type === 'localStorage') {
            try {
              NativeStorage.setItem.call(window.localStorage, rest, value);
            } catch (_) {
              window.localStorage.setItem(rest, value);
            }
            counts.local++;
          } else if (type === 'sessionStorage') {
            if (!sameOrigin) {
              failures.push(`sessionStorage:${rest} skipped (Origin differs)`);
            } else {
              try {
                NativeStorage.setItem.call(window.sessionStorage, rest, value);
              } catch (_) {
                window.sessionStorage.setItem(rest, value);
              }
              counts.session++;
            }
          } else if (type === 'cookie') {
            if (!sameOrigin) {
              failures.push(`cookie:${rest} skipped (Origin differs)`);
            } else {
              // Set a session cookie (root path). An expiration date can be added if necessary.
              document.cookie = `${rest}=${value}; path=/`;
              counts.cookie++;
            }
          } else if (type === 'indexedDB') {
            try {
              // The value is already a complete record object (db, store, key, value, keyPath, autoIncrement, indexes)
              await writeIndexedDBRecord(value);
              counts.idb++;
            } catch (e) {
              failures.push(`indexedDB:${rest} -> ${e && e.message ? e.message : e}`);
            }
          } else {
            // Unknown type: treat as localStorage
            localStorage.setItem(rest, value);
            counts.local++;
          }
        } catch (err) {
          failures.push(`${fullKey} -> ${err && err.message ? err.message : err}`);
        }
      }

      return { counts, failures };
    }

    // Create and add the tab for the script (robust multi-path)
    function addScriptTab() {
      if (typeof window !== 'undefined' && window.uiMounted) {
        ESM_DIAG.log('UI already mounted, skipping addScriptTab');
        return;
      }

      const haveWUserscripts = typeof W !== 'undefined' && W && W.userscripts && typeof W.userscripts.registerSidebarTab === 'function';
      const haveWazeWrapTab = typeof WazeWrap !== 'undefined' && WazeWrap && WazeWrap.Interface && typeof WazeWrap.Interface.Tab === 'function';

      if (haveWUserscripts) {
        try {
          const scriptId = 'easy-storage-manager-tab';
          const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(scriptId);

          tabLabel.innerText = '💾';
          tabLabel.title = t('scriptTitle');

          const description = document.createElement('p');
          description.style.fontWeight = 'bold';
    description.textContent = t('scriptTitle');
          tabPane.appendChild(description);

const text = document.createElement('p');
text.textContent = t('importExportDesc');
          tabPane.appendChild(text);

const importButton = document.createElement('button');
importButton.textContent = t('importBackup');
importButton.title = t('importBackupTitle');
          importButton.addEventListener('click', function() {
            if (typeof window.importLocalStorage === 'function') {
              window.importLocalStorage();
            } else if (typeof importLocalStorage === 'function') {
              importLocalStorage();
            } else {
              try { if (window.ESM_DIAG) window.ESM_DIAG.error('Import function not available'); } catch (_) {}
              alert('Import function not available');
            }
          });
    // keep title already set
          importButton.style.backgroundImage = 'linear-gradient(180deg, #2196f3, #1976d2)';
          importButton.style.color = '#fff';
          importButton.style.border = 'none';
          importButton.style.borderRadius = '10px';
          importButton.style.padding = '8px 12px';
          importButton.style.fontWeight = '600';
          importButton.style.cursor = 'pointer';
          importButton.style.boxShadow = '0 3px 8px rgba(25, 118, 210, 0.35)';
          importButton.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
          importButton.style.whiteSpace = 'nowrap';
          importButton.style.display = 'inline-flex';
          importButton.style.alignItems = 'center';
          importButton.style.flex = '0 0 auto';
          importButton.style.gap = '4px';
          importButton.style.fontSize = '13px';
          importButton.style.lineHeight = '18px';
          importButton.style.width = 'auto';
          importButton.addEventListener('mouseenter', () => { importButton.style.filter = 'brightness(1.08)'; importButton.style.boxShadow = '0 6px 14px rgba(25,118,210,0.45)'; });
          importButton.addEventListener('mouseleave', () => { importButton.style.filter = ''; importButton.style.boxShadow = '0 3px 8px rgba(25,118,210,0.35)'; });

const exportButton = document.createElement('button');
exportButton.textContent = t('exportBackup');
exportButton.title = t('exportBackupTitle');
          exportButton.addEventListener('click', function() {
            if (typeof window.exportLocalStorage === 'function') {
              window.exportLocalStorage();
            } else if (typeof exportLocalStorage === 'function') {
              exportLocalStorage();
            } else {
              try { if (window.ESM_DIAG) window.ESM_DIAG.error('Export function not available'); } catch (_) {}
              alert('Export function not available');
            }
          });
    // keep title already set
          exportButton.style.backgroundImage = 'linear-gradient(180deg, #43a047, #2e7d32)';
          exportButton.style.color = '#fff';
          exportButton.style.border = 'none';
          exportButton.style.borderRadius = '10px';
          exportButton.style.padding = '8px 12px';
          exportButton.style.fontWeight = '600';
          exportButton.style.cursor = 'pointer';
          exportButton.style.boxShadow = '0 3px 8px rgba(46, 125, 50, 0.35)';
          exportButton.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
          exportButton.style.whiteSpace = 'nowrap';
          exportButton.style.display = 'inline-flex';
          exportButton.style.alignItems = 'center';
          exportButton.style.flex = '0 0 auto';
          exportButton.style.gap = '4px';
          exportButton.style.fontSize = '13px';
          exportButton.style.lineHeight = '18px';
          exportButton.style.width = 'auto';
          exportButton.addEventListener('mouseenter', () => { exportButton.style.filter = 'brightness(1.08)'; exportButton.style.boxShadow = '0 6px 14px rgba(46,125,50,0.45)'; });
          exportButton.addEventListener('mouseleave', () => { exportButton.style.filter = ''; exportButton.style.boxShadow = '0 3px 8px rgba(46,125,50,0.35)'; });

          const buttonContainer = document.createElement('div');
          buttonContainer.style.display = 'flex';
          buttonContainer.style.gap = '8px';
          buttonContainer.style.marginTop = '8px';
          buttonContainer.style.justifyContent = 'center';
          buttonContainer.style.alignItems = 'center';
          buttonContainer.style.width = '100%';
          // Reihenfolge: zuerst Lokal Speichern (Export), dann Wiederherstellen (Import)
          exportButton.style.order = '1';
          importButton.style.order = '2';
          buttonContainer.appendChild(exportButton);
          buttonContainer.appendChild(importButton);
          tabPane.appendChild(buttonContainer);

          // Dropbox Cloud Backup Buttons
const cloudBackupButton = document.createElement('button');
cloudBackupButton.textContent = t('cloudBackup');
cloudBackupButton.title = t('cloudBackupTitle');
          cloudBackupButton.addEventListener('click', function() {
            if (typeof exportToDropbox === 'function') {
          exportToDropbox();
            } else {
try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox export function not available'); } catch (_) {}
alert(t('dropboxExportUnavailable'));
            }
          });
    // title already set
          cloudBackupButton.style.backgroundImage = 'linear-gradient(180deg, #ff9800, #f57c00)';
          cloudBackupButton.style.color = '#fff';
          cloudBackupButton.style.border = 'none';
          cloudBackupButton.style.borderRadius = '10px';
          cloudBackupButton.style.padding = '8px 12px';
          cloudBackupButton.style.fontWeight = '600';
          cloudBackupButton.style.cursor = 'pointer';
          cloudBackupButton.style.boxShadow = '0 3px 8px rgba(245, 124, 0, 0.35)';
          cloudBackupButton.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
          cloudBackupButton.style.whiteSpace = 'nowrap';
          cloudBackupButton.style.display = 'inline-flex';
          cloudBackupButton.style.alignItems = 'center';
          cloudBackupButton.style.flex = '0 0 auto';
          cloudBackupButton.style.gap = '4px';
          cloudBackupButton.style.fontSize = '13px';
          cloudBackupButton.style.lineHeight = '18px';
          cloudBackupButton.style.width = 'auto';
          cloudBackupButton.addEventListener('mouseenter', () => { cloudBackupButton.style.filter = 'brightness(1.08)'; cloudBackupButton.style.boxShadow = '0 6px 14px rgba(245,124,0,0.45)'; });
          cloudBackupButton.addEventListener('mouseleave', () => { cloudBackupButton.style.filter = ''; cloudBackupButton.style.boxShadow = '0 3px 8px rgba(245,124,0,0.35)'; });

const cloudRestoreButton = document.createElement('button');
cloudRestoreButton.textContent = t('cloudRestore');
cloudRestoreButton.title = t('cloudRestoreTitle');
          cloudRestoreButton.addEventListener('click', function() {
            if (typeof importFromDropbox === 'function') {
          importFromDropbox();
            } else {
try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox restore function not available'); } catch (_) {}
alert(t('dropboxImportUnavailable'));
            }
          });
    // title already set
          cloudRestoreButton.style.backgroundImage = 'linear-gradient(180deg, #9c27b0, #7b1fa2)';
          cloudRestoreButton.style.color = '#fff';
          cloudRestoreButton.style.border = 'none';
          cloudRestoreButton.style.borderRadius = '10px';
          cloudRestoreButton.style.padding = '8px 12px';
          cloudRestoreButton.style.fontWeight = '600';
          cloudRestoreButton.style.cursor = 'pointer';
          cloudRestoreButton.style.boxShadow = '0 3px 8px rgba(123, 31, 162, 0.35)';
          cloudRestoreButton.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
          cloudRestoreButton.style.whiteSpace = 'nowrap';
          cloudRestoreButton.style.display = 'inline-flex';
          cloudRestoreButton.style.alignItems = 'center';
          cloudRestoreButton.style.flex = '0 0 auto';
          cloudRestoreButton.style.gap = '4px';
          cloudRestoreButton.style.fontSize = '13px';
          cloudRestoreButton.style.lineHeight = '18px';
          cloudRestoreButton.style.width = 'auto';
          cloudRestoreButton.addEventListener('mouseenter', () => { cloudRestoreButton.style.filter = 'brightness(1.08)'; cloudRestoreButton.style.boxShadow = '0 6px 14px rgba(123,31,162,0.45)'; });
          cloudRestoreButton.addEventListener('mouseleave', () => { cloudRestoreButton.style.filter = ''; cloudRestoreButton.style.boxShadow = '0 3px 8px rgba(123,31,162,0.35)'; });

          const cloudButtonContainer = document.createElement('div');
          cloudButtonContainer.style.display = 'flex';
          cloudButtonContainer.style.gap = '8px';
          cloudButtonContainer.style.marginTop = '8px';
          cloudButtonContainer.style.justifyContent = 'center';
          cloudButtonContainer.style.alignItems = 'center';
          cloudButtonContainer.style.width = '100%';
          cloudButtonContainer.appendChild(cloudBackupButton);
          cloudButtonContainer.appendChild(cloudRestoreButton);
          tabPane.appendChild(cloudButtonContainer);

          // Dropbox-Hilfepanel direkt im Skripte-Tab anzeigen
          try { injectDropboxHelpPanel(tabPane); } catch (_) {}

          const keyListContainer = document.createElement('div');
          keyListContainer.id = 'key-list-container';
          keyListContainer.style.marginTop = '10px';
          tabPane.appendChild(keyListContainer);

          if (typeof window !== 'undefined') window.uiMounted = true;
          ESM_DIAG.log('UI mounted via W.userscripts.registerSidebarTab');
          return;
        } catch (e) {
          ESM_DIAG.error('Failed to mount via W.userscripts, falling back', e);
        }
      }

      if (haveWazeWrapTab) {
        try {
          const html = `
            <div id="esm-tab">
              <p id="esm-title" style="font-weight:700;margin:0 0 6px 0;">${t('scriptTitle')}</p>
              <p style="margin:0 0 8px 0;">${t('importExportDesc')}</p>
              <div style="display:flex;gap:8px;margin-bottom:8px;justify-content:center;align-items:center;width:100%;">
                <button id="esm-export">${t('exportBackup')}</button>
                <button id="esm-import">${t('importBackup')}</button>
              </div>
              <div style="display:flex;gap:8px;margin-bottom:8px;justify-content:center;align-items:center;width:100%;">
                <button id="esm-cloud-backup">${t('cloudBackup')}</button>
                <button id="esm-cloud-restore">${t('cloudRestore')}</button>
              </div>
              <div id="key-list-container" style="border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px;max-height:320px;overflow:auto;"></div>
            </div>`;
          new WazeWrap.Interface.Tab(t('scriptTitle'), html, () => {
const importBtn = document.getElementById('esm-import');
if (importBtn) { importBtn.textContent = t('importBackup'); importBtn.title = t('importBackupTitle'); }
const exportBtn = document.getElementById('esm-export');
if (exportBtn) { exportBtn.textContent = t('exportBackup'); exportBtn.title = t('exportBackupTitle'); }
const cloudBackupBtn = document.getElementById('esm-cloud-backup');
if (cloudBackupBtn) { cloudBackupBtn.textContent = t('cloudBackup'); cloudBackupBtn.title = t('cloudBackupTitle'); }
const cloudRestoreBtn = document.getElementById('esm-cloud-restore');
if (cloudRestoreBtn) { cloudRestoreBtn.textContent = t('cloudRestore'); cloudRestoreBtn.title = t('cloudRestoreTitle'); }
            if (cloudBackupBtn) cloudBackupBtn.textContent = t('cloudBackup');
            if (cloudRestoreBtn) cloudRestoreBtn.textContent = t('cloudRestore');

            if (importBtn) importBtn.addEventListener('click', function() { if (typeof window.importLocalStorage === 'function') { window.importLocalStorage(); } else { try { if (window.ESM_DIAG) window.ESM_DIAG.error('Import function not available'); } catch (_) {} alert(t('importFunctionUnavailable')); } });
            if (exportBtn) exportBtn.addEventListener('click', function() { if (typeof window.exportLocalStorage === 'function') { window.exportLocalStorage(); } else { try { if (window.ESM_DIAG) window.ESM_DIAG.error('Export function not available'); } catch (_) {} alert(t('exportFunctionUnavailable')); } });
            if (cloudBackupBtn) cloudBackupBtn.addEventListener('click', function() { if (typeof exportToDropbox === 'function') { exportToDropbox(); } else { try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox export function not available'); } catch (_) {} alert(t('dropboxExportUnavailable')); } });
            if (cloudRestoreBtn) cloudRestoreBtn.addEventListener('click', function() { if (typeof importFromDropbox === 'function') { importFromDropbox(); } else { try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox import function not available'); } catch (_) {} alert(t('dropboxImportUnavailable')); } });
            // Reihenfolge im Flex-Container: zuerst Lokal Speichern (Export), dann Wiederherstellen (Import)
            if (typeof exportBtn !== 'undefined' && exportBtn) exportBtn.style.order = '1';
            if (typeof importBtn !== 'undefined' && importBtn) importBtn.style.order = '2';

            // Apply compact styles for WazeWrap tab buttons
            if (importBtn) {
              importBtn.style.backgroundImage = 'linear-gradient(180deg, #2196f3, #1976d2)';
              importBtn.style.color = '#fff';
              importBtn.style.border = 'none';
              importBtn.style.borderRadius = '10px';
              importBtn.style.padding = '8px 12px';
              importBtn.style.fontWeight = '600';
              importBtn.style.cursor = 'pointer';
              importBtn.style.boxShadow = '0 3px 8px rgba(25, 118, 210, 0.35)';
              importBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
              importBtn.style.whiteSpace = 'nowrap';
              importBtn.style.display = 'inline-flex';
              importBtn.style.alignItems = 'center';
              importBtn.style.gap = '4px';
              importBtn.style.fontSize = '13px';
              importBtn.style.lineHeight = '18px';
            }
            if (exportBtn) {
              exportBtn.style.backgroundImage = 'linear-gradient(180deg, #43a047, #2e7d32)';
              exportBtn.style.color = '#fff';
              exportBtn.style.border = 'none';
              exportBtn.style.borderRadius = '10px';
              exportBtn.style.padding = '8px 12px';
              exportBtn.style.fontWeight = '600';
              exportBtn.style.cursor = 'pointer';
              exportBtn.style.boxShadow = '0 3px 8px rgba(46, 125, 50, 0.35)';
              exportBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
              exportBtn.style.whiteSpace = 'nowrap';
              exportBtn.style.display = 'inline-flex';
              exportBtn.style.alignItems = 'center';
              exportBtn.style.gap = '4px';
              exportBtn.style.fontSize = '13px';
              exportBtn.style.lineHeight = '18px';
            }
            if (cloudBackupBtn) {
              cloudBackupBtn.style.backgroundImage = 'linear-gradient(180deg, #ff9800, #f57c00)';
              cloudBackupBtn.style.color = '#fff';
              cloudBackupBtn.style.border = 'none';
              cloudBackupBtn.style.borderRadius = '10px';
              cloudBackupBtn.style.padding = '8px 12px';
              cloudBackupBtn.style.fontWeight = '600';
              cloudBackupBtn.style.cursor = 'pointer';
              cloudBackupBtn.style.boxShadow = '0 3px 8px rgba(245, 124, 0, 0.35)';
              cloudBackupBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
              cloudBackupBtn.style.whiteSpace = 'nowrap';
              cloudBackupBtn.style.display = 'inline-flex';
              cloudBackupBtn.style.alignItems = 'center';
              cloudBackupBtn.style.gap = '4px';
              cloudBackupBtn.style.fontSize = '13px';
              cloudBackupBtn.style.lineHeight = '18px';
    cloudBackupBtn.title = t('cloudBackupTitle');
            }
            if (cloudRestoreBtn) {
              cloudRestoreBtn.style.backgroundImage = 'linear-gradient(180deg, #9c27b0, #7b1fa2)';
              cloudRestoreBtn.style.color = '#fff';
              cloudRestoreBtn.style.border = 'none';
              cloudRestoreBtn.style.borderRadius = '10px';
              cloudRestoreBtn.style.padding = '8px 12px';
              cloudRestoreBtn.style.fontWeight = '600';
              cloudRestoreBtn.style.cursor = 'pointer';
              cloudRestoreBtn.style.boxShadow = '0 3px 8px rgba(123, 31, 162, 0.35)';
              cloudRestoreBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
              cloudRestoreBtn.style.whiteSpace = 'nowrap';
              cloudRestoreBtn.style.display = 'inline-flex';
              cloudRestoreBtn.style.alignItems = 'center';
              cloudRestoreBtn.style.gap = '4px';
              cloudRestoreBtn.style.fontSize = '13px';
              cloudRestoreBtn.style.lineHeight = '18px';
    cloudRestoreBtn.title = t('cloudRestoreTitle');
            }
            if (typeof window !== 'undefined') window.uiMounted = true;
            ESM_DIAG.log('UI mounted via WazeWrap.Interface.Tab');
            // Dropbox-Hilfepanel im WazeWrap-Tab platzieren
            try { const tabRoot = document.getElementById('esm-tab') || document.body; injectDropboxHelpPanel(tabRoot); } catch (_) {}
          });
          return;
        } catch (e) {
          ESM_DIAG.error('Failed to mount via WazeWrap.Interface.Tab, falling back', e);
        }
      }

      // Final fallback: floating panel
      createFallbackPanel();
    }

     // Initialize the script
  function initialize() {
    ESM_DIAG.log('initialize() called. document.readyState=', document.readyState);

    // Check if we're in a Waze environment
    const isWazeEnvironment = window.location.hostname.includes('waze.com');

    if (isWazeEnvironment && typeof W !== 'undefined' && W && W.userscripts && W.userscripts.state && W.userscripts.state.isReady) {
      ESM_DIAG.log('W.userscripts.state.isReady is true. Initializing UI.');
      addScriptTab();
      showScriptUpdate();
      reapplyAfterReload();
    } else if (isWazeEnvironment) {
      ESM_DIAG.log('Waiting for wme-ready event...');
      document.addEventListener('wme-ready', function () {
        ESM_DIAG.log('wme-ready event received. Initializing UI.');
        addScriptTab();
        showScriptUpdate();
        reapplyAfterReload();
      }, { once: true });
    } else {
      // Non-Waze environment - use fallback panel directly
      ESM_DIAG.log('Non-Waze environment detected. Using fallback panel.');
      createFallbackPanel();
      reapplyAfterReload();
    }
  }

  // Call the initialize function
  initialize();

  // Show script update notification
  function showScriptUpdate() {
    if (typeof WazeWrap !== 'undefined' && WazeWrap && WazeWrap.Interface && typeof WazeWrap.Interface.ShowScriptUpdate === 'function') {
      WazeWrap.Interface.ShowScriptUpdate(
        t('scriptTitle'),
        (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) ? GM_info.script.version : scriptVersion,
        updateMessage,
        'https://greasyfork.org/en/scripts/466806-easy-storage-manager',
        'https://www.waze.com/forum/viewtopic.php?t=382966'
      );
    } else {
      ESM_DIAG.warn('ShowScriptUpdate skipped: WazeWrap.Interface.ShowScriptUpdate not available yet.');
    }
  }

  // Reapply after reload if a stash exists (inside IIFE)
  function reapplyAfterReload() {
    let stashStr = null;
    try {
      stashStr = sessionStorage.getItem(REAPPLY_STASH_KEY);
    } catch (e) {
      stashStr = null;
    }
    if (!stashStr) { ESM_DIAG.log('No reapply stash found; skipping.'); return; }
    sessionStorage.removeItem(REAPPLY_STASH_KEY);
    ESM_DIAG.log('Reapply stash found. Parsing...');
    try {
      const stash = JSON.parse(stashStr);
      ESM_DIAG.log('Parsed stash items count:', Array.isArray(stash.items) ? stash.items.length : 0);
      if (!(stash && stash.origin === location.origin && Array.isArray(stash.items) && stash.items.length)) { ESM_DIAG.warn('Stash invalid or empty; skipping.'); return; }

      applyPairs(stash.items).then(({ counts, failures }) => {
        ESM_DIAG.log('Initial applyPairs after reload complete.', counts, failures.slice(0, 3));
        const summary = `Restored after reload executed.\n- localStorage: ${counts.local}\n- sessionStorage: ${counts.session}\n- Cookies: ${counts.cookie}\n- IndexedDB: ${counts.idb}` + (failures.length ? `\n\nError (first ${Math.min(5, failures.length)}):\n${failures.slice(0,5).join('\n')}${failures.length > 5 ? `\n... (${failures.length - 5} more)` : ''}` : '');
        try { alert(summary); } catch (e) {}
      }).catch((ex) => { ESM_DIAG.error('applyPairs after reload failed:', ex); });

      const desiredLocal = new Map();
      for (const [fullKey, value] of stash.items) {
        const idx = fullKey.indexOf(':');
        const type = idx < 0 ? 'localStorage' : fullKey.slice(0, idx);
        const name = idx < 0 ? fullKey : fullKey.slice(idx + 1);
        if (type === 'localStorage') {
          desiredLocal.set(name, value);
        }
      }
      ESM_DIAG.log('Desired localStorage keys:', Array.from(desiredLocal.keys()));

      const scheduleRepairs = (delaysMs) => {
        ESM_DIAG.log('Scheduling repairs with delays:', delaysMs);
        delaysMs.forEach(ms => {
          setTimeout(() => {
            const repairs = [];
            desiredLocal.forEach((desired, name) => {
              try {
                const current = NativeStorage.getItem.call(window.localStorage, name);
                if (current !== desired) {
                  ESM_DIAG.log('Repair needed for key:', name, 'current=', current, 'desired=', desired);
                  repairs.push([`localStorage:${name}`, desired]);
                } else {
                  ESM_DIAG.log('Key already correct:', name);
                }
              } catch (e) {
                ESM_DIAG.warn('Error reading key during repair check:', name, e);
              }
            });
            if (repairs.length) {
              ESM_DIAG.log('Applying repairs count:', repairs.length);
              applyPairs(repairs).catch((ex) => { ESM_DIAG.error('applyPairs repairs failed:', ex); });
            }
          }, ms);
        });
      };

      const originalSetItem = localStorage.setItem.bind(localStorage);
      const originalGetItem = localStorage.getItem.bind(localStorage);
      const originalRemoveItem = localStorage.removeItem.bind(localStorage);
      const originalClear = localStorage.clear.bind(localStorage);
      const originalProtoSetItem = Storage.prototype.setItem;
      const originalProtoGetItem = Storage.prototype.getItem;
      const originalProtoRemoveItem = Storage.prototype.removeItem;
      const originalProtoClear = Storage.prototype.clear;
      const protectMs = 120000; // 120s protection
      const protectUntil = Date.now() + protectMs;
      const protectedKeys = new Set(Array.from(desiredLocal.keys()));

      try {
        localStorage.setItem = function (key, value) {
          if (protectedKeys.has(key) && Date.now() < protectUntil) {
            ESM_DIAG.log('Protected setItem intercepted for key:', key);
            try { return NativeStorage.setItem.call(window.localStorage, key, desiredLocal.get(key)); } catch (e) { return; }
          }
          return originalSetItem(key, value);
        };

        localStorage.getItem = function (key) {
          if (protectedKeys.has(key) && Date.now() < protectUntil) {
            const desired = desiredLocal.get(key);
            ESM_DIAG.log('Protected getItem intercepted for key:', key);
            return typeof desired === 'string' ? desired : desired;
          }
          return NativeStorage.getItem.call(window.localStorage, key);
        };

        localStorage.removeItem = function (key) {
          if (protectedKeys.has(key) && Date.now() < protectUntil) {
            ESM_DIAG.log('Protected removeItem blocked for key:', key);
            try { return NativeStorage.setItem.call(window.localStorage, key, desiredLocal.get(key)); } catch (_) { return; }
          }
          return originalRemoveItem(key);
        };

        localStorage.clear = function () {
          if (Date.now() < protectUntil && protectedKeys.size) {
            ESM_DIAG.log('Protected clear intercepted; preserving keys:', Array.from(protectedKeys));
            try {
              const len = window.localStorage.length;
              const toRemove = [];
              for (let i = 0; i < len; i++) {
                const k = NativeStorage.key.call(window.localStorage, i);
                if (k != null && !protectedKeys.has(k)) toRemove.push(k);
              }
              toRemove.forEach(k => { try { originalRemoveItem(k); } catch (_) {} });
              return;
            } catch (_) { /* fallback */ }
          }
          return originalClear();
        };

        Storage.prototype.setItem = function (key, value) {
          const isLocal = this === window.localStorage || this === localStorage;
          if (isLocal && protectedKeys.has(key) && Date.now() < protectUntil) {
            ESM_DIAG.log('Prototype setItem intercepted for key:', key);
            try { return NativeStorage.setItem.call(window.localStorage, key, desiredLocal.get(key)); } catch (e) { return; }
          }
          return originalProtoSetItem.call(this, key, value);
        };

        Storage.prototype.getItem = function (key) {
          const isLocal = this === window.localStorage || this === localStorage;
          if (isLocal && protectedKeys.has(key) && Date.now() < protectUntil) {
            const desired = desiredLocal.get(key);
            ESM_DIAG.log('Prototype getItem intercepted for key:', key);
            return typeof desired === 'string' ? desired : desired;
          }
          return originalProtoGetItem.call(this, key);
        };

        Storage.prototype.removeItem = function (key) {
          const isLocal = this === window.localStorage || this === localStorage;
          if (isLocal && protectedKeys.has(key) && Date.now() < protectUntil) {
            ESM_DIAG.log('Prototype removeItem blocked for key:', key);
            try { return NativeStorage.setItem.call(window.localStorage, key, desiredLocal.get(key)); } catch (_) { return; }
          }
          return originalProtoRemoveItem.call(this, key);
        };

        Storage.prototype.clear = function () {
          const isLocal = this === window.localStorage || this === localStorage;
          if (isLocal && Date.now() < protectUntil && protectedKeys.size) {
            ESM_DIAG.log('Prototype clear intercepted; preserving keys:', Array.from(protectedKeys));
            try {
              const len = window.localStorage.length;
              const toRemove = [];
              for (let i = 0; i < len; i++) {
                const k = NativeStorage.key.call(window.localStorage, i);
                if (k != null && !protectedKeys.has(k)) toRemove.push(k);
              }
              toRemove.forEach(k => { try { originalRemoveItem(k); } catch (_) {} });
              return;
            } catch (_) { /* fallback */ }
          }
          return originalProtoClear.call(this);
        };

        ESM_DIAG.log('Protection overrides applied for keys:', Array.from(protectedKeys), 'until', new Date(protectUntil).toISOString());
      } catch (ex) {
        ESM_DIAG.error('Error applying protection overrides:', ex);
      }

      scheduleRepairs([500, 2000, 5000, 10000, 20000, 30000, 45000, 60000, 90000, 120000]);
    } catch (ex) {
      ESM_DIAG.error('Error parsing stash or scheduling repairs:', ex);
    }
  }

  // Export key functions to window for fallback usage
  if (typeof window !== 'undefined') {
    window.exportLocalStorage = exportLocalStorage;
    window.importLocalStorage = importLocalStorage;
  }

  // Properly close IIFE
  })();

  // Duplicate reapplyAfterReload removed; the IIFE version is used.

  async function writeIndexedDBRecord(record) {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(record.db);
      openReq.onerror = () => reject(openReq.error);
      openReq.onupgradeneeded = () => { /* no-op */ };
      openReq.onsuccess = () => {
        const db = openReq.result;
        const proceedWrite = () => {
          try {
            const tx = db.transaction([record.store], 'readwrite');
            const st = tx.objectStore(record.store);
            let req;
            if (st.keyPath) {
              req = st.put(record.value);
            } else {
              req = st.put(record.value, record.key);
            }
            req.onerror = () => reject(req.error);
            tx.oncomplete = () => { db.close(); resolve(true); };
            tx.onerror = () => reject(tx.error);
          } catch (err) {
            reject(err);
          }
        };
        if (!db.objectStoreNames.contains(record.store)) {
          db.close();
          const bump = indexedDB.open(record.db, (db.version || 1) + 1);
          bump.onerror = () => reject(bump.error);
          bump.onupgradeneeded = (evt) => {
            const db2 = evt.target.result;
            if (!db2.objectStoreNames.contains(record.store)) {
              const opts = {};
              if (record.keyPath) opts.keyPath = record.keyPath;
              if (record.autoIncrement) opts.autoIncrement = true;
              const newStore = db2.createObjectStore(record.store, opts);
              if (Array.isArray(record.indexes)) {
                record.indexes.forEach(ix => {
                  try {
                    newStore.createIndex(ix.name, ix.keyPath, { unique: !!ix.unique, multiEntry: !!ix.multiEntry });
                  } catch (e) { /* ignore invalid index definitions */ }
                });
              }
            }
          };
          bump.onsuccess = () => {
            const db2 = bump.result;
            try {
              const tx = db2.transaction([record.store], 'readwrite');
              const st = tx.objectStore(record.store);
              let req;
              if (st.keyPath) {
                req = st.put(record.value);
              } else {
                req = st.put(record.value, record.key);
              }
              req.onerror = () => reject(req.error);
              tx.oncomplete = () => { db2.close(); resolve(true); };
              tx.onerror = () => reject(tx.error);
            } catch (err) {
              reject(err);
            }
          };
        } else {
          proceedWrite();
        }
      };
    });
  }

  // Duplicate applyPairs removed; using the in-IIFE implementation.
  let uiMounted = false;
  function ensureDOMReady(cb) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      try { cb(); } catch (e) { if (window.ESM_DIAG) window.ESM_DIAG.error('ensureDOMReady callback error', e); }
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        try { cb(); } catch (e) { if (window.ESM_DIAG) window.ESM_DIAG.error('ensureDOMReady DOMContentLoaded error', e); }
      }, { once: true });
    }
  }

  function createFallbackPanel() {
    ensureDOMReady(() => {
      if (window.uiMounted) return;
      const panel = document.createElement('div');
      panel.id = 'esm-fallback-panel';
      panel.style.position = 'fixed';
      panel.style.top = '72px';
      panel.style.right = '12px';
      panel.style.zIndex = '999999';
      panel.style.background = 'rgba(30, 41, 59, 0.93)';
      panel.style.backdropFilter = 'blur(4px)';
      panel.style.border = '1px solid rgba(255,255,255,0.12)';
      panel.style.borderRadius = '12px';
      panel.style.padding = '12px 14px';
      panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35)';
      panel.style.color = '#eaeef5';
      panel.style.maxWidth = '420px';
      panel.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif';

      const title = document.createElement('div');
    title.textContent = t('scriptTitle');
      title.style.fontWeight = '700';
      title.style.marginBottom = '6px';
      title.style.letterSpacing = '0.2px';
      panel.appendChild(title);

      const desc = document.createElement('div');
    desc.textContent = t('fallbackDesc');
      desc.style.fontSize = '12px';
      desc.style.opacity = '0.9';
      desc.style.marginBottom = '8px';
      panel.appendChild(desc);

      const btnRow = document.createElement('div');
      btnRow.className = 'btnRow';
      btnRow.style.display = 'grid';
      btnRow.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
      btnRow.style.gap = '8px';
      btnRow.style.marginBottom = '10px';
      btnRow.style.alignItems = 'stretch';
      btnRow.style.width = '100%';
      btnRow.style.boxSizing = 'border-box';
      const importBtn = document.createElement('button');
      importBtn.id = 'esm-import-btn';
    importBtn.textContent = t('importBackup');
    importBtn.title = t('importBackupTitle');
      importBtn.style.backgroundImage = 'linear-gradient(180deg, #2196f3, #1976d2)';
      importBtn.style.color = '#fff';
      importBtn.style.border = 'none';
      importBtn.style.borderRadius = '10px';
      importBtn.style.padding = '8px 12px';
      importBtn.style.fontWeight = '600';
      importBtn.style.cursor = 'pointer';
      importBtn.style.boxShadow = '0 3px 8px rgba(25, 118, 210, 0.35)';
      importBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
      importBtn.style.whiteSpace = 'nowrap';
      importBtn.style.display = 'inline-flex';
      importBtn.style.alignItems = 'center';
      importBtn.style.gap = '4px';
      importBtn.style.fontSize = '13px';
      importBtn.style.lineHeight = '18px';
      importBtn.style.width = '100%';
      importBtn.style.flex = '1 1 0';
      importBtn.style.minWidth = '0';
      importBtn.style.margin = '0';
      importBtn.addEventListener('mouseenter', () => { importBtn.style.filter = 'brightness(1.08)'; importBtn.style.boxShadow = '0 6px 14px rgba(25,118,210,0.45)'; });
      importBtn.addEventListener('mouseleave', () => { importBtn.style.filter = ''; importBtn.style.boxShadow = '0 3px 8px rgba(25,118,210,0.35)'; });
      importBtn.addEventListener('click', function() {
        if (typeof window.importLocalStorage === 'function') {
          window.importLocalStorage();
        } else {
          try { if (window.ESM_DIAG) window.ESM_DIAG.error('Import function not available'); } catch (_) {}
          alert(t('importFunctionUnavailable'));
        }
      });

      const exportBtn = document.createElement('button');
      exportBtn.id = 'esm-export-btn';
    exportBtn.textContent = t('exportBackup');
    exportBtn.title = t('exportBackupTitle');
      exportBtn.style.backgroundImage = 'linear-gradient(180deg, #43a047, #2e7d32)';
      exportBtn.style.color = '#fff';
      exportBtn.style.border = 'none';
      exportBtn.style.borderRadius = '10px';
      exportBtn.style.padding = '8px 12px';
      exportBtn.style.fontWeight = '600';
      exportBtn.style.cursor = 'pointer';
      exportBtn.style.boxShadow = '0 3px 8px rgba(46, 125, 50, 0.35)';
      exportBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
      exportBtn.style.whiteSpace = 'nowrap';
      exportBtn.style.display = 'inline-flex';
      exportBtn.style.alignItems = 'center';
      exportBtn.style.gap = '4px';
      exportBtn.style.fontSize = '13px';
      exportBtn.style.lineHeight = '18px';
      exportBtn.style.width = '100%';
      exportBtn.style.flex = '1 1 0';
      exportBtn.style.minWidth = '0';
      exportBtn.style.margin = '0';
      exportBtn.addEventListener('mouseenter', () => { exportBtn.style.filter = 'brightness(1.08)'; exportBtn.style.boxShadow = '0 6px 14px rgba(46,125,50,0.45)'; });
      exportBtn.addEventListener('mouseleave', () => { exportBtn.style.filter = ''; exportBtn.style.boxShadow = '0 3px 8px rgba(46,125,50,0.35)'; });
      exportBtn.addEventListener('click', function() {
        if (typeof window.exportLocalStorage === 'function') {
          window.exportLocalStorage();
        } else {
          try { if (window.ESM_DIAG) window.ESM_DIAG.error('Export function not available'); } catch (_) {}
          alert(t('exportFunctionUnavailable'));
        }
      });
      // Reihenfolge im Grid-Container: alle Buttons gleichberechtigt
      exportBtn.style.order = '1';
      importBtn.style.order = '2';
      driveBackupBtn.style.order = '3';
      driveRestoreBtn.style.order = '4';
      // Dropbox Backup Button
      const driveBackupBtn = document.createElement('button');
      driveBackupBtn.id = 'esm-drive-backup-btn';
    driveBackupBtn.textContent = t('cloudBackup');
    driveBackupBtn.title = t('cloudBackupTitle');
      driveBackupBtn.style.backgroundImage = 'linear-gradient(180deg, #4285f4, #1a73e8)';
      driveBackupBtn.style.color = '#fff';
      driveBackupBtn.style.border = 'none';
      driveBackupBtn.style.borderRadius = '10px';
      driveBackupBtn.style.padding = '8px 12px';
      driveBackupBtn.style.fontWeight = '600';
      driveBackupBtn.style.cursor = 'pointer';
      driveBackupBtn.style.boxShadow = '0 3px 8px rgba(26, 115, 232, 0.35)';
      driveBackupBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
      driveBackupBtn.style.whiteSpace = 'nowrap';
      driveBackupBtn.style.display = 'inline-flex';
      driveBackupBtn.style.alignItems = 'center';
      driveBackupBtn.style.gap = '4px';
      driveBackupBtn.style.fontSize = '13px';
      driveBackupBtn.style.lineHeight = '18px';
      driveBackupBtn.style.width = '100%';
      driveBackupBtn.style.flex = '1 1 0';
      driveBackupBtn.style.minWidth = '0';
      driveBackupBtn.style.margin = '0';
      driveBackupBtn.addEventListener('mouseenter', () => { driveBackupBtn.style.filter = 'brightness(1.08)'; driveBackupBtn.style.boxShadow = '0 6px 14px rgba(26,115,232,0.45)'; });
      driveBackupBtn.addEventListener('mouseleave', () => { driveBackupBtn.style.filter = ''; driveBackupBtn.style.boxShadow = '0 3px 8px rgba(26,115,232,0.35)'; });
      driveBackupBtn.addEventListener('click', function() {
        if (typeof window.exportToDropbox === 'function') {
          window.exportToDropbox();
        } else {
          try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox backup function not available'); } catch (_) {}
          alert(t('dropboxExportUnavailable'));
        }
      });

      // Dropbox Restore Button
      const driveRestoreBtn = document.createElement('button');
      driveRestoreBtn.id = 'esm-drive-restore-btn';
    driveRestoreBtn.textContent = t('cloudRestore');
    driveRestoreBtn.title = t('cloudRestoreTitle');
      driveRestoreBtn.style.backgroundImage = 'linear-gradient(180deg, #34a853, #137333)';
      driveRestoreBtn.style.color = '#fff';
      driveRestoreBtn.style.border = 'none';
      driveRestoreBtn.style.borderRadius = '10px';
      driveRestoreBtn.style.padding = '8px 12px';
      driveRestoreBtn.style.fontWeight = '600';
      driveRestoreBtn.style.cursor = 'pointer';
      driveRestoreBtn.style.boxShadow = '0 3px 8px rgba(19, 115, 51, 0.35)';
      driveRestoreBtn.style.transition = 'transform 80ms ease, box-shadow 200ms ease, filter 200ms ease';
      driveRestoreBtn.style.whiteSpace = 'nowrap';
      driveRestoreBtn.style.display = 'inline-flex';
      driveRestoreBtn.style.alignItems = 'center';
      driveRestoreBtn.style.gap = '4px';
      driveRestoreBtn.style.fontSize = '13px';
      driveRestoreBtn.style.lineHeight = '18px';
      driveRestoreBtn.style.width = '100%';
      driveRestoreBtn.style.flex = '1 1 0';
      driveRestoreBtn.style.minWidth = '0';
      driveRestoreBtn.style.margin = '0';
      driveRestoreBtn.addEventListener('mouseenter', () => { driveRestoreBtn.style.filter = 'brightness(1.08)'; driveRestoreBtn.style.boxShadow = '0 6px 14px rgba(19,115,51,0.45)'; });
      driveRestoreBtn.addEventListener('mouseleave', () => { driveRestoreBtn.style.filter = ''; driveRestoreBtn.style.boxShadow = '0 3px 8px rgba(19,115,51,0.35)'; });
      driveRestoreBtn.addEventListener('click', function() {
        if (typeof window.importFromDropbox === 'function') {
          window.importFromDropbox();
        } else {
          try { if (window.ESM_DIAG) window.ESM_DIAG.error('Dropbox restore function not available'); } catch (_) {}
          alert(t('dropboxImportUnavailable'));
        }
      });

      btnRow.appendChild(exportBtn);
      btnRow.appendChild(importBtn);
      btnRow.appendChild(driveBackupBtn);
      btnRow.appendChild(driveRestoreBtn);
      panel.appendChild(btnRow);

      const container = document.createElement('div');
      container.id = 'key-list-container';
      container.style.background = 'rgba(255,255,255,0.05)';
      container.style.border = '1px solid rgba(255,255,255,0.10)';
      container.style.borderRadius = '10px';
      container.style.padding = '10px';
      container.style.maxHeight = '320px';
      container.style.overflow = 'auto';
      panel.appendChild(container);

      document.body.appendChild(panel);
      window.uiMounted = true;
      if (typeof window !== 'undefined' && window.ESM_DIAG) window.ESM_DIAG.log('UI mounted via floating fallback panel');
    });
  }

  // Duplicate global addScriptTab removed; using the IIFE-scoped implementation exclusively.
  // UI mounting is managed inside the IIFE via initialize(); removing duplicate global function to avoid scope issues.
  if (typeof window !== 'undefined') {
    if (typeof exportLocalStorage === 'function') {
      window.exportLocalStorage = exportLocalStorage;
    }
    if (typeof importLocalStorage === 'function') {
      window.importLocalStorage = importLocalStorage;
    }
    if (typeof exportToDropbox === 'function') {
      window.exportToDropbox = exportToDropbox;
    }
    if (typeof importFromDropbox === 'function') {
      window.importFromDropbox = importFromDropbox;
    }
  }
