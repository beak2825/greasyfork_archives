// ==UserScript==
// @name         宜搭脚本工具箱
// @namespace    http://tampermonkey.net/
// @version      2026-01-28
// @description  宜搭自动化辅助工具，支持规则填充、表单转换、打印样式调整等功能。
// @author       LandeMeng
// @match        https://*.aliwork.com/alibaba/web/*/design/pageDesigner?*
// @match        https://*.aliwork.com/dingtalk/web/*/design/pageDesigner?*
// @match        https://*.aliwork.com/*/design/newDesigner.html?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564224/%E5%AE%9C%E6%90%AD%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/564224/%E5%AE%9C%E6%90%AD%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

// 全局填充规则变量
window.fillRule = 'A';
window.fillDataSource = '';
window.fillDataSourceOptions = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const raf = () => new Promise(r => requestAnimationFrame(r));
const waitFor = async (fn, timeout = 800, interval = 20) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (fn()) return true;
        await new Promise(r => setTimeout(r, interval));
    }
    return false;
};
const getVisibleSelectMenus = () =>
    Array.from(document.querySelectorAll('.next-select-menu'))
        .filter(menu => menu.offsetParent && getComputedStyle(menu).display !== 'none');
const openSelect = async selectDiv => { selectDiv.click(); await sleep(200); };
const waitVisibleMenu = async (timeout = 800) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const menus = getVisibleSelectMenus();
        if (menus.length) return menus[0];
        await new Promise(r => setTimeout(r, 20));
    }
    return null;
};
const selectFirstOption = async selectDiv => {
    await openSelect(selectDiv);
    const menu = await waitVisibleMenu();
    if (!menu) { document.body.click(); return false; }
    const firstOption = menu.querySelector('.next-menu-item');
    if (!firstOption) { document.body.click(); return false; }
    firstOption.click();
    await raf();
    return true;
};
const selectMenuItemByTitle = (menu, title) => {
    const item = menu.querySelector(`li[title="${title}"]`) ||
        Array.from(menu.querySelectorAll('.next-menu-item'))
            .find(i => (i.getAttribute('title') || i.textContent.trim()) === title);
    if (!item) return false;
    item.click();
    return true;
};
const waitInputAriaValueText = async (inputEl, valueText, timeout = 600) => {
    return await waitFor(() => inputEl && inputEl.getAttribute('aria-valuetext') === valueText, timeout, 20);
    return true;
};
const fetchJson = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) return null;
        return await response.json();
    } catch (_) {
        return null;
    }
};

/**
 * 在规则项中选择字段名（简化版 - 直接选择第一个选项）
 * @param {HTMLElement} ruleItem - 包含字段选择器的规则项DOM元素
 * @returns {Promise<boolean>} - 返回Promise，true表示操作成功，false表示失败
 */
async function setFieldName(ruleItem) {
    try {
        const fieldDiv = ruleItem.querySelector('.field-name .next-select');
        if (!fieldDiv) return false;
        const ok = await selectFirstOption(fieldDiv);
        return !!ok;
    } catch (_) {
        document.body.click();
        return false;
    }
}
async function setValueTypeToField(ruleItem, typeText = '字段') {
    const selectDiv = ruleItem.querySelector('.value-type .next-select');
    if (!selectDiv) return false;
    await openSelect(selectDiv);
    const menu = await waitVisibleMenu();
    if (!menu) { document.body.click(); return false; }
    const ok = selectMenuItemByTitle(menu, typeText);
    const input = selectDiv.querySelector('input');
    const isSuccess = await waitInputAriaValueText(input, typeText, 600);
    document.body.click();
    await raf();
    document.body.click();
    return ok && isSuccess;
}
// 设置target-value
async function setTargetValue() {
    const ruleItem = getLastRuleItem();
    if (!ruleItem) return false;
    const triggerSearches = ruleItem.querySelectorAll('.next-select-trigger-search');
    if (!triggerSearches || triggerSearches.length < 3) return false;
    const fieldInput = triggerSearches[0].querySelector('input');
    const fieldText = fieldInput ? fieldInput.getAttribute('aria-valuetext') : null;
    if (!fieldText) return false;
    const targetInput = triggerSearches[2].querySelector('input');
    if (!targetInput) return false;

    // 1) 打开数据源面板
    targetInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    targetInput.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    targetInput.focus();
    targetInput.click();
    targetInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown', code: 'ArrowDown' }));
    await raf();
    const panelReady = await waitFor(() => document.querySelector('.select-field-panel'), 800, 20);
    const panel = document.querySelector('.select-field-panel');
    if (!panel || !panelReady) return false;

    const normalizeLabel = (text) => (text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, '').trim();
    const getNodeLabel = (li) => {
        const labelEl = li.querySelector('.single-item-label');
        const label = (labelEl && (labelEl.getAttribute('title') || labelEl.textContent)) || li.getAttribute('datalabel') || li.textContent || '';
        return normalizeLabel(label);
    };
    const triggerReactEvent = (el, type = 'click') => {
        if (!el) return false;
        try {
            el.dispatchEvent(new MouseEvent(type, { bubbles: true }));
        } catch (_) { }
        try {
            const reactKey = Object.keys(el).find(key =>
                key.startsWith('__reactProps$') || key.startsWith('__reactEventHandlers$'));
            if (reactKey) {
                const reactProps = el[reactKey];
                const handler = type === 'mousedown' ? reactProps.onMouseDown : reactProps.onClick;
                if (handler) {
                    handler({
                        target: el,
                        currentTarget: el,
                        type,
                        nativeEvent: new MouseEvent(type),
                        preventDefault: () => { },
                        stopPropagation: () => { },
                        persist: () => { }
                    });
                    return true;
                }
            }
        } catch (_) { }
        return true;
    };
    const getDataSourceLabels = () => {
        const labels = [];
        const raw = window.fillDataSource;
        if (raw) labels.push(raw);
        const toolbox = document.querySelector('#script-toolbox');
        const selects = toolbox ? toolbox.querySelectorAll('select') : null;
        if (selects && selects.length > 1) {
            const dsSelect = selects[1];
            const opt = dsSelect.options[dsSelect.selectedIndex];
            if (opt) {
                if (opt.value) labels.push(opt.value);
                if (opt.textContent) {
                    labels.push(opt.textContent);
                    labels.push(opt.textContent.replace(/^表单：/, '').trim());
                }
            }
        }
        if (raw && raw.startsWith('form:')) labels.push(raw.replace(/^form:/, ''));
        return Array.from(new Set(labels.map(l => normalizeLabel(l)).filter(Boolean)));
    };
    const findDataSourceNode = (labels) => {
        const nodes = panel.querySelectorAll('li.next-tree-node.parent-tree-node');
        if (!nodes.length) return null;
        if (labels.length) {
            const matched = Array.from(nodes).find(li => labels.includes(getNodeLabel(li)));
            if (matched) return matched;
        }
        if (nodes.length === 1) return nodes[0];
        return null;
    };

    // 2) 定位并展开数据源节点
    const dataSourceLabels = getDataSourceLabels();
    let dataSourceNode = findDataSourceNode(dataSourceLabels);
    const ensureExpanded = async () => {
        if (!dataSourceNode) return;
        const switcher = dataSourceNode.querySelector('.next-tree-switcher');
        const expandedByClass = dataSourceNode.classList.contains('next-tree-node-expanded');
        const expandedByAttr = switcher && switcher.getAttribute('aria-expanded') === 'true';
        const isClosed = switcher && switcher.classList.contains('next-close');
        if ((!expandedByClass && !expandedByAttr) || isClosed) {
            if (switcher) {
                triggerReactEvent(switcher, 'mousedown');
                triggerReactEvent(switcher, 'click');
            } else {
                const inner = dataSourceNode.querySelector('.next-tree-node-inner');
                triggerReactEvent(inner, 'mousedown');
                triggerReactEvent(inner, 'click');
            }
            await raf();
            await waitFor(() => {
                const node = findDataSourceNode(dataSourceLabels);
                const expandedClass = node && node.classList.contains('next-tree-node-expanded');
                const nestedCount = node ? node.querySelectorAll('li.next-tree-node').length : 0;
                return expandedClass || nestedCount > 0;
            }, 800, 20);
            dataSourceNode = findDataSourceNode(dataSourceLabels) || dataSourceNode;
        }
    };
    if (dataSourceNode) {
        await ensureExpanded();
        await raf();
    }

    // 3) 根据模式匹配目标字段节点
    const getSearchNodes = () => {
        const allNodes = Array.from(panel.querySelectorAll('li.next-tree-node'));
        if (dataSourceNode) {
            const nested = Array.from(dataSourceNode.querySelectorAll('li.next-tree-node'));
            if (nested.length) return nested;
        }
        return allNodes;
    };
    const findNodeByLabel = (label) => {
        const nodes = getSearchNodes();
        const normalizedLabel = normalizeLabel(label);
        return nodes.find(li => getNodeLabel(li) === normalizedLabel && li.offsetParent);
    };
    const findTargetNode = async () => {
        if (window.fillRule === 'C') {
            const labelA = `${fieldText}文本`;
            const labelB = fieldText;
            let target = findNodeByLabel(labelA) || findNodeByLabel(labelB);
            if (!target) {
                await waitFor(() => findNodeByLabel(labelA) || findNodeByLabel(labelB), 600, 20);
                target = findNodeByLabel(labelA) || findNodeByLabel(labelB);
            }
            return target;
        }
        let target = findNodeByLabel(fieldText);
        if (!target) {
            await waitFor(() => findNodeByLabel(fieldText), 600, 20);
            target = findNodeByLabel(fieldText);
        }
        return target;
    };
    const targetNode = await findTargetNode();
    if (!targetNode) {
        if (window.fillRule === 'B') {
            await setValueTypeToField(ruleItem, '公式');
            return true;
        }
        return true;
    }

    // 4) 触发目标节点选择
    const clickableElement = targetNode.querySelector('.next-tree-node-label-selectable') ||
        targetNode.querySelector('.next-tree-node-label-wrapper') ||
        targetNode.querySelector('.next-tree-node-inner');
    if (!clickableElement) return false;
    triggerReactEvent(clickableElement, 'mousedown');
    const success = triggerReactEvent(clickableElement, 'click');
    await raf();
    return success;
}

const findVisibleTreeNode = (label) => {
    return Array.from(document.querySelectorAll('li.next-tree-node'))
        .find(li => li.getAttribute('datalabel') === label && li.offsetParent);
};
const getLastRuleItem = () => {
    const group = document.querySelector('.action-rules-editor .rules-group');
    if (!group) return null;
    const items = group.querySelectorAll('.rule-item');
    return items.length ? items[items.length - 1] : null;
};
// 填充一条（改进版）
const event_fillOne = async () => {
    const addButton = document.querySelector(".action-rules-editor .rules-group .rules-add-btn");
    if (!addButton) {
        return false;
    }
    const beforeCount = document.querySelectorAll(".action-rules-editor .rules-group .rule-item").length;
    addButton.click();
    const added = await waitFor(() => {
        const nowCount = document.querySelectorAll(".action-rules-editor .rules-group .rule-item").length;
        return nowCount > beforeCount;
    }, 1000, 20);
    if (!added) return false;
    const last_item = getLastRuleItem();
    if (!last_item) return false;
    try {
        await setFieldName(last_item);
        await setValueTypeToField(last_item, '字段');
        await setTargetValue();
        return true;
    } catch (_) {
        return false;
    }
}

// 填充所有
const evnent_fillAll = async () => {
    let count = 0;
    const maxAttempts = 100;
    while (count < maxAttempts) {
        const addButton = document.querySelector(".action-rules-editor .rules-group .rules-add-btn");
        if (!addButton) break;
        const ok = await event_fillOne();
        if (!ok) break;
        count++;
        await raf();
    }
}

const getMapComponentsTree = (node, array) => {
    if (node.children) {
        // 如果拥有子节点，则继续遍历
        // 使用 for...of 循环来处理异步操作
        for (const childNode of node.children) {
            getMapComponentsTree(childNode, array);
        }
    } else {
        // 如果没有子节点，说明是一个字段
        if (node.componentName === "AssociationFormField") {
            array.push(node)
        }
    }
};

// 辅助函数：递归遍历树形结构，提取所有AssociationFormField组件
function extractAssociationFormFields(tree) {
    const result = [];

    function traverse(nodes) {
        if (!Array.isArray(nodes)) return;

        for (const node of nodes) {
            if (node.componentName === 'AssociationFormField') {
                result.push(node);
            }

            // 如果有子节点，递归遍历
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            }
        }
    }

    traverse(tree);
    return result;
}

const getConvertInfo = async (nodeSchema) => {
    let resultList = [];
    let errorList = [];

    // 1) 提取所有关联表单字段
    const associationFormFields = extractAssociationFormFields(nodeSchema.componentsTree);

    if (associationFormFields.length === 0) {
        console.warn('未找到任何AssociationFormField组件');
        return { errorList, resultList };
    }

    // 2) 收集需要预加载的应用
    const appIdsToFetch = new Set();
    const appInfoCache = new Map(); // 缓存：originalName -> appInfo

    // 预先建立应用信息缓存
    for (const app of window.yiDaAppList) {
        if (app.appOriginalName) {
            appInfoCache.set(app.appOriginalName, app);
        }
    }

    // 收集需要获取字段数据的appId
    for (const field of associationFormFields) {
        const associationForm = field.props.associationForm;
        const appName = associationForm.appName;

        // 首先尝试直接匹配
        let targetAppInfo = appInfoCache.get(appName);

        if (!targetAppInfo) {
            // 尝试分割匹配
            const reseachName = appName.split("-")[1];
            targetAppInfo = appInfoCache.get(reseachName);
        }

        if (targetAppInfo) {
            appIdsToFetch.add(targetAppInfo.appId);
        }
    }

    console.log(`需要预加载的应用数量: ${appIdsToFetch.size}`, Array.from(appIdsToFetch));

    // 3) 并行预加载应用的表单与字段
    const fieldCache = new Map(); // 缓存：appId -> listField

    const promises = Array.from(appIdsToFetch).map(async (appId) => {
        try {
            const listField = await window.yiDaScript.services.getListFieldInApp(appId);
            fieldCache.set(appId, listField);
            return { appId, success: true };
        } catch (error) {
            console.error(`预加载应用 ${appId} 失败:`, error);
            return { appId, success: false, error };
        }
    });

    // 等待所有预加载完成
    await Promise.all(promises);

    // 4) 逐个字段匹配目标表单与目标字段
    const normalize = (t) => (t || '').replace(/\u00a0/g, ' ').replace(/\s+/g, '').trim();
    const findFormInfo = (forms, associationForm) => {
        if (!Array.isArray(forms)) return null;
        const formUuid = associationForm.formUuid;
        const formTitle = associationForm.formTitle;
        let formInfo = forms.find(formItem =>
            (formUuid && formItem.formUuid === formUuid)
            || (formTitle && normalize(formItem.title?.zh_CN) === normalize(formTitle))
        );
        if (formInfo) return formInfo;
        const mainFieldId = associationForm.mainFieldId;
        const labelRaw = associationForm.mainFieldLabel;
        const labelText = typeof labelRaw === 'object' ? labelRaw.zh_CN : labelRaw;
        if (mainFieldId) {
            const byId = forms.filter(formItem =>
                Array.isArray(formItem.fields) && formItem.fields.some(fieldItem => fieldItem.fieldId === mainFieldId)
            );
            if (byId.length === 1) return byId[0];
            if (byId.length > 1 && labelText) {
                const byLabel = byId.find(formItem =>
                    formItem.fields.some(fieldItem => normalize(fieldItem.name?.zh_CN) === normalize(labelText))
                );
                if (byLabel) return byLabel;
            }
            if (byId.length > 0) return byId[0];
        }
        if (labelText) {
            const byLabel = forms.filter(formItem =>
                Array.isArray(formItem.fields) && formItem.fields.some(fieldItem => normalize(fieldItem.name?.zh_CN) === normalize(labelText))
            );
            if (byLabel.length === 1) return byLabel[0];
        }
        return null;
    };
    for (const field of associationFormFields) {
        try {
            const associationForm = field.props.associationForm;
            const appName = associationForm.appName;
            let reseachName = "";

            // 查找目标应用
            let targetAppInfo = appInfoCache.get(appName);

            if (!targetAppInfo) {
                reseachName = appName.split("-")[1];
                targetAppInfo = appInfoCache.get(reseachName);

                if (!targetAppInfo) {
                    console.error(`找不到目标应用信息【${appName}】`);
                    continue;
                }
            }

            // 从缓存中获取字段数据
            const listField = fieldCache.get(targetAppInfo.appId);
            if (!listField) {
                console.warn(`应用 ${targetAppInfo.appId} 的表单+字段信息，跳过处理`);
                continue;
            }

            // 查找对应的表单信息
            const formInfo = findFormInfo(listField.content, associationForm);

            if (!formInfo) {
                errorList.push({
                    targetInfo: targetAppInfo,
                    message: `目标应用【${targetAppInfo.appName}】未找到映射表单【form：${associationForm.formTitle}】，跳过处理`,
                });
                continue;
            }

            // 获取目标字段信息
            const fieldInfo = formInfo.fields.find(fieldItem => {
                const name = fieldItem.name?.zh_CN || '';
                const target = associationForm.mainFieldLabel;
                if (target && typeof target === 'object') {
                    return normalize(name) === normalize(target.zh_CN || '');
                } else if (target) {
                    return normalize(name) === normalize(target);
                } else if (associationForm.mainFieldId) {
                    return fieldItem.fieldId === associationForm.mainFieldId;
                }
                return false;
            });

            // 如果找不到字段信息，记录错误但继续处理
            if (!fieldInfo) {
                const missingFieldName = associationForm.mainFieldLabel?.zh_CN || associationForm.mainFieldLabel || associationForm.mainFieldId || '';
                const warningMsg = `在表单 ${formInfo.title?.zh_CN || ''} 中未找到字段：${missingFieldName}`;
                console.warn(warningMsg, associationForm);
                if (typeof window._logAppend === 'function') {
                    window._logAppend(warningMsg, 'warn');
                }
                continue;
            }

            // 构建结果
            resultList.push({
                fieldId: field.props.fieldId, // 当前表单的字段ID
                label: field.props.label?.zh_CN || '', // 当前字段的标签
                from: {
                    appName: associationForm.appName,
                    appId: associationForm.appType,
                    appOriginalName: reseachName || associationForm.appName,
                    formName: associationForm.formTitle,
                    formUuid: associationForm.formUuid,
                    fieldId: associationForm.mainFieldId,
                    fieldName: typeof associationForm.mainFieldLabel === 'object'
                        ? associationForm.mainFieldLabel.zh_CN
                        : associationForm.mainFieldLabel || '',
                },
                to: {
                    appName: targetAppInfo.appName,
                    appId: targetAppInfo.appId,
                    appOriginalName: targetAppInfo.appOriginalName || reseachName || "",
                    formName: formInfo?.title?.zh_CN || "",
                    formUuid: formInfo?.formUuid || "",
                    fieldId: fieldInfo.fieldId || "",
                    fieldName: fieldInfo.name?.zh_CN || fieldInfo.zh_CN || "",
                    fieldType: fieldInfo.type || "",
                }
            });

        } catch (error) {
            console.error(`处理关联表单字段失败:`, error, field);
            errorList.push({
                field: field.props.fieldId,
                label: field.props.label?.zh_CN,
                error: error.message
            });
        }
    }

    console.log('处理完成:', { resultCount: resultList.length, errorCount: errorList.length });
    return { errorList, resultList };
};

const event_convertForm = async () => {
    const input = document.querySelector("#conversion-input");
    const output = document.querySelector("#conversion-result");
    const log = (text, level = 'info') => {
        if (typeof window._logAppend === 'function') {
            window._logAppend(text, level);
        }
    };
    const inputStr = input.value;
    let inputValue;

    try {
        inputValue = JSON.parse(input.value);
    } catch (error) {
        console.error("JSON解析失败:", error);
        output.value = "JSON解析失败，请检查输入格式";
        log("JSON解析失败", 'error');
        return;
    }
    log("开始转换");
    log("获取关联表单转换信息");
    const convertFormInfoList = await getConvertInfo(inputValue);
    log(`获取到关联表单转换信息，结果数：${convertFormInfoList?.resultList?.length || 0}`);

    if (convertFormInfoList.resultList && convertFormInfoList.resultList.length) {
        log("开始置换");
        const targetList = convertFormInfoList.resultList;
        targetList.forEach(item => {
            replaceAssociationFormInTree(inputValue.componentsTree, item);
        });
        log(`置换完成，修改了${targetList.length}个关联表单字段`);
    } else {
        log("未找到需要置换的关联表单字段");
    }

    if (convertFormInfoList.errorList && convertFormInfoList.errorList.length) {
        console.error("转换过程中出现错误:", convertFormInfoList.errorList);
        log(`转换过程中出现错误：${convertFormInfoList.errorList.length}项`, 'error');
        convertFormInfoList.errorList.forEach((item, index) => {
            const label = item.label || item.field || '';
            const msg = item.message || item.error || '未知错误';
            log(`错误${index + 1}：${label ? `${label} - ` : ''}${msg}`, 'error');
        });
    }
    const outputStr = JSON.stringify(inputValue, null, 2);
    output.value = outputStr;
    log("转换完成，输出结果已更新");
};

const event_convertApprovalForm = async () => {
    const input = document.querySelector("#approval-conversion-input");
    const output = document.querySelector("#approval-conversion-result");
    const log = (text, level = 'info') => {
        if (typeof window._logAppend === 'function') {
            window._logAppend(text, level);
        }
    };
    let inputValue;
    try {
        inputValue = JSON.parse(input.value);
    } catch (error) {
        output.value = "JSON解析失败，请检查输入格式";
        log("JSON解析失败", 'error');
        return;
    }
    const hasTextSuffix = (t) => /\s*文本$/.test(t || '');
    const buildStandardTextField = (node, labelText) => {
        const fieldId = node && node.props ? node.props.fieldId : '';
        return {
            componentName: 'TextField',
            props: {
                __useMediator: 'value',
                hasClear: true,
                validationType: 'text',
                __gridSpan: 1,
                linkage: '',
                tips: {
                    en_US: '',
                    zh_CN: '',
                    type: 'i18n'
                },
                valueType: 'custom',
                labelTextAlign: 'left',
                placeholder: {
                    type: 'i18n',
                    zh_CN: '请输入',
                    en_US: 'Please enter'
                },
                behavior: 'NORMAL',
                value: {
                    type: 'i18n',
                    zh_CN: '',
                    en_US: ''
                },
                validation: [],
                hasLimitHint: false,
                fieldId: fieldId,
                autoHeight: false,
                visibility: [
                    'PC',
                    'MOBILE'
                ],
                dataEntryMode: false,
                submittable: 'ALWAYS',
                label: {
                    type: 'i18n',
                    zh_CN: labelText || '',
                    en_US: 'Text Field'
                },
                __category__: 'form',
                rows: 4,
                labelColSpan: 4,
                scanCode: {
                    enabled: false,
                    type: 'all',
                    editable: true
                },
                complexValue: {
                    complexType: 'custom',
                    formula: '',
                    value: {
                        en_US: '',
                        zh_CN: '',
                        type: 'i18n'
                    }
                },
                size: 'medium',
                labelAlign: 'top',
                variable: '',
                formula: '',
                maxLength: 200,
                events: {
                    ignored: true
                },
                onChange: {
                    ignored: true
                },
                onFocus: {
                    ignored: true
                },
                onBlur: {
                    ignored: true
                },
                onPaste: {
                    ignored: true
                },
                onKeyDown: {
                    ignored: true
                },
                onPressEnter: {
                    ignored: true
                },
                onScanCodeSuccess: {
                    ignored: true
                },
                onScanCodeError: {
                    ignored: true
                },
                formularZoneCode: ''
            },
            condition: node && typeof node.condition === 'boolean' ? node.condition : true,
            hidden: node && typeof node.hidden === 'boolean' ? node.hidden : false,
            title: node && typeof node.title === 'string' ? node.title : '',
            isLocked: node && typeof node.isLocked === 'boolean' ? node.isLocked : false,
            conditionGroup: node && typeof node.conditionGroup === 'string' ? node.conditionGroup : ''
        };
    };
    const transformTree = (nodes) => {
        if (!Array.isArray(nodes)) return [];
        const result = [];
        for (const node of nodes) {
            if (node.componentName === 'SerialNumberField') node.componentName = 'TextField';
            const titleText = typeof node.title === 'string' ? node.title : '';
            if (node.props) {
                const lab = node.props.label;
                const labText = lab && typeof lab === 'object' ? lab.zh_CN : lab;
                if (labText === '审核状态' || hasTextSuffix(labText) || hasTextSuffix(titleText)) continue;
            } else if (hasTextSuffix(titleText)) {
                continue;
            }
            if (node.componentName === 'AssociationFormField') {
                const lab = node.props ? node.props.label : null;
                const labText = lab && typeof lab === 'object' ? lab.zh_CN : lab;
                const rebuilt = buildStandardTextField(node, labText);
                if (rebuilt.props && rebuilt.props.behavior === 'HIDDEN') continue;
                if (rebuilt.props) rebuilt.props.behavior = 'DISABLED';
                result.push(rebuilt);
                continue;
            }
            if (node.props) {
                if (node.props.behavior === 'HIDDEN') {
                    continue;
                }
                node.props.behavior = 'DISABLED';
            }
            if (node.children && node.children.length > 0) {
                node.children = transformTree(node.children);
            }
            result.push(node);
        }
        return result;
    };
    log("开始转换审批表单");
    if (inputValue && Array.isArray(inputValue.componentsTree)) {
        inputValue.componentsTree = transformTree(inputValue.componentsTree);
    }
    output.value = JSON.stringify(inputValue, null, 2);
    log("转换完成，审批表单输出已更新");
};

function replaceAssociationFormInTree(tree, conversionInfo) {
    if (!Array.isArray(tree)) return;

    for (const node of tree) {
        if (node.componentName === 'AssociationFormField' &&
            node.props && node.props.fieldId === conversionInfo.fieldId) {

            if (node.props.associationForm) {
                const fromForm = conversionInfo.from?.formName || '';
                const fromField = conversionInfo.from?.fieldName || '';
                const toForm = conversionInfo.to?.formName || '';
                const toField = conversionInfo.to?.fieldName || '';
                const label = conversionInfo.label || '';
                if (typeof window._logAppend === 'function') {
                    window._logAppend(`已替换 ${conversionInfo.fieldId} (${label})：${fromForm}.${fromField} -> ${toForm}.${toField}`);
                }

                const oldFormInfo = node.props.associationForm;

                node.props.associationForm = {
                    ...oldFormInfo,
                    appName: conversionInfo.to.appName,
                    appType: conversionInfo.to.appId,
                    formTitle: conversionInfo.to.formName,
                    formUuid: conversionInfo.to.formUuid,
                    mainFieldId: conversionInfo.to.fieldId,
                    mainFieldLabel: {
                        zh_CN: conversionInfo.to.fieldName,
                        en_US: conversionInfo.to.fieldName,
                        type: "i18n"
                    }
                };
                if (typeof window._logAppend === 'function') {
                    window._logAppend(`目标表单：${oldFormInfo.formTitle} -> ${conversionInfo.to.formName}`);
                }
            }
        }

        if (node.children && node.children.length > 0) {
            replaceAssociationFormInTree(node.children, conversionInfo);
        }
    }
}

// 注入CSS样式
const injectStyles = () => {
    const styleId = 'yida-toolbox-styles';
    if (document.getElementById(styleId)) return;
    const css = `
        #script-toolbox {
            position: fixed;
            top: 60px;
            left: 20px;
            z-index: 9999;
            background: white;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 300px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: opacity 0.2s, transform 0.2s;
        }
        .st-header {
            display: flex;
            align-items: center;
            background: #f5f5f5;
            border-bottom: 1px solid #e8e8e8;
            height: 36px;
            padding: 0 8px 0 12px;
            cursor: move;
            user-select: none;
        }
        .st-title {
            flex: 1;
            font-weight: 600;
            font-size: 13px;
            color: #333;
        }
        .st-controls {
            display: flex;
            gap: 4px;
        }
        .st-icon-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
            color: #666;
            transition: background 0.2s;
            font-size: 16px;
            line-height: 1;
        }
        .st-icon-btn:hover {
            background: #e6e6e6;
            color: #333;
        }
        .st-tabs {
            display: flex;
            border-bottom: 1px solid #e8e8e8;
            background: #fff;
        }
        .st-tab {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            cursor: pointer;
            font-size: 13px;
            color: #666;
            transition: all 0.2s;
            border-bottom: 2px solid transparent;
            background: #fafafa;
        }
        .st-tab:hover {
            color: #1890ff;
            background: #fff;
        }
        .st-tab.active {
            color: #1890ff;
            border-bottom-color: #1890ff;
            background: #fff;
            font-weight: 500;
        }
        .st-content-area {
            padding: 12px;
            background: #fff;
        }
        .st-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 8px;
        }
        .st-label {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
        }
        .st-select, .st-input {
            flex: 1;
            padding: 5px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            transition: all 0.2s;
            min-width: 0;
            box-sizing: border-box;
        }
        .st-select:focus, .st-input:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }
        .st-btn {
            padding: 6px 12px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            outline: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }
        .st-btn:active {
            transform: translateY(1px);
        }
        .st-btn-primary { background: #1890ff; color: white; }
        .st-btn-primary:hover { background: #40a9ff; }
        .st-btn-purple { background: #722ed1; color: white; }
        .st-btn-purple:hover { background: #9254de; }
        .st-btn-success { background: #52c41a; color: white; }
        .st-btn-success:hover { background: #73d13d; }
        .st-btn-warn { background: #fa8c16; color: white; }
        .st-btn-warn:hover { background: #ffc069; }
        .st-btn-danger { background: #f5222d; color: white; }
        .st-btn-danger:hover { background: #ff4d4f; }
        .st-btn-block { width: 100%; margin-bottom: 8px; }
        .st-btn-icon { padding: 4px 8px; background: #f0f0f0; color: #666; border: 1px solid #d9d9d9; }
        .st-btn-icon:hover { background: #e6e6e6; color: #333; }

        .st-log-title {
            padding: 0 12px 4px;
            font-size: 12px;
            color: #333;
            font-weight: 500;
            border-top: 1px solid #f0f0f0;
            padding-top: 8px;
        }
        .st-log-area {
            margin: 0 12px 12px;
            padding: 8px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            height: 100px;
            overflow-y: auto;
            font-size: 11px;
            line-height: 1.5;
            color: #666;
            font-family: monospace;
        }
        .st-log-area::-webkit-scrollbar { width: 6px; height: 6px; }
        .st-log-area::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .st-log-area::-webkit-scrollbar-track { background: transparent; }

        .st-floater {
            position: fixed;
            top: 120px;
            left: 0;
            z-index: 9998;
            width: 36px;
            height: 36px;
            background: #1890ff;
            border-radius: 0 4px 4px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
            transition: all 0.2s;
            color: white;
            font-size: 20px;
            opacity: 0.8;
        }
        .st-floater:hover {
            width: 44px;
            opacity: 1;
        }

        /* Designer Panel Styles */
        .st-designer-panel {
            position: fixed;
            top: 48px;
            left: 48px;
            bottom: 0;
            width: 300px;
            background: white;
            border-right: 1px solid #e8e8e8;
            z-index: 999;
            display: none;
            flex-direction: column;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
        }
        .lc-panel-title.actived {
            height: 48px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            border-bottom: 1px solid #e8e8e8;
            font-weight: 500;
            font-size: 14px;
            color: #111;
        }
    `;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
};

const create = (tag, className, text, attrs = {}) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'onclick') el.onclick = v;
        else if (k.startsWith('data-')) el.dataset[k.substring(5)] = v;
        else el[k] = v;
    });
    return el;
};

const createToolboxContent = (options = { showFill: true, showConvert: true, showOutline: false, showApprovalConvert: false }) => {
    const { showFill, showConvert, showOutline, showApprovalConvert } = options;

    // 标签页头部
    const tabHeader = create('div', 'st-tabs');
    const fillTab = create('div', 'st-tab', '填充字段', { 'data-tab': 'fill' });
    const convertTab = create('div', 'st-tab', '转换表单', { 'data-tab': 'convert' });
    const approvalConvertTab = create('div', 'st-tab', '转换审批表单', { 'data-tab': 'approval-convert' });
    const outlineTab = create('div', 'st-tab', '字段大纲', { 'data-tab': 'outline' });

    if (showFill) tabHeader.append(fillTab);
    if (showConvert) tabHeader.append(convertTab);
    if (showApprovalConvert) tabHeader.append(approvalConvertTab);
    if (showOutline) tabHeader.append(outlineTab);

    // 内容区域
    const contentArea = create('div', 'st-content-area');

    // --- 填充字段内容 ---
    const fillContent = create('div', '', null, { id: 'fill-content', style: 'display: none;' });
    if (showFill) {
        const modeRow = create('div', 'st-row');
    const modeLabel = create('span', 'st-label', '模式：');
    const modeSelect = create('select', 'st-select');
    [
        { value: 'A', text: 'A：忽略缺失' },
        { value: 'B', text: 'B：转为公式' },
        { value: 'C', text: 'C：文本优先' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.text;
        if (opt.value === window.fillRule) o.selected = true;
        modeSelect.appendChild(o);
    });
    modeSelect.onchange = () => { window.fillRule = modeSelect.value; };
    modeRow.append(modeLabel, modeSelect);

    const dsRow = create('div', 'st-row');
    const dsLabel = create('span', 'st-label', '数据源：');
    const dsSelect = create('select', 'st-select');
    const dsRefresh = create('button', 'st-btn st-btn-icon', '⟳', { title: '刷新数据源' });

    // 数据源逻辑
    const buildOptions = () => {
        const opts = [];
        const seen = new Set(opts.map(o => o.value));
        if (Array.isArray(window.fillDataSourceOptions)) {
            window.fillDataSourceOptions.forEach(opt => {
                if (opt && opt.value && !seen.has(opt.value)) {
                    opts.push(opt);
                    seen.add(opt.value);
                }
            });
        }
        if (Array.isArray(window.yiDaForms)) {
            window.yiDaForms.forEach(form => {
                const title = (form.title && form.title.zh_CN) || form.title || '';
                if (title) {
                    const value = `form:${form.formUuid || title}`;
                    if (!seen.has(value)) {
                        opts.push({ value, text: `表单：${title}` });
                        seen.add(value);
                    }
                }
            });
        }
        return opts;
    };
    const applyOptions = (options) => {
        const current = window.fillDataSource;
        dsSelect.innerHTML = '';
        options.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.text;
            if (opt.value === current) o.selected = true;
            dsSelect.appendChild(o);
        });
        window.fillDataSource = dsSelect.value;
    };
    const refreshOptions = () => { applyOptions(buildOptions()); };
    dsSelect.onchange = () => { window.fillDataSource = dsSelect.value; };

    // 复用原有的 readPanelOptions 和 tryOpenPanel 逻辑
    const readPanelOptions = () => {
        const panel = document.querySelector('.select-field-panel .deep-tree');
        const items = panel ? panel.querySelectorAll('li.next-tree-node.parent-tree-node') : [];
        const opts = [];
        const seen = new Set();
        if (items && items.length) {
            items.forEach(li => {
                const labelEl = li.querySelector('.single-item-label');
                const label = (labelEl && (labelEl.getAttribute('title') || labelEl.textContent)) || li.getAttribute('datalabel') || li.textContent.trim();
                if (label && !seen.has(label)) {
                    seen.add(label);
                    opts.push({ value: label, text: label });
                }
            });
        }
        return opts;
    };
    const tryOpenPanel = async () => {
        const addRuleItem = async () => {
            const addButton = document.querySelector(".action-rules-editor .rules-group .rules-add-btn");
            if (!addButton) return null;
            const beforeCount = document.querySelectorAll(".action-rules-editor .rules-group .rule-item").length;
            addButton.click();
            const added = await waitFor(() => {
                const nowCount = document.querySelectorAll(".action-rules-editor .rules-group .rule-item").length;
                return nowCount > beforeCount;
            }, 1000, 20);
            if (!added) return null;
            return getLastRuleItem();
        };
        let ruleItem = typeof getLastRuleItem === 'function' ? getLastRuleItem() : null;
        let created = false;
        if (!ruleItem) {
            ruleItem = await addRuleItem();
            created = !!ruleItem;
        }
        if (!ruleItem) return false;
        if (created) {
            const okField = await setFieldName(ruleItem);
            if (!okField) return false;
        }
        let trigger_searchs = ruleItem.querySelectorAll('.next-select-trigger-search');
        if (!trigger_searchs || trigger_searchs.length < 3) {
            ruleItem = await addRuleItem();
            if (!ruleItem) return false;
            const okField = await setFieldName(ruleItem);
            if (!okField) return false;
            trigger_searchs = ruleItem.querySelectorAll('.next-select-trigger-search');
            if (!trigger_searchs || trigger_searchs.length < 3) return false;
        }
        const vtInput = trigger_searchs[1].querySelector('input');
        const vtText = vtInput ? vtInput.getAttribute('aria-valuetext') : null;
        if (vtText !== '字段') {
            const ok = await setValueTypeToField(ruleItem, '字段');
            if (!ok) return false;
        }
        const input = trigger_searchs[2].querySelector('input');
        if (!input) return false;
        const selectContainer = input.closest('.next-select');
        if (selectContainer) {
            selectContainer.setAttribute('data-expanded', 'true');
            selectContainer.classList.add('next-open', 'expanded');
        }
        input.focus();
        await raf();
        input.click();
        await raf();
        return await waitFor(() => document.querySelector('.select-field-panel'), 800, 20);
    };

    dsRefresh.onclick = async () => {
        if (typeof window._logAppend === 'function') window._logAppend('开始刷新数据源');
        let dynamic = readPanelOptions();
        if (!dynamic.length) {
            await tryOpenPanel();
            dynamic = readPanelOptions();
        }
        if (!dynamic.length) {
            const old = dsRefresh.textContent;
            dsRefresh.textContent = '×';
            setTimeout(() => { dsRefresh.textContent = old; }, 1000);
            if (typeof window._logAppend === 'function') window._logAppend('未找到数据源节点', 'warn');
            return;
        }
        const base = [];
        window.fillDataSourceOptions = dynamic;
        applyOptions(base.concat(dynamic));
        if (typeof window._logAppend === 'function') window._logAppend(`已加载数据源：${dynamic.length}项`);
    };

    refreshOptions();
    window._updateDataSourceOptions = refreshOptions;
    dsRow.append(dsLabel, dsSelect, dsRefresh);

    const btnOne = create('button', 'st-btn st-btn-primary st-btn-block', '填充一条数据', { onclick: event_fillOne });
    const btnAll = create('button', 'st-btn st-btn-purple st-btn-block', '填充全部数据', { onclick: evnent_fillAll });

    fillContent.append(modeRow, dsRow, btnOne, btnAll);
    }

    // --- 转换表单内容 ---
    const convertContent = create('div', '', null, { id: 'convert-content', style: 'display: none;' });
    if (showConvert) {
        const inputLabel = create('div', 'st-label', '输入内容：', { style: 'margin-bottom: 4px;font-weight:600;' });
        const inputRow = create('div', 'st-row');
        const textInput = create('input', 'st-input', null, { id: 'conversion-input', placeholder: '请输入要转换的内容...' });
        const btnConvert = create('button', 'st-btn st-btn-success', '转换', { onclick: event_convertForm, style: 'flex-shrink:0;' });
        inputRow.append(textInput, btnConvert);

        const resultLabel = create('div', 'st-label', '转换结果：', { style: 'margin-bottom: 4px;font-weight:600;' });
        const resultRow = create('div', 'st-row');
        const resultInput = create('input', 'st-input', null, { id: 'conversion-result', readOnly: true, placeholder: '转换结果...', style: 'background:#f9f9f9;' });
        const copyButton = create('button', 'st-btn st-btn-warn', '复制', { style: 'flex-shrink:0;' });

        copyButton.onclick = function () {
            const t = resultInput.value;
            if (t) {
                navigator.clipboard.writeText(t).then(() => {
                    const orig = copyButton.textContent;
                    copyButton.textContent = '已复制!';
                    copyButton.className = 'st-btn st-btn-success';
                    setTimeout(() => {
                        copyButton.textContent = orig;
                        copyButton.className = 'st-btn st-btn-warn';
                    }, 1500);
                }).catch(() => {
                    copyButton.textContent = '失败';
                    copyButton.className = 'st-btn st-btn-danger';
                    setTimeout(() => {
                        copyButton.textContent = '复制';
                        copyButton.className = 'st-btn st-btn-warn';
                    }, 1500);
                });
            } else {
                const orig = copyButton.textContent;
                copyButton.textContent = '空';
                copyButton.className = 'st-btn st-btn-danger';
                setTimeout(() => {
                    copyButton.textContent = orig;
                    copyButton.className = 'st-btn st-btn-warn';
                }, 1500);
            }
        };
        resultRow.append(resultInput, copyButton);
        convertContent.append(inputLabel, inputRow, resultLabel, resultRow);
    }

    const approvalConvertContent = create('div', '', null, { id: 'approval-convert-content', style: 'display: none;' });
    if (showApprovalConvert) {
        const inputLabel = create('div', 'st-label', '输入内容：', { style: 'margin-bottom: 4px;font-weight:600;' });
        const inputRow = create('div', 'st-row');
        const textInput = create('input', 'st-input', null, { id: 'approval-conversion-input', placeholder: '请输入要转换的审批表单内容...' });
        const btnConvert = create('button', 'st-btn st-btn-success', '转换', { onclick: event_convertApprovalForm, style: 'flex-shrink:0;' });
        inputRow.append(textInput, btnConvert);

        const resultLabel = create('div', 'st-label', '转换结果：', { style: 'margin-bottom: 4px;font-weight:600;' });
        const resultRow = create('div', 'st-row');
        const resultInput = create('input', 'st-input', null, { id: 'approval-conversion-result', readOnly: true, placeholder: '转换结果...', style: 'background:#f9f9f9;' });
        const copyButton = create('button', 'st-btn st-btn-warn', '复制', { style: 'flex-shrink:0;' });

        copyButton.onclick = function () {
            const t = resultInput.value;
            if (t) {
                navigator.clipboard.writeText(t).then(() => {
                    const orig = copyButton.textContent;
                    copyButton.textContent = '已复制!';
                    copyButton.className = 'st-btn st-btn-success';
                    setTimeout(() => {
                        copyButton.textContent = orig;
                        copyButton.className = 'st-btn st-btn-warn';
                    }, 1500);
                }).catch(() => {
                    copyButton.textContent = '失败';
                    copyButton.className = 'st-btn st-btn-danger';
                    setTimeout(() => {
                        copyButton.textContent = '复制';
                        copyButton.className = 'st-btn st-btn-warn';
                    }, 1500);
                });
            } else {
                const orig = copyButton.textContent;
                copyButton.textContent = '空';
                copyButton.className = 'st-btn st-btn-danger';
                setTimeout(() => {
                    copyButton.textContent = orig;
                    copyButton.className = 'st-btn st-btn-warn';
                }, 1500);
            }
        };
        resultRow.append(resultInput, copyButton);
        approvalConvertContent.append(inputLabel, inputRow, resultLabel, resultRow);
    }

    // --- 字段大纲内容 ---
    const outlineContent = create('div', '', null, { id: 'outline-content', style: 'display: none;' });
    if (showOutline) {
        const searchRow = create('div', 'st-row', null, { style: 'margin-bottom: 8px;' });
        const searchInput = create('input', 'st-input', null, { placeholder: '搜索表单或字段...', style: 'flex: 1; margin-right: 8px;' });
        const refreshBtn = create('button', 'st-btn st-btn-primary', '刷新', { style: 'flex-shrink: 0;' });
        searchRow.append(searchInput, refreshBtn);

        const treeArea = create('div', '', null, { style: 'max-height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 4px;' });

        const renderTree = (filterText = '') => {
            treeArea.innerHTML = '';
            const forms = window.yiDaForms || [];
            if (forms.length === 0) {
                treeArea.textContent = '暂无表单数据，请尝试刷新';
                return;
            }

            const lowerFilter = filterText.toLowerCase().trim();
            let hasMatch = false;

            forms.forEach(form => {
                const title = (form.title && form.title.zh_CN) || form.title || '未命名表单';
                const uuid = form.formUuid;

                // 匹配逻辑
                const matchForm = title.toLowerCase().includes(lowerFilter) || (uuid && uuid.toLowerCase().includes(lowerFilter));
                let matchingFields = [];
                if (form.fields && Array.isArray(form.fields)) {
                    if (matchForm && !lowerFilter) {
                        // 如果没有搜索词，或者是表单匹配但无搜索词(其实就是全部显示)，显示所有字段
                        matchingFields = form.fields;
                    } else {
                        // 过滤字段
                        matchingFields = form.fields.filter(field => {
                            if (matchForm && !lowerFilter) return true; // 如果表单匹配且无搜索词（逻辑上不会进这里，因为上面判断了），显示所有
                            if (matchForm) return true; // 如果表单匹配，显示所有字段（策略A：表单匹配显示所有）
                            // 策略B：字段匹配
                            const fName = (field.name && field.name.zh_CN) || field.label || field.fieldId || '';
                            const fId = field.fieldId || '';
                            const fType = field.componentName || '';
                            return fName.toLowerCase().includes(lowerFilter) ||
                                   fId.toLowerCase().includes(lowerFilter) ||
                                   fType.toLowerCase().includes(lowerFilter);
                        });
                    }
                }

                // 如果有搜索词，且表单不匹配且无匹配字段，则跳过
                if (lowerFilter && !matchForm && matchingFields.length === 0) {
                    return;
                }

                hasMatch = true;

                const formNode = create('div', '', null, { style: 'margin-bottom: 4px;' });

                // 表单标题行
                const formHeader = create('div', '', null, {
                    style: 'cursor: pointer; padding: 4px; background: #f0f0f0; display: flex; align-items: center; font-weight: bold;'
                });
                const icon = create('span', '', '▶ ', { style: 'font-size: 10px; margin-right: 4px; transition: transform 0.2s;' });
                const label = create('span', '', title);
                formHeader.append(icon, label);

                // 字段列表容器
                const fieldsList = create('div', '', null, { style: 'display: none; padding-left: 16px;' });

                // 如果有搜索词，默认展开
                if (lowerFilter) {
                    fieldsList.style.display = 'block';
                    icon.style.transform = 'rotate(90deg)';
                }

                formHeader.onclick = () => {
                    const isExpanded = fieldsList.style.display !== 'none';
                    fieldsList.style.display = isExpanded ? 'none' : 'block';
                    icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
                };

                if (matchingFields.length > 0) {
                    matchingFields.forEach(field => {
                        const fName = (field.name && field.name.zh_CN) || field.label || field.fieldId;
                        const fId = field.fieldId;
                        const fType = field.componentName || 'Unknown';

                        const fieldNode = create('div', '', null, {
                            style: 'padding: 2px 4px; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between; align-items: center; font-size: 11px;'
                        });
                        const fInfo = create('span', '', `${fName} (${fType})`, { title: fId });
                        const copyBtn = create('button', '', 'ID', {
                            style: 'border: 1px solid #ccc; background: #fff; cursor: pointer; padding: 0 2px; border-radius: 2px; font-size: 10px; color: #666;',
                            title: '复制ID: ' + fId
                        });

                        copyBtn.onclick = (e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(fId).then(() => {
                                copyBtn.textContent = 'OK';
                                setTimeout(() => copyBtn.textContent = 'ID', 1000);
                            });
                        };

                        fieldNode.append(fInfo, copyBtn);
                        fieldsList.append(fieldNode);
                    });
                } else {
                    fieldsList.textContent = '无匹配字段';
                    fieldsList.style.color = '#999';
                    fieldsList.style.padding = '4px';
                }

                formNode.append(formHeader, fieldsList);
                treeArea.append(formNode);
            });

            if (lowerFilter && !hasMatch) {
                treeArea.innerHTML = '<div style="padding:8px;color:#999;text-align:center">未找到匹配内容</div>';
            }
        };

        searchInput.oninput = (e) => {
            renderTree(e.target.value);
        };

        refreshBtn.onclick = () => {
            // 尝试重新获取数据 (如果 scriptInfo 可用)
            if (window.yiDaScript && window.yiDaScript.services && window.yiDaScript.services.getListFieldInApp) {
                 window.yiDaScript.services.getListFieldInApp().then(res => {
                    window.yiDaForms = res.content;
                    renderTree(searchInput.value);
                    if(window._logAppend) window._logAppend('字段列表已刷新');
                 });
            } else {
                renderTree(searchInput.value);
            }
        };

        // 初始渲染
        setTimeout(() => renderTree(), 500); // 稍微延迟以确保数据加载
        outlineContent.append(searchRow, treeArea);
    }

    if (showFill) contentArea.append(fillContent);
    if (showConvert) contentArea.append(convertContent);
    if (showApprovalConvert) contentArea.append(approvalConvertContent);
    if (showOutline) contentArea.append(outlineContent);

    // --- 日志区域 ---
    const logTitle = create('div', 'st-log-title', '运行日志');
    const logArea = create('div', 'st-log-area');
    window._logClear = () => { logArea.innerHTML = ''; };
    window._logAppend = (text, level = 'info') => {
        const line = document.createElement('div');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        if (level === 'error') line.style.color = '#f5222d';
        else if (level === 'warn') line.style.color = '#fa8c16';
        else line.style.color = '#333';
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    };

    // Tab切换逻辑
    function switchTab(active) {
        const tabs = [fillTab, convertTab, approvalConvertTab, outlineTab];
        const contents = [fillContent, convertContent, approvalConvertContent, outlineContent];
        tabs.forEach(t => {
            if (t.dataset.tab === active) t.classList.add('active');
            else t.classList.remove('active');
        });
        contents.forEach(c => {
            c.style.display = (c.id === `${active}-content`) ? 'block' : 'none';
        });
    }
    fillTab.onclick = () => switchTab('fill');
    convertTab.onclick = () => switchTab('convert');
    approvalConvertTab.onclick = () => switchTab('approval-convert');
    outlineTab.onclick = () => switchTab('outline');

    // 默认选中第一个可用Tab
    if (showFill) switchTab('fill');
    else if (showConvert) switchTab('convert');
    else if (showApprovalConvert) switchTab('approval-convert');
    else if (showOutline) switchTab('outline');

    return {
        tabHeader,
        contentArea,
        logTitle,
        logArea
    };
};


// 构建GUI (普通页面)
const buildUI = () => {
    injectStyles();

    // 悬浮球（隐藏时显示）
    const floater = create('div', 'st-floater', '🛠️', { title: '点击展开工具箱', style: 'display: none;' });
    document.body.appendChild(floater);

    // 主容器
    const container = create('div', '', null, { id: 'script-toolbox' });

    // 标题栏
    const header = create('div', 'st-header');
    const title = create('div', 'st-title', '宜搭脚本工具箱 v3.0');
    const controls = create('div', 'st-controls');

    // 最小化逻辑
    const toggleMinimize = (minimize) => {
        if (minimize) {
            container.style.display = 'none';
            floater.style.display = 'flex';
        } else {
            container.style.display = 'flex';
            floater.style.display = 'none';
        }
    };

    const minBtn = create('div', 'st-icon-btn', '−', { title: '最小化' });
    minBtn.onclick = () => toggleMinimize(true);
    controls.append(minBtn);
    floater.onclick = () => toggleMinimize(false);

    header.append(title, controls);

    // 拖拽逻辑（仅标题栏可拖拽）
    function makeDraggable(handle, target) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        handle.addEventListener('mousedown', e => {
            if (['BUTTON', 'INPUT'].includes(e.target.tagName) || e.target.classList.contains('st-icon-btn')) return;
            isDragging = true;
            const rect = target.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });
        function onDrag(e) {
            if (!isDragging) return;
            target.style.left = `${e.clientX - offsetX}px`;
            target.style.top = `${e.clientY - offsetY}px`;
        }
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }
    makeDraggable(header, container);

    // 获取内容
    const { tabHeader, contentArea, logTitle, logArea } = createToolboxContent({ showFill: true, showConvert: false, showOutline: false });

    // 组装
    container.append(header, tabHeader, contentArea, logTitle, logArea);
    document.body.appendChild(container);
};

// 构建GUI (设计器页面)
const buildUIbyDesignerPage = () => {
    injectStyles();

    // 注入侧边栏逻辑
    const injectSidebar = async () => {
        const getSidebar = () => document.querySelector('.lc-left-area-top');
        // 等待侧边栏出现
        await waitFor(() => getSidebar(), 10000, 500);
        const sidebar = getSidebar();
        if (!sidebar) {
            console.warn('未找到侧边栏 .lc-left-area-top，无法注入工具箱入口');
            return;
        }

        // 检查是否已注入，避免重复
        if (sidebar.querySelector('.st-sidebar-trigger')) return;

        // 面板容器
        const panel = create('div', 'st-designer-panel');
        // 面板头部 (使用用户提供的DOM结构)
        const panelHeader = create('div', 'lc-panel-title actived', null, { 'data-name': 'yidaTool' });
        panelHeader.innerHTML = '<span class="lc-title"><span class="lc-title-txt">宜搭脚本工具箱</span></span>';

        // 获取内容
        const { tabHeader, contentArea, logTitle, logArea } = createToolboxContent({ showFill: false, showConvert: true, showOutline: true, showApprovalConvert: true });

        panel.append(panelHeader, tabHeader, contentArea, logTitle, logArea);
        document.body.appendChild(panel);

        const triggerDiv = document.createElement('div');
        // 使用 st-sidebar-trigger 以便后续查找，同时不影响内部结构
        triggerDiv.className = 'st-sidebar-trigger';
        // 使用用户提供的精准结构和SVG路径
        triggerDiv.innerHTML = `
            <span class="lc-title lc-dock has-tip only-icon" style="cursor: pointer;">
                <b class="lc-title-icon">
<svg t="1769513383020" class="icon" viewBox="0 0 1503 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1904"><path d="M888.365571 587.687877m-413.240638 0a413.240638 413.240638 0 1 0 826.481277 0 413.240638 413.240638 0 1 0-826.481277 0Z" fill="#F1F1F3" p-id="1905"></path><path d="M1160.531486 492.579736c18.979295-11.676853 37.358873-23.353705 55.068178-34.99528-4.444965-45.57853-15.698488-89.922348-33.619458-132.255349-15.23988-36.053605-34.889448-69.673063-58.631205-100.435043-19.367348 5.573845-39.158025 11.57102-59.336756 17.956248 58.207875 67.415303 94.190926 154.480174 96.519241 249.729424zM762.636561 900.528749c-84.983498 0-163.828711-26.775623-228.562925-72.354153-22.01316 7.796328-43.708823 15.204603-65.05171 22.15427 34.99528 29.597823 74.012196 53.586523 116.415751 71.542771 56.126503 23.741758 115.745478 35.771385 177.163606 35.771385 61.418128 0 121.037103-12.029628 177.163606-35.771385 54.221518-22.930375 102.869191-55.73845 144.673029-97.542288s74.611913-90.451511 97.542288-144.673029c23.741758-56.126503 35.771385-115.745478 35.771385-177.163606 0-1.83443 0-3.633583-0.035277-5.432735-18.802908 12.064905-38.24081 24.200365-58.278431 36.300547-15.769043 205.103387-187.711579 367.168223-396.801322 367.168223zM364.600525 502.492714c0-219.461329 178.539429-398.036035 398.036036-398.036036 106.714438 0 203.727564 42.19189 275.270334 110.806629 20.88428-6.77328 41.380508-13.158508 61.418128-19.085128-4.79774-5.291625-9.771868-10.477418-14.851828-15.557378-41.803838-41.803838-90.451511-74.611913-144.673028-97.542288-56.126503-23.741758-115.745478-35.771385-177.163606-35.771385-61.418128 0-121.037103 12.029628-177.163607 35.771385-54.221518 22.930375-102.869191 55.73845-144.673028 97.542288-41.803838 41.839115-74.611913 90.522066-97.542289 144.708306-23.741758 56.126503-35.771385 115.745478-35.771385 177.163607 0 17.391808 0.952493 34.607228 2.892755 51.64626 17.709305-11.077135 35.947773-22.189548 54.680126-33.266683-0.317498-6.06773-0.458608-12.206015-0.458608-18.379577zM368.551605 558.689772c-17.991525 10.794915-35.524443 21.625108-52.49292 32.384745 5.961898 30.303373 15.063493 59.901195 27.198952 88.61708 22.789265 53.90402 55.385675 102.340028 96.836739 143.967479 20.284563-6.455783 40.9219-13.299618 61.912013-20.566783-70.731388-61.418128-119.661281-147.318841-133.454784-244.402521z" p-id="1906"></path><path d="M502.006389 803.092293c10.230475 8.88993 20.954835 17.250698 32.067247 25.082303 94.896476-33.619458 195.790126-74.929411 297.77738-122.130706 118.638233-54.89179 230.220967-113.840493 327.622145-172.683364 0.776105-10.195198 1.199435-20.46095 1.199435-30.867812 0-3.316085-0.035278-6.63217-0.14111-9.948255-100.576153 61.94729-217.803287 124.423743-343.07369 182.384676-108.513591 50.23516-215.686637 93.697041-315.451407 128.163158zM1498.560493 187.817411c-6.843835-14.781273-19.89651-26.070073-38.769972-33.548902-16.08654-6.34995-36.935543-10.054088-61.912013-10.971303-46.954353-1.728598-108.936921 5.997175-184.219107 22.930375-36.088883 8.113825-74.364971 18.167913-114.334378 29.985875 8.431323 9.277983 16.474593 18.838185 24.059255 28.680608 34.078065-9.807145 66.780308-18.238468 97.824508-25.223413 65.89837-14.851828 120.719606-22.365935 163.193717-22.365935 4.198023 0 8.254935 0.070555 12.206015 0.211665 38.981638 1.446378 64.134495 10.195198 70.83722 24.658973 6.702725 14.463775-2.928033 39.334413-27.057842 69.955283-27.23423 34.607228-71.119441 74.753023-130.385641 119.379061-28.78644 21.660385-60.39508 43.779378-94.367314 66.03948 1.26999 13.052675 1.97554 26.211183 2.151928 39.475523 40.992455-26.352293 78.845213-52.528198 112.852723-78.104385 61.629793-46.389913 107.631653-88.652358 136.735591-125.552624 15.486823-19.649568 26.140628-37.923313 31.714473-54.32735 6.49106-19.19096 6.314673-36.441658-0.529163-51.222931zM440.094376 823.659076c-55.809005 17.744583-108.725256 32.31419-157.478761 43.32077-72.389431 16.298205-131.408688 23.741758-175.399732 22.118993-38.981638-1.446378-64.134495-10.195198-70.83722-24.658973-6.702725-14.463775 2.928033-39.334413 27.057842-69.955283 27.23423-34.607228 71.119441-74.753023 130.385641-119.379061 36.512213-27.481173 77.539946-55.632618 122.236539-83.995728-2.39887-12.206015-4.303855-24.517863-5.714955-36.900265-50.411548 31.502808-96.519241 62.899783-137.123644 93.485376-61.629793 46.389913-107.631653 88.652358-136.735591 125.552623-15.486823 19.649568-26.140628 37.923313-31.714472 54.327351-6.526338 19.226238-6.34995 36.476935 0.493885 51.258207 6.843835 14.781273 19.89651 26.070073 38.769972 33.548903 16.08654 6.34995 36.935543 10.054088 61.912013 10.971303 4.303855 0.176388 8.74882 0.246943 13.299618 0.246942 45.1552 0 102.551693-7.796328 170.884211-23.177317 55.068178-12.41768 115.251593-29.280325 178.892204-50.058773-9.73659-8.219658-19.155683-16.897923-28.257278-25.999518-0.211665-0.246943-0.42333-0.458608-0.670272-0.70555z" p-id="1907"></path><path d="M368.551605 558.689772c-1.763875-12.41768-2.96331-25.047025-3.52775-37.782203-18.732353 11.112413-36.97082 22.189548-54.680125 33.266683 1.4111 12.41768 3.316085 24.69425 5.714955 36.900265 17.003755-10.759638 34.501395-21.58983 52.49292-32.384745zM1064.0828 242.850312c20.17873-6.420505 39.969408-12.41768 59.336756-17.956248-7.61994-9.842423-15.627933-19.437903-24.059255-28.680608-20.072898 5.92662-40.569125 12.27657-61.418128 19.085128 9.101595 8.74882 17.850415 17.956248 26.140627 27.551728zM1160.531486 492.579736c0.070555 3.316085 0.14111 6.596893 0.14111 9.948255 0 10.371585-0.388053 20.672615-1.199435 30.867813 20.03762-12.13546 39.5108-24.235643 58.27843-36.300548-0.14111-13.26434-0.881938-26.422848-2.151927-39.475523-17.709305 11.606298-36.088883 23.28315-55.068178 34.960003zM502.006389 803.092293c-20.990113 7.267165-41.62745 14.111-61.912013 20.566783 0.246943 0.246943 0.458608 0.458608 0.670272 0.70555 9.101595 9.101595 18.520688 17.744583 28.257278 25.999518 21.30761-6.949668 43.003273-14.357943 65.05171-22.15427-11.112413-7.831605-21.836773-16.22765-32.067247-25.117581zM424.713386 516.215661c-1.658043-35.41861 1.55221-70.696111 9.524925-104.915285 17.07431-72.953871 59.40731-125.305681 82.161298-153.386572l1.199435-1.481655 24.588417 19.896511-1.199435 1.516932c-22.648155 27.975058-60.53619 74.823578-75.952458 140.721949-7.33772 31.361698-10.265753 63.711165-8.74882 96.201743l-31.573362 1.446377zM431.618603 578.03948l29.868754-10.452017 15.998347 45.718582-29.868401 10.452017zM634.543957 533.360526h-29.103938L599.760342 555.973404h-24.059255l30.550315-98.388948h28.292555l30.550315 98.388948h-24.870637l-5.679678-22.612878z m-4.480242-18.238467l-2.11665-8.32549c-2.645813-9.771868-5.150515-21.554553-7.796328-31.608641h-0.529162c-2.363593 10.30103-5.009405 21.836773-7.549386 31.608641l-2.11665 8.32549h20.108176zM669.327572 507.325731c0-32.808075 21.942605-51.575705 46.954353-51.575705 12.84101 0 23.14204 5.961898 29.880043 12.84101l-12.41768 15.063493c-4.903573-4.480243-10.054088-7.655218-17.07431-7.655218-12.6999 0-23.14204 11.359355-23.14204 30.550315 0 19.579013 8.995763 30.938368 22.895097 30.938368 7.796328 0 14.146278-3.95108 18.76763-8.995763l12.41768 14.81655c-8.32549 9.666035-19.296793 14.53433-32.137802 14.534331-24.97647 0-46.14297-17.180143-46.142971-50.517381zM751.876923 507.325731c0-32.808075 22.083715-51.575705 48.40073-51.575705 14.428498 0 24.729528 6.06773 31.467531 12.84101L819.186393 483.654529c-4.762463-4.37441-9.912978-7.655218-18.132635-7.655218-14.53433 0-25.011748 11.359355-25.011747 30.550315 0 19.579013 8.713543 30.938368 26.987287 30.938368 3.563028 0 7.267165-0.917215 9.383815-2.504703v-15.874875h-15.592655v-19.296792h36.653323v46.037137c-6.879113 6.596893-19.04985 12.029628-32.808075 12.029628-27.37534-0.035278-48.788783-17.21542-48.788783-50.552658zM853.299736 457.584456h24.059255l24.482586 47.095463 9.666035 21.836772h0.670272c-1.340545-10.44214-3.174975-24.588418-3.174975-36.371102v-32.525856h22.471768V555.973404h-24.059255l-24.341476-47.483515-9.666035-21.554553h-0.670272c1.058325 10.971303 3.033865 24.482585 3.033865 36.371103v32.666965h-22.471768v-98.388948z" p-id="1908"></path></svg>                </b>
                <meta data-role="tip">
            </span>
        `;
        triggerDiv.title = "宜搭脚本工具箱";
        triggerDiv.onclick = (e) => {
            e.stopPropagation();
            if (panel.style.display === 'none') {
                // 关闭其他侧边栏项
                Array.from(sidebar.children).forEach(child => {
                    if (child !== triggerDiv && (child.classList.contains('actived') || child.classList.contains('active'))) {
                        child.click();
                    }
                });

                panel.style.display = 'flex';
                // 确保样式正确
                panel.style.top = '48px';
                panel.style.left = '48px';
            } else {
                panel.style.display = 'none';
            }
        };

        // 点击侧边栏其他项时隐藏当前面板
        sidebar.addEventListener('click', (e) => {
            if (!triggerDiv.contains(e.target) && e.target !== triggerDiv) {
                panel.style.display = 'none';
            }
        });

        sidebar.appendChild(triggerDiv);
    };
    injectSidebar();
};

function scriptInit() {
    try {
        const urlObj = new URL(window.location.href);
        const hostname = urlObj.hostname;
        const pathname = urlObj.pathname;

        const domainPrefix = hostname.split('.')[0];
        const pathSegments = pathname.split('/').filter(seg => seg.length > 0);
        let appId = null;

        for (const segment of pathSegments) {
            if (segment.startsWith('APP_')) {
                appId = segment;
                break;
            }
        }

        const baseUrl = `${urlObj.protocol}//${hostname}`;
        let apiBasePath = null;
        if (appId) {
            apiBasePath = pathname.includes('/dingtalk/web/')
                ? `${baseUrl}/dingtalk/web/${appId}`
                : `${baseUrl}/${appId}`;
        }

        // 从cookie获取CSRF token的简单函数
        const getCsrfToken = () => {
            var name = "c_csrf=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }

        const processCode = urlObj.searchParams.get('processCode')
        return {
            appId: appId,
            domainPrefix: domainPrefix,
            fullHostname: hostname,
            baseUrl: baseUrl,
            apiBasePath: apiBasePath,
            protocol: urlObj.protocol,
            pathname: pathname,
            searchParams: urlObj.searchParams,
            c_csrf: getCsrfToken(),
            processCode: processCode,
            services: {
                // 获取表单和应用信息
                getFormAndAppInfo: async (formUuid, appIdParam = appId) => {
                    const csrfToken = getCsrfToken();
                    if (!csrfToken) return null;
                    const params = new URLSearchParams({
                        _api: 'nattyFetch',
                        _mock: 'false',
                        _csrf_token: '',
                        _locale_time_zone_offset: new Date().getTimezoneOffset() * -60000,
                        formTypes: 'process',
                        appType: appIdParam,
                        formUuid: formUuid,
                        _stamp: Date.now()
                    });
                    const requestUrl = `https://${domainPrefix}.aliwork.com/dingtalk/web/${appIdParam}/query/formdesign/getFormAndAppInfo.json?${params}`;
                    return await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json, text/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
                },
                // 获取表单字段信息
                getFormVariables: async (formUuid, appIdParam = appId) => {
                    const requestUrl = `https://${domainPrefix}.aliwork.com/alibaba/web/${appIdParam}/query/formProcInstData/getFormVariables.json`;
                    const data = await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json, text/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
                    if (!data || !data.content || !Array.isArray(data.content)) return null;
                    const field_exclude_components = ['processInstanceTitle', 'originator', 'originatorCorp', 'createTime', 'modifiedTime', 'processInstanceId'];
                    return data.content.filter(item => {
                        const componentId = item.componentId || item.fieldId || item.id;
                        if (!componentId) return true;
                        return !field_exclude_components.includes(componentId);
                    });
                },
                // 获取当前CSRF token（可选的辅助方法）
                getCsrfToken: getCsrfToken,
                // 获取应用下的所有表单信息
                fetchAllForms: async (appIdParam = appId) => {
                    const requestUrl = `https://${domainPrefix}.aliwork.com/${appIdParam}/query/formnav/getFormNavigationListByOrder.json?_api=Nav.queryList&_mock=false`;
                    const data = await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, credentials: 'include' });
                    if (data && data.content && Array.isArray(data.content)) {
                        const excludeForms = ['待我处理', '我已处理', '我创建的', '抄送我的'];
                        return data.content.filter(item => {
                            const formName = item.i18nTitle?.zh_CN;
                            return formName && !excludeForms.includes(formName);
                        });
                    } else {
                        window.yida_allForms = [];
                        window.yida_allForms_raw = [];
                        return [];
                    }
                },
                // 获取指定应用下的字段
                getListFieldInApp: async (appIdParam = appId) => {
                    const requestUrl = `https://${domainPrefix}.aliwork.com/alibaba/web/${appIdParam}/query/formdesign/listFieldInApp.json`;
                    return await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json, text/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
                },
                // 获取集成自动化的节点信息
                getProcess: async (processCodeParam = processCode, appIdParam = appId) => {
                    const requestUrl = `https://${domainPrefix}.aliwork.com/alibaba/web/${appIdParam}/query/simpleProcess/getProcess.json?processCode=${processCodeParam}&isLogic=true`;
                    return await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json, text/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
                },
                // 获取当前组织下所有的应用
                getAppList: async () => {
                    const requestUrl = `https://${domainPrefix}.aliwork.com/query/app/getAppList.json`;
                    return await fetchJson(requestUrl, { method: 'GET', headers: { 'Accept': 'application/json, text/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' });
                }
            }
        };
    } catch (error) {
        return undefined;
    }
}

(function () {
    'use strict';

    // 1.获取Url信息
    const scriptInfo = scriptInit();
    window.yiDaScript = scriptInfo;
    console.log("脚本信息为", scriptInfo)

    // 2.加载时获取当前应用的所有表单+字段数据
    scriptInfo.services.getListFieldInApp().then(res => {
        console.log("当前页面的所有表单为：", res.content)
        window.yiDaForms = res.content;
        if (typeof window._updateDataSourceOptions === 'function') {
            try { window._updateDataSourceOptions(); } catch (_) { }
        }
    });

    // 3.获取组织下的所有应用信息
    scriptInfo.services.getAppList().then(res => {
        const data = res.content.data
        // 过滤原始信息
        if (data) {
            const simpleAppList = [];
            data.map(app => {
                simpleAppList.push({
                    appId: app.appType,
                    appName: app.appName.zh_CN,
                    appOriginalName: app.appName.zh_CN.split("-")[1] || app.appName.zh_CN,
                    corpId: app.corpId,
                    systemLink: app.systemLink,
                    lastEditorName: app.lastEditorName
                })
            })
            console.log("当前组织下的所有应用信息为[window.yiDaAppList]：", simpleAppList)
            window.yiDaAppList = simpleAppList;
        } else {
            console.error("错误，无法获取组织下的应用信息", res)
        }
    })

    // 4.构建UI
    const isDesignerPage = /\/design\/pageDesigner/.test(window.location.href);
    if (isDesignerPage) {
        buildUIbyDesignerPage();
    } else {
        buildUI();
    }
})();
