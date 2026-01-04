// ==UserScript==
// @name            Detcord
// @description     Bulk delete your own Discord messages - Fast, secure, privacy-focused
// @version         1.0.0
// @author          Welsh Wandering
// @homepageURL     https://github.com/welshwandering/detcord
// @supportURL      https://github.com/welshwandering/detcord/discussions
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @namespace       https://github.com/welshwandering/detcord
// @icon            https://welshwandering.github.io/detcord/images/icon128.png
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/561179/Detcord.user.js
// @updateURL https://update.greasyfork.org/scripts/561179/Detcord.meta.js
// ==/UserScript==

var Detcord = (function(exports) {
  "use strict";
  const DELETABLE_MESSAGE_TYPES$1 = [
    0,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21
  ];
  function isMessageDeletable(type) {
    return type === 0 || type >= 6 && type <= 21;
  }
  function getTokenFromLocalStorage() {
    try {
      window.dispatchEvent(new Event("beforeunload"));
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        document.body.removeChild(iframe);
        return null;
      }
      const storage = iframeWindow.localStorage;
      document.body.removeChild(iframe);
      const tokenValue = storage.getItem("token");
      if (tokenValue) {
        return JSON.parse(tokenValue);
      }
      return null;
    } catch {
      return null;
    }
  }
  function getTokenFromWebpack() {
    try {
      const webpackChunk = window.webpackChunkdiscord_app;
      if (!webpackChunk) {
        return null;
      }
      const modules = [];
      webpackChunk.push([
        ["detcord-token-extractor"],
        {},
        (require) => {
          for (const moduleId in require.c) {
            const module = require.c[moduleId];
            if (module) {
              modules.push(module);
            }
          }
        }
      ]);
      for (const module of modules) {
        if (module?.exports?.default?.getToken) {
          const token = module.exports.default.getToken();
          if (typeof token === "string" && token.length > 0) {
            return token;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }
  function getAuthorId() {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        document.body.removeChild(iframe);
        return null;
      }
      const storage = iframeWindow.localStorage;
      document.body.removeChild(iframe);
      const userIdCache = storage.getItem("user_id_cache");
      if (userIdCache) {
        return JSON.parse(userIdCache);
      }
      return null;
    } catch {
      return null;
    }
  }
  function getGuildIdFromUrl() {
    const match = window.location.href.match(/channels\/([\w@]+)\/(\d+)/);
    return match?.[1] ?? null;
  }
  function getChannelIdFromUrl() {
    const match = window.location.href.match(/channels\/([\w@]+)\/(\d+)/);
    return match?.[2] ?? null;
  }
  function getToken() {
    const localStorageToken = getTokenFromLocalStorage();
    if (localStorageToken) {
      return localStorageToken;
    }
    return getTokenFromWebpack();
  }
  const MAX_PATTERN_LENGTH = 100;
  const REGEX_TIMEOUT_MS = 100;
  const DANGEROUS_REGEX_PATTERNS = [
    // Nested quantifiers: (a+)+, (a*)*,  (a+)*, etc.
    /\([^)]*[+*][^)]*\)[+*]/,
    // Overlapping same-character alternations with quantifiers: (a|a)+
    /\(([^|)]+)\|\1\)[+*]/,
    // Back-references with quantifiers
    /\\[1-9][+*]/
  ];
  const REDOS_TEST_STRING = `${"a".repeat(25)}!`;
  function validateRegex(pattern, flags = "i") {
    if (!pattern || pattern.trim().length === 0) {
      return { valid: true };
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
      return {
        valid: false,
        error: `Pattern exceeds maximum length of ${MAX_PATTERN_LENGTH} characters`
      };
    }
    for (const dangerous of DANGEROUS_REGEX_PATTERNS) {
      if (dangerous.test(pattern)) {
        return {
          valid: false,
          error: "Pattern contains constructs that could cause performance issues"
        };
      }
    }
    let regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      return {
        valid: false,
        error: e instanceof Error ? e.message : "Invalid regex pattern"
      };
    }
    const startTime = performance.now();
    try {
      regex.test(REDOS_TEST_STRING);
    } catch {
      return {
        valid: false,
        error: "Pattern caused an error during execution"
      };
    }
    const executionTime = performance.now() - startTime;
    if (executionTime > REGEX_TIMEOUT_MS) {
      return {
        valid: false,
        error: "Pattern takes too long to execute and may cause performance issues"
      };
    }
    return { valid: true, regex };
  }
  const SNOWFLAKE_REGEX = /^\d{17,19}$/;
  function isValidSnowflake(id) {
    if (!id || typeof id !== "string") {
      return false;
    }
    return SNOWFLAKE_REGEX.test(id);
  }
  function validateSnowflake(id, fieldName = "ID") {
    if (!id || typeof id !== "string") {
      return { valid: false, error: `${fieldName} is required` };
    }
    if (!SNOWFLAKE_REGEX.test(id)) {
      return { valid: false, error: `${fieldName} must be a valid Discord ID (17-19 digits)` };
    }
    return { valid: true };
  }
  const DM_GUILD_ID = "@me";
  function isValidGuildId(id) {
    if (!id || typeof id !== "string") {
      return false;
    }
    return id === DM_GUILD_ID || isValidSnowflake(id);
  }
  const TOKEN_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  const MIN_TOKEN_LENGTH = 50;
  const MAX_TOKEN_LENGTH = 100;
  function isValidTokenFormat(token) {
    if (!token || typeof token !== "string") {
      return false;
    }
    if (token.length < MIN_TOKEN_LENGTH || token.length > MAX_TOKEN_LENGTH) {
      return false;
    }
    return TOKEN_REGEX.test(token);
  }
  function validateToken(token) {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Token is required" };
    }
    if (token.length < MIN_TOKEN_LENGTH) {
      return { valid: false, error: "Token is too short" };
    }
    if (token.length > MAX_TOKEN_LENGTH) {
      return { valid: false, error: "Token is too long" };
    }
    if (!TOKEN_REGEX.test(token)) {
      return { valid: false, error: "Token has invalid format" };
    }
    return { valid: true };
  }
  function maskToken(token) {
    if (!token || token.length < 12) {
      return "****";
    }
    return `${token.slice(0, 4)}...${token.slice(-4)}`;
  }
  const API_VERSION = "v10";
  const BASE_URL = `https://discord.com/api/${API_VERSION}`;
  class DiscordApiClient {
    token;
    rateLimitInfo = null;
    /**
     * Create a new Discord API client
     * @param token User authentication token (without "Bot " prefix)
     * @throws Error if token is missing or has invalid format
     */
    constructor(token) {
      if (!token || typeof token !== "string") {
        throw new Error("Token is required and must be a string");
      }
      if (!isValidTokenFormat(token)) {
        throw new Error("Token has invalid format");
      }
      this.token = token;
    }
    /**
     * Get current rate limit information from most recent request
     * @returns Rate limit info or null if no requests have been made
     */
    getRateLimitInfo() {
      return this.rateLimitInfo;
    }
    /**
     * Search for messages in a guild or channel
     * @param params Search parameters
     * @returns Search response with messages and total count
     * @throws DiscordApiError on API errors
     */
    async searchMessages(params) {
      const { guildId, channelId, ...queryParams } = params;
      if (guildId && !isValidGuildId(guildId)) {
        throw this.createError("UNKNOWN", "Invalid guild ID format");
      }
      if (channelId && !isValidSnowflake(channelId)) {
        throw this.createError("UNKNOWN", "Invalid channel ID format");
      }
      let endpoint;
      if (guildId) {
        endpoint = `${BASE_URL}/guilds/${guildId}/messages/search`;
      } else if (channelId) {
        endpoint = `${BASE_URL}/channels/${channelId}/messages/search`;
      } else {
        throw this.createError("UNKNOWN", "Either guildId or channelId is required for search");
      }
      const searchParams = new URLSearchParams();
      if (queryParams.authorId) {
        searchParams.set("author_id", queryParams.authorId);
      }
      if (queryParams.content) {
        searchParams.set("content", queryParams.content);
      }
      if (queryParams.minId) {
        searchParams.set("min_id", queryParams.minId);
      }
      if (queryParams.maxId) {
        searchParams.set("max_id", queryParams.maxId);
      }
      if (queryParams.hasLink) {
        searchParams.set("has", "link");
      }
      if (queryParams.hasFile) {
        searchParams.set("has", "file");
      }
      if (queryParams.offset !== void 0 && queryParams.offset > 0) {
        searchParams.set("offset", String(queryParams.offset));
      }
      if (queryParams.includeNsfw) {
        searchParams.set("include_nsfw", "true");
      }
      const queryString = searchParams.toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const response = await this.makeRequest(url, "GET");
      if (response.status === 202) {
        throw this.createError("INDEXING", "Search index is being built, try again later");
      }
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      const data = await response.json();
      return data;
    }
    /**
     * Get all channels in a guild
     * @param guildId The guild ID to fetch channels from
     * @returns Array of channels (filtered to text-based channels)
     */
    async getGuildChannels(guildId) {
      if (!guildId) {
        throw this.createError("UNKNOWN", "guildId is required");
      }
      if (!isValidSnowflake(guildId)) {
        throw this.createError("UNKNOWN", "Invalid guild ID format");
      }
      const url = `${BASE_URL}/guilds/${guildId}/channels`;
      const response = await this.makeRequest(url, "GET");
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      const channels = await response.json();
      const textChannelTypes = /* @__PURE__ */ new Set([
        0,
        5,
        11,
        12,
        15
        /* GUILD_FORUM */
      ]);
      return channels.filter((ch) => textChannelTypes.has(ch.type));
    }
    /**
     * Delete a specific message
     * @param channelId Channel containing the message
     * @param messageId ID of the message to delete
     * @returns Delete result indicating success or failure
     */
    async deleteMessage(channelId, messageId) {
      if (!channelId || !messageId) {
        return {
          success: false,
          error: "channelId and messageId are required"
        };
      }
      if (!isValidSnowflake(channelId)) {
        return {
          success: false,
          error: "Invalid channel ID format"
        };
      }
      if (!isValidSnowflake(messageId)) {
        return {
          success: false,
          error: "Invalid message ID format"
        };
      }
      const url = `${BASE_URL}/channels/${channelId}/messages/${messageId}`;
      try {
        const response = await this.makeRequest(url, "DELETE");
        if (response.status === 204) {
          return { success: true };
        }
        if (response.status === 202) {
          return {
            success: false,
            indexing: true,
            error: "Message indexing in progress"
          };
        }
        if (response.status === 429) {
          const body = await response.json();
          const retryAfter = body.retry_after ?? this.rateLimitInfo?.resetAfter ?? 1;
          return {
            success: false,
            error: "Rate limited",
            retryAfter
          };
        }
        const error = await this.handleErrorResponse(response);
        return {
          success: false,
          error: error.message
        };
      } catch (err) {
        if (this.isDiscordApiError(err)) {
          const result = {
            success: false,
            error: err.message
          };
          if (err.retryAfter !== void 0) {
            result.retryAfter = err.retryAfter;
          }
          return result;
        }
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error"
        };
      }
    }
    /**
     * Make an authenticated request to the Discord API
     */
    async makeRequest(url, method) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: this.token,
            "Content-Type": "application/json"
          }
        });
        this.updateRateLimitInfo(response.headers);
        return response;
      } catch (err) {
        throw this.createError(
          "NETWORK_ERROR",
          err instanceof Error ? err.message : "Network request failed"
        );
      }
    }
    /**
     * Update rate limit info from response headers
     */
    updateRateLimitInfo(headers) {
      const remaining = headers.get("X-RateLimit-Remaining");
      const limit = headers.get("X-RateLimit-Limit");
      const resetAfter = headers.get("X-RateLimit-Reset-After");
      if (remaining !== null && limit !== null && resetAfter !== null) {
        this.rateLimitInfo = {
          remaining: Number.parseInt(remaining, 10),
          limit: Number.parseInt(limit, 10),
          resetAfter: Number.parseFloat(resetAfter)
        };
      }
    }
    /**
     * Handle error responses from the API
     */
    async handleErrorResponse(response) {
      let message = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        if (body.message) {
          message = body.message;
        }
        if (response.status === 429) {
          return this.createError("RATE_LIMITED", message, body.retry_after, response.status);
        }
      } catch {
        message = response.statusText || message;
      }
      switch (response.status) {
        case 401:
          return this.createError("UNAUTHORIZED", message, void 0, response.status);
        case 403:
          return this.createError("FORBIDDEN", message, void 0, response.status);
        case 404:
          return this.createError("NOT_FOUND", message, void 0, response.status);
        default:
          return this.createError("UNKNOWN", message, void 0, response.status);
      }
    }
    /**
     * Create a structured API error
     */
    createError(code, message, retryAfter, httpStatus) {
      const error = { code, message };
      if (retryAfter !== void 0) {
        error.retryAfter = retryAfter;
      }
      if (httpStatus !== void 0) {
        error.httpStatus = httpStatus;
      }
      return error;
    }
    /**
     * Type guard for DiscordApiError
     */
    isDiscordApiError(err) {
      return typeof err === "object" && err !== null && "code" in err && "message" in err && typeof err.code === "string" && typeof err.message === "string";
    }
  }
  const STORAGE_KEY = "detcord_progress";
  const PROGRESS_EXPIRY_MS = 24 * 60 * 60 * 1e3;
  function saveProgress(progress) {
    try {
      const data = JSON.stringify(progress);
      localStorage.setItem(STORAGE_KEY, data);
    } catch {
    }
  }
  function isValidProgressData(data) {
    if (!data || typeof data !== "object") {
      return false;
    }
    const obj = data;
    if (typeof obj.authorId !== "string" || !isValidSnowflake(obj.authorId)) {
      return false;
    }
    if (typeof obj.lastMaxId !== "string" || !isValidSnowflake(obj.lastMaxId)) {
      return false;
    }
    if (typeof obj.timestamp !== "number" || !Number.isFinite(obj.timestamp)) {
      return false;
    }
    if (typeof obj.deletedCount !== "number" || !Number.isFinite(obj.deletedCount)) {
      return false;
    }
    if (typeof obj.totalFound !== "number" || !Number.isFinite(obj.totalFound)) {
      return false;
    }
    if (obj.guildId !== void 0) {
      if (typeof obj.guildId !== "string") {
        return false;
      }
      if (obj.guildId !== "@me" && !isValidSnowflake(obj.guildId)) {
        return false;
      }
    }
    if (obj.channelId !== void 0) {
      if (typeof obj.channelId !== "string" || !isValidSnowflake(obj.channelId)) {
        return false;
      }
    }
    if (obj.initialTotalFound !== void 0) {
      if (typeof obj.initialTotalFound !== "number" || !Number.isFinite(obj.initialTotalFound)) {
        return false;
      }
    }
    if (obj.filters !== void 0) {
      if (typeof obj.filters !== "object" || obj.filters === null) {
        return false;
      }
      const filters = obj.filters;
      if (filters.content !== void 0 && typeof filters.content !== "string") {
        return false;
      }
      if (filters.hasLink !== void 0 && typeof filters.hasLink !== "boolean") {
        return false;
      }
      if (filters.hasFile !== void 0 && typeof filters.hasFile !== "boolean") {
        return false;
      }
      if (filters.includePinned !== void 0 && typeof filters.includePinned !== "boolean") {
        return false;
      }
      if (filters.pattern !== void 0 && typeof filters.pattern !== "string") {
        return false;
      }
      if (filters.minId !== void 0) {
        if (typeof filters.minId !== "string" || !isValidSnowflake(filters.minId)) {
          return false;
        }
      }
    }
    return true;
  }
  function loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        clearProgress();
        return null;
      }
      if (!isValidProgressData(parsed)) {
        clearProgress();
        return null;
      }
      const now = Date.now();
      if (now - parsed.timestamp > PROGRESS_EXPIRY_MS) {
        clearProgress();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
  function clearProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }
  function hasExistingSession() {
    return loadProgress() !== null;
  }
  function shouldSaveProgress(deletedCount) {
    return deletedCount > 0 && deletedCount % 10 === 0;
  }
  const DISCORD_EPOCH = 1420070400000n;
  function dateToSnowflake(date) {
    const timestamp = date instanceof Date ? date.getTime() : new Date(date).getTime();
    if (Number.isNaN(timestamp)) {
      throw new Error("Invalid date provided");
    }
    const timestampBigInt = BigInt(timestamp);
    const snowflake = timestampBigInt - DISCORD_EPOCH << 22n;
    return snowflake.toString();
  }
  function snowflakeToDate(snowflake) {
    if (!snowflake || !/^\d+$/.test(snowflake)) {
      throw new Error("Invalid snowflake: must be a numeric string");
    }
    const snowflakeBigInt = BigInt(snowflake);
    const timestamp = (snowflakeBigInt >> 22n) + DISCORD_EPOCH;
    return new Date(Number(timestamp));
  }
  function formatDuration(ms) {
    if (!Number.isFinite(ms)) {
      return "0s";
    }
    if (ms <= 0) {
      return "0s";
    }
    const totalSeconds = Math.floor(ms / 1e3);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds}s`);
    }
    return parts.join(" ");
  }
  function escapeHtml(str) {
    if (typeof str !== "string") {
      return "";
    }
    const htmlEscapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return str.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char);
  }
  function buildQueryString(params) {
    return params.filter((pair) => pair[1] !== void 0).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  }
  function delay(ms) {
    if (ms <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
  }
  const DEFAULT_SEARCH_DELAY = 1e4;
  const DEFAULT_DELETE_DELAY = 1e3;
  const DEFAULT_MAX_RETRIES = 3;
  const MESSAGES_PER_PAGE = 25;
  const DELETABLE_MESSAGE_TYPES = /* @__PURE__ */ new Set([
    0,
    // DEFAULT - regular user message
    6,
    // CHANNEL_PINNED_MESSAGE
    7,
    // USER_JOIN
    8,
    // GUILD_BOOST
    9,
    // GUILD_BOOST_TIER_1
    10,
    // GUILD_BOOST_TIER_2
    11,
    // GUILD_BOOST_TIER_3
    12,
    // CHANNEL_FOLLOW_ADD
    14,
    // GUILD_DISCOVERY_DISQUALIFIED
    15,
    // GUILD_DISCOVERY_REQUALIFIED
    16,
    // GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING
    17,
    // GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING
    18,
    // THREAD_CREATED
    19,
    // REPLY
    20,
    // CHAT_INPUT_COMMAND
    21
    // THREAD_STARTER_MESSAGE
  ]);
  const MAX_EMPTY_PAGE_RETRIES = 5;
  const TIME_WINDOW_SIZE_MS = 7 * 24 * 60 * 60 * 1e3;
  const EMPTY_PAGE_BACKOFF_MULTIPLIER = 1.3;
  const THROTTLE_RECOVERY_THRESHOLD = 5;
  const THROTTLE_RECOVERY_PERCENTAGE = 0.1;
  const THROTTLE_INCREASE_PERCENTAGE = 0.5;
  const BASELINE_DELETE_DELAY = 1e3;
  class DeletionEngine {
    apiClient;
    options = null;
    callbacks = {};
    state = {
      running: false,
      paused: false,
      deletedCount: 0,
      failedCount: 0,
      totalFound: 0,
      initialTotalFound: 0,
      currentOffset: 0
    };
    stats = {
      startTime: 0,
      throttledCount: 0,
      throttledTime: 0,
      averagePing: 0,
      estimatedTimeRemaining: -1
    };
    pingHistory = [];
    stopRequested = false;
    pausePromise = null;
    pauseResolve = null;
    compiledPattern = null;
    attemptedMessageIds = /* @__PURE__ */ new Set();
    // Rate limit smoothing state
    consecutiveSuccesses = 0;
    currentDelay = BASELINE_DELETE_DELAY;
    baselineDelay = BASELINE_DELETE_DELAY;
    isThrottled = false;
    // Persistence state
    lastProcessedMaxId = null;
    /**
     * Creates a new DeletionEngine instance.
     *
     * @param apiClient - The Discord API client for making requests
     */
    constructor(apiClient) {
      this.apiClient = apiClient;
    }
    /**
     * Configures the engine with deletion options.
     *
     * @param options - Partial options to merge with existing config
     */
    configure(options) {
      if (this.state.running) {
        throw new Error("Cannot configure while running");
      }
      this.options = {
        ...this.options ?? {},
        ...options
      };
      if (options.pattern !== void 0) {
        if (options.pattern) {
          const validationResult = validateRegex(options.pattern, "i");
          if (!validationResult.valid) {
            throw new Error(`Invalid regex pattern: ${validationResult.error}`);
          }
          this.compiledPattern = validationResult.regex ?? null;
        } else {
          this.compiledPattern = null;
        }
      }
    }
    /**
     * Sets event callbacks for the engine.
     *
     * @param callbacks - Callback functions for engine events
     */
    setCallbacks(callbacks) {
      this.callbacks = callbacks;
    }
    /**
     * Starts the deletion process.
     *
     * @throws Error if options are not configured or missing required fields
     */
    async start() {
      if (this.state.running) {
        throw new Error("Engine is already running");
      }
      if (!this.options) {
        throw new Error("Engine not configured");
      }
      if (!this.options.authToken || !this.options.authorId || !this.options.channelId) {
        throw new Error("Missing required options: authToken, authorId, channelId");
      }
      this.resetState();
      this.state.running = true;
      this.stats.startTime = Date.now();
      this.stopRequested = false;
      this.callbacks.onStart?.(this.getState(), this.getStats());
      try {
        await this.runDeletionLoop();
        if (!this.stopRequested) {
          this.clearSavedSession();
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.callbacks.onError?.(err);
        throw err;
      } finally {
        this.state.running = false;
        this.state.paused = false;
        this.callbacks.onStop?.(this.getState(), this.getStats());
      }
    }
    /**
     * Pauses the deletion process.
     */
    pause() {
      if (!this.state.running || this.state.paused) {
        return;
      }
      this.state.paused = true;
      this.pausePromise = new Promise((resolve) => {
        this.pauseResolve = resolve;
      });
    }
    /**
     * Resumes a paused deletion process.
     */
    resume() {
      if (!this.state.paused) {
        return;
      }
      this.state.paused = false;
      this.pauseResolve?.();
      this.pausePromise = null;
      this.pauseResolve = null;
    }
    /**
     * Stops the deletion process.
     */
    stop() {
      this.stopRequested = true;
      if (this.state.paused) {
        this.resume();
      }
    }
    /**
     * Preview messages that would be deleted without actually deleting them.
     * Satisfies SPEC requirements PRV-1, PRV-2, PRV-3.
     *
     * @returns Preview result with total count, sample messages, and estimated time
     */
    async preview() {
      if (this.state.running) {
        throw new Error("Cannot preview while running");
      }
      if (!this.options) {
        throw new Error("Engine not configured");
      }
      if (!this.options.authToken || !this.options.authorId || !this.options.channelId) {
        throw new Error("Missing required options: authToken, authorId, channelId");
      }
      const opts = this.options;
      const searchParams = {
        channelId: opts.channelId,
        authorId: opts.authorId,
        offset: 0
      };
      if (opts.guildId !== void 0) searchParams.guildId = opts.guildId;
      if (opts.content !== void 0) searchParams.content = opts.content;
      if (opts.hasLink !== void 0) searchParams.hasLink = opts.hasLink;
      if (opts.hasFile !== void 0) searchParams.hasFile = opts.hasFile;
      if (opts.minId !== void 0) searchParams.minId = opts.minId;
      if (opts.maxId !== void 0) searchParams.maxId = opts.maxId;
      if (opts.includePinned !== void 0) searchParams.includePinned = opts.includePinned;
      const result = await this.apiClient.searchMessages(searchParams);
      const messages = [];
      for (const messageGroup of result.messages) {
        for (const msg of messageGroup) {
          messages.push(msg);
        }
      }
      const deletableMessages = this.filterDeletableMessages(messages);
      const totalCount = result.total_results;
      const deleteDelay = opts.deleteDelay ?? DEFAULT_DELETE_DELAY;
      const searchDelay = opts.searchDelay ?? DEFAULT_SEARCH_DELAY;
      const pagesNeeded = Math.ceil(totalCount / MESSAGES_PER_PAGE);
      const estimatedTimeMs = totalCount * deleteDelay + pagesNeeded * searchDelay;
      return {
        totalCount,
        sampleMessages: deletableMessages.slice(0, 10),
        // Return up to 10 samples
        estimatedTimeMs
      };
    }
    /**
     * Returns a copy of the current state.
     */
    getState() {
      return { ...this.state };
    }
    /**
     * Returns a copy of the current statistics.
     */
    getStats() {
      return { ...this.stats };
    }
    // =========================================================================
    // Persistence Methods
    // =========================================================================
    /**
     * Checks if there is a saved session that can be resumed.
     *
     * @returns true if a valid, non-expired session exists
     */
    hasSavedSession() {
      return hasExistingSession();
    }
    /**
     * Loads a saved session if one exists.
     *
     * @returns The saved progress if it exists and is valid, null otherwise
     */
    loadSavedSession() {
      return loadProgress();
    }
    /**
     * Configures the engine from a saved progress state.
     * This allows resuming a previously interrupted deletion session.
     *
     * @param progress - The saved progress to resume from
     * @throws Error if the engine is currently running
     */
    resumeFromSaved(progress) {
      if (this.state.running) {
        throw new Error("Cannot resume while running");
      }
      const configOptions = {
        authorId: progress.authorId,
        maxId: progress.lastMaxId
      };
      if (progress.guildId) {
        configOptions.guildId = progress.guildId;
      }
      if (progress.channelId) {
        configOptions.channelId = progress.channelId;
      }
      if (progress.filters) {
        if (progress.filters.content !== void 0) {
          configOptions.content = progress.filters.content;
        }
        if (progress.filters.hasLink !== void 0) {
          configOptions.hasLink = progress.filters.hasLink;
        }
        if (progress.filters.hasFile !== void 0) {
          configOptions.hasFile = progress.filters.hasFile;
        }
        if (progress.filters.includePinned !== void 0) {
          configOptions.includePinned = progress.filters.includePinned;
        }
        if (progress.filters.pattern !== void 0) {
          configOptions.pattern = progress.filters.pattern;
        }
        if (progress.filters.minId !== void 0) {
          configOptions.minId = progress.filters.minId;
        }
      }
      this.configure(configOptions);
      this.state.deletedCount = progress.deletedCount;
      this.state.totalFound = progress.totalFound;
      this.state.initialTotalFound = progress.initialTotalFound ?? progress.totalFound;
      this.lastProcessedMaxId = progress.lastMaxId;
    }
    /**
     * Clears any saved session from localStorage.
     */
    clearSavedSession() {
      clearProgress();
    }
    /**
     * Saves the current progress to localStorage.
     * Called periodically during deletion (every 10 deletions).
     */
    saveProgressPeriodically() {
      if (!this.options) {
        return;
      }
      const progress = {
        authorId: this.options.authorId,
        lastMaxId: this.lastProcessedMaxId ?? this.options.maxId ?? "",
        deletedCount: this.state.deletedCount,
        totalFound: this.state.totalFound,
        initialTotalFound: this.state.initialTotalFound,
        timestamp: Date.now()
      };
      if (this.options.guildId) {
        progress.guildId = this.options.guildId;
      }
      if (this.options.channelId) {
        progress.channelId = this.options.channelId;
      }
      const filters = {};
      let hasFilters = false;
      if (this.options.content !== void 0) {
        filters.content = this.options.content;
        hasFilters = true;
      }
      if (this.options.hasLink !== void 0) {
        filters.hasLink = this.options.hasLink;
        hasFilters = true;
      }
      if (this.options.hasFile !== void 0) {
        filters.hasFile = this.options.hasFile;
        hasFilters = true;
      }
      if (this.options.includePinned !== void 0) {
        filters.includePinned = this.options.includePinned;
        hasFilters = true;
      }
      if (this.options.pattern !== void 0) {
        filters.pattern = this.options.pattern;
        hasFilters = true;
      }
      if (this.options.minId !== void 0) {
        filters.minId = this.options.minId;
        hasFilters = true;
      }
      if (hasFilters) {
        progress.filters = filters;
      }
      saveProgress(progress);
    }
    // =========================================================================
    // Private Methods
    // =========================================================================
    /**
     * Resets the internal state for a new deletion run.
     */
    resetState() {
      this.state = {
        running: false,
        paused: false,
        deletedCount: 0,
        failedCount: 0,
        totalFound: 0,
        initialTotalFound: 0,
        currentOffset: 0
      };
      this.stats = {
        startTime: 0,
        throttledCount: 0,
        throttledTime: 0,
        averagePing: 0,
        estimatedTimeRemaining: -1
      };
      this.pingHistory = [];
      this.pausePromise = null;
      this.pauseResolve = null;
      this.consecutiveSuccesses = 0;
      this.currentDelay = this.baselineDelay;
      this.isThrottled = false;
      this.lastProcessedMaxId = null;
      this.attemptedMessageIds = /* @__PURE__ */ new Set();
    }
    /**
     * Main deletion loop - searches for messages and deletes them.
     *
     * For 'newest' order (default): searches from offset 0 to handle the "shifting index" problem.
     * For 'oldest' order: uses time-based windows to process messages from oldest to newest.
     *
     * Tracks attempted message IDs to handle stale search index returning
     * already-deleted messages.
     */
    async runDeletionLoop() {
      if (this.options?.deletionOrder === "oldest") {
        await this.runOldestFirstDeletionLoop();
        return;
      }
      await this.runNewestFirstDeletionLoop();
    }
    /**
     * Deletion loop for newest-first ordering (default behavior).
     * Uses offset 0 and lets Discord return newest messages first.
     */
    async runNewestFirstDeletionLoop() {
      let emptyPageRetries = 0;
      let hasMorePages = true;
      while (hasMorePages && !this.stopRequested) {
        if (this.state.paused && this.pausePromise) {
          await this.pausePromise;
        }
        if (this.stopRequested) {
          break;
        }
        const messages = await this.searchWithRetry();
        const newMessages = messages.filter((msg) => !this.attemptedMessageIds.has(msg.id));
        if (newMessages.length === 0) {
          emptyPageRetries++;
          const rawSearchReturnedMessages = messages.length > 0;
          const apiReportsMoreMessages = this.state.totalFound > 0 && rawSearchReturnedMessages;
          if (emptyPageRetries >= MAX_EMPTY_PAGE_RETRIES && !apiReportsMoreMessages) {
            hasMorePages = false;
          } else if (emptyPageRetries >= MAX_EMPTY_PAGE_RETRIES && apiReportsMoreMessages) {
            emptyPageRetries = Math.floor(MAX_EMPTY_PAGE_RETRIES / 2);
          }
          const backoffDelay = Math.round(
            this.getSearchDelay() * EMPTY_PAGE_BACKOFF_MULTIPLIER ** (emptyPageRetries - 1)
          );
          await this.delay(backoffDelay);
          continue;
        }
        emptyPageRetries = 0;
        const deletableMessages = this.filterDeletableMessages(newMessages);
        await this.deleteMessagesInBatch(deletableMessages);
        await this.delay(this.getSearchDelay());
      }
    }
    /**
     * Deletion loop for oldest-first ordering.
     * Uses time-based windows to process messages chronologically from oldest to newest.
     */
    async runOldestFirstDeletionLoop() {
      const oldestDate = await this.findOldestMessageDate();
      if (!oldestDate) {
        return;
      }
      const windows = this.generateTimeWindows(oldestDate);
      for (const window2 of windows) {
        if (this.stopRequested) {
          break;
        }
        await this.processTimeWindow(window2.minId, window2.maxId);
      }
    }
    /**
     * Processes all messages within a specific time window.
     * Keeps searching until no more messages are found in the window.
     */
    async processTimeWindow(windowMinId, windowMaxId) {
      let emptyPageRetries = 0;
      let hasMoreInWindow = true;
      while (hasMoreInWindow && !this.stopRequested) {
        if (this.state.paused && this.pausePromise) {
          await this.pausePromise;
        }
        if (this.stopRequested) {
          break;
        }
        const messages = await this.searchWithConstraints(windowMinId, windowMaxId);
        const newMessages = messages.filter((msg) => !this.attemptedMessageIds.has(msg.id));
        if (newMessages.length === 0) {
          emptyPageRetries++;
          if (emptyPageRetries >= MAX_EMPTY_PAGE_RETRIES) {
            hasMoreInWindow = false;
          } else {
            const backoffDelay = Math.round(
              this.getSearchDelay() * EMPTY_PAGE_BACKOFF_MULTIPLIER ** (emptyPageRetries - 1)
            );
            await this.delay(backoffDelay);
          }
          continue;
        }
        emptyPageRetries = 0;
        const deletableMessages = this.filterDeletableMessages(newMessages);
        deletableMessages.sort((a, b) => {
          return BigInt(a.id) < BigInt(b.id) ? -1 : BigInt(a.id) > BigInt(b.id) ? 1 : 0;
        });
        await this.deleteMessagesInBatch(deletableMessages);
        await this.delay(this.getSearchDelay());
      }
    }
    /**
     * Deletes a batch of messages, handling pause/stop and tracking progress.
     */
    async deleteMessagesInBatch(messages) {
      for (const message of messages) {
        if (this.stopRequested) {
          break;
        }
        if (this.state.paused && this.pausePromise) {
          await this.pausePromise;
        }
        if (this.stopRequested) {
          break;
        }
        this.attemptedMessageIds.add(message.id);
        const success = await this.deleteWithRetry(message);
        if (success) {
          this.state.deletedCount++;
          this.lastProcessedMaxId = message.id;
          if (shouldSaveProgress(this.state.deletedCount)) {
            this.saveProgressPeriodically();
          }
        } else {
          this.state.failedCount++;
        }
        this.callbacks.onProgress?.(this.getState(), this.getStats(), message);
        this.updateEstimatedTime();
        await this.delay(this.getDeleteDelay());
      }
    }
    /**
     * Searches for messages with retry logic for rate limits.
     */
    async searchWithRetry() {
      const maxRetries = this.options?.maxRetries ?? DEFAULT_MAX_RETRIES;
      let retries = 0;
      while (retries < maxRetries) {
        try {
          const startTime = Date.now();
          const opts = this.options;
          if (!opts) {
            throw new Error("Options not configured");
          }
          const searchParams = {
            channelId: opts.channelId,
            authorId: opts.authorId,
            offset: 0
          };
          if (opts.guildId !== void 0) searchParams.guildId = opts.guildId;
          if (opts.content !== void 0) searchParams.content = opts.content;
          if (opts.hasLink !== void 0) searchParams.hasLink = opts.hasLink;
          if (opts.hasFile !== void 0) searchParams.hasFile = opts.hasFile;
          if (opts.minId !== void 0) searchParams.minId = opts.minId;
          if (opts.maxId !== void 0) searchParams.maxId = opts.maxId;
          if (opts.includePinned !== void 0) searchParams.includePinned = opts.includePinned;
          const response = await this.apiClient.searchMessages(searchParams);
          const ping = Date.now() - startTime;
          this.recordPing(ping);
          this.state.totalFound = response.total_results;
          if (this.state.initialTotalFound === 0) {
            this.state.initialTotalFound = response.total_results;
          }
          const messages = response.messages.map((group) => group[0]).filter((msg) => msg !== void 0);
          return messages;
        } catch (error) {
          const err = error;
          if (err.statusCode === 429) {
            const waitTime = (err.retryAfter ?? 5) * 1e3;
            this.stats.throttledCount++;
            this.stats.throttledTime += waitTime;
            await this.delay(waitTime);
            retries++;
          } else {
            throw error;
          }
        }
      }
      throw new Error(`Search failed after ${maxRetries} retries`);
    }
    /**
     * Deletes a message with retry logic for rate limits.
     * Implements smooth rate limit recovery with gradual delay adjustment.
     */
    async deleteWithRetry(message) {
      const maxRetries = this.options?.maxRetries ?? DEFAULT_MAX_RETRIES;
      let retries = 0;
      while (retries < maxRetries) {
        try {
          const startTime = Date.now();
          const response = await this.apiClient.deleteMessage(message.channel_id, message.id);
          const ping = Date.now() - startTime;
          this.recordPing(ping);
          if (response.success) {
            this.handleSuccessfulDeletion();
          }
          return response.success;
        } catch (error) {
          const err = error;
          if (err.statusCode === 429) {
            const retryAfterMs = (err.retryAfter ?? 1) * 1e3;
            this.handleRateLimit(retryAfterMs);
            this.stats.throttledCount++;
            this.stats.throttledTime += retryAfterMs;
            await this.delay(retryAfterMs);
            retries++;
          } else if (err.statusCode === 404) {
            return true;
          } else if (err.statusCode === 403) {
            return false;
          } else {
            this.callbacks.onError?.(err);
            return false;
          }
        }
      }
      return false;
    }
    /**
     * Handles successful deletion for smooth rate limit recovery.
     * After consecutive successes, gradually decreases delay toward baseline.
     */
    handleSuccessfulDeletion() {
      if (this.isThrottled) {
        this.consecutiveSuccesses++;
        if (this.consecutiveSuccesses >= THROTTLE_RECOVERY_THRESHOLD) {
          const gap = this.currentDelay - this.baselineDelay;
          const decrease = gap * THROTTLE_RECOVERY_PERCENTAGE;
          this.currentDelay = Math.max(this.baselineDelay, this.currentDelay - decrease);
          this.consecutiveSuccesses = 0;
          if (this.currentDelay <= this.baselineDelay) {
            this.currentDelay = this.baselineDelay;
            this.isThrottled = false;
          }
          this.callbacks.onRateLimitChange?.({
            isThrottled: this.isThrottled,
            currentDelay: this.currentDelay
          });
        }
      }
    }
    /**
     * Handles rate limit (429) response.
     * Increases delay by 50% of the gap toward retry_after value.
     */
    handleRateLimit(retryAfterMs) {
      const wasThrottled = this.isThrottled;
      this.isThrottled = true;
      this.consecutiveSuccesses = 0;
      const gap = retryAfterMs - this.currentDelay;
      if (gap > 0) {
        this.currentDelay = this.currentDelay + gap * THROTTLE_INCREASE_PERCENTAGE;
      }
      if (!wasThrottled || this.callbacks.onRateLimitChange) {
        this.callbacks.onRateLimitChange?.({
          isThrottled: this.isThrottled,
          currentDelay: this.currentDelay
        });
      }
    }
    /**
     * Filters messages to only include deletable types and matching patterns.
     */
    filterDeletableMessages(messages) {
      return messages.filter((message) => {
        if (!DELETABLE_MESSAGE_TYPES.has(message.type)) {
          return false;
        }
        if (message.pinned && !this.options?.includePinned) {
          return false;
        }
        if (this.compiledPattern && !this.compiledPattern.test(message.content)) {
          return false;
        }
        return true;
      });
    }
    /**
     * Records a ping time for average calculation.
     */
    recordPing(ping) {
      this.pingHistory.push(ping);
      if (this.pingHistory.length > 20) {
        this.pingHistory.shift();
      }
      const sum = this.pingHistory.reduce((a, b) => a + b, 0);
      this.stats.averagePing = Math.round(sum / this.pingHistory.length);
    }
    /**
     * Updates the estimated time remaining based on current progress.
     */
    updateEstimatedTime() {
      if (this.state.initialTotalFound === 0 || this.state.deletedCount === 0) {
        this.stats.estimatedTimeRemaining = -1;
        return;
      }
      const elapsedTime = Date.now() - this.stats.startTime;
      const messagesProcessed = this.state.deletedCount + this.state.failedCount;
      const messagesRemaining = this.state.initialTotalFound - messagesProcessed;
      if (messagesProcessed > 0) {
        const timePerMessage = elapsedTime / messagesProcessed;
        this.stats.estimatedTimeRemaining = Math.round(timePerMessage * messagesRemaining);
      }
    }
    /**
     * Returns the configured search delay.
     */
    getSearchDelay() {
      return this.options?.searchDelay ?? DEFAULT_SEARCH_DELAY;
    }
    /**
     * Returns the current delete delay, considering rate limit smoothing.
     * Uses the dynamically adjusted delay when throttled, otherwise uses configured delay.
     */
    getDeleteDelay() {
      if (this.isThrottled) {
        return this.currentDelay;
      }
      return this.options?.deleteDelay ?? DEFAULT_DELETE_DELAY;
    }
    /**
     * Finds the oldest message date by binary searching through time.
     * Discord search returns newest first, so we use max_id constraints to find oldest.
     *
     * @returns The date of the oldest message, or null if no messages found
     */
    async findOldestMessageDate() {
      const opts = this.options;
      if (!opts) return null;
      this.state.status = "Finding oldest message...";
      this.reportProgress();
      const searchParams = {
        channelId: opts.channelId,
        authorId: opts.authorId,
        offset: 0
      };
      if (opts.guildId !== void 0) searchParams.guildId = opts.guildId;
      if (opts.content !== void 0) searchParams.content = opts.content;
      if (opts.hasLink !== void 0) searchParams.hasLink = opts.hasLink;
      if (opts.hasFile !== void 0) searchParams.hasFile = opts.hasFile;
      if (opts.minId !== void 0) searchParams.minId = opts.minId;
      if (opts.maxId !== void 0) searchParams.maxId = opts.maxId;
      const initialResponse = await this.apiClient.searchMessages(searchParams);
      const totalResults = initialResponse.total_results ?? 0;
      if (this.state.initialTotalFound === 0) {
        this.state.initialTotalFound = totalResults;
      }
      this.state.totalFound = totalResults;
      const newestMessage = initialResponse.messages[0]?.[0];
      if (!newestMessage) return null;
      const newestDate = snowflakeToDate(newestMessage.id);
      const discordEpoch = /* @__PURE__ */ new Date("2015-01-01T00:00:00.000Z");
      let lowDate = discordEpoch;
      let highDate = newestDate;
      let oldestFound = null;
      const maxIterations = 20;
      let iterations = 0;
      while (iterations < maxIterations && highDate.getTime() - lowDate.getTime() > TIME_WINDOW_SIZE_MS) {
        iterations++;
        this.state.status = `Finding oldest message... (step ${iterations}/${maxIterations})`;
        this.reportProgress();
        const midDate = new Date((lowDate.getTime() + highDate.getTime()) / 2);
        const maxId = dateToSnowflake(midDate);
        const results = await this.searchWithConstraints(void 0, maxId);
        await this.delay(this.getSearchDelay());
        const oldestInBatch = results[results.length - 1];
        if (oldestInBatch) {
          oldestFound = snowflakeToDate(oldestInBatch.id);
          highDate = midDate;
        } else {
          lowDate = midDate;
        }
      }
      if (oldestFound === null) {
        oldestFound = newestDate;
      }
      this.state.status = void 0;
      return oldestFound;
    }
    /**
     * Searches for messages with optional min_id/max_id constraints.
     * Used for finding oldest message and window-based deletion.
     */
    async searchWithConstraints(minId, maxId) {
      const opts = this.options;
      if (!opts) return [];
      const searchParams = {
        channelId: opts.channelId,
        authorId: opts.authorId,
        offset: 0
      };
      if (opts.guildId !== void 0) searchParams.guildId = opts.guildId;
      if (opts.content !== void 0) searchParams.content = opts.content;
      if (opts.hasLink !== void 0) searchParams.hasLink = opts.hasLink;
      if (opts.hasFile !== void 0) searchParams.hasFile = opts.hasFile;
      if (opts.includePinned !== void 0) searchParams.includePinned = opts.includePinned;
      if (minId !== void 0) {
        if (opts.minId !== void 0) {
          searchParams.minId = BigInt(minId) > BigInt(opts.minId) ? minId : opts.minId;
        } else {
          searchParams.minId = minId;
        }
      } else if (opts.minId !== void 0) {
        searchParams.minId = opts.minId;
      }
      if (maxId !== void 0) {
        if (opts.maxId !== void 0) {
          searchParams.maxId = BigInt(maxId) < BigInt(opts.maxId) ? maxId : opts.maxId;
        } else {
          searchParams.maxId = maxId;
        }
      } else if (opts.maxId !== void 0) {
        searchParams.maxId = opts.maxId;
      }
      try {
        const response = await this.apiClient.searchMessages(searchParams);
        return response.messages.map((group) => group[0]).filter((msg) => msg !== void 0);
      } catch {
        return [];
      }
    }
    /**
     * Generates time windows from oldest to newest date.
     * Each window is TIME_WINDOW_SIZE_MS wide.
     *
     * @param oldestDate - The oldest message date
     * @param newestDate - The newest message date (defaults to now)
     * @returns Array of {minId, maxId} pairs representing time windows
     */
    generateTimeWindows(oldestDate, newestDate = /* @__PURE__ */ new Date()) {
      const windows = [];
      let windowStart = oldestDate.getTime();
      const endTime = newestDate.getTime();
      while (windowStart < endTime) {
        const windowEnd = Math.min(windowStart + TIME_WINDOW_SIZE_MS, endTime + 1);
        windows.push({
          minId: dateToSnowflake(new Date(windowStart)),
          maxId: dateToSnowflake(new Date(windowEnd))
        });
        windowStart = windowEnd;
      }
      return windows;
    }
    /**
     * Delays execution for the specified time.
     */
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Reports status changes to the UI via callback.
     */
    reportProgress() {
      this.callbacks.onStatus?.(this.state.status);
    }
  }
  function throttle(fn, intervalMs) {
    let lastRun = 0;
    let pending = null;
    const throttled = (...args) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun;
      if (pending) {
        clearTimeout(pending);
        pending = null;
      }
      if (timeSinceLastRun >= intervalMs) {
        lastRun = now;
        fn(...args);
      } else {
        pending = setTimeout(() => {
          lastRun = Date.now();
          pending = null;
          fn(...args);
        }, intervalMs - timeSinceLastRun);
      }
    };
    throttled.cancel = () => {
      if (pending) {
        clearTimeout(pending);
        pending = null;
      }
    };
    return throttled;
  }
  function debounce(fn, delayMs) {
    let pending = null;
    return (...args) => {
      if (pending) {
        clearTimeout(pending);
      }
      pending = setTimeout(() => {
        pending = null;
        fn(...args);
      }, delayMs);
    };
  }
  function scheduleFrame(fn) {
    const id = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(id);
  }
  function createBatchUpdater(applyFn, maxBatchSize = 50) {
    let pending = [];
    let scheduled = false;
    const flush = () => {
      if (pending.length === 0) return;
      const batch = pending.splice(0, maxBatchSize);
      applyFn(batch);
      scheduled = false;
      if (pending.length > 0) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    };
    return {
      add: (item) => {
        pending.push(item);
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(flush);
        }
      },
      flush: () => {
        if (pending.length > 0) {
          applyFn(pending);
          pending = [];
        }
        scheduled = false;
      }
    };
  }
  function createBoundedArray(maxSize) {
    const items = [];
    return {
      push: (item) => {
        if (items.length >= maxSize) {
          items.shift();
        }
        items.push(item);
      },
      getAll: () => [...items],
      clear: () => {
        items.length = 0;
      },
      get length() {
        return items.length;
      }
    };
  }
  function createCleanupManager() {
    const cleanups = [];
    return {
      add: (cleanup) => {
        cleanups.push(cleanup);
      },
      addInterval: (id) => {
        cleanups.push(() => clearInterval(id));
      },
      addTimeout: (id) => {
        cleanups.push(() => clearTimeout(id));
      },
      addListener: (target, event, handler, options) => {
        target.addEventListener(event, handler, options);
        cleanups.push(() => target.removeEventListener(event, handler, options));
      },
      dispose: () => {
        for (const cleanup of cleanups) {
          try {
            cleanup();
          } catch {
          }
        }
        cleanups.length = 0;
      }
    };
  }
  function appendMany(container, elements) {
    if (elements.length === 0) return;
    const fragment = document.createDocumentFragment();
    for (const el of elements) {
      fragment.appendChild(el);
    }
    container.appendChild(fragment);
  }
  function trimChildren(container, maxChildren, removeFromEnd = true) {
    const childCount = container.children.length;
    if (childCount <= maxChildren) return;
    requestAnimationFrame(() => {
      const toRemove = childCount - maxChildren;
      for (let i = 0; i < toRemove; i++) {
        const child = removeFromEnd ? container.lastElementChild : container.firstElementChild;
        child?.remove();
      }
    });
  }
  function lazy(factory) {
    let value;
    let initialized = false;
    return () => {
      if (!initialized) {
        value = factory();
        initialized = true;
      }
      return value;
    };
  }
  function createOptimizedObserver(target, options) {
    const { callback, throttleMs = 1e3, observe } = options;
    let pendingMutations = [];
    let scheduled = false;
    const flush = () => {
      if (pendingMutations.length > 0) {
        callback(pendingMutations);
        pendingMutations = [];
      }
      scheduled = false;
    };
    const throttledFlush = throttle(flush, throttleMs);
    const observer = new MutationObserver((mutations) => {
      pendingMutations.push(...mutations);
      if (!scheduled) {
        scheduled = true;
        throttledFlush();
      }
    });
    observer.observe(target, observe);
    return {
      disconnect: () => {
        observer.disconnect();
        pendingMutations = [];
      }
    };
  }
  const CONFETTI_COLORS = [
    "#5865F2",
    // Blurple
    "#57F287",
    // Green
    "#FEE75C",
    // Yellow
    "#EB459E",
    // Fuchsia
    "#ED4245"
    // Red
  ];
  function createConfetti(container, count = 30, duration = 3e3) {
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      const x = Math.random() * 100;
      confetti.style.setProperty("--x", `${x}%`);
      const delay2 = Math.random() * 0.5;
      confetti.style.setProperty("--delay", `${delay2}s`);
      const colorIndex = Math.floor(Math.random() * CONFETTI_COLORS.length);
      confetti.style.backgroundColor = CONFETTI_COLORS[colorIndex] ?? "#5865F2";
      const size = 8 + Math.random() * 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      fragment.appendChild(confetti);
    }
    confettiContainer.appendChild(fragment);
    container.appendChild(confettiContainer);
    setTimeout(() => {
      confettiContainer.remove();
    }, duration);
  }
  function shakeElement(element, duration = 400) {
    return new Promise((resolve) => {
      element.classList.add("shaking");
      setTimeout(() => {
        element.classList.remove("shaking");
        resolve();
      }, duration);
    });
  }
  function flashElement(container, duration = 300) {
    return new Promise((resolve) => {
      const flash = document.createElement("div");
      flash.className = "flash-overlay";
      container.appendChild(flash);
      setTimeout(() => {
        flash.remove();
        resolve();
      }, duration);
    });
  }
  function runCountdownSequence(container, onComplete) {
    let cancelled = false;
    const countdownOverlay = document.createElement("div");
    countdownOverlay.className = "detcord-countdown-overlay";
    container.appendChild(countdownOverlay);
    const sequence = ["3", "2", "1", "BOOM"];
    const delays = [900, 900, 900, 500];
    const runStep = (index2) => {
      if (cancelled || index2 >= sequence.length) {
        if (!cancelled) {
          countdownOverlay.remove();
          onComplete();
        }
        return;
      }
      const value = sequence[index2] ?? "";
      const isBoom = value === "BOOM";
      countdownOverlay.innerHTML = "";
      const countEl = document.createElement("div");
      countEl.className = isBoom ? "countdown-boom" : "countdown-number";
      countEl.textContent = isBoom ? "💥 BOOM" : value;
      countdownOverlay.appendChild(countEl);
      shakeElement(container);
      if (isBoom) {
        flashElement(container);
      }
      setTimeout(() => runStep(index2 + 1), delays[index2]);
    };
    runStep(0);
    return () => {
      cancelled = true;
      countdownOverlay.remove();
    };
  }
  const STATUS_MESSAGES = [
    // Classic
    "Erasing evidence...",
    "Gone. Reduced to atoms...",
    "Making messages disappear...",
    "Cleaning up the mess...",
    "Scrubbing the timeline...",
    "History? What history?",
    "Deleting with extreme prejudice...",
    "Messages go brrr...",
    "Witness protection program activated...",
    "Nothing to see here...",
    "Vanishing into thin air...",
    "Clearing the paper trail...",
    "Memory hole activated...",
    "Shredding the receipts...",
    "Digital amnesia in progress...",
    // Movie references
    "I have a particular set of skills...",
    "These are not the messages you seek...",
    "Hasta la vista, messages...",
    "You shall not pass... to the server...",
    "I'll be back... to delete more...",
    "Say hello to my little delete button...",
    "You can't handle the deletion...",
    "Here's Johnny... deleting stuff...",
    "Run, messages. Run!",
    "To delete, or not to delete...",
    // Tech humor
    "sudo rm -rf messages/*",
    "git reset --hard origin/empty",
    "DROP TABLE messages;",
    "Garbage collection in progress...",
    "Defragmenting your past...",
    "/dev/null is hungry...",
    "Bit by bit, byte by byte...",
    "Recursively removing regrets...",
    "Purging the cache of shame...",
    "malloc failed: no space for cringe...",
    // Dramatic
    "The cleansing has begun...",
    "Reducing digital footprint...",
    "Scorched earth protocol active...",
    "Purification in progress...",
    "Dawn of a new timeline...",
    "Rising from the ashes...",
    "Rewriting history...",
    "The great purge continues...",
    // Casual/Funny
    "Oops, did I delete that?",
    "Messages? What messages?",
    "Spring cleaning, Discord edition...",
    "Making Marie Kondo proud...",
    "This sparks no joy... deleted!",
    "Yeeting messages into the void...",
    "Sending to /dev/null...",
    "Poof! Gone!",
    "And just like that... gone.",
    "Magic tricks with data...",
    "Abracadabra... disappearo!",
    "Thanos snapping messages...",
    "I don't remember posting that...",
    "What happens in Discord stays... deleted",
    "Ctrl+Z? Never heard of her...",
    // Progress updates
    "Still going strong...",
    "No rest for the wicked...",
    "On a roll here...",
    "Making good progress...",
    "Almost there... probably...",
    "Keep calm and delete on...",
    "One message at a time...",
    "Patience, young grasshopper...",
    // Philosophical
    "To exist is temporary...",
    "All things must pass...",
    "Entropy always wins...",
    "Nothing lasts forever...",
    "Change is the only constant...",
    "Let go of the past...",
    "New beginnings require endings...",
    // Misc
    "Beep boop, messages go poof...",
    "Cleaning up after past you...",
    "Future you will thank me...",
    "The void welcomes all...",
    "Processing regret removal...",
    "Sanitizing the timeline...",
    "Removing evidence of existence...",
    "Making room for new mistakes...",
    "Out with the old...",
    "Decluttering your digital life...",
    "Memory? What memory?",
    "The internet forgets nothing... except this.",
    "Removing traces of 3am you...",
    "Your secrets are safe... nowhere.",
    "Deleting faster than you can type..."
  ];
  function createStatusRotator(element, intervalMs = 3e3) {
    let intervalId = null;
    let currentIndex = 0;
    const updateMessage = () => {
      element.classList.remove("rotating");
      void element.offsetWidth;
      element.classList.add("rotating");
      element.textContent = STATUS_MESSAGES[currentIndex] ?? STATUS_MESSAGES[0] ?? "";
      currentIndex = (currentIndex + 1) % STATUS_MESSAGES.length;
    };
    return {
      start: () => {
        updateMessage();
        intervalId = window.setInterval(updateMessage, intervalMs);
      },
      stop: () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
        element.classList.remove("rotating");
      }
    };
  }
  const ICONS = {
    warning: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
		<path d="M12 2L1 21h22L12 2Zm0 4 7.53 13H4.47L12 6Zm-1 5v4h2v-4h-2Zm0 6v2h2v-2h-2Z"/>
	</svg>`
  };
  function createElement(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (key === "class") {
          el.className = value;
        } else if (key.startsWith("data-")) {
          el.dataset[key.slice(5)] = value;
        } else if (key.startsWith("aria-")) {
          el.setAttribute(key, value);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
    if (children) {
      for (const child of children) {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      }
    }
    return el;
  }
  function createPreviewScreenContent(totalCount, estimatedTime, sampleMessages) {
    const fragment = document.createDocumentFragment();
    const summary = createElement("div", { class: "preview-summary" }, []);
    const countEl = createElement("div", { class: "preview-count" }, [String(totalCount)]);
    const countLabel = createElement("div", { class: "preview-count-label" }, [
      "messages will be deleted"
    ]);
    const estimate = createElement("div", { class: "preview-estimate" }, [
      "Estimated time: ",
      createElement("strong", {}, [estimatedTime])
    ]);
    summary.appendChild(countEl);
    summary.appendChild(countLabel);
    summary.appendChild(estimate);
    fragment.appendChild(summary);
    if (sampleMessages.length > 0) {
      const sampleHeader = createElement("h3", { class: "screen-title text-small mt-16 mb-8" }, [
        "Sample Messages"
      ]);
      fragment.appendChild(sampleHeader);
      const messagesContainer = createElement("div", { class: "preview-messages" }, []);
      for (const msg of sampleMessages.slice(0, 5)) {
        const msgEl = createPreviewMessageElement(msg);
        messagesContainer.appendChild(msgEl);
      }
      fragment.appendChild(messagesContainer);
    }
    const warning = createElement("div", { class: "warning-banner mt-16" }, []);
    warning.innerHTML = `${ICONS.warning}`;
    warning.appendChild(
      createElement("span", { class: "warning-banner-text" }, [
        "This action cannot be undone. Messages will be permanently deleted."
      ])
    );
    fragment.appendChild(warning);
    return fragment;
  }
  function createPreviewMessageElement(message) {
    const date = new Date(message.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const truncated = message.content.length > 100 ? `${message.content.slice(0, 100)}...` : message.content;
    const messageEl = createElement("div", { class: "preview-message" }, []);
    const avatar = createElement("div", { class: "preview-avatar" }, []);
    messageEl.appendChild(avatar);
    const meta = createElement("div", { class: "preview-meta" }, []);
    const authorLine = createElement("span", {}, []);
    if (message.authorName) {
      const authorSpan = createElement("span", { class: "preview-author" }, [message.authorName]);
      authorLine.appendChild(authorSpan);
    }
    const timestamp = createElement("span", { class: "preview-timestamp" }, [
      `${dateStr} ${timeStr}`
    ]);
    authorLine.appendChild(timestamp);
    meta.appendChild(authorLine);
    const content = createElement("div", { class: "preview-content" }, [truncated || "[No content]"]);
    meta.appendChild(content);
    messageEl.appendChild(meta);
    return messageEl;
  }
  const DEFAULT_MAX_FEED_ENTRIES = 100;
  const DEFAULT_PROGRESS_THROTTLE_MS = 100;
  const DEFAULT_FEED_THROTTLE_MS = 50;
  const MAX_PREVIEW_LENGTH = 80;
  const CSS_PREFIX = "detcord";
  const WINDOW_Z_INDEX = 999999;
  const STYLES = `
/* ============================================
   DETCORD WIZARD UI - Clean Sweep Edition
   ============================================ */

/* Trigger Button */
.${CSS_PREFIX}-trigger {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 52px;
	height: 52px;
	border-radius: 50%;
	background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 16px rgba(88, 101, 242, 0.4);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: ${WINDOW_Z_INDEX};
}

.${CSS_PREFIX}-trigger:hover {
	transform: scale(1.08);
	box-shadow: 0 6px 24px rgba(88, 101, 242, 0.5);
}

.${CSS_PREFIX}-trigger svg {
	width: 24px;
	height: 24px;
	fill: white;
}

/* Window */
.${CSS_PREFIX}-window {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 420px;
	max-width: 95vw;
	max-height: 85vh;
	background: #1e1f22;
	border-radius: 12px;
	box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
	z-index: ${WINDOW_Z_INDEX + 1};
	display: none;
	flex-direction: column;
	overflow: visible;
	font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	color: #dbdee1;
	font-size: 14px;
}

.${CSS_PREFIX}-window.visible {
	display: flex;
	animation: detcord-fade-in 0.2s ease-out;
}

@keyframes detcord-fade-in {
	from { opacity: 0; transform: translate(-50%, -48%); }
	to { opacity: 1; transform: translate(-50%, -50%); }
}

/* Backdrop */
.${CSS_PREFIX}-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	z-index: ${WINDOW_Z_INDEX};
	display: none;
	backdrop-filter: blur(2px);
}

.${CSS_PREFIX}-backdrop.visible {
	display: block;
	animation: detcord-backdrop-in 0.2s ease-out;
}

@keyframes detcord-backdrop-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

/* Header */
.${CSS_PREFIX}-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	background: #2b2d31;
	border-bottom: 1px solid #1e1f22;
}

.${CSS_PREFIX}-header h2 {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #f2f3f5;
}

.${CSS_PREFIX}-close {
	width: 28px;
	height: 28px;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: background 0.15s ease;
}

.${CSS_PREFIX}-close:hover {
	background: #383a40;
}

.${CSS_PREFIX}-close svg {
	width: 18px;
	height: 18px;
	fill: #b5bac1;
	transition: fill 0.15s ease;
}

.${CSS_PREFIX}-close:hover svg {
	fill: #f2f3f5;
}

/* Minimize Button */
.${CSS_PREFIX}-minimize {
	width: 28px;
	height: 28px;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: background 0.15s ease;
	margin-right: 4px;
}

.${CSS_PREFIX}-minimize:hover {
	background: #383a40;
}

.${CSS_PREFIX}-minimize svg {
	width: 18px;
	height: 18px;
	fill: #b5bac1;
	transition: fill 0.15s ease;
}

.${CSS_PREFIX}-minimize:hover svg {
	fill: #f2f3f5;
}

/* Header buttons container */
.${CSS_PREFIX}-header-buttons {
	display: flex;
	align-items: center;
}

/* Minimized Indicator */
.${CSS_PREFIX}-mini-indicator {
	position: fixed;
	bottom: 80px;
	right: 20px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: #2b2d31;
	border: 3px solid #5865f2;
	display: none;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: ${WINDOW_Z_INDEX + 2};
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	transition: all 0.2s ease;
}

.${CSS_PREFIX}-mini-indicator.visible {
	display: flex;
	animation: detcord-fade-in 0.2s ease-out;
}

.${CSS_PREFIX}-mini-indicator:hover {
	transform: scale(1.08);
	box-shadow: 0 6px 24px rgba(88, 101, 242, 0.4);
}

.${CSS_PREFIX}-mini-progress {
	position: relative;
	width: 44px;
	height: 44px;
}

.${CSS_PREFIX}-mini-ring {
	width: 100px%;
	height: 100%;
	transform: rotate(-90deg);
}

.${CSS_PREFIX}-mini-ring-bg {
	fill: none;
	stroke: #3f4147;
	stroke-width: 4;
}

.${CSS_PREFIX}-mini-ring-fill {
	fill: none;
	stroke: #5865f2;
	stroke-width: 4;
	stroke-linecap: round;
	stroke-dasharray: 126;
	stroke-dashoffset: 126;
	transition: stroke-dashoffset 0.3s ease;
}

.${CSS_PREFIX}-mini-percent {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 12px;
	font-weight: 700;
	color: #f2f3f5;
}

/* Step Indicator */
.${CSS_PREFIX}-steps {
	display: flex;
	justify-content: center;
	gap: 8px;
	padding: 16px 20px 0;
}

.${CSS_PREFIX}-step-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #3f4147;
	transition: all 0.3s ease;
}

.${CSS_PREFIX}-step-dot.active {
	background: #5865f2;
	box-shadow: 0 0 8px rgba(88, 101, 242, 0.5);
}

.${CSS_PREFIX}-step-dot.completed {
	background: #23a559;
}

/* Content */
.${CSS_PREFIX}-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 20px;
	max-height: calc(85vh - 120px);
}

/* Screens */
.${CSS_PREFIX}-screen {
	display: none;
}

.${CSS_PREFIX}-screen.active {
	display: block;
	animation: detcord-step-in 0.25s ease-out;
}

@keyframes detcord-step-in {
	from { opacity: 0; transform: translateX(10px); }
	to { opacity: 1; transform: translateX(0); }
}

/* Step Title */
.${CSS_PREFIX}-step-title {
	font-size: 20px;
	font-weight: 600;
	color: #f2f3f5;
	margin: 0 0 20px 0;
	text-align: center;
}

/* Location Cards */
.${CSS_PREFIX}-cards {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
	margin-bottom: 16px;
}

.${CSS_PREFIX}-card {
	background: #2b2d31;
	border: 2px solid transparent;
	border-radius: 8px;
	padding: 20px 16px;
	cursor: pointer;
	text-align: center;
	transition: all 0.2s ease;
}

.${CSS_PREFIX}-card:hover {
	background: #32353b;
	border-color: #3f4147;
}

.${CSS_PREFIX}-card.selected {
	background: rgba(88, 101, 242, 0.15);
	border-color: #5865f2;
}

.${CSS_PREFIX}-card.full-width {
	grid-column: 1 / -1;
}

.${CSS_PREFIX}-card-icon {
	font-size: 32px;
	margin-bottom: 8px;
}

.${CSS_PREFIX}-card-title {
	font-size: 14px;
	font-weight: 600;
	color: #f2f3f5;
	margin-bottom: 4px;
}

.${CSS_PREFIX}-card-desc {
	font-size: 12px;
	color: #b5bac1;
}

/* Manual Channel Input */
.${CSS_PREFIX}-manual-input {
	margin-top: 12px;
	display: none;
}

.${CSS_PREFIX}-manual-input.visible {
	display: block;
	animation: detcord-step-in 0.2s ease-out;
}

.${CSS_PREFIX}-manual-input input {
	width: 100%;
	padding: 12px;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 8px;
	color: #f2f3f5;
	font-size: 14px;
	box-sizing: border-box;
	transition: border-color 0.15s ease;
}

.${CSS_PREFIX}-manual-input input:focus {
	outline: none;
	border-color: #5865f2;
}

.${CSS_PREFIX}-manual-input input::placeholder {
	color: #6d6f78;
}

/* Time Range Options */
.${CSS_PREFIX}-options {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.${CSS_PREFIX}-option {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	background: #2b2d31;
	border: 2px solid transparent;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.${CSS_PREFIX}-option:hover {
	background: #32353b;
}

.${CSS_PREFIX}-option.selected {
	background: rgba(88, 101, 242, 0.15);
	border-color: #5865f2;
}

.${CSS_PREFIX}-option-radio {
	width: 18px;
	height: 18px;
	border: 2px solid #6d6f78;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: all 0.2s ease;
}

.${CSS_PREFIX}-option.selected .${CSS_PREFIX}-option-radio {
	border-color: #5865f2;
}

.${CSS_PREFIX}-option.selected .${CSS_PREFIX}-option-radio::after {
	content: '';
	width: 8px;
	height: 8px;
	background: #5865f2;
	border-radius: 50%;
}

.${CSS_PREFIX}-option-label {
	flex: 1;
	font-size: 14px;
	color: #f2f3f5;
}

.${CSS_PREFIX}-option-hint {
	font-size: 12px;
	color: #6d6f78;
}

/* Custom Date Range */
.${CSS_PREFIX}-date-range {
	display: none;
	gap: 12px;
	margin-top: 12px;
}

.${CSS_PREFIX}-date-range.visible {
	display: flex;
	animation: detcord-step-in 0.2s ease-out;
}

.${CSS_PREFIX}-date-range input {
	flex: 1;
	padding: 10px 12px;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 8px;
	color: #f2f3f5;
	font-size: 14px;
	box-sizing: border-box;
}

.${CSS_PREFIX}-date-range input:focus {
	outline: none;
	border-color: #5865f2;
}

/* Toggle Switches */
.${CSS_PREFIX}-toggles {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.${CSS_PREFIX}-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
	border-bottom: 1px solid #2b2d31;
}

.${CSS_PREFIX}-toggle:last-child {
	border-bottom: none;
}

.${CSS_PREFIX}-toggle-label {
	font-size: 14px;
	color: #f2f3f5;
}

.${CSS_PREFIX}-toggle-switch {
	width: 40px;
	height: 24px;
	background: #3f4147;
	border-radius: 12px;
	cursor: pointer;
	position: relative;
	transition: background 0.2s ease;
}

.${CSS_PREFIX}-toggle-switch.on {
	background: #23a559;
}

.${CSS_PREFIX}-toggle-switch::after {
	content: '';
	position: absolute;
	width: 18px;
	height: 18px;
	background: #fff;
	border-radius: 50%;
	top: 3px;
	left: 3px;
	transition: transform 0.2s ease;
}

.${CSS_PREFIX}-toggle-switch.on::after {
	transform: translateX(16px);
}

/* Deletion Order */
.${CSS_PREFIX}-deletion-order {
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid #2b2d31;
}

.${CSS_PREFIX}-deletion-order-label {
	display: block;
	font-size: 12px;
	font-weight: 600;
	color: #b5bac1;
	text-transform: uppercase;
	margin-bottom: 12px;
}

.${CSS_PREFIX}-radio-group {
	display: flex;
	gap: 24px;
}

.${CSS_PREFIX}-radio {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.${CSS_PREFIX}-radio input[type="radio"] {
	width: 18px;
	height: 18px;
	margin: 0;
	accent-color: #5865f2;
	cursor: pointer;
}

.${CSS_PREFIX}-radio-label {
	font-size: 14px;
	color: #f2f3f5;
}

/* Text Filter */
.${CSS_PREFIX}-filter-input {
	margin-top: 16px;
}

.${CSS_PREFIX}-filter-input label {
	display: block;
	font-size: 12px;
	font-weight: 600;
	color: #b5bac1;
	text-transform: uppercase;
	margin-bottom: 8px;
}

.${CSS_PREFIX}-filter-input input {
	width: 100%;
	padding: 12px;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 8px;
	color: #f2f3f5;
	font-size: 14px;
	box-sizing: border-box;
}

.${CSS_PREFIX}-filter-input input:focus {
	outline: none;
	border-color: #5865f2;
}

/* Review Summary */
.${CSS_PREFIX}-summary {
	background: #2b2d31;
	border-radius: 12px;
	padding: 24px;
	text-align: center;
	margin-bottom: 20px;
}

.${CSS_PREFIX}-summary-count {
	font-size: 48px;
	font-weight: 700;
	color: #f2f3f5;
	line-height: 1;
}

.${CSS_PREFIX}-summary-label {
	font-size: 14px;
	color: #b5bac1;
	margin-top: 4px;
}

.${CSS_PREFIX}-summary-details {
	font-size: 13px;
	color: #6d6f78;
	margin-top: 12px;
}

/* Preview Messages */
.${CSS_PREFIX}-preview-list {
	margin-top: 16px;
}

.${CSS_PREFIX}-preview-label {
	font-size: 12px;
	font-weight: 600;
	color: #b5bac1;
	text-transform: uppercase;
	margin-bottom: 8px;
}

.${CSS_PREFIX}-preview-messages {
	background: #1e1f22;
	border-radius: 8px;
	padding: 8px;
	max-height: 120px;
	overflow-y: auto;
}

.${CSS_PREFIX}-preview-msg {
	padding: 8px 10px;
	font-size: 13px;
	color: #b5bac1;
	border-radius: 4px;
	margin-bottom: 4px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.${CSS_PREFIX}-preview-msg:last-child {
	margin-bottom: 0;
}

/* Buttons */
.${CSS_PREFIX}-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 20px;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.15s ease;
}

.${CSS_PREFIX}-btn-primary {
	background: #5865f2;
	color: #fff;
}

.${CSS_PREFIX}-btn-primary:hover {
	background: #4752c4;
}

.${CSS_PREFIX}-btn-primary:disabled {
	background: #3f4147;
	color: #6d6f78;
	cursor: not-allowed;
}

.${CSS_PREFIX}-btn-sweep {
	background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
	color: #fff;
	font-size: 15px;
	padding: 14px 24px;
}

.${CSS_PREFIX}-btn-sweep:hover {
	box-shadow: 0 4px 16px rgba(88, 101, 242, 0.4);
	transform: translateY(-1px);
}

.${CSS_PREFIX}-btn-secondary {
	background: #2b2d31;
	color: #f2f3f5;
}

.${CSS_PREFIX}-btn-secondary:hover {
	background: #383a40;
}

.${CSS_PREFIX}-btn-ghost {
	background: transparent;
	color: #b5bac1;
}

.${CSS_PREFIX}-btn-ghost:hover {
	color: #f2f3f5;
}

.${CSS_PREFIX}-btn-group {
	display: flex;
	gap: 12px;
	margin-top: 20px;
}

/* Progress Screen */
.${CSS_PREFIX}-progress-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px 0;
}

.${CSS_PREFIX}-progress-ring-container {
	position: relative;
	width: 140px;
	height: 140px;
	margin-bottom: 16px;
}

.${CSS_PREFIX}-progress-ring {
	width: 100%;
	height: 100%;
	transform: rotate(-90deg);
}

.${CSS_PREFIX}-progress-ring-bg {
	fill: none;
	stroke: #3f4147;
	stroke-width: 8;
}

.${CSS_PREFIX}-progress-ring-fill {
	fill: none;
	stroke: url(#detcord-gradient);
	stroke-width: 8;
	stroke-linecap: round;
	stroke-dasharray: 377;
	stroke-dashoffset: 377;
	transition: stroke-dashoffset 0.5s ease;
	filter: drop-shadow(0 0 8px rgba(88, 101, 242, 0.5));
}

.${CSS_PREFIX}-progress-ring-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}

.${CSS_PREFIX}-progress-percent {
	font-size: 36px;
	font-weight: 700;
	color: #f2f3f5;
	line-height: 1;
}

.${CSS_PREFIX}-progress-count {
	font-size: 12px;
	color: #b5bac1;
	margin-top: 4px;
}

.${CSS_PREFIX}-progress-stats {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
	width: 100%;
	margin-top: 16px;
}

.${CSS_PREFIX}-stat {
	text-align: center;
	padding: 12px;
	background: #2b2d31;
	border-radius: 8px;
}

.${CSS_PREFIX}-stat-value {
	font-size: 20px;
	font-weight: 700;
	color: #f2f3f5;
}

.${CSS_PREFIX}-stat-value.success { color: #23a559; }
.${CSS_PREFIX}-stat-value.error { color: #f23f43; }
.${CSS_PREFIX}-stat-value.rate { color: #5865f2; }

.${CSS_PREFIX}-stat-label {
	font-size: 11px;
	color: #6d6f78;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-top: 2px;
}

.${CSS_PREFIX}-progress-bar-container {
	width: 100%;
	height: 6px;
	background: #3f4147;
	border-radius: 3px;
	overflow: hidden;
	margin-top: 16px;
	position: relative;
}

.${CSS_PREFIX}-progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #5865f2 0%, #7289da 50%, #5865f2 100%);
	background-size: 200% 100%;
	border-radius: 3px;
	transition: width 0.3s ease;
	animation: detcord-progress-shimmer 2s linear infinite;
}

@keyframes detcord-progress-shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}

.${CSS_PREFIX}-progress-eta {
	font-size: 13px;
	color: #b5bac1;
	margin-top: 12px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.${CSS_PREFIX}-progress-eta::before {
	content: '⏱';
}

.${CSS_PREFIX}-current-message {
	width: 100%;
	padding: 10px 12px;
	background: #1e1f22;
	border-radius: 8px;
	margin-top: 12px;
	font-size: 12px;
	color: #6d6f78;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.${CSS_PREFIX}-current-message::before {
	content: '🗑️ ';
}

.${CSS_PREFIX}-current-message.${CSS_PREFIX}-status-searching::before {
	content: '🔍 ';
}

.${CSS_PREFIX}-current-message.${CSS_PREFIX}-status-searching {
	animation: ${CSS_PREFIX}-pulse 1.5s ease-in-out infinite;
}

@keyframes ${CSS_PREFIX}-pulse {
	0%, 100% { opacity: 0.7; }
	50% { opacity: 1; }
}

/* Status Speaker */
.${CSS_PREFIX}-status-speaker {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 16px;
	padding: 0 4px;
}

.${CSS_PREFIX}-speaker-avatar {
	width: 40px;
	height: 40px;
	background: linear-gradient(135deg, #5865f2 0%, #7289da 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	flex-shrink: 0;
	box-shadow: 0 2px 8px rgba(88, 101, 242, 0.3);
}

.${CSS_PREFIX}-speaker-bubble {
	flex: 1;
	background: #2b2d31;
	border-radius: 12px;
	border-top-left-radius: 4px;
	padding: 12px 16px;
	position: relative;
}

.${CSS_PREFIX}-speaker-bubble::before {
	content: '';
	position: absolute;
	left: -8px;
	top: 12px;
	width: 0;
	height: 0;
	border-top: 6px solid transparent;
	border-bottom: 6px solid transparent;
	border-right: 8px solid #2b2d31;
}

.${CSS_PREFIX}-status-message {
	font-size: 14px;
	color: #dbdee1;
	font-style: italic;
	line-height: 1.4;
}

.${CSS_PREFIX}-status-message.rotating {
	animation: detcord-status-fade 0.4s ease-out;
}

@keyframes detcord-status-fade {
	0% { opacity: 0; transform: translateY(-4px); }
	100% { opacity: 1; transform: translateY(0); }
}

/* Time Stats */
.${CSS_PREFIX}-time-stats {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 12px;
	padding: 8px 0;
	border-top: 1px solid #3f4147;
}

.${CSS_PREFIX}-time-stat {
	display: flex;
	gap: 4px;
	font-size: 12px;
}

.${CSS_PREFIX}-time-label {
	color: #6d6f78;
}

.${CSS_PREFIX}-time-value {
	color: #dbdee1;
	font-weight: 500;
}

/* Feed */
.${CSS_PREFIX}-feed {
	margin-top: 20px;
	max-height: 140px;
	overflow-y: auto;
	background: #1e1f22;
	border-radius: 8px;
	padding: 8px;
}

.${CSS_PREFIX}-feed-entry {
	padding: 6px 10px;
	font-size: 12px;
	border-radius: 4px;
	margin-bottom: 4px;
	font-family: 'Consolas', 'Monaco', monospace;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.${CSS_PREFIX}-feed-entry.success {
	color: #23a559;
}

.${CSS_PREFIX}-feed-entry.error {
	color: #f23f43;
}

/* Complete Screen */
.${CSS_PREFIX}-complete {
	text-align: center;
	padding: 30px 0;
}

.${CSS_PREFIX}-complete-icon {
	font-size: 64px;
	margin-bottom: 16px;
}

.${CSS_PREFIX}-complete-title {
	font-size: 24px;
	font-weight: 700;
	color: #f2f3f5;
	margin: 0 0 8px 0;
}

.${CSS_PREFIX}-complete-stats {
	font-size: 15px;
	color: #b5bac1;
}

.${CSS_PREFIX}-complete-time {
	font-size: 13px;
	color: #6d6f78;
	margin-top: 4px;
}

.${CSS_PREFIX}-complete-throttle {
	font-size: 12px;
	color: #ed4245;
	margin-top: 8px;
	padding: 6px 12px;
	background: rgba(237, 66, 69, 0.1);
	border-radius: 4px;
}

/* Error Screen */
.${CSS_PREFIX}-error-message {
	padding: 16px;
	background: rgba(242, 63, 67, 0.1);
	border: 1px solid rgba(242, 63, 67, 0.3);
	border-radius: 8px;
	color: #f2f3f5;
	margin-bottom: 16px;
}

.${CSS_PREFIX}-form-group {
	margin-bottom: 16px;
}

.${CSS_PREFIX}-form-group label {
	display: block;
	font-size: 12px;
	font-weight: 600;
	color: #b5bac1;
	text-transform: uppercase;
	margin-bottom: 8px;
}

.${CSS_PREFIX}-form-group input {
	width: 100%;
	padding: 12px;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 8px;
	color: #f2f3f5;
	font-size: 14px;
	box-sizing: border-box;
}

/* Info box */
.${CSS_PREFIX}-info {
	padding: 12px 14px;
	background: rgba(88, 101, 242, 0.1);
	border-radius: 8px;
	font-size: 13px;
	color: #b5bac1;
	margin-bottom: 16px;
}

.${CSS_PREFIX}-info strong {
	color: #f2f3f5;
}

/* Confetti */
.${CSS_PREFIX}-confetti-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	overflow: hidden;
	z-index: 1001;
}

.${CSS_PREFIX}-confetti-container .confetti {
	position: absolute;
	width: 10px;
	height: 10px;
	top: -10px;
	left: var(--x, 50%);
	opacity: 0.9;
	animation: detcord-confetti-fall 3s ease-out var(--delay, 0s) forwards;
}

.${CSS_PREFIX}-confetti-container .confetti:nth-child(odd) {
	border-radius: 50%;
}

.${CSS_PREFIX}-confetti-container .confetti:nth-child(even) {
	transform: rotate(45deg);
}

@keyframes detcord-confetti-fall {
	0% { transform: translateY(0) rotate(0deg); opacity: 1; }
	100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
}

/* Countdown - positioned within the window */
.${CSS_PREFIX}-countdown-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #1e1f22;
	border-radius: 12px;
	z-index: 100;
}

.${CSS_PREFIX}-countdown-overlay .countdown-number {
	font-size: 80px;
	font-weight: 700;
	color: #f2f3f5;
	animation: detcord-countdown-pulse 0.9s ease-out;
}

.${CSS_PREFIX}-countdown-overlay .countdown-boom {
	font-size: 36px;
	font-weight: 700;
	color: #5865f2;
	animation: detcord-countdown-pulse 0.5s ease-out;
}

@keyframes detcord-countdown-pulse {
	0% { transform: scale(0.5); opacity: 0; }
	50% { transform: scale(1.1); opacity: 1; }
	100% { transform: scale(1); opacity: 0; }
}

/* Hide legacy elements */
.${CSS_PREFIX}-checkbox-group {
	display: none;
}

/* Channel Picker */
.${CSS_PREFIX}-channel-picker {
	margin-top: 12px;
	display: none;
}

.${CSS_PREFIX}-channel-picker.visible {
	display: block;
}

.${CSS_PREFIX}-channel-search {
	width: 100%;
	padding: 10px 12px;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 6px;
	color: #dbdee1;
	font-size: 14px;
	margin-bottom: 8px;
}

.${CSS_PREFIX}-channel-search:focus {
	outline: none;
	border-color: #5865f2;
}

.${CSS_PREFIX}-channel-search::placeholder {
	color: #6d6f78;
}

.${CSS_PREFIX}-channel-list {
	max-height: 200px;
	overflow-y: auto;
	background: #1e1f22;
	border: 1px solid #3f4147;
	border-radius: 6px;
}

.${CSS_PREFIX}-channel-item {
	display: flex;
	align-items: center;
	padding: 8px 12px;
	cursor: pointer;
	transition: background 0.1s ease;
	gap: 8px;
}

.${CSS_PREFIX}-channel-item:hover {
	background: #2b2d31;
}

.${CSS_PREFIX}-channel-item.selected {
	background: rgba(88, 101, 242, 0.15);
}

.${CSS_PREFIX}-channel-checkbox {
	width: 18px;
	height: 18px;
	border: 2px solid #6d6f78;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: all 0.15s ease;
}

.${CSS_PREFIX}-channel-item.selected .${CSS_PREFIX}-channel-checkbox {
	background: #5865f2;
	border-color: #5865f2;
}

.${CSS_PREFIX}-channel-item.selected .${CSS_PREFIX}-channel-checkbox::after {
	content: '✓';
	color: white;
	font-size: 12px;
	font-weight: bold;
}

.${CSS_PREFIX}-channel-icon {
	color: #6d6f78;
	font-size: 16px;
}

.${CSS_PREFIX}-channel-name {
	flex: 1;
	color: #dbdee1;
	font-size: 14px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.${CSS_PREFIX}-channel-category {
	font-size: 11px;
	color: #6d6f78;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	padding: 8px 12px 4px;
	font-weight: 600;
}

.${CSS_PREFIX}-selected-count {
	font-size: 12px;
	color: #5865f2;
	margin-top: 8px;
	text-align: center;
}

.${CSS_PREFIX}-channel-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	gap: 8px;
	color: #6d6f78;
}

/* Wizard Steps */
.${CSS_PREFIX}-wizard-step {
	display: none;
}

.${CSS_PREFIX}-wizard-step.active {
	display: block;
	animation: detcord-step-in 0.25s ease-out;
}

/* Waiting/Loading State */
.${CSS_PREFIX}-waiting {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px;
	background: rgba(88, 101, 242, 0.1);
	border-radius: 8px;
	margin-top: 12px;
	color: #b5bac1;
	font-size: 13px;
}

.${CSS_PREFIX}-spinner {
	width: 16px;
	height: 16px;
	border: 2px solid #3f4147;
	border-top-color: #5865f2;
	border-radius: 50%;
	animation: detcord-spin 0.8s linear infinite;
}

@keyframes detcord-spin {
	to { transform: rotate(360deg); }
}

/* Hide steps indicator on non-setup screens */
.${CSS_PREFIX}-window:has([data-screen="running"].active) .${CSS_PREFIX}-steps,
.${CSS_PREFIX}-window:has([data-screen="complete"].active) .${CSS_PREFIX}-steps,
.${CSS_PREFIX}-window:has([data-screen="error"].active) .${CSS_PREFIX}-steps,
.${CSS_PREFIX}-window:has([data-screen="preview"].active) .${CSS_PREFIX}-steps {
	display: none;
}
`;
  const TRIGGER_ICON = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	<path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10zm-9-4h4v2h-4z"/>
</svg>
`;
  const CLOSE_ICON = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	<path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
</svg>
`;
  const MINIMIZE_ICON = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	<path d="M19 13H5v-2h14v2z"/>
</svg>
`;
  function createWindowHTML() {
    return `
<div class="${CSS_PREFIX}-backdrop"></div>
<div class="${CSS_PREFIX}-window">
	<div class="${CSS_PREFIX}-header">
		<h2>Detcord</h2>
		<div class="${CSS_PREFIX}-header-buttons">
			<button class="${CSS_PREFIX}-minimize" data-action="minimize">${MINIMIZE_ICON}</button>
			<button class="${CSS_PREFIX}-close" data-action="close">${CLOSE_ICON}</button>
		</div>
	</div>

	<!-- Step Indicator -->
	<div class="${CSS_PREFIX}-steps" data-bind="stepIndicator">
		<div class="${CSS_PREFIX}-step-dot active" data-step="0"></div>
		<div class="${CSS_PREFIX}-step-dot" data-step="1"></div>
		<div class="${CSS_PREFIX}-step-dot" data-step="2"></div>
		<div class="${CSS_PREFIX}-step-dot" data-step="3"></div>
	</div>

	<div class="${CSS_PREFIX}-content">
		<!-- Setup Screen (Wizard Steps) -->
		<div class="${CSS_PREFIX}-screen active" data-screen="setup">

			<!-- Step 1: Location -->
			<div class="${CSS_PREFIX}-wizard-step active" data-wizard-step="location">
				<h3 class="${CSS_PREFIX}-step-title">Where should we clean?</h3>

				<div class="${CSS_PREFIX}-cards">
					<div class="${CSS_PREFIX}-card selected" data-target="channel" data-action="selectTarget">
						<div class="${CSS_PREFIX}-card-icon">📺</div>
						<div class="${CSS_PREFIX}-card-title">Channel</div>
						<div class="${CSS_PREFIX}-card-desc">Current channel</div>
					</div>
					<div class="${CSS_PREFIX}-card" data-target="server" data-action="selectTarget" data-bind="serverCard">
						<div class="${CSS_PREFIX}-card-icon">🏰</div>
						<div class="${CSS_PREFIX}-card-title">Whole Server</div>
						<div class="${CSS_PREFIX}-card-desc">All your messages</div>
					</div>
					<div class="${CSS_PREFIX}-card" data-target="dm" data-action="selectTarget" data-bind="dmCard">
						<div class="${CSS_PREFIX}-card-icon">💬</div>
						<div class="${CSS_PREFIX}-card-title">DM</div>
						<div class="${CSS_PREFIX}-card-desc">This conversation</div>
					</div>
					<div class="${CSS_PREFIX}-card" data-target="manual" data-action="selectTarget">
						<div class="${CSS_PREFIX}-card-icon">🎯</div>
						<div class="${CSS_PREFIX}-card-title">Specific</div>
						<div class="${CSS_PREFIX}-card-desc">Pick channels</div>
					</div>
				</div>

				<div class="${CSS_PREFIX}-channel-picker" data-bind="channelPicker">
					<input type="text" class="${CSS_PREFIX}-channel-search" data-input="channelSearch" placeholder="Search channels...">
					<div class="${CSS_PREFIX}-channel-list" data-bind="channelList">
						<div class="${CSS_PREFIX}-channel-loading">
							<div class="${CSS_PREFIX}-spinner"></div>
							<span>Loading channels...</span>
						</div>
					</div>
					<div class="${CSS_PREFIX}-selected-count" data-bind="selectedChannelCount"></div>
				</div>
				<div class="${CSS_PREFIX}-manual-input" data-bind="manualIdContainer">
					<input type="text" data-input="manualChannelId" placeholder="Or enter channel ID manually...">
				</div>

				<div class="${CSS_PREFIX}-btn-group">
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-primary" data-action="nextStep" style="flex: 1;">
						Continue
					</button>
				</div>
			</div>

			<!-- Step 2: Time Range -->
			<div class="${CSS_PREFIX}-wizard-step" data-wizard-step="timerange">
				<h3 class="${CSS_PREFIX}-step-title">How far back?</h3>

				<div class="${CSS_PREFIX}-options">
					<div class="${CSS_PREFIX}-option selected" data-timerange="all" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Everything</div>
						<div class="${CSS_PREFIX}-option-hint">∞</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="24h" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Last 24 hours</div>
						<div class="${CSS_PREFIX}-option-hint">24h</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="72h" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Last 3 days</div>
						<div class="${CSS_PREFIX}-option-hint">72h</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="30d" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Last 30 days</div>
						<div class="${CSS_PREFIX}-option-hint">30d</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="older-30d" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Older than 30 days</div>
						<div class="${CSS_PREFIX}-option-hint">&gt;30d</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="older-90d" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Older than 90 days</div>
						<div class="${CSS_PREFIX}-option-hint">&gt;90d</div>
					</div>
					<div class="${CSS_PREFIX}-option" data-timerange="custom" data-action="selectTimeRange">
						<div class="${CSS_PREFIX}-option-radio"></div>
						<div class="${CSS_PREFIX}-option-label">Custom range</div>
						<div class="${CSS_PREFIX}-option-hint">📅</div>
					</div>
				</div>

				<div class="${CSS_PREFIX}-date-range" data-bind="dateRangeContainer">
					<input type="date" data-input="afterDate" placeholder="From">
					<input type="date" data-input="beforeDate" placeholder="To">
				</div>

				<div class="${CSS_PREFIX}-btn-group">
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-ghost" data-action="prevStep">Back</button>
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-primary" data-action="nextStep" style="flex: 1;">
						Continue
					</button>
				</div>
			</div>

			<!-- Step 3: Filters -->
			<div class="${CSS_PREFIX}-wizard-step" data-wizard-step="filters">
				<h3 class="${CSS_PREFIX}-step-title">Any filters?</h3>

				<div class="${CSS_PREFIX}-toggles">
					<div class="${CSS_PREFIX}-toggle">
						<span class="${CSS_PREFIX}-toggle-label">Only with links</span>
						<div class="${CSS_PREFIX}-toggle-switch" data-toggle="hasLink" data-action="toggleFilter"></div>
					</div>
					<div class="${CSS_PREFIX}-toggle">
						<span class="${CSS_PREFIX}-toggle-label">Only with attachments</span>
						<div class="${CSS_PREFIX}-toggle-switch" data-toggle="hasFile" data-action="toggleFilter"></div>
					</div>
					<div class="${CSS_PREFIX}-toggle">
						<span class="${CSS_PREFIX}-toggle-label">Include pinned messages</span>
						<div class="${CSS_PREFIX}-toggle-switch" data-toggle="includePinned" data-action="toggleFilter"></div>
					</div>
				</div>

				<div class="${CSS_PREFIX}-deletion-order">
					<label class="${CSS_PREFIX}-deletion-order-label">Deletion order</label>
					<div class="${CSS_PREFIX}-radio-group">
						<label class="${CSS_PREFIX}-radio">
							<input type="radio" name="deletionOrder" value="newest" checked>
							<span class="${CSS_PREFIX}-radio-label">Newest first</span>
						</label>
						<label class="${CSS_PREFIX}-radio">
							<input type="radio" name="deletionOrder" value="oldest">
							<span class="${CSS_PREFIX}-radio-label">Oldest first</span>
						</label>
					</div>
				</div>

				<div class="${CSS_PREFIX}-filter-input">
					<label>Text filter (optional)</label>
					<input type="text" data-input="contentFilter" placeholder="Messages containing...">
				</div>

				<div class="${CSS_PREFIX}-btn-group">
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-ghost" data-action="prevStep">Back</button>
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-primary" data-action="nextStep" style="flex: 1;">
						Continue
					</button>
				</div>
			</div>

			<!-- Step 4: Review -->
			<div class="${CSS_PREFIX}-wizard-step" data-wizard-step="review">
				<h3 class="${CSS_PREFIX}-step-title">Ready to sweep</h3>

				<div class="${CSS_PREFIX}-summary">
					<div class="${CSS_PREFIX}-summary-count" data-bind="reviewCount">...</div>
					<div class="${CSS_PREFIX}-summary-label">messages found</div>
					<div class="${CSS_PREFIX}-summary-details" data-bind="reviewDetails">Scanning...</div>
				</div>

				<div class="${CSS_PREFIX}-preview-list" data-bind="previewList">
					<div class="${CSS_PREFIX}-preview-label">Preview</div>
					<div class="${CSS_PREFIX}-preview-messages" data-bind="previewContent">
						<div class="${CSS_PREFIX}-preview-msg">Scanning messages...</div>
					</div>
				</div>

				<div class="${CSS_PREFIX}-btn-group">
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-ghost" data-action="prevStep">Back</button>
					<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-sweep" data-action="confirmDelete" style="flex: 1;">
						🧹 Begin Sweep
					</button>
				</div>
			</div>
		</div>

		<!-- Preview Screen (legacy, for direct scan) -->
		<div class="${CSS_PREFIX}-screen" data-screen="preview">
			<h3 class="${CSS_PREFIX}-step-title">Review Before Sweep</h3>
			<div data-bind="legacyPreviewContent">
				<p style="color: #b5bac1; text-align: center;">Scanning...</p>
			</div>
			<div class="${CSS_PREFIX}-btn-group">
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-secondary" data-action="backToSetup" style="flex: 1;">
					Back
				</button>
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-sweep" data-action="confirmDelete" style="flex: 1;">
					🧹 Begin Sweep
				</button>
			</div>
		</div>

		<!-- Running Screen -->
		<div class="${CSS_PREFIX}-screen" data-screen="running">
			<!-- Status Speaker -->
			<div class="${CSS_PREFIX}-status-speaker">
				<div class="${CSS_PREFIX}-speaker-avatar">🧹</div>
				<div class="${CSS_PREFIX}-speaker-bubble">
					<div class="${CSS_PREFIX}-status-message" data-bind="statusMessage">"Nothing to see here..."</div>
				</div>
			</div>

			<div class="${CSS_PREFIX}-progress-container">
				<!-- Circular Progress Ring -->
				<div class="${CSS_PREFIX}-progress-ring-container">
					<svg class="${CSS_PREFIX}-progress-ring" viewBox="0 0 120 120">
						<defs>
							<linearGradient id="detcord-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" style="stop-color:#5865f2"/>
								<stop offset="50%" style="stop-color:#7289da"/>
								<stop offset="100%" style="stop-color:#5865f2"/>
							</linearGradient>
						</defs>
						<circle class="${CSS_PREFIX}-progress-ring-bg" cx="60" cy="60" r="52"/>
						<circle class="${CSS_PREFIX}-progress-ring-fill" cx="60" cy="60" r="52" data-bind="progressRing"/>
					</svg>
					<div class="${CSS_PREFIX}-progress-ring-text">
						<div class="${CSS_PREFIX}-progress-percent" data-bind="progressPercent">0%</div>
						<div class="${CSS_PREFIX}-progress-count" data-bind="progressCount">0 / 0</div>
					</div>
				</div>

				<!-- Stats Grid -->
				<div class="${CSS_PREFIX}-progress-stats">
					<div class="${CSS_PREFIX}-stat">
						<div class="${CSS_PREFIX}-stat-value success" data-bind="deletedCount">0</div>
						<div class="${CSS_PREFIX}-stat-label">Deleted</div>
					</div>
					<div class="${CSS_PREFIX}-stat">
						<div class="${CSS_PREFIX}-stat-value error" data-bind="failedCount">0</div>
						<div class="${CSS_PREFIX}-stat-label">Failed</div>
					</div>
					<div class="${CSS_PREFIX}-stat">
						<div class="${CSS_PREFIX}-stat-value rate" data-bind="rateValue">0</div>
						<div class="${CSS_PREFIX}-stat-label">Per Min</div>
					</div>
				</div>

				<!-- Time Stats -->
				<div class="${CSS_PREFIX}-time-stats">
					<div class="${CSS_PREFIX}-time-stat">
						<span class="${CSS_PREFIX}-time-label">Elapsed:</span>
						<span class="${CSS_PREFIX}-time-value" data-bind="elapsedTime">0:00</span>
					</div>
					<div class="${CSS_PREFIX}-time-stat">
						<span class="${CSS_PREFIX}-time-label">ETA:</span>
						<span class="${CSS_PREFIX}-time-value" data-bind="eta">--:--</span>
					</div>
					<div class="${CSS_PREFIX}-time-stat" data-bind="throttleInfo" style="display: none;">
						<span class="${CSS_PREFIX}-time-label">Throttled:</span>
						<span class="${CSS_PREFIX}-time-value" data-bind="throttleCount">0x</span>
					</div>
				</div>

				<!-- Progress Bar -->
				<div class="${CSS_PREFIX}-progress-bar-container">
					<div class="${CSS_PREFIX}-progress-bar" data-bind="progressBar" style="width: 0%"></div>
				</div>

				<!-- Current Message -->
				<div class="${CSS_PREFIX}-current-message" data-bind="currentMessage">Starting...</div>
			</div>

			<div class="${CSS_PREFIX}-feed" data-bind="feed"></div>

			<div class="${CSS_PREFIX}-btn-group">
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-secondary" data-action="pause" style="flex: 1;">
					Pause
				</button>
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-secondary" data-action="stop" style="flex: 1;">
					Stop
				</button>
			</div>
		</div>

		<!-- Complete Screen -->
		<div class="${CSS_PREFIX}-screen" data-screen="complete">
			<div class="${CSS_PREFIX}-confetti-container" data-bind="confettiContainer"></div>

			<div class="${CSS_PREFIX}-complete">
				<div class="${CSS_PREFIX}-complete-icon">✨</div>
				<h3 class="${CSS_PREFIX}-complete-title">All clean!</h3>
				<div class="${CSS_PREFIX}-complete-stats" data-bind="completeSummary">0 messages swept</div>
				<div class="${CSS_PREFIX}-complete-time" data-bind="completeDuration">in 0 seconds</div>
				<div class="${CSS_PREFIX}-complete-throttle" data-bind="completeThrottle" style="display: none;"></div>
			</div>

			<div class="${CSS_PREFIX}-btn-group">
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-primary" data-action="reset" style="flex: 1;">
					Sweep More
				</button>
			</div>
		</div>

		<!-- Error Screen -->
		<div class="${CSS_PREFIX}-screen" data-screen="error">
			<div class="${CSS_PREFIX}-error-message" data-bind="errorMessage">
				An error occurred.
			</div>

			<div class="${CSS_PREFIX}-form-group" data-bind="tokenInputContainer">
				<label>Manual Token Entry</label>
				<input type="password" data-input="manualToken" placeholder="Paste your Discord token...">
				<p style="font-size: 11px; color: #6d6f78; margin-top: 8px;">
					DevTools → Application → Local Storage → token
				</p>
			</div>

			<div class="${CSS_PREFIX}-btn-group">
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-primary" data-action="useManualToken" style="flex: 1;">
					Use Token
				</button>
				<button class="${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-secondary" data-action="reset" style="flex: 1;">
					Try Again
				</button>
			</div>
		</div>
	</div>
</div>
`;
  }
  class DetcordUI {
    // Configuration
    options;
    // State
    mounted = false;
    visible = false;
    _currentScreen = "setup";
    isPaused = false;
    token = null;
    authorId = null;
    // DOM elements
    container = null;
    triggerButton = null;
    windowEl = null;
    backdropEl = null;
    // Engine
    engine = null;
    apiClient = null;
    // Performance utilities
    cleanup = createCleanupManager();
    feedEntries;
    throttledProgressUpdate = null;
    throttledFeedUpdate = null;
    pendingFeedEntries = [];
    feedUpdateScheduled = false;
    // Dragging state
    isDragging = false;
    dragStartX = 0;
    dragStartY = 0;
    windowStartX = 0;
    windowStartY = 0;
    // Throttled functions for cleanup tracking
    throttledFunctions = [];
    // Cached progress elements for efficient updates
    progressElements = null;
    // Lazy token detection flag
    tokenDetected = false;
    // Preview state
    previewMessages = [];
    previewTotalCount = 0;
    // Status rotation
    statusRotator = null;
    // Countdown cancellation (assigned for potential future use)
    _countdownCancel = null;
    // Wizard state
    currentWizardStep = 0;
    wizardSteps = ["location", "timerange", "filters", "review"];
    selectedTarget = "channel";
    selectedTimeRange = "all";
    filterStates = {
      hasLink: false,
      hasFile: false,
      includePinned: false
    };
    // Waiting state
    waitingIndicator = null;
    // Minimize state
    isMinimized = false;
    miniIndicator = null;
    // Channel picker state
    availableChannels = [];
    selectedChannels = /* @__PURE__ */ new Set();
    channelsLoading = false;
    /**
     * Creates a new DetcordUI instance.
     *
     * @param options - Optional configuration
     */
    constructor(options) {
      this.options = {
        onShow: options?.onShow ?? (() => {
        }),
        onHide: options?.onHide ?? (() => {
        }),
        maxFeedEntries: options?.maxFeedEntries ?? DEFAULT_MAX_FEED_ENTRIES,
        progressThrottleMs: options?.progressThrottleMs ?? DEFAULT_PROGRESS_THROTTLE_MS,
        feedThrottleMs: options?.feedThrottleMs ?? DEFAULT_FEED_THROTTLE_MS
      };
      this.feedEntries = createBoundedArray(this.options.maxFeedEntries);
      this.throttledProgressUpdate = throttle(
        (state, stats) => {
          this.updateProgressUI(state, stats);
        },
        this.options.progressThrottleMs
      );
      this.throttledFunctions.push(
        this.throttledProgressUpdate
      );
      this.throttledFeedUpdate = throttle(() => {
        this.flushFeedUpdates();
      }, this.options.feedThrottleMs);
      this.throttledFunctions.push(this.throttledFeedUpdate);
    }
    // =========================================================================
    // Public Lifecycle Methods
    // =========================================================================
    /**
     * Mounts the UI into the DOM.
     * Injects styles, creates the trigger button and window.
     */
    mount() {
      if (this.mounted) {
        return;
      }
      this.injectStyles();
      this.container = document.createElement("div");
      this.container.id = `${CSS_PREFIX}-container`;
      this.triggerButton = document.createElement("button");
      this.triggerButton.className = `${CSS_PREFIX}-trigger`;
      this.triggerButton.innerHTML = TRIGGER_ICON;
      this.triggerButton.setAttribute("aria-label", "Open Detcord");
      this.triggerButton.setAttribute("data-action", "toggle");
      const windowContainer = document.createElement("div");
      windowContainer.innerHTML = createWindowHTML();
      this.container.appendChild(this.triggerButton);
      this.container.appendChild(windowContainer);
      document.body.appendChild(this.container);
      this.windowEl = this.container.querySelector(`.${CSS_PREFIX}-window`);
      this.backdropEl = this.container.querySelector(`.${CSS_PREFIX}-backdrop`);
      this.setupEventDelegation();
      this.setupDragging();
      this.mounted = true;
    }
    /**
     * Unmounts the UI from the DOM.
     * Cleans up all event listeners and resources.
     */
    unmount() {
      if (!this.mounted) {
        return;
      }
      if (this.engine) {
        this.engine.stop();
        this.engine = null;
      }
      if (this._countdownCancel) {
        this._countdownCancel();
        this._countdownCancel = null;
      }
      for (const fn of this.throttledFunctions) {
        fn.cancel();
      }
      this.throttledFunctions = [];
      this.cleanup.dispose();
      this.container?.remove();
      this.container = null;
      this.triggerButton = null;
      this.windowEl = null;
      this.backdropEl = null;
      this.progressElements = null;
      const styleEl = document.getElementById(`${CSS_PREFIX}-styles`);
      styleEl?.remove();
      this.mounted = false;
      this.visible = false;
    }
    /**
     * Shows the window.
     * Token detection is performed lazily on first show.
     */
    show() {
      if (!this.mounted || this.visible) {
        return;
      }
      if (!this.tokenDetected) {
        this.detectToken();
        this.tokenDetected = true;
      }
      this.windowEl?.classList.add("visible");
      this.backdropEl?.classList.add("visible");
      this.visible = true;
      this.updateChannelInfo();
      this.options.onShow();
    }
    /**
     * Hides the window.
     */
    hide() {
      if (!this.visible) {
        return;
      }
      this.windowEl?.classList.remove("visible");
      this.backdropEl?.classList.remove("visible");
      this.visible = false;
      this.options.onHide();
    }
    /**
     * Returns whether the window is currently visible.
     */
    isVisible() {
      return this.visible;
    }
    /**
     * Returns whether deletion is currently running.
     */
    isRunning() {
      return this.engine?.getState().running ?? false;
    }
    /**
     * Returns the current screen ID.
     */
    getCurrentScreen() {
      return this._currentScreen;
    }
    // =========================================================================
    // Screen Navigation
    // =========================================================================
    /**
     * Switches to a different screen with transition.
     *
     * @param screenId - The screen to show
     */
    showScreen(screenId) {
      if (!this.windowEl) return;
      const screens = this.windowEl.querySelectorAll("[data-screen]");
      for (const screen of screens) {
        screen.classList.remove("active");
      }
      const targetScreen = this.windowEl.querySelector(`[data-screen="${screenId}"]`);
      targetScreen?.classList.add("active");
      this._currentScreen = screenId;
    }
    // =========================================================================
    // Private: Setup Methods
    // =========================================================================
    /**
     * Injects component styles into the document head.
     */
    injectStyles() {
      if (document.getElementById(`${CSS_PREFIX}-styles`)) {
        return;
      }
      const styleEl = document.createElement("style");
      styleEl.id = `${CSS_PREFIX}-styles`;
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
    }
    /**
     * Sets up event delegation on the container.
     * Uses a single event listener for all interactions.
     */
    setupEventDelegation() {
      if (!this.container) return;
      const handleClick = (event) => {
        const target = event.target;
        const actionEl = target.closest("[data-action]");
        if (!actionEl) return;
        const action = actionEl.getAttribute("data-action");
        switch (action) {
          case "toggle":
            if (this.visible) {
              this.hide();
            } else {
              this.show();
            }
            break;
          case "close":
            this.hide();
            break;
          case "scan":
            this.handleScan();
            break;
          case "backToSetup":
            this.handleBackToSetup();
            break;
          case "confirmDelete":
            this.handleConfirmDelete();
            break;
          case "start":
            this.handleStart();
            break;
          case "pause":
            this.handlePause();
            break;
          case "stop":
            this.handleStop();
            break;
          case "reset":
            this.handleReset();
            break;
          case "useManualToken":
            this.handleManualToken();
            break;
          case "nextStep":
            this.handleNextStep();
            break;
          case "prevStep":
            this.handlePrevStep();
            break;
          case "selectTarget":
            this.handleSelectTarget(actionEl);
            break;
          case "selectTimeRange":
            this.handleSelectTimeRange(actionEl);
            break;
          case "toggleFilter":
            this.handleToggleFilter(actionEl);
            break;
          case "toggleChannel":
            this.handleToggleChannel(actionEl);
            break;
          case "minimize":
            this.handleMinimize();
            break;
          case "maximize":
            this.handleMaximize();
            break;
        }
      };
      this.container.addEventListener("click", handleClick);
      this.cleanup.add(() => {
        this.container?.removeEventListener("click", handleClick);
      });
      if (this.backdropEl) {
        const backdropClick = () => this.hide();
        this.backdropEl.addEventListener("click", backdropClick);
        this.cleanup.add(() => {
          this.backdropEl?.removeEventListener("click", backdropClick);
        });
      }
      const handleKeydown = (event) => {
        if (event.key === "Escape" && this.visible) {
          this.hide();
        }
      };
      document.addEventListener("keydown", handleKeydown);
      this.cleanup.add(() => {
        document.removeEventListener("keydown", handleKeydown);
      });
      const handleRadioChange = (event) => {
        const target = event.target;
        if (target.name === "targetScope") {
          const manualContainer = this.windowEl?.querySelector(
            '[data-bind="manualIdContainer"]'
          );
          if (manualContainer) {
            manualContainer.style.display = target.value === "manual" ? "block" : "none";
          }
        }
      };
      this.container.addEventListener("change", handleRadioChange);
      this.cleanup.add(() => {
        this.container?.removeEventListener("change", handleRadioChange);
      });
    }
    /**
     * Sets up draggable window functionality.
     * Uses throttled mousemove handler (16ms = ~60fps) for better performance.
     */
    setupDragging() {
      const header = this.windowEl?.querySelector(`.${CSS_PREFIX}-header`);
      if (!header || !this.windowEl) return;
      const handleMouseDown = (event) => {
        if (event.target.closest("[data-action]")) {
          return;
        }
        this.isDragging = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        const rect = this.windowEl?.getBoundingClientRect();
        if (!rect) return;
        this.windowStartX = rect.left + rect.width / 2;
        this.windowStartY = rect.top + rect.height / 2;
        event.preventDefault();
      };
      const handleMouseMove = throttle((event) => {
        if (!this.isDragging || !this.windowEl) return;
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;
        let newX = this.windowStartX + deltaX;
        let newY = this.windowStartY + deltaY;
        const rect = this.windowEl.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;
        newX = Math.max(halfWidth, Math.min(window.innerWidth - halfWidth, newX));
        newY = Math.max(halfHeight, Math.min(window.innerHeight - halfHeight, newY));
        this.windowEl.style.left = `${newX}px`;
        this.windowEl.style.top = `${newY}px`;
        this.windowEl.style.transform = "translate(-50%, -50%)";
      }, 16);
      this.throttledFunctions.push(handleMouseMove);
      const handleMouseUp = () => {
        this.isDragging = false;
      };
      header.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      this.cleanup.add(() => {
        header.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      });
    }
    /**
     * Detects the Discord token from the browser environment.
     */
    detectToken() {
      try {
        this.token = getToken();
        this.authorId = getAuthorId();
        if (!this.token) {
          this.showError("Could not detect Discord token. Please make sure you are logged in.");
        }
      } catch {
        this.showError("Failed to extract authentication token.");
      }
    }
    // =========================================================================
    // Private: Action Handlers
    // =========================================================================
    /**
     * Handles the start action.
     */
    handleStart() {
      if (!this.token || !this.authorId) {
        this.showError("Authentication token not found. Please refresh the page and try again.");
        return;
      }
      const config = this.getFormConfig();
      if (!config.channelId) {
        this.showError(
          "Could not detect current channel. Please navigate to a channel and try again."
        );
        return;
      }
      if (config.pattern) {
        try {
          new RegExp(config.pattern);
        } catch {
          this.showError(`Invalid regex pattern: ${config.pattern}`);
          return;
        }
      }
      this.apiClient = new DiscordApiClient(this.token);
      this.engine = new DeletionEngine(
        this.apiClient
      );
      const engineOptions = {
        authToken: this.token,
        authorId: this.authorId,
        channelId: config.channelId
      };
      if (config.targetScope === "server" && config.guildId) {
        engineOptions.guildId = config.guildId;
      }
      if (config.afterDate) engineOptions.minId = dateToSnowflake(config.afterDate);
      if (config.beforeDate) engineOptions.maxId = dateToSnowflake(config.beforeDate);
      if (config.contentFilter) engineOptions.content = config.contentFilter;
      if (config.hasLink) engineOptions.hasLink = config.hasLink;
      if (config.hasFile) engineOptions.hasFile = config.hasFile;
      if (config.includePinned) engineOptions.includePinned = config.includePinned;
      if (config.pattern) engineOptions.pattern = config.pattern;
      if (config.deletionOrder) engineOptions.deletionOrder = config.deletionOrder;
      this.engine.configure(engineOptions);
      this.engine.setCallbacks({
        onStart: (state, stats) => this.onEngineStart(state, stats),
        onProgress: (state, stats, message) => this.onEngineProgress(state, stats, message),
        onStop: (state, stats) => this.onEngineStop(state, stats),
        onError: (error) => this.onEngineError(error),
        onRateLimitChange: (info) => this.updateThrottleState(info.isThrottled, info.currentDelay),
        onStatus: (status) => this.onEngineStatus(status)
      });
      this.feedEntries.clear();
      this.pendingFeedEntries = [];
      this.showScreen("running");
      this.cacheProgressElements();
      this.engine.start().catch((error) => {
        this.onEngineError(error instanceof Error ? error : new Error(String(error)));
      });
    }
    /**
     * Handles the pause/resume action.
     */
    handlePause() {
      if (!this.engine) return;
      const pauseBtn = this.windowEl?.querySelector('[data-action="pause"]');
      if (this.isPaused) {
        this.engine.resume();
        this.isPaused = false;
        if (pauseBtn) pauseBtn.textContent = "Pause";
      } else {
        this.engine.pause();
        this.isPaused = true;
        if (pauseBtn) pauseBtn.textContent = "Resume";
      }
    }
    /**
     * Handles the stop action.
     */
    handleStop() {
      this.engine?.stop();
    }
    /**
     * Handles the reset action.
     */
    handleReset() {
      this.engine = null;
      this.apiClient = null;
      this.isPaused = false;
      this.feedEntries.clear();
      this.pendingFeedEntries = [];
      this.progressElements = null;
      this.statusRotator?.stop();
      this.statusRotator = null;
      this.previewMessages = [];
      this.previewTotalCount = 0;
      this.currentWizardStep = 0;
      this.selectedTarget = "channel";
      this.selectedTimeRange = "all";
      this.filterStates = { hasLink: false, hasFile: false, includePinned: false };
      this.selectedChannels.clear();
      this.availableChannels = [];
      this.showScreen("setup");
      this.showWizardStep("location");
    }
    /**
     * Handles manual token entry from the error screen.
     */
    handleManualToken() {
      const tokenInput = this.windowEl?.querySelector(
        '[data-input="manualToken"]'
      );
      const manualToken = tokenInput?.value?.trim();
      if (!manualToken) {
        this.showError("Please enter a valid token.");
        return;
      }
      if (!/^[A-Za-z0-9]/.test(manualToken)) {
        this.showError("Invalid token format. Token should not start with special characters.");
        return;
      }
      this.token = manualToken;
      this.authorId = getAuthorId();
      if (tokenInput) {
        tokenInput.value = "";
      }
      if (!this.authorId) {
        this.showError(
          "Token accepted but could not detect your user ID. Please enter it manually or try refreshing."
        );
        return;
      }
      this.showScreen("setup");
      this.updateChannelInfo();
    }
    /**
     * Handles moving to the next wizard step.
     */
    handleNextStep() {
      if (this.currentWizardStep < this.wizardSteps.length - 1) {
        this.currentWizardStep++;
        const step = this.wizardSteps[this.currentWizardStep];
        if (step) {
          this.showWizardStep(step);
          if (step === "review") {
            this.scanForReview();
          }
        }
      }
    }
    /**
     * Handles moving to the previous wizard step.
     */
    handlePrevStep() {
      if (this.currentWizardStep > 0) {
        this.currentWizardStep--;
        const step = this.wizardSteps[this.currentWizardStep];
        if (step) {
          this.showWizardStep(step);
        }
      }
    }
    /**
     * Handles selecting a target location.
     */
    handleSelectTarget(element) {
      const target = element.getAttribute("data-target");
      if (!target) return;
      this.selectedTarget = target;
      const cards = this.windowEl?.querySelectorAll('[data-action="selectTarget"]');
      if (cards) {
        for (const card of cards) {
          card.classList.remove("selected");
        }
      }
      element.classList.add("selected");
      const channelPicker = this.windowEl?.querySelector(
        '[data-bind="channelPicker"]'
      );
      const manualContainer = this.windowEl?.querySelector(
        '[data-bind="manualIdContainer"]'
      );
      if (channelPicker) {
        channelPicker.classList.toggle("visible", target === "manual");
        if (target === "manual") {
          this.loadChannelsForPicker();
        }
      }
      if (manualContainer) {
        manualContainer.classList.toggle("visible", target === "manual");
      }
    }
    /**
     * Handles selecting a time range.
     */
    handleSelectTimeRange(element) {
      const timerange = element.getAttribute("data-timerange");
      if (!timerange) return;
      this.selectedTimeRange = timerange;
      const options = this.windowEl?.querySelectorAll('[data-action="selectTimeRange"]');
      if (options) {
        for (const option of options) {
          option.classList.remove("selected");
        }
      }
      element.classList.add("selected");
      const dateContainer = this.windowEl?.querySelector(
        '[data-bind="dateRangeContainer"]'
      );
      if (dateContainer) {
        dateContainer.classList.toggle("visible", timerange === "custom");
      }
      if (timerange !== "custom" && timerange !== "all") {
        this.applyQuickTimeRange(timerange);
      }
    }
    /**
     * Applies a quick time range preset.
     */
    applyQuickTimeRange(preset) {
      const now = /* @__PURE__ */ new Date();
      let afterDate = null;
      let beforeDate = null;
      switch (preset) {
        case "24h":
          afterDate = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
          break;
        case "72h":
          afterDate = new Date(now.getTime() - 72 * 60 * 60 * 1e3);
          break;
        case "30d":
          afterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
          break;
        case "90d":
          afterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
          break;
        case "1y":
          afterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3);
          break;
        case "older-30d":
          beforeDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
          break;
        case "older-90d":
          beforeDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
          break;
      }
      const afterInput = this.windowEl?.querySelector(
        '[data-input="afterDate"]'
      );
      const beforeInput = this.windowEl?.querySelector(
        '[data-input="beforeDate"]'
      );
      if (afterInput) {
        afterInput.value = afterDate ? afterDate.toISOString().split("T")[0] ?? "" : "";
      }
      if (beforeInput) {
        beforeInput.value = beforeDate ? beforeDate.toISOString().split("T")[0] ?? "" : "";
      }
    }
    /**
     * Handles toggling a filter switch.
     */
    handleToggleFilter(element) {
      const toggle = element.getAttribute("data-toggle");
      if (!toggle) return;
      this.filterStates[toggle] = !this.filterStates[toggle];
      element.classList.toggle("on", this.filterStates[toggle]);
    }
    /**
     * Loads channels for the picker when user selects "Specific" target.
     */
    async loadChannelsForPicker() {
      if (this.channelsLoading) return;
      const guildId = getGuildIdFromUrl();
      if (!guildId) {
        this.renderChannelList([]);
        return;
      }
      if (!this.apiClient && this.token) {
        this.apiClient = new DiscordApiClient(this.token);
      }
      if (!this.apiClient) {
        this.renderChannelList([]);
        return;
      }
      this.channelsLoading = true;
      try {
        const channels = await this.apiClient.getGuildChannels(guildId);
        this.availableChannels = channels.map((ch) => ({
          id: ch.id,
          name: ch.name ?? "Unknown",
          category: ch.parent_id ?? void 0
        }));
        this.availableChannels.sort((a, b) => a.name.localeCompare(b.name));
        this.renderChannelList(this.availableChannels);
      } catch (error) {
        console.error("[Detcord] Failed to load channels:", error);
        this.renderChannelList([]);
      } finally {
        this.channelsLoading = false;
      }
    }
    /**
     * Renders the channel list in the picker.
     */
    renderChannelList(channels) {
      const listEl = this.windowEl?.querySelector('[data-bind="channelList"]');
      if (!listEl) return;
      if (channels.length === 0) {
        listEl.innerHTML = `
        <div class="${CSS_PREFIX}-channel-loading">
          <span>No channels found</span>
        </div>
      `;
        return;
      }
      const html = channels.map(
        (ch) => `
        <div class="${CSS_PREFIX}-channel-item ${this.selectedChannels.has(ch.id) ? "selected" : ""}"
             data-channel-id="${ch.id}"
             data-action="toggleChannel">
          <div class="${CSS_PREFIX}-channel-checkbox"></div>
          <span class="${CSS_PREFIX}-channel-icon">#</span>
          <span class="${CSS_PREFIX}-channel-name">${escapeHtml(ch.name)}</span>
        </div>
      `
      ).join("");
      listEl.innerHTML = html;
      this.updateSelectedChannelCount();
      this.setupChannelSearch();
    }
    /**
     * Sets up the channel search input filtering.
     */
    setupChannelSearch() {
      const searchInput = this.windowEl?.querySelector(
        '[data-input="channelSearch"]'
      );
      if (!searchInput) return;
      const filterChannels = () => {
        const query = searchInput.value.toLowerCase();
        const items = this.windowEl?.querySelectorAll("[data-channel-id]");
        if (items) {
          for (const item of items) {
            const nameEl = item.querySelector(`.${CSS_PREFIX}-channel-name`);
            const name = nameEl?.textContent?.toLowerCase() ?? "";
            item.style.display = name.includes(query) ? "" : "none";
          }
        }
      };
      searchInput.addEventListener("input", filterChannels);
      this.cleanup.add(() => searchInput.removeEventListener("input", filterChannels));
    }
    /**
     * Handles toggling channel selection.
     */
    handleToggleChannel(element) {
      const channelId = element.getAttribute("data-channel-id");
      if (!channelId) return;
      if (this.selectedChannels.has(channelId)) {
        this.selectedChannels.delete(channelId);
        element.classList.remove("selected");
      } else {
        this.selectedChannels.add(channelId);
        element.classList.add("selected");
      }
      this.updateSelectedChannelCount();
    }
    /**
     * Updates the selected channel count display.
     */
    updateSelectedChannelCount() {
      const countEl = this.windowEl?.querySelector(
        '[data-bind="selectedChannelCount"]'
      );
      if (!countEl) return;
      const count = this.selectedChannels.size;
      if (count === 0) {
        countEl.textContent = "";
      } else if (count === 1) {
        countEl.textContent = "1 channel selected";
      } else {
        countEl.textContent = `${count} channels selected`;
      }
    }
    /**
     * Shows a specific wizard step.
     */
    showWizardStep(step) {
      if (!this.windowEl) return;
      const steps = this.windowEl.querySelectorAll("[data-wizard-step]");
      for (const stepEl of steps) {
        stepEl.classList.remove("active");
      }
      const targetStep = this.windowEl.querySelector(`[data-wizard-step="${step}"]`);
      targetStep?.classList.add("active");
      this.updateStepIndicator();
    }
    /**
     * Updates the step indicator dots.
     */
    updateStepIndicator() {
      const dots = this.windowEl?.querySelectorAll("[data-step]");
      if (!dots) return;
      dots.forEach((dot, index2) => {
        dot.classList.remove("active", "completed");
        if (index2 === this.currentWizardStep) {
          dot.classList.add("active");
        } else if (index2 < this.currentWizardStep) {
          dot.classList.add("completed");
        }
      });
    }
    /**
     * Handles minimizing the window.
     */
    handleMinimize() {
      if (!this.isRunning()) {
        this.hide();
        return;
      }
      if (!this.miniIndicator) {
        this.miniIndicator = document.createElement("div");
        this.miniIndicator.className = `${CSS_PREFIX}-mini-indicator`;
        this.miniIndicator.setAttribute("data-action", "maximize");
        this.miniIndicator.innerHTML = `
        <div class="${CSS_PREFIX}-mini-progress">
          <svg class="${CSS_PREFIX}-mini-ring" viewBox="0 0 44 44">
            <circle class="${CSS_PREFIX}-mini-ring-bg" cx="22" cy="22" r="20"/>
            <circle class="${CSS_PREFIX}-mini-ring-fill" cx="22" cy="22" r="20" data-bind="miniRing"/>
          </svg>
          <div class="${CSS_PREFIX}-mini-percent" data-bind="miniPercent">0%</div>
        </div>
      `;
        this.container?.appendChild(this.miniIndicator);
      }
      this.isMinimized = true;
      this.windowEl?.classList.remove("visible");
      this.backdropEl?.classList.remove("visible");
      this.miniIndicator.classList.add("visible");
    }
    /**
     * Handles maximizing (restoring) the window from minimized state.
     */
    handleMaximize() {
      if (!this.isMinimized) return;
      this.isMinimized = false;
      this.miniIndicator?.classList.remove("visible");
      this.windowEl?.classList.add("visible");
      this.backdropEl?.classList.add("visible");
    }
    /**
     * Updates the mini indicator progress.
     */
    updateMiniProgress(percent) {
      if (!this.miniIndicator || !this.isMinimized) return;
      const ring = this.miniIndicator.querySelector('[data-bind="miniRing"]');
      const percentEl = this.miniIndicator.querySelector('[data-bind="miniPercent"]');
      if (ring) {
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - percent / 100 * circumference;
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(offset);
      }
      if (percentEl) {
        percentEl.textContent = `${percent}%`;
      }
    }
    /**
     * Scans for messages to show in the review step.
     */
    async scanForReview() {
      if (!this.token || !this.authorId) {
        this.updateElement("reviewCount", "?");
        this.updateElement("reviewDetails", "Token not found");
        return;
      }
      this.updateElement("reviewCount", "...");
      this.updateElement("reviewDetails", "Scanning...");
      this.showWaitingIndicator("Searching messages...");
      const config = this.getFormConfig();
      const guildId = getGuildIdFromUrl();
      const channelId = getChannelIdFromUrl();
      const useChannelSearch = config.targetScope === "channel" || config.targetScope === "dm";
      const useServerSearch = config.targetScope === "server";
      if (useChannelSearch && !channelId) {
        this.updateElement("reviewCount", "?");
        this.updateElement("reviewDetails", "No channel detected");
        this.hideWaitingIndicator();
        return;
      }
      if (useServerSearch && (!guildId || guildId === "@me")) {
        this.updateElement("reviewCount", "?");
        this.updateElement("reviewDetails", "Not in a server");
        this.hideWaitingIndicator();
        return;
      }
      this.apiClient = new DiscordApiClient(this.token);
      try {
        const searchParams = {
          authorId: this.authorId
        };
        if (useServerSearch && guildId) {
          searchParams.guildId = guildId;
        } else if (channelId) {
          searchParams.channelId = channelId;
        }
        if (config.afterDate) {
          searchParams.minId = dateToSnowflake(config.afterDate);
        }
        if (config.beforeDate) {
          searchParams.maxId = dateToSnowflake(config.beforeDate);
        }
        if (config.contentFilter) {
          searchParams.content = config.contentFilter;
        }
        if (config.hasLink) {
          searchParams.hasLink = true;
        }
        if (config.hasFile) {
          searchParams.hasFile = true;
        }
        const searchResult = await this.apiClient.searchMessages(searchParams);
        const messages = searchResult.messages?.flat() ?? [];
        this.previewTotalCount = searchResult.total_results ?? messages.length;
        this.previewMessages = messages.slice(0, 5).map((msg) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          authorName: msg.author?.username
        }));
        this.updateElement("reviewCount", String(this.previewTotalCount));
        const location = config.targetScope === "server" ? "this server" : "this channel";
        const timeDesc = this.selectedTimeRange === "all" ? "" : ` from ${this.getTimeRangeDescription()}`;
        this.updateElement("reviewDetails", `In ${location}${timeDesc}`);
        const previewContent = this.windowEl?.querySelector('[data-bind="previewContent"]');
        if (previewContent) {
          previewContent.innerHTML = "";
          if (this.previewMessages.length === 0) {
            previewContent.innerHTML = `<div class="${CSS_PREFIX}-preview-msg">No messages found</div>`;
          } else {
            for (const msg of this.previewMessages) {
              const msgEl = document.createElement("div");
              msgEl.className = `${CSS_PREFIX}-preview-msg`;
              const preview = msg.content || "[No text content]";
              msgEl.textContent = preview.length > 60 ? `${preview.substring(0, 60)}...` : preview;
              previewContent.appendChild(msgEl);
            }
          }
        }
      } catch (error) {
        this.updateElement("reviewCount", "?");
        this.updateElement("reviewDetails", error instanceof Error ? error.message : "Scan failed");
      } finally {
        this.hideWaitingIndicator();
      }
    }
    /**
     * Gets a human-readable description of the selected time range.
     */
    getTimeRangeDescription() {
      switch (this.selectedTimeRange) {
        case "24h":
          return "the last 24 hours";
        case "72h":
          return "the last 3 days";
        case "30d":
          return "the last 30 days";
        case "90d":
          return "the last 90 days";
        case "1y":
          return "the last year";
        case "older-30d":
          return "older than 30 days";
        case "older-90d":
          return "older than 90 days";
        case "custom":
          return "custom range";
        default:
          return "all time";
      }
    }
    /**
     * Shows a waiting indicator with a message.
     */
    showWaitingIndicator(message) {
      const content = this.windowEl?.querySelector(`.${CSS_PREFIX}-content`);
      if (!content) return;
      this.hideWaitingIndicator();
      this.waitingIndicator = document.createElement("div");
      this.waitingIndicator.className = `${CSS_PREFIX}-waiting`;
      this.waitingIndicator.innerHTML = `
      <div class="${CSS_PREFIX}-spinner"></div>
      <span>${escapeHtml(message)}</span>
    `;
      const reviewStep = this.windowEl?.querySelector('[data-wizard-step="review"]');
      const summary = reviewStep?.querySelector(`.${CSS_PREFIX}-summary`);
      if (summary) {
        summary.insertAdjacentElement("afterend", this.waitingIndicator);
      }
    }
    /**
     * Hides the waiting indicator.
     */
    hideWaitingIndicator() {
      this.waitingIndicator?.remove();
      this.waitingIndicator = null;
    }
    /**
     * Handles the scan action - scans for messages and shows preview.
     */
    async handleScan() {
      if (!this.token || !this.authorId) {
        this.showError("Authentication token not found. Please refresh the page and try again.");
        return;
      }
      const config = this.getFormConfig();
      if (!config.channelId) {
        this.showError(
          "Could not detect current channel. Please navigate to a channel and try again."
        );
        return;
      }
      if (config.pattern) {
        try {
          new RegExp(config.pattern);
        } catch {
          this.showError(`Invalid regex pattern: ${config.pattern}`);
          return;
        }
      }
      this.showScreen("preview");
      this.apiClient = new DiscordApiClient(this.token);
      try {
        const searchParams = {
          authorId: this.authorId
        };
        if (config.afterDate) {
          searchParams.minId = dateToSnowflake(config.afterDate);
        }
        if (config.beforeDate) {
          searchParams.maxId = dateToSnowflake(config.beforeDate);
        }
        if (config.contentFilter) {
          searchParams.content = config.contentFilter;
        }
        if (config.hasLink) {
          searchParams.hasLink = true;
        }
        if (config.hasFile) {
          searchParams.hasFile = true;
        }
        let fullSearchParams;
        if (config.targetScope === "server" && config.guildId) {
          fullSearchParams = { ...searchParams, guildId: config.guildId };
        } else {
          fullSearchParams = { ...searchParams, channelId: config.channelId };
        }
        const searchResult = await this.apiClient.searchMessages(fullSearchParams);
        const messages = searchResult.messages?.flat() ?? [];
        this.previewTotalCount = searchResult.total_results ?? messages.length;
        this.previewMessages = messages.slice(0, 5).map((msg) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          authorName: msg.author?.username
        }));
        const estimatedSeconds = this.previewTotalCount * 1.5;
        const estimatedTime = formatDuration(estimatedSeconds * 1e3);
        const previewContentEl = this.windowEl?.querySelector('[data-bind="previewContent"]');
        if (previewContentEl) {
          previewContentEl.innerHTML = "";
          const content = createPreviewScreenContent(
            this.previewTotalCount,
            estimatedTime,
            this.previewMessages
          );
          previewContentEl.appendChild(content);
        }
      } catch (error) {
        this.showError(error instanceof Error ? error.message : "Failed to scan messages");
      }
    }
    /**
     * Handles going back to setup from preview.
     */
    handleBackToSetup() {
      this.previewMessages = [];
      this.previewTotalCount = 0;
      this.showScreen("setup");
    }
    /**
     * Handles confirmation of deletion from preview screen.
     * Runs the countdown animation then starts deletion.
     */
    handleConfirmDelete() {
      if (!this.windowEl) return;
      this._countdownCancel = runCountdownSequence(this.windowEl, () => {
        this._countdownCancel = null;
        this.handleStart();
        this.startStatusRotation();
      });
    }
    /**
     * Starts the rotating status messages during deletion.
     */
    startStatusRotation() {
      const statusEl = this.windowEl?.querySelector(
        '[data-bind="statusMessage"]'
      );
      if (!statusEl) return;
      this.statusRotator = createStatusRotator(statusEl, 3e3);
      this.statusRotator.start();
    }
    // =========================================================================
    // Private: Engine Callbacks
    // =========================================================================
    /**
     * Called when deletion starts.
     */
    onEngineStart(_state, _stats) {
      this.updateProgressUI(
        {
          running: true,
          paused: false,
          deletedCount: 0,
          failedCount: 0,
          totalFound: 0,
          initialTotalFound: 0,
          currentOffset: 0
        },
        {
          startTime: Date.now(),
          throttledCount: 0,
          throttledTime: 0,
          averagePing: 0,
          estimatedTimeRemaining: -1
        }
      );
    }
    /**
     * Called on each deletion progress update.
     */
    onEngineProgress(state, stats, message) {
      this.addFeedEntry({
        messageId: message.id,
        content: message.content,
        timestamp: new Date(message.timestamp),
        success: true
      });
      this.updateCurrentMessage(message.content);
      this.throttledProgressUpdate?.(state, stats);
    }
    /**
     * Called when status changes (e.g., "Finding oldest message...").
     */
    onEngineStatus(status) {
      const statusEl = this.windowEl?.querySelector('[data-bind="currentMessage"]');
      if (statusEl) {
        if (status) {
          statusEl.textContent = status;
          statusEl.classList.add(`${CSS_PREFIX}-status-searching`);
        } else {
          statusEl.classList.remove(`${CSS_PREFIX}-status-searching`);
        }
      }
    }
    /**
     * Called when deletion stops.
     */
    onEngineStop(state, stats) {
      this.updateProgressUI(state, stats);
      this.flushFeedUpdates();
      this.statusRotator?.stop();
      this.statusRotator = null;
      this.updateElement("finalDeleted", String(state.deletedCount));
      this.updateElement("finalFailed", String(state.failedCount));
      this.updateElement("finalDuration", formatDuration(Date.now() - stats.startTime));
      this.updateElement(
        "completeSummary",
        `Processed ${state.deletedCount + state.failedCount} messages.`
      );
      this.showScreen("complete");
      const confettiContainer = this.windowEl?.querySelector(
        '[data-bind="confettiContainer"]'
      );
      if (confettiContainer && state.deletedCount > 0) {
        createConfetti(confettiContainer, 30);
      }
    }
    /**
     * Called when an error occurs.
     */
    onEngineError(error) {
      this.showError(error.message);
    }
    // =========================================================================
    // Private: UI Updates
    // =========================================================================
    /**
     * Caches progress element references for efficient updates.
     * Should be called when transitioning to the running screen.
     */
    cacheProgressElements() {
      if (!this.windowEl) return;
      this.progressElements = {
        ring: this.windowEl.querySelector('[data-bind="progressRing"]'),
        bar: this.windowEl.querySelector('[data-bind="progressBar"]'),
        percent: this.windowEl.querySelector('[data-bind="progressPercent"]'),
        count: this.windowEl.querySelector('[data-bind="progressCount"]'),
        deleted: this.windowEl.querySelector('[data-bind="deletedCount"]'),
        failed: this.windowEl.querySelector('[data-bind="failedCount"]'),
        total: this.windowEl.querySelector('[data-bind="totalCount"]'),
        eta: this.windowEl.querySelector('[data-bind="eta"]'),
        rate: this.windowEl.querySelector('[data-bind="rateValue"]'),
        currentMessage: this.windowEl.querySelector(
          '[data-bind="currentMessage"]'
        ),
        elapsedTime: this.windowEl.querySelector('[data-bind="elapsedTime"]'),
        throttleInfo: this.windowEl.querySelector('[data-bind="throttleInfo"]'),
        throttleCount: this.windowEl.querySelector(
          '[data-bind="throttleCount"]'
        )
      };
    }
    /**
     * Updates the progress UI with current state.
     * Uses cached element references for better performance.
     */
    updateProgressUI(state, stats) {
      if (!this.progressElements) {
        this.cacheProgressElements();
      }
      if (!this.progressElements) return;
      const processed = state.deletedCount + state.failedCount;
      const total = state.initialTotalFound || state.totalFound || 1;
      const percent = Math.min(100, Math.round(processed / total * 100));
      const elapsedMinutes = (Date.now() - stats.startTime) / 6e4;
      const rate = elapsedMinutes > 0 ? Math.round(state.deletedCount / elapsedMinutes) : 0;
      const circumference = 2 * Math.PI * 52;
      if (this.progressElements.ring) {
        const offset = circumference - percent / 100 * circumference;
        this.progressElements.ring.style.strokeDasharray = String(circumference);
        this.progressElements.ring.style.strokeDashoffset = String(offset);
      }
      if (this.progressElements.bar) {
        this.progressElements.bar.style.width = `${percent}%`;
      }
      requestAnimationFrame(() => {
        if (!this.progressElements) return;
        if (this.progressElements.percent) {
          this.progressElements.percent.textContent = `${percent}%`;
        }
        if (this.progressElements.count) {
          this.progressElements.count.textContent = `${processed} / ${total}`;
        }
        if (this.progressElements.deleted) {
          this.progressElements.deleted.textContent = String(state.deletedCount);
        }
        if (this.progressElements.failed) {
          this.progressElements.failed.textContent = String(state.failedCount);
        }
        if (this.progressElements.total) {
          this.progressElements.total.textContent = String(
            state.initialTotalFound || state.totalFound
          );
        }
        if (this.progressElements.rate) {
          this.progressElements.rate.textContent = String(rate);
        }
        if (this.progressElements.eta) {
          if (stats.estimatedTimeRemaining > 0) {
            this.progressElements.eta.textContent = formatDuration(stats.estimatedTimeRemaining);
          } else if (state.running) {
            this.progressElements.eta.textContent = "--:--";
          } else {
            this.progressElements.eta.textContent = "";
          }
        }
        if (this.progressElements.elapsedTime && stats.startTime > 0) {
          const elapsed = Date.now() - stats.startTime;
          this.progressElements.elapsedTime.textContent = formatDuration(elapsed);
        }
        if (stats.throttledCount > 0) {
          if (this.progressElements.throttleInfo) {
            this.progressElements.throttleInfo.style.display = "flex";
          }
          if (this.progressElements.throttleCount) {
            this.progressElements.throttleCount.textContent = `${stats.throttledCount}x (${formatDuration(stats.throttledTime)})`;
          }
        }
        if (this.isMinimized) {
          this.updateMiniProgress(percent);
        }
      });
    }
    /**
     * Updates the current message being deleted.
     */
    updateCurrentMessage(content) {
      if (!this.progressElements?.currentMessage) return;
      const preview = content || "[No text content]";
      const truncated = preview.length > 50 ? `${preview.substring(0, 50)}...` : preview;
      this.progressElements.currentMessage.textContent = truncated;
    }
    /**
     * Updates channel info display and shows/hides appropriate target options.
     */
    updateChannelInfo() {
      const guildId = getGuildIdFromUrl();
      const isDM = guildId === "@me";
      const isServer = Boolean(guildId && guildId !== "@me");
      this.updateTargetOptionVisibility(isDM, isServer);
    }
    /**
     * Updates target option visibility and labels.
     */
    updateTargetOptionVisibility(isDM, isServer) {
      const dmCard = this.windowEl?.querySelector('[data-bind="dmCard"]');
      const serverCard = this.windowEl?.querySelector(
        '[data-bind="serverCard"]'
      );
      if (dmCard) dmCard.style.display = isDM ? "block" : "none";
      if (serverCard) serverCard.style.display = isServer ? "block" : "none";
    }
    /**
     * Adds a feed entry (batched).
     */
    addFeedEntry(entry) {
      this.feedEntries.push(entry);
      this.pendingFeedEntries.push(entry);
      if (!this.feedUpdateScheduled) {
        this.feedUpdateScheduled = true;
        this.throttledFeedUpdate?.();
      }
    }
    /**
     * Flushes pending feed entries to DOM.
     */
    flushFeedUpdates() {
      this.feedUpdateScheduled = false;
      if (this.pendingFeedEntries.length === 0) return;
      const feedEl = this.windowEl?.querySelector('[data-bind="feed"]');
      if (!feedEl) return;
      const fragment = document.createDocumentFragment();
      for (const entry of this.pendingFeedEntries) {
        const entryEl = document.createElement("div");
        entryEl.className = `${CSS_PREFIX}-feed-entry ${entry.success ? "success" : "error"}`;
        let preview = entry.content || "[No content]";
        if (preview.length > MAX_PREVIEW_LENGTH) {
          preview = `${preview.substring(0, MAX_PREVIEW_LENGTH)}...`;
        }
        entryEl.textContent = `${entry.success ? "[OK]" : "[ERR]"} ${preview}`;
        fragment.appendChild(entryEl);
      }
      feedEl.appendChild(fragment);
      trimChildren(feedEl, this.options.maxFeedEntries, false);
      feedEl.scrollTop = feedEl.scrollHeight;
      this.pendingFeedEntries = [];
    }
    /**
     * Updates a bound element's text content.
     */
    updateElement(binding, value) {
      const el = this.windowEl?.querySelector(`[data-bind="${binding}"]`);
      if (el) {
        el.textContent = value;
      }
    }
    /**
     * Shows an error message.
     */
    showError(message) {
      this.updateElement("errorMessage", escapeHtml(message));
      this.showScreen("error");
    }
    /**
     * Gets form configuration values.
     */
    getFormConfig() {
      const guildId = getGuildIdFromUrl();
      const channelId = getChannelIdFromUrl();
      const getInput = (name) => {
        return this.windowEl?.querySelector(`[data-input="${name}"]`);
      };
      const targetScope = this.selectedTarget;
      const manualChannelIdInput = getInput("manualChannelId");
      const manualChannelId = manualChannelIdInput?.value?.trim();
      const beforeDateInput = getInput("beforeDate");
      const afterDateInput = getInput("afterDate");
      const contentInput = getInput("contentFilter");
      const patternInput = getInput("pattern");
      let effectiveChannelId = channelId ?? "";
      if (targetScope === "manual") {
        if (this.selectedChannels.size > 0) {
          effectiveChannelId = Array.from(this.selectedChannels)[0] ?? "";
        } else if (manualChannelId) {
          effectiveChannelId = manualChannelId;
        }
      }
      const deletionOrderInput = this.windowEl?.querySelector(
        'input[name="deletionOrder"]:checked'
      );
      const deletionOrder = deletionOrderInput?.value || "newest";
      return {
        targetScope,
        guildId: guildId !== "@me" ? guildId ?? void 0 : void 0,
        channelId: effectiveChannelId,
        selectedChannelIds: Array.from(this.selectedChannels),
        beforeDate: beforeDateInput?.value ? new Date(beforeDateInput.value) : void 0,
        afterDate: afterDateInput?.value ? new Date(afterDateInput.value) : void 0,
        contentFilter: contentInput?.value || void 0,
        pattern: patternInput?.value || void 0,
        hasLink: this.filterStates.hasLink || false,
        hasFile: this.filterStates.hasFile || false,
        includePinned: this.filterStates.includePinned || false,
        deletionOrder
      };
    }
    /**
     * Updates the throttle/waiting state in the running screen.
     */
    updateThrottleState(isThrottled, currentDelay) {
      const runningScreen = this.windowEl?.querySelector('[data-screen="running"]');
      if (!runningScreen) return;
      let throttleEl = runningScreen.querySelector(`.${CSS_PREFIX}-waiting`);
      if (isThrottled) {
        if (!throttleEl) {
          throttleEl = document.createElement("div");
          throttleEl.className = `${CSS_PREFIX}-waiting`;
          const eta = this.windowEl?.querySelector('[data-bind="eta"]');
          eta?.insertAdjacentElement("afterend", throttleEl);
        }
        const seconds = Math.round(currentDelay / 1e3);
        throttleEl.innerHTML = `
        <div class="${CSS_PREFIX}-spinner"></div>
        <span>Rate limited - waiting ${seconds}s between deletes</span>
      `;
      } else {
        throttleEl?.remove();
      }
    }
  }
  const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    DetcordUI,
    STATUS_MESSAGES,
    createConfetti,
    createPreviewScreenContent,
    createStatusRotator,
    flashElement,
    runCountdownSequence,
    shakeElement
  }, Symbol.toStringTag, { value: "Module" }));
  const VERSION = "1.0.0";
  let ui = null;
  function init() {
    if (typeof window === "undefined") {
      console.warn("[Detcord] Not running in browser environment");
      return;
    }
    if (!window.location.hostname.includes("discord.com")) {
      console.warn("[Detcord] Not on Discord");
      return;
    }
    if (window.location.pathname === "/login") {
      console.log("[Detcord] On login page, waiting...");
      return;
    }
    console.log(`[Detcord] v${VERSION} loaded`);
    Promise.resolve().then(() => index).then(({ DetcordUI: DetcordUI2 }) => {
      ui = new DetcordUI2({
        onShow: () => console.log("[Detcord] Window opened"),
        onHide: () => console.log("[Detcord] Window closed"),
        maxFeedEntries: 100,
        progressThrottleMs: 100,
        feedThrottleMs: 50
      });
      ui.mount();
      console.log("[Detcord] UI mounted");
    }).catch((error) => {
      console.error("[Detcord] Failed to initialize UI:", error);
    });
  }
  function destroy() {
    if (ui) {
      ui.unmount();
      ui = null;
    }
  }
  if (typeof window !== "undefined" && typeof GM_info !== "undefined") {
    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init);
    }
  }
  exports.DELETABLE_MESSAGE_TYPES = DELETABLE_MESSAGE_TYPES$1;
  exports.DM_GUILD_ID = DM_GUILD_ID;
  exports.DeletionEngine = DeletionEngine;
  exports.DetcordUI = DetcordUI;
  exports.DiscordApiClient = DiscordApiClient;
  exports.VERSION = VERSION;
  exports.appendMany = appendMany;
  exports.buildQueryString = buildQueryString;
  exports.clamp = clamp;
  exports.createBatchUpdater = createBatchUpdater;
  exports.createBoundedArray = createBoundedArray;
  exports.createCleanupManager = createCleanupManager;
  exports.createOptimizedObserver = createOptimizedObserver;
  exports.dateToSnowflake = dateToSnowflake;
  exports.debounce = debounce;
  exports.delay = delay;
  exports.destroy = destroy;
  exports.escapeHtml = escapeHtml;
  exports.formatDuration = formatDuration;
  exports.getAuthorId = getAuthorId;
  exports.getChannelIdFromUrl = getChannelIdFromUrl;
  exports.getGuildIdFromUrl = getGuildIdFromUrl;
  exports.getToken = getToken;
  exports.getTokenFromLocalStorage = getTokenFromLocalStorage;
  exports.getTokenFromWebpack = getTokenFromWebpack;
  exports.init = init;
  exports.isMessageDeletable = isMessageDeletable;
  exports.isValidGuildId = isValidGuildId;
  exports.isValidSnowflake = isValidSnowflake;
  exports.isValidTokenFormat = isValidTokenFormat;
  exports.lazy = lazy;
  exports.maskToken = maskToken;
  exports.scheduleFrame = scheduleFrame;
  exports.snowflakeToDate = snowflakeToDate;
  exports.throttle = throttle;
  exports.trimChildren = trimChildren;
  exports.validateRegex = validateRegex;
  exports.validateSnowflake = validateSnowflake;
  exports.validateToken = validateToken;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
