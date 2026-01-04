// ==UserScript==
// @name         Upwork Job Analyzer & Cover Letter Generator
// @namespace    http://fiverr.com/web_coder_nsd
// @version      2.4
// @license      MIT
// @description  AI-powered job analysis to detect red flags and haram content
// @author       NoushadBug
// @match        https://www.upwork.com/nx/find-work/*
// @match        https://www.upwork.com/nx/search/jobs/*
// @match        https://www.upwork.com/jobs/*
// @match        https://www.upwork.com/nx/proposals/*
// @match        https://www.upwork.com/nx/proposals/job/*apply/*
// @match        https://www.upwork.com/nx/proposals/job/*accept
// @icon         https://www.upwork.com/favicon.ico
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/553086/Upwork%20Job%20Analyzer%20%20Cover%20Letter%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/553086/Upwork%20Job%20Analyzer%20%20Cover%20Letter%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'gemini_api_key',
        ANALYSIS_DELAY: 1000,
        RED_FLAG_THRESHOLD: 2,
        PAGE_READY_CHECK_INTERVAL: 500,
        PAGE_READY_TIMEOUT: 30000
    };

    // DOM Selectors - Centralized for easy updates when Upwork changes their DOM
    const SELECTORS = {
        // Cloudflare challenge selectors
        cloudflareChallenge: [
            '#challenge-running',
            '#challenge-stage',
            '.cf-browser-verification',
            '#cf-content',
            '#trk_jschal_js',
            '.cf-error-details',
            '#challenge-form',
            '.ray-id',
            '#cf-wrapper',
            'iframe[src*="challenges.cloudflare.com"]',
            '[data-testid="cf-turnstile-container"]',
            '.cf-turnstile',
            'input[value="Verify you are human"]'
        ],

        // Upwork content selectors (to verify page is loaded)
        upworkContent: [
            'nav',
            '.nav-d-header',
            '[data-test="job-tile"]',
            '.job-details',
            '.fe-job-details',
            'main',
            '.air3-slider-content'
        ],

        // Apply button selectors (multiple fallbacks for different page types)
        applyButton: [
            'button[data-cy="submit-proposal-button"]',
            'button[id="submit-proposal-button"]',
            'button[aria-label="Apply now"]'
        ],

        // Job title selectors
        jobTitle: [
            'h4 span[data-v-90db81f6]',
            'h4 span[data-v-aa93715d]',
            'h4 .flex-1',
            'h1',
            'h2',
            'h3',
            'h4'
        ],

        // Job description selectors
        jobDescription: [
            'div[data-v-f3c6042e] p[data-v-f3c6042e]',
            'div[data-test="Description"] p[data-v-af7e59e9]',
            '[data-test="Description"] p'
        ],

        // Budget selectors
        budget: [
            'strong[data-v-2546b8da]',
            'strong[data-v-801afba5]',
            'li[data-cy="fixed-price"] strong'
        ],

        // Project type selectors
        projectType: [
            'li[data-v-f5229a36] .description',
            'li[data-v-52956d3e] .description',
            'li[data-cy="fixed-price"] .description'
        ],

        // Experience level selectors
        experienceLevel: [
            'li[data-v-f5229a36] strong',
            'li[data-v-52956d3e] strong',
            'li[data-cy="expertise"] strong'
        ],

        // Skills selectors
        skills: [
            'a[class*="air3-badge"]'
        ],

        // Client info selectors
        clientRating: [
            '.air3-rating-value-text'
        ],
        clientSpent: [
            '[data-qa="client-spend"] span'
        ],
        clientHireRate: [
            '[data-qa="client-job-posting-stats"] div'
        ],

        // Activity selectors
        activityItems: [
            '.ca-item'
        ],

        // Posted time selectors
        postedTime: [
            '.text-light-on-muted span'
        ],

        // Location selectors
        location: [
            '[data-v-7961f0b4] p',
            '[data-v-e2247b69] p',
            '.d-inline-flex p'
        ],

        // Modal and container selectors
        modalContent: [
            '.air3-slider-content[modaltitle="Job Details"]',
            '.air3-slider-content',
            '[role="dialog"]',
            '.modal-content'
        ],
        jobDetails: [
            '.job-details-content',
            '.job-details',
            '.details-content',
            '.content'
        ],

        // Job UID selector
        jobUid: [
            '[job-uid]'
        ],

        // General selectors
        h4: [
            'h4'
        ]
    };

    // Helper function to find elements using selector arrays
    function findElement(selectorArray, context = document) {
        for (const selector of selectorArray) {
            try {
                const element = context.querySelector(selector);
                if (element) {
                    return element;
                }
            } catch (e) {
                // Invalid selector, skip it
                console.warn('Invalid selector skipped:', selector);
            }
        }
        return null;
    }

    // Helper function to find all elements using selector arrays
    function findElements(selectorArray, context = document) {
        for (const selector of selectorArray) {
            try {
                const elements = context.querySelectorAll(selector);
                if (elements.length > 0) {
                    return elements;
                }
            } catch (e) {
                // Invalid selector, skip it
                console.warn('Invalid selector skipped:', selector);
            }
        }
        return [];
    }

    // Check if Cloudflare challenge is present (ULTRA MINIMAL - avoid triggering CF)
    function isCloudflareChallenge() {
        // ONLY check title - safest possible check
        const title = document.title.toLowerCase();
        return title.includes('just a moment') ||
               title.includes('attention required') ||
               title.includes('checking') ||
               title.includes('security') ||
               title === '' ||
               title === 'upwork';  // Sometimes CF shows blank or just "Upwork" during challenge
    }

    // Check if Upwork content is loaded
    function isUpworkContentLoaded() {
        // Only check for nav - single query
        return !!document.querySelector('nav');
    }

    // Check if page is ready
    function isPageReady() {
        if (isCloudflareChallenge()) {
            return false;
        }
        return isUpworkContentLoaded();
    }

    // Gemini Client Class - tries multiple models for reliability
    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            this.models = [
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.5-pro',
                'gemini-2.5-flash-lite',
                'gemini-1.5-flash'
            ];
        }

        async init() {
            let apiKey = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!apiKey) {
                apiKey = prompt('Please enter your Gemini API key:');
                if (!apiKey) {
                    throw new Error('API key is required');
                }
                localStorage.setItem(CONFIG.STORAGE_KEY, apiKey);
            }
            this.apiKey = apiKey;
        }

        async generateContent(prompt) {
            if (!this.apiKey) {
                await this.init();
            }

            // Try each model in order until one works
            for (const model of this.models) {
                try {
                    console.log(`Upwork Job Analyzer: Trying model ${model}...`);

                    const response = await fetch(
                        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }]
                            })
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            console.log(`Upwork Job Analyzer: Success with model ${model}`);
                            return text;
                        }
                    } else if (response.status === 429) {
                        console.warn(`Upwork Job Analyzer: Rate limited on ${model}, trying next...`);
                    } else {
                        console.warn(`Upwork Job Analyzer: ${model} returned status ${response.status}, trying next...`);
                    }
                } catch (error) {
                    console.warn(`Upwork Job Analyzer: Model ${model} failed:`, error.message);
                }
            }

            throw new Error('All Gemini models failed. Check your API key or try again later.');
        }
    }

    // State management
    let isAnalyzing = false;
    let currentJobId = null;
    let analysisResults = null;
    let geminiClient = null;
    let loadingIndicator = null;
    let lastDisplayedResults = null; // Store results for re-insertion
    let displayObserver = null; // Observer to detect removal

    // Initialize the script
    function init() {
        console.log('Upwork Job Analyzer: Initializing...');

        geminiClient = new GeminiClient();

        if (isProposalApplicationPage()) {
            console.log('Proposal application page detected, setting up cover letter feature...');
            setupCoverLetterFeature();
        } else {
            setupMutationObserver();
            checkForExistingAnalysis();
        }

        setupApiKeyConfig();
    }

    // Set up mutation observer to detect Apply button
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            // Skip if Cloudflare challenge is showing
            if (isCloudflareChallenge()) {
                return;
            }

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const applyButton = findElement(SELECTORS.applyButton, node);

                            if (node.tagName === 'BUTTON' &&
                                (node.textContent.includes('Apply now') ||
                                    node.getAttribute('data-cy') === 'submit-proposal-button' ||
                                    node.getAttribute('id') === 'submit-proposal-button')) {
                                console.log('Apply button detected, starting analysis...');
                                startJobAnalysis();
                            } else if (applyButton && applyButton.textContent.includes('Apply now')) {
                                console.log('Apply button detected, starting analysis...');
                                startJobAnalysis();
                            }

                            if (node.classList && node.classList.contains('air3-slider-content')) {
                                console.log('Modal content detected, checking for job details...');
                                setTimeout(() => {
                                    if (isJobDetailsPage()) {
                                        startJobAnalysis();
                                    }
                                }, 500);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Check for existing analysis on page load
    function checkForExistingAnalysis() {
        const jobId = extractJobId();
        if (jobId && jobId !== currentJobId) {
            currentJobId = jobId;

            const existingApplyButton = findElement(SELECTORS.applyButton);

            if (existingApplyButton) {
                console.log('Apply button found on page load, starting analysis...');
                setTimeout(() => {
                    startJobAnalysis();
                }, CONFIG.ANALYSIS_DELAY);
            }
        }
    }

    // Check if we're on a job details page
    function isJobDetailsPage() {
        return window.location.pathname.includes('/details/') ||
            window.location.pathname.includes('/jobs/');
    }

    // Extract job ID from URL
    function extractJobId() {
        let match = window.location.pathname.match(/\/details\/([^\/]+)/);
        if (match) {
            return match[1];
        }

        match = window.location.pathname.match(/\/jobs\/([^\/]+)/);
        if (match) {
            return match[1];
        }

        const jobUidElement = findElement(SELECTORS.jobUid);
        if (jobUidElement) {
            return jobUidElement.getAttribute('job-uid');
        }

        return null;
    }

    // Start job analysis
    async function startJobAnalysis() {
        if (isAnalyzing) {
            console.log('Analysis already in progress, skipping...');
            return;
        }

        // Double-check we're not on Cloudflare challenge
        if (isCloudflareChallenge()) {
            console.log('Cloudflare challenge detected, skipping analysis...');
            return;
        }

        const jobId = extractJobId();
        if (!jobId) {
            console.log('No job ID found, skipping analysis');
            return;
        }

        currentJobId = jobId;
        isAnalyzing = true;

        showLoadingIndicator('Analyzing job...');

        try {
            console.log('Starting job analysis...');
            updateLoadingStatus('Extracting job data...');

            const jobData = extractJobData();
            if (!jobData) {
                throw new Error('Failed to extract job data');
            }

            const hasHires = checkIfAlreadyHired(jobData);
            if (hasHires) {
                hideLoadingIndicator();
                displayAlreadyHiredMessage(jobData);
                return;
            }

            updateLoadingStatus('Performing AI analysis...');
            const aiAnalysis = await performAIAnalysis(jobData);

            updateLoadingStatus('Analyzing red flags...');
            const redFlags = analyzeRedFlags(jobData);

            analysisResults = {
                jobId,
                jobData,
                aiAnalysis,
                redFlags,
                timestamp: Date.now()
            };

            updateLoadingStatus('Displaying results...');
            displayAnalysisResults(analysisResults);
            hideLoadingIndicator();

        } catch (error) {
            console.error('Job analysis failed:', error);
            showErrorOnLoadingIndicator('Analysis failed: ' + error.message);
        } finally {
            isAnalyzing = false;
        }
    }

    // Extract job data from DOM
    function extractJobData() {
        try {
            const jobData = {
                title: '',
                description: '',
                budget: '',
                projectType: '',
                experienceLevel: '',
                skills: [],
                clientInfo: {},
                activity: {},
                postedTime: '',
                location: ''
            };

            const isDetailsPage = window.location.pathname.includes('/details/');
            const isJobsPage = window.location.pathname.includes('/jobs/');

            const titleElement = findElement(SELECTORS.jobTitle);
            if (titleElement) {
                jobData.title = titleElement.textContent.trim();
            }

            const descriptionElement = findElement(SELECTORS.jobDescription);
            if (descriptionElement) {
                jobData.description = descriptionElement.textContent.trim();
            }

            const budgetElement = findElement(SELECTORS.budget);
            if (budgetElement) {
                jobData.budget = budgetElement.textContent.trim();
            }

            const projectTypeElement = findElement(SELECTORS.projectType);
            if (projectTypeElement) {
                jobData.projectType = projectTypeElement.textContent.trim();
            }

            const experienceElements = findElements(SELECTORS.experienceLevel);
            for (const element of experienceElements) {
                if (element.textContent.includes('Intermediate') ||
                    element.textContent.includes('Expert') ||
                    element.textContent.includes('Entry')) {
                    jobData.experienceLevel = element.textContent.trim();
                    break;
                }
            }

            const skillElements = findElements(SELECTORS.skills);
            skillElements.forEach(element => {
                const skillText = element.textContent.trim();
                if (skillText && !jobData.skills.includes(skillText)) {
                    jobData.skills.push(skillText);
                }
            });

            const clientRating = findElement(SELECTORS.clientRating);
            if (clientRating) {
                jobData.clientInfo.rating = clientRating.textContent.trim();
            }

            const clientSpent = findElement(SELECTORS.clientSpent);
            if (clientSpent) {
                jobData.clientInfo.totalSpent = clientSpent.textContent.trim();
            }

            const clientHireRate = findElement(SELECTORS.clientHireRate);
            if (clientHireRate) {
                jobData.clientInfo.hireRate = clientHireRate.textContent.trim();
            }

            const activityItems = findElements(SELECTORS.activityItems);
            activityItems.forEach(item => {
                const title = item.querySelector('.title');
                const value = item.querySelector('.value');
                if (title && value) {
                    const titleText = title.textContent.trim().toLowerCase();
                    const valueText = value.textContent.trim();

                    if (titleText.includes('proposals')) {
                        jobData.activity.proposals = valueText;
                    } else if (titleText.includes('hires')) {
                        jobData.activity.hires = valueText;
                    } else if (titleText.includes('interviewing')) {
                        jobData.activity.interviewing = valueText;
                    } else if (titleText.includes('invites sent')) {
                        jobData.activity.invitesSent = valueText;
                    } else if (titleText.includes('unanswered invites')) {
                        jobData.activity.unansweredInvites = valueText;
                    }
                }
            });

            const postedElement = findElement(SELECTORS.postedTime);
            if (postedElement) {
                jobData.postedTime = postedElement.textContent.trim();
            }

            const locationElement = findElement(SELECTORS.location);
            if (locationElement) {
                jobData.location = locationElement.textContent.trim();
            }

            console.log('Extracted job data:', jobData);
            return jobData;

        } catch (error) {
            console.error('Error extracting job data:', error);
            return null;
        }
    }

    // Perform AI analysis using Gemini
    async function performAIAnalysis(jobData) {
        try {
            const prompt = createAnalysisPrompt(jobData);
            const content = await geminiClient.generateContent(prompt);
            return parseAIResponse(content);

        } catch (error) {
            console.error('AI analysis failed:', error);
            throw error;
        }
    }

    // Create analysis prompt for Gemini
    function createAnalysisPrompt(jobData) {
        return `Analyze this Upwork job posting for haram (religiously prohibited) content and provide a comprehensive assessment.

Job Title: ${jobData.title}
Description: ${jobData.description}
Budget: ${jobData.budget}
Skills: ${jobData.skills.join(', ')}
Location: ${jobData.location}

Please analyze and respond in the following JSON format:
{
  "summary": "One-line job summary",
  "requirements": ["Key requirement 1", "Key requirement 2", "Key requirement 3"],
  "haramContent": {
    "detected": true/false,
    "categories": ["gambling", "adult", "music", "trading", "other"],
    "reasoning": "Detailed explanation of why content is haram",
    "severity": "high/medium/low"
  },
  "recommendation": "Avoid/Review/Proceed",
  "confidence": 0.95
}

Focus on detecting:
- Gambling, betting, or casino-related content
- Adult content or inappropriate material
- Music production or entertainment industry work
- Trading, forex, or financial speculation
- Any other content that may be religiously prohibited

Be thorough but fair in your analysis.`;
    }

    // Parse AI response
    function parseAIResponse(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                return {
                    summary: content.split('\n')[0] || 'Analysis completed',
                    requirements: [],
                    haramContent: {
                        detected: content.toLowerCase().includes('haram') || content.toLowerCase().includes('avoid'),
                        categories: [],
                        reasoning: content,
                        severity: 'medium'
                    },
                    recommendation: content.toLowerCase().includes('avoid') ? 'Avoid' : 'Review',
                    confidence: 0.5
                };
            }
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return {
                summary: 'Analysis completed',
                requirements: [],
                haramContent: {
                    detected: false,
                    categories: [],
                    reasoning: 'Unable to parse AI response',
                    severity: 'low'
                },
                recommendation: 'Review',
                confidence: 0.1
            };
        }
    }

    // Analyze red flags
    function analyzeRedFlags(jobData) {
        const redFlags = [];

        if (jobData.activity.proposals) {
            const proposalText = jobData.activity.proposals.toLowerCase();

            let proposalCount = 0;
            if (proposalText.includes('less than 5')) {
                proposalCount = 2;
                redFlags.push({
                    type: 'low_competition',
                    message: 'Low competition - good opportunity',
                    severity: 'positive'
                });
            } else if (proposalText.includes('5 to 15')) {
                proposalCount = 10;
                redFlags.push({
                    type: 'high_competition',
                    message: `High competition: ${jobData.activity.proposals} proposals`,
                    severity: 'high'
                });
            } else if (proposalText.includes('10 to 15')) {
                proposalCount = 12;
                redFlags.push({
                    type: 'high_competition',
                    message: `High competition: ${jobData.activity.proposals} proposals`,
                    severity: 'high'
                });
            } else if (proposalText.includes('15 to 20')) {
                proposalCount = 17;
                redFlags.push({
                    type: 'high_competition',
                    message: `Very high competition: ${jobData.activity.proposals} proposals`,
                    severity: 'high'
                });
            } else if (proposalText.includes('20 to 50')) {
                proposalCount = 35;
                redFlags.push({
                    type: 'very_high_competition',
                    message: `Extremely high competition: ${jobData.activity.proposals} proposals`,
                    severity: 'high'
                });
            } else if (proposalText.includes('50+')) {
                proposalCount = 50;
                redFlags.push({
                    type: 'extreme_competition',
                    message: `Extreme competition: ${jobData.activity.proposals} proposals`,
                    severity: 'high'
                });
            } else {
                const numberMatch = proposalText.match(/(\d+)/);
                if (numberMatch) {
                    proposalCount = parseInt(numberMatch[1]);
                    if (proposalCount > 5) {
                        redFlags.push({
                            type: 'high_competition',
                            message: `High competition: ${jobData.activity.proposals} proposals`,
                            severity: proposalCount > 15 ? 'high' : 'medium'
                        });
                    }
                }
            }
        }

        if (jobData.budget) {
            const budget = parseFloat(jobData.budget.replace(/[^0-9.]/g, ''));
            if (budget < 50) {
                redFlags.push({
                    type: 'extremely_low_budget',
                    message: `Extremely low budget: ${jobData.budget}`,
                    severity: 'high'
                });
            } else if (budget < 100) {
                redFlags.push({
                    type: 'very_low_budget',
                    message: `Very low budget: ${jobData.budget}`,
                    severity: 'high'
                });
            } else if (budget < 500) {
                redFlags.push({
                    type: 'low_budget',
                    message: `Low budget: ${jobData.budget}`,
                    severity: 'medium'
                });
            }
        }

        if (jobData.clientInfo.rating) {
            const rating = parseFloat(jobData.clientInfo.rating);
            if (rating < 3.0) {
                redFlags.push({
                    type: 'very_low_client_rating',
                    message: `Very low client rating: ${jobData.clientInfo.rating}`,
                    severity: 'high'
                });
            } else if (rating < 4.0) {
                redFlags.push({
                    type: 'low_client_rating',
                    message: `Low client rating: ${jobData.clientInfo.rating}`,
                    severity: 'medium'
                });
            }
        }

        if (jobData.clientInfo.hireRate) {
            const hireRateMatch = jobData.clientInfo.hireRate.match(/(\d+)%/);
            if (hireRateMatch) {
                const hireRate = parseInt(hireRateMatch[1]);
                if (hireRate < 20) {
                    redFlags.push({
                        type: 'very_low_hire_rate',
                        message: `Very low hire rate: ${hireRate}% - client rarely hires`,
                        severity: 'high'
                    });
                } else if (hireRate < 50) {
                    redFlags.push({
                        type: 'low_hire_rate',
                        message: `Low hire rate: ${hireRate}% - client is selective`,
                        severity: 'medium'
                    });
                }
            }
        }

        if (jobData.clientInfo.totalSpent) {
            const spentText = jobData.clientInfo.totalSpent.toLowerCase();
            const spentMatch = spentText.match(/\$([0-9.]+)([km]?)/);
            if (spentMatch) {
                let spent = parseFloat(spentMatch[1]);
                const unit = spentMatch[2];
                if (unit === 'k') spent *= 1000;
                if (unit === 'm') spent *= 1000000;

                if (spent < 100) {
                    redFlags.push({
                        type: 'low_client_spend',
                        message: `Low client spending: ${jobData.clientInfo.totalSpent} - new or inactive client`,
                        severity: 'medium'
                    });
                }
            }
        }

        const urgentKeywords = ['urgent', 'asap', 'immediately', 'right now', 'today', 'tonight', 'rush'];
        const descriptionLower = jobData.description.toLowerCase();
        const urgentFound = urgentKeywords.some(keyword => descriptionLower.includes(keyword));
        if (urgentFound) {
            redFlags.push({
                type: 'urgent_timeline',
                message: 'Urgent timeline - may indicate poor planning or unrealistic expectations',
                severity: 'medium'
            });
        }

        if (jobData.description.length < 100) {
            redFlags.push({
                type: 'very_vague_requirements',
                message: 'Extremely short description - requirements are unclear',
                severity: 'high'
            });
        } else if (jobData.description.length < 200) {
            redFlags.push({
                type: 'vague_requirements',
                message: 'Short description - requirements may be unclear',
                severity: 'medium'
            });
        }

        if (jobData.skills.length > 10) {
            redFlags.push({
                type: 'too_many_skills',
                message: `Too many required skills (${jobData.skills.length}) - may indicate scope creep`,
                severity: 'medium'
            });
        }

        if (jobData.experienceLevel && jobData.budget) {
            const budget = parseFloat(jobData.budget.replace(/[^0-9.]/g, ''));
            const isExpert = jobData.experienceLevel.toLowerCase().includes('expert');
            const isIntermediate = jobData.experienceLevel.toLowerCase().includes('intermediate');

            if (isExpert && budget < 1000) {
                redFlags.push({
                    type: 'expert_low_budget',
                    message: `Expert level required but low budget: ${jobData.budget}`,
                    severity: 'high'
                });
            } else if (isIntermediate && budget < 200) {
                redFlags.push({
                    type: 'intermediate_low_budget',
                    message: `Intermediate level required but very low budget: ${jobData.budget}`,
                    severity: 'medium'
                });
            }
        }

        if (jobData.location) {
            const locationLower = jobData.location.toLowerCase();
            const problematicLocations = ['russia', 'iran', 'north korea', 'cuba'];
            if (problematicLocations.some(loc => locationLower.includes(loc))) {
                redFlags.push({
                    type: 'problematic_location',
                    message: `Client location may have payment restrictions: ${jobData.location}`,
                    severity: 'medium'
                });
            }
        }

        if (jobData.activity.interviewing) {
            const interviewing = parseInt(jobData.activity.interviewing);
            if (interviewing > 5) {
                redFlags.push({
                    type: 'many_interviews',
                    message: `Many people being interviewed (${interviewing}) - high competition`,
                    severity: 'medium'
                });
            }
        }

        return redFlags;
    }

    // Check if job already has hires
    function checkIfAlreadyHired(jobData) {
        if (jobData.activity.hires) {
            const hires = parseInt(jobData.activity.hires);
            return hires > 0;
        }
        return false;
    }

    // Display already hired message
    function displayAlreadyHiredMessage(jobData) {
        const existingDisplay = document.getElementById('upwork-job-analyzer');
        if (existingDisplay) {
            existingDisplay.remove();
        }

        const alreadyHiredDisplay = createAlreadyHiredDisplay(jobData);

        // Store for re-insertion - create a fake results object
        lastDisplayedResults = { isAlreadyHired: true, jobData: jobData };

        insertAlreadyHiredDisplay(alreadyHiredDisplay);

        // Start monitoring for removal
        startDisplayMonitor();
    }

    // Insert already hired display
    function insertAlreadyHiredDisplay(alreadyHiredDisplay) {
        let inserted = false;

        const jobTitle = findElement(SELECTORS.jobTitle) || findElement(SELECTORS.h4);
        if (jobTitle && jobTitle.parentNode) {
            jobTitle.parentNode.parentNode.insertBefore(alreadyHiredDisplay, jobTitle.parentNode.nextSibling);
            inserted = true;
        }

        if (!inserted) {
            const modalContent = findElement(SELECTORS.modalContent);
            if (modalContent) {
                const modalJobTitle = findElement(SELECTORS.jobTitle, modalContent) || findElement(SELECTORS.h4, modalContent);
                if (modalJobTitle && modalJobTitle.parentNode) {
                    modalJobTitle.parentNode.insertBefore(alreadyHiredDisplay, modalJobTitle.nextSibling);
                    inserted = true;
                } else {
                    modalContent.insertBefore(alreadyHiredDisplay, modalContent.firstChild);
                    inserted = true;
                }
            }
        }

        if (!inserted) {
            const jobDetails = findElement(SELECTORS.jobDetails);
            if (jobDetails) {
                jobDetails.insertBefore(alreadyHiredDisplay, jobDetails.firstChild);
                inserted = true;
            }
        }

        if (!inserted) {
            const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.body;
            mainContent.insertBefore(alreadyHiredDisplay, mainContent.firstChild);
        }

        return inserted;
    }

    // Create already hired display component
    function createAlreadyHiredDisplay(jobData) {
        const container = document.createElement('div');
        container.id = 'upwork-job-analyzer';

        const themeColors = getThemeColors();

        container.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #f44336;
            background: #ffebee;
            color: ${themeColors.text};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const hires = parseInt(jobData.activity.hires);

        container.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: #f44336; margin-right: 10px;"></div>
                <h3 style="margin: 0; color: #d32f2f;">⚠️ Job Already Hired</h3>
            </div>

            <div style="margin-bottom: 15px; padding: 15px; background: #ffcdd2; border-left: 4px solid #f44336; border-radius: 4px;">
                <strong style="color: #d32f2f; font-size: 1.1em;">DO NOT RECOMMEND</strong>
                <div style="margin-top: 10px; color: #666;">
                    This job has already hired <strong>${hires} freelancer(s)</strong>.
                    The position may be filled or the client is looking for additional freelancers for a larger project.
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <strong>Recommendation:</strong>
                <span style="color: #f44336; font-weight: bold;">AVOID</span>
                <div style="margin-top: 5px; color: #666; font-size: 0.9em;">
                    This job is not recommended as it has already hired freelancers.
                </div>
            </div>

            <div style="font-size: 0.8em; color: #666; border-top: 1px solid #ffcdd2; padding-top: 10px;">
                Analysis completed at ${new Date().toLocaleTimeString()}
            </div>
        `;

        return container;
    }

    // Show loading indicator
    function showLoadingIndicator(message) {
        hideLoadingIndicator();

        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'upwork-analyzer-loading';

        const themeColors = getThemeColors();

        loadingIndicator.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #2196f3;
            background: ${themeColors.background};
            color: ${themeColors.text};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            overflow: hidden;
        `;

        loadingIndicator.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: #2196f3; margin-right: 10px; animation: pulse 1.5s ease-in-out infinite;"></div>
                <h3 style="margin: 0; color: ${themeColors.text};">🔍 Job Analysis in Progress</h3>
            </div>

            <div style="margin-bottom: 15px;">
                <div id="loading-status" style="color: #2196f3; font-weight: 500;">${message}</div>
                <div style="margin-top: 10px; width: 100%; height: 4px; background: #e3f2fd; border-radius: 2px; overflow: hidden;">
                    <div id="loading-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #2196f3, #64b5f6); border-radius: 2px; animation: loading 2s ease-in-out infinite;"></div>
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes loading {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            </style>
        `;

        let inserted = false;

        const jobTitle = findElement(SELECTORS.jobTitle) || findElement(SELECTORS.h4);
        if (jobTitle && jobTitle.parentNode) {
            jobTitle.parentNode.insertBefore(loadingIndicator, jobTitle.nextSibling);
            inserted = true;
        }

        if (!inserted) {
            const modalContent = findElement(SELECTORS.modalContent);
            if (modalContent) {
                const modalJobTitle = findElement(SELECTORS.jobTitle, modalContent) || findElement(SELECTORS.h4, modalContent);
                if (modalJobTitle && modalJobTitle.parentNode) {
                    modalJobTitle.parentNode.insertBefore(loadingIndicator, modalJobTitle.nextSibling);
                    inserted = true;
                } else {
                    modalContent.insertBefore(loadingIndicator, modalContent.firstChild);
                    inserted = true;
                }
            }
        }

        if (!inserted) {
            const jobDetails = findElement(SELECTORS.jobDetails);
            if (jobDetails) {
                jobDetails.insertBefore(loadingIndicator, jobDetails.firstChild);
                inserted = true;
            }
        }

        if (!inserted) {
            const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.body;
            mainContent.insertBefore(loadingIndicator, mainContent.firstChild);
        }
    }

    // Update loading status
    function updateLoadingStatus(message) {
        if (loadingIndicator) {
            const statusElement = loadingIndicator.querySelector('#loading-status');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        if (loadingIndicator && loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
            loadingIndicator = null;
        }
    }

    // Show error on loading indicator
    function showErrorOnLoadingIndicator(message) {
        if (loadingIndicator) {
            const themeColors = getThemeColors();
            loadingIndicator.style.borderColor = '#f44336';
            loadingIndicator.style.background = '#ffebee';

            loadingIndicator.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 20px; height: 20px; border-radius: 50%; background: #f44336; margin-right: 10px;"></div>
                    <h3 style="margin: 0; color: #d32f2f;">❌ Analysis Failed</h3>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: #ffcdd2; border-left: 4px solid #f44336; border-radius: 4px;">
                    <div style="color: #d32f2f; font-weight: 500;">${message}</div>
                </div>

                <div style="font-size: 0.8em; color: #666; border-top: 1px solid #ffcdd2; padding-top: 10px;">
                    Failed at ${new Date().toLocaleTimeString()}
                </div>
            `;
        }
    }

    // Display analysis results
    function displayAnalysisResults(results) {
        const existingDisplay = document.getElementById('upwork-job-analyzer');
        if (existingDisplay) {
            existingDisplay.remove();
        }

        // Store for re-insertion if removed
        lastDisplayedResults = results;

        const analysisDisplay = createAnalysisDisplay(results);

        insertAnalysisDisplay(analysisDisplay);

        // Start monitoring for removal
        startDisplayMonitor();
    }

    // Insert analysis display into DOM
    function insertAnalysisDisplay(analysisDisplay) {
        let inserted = false;

        const jobTitle = findElement(SELECTORS.jobTitle) || findElement(SELECTORS.h4);
        if (jobTitle && jobTitle.parentNode) {
            jobTitle.parentNode.parentNode.insertBefore(analysisDisplay, jobTitle.parentNode.nextSibling);
            inserted = true;
        }

        if (!inserted) {
            const modalContent = findElement(SELECTORS.modalContent);
            if (modalContent) {
                const modalJobTitle = findElement(SELECTORS.jobTitle, modalContent) || findElement(SELECTORS.h4, modalContent);
                if (modalJobTitle && modalJobTitle.parentNode) {
                    modalJobTitle.parentNode.insertBefore(analysisDisplay, modalJobTitle.nextSibling);
                    inserted = true;
                } else {
                    modalContent.insertBefore(analysisDisplay, modalContent.firstChild);
                    inserted = true;
                }
            }
        }

        if (!inserted) {
            const jobDetails = findElement(SELECTORS.jobDetails);
            if (jobDetails) {
                jobDetails.insertBefore(analysisDisplay, jobDetails.firstChild);
                inserted = true;
            }
        }

        if (!inserted) {
            const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.body;
            mainContent.insertBefore(analysisDisplay, mainContent.firstChild);
        }

        return inserted;
    }

    // Monitor for display removal and re-insert
    function startDisplayMonitor() {
        // Stop existing observer
        if (displayObserver) {
            displayObserver.disconnect();
        }

        let reinsertTimeout = null;

        displayObserver = new MutationObserver(() => {
            // Check if our display was removed
            const existingDisplay = document.getElementById('upwork-job-analyzer');
            if (!existingDisplay && lastDisplayedResults) {
                // Debounce re-insertion
                if (reinsertTimeout) clearTimeout(reinsertTimeout);
                reinsertTimeout = setTimeout(() => {
                    // Make sure we're still on the same job
                    const currentUrl = window.location.href;
                    if (lastDisplayedResults.jobId && !currentUrl.includes(lastDisplayedResults.jobId)) {
                        stopDisplayMonitor();
                        return;
                    }

                    console.log('Upwork Job Analyzer: Display was removed, re-inserting...');

                    if (lastDisplayedResults.isAlreadyHired) {
                        const newDisplay = createAlreadyHiredDisplay(lastDisplayedResults.jobData);
                        insertAlreadyHiredDisplay(newDisplay);
                    } else {
                        const newDisplay = createAnalysisDisplay(lastDisplayedResults);
                        insertAnalysisDisplay(newDisplay);
                    }
                }, 100);
            }
        });

        displayObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Stop display monitor (call when navigating away)
    function stopDisplayMonitor() {
        if (displayObserver) {
            displayObserver.disconnect();
            displayObserver = null;
        }
        lastDisplayedResults = null;
    }

    // Create analysis display component
    function createAnalysisDisplay(results) {
        const container = document.createElement('div');
        container.id = 'upwork-job-analyzer';

        const themeColors = getThemeColors();

        container.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid ${themeColors.border};
            background: ${themeColors.background};
            color: ${themeColors.text};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const status = determineOverallStatus(results);
        const statusColor = getStatusColor(status);

        const redFlags = results.redFlags.filter(flag =>
            flag.severity === 'high' ||
            flag.type === 'already_hired' ||
            flag.type === 'extremely_low_budget' ||
            flag.type === 'very_low_client_rating' ||
            flag.type === 'expert_low_budget' ||
            flag.type === 'very_vague_requirements' ||
            flag.type === 'very_high_competition' ||
            flag.type === 'extreme_competition'
        );

        const warnings = results.redFlags.filter(flag =>
            flag.severity === 'medium' ||
            flag.severity === 'low'
        );

        container.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${statusColor}; margin-right: 10px;"></div>
                <h3 style="margin: 0; color: ${themeColors.text};">Job Analysis Results</h3>
            </div>

            <div style="margin-bottom: 15px;">
                <strong>Summary:</strong> ${results.aiAnalysis.summary}
            </div>

            <div style="margin-bottom: 15px;">
                <strong>Recommendation:</strong>
                <span style="color: ${statusColor}; font-weight: bold;">${results.aiAnalysis.recommendation}</span>
                <span style="margin-left: 10px; font-size: 0.9em; color: ${themeColors.muted};">
                    (Confidence: ${Math.round(results.aiAnalysis.confidence * 100)}%)
                </span>
            </div>

            ${results.aiAnalysis.haramContent.detected ? `
                <div style="margin-bottom: 15px; padding: 10px; background: ${themeColors.dangerBg}; border-left: 4px solid #f44336; border-radius: 4px;">
                    <strong style="color: #d32f2f;">⚠️ Haram Content Detected:</strong>
                    <div style="margin-top: 5px; color: ${themeColors.muted};">
                        <strong>Categories:</strong> ${results.aiAnalysis.haramContent.categories.join(', ')}
                    </div>
                    <div style="margin-top: 5px; color: ${themeColors.muted};">
                        <strong>Reasoning:</strong> ${results.aiAnalysis.haramContent.reasoning}
                    </div>
                </div>
            ` : ''}

            ${results.aiAnalysis.requirements.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong>Key Requirements:</strong>
                    <ul style="margin: 5px 0 0 20px; padding: 0;">
                        ${results.aiAnalysis.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${redFlags.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong>❌ Red Flags:</strong>
                    <ul style="margin: 5px 0 0 20px; padding: 0;">
                        ${redFlags.map(flag => `
                            <li style="color: ${getFlagColor(flag.severity)};">
                                ${flag.message}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${warnings.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong>⚠️ Warnings:</strong>
                    <ul style="margin: 5px 0 0 20px; padding: 0;">
                        ${warnings.map(flag => `
                            <li style="color: ${getFlagColor(flag.severity)};">
                                ${flag.message}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            <div style="font-size: 0.8em; color: ${themeColors.muted}; border-top: 1px solid ${themeColors.border}; padding-top: 10px;">
                Analysis completed at ${new Date().toLocaleTimeString()}
            </div>
        `;

        return container;
    }

    // Determine overall status
    function determineOverallStatus(results) {
        if (results.aiAnalysis.haramContent.detected) {
            return 'avoid';
        }

        const criticalFlags = results.redFlags.filter(flag =>
            flag.type === 'already_hired' ||
            flag.type === 'extremely_low_budget' ||
            flag.type === 'very_low_client_rating' ||
            flag.type === 'expert_low_budget' ||
            flag.type === 'very_vague_requirements'
        );

        if (criticalFlags.length > 0) {
            return 'avoid';
        }

        const highSeverityFlags = results.redFlags.filter(flag => flag.severity === 'high');
        if (highSeverityFlags.length > 0) {
            return 'review';
        }

        const mediumSeverityFlags = results.redFlags.filter(flag => flag.severity === 'medium');
        if (mediumSeverityFlags.length >= CONFIG.RED_FLAG_THRESHOLD) {
            return 'review';
        }

        const positiveFlags = results.redFlags.filter(flag => flag.severity === 'positive');
        if (positiveFlags.length > 0 && mediumSeverityFlags.length === 0) {
            return 'proceed';
        }

        return 'proceed';
    }

    // Get status color
    function getStatusColor(status) {
        switch (status) {
            case 'avoid': return '#f44336';
            case 'review': return '#ff9800';
            case 'proceed': return '#4caf50';
            default: return '#9e9e9e';
        }
    }

    // Get flag color
    function getFlagColor(severity) {
        switch (severity) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#ffc107';
            case 'positive': return '#4caf50';
            default: return '#666';
        }
    }

    // Get theme colors based on current Upwork theme
    function getThemeColors() {
        const isDarkTheme = document.documentElement.classList.contains('dark') ||
            document.body.classList.contains('dark') ||
            window.getComputedStyle(document.documentElement).getPropertyValue('--color-scheme') === 'dark' ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (isDarkTheme) {
            return {
                background: '#1a1a1a',
                text: '#ffffff',
                muted: '#b3b3b3',
                border: '#404040',
                dangerBg: '#2d1b1b'
            };
        } else {
            return {
                background: '#ffffff',
                text: '#333333',
                muted: '#666666',
                border: '#e0e0e0',
                dangerBg: '#ffebee'
            };
        }
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px;
            border-radius: 4px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Check if we're on a proposal application page
    function isProposalApplicationPage() {
        return (window.location.pathname.includes('/nx/proposals/job/') &&
            window.location.pathname.includes('/apply/')) ||
            window.location.pathname.includes('/nx/proposals/') &&
            window.location.pathname.includes('/accept');
    }

    // Set up cover letter feature
    function setupCoverLetterFeature() {
        setTimeout(() => {
            createCoverLetterButton();
        }, 2000);
    }

    // Create floating cover letter button
    function createCoverLetterButton() {
        const existingButton = document.getElementById('cover-letter-button');
        if (existingButton) {
            existingButton.remove();
        }

        const coverLetterButton = document.createElement('button');
        coverLetterButton.id = 'cover-letter-button';
        coverLetterButton.innerHTML = '📝';
        coverLetterButton.title = 'Generate Cover Letter';
        coverLetterButton.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #4caf50;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        coverLetterButton.addEventListener('mouseenter', () => {
            coverLetterButton.style.transform = 'scale(1.1)';
            coverLetterButton.style.background = '#45a049';
        });

        coverLetterButton.addEventListener('mouseleave', () => {
            coverLetterButton.style.transform = 'scale(1)';
            coverLetterButton.style.background = '#4caf50';
        });

        coverLetterButton.addEventListener('click', () => {
            showCoverLetterPrompt();
        });

        document.body.appendChild(coverLetterButton);
    }

    // Show cover letter prompt popup
    function showCoverLetterPrompt() {
        const userInstructions = prompt(
            'Cover Letter Instructions:\n\n' +
            'Enter any specific instructions for the cover letter generation.\n' +
            'Leave blank for default professional cover letter.\n\n' +
            'Examples:\n' +
            '- "Make it more technical and detailed"\n' +
            '- "Focus on my WordPress experience"\n' +
            '- "Keep it short and direct"\n' +
            '- "Emphasize my problem-solving skills"',
            ''
        );

        if (userInstructions !== null) {
            generateCoverLetter(userInstructions);
        }
    }

    // Generate cover letter using Gemini
    async function generateCoverLetter(userInstructions = '') {
        try {
            showCoverLetterLoading();

            const jobDetails = extractJobDetailsFromProposalPage();
            if (!jobDetails) {
                throw new Error('Could not extract job details from the page');
            }

            const coverLetter = await generateCoverLetterWithGemini(jobDetails, userInstructions);

            insertCoverLetterIntoTextarea(coverLetter);

            hideCoverLetterLoading();

        } catch (error) {
            console.error('Cover letter generation failed:', error);
            hideCoverLetterLoading();
            alert('Failed to generate cover letter: ' + error.message);
        }
    }

    // Extract job details from proposal page
    function extractJobDetailsFromProposalPage() {
        const jobDetailsElement = document.querySelector('.fe-job-details');
        if (!jobDetailsElement) {
            console.error('Job details element not found');
            return null;
        }

        const titleElement = jobDetailsElement.querySelector('h3');
        const title = titleElement ? titleElement.textContent.trim() : '';

        const descriptionElement = jobDetailsElement.querySelector('.description');
        const description = descriptionElement ? descriptionElement.textContent.trim() : '';

        const skillElements = jobDetailsElement.querySelectorAll('.air3-token');
        const skills = Array.from(skillElements).map(el => el.textContent.trim()).filter(skill => skill);

        const budgetElement = jobDetailsElement.querySelector('li[data-cy="fixed-price"] strong');
        const budget = budgetElement ? budgetElement.textContent.trim() : '';

        const experienceElement = jobDetailsElement.querySelector('li[data-cy="expertise"] strong');
        const experienceLevel = experienceElement ? experienceElement.textContent.trim() : '';

        const durationElement = jobDetailsElement.querySelector('li[data-test="fixed-duration"] strong');
        const duration = durationElement ? durationElement.textContent.trim() : '';

        return {
            title,
            description,
            skills,
            budget,
            experienceLevel,
            duration
        };
    }

    // Generate cover letter with Gemini
    async function generateCoverLetterWithGemini(jobDetails, userInstructions) {
        const prompt = createCoverLetterPrompt(jobDetails, userInstructions);
        return await geminiClient.generateContent(prompt);
    }

    // Create cover letter prompt for Gemini
    function createCoverLetterPrompt(jobDetails, userInstructions) {
        return `Generate a professional and convincing cover letter for this Upwork job proposal. The cover letter should be confident, simple, and to the point without being overly formal.

Job Details:
- Title: ${jobDetails.title}
- Description: ${jobDetails.description}
- Required Skills: ${jobDetails.skills.join(', ')}
- Budget: ${jobDetails.budget}
- Experience Level: ${jobDetails.experienceLevel}
- Duration: ${jobDetails.duration}

${userInstructions ? `Additional Instructions: ${userInstructions}` : ''}

Requirements for the cover letter:
1. Keep it professional but not overly formal
2. Show confidence without being arrogant
3. Be specific about relevant skills and experience
4. Address the client's needs directly
5. Keep it concise (2-3 paragraphs maximum)
6. Use a conversational but professional tone
7. Include a clear call to action
8. Don't mention specific rates or pricing
9. Focus on value proposition and problem-solving ability
10. My Name is Noushad. My prior skills are : I am Automation Geek | Google Apps Script, Chrome Extensions, Web Solutions & Userscript
I mostly focus on -
ㅤㅤ• Google Sheets automations that sync data, generate reports, and trigger alerts
ㅤㅤ• Gmail automation for parsing, labelling, routing, and smart replies
ㅤㅤ• Google Docs & Forms systems that auto-generate PDFs, proposals, and contracts
ㅤㅤ• Tampermonkey and Chrome Extensions to speed up admin work or scrape data
ㅤㅤ• Python & API integrations connecting Google Workspace, CRMs, and databases
ㅤㅤ• PHP or web related project!
11. Do not add Subject line to the cover letter.
12. Read properly what client has written, sometimes they put some terms and other words to mention in the cover so that they can understand whether the freelancer read the description or not, make sure to smartly add that.

Generate a compelling cover letter that will help win this project.`;
    }

    // Insert cover letter into textarea
    function insertCoverLetterIntoTextarea(coverLetter) {
        let textarea = document.querySelector('textarea');

        if (!textarea) {
            const alternativeTextareas = document.querySelectorAll('textarea');
            for (const ta of alternativeTextareas) {
                if (ta.placeholder && (
                    ta.placeholder.toLowerCase().includes('cover') ||
                    ta.placeholder.toLowerCase().includes('proposal') ||
                    ta.placeholder.toLowerCase().includes('message') ||
                    ta.placeholder.toLowerCase().includes('letter')
                )) {
                    textarea = ta;
                    break;
                }
            }
        }

        if (textarea) {
            textarea.value = '';
            textarea.value = coverLetter;

            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            textarea.focus();

            showCoverLetterSuccess();
        } else {
            throw new Error('Could not find textarea for cover letter');
        }
    }

    // Show cover letter loading indicator
    function showCoverLetterLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'cover-letter-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
        `;
        loadingDiv.innerHTML = `
            <div style="margin-bottom: 10px;">🤖</div>
            <div>Generating cover letter...</div>
        `;
        document.body.appendChild(loadingDiv);
    }

    // Hide cover letter loading indicator
    function hideCoverLetterLoading() {
        const loadingDiv = document.getElementById('cover-letter-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Show cover letter success message
    function showCoverLetterSuccess() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px;
            border-radius: 4px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 300px;
        `;
        successDiv.innerHTML = '✅ Cover letter generated and inserted successfully!';
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    // Setup API key configuration
    function setupApiKeyConfig() {
        const configButton = document.createElement('button');
        configButton.innerHTML = '⚙️';
        configButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #2196f3;
            color: white;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        configButton.addEventListener('click', () => {
            const currentKey = localStorage.getItem(CONFIG.STORAGE_KEY);
            const newKey = prompt(
                'Gemini API Key Configuration:\n\n' +
                'Current key: ' + (currentKey ? 'Set' : 'Not set') + '\n\n' +
                'Enter new API key (or leave blank to keep current):',
                currentKey || ''
            );

            if (newKey !== null) {
                if (newKey.trim()) {
                    localStorage.setItem(CONFIG.STORAGE_KEY, newKey.trim());
                    if (geminiClient) {
                        geminiClient.apiKey = newKey.trim();
                    }
                    alert('API key updated successfully!');
                } else if (currentKey) {
                    localStorage.removeItem(CONFIG.STORAGE_KEY);
                    if (geminiClient) {
                        geminiClient.apiKey = null;
                    }
                    alert('API key removed.');
                }
            }
        });

        document.body.appendChild(configButton);
    }

    // Wait for page to be ready (bypass Cloudflare challenge)
    function waitForPageReady() {
        // FIRST: Check if we're on Cloudflare challenge - if so, do NOTHING
        if (isCloudflareChallenge()) {
            // Completely silent during CF - just wait with long delay
            setTimeout(waitForPageReady, 3000);
            return;
        }

        // SECOND: Check if Upwork content is actually loaded
        if (!isUpworkContentLoaded()) {
            setTimeout(waitForPageReady, 2000);
            return;
        }

        // THIRD: Add extra delay after CF to ensure page is stable
        console.log('Upwork Job Analyzer: Page detected, waiting for stability...');
        setTimeout(() => {
            // Double-check CF isn't back
            if (isCloudflareChallenge()) {
                waitForPageReady();
                return;
            }

            console.log('Upwork Job Analyzer: Initializing...');
            init();
        }, 2000);
    }

    // Initialize when DOM is ready - with initial delay
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(waitForPageReady, 1000);
        });
    } else {
        setTimeout(waitForPageReady, 1000);
    }

})();