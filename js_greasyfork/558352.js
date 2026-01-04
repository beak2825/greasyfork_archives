// ==UserScript==
// @name       .日期金额改色
// @namespace    http://tampermonkey.net/
// @version      2.6.3
// @description  左上角隐藏的日期金额（文章重要的两条主线）改色按钮，点击按钮后页面重加载
// @author       ChenHongJiang
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon        https://pic1.imgdb.cn/item/6946258629a616e5285f3e8c.png
// @require     https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js
// @downloadURL https://update.greasyfork.org/scripts/558352/%E6%97%A5%E6%9C%9F%E9%87%91%E9%A2%9D%E6%94%B9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/558352/%E6%97%A5%E6%9C%9F%E9%87%91%E9%A2%9D%E6%94%B9%E8%89%B2.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /****************************************
   * 1. 按钮 UI
   ****************************************/

    const btn = document.createElement("div");
    btn.textContent = "";
    btn.style.position = "fixed";
    btn.style.top = "0px";
    btn.style.left = "7px";
    btn.style.zIndex = 99999999;
    btn.style.backgroundColor = "rgba(0,0,0,0)";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "0 0 10px 10px";
    btn.style.cursor = "pointer";
    btn.style.width = "25px";
    btn.style.height = "20px";
    // 定义背景色
    const dateStyle = `#333F2A`;

    // 添加鼠标悬停事件
    btn.addEventListener("mouseenter", () => {
        btn.style.background = dateStyle; // 鼠标悬停时显示黄色
    });

    // 添加鼠标离开事件
    btn.addEventListener("mouseleave", () => {
        btn.style.background = "transparent"; // 鼠标离开时恢复透明背景
    });

    document.body.appendChild(btn);

    /****************************************
   * 2. 点击按钮触发
   ****************************************/
    btn.addEventListener("click", () => {
        localStorage.setItem("highlight_date_flag", "1");
        location.reload();
    });

    /****************************************
   * 3. 执行真正的日期高亮逻辑（只在刷新后）
   ****************************************/
    const shouldRun = localStorage.getItem("highlight_date_flag") === "1";
    if (!shouldRun) return;
    localStorage.removeItem("highlight_date_flag");

    // ⬇️ 以下是你的原始逻辑（保持不动，只封装到函数中）
    window.addEventListener("load", () => {
        runDateHighlight();
        highlightMoney();
    });


    /* 1. 建转换器（只跑一次） */
    const toTrad = OpenCC.Converter({ from: 'cn', to: 'tw' });

    /********************************************
   * 日期改色函数
   ********************************************/
    function runDateHighlight() {

        const hanNum = '(?:一|二|三|四|五|六|七|八|九|十)?(?:一|单|两|二|三|四|两|五|六|七|八|九|十)(?:多)?';
        const liangCi = '(?:亿万|万亿|千亿|百亿|十亿|千万|百万|十万|亿|万|千|百|十|个|\\+)?';
        const qmcEN = '(?:in|to|for|into|of|by|since|at|on|with|from|about|through|over|under|between|among|across|toward|towards|against|beside|before|after|except|including|like|without|year|trends)';
        const kg = '(?: |\\s*)?';
        const noNum = '(?!\\d)';

        const datePatterns = [
            // 每句都有特定不可选的项
            // 🔻 0000.00.00
            noNum + '\\d{4}' + noNum + kg + '(?:-|.|/)' + kg + noNum + '\\d{2}' + noNum + kg + '(?:-|.|/)' + kg + noNum + '\\d{2}' + noNum,

            // 🔻 0000-00-00
            '\\b\\d{4}' + kg + '-' + kg + '\\d{2}' + kg + '-' + kg + '\\d{2}\\b',

            // 🔻 00小时00分00秒
            '(截(?:至|止))?\\d+' + kg + '(?:年|小时|时)' + kg + '\\d+' + kg + '(?:月|分钟|分)' + kg + '\\d+' + kg + '(?:日|秒钟|秒)',

            // 🔻 00年00月~00月
            '\\d+' + kg + '年' + kg + '\\d+' + kg + '(?:月)?' + kg + '(?:-|~)' + kg + '\\d+月',

            // 🔻 0000年00月00日
            '\\d+' + kg + '(?:年|月)' + kg + '\\d+' + kg + '(?:月|日)',

            // 🔻 今年第一季度
            '(?:(\\d+)|(?:上个|最新|春节|连续|今|去|前|明|本)|'+ hanNum + ')' + kg + '(年)?(的)?(整个)?' + kg + '第?' + hanNum + '?个?(?:季度|多月|月份)',

            // 🔻 00-00
            '\\b' + noNum + '\\d{1,2}' + noNum + kg + '-' + kg + noNum + '\\d{1,2}' + kg + '(?=\\s|$)',

            // 🔻 截止0000年
            '(?:(截(?:至|止))|((?:前|今|明|去|后|同)年))?' + kg + '(?:(\\d+)|' + hanNum + ')' + kg + '(?:月份|月)' + kg + '(?:(\\d+)|' + hanNum + ')?' + kg + '(?:日|底|号|初|中|末)?',

            // 🔻 过去0000年-0000年
            '(?:过去|最近|未来|半年|凌晨|那|这|上|下|第)?(的)?' + kg + noNum + '(?:\\d{1,4}|' + hanNum + ')(?:财年|年)?(?:-|~|、|—|to|至|到)(?:\\d{1,4}|' + hanNum + ')' + noNum + '(?:财年|年|个月|月)?' + notEnd,

            // 🔻 大一统（第三句单位不可避）
            '(?:过去|最近|未来|半年|凌晨|那|这|上|下|中午|第|到了|到|接下来|前面|后面|进入|数|几|一战|二战|创立)?(?:的|每)?' + kg +
            '(?:7(?:x|X|×))?(?:\\d{1,4}(.\\d+)?|' + hanNum + ')' + kg + liangCi +
            '(?:周岁|周年|财年|年底|小时|分钟|月份|秒钟|毫秒|微秒|世纪|年代|月|天|周|年|秒|点|岁)' + kg +
            '(?:之前|前|来|内|中期|初期|初|中|末期|末|晚期|多|之后|后|上半叶|下半叶|开始|结束|同时|期间|中|于)?(?:之内|内)?',

            // 🔻 今天00:00
            '(?:\\b)?(?:昨天|今天)' + kg + '(?:\\d{1}' + noNum + '|\\d{2}' + noNum + ')' + kg + '(?:(:)|：)' + kg + '(?:\\d{1}' + noNum + '|\\d{2}' + noNum + ')',

            // 🔻 英文
            qmcEN + '?(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)' + kg + '[A-Za-z]' + kg + '\\d{1,2},' + kg + '\\d{4}' + kg + '(?=\\s|$)',
            qmcEN + '?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|early)' + kg + '\\d{1,2}' + kg + ',' + kg + '\\d{4}',
            qmcEN + '?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|early)' + kg + '\\d{1,2}',
            qmcEN + '?\\d{1,2}?' + kg + '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|early)' + kg + '\\d{4}',
            qmcEN + '?Q\\d+' + kg + '\\d{4}' + noNum,
            qmcEN + kg + '\\d{4}(?!.)' + noNum,
            qmcEN + '?q' + kg + '\\d+' + kg + qmcEN + kg + '\\d{4}' + noNum,
            qmcEN + '?\\d+' + kg + '(?:\\+)?' + kg + '((?:days|day|hours|hour|years|year|minutes|minute|minute|min|weeks|week|seconds|second) (?:ago|later)?)',
        ];

        /* toTrad() 把繁体版追加到原数组尾部 */
        datePatterns.push(
            ...datePatterns.map(p => toTrad(p))
        );

        const dateFormatRegex = new RegExp(datePatterns.join("|"),"gi");

        const style = `
            color: #5bae23 !important;
            text-shadow: none !important;
        `;

      const elements = document.querySelectorAll("*");

      setTimeout(() => {
          elements.forEach((el) => {
              const textNodes = getTextNodes(el);
              textNodes.forEach((node) => {
                  const matches = node.nodeValue.match(dateFormatRegex);
                  if (!matches) return;

                  for (let i = matches.length - 1; i >= 0; i--) {
                      const match = matches[i];
                      const idx = node.nodeValue.indexOf(match);
                      if (idx === -1) continue;

                      const span = document.createElement("dateColor");
                      span.style.cssText = style;
                      span.style.setProperty('-webkit-text-stroke', '0.5px currentColor');
                      span.textContent = match;

                      const range = new Range();
                      range.setStart(node, idx);
                      range.setEnd(node, idx + match.length);
                      range.deleteContents();
                      range.insertNode(span);
                  }
              });
          });
      }, 300);

      function getTextNodes(node) {
          let out = [];
          if (node.nodeType === Node.TEXT_NODE) return [node];
          for (let c of node.childNodes) {
              // 跳过我们自定义的元素，避免再次遍历里面的文本
              if (c.nodeName === 'DATECOLOR') continue;
              out.push(...getTextNodes(c));
          }
          return out;
      }
  }

    /********************************************
   * 金额改色函数
   ********************************************/
    function highlightMoney() {
        const shuLiang_Zh = '(?:亿万|万亿|千亿|百亿|十亿|亿|千万|百万|十万|块钱|千块|毛钱|分钱|万|千|百|十)(多)?';
        const country_Zh = '(?:美|港|欧|日|韩|澳大利亚|加拿大|瑞士|新西兰|新加坡|瑞典|挪威|墨西哥|南非|俄罗斯|马来西亚|阿联酋|沙特|圆|元|币)?';
        const danWei_Zh = '(?:块钱|千块|毛钱|分钱|人民币|英镑|法郎|克朗|比索|兰特|卢布|林吉特|迪拉姆|里亚尔|分钱|USD|圆|金|元|块|币|角)?';
        const hanNum = '(?:二|三|四|五|六|七|八|九|十)?(?:一|单|两|二|三|四|两|五|六|七|八|九|十)?(?:个|多)?';
        const kg = '(?:\\s)?';

        const moneyPatterns = [
            '(?:$|￥|USD|HK$|HK)?' + kg + '\\d+' + kg + '(.\\d+)?' + kg + '(?:-)?' + kg + '(?:\\d+)?' + kg + '(.\\d+)?' + hanNum + kg + shuLiang_Zh + kg + country_Zh + kg + danWei_Zh + notEnd,
            '(?:数)' + hanNum + shuLiang_Zh + kg + country_Zh + kg + danWei_Zh + notEnd,
            '(?:$|￥|USD|HK$|HK)?' + kg + '\\d+' + kg + '(?:.\\d+)?' + kg + '(?:-)?' + kg + '(?:\\d+)?' + kg + '(?:.\\d+)?' + kg + '(?:Trillion|Billion|Million)',
            '\\d+(.\\d+)?' + hanNum + kg + '(?:.\\d+)?' + kg + '(?:-)?' + kg + '(?:\\d+)?' + kg + '(?:.\\d+)?' + kg + shuLiang_Zh + notEnd,
            '(?:免费)',
        ];

        /* toTrad() 把繁体版追加到原数组尾部 */
        moneyPatterns.push(
            ...moneyPatterns.map(p => toTrad(p))
        );

        const reg = new RegExp(moneyPatterns.join("|"), "gi");
        const style = `color:#F18A00!important;`;

        const elements = document.querySelectorAll("*");

        setTimeout(() => {
            elements.forEach((el) => {
                const textNodes = getTextNodes1(el);
                textNodes.forEach((node) => {
                    if (reg.test(node.nodeValue)) {
                        const matches = node.nodeValue.match(reg);
                        for (let i = matches.length - 1; i >= 0; i--) {
                            const m = matches[i];
                            const idx = node.nodeValue.indexOf(m);
                            if (idx === -1) continue;

                            const span = document.createElement("moneyColor");
                            span.style.cssText = style;
                            span.style.setProperty('-webkit-text-stroke', '0.5px currentColor');
                            span.textContent = m;

                            const r = new Range();
                            r.setStart(node, idx);
                            r.setEnd(node, idx + m.length);
                            r.deleteContents();
                            r.insertNode(span);
                        }
                    }
                });
            });
        }, 300);

        function getTextNodes1(node) {
            let out = [];
            if (node.nodeType === Node.TEXT_NODE) return [node];
            for (let c of node.childNodes)  {
                if (c.nodeName === 'MONEYCOLOR') continue; // ② 跳过已包裹节点
                out.push(...getTextNodes1(c));
            }
            return out;
        }
    }
    const notEnd = '(?!' +
          /* ===== 人 / 群体 / 生物 ===== */
          '人|名|位|口|户|群|只|头|匹|尾|条|株|棵|苗|' +

          /* ===== 通用计数 / 抽象计量 ===== */
          '个|件|套|份|张|本|册|篇|章|节|条|款|项|批|次|回|遍|' +
          '类|型|款式|组|轮|期|段|' +

          /* ===== 交通 / 运输 ===== */
          '辆|台|架|艘|列|节|节车厢|班|航|架次|车次|趟|' +
          '里程|公里标|' +

          /* ===== 工业 / 制造 ===== */
          '部|台套|整机|主机|辅机|设备|装置|系统|模块|单元|' +
          '产线|生产线|流水线|工厂|车间|工位|工序|' +
          '零件|部件|组件|配件|备件|模组|' +

          /* ===== 军事 ===== */
          '枚|发|门|挺|弹|炮|枪|雷|波|批|' +

          /* ===== 长度 / 距离 ===== */
          '毫|厘|分米|米|十米|百米|千米|公里|' +
          '英|码|海里|' +
          '微|纳|' +

          /* ===== 面积 ===== */
          '亩|公|英|' +

          /* ===== 体积 / 容量 ===== */
          '分升|升|十升|百升|千升|平方|立方' +
          '加仑|夸脱|品脱|桶|蒲式耳|' +
          '茶匙|汤匙|杯|' +

          /* ===== 重量 / 质量 ===== */
          '分克|克|十克|百克|千克|吨|' +
          '微克|纳克|皮克|' +
          '斤|两|磅|盎司|' +

          /* ===== 能源 / 电力 ===== */
          '瓦|千瓦|兆瓦|吉瓦|' +
          '度|' +

          /* ===== 工程 / 物理 ===== */
          '牛顿|千牛|' +
          '焦|千焦|兆焦|' +
          '安|微安|' +
          '伏|千伏|万伏|' +
          '欧姆|法拉|亨利|特斯拉|韦伯|' +
          '赫兹|千赫|兆赫|吉赫|' +
          '帕|巴|千帕|兆帕|吉帕|' +
          '毫米汞柱|大气压|' +
          '磅力|盎司力|' +
          '摄氏度|开尔文|' +

          /* ===== IT / 数据 ===== */
          '比特|字节|' +
          '千字节|兆字节|吉字节|太字节|拍字节|艾字节|泽字节|尧字节|' +
          'KB|MB|GB|TB|PB|bit|bps|' +
          '像素|点|' +
          '帧|帧率|刷新率|采样率|比特率|码率|' +
          '分辨率|清晰度|画质|音质|' +
          '行|列|字段|记录|' +
          '线程|进程|核心|处理器|控制器|寄存器|缓存|内存|' +
          '硬盘|固态硬盘|机械硬盘|' +

          /* ===== 包装 / 物流 ===== */
          '箱|盒|瓶|罐|袋|包|筐|托盘|集装箱|' +
          '板|捆|扎|' +

          /* ===== 医疗 / 化学 ===== */
          '片|粒|丸|剂|支|针|贴|' +
          '毫|' +
          '摩尔|' +
          '剂量|用量|服用量|摄入量|注射量|滴剂量|' +
          '照射量|照射剂量|吸收剂量|剂量当量|有效剂量|当量剂量|' +

          /* ===== 农业 ===== */
          '亩产|单产|株距|行距|穗|' +
          '头份|' +

          /* ===== 商业 / 库存 ===== */
          '库存|存量|销量|出货量|装机量|' +
          '订单|' +

          /* ===== 等级 / 抽象 / 性能 ===== */
          '级|档|档次|阶段|层|层级|维度|指标|参数|' +
          '版本|代|代次|' +
          '功率|效率|性能|速度|加速度|角速度|角加速度|' +
          '力|力矩|冲量|动量|' +

          /* ===== 电磁 / 波动 ===== */
          '频率|周期|波长|振幅|相位|初相位|相位差|' +
          '光谱|频谱|电磁波|声波|光波|无线电波|微波|' +
          '红外线|紫外线|X射线|伽马射线|' +

          /* ===== 流体 / 环境 ===== */
          '温度|湿度|压力|压强|表压|绝压|真空度|' +
          '流量|流速|流率|风量|风速|转速|线速度|' +

          /* ===== 物性 / 材料 ===== */
          '密度|比重|浓度|' +
          '饱和度|溶解度|稀释度|纯度|杂质|混合物|纯净物|' +
          '酸碱度|pH值|硬度|碱度|酸度|氧化度|还原度|' +
          '比热容|热导率|热扩散率|热容|潜热|显热|' +
          '折射率|反射率|透射率|吸收率|发射率|' +
          '黏度|粘度|稠度|流动性|可塑性|弹性|塑性|脆性|韧性|' +
          '柔软度|刚度|挠度|断裂强度|屈服强度|极限强度|' +

          /* ===== 声学 / 光学 ===== */
          '照度|亮度|光通量|光强|色温|显色指数|' +
          '声压|声强|声功率|响度|音调|音色|分贝|' +

          /* ===== 信息 / 统计 ===== */
          '信息量|波特率|误码率|丢包率|延迟|抖动|' +
          '精度|准确度|误差|偏差|方差|标准差|' +

          /* ===== 几何 ===== */
          '角度|弧度|梯度|方位角|仰角|俯角|圆锥角|' +
          '立体角|球面度|' +

          /* ===== 质量 / 尺寸 ===== */
          '质量|重量|容量|容积|体积|面积|' +
          '长度|宽度|高度|深度|厚度|直径|半径|' +

          /* ===== 科技 / 高级对象 ===== */
          '原子|分子|离子|电子|质子|中子|夸克|粒子|波|场' +

          ')';
})();
