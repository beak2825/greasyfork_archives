// ==UserScript==
// @name         SmartPush 店铺信息样式
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  SmartPush店铺信息脚本的样式文件
// @author       lulu
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

GM_addStyle(`
/* 滑动开关容器 */
.switch-wrapper {
    display: flex;
    align-items: center;
    margin: 15px 0;
    gap: 8px;
}

/* 滑动开关核心样式（隐藏原生复选框） */
.java-request-switch {
    width: 46px;
    height: 24px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: #e6e6e6;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
    outline: none;
    border: none;
    box-shadow: inset 0 0 0 1px #ddd;
}

/* 开关选中状态 */
.java-request-switch:checked {
    background-color: #007BFF;
    box-shadow: inset 0 0 0 1px #007BFF;
}

/* 开关滑块 */
.java-request-switch::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: left 0.3s ease, transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 选中时滑块右移 */
.java-request-switch:checked::after {
    left: 24px;
}

/* 点击滑块交互效果 */
.java-request-switch:active::after {
    transform: scale(1.05);
}

/* 开关标签 */
.switch-label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    user-select: none;
}

/* 主按钮样式 */
.smartpush-main-btn {
    position: fixed;
    top: 10px;
    left: 260px;
    z-index: 9999;
    width: 60px;
    height: 40px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    text-align: center;
    background-color: #007BFF;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: auto;
    user-select: none;
}

/* 主按钮关闭按钮 */
.smartpush-main-close {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
}

/* 模态框容器 */
.smartpush-modal {
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    padding: 20px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    width: 300px;
    display: none;
    pointer-events: auto;
    max-height: 80vh;
    overflow-y: auto;
    /* Flex 布局核心（保留） */
    display: flex;
    flex-wrap: wrap;       /* 超出自动换行 */
    gap: 10px;             /* 按钮之间的间距（关键：恢复间距） */
    align-items: center;   /* 垂直居中 */
    justify-content: center; /* 按钮水平居中（可选，更美观） */

}

/* 模态框关闭按钮 */
.smartpush-modal-close {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0 5px;
}

/* 模态框标题 */
.smartpush-modal-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
    margin-top: 0;
}

/* 账号信息容器 */
.smartpush-info-container {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #555;
    white-space: pre-wrap;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
}

/* ========== 公共样式（两个按钮共享，仅写一次） ========== */
.smartpush-one-line-btn,
.smartpush-action-btn {
    padding: 8px 15px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    /* 统一上下间距（两个按钮保持一致） */
    margin: 5px 0;
    /* 可选：hover/active 交互（统一样式） */
    transition: background-color 0.2s ease;
}

/* 统一 hover/active 效果 */
.smartpush-one-line-btn:hover,
.smartpush-action-btn:hover {
    background-color: #0056b3;
}
.smartpush-one-line-btn:active,
.smartpush-action-btn:active {
    background-color: #004085;
    transform: scale(0.98);
}

/* ========== 公共按钮样式（所有按钮统一） ========== */
.smartpush-one-line-btn,
.smartpush-action-btn {
    padding: 10px 15px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px; /* 图标与文字的间距 */
}

.smartpush-one-line-btn:hover,
.smartpush-action-btn:hover {
    background-color: #0056b3;
}

.smartpush-one-line-btn:active,
.smartpush-action-btn:active {
    background-color: #004085;
    transform: scale(0.98);
}

/* ========== 独占一行按钮（一键复制） ========== */
.smartpush-one-line-btn {
    width: 100%; /* 占满模态框宽度 */
    margin: 0 0 12px 0; /* 底部留间距 */
}

/* ========== 两个按钮的容器（关键：强制一行排列） ========== */
.smartpush-btn-group {
    display: flex; /* 强制一行排列 */
    gap: 12px; /* 两个按钮之间的间距 */
    width: 100%;
    margin: 0 0 12px 0;
}

/* ========== 一行两个按钮（自适应宽度） ========== */
.smartpush-action-btn {
    flex: 1; /* 平分容器宽度 */
    min-width: 0; /* 防止文字溢出 */
}


    /* 模态框基础样式 */
    .config-modal {
      position: fixed;
      z-index: 10001;
      display: none;
      background-color: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border-radius: 12px;
      width: 350px;
      padding: 25px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* 模态框标题 */
    .config-modal-title {
      margin: 0 0 25px 0;
      padding: 0 0 15px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
      border-bottom: 2px solid #f0f0f0;
    }

    /* 关闭按钮（右上角×） */
    .smartpush-modal-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
    }
    .smartpush-modal-close:hover {
      color: #ff4d4f;
    }

    /* 配置选项容器 */
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* 单个配置项 */
    .config-option {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* 选项头部（标签+开关） */
    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 选项标签 */
    .option-label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    /* 选项说明文字 */
    .option-description {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }

    /* 分隔符 */
    .option-separator {
      height: 1px;
      background-color: #f0f0f0;
      margin: 0;
    }

    /* 开关样式 */
    .config-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      cursor: pointer;
    }
    .config-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .config-slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 20px;
      transition: .3s;
    }
    .config-slider-before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      border-radius: 50%;
      transition: .3s;
    }
    .config-switch input:checked + .config-slider {
      background-color: #1890ff;
    }
    .config-switch input:checked + .config-slider .config-slider-before {
      transform: translateX(20px);
    }

    /* 接口列表容器 */
    .api-list-container {
      max-height: 150px;
      overflow-y: auto;
      margin-bottom: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 8px;
    }

    /* 接口列表项 */
    .api-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      margin-bottom: 4px;
      background-color: #f8f9fa;
      border-radius: 3px;
      font-size: 12px;
    }

    /* 接口删除按钮 */
    .api-delete-btn {
      background: #ff4d4f;
      color: white;
      border: none;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      flex-shrink: 0;
      margin-left: 8px;
    }

    /* 接口表单容器 */
    .api-form-container {
      display: flex;
      gap: 8px;
    }

    /* 接口输入框 */
    .api-input {
      flex: 1;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 12px;
    }
    .api-input:focus {
      outline: none;
      border-color: #1890ff;
    }

    /* 接口添加按钮 */
    .api-add-btn {
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .api-add-btn:hover {
      background: #40a9ff;
    }

    /* 关闭按钮容器 */
    .config-close-container {
      margin-top: 20px;
      text-align: center;
    }

    /* 关闭按钮 */
    .config-close-btn {
      padding: 8px 24px;
      background: #f5f5f5;
      color: #333;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    .config-close-btn:hover {
      background: #e6e6e6;
    }
    

/* 按钮+复选框融合样式 */
.btn-with-checkbox {
    position: relative;
    display: inline-block;
}

/* 复选框基础样式（右侧定位） */
.btn-checkbox {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; /* 放大复选框尺寸，容纳更大对勾 */
    height: 16px;
    cursor: pointer;
    z-index: 1;
    /* 隐藏原生样式 */
    appearance: none;
    -webkit-appearance: none;
    /* 未勾选：白色边框（无背景） */
    border: 2px solid #ffffff;
    border-radius: 3px;
    background-color: transparent; /* 始终无背景 */
    transition: border-color 0.2s ease;
}

/* 勾选状态：去掉背景 + 放大对勾（白色对勾直接显示在按钮上） */
.btn-checkbox:checked {
    border-color: #ffffff; /* 保持白色边框 */
    background-color: transparent; /* 无白色背景，直接用按钮的蓝色背景 */
    /* 放大的白色对勾（尺寸16px） */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M5 8L7 10L11 6' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 16px; /* 对勾放大到16px */
}

/* 带复选框的按钮：调整右内边距（适配放大的复选框） */
.smartpush-action-btn.with-checkbox {
    padding-right: 40px;
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 灰度配置选项样式 - 左侧 */
.gray-config-container {
    margin-top: 15px;
    border-top: 1px solid #e8e8e8;
    padding-top: 15px;
    order: 1; /* 放在左侧 */
}

.gray-config-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
}

.gray-config-title::before {
    content: "🎨";
    font-size: 12px;
}

.gray-config-title.collapsed::after {
    content: "▶";
    margin-left: auto;
    font-size: 10px;
    color: #666;
    transition: transform 0.2s;
}

.gray-config-title.expanded::after {
    content: "▼";
    margin-left: auto;
    font-size: 10px;
    color: #666;
    transition: transform 0.2s;
}

.gray-options-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.gray-options-group.collapsed {
    max-height: 0;
    opacity: 0;
    margin-bottom: 0;
}

.gray-options-group.expanded {
    max-height: 500px;
    opacity: 1;
}

.gray-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    cursor: pointer;
    transition: all 0.2s ease;
}

.gray-option:hover {
    background: #e9ecef;
    border-color: #dee2e6;
}

.gray-option.selected {
    background: #e6f7ff;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.gray-option input[type="radio"] {
    margin: 0 8px 0 0;
    cursor: pointer;
}

.gray-option-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.gray-option-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.gray-option-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.3;
}

.gray-option-icon {
    margin-left: auto;
    font-size: 12px;
    color: #666;
}

.gray-option.selected .gray-option-icon {
    color: #1890ff;
}

.gray-current-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 6px;
    border: 1px solid #d0ebff;
    margin-top: 10px;
    transition: all 0.3s ease;
}

.gray-current-status.collapsed {
    margin-top: 0;
    opacity: 0.8;
}

.gray-status-label {
    font-size: 12px;
    color: #666;
}

.gray-status-value {
    font-size: 12px;
    font-weight: 500;
    color: #1890ff;
    padding: 2px 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #d0ebff;
}

/* 收起状态下的简化显示 */
.gray-simple-display {
    display: none;
    padding: 6px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    font-size: 12px;
    color: #666;
}

.gray-simple-display.collapsed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.gray-simple-text {
    font-size: 12px;
    color: #333;
}

.gray-change-btn {
    font-size: 11px;
    color: #1890ff;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
}

.gray-change-btn:hover {
    background: #e6f7ff;
}

/* ========== 前端配置容器 - 右侧 ========== */
.frontend-config-container {
    order: 2; /* 放在右侧 */
    margin-top: 15px;
    border-top: 1px solid #e8e8e8;
    padding-top: 15px;
}

.frontend-config-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
}

.frontend-config-title::before {
    content: "⚙️";
    font-size: 12px;
}

.frontend-config-title.collapsed::after {
    content: "▶";
    margin-left: auto;
    font-size: 10px;
    color: #666;
    transition: transform 0.2s;
}

.frontend-config-title.expanded::after {
    content: "▼";
    margin-left: auto;
    font-size: 10px;
    color: #666;
    transition: transform 0.2s;
}

.frontend-options-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.frontend-options-group.collapsed {
    max-height: 0;
    opacity: 0;
    margin-bottom: 0;
}

.frontend-options-group.expanded {
    max-height: 500px;
    opacity: 1;
}

.frontend-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    cursor: pointer;
    transition: all 0.2s ease;
}

.frontend-option:hover {
    background: #e9ecef;
    border-color: #dee2e6;
}

.frontend-option.selected {
    background: #e6f7ff;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.frontend-option input[type="radio"] {
    margin: 0 8px 0 0;
    cursor: pointer;
}

.frontend-option-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.frontend-option-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.frontend-option-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.3;
}

.frontend-option-icon {
    margin-left: auto;
    font-size: 12px;
    color: #666;
}

.frontend-option.selected .frontend-option-icon {
    color: #1890ff;
}

.frontend-current-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 6px;
    border: 1px solid #d0ebff;
    margin-top: 10px;
    transition: all 0.3s ease;
}

.frontend-current-status.collapsed {
    margin-top: 0;
    opacity: 0.8;
}

.frontend-status-label {
    font-size: 12px;
    color: #666;
}

.frontend-status-value {
    font-size: 12px;
    font-weight: 500;
    color: #1890ff;
    padding: 2px 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #d0ebff;
}

/* 收起状态下的简化显示 */
.frontend-simple-display {
    display: none;
    padding: 6px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    font-size: 12px;
    color: #666;
}

.frontend-simple-display.collapsed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.frontend-simple-text {
    font-size: 12px;
    color: #333;
}

.frontend-change-btn {
    font-size: 11px;
    color: #1890ff;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
}

.frontend-change-btn:hover {
    background: #e6f7ff;
}

/* ========== 配置容器布局 ========== */
.config-layout {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 左右两列 */
    gap: 20px; /* 两列之间的间距 */
    margin-top: 15px;
}

/* 左侧容器（灰度配置） */
.config-left-column {
    order: 1;
    border-right: 1px solid #e8e8e8;
    padding-right: 20px;
}

/* 右侧容器（前端配置） */
.config-right-column {
    order: 2;
    padding-left: 20px;
}

/* 分隔线样式 */
.config-column-divider {
    height: 100%;
    width: 1px;
    background-color: #e8e8e8;
}

/* 配置标题样式 */
.config-column-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.config-column-title::before {
    content: "";
    width: 4px;
    height: 16px;
    background-color: #1890ff;
    border-radius: 2px;
}

/* 左侧标题特定样式 */
.left-column-title::before {
    background-color: #52c41a; /* 绿色 */
}

/* 右侧标题特定样式 */
.right-column-title::before {
    background-color: #1890ff; /* 蓝色 */
}

/* 配置项组样式 */
.config-item-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* 配置项样式 */
.config-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;
}

.config-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
}

.config-item-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.config-item-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.config-item-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.3;
}

/* 开关样式 */
.config-switch-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;
}

.config-switch-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
}

.switch-label-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.switch-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.switch-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.3;
}

/* 状态显示样式 */
.config-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #f0f9ff;
    border-radius: 6px;
    border: 1px solid #d0ebff;
    margin-top: 15px;
}

.config-status-label {
    font-size: 12px;
    color: #666;
}

.config-status-value {
    font-size: 12px;
    font-weight: 500;
    color: #1890ff;
    padding: 2px 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #d0ebff;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .config-layout {
        grid-template-columns: 1fr; /* 小屏幕单列显示 */
        gap: 15px;
    }
    
    .config-left-column,
    .config-right-column {
        padding: 0;
        border: none;
    }
}

* 小按钮样式 */
.config-btn-small {
    padding: 6px 12px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
}

.config-btn-small:hover {
    background: #40a9ff;
}

/* 接口管理弹窗专用样式 */
.api-management-modal .api-modal-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 15px;
    text-align: center;
}

.api-management-modal .api-list-container {
    max-height: 200px;
    min-height: 100px;
    margin-bottom: 15px;
}

/* 配置项按钮容器 */
.config-item-btn-container {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* 开关项样式优化 */
.config-switch-item {
    padding: 12px 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;
}

.config-switch-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 配置项样式优化 */
.config-item {
    padding: 12px 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;
}

.config-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 标题样式优化 */
.config-column-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 左侧列特定样式 */
.left-column-title {
    color: #52c41a; /* 绿色 */
}

.left-column-title::before {
    background-color: #52c41a;
}

/* 右侧列特定样式 */
.right-column-title {
    color: #1890ff; /* 蓝色 */
}

.right-column-title::before {
    background-color: #1890ff;
}

/* 布局容器样式 */
.config-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 20px 0;
    min-height: 400px;
}

/* 左侧列样式 */
.config-left-column {
    padding-right: 25px;
    border-right: 1px solid #e8e8e8;
}

/* 右侧列样式 */
.config-right-column {
    padding-left: 25px;
}

/* 配置模态框宽度调整 */
.config-modal {
    width: 700px; /* 增加宽度以适应两列布局 */
    max-width: 90vw;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .config-layout {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .config-left-column,
    .config-right-column {
        padding: 0;
        border: none;
    }
    
    .config-modal {
        width: 95vw;
    }
}

/* 接口Java管理模态框样式 */
.api-java-modal {
    width: 500px;
    max-height: 600px;
}

.api-java-content {
    padding: 15px;
}

.api-java-desc {
    margin-bottom: 15px;
    color: #666;
    font-size: 14px;
}

.api-add-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.api-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.api-input:focus {
    outline: none;
    border-color: #1890ff;
}

.api-add-btn {
    padding: 8px 16px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.api-add-btn:hover {
    background: #40a9ff;
}

.api-list-container {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
}

.api-empty, .api-error {
    text-align: center;
    color: #999;
    padding: 20px;
}

.api-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.api-table th {
    background: #f5f5f5;
    padding: 10px;
    text-align: left;
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid #ddd;
}

.api-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.api-path {
    word-break: break-all;
    max-width: 350px;
}

.api-delete-btn {
    padding: 4px 8px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    transition: all 0.2s ease;
    /* 确保文字在按钮内居中 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 24px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
}

.api-delete-btn:hover {
    background: #ff7875;
}

.api-button-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.api-clear-btn {
    padding: 8px 16px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.api-clear-btn:hover {
    background: #ff7875;
}

.api-close-btn {
    padding: 8px 16px;
    background: #d9d9d9;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.api-close-btn:hover {
    background: #bfbfbf;
}

`);