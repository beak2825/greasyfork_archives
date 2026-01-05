// ==UserScript==
// @name           kumomine toast
// @version     0.1
// @require	   http://code.jquery.com/jquery-2.1.1.min.js
// @description    Show toast
// ==/UserScript==

function warn(msg, opt, left, top) {
  if (opt) {
    var obj = $('#' + opt);
  }
  new Toast({
    context: $('body'),
    message: msg
  }, obj, left, top).show();
}
var Toast = function (config, obj, left, top) {
  this.context = config.context == null ? $('body')  : config.context; //上下文
  this.message = config.message; //显示内容
  this.time = config.time == null ? 5000 : config.time; //持续时间
  this.left = config.left; //距容器左边的距离
  this.top = $('window').scrollTop()+80; //($(document).height() / 4) * 3; //距容器上方的距离
  if (obj) {
    this.left = obj.offset().left + left;
    this.top = obj.offset().top + top;
  }
  this.init();
}
var msgEntity;
Toast.prototype = {
  //初始化显示的位置内容等
  init: function () {
    $('#toastMessage').remove();
    //设置消息体
    var msgDIV = new Array();
    msgDIV.push('<div id="toastMessage">');
    msgDIV.push('<span>' + this.message + '</span>');
    msgDIV.push('</div>');
    msgEntity = $(msgDIV.join('')).appendTo(this.context);
    //设置消息样式
    var left = this.left == null ? this.context.width() / 2 - msgEntity.find('span').width() / 2 : this.left;
    var top = $(document).scrollTop() + 20;
    msgEntity.css({
      position: 'absolute',
      top: top,
      'z-index': '99',
      left: left,
      color: 'black',
      'font-size': '12px',
      padding: '5px',
      margin: '5px',
      'border-radius': '4px',
      '-moz-border-radius': '4px',
      '-webkit-border-radius': '4px',
      opacity: '0.8',
      'font-family': '微软雅黑',
      'background-color': '#F9EDBE',
      'border': '1px solid #FBDA91',
      'box-shadow': '1px 2px 5px rgba(0, 0, 0, 0.5)'
    });
    //msgEntity.addClass(".toast");
    msgEntity.hide();
  },
  //显示动画
  show: function () {
    msgEntity.fadeIn(500);
    msgEntity.fadeOut(this.time);
  }
};