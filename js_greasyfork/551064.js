// ==UserScript==
// @name         Claude Message Info
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Add metadata to Claude messages: index, branch, timestamp, UUID, artifact commands
// @author       MRL
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551064/Claude%20Message%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/551064/Claude%20Message%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

const LOG_PREFIX = "[Claude Message Info]:";

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================
// CONFIGURATION & SELECTORS
// =============================================

const CONFIG = {
    retryAttempts: 3,
    retryDelay: 500,
    debounceDelay: 300,
    streamingDebounce: 300,
    initialDelay: 1000,
    apiTimeout: 10000,
    newChatPollingInterval: 500,
    newChatMaxWaitTime: 15000,
    INITIAL_PARENT_UUID: "00000000-0000-4000-8000-000000000000",
    topMargin: 200
};

const Settings = {
    defaults: {
        graph: {
            direction: 'top-down',         // 'left-right' | 'top-down' | 'bottom-up'
            panelMode: 'push',             // 'overlay' | 'push'
            viewMode: 'tree',              // 'tree' | 'tree-fixed' | 'branches'
            nodeGrouping: 'individual',    // 'individual' | 'pairs'
            edgeModes: ['parent-child', 'siblings'],       // 'parent-child' | 'siblings'
            showNodeText: false            // Show content preview under nodes
        }
    },

    current: null,
    load() {
        const saved = GM_getValue('cmi-settings', null);
        this.current = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(this.defaults));
        return this.current;
    },
    save() {
        GM_setValue('cmi-settings', JSON.stringify(this.current));
    },
    get(module, key) {
        if (!this.current) this.load();
        return this.current[module]?.[key] ?? this.defaults[module]?.[key];
    },
    set(module, key, value) {
        if (!this.current) this.load();
        if (!this.current[module]) this.current[module] = {};
        this.current[module][key] = value;
    }
};

const SELECTORS = {
    // =============================================
    // INJECTED ELEMENTS
    // Selectors for elements that this script injects into the DOM
    // =============================================
    injected: {
        // Message metadata badges showing index, branch, timestamp
        timestampMetadata: '.claude-timestamp-metadata',

        // Artifact command badges (create/update/rewrite)
        artifactCommand: '.claude-artifact-command',

        // Tree visualization toggle button
        // treeButton: '.claude-tree-button',

        // Tree panel wrapper container ID (without # prefix)
        // treePanelWrapper: 'claude-tree-panel-wrapper'
    },

    // =============================================
    // CORE CHAT STRUCTURE
    // Main structural elements of the Claude chat interface
    // =============================================
    chat: {
        // Main chat panel container (used for MutationObserver)
        // panelContainer: '.relative.flex.h-full.min-h-0.w-full.flex-col',

        // Main layout and width constraint containers
        // maxWidthContainer: '.mx-auto.flex.size-full.max-w-3xl' // Max-width container that constrains chat content width

        // Parent container that holds all message turns
        messageListContainer: '.flex-1.flex-col.gap-3',

        // Base selector for all chat turns (contains data-test-render-count)
        turnBase: 'div[data-test-render-count]',

        // Main container that can be resized in push mode
        mainContainer: '.flex.flex-1.h-full.w-full.overflow-hidden.relative'
    },

    // =============================================
    // MESSAGE CONTAINERS
    // Selectors for message wrappers and content areas
    // Multiple fallback options for resilience
    // =============================================
    message: {
        // Message container selectors (ordered by priority)
        containers: [
            '.flex-1.flex-col.gap-3 > div[data-test-render-count]',  // Primary: direct children in chat list
            'div[data-test-render-count]',                           // Fallback: any render count wrapper
            '.message-container > div',                              // Future-proof: potential class changes
            '[role="article"]'                                       // Semantic: ARIA article elements
        ],

        // Message card/group containers
        groups: [
            '.group.relative',          // Primary: message card container
            '.message-group',           // Fallback: semantic class name
            '[data-message-group]'      // Future-proof: data attribute
        ],

        // Specific message type identifiers
        userTestId: '[data-testid="user-message"]',
        claudeResponse: '.font-claude-response',

        // Sibling/branch indicator (displays "1 / 3" for branch navigation)
        siblingInfo: 'span.self-center.shrink-0.select-none.font-small.text-text-300'
    },

    // =============================================
    // ARTIFACT ELEMENTS
    // Selectors for artifact blocks and version information
    // =============================================
    artifact: {
        // Artifact block containers
        blocks: [
            '.artifact-block-cell',     // Primary: artifact wrapper
            '[data-artifact-block]',    // Future-proof: data attribute
            '.artifact-container'       // Fallback: semantic class name
        ],

        // Artifact version information line
        versionInfo: [
            '.text-xs.line-clamp-1.text-text-400',  // Primary: version text line
            '.artifact-version',                    // Fallback: semantic class name
            '[data-artifact-version]'               // Future-proof: data attribute
        ]
    },

    // =============================================
    // CONTROL ELEMENTS
    // Navigation buttons, streaming indicators, and interactive controls
    // =============================================
    controls: {
        // Streaming state indicators
        streaming: [
            '[data-is-streaming]',      // Primary: streaming state attribute
            '.streaming-indicator',     // Fallback: semantic class name
            '[aria-busy="true"]'        // Semantic: ARIA busy state
        ],

        // Branch navigation buttons (any navigation button)
        navigationButtons: [
            'button svg path[d*="M13.2402"]',  // Left arrow SVG path
            'button svg path[d*="M6.13378"]',  // Right arrow SVG path
            '[data-navigation-button]'         // Future-proof: data attribute
        ],

        // Specific branch switching paths for click operations
        branchSwitch: {
            right: 'button[type="button"]:not([disabled]) svg path[d*="M6.13378 3.16011"]',
            left: 'button[type="button"] svg path[d*="M13.2402 3.07224"]'
        },

        // Edit mode form (textarea with ID attribute)
        editForm: 'form textarea[id]'
    },

    // =============================================
    // NAVIGATION & SCROLLING
    // Elements used for scroll anchoring and navigation within messages
    // =============================================
    navigation: {
        // Scrollable content anchors (ordered by priority)
        scrollAnchors: [
            '[data-testid="user-message"]',
            '.font-claude-response',
            'p',
            'li',
            'pre'
        ]
    }
};

const ATTRIBUTES = {
    // Attribute names used for MutationObserver
    IS_STREAMING: 'data-is-streaming'
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Universal selector finder - tries multiple selectors until one works
 */
function findElements(selectorArray, context = document) {
    for (const selector of selectorArray) {
        // Skip empty or invalid selectors
        if (!selector || typeof selector !== 'string' || selector.trim() === '') {
            continue;
        }

        try {
            const elements = context.querySelectorAll(selector);
            if (elements.length > 0) {
                return Array.from(elements);
            }
        } catch (e) {
            console.warn(`${LOG_PREFIX} Invalid selector: ${selector}`, e);
        }
    }
    return [];
}

/**
 * Find first matching element from selector array
 */
function findElement(selectorArray, context = document) {
    for (const selector of selectorArray) {
        // Skip empty or invalid selectors
        if (!selector || typeof selector !== 'string' || selector.trim() === '') {
            continue;
        }

        try {
            const element = context.querySelector(selector);
            if (element) return element;
        } catch (e) {
            console.warn(`${LOG_PREFIX} Invalid selector: ${selector}`, e);
        }
    }
    return null;
}

/**
 * Safe element query with error handling
 */
function safeQuery(element, selector) {
    try {
        return element?.querySelector(selector) || null;
    } catch (e) {
        return null;
    }
}

// =============================================
// API FUNCTIONS
// =============================================

/**
 * Extracts conversation ID from current URL
 */
function getConversationId() {
    const match = window.location.pathname.match(/\/chat\/([^/?]+)/);
    return match ? match[1] : null;
}

/**
 * Gets organization ID from browser cookies
 */
function getOrgId() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'lastActiveOrg') {
            return value;
        }
    }
    throw new Error('Could not find organization ID');
}

/**
 * Fetches conversation data from Claude API
 */
async function getConversationData() {
    const conversationId = getConversationId();
    if (!conversationId) {
        return null;
    }

    const orgId = getOrgId();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.apiTimeout);

    try {
        const response = await fetch(
            `/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=true&rendering_mode=messages&render_all_tools=true`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error(`${LOG_PREFIX} API request timeout`);
        }
        throw error;
    }
}

// =============================================
// BRANCH BUILDING FUNCTIONS
// =============================================

/**
 * Builds conversation tree structure from messages
 */
function buildConversationTree(messages) {
    const nodes = {};
    const childrenMap = {};
    const rootNodes = [];

    // Create nodes object
    messages.forEach(message => {
        nodes[message.uuid] = { ...message };
    });

    // Build childrenMap with UUID arrays
    messages.forEach(message => {
        const parentUuid = message.parent_message_uuid || CONFIG.INITIAL_PARENT_UUID;
        if (!childrenMap[parentUuid]) {
            childrenMap[parentUuid] = [];
        }
        childrenMap[parentUuid].push(message.uuid);
    });

    // Sort children by creation time
    for (const parentUuid in childrenMap) {
        childrenMap[parentUuid].sort((a, b) =>
            new Date(nodes[a].created_at) - new Date(nodes[b].created_at)
        );
    }

    // Get root nodes
    const rootUuids = childrenMap[CONFIG.INITIAL_PARENT_UUID] || [];
    rootUuids.forEach(uuid => rootNodes.push(uuid));

    return { nodes, childrenMap, rootNodes };
}

/**
 * Finds main branch path from current_leaf_message_uuid
 */
function findMainBranchPath(tree, currentLeafUuid) {
    if (!currentLeafUuid) {
        return [];
    }

    const mainPath = [];
    let currentMessage = tree.nodes[currentLeafUuid];

    while (currentMessage) {
        mainPath.unshift(currentMessage);

        const parentUuid = currentMessage.parent_message_uuid;
        if (parentUuid === CONFIG.INITIAL_PARENT_UUID || !parentUuid) {
            break;
        }

        currentMessage = tree.nodes[parentUuid];
    }

    return mainPath;
}

/**
 * Finds main branch path from message with maximum index
 */
function buildPathFromMaxIndex(tree) {
    let maxIndexMessage = null;
    let maxIndex = -1;

    // Find message with maximum index
    Object.values(tree.nodes).forEach(message => {
        if (message.index > maxIndex) {
            maxIndex = message.index;
            maxIndexMessage = message;
        }
    });

    if (!maxIndexMessage) return [];

    // Build path backwards through parent_message_uuid
    const mainPath = [];
    let currentMessage = maxIndexMessage;

    while (currentMessage) {
        mainPath.unshift(currentMessage);

        const parentUuid = currentMessage.parent_message_uuid;
        if (parentUuid === CONFIG.INITIAL_PARENT_UUID || !parentUuid) {
            break;
        }

        currentMessage = tree.nodes[parentUuid];
    }

    return mainPath;
}

/**
 * Gets all branch information including branch points
 */
function getAllBranchInfo(tree) {
    const messageToBranch = new Map();
    const nodeToChildren = new Map();
    const parentLookup = new Map();

    // Build base relationships
    const allNodes = [];

    tree.rootNodes.forEach(rootUuid => collect(rootUuid));

    function collect(nodeUuid) {
        const node = tree.nodes[nodeUuid];
        if (!node) return;

        allNodes.push(node);
        const children = tree.childrenMap[nodeUuid] || [];
        nodeToChildren.set(node.uuid, children);

        children.forEach(childUuid => {
            parentLookup.set(childUuid, node);
            collect(childUuid);
        });
    }

    // Find main branch (by max index)
    const mainBranchPath = buildPathFromMaxIndex(tree);
    const mainBranchUuids = new Set(mainBranchPath.map(n => n.uuid));

    // Find branch points
    const branchStartPoints = [];

    for (const node of allNodes) {
        const children = nodeToChildren.get(node.uuid) || [];
        if (children.length > 1) {
            // Sort children by index
            const childNodes = children.map(uuid => tree.nodes[uuid]).filter(n => n);
            const sorted = childNodes.sort((a, b) => a.index - b.index);

            // All children except first are branch starts
            for (let i = 1; i < sorted.length; i++) {
                branchStartPoints.push({ node: sorted[i], index: sorted[i].index });
            }
        }
    }

    // Sort and number branch start points
    const sortedRoots = tree.rootNodes.map(uuid => tree.nodes[uuid]).filter(n => n)
        .sort((a, b) => a.index - b.index);

    for (let i = 1; i < sortedRoots.length; i++) {
        branchStartPoints.push({ node: sortedRoots[i], index: sortedRoots[i].index });
    }

    branchStartPoints.sort((a, b) => a.index - b.index);

    const nodeToBranchNumber = new Map();
    branchStartPoints.forEach((p, i) => nodeToBranchNumber.set(p.node.uuid, i + 2));

    // Recursive branch assignment
    function assignBranch(nodeUuid, currentBranch) {
        const node = tree.nodes[nodeUuid];
        if (!node) return;

        const isMainBranch = mainBranchUuids.has(node.uuid);
        messageToBranch.set(node.uuid, {
            branchIndex: currentBranch,
            isMainBranch
        });

        const children = nodeToChildren.get(node.uuid) || [];
        if (children.length === 0) return;

        const childNodes = children.map(uuid => tree.nodes[uuid]).filter(n => n);
        const sorted = childNodes.sort((a, b) => a.index - b.index);

        // First child continues current branch
        assignBranch(sorted[0].uuid, currentBranch);

        // Other children start new branches
        for (let i = 1; i < sorted.length; i++) {
            const child = sorted[i];
            const newBranch = nodeToBranchNumber.get(child.uuid) || currentBranch;
            assignBranch(child.uuid, newBranch);
        }
    }

    // Assign branches starting from sorted roots
    if (sortedRoots.length > 0) {
        assignBranch(sortedRoots[0].uuid, 1);

        for (let i = 1; i < sortedRoots.length; i++) {
            const root = sortedRoots[i];
            const branchNumber = nodeToBranchNumber.get(root.uuid);
            if (branchNumber != null) {
                assignBranch(root.uuid, branchNumber);
            }
        }
    }

    // --- API for branch retrieval
    // function getBranchPath(nodeUuid) {
        // Restores the path from the root to this node
        // const path = [];
        // let current = allNodes.find(n => n.uuid === nodeUuid);
        // while (current) {
            // path.unshift(current);
            // current = parentLookup.get(current.uuid);
        // }
        // return path;
    // }

    // function getFullBranch(branchIndex) {
        // Collects all messages belonging to a single branch
        // const branchNodes = allNodes.filter(
            // n => messageToBranch.get(n.uuid)?.branchIndex === branchIndex
        // );
        // Sort by index to ensure order
        // return branchNodes.sort((a, b) => a.index - b.index);
    // }

    return {
        messageToBranch,     // Quickly find the branch number by uuid
        mainBranchUuids,     // For determining the main branch
        // getBranchPath,    // Path from the root to a specific node
        // getFullBranch,    // The entire branch by its number
        allNodes,            // All tree nodes
        parentLookup,        // Parent relationships
        nodeToChildren       // Children relationships
    };
}

// =============================================
// CLAUDE API - From ClaudePowerestManager&Enhancer
// =============================================
const ClaudeAPI = {
    conversationTree: null,
    currentLinearBranch: null,
    currentConversationUuid: null,
    isInitialized: false,

    /**
     * Smart initialization of the conversation tree - avoids redundant requests
     */
    async tryInitializeConversationTree() {
        try {
            const currentUrl = window.location.href;
            const pathParts = new URL(currentUrl).pathname.split('/');
            const conversationUuid = (pathParts[1] === 'chat' && pathParts[2]) ? pathParts[2] : null;

            if (!conversationUuid || conversationUuid === 'new') {
                return false;
            }

            // Check if already initialized for the current conversation
            if (this.isInitialized && this.currentConversationUuid === conversationUuid) {
                return true;
            }

            const conversationData = await getConversationData();
            if (!conversationData) return false;

            this.conversationTree = buildConversationTree(conversationData.chat_messages);
            this.currentConversationUuid = conversationUuid;
            this.isInitialized = true;

            await this.updateCurrentLinearBranch();
            return true;
        } catch (error) {
            console.warn(`${LOG_PREFIX} Failed to initialize conversation tree:`, error);
            this.isInitialized = false;
        }
        return false;
    },

    // Detect conversation switch, reset initialization state
    checkConversationChange() {
        const currentUrl = window.location.href;
        const pathParts = new URL(currentUrl).pathname.split('/');
        const conversationUuid = (pathParts[1] === 'chat' && pathParts[2]) ? pathParts[2] : null;

        if (conversationUuid !== this.currentConversationUuid) {
            console.log(`${LOG_PREFIX} Detected conversation switch: ${this.currentConversationUuid?.slice(-8) || 'none'} → ${conversationUuid?.slice(-8) || 'none'}`);
            this.isInitialized = false;
            this.conversationTree = null;
            this.currentLinearBranch = null;
            this.currentConversationUuid = conversationUuid;
        }
    },

    // Analyze the linear branch currently displayed on the frontend
    async updateCurrentLinearBranch() {
        if (!this.conversationTree) {
            // Try to auto-initialize the conversation tree
            await this.tryInitializeConversationTree();
            if (!this.conversationTree) {
                this.currentLinearBranch = [];
                return;
            }
        }

        const turns = this.findCurrentTurns();

        // Build the linear branch: the frontend DOM display must represent a complete parent-child sequential chain
        const branch = this.buildLinearBranchFromDOM(turns);
        this.currentLinearBranch = branch;

        return turns; // Return turns to avoid duplicate calls
    },

    // Find conversation turns based on the actual DOM structure - using a precise selector
    findCurrentTurns() {
        const elements = document.querySelectorAll(SELECTORS.chat.turnBase);
        const validElements = Array.from(elements).filter(el => {
            // Check if it contains a user message or a Claude response content
            const hasUserMessage = !!el.querySelector(SELECTORS.message.userTestId);
            const hasClaudeResponse = !!el.querySelector(SELECTORS.message.claudeResponse);

            // Must be either a user message or a Claude response
            return hasUserMessage || hasClaudeResponse;
        });

        return validElements;
    },

    // Build the branch based on the sequential parent-child relationship in the DOM
    buildLinearBranchFromDOM(turns) {
        const branch = [];
        let expectedParentUuid = CONFIG.INITIAL_PARENT_UUID; // Root node UUID (virtual, not displayed on frontend)

        // Pre-extract all sibling info to avoid redundant calls
        const turnsWithSiblingInfo = turns.map(turn => ({
            turn,
            siblingInfo: this.extractSiblingInfo(turn)
        }));

        // Since the root node is not displayed on the frontend, the first DOM turn corresponds to the direct child of the root node
        for (let i = 0; i < turnsWithSiblingInfo.length; i++) {
            const { turn, siblingInfo } = turnsWithSiblingInfo[i];
            const nodeUuid = this.findNodeByPositionWithCachedInfo(turn, expectedParentUuid, siblingInfo);

            if (nodeUuid) {
                const node = { ...this.conversationTree.nodes[nodeUuid], uuid: nodeUuid };
                branch.push(node);
                expectedParentUuid = nodeUuid;
            } else {
                console.warn(`${LOG_PREFIX} DOM turn ${i + 1} cannot match node (expected parent: ${expectedParentUuid.slice(-8)})`);
                break; // Stop building, as the parent-child chain is broken
            }
        }

        return branch;
    },

    // Find the exact node in the conversation tree based on position info and cached sibling info
    findNodeByPositionWithCachedInfo(turnElement, expectedParentUuid, siblingInfo) {
        const isUser = !!turnElement.querySelector(SELECTORS.message.userTestId);
        const expectedSender = isUser ? 'human' : 'assistant';
        const { nodes, childrenMap } = this.conversationTree;

        // Get all children of the expected parent, filtering out dirty data and hidden nodes
        const siblings = childrenMap[expectedParentUuid] || [];
        const sameTypeSiblings = siblings.filter(uuid => {
            const node = nodes[uuid];
            if (!node || node.sender !== expectedSender) return false;

            // Filter out hidden human nodes (human without assistant child)
            if (node.sender === 'human') {
                const humanChildren = childrenMap[uuid] || [];
                const hasAssistantChild = humanChildren.some(childUuid => {
                    const child = nodes[childUuid];
                    return child && child.sender === 'assistant';
                });
                return hasAssistantChild; // Only include human nodes that have assistant children
            }

            return true;
        });

        if (siblingInfo) {
            // Use precise position matching when sibling info is available
            if (sameTypeSiblings.length === siblingInfo.totalSiblings) {
                const targetIndex = siblingInfo.currentIndex;
                if (targetIndex >= 0 && targetIndex < sameTypeSiblings.length) {
                    return sameTypeSiblings[targetIndex];
                }
            }
        } else {
            // Logic when sibling info is not available
            if (sameTypeSiblings.length === 1) {
                return sameTypeSiblings[0];
            } else if (sameTypeSiblings.length > 1) {
                // Select the earliest node by time (usually the main branch)
                const sortedSiblings = sameTypeSiblings.sort((a, b) =>
                    new Date(nodes[a].created_at) - new Date(nodes[b].created_at)
                );
                return sortedSiblings[0];
            }
        }

        return null;
    },

    // Find the key positioning element: <span class="self-center shrink-0 select-none font-small text-text-300">a / b</span> where b is the total number of siblings (including itself), and a is its 1-based index among siblings.
    extractSiblingInfo(turnElement) {

        // Precise class matching
        const siblingSpan = turnElement.querySelector(SELECTORS.message.siblingInfo);

        if (siblingSpan) {
            const text = siblingSpan.textContent?.trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);
            if (match) {
                const currentPosition = parseInt(match[1]); // 1-based index position
                const totalSiblings = parseInt(match[2]);   // Total number including itself

                return {
                    currentIndex: currentPosition - 1, // Convert to 0-based index for array operations
                    totalSiblings: totalSiblings
                };
            }
        }

        return null;
    },

    // Check if the target node is in the current linear branch
    isNodeInCurrentBranch(nodeUuid) {
        if (!this.currentLinearBranch) return false;
        return this.currentLinearBranch.some(node => node && node.uuid === nodeUuid);
    }
};

// =============================================
// BRANCH SWITCHER - From ClaudePowerestManager&Enhancer
// =============================================
const BranchSwitcher = {
    // Utility function
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Check if node is hidden by Claude (human message without assistant response)
    isNodeHidden(nodeUuid) {
        const { nodes, childrenMap } = ClaudeAPI.conversationTree;
        const node = nodes[nodeUuid];
        if (!node || node.sender !== 'human') return false;

        // Check if this human node has any assistant children
        const children = childrenMap[nodeUuid] || [];
        const hasAssistantChild = children.some(childUuid => {
            const child = nodes[childUuid];
            return child && child.sender === 'assistant';
        });

        return !hasAssistantChild;
    },

    // Find nearest visible ancestor (skipping hidden nodes)
    findVisibleAncestor(nodeUuid) {
        const { nodes } = ClaudeAPI.conversationTree;
        let currentUuid = nodeUuid;

        while (currentUuid && currentUuid !== CONFIG.INITIAL_PARENT_UUID) {
            const node = nodes[currentUuid];
            if (!node) return null;

            // Check if node is in DOM or if it's hidden
            if (ClaudeAPI.isNodeInCurrentBranch(currentUuid)) {
                return currentUuid;
            }

            // Skip if hidden
            if (!this.isNodeHidden(currentUuid)) {
                // Node should be visible but isn't - might be in different branch
                break;
            }

            // Move to parent
            currentUuid = node.parent_message_uuid;
        }

        return currentUuid || CONFIG.INITIAL_PARENT_UUID;
    },

    // Switch to the target stage node
    async switchToTargetStageNode(targetNodeUuid) {
        console.log(`${LOG_PREFIX} Attempting to switch to stage target node: ${targetNodeUuid.slice(-8)}`);

        // 1. Check if the stage target node is already on the frontend
        if (ClaudeAPI.isNodeInCurrentBranch(targetNodeUuid)) {
            console.log(`${LOG_PREFIX} Target node already in current frontend display`);
            return true;
        }

        // 2. Get target node and find visible ancestor (skipping hidden nodes)
        const { nodes, childrenMap } = ClaudeAPI.conversationTree;
        const targetNode = nodes[targetNodeUuid];
        if (!targetNode) {
            console.error(`${LOG_PREFIX} Cannot find target node: ${targetNodeUuid.slice(-8)}`);
            return false;
        }

        const directParentUuid = targetNode.parent_message_uuid || CONFIG.INITIAL_PARENT_UUID;

        // Find visible ancestor (skipping human nodes without assistant)
        const parentUuid = this.findVisibleAncestor(directParentUuid);
        if (!parentUuid) {
            console.error(`${LOG_PREFIX} Cannot find visible ancestor`);
            return false;
        }

        console.log(`${LOG_PREFIX} Using parent: ${parentUuid === CONFIG.INITIAL_PARENT_UUID ? 'ROOT' : parentUuid.slice(-8)}`);

        // Check parent is in frontend
        let isParentInFrontend = false;
        if (parentUuid === CONFIG.INITIAL_PARENT_UUID) {
            isParentInFrontend = ClaudeAPI.currentLinearBranch && ClaudeAPI.currentLinearBranch.length > 0;
        } else {
            isParentInFrontend = ClaudeAPI.isNodeInCurrentBranch(parentUuid);
        }

        if (!isParentInFrontend) {
            console.error(`${LOG_PREFIX} Parent not in frontend: ${parentUuid.slice(-8)}`);
            return false;
        }

        // 3. Calculate the required operation
        // If direct parent is hidden, find all visible descendants of visible ancestor
        let siblings, sameTypeSiblings;

        if (directParentUuid !== parentUuid) {
            // Direct parent is hidden - find all visible descendants of visible ancestor
            console.log(`${LOG_PREFIX} Direct parent ${directParentUuid.slice(-8)} is hidden, finding visible descendants`);

            // Get all descendants recursively
            const getAllDescendants = (nodeUuid, depth = 0) => {
                if (depth > 10) return []; // Prevent infinite recursion
                const children = childrenMap[nodeUuid] || [];
                let descendants = [];

                for (const childUuid of children) {
                    const child = nodes[childUuid];
                    if (!child) continue;

                    // Check if this node is hidden
                    const isHidden = this.isNodeHidden(childUuid);

                    if (!isHidden && child.sender === targetNode.sender) {
                        descendants.push(childUuid);
                    }

                    // Recurse into children
                    if (isHidden) {
                        const childDescendants = getAllDescendants(childUuid, depth + 1);
                        descendants = descendants.concat(childDescendants);
                    }
                }

                return descendants;
            };

            sameTypeSiblings = getAllDescendants(parentUuid);
        } else {
            // Direct parent is visible - use normal logic
            siblings = childrenMap[parentUuid] || [];
            sameTypeSiblings = siblings.filter(uuid => {
                const node = nodes[uuid];
                if (!node || node.sender !== targetNode.sender) return false;
                return !this.isNodeHidden(uuid);
            });
        }

        // 3.1 Calculate the position index of the stage target node among its parent's children
        const targetIndex = sameTypeSiblings.indexOf(targetNodeUuid);
        if (targetIndex === -1) {
            console.error(`${LOG_PREFIX} Cannot find target node in siblings`);
            return false;
        }

        // 3.2 Calculate the position of the currently displayed sibling node
        let currentIndex = -1;
        if (parentUuid === CONFIG.INITIAL_PARENT_UUID) {
            // Root node scenario: Find the first node of the same type
            if (ClaudeAPI.currentLinearBranch && ClaudeAPI.currentLinearBranch.length > 0) {
                const firstNodeOfSameType = ClaudeAPI.currentLinearBranch.find(node =>
                    node && node.sender === targetNode.sender
                );
                if (firstNodeOfSameType) {
                    currentIndex = sameTypeSiblings.indexOf(firstNodeOfSameType.uuid);
                }
            }
        } else {
            // Non-root node scenario: Find the first node of the same type after the parent node
            const parentIndexInBranch = ClaudeAPI.currentLinearBranch.findIndex(node =>
                node && node.uuid === parentUuid
            );
            if (parentIndexInBranch !== -1) {
                for (let i = parentIndexInBranch + 1; i < ClaudeAPI.currentLinearBranch.length; i++) {
                    const node = ClaudeAPI.currentLinearBranch[i];
                    if (node && node.sender === targetNode.sender) {
                        currentIndex = sameTypeSiblings.indexOf(node.uuid);
                        break;
                    }
                }
            }
        }

        if (currentIndex === -1) {
            console.error(`${LOG_PREFIX} Cannot determine current sibling position`);
            return false;
        }

        // 3.3 Calculate the position difference
        const diff = targetIndex - currentIndex;
        console.log(`${LOG_PREFIX} Need to switch ${diff} steps (target: ${targetIndex}, current: ${currentIndex})`);

        if (diff === 0) {
            console.log(`${LOG_PREFIX} Already at target position`);
            return true;
        }

        // 4. Execute the switch operation
        const direction = diff > 0 ? 'right' : 'left';
        const steps = Math.abs(diff);

        // Find the index of the frontend node to operate on
        let frontendNodeIndex = -1;
        if (parentUuid === CONFIG.INITIAL_PARENT_UUID) {
            for (let i = 0; i < ClaudeAPI.currentLinearBranch.length; i++) {
                const node = ClaudeAPI.currentLinearBranch[i];
                if (node && node.sender === targetNode.sender) {
                    frontendNodeIndex = i + 1; // Convert to 1-based index
                    break;
                }
            }
        } else {
            // Non-root node scenario: Find the first node of the same type after the parent node
            const parentIndexInBranch = ClaudeAPI.currentLinearBranch.findIndex(node =>
                node && node.uuid === parentUuid
            );
            if (parentIndexInBranch !== -1) {
                for (let i = parentIndexInBranch + 1; i < ClaudeAPI.currentLinearBranch.length; i++) {
                    const node = ClaudeAPI.currentLinearBranch[i];
                    if (node && node.sender === targetNode.sender) {
                        frontendNodeIndex = i + 1; // Convert to 1-based index
                        break;
                    }
                }
            }
        }

        if (frontendNodeIndex === -1) {
            console.error(`${LOG_PREFIX} Cannot determine frontend node index`);
            return false;
        }

        // Execute switch steps
        for (let step = 0; step < steps; step++) {
            console.log(`${LOG_PREFIX} Executing step ${step + 1}/${steps} ${direction} switch`);

            const success = await this.clickNodeSwitch(direction, frontendNodeIndex);
            if (!success) {
                console.error(`${LOG_PREFIX} Step ${step + 1} switch failed`);
                return false;
            }

            // Wait for the switch to complete
            await this.wait(300);

            // Update current branch status
            await ClaudeAPI.updateCurrentLinearBranch();
        }

        // 5. Verify successful switch
        await this.wait(200);
        await ClaudeAPI.updateCurrentLinearBranch();

        const success = ClaudeAPI.isNodeInCurrentBranch(targetNodeUuid);
        console.log(`${LOG_PREFIX} Switch ${success ? 'successful' : 'failed'}: ${targetNodeUuid.slice(-8)}`);

        return success;
    },

    // Recursively switch to the target node
    async switchToTargetNode(targetNodeUuid) {
        console.log(`${LOG_PREFIX} Starting switch to target node: ${targetNodeUuid.slice(-8)}`);

        // Ensure conversation tree is initialized
        if (!ClaudeAPI.conversationTree) {
            await ClaudeAPI.tryInitializeConversationTree();
            if (!ClaudeAPI.conversationTree) {
                console.error(`${LOG_PREFIX} Conversation tree not initialized`);
                return false;
            }
        }

        // Update current branch status
        await ClaudeAPI.updateCurrentLinearBranch();

        // Try to switch directly to the target node
        if (await this.switchToTargetStageNode(targetNodeUuid)) {
            return true;
        }

        // If direct switch fails, recursively switch to the parent node
        const { nodes } = ClaudeAPI.conversationTree;
        const targetNode = nodes[targetNodeUuid];
        if (!targetNode) {
            console.error(`${LOG_PREFIX} Cannot find target node: ${targetNodeUuid.slice(-8)}`);
            return false;
        }

        const parentUuid = targetNode.parent_message_uuid;
        if (!parentUuid || parentUuid === CONFIG.INITIAL_PARENT_UUID) {
            console.error(`${LOG_PREFIX} Reached root node, cannot continue recursion`);
            return false;
        }

        console.log(`${LOG_PREFIX} Recursively switching to parent node: ${parentUuid.slice(-8)}`);

        // Recursive call to switch to the parent node
        if (await this.switchToTargetNode(parentUuid)) {
            // After successful parent node switch, try switching to the target node again
            console.log(`${LOG_PREFIX} Parent node switch successful, retrying target node`);
            return await this.switchToTargetStageNode(targetNodeUuid);
        } else {
            console.error(`${LOG_PREFIX} Recursive switch failed, cannot switch to parent: ${parentUuid.slice(-8)}`);
            return false;
        }
    },

    // Generic switch function (simplified, for interacting with existing buttons)
    async clickNodeSwitch(direction, frontendIndex = 1) {
        const turns = ClaudeAPI.findCurrentTurns();
        if (frontendIndex < 1 || frontendIndex > turns.length) {
            console.error(`${LOG_PREFIX} Frontend node index out of range. Valid range: 1-${turns.length}`);
            return false;
        }

        // Find the switch button in the specified frontend node
        const targetTurn = turns[frontendIndex - 1];
        let buttonSelector;

        if (direction === 'right') {
            buttonSelector = SELECTORS.controls.branchSwitch.right;
        } else if (direction === 'left') {
            buttonSelector = SELECTORS.controls.branchSwitch.left;
        } else {
            console.error(`${LOG_PREFIX} Invalid direction parameter. Use 'left' or 'right'`);
            return false;
        }

        const buttonPath = targetTurn.querySelector(buttonSelector);

        if (buttonPath) {
            const button = buttonPath.closest('button');
            if (button && !button.disabled) {
                console.log(`${LOG_PREFIX} Clicking frontend node #${frontendIndex} ${direction === 'right' ? 'right' : 'left'} switch button`);
                button.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
        }

        console.error(`${LOG_PREFIX} Frontend node #${frontendIndex} has no available ${direction === 'right' ? 'right' : 'left'} switch button`);
        return false;
    }
};

// =============================================
// LINEAR NAVIGATOR - From ClaudePowerestManager&Enhancer
// =============================================
const LinearNavigator = {
    // Scroll to element
    scrollToElement(element, topMargin = CONFIG.topMargin) {
        if (!element) return;

        const anchor = this.findAnchor(element);
        const scroller = this.getScrollContainer(anchor);
        if (!scroller) return;

        const isWindow = scroller === document.documentElement ||
                        scroller === document.body ||
                        scroller === document.scrollingElement;

        const scrollerRect = isWindow ?
            { top: 0, height: window.innerHeight } :
            scroller.getBoundingClientRect();

        const anchorRect = anchor.getBoundingClientRect();
        const currentScrollTop = isWindow ? window.scrollY : scroller.scrollTop;
        const targetScrollTop = currentScrollTop + (anchorRect.top - scrollerRect.top) - topMargin;
        const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
        const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

        scroller.scrollTo({ top: finalScrollTop, behavior: 'smooth' });

        // Highlight effect
        this.addHighlight(element);
        if (anchor !== element) this.addHighlight(anchor);
    },

    findAnchor(turnElement) {
        const selectors = SELECTORS.navigation.scrollAnchors;

        for (const selector of selectors) {
            const element = turnElement.querySelector(selector);
            if (element && element.offsetParent) return element;
        }
        return turnElement;
    },

    getScrollContainer(element) {
        let el = element;
        while (el && el !== document.documentElement) {
            const style = getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                el.scrollHeight > el.clientHeight) {
                return el;
            }
            el = el.parentElement;
        }
        return document.scrollingElement || document.documentElement;
    },

    addHighlight(element) {
        element.classList.add('highlight-pulse');
        setTimeout(() => element.classList.remove('highlight-pulse'), 3100);
    },

    // Linear jump to a specific node (supports cross-branch navigation)
    async jumpToNode(nodeUuid) {
        // First, update the current linear branch status
        await ClaudeAPI.updateCurrentLinearBranch();

        // 2.1 Current frontend linear branch contains the node, jump directly
        if (ClaudeAPI.isNodeInCurrentBranch(nodeUuid)) {
            this.jumpToNodeInCurrentBranch(nodeUuid);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } else {
            // 2.2 Current frontend linear branch does not contain the node, perform cross-branch jump
            console.log(`${LOG_PREFIX} Target node not in current branch, starting cross-branch jump: ${nodeUuid.slice(-8)}`);

            // Call the branch switcher for cross-branch jump
            const switchSuccess = await BranchSwitcher.switchToTargetNode(nodeUuid);

            if (switchSuccess) {
                // After successful branch switch, execute page jump to the target node
                console.log(`${LOG_PREFIX} Branch switch successful, executing page jump`);
                await new Promise(resolve => setTimeout(resolve, 300));

                // Update branch status and jump
                await ClaudeAPI.updateCurrentLinearBranch();
                this.jumpToNodeInCurrentBranch(nodeUuid);
                await new Promise(resolve => setTimeout(resolve, 500));
                return true;
            } else {
                console.error(`${LOG_PREFIX} Cross-branch jump failed: ${nodeUuid.slice(-8)}`);
                return false;
            }
        }
    },

    // Jump within the current branch
    jumpToNodeInCurrentBranch(nodeUuid, cachedTurns = null) {
        const element = document.getElementById(nodeUuid) ||
                       this.findElementByNodeUuid(nodeUuid, cachedTurns);
        if (element) {
            this.scrollToElement(element);
        }
    },

    findElementByNodeUuid(nodeUuid, cachedTurns = null) {
        // Find directly by ID
        const directElement = document.getElementById(nodeUuid);
        if (directElement) return directElement;

        // Find the corresponding DOM element in the current linear branch based on position
        if (!ClaudeAPI.currentLinearBranch) return null;

        // Find the index of the target node in the current branch
        const nodeIndex = ClaudeAPI.currentLinearBranch.findIndex(node => node.uuid === nodeUuid);
        if (nodeIndex === -1) return null;

        // Use cached turns or get all currently displayed turns
        const turns = cachedTurns || ClaudeAPI.findCurrentTurns();

        if (nodeIndex < turns.length) {
            return turns[nodeIndex];
        }

        return null;
    }
};

// =============================================
// DOM MANIPULATION
// =============================================

/**
 * Formats timestamp for display
 */
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Injects metadata into a DOM element
 */
function injectMetadata(container, messageData, messageToBranch, domPosition, totalDomMessages) {
    // Check if already added
    if (container.querySelector(SELECTORS.injected.timestampMetadata)) {
        return;
    }

    // Get branch info for this specific message
    const branchInfo = messageToBranch.get(messageData.uuid);
    const branchNumber = branchInfo ? branchInfo.branchIndex : '?';

    // Hardcode
    // Determine if main or side branch BY SPECIFIC MESSAGE UUID
    // Not by branch info, because a branch can contain both main and side messages
    const isMainBranch = branchInfo ? branchInfo.isMainBranch : false;
    const branchStatus = isMainBranch ? 'Main' : 'Side';

    // Check if message was canceled
    const isCanceled = messageData.stop_reason === 'user_canceled';
    const canceledText = isCanceled ? ' | CANCELED' : '';

    // Create metadata element
    const metadata = document.createElement('div');
    metadata.className = SELECTORS.injected.timestampMetadata.substring(1);
    metadata.style.cssText = `
        position: absolute;
        top: -15px;
        right: 8px;
        font-size: 10px;
        color: var(--text-400, #94a3b8);
        opacity: 0.7;
        padding: 2px 6px;
        background: var(--bg-200, rgba(0, 0, 0, 0.05));
        border-radius: 4px;
        /* backdrop-filter: blur(4px); */
        z-index: 2;
        pointer-events: auto;
        white-space: nowrap;
    `;

    const timestamp = formatTimestamp(messageData.created_at);
    metadata.textContent = `#${messageData.index} [${domPosition}/${totalDomMessages}] | Branch ${branchNumber} | ${branchStatus}${canceledText} | ${timestamp}`;

    const tooltipLines = [
        `API Index: ${messageData.index}`,
        `DOM Position: ${domPosition} of ${totalDomMessages}`,
        `Branch: ${branchNumber}`,
        `Status: ${branchStatus}`,
        `Created: ${new Date(messageData.created_at).toLocaleString()}`,
        `UUID: ${messageData.uuid}`,
        `Parent UUID: ${messageData.parent_message_uuid || 'ROOT'}`
    ];

    if (isCanceled) {
        tooltipLines.push('Stop Reason: User Canceled');
    }

    metadata.title = tooltipLines.join('\n');

    // Find where to insert
    const groupDiv = findElement(SELECTORS.message.groups, container);
    if (groupDiv) {
        groupDiv.style.position = 'relative';
        groupDiv.prepend(metadata);

        // Check boundaries after prepending to DOM
        requestAnimationFrame(() => {
            const maxWContainer = document.querySelector(SELECTORS.chat.messageListContainer);
            if (maxWContainer) {
                const containerRect = maxWContainer.getBoundingClientRect();
                const groupRect = groupDiv.getBoundingClientRect();
                const metadataRect = metadata.getBoundingClientRect();

                // If left edge of metadata overflows left edge of max-w-3xl container
                if (metadataRect.left < containerRect.left) {
                    // Target position: 3px from left edge of container
                    const targetLeftAbsolute = containerRect.left + 3;
                    // Calculate offset relative to groupDiv
                    const leftOffset = targetLeftAbsolute - groupRect.left;

                    // Switch from right to left positioning
                    metadata.style.right = 'auto';
                    metadata.style.left = leftOffset + 'px';
                }
            }
        });
    }
}

/**
 * Injects artifact command badge into artifact block
 */
function injectArtifactMetadata(artifactBlock, command, canceled) {
    // Check if already added
    if (artifactBlock.querySelector(SELECTORS.injected.artifactCommand)) {
        return;
    }

    // Find the version info line
    const versionLine = findElement(SELECTORS.artifact.versionInfo, artifactBlock);
    if (!versionLine) return;

    // Create command badge
    const commandBadge = document.createElement('span');
    commandBadge.className = SELECTORS.injected.artifactCommand.substring(1);

    const commandColors = {
        'create': '#22c55e',
        'rewrite': '#eab308',
        'update': '#3b82f6'
    };

    const bgColor = commandColors[command] || '#6b7280';

    commandBadge.style.cssText = `
        display: inline-block;
        padding: 1px 4px;
        margin-left: 4px;
        font-size: 9px;
        font-weight: 600;
        color: white;
        background-color: ${bgColor};
        border-radius: 3px;
        text-transform: uppercase;
        vertical-align: middle;
    `;

    commandBadge.textContent = command + ' ARTIFACT';

    if (canceled) {
        commandBadge.style.opacity = '0.5';
        commandBadge.title = 'Generation was canceled';
    } else {
        commandBadge.title = `Command: ${command}`;
    }

    // IMPORTANT: Just append the badge without clearing versionLine content
    try {
        versionLine.appendChild(commandBadge);
    } catch (e) {
        // Silently ignore if insertion fails
    }
}

/**
 * Removes all existing metadata badges
 */
function clearMetadata() {
    document.querySelectorAll(SELECTORS.injected.timestampMetadata).forEach(el => el.remove());
    document.querySelectorAll(SELECTORS.injected.artifactCommand).forEach(el => el.remove());
}

// =============================================
// TREE VISUALIZATION
// =============================================

let graphPanel = null;
let graphCanvas = null;
let toggleButton = null;
let currentTreeData = null;
let canvasOffset = { x: 0, y: 0 };
let canvasScale = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let activeBranchUuids = new Set();
let isResizing = false;

/**
 * Creates the graph visualization panel
 */
function createGraphPanel() {
    if (graphPanel) return;

    // Create panel container
    graphPanel = document.createElement('div');
    graphPanel.id = 'claude-graph-panel';
    graphPanel.style.cssText = `
        position: fixed;
        top: 0;
        right: -450px;
        width: 450px;
        height: 100vh;
        background: #1e293b;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 16px;
        background: #0f172a;
        color: #e2e8f0;
        font-weight: 600;
        font-size: 14px;
        border-bottom: 1px solid #334155;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = `
        <div>
            <div>Conversation Tree</div>
            <div style="font-size: 10px; font-weight: normal; color: #94a3b8; margin-top: 4px;">
                Drag to pan • Scroll to zoom • Click nodes for info
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <button id="claude-graph-settings" style="
                background: #334155;
                border: none;
                color: #e2e8f0;
                cursor: pointer;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                margin-right: 8px;
            " title="Settings">⚙️</button>
            <button id="claude-graph-reset" style="
                background: #334155;
                border: none;
                color: #e2e8f0;
                cursor: pointer;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
            " title="Reset zoom and position">Reset</button>
            <button id="claude-graph-close" style="
                background: transparent;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(51, 65, 85, 0.6);
                color: #cbd5e1;
            ">×</button>
        </div>
    `;

    // Resizer handle (Claude-style)
    const resizer = document.createElement('div');
    resizer.id = 'claude-graph-resizer';
    resizer.className = 'claude-graph-resizer-group';
    resizer.innerHTML = `
        <div class="claude-graph-resizer-line"></div>
        <div class="claude-graph-resizer-handle"></div>
    `;
    resizer.addEventListener('mousedown', startResizing);
    graphPanel.appendChild(resizer);

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        flex: 1;
        overflow: auto;
        position: relative;
        background: #0f172a;
    `;

    // Canvas
    graphCanvas = document.createElement('canvas');
    graphCanvas.style.cssText = `
        display: block;
        cursor: grab;
    `;

    canvasContainer.appendChild(graphCanvas);
    graphPanel.appendChild(header);
    graphPanel.appendChild(canvasContainer);
    document.body.appendChild(graphPanel);

    // Close button handler
    document.getElementById('claude-graph-close').addEventListener('click', () => {
        closeGraphPanel();
    });

    // Reset button handler
    document.getElementById('claude-graph-reset').addEventListener('click', () => {
        canvasOffset = { x: 0, y: 0 };
        canvasScale = 1;
        if (currentTreeData) {
            renderGraph(currentTreeData);
        }
    });

    // Settings button handler
    document.getElementById('claude-graph-settings').addEventListener('click', () => {
        showGraphSettings();
    });

    // Canvas click handler for node selection
    graphCanvas.addEventListener('click', (e) => {
        if (!currentTreeData || isDragging) return;

        const rect = graphCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
        const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

        // Find clicked node
        const nodePos = findNodeAtPosition(x, y, currentTreeData.nodePositions);
        if (nodePos) {
            showNodeDetails(nodePos.node, currentTreeData.messageToBranch);
        }
    });

    // Tooltip on hover
    graphCanvas.addEventListener('mousemove', (e) => {
        if (!currentTreeData) return;

        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            canvasOffset.x += dx;
            canvasOffset.y += dy;
            dragStart = { x: e.clientX, y: e.clientY };
            renderGraph(currentTreeData);
            return;
        }

        const rect = graphCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
        const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

        const nodePos = findNodeAtPosition(x, y, currentTreeData.nodePositions);
        if (nodePos) {
            graphCanvas.style.cursor = 'pointer';
            graphCanvas.title = `#${nodePos.node.index} | Branch ${nodePos.branchIndex} | ${nodePos.node.sender} | ${formatTimestamp(nodePos.node.created_at)}`;
        } else {
            graphCanvas.style.cursor = isDragging ? 'grabbing' : 'grab';
            graphCanvas.title = '';
        }
    });

    // Mouse down - start dragging
    graphCanvas.addEventListener('mousedown', (e) => {
        const rect = graphCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
        const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

        const nodePos = findNodeAtPosition(x, y, currentTreeData?.nodePositions);
        if (!nodePos) {
            isDragging = true;
            dragStart = { x: e.clientX, y: e.clientY };
            graphCanvas.style.cursor = 'grabbing';
        }
    });

    // Mouse up - stop dragging
    graphCanvas.addEventListener('mouseup', () => {
        isDragging = false;
        graphCanvas.style.cursor = 'grab';
    });

    // Mouse leave - stop dragging
    graphCanvas.addEventListener('mouseleave', () => {
        isDragging = false;
        graphCanvas.style.cursor = 'grab';
    });

    // Zoom with mouse wheel
    graphCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();

        const rect = graphCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.3, Math.min(3, canvasScale * zoomDelta));

        // Zoom to cursor position
        const scaleDiff = newScale - canvasScale;
        canvasOffset.x -= (mouseX - canvasOffset.x) * (scaleDiff / canvasScale);
        canvasOffset.y -= (mouseY - canvasOffset.y) * (scaleDiff / canvasScale);

        canvasScale = newScale;
        renderGraph(currentTreeData);
    });
}

/**
 * Handle window resize
 */
function handleResize() {
    if (graphPanel && graphPanel.style.right === '0px' && currentTreeData) {
        renderGraph(currentTreeData);
    }
}

// Add resize listener
window.addEventListener('resize', debounce(handleResize, 250));

/**
 * Start resizing the panel
 */
function startResizing(e) {
    isResizing = true;
    document.documentElement.style.userSelect = 'none';
    document.addEventListener('mousemove', resizePanel);
    document.addEventListener('mouseup', stopResizing);

    // Add visual feedback
    const resizer = document.querySelector('.claude-graph-resizer-group');
    if (resizer) resizer.classList.add('resizing');

    e.preventDefault();
}
/**
 * Handle resize while panel is open
 */
function resizePanel(e) {
    if (!isResizing || !graphPanel) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 300 && newWidth <= window.innerWidth - 100) {
        graphPanel.style.width = `${newWidth}px`;

        // Update push mode on resize
        const mode = Settings.get('graph', 'panelMode') || 'overlay';
        if (mode === 'push' && graphPanel.style.right === '0px') {
            applyPanelMode(mode);
        }

        // Force re-render with new size
        if (currentTreeData) {
            // Use setTimeout to allow DOM to update
            setTimeout(() => {
                renderGraph(currentTreeData);
            }, 10);
        }
    }
}
/**
 * Stop resizing the panel
 */
function stopResizing() {
    isResizing = false;
    document.documentElement.style.userSelect = '';
    document.removeEventListener('mousemove', resizePanel);
    document.removeEventListener('mouseup', stopResizing);

    // Remove visual feedback
    const resizer = document.querySelector('.claude-graph-resizer-group');
    if (resizer) resizer.classList.remove('resizing');
}

/**
 * Creates the toggle button
 */
function createToggleButton() {
    if (toggleButton) return;

    toggleButton = document.createElement('button');
    toggleButton.id = 'claude-graph-toggle';
    toggleButton.className = 'graph-toggle-indicator';
    toggleButton.innerHTML = `
        <div class="indicator-wrapper">
            <svg class="tree-network-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="2" fill="#60a5fa"/>
                <path d="M12 2v8m0 0v8m10-10h-8m0 0h-8" stroke="#64748b" stroke-width="1.5"/>
                <circle cx="12" cy="2" r="1.5" fill="#94a3b8"/>
                <circle cx="12" cy="22" r="1.5" fill="#94a3b8"/>
                <circle cx="22" cy="12" r="1.5" fill="#94a3b8"/>
                <circle cx="2" cy="12" r="1.5" fill="#94a3b8"/>
            </svg>
            <div class="branch-indicator" id="branch-indicator"></div>
        </div>
    `;

    toggleButton.addEventListener('click', () => {
        toggleGraphPanel();
    });

    document.body.appendChild(toggleButton);
}

/**
 * Update branch indicator based on conversation state
*/
/**
function updateBranchIndicator() {
    if (!toggleButton) return;

    const indicator = toggleButton.querySelector('.branch-indicator');
    if (!indicator) return;

    if (!currentTreeData) {
        indicator.style.display = 'none';
        return;
    }

    const { messageToBranch } = currentTreeData;

    // Count unique branches
    const branches = new Set();
    messageToBranch.forEach(info => branches.add(info.branchIndex));

    toggleButton.classList.remove('single-branch', 'main-branch', 'side-branch');

    // Only 1 branch - blue indicator
    if (branches.size === 1) {
        toggleButton.classList.add('single-branch');
        indicator.style.display = 'block';
        return;
    }

    // Multiple branches - determine which one we are currently on
    if (ClaudeAPI.currentLinearBranch && ClaudeAPI.currentLinearBranch.length > 0) {
        // Get the last message in the current branch
        const lastMessage = ClaudeAPI.currentLinearBranch[ClaudeAPI.currentLinearBranch.length - 1];
        const branchInfo = messageToBranch.get(lastMessage.uuid);

        if (branchInfo && branchInfo.isMainBranch) {
            toggleButton.classList.add('main-branch'); // Green
        } else {
            toggleButton.classList.add('side-branch'); // Orange
        }
    }

    indicator.style.display = 'block';
}
*/
function updateBranchIndicator() {
    if (!toggleButton) return;
    const indicator = toggleButton.querySelector('.branch-indicator');
    if (!indicator) return;

    toggleButton.classList.remove('single-branch', 'main-branch', 'side-branch');
    toggleButton.classList.add('main-branch'); // Green
    indicator.style.display = 'block';
}

/**
 * Toggle graph panel visibility
 */
function toggleGraphPanel() {
    if (!graphPanel) return;

    const isOpen = graphPanel.style.right === '0px';

    if (isOpen) {
        closeGraphPanel();
    } else {
        openGraphPanel();
    }
}

/**
 * Open graph panel
 */
function openGraphPanel() {
    if (!graphPanel) return;

    const mode = Settings.get('graph', 'panelMode') || 'overlay';

    // Apply mode BEFORE animation
    if (mode === 'push') {
        applyPanelMode(mode);
    }

    // Then open the panel
    graphPanel.style.right = '0px';

    setTimeout(() => {
        if (currentTreeData) {
            renderGraph(currentTreeData);
        }
    }, 100);
}
/**
 * Close graph panel
 */
function closeGraphPanel() {
    if (!graphPanel) return;
    const width = parseInt(getComputedStyle(graphPanel).width);
    graphPanel.style.right = `-${width}px`;

    // Restore width
    const mode = Settings.get('graph', 'panelMode') || 'overlay';
    if (mode === 'push') {
        const mainContainer = document.querySelector(SELECTORS.chat.mainContainer);
        if (mainContainer) {
            mainContainer.style.width = '';
            mainContainer.style.transition = '';
        }
    }
}
/**
 * Apply panel mode (overlay or push)
 */
function applyPanelMode(mode) {
    const mainContainer = document.querySelector(SELECTORS.chat.mainContainer);

    if (!mainContainer) {
        console.warn(`${LOG_PREFIX} Cannot find main container for panel mode`);
        return;
    }

    if (mode === 'push') {
        const panelWidth = parseInt(getComputedStyle(graphPanel).width);

        // Reduce container width
        mainContainer.style.width = `calc(100% - ${panelWidth}px)`;
        mainContainer.style.transition = 'width 0.3s ease';
        // console.log(`${LOG_PREFIX} Push mode: container width = calc(100% - ${panelWidth}px)`);

    } else {
        // Overlay mode: restore width
        mainContainer.style.width = '';
        mainContainer.style.transition = '';
        // console.log(`${LOG_PREFIX} Overlay mode: restored container width`);
    }
}

// =============================================
// LAYOUT UTILITIES
// =============================================

/**
 * Calculate depth of a node in the tree
 */
function calculateNodeDepth(node, parentLookup) {
    let depth = 0;
    let current = node;
    while (parentLookup.has(current.uuid)) {
        depth++;
        current = parentLookup.get(current.uuid);
    }
    return depth;
}

/**
 * Get the center position of a pair, or the node position if not a pair
 */
function getNodePosition(nodePos, nodePositions) {
    if (!nodePos) return null;

    if (nodePos.isPair && nodePos.pairPartner) {
        const partnerPos = nodePositions.get(nodePos.pairPartner);
        if (partnerPos) {
            return {
                x: (nodePos.x + partnerPos.x) / 2,
                y: (nodePos.y + partnerPos.y) / 2
            };
        }
    }

    return { x: nodePos.x, y: nodePos.y };
}

/**
 * Check if we should skip drawing edge to this node (it's a pair partner)
 */
function shouldSkipPairPartner(currentPos, nextNodeUuid) {
    return currentPos?.isPair && currentPos.pairPartner === nextNodeUuid;
}

/**
 * Calculate X and Y coordinates based on direction, index, and level
 */
function calculateCoordinates(direction, indexPosition, level, horizontalSpacing, verticalSpacing, startX, startY) {
    let x, y;

    if (direction === 'top-down') {
        x = startX + indexPosition * horizontalSpacing;
        y = startY + level * verticalSpacing;
    } else if (direction === 'bottom-up') {
        x = startX + indexPosition * horizontalSpacing;
        y = startY - level * verticalSpacing;
    } else { // 'left-right'
        x = startX + level * verticalSpacing;
        y = startY + indexPosition * horizontalSpacing;
    }

    return { x, y };
}

/**
 * Calculate pair coordinates (human and assistant positions)
 */
function calculatePairCoordinates(direction, indexPosition, level, horizontalSpacing, verticalSpacing, pairGap, startX, startY) {
    const center = calculateCoordinates(direction, indexPosition, level, horizontalSpacing, verticalSpacing, startX, startY);

    let humanX, humanY, assistantX, assistantY;

    if (direction === 'top-down' || direction === 'bottom-up') {
        humanX = center.x - pairGap / 2;
        assistantX = center.x + pairGap / 2;
        humanY = assistantY = center.y;
    } else { // 'left-right'
        humanY = center.y - pairGap / 2;
        assistantY = center.y + pairGap / 2;
        humanX = assistantX = center.x;
    }

    return { humanX, humanY, assistantX, assistantY };
}

/**
 * Calculate node positions for tree layout
 */
function calculateTreeLayout(branchInfo) {
    const nodeGrouping = Settings.get('graph', 'nodeGrouping') || 'individual';

    if (nodeGrouping === 'pairs') {
        return calculateTreeLayoutPairs(branchInfo);
    }

    // Individual mode
    const { allNodes, messageToBranch, parentLookup } = branchInfo;
    const direction = Settings.get('graph', 'direction');

    // Sort nodes by index
    const sortedNodes = [...allNodes].sort((a, b) => a.index - b.index);

    const nodePositions = new Map();
    const levelNodes = new Map();

    // First pass: determine the depth of each node and group by level
    sortedNodes.forEach(node => {
        let depth = 0;
        let current = node;
        while (parentLookup.has(current.uuid)) {
            depth++;
            current = parentLookup.get(current.uuid);
        }

        if (!levelNodes.has(depth)) {
            levelNodes.set(depth, []);
        }
        levelNodes.get(depth).push(node);

        // Temporarily store depth
        node._depth = depth;
    });

    const nodeSpacing = 70; // Vertical distance between nodes
    const levelSpacing = 100; // Horizontal distance between levels
    const startX = 50;
    const startY = 50;

    levelNodes.forEach((nodes, depth) => {
        // Sort nodes at each level by index for sequence
        nodes.sort((a, b) => a.index - b.index);

        nodes.forEach((node, positionInLevel) => {
            const branchInfo = messageToBranch.get(node.uuid);

            let x, y;
            if (direction === 'top-down') {
                x = startX + positionInLevel * nodeSpacing;
                y = startY + depth * levelSpacing;  // Plus = down
            } else if (direction === 'bottom-up') {
                x = startX + positionInLevel * nodeSpacing;
                y = startY - depth * levelSpacing;  // Minus = up
            } else { // 'left-right' or default
                x = startX + depth * levelSpacing;
                y = startY + positionInLevel * nodeSpacing;
            }

            nodePositions.set(node.uuid, {
                x: x,
                y: y,
                depth: depth,
                node: node,
                branchIndex: branchInfo?.branchIndex || '?',
                isMainBranch: branchInfo?.isMainBranch || false
            });
        });
    });

    // Clean up temporary data
    sortedNodes.forEach(node => delete node._depth);

    return nodePositions;
}
/**
 * Calculate node positions for tree layout with fixed branch columns
 */
function calculateTreeLayoutFixed(branchInfo) {
    const nodeGrouping = Settings.get('graph', 'nodeGrouping') || 'individual';
    const { allNodes, messageToBranch, parentLookup } = branchInfo;
    const direction = Settings.get('graph', 'direction');

    if (nodeGrouping === 'pairs') {
        // Pairs mode with fixed branches
        const pairs = groupNodesToPairs(allNodes, messageToBranch, parentLookup);
        const nodePositions = new Map();

        const pairGap = 25;
        const branchSpacing = 120;
        const levelSpacing = 70;
        const startX = 50;
        const startY = 50;

        pairs.forEach(pair => {
            const firstNode = pair.nodes[0];
            const depth = calculateNodeDepth(firstNode, parentLookup);
            const branchInfo = pair.branchInfo;
            const branchIdx = branchInfo?.branchIndex || 1;

            if (pair.type === 'pair') {
                const coords = calculatePairCoordinates(
                    direction,
                    branchIdx - 1,
                    depth,
                    branchSpacing,
                    levelSpacing,
                    pairGap,
                    startX,
                    startY
                );

                nodePositions.set(pair.human.uuid, {
                    x: coords.humanX,
                    y: coords.humanY,
                    depth: depth,
                    node: pair.human,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: true,
                    pairPartner: pair.assistant.uuid
                });

                nodePositions.set(pair.assistant.uuid, {
                    x: coords.assistantX,
                    y: coords.assistantY,
                    depth: depth,
                    node: pair.assistant,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: true,
                    pairPartner: pair.human.uuid
                });
            } else {
                const coords = calculateCoordinates(
                    direction,
                    branchIdx - 1,
                    depth,
                    branchSpacing,
                    levelSpacing,
                    startX,
                    startY
                );

                nodePositions.set(pair.node.uuid, {
                    x: coords.x,
                    y: coords.y,
                    depth: depth,
                    node: pair.node,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: false
                });
            }
        });

        return nodePositions;
    }

    // Individual mode
    const sortedNodes = [...allNodes].sort((a, b) => a.index - b.index);
    const nodePositions = new Map();
    const branchSpacing = 120;
    const levelSpacing = 100;
    const startX = 50;
    const startY = 50;

    sortedNodes.forEach(node => {
        const branchInfo = messageToBranch.get(node.uuid);
        const branchIdx = branchInfo?.branchIndex || 1;
        const depth = calculateNodeDepth(node, parentLookup);

        const coords = calculateCoordinates(
            direction,
            branchIdx - 1,
            depth,
            branchSpacing,
            levelSpacing,
            startX,
            startY
        );

        nodePositions.set(node.uuid, {
            x: coords.x,
            y: coords.y,
            depth: depth,
            node: node,
            branchIndex: branchInfo?.branchIndex || '?',
            isMainBranch: branchInfo?.isMainBranch || false
        });
    });

    return nodePositions;
}
/**
 * Groups nodes into human-assistant pairs
 */
function groupNodesToPairs(allNodes, messageToBranch, parentLookup) {
    const pairs = [];
    const processed = new Set();

    // Sort by index
    const sorted = [...allNodes].sort((a, b) => a.index - b.index);

    for (let i = 0; i < sorted.length; i++) {
        const node = sorted[i];

        if (processed.has(node.uuid)) continue;

        if (node.sender === 'human') {
            // Find next assistant with this node as parent
            const children = allNodes.filter(n =>
                n.parent_message_uuid === node.uuid &&
                n.sender === 'assistant'
            );

            if (children.length > 0) {
                // Take first by index
                const assistant = children.sort((a, b) => a.index - b.index)[0];

                pairs.push({
                    type: 'pair',
                    human: node,
                    assistant: assistant,
                    nodes: [node, assistant],
                    branchInfo: messageToBranch.get(assistant.uuid) // Use assistant's branch info
                });

                processed.add(node.uuid);
                processed.add(assistant.uuid);
            } else {
                // Human without assistant
                pairs.push({
                    type: 'single',
                    node: node,
                    nodes: [node],
                    branchInfo: messageToBranch.get(node.uuid)
                });
                processed.add(node.uuid);
            }
        } else if (node.sender === 'assistant' && !processed.has(node.uuid)) {
            // Orphaned assistant
            pairs.push({
                type: 'single',
                node: node,
                nodes: [node],
                branchInfo: messageToBranch.get(node.uuid)
            });
            processed.add(node.uuid);
        }
    }

    return pairs;
}
/**
 * Calculate layout for pairs mode
 */
function calculateTreeLayoutPairs(branchInfo) {
    const direction = Settings.get('graph', 'direction');
    const { allNodes, messageToBranch, parentLookup } = branchInfo;

    const pairs = groupNodesToPairs(allNodes, messageToBranch, parentLookup);
    const nodePositions = new Map();
    const levelPairs = new Map();

    // Group pairs by depth level
    pairs.forEach(pair => {
        const firstNode = pair.nodes[0];
        const depth = calculateNodeDepth(firstNode, parentLookup);

        if (!levelPairs.has(depth)) {
            levelPairs.set(depth, []);
        }
        levelPairs.get(depth).push({ ...pair, depth });
    });

    const pairGap = 25;
    const pairSpacing = 70;
    const levelSpacing = 70;
    const startX = 50;
    const startY = 50;

    levelPairs.forEach((pairs, depth) => {
        pairs.sort((a, b) => a.nodes[0].index - b.nodes[0].index);

        pairs.forEach((pair, positionInLevel) => {
            const branchInfo = pair.branchInfo;

            if (pair.type === 'pair') {
                const coords = calculatePairCoordinates(
                    direction,
                    positionInLevel,
                    depth,
                    pairSpacing,
                    levelSpacing,
                    pairGap,
                    startX,
                    startY
                );

                nodePositions.set(pair.human.uuid, {
                    x: coords.humanX,
                    y: coords.humanY,
                    depth: depth,
                    node: pair.human,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: true,
                    pairPartner: pair.assistant.uuid
                });

                nodePositions.set(pair.assistant.uuid, {
                    x: coords.assistantX,
                    y: coords.assistantY,
                    depth: depth,
                    node: pair.assistant,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: true,
                    pairPartner: pair.human.uuid
                });
            } else {
                const coords = calculateCoordinates(
                    direction,
                    positionInLevel,
                    depth,
                    pairSpacing,
                    levelSpacing,
                    startX,
                    startY
                );

                nodePositions.set(pair.node.uuid, {
                    x: coords.x,
                    y: coords.y,
                    depth: depth,
                    node: pair.node,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false,
                    isPair: false
                });
            }
        });
    });

    return nodePositions;
}
/**
 * Calculate layout for branches view mode
 */
function calculateBranchesLayout(branchInfo) {
    const direction = Settings.get('graph', 'direction');
    const nodeGrouping = Settings.get('graph', 'nodeGrouping') || 'individual';
    const branches = extractBranchesByIndex(branchInfo);
    const { messageToBranch, parentLookup, allNodes } = branchInfo;

    const nodePositions = new Map();
    const branchSpacing = 120;
    const startX = 50;
    const startY = 50;

    // Check if using pairs mode
    if (nodeGrouping === 'pairs') {
        const nodeSpacing = 70;
        const pairGap = 25;

        branches.forEach((branch, branchArrayIndex) => {
            const { branchIndex, nodes } = branch;

            // Calculate branch start level
            let branchStartLevel = 0;
            if (branchIndex > 1 && nodes.length > 0) {
                const firstNode = nodes[0];
                const parentNode = parentLookup.get(firstNode.uuid);
                if (parentNode) {
                    branchStartLevel = calculateNodeDepth(parentNode, parentLookup);
                }
            }

            // Group nodes in this branch into pairs
            const branchPairs = groupNodesToPairs(nodes, messageToBranch, parentLookup);

            branchPairs.forEach(pair => {
                const firstNodeIndex = nodes.findIndex(n => n.uuid === pair.nodes[0].uuid);
                const actualLevel = branchStartLevel + firstNodeIndex;
                const branchInfo = pair.branchInfo;

                if (pair.type === 'pair') {
                    const coords = calculatePairCoordinates(
                        direction,
                        branchArrayIndex,
                        actualLevel,
                        branchSpacing,
                        nodeSpacing,
                        pairGap,
                        startX,
                        startY
                    );

                    nodePositions.set(pair.human.uuid, {
                        x: coords.humanX,
                        y: coords.humanY,
                        depth: actualLevel,
                        node: pair.human,
                        branchIndex: branchInfo?.branchIndex || '?',
                        isMainBranch: branchInfo?.isMainBranch || false,
                        isPair: true,
                        pairPartner: pair.assistant.uuid
                    });

                    nodePositions.set(pair.assistant.uuid, {
                        x: coords.assistantX,
                        y: coords.assistantY,
                        depth: actualLevel,
                        node: pair.assistant,
                        branchIndex: branchInfo?.branchIndex || '?',
                        isMainBranch: branchInfo?.isMainBranch || false,
                        isPair: true,
                        pairPartner: pair.human.uuid
                    });
                } else {
                    const coords = calculateCoordinates(
                        direction,
                        branchArrayIndex,
                        actualLevel,
                        branchSpacing,
                        nodeSpacing,
                        startX,
                        startY
                    );

                    nodePositions.set(pair.node.uuid, {
                        x: coords.x,
                        y: coords.y,
                        depth: actualLevel,
                        node: pair.node,
                        branchIndex: branchInfo?.branchIndex || '?',
                        isMainBranch: branchInfo?.isMainBranch || false,
                        isPair: false
                    });
                }
            });
        });
    } else {
        // Individual mode
        const nodeSpacing = 70;

        branches.forEach((branch, branchArrayIndex) => {
            const { branchIndex, nodes } = branch;

            // Calculate branch start level
            let branchStartLevel = 0;
            if (branchIndex > 1 && nodes.length > 0) {
                const firstNode = nodes[0];
                const parentNode = parentLookup.get(firstNode.uuid);
                if (parentNode) {
                    branchStartLevel = calculateNodeDepth(parentNode, parentLookup);
                }
            }

            nodes.forEach((node, positionInBranch) => {
                const branchInfo = messageToBranch.get(node.uuid);
                const actualLevel = branchStartLevel + positionInBranch;

                const coords = calculateCoordinates(
                    direction,
                    branchArrayIndex,
                    actualLevel,
                    branchSpacing,
                    nodeSpacing,
                    startX,
                    startY
                );

                nodePositions.set(node.uuid, {
                    x: coords.x,
                    y: coords.y,
                    depth: actualLevel,
                    node: node,
                    branchIndex: branchInfo?.branchIndex || '?',
                    isMainBranch: branchInfo?.isMainBranch || false
                });
            });
        });
    }

    return nodePositions;
}
/**
 * Extract all branches grouped by branchIndex
 */
function extractBranchesByIndex(branchInfo) {
    const { allNodes, messageToBranch } = branchInfo;
    const branches = new Map(); // branchIndex -> array of nodes

    allNodes.forEach(node => {
        const info = messageToBranch.get(node.uuid);
        if (info) {
            const branchIdx = info.branchIndex;
            if (!branches.has(branchIdx)) {
                branches.set(branchIdx, []);
            }
            branches.get(branchIdx).push(node);
        }
    });

    // Sort nodes within each branch by index
    branches.forEach((nodes, branchIdx) => {
        nodes.sort((a, b) => a.index - b.index);
    });

    // Convert to array and sort by branch number
    const result = Array.from(branches.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([branchIdx, nodes]) => ({ branchIndex: branchIdx, nodes }));

    return result;
}

/**
 * Render the tree graph on canvas
 */
function renderGraph(treeData) {
    if (!graphCanvas || !treeData) return;

    const { allNodes, messageToBranch, parentLookup } = treeData;
    const viewMode = Settings.get('graph', 'viewMode') || 'tree';
    const edgeModes = Settings.get('graph', 'edgeModes') || ['parent-child'];

    // Choose layout based on viewMode
    let nodePositions;
    if (viewMode === 'branches') {
        nodePositions = calculateBranchesLayout(treeData);
    } else if (viewMode === 'tree-fixed') {
        nodePositions = calculateTreeLayoutFixed(treeData);
    } else {
        nodePositions = calculateTreeLayout(treeData);
    }

    // Store for click detection
    currentTreeData = { ...treeData, nodePositions };

    // Get the actual container size instead of calculating from nodes
    const canvasContainer = graphCanvas.parentElement;
    const containerRect = canvasContainer.getBoundingClientRect();

    const canvasWidth = Math.max(containerRect.width, 400);
    const canvasHeight = Math.max(containerRect.height, 400);

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    graphCanvas.width = canvasWidth * dpr;
    graphCanvas.height = canvasHeight * dpr;
    graphCanvas.style.width = `${canvasWidth}px`;
    graphCanvas.style.height = `${canvasHeight}px`;

    const ctx = graphCanvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Apply transformation for zoom and pan
    ctx.save();
    ctx.translate(canvasOffset.x, canvasOffset.y);
    ctx.scale(canvasScale, canvasScale);

    // Calculate visible area in graph coordinates
    const visibleLeft = -canvasOffset.x / canvasScale;
    const visibleTop = -canvasOffset.y / canvasScale;
    const visibleRight = (canvasWidth - canvasOffset.x) / canvasScale;
    const visibleBottom = (canvasHeight - canvasOffset.y) / canvasScale;

    /**
     * Draw an edge between two nodes, using pair centers if applicable
     */
    function drawEdge(ctx, fromPos, toPos, nodePositions, style = {}) {
        const {
            strokeStyle = '#3b82f6',
            lineWidth = 2,
            lineDash = [],
            curved = false,
            direction = 'top-down'
        } = style;

        // Get actual positions (centers if pairs)
        const fromCoords = getNodePosition(fromPos, nodePositions);
        const toCoords = getNodePosition(toPos, nodePositions);

        if (!fromCoords || !toCoords) return false;

        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(lineDash);

        ctx.moveTo(fromCoords.x, fromCoords.y);

        if (curved) {
            // Draw bezier curve
            if (direction === 'top-down' || direction === 'bottom-up') {
                const controlPointY = (fromCoords.y + toCoords.y) / 2;
                ctx.bezierCurveTo(
                    fromCoords.x, controlPointY,
                    toCoords.x, controlPointY,
                    toCoords.x, toCoords.y
                );
            } else {
                const controlPointX = (fromCoords.x + toCoords.x) / 2;
                ctx.bezierCurveTo(
                    controlPointX, fromCoords.y,
                    controlPointX, toCoords.y,
                    toCoords.x, toCoords.y
                );
            }
        } else {
            // Draw straight line
            ctx.lineTo(toCoords.x, toCoords.y);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        return true;
    }

    // Draw parent-child edges if selected
    if (edgeModes.includes('parent-child')) {
        if (viewMode === 'tree' || viewMode === 'tree-fixed') {
            const processedPairs = new Set();
            const direction = Settings.get('graph', 'direction');

            allNodes.forEach(node => {
                const parent = parentLookup.get(node.uuid);
                if (!parent) return;

                const childPos = nodePositions.get(node.uuid);
                const parentPos = nodePositions.get(parent.uuid);
                if (!childPos || !parentPos) return;

                // Skip if parent and child are partners in the same pair
                if (childPos.isPair && childPos.pairPartner === parent.uuid) {
                    return;
                }

                // Skip if this pair was already processed
                if (childPos.isPair && childPos.pairPartner) {
                    const pairKey = [node.uuid, childPos.pairPartner].sort().join('-');
                    if (processedPairs.has(pairKey)) return;
                    processedPairs.add(pairKey);
                }

                // If child is not part of a pair, use direct parent coordinates (not pair center)
                // If child is part of a pair, use pair centers
                let childCoords, parentCoords;

                if (childPos.isPair) {
                    // Child is in a pair - use centers for both
                    childCoords = getNodePosition(childPos, nodePositions);
                    parentCoords = getNodePosition(parentPos, nodePositions);
                } else {
                    // Child is individual - use direct coordinates
                    childCoords = { x: childPos.x, y: childPos.y };
                    parentCoords = { x: parentPos.x, y: parentPos.y };
                }

                if (!childCoords || !parentCoords) return;

                const childInView = isPointInView(childCoords.x, childCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);
                const parentInView = isPointInView(parentCoords.x, parentCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);

                if (childInView || parentInView) {
                    ctx.beginPath();
                    ctx.strokeStyle = childPos.isMainBranch ? '#3b82f6' : '#64748b';
                    ctx.lineWidth = childPos.isMainBranch ? 2 : 1;

                    ctx.moveTo(parentCoords.x, parentCoords.y);

                    if (direction === 'top-down' || direction === 'bottom-up') {
                        const controlPointY = (parentCoords.y + childCoords.y) / 2;
                        ctx.bezierCurveTo(
                            parentCoords.x, controlPointY,
                            childCoords.x, controlPointY,
                            childCoords.x, childCoords.y
                        );
                    } else {
                        const controlPointX = (parentCoords.x + childCoords.x) / 2;
                        ctx.bezierCurveTo(
                            controlPointX, parentCoords.y,
                            controlPointX, childCoords.y,
                            childCoords.x, childCoords.y
                        );
                    }

                    ctx.stroke();
                }
            });
        } else {
            // Branches mode
            const branches = extractBranchesByIndex(treeData);

            // Draw cross-branch connections (where branches split off)
            branches.forEach(branch => {
                const { nodes } = branch;
                if (nodes.length === 0) return;

                const firstNode = nodes[0];
                const parentUuid = firstNode.parent_message_uuid;

                if (parentUuid && parentUuid !== CONFIG.INITIAL_PARENT_UUID) {
                    const firstNodePos = nodePositions.get(firstNode.uuid);
                    const parentPos = nodePositions.get(parentUuid);

                    if (firstNodePos && parentPos) {
                        // Visibility check
                        const childCoords = getNodePosition(firstNodePos, nodePositions);
                        const parentCoords = getNodePosition(parentPos, nodePositions);

                        if (!childCoords || !parentCoords) return;

                        const firstInView = isPointInView(childCoords.x, childCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);
                        const parentInView = isPointInView(parentCoords.x, parentCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);

                        if (firstInView || parentInView) {
                            drawEdge(ctx, parentPos, firstNodePos, nodePositions, {
                                strokeStyle: firstNodePos.isMainBranch ? '#3b82f6' : '#64748b',
                                lineWidth: firstNodePos.isMainBranch ? 2 : 1.5,
                                lineDash: [5, 5],
                                curved: false
                            });
                        }
                    }
                }
            });

            // Draw sequential edges within each branch
            branches.forEach(branch => {
                const { nodes } = branch;

                for (let i = 0; i < nodes.length - 1; i++) {
                    const currentNode = nodes[i];
                    const nextNode = nodes[i + 1];

                    const currentPos = nodePositions.get(currentNode.uuid);
                    const nextPos = nodePositions.get(nextNode.uuid);

                    if (!currentPos || !nextPos) continue;

                    // Skip if current and next are partners in the same pair
                    if (shouldSkipPairPartner(currentPos, nextNode.uuid)) continue;

                    // Visibility check
                    const currentCoords = getNodePosition(currentPos, nodePositions);
                    const nextCoords = getNodePosition(nextPos, nodePositions);

                    if (!currentCoords || !nextCoords) continue;

                    const currentInView = isPointInView(currentCoords.x, currentCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);
                    const nextInView = isPointInView(nextCoords.x, nextCoords.y, visibleLeft, visibleTop, visibleRight, visibleBottom);

                    if (currentInView || nextInView) {
                        drawEdge(ctx, currentPos, nextPos, nodePositions, {
                            strokeStyle: currentPos.isMainBranch ? '#3b82f6' : '#64748b',
                            lineWidth: currentPos.isMainBranch ? 2 : 1,
                            curved: false
                        });
                    }
                }
            });
        }
    }

    // Draw sibling edges if selected
    if (edgeModes.includes('siblings')) {
        const siblingGroups = new Map();

        allNodes.forEach(node => {
            const parentUuid = node.parent_message_uuid || CONFIG.INITIAL_PARENT_UUID;
            if (!siblingGroups.has(parentUuid)) {
                siblingGroups.set(parentUuid, { human: [], assistant: [] });
            }
            const group = siblingGroups.get(parentUuid);
            if (node.sender === 'human') {
                group.human.push(node);
            } else {
                group.assistant.push(node);
            }
        });

        // Draw sibling connections (orange dashed lines between branches)
        siblingGroups.forEach((group, parentUuid) => {
            ['human', 'assistant'].forEach(senderType => {
                const siblings = group[senderType];
                if (siblings.length < 2) return;

                siblings.sort((a, b) => a.index - b.index);

                for (let i = 0; i < siblings.length - 1; i++) {
                    const current = siblings[i];
                    const next = siblings[i + 1];

                    const currentPos = nodePositions.get(current.uuid);
                    const nextPos = nodePositions.get(next.uuid);

                    if (currentPos && nextPos) {
                        const currentInView = isPointInView(currentPos.x, currentPos.y, visibleLeft, visibleTop, visibleRight, visibleBottom);
                        const nextInView = isPointInView(nextPos.x, nextPos.y, visibleLeft, visibleTop, visibleRight, visibleBottom);

                        if (currentInView || nextInView) {
                            ctx.beginPath();
                            ctx.strokeStyle = '#f59e0b';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([3, 3]);

                            ctx.moveTo(currentPos.x, currentPos.y);
                            ctx.lineTo(nextPos.x, nextPos.y);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                }
            });
        });
    }

    // Draw pair backgrounds
    if (Settings.get('graph', 'nodeGrouping') === 'pairs') {
        nodePositions.forEach((pos1, uuid1) => {
            if (pos1.isPair && pos1.pairPartner) {
                const pos2 = nodePositions.get(pos1.pairPartner);

                // Draw only once per pair (when processing human)
                if (pos2 && pos1.node.sender === 'human') {
                    const isVisible = isPointInView(pos1.x, pos1.y, visibleLeft, visibleTop, visibleRight, visibleBottom) ||
                                     isPointInView(pos2.x, pos2.y, visibleLeft, visibleTop, visibleRight, visibleBottom);

                    if (!isVisible) return;

                    // Calculate pair bounding box
                    const minX = Math.min(pos1.x, pos2.x);
                    const maxX = Math.max(pos1.x, pos2.x);
                    const minY = Math.min(pos1.y, pos2.y);
                    const maxY = Math.max(pos1.y, pos2.y);

                    const padding = 18;
                    const boxX = minX - padding;
                    const boxY = minY - padding;
                    const boxWidth = (maxX - minX) + padding * 2;
                    const boxHeight = (maxY - minY) + padding * 2;

                    // Determine pair color
                    const isMainBranch = pos1.isMainBranch;
                    const isActive = activeBranchUuids.has(uuid1) && activeBranchUuids.has(pos1.pairPartner);

                    // Draw background box
                    ctx.fillStyle = isMainBranch
                        ? 'rgba(59, 130, 246, 0.08)'
                        : 'rgba(100, 116, 139, 0.08)';

                    ctx.strokeStyle = isActive
                        ? 'rgba(251, 191, 36, 0.5)'
                        : (isMainBranch ? 'rgba(59, 130, 246, 0.25)' : 'rgba(100, 116, 139, 0.25)');

                    ctx.lineWidth = isActive ? 2 : 1;

                    ctx.beginPath();
                    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Draw connecting line between nodes
                    ctx.strokeStyle = isMainBranch
                        ? 'rgba(59, 130, 246, 0.4)'
                        : 'rgba(100, 116, 139, 0.4)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw small pair indicator label
                    const centerX = (pos1.x + pos2.x) / 2;
                    const centerY = (pos1.y + pos2.y) / 2;

                    // Draw small circle background for label
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                    ctx.fillStyle = '#0f172a';
                    ctx.fill();
                    ctx.strokeStyle = isMainBranch ? '#3b82f6' : '#64748b';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // Draw "P" for pair
                    ctx.fillStyle = isMainBranch ? '#60a5fa' : '#94a3b8';
                    ctx.font = 'bold 8px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('P', centerX, centerY);

                    // Content text preview (below the pair box) human inly
                    const showText = Settings.get('graph', 'showNodeText');
                    if (showText) {
                        // Show text for assistant node (usually has more content)
                        const assistantNode = pos1.node.sender === 'human' ? pos1.node : pos2.node;
                        const nodeText = getNodeText(assistantNode);

                        if (nodeText) {
                            const previewText = truncateText(nodeText, 50);
                            ctx.fillStyle = '#94a3b8';
                            ctx.font = '9px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';

                            // Draw text with background - centered below the box
                            const textMetrics = ctx.measureText(previewText);
                            const textWidth = textMetrics.width;
                            const textHeight = 12;
                            const textPadding = 4;
                            const textY = boxY + boxHeight + 4; // 4px below box
                            const textX = centerX;

                            // Background rectangle
                            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                            ctx.fillRect(
                                textX - textWidth / 2 - textPadding,
                                textY,
                                textWidth + textPadding * 2,
                                textHeight + textPadding
                            );

                            // Text
                            ctx.fillStyle = '#94a3b8';
                            ctx.fillText(previewText, textX, textY + 4);
                        }
                    }
                }
            }
        });
    }

    // Draw nodes
    nodePositions.forEach((pos, uuid) => {
        // Visibility check
        if (!isPointInView(pos.x, pos.y, visibleLeft, visibleTop, visibleRight, visibleBottom)) {
            return;
        }

        const node = pos.node;
        const branchInfo = messageToBranch.get(uuid);
        const isMainBranch = branchInfo?.isMainBranch || false;
        const isCanceled = node.stop_reason === 'user_canceled';
        const isActiveBranch = activeBranchUuids.has(uuid);

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);

        if (isCanceled) {
            ctx.fillStyle = '#ef4444';
        } else if (isMainBranch) {
            ctx.fillStyle = '#3b82f6';
        } else {
            ctx.fillStyle = '#64748b';
        }
        ctx.fill();

        // Border - brighter for active branch
        if (isActiveBranch) {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = isMainBranch ? '#60a5fa' : '#94a3b8';
            ctx.lineWidth = 2;
        }
        ctx.stroke();

        // Index text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.index.toString(), pos.x, pos.y);

        // Sender indicator
        const senderColor = node.sender === 'human' ? '#10b981' : '#8b5cf6';
        ctx.fillStyle = senderColor;
        ctx.beginPath();
        ctx.arc(pos.x + 10, pos.y - 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Content text preview (below the node) - only in individual mode
        const showText = Settings.get('graph', 'showNodeText');
        const isPairsMode = Settings.get('graph', 'nodeGrouping') === 'pairs';

        if (showText && !isPairsMode) {
            const nodeText = getNodeText(node);
            if (nodeText) {
                const previewText = truncateText(nodeText, 40);
                ctx.fillStyle = '#94a3b8';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                // Draw text with background for better readability
                const textMetrics = ctx.measureText(previewText);
                const textWidth = textMetrics.width;
                const textHeight = 12;
                const padding = 4;

                // Background rectangle
                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.fillRect(
                    pos.x - textWidth / 2 - padding,
                    pos.y + 16,
                    textWidth + padding * 2,
                    textHeight + padding
                );

                // Text
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(previewText, pos.x, pos.y + 20);
            }
        }
    });

    ctx.restore();

    // Draw legend (doesn't scale)
    drawLegend(ctx, canvasWidth, viewMode, edgeModes);
}

/**
 * Check if point is in visible area
 */
function isPointInView(x, y, left, top, right, bottom, padding = 50) {
    return x >= (left - padding) &&
           x <= (right + padding) &&
           y >= (top - padding) &&
           y <= (bottom + padding);
}

/**
 * Draw legend separately
 */
function drawLegend(ctx, canvasWidth, viewMode) {
    const legendY = 20;

    // Main branch
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(20, legendY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Main', 32, legendY + 4);

    // Side branch
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(80, legendY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Side', 92, legendY + 4);

    // Active branch (highlighted)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(135, legendY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Active', 147, legendY + 4);

    // Canceled
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(205, legendY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Canceled', 217, legendY + 4);

    // Zoom info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    const modeText = viewMode === 'branches' ? 'Branches' : 'Tree';
    ctx.fillText(`${modeText} | Zoom: ${Math.round(canvasScale * 100)}%`, canvasWidth - 10, legendY + 4);
}

/**
 * Find node at given position
 */
function findNodeAtPosition(x, y, nodePositions) {
    if (!nodePositions) return null;

    for (const [uuid, pos] of nodePositions) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= 12) {
            return pos;
        }
    }
    return null;
}

/**
 * Show detailed info about a node and provide jump functionality
 * Uses cross-branch navigation from ClaudePowerestManager&Enhancer
 */
function showNodeDetails(node, messageToBranch) {
    const branchInfo = messageToBranch.get(node.uuid);
    const branchNumber = branchInfo ? branchInfo.branchIndex : '?';
    const branchStatus = branchInfo?.isMainBranch ? 'Main' : 'Side';

    // Get and format content text
    const nodeText = getNodeText(node);
    const formattedText = formatTextContent(nodeText);
    const hasContent = formattedText.trim().length > 0;

    // Escape HTML for safe display
    const escapedPreview = escapeHtml(formattedText.substring(0, 100) + (formattedText.length > 100 ? '...' : ''));
    const escapedFull = escapeHtml(formattedText);

    // Create modal window
    const modal = document.createElement('div');
    modal.className = 'cpm-graph-modal-overlay';
    modal.innerHTML = `
        <div class="cpm-graph-modal">
            <div class="cpm-graph-modal-header">
                <h3>Message #${node.index}</h3>
                <button class="cpm-graph-modal-close">×</button>
            </div>
            <div class="cpm-graph-modal-body">
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">UUID:</span>
                    <span class="cpm-graph-value">${node.uuid}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Parent UUID:</span>
                    <span class="cpm-graph-value">${node.parent_message_uuid || 'ROOT'}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Sender:</span>
                    <span class="cpm-graph-value">${node.sender}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Branch:</span>
                    <span class="cpm-graph-value">${branchNumber}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Status:</span>
                    <span class="cpm-graph-value cpm-graph-status-${branchStatus.toLowerCase()}">${branchStatus}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Created:</span>
                    <span class="cpm-graph-value">${formatTimestamp(node.created_at)}</span>
                </div>
                <div class="cpm-graph-info-row">
                    <span class="cpm-graph-label">Stop Reason:</span>
                    <span class="cpm-graph-value">${node.stop_reason || 'completed'}</span>
                </div>
            </div>
            ${hasContent ? `
            <div class="cpm-graph-content-section">
                <div class="cpm-graph-content-header">Content</div>
                <div class="cpm-graph-content-box">
                    <div class="cpm-graph-content-text" id="content-preview">${escapedPreview}</div>
                    <div class="cpm-graph-content-text" id="content-full" style="display: none;">${escapedFull}</div>
                </div>
                ${formattedText.length > 100 ? '<button class="cpm-graph-content-toggle" id="content-toggle">Show full text</button>' : ''}
            </div>
            ` : ''}
            <div class="cpm-graph-modal-footer">
                <button class="cpm-graph-btn cpm-graph-btn-primary" id="cpm-graph-jump-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Jump to Message
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Toggle full text display
    const toggleBtn = modal.querySelector('#content-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const preview = modal.querySelector('#content-preview');
            const full = modal.querySelector('#content-full');

            if (full.style.display === 'none') {
                preview.style.display = 'none';
                full.style.display = 'block';
                toggleBtn.textContent = 'Show less';
            } else {
                preview.style.display = 'block';
                full.style.display = 'none';
                toggleBtn.textContent = 'Show full text';
            }
        });
    }

    // Close modal window
    const closeModal = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close button in the header (the cross icon)
    const closeBtn = modal.querySelector('.cpm-graph-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Jump to message
    const jumpBtn = modal.querySelector('#cpm-graph-jump-btn');
    jumpBtn.addEventListener('click', async () => {
        closeModal();
        // closeGraphPanel();

        // Use LinearNavigator.jumpToNode which supports cross-branch navigation
        console.log(`${LOG_PREFIX} Initiating cross-branch jump to node: ${node.uuid.slice(-8)}`);
        await LinearNavigator.jumpToNode(node.uuid);
    });
}

/**
 * Extract text content from node
 */
function getNodeText(node) {
    if (!node || !node.content) return '';

    // Handle array content
    if (Array.isArray(node.content)) {
        const textParts = node.content
            .filter(item => item.type === 'text' && item.text)
            .map(item => item.text);
        return textParts.join('\n');
    }

    // Handle string content
    if (typeof node.content === 'string') {
        return node.content;
    }

    return '';
}

/**
 * Truncate text for display
 */
function truncateText(text, maxLength = 50) {
    if (!text) return '';

    // Replace literal \n with spaces for preview
    text = text.replace(/\\n/g, ' ').replace(/\n/g, ' ');

    // Remove extra spaces
    text = text.replace(/\s+/g, ' ').trim();

    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Format text for display (convert \n to actual line breaks)
 */
function formatTextContent(text) {
    if (!text) return '';
    // Replace literal \n with actual line breaks
    return text.replace(/\\n/g, '\n');
}

/**
 * Update graph with new data
 */
async function updateGraph(activeBranch = null) {
    try {
        const conversationData = await getConversationData();
        if (!conversationData || !conversationData.chat_messages) return;

        const tree = buildConversationTree(conversationData.chat_messages);
        const branchInfo = getAllBranchInfo(tree);

        currentTreeData = branchInfo;

        // Save information about the active branch
        if (activeBranch && activeBranch.length > 0) {
            activeBranchUuids = new Set(activeBranch.map(msg => msg.uuid));
        }

        updateBranchIndicator();

        // Render if panel is open
        if (graphPanel && graphPanel.style.right === '0px') {
            renderGraph(branchInfo);
        }
    } catch (error) {
        console.error(`${LOG_PREFIX} Error updating graph:`, error);
    }
}

// =============================================
// INJECTION LOGIC
// =============================================

/**
 * Main function to inject timestamps into all messages
 */
async function injectTimestamps(retryCount = 0) {
    try {
        // Get conversation data from API
        const conversationData = await getConversationData();

        if (!conversationData || !conversationData.chat_messages || conversationData.chat_messages.length === 0) {
            console.log(`${LOG_PREFIX} ❌ No messages found in API`);
            return false;
        }

        // Build conversation tree
        const tree = buildConversationTree(conversationData.chat_messages);

        // Get all branch information (uses MAX INDEX for Main/Side determination)
        const { messageToBranch, mainBranchUuids } = getAllBranchInfo(tree);

        // Update graph data
        currentTreeData = getAllBranchInfo(tree);

        // Find active branch from current_leaf_message_uuid (for DOM matching)
        let activeBranch = findMainBranchPath(tree, conversationData.current_leaf_message_uuid);

        // FALLBACK: If current_leaf_message_uuid is null or not found, use max index path
        if (activeBranch.length === 0) {
            console.log(`${LOG_PREFIX} ⚠️ current_leaf_message_uuid not found, using max index fallback`);
            activeBranch = buildPathFromMaxIndex(tree);
        }

        // Still no branch? Something is wrong
        if (activeBranch.length === 0) {
            console.log(`${LOG_PREFIX} ❌ No active branch found even with fallback`);
            return false;
        }

        console.log(`${LOG_PREFIX} ✅ Using branch with ${activeBranch.length} messages`);

        // Update graph with active branch info
        updateGraph(activeBranch);

        // Get DOM elements using flexible selectors
        const messageContainers = findElements(SELECTORS.message.containers);

        if (messageContainers.length === 0) {
            // Retry if DOM not ready yet (max 3 attempts)
            if (retryCount < CONFIG.retryAttempts) {
                // console.log(`${LOG_PREFIX} ⏳ DOM not ready, retrying... (${retryCount + 1}/${CONFIG.retryAttempts})`);
                setTimeout(() => injectTimestamps(retryCount + 1), CONFIG.retryDelay);
                return false;
            } else {
                // console.log(`${LOG_PREFIX} ❌ No message containers found in DOM after ${CONFIG.retryAttempts} retries`);
                return false;
            }
        }

        console.log(`${LOG_PREFIX} 📊 API (active branch): ${activeBranch.length} messages, DOM: ${messageContainers.length} elements`);

        // Clear old metadata
        clearMetadata();

        // Match and inject
        const totalDomMessages = messageContainers.length;

        // Process each message
        activeBranch.forEach((msg, index) => {
            if (index >= messageContainers.length) return;

            const container = messageContainers[index];

            // Inject message metadata
            injectMetadata(
                container,
                msg,
                messageToBranch,
                index + 1,
                totalDomMessages
            );

            // Look for artifacts in this message's content
            if (msg.content && Array.isArray(msg.content)) {
                const artifacts = msg.content.filter(item =>
                    item.type === 'tool_use' && item.name === 'artifacts' && item.input
                );

                if (artifacts.length > 0) {
                    // console.log(`${LOG_PREFIX} 🎨 Found ${artifacts.length} artifacts in message #${msg.index}`);

                    // Find artifact blocks in this DOM container
                    const artifactBlocks = findElements(SELECTORS.artifact.blocks, container);
                    // console.log(`${LOG_PREFIX} 📦 Found ${artifactBlocks.length} artifact blocks in DOM for message #${msg.index}`);

                    // Match artifacts to blocks (in order)
                    artifacts.forEach((artifact, artifactIndex) => {
                        if (artifactIndex < artifactBlocks.length) {
                            const command = artifact.input.command;
                            const canceled = msg.stop_reason === 'user_canceled';

                            // console.log(`${LOG_PREFIX} ✅ Injecting command "${command}" for artifact #${artifactIndex} in message #${msg.index}`);
                            injectArtifactMetadata(artifactBlocks[artifactIndex], command, canceled);
                        }
                    });
                }
            }
        });

        // Get unique branch count for logging
        const branches = new Set();
        messageToBranch.forEach(info => branches.add(info.branchIndex));

        console.log(`${LOG_PREFIX} 📊 Injected timestamps for ${Math.min(activeBranch.length, messageContainers.length)} messages`);
        console.log(`${LOG_PREFIX} 📊 Main branch UUIDs (from max index): ${mainBranchUuids.size} messages`);
        console.log(`${LOG_PREFIX} 📊 Total branches found: ${branches.size}`);

        return true;

    } catch (error) {
        console.error(`${LOG_PREFIX} ❌ Error:`, error);
        return false;
    }
}

// =============================================
// DEBOUNCE
// =============================================

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

// =============================================
// INITIALIZATION
// =============================================

function init() {
    Settings.load();
    // Create graph UI
    createGraphPanel();
    createToggleButton();

    // Initial injection
    setTimeout(() => {
        console.log(`${LOG_PREFIX} 🚀 Initial injection after page load`);
        injectTimestamps();
    }, CONFIG.initialDelay);

    // Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log(`${LOG_PREFIX} 🔗 URL changed, re-injecting...`);
            ClaudeAPI.checkConversationChange();
            clearMetadata();
            setTimeout(() => {
                injectTimestamps();
            }, 1500);
        }
    }).observe(document, { subtree: true, childList: true });

    // Watch for new user messages (they appear immediately when sent)
    let lastMessageCount = 0;
    const userMessageObserver = new MutationObserver(debounce(() => {
        const messageContainers = document.querySelectorAll(SELECTORS.message.containers[0]);

        // If new messages appeared, inject timestamps
        if (messageContainers.length > lastMessageCount) {
            console.log(`${LOG_PREFIX} 📨 New user message detected, updating...`);
            lastMessageCount = messageContainers.length;
            setTimeout(() => {
                injectTimestamps();
            }, 300);
        }
    }, 200));

    // Observe message list for new messages
    const observeMessages = () => {
        const messageList = document.querySelector(SELECTORS.chat.messageListContainer);
        if (messageList) {
            userMessageObserver.observe(messageList, {
                childList: true,
                subtree: false
            });
            // Initialize message count
            lastMessageCount = messageList.querySelectorAll(SELECTORS.chat.turnBase).length;
        } else {
            // Retry if container not found
            setTimeout(observeMessages, 500);
        }
    };

    setTimeout(observeMessages, 1000);

    // Watch for streaming completion
    const streamingObserver = new MutationObserver(debounce((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' &&
                mutation.attributeName === ATTRIBUTES.IS_STREAMING) {
                const target = mutation.target;
                const isStreaming = target.getAttribute(ATTRIBUTES.IS_STREAMING);

                // When streaming completes
                if (isStreaming === 'false') {
                    console.log(`${LOG_PREFIX} ✅ Streaming completed, updating metadata...`);
                    setTimeout(() => {
                        injectTimestamps();
                    }, 500);
                }
            }
        }
    }, CONFIG.streamingDebounce));

    // Start observing for streaming changes
    const observeStreaming = () => {
        const messageContainers = document.querySelectorAll(SELECTORS.controls.streaming[0]);
        messageContainers.forEach(container => {
            streamingObserver.observe(container, {
                attributes: true,
                attributeFilter: [ATTRIBUTES.IS_STREAMING]
            });
        });
    };

    // Initial observation
    setTimeout(observeStreaming, 1000);

    // Re-observe when new messages appear
    new MutationObserver(debounce(() => {
        observeStreaming();
    }, 500)).observe(document.body, {
        childList: true,
        subtree: true
    });

    // Watch for version switching clicks
    document.addEventListener('click', debounce((e) => {
        const target = e.target.closest('button');
        if (target) {
            // Check if it's a version navigation button
            const hasArrowIcon = findElements(SELECTORS.controls.navigationButtons, target).length > 0;

            if (hasArrowIcon) {
                console.log(`${LOG_PREFIX} 🔄 Version switch detected`);
                setTimeout(() => {
                    injectTimestamps();
                }, 500);
            }
        }
    }, 100), true);

    // Watch for edit form changes
    let editFormPresent = false;
    const editModeObserver = new MutationObserver(debounce(() => {
        const hasEditForm = document.querySelector(SELECTORS.controls.editForm) !== null;

        // Edit form disappeared (user saved/canceled)
        if (editFormPresent && !hasEditForm) {
            console.log(`${LOG_PREFIX} 💾 Edit completed, restoring metadata...`);
            setTimeout(() => {
                injectTimestamps();
            }, 200);
        }

        editFormPresent = hasEditForm;
    }, 100));

    editModeObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// =============================================
// SETTINGS and STYLES
// =============================================

function showGraphSettings() {
    const modal = document.createElement('div');
    modal.className = 'cpm-graph-modal-overlay';

    // Get current settings
    const currentDirection = Settings.get('graph', 'direction') || 'left-right';
    const currentViewMode = Settings.get('graph', 'viewMode') || 'tree';
    const currentGrouping = Settings.get('graph', 'nodeGrouping') || 'individual';
    const currentEdgeModes = Settings.get('graph', 'edgeModes') || ['parent-child'];
    const currentPanelMode = Settings.get('graph', 'panelMode') || 'push';

    modal.innerHTML = `
        <div class="cpm-graph-modal cpm-settings-modal">
            <div class="cpm-graph-modal-header">
                <h3>⚙️ Graph Settings</h3>
                <button class="cpm-graph-modal-close">×</button>
            </div>

            <div class="cpm-graph-modal-body">
                <!-- Layout Direction -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12l7 7 7-7"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Layout Direction</div>
                            <div class="setting-desc">Choose how the tree flows</div>
                        </div>
                    </div>
                    <div class="direction-pills">
                        <div class="direction-pill">
                            <input type="radio" name="direction" id="dir-top" value="top-down" ${currentDirection === 'top-down' ? 'checked' : ''}>
                            <label for="dir-top">
                                <svg viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="8" r="3" class="node" fill="#64748b"/>
                                    <circle cx="13" cy="20" r="3" class="node" fill="#64748b"/>
                                    <circle cx="27" cy="20" r="3" class="node" fill="#64748b"/>
                                    <circle cx="20" cy="32" r="3" class="node" fill="#64748b"/>
                                    <path d="M19 11 L14 17" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M21 11 L26 17" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M15 23 L19 29" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M25 23 L21 29" class="edge" stroke="#475569" stroke-width="1.5"/>
                                </svg>
                                <span class="direction-text">Top-Down</span>
                            </label>
                        </div>
                        <div class="direction-pill">
                            <input type="radio" name="direction" id="dir-left" value="left-right" ${currentDirection === 'left-right' ? 'checked' : ''}>
                            <label for="dir-left">
                                <svg viewBox="0 0 40 40" fill="none">
                                    <circle cx="8" cy="20" r="3" class="node" fill="#3b82f6"/>
                                    <circle cx="20" cy="13" r="3" class="node" fill="#3b82f6"/>
                                    <circle cx="20" cy="27" r="3" class="node" fill="#3b82f6"/>
                                    <circle cx="32" cy="20" r="3" class="node" fill="#3b82f6"/>
                                    <path d="M11 20 L17 14" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                    <path d="M11 20 L17 26" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                    <path d="M23 14 L29 19" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                    <path d="M23 26 L29 21" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                </svg>
                                <span class="direction-text">Left-Right</span>
                            </label>
                        </div>
                        <div class="direction-pill">
                            <input type="radio" name="direction" id="dir-bottom" value="bottom-up" ${currentDirection === 'bottom-up' ? 'checked' : ''}>
                            <label for="dir-bottom">
                                <svg viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="32" r="3" class="node" fill="#64748b"/>
                                    <circle cx="13" cy="20" r="3" class="node" fill="#64748b"/>
                                    <circle cx="27" cy="20" r="3" class="node" fill="#64748b"/>
                                    <circle cx="20" cy="8" r="3" class="node" fill="#64748b"/>
                                    <path d="M19 29 L14 23" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M21 29 L26 23" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M15 17 L19 11" class="edge" stroke="#475569" stroke-width="1.5"/>
                                    <path d="M25 17 L21 11" class="edge" stroke="#475569" stroke-width="1.5"/>
                                </svg>
                                <span class="direction-text">Bottom-Up</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- View Mode -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="5" r="2"/>
                                <circle cx="7" cy="13" r="2"/>
                                <circle cx="17" cy="13" r="2"/>
                                <path d="M12 7v4M7 11l5-2M17 11l-5-2"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">View Mode</div>
                            <div class="setting-desc">Display as tree or branches</div>
                        </div>
                    </div>
                    <div class="view-toggle">
                        <button class="view-option ${currentViewMode === 'tree' ? 'active' : ''}" data-view="tree">
                            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="20" cy="8" r="3"/>
                                <circle cx="13" cy="22" r="3"/>
                                <circle cx="27" cy="22" r="3"/>
                                <circle cx="20" cy="32" r="3"/>
                                <path d="M19 11 L14 19"/>
                                <path d="M21 11 L26 19"/>
                                <path d="M15 25 L19 29"/>
                                <path d="M25 25 L21 29"/>
                            </svg>
                            <span class="view-label">Tree</span>
                            <span class="view-desc">Hierarchical structure</span>
                        </button>
                        <button class="view-option ${currentViewMode === 'tree-fixed' ? 'active' : ''}" data-view="tree-fixed">
                            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="14" cy="8" r="3"/>
                                <circle cx="14" cy="18" r="3"/>
                                <circle cx="26" cy="18" r="3"/>
                                <circle cx="26" cy="28" r="3"/>
                                <path d="M14 11 L14 15"/>
                                <path d="M14 18 L26 18" stroke-dasharray="3,2"/>
                                <path d="M26 21 L26 25"/>
                            </svg>
                            <span class="view-label">Tree Fixed</span>
                            <span class="view-desc">Branches stay aligned</span>
                        </button>
                        <button class="view-option ${currentViewMode === 'branches' ? 'active' : ''}" data-view="branches">
                            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="8" cy="12" r="2.5"/>
                                <circle cx="18" cy="12" r="2.5"/>
                                <circle cx="28" cy="12" r="2.5"/>
                                <line x1="10.5" y1="12" x2="15.5" y2="12"/>
                                <line x1="20.5" y1="12" x2="25.5" y2="12"/>
                                <circle cx="8" cy="28" r="2.5"/>
                                <circle cx="18" cy="28" r="2.5"/>
                                <circle cx="28" cy="28" r="2.5"/>
                                <circle cx="38" cy="28" r="2.5"/>
                                <line x1="10.5" y1="28" x2="15.5" y2="28"/>
                                <line x1="20.5" y1="28" x2="25.5" y2="28"/>
                                <line x1="30.5" y1="28" x2="35.5" y2="28"/>
                            </svg>
                            <span class="view-label">Branches</span>
                            <span class="view-desc">Test - Linear sequences</span>
                        </button>
                    </div>
                </div>

                <!-- Node Grouping -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7" rx="1"/>
                                <rect x="14" y="3" width="7" height="7" rx="1"/>
                                <rect x="3" y="14" width="7" height="7" rx="1"/>
                                <rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Node Grouping</div>
                            <div class="setting-desc">How messages are grouped</div>
                        </div>
                    </div>
                    <div class="grouping-options">
                        <div class="grouping-card">
                            <input type="radio" name="grouping" id="group-individual" value="individual" ${currentGrouping === 'individual' ? 'checked' : ''}>
                            <label for="group-individual">
                                <div class="grouping-icon">
                                    <svg viewBox="0 0 40 40" fill="none">
                                        <circle cx="10" cy="10" r="4" class="node" fill="#64748b"/>
                                        <circle cx="20" cy="10" r="4" class="node" fill="#64748b"/>
                                        <circle cx="30" cy="10" r="4" class="node" fill="#64748b"/>
                                        <circle cx="10" cy="30" r="4" class="node" fill="#64748b"/>
                                        <circle cx="20" cy="30" r="4" class="node" fill="#64748b"/>
                                        <circle cx="30" cy="30" r="4" class="node" fill="#64748b"/>
                                    </svg>
                                </div>
                                <div class="grouping-content">
                                    <div class="grouping-title">Individual Messages</div>
                                    <div class="grouping-desc">Each message separate</div>
                                </div>
                                <div class="grouping-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                            </label>
                        </div>
                        <div class="grouping-card">
                            <input type="radio" name="grouping" id="group-pairs" value="pairs" ${currentGrouping === 'pairs' ? 'checked' : ''}>
                            <label for="group-pairs">
                                <div class="grouping-icon">
                                    <svg viewBox="0 0 40 40" fill="none">
                                        <rect x="4" y="4" width="14" height="12" rx="2" fill="none" stroke="#64748b" stroke-width="1.5"/>
                                        <circle cx="9" cy="10" r="2.5" class="node" fill="#64748b"/>
                                        <circle cx="13" cy="10" r="2.5" class="node" fill="#64748b"/>
                                        <rect x="22" y="24" width="14" height="12" rx="2" fill="none" stroke="#64748b" stroke-width="1.5"/>
                                        <circle cx="27" cy="30" r="2.5" class="node" fill="#64748b"/>
                                        <circle cx="31" cy="30" r="2.5" class="node" fill="#64748b"/>
                                    </svg>
                                </div>
                                <div class="grouping-content">
                                    <div class="grouping-title">Human-Assistant Pairs</div>
                                    <div class="grouping-desc">Group Q&A together</div>
                                </div>
                                <div class="grouping-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Connection Type -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="6" cy="6" r="3"/>
                                <circle cx="18" cy="18" r="3"/>
                                <path d="M8.5 8.5l7 7"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Connection Type</div>
                            <div class="setting-desc">How nodes are connected (can select both)</div>
                        </div>
                    </div>
                    <div class="edge-buttons">
                        <button class="edge-btn ${currentEdgeModes.includes('parent-child') ? 'active' : ''}" data-edge="parent-child">
                            <svg viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="8" r="3" class="node" fill="#3b82f6"/>
                                <circle cx="10" cy="32" r="3" class="node" fill="#3b82f6"/>
                                <circle cx="20" cy="32" r="3" class="node" fill="#3b82f6"/>
                                <circle cx="30" cy="32" r="3" class="node" fill="#3b82f6"/>
                                <path d="M20 11 L10 29" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                <path d="M20 11 L20 29" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                                <path d="M20 11 L30 29" class="edge" stroke="#60a5fa" stroke-width="1.5"/>
                            </svg>
                            <span class="edge-label">Parent-Child</span>
                            <span class="edge-desc">Hierarchical relationships</span>
                        </button>
                        <button class="edge-btn ${currentEdgeModes.includes('siblings') ? 'active' : ''}" data-edge="siblings">
                            <svg viewBox="0 0 40 40" fill="none">
                                <circle cx="10" cy="20" r="3" class="node" fill="#64748b"/>
                                <circle cx="20" cy="20" r="3" class="node" fill="#64748b"/>
                                <circle cx="30" cy="20" r="3" class="node" fill="#64748b"/>
                                <line x1="13" y1="20" x2="17" y2="20" class="edge" stroke="#475569" stroke-width="1.5"/>
                                <line x1="23" y1="20" x2="27" y2="20" class="edge" stroke="#475569" stroke-width="1.5"/>
                            </svg>
                            <span class="edge-label">Siblings</span>
                            <span class="edge-desc">Alternative versions</span>
                        </button>
                    </div>
                </div>

                <!-- Panel Behavior -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M15 3v18"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Panel Behavior</div>
                            <div class="setting-desc">Push content or float over</div>
                        </div>
                    </div>
                    <div class="panel-switch ${currentPanelMode === 'push' ? 'active' : ''}" data-panel="${currentPanelMode}">
                        <div class="panel-info">
                            <div class="panel-icon">
                                <svg viewBox="0 0 40 40" fill="none" stroke="#60a5fa" stroke-width="2">
                                    <rect x="6" y="8" width="20" height="24" rx="2"/>
                                    <rect x="29" y="8" width="10" height="24" rx="2" fill="rgba(59, 130, 246, 0.2)"/>
                                    <path d="M26 20 L29 20" marker-end="url(#arrow)"/>
                                    <defs>
                                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="2" orient="auto">
                                            <polygon points="0 0, 3 2, 0 4" fill="#60a5fa"/>
                                        </marker>
                                    </defs>
                                </svg>
                            </div>
                            <div class="panel-text">
                                <div class="panel-title">${currentPanelMode === 'push' ? 'Push Mode' : 'Overlay Mode'}</div>
                                <div class="panel-desc">${currentPanelMode === 'push' ? 'Panel pushes content aside' : 'Panel floats over content'}</div>
                            </div>
                        </div>
                        <div class="toggle-switch">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                </div>

                <!-- Show Node Text -->
                <div class="setting-block">
                    <div class="setting-header">
                        <div class="setting-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 7h16M4 12h16M4 17h10"/>
                            </svg>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Content Preview</div>
                            <div class="setting-desc">Show text under nodes</div>
                        </div>
                    </div>
                    <div class="panel-switch ${Settings.get('graph', 'showNodeText') ? 'active' : ''}" id="show-text-switch">
                        <div class="panel-info">
                            <div class="panel-icon">
                                <svg viewBox="0 0 40 40" fill="none" stroke="#60a5fa" stroke-width="2">
                                    <circle cx="20" cy="12" r="4"/>
                                    <rect x="10" y="22" width="20" height="10" rx="2" fill="rgba(59, 130, 246, 0.2)"/>
                                    <line x1="13" y1="25" x2="27" y2="25"/>
                                    <line x1="13" y1="29" x2="23" y2="29"/>
                                </svg>
                            </div>
                            <div class="panel-text">
                                <div class="panel-title">${Settings.get('graph', 'showNodeText') ? 'Preview On' : 'Preview Off'}</div>
                                <div class="panel-desc">${Settings.get('graph', 'showNodeText') ? 'Text visible below nodes' : 'Text hidden'}</div>
                            </div>
                        </div>
                        <div class="toggle-switch">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cpm-graph-modal-footer">
                <button class="cpm-graph-btn cpm-graph-btn-secondary" id="cpm-graph-settings-reset">Reset to Defaults</button>
                <button class="cpm-graph-btn cpm-graph-btn-primary" id="cpm-graph-settings-apply">Apply Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // State management
    let selectedDirection = currentDirection;
    let selectedViewMode = currentViewMode;
    let selectedGrouping = currentGrouping;
    let selectedEdgeModes = [...currentEdgeModes];
    let selectedPanelMode = currentPanelMode;
    let selectedShowNodeText = Settings.get('graph', 'showNodeText') || false;

    // Direction change
    modal.querySelectorAll('input[name="direction"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedDirection = e.target.value;
        });
    });

    // View mode toggle
    modal.querySelectorAll('.view-option').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.view-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedViewMode = btn.dataset.view;
        });
    });

    // Grouping change
    modal.querySelectorAll('input[name="grouping"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedGrouping = e.target.value;
        });
    });

    // Edge mode toggle
    modal.querySelectorAll('.edge-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const edgeType = btn.dataset.edge;

            if (selectedEdgeModes.includes(edgeType)) {
                selectedEdgeModes = selectedEdgeModes.filter(mode => mode !== edgeType);
                btn.classList.remove('active');
            } else {
                selectedEdgeModes.push(edgeType);
                btn.classList.add('active');
            }
        });
    });

    // Panel mode toggle
    const panelSwitch = modal.querySelector('.panel-switch');
    panelSwitch.addEventListener('click', () => {
        panelSwitch.classList.toggle('active');
        const isActive = panelSwitch.classList.contains('active');
        selectedPanelMode = isActive ? 'push' : 'overlay';

        const title = panelSwitch.querySelector('.panel-title');
        const desc = panelSwitch.querySelector('.panel-desc');
        if (isActive) {
            title.textContent = 'Push Mode';
            desc.textContent = 'Panel pushes content aside';
        } else {
            title.textContent = 'Overlay Mode';
            desc.textContent = 'Panel floats over content';
        }
    });

    // Show node text toggle
    const showTextSwitch = modal.querySelector('#show-text-switch');
    showTextSwitch.addEventListener('click', () => {
        showTextSwitch.classList.toggle('active');
        const isActive = showTextSwitch.classList.contains('active');
        selectedShowNodeText = isActive;

        const title = showTextSwitch.querySelector('.panel-title');
        const desc = showTextSwitch.querySelector('.panel-desc');
        if (isActive) {
            title.textContent = 'Preview On';
            desc.textContent = 'Text visible below nodes';
        } else {
            title.textContent = 'Preview Off';
            desc.textContent = 'Text hidden';
        }
    });

    // Close modal
    const closeModal = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    modal.querySelector('.cpm-graph-modal-close').addEventListener('click', closeModal);

    // Reset button
    modal.querySelector('#cpm-graph-settings-reset').addEventListener('click', () => {
        const defaults = Settings.defaults.graph;

        selectedDirection = defaults.direction;
        selectedViewMode = defaults.viewMode;
        selectedGrouping = defaults.nodeGrouping;
        selectedEdgeModes = [...defaults.edgeModes];
        selectedPanelMode = defaults.panelMode;
        selectedShowNodeText = defaults.showNodeText;

        // Direction radios
        modal.querySelectorAll('input[name="direction"]').forEach(radio => {
            radio.checked = radio.value === defaults.direction;
        });

        // Grouping radios
        modal.querySelectorAll('input[name="grouping"]').forEach(radio => {
            radio.checked = radio.value === defaults.nodeGrouping;
        });

        // View mode buttons
        modal.querySelectorAll('.view-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === defaults.viewMode);
        });

        // Edge mode buttons
        modal.querySelectorAll('.edge-btn').forEach(btn => {
            const isActive = defaults.edgeModes.includes(btn.dataset.edge);
            btn.classList.toggle('active', isActive);
        });

        // Panel mode switch
        const isPush = defaults.panelMode === 'push';
        panelSwitch.classList.toggle('active', isPush);
        panelSwitch.querySelector('.panel-title').textContent = isPush ? 'Push Mode' : 'Overlay Mode';
        panelSwitch.querySelector('.panel-desc').textContent = isPush
            ? 'Panel pushes content aside'
            : 'Panel floats over content';

        // Show node text switch
        const showText = defaults.showNodeText;
        showTextSwitch.classList.toggle('active', showText);
        showTextSwitch.querySelector('.panel-title').textContent = showText ? 'Preview On' : 'Preview Off';
        showTextSwitch.querySelector('.panel-desc').textContent = showText
            ? 'Text visible below nodes'
            : 'Text hidden';
    });

    // Apply button
    modal.querySelector('#cpm-graph-settings-apply').addEventListener('click', () => {
        Settings.set('graph', 'direction', selectedDirection);
        Settings.set('graph', 'viewMode', selectedViewMode);
        Settings.set('graph', 'nodeGrouping', selectedGrouping);
        Settings.set('graph', 'edgeModes', selectedEdgeModes);
        Settings.set('graph', 'panelMode', selectedPanelMode);
        Settings.set('graph', 'showNodeText', selectedShowNodeText);
        Settings.save();
        closeModal();

        // Re-render graph with new settings
        if (currentTreeData) {
            renderGraph(currentTreeData);
        }

        // Apply panel mode if panel is open
        if (graphPanel && graphPanel.style.right === '0px') {
            applyPanelMode(selectedPanelMode);
        }
    });
}

GM_addStyle(`
    /* Base styles for the script */
    .claude-timestamp-metadata {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Styles for the graph */
    #claude-graph-panel {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Claude-style Resizer */
    .claude-graph-resizer-group {
        position: absolute;
        top: 50%;
        left: -7px;
        width: 14px;
        height: 100%;
        transform: translateY(-50%);
        cursor: col-resize;
        z-index: 10;
        user-select: none;
        display: grid;
        place-items: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        animation: resizer-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .claude-graph-resizer-line {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 0.5px;
        background: rgba(148, 163, 184, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 50ms;
        transform: translateX(-50%);
        transform-origin: center;
    }

    .claude-graph-resizer-handle {
        position: relative;
        width: 8px;
        height: 24px;
        border-radius: 9999px;
        border: 0.5px solid rgba(148, 163, 184, 0.3);
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        cursor: col-resize;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
        overflow: hidden;
    }

    .claude-graph-resizer-handle::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 8px;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(148, 163, 184, 0.15) 20%,
            rgba(148, 163, 184, 0.25) 50%,
            rgba(148, 163, 184, 0.15) 80%,
            transparent
        );
        border-radius: 1px;
        transform: translate(-50%, -50%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .claude-graph-resizer-group:hover .claude-graph-resizer-line {
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(59, 130, 246, 0.4) 20%,
            rgba(59, 130, 246, 0.7) 50%,
            rgba(59, 130, 246, 0.4) 80%,
            transparent
        );
        width: 2px;
        box-shadow:
            0 0 8px rgba(59, 130, 246, 0.3),
            0 0 16px rgba(59, 130, 246, 0.1);
    }

    .claude-graph-resizer-group:hover .claude-graph-resizer-handle {
        border-color: rgba(59, 130, 246, 0.6);
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow:
            0 0 0 2px rgba(59, 130, 246, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.3),
            0 0 12px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
        animation: resizer-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .claude-graph-resizer-group:hover .claude-graph-resizer-handle::before {
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.2) 80%,
            transparent
        );
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
    }

    .claude-graph-resizer-group:active .claude-graph-resizer-handle {
        border-color: rgba(37, 99, 235, 0.8);
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(37, 99, 235, 0.6),
            0 0 40px rgba(37, 99, 235, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        transform: scale(1.1);
        animation: none;
    }

    .claude-graph-resizer-group:active .claude-graph-resizer-line {
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(37, 99, 235, 0.6) 10%,
            rgba(37, 99, 235, 0.9) 50%,
            rgba(37, 99, 235, 0.6) 90%,
            transparent
        );
        width: 3px;
        box-shadow:
            0 0 12px rgba(37, 99, 235, 0.5),
            0 0 24px rgba(37, 99, 235, 0.3),
            0 0 36px rgba(37, 99, 235, 0.1);
    }

    .claude-graph-resizer-group:active .claude-graph-resizer-handle::before {
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.4) 10%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.4) 90%,
            transparent
        );
        box-shadow:
            0 0 6px rgba(255, 255, 255, 0.5),
            0 0 12px rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%) scale(1.2);
    }

    .claude-graph-resizer-group.resizing .claude-graph-resizer-handle {
        border-color: rgba(37, 99, 235, 0.8);
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.4),
            0 0 16px rgba(37, 99, 235, 0.5);
        transform: scale(1.08);
    }

    .claude-graph-resizer-group.resizing .claude-graph-resizer-line {
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(37, 99, 235, 0.5) 20%,
            rgba(37, 99, 235, 0.8) 50%,
            rgba(37, 99, 235, 0.5) 80%,
            transparent
        );
        width: 2.5px;
        box-shadow:
            0 0 10px rgba(37, 99, 235, 0.4),
            0 0 20px rgba(37, 99, 235, 0.2);
    }

    .claude-graph-resizer-group:focus-visible .claude-graph-resizer-handle {
        outline: 2px solid rgba(59, 130, 246, 0.6);
        outline-offset: 2px;
    }

    @keyframes resizer-fade-in {
        from {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }
    }

    @keyframes resizer-pulse {
        0%, 100% {
            box-shadow:
                0 0 0 2px rgba(59, 130, 246, 0.2),
                0 2px 8px rgba(0, 0, 0, 0.3),
                0 0 12px rgba(59, 130, 246, 0.4);
        }
        50% {
            box-shadow:
                0 0 0 3px rgba(59, 130, 246, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.3),
                0 0 16px rgba(59, 130, 246, 0.5);
        }
    }

    /* Toggle Button with Branch Indicator */
    .graph-toggle-indicator {
        position: fixed;
        top: 290px;
        right: 0;
        width: 50px;
        height: 50px;
        border-radius: 16px 0 0 16px;
        background: linear-gradient(135deg, rgba(14, 20, 30, 0.95) 0%, rgba(10, 17, 32, 0.9) 100%);
        border: 1.5px solid rgba(59, 130, 246, 0.4);
        cursor: pointer;
        z-index: 10001;
        backdrop-filter: blur(10px);
        /* box-shadow: */
            /* 0 0 0 1px rgba(56, 189, 248, 0.2), */
            /* 0 0 25px rgba(59, 130, 246, 0.4), */
            /* inset 0 1px 0 rgba(148, 163, 184, 0.1); */
        transition: all 0.3s ease;
    }
    .indicator-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tree-network-icon {
        width: 26px;
        height: 26px;
        transition: all 0.3s ease;
    }
    .branch-indicator {
        position: absolute;
        top: 4px;
        right: 8px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #3b82f6;
        border: 2px solid #0f172a;
        display: none;
        transition: all 0.3s ease;
    }
    /* Only one branch - blue, no animation - not work */
    .graph-toggle-indicator.single-branch .branch-indicator {
        background: #3b82f6;
        display: block;
    }
    /* Multiple branches, on main branch - green, soft pulse */
    .graph-toggle-indicator.main-branch .branch-indicator {
        background: #22c55e;
        display: block;
        animation: soft-pulse 2s infinite;
    }
    /* On a side branch - orange, active pulse - not work */
    .graph-toggle-indicator.side-branch .branch-indicator {
        background: #f59e0b;
        display: block;
        animation: pulse 1s infinite;
    }
    @keyframes soft-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.9; }
    }
    /* animate-pulse flex flex-col gap-8 fade-out-bottom h-[calc(100vh-12.5rem)] */
    /* @keyframes pulse { */
        /* 0%, 100% { transform: scale(1); opacity: 1; } */
        /* 50% { transform: scale(1.2); opacity: 0.8; } */
    /* } */
    .graph-toggle-indicator:hover {
        border-color: rgba(59, 130, 246, 0.7);
        transform: scale(1.05);
        box-shadow:
            0 0 0 1px rgba(56, 189, 248, 0.4),
            0 0 40px rgba(59, 130, 246, 0.6),
            0 0 60px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(148, 163, 184, 0.2);
    }
    .graph-toggle-indicator:hover .tree-network-icon {
        transform: rotate(45deg);
    }

    .highlight-pulse {
        animation: cpm-highlight-pulse 3s ease-out;
    }

    @keyframes cpm-highlight-pulse {
        0%, 100% { background-color: rgba(255, 243, 205, 0); }
        20% { background-color: rgba(255, 243, 205, 1); }
    }
    /* Modal Styles */
    .cpm-graph-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .cpm-graph-modal {
        background: linear-gradient(to bottom, #1e293b 0%, #0f172a 100%);
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2);
        min-width: 420px;
        max-width: 480px;
        animation: slideUp 0.3s ease;
        overflow: hidden;
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .cpm-graph-modal-header {
        padding: 24px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cpm-graph-modal-header h3 {
        margin: 0;
        color: #e2e8f0;
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .cpm-graph-modal-close {
        background: rgba(51, 65, 85, 0.5);
        border: none;
        color: #94a3b8;
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;
        font-weight: 300;
    }

    .cpm-graph-modal-close:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        transform: rotate(90deg);
    }

    .cpm-graph-modal-body {
        padding: 24px;
        max-height: 400px;
        overflow-y: auto;
    }

    .cpm-graph-modal-body::-webkit-scrollbar {
        width: 6px;
    }

    .cpm-graph-modal-body::-webkit-scrollbar-track {
        background: rgba(51, 65, 85, 0.3);
        border-radius: 3px;
    }

    .cpm-graph-modal-body::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.5);
        border-radius: 3px;
    }

    .cpm-graph-modal-body::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.7);
    }

    .cpm-graph-info-row {
        display: flex;
        margin-bottom: 14px;
        align-items: flex-start;
        padding: 8px 12px;
        background: rgba(51, 65, 85, 0.3);
        border-radius: 6px;
        transition: background 0.2s;
    }

    .cpm-graph-info-row:hover {
        background: rgba(51, 65, 85, 0.5);
    }

    .cpm-graph-info-row:last-child {
        margin-bottom: 0;
    }

    .cpm-graph-label {
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
        min-width: 110px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 11px;
    }

    .cpm-graph-value {
        color: #e2e8f0;
        font-size: 14px;
        word-break: break-all;
        line-height: 1.5;
    }

    .cpm-graph-content-section {
        padding: 16px 24px;
        border-top: 1px solid rgba(51, 65, 85, 0.5);
        background: rgba(15, 23, 42, 0.3);
    }

    .cpm-graph-content-header {
        color: #94a3b8;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .cpm-graph-content-box {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(71, 85, 105, 0.3);
        border-radius: 8px;
        padding: 12px;
        max-height: 200px;
        overflow-y: auto;
    }

    .cpm-graph-content-text {
        color: #cbd5e1;
        font-family: 'Roboto Mono', monospace;
        font-size: 11px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .cpm-graph-content-toggle {
        margin-top: 8px;
        padding: 6px 12px;
        width: 100%;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: #60a5fa;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .cpm-graph-content-toggle:hover {
        background: rgba(59, 130, 246, 0.3);
        border-color: rgba(59, 130, 246, 0.5);
    }

    .cpm-graph-status-main {
        color: #60a5fa;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 12px;
        background: rgba(59, 130, 246, 0.2);
        padding: 2px 8px;
        border-radius: 4px;
        display: inline-block;
    }

    .cpm-graph-status-side {
        color: #94a3b8;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 12px;
        background: rgba(100, 116, 139, 0.2);
        padding: 2px 8px;
        border-radius: 4px;
        display: inline-block;
    }

    .cpm-graph-modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #334155;
        display: flex;
        gap: 12px;
        justify-content: center;
    }

    .cpm-graph-btn {
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cpm-graph-btn:hover {
        background: rgba(71, 85, 105, 0.8);
        color: #e2e8f0;
    }

    .cpm-graph-btn-primary {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .cpm-graph-btn-primary:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .cpm-graph-btn-primary:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .cpm-graph-btn-secondary {
        background: rgba(51, 65, 85, 0.6);
        color: #cbd5e1;
    }

    .cpm-graph-btn-secondary:hover {
        background: rgba(71, 85, 105, 0.8);
    }

    /* Settings Modal Styles */
    .cpm-settings-modal {
        min-width: 900px;
        max-width: 95vw;
    }

    .cpm-settings-modal .cpm-graph-modal-body {
        padding: 32px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        max-height: 620px;
        overflow-y: auto;
    }

    .setting-block {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.7) 100%);
        border: 1px solid rgba(71, 85, 105, 0.4);
        border-radius: 16px;
        padding: 20px;
        transition: all 0.3s;
    }

    .setting-block:hover {
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .setting-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
    }

    .setting-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }

    .setting-icon svg {
        width: 20px;
        height: 20px;
        color: #60a5fa;
    }

    .setting-info {
        flex: 1;
    }

    .setting-label {
        color: #e2e8f0;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .setting-desc {
        color: #64748b;
        font-size: 12px;
        line-height: 1.4;
    }

    /* Direction Pills */
    .direction-pills {
        display: flex;
        gap: 8px;
    }

    .direction-pill {
        flex: 1;
        position: relative;
    }

    .direction-pill input {
        position: absolute;
        opacity: 0;
    }

    .direction-pill label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 14px 8px;
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(71, 85, 105, 0.3);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .direction-pill:hover label {
        border-color: rgba(59, 130, 246, 0.4);
        background: rgba(15, 23, 42, 0.8);
    }

    .direction-pill input:checked + label {
        border-color: #3b82f6;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .direction-pill svg {
        width: 32px;
        height: 32px;
    }

    .direction-pill .node {
        transition: fill 0.2s;
    }

    .direction-pill .edge {
        transition: stroke 0.2s;
    }

    .direction-pill:hover .node,
    .direction-pill input:checked + label .node {
        fill: #60a5fa;
    }

    .direction-pill:hover .edge,
    .direction-pill input:checked + label .edge {
        stroke: #60a5fa;
    }

    .direction-text {
        color: #94a3b8;
        font-size: 11px;
        font-weight: 600;
        text-align: center;
        transition: color 0.2s;
    }

    .direction-pill input:checked + label .direction-text {
        color: #60a5fa;
    }

    /* View Toggle */
    .view-toggle {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        background: rgba(15, 23, 42, 0.4);
        padding: 6px;
        border-radius: 12px;
    }

    .view-option {
        padding: 16px 12px;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-family: inherit;
        min-height: 110px;
    }

    .view-option:hover {
        background: rgba(51, 65, 85, 0.4);
    }

    .view-option.active {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .view-option svg {
        width: 36px;
        height: 36px;
    }

    .view-label {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 600;
        transition: color 0.2s;
        margin-bottom: 2px;
    }

    .view-option.active .view-label {
        color: white;
    }

    .view-desc {
        color: #94a3b8;
        font-size: 10px;
        text-align: center;
        line-height: 1.3;
    }

    .view-option.active .view-desc {
        color: rgba(255, 255, 255, 0.8);
    }

    /* Grouping Cards */
    .grouping-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .grouping-card {
        position: relative;
    }

    .grouping-card input {
        position: absolute;
        opacity: 0;
    }

    .grouping-card label {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(71, 85, 105, 0.3);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .grouping-card:hover label {
        border-color: rgba(59, 130, 246, 0.4);
        background: rgba(15, 23, 42, 0.8);
    }

    .grouping-card input:checked + label {
        border-color: #3b82f6;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .grouping-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .grouping-icon svg {
        width: 100%;
        height: 100%;
    }

    .grouping-icon .node {
        transition: fill 0.2s;
    }

    .grouping-card:hover .node,
    .grouping-card input:checked + label .node {
        fill: #60a5fa;
    }

    .grouping-content {
        flex: 1;
    }

    .grouping-title {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 2px;
        transition: color 0.2s;
    }

    .grouping-card input:checked + label .grouping-title {
        color: #60a5fa;
    }

    .grouping-desc {
        color: #64748b;
        font-size: 11px;
    }

    .grouping-check {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .grouping-card input:checked + label .grouping-check {
        border-color: #3b82f6;
        background: #3b82f6;
    }

    .grouping-check svg {
        width: 12px;
        height: 12px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .grouping-card input:checked + label .grouping-check svg {
        opacity: 1;
    }

    /* Edge Buttons */
    .edge-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .edge-btn {
        padding: 14px 12px;
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(71, 85, 105, 0.3);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-family: inherit;
        min-height: 110px;
    }

    .edge-btn:hover {
        border-color: rgba(59, 130, 246, 0.4);
        background: rgba(15, 23, 42, 0.8);
    }

    .edge-btn.active {
        border-color: #3b82f6;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .edge-btn svg {
        width: 28px;
        height: 28px;
    }

    .edge-btn .node,
    .edge-btn .edge {
        transition: all 0.2s;
    }

    .edge-btn:hover .node,
    .edge-btn.active .node {
        fill: #60a5fa;
    }

    .edge-btn:hover .edge,
    .edge-btn.active .edge {
        stroke: #60a5fa;
    }

    .edge-label {
        color: #e2e8f0;
        font-size: 11px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 2px;
        transition: color 0.2s;
    }

    .edge-btn.active .edge-label {
        color: #60a5fa;
    }

    .edge-desc {
        color: #64748b;
        font-size: 10px;
        text-align: center;
        line-height: 1.3;
    }

    /* Panel Switch */
    .panel-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(71, 85, 105, 0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .panel-switch:hover {
        border-color: rgba(59, 130, 246, 0.4);
    }

    .panel-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .panel-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .panel-icon svg {
        width: 100%;
        height: 100%;
    }

    .panel-text {
        flex: 1;
    }

    .panel-title {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 2px;
    }

    .panel-desc {
        color: #64748b;
        font-size: 11px;
    }

    .toggle-switch {
        width: 48px;
        height: 26px;
        background: rgba(71, 85, 105, 0.6);
        border-radius: 13px;
        position: relative;
        transition: background 0.2s;
    }

    .panel-switch.active .toggle-switch {
        background: #3b82f6;
    }

    .toggle-slider {
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 3px;
        left: 3px;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .panel-switch.active .toggle-slider {
        transform: translateX(22px);
    }

    @media (max-width: 900px) {
        .cpm-settings-modal {
            min-width: 90vw;
        }

        .cpm-settings-modal .cpm-graph-modal-body {
            grid-template-columns: 1fr;
        }
    }
`);
})();