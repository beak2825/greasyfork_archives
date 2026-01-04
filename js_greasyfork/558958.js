// ==UserScript==
// @name         PenguinMod Expandable Drag
// @namespace    https://studio.penguinmod.com
// @version      12/14/2025
// @description  Makes it so dragging the bottom of the if block makes it expand and contract
// @author       pooiod7
// @match        https://studio.penguinmod.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558958/PenguinMod%20Expandable%20Drag.user.js
// @updateURL https://update.greasyfork.org/scripts/558958/PenguinMod%20Expandable%20Drag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DRAG_THRESHOLD = 45;
    const EDGE_SENSITIVITY = 5;
    const MIN_LIMIT = 1;

    const EXPANDABLE_BLOCKS = {
        'default_expandable': {
            expand: (block) => {
                if (!block.mutationToDom) return;
                const mutation = block.mutationToDom();
                const attr = ['count', 'branches', 'cases', 'length', 'elseif_count'].find(a => mutation.hasAttribute(a));
                if (attr) {
                    const val = parseInt(mutation.getAttribute(attr));
                    mutation.setAttribute(attr, val + 1);
                    block.domToMutation(mutation);
                }
            },
            contract: (block) => {
                if (!block.mutationToDom) return;
                const mutation = block.mutationToDom();
                const attr = ['count', 'branches', 'cases', 'length', 'elseif_count'].find(a => mutation.hasAttribute(a));
                if (attr) {
                    const val = parseInt(mutation.getAttribute(attr));
                    if (val > MIN_LIMIT) {
                        mutation.setAttribute(attr, val - 1);
                        block.domToMutation(mutation);
                    }
                }
            }
        }
    };

    function isCBlock(block) {
        if (!block || !block.inputList) return false;
        return block.inputList.some(input => input.type === 3);
    }

    function init() {
        const workspaceSvg = document.querySelector('.blocklySvg');
        if (!workspaceSvg) {
            setTimeout(init, 500);
            return;
        }

        let isDragging = false;
        let startY = 0;
        let currentBlock = null;
        let accumulatedDelta = 0;

        document.addEventListener('mousedown', (e) => {
            const target = e.target;
            const blockCanvas = target.closest('.blocklyDraggable');
            if (!blockCanvas) return;

            if (typeof Blockly === 'undefined') return;
            const workspace = Blockly.getMainWorkspace();
            if (!workspace) return;
            
            const blockId = blockCanvas.getAttribute('data-id');
            const block = workspace.getBlockById(blockId);
            if (!block) return;

            if (!isCBlock(block)) return;

            const opcode = block.type;
            const handler = EXPANDABLE_BLOCKS[opcode] ||
                            (block.mutationToDom ? EXPANDABLE_BLOCKS['default_expandable'] : null);

            if (!handler) return;

            const blockRect = blockCanvas.getBoundingClientRect();
            const clickY = e.clientY;
            const bottomEdge = blockRect.bottom;

            if (Math.abs(bottomEdge - clickY) < EDGE_SENSITIVITY) {
                isDragging = true;
                currentBlock = block;
                startY = e.clientY;
                accumulatedDelta = 0;

                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !currentBlock) return;

            e.preventDefault();
            e.stopPropagation();

            const currentY = e.clientY;
            const delta = currentY - startY;
            accumulatedDelta += delta;
            startY = currentY;

            const opcode = currentBlock.type;
            const handler = EXPANDABLE_BLOCKS[opcode] || EXPANDABLE_BLOCKS['default_expandable'];

            if (accumulatedDelta > DRAG_THRESHOLD) {
                if (handler && handler.expand) {
                    handler.expand(currentBlock);
                }
                accumulatedDelta = 0;
            } else if (accumulatedDelta < -DRAG_THRESHOLD) {
                if (handler && handler.contract) {
                    handler.contract(currentBlock);
                }
                accumulatedDelta = 0;
            }
        }, true);

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                currentBlock = null;
                accumulatedDelta = 0;
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    init();
})();