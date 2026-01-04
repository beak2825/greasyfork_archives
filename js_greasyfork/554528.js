// ==UserScript==
// @name         Torn Radial Themes Library
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Theme definitions for Torn Radial Menu
// @author       Sensimillia (2168012)
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== SIZE CONFIGURATIONS ====================
    const sizeConfig = {
        pda: { 
            main: 30, 
            radial: 22, 
            fontSize: 12, 
            radialFont: 12, 
            radius: 55, 
            spacing: 14, 
            maxPerRow: 7 
        },
        small: { 
            main: 52, 
            radial: 42, 
            fontSize: 20, 
            radialFont: 18, 
            radius: 90, 
            spacing: 16, 
            maxPerRow: 9 
        },
        medium: { 
            main: 64, 
            radial: 52, 
            fontSize: 28, 
            radialFont: 24, 
            radius: 110, 
            spacing: 16, 
            maxPerRow: 10 
        },
        large: { 
            main: 76, 
            radial: 62, 
            fontSize: 34, 
            radialFont: 28, 
            radius: 130, 
            spacing: 16, 
            maxPerRow: 12 
        }
    };

    // ==================== THEME DEFINITIONS ====================
    const themes = {
        torn: {
            modalBg: 'rgba(27, 27, 27, 0.98)',
            modalHeaderBg: 'rgba(36, 36, 36, 0.95)',
            modalFooterBg: 'rgba(34, 34, 34, 0.95)',
            sectionBg: 'rgba(36, 36, 36, 0.8)',
            inputBg: 'rgba(51, 51, 51, 0.9)',
            textColor: '#d0d0d0',
            textSecondary: '#9b9b9b',
            borderColor: 'rgba(51, 51, 51, 0.5)',
            mainBtnBg: 'rgba(36, 36, 36, 0.95)',
            mainBtnBorder: 'rgba(74, 163, 223, 0.3)',
            primaryColor: '#4aa3df',
            accentGradient: 'linear-gradient(135deg, #4aa3df 0%, #66baff 100%)',
            dangerColor: '#a33a3a',
            successColor: '#3ea34a'
        },
        light: {
            modalBg: 'rgba(255, 255, 255, 0.95)',
            modalHeaderBg: 'rgba(255, 255, 255, 0.5)',
            modalFooterBg: 'rgba(249, 249, 249, 0.8)',
            sectionBg: 'rgba(255, 255, 255, 0.7)',
            inputBg: 'rgba(120, 120, 128, 0.12)',
            textColor: '#000',
            textSecondary: '#666',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            mainBtnBg: 'rgba(255, 255, 255, 0.95)',
            mainBtnBorder: 'rgba(0, 0, 0, 0.04)',
            primaryColor: '#007AFF',
            accentGradient: 'linear-gradient(135deg, #FF2D55 0%, #FF375F 100%)',
            dangerColor: '#FF3B30',
            successColor: '#34C759'
        },
        dark: {
            modalBg: 'rgba(28, 28, 30, 0.95)',
            modalHeaderBg: 'rgba(44, 44, 46, 0.5)',
            modalFooterBg: 'rgba(20, 20, 22, 0.8)',
            sectionBg: 'rgba(44, 44, 46, 0.7)',
            inputBg: 'rgba(255, 255, 255, 0.1)',
            textColor: '#FFFFFF',
            textSecondary: '#9b9b9b',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            mainBtnBg: 'rgba(44, 44, 46, 0.95)',
            mainBtnBorder: 'rgba(255, 255, 255, 0.08)',
            primaryColor: '#0A84FF',
            accentGradient: 'linear-gradient(135deg, #FF453A 0%, #FF375F 100%)',
            dangerColor: '#FF453A',
            successColor: '#32D74B'
        },
        cyberpunk: {
            modalBg: 'rgba(10, 10, 15, 0.98)',
            modalHeaderBg: 'rgba(20, 20, 30, 0.95)',
            modalFooterBg: 'rgba(15, 15, 20, 0.95)',
            sectionBg: 'rgba(25, 25, 35, 0.8)',
            inputBg: 'rgba(35, 35, 50, 0.9)',
            textColor: '#00ff9f',
            textSecondary: '#7b68ee',
            borderColor: 'rgba(0, 255, 159, 0.3)',
            mainBtnBg: 'rgba(20, 20, 30, 0.95)',
            mainBtnBorder: 'rgba(255, 0, 255, 0.5)',
            primaryColor: '#ff00ff',
            accentGradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            dangerColor: '#ff0080',
            successColor: '#00ff9f'
        },
        ocean: {
            modalBg: 'rgba(15, 25, 40, 0.98)',
            modalHeaderBg: 'rgba(20, 35, 55, 0.95)',
            modalFooterBg: 'rgba(10, 20, 35, 0.95)',
            sectionBg: 'rgba(25, 40, 60, 0.8)',
            inputBg: 'rgba(30, 50, 75, 0.9)',
            textColor: '#e0f4ff',
            textSecondary: '#6fa8dc',
            borderColor: 'rgba(79, 195, 247, 0.3)',
            mainBtnBg: 'rgba(20, 35, 55, 0.95)',
            mainBtnBorder: 'rgba(79, 195, 247, 0.5)',
            primaryColor: '#4fc3f7',
            accentGradient: 'linear-gradient(135deg, #0288d1 0%, #26c6da 100%)',
            dangerColor: '#ff6e40',
            successColor: '#69f0ae'
        },
        sunset: {
            modalBg: 'rgba(40, 20, 30, 0.98)',
            modalHeaderBg: 'rgba(60, 30, 45, 0.95)',
            modalFooterBg: 'rgba(35, 15, 25, 0.95)',
            sectionBg: 'rgba(55, 25, 40, 0.8)',
            inputBg: 'rgba(70, 35, 50, 0.9)',
            textColor: '#ffe0b2',
            textSecondary: '#ffab91',
            borderColor: 'rgba(255, 138, 101, 0.3)',
            mainBtnBg: 'rgba(60, 30, 45, 0.95)',
            mainBtnBorder: 'rgba(255, 138, 101, 0.5)',
            primaryColor: '#ff8a65',
            accentGradient: 'linear-gradient(135deg, #ff6f00 0%, #ff9100 100%)',
            dangerColor: '#d50000',
            successColor: '#76ff03'
        },
        neonNoir: {
            modalBg: 'rgba(10, 10, 15, 0.98)',
            modalHeaderBg: 'rgba(20, 20, 25, 0.95)',
            modalFooterBg: 'rgba(15, 15, 20, 0.9)',
            sectionBg: 'rgba(25, 25, 30, 0.8)',
            inputBg: 'rgba(40, 40, 50, 0.9)',
            textColor: '#c0c0ff',
            textSecondary: '#8080ff',
            borderColor: 'rgba(120, 120, 255, 0.3)',
            mainBtnBg: 'rgba(20, 20, 25, 0.95)',
            mainBtnBorder: 'rgba(120, 120, 255, 0.4)',
            primaryColor: '#9b59b6',
            accentGradient: 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
            dangerColor: '#e74c3c',
            successColor: '#2ecc71'
        },
        bloodline: {
            modalBg: 'rgba(15, 10, 10, 0.98)',
            modalHeaderBg: 'rgba(25, 15, 15, 0.95)',
            modalFooterBg: 'rgba(20, 10, 10, 0.9)',
            sectionBg: 'rgba(35, 20, 20, 0.8)',
            inputBg: 'rgba(45, 25, 25, 0.9)',
            textColor: '#f0b0b0',
            textSecondary: '#c07070',
            borderColor: 'rgba(255, 80, 80, 0.3)',
            mainBtnBg: 'rgba(30, 15, 15, 0.95)',
            mainBtnBorder: 'rgba(255, 0, 0, 0.4)',
            primaryColor: '#e63946',
            accentGradient: 'linear-gradient(135deg, #b71c1c 0%, #f44336 100%)',
            dangerColor: '#ff5252',
            successColor: '#81c784'
        },
        stealth: {
            modalBg: 'rgba(8, 8, 8, 0.98)',
            modalHeaderBg: 'rgba(12, 12, 12, 0.95)',
            modalFooterBg: 'rgba(10, 10, 10, 0.9)',
            sectionBg: 'rgba(15, 15, 15, 0.8)',
            inputBg: 'rgba(25, 25, 25, 0.9)',
            textColor: '#c0c0c0',
            textSecondary: '#888',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            mainBtnBg: 'rgba(18, 18, 18, 0.95)',
            mainBtnBorder: 'rgba(255, 255, 255, 0.1)',
            primaryColor: '#4a90e2',
            accentGradient: 'linear-gradient(135deg, #4a90e2 0%, #00bcd4 100%)',
            dangerColor: '#f44336',
            successColor: '#4caf50'
        },
        terminal: {
            modalBg: 'rgba(5, 10, 5, 0.98)',
            modalHeaderBg: 'rgba(10, 15, 10, 0.95)',
            modalFooterBg: 'rgba(8, 12, 8, 0.9)',
            sectionBg: 'rgba(12, 20, 12, 0.8)',
            inputBg: 'rgba(20, 30, 20, 0.9)',
            textColor: '#00ff00',
            textSecondary: '#66ff66',
            borderColor: 'rgba(0, 255, 0, 0.3)',
            mainBtnBg: 'rgba(10, 20, 10, 0.95)',
            mainBtnBorder: 'rgba(0, 255, 0, 0.4)',
            primaryColor: '#00ff66',
            accentGradient: 'linear-gradient(135deg, #00cc00 0%, #00ff99 100%)',
            dangerColor: '#ff0033',
            successColor: '#33ff00'
        }
    };

    // ==================== THEME UTILITY FUNCTIONS ====================
    function getThemeNames() {
        return Object.keys(themes);
    }

    function getTheme(name) {
        return themes[name] || themes.torn;
    }

    function getAllThemes() {
        return themes;
    }

    function getSizeConfig(size) {
        return sizeConfig[size] || sizeConfig.medium;
    }

    function getAllSizeConfigs() {
        return sizeConfig;
    }

    // ==================== EXPORT ====================
    window.TornRadialThemes = {
        themes: themes,
        sizeConfig: sizeConfig,
        getThemeNames: getThemeNames,
        getTheme: getTheme,
        getAllThemes: getAllThemes,
        getSizeConfig: getSizeConfig,
        getAllSizeConfigs: getAllSizeConfigs
    };

})();