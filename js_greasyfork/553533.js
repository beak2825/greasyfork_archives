// ==UserScript==
// @name         天下工厂数据采集器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  采集天下工厂网站的工厂信息并导出为Excel（支持自动翻页）
// @author       2dbfun@gmail.com
// @match        https://www.tianxiagongchang.com/*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553533/%E5%A4%A9%E4%B8%8B%E5%B7%A5%E5%8E%82%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553533/%E5%A4%A9%E4%B8%8B%E5%B7%A5%E5%8E%82%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 存储采集的数据
  let collectedData = [];
  let isCollecting = false;
  let shouldStop = false; // 暂停标志
  let totalCollected = 0; // 总采集数

  // 创建采集按钮
  function createCollectButton() {
      const button = document.createElement('button');
      button.id = 'collect-data-btn';
      button.textContent = '开始采集';
      button.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          padding: 12px 24px;
          background: #409EFF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      `;
      button.addEventListener('click', startCollecting);
      document.body.appendChild(button);
  }

  // 创建暂停并下载按钮
  function createStopButton() {
      const button = document.createElement('button');
      button.id = 'stop-download-btn';
      button.textContent = '暂停并下载';
      button.style.cssText = `
          position: fixed;
          top: 70px;
          right: 20px;
          z-index: 10000;
          padding: 12px 24px;
          background: #E6A23C;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
          display: none;
      `;
      button.addEventListener('click', stopAndDownload);
      document.body.appendChild(button);
  }

  // 创建实时进度面板
  function createProgressPanel() {
      const panel = document.createElement('div');
      panel.id = 'progress-panel';
      panel.style.cssText = `
          position: fixed;
          top: 120px;
          right: 20px;
          z-index: 10000;
          width: 400px;
          max-height: 600px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
          display: none;
          flex-direction: column;
      `;

      panel.innerHTML = `
          <div style="padding: 15px; border-bottom: 1px solid #eee; background: #409EFF; color: white; border-radius: 4px 4px 0 0;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px;">采集进度</h3>
              <div id="progress-stats" style="font-size: 14px; margin-bottom: 5px;">准备中...</div>
              <div id="total-stats" style="font-size: 16px; font-weight: bold; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">总采集数: 0</div>
          </div>
          <div id="progress-list" style="flex: 1; overflow-y: auto; padding: 10px; max-height: 500px;">
          </div>
      `;

      document.body.appendChild(panel);
  }

  // 更新进度统计
  function updateProgressStats(currentPage, totalPage, currentInPage, totalInPage) {
      const statsDiv = document.getElementById('progress-stats');
      if (statsDiv) {
          statsDiv.innerHTML = `
              当前页: 第 ${currentPage} 页<br>
              本页进度: ${currentInPage} / ${totalInPage} (${totalInPage > 0 ? Math.round(currentInPage/totalInPage*100) : 0}%)
          `;
      }
  }

  // 更新总采集数
  function updateTotalStats(total) {
      const totalDiv = document.getElementById('total-stats');
      if (totalDiv) {
          totalDiv.textContent = `总采集数: ${total}`;
      }
  }

  // 添加采集成功的项目到列表
  function addCollectedItem(factoryName, totalIndex, currentPage) {
      const listDiv = document.getElementById('progress-list');
      if (!listDiv) return;

      const item = document.createElement('div');
      item.style.cssText = `
          padding: 10px;
          margin-bottom: 8px;
          background: #f0f9ff;
          border-left: 3px solid #67C23A;
          border-radius: 3px;
          animation: slideIn 0.3s ease-out;
      `;

      item.innerHTML = `
          <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #67C23A; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">✓</span>
              <div style="flex: 1;">
                  <div style="font-weight: bold; color: #303133; margin-bottom: 3px;">${factoryName || '未知工厂'}</div>
                  <div style="font-size: 12px; color: #909399;">第 ${totalIndex} 条 | 第 ${currentPage} 页</div>
              </div>
          </div>
      `;

      // 添加动画样式
      if (!document.getElementById('slide-in-style')) {
          const style = document.createElement('style');
          style.id = 'slide-in-style';
          style.textContent = `
              @keyframes slideIn {
                  from {
                      opacity: 0;
                      transform: translateX(20px);
                  }
                  to {
                      opacity: 1;
                      transform: translateX(0);
                  }
              }
          `;
          document.head.appendChild(style);
      }

      listDiv.insertBefore(item, listDiv.firstChild);

      // 滚动到顶部显示最新项
      listDiv.scrollTop = 0;
  }

  // 显示/隐藏进度面板
  function showProgressPanel(show) {
      const panel = document.getElementById('progress-panel');
      if (panel) {
          panel.style.display = show ? 'flex' : 'none';
      }
  }

  // 显示/隐藏暂停按钮
  function showStopButton(show) {
      const button = document.getElementById('stop-download-btn');
      if (button) {
          button.style.display = show ? 'block' : 'none';
      }
  }

  // 清空进度列表
  function clearProgressList() {
      const listDiv = document.getElementById('progress-list');
      if (listDiv) {
          listDiv.innerHTML = '';
      }
  }

  // 暂停并下载
  function stopAndDownload() {
      if (!isCollecting) return;

      shouldStop = true;
      const button = document.getElementById('stop-download-btn');
      if (button) {
          button.textContent = '正在停止...';
          button.disabled = true;
          button.style.background = '#909399';
      }
  }

  // 更新按钮状态
  function updateButtonStatus(text, disabled = false) {
      const button = document.getElementById('collect-data-btn');
      if (button) {
          button.textContent = text;
          button.disabled = disabled;
          button.style.background = disabled ? '#909399' : '#409EFF';
      }
  }

  // 等待函数
  function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 使用XPath查找元素
  function getElementByXPath(xpath) {
      return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  // 使用XPath查找所有元素
  function getElementsByXPath(xpath) {
      const result = [];
      const nodesSnapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
          result.push(nodesSnapshot.snapshotItem(i));
      }
      return result;
  }

  // 提取文本内容
  function getTextByXPath(xpath) {
      const element = getElementByXPath(xpath);
      return element ? element.textContent.trim() : '';
  }

  // 提取包含多个<p>标签的内容并换行
  function getMultiLineTextByXPath(xpath) {
      const element = getElementByXPath(xpath);
      if (!element) return '';

      // 查找所有p标签
      const pTags = element.querySelectorAll('p');
      if (pTags.length > 0) {
          // 提取每个p标签的文本，过滤空内容，用换行符连接
          const lines = Array.from(pTags)
              .map(p => p.textContent.trim())
              .filter(text => text.length > 0);
          return lines.join('\n');
      }

      // 如果没有p标签，返回整体文本
      return element.textContent.trim();
  }

  // 采集单个工厂信息
  async function collectFactoryInfo() {
      await wait(1500); // 等待弹窗加载

      // 每次采集前创建新的空对象，确保数据不会残留
      const factoryInfo = {
          '工厂名称': '',
          '所属省市': '',
          '行业类型': '',
          '注册资金': '',
          '注册时间': '',
          '工厂地址': '',
          '经营范围': '',
          '产品或服务': '',
          '工厂老板': '',
          '手机/座机': '',
          '邮箱': ''
      };

      // 采集基本信息
      factoryInfo['工厂名称'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'工厂名称')]/../div[2]");
      factoryInfo['所属省市'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'所属省市')]/../div[2]");
      factoryInfo['行业类型'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'行业类型')]/../div[2]");
      factoryInfo['注册资金'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'注册资金')]/../div[2]");
      factoryInfo['注册时间'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'注册时间')]/../div[2]");
      factoryInfo['工厂地址'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'工厂地址')]/../div[2]");
      factoryInfo['经营范围'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'经营范围')]/../div[2]");
      factoryInfo['产品或服务'] = getTextByXPath("//div[@class='info-item-label'][contains(text(),'产品或服务')]/../div[2]");

      // 采集工厂老板信息（新增字段）
      factoryInfo['工厂老板'] = getTextByXPath("(//div[@class='info-item-label'][contains(text(),'姓名：')]/../div[2])[1]");

      // 采集多行信息（手机/座机和邮箱）
      factoryInfo['手机/座机'] = getMultiLineTextByXPath("//div[@class='info-item-label'][contains(text(),'手机/座机')]/../div[2]/span");
      factoryInfo['邮箱'] = getMultiLineTextByXPath("//div[@class='info-item-label'][contains(text(),'邮箱')]/../div[2]/span");

      console.log('采集到的信息:', factoryInfo);
      return factoryInfo;
  }

  // 关闭弹窗
  async function closePopup() {
      const closeButton = getElementByXPath("//i[@class='van-badge__wrapper van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right van-haptics-feedback']");
      if (closeButton) {
          closeButton.click();
          await wait(500);
      }
  }

  // 检查是否有下一页按钮
  function hasNextPage() {
      const nextButton = getElementByXPath("//button[@type='button'][text()='下一页'][not(@disabled)]");
      return nextButton !== null;
  }

  // 点击下一页
  async function clickNextPage() {
      const nextButton = getElementByXPath("//button[@type='button'][text()='下一页'][not(@disabled)]");
      if (nextButton) {
          console.log('点击下一页按钮');
          nextButton.click();
          await wait(2000); // 等待页面加载
          return true;
      }
      return false;
  }

  // 采集当前页面的所有工厂
  async function collectCurrentPage(pageNumber) {
      // 获取当前页所有联系按钮
      const contactButtons = getElementsByXPath("//button[@class='el-button el-button--info contact']");
      console.log(`第 ${pageNumber} 页找到 ${contactButtons.length} 个工厂`);

      if (contactButtons.length === 0) {
          console.log('当前页没有找到工厂信息');
          return 0;
      }

      // 遍历当前页的每个按钮
      for (let i = 0; i < contactButtons.length; i++) {
          // 检查是否需要暂停
          if (shouldStop) {
              console.log('用户请求暂停采集');
              return i;
          }

          updateProgressStats(pageNumber, '?', i + 1, contactButtons.length);
          console.log(`第 ${pageNumber} 页 - 正在采集第 ${i + 1}/${contactButtons.length} 个工厂`);

          // 点击联系按钮
          contactButtons[i].click();
          await wait(1000);

          // 点击展开详细信息按钮
          const expandButton = getElementByXPath("(//div[@class='info-item-centent']/button[@class='el-button el-button--text']/span)[1]");
          if (expandButton) {
              expandButton.click();
              await wait(800);
          }

          // 采集信息（每次都是全新的对象，不会残留上次数据）
          const factoryInfo = await collectFactoryInfo();
          collectedData.push(factoryInfo);
          totalCollected++;

          // 实时显示采集成功的项目
          addCollectedItem(factoryInfo['工厂名称'], totalCollected, pageNumber);
          updateTotalStats(totalCollected);

          // 关闭弹窗
          await closePopup();
          await wait(500);
      }

      return contactButtons.length;
  }

  // 开始采集流程
  async function startCollecting() {
      if (isCollecting) {
          alert('正在采集中，请勿重复点击！');
          return;
      }

      isCollecting = true;
      shouldStop = false;
      collectedData = []; // 清空之前的数据
      totalCollected = 0; // 重置总数
      clearProgressList(); // 清空进度列表

      updateButtonStatus('采集中...', true);
      showProgressPanel(true);
      showStopButton(true);
      updateTotalStats(0);

      try {
          let pageNumber = 1;
          let hasMore = true;

          // 循环采集所有页面
          while (hasMore && !shouldStop) {
              console.log(`\n========== 开始采集第 ${pageNumber} 页 ==========`);

              // 采集当前页
              const collected = await collectCurrentPage(pageNumber);

              if (shouldStop) {
                  console.log('采集已暂停');
                  break;
              }

              // 检查是否有下一页
              if (hasNextPage()) {
                  console.log('检测到下一页，准备翻页...');
                  await wait(1000);
                  const success = await clickNextPage();

                  if (success) {
                      pageNumber++;
                      await wait(1500); // 等待新页面加载完成
                  } else {
                      console.log('翻页失败，结束采集');
                      hasMore = false;
                  }
              } else {
                  console.log('没有下一页了，采集完成');
                  hasMore = false;
              }
          }

          // 导出数据
          if (collectedData.length > 0) {
              exportToExcel();

              if (shouldStop) {
                  alert(`采集已暂停！\n总共采集 ${totalCollected} 条数据\n跨越 ${pageNumber} 页\n已下载`);
              } else {
                  alert(`采集完成！\n总共采集 ${totalCollected} 条数据\n跨越 ${pageNumber} 页`);
              }
          } else {
              alert('未采集到任何数据！');
          }

      } catch (error) {
          console.error('采集过程出错:', error);
          alert('采集过程中出现错误，请查看控制台！');
      } finally {
          isCollecting = false;
          shouldStop = false;
          updateButtonStatus('开始采集', false);
          showStopButton(false);

          // 重置暂停按钮状态
          const stopBtn = document.getElementById('stop-download-btn');
          if (stopBtn) {
              stopBtn.textContent = '暂停并下载';
              stopBtn.disabled = false;
              stopBtn.style.background = '#E6A23C';
          }
      }
  }

  // 导出为Excel
  function exportToExcel() {
      if (collectedData.length === 0) {
          alert('没有数据可以导出！');
          return;
      }

      // 创建工作簿
      const wb = XLSX.utils.book_new();

      // 将数据转换为工作表
      const ws = XLSX.utils.json_to_sheet(collectedData);

      // 设置列宽
      const colWidths = [
          { wch: 30 }, // 工厂名称
          { wch: 20 }, // 所属省市
          { wch: 20 }, // 行业类型
          { wch: 15 }, // 注册资金
          { wch: 15 }, // 注册时间
          { wch: 40 }, // 工厂地址
          { wch: 50 }, // 经营范围
          { wch: 50 }, // 产品或服务
          { wch: 20 }, // 工厂老板（新增）
          { wch: 30 }, // 手机/座机
          { wch: 30 }  // 邮箱
      ];
      ws['!cols'] = colWidths;

      // 设置单元格样式，让换行符生效
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              if (!ws[cellAddress]) continue;

              // 设置单元格自动换行
              if (!ws[cellAddress].s) ws[cellAddress].s = {};
              ws[cellAddress].s.alignment = { wrapText: true, vertical: 'top' };
          }
      }

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '工厂信息');

      // 生成文件名（包含时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `天下工厂数据_${timestamp}.xlsx`;

      // 导出文件
      XLSX.writeFile(wb, filename);
      console.log(`数据已导出到 ${filename}`);
  }

  // 初始化
  function init() {
      // 等待页面加载完成
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              createCollectButton();
              createStopButton();
              createProgressPanel();
          });
      } else {
          createCollectButton();
          createStopButton();
          createProgressPanel();
      }
  }

  init();
})();