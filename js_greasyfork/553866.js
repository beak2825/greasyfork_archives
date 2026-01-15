// ==UserScript==
// @name         DeepSeek Anti-recall
// @name:zh-CN   DeepSeek 防撤回脚本
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  Prevent deepseek from recalling response and cache the recalled message locally
// @description:zh-CN 防止DeepSeek撤回消息，被撤回的消息将保存在本地
// @author       Franky T
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553866/DeepSeek%20Anti-recall.user.js
// @updateURL https://update.greasyfork.org/scripts/553866/DeepSeek%20Anti-recall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TEMPLATE_RESPONSE = "TEMPLATE_RESPONSE";
    const CONTENT_FILTER = "CONTENT_FILTER";
    const RECALL_TIP_EN = "⚠️ This response has been is blocked and archived only on this browser";
    const RECALL_TIP_CH = "⚠️ 此回复已被拦截，仅在本浏览器存档";
    const RECALL_NOT_FOUND_EN = "⛔️ This response has been blocked and cannot be found in local cache.";
    const RECALL_NOT_FOUND_CH = "⛔️ 此回复已被拦截，且无法在本地缓存中找到";

    function getRecalledTipMessage(locale) {
        return locale == "zh_CN" ? RECALL_TIP_CH : RECALL_TIP_EN;
    }

    function getRecallNotFoundMessage(locale) {
        return locale == "zh_CN" ? RECALL_NOT_FOUND_CH : RECALL_NOT_FOUND_EN;
    }

    /**
     * Generate a key for local storage of deleted message
     *  @param {string} sessId - The session Id
     *  @param {number} msgId - The message Id
     *  @returns {string} The local storage key
     */
    function _getKey(sessId, msgId) {
        return "deleted-chat-sess-" + sessId + "-msg-" + msgId;
    }

    function _parseKey(key, container) {
        if (Array.isArray(container) && key.match(/^[-+]?\d+$/)) {
            let int = parseInt(key);
            if (int < 0) {
                int = container.length + int;
            }
            return int;
        }
        return key;
    }


    /**
     * Util function for setting a object's field with a string path
     */
    function _setValueByPath(obj, path, value, isAppend) {
        const keys = path.split("/");
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            let key = _parseKey(keys[i], current);

            if (!(key in current)) {
                const nextKey = _parseKey(keys[i + 1], current);
                current[key] = typeof nextKey === 'number' ? [] : {};
            }

            current = current[key];
        }

        const lastKey = _parseKey(keys[keys.length - 1], current);

        let lastVal = current[lastKey];
        if (isAppend) {
            if (Array.isArray(current[lastKey])) {
                for (let k = 0; k < value.length; k++) {
                    current[lastKey].push(value[k]);
                }
            } else {
                current[lastKey] = lastVal + value;
            }
        } else {
            current[lastKey] = value;
        }
        return obj;
    }

    /**
     * DSState is a class holding DeepSeek response state
     */
    function DSState() {
        this.fields = {};
        this.sessId = "";
        this.locale = "en_US";
        this.recalled = false;

        this._updatePath = "";
        this._updateMode = "SET"; // Default update mode is set
    }

    /**
     * Perform a single update with SSE on the state object. Return modified SSE if recall action detected
     * @param {object} data - A single SSE item from completion response
     * @returns {string} if not empty, the current SSE item should be modified (in case of recall action detected)
     */
    DSState.prototype.update = function(data) {
        let precheck = this.preCheck(data); // Pre-check SSE first
        if (data.p) {
            this._updatePath = data.p;
        }

        if (data.o) {
            this._updateMode = data.o;
        }

        let value = data.v;

        // If the value is object (typically "response" field), and no path defined
        // This could be the first SSE event we need, here we should initialize the fields
        if (typeof value == 'object' && this._updatePath == "") {
            for (var key in value) {
                this.fields[key] = value[key];
            }

            return precheck;
        }

        this.setField(this._updatePath, value, this._updateMode);

        return precheck;
    }

    /**
     * Precheck the SSE before applying update. Return modified SSE if recall action detected
     * @param {object} data - A single SSE item from completion response
     * @returns {string} if not empty, the current SSE item should be modified (in case of recall action detected)
     */
    DSState.prototype.preCheck = function(data) {
        let path = data.p ? data.p : this._updatePath;
        let mode = data.o ? data.o : this._updateMode;
        let modified = false;

        // Here we only consider a BATCH operation at the end of conversation.
        if (mode == "BATCH" && path == "response") {
            for (let i = 0; i < data.v.length; i++) {
                let v = data.v[i];
                // If TEMPLATE_RESPONSE detected in update of fragments, this must be a recall action!
                if (v.p == "fragments" && v.v[0].type == TEMPLATE_RESPONSE) {
                    modified = true;
                    // let shit = v.v[0].content;

                    // Append a tip for recalled message
                    data.v[i] = {"v": [{"id": this.fields.response.fragments.length + 1, "type": "TIP", style: "WARNING", "content": getRecalledTipMessage(this.locale)}], "p": "fragments", "o": "APPEND"};
                }

                if (v.p == "status" && v.v == CONTENT_FILTER) {
                    modified = true;

                    // Turn the status to FINISHED since if we keep CONTENT_FILTER the thinking process will disappear
                    data.v[i] = {"p": "status", "v": "FINISHED"};
                }
            }
        }

        if (modified) {
            this.recalled = true;

            // Save the recalled message fragments
            saveRecalledMessage(this.sessId, this.fields.response.message_id, this.fields.response.fragments);

            return JSON.stringify(data);
        }

        return "";
    }

    /**
     * Set fields on the state object based on SSE event
     * @param {string} path - The field path
     * @param {any} value - The new value of the field. If mode is BATCH this should be an array of operations on sub-fields
     * @param {string} mode - SET: Apply value to the field; APPEND: Append the value at the end of the field; BATCH: Perform operations in value array to the sub-fields of the field
     */
    DSState.prototype.setField = function(path, value, mode) {
        if (mode == "BATCH") {
            let subMode = "SET";
            for (let i = 0; i < value.length; i++) {
                let v = value[i];
                if (v.o) {
                    subMode = v.o;
                }

                // Set sub-fields recursively
                this.setField(path + "/" + v.p, v.v, subMode);
            }
        } else if (mode == "SET") {
            _setValueByPath(this.fields, path, value, false);
        } else if (mode == "APPEND") {
            _setValueByPath(this.fields, path, value, true);
        }
    }


    /**
     *  Save a recalled message to the local storage
     *  @param {string} sessId - The session Id
     *  @param {number} msgId - The message Id
     *  @param {Array} fragments - Framgments of the message
     */
    function saveRecalledMessage(sessId, msgId, fragments) {
        localStorage.setItem(_getKey(sessId, msgId), JSON.stringify(fragments));
    }

    /**
     *  Get a recalled message from the local storage
     *  @param {string} sessId - The session Id
     *  @param {number} msgId - The message Id
     *  @returns {Array} Framgments of the message, if not found, would be a error message
     */
    function getRecalledMessage(req, sessId, msgId) {
        let frags = JSON.parse(localStorage.getItem(_getKey(sessId, msgId)));
        if (!frags) {
            // The message not exist in the local storage, show a error message in original template format
            return [{content: getRecallNotFoundMessage(req.__locale), id: 2, type: TEMPLATE_RESPONSE}];
        }

        // Append a tip, indicates the response have been recalled
        frags.push({"id": frags.length + 1, "type": "TIP", style: "WARNING", "content": getRecalledTipMessage(req.__locale)});
        return frags;
    }

    /**
     *  Handler of single line of completion message
     *  @param {XMLHttpRequest} req - The XHR object
     *  @param {string} msg - The message line
     *  @returns {string} empty string or replaced text if recall detected
     */
    function handleEventItem(req, msg) {
        if (!msg.v) {
            return "";
        }

        // console.log(msg);

        return req.__dsState.update(msg);
    }

    /**
     *  Handler for Completion APIs, including completion, edit, continue and regenerate.
     *  @param {XMLHttpRequest} req - The XHR object
     *  @param {string} res - The response text
     *  @returns {string} The original or modified response
     */
    function onEventStreamResp(req, res) {
        // Extra fields of XHR object
        if (req.__messagesCount === undefined) {
            req.__messagesCount = 0; // Processed message count

            req.__dsState = new DSState();
            req.__dsState.sessId = req.__sessId;
            req.__dsState.locale = req.__locale;
        }

        let lastMessageCount = req.__messagesCount;

        let messages = res.split("\n");
        // Process the new messages in the response
        for (let i = lastMessageCount; i < messages.length - 1; i++) {
            let msg = messages[i];
            let data = {};
            req.__messagesCount++;
            if (!msg.startsWith("data: ")) {
                // Here, only lines with "data: " will be considered.
                continue;
            }

            // Extract the data event item, and process
            data = JSON.parse(msg.replace("data:", ""));
            let handleRes = handleEventItem(req, data);
            if (handleRes != "") {
                // This could be a recall message, now replace it
                messages[i] = "data: " + handleRes;
            }
        }

        // If this message get recalled, reconstruct it with lines
        if (req.__dsState.recalled) {
            let res2 = "";
            for (let l = 0; l < messages.length; l++) {
                res2 += messages[l] + "\n";
            }

            return res2;
        }

        return res;
    }

    /**
     *  History message response handler, if recalled message exists, replace them with cached message.
     *  @param {XMLHttpRequest} req - The XHR object
     *  @param {string} res - The response text
     *  @returns {string} The original or modified response
     */
    function onHistoryMessageResp(req, res) {
        let json = JSON.parse(res);
        if (!json.data || !json.data.biz_data) {
            return res;
        }

        let data = json.data.biz_data;
        let sessId = data.chat_session.id;
        let modified = false;

        for (let i = 0; i < data.chat_messages.length; i++) {
            // If a message get recalled, its status will be CONTENT_FILTER
            if (data.chat_messages[i].status == CONTENT_FILTER) {
                // Replace the message
                data.chat_messages[i].fragments = getRecalledMessage(req, sessId, data.chat_messages[i].message_id);

                // Replace the message status to finished, otherwise the think progress would not be shown
                data.chat_messages[i].status = "FINISHED";
                modified = true;
            }
        }

        if (modified) {
            json.data.biz_data = data;
            res = JSON.stringify(json);
        }

        // console.log(json);
        return res;
    }

    /**
     *  Monkey-patch the XMLHttpResponse object to intercept response
     */
    function installXhrHook() {
        let originXhrResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");
        let originXhrResponseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "responseText");
        let originXhrOpen = XMLHttpRequest.prototype.open;
        let originXhrSend = XMLHttpRequest.prototype.send;
        let originXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // Override getter of XHR response
        Object.defineProperty(XMLHttpRequest.prototype, "response", {
            get: function() {
                if (!this.__reqType) {
                    return originXhrResponse.get.call(this);
                }

                // If this is a generation or history response, replace it
                return this.__resp;
            },
            set: function(body) {
                return originXhrResponse.set.call(this, body);
            }
        });

        Object.defineProperty(XMLHttpRequest.prototype, "responseText", {
            get: function() {
                if (!this.__reqType) {
                    return originXhrResponseText.get.call(this);
                }

                return this.__resp;
            },
            set: function(body) {
                return originXhrResponseText.set.call(this, body);
            }
        });

        // Add a new method to get the original response from XHR
        XMLHttpRequest.prototype.getOriginalResponse = function() {
            return originXhrResponse.get.call(this);
        }

        XMLHttpRequest.prototype.open = function(method, url) {
            let [urlPath] = url.split("?");
            if (urlPath == '/api/v0/chat/history_messages') {
                this.__reqType = "history";
            } else if (urlPath == '/api/v0/chat/completion' || urlPath == '/api/v0/chat/edit_message' || urlPath == '/api/v0/chat/regenerate' ||
                       urlPath == '/api/v0/chat/continue' || urlPath == '/api/v0/chat/resume_stream') {
                this.__reqType = "generate";
            }

            return originXhrOpen.apply(this, arguments);
        }

        XMLHttpRequest.prototype.send = function(body) {
            if (!this.__reqType) {
                // This is not a history or generation request
                return originXhrSend.apply(this, arguments);
            }

            if (this.__reqType == "generate") {
                let bodyJson = JSON.parse(body);
                this.__sessId = bodyJson.chat_session_id; // Obtain the session Id
                this.__resp = "";
            }

            // Add listener of state change
            const originOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState >= 3) {
                    let origRes = this.getOriginalResponse();

                    // For history request, wait for complete response
                    if (this.__reqType == "history" && this.readyState == 4) {
                        this.__resp = onHistoryMessageResp(this, origRes);
                    } else if (this.__reqType == "generate") {
                        this.__resp = onEventStreamResp(this, origRes);
                    }
                }

                // Invoke original listeners
                if (originOnReadyStateChange) {
                    originOnReadyStateChange.apply(this, arguments);
                }
            }

            return originXhrSend.apply(this, arguments);
        }

        // Override the setRequestHeader method to obtain the request locale
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this.__reqType) {
                return originXhrSetRequestHeader.apply(this, arguments);
            }

            if (header == "x-client-locale") {
                this.__locale = value;
            }

            return originXhrSetRequestHeader.apply(this, arguments);
        }
    }

    // Install hook to intercept response
    installXhrHook();
})();