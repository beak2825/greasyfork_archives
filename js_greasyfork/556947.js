// ==UserScript==
// @name         Google AI Studio 繁體中文化腳本 (台灣最佳化版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google AI Studio 100% 全量繁體中文化，針對台灣用語習慣最佳化 (專案、設定、影片、金鑰)，基於 1000+ 條精準數據，完美覆蓋 Gemini 3、儀表板、計費、API 管理等所有深層介面，徹底修復圖示亂碼問題。
// @author       黄天祺
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556947/Google%20AI%20Studio%20%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E5%8C%96%E8%85%B3%E6%9C%AC%20%28%E5%8F%B0%E7%81%A3%E6%9C%80%E4%BD%B3%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556947/Google%20AI%20Studio%20%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E5%8C%96%E8%85%B3%E6%9C%AC%20%28%E5%8F%B0%E7%81%A3%E6%9C%80%E4%BD%B3%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    //  1. 終極字典 (台灣用語最佳化 + X 光掃描數據)
    // =========================================================
    const i18nMap = {
        // ===========================
        // 🔴 緊急修復 (Dashboard 選單 - 台灣慣用詞)
        // ===========================
        "API keys": "API 金鑰",
        "Projects": "專案管理",
        "Usage and Billing": "用量與計費",
        "Logs and Datasets": "記錄與資料集",
        "Changelog": "更新記錄",
        "Billing Support": "計費支援",
        "Project filter": "專案篩選",
        "Import projects": "匯入專案",
        "Create a new project": "建立新專案",
        "Search for a project": "搜尋專案",
        "Only imported projects appear here. If you don't see your projects, you can import projects from Google Cloud on this page.": "僅顯示已匯入的專案。如果沒看到您的專案，可以在此頁面從 Google Cloud 匯入。",

        // ===========================
        // 🆕 v14.0 新增補充數據 (繁體化)
        // ===========================
        "+ Create new instruction": "+ 新增指令",
        "Add stop...": "新增停止符...",
        "Choose a paid API key": "選擇付費 API 金鑰",
        "Delete system instruction": "刪除系統指令",
        "Design a REST API for a social media platform.": "為社群媒體平台設計 REST API。",
        "Explain the probability of rolling two dice and getting 7": "解釋擲兩顆骰子得到 7 的機率",
        "Generate Python code for a simple calculator app": "生成簡易計算機應用程式的 Python 程式碼",
        "Go to Projects Page": "前往專案頁面",
        "Google AI Studio logo": "Google AI Studio 圖示",
        "Instructions are saved in local storage.": "指令已儲存至本機儲存空間。",
        "Learn more about how Google uses cookies. Opens in a new tab.": "瞭解 Google 如何使用 Cookie（在新分頁中開啟）。",
        "Nano Banana Pro": "Nano Banana Pro",
        "Saved": "已儲存",
        "SiliconFlow API: Batch Size & Threads": "SiliconFlow API: 批次大小與執行緒",
        "Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it": "教我一元二次方程式。假設我對此一無所知",
        "Temporary chat toggle": "臨時對話開關",
        "Title": "標題",
        "You have no Paid Project. Please view the Projects Page to choose a Project and Upgrade.": "您沒有付費專案。請前往專案頁面選擇專案並升級。",
        "data use policy": "資料使用政策",
        "'Item: Apple, Price: $1'. Extract name, price to JSON.": "'商品: Apple, 價格: $1'。提取名稱和價格為 JSON。",
        "Gemini 3 Pro Image Preview": "Gemini 3 Pro 影像預覽版",
        "End Tokens": "結束 Token",
        "API pricing per 1M tokens.": "每百萬 Token API 定價。",

        // 模型與工具描述補充
        "Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation.": "我們的 2.5 Flash 語音模型，針對高性價比、低延遲和可控語音生成進行了最佳化。",
        "Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts.": "我們的 2.5 Pro 語音模型，針對強大的低延遲生成能力進行了最佳化，輸出更自然，更易引導。",
        "Our latest image generation model, with significantly better text rendering and better overall image quality.": "最新的影像生成模型，具有顯著更好的文字渲染和整體影像品質。",
        "Our most balanced multimodal model with great performance across all tasks.": "最均衡的多模態模型，在各項任務中表現優異。",
        "Our native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood.": "原生音訊模型，針對音質、節奏、自然度、詳細程度和情緒進行了最佳化。",
        "Our smallest and most cost effective model, built for at scale usage.": "最小且最具成本效益的模型，專為大規模使用打造。",
        "Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API.": "最先進的影片生成模型 (僅限 Gemini API 付費層級開發者)。",
        
        // 複雜提示與Cookie
        "Google AI Studio uses cookies to deliver and enhance the quality of its services and to analyze traffic. If you agree, cookies are also used to serve advertising and to personalize the content and advertisements that you see.": "Google AI Studio 使用 Cookie 來交付並提高其服務品質，並分析流量。如果您同意，Cookie 也將用於提供廣告以及個人化您看到的內容和廣告。",
        "Lets you define functions that Gemini can call\n\n This tool is not compatible with the current active tools.": "允許定義 Gemini 可呼叫的函式\n\n此工具與目前啟用的工具不相容。",
        "Optional tone and style instructions for the model": "設定模型的語氣和風格（選用）",
        "Press space for more information.": "按空白鍵查看更多資訊。",
        "Submit: Ctrl + Enter\nNewline: Enter": "傳送: Ctrl + Enter\n換行: Enter",
        "Submit: Enter\nNewline: Shift + Enter": "傳送: Enter\n換行: Shift + Enter",

        // ===========================
        // 🟡 X 光掃描全量數據 (A-Z 繁體化)
        // ===========================
        "(Recommended) Maximizes reasoning depth": "(推薦) 最大化推理深度",
        "1 Day": "1 天",
        "7 Days": "7 天",
        "28 Days": "28 天",
        "90 Days": "90 天",
        "Add a context-aware chatbot to your app. Give your users a support agent that remembers the conversation, perfect for multi-step bookings or troubleshooting.": "為您的應用程式新增具有上下文感知能力的聊天機器人。提供能記住對話的客服代理，非常適合多步驟預訂或故障排除。",
        "Add a feature to provide live, real-time transcription of any audio feed for your users.": "新增即時音訊轉錄功能。",
        "Add files": "新增檔案",
        "Add input": "新增輸入",
        "Add lightning-fast, real-time responses to your app using 2.5 Flash-Lite. Perfect for instant auto-completes, or conversational agents that feel alive.": "使用 2.5 Flash-Lite 新增極速即時回應。非常適合即時自動完成或栩栩如生的對話代理。",
        "Add output": "新增輸出",
        "Add powerful photo editing to your app. Allow users to add objects, remove backgrounds, or change a photo's style just by typing.": "新增強大的相片編輯功能。允許使用者透過打字來新增物件、移除背景或更改相片風格。",
        "Add stop sequence": "新增停止序列",
        "Add stop token": "新增停止 Token",
        "Add video generation to your creative app. Let users turn their blog posts, scripts, or product descriptions into short video clips.": "新增影片生成功能。讓使用者將部落格文章、劇本或產品描述轉化為短影片。",
        "Adjust harmful response settings": "調整有害內容回應設定",
        "Advanced settings": "進階設定",
        "Agree": "同意",
        "All": "全部",
        "All Models": "所有模型",
        "All apps": "所有應用程式",
        "All context lengths": "所有上下文長度",
        "All datasets": "所有資料集",
        "All models": "所有模型",
        "All projects": "所有專案",
        "All time": "全部時間",
        "Already in a new chat": "已處於新對話中",
        "An empty app": "空白應用程式",
        "Analyze images": "影像分析",
        "Animate images with Veo": "使用 Veo 讓影像動起來",
        "Append to prompt and run (Ctrl + Enter)": "新增到提示詞並執行 (Ctrl + Enter)",
        "Audio": "音訊",
        "Auto-Hunter": "自動獵人 (Auto-Hunter)",
        "Average Latency": "平均延遲",
        "Back": "返回",
        "Bad response": "回答得差",
        "Billing": "計費",
        "Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate a character's portrait.": "使用 Veo 3 讓影像動起來。上傳產品相片生成動態影片廣告，或讓角色肖像動起來。",
        "Browse the app gallery": "瀏覽應用程式庫",
        "Browse the url context": "瀏覽 URL 上下文",
        "Build": "建構",
        "Build apps with Gemini": "使用 Gemini 建構應用程式",
        "Build your ideas with Gemini": "用 Gemini 實現您的創意",
        "Camera": "相機",
        "Cancel": "取消",
        "Category": "分類",
        "Charts": "圖表",
        "Chat": "對話",
        "Chat prompt": "對話提示詞",
        "Chat with models": "與模型對話",
        "Clear": "清除",
        "Clear search query": "清除搜尋",
        "Close": "關閉",
        "Close panel": "關閉面板",
        "Close run settings panel": "關閉執行設定面板",
        "Code execution": "程式碼執行 (Python)",
        "Code gen": "程式碼生成",
        "Collapse": "收起",
        "Collapse code snippet": "摺疊程式碼片段",
        "Collapse prompts history": "摺疊歷史記錄",
        "Compare mode": "比較模式",
        "Confirm": "確認",
        "Connect your app to real-time Google Maps data. Build an agent that can pull information about places, routes, or directions.": "連接即時 Google 地圖資料。建構能獲取地點、路線或方向資訊的代理。",
        "Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.": "連接即時 Google 搜尋結果。建構能討論時事、引用新聞或查核事實的代理。",
        "Conversation turn navigation": "對話輪次導航",
        "Copied": "已複製",
        "Copy": "複製",
        "Copy API key": "複製 API 金鑰",
        "Copy project ID": "複製專案 ID",
        "Copy to clipboard": "複製到剪貼簿",
        "Create API key": "建立 API 金鑰",
        "Create a new app": "建立新應用程式",
        "Create conversational voice apps": "建立對話式語音應用程式",
        "Create dataset": "建立資料集",
        "Create new": "新建",
        "Create new dataset": "建立新資料集",
        "Create voxel art scenes inspired by any image.": "根據影像創作體素藝術場景。",
        "Create your first app": "建立您的第一個應用程式",
        "Create, visualize, and rebuild sculptures using the same set of blocks.": "使用同一套積木建立、視覺化和重建雕塑。",
        "Created": "已建立",
        "Created by others": "他人建立",
        "Created by you": "由您建立",
        "Created on": "建立於",
        "Creativity": "創意工具",
        "Dark": "深色模式",
        "Dashboard": "儀表板",
        "Dataset": "資料集",
        "Datasets": "資料集",
        "Date created": "建立日期",
        "Date modified": "修改日期",
        "Default": "預設",
        "Delete": "刪除",
        "Describe an object, icon, or scene, and we'll render it as vector art.": "描述物體、圖示或場景，我們將渲染為向量藝術。",
        "Describe your idea": "描述您的想法",
        "Design and Typography": "設計與排版",
        "Design and typography": "設計與排版",
        "Developer docs": "開發者文件",
        "Developer quickstarts": "開發者快速入門",
        "Discover and remix app ideas": "發現並改編應用創意",
        "Dismiss": "忽略",
        "Documentation": "文件",
        "Done": "完成",
        "Download": "下載",
        "Edit": "編輯",
        "Edit JSON schema": "編輯 JSON 架構",
        "Edit function declarations": "編輯函式宣告",
        "Edit prompt title and description": "編輯標題和描述",
        "Edit safety settings": "編輯安全設定",
        "Edit title and description": "編輯標題和描述",
        "Education": "教育學習",
        "Embed Gemini in your app to complete all sorts of tasks - analyze content, make edits, and more": "將 Gemini 嵌入應用程式以完成各種任務——分析內容、編輯等等",
        "Enable logging": "啟用記錄",
        "Enable your app to see and understand images. Allow users to upload a photo of a receipt, a menu, or a chart to get instant data extraction, translations, or summaries.": "讓應用程式能看懂影像。允許使用者上傳收據、菜單或圖表，即時提取資料、翻譯或摘要。",
        "Enter a prompt to generate an app": "輸入提示詞以生成應用程式",
        "Error Rate": "錯誤率",
        "Expand": "展開",
        "Expand or collapse advanced settings": "展開/摺疊進階設定",
        "Expand or collapse tools": "展開/摺疊工具",
        "Expand prompts history": "展開歷史記錄",
        "Expand to view model thoughts": "展開查看模型思考",
        "Explore docs": "瀏覽文件",
        "Explore the gallery": "探索應用程式庫",
        "Export to code": "匯出程式碼",
        "FAQ": "常見問題",
        "Fast AI responses": "快速 AI 回應",
        "Featured": "精選推薦",
        "Few Shot": "少樣本 (Few Shot)",
        "Filter by": "篩選方式",
        "Filter by dataset": "按資料集篩選",
        "Filter by model": "按模型篩選",
        "Filter by rating": "按評分篩選",
        "Filter by status": "按狀態篩選",
        "Filter by time range": "按時間範圍篩選",
        "Filter by tools": "按工具篩選",
        "Filter the list of my apps": "篩選我的應用程式列表",
        "For Gemini 3, best results at default 1.0. Lower values may impact reasoning.": "對於 Gemini 3，預設為 1.0 效果最佳。較低值可能影響推理。",
        "Free tier": "免費層級",
        "Function calling": "函式呼叫",
        "Gallery": "應用程式庫",
        "Games": "遊戲",
        "Games and Visualizations": "遊戲與視覺化",
        "Gemini": "Gemini",
        "Gemini 2.0 Flash": "Gemini 2.0 Flash",
        "Gemini 2.0 Flash-Lite": "Gemini 2.0 Flash-Lite",
        "Gemini 2.5 Flash": "Gemini 2.5 Flash",
        "Gemini 2.5 Flash Image": "Gemini 2.5 Flash 影像版",
        "Gemini 2.5 Flash Native Audio Preview 09-2025": "Gemini 2.5 Flash 原生音訊預覽版",
        "Gemini 2.5 Flash Preview TTS": "Gemini 2.5 Flash TTS 預覽版",
        "Gemini 2.5 Flash-Lite": "Gemini 2.5 Flash-Lite",
        "Gemini 2.5 Pro": "Gemini 2.5 Pro",
        "Gemini 2.5 Pro Preview TTS": "Gemini 2.5 Pro TTS 預覽版",
        "Gemini 2.5 Pro TTS": "Gemini 2.5 Pro TTS",
        "Gemini 3 Pro": "Gemini 3 Pro",
        "Gemini 3 Pro Preview": "Gemini 3 Pro 預覽版",
        "Gemini 3 is here": "Gemini 3 已發布",
        "Gemini 3: Our most intelligent model to date.": "Gemini 3: 我們迄今為止最智慧的模型。",
        "Gemini API": "Gemini API",
        "Gemini API Billing": "Gemini API 計費",
        "Gemini API Logs and Datasets": "Gemini API 記錄與資料集",
        "Gemini API Rate Limit": "Gemini API 速率限制",
        "Gemini API Usage": "Gemini API 用量",
        "Gemini Flash Latest": "Gemini Flash 最新版",
        "Gemini Flash Latest / 2.5 Flash": "Gemini Flash 最新 / 2.5 Flash",
        "Gemini Flash-Lite Latest": "Gemini Flash-Lite 最新版",
        "Gemini Robotics-ER 1.5 Preview": "Gemini 機器人具身推理 1.5 預覽版",
        "Gemini Runner": "Gemini 跑酷",
        "Gemini intelligence in your app": "應用程式中的 Gemini 智慧",
        "GenMedia": "媒體生成",
        "Generate": "生成",
        "Generate a Docker script to create a simple linux machine.": "生成建立簡單 Linux 機器的 Docker 指令碼。",
        "Generate a high school revision guide on quantum computing": "生成量子計算的高中複習指南",
        "Generate a scavenger hunt for street food around the city of Seoul, Korea": "生成首爾街頭美食尋寶遊戲",
        "Generate content": "生成內容",
        "Generate high quality text to speech with Gemini": "用 Gemini 生成高品質語音",
        "Generate high-quality images from a text prompt. Create blog post heroes, concept art, or unique assets in your application.": "從文字生成高品質影像。建立部落格配圖、概念藝術或獨特素材。",
        "Generate images with a prompt": "透過提示詞生成影像",
        "Generate media": "生成媒體",
        "Generate speech": "生成語音",
        "Generate structured outputs": "生成結構化輸出",
        "Generative Language API Key": "生成式語言 API 金鑰",
        "Get API key": "獲取 API 金鑰",
        "Get SDK code to chat with Gemini": "獲取 SDK 程式碼",
        "Get code": "獲取程式碼",
        "Get started with Gemini": "開始使用 Gemini",
        "Give your app a voice. Add text-to-speech to read articles aloud, provide audio navigation, or create voice-based assistants for your users.": "給應用程式裝上嘴巴。新增文字轉語音來朗讀文章、提供語音導航或建立語音助理。",
        "Give your app's AI time to think. Enable 'Thinking Mode' to handle your users' most complex queries.": "給 AI 思考時間。啟用「思考模式」處理複雜查詢。",
        "Good response": "回答得好",
        "Google AI Studio": "Google AI Studio",
        "Google Cloud Console": "Google Cloud 控制台",
        "Google Search": "Google 搜尋",
        "Grounding with Google Search": "關聯 Google 搜尋",
        "Group by": "分組方式",
        "Hello, How Can I Help?": "你好，有什麼可以幫忙？",
        "Help": "說明",
        "Help users find the key moments in long videos. Add a feature to analyze video content to instantly generate summaries, flashcards, or marketing highlights.": "幫助使用者發現影片關鍵時刻。新增影片分析功能，生成摘要、抽認卡或行銷集錦。",
        "High": "高 (深入思考)",
        "Higher resolutions may provide better understanding but use more tokens.": "更高解析度理解力更好，但消耗更多 Token。",
        "History": "歷史記錄",
        "Home": "首頁",
        "Human Eval": "人工評估",
        "I'm feeling lucky": "好手氣",
        "Image (*Output per image)": "影像 (每張)",
        "Image to Voxel Art": "影像轉體素藝術",
        "Imagen 3": "Imagen 3",
        "Imagen 4": "Imagen 4",
        "Imagen 4 Fast": "Imagen 4 Fast",
        "Imagen 4 Ultra": "Imagen 4 Ultra",
        "Imagen Requests per day": "每日 Imagen 請求數",
        "Images": "影像",
        "Immersive Games & 3D Worlds": "沉浸式遊戲與 3D 世界",
        "Immersive event landing page with interactive scroll effects.": "具有互動式捲動效果的沉浸式活動到達頁面。",
        "Import projects": "匯入專案",
        "Input": "輸入",
        "Input Tokens per day": "每日輸入 Token",
        "Insert": "插入",
        "Insert a PDF to add it to your prompt.": "插入 PDF 到提示詞。",
        "Insert a text file to add it to your prompt.": "插入文字檔到提示詞。",
        "Insert an image to add it to your prompt.": "插入影像到提示詞。",
        "Insert assets such as images, videos, files, or audio": "插入圖片、影片、檔案或音訊",
        "Insert assets such as images, videos, folders, files, or audio": "插入圖片、影片、資料夾、檔案或音訊",
        "Insert media such as images": "插入媒體（如影像）",
        "Instructions": "指令",
        "Internet favorites": "網路收藏",
        "JSON": "JSON",
        "JavaScript": "JavaScript",
        "Key": "金鑰",
        "Keys": "金鑰",
        "Kinetic Shapes": "動態形狀",
        "Last 24 hours": "過去 24 小時",
        "Last 30 days": "過去 30 天",
        "Last 7 days": "過去 7 天",
        "Last Hour": "過去 1 小時",
        "Last viewed:": "最近查看：",
        "Learn more": "瞭解更多",
        "Lets Gemini use code to solve complex tasks": "允許 Gemini 執行程式碼來解決複雜任務",
        "Light": "淺色模式",
        "Live": "即時",
        "Logs containing videos or PDFs are currently not supported.": "目前不支援包含影片或 PDF 的記錄。",
        "Low": "低 (快速回應)",
        "Lumina Festival": "Lumina 音樂節",
        "Manage a virtual metropolis and fulfill tasks provided by Gemini.": "管理虛擬大都會並完成 Gemini 提供的任務。",
        "Maximum number of tokens in response": "回應中的最大 Token 數",
        "Maximum output tokens": "最大輸出 Token 數",
        "Media resolution": "多媒體解析度",
        "Median Latency": "中位數延遲",
        "Medium": "中等",
        "Menu": "選單",
        "Model": "模型",
        "Model carousel": "模型輪播",
        "Model selection": "模型選擇",
        "Monitor usage and projects": "監控用量與專案",
        "More options": "更多選項",
        "Multimodal understanding": "多模態理解",
        "My Drive": "我的雲端硬碟",
        "My Library": "我的資料庫",
        "Name": "名稱",
        "Nano Banana": "Nano Banana",
        "Nano banana powered app": "Nano Banana 驅動的應用程式",
        "Navigate a complex 3d world with customizable interactions.": "在可自訂互動的複雜 3D 世界中導航。",
        "New": "新",
        "New app": "新應用程式",
        "New chat": "新對話",
        "Next page": "下一頁",
        "No API Key": "無 API 金鑰",
        "No API key selected": "未選擇 API 金鑰",
        "No Data Available": "暫無資料",
        "No thanks": "不用了，謝謝",
        "One Shot": "單樣本",
        "Only imported projects appear here. If you don't see your projects, you can import projects from Google Cloud on this page.": "僅顯示已匯入的專案。如果沒看到，請在此頁面從 Google Cloud 匯入。",
        "Open options": "開啟選項",
        "Optimizes for latency": "最佳化延遲 (速度優先)",
        "Optional tone and style instructions for the model": "設定語氣、風格或角色 (選用)",
        "Output": "輸出",
        "Output Tokens per day": "每日輸出 Token",
        "Output length": "輸出長度",
        "Overview": "概覽",
        "Owner": "擁有者",
        "Pay-as-you-go": "用多少付多少",
        "Peak input tokens per minute (TPM)": "每分鐘 Token 峰值 (TPM)",
        "Peak requests per day (RPD)": "每天請求峰值 (RPD)",
        "Peak requests per minute (RPM)": "每分鐘請求峰值 (RPM)",
        "Physics Simulation": "物理模擬",
        "Physics sandbox for simulating variable gravity and collision dynamics.": "用於模擬可變重力和碰撞動力學的物理沙箱。",
        "Pin app": "置頂應用程式",
        "Playground": "工作台",
        "Previous page": "上一頁",
        "Privacy policy": "隱私權政策",
        "Probability threshold for top-p sampling": "Top-P 取樣的機率閾值",
        "Productivity": "生產力工具",
        "Project": "專案",
        "Project filter": "專案篩選",
        "Projects": "專案列表",
        "Prompt based video generation": "基於提示詞的影片生成",
        "Prompts": "提示詞庫",
        "Python": "Python",
        "Quota tier": "配額等級",
        "Quotas": "配額",
        "RPD": "RPD (日請求量)",
        "RPM": "RPM (分請求量)",
        "Race through a stunning synthwave cosmos at breakneck speeds in this retro-futuristic runner.": "在這個復古未來主義跑酷遊戲中，以極快速度穿越令人驚嘆的合成波宇宙。",
        "Rate Limit": "速率限制",
        "Rate limits": "速率限制",
        "Rate limits breakdown": "速率限制詳情",
        "Rate limits by model": "按模型查看速率限制",
        "Rating": "評分",
        "Reached limit": "已達上限",
        "Recent": "最近使用",
        "Recently viewed": "最近查看",
        "Record Audio": "錄製音訊",
        "Remove": "移除",
        "Remove app": "移除應用程式",
        "Requests per day": "每日請求數",
        "Rerun": "重新執行",
        "Rerun this turn": "重試此輪",
        "Research Visualization": "研究視覺化",
        "Research paper reimagined as an elegant, interactive narrative site.": "重構為優雅、互動式敘事網站的研究論文。",
        "Reset default settings": "恢復預設設定",
        "Response ready.": "回應已就緒。",
        "Run": "執行",
        "Run settings": "執行設定",
        "SVG Generator": "SVG 生成器",
        "Safety settings": "安全設定",
        "Sample Media": "範例媒體",
        "Save": "儲存",
        "Scroll left": "向左捲動",
        "Scroll right": "向右捲動",
        "Search": "搜尋",
        "Search for a model": "搜尋模型",
        "Search for a project": "搜尋專案",
        "Search for an app": "搜尋應用程式",
        "Select or upload a file on Google Drive to include in your prompt": "從雲端硬碟選擇檔案",
        "Select the audio source for the speech-to-text feature": "選擇語音轉文字的音訊來源",
        "Send feedback": "傳送意見回饋",
        "Session page navigation": "工作階段頁面導航",
        "Set": "設定",
        "Set the thinking level": "設定思考深度",
        "Set up billing": "設定計費",
        "Set up billing to enable Gemini API logging": "設定計費以啟用記錄",
        "Settings": "設定",
        "Shader Pilot": "著色器飛行員",
        "Share": "分享",
        "Share prompt": "分享提示詞",
        "Show conversation without markdown formatting": "顯示無 Markdown 格式的對話",
        "Sign in": "登入",
        "Sign out": "登出",
        "Skip to main content": "跳轉到主要內容",
        "Sky Metropolis": "天空大都會",
        "Sort": "排序",
        "Sort by": "排序方式",
        "Source:": "來源：",
        "Speech to text": "語音轉文字",
        "Start": "開始",
        "Start from a template": "從範本開始",
        "Start typing a prompt": "在此輸入提示詞...",
        "Status": "狀態",
        "Stop": "停止",
        "Stop sequences": "停止符",
        "Structured outputs": "結構化輸出 (JSON)",
        "Submit prompt key": "傳送快捷鍵",
        "Supercharge your apps with AI": "用 AI 為您的應用程式充能",
        "Switch to a paid API key to unlock higher quota and more features.": "切換到付費 API 金鑰以解鎖更高配額和更多功能。",
        "Synthwave Space": "合成波太空",
        "System": "系統",
        "System default": "系統預設",
        "System instructions": "系統指令",
        "TPM": "TPM (分 Token 量)",
        "Take a photo": "拍照",
        "Temperature": "隨機性 (Temperature)",
        "Tempo Strike": "Tempo Strike (遊戲)",
        "Terms of service": "服務條款",
        "Test your prompt": "測試提示詞",
        "Text": "文字",
        "Text to speech with Gemini": "Gemini 語音合成 (TTS)",
        "The fastest way from prompt to production with Gemini": "使用 Gemini 從提示詞到生產環境的最快路徑",
        "Theme": "主題",
        "There is no billing currently set up for this project": "此專案未設定計費",
        "Think more when needed": "需要時深入思考",
        "Thinking Level": "思考深度",
        "Thinking level": "思考深度",
        "Thoughts": "思考過程",
        "Time Range": "時間範圍",
        "Time range": "時間範圍",
        "Toggle logging status": "切換記錄狀態",
        "Toggle navigation menu": "切換導航選單",
        "Toggle view all models": "切換顯示所有模型",
        "Token count": "Token 統計",
        "Tool calling": "工具呼叫",
        "Tools": "擴充工具",
        "Tools and MCP": "工具與 MCP",
        "Top K": "多樣性 (Top K)",
        "Top P": "機率閾值 (Top P)",
        "Total API Errors": "API 錯誤總數",
        "Total API Errors per day": "每日 API 錯誤總數",
        "Total API Requests": "API 請求總數",
        "Total API Requests per day": "每日 API 請求總數",
        "Transcribe audio": "音訊轉錄",
        "Truncate response including and after string": "截斷包含及之後的字串",
        "Try Gemini 3": "試用 Gemini 3",
        "Try Nano Banana": "試用 Nano Banana",
        "Try it": "立即試用",
        "Type something or tab to choose an example prompt": "輸入內容或按 Tab 選擇範例",
        "Type something...": "輸入內容...",
        "URL context": "URL 上下文",
        "Understanding projects": "瞭解專案",
        "Untitled": "未命名",
        "Untitled prompt": "未命名提示詞",
        "Upgrade": "升級",
        "Upload File": "上傳檔案",
        "Upload a file to Google Drive to include in your prompt": "上傳檔案到雲端硬碟",
        "Upload an image of a board game, floor layout, or anything you can think of to turn it into an interactive experience.": "上傳桌遊、平面圖等影像，將其轉化為互動式體驗。",
        "Usage": "用量",
        "Usage and Billing": "用量與計費",
        "Usage in AI Studio UI is free of charge": "在 AI Studio 介面中使用完全免費",
        "Usage is only reflective of GenerateContent requests. Other request types are not yet supported.": "用量僅反映 GenerateContent 請求。",
        "Usage is only reflective of Imagen and Veo requests. Other request types are not yet supported.": "用量僅反映 Imagen 和 Veo 請求。",
        "Usage is reflective of all request types to the Gemini API.": "用量反映 Gemini API 的所有請求類型。",
        "Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.": "使用上下箭頭選擇，Enter 跳轉，Esc 返回。",
        "Use Google Maps data": "使用 Google 地圖資料",
        "Use Google Search": "使用 Google 搜尋",
        "Use Google Search data": "使用 Google 搜尋資料",
        "Use the Gemini Live API to give your app a voice and make your own conversational experiences.": "使用 Gemini Live API 為應用程式新增語音。",
        "Use your webcam to track hand movements and slash Sparks to the beat.": "使用網路攝影機追蹤手部動作，按節奏切開 Spark。",
        "Utilities": "實用工具",
        "Veo 2": "Veo 2",
        "Veo 3.1": "Veo 3.1",
        "Veo Requests per day": "每日 Veo 請求數",
        "Vibe code GenAI apps": "編寫生成式 AI 應用程式",
        "Video": "影片",
        "Video understanding": "影片理解",
        "View AI Studio and Gemini status page": "查看 AI Studio 和 Gemini 狀態頁面",
        "View API keys": "查看 API 金鑰",
        "View all history": "查看所有記錄",
        "View billing": "查看計費",
        "View code": "查看程式碼",
        "View details": "查看詳情",
        "View in charts": "在圖表中查看",
        "View more actions": "查看更多操作",
        "View rate limits documentation": "查看速率限制文件",
        "View status": "服務狀態",
        "View usage": "查看用量",
        "Voxel Toy Box": "體素玩具箱",
        "Wait": "稍等",
        "What's new": "最新動態",
        "You can then view your Gemini API history and create datasets.": "您可以查看 API 記錄並建立資料集。",
        "You have reached a rate limit. Set up billing to increase your limits and unblock your work.": "已達速率限制。設定計費以增加限額。",
        "You need an active billing account to enable logging.": "需要有效的計費帳戶以啟用記錄。",
        "You need to create and run a prompt in order to share it": "您需要建立並執行提示詞才能分享。",
        "YouTube Video": "YouTube 影片",
        "Your apps": "您的應用程式",
        "Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat.": "對話不會儲存，但上傳的檔案會儲存到雲端硬碟。記錄政策仍適用。",
        "Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat. See": "您的對話不會儲存。但上傳的檔案會存入 Google 雲端硬碟。記錄政策在臨時對話中仍然適用。查看",
    };

    // =========================================================
    //  2. 圖示防火牆 (絕對嚴防死守，不許圖示亂碼)
    // =========================================================
    const ICON_BLACKLIST = new Set([
        "menu", "menu_open", "home", "search", "close", "add", "add_circle",
        "arrow_back", "arrow_forward", "arrow_outward", "chevron_left", "chevron_right",
        "expand_less", "expand_more", "more_vert", "more_horiz",
        "chat", "chat_spark", "photo_spark", "video_spark", "audio_spark", "spark",
        "edit", "delete", "share", "content_copy", "file_copy",
        "info", "help", "settings", "history", "schedule", "visibility",
        "check", "flag", "warning", "error", "lock", "key", "key_off",
        "thumb_up", "thumb_down", "star", "favorite", "stars",
        "play_arrow", "pause", "stop", "fiber_manual_record", "mic", "videocam",
        "upload", "download", "cloud_upload", "cloud_download",
        "code", "terminal", "integration_instructions", "data_object",
        "light_mode", "dark_mode", "palette", "speed", "bolt",
        "photo_camera", "video_camera_front", "video_library", "movie",
        "dashboard", "build", "description", "calendar_today", "bar_chart", "pie_chart",
        "design_services", "developer_guide", "topic", "filter_list", "sort",
        "grid_view", "list", "refresh", "fullscreen", "fullscreen_exit",
        "arrow_circle_up", "arrow_upward_alt", "aspect_ratio", "assignment", "attach_money",
        "audio_magic_eraser", "cloud_download", "compare_arrows", "console", "data_info_alert",
        "deselect", "document_scanner", "drive", "google", "google_pin", "image_edit_auto",
        "incognito", "keyboard_return", "keyboard_tab", "money_bag", "network_intelligence",
        "network_intelligence_history", "shield_person", "speech_to_text", "text_fields",
        "tune", "verified", "verified_user", "widgets", "workspaces", "reset_settings", "trending_flat"
    ]);

    function isIcon(node) {
        const text = node.nodeValue.trim();
        // 1. 黑名單直查
        if (ICON_BLACKLIST.has(text)) return true;
        // 2. Snake_Case 格式檢查 (如 video_spark)
        if (/^[a-z]+(_[a-z0-9]+)+$/.test(text)) return true;
        
        // 3. 父級檢查
        const parent = node.parentNode;
        if (!parent) return false;
        
        // 檢查常見圖示標籤
        if (['MAT-ICON', 'I', 'SPAN', 'GOOGLE-ICON', 'G-ICON'].includes(parent.tagName)) {
             if (ICON_BLACKLIST.has(text) || /^[a-z_]+$/.test(text)) return true;
             const cls = (parent.className && typeof parent.className === 'string') ? parent.className : '';
             if (cls.includes('material-symbols') || 
                 cls.includes('google-symbols') || 
                 cls.includes('icon')) {
                 return true;
             }
        }
        return false;
    }

    // =========================================================
    //  3. 智慧正則 (修復長難句與動態文字 - 繁體化)
    // =========================================================
    const regexRules = [
        // 儀表板動態數據
        { pattern: /^Total requests:\s*([\d,]+)$/i, replace: '總請求數：$1' },
        { pattern: /^Total errors:\s*([\d,]+)$/i, replace: '總錯誤數：$1' },
        { pattern: /^Avg latency:\s*([\d,.]+)\s*ms$/i, replace: '平均延遲：$1 ms' },
        
        // 核心長句描述 (忽略換行符)
        { pattern: /Our\s+most\s+intelligent\s+model\s+to\s+date\.?/i, replace: '我們迄今為止最智慧的模型。' },
        { pattern: /State-of-the-art\s+image\s+generation\s+and\s+editing\.?/i, replace: '最先進的影像生成與編輯。' },
        { pattern: /Our\s+best\s+video\s+generation\s+model,\s+now\s+with\s+sound\s+effects\.?/i, replace: '我們最強的影片生成模型，現已支援音效。' },
        { pattern: /Our\s+most\s+intelligent\s+model\s+with\s+SOTA\s+reasoning\s+and\s+multimodal\s+understanding[\s\S]*?capabilities/i, replace: '我們最智慧的模型，具備 SOTA 級推理、多模態理解以及強大的智慧代理和程式設計能力' },
        { pattern: /Our\s+advanced\s+reasoning\s+model,\s+which\s+excels\s+at\s+coding\s+and\s+complex\s+reasoning\s+tasks/i, replace: '我們的高級推理模型，擅長程式設計和複雜推理任務' },
        { pattern: /Our\s+hybrid\s+reasoning\s+model,\s+with\s+a\s+1M\s+token\s+context\s+window\s+and\s+thinking\s+budgets\.?/i, replace: '混合推理模型，擁有 100 萬 Token 上下文視窗並支援思考預算。' },
        { pattern: /Gemini\s+Robotics-ER,\s+short\s+for[\s\S]*?physical\s+world\.?/i, replace: 'Gemini Robotics-ER (具身推理) 旨在增強機器人理解物理世界的能力。' },
        
        // 計費與提示 (包含新舊兩種定價格式的相容)
        { pattern: /Image\s+output\s+is\s+priced\s+at\s+\$30\s+per\s+1,000,000\s+tokens[\s\S]*?free\s+of\s+charge/i, replace: '影像輸出價格為 $30/百萬 Token。在 AI Studio 介面中使用免費。' },
        // 🆕 新增：針對 $120 定價的正則 (繁體)
        { pattern: /Image\s+output\s+is\s+priced\s+at\s+\$120\s+per\s+1,000,000\s+tokens[\s\S]*?per\s+image\./i, replace: '影像輸出價格為 $120/百萬 Token。1024x1024px 影像消耗 1120 Token (約 $0.134/張)。' },
        { pattern: /API\s+pricing\s+per\s+1M\s+tokens\.\s+Usage\s+in\s+AI\s+Studio\s+UI\s+is\s+free\s+of\s+charge/i, replace: 'API 定價(每百萬 Token)。在 AI Studio 介面中使用完全免費。' },
        { pattern: /Usage\s+information\s+displayed\s+is\s+for\s+the\s+API\s+and\s+does\s+not\s+reflect\s+AI\s+Studio\s+usage/i, replace: '顯示的是 API 用量資訊，不反映 AI Studio 的免費使用情況。' },
        { pattern: /Google\s+AI\s+models\s+may\s+make\s+mistakes,\s+so\s+double-check\s+outputs\.?/i, replace: 'Google AI 模型可能會犯錯，請務必查核輸出。' },
        { pattern: /This\s+chart\s+is\s+described\s+by\s+one\s+or\s+more\s+grids/i, replace: '此圖表由一個或多個網格描述。' },

        // 動態短語
        { pattern: /^Points to\s+(.+)$/i, replace: '指向 $1' },
        { pattern: /^Try\s+(.+)$/i, replace: '試用 $1' },
        { pattern: /\bInput\b\s*[:：]\s*/i, replace: '輸入：' },
        { pattern: /\bOutput\b\s*[:：]\s*/i, replace: '輸出：' },
        { pattern: /\bKnowledge cut ?off\b\s*[:：]\s*/i, replace: '知識截止：' },
        { pattern: /^Selected[:\s]+(.+?)$/i, replace: '已選擇：$1' },
        { pattern: /^Model:\s*(.+)$/i, replace: '模型：$1' }
    ];

    // =========================================================
    //  4. 翻譯核心
    // =========================================================
    function getTrans(text) {
        if (!text) return null;
        const trimText = text.trim();
        if (!trimText) return null;

        // 1. 精準匹配
        if (i18nMap[trimText]) return i18nMap[trimText];

        // 2. 正則匹配
        for (let i = 0; i < regexRules.length; i++) {
            const rule = regexRules[i];
            if (rule.pattern.test(trimText)) {
                return trimText.replace(rule.pattern, rule.replace);
            }
        }
        return null;
    }

    function processNode(node) {
        // A. 文本節點
        if (node.nodeType === 3) { 
            if (isIcon(node)) return; // 核心防禦
            const val = node.nodeValue;
            const trans = getTrans(val);
            if (trans && val.trim() !== trans) {
                node.nodeValue = val.replace(val.trim(), trans);
            }
            return;
        }

        // B. 元素節點
        if (node.nodeType === 1) {
            if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA'].includes(node.tagName)) return;
            if (node.isContentEditable) return; 
            if (node.classList && node.classList.contains('monaco-editor')) return;

            // 屬性
            ['aria-label', 'title', 'placeholder', 'data-tooltip', 'label'].forEach(attr => {
                const val = node.getAttribute(attr);
                if (val) {
                    const trans = getTrans(val);
                    if (trans && trans !== val) node.setAttribute(attr, trans);
                }
            });

            // Shadow DOM
            if (node.shadowRoot) traverse(node.shadowRoot);
        }

        // C. 遞歸
        let child = node.firstChild;
        while (child) {
            processNode(child);
            child = child.nextSibling;
        }
    }

    function traverse(root) {
        if (!root) return;
        Array.from(root.childNodes).forEach(processNode);
    }

    // =========================================================
    //  5. 啟動
    // =========================================================
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => processNode(node));
            if (mutation.type === 'attributes') processNode(mutation.target);
        });
    });

    observer.observe(document.body, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['aria-label', 'title', 'placeholder', 'data-tooltip']
    });

    setInterval(() => { traverse(document.body); }, 1500);

    console.log("%c Google AI Studio 繁體中文化腳本 v1.0 (台灣版) 已啟動 ", "background: #2e7d32; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
    traverse(document.body);

})();