// ==UserScript==
// @name         BHB社区多主题插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  集成暗黑风、少女风、赛博风、复古风、海洋风、霓虹风6种主题
// @author       Qwen
// @match        https://boyshelpboys.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554642/BHB%E7%A4%BE%E5%8C%BA%E5%A4%9A%E4%B8%BB%E9%A2%98%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/554642/BHB%E7%A4%BE%E5%8C%BA%E5%A4%9A%E4%B8%BB%E9%A2%98%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主题管理器类
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('boyshelpboys_theme') || 'dark';
            this.isChatPage = window.location.href.includes('/plugin/bhbchat/') ||
                             document.querySelector('.chat-wrapper') !== null;
            this.themes = this.defineThemes();
            this.themeIndex = 0;
            this.scrollbarStyleElement = null;
            this.init();
        }

        // 定义主题配置
        defineThemes() {
            return {
                dark: {
                    name: '暗黑风',
                    css: `
                        /* --- 暗黑风主题 --- */
                        :root {
                            --bg-dark: #0a0a0a !important;
                            --bg-light: #121212 !important;
                            --bg-card: #0f0f0f !important;
                            --bg-hover: #1a1a1a !important;
                            --text: #f0f0f0 !important;
                            --text-secondary: #cccccc !important;
                            --text-muted: #999999 !important;
                            --primary: #bb86fc !important;
                            --border: #222222 !important;
                            --shadow: rgba(187, 134, 252, 0.3) !important;
                        }

                        body, html {
                            background: linear-gradient(135deg, #0a0a0a, #000000) !important;
                            color: var(--text) !important;
                        }

                        #header {
                            background: var(--bg-light) !important;
                            border-bottom: 1px solid var(--border) !important;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 1px solid var(--border) !important;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
                        }

                        .btn-primary {
                            background: var(--primary) !important;
                            color: white !important;
                        }

                        .chat-wrapper {
                            background: linear-gradient(135deg, #0a0a0a, #000000) !important;
                            color: var(--text) !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: var(--bg-light) !important;
                            border-bottom: 1px solid var(--border) !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: var(--primary) !important;
                            color: white !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 1px solid #444 !important;
                            box-shadow: 0 4px 15px rgba(187, 134, 252, 0.4) !important;
                        }

                        #theme-toggle-btn:hover {
                            background: #a870fa !important;
                            box-shadow: 0 6px 20px rgba(187, 134, 252, 0.6) !important;
                        }
                    `,
                    scrollbarColor: 'rgba(187, 134, 252, 0.3)' // 紫色半透明
                },
                kawaii: {
                    name: '少女风',
                    css: `
                        /* --- 少女风主题 --- */
                        :root {
                            --bg-dark: #ffe6f2 !important;
                            --bg-light: #fff0f5 !important;
                            --bg-card: #fff0f5 !important;
                            --bg-hover: #ffe6f2 !important;
                            --text: #d147a3 !important;
                            --text-secondary: #c71585 !important;
                            --text-muted: #e8989a !important;
                            --primary: #ff69b4 !important;
                            --border: #ff69b4 !important;
                            --shadow: rgba(255, 105, 180, 0.3) !important;
                        }

                        body, html {
                            background:
                                radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.1) 1px, transparent 1px),
                                radial-gradient(circle at 80% 80%, rgba(255, 105, 180, 0.1) 2px, transparent 2px),
                                linear-gradient(135deg, #fff0f5, #ffe6f2) !important;
                            background-size: 40px 40px, 30px 30px, cover !important;
                            background-attachment: fixed;
                            color: var(--text) !important;
                            font-family: 'Sarabun', 'Noto Sans JP', 'Microsoft YaHei', sans-serif !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            min-height: 100vh;
                        }

                        #header {
                            background: var(--bg-light) !important;
                            border-bottom: 2px dashed var(--primary) !important;
                            box-shadow: 0 0 15px var(--shadow) !important;
                            backdrop-filter: blur(10px) !important;
                        }

                        #header .navbar-brand, #header .nav-link {
                            color: var(--text) !important;
                        }

                        #header .navbar-brand:hover, #header .nav-link:hover {
                            color: #ff1493 !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 2px dashed var(--primary) !important;
                            border-radius: 16px !important;
                            box-shadow: 0 0 10px var(--shadow) !important;
                            padding: 15px !important;
                        }

                        .threadlist .thread:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 0 15px var(--shadow) !important;
                            border-color: #ff1493 !important;
                        }

                        .threadlist .thread .subject a {
                            color: var(--text) !important;
                            text-shadow: 0 0 3px rgba(255, 182, 193, 0.5) !important;
                        }

                        .threadlist .thread .subject a:hover {
                            color: #ff1493 !important;
                        }

                        .btn-primary {
                            background: var(--primary) !important;
                            color: white !important;
                            border-radius: 10px !important;
                            box-shadow: 0 4px 10px var(--shadow) !important;
                        }

                        .chat-wrapper {
                            background:
                                radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.1) 1px, transparent 1px),
                                radial-gradient(circle at 80% 80%, rgba(255, 105, 180, 0.1) 2px, transparent 2px),
                                linear-gradient(135deg, #fff0f5, #ffe6f2) !important;
                            background-size: 40px 40px, 30px 30px, cover !important;
                            color: var(--text) !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: var(--bg-light) !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: var(--primary) !important;
                            color: white !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 1px solid #ff69b4 !important;
                            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4) !important;
                        }

                        #theme-toggle-btn:hover {
                            background: #ff5cb1 !important;
                            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6) !important;
                        }
                    `,
                    scrollbarColor: 'rgba(255, 105, 180, 0.3)' // 粉色半透明
                },
                cyber: {
                    name: '赛博风',
                    css: `
                        /* --- 赛博风主题 --- */
                        :root {
                            --bg-dark: #0a0a12 !important;
                            --bg-light: #121220 !important;
                            --bg-card: #1a1a2e !important;
                            --bg-hover: #252540 !important;
                            --text: #00ffea !important;
                            --text-secondary: #00b3ff !important;
                            --text-muted: #6666ff !important;
                            --primary: #00ff9d !important;
                            --border: #00b3ff !important;
                            --shadow: rgba(0, 255, 234, 0.3) !important;
                        }

                        body, html {
                            background: linear-gradient(135deg, #0a0a12, #000022) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(0, 179, 255, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(0, 255, 157, 0.1) 0%, transparent 20%);
                            color: var(--text) !important;
                            font-family: 'Orbitron', 'Courier New', monospace !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            min-height: 100vh;
                        }

                        #header {
                            background: linear-gradient(90deg, var(--bg-light), #0a0a1a) !important;
                            border-bottom: 1px solid var(--border) !important;
                            box-shadow: 0 0 20px rgba(0, 255, 234, 0.2) !important;
                            backdrop-filter: blur(10px) !important;
                        }

                        #header .navbar-brand, #header .nav-link {
                            color: var(--text) !important;
                            text-shadow: 0 0 10px var(--shadow) !important;
                        }

                        #header .navbar-brand:hover, #header .nav-link:hover {
                            color: #00ff9d !important;
                            text-shadow: 0 0 15px var(--primary) !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 1px solid var(--border) !important;
                            border-radius: 8px !important;
                            box-shadow: 0 0 15px rgba(0, 255, 234, 0.2) !important;
                            padding: 15px !important;
                            position: relative;
                            overflow: hidden;
                        }

                        .threadlist .thread::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: linear-gradient(90deg, transparent, var(--primary), transparent);
                            animation: cyber-glow 3s infinite;
                        }

                        @keyframes cyber-glow {
                            0% { left: -100%; right: 100%; }
                            50% { left: 100%; right: -100%; }
                            100% { left: 100%; right: -100%; }
                        }

                        .threadlist .thread:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 0 20px rgba(0, 255, 157, 0.4) !important;
                            border-color: #00ff9d !important;
                        }

                        .threadlist .thread .subject a {
                            color: var(--text) !important;
                            text-shadow: 0 0 8px var(--shadow) !important;
                        }

                        .threadlist .thread .subject a:hover {
                            color: #00ff9d !important;
                            text-shadow: 0 0 12px var(--primary) !important;
                        }

                        .btn-primary {
                            background: linear-gradient(45deg, var(--primary), #00b3ff) !important;
                            color: #0a0a1a !important;
                            border: none !important;
                            border-radius: 8px !important;
                            box-shadow: 0 0 15px var(--shadow) !important;
                            font-weight: bold !important;
                            text-transform: uppercase !important;
                            letter-spacing: 1px !important;
                        }

                        .chat-wrapper {
                            background: linear-gradient(135deg, #0a0a12, #000022) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(0, 179, 255, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(0, 255, 157, 0.1) 0%, transparent 20%);
                            color: var(--text) !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                            box-shadow: 0 0 20px rgba(0, 255, 234, 0.2) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: linear-gradient(90deg, var(--bg-light), #0a0a1a) !important;
                            color: var(--text) !important;
                            text-shadow: 0 0 10px var(--shadow) !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: linear-gradient(45deg, var(--primary), #00b3ff) !important;
                            color: #0a0a1a !important;
                            font-weight: bold !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: linear-gradient(45deg, var(--primary), #00b3ff) !important;
                            color: #0a0a1a !important;
                            border: 1px solid #00b3ff !important;
                            box-shadow: 0 4px 15px rgba(0, 255, 234, 0.4) !important;
                            font-weight: bold !important;
                        }

                        #theme-toggle-btn:hover {
                            background: linear-gradient(45deg, #00e68a, #0099ff) !important;
                            box-shadow: 0 6px 20px rgba(0, 255, 234, 0.6) !important;
                        }
                    `,
                    scrollbarColor: 'rgba(0, 255, 234, 0.3)' // 青绿色半透明
                },
                retro: {
                    name: '复古风',
                    css: `
                        /* --- 复古风主题 --- */
                        :root {
                            --bg-dark: #e6d3a7 !important;
                            --bg-light: #f0e6d2 !important;
                            --bg-card: #f5f0e1 !important;
                            --bg-hover: #e6d3a7 !important;
                            --text: #5c4033 !important;
                            --text-secondary: #8b4513 !important;
                            --text-muted: #a0522d !important;
                            --primary: #d2691e !important;
                            --border: #d2691e !important;
                            --shadow: rgba(210, 105, 30, 0.3) !important;
                        }

                        body, html {
                            background: linear-gradient(135deg, #f5f0e1, #e6d3a7) !important;
                            background-image:
                                radial-gradient(circle at 20% 80%, rgba(210, 105, 30, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%);
                            color: var(--text) !important;
                            font-family: 'Courier New', 'Georgia', serif !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            min-height: 100vh;
                        }

                        #header {
                            background: linear-gradient(90deg, var(--bg-light), #d4c19c) !important;
                            border-bottom: 2px solid var(--primary) !important;
                            box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2) !important;
                            backdrop-filter: blur(5px) !important;
                        }

                        #header .navbar-brand, #header .nav-link {
                            color: var(--text) !important;
                            font-weight: bold !important;
                        }

                        #header .navbar-brand:hover, #header .nav-link:hover {
                            color: var(--primary) !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 2px solid var(--primary) !important;
                            border-radius: 12px !important;
                            box-shadow: 4px 4px 0px var(--border) !important;
                            padding: 15px !important;
                            position: relative;
                        }

                        .threadlist .thread::before {
                            content: '';
                            position: absolute;
                            top: -4px;
                            left: -4px;
                            right: 4px;
                            bottom: 4px;
                            border: 2px solid var(--bg-card);
                            pointer-events: none;
                        }

                        .threadlist .thread:hover {
                            transform: translate(2px, 2px);
                            box-shadow: 2px 2px 0px var(--primary) !important;
                            border-color: #8b4513 !important;
                        }

                        .threadlist .thread .subject a {
                            color: var(--text) !important;
                            font-weight: bold !important;
                        }

                        .threadlist .thread .subject a:hover {
                            color: var(--primary) !important;
                        }

                        .btn-primary {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 2px solid #8b4513 !important;
                            border-radius: 8px !important;
                            box-shadow: 2px 2px 0px #8b4513 !important;
                            font-weight: bold !important;
                        }

                        .chat-wrapper {
                            background: linear-gradient(135deg, #f5f0e1, #e6d3a7) !important;
                            background-image:
                                radial-gradient(circle at 20% 80%, rgba(210, 105, 30, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%);
                            color: var(--text) !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: linear-gradient(90deg, var(--bg-light), #d4c19c) !important;
                            color: var(--text) !important;
                            font-weight: bold !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 2px solid #8b4513 !important;
                            box-shadow: 2px 2px 0px #8b4513 !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 2px solid #8b4513 !important;
                            box-shadow: 2px 2px 0px #8b4513 !important;
                        }

                        #theme-toggle-btn:hover {
                            background: #c85e17 !important;
                            box-shadow: 4px 4px 0px #8b4513 !important;
                        }
                    `,
                    scrollbarColor: 'rgba(210, 105, 30, 0.3)' // 棕色半透明
                },
                ocean: {
                    name: '海洋风',
                    css: `
                        /* --- 海洋风主题 --- */
                        :root {
                            --bg-dark: #1e3a8a !important;
                            --bg-light: #3b82f6 !important;
                            --bg-card: #e0f2fe !important;
                            --bg-hover: #bae6fd !important;
                            --text: #0c4a6e !important;
                            --text-secondary: #082f49 !important;
                            --text-muted: #0c7c59 !important;
                            --primary: #0ea5e9 !important;
                            --border: #0ea5e9 !important;
                            --shadow: rgba(14, 165, 233, 0.3) !important;
                        }

                        body, html {
                            background: linear-gradient(135deg, #1e3a8a, #0c4a6e) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 20%);
                            color: var(--text) !important;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            min-height: 100vh;
                        }

                        #header {
                            background: linear-gradient(90deg, var(--bg-light), #1e3a8a) !important;
                            border-bottom: 1px solid var(--border) !important;
                            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3) !important;
                            backdrop-filter: blur(5px) !important;
                        }

                        #header .navbar-brand, #header .nav-link {
                            color: white !important;
                            font-weight: 500 !important;
                        }

                        #header .navbar-brand:hover, #header .nav-link:hover {
                            color: #bae6fd !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 1px solid var(--border) !important;
                            border-radius: 10px !important;
                            box-shadow: 0 4px 6px rgba(14, 165, 233, 0.1) !important;
                            padding: 15px !important;
                            transition: all 0.3s ease;
                            position: relative;
                            overflow: hidden;
                        }

                        .threadlist .thread::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 3px;
                            background: linear-gradient(90deg, transparent, var(--primary), transparent);
                        }

                        .threadlist .thread:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 6px 12px rgba(14, 165, 233, 0.2) !important;
                            border-color: #0284c7 !important;
                        }

                        .threadlist .thread .subject a {
                            color: var(--text) !important;
                            font-weight: 500 !important;
                        }

                        .threadlist .thread .subject a:hover {
                            color: var(--primary) !important;
                        }

                        .btn-primary {
                            background: var(--primary) !important;
                            color: white !important;
                            border: none !important;
                            border-radius: 8px !important;
                            padding: 8px 16px !important;
                            font-weight: 500 !important;
                            box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3) !important;
                            transition: all 0.2s ease;
                        }

                        .btn-primary:hover {
                            background: #0284c7 !important;
                            box-shadow: 0 6px 8px rgba(14, 165, 233, 0.4) !important;
                        }

                        .chat-wrapper {
                            background: linear-gradient(135deg, #1e3a8a, #0c4a6e) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 20%);
                            color: white !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                            color: var(--text) !important;
                            border-radius: 10px !important;
                            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: linear-gradient(90deg, var(--bg-light), #1e3a8a) !important;
                            color: white !important;
                            font-weight: 500 !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: none !important;
                            border-radius: 6px !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: var(--primary) !important;
                            color: white !important;
                            border: 1px solid #0ea5e9 !important;
                            box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4) !important;
                        }

                        #theme-toggle-btn:hover {
                            background: #0284c7 !important;
                            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6) !important;
                        }
                    `,
                    scrollbarColor: 'rgba(14, 165, 233, 0.3)' // 海洋蓝色半透明
                },
                neon: {
                    name: '霓虹风',
                    css: `
                        /* --- 霓虹风主题 --- */
                        :root {
                            --bg-dark: #0a0a0a !important;
                            --bg-light: #0f0f0f !important;
                            --bg-card: #111111 !important;
                            --bg-hover: #1a1a1a !important;
                            --text: #ffffff !important;
                            --text-secondary: #f0f0f0 !important;
                            --text-muted: #cccccc !important;
                            --primary: #ff00ff !important;
                            --border: #ff00ff !important;
                            --shadow: rgba(255, 0, 255, 0.5) !important;
                        }

                        body, html {
                            background: linear-gradient(135deg, #0a0a0a, #000000) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 20%);
                            color: var(--text) !important;
                            font-family: 'Orbitron', 'Courier New', monospace !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            min-height: 100vh;
                        }

                        #header {
                            background: linear-gradient(90deg, var(--bg-light), #0a0a0a) !important;
                            border-bottom: 1px solid var(--border) !important;
                            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3) !important;
                            backdrop-filter: blur(10px) !important;
                        }

                        #header .navbar-brand, #header .nav-link {
                            color: var(--text) !important;
                            text-shadow: 0 0 10px var(--shadow) !important;
                        }

                        #header .navbar-brand:hover, #header .nav-link:hover {
                            color: #00ffff !important;
                            text-shadow: 0 0 15px #00ffff !important;
                        }

                        .threadlist .thread {
                            background: var(--bg-card) !important;
                            border: 1px solid var(--border) !important;
                            border-radius: 8px !important;
                            box-shadow: 0 0 15px rgba(255, 0, 255, 0.3) !important;
                            padding: 15px !important;
                            position: relative;
                            overflow: hidden;
                            transition: all 0.3s ease;
                        }

                        .threadlist .thread::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: linear-gradient(90deg, transparent, var(--primary), transparent);
                            animation: neon-glow 3s infinite;
                        }

                        @keyframes neon-glow {
                            0% { left: -100%; right: 100%; }
                            50% { left: 100%; right: -100%; }
                            100% { left: 100%; right: -100%; }
                        }

                        .threadlist .thread:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 0 20px rgba(255, 0, 255, 0.5) !important;
                            border-color: #00ffff !important;
                        }

                        .threadlist .thread .subject a {
                            color: var(--text) !important;
                            text-shadow: 0 0 8px var(--shadow) !important;
                        }

                        .threadlist .thread .subject a:hover {
                            color: #00ffff !important;
                            text-shadow: 0 0 12px #00ffff !important;
                        }

                        .btn-primary {
                            background: linear-gradient(45deg, var(--primary), #00ffff) !important;
                            color: #0a0a0a !important;
                            border: none !important;
                            border-radius: 8px !important;
                            box-shadow: 0 0 15px var(--shadow) !important;
                            font-weight: bold !important;
                            text-transform: uppercase !important;
                            letter-spacing: 1px !important;
                        }

                        .chat-wrapper {
                            background: linear-gradient(135deg, #0a0a0a, #000000) !important;
                            background-image:
                                radial-gradient(circle at 10% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 20%),
                                radial-gradient(circle at 90% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 20%);
                            color: var(--text) !important;
                        }

                        .chat-wrapper .chat-container {
                            background: var(--bg-card) !important;
                            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3) !important;
                        }

                        .chat-wrapper .chat-header {
                            background: linear-gradient(90deg, var(--bg-light), #0a0a0a) !important;
                            color: var(--text) !important;
                            text-shadow: 0 0 10px var(--shadow) !important;
                        }

                        .chat-wrapper #sendBtn {
                            background: linear-gradient(45deg, var(--primary), #00ffff) !important;
                            color: #0a0a0a !important;
                            font-weight: bold !important;
                        }
                    `,
                    buttonStyle: `
                        #theme-toggle-btn {
                            background: linear-gradient(45deg, var(--primary), #00ffff) !important;
                            color: #0a0a0a !important;
                            border: 1px solid #ff00ff !important;
                            box-shadow: 0 4px 15px rgba(255, 0, 255, 0.5) !important;
                            font-weight: bold !important;
                        }

                        #theme-toggle-btn:hover {
                            background: linear-gradient(45deg, #e600e6, #00e6e6) !important;
                            box-shadow: 0 6px 20px rgba(255, 0, 255, 0.7) !important;
                        }
                    `,
                    scrollbarColor: 'rgba(255, 0, 255, 0.3)' // 霓虹粉色半透明
                }
            };
        }

        // 初始化插件
        init() {
            this.themeIndex = Object.keys(this.themes).indexOf(this.currentTheme);
            this.applyTheme();
            this.createThemeToggleBtn();
            this.themeCustomScrollbar();

            if (this.isChatPage) {
                this.forceChatTheme();
            } else {
                this.initViewToggle();
            }

            this.fixButtonPosition();
        }

        // 应用当前主题
        applyTheme() {
            this.removeStyles();
            const theme = this.themes[this.currentTheme];
            if (theme) {
                // 添加主题CSS
                const style = document.createElement('style');
                style.textContent = theme.css;
                style.setAttribute('data-theme-style', `${this.currentTheme}-theme`);
                document.head.appendChild(style);

                // 添加按钮样式
                const buttonStyle = document.createElement('style');
                buttonStyle.textContent = theme.buttonStyle;
                buttonStyle.setAttribute('data-theme-button-style', `${this.currentTheme}-button`);
                document.head.appendChild(buttonStyle);
            }
        }

        // 移除所有自定义样式
        removeStyles() {
            document.querySelectorAll('style[data-theme-style]').forEach(el => el.remove());
            document.querySelectorAll('style[data-theme-toggle-style]').forEach(el => el.remove());
            document.querySelectorAll('style[data-theme-button-style]').forEach(el => el.remove());
        }

        // 创建主题切换按钮
        createThemeToggleBtn() {
            // 移除之前的按钮
            document.querySelectorAll('#theme-toggle-btn').forEach(el => el.remove());

            const btn = document.createElement('button');
            btn.id = 'theme-toggle-btn';
            btn.innerHTML = this.themes[this.currentTheme]?.name || '主题切换';
            btn.title = `当前主题：${this.themes[this.currentTheme]?.name || '未知主题'}，点击切换主题`;
            btn.onclick = () => {
                this.nextTheme();
            };

            document.body.appendChild(btn);
        }

        // 切换到下一个主题
        nextTheme() {
            const themeKeys = Object.keys(this.themes);
            this.themeIndex = (this.themeIndex + 1) % themeKeys.length;
            this.currentTheme = themeKeys[this.themeIndex];
            localStorage.setItem('boyshelpboys_theme', this.currentTheme);
            this.applyTheme();
            this.createThemeToggleBtn();
            this.updateScrollbarStyle(); // 更新滚动条样式
            this.fixButtonPosition();
        }

        // 主题化自定义滚动条 - 现在动态更新
        themeCustomScrollbar() {
            // 创建滚动条样式元素
            this.scrollbarStyleElement = document.createElement('style');
            this.scrollbarStyleElement.id = 'scrollbar-theme-style';
            this.updateScrollbarStyle();
            document.head.appendChild(this.scrollbarStyleElement);

            // 应用基本滚动条样式
            GM_addStyle(`
                /* 隐藏原生滚动条 */
                html {
                    scrollbar-width: none !important; /* Firefox */
                    -ms-overflow-style: none !important; /* IE/Edge */
                }

                html::-webkit-scrollbar {
                    display: none !important; /* Chrome/Safari */
                }
            `);
        }

        // 更新滚动条样式
        updateScrollbarStyle() {
            if (!this.scrollbarStyleElement) return;

            const theme = this.themes[this.currentTheme];
            const scrollbarColor = theme?.scrollbarColor || 'rgba(187, 134, 252, 0.3)';
            const hoverScrollbarColor = scrollbarColor.replace('0.3', '0.5');

            this.scrollbarStyleElement.textContent = `
                /* 主题化自定义滚动条 - 统一白色文字 */
                #custom-scrollbar {
                    position: fixed !important;
                    right: 0 !important;
                    top: 10px !important;
                    bottom: 10px !important;
                    width: 10px !important;
                    background-color: ${scrollbarColor} !important;
                    border-radius: 5px !important;
                    z-index: 9999 !important;
                    transition: opacity 0.3s ease !important;
                }

                #custom-scrollbar-thumb {
                    position: absolute !important;
                    right: 0 !important;
                    width: 10px !important;
                    background-color: ${scrollbarColor} !important;
                    border-radius: 5px !important;
                    cursor: pointer !important;
                    transition: background-color 0.2s ease, top 0.6s ease-out !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 5px 0 !important;
                }

                #custom-scrollbar-thumb:hover {
                    background-color: ${hoverScrollbarColor} !important;
                }

                .custom-scrollbar-text {
                    color: #ffffff !important; /* 统一白色文字 */
                    font-size: 9px !important;
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    user-select: none !important;
                    pointer-events: none !important;
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.6) !important; /* 强化阴影 */
                    opacity: 1 !important; /* 最高不透明度 */
                    padding: 2px 0 !important;
                    text-align: center !important;
                }
            `;
        }

        // 初始化视图切换功能
        initViewToggle() {
            // 等待DOM加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupViewToggle());
            } else {
                this.setupViewToggle();
            }
        }

        // 设置视图切换
        setupViewToggle() {
            const threadlist = document.querySelector('.threadlist');
            if (!threadlist) return;

            // 创建视图切换按钮（如果不存在）
            let toggleButton = document.querySelector('.view-toggle-btn');
            if (!toggleButton) {
                const navTabs = document.querySelector('.card-threadlist .nav-tabs');
                if (navTabs) {
                    toggleButton = document.createElement('button');
                    toggleButton.className = 'view-toggle-btn';
                    toggleButton.title = '切换视图';
                    toggleButton.style.cssText = 'position: absolute; right: 15px; top: 8px;';
                    toggleButton.innerHTML = '<i class="icon-list" id="view-icon"></i>';
                    navTabs.parentElement.appendChild(toggleButton);

                    // 添加点击事件
                    toggleButton.addEventListener('click', () => this.toggleView());
                }
            }

            // 恢复用户偏好
            const savedView = localStorage.getItem('thread_view_preference') || 'list';
            threadlist.classList.add(`${savedView}-view`);

            // 更新图标
            this.updateViewIcon(savedView);
        }

        // 切换视图
        toggleView() {
            const threadlist = document.querySelector('.threadlist');
            if (!threadlist) return;

            const currentView = localStorage.getItem('thread_view_preference') || 'list';
            const newView = currentView === 'list' ? 'grid' : 'list';

            // 移除当前视图类
            threadlist.classList.remove(`${currentView}-view`);

            // 添加新视图类
            threadlist.classList.add(`${newView}-view`);

            // 更新图标
            this.updateViewIcon(newView);

            // 保存用户偏好
            localStorage.setItem('thread_view_preference', newView);
        }

        // 更新视图图标
        updateViewIcon(view) {
            const icon = document.getElementById('view-icon');
            if (icon) {
                icon.className = view === 'list' ? 'icon-list' : 'icon-th';
            }
        }

        // 强制覆盖聊天室主题
        forceChatTheme() {
            // 等待聊天室元素加载
            const chatContainer = document.querySelector('.chat-wrapper');
            if (chatContainer) {
                // 强制移除聊天室的暗色主题属性
                chatContainer.setAttribute('data-theme', 'light');

                // 监听DOM变化，持续覆盖样式
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        // 如果聊天室容器的data-theme被重置为dark，立即改回light
                        if (mutation.type === 'attributes' &&
                            mutation.target === chatContainer &&
                            mutation.attributeName === 'data-theme' &&
                            chatContainer.getAttribute('data-theme') === 'dark') {
                            chatContainer.setAttribute('data-theme', 'light');
                        }

                        // 检查是否有新的子元素被添加，重新应用样式
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // 元素节点
                                // 强制应用样式到新添加的元素
                                node.style.setProperty('background', 'transparent', 'important');
                                node.style.setProperty('color', 'var(--text)', 'important');
                            }
                        });
                    });
                });

                observer.observe(chatContainer, {
                    attributes: true,
                    attributeFilter: ['data-theme'],
                    childList: true,
                    subtree: true
                });

                // 特别处理发送按钮
                setTimeout(() => {
                    const sendBtn = document.querySelector('#sendBtn');
                    if (sendBtn) {
                        // 强制应用样式
                        sendBtn.style.setProperty('background', 'var(--primary)', 'important');
                        sendBtn.style.setProperty('color', 'white', 'important');
                        sendBtn.style.setProperty('border', 'none', 'important');
                        sendBtn.style.setProperty('border-radius', '8px', 'important');
                        sendBtn.style.setProperty('padding', '8px 16px', 'important');
                        sendBtn.style.setProperty('cursor', 'pointer', 'important');
                        sendBtn.style.setProperty('font-weight', '500', 'important');
                        sendBtn.style.setProperty('box-shadow', '0 4px 10px var(--shadow)', 'important');
                        sendBtn.style.setProperty('outline', 'none', 'important');
                    }
                }, 1000); // 稍后应用，确保按钮已加载

                // 持续监控聊天室背景
                setInterval(() => {
                    const chatContainer = document.querySelector('.chat-wrapper');
                    if (chatContainer) {
                        chatContainer.style.setProperty('background', 'linear-gradient(135deg, var(--bg-dark), var(--bg-light))', 'important');
                        chatContainer.style.setProperty('color', 'var(--text)', 'important');

                        const chatBox = document.querySelector('.chat-container');
                        if (chatBox) {
                            chatBox.style.setProperty('background', 'var(--bg-card)', 'important');
                            chatBox.style.setProperty('color', 'var(--text)', 'important');
                        }

                        const chatHeader = document.querySelector('.chat-header');
                        if (chatHeader) {
                            chatHeader.style.setProperty('background', 'var(--bg-light)', 'important');
                            chatHeader.style.setProperty('color', 'var(--text)', 'important');
                        }
                    }
                }, 2000); // 每2秒检查一次
            }
        }

        // 修复按钮位置
        fixButtonPosition() {
            const btn = document.getElementById('theme-toggle-btn');
            if (btn) {
                // 确保按钮在右下角
                btn.style.position = 'fixed';
                btn.style.bottom = '20px';
                btn.style.right = '20px';
                btn.style.zIndex = '99999';
                btn.style.padding = '10px 15px';
                btn.style.border = 'none';
                btn.style.borderRadius = '25px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';
                btn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                btn.style.transition = 'all 0.3s ease';
                btn.style.fontSize = '14px';
                btn.style.minWidth = '120px';
                btn.style.textAlign = 'center';
            }
        }
    }

    // 启动主题管理器
    new ThemeManager();
})();



