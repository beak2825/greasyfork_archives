// ==UserScript==
// @name         PiShock Enhanced Modern Interface
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Interface moderne améliorée pour PiShock avec paramètres avancés
// @author       ErrorNoName
// @match        https://pishock.com/*
// @match        https://*.pishock.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549159/PiShock%20Enhanced%20Modern%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/549159/PiShock%20Enhanced%20Modern%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration par défaut
    const CONFIG = {
        defaultIntensity: 1,
        defaultDuration: 1,
        maxIntensity: 100,
        maxDuration: 30,
        bypassMaxIntensity: 255, // Intensité bypass maximale
        deviceId: "b79118ba-ca69-4b9c-9fd1-ec49eb08f715",
        username: "Y~ Your Mommy~",
        apiKey: "none"
    };

    // Patterns prédéfinis style Lovense
    const PATTERNS = {
        wave: [10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10],
        pulse: [5, 50, 5, 50, 5, 50, 5],
        escalate: [10, 20, 30, 40, 50, 60, 70, 80],
        earthquake: [80, 20, 80, 20, 80, 20, 90, 10, 90, 10],
        heartbeat: [30, 5, 30, 5, 60, 10, 60, 10],
        tsunami: [5, 10, 15, 25, 40, 60, 85, 100, 85, 60, 40, 25, 15, 10, 5],
        thunder: [100, 80, 60, 40, 20, 100, 80, 60, 40, 20],
        gentle: [20, 25, 30, 25, 20, 15, 20, 25, 30, 25],
        chaos: [10, 80, 30, 90, 20, 70, 40, 100, 15, 85],
        climax: [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]
    };

    // Styles CSS ultra-modernes inspirés Aegiq
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .pishock-enhanced-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 420px;
            max-height: calc(100vh - 40px);
            background: linear-gradient(135deg,
                rgba(147, 51, 234, 0.15) 0%,
                rgba(79, 70, 229, 0.15) 25%,
                rgba(236, 72, 153, 0.15) 50%,
                rgba(244, 114, 182, 0.15) 75%,
                rgba(168, 85, 247, 0.15) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            border-radius: 32px;
            padding: 32px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow:
                0 32px 64px rgba(147, 51, 234, 0.25),
                0 16px 32px rgba(79, 70, 229, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            z-index: 10000;
            color: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            animation: panelGlow 4s ease-in-out infinite alternate;
            overflow-y: auto;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        @keyframes panelGlow {
            0% {
                box-shadow:
                    0 32px 64px rgba(147, 51, 234, 0.25),
                    0 16px 32px rgba(79, 70, 229, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            100% {
                box-shadow:
                    0 48px 96px rgba(147, 51, 234, 0.4),
                    0 24px 48px rgba(79, 70, 229, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4);
            }
        }

        .panel-header {
            text-align: center;
            margin-bottom: 32px;
            position: sticky;
            top: -16px;
            background: linear-gradient(135deg,
                rgba(147, 51, 234, 0.2) 0%,
                rgba(79, 70, 229, 0.2) 25%,
                rgba(236, 72, 153, 0.2) 50%,
                rgba(244, 114, 182, 0.2) 75%,
                rgba(168, 85, 247, 0.2) 100%);
            backdrop-filter: blur(20px);
            padding: 16px 0;
            margin: -16px -32px 32px -32px;
            border-radius: 32px 32px 0 0;
            z-index: 2;
        }

        .panel-title {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #f472b6, #c084fc, #60a5fa, #34d399);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s ease-in-out infinite;
            margin: 0;
            letter-spacing: -0.5px;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .panel-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin: 8px 0 0 0;
            font-weight: 400;
        }

        .control-section {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
        }

        .control-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }

        .control-group {
            margin-bottom: 24px;
        }

        .control-group:last-child {
            margin-bottom: 0;
        }

        .control-label {
            display: block;
            margin-bottom: 12px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .modern-input {
            width: 100%;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            color: #ffffff;
            font-size: 15px;
            font-weight: 400;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            font-family: inherit;
        }

        .modern-input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(168, 85, 247, 0.6);
            box-shadow:
                0 0 0 3px rgba(168, 85, 247, 0.2),
                0 8px 32px rgba(168, 85, 247, 0.15);
            transform: translateY(-1px);
        }

        .modern-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .device-id-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .device-id-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: linear-gradient(45deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            color: #10b981;
            animation: autoDetectPulse 2s ease-in-out infinite;
            white-space: nowrap;
        }

        @keyframes autoDetectPulse {
            0%, 100% {
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
                transform: scale(1.02);
            }
        }

        .slider-container {
            position: relative;
            margin: 20px 0;
            padding: 20px 0;
        }

        .modern-slider {
            width: 100%;
            height: 8px;
            border-radius: 20px;
            background: linear-gradient(90deg,
                #8b5cf6 0%,
                #a855f7 25%,
                #c084fc 50%,
                #e879f9 75%,
                #f472b6 100%);
            outline: none;
            -webkit-appearance: none;
            position: relative;
            cursor: pointer;
            box-shadow:
                0 4px 12px rgba(168, 85, 247, 0.3),
                inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .modern-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            cursor: pointer;
            border: 3px solid #8b5cf6;
            box-shadow:
                0 6px 20px rgba(139, 92, 246, 0.4),
                0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow:
                0 8px 28px rgba(139, 92, 246, 0.6),
                0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .modern-slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            cursor: pointer;
            border: 3px solid #8b5cf6;
            box-shadow:
                0 6px 20px rgba(139, 92, 246, 0.4),
                0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .value-display {
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8b5cf6, #a855f7);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 40px;
            text-align: center;
        }

        .value-display::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #8b5cf6;
        }

        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 32px;
        }

        .modern-button {
            position: relative;
            padding: 18px 24px;
            border: none;
            border-radius: 18px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: inherit;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        .modern-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .modern-button:hover::before {
            left: 100%;
        }

        .shock-button {
            background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
            color: white;
            border: 1px solid rgba(239, 68, 68, 0.3);
            box-shadow:
                0 12px 32px rgba(239, 68, 68, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .shock-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow:
                0 20px 48px rgba(239, 68, 68, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .vibrate-button {
            background: linear-gradient(135deg, #06b6d4, #0891b2, #0e7490);
            color: white;
            border: 1px solid rgba(6, 182, 212, 0.3);
            box-shadow:
                0 12px 32px rgba(6, 182, 212, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .vibrate-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow:
                0 20px 48px rgba(6, 182, 212, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .beep-button {
            background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
            color: white;
            border: 1px solid rgba(245, 158, 11, 0.3);
            box-shadow:
                0 12px 32px rgba(245, 158, 11, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            grid-column: 1 / -1;
        }

        .beep-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow:
                0 20px 48px rgba(245, 158, 11, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .bypass-mode {
            background: linear-gradient(135deg,
                rgba(220, 38, 38, 0.2) 0%,
                rgba(153, 27, 27, 0.2) 50%,
                rgba(127, 29, 29, 0.2) 100%);
            border-color: rgba(220, 38, 38, 0.6);
            animation: dangerPulse 2s ease-in-out infinite;
        }

        @keyframes dangerPulse {
            0%, 100% {
                box-shadow:
                    0 32px 64px rgba(220, 38, 38, 0.3),
                    0 0 0 0 rgba(220, 38, 38, 0.7),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            50% {
                box-shadow:
                    0 48px 96px rgba(220, 38, 38, 0.5),
                    0 0 0 8px rgba(220, 38, 38, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4);
            }
        }

        .modern-selector {
            width: 100%;
            padding: 16px 20px;
            margin: 16px 0;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            font-size: 15px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-selector:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(168, 85, 247, 0.6);
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }

        .modern-selector option {
            background: #1f2937;
            color: #ffffff;
        }

        .pattern-visualizer {
            height: 80px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
            border-radius: 16px;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .pattern-wave {
            position: absolute;
            bottom: 0;
            background: linear-gradient(to top,
                #8b5cf6 0%,
                #a855f7 30%,
                #c084fc 60%,
                #e879f9 90%);
            border-radius: 3px;
            margin: 0 2px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        .pattern-controls-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 20px;
        }

        .pattern-control-button {
            background: linear-gradient(135deg,
                rgba(168, 85, 247, 0.8),
                rgba(147, 51, 234, 0.8));
            color: white;
            border: 1px solid rgba(168, 85, 247, 0.3);
            padding: 14px;
            border-radius: 14px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit;
            backdrop-filter: blur(10px);
        }

        .pattern-control-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(168, 85, 247, 0.4);
            background: linear-gradient(135deg,
                rgba(168, 85, 247, 0.9),
                rgba(147, 51, 234, 0.9));
        }

        .pattern-active {
            background: linear-gradient(135deg, #10b981, #059669);
            border-color: rgba(16, 185, 129, 0.5);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .danger-alert {
            background: linear-gradient(135deg,
                rgba(239, 68, 68, 0.9),
                rgba(220, 38, 38, 0.9));
            color: white;
            padding: 16px 20px;
            border-radius: 16px;
            margin: 16px 0;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid rgba(239, 68, 68, 0.5);
            box-shadow: 0 12px 28px rgba(239, 68, 68, 0.4);
            animation: emergencyPulse 2s ease-in-out infinite;
        }

        @keyframes emergencyPulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.02);
            }
        }

        .status-panel {
            margin-top: 24px;
            padding: 16px 20px;
            border-radius: 16px;
            background: linear-gradient(135deg,
                rgba(16, 185, 129, 0.1),
                rgba(5, 150, 105, 0.1));
            border: 1px solid rgba(16, 185, 129, 0.3);
            font-size: 14px;
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
        }

        .floating-toggle {
            position: fixed;
            top: 24px;
            right: 24px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow:
                0 16px 32px rgba(139, 92, 246, 0.4),
                0 8px 16px rgba(139, 92, 246, 0.2);
            z-index: 10001;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-size: 24px;
        }

        .floating-toggle:hover {
            transform: scale(1.1) rotate(180deg);
            box-shadow:
                0 24px 48px rgba(139, 92, 246, 0.6),
                0 12px 24px rgba(139, 92, 246, 0.3);
        }

        .panel-hidden {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
            pointer-events: none;
        }

        .panel-visible {
            opacity: 1;
            transform: translateX(0) scale(1);
            pointer-events: auto;
        }

        .modern-checkbox {
            display: flex;
            align-items: center;
            margin: 16px 0;
            cursor: pointer;
            user-select: none;
        }

        .modern-checkbox input[type="checkbox"] {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            margin-right: 12px;
            position: relative;
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-checkbox input[type="checkbox"]:checked {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border-color: #8b5cf6;
        }

        .modern-checkbox input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .preset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin: 20px 0;
        }

        .preset-chip {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(5px);
        }

        .preset-chip:hover {
            background: rgba(168, 85, 247, 0.2);
            border-color: rgba(168, 85, 247, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(168, 85, 247, 0.2);
        }

        .section-divider {
            height: 1px;
            background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent);
            margin: 24px 0;
        }

        svg {
            flex-shrink: 0;
        }

        .floating-toggle svg {
            color: white;
        }

        .panel-title svg {
            filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6));
        }

        /* Styles pour la barre de défilement personnalisée */
        .pishock-enhanced-panel::-webkit-scrollbar {
            width: 8px;
        }

        .pishock-enhanced-panel::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            margin: 16px 0;
        }

        .pishock-enhanced-panel::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg,
                rgba(168, 85, 247, 0.6),
                rgba(147, 51, 234, 0.6));
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
        }

        .pishock-enhanced-panel::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg,
                rgba(168, 85, 247, 0.8),
                rgba(147, 51, 234, 0.8));
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
        }

        .pishock-enhanced-panel::-webkit-scrollbar-thumb:active {
            background: linear-gradient(135deg,
                rgba(168, 85, 247, 1),
                rgba(147, 51, 234, 1));
        }

        /* Style pour Firefox */
        .pishock-enhanced-panel {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.6) rgba(0, 0, 0, 0.1);
        }

        /* Indicateur de scroll avec gradient fade */
        .pishock-enhanced-panel::before {
            content: '';
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(180deg,
                rgba(147, 51, 234, 0.15) 0%,
                transparent 100%);
            z-index: 1;
            pointer-events: none;
        }

        .pishock-enhanced-panel::after {
            content: '';
            position: sticky;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(0deg,
                rgba(147, 51, 234, 0.15) 0%,
                transparent 100%);
            z-index: 1;
            pointer-events: none;
            margin-top: -20px;
        }
    `;

    // Injection des styles
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Création de l'interface
    function createEnhancedInterface() {
        const panel = document.createElement('div');
        panel.className = 'pishock-enhanced-panel panel-hidden';
        panel.id = 'pishock-enhanced-panel';

        panel.innerHTML = `
            <div class="panel-header">
                <h1 class="panel-title">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
                        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                    </svg>
                    PiShock Quantum
                </h1>
                <p class="panel-subtitle">Contrôle intelligent avancé</p>
            </div>

            <div class="control-section">
                <div class="control-group">
                    <label class="control-label">Intensité (1-<span id="max-intensity-display">${CONFIG.maxIntensity}</span>)</label>
                    <div class="slider-container">
                        <input type="range" id="intensity-slider" class="modern-slider" min="1" max="${CONFIG.maxIntensity}" value="${CONFIG.defaultIntensity}">
                        <div class="value-display" id="intensity-value">${CONFIG.defaultIntensity}</div>
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label">Durée (1-${CONFIG.maxDuration}s)</label>
                    <div class="slider-container">
                        <input type="range" id="duration-slider" class="modern-slider" min="1" max="${CONFIG.maxDuration}" value="${CONFIG.defaultDuration}">
                        <div class="value-display" id="duration-value">${CONFIG.defaultDuration}s</div>
                    </div>
                </div>

                <label class="modern-checkbox">
                    <input type="checkbox" id="bypass-mode">
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>
                        Mode Bypass Extrême (Max: ${CONFIG.bypassMaxIntensity})
                    </span>
                </label>
            </div>

            <div class="control-section">
                <div class="control-group">
                    <label class="control-label">Configuration Appareil</label>
                    <div class="device-id-container">
                        <input type="text" id="device-id" class="modern-input" value="${CONFIG.deviceId}" placeholder="ID de l'appareil">
                        <span id="device-id-indicator" class="device-id-indicator" style="display: none;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#10b981"/>
                            </svg>
                            Auto
                        </span>
                    </div>
                    <input type="text" id="username" class="modern-input" value="${CONFIG.username}" placeholder="Nom d'utilisateur">
                </div>
            </div>

            <div class="control-section">
                <label class="control-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                    </svg>
                    Presets Rapides
                </label>
                <div class="preset-grid">
                    <button class="preset-chip" data-intensity="1" data-duration="1">Doux<br>1/1s</button>
                    <button class="preset-chip" data-intensity="15" data-duration="3">Modéré<br>15/3s</button>
                    <button class="preset-chip" data-intensity="30" data-duration="5">Fort<br>30/5s</button>
                    <button class="preset-chip" data-intensity="50" data-duration="10">Intense<br>50/10s</button>
                    <button class="preset-chip" data-intensity="80" data-duration="15">Extrême<br>80/15s</button>
                    <button class="preset-chip" data-intensity="120" data-duration="20">Bypass<br>120/20s</button>
                </div>
            </div>

            <div class="control-section">
                <label class="control-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6"/>
                    </svg>
                    Patterns Intelligents
                </label>
                <select id="pattern-selector" class="modern-selector">
                    <option value="">Sélectionner un pattern...</option>
                    <option value="wave">~ Vagues Océaniques</option>
                    <option value="pulse">♦ Pulsations Cardiaques</option>
                    <option value="escalate">↗ Escalade Progressive</option>
                    <option value="earthquake">※ Secousses Telluriques</option>
                    <option value="heartbeat">♥ Rythme Cardiaque</option>
                    <option value="tsunami">≋ Tsunami Déferlant</option>
                    <option value="thunder">⟍ Orage Électrique</option>
                    <option value="gentle">◦ Caresse Douce</option>
                    <option value="chaos">◊ Chaos Quantique</option>
                    <option value="climax">△ Ascension Cosmique</option>
                </select>

                <div class="pattern-visualizer" id="pattern-preview"></div>

                <div class="control-group">
                    <label class="control-label">Vitesse Temporelle (0.5x - 3x)</label>
                    <div class="slider-container">
                        <input type="range" id="pattern-speed" class="modern-slider" min="0.5" max="3" step="0.1" value="1">
                        <div class="value-display" id="pattern-speed-value">1x</div>
                    </div>
                </div>

                <div class="pattern-controls-grid">
                    <button class="pattern-control-button" id="pattern-play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Lancer
                    </button>
                    <button class="pattern-control-button" id="pattern-pause">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                        Pause
                    </button>
                    <button class="pattern-control-button" id="pattern-stop">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M6 6h12v12H6z"/>
                        </svg>
                        Arrêt
                    </button>
                </div>
            </div>

            <div class="control-section">
                <label class="control-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;">
                        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                    </svg>
                    Options Avancées
                </label>
                <label class="modern-checkbox">
                    <input type="checkbox" id="hold-mode">
                    <span>Mode maintenu continu</span>
                </label>
                <label class="modern-checkbox">
                    <input type="checkbox" id="warning-mode">
                    <span>Alertes de sécurité</span>
                </label>
            </div>

            <div class="section-divider"></div>

            <div class="action-grid">
                <button class="modern-button shock-button" id="shock-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                    </svg>
                    SHOCK
                </button>
                <button class="modern-button vibrate-button" id="vibrate-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M0,12c0,2.4,0.85,4.5,2.6,6.3C4.35,20.15,6.45,21,8.85,21c1.35,0,2.7-0.3,3.9-0.9c1.2-0.6,2.1-1.5,2.7-2.7c0.6-1.2,0.9-2.55,0.9-3.9c0-1.35-0.3-2.7-0.9-3.9c-0.6-1.2-1.5-2.1-2.7-2.7c-1.2-0.6-2.55-0.9-3.9-0.9c-2.4,0-4.5,0.85-6.3,2.6C0.85,7.5,0,9.6,0,12z M17.2,18.8c1.8-1.8,2.7-3.9,2.7-6.3c0-2.4-0.9-4.5-2.7-6.3C15.4,4.4,13.3,3.5,10.9,3.5L10.9,1L8.4,3.5l2.5,2.5V3.5c1.8,0,3.35,0.65,4.65,1.95c1.3,1.3,1.95,2.85,1.95,4.65c0,1.8-0.65,3.35-1.95,4.65L17.2,18.8z"/>
                    </svg>
                    VIBRER
                </button>
                <button class="modern-button beep-button" id="beep-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M3 9v6h4.5L12 18V6L7.5 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    SIGNAL
                </button>
            </div>

            <div class="status-panel" id="status-display">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                    <circle cx="12" cy="12" r="10" fill="#10b981"/>
                </svg>
                Système prêt - Interface quantique activée
            </div>
        `;

        document.body.appendChild(panel);

        // Bouton flottant moderne
        const floatingToggle = document.createElement('div');
        floatingToggle.className = 'floating-toggle';
        floatingToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>';
        floatingToggle.onclick = () => {
            const isHidden = panel.classList.contains('panel-hidden');
            if (isHidden) {
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
            } else {
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');
            }
        };
        document.body.appendChild(floatingToggle);

        return panel;
    }

    // Variables globales pour les patterns
    let patternInterval = null;
    let currentPatternIndex = 0;
    let isPatternPlaying = false;
    let currentPattern = [];

    // Mise à jour des valeurs des sliders
    function updateSliderValues() {
        const intensitySlider = document.getElementById('intensity-slider');
        const durationSlider = document.getElementById('duration-slider');
        const patternSpeedSlider = document.getElementById('pattern-speed');
        const intensityValue = document.getElementById('intensity-value');
        const durationValue = document.getElementById('duration-value');
        const patternSpeedValue = document.getElementById('pattern-speed-value');

        intensitySlider.addEventListener('input', (e) => {
            intensityValue.textContent = e.target.value;
            const maxValue = document.getElementById('bypass-mode').checked ? CONFIG.bypassMaxIntensity : CONFIG.maxIntensity;
            intensityValue.style.left = `${(e.target.value - 1) / (maxValue - 1) * 100}%`;
        });

        durationSlider.addEventListener('input', (e) => {
            durationValue.textContent = e.target.value + 's';
            durationValue.style.left = `${(e.target.value - 1) / (CONFIG.maxDuration - 1) * 100}%`;
        });

        patternSpeedSlider.addEventListener('input', (e) => {
            patternSpeedValue.textContent = e.target.value + 'x';
            patternSpeedValue.style.left = `${(e.target.value - 0.5) / (3 - 0.5) * 100}%`;
        });
    }

    // Gestion du mode bypass
    function setupBypassMode() {
        const bypassCheckbox = document.getElementById('bypass-mode');
        const intensitySlider = document.getElementById('intensity-slider');
        const maxIntensityDisplay = document.getElementById('max-intensity-display');
        const panel = document.getElementById('pishock-enhanced-panel');

        bypassCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Afficher alerte de danger
                showDangerAlert();
                // Changer les limites du slider
                intensitySlider.max = CONFIG.bypassMaxIntensity;
                maxIntensityDisplay.textContent = CONFIG.bypassMaxIntensity;
                panel.classList.add('bypass-mode');
            } else {
                // Remettre les limites normales
                intensitySlider.max = CONFIG.maxIntensity;
                intensitySlider.value = Math.min(intensitySlider.value, CONFIG.maxIntensity);
                maxIntensityDisplay.textContent = CONFIG.maxIntensity;
                panel.classList.remove('bypass-mode');
                hideDangerAlert();
            }
        });
    }

    // Afficher/Masquer l'alerte de danger
    function showDangerAlert() {
        let alert = document.getElementById('danger-alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.id = 'danger-alert';
            alert.className = 'danger-alert';
            alert.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                MODE BYPASS ACTIVÉ
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-left: 6px;">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <br>Puissance extrême - Utilisation à vos risques!
            `;

            const panel = document.getElementById('pishock-enhanced-panel');
            const header = panel.querySelector('.panel-header');
            header.insertAdjacentElement('afterend', alert);
        }
    }

    function hideDangerAlert() {
        const alert = document.getElementById('danger-alert');
        if (alert) {
            alert.remove();
        }
    }

    // Gestion des presets
    function setupPresets() {
        document.querySelectorAll('.preset-chip').forEach(button => {
            button.addEventListener('click', (e) => {
                const intensity = e.target.dataset.intensity;
                const duration = e.target.dataset.duration;

                // Activer le bypass si nécessaire
                if (intensity > CONFIG.maxIntensity) {
                    document.getElementById('bypass-mode').checked = true;
                    document.getElementById('intensity-slider').max = CONFIG.bypassMaxIntensity;
                    document.getElementById('max-intensity-display').textContent = CONFIG.bypassMaxIntensity;
                    document.getElementById('pishock-enhanced-panel').classList.add('bypass-mode');
                    showDangerAlert();
                }

                document.getElementById('intensity-slider').value = intensity;
                document.getElementById('duration-slider').value = duration;
                document.getElementById('intensity-value').textContent = intensity;
                document.getElementById('duration-value').textContent = duration + 's';
            });
        });
    }

    // Gestion des patterns
    function setupPatterns() {
        const patternSelector = document.getElementById('pattern-selector');
        const patternPreview = document.getElementById('pattern-preview');
        const playButton = document.getElementById('pattern-play');
        const pauseButton = document.getElementById('pattern-pause');
        const stopButton = document.getElementById('pattern-stop');

        patternSelector.addEventListener('change', (e) => {
            const selectedPattern = e.target.value;
            if (selectedPattern && PATTERNS[selectedPattern]) {
                currentPattern = PATTERNS[selectedPattern];
                updatePatternPreview(currentPattern);
            }
        });

        playButton.addEventListener('click', () => {
            if (currentPattern.length > 0) {
                playPattern();
            }
        });

        pauseButton.addEventListener('click', () => {
            pausePattern();
        });

        stopButton.addEventListener('click', () => {
            stopPattern();
        });
    }

    // Mise à jour de l'aperçu du pattern avec animation
    function updatePatternPreview(pattern) {
        const preview = document.getElementById('pattern-preview');
        preview.innerHTML = '';

        pattern.forEach((intensity, index) => {
            const wave = document.createElement('div');
            wave.className = 'pattern-wave';
            wave.style.width = `${100 / pattern.length}%`;
            wave.style.height = `${(intensity / 100) * 100}%`;
            wave.style.left = `${(index / pattern.length) * 100}%`;
            wave.style.animationDelay = `${index * 0.1}s`;
            preview.appendChild(wave);
        });
    }

    // Lecture du pattern
    function playPattern() {
        if (isPatternPlaying) return;

        isPatternPlaying = true;
        currentPatternIndex = 0;

        const speed = parseFloat(document.getElementById('pattern-speed').value);
        const baseInterval = 1000; // 1 seconde de base
        const interval = baseInterval / speed;

        document.getElementById('pattern-play').classList.add('pattern-active');
        document.getElementById('status-display').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            Pattern en cours...
        `;

        patternInterval = setInterval(() => {
            if (currentPatternIndex >= currentPattern.length) {
                currentPatternIndex = 0; // Recommencer le pattern
            }

            const intensity = currentPattern[currentPatternIndex];

            // Envoyer la commande avec l'intensité du pattern
            sendPatternCommand('s', intensity, 1); // 1 seconde par step

            currentPatternIndex++;
        }, interval);
    }

    // Pause du pattern
    function pausePattern() {
        isPatternPlaying = false;
        if (patternInterval) {
            clearInterval(patternInterval);
            patternInterval = null;
        }
        document.getElementById('pattern-play').classList.remove('pattern-active');
        document.getElementById('status-display').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pattern en pause
        `;
    }

    // Arrêt du pattern
    function stopPattern() {
        isPatternPlaying = false;
        currentPatternIndex = 0;
        if (patternInterval) {
            clearInterval(patternInterval);
            patternInterval = null;
        }
        document.getElementById('pattern-play').classList.remove('pattern-active');
        document.getElementById('status-display').innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                <path d="M6 6h12v12H6z"/>
            </svg>
            Pattern arrêté
        `;
    }

    // Fonction d'envoi des commandes
    async function sendCommand(operation) {
        const intensity = parseInt(document.getElementById('intensity-slider').value);
        const duration = parseInt(document.getElementById('duration-slider').value);
        const deviceId = document.getElementById('device-id').value;
        const username = document.getElementById('username').value;
        const holdMode = document.getElementById('hold-mode').checked;
        const warningMode = document.getElementById('warning-mode').checked;

        const payload = {
            Intensity: intensity,
            Duration: duration,
            Id: deviceId,
            Key: CONFIG.apiKey,
            Op: operation, // 's' = shock, 'v' = vibrate, 'b' = beep
            Hold: holdMode,
            Username: username,
            Warning: warningMode ? "Attention!" : null,
            UserId: null,
            Token: null
        };

        const statusDisplay = document.getElementById('status-display');
        statusDisplay.textContent = `Envoi ${operation === 's' ? 'shock' : operation === 'v' ? 'vibration' : 'bip'}...`;

        try {
            // Envoi de la commande principale
            const response = await fetch("https://ps.pishock.com/PiShock/LinkOperate", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
                mode: "cors",
                credentials: "omit"
            });

            // Envoi des logs
            const logPayload = {
                Intensity: intensity,
                Duration: duration,
                Id: deviceId,
                Method: operation === 's' ? 1 : operation === 'v' ? 2 : 3,
                Type: 2,
                Hold: holdMode,
                Username: username,
                Code: 0,
                SessionHex: Math.random().toString(16).substr(2, 12)
            };

            await fetch("https://do.pishock.com/Client/LinkUpdateLogs", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: JSON.stringify(logPayload),
                mode: "cors",
                credentials: "omit"
            });

            if (response.ok) {
                statusDisplay.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#10b981"/>
                    </svg>
                    ${operation === 's' ? 'Shock' : operation === 'v' ? 'Vibration' : 'Bip'} envoyé avec succès!
                `;
                setTimeout(() => {
                    statusDisplay.textContent = "Prêt à envoyer des commandes";
                }, 3000);
            } else {
                statusDisplay.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#ef4444"/>
                    </svg>
                    Erreur: ${response.status}
                `;
            }
        } catch (error) {
            statusDisplay.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#ef4444"/>
                </svg>
                Erreur de connexion: ${error.message}
            `;
            console.error('Erreur:', error);
        }
    }

    // Envoi de commande pour les patterns
    async function sendPatternCommand(operation, intensity, duration) {
        const deviceId = document.getElementById('device-id').value;
        const username = document.getElementById('username').value;
        const holdMode = document.getElementById('hold-mode').checked;
        const warningMode = document.getElementById('warning-mode').checked;

        const payload = {
            Intensity: intensity,
            Duration: duration,
            Id: deviceId,
            Key: CONFIG.apiKey,
            Op: operation,
            Hold: holdMode,
            Username: username,
            Warning: warningMode ? "Pattern en cours" : null,
            UserId: null,
            Token: null
        };

        try {
            await fetch("https://ps.pishock.com/PiShock/LinkOperate", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
                mode: "cors",
                credentials: "omit"
            });

            // Logs pour le pattern
            const logPayload = {
                Intensity: intensity,
                Duration: duration,
                Id: deviceId,
                Method: operation === 's' ? 1 : operation === 'v' ? 2 : 3,
                Type: 2,
                Hold: holdMode,
                Username: username,
                Code: 0,
                SessionHex: Math.random().toString(16).substr(2, 12)
            };

            await fetch("https://do.pishock.com/Client/LinkUpdateLogs", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: JSON.stringify(logPayload),
                mode: "cors",
                credentials: "omit"
            });
        } catch (error) {
            console.error('Erreur pattern:', error);
        }
    }

    // Configuration des boutons d'action
    function setupActionButtons() {
        document.getElementById('shock-btn').addEventListener('click', () => sendCommand('s'));
        document.getElementById('vibrate-btn').addEventListener('click', () => sendCommand('v'));
        document.getElementById('beep-btn').addEventListener('click', () => sendCommand('b'));
    }

    // Récupération automatique de l'ID depuis l'URL
    function getDeviceIdFromUrl() {
        try {
            const url = window.location.href;
            const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            const deviceId = urlParams.get('id');

            if (deviceId) {
                console.log('ID de l\'appareil détecté depuis l\'URL:', deviceId);
                return deviceId;
            }

            // Alternative: recherche dans l'URL complète
            const match = url.match(/[?&]id=([a-f0-9-]{36})/i);
            if (match) {
                console.log('ID de l\'appareil trouvé dans l\'URL:', match[1]);
                return match[1];
            }

            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID:', error);
            return null;
        }
    }

    // Auto-remplissage des champs
    function autoFillFields() {
        const deviceId = getDeviceIdFromUrl();
        if (deviceId) {
            const deviceIdField = document.getElementById('device-id');
            const deviceIdIndicator = document.getElementById('device-id-indicator');

            if (deviceIdField) {
                deviceIdField.value = deviceId;
                deviceIdField.style.background = 'linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))';
                deviceIdField.style.borderColor = 'rgba(34, 197, 94, 0.5)';

                // Afficher l'indicateur de détection automatique
                if (deviceIdIndicator) {
                    deviceIdIndicator.style.display = 'flex';
                }

                // Afficher une notification de succès
                const statusDisplay = document.getElementById('status-display');
                if (statusDisplay) {
                    statusDisplay.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#10b981"/>
                        </svg>
                        ID appareil détecté automatiquement depuis l'URL
                    `;
                    setTimeout(() => {
                        statusDisplay.textContent = "Prêt à envoyer des commandes";
                    }, 4000);
                }

                console.log(`✅ ID appareil configuré automatiquement: ${deviceId}`);
            }
        }
    }

    // Surveillance des changements d'URL
    function watchUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Attendre un peu que la nouvelle page se charge
                setTimeout(() => {
                    autoFillFields();
                }, 500);
            }
        }).observe(document, { subtree: true, childList: true });

        // Écouter aussi les événements de navigation
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                autoFillFields();
            }, 200);
        });
    }

    // Initialisation
    function init() {
        // Attendre que la page soit chargée
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        injectStyles();
        const panel = createEnhancedInterface();

        setTimeout(() => {
            updateSliderValues();
            setupBypassMode();
            setupPresets();
            setupPatterns();
            setupActionButtons();
            autoFillFields(); // Remplissage automatique après création de l'interface
            watchUrlChanges(); // Surveillance des changements d'URL
        }, 100);

        console.log('PiShock Enhanced Interface chargée avec succès!');
    }

    // Démarrage du script
    init();

})();