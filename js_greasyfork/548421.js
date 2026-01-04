// ==UserScript==
// @name         四川大学教室状态查询优化
// @namespace    http://tampermonkey.net/
// @version      2025-04-22
// @description  优化SCU逆天的教室状态查询页面，自动高亮显示当前时段的教室状态，优化研讨室的显示。
// @author       Joe_Ye
// @match        https://cir.scu.edu.cn/cir/*
// @icon         https://cir.scu.edu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548421/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AE%A4%E7%8A%B6%E6%80%81%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548421/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AE%A4%E7%8A%B6%E6%80%81%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const campusSchedules = [
  {
    campus: '望江、华西校区教学时间安排表',
    schedule: ['09:40', '11:40', '16:35', '18:35', '22:05'] // 每节课的下课时间
  },
  {
    campus: '江安校区教学时间表',
    schedule: ['09:55', '11:55', '16:25', '18:25', '21:55']
  },
];

//覆盖浏览器的后退按钮，改成页面刷新
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
  location.reload();
});

//判断当前是PC端还是移动端
const path = window.location.pathname;
const pageName = path.substring(path.lastIndexOf('/') + 1);
let platform = NaN
if (pageName === 'index.html') {
  platform = 'pc';
} else if (pageName === 'mobile.html') {
  platform = 'mobile';
}

// 当用户点进去页面时，触发执行
const targetNode = document.body;// 选择需要观察的目标节点
const config = { childList: true };// 配置观察选项：观察子节点的变化
const callback = (mutationsList) => {// 创建一个回调函数，当 DOM 发生变化时触发
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const firstChild = document.body.firstElementChild;
      if (firstChild && firstChild.classList.contains('sc_screen') && firstChild.classList.contains('ng-scope')) {

        //覆盖浏览器的后退按钮，改成页面刷新
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', function () {
          location.reload();
        });

        ProcessDiscussionRoomRow();
        let campus = CheckCampus();
        if (isNaN(campus) || campus < 0 || campus >= campusSchedules.length) {
          // console.log(campus);
        } else {
          // console.log('OK'+campus);
          UpdateDisplay(campus, true);
        }
      }
    }
  }
};
const observer = new MutationObserver(callback);// 创建一个 MutationObserver 实例并传入回调函数
observer.observe(targetNode, config);// 开始观察目标节点

function ProcessDiscussionRoomRow() {
  const roomElements = document.querySelectorAll('#roomName');// 获取所有 id 为 roomName 的元素
  const discussionRooms = Array.from(roomElements).filter(element => {
    return element.textContent.trim().endsWith('A');
  });// 筛选出以 "A" 结尾的元素

  if (platform === 'pc') {
    discussionRooms.forEach(discussionRoom => {
      const AItemRow = discussionRoom.closest('.item_row.ng-scope');
      let selectedRow = AItemRow.nextElementSibling;
      for (let i = 0; i < 3; i++) {//BCD行
        let cells = selectedRow.querySelector('div.row_table_ceil_inner').children;
        Array.from(cells).forEach((cell, index) => {
          let targetCells = Array.from(AItemRow.querySelector('div.row_table_ceil_inner').children);
          targetCells[index].children[0].appendChild(document.createTextNode(' '));
          targetCells[index].children[0].appendChild(cell.querySelector('div.ceil_text.ceil_text_common'));//.cloneNode(true));
        });
        let selectedRowNext = selectedRow.nextElementSibling;
        selectedRow.remove();
        selectedRow = selectedRowNext;
      }
      discussionRoom.textContent = discussionRoom.textContent.replace(/A([^A]*)$/, ' (研讨室)$1');
    });
  }
  else if (platform === 'mobile') {
    discussionRooms.forEach(discussionRoom => {
      const AItemRow = discussionRoom.closest('.item_row.ng-scope');
      let selectedRow = AItemRow;
      let cells = selectedRow.querySelector('div.row_table_ceil_inner').children;
      selectedRow = selectedRow.nextElementSibling;
      Array.from(cells).forEach((cell, index) => {
        for (let i = 0; i < 3; i++) {//BCD行
          let targetCells = Array.from(selectedRow.querySelector('div.row_table_ceil_inner').children);
          if (targetCells[index].querySelector('.ng-scope').textContent.trim() != '空') {
            cell.children[0].children[0].remove();
            cell.children[0].appendChild(targetCells[index].querySelector('div.ceil_text.ceil_text_common'));
            break;
          }
          if (index === cells.length - 1) {
            let selectedRowNext = selectedRow.nextElementSibling;
            selectedRow.remove();
            selectedRow = selectedRowNext;
          }
        };
      });
      discussionRoom.textContent = discussionRoom.textContent.replace(/A([^A]*)$/, ' 💭$1');
    });
  }
}

function CheckCampus() {
  var pageTitleElement = document.querySelector('h1.page_title');
  if (pageTitleElement && pageTitleElement.textContent.trim() === '四川大学教室状态查询') {
    // console.log(pageTitleElement.textContent.trim());
    return NaN; // 如果匹配，则不执行后续代码
  } else {
    var campus = NaN; // 初始化校区变量为 NaN
    var locationElement = document.querySelector('div.location.ng-binding');// 检查是否成功获取到元素
    if (locationElement) {// 只获取当前元素的文本内容，排除子元素内容
      var text = locationElement.childNodes[0].nodeValue.trim();

      if (text.includes('东') || text.includes('基教楼') || text === '研究生院') {
        campus = 0;//'望江校区';
      } else if (text.includes('一教') || text.includes('综合楼') || text.includes('文科楼')) {
        campus = 1;//'江安校区';
      } else if (text === '九教' || text === '十教') {
        campus = 0;//'华西校区,和望江一样';
      } else {
        return NaN;
      }
    }
    return campus;
  }
}

function UpdateDisplay(campus, InitialRun) {// 获取当前时间
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var targetChildIndex = NaN;
  var timeToGo = NaN;
  var delay = NaN;

  const currentTime = hours * 60 + minutes; // 转换为分钟数// 获取对应校区的时间表
  const schedule = campusSchedules[campus].schedule;// 遍历时间表，找到当前时间所属的时间段
  for (let i = 0; i < schedule.length; i++) {
    const [hours, minutes] = schedule[i].split(':').map(Number);
    const scheduleTime = hours * 60 + minutes; // 转换为分钟数
    timeToGo = scheduleTime - currentTime;
    if (timeToGo >= 0) {
      targetChildIndex = i + 1;
      delay = timeToGo * 60 * 1000;
        break;
    }
  }
  if (targetChildIndex != 5) {
    setTimeout(() => UpdateDisplay(campus, false), delay);
  }


  if (targetChildIndex) {
    //处理表头
    document.querySelector(".class_hd").children[targetChildIndex].style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    if (!InitialRun && targetChildIndex > 1) {
      var previousChildIndex = targetChildIndex - 1;
      document.querySelector(".class_hd").children[previousChildIndex].style.removeProperty("background-color");
    }
    // 处理表格内容
    var elements = document.querySelectorAll(".row_table_ceil_inner");// 遍历每个元素并执行操作
    elements.forEach(function (element) {// 获取父元素的父元素
      if (InitialRun) {
        const grandParent = element.parentElement?.parentElement;
        if (grandParent) {// 查找父元素的父元素下的 .row_table_ceil.row_name_wrap 元素
          const targetElements = grandParent.querySelectorAll('.row_table_ceil.row_name_wrap');// 遍历目标元素
          targetElements.forEach(element => {// 查找子元素中是否有 <div id="roomName" class="ceil_inner ng-binding">
            const roomNameElement = element.querySelector('#roomName.ceil_inner.ng-binding');

            if (roomNameElement) {// 获取 roomName 的文本内容并去除多余空格
              const roomNameText = roomNameElement.textContent.trim();// 判断内容是否以 "A3" 开头
              if (roomNameText.startsWith('A3')) {
                element.style.backgroundColor = 'rgba(134, 255, 134, 0.3)';
              }
              else if (roomNameText.startsWith('A4')) {
                element.style.backgroundColor = 'rgba(255, 147, 255, 0.3)';
              }
              else if (roomNameText.startsWith('A5')) {
                element.style.backgroundColor = 'rgba(147, 255, 255, 0.3)';
              }
            }
          });
        }
      }

      var innerElement = element.querySelector(".ceil.use.ng-scope:nth-child(" + targetChildIndex + ")");
      if (innerElement) {
        innerElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }
      if (!InitialRun && targetChildIndex > 1) {
        var previousChildIndex = targetChildIndex - 1;
        var lastInnerElement = element.querySelector(".ceil.use.ng-scope:nth-child(" + previousChildIndex + ")");
        if (lastInnerElement) {
          lastInnerElement.style.removeProperty("background-color");
        }
      }
    });
  }
}