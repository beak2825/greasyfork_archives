// ==UserScript==
// @name         ChatGPT Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Export ChatGPT conversation & images in ZIP
// @author       MLR
// @match        https://chatgpt.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550320/ChatGPT%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/550320/ChatGPT%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

// =============================================
// ZIP ARCHIVE FUNCTIONALITY
// =============================================

/**
 * Creates and manages ZIP archive for exports using fflate
 */
class ArchiveManager {
    constructor() {
        this.files = new Map();
        this.fileCount = 0;
        console.log('[ChatGPT Exporter] ArchiveManager initialized with fflate');
    }

    async addFile(filename, content, useFolder = false, folderName = '') {
        let finalFilename = filename;
        // Create with folder (but first need to remove folder path from api filename and keep only filename)
        // if (useFolder && folderName) {
            // finalFilename = `${sanitizeFileName(folderName)}/${filename}`;
        // }
        console.log(`[ChatGPT Exporter] Adding file to archive: ${finalFilename}`);

        // Convert blob to Uint8Array for fflate
        let fileData;
        if (content instanceof Blob) {
            fileData = new Uint8Array(await content.arrayBuffer());
        } else if (typeof content === 'string') {
            fileData = new TextEncoder().encode(content);
        } else {
            fileData = content;
        }

        this.files.set(finalFilename, fileData);
        this.fileCount++;
        console.log(`[ChatGPT Exporter] File added. Total files: ${this.fileCount}`);
    }

    async downloadArchive(archiveName) {
        if (this.fileCount === 0) {
            throw new Error('No files to archive');
        }
        console.log(`[ChatGPT Exporter] Creating archive with ${this.fileCount} files...`);
        showNotification(`Creating archive with ${this.fileCount} files...`, 'info', 'archive-progress');

        try {
            console.log('[ChatGPT Exporter] Generating ZIP with fflate...');

            // Convert Map to object for fflate
            const filesObject = {};
            for (const [filename, data] of this.files) {
                filesObject[filename] = data;
            }

            // Use fflate.zipSync for immediate generation
            const zipData = fflate.zipSync(filesObject, {
                level: 1, // Fast compression
                mem: 8    // Memory level
            });

            console.log('[ChatGPT Exporter] ZIP generated successfully, size:', zipData.length);

            const zipBlob = new Blob([zipData], { type: 'application/zip' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = archiveName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('[ChatGPT Exporter] Archive download initiated');

            setTimeout(() => {
                URL.revokeObjectURL(url);
                console.log('[ChatGPT Exporter] Archive cleanup completed');
            }, 1000);

            removeNotification('archive-progress');

        } catch (error) {
            console.error('[ChatGPT Exporter] Archive generation failed:', error);
            removeNotification('archive-progress');
            throw new Error(`Archive generation failed: ${error.message}`);
        }
    }
}

/**
 * Downloads image and returns blob data for ZIP archive
 */
async function downloadImageForArchive(url, filename) {
    try {
        console.log(`[ChatGPT Exporter] Fetching image for archive: ${filename} from URL: ${url}`);

        if (!url || url === 'undefined') {
            throw new Error('Invalid download URL');
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        console.log(`[ChatGPT Exporter] Fetched blob size: ${blob.size} bytes for ${filename}`);

        // Remove folder path from api filename and keep only filename
        const cleanFilename = filename.split('/').pop();

        return { success: true, filename: cleanFilename, blob, size: blob.size };
    } catch (error) {
        console.error(`[ChatGPT Exporter] Failed to fetch image ${filename}:`, error);
        return { success: false, filename, error: error.message };
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Removes invalid characters from filename and limits length
 */
function sanitizeFileName(name) {
    return name.replace(/[\\/:*?"<>|]/g, '_')
              .replace(/\s+/g, '_')
              .replace(/__+/g, '_')
              .replace(/^_+|_+$/g, '')
              .slice(0, 100);
}

/**
 * Converts timestamp to readable date format
 */
function formatDate(dateInput) {
    if (!dateInput) return '';

    // ChatGPT API returns Unix timestamps in seconds, convert to milliseconds
    let timestamp;
    if (typeof dateInput === 'string') {
        timestamp = parseFloat(dateInput) * 1000;
    } else if (typeof dateInput === 'number') {
        timestamp = dateInput * 1000;
    } else if (dateInput instanceof Date) {
        return dateInput.toLocaleString();
    } else {
        return '';
    }

    const date = new Date(timestamp);
    return date.toLocaleString();
}

/**
 * Downloads content as file using browser download API
 */
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Downloads image from URL with specified filename
 */
async function downloadImage(url, filename) {
    try {
        console.log(`[ChatGPT Exporter] Downloading image: ${filename} from URL: ${url}`);

        if (!url || url === 'undefined') {
            throw new Error('Invalid download URL');
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }

        console.log(`[ChatGPT Exporter] Downloaded blob size: ${blob.size} bytes for ${filename}`);

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

        console.log(`[ChatGPT Exporter] Successfully downloaded: ${filename}`);
        return { success: true, filename, size: blob.size };
    } catch (error) {
        console.error(`[ChatGPT Exporter] Failed to download image ${filename}:`, error);
        return { success: false, filename, error: error.message };
    }
}

/**
 * Shows temporary notification to user with ability to update content
 */
function showNotification(message, type = "info", id = null) {
    // If ID provided, try to update existing notification
    if (id) {
        const existing = document.getElementById(id);
        if (existing) {
            existing.textContent = message;
            return existing;
        }
    }

    const notification = document.createElement('div');
    notification.className = 'chatgpt-notification';
    if (id) notification.id = id;

    const colors = {
        error: '#f44336',
        success: '#4CAF50',
        info: '#2196F3'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background-color: ${colors[type] || colors.info};
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds unless it has an ID (persistent notifications)
    if (!id) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    return notification;
}

/**
 * Removes notification by ID
 */
function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification && notification.parentNode) {
        notification.parentNode.removeChild(notification);
    }
}

// =============================================
// API FUNCTIONS
// =============================================

/**
 * Extracts conversation ID from current URL
 */
function getConversationId() {
    const match = window.location.pathname.match(/\/c\/([^/?]+)/);
    return match ? match[1] : null;
}

/**
 * Gets session data from ChatGPT API
 */
async function getSession() {
    const response = await fetch("https://chatgpt.com/api/auth/session");
    return await response.json();
}

/**
 * Retrieves bearer token for API authentication
 */
async function getBearerToken() {
    try {
        const session = await getSession();
        if (!session.accessToken) {
            throw new Error('No access token found. Please log in to ChatGPT.');
        }
        return session.accessToken;
    } catch (error) {
        throw new Error(`Failed to get bearer token: ${error.message}`);
    }
}

/**
 * Fetches conversation data from ChatGPT API with full tree structure
 */
async function getChatGPTConversationData(conversationId = null) {
    const id = conversationId || getConversationId();
    if (!id) {
        throw new Error('Not in a conversation');
    }

    try {
        const token = await getBearerToken();

        const response = await fetch(`https://chatgpt.com/backend-api/conversation/${id}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": "Bearer " + token,
            },
            "method": "GET"
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[ChatGPT Exporter] Failed to get conversation data:', error);
        throw error;
    }
}

/**
 * Gets image download URL for given file ID
 */
async function getChatGPTImageUrl(fileId, conversationId) {
    try {
        console.log(`[ChatGPT Exporter] Getting image URL for fileId: ${fileId}, conversationId: ${conversationId}`);

        const token = await getBearerToken();

        const response = await fetch(`https://chatgpt.com/backend-api/files/download/${fileId}?conversation_id=${conversationId}&inline=false`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": "Bearer " + token,
            },
            "method": "GET"
        });

        console.log(`[ChatGPT Exporter] Image API response status: ${response.status} for fileId: ${fileId}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[ChatGPT Exporter] Image API request failed: ${response.status} - ${errorText}`);
            throw new Error(`Image API request failed: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[ChatGPT Exporter] Image API response data:`, data);

        if (!data.download_url) {
            console.error(`[ChatGPT Exporter] No download_url in response for fileId: ${fileId}`, data);
            throw new Error('No download URL provided by API');
        }

        return {
            downloadUrl: data.download_url,
            fileName: data.file_name,
            fileSize: data.file_size_bytes
        };
    } catch (error) {
        console.error(`[ChatGPT Exporter] Failed to get image URL for fileId: ${fileId}:`, error);
        return {
            error: error.message,
            fileId: fileId
        };
    }
}

// =============================================
// MESSAGE PARSING AND PROCESSING
// =============================================

/**
 * Extracts file ID from asset pointer strings
 */
function extractFileId(assetPointer) {
    console.log(`[ChatGPT Exporter] Extracting fileId from asset_pointer: ${assetPointer}`);

    // Extract file ID from asset_pointer patterns
    let match = assetPointer.match(/file_([a-f0-9]+)/);
    if (match) {
        const fileId = `file_${match[1]}`;
        console.log(`[ChatGPT Exporter] Extracted fileId (pattern 1): ${fileId}`);
        return fileId;
    }

    match = assetPointer.match(/file-([A-Za-z0-9]+)/);
    if (match) {
        const fileId = `file-${match[1]}`;
        console.log(`[ChatGPT Exporter] Extracted fileId (pattern 2): ${fileId}`);
        return fileId;
    }

    console.error(`[ChatGPT Exporter] Could not extract fileId from asset_pointer: ${assetPointer}`);
    return null;
}

/**
 * Extracts content from message content object
 */
function extractContent(content, messageType = 'text') {
    if (!content) return '';

    if (content.content_type === 'text') {
        return content.parts?.[0] || '';
    }

    if (content.content_type === 'multimodal_text') {
        return content.parts?.map(part => {
            if (typeof part === 'string') return part;
            if (part.content_type === 'text') {
                return part.text || part;
            }
            if (part.content_type === 'image_asset_pointer') {
                return '[Image]';
            }
            return '';
        }).join('') || '';
    }

    if (content.content_type === 'thoughts') {
        // Extract thinking content
        if (content.thoughts && Array.isArray(content.thoughts)) {
            return content.thoughts.map(thought => {
                let thinkingText = '';
                if (thought.summary) {
                    thinkingText += `**${thought.summary}**\n`;
                }
                if (thought.content) {
                    thinkingText += thought.content;
                }
                return thinkingText;
            }).join('\n\n');
        }
        return '';
    }

    // Handle code content type which may contain JSON image prompts
    if (content.content_type === 'code') {
        return content.text || '';
    }

    return '';
}

/**
 * Parses JSON image generation prompts from both text and code content types
 */
function parseImagePrompt(content) {
    try {
        let jsonStr = '';

        // Handle text content type
        if (content.content_type === 'text' && content.parts?.[0]) {
            jsonStr = content.parts[0];
        }
        // Handle code content type with JSON
        else if (content.content_type === 'code' && content.text) {
            jsonStr = content.text;
        }

        if (jsonStr && jsonStr.startsWith('{') && jsonStr.includes('prompt')) {
            const promptData = JSON.parse(jsonStr);
            return {
                prompt: promptData.prompt,
                size: promptData.size,
                n: promptData.n
            };
        }
    } catch (e) {
        // Not a valid JSON prompt
    }
    return null;
}

/**
 * Checks if message should be included in conversation
 */
function shouldIncludeMessage(message) {
    if (!message) return false;
    if (message.metadata?.is_visually_hidden_from_conversation) return false;
    if (message.metadata?.is_contextual_answers_system_message) return false;

    // Exclude thinking messages - they should be attached to main messages
    if (message.content?.content_type === 'thoughts') return false;

    // Include user messages and assistant messages with content
    if (message.author?.role === 'user') return true;
    if (message.author?.role === 'assistant') return true;
    if (message.author?.role === 'system' && message.content?.parts?.length > 0) return true;
    if (message.author?.role === 'tool') return true;

    return false;
}

/**
 * Checks if node should be included in technical analysis
 */
function shouldIncludeNodeInAnalysis(message) {
    if (!message) return false;

    // Include ALL messages for technical analysis
    return true;
}

/**
 * Finds logical parent of a message, skipping hidden system nodes
 */
function findLogicalParent(nodeId, mapping) {
    const node = mapping[nodeId];
    if (!node || !node.parent) return null;

    const parent = mapping[node.parent];
    if (!parent || !parent.message) return node.parent;

    return node.parent;
}

/**
 * Gets actual parent node - for technical analysis
 */
function getActualParent(nodeId, mapping) {
    const node = mapping[nodeId];
    return node?.parent || null;
}

/**
 * Finds all logical children of a parent node, traversing through hidden system nodes
 */
function findLogicalChildren(parentId, mapping) {
    const children = [];

    function collectChildren(nodeId) {
        const node = mapping[nodeId];
        if (!node || !node.children) return;

        for (const childId of node.children) {
            const child = mapping[childId];
            if (!child || !child.message) continue;

            // Include ALL children, don't skip system messages
            children.push({
                nodeId: childId,
                message: child.message,
                role: child.message.author?.role,
                createTime: child.message.create_time || 0
            });
        }
    }

    collectChildren(parentId);
    return children;
}

/**
 * Builds version information for messages by finding alternatives at each level
 * Messages with the same logical parent and role get version numbers
 */
function buildVersionInfo(mapping) {
    const versionInfo = new Map();

    // Handle ChatGPT response versions (based on end_turn completion)
    const completedResponses = [];
    for (const [nodeId, node] of Object.entries(mapping)) {
        if (node.message &&
            node.message.author?.role === 'assistant' &&
            node.message.end_turn === true &&
            shouldIncludeMessage(node.message)) {
            completedResponses.push({
                nodeId: nodeId,
                message: node.message,
                createTime: node.message.create_time || 0
            });
        }
    }

    // Group completed responses by the user message they're responding to
    const responseGroups = new Map();
    for (const response of completedResponses) {
        const userMessageId = findOriginatingUserMessage(response.nodeId, mapping);
        if (userMessageId) {
            if (!responseGroups.has(userMessageId)) {
                responseGroups.set(userMessageId, []);
            }
            responseGroups.get(userMessageId).push(response);
        }
    }

    // Assign version numbers to ChatGPT response groups with multiple responses
    for (const [userMessageId, responses] of responseGroups.entries()) {
        if (responses.length > 1) {
            responses.sort((a, b) => a.createTime - b.createTime);
            responses.forEach((response, index) => {
                versionInfo.set(response.message.id, {
                    version: index + 1,
                    total: responses.length
                });
            });
        }
    }

    // Handle user message versions (traditional sibling approach)
    const processedParents = new Set();
    for (const [nodeId, node] of Object.entries(mapping)) {
        if (!node.message ||
            !shouldIncludeMessage(node.message) ||
            node.message.author?.role !== 'user') continue;

        const logicalParent = findLogicalParent(nodeId, mapping);
        if (!logicalParent || processedParents.has(logicalParent)) continue;

        const siblings = findLogicalChildren(logicalParent, mapping);
        processedParents.add(logicalParent);

        const userSiblings = siblings.filter(s => s.role === 'user');
        if (userSiblings.length > 1) {
            userSiblings.sort((a, b) => (a.createTime || 0) - (b.createTime || 0));
            userSiblings.forEach((sibling, index) => {
                versionInfo.set(sibling.message.id, {
                    version: index + 1,
                    total: userSiblings.length
                });
            });
        }
    }

    return versionInfo;
}

/**
 * Traces back from a ChatGPT response node to find the originating user message
 */
function findOriginatingUserMessage(nodeId, mapping) {
    let currentId = nodeId;
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        const parentId = getActualParent(currentId, mapping);
        if (!parentId) break;

        const parentNode = mapping[parentId];
        if (!parentNode || !parentNode.message) break;

        // If we found a user message, this is our target
        if (parentNode.message.author?.role === 'user') {
            return parentId;
        }

        // Continue traversing up the tree
        currentId = parentId;
    }

    return null;
}

/**
 * Finds thinking messages associated with a specific message
 */
function findThinkingForMessage(mapping, messageNodeId) {
    const thinkingMessages = [];
    const visited = new Set();

    // Look backwards in the conversation tree to find thinking messages
    function searchForThinking(nodeId, depth = 0) {
        if (depth > 5 || visited.has(nodeId)) return; // Prevent infinite loops
        visited.add(nodeId);

        const node = mapping[nodeId];
        if (!node) return;

        // If this node is a thinking message, add it
        if (node.message && node.message.content?.content_type === 'thoughts') {
            thinkingMessages.push(node.message);
        }

        // Search parent
        if (node.parent) {
            searchForThinking(node.parent, depth + 1);
        }
    }

    // Search from the message node
    searchForThinking(messageNodeId);

    // Sort thinking messages by creation time
    thinkingMessages.sort((a, b) => (a.create_time || 0) - (b.create_time || 0));

    return thinkingMessages;
}

/**
 * Collects all nodes that compose a ChatGPT response leading to end_turn
 */
function collectResponseNodes(finalNodeId, mapping) {
    const nodes = [];
    const visited = new Set();

    // Traverse back from final node to collect all nodes in this response chain
    function collectBackward(nodeId) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = mapping[nodeId];
        if (!node || !node.message) return;

        // Include ALL nodes that are part of the technical chain
        if (shouldIncludeNodeInAnalysis(node.message)) {
            nodes.unshift({
                id: nodeId,
                shortId: nodeId.substring(0, 8),
                contentType: node.message.content?.content_type || 'text',
                role: node.message.author?.role || 'unknown',
                createTime: node.message.create_time || 0
            });
        }

        // Continue with parent if it's part of the same response chain
        const actualParent = getActualParent(nodeId, mapping);
        if (actualParent) {
            const parentNode = mapping[actualParent];
            if (parentNode && parentNode.message &&
                parentNode.message.author?.role !== 'user') {
                collectBackward(actualParent);
            }
        }
    }

    collectBackward(finalNodeId);
    return nodes.sort((a, b) => a.createTime - b.createTime);
}

/**
 * Builds complete message chain using chain-based approach
 * Each chain represents a dialogue path from user message to assistant completion
 */
function buildMessageChain(conversationData) {
    const mapping = conversationData.mapping;
    const messages = [];
    const chains = [];

    // Find root node
    function findRootNode() {
        for (const [id, node] of Object.entries(mapping)) {
            if (!node.parent || node.parent === null) return id;
        }
        return null;
    }

    // Build chains by traversing tree to end_turn points
    function buildChains(nodeId, currentChain = [], visited = new Set()) {
        if (visited.has(nodeId)) return;

        const node = mapping[nodeId];
        if (!node) return;

        const localVisited = new Set([...visited, nodeId]);

        // Add current message to chain if it should be included
        if (node.message && shouldIncludeMessage(node.message)) {
            const messageContent = {
                id: node.message.id,
                role: node.message.author?.role || 'unknown',
                authorName: node.message.author?.name,
                recipient: node.message.recipient,
                content: extractContent(node.message.content),
                rawContent: node.message.content,
                created_at: node.message.create_time,
                metadata: node.message.metadata || {},
                parent: node.parent,
                children: node.children || [],
                uuid: node.message.id,
                parent_message_uuid: node.parent,
                end_turn: node.message.end_turn,
                nodeId: nodeId
            };

            currentChain = [...currentChain, messageContent];
        }

        // Check for end_turn completion or empty content with end_turn
        const isEndTurn = node.message?.end_turn === true;
        const isAssistant = node.message?.author?.role === 'assistant';
        const hasEmptyContent = !node.message?.content?.parts?.[0] || node.message.content.parts[0] === '';

        if (isEndTurn && isAssistant && (shouldIncludeMessage(node.message) || hasEmptyContent)) {
            if (currentChain.length > 0) {
                chains.push([...currentChain]);
            }
        }

        // Continue with children
        if (node.children && node.children.length > 0) {
            for (const childId of node.children) {
                buildChains(childId, [...currentChain], localVisited);
            }
        } else if (currentChain.length > 0 &&
                  currentChain[currentChain.length - 1].role === 'assistant') {
            // If no children and last message is assistant, save chain
            chains.push([...currentChain]);
        }
    }

    const rootId = findRootNode();
    if (rootId) {
        buildChains(rootId);
    }

    // Process chains to extract unique messages with proper composition
    const processedMessages = new Set();

    for (const chain of chains) {
        for (const message of chain) {
            if (processedMessages.has(message.id)) continue;

            // For assistant messages, collect all composing nodes
            if (message.role === 'assistant') {
                const composingNodes = collectResponseNodes(message.nodeId, mapping);
                message.composingNodes = composingNodes;

                // Find thinking messages
                const thinkingMessages = findThinkingForMessage(mapping, message.nodeId);
                message.thinkingMessages = thinkingMessages;
            } else {
                // For user messages, just single node
                message.composingNodes = [{
                    id: message.nodeId,
                    shortId: message.nodeId.substring(0, 8),
                    contentType: message.rawContent?.content_type || 'text',
                    role: message.role,
                    createTime: message.created_at || 0
                }];
            }

            messages.push(message);
            processedMessages.add(message.id);
        }
    }

    return messages;
}

/**
 * Processes ChatGPT messages using chain-based approach and extracts images if present
 */
async function parseChatGPTMessages(conversationData) {
    const messages = buildMessageChain(conversationData);
    const images = [];

    // Build version information using tree mapping structure
    const versionInfo = buildVersionInfo(conversationData.mapping);

    // Add version information to messages
    messages.forEach(message => {
        if (versionInfo.has(message.uuid)) {
            message.versionInfo = versionInfo.get(message.uuid);
        }
    });

    // Parse image prompts from all messages for later association
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        // Check for image generation prompts and store them with message reference
        if (message.role === 'assistant' && message.recipient === 't2uay3k.sj1i4kz') {
            const promptData = parseImagePrompt(message.rawContent);
            if (promptData) {
                message.imagePrompt = promptData;
            }
        }
    }

    // Collect image placeholders and associate with final messages in chains
    const imagePromises = [];
    const processedImages = new Set(); // Track processed image IDs to prevent duplicates
    const imageToFinalMessage = new Map(); // Map images to their final assistant message

    // Build map of image generations to their final assistant messages
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        // Find tool messages with images and map them to the final assistant message in the chain
        if (message.rawContent?.content_type === 'multimodal_text') {
            const parts = message.rawContent.parts || [];
            for (const part of parts) {
                if (part.content_type === 'image_asset_pointer') {
                    // Only process generated images (sediment://), skip uploaded images (file-service://)
                    if (!part.asset_pointer.startsWith('sediment://')) {
                        console.log(`[ChatGPT Exporter] Skipping uploaded image: ${part.asset_pointer}`);
                        continue;
                    }

                    const fileId = extractFileId(part.asset_pointer);
                    if (fileId && !processedImages.has(fileId)) {
                        processedImages.add(fileId);

                        // Find the final assistant message in this generation chain
                        let finalAssistantMessage = null;
                        let promptText = null;
                        let promptParams = null;

                        // Look forward to find the final assistant message with end_turn=true
                        for (let j = i + 1; j < messages.length; j++) {
                            if (messages[j].role === 'assistant' && messages[j].end_turn === true) {
                                finalAssistantMessage = messages[j];
                                break;
                            }
                        }

                        // Look backward to find prompt in the chain if no forward final message
                        if (!finalAssistantMessage) {
                            for (let j = i - 1; j >= 0; j--) {
                                if (messages[j].role === 'assistant' && messages[j].end_turn === true) {
                                    finalAssistantMessage = messages[j];
                                    break;
                                }
                            }
                        }

                        // Find prompt by searching backwards in the chain from current position
                        for (let j = i - 1; j >= 0; j--) {
                            if (messages[j].imagePrompt) {
                                promptText = messages[j].imagePrompt.prompt;
                                promptParams = messages[j].imagePrompt;
                                break;
                            }
                        }

                        const realFileSize = part.size_bytes || null;
                        const imageTitle = message.metadata?.image_gen_title || null;

                        const imageData = {
                            messageId: finalAssistantMessage ? finalAssistantMessage.id : message.id,
                            parentId: message.parent,
                            fileId: fileId,
                            downloadUrl: null, // Will be populated by API call
                            fileName: null, // No filename initially - will be populated with real path from API response (user-XXX/uuid.png format)
                            fileSize: realFileSize,
                            width: part.width,
                            height: part.height,
                            metadata: part.metadata,
                            prompt: promptText,
                            promptParams: promptParams,
                            imageGenTitle: imageTitle
                        };

                        images.push(imageData);

                        // Queue API call for download URL
                        imagePromises.push({
                            imageIndex: images.length - 1,
                            promise: getChatGPTImageUrl(fileId, conversationData.conversation_id)
                        });
                    }
                }
            }
        }
    }

    // Filter messages for display (user, assistant with text, but NOT standalone image prompts)
    const displayMessages = messages.filter(m => {
        // Include user messages
        if (m.role === 'user') return true;

        // Include assistant messages with actual content (not just prompts)
        if (m.role === 'assistant' && m.content && !m.imagePrompt) return true;

        // Include assistant messages with empty content but end_turn=true
        if (m.role === 'assistant' && m.end_turn === true && (!m.content || m.content === '')) return true;

        // Exclude standalone image prompts - they will be merged with final response

        return false;
    });

    return { messages: displayMessages, images, allMessages: messages, imagePromises };
}

// =============================================
// MARKDOWN GENERATION
// =============================================

/**
 * Generates markdown content for conversation
 */
function generateConversationMarkdown(conversationData, messages, images) {
    const parts = [];

    // Create mapping index for API order numbering
    const mappingIndex = new Map();
    let indexCounter = 0;
    for (const [nodeId, node] of Object.entries(conversationData.mapping)) {
        mappingIndex.set(nodeId, indexCounter++);
    }

    // Header section
    const header = [
        `# ${conversationData.title || 'ChatGPT Conversation'}`,
        `*URL:* https://chatgpt.com/c/${conversationData.conversation_id}`,
        `*Created:* ${formatDate(conversationData.create_time)}`,
        `*Updated:* ${formatDate(conversationData.update_time)}`,
        `*Exported:* ${formatDate(new Date())}`
    ];

    if (conversationData.default_model_slug) {
        header.push(`*Model:* \`${conversationData.default_model_slug}\`  `);
    }

    parts.push(header.join('\n'));
    parts.push('---');

    // Messages section
    for (const message of messages) {
        const messageLines = [];

        // Determine role display name
        let role = message.role;
        if (message.role === 'user') {
            role = 'Human  ';
        } else if (message.role === 'assistant') {
            role = message.imagePrompt ? 'Image Generation Prompt  ' : 'ChatGPT  ';
        }

        // Get API mapping index for this message
        const apiIndex = mappingIndex.get(message.id) || 0;

        // Message header
        messageLines.push(`## ${apiIndex} - ${role}  `);
        messageLines.push(`*UUID:* \`${message.id}\`  `);

        // Parent UUID
        if (message.parent_message_uuid) {
            messageLines.push(`*Parent UUID:* \`${message.parent_message_uuid}\`  `);
        }

        messageLines.push(`*Created:* ${formatDate(message.created_at)}  `);

        // Version information
        if (message.versionInfo) {
            messageLines.push(`*Version:* ${message.versionInfo.version} of ${message.versionInfo.total}  `);
        }

        // Node composition information
        if (message.composingNodes && message.composingNodes.length > 0) {
            messageLines.push(`*Composed from nodes:* ${message.composingNodes.length}  `);

            // Node details
            const nodeDetails = message.composingNodes.map(node => {
                const apiIdx = mappingIndex.get(node.id) || 'unknown';
                return `${apiIdx}:${node.shortId}(${node.role}:${node.contentType})`;
            }).join(', ');
            messageLines.push(`*Node details:* ${nodeDetails}  `);
        }

        // Add thinking content if present
        if (message.thinkingMessages && message.thinkingMessages.length > 0) {
            messageLines.push(''); // Empty line before thinking
            messageLines.push('### Thinking Process');

            message.thinkingMessages.forEach(thinking => {
                messageLines.push('');
                messageLines.push('<details>');
                messageLines.push('<summary>ChatGPT thinking...</summary>');
                messageLines.push('');

                const thinkingContent = extractContent(thinking.content);
                if (thinkingContent) {
                    messageLines.push(thinkingContent);
                }

                messageLines.push('');
                messageLines.push('</details>');
            });
            messageLines.push('');
        }

        // Message content
        if (message.content && !message.imagePrompt) {
            messageLines.push(''); // Empty line before content
            messageLines.push(message.content);
        }

        // Find images associated with this message (either direct or through chain composition)
        const relatedImages = images.filter(img => {
            // Direct message association (for tool messages with images)
            if (img.messageId === message.id) return true;

            // Check if any of the composing nodes are associated with images
            if (message.composingNodes) {
                for (const node of message.composingNodes) {
                    if (img.messageId === node.id) return true;
                }
            }

            return false;
        });

        for (const image of relatedImages) {
            messageLines.push(''); // Empty line before image section
            messageLines.push('### Generated Image  ');

            if (image.imageGenTitle) {
                messageLines.push(`**Title:** ${image.imageGenTitle}  `);
            }

            if (image.prompt) {
                messageLines.push(`**Prompt:** ${image.prompt}  `);
            }

            if (image.promptParams) {
                messageLines.push(`**Generation Size:** ${image.promptParams.size}  `);
                messageLines.push(`**Count:** ${image.promptParams.n}  `);
            }

            if (image.width && image.height) {
                messageLines.push(`**Dimensions:** ${image.width}x${image.height}  `);
            }

            if (image.fileSize && image.fileSize > 0) {
                messageLines.push(`**Size:** ${Math.round(image.fileSize / 1024)} KB  `);
            }

            // Display file information populated with real path from API response (user-XXX/uuid.png format)
            if (image.fileName) {
                messageLines.push(`**File:** ${image.fileName}  `);
            }

            messageLines.push(`**File ID:** ${image.fileId}  `);
        }

        parts.push(messageLines.join('\n'));

        // Add message separator except for last message
        if (messages.indexOf(message) < messages.length - 1) {
            parts.push('__________');
        }
    }

    return parts.join('\n\n');
}

/**
 * Generates filename based on conversation title and date
 */
function generateFileName(conversationData) {
    const title = sanitizeFileName(conversationData.title || 'ChatGPT_Conversation');
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `${title}_${date}.md`;
}

// =============================================
// EXPORT FUNCTIONS
// =============================================

/**
 * Main export function for conversation
 */
async function exportConversation() {
    try {
        showNotification('Fetching conversation data...', 'info');

        const conversationData = await getChatGPTConversationData();
        const { messages, images, imagePromises } = await parseChatGPTMessages(conversationData);

        // Generate markdown content
        const markdown = generateConversationMarkdown(conversationData, messages, images);
        const filename = generateFileName(conversationData);

        // If no images, export markdown as separate file (existing behavior)
        if (images.length === 0) {
            downloadFile(filename, markdown);
            showNotification(`Conversation exported: ${filename}`, 'success');
            return;
        }

        // If there are images, ask user about ZIP archive
        const downloadChoice = confirm(`Found ${images.length} images. Download conversation and images as ZIP archive?`);
        if (!downloadChoice) {
            // User declined ZIP, export markdown only
            downloadFile(filename, markdown);
            showNotification(`Conversation exported: ${filename}`, 'success');
            return;
        }

        // ZIP archive - proceed with images and markdown
        if (imagePromises && imagePromises.length > 0) {
            const progressNotification = showNotification(`Processing image URLs... (0/${imagePromises.length})`, 'info', 'image-progress');

            const urlErrors = [];
            const downloadErrors = [];
            const archive = new ArchiveManager();


            // Process image promises with progress indication
            for (let idx = 0; idx < imagePromises.length; idx++) {
                const { imageIndex, promise } = imagePromises[idx];
                const image = images[imageIndex];

                showNotification(`Processing image URLs... (${idx + 1}/${imagePromises.length}) - ${image.fileName}`, 'info', 'image-progress');

                try {
                    const imageInfo = await promise;
                    if (imageInfo && !imageInfo.error) {
                        images[imageIndex].downloadUrl = imageInfo.downloadUrl;
                        images[imageIndex].fileName = imageInfo.fileName || images[imageIndex].fileName;
                        images[imageIndex].fileSize = imageInfo.fileSize || images[imageIndex].fileSize;
                        console.log(`[ChatGPT Exporter] Successfully got URL for: ${images[imageIndex].fileName}`);
                    } else {
                        const error = imageInfo ? imageInfo.error : 'Unknown error';
                        console.error(`[ChatGPT Exporter] Failed to get URL for ${image.fileName}: ${error}`);
                        urlErrors.push({ fileName: image.fileName, fileId: image.fileId, error });
                    }
                } catch (error) {
                    console.error(`[ChatGPT Exporter] Exception getting URL for ${image.fileName}:`, error);
                    urlErrors.push({ fileName: image.fileName, fileId: image.fileId, error: error.message });
                }

                // Small delay between API calls to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Report URL processing results
            const successfulUrls = images.filter(img => img.downloadUrl && img.downloadUrl !== 'undefined').length;
            console.log(`[ChatGPT Exporter] URL processing complete: ${successfulUrls}/${images.length} successful`);

            if (urlErrors.length > 0) {
                console.error(`[ChatGPT Exporter] URL processing errors:`, urlErrors);
                showNotification(`URL processing complete: ${successfulUrls}/${images.length} successful, ${urlErrors.length} failed`, 'info', 'image-progress');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Show error summary
            }

            // Generate updated markdown with correct filenames from API response
            // Note: this after processing imagePromises because images[].fileName
            // gets updated with real paths (user-XXX/uuid.png) instead of metadata gen_id names (dalle_xxx.png)
            const updatedMarkdown = generateConversationMarkdown(conversationData, messages, images);
            await archive.addFile(filename, updatedMarkdown, false);
            console.log(`[ChatGPT Exporter] Added markdown to archive: ${filename}`);

            // Download processed images and add to ZIP
            let downloadedCount = 0;
            const totalDownloads = images.filter(img => img.downloadUrl && img.downloadUrl !== 'undefined').length;

            if (totalDownloads > 0) {
                showNotification(`Adding images to archive... (0/${totalDownloads})`, 'info', 'image-progress');

                for (const image of images) {
                    if (image.downloadUrl && image.downloadUrl !== 'undefined') {
                        showNotification(`Adding images to archive... (${downloadedCount + 1}/${totalDownloads}) - ${image.fileName}`, 'info', 'image-progress');

                        const result = await downloadImageForArchive(image.downloadUrl, image.fileName);
                        if (result.success) {
                            await archive.addFile(result.filename, result.blob, false);
                            downloadedCount++;
                            console.log(`[ChatGPT Exporter] Added to archive: ${result.filename} (${result.size} bytes)`);
                        } else {
                            downloadErrors.push({ fileName: result.filename, error: result.error });
                            console.error(`[ChatGPT Exporter] Failed to add to archive: ${result.filename} - ${result.error}`);
                        }

                        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay
                    }
                }
            }

            // Create and download the ZIP archive (always, even if no images downloaded, because we have markdown)
            removeNotification('image-progress');
            const title = sanitizeFileName(conversationData.title || 'ChatGPT_Conversation');
            const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const zipFilename = `${title}_complete_${date}.zip`;

            try {
                await archive.downloadArchive(zipFilename);
                const fileCount = 1 + downloadedCount; // 1 markdown + downloaded images
                showNotification(`Archive created: ${zipFilename} with conversation and ${downloadedCount} images`, 'success');
            } catch (error) {
                console.error(`[ChatGPT Exporter] Archive creation failed:`, error);
                showNotification(`Archive creation failed: ${error.message}`, 'error');
            }

            // Show final results with detailed error information
            let resultMessage = `Archive created with conversation file and ${downloadedCount}/${images.length} images`;

            if (urlErrors.length > 0 || downloadErrors.length > 0) {
                resultMessage += '\n\nErrors:';
                if (urlErrors.length > 0) {
                    resultMessage += `\nURL errors (${urlErrors.length}): `;
                    resultMessage += urlErrors.map(e => `${e.fileName} (${e.error})`).join(', ');
                }
                if (downloadErrors.length > 0) {
                    resultMessage += `\nDownload errors (${downloadErrors.length}): `;
                    resultMessage += downloadErrors.map(e => `${e.fileName} (${e.error})`).join(', ');
                }
                resultMessage += '\n\nCheck console for detailed logs.';

                // Show as alert if any images failed
                alert(resultMessage);
            }
        }

    } catch (error) {
        console.error('[ChatGPT Exporter] Export failed:', error);
        showNotification(`Export failed: ${error.message}`, 'error');
    }
}

/**
 * Exports raw conversation data as JSON
 */
async function exportRawData() {
    try {
        showNotification('Fetching raw conversation data...', 'info');

        const conversationData = await getChatGPTConversationData();
        const filename = `Raw_${generateFileName(conversationData)}.json`;
        const jsonContent = JSON.stringify(conversationData, null, 2);

        downloadFile(filename, jsonContent);
        showNotification(`Raw data exported: ${filename}`, 'success');

    } catch (error) {
        console.error('[ChatGPT Exporter] Raw export failed:', error);
        showNotification(`Raw export failed: ${error.message}`, 'error');
    }
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * Initializes userscript and registers menu commands
 */
function init() {
    console.log('[ChatGPT Exporter] Initializing...');

    GM_registerMenuCommand('📄 Export Conversation', exportConversation);
    GM_registerMenuCommand('🔧 Export Raw Data', exportRawData);

    console.log('[ChatGPT Exporter] Ready!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();