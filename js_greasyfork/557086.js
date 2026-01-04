// ==UserScript==
// @name         TrixVPN
// @namespace    https://greasyfork.org/en/users/1490385-courtesycoil
// @version      0.06
// @description  Global VPN Service Project
// @author       Painsel
// @license      Copyright Painsel - All rights reserved
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%234CAF50"/><text x="50" y="65" font-size="40" fill="white" text-anchor="middle" font-weight="bold">VPN</text></svg>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557086/TrixVPN.user.js
// @updateURL https://update.greasyfork.org/scripts/557086/TrixVPN.meta.js
// ==/UserScript==

/*
  TrixVPN
  Copyright Painsel - All rights reserved
  https://greasyfork.org/en/users/1490385-courtesycoil
  
  Unauthorized copying, modification, or distribution of this script is prohibited.
*/

(function() {
  'use strict';

  // ==================== Configuration ====================
  // Copyright Painsel - All rights reserved
  const CONFIG = {
    // Mode: 'proxy' (free) or 'vpn' (subscription-based)
    mode: 'proxy', // Change to 'vpn' to use VPN service
    
    // Proxy Service Configuration (Free)
    proxyApiBaseUrl: 'https://proxylist.geonode.com/api/proxy-list',
    proxyApiRefreshInterval: 3600000, // 1 hour in milliseconds
    proxyProtocol: 'socks5', // 'http', 'socks4', 'socks5' - default protocol for new proxies
    
    // Default Proxy Filters
    proxyFilters: {
      uptime: 100,           // 0-100 percentage
      limit: 500,            // Number of proxies to fetch
      page: 1,
      sort_by: 'lastChecked',
      sort_type: 'desc',
      port: null,            // e.g., '8080', '3128'
      country: null,         // e.g., 'US', 'GB'
      anonymityLevel: null,  // 'elite', 'anonymous', 'transparent'
      protocol: null,        // 'http', 'socks4', 'socks5'
      speed: null,           // 'fast', 'medium', 'slow'
      google: false          // whether Google-compatible
    },
    
    // VPN Service Configuration (OpenVPN)
    openVpnApiUrl: 'https://your-openvpn-server.com:943/api', // Change to your OpenVPN server
    apiUsername: 'admin', // Change to your username
    apiPassword: 'admin', // Change to your password
    vpnActivationKey: 'ewogICJub25jZSIgOiAiMEE4OERGRTI2Nzg2NTZEQjcxNUM3RjExNTU5MjRFNTlDN0I4RTlEMjRBMDYwOTUxMDk5ODRDMDQ2RkUwQzQ5MiIsCiAgInN1YmtleSIgOiAiQVNVdExQU3BZR2VESWJwbHl0Rmh0YVZfQVN0QVpnZ0FHa09TVXNoSEpTYUdJb0NVaUNFQkJCRGRfYmNkYTJjNDIwODlmNWE2M2ZlODc0OTZmZjkyYWQ1ZjViYWM0YmYyOCIsCiAgImlhdCIgOiAxNzY0MjQ3NDAyCn0=',
    vpnSubscriptionId: 'AStAZggAGkOSUshHJSaGIoCUiCEBBBDd',
    
    // Local storage keys
    storageKey: 'trixVpnState',
    proxyListStorageKey: 'trixVpnProxyList',
    authTokenStorageKey: 'trixVpnAuthToken',
    
    // VPN settings
    defaultVpnProfile: 'default',
    autoConnectOnLoad: false
  };

  // ==================== Connection Manager (Proxy or VPN) ====================
  class ConnectionManager {
    constructor() {
      this.authToken = this.getAuthToken();
      this.isConnected = false;
      this.currentServer = 'direct';
      this.currentProtocol = GM_getValue('trixVpnProxyProtocol', CONFIG.proxyProtocol);
      this.mode = CONFIG.mode;
    }

    /**
     * Switch between Proxy and VPN modes
     */
    setMode(mode) {
      if (['proxy', 'vpn'].includes(mode)) {
        this.mode = mode;
        GM_setValue('trixVpnMode', mode);
        console.log(`[TrixVPN] Switched to ${mode} mode`);
        return true;
      }
      return false;
    }

    /**
     * Connect via selected mode (Proxy or VPN)
     */
    async connect(serverAddress) {
      if (this.mode === 'proxy') {
        return this.connectProxy(serverAddress);
      } else if (this.mode === 'vpn') {
        return this.connectVpn(serverAddress);
      }
      return false;
    }

    /**
     * Disconnect from selected mode
     */
    async disconnect() {
      if (this.mode === 'proxy') {
        return this.disconnectProxy();
      } else if (this.mode === 'vpn') {
        return this.disconnectVpn();
      }
      return false;
    }

    /**
     * Proxy Connection Methods
     */
    connectProxy(proxyAddress, protocol = CONFIG.proxyProtocol) {
      if (proxyAddress === 'direct') {
        console.log('[TrixVPN] Using direct connection (no proxy)');
        this.isConnected = true;
        this.currentServer = 'direct';
        this.currentProtocol = null;
        this.saveConnectionState();
        return true;
      }

      // Store proxy preference with protocol
      GM_setValue('trixVpnCurrentProxy', proxyAddress);
      GM_setValue('trixVpnProxyProtocol', protocol);
      
      this.currentProtocol = protocol;
      const proxyUrl = this.formatProxyUrl(proxyAddress, protocol);
      console.log(`[TrixVPN] Proxy preference set to: ${proxyUrl}`);
      console.log(`[TrixVPN] Protocol: ${protocol.toUpperCase()}`);
      console.log('[TrixVPN] Note: Actual proxy routing requires browser extension or system configuration');
      
      this.isConnected = true;
      this.currentServer = proxyAddress;
      this.saveConnectionState();
      return true;
    }

    formatProxyUrl(address, protocol) {
      return `${protocol}://${address}`;
    }

    disconnectProxy() {
      console.log('[TrixVPN] Reverting to direct connection');
      this.isConnected = false;
      this.currentServer = 'direct';
      this.currentProtocol = null;
      this.saveConnectionState();
      return true;
    }

    /**
     * VPN Connection Methods
     */
    async authenticateVpn() {
      try {
        const response = await this.makeRequest(
          `${CONFIG.openVpnApiUrl}/auth/login`,
          'POST',
          {
            username: CONFIG.apiUsername,
            password: CONFIG.apiPassword
          }
        );

        if (response && response.auth_token) {
          this.authToken = response.auth_token;
          this.saveAuthToken(response.auth_token);
          console.log('[TrixVPN] VPN: Successfully authenticated');
          return true;
        }
      } catch (e) {
        console.error('[TrixVPN] VPN: Authentication failed:', e);
      }
      return false;
    }

    async connectVpn(profileName = CONFIG.defaultVpnProfile) {
      if (!this.authToken) {
        const authenticated = await this.authenticateVpn();
        if (!authenticated) return false;
      }

      try {
        const response = await this.makeRequest(
          `${CONFIG.openVpnApiUrl}/auth/login`,
          'POST',
          {
            username: CONFIG.apiUsername,
            password: CONFIG.apiPassword
          }
        );

        if (response && response.auth_token) {
          this.isConnected = true;
          this.currentServer = profileName;
          this.saveConnectionState();
          console.log('[TrixVPN] VPN: Connection initiated');
          return true;
        }
      } catch (e) {
        console.error('[TrixVPN] VPN: Failed to connect:', e);
      }
      return false;
    }

    async disconnectVpn() {
      if (!this.authToken) {
        console.warn('[TrixVPN] VPN: No auth token, cannot disconnect');
        return false;
      }

      try {
        this.isConnected = false;
        this.currentServer = 'direct';
        this.saveConnectionState();
        console.log('[TrixVPN] VPN: Disconnected');
        return true;
      } catch (e) {
        console.error('[TrixVPN] VPN: Failed to disconnect:', e);
      }
      return false;
    }

    async getStatus() {
      if (this.mode === 'vpn' && this.authToken) {
        try {
          const response = await this.makeRequest(
            `${CONFIG.openVpnApiUrl}/vpn/status`,
            'GET',
            null,
            this.authToken
          );
          return {
            status: this.isConnected ? 'connected' : 'disconnected',
            ip: response?.ip || null,
            server: this.currentServer
          };
        } catch (e) {
          console.error('[TrixVPN] VPN: Failed to get status:', e);
        }
      }

      return {
        status: this.isConnected ? 'connected' : 'disconnected',
        ip: null,
        server: this.currentServer
      };
    }

    /**
     * Generic request method
     */
    makeRequest(url, method = 'GET', data = null, token = null) {
      return new Promise((resolve, reject) => {
        try {
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
          }

          const options = {
            method: method,
            url: url,
            headers: headers,
            timeout: 15000,
            onload: (response) => {
              try {
                let responseData;
                try {
                  responseData = JSON.parse(response.responseText);
                } catch {
                  responseData = response.responseText;
                }
                resolve(responseData);
              } catch (e) {
                reject(e);
              }
            },
            onerror: (error) => {
              reject(new Error(`Request failed: ${error}`));
            },
            ontimeout: () => {
              reject(new Error('Request timeout'));
            }
          };

          if (data && method !== 'GET') {
            options.data = JSON.stringify(data);
          }

          GM_xmlhttpRequest(options);
        } catch (e) {
          reject(e);
        }
      });
    }

    saveAuthToken(token) {
      GM_setValue(CONFIG.authTokenStorageKey, token);
    }

    getAuthToken() {
      return GM_getValue(CONFIG.authTokenStorageKey, null);
    }

    saveConnectionState() {
      GM_setValue(CONFIG.storageKey, JSON.stringify({
        isConnected: this.isConnected,
        currentServer: this.currentServer,
        currentProtocol: this.currentProtocol,
        mode: this.mode,
        timestamp: Date.now()
      }));
    }

    loadConnectionState() {
      try {
        const saved = GM_getValue(CONFIG.storageKey, null);
        if (saved) {
          const state = JSON.parse(saved);
          this.isConnected = state.isConnected || false;
          this.currentServer = state.currentServer || 'direct';
          this.currentProtocol = state.currentProtocol || CONFIG.proxyProtocol;
          this.mode = state.mode || CONFIG.mode;
        }
      } catch (e) {
        console.error('[TrixVPN] Error loading state:', e);
      }
    }
  }

  // ==================== Proxy Fetcher ====================
  class ProxyFetcher {
    constructor() {
      this.proxies = [];
      this.proxysByProtocol = { 'http': [], 'socks4': [], 'socks5': [] };
      this.lastFetchTime = null;
      this.isFetching = false;
      this.currentFilters = this.loadFilters();
    }

    loadFilters() {
      const saved = GM_getValue('trixVpnProxyFilters', null);
      if (saved) {
        return JSON.parse(saved);
      }
      return { ...CONFIG.proxyFilters };
    }

    saveFilters(filters) {
      GM_setValue('trixVpnProxyFilters', JSON.stringify(filters));
      this.currentFilters = filters;
    }

    buildApiUrl(filters = this.currentFilters) {
      let url = CONFIG.proxyApiBaseUrl + '?';
      const params = new URLSearchParams();

      // Always include these
      params.append('filterUpTime', filters.uptime || 100);
      params.append('limit', filters.limit || 500);
      params.append('page', filters.page || 1);
      params.append('sort_by', filters.sort_by || 'lastChecked');
      params.append('sort_type', filters.sort_type || 'desc');

      // Optional filters
      if (filters.port) params.append('filterPort', filters.port);
      if (filters.country) params.append('country', filters.country);
      if (filters.anonymityLevel) params.append('anonymityLevel', filters.anonymityLevel);
      if (filters.protocol) params.append('protocols', filters.protocol);
      if (filters.speed) params.append('speed', filters.speed);
      if (filters.google !== undefined) params.append('google', filters.google);

      return url + params.toString();
    }

    async fetchProxies(filters = null) {
      if (this.isFetching) return;
      
      if (filters) {
        this.saveFilters(filters);
      }

      // Check if we have cached proxies and they're still fresh
      const cached = this.getCachedProxies();
      if (cached && cached.length > 0) {
        this.proxies = cached;
        this.categorizeProxiesByProtocol();
        return cached;
      }

      this.isFetching = true;
      try {
        const apiUrl = this.buildApiUrl();
        console.log('[TrixVPN] Fetching proxies with filters:', this.currentFilters);
        const response = await this.makeRequest(apiUrl);
        if (response && response.data && Array.isArray(response.data)) {
          this.proxies = response.data.map(proxy => ({
            name: `${proxy.country} - ${proxy.ip}:${proxy.port}`,
            address: `${proxy.ip}:${proxy.port}`,
            protocols: this.detectProxyProtocols(proxy),
            country: proxy.country,
            port: proxy.port,
            anonymity: proxy.anonymity,
            uptime: proxy.uptime,
            speed: proxy.speed
          })).slice(0, 500); // Limit to 500 proxies

          // Categorize by protocol
          this.categorizeProxiesByProtocol();

          // Cache the proxies
          this.cacheProxies(this.proxies);
          console.log(`[TrixVPN] Fetched ${this.proxies.length} proxies from Geonode API`);
          console.log(`  SOCKS5: ${this.proxysByProtocol.socks5.length}, SOCKS4: ${this.proxysByProtocol.socks4.length}, HTTP: ${this.proxysByProtocol.http.length}`);
          return this.proxies;
        }
      } catch (e) {
        console.error('[TrixVPN] Error fetching proxies:', e);
      } finally {
        this.isFetching = false;
      }

      return this.proxies;
    }

    detectProxyProtocols(proxy) {
      // Geonode API returns protocol info in some versions
      const protocols = [];
      if (proxy.protocols && Array.isArray(proxy.protocols)) {
        return proxy.protocols.map(p => p.toLowerCase()).filter(p => ['http', 'socks4', 'socks5'].includes(p));
      }
      // If no protocol info, assume common defaults based on proxy characteristics
      if (proxy.anonymity === 'elite' || proxy.anonymity === 'anonymous') {
        protocols.push('socks5', 'socks4');
      }
      if (proxy.protocol && proxy.protocol.toLowerCase() === 'socks5') {
        return ['socks5'];
      }
      if (proxy.protocol && proxy.protocol.toLowerCase() === 'socks4') {
        return ['socks4'];
      }
      // Default to HTTP if no specific protocol info
      return ['http'];
    }

    categorizeProxiesByProtocol() {
      this.proxysByProtocol = { 'http': [], 'socks4': [], 'socks5': [] };
      this.proxies.forEach(proxy => {
        const protocols = proxy.protocols || ['http'];
        protocols.forEach(protocol => {
          const key = protocol.toLowerCase();
          if (this.proxysByProtocol[key]) {
            this.proxysByProtocol[key].push(proxy);
          }
        });
      });
    }

    makeRequest(url) {
      return new Promise((resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: (response) => {
              try {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            },
            onerror: (error) => {
              reject(error);
            },
            ontimeout: () => {
              reject(new Error('Request timeout'));
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    cacheProxies(proxies) {
      GM_setValue(CONFIG.proxyListStorageKey, JSON.stringify({
        proxies: proxies,
        timestamp: Date.now()
      }));
    }

    getCachedProxies() {
      try {
        const cached = GM_getValue(CONFIG.proxyListStorageKey, null);
        if (cached) {
          const data = JSON.parse(cached);
          const now = Date.now();
          // Use cache if less than 1 hour old
          if (now - data.timestamp < CONFIG.proxyApiRefreshInterval) {
            return data.proxies;
          }
        }
      } catch (e) {
        console.error('[TrixVPN] Error retrieving cached proxies:', e);
      }
      return null;
    }

    getProxies() {
      return this.proxies;
    }

    getProxiesByProtocol(protocol) {
      return this.proxysByProtocol[protocol] || [];
    }

    getAvailableProtocols() {
      return Object.keys(this.proxysByProtocol).filter(protocol => this.proxysByProtocol[protocol].length > 0);
    }

    setFilter(filterName, value) {
      this.currentFilters[filterName] = value;
      this.saveFilters(this.currentFilters);
    }

    getFilter(filterName) {
      return this.currentFilters[filterName];
    }

    getAllFilters() {
      return { ...this.currentFilters };
    }

    resetFilters() {
      this.currentFilters = { ...CONFIG.proxyFilters };
      this.saveFilters(this.currentFilters);
    }
  }

  // ==================== VPN State Management ====================
  class VPNStateManager {
    constructor(connectionManager) {
      this.connectionManager = connectionManager;
      this.connectionManager.loadConnectionState();
    }

    loadState() {
      return this.connectionManager.loadConnectionState();
    }

    setMode(mode) {
      return this.connectionManager.setMode(mode);
    }

    async toggleVPN() {
      const status = this.getStatus();
      if (status.connected) {
        return await this.connectionManager.disconnect();
      } else {
        return await this.connectionManager.connect(status.server);
      }
    }

    setServer(serverName) {
      this.connectionManager.currentServer = serverName;
      this.connectionManager.saveConnectionState();
    }

    getStatus() {
      return {
        connected: this.connectionManager.isConnected,
        server: this.connectionManager.currentServer,
        mode: this.connectionManager.mode
      };
    }
  }

  // ==================== UI Manager ====================
  class VPNUIManager {
    constructor(stateManager, proxyFetcher, connectionManager) {
      this.state = stateManager;
      this.proxyFetcher = proxyFetcher;
      this.connectionManager = connectionManager;
      this.container = null;
      this.statusIndicator = null;
      this.toggleButton = null;
      this.serverSelect = null;
      this.modeToggle = null;
    }

    injectStyles() {
      const styles = `
        #vpn-control-widget {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          padding: 16px;
          min-width: 340px;
          max-width: 400px;
          color: white;
          backdrop-filter: blur(10px);
        }

        #vpn-control-widget * {
          box-sizing: border-box;
        }

        .vpn-widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 12px;
        }

        .vpn-widget-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .vpn-mode-indicator {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 4px;
          margin-left: 8px;
        }

        .vpn-status-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ff4757;
          animation: pulse 2s infinite;
          margin-right: 8px;
        }

        .vpn-status-indicator.connected {
          background-color: #2ed573;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-green {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .vpn-status-text {
          font-size: 11px;
          opacity: 0.9;
          margin-top: 4px;
        }

        .vpn-status-text.connected {
          color: #2ed573;
        }

        .vpn-status-text.disconnected {
          color: #ff4757;
        }

        .vpn-mode-tabs {
          display: flex;
          gap: 8px;
          margin: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 12px;
        }

        .vpn-mode-tab {
          flex: 1;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .vpn-mode-tab:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .vpn-mode-tab.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .vpn-toggle-button {
          width: 100%;
          padding: 10px 16px;
          margin: 12px 0;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .vpn-toggle-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .vpn-toggle-button:active {
          transform: translateY(0);
        }

        .vpn-toggle-button.connected {
          background-color: #2ed573;
          color: #1a1a1a;
        }

        .vpn-toggle-button.connected:hover {
          background-color: #26d063;
        }

        .vpn-server-select {
          width: 100%;
          padding: 8px 12px;
          margin: 8px 0;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .vpn-server-select:hover {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .vpn-server-select option {
          background-color: #333;
          color: white;
        }

        .vpn-protocol-filter {
          display: flex;
          gap: 4px;
          margin: 8px 0;
          flex-wrap: wrap;
        }

        .vpn-protocol-btn {
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .vpn-protocol-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .vpn-protocol-btn.active {
          background: rgba(76, 175, 80, 0.6);
          border-color: rgba(76, 175, 80, 1);
        }

        .vpn-protocol-label {
          font-size: 10px;
          opacity: 0.8;
          margin-top: 6px;
          margin-bottom: 2px;
        }

        .vpn-filter-section {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .vpn-filter-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.9;
          margin-bottom: 8px;
          cursor: pointer;
          user-select: none;
        }

        .vpn-filter-title:hover {
          opacity: 1;
        }

        .vpn-filter-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .vpn-filter-content::-webkit-scrollbar {
          width: 4px;
        }

        .vpn-filter-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        .vpn-filter-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .vpn-filter-content.hidden {
          display: none;
        }

        .vpn-filter-input {
          padding: 6px 8px;
          font-size: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          font-family: inherit;
        }

        .vpn-filter-input::placeholder {
          opacity: 0.5;
        }

        .vpn-filter-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .vpn-filter-checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .vpn-filter-checkbox:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .vpn-filter-checkbox input[type="checkbox"] {
          cursor: pointer;
          width: 14px;
          height: 14px;
        }

        .vpn-filter-button {
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .vpn-filter-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .vpn-filter-button.apply {
          background: rgba(76, 175, 80, 0.5);
          border-color: rgba(76, 175, 80, 0.8);
        }

        .vpn-filter-button.apply:hover {
          background: rgba(76, 175, 80, 0.7);
        }

        .vpn-filter-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .vpn-filter-actions button {
          flex: 1;
          padding: 6px 8px;
        }

        .vpn-server-info {
          font-size: 11px;
          opacity: 0.85;
          padding: 8px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          margin-top: 8px;
          word-break: break-all;
        }

        .vpn-server-label {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .vpn-widget-footer {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 10px;
          opacity: 0.7;
          text-align: center;
        }

        .vpn-minimize-btn {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vpn-minimize-btn:hover {
          opacity: 0.8;
        }

        #vpn-control-widget.minimized {
          min-width: auto;
          padding: 8px;
        }

        #vpn-control-widget.minimized .vpn-widget-content {
          display: none;
        }
      `;

      GM_addStyle(styles);
    }

    createWidget() {
      // Create main container
      this.container = document.createElement('div');
      this.container.id = 'vpn-control-widget';

      const status = this.state.getStatus();

      // Header with title and minimize button
      const header = document.createElement('div');
      header.className = 'vpn-widget-header';

      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';

      const title = document.createElement('div');
      title.className = 'vpn-widget-title';
      title.textContent = '🛡️ TrixVPN';

      const modeIndicator = document.createElement('div');
      modeIndicator.className = 'vpn-mode-indicator';
      modeIndicator.textContent = status.mode.toUpperCase();

      titleContainer.appendChild(title);
      titleContainer.appendChild(modeIndicator);

      const minimizeBtn = document.createElement('button');
      minimizeBtn.className = 'vpn-minimize-btn';
      minimizeBtn.textContent = '−';
      minimizeBtn.title = 'Minimize widget';
      minimizeBtn.addEventListener('click', () => {
        this.container.classList.toggle('minimized');
      });

      header.appendChild(titleContainer);
      header.appendChild(minimizeBtn);

      // Content wrapper
      const content = document.createElement('div');
      content.className = 'vpn-widget-content';

      // Mode tabs
      const modeTabs = document.createElement('div');
      modeTabs.className = 'vpn-mode-tabs';

      const proxyTab = document.createElement('button');
      proxyTab.className = `vpn-mode-tab ${status.mode === 'proxy' ? 'active' : ''}`;
      proxyTab.textContent = '🌐 Proxy';
      proxyTab.addEventListener('click', () => {
        this.state.setMode('proxy');
        this.updateUI();
        modeIndicator.textContent = 'PROXY';
      });

      const vpnTab = document.createElement('button');
      vpnTab.className = `vpn-mode-tab ${status.mode === 'vpn' ? 'active' : ''}`;
      vpnTab.textContent = '🔐 VPN';
      vpnTab.addEventListener('click', () => {
        this.state.setMode('vpn');
        this.updateUI();
        modeIndicator.textContent = 'VPN';
      });

      modeTabs.appendChild(proxyTab);
      modeTabs.appendChild(vpnTab);

      // Status indicator and text
      const statusDiv = document.createElement('div');
      this.statusIndicator = document.createElement('span');
      this.statusIndicator.className = 'vpn-status-indicator' + (status.connected ? ' connected' : '');

      const statusTextSpan = document.createElement('span');
      statusTextSpan.className = 'vpn-status-text' + (status.connected ? ' connected' : ' disconnected');
      statusTextSpan.textContent = status.connected ? '🔒 Connected' : '🔓 Disconnected';

      statusDiv.appendChild(this.statusIndicator);
      statusDiv.appendChild(statusTextSpan);

      // Toggle button
      this.toggleButton = document.createElement('button');
      this.toggleButton.className = 'vpn-toggle-button' + (status.connected ? ' connected' : '');
      this.toggleButton.textContent = status.connected ? '⏸ Disconnect' : '▶ Connect';
      this.toggleButton.addEventListener('click', () => this.handleToggle());

      // Server selection
      const serverLabel = document.createElement('div');
      serverLabel.style.fontSize = '11px';
      serverLabel.style.fontWeight = '600';
      serverLabel.style.marginTop = '8px';
      serverLabel.style.marginBottom = '4px';
      serverLabel.textContent = 'Select Server:';

      // Protocol filter
      const protocolLabel = document.createElement('div');
      protocolLabel.className = 'vpn-protocol-label';
      protocolLabel.textContent = 'Protocol Filter:';

      const protocolFilter = document.createElement('div');
      protocolFilter.className = 'vpn-protocol-filter';
      
      const protocols = ['SOCKS5', 'SOCKS4', 'HTTP'];
      const protocolBtns = {};
      let selectedProtocol = GM_getValue('trixVpnSelectedProtocol', 'socks5');

      protocols.forEach(proto => {
        const btn = document.createElement('button');
        btn.className = `vpn-protocol-btn ${proto.toLowerCase() === selectedProtocol ? 'active' : ''}`;
        btn.textContent = proto;
        btn.addEventListener('click', () => {
          Object.values(protocolBtns).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedProtocol = proto.toLowerCase();
          GM_setValue('trixVpnSelectedProtocol', selectedProtocol);
          this.refreshServerOptions(selectedProtocol);
        });
        protocolFilter.appendChild(btn);
        protocolBtns[proto.toLowerCase()] = btn;
      });

      this.serverSelect = document.createElement('select');
      this.serverSelect.className = 'vpn-server-select';
      this.serverSelect.addEventListener('change', (e) => this.handleServerChange(e));

      // Add Direct option
      const directOption = document.createElement('option');
      directOption.value = 'direct';
      directOption.textContent = 'Direct (No Proxy/VPN)';
      if ('direct' === status.server) {
        directOption.selected = true;
      }
      this.serverSelect.appendChild(directOption);

      // Add proxies filtered by protocol
      const proxiesByProtocol = this.proxyFetcher.getProxiesByProtocol(selectedProtocol);
      if (proxiesByProtocol && proxiesByProtocol.length > 0) {
        proxiesByProtocol.forEach((server) => {
          const option = document.createElement('option');
          option.value = server.address;
          option.textContent = server.name;
          if (server.address === status.server) {
            option.selected = true;
          }
          this.serverSelect.appendChild(option);
        });
      } else {
        const loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.textContent = '⏳ Loading proxies...';
        this.serverSelect.appendChild(loadingOption);
      }

      // Server info display
      const serverInfo = document.createElement('div');
      serverInfo.className = 'vpn-server-info';
      serverInfo.innerHTML = `<div class="vpn-server-label">Current:</div>${this.escapeHtml(status.server)}`;

      // Filter Section
      const filterSection = this.createFilterSection();

      // Footer
      const footer = document.createElement('div');
      footer.className = 'vpn-widget-footer';
      footer.textContent = 'TrixVPN v0.03 by Painsel';

      // Assemble widget
      content.appendChild(modeTabs);
      content.appendChild(statusDiv);
      content.appendChild(this.toggleButton);
      content.appendChild(serverLabel);
      content.appendChild(protocolLabel);
      content.appendChild(protocolFilter);
      content.appendChild(this.serverSelect);
      content.appendChild(serverInfo);
      content.appendChild(filterSection);

      this.container.appendChild(header);
      this.container.appendChild(content);
      this.container.appendChild(footer);

      return this.container;
    }

    handleToggle() {
      this.toggleButton.disabled = true;
      this.toggleButton.textContent = '⏳ Processing...';

      this.state.toggleVPN().then(() => {
        this.updateUI();
        const status = this.state.getStatus();
        this.showNotification(
          status.connected ? '✓ Connected' : '✗ Disconnected',
          status.connected ? `Connected via ${status.mode}` : 'Connection closed'
        );
      }).catch(e => {
        console.error('[TrixVPN] Toggle failed:', e);
        this.showNotification('❌ Error', 'Failed to toggle connection');
      }).finally(() => {
        this.toggleButton.disabled = false;
        this.updateUI();
      });
    }

    handleServerChange(event) {
      const selectedServer = event.target.value;
      const selectedProtocol = GM_getValue('trixVpnSelectedProtocol', 'socks5');
      this.state.setServer(selectedServer);
      this.connectionManager.currentProtocol = selectedProtocol;
      this.updateUI();
      this.showNotification(
        '🔄 Server Changed',
        `${event.target.options[event.target.selectedIndex].text} (${selectedProtocol.toUpperCase()})`
      );
    }

    updateUI() {
      const status = this.state.getStatus();

      if (this.statusIndicator) {
        if (status.connected) {
          this.statusIndicator.classList.add('connected');
        } else {
          this.statusIndicator.classList.remove('connected');
        }
      }

      if (this.toggleButton) {
        if (status.connected) {
          this.toggleButton.classList.add('connected');
          this.toggleButton.textContent = '⏸ Disconnect';
        } else {
          this.toggleButton.classList.remove('connected');
          this.toggleButton.textContent = '▶ Connect';
        }
      }

      if (this.serverSelect) {
        this.serverSelect.value = status.server;
      }

      const serverInfo = this.container?.querySelector('.vpn-server-info');
      if (serverInfo) {
        serverInfo.innerHTML = `<div class="vpn-server-label">Current:</div>${this.escapeHtml(status.server)}`;
      }
    }

    showNotification(title, message) {
      try {
        GM_notification({
          title: title,
          text: message,
          highlight: true,
          timeout: 5000
        });
      } catch (e) {
        console.log('[TrixVPN]', title, '-', message);
      }
    }

    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    inject() {
      this.injectStyles();
      const widget = this.createWidget();
      document.documentElement.appendChild(widget);
      
      this.proxyFetcher.fetchProxies().then(() => {
        this.refreshServerOptions();
      }).catch(e => {
        console.error('[TrixVPN] Failed to fetch proxies:', e);
      });
    }

    refreshServerOptions(protocol = 'socks5') {
      if (!this.serverSelect) return;
      
      while (this.serverSelect.options.length > 1) {
        this.serverSelect.remove(this.serverSelect.options.length - 1);
      }

      const proxies = this.proxyFetcher.getProxiesByProtocol(protocol);
      if (proxies && proxies.length > 0) {
        proxies.forEach((server) => {
          const option = document.createElement('option');
          option.value = server.address;
          option.textContent = server.name;
          this.serverSelect.appendChild(option);
        });
        console.log(`[TrixVPN] Added ${proxies.length} ${protocol.toUpperCase()} proxies to server list`);
      }
    }

    createFilterSection() {
      const section = document.createElement('div');
      section.className = 'vpn-filter-section';

      const title = document.createElement('div');
      title.className = 'vpn-filter-title';
      title.textContent = '⚙️ Advanced Filters';
      title.style.cursor = 'pointer';

      const content = document.createElement('div');
      content.className = 'vpn-filter-content hidden';

      const filters = this.proxyFetcher.getAllFilters();

      // Uptime filter
      const uptimeDiv = document.createElement('div');
      const uptimeLabel = document.createElement('label');
      uptimeLabel.style.fontSize = '9px';
      uptimeLabel.textContent = 'Uptime (%)';
      const uptimeInput = document.createElement('input');
      uptimeInput.type = 'number';
      uptimeInput.className = 'vpn-filter-input';
      uptimeInput.min = '0';
      uptimeInput.max = '100';
      uptimeInput.value = filters.uptime || 100;
      uptimeInput.placeholder = '0-100';
      uptimeDiv.appendChild(uptimeLabel);
      uptimeDiv.appendChild(uptimeInput);

      // Port filter
      const portDiv = document.createElement('div');
      const portLabel = document.createElement('label');
      portLabel.style.fontSize = '9px';
      portLabel.textContent = 'Port';
      const portInput = document.createElement('input');
      portInput.type = 'text';
      portInput.className = 'vpn-filter-input';
      portInput.value = filters.port || '';
      portInput.placeholder = 'e.g., 8080';
      portDiv.appendChild(portLabel);
      portDiv.appendChild(portInput);

      // Country filter
      const countryDiv = document.createElement('div');
      const countryLabel = document.createElement('label');
      countryLabel.style.fontSize = '9px';
      countryLabel.textContent = 'Country';
      const countryInput = document.createElement('input');
      countryInput.type = 'text';
      countryInput.className = 'vpn-filter-input';
      countryInput.value = filters.country || '';
      countryInput.placeholder = 'e.g., US';
      countryDiv.appendChild(countryLabel);
      countryDiv.appendChild(countryInput);

      // Anonymity filter
      const anonDiv = document.createElement('div');
      const anonLabel = document.createElement('label');
      anonLabel.style.fontSize = '9px';
      anonLabel.textContent = 'Anonymity';
      const anonSelect = document.createElement('select');
      anonSelect.className = 'vpn-filter-input';
      const anonOptions = ['', 'elite', 'anonymous', 'transparent'];
      anonOptions.forEach(opt => {
        const optEl = document.createElement('option');
        optEl.value = opt;
        optEl.textContent = opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'Any';
        if (opt === filters.anonymityLevel) optEl.selected = true;
        anonSelect.appendChild(optEl);
      });
      anonDiv.appendChild(anonLabel);
      anonDiv.appendChild(anonSelect);

      // Speed filter
      const speedDiv = document.createElement('div');
      const speedLabel = document.createElement('label');
      speedLabel.style.fontSize = '9px';
      speedLabel.textContent = 'Speed';
      const speedSelect = document.createElement('select');
      speedSelect.className = 'vpn-filter-input';
      const speedOptions = ['', 'fast', 'medium', 'slow'];
      speedOptions.forEach(opt => {
        const optEl = document.createElement('option');
        optEl.value = opt;
        optEl.textContent = opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'Any';
        if (opt === filters.speed) optEl.selected = true;
        speedSelect.appendChild(optEl);
      });
      speedDiv.appendChild(speedLabel);
      speedDiv.appendChild(speedSelect);

      // Limit filter
      const limitDiv = document.createElement('div');
      const limitLabel = document.createElement('label');
      limitLabel.style.fontSize = '9px';
      limitLabel.textContent = 'Limit';
      const limitInput = document.createElement('input');
      limitInput.type = 'number';
      limitInput.className = 'vpn-filter-input';
      limitInput.min = '10';
      limitInput.max = '500';
      limitInput.value = filters.limit || 500;
      limitInput.placeholder = '10-500';
      limitDiv.appendChild(limitLabel);
      limitDiv.appendChild(limitInput);

      // Action buttons
      const actions = document.createElement('div');
      actions.className = 'vpn-filter-actions';

      const applyBtn = document.createElement('button');
      applyBtn.className = 'vpn-filter-button apply';
      applyBtn.textContent = 'Apply';
      applyBtn.addEventListener('click', async () => {
        const newFilters = {
          uptime: parseInt(uptimeInput.value) || 100,
          port: portInput.value || null,
          country: countryInput.value || null,
          anonymityLevel: anonSelect.value || null,
          speed: speedSelect.value || null,
          limit: parseInt(limitInput.value) || 500,
          page: filters.page,
          sort_by: filters.sort_by,
          sort_type: filters.sort_type,
          google: filters.google,
          protocol: filters.protocol
        };
        applyBtn.textContent = '⏳ Fetching...';
        applyBtn.disabled = true;
        await this.proxyFetcher.fetchProxies(newFilters);
        this.refreshServerOptions();
        applyBtn.textContent = 'Apply';
        applyBtn.disabled = false;
        this.showNotification('✓ Filters Applied', 'Proxy list updated');
      });

      const resetBtn = document.createElement('button');
      resetBtn.className = 'vpn-filter-button';
      resetBtn.textContent = 'Reset';
      resetBtn.addEventListener('click', () => {
        this.proxyFetcher.resetFilters();
        uptimeInput.value = 100;
        portInput.value = '';
        countryInput.value = '';
        anonSelect.value = '';
        speedSelect.value = '';
        limitInput.value = 500;
        this.showNotification('✓ Reset', 'Filters reset to defaults');
      });

      actions.appendChild(applyBtn);
      actions.appendChild(resetBtn);

      content.appendChild(uptimeDiv);
      content.appendChild(portDiv);
      content.appendChild(countryDiv);
      content.appendChild(anonDiv);
      content.appendChild(speedDiv);
      content.appendChild(limitDiv);
      content.appendChild(actions);

      // Toggle content visibility
      title.addEventListener('click', () => {
        content.classList.toggle('hidden');
        title.textContent = content.classList.contains('hidden') ? '⚙️ Advanced Filters' : '⬇️ Advanced Filters';
      });

      section.appendChild(title);
      section.appendChild(content);
      return section;
    }
  }

  // ==================== Main Initialization ====================
  function initialize() {
    try {
      const connectionManager = new ConnectionManager();
      const proxyFetcher = new ProxyFetcher();
      const stateManager = new VPNStateManager(connectionManager);
      const uiManager = new VPNUIManager(stateManager, proxyFetcher, connectionManager);

      // Wait for DOM to be ready
      if (document.documentElement) {
        uiManager.inject();
        console.log('[TrixVPN] Script initialized - Proxy and VPN modes available');
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          uiManager.inject();
          console.log('[TrixVPN] Script initialized - Proxy and VPN modes available');
        });
      }
    } catch (e) {
      console.error('[TrixVPN] Initialization error:', e);
    }
  }

  // Start the script
  initialize();
})();
