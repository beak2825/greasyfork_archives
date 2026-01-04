// ==UserScript==
// @name         Duolingo Booster
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Complete Duolingo farming tool with XP, Gems, Streak, Super, and Items
// @author       LucaN
// @match        https://*.duolingo.com/*
// @icon         https://www.duolingo.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560963/Duolingo%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/560963/Duolingo%20Booster.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =============================================================================
  // CONFIGURATION & CONSTANTS
  // =============================================================================

  const CONFIG = {
    apiBaseUrl: 'https://duoapi.smoteam.com/v1/duolingo',
    maxXP: 20000,
    maxGems: 10000,
    maxStreak: 1000,
    xpStep: 200,
    gemStep: 30,
  };

  const ENDPOINTS = {
    verifyLicense: `${CONFIG.apiBaseUrl}/verify-license`,
    addXp: `${CONFIG.apiBaseUrl}/add-xp`,
    farmXp: `${CONFIG.apiBaseUrl}/farm-xp`,
    claimGems: `${CONFIG.apiBaseUrl}/claim-gems`,
    farmGems: `${CONFIG.apiBaseUrl}/farm-gems`,
    farmGemsFast: `${CONFIG.apiBaseUrl}/farm-gems-fast`,
    farmStreak: `${CONFIG.apiBaseUrl}/farm-streak`,
    activateSuper: `${CONFIG.apiBaseUrl}/activate-super`,
    claimItem: `${CONFIG.apiBaseUrl}/claim-item`,
    userInfo: `${CONFIG.apiBaseUrl}/user-info`,
    items: `${CONFIG.apiBaseUrl}/items`,
  };

  // Shop items list
  const SHOP_ITEMS = [
    {
      id: 'society_streak_freeze',
      name: 'Streak Freeze',
      icon: '❄️',
      color: '#00D4FF',
    },
    {
      id: 'streak_repair',
      name: 'Streak Repair',
      icon: '🔧',
      color: '#FFA500',
    },
    {
      id: 'heart_segment',
      name: 'Heart Segment',
      icon: '❤️',
      color: '#FF6B6B',
    },
    {
      id: 'health_refill',
      name: 'Health Refill',
      icon: '💊',
      color: '#FF4444',
    },
    {
      id: 'xp_boost_stackable',
      name: 'XP Boost Stackable',
      icon: '⚡',
      color: '#FFD700',
    },
    {
      id: 'general_xp_boost',
      name: 'General XP Boost',
      icon: '🔥',
      color: '#FF8C00',
    },
    {
      id: 'xp_boost_15',
      name: 'XP Boost x2 (15 min)',
      icon: '⏱️',
      color: '#58CC02',
    },
    {
      id: 'xp_boost_60',
      name: 'XP Boost x2 (60 min)',
      icon: '⏰',
      color: '#45A800',
    },
    {
      id: 'xp_boost_refill',
      name: 'XP Boost x3 (15 min)',
      icon: '🚀',
      color: '#1CB0F6',
    },
    {
      id: 'early_bird_xp_boost',
      name: 'Early Bird XP Boost',
      icon: '🌅',
      color: '#FF9500',
    },
    {
      id: 'row_blaster_150',
      name: 'Row Blaster 150',
      icon: '💥',
      color: '#9B59B6',
    },
    {
      id: 'row_blaster_250',
      name: 'Row Blaster 250',
      icon: '💣',
      color: '#8E44AD',
    },
  ];

  // Tab definitions
  const TABS = [
    { id: 'xp', name: 'XP', icon: '⚡', color: '#58CC02' },
    { id: 'gems', name: 'Gems', icon: '💎', color: '#FFD700' },
    { id: 'streak', name: 'Streak', icon: '🔥', color: '#FF9500' },
    { id: 'super', name: 'Super', icon: '👑', color: '#9B59B6' },
    { id: 'items', name: 'Items', icon: '🎁', color: '#1CB0F6' },
  ];

  // =============================================================================
  // JWT TOKEN & USER INFO
  // =============================================================================

  const jwtToken = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('jwt_token='))
    ?.split('=')[1];

  if (!jwtToken) {
    console.error('[Duolingo Farm Pro] JWT token not found.');
    return;
  }

  /**
   * Decode user ID from JWT token
   */
  function getUserIdFromJwt(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = decodeURIComponent(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(decoded).sub;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  // =============================================================================
  // APPLICATION STATE
  // =============================================================================

  const state = {
    token: GM_getValue('auth_token', '') || `Bearer ${jwtToken}`,
    userId: getUserIdFromJwt(jwtToken).toString(),
    activeTab: 'xp',
    isRunning: false,
    progress: 0,
    currentAction: '',
    // Form values
    xpAmount: 1000,
    gemAmount: 300,
    streakDays: 10,
    gemMode: 'normal', // 'normal' or 'fast'
    // License info
    licenseKey: GM_getValue('license_key', ''),
    licenseValid: false,
    licensePlan: 'free',
    licenseUsername: '',
    licenseFeatures: [],
    licenseExpiresAt: null,
  };

  // =============================================================================
  // CSS STYLES
  // =============================================================================

  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    /* Container */
    #duo-farm-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: 'Poppins', sans-serif;
    }

    /* Toggle Button */
    .duo-toggle-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(88, 204, 2, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: all 0.3s ease;
    }

    .duo-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(88, 204, 2, 0.6);
    }

    /* Main Panel */
    .duo-panel {
      width: 420px;
      max-height: 85vh;
      overflow-y: auto;
      background: rgba(19, 31, 36, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 0;
      box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: none;
      animation: slideIn 0.3s ease-out;
    }

    .duo-panel.show {
      display: block;
    }

    .duo-panel::-webkit-scrollbar {
      width: 6px;
    }

    .duo-panel::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }

    .duo-panel::-webkit-scrollbar-thumb {
      background: rgba(88, 204, 2, 0.5);
      border-radius: 3px;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header */
    .duo-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(88, 204, 2, 0.1) 0%, rgba(28, 176, 246, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .duo-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .duo-logo {
      font-size: 28px;
    }

    .duo-title {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .duo-version {
      font-size: 11px;
      color: #6B7280;
    }

    .duo-close-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .duo-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    /* Tabs */
    .duo-tabs {
      display: flex;
      padding: 0 16px;
      gap: 4px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .duo-tab {
      flex: 1;
      padding: 12px 8px;
      background: none;
      border: none;
      color: #6B7280;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-bottom: 2px solid transparent;
    }

    .duo-tab:hover {
      color: #D1D5DB;
    }

    .duo-tab.active {
      color: var(--tab-color, #58CC02);
      border-bottom-color: var(--tab-color, #58CC02);
    }

    .duo-tab-icon {
      font-size: 18px;
    }

    /* Tab Content */
    .duo-content {
      padding: 20px 24px;
    }

    .duo-tab-panel {
      display: none;
    }

    .duo-tab-panel.active {
      display: block;
    }

    /* Form Elements */
    .duo-form-group {
      margin-bottom: 20px;
    }

    .duo-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #D1D5DB;
      margin-bottom: 10px;
    }

    .duo-label-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Input */
    .duo-input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(31, 41, 55, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 13px;
      font-family: 'Poppins', sans-serif;
      box-sizing: border-box;
      transition: all 0.2s;
    }

    .duo-input:focus {
      outline: none;
      border-color: #58CC02;
      box-shadow: 0 0 0 3px rgba(88, 204, 2, 0.1);
    }

    .duo-input::placeholder {
      color: #6B7280;
    }

    /* Slider */
    .duo-slider-wrapper {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .duo-slider {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: rgba(31, 41, 55, 0.8);
      outline: none;
      -webkit-appearance: none;
    }

    .duo-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(88, 204, 2, 0.5);
    }

    .duo-value-box {
      background: rgba(31, 41, 55, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 10px 16px;
      min-width: 100px;
      text-align: center;
    }

    .duo-value-number {
      display: block;
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .duo-value-label {
      font-size: 10px;
      color: #9CA3AF;
    }

    .duo-slider-info {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #6B7280;
      margin-top: 8px;
    }

    .duo-slider-info .highlight {
      color: #58CC02;
      font-weight: 600;
    }

    /* Buttons */
    .duo-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .duo-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .duo-btn-primary {
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      box-shadow: 0 4px 15px rgba(88, 204, 2, 0.3);
    }

    .duo-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(88, 204, 2, 0.4);
    }

    .duo-btn-gold {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }

    .duo-btn-gold:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(255, 215, 0, 0.4);
    }

    .duo-btn-orange {
      background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
      box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
    }

    .duo-btn-purple {
      background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
      box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
    }

    .duo-btn-blue {
      background: linear-gradient(135deg, #1CB0F6 0%, #0095E0 100%);
      box-shadow: 0 4px 15px rgba(28, 176, 246, 0.3);
    }

    .duo-btn-sm {
      padding: 10px 16px;
      font-size: 12px;
    }

    .duo-btn-group {
      display: flex;
      gap: 12px;
    }

    .duo-btn-group .duo-btn {
      flex: 1;
    }

    /* Toggle Switch */
    .duo-toggle-group {
      display: flex;
      background: rgba(31, 41, 55, 0.6);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 16px;
    }

    .duo-toggle-option {
      flex: 1;
      padding: 10px;
      border: none;
      background: none;
      color: #9CA3AF;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .duo-toggle-option.active {
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      color: white;
    }

    /* Progress */
    .duo-progress {
      margin-top: 16px;
      padding: 16px;
      background: rgba(31, 41, 55, 0.4);
      border-radius: 12px;
      display: none;
    }

    .duo-progress.show {
      display: block;
    }

    .duo-progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 12px;
    }

    .duo-progress-label {
      color: #D1D5DB;
      font-weight: 600;
    }

    .duo-progress-percent {
      color: #58CC02;
      font-weight: 700;
    }

    .duo-progress-bar-bg {
      height: 8px;
      background: rgba(31, 41, 55, 0.8);
      border-radius: 4px;
      overflow: hidden;
    }

    .duo-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #58CC02 0%, #1CB0F6 100%);
      border-radius: 4px;
      width: 0%;
      transition: width 0.3s ease;
    }

    .duo-progress-status {
      margin-top: 10px;
      font-size: 11px;
      color: #9CA3AF;
      text-align: center;
    }

    /* Result Card */
    .duo-result {
      margin-top: 16px;
      padding: 16px;
      border-radius: 12px;
      display: none;
    }

    .duo-result.show {
      display: block;
    }

    .duo-result.success {
      background: rgba(88, 204, 2, 0.1);
      border: 1px solid rgba(88, 204, 2, 0.3);
    }

    .duo-result.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .duo-result-text {
      font-size: 13px;
      text-align: center;
    }

    .duo-result.success .duo-result-text {
      color: #58CC02;
    }

    .duo-result.error .duo-result-text {
      color: #EF4444;
    }

    /* Items Grid */
    .duo-items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .duo-item-card {
      background: rgba(31, 41, 55, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .duo-item-card:hover {
      border-color: rgba(88, 204, 2, 0.5);
      background: rgba(31, 41, 55, 0.6);
    }

    .duo-item-card.loading {
      opacity: 0.5;
      pointer-events: none;
    }

    .duo-item-icon {
      font-size: 24px;
      margin-bottom: 6px;
    }

    .duo-item-name {
      font-size: 11px;
      color: #D1D5DB;
      font-weight: 500;
    }

    /* Section Divider */
    .duo-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 20px 0;
    }

    /* Info Box */
    .duo-info {
      background: rgba(31, 41, 55, 0.4);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .duo-info-icon {
      font-size: 18px;
    }

    /* Warning Box */
    .duo-warning {
      background: rgba(255, 149, 0, 0.1);
      border: 1px solid rgba(255, 149, 0, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #FF9500;
      margin-bottom: 16px;
    }

    /* Toast */
    .duo-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      max-width: 320px;
      background: rgba(19, 31, 36, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000001;
      display: none;
      animation: slideUp 0.3s ease-out;
    }

    .duo-toast.show {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .duo-toast-icon {
      font-size: 24px;
    }

    .duo-toast-content {
      flex: 1;
    }

    .duo-toast-title {
      font-size: 13px;
      font-weight: 600;
      color: white;
      margin: 0 0 4px 0;
    }

    .duo-toast-message {
      font-size: 11px;
      color: #D1D5DB;
      margin: 0;
    }

    /* Token input area */
    .duo-token-section {
      padding: 0 24px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .duo-token-toggle {
      padding: 12px;
      background: none;
      border: none;
      color: #6B7280;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    .duo-token-toggle:hover {
      color: #D1D5DB;
    }

    .duo-token-content {
      display: none;
      padding-top: 8px;
    }

    .duo-token-content.show {
      display: block;
    }

    .duo-input-wrapper {
      position: relative;
    }

    .duo-input-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6B7280;
      cursor: pointer;
      font-size: 16px;
    }

    .duo-input-btn:hover {
      color: #58CC02;
    }

    .duo-hint {
      font-size: 10px;
      color: #6B7280;
      margin-top: 6px;
    }

    /* License Activation Screen */
    .duo-license-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .duo-license-modal {
      width: 400px;
      background: rgba(19, 31, 36, 0.98);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: scaleIn 0.3s ease-out;
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .duo-license-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .duo-license-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .duo-license-title {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 8px 0;
    }

    .duo-license-subtitle {
      font-size: 14px;
      color: #9CA3AF;
      margin: 0;
    }

    .duo-license-form {
      margin-bottom: 16px;
    }

    .duo-license-input {
      width: 100%;
      padding: 16px;
      background: rgba(31, 41, 55, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-family: 'Poppins', sans-serif;
      text-align: center;
      letter-spacing: 2px;
      box-sizing: border-box;
      transition: all 0.2s;
    }

    .duo-license-input:focus {
      outline: none;
      border-color: #58CC02;
      box-shadow: 0 0 0 4px rgba(88, 204, 2, 0.1);
    }

    .duo-license-input::placeholder {
      color: #6B7280;
      letter-spacing: normal;
    }

    .duo-license-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(88, 204, 2, 0.3);
    }

    .duo-license-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(88, 204, 2, 0.4);
    }

    .duo-license-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .duo-license-btn.loading {
      pointer-events: none;
    }

    .duo-license-error {
      margin-top: 16px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #EF4444;
      font-size: 13px;
      text-align: center;
      display: none;
    }

    .duo-license-error.show {
      display: block;
    }

    .duo-license-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
    }

    .duo-license-footer a {
      color: #58CC02;
      text-decoration: none;
    }

    /* License Badge in Header */
    .duo-license-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .duo-license-badge.free {
      background: rgba(107, 114, 128, 0.2);
      color: #9CA3AF;
      border: 1px solid rgba(107, 114, 128, 0.3);
    }

    .duo-license-badge.pro {
      background: linear-gradient(135deg, rgba(88, 204, 2, 0.2) 0%, rgba(28, 176, 246, 0.2) 100%);
      color: #58CC02;
      border: 1px solid rgba(88, 204, 2, 0.3);
    }

    .duo-license-badge:hover {
      transform: scale(1.05);
    }

    /* Icon Buttons (Logout & Close) */
    .duo-icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: transparent;
      border: none;
      color: #9CA3AF;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .duo-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateY(-1px);
    }

    .duo-icon-btn.logout:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #EF4444;
    }

    .duo-icon-btn svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5;
    }

    /* Pro Feature Lock */
    .duo-pro-lock {
      position: relative;
      opacity: 0.5;
      pointer-events: none;
    }

    .duo-pro-lock::after {
      content: '🔒 PRO';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #FFD700;
    }
  `);

  // =============================================================================
  // UI CREATION
  // =============================================================================

  function createUI() {
    const container = document.createElement('div');
    container.id = 'duo-farm-container';

    container.innerHTML = `
      <button class="duo-toggle-btn" id="duo-toggle">🚀</button>

      <div class="duo-panel" id="duo-panel">
        <!-- Header -->
        <div class="duo-header">
          <div class="duo-header-left">
            <span class="duo-logo">🦉</span>
            <div>
              <h1 class="duo-title">Duolingo Farm Pro</h1>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="duo-version">v2.0.0</span>
                <span id="duo-license-days" style="font-size: 10px; color: #9CA3AF; display: none;"></span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="duo-license-badge ${
              state.licensePlan
            }" id="duo-license-badge">
              ${state.licensePlan === 'pro' ? '👑 PRO' : '🔓 FREE'}
            </span>
            <button class="duo-icon-btn logout" id="duo-logout" title="Change License Key">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
            <button class="duo-icon-btn close" id="duo-close" title="Close Panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Token Section -->
        <div class="duo-token-section">
          <button class="duo-token-toggle" id="duo-token-toggle">
            🔐 Authorization Token <span style="margin-left:auto">▼</span>
          </button>
          <div class="duo-token-content" id="duo-token-content">
            <div class="duo-input-wrapper">
              <input type="password" class="duo-input" id="duo-token"
                placeholder="Bearer eyJhbGciOiJIUzI1..." value="${
                  state.token
                }"/>
              <button class="duo-input-btn" id="duo-token-visibility">👁️</button>
            </div>
            <div class="duo-hint">Auto-detected from cookies. Click 👁️ to show/hide.</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="duo-tabs" id="duo-tabs">
          ${TABS.map(
            (tab) => `
            <button class="duo-tab ${
              tab.id === state.activeTab ? 'active' : ''
            }"
              data-tab="${tab.id}" style="--tab-color: ${tab.color}">
              <span class="duo-tab-icon">${tab.icon}</span>
              ${tab.name}
            </button>
          `
          ).join('')}
        </div>

        <!-- Content -->
        <div class="duo-content">
          <!-- XP Tab -->
          <div class="duo-tab-panel ${
            state.activeTab === 'xp' ? 'active' : ''
          }" id="panel-xp">
            <div class="duo-form-group">
              <label class="duo-label">
                <span class="duo-label-dot" style="background:#58CC02"></span>
                XP Amount (Max: ${CONFIG.maxXP.toLocaleString()})
              </label>
              <div class="duo-slider-wrapper">
                <input type="range" class="duo-slider" id="xp-slider"
                  min="0" max="${CONFIG.maxXP}" step="${
      CONFIG.xpStep
    }" value="${state.xpAmount}"/>
                <div class="duo-value-box">
                  <span class="duo-value-number" id="xp-value">${state.xpAmount.toLocaleString()}</span>
                  <span class="duo-value-label">XP</span>
                </div>
              </div>
              <div class="duo-slider-info">
                <span>0</span>
                <span class="highlight" id="xp-requests">${Math.ceil(
                  state.xpAmount / 200
                )} requests</span>
                <span>${CONFIG.maxXP.toLocaleString()}</span>
              </div>
            </div>

            <button class="duo-btn duo-btn-primary" id="xp-start">
              ⚡ Start XP Farm
            </button>

            <div class="duo-progress" id="xp-progress">
              <div class="duo-progress-header">
                <span class="duo-progress-label">Farming XP...</span>
                <span class="duo-progress-percent" id="xp-percent">0%</span>
              </div>
              <div class="duo-progress-bar-bg">
                <div class="duo-progress-bar" id="xp-bar"></div>
              </div>
              <div class="duo-progress-status" id="xp-status">Starting...</div>
            </div>

            <div class="duo-result" id="xp-result">
              <p class="duo-result-text" id="xp-result-text"></p>
            </div>
          </div>

          <!-- Gems Tab -->
          <div class="duo-tab-panel ${
            state.activeTab === 'gems' ? 'active' : ''
          }" id="panel-gems">
            <div class="duo-toggle-group" id="gem-mode-toggle">
              <button class="duo-toggle-option ${
                state.gemMode === 'claim' ? 'active' : ''
              }" data-mode="claim">
                🎁 Claim Rewards
              </button>
              <button class="duo-toggle-option ${
                state.gemMode === 'normal' ? 'active' : ''
              }" data-mode="normal">
                💎 Farm Gems
              </button>
              <button class="duo-toggle-option ${
                state.gemMode === 'fast' ? 'active' : ''
              }" data-mode="fast">
                🚀 Fast Mode
              </button>
            </div>

            <div id="gem-claim-content" style="display:${
              state.gemMode === 'claim' ? 'block' : 'none'
            }">
              <div class="duo-info">
                <span class="duo-info-icon">ℹ️</span>
                Claim all unclaimed gem rewards from completed lessons
              </div>
              <button class="duo-btn duo-btn-gold" id="gem-claim-btn">
                🎁 Claim All Gems
              </button>
            </div>

            <div id="gem-farm-content" style="display:${
              state.gemMode !== 'claim' ? 'block' : 'none'
            }">
              <div id="gem-fast-warning" class="duo-warning" style="display:${
                state.gemMode === 'fast' ? 'block' : 'none'
              }">
                ⚠️ Fast mode uses concurrent requests. Higher risk of rate limiting!
              </div>

              <div class="duo-form-group">
                <label class="duo-label">
                  <span class="duo-label-dot" style="background:#FFD700"></span>
                  Gems Amount
                </label>
                <div class="duo-slider-wrapper">
                  <input type="range" class="duo-slider" id="gem-slider"
                    min="0" max="${CONFIG.maxGems}" step="${
      CONFIG.gemStep
    }" value="${state.gemAmount}"/>
                  <div class="duo-value-box">
                    <span class="duo-value-number" id="gem-value">${state.gemAmount.toLocaleString()}</span>
                    <span class="duo-value-label">Gems</span>
                  </div>
                </div>
                <div class="duo-slider-info">
                  <span>30</span>
                  <span class="highlight" id="gem-requests">${Math.ceil(
                    state.gemAmount / 30
                  )} requests</span>
                  <span>${CONFIG.maxGems.toLocaleString()}</span>
                </div>
              </div>

              <button class="duo-btn duo-btn-gold" id="gem-start">
                💎 Start Gem Farm
              </button>
            </div>

            <div class="duo-progress" id="gem-progress">
              <div class="duo-progress-header">
                <span class="duo-progress-label">Farming Gems...</span>
                <span class="duo-progress-percent" id="gem-percent">0%</span>
              </div>
              <div class="duo-progress-bar-bg">
                <div class="duo-progress-bar" id="gem-bar"></div>
              </div>
              <div class="duo-progress-status" id="gem-status">Starting...</div>
            </div>

            <div class="duo-result" id="gem-result">
              <p class="duo-result-text" id="gem-result-text"></p>
            </div>
          </div>

          <!-- Streak Tab -->
          <div class="duo-tab-panel ${
            state.activeTab === 'streak' ? 'active' : ''
          }" id="panel-streak">
            <div class="duo-info">
              <span class="duo-info-icon">🔥</span>
              Extend your streak by completing backdated practice sessions
            </div>

            <div class="duo-form-group">
              <label class="duo-label">
                <span class="duo-label-dot" style="background:#FF9500"></span>
                Streak Days
              </label>
              <div class="duo-slider-wrapper">
                <input type="range" class="duo-slider" id="streak-slider"
                  min="1" max="${CONFIG.maxStreak}" step="1" value="${
      state.streakDays
    }"/>
                <div class="duo-value-box">
                  <span class="duo-value-number" id="streak-value">${
                    state.streakDays
                  }</span>
                  <span class="duo-value-label">Days</span>
                </div>
              </div>
              <div class="duo-slider-info">
                <span>1</span>
                <span class="highlight">${state.streakDays} sessions</span>
                <span>${CONFIG.maxStreak}</span>
              </div>
            </div>

            <button class="duo-btn duo-btn-orange" id="streak-start">
              🔥 Start Streak Farm
            </button>

            <div class="duo-progress" id="streak-progress">
              <div class="duo-progress-header">
                <span class="duo-progress-label">Extending Streak...</span>
                <span class="duo-progress-percent" id="streak-percent">0%</span>
              </div>
              <div class="duo-progress-bar-bg">
                <div class="duo-progress-bar" id="streak-bar"></div>
              </div>
              <div class="duo-progress-status" id="streak-status">Starting...</div>
            </div>

            <div class="duo-result" id="streak-result">
              <p class="duo-result-text" id="streak-result-text"></p>
            </div>
          </div>

          <!-- Super Tab -->
          <div class="duo-tab-panel ${
            state.activeTab === 'super' ? 'active' : ''
          }" id="panel-super">
            <div class="duo-info">
              <span class="duo-info-icon">👑</span>
              Activate a 3-day Super Duolingo trial (may not work due to detection)
            </div>

            <div class="duo-warning">
              ⚠️ This feature has a high chance of not working. Duolingo has improved their detection.
            </div>

            <button class="duo-btn duo-btn-purple" id="super-activate">
              👑 Activate Super Duolingo
            </button>

            <div class="duo-result" id="super-result">
              <p class="duo-result-text" id="super-result-text"></p>
            </div>
          </div>

          <!-- Items Tab -->
          <div class="duo-tab-panel ${
            state.activeTab === 'items' ? 'active' : ''
          }" id="panel-items">
            <div class="duo-info">
              <span class="duo-info-icon">🎁</span>
              Click on any item to claim it for free
            </div>

            <div class="duo-items-grid" id="items-grid">
              ${SHOP_ITEMS.map(
                (item) => `
                <div class="duo-item-card" data-item-id="${item.id}" style="--item-color:${item.color}">
                  <div class="duo-item-icon">${item.icon}</div>
                  <div class="duo-item-name">${item.name}</div>
                </div>
              `
              ).join('')}
            </div>

            <div class="duo-result" id="item-result">
              <p class="duo-result-text" id="item-result-text"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="duo-toast" id="duo-toast">
        <span class="duo-toast-icon" id="toast-icon">✅</span>
        <div class="duo-toast-content">
          <p class="duo-toast-title" id="toast-title">Success!</p>
          <p class="duo-toast-message" id="toast-message">Action completed.</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    bindEvents();
  }

  // =============================================================================
  // EVENT BINDINGS
  // =============================================================================

  function bindEvents() {
    // Toggle panel
    document.getElementById('duo-toggle').addEventListener('click', () => {
      const panel = document.getElementById('duo-panel');
      const toggle = document.getElementById('duo-toggle');
      panel.classList.toggle('show');
      toggle.style.display = panel.classList.contains('show') ? 'none' : 'flex';
    });

    document.getElementById('duo-close').addEventListener('click', () => {
      document.getElementById('duo-panel').classList.remove('show');
      document.getElementById('duo-toggle').style.display = 'flex';
    });

    // Token section toggle
    document
      .getElementById('duo-token-toggle')
      .addEventListener('click', () => {
        document.getElementById('duo-token-content').classList.toggle('show');
      });

    // Token visibility
    document
      .getElementById('duo-token-visibility')
      .addEventListener('click', () => {
        const input = document.getElementById('duo-token');
        input.type = input.type === 'password' ? 'text' : 'password';
      });

    // Token change
    document.getElementById('duo-token').addEventListener('change', (e) => {
      state.token = e.target.value;
      GM_setValue('auth_token', state.token);
    });

    // Logout (change license key)
    document.getElementById('duo-logout').addEventListener('click', () => {
      logoutLicense();
    });

    // Tabs
    document.getElementById('duo-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.duo-tab');
      if (!tab) return;

      const tabId = tab.dataset.tab;
      state.activeTab = tabId;

      document
        .querySelectorAll('.duo-tab')
        .forEach((t) => t.classList.remove('active'));
      document
        .querySelectorAll('.duo-tab-panel')
        .forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`panel-${tabId}`).classList.add('active');
    });

    // XP slider
    document.getElementById('xp-slider').addEventListener('input', (e) => {
      state.xpAmount = parseInt(e.target.value);
      document.getElementById('xp-value').textContent =
        state.xpAmount.toLocaleString();
      document.getElementById('xp-requests').textContent = `${Math.ceil(
        state.xpAmount / 200
      )} requests`;
    });

    // XP start
    document
      .getElementById('xp-start')
      .addEventListener('click', () => farmXP());

    // Gem mode toggle
    document
      .getElementById('gem-mode-toggle')
      .addEventListener('click', (e) => {
        const option = e.target.closest('.duo-toggle-option');
        if (!option) return;

        const mode = option.dataset.mode;
        state.gemMode = mode;

        document
          .querySelectorAll('#gem-mode-toggle .duo-toggle-option')
          .forEach((o) => o.classList.remove('active'));
        option.classList.add('active');

        document.getElementById('gem-claim-content').style.display =
          mode === 'claim' ? 'block' : 'none';
        document.getElementById('gem-farm-content').style.display =
          mode !== 'claim' ? 'block' : 'none';
        document.getElementById('gem-fast-warning').style.display =
          mode === 'fast' ? 'block' : 'none';
      });

    // Gem slider
    document.getElementById('gem-slider').addEventListener('input', (e) => {
      state.gemAmount = parseInt(e.target.value);
      document.getElementById('gem-value').textContent =
        state.gemAmount.toLocaleString();
      document.getElementById('gem-requests').textContent = `${Math.ceil(
        state.gemAmount / 30
      )} requests`;
    });

    // Gem claim
    document
      .getElementById('gem-claim-btn')
      .addEventListener('click', () => claimGems());

    // Gem start
    document
      .getElementById('gem-start')
      .addEventListener('click', () => farmGems());

    // Streak slider
    document.getElementById('streak-slider').addEventListener('input', (e) => {
      state.streakDays = parseInt(e.target.value);
      document.getElementById('streak-value').textContent = state.streakDays;
    });

    // Streak start
    document
      .getElementById('streak-start')
      .addEventListener('click', () => farmStreak());

    // Super activate
    document
      .getElementById('super-activate')
      .addEventListener('click', () => activateSuper());

    // Items
    document.getElementById('items-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.duo-item-card');
      if (!card || card.classList.contains('loading')) return;
      claimItem(card.dataset.itemId, card);
    });
  }

  // =============================================================================
  // API FUNCTIONS
  // =============================================================================

  /**
   * Helper to handle SSE streaming (new format with { type, data, timestamp })
   */
  async function handleSSEStream(url, options, callbacks) {
    const { onStart, onProgress, onSuccess, onError } = callbacks;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: state.token,
          'Content-Type': 'application/json',
          'X-License-Key': state.licenseKey,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response) {
          const errorData = await response.json();
          // New API format: { statusCode, message, data, date }
          throw new Error(
            errorData.message || errorData.error || 'Request failed'
          );
        }
        throw new Error('Something went wrong');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          try {
            // New SSE format: { type, data: {...}, timestamp }
            const event = JSON.parse(line.slice(6));
            const eventData = event.data || event;

            switch (event.type) {
              case 'start':
                onStart?.(eventData);
                break;
              case 'progress':
                onProgress?.(eventData);
                break;
              case 'success':
                onSuccess?.(eventData);
                break;
              case 'error':
                onError?.(eventData);
                break;
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to handle SSE stream:', error);
      onError?.({ message: error.message });
    }
  }

  /**
   * Farm XP
   */
  async function farmXP() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btn = document.getElementById('xp-start');
    const progress = document.getElementById('xp-progress');
    const result = document.getElementById('xp-result');

    btn.disabled = true;
    btn.innerHTML = '⏳ Farming...';
    progress.classList.add('show');
    result.classList.remove('show');

    await handleSSEStream(
      ENDPOINTS.addXp,
      {
        method: 'POST',
        body: JSON.stringify({ xp: state.xpAmount }),
      },
      {
        onStart: () => {
          document.getElementById('xp-status').textContent = 'Starting...';
        },
        onProgress: (data) => {
          const percent = data.progress || 0;
          document.getElementById('xp-percent').textContent = `${percent}%`;
          document.getElementById('xp-bar').style.width = `${percent}%`;
          document.getElementById(
            'xp-status'
          ).textContent = `Progress: ${percent}%`;
        },
        onSuccess: (data) => {
          result.classList.add('show', 'success');
          result.classList.remove('error');
          document.getElementById('xp-result-text').textContent = `✅ ${
            data.message || 'XP farmed successfully!'
          }`;
          showToast(
            'Success!',
            `Farmed ${state.xpAmount.toLocaleString()} XP`,
            '✅'
          );
        },
        onError: (data) => {
          result.classList.add('show', 'error');
          result.classList.remove('success');
          document.getElementById(
            'xp-result-text'
          ).textContent = `❌ ${data.message}`;
          showToast('Error', data.message, '❌');
        },
      }
    );

    btn.disabled = false;
    btn.innerHTML = '⚡ Start XP Farm';
    state.isRunning = false;
  }

  /**
   * Helper to check if API response is successful (new format)
   * API format: { statusCode, message, data, date }
   */
  function isApiSuccess(response) {
    return response.statusCode >= 200 && response.statusCode < 300;
  }

  /**
   * Claim Gems
   */
  async function claimGems() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btn = document.getElementById('gem-claim-btn');
    const result = document.getElementById('gem-result');

    btn.disabled = true;
    btn.innerHTML = '⏳ Claiming...';
    result.classList.remove('show');

    try {
      const response = await fetch(
        `${ENDPOINTS.claimGems}?userId=${state.userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: state.token,
            'X-License-Key': state.licenseKey,
          },
        }
      );

      const data = await response.json();

      // New API format: { statusCode, message, data, date }
      if (isApiSuccess(data)) {
        result.classList.add('show', 'success');
        result.classList.remove('error');
        document.getElementById(
          'gem-result-text'
        ).textContent = `✅ ${data.message}`;
        showToast('Success!', data.message, '✅');
      } else {
        throw new Error(data.message || 'Failed to claim gems');
      }
    } catch (error) {
      result.classList.add('show', 'error');
      result.classList.remove('success');
      document.getElementById(
        'gem-result-text'
      ).textContent = `❌ ${error.message}`;
      showToast('Error', error.message, '❌');
    }

    btn.disabled = false;
    btn.innerHTML = '🎁 Claim All Gems';
    state.isRunning = false;
  }

  /**
   * Farm Gems
   */
  async function farmGems() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btn = document.getElementById('gem-start');
    const progress = document.getElementById('gem-progress');
    const result = document.getElementById('gem-result');

    btn.disabled = true;
    btn.innerHTML = '⏳ Farming...';
    progress.classList.add('show');
    result.classList.remove('show');

    const endpoint =
      state.gemMode === 'fast' ? ENDPOINTS.farmGemsFast : ENDPOINTS.farmGems;

    await handleSSEStream(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify({
          userId: state.userId,
          amount: state.gemAmount,
          ...(state.gemMode === 'fast' ? { concurrency: 10 } : {}),
        }),
      },
      {
        onStart: () => {
          document.getElementById('gem-status').textContent = 'Starting...';
        },
        onProgress: (data) => {
          const percent = data.progress || 0;
          document.getElementById('gem-percent').textContent = `${percent}%`;
          document.getElementById('gem-bar').style.width = `${percent}%`;
          document.getElementById('gem-status').textContent =
            data.message || `Progress: ${percent}%`;
        },
        onSuccess: (data) => {
          result.classList.add('show', 'success');
          result.classList.remove('error');
          document.getElementById(
            'gem-result-text'
          ).textContent = `✅ ${data.message}`;
          showToast('Success!', data.message, '💎');
        },
        onError: (data) => {
          result.classList.add('show', 'error');
          result.classList.remove('success');
          document.getElementById(
            'gem-result-text'
          ).textContent = `❌ ${data.message}`;
          showToast('Error', data.message, '❌');
        },
      }
    );

    btn.disabled = false;
    btn.innerHTML = '💎 Start Gem Farm';
    state.isRunning = false;
  }

  /**
   * Farm Streak
   */
  async function farmStreak() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btn = document.getElementById('streak-start');
    const progress = document.getElementById('streak-progress');
    const result = document.getElementById('streak-result');

    btn.disabled = true;
    btn.innerHTML = '⏳ Farming...';
    progress.classList.add('show');
    result.classList.remove('show');

    await handleSSEStream(
      ENDPOINTS.farmStreak,
      {
        method: 'POST',
        body: JSON.stringify({ days: state.streakDays }),
      },
      {
        onStart: () => {
          document.getElementById('streak-status').textContent = 'Starting...';
        },
        onProgress: (data) => {
          const percent = data.progress || 0;
          document.getElementById('streak-percent').textContent = `${percent}%`;
          document.getElementById('streak-bar').style.width = `${percent}%`;
          document.getElementById('streak-status').textContent =
            data.message || `Progress: ${percent}%`;
        },
        onSuccess: (data) => {
          result.classList.add('show', 'success');
          result.classList.remove('error');
          document.getElementById(
            'streak-result-text'
          ).textContent = `✅ ${data.message}`;
          showToast('Success!', data.message, '🔥');
        },
        onError: (data) => {
          result.classList.add('show', 'error');
          result.classList.remove('success');
          document.getElementById(
            'streak-result-text'
          ).textContent = `❌ ${data.message}`;
          showToast('Error', data.message, '❌');
        },
      }
    );

    btn.disabled = false;
    btn.innerHTML = '🔥 Start Streak Farm';
    state.isRunning = false;
  }

  /**
   * Activate Super Duolingo
   */
  async function activateSuper() {
    if (state.isRunning) return;
    state.isRunning = true;

    const btn = document.getElementById('super-activate');
    const result = document.getElementById('super-result');

    btn.disabled = true;
    btn.innerHTML = '⏳ Activating...';
    result.classList.remove('show');

    try {
      const response = await fetch(ENDPOINTS.activateSuper, {
        method: 'POST',
        headers: {
          Authorization: state.token,
          'Content-Type': 'application/json',
          'X-License-Key': state.licenseKey,
        },
        body: JSON.stringify({ userId: state.userId }),
      });

      const data = await response.json();

      // New API format: { statusCode, message, data, date }
      if (isApiSuccess(data)) {
        result.classList.add('show', 'success');
        result.classList.remove('error');
        document.getElementById(
          'super-result-text'
        ).textContent = `✅ ${data.message}`;
        showToast('Success!', data.message, '👑');
      } else {
        throw new Error(data.message || 'Failed to activate Super');
      }
    } catch (error) {
      result.classList.add('show', 'error');
      result.classList.remove('success');
      document.getElementById(
        'super-result-text'
      ).textContent = `❌ ${error.message}`;
      showToast('Error', error.message, '❌');
    }

    btn.disabled = false;
    btn.innerHTML = '👑 Activate Super Duolingo';
    state.isRunning = false;
  }

  /**
   * Claim Shop Item
   */
  async function claimItem(itemId, cardElement) {
    if (state.isRunning) return;
    state.isRunning = true;

    const result = document.getElementById('item-result');
    cardElement.classList.add('loading');
    result.classList.remove('show');

    try {
      const response = await fetch(ENDPOINTS.claimItem, {
        method: 'POST',
        headers: {
          Authorization: state.token,
          'Content-Type': 'application/json',
          'X-License-Key': state.licenseKey,
        },
        body: JSON.stringify({ userId: state.userId, itemId }),
      });

      const data = await response.json();

      // New API format: { statusCode, message, data, date }
      if (isApiSuccess(data)) {
        result.classList.add('show', 'success');
        result.classList.remove('error');
        document.getElementById(
          'item-result-text'
        ).textContent = `✅ ${data.message}`;
        showToast('Success!', data.message, '🎁');
      } else {
        throw new Error(data.message || 'Failed to claim item');
      }
    } catch (error) {
      result.classList.add('show', 'error');
      result.classList.remove('success');
      document.getElementById(
        'item-result-text'
      ).textContent = `❌ ${error.message}`;
      showToast('Error', error.message, '❌');
    }

    cardElement.classList.remove('loading');
    state.isRunning = false;
  }

  /**
   * Show Toast Notification
   */
  function showToast(title, message, icon) {
    const toast = document.getElementById('duo-toast');
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // =============================================================================
  // LICENSE FUNCTIONS
  // =============================================================================

  /**
   * Create License Activation UI
   */
  function createLicenseUI() {
    const overlay = document.createElement('div');
    overlay.className = 'duo-license-overlay';
    overlay.id = 'duo-license-overlay';

    overlay.innerHTML = `
      <div class="duo-license-modal">
        <div class="duo-license-header">
          <div class="duo-license-icon">🔑</div>
          <h2 class="duo-license-title">Activate License</h2>
          <p class="duo-license-subtitle">Enter your license key to unlock all features</p>
        </div>

        <div class="duo-license-form">
          <input type="text" class="duo-license-input" id="license-key-input"
            placeholder="Enter license key..." autocomplete="off" />
          <p style="font-size: 11px; color: #6B7280; margin-top: 6px; margin-left: 2px;">
            Enter <code style="background: rgba(88, 204, 2, 0.1); color: #58CC02; padding: 2px 4px; border-radius: 4px;">free_trial</code> for Free plan
          </p>
        </div>

        <button class="duo-license-btn" id="license-verify-btn">
          🚀 Activate License
        </button>

        <div class="duo-license-error" id="license-error"></div>

        <div class="duo-license-footer">
          <p>Don't have a key? <a href="#" id="license-skip">Continue with FREE plan</a></p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    bindLicenseEvents();
  }

  /**
   * Bind License UI Events
   */
  function bindLicenseEvents() {
    // Verify button click
    document
      .getElementById('license-verify-btn')
      .addEventListener('click', async () => {
        const input = document.getElementById('license-key-input');
        const key = input.value.trim();

        if (!key) {
          showLicenseError('Please enter a license key');
          return;
        }

        await verifyAndActivateLicense(key);
      });

    // Enter key submit
    document
      .getElementById('license-key-input')
      .addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
          const key = e.target.value.trim();
          if (key) {
            await verifyAndActivateLicense(key);
          }
        }
      });

    // Skip to free plan
    // Skip to free plan (Activate free_trial key)
    document
      .getElementById('license-skip')
      .addEventListener('click', async (e) => {
        e.preventDefault();
        const input = document.getElementById('license-key-input');
        input.value = 'free_trial'; // Show it in input
        await verifyAndActivateLicense('free_trial');
      });
  }

  /**
   * Verify License Key with Backend
   * API format: { statusCode, message, data: { valid, plan, username, features, expiresAt }, date }
   */
  async function verifyAndActivateLicense(key) {
    const btn = document.getElementById('license-verify-btn');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = '⏳ Verifying...';

    try {
      const response = await fetch(ENDPOINTS.verifyLicense, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const apiResponse = await response.json();

      // New API format: { statusCode, message, data, date }
      if (isApiSuccess(apiResponse) && apiResponse.data?.license?.valid) {
        const license = apiResponse.data.license;

        // Save license info
        state.licenseKey = key;
        state.licenseValid = true;
        state.licensePlan = license.plan;
        state.licenseUsername = license.username || '';
        state.licenseFeatures = license.features || [];
        state.licenseExpiresAt = license.expiresAt || null;

        // Persist to storage
        GM_setValue('license_key', key);

        // Hide license UI and update main UI
        hideLicenseUI();
        updateUIForPlan();

        showToast(
          'License Activated!',
          `Welcome ${
            state.licenseUsername || 'User'
          }! You have ${state.licensePlan.toUpperCase()} plan`,
          state.licensePlan === 'pro' ? '👑' : '🔓'
        );
      } else {
        showLicenseError(apiResponse.message || 'Invalid license key');
      }
    } catch (error) {
      console.error('License verification failed:', error);
      showLicenseError('Failed to verify license. Please try again.');
    }

    btn.disabled = false;
    btn.classList.remove('loading');
    btn.innerHTML = originalText;
  }

  /**
   * Show License Error Message
   */
  function showLicenseError(message) {
    const errorEl = document.getElementById('license-error');
    errorEl.textContent = message;
    errorEl.classList.add('show');

    setTimeout(() => {
      errorEl.classList.remove('show');
    }, 5000);
  }

  /**
   * Hide License Overlay
   */
  function hideLicenseUI() {
    const overlay = document.getElementById('duo-license-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  }

  /**
   * Show License Overlay (for re-activation)
   */
  function showLicenseUI() {
    const existingOverlay = document.getElementById('duo-license-overlay');
    if (!existingOverlay) {
      createLicenseUI();
    }
  }

  /**
   * Logout and clear license key
   */
  function logoutLicense() {
    // Clear saved license
    GM_setValue('license_key', '');

    // Reset state
    state.licenseKey = '';
    state.licenseValid = false;
    state.licensePlan = 'free';
    state.licenseUsername = '';
    state.licenseFeatures = [];
    state.licenseExpiresAt = null;

    // Update UI
    updateUIForPlan();

    // Show license activation screen
    showLicenseUI();

    showToast('Logged Out', 'Please enter a new license key', '🔄');
  }

  /**
   * Update UI Based on License Plan
   */
  function updateUIForPlan() {
    // Update license badge
    const badge = document.getElementById('duo-license-badge');
    if (badge) {
      badge.className = `duo-license-badge ${state.licensePlan}`;
      badge.innerHTML = state.licensePlan === 'pro' ? '👑 PRO' : '🔓 FREE';
    }

    // Show expiration days
    const daysEl = document.getElementById('duo-license-days');
    if (daysEl) {
      if (state.licenseExpiresAt) {
        const expires = new Date(state.licenseExpiresAt);
        const now = new Date();
        const diffTime = expires - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          daysEl.textContent = `• ${diffDays} days left`;
          daysEl.style.display = 'inline';
          daysEl.style.color = diffDays <= 3 ? '#EF4444' : '#9CA3AF'; // Red if <= 3 days
        } else {
          daysEl.style.display = 'none';
        }
      } else if (state.licensePlan === 'pro' || state.licensePlan === 'free') {
        // Lifetime
        daysEl.textContent = '• Lifetime';
        daysEl.style.display = 'inline';
        daysEl.style.color = '#58CC02';
      } else {
        daysEl.style.display = 'none';
      }
    }

    // Lock/unlock pro features based on plan
    if (state.licensePlan !== 'pro') {
      // Find tabs that require pro
      const proTabs = ['streak', 'super', 'items'];
      proTabs.forEach((tabId) => {
        const panel = document.getElementById(`panel-${tabId}`);
        if (panel) {
          panel.classList.add('duo-pro-lock');
        }
      });

      // Lock fast gems mode button
      const fastGemBtn = document.querySelector('[data-mode="fast"]');
      if (fastGemBtn) {
        fastGemBtn.classList.add('duo-pro-lock');
        fastGemBtn.disabled = true;
      }
    } else {
      // Unlock all for pro
      document.querySelectorAll('.duo-pro-lock').forEach((el) => {
        el.classList.remove('duo-pro-lock');
        if (el.disabled) el.disabled = false;
      });
    }
  }

  /**
   * Check Saved License on Startup
   * API format: { statusCode, message, data: { valid, plan, username, features, expiresAt }, date }
   */
  async function checkSavedLicense() {
    const savedKey = state.licenseKey;

    if (savedKey) {
      try {
        const response = await fetch(ENDPOINTS.verifyLicense, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: savedKey }),
        });

        const apiResponse = await response.json();

        // New API format: { statusCode, message, data, date }
        if (isApiSuccess(apiResponse) && apiResponse.data?.license?.valid) {
          const license = apiResponse.data.license;
          state.licenseValid = true;
          state.licensePlan = license.plan;
          state.licenseUsername = license.username || '';
          state.licenseFeatures = license.features || [];
          state.licenseExpiresAt = license.expiresAt || null;
          updateUIForPlan();
          console.log(
            `[Duolingo Farm Pro] License verified: ${state.licensePlan.toUpperCase()} plan`
          );
          return true;
        }
      } catch (error) {
        console.error(
          '[Duolingo Farm Pro] Failed to verify saved license:',
          error
        );
      }
    }

    // No valid license, show activation UI
    createLicenseUI();
    return false;
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  createUI();
  checkSavedLicense();
  console.log('[Duolingo Farm Pro] v2.0.0 loaded successfully!');
})();
