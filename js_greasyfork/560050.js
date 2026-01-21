// ==UserScript==
// @name         shopline店铺订单编辑query计价接口数据对比v2
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  捕捉所有GET请求的URL并输出到控制台
// @author       skyhuang
// @include      https://*.myshopline*.com/admin/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560050/shopline%E5%BA%97%E9%93%BA%E8%AE%A2%E5%8D%95%E7%BC%96%E8%BE%91query%E8%AE%A1%E4%BB%B7%E6%8E%A5%E5%8F%A3%E6%95%B0%E6%8D%AE%E5%AF%B9%E6%AF%94v2.user.js
// @updateURL https://update.greasyfork.org/scripts/560050/shopline%E5%BA%97%E9%93%BA%E8%AE%A2%E5%8D%95%E7%BC%96%E8%BE%91query%E8%AE%A1%E4%BB%B7%E6%8E%A5%E5%8F%A3%E6%95%B0%E6%8D%AE%E5%AF%B9%E6%AF%94v2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
function toString(sv, tv) {
    if (sv === undefined) {
        sv = "undefined"
    }
    if (sv === null) {
        sv = "null"
    }
    if (tv === undefined) {
        tv = "undefined"
    }
    if (tv === null) {
        tv = "null"
    }
    if (sv instanceof Object) {
        sv = JSON.stringify(sv)
    }
    if (tv instanceof Object) {
        tv = JSON.stringify(tv)
    }
    return `${sv} ----> ${tv}`
}
 
function compareList(sourceList, targetList) {
    let resultList = []
    if (sourceList.length < targetList.length) {
        // 源字段的长度小于目标字段的长度时
        for (let i = sourceList.length; i < targetList.length; i++) {
            sourceList[i] = 'FILL'
        }
    }
    for (let i = 0; i < sourceList.length; i++) {
        let sourceIdxValue = sourceList[i]
        let targetIdxValue = i >=targetList.length ? undefined : targetList[i]
        if (sourceIdxValue === 'FILL') {
            resultList[i] = toString(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue === undefined && targetIdxValue === undefined) {
            continue
        }
        if (sourceIdxValue === null && targetIdxValue === null) {
            continue
        }
        if (sourceIdxValue === undefined || sourceIdxValue === null || targetIdxValue === undefined || targetIdxValue === null) {
            resultList[i] = toString(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue instanceof Object && targetIdxValue instanceof Object) {
            resultList[i] = compareObject(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue === targetIdxValue) {
            resultList[i] = null
            continue
        }
        resultList[i] = toString(sourceIdxValue, targetIdxValue)
    }
    let flag = false;
    for (let v of resultList) {
        if (v !== undefined && v !== null) {
            if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) {
                // 判断是否是空对象{}
            } else {
                flag = true
                break
            }
        }
    }
    return flag ? resultList : []
}
 
function compareObject(sourceObj, targetObj) {
    let resultObj = {}
    Object.keys(sourceObj).forEach(key => {
        let sourceObjValue = sourceObj[key]
        let targetObjValue = targetObj[key]
        if (sourceObjValue === undefined && targetObjValue === undefined) {
            return
        }
        if (sourceObjValue === null && targetObjValue === null) {
            return
        }
        if (sourceObjValue === undefined || sourceObjValue === null || targetObjValue === undefined || targetObjValue === null) {
            resultObj[key] = toString(sourceObjValue, targetObjValue)
            return
        }
        if (sourceObjValue instanceof Array && targetObjValue instanceof Array) {
            let subListResult = compareList(sourceObjValue, targetObjValue)
            if (subListResult.length > 0) {
                resultObj[key] = subListResult
            }
            return
        }
        if (sourceObjValue instanceof Object && targetObjValue instanceof Object) {
            let subObjResult = compareObject(sourceObjValue, targetObjValue)
            if (Object.keys(subObjResult).length !== 0) {
                resultObj[key] = subObjResult
            }
            return
        }
        // 额外判断下string能不能转object、array
        if (typeof sourceObjValue === "string" && typeof targetObjValue === "string") {
            if (sourceObjValue.startsWith("{") && targetObjValue.startsWith("{")) {
                try {
                    let sourceString2Object = JSON.parse(sourceObjValue)
                    let targetString2Object = JSON.parse(targetObjValue)
                    let subObjResult = compareObject(sourceString2Object, targetString2Object)
                    if (Object.keys(subObjResult).length !== 0) {
                        resultObj[key] = subObjResult
                    }
                    return
                } catch (err) {
                    // 转对象失败继续往下执行
                }
            }
 
            if (sourceObjValue.startsWith("[{") && targetObjValue.startsWith("[{")) {
                try {
                    let sourceString2List = JSON.parse(sourceObjValue)
                    let targetString2List = JSON.parse(targetObjValue)
                    let subListResult = compareList(sourceString2List, targetString2List)
                    if (subListResult.length > 0) {
                        resultObj[key] = subListResult
                    }
                    return
                } catch (err) {
                }
            }
        }
        if (sourceObjValue === targetObjValue) {
            return
        }
        resultObj[key] = toString(sourceObjValue, targetObjValue)
    })
    return resultObj
}
    // 设置一个标志来避免无限循环
    let isCopyingRequest = false;
    // 复制请求的函数
    function copyRequest(url, options,responseClone) {
        // console.log("复制请求并发送...");
        let goRequerUrl ="/admin/api/trade/ofc/modify/order/settle/query";
        // 设置标志
        isCopyingRequest = true;
    
        return fetch(goRequerUrl, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失败，状态码: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('复制java请求的响应结果:', data);
                //对比响应结果
                const result = compareObject(data['data'],responseClone['data']);
                console.log("对比结果1: （tips:数组对象打印出来的null或{}是表示对比通过!!!", result);
                console.log("对比结果2: ",JSON.stringify(result));
            })
            .catch(err => {
                console.error('复制java请求失败:', err);
            })
            .finally(() => {
                // 在请求完成后重置标志
                isCopyingRequest = false;
            });
    }

    // 捕捉 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // 如果正在复制请求，直接调用原始 fetch
        if (isCopyingRequest) {
            return originalFetch.apply(this, arguments);
        }
        return originalFetch.apply(this, arguments).then(response => {
            // 在这里可以对响应进行处理，比如记录响应数据等
            // 克隆响应以便我们可以读取其内容
            const responseClone = response.clone();
            url = url.replace(/\?.*$/, '')
            if ( url === '/admin/api/bff-web/trade/ofc/modify/order/settle/query') {
                    responseClone.json().then(data => {
                    console.log('go的接口响应结果:', data);
                     //复制请求
                    copyRequest(url,options,data);
                }).catch(e => {
                    console.error('解析go响应失败:', e);
                });
                // console.log('检测到新的fetch URL:', url);
                // const host = this.location.host;
                // console.log("this host: ",host);
                // const data = options.data;
                // console.log('检测到新的fetch 请求参数:', data);
               
            }
            return response;
        });
    };
 
})();