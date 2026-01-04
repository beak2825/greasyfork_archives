// ==UserScript==
// @name         Sooplive Calendar Viewer
// @namespace    https://sooplive-calendar-viewer.local
// @version      2.7
// @description  Sooplive 즐겨찾기 그룹의 통합 일정을 캘린더 형태로 표시하는 스크립트
// @author       지창연구소
// @match        https://www.sooplive.co.kr/*
// @grant        GM_xmlhttpRequest
// @connect      api-channel.sooplive.co.kr
// @connect      myapi.sooplive.co.kr
// @downloadURL https://update.greasyfork.org/scripts/550224/Sooplive%20Calendar%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/550224/Sooplive%20Calendar%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 전역 변수
    let anchorDate = new Date();
    let currentUrl = window.location.href;
    let fixedStreamer = null; // 고정된 멤버 정보 {id, nickname}
    let clickedDay = null; // 클릭한 날짜 컬럼
    
    // 상수 정의 (하드코딩 제거)
    const TIMING = {
        SCROLL_COMPLETE_WAIT: 600,
        INDICATOR_SHOW_DELAY: 700,
        INDICATOR_FADE_OUT: 200,
        INDICATOR_FADE_IN: 10,
        INIT_RETRY_DELAY: 2000,
        URL_CHECK_INTERVAL: 1000,
        SPA_NAVIGATION_DELAY: 100
    };
    
        const LAYOUT = {
            SCROLL_MARGIN: 10,
            INDICATOR_BOTTOM_OFFSET: 15,
            SCROLL_POSITION_OFFSET: 5,
            VISIBLE_AREA_PADDING: 50, // 보이는 영역의 패딩 (헤더 높이 고려)
            OPTIMAL_POSITION_OFFSET: 30 // 최적 위치 오프셋
        };
    
    // 화살표 관련 유틸리티 함수들
    function createScrollIndicator(position, titleText) {
        const indicator = document.createElement('div');
        indicator.className = `scroll-indicator scroll-indicator-${position}`;
        
        // 위쪽/아래쪽 화살표 표시
        indicator.innerHTML = position === 'top' ? '↑' : '↓';
        
        indicator.title = titleText;
        indicator.style.opacity = '0';
        
        return indicator;
    }
    
    // 모든 강조 효과 및 화살표 제거
    function clearAllHighlights() {
        // 모든 강조 효과 제거
        const allEventItems = document.querySelectorAll('.event-item');
        allEventItems.forEach(eventItem => {
            eventItem.classList.remove('highlight', 'fade');
        });
        
        // 빈 날짜 강조 효과 제거
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach(day => {
            day.classList.remove('empty-day');
            
            // 스크롤 인디케이터 제거 (더 확실하게)
            const indicators = day.querySelectorAll('.scroll-indicator');
            indicators.forEach(indicator => {
                indicator.remove();
            });
        });
    }
    
    function removeScrollIndicator(container) {
        const existingIndicator = container.querySelector('.scroll-indicator');
        if (existingIndicator) {
            existingIndicator.style.opacity = '0';
            setTimeout(() => {
                if (existingIndicator.parentNode) {
                    existingIndicator.remove();
                }
            }, TIMING.INDICATOR_FADE_OUT);
        }
    }
    
    function showScrollIndicator(indicator, container, position) {
        container.style.position = 'relative';
        container.appendChild(indicator);
        
        // 부드럽게 나타나기
        setTimeout(() => {
            indicator.classList.add('show');
        }, 10);
    }

    // 테마 감지 함수 (Sooplive 실제 클래스 기반)
    function detectTheme() {
        const urlParams = new URLSearchParams(window.location.search);
        const themeColor = urlParams.get('theme_color');
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        // Sooplive의 실제 다크 테마 감지
        const isDarkTheme = 
            themeColor === 'dark' ||
            bodyElement.classList.contains('thema_dark') ||
            htmlElement.getAttribute('dark') === 'true' ||
            htmlElement.classList.contains('dark') ||
            bodyElement.classList.contains('dark') ||
            htmlElement.getAttribute('data-theme') === 'dark' ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
            
        return isDarkTheme ? 'dark' : 'light';
    }

    // CSS 스타일 추가 (테마 자동 감지)
    const style = document.createElement('style');
    style.textContent = `
        #sooplive-calendar {
            font-family: inherit;
            border-radius: 12px;
            transition: all 0.3s ease;
            margin: 24px 0;
            padding: 24px;
        }
        
        /* 라이트 테마 */
        #sooplive-calendar {
            background: #fff;
            border: 1px solid #e1e5e9;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e1e5e9;
        }
        
        .calendar-header h3 {
            margin: 0;
            color: #1a1a1a;
            font-size: 20px;
            font-weight: 600;
        }
        
        .week-navigation {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        
        .week-navigation button {
            background: #6366f1;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .week-navigation button:hover {
            background: #4f46e5;
            transform: translateY(-1px);
        }
        
        .week-range {
            font-weight: 500;
            color: #374151;
            font-size: 15px;
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
            background: #f3f4f6;
            border: 1px solid #e1e5e9;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .calendar-day {
            background: #fff;
            min-height: 140px;
        }
        
        .day-header {
            background: #f9fafb;
            padding: 12px 8px;
            text-align: center;
            border-bottom: 1px solid #e1e5e9;
        }
        
        .day-name {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .day-number {
            font-size: 17px;
            color: #1a1a1a;
            font-weight: 600;
            margin-top: 4px;
        }
        
        .event-count {
            font-size: 10px;
            color: #6366f1;
            font-weight: 600;
            margin-top: 2px;
            background: #f0f9ff;
            border-radius: 8px;
            padding: 2px 6px;
            display: inline-block;
        }
        
        .calendar-credit {
            text-align: right;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #e1e5e9;
            font-size: 11px;
            color: #9ca3af;
        }
        
        .credit-name {
            color: #6366f1;
            font-weight: 600;
        }
        
        .day-events {
            padding: 12px 8px;
            min-height: 100px;
            max-height: 500px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        .day-events::-webkit-scrollbar {
            width: 4px;
        }
        
        .day-events::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 2px;
        }
        
        .day-events::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 2px;
        }
        
        .day-events::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
        
        .no-events {
            color: #9ca3af;
            font-size: 13px;
            text-align: center;
            margin-top: 30px;
            font-style: italic;
        }
        
        .loading-message {
            text-align: center;
            padding: 20px;
            color: #374151;
            font-size: 15px;
            font-weight: 500;
        }
        
        .event-item {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 6px;
            font-size: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .event-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
            border-color: #7dd3fc;
        }
        
        .event-content {
            flex: 1;
            min-width: 0;
        }
        
        .event-actions {
            margin-left: 8px;
            flex-shrink: 0;
        }
        
        .station-link-btn {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 3px;
            padding: 3px;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.7;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6366f1;
            width: 16px;
            height: 16px;
        }
        
        .station-link-btn:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.5);
            opacity: 1;
            transform: scale(1.1);
            color: #4f46e5;
        }
        
        /* 특정 멤버 강조 효과 */
        .event-item.highlight {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
            border: 2px solid #f59e0b !important;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3) !important;
            transform: scale(1.02) !important;
            z-index: 10;
            position: relative;
        }
        
        .event-item.fade {
            opacity: 0.3;
            filter: grayscale(50%);
        }
        
        .calendar-day.empty-day {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
            border: 2px solid #fca5a5 !important;
            box-shadow: 0 0 0 1px #f87171 !important;
        }
        
        .calendar-day.empty-day .day-header {
            background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%) !important;
            border-bottom: 2px solid #f87171 !important;
        }
        
        .calendar-day.empty-day .day-number {
            color: #dc2626 !important;
            font-weight: 700 !important;
        }
        
        .calendar-day .scroll-indicator {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: #6366f1;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 10;
            animation: pulse 1.5s infinite;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .calendar-day .scroll-indicator-top {
            top: 15px;
        }
        
        .calendar-day .scroll-indicator-bottom {
            bottom: 15px;
        }
        
        .calendar-day .scroll-indicator.show {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        
        @keyframes pulse {
            0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
            50% { transform: translateX(-50%) scale(1.1); opacity: 0.8; }
        }
        
        
        
        .event-time {
            color: #0369a1;
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 11px;
        }
        
        .event-type-badge {
            display: inline-block;
            background: #3b82f6;
            color: white;
            font-size: 9px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .event-type-badge.방송 {
            background: #3b82f6;
        }
        
        .event-type-badge.방송예정 {
            background: #06b6d4;
        }
        
        .event-type-badge.합방 {
            background: #10b981;
        }
        
        .event-type-badge.휴방 {
            background: #f59e0b;
        }
        
        .event-type-badge.기타 {
            background: #6b7280;
        }
        
        
        .event-title {
            color: #1e293b;
            font-size: 12px;
            line-height: 1.3;
            margin-bottom: 3px;
            font-weight: 500;
        }
        
        /* 주말 스타일 - 라이트 */
        .calendar-day:nth-child(7) {
            background: #fafbfc;
        }
        
        .calendar-day:nth-child(7) .day-header {
            background: #f3f4f6;
        }
        
        /* 주말 날짜 숫자 색상 - 라이트 */
        .calendar-day:nth-child(7) .day-number {
            color: #dc2626; /* 일요일 - 빨간색 */
        }
        
        /* 오늘 날짜 강조 - 라이트 */
        .calendar-day.today {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
        }
        
        .calendar-day.today .day-header {
            background: #f1f5f9;
        }
        
        /* 다크 테마 스타일 - Sooplive 실제 클래스 */
        body.thema_dark #sooplive-calendar,
        html[dark=true] #sooplive-calendar,
        .dark #sooplive-calendar,
        html.dark #sooplive-calendar,
        body.dark #sooplive-calendar,
        [data-theme="dark"] #sooplive-calendar {
            background: #1f2937;
            border: 1px solid #374151;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        body.thema_dark .calendar-header,
        html[dark=true] .calendar-header,
        .dark .calendar-header,
        html.dark .calendar-header,
        body.dark .calendar-header,
        [data-theme="dark"] .calendar-header {
            border-bottom: 1px solid #374151;
        }
        
        body.thema_dark .calendar-header h3,
        html[dark=true] .calendar-header h3,
        .dark .calendar-header h3,
        html.dark .calendar-header h3,
        body.dark .calendar-header h3,
        [data-theme="dark"] .calendar-header h3 {
            color: #f9fafb;
        }
        
        body.thema_dark .week-range,
        html[dark=true] .week-range,
        .dark .week-range,
        html.dark .week-range,
        body.dark .week-range,
        [data-theme="dark"] .week-range {
            color: #d1d5db;
        }
        
        body.thema_dark .calendar-grid,
        html[dark=true] .calendar-grid,
        .dark .calendar-grid,
        html.dark .calendar-grid,
        body.dark .calendar-grid,
        [data-theme="dark"] .calendar-grid {
            background: #374151;
            border: 1px solid #4b5563;
        }
        
        body.thema_dark .calendar-day,
        html[dark=true] .calendar-day,
        .dark .calendar-day,
        html.dark .calendar-day,
        body.dark .calendar-day,
        [data-theme="dark"] .calendar-day {
            background: #1f2937;
        }
        
        body.thema_dark .day-header,
        html[dark=true] .day-header,
        .dark .day-header,
        html.dark .day-header,
        body.dark .day-header,
        [data-theme="dark"] .day-header {
            background: #374151;
            border-bottom: 1px solid #4b5563;
        }
        
        body.thema_dark .day-name,
        html[dark=true] .day-name,
        .dark .day-name,
        html.dark .day-name,
        body.dark .day-name,
        [data-theme="dark"] .day-name {
            color: #9ca3af;
        }
        
        body.thema_dark .day-number,
        html[dark=true] .day-number,
        .dark .day-number,
        html.dark .day-number,
        body.dark .day-number,
        [data-theme="dark"] .day-number {
            color: #f9fafb;
        }
        
        body.thema_dark .event-count,
        html[dark=true] .event-count,
        .dark .event-count,
        html.dark .event-count,
        body.dark .event-count,
        [data-theme="dark"] .event-count {
            color: #93c5fd;
            background: #1e3a8a;
        }
        
        body.thema_dark .no-events,
        html[dark=true] .no-events,
        .dark .no-events,
        html.dark .no-events,
        body.dark .no-events,
        [data-theme="dark"] .no-events {
            color: #6b7280;
        }
        
        body.thema_dark .loading-message,
        html[dark=true] .loading-message,
        .dark .loading-message,
        html.dark .loading-message,
        body.dark .loading-message,
        [data-theme="dark"] .loading-message {
            color: #d1d5db;
        }
        
        body.thema_dark .event-item,
        html[dark=true] .event-item,
        .dark .event-item,
        html.dark .event-item,
        body.dark .event-item,
        [data-theme="dark"] .event-item {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            border: 1px solid #3b82f6;
        }
        
        body.thema_dark .event-item:hover,
        html[dark=true] .event-item:hover,
        .dark .event-item:hover,
        html.dark .event-item:hover,
        body.dark .event-item:hover,
        [data-theme="dark"] .event-item:hover {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            border-color: #60a5fa;
        }
        
        body.thema_dark .station-link-btn,
        html[dark=true] .station-link-btn,
        .dark .station-link-btn,
        html.dark .station-link-btn,
        body.dark .station-link-btn,
        [data-theme="dark"] .station-link-btn {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
        }
        
        body.thema_dark .station-link-btn:hover,
        html[dark=true] .station-link-btn:hover,
        .dark .station-link-btn:hover,
        html.dark .station-link-btn:hover,
        body.dark .station-link-btn:hover,
        [data-theme="dark"] .station-link-btn:hover {
            background: rgba(99, 102, 241, 0.3);
            border-color: rgba(99, 102, 241, 0.6);
            color: #c7d2fe;
        }
        
        
        /* 다크 테마 특정 멤버 강조 효과 */
        body.thema_dark .event-item.highlight,
        html[dark=true] .event-item.highlight,
        .dark .event-item.highlight,
        html.dark .event-item.highlight,
        body.dark .event-item.highlight,
        [data-theme="dark"] .event-item.highlight {
            background: linear-gradient(135deg, #451a03 0%, #78350f 100%) !important;
            border: 2px solid #f59e0b !important;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4) !important;
        }
        
        body.thema_dark .event-item.fade,
        html[dark=true] .event-item.fade,
        .dark .event-item.fade,
        html.dark .event-item.fade,
        body.dark .event-item.fade,
        [data-theme="dark"] .event-item.fade {
            opacity: 0.2;
            filter: grayscale(70%);
        }
        
        body.thema_dark .calendar-day.empty-day,
        html[dark=true] .calendar-day.empty-day,
        .dark .calendar-day.empty-day,
        html.dark .calendar-day.empty-day,
        body.dark .calendar-day.empty-day,
        [data-theme="dark"] .calendar-day.empty-day {
            background: linear-gradient(135deg, #3d1f1f 0%, #4d2626 100%) !important;
            border: 2px solid #ef4444 !important;
            box-shadow: 0 0 0 1px #fca5a5 !important;
        }
        
        body.thema_dark .calendar-day.empty-day .day-header,
        html[dark=true] .calendar-day.empty-day .day-header,
        .dark .calendar-day.empty-day .day-header,
        html.dark .calendar-day.empty-day .day-header,
        body.dark .calendar-day.empty-day .day-header,
        [data-theme="dark"] .calendar-day.empty-day .day-header {
            background: linear-gradient(135deg, #4d2626 0%, #5d2d2d 100%) !important;
            border-bottom: 2px solid #ef4444 !important;
        }
        
        body.thema_dark .calendar-day.empty-day .day-number,
        html[dark=true] .calendar-day.empty-day .day-number,
        .dark .calendar-day.empty-day .day-number,
        html.dark .calendar-day.empty-day .day-number,
        body.dark .calendar-day.empty-day .day-number,
        [data-theme="dark"] .calendar-day.empty-day .day-number {
            color: #f87171 !important;
            font-weight: 700 !important;
        }
        
        body.thema_dark .calendar-day .scroll-indicator,
        html[dark=true] .calendar-day .scroll-indicator,
        .dark .calendar-day .scroll-indicator,
        html.dark .calendar-day .scroll-indicator,
        body.dark .calendar-day .scroll-indicator,
        [data-theme="dark"] .calendar-day .scroll-indicator {
            background: #4f46e5;
            color: #e5e7eb;
        }
        
        
        
        body.thema_dark .event-time,
        html[dark=true] .event-time,
        .dark .event-time,
        html.dark .event-time,
        body.dark .event-time,
        [data-theme="dark"] .event-time {
            color: #93c5fd;
        }
        
        body.thema_dark .event-type-badge,
        html[dark=true] .event-type-badge,
        .dark .event-type-badge,
        html.dark .event-type-badge,
        body.dark .event-type-badge,
        [data-theme="dark"] .event-type-badge {
            color: white;
            font-weight: 700;
        }
        
        body.thema_dark .event-type-badge.방송,
        html[dark=true] .event-type-badge.방송,
        .dark .event-type-badge.방송,
        html.dark .event-type-badge.방송,
        body.dark .event-type-badge.방송,
        [data-theme="dark"] .event-type-badge.방송 {
            background: #2563eb;
        }
        
        body.thema_dark .event-type-badge.방송예정,
        html[dark=true] .event-type-badge.방송예정,
        .dark .event-type-badge.방송예정,
        html.dark .event-type-badge.방송예정,
        body.dark .event-type-badge.방송예정,
        [data-theme="dark"] .event-type-badge.방송예정 {
            background: #0891b2;
        }
        
        body.thema_dark .event-type-badge.합방,
        html[dark=true] .event-type-badge.합방,
        .dark .event-type-badge.합방,
        html.dark .event-type-badge.합방,
        body.dark .event-type-badge.합방,
        [data-theme="dark"] .event-type-badge.합방 {
            background: #059669;
        }
        
        body.thema_dark .event-type-badge.휴방,
        html[dark=true] .event-type-badge.휴방,
        .dark .event-type-badge.휴방,
        html.dark .event-type-badge.휴방,
        body.dark .event-type-badge.휴방,
        [data-theme="dark"] .event-type-badge.휴방 {
            background: #d97706;
        }
        
        body.thema_dark .event-type-badge.기타,
        html[dark=true] .event-type-badge.기타,
        .dark .event-type-badge.기타,
        html.dark .event-type-badge.기타,
        body.dark .event-type-badge.기타,
        [data-theme="dark"] .event-type-badge.기타 {
            background: #4b5563;
        }
        
        
        body.thema_dark .event-title,
        html[dark=true] .event-title,
        .dark .event-title,
        html.dark .event-title,
        body.dark .event-title,
        [data-theme="dark"] .event-title {
            color: #e5e7eb;
        }
        
        /* 다크 테마 스크롤바 */
        body.thema_dark .day-events,
        html[dark=true] .day-events,
        .dark .day-events,
        html.dark .day-events,
        body.dark .day-events,
        [data-theme="dark"] .day-events {
            scrollbar-color: #4a5568 #2d3748;
        }
        
        body.thema_dark .day-events::-webkit-scrollbar-track,
        html[dark=true] .day-events::-webkit-scrollbar-track,
        .dark .day-events::-webkit-scrollbar-track,
        html.dark .day-events::-webkit-scrollbar-track,
        body.dark .day-events::-webkit-scrollbar-track,
        [data-theme="dark"] .day-events::-webkit-scrollbar-track {
            background: #2d3748;
        }
        
        body.thema_dark .day-events::-webkit-scrollbar-thumb,
        html[dark=true] .day-events::-webkit-scrollbar-thumb,
        .dark .day-events::-webkit-scrollbar-thumb,
        html.dark .day-events::-webkit-scrollbar-thumb,
        body.dark .day-events::-webkit-scrollbar-thumb,
        [data-theme="dark"] .day-events::-webkit-scrollbar-thumb {
            background: #4a5568;
        }
        
        body.thema_dark .day-events::-webkit-scrollbar-thumb:hover,
        html[dark=true] .day-events::-webkit-scrollbar-thumb:hover,
        .dark .day-events::-webkit-scrollbar-thumb:hover,
        html.dark .day-events::-webkit-scrollbar-thumb:hover,
        body.dark .day-events::-webkit-scrollbar-thumb:hover,
        [data-theme="dark"] .day-events::-webkit-scrollbar-thumb:hover {
            background: #718096;
        }
        
        /* 다크 테마 크레딧 */
        body.thema_dark .calendar-credit,
        html[dark=true] .calendar-credit,
        .dark .calendar-credit,
        html.dark .calendar-credit,
        body.dark .calendar-credit,
        [data-theme="dark"] .calendar-credit {
            color: #6b7280;
            border-top: 1px solid #374151;
            text-align: right;
        }
        
        body.thema_dark .credit-name,
        html[dark=true] .credit-name,
        .dark .credit-name,
        html.dark .credit-name,
        body.dark .credit-name,
        [data-theme="dark"] .credit-name {
            color: #93c5fd;
        }
        
        
        /* 주말 스타일 - 다크 */
        body.thema_dark .calendar-day:nth-child(7),
        html[dark=true] .calendar-day:nth-child(7),
        .dark .calendar-day:nth-child(7),
        html.dark .calendar-day:nth-child(7),
        body.dark .calendar-day:nth-child(7),
        [data-theme="dark"] .calendar-day:nth-child(7) {
            background: #111827;
        }
        
        body.thema_dark .calendar-day:nth-child(7) .day-header,
        html[dark=true] .calendar-day:nth-child(7) .day-header,
        .dark .calendar-day:nth-child(7) .day-header,
        html.dark .calendar-day:nth-child(7) .day-header,
        body.dark .calendar-day:nth-child(7) .day-header,
        [data-theme="dark"] .calendar-day:nth-child(7) .day-header {
            background: #374151;
        }
        
        /* 주말 날짜 숫자 색상 - 다크 */
        body.thema_dark .calendar-day:nth-child(7) .day-number,
        html[dark=true] .calendar-day:nth-child(7) .day-number,
        .dark .calendar-day:nth-child(7) .day-number,
        html.dark .calendar-day:nth-child(7) .day-number,
        body.dark .calendar-day:nth-child(7) .day-number,
        [data-theme="dark"] .calendar-day:nth-child(7) .day-number {
            color: #ef4444; /* 일요일 - 빨간색 */
        }
        
        /* 휴일 날짜 숫자 색상 - 라이트 */
        .calendar-day.holiday .day-number {
            color: #dc2626 !important; /* 휴일 - 빨간색 */
        }
        
        /* 휴일 날짜 숫자 색상 - 다크 */
        body.thema_dark .calendar-day.holiday .day-number,
        html[dark=true] .calendar-day.holiday .day-number,
        .dark .calendar-day.holiday .day-number,
        html.dark .calendar-day.holiday .day-number,
        body.dark .calendar-day.holiday .day-number,
        [data-theme="dark"] .calendar-day.holiday .day-number {
            color: #ef4444 !important; /* 휴일 - 빨간색 */
        }
        
        /* 오늘 날짜 강조 - 다크 */
        body.thema_dark .calendar-day.today,
        html[dark=true] .calendar-day.today,
        .dark .calendar-day.today,
        html.dark .calendar-day.today,
        body.dark .calendar-day.today,
        [data-theme="dark"] .calendar-day.today {
            background: #0f172a;
            border: 2px solid #475569;
            box-shadow: 0 0 0 1px #64748b;
        }
        
        body.thema_dark .calendar-day.today .day-header,
        html[dark=true] .calendar-day.today .day-header,
        .dark .calendar-day.today .day-header,
        html.dark .calendar-day.today .day-header,
        body.dark .calendar-day.today .day-header,
        [data-theme="dark"] .calendar-day.today .day-header {
            background: #1e293b;
        }
        
        /* 반응형 디자인 */
        @media (max-width: 768px) {
            .calendar-grid {
                grid-template-columns: repeat(7, 1fr);
                gap: 0;
            }
            
            .calendar-day {
                min-height: 100px;
            }
            
            .day-events {
                padding: 8px 4px;
                min-height: 70px;
            }
            
            .week-navigation {
                gap: 8px;
            }
            
            .week-navigation button {
                padding: 6px 12px;
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(style);

    // URL에서 groupId 추출
    function getGroupId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('groupId') || '';
    }

    // 주간 시작일 계산 (월요일 기준)
    function startOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    // 휴일 체크 함수 (주말만 체크)
    function isHoliday(date) {
        return date.getDay() === 0;
    }

    // 날짜 문자열 포맷팅 함수
    function formatDateString(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }
    
    // 오늘 날짜 문자열
    function getTodayString() {
        const today = new Date();
        return formatDateString(today);
    }

    // 일정 아이템 HTML 생성 함수
    function createEventItemHTML(event) {
        const streamerId = event.userId || event.streamerId;
        const streamerUrl = streamerId ? `https://www.sooplive.co.kr/station/${streamerId}` : '#';
        const streamerNickname = event.streamerNickname || '';
        
        return `
            <div class="event-item" 
                 data-streamer-id="${streamerId || ''}" 
                 data-streamer-nickname="${streamerNickname}">
                <div class="event-content">
                    <div class="event-time">
                        ${event.eventTime}
                        <span class="event-type-badge ${event.calendarTypeName || '기타'}">${event.calendarTypeName || '기타'}</span>
                    </div>
                    <div class="event-title">${event.title}</div>
                </div>
                <div class="event-actions">
                    <button class="station-link-btn" 
                            onclick="event.stopPropagation(); window.open('${streamerUrl}', '_blank')" 
                            title="방송국으로 이동">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                            <path d="M4 0L0 3v5h2V4h4v4h2V3L4 0z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    // 현재 페이지의 쿠키와 인증 헤더 가져오기
    function getAuthHeaders() {
        const headers = {
            'Accept': 'application/json',
            'User-Agent': navigator.userAgent,
            'Referer': window.location.href,
            'Origin': window.location.origin
        };
        
        if (document.cookie) {
            headers['Cookie'] = document.cookie;
        }
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ||
                         document.querySelector('input[name="_token"]')?.value ||
                         document.querySelector('meta[name="csrf"]')?.content;
        
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        
        return headers;
    }

    // API 호출
    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            const headers = getAuthHeaders();
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: headers,
                onload: function(response) {
                    if (response.status === 403) {
                        resolve({
                            ok: false,
                            data: response.responseText,
                            status: response.status,
                            statusText: response.statusText,
                            error: '인증이 필요합니다. sooplive.co.kr에 로그인되어 있는지 확인해주세요.'
                        });
                        return;
                    }
                    
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve({ 
                            ok: response.status >= 200 && response.status < 300, 
                            data,
                            status: response.status,
                            statusText: response.statusText
                        });
                    } catch (e) {
                        resolve({ 
                            ok: false, 
                            data: response.responseText,
                            status: response.status,
                            statusText: response.statusText,
                            parseError: e.message
                        });
                    }
                },
                onerror: function(error) {
                    reject(new Error(`네트워크 오류: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('요청 시간 초과'));
                },
                timeout: 10000
            });
        });
    }

    // 즐겨찾기 스트리머 목록
    async function getStreamers(groupId) {
        try {
            const response = await fetchJSON(`https://myapi.sooplive.co.kr/api/favorite/${groupId}`);
            
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error(`인증 오류 (403): sooplive.co.kr에 로그인되어 있는지 확인해주세요.`);
                }
                throw new Error(`HTTP ${response.status}: ${response.data || response.error || 'Unknown error'}`);
            }
            
            const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            
            if (items.length === 0) {
                return [];
            }
            
            const streamers = items.map(item => {
                const userId = item?.user_id;
                const nickname = item?.user_nick;
                const isLive = item?.is_live || false;
                return { userId, nickname, isLive };
            }).filter(streamer => streamer.userId && streamer.nickname);
            
            return streamers;
        } catch (error) {
            throw error;
        }
    }

    // 캘린더 이벤트
    async function getEvents(userId, weekStart) {
        try {
            // 이번주 전체를 검색 (weekStart 기준)
            const year = weekStart.getFullYear();
            const month = weekStart.getMonth() + 1;
            const day = weekStart.getDate();
            
            const response = await fetchJSON(`https://api-channel.sooplive.co.kr/v1.1/channel/${userId}/calendar?view=week&year=${year}&month=${month}&day=${day}&userId=${userId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const events = [];
            if (response.data.days) {
                for (const day of response.data.days) {
                    if (day.events) {
                        for (const event of day.events) {
                            if (event.eventDate && event.eventTime) {
                                // 이벤트 날짜는 그대로 유지
                                events.push({
                                    title: event.title || '제목없음',
                                    eventDate: event.eventDate,
                                    eventTime: event.eventTime,
                                    calendarTypeName: event.calendarTypeName || '일정'
                                });
                            }
                        }
                    }
                }
            }
            return events;
        } catch (error) {
            return [];
        }
    }

    // 캘린더 HTML 생성
    function createCalendarHTML(events, weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const eventsByDate = {};
        for (const event of events) {
            if (!eventsByDate[event.eventDate]) {
                eventsByDate[event.eventDate] = [];
            }
            eventsByDate[event.eventDate].push(event);
        }

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            weekDates.push(date);
        }

        let html = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <h3>통합 일정</h3>
                    <div class="week-navigation">
                        <button id="prev-week-btn">← 이전 주</button>
                        <span class="week-range">${weekStart.toLocaleDateString('ko-KR')} ~ ${weekEnd.toLocaleDateString('ko-KR')}</span>
                        <button id="next-week-btn">다음 주 →</button>
                    </div>
                </div>
                <div class="calendar-grid">
        `;

        // 오늘 날짜
        const todayStr = getTodayString();

        for (const date of weekDates) {
            // 이벤트 날짜는 그대로 사용
            const dateStr = formatDateString(date);
            const dayEvents = eventsByDate[dateStr] || [];
            dayEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));

            // 오늘 날짜인지 확인
            const isToday = dateStr === todayStr;
            const todayClass = isToday ? ' today' : '';
            
            // 휴일인지 확인
            const isHolidayDate = isHoliday(date);
            const holidayClass = isHolidayDate ? ' holiday' : '';

            html += `
                <div class="calendar-day${todayClass}${holidayClass}">
                    <div class="day-header">
                        <div class="day-name">${date.toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                        <div class="day-number">${date.getDate()}</div>
                        <div class="event-count">${dayEvents.length}개</div>
                    </div>
                    <div class="day-events">
            `;

            if (dayEvents.length === 0) {
                html += '<div class="no-events">일정 없음</div>';
            } else {
                // 모든 일정 표시 (스크롤로 확인)
                for (const event of dayEvents) {
                    html += createEventItemHTML(event);
                }
            }

            html += `
                    </div>
                </div>
            `;
        }

        html += `
                </div>
                <div class="calendar-credit">
                    made by <span class="credit-name">지창연구소</span>
                </div>
            </div>
        `;

        return html;
    }

    // 마우스 오버 이벤트 처리 함수
    function addHoverEvents() {
        const eventItems = document.querySelectorAll('.event-item');
        
        eventItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // 고정된 멤버가 있으면 마우스 오버 무시
                if (fixedStreamer) return;
                
                const streamerId = this.getAttribute('data-streamer-id');
                const streamerNickname = this.getAttribute('data-streamer-nickname');
                
                // 마우스 오버한 날 찾기
                const hoveredDay = this.closest('.calendar-day');
                
                // 같은 스트리머의 모든 일정 강조
                const allEventItems = document.querySelectorAll('.event-item');
                allEventItems.forEach(eventItem => {
                    const itemStreamerId = eventItem.getAttribute('data-streamer-id');
                    const itemStreamerNickname = eventItem.getAttribute('data-streamer-nickname');
                    
                    if (itemStreamerId === streamerId && itemStreamerNickname === streamerNickname) {
                        eventItem.classList.add('highlight');
                    } else {
                        eventItem.classList.add('fade');
                    }
                });
                
                // 해당 스트리머의 일정이 없는 날들을 빨갛게 강조
                highlightEmptyDays(streamerId, streamerNickname);
                
                // 화살표 표시 및 스크롤 실행
                showScrollIndicatorsForStreamer(streamerId, streamerNickname);
                
                // 마우스 오버한 날짜를 제외한 다른 날짜들의 해당 멤버 첫 번째 일정을 가운데로 스크롤
                scrollToFirstEventInOtherDays(streamerId, streamerNickname, hoveredDay);
            });
            
            item.addEventListener('mouseleave', function() {
                // 고정된 멤버가 없을 때만 강조 효과 제거
                if (!fixedStreamer) {
                    clearAllHighlights();
                }
            });
            
            // 클릭 이벤트 추가 (멤버 고정)
            item.addEventListener('click', function(e) {
                // 방송국 버튼 클릭이 아닐 때만 멤버 고정
                if (!e.target.classList.contains('station-link-btn')) {
                    const streamerId = this.getAttribute('data-streamer-id');
                    const streamerNickname = this.getAttribute('data-streamer-nickname');
                    
                    // 클릭한 날짜 저장
                    clickedDay = this.closest('.calendar-day');
                    
                    // 이미 고정된 멤버와 같으면 고정 해제
                    if (fixedStreamer && fixedStreamer.id === streamerId && fixedStreamer.nickname === streamerNickname) {
                        fixedStreamer = null;
                        clearAllHighlights();
                    } else {
                        // 다른 멤버 클릭 시 기존 고정 해제 후 새 멤버로 고정 변경
                        clearAllHighlights();
                        fixedStreamer = { id: streamerId, nickname: streamerNickname };
                        applyFixedStreamerHighlight();
                    }
                }
            });
        });
    }


    // 고정된 멤버 강조 적용 함수
    function applyFixedStreamerHighlight() {
        if (!fixedStreamer) return;
        
        const allEventItems = document.querySelectorAll('.event-item');
        allEventItems.forEach(eventItem => {
            const itemStreamerId = eventItem.getAttribute('data-streamer-id');
            const itemStreamerNickname = eventItem.getAttribute('data-streamer-nickname');
            
            if (itemStreamerId === fixedStreamer.id && itemStreamerNickname === fixedStreamer.nickname) {
                eventItem.classList.add('highlight');
            } else {
                eventItem.classList.add('fade');
            }
        });
        
        // 해당 스트리머의 일정이 없는 날들을 빨갛게 강조
        highlightEmptyDays(fixedStreamer.id, fixedStreamer.nickname);
        
        // 화살표 표시
        showScrollIndicatorsForStreamer(fixedStreamer.id, fixedStreamer.nickname);
        
        // 다른 날짜들의 해당 멤버 첫 번째 일정을 맨 위로 스크롤
        scrollToFirstEventInOtherDays(fixedStreamer.id, fixedStreamer.nickname);
    }

    // 스크롤 완료 대기 함수
    function waitForScrollComplete(container, callback) {
        const startTime = Date.now();
        let lastScrollTop = container.scrollTop;
        let isScrolling = false;
        
        const checkScroll = () => {
            const currentScrollTop = container.scrollTop;
            const currentTime = Date.now();
            
            if (Math.abs(currentScrollTop - lastScrollTop) > 1) {
                isScrolling = true;
                lastScrollTop = currentScrollTop;
            } else if (isScrolling && (currentTime - startTime) > 200) {
                // 스크롤이 멈췄고 충분한 시간이 지났으면 완료
                callback();
                return;
            }
            
            requestAnimationFrame(checkScroll);
        };
        
        requestAnimationFrame(checkScroll);
    }

    // 스크롤 완료 후 화살표 인디케이터 업데이트
    function updateScrollIndicatorsAfterScroll(streamerId, streamerNickname, excludeDay = null) {
        const allDays = document.querySelectorAll('.calendar-day');
        
        allDays.forEach(day => {
            if (excludeDay === day) return;
            
            const dayEventsContainer = day.querySelector('.day-events');
            if (!dayEventsContainer) return;
            
            // 해당 스트리머의 일정들 찾기
            const streamerEvents = Array.from(day.querySelectorAll('.event-item')).filter(event => {
                const eventStreamerId = event.getAttribute('data-streamer-id');
                const eventStreamerNickname = event.getAttribute('data-streamer-nickname');
                return eventStreamerId === streamerId && eventStreamerNickname === streamerNickname;
            });
            
            if (streamerEvents.length === 0) return;
            
            // 현재 보이는 영역 확인
            const containerRect = dayEventsContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerBottom = containerRect.bottom;
            
            // 위쪽/아래쪽에 숨겨진 일정이 있는지 확인
            let hasHiddenEventsAbove = false;
            let hasHiddenEventsBelow = false;
            
            streamerEvents.forEach(event => {
                const eventRect = event.getBoundingClientRect();
                if (eventRect.bottom < containerTop) {
                    hasHiddenEventsAbove = true;
                } else if (eventRect.top > containerBottom) {
                    hasHiddenEventsBelow = true;
                }
            });
            
            // 기존 화살표 제거
            removeScrollIndicator(day);
            
            // 새로운 화살표 표시
            if (hasHiddenEventsAbove) {
                const topIndicator = createScrollIndicator('top', '위쪽에 더 많은 일정이 있습니다');
                showScrollIndicator(topIndicator, day, 'top');
            }
            
            if (hasHiddenEventsBelow) {
                const bottomIndicator = createScrollIndicator('bottom', '아래쪽에 더 많은 일정이 있습니다');
                showScrollIndicator(bottomIndicator, day, 'bottom');
            }
        });
    }

    // 개선된 스크롤 함수 - 다른 날짜들의 해당 멤버 첫 번째 일정을 가운데로 스크롤
    function scrollToFirstEventInOtherDays(streamerId, streamerNickname, excludeDay = null) {
        // 강조 효과 적용 후 레이아웃 안정화를 위해 지연
        setTimeout(() => {
            const allDays = document.querySelectorAll('.calendar-day');
            let scrollCount = 0;
            let totalScrolls = 0;
            
            allDays.forEach(day => {
                const dayEventsContainer = day.querySelector('.day-events');
                if (!dayEventsContainer) return;
                
                // 제외할 날짜 체크 (클릭한 날짜 또는 마우스 오버한 날짜)
                if (clickedDay === day || excludeDay === day) return;
                
                // 해당 스트리머의 첫 번째 일정 찾기
                const streamerEvents = Array.from(day.querySelectorAll('.event-item')).filter(event => {
                    const eventStreamerId = event.getAttribute('data-streamer-id');
                    const eventStreamerNickname = event.getAttribute('data-streamer-nickname');
                    return eventStreamerId === streamerId && eventStreamerNickname === streamerNickname;
                });
                
                if (streamerEvents.length === 0) return;
                
                // 시간순 정렬 후 첫 번째 일정
                const firstEvent = streamerEvents.sort((a, b) => {
                    const timeA = a.querySelector('.event-time')?.textContent || '';
                    const timeB = b.querySelector('.event-time')?.textContent || '';
                    return timeA.localeCompare(timeB);
                })[0];
                
                if (firstEvent) {
                    // 스크롤이 필요한지 확인
                    if (dayEventsContainer.scrollHeight > dayEventsContainer.clientHeight) {
                        totalScrolls++;
                        
                        // 더 정확한 스크롤 위치 계산
                        const containerHeight = dayEventsContainer.clientHeight;
                        const eventHeight = firstEvent.offsetHeight;
                        
                        // getBoundingClientRect를 사용한 정확한 위치 계산
                        const containerRect = dayEventsContainer.getBoundingClientRect();
                        const eventRect = firstEvent.getBoundingClientRect();
                        const relativeTop = eventRect.top - containerRect.top + dayEventsContainer.scrollTop;
                        
                        // 위쪽에 하나 정도 더 보일 정도로 스크롤하는 위치 계산
                        const scrollPosition = relativeTop - (eventHeight * 1.5) + (eventHeight / 2);
                        
                        // 부드러운 스크롤 적용
                        dayEventsContainer.scrollTo({
                            top: Math.max(0, scrollPosition),
                            behavior: 'smooth'
                        });
                        
                        // 스크롤 완료 후 화살표 업데이트
                        waitForScrollComplete(dayEventsContainer, () => {
                            scrollCount++;
                            if (scrollCount === totalScrolls) {
                                // 모든 스크롤이 완료되면 화살표 업데이트
                                updateScrollIndicatorsAfterScroll(streamerId, streamerNickname, excludeDay);
                            }
                        });
                    }
                }
            });
            
            // 스크롤이 필요한 컨테이너가 없으면 즉시 화살표 업데이트
            if (totalScrolls === 0) {
                updateScrollIndicatorsAfterScroll(streamerId, streamerNickname, excludeDay);
            }
        }, 150); // 150ms 지연으로 레이아웃 안정화
    }

    // 빈 날짜 강조 함수 (휴방일 포함)
    function highlightEmptyDays(streamerId, streamerNickname) {
        const allDays = document.querySelectorAll('.calendar-day');
        
        allDays.forEach(day => {
            const dayEvents = day.querySelectorAll('.event-item');
            let hasStreamerNormalEvent = false;
            
            // 해당 스트리머의 일반 일정(휴방 제외)이 있는지 확인
            dayEvents.forEach(event => {
                const eventStreamerId = event.getAttribute('data-streamer-id');
                const eventStreamerNickname = event.getAttribute('data-streamer-nickname');
                const eventType = event.querySelector('.event-type-badge')?.textContent;
                
                if (eventStreamerId === streamerId && eventStreamerNickname === streamerNickname) {
                    // 휴방이 아닌 일반 일정이 있는지 확인
                    if (eventType !== '휴방') {
                        hasStreamerNormalEvent = true;
                    }
                }
            });
            
            // 해당 스트리머의 일반 일정이 없는 날은 빨갛게 강조
            if (!hasStreamerNormalEvent) {
                day.classList.add('empty-day');
            }
        });
    }



    // 해당 멤버의 스크롤 영역 밖에 일정이 있으면 화살표 표시 (스크롤 전 초기 표시용)
    function showScrollIndicatorsForStreamer(streamerId, streamerNickname) {
        const allDays = document.querySelectorAll('.calendar-day');
        
        allDays.forEach(day => {
            const dayEvents = day.querySelectorAll('.event-item');
            const dayEventsContainer = day.querySelector('.day-events');
            
            if (!dayEventsContainer) return;
            
            // 해당 스트리머의 일정들 찾기
            const streamerEvents = Array.from(dayEvents).filter(event => {
                const eventStreamerId = event.getAttribute('data-streamer-id');
                const eventStreamerNickname = event.getAttribute('data-streamer-nickname');
                return eventStreamerId === streamerId && eventStreamerNickname === streamerNickname;
            });
            
            if (streamerEvents.length === 0) return;
            
            // 스크롤 영역의 높이와 스크롤 위치 확인
            const containerHeight = dayEventsContainer.clientHeight;
            const scrollHeight = dayEventsContainer.scrollHeight;
            
            // 스크롤이 가능한지 확인 (내용이 컨테이너보다 높을 때)
            if (scrollHeight > containerHeight) {
                const containerRect = dayEventsContainer.getBoundingClientRect();
                
                // 위쪽/아래쪽에 숨겨진 일정이 있는지 확인
                let hasHiddenEventsAbove = false;
                let hasHiddenEventsBelow = false;
                
                // 해당 멤버의 일정들을 시간순으로 정렬
                const sortedStreamerEvents = streamerEvents.sort((a, b) => {
                    const timeA = a.querySelector('.event-time')?.textContent || '';
                    const timeB = b.querySelector('.event-time')?.textContent || '';
                    return timeA.localeCompare(timeB);
                });
                
                // 첫 번째와 마지막 일정 확인
                const firstEvent = sortedStreamerEvents[0];
                const lastEvent = sortedStreamerEvents[sortedStreamerEvents.length - 1];
                
                if (firstEvent && lastEvent) {
                    const firstEventRect = firstEvent.getBoundingClientRect();
                    const lastEventRect = lastEvent.getBoundingClientRect();
                    
                    // 첫 번째 일정이 위쪽에 숨겨져 있는지 확인
                    hasHiddenEventsAbove = firstEventRect.bottom < containerRect.top;
                    
                    // 마지막 일정이 아래쪽에 숨겨져 있는지 확인
                    hasHiddenEventsBelow = lastEventRect.top > containerRect.bottom;
                }
                
                // 기존 화살표 제거
                removeScrollIndicator(day);
                
                // 화살표 표시
                if (hasHiddenEventsAbove) {
                    const topIndicator = createScrollIndicator('top', '위쪽에 더 많은 일정이 있습니다');
                    showScrollIndicator(topIndicator, day, 'top');
                }
                
                if (hasHiddenEventsBelow) {
                    const bottomIndicator = createScrollIndicator('bottom', '아래쪽에 더 많은 일정이 있습니다');
                    showScrollIndicator(bottomIndicator, day, 'bottom');
                }
            }
        });
    }



    // 주간 변경
    window.changeWeek = function(days) {
        anchorDate.setDate(anchorDate.getDate() + days);
        loadCalendar();
    };


    // 캘린더 로드
    window.loadCalendar = async function() {
        const container = document.getElementById('sooplive-calendar');
        if (!container) return;

        container.innerHTML = '<div class="loading-message">일정을 불러오는 중...</div>';

        try {
            const groupId = getGroupId();
            if (!groupId) {
                container.innerHTML = '<div style="color: red; padding: 20px;">groupId를 찾을 수 없습니다.</div>';
                return;
            }

            const streamers = await getStreamers(groupId);
            if (streamers.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 20px;">즐겨찾기 스트리머가 없습니다.</div>';
                return;
            }

            // 현재 날짜를 기준으로 주 계산
            const weekStart = startOfWeek(anchorDate);
            const allEvents = [];
            
            for (const streamer of streamers) {
                const { userId, nickname } = streamer;
                
                const events = await getEvents(userId, weekStart);
                
                for (const event of events) {
                    allEvents.push({
                        ...event,
                        streamerNickname: nickname,
                        userId: userId,
                        streamerId: userId,
                        title: `${nickname}:${event.title}`
                    });
                }
            }
            container.innerHTML = createCalendarHTML(allEvents, weekStart);

            // 이벤트 리스너 추가
            const prevBtn = document.getElementById('prev-week-btn');
            const nextBtn = document.getElementById('next-week-btn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => changeWeek(-7));
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => changeWeek(7));
            }
            
            
            // 마우스 오버 이벤트 추가
            addHoverEvents();
            
            // 고정된 멤버가 있으면 강조 적용
            if (fixedStreamer) {
                applyFixedStreamerHighlight();
            }
        } catch (error) {
            let errorMessage = `오류: ${error.message}`;
            let troubleshooting = '';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('네트워크 오류')) {
                errorMessage = '네트워크 연결 오류가 발생했습니다.';
                troubleshooting = `
                    <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 4px; font-size: 12px;">
                        <strong>해결 방법:</strong><br>
                        1. 인터넷 연결을 확인해주세요<br>
                        2. sooplive.co.kr에 로그인되어 있는지 확인해주세요<br>
                        3. 페이지를 새로고침해보세요
                    </div>
                `;
            } else if (error.message.includes('403') || error.message.includes('인증 오류')) {
                errorMessage = '인증이 필요합니다. 로그인 상태를 확인해주세요.';
                troubleshooting = `
                    <div style="margin-top: 10px; padding: 10px; background: #f8d7da; border-radius: 4px; font-size: 12px;">
                        <strong>403 Forbidden 오류 해결 방법:</strong><br>
                        1. <strong>sooplive.co.kr에 로그인</strong>되어 있는지 확인<br>
                        2. 로그인 세션이 만료되었다면 <strong>다시 로그인</strong><br>
                        3. 브라우저 쿠키가 활성화되어 있는지 확인
                    </div>
                `;
            }
            
            container.innerHTML = `
                <div style="color: red; padding: 20px;">
                    ${errorMessage}
                    ${troubleshooting}
                </div>
            `;
        }
    };

    // 캘린더 컨테이너 추가
    function addCalendarContainer() {
        if (document.getElementById('sooplive-calendar')) {
            return;
        }
        
        // groupId가 없으면 캘린더를 표시하지 않음
        const groupId = getGroupId();
        if (!groupId) {
            return;
        }
        
        let strmArea = document.querySelector('.strm_area');
        
        if (!strmArea) {
            setTimeout(addCalendarContainer, TIMING.INIT_RETRY_DELAY);
            return;
        }

        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'sooplive-calendar';

        strmArea.parentNode.insertBefore(calendarContainer, strmArea.nextSibling);
        
        // 캘린더 전체 영역에서 마우스가 벗어났을 때 모든 효과 제거
        calendarContainer.addEventListener('mouseleave', function() {
            clearAllHighlights();
        });
        
        // 문서 전체에서 마우스가 캘린더 영역을 벗어났을 때도 효과 제거
        document.addEventListener('mouseleave', function(e) {
            const calendar = document.getElementById('sooplive-calendar');
            if (calendar && !calendar.contains(e.relatedTarget)) {
                clearAllHighlights();
            }
        });
        
        loadCalendar();
    }

    // URL 변경 감지
    function checkUrlChange() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            
            // 기존 캘린더 제거
            const existingCalendar = document.getElementById('sooplive-calendar');
            if (existingCalendar) {
                existingCalendar.remove();
            }
            
            // 새 캘린더 추가
            setTimeout(addCalendarContainer, TIMING.SPA_NAVIGATION_DELAY * 5);
        }
    }

    // 초기화
    function init() {
        addCalendarContainer();
    }

    // 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, TIMING.INIT_RETRY_DELAY);

    // URL 변경 감지 시작 (SPA 대응)
    setInterval(checkUrlChange, TIMING.URL_CHECK_INTERVAL);
    
    // popstate 이벤트 리스너 (뒤로가기/앞으로가기 대응)
    window.addEventListener('popstate', () => {
        setTimeout(() => {
            checkUrlChange();
        }, TIMING.SPA_NAVIGATION_DELAY);
    });

})();