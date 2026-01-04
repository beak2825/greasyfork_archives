/**
 * Locale configuration for [Chat] Template Text Folders UI.
 * Exposes a global helper for translating UI strings.
 */
(function (global) {
    'use strict';

    /**
     * English translations keyed by the original Simplified Chinese string.
     * The Simplified Chinese version is used as the default/fallback.
     */
    const EN_TRANSLATIONS = {
        "+ 新建": "+ New",
        "+ 新建按钮": "+ New Button",
        "+ 新建文件夹": "+ New Folder",
        "CSS 选择器语法错误，请检查后再试！": "CSS selector syntax error, please verify and try again!",
        "ChatGPT自定义样式": "ChatGPT Custom Style",
        "Enter 提交方式没有额外配置。": "Enter submission has no extra options.",
        "https:// 或 data:image/svg+xml;base64...": "https:// or data:image/svg+xml;base64...",
        "resize事件触发失败:": "Failed to trigger resize event:",
        "waitForContentMatch: 超时，输入框内容未能匹配预期文本": "waitForContentMatch: Timed out before content matched expected text",
        "ℹ️ 按钮容器已存在，跳过附加。": "ℹ️ Button container already exists, skipping attach.",
        "⏳ 页面已完全加载，开始初始化脚本。": "⏳ Page fully loaded, initializing script.",
        "⚙️ 设置面板": "⚙️ Settings Panel",
        "⚠️ 尝试关闭不存在的弹窗": "⚠️ Tried to close a non-existent dialog",
        "⚠️ 所有自动提交方式均未成功。": "⚠️ All auto-submit methods failed.",
        "⚠️ 提交正在进行中，跳过重复提交。": "⚠️ Submission in progress, skipping duplicate attempt.",
        "⚠️ 注意：此操作无法撤销！": "⚠️ Warning: This action cannot be undone!",
        "⚠️ 未找到任何 textarea 或 contenteditable 元素。": "⚠️ No textarea or contenteditable element found.",
        "⚠️ 未找到名为 'submitForm' 的提交函数。": "⚠️ No submit function named \"submitForm\" found.",
        "⚠️ 未找到按钮容器，无法更新按钮栏。": "⚠️ Button container not found, cannot refresh toolbar.",
        "⚠️ 未找到提交按钮，尝试其他提交方式。": "⚠️ Submit button not found, trying other methods.",
        "⚠️ 未找到提交按钮，进入fallback...": "⚠️ Submit button missing, falling back...",
        "⚠️ 未找到表单元素，无法触发 'submit' 事件。": "⚠️ No form element found, cannot dispatch \"submit\" event.",
        "⚠️ 未知自动提交方式，进入fallback...": "⚠️ Unknown auto-submit method, falling back...",
        "⚠️ 自定义选择器 \"{{selector}}\" 解析失败:": "⚠️ Custom selector \"{{selector}}\" failed to parse:",
        "⚠️ 自定义选择器 \"{{selector}}\" 未匹配到提交按钮，尝试默认规则。": "⚠️ Custom selector \"{{selector}}\" did not match a submit button, trying default rules.",
        "⚠️ 自动提交失败。": "⚠️ Auto-submit failed.",
        "⚡ 自动化": "⚡ Automation",
        "⚡ 自动化设置": "⚡ Automation Settings",
        "✅ 已为自动化与样式配置补全 favicon 信息。": "✅ Filled missing favicons for automation and style rules.",
        "✅ 已剪切输入框内容到剪贴板。": "✅ Input content cut to clipboard.",
        "✅ 工具文件夹 \"{{folderName}}\" 已添加到配置中。": "✅ Toolbox folder \"{{folderName}}\" added to config.",
        "✅ 工具按钮 \"{{buttonName}}\" 已添加到文件夹 \"{{folderName}}\"。": "✅ Tool button \"{{buttonName}}\" added to folder \"{{folderName}}\".",
        "✅ 已复制输入框内容到剪贴板。": "✅ Input content copied to clipboard.",
        "✅ 已根据 {{name}} 设置按钮栏高度：{{height}}px": "✅ Toolbar height set to {{height}}px for {{name}}",
        "✅ 已根据自动化规则，模拟点击提交按钮。": "✅ Simulated submit button click per automation rule.",
        "✅ 已根据自动化规则，自定义选择器 \"{{selector}}\" 提交。": "✅ Auto-submit via custom selector \"{{selector}}\".",
        "✅ 已根据自动化规则，触发 Cmd + Enter 提交。": "✅ Triggered Cmd + Enter submit per automation rule.",
        "✅ 已确保所有按钮具有'type'、'autoSubmit'、'favicon'配置，以及文件夹具有'hidden'字段。": "✅ Ensured all buttons have type/autoSubmit/favicon and folders include hidden flag.",
        "✅ 已粘贴剪贴板内容到输入框。": "✅ Clipboard content pasted into input.",
        "✅ 已注入自定义CSS至 <head> 来自：{{name}}": "✅ Injected custom CSS into <head> from {{name}}",
        "✅ 已根据自动化规则，触发 Ctrl + Enter 提交。": "✅ Triggered Ctrl + Enter submit per automation rule.",
        "✅ 按钮容器已固定到窗口底部。": "✅ Button container fixed to window bottom.",
        "✅ 按钮容器已附加到 textarea 元素。": "✅ Button container attached to textarea element.",
        "✅ 按钮已附加到最新的 textarea 或 contenteditable 元素。": "✅ Buttons attached to latest textarea or contenteditable element.",
        "✅ 按钮栏已更新（已过滤隐藏文件夹）。": "✅ Toolbar refreshed (hidden folders filtered).",
        "✅ 按钮 \"{{buttonName}}\" 已保存。": "✅ Button \"{{buttonName}}\" saved.",
        "✅ 按钮 \"{{buttonName}}\" 的自动提交已设置为 {{state}}": "✅ Auto-submit for button \"{{buttonName}}\" set to {{state}}",
        "✅ 自动提交已通过点击提交按钮触发。": "✅ Auto-submit triggered via submit button click.",
        "✅ 自动提交已通过触发 'submit' 事件触发。": "✅ Auto-submit triggered via \"submit\" event.",
        "✅ 自动提交已通过调用JavaScript函数触发。": "✅ Auto-submit triggered via JavaScript function.",
        "✅ 自动提交成功（已确认内容替换完成）。": "✅ Auto-submit succeeded (content replacement confirmed).",
        "✅ 自动提交开关已设置为 {{state}}": "✅ Auto-submit toggle set to {{state}}",
        "✅ 设置已保存并关闭设置面板。": "✅ Settings saved and panel closed.",
        "✅ 使用 {inputboard} 变量，输入框内容已被替换。": "✅ Used {inputboard} variable and replaced input content.",
        "✅ 输入框内容已清空。": "✅ Input cleared.",
        "✅ 插入了预设文本。": "✅ Inserted preset text.",
        "✅ 文件夹 \"{{folderName}}\" 已保存。": "✅ Folder \"{{folderName}}\" saved.",
        "✅ 文件夹 \"{{folderName}}\" 的隐藏状态已设置为 {{state}}": "✅ Folder \"{{folderName}}\" hidden status set to {{state}}",
        "✅ 配置管理弹窗已在导出后关闭": "✅ Config manager dialog closed after export",
        "✅ 配置管理弹窗已在重置前关闭": "✅ Config manager dialog closed before reset",
        "✅ 配置管理弹窗已自动关闭": "✅ Config manager dialog closed automatically",
        "✅ 配置管理弹窗已通过点击外部关闭": "✅ Config manager dialog closed by outside click",
        "✅ 弹窗 \"{{folderName}}\" 已立即关闭。": "✅ Dialog \"{{folderName}}\" closed immediately.",
        "⚠️ 弹窗 \"{{folderName}}\" 未被识别为当前打开的弹窗。": "⚠️ Dialog \"{{folderName}}\" was not recognized as the active dialog.",
        "🔒 弹窗 \"{{folderName}}\" 已关闭。": "🔒 Dialog \"{{folderName}}\" closed.",
        "🔒 弹窗 \"{{folderName}}\" 已关闭（点击外部区域）。": "🔒 Dialog \"{{folderName}}\" closed (outside click).",
        "🔒 弹窗 \"{{folderName}}\" 已关闭（toggleFolder 关闭其他弹窗）。": "🔒 Dialog \"{{folderName}}\" closed (toggleFolder closed others).",
        "🔓 弹窗 \"{{folderName}}\" 已打开。": "🔓 Dialog \"{{folderName}}\" opened.",
        "🔓 弹窗 \"{{folderName}}\" 已打开（toggleFolder）。": "🔓 Dialog \"{{folderName}}\" opened (toggleFolder).",
        "📍 弹窗位置设置为 Bottom: 40px, Left: {{left}}px": "📍 Dialog positioned at bottom 40px, left {{left}}px",
        "⚠️ 未找到与文件夹 \"{{folderName}}\" 关联的弹窗。": "⚠️ No dialog associated with folder \"{{folderName}}\" found.",
        "🗑️ 确认删除文件夹 \"{{folderName}}\"？": "🗑️ Delete folder \"{{folderName}}\"?",
        "🗑️ 确认删除自动化规则 \"{{ruleName}}\"？": "🗑️ Delete automation rule \"{{ruleName}}\"?",
        "确认删除样式 \"{{styleName}}\"？": "Delete style \"{{styleName}}\"?",
        "✏️ 编辑按钮：": "✏️ Edit Button:",
        "✏️ 编辑文件夹：": "✏️ Edit Folder:",
        "✏️ 编辑自动化规则": "✏️ Edit Automation Rule",
        "✏️ 编辑自定义样式": "✏️ Edit Custom Style",
        "❌ 用户取消了配置导入。": "❌ User cancelled config import.",
        "事件触发失败:": "Event dispatch failed:",
        "未知的工具按钮动作: {{action}}": "Unknown tool button action: {{action}}",
        "尝试通过键盘快捷键提交表单：{{combo}}": "Attempting to submit via keyboard shortcut: {{combo}}",
        "使用 Windows / Linux 控制键组合模拟提交": "Use Windows/Linux control key combo to submit",
        "使用 macOS / Meta 键组合模拟提交": "Use macOS/Meta key combo to submit",
        "使用自定义选择器定位需要点击的提交按钮。": "Use a custom selector to locate the submit button.",
        "保存": "Save",
        "修改": "Edit",
        "恢复默认设置：": "Restore defaults:",
        "关闭并保存": "Save & Close",
        "创建": "Create",
        "删除": "Delete",
        "↩️ 重置": "↩️ Reset",
        "配置导入导出：": "Import / Export:",
        "📥 导入": "📥 Import",
        "📤 导出": "📤 Export",
        "剪切": "Cut",
        "剪切失败:": "Cut failed:",
        "剪切失败，请检查浏览器权限。": "Cut failed, please check browser permissions.",
        "剪切成功": "Cut successful",
        "剪切输入框内容": "Cut input content",
        "勾选后该文件夹将在主界面显示": "Show this folder in the main toolbar when checked",
        "取消": "Cancel",
        "变量": "Variables",
        "插入变量：": "Insert variables:",
        "输入框": "Input Box",
        "可填写自定义图标地址": "Enter a custom icon URL",
        "图标": "Icon",
        "基础信息": "Basics",
        "备注名称：": "Label:",
        "复制": "Copy",
        "复制失败:": "Copy failed:",
        "复制失败，请检查浏览器权限。": "Copy failed, please check browser permissions.",
        "复制成功": "Copy successful",
        "复制输入框内容": "Copy input content",
        "如：button.send-btn 或 form button[type=\"submit\"]": "e.g. button.send-btn or form button[type=\"submit\"]",
        "支持 https:// 链接或 data: URL": "Supports https:// links or data: URLs",
        "导入的配置文件内容无效！": "Imported config file content is invalid!",
        "自动": "Auto",
        "中文": "中文",
        "English": "English",
        "导入的配置文件无效！缺少必要字段。": "Imported config file invalid! Missing required fields.",
        "导入的配置文件解析失败！请确认文件格式正确。": "Failed to parse imported config file! Check the format.",
        "导入配置时发生错误:": "Error occurred while importing config:",
        "导入配置时发生错误，请检查文件格式。": "Error importing config, please verify the file format.",
        "🔍 配置差异预览": "🔍 Configuration Diff Preview",
        "关闭": "Close",
        "查看差异": "View Diff",
        "文件夹": "Folders",
        "新增": "Added",
        "移除": "Removed",
        "变更": "Changed",
        "文件夹顺序已调整": "Folder order changed",
        "文件夹设置变更": "Folder settings changed",
        "新增文件夹 {{count}} 个": "{{count}} new folder(s)",
        "移除文件夹 {{count}} 个": "{{count}} folder(s) removed",
        "变更文件夹 {{count}} 个": "{{count}} folder(s) changed",
        "新增按钮 {{count}} 个": "{{count}} new button(s)",
        "移除按钮 {{count}} 个": "{{count}} button(s) removed",
        "变更按钮 {{count}} 个": "{{count}} button(s) changed",
        "请选择左侧文件夹查看差异": "Select a folder on the left to inspect differences",
        "导入后将新增此文件夹": "This folder will be added after import",
        "导入后将移除此文件夹": "This folder will be removed after import",
        "当前配置中无此文件夹。": "This folder does not exist in the current configuration.",
        "导入配置中无此文件夹。": "This folder does not exist in the imported configuration.",
        "变更字段：{{fields}}": "Changed fields: {{fields}}",
        "按钮顺序已调整": "Button order changed",
        "尚未配置任何样式，点击下方“+ 新建”添加。": "No styles yet, click \"+ New\" below to add one.",
        "展开/折叠高级选项": "Expand/Collapse advanced options",
        "展开左侧设置区域": "Expand left settings panel",
        "工具按钮不使用模板变量": "Utility buttons do not use template variables",
        "工具文件夹中的工具按钮无法编辑或删除。": "Tool buttons inside the toolbox folder cannot be edited or deleted.",
        "已重置为默认配置": "Reset to default configuration",
        "布局设置": "Layout",
        "应用域名样式失败:": "Failed to apply domain style:",
        "应用域名样式时出现问题:": "Issue occurred while applying domain style:",
        "弹窗标题": "Dialog Title",
        "当前提交方式没有可配置的高级选项。": "Current submission method has no advanced options.",
        "当前未聚焦到有效的 textarea 或 contenteditable 元素。": "No active textarea or contenteditable element focused.",
        "您可根据不同网址，自定义按钮栏高度和注入CSS样式。": "Customize toolbar height and injected CSS per domain.",
        "折叠左侧设置区域": "Collapse left settings panel",
        "按钮名称已存在！": "Button name already exists!",
        "按钮名称：": "Button Name:",
        "按钮图标：": "Button Icon:",
        "按钮栏距页面底部间距": "Toolbar bottom spacing",
        "按钮栏高度 (px)：": "Toolbar height (px):",
        "按钮距页面底部间距 (px)：": "Button bottom offset (px):",
        "按钮预览": "Button Preview",
        "提交方式": "Submission Method",
        "文件夹名称": "Folder Name",
        "文件夹名称：": "Folder Name:",
        "文件夹 \"{{folderName}}\" 不存在。": "Folder \"{{folderName}}\" does not exist.",
        "🗑️ 文件夹 \"{{folderName}}\" 已删除。": "🗑️ Folder \"{{folderName}}\" deleted.",
        "新样式": "New Style",
        "新网址规则": "New Domain Rule",
        "无": "None",
        "个文件夹": "folders",
        "个按钮": "buttons",
        "无法访问剪贴板内容:": "Unable to access clipboard content:",
        "无法访问剪贴板内容。请检查浏览器权限。": "Unable to access clipboard. Please check browser permissions.",
        "无自定义CSS": "No custom CSS",
        "显示": "Visible",
        "暂无自动化规则，点击下方“+ 新建”开始配置。": "No automation rules yet. Click \"+ New\" below to start.",
        "更新按钮栏布局失败:": "Failed to update toolbar layout:",
        "未使用模板变量": "Template variables not used",
        "未命名样式": "Unnamed style",
        "未命名规则": "Unnamed rule",
        "未设置域名": "Domain not set",
        "样式": "Style",
        "模拟点击": "Simulated Click",
        "模拟点击提交按钮": "Simulate clicking the submit button",
        "按钮栏高度": "Toolbar Height",
        "距页面底部": "Bottom Offset",
        "按钮栏距页面底部的间距": "Toolbar spacing from page bottom",
        "清理旧样式失败:": "Failed to clean old styles:",
        "清空": "Clear",
        "清空成功": "Clear successful",
        "清空输入框": "Clear input",
        "留空时将自动根据网址生成 Google Favicon。": "Leave blank to auto-generate a Google favicon.",
        "留空时系统将使用该网址的默认 Favicon。": "Leave blank to use the site's default favicon.",
        "留空时将根据按钮名称中的符号展示默认图标。": "Leave blank to derive the default icon from the button name.",
        "❗️ 注意：此操作无法撤销！": "❗️ Warning: This action cannot be undone!",
        "确认": "Confirm",
        "确认重置所有配置为默认设置吗？": "Reset all configurations to default?",
        "站点图标：": "Site Icon:",
        "粘贴": "Paste",
        "粘贴剪切板内容": "Paste clipboard content",
        "粘贴失败:": "Paste failed:",
        "粘贴失败，请检查浏览器权限。": "Paste failed, please check browser permissions.",
        "粘贴成功": "Paste successful",
        "网址：": "URL:",
        "网站｜网址": "Site | URL",
        "自动化": "Automation",
        "自动匹配常见的提交按钮进行点击。": "Automatically match and click common submit buttons.",
        "自动提交": "Auto Submit",
        "自动提交前检测文本匹配超时或错误:": "Auto-submit pre-check timed out or mismatched:",
        "自动提交方式:": "Auto-submit Method:",
        "自动提交方式：": "Auto-submit Method:",
        "自动提交 (在填充后自动提交内容)": "Auto submit (submit automatically after filling)",
        "自动获取站点图标": "Auto-fetch site icon",
        "自定义 CSS": "Custom CSS",
        "自定义 CSS 选择器": "Custom CSS Selector",
        "自定义 CSS：": "Custom CSS:",
        "自定义css": "Custom CSS",
        "自定义样式": "Custom Style",
        "导入配置": "Imported configuration",
        "当前配置": "Current configuration",
        "注意：导入配置将完全替换当前配置，此操作无法撤销！": "Warning: Importing configuration will completely replace the current setup and cannot be undone!",
        "确认导入": "Confirm Import",
        "按钮 \"{{buttonName}}\" 不存在于文件夹 \"{{folderName}}\" 中。": "Button \"{{buttonName}}\" does not exist in folder \"{{folderName}}\".",
        "🗑️ 按钮 \"{{buttonName}}\" 已删除。": "🗑️ Button \"{{buttonName}}\" deleted.",
        "🗑️ 确认删除按钮 \"{{buttonName}}\"？": "🗑️ Delete button \"{{buttonName}}\"?",
        "解析拖放数据失败:": "Failed to parse drag-and-drop data:",
        "解析配置文件失败:": "Failed to parse config file:",
        "解释": "Explain",
        "触发 'submit' 事件失败:": "Failed to trigger \"submit\" event:",
        "访问剪切板失败:": "Clipboard access failed:",
        "该文件夹已存在！": "Folder already exists!",
        "请输入按钮名称！": "Please enter a button name!",
        "请输入文件夹名称": "Please enter a folder name",
        "请输入有效的 CSS 选择器！": "Please enter a valid CSS selector!",
        "请输入网址和备注名称！": "Please provide the URL and label!",
        "请输入能唯一定位提交按钮的 CSS 选择器。": "Enter a CSS selector that uniquely locates the submit button.",
        "请选择有效的颜色！": "Please choose a valid color!",
        "调用JavaScript提交函数失败:": "Calling the JavaScript submit function failed:",
        "预览按钮": "Preview Button",
        "预览文件夹": "Preview Folder",
        "1️⃣ 自定义按钮外观：": "1️⃣ Custom button preview:",
        "2️⃣ 按钮对应的文本模板：": "2️⃣ Button text template:",
        "按钮背景颜色：": "Button Background Color:",
        "按钮文字颜色：": "Button Text Color:",
        "背景颜色：": "Background Color:",
        "文字颜色：": "Text Color:",
        "（删除文件夹将同时删除其中的所有自定义按钮！）": "(Deleting the folder will also remove all custom buttons inside.)",
        "1️⃣ 文件夹按钮外观：": "1️⃣ Folder button preview:",
        "2️⃣ 文件夹内，全部自定义按钮：": "2️⃣ All custom buttons in the folder:",
        "高度调整失败:": "Height adjustment failed:",
        "高度｜底部": "Height | Bottom",
        "高级选项:": "Advanced Options:",
        "默认": "Default",
        "默认方法": "Default Method",
        "默认高度": "Default Height",
        "🔄 文件夹顺序已更新：{{draggedFolder}} 移动到 {{targetFolder}} 前。": "🔄 Folder order updated: {{draggedFolder}} moved before {{targetFolder}}.",
        "🔄 按钮 \"{{buttonName}}\" 已从 \"{{sourceFolder}}\" 移动到 \"{{targetFolder}}\"。": "🔄 Button \"{{buttonName}}\" moved from \"{{sourceFolder}}\" to \"{{targetFolder}}\".",
        "🔄 按钮顺序已更新：{{buttonName}} 移动到 {{targetName}} 前。": "🔄 Button order updated: {{buttonName}} moved before {{targetName}}.",
        "（未指定网址）": "(No domain specified)",
        "（未配置自定义 CSS）": "(No custom CSS configured)",
        "🆕 新建按钮：": "🆕 New Button:",
        "🆕 新建文件夹：": "🆕 New Folder:",
        "🆕 新建新网址规则": "🆕 New Domain Rule",
        "🆕 新建自定义样式": "🆕 New Custom Style",
        "🆕 新建文件夹 \"{{folderName}}\" 已添加。": "🆕 Added new folder \"{{folderName}}\".",
        "🌓 主题模式已切换，样式已更新。": "🌓 Theme mode changed, styles updated.",
        "📋 剪贴板": "📋 Clipboard",
        "🔍 选中": "🔍 Selection",
        "🔄 输入框/剪贴板": "🔄 Input/Clipboard",
        "📊 配置对比": "📊 Configuration Comparison",
        "📑 详细差异": "📑 Detailed Differences",
        "新增文件夹": "New Folders",
        "更新文件夹": "Updated Folders",
        "删除文件夹": "Removed Folders",
        "新增按钮": "New Buttons",
        "删除按钮": "Removed Buttons",
        "变更按钮": "Modified Buttons",
        "暂无差异，导入配置的结构与当前一致。": "No differences; imported structure matches the current configuration.",
        "文件夹列表": "Folder List",
        "文件夹明细": "Folder Details",
        "请选择左侧文件夹查看详细差异。": "Select a folder on the left to view detailed differences.",
        "此预览仅供查看，不会修改任何配置。": "Preview only; no changes will be applied.",
        "📥 确认导入配置": "📥 Confirm Configuration Import",
        "📥 导入配置": "📥 Imported Configuration",
        "文本模板": "Text Template",
        "样式设置": "Style Settings",
        "提交设置": "Submit Settings",
        "🎨 样式管理": "🎨 Style Manager",
        "💾 关闭并保存": "💾 Save & Close",
        "📊 导入后计数器已更新。": "📊 Counters updated after import.",
        "📊 重置后计数器已更新。": "📊 Counters updated after reset.",
        "📤 配置已导出。": "📤 Configuration exported.",
        "📥 配置已成功导入。": "📥 Configuration imported successfully.",
        "🔄 配置已重置为默认设置。": "🔄 Configuration reset to defaults.",
        "🔎 检测到本域名匹配的自动提交规则：": "🔎 Matched automation rules for this domain:",
        "🔒 弹窗已关闭并从DOM中移除": "🔒 Dialog closed and removed from DOM",
        "🔔 DOM 发生变化，尝试重新附加按钮。": "🔔 DOM changed, attempting to reattach buttons.",
        "🔔 MutationObserver 已启动，监听 DOM 变化。": "🔔 MutationObserver started to watch DOM changes.",
        "🔧 按钮栏高度已更新为": "🔧 Toolbar height updated to",
        "🔍 扫描到 {{count}} 个 textarea 或 contenteditable 元素。": "🔍 Found {{count}} textarea or contenteditable elements.",
        "ℹ️ 未匹配到样式规则，使用默认按钮栏高度：{{height}}px": "ℹ️ No style rule matched, using default toolbar height: {{height}}px",
        "共有 {{count}} 个文件夹": "Total of {{count}} folders",
        "所有文件夹共有 {{count}} 个按钮": "All folders contain {{count}} buttons",
        "\"{{folderName}}\" 文件夹有 {{count}} 个按钮": "Folder \"{{folderName}}\" has {{count}} buttons",
        "📊 计数器已更新: {{folderCount}}个文件夹, {{buttonCount}}个按钮总数": "📊 Counters updated: {{folderCount}} folders, {{buttonCount}} buttons in total",
        "模板变量: {{variable}}": "Template variables: {{variable}}",
        "🛠️ 配置管理": "🛠️ Config Manager",
        "语言": "Language"
};

    const buildLocaleMap = () => {
        const zhTranslations = {};
        Object.keys(EN_TRANSLATIONS).forEach((source) => {
            zhTranslations[source] = source;
        });
        return {
            zh: zhTranslations,
            en: EN_TRANSLATIONS
        };
    };

    const normalizeLocale = (locale) => {
        if (!locale) {
            return 'en';
        }
        const lower = locale.toLowerCase();
        if (lower === 'zh' || lower.startsWith('zh-')) {
            return 'zh';
        }
        return 'en';
    };

    const detectBrowserLocale = () => {
        if (typeof navigator === 'undefined') {
            return 'en';
        }
        const { language, languages, userLanguage } = navigator;
        const first = Array.isArray(languages) && languages.length > 0 ? languages[0] : null;
        return normalizeLocale(first || language || userLanguage || 'en');
    };

    const translationsByLocale = buildLocaleMap();
    let cachedLocale = detectBrowserLocale();

    const applyReplacements = (text, replacements) => {
        if (!text || !replacements) {
            return text;
        }
        let result = text;
        Object.entries(replacements).forEach(([key, value]) => {
            const safeValue = value == null ? '' : String(value);
            result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), safeValue);
        });
        return result;
    };

    const translate = (sourceText, replacements, overrideLocale) => {
        const locale = normalizeLocale(overrideLocale || cachedLocale);
        const dictionaries = translationsByLocale[locale] || {};
        const translated = dictionaries[sourceText] || sourceText;
        return applyReplacements(translated, replacements);
    };

    const setLocale = (nextLocale) => {
        cachedLocale = normalizeLocale(nextLocale);
        return cachedLocale;
    };

    const CTTFLocaleConfig = {
        translate,
        detectBrowserLocale,
        setLocale,
        getLocale: () => cachedLocale,
        getTranslations: () => ({
            zh: { ...translationsByLocale.zh },
            en: { ...translationsByLocale.en }
        })
    };

    const target = typeof unsafeWindow !== 'undefined' ? unsafeWindow : global;
    target.CTTFLocaleConfig = CTTFLocaleConfig;
})(typeof window !== 'undefined' ? window : this);