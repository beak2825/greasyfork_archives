// ==UserScript==
// @name        数据管理
// @namespace   蒋晓楠
// @version     20251022
// @description 数据的读取保存导入导出
// @author      蒋晓楠
// @license     MIT
// ==/UserScript==
function 获取数据(默认={}) {
    return GM_getValue("数据", 默认);
}

function 保存数据(数据) {
    GM_setValue("数据", 数据);
}

function 获取配置(键, 默认) {
    return GM_getValue("配置:" + 键, 默认);
}

function 修改配置(键, 值) {
    GM_setValue("配置:" + 键, 值);
}

function 删除配置(键) {
    GM_deleteValue("配置:" + 键);
}

function 初始化导出数据菜单(文件名字="数据.json") {
    GM_registerMenuCommand("导出数据", () => {
        let 导出数据 = document.createElement("a");
        导出数据.download = 文件名字;
        导出数据.href = URL.createObjectURL(new Blob([JSON.stringify(获取数据())]));
        导出数据.click();
    });
}

function 初始化导入数据菜单() {
    GM_registerMenuCommand("导入数据", () => {
        let 导入文件 = GM_addElement(document.body, "input", {
            type: "file",
            hidden: true,
            accept: "application/json",
            value: false
        });
        导入文件.onchange = () => {
            if (导入文件.files.length > 0) {
                let 数据列表 = 导入文件.files[0];
                let 读取器 = new FileReader();
                读取器.onload = (结果) => {
                    try {
                        保存数据(JSON.parse(结果.target.result));
                        alert("导入完成");
                    } catch (异常) {
                        alert("读取的文件格式不正确");
                    }
                    导入文件.remove();
                };
                读取器.readAsText(数据列表);
            }
        }
        导入文件.click();
    });
}