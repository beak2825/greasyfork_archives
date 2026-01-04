// ==UserScript==
// @name         ff14超域传送助手
// @namespace    393033152@qq.com
// @version      0.1
// @description  JavaScript
// @author       Gavrain
// @license      Apache-2.0
// @match        https://ff14bjz.sdo.com/RegionKanTelepo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556164/ff14%E8%B6%85%E5%9F%9F%E4%BC%A0%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556164/ff14%E8%B6%85%E5%9F%9F%E4%BC%A0%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 从localStorage读取配置（默认值）
    const defaultConfig = {
        selectText1: '莫古力',
        selectText2: '白银乡',
        selectText3: '陆行鸟',
        selectText4: '宇宙和音',
    }
    // 读取保存的配置，若无则用默认值
    const config = JSON.parse(localStorage.getItem('myScriptConfig')) || defaultConfig


    // 注入配置窗口按钮和界面
    function injectConfigUI() {
        // 创建配置按钮（悬浮在页面右上角）
        const configBtn = document.createElement('button')
        configBtn.textContent = '脚本配置'
        configBtn.style.position = 'fixed'
        configBtn.style.top = '20px'
        configBtn.style.right = '20px'
        configBtn.style.zIndex = '9999'
        configBtn.style.padding = '8px 12px'
        configBtn.style.backgroundColor = '#4CAF50'
        configBtn.style.color = 'white'
        configBtn.style.border = 'none'
        configBtn.style.borderRadius = '4px'
        configBtn.style.cursor = 'pointer'
        document.body.appendChild(configBtn)

        // 创建配置窗口（默认隐藏）
        const configWindow = document.createElement('div')
        configWindow.style.position = 'fixed'
        configWindow.style.top = '60px'
        configWindow.style.right = '20px'
        configWindow.style.zIndex = '9999'
        configWindow.style.width = '300px'
        configWindow.style.padding = '20px'
        configWindow.style.backgroundColor = 'white'
        configWindow.style.border = '1px solid #ccc'
        configWindow.style.borderRadius = '4px'
        configWindow.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
        configWindow.style.display = 'none' // 默认隐藏
        document.body.appendChild(configWindow)

        // 配置窗口内容（表单）
        configWindow.innerHTML = `
    <h3 style="margin-top: 0;">脚本配置</h3>
    <div style="margin-bottom: 10px;">
        <label>游戏大区：</label>
        <select id="selectText1" style="width: 100%; padding: 6px; margin-top: 5px;">
            <option value="猫小胖" ${config.selectText1 === '猫小胖' ? 'selected' : ''}>猫小胖</option>
            <option value="陆行鸟" ${config.selectText1 === '陆行鸟' ? 'selected' : ''}>陆行鸟</option>
            <option value="豆豆柴" ${config.selectText1 === '豆豆柴' ? 'selected' : ''}>豆豆柴</option>
            <option value="莫古力" ${config.selectText1 === '莫古力' ? 'selected' : ''}>莫古力</option>
        </select>
    </div>
    <div style="margin-bottom: 10px;">
        <label>服务器：</label>
        <select id="selectText2" style="width: 100%; padding: 6px; margin-top: 5px;">
            <option value="${config.selectText2}" selected}>${config.selectText2}</option>
        </select>
    </div>
    <div style="margin-bottom: 10px;">
        <label>目标大区：</label>
        <select id="selectText3" style="width: 100%; padding: 6px; margin-top: 5px;">
            <option value="猫小胖" ${config.selectText3 === '猫小胖' ? 'selected' : ''}>猫小胖</option>
            <option value="陆行鸟" ${config.selectText3 === '陆行鸟' ? 'selected' : ''}>陆行鸟</option>
            <option value="豆豆柴" ${config.selectText3 === '豆豆柴' ? 'selected' : ''}>豆豆柴</option>
            <option value="莫古力" ${config.selectText3 === '莫古力' ? 'selected' : ''}>莫古力</option>
        </select>
    </div>
    <div style="margin-bottom: 10px;">
        <label>目标服务器：</label>
        <select id="selectText4" style="width: 100%; padding: 6px; margin-top: 5px;">
            <option value="${config.selectText4}" selected}>${config.selectText4}</option>
        </select>
    </div>
    <button id="saveConfig" style="width: 100%; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存配置</button>
`

        // 获取选择框元素
        const select1 = configWindow.querySelector('#selectText1')
        const select2 = configWindow.querySelector('#selectText2')
        const select3 = configWindow.querySelector('#selectText3')
        const select4 = configWindow.querySelector('#selectText4')
        // 预设选项数据
        const optionData = {
            // 选择框1（游戏大区）对应的选择框2（服务器）选项
            '猫小胖': [
                { value: '延夏', text: '延夏' },
                { value: '摩杜纳', text: '摩杜纳' },
                { value: '紫水栈桥', text: '紫水栈桥' },
                { value: '静语庄园', text: '静语庄园' },
                { value: '海猫茶屋', text: '海猫茶屋' },
                { value: '柔风海湾', text: '柔风海湾' },
                { value: '琥珀原', text: '琥珀原' },
            ],
            '陆行鸟': [
                { value: '红玉海', text: '红玉海' },
                { value: '神意之地', text: '神意之地' },
                { value: '拉诺西亚', text: '拉诺西亚' },
                { value: '幻影群岛', text: '幻影群岛' },
                { value: '萌芽池', text: '萌芽池' },
                { value: '宇宙和音', text: '宇宙和音' },
                { value: '沃仙曦染', text: '沃仙曦染' },
                { value: '晨曦王座', text: '晨曦王座' },
            ],
            '豆豆柴': [
                { value: '水晶塔', text: '水晶塔' },
                { value: '银泪湖', text: '银泪湖' },
                { value: '太阳海岸', text: '太阳海岸' },
                { value: '伊修加德', text: '伊修加德' },
                { value: '红茶川', text: '红茶川' },
            ],
            '莫古力': [
                { value: '白金幻象', text: '白金幻象' },
                { value: '白银乡', text: '白银乡', },
                { value: '神拳痕', text: '神拳痕', },
                { value: '潮风亭', text: '潮风亭', },
                { value: '旅人栈桥', text: '旅人栈桥' },
                { value: '拂晓之间', text: '拂晓之间' },
                { value: '梦羽宝境', text: '梦羽宝境' },
                { value: '龙巢神殿', text: '龙巢神殿' },
            ],
        }
        const areaData = [
            { value: '猫小胖', text: '猫小胖' },
            { value: '豆豆柴', text: '豆豆柴', },
            { value: '陆行鸟', text: '陆行鸟', },
            { value: '莫古力', text: '莫古力', },
        ]

        // 定义更新选择框选项的函数
        function updateSelectOptions(targetSelect, options, defaultVal) {
            // 清空现有选项
            targetSelect.innerHTML = ''
            // 添加新选项
            options.forEach(option => {
                const opt = document.createElement('option')
                opt.value = option.value
                opt.textContent = option.text
                // 若默认值存在则选中，否则选第一个
                if (option.value === defaultVal) {
                    opt.selected = true
                }
                targetSelect.appendChild(opt)
            })
        }

        // 监听选择框1变化，更新选择框2
        select1.addEventListener('change', () => {
            const selectedVal = select1.value
            // 获取对应选项（默认用'1'的选项兜底）
            const options = optionData[selectedVal] || optionData['猫小胖']
            // 用当前select2的值作为默认值（尽量保留用户之前的选择）
            updateSelectOptions(select2, options, select2.value)
        })

        // 监听选择框3变化，更新选择框4
        select3.addEventListener('change', () => {
            const selectedVal = select3.value
            const options = optionData[selectedVal] || optionData['猫小胖']
            updateSelectOptions(select4, options, select4.value)
        })

        // 监听选择框1变化，更新选择框3
        select1.addEventListener('change', () => {
            const selectedVal = select1.value
            const options = areaData.filter(v => v.value != selectedVal)
            updateSelectOptions(select3, options, select3.value)
            select3.dispatchEvent(new Event('change'))
        })

        // 初始化：页面加载时根据当前选择框1/3的值，更新2/4
        // 触发一次change事件，自动加载对应选项
        select1.dispatchEvent(new Event('change'))
        select3.dispatchEvent(new Event('change'))

        // 点击按钮显示/隐藏配置窗口
        configBtn.addEventListener('click', () => {
            configWindow.style.display = configWindow.style.display === 'none' ? 'block' : 'none'
        })

        // 保存配置到localStorage
        configWindow.querySelector('#saveConfig').addEventListener('click', () => {
            const newConfig = {
                selectText1: configWindow.querySelector('#selectText1').value.trim(),
                selectText2: configWindow.querySelector('#selectText2').value.trim(),
                selectText3: configWindow.querySelector('#selectText3').value.trim(),
                selectText4: configWindow.querySelector('#selectText4').value.trim(),
            }
            // 保存到localStorage（需转为字符串）
            localStorage.setItem('myScriptConfig', JSON.stringify(newConfig))
            // 更新当前配置
            Object.assign(config, newConfig)
            alert('配置已保存！')
            configWindow.style.display = 'none'
            main()
        })
    }


    // 3. 脚本核心逻辑（使用配置）
    async function main() {
        console.log('当前配置：', config)
        const loginState = await wait(checkLogin)
        if (!loginState) {
            console.log('未登录')
            document.querySelector('.navigation button').click()
            const loginBtn = await findElementByQuerySelectorAsync('.navigation button')
            loginBtn.click()
            return
        }
        await handleSelects()
    }

    async function checkLogin() {
        const targetElement = await findElementByQuerySelectorAsync('.navigation > div')
        const loginState = targetElement?.children?.length != 1
        return loginState
    }

    function findElementByQuerySelectorAsync(query, root = document) {
        return wait(root.querySelector.bind(root, query))
    }

    // 示例：处理Select的函数（使用配置中的参数）
    async function handleSelects() {
        const selects = document.querySelectorAll('.s-area .ant-select')
        const { selectText1, selectText2, selectText3, selectText4 } = config
        selects[0].click()
        await findItemAndClick(selectText1)
        selects[1].click()
        await findItemAndClick(selectText2)
        document.querySelector('.s-area button').click()
        const ratio = await findElementByQuerySelectorAsync('.ant-radio')
        if (ratio == null) {
            showRoleNotFoundMessage('角色未找到，请检查大区设置后重试')
            return
        }
        ratio.click()
        selects[2].click()
        await findItemAndClick(selectText3)
        selects[3].click()
        await findItemAndClick(selectText4)
        document.querySelector('.ant-checkbox').click()
    }

    /**
     * 轮询等待目标条件满足，返回判断函数的执行结果
     * @param {Function} checkFn - 用于判断条件的函数（返回真值表示条件满足）
     * @param {number} [delay=200] - 轮询间隔（毫秒）
     * @param {number} [maxRetries=20] - 最大重试次数（默认20次）
     * @returns {Promise<any>} - 返回 checkFn 的执行结果（满足条件时）或 null（超时）
     */
    function wait(checkFn, delay = 200, maxRetries = 20) {
        return new Promise((resolve) => {
            let retries = 0

            // 轮询函数
            const poll = () => {
                // 执行判断函数，获取结果
                const result = checkFn()

                // 如果结果为真值（满足条件），直接返回结果
                if (result != undefined) {
                    resolve(result)
                    return
                }

                // 如果超过最大重试次数，返回 null（超时）
                if (retries >= maxRetries) {
                    resolve(null)
                    return
                }

                // 否则继续轮询
                retries++
                setTimeout(poll, delay)
            }

            // 立即开始第一次检查（不等待延迟）
            poll()
        })
    }

    // 辅助函数：查找选项并点击
    async function findItemAndClick(text) {
        let target
        let step = 0
        while (target == undefined && step < 20) {
            await sleep(200)
            console.log(step)
            const items = Array.from(document.querySelectorAll('.ant-select-dropdown-menu-item')).reverse()
            target = items.find(v => v.textContent.trim().includes(text))
            step++
        }
        if (target) {
            target.click()
            console.log(`${text}已找到`)
        }
        else console.error(`${text}未找到`)
    }

    // 辅助函数：sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // 辅助函数：消息提示
    function showRoleNotFoundMessage(text) {
        // 创建提示元素
        const messageBox = document.createElement('div')

        // 设置样式
        messageBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px); /* 初始位置在视口外 */
        padding: 12px 20px;
        background-color: #ff4d4f; /* 红色背景，提示错误 */
        color: white;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 99999; /* 确保在最上层 */
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0; /* 初始透明 */
        font-family: sans-serif;
        font-size: 14px;
    `

        // 设置提示文本
        messageBox.textContent = text

        // 添加到页面
        document.body.appendChild(messageBox)

        // 触发淡入动画（延迟10ms确保元素已添加到DOM）
        setTimeout(() => {
            messageBox.style.transform = 'translateX(-50%) translateY(0)'
            messageBox.style.opacity = '1'
        }, 10)

        // 3秒后自动关闭（淡出动画）
        setTimeout(() => {
            messageBox.style.transform = 'translateX(-50%) translateY(-100px)'
            messageBox.style.opacity = '0'

            // 动画结束后移除元素
            setTimeout(() => {
                document.body.removeChild(messageBox)
            }, 300)
        }, 3000)
    }

    // 执行入口：先注入配置UI，再执行主逻辑
    injectConfigUI()
    // 等待页面加载完成后执行主逻辑
    void (async () => {
        try {
            await main()
        } catch (err) {
            console.error('执行失败：', err)
        }
    })()
})()