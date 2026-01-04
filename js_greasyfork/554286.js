// ==UserScript==
// @name Very Smart Symbol Game Auto-Solver Pro v3.4 with Auto-Login
// @namespace http://tampermonkey.net/
// @version 4.5
// @description Advanced automatic symbol matching with enhanced anti-detection and image support + Auto-Login
// @author Assistant Pro
// @match https://adsha.re/*
// @match https://*.adsha.re/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/554286/Very%20Smart%20Symbol%20Game%20Auto-Solver%20Pro%20v34%20with%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/554286/Very%20Smart%20Symbol%20Game%20Auto-Solver%20Pro%20v34%20with%20Auto-Login.meta.js
// ==/UserScript==

(function() {
'use strict';

// Enhanced Security & Anti-detection Configuration
const config = {
    // Timing Configuration
    baseDelay: 1200,
    randomDelay: true,
    minDelay: 850,
    maxDelay: 2200,
    // Behavioral Patterns
    enableHumanPatterns: true,
    clickPositionVariation: true,
    movementVariation: true,
    occasionalMisses: false,
    missRate: 0.00,
    // Rate Limiting
    maxClicksPerMinute: 20,
    maxSessionLength: 1800000,
    cooldownPeriods: true,
    // Stealth Features
    enableConsoleLogs: false,
    randomUserAgent: false,
    hideScriptPresence: true,
    // Advanced Detection Evasion
    mimicMouseMovements: false,
    scrollRandomly: true,
    tabActivity: true,
    sessionRotation: true,

    // Accuracy Settings
    alwaysPerfectAccuracy: true,
    minimumConfidence: 0.90,
    retryFailedMatches: true,

    // NEW: Enhanced matching capabilities
    enableImageAnswerMatching: true,
    symbolTypeMatching: true,
    enableBackgroundToBackgroundMatching: true
};

// State Management
let state = {
    clickCount: 0,
    lastClickTime: 0,
    sessionStartTime: Date.now(),
    isRunning: true,
    totalSolved: 0,
    consecutiveRounds: 0,
    lastActionTime: Date.now(),
    mousePath: [],
    isInCooldown: false,
    consecutiveFails: 0
};

// Advanced Pattern Storage
const behaviorPatterns = {
    delays: [],
    clickPositions: [],
    sessionTimes: [],
    accuracy: []
};

// Symbol type definitions based on your click data
const SYMBOL_TYPES = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    ARROW_DOWN: 'arrow_down',
    ARROW_LEFT: 'arrow_left',
    BACKGROUND_CIRCLE: 'background_circle',
    UNKNOWN: 'unknown'
};

// ========== AUTO-REFRESH FOR LOGIN PAGE ========== //
(function() {
    'use strict';
    
    // Check if we're on login page
    if (window.location.href.includes('/login')) {
        console.log('On login page, setting up auto-refresh...');
        
        let refreshCount = 0;
        const maxRefreshAttempts = 3;
        
        // Refresh after 30 seconds if still on login page
        setTimeout(() => {
            if (window.location.href.includes('/login') && refreshCount < maxRefreshAttempts) {
                refreshCount++;
                console.log(`Auto-refreshing login page (attempt ${refreshCount})...`);
                window.location.reload();
            }
        }, 30000); // 30 seconds
    }
})();

// ========== LOGIN SYSTEM ========== //
const loginConfig = {
    email: 'loginallapps@gmail.com',
    password: '@Sd2007123',
    maxLoginAttempts: 3,
    loginCheckInterval: 5000,
    enableConsoleLogs: true
};

let loginState = {
    isLoggedIn: false,
    loginAttempts: 0,
    isLoggingIn: false
};

function log(message) {
    if (loginConfig.enableConsoleLogs) {
        console.log(`🔐 ${message}`);
    }
}

function forceLogin() {
    if (loginState.isLoggingIn || loginState.loginAttempts >= loginConfig.maxLoginAttempts) {
        return;
    }

    loginState.isLoggingIn = true;
    loginState.loginAttempts++;

    log(`Attempting login (attempt ${loginState.loginAttempts})...`);

    // Check if we're already on login page or need to navigate
    if (window.location.href.includes('/login')) {
        performLogin();
    } else {
        // Navigate to login page
        window.location.href = 'https://adsha.re/login';
        // Wait for page load then login
        setTimeout(performLogin, 3000);
    }
}

function performLogin() {
    try {
        // Wait for page to fully load
        setTimeout(() => {
            const pageSource = document.documentElement.outerHTML;
            
            // Find login form
            const form = document.querySelector('form[name="login"]');
            if (!form) {
                log('No login form found');
                loginState.isLoggingIn = false;
                return;
            }

            // Find password field
            let passwordFieldName = null;
            const inputs = form.querySelectorAll('input');
            
            inputs.forEach(input => {
                const fieldName = input.getAttribute('name') || '';
                const fieldValue = input.getAttribute('value') || '';
                
                if (fieldValue === 'Password' && fieldName !== 'mail' && fieldName) {
                    passwordFieldName = fieldName;
                }
            });

            if (!passwordFieldName) {
                log('No password field found');
                loginState.isLoggingIn = false;
                return;
            }

            log(`Password field identified: ${passwordFieldName}`);

            // Fill email field
            const emailSelectors = [
                "input[name='mail']",
                "input[type='email']",
                "input[placeholder*='email' i]",
            ];

            let emailFilled = false;
            for (const selector of emailSelectors) {
                try {
                    const emailField = document.querySelector(selector);
                    if (emailField) {
                        emailField.value = loginConfig.email;
                        // Trigger change event
                        emailField.dispatchEvent(new Event('input', { bubbles: true }));
                        emailField.dispatchEvent(new Event('change', { bubbles: true }));
                        log('Email entered successfully');
                        emailFilled = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }

            if (!emailFilled) {
                log('Could not fill email field');
                loginState.isLoggingIn = false;
                return;
            }

            // Wait a bit before filling password
            setTimeout(() => {
                // Fill password field
                const passwordSelectors = [
                    `input[name='${passwordFieldName}']`,
                    "input[type='password']",
                    "input[placeholder*='password' i]",
                ];

                let passwordFilled = false;
                for (const selector of passwordSelectors) {
                    try {
                        const passwordField = document.querySelector(selector);
                        if (passwordField) {
                            passwordField.value = loginConfig.password;
                            // Trigger change event
                            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                            passwordField.dispatchEvent(new Event('change', { bubbles: true }));
                            log('Password entered successfully');
                            passwordFilled = true;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!passwordFilled) {
                    loginState.isLoggingIn = false;
                    return;
                }

                // Wait a bit before submitting
                setTimeout(submitLogin, 2000);

            }, 2000);

        }, 2000);

    } catch (error) {
        log(`Login error: ${error}`);
        loginState.isLoggingIn = false;
    }
}

function submitLogin() {
    try {
        const submitSelectors = [
            "button[type='submit']",
            "input[type='submit']",
            "button",
            "input[value*='Login']",
        ];

        let loginClicked = false;
        for (const selector of submitSelectors) {
            try {
                const loginBtn = document.querySelector(selector);
                if (loginBtn && loginBtn.offsetParent !== null) { // Check if visible
                    loginBtn.click();
                    log('Login button clicked');
                    loginClicked = true;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!loginClicked) {
            // Try form submission as fallback
            const form = document.querySelector('form[name="login"]');
            if (form) {
                form.submit();
                log('Form submitted');
                loginClicked = true;
            }
        }

        // Check login success after delay
        setTimeout(checkLoginSuccess, 5000);

    } catch (error) {
        log(`Submit error: ${error}`);
        loginState.isLoggingIn = false;
    }
}

function checkLoginSuccess() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/surf') || currentUrl.includes('/game') || 
        document.body.innerHTML.toLowerCase().includes('surf') || 
        document.body.innerHTML.toLowerCase().includes('game')) {
        
        loginState.isLoggedIn = true;
        loginState.isLoggingIn = false;
        log('Login successful!');
        
        // Redirect to game page if needed
        if (!currentUrl.includes('/surf')) {
            window.location.href = 'https://adsha.re/surf';
        }
    } else {
        log('Login may have failed');
        loginState.isLoggingIn = false;
        
        // Retry if we haven't exceeded max attempts
        if (loginState.loginAttempts < loginConfig.maxLoginAttempts) {
            log('Retrying login...');
            setTimeout(forceLogin, 5000);
        }
    }
}

function checkIfLoginNeeded() {
    // Check if we're on a page that requires login
    const currentUrl = window.location.href;
    const pageContent = document.body.innerHTML.toLowerCase();
    
    const isLoginPage = currentUrl.includes('/login');
    const hasLoginForm = pageContent.includes('login') && document.querySelector('form[name="login"]');
    const isGamePage = currentUrl.includes('/surf') || pageContent.includes('game');
    
    if ((isLoginPage || hasLoginForm) && !loginState.isLoggedIn && !loginState.isLoggingIn) {
        log('Login required detected');
        forceLogin();
    } else if (isGamePage) {
        loginState.isLoggedIn = true;
        log('Already on game page - logged in');
    }
}

function initLogin() {
    log('Login system initialized');
    
    // Check immediately if login is needed
    checkIfLoginNeeded();
    
    // Periodically check if login is needed
    setInterval(checkIfLoginNeeded, loginConfig.loginCheckInterval);
    
    // Also check on URL changes
    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkIfLoginNeeded();
        }
    }, 1000);
}
// ========== END LOGIN SYSTEM ========== //

// Get intelligent delay with human-like patterns
function getSmartDelay() {
    if (!config.randomDelay) return config.baseDelay;

    const hour = new Date().getHours();
    let base = config.baseDelay;

    const sessionDuration = Date.now() - state.sessionStartTime;
    if (sessionDuration > 900000) {
        base += 300;
    }

    const randomVariation = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1));
    return base + randomVariation;
}

// Advanced rate limiting with behavioral analysis
function isBehaviorSuspicious() {
    const now = Date.now();
    const timeSinceLastClick = now - state.lastClickTime;

    const clicksPerMinute = (state.clickCount / ((now - state.sessionStartTime) / 60000)) || 0;
    if (clicksPerMinute > config.maxClicksPerMinute) {
        return true;
    }

    if (behaviorPatterns.delays.length > 5) {
        const recentDelays = behaviorPatterns.delays.slice(-5);
        const variance = Math.max(...recentDelays) - Math.min(...recentDelays);
        if (variance < 200) {
            return true;
        }
    }

    if (now - state.sessionStartTime > config.maxSessionLength) {
        return true;
    }

    return false;
}

// Generate realistic mouse movement path
function generateMousePath(startX, startY, endX, endY) {
    const path = [];
    const steps = 8 + Math.floor(Math.random() * 8);
    const controlPoints = 1 + Math.floor(Math.random() * 2);

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let x = startX + (endX - startX) * t;
        let y = startY + (endY - startY) * t;

        if (controlPoints > 0) {
            const curve = Math.sin(t * Math.PI) * (10 + Math.random() * 20);
            x += curve * (Math.random() - 0.5);
            y += curve * (Math.random() - 0.5);
        }

        path.push({ x: Math.round(x), y: Math.round(y) });
    }

    return path;
}

// Simulate human mouse movements
function simulateMouseMovement(element) {
    if (!config.mimicMouseMovements) return;

    const rect = element.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    const path = generateMousePath(startX, startY, endX, endY);

    path.forEach((point, index) => {
        setTimeout(() => {
            const moveEvent = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: point.x,
                clientY: point.y
            });
            document.dispatchEvent(moveEvent);
        }, index * (20 + Math.random() * 30));
    });

    return path.length * 25;
}

// Advanced human-like click with NO intentional misses
function advancedHumanClick(element) {
    if (isBehaviorSuspicious() || state.isInCooldown) {
        if (config.enableConsoleLogs) console.log("⏳ Safety cooldown active");
        return false;
    }

    const rect = element.getBoundingClientRect();
    let targetX, targetY;

    if (config.clickPositionVariation) {
        const variationX = rect.width * (0.3 + Math.random() * 0.4);
        const variationY = rect.height * (0.3 + Math.random() * 0.4);
        targetX = rect.left + variationX;
        targetY = rect.top + variationY;
    } else {
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
    }

    if (config.mimicMouseMovements) {
        const moveTime = simulateMouseMovement(element);
        setTimeout(() => performClickSequence(element, targetX, targetY), moveTime);
    } else {
        performClickSequence(element, targetX, targetY);
    }

    behaviorPatterns.clickPositions.push({ x: targetX, y: targetY });
    if (behaviorPatterns.clickPositions.length > 50) {
        behaviorPatterns.clickPositions.shift();
    }

    state.clickCount++;
    state.lastClickTime = Date.now();
    state.lastActionTime = Date.now();

    return true;
}

// Perform the actual click sequence
function performClickSequence(element, x, y) {
    const events = [
        { type: 'mouseenter', bubbles: true },
        { type: 'mouseover', bubbles: true },
        { type: 'mousemove', bubbles: true, clientX: x, clientY: y },
        { type: 'mousedown', bubbles: true, clientX: x, clientY: y },
        { type: 'mouseup', bubbles: true, clientX: x, clientY: y },
        { type: 'click', bubbles: true, clientX: x, clientY: y }
    ];

    events.forEach((eventConfig, index) => {
        setTimeout(() => {
            const event = new MouseEvent(eventConfig.type, {
                view: window,
                bubbles: eventConfig.bubbles,
                cancelable: true,
                clientX: eventConfig.clientX || x,
                clientY: eventConfig.clientY || y
            });
            element.dispatchEvent(event);
        }, index * (50 + Math.random() * 50));
    });
}

// ENHANCED: Classify symbol type for both SVG and background images
function classifySymbolType(element) {
    if (!element) return SYMBOL_TYPES.UNKNOWN;

    // Check if it's a background image element
    const div = element.querySelector('div');
    if (div && div.style && div.style.backgroundImage && div.style.backgroundImage.includes('img.gif')) {
        return SYMBOL_TYPES.BACKGROUND_CIRCLE;
    }

    // Check if it's an SVG element
    const svg = element.querySelector('svg');
    if (!svg || !svg.innerHTML) return SYMBOL_TYPES.UNKNOWN;

    const content = svg.innerHTML.toLowerCase();

    // Circle detection (concentric circles)
    if (content.includes('circle') && content.includes('cx="50"') && content.includes('cy="50"')) {
        const circles = (content.match(/<circle/g) || []).length;
        if (circles >= 2) {
            return SYMBOL_TYPES.CIRCLE;
        }
    }

    // Square detection (nested squares)
    if (content.includes('rect x="25" y="25"') && content.includes('width="50" height="50"')) {
        const rects = (content.match(/<rect/g) || []).length;
        if (rects >= 2) {
            return SYMBOL_TYPES.SQUARE;
        }
    }

    // Diamond detection (rotated squares)
    if (content.includes('transform="matrix(0.7071') && content.includes('42.4"')) {
        return SYMBOL_TYPES.DIAMOND;
    }

    // Arrow down detection (pointing down)
    if (content.includes('polygon') && content.includes('25 75') && content.includes('50 25') && content.includes('75 75')) {
        return SYMBOL_TYPES.ARROW_DOWN;
    }

    // Arrow left detection (pointing left)
    if (content.includes('polygon') && content.includes('25 25') && content.includes('75 50') && content.includes('25 75')) {
        return SYMBOL_TYPES.ARROW_LEFT;
    }

    return SYMBOL_TYPES.UNKNOWN;
}

// Enhanced symbol comparison with fuzzy matching
function compareSymbols(questionSvg, answerSvg) {
    try {
        const questionContent = questionSvg.innerHTML.replace(/\s+/g, ' ').trim();
        const answerContent = answerSvg.innerHTML.replace(/\s+/g, ' ').trim();

        const cleanQuestion = questionContent
            .replace(/fill:#[A-F0-9]+/gi, '')
            .replace(/stroke:#[A-F0-9]+/gi, '')
            .replace(/style="[^"]*"/g, '')
            .replace(/class="[^"]*"/g, '');

        const cleanAnswer = answerContent
            .replace(/fill:#[A-F0-9]+/gi, '')
            .replace(/stroke:#[A-F0-9]+/gi, '')
            .replace(/style="[^"]*"/g, '')
            .replace(/class="[^"]*"/g, '');

        // Exact match (preferred)
        if (cleanQuestion === cleanAnswer) {
            return { match: true, confidence: 1.0, exact: true };
        }

        // Fuzzy matching for similar symbols
        const similarity = calculateSimilarity(cleanQuestion, cleanAnswer);
        const shouldMatch = similarity > config.minimumConfidence;

        return {
            match: shouldMatch,
            confidence: similarity,
            exact: false
        };
    } catch (error) {
        return { match: false, confidence: 0, exact: false };
    }
}

// Calculate string similarity for fuzzy matching
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / parseFloat(longer.length);
}

// Levenshtein distance for edit distance calculation
function getEditDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// ENHANCED: Find the BEST possible match with high confidence - NOW INCLUDES BACKGROUND IMAGES
function findBestMatch(questionElement, links) {
    let bestMatch = null;
    let highestConfidence = 0;
    let exactMatches = [];

    const questionType = classifySymbolType(questionElement);
    const questionSvg = questionElement.querySelector('svg');

    links.forEach((link, index) => {
        const answerSvg = link.querySelector("svg");
        const answerType = classifySymbolType(link);

        // CASE 1: Both question and answer are SVGs - use traditional matching
        if (questionSvg && answerSvg) {
            const comparison = compareSymbols(questionSvg, answerSvg);
            if (comparison.exact && comparison.match) {
                exactMatches.push({
                    link,
                    confidence: comparison.confidence,
                    exact: true,
                    matchType: 'svg_exact'
                });
            } else if (comparison.match && comparison.confidence > highestConfidence) {
                highestConfidence = comparison.confidence;
                bestMatch = {
                    link,
                    confidence: comparison.confidence,
                    exact: false,
                    matchType: 'svg_fuzzy'
                };
            }
        }
        // CASE 2: Question is SVG, Answer is Background Image
        else if (questionSvg && answerType === SYMBOL_TYPES.BACKGROUND_CIRCLE) {
            // Background images are always circles - match if question is also a circle
            if (questionType === SYMBOL_TYPES.CIRCLE) {
                const confidence = 0.98; // High confidence for circle-to-background-circle
                if (confidence > highestConfidence) {
                    highestConfidence = confidence;
                    bestMatch = {
                        link,
                        confidence: confidence,
                        exact: true,
                        matchType: 'svg_to_background'
                    };
                }
            }
        }
        // CASE 3: Question is Background Image, Answer is Background Image
        else if (questionType === SYMBOL_TYPES.BACKGROUND_CIRCLE && answerType === SYMBOL_TYPES.BACKGROUND_CIRCLE) {
            const confidence = 1.0; // Perfect match - both are background circles
            exactMatches.push({
                link,
                confidence: confidence,
                exact: true,
                matchType: 'background_to_background'
            });
        }
        // CASE 4: Question is Background Image, Answer is SVG
        else if (questionType === SYMBOL_TYPES.BACKGROUND_CIRCLE && answerSvg) {
            // Background circle question should match with SVG circle answer
            if (answerType === SYMBOL_TYPES.CIRCLE) {
                const confidence = 0.98;
                if (confidence > highestConfidence) {
                    highestConfidence = confidence;
                    bestMatch = {
                        link,
                        confidence: confidence,
                        exact: true,
                        matchType: 'background_to_svg'
                    };
                }
            }
        }
    });

    // Return exact match if available
    if (exactMatches.length > 0) {
        return exactMatches[0];
    }

    // Return best match if confidence is high enough
    if (bestMatch && bestMatch.confidence >= config.minimumConfidence) {
        return bestMatch;
    }

    return null;
}

// Random scroll to mimic human behavior
function performRandomScroll() {
    if (!config.scrollRandomly) return;
    const scrollAmount = Math.floor(Math.random() * 200) - 100;
    window.scrollBy(0, scrollAmount);
}

// Cooldown management
function startCooldown(duration = 30000) {
    state.isInCooldown = true;
    if (config.enableConsoleLogs) console.log(`😴 Cooldown activated for ${duration/1000}s`);
    setTimeout(() => {
        state.isInCooldown = false;
        if (config.enableConsoleLogs) console.log("✅ Cooldown ended");
    }, duration);
}

// ENHANCED: Main solver with PERFECT accuracy including background images
function advancedSolveSymbolGame() {
    if (!state.isRunning || state.isInCooldown) return;

    try {
        // Occasionally take breaks
        if (state.consecutiveRounds > 15 && Math.random() < 0.3) {
            if (config.enableConsoleLogs) console.log("💤 Taking a short break...");
            startCooldown(10000 + Math.random() * 20000);
            state.consecutiveRounds = 0;
            return;
        }

        // Find the question element (could be SVG or background image)
        const questionElement = document.querySelector("svg") ? document.querySelector("svg").closest('div') || document.querySelector("svg") : document.querySelector('div[style*="background-image"]');

        if (!questionElement) {
            if (config.enableConsoleLogs) console.log("⏳ Waiting for game to load...");
            return;
        }

        const links = Array.from(document.querySelectorAll("a[href*='adsha.re'], a[href*='symbol-matching-game']"));

        // Find the best possible match with high confidence
        const bestMatch = findBestMatch(questionElement, links);

        if (bestMatch) {
            if (advancedHumanClick(bestMatch.link)) {
                state.totalSolved++;
                state.consecutiveRounds++;
                state.consecutiveFails = 0;

                if (config.enableConsoleLogs) {
                    const matchType = bestMatch.exact ? "EXACT" : "FUZZY";
                    const source = bestMatch.matchType || "UNKNOWN";
                    console.log(`✅ ${matchType} Match! (${source}) Confidence: ${(bestMatch.confidence * 100).toFixed(1)}% | Total: ${state.totalSolved}`);
                }

                // Record timing pattern
                behaviorPatterns.delays.push(getSmartDelay());
                if (behaviorPatterns.delays.length > 20) {
                    behaviorPatterns.delays.shift();
                }
            }
        } else {
            // No good match found - wait and retry
            state.consecutiveFails++;
            const questionType = classifySymbolType(questionElement);

            if (config.enableConsoleLogs) {
                const backgroundAnswers = links.filter(link => classifySymbolType(link) === SYMBOL_TYPES.BACKGROUND_CIRCLE).length;
                const svgAnswers = links.filter(link => link.querySelector('svg')).length;
                console.log(`🔍 No high-confidence match found. Question: ${questionType}, SVG answers: ${svgAnswers}, Image answers: ${backgroundAnswers}, waiting...`);
            }

            // If multiple consecutive fails, take longer break
            if (state.consecutiveFails > 3) {
                if (config.enableConsoleLogs) console.log("⚠️ Multiple fails detected, extended cooldown");
                startCooldown(15000);
                state.consecutiveFails = 0;
            }
        }

        // Perform random actions occasionally
        if (Math.random() < 0.2) {
            performRandomScroll();
        }

    } catch (error) {
        if (config.enableConsoleLogs) console.log("❌ Error in solver:", error);
        state.consecutiveFails++;
    }
}

// Stealth initialization
function stealthInit() {
    if (config.hideScriptPresence) {
        const originalQuery = Document.prototype.querySelector;
        Document.prototype.querySelector = function(...args) {
            const result = originalQuery.apply(this, args);
            if (result && result.tagName === 'SCRIPT' && result.src.includes('tampermonkey')) {
                return null;
            }
            return result;
        };
    }

    if (config.randomUserAgent && Math.random() < 0.3) {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        ];
        Object.defineProperty(navigator, 'userAgent', {
            get: () => userAgents[Math.floor(Math.random() * userAgents.length)]
        });
    }
}

// Advanced initialization
function advancedInit() {
    stealthInit();

    // Initialize login system first
    initLogin();

    if (config.enableConsoleLogs) {
        console.log("🎮 Advanced Auto-Solver Pro v3.4 with Auto-Login Initialized!");
        console.log("🔧 Features: PERFECT ACCURACY, Background image support, All symbol types, Auto-Login, Auto-Refresh");
        console.log("✅ Intentional misses: DISABLED");
        console.log("🎯 Accuracy mode: Always perfect");
        console.log("🖼️ Background image matching: ENABLED");
        console.log("🔐 Auto-login: ENABLED");
        console.log("🔄 Auto-refresh on login page: ENABLED");
    }

    // Session management
    setInterval(() => {
        state.clickCount = Math.max(0, state.clickCount - config.maxClicksPerMinute);

        if (Date.now() - state.sessionStartTime > config.maxSessionLength && config.sessionRotation) {
            if (config.enableConsoleLogs) console.log("🔄 Session rotation");
            state.sessionStartTime = Date.now();
            state.clickCount = 0;
            startCooldown(30000);
        }
    }, 60000);

    // Start solver with progressive delays - only if logged in
    let currentDelay = getSmartDelay();
    const solverInterval = setInterval(() => {
        if (state.isRunning && !state.isInCooldown && loginState.isLoggedIn) {
            advancedSolveSymbolGame();
            currentDelay = getSmartDelay();
        }
    }, currentDelay);

    // Enhanced keyboard controls
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+X - Toggle solver
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            state.isRunning = !state.isRunning;
            if (config.enableConsoleLogs) {
                console.log(state.isRunning ? "▶️ Solver Resumed" : "⏸️ Solver Paused");
            }
            e.preventDefault();
        }
        // Ctrl+Shift+C - Force cooldown
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            startCooldown();
            e.preventDefault();
        }
        // Ctrl+Shift+R - Reset counters
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            state.clickCount = 0;
            state.totalSolved = 0;
            state.consecutiveRounds = 0;
            state.consecutiveFails = 0;
            if (config.enableConsoleLogs) console.log("🔄 Counters reset");
            e.preventDefault();
        }
        // Ctrl+Shift+I - Debug info
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            const questionElement = document.querySelector("svg") ? document.querySelector("svg").closest('div') || document.querySelector("svg") : document.querySelector('div[style*="background-image"]');
            const questionType = classifySymbolType(questionElement);
            const links = Array.from(document.querySelectorAll("a[href*='adsha.re'], a[href*='symbol-matching-game']"));
            const backgroundAnswers = links.filter(link => classifySymbolType(link) === SYMBOL_TYPES.BACKGROUND_CIRCLE).length;
            const svgAnswers = links.filter(link => link.querySelector('svg')).length;

            console.log("🔍 DEBUG: ", {
                questionType,
                totalAnswers: links.length,
                svgAnswers,
                backgroundAnswers,
                currentState: { ...state },
                loginState: { ...loginState }
            });
            e.preventDefault();
        }
        // Ctrl+Shift+L - Force login
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            if (!loginState.isLoggingIn) {
                loginState.loginAttempts = 0;
                forceLogin();
            }
            e.preventDefault();
        }
    });

    // Simulate tab activity
    if (config.tabActivity) {
        setInterval(() => {
            if (document.hidden && Math.random() < 0.3) {
                document.dispatchEvent(new Event('visibilitychange'));
            }
        }, 60000);
    }

    // Page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            state.lastActionTime = Date.now();
        }
    });
}

// Start the advanced script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', advancedInit);
} else {
    advancedInit();
}
})();