// ==UserScript==
// @name         Waygrounnd
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  TuDien
// @author       Ngoc
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563598/Waygrounnd.user.js
// @updateURL https://update.greasyfork.org/scripts/563598/Waygrounnd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Dữ liệu từ vựng
    const vocabularyList = [
      { "word": "excited", "meaning": "hào hứng" },
      { "word": "interact with", "meaning": "tương tác với" },
      { "word": "capable", "meaning": "có khả năng" },
      { "word": "smart", "meaning": "thông minh" },
      { "word": "facial", "meaning": "thuộc về khuôn mặt" },
      { "word": "recognition", "meaning": "nhận dạng" },
      { "word": "identity", "meaning": "danh tính" },
      { "word": "virtual assistant", "meaning": "trợ lý ảo" },
      { "word": "explore", "meaning": "khám phá" },
      { "word": "scientist", "meaning": "nhà khoa học" },
      { "word": "engineer", "meaning": "kĩ sư" },
      { "word": "repair", "meaning": "sửa chữa" },
      { "word": "vacuum cleaner", "meaning": "máy hút bụi" },
      { "word": "arrange", "meaning": "sắp xếp" },
      { "word": "robot", "meaning": "người máy" },
      { "word": "advanced", "meaning": "tiên tiến" },
      { "word": "analyse", "meaning": "phân tích" },
      { "word": "artificial intelligence", "meaning": "trí tuệ nhân tạo" },
      { "word": "programme", "meaning": "lập trình" },
      { "word": "proficiency", "meaning": "sự thành thạo" },
      { "word": "offer", "meaning": "cung cấp" },
      { "word": "dangerous", "meaning": "nguy hiểm" },
      { "word": "appearance", "meaning": "ngoại hình" },
      { "word": "ability", "meaning": "khả năng" },
      { "word": "exploration", "meaning": "sự khám phá" },
      { "word": "delivery service", "meaning": "dịch vụ giao hàng" },
      { "word": "improve", "meaning": "cải thiện" },
      { "word": "worry about", "meaning": "lo ngại" },
      { "word": "impact on", "meaning": "ảnh hưởng tới" },
      { "word": "effortlessly", "meaning": "dễ dàng" },
      { "word": "portfolio", "meaning": "danh mục đầu tư" },
      { "word": "hands-on", "meaning": "thực hành" },
      { "word": "limit", "meaning": "giới hạn" },
      { "word": "potential", "meaning": "tiềm năng" },
      { "word": "tropical forest", "meaning": "rừng nhiệt đới" },
      { "word": "guided", "meaning": "có người hướng dẫn" },
      { "word": "endangered", "meaning": "bị đe dọa" },
      { "word": "interactive", "meaning": "tương tác" },
      { "word": "engage in", "meaning": "tham gia vào" },
      { "word": "platform", "meaning": "nền tảng" },
      { "word": "software", "meaning": "phần mềm" },
      { "word": "complex", "meaning": "phức tạp" },
      { "word": "effective", "meaning": "hiệu quả" },
      { "word": "personalized", "meaning": "cá nhân hóa" },
      { "word": "clarify", "meaning": "làm rõ" },
      { "word": "feedback", "meaning": "phản hồi" },
      { "word": "available", "meaning": "có sẵn" },
      { "word": "instant", "meaning": "tức thời" },
      { "word": "battery", "meaning": "pin" },
      { "word": "depend on", "meaning": "phụ thuộc vào" },
      { "word": "forced labor", "meaning": "lao động ép buộc" },
      { "word": "stimulus", "meaning": "kích thích" },
      { "word": "evolution", "meaning": "sự tiến hóa" },
      { "word": "milestone", "meaning": "cột mốc quan trọng" },
      { "word": "slope", "meaning": "dốc" },
      { "word": "steep", "meaning": "dốc" },
      { "word": "provoke", "meaning": "khiêu khích" },
      { "word": "active volcano", "meaning": "núi lửa đang hoạt động" },
      { "word": "accurate", "meaning": "chính xác" },
      { "word": "interrupt", "meaning": "làm gián đoạn" },
      { "word": "respond", "meaning": "trả lời" },
      { "word": "mistake", "meaning": "sai lầm" },
      { "word": "imitate", "meaning": "bắt chước" },
      { "word": "gesture", "meaning": "cử chỉ/ điệu bộ" },
      { "word": "activate", "meaning": "kích hoạt" },
      { "word": "travel agent", "meaning": "đại lý du lịch" }
    ];

    // --- HÀM HỖ TRỢ ---
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // --- CSS STYLING (ĐÃ CHỈNH SỬA ĐỘ TRONG SUỐT) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Khung chính (Lúc thu nhỏ làm nút bấm) */
        #glass-dict {
            position: fixed; bottom: 20px; left: 10px;
            width: 45px; height: 45px;

            /* CHỈNH SỬA: Tăng độ trong suốt cho nút bấm (chỉ còn 0.15 tức 15% đậm) */
            background: rgba(255, 255, 255, 0);

            backdrop-filter: blur(2px); /* Mờ nhẹ */
            border-radius: 25px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            overflow: hidden; z-index: 999999;
            font-family: Arial, sans-serif;

            /* Viền mỏng và mờ */
            border: 1px solid rgba(255,255,255,0);
        }

        /* Hiệu ứng khi rê chuột vào nút bấm (để dễ thấy hơn khi cần dùng) */
        #glass-dict:hover {
            background: rgba(255, 255, 255, 0.4);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* Khung chính (Lúc mở rộng thành bảng) */
        #glass-dict.expanded {
            width: 290px; height: auto; max-height: 55vh;

            /* CHỈNH SỬA: Nền bảng trong suốt hơn (0.6 tức 60% đậm) */
            background: rgba(255, 255, 255, 0.6);

            /* Tăng độ mờ hậu cảnh để chữ vẫn đọc rõ trên nền web */
            backdrop-filter: blur(12px);

            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.4);
        }

        #dict-toggle {
            width: 100%; height: 45px; display: flex; align-items: center;
            justify-content: center; cursor: pointer; font-size: 22px;
            user-select: none;
            color: #333; /* Màu chữ icon */
            text-shadow: 0 0 5px rgba(255,255,255,0.8); /* Viền sáng quanh chữ để dễ đọc */
        }

        #dict-search {
            width: 85%; margin: 5px auto 10px auto; padding: 8px 12px;
            display: none;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 20px;
            font-size: 14px; outline: none;
            background: rgba(255,255,255,0.7); /* Ô tìm kiếm cũng trong suốt nhẹ */
        }

        #glass-dict.expanded #dict-search { display: block; }

        #dict-content {
            display: none; flex-direction: column; max-height: calc(55vh - 100px);
            overflow-y: auto; border-top: 1px solid rgba(0,0,0,0.05);
        }
        #glass-dict.expanded #dict-content { display: flex; }

        .dict-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .dict-table tr { border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer; }
        .dict-table td { padding: 12px 10px; color: #111; line-height: 1.4; font-weight: 500; }

        /* Màu khi nhấn chọn */
        .dict-table tr:active { background-color: rgba(40, 167, 69, 0.6) !important; color: #fff !important; }

        @keyframes flashGreen {
            0% { background-color: #fff; }
            50% { background-color: #d4edda; }
            100% { background-color: #fff; }
        }
        .auto-filled-flash {
            animation: flashGreen 1s ease;
        }
    `;
    document.head.appendChild(style);

    // --- UI GENERATION ---
    const container = document.createElement('div');
    container.id = 'glass-dict';

    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'dict-toggle';
    toggleBtn.innerHTML = '';
    container.appendChild(toggleBtn);

    const searchInput = document.createElement('input');
    searchInput.id = 'dict-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Tìm từ...';
    container.appendChild(searchInput);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'dict-content';

    const table = document.createElement('table');
    table.className = 'dict-table';

    // Hàm điền từ
    function fillAnswer(word) {
        const inputEl = document.querySelector('input.question-input, textarea.question-input, input[type="text"], textarea');
        if (inputEl) {
            inputEl.value = word;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.classList.remove('auto-filled-flash');
            void inputEl.offsetWidth;
            inputEl.classList.add('auto-filled-flash');
        }
    }

    function createRow(item, tableEl) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
             fillAnswer(item.word);
             row.style.backgroundColor = 'rgba(40, 167, 69, 0.6)';
             setTimeout(() => { row.style.backgroundColor = ''; }, 200);
        });
        const wordCell = document.createElement('td');
        wordCell.innerText = item.word;
        wordCell.style.fontWeight = 'bold';
        wordCell.style.width = '45%';
        const meaningCell = document.createElement('td');
        meaningCell.innerText = item.meaning;
        row.appendChild(wordCell);
        row.appendChild(meaningCell);
        tableEl.appendChild(row);
    }

    function renderTable(filterText = '') {
        table.innerHTML = '';
        const normalizedSearch = removeVietnameseTones(filterText);
        let count = 0;
        vocabularyList.forEach(item => {
            const normalizedMeaning = removeVietnameseTones(item.meaning);
            if (normalizedMeaning.includes(normalizedSearch)) {
                count++;
                createRow(item, table);
            }
        });
        if (count === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="2" style="text-align:center;color:#444;font-style:italic;padding:15px;">Không tìm thấy...</td>';
            table.appendChild(row);
        }
    }

    renderTable();
    contentDiv.appendChild(table);
    container.appendChild(contentDiv);
    document.body.appendChild(container);

    // --- EVENTS UI ---
    let isExpanded = false;
    toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
            container.classList.add('expanded');
            toggleBtn.innerHTML = '➖';
            toggleBtn.style.fontSize = '18px';
            setTimeout(() => searchInput.focus(), 300);
        } else {
            container.classList.remove('expanded');
            toggleBtn.innerHTML = '';
            toggleBtn.style.fontSize = '22px';
        }
    });

    searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });

    // --- LOGIC AUTO-FILL ---
    let currentQuestionContent = '';

    function getMatchScore(dictionaryMeaning, questionText) {
        const dictWords = removeVietnameseTones(dictionaryMeaning).split(' ').filter(w => w.trim() !== '');
        if (dictWords.length === 0) return 0;
        let matchCount = 0;
        dictWords.forEach(word => {
            if (questionText.includes(word)) matchCount++;
        });
        return matchCount / dictWords.length;
    }

    function checkAndAutoFill() {
        const questionEl = document.getElementById('questionText');
        if (!questionEl) return;

        const rawQuestionText = questionEl.innerText;
        if (rawQuestionText === currentQuestionContent) return;
        currentQuestionContent = rawQuestionText;

        const questionText = removeVietnameseTones(rawQuestionText);
        let candidates = [];

        vocabularyList.forEach(item => {
            const score = getMatchScore(item.meaning, questionText);
            const dictWordCount = item.meaning.split(' ').length;
            let threshold = 0.65;
            if (dictWordCount <= 2) threshold = 0.99;

            if (score >= threshold) {
                candidates.push({ item: item, score: score });
            }
        });

        candidates.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.item.meaning.length - a.item.meaning.length;
        });

        if (candidates.length > 0) {
            const bestChoice = candidates[0].item;
            fillAnswer(bestChoice.word);
            searchInput.value = bestChoice.meaning;
            table.innerHTML = '';
            candidates.forEach(candidate => {
                createRow(candidate.item, table);
            });
            if (!isExpanded) toggleBtn.click();
        } else {
            searchInput.value = '';
            renderTable('');
        }
    }

    const observer = new MutationObserver((mutations) => {
        checkAndAutoFill();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    setTimeout(checkAndAutoFill, 1000);

})();