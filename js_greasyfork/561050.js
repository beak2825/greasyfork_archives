// ==UserScript==
// @name        东南大学选课助手升级版
// @namespace   http://tampermonkey.net/
// @version     3.4.0
// @description 听说你抢不到课
// @author      june,based on july
// @license     MIT
// @match       newxk.urp.seu.edu.cn/xsxk/elective/grablessons?*
// @run-at      document-loaded
// @icon        https://s2.loli.net/2024/12/19/lngsEvZ8tfUdJzr.jpg
// @downloadURL https://update.greasyfork.org/scripts/561050/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B%E5%8D%87%E7%BA%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561050/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B%E5%8D%87%E7%BA%A7%E7%89%88.meta.js
// ==/UserScript==

(function () {
  // 版本
  let version = [3, 4, 0];

  // 请求
  let request = axios.create();

  // 提示
  let tip = grablessonsVue.$message;

  let isRunning = false;
  let shouldStop = false;

  // 所选课程
  let enrollDict = {};

  // 设置
  let settings = {};

  // 定义默认设置
  const defaultSettings = {
    token: "",
    savedCourseCodes: "",
    mode: {
      isAsync: false,
      isCyclic: true,
      cycleCount: -1, // -1表示无限循环
      enableSearch: false,
    },
    interval: {
      sync: {
        single: 300, // 同步单次间隔
        group: 1000, // 同步分组间隔
      },
      async: {
        single: 350, // 异步单次间隔
        group: 1000, // 异步分组间隔
      },
    },
    search: {
      pageSize: 20, // 每页课程数量
      pageDelay: 500, // 翻页延迟(ms)
    },
  };

  // 挂载的顶层组件
  let app = document.getElementById("xsxkapp");

  // 组件生成
  ((self) => {
    // 生成组件
    self.mount = () => {
      self.createTag();
      self.createPanel();
      self.createMask();
      self.addEnrollButton();
    };

    // 生成节点
    self.createNode = ({ tagName, text, HTML, obj, ev, children }) => {
      let node = document.createElement(tagName);
      if (obj) {
        for (let key of Object.keys(obj)) {
          node.setAttribute(key, obj[key]);
        }
      }
      if (text) {
        node.innerText = text;
      }
      if (HTML) {
        node.innerHTML = HTML;
      }
      if (ev) {
        for (let key of Object.keys(ev)) {
          node.addEventListener(key, ev[key]);
        }
      }
      if (children) {
        children.map((x) => node.appendChild(x));
      }
      return node;
    };

    // 生成打开和关闭面板的按钮
    self.createTag = () => {
      let node = self.createNode({
        tagName: "div",
        obj: {
          class: "slideMenu",
          style: `
              position: fixed;
              top: 250px;
              left:30px;width:
              40px;z-index: 1314;
          `,
        },
        children: [
          self.createNode({
            tagName: "div",
            obj: {
              class: "centre-btn item el-icon-date",
              style: `background-color: #2b2b2b`,
            },
            ev: {
              mousedown: (e) => {
                methods.drag(e, node);
              },
            },
          }),
        ],
      });
      app.appendChild(node);
    };

    // 生成面板
    self.createPanel = () => {
      app.appendChild(
        self.createNode({
          tagName: "div",
          obj: {
            id: "panel",
            style: `
              position: fixed;
              right: 0;
              top:0 ;
              z-index: 520;
              width: 350px;
              height: 100%;
              background-color: rgba(61,72,105,0.8);
              display: block;
            `,
          },
          children: [
            self.createNode({ tagName: "hr" }),
            self.createNode({
              tagName: "h1",
              text: "东大抢课脚本",
              obj: {
                style: "color: #c7e6e6; text-align: center",
              },
            }),
            self.createNode({ tagName: "hr" }),
            self.createNode({
              tagName: "input",
              obj: {
                id: "input-box",
                class: "el-input__inner",
                style: `
                  width: 96%;
                  margin-left: 2%;
                  height: 30px
                `,
                placeholder: "输入课程代码(不区分大小写)，按回车确定",
              },
              ev: {
                keydown: methods.enter,
              },
            }),
            self.createNode({
              tagName: "div",
              obj: {
                id: "list-wrap",
                style: `
                  overflow: auto;
                  margin: 10px;
                  border:1px solid white;
                  height: 75%
                `,
              },
            }),
            self.createNode({
              tagName: "button",
              obj: {
                id: "enroll-button",
                class: "el-button el-button--primary el-button--small is-round",
                style: `
                  margin: 20px;
                  position: absolute;
                  right:50%;
                  bottom:5%
                `,
              },
              text: "一键抢课",
              ev: {
                click: async () => {
                  if (shouldStop) {
                    tip({
                      type: "error",
                      message: "请稍候，正在终止上一个抢课进程",
                      duration: 1000,
                    });
                    return;
                  }
                  if (isRunning) {
                    await methods.stopEnrolling();
                  }
                  isRunning = true;
                  methods.updateUIState();
                  methods.enroll();
                },
              },
            }),
            self.createNode({
              tagName: "button",
              obj: {
                id: "settings-stop-button",
                class: `el-button el-button--${
                  isRunning ? "danger" : "info"
                } el-button--small is-round`,
                style: `
                  margin: 20px;
                  position: absolute;
                  right:20%;
                  bottom:5%
                `,
              },
              text: isRunning ? "停止抢课" : "更多设置",
              ev: {
                click: async () => {
                  if (isRunning) {
                    await methods.stopEnrolling();
                  } else {
                    document.getElementById("mask").style.display = "block";
                    self.updatePopup(settings.mode.enableSearch, settings);
                  }
                },
              },
            }),
            self.createNode({
              tagName: "div",
              obj: {
                style: `
                      margin: 20px;
                      position: absolute;
                      right:2%;
                      bottom:1%;
                      color: white;
                      float: right
                  `,
              },
              text: "ver" + version.join("."),
            }),
          ],
        })
      );
      self.reloadList();
    };

    // 生成抢课表格
    self.reloadList = () => {
      let list_wrap = document.querySelector("#panel #list-wrap");
      list_wrap.innerHTML = "";
      if (JSON.stringify(enrollDict) === "{}") {
        list_wrap.innerHTML =
          "<h3 style='text-align: center;color:lightblue;margin-top: 50%'>还未选择课程</h3>";
      } else {
        list_wrap.appendChild(
          self.createNode({
            tagName: "table",
            obj: {
              width: "100%",
              border: "1",
              style: `
                background-color: rgba(0,0,0,0);
                color: lightblue
            `,
            },
            children: [
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `
                    height: 30px;
                    background-color: #255e95
                `,
                },
                HTML: `
                <th style="text-align:center;width: 55%">课程</th>
                <th style="text-align:center;width: 15%">教师</th>
                <th style="text-align:center;width: 30%">操作</th>
              `,
              }),
              ...Object.keys(enrollDict)
                .filter(
                  (key) =>
                    enrollDict[key].courseBatch ===
                    grablessonsVue.lcParam.currentBatch.code
                )
                .map((key) => {
                  return self.createNode({
                    tagName: "tr",
                    obj: {
                      style: `height: 30px`,
                    },
                    children: [
                      self.createNode({
                        tagName: "td",
                        obj: {
                          style: `text-align: center`,
                        },
                        text: enrollDict[key].courseName,
                      }),
                      self.createNode({
                        tagName: "td",
                        obj: {
                          style: `text-align: center`,
                        },
                        text: enrollDict[key].teacherName,
                      }),
                      self.createNode({
                        tagName: "td",
                        obj: {
                          style: `text-align: center`,
                        },
                        children: [
                          self.createNode({
                            tagName: "button",
                            text: "删除",
                            obj: {
                              class: "delete-button",
                              style: `
                                color: red;
                                background: transparent;
                                border: 1px solid red;
                                border-radius: 6px;
                                text-align: center;
                                cursor: pointer;
                                text-decoration: none;
                                margin-right: 2px
                              `,
                            },
                            ev: {
                              click: () => {
                                const course = enrollDict[key];
                                delete enrollDict[key];
                                methods.saveData();
                                tip({
                                  type: "success",
                                  message: `${course.teacherName} 的 ${course.courseName} 已删除`,
                                  duration: 1000,
                                });
                                self.reloadList();
                              },
                            },
                          }),
                          self.createNode({
                            tagName: "button",
                            text: "更多",
                            obj: {
                              style: `
                                color: orange;
                                background: transparent;
                                border: 1px solid orange;
                                border-radius: 6px;
                                text-align: center;
                                cursor: pointer;
                                text-decoration: none;
                                margin-left: 2px
                              `,
                            },
                            ev: {
                              click: () => {
                                document.getElementById("mask").style.display =
                                  "block";
                                self.createPopUp(
                                  "详细信息",
                                  self.showCourseDetails(enrollDict[key])
                                );
                              },
                            },
                          }),
                        ],
                      }),
                    ],
                  });
                }),
            ],
          })
        );
      }
    };

    // 生成遮罩
    self.createMask = () => {
      let node = self.createNode({
        tagName: "div",
        obj: {
          id: "mask",
          style: `
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 2002;
              background-color: rgba(66, 66, 66, 0.6);
              display: none
          `,
        },
        ev: {
          click: () => {
            node.style.display = "none";
            document.querySelectorAll(".temp").forEach((el) => {
              if (el.parentNode) el.parentNode.removeChild(el);
            });
          },
        },
      });
      app.appendChild(node);
    };

    // 生成弹出窗
    self.createPopUp = (title, node, onConfirm, width, height, onExtend) => {
      const popupNode = self.createNode({
        tagName: "div",
        obj: {
          class: "temp",
          style: `
            position: fixed;
            left: ${width ? 50 - 0.5 * width : 30}%;
            top: ${height ? 50 - 0.5 * height : 30}%;
            width: ${width || 40}%;
            height: ${height || 40}%;
            z-index: 2021;
            background-color: white;
            border-radius: 30px;
            overflow: auto;
          `,
        },
        children: [
          self.createNode({
            tagName: "h1",
            obj: {
              style: `
                margin: 20px 0;
                width: 100%;
                text-align: center;
              `,
            },
            text: title,
          }),
          node,
          self.createNode({
            tagName: "div",
            obj: {
              style: `
                position: absolute;
                width: 80%;
                left: 10%;
                bottom: 10%;
                display: flex;
                justify-content: space-between;
                align-items: center;
              `,
            },
            children: [
              // 左侧按钮组
              self.createNode({
                tagName: "div",
                obj: {
                  style: "display: flex; gap: 10%;",
                },
                children: [
                  ...(onExtend
                    ? [
                        self.createNode({
                          tagName: "button",
                          obj: {
                            class:
                              "el-button el-button--primary el-button--large is-round",
                          },
                          text: "更多",
                          ev: { click: onExtend },
                        }),
                      ]
                    : []),
                  // 如果存在其他temp类元素,说明当前不是第一层弹窗
                  ...(document.querySelectorAll(".temp").length > 0
                    ? [
                        self.createNode({
                          tagName: "button",
                          obj: {
                            class:
                              "el-button el-button--warning el-button--large is-round",
                          },
                          text: "返回",
                          ev: {
                            click: () => {
                              // 移除当前弹窗
                              if (popupNode.parentNode) {
                                popupNode.parentNode.removeChild(popupNode);
                              }
                            },
                          },
                        }),
                      ]
                    : []),
                ],
              }),
              // 右侧确认按钮
              self.createNode({
                tagName: "button",
                obj: {
                  class:
                    "el-button el-button--default el-button--large is-round",
                },
                text: "确定",
                ev: {
                  click: () => {
                    if (onConfirm) onConfirm();
                    if (document.querySelectorAll(".temp").length > 1) {
                      if (popupNode.parentNode) {
                        popupNode.parentNode.removeChild(popupNode);
                      }
                    } else {
                      // 否则清除所有弹窗
                      document.getElementById("mask").style.display = "none";
                      document.querySelectorAll(".temp").forEach((el) => {
                        if (el.parentNode) el.parentNode.removeChild(el);
                      });
                    }
                  },
                },
              }),
            ],
          }),
        ],
        ev: {
          // 阻止默认的表单提交行为
          submit: (e) => e.preventDefault(),
          // 阻止回车冒泡
          keydown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          },
        },
      });

      app.appendChild(popupNode);
      return popupNode;
    };

    self.currentPopup = null;

    // 更新弹窗
    self.updatePopup = (enableSearch, tempSettings) => {
      // 如果存在旧弹窗，先移除
      if (self.currentPopup && self.currentPopup.parentNode) {
        self.currentPopup.parentNode.removeChild(self.currentPopup);
      }

      const mainSettings = self.showSettings(tempSettings);

      // 创建新弹窗
      self.currentPopup = self.createPopUp(
        "设置",
        mainSettings.node,
        () => {
          Object.assign(settings, mainSettings.tempSettings);
          methods.saveData();
          tip({
            type: "success",
            message: "设置已保存",
            duration: 1000,
          });
        },
        30,
        40,
        enableSearch
          ? () => {
              const searchSettings = self.showSearchSettings();
              self.createPopUp(
                "搜索设置",
                searchSettings.node,
                () => {
                  Object.assign(settings, searchSettings.tempSettings);
                  methods.saveData();
                  tip({
                    type: "success",
                    message: "设置已保存",
                    duration: 1000,
                  });
                },
                30,
                40
              );
            }
          : null
      );
    };

    // 数值输入框及其保存按钮
    self.createNumberInput = (options) => {
      const {
        value, // 初始值
        min, // 最小值
        max, // 最大值
        step, // 步进值
        style, // 样式
        onSave, // 保存回调
        updateValue, // 值更新回调(可选)
      } = options;

      let inputElement = null;
      let saveButton = null;
      let currentBaseValue = value;

      // 创建更新按钮状态的函数
      const updateSaveButton = () => {
        if (!inputElement || !saveButton) return;
        const currentValue = parseInt(inputElement.value);
        const isDifferent = currentValue !== currentBaseValue;

        saveButton.style.opacity = isDifferent ? "1" : "0.5";
        saveButton.style.cursor = isDifferent ? "pointer" : "not-allowed";
        saveButton.disabled = !isDifferent;
      };

      // 提供更新基准值的函数
      const updateBaseValue = (newValue) => {
        currentBaseValue = newValue;
        updateSaveButton();
      };

      // 创建输入框
      inputElement = self.createNode({
        tagName: "input",
        obj: {
          class: "el-input__inner",
          type: "number",
          value: value,
          min: min,
          max: max,
          step: step,
          style:
            style ||
            "width: 40%; margin-left: 2%; margin-right: 2%; height: 30px",
        },
        ev: {
          input: updateSaveButton,
          wheel: (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -parseInt(step) : parseInt(step);
            const newValue = Math.max(
              parseInt(min),
              Math.min(parseInt(max), parseInt(e.target.value) + delta)
            );
            e.target.value = newValue;
            updateSaveButton();
            if (updateValue) updateValue(newValue);
          },
          keydown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveButton.click();
            } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const delta =
                e.key === "ArrowUp" ? parseInt(step) : -parseInt(step);
              const newValue = Math.max(
                parseInt(min),
                Math.min(parseInt(max), parseInt(e.target.value) + delta)
              );
              e.target.value = newValue;
              updateSaveButton();
              if (updateValue) updateValue(newValue);
            }
          },
        },
      });

      // 创建保存按钮
      saveButton = self.createNode({
        tagName: "button",
        obj: {
          class: "el-button el-button--primary el-button--small",
          style: "opacity: 0.5; cursor: not-allowed",
          disabled: true,
        },
        text: "应用",
        ev: {
          click: () => {
            onSave(parseInt(inputElement.value));
            saveButton.style.opacity = "0.5";
            saveButton.style.cursor = "not-allowed";
            saveButton.disabled = true;
          },
        },
      });

      return {
        input: inputElement,
        button: saveButton,
        updateSaveButton: updateSaveButton,
        updateBaseValue: updateBaseValue,
      };
    };

    // 设置
    self.showSettings = (tempSettings) => {
      tempSettings = tempSettings
        ? tempSettings
        : JSON.parse(JSON.stringify(settings));

      const intervalInput = self.createNumberInput({
        value: methods.getCurrentInterval(tempSettings),
        min: tempSettings.mode.isGrouped ? "1000" : "100",
        max: tempSettings.mode.isGrouped ? "2000" : "1000",
        step: "25",
        onSave: (value) => {
          const mode = tempSettings.mode.isAsync ? "async" : "sync";
          const type = tempSettings.mode.isGrouped ? "group" : "single";
          tempSettings.interval[mode][type] = value;
        },
      });

      const settingsNode = self.createNode({
        tagName: "div",
        obj: {
          style: "margin-left: 10%",
        },
        children: [
          // 抢课方式选择
          self.createNode({
            tagName: "div",
            obj: {
              style: "margin-bottom: 5%",
            },
            children: [
              self.createNode({
                tagName: "label",
                text: "抢课方式：",
                obj: {
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "cycle-mode",
                  id: "single-cycle",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isCyclic = !e.target.checked;
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 单次抢课",
                obj: {
                  for: "single-cycle",
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "cycle-mode",
                  id: "multi-cycle",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isCyclic = e.target.checked;
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 循环抢课",
                obj: {
                  for: "multi-cycle",
                },
              }),
            ],
          }),
          // 发送模式选择
          self.createNode({
            tagName: "div",
            obj: {
              style: "margin-bottom: 5%",
            },
            children: [
              self.createNode({
                tagName: "label",
                text: "发送模式：",
                obj: {
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "send-mode",
                  id: "sync-mode",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isAsync = !e.target.checked;
                    const newValue = methods.getCurrentInterval(tempSettings);
                    intervalInput.input.value = newValue;
                    intervalInput.updateBaseValue(newValue); // 更新基准值
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 同步模式",
                obj: {
                  for: "sync-mode",
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "send-mode",
                  id: "async-mode",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isAsync = e.target.checked;
                    const newValue = methods.getCurrentInterval(tempSettings);
                    intervalInput.input.value = newValue;
                    intervalInput.updateBaseValue(newValue); // 更新基准值
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 异步模式",
                obj: {
                  for: "async-mode",
                },
              }),
            ],
          }),
          // 发送方式选择
          self.createNode({
            tagName: "div",
            obj: {
              style: "margin-bottom: 5%",
            },
            children: [
              self.createNode({
                tagName: "label",
                text: "发送方式：",
                obj: {
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "group-mode",
                  id: "single-send",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isGrouped = !e.target.checked;
                    const newValue = methods.getCurrentInterval(tempSettings);
                    intervalInput.input.value = newValue;
                    intervalInput.updateBaseValue(newValue); // 更新基准值
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 单个发送",
                obj: {
                  for: "single-send",
                  style: "margin-right: 10%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "radio",
                  name: "group-mode",
                  id: "group-send",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.isGrouped = e.target.checked;
                    const newValue = methods.getCurrentInterval(tempSettings);
                    intervalInput.input.value = newValue;
                    intervalInput.updateBaseValue(newValue); // 更新基准值
                  },
                },
              }),
              self.createNode({
                tagName: "label",
                text: " 分组发送",
                obj: {
                  for: "group-send",
                },
              }),
            ],
          }),
          // 时间间隔设置
          self.createNode({
            tagName: "div",
            obj: {
              style: "display: flex; align-items: center",
            },
            children: [
              self.createNode({
                tagName: "label",
                text: "时间间隔(ms)：",
                obj: {
                  style: "margin-right: 10px",
                },
              }),
              intervalInput.input,
              intervalInput.button,
            ],
          }),
          // 搜索功能启用开关
          self.createNode({
            tagName: "div",
            obj: {
              style: "margin-top: 5%",
            },
            children: [
              self.createNode({
                tagName: "label",
                text: "启用搜索功能：",
                obj: {
                  style: "margin-right: 5%",
                },
              }),
              self.createNode({
                tagName: "input",
                obj: {
                  type: "checkbox",
                  id: "enable-search",
                },
                ev: {
                  change: (e) => {
                    tempSettings.mode.enableSearch = e.target.checked;
                    self.updatePopup(e.target.checked, tempSettings);
                  },
                },
              }),
            ],
          }),
        ],
      });

      // 创建完成后进行初始化
      setTimeout(() => {
        // 获取所有需要初始化的单选按钮
        const singleCycleInput = settingsNode.querySelector("#single-cycle");
        const multiCycleInput = settingsNode.querySelector("#multi-cycle");
        const syncModeInput = settingsNode.querySelector("#sync-mode");
        const asyncModeInput = settingsNode.querySelector("#async-mode");
        const singleSendInput = settingsNode.querySelector("#single-send");
        const groupSendInput = settingsNode.querySelector("#group-send");
        const enableSearchInput = settingsNode.querySelector("#enable-search");

        // 根据设置初始化抢课方式
        if (tempSettings.mode.isCyclic) {
          multiCycleInput.checked = true;
        } else {
          singleCycleInput.checked = true;
        }

        // 根据设置初始化发送模式
        if (tempSettings.mode.isAsync) {
          asyncModeInput.checked = true;
        } else {
          syncModeInput.checked = true;
        }

        // 根据设置初始化发送方式
        if (tempSettings.mode.isGrouped) {
          groupSendInput.checked = true;
        } else {
          singleSendInput.checked = true;
        }

        // 根据设置初始化搜索功能开关
        if (tempSettings.mode.enableSearch) {
          enableSearchInput.checked = true;
        }
      }, 0);

      return {
        node: settingsNode,
        tempSettings: tempSettings,
      };
    };

    // 搜索设置
    self.showSearchSettings = () => {
      // 创建临时设置对象和引用变量
      const tempSettings = JSON.parse(JSON.stringify(settings));

      const pageSizeInput = self.createNumberInput({
        value: tempSettings.search.pageSize,
        min: "10",
        max: "100",
        step: "10",
        onSave: (value) => {
          tempSettings.search.pageSize = value;
        },
      });

      const pageDelayInput = self.createNumberInput({
        value: tempSettings.search.pageDelay,
        min: "100",
        max: "2000",
        step: "100",
        onSave: (value) => {
          tempSettings.search.pageDelay = value;
        },
      });

      const settingsNode = self.createNode({
        tagName: "div",
        obj: { style: "margin: 10%" },
        children: [
          // 每页数量设置
          self.createNode({
            tagName: "div",
            obj: { style: "margin-bottom: 5%" },
            children: [
              self.createNode({
                tagName: "label",
                text: "每页数量：",
                obj: { style: "margin-right: 10%" },
              }),
              pageSizeInput.input,
              pageSizeInput.button,
            ],
          }),
          // 翻页延迟设置
          self.createNode({
            tagName: "div",
            obj: { style: "margin-bottom: 5%" },
            children: [
              self.createNode({
                tagName: "label",
                text: "翻页延迟：",
                obj: { style: "margin-right: 10%" },
              }),
              pageDelayInput.input,
              pageDelayInput.button,
            ],
          }),
        ],
      });

      return {
        node: settingsNode,
        tempSettings: tempSettings,
      };
    };

    // 生成课程详情信息
    self.showCourseDetails = (course) => {
      return self.createNode({
        tagName: "div",
        obj: {
          style: `margin:5%`,
        },
        children: [
          self.createNode({
            tagName: "table",
            obj: {
              width: "80%",
              border: "1",
              style: `
            background-color: rgba(0,0,0,0);
            color: black;
            margin: 0 auto;
          `,
            },
            children: [
              // 表头
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `
                height: 30px;
                background-color: #255e95;
                color: lightblue;
              `,
                },
                HTML: `
              <th style="text-align:center;width: 30%">属性</th>
              <th style="text-align:center;width: 70%">值</th>
            `,
              }),
              // 课程号和课程名
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `height: 30px`,
                },
                children: [
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: "课程信息",
                  }),
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: `${course.courseName}`,
                  }),
                ],
              }),
              // 学院和教师
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `height: 30px`,
                },
                children: [
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: "开课单位/教师",
                  }),
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: `${course.department} ${course.teacherName}`,
                  }),
                ],
              }),
              // 授课地点
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `height: 30px`,
                },
                children: [
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: "授课地点",
                  }),
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: course.location || "待定",
                  }),
                ],
              }),
              // 课程性质和类别
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `height: 30px`,
                },
                children: [
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: "课程属性",
                  }),
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: `${course.courseNature} ${course.courseCategory}`,
                  }),
                ],
              }),
              // 选课人数
              self.createNode({
                tagName: "tr",
                obj: {
                  style: `height: 30px`,
                },
                children: [
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: "选课人数",
                  }),
                  self.createNode({
                    tagName: "td",
                    obj: { style: `text-align: center` },
                    text: `${course.selectedCount}/${course.totalCapacity}`,
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    };

    //生成抢课按钮
    self.addEnrollButton = () => {
      // 监听课程块的点击事件
      document.addEventListener("click", function (event) {
        const target = event.target;
        const trElement = target.closest("tr.el-table__row");
        if (trElement && trElement.classList.contains("expanded")) {
          setTimeout(() => {
            const expandedRow = trElement.nextElementSibling;
            const expandedCell = expandedRow.querySelector(
              "td.el-table__expanded-cell"
            );
            if (!expandedCell) {
              console.error("未找到 expandedCell");
              return;
            }

            // 获取课程编码
            const courseCode = trElement.querySelector("td span").innerText;
            // 获取课程名称
            const courseName = trElement.querySelector(
              "td:nth-child(2) span"
            ).innerText;

            // 获取 expandedCell 内的所有“选择”按钮
            const selectButtons = Array.from(
              expandedCell.querySelectorAll(
                "button.el-button--primary.el-button--mini.is-round span"
              )
            ).filter((span) => span.innerText.includes("选择"));

            selectButtons.forEach((selectButton) => {
              // 创建“添加”按钮
              const addButton = document.createElement("button");
              addButton.className =
                "el-button el-button--primary el-button--mini is-round add-course-button";
              addButton.innerHTML = "<span>添加</span>";

              // 存储课程编码到按钮属性中
              addButton.setAttribute("data-course-code", courseCode);
              addButton.setAttribute("data-course-name", courseName);

              // 设置按钮的禁用状态
              if (isRunning) {
                addButton.disabled = true;
                addButton.style.cursor = "not-allowed";
                addButton.style.opacity = "0.5";
              }

              // 在“选择”按钮后插入“添加”按钮
              selectButton.parentElement.parentElement.appendChild(addButton);

              // 添加点击事件
              addButton.addEventListener("click", function () {
                // 获取课程班编号
                const classRow = selectButton.closest(".el-card__body");
                if (!classRow) {
                  console.error("未找到 classRow");
                  return;
                }
                const sequenceInfo = classRow
                  .querySelector(".one-row span")
                  .innerText.replace("[", "");

                // 获取存储的课程编码
                const storedCourseCode =
                  addButton.getAttribute("data-course-code");

                // 拼接课程编码与课程班编号
                const courseString = storedCourseCode + sequenceInfo;

                // 使用 addSingleCourse 函数添加课程
                methods.addSingleCourse(courseString);
              });
            });
          }, 100); // 增加延迟时间以确保详情块已插入
        }
      });
    };
  })((window.Components = window.Components || {}));

  let methods = {
    // 初始化函数
    async init() {
      // 初始化设置为默认值的深拷贝
      settings = JSON.parse(JSON.stringify(defaultSettings));

      let raw = JSON.parse(localStorage.getItem("july"));
      if (raw) {
        // 循环检查 sessionStorage.token 直到其不为 undefined
        while (typeof sessionStorage.token === "undefined") {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // 递归合并设置
        const mergeSettings = (target, source) => {
          Object.keys(target).forEach((key) => {
            if (source[key] !== undefined) {
              if (
                typeof target[key] === "object" &&
                !Array.isArray(target[key])
              ) {
                mergeSettings(target[key], source[key]);
              } else {
                target[key] = source[key];
              }
            }
          });
        };

        if (raw.settings) {
          mergeSettings(settings, raw.settings);
        }

        // 检查token匹配
        if (settings.token === sessionStorage.token) {
          enrollDict = raw.enrollDict;
        } else if (raw.enrollDict && JSON.stringify(raw.enrollDict) !== "{}") {
          const courseCodes = Object.keys(raw.enrollDict);
          const inputBox = document.getElementById("input-box");
          inputBox.value = courseCodes.join(" ");

          if (settings.mode.enableSearch) {
            tip({
              type: "warning",
              message: "token失效，尝试重新添加课程",
              duration: 2000,
            });

            enrollDict = {};

            // 课程类型中文映射
            const typeNames = {
              TJKC: "推荐课程",
              FANKC: "方案内课程",
              FAWKC: "方案外课程",
              TYKC: "体育项目",
              XGKC: "通选课",
            };

            // 尝试在不同类型中查找课程
            const types = ["TJKC", "FANKC", "FAWKC", "TYKC", "XGKC"];
            let remainingCodes = courseCodes;

            const pageSize = settings.search.pageSize;

            for (let type of types) {
              if (!remainingCodes.length) break;
              let pageNumber = 1;
              while (true) {
                if (!remainingCodes.length) break;
                await new Promise((resolve) =>
                  setTimeout(resolve, settings.search.pageDelay)
                );
                const { courseList, total } = await methods.searchCourse(
                  type,
                  pageNumber,
                  pageSize
                );

                if (!courseList.length) break;

                // 每页获取后立即尝试添加
                if (courseList.length > 0) {
                  remainingCodes = methods.addEnrollDict(
                    remainingCodes.join(" "),
                    type,
                    courseList,
                    false
                  );
                }
                inputBox.value = remainingCodes.join(" ");

                tip({
                  type: "success",
                  message: `已获取 ${typeNames[type]} 第 ${pageNumber} 页，剩余未找到课程：${remainingCodes.length}门`,
                  duration: 2000,
                });

                if (pageNumber * pageSize >= total) break;

                pageNumber++;
              }
            }

            if (remainingCodes.length > 0) {
              tip({
                type: "warning",
                message: `以下课程未找到：${remainingCodes}`,
                duration: 2000,
              });
            }

            settings.savedCourseCodes = remainingCodes.join(" ");
          } else {
            // 未启用搜索功能时的处理逻辑
            const codeStr = courseCodes.join(" ");
            inputBox.value = codeStr;
            settings.savedCourseCodes = codeStr;

            tip({
              type: "warning",
              message: "登录信息发生变动，已清空抢课列表",
              duration: 1000,
            });

            enrollDict = {};
          }
        }
      }

      // 更新token
      settings.token = sessionStorage.token;

      // 初始化状态
      isRunning = false;
      shouldStop = false;

      // 更新UI
      methods.updateUIState();
      window.Components.reloadList();

      // 保存清理后的数据
      methods.saveData();
    },
    // 保存数据到本地存储
    saveData() {
      localStorage.setItem("july", JSON.stringify({ enrollDict, settings }));
    },
    //处理按钮拖动与点击
    drag(e, node) {
      let is_move = false;
      let x = e.pageX - node.offsetLeft;
      let y = e.pageY - node.offsetTop;
      document.onmousemove = function (e) {
        node.style.left = e.pageX - x + "px";
        node.style.top = e.pageY - y + "px";
        is_move = true;
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
        if (!is_move) {
          let panel = document.getElementById("panel");
          panel.style.display === "block"
            ? (panel.style.display = "none")
            : (panel.style.display = "block");
        }
        is_move = false;
      };
    },
    // 更新UI状态（禁用/启用按钮）
    updateUIState() {
      const inputBox = document.getElementById("input-box");
      const settingsStopButton = document.getElementById(
        "settings-stop-button"
      );
      const listWrap = document.getElementById("list-wrap");

      if (isRunning) {
        // 禁用输入和编辑功能
        inputBox.disabled = true;
        inputBox.style.cursor = "not-allowed";
        inputBox.style.opacity = "0.5";

        // 更新设置/停止按钮为停止状态
        settingsStopButton.className =
          "el-button el-button--danger el-button--small is-round";
        settingsStopButton.textContent = "停止抢课";
        settingsStopButton.style.cursor = "pointer";
        settingsStopButton.style.opacity = "1";

        // 禁用表格中的删除键
        listWrap.querySelectorAll("button.delete-button").forEach((button) => {
          button.disabled = true;
          button.style.cursor = "not-allowed";
          button.style.opacity = "0.5";
        });

        // 禁用添加课程按钮
        document
          .querySelectorAll("button.add-course-button")
          .forEach((button) => {
            button.disabled = true;
            button.style.cursor = "not-allowed";
            button.style.opacity = "0.5";
          });
      } else {
        // 启用输入和编辑功能
        inputBox.disabled = false;
        inputBox.style.cursor = "auto";
        inputBox.style.opacity = "1";

        // 更新设置/停止按钮为设置状态
        settingsStopButton.className =
          "el-button el-button--info el-button--small is-round";
        settingsStopButton.textContent = "扩展设置";
        settingsStopButton.style.cursor = "pointer";
        settingsStopButton.style.opacity = "1";

        // 启用表格中的删除键
        listWrap.querySelectorAll("button.delete-button").forEach((button) => {
          button.disabled = false;
          button.style.cursor = "pointer";
          button.style.opacity = "1";
        });

        // 启用添加课程按钮
        document
          .querySelectorAll("button.add-course-button")
          .forEach((button) => {
            button.disabled = false;
            button.style.cursor = "pointer";
            button.style.opacity = "1";
          });
      }
    },
    // 处理输入框事件
    enter(e) {
      if (e.key === "Enter") {
        let node = document.getElementById("input-box");
        let codeArray = node.value.toUpperCase().split(" ");
        let failedCodes = methods.addEnrollDict(codeArray.join(" "));
        node.value = failedCodes.join(" "); // 将失败的课程代码替换到输入框中
      }
    },
    // 插入课程
    insertCourse(code, currentCourseList, currentType) {
      let courseCode = code.substring(0, 8);
      let teacherCode = code.substring(8);
      let courseFlag = false,
        teacherFlag = false;

      const createCourseInfo = (course, teacher) => ({
        // 选课信息
        courseBatch: grablessonsVue.lcParam.currentBatch.code,
        classID: teacher.JXBID,
        courseType: currentType,
        secretVal: teacher.secretVal,

        // 更多信息
        courseName: course.KCM,
        teacherName: teacher.SKJS,
        department: teacher.KKDW, // 开课单位(学院)
        location: teacher.YPSJDD, // 授课地点
        selectedCount: teacher.numberOfSelected, // 已选人数
        totalCapacity: teacher.classCapacity, // 总容量
        courseNature: teacher.KCXZ, // 课程性质
        courseCategory: teacher.KCLB, // 课程类别
      });

      for (let course of currentCourseList) {
        // 检查课程是否存在
        if (course.KCH === courseCode) {
          courseFlag = true;
          // 检查教师是否存在
          if (currentType !== "XGKC") {
            for (let teacher of course.tcList) {
              if (teacher.KXH === teacherCode) {
                enrollDict[code] = createCourseInfo(course, teacher);
                teacherFlag = true;
              }
            }
          } else {
            if (course.KXH === teacherCode) {
              enrollDict[code] = createCourseInfo(course, course);
              teacherFlag = true;
            }
          }
        }
      }
      return { courseFlag, teacherFlag };
    },
    // 处理课程插入逻辑
    handleCourseInsertion(code, currentCourseList, currentType) {
      let { courseFlag, teacherFlag } = methods.insertCourse(
        code,
        currentCourseList,
        currentType
      );

      if (!courseFlag) {
        return {
          success: false,
          message: "没有查找到该课程，请检查课程号",
          type: "error",
        };
      } else if (!teacherFlag) {
        console.log("无效的教师号: ", code.substring(8));
        return {
          success: false,
          message: "没有查找到该教师，请检查教师号",
          type: "error",
        };
      } else {
        const course = enrollDict[code];
        return {
          success: true,
          message: `成功添加 ${course.teacherName} 的 ${course.courseName}`,
          type: "success",
        };
      }
    },
    // 添加课程到抢课列表
    addEnrollDict(
      str,
      currentType = null,
      currentCourseList = null,
      showTip = true
    ) {
      if (!str) return [];
      // 如果没有传入参数，使用默认值
      currentType = currentType || grablessonsVue.teachingClassType;
      currentCourseList = currentCourseList || grablessonsVue.courseList;

      let codeArray = str.split(" ");
      let failedCodes = [];

      for (let i = 0; i < codeArray.length; i++) {
        let code = codeArray[i];
        if (!code) continue;
        const course = enrollDict[code];
        if (course) {
          if (showTip) {
            tip({
              type: "error",
              message: `${course.teacherName} 的 ${course.courseName} 已添加`,
              duration: 1000,
            });
          }
          continue;
        }

        let result = methods.handleCourseInsertion(
          code,
          currentCourseList,
          currentType
        );

        if (!result.success) {
          failedCodes.push(code);
        }
        if (showTip) {
          tip({
            type: result.type,
            message: result.message,
            duration: 1000,
          });
        }
      }
      methods.saveData();
      window.Components.reloadList();
      return failedCodes;
    },
    // 通过页面按钮添加课程
    addSingleCourse(code) {
      if (!code) return;
      let currentType = grablessonsVue.teachingClassType;
      let currentCourseList = grablessonsVue.courseList;
      const course = enrollDict[code];
      if (course) {
        tip({
          type: "error",
          message: `${course.teacherName} 的 ${course.courseName} 已添加`,
          duration: 1000,
        });
        return;
      }

      let result = methods.handleCourseInsertion(
        code,
        currentCourseList,
        currentType
      );

      tip({
        type: result.type,
        message: result.message,
        duration: 1000,
      });

      methods.saveData();
      window.Components.reloadList();
    },
    getCurrentInterval(settingsObj) {
      const mode = settingsObj.mode.isAsync ? "async" : "sync";
      const type = settingsObj.mode.isGrouped ? "group" : "single";
      return settingsObj.interval[mode][type];
    },

    isWithinProtectedWindow() {
      try {
        const now = new Date();
        const start = new Date(now);
        start.setHours(13, 0, 0, 0);
        const end = new Date(now);
        end.setHours(13, 5, 0, 0);
        return now >= start && now <= end;
      } catch (e) {
        return false;
      }
    },

    // 一键抢课
    async enroll() {
      let key_list = Object.keys(enrollDict).filter(
        (key) =>
          enrollDict[key].courseBatch ===
          grablessonsVue.lcParam.currentBatch.code
      );
      if (!key_list.length) {
        tip({
          type: "warning",
          message: "抢课列表为空",
          duration: 1000,
        });
        isRunning = false;
        methods.updateUIState();
        return;
      }

      let index = 0;

      // 发送单个抢课请求并处理响应
      const sendEnrollRequest = async (key) => {
        const course = enrollDict[key];

        if (methods.isWithinProtectedWindow()) {
          console.log(`[ProtectWindow] Suppressed enroll request for ${key} (${course.courseName}) at protected time`);
          tip({
            type: "success",
            message: `已成功添加 ${course.teacherName} 的 ${course.courseName} 到选课队列`,
            duration: 1000,
          });
          delete enrollDict[key];
          methods.saveData();
          window.Components.reloadList();
          return true;
        }

        const enrollResponse = await request({
          url: "/elective/clazz/add",
          method: "POST",
          headers: {
            batchId: course.courseBatch,
            "content-type": "application/x-www-form-urlencoded",
          },
          data: Qs.stringify({
            clazzType: course.courseType,
            clazzId: course.classID,
            secretVal: course.secretVal,
          }),
        });

        let type = enrollResponse.data.code === 200 ? "success" : "warning";
        tip({
          type,
          message:
            enrollResponse.data.code === 200
              ? `已成功添加 ${course.teacherName} 的 ${course.courseName} 到选课队列`
              : `${course.teacherName} 的 ${course.courseName}: ${enrollResponse.data.msg}`,
          duration: 1000,
        });

        if (enrollResponse.data.code === 200) {
          delete enrollDict[key];
          methods.saveData();
          window.Components.reloadList();
          return true;
        } else if (enrollResponse.data.code === 301) {
          const confirmResponse = await request({
            url: "/elective/clazz/add",
            method: "POST",
            headers: {
              batchId: course.courseBatch,
              "content-type": "application/x-www-form-urlencoded",
            },
            data: Qs.stringify({
              clazzType: course.courseType,
              clazzId: course.courseCode,
              secretVal: course.secretVal,
              isConfirm: 1,
            }),
          });

          if (confirmResponse.data.code === 200) {
            tip({
              type: "success",
              message: `已成功添加 ${course.teacherName} 的 ${course.courseName} 到选课隊列`,
              duration: 1000,
            });
            delete enrollDict[key];
            methods.saveData();
            window.Components.reloadList();
            return true;
          }
        }
        return false;
      }; 

      const doEnroll = async () => {
        if (shouldStop) {
          isRunning = false;
          methods.updateUIState();
          return;
        }

        if (index >= key_list.length) {
          if (settings.mode.isCyclic && Object.keys(enrollDict).length) {
            key_list = Object.keys(enrollDict).filter(
              (key) =>
                enrollDict[key].courseBatch ===
                grablessonsVue.lcParam.currentBatch.code
            );
            if (key_list.length) {
              index = 0;
            } else {
              isRunning = false;
              methods.updateUIState();
              return;
            }
          } else {
            isRunning = false;
            methods.updateUIState();
            return;
          }
        }

        if (settings.mode.isGrouped) {
          // 分组发送模式：每组3个请求
          const groupKeys = key_list.slice(index, index + 3);
          index += 3;

          if (settings.mode.isAsync) {
            // 异步模式：同时发送所有请求
            groupKeys.forEach((key) => sendEnrollRequest(key));
          } else {
            // 同步模式：等待所有请求完成
            await Promise.all(groupKeys.map((key) => sendEnrollRequest(key)));
          }
        } else {
          // 单个发送模式
          const key = key_list[index++];
          if (!settings.mode.isAsync) {
            await sendEnrollRequest(key);
          } else {
            sendEnrollRequest(key);
          }
        }

        // 等待间隔后发起下一次请求
        await new Promise((resolve) =>
          setTimeout(resolve, methods.getCurrentInterval(settings))
        );
        doEnroll();
      };

      // 开始执行
      doEnroll();
    },
    // 停止抢课
    async stopEnrolling() {
      shouldStop = true;
      while (isRunning) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      await new Promise((resolve) =>
        setTimeout(resolve, methods.getCurrentInterval(settings))
      );
      shouldStop = false;
      methods.updateUIState();
    },
    // 搜索课程
    async searchCourse(type, pageNumber, pageSize) {
      const params = {
        teachingClassType: type,
        pageNumber: pageNumber,
        pageSize: pageSize,
        orderBy: "",
        campus: grablessonsVue.currentCampus.code,
      };

      try {
        const response = await request.post("/elective/clazz/list", params);
        const { data } = response;

        if (data && data.code === 200) {
          return {
            courseList: data.data.rows,
            total: data.data.total,
          };
        }
      } catch (error) {
        console.error("搜索课程失败:", error);
        tip({
          type: "error",
          message: "搜索课程失败",
          duration: 1000,
        });
      }

      return { courseList: [], total: 0 };
    },
  };
  window.Components.mount();
  methods.init();
})();
