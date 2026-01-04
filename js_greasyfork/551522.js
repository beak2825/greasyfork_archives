// ==UserScript==
// @name         云南胸痛数据填报
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  输入json填写
// @author       Edith
// @match        https://xtzx.ynfwyy.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551522/%E4%BA%91%E5%8D%97%E8%83%B8%E7%97%9B%E6%95%B0%E6%8D%AE%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/551522/%E4%BA%91%E5%8D%97%E8%83%B8%E7%97%9B%E6%95%B0%E6%8D%AE%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加 UI 样式
    // 添加UI样式
    GM_addStyle(`
        #testButton {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            z-index: 1000;
        }
        #jsonInput {
            position: fixed;
            top: 50px;
            right: 10px;
            padding: 10px;
            background-color: #f1f1f1;
            border-radius: 5px;
            width: 400px;
            height: 200px;
            font-size: 14px;
            border: 1px solid #ccc;
            z-index: 1000;
            overflow-y: auto;
            resize: both;
            display: flex;
            flex-direction: column;
        }
    `);

    // 创建JSON输入框和输出框
    let jsonInput = document.createElement('textarea');
    jsonInput.id = 'jsonInput';
    jsonInput.placeholder = '请输入 JSON 数据...';
    document.body.appendChild(jsonInput);

    // 创建执行按钮
    let testButton = document.createElement('button');
    testButton.id = 'testButton';
    testButton.textContent = '执行';
    document.body.appendChild(testButton);

    // 创建基本的函数
    // 1. 创建一个延迟函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 2. 点击新建按钮
    function clickNewButton() {
        let newButton = Array.from(document.querySelectorAll("button"))
                              .find(button => button.querySelector("span") && button.querySelector("span").textContent === '新建');
        if (newButton) {
            newButton.click();
            console.log("✅ 成功点击 '新建' 按钮！");
        } else {
            console.warn("❌ 未找到 '新建' 按钮！");
        }
    }

    // 3. 点击保存按钮
    function clickSaveButton() {
        let saveButton = Array.from(document.querySelectorAll("button"))
                               .find(button => button.querySelector("span") && button.querySelector("span").textContent === '保存');
        if (saveButton) {
            saveButton.click();
            console.log("✅ 成功点击 '保存' 按钮！");
        } else {
            console.warn("❌ 未找到 '保存' 按钮！");
        }
    }

    // 4. 下拉选择
    function selectDropdown(forValue, optionText) {
        // 定位到 label[for] 对应的选择框
        let selectLabel = document.querySelector(`label[for='${forValue}']`);
        if (selectLabel) {
            // 获取该选择框的下拉菜单
            let select = selectLabel.parentElement.querySelector(".el-select");
            if (select) {
                let options = select.querySelectorAll(".el-select-dropdown__item");
                options.forEach(option => {
                    if (option.textContent.includes(optionText)) {
                        option.click();  // 选择该选项
                        console.log(`✅ 选择 '${forValue}' 下拉框中的 '${optionText}'`);
                    }
                });
            } else {
                console.warn(`❌ 找不到 '${forValue}' 的选择框`);
            }
        } else {
            console.warn(`❌ 找不到 label[for='${forValue}']`);
        }
    }


    // 5. 填充输入框
    function setInputByLabel(labelText, value) {
        let label = Array.from(document.querySelectorAll("label")).find(l => l.textContent.includes(labelText));
        if (label) {
            let input = label.parentElement.querySelector("input");
            if (input && value) {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ 填充 '${labelText}': ${value}`);
            } else {
                console.warn(`❌ 找不到或未填充 '${labelText}'`);
            }
        }
    }

    // 6. 创建的基本信息
    function creatnew(data) {
        // 填充姓名
        setInputByLabel('患者姓名', data['姓名']);
        // 填充年龄
        setInputByLabel('患者年龄', data['年龄']);
        // 填充门诊号
        setInputByLabel('门/急诊ID', data['门诊号']);
        selectDropdown('personGender', data['性别']);  // 选择性别
        selectDropdown('sourceType', '自行来院');  // 选择来院方式
    }



    // 7. 创建详细过程时间
    function fillForm(data) {

        // 填充发病时间
        setInputByLabel('发病时间', data["发病时间"]);

        // 填充到达大门医院时间
        setInputByLabel('到达本院大门时间', data["到达大门医院"]);

        // 填充首次医疗接触时间
        setInputByLabel('首次医疗接触时间', data["首次医疗接触时间"]);

        // 填充意识
        setInputByLabel('意识', data["意识"]);

        // 填充呼吸
        setInputByLabel('呼吸', data["呼吸"]);

        // 填充心率
        setInputByLabel('心率', data["心率"]);

        // 填充血压
        setInputByLabel('血压', data["血压"]);

        // 填充院内首份心电图时间
        setInputByLabel('院内首份心电图时间', data["首份心电图时间"]);

        // 填充肌钙蛋白 (TnI) 如果存在
        if (data["TnI"]) {
            setInputByLabel('肌钙蛋白 (TnI)', data["TnI"]);
        }

        // 填充采血时间
        setInputByLabel('采血时间', data["抽血完成时间"]);

        // 填充肌钙蛋白出结果时间
        setInputByLabel('肌钙蛋白出结果时间', data["获得报告时间"]);

        // 填充肌钙蛋白结果
        setInputByLabel('肌钙蛋白结果', data["Myo"]);

        console.log("✅ 填充表单完成！");
    }

    // 8. 不能常规写入的
    function ecgdignosetime(data) {

        // 使用 XPath 定位到心电图诊断时间输入框
        let xpath = "/html/body/div[1]/div[1]/div[2]/section/div/div[2]/div/div[2]/div[2]/div/form/div[6]/div[5]/div/div/input";
        let input = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 如果找到该输入框
        if (input) {
            console.log("✅ 找到 '心电图诊断时间' 输入框", input);

            // 设置值为 "2025-09-06 19:42"
            input.value = data["心电图诊断时间"];

            // 触发 input 和 change 事件
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            console.log("✅ 成功填充 心电图诊断时间");
        } else {
            console.warn("❌ 未找到 '心电图诊断时间' 输入框");
        }
    }

    // 9. checkbox选择
    async function selectCheckbox(labelFor, indices) {
        // 通过 label[for=labelFor] 定位到对应的 label 元素
        let label = document.querySelector(`label[for="${labelFor}"]`);

        if (label) {
            console.log(`✅ 找到 label[for="${labelFor}"]:`, label);

            // 在label的同级div下查找el-checkbox-group
            let checkboxGroup = label.closest('div').querySelector('.el-checkbox-group');

            if (checkboxGroup) {
                console.log("✅ 找到el-checkbox-group:", checkboxGroup);

                // 获取所有checkbox
                let checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"]');

                // 异步选择每个checkbox
                for (let index of indices) {
                    // 索引从1开始，因此需要用 index - 1
                    if (checkboxes.length >= index) {
                        let targetCheckbox = checkboxes[index - 1];  // 索引从1开始
                        console.log(`✅ 找到第${index}个checkbox:`, targetCheckbox);

                        // 选中目标checkbox
                        targetCheckbox.click();
                        console.log(`✅ 已选中第${index}个checkbox`);

                        // 如果需要在点击后等待某些时间，可以添加一个延时
                        await new Promise(resolve => setTimeout(resolve, 100));  // 延时100毫秒，模拟操作
                    } else {
                        console.warn(`❌ 找不到第${index}个checkbox`);
                    }
                }
            } else {
                console.warn("❌ 未找到el-checkbox-group");
            }
        } else {
            console.warn(`❌ 未找到label[for="${labelFor}"]`);
        }
    }

    // 10. 点击单项
    function selectRadioButton(labelFor, index) {
        // 通过 label[for=labelFor] 定位到对应的 label 元素
        let label = document.querySelector(`label[for="${labelFor}"]`);

        if (label) {
            console.log(`✅ 找到 label[for="${labelFor}"]:`, label);

            // 在label的同级div下查找el-radio-group
            let radioGroup = label.closest('div').querySelector('.el-radio-group');

            if (radioGroup) {
                console.log("✅ 找到el-radio-group:", radioGroup);

                // 获取所有radio按钮
                let radios = radioGroup.querySelectorAll('input[type="radio"]');

                if (radios.length >= index) {
                    let targetRadio = radios[index - 1];  // 索引从1开始
                    console.log(`✅ 找到第${index}个radio:`, targetRadio);

                    // 选中目标radio
                    targetRadio.click();
                    console.log(`✅ 已选中第${index}个radio`);
                } else {
                    console.warn(`❌ 找不到第${index}个radio`);
                }
            } else {
                console.warn("❌ 未找到el-radio-group");
            }
        } else {
            console.warn(`❌ 未找到label[for="${labelFor}"]`);
        }
    }

    testButton.addEventListener('click', async function() {
        // 解析 JSON 输入框中的数据
        let inputData;
        try {
            inputData = JSON.parse(jsonInput.value);
        } catch (e) {
            alert('JSON 格式错误，请检查输入内容！');
            return;
        }

        await clickNewButton();  // 点击新建按钮

        // 延迟1-2秒
        await delay(Math.random() * 1000 + 1000);

        await creatnew(inputData); // 填充表单
        await delay(Math.random() * (2000 - 1000) + 500);
        clickSaveButton()

        // 延迟1-3秒
        await delay(Math.random() * 1000 + 500);

        fillForm(inputData)
        ecgdignosetime(inputData)
        selectCheckbox("bingqingPinggu", [7]);
        selectCheckbox('yuanqianJianchaXiangmu', [1]);
        selectCheckbox("chubuZhenduan", [9]);
        selectCheckbox("chuyuanZhenduan", [6]);
        if (inputData["TnI"]) {
            selectCheckbox('yuanqianJianchaXiangmu', [1,2]);
        }else{
            selectCheckbox('yuanqianJianchaXiangmu', [1]);
        }
        selectRadioButton('huanzheZhuangui', 1);  // 第1个单选框 "好转"
        await delay(Math.random() * (2000 - 1000) + 500);
        clickSaveButton()
    });
})();