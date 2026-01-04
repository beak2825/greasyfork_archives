// ==UserScript==
// @name         Duy Tan Exam Search Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto collect and search exam data with Excel parsing and student lookup
// @author       You
// @match        https://pdaotao.duytan.edu.vn/EXAM_LIST/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552436/Duy%20Tan%20Exam%20Search%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552436/Duy%20Tan%20Exam%20Search%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const BASE_URL = 'https://pdaotao.duytan.edu.vn/EXAM_LIST/';
    const DETAIL_URL = 'https://pdaotao.duytan.edu.vn/EXAM_LIST_Detail/';
    const UPLOAD_URL = 'https://pdaotao.duytan.edu.vn/uploads/Exam/';
    const STORAGE_KEY = 'duytan_exam_data';
    const EXCEL_CACHE_KEY = 'duytan_excel_cache';
    const DATA_REFRESH_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    // Global variables
    let examData = [];
    let excelCache = new Map(); // Cache for Excel data
    let isCollecting = false;

    // Smart search functions
    function removeVietnameseAccents(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    function normalizeSearchText(text) {
        return removeVietnameseAccents(text)
            .toLowerCase()
            .replace(/\s+/g, '') // Remove all spaces
            .replace(/[^\w]/g, ''); // Remove special characters
    }

    function smartSearch(searchText, targetText) {
        const normalizedSearch = normalizeSearchText(searchText);
        const normalizedTarget = normalizeSearchText(targetText);
        return normalizedTarget.includes(normalizedSearch);
    }

    // Initialize
    init();

    function init() {
        loadStoredData();
        createSearchInterface();

        // Auto collect data if on main page and data is old or empty
        if (window.location.href.includes('Default.aspx') || window.location.href.endsWith('EXAM_LIST/')) {
            checkAndCollectData();
        }
    }

    function loadStoredData() {
        // Try sessionStorage first (cleared when browser tab is closed)
        let stored = sessionStorage.getItem(STORAGE_KEY);
        let fromSession = true;

        if (!stored) {
            // Fall back to localStorage
            stored = localStorage.getItem(STORAGE_KEY);
            fromSession = false;
        }

        if (stored) {
            try {
                const data = JSON.parse(stored);
                const now = new Date().getTime();
                const dataTime = new Date(data.timestamp).getTime();
                const timeDiff = now - dataTime;

                // Check if data is newer than 2 hours
                if (timeDiff < DATA_REFRESH_INTERVAL) {
                    examData = data.exams;
                    const remainingTime = Math.ceil((DATA_REFRESH_INTERVAL - timeDiff) / (60 * 1000)); // minutes
                    console.log(`Loaded ${examData.length} exam records from ${fromSession ? 'session' : 'local'} storage`);
                    console.log(`Data will refresh in ${remainingTime} minutes`);

                    // Show status with remaining time
                    const hours = Math.floor(remainingTime / 60);
                    const minutes = remainingTime % 60;
                    const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    showStatus(`Database có ${examData.length} bài thi (làm mới sau ${timeText})`, 'success');

                    return;
                } else {
                    console.log('Data is older than 2 hours, will refresh');
                    // Clear old data
                    sessionStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (error) {
                console.error('Error parsing stored data:', error);
                sessionStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        examData = [];
    }

    function saveData() {
        const data = {
            timestamp: new Date().toISOString(),
            exams: examData
        };

        const dataString = JSON.stringify(data);

        // Save to both sessionStorage (priority) and localStorage (backup)
        try {
            sessionStorage.setItem(STORAGE_KEY, dataString);
            console.log(`Saved ${examData.length} exam records to sessionStorage`);
        } catch (error) {
            console.warn('Failed to save to sessionStorage:', error);
        }

        try {
            localStorage.setItem(STORAGE_KEY, dataString);
            console.log(`Saved ${examData.length} exam records to localStorage`);
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }

        // Schedule next refresh check
        scheduleNextRefresh();
    }

    async function checkAndCollectData() {
        if (examData.length === 0 && !isCollecting) {
            showStatus('Đang thu thập dữ liệu thi...', 'info');
            await collectAllExamData();
        } else if (examData.length > 0) {
            showStatus(`Đã có ${examData.length} bài thi trong database`, 'success');
        }
    }

    async function collectAllExamData() {
        if (isCollecting) return;
        isCollecting = true;
        examData = [];

        let page = 1;
        let hasMorePages = true;
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000); // 1 tháng trước

        while (hasMorePages) {
            showStatus(`Đang thu thập trang ${page}...`, 'info');
            try {
                const pageData = await fetchPageData(page);
                if (pageData.length === 0) {
                    hasMorePages = false;
                } else {
                    // Kiểm tra ngày thi của từng bài thi, nếu có bài thi nào quá cũ thì dừng luôn
                    let foundOldExam = false;
                    for (const exam of pageData) {
                        // Cố gắng lấy ngày thi từ tiêu đề (ví dụ: (14:33 24/07/2025))
                        const dateMatch = exam.title.match(/\((\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{4})\)/);
                        if (dateMatch) {
                            const dateStr = dateMatch[2];
                            const [day, month, year] = dateStr.split('/').map(Number);
                            const examDate = new Date(year, month - 1, day);
                            if (examDate < oneMonthAgo) {
                                foundOldExam = true;
                                break;
                            }
                        }
                    }
                    // Nếu có bài thi quá cũ thì chỉ lấy các bài mới trên trang này, bỏ qua các trang sau
                    if (foundOldExam) {
                        // Lọc chỉ lấy các bài thi còn hạn
                        const filtered = pageData.filter(exam => {
                            const dateMatch = exam.title.match(/\((\d{2}:\d{2}) (\d{2}\/\d{2}\/\d{4})\)/);
                            if (dateMatch) {
                                const dateStr = dateMatch[2];
                                const [day, month, year] = dateStr.split('/').map(Number);
                                const examDate = new Date(year, month - 1, day);
                                return examDate >= oneMonthAgo;
                            }
                            return true; // Nếu không có ngày thì vẫn lấy
                        });
                        examData.push(...filtered);
                        hasMorePages = false;
                    } else {
                        examData.push(...pageData);
                        page++;
                        await sleep(500);
                    }
                }
            } catch (error) {
                console.error('Error fetching page', page, error);
                hasMorePages = false;
            }
        }

        // Fetch Excel files for each exam
        showStatus('Đang tải dữ liệu file Excel...', 'info');
        await fetchExcelFiles();

        // Show success message with next refresh time
        const nextRefresh = new Date(Date.now() + DATA_REFRESH_INTERVAL);
        const timeString = nextRefresh.toLocaleTimeString('vi-VN');
        showStatus(`Thu thập hoàn tất! Có ${examData.length} bài thi (làm mới lúc ${timeString})`, 'success');
    }

    async function fetchPageData(page) {
        const url = page === 1 ? `${BASE_URL}?lang=VN` : `${BASE_URL}?page=${page}&lang=VN`;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            return parseExamData(doc);
        } catch (error) {
            console.error('Failed to fetch page', page, error);
            return [];
        }
    }

    // FIX: Added missing parseExamData function
    function parseExamData(doc) {
        const exams = [];
        const links = doc.querySelectorAll('a[href*="EXAM_LIST_Detail"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();

            if (href && text) {
                // Extract ID from href
                const idMatch = href.match(/ID=(\d+)/);
                if (idMatch) {
                    const id = idMatch[1];
                    let fullUrl;

                    if (href.startsWith('../EXAM_LIST_Detail/')) {
                        // Remove ../ and construct proper URL
                        fullUrl = `https://pdaotao.duytan.edu.vn/EXAM_LIST_Detail/${href.substring(20)}`;
                    } else if (href.startsWith('EXAM_LIST_Detail/')) {
                        // Already relative to current domain
                        fullUrl = `https://pdaotao.duytan.edu.vn/${href}`;
                    } else if (href.startsWith('/')) {
                        // Absolute path
                        fullUrl = `https://pdaotao.duytan.edu.vn${href}`;
                    } else {
                        // Full URL or other format
                        fullUrl = href.includes('://') ? href : `https://pdaotao.duytan.edu.vn/EXAM_LIST_Detail/?ID=${id}&lang=VN`;
                    }

                    exams.push({
                        id: id,
                        title: text,
                        url: fullUrl,
                        searchText: text.toLowerCase(),
                        normalizedText: normalizeSearchText(text),
                        excelUrl: null, // Will be fetched later
                        students: [] // Will be populated from Excel
                    });
                }
            }
        });

        return exams;
    }

    async function fetchExcelFiles() {
        let processed = 0;
        for (const exam of examData) {
            try {
                const excelData = await getExcelDataForExam(exam);
                if (excelData) {
                    exam.excelUrl = excelData.url;
                    exam.students = excelData.students;
                }
                processed++;
                if (processed % 5 === 0) {
                    showStatus(`Đã xử lý ${processed}/${examData.length} file Excel...`, 'info');
                }
            } catch (error) {
                console.error('Error fetching Excel for exam', exam.id, error);
            }

            // Small delay to avoid overwhelming server
            await sleep(200);
        }

        saveData(); // Save updated data with Excel info
    }

    async function getExcelDataForExam(exam) {
        try {
            // Check cache first
            const cacheKey = exam.id;
            if (excelCache.has(cacheKey)) {
                return excelCache.get(cacheKey);
            }

            // Fetch exam detail page to get Excel file URL
            const response = await fetch(exam.url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Find Excel file link
            const excelLinks = doc.querySelectorAll('a[href*=".xlsx"], a[href*=".xls"]');
            if (excelLinks.length === 0) {
                return null;
            }

            const excelLink = excelLinks[0];
            let excelUrl = excelLink.getAttribute('href');

            // Convert relative URL to absolute
            if (excelUrl.startsWith('../uploads/Exam/')) {
                excelUrl = UPLOAD_URL + excelUrl.substring(16);
            } else if (excelUrl.startsWith('uploads/Exam/')) {
                excelUrl = 'https://pdaotao.duytan.edu.vn/' + excelUrl;
            }

            // Fetch and parse Excel file
            const students = await parseExcelFile(excelUrl);

            const result = {
                url: excelUrl,
                students: students
            };

            // Cache result
            excelCache.set(cacheKey, result);

            return result;

        } catch (error) {
            console.error('Error getting Excel data for exam', exam.id, error);
            return null;
        }
    }

    async function parseExcelFile(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();

            // Use SheetJS to parse Excel file
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            if (jsonData.length < 2) return [];

            return parseDuyTanExamFormat(jsonData);

        } catch (error) {
            console.error('Error parsing Excel file:', url, error);
            return [];
        }
    }

    function parseDuyTanExamFormat(data) {
        const students = [];
        let currentExamInfo = {
            time: '',
            date: '',
            room: '',
            location: ''
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;

            const firstCol = row[0] ? row[0].toString().trim() : '';

            // Check if this is a time/room info line
            if (firstCol === '' && row[1] && row[1].toString().includes('Thời gian:')) {
                const timeInfo = extractTimeAndRoomInfo(row);
                if (timeInfo) {
                    currentExamInfo = timeInfo;
                }
                continue;
            }

            // Check if this is a student data row (starts with a number)
            if (firstCol && !isNaN(firstCol) && parseInt(firstCol) > 0) {
                const student = parseStudentRow(row, currentExamInfo);
                if (student && student.mssv) {
                    students.push(student);
                }
            }
        }

        return students;
    }

    function extractTimeAndRoomInfo(row) {
        try {
            let timeText = '';
            let roomText = '';
            let locationText = '';

            // Find time information
            for (let j = 0; j < row.length; j++) {
                const cell = row[j] ? row[j].toString() : '';
                if (cell.includes('Thời gian:')) {
                    // Extract time and date: "Thời gian:  15h30 - 24/07/2025"
                    const timeMatch = cell.match(/Thời gian:\s*(.+)/);
                    if (timeMatch) {
                        timeText = timeMatch[1].trim();
                    }
                }
                if (cell.includes('Phòng:')) {
                    // Look for room info in subsequent cells
                    for (let k = j + 1; k < row.length; k++) {
                        if (row[k] && row[k].toString().trim()) {
                            const roomInfo = row[k].toString().trim();
                            if (roomInfo.includes('Nhà') || roomInfo.includes('Hòa Khánh') || /^\d+/.test(roomInfo)) {
                                if (roomInfo.includes('Nhà') || roomInfo.includes('Hòa Khánh')) {
                                    locationText = roomInfo;
                                } else {
                                    roomText = roomInfo;
                                }
                            }
                        }
                    }
                }
            }

            // Extract date and time separately if possible
            let date = '';
            let time = '';
            if (timeText) {
                const timeMatch = timeText.match(/(\d{1,2}h\d{2})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
                if (timeMatch) {
                    time = timeMatch[1];
                    date = timeMatch[2];
                } else {
                    time = timeText;
                }
            }

            return {
                time: time,
                date: date,
                room: roomText,
                location: locationText,
                fullTimeText: timeText
            };

        } catch (error) {
            console.error('Error extracting time/room info:', error);
            return null;
        }
    }

    function parseStudentRow(row, examInfo) {
        try {
            // Expected format: STT, STT, MÃ SV, HỌ VÀ, TÊN, LỚP HỌC PHẦN, LỚP SH, ...
            const stt1 = row[0] ? parseInt(row[0]) : 0;
            const stt2 = row[1] ? parseInt(row[1]) : 0;
            const mssv = row[2] ? row[2].toString().trim() : '';
            const ho = row[3] ? row[3].toString().trim() : '';
            const ten = row[4] ? row[4].toString().trim() : '';
            const lopHocPhan = row[5] ? row[5].toString().trim() : '';
            const lopSH = row[6] ? row[6].toString().trim() : '';

            // Skip empty rows or header rows
            if (!mssv || mssv === 'MÃ' || mssv.includes('SV') || !ho || !ten) {
                return null;
            }

            const fullName = `${ho} ${ten}`;

            return {
                mssv: mssv,
                name: fullName,
                ho: ho,
                ten: ten,
                lopHocPhan: lopHocPhan,
                lopSH: lopSH,
                stt1: stt1, // STT overall
                stt2: stt2, // STT in room
                room: examInfo.room,
                location: examInfo.location,
                time: examInfo.time,
                date: examInfo.date,
                fullTimeText: examInfo.fullTimeText,
                normalizedName: normalizeSearchText(fullName),
                normalizedMssv: normalizeSearchText(mssv),
                normalizedHo: normalizeSearchText(ho),
                normalizedTen: normalizeSearchText(ten)
            };

        } catch (error) {
            console.error('Error parsing student row:', error);
            return null;
        }
    }

    function findColumnIndex(headers, possibleNames) {
        for (const name of possibleNames) {
            const index = headers.findIndex(h => h.includes(name));
            if (index !== -1) return index;
        }
        return -1;
    }

    function createSearchInterface() {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.id = 'exam-search-container';
        searchContainer.innerHTML = `
            <div class="tw-fixed tw-bottom-6 tw-right-6 tw-z-[10000] tw-bg-white tw-border tw-border-blue-500 tw-rounded-xl tw-shadow-xl tw-p-5 tw-min-w-[300px] tw-max-w-[500px] tw-font-sans">
                <div class="tw-flex tw-items-center tw-mb-3 tw-gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-5 tw-h-5 tw-text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <span class="tw-font-bold tw-text-blue-600 tw-text-base">Tìm kiếm bài thi</span>
                    <button id="refresh-data-btn" class="tw-ml-auto tw-bg-blue-100 tw-rounded-full tw-p-2 tw-flex tw-items-center tw-justify-center tw-transition hover:tw-bg-blue-200" title="Làm mới dữ liệu" style="width:32px;height:32px;border:none;outline:none;cursor:pointer;">
                        <svg id="refresh-icon" xmlns="http://www.w3.org/2000/svg" class="tw-w-5 tw-h-5 tw-text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 12a9 9 0 11-3.219-6.825"/><path d="M21 3v6h-6"/></svg>
                    </button>
                </div>
                <input type="text" id="exam-search-input" placeholder="Nhập tên môn học, MSSV hoặc tên sinh viên..." class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-sm focus:tw-outline-none focus:tw-border-blue-400">
                <div class="tw-mt-2 tw-flex tw-gap-4 tw-items-center">
                    <label class="tw-text-xs tw-flex tw-items-center tw-gap-1">
                        <input type="radio" name="search-type" value="subject" checked class="tw-accent-blue-500"> Tìm môn học
                    </label>
                    <label class="tw-text-xs tw-flex tw-items-center tw-gap-1">
                        <input type="radio" name="search-type" value="student" class="tw-accent-blue-500"> Tìm sinh viên
                    </label>
                </div>
                <div id="search-results" class="tw-max-h-[300px] tw-overflow-y-auto tw-mt-3" style="display:none;"></div>
                <div class="tw-text-[11px] tw-text-gray-500 tw-text-center tw-mt-2">Dữ liệu tự động làm mới mỗi 2 tiếng</div>
            </div>
        `;

        document.body.appendChild(searchContainer);

        // Add event listeners
        const searchInput = document.getElementById('exam-search-input');
        const searchResults = document.getElementById('search-results');
        const refreshBtn = document.getElementById('refresh-data-btn');
        const refreshIcon = document.getElementById('refresh-icon');

        searchInput.addEventListener('input', handleSearch);
        refreshBtn.addEventListener('click', () => {
            refreshData();
        });

        // Add click handlers to results (delegated)
        searchResults.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.search-result-item');
            if (resultItem) {
                const url = resultItem.getAttribute('data-url');
                const id = resultItem.getAttribute('data-id');
                handleResultClick(url, id);
            }
        });

        // Click outside to close results
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    function handleSearch(e) {
        const query = e.target.value.trim();
        const resultsDiv = document.getElementById('search-results');
        const searchType = document.querySelector('input[name="search-type"]:checked').value;

        if (query.length < 2) {
            resultsDiv.style.display = 'none';
            return;
        }

        let matches = [];

        if (searchType === 'subject') {
            // Search by subject name
            matches = examData.filter(exam =>
                smartSearch(query, exam.title)
            ).slice(0, 10);

            displaySubjectResults(matches, query, resultsDiv);
        } else {
            // Search by student (MSSV or name)
            matches = searchStudents(query).slice(0, 10);
            displayStudentResults(matches, query, resultsDiv);
        }

        resultsDiv.style.display = 'block';
    }

    function searchStudents(query) {
        const results = [];

        for (const exam of examData) {
            if (!exam.students || exam.students.length === 0) continue;

            for (const student of exam.students) {
                // Search by MSSV, full name, ho, or ten
                if (smartSearch(query, student.mssv) ||
                    smartSearch(query, student.name) ||
                    smartSearch(query, student.ho) ||
                    smartSearch(query, student.ten)) {
                    results.push({
                        exam: exam,
                        student: student
                    });
                }
            }
        }

        return results;
    }

    function displaySubjectResults(matches, query, resultsDiv) {
        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 10px; color: #666;">Không tìm thấy môn học</div>';
        } else {
            resultsDiv.innerHTML = matches.map(exam => `
                <div class="search-result-item" data-url="${exam.url}" data-id="${exam.id}" data-type="subject" style="
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='#f8f9fa'"
                   onmouseout="this.style.backgroundColor='white'">
                    <div style="font-weight: bold; color: #007bff; margin-bottom: 5px;">
                        ${highlightText(exam.title, query)}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        📊 ${exam.students ? exam.students.length : 0} sinh viên • Click để xem chi tiết
                    </div>
                </div>
            `).join('');
        }
    }

    function displayStudentResults(matches, query, resultsDiv) {
        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div style="padding: 10px; color: #666;">Không tìm thấy sinh viên</div>';
        } else {
            resultsDiv.innerHTML = matches.map(match => {
                const student = match.student;
                const exam = match.exam;

                // Format exam info
                const examDate = student.date || 'Chưa xác định';
                const examTime = student.time || 'Chưa xác định';
                const roomInfo = student.room || 'Chưa xác định';
                const locationInfo = student.location || 'Chưa xác định';
                const sttInfo = student.stt2 || student.stt1 || 'N/A';

                // Create detailed time/location string
                let timeLocationText = '';
                if (student.fullTimeText) {
                    timeLocationText = `🕐 ${student.fullTimeText}`;
                } else if (examTime && examDate) {
                    timeLocationText = `🕐 ${examTime} - ${examDate}`;
                } else {
                    timeLocationText = `🕐 ${examTime}`;
                }

                const roomLocationText = roomInfo && locationInfo ?
                    `🚪 Phòng ${roomInfo} - ${locationInfo}` :
                    (roomInfo ? `🚪 Phòng ${roomInfo}` : '🚪 Chưa xác định phòng');

                return `
                    <div class="search-result-item" data-url="${exam.url}" data-id="${exam.id}" data-type="student" style="
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    " onmouseover="this.style.backgroundColor='#f8f9fa'"
                       onmouseout="this.style.backgroundColor='white'">
                        <div style="font-weight: bold; color: #28a745; margin-bottom: 4px;">
                            👤 ${highlightText(student.name, query)}
                            <span style="color: #007bff;">(${highlightText(student.mssv, query)})</span>
                        </div>
                        <div style="font-size: 11px; color: #007bff; margin-bottom: 4px;">
                            📚 ${exam.title}
                        </div>
                        <div style="font-size: 11px; color: #666; margin-bottom: 2px;">
                            ${timeLocationText}
                        </div>
                        <div style="font-size: 11px; color: #666; margin-bottom: 2px;">
                            ${roomLocationText}
                        </div>
                        <div style="font-size: 11px; color: #666;">
                            #️⃣ STT: ${sttInfo} • 🎓 Lớp: ${student.lopSH || 'N/A'}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
    }

    async function handleResultClick(url, id) {
        showStatus('Đang mở trang chi tiết...', 'info');

        // Hide search results
        document.getElementById('search-results').style.display = 'none';

        // Open the detail page
        window.open(url, '_blank');

        // Optionally, try to fetch and show download link info
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Look for download links
            const downloadLinks = doc.querySelectorAll('a[href*=".xlsx"], a[href*=".xls"], a[href*=".pdf"]');
            if (downloadLinks.length > 0) {
                showStatus('Trang chi tiết đã mở! Có file tải về.', 'success');
            } else {
                showStatus('Trang chi tiết đã mở!', 'success');
            }
        } catch (error) {
            showStatus('Trang chi tiết đã mở!', 'success');
        }
    }

    function scheduleNextRefresh() {
        // Clear any existing timeout
        if (window.examRefreshTimeout) {
            clearTimeout(window.examRefreshTimeout);
        }

        // Schedule automatic refresh after 2 hours
        window.examRefreshTimeout = setTimeout(() => {
            showStatus('Dữ liệu đã cũ, đang làm mới tự động...', 'warning');
            refreshData();
        }, DATA_REFRESH_INTERVAL);

        console.log('Scheduled automatic refresh in 2 hours');
    }

    async function refreshData() {
        examData = [];
        excelCache.clear();
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(EXCEL_CACHE_KEY);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXCEL_CACHE_KEY);
        showStatus('Đang làm mới dữ liệu...', 'info');
        await collectAllExamData();
    }

    // Hiển thị trạng thái bằng hiệu ứng loading trên nút refresh
    function showStatus(message, type = 'info') {
        // Đổi icon và hiệu ứng nút refresh nếu đang fetch
        const refreshBtn = document.getElementById('refresh-data-btn');
        const refreshIcon = document.getElementById('refresh-icon');
        if (refreshBtn && refreshIcon) {
            if (type === 'info' && /đang làm mới|đang thu thập|fetch|loading|tải dữ liệu/i.test(message)) {
                refreshBtn.disabled = true;
                refreshIcon.style.animation = 'spin 1s linear infinite';
                refreshIcon.style.opacity = '1';
            } else {
                refreshBtn.disabled = false;
                refreshIcon.style.animation = '';
                refreshIcon.style.opacity = '1';
            }
        }
        // Không hiển thị search-status nữa
        // Ghi log ra console
        console.log('[Exam Search]', message);
    }

    // Thêm CSS cho hiệu ứng quay
    (function addSpinStyle() {
        if (!document.getElementById('spin-style')) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.innerHTML = `
                .tw-fixed{position:fixed;}
                .tw-bottom-6{bottom:1.5rem;}
                .tw-right-6{right:1.5rem;}
                .tw-z-[10000]{z-index:10000;}
                .tw-bg-white{background-color:#fff;}
                .tw-border{border-width:1px;}
                .tw-border-blue-500{border-color:#3b82f6;}
                .tw-rounded-xl{border-radius:0.75rem;}
                .tw-shadow-xl{box-shadow:0 4px 20px rgba(0,0,0,0.3);}
                .tw-p-5{padding:1.25rem;}
                .tw-min-w-[300px]{min-width:300px;}
                .tw-max-w-[500px]{max-width:500px;}
                .tw-font-sans{font-family:sans-serif;}
                .tw-flex{display:flex;}
                .tw-items-center{align-items:center;}
                .tw-mb-3{margin-bottom:0.75rem;}
                .tw-gap-2{gap:0.5rem;}
                .tw-font-bold{font-weight:700;}
                .tw-text-blue-600{color:#2563eb;}
                .tw-text-base{font-size:1rem;}
                .tw-ml-auto{margin-left:auto;}
                .tw-bg-blue-100{background-color:#dbeafe;}
                .tw-rounded-full{border-radius:9999px;}
                .tw-p-2{padding:0.5rem;}
                .tw-transition{transition:all 0.2s;}
                .hover\:tw-bg-blue-200:hover{background-color:#bfdbfe;}
                .tw-w-5{width:1.25rem;}
                .tw-h-5{height:1.25rem;}
                .tw-text-blue-500{color:#3b82f6;}
                .tw-w-full{width:100%;}
                .tw-px-3{padding-left:0.75rem;padding-right:0.75rem;}
                .tw-py-2{padding-top:0.5rem;padding-bottom:0.5rem;}
                .tw-border-gray-300{border-color:#d1d5db;}
                .tw-rounded-md{border-radius:0.375rem;}
                .tw-text-sm{font-size:0.875rem;}
                .focus\:tw-outline-none:focus{outline:none;}
                .focus\:tw-border-blue-400:focus{border-color:#60a5fa;}
                .tw-mt-2{margin-top:0.5rem;}
                .tw-gap-4{gap:1rem;}
                .tw-text-xs{font-size:0.75rem;}
                .tw-flex{display:flex;}
                .tw-items-center{align-items:center;}
                .tw-gap-1{gap:0.25rem;}
                .tw-accent-blue-500:checked{accent-color:#3b82f6;}
                .tw-max-h-[300px]{max-height:300px;}
                .tw-overflow-y-auto{overflow-y:auto;}
                .tw-mt-3{margin-top:0.75rem;}
                .tw-text-[11px]{font-size:11px;}
                .tw-text-gray-500{color:#6b7280;}
                .tw-text-center{text-align:center;}
                .tw-mt-2{margin-top:0.5rem;}
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    })();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();