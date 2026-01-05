// ==UserScript==
// @name         leetcode
// @namespace    http://redswallow.me/blog
// @version      0.1
// @description  leetcode plugin
// @author       redswallow
// @include      https://oj.leetcode.com/problems/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/5843/leetcode.user.js
// @updateURL https://update.greasyfork.org/scripts/5843/leetcode.meta.js
// ==/UserScript==

// 延迟调用函数
var call = function (f) {
  setTimeout.apply(this, [f].concat([0]).concat(Array.apply(Array, arguments).slice(1)));
};

// 设置项
var config = function () {
  var config = {}, storageKey = 'leetcode_plugin_config';
  var onputs = [];
  // 写入到内存
  var put = function (key, value) {
    onputs.map(function (f) { f(key, value, config[key]); });
    config[key] = value;
    return value;
  };
  // 从内存读取
  var get = function (key, value, type) {
    if (!(key in config)) return value;
    var val = config[key];
    if (typeof val === 'undefined') return value;
    if (type && (val === null || val.constructor !== type)) return value;
    return val;
  };
  // 读取到内存
  var read = function () {
    try { config = JSON.parse(GM_getValue(storageKey, '{}')); }
    catch (e) { config = {}; }
  };
  // 从内存写出
  var write = function () {
    GM_setValue(storageKey, JSON.stringify(config));
  };
  // 当内存配置被修改时调用
  var onput = function (f) {
    onputs.push(f);
  };
  // 初始化
  read();
  return {
    'put': put,
    'get': get,
    'read': read,
    'write': write,
    'onput': onput,
  };
};

var html = {
    'acCheckbox' : '<div class="btn-group btn-group-sm" data-toggle="buttons"><label class="btn btn-default active"><input type="checkbox" checked>AC</label><label class="btn btn-default active"><input type="checkbox" checked>WA</label><label class="btn btn-default active"><input type="checkbox" checked>Undo</label></div>',
    'difficultyCheckbox' : '<div class="btn-group btn-group-sm" data-toggle="buttons"><label class="btn btn-default active"><input type="checkbox" checked>Easy</label><label class="btn btn-default active"><input type="checkbox" checked>Medium</label><label class="btn btn-default active"><input type="checkbox" checked>Hard</label></div>',
    'allBtn' : '<div class="btn btn-sm btn-default">All</div>',
    'notAcBtn' : '<div class="btn btn-sm btn-default">!AC</div>',
    'easyBtn' : '<div class="btn btn-sm btn-default">Easy</div>',
    'mediumBtn' : '<div class="btn btn-sm btn-default">Medium</div>',
    'hardBtn' : '<div class="btn btn-sm btn-default">Hard</div>'
}

function init() {
    console.log("init");
    // 加载用户配置
  	//config = config();
    
    var filterDiv = document.createElement('div');
    filterDiv.id = 'filter';
    filterDiv.setAttribute('class','row table-centered col-md-12');
    filterDiv.appendChild(document.createTextNode('Filter :'));
    /*
    var acCheckbox = document.createElement('span');
    acCheckbox.setAttribute('class','table-centered col-md-3');
    acCheckbox.innerHTML = html['acCheckbox'];
    var difficultyCheckbox = document.createElement('span');
    difficultyCheckbox.setAttribute('class','table-centered col-md-3');
    difficultyCheckbox.innerHTML = html['difficultyCheckbox'];
    
    filterDiv.appendChild(acCheckbox);
    filterDiv.appendChild(difficultyCheckbox);
    */
    
    // ac button
    var allBtn = document.createElement('span');
    allBtn.innerHTML = html['allBtn'];
    allBtn.onclick = function() {
        $('tbody tr').show();
    }
    filterDiv.appendChild(allBtn);
    
    var notAcBtn = document.createElement('span');
    notAcBtn.innerHTML = html['notAcBtn'];
    notAcBtn.onclick = function() {
        $('tbody tr').show();
        $('.ac').parent().parent().hide();
    }
    filterDiv.appendChild(notAcBtn);
    // end of not ac button
    
    // difficulty filter
    var easyProblems = $('tbody tr td:last-child[value=1]').parent();
    var mediumProblems = $('tbody tr td:last-child[value=2]').parent();
    var hardProblems = $('tbody tr td:last-child[value=3]').parent();
    
    var easyProblemsBtn = document.createElement('span');
	easyProblemsBtn.innerHTML = html['easyBtn'];
    easyProblemsBtn.onclick = function() {
        easyProblems.show();mediumProblems.hide();hardProblems.hide();
    }
    filterDiv.appendChild(easyProblemsBtn);
    
    var mediumProblemsBtn = document.createElement('span');
    mediumProblemsBtn.innerHTML = html['mediumBtn'];
    mediumProblemsBtn.onclick = function() {
        easyProblems.hide();mediumProblems.show();hardProblems.hide();
    }
    filterDiv.appendChild(mediumProblemsBtn);
    
    var hardProblemsBtn = document.createElement('span');
    hardProblemsBtn.innerHTML = html['hardBtn'];
    hardProblemsBtn.onclick = function() {
        easyProblems.hide();mediumProblems.hide();hardProblems.show();
    }
    filterDiv.appendChild(hardProblemsBtn);
    // end of difficulty filter
    
    var searchResultRowDiv = document.getElementById('searchResultRow');
    searchResultRowDiv.parentNode.insertBefore(filterDiv, searchResultRowDiv);
}

if (document.body) call(init);
else document.addEventListener('DOMContentLoaded', init);

GM_addStyle("#filter span {padding-left:5px; padding-right:5px;}");