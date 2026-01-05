// ==UserScript==
// @name Duoshuo Admin
// @name:zh-CN 多说评论管理
// @namespace http://gerald.top
// @homepage https://gerald.top/code/DuoshuoAdmin
// @author Gerald <i@gerald.top>
// @icon	http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @description 更加强大的多说评论管理脚本，可以自动分析所有有评论的页面，方便地修改thread_key，避免评论丢失。
// @version 0.3
// @match http://*.duoshuo.com/admin/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/9158/Duoshuo%20Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/9158/Duoshuo%20Admin.meta.js
// ==/UserScript==

var threads;
try {
	threads = JSON.parse(localStorage.threadData);
} catch(e) {
	threads = [];
}
function save() {
	localStorage.threadData = JSON.stringify(threads);
}

$('<style>')
.html(`
.dsa-popup{background:white;position:fixed;top:70px;right:70px;padding:10px;border-radius:3px;box-shadow:0 0 5px rgba(0,0,0,.1);}
.dsa-dialog{background:white;position:absolute;top:50px;right:600px;width:400px;z-index:10;box-shadow:0 0 5px rgba(0,0,0,.1);border:1px solid gray;padding:10px;border-radius:3px;}
.dsa-dialog label{display:block;}
.dsa-dialog input[type=text],.dsa-dialog input[type=url]{display:block;width:100%;}
.dsa-panel{background:white;position:fixed;top:50px;right:0;bottom:0;width:600px;box-shadow:-2px 0 5px gray;}
.dsa-panel-body{position:absolute;top:30px;left:10px;right:10px;bottom:10px;overflow:auto;}
.dsa-panel table{width:100%;border-spacing:5px;border-collapse:separate;table-layout:fixed;}
.dsa-panel td>*{padding:5px;}
.dsa-panel .key{cursor:pointer;}
.dsa-panel .key:hover{background:olive;color:white;}
`)
.appendTo(document.head);

const menu = $('<ul class="dropdown-menu">');
$('<li class="dropdown">')
.prependTo('.navbar-nav')
.html('<a href class="dropdown-toggle" data-toggle="dropdown">评论管理<b class="caret"></b>')
.append(menu);

$('<li><a href="https://gerald.top/code/DuoshuoAdmin" target=_blank>使用须知</a></li>')
.appendTo(menu);

function EditPanel(thread) {
	this.thread = thread;
	[
		'onSubmit',
		'onClose',
		'onVisitURL',
		'onSolveConflict',
	].forEach(key => {
		this[key] = this[key].bind(this);
	});
	this.dialog = $('<form class="dsa-dialog">').appendTo(document.body)
	.html(`
	<h3>修改Thread</h3>
	<label>
		thread_key:
		<input type=text data-id=thread_key>
	</label>
	<label>
		title:
		<input type=text data-id=title>
	</label>
	<label>
		url: <a href="#" data-id=visit_url>[Go]</a>
		<input type=url data-id=url>
	</label>
	<label>
		<input type=checkbox data-id=post_enable>
		post_enable
	</label>
	<button class="btn btn-primary" type="submit">保存</button>
	<button class="btn btn-default" type="button" data-id=cancel>关闭</button>
	<button class="btn btn-default" data-id=conflict style="display:none">修改冲突</button>
	<div data-id=msg></div>
	`)
	.submit(this.onSubmit)
	.on('click', '[data-id=visit_url]', this.onVisitURL)
	.on('click', '[data-id=cancel]', this.onClose)
	.on('click', '[data-id=conflict]', this.onSolveConflict)
	;
	this.find('thread_key').val(thread.thread_key);
	this.find('title').val(thread.title);
	this.find('url').val(thread.url);
	this.find('post_enable').prop('checked', thread.post_enable);
}
EditPanel.panels = {};
EditPanel.open = function (thread) {
	var panel = EditPanel.panels[thread.thread_id];
	if (!panel) {
		panel = EditPanel.panels[thread.thread_id] = new EditPanel(thread);
	}
	panel.dialog.appendTo(document.body);
	return panel;
};
EditPanel.prototype.find = function (key) {
	return this.dialog.find(`[data-id=${JSON.stringify(key)}]`);
};
EditPanel.prototype.onSubmit = function (e) {
	e.preventDefault();
	$.post('/api/threads/update.json', {
		thread_id: this.thread.thread_id,
		thread_key: this.find('thread_key').val(),
		title: this.find('title').val(),
		url: this.find('url').val(),
		post_enable: this.find('post_enable').prop('checked') ? 1 : 0,
	}, r => {
		const thread = r.response;
		if (thread) {
			this.thread = thread;
			const i = threads.findIndex(_thread => _thread.thread_id === thread.thread_id);
			if (~i) threads[i] = thread;
			save();
			this.find('msg').html('修改成功！');
		} else {
			this.find('msg').html('<span style="color:red">修改失败！</span>');
			const conflict = this.find('conflict').show();
			this.find('thread_key').one('change', () => conflict.hide());
		}
	});
};
EditPanel.prototype.onVisitURL = function (e) {
	window.open(this.find('url').val());
};
EditPanel.prototype.onSolveConflict = function (e) {
	$.get('/api/threads/listPosts.json', {
		thread_key: this.find('thread_key').val(),
		limit: 1,
	}, r => {
		EditPanel.open(r.thread);
	});
};
EditPanel.prototype.onClose = function (e) {
	this.dialog.remove();
};

function getThreadByKey(key, cb) {
}
var panel=$('<div class="dsa-panel">').appendTo(document.body).hide();
$('<a href>关闭</a>').appendTo(panel).css({
	position:'absolute',
	top:10,
	right:20,
}).click(function(e){
	e.preventDefault();
	panel.hide();
});
panel.area=$('<div class="dsa-panel-body">').appendTo(panel);
$('<a href>显示文章列表</a>')
.appendTo($('<li>').appendTo(menu))
.click(function(e){
	e.preventDefault();
	panel.area.html('');
	var table=$('<table>').appendTo(panel.area);
	$('<colgroup><col width=100><col width=200><col></colgroup>').appendTo(table);
	$('<tr><th>thread_key</th><th>title</th><th>url</th></tr>').appendTo(table);
	threads.forEach(thread => {
		const row = $('<tr>').appendTo(table);
		$('<span class="key">')
		.text(thread.thread_key)
		.click(() => EditPanel.open(thread))
		.wrap('<td>').parent().appendTo(row);
		$('<td>').text(thread.title).appendTo(row);
		$('<a target=_blank>')
		.attr('href', thread.url)
		.text(thread.url)
		.wrap('<td>').parent().appendTo(row);
	});
	panel.show();
});

$('<a href>自动分析评论</a>')
.appendTo($('<li>').appendTo(menu))
.click(function(e){
	e.preventDefault();
	var dthreads={};
	var limit=100,n=~~(DUOSHUO.site.comments/limit),i;
	var finished=0;
	var popup=$('<div class="dsa-popup">').html('正在分析评论：<span></span>/'+n).appendTo(document.body);
	var prog=popup.find('span').html(finished);
	for(i=0;i<n;i++)
		$.get('/api/posts/list.json',{
			order:'desc',
			source:'duoshuo,repost',
			max_depth:1,
			limit:limit,
			'related[]':'thread',
			nonce:DUOSHUO.nonce,
			status:'all',
			page:i+1,
		},function(r){
			$.each(r.response,function(i,p){
				var t=p.thread;
				dthreads[t.thread_id]=t;
			});
			prog.html(++finished);
			if(finished==n) {
				popup.html('评论分析完成！');
				popup.fadeOut(5000,function(){
					popup.remove();
				});
				threads=[];
				for(var i in dthreads) threads.push(dthreads[i]);
				threads.sort(function(a,b){return a.thread_id>b.thread_id;});
				save();
			}
		});
});
