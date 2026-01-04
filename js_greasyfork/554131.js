// ==UserScript==
// @name         Seiko Watch Info Enhancer for Reddit & Forums
// @version      1.2
// @description  Automatically detect Seiko watch models in Reddit posts and comments, and add helpful info cards with mod options, custom builds, and upgrade paths. Essential tool for r/SeikoMods community!
// @author       SkyrimWrist
// @match        *://*.reddit.com/*
// @match        *://watchuseek.com/*
// @match        *://skyrimwrist.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/1236237
// @downloadURL https://update.greasyfork.org/scripts/554131/Seiko%20Watch%20Info%20Enhancer%20for%20Reddit%20%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/554131/Seiko%20Watch%20Info%20Enhancer%20for%20Reddit%20%20Forums.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Seiko model database with mod potential
    const SEIKO_MODELS = {
        'SKX007': {
            name: 'Seiko SKX007',
            modPotential: 'Excellent',
            popularMods: ['NH35 movement upgrade', 'Sapphire crystal', 'Ceramic bezel insert', 'Custom dial & hands'],
            difficulty: 'Beginner-Friendly',
            description: 'The most popular Seiko mod platform with endless customization options.'
        },
        'SKX009': {
            name: 'Seiko SKX009',
            modPotential: 'Excellent',
            popularMods: ['Pepsi bezel', 'NH36 movement', 'Double-dome sapphire', 'Aftermarket hands'],
            difficulty: 'Beginner-Friendly',
            description: 'Iconic Pepsi diver with massive modding community support.'
        },
        'SKX013': {
            name: 'Seiko SKX013',
            modPotential: 'Very Good',
            popularMods: ['36mm case mods', 'NH35 upgrade', 'Sapphire crystal', 'Custom bezels'],
            difficulty: 'Intermediate',
            description: 'Compact 38mm version perfect for smaller wrists.'
        },
        'TURTLE': {
            name: 'Seiko Turtle (SRP/SRPE)',
            modPotential: 'Excellent',
            popularMods: ['Ceramic bezel', 'Sapphire crystal', 'OEM+ dial swaps', 'Uncle Seiko bracelet'],
            difficulty: 'Intermediate',
            description: 'Cushion case classic with great water resistance and mod options.'
        },
        'SAMURAI': {
            name: 'Seiko Samurai (SRPB/SRPE)',
            modPotential: 'Good',
            popularMods: ['Bezel inserts', 'Sapphire crystal', 'Aftermarket bracelets'],
            difficulty: 'Intermediate',
            description: 'Angular sports diver with unique aesthetics.'
        },
        'MONSTER': {
            name: 'Seiko Monster',
            modPotential: 'Very Good',
            popularMods: ['Bezel mods', 'Crystal upgrades', 'Hand swaps'],
            difficulty: 'Intermediate',
            description: 'Bold design with distinctive shark-tooth markers.'
        },
        'ALPINIST': {
            name: 'Seiko Alpinist',
            modPotential: 'Good',
            popularMods: ['Sapphire crystal', 'Strap swaps', 'Dial variants'],
            difficulty: 'Intermediate',
            description: 'Field watch icon with compass bezel and cathedral hands.'
        },
        '5KX': {
            name: 'Seiko 5 Sports (SRPD/K)',
            modPotential: 'Excellent',
            popularMods: ['Complete case swaps', 'NH36 parts', 'SKX-style conversion'],
            difficulty: 'Beginner-Friendly',
            description: 'Modern Seiko 5 with NH36 movement - great value mod base.'
        },
        'SNK': {
            name: 'Seiko SNK (SNK80x series)',
            modPotential: 'Good',
            popularMods: ['Dial swaps', 'Hand upgrades', 'Strap mods'],
            difficulty: 'Beginner',
            description: 'Affordable automatic perfect for learning to mod.'
        }
    };

    // Movement compatibility info
    const MOVEMENTS = {
        'NH35': 'Workhorse automatic movement, hacking & hand-winding, 41h power reserve',
        'NH36': 'NH35 with day-date complication, most versatile Seiko mod movement',
        '4R36': 'OEM version of NH36, excellent reliability',
        '7S26': 'Original SKX movement, non-hacking, 41h power reserve',
        '6R15': 'Higher-grade movement with 50h power reserve, used in Alpinist'
    };

    GM_addStyle(`
        .seiko-info-card {
            background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
            border-left: 4px solid #00d4ff;
            border-radius: 8px;
            padding: 12px 15px;
            margin: 10px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.15);
            color: #ffffff;
        }

        .seiko-info-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .seiko-model-name {
            font-size: 15px;
            font-weight: 700;
            color: #00d4ff;
            margin: 0;
        }

        .seiko-mod-badge {
            display: inline-block;
            padding: 3px 8px;
            background: rgba(0, 212, 255, 0.2);
            border-radius: 12px;
            font-size: 11px;
            color: #00d4ff;
            font-weight: 600;
        }

        .seiko-info-description {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            margin: 8px 0;
            line-height: 1.5;
        }

        .seiko-mods-list {
            margin: 10px 0;
        }

        .seiko-mods-title {
            font-size: 12px;
            font-weight: 600;
            color: #ffd700;
            margin-bottom: 6px;
        }

        .seiko-mod-item {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            padding: 4px 0;
            padding-left: 16px;
            position: relative;
        }

        .seiko-mod-item:before {
            content: "•";
            position: absolute;
            left: 4px;
            color: #00d4ff;
            font-weight: bold;
        }

        .seiko-info-links {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .seiko-info-link {
            flex: 1;
            padding: 8px 12px;
            background: rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 6px;
            text-align: center;
            text-decoration: none;
            color: #00d4ff;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            cursor: pointer;
        }

        .seiko-info-link:hover {
            background: rgba(0, 212, 255, 0.25);
            border-color: #00d4ff;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 212, 255, 0.2);
        }

        .seiko-difficulty {
            display: inline-block;
            padding: 2px 8px;
            background: rgba(255, 215, 0, 0.15);
            border-radius: 10px;
            font-size: 10px;
            color: #ffd700;
            margin-left: 8px;
        }

        .seiko-inline-link {
            color: #00d4ff;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px dashed rgba(0, 212, 255, 0.4);
            transition: border-bottom 0.2s;
        }

        .seiko-inline-link:hover {
            border-bottom: 1px solid #00d4ff;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .seiko-info-card {
            animation: fadeInUp 0.3s ease-out;
        }
    `);

    // Detect Seiko model mentions in text
    function detectSeikoModels(text) {
        const upperText = text.toUpperCase();
        const foundModels = [];

        for (const [key, data] of Object.entries(SEIKO_MODELS)) {
            if (upperText.includes(key)) {
                foundModels.push({ key, ...data });
            }
        }

        return foundModels;
    }

    // Create info card for a Seiko model
    function createInfoCard(modelData) {
        const card = document.createElement('div');
        card.className = 'seiko-info-card';

        const modsHtml = modelData.popularMods
            .map(mod => `<div class="seiko-mod-item">${mod}</div>`)
            .join('');

        card.innerHTML = `
            <div class="seiko-info-header">
                <h4 class="seiko-model-name">⌚ ${modelData.name}</h4>
                <span class="seiko-mod-badge">Mod Potential: ${modelData.modPotential}</span>
            </div>
            <div class="seiko-info-description">
                ${modelData.description}
                <span class="seiko-difficulty">🔧 ${modelData.difficulty}</span>
            </div>
            <div class="seiko-mods-list">
                <div class="seiko-mods-title">Popular Modifications:</div>
                ${modsHtml}
            </div>
            <div class="seiko-info-links">
                <a href="https://skyrimwrist.com/collections/seiko-mod-watches?filter=${modelData.key.toLowerCase()}"
                   target="_blank"
                   class="seiko-info-link">
                    🔧 View Mod Parts
                </a>
                <a href="https://skyrimwrist.com/collections/custom-seiko-watches"
                   target="_blank"
                   class="seiko-info-link">
                    ✨ Custom Builds
                </a>
                <a href="https://skyrimwrist.com/pages/seiko-mod-guide"
                   target="_blank"
                   class="seiko-info-link">
                    📚 Mod Guide
                </a>
            </div>
        `;

        return card;
    }

    // Process Reddit posts and comments
    function processRedditContent() {
        // Reddit post titles
        const postTitles = document.querySelectorAll('[data-testid="post-container"] h3, .Post .title');

        postTitles.forEach(title => {
            if (title.hasAttribute('data-seiko-processed')) return;

            const models = detectSeikoModels(title.textContent);
            if (models.length > 0) {
                title.setAttribute('data-seiko-processed', 'true');

                // Add info card after the post
                const postContainer = title.closest('[data-testid="post-container"]') || title.closest('.Post');
                if (postContainer) {
                    const existingCard = postContainer.querySelector('.seiko-info-card');
                    if (!existingCard) {
                        models.forEach(model => {
                            const card = createInfoCard(model);
                            const contentArea = postContainer.querySelector('[data-click-id="text"]') ||
                                              postContainer.querySelector('.expando');
                            if (contentArea) {
                                contentArea.appendChild(card);
                            }
                        });
                    }
                }
            }
        });

        // Reddit comments
        const comments = document.querySelectorAll('[data-testid="comment"], .Comment .md');

        comments.forEach(comment => {
            if (comment.hasAttribute('data-seiko-processed')) return;

            const models = detectSeikoModels(comment.textContent);
            if (models.length > 0) {
                comment.setAttribute('data-seiko-processed', 'true');

                const existingCard = comment.querySelector('.seiko-info-card');
                if (!existingCard) {
                    models.slice(0, 1).forEach(model => { // Only show first match to avoid clutter
                        const card = createInfoCard(model);
                        comment.appendChild(card);
                    });
                }
            }
        });
    }

    // Process WatchUSeek forum posts
    function processForumContent() {
        const posts = document.querySelectorAll('.postcontent, .post-content, .messageText');

        posts.forEach(post => {
            if (post.hasAttribute('data-seiko-processed')) return;

            const models = detectSeikoModels(post.textContent);
            if (models.length > 0) {
                post.setAttribute('data-seiko-processed', 'true');

                const existingCard = post.querySelector('.seiko-info-card');
                if (!existingCard) {
                    models.slice(0, 1).forEach(model => {
                        const card = createInfoCard(model);
                        post.appendChild(card);
                    });
                }
            }
        });
    }

    // Initialize
    function init() {
        // Initial processing
        processRedditContent();
        processForumContent();

        // Watch for new content (infinite scroll, dynamic loading)
        const observer = new MutationObserver((mutations) => {
            processRedditContent();
            processForumContent();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also process on scroll (for lazy-loaded content)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                processRedditContent();
                processForumContent();
            }, 500);
        });
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
