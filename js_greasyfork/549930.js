// ==UserScript==
// @name          夸克网盘目录导出（指定层级）
// @namespace    https://greasyfork.org/zh-CN/users/1465036-%E7%9F%A5%E8%AF%86%E5%90%9B%E7%9C%BC%E9%95%9C%E5%93%A5
// @version      1.0.1
// @description  固定右上角图标导出树状目录，含层级结构和文件大小，支持自定义目录层级深度，对目录文件排序
// @author       intumu.com
// @match        https://pan.quark.cn/s/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.3/jquery.fancytree-all-deps.min.js
// @downloadURL https://update.greasyfork.org/scripts/549930/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E6%8C%87%E5%AE%9A%E5%B1%82%E7%BA%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549930/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E6%8C%87%E5%AE%9A%E5%B1%82%E7%BA%A7%EF%BC%89.meta.js
// ==/UserScript==
(function() {
'use strict';
const shareId = location.pathname.split('/s/')[1];
function getStoken() {
let data = sessionStorage.getItem('_share_args');
if (!data) return '';
try {
let obj = JSON.parse(data);
return obj.value && obj.value.stoken ? obj.value.stoken : '';
} catch(e) {
console.error('Error parsing stoken:', e);
return '';
}
}
async function getList(parentFileId = 0) {
const pageSize = 100;
let page = 1;
let allItems = [];
while (true) {
console.log(`Fetching page ${page} for parentFileId ${parentFileId}`);
let url = new URL('https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail');
let params = {
pr: 'ucpro', fr: 'pc', uc_param_str: '', pwd_id: shareId,
stoken: getStoken(), pdir_fid: parentFileId, force: 0,
_page: page, _size: pageSize, _fetch_banner: 0,
_fetch_share: 0, _fetch_total: 1,
_sort: 'file_type:asc,updated_at:desc',
__dt: 959945, __t: Date.now()
};
Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
try {
const res = await fetch(url, {
headers: {
'Accept': 'application/json, text/plain, */*',
'Content-Type': 'application/json;charset=UTF-8',
'x-canary': 'client=web,app=adrive,version=v2.3.1'
}
});
if (!res.ok) {
console.error(`Fetch failed for page ${page}: ${res.status} ${res.statusText}`);
break;
}
const json = await res.json();
const items = json?.data?.list || [];
const total = json?.data?.total || 0;
console.log(`Page ${page}: ${items.length} items, total reported: ${total}`);
allItems.push(...items);
if (items.length < pageSize) {
console.log(`No more items to fetch for parentFileId ${parentFileId}`);
break;
}
page++;
} catch (error) {
console.error(`Error fetching page ${page} for parentFileId ${parentFileId}:`, error);
break;
}
}
console.log(`Total items fetched for parentFileId ${parentFileId}: ${allItems.length}`);
return allItems;
}
async function buildTree(parentFid = 0, currentDepth = 1, maxDepth = Infinity) {
const node = { children: [] };
// 检查是否已达到最大深度
if (currentDepth > maxDepth) {
return node;
}
const list = await getList(parentFid);
for (const item of list) {
if (item.dir) {
const childNode = await buildTree(item.fid, currentDepth + 1, maxDepth);
childNode.name = item.file_name;
node.children.push(childNode);
} else {
node.children.push({ name: item.file_name, size: item.size });
}
}
// Natural sort by name
node.children.sort((a, b) => {
const nameA = a.name || a.file_name;
const nameB = b.name || b.file_name;
// Split names into parts, separating numbers and non-numbers
const partsA = nameA.match(/(\d+)|(\D+)/g) || [nameA];
const partsB = nameB.match(/(\d+)|(\D+)/g) || [nameB];
for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
const partA = partsA[i];
const partB = partsB[i];
// If both parts are numbers, compare numerically
if (/^\d+$/.test(partA) && /^\d+$/.test(partB)) {
const numA = parseInt(partA, 10);
const numB = parseInt(partB, 10);
if (numA !== numB) return numA - numB;
} else {
// Compare as strings (case-insensitive)
const cmp = partA.localeCompare(partB, undefined, { sensitivity: 'base' });
if (cmp !== 0) return cmp;
}
}
// If one name has more parts, it comes after
return partsA.length - partsB.length;
});
return node;
}
async function exportText(maxDepth) {
try {
const treeData = await buildTree(0, 1, maxDepth);
const lines = [];
const traverse = (nodes, level = 0) => {
const indent = '│   '.repeat(level);
nodes.forEach((node, i) => {
const isLast = i === nodes.length - 1;
const symbol = isLast ? '└── ' : '├── ';
const name = node.name || node.file_name;
if (node.children) {
lines.push(indent + symbol + name + '/');
traverse(node.children, level + 1);
} else {
const size = node.size ? ` (${(node.size / 1048576).toFixed(2)} MB)` : '';
lines.push(indent + symbol + name + size);
}
});
};
const roots = treeData.children || [];
roots.forEach(node => {
lines.push((node.name || node.file_name) + '/');
if (node.children) traverse(node.children, 1);
});
const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'quark_directory.txt';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
} catch (error) {
console.error('Error exporting directory:', error);
alert('导出失败，请检查控制台日志以获取详细信息。');
}
}
// 创建输入对话框
function createDialog() {
const dialog = document.createElement('div');
dialog.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 4px 16px rgba(0,0,0,0.2);
z-index: 9999;
min-width: 300px;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;
const title = document.createElement('h3');
title.textContent = '设置目录层级深度';
title.style.cssText = `
margin: 0 0 15px 0;
color: #333;
font-weight: 500;
`;
dialog.appendChild(title);
const content = document.createElement('div');
content.style.cssText = `
margin-bottom: 15px;
`;
const label = document.createElement('label');
label.textContent = '输入目录层级深度（不填则获取所有层级）：';
label.style.cssText = `
display: block;
margin-bottom: 8px;
color: #666;
font-size: 14px;
`;
content.appendChild(label);
const input = document.createElement('input');
input.type = 'number';
input.min = '1';
input.placeholder = '请输入数字';
input.style.cssText = `
width: 100%;
padding: 8px;
border: 1px solid #ddd;
border-radius: 4px;
box-sizing: border-box;
font-size: 14px;
`;
content.appendChild(input);
dialog.appendChild(content);
const buttons = document.createElement('div');
buttons.style.cssText = `
display: flex;
justify-content: flex-end;
gap: 10px;
`;
const cancelBtn = document.createElement('button');
cancelBtn.textContent = '取消';
cancelBtn.style.cssText = `
padding: 8px 16px;
border: none;
border-radius: 4px;
background: #f0f0f0;
color: #333;
cursor: pointer;
font-size: 14px;
transition: background 0.2s;
`;
cancelBtn.addEventListener('click', () => {
document.body.removeChild(dialog);
});
buttons.appendChild(cancelBtn);
const confirmBtn = document.createElement('button');
confirmBtn.textContent = '确定';
confirmBtn.style.cssText = `
padding: 8px 16px;
border: none;
border-radius: 4px;
background: #1677ff;
color: white;
cursor: pointer;
font-size: 14px;
transition: background 0.2s;
`;
confirmBtn.addEventListener('click', () => {
const depth = input.value.trim();
const maxDepth = depth ? parseInt(depth, 10) : Infinity;
if (depth && (isNaN(maxDepth) || maxDepth < 1)) {
alert('请输入有效的正整数！');
return;
}
document.body.removeChild(dialog);
exportText(maxDepth);
});
buttons.appendChild(confirmBtn);
dialog.appendChild(buttons);
// 添加遮罩层
const overlay = document.createElement('div');
overlay.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.3);
z-index: 9998;
`;
overlay.addEventListener('click', () => {
document.body.removeChild(dialog);
document.body.removeChild(overlay);
});
document.body.appendChild(overlay);
document.body.appendChild(dialog);
// 自动聚焦输入框
input.focus();
}
const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '10px';
container.style.right = '10px';
container.style.zIndex = '2147483647';
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.fontFamily = 'sans-serif';
container.style.gap = '6px';
document.body.appendChild(container);
const imgBtn = document.createElement('img');
imgBtn.src = 'https://www.xueximeng.com/wp-content/uploads/2025/05/cropped-original-scaled-1.png';
imgBtn.alt = 'Export Icon';
imgBtn.style.width = '60px';
imgBtn.style.height = '60px';
imgBtn.style.borderRadius = '10px';
imgBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
imgBtn.style.cursor = 'pointer';
imgBtn.title = '点击导出目录';
container.appendChild(imgBtn);
imgBtn.addEventListener('click', createDialog);
const info1 = document.createElement('div');
info1.textContent = '点击图标生成目录树';
info1.style.fontSize = '13px';
info1.style.color = '#222';
const info2 = document.createElement('div');
info2.textContent = '点击后稍等片刻';
info2.style.fontSize = '13px';
info2.style.color = '#222';
const info3 = document.createElement('div');
info3.textContent = '可设置目录层级深度';
info3.style.fontSize = '13px';
info3.style.color = '#222';
container.appendChild(info1);
container.appendChild(info2);
container.appendChild(info3);
})();
