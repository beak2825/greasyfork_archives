// ==UserScript==
// @name         Student Helper Style Schetule
// @namespace    https://github.com/AbrikosV/StudentHelperStyle
// @version      1.9.7
// @description  Это доплнение предназначено для улучшения UI интерфейса сайта с базовой настройкой, изменяет Страницу учеба
// @author       AbrikosV
// @match        https://system.fgoupsk.ru/student/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556387/Student%20Helper%20Style%20Schetule.user.js
// @updateURL https://update.greasyfork.org/scripts/556387/Student%20Helper%20Style%20Schetule.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // === 🛑 Защита от дублей ===
  const SCRIPT_ID = "student-helper-stylett-v1.9.5";
  if (document.getElementById(SCRIPT_ID)) return;

  const marker = document.createElement("meta");
  marker.id = SCRIPT_ID;
  document.head.appendChild(marker);

  // === 🔐 ПЕРЕАДРЕСАЦИЯ ПОСЛЕ ВХОДА ===
  function setupLoginRedirect() {
    if (location.pathname === "/student/" && !location.search.includes("mode=")) {
      location.href = "https://system.fgoupsk.ru/student/?mode=ucheba";
    }
  }
  if (location.href.includes("/student/ATutor/")) {
    return;
  }
  setupLoginRedirect();

  // === 🎨 СТИЛИ ===
  const style = document.createElement("style");
  style.textContent = `
/* ===== 🌤 СВЕТЛАЯ ТЕМА (по умолчанию) ===== */
body.shs-enhanced {
  background: rgb(245, 247, 250) !important;
  color: rgb(28, 32, 39) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  line-height: 1.5 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
}

.shs-enhanced > :not(script):not(style):not(head):not(meta):not(title) {
  max-width: 1200px !important;
  margin: 16px auto !important;
  padding: 0 12px !important;
}

@media (min-width: 1200px) {
  .shs-enhanced > :not(script):not(style):not(head):not(meta):not(title) {
    max-width: 1800px !important;
    padding: 0 20px !important;
  }
}

/* ===== ЦВЕТНЫЕ ЯЧЕЙКИ ТАБЛИЦ ===== */
.shs-enhanced td.danger,
.shs-enhanced th.danger {
  background-color: #652222 !important;
  color: #ffffff !important;
}

.shs-enhanced td.success,
.shs-enhanced th.success {
  background-color: #3e6f2b !important;
  color: #ffffff !important;
}

/* ===== ФОРМА ДАТЫ ===== */
.shs-enhanced .form-inline {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 6px 8px !important;
  padding: 10px 12px !important;
  background: rgb(255, 255, 255) !important;
  border: 1px solid rgb(225, 230, 235) !important;
  border-radius: 8px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
  margin: 0 0 16px 0 !important;
}

.shs-enhanced input[name="d"] {
  flex: 1 1 180px !important;
  padding: 8px 10px !important;
  border: 1px solid rgb(225, 230, 235) !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  color: rgb(28, 32, 39) !important;
  background: rgb(255, 255, 255) !important;
  min-width: 0 !important;
}

.shs-enhanced input[name="d"]:focus {
  outline: none !important;
  border-color: rgb(54, 123, 245) !important;
  box-shadow: 0 0 0 2px rgba(54, 123, 245, 0.15) !important;
}

.shs-enhanced .btn-primary[type="submit"] {
  background: rgb(54, 123, 245) !important;
  border: none !important;
  color: white !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  white-space: nowrap !important;
}

.shs-enhanced .btn-primary[type="submit"]:hover {
  background: rgb(44, 103, 215) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 6px rgba(54, 123, 245, 0.3) !important;
}

.shs-enhanced .date-controls {
  display: inline-flex !important;
  gap: 4px !important;
  margin-left: 0 !important;
  order: 3 !important;
}

.shs-enhanced .date-controls button {
  padding: 8px 12px !important;
  border: 1px solid rgb(225, 230, 235) !important;
  border-radius: 6px !important;
  background: rgb(255, 255, 255) !important;
  color: rgb(28, 32, 39) !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  font-size: 14px !important;
}

.shs-enhanced .date-controls button:hover {
  background: rgb(245, 247, 250) !important;
  border-color: rgb(54, 123, 245) !important;
  transform: translateY(-1px) !important;
}

@media (max-width: 480px) {
  .shs-enhanced .form-inline {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .shs-enhanced .date-controls {
    order: 2 !important;
    justify-content: center !important;
    margin-top: 6px !important;
  }
  .shs-enhanced .btn-primary[type="submit"] {
    order: 3 !important;
    align-self: center !important;
    width: 100% !important;
    margin-top: 6px !important;
  }
}

/* ===== СТИЛИ ТОЛЬКО ДЛЯ ТАБЛИЦ РАСПИСАНИЯ И ДИСЦИПЛИН ===== */
.shs-enhanced #sched-table,
.shs-enhanced #disciplines-table {
  width: 100% !important;
  border-collapse: collapse !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
  background: rgb(255, 255, 255) !important;
  margin: 16px 0 !important;
  display: table !important;
  border: 1px solid rgb(225, 230, 235) !important;
  table-layout: auto !important;
}

.shs-enhanced #sched-table thead th,
.shs-enhanced #disciplines-table thead th {
  background: rgb(245, 247, 250) !important;
  color: rgb(28, 32, 39) !important;
  font-weight: 600 !important;
  padding: 12px 14px !important;
  text-align: left !important;
  border-bottom: 2px solid rgb(225, 230, 235) !important;
  white-space: nowrap !important;
}

.shs-enhanced #sched-table tbody tr,
.shs-enhanced #disciplines-table tbody tr {
  background: rgb(255, 255, 255) !important;
  border-bottom: 1px solid rgb(225, 230, 235) !important;
}

.shs-enhanced #sched-table tbody tr:last-child,
.shs-enhanced #disciplines-table tbody tr:last-child {
  border-bottom: none !important;
}

.shs-enhanced #sched-table tbody tr:hover,
.shs-enhanced #disciplines-table tbody tr:hover {
  background: rgb(245, 247, 250) !important;
}

.shs-enhanced #sched-table td,
.shs-enhanced #sched-table th,
.shs-enhanced #disciplines-table td,
.shs-enhanced #disciplines-table th {
  padding: 12px 14px !important;
  color: rgb(28, 32, 39) !important;
  vertical-align: top !important;
  font-size: 14px !important;
  line-height: 1.4 !important;
  white-space: normal !important;
}

.shs-enhanced #sched-table thead th:first-child,
.shs-enhanced #sched-table td:first-child {
  width: 50px !important;
  text-align: center !important;
}

.shs-enhanced #sched-table thead th:last-child,
.shs-enhanced #sched-table td:last-child {
  width: 80px !important;
  text-align: center !important;
}

/* ===== ССЫЛКИ ===== */
.shs-enhanced a {
  color: rgb(54, 123, 245) !important;
  text-decoration: none !important;
  transition: color 0.2s !important;
}

.shs-enhanced a:hover {
  color: rgb(44, 103, 215) !important;
  text-decoration: underline !important;
}

/* 📱 ТЕЛЕФОНЫ (<768px) */
@media (max-width: 767px) {
  .shs-enhanced #sched-table,
  .shs-enhanced #disciplines-table {
    display: block !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .shs-enhanced #sched-table td,
  .shs-enhanced #sched-table th,
  .shs-enhanced #disciplines-table td,
  .shs-enhanced #disciplines-table th {
    font-size: 18px !important;
    padding: 10px 12px !important;
    line-height: 1.35 !important;
  }

  .shs-enhanced #sched-table thead th:first-child,
  .shs-enhanced #sched-table td:first-child {
    min-width: 36px !important;
    width: 36px !important;
    text-align: center !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  .shs-enhanced #disciplines-table td {
    padding-left: 48px !important;
    text-indent: -32px !important;
  }
}

/* 🖥️ ПК (≥1200px) */
@media (min-width: 1200px) {
  .shs-enhanced #sched-table td,
  .shs-enhanced #sched-table th,
  .shs-enhanced #disciplines-table td,
  .shs-enhanced #disciplines-table th {
    padding: 14px 16px !important;
  }
  .shs-enhanced #sched-table thead th,
  .shs-enhanced #disciplines-table thead th {
    padding: 14px 16px !important;
    font-size: 14px !important;
  }
}

/* ===== ЗАГОЛОВКИ ===== */
.shs-enhanced h2 {
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: rgb(28, 32, 39) !important;
  margin: 20px 0 10px 0 !important;
  padding-bottom: 5px !important;
  border-bottom: 2px solid rgb(54, 123, 245) !important;
}

@media (min-width: 1200px) {
  .shs-enhanced h2 {
    font-size: 1.5rem !important;
  }
}

/* ===== БЛОК ДИСЦИПЛИН ===== */
.shs-enhanced .disciplines-header {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  color: rgb(28, 32, 39) !important;
  margin: 20px 0 10px 0 !important;
  cursor: pointer !important;
  padding: 8px 10px !important;
  background: rgb(255, 255, 255) !important;
  border: 1px solid rgb(225, 230, 235) !important;
  border-radius: 8px !important;
  transition: all 0.2s !important;
}

.shs-enhanced .disciplines-header:hover {
  background: rgb(245, 247, 250) !important;
  border-color: rgb(54, 123, 245) !important;
}

.shs-enhanced .menu-toggle {
  font-size: 1.2rem !important;
  color: rgb(108, 117, 125) !important;
  transition: transform 0.3s ease !important;
}

.shs-enhanced .menu-toggle.rotated {
  transform: rotate(180deg) !important;
}

.shs-enhanced #disciplines-table.hidden {
  max-height: 0 !important;
  opacity: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease !important;
  overflow: hidden !important;
}

/* ===== НАВИГАЦИЯ (ШАПКА) - СВЕТЛАЯ ТЕМА ===== */
.shs-enhanced .navbar {
  background: rgb(255, 255, 255) !important;
  border: none !important;
  border-bottom: 1px solid rgb(225, 230, 235) !important;
  border-top: none !important;
  border-radius: 0 !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

.shs-enhanced .navbar-default {
  background: rgb(255, 255, 255) !important;
  border-color: rgb(225, 230, 235) !important;
  border: none !important;
  border-bottom: 1px solid rgb(225, 230, 235) !important;
}

.shs-enhanced .navbar-collapse {
  border-color: transparent !important;
  border-top: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-header {
  border-bottom: none !important;
  border: none !important;
}

.shs-enhanced .navbar-toggle {
  border-color: rgba(0, 0, 0, 0.1) !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-toggle:hover,
.shs-enhanced .navbar-toggle:focus {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.shs-enhanced .navbar-nav {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.shs-enhanced .navbar-nav > li {
  border: none !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-nav > li > a {
  color: rgb(28, 32, 39) !important;
  transition: all 0.2s !important;
  text-decoration: none !important;
  border: none !important;
  border-bottom: none !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-nav > li > a:hover,
.shs-enhanced .navbar-nav > li > a:focus,
.shs-enhanced .navbar-nav > li > a:active {
  color: rgb(54, 123, 245) !important;
  background: rgb(245, 247, 250) !important;
  background-color: rgb(245, 247, 250) !important;
  text-decoration: none !important;
  border: none !important;
}

.shs-enhanced .navbar-brand {
  color: rgb(28, 32, 39) !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  border: none !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-brand:hover,
.shs-enhanced .navbar-brand:focus {
  color: rgb(28, 32, 39) !important;
  text-decoration: none !important;
  border: none !important;
  background-color: transparent !important;
}

.shs-enhanced .navbar-nav > li.active > a,
.shs-enhanced .navbar-nav > li.active > a:hover,
.shs-enhanced .navbar-nav > li.active > a:focus {
  background-color: rgb(245, 247, 250) !important;
  color: rgb(54, 123, 245) !important;
}

/* ===== МЕНЮ НАСТРОЕК ===== */
.shs-enhanced .settings-menu {
  position: absolute;
  background: rgb(255, 255, 255) !important;
  border: 1px solid rgb(225, 230, 235) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  padding: 10px !important;
  z-index: 9999;
  display: none;
  min-width: 200px;
  max-width: 90vw !important;
  font-size: 13px !important;
}

.shs-enhanced .settings-menu .header {
  font-weight: 600;
  color: rgb(28, 32, 39);
  margin-bottom: 8px;
  text-align: center;
}

.shs-enhanced .settings-menu .setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
}

.shs-enhanced .settings-menu .setting-label {
  font-size: 13px;
  color: rgb(28, 32, 39);
  white-space: nowrap;
}

.shs-enhanced .settings-menu .setting-select {
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid rgb(225, 230, 235);
  background: rgb(255, 255, 255);
  color: rgb(28, 32, 39);
  cursor: pointer;
  flex: 1;
  min-width: 0;
}

.shs-enhanced .settings-menu .setting-select:focus {
  outline: none;
  border-color: rgb(54, 123, 245);
  box-shadow: 0 0 0 2px rgba(54, 123, 245, 0.15);
}

/* ===== ПАНЕЛИ И БЛОКИ ===== */
.shs-enhanced .panel,
.shs-enhanced .well,
.shs-enhanced .alert {
  background: rgb(255, 255, 255) !important;
  border-color: rgb(225, 230, 235) !important;
  color: rgb(28, 32, 39) !important;
}

.shs-enhanced .panel-heading {
  background: rgb(245, 247, 250) !important;
  border-color: rgb(225, 230, 235) !important;
  color: rgb(28, 32, 39) !important;
}

.shs-enhanced hr {
  border-color: rgb(225, 230, 235) !important;
}

/* ===== ИНПУТЫ И ФОРМЫ ===== */
.shs-enhanced input[type="text"],
.shs-enhanced input[type="password"],
.shs-enhanced input[type="email"],
.shs-enhanced select,
.shs-enhanced textarea {
  background: rgb(255, 255, 255) !important;
  border-color: rgb(225, 230, 235) !important;
  color: rgb(28, 32, 39) !important;
}

.shs-enhanced input:focus,
.shs-enhanced select:focus,
.shs-enhanced textarea:focus {
  border-color: rgb(54, 123, 245) !important;
  box-shadow: 0 0 0 2px rgba(54, 123, 245, 0.15) !important;
}

/* ===== КНОПКИ ===== */
.shs-enhanced .btn,
.shs-enhanced button:not([type="submit"]) {
  background: rgb(255, 255, 255) !important;
  border: 1px solid rgb(225, 230, 235) !important;
  color: rgb(28, 32, 39) !important;
  transition: all 0.2s !important;
}

.shs-enhanced .btn:hover,
.shs-enhanced button:not([type="submit"]):hover {
  background: rgb(245, 247, 250) !important;
  border-color: rgb(54, 123, 245) !important;
}

/* ===== 🌙 ТЁМНАЯ ТЕМА ===== */
body.shs-enhanced[data-theme="dark"] {
  background: rgb(22, 25, 30) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .navbar {
  background: rgb(32, 36, 43) !important;
  border-bottom: 1px solid rgb(45, 50, 60) !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
}

.shs-enhanced[data-theme="dark"] .navbar-default {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  border-bottom: 1px solid rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] .navbar-nav > li > a {
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .navbar-nav > li > a:hover,
.shs-enhanced[data-theme="dark"] .navbar-nav > li > a:focus,
.shs-enhanced[data-theme="dark"] .navbar-nav > li > a:active {
  color: rgb(90, 150, 255) !important;
  background: rgb(45, 50, 60) !important;
  background-color: rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] .navbar-brand {
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .navbar-nav > li.active > a,
.shs-enhanced[data-theme="dark"] .navbar-nav > li.active > a:hover,
.shs-enhanced[data-theme="dark"] .navbar-nav > li.active > a:focus {
  background-color: rgb(45, 50, 60) !important;
  color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] .form-inline,
.shs-enhanced[data-theme="dark"] #sched-table,
.shs-enhanced[data-theme="dark"] #disciplines-table,
.shs-enhanced[data-theme="dark"] .disciplines-header {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
}

.shs-enhanced[data-theme="dark"] input[name="d"],
.shs-enhanced[data-theme="dark"] input[type="text"],
.shs-enhanced[data-theme="dark"] input[type="password"],
.shs-enhanced[data-theme="dark"] input[type="email"],
.shs-enhanced[data-theme="dark"] select,
.shs-enhanced[data-theme="dark"] textarea {
  background: rgb(22, 25, 30) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] input:focus,
.shs-enhanced[data-theme="dark"] select:focus,
.shs-enhanced[data-theme="dark"] textarea:focus {
  border-color: rgb(90, 150, 255) !important;
  box-shadow: 0 0 0 2px rgba(90, 150, 255, 0.2) !important;
}

.shs-enhanced[data-theme="dark"] .date-controls button {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .date-controls button:hover {
  background: rgb(45, 50, 60) !important;
  border-color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] .btn-primary[type="submit"] {
  background: rgb(90, 150, 255) !important;
  color: rgb(255, 255, 255) !important;
}

.shs-enhanced[data-theme="dark"] .btn-primary[type="submit"]:hover {
  background: rgb(70, 130, 235) !important;
  box-shadow: 0 2px 6px rgba(90, 150, 255, 0.4) !important;
}

.shs-enhanced[data-theme="dark"] .btn,
.shs-enhanced[data-theme="dark"] button:not([type="submit"]) {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .btn:hover,
.shs-enhanced[data-theme="dark"] button:not([type="submit"]):hover {
  background: rgb(45, 50, 60) !important;
  border-color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] #sched-table thead th,
.shs-enhanced[data-theme="dark"] #disciplines-table thead th {
  background: rgb(22, 25, 30) !important;
  color: rgb(235, 238, 242) !important;
  border-bottom-color: rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] #sched-table tbody tr,
.shs-enhanced[data-theme="dark"] #disciplines-table tbody tr {
  background: rgb(32, 36, 43) !important;
  border-bottom-color: rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] #sched-table tbody tr:hover,
.shs-enhanced[data-theme="dark"] #disciplines-table tbody tr:hover {
  background: rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] #sched-table td,
.shs-enhanced[data-theme="dark"] #sched-table th,
.shs-enhanced[data-theme="dark"] #disciplines-table td,
.shs-enhanced[data-theme="dark"] #disciplines-table th {
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] h1,
.shs-enhanced[data-theme="dark"] h2,
.shs-enhanced[data-theme="dark"] h3,
.shs-enhanced[data-theme="dark"] h4,
.shs-enhanced[data-theme="dark"] h5,
.shs-enhanced[data-theme="dark"] h6 {
  color: rgb(235, 238, 242) !important;
  border-bottom-color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] .disciplines-header {
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .disciplines-header:hover {
  background: rgb(45, 50, 60) !important;
  border-color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] .menu-toggle {
  color: rgb(140, 147, 156) !important;
}

.shs-enhanced[data-theme="dark"] a {
  color: rgb(90, 150, 255) !important;
}

.shs-enhanced[data-theme="dark"] a:hover {
  color: rgb(110, 170, 255) !important;
}

.shs-enhanced[data-theme="dark"] .panel,
.shs-enhanced[data-theme="dark"] .well,
.shs-enhanced[data-theme="dark"] .alert {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .panel-heading {
  background: rgb(22, 25, 30) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] hr {
  border-color: rgb(45, 50, 60) !important;
}

.shs-enhanced[data-theme="dark"] .settings-menu {
  background: rgb(32, 36, 43) !important;
  border-color: rgb(45, 50, 60) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
}

.shs-enhanced[data-theme="dark"] .settings-menu .header,
.shs-enhanced[data-theme="dark"] .settings-menu .setting-label {
  color: rgb(235, 238, 242) !important;
}

.shs-enhanced[data-theme="dark"] .settings-menu .setting-select {
  background: rgb(22, 25, 30) !important;
  border-color: rgb(45, 50, 60) !important;
  color: rgb(235, 238, 242) !important;
}

/* ===== 📱 ТЕЛЕФОНЫ — ДОП ===== */
@media (max-width: 480px) {
  .shs-enhanced body {
    font-size: 16px !important;
  }
  .shs-enhanced .menu-toggle {
    font-size: 1.4rem !important;
  }
  .shs-enhanced .disciplines-header {
    font-size: 1.3rem !important;
    padding: 10px !important;
  }
  .shs-enhanced .settings-menu {
    font-size: 14px !important;
    padding: 12px !important;
  }
}
  `;
  document.head.appendChild(style);

  // Остальной код без изменений...
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const formatDate = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}.${d.getFullYear()}`;
  };

  const parseDate = (str) => {
    const [d, m, y] = str.split(".").map(Number);
    return new Date(y, m - 1, d);
  };

  function applyTheme() {
    const saved = localStorage.getItem("shs-theme") || "system";
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const systemPrefersDark = mq.matches;

    const themeToApply = saved === "system" ? (systemPrefersDark ? "dark" : "light") : saved;

    document.body.setAttribute("data-theme", themeToApply);

    const select = document.getElementById("theme-select");
    if (select) select.value = saved;

    mq.onchange = (e) => {
      const current = localStorage.getItem("shs-theme") || "system";
      if (current === "system") {
        const newTheme = e.matches ? "dark" : "light";
        document.body.setAttribute("data-theme", newTheme);
      }
    };

    return themeToApply;
  }

  const DOM = {
    dateInput: null,
    searchBtn: null,
    tables: [],
    navbarRight: null,
    h2s: [],
    init() {
      this.dateInput = $('input[name="d"]');
      this.searchBtn = $('.btn-primary[type="submit"]');
      this.tables = $$("table.table.table-striped");
      this.navbarRight = $(".navbar-nav.navbar-right");
      this.h2s = $$("h2");
      return this.navbarRight !== null;
    },
  };

  const modules = {
    uiCleanup() {
      const h2Schedule = DOM.h2s.find((h) => /расписан/i.test(h.textContent));
      if (h2Schedule) {
        h2Schedule.remove();
        const nextHR = h2Schedule.nextElementSibling;
        if (nextHR?.tagName === "HR") nextHR.remove();
      }

      const fullLink = $('a[href*="page=r"]');
      if (fullLink) fullLink.remove();

      const groupLink = $('a[href*="act=group"]:not([href*="act2="])');
      if (groupLink) {
        try {
          const url = new URL(groupLink.href, location.origin);
          url.searchParams.set("act2", "prog");
          groupLink.href = url.toString();
          groupLink.title = "Программа обучения группы";
        } catch (e) {
          console.warn('[SHS] Не удалось обновить ссылку "Группа":', e);
        }
      }
    },

    dateNavigation() {
      if (!DOM.dateInput || !DOM.searchBtn) return;

      const ctrl = document.createElement("div");
      ctrl.className = "date-controls";

      ["←", "🏠", "→"].forEach((txt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = txt;
        btn.title = i === 0 ? "Предыдущий день" : i === 1 ? "Сегодня" : "Следующий день";
        btn.onclick = () => {
          const d = parseDate(DOM.dateInput.value);
          d.setDate(d.getDate() + (i === 0 ? -1 : i === 2 ? 1 : 0));
          if (i === 1) d.setTime(Date.now());
          DOM.dateInput.value = formatDate(d);
          DOM.searchBtn.click();
        };
        ctrl.appendChild(btn);
      });

      DOM.searchBtn.parentNode.insertBefore(ctrl, DOM.searchBtn.nextSibling);

      DOM.dateInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || (e.ctrlKey && e.key === "Enter")) {
          e.preventDefault();
          DOM.searchBtn.click();
        }
      });
    },

    disciplineLinks: {
      map: new Map(),
      init() {
        if (DOM.tables.length < 2) return;
        const [, discTable] = DOM.tables;
        this.map.clear();
        $$("tbody tr", discTable).forEach((tr) => {
          const a = $("td:nth-child(2) a[href]", tr);
          if (a) this.map.set(a.textContent.trim(), a.href);
        });
      },
      apply() {
        if (DOM.tables.length < 1) return;
        const [schedTable] = DOM.tables;
        $$("tbody tr", schedTable).forEach((tr) => {
          const td = $("td:nth-child(2)", tr);
          if (!td) return;
          const name = td.textContent.trim();
          const href = this.map.get(name);
          if (href) {
            const link = document.createElement("a");
            link.href = href;
            link.textContent = name;
            link.title = "Перейти к программе дисциплины";
            td.innerHTML = "";
            td.appendChild(link);
          }
        });
      },
    },

    disciplinesToggler() {
      const h2Disc = DOM.h2s.find((h) => /дисциплин/i.test(h.textContent));
      const discTable = DOM.tables[1];
      if (!h2Disc || !discTable) return;

      modules.disciplineLinks.init();
      modules.disciplineLinks.apply();

      const wrapper = document.createElement("div");
      wrapper.className = "disciplines-header";
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("aria-expanded", "true");
      wrapper.setAttribute("aria-controls", "disciplines-table");
      wrapper.innerHTML = '<span class="menu-toggle">☰</span> Дисциплины';

      h2Disc.replaceWith(wrapper);
      discTable.id = "disciplines-table";
      if (DOM.tables[0]) {
        DOM.tables[0].id = "sched-table";
      }

      let isHidden = localStorage.getItem("shs-disc-hidden") === "true";
      if (isHidden) {
        discTable.classList.add("hidden");
        wrapper.querySelector(".menu-toggle").classList.add("rotated");
        wrapper.setAttribute("aria-expanded", "false");
      }

      const toggle = () => {
        isHidden = !isHidden;
        discTable.classList.toggle("hidden", isHidden);
        wrapper.querySelector(".menu-toggle").classList.toggle("rotated", isHidden);
        wrapper.setAttribute("aria-expanded", String(!isHidden));
        localStorage.setItem("shs-disc-hidden", String(isHidden));
      };

      wrapper.onclick = wrapper.onkeydown = (e) => {
        if (e.type === "keydown" && !["Enter", " "].includes(e.key)) return;
        e.preventDefault();
        toggle();
      };
    },

    settingsMenu: {
      menu: null,
      init() {
        if (!DOM.navbarRight) return;

        this.menu = document.createElement("div");
        this.menu.className = "settings-menu";
        this.menu.innerHTML = `
          <div class="header">Настройки</div>

          <div class="setting-row">
            <span class="setting-label">Тема:</span>
            <select id="theme-select" class="setting-select">
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="system">Системная</option>
            </select>
          </div>
        `;
        document.body.appendChild(this.menu);

        const gearLi = document.createElement("li");
        const gearLink = document.createElement("a");
        gearLink.href = "#";
        gearLink.textContent = "⚙️";
        gearLink.setAttribute("aria-label", "Настройки");
        gearLink.setAttribute("role", "button");
        gearLi.appendChild(gearLink);

        const exitLi = $("li:last-child", DOM.navbarRight);
        if (exitLi) DOM.navbarRight.insertBefore(gearLi, exitLi);
        else DOM.navbarRight.appendChild(gearLi);

        const themeSelect = $("#theme-select", this.menu);
        const stored = localStorage.getItem("shs-theme") || "system";
        themeSelect.value = stored;

        themeSelect.onchange = () => {
          const value = themeSelect.value;
          localStorage.setItem("shs-theme", value);

          if (value === "system") {
            const mq = matchMedia("(prefers-color-scheme: dark)");
            document.body.setAttribute("data-theme", mq.matches ? "dark" : "light");
          } else {
            document.body.setAttribute("data-theme", value);
          }
        };

        gearLink.onclick = (e) => {
          e.preventDefault();
          const wasVisible = this.menu.style.display === "block";
          this.menu.style.display = wasVisible ? "none" : "block";

          if (!wasVisible) {
            const rect = gearLink.getBoundingClientRect();
            const menuRect = this.menu.getBoundingClientRect();

            let left = rect.left + rect.width / 2 - menuRect.width / 2;
            if (left < 8) left = 8;
            if (left + menuRect.width > window.innerWidth - 8) {
              left = window.innerWidth - menuRect.width - 8;
            }

            this.menu.style.left = `${left}px`;
            this.menu.style.top = `${rect.bottom + 4}px`;
            this.menu.style.transform = "none";
          }
        };

        document.addEventListener("click", (e) => {
          if (!this.menu.contains(e.target) && e.target !== gearLink) {
            this.menu.style.display = "none";
          }
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") this.menu.style.display = "none";
        });
      },
    },
  };

  function main() {
    document.body.classList.add("shs-enhanced");
    applyTheme();

    if (!DOM.init()) return;

    modules.settingsMenu.init();

    try {
      modules.uiCleanup();
      modules.dateNavigation();
      modules.disciplinesToggler();
    } catch (err) {
      console.error("[SHS] Ошибка:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
