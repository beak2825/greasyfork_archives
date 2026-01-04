// ==UserScript==
// @name		Sora Prompt Enhancer by robomonkey.io
// @description		Enhance your Sora video prompts with AI
// @version		1.0.1
// @match		https://*.sora.chatgpt.com/*
// @icon		https://cdn.openai.com/sora/assets/favicon-nf2.ico
// @license MIT
// @namespace https://greasyfork.org/users/1521443
// @downloadURL https://update.greasyfork.org/scripts/551573/Sora%20Prompt%20Enhancer%20by%20robomonkeyio.user.js
// @updateURL https://update.greasyfork.org/scripts/551573/Sora%20Prompt%20Enhancer%20by%20robomonkeyio.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Sora Prompt Enhancer loaded');

    function addEnhanceButton() {
        // Check if button already exists
        if (document.getElementById('enhance-prompt-btn')) {
            console.log('Enhance button already exists');
            return;
        }

        // Find the textarea
        const textarea = document.querySelector('textarea[placeholder*="Describe your video"]');
        if (!textarea) {
            console.log('Textarea not found, will retry...');
            return;
        }

        console.log('Textarea found, adding enhance button');

        // Find the composer container (the parent with buttons)
        const composerContainer = textarea.closest('.flex.flex-col.gap-1\\.5');
        if (!composerContainer) {
            console.log('Composer container not found');
            return;
        }

        // Find the button row
        const buttonRow = composerContainer.querySelector('.flex.items-center.justify-between');
        if (!buttonRow) {
            console.log('Button row not found');
            return;
        }

        // Find the right side button group
        const rightButtonGroup = buttonRow.querySelector('.flex.gap-1\\.5:last-child');
        if (!rightButtonGroup) {
            console.log('Right button group not found');
            return;
        }

        // Create the enhance button
        const enhanceBtn = document.createElement('button');
        enhanceBtn.id = 'enhance-prompt-btn';
        enhanceBtn.className = 'inline-flex gap-1.5 items-center justify-center whitespace-nowrap text-sm font-semibold focus-visible:outline-none bg-token-bg-composer-button hover:bg-token-bg-active px-3 h-[36px] rounded-full';
        enhanceBtn.innerHTML = '✨ Enhance';
        enhanceBtn.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);';
        
        // Add hover effect
        enhanceBtn.addEventListener('mouseenter', () => {
            enhanceBtn.style.transform = 'scale(1.05)';
            enhanceBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
        });
        
        enhanceBtn.addEventListener('mouseleave', () => {
            enhanceBtn.style.transform = 'scale(1)';
            enhanceBtn.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        });

        // Add click handler
        enhanceBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await enhancePrompt(textarea, enhanceBtn);
        });

        // Insert the button before the settings button
        const settingsBtn = rightButtonGroup.querySelector('button[aria-label="Settings"]');
        if (settingsBtn) {
            rightButtonGroup.insertBefore(enhanceBtn, settingsBtn);
        } else {
            rightButtonGroup.appendChild(enhanceBtn);
        }

        console.log('Enhance button added successfully');
    }

    async function enhancePrompt(textarea, button) {
        const currentPrompt = textarea.value.trim();
        
        if (!currentPrompt) {
            showNotification('Please enter a prompt first!', 'warning');
            return;
        }

        // Save original button state
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '⏳ Enhancing...';
        button.style.opacity = '0.7';

        try {
            console.log('Enhancing prompt:', currentPrompt);

            const enhancedPrompt = await RM.aiCall(
                `You are an expert at writing video generation prompts for Sora AI. Enhance the following prompt to be more detailed, cinematic, and effective for video generation. Include specific details about camera movements, lighting, mood, and visual style. Keep it concise but impactful (max 200 words).

Original prompt: "${currentPrompt}"

Provide ONLY the enhanced prompt, nothing else.`,
                {
                    type: "json_schema",
                    json_schema: {
                        name: "enhanced_prompt",
                        schema: {
                            type: "object",
                            properties: {
                                enhancedPrompt: { 
                                    type: "string",
                                    description: "The enhanced video generation prompt"
                                },
                                improvements: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of key improvements made"
                                }
                            },
                            required: ["enhancedPrompt"]
                        }
                    }
                }
            );

            console.log('Enhanced prompt received:', enhancedPrompt);

            // Update the textarea with enhanced prompt
            textarea.value = enhancedPrompt.enhancedPrompt;
            
            // Trigger input event so Sora recognizes the change
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            showNotification('Prompt enhanced successfully! ✨', 'success');

        } catch (error) {
            console.error('Error enhancing prompt:', error);
            showNotification('Failed to enhance prompt. Please try again.', 'error');
        } finally {
            // Restore button state
            button.disabled = false;
            button.innerHTML = originalText;
            button.style.opacity = '1';
        }
    }

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.getElementById('enhance-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'enhance-notification';
        
        const bgColors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function init() {
        console.log('Initializing Sora Prompt Enhancer');
        
        // Try to add button immediately
        addEnhanceButton();

        // Watch for DOM changes to add button when textarea appears
        const observer = new MutationObserver(() => {
            addEnhanceButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Observer started');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();