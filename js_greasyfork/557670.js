// ==UserScript==
// @name         Ones 需求助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  批量创建 Ones 子需求，简化跨团队协作流程
// @author       Pober Wong
// @match        https://ones.sankuai.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557670/Ones%20%E9%9C%80%E6%B1%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557670/Ones%20%E9%9C%80%E6%B1%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DEFAULT_CONFIG = {
    teams: [],
    subtypeId: { id: 171256, name: '产品子需求' }
  };

  function getConfig() {
    const saved = localStorage.getItem('onesBatchSubtaskConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  }

  function saveConfig(config) {
    localStorage.setItem('onesBatchSubtaskConfig', JSON.stringify(config));
  }

  let CONFIG = getConfig();

  function showToast(message, type = "success") {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
      background: ${type === "error" ? '#ff4d4f' : type === "warning" ? '#faad14' : '#52c41a'};
      color: white; padding: 12px 24px; border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10002;
      font-size: 14px; font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 创建配置面板
  function createConfigPanel() {
    if (document.getElementById('ones-batch-subtask-config-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'ones-batch-subtask-config-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 9999;
      display: none;
      width: 600px;
      min-height: 300px;
      max-height: 70vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: none;
      flex-direction: column;
    `;

    // 先添加到 DOM
    document.body.appendChild(panel);

    // 记录展开状态，新增的团队默认展开
    let expandedIndex = -1;

    function render(newlyAddedIndex = -1) {
      const teams = CONFIG.teams || [];
      // 新增团队时自动展开
      if (newlyAddedIndex >= 0) {
        expandedIndex = newlyAddedIndex;
      }
      
      panel.innerHTML = `
        <!-- 固定头部 -->
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #f0f0f0; background: white; border-radius: 12px 12px 0 0;">
          <h3 style="margin: 0; font-size: 20px; color: #333; font-weight: 600;">Ones 助手</h3>
          <button id="closeConfigPanel" style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 24px; color: #999;">×</button>
        </div>
        <!-- 可滚动内容区 -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px;">
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 14px; color: #666;">子需求类型（固定）</span>
              <span style="font-size: 14px; color: #333; font-weight: 500;">${CONFIG.subtypeId.name} (${CONFIG.subtypeId.id})</span>
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 16px; color: #333; font-weight: 500;">已配置团队 (${teams.length})</span>
              <button id="addTeamBtn" style="padding: 6px 16px; background: #0a70f5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">+ 添加团队</button>
            </div>
            <div id="teamsList" style="margin-top: 12px;">
              ${teams.length === 0 ? '<div style="text-align: center; padding: 40px; color: #999;">暂无配置，点击"添加团队"开始配置</div>' : ''}
              ${teams.map((team, i) => {
                const isExpanded = expandedIndex === i;
                return `
                <div class="team-item" data-index="${i}" style="border: 1px solid ${isExpanded ? '#0a70f5' : '#e8e8e8'}; border-radius: 8px; margin-bottom: 8px; background: ${isExpanded ? '#f0f7ff' : '#fafafa'}; overflow: hidden; transition: all 0.2s ease;">
                  <div class="team-header" data-index="${i}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; user-select: none;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: #0a70f5; font-size: 12px; transition: transform 0.2s ease; transform: rotate(${isExpanded ? '90deg' : '0deg'});">▶</span>
                      <span style="font-size: 15px; color: #333; font-weight: 500;">${team.name || '未命名团队'}</span>
                      ${team.projectId ? `<span style="font-size: 12px; color: #999; background: #f0f0f0; padding: 2px 8px; border-radius: 4px;">空间ID: ${team.projectId}</span>` : ''}
                    </div>
                    <button class="deleteTeamBtn" data-index="${i}" style="padding: 4px 12px; background: #ff4d4f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button>
                  </div>
                  <div class="team-detail" style="display: ${isExpanded ? 'block' : 'none'}; padding: 0 16px 16px 16px; border-top: 1px solid #e8e8e8;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 16px;">
                      <div>
                        <label style="display: block; margin-bottom: 6px; color: #666; font-size: 13px;">团队名称 <span style="color: #ff4d4f;">*</span></label>
                        <input type="text" class="team-name-input" data-index="${i}" value="${team.name || ''}" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                      </div>
                      <div>
                        <label style="display: block; margin-bottom: 6px; color: #666; font-size: 13px;">空间ID <span style="color: #ff4d4f;">*</span></label>
                        <input type="number" class="team-projectId-input" data-index="${i}" value="${team.projectId || ''}" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                      </div>
                      <div>
                        <label style="display: block; margin-bottom: 6px; color: #666; font-size: 13px;">名称前缀</label>
                        <input type="text" class="team-prefix-input" data-index="${i}" value="${team.namePrefix || ''}" placeholder="如：【API团队】" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                      </div>
                      <div>
                        <label style="display: block; margin-bottom: 6px; color: #666; font-size: 13px;">默认负责人</label>
                        <input type="text" class="team-assigned-input" data-index="${i}" value="${team.assigned || ''}" placeholder="misId，不填则使用当前用户" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                      </div>
                    </div>
                  </div>
                </div>
              `}).join('')}
            </div>
          </div>
        </div>
        <!-- 固定底部 -->
        <div style="flex-shrink: 0; display: flex; gap: 12px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid #f0f0f0; background: white; border-radius: 0 0 12px 12px;">
          <button id="cancelConfigBtn" style="padding: 10px 20px; background: #f5f5f5; color: #333; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">取消</button>
          <button id="saveConfigBtn" style="padding: 10px 20px; background: #0a70f5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">保存配置</button>
        </div>
      `;

      // 使用 panel.querySelector 确保找到面板内的元素
      panel.querySelector('#closeConfigPanel').onclick = () => {
        panel.style.display = 'none';
      };
      
      panel.querySelector('#cancelConfigBtn').onclick = () => {
        panel.style.display = 'none';
        CONFIG = getConfig();
        render();
      };

      panel.querySelector('#saveConfigBtn').onclick = () => {
        const items = panel.querySelectorAll('.team-item');
        const teams = [];
        let hasError = false;
        items.forEach((item, i) => {
          if (hasError) return;
          const name = item.querySelector('.team-name-input').value.trim();
          const projectId = item.querySelector('.team-projectId-input').value.trim();
          const namePrefix = item.querySelector('.team-prefix-input').value.trim();
          const assigned = item.querySelector('.team-assigned-input').value.trim();
          if (!name || !projectId) {
            showToast('团队名称和空间ID为必填项', 'error');
            hasError = true;
            return;
          }
          if (isNaN(projectId) || parseInt(projectId) <= 0) {
            showToast('空间iD必须为正整数', 'error');
            hasError = true;
            return;
          }
          teams.push({
            id: CONFIG.teams[i]?.id || 'team-' + Date.now() + '-' + i,
            name: name,
            projectId: parseInt(projectId),
            namePrefix: namePrefix,
            assigned: assigned || null
          });
        });
        if (!hasError) {
          CONFIG.teams = teams;
          saveConfig(CONFIG);
          showToast('配置已保存', 'success');
          panel.style.display = 'none';
        }
      };

      panel.querySelector('#addTeamBtn').onclick = () => {
        if (!CONFIG.teams) CONFIG.teams = [];
        CONFIG.teams.push({
          id: 'team-' + Date.now(),
          name: '',
          projectId: '',
          namePrefix: '',
          assigned: ''
        });
        render(CONFIG.teams.length - 1); // 新增团队自动展开
      };

      // 点击卡片头部展开/收起
      panel.querySelectorAll('.team-header').forEach(header => {
        header.onclick = (e) => {
          // 如果点击的是删除按钮，不触发展开
          if (e.target.classList.contains('deleteTeamBtn')) return;
          const index = parseInt(header.dataset.index);
          expandedIndex = expandedIndex === index ? -1 : index;
          render();
        };
      });

      panel.querySelectorAll('.deleteTeamBtn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation(); // 阻止冒泡到 header
          if (confirm('确定要删除这个团队配置吗？')) {
            const index = parseInt(btn.dataset.index);
            CONFIG.teams.splice(index, 1);
            // 如果删除的是当前展开的，重置展开状态
            if (expandedIndex === index) {
              expandedIndex = -1;
            } else if (expandedIndex > index) {
              expandedIndex--; // 调整索引
            }
            render();
          }
        };
      });
    }

    render();
  }

  // 创建配置按钮（可拖拽，靠近边缘时吸附变半圆）
  function createConfigButton() {
    if (document.getElementById('ones-batch-subtask-config-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'ones-batch-subtask-config-btn';
    btn.innerHTML = '⚙️';
    
    const SNAP_DISTANCE = 50; // 靠近边缘多少像素时吸附
    const BTN_SIZE = 50;
    
    // 状态：'floating' | 'left' | 'right'
    let snapState = 'right';
    let currentLeft = window.innerWidth - 40;
    let currentTop = 200;
    
    const applyStyle = () => {
      if (snapState === 'left') {
        btn.style.cssText = `
          position: fixed;
          top: ${currentTop}px;
          left: 0;
          right: auto;
          width: 40px;
          height: ${BTN_SIZE}px;
          background: #0a70f5;
          color: white;
          border-radius: 0 25px 25px 0;
          cursor: pointer;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(10, 112, 245, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          user-select: none;
          transition: all 0.3s ease;
        `;
      } else if (snapState === 'right') {
        btn.style.cssText = `
          position: fixed;
          top: ${currentTop}px;
          right: 0;
          left: auto;
          width: 40px;
          height: ${BTN_SIZE}px;
          background: #0a70f5;
          color: white;
          border-radius: 25px 0 0 25px;
          cursor: pointer;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(10, 112, 245, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          user-select: none;
          transition: all 0.3s ease;
        `;
      } else {
        // floating - 圆形
        btn.style.cssText = `
          position: fixed;
          top: ${currentTop}px;
          left: ${currentLeft}px;
          right: auto;
          width: ${BTN_SIZE}px;
          height: ${BTN_SIZE}px;
          background: #0a70f5;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(10, 112, 245, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          user-select: none;
          transition: all 0.3s ease;
        `;
      }
    };
    
    applyStyle();

    // 拖拽相关变量
    let isDragging = false;
    let hasMoved = false;
    let offsetX = 0;
    let offsetY = 0;

    // 记录按下前的状态，用于点击时恢复
    let prevSnapState = snapState;

    btn.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasMoved = false;
      prevSnapState = snapState; // 保存当前状态
      const rect = btn.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      currentLeft = rect.left;
      currentTop = rect.top;
      // 只在开始移动时才改变样式，这里先不改
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // 第一次移动时，转为圆形浮动状态
      if (!hasMoved) {
        hasMoved = true;
        snapState = 'floating';
        btn.style.transition = 'none';
        btn.style.borderRadius = '50%';
        btn.style.width = BTN_SIZE + 'px';
        btn.style.left = currentLeft + 'px';
        btn.style.right = 'auto';
      }
      
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      
      // 限制在屏幕范围内
      newLeft = Math.max(0, Math.min(window.innerWidth - BTN_SIZE, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - BTN_SIZE, newTop));
      
      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
      currentLeft = newLeft;
      currentTop = newTop;
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      if (hasMoved) {
        // 判断是否靠近边缘
        const distanceToLeft = currentLeft;
        const distanceToRight = window.innerWidth - currentLeft - BTN_SIZE;
        
        if (distanceToLeft < SNAP_DISTANCE) {
          snapState = 'left';
        } else if (distanceToRight < SNAP_DISTANCE) {
          snapState = 'right';
        } else {
          snapState = 'floating';
        }
        
        applyStyle();
      }
      // 如果没有移动（只是点击），状态保持不变，不需要处理
    });

    btn.addEventListener('mouseenter', () => {
      if (!isDragging) {
        btn.style.boxShadow = '0 6px 16px rgba(10, 112, 245, 0.6)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (!isDragging) {
        btn.style.boxShadow = '0 4px 12px rgba(10, 112, 245, 0.4)';
      }
    });

    btn.onclick = (e) => {
      if (hasMoved) {
        hasMoved = false;
        return;
      }
      const panel = document.getElementById('ones-batch-subtask-config-panel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
      }
    };

    document.body.appendChild(btn);
  }

  // 注入团队选择 UI 到新建需求弹窗
  function injectTeamSelector(modalContent) {
    // 避免重复注入
    if (modalContent.querySelector('#ones-batch-team-selector')) return;

    const teams = CONFIG.teams || [];
    if (teams.length === 0) return; // 没有配置团队则不显示

    const container = document.createElement('div');
    container.id = 'ones-batch-team-selector';
    container.style.cssText = `
      margin-top: 12px;
      margin-bottom: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
      border: 1px solid #c5deff;
      border-radius: 8px;
    `;

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="font-size: 16px;">📋</span>
        <span style="font-size: 14px; font-weight: 600; color: #333;">同步创建子需求</span>
        <span style="font-size: 12px; color: #999; margin-left: auto;">勾选后将自动在对应团队空间创建子需求</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${teams.map(team => `
          <label style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: white; border: 1px solid #d9d9d9; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; user-select: none; min-width: 0;" 
                 class="team-checkbox-label" data-team-id="${team.id}">
            <input type="checkbox" class="team-checkbox" data-team-id="${team.id}" data-project-id="${team.projectId}" data-name-prefix="${team.namePrefix || ''}" data-assigned="${team.assigned || ''}"
                   style="width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; accent-color: #0a70f5;">
            <span style="font-size: 13px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${team.namePrefix || team.name}</span>
          </label>
        `).join('')}
      </div>
    `;

    modalContent.appendChild(container);

    // 添加 hover 效果
    container.querySelectorAll('.team-checkbox-label').forEach(label => {
      const checkbox = label.querySelector('input');
      
      label.onmouseenter = () => {
        if (!checkbox.checked) {
          label.style.borderColor = '#0a70f5';
          label.style.background = '#f0f7ff';
        }
      };
      
      label.onmouseleave = () => {
        if (!checkbox.checked) {
          label.style.borderColor = '#d9d9d9';
          label.style.background = 'white';
        }
      };

      checkbox.onchange = () => {
        if (checkbox.checked) {
          label.style.borderColor = '#0a70f5';
          label.style.background = '#e6f0ff';
        } else {
          label.style.borderColor = '#d9d9d9';
          label.style.background = 'white';
        }
        // 每次勾选变化时更新缓存
        updateSelectedTeams();
      };
    });

    // 初始化时清空之前的缓存
    clearSelectedTeams();
  }

  // 缓存选中的团队（因为弹窗关闭后 DOM 会被移除）
  let pendingSelectedTeams = [];

  // 获取当前选中的团队
  function getSelectedTeams() {
    return pendingSelectedTeams;
  }

  // 从 DOM 读取并缓存选中的团队
  function updateSelectedTeams() {
    const checkboxes = document.querySelectorAll('#ones-batch-team-selector .team-checkbox:checked');
    pendingSelectedTeams = Array.from(checkboxes).map(cb => ({
      projectId: parseInt(cb.dataset.projectId),
      namePrefix: cb.dataset.namePrefix,
      assigned: cb.dataset.assigned || null
    }));
    console.log('[Ones批量子需求] 已缓存选中的团队:', pendingSelectedTeams);
  }

  // 清空缓存
  function clearSelectedTeams() {
    pendingSelectedTeams = [];
  }

  // 保存原始 fetch 引用，用于我们自己发起的请求
  const originalFetch = window.fetch.bind(window);

  // 创建单个子需求（使用原始 fetch，不会被拦截）
  async function createSubtask(parentId, parentName, team, originalRequest) {
    const subtaskName = team.namePrefix ? `${team.namePrefix}${parentName}` : parentName;
    
    const requestBody = {
      projectId: team.projectId,
      type: 'REQUIREMENT',
      parentId: parentId,
      assigned: originalRequest.assigned || team.assigned, // 始终使用父需求的负责人
      priority: originalRequest.priority || 2,
      subtypeId: CONFIG.subtypeId.id,
      name: subtaskName,
      expectTime: 0
    };

    // 使用原始 fetch，避免被我们的拦截器捕获
    const response = await originalFetch('https://ones.sankuai.com/api/proxy/fastIssue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*'
      },
      credentials: 'include',
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`创建子需求失败: ${response.status}`);
    }

    return response.json();
  }

  // 批量创建子需求
  async function createSubtasks(parentId, parentName, selectedTeams, originalRequest) {
    const results = { success: [], failed: [] };

    for (const team of selectedTeams) {
      try {
        await createSubtask(parentId, parentName, team, originalRequest);
        results.success.push(team);
      } catch (error) {
        console.error(`创建子需求失败 (projectId: ${team.projectId}):`, error);
        results.failed.push({ team, error: error.message });
      }
    }

    return results;
  }

  // 处理创建需求的响应
  function handleFastIssueResponse(responseData) {
    try {
      // 获取选中的团队
      const selectedTeams = getSelectedTeams();
      
      if (selectedTeams.length > 0) {
        // 检查是否创建成功（code 201 表示 Created）
        if (responseData.code === 201 && responseData.data?.id) {
          const parentId = responseData.data.id.value || responseData.data.id.id || responseData.data.id;
          const parentName = responseData.data.name?.value || responseData.data.name;
          const assigned = responseData.data.assigned?.value;
          const priority = responseData.data.priority?.value;
          
          console.log('[Ones批量子需求] 检测到创建需求成功');
          console.log('[Ones批量子需求] parentId:', parentId);
          console.log('[Ones批量子需求] parentName:', parentName);
          console.log('[Ones批量子需求] 选中的团队:', selectedTeams);
          
          const parentInfo = {
            assigned: assigned,
            priority: parseInt(priority) || 2
          };
          
          // 异步创建子需求
          setTimeout(async () => {
            showToast(`正在创建 ${selectedTeams.length} 个子需求...`, 'warning');
            
            const results = await createSubtasks(parentId, parentName, selectedTeams, parentInfo);
            
            if (results.failed.length === 0) {
              showToast(`成功创建 ${results.success.length} 个子需求`, 'success');
            } else if (results.success.length > 0) {
              showToast(`创建完成: ${results.success.length} 成功, ${results.failed.length} 失败`, 'warning');
            } else {
              showToast(`子需求创建失败`, 'error');
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('[Ones批量子需求] 处理响应时出错:', error);
    }
  }

  // 拦截 fetch 请求
  function interceptFetch() {
    window.fetch = async function(url, options) {
      console.log('===wangpengbo03=== hacked fetch: url', url, options);
      const response = await originalFetch.apply(this, arguments);
      
      // 检查是否是创建需求的请求
      if (url.includes('/api/proxy/fastIssue') && options?.method === 'POST') {
        console.log('[Ones批量子需求] fetch 拦截到 fastIssue 请求');
        try {
          const clonedResponse = response.clone();
          const responseData = await clonedResponse.json();
          handleFastIssueResponse(responseData);
        } catch (e) {
          console.error('[Ones批量子需求] fetch 解析响应失败:', e);
        }
      }
      
      return response;
    };
  }

  // 拦截 XMLHttpRequest
  function interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      console.log('===wangpengbo03=== hacked XHR: open', method, url, args);
      this._url = url;
      this._method = method;
      return originalOpen.apply(this, [method, url, ...args]);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
      if (this._url?.includes('/api/proxy/fastIssue') && this._method === 'POST') {
        console.log('[Ones批量子需求] XHR 拦截到 fastIssue 请求');
        
        this.addEventListener('load', function() {
          try {
            console.log('[Ones批量子需求] XHR 响应:', this.responseText);
            const responseData = JSON.parse(this.responseText);
            handleFastIssueResponse(responseData);
          } catch (e) {
            console.error('[Ones批量子需求] XHR 解析响应失败:', e);
          }
        });
      }
      
      return originalSend.apply(this, arguments);
    };
  }

  // 监听新建需求弹窗
  function observeNewWorkitemModal() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查是否是新建需求弹窗
            const modal = node.classList?.contains('quick-new-workitem-modal') 
              ? node 
              : node.querySelector?.('.quick-new-workitem-modal');
            
            if (modal) {
              // 等待弹窗内容渲染完成
              setTimeout(() => {
                const modalContent = modal.querySelector('.mtd-modal-content');
                if (modalContent) {
                  injectTeamSelector(modalContent);
                }
              }, 500);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初始化 UI（需要等 DOM 准备好）
  function initUI() {
    if (!document.body) {
      setTimeout(initUI, 100);
      return;
    }
    createConfigPanel();
    createConfigButton();
    observeNewWorkitemModal(); // 监听新建需求弹窗
  }

  // 立即拦截网络请求（在 document-start 时机执行，越早越好）
  interceptFetch();
  interceptXHR();
  console.log('[Ones批量子需求] fetch 和 XHR 拦截已安装');

  // UI 初始化等 DOM 准备好
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})();