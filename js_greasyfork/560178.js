// ==UserScript==
// @name         Pokemon type calculator
// @version      1.0
// @description  计算属性倍率
// @namespace    https://play-pokechill.github.io/
// @author       DOUBAO-DiamondMoo
// @license      MIT
// @match        https://play-pokechill.github.io/
// @match        https://g1tyx.github.io/play-pokechill/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560178/Pokemon%20type%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/560178/Pokemon%20type%20calculator.meta.js
// ==/UserScript==


GM_addStyle(`
  #pokeTypeWindow {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 450px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 15px;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    cursor: move;
    transition: width 0.3s, height 0.3s;
  }
  #pokeTypeWindow.collapsed {
    width: 100px;
    height: 40px;
    padding: 0;
  }
  #collapseBtn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 6px 6px 0 0;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  #calcContent {
    margin-top: 40px;
    display: block;
  }
  #pokeTypeWindow.collapsed #calcContent {
    display: none;
  }
  /* 同行布局容器 */
  .typeRow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0;
  }
  .typeSelect {
    display: flex;
    align-items: center;
  }
  .typeSelect label {
    width: 80px;
    font-weight: bold;
  }
  /* 选框：宽度90px + 选中项+下拉项文字居中 */
  .typeOption {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: rgba(30,30,30,0.8);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    width: 90px;
    text-align: center;
  }
  .typeOption option {
    text-align: center;
    padding: 2px 0;
  }
  #resultArea {
    margin-top: 15px;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  #resultTitle {
    font-weight: bold;
    margin-bottom: 5px;
  }
  #resultList {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }
  .resultItem {
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }
  .typeTag {
    display: inline-block;
    width: 60px;
    text-align: center;
    padding: 2px 4px;
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
  }
  /* 倍率颜色：高倍率草绿色 #78C850 */
  .mult-high {
    color: #78C850;
    font-weight: bold;
  }
  .mult-low {
    color: #d32f2f;
    font-weight: bold;
  }
  .mult-normal {
    color: #212121;
  }
  /* 统一倍率文本宽度 */
  .mult-text {
    display: inline-block;
    width: 40px;
    text-align: left;
  }
`);

// 官方正确属性倍率表（X/Y及之后）
const typeChart = {
  "一般": { "岩石": 0.5, "钢": 0.5, "幽灵": 0 },
  "格斗": { "飞行": 0.5, "毒": 0.5, "超能力": 0.5, "虫": 0.5, "妖精": 0.5, "幽灵": 0, "岩石": 2, "钢": 2, "冰": 2, "恶": 2 },
  "飞行": { "岩石": 0.5, "钢": 0.5, "电": 0.5, "格斗": 2, "虫": 2, "草": 2 },
  "毒": { "地面": 0.5, "岩石": 0.5, "幽灵": 0.5, "毒": 0.5, "钢": 0, "草": 2, "妖精": 2 },
  "地面": { "飞行": 0, "毒": 2, "岩石": 2, "钢": 2, "火": 2, "电": 2, "草": 0.5 },
  "岩石": { "格斗": 0.5, "地面": 0.5, "钢": 0.5, "水": 0.5, "草": 0.5, "飞行": 2, "虫": 2, "火": 2, "冰": 2 },
  "虫": { "飞行": 0.5, "毒": 0.5, "幽灵": 0.5, "钢": 0.5, "火": 0.5, "格斗": 2, "草": 2, "超能力": 2, "恶": 2 },
  "幽灵": { "一般": 0, "格斗": 0, "幽灵": 2, "超能力": 2, "恶": 0.5 },
  "钢": { "岩石": 2, "冰": 2, "妖精": 2, "钢": 0.5, "火": 0.5, "水": 0.5, "电": 0.5 },
  "火": { "地面": 0.5, "岩石": 0.5, "水": 0.5, "虫": 2, "草": 2, "冰": 2, "钢": 2 },
  "水": { "地面": 2, "岩石": 2, "火": 2, "草": 0.5, "电": 0.5 },
  "草": { "飞行": 0.5, "毒": 0.5, "虫": 0.5, "钢": 0.5, "火": 0.5, "冰": 0.5, "地面": 2, "岩石": 2, "水": 2 },
  "电": { "地面": 0, "飞行": 2, "水": 2, "草": 0.5, "电": 0.5, "龙": 0.5 },
  "超能力": { "毒": 0.5, "钢": 0.5, "恶": 0, "格斗": 2, "幽灵": 2 },
  "冰": { "钢": 0.5, "火": 0.5, "水": 0.5, "冰": 0.5, "飞行": 2, "地面": 2, "草": 2, "龙": 2 },
  "龙": { "钢": 0.5, "冰": 2, "龙": 2, "妖精": 0 },
  "恶": { "格斗": 0.5, "幽灵": 2, "超能力": 2, "恶": 0.5, "妖精": 0.5 },
  "妖精": { "毒": 0.5, "钢": 0.5, "格斗": 2, "龙": 2, "恶": 2 }
};

const typeColors = {
  "一般": "#A8A878", "格斗": "#C03028", "飞行": "#A890F0", "毒": "#A040A0",
  "地面": "#E0C068", "岩石": "#B8A038", "虫": "#A8B820", "幽灵": "#705898",
  "钢": "#B8B8D0", "火": "#F08030", "水": "#6890F0", "草": "#78C850",
  "电": "#F8D030", "超能力": "#F85888", "冰": "#98D8D8", "龙": "#7038F8",
  "恶": "#705848", "妖精": "#EE99AC", "空": "#FFFFFF"
};
const allTypes = ["空", ...Object.keys(typeChart)];

function createFloatingWindow() {
  const win = document.createElement("div");
  win.id = "pokeTypeWindow";

  // 读取窗口状态，首次默认展开
  const isCollapsed = GM_getValue("windowCollapsed", false);
  if (isCollapsed) {
    win.classList.add("collapsed");
  }

  // 读取上次位置
  const lastPos = GM_getValue("pokeCalcPos", { top: 20, left: 20 });
  win.style.top = `${lastPos.top}px`;
  win.style.left = `${lastPos.left}px`;

  win.innerHTML = `
    <button id="collapseBtn">计算器</button>
    <div id="calcContent">
      <!-- 仅保留防御方属性选择 -->
      <div id="defenseCalc">
        <div class="typeRow">
          <div class="typeSelect">
            <label>属性1：</label>
            <select id="defenseType1" class="typeOption"></select>
          </div>
          <div class="typeSelect">
            <label>属性2：</label>
            <select id="defenseType2" class="typeOption"></select>
          </div>
        </div>
      </div>
      <div id="resultArea">
        <div id="resultTitle">攻击方属性→倍率：</div>
        <div id="resultList"></div>
      </div>
    </div>
  `;
  document.body.appendChild(win);

  // 填充选框 + 同步样式
  const fillSelect = (selectId) => {
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    allTypes.forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      option.style.backgroundColor = typeColors[type];
      option.style.color = type === "空" ? "#000" : "#fff";
      select.appendChild(option);
    });
    // 初始化默认值
    select.value = "空";
    select.style.backgroundColor = typeColors["空"];
    select.style.color = "#000";
    // 选择后同步样式并计算
    select.addEventListener("change", () => {
      select.style.backgroundColor = typeColors[select.value];
      select.style.color = select.value === "空" ? "#000" : "#fff";
      updateDefenseResult();
    });
  };

  // 初始化防御方选框
  fillSelect("defenseType1");
  fillSelect("defenseType2");

  // 点击折叠/展开时保存状态
  const collapseBtn = document.getElementById("collapseBtn");
  collapseBtn.addEventListener("click", () => {
    const wasCollapsed = win.classList.contains("collapsed");
    win.classList.toggle("collapsed");
    GM_setValue("windowCollapsed", !wasCollapsed);
  });

  // 位置记忆+边界判定
  let isDragging = false;
  let offsetX, offsetY;
  win.addEventListener("mousedown", (e) => {
    if (e.target === collapseBtn) return;
    isDragging = true;
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    win.style.cursor = "grabbing";
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const winWidth = win.offsetWidth;
    const winHeight = win.offsetHeight;
    const maxLeft = window.innerWidth - winWidth;
    const maxTop = window.innerHeight - winHeight;

    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;
    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  });
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      GM_setValue("pokeCalcPos", {
        top: parseInt(win.style.top),
        left: parseInt(win.style.left)
      });
    }
    isDragging = false;
    win.style.cursor = "move";
  });

  // 统一倍率格式+颜色区分
  const formatMult = (num) => {
    let text, className;
    if (num === 0) text = "0倍";
    else if (num === 0.25) text = "1/4倍";
    else if (num === 0.5) text = "1/2倍";
    else if (num === 1) text = "1倍";
    else if (num === 2) text = "2倍";
    else if (num === 4) text = "4倍";
    else text = `${num}倍`;

    if (num > 1) className = "mult-high";
    else if (num < 1) className = "mult-low";
    else className = "mult-normal";

    return `<span class="mult-text ${className}">${text}</span>`;
  };

  // 仅保留防御方→攻击方 计算逻辑
  const updateDefenseResult = () => {
    const type1 = document.getElementById("defenseType1").value;
    const type2 = document.getElementById("defenseType2").value;
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    if (type1 === "空" && type2 === "空") {
      resultList.innerHTML = "<div>请选择防御方属性</div>";
      return;
    }

    // 属性去重：重复属性只计算一次
    const uniqueDefTypes = [...new Set([type1, type2].filter(t => t !== "空"))];

    Object.keys(typeChart).forEach(atkType => {
      let totalMult = 1;
      uniqueDefTypes.forEach(defType => {
        totalMult *= typeChart[atkType][defType] !== undefined ? typeChart[atkType][defType] : 1;
      });
      resultList.innerHTML += `
        <div class="resultItem">
          <span class="typeTag" style="background:${typeColors[atkType]}">${atkType}</span>
          <span>→ ${formatMult(totalMult)}</span>
        </div>
      `;
    });
  };

  // 初始化计算
  updateDefenseResult();
}

window.addEventListener("load", createFloatingWindow);