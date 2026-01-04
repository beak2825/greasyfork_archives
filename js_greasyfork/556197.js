// ==UserScript==
// @name         Bing Auto Search - Ultra Stealth (Firefox Compatible)
// @namespace    http://tampermonkey.net/
// @version      9.2
// @description  Tự động search trên Bing - Tương thích Firefox
// @author       You
// @match        https://www.bing.com/*
// @match        https://bing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      opentdb.com
// @connect      *
// @license      *
// @downloadURL https://update.greasyfork.org/scripts/556197/Bing%20Auto%20Search%20-%20Ultra%20Stealth%20%28Firefox%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556197/Bing%20Auto%20Search%20-%20Ultra%20Stealth%20%28Firefox%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'bingAutoSearchState';
    const LOCK_KEY = 'bingAutoSearchLock';
    const CONFIG_KEY = 'bingAutoSearchConfig';
    const USED_QUERIES_KEY = 'bingUsedQueries';
    const DEBUG_MODE = false;
    let isProcessing = false;

    // Detect browser
    const isFirefox = typeof InstallTrigger !== 'undefined';
    
    // Anti-detection: Override console methods
    if (!DEBUG_MODE) {
        const noop = () => {};
        window.console = {
            ...window.console,
            log: noop,
            warn: noop,
            error: noop,
            info: noop,
            debug: noop,
            trace: noop
        };
    }

    const log = {
        info: (...args) => DEBUG_MODE && console.log(...args),
        error: (...args) => DEBUG_MODE && console.error(...args),
        warn: (...args) => DEBUG_MODE && console.warn(...args)
    };

    // EXPANDED Vietnamese and English topics
    const topics = {
        vi: [
            // Công nghệ & Học tập
            "Cách quản lý chi tiêu cá nhân hiệu quả", "Phương pháp trị mụn đầu đen tại nhà", "Nguyên nhân da khô vào mùa đông",
            "Bí quyết vượt qua kỳ thi căng thẳng", "Kỹ năng thuyết trình trước đám đông", "Món ăn ngon dễ làm cho bữa tối",
            "Hướng dẫn chuyển dữ liệu từ Android sang iPhone", "Lý do bánh mì không nở khi nướng", "Nguyên nhân điện thoại bị chậm lag",
            "Công thức làm bánh trung thu truyền thống", "Cách chọn cổ phiếu tiềm năng đầu tư", "Quy trình chăm sóc da nam giới",
            "Chế độ ăn uống lành mạnh mỗi ngày", "Thủ tục xin hộ chiếu đi du lịch", "Cách lưu trữ dữ liệu trên Google Drive",
            "Bí quyết nấu phở bò thơm ngon", "Mẹo quản lý tài chính cá nhân", "Dấu hiệu người yêu không còn quan tâm",
            "Cách viết CV xin việc thu hút nhà tuyển dụng", "Phát triển tư duy logic và sáng tạo", "Công thức làm bánh bao nhân thịt",
            "Cách tạo thu nhập thụ động online", "So sánh du lịch trong nước và nước ngoài", "Nguyên nhân và cách trị da khô",
            "Kinh nghiệm du lịch bụi Phú Quốc", "Những câu tỏ tình lãng mạn nhất", "Bí quyết làm cơm chiên trứng ngon",
            "Cách học lập trình Python cho người mới", "Phương pháp giảm cân nhanh an toàn", "Bí quyết chụp ảnh đẹp bằng điện thoại",
            "Hướng dẫn đầu tư vàng cho người mới", "Cách làm sạch laptop đúng cách", "Món ăn vặt đơn giản tại nhà",
            "Thủ thuật Excel nâng cao", "Cách tăng chiều cao tuổi dậy thì", "Phương pháp học IELTS hiệu quả",
            "Bí quyết nuôi cây trồng trong nhà", "Cách khắc phục máy tính chạy chậm", "Công thức làm bánh cookie giọn tan",
            "Hướng dẫn thiết lập mạng WiFi tốc độ cao", "Cách chọn laptop phù hợp nhu cầu", "Phương pháp trị mụn cám hiệu quả",
            "Bí quyết tiết kiệm điện hàng tháng", "Cách làm sữa chua nha đam", "Kinh nghiệm đi phượt Sa Pa tự túc",
            
            // 200 câu mới - Ẩm thực Việt Nam
            "Cách nấu bún chả Hà Nội đúng vị", "Bí quyết làm bánh xèo miền Tây", "Công thức nấu cháo lòng đậm đà",
            "Cách làm gỏi cuốn Sài Gòn", "Phương pháp nấu lẩu mắm miền Tây", "Bí quyết làm bánh canh cua",
            "Hướng dẫn nấu bún bò Huế chuẩn", "Cách làm chả giò giòn rụm", "Công thức nấu hủ tiếu Nam Vang",
            "Bí quyết làm bánh khọt Vũng Tàu", "Cách nấu canh chua cá lóc", "Phương pháp làm nem rán ngon",
            "Hướng dẫn nấu mì Quảng đúng chuẩn", "Cách làm bánh tráng trộn", "Bí quyết nấu cao lầu Hội An",
            
            // Sức khỏe & Làm đẹp
            "Cách giảm mỡ bụng tự nhiên", "Phương pháp tăng cân an toàn", "Bí quyết làm trắng da toàn thân",
            "Cách chữa sẹo lõm trên mặt", "Hướng dẫn tập bụng 6 múi", "Phương pháp trị rạn da sau sinh",
            "Bí quyết tăng vòng 1 tự nhiên", "Cách chữa nám da hiệu quả", "Công thức mặt nạ trứng gà dưỡng da",
            "Phương pháp làm săn chắc vòng 3", "Bí quyết giảm cân bằng gừng", "Cách trị thâm nách tại nhà",
            "Hướng dẫn massage mặt chống lão hóa", "Phương pháp tẩy tế bào chết body", "Bí quyết dưỡng tóc dài nhanh",
            
            // Kinh doanh & Khởi nghiệp
            "Cách kinh doanh online hiệu quả", "Bí quyết bán hàng trên Facebook", "Hướng dẫn mở quán cafe nhỏ",
            "Cách viết content thu hút khách", "Phương pháp marketing 0 đồng", "Bí quyết chốt đơn qua điện thoại",
            "Cách xây dựng thương hiệu cá nhân", "Hướng dẫn kinh doanh Shopee", "Phương pháp quảng cáo Google Ads",
            "Bí quyết livestream bán hàng", "Cách tìm nhà cung cấp uy tín", "Hướng dẫn làm affiliate marketing",
            "Phương pháp tăng đơn hàng Lazada", "Bí quyết chăm sóc khách hàng", "Cách thiết kế logo chuyên nghiệp",
            
            // Du lịch Việt Nam
            "Kinh nghiệm du lịch Đà Lạt tự túc", "Cách săn vé máy bay giá rẻ", "Hướng dẫn du lịch Hạ Long 2 ngày",
            "Bí quyết đi phượt Tây Bắc", "Cách thuê xe máy Hà Nội", "Kinh nghiệm du lịch Côn Đảo",
            "Hướng dẫn leo núi Fansipan", "Cách đặt phòng khách sạn rẻ", "Kinh nghiệm du lịch Quy Nhơn",
            "Bí quyết đi tour Cát Bà", "Cách lên kế hoạch du lịch Huế", "Hướng dẫn phượt xuyên Việt",
            "Kinh nghiệm du lịch Mộc Châu", "Cách đi du lịch Sapa mùa đông", "Bí quyết khám phá Phong Nha",
            
            // Công nghệ & Điện thoại
            "Cách root điện thoại Android", "Hướng dẫn jailbreak iPhone", "Phương pháp tăng tốc điện thoại",
            "Bí quyết tiết kiệm pin điện thoại", "Cách chuyển danh bạ sang máy mới", "Hướng dẫn backup dữ liệu iPhone",
            "Phương pháp khôi phục ảnh đã xóa", "Bí quyết chụp ảnh đẹp ban đêm", "Cách quay video slow motion",
            "Hướng dẫn edit video trên điện thoại", "Phương pháp chơi game mượt", "Bí quyết stream game mobile",
            "Cách tải video YouTube về máy", "Hướng dẫn cài đặt vpn miễn phí", "Phương pháp xóa virus điện thoại",
            
            // Học ngoại ngữ
            "Cách học tiếng Anh giao tiếp", "Bí quyết nhớ từ vựng lâu", "Hướng dẫn luyện phát âm chuẩn",
            "Phương pháp học tiếng Hàn nhanh", "Cách tự học tiếng Trung online", "Bí quyết đạt TOEIC 900",
            "Hướng dẫn học tiếng Nhật sơ cấp", "Phương pháp luyện nghe tiếng Anh", "Cách viết email tiếng Anh chuyên nghiệp",
            "Bí quyết giao tiếp tiếng Anh tự tin", "Hướng dẫn học ngữ pháp tiếng Anh", "Phương pháp học tiếng Pháp cơ bản",
            "Cách luyện nói tiếng Anh mỗi ngày", "Bí quyết học bảng chữ cái tiếng Hàn", "Hướng dẫn đọc báo tiếng Anh",
            
            // Tình yêu & Gia đình
            "Cách giữ lửa hôn nhân", "Bí quyết cầu hôn lãng mạn", "Hướng dẫn giải quyết mâu thuẫn vợ chồng",
            "Phương pháp nuôi dạy con ngoan", "Cách dạy trẻ tự lập", "Bí quyết giữ gìn hạnh phúc gia đình",
            "Hướng dẫn chuẩn bị đám cưới", "Phương pháp chăm sóc trẻ sơ sinh", "Cách kích thích trẻ thông minh",
            "Bí quyết làm hòa sau cãi nhau", "Hướng dẫn dạy con học tốt", "Phương pháp rèn tính tự giác cho trẻ",
            "Cách xây dựng niềm tin trong tình yêu", "Bí quyết tổ chức sinh nhật ý nghĩa", "Hướng dẫn chăm sóc bố mẹ già",
            
            // Thể thao & Fitness
            "Cách tập yoga giảm stress", "Bí quyết chạy bộ đúng tư thế", "Hướng dẫn tập cardio đốt mỡ",
            "Phương pháp tập cơ ngực tại nhà", "Cách tập bụng 6 múi nhanh", "Bí quyết tăng cơ bắp hiệu quả",
            "Hướng dẫn tập squat chuẩn", "Phương pháp tập vai rộng", "Cách tập lưng xô đẹp",
            "Bí quyết tập mông săn chắc", "Hướng dẫn ăn uống cho người tập gym", "Phương pháp tập boxing tại nhà",
            "Cách kéo giãn cơ sau tập", "Bí quyết tập plank hiệu quả", "Hướng dẫn bơi ếch cho người lớn",
            
            // Tài chính cá nhân
            "Cách tiết kiệm tiền hiệu quả", "Bí quyết đầu tư chứng khoán", "Hướng dẫn mua bảo hiểm nhân thọ",
            "Phương pháp quản lý nợ thông minh", "Cách tính lãi suất ngân hàng", "Bí quyết đầu tư bất động sản",
            "Hướng dẫn vay mua nhà trả góp", "Phương pháp đầu tư vàng online", "Cách tạo nguồn thu nhập thụ động",
            "Bí quyết tiết kiệm chi phí sinh hoạt", "Hướng dẫn làm sổ chi tiêu", "Phương pháp đầu tư quỹ mở",
            "Cách tính thuế thu nhập cá nhân", "Bí quyết mua xe trả góp lãi thấp", "Hướng dẫn gửi tiết kiệm online",
            
            // Nội thất & Trang trí
            "Cách trang trí phòng ngủ đẹp", "Bí quyết bố trí phòng khách nhỏ", "Hướng dẫn chọn màu sơn nhà",
            "Phương pháp thiết kế bếp hiện đại", "Cách trang trí góc làm việc", "Bí quyết chọn đồ nội thất",
            "Hướng dẫn bố trí ánh sáng phòng", "Phương pháp làm vườn ban công", "Cách trang trí nhà theo phong thủy",
            "Bí quyết chọn rèm cửa đẹp", "Hướng dẫn sắp xếp tủ quần áo", "Phương pháp làm sạch nệm giường",
            "Cách khử mùi trong nhà", "Bí quyết chọn gạch lát nền", "Hướng dẫn bảo dưỡng đồ gỗ",
            
            // Xe cộ & Ô tô
            "Cách lái xe số sàn cho người mới", "Bí quyết đậu xe song song", "Hướng dẫn bảo dưỡng ô tô định kỳ",
            "Phương pháp rửa xe chuyên nghiệp", "Cách chọn mua xe ô tô cũ", "Bí quyết tiết kiệm xăng khi lái xe",
            "Hướng dẫn thay lốp xe ô tô", "Phương pháp kiểm tra xe trước khi đi xa", "Cách xử lý khi xe bị hỏng",
            "Bí quyết lái xe an toàn ban đêm", "Hướng dẫn mua bảo hiểm ô tô", "Phương pháp khử mùi trong xe",
            "Cách đăng ký xe ô tô mới", "Bí quyết chọn nước hoa xe ô tô", "Hướng dẫn lắp camera hành trình",
            
            // Làm vườn & Trồng cây
            "Cách trồng rau sạch tại nhà", "Bí quyết chăm lan hoa nở đẹp", "Hướng dẫn trồng cây cảnh mini",
            "Phương pháp làm phân compost", "Cách trị sâu bệnh cho cây", "Bí quyết trồng hoa hồng tại nhà",
            "Hướng dẫn trồng cây ăn trái trong chậu", "Phương pháp tưới nước tự động", "Cách làm vườn thẳng đứng",
            "Bí quyết trồng rau thủy canh", "Hướng dẫn chăm sóc cây xương rồng", "Phương pháp ghép cây ăn quả",
            "Cách trồng cây dâu tây", "Bí quyết trồng rau gia vị", "Hướng dẫn trồng sen trong chậu",
            
            // Thú cưng
            "Cách chăm sóc chó con mới đẻ", "Bí quyết huấn luyện chó nghe lời", "Hướng dẫn tắm cho mèo đúng cách",
            "Phương pháp phối giống chó", "Cách làm đồ ăn cho chó", "Bí quyết trị ve rận cho thú cưng",
            "Hướng dẫn cắt tỉa lông chó", "Phương pháp huấn luyện mèo đi vệ sinh", "Cách chăm sóc thỏ cảnh",
            "Bí quyết nuôi hamster khỏe mạnh", "Hướng dẫn chăm sóc chim cảnh", "Phương pháp chữa bệnh cho cá cảnh"
        ],
        en: [
            // Original queries
            "How to learn Python programming", "Best restaurants near me", "Weather forecast tomorrow",
            "How to bake chocolate cake", "Tips for healthy eating", "How to build muscle fast",
            "Best coffee shops in town", "How to start a blog", "Investment strategies for beginners",
            "Easy breakfast recipes", "Yoga poses for back pain", "Digital marketing basics",
            "How to save money effectively", "Best smartphones 2024", "Home workout routines",
            "Photography tips for beginners", "How to learn Spanish fast", "Meditation techniques",
            "Web development tutorial", "Healthy dinner ideas", "Travel destinations 2024",
            
            // 100 new English queries
            // Technology & Gadgets
            "How to reset iPhone without password", "Best gaming laptops under 1000", "Android vs iPhone comparison",
            "How to build a gaming PC", "Wireless earbuds review", "Best VPN services 2024",
            "How to speed up Windows 11", "Mechanical keyboard buying guide", "Best budget smartphones",
            "How to backup iPhone to computer", "Smart home setup guide", "Best monitors for gaming",
            
            // Fitness & Health
            "HIIT workout for beginners", "Keto diet meal plan", "How to lose belly fat", 
            "Best protein powder for muscle gain", "Intermittent fasting guide", "Yoga for flexibility",
            "How to improve posture", "Meal prep ideas for weight loss", "Best running shoes 2024",
            "Core strengthening exercises", "How to track calories", "Plant based diet benefits",
            
            // Business & Career
            "How to write a cover letter", "Remote work tips", "Passive income ideas",
            "Excel shortcuts for productivity", "LinkedIn profile optimization", "How to negotiate salary",
            "Time management techniques", "Public speaking tips", "Email marketing strategies",
            "How to start a podcast", "Freelancing platforms comparison", "Resume writing guide",
            
            // Cooking & Recipes
            "How to cook rice perfectly", "Easy pasta recipes", "Chicken breast recipes healthy",
            "How to make sourdough bread", "Meal prep for beginners", "Vegan dessert recipes",
            "How to grill steak", "Instant pot recipes", "Slow cooker meal ideas",
            "How to make sushi at home", "Healthy smoothie recipes", "Best air fryer recipes",
            
            // Personal Finance
            "How to invest in stocks", "Cryptocurrency for beginners", "Best savings accounts 2024",
            "How to improve credit score", "Budgeting apps review", "Real estate investment tips",
            "Retirement planning guide", "How to pay off debt fast", "Emergency fund calculator",
            "Best credit cards for rewards", "Tax deduction checklist", "How to start investing",
            
            // Home & Garden
            "Interior design ideas modern", "How to grow tomatoes", "Small space organizing tips",
            "DIY home improvement projects", "Best indoor plants low light", "How to paint a room",
            "Feng shui bedroom tips", "Gardening for beginners", "How to fix a leaky faucet",
            "Home cleaning schedule", "Best vacuum cleaners 2024", "Minimalist home decor",
            
            // Travel & Adventure
            "Solo travel tips for women", "Best travel backpacks", "How to pack light for vacation",
            "Cheap flight booking tricks", "European cities to visit", "Travel photography tips",
            "How to travel on a budget", "Best travel credit cards", "Digital nomad lifestyle",
            "Road trip planning checklist", "Best beaches in Southeast Asia", "Travel insurance guide",
            
            // Learning & Education
            "How to learn a new language", "Online courses worth taking", "Study tips for exams",
            "Speed reading techniques", "Memory improvement exercises", "Critical thinking skills",
            "How to learn coding online", "Best free education websites", "Note taking methods",
            "Time management for students", "How to write an essay", "Research paper writing guide"
        ]
    };

    function loadUsedQueries() {
        try {
            const data = localStorage.getItem(USED_QUERIES_KEY);
            if (!data) return { date: new Date().toDateString(), queries: [] };

            const parsed = JSON.parse(data);
            const today = new Date().toDateString();

            if (parsed.date !== today) {
                return { date: today, queries: [] };
            }

            return parsed;
        } catch(e) {
            return { date: new Date().toDateString(), queries: [] };
        }
    }

    function saveUsedQuery(query) {
        try {
            const used = loadUsedQueries();
            if (!used.queries.includes(query)) {
                used.queries.push(query);
                localStorage.setItem(USED_QUERIES_KEY, JSON.stringify(used));
            }
        } catch(e) {
            log.error('Cannot save used query:', e);
        }
    }

    function loadConfig() {
        try {
            const data = localStorage.getItem(CONFIG_KEY);
            return data ? JSON.parse(data) : {
                minDelay: 5,
                maxDelay: 15,
                typingSpeed: 100,
                maxSearches: 10
            };
        } catch(e) {
            return { minDelay: 5, maxDelay: 15, typingSpeed: 100, maxSearches: 10 };
        }
    }

    function saveConfig(config) {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch(e) {}
    }

    function loadState() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            log.info('💾 State saved:', state);
        } catch(e) {
            log.error('Cannot save state:', e);
        }
    }

    function clearState() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOCK_KEY);
        log.info('🗑️ State cleared');
    }

    function acquireLock() {
        const lock = localStorage.getItem(LOCK_KEY);
        const now = Date.now();

        if (lock && (now - parseInt(lock)) < 30000) {
            return false;
        }

        localStorage.setItem(LOCK_KEY, now.toString());
        return true;
    }

    function releaseLock() {
        localStorage.removeItem(LOCK_KEY);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomQuery() {
        const used = loadUsedQueries();
        const allQueries = [...topics.vi, ...topics.en];

        const availableQueries = allQueries.filter(q => !used.queries.includes(q));

        if (availableQueries.length === 0) {
            return allQueries[Math.floor(Math.random() * allQueries.length)];
        }

        return availableQueries[Math.floor(Math.random() * availableQueries.length)];
    }

    async function getQueryFromAPI() {
        try {
            return new Promise((resolve) => {
                // Try GM.xmlHttpRequest first (Firefox async), fallback to GM_xmlhttpRequest
                const gmRequest = typeof GM !== 'undefined' && GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest;
                
                gmRequest({
                    method: "GET",
                    url: "https://opentdb.com/api.php?amount=1&type=multiple",
                    timeout: 5000,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.results && data.results.length > 0) {
                                const question = data.results[0].question
                                    .replace(/&quot;/g, '"')
                                    .replace(/&#039;/g, "'")
                                    .replace(/&amp;/g, '&');
                                resolve(question);
                            } else {
                                resolve(null);
                            }
                        } catch(e) {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            });
        } catch(e) {
            return null;
        }
    }

    async function getQuery() {
        if (Math.random() < 0.7) {
            const query = getRandomQuery();
            saveUsedQuery(query);
            return query;
        }

        const apiQuery = await getQueryFromAPI();
        if (apiQuery) {
            saveUsedQuery(apiQuery);
            return apiQuery;
        }

        const query = getRandomQuery();
        saveUsedQuery(query);
        return query;
    }

    function findSearchBox() {
        const selectors = [
            'input[name="q"]',
            '#sb_form_q',
            'input[type="search"]',
            '.sb_form_q'
        ];
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    async function typeTextNaturally(element, text, baseSpeed) {
        element.value = '';
        element.focus();

        if (Math.random() < 0.3) {
            await sleep(randomRange(500, 1500));
        }

        let consecutiveFastChars = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (Math.random() < 0.03 && i > 2 && i < text.length - 2) {
                const wrongChar = String.fromCharCode(char.charCodeAt(0) + randomRange(-2, 2));
                element.value += wrongChar;
                
                // Firefox-compatible event dispatch
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                element.dispatchEvent(inputEvent);
                await sleep(randomRange(baseSpeed, baseSpeed + 80));

                await sleep(randomRange(100, 300));
                element.value = element.value.slice(0, -1);
                element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                await sleep(randomRange(50, 120));
            }

            element.value += char;
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            let speed = baseSpeed;

            if (i < 3) {
                speed += randomRange(80, 150);
            } else if (i > text.length - 5) {
                speed += randomRange(50, 100);
            } else {
                if (consecutiveFastChars > 0) {
                    speed = baseSpeed - randomRange(20, 40);
                    consecutiveFastChars--;
                } else {
                    if (Math.random() < 0.1) {
                        consecutiveFastChars = randomRange(3, 6);
                        speed = baseSpeed - randomRange(20, 40);
                    } else {
                        speed = baseSpeed + randomRange(-30, 50);
                    }
                }
            }

            if (Math.random() < 0.15 && i > 3 && i < text.length - 3) {
                speed += randomRange(300, 800);
            }

            if (char === ' ' && Math.random() < 0.4) {
                speed += randomRange(100, 300);
            }

            await sleep(speed);
        }

        await sleep(randomRange(400, 1500));
    }

    async function simulateHumanBehavior() {
        if (Math.random() < 0.3) {
            await sleep(randomRange(300, 800));
        }

        if (Math.random() < 0.25) {
            const scrollAmount = randomRange(30, 100);
            window.scrollBy({
                top: scrollAmount,
                behavior: isFirefox ? 'auto' : 'smooth' // Firefox scrolls better with 'auto'
            });
            await sleep(randomRange(200, 500));

            if (Math.random() < 0.1) {
                window.scrollBy({
                    top: -scrollAmount/2,
                    behavior: 'auto'
                });
                await sleep(randomRange(100, 300));
            }
        }

        if (Math.random() < 0.2) {
            await sleep(randomRange(500, 1200));
        }
    }

    async function submitSearch(searchBox) {
        const form = searchBox.closest('form');
        
        // Firefox-specific: Prefer form submission
        if (form) {
            try {
                // Create and dispatch a submit event
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                
                if (form.dispatchEvent(submitEvent)) {
                    form.submit();
                    log.info('✓ Submitted via form.submit()');
                    return;
                }
            } catch(e) {
                log.warn('Form submit failed:', e);
            }
        }

        // Fallback: Try Enter key events
        try {
            const enterKeyConfig = {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true
            };

            // Firefox responds better to KeyboardEvent constructor
            searchBox.dispatchEvent(new KeyboardEvent('keydown', enterKeyConfig));
            await sleep(50);
            searchBox.dispatchEvent(new KeyboardEvent('keypress', enterKeyConfig));
            await sleep(50);
            searchBox.dispatchEvent(new KeyboardEvent('keyup', enterKeyConfig));
            
            log.info('✓ Submitted via keyboard events');
        } catch(e) {
            log.warn('Keyboard events failed:', e);
        }

        // Last resort: Click submit button
        await sleep(100);
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button[aria-label*="Search"]');
            if (submitBtn) {
                try {
                    submitBtn.click();
                    log.info('✓ Clicked submit button');
                } catch(e) {
                    log.warn('Submit button click failed:', e);
                }
            }
        }

        await sleep(500);
    }

    async function performSearch(state) {
        const searchBox = findSearchBox();
        if (!searchBox) {
            log.info('❌ Không tìm thấy ô tìm kiếm!');
            return false;
        }

        const query = await getQuery();
        log.info(`🔍 Lượt ${state.currentCount}/${state.maxSearches} - Tìm: "${query}"`);

        await simulateHumanBehavior();

        await typeTextNaturally(searchBox, query, state.typingSpeed);

        state.lastSearchTime = Date.now();
        saveState(state);

        await submitSearch(searchBox);

        return true;
    }

    async function processAutoSearch() {
        if (isProcessing) {
            log.info('⏸️ Đã có process đang chạy, skip...');
            return;
        }

        if (!acquireLock()) {
            log.info('🔒 Đang có tab khác xử lý, skip...');
            return;
        }

        isProcessing = true;

        try {
            let state = loadState();

            if (!state || !state.isRunning) {
                log.info('⏹️ Không có task đang chạy');
                releaseLock();
                isProcessing = false;
                return;
            }

            log.info(`📊 State hiện tại:`, state);

            if (state.currentCount >= state.maxSearches) {
                log.info('🎉 Hoàn thành tất cả các lượt!');
                state.isRunning = false;
                state.completed = true;
                saveState(state);
                updateUIFromState();
                releaseLock();
                isProcessing = false;
                return;
            }

            const now = Date.now();
            const timeSinceLastSearch = now - (state.lastSearchTime || 0);
            const minWaitTime = state.minDelay * 1000;

            if (timeSinceLastSearch < 5000) {
                log.info('⏳ Vừa search xong, đợi trang load...');
                releaseLock();
                isProcessing = false;
                return;
            }

            if (state.lastSearchTime && timeSinceLastSearch < minWaitTime) {
                const remainingTime = Math.ceil((minWaitTime - timeSinceLastSearch) / 1000);
                log.info(`⏰ Đợi thêm ${remainingTime}s...`);
                releaseLock();
                isProcessing = false;
                return;
            }

            const waitTime = randomRange(state.minDelay * 1000, state.maxDelay * 1000);

            if (!state.nextSearchTime) {
                state.nextSearchTime = now + waitTime;
                saveState(state);
                log.info(`⏰ Đặt lịch search lần sau sau ${Math.round(waitTime/1000)}s`);
                releaseLock();
                isProcessing = false;
                return;
            }

            if (now < state.nextSearchTime) {
                const remainingTime = Math.ceil((state.nextSearchTime - now) / 1000);
                log.info(`⏰ Đợi thêm ${remainingTime}s...`);
                releaseLock();
                isProcessing = false;
                return;
            }

            if (state.currentCount === 0) {
                state.currentCount = 1;
            } else {
                state.currentCount++;
            }

            log.info(`🚀 Đang thực hiện lượt ${state.currentCount}/${state.maxSearches}`);

            state.nextSearchTime = null;
            saveState(state);
            updateUIFromState();

            const success = await performSearch(state);

            if (!success) {
                log.info('❌ Lỗi khi search, nhưng vẫn tính là đã thử');
            } else {
                log.info(`✅ Hoàn thành lượt ${state.currentCount}/${state.maxSearches}`);
            }

            saveState(state);

        } catch (error) {
            log.error('❌ Lỗi:', error);
        } finally {
            releaseLock();
            isProcessing = false;
        }
    }

    async function startAutoSearch(config) {
        const state = {
            isRunning: true,
            currentCount: 0,
            maxSearches: config.maxSearches,
            minDelay: config.minDelay,
            maxDelay: config.maxDelay,
            typingSpeed: config.typingSpeed,
            lastSearchTime: 0,
            nextSearchTime: null,
            completed: false
        };

        saveState(state);
        updateUIFromState();

        log.info(`🎬 Bắt đầu chạy ${config.maxSearches} lượt search`);

        await sleep(1000);
        processAutoSearch();
    }

    function stopAutoSearch() {
        clearState();
        log.info('🛑 Đã dừng auto search');
        updateUIFromState();
    }

    function updateUIFromState() {
        const state = loadState();
        const currentCountEl = document.getElementById('currentCount');
        const totalCountEl = document.getElementById('totalCount');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const statusDot = document.getElementById('statusDot');
        const statusLabel = document.getElementById('statusLabel');
        const progressBar = document.getElementById('progressBar');
        const statusInfo = document.getElementById('statusInfo');
        const usedQueriesInfo = document.getElementById('usedQueriesInfo');

        const statusDotMini = document.getElementById('statusDotMini');
        const countMini = document.getElementById('countMini');

        if (!currentCountEl) return;

        if (usedQueriesInfo) {
            const used = loadUsedQueries();
            const totalQueries = topics.vi.length + topics.en.length;
            const usedCount = used.queries.length;
            const remaining = totalQueries - usedCount;
            usedQueriesInfo.textContent = `Today: ${usedCount} used, ${remaining} remaining (${totalQueries} total)`;
        }

        if (state && state.isRunning) {
            const percentage = (state.currentCount / state.maxSearches) * 100;
            currentCountEl.textContent = state.currentCount;
            totalCountEl.textContent = state.maxSearches;
            startBtn.disabled = true;
            stopBtn.disabled = false;

            if (statusDot) {
                statusDot.style.background = '#10b981';
                statusDot.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
            }
            if (statusLabel) statusLabel.textContent = 'Running';
            if (statusInfo) statusInfo.textContent = 'Searching in progress...';

            if (progressBar) {
                progressBar.style.width = percentage + '%';
            }

            if (statusDotMini) statusDotMini.style.background = '#10b981';
            if (countMini) countMini.textContent = `${state.currentCount}/${state.maxSearches}`;

        } else if (state && state.completed) {
            currentCountEl.textContent = state.currentCount;
            totalCountEl.textContent = state.maxSearches;
            startBtn.disabled = false;
            stopBtn.disabled = true;

            if (statusDot) {
                statusDot.style.background = '#10b981';
                statusDot.style.boxShadow = 'none';
            }
            if (statusLabel) statusLabel.textContent = 'Completed';
            if (statusInfo) statusInfo.textContent = 'All searches finished!';

            if (progressBar) {
                progressBar.style.width = '100%';
            }

            if (statusDotMini) statusDotMini.style.background = '#10b981';
            if (countMini) countMini.textContent = `${state.currentCount}/${state.maxSearches}`;

        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;

            if (statusDot) {
                statusDot.style.background = '#9ca3af';
                statusDot.style.boxShadow = 'none';
            }
            if (statusLabel) statusLabel.textContent = 'Ready';
            if (statusInfo) statusInfo.textContent = 'Ready to start';

            if (!state) {
                currentCountEl.textContent = '0';
            }
            if (progressBar) {
                progressBar.style.width = '0%';
            }

            if (statusDotMini) statusDotMini.style.background = '#9ca3af';
            if (countMini) countMini.textContent = state ? `${state.currentCount}/${state.maxSearches}` : '0/0';
        }
    }

    function createControlPanel() {
        if (document.getElementById('autoSearchPanel')) {
            updateUIFromState();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'autoSearchPanel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            z-index: 999999;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
            width: 340px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const config = loadConfig();

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #111827;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span style="font-size: 15px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">Auto Search ${isFirefox ? '(Firefox)' : ''}</span>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button id="minimizePanel" style="
                        background: transparent;
                        border: none;
                        width: 28px;
                        height: 28px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #6b7280;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.15s;
                        line-height: 1;
                    ">−</button>
                    <button id="closePanel" style="
                        background: transparent;
                        border: none;
                        width: 28px;
                        height: 28px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #6b7280;
                        font-size: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.15s;
                        line-height: 1;
                    ">×</button>
                </div>
            </div>

            <div id="panelContent">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div id="statusDot" style="width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; transition: all 0.3s;"></div>
                        <span id="statusLabel" style="font-size: 13px; color: #6b7280; font-weight: 500;">Ready</span>
                    </div>
                    <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px;">
                        <span id="currentCount" style="font-size: 48px; font-weight: 600; color: #111827; line-height: 1; letter-spacing: -0.03em;">0</span>
                        <span style="color: #d1d5db; font-size: 20px; font-weight: 500;">/</span>
                        <span id="totalCount" style="font-size: 24px; font-weight: 500; color: #6b7280; line-height: 1.2;">${config.maxSearches}</span>
                    </div>
                    <div style="background: #f3f4f6; height: 4px; border-radius: 2px; overflow: hidden; margin-bottom: 8px;">
                        <div id="progressBar" style="background: #111827; height: 100%; width: 0%; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                    </div>
                    <div style="font-size: 11px; color: #9ca3af; text-align: center;">
                        <span id="usedQueriesInfo">Checking queries...</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Min Delay (s)</label>
                        <input type="number" id="minDelay" value="${config.minDelay}" min="1" max="300"
                            style="width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #111827; transition: all 0.15s; font-weight: 500;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Max Delay (s)</label>
                        <input type="number" id="maxDelay" value="${config.maxDelay}" min="1" max="300"
                            style="width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #111827; transition: all 0.15s; font-weight: 500;">
                    </div>
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Typing Speed (ms)</label>
                    <input type="number" id="typingSpeed" value="${config.typingSpeed}" min="10" max="500"
                        style="width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #111827; transition: all 0.15s; font-weight: 500;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Total Searches</label>
                    <input type="number" id="maxSearches" value="${config.maxSearches}" min="1" max="100"
                        style="width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #111827; transition: all 0.15s; font-weight: 500;">
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button id="startBtn" style="
                        flex: 1;
                        background: #111827;
                        color: white;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.15s;
                        letter-spacing: -0.01em;
                    ">
                        Start
                    </button>
                    <button id="stopBtn" disabled style="
                        flex: 1;
                        background: #f3f4f6;
                        color: #9ca3af;
                        border: 1px solid #e5e7eb;
                        padding: 10px 16px;
                        border-radius: 8px;
                        cursor: not-allowed;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.15s;
                        letter-spacing: -0.01em;
                    ">
                        Stop
                    </button>
                </div>

                <button id="saveConfigBtn" style="
                    width: 100%;
                    background: #f3f4f6;
                    color: #111827;
                    border: 1px solid #e5e7eb;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.15s;
                    letter-spacing: -0.01em;
                    margin-bottom: 8px;
                ">
                   Save Settings
                </button>

                <button id="resetQueriesBtn" style="
                    width: 100%;
                    background: #fff7ed;
                    color: #c2410c;
                    border: 1px solid #fed7aa;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.15s;
                    letter-spacing: -0.01em;
                    margin-bottom: 12px;
                ">
                   Reset Used Queries
                </button>

                <div style="padding: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 11px; color: #6b7280; line-height: 1.5;">
                    <span id="statusInfo">Ready to start</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        let isMinimized = false;
        const panelContent = document.getElementById('panelContent');
        const minimizeBtn = document.getElementById('minimizePanel');

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                panelContent.style.display = 'none';
                panel.style.width = 'auto';
                panel.style.padding = '12px 16px';
                minimizeBtn.textContent = '+';
                document.getElementById('closePanel').style.display = 'none';

                const compactStatus = document.createElement('div');
                compactStatus.id = 'compactStatus';
                compactStatus.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 12px;
                `;

                const state = loadState();
                const statusDotMini = document.createElement('div');
                statusDotMini.id = 'statusDotMini';
                statusDotMini.style.cssText = `
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: ${state && state.isRunning ? '#10b981' : '#9ca3af'};
                `;

                const countMini = document.createElement('span');
                countMini.id = 'countMini';
                countMini.style.cssText = `
                    font-size: 12px;
                    font-weight: 600;
                    color: #111827;
                `;
                countMini.textContent = state ? `${state.currentCount}/${state.maxSearches}` : '0/0';

                compactStatus.appendChild(statusDotMini);
                compactStatus.appendChild(countMini);
                panel.querySelector('div').appendChild(compactStatus);

            } else {
                panelContent.style.display = 'block';
                panel.style.width = '340px';
                panel.style.padding = '24px';
                minimizeBtn.textContent = '−';
                document.getElementById('closePanel').style.display = 'flex';

                const compactStatus = document.getElementById('compactStatus');
                if (compactStatus) {
                    compactStatus.remove();
                }
            }
        });

        // Firefox-friendly hover effects
        const addHoverEffect = (element, normalBg, hoverBg, normalColor, hoverColor) => {
            element.addEventListener('mouseenter', () => {
                element.style.background = hoverBg;
                if (hoverColor) element.style.color = hoverColor;
            });
            element.addEventListener('mouseleave', () => {
                element.style.background = normalBg;
                if (normalColor) element.style.color = normalColor;
            });
        };

        addHoverEffect(minimizeBtn, 'transparent', '#f3f4f6', '#6b7280', '#111827');
        addHoverEffect(document.getElementById('closePanel'), 'transparent', '#f3f4f6', '#6b7280', '#111827');

        // Input focus effects for Firefox
        ['minDelay', 'maxDelay', 'typingSpeed', 'maxSearches'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('focus', () => {
                input.style.borderColor = '#111827';
                input.style.outline = 'none';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#e5e7eb';
            });
        });

        document.getElementById('resetQueriesBtn').addEventListener('click', () => {
            const resetBtn = document.getElementById('resetQueriesBtn');
            const today = new Date().toDateString();
            localStorage.setItem(USED_QUERIES_KEY, JSON.stringify({ date: today, queries: [] }));

            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '✓ Reset!';
            resetBtn.style.background = '#d1fae5';
            resetBtn.style.borderColor = '#10b981';
            resetBtn.style.color = '#065f46';

            updateUIFromState();

            setTimeout(() => {
                resetBtn.innerHTML = originalText;
                resetBtn.style.background = '#fff7ed';
                resetBtn.style.borderColor = '#fed7aa';
                resetBtn.style.color = '#c2410c';
            }, 1500);
        });

        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            const config = {
                minDelay: parseInt(document.getElementById('minDelay').value),
                maxDelay: parseInt(document.getElementById('maxDelay').value),
                typingSpeed: parseInt(document.getElementById('typingSpeed').value),
                maxSearches: parseInt(document.getElementById('maxSearches').value)
            };
            saveConfig(config);

            const btn = document.getElementById('saveConfigBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Saved!';
            btn.style.background = '#d1fae5';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#065f46';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#f3f4f6';
                btn.style.borderColor = '#e5e7eb';
                btn.style.color = '#111827';
            }, 1500);
        });

        const stopBtn = document.getElementById('stopBtn');
        const startBtn = document.getElementById('startBtn');

        const updateStopBtnStyle = () => {
            if (!stopBtn.disabled) {
                stopBtn.style.background = '#fee2e2';
                stopBtn.style.color = '#dc2626';
                stopBtn.style.borderColor = '#fecaca';
                stopBtn.style.cursor = 'pointer';
                addHoverEffect(stopBtn, '#fee2e2', '#fecaca');
            } else {
                stopBtn.style.background = '#f3f4f6';
                stopBtn.style.color = '#9ca3af';
                stopBtn.style.borderColor = '#e5e7eb';
                stopBtn.style.cursor = 'not-allowed';
            }
        };

        addHoverEffect(startBtn, '#111827', '#000000');

        startBtn.addEventListener('click', () => {
            const config = {
                minDelay: parseInt(document.getElementById('minDelay').value),
                maxDelay: parseInt(document.getElementById('maxDelay').value),
                typingSpeed: parseInt(document.getElementById('typingSpeed').value),
                maxSearches: parseInt(document.getElementById('maxSearches').value)
            };
            document.getElementById('totalCount').textContent = config.maxSearches;
            startAutoSearch(config);
            updateStopBtnStyle();
        });

        stopBtn.addEventListener('click', () => {
            stopAutoSearch();
            updateStopBtnStyle();
        });

        document.getElementById('closePanel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('maxSearches').addEventListener('input', (e) => {
            document.getElementById('totalCount').textContent = e.target.value;
        });

        const state = loadState();
        if (state && state.maxSearches) {
            document.getElementById('totalCount').textContent = state.maxSearches;
        }

        updateUIFromState();
        updateStopBtnStyle();
    }

    function startPolling() {
        setInterval(() => {
            const state = loadState();
            if (state && state.isRunning) {
                processAutoSearch();
            }
            updateUIFromState();
        }, 2000);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setTimeout(() => {
            createControlPanel();
            startPolling();
            log.info(`✅ Script initialized - ${isFirefox ? 'Firefox' : 'Chromium'} mode`);
        }, 1000);
    }

    init();
})();