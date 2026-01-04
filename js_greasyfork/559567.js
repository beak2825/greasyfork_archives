// ==UserScript==
// @name         WowPic 图片选择器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  WowPic网站 快速选择素材ID - 支持分组和持久化存储
// @author       chengguan
// @match        https://wowpic.com/*
// @run-at       document-start
// @icon         https://wowpic.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559567/WowPic%20%E5%9B%BE%E7%89%87%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559567/WowPic%20%E5%9B%BE%E7%89%87%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // 存储键名
  const STORAGE_KEY_GROUPS = 'wowpic_groups';
  const STORAGE_KEY_CURRENT_GROUP = 'wowpic_current_group';
  const STORAGE_KEY_COLLAPSED = 'wowpic_collapsed';
  const STORAGE_KEY_SELECT_WITHOUT_SHIFT = 'wowpic_select_without_shift';

  // 获取“无需Shift也可选中图片”开关状态
  function getSelectWithoutShiftState() {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECT_WITHOUT_SHIFT) === 'true';
    } catch (e) {
      return false;
    }
  }

  // 保存“无需Shift也可选中图片”开关状态
  function saveSelectWithoutShiftState(enabled) {
    try {
      localStorage.setItem(
        STORAGE_KEY_SELECT_WITHOUT_SHIFT,
        enabled ? 'true' : 'false',
      );
    } catch (e) {
      console.error('保存无需Shift选择开关失败:', e);
    }
  }

  // 运行时开关（避免每次点击都读localStorage）
  let selectWithoutShiftEnabled = getSelectWithoutShiftState();

  // 组管理类
  class GroupManager {
    constructor() {
      this.groups = this.loadGroups();
      this.currentGroupId = this.loadCurrentGroup();
      this.ensureDefaultGroup();
    }

    // 从localStorage加载组数据
    loadGroups() {
      try {
        const data = localStorage.getItem(STORAGE_KEY_GROUPS);
        if (data) {
          const parsed = JSON.parse(data);
          // 将数组转换为Map，ID数组转换为Set
          const groups = new Map();
          for (const [id, group] of Object.entries(parsed)) {
            groups.set(id, {
              name: group.name,
              ids: new Set(group.ids || []),
            });
          }
          return groups;
        }
      } catch (e) {
        console.error('加载组数据失败:', e);
      }
      return new Map();
    }

    // 保存组数据到localStorage
    saveGroups() {
      try {
        const data = {};
        for (const [id, group] of this.groups.entries()) {
          data[id] = {
            name: group.name,
            ids: [...group.ids],
          };
        }
        localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(data));
      } catch (e) {
        console.error('保存组数据失败:', e);
      }
    }

    // 加载当前组ID
    loadCurrentGroup() {
      try {
        return localStorage.getItem(STORAGE_KEY_CURRENT_GROUP) || null;
      } catch (e) {
        return null;
      }
    }

    // 保存当前组ID
    saveCurrentGroup() {
      try {
        if (this.currentGroupId) {
          localStorage.setItem(STORAGE_KEY_CURRENT_GROUP, this.currentGroupId);
        }
      } catch (e) {
        console.error('保存当前组失败:', e);
      }
    }

    // 确保有默认组
    ensureDefaultGroup() {
      if (this.groups.size === 0) {
        this.createGroup('默认组');
      }
      if (!this.currentGroupId || !this.groups.has(this.currentGroupId)) {
        this.currentGroupId = this.groups.keys().next().value;
        this.saveCurrentGroup();
      }
    }

    // 获取当前组的ID集合
    getCurrentGroupIds() {
      const group = this.groups.get(this.currentGroupId);
      return group ? group.ids : new Set();
    }

    // 设置当前组的ID集合
    setCurrentGroupIds(ids) {
      const group = this.groups.get(this.currentGroupId);
      if (group) {
        group.ids = ids;
        this.saveGroups();
      }
    }

    // 创建新组
    createGroup(name) {
      const id =
        'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      this.groups.set(id, {
        name: name || '默认组',
        ids: new Set(),
      });
      this.saveGroups();
      return id;
    }

    // 删除组
    deleteGroup(id) {
      if (this.groups.size <= 1) {
        return false; // 至少保留一个组
      }
      this.groups.delete(id);
      if (this.currentGroupId === id) {
        // 如果删除的是当前组，切换到第一个组
        this.currentGroupId = this.groups.keys().next().value;
        this.saveCurrentGroup();
      }
      this.saveGroups();
      return true;
    }

    // 重命名组
    renameGroup(id, newName) {
      const group = this.groups.get(id);
      if (group) {
        group.name = newName || '未命名';
        this.saveGroups();
        return true;
      }
      return false;
    }

    // 切换当前组
    switchGroup(id) {
      if (this.groups.has(id)) {
        this.currentGroupId = id;
        this.saveCurrentGroup();
        return true;
      }
      return false;
    }

    // 获取当前组名称
    getCurrentGroupName() {
      const group = this.groups.get(this.currentGroupId);
      return group ? group.name : '未知组';
    }
  }

  // 初始化组管理器
  const groupManager = new GroupManager();

  // 添加选中标记
  function toggleSelect(ele) {
    // 如果已经有选中标记，先移除
    if (ele.selectIcon) {
      ele.selectIcon.remove();
    }

    const selectIcon = document.createElement('div');
    selectIcon.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
      font-size: 120px;
      color: red;
      text-shadow: 1px 3px 2px #fff;
      pointer-events: none;
      z-index: 9;
      top: 0;
      left: 0;
      font-family: none;
    `;
    selectIcon.innerHTML = '✓';

    // 确保父元素有相对定位
    const computedStyle = window.getComputedStyle(ele);
    if (computedStyle.position === 'static') {
      ele.style.position = 'relative';
    }

    ele.appendChild(selectIcon);
    ele.selectIcon = selectIcon;
  }

  // 获取收起状态
  function getCollapsedState() {
    try {
      return localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
    } catch (e) {
      return false;
    }
  }

  // 保存收起状态
  function saveCollapsedState(collapsed) {
    try {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, collapsed ? 'true' : 'false');
    } catch (e) {
      console.error('保存收起状态失败:', e);
    }
  }

  // 获取或创建主容器
  function getMainContainer() {
    let container = document.getElementById('wowpic-main-container');
    if (!container && document.body) {
      container = document.createElement('div');
      container.id = 'wowpic-main-container';
      container.setAttribute('hidden', true);
      container.style.cssText = `
        position: fixed;
        width: 300px;
        z-index: 99999;
        top: 50px;
        left: 20px;
        background-color: rgb(255, 255, 255);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        transition: width 0.3s ease, height 0.3s ease;
      `;
      document.body.appendChild(container);
      createContainerUI(container);

      // 恢复收起状态（延迟执行，确保DOM已创建）
      setTimeout(() => {
        if (getCollapsedState()) {
          toggleCollapse(container);
        }
      }, 0);
    }
    return container;
  }

  // 切换收起/展开状态
  function toggleCollapse(container) {
    const isCollapsed = container.classList.contains('wowpic-collapsed');
    const collapsedInfo = document.getElementById('wowpic-collapsed-info');
    const headerTitle = document.getElementById('wowpic-header-title');
    const helpIcon =
      container.querySelector('#wowpic-help-icon') ||
      document.getElementById('wowpic-help-icon');

    if (isCollapsed) {
      // 展开
      container.classList.remove('wowpic-collapsed');
      container.style.width = '300px';
      container.style.borderRadius = '8px';
      const content = container.querySelector('.wowpic-content');
      if (content) {
        content.style.display = 'flex';
      }
      const header = container.querySelector('.wowpic-header');
      if (header) {
        header.style.borderRadius = '8px 8px 0 0';
      }
      // 隐藏收起信息，显示标题
      if (collapsedInfo) {
        collapsedInfo.style.display = 'none';
      }
      if (headerTitle) {
        headerTitle.style.display = 'inline';
      }
      // 帮助图标始终显示
      if (helpIcon) {
        helpIcon.style.display = 'inline-flex';
      }
    } else {
      // 收起
      container.classList.add('wowpic-collapsed');
      container.style.width = 'auto';
      container.style.borderRadius = '20px';
      const content = container.querySelector('.wowpic-content');
      if (content) {
        content.style.display = 'none';
      }
      const header = container.querySelector('.wowpic-header');
      if (header) {
        header.style.borderRadius = '20px';
      }
      // 显示收起信息，隐藏标题
      if (collapsedInfo) {
        collapsedInfo.style.display = 'inline';
      }
      if (headerTitle) {
        headerTitle.style.display = 'none';
      }
      // 帮助图标始终显示
      if (helpIcon) {
        helpIcon.style.display = 'none';
      }
      refreshCollapsedHeader();
    }

    saveCollapsedState(!isCollapsed);
  }

  // 刷新收起状态下的标题栏显示
  function refreshCollapsedHeader() {
    const collapsedInfo = document.getElementById('wowpic-collapsed-info');
    if (collapsedInfo) {
      const groupName = groupManager.getCurrentGroupName();
      const ids = groupManager.getCurrentGroupIds();
      collapsedInfo.textContent = `${groupName} (${ids.size})`;
    }
  }

  // 创建容器UI
  function createContainerUI(container) {
    // 标题栏
    const header = document.createElement('div');
    header.className = 'wowpic-header';
    header.style.cssText = `
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      transition: border-radius 0.3s ease;
    `;
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex-grow: 1; justify-content: space-between;">
        <span id="wowpic-header-title" style="font-weight: bold; white-space: nowrap;">WowPic 图片选择器</span>
        <span id="wowpic-help-icon" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 12px;
          cursor: help;
          user-select: none;
          position: relative;
        " title="">?</span>
      </div>
      <span id="wowpic-collapsed-info" style="font-size: 12px; opacity: 0.9; display: none; user-select: none; pointer-events: none;"></span>
    `;

    // 创建使用说明tooltip
    const helpTooltip = document.createElement('div');
    helpTooltip.id = 'wowpic-help-tooltip';
    helpTooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      line-height: 1.6;
      max-width: 280px;
      z-index: 100000;
      display: none;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      white-space: normal;
    `;
    helpTooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">使用说明</div>
      <div style="margin-bottom: 6px;"><strong>选择图片：</strong>按住 <kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px; font-size: 11px;">Shift</kbd> 键点击图片</div>
      <div style="margin-bottom: 6px;"><strong>展开/收起：</strong>双击标题栏</div>
      <div style="margin-bottom: 6px;"><strong>切换组：</strong>点击组名称</div>
      <div style="margin-bottom: 6px;"><strong>复制ID：</strong>点击"复制ID"按钮</div>
      <div><strong>拖拽移动：</strong>按住标题栏拖拽</div>
    `;
    document.body.appendChild(helpTooltip);

    // 绑定帮助图标hover事件（使用header.querySelector，因为元素在header中）
    const helpIcon = header.querySelector('#wowpic-help-icon');
    if (helpIcon) {
      helpIcon.addEventListener('mouseenter', (e) => {
        const iconRect = helpIcon.getBoundingClientRect();
        const tooltip = document.getElementById('wowpic-help-tooltip');
        if (!tooltip) return;

        tooltip.style.display = 'block';

        // 计算tooltip位置（在图标上方或右侧）
        const tooltipRect = tooltip.getBoundingClientRect();
        const spaceRight = window.innerWidth - iconRect.right;
        const spaceTop = iconRect.top + window.scrollY;

        if (spaceRight > 300) {
          // 右侧有足够空间，显示在右侧
          tooltip.style.left = iconRect.right + 20 + 'px';
          tooltip.style.top = iconRect.top + 'px';
          tooltip.style.transform = 'translateY(0)';
        } else if (spaceTop > tooltipRect.height) {
          // 上方有足够空间，显示在上方
          tooltip.style.left = iconRect.left + 'px';
          tooltip.style.top = iconRect.top - tooltipRect.height - 20 + 'px';
          tooltip.style.transform = 'translateX(0)';
        } else {
          // 显示在下方
          tooltip.style.left = iconRect.left + 'px';
          tooltip.style.top = iconRect.bottom + 20 + 'px';
          tooltip.style.transform = 'translateX(0)';
        }
      });

      helpIcon.addEventListener('mouseleave', () => {
        const tooltip = document.getElementById('wowpic-help-tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
        }
      });
    }

    // 组管理区域
    const groupSection = document.createElement('div');
    groupSection.style.cssText = `
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      background: #f5f5f5;
    `;

    const groupHeader = document.createElement('div');
    groupHeader.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;';
    groupHeader.innerHTML = `
      <span style="font-weight: bold; color: #333;">当前组: <span id="wowpic-current-group-name"></span></span>
      <button id="wowpic-new-group-btn" style="background: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">+ 新建组</button>
    `;

    // 组管理开关（放在分组列表区域内）
    const groupOptions = document.createElement('div');
    groupOptions.style.cssText =
      'display: flex; align-items: center; margin-bottom: 8px;';
    groupOptions.innerHTML = `
      <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 12px; color: #333;">
        <input id="wowpic-select-without-shift-toggle" type="checkbox" style="cursor: pointer;" />
        无需按 Shift 也可选中图片
      </label>
    `;

    const groupList = document.createElement('div');
    groupList.id = 'wowpic-group-list';
    groupList.style.cssText = 'max-height: 150px; overflow-y: auto;';

    groupSection.appendChild(groupHeader);
    groupSection.appendChild(groupOptions);
    groupSection.appendChild(groupList);

    // ID显示区域
    const idSection = document.createElement('div');
    idSection.style.cssText = `
      flex: 1;
      padding: 12px;
      overflow-y: auto;
    `;
    idSection.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #333;">选中的ID (<span id="wowpic-id-count">0</span>):</div>
      <textarea id="wowpic-id-list" style="word-break: break-all; padding: 10px; line-height: 1.6; color: #666; resize: vertical; width: 100%; height: 200px;" />
    `;

    // 操作按钮区域
    const actionSection = document.createElement('div');
    actionSection.style.cssText = `
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 8px;
      background: #f9f9f9;
      border-radius: 0 0 8px 8px;
    `;
    actionSection.innerHTML = `
      <button id="wowpic-copy-btn" style="flex: 1; background: #2196F3; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">复制ID</button>
      <button id="wowpic-clear-btn" style="flex: 1; background: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">清空当前组</button>
    `;

    // 内容区域（可收起）
    const content = document.createElement('div');
    content.className = 'wowpic-content';
    content.style.cssText = 'display: flex; flex-direction: column;';
    content.appendChild(groupSection);
    content.appendChild(idSection);
    content.appendChild(actionSection);

    container.appendChild(header);
    container.appendChild(content);

    // 绑定事件
    setupContainerEvents(container);
  }

  // 设置容器事件
  function setupContainerEvents(container) {
    const header = container.querySelector('.wowpic-header');

    // 双击标题栏收起/展开
    let lastClickTime = 0;
    header.addEventListener('click', (e) => {
      // 如果点击的是收起信息或帮助图标，不触发收起
      if (
        e.target.id === 'wowpic-collapsed-info' ||
        e.target.id === 'wowpic-help-icon'
      ) {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastClickTime < 300) {
        // 双击
        toggleCollapse(container);
        lastClickTime = 0;
      } else {
        lastClickTime = currentTime;
      }
    });

    // 新建组按钮
    document
      .getElementById('wowpic-new-group-btn')
      .addEventListener('click', () => {
        const name = prompt('请输入组名称:', '新组');
        if (name) {
          const newGroupId = groupManager.createGroup(name);
          groupManager.switchGroup(newGroupId);
          refreshUI();
        }
      });

    // “无需Shift也可选中图片”开关
    const selectWithoutShiftToggle = document.getElementById(
      'wowpic-select-without-shift-toggle',
    );
    if (selectWithoutShiftToggle) {
      selectWithoutShiftToggle.checked = !!selectWithoutShiftEnabled;
      selectWithoutShiftToggle.addEventListener('change', () => {
        selectWithoutShiftEnabled = !!selectWithoutShiftToggle.checked;
        saveSelectWithoutShiftState(selectWithoutShiftEnabled);
      });
    }

    // 复制ID按钮
    document.getElementById('wowpic-copy-btn').addEventListener('click', () => {
      const ids = groupManager.getCurrentGroupIds();
      const text = [...ids].join(',');
      if (text) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            alert('ID已复制到剪贴板！');
          })
          .catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('ID已复制到剪贴板！');
          });
      }
    });

    // 清空当前组按钮
    document
      .getElementById('wowpic-clear-btn')
      .addEventListener('click', () => {
        if (confirm('确定要清空当前组的所有ID吗？')) {
          groupManager.setCurrentGroupIds(new Set());
          refreshUI();
          refreshPageSelections();
        }
      });

    // 拖拽功能
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    header.addEventListener('mousedown', (e) => {
      // 如果点击的是收起信息或帮助图标，不触发拖拽
      if (
        e.target.id === 'wowpic-collapsed-info' ||
        e.target.id === 'wowpic-help-icon'
      ) {
        return;
      }
      isDragging = true;
      const rect = container.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        container.style.left = e.clientX - dragOffset.x + 'px';
        container.style.top = e.clientY - dragOffset.y + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // 刷新UI
  function refreshUI() {
    // 更新当前组名称
    const currentGroupNameEl = document.getElementById(
      'wowpic-current-group-name',
    );
    if (currentGroupNameEl) {
      currentGroupNameEl.textContent = groupManager.getCurrentGroupName();
    }

    // 更新组列表
    refreshGroupList();

    // 更新ID列表
    refreshIdList();

    // 更新收起状态下的标题栏
    refreshCollapsedHeader();
  }

  // 刷新组列表
  function refreshGroupList() {
    const groupList = document.getElementById('wowpic-group-list');
    if (!groupList) return;

    groupList.innerHTML = '';

    for (const [id, group] of groupManager.groups.entries()) {
      const groupItem = document.createElement('div');
      groupItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        margin: 2px 0;
        background: ${id === groupManager.currentGroupId ? '#e3f2fd' : 'white'};
        border: 1px solid ${
          id === groupManager.currentGroupId ? '#2196F3' : '#ddd'
        };
        border-radius: 4px;
        cursor: pointer;
      `;

      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${group.name} (${group.ids.size})`;
      nameSpan.style.cssText = 'flex: 1; cursor: pointer;';
      nameSpan.addEventListener('click', () => {
        groupManager.switchGroup(id);
        refreshUI();
        refreshPageSelections();
      });

      const actions = document.createElement('div');
      actions.style.cssText = 'display: flex; gap: 4px;';

      const renameBtn = document.createElement('button');
      renameBtn.textContent = '✎';
      renameBtn.style.cssText =
        'background: #FF9800; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
      renameBtn.title = '重命名';
      renameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('请输入新名称:', group.name);
        if (newName && newName.trim()) {
          groupManager.renameGroup(id, newName.trim());
          refreshUI();
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.cssText =
        'background: #f44336; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
      deleteBtn.title = '删除';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`确定要删除组"${group.name}"吗？`)) {
          if (groupManager.deleteGroup(id)) {
            refreshUI();
            refreshPageSelections();
          } else {
            alert('至少需要保留一个组！');
          }
        }
      });

      actions.appendChild(renameBtn);
      if (groupManager.groups.size > 1) {
        actions.appendChild(deleteBtn);
      }

      groupItem.appendChild(nameSpan);
      groupItem.appendChild(actions);
      groupList.appendChild(groupItem);
    }
  }

  // 刷新ID列表
  function refreshIdList() {
    const idList = document.getElementById('wowpic-id-list');
    const idCount = document.getElementById('wowpic-id-count');
    if (!idList || !idCount) return;

    const ids = groupManager.getCurrentGroupIds();
    idCount.textContent = ids.size;

    if (ids.size === 0) {
      idList.textContent = '(暂无选中的ID)';
      idList.style.color = '#999';
    } else {
      idList.textContent = [...ids].join(', ');
      idList.style.color = '#666';
    }
  }

  // 刷新页面上的选中标记
  function refreshPageSelections() {
    // 清除所有现有标记
    document.querySelectorAll('[data-wowpic-selected]').forEach((el) => {
      if (el.selectIcon) {
        el.selectIcon.remove();
        el.selectIcon = null;
      }
      el.removeAttribute('data-wowpic-selected');
    });

    // 重新标记当前组选中的ID
    const ids = groupManager.getCurrentGroupIds();
    if (ids.size === 0) return;

    // 查找所有匹配的链接并标记
    document.querySelectorAll('a[href*="/photo/"]').forEach((link) => {
      const match = link.href.match(/\/photo\/([a-z0-9]+)/);
      if (match && ids.has(match[1])) {
        let container = link;
        if (!link.querySelector('img')) {
          let parent = link.parentElement;
          let maxDepth = 5;
          while (parent && maxDepth > 0 && !parent.querySelector('img')) {
            parent = parent.parentElement;
            maxDepth--;
          }
          if (parent && parent.querySelector('img')) {
            container = parent;
          }
        }
        if (container && !container.selectIcon) {
          toggleSelect(container);
          container.setAttribute('data-wowpic-selected', 'true');
        }
      }
    });
  }

  // 初始化事件监听器（只添加一次）
  if (!window.wowpicListenersInitialized) {
    window.wowpicListenersInitialized = true;

    // 双击页面显示/隐藏容器（排除标题栏的双击）
    document.addEventListener('dblclick', (e) => {
      // 如果双击的是容器标题栏，不处理（标题栏有自己的双击事件）
      if (e.target.closest('.wowpic-header')) {
        return;
      }
      const container = getMainContainer();
      if (container) {
        container.toggleAttribute('hidden');
        if (!container.hasAttribute('hidden')) {
          refreshUI();
        }
      }
    });

    // 监听Shift+点击选择图片
    document.addEventListener(
      'click',
      function (e) {
        // 仅在“按住Shift”或“开启无需Shift选择”时拦截点击并进行选中
        if (!e.shiftKey && !selectWithoutShiftEnabled) {
          return;
        }

        // 查找包含图片的链接
        let link = null;
        let target = e.target;

        // 如果点击的是图片或视频，向上查找链接
        if (target.tagName === 'IMG') {
          link = target.closest('a');
        } else {
          // 如果点击的是链接本身
          link = target.closest('a');
        }

        if (link && link.href) {
          // 检查链接是否匹配图片详情页格式 /photo/{id}
          // 支持完整URL和相对路径
          const photoMatch = link.href.match(/\/photo\/([a-z0-9]+)/);
          if (photoMatch) {
            const id = photoMatch[1];
            const ids = groupManager.getCurrentGroupIds();

            // 查找图片容器（用于显示选中状态）
            // 优先使用链接本身，如果链接包含图片则使用链接
            let container = link;

            // 如果链接不包含图片，向上查找包含图片的父容器
            if (!link.querySelector('img')) {
              let parent = link.parentElement;
              let maxDepth = 5; // 限制查找深度
              while (parent && maxDepth > 0 && !parent.querySelector('img')) {
                parent = parent.parentElement;
                maxDepth--;
              }
              if (parent && parent.querySelector('img')) {
                container = parent;
              }
            }

            if (ids.has(id)) {
              // 取消选中
              ids.delete(id);
              if (container && container.selectIcon) {
                container.selectIcon.remove();
                container.selectIcon = null;
                container.removeAttribute('data-wowpic-selected');
              }
            } else {
              // 选中
              ids.add(id);
              if (container) {
                toggleSelect(container);
                container.setAttribute('data-wowpic-selected', 'true');
              }
            }

            // 保存到localStorage
            groupManager.setCurrentGroupIds(ids);

            // 更新显示
            refreshUI();
          }

          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      true, // 使用捕获阶段，确保优先处理
    );
  }

  // 初始化容器
  function init() {
    if (document.body) {
      getMainContainer();
      refreshUI();
      // 延迟刷新选中状态，等待页面内容加载
      setTimeout(() => {
        refreshPageSelections();
      }, 500);
    }
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听DOM变化，以便在SPA路由切换时重新初始化容器和选中状态
  const observer = new MutationObserver(() => {
    if (document.body && !document.getElementById('wowpic-main-container')) {
      init();
    } else if (document.body) {
      // 当新内容加载时，刷新选中状态
      const hasNewLinks =
        document.querySelectorAll('a[href*="/photo/"]').length > 0;
      if (hasNewLinks) {
        setTimeout(() => {
          refreshPageSelections();
        }, 2000);
      }
    }
  });

  // 开始观察
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    // 如果body还不存在，等待它出现
    const bodyObserver = new MutationObserver(() => {
      if (document.body) {
        init();
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        bodyObserver.disconnect();
      }
    });
    bodyObserver.observe(document.documentElement, {
      childList: true,
    });
  }
})();
