// ==UserScript==
// @name         超强智慧树网课助手，完全免费，使用AI辅助，拥有超全题库，自动提交，支持视频，，可章节测试，自动挂机，防清进度，超高正确率
// @namespace    mx
// @version      1.1.2
// @description  自动挂机看知到MOOC，自动切换下一节，支持屏蔽弹窗题目，可调倍数播放，采用AI辅助答题，支持章节测试等，可以自动答题，可线路选择，默认静音等，解除各类功能限制，开放自定义参数，本脚本仅供个人研究学习使用，专注于为大学生减轻网课学习的操作负担，助力从繁琐的网课任务中高效脱身，让时间真正掌握在自己手中。同时，配备人性化操作界面，设计简洁直观，贴合用户使用习惯，让学习辅助过程更轻松便捷。请勿用于非法用途，产生一切法律责任用户自行承担。
// @author       mx
// @match        *://*.zhihuishu.com/*
// @connect      cx.icodef.com
// @connect      tk.mixuelo.cc
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT 
// @icon        https://scriptcat.org/api/v2/users/165553/avatar        
// @downloadURL https://update.greasyfork.org/scripts/554747/%E8%B6%85%E5%BC%BA%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%EF%BC%8C%E4%BD%BF%E7%94%A8AI%E8%BE%85%E5%8A%A9%EF%BC%8C%E6%8B%A5%E6%9C%89%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BC%8C%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%EF%BC%8C%EF%BC%8C%E5%8F%AF%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%EF%BC%8C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%EF%BC%8C%E8%B6%85%E9%AB%98%E6%AD%A3%E7%A1%AE%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/554747/%E8%B6%85%E5%BC%BA%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%EF%BC%8C%E4%BD%BF%E7%94%A8AI%E8%BE%85%E5%8A%A9%EF%BC%8C%E6%8B%A5%E6%9C%89%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BC%8C%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%EF%BC%8C%EF%BC%8C%E5%8F%AF%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%EF%BC%8C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%EF%BC%8C%E8%B6%85%E9%AB%98%E6%AD%A3%E7%A1%AE%E7%8E%87.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
  // 5E3 == 5000，科学记数法，表示毫秒数
  time: 5E3 // 默认响应速度为5秒，不建议小于3秒
  , token: '' // token可以增加并发次数，用来打码，采集题库奖励

  // 1代表开启，0代表关闭
  , video: 1 // 视频支持课程、见面课，默认开启
  , work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
  , jump: 1 // 自动切换视频，支持课程、见面课，默认开启

  // 仅开启video时，修改此处才会生效
  , line: '流畅' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
  , vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
  , speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
  // 上方参数支持在页面改动，下方参数仅支持代码处修改
  , que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
  , danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭
  , habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制

  // 仅开启work时，修改此处才会生效
  , none: 1 // 无匹配答案时执行默认操作，默认开启
  , hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭

  // 内部使用的属性
  , queue: [] // 答题队列
  , curs: [] // 课程信息
  , loop: null // 循环定时器
  , lose: 0 // 失败题目数
  , num: 0 // 当前题目索引
  , small: 0 // 小题索引
  , max: 999 // 最大题目数
  , shouldNavigateNext: false // 导航标记，只有成功答题后才设置为true，设置为较大值避免触发"答题已完成"

},
  _self = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window,
  url = location.pathname,
  $ = _self.jQuery || top.jQuery || window.jQuery,
  xhr = _self.XMLHttpRequest,
  _host = "http://tk.mixuelo.cc",
  API_BASE_URL = (() => {
    const baseUrl = "tk.mixuelo.cc/api.php";
    const protocol = window.location.protocol;
    if (protocol === 'https:') {
      return "https://" + baseUrl;
    } else {
      return "http://" + baseUrl;
    }
  })();

setting.notice = '公告栏';
GM_xmlhttpRequest({
  method: 'GET',
  url: 'http://cx.icodef.com/update?s=wyn3',
  timeout: setting.time,
  onload: function (xhr) {
    if (xhr.status == 200) {
      var obj = $.parseJSON(xhr.responseText) || {};
      setting.notice = obj.injection;
      document.querySelector('#cx-notice').innerHTML = setting.notice;
    }
  },
  ontimeout: function () {
    setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...');
  }
});

String.prototype.toCDB = function () {
  return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function (str) {
    return String.fromCharCode(str.charCodeAt(0) - 65248);
  }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};

// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.queue = setting.curs = [];
setting.loop = null;

if (!$) {
} else if (url.match('/videoList')) {
  $.tmDialog.alert({ content: '2.X版本已取消支持旧版界面', title: '智慧树网课助手提示' });
} else if (url == '/videoStudy.html') {
  setting.habit *= 6E4;
  setting.video && hookVideo(_self.vjsComponent, 1);
  setting.video && initZhihuishuVideoControl();
  setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/portals_h5/2clearning.html') {
  setting.video && hookVideo(_self.vjsComponent, 2);
  setting.video && initZhihuishuVideoControl();
  setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/live/vod_room.html') {
  setting.video && hookVideo(_self.vjsComponent);
  setting.video && initZhihuishuVideoControl();
  setting.jump && setInterval(checkToNext, setting.time, 1);
} else if (location.hostname.match('examh5')) {
  setTimeout(relieveLimit, 100, document);
  if (location.hash.match(/dohomework|doexamination/) && setting.work) beforeFind();
} else if (location.hostname.match('hiexam')) {
  // 智慧树考试页面
  setTimeout(relieveLimit, 100, document);
  // 初始化智慧树界面系统
  setTimeout(initZhihuishuUI, 1000);
  // 删除setting.work检查，默认进入页面就自动答题
  logger('检测到智慧树考试页面，准备初始化自动答题功能', 'green');
 
  setTimeout(initZhihuishuOriginalAnswering, 2000);

  // 自动启动答题功能
  setTimeout(() => {
    if (checkZhsAnswerPage()) {
      logger('自动启动答题功能', 'green');
      zhsProcessQuestions();
    }
  }, 5000);
  $(window).on('hashchange', function () {
    setting.work && location.reload();
  });
} else if (location.hostname.match('hike')) {

  setTimeout(relieveLimit, 100, document);
  logger('🎬 检测到智慧树视频学习页面，初始化视频控制功能', 'green');
  logger(`🔍 当前页面URL: ${location.href}`, 'blue');
  logger(`🔍 当前域名: ${location.hostname}`, 'blue');
  logger('🎬 智慧树视频助手开始初始化...', 'green');

  // 初始化视频专用控制面板
  setTimeout(() => {
    logger('🎬 开始初始化视频专用控制面板...', 'blue');
    initZhihuishuVideoUI();
  }, 1000);

  // 初始化视频自动播放功能
  setTimeout(() => {
    logger('🎬 开始初始化视频自动播放功能...', 'blue');
    initZhihuishuVideoControl();
    logger('🎬 视频自动播放功能已启动', 'blue');
  }, 2000);

  // 监听视频播放状态，实现自动下一个视频
  setTimeout(() => {
    logger('🎬 开始初始化视频自动下一个功能...', 'blue');
    initVideoAutoNext();
  }, 3000);
} else if (url.match('exerciseList') && setting.work) {

  logger('检测到智慧树练习页面', 'green');

  setTimeout(initZhsConfigSystem, 1000);

  // 设置XMLHttpRequest hook来拦截API响应
  _self.XMLHttpRequest = function () {
    var ajax = new XMLHttpRequest();
    ajax.onload = function () {
      if (this.status != 200 || !this.responseURL.match('getDoQuestSingle')) return;

      try {
        var obj = JSON.parse(this.responseText).rt;

        logger('拦截到智慧树题目API响应', 'green');
        logger(`题目ID: ${obj.questionId}`, 'blue');
        logger(`题目类型: ${obj.questionName} (ID: ${obj.questionTypeId})`, 'blue');

        // 处理题目内容
        if (obj.content) {
          // 移除答题停止检查 - 默认总是答题
          // if (localStorage.getItem('GPTJsSetting.work') !== 'true') {
          //   logger('答题已停止，跳过API拦截处理', 'red');
          //   return;
          // }

          var questionText = obj.content.replace(/<[^>]*>/g, '').trim();
          logger(`题目内容: ${questionText.substring(0, 100)}...`, 'blue');

          // 调用题库API获取答案
          zhsGetAnswerFromAPI(questionText, obj.questionTypeId, obj.questionOptionList);
        }

      } catch (e) {
        logger('处理智慧树API响应时出错: ' + e.message, 'red');
      }
    };
    return ajax;
  };

  setInterval(function () {
    if (setting.queue.length > 0) {
      var element = setting.queue.shift();
      if (element) {
        try {
          // 多种点击方式
          if (element.click) {
            element.click();
          } else if ($ && $(element).length > 0) {
            $(element).trigger('click');
          }
          logger('点击队列中的选项', 'blue');
        } catch (e) {
          logger('点击选项失败: ' + e.message, 'red');
        }
      }
    }
  }, 1E3);

  // 修复自动导航逻辑 - 只有在明确成功答题后才导航
  setting.jump && setInterval(function () {
    // 检查答题状态 - 只有在答题开启时才自动点击下一题
    const isAutoAnswerEnabled = localStorage.getItem('GPTJsSetting.work') === 'true';
    if (!isAutoAnswerEnabled) {
      return; // 答题已关闭，不自动点击下一题
    }

    // 检查是否有待处理的答题队列
    if (setting.queue.length > 0) {
      return; // 还有答题任务在处理，不自动跳题
    }

    // 检查是否有明确的导航标记（只有成功答题后才设置）
    if (!setting.shouldNavigateNext) {
      return; // 没有导航标记，不自动跳题
    }

    var nextBtn = document.querySelector('.Topicswitchingbtn');
    if (nextBtn && nextBtn.textContent.includes('下一题')) {
      nextBtn.click();
      logger('🔄 自动导航到下一题', 'blue');
      // 清除导航标记，避免重复导航
      setting.shouldNavigateNext = false;
    }
  }, setting.time);
} else if (url.match('/sourceLearning')) {
  setting.video && hookVideo(_self.vjsComponent, 3);
  setting.jump && setInterval(checkToNext, setting.time, $('.source-file-item'));
} else if (url == '/shareCourse/questionDetailPage') {
  setTimeout(relieveLimit, 100, document);
  $('textarea[oncut]').each(function () {
    setTimeout(relieveLimit, 100, this);
  });
  if ($("#myAnswerInfo_div2 .option-zan").attr("islike") == 0) {
    $("#myAnswerInfo_div2 .option-zan").click();
  }
}

function hookVideo(Hooks, tip) {
  // _self.PlayerUtil.debugMode = true;
  _self.vjsComponent = function () {
    var config = arguments[0],
      options = config.options,
      line = $.map(options.sourceSrc.lines, function (value) {
        return value.lineName.replace('标准', '高清');
      }),
      vol = setting.vol > 100 ? 100 : setting.vol,
      rate = tip == 3 ? [1, 1.25, 1.5, 2, 2.5, 3] : [1, 1.25, 1.5];
    vol = Math.round(vol) / 100;
    options.volume = vol > 0 ? vol : 0;
    options.autostart = true;
    setting.speed = setting.speed > 0 ? +setting.speed : 1;
    options.rate = $.inArray(setting.speed, rate) < 0 ? options.rate : setting.speed;
    tip && config.callback.playbackRate(setting.speed);
    options.chooseLine = $.inArray(setting.line, line) + 1 || options.chooseLine + 1;
    options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
    if (!setting.danmu) {
      config.defOptions.control.danmuBtn = false;
      delete options.control.danmuBtn;
    }
    Hooks.apply(this, arguments);
    config.player.on('loadstart', function () {
      this.loop(true);
      this.play();
      $('.speedBox span').text('X ' + setting.speed);
    });
  };
  $(document).on('click', '.definiLines b', function () {
    setting.line = ({ xiaonei: '校内', line1gq: '高清', line1bq: '流畅' })[this.classList[0]];
  }).on('mouseup click', function () {
    setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
  }).on('click', '.speedList div', function () {
    setting.speed = $(this).attr('rate');
  });
  if (tip != 1) return;
  setting.tip = setting.habit && setInterval(totalTime, setting.time);
  setInterval(doTest, 1E3);
  _self.XMLHttpRequest = setting.que ? function () {
    var ajax = new xhr(),
      open = ajax.open;
    ajax.open = function (method, url) {
      if (url.match('/loadVideoPointerInfo')) method = 'OPTIONS';
      return open.apply(this, arguments);
    };
    return ajax;
  } : xhr;
}

function totalTime() {
  var player = _self.PlayerStarter.playerArray[0].player;
  setting.habit -= player.paused() ? 0 : setting.time;
  if (setting.habit >= 0) return;
  clearInterval(setting.tip);
  player.pause();
  $.getScript('//cdn.jsdelivr.net/gh/sentsin/layer/dist/layer.js', function () {
    _self.layer.open({
      content: '已达到挂机限制时间', title: '智慧树网课助手提示', end: function () {
        setting.habit = 0;
      }
    });
  });
}

function checkToNext(tip) {
  if (setting.habit < 0) return;
  var $tip = $('.video, .lessonItem');
  if ($('.current_play .time_icofinish').length) {
    $tip.slice($tip.index($('.current_play')) + 1).not(':has(.time_icofinish)').eq(0).click();
  } else if ($('.lessonItemActive .finish').length) {
    // _self.PlayerStarter.playerArray[0].callback.playerNext();
    $tip.slice($tip.index($('.lessonItemActive')) + 1).not(':has(.finish)').eq(0).click();
  } else if (tip == 1) {
    $('.current_player:contains("100%") + li').click();
    // $('.finish_tishi').hasClass('disNo') || console.log('签到已完成');
  } else if ($('.settleOn .finish').length) {
    tip.slice(tip.index($('.settleOn')) + 1).not(':has(.finish)').eq(0).find('.file-name').click();
  }
}

function doTest() {
  if (!$('.dialog-test').length) {
  } else if (setting.queue.length) {
    $(setting.queue.shift()).parent().click();
  } else if (!$('.answer').length) {
    $('.topic-item').eq(0).click();
  } else if (!$('.right').length) {
    var tip = $('.answer span').text().match(/[A-Z]/g) || [];
    if (tip.length == 1) return $('.topic-option-item:contains(' + tip[0] + ')').click();
    $('.topic-option-item').each(function () {
      $.inArray($(this).text().slice(0, 1), tip) < 0 == $(this).hasClass('active') && setting.queue.push(this);
    });
  } else if ($('.btn-next:enabled').length) {
    $('.btn-next:enabled').click();
  } else {
    $('.dialog-test .btn').click();
    _self.PlayerStarter.playerArray[0].player.play();
  }
}

function relieveLimit(doc) {
  if (!doc.oncut && !doc.onselectstart) return setTimeout(relieveLimit, 100, doc);
  doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
}

function beforeFind() {
  _self.XMLHttpRequest = function () {
    var ajax = new xhr();
    ajax.onload = function (e) {
      if (this.status != 200 || !this.responseURL.match(/doHomework|doExam/)) return;
      var obj = JSON.parse(this.responseText);
      collectData(obj.rt.examBase);
    };
    return ajax;
  };
  setting.div = $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
    '<span style="font-size: medium;"></span>' +
    '<div style="font-size: medium;">正在搜索答案...</div>' +
    '<div id="cx-notice" style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;">' + setting.notice + '</div>' +
    '<button style="margin-right: 10px;">暂停答题</button>' +
    '<button style="margin-right: 10px;">重新查询</button>' +
    '<button style="margin-right: 10px;">折叠面板</button>' +
    '<button style="display: none;">未作答题目</button>' +
    '<form style="margin: 2px 0;">' +
    '<label style="font-weight: bold; color: red;">自定义答题范围：</label>' +
    '<input name="num" type="number" min="1" placeholder="开始" style="width: 60px;" disabled>' +
    '<span> ~ </span>' +
    '<input name="max" type="number" min="1" placeholder="结束" style="width: 60px;" disabled>' +
    '</form>' +
    '<div style="max-height: 300px; overflow-y: auto;">' +
    '<table border="1" style="font-size: 12px;">' +
    '<thead>' +
    '<tr>' +
    '<th style="width: 30px; min-width: 30px; font-weight: bold; text-align: center;">题号</th>' +
    '<th style="width: 60%; min-width: 130px; font-weight: bold; text-align: center;">题目（点击可复制）</th>' +
    '<th style="min-width: 130px; font-weight: bold; text-align: center;">答案（点击可复制）</th>' +
    '</tr>' +
    '</thead>' +
    '<tfoot style="display: none;">' +
    '<tr>' +
    '<th colspan="3" style="font-weight: bold; text-align: center;">答案提示框 已折叠</th>' +
    '</tr>' +
    '</tfoot>' +
    '<tbody>' +
    '<tr>' +
    '<td colspan="3" style="display: none;"></td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>' +
    '</div>'
  ).appendTo('body').on('click', 'button, td', function () {
    var len = $(this).prevAll('button').length;
    if (this.nodeName == 'TD') {
      $(this).prev().length && GM_setClipboard($(this).text());
    } else if (len === 0) {
      if (setting.loop) {
        clearInterval(setting.loop);
        delete setting.loop;
        len = [false, '已暂停搜索', '继续答题'];
      } else {
        setting.loop = setInterval(findAnswer, setting.time);
        len = [true, '正在搜索答案...', '暂停答题'];
      }
      setting.div.find('input').attr('disabled', len[0]);
      setting.div.children('div:eq(0)').html(function () {
        return $(this).data('html') || len[1];
      }).removeData('html');
      $(this).html(len[2]);
    } else if (len == 1) {
      location.reload();
    } else if (len == 2) {
      setting.div.find('tbody, tfoot').toggle();
    } else if (len == 3) {
      var $li = $('.el-scrollbar__wrap li'),
        $tip = $li.filter('.white, .yellow').eq(0);
      $tip.click().length ? setting.div.children('div:last').scrollTop(function () {
        var $tr = $('tbody tr', this).has('td:nth-child(1):contains(' + $tip.text() + ')');
        if (!$tr.length) return arguments[1];
        return $tr.offset().top - $tr.parents('table').offset().top; // $tr[0].offsetTop
      }) : $(this).hide();
    } else if (len == 4) {
      setting.tk_num++;
      GM_setValue('tk_num_1', setting.tk_num);
      setting.tk_num = GM_getValue('tk_num_1');
      console.log(setting.tk_num);
      parent.location.reload();
    }
  }).on('change', 'input', function () {
    setting[this.name] = this.value.match(/^\d+$/) ? parseInt(this.value) - 1 : -1;
    if (!this.value) setting[this.name] = this.name == 'num' ? 0 : undefined;
  }).detach(setting.hide ? '*' : 'html');
  setting.type = {
    单选题: 1,
    多选题: 2,
    填空题: 3,
    问答题: 4,
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    判断题: 14
  };
  setting.lose = setting.num = setting.small = 0;
  $(document).keydown(function (event) {
    if (event.keyCode == 38) {
      setting.div.detach();
    } else if (event.keyCode == 40) {
      setting.div.appendTo('body');
    }
  });
  setting.loop = setInterval(findAnswer, setting.time, true);
  setInterval(function () {
    $(setting.queue.shift()).parent().click();
  }, 1E3);
}

function findAnswer(tip) {
  if (setting.queue.length) {
    return;
  } else if (tip && !$('.answerCard').length) {
    return setting.div.children('div:eq(0)').data('html', '非自动答题页面').siblings('button:eq(0)').click();
  } else if (setting.max < 0 || setting.num < 0) {
    return setting.div.children('div:eq(0)').data('html', '范围参数应为 <font color="red">正整数</font>').siblings('button:eq(0)').click();
  } else if (setting.num >= $('.subject_stem').length || setting.num > setting.max) {
    // setting.div.children('button:eq(3)').toggle(!!setting.lose);
    tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
    return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0), form').hide().click();
  } else if (!setting.curs.length) {
    setting.curs = $('.infoList span').map(function () {
      return $(this).text().trim();
    });
    if (!setting.curs.length) return;
  }
  var $TiMu = $('.subject_stem').eq(setting.num).parent(),
    $dom = $TiMu.find('.smallStem_describe').eq(setting.small).children('div').slice(1, -1),
    question = filterStyle($dom) || filterStyle($TiMu.find('.subject_describe')),
    type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1];
  type = type ? setting.type[type] || 0 : -1;

  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://cx.icodef.com/wyn-nb?v=4',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': setting.token,
    },
    data: 'question=' + encodeURIComponent(question),
    timeout: setting.time,
    onload: function (xhr) {
      if (!setting.loop) {
      } else if (xhr.status == 200) {
        var obj = $.parseJSON(xhr.responseText.replace(/^操作数据失败！/, '')) || {};
        obj.answer = obj.data;
        if (obj.code) {
          setting.div.children('div:eq(0)').text('正在搜索答案...');
          var answer = obj.answer.replace(/&/g, '&').replace(/<([^i])/g, '<$1');
          obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
          $(
            '<tr>' +
            '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
            '<td title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&').replace(/</g, '<')) + '</td>' +
            '<td title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
            '</tr>'
          ).appendTo(setting.div.find('tbody')).css('background-color', function () {
            $dom = $dom.length ? $dom.closest('.examPaper_subject') : $TiMu;
            if (fillAnswer($dom, obj, type)) return '';
            setting.div.children('button:eq(3)').show();
            return 'rgba(0, 150, 136, 0.6)';
          });
          setting.small = ++setting.small < $TiMu.find('.smallStem_describe').length ? setting.small : (setting.num++, 0);
        } else {
          setting.div.children('div:eq(0)').html(obj.answer || '服务器繁忙，正在重试...');
        }
        setting.div.children('span').html(obj.msg || '');
      } else if (xhr.status == 403) {
        var html = xhr.responseText.indexOf('{') ? '请求过于频繁，建议稍后再试' : $.parseJSON(xhr.responseText).answer;
        setting.div.children('div:eq(0)').data('html', html).siblings('button:eq(0)').click();
      } else {
        setting.div.children('div:eq(0)').text('服务器异常，正在重试...');
      }
    },
    ontimeout: function () {
      setting.loop && setting.div.children('div:eq(0)').text('服务器超时，正在重试...');
    }
  });

}

function fillAnswer($TiMu, obj, type) {
  var $div = $TiMu.find('.nodeLab'),
    str = String(obj.answer).toCDB() || new Date().toString(),
    answer = str.split(/#|\x01|\|/),
    state = setting.lose;
  // $div.find(':radio:checked').prop('checked', false);
  obj.code > 0 && $div.each(function () {
    var $input = $('input', this)[0],
      tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();
    if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
      answer.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($input);
    } else if (tip.match(/^(错误|否|错|×|F|wr)$/)) {
      answer.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($input);
    } else if (type == 2) {
      Boolean($.inArray(tip, answer) + 1 || str.indexOf(tip) + 1) == $input.checked || setting.queue.push($input);
    } else {
      $.inArray(tip, answer) + 1 && setting.queue.push($input);
    }
  });
  if (setting.queue.length) {
  } else if (/^(1|2|14)$/.test(type)) {
    var $input = $div.find('input');
    // 删除随机选择功能，避免意外的随机答题
    $input.is(':checked') || setting.lose++;
  } else if (/^[3-5]$/.test(type)) {
    answer = String(obj.answer).split(/#|\x01|\|/);
    str = $TiMu.find('textarea').each(function (index) {
      index = (obj.code > 0 && answer[index]) || '';
      this.value = index.trim();
      // if (this.value == this._value) return true;
      this.dispatchEvent(new Event('input'));
      this.dispatchEvent(new Event('blur'));
    }).length;
    (obj.code > 0 && answer.length == str) || setting.none || setting.lose++;
  } else {
    setting.none || setting.lose++;
  }
  return state == setting.lose;
}

function collectData(obj, data) {
  setting.data = data = {};
  data.id = obj.id;
  data.name = obj.name;
  data.course = obj.courseName;
  data.chapter = obj.toChapter || obj.explain;
  data.timu = [];
  $.each(obj.workExamParts, function () {
    $.each(this.questionDtos, function () {
      if (this.questionOptions) return pushData(this, data.timu);
      $.each(this.questionChildrens, function () {
        pushData(this, data.timu);
      });
    });
  });
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://cx.icodef.com/report/zhs',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': setting.token,
    },
    data: 'data=' + encodeURIComponent(JSON.stringify(data))
  });
}

function pushData(obj, arr) {
  arr.push({
    id: obj.id,
    question: filterStyle('<p>' + obj.name + '</p>'),
    option: $.map(obj.questionOptions, function (val) {
      return filterStyle('<p>' + val.content + '</p>');
    }),
    key: $.map(obj.questionOptions, function (val) {
      return val.id;
    }).join(),
    type: obj.questionType.id
  });
}

function logger(message, color) {
  // 过滤掉详细的调试信息，只保留核心答题信息
  const debugKeywords = [
    '🔍 调试：',
    '🔍调试：',
    '调试：',
    '找到',
    '个子元素',
    '个.optionUl容器',
    '个role',
    'optionContent:',
    'radioLabel:',
    'radio[',
    '题目容器HTML:',
    '个role="radio"元素',
    '个role="radiogroup"',
    '开始填充答案',
    '题目类型:',
    '答案分割结果:',
    '尝试选择选项',
    '成功点击选项',
    '处理答案:',
    '📝 开始处理当前题目',
    '📋 题目内容:',
    '📝 选项数量:',
    '📋 选项内容:',
    '📝 开始重新处理题目',
    '📚 发送题库API请求到',
    '选项匹配:',
    '🎯 开始选择答案:',
    '✅ 选择最佳匹配选项',
    '✅ 题目处理成功，准备自动下一题',
    '🔄 自动导航到下一题',
    '🔄 已自动跳转到下一题',
    '拦截到智慧树题目API响应',
    '题目ID:',
    '开始调用题库API查询答案',
    '发送题库API请求',
    '使用API Key:',
    '题库API状态:',
    '当前配置状态:',
    '已开启AI答题功能，准备获取AI答案',
    '🤖 答案来源:',
    '点击队列中的选项',
    '设置导航标记，等待定时器处理'
  ];

  const shouldFilter = debugKeywords.some(keyword => message.includes(keyword));

  if (shouldFilter) {
    // 调试信息完全不显示，直接返回
    return;
  }

  const colors = {
    'red': '#F56C6C',
    'green': '#67C23A',
    'blue': '#409EFF',
    'orange': '#E6A23C',
    'purple': '#9C27B0',
    'yellow': '#F7BA2A',
    'pink': '#EB7CD0'
  };

  const style = `color: ${colors[color] || '#000000'}; font-weight: bold;`;
  console.log(`%c[智慧树助手] ${message}`, style);

  // 同时输出到界面日志窗口
  addToUILog(message, color);
}


function addToUILog(message, color) {
  const logContainer = document.getElementById('zhs-log-container');
  if (!logContainer) return;

  const colors = {
    'red': '#F56C6C',
    'green': '#67C23A',
    'blue': '#409EFF',
    'orange': '#E6A23C',
    'purple': '#9C27B0',
    'yellow': '#F7BA2A',
    'pink': '#EB7CD0'
  };

  // 简化消息内容，提取关键信息
  let displayMessage = message;

  // 简化API请求信息
  if (message.includes('发送题库API请求')) {
    displayMessage = '📚 正在查询题库...';
  } else if (message.includes('AI成功返回答案')) {
    const answerMatch = message.match(/答案:\s*(.+)/);
    if (answerMatch) {
      displayMessage = `🤖 AI答案: ${answerMatch[1]}`;
    }
  } else if (message.includes('开始重新处理题目')) {
    displayMessage = '🔄 开始处理题目';
  } else if (message.includes('题目内容:')) {
    const contentMatch = message.match(/题目内容:\s*(.+)/);
    if (contentMatch) {
      displayMessage = `📝 ${contentMatch[1].substring(0, 50)}${contentMatch[1].length > 50 ? '...' : ''}`;
    }
  }

  const logEntry = document.createElement('div');
  logEntry.className = 'gpt-message';
  logEntry.style.cssText = `
    margin: 6px 0 !important;
    padding: 6px 10px !important;
    border-radius: 6px !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    color: ${colors[color] || '#333'} !important;
    background: rgba(${color === 'green' ? '103, 194, 58' : color === 'red' ? '245, 108, 108' : '64, 158, 255'}, 0.1) !important;
    border-left: 3px solid ${colors[color] || '#409EFF'} !important;
    word-wrap: break-word !important;
  `;

  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  logEntry.innerHTML = `<span style="opacity: 0.6; font-size: 10px;">[${timestamp}]</span> ${displayMessage}`;

  logContainer.appendChild(logEntry);

  // 自动滚动到底部
  logContainer.scrollTop = logContainer.scrollHeight;

  // 限制日志条数，避免内存占用过多
  const maxLogs = 50;
  while (logContainer.children.length > maxLogs) {
    logContainer.removeChild(logContainer.firstChild);
  }
}


function initZhihuishuUI() {
  logger('初始化智慧树界面系统', 'blue');


  if (document.getElementById('zhs-control-panel')) {
    logger('智慧树界面已存在，跳过创建', 'orange');
    return;
  }

  createZhihuishuControlPanel();


  createZhihuishuLogWindow();


  addZhihuishuKeyboardShortcuts();


  initZhsConfigSystem();


  initZhsPanelState();

  logger('智慧树界面系统初始化完成', 'green');
}


function createZhihuishuControlPanel() {

  if (document.getElementById('zhs-control-panel')) {
    logger('控制面板已存在，跳过创建', 'orange');
    return;
  }

  const panel = document.createElement('div');
  panel.id = 'zhs-control-panel';
  panel.className = 'gpt-box';
  panel.style.cssText = `
    position: fixed !important;
    top: 80px !important;
    right: 10px !important;
    width: 320px !important;
    background: rgba(255, 255, 255, 0.98) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(64, 158, 255, 0.2) !important;
    z-index: 2147483647 !important;
    font-family: "Microsoft YaHei", sans-serif !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    cursor: default !important;
    transform: none !important;
    margin: 0 !important;
    border: 2px solid #409EFF !important;
    max-height: 500px !important;
    overflow: hidden !important;
  `;


  const shouldHide = localStorage.getItem('ZhsJsSetting.hideBox') === 'true';
  const initialDisplay = shouldHide ? 'none' : 'block';
  panel.style.display = initialDisplay;

 
  const isExpanded = localStorage.getItem('ZhsJsSetting.panelExpanded') !== 'false';
  const contentDisplay = isExpanded ? 'block' : 'none';

  panel.innerHTML = `
    <!-- 控制面板标题栏 - 可点击展开/收起 -->
    <div class="gpt-box-header" onclick="toggleZhsPanel()" style="
      background: linear-gradient(135deg, #409EFF 0%, #66b3ff 100%) !important;
      color: white !important;
      padding: 15px 18px !important;
      border-radius: 10px 10px ${isExpanded ? '0 0' : '10px 10px'} !important;
      cursor: pointer !important;
      user-select: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3) !important;
    " onmouseover="this.style.background='linear-gradient(135deg, #66b3ff 0%, #409EFF 100%)'" onmouseout="this.style.background='linear-gradient(135deg, #409EFF 0%, #66b3ff 100%)'">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="https://mx.mixuelo.cc/index/pengzi/images/思考2.gif" style="width: 20px; height: 20px;" alt="logo">
        <span style="font-weight: 600; font-size: 15px;">智慧树助手</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span id="zhs-expand-btn" style="
          font-size: 14px;
          transition: transform 0.3s ease;
          transform: rotate(${isExpanded ? '180deg' : '0deg'});
        ">▼</span>
        <button onclick="event.stopPropagation(); document.getElementById('zhs-control-panel').style.display='none'" title="隐藏面板" style="
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 6px 10px !important;
          color: white !important;
          cursor: pointer !important;
          font-size: 12px !important;
          transition: all 0.3s !important;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">✕</button>
      </div>
    </div>

    <!-- 控制面板内容 - 标签切换模式 -->
    <div id="zhs-panel-content" style="
      background: white !important;
      border-radius: 0 0 10px 10px !important;
      display: ${contentDisplay} !important;
      overflow: hidden !important;
    ">
      <!-- 标签导航 -->
      <div id="zhs-tab-nav" style="
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        padding: 0;
      ">
        <button class="zhs-tab-btn active" data-tab="main" style="
          flex: 1;
          padding: 12px 8px;
          border: none;
          background: #409EFF;
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
          border-radius: 0;
        ">🏠 主面板</button>
        <button class="zhs-tab-btn" data-tab="ai" style="
          flex: 1;
          padding: 12px 8px;
          border: none;
          background: transparent;
          color: #666;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
          border-radius: 0;
        ">🤖 AI助手</button>
        <button class="zhs-tab-btn" data-tab="tutorial" style="
          flex: 1;
          padding: 12px 8px;
          border: none;
          background: transparent;
          color: #666;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
          border-radius: 0;
        ">📖 教程</button>
      </div>

      <!-- 标签内容区 - 修复自适应大小，不需要滚动条 -->
      <div id="zhs-tab-content" style="
        height: auto;
        overflow: visible;
        padding: 0;
      ">
        <!-- 主面板内容 -->
        <div id="zhs-tab-main" class="zhs-tab-panel active" style="
          padding: 18px;
          display: block;
        ">
          <!-- 自动答题开关已删除 - 更多设置区域已有答题方式配置 -->

      <!-- API Key 配置 -->
      <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 500; color: #409EFF; font-size: 13px;">🔑 API配置</span>
        </div>
        <div style="display: flex; gap: 5px; margin-bottom: 8px;">
          <input type="text" id="zhs-api-key-input" placeholder="请输入题库API Key" style="
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            color: #333;
            font-size: 12px;
            box-sizing: border-box;
          " value="${localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || ''}">
          <button id="zhs-save-key-btn" style="
            padding: 6px 10px;
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 11px;
            white-space: nowrap;
            transition: all 0.3s;
          " onmouseover="this.style.background='#337ecc'" onmouseout="this.style.background='#409EFF'">保存</button>
        </div>
        <div style="display: flex; gap: 5px;">
          <button id="zhs-more-settings-btn" style="
            flex: 1;
            padding: 6px 10px;
            background: #67C23A;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 11px;
            transition: all 0.3s;
          " onmouseover="this.style.background='#5daf34'" onmouseout="this.style.background='#67C23A'">更多设置</button>
          <a href="http://tk.mixuelo.cc" target="_blank" style="
            flex: 1;
            padding: 6px 10px;
            background: #E6A23C;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 11px;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          " onmouseover="this.style.background='#d4941e'" onmouseout="this.style.background='#E6A23C'">🍯 蜜雪官网</a>
        </div>
        <div id="zhs-save-key-msg" style="
          font-size: 11px;
          margin-top: 5px;
          padding: 5px 8px;
          border-radius: 4px;
          display: none;
          transition: all 0.3s;
        "></div>
        <div style="font-size: 11px; color: #666; margin-top: 5px;">
          💡 输入有效的API Key以使用题库功能
        </div>

        <!-- 更多设置区域 - 修复功能开关无效问题 -->
        <div id="zhs-more-settings" style="
          display: none;
          margin: 10px 0;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e0e0e0;">

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="checkbox" id="GPTJsSetting.useTiku" ${localStorage.getItem('GPTJsSetting.useTiku') === 'true' ? 'checked' : ''}>
              <label for="GPTJsSetting.useTiku" style="cursor: pointer;">题库答题</label>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="checkbox" id="GPTJsSetting.useBackupTiku" ${localStorage.getItem('GPTJsSetting.useBackupTiku') === 'true' ? 'checked' : ''}>
              <label for="GPTJsSetting.useBackupTiku" style="cursor: pointer;">备用题库</label>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="checkbox" id="GPTJsSetting.useAI" ${localStorage.getItem('GPTJsSetting.useAI') === 'true' ? 'checked' : ''}>
              <label for="GPTJsSetting.useAI" style="cursor: pointer;">AI答题</label>
            </div>

            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="checkbox" id="GPTJsSetting.autoSubmit" ${localStorage.getItem('GPTJsSetting.autoSubmit') === 'true' ? 'checked' : ''}>
              <label for="GPTJsSetting.autoSubmit" style="cursor: pointer;">自动提交</label>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <input type="checkbox" id="GPTJsSetting.showAnswer" ${localStorage.getItem('GPTJsSetting.showAnswer') !== 'false' ? 'checked' : ''}>
              <label for="GPTJsSetting.showAnswer" style="cursor: pointer;">显示答案</label>
            </div>
          </div>

          <div style="margin-top: 10px;">
            <label for="GPTJsSetting.model" style="color: #555; font-size: 12px;">AI模型:</label>
            <select id="GPTJsSetting.model" style="
              width: 100%;
              padding: 4px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
              font-size: 12px;">
              <option value="gpt-3.5-turbo-16k" ${localStorage.getItem('GPTJsSetting.model') === 'gpt-3.5-turbo-16k' ? 'selected' : ''}>GPT-3.5-Turbo</option>
              <option value="gpt-4o-mini" ${localStorage.getItem('GPTJsSetting.model') === 'gpt-4o-mini' ? 'selected' : ''}>GPT-4o-Mini</option>
              <option value="gpt-4" ${localStorage.getItem('GPTJsSetting.model') === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
              <option value="deepseek-chat" ${localStorage.getItem('GPTJsSetting.model') === 'deepseek-chat' ? 'selected' : ''}>DeepSeek</option>
              <option value="glm-4-flash" ${localStorage.getItem('GPTJsSetting.model') === 'glm-4-flash' ? 'selected' : ''}>智谱GLM-4</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 操作按钮 - 删除开始答题按钮，默认自动答题 -->
      <div style="display: flex; gap: 5px; margin-bottom: 10px;">
        <button id="zhs-stop-answer" style="
          flex: 1;
          padding: 8px;
          background: #F56C6C;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 12px;
          transition: all 0.3s;
        " onmouseover="this.style.background='#f45454'" onmouseout="this.style.background='#F56C6C'">停止答题</button>
        <button id="zhs-show-log" style="
          flex: 1;
          padding: 8px;
          background: #409EFF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 12px;
          transition: all 0.3s;
        " onmouseover="this.style.background='#337ecc'" onmouseout="this.style.background='#409EFF'">显示日志</button>
      </div>

      <!-- 状态信息 -->
      <div style="font-size: 11px; color: #666; text-align: center; padding: 5px; background: #f0f9ff; border-radius: 4px; ">
        💡 进入页面自动开始答题，无需手动启动
      </div>
        </div>

        <!-- AI助手面板内容 - 完全重新设计，确保可点击和输入，修复事件冲突 -->
        <div id="zhs-tab-ai" class="zhs-tab-panel" style="
          padding: 15px;
          display: none;
          background: white;
          border-radius: 8px;
          position: relative;
          z-index: 1000;
          pointer-events: auto;
          overflow: visible;
          height: auto;
        " onmousedown="event.stopPropagation();" onclick="event.stopPropagation();">
                <!-- AI模型选择 -->
          <div style="margin-bottom: 18px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: #333;">选择模型:</label>
            <select id="zhs-ai-model" style="
              width: 100%;
              padding: 8px 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 13px;
              background: white;
              cursor: pointer;
              outline: none;
              box-sizing: border-box;
              position: relative;
              z-index: 1001;
            " onfocus="this.style.borderColor='#409EFF'" onblur="this.style.borderColor='#ddd'" onmousedown="event.stopPropagation();" onclick="event.stopPropagation();">
              <option value="DeepSeek-Chat">DeepSeek-Chat (推荐)</option>
              <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude-3</option>
            </select>
          </div>

          <!-- AI问答区 -->
          <div style="margin-bottom: 18px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: #333;">输入问题:</label>
            <textarea id="zhs-ai-question" placeholder="请输入您的问题..." style="
              width: 100%;
              height: 60px;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 13px;
              resize: vertical;
              font-family: inherit;
              outline: none;
              box-sizing: border-box;
              background: white;
              position: relative;
              z-index: 1001;
            " onfocus="this.style.borderColor='#409EFF'" onblur="this.style.borderColor='#ddd'" onmousedown="event.stopPropagation();" onclick="event.stopPropagation();"></textarea>
          </div>

          <button style="
            width: 100%;
            background: #409EFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 15px;
            outline: none;
            box-sizing: border-box;
            position: relative;
            z-index: 1001;
          " onmouseover="this.style.background='#337ecc'" onmouseout="this.style.background='#409EFF'" onmousedown="event.stopPropagation();" onclick="event.stopPropagation(); zhsAskAI();">获取答案</button>

          <!-- AI回答区 -->
          <div style="margin-bottom: 18px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: #333;">AI回答:</label>
            <div id="zhs-ai-answer" style="
              min-height: 60px;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 13px;
              background: #f8f9fa;
              color: #666;
              line-height: 1.5;
              box-sizing: border-box;
              position: relative;
              z-index: 1000;
            " onmousedown="event.stopPropagation();" onclick="event.stopPropagation();">AI助手已准备就绪，请输入您的问题...</div>
          </div>

          <button style="
            width: 100%;
            background: #67C23A;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            outline: none;
            box-sizing: border-box;
            position: relative;
            z-index: 1001;
          " onmouseover="this.style.background='#5daf34'" onmouseout="this.style.background='#67C23A'" onmousedown="event.stopPropagation();" onclick="event.stopPropagation(); zhsCopyAnswer();">复制答案</button>
        </div>


        <div id="zhs-tab-tutorial" class="zhs-tab-panel" style="
          padding: 18px;
          display: none;
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">📖</div>
            <h3 style="margin: 0 0 8px 0; color: #409EFF; font-size: 16px;">使用教程</h3>
            <p style="margin: 0; color: #666; font-size: 12px;">快速上手指南</p>
          </div>

          <div style="font-size: 13px; line-height: 1.6; color: #333;">
            <div style="margin-bottom: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <strong style="color: #856404;">⚠️ 免责声明</strong><br>
              本脚本仅供学习交流使用，请勿用于商业用途。使用本脚本所产生的一切后果由用户自行承担，开发者不承担任何责任。请在遵守相关法律法规和学校规定的前提下使用。
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #409EFF;">🚀 快速开始：</strong><br>
              1. 点击"配置"按钮设置API Key<br>
              2. 开启"自动答题"开关<br>
              3. 脚本将自动处理题目
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #409EFF;">⚙️ 功能说明：</strong><br>
              • 题库API：优先使用题库答案<br>
              • AI答题：智能分析题目内容<br>
              • 状态指示：红绿方块显示答题结果
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #409EFF;">⌨️ 快捷键：</strong><br>
              • F9：显示/隐藏控制面板<br>
              • F10：显示/隐藏日志窗口<br>
              • Ctrl+Shift+S：手动启动答题
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #409EFF;">💡 使用建议：</strong><br>
              • 建议配置API Key以提高准确率<br>
              • 遇到问题可刷新页面重试<br>
              • 合理使用，避免过度依赖
            </div>

            <!-- 技术支持已删除 - 根据用户要求 -->
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // 添加标签切换功能
  addZhsTabSwitchListeners();

  // 添加事件监听器
  addZhihuishuPanelEventListeners();

  // 初始化AI助手面板事件监听器
  initAIAssistantListeners();

  // 添加拖拽功能
  makeZhihuishuPanelDraggable(panel);

  // 初始化面板展开状态
  initPanelExpandState();
}

// 初始化面板展开状态
function initPanelExpandState() {
  const content = document.getElementById('zhs-panel-content');
  const expandBtn = document.getElementById('zhs-expand-btn');

  if (!content || !expandBtn) {
    console.error('面板元素未找到');
    return;
  }

  // 读取保存的展开状态，默认为收起
  const isExpanded = localStorage.getItem('ZhsJsSetting.panelExpanded') === 'true';

  if (isExpanded) {
    content.style.display = 'block';
    expandBtn.classList.add('expanded');
    expandBtn.textContent = '▲';
  } else {

    expandBtn.classList.remove('expanded');
    expandBtn.textContent = '▼';
  }
}

// 添加标签切换功能 - 修复AI助手与教程按钮无法切换的问题
function addZhsTabSwitchListeners() {
  // 等待DOM加载完成后再添加事件监听器
  setTimeout(() => {
    const tabButtons = document.querySelectorAll('.zhs-tab-btn');
    const tabPanels = document.querySelectorAll('.zhs-tab-panel');

    if (tabButtons.length === 0 || tabPanels.length === 0) {
      console.log('标签元素未找到，跳过标签切换功能');
      return;
    }

    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        // 移除所有按钮的active类
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.style.background = 'transparent';
          btn.style.color = '#666';
        });

        // 隐藏所有面板
        tabPanels.forEach(panel => {
          panel.classList.remove('active');
          panel.style.display = 'none';
        });

        // 激活当前按钮
        this.classList.add('active');
        this.style.background = '#409EFF';
        this.style.color = 'white';

        // 显示对应面板
        const targetPanel = document.getElementById(`zhs-tab-${targetTab}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
        }

        logger(`切换到${this.textContent}标签`, 'blue');
      });
    });

    logger('标签切换功能已初始化', 'green');
  }, 100);
}


function initAIAssistantListeners() {
  setTimeout(() => {
    // 获取答案按钮
    const getAnswerBtn = document.querySelector('#zhs-tab-ai button');
    if (getAnswerBtn) {
      // 移除内联事件，添加事件监听器
      getAnswerBtn.removeAttribute('onclick');
      getAnswerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        zhsAskAI();
      });
      logger('AI助手获取答案按钮事件已绑定', 'green');
    }

    // 复制答案按钮
    const copyBtn = document.querySelector('#zhs-tab-ai button:last-child');
    if (copyBtn && copyBtn.textContent.includes('复制')) {
      copyBtn.removeAttribute('onclick');
      copyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        zhsCopyAnswer();
      });
      logger('AI助手复制答案按钮事件已绑定', 'green');
    }


    const questionInput = document.getElementById('zhs-ai-question');
    if (questionInput) {
      questionInput.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      questionInput.addEventListener('focus', function (e) {
        e.stopPropagation();
      });
      logger('AI助手输入框事件已绑定', 'green');
    }

 
    const modelSelect = document.getElementById('zhs-ai-model');
    if (modelSelect) {
      modelSelect.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      modelSelect.addEventListener('change', function (e) {
        e.stopPropagation();
      });
      logger('AI助手模型选择框事件已绑定', 'green');
    }

  }, 200);
}

function zhsAskAI() {


  const questionInput = document.getElementById('zhs-ai-question');
  const modelSelect = document.getElementById('zhs-ai-model');
  const answerDiv = document.getElementById('zhs-ai-answer');



  if (!questionInput || !modelSelect || !answerDiv) {
    logger('❌ AI助手DOM元素获取失败', 'red');
    return;
  }

  const question = questionInput.value.trim();
  const model = modelSelect.value;

  logger(`🤖 用户输入: "${question}", 选择模型: "${model}"`, 'blue');

  if (!question) {
    answerDiv.textContent = '请输入问题';
    logger('⚠️ 用户未输入问题', 'orange');
    return;
  }

  
  const userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';
  if (!userKey) {
    answerDiv.textContent = 'Key不存在，请前往蜜雪激活';
    logger('⚠️ Key不存在，请前往蜜雪激活', 'orange');
    return;
  }

  answerDiv.textContent = '正在思考中...';
  logger('🤖 AI助手开始处理问题...', 'blue');

  zhsGetAIAnswer(question, '问答题')
    .then(answer => {
      logger(`🤖 AI返回答案: "${answer}"`, 'green');
      answerDiv.textContent = answer || '抱歉，无法获取答案';
      // logger('🤖 AI助手回答完成，UI已更新', 'green');
    })
    .catch(error => {
      logger(`🤖 AI助手回答失败: ${error}`, 'red');
      answerDiv.textContent = `错误: ${error}`;
    });
}

// 复制AI助手答案到剪贴板
function zhsCopyAnswer() {
  const answerDiv = document.getElementById('zhs-ai-answer');
  if (!answerDiv) {
    logger('⚠️ 未找到AI答案区域', 'orange');
    return;
  }

  const answer = answerDiv.textContent.trim();
  if (!answer || answer === 'AI助手已准备就绪，请输入您的问题...' || answer === '正在思考中...') {
    logger('⚠️ 没有可复制的答案', 'orange');
    return;
  }

  // 复制到剪贴板
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(answer).then(() => {
      logger('✅ 答案已复制到剪贴板', 'green');
    }).catch(err => {
      logger('❌ 复制失败: ' + err, 'red');
    });
  } else {
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea');
    textArea.value = answer;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      logger('✅ 答案已复制到剪贴板', 'green');
    } catch (err) {
      logger('❌ 复制失败: ' + err, 'red');
    }
    document.body.removeChild(textArea);
  }
}

function toggleZhsPanel() {
  const content = document.getElementById('zhs-panel-content');
  const expandBtn = document.getElementById('zhs-expand-btn');

  if (!content || !expandBtn) {
    console.error('面板元素未找到');
    return;
  }

  // 检查当前状态
  const isHidden = content.style.display === 'none';

  if (isHidden) {
    content.style.display = 'block';
    if (expandBtn) {
      expandBtn.style.transform = 'rotate(180deg)';
    }
    localStorage.setItem('ZhsJsSetting.panelExpanded', 'true');
    logger('控制面板已展开', 'blue');
  } else {
    content.style.display = 'none';
    if (expandBtn) {
      expandBtn.style.transform = 'rotate(0deg)';
    }
    localStorage.setItem('ZhsJsSetting.panelExpanded', 'false');
    logger('控制面板已收起', 'blue');
  }
}

function toggleZhsLogWindow() {
  const logWindow = document.getElementById('zhs-log-window');
  if (logWindow) {
    if (logWindow.style.display === 'none') {
      logWindow.style.display = 'block';
      localStorage.setItem('ZhsJsSetting.hideLogWindow', 'false');
      logger('日志窗口已显示', 'blue');
    } else {
      logWindow.style.display = 'none';
      localStorage.setItem('ZhsJsSetting.hideLogWindow', 'true');
      logger('日志窗口已隐藏', 'blue');
    }
  }
}


function clearZhsLog() {
  const logContainer = document.getElementById('zhs-log-container');
  if (logContainer) {
    logContainer.innerHTML = '';
    logger('日志已清空', 'blue');
  }
}

if (typeof unsafeWindow !== 'undefined') {
  unsafeWindow.toggleZhsPanel = toggleZhsPanel;
  unsafeWindow.toggleZhsLogWindow = toggleZhsLogWindow;
  unsafeWindow.clearZhsLog = clearZhsLog;
  unsafeWindow.zhsAskAI = zhsAskAI;
  unsafeWindow.zhsCopyAnswer = zhsCopyAnswer;
} else {
  window.toggleZhsPanel = toggleZhsPanel;
  window.toggleZhsLogWindow = toggleZhsLogWindow;
  window.clearZhsLog = clearZhsLog;
  window.zhsAskAI = zhsAskAI;
  window.zhsCopyAnswer = zhsCopyAnswer;
}

// 初始化复选框状态
function initCheckboxStates() {
  // 自动答题开关已删除 - 更多设置区域已有答题方式配置

  // 自动播放视频开关
  const autoVideoToggle = document.getElementById('zhs-auto-video');
  if (autoVideoToggle) {
    autoVideoToggle.checked = localStorage.getItem('ZhsJsSetting.video') === 'true';
  }

  // 自动切换下一节开关
  const autoJumpToggle = document.getElementById('zhs-auto-jump');
  if (autoJumpToggle) {
    autoJumpToggle.checked = localStorage.getItem('ZhsJsSetting.jump') === 'true';
  }

  // AI智能答题开关
  const useAIToggle = document.getElementById('zhs-use-ai');
  if (useAIToggle) {
    useAIToggle.checked = localStorage.getItem('ZhsJsSetting.useAI') === 'true' ||
      localStorage.getItem('GPTJsSetting.useAI') === 'true';
  }



  // 自动提交开关
  const autoSubmitToggle = document.getElementById('zhs-auto-submit');
  if (autoSubmitToggle) {
    autoSubmitToggle.checked = localStorage.getItem('ZhsJsSetting.autoSubmit') === 'true' ||
      localStorage.getItem('GPTJsSetting.autoSubmit') === 'true';
  }

  // 题库答题开关
  const mainDatabaseToggle = document.getElementById('zhs-main-database');
  if (mainDatabaseToggle) {
    mainDatabaseToggle.checked = localStorage.getItem('ZhsJsSetting.useTiku') === 'true' ||
      localStorage.getItem('GPTJsSetting.useTiku') === 'true';
  }

  // 更多设置区域的复选框状态初始化 - 修复默认状态
  const useTikuCheckbox = document.getElementById('GPTJsSetting.useTiku');
  if (useTikuCheckbox) {
    useTikuCheckbox.checked = localStorage.getItem('GPTJsSetting.useTiku') === 'true';
  }

  const useBackupTikuCheckbox = document.getElementById('GPTJsSetting.useBackupTiku');
  if (useBackupTikuCheckbox) {
    useBackupTikuCheckbox.checked = false; // 备用题库功能已删除
  }

  const useAICheckbox = document.getElementById('GPTJsSetting.useAI');
  if (useAICheckbox) {
    useAICheckbox.checked = localStorage.getItem('GPTJsSetting.useAI') === 'true';
  }



  const autoSubmitCheckbox = document.getElementById('GPTJsSetting.autoSubmit');
  if (autoSubmitCheckbox) {
    autoSubmitCheckbox.checked = localStorage.getItem('GPTJsSetting.autoSubmit') === 'true';
  }

  const showAnswerCheckbox = document.getElementById('GPTJsSetting.showAnswer');
  if (showAnswerCheckbox) {
    showAnswerCheckbox.checked = localStorage.getItem('GPTJsSetting.showAnswer') === 'true';
  }

  const modelSelect = document.getElementById('GPTJsSetting.model');
  if (modelSelect) {
    modelSelect.value = localStorage.getItem('GPTJsSetting.model') || 'gpt-3.5-turbo-16k';
  }

  logger('复选框状态已初始化', 'blue');
}

// 初始化面板状态
function initZhsPanelState() {
  // 延迟执行，确保DOM元素已创建
  setTimeout(() => {
    const isExpanded = localStorage.getItem('ZhsJsSetting.panelExpanded') === 'true';
    const content = document.getElementById('zhs-panel-content');
    const expandBtn = document.getElementById('zhs-expand-btn');

    if (!content || !expandBtn) {
      console.error('面板元素未找到，无法初始化状态');
      return;
    }

    if (isExpanded) {
      content.style.display = 'block';
      expandBtn.classList.add('expanded');
      expandBtn.textContent = '▲';
    } else {
      content.style.display = 'none';
      expandBtn.classList.remove('expanded');
      expandBtn.textContent = '▼';
    }

    // 初始化复选框状态
    initCheckboxStates();
  }, 100);
}

// 添加题目状态指示器
function addQuestionStatusIndicator(questionNumber, status, details = {}) {
  const statusContainer = document.getElementById('zhs-status-indicators');
  if (!statusContainer) return;

  // 移除已存在的相同题目指示器
  const existingIndicator = document.getElementById(`zhs-status-${questionNumber}`);
  if (existingIndicator) {
    existingIndicator.remove();
  }

  // 创建新的状态指示器 - 修复颜色显示问题
  const indicator = document.createElement('div');
  indicator.id = `zhs-status-${questionNumber}`;

  // 根据状态设置颜色
  let backgroundColor, title;
  if (status === 'success') {
    backgroundColor = '#67C23A'; // 绿色
    title = '答题成功';
  } else if (status === 'failed') {
    backgroundColor = '#F56C6C'; // 红色
    title = '答题失败';
  } else {
    backgroundColor = '#E6A23C'; // 橙色
    title = '处理中';
  }

  indicator.style.cssText = `
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 2px;
    background: ${backgroundColor};
  `;

  indicator.textContent = questionNumber;
  indicator.title = title;

  // 点击显示详细信息
  indicator.addEventListener('click', () => {
    showQuestionDetails(questionNumber, status, details);
  });

  statusContainer.appendChild(indicator);
}

// 显示题目详细信息
function showQuestionDetails(questionNumber, status, details) {
  const detailsHtml = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      padding: 20px;
      max-width: 500px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 2147483647;
    " id="zhs-question-details">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9ecef;
      ">
        <h3 style="margin: 0; color: #409EFF;">第${questionNumber}题详情</h3>
        <button onclick="document.getElementById('zhs-question-details').remove()" style="
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #999;
        ">×</button>
      </div>

      <div style="margin-bottom: 10px;">
        <strong>状态：</strong>
        <span style="color: ${status === 'success' ? '#67C23A' : '#F56C6C'};">
          ${status === 'success' ? '✅ 答题成功' : '❌ 答题失败'}
        </span>
      </div>

      ${details.question ? `<div style="margin-bottom: 10px;"><strong>题目：</strong>${details.question}</div>` : ''}
      ${details.type ? `<div style="margin-bottom: 10px;"><strong>类型：</strong>${details.type}</div>` : ''}
      ${details.options ? `<div style="margin-bottom: 10px;"><strong>选项：</strong>${details.options}</div>` : ''}
      ${details.answer ? `<div style="margin-bottom: 10px;"><strong>答案：</strong>${details.answer}</div>` : ''}
      ${details.selected ? `<div style="margin-bottom: 10px;"><strong>已选：</strong>${details.selected}</div>` : ''}
      ${details.error ? `<div style="margin-bottom: 10px; color: #F56C6C;"><strong>错误：</strong>${details.error}</div>` : ''}
    </div>
  `;

  // 移除已存在的详情窗口
  const existingDetails = document.getElementById('zhs-question-details');
  if (existingDetails) {
    existingDetails.remove();
  }

  document.body.insertAdjacentHTML('beforeend', detailsHtml);
}


function getCurrentQuestionNumber() {

  const questionNumberMatch = document.body.textContent.match(/第\s*(\d+)\s*题|(\d+)\.\s*【|题目\s*(\d+)/);
  if (questionNumberMatch) {
    return parseInt(questionNumberMatch[1] || questionNumberMatch[2] || questionNumberMatch[3]);
  }


  if (typeof setting !== 'undefined' && setting.num !== undefined) {
    return setting.num + 1;
  }


  const processedQuestions = document.querySelectorAll('.question-status-indicator').length;
  return processedQuestions + 1;
}

function getQuestionText(questionElement) {
  let questionText = '';


  const questionContentDiv = questionElement.find('.questionContent');
  if (questionContentDiv.length > 0) {
    const spans = questionContentDiv.find('p span');
    if (spans.length > 0) {
  
      let spanTexts = [];
      let seenTexts = new Set(); // 用于去重
      spans.each(function () {
        const spanText = $(this).text().trim();
        if (spanText && !spanText.match(/^[A-D]\./) && spanText.length > 0) {
   
          if (!seenTexts.has(spanText)) {
            spanTexts.push(spanText);
            seenTexts.add(spanText);
          }
        }
      });
      questionText = spanTexts.join('').trim();
      logger(`🔍 getQuestionText从.questionContent p span获取: ${questionText.substring(0, 50)}...`, 'blue');
    }
  }

 
  if (!questionText) {
    const paragraphs = questionElement.find('p').not('.optionUl p, .el-radio p');
    paragraphs.each(function () {
      const text = $(this).text().trim();

      if (!text.match(/^[一二三四五六七八九十]、.*?题/) &&
        !text.match(/^[A-D]\./) &&
        text.length > 10) {
        questionText = text;
        return false; // 找到题目内容后跳出
      }
    });
  }


  if (!questionText) {
    const questionSelectors = [
      '.questionTit',
      '.question-text',
      '.subject_stem',
      '.question-content',
      '.question-title'
    ];

    for (const selector of questionSelectors) {
      const element = questionElement.find(selector);
      if (element.length > 0) {
        questionText = element.text().trim();
        if (questionText.length > 10) {
          break;
        }
      }
    }
  }

  // 如果还是没找到，使用原来的简化逻辑作为最后备选
  if (!questionText) {
    questionText = questionElement.find('p, div').first().text().trim();
  }

  return questionText || '未获取到题目内容';
}


function zhsVerifyAPIKey(key) {
  return new Promise((resolve, reject) => {
    if (!key || key.trim() === '') {
      reject('Key不能为空');
      return;
    }


    const API_BASE_URL = (() => {
      const baseUrl = "tk.mixuelo.cc/api.php";
      const protocol = window.location.protocol;
      if (protocol === 'https:') {
        return "https://" + baseUrl;
      } else {
        return "http://" + baseUrl;
      }
    })();

    GM_xmlhttpRequest({
      url: API_BASE_URL + "?act=verify_key",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: "key=" + encodeURIComponent(key),
      onload: function (response) {
        try {
          const result = JSON.parse(response.responseText);
          if (result.code === 1) {
            // 验证成功，保存key
            localStorage.setItem('GPTJsSetting.key', key);
            localStorage.setItem('tiku_key', key);
            resolve({ success: true, message: result.msg || 'Key验证成功' });
          } else {
            // 验证失败
            resolve({ success: false, message: result.msg || 'Key验证失败' });
          }
        } catch (e) {
          resolve({ success: false, message: '响应解析失败: ' + e.message });
        }
      },
      onerror: function (error) {
        reject('网络错误');
      },
      ontimeout: function () {
        reject('请求超时');
      }
    });
  });
}


function createZhihuishuLogWindow() {

  if (document.getElementById('zhs-log-window')) {
    return;
  }

  const shouldHide = localStorage.getItem('ZhsJsSetting.hideLogBox') === 'true';
  const initialDisplay = shouldHide ? 'none' : 'block';

  const logWindow = document.createElement('div');
  logWindow.id = 'zhs-log-window';
  logWindow.className = 'gpt-box';
  logWindow.style.cssText = `
    position: fixed !important;
    top: 80px !important;
    right: 370px !important;
    width: 350px !important;
    max-height: 500px !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
    backdrop-filter: blur(4px) !important;
    -webkit-backdrop-filter: blur(4px) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    z-index: 2147483645 !important;
    font-family: "Microsoft YaHei", sans-serif !important;
    transition: all 0.3s ease !important;
    cursor: move !important;
    transform: none !important;
    margin: 0 !important;
    display: ${initialDisplay} !important;
  `;

  logWindow.innerHTML = `
    <div class="gpt-box-header" style="
      cursor: move;
      padding: 5px 0;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #409EFF !important;
      color: white !important;
      border-radius: 10px 10px 0 0 !important;
      padding: 10px 15px !important;
    ">
      <div class="gpt-box-title" style="
        font-weight: bold;
        color: white;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        📋 答题日志
      </div>
      <div class="gpt-box-actions" style="
        display: flex;
        gap: 8px;
      ">
        <button onclick="clearZhsLog()" title="清空日志" style="
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          color: white !important;
          cursor: pointer !important;
          font-size: 12px !important;
          transition: all 0.3s !important;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">清空</button>
        <button onclick="document.getElementById('zhs-log-window').style.display='none'" title="隐藏日志" style="
          background: rgba(255, 255, 255, 0.2) !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          color: white !important;
          cursor: pointer !important;
          font-size: 12px !important;
          transition: all 0.3s !important;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">隐藏</button>
      </div>
    </div>

    <!-- 题目状态指示器区域 - 红色/绿色正方形数字 -->
    <div id="zhs-question-status" style="
      padding: 10px 15px;
      border-bottom: 1px solid #e9ecef;
      background: white;
    ">
      <div style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 500;">题目状态：</div>
      <div id="zhs-status-indicators" style="
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-height: 30px;
        align-items: flex-start;
      "></div>
    </div>

    <!-- 详细日志区域 -->
    <div class="gpt-messages-container" style="
      max-height: 250px !important;
      overflow-y: auto !important;
      padding: 10px 15px !important;
      font-size: 11px !important;
      line-height: 1.4 !important;
      color: #333 !important;
      font-family: 'Microsoft YaHei', sans-serif !important;
      word-wrap: break-word !important;
      background: white !important;
    " id="zhs-log-container"></div>
  `;

  document.body.appendChild(logWindow);

  // 添加拖拽功能
  makeZhihuishuLogWindowDraggable(logWindow);
}

// 清空日志函数
function clearZhsLog() {
  const logContainer = document.getElementById('zhs-log-container');
  const statusIndicators = document.getElementById('zhs-status-indicators');
  if (logContainer) {
    logContainer.innerHTML = '';
    logger('📝 日志已清空', 'blue');
  }
  if (statusIndicators) {
    statusIndicators.innerHTML = '';
  }
}

// 题目状态管理器 - 集成到日志窗口中
const questionStatusManager = {
  questions: new Map(),

  // 添加或更新题目状态
  updateQuestionStatus(questionNumber, status, details = {}) {
    // 保存题目信息
    this.questions.set(questionNumber, {
      number: questionNumber,
      status: status, // 'success', 'failed', 'pending'
      question: details.question || '',
      answer: details.answer || '',
      selectedOptions: details.selectedOptions || '',
      timestamp: new Date(),
      ...details
    });

    // 更新UI显示
    this.updateStatusIndicator(questionNumber, status, details);
  },

  // 更新状态指示器UI - 集成到日志窗口
  updateStatusIndicator(questionNumber, status, details = {}) {
    const statusIndicators = document.getElementById('zhs-status-indicators');
    if (!statusIndicators) {
      logger('⚠️ 未找到日志窗口中的状态指示器容器', 'orange');
      return;
    }

    // 移除已存在的指示器
    const existingIndicator = document.getElementById(`zhs-status-${questionNumber}`);
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // 创建新的状态指示器
    const indicator = document.createElement('div');
    indicator.id = `zhs-status-${questionNumber}`;
    indicator.className = 'question-status-indicator';

    const backgroundColor = status === 'success' ? '#67C23A' :
      status === 'failed' ? '#F56C6C' : '#E6A23C';

    indicator.style.cssText = `
      width: 28px;
      height: 28px;
      background: ${backgroundColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      margin: 2px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      user-select: none;
    `;

    indicator.textContent = questionNumber;
    indicator.title = `第${questionNumber}题 - 点击查看详情`;

    // 悬停效果
    indicator.onmouseover = function () {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    };
    indicator.onmouseout = function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    };

    // 点击显示详情
    indicator.addEventListener('click', () => {
      this.showQuestionDetail(questionNumber);
    });

    // 按题目编号顺序插入
    const indicators = statusIndicators.querySelectorAll('.question-status-indicator');
    let inserted = false;
    for (const existingIndicator of indicators) {
      const existingNumber = parseInt(existingIndicator.textContent);
      if (questionNumber < existingNumber) {
        statusIndicators.insertBefore(indicator, existingIndicator);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      statusIndicators.appendChild(indicator);
    }

    logger(`📊 题目${questionNumber}状态已更新: ${status}`, status === 'success' ? 'green' : status === 'failed' ? 'red' : 'orange');
  },

  // 显示题目详情
  showQuestionDetail(questionNumber) {
    const questionData = this.questions.get(questionNumber);
    if (!questionData) {
      logger(`未找到第${questionNumber}题的数据`, 'orange');
      return;
    }

    // 移除已存在的详情窗口
    const existingDetail = document.getElementById('question-detail-modal');
    if (existingDetail) {
      existingDetail.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'question-detail-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2147483648;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const statusText = {
      'success': '✅ 成功',
      'failed': '❌ 失败',
      'pending': '⏳ 进行中'
    };

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 10px;
        padding: 20px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 2px solid #409EFF;
      ">
        <div style="
          background: linear-gradient(135deg, #409EFF 0%, #36A3F7 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          margin: -20px -20px 15px -20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-weight: 500;">题目详情 - 第${questionNumber}题</span>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
          ">×</button>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 500; color: #333; margin-bottom: 5px;">题目编号：</div>
          <div style="color: #666;">第${questionNumber}题</div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 500; color: #333; margin-bottom: 5px;">题目内容：</div>
          <div style="color: #666; line-height: 1.4; word-break: break-word;">${questionData?.question || '暂无题目内容'}</div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 500; color: #333; margin-bottom: 5px;">选择选项：</div>
          <div style="color: #666;">${questionData?.selectedOptions || questionData?.answer || '暂无答案'}</div>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 500; color: #333; margin-bottom: 5px;">答题状态：</div>
          <div style="color: #666;">${statusText[questionData?.status] || questionData?.status || '未知状态'}</div>
        </div>

        <div>
          <div style="font-weight: 500; color: #333; margin-bottom: 5px;">处理时间：</div>
          <div style="color: #666;">${questionData?.timestamp ? questionData.timestamp.toLocaleString() : '暂无时间'}</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 点击模态框外部关闭
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // 5秒后自动关闭
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 5000);
  }
};





function addZhihuishuPanelEventListeners() {

  const panelHeader = document.querySelector('#zhs-control-panel .gpt-box-header');
  if (panelHeader) {
    panelHeader.addEventListener('click', function (e) {
      // 防止事件冒泡
      e.stopPropagation();
      toggleZhsPanel();
    });
  }


  const autoVideoToggle = document.getElementById('zhs-auto-video');
  if (autoVideoToggle) {
    autoVideoToggle.addEventListener('change', (e) => {
      setting.video = e.target.checked;
      updateToggleStyle(e.target);
      logger(`自动播放视频已${setting.video ? '开启' : '关闭'}`, setting.video ? 'green' : 'orange');
    });
  }

  // 播放倍速选择
  const speedSelect = document.getElementById('zhs-video-speed');
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      setting.speed = e.target.value;
      logger(`播放倍速设置为 ${setting.speed}x`, 'blue');
    });
  }

  // 音量滑块
  const volumeSlider = document.getElementById('zhs-volume');
  const volumeDisplay = document.getElementById('zhs-volume-display');
  if (volumeSlider && volumeDisplay) {
    volumeSlider.addEventListener('input', (e) => {
      setting.vol = e.target.value;
      volumeDisplay.textContent = `${setting.vol}%`;
    });

    volumeSlider.addEventListener('change', (e) => {
      logger(`音量设置为 ${setting.vol}%`, 'blue');
    });
  }

  // API Key输入框
  const apiKeyInput = document.getElementById('zhs-api-key-input');
  if (apiKeyInput) {
    apiKeyInput.addEventListener('input', (e) => {
      const key = e.target.value.trim();
      localStorage.setItem('GPTJsSetting.key', key);
      localStorage.setItem('tiku_key', key); // 同步到tiku_key
      if (key) {
        logger('API Key已更新: ' + key.substring(0, 3) + '***' + key.substring(key.length - 3), 'green');
      } else {
        logger('API Key已清空', 'orange');
      }
    });
  }

  const stopAnswerBtn = document.getElementById('zhs-stop-answer');
  if (stopAnswerBtn) {
    stopAnswerBtn.addEventListener('click', () => {
      const isCurrentlyWorking = localStorage.getItem('GPTJsSetting.work') === 'true';

      if (isCurrentlyWorking) {
        // 当前正在答题，执行停止操作
        setting.work = false;
        localStorage.setItem('GPTJsSetting.work', 'false');
        localStorage.setItem('ZhsJsSetting.work', 'false');

        logger('🛑 停止自动答题', 'red');

        // 清除所有答题相关的定时器
        if (setting.loop) {
          clearInterval(setting.loop);
          setting.loop = null;
        }

        // 清空答题队列
        setting.queue = [];
        logger('🛑 已清空答题队列', 'blue');


        setting.shouldNavigateNext = false;

        zhsStopAllAutoActions();

        stopAnswerBtn.textContent = '开始答题';
        stopAnswerBtn.style.background = '#67C23A';
        stopAnswerBtn.onmouseover = function () { this.style.background = '#5daf34'; };
        stopAnswerBtn.onmouseout = function () { this.style.background = '#67C23A'; };

        logger('✅ 所有自动化操作已停止，可手动操作', 'green');
        logger('💡 点击"开始答题"按钮可重新开始自动答题', 'blue');
      } else {
  
        setting.work = true;
        localStorage.setItem('GPTJsSetting.work', 'true');
        localStorage.setItem('ZhsJsSetting.work', 'true');

        logger('🚀 重新开始自动答题', 'green');


        stopAnswerBtn.textContent = '停止答题';
        stopAnswerBtn.style.background = '#F56C6C';
        stopAnswerBtn.onmouseover = function () { this.style.background = '#f45454'; };
        stopAnswerBtn.onmouseout = function () { this.style.background = '#F56C6C'; };

    
        setTimeout(() => {
          if (checkZhsAnswerPage()) {
            logger('🎯 重新启动答题功能', 'green');
            zhsProcessQuestions();
          }
        }, 1000);
      }
    });
  }


  const moreSettingsBtn = document.getElementById('zhs-more-settings-btn');
  const moreSettings = document.getElementById('zhs-more-settings');
  let isSettingsVisible = false;

  if (moreSettingsBtn && moreSettings) {
    moreSettingsBtn.addEventListener('click', () => {
      isSettingsVisible = !isSettingsVisible;
      moreSettings.style.display = isSettingsVisible ? 'block' : 'none';
      moreSettingsBtn.textContent = isSettingsVisible ? '隐藏设置' : '设置';
    });
  }

  const showLogBtn = document.getElementById('zhs-show-log');
  if (showLogBtn) {
    showLogBtn.addEventListener('click', () => {
      const logWindow = document.getElementById('zhs-log-window');
      if (logWindow) {
        logWindow.style.display = logWindow.style.display === 'none' ? 'block' : 'none';
        showLogBtn.textContent = logWindow.style.display === 'none' ? '显示日志' : '隐藏日志';
      }
    });
  }

  const tutorialBtn = document.getElementById('zhs-tutorial-btn');
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      const tutorialContent = `🌳 智慧树助手使用教程

📋 基本功能：
• 进入页面自动开始答题，无需手动启动
• 支持题库API、AI答题多种模式
• 实时显示答题状态和结果

🔧 配置说明：
• API配置：输入题库API Key并保存
• 更多设置：可开启/关闭各种答题模式
• AI模型：可选择不同的AI模型

⌨️ 快捷键：
• F9：显示/隐藏控制面板
• F10：显示/隐藏日志窗口
• Ctrl+Shift+S：手动启动答题

📊 状态指示器：
• 绿色方块：答题成功
• 红色方块：答题失败或跳过
• 点击方块可查看详细信息

💡 注意事项：
• 请合理使用，遵守学习规范
• 建议配置API Key以提高准确率
• 如遇问题可刷新页面重新开始`;

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2147483648;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      modal.innerHTML = `
        <div style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
          <div style="
            font-weight: bold;
            font-size: 16px;
            color: #409EFF;
            margin-bottom: 15px;
            text-align: center;
          ">智慧树助手使用教程</div>
          <div style="
            white-space: pre-line;
            line-height: 1.6;
            color: #333;
            font-size: 13px;
          ">${tutorialContent}</div>
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
              padding: 8px 20px;
              background: #409EFF;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 13px;
            ">关闭</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // 点击背景关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    });
  }


  const clearLogBtn = document.getElementById('zhs-clear-log');
  if (clearLogBtn) {
    clearLogBtn.addEventListener('click', () => {
      const logContainer = document.getElementById('zhs-log-container');
      if (logContainer) {
        logContainer.innerHTML = '';
        logger('日志已清空', 'blue');
      }
    });
  }

  const saveKeyBtn = document.getElementById('zhs-save-key-btn');
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const key = document.getElementById('zhs-api-key-input').value.trim();
      const saveKeyMsg = document.getElementById('zhs-save-key-msg');

      if (!key) {
        saveKeyMsg.innerText = '请输入Key！';
        saveKeyMsg.style.backgroundColor = '#f44336';
        saveKeyMsg.style.color = 'white';
        saveKeyMsg.style.display = 'block';
        setTimeout(() => {
          saveKeyMsg.style.display = 'none';
        }, 3000);
        return;
      }

   
      saveKeyMsg.innerText = '正在验证Key...';
      saveKeyMsg.style.backgroundColor = '#2196F3';
      saveKeyMsg.style.color = 'white';
      saveKeyMsg.style.display = 'block';
      saveKeyBtn.disabled = true;
      saveKeyBtn.innerText = '验证中...';


      zhsVerifyAPIKey(key).then(result => {
        if (result.success) {
      
          localStorage.setItem('GPTJsSetting.key', key);
          localStorage.setItem('tiku_key', key);

          saveKeyMsg.innerText = 'API Key 保存成功！';
          saveKeyMsg.style.backgroundColor = '#4CAF50';
          logger('API Key 保存成功！', 'green');
        } else {
       
          saveKeyMsg.innerText = 'Key不存在，请前往蜜雪激活';
          saveKeyMsg.style.backgroundColor = '#f44336';
          logger('Key不存在，请前往蜜雪激活', 'red');
        }
      }).catch(error => {
        saveKeyMsg.innerText = '验证失败: ' + error;
        saveKeyMsg.style.backgroundColor = '#f44336';
        logger('Key验证出错: ' + error, 'red');
      }).finally(() => {
        saveKeyBtn.disabled = false;
        saveKeyBtn.innerText = '保存验证';
        setTimeout(() => {
          saveKeyMsg.style.display = 'none';
        }, 3000);
      });
    });
  }

  // 最小化按钮
  const minimizeBtn = document.getElementById('zhs-minimize-btn');
  const panelContent = document.getElementById('zhs-panel-content');
  if (minimizeBtn && panelContent) {
    minimizeBtn.addEventListener('click', () => {
      const isMinimized = panelContent.style.display === 'none';
      panelContent.style.display = isMinimized ? 'block' : 'none';
      minimizeBtn.textContent = isMinimized ? '−' : '+';
    });
  }

  // 关闭按钮
  const closeBtn = document.getElementById('zhs-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const panel = document.getElementById('zhs-control-panel');
      if (panel) {
        panel.style.display = 'none';
      }
    });
  }

  // 绑定更多设置区域的事件监听器
  bindMoreSettingsEventListeners();
}


function bindMoreSettingsEventListeners() {

  const useTikuCheckbox = document.getElementById('GPTJsSetting.useTiku');
  if (useTikuCheckbox) {

    useTikuCheckbox.checked = localStorage.getItem('GPTJsSetting.useTiku') === 'true';
    useTikuCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      localStorage.setItem('GPTJsSetting.useTiku', isChecked.toString());
      localStorage.setItem('ZhsJsSetting.useTiku', isChecked.toString());
      setting.useTiku = isChecked;
      logger(`题库答题已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
    });
  }


  const useBackupTikuCheckbox = document.getElementById('GPTJsSetting.useBackupTiku');
  if (useBackupTikuCheckbox) {
    useBackupTikuCheckbox.addEventListener('change', (e) => {
 
      logger('备用题库功能已删除，请使用主题库或AI答题', 'orange');
      e.target.checked = false; // 强制关闭
    });
  }

  
  const useAICheckbox = document.getElementById('GPTJsSetting.useAI');
  if (useAICheckbox) {
  
    useAICheckbox.checked = localStorage.getItem('GPTJsSetting.useAI') === 'true';
    useAICheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      localStorage.setItem('GPTJsSetting.useAI', isChecked.toString());
      localStorage.setItem('ZhsJsSetting.useAI', isChecked.toString());
      setting.useAI = isChecked;
      logger(`AI自动答题已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
    });
  }



  // 自动提交开关
  const autoSubmitCheckbox = document.getElementById('GPTJsSetting.autoSubmit');
  if (autoSubmitCheckbox) {
    // 设置初始状态
    autoSubmitCheckbox.checked = localStorage.getItem('GPTJsSetting.autoSubmit') === 'true';
    autoSubmitCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      localStorage.setItem('GPTJsSetting.autoSubmit', isChecked.toString());
      localStorage.setItem('ZhsJsSetting.autoSubmit', isChecked.toString());
      setting.autoSubmit = isChecked;
      logger(`自动提交已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
    });
  }

  // 显示答案开关
  const showAnswerCheckbox = document.getElementById('GPTJsSetting.showAnswer');
  if (showAnswerCheckbox) {
    // 设置初始状态
    showAnswerCheckbox.checked = localStorage.getItem('GPTJsSetting.showAnswer') !== 'false';
    showAnswerCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      localStorage.setItem('GPTJsSetting.showAnswer', isChecked.toString());
      localStorage.setItem('ZhsJsSetting.showAnswer', isChecked.toString());
      setting.showAnswer = isChecked;
      logger(`显示答案已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
    });
  }

  // AI模型选择
  const modelSelect = document.getElementById('GPTJsSetting.model');
  if (modelSelect) {
    // 设置初始状态
    const savedModel = localStorage.getItem('GPTJsSetting.model') || 'gpt-3.5-turbo-16k';
    modelSelect.value = savedModel;
    modelSelect.addEventListener('change', (e) => {
      const selectedModel = e.target.value;
      localStorage.setItem('GPTJsSetting.model', selectedModel);
      localStorage.setItem('ZhsJsSetting.model', selectedModel);
      setting.model = selectedModel;
      logger(`AI模型已切换为: ${selectedModel}`, 'blue');
    });
  }

  logger('更多设置区域事件监听器绑定完成', 'blue');
}

// 更新开关样式
function updateToggleStyle(toggle) {
  const slider = toggle.nextElementSibling;
  const knob = slider.querySelector('span');

  if (toggle.checked) {
    slider.style.backgroundColor = '#4CAF50';
    knob.style.left = '29px';
  } else {
    slider.style.backgroundColor = '#ccc';
    knob.style.left = '3px';
  }
}

function makeZhihuishuPanelDraggable(panel) {
  let isDragging = false;
  let dragOffsetX, dragOffsetY;

  function savePosition() {
    if (panel) {
      const rect = panel.getBoundingClientRect();
      const position = {
        left: rect.left,
        top: rect.top
      };
      localStorage.setItem('zhs-panel-position', JSON.stringify(position));
    }
  }

 
  function loadPosition() {
    if (panel) {
      try {
        const savedPosition = localStorage.getItem('zhs-panel-position');
        if (savedPosition) {
          const position = JSON.parse(savedPosition);
          panel.style.setProperty('left', position.left + 'px', 'important');
          panel.style.setProperty('top', position.top + 'px', 'important');
          panel.style.setProperty('right', 'auto', 'important');
        }
      } catch (err) {
        console.error('无法恢复面板位置', err);
      }
    }
  }

  // 使用事件捕获阶段，确保先捕获事件 - 完全修复AI助手面板事件冲突问题
  panel.addEventListener('mousedown', function (e) {
    // 完全禁止在AI助手面板内拖拽
    if (e.target.closest('#zhs-tab-ai')) {
      e.stopPropagation();
      return false;
    }

    // 完全禁止在标签内容区域拖拽
    if (e.target.closest('.zhs-tab-content')) {
      e.stopPropagation();
      return false;
    }

    // 扩展交互元素检测 - 确保所有可交互元素都不触发拖动
    const interactiveElements = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'A', 'LABEL'];

    // 检查元素标签
    if (interactiveElements.includes(e.target.tagName)) {
      e.stopPropagation();
      return false;
    }

    // 检查是否点击了交互元素的子元素
    for (const tag of interactiveElements) {
      if (e.target.closest(tag.toLowerCase())) {
        e.stopPropagation();
        return false;
      }
    }

    // 只有点击标题栏才允许拖动
    const header = panel.querySelector('.gpt-box-header');
    if (!header || (!header.contains(e.target) && !e.target.classList.contains('gpt-box-header'))) {
      return false;
    }

    isDragging = true;
    dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
    dragOffsetY = e.clientY - panel.getBoundingClientRect().top;

    // 拖动时禁用过渡效果 - 关键优化点
    panel.style.setProperty('transition', 'none', 'important');

    // 确保拖动时面板在最顶层
    panel.style.setProperty('z-index', '2147483647', 'important');

    // 拖动时改变视觉效果
    panel.style.setProperty('box-shadow', '0 12px 48px rgba(0, 0, 0, 0.4)', 'important');
    panel.style.setProperty('opacity', '0.95', 'important');

    // 防止选中文本 - 只在确实需要拖动时才阻止事件
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // 使用顶层文档的mousemove事件
  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      const newLeft = e.clientX - dragOffsetX;
      const newTop = e.clientY - dragOffsetY;

      // 确保不超出屏幕边界
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;

      // 使用!important确保样式不被覆盖 - 关键优化点
      panel.style.setProperty('left', Math.max(0, Math.min(newLeft, maxX)) + 'px', 'important');
      panel.style.setProperty('top', Math.max(0, Math.min(newTop, maxY)) + 'px', 'important');
      panel.style.setProperty('right', 'auto', 'important');
      panel.style.setProperty('bottom', 'auto', 'important');

      // 防止事件传播
      e.preventDefault();
    }
  }, true);

  document.addEventListener('mouseup', function (e) {
    if (isDragging) {
      isDragging = false;

      // 恢复过渡效果和视觉样式 - 关键优化点
      panel.style.setProperty('transition', 'all 0.3s ease', 'important');
      panel.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)', 'important');
      panel.style.setProperty('opacity', '1', 'important');

      // 防止事件传播
      e.stopPropagation();

      // 保存位置到localStorage
      savePosition();
    }
  }, true);

  // 页面加载时恢复位置
  setTimeout(loadPosition, 1000);
}

// 使智慧树日志窗口可拖拽 - 优化性能，修复卡顿问题
function makeZhihuishuLogWindowDraggable(logWindow) {
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;
  let xOffset = 0;
  let yOffset = 0;
  let animationId = null;

  const header = logWindow.querySelector('div:first-child');
  header.style.cursor = 'move';
  header.style.userSelect = 'none'; // 防止文本选择

  // 优化事件监听器
  header.addEventListener('mousedown', dragStart, { passive: false });

  function dragStart(e) {
    // 排除按钮和其他交互元素
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;

    // 添加全局事件监听器
    document.addEventListener('mousemove', dragMove, { passive: false });
    document.addEventListener('mouseup', dragEnd, { passive: false });

    // 添加视觉反馈
    logWindow.style.opacity = '0.8';
    logWindow.style.zIndex = '2147483647';
  }

  function dragMove(e) {
    if (!isDragging) return;

    e.preventDefault();

    // 使用requestAnimationFrame优化性能
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    animationId = requestAnimationFrame(() => {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      // 使用transform3d启用硬件加速
      logWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    });
  }

  function dragEnd() {
    if (!isDragging) return;

    isDragging = false;

    // 移除全局事件监听器
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);

    // 恢复视觉状态
    logWindow.style.opacity = '1';
    logWindow.style.zIndex = '2147483645';

    // 清理动画帧
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
}

// 添加智慧树键盘快捷键
function addZhihuishuKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // F9 显示/隐藏控制面板
    if (e.key === 'F9' || e.keyCode === 120) {
      e.preventDefault();
      const panel = document.getElementById('zhs-control-panel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        logger(`控制面板已${panel.style.display === 'none' ? '隐藏' : '显示'}`, 'blue');
      }
    }

    // F10 显示/隐藏日志窗口
    if (e.key === 'F10' || e.keyCode === 121) {
      e.preventDefault();
      const logWindow = document.getElementById('zhs-log-window');
      if (logWindow) {
        logWindow.style.display = logWindow.style.display === 'none' ? 'block' : 'none';
        logger(`日志窗口已${logWindow.style.display === 'none' ? '隐藏' : '显示'}`, 'blue');
      }
    }

    // Ctrl+Shift+S 开始答题
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      logger('快捷键启动答题', 'green');
      initZhihuishuExam();
    }
  });
}

// 智慧树原始答题系统初始化
function initZhihuishuOriginalAnswering() {
  logger('初始化智慧树原始答题系统', 'blue');

  // 初始化队列和变量
  setting.queue = setting.queue || [];
  setting.curs = setting.curs || [];
  setting.type = {
    单选题: 1,
    多选题: 2,
    填空题: 3,
    问答题: 4,
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    判断题: 14
  };
  setting.lose = setting.num = setting.small = 0;

  // 设置正确的XMLHttpRequest钩子（用于考试页面和练习页面）
  _self.XMLHttpRequest = function () {
    var ajax = new XMLHttpRequest();
    ajax.onload = function (e) {
      // 处理考试数据
      if (this.status == 200 && this.responseURL.match(/doHomework|doExam/)) {
        try {
          var obj = JSON.parse(this.responseText);
          if (obj.rt && obj.rt.examBase) {
            logger('获取到考试数据，开始处理题目', 'green');
            zhsCollectData(obj.rt.examBase);
          }
        } catch (e) {
          logger('解析考试数据失败: ' + e, 'red');
        }
      }

      // 处理智慧树练习页面的题目数据
      if (this.status == 200 && this.responseURL.match('getDoQuestSingle')) {
        try {
          var obj = JSON.parse(this.responseText).rt;

          logger('拦截到智慧树题目API响应', 'green');
          logger(`题目ID: ${obj.questionId}`, 'blue');
          logger(`题目类型: ${obj.questionName} (ID: ${obj.questionTypeId})`, 'blue');

          // 处理题目内容
          if (obj.content) {
            var questionText = obj.content.replace(/<[^>]*>/g, '').trim();
            logger(`题目内容: ${questionText.substring(0, 100)}...`, 'blue');

            // 调用题库API获取答案
            zhsGetAnswerFromAPI(questionText, obj.questionTypeId, obj.questionOptionList);
          }

        } catch (e) {
          logger('处理智慧树API响应时出错: ' + e.message, 'red');
        }
      }
    };
    return ajax;
  };

  // 启动答题队列处理
  setInterval(function () {
    if (setting.queue.length > 0) {
      const element = setting.queue.shift();
      if (element && element.parentElement) {
        element.parentElement.click();
        logger('点击队列中的选项', 'blue');
      }
    }
  }, 1000);

  // 启动答题循环
  setting.loop = setInterval(zhsFindAnswer, setting.time, true);

  logger('智慧树答题系统初始化完成', 'green');
}

// 智慧树收集考试数据
function zhsCollectData(examBase) {
  logger('开始收集智慧树考试数据', 'blue');

  // 存储考试基础信息
  setting.examBase = examBase;
  setting.curs = [];

  // 获取课程信息
  $('.infoList span').each(function () {
    setting.curs.push($(this).text().trim());
  });

  logger(`收集到课程信息: ${setting.curs.length} 项`, 'blue');
  logger('考试数据收集完成，开始答题流程', 'green');
}

// 检查是否为智慧树答题页面 - 修复视频页面误识别问题
function checkZhsAnswerPage() {
  // 首先排除视频页面
  const url = window.location.href;
  const isVideoPage = url.includes('hike.zhihuishu.com') ||
    url.includes('sourceLearning') ||
    url.includes('videoList');

  if (isVideoPage) {
    logger('检测到视频页面，不启动答题功能', 'blue');
    return false;
  }

  // 检查URL特征 - 只检查明确的答题页面
  const isZhsExamUrl = url.includes('zhihuishu.com') &&
    (url.includes('hiexam') || url.includes('homework') || url.includes('test') || url.includes('exam'));

  // 检查页面元素特征 - 智慧树答题页面的特有元素
  const hasZhsElements = $('.answerCard').length > 0 ||           // 答题卡
    $('.optionUl').length > 0 ||             // 选项列表
    $('.subject_stem').length > 0 ||         // 题目主体
    $('.examPaper_subject').length > 0 ||    // 考试题目
    $('.TiMu').length > 0 ||                 // 题目容器
    $('[class*="option"]').length > 0 ||     // 选项元素
    $('[class*="question"]').length > 0;     // 题目元素

  // 检查页面标题 - 更精确的标题检测
  const hasZhsTitle = (document.title.includes('智慧树') &&
    (document.title.includes('考试') || document.title.includes('作业'))) ||
    document.title.includes('答题');

  const isAnswerPage = isZhsExamUrl || (hasZhsElements && hasZhsTitle);

  if (isAnswerPage) {
    logger('检测到智慧树答题页面，页面验证通过', 'green');
  } else {
    logger('页面检测结果：URL=' + isZhsExamUrl + ', 元素=' + hasZhsElements + ', 标题=' + hasZhsTitle, 'blue');
  }

  return isAnswerPage;
}

// 全局停止所有自动化操作函数
function zhsStopAllAutoActions() {
  // 停止自动答题
  setting.work = 0;
  localStorage.setItem('GPTJsSetting.work', 'false');
  logger('🛑 停止自动答题', 'red');

  // 清除所有答题相关的定时器
  if (setting.loop) {
    clearInterval(setting.loop);
    setting.loop = null;
    logger('🛑 已清除答题定时器', 'blue');
  }

  // 清空答题队列
  setting.queue = [];
  logger('🛑 已清空答题队列', 'blue');

  // 清除可能存在的其他定时器
  if (window.zhsNavigationTimer) {
    clearTimeout(window.zhsNavigationTimer);
    window.zhsNavigationTimer = null;
    logger('🛑 已清除导航定时器', 'blue');
  }

  // 停止所有自动导航行为
  logger('🛑 已停止所有自动导航行为', 'blue');

  // 提示用户
  logger('✅ 所有自动化操作已停止，可手动操作', 'green');
}


function zhsProcessQuestions() {
  logger('🚀 启动智慧树专用题目处理逻辑', 'green');


  logger('自动答题功能已启用，开始处理题目', 'green');

  
  let questionElements = [];

  const optionContainers = $('.optionUl');
  if (optionContainers.length > 0) {
  
    const questionContainer = optionContainers.first().closest('div, section, article').first();
    if (questionContainer.length > 0) {
      questionElements = [questionContainer];
      logger(`找到 ${questionElements.length} 个智慧树题目容器（基于optionUl）`, 'green');
    }
  }
 
  else if ($('.TiMu').length > 0) {
    questionElements = $('.TiMu');
    logger(`找到 ${questionElements.length} 个.TiMu题目元素`, 'green');
  }

  else if ($('.examPaper_subject').length > 0) {
    questionElements = $('.examPaper_subject');
    logger(`找到 ${questionElements.length} 个.examPaper_subject题目元素`, 'green');
  }
  
  else if ($('[class*="question"]').length > 0) {
    questionElements = $('[class*="question"]');
    logger(`找到 ${questionElements.length} 个question相关题目元素`, 'green');
  }
  else {
    logger('❌ 未找到任何题目元素，页面可能还在加载中', 'red');
   
    setTimeout(() => zhsProcessQuestions(), 3000);
    return;
  }


  if (questionElements.length > 0) {
    logger(`✅ 开始处理 ${questionElements.length} 道题目`, 'green');
    zhsProcessSingleQuestion(0, questionElements);
  }
}


function zhsProcessSingleQuestion(index, questionElements) {
  if (localStorage.getItem('GPTJsSetting.work') === 'false') {
    logger('用户手动停止答题，跳过当前题目', 'red');
    return;
  }


  const currentOptionContainer = $('.optionUl').first();
  const currentQuestionContainer = currentOptionContainer.length > 0 ?
    currentOptionContainer.closest('div, section, article').first() : $();

  if (currentQuestionContainer.length === 0) {
    logger('❌ 未找到当前题目容器，可能已完成所有题目', 'red');
    return;
  }

  logger(`📝 开始处理当前题目`, 'blue');

  // 提取题目信息
  const questionData = zhsExtractQuestionData(currentQuestionContainer);

  if (!questionData.question || questionData.question.length < 10) {
    logger(`❌ 题目数据提取失败或内容过短，尝试重新提取`, 'red');

    // 尝试使用更简单的方法重新提取题目内容
    const fallbackQuestionText = getQuestionText(currentQuestionContainer);
    if (fallbackQuestionText && fallbackQuestionText.length > 10) {
      questionData.question = fallbackQuestionText;
      logger(`✅ 使用备用方法成功提取题目: ${fallbackQuestionText.substring(0, 50)}...`, 'green');
    } else {
      logger(`❌ 备用方法也无法提取题目，跳过`, 'red');
      // 尝试导航到下一题
      setTimeout(() => {
        if (zhsNavigateToNext()) {
          setTimeout(() => zhsProcessSingleQuestion(0, []), 3000);
        }
      }, 2000);
      return;
    }
  }

  // 移除已作答检查 - 根据用户要求，总是重新答题
  // 用户要求：不判断已作答的，就算作答了，要会重新答题，根据获取的答案进行填充选项
  // const radioGroupCheck = currentQuestionContainer.find('[role="radiogroup"]');
  // const checkedRadio = radioGroupCheck.find('[role="radio"][aria-checked="true"]');
  // if (checkedRadio.length > 0) {
  //   logger(`✅ 当前题目已作答，导航到下一题`, 'green');
  //   setTimeout(() => {
  //     if (zhsNavigateToNext()) {
  //       setTimeout(() => zhsProcessSingleQuestion(0, []), 3000);
  //     }
  //   }, 1000);
  //   return;
  // }

  logger(`📝 开始重新处理题目（忽略已作答状态）`, 'blue');

  // 使用四级优先级获取答案
  zhsGetAnswerWithPriority(questionData).then(answer => {
    // 检查是否手动停止答题
    if (localStorage.getItem('GPTJsSetting.work') === 'false') {
      logger('用户手动停止答题，跳过答案处理', 'red');
      return;
    }

    if (answer) {
      logger(`✅ 获取到答案: ${answer}`, 'green');
      // 选择答案
      const success = zhsSelectAnswer(currentQuestionContainer, answer);
      if (success) {
        logger(`✅ 题目处理成功，准备自动下一题`, 'green');

        // 等待一段时间让选择生效，然后自动导航到下一题
        setTimeout(() => {
          if (localStorage.getItem('GPTJsSetting.work') === 'true') {
            const navigated = zhsNavigateToNext();
            if (navigated) {
              logger(`🔄 已自动跳转到下一题`, 'blue');
              // 等待页面加载后继续处理下一题
              setTimeout(() => {
                if (localStorage.getItem('GPTJsSetting.work') === 'true') {
                  zhsProcessSingleQuestion(0, []);
                }
              }, 3000);
            } else {
              logger(`✅ 已完成所有题目或到达最后一题，停止自动答题`, 'green');
              // 停止自动答题，避免无限循环
              localStorage.setItem('GPTJsSetting.work', 'false');
            }
          }
        }, 1500);
      } else {
        logger(`⚠️ 答案选择失败，自动跳转到下一题`, 'orange');
        // 即使答案选择失败，也自动跳转到下一题
        setTimeout(() => {
          if (localStorage.getItem('GPTJsSetting.work') === 'true') {
            const navigated = zhsNavigateToNext();
            if (navigated) {
              logger(`🔄 已自动跳转到下一题`, 'blue');
              // 等待页面加载后继续处理下一题
              setTimeout(() => {
                if (localStorage.getItem('GPTJsSetting.work') === 'true') {
                  zhsProcessSingleQuestion(0, []);
                }
              }, 3000);
            } else {
              logger(`✅ 已完成所有题目或到达最后一题，停止自动答题`, 'green');
              localStorage.setItem('GPTJsSetting.work', 'false');
            }
          }
        }, 1500);
      }
    } else {
      logger(`⚠️ 未获取到答案，自动跳转到下一题`, 'orange');
      // 即使未获取到答案，也自动跳转到下一题
      setTimeout(() => {
        if (localStorage.getItem('GPTJsSetting.work') === 'true') {
          const navigated = zhsNavigateToNext();
          if (navigated) {
            logger(`🔄 已自动跳转到下一题`, 'blue');
            // 等待页面加载后继续处理下一题
            setTimeout(() => {
              if (localStorage.getItem('GPTJsSetting.work') === 'true') {
                zhsProcessSingleQuestion(0, []);
              }
            }, 3000);
          } else {
            logger(`✅ 已完成所有题目或到达最后一题，停止自动答题`, 'green');
            localStorage.setItem('GPTJsSetting.work', 'false');
          }
        }
      }, 1500);
    }
  }).catch(error => {
    logger(`❌ 题目处理出错: ${error}`, 'red');
    // 尝试导航到下一题
    setTimeout(() => {
      const navigated = zhsNavigateToNext();
      if (navigated) {
        setTimeout(() => zhsProcessSingleQuestion(0, []), 3000);
      } else {
        logger(`❌ 导航失败，停止自动答题避免无限循环`, 'red');
        localStorage.setItem('GPTJsSetting.work', 'false');
      }
    }, 2000);
  });
}


function cleanTextContent(textString) {
  if (!textString) return null;


  let cleaned = textString.replace(/<(?!img).*?>/g, "");

  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');

  return cleaned;
}

function formatQuestionText(questionText) {
  if (!questionText) return null;

  // 先进行基础清理
  let formatted = cleanTextContent(questionText);

  // 额外处理针对问题特有的格式
  formatted = formatted
    .replace(/^\d+[\.、]/, '') // 移除题号
    .replace(/^\s*[\(（【\[]?\s*(单选题|多选题|判断题|填空题|简答题|论述题|分析题)[\s\.\:：,，]*[\d\.]*分?[\)）\]\】]?\s*/i, '') // 移除题目类型信息
    .replace(/\(\s*\d+\.\d+\s*分\s*\)/g, '') // 移除分数信息
    .replace(/（\s*\d+\.\d+\s*分\s*）/g, '') // 移除分数信息
    .trim();

  return formatted;
}

// 重新设计的题目数据提取函数 - 基于实际DOM结构
function zhsExtractQuestionData(questionElement) {
  const questionData = {
    question: '',
    type: '',
    options: [],
    element: questionElement
  };

  try {
    // 调试：输出题目容器的基本信息
    // logger(`🔍 调试：题目容器HTML: ${questionElement.html().substring(0, 200)}...`, 'blue');

    // 1. 提取题目类型 - 使用role属性和文本匹配
    const allElements = questionElement.find('*');
    let questionType = '';

    // logger(`🔍 调试：找到 ${allElements.length} 个子元素`, 'blue');

    allElements.each(function (index) {
      const text = $(this).text().trim();

      // 查找 "1.【单选题】 (0.5分)" 格式
      const typeMatch = text.match(/\d+\.\s*【(.+?)】.*?\(\d+\.?\d*分\)/);
      if (typeMatch) {
        questionType = typeMatch[1];
        // logger(`🔍 调试：找到题目类型: "${questionType}" 在元素: ${$(this).prop('tagName')}`, 'green');
        return false; // 跳出each循环
      }
    });

    questionData.type = questionType;

    // 2. 提取纯净的题目内容 - 修复题目内容获取错误
    // 优先从class="questionContent"下的p标签里的span内容获取
    let questionText = '';

    // 方法1：查找class="questionContent"下的p标签里的span内容（用户要求的正确方式）
    const questionContentDiv = questionElement.find('.questionContent');
    if (questionContentDiv.length > 0) {
      const spans = questionContentDiv.find('p span');
      if (spans.length > 0) {
        // 提取所有span的文本内容并合并，避免重复
        let spanTexts = [];
        let seenTexts = new Set(); // 用于去重
        spans.each(function () {
          const spanText = $(this).text().trim();
          if (spanText && !spanText.match(/^[A-D]\./) && spanText.length > 0) {
            // 避免重复添加相同的文本
            if (!seenTexts.has(spanText)) {
              spanTexts.push(spanText);
              seenTexts.add(spanText);
            }
          }
        });
        questionText = spanTexts.join('').trim();
        logger(`🔍 从.questionContent p span获取题目内容: ${questionText.substring(0, 50)}...`, 'green');
      }
    }

    // 方法2：如果没找到，尝试查找p标签，但排除选项区域内的p标签
    if (!questionText) {
      const paragraphs = questionElement.find('p').not('.optionUl p, .el-radio p');
      paragraphs.each(function () {
        const text = $(this).text().trim();
        // 跳过题目类型行和短文本，选择最可能的题目内容
        if (!text.match(/^[一二三四五六七八九十]、.*?题/) &&
          !text.match(/^[A-D]\./) &&
          text.length > 10) {
          questionText = text;
          return false; // 找到题目内容后跳出
        }
      });
    }

    // 方法3：如果还没找到，尝试查找其他可能的题目容器
    if (!questionText) {
      const questionSelectors = [
        '.questionTit', // 添加对questionTit的支持（作为备选）
        '.question-text',
        '.subject_stem',
        '.question-content',
        '.stem',
        '.title'
      ];

      for (const selector of questionSelectors) {
        const element = questionElement.find(selector).first();
        if (element.length > 0) {
          questionText = element.text().trim();
          break;
        }
      }
    }

    // 方法4：如果仍然没找到，尝试从所有文本中提取题目
    if (!questionText || questionText.length < 10) {
      const allText = questionElement.text();
      // 查找题目编号后的内容，如"1.【单选题】 (1分) 题目内容"
      const questionMatch = allText.match(/\d+\.\s*【.+?】\s*\(.+?\)\s*(.+?)(?=\s*[A-D]\.|$)/);
      if (questionMatch && questionMatch[1]) {
        questionText = questionMatch[1].trim();
        logger(`🔍 从完整文本中提取题目: ${questionText.substring(0, 50)}...`, 'green');
      }
    }


    questionText = questionText
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim();

    questionData.question = questionText;

 
    const optionContainer = questionElement.find('.optionUl');
   

    if (optionContainer.length > 0) {
      const radioGroup = optionContainer.find('[role="radiogroup"]');
      // logger(`🔍 调试：找到 ${radioGroup.length} 个role="radiogroup"`, 'blue');

      if (radioGroup.length > 0) {
        const radioElements = radioGroup.find('[role="radio"]');
        // logger(`🔍 调试：找到 ${radioElements.length} 个role="radio"元素`, 'blue');

        radioElements.each(function (index) {
          // 查找.optionContent元素，这是智慧树选项内容的实际容器
          const optionContent = $(this).find('.optionContent');
          let optionText = '';

          if (optionContent.length > 0) {
            optionText = optionContent.text().trim();
            // logger(`🔍 调试：radio[${index}] optionContent: "${optionText}"`, 'blue');
          } else {
            // 备用方案：从el-radio__label中提取文本
            const radioLabel = $(this).find('.el-radio__label');
            if (radioLabel.length > 0) {
              optionText = radioLabel.text().trim();
              // 移除选项字母前缀（如"A. "）
              optionText = optionText.replace(/^[A-Z]\.\s*/, '').trim();
              // logger(`🔍 调试：radio[${index}] radioLabel: "${optionText}"`, 'blue');
            }
          }

          if (optionText && optionText.length > 0) {
            questionData.options.push(optionText);
            // logger(`🔍 调试：添加选项: "${optionText}"`, 'green');
          }
        });
      }
    }

 
    if (questionData.type === '判断题' && questionData.options.length === 0) {
      questionData.options = ['正确', '错误'];
    }

    // 5. 记录提取结果（简化日志输出）
    logger(`📋 题目内容: ${questionData.question}`, 'blue');
    logger(`🏷️ 题目类型: ${questionData.type}`, 'blue');
    logger(`📝 选项数量: ${questionData.options.length}`, 'blue');
    if (questionData.options.length > 0) {
      logger(`📋 选项内容: ${questionData.options.join(' | ')}`, 'blue');
    }

  } catch (error) {
    logger(`❌ 题目数据提取失败: ${error.message}`, 'red');
  }

  return questionData;
}

// 四级优先级答题机制 - 根据用户设置决定使用哪些方式
function zhsGetAnswerWithPriority(questionData) {
  return new Promise((resolve, reject) => {
    // 检查是否手动停止答题
    if (localStorage.getItem('GPTJsSetting.work') === 'false') {
      reject('用户手动停止答题');
      return;
    }

    // 获取用户设置
    const useTiku = localStorage.getItem('GPTJsSetting.useTiku') === 'true';
    const useBackupTiku = localStorage.getItem('GPTJsSetting.useBackupTiku') === 'true';
    const useAI = localStorage.getItem('GPTJsSetting.useAI') === 'true';
    // 随机答题功能已删除 - 根据用户要求完全删除随机选择功能

    // 获取用户配置的 key
    let userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';

    // 第一优先级：主题库API
    if (useTiku && userKey) {
      // 为题库API提供纯净的题目内容
      const tikuQuestionData = {
        question: questionData.question,
        type: questionData.type,
        options: questionData.options
      };

      getZhihuishuAnswer(tikuQuestionData).then(answer => {
        // 检查是否手动停止答题
        if (localStorage.getItem('GPTJsSetting.work') === 'false') {
          reject('用户手动停止答题');
          return;
        }

        if (answer && answer !== '暂无答案') {
          logger(`📚 题库API成功返回答案: ${answer}`, 'green');
          logger(`📚 答案来源: 主题库API (tk.mixuelo.cc)`, 'blue');
          resolve(answer);
          return;
        }
        logger(`📚 主题库API未返回有效答案，尝试备用题库...`, 'orange');
        // 主题库失败，尝试下一优先级
        tryBackupTiku();
      }).catch((error) => {
        logger(`📚 主题库API调用失败: ${error}`, 'red');
        tryBackupTiku();
      });
    } else {
      tryBackupTiku();
    }

    // 第二优先级：备用题库API
    function tryBackupTiku() {
      // 移除答题停止检查 - 默认总是答题
      // if (localStorage.getItem('GPTJsSetting.work') !== 'true') {
      //   reject('答题已停止');
      //   return;
      // }

      if (useBackupTiku && userKey) {
        // 备用题库使用与主题库相同的数据格式
        const backupQuestionData = {
          question: questionData.question,
          type: questionData.type,
          options: questionData.options
        };

        // 这里可以调用备用题库API
        // 暂时跳过，直接尝试AI
        tryAI();
      } else {
        tryAI();
      }
    }

    // 第三优先级：AI答题
    function tryAI() {
      // 移除答题停止检查 - 默认总是答题
      // if (localStorage.getItem('GPTJsSetting.work') !== 'true') {
      //   reject('答题已停止');
      //   return;
      // }

      if (useAI && userKey) {
        // 为AI构建完整的题目信息（题型+题目+选项）- 修复AI没有收到选项信息的问题
        let aiQuestionText = '';
        if (questionData.type) {
          aiQuestionText += questionData.type + ': ';
        }
        aiQuestionText += questionData.question;

        // 添加选项信息
        if (questionData.options && questionData.options.length > 0) {
          aiQuestionText += '\n选项：\n';
          questionData.options.forEach((option, index) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
            // 修复选项信息传递问题 - 确保提取实际的选项文本
            const optionText = option.content ? option.content.replace(/<[^>]*>/g, '').trim() :
              option.text ? option.text.trim() :
                (typeof option === 'string' ? option : String(option));
            aiQuestionText += `${optionLabel}. ${optionText}\n`;
          });
        }

        logger(`🤖 发送给AI的完整题目信息: ${aiQuestionText.substring(0, 200)}...`, 'blue');

        zhsGetAIAnswer(aiQuestionText, questionData.type)
          .then(answer => {
            // 移除答题停止检查 - 默认总是答题
            // if (localStorage.getItem('GPTJsSetting.work') !== 'true') {
            //   reject('答题已停止');
            //   return;
            // }

            if (answer && answer !== '暂无答案' && answer.trim() !== '') {
              logger(`🤖 AI成功返回答案: ${answer}`, 'green');
              logger(`🤖 答案来源: AI答题系统`, 'blue');
              resolve(answer);
              return;
            }
            logger(`🤖 AI未返回有效答案，跳过当前题目`, 'orange');
            // AI失败，不再使用随机答题，直接跳过
            reject('AI答题失败，无法获取答案');
          })
          .catch((error) => {
            logger(`🤖 AI答题调用失败: ${error}`, 'red');
            reject('AI答题失败: ' + error);
          });
      } else {
        reject('AI答题功能未开启');
      }
    }

    // 随机答题功能已删除 - 根据用户要求完全删除随机选择功能
  });
}

function zhsSelectAnswer(questionElement, answer) {
  try {
    logger(`🎯 开始选择答案: ${answer}`, 'green');

    // 查找radiogroup中的radio元素 - 使用role属性
    const radioGroup = questionElement.find('[role="radiogroup"]');
    if (radioGroup.length === 0) {
      logger(`❌ 未找到role="radiogroup"元素`, 'red');
      return false;
    }

    const radioElements = radioGroup.find('[role="radio"]');
    let bestMatch = { element: null, score: 0, reason: '' };

    radioElements.each(function () {
      const $radio = $(this);
      const optionText = $radio.attr('aria-label') || $radio.text().trim();

      if (!optionText) return;

      // 清理选项文本
      const cleanOption = optionText.replace(/^[A-Z]\.\s*/, '').trim();

    
      let matchScore = 0;
      let matchReason = '';

      // 1. 精确匹配
      if (cleanOption === answer) {
        matchScore = 100;
        matchReason = '精确匹配';
      }
      // 2. 包含匹配
      else if (cleanOption.includes(answer) || answer.includes(cleanOption)) {
        matchScore = 80;
        matchReason = '包含匹配';
      }
      // 3. 关键词匹配
      else {
        const answerWords = answer.split(/\s+/);
        const optionWords = cleanOption.split(/\s+/);
        let commonWords = 0;

        answerWords.forEach(word => {
          if (word.length > 1 && optionWords.some(optWord => optWord.includes(word) || word.includes(optWord))) {
            commonWords++;
          }
        });

        if (commonWords > 0) {
          matchScore = (commonWords / Math.max(answerWords.length, optionWords.length)) * 60;
          matchReason = `关键词匹配(${commonWords}个)`;
        }
      }

      if (matchScore > bestMatch.score) {
        bestMatch = { element: $radio, score: matchScore, reason: matchReason };
      }

      logger(`选项匹配: "${cleanOption}" -> 得分: ${matchScore.toFixed(1)}, 原因: ${matchReason}`, 'blue');
    });

    // 选择最佳匹配的选项
    if (bestMatch.element && bestMatch.score > 30) {
      logger(`✅ 选择最佳匹配选项，得分: ${bestMatch.score.toFixed(1)}, 原因: ${bestMatch.reason}`, 'green');

  
      bestMatch.element.click();

      // 额外尝试点击内部的radio元素
      setTimeout(() => {
        const innerRadio = bestMatch.element.find('radio').first();
        if (innerRadio.length > 0) {
          innerRadio.click();
        }
      }, 100);

      // 添加成功状态指示器 - 修复questionData未定义错误
      const questionNumber = getCurrentQuestionNumber();
      const actualQuestionText = getQuestionText(questionElement) || '题目内容获取失败';

      addQuestionStatusIndicator(questionNumber, 'success', {
        question: actualQuestionText,
        answer: answer,
        selected: bestMatch.optionText || '已选择',
        type: '单选题'
      });

      return true;
    } else {
      logger(`❌ 未找到匹配的选项，最高得分: ${bestMatch.score.toFixed(1)}`, 'red');

      // 添加失败状态指示器 - 修复questionData未定义错误
      const questionNumber = getCurrentQuestionNumber();
      const actualQuestionText = getQuestionText(questionElement) || '题目内容获取失败';

      addQuestionStatusIndicator(questionNumber, 'failed', {
        question: actualQuestionText,
        answer: answer,
        error: '未找到选项或，已经答题',
        type: '单选题'
      });

      return false;
    }

  } catch (error) {
    logger(`❌ 选择答案失败: ${error.message}`, 'red');
    return false;
  }
}


function zhsNavigateToNext() {
  try {
    // 首先检查答题状态 - 只有在答题开启时才自动导航
    const isAutoAnswerEnabled = localStorage.getItem('GPTJsSetting.work') === 'true';
    if (!isAutoAnswerEnabled) {
      logger(`🛑 自动答题已关闭，停止自动导航`, 'orange');
      return false;
    }

    // 查找"下一题"按钮 - 使用文本匹配和实际HTML元素
    let nextButton = $('*:contains("下一题")').filter(function () {
      return $(this).text().trim() === '下一题';
    });

    // 如果没找到，尝试其他选择器
    if (nextButton.length === 0) {
      nextButton = $('button:contains("下一题"), div:contains("下一题"), span:contains("下一题")').filter(function () {
        return $(this).text().trim() === '下一题';
      });
    }

    if (nextButton.length > 0 && nextButton.is(':visible')) {
      logger(`🔄 自动导航到下一题`, 'blue');
      nextButton.click();
      return true;
    } else {
      logger(`⚠️ 未找到"下一题"按钮或按钮不可见`, 'orange');
      return false;
    }
  } catch (error) {
    logger(`❌ 导航到下一题失败: ${error.message}`, 'red');
    return false;
  }
}


function zhsFindAnswer(tip) {
  if (setting.queue.length) {
    return;
  }

  // 移除自动答题功能检查 - 默认总是答题
  // if (!setting.work) {
  //   // 静默返回，不输出日志避免干扰
  //   return;
  // }

  // 智慧树使用API拦截方式，不需要DOM检测
  // 这个函数主要用于处理队列中的点击操作和状态检查

  // 检查是否在智慧树答题页面
  if (tip && !location.href.includes('zhihuishu.com')) {
    return;
  }

  // 智慧树的题目通过API拦截处理，这里只处理基本状态
  // 不再输出"答题已完成"，避免误导用户

  // 如果有待处理的点击队列，优先处理
  if (setting.queue.length > 0) {
    return;
  }

  // 检查是否有下一题按钮需要点击
  const nextBtn = document.querySelector('.Topicswitchingbtn');
  if (nextBtn && nextBtn.textContent.includes('下一题') && setting.queue.length === 0) {
    // 让自动跳转逻辑处理，这里不重复处理
    return;
  }
}



// 智慧树填充答案函数
function zhsFillAnswer($TiMu, obj, type) {
  const $div = $TiMu.find('.nodeLab');
  const str = String(obj.answer).toCDB() || new Date().toString();
  const answer = str.split(/#|\x01|\|/);
  const state = setting.lose;

  logger(`开始填充答案，题目类型: ${type}，答案: ${obj.answer}`, 'blue');

  obj.code > 0 && $div.each(function () {
    const $input = $('input', this)[0];
    if (!$input) return;

    const tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();

    if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
      answer.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($input);
    } else if (tip.match(/^(错误|否|错|×|F|wr)$/)) {
      answer.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($input);
    } else if (type == 2) { // 多选题
      Boolean($.inArray(tip, answer) + 1 || str.indexOf(tip) + 1) == $input.checked || setting.queue.push($input);
    } else { // 单选题
      $.inArray(tip, answer) + 1 && setting.queue.push($input);
    }
  });

  if (setting.queue.length) {
    logger(`已添加 ${setting.queue.length} 个选项到点击队列`, 'green');
    return true;
  } else if (/^(1|2|14)$/.test(type)) {
    const $input = $div.find('input');
    if (!$input.is(':checked')) {
      setting.lose++;
      logger('❌ 未找到匹配的选项', 'red');
      return false;
    }
  } else if (/^[3-5]$/.test(type)) { // 填空题/简答题
    const answers = String(obj.answer).split(/#|\x01|\|/);
    let filled = 0;

    $TiMu.find('textarea').each(function (index) {
      const answerText = (obj.code > 0 && answers[index]) || '';
      if (answerText) {
        this.value = answerText.trim();
        this.dispatchEvent(new Event('input'));
        this.dispatchEvent(new Event('blur'));
        filled++;
      }
    });

    if (obj.code > 0 && filled > 0) {
      logger(`已填充 ${filled} 个文本框`, 'green');
      return true;
    } else if (!setting.none) {
      setting.lose++;
      logger('填空题答案填充失败', 'red');
      return false;
    }
  } else {
    if (!setting.none) {
      setting.lose++;
      logger('未知题型，无法处理', 'red');
      return false;
    }
  }

  return true;
}

// 智慧树考试页面初始化（备用）- 已禁用，使用新的zhsProcessQuestions系统
function initZhihuishuExam() {
  logger('备用初始化系统已禁用，使用主要的zhsProcessQuestions系统', 'blue');
  // 直接调用主要的处理系统，避免冲突
  zhsProcessQuestions();
}

// 开始智慧树自动答题 - 已禁用，使用新的zhsProcessQuestions系统
function startZhihuishuAutoAnswer() {
  logger('旧的自动答题系统已禁用，使用主要的zhsProcessQuestions系统', 'blue');
  // 直接调用主要的处理系统，避免冲突
  zhsProcessQuestions();
}

// 查找智慧树题目
function findZhihuishuQuestions() {
  // 智慧树考试页面的题目通常在特定的容器中
  const questionContainers = [];

  // 方法1：查找包含题目和选项的完整容器
  const questionBlocks = document.querySelectorAll('.question-block, .exam-question, [class*="question-container"]');
  if (questionBlocks.length > 0) {
    logger(`找到 ${questionBlocks.length} 个题目块容器`, 'blue');
    return Array.from(questionBlocks);
  }

  // 方法2：通过选项列表反推题目容器
  const optionLists = document.querySelectorAll('.optionUl');
  if (optionLists.length > 0) {
    logger(`通过选项列表找到 ${optionLists.length} 道题目`, 'blue');

    optionLists.forEach((optionList) => {
      // 查找包含题目和选项的父容器
      let container = optionList.parentElement;

      // 向上查找，直到找到包含题目文本的容器
      while (container && container !== document.body) {
        const questionText = container.querySelector('p, .question-text, .stem');
        if (questionText && questionText.textContent.trim().length > 10) {
          questionContainers.push(container);
          break;
        }
        container = container.parentElement;
      }

      // 如果没找到合适的容器，使用选项列表的父元素
      if (!questionContainers.includes(container) && optionList.parentElement) {
        questionContainers.push(optionList.parentElement);
      }
    });

    return questionContainers;
  }

  // 方法3：查找所有可能的题目容器
  const selectors = [
    '.subject_stem',  // 题目主体
    '.question-item', // 题目项
    '[class*="question"]', // 包含question的类名
    '.exam-item',     // 考试项目
    '.test-item'      // 测试项目
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0 && elements.length < 50) { // 合理的题目数量
      logger(`使用选择器 "${selector}" 找到 ${elements.length} 个题目`, 'blue');
      return Array.from(elements).filter(el => el.textContent.trim().length > 5);
    }
  }

  // 方法4：如果都没找到，尝试分析页面结构
  logger('尝试分析页面结构查找题目', 'orange');
  const allElements = document.querySelectorAll('div, section, article');
  const potentialQuestions = [];

  allElements.forEach(el => {
    // 查找包含选项列表的元素
    const hasOptions = el.querySelector('.optionUl, .el-radio-group, input[type="radio"]');
    // 查找包含题目文本的元素
    const hasQuestionText = el.querySelector('p') && el.textContent.trim().length > 20;

    if (hasOptions && hasQuestionText && !potentialQuestions.includes(el)) {
      potentialQuestions.push(el);
    }
  });

  if (potentialQuestions.length > 0) {
    logger(`通过页面结构分析找到 ${potentialQuestions.length} 个潜在题目`, 'blue');
    return potentialQuestions;
  }

  logger('未找到任何题目容器', 'red');
  return [];
}

// 处理智慧树题目 - 已禁用，使用新的zhsProcessQuestions系统
function processZhihuishuQuestion(index, questionContainers) {
  logger('旧的题目处理系统已禁用，使用主要的zhsProcessQuestions系统', 'blue');
  // 直接调用主要的处理系统，避免冲突
  return;
}

// 点击智慧树下一题按钮
function clickNextQuestionButton() {
  try {
    // 首先检查答题状态 - 只有在答题开启时才点击下一题
    const isAutoAnswerEnabled = localStorage.getItem('GPTJsSetting.work') === 'true';
    if (!isAutoAnswerEnabled) {
      logger(`🛑 自动答题已关闭，停止点击下一题按钮`, 'orange');
      return false;
    }

    // 智慧树下一题按钮的多种可能选择器
    const nextButtonSelectors = [
      '.Topicswitchingbtn:contains(下一题)',  // 原始智慧树助手使用的选择器
      '.next-btn',                           // 通用下一题按钮
      '.btn-next',                          // 另一种下一题按钮
      '[class*="next"]',                    // 包含next的类名
      'button:contains(下一题)',             // 包含"下一题"文本的按钮
      'a:contains(下一题)',                  // 包含"下一题"文本的链接
      '.nextDiv a',                         // 下一题区域的链接
      '.jb_btn:contains(下一题)'             // 特定样式的下一题按钮
    ];

    let nextButton = null;

    // 尝试找到下一题按钮
    for (const selector of nextButtonSelectors) {
      if (selector.includes(':contains(')) {
        // 对于包含:contains的选择器，需要特殊处理
        const baseSelector = selector.split(':contains(')[0];
        const containsText = selector.match(/:contains\((.+?)\)/)[1];

        const elements = document.querySelectorAll(baseSelector);
        for (const element of elements) {
          if (element.textContent.includes(containsText)) {
            nextButton = element;
            break;
          }
        }
      } else {
        nextButton = document.querySelector(selector);
      }

      if (nextButton) {
        logger(`找到下一题按钮，使用选择器: ${selector}`, 'blue');
        break;
      }
    }

    if (nextButton) {
      // 检查按钮是否可点击
      if (nextButton.disabled || nextButton.style.display === 'none' ||
        nextButton.style.visibility === 'hidden') {
        logger('下一题按钮不可点击，跳过', 'orange');
        return false;
      }

      // 点击下一题按钮
      nextButton.click();
      logger('成功点击下一题按钮', 'green');
      return true;

    } else {
      logger('未找到下一题按钮，可能已是最后一题', 'orange');

      // 尝试查找提交按钮
      const submitSelectors = [
        '.submit-btn',
        '.btn-submit',
        '[class*="submit"]',
        'button:contains(提交)',
        'a:contains(提交)',
        '.submitDiv button',
        '.jb_btn:contains(提交)'
      ];

      for (const selector of submitSelectors) {
        let submitButton = null;

        if (selector.includes(':contains(')) {
          const baseSelector = selector.split(':contains(')[0];
          const containsText = selector.match(/:contains\((.+?)\)/)[1];

          const elements = document.querySelectorAll(baseSelector);
          for (const element of elements) {
            if (element.textContent.includes(containsText)) {
              submitButton = element;
              break;
            }
          }
        } else {
          submitButton = document.querySelector(selector);
        }

        if (submitButton) {
          logger(`找到提交按钮，准备提交: ${selector}`, 'blue');
          setTimeout(() => {
            submitButton.click();
            logger('已点击提交按钮', 'green');
          }, 2000);
          return true;
        }
      }

      return false;
    }

  } catch (error) {
    logger(`点击下一题按钮时出错: ${error}`, 'red');
    return false;
  }
}

// 解析智慧树题目
function parseZhihuishuQuestion(container) {
  try {
    // 查找题目文本
    let questionText = '';

    // 首先尝试查找题目文本，排除选项区域
    const questionSelectors = [
      'p:not(.optionUl p):not(.el-radio p)', // p标签但不在选项区域内
      '.question-text',
      '.subject_stem',
      '.question-content',
      '.stem',
      '.title'
    ];

    for (const selector of questionSelectors) {
      const questionElements = container.querySelectorAll(selector);
      for (const questionElement of questionElements) {
        const text = questionElement.textContent.trim();
        // 确保不是选项文本，且有足够长度
        if (text && text.length > 10 && !text.match(/^[A-D]\./) &&
          !questionElement.closest('.optionUl') &&
          !questionElement.closest('.el-radio')) {
          questionText = text;
          break;
        }
      }
      if (questionText) break;
    }

    // 如果还没找到题目文本，尝试从容器的直接文本内容获取
    if (!questionText) {
      const allText = container.textContent.trim();
      const lines = allText.split('\n').map(line => line.trim()).filter(line => line);

      // 查找最可能是题目的行
      for (const line of lines) {
        // 跳过明显的选项行、标题行、分数行等
        if (!line.match(/^[A-D]\./) &&
          !line.match(/^\d+\.\s*【/) &&
          !line.match(/总分|题目数|分数/) &&
          !line.match(/^[一二三四五六七八九十]+、/) &&
          line.length > 15 && line.length < 200) {
          questionText = line;
          break;
        }
      }
    }

    // 查找选项 - 改进的选项查找逻辑
    const options = [];

    // 方法1：查找标准的智慧树选项结构
    const optionContainers = container.querySelectorAll('.optionUl');

    if (optionContainers.length > 0) {
      logger(`找到 ${optionContainers.length} 个选项容器`, 'blue');

      optionContainers.forEach(optionContainer => {
        const optionElements = optionContainer.querySelectorAll('.el-radio, label[role="radio"]');

        optionElements.forEach((element, index) => {
          const optionContent = element.querySelector('.optionContent');
          const radioInput = element.querySelector('input[type="radio"]');
          let optionText = '';

          if (optionContent) {
            optionText = optionContent.textContent.trim();
          } else {
            // 尝试其他方式获取选项文本
            const spans = element.querySelectorAll('span');
            for (const span of spans) {
              const text = span.textContent.trim();
              if (text && !text.match(/^[A-D]\.?$/) && text.length > 1) {
                optionText = text;
                break;
              }
            }

            // 如果还是没找到，使用整个元素的文本
            if (!optionText) {
              optionText = element.textContent.trim();
            }
          }

          // 清理选项文本，移除选项标签
          optionText = optionText.replace(/^[A-D]\.?\s*/, '').trim();

          // 进一步清理，移除多余的空白和特殊字符
          optionText = optionText.replace(/\s+/g, ' ').trim();

          if (optionText && optionText.length > 0 && optionText.length < 500) {
            options.push({
              text: optionText,
              value: radioInput ? radioInput.value : `option_${index}`,
              element: element,
              input: radioInput
            });
            logger(`解析到选项 ${String.fromCharCode(65 + index)}: ${optionText.substring(0, 30)}...`, 'blue');
          }
        });
      });
    }

    // 方法2：如果没找到选项，尝试直接查找radio输入
    if (options.length === 0) {
      const radioInputs = container.querySelectorAll('input[type="radio"]');

      if (radioInputs.length > 0) {
        logger(`通过radio输入找到 ${radioInputs.length} 个选项`, 'blue');

        radioInputs.forEach((radioInput, index) => {
          const label = radioInput.closest('label') || radioInput.parentElement;
          let optionText = '';

          if (label) {
            optionText = label.textContent.trim();
            optionText = optionText.replace(/^[A-D]\.?\s*/, '').trim();

            if (optionText && optionText.length > 0 && optionText.length < 500) {
              options.push({
                text: optionText,
                value: radioInput.value || `option_${index}`,
                element: label,
                input: radioInput
              });
            }
          }
        });
      }
    }

    // 判断题目类型
    let questionType = 0; // 默认单选题
    if (questionText.includes('多选') || questionText.includes('多项选择')) {
      questionType = 1; // 多选题
    } else if (questionText.includes('判断') || questionText.includes('对错') ||
      options.some(opt =>
        opt.text.includes('正确') || opt.text.includes('错误') ||
        opt.text.includes('对') || opt.text.includes('错') ||
        opt.text.includes('是') || opt.text.includes('否')
      )) {
      questionType = 3; // 判断题
    } else if (questionText.includes('填空') || questionText.includes('空白')) {
      questionType = 2; // 填空题
    }

    const result = {
      question: questionText,
      type: questionType,
      options: options,
      container: container
    };

    logger(`题目解析完成 - 题目: "${questionText.substring(0, 50)}...", 选项数: ${options.length}, 类型: ${questionType}`, 'green');

    return result;

  } catch (error) {
    logger(`解析题目时出错: ${error}`, 'red');
    return null;
  }
}

// 获取智慧树答案
function getZhihuishuAnswer(questionData) {
  return new Promise((resolve, reject) => {

    var userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || setting.token || '';

    if (!userKey) {
      logger('未设置API Key，无法调用题库API', 'orange');
      resolve(null);
      return;
    }

    // 构建题目文本，包含选项 - 修复选项数据格式问题
    let questionWithOptions = questionData.question;
    var optionsText = '';
    if (questionData.options.length > 0) {
      optionsText = questionData.options.map(function (option, index) {
        var label = String.fromCharCode(65 + index); // A, B, C, D...
        // 处理选项可能是字符串或对象的情况
        var optionText = typeof option === 'string' ? option : (option.text || option);
        return label + '.' + optionText;
      }).join('\n');
    }

    // 题型映射
    var typeMapping = {
      0: '单选题',
      1: '单选题',
      2: '多选题',
      3: '填空题',
      4: '问答题',
      14: '判断题'
    };

    var mappedType = typeMapping[questionData.type] || '单选题';

    // 构建请求数据
    var requestData = "key=" + encodeURIComponent(userKey) +
      "&question=" + encodeURIComponent(questionData.question) +
      "&type=" + encodeURIComponent(mappedType);

    if (optionsText) {
      requestData += "&options=" + encodeURIComponent(optionsText);
    }

    logger('📚 发送题库API请求到 tk.mixuelo.cc...', 'blue');


    const API_BASE_URL = (() => {
      const baseUrl = "tk.mixuelo.cc/api.php";
      const protocol = window.location.protocol;
      if (protocol === 'https:') {
        return "https://" + baseUrl;
      } else {
        return "http://" + baseUrl;
      }
    })();

    GM_xmlhttpRequest({
      method: "POST",
      url: API_BASE_URL + "?act=query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "PHPSESSID=th9rcnfi47nl9fhjsjrcbmvq01"
        // 添加Cookie头部，API Key通过data参数传递
      },
      data: requestData,
      timeout: 30000, // 修复主题库查询问题 - 增加超时时间到30秒
      onload: function (response) {
        try {
          logger(`📚 题库API响应状态: ${response.status}`, 'blue');
          logger(`📚 题库API响应内容: ${response.responseText.substring(0, 200)}...`, 'blue');

          if (response.status === 200) {
            var result = JSON.parse(response.responseText);
            if (result.code === 1 && result.data && result.data.trim() !== '') {
              logger(`📚 题库API成功返回答案: ${result.data}`, 'green');
              resolve(result.data);
            } else {
              logger(`📚 题库API返回错误: ${result.msg || result.message || '未知错误'}`, 'orange');
              resolve(null);
            }
          } else {
            logger(`📚 题库API请求失败，状态码: ${response.status}`, 'red');
            resolve(null);
          }
        } catch (e) {
          logger(`📚 解析题库API响应失败: ${e.message}`, 'red');
          logger(`📚 原始响应内容: ${response.responseText}`, 'red');
          resolve(null);
        }
      },
      onerror: function (error) {
        logger(`📚 题库API请求网络错误: ${error}`, 'red');
        resolve(null);
      },
      ontimeout: function () {
        logger('📚 题库API请求超时（30秒）', 'red');
        resolve(null);
      }
    });
  });
}

// 选择智慧树选项
function selectZhihuishuOption(questionData, answer) {
  try {
    const answerText = answer.toLowerCase().trim();
    let selectedCount = 0;

    // 遍历选项寻找匹配
    questionData.options.forEach((option, index) => {
      // 修复选项文本获取问题 - 支持多种数据结构
      const optionText = (option.content || option.text || option || '').toString().replace(/<[^>]*>/g, '').toLowerCase().trim();
      let shouldSelect = false;

      // 判断题特殊处理
      if (questionData.type === 3) {
        if ((answerText.includes('正确') || answerText.includes('对') || answerText.includes('是') || answerText.includes('√') || answerText.includes('t')) &&
          (optionText.includes('正确') || optionText.includes('对') || optionText.includes('是') || optionText.includes('√'))) {
          shouldSelect = true;
        } else if ((answerText.includes('错误') || answerText.includes('错') || answerText.includes('否') || answerText.includes('×') || answerText.includes('f')) &&
          (optionText.includes('错误') || optionText.includes('错') || optionText.includes('否') || optionText.includes('×'))) {
          shouldSelect = true;
        }
      } else {
        // 其他题型：检查答案是否包含选项内容
        if (answerText.includes(optionText) || optionText.includes(answerText)) {
          shouldSelect = true;
        }

        // 检查选项标签匹配 (A, B, C, D)
        const optionLabel = String.fromCharCode(65 + index);
        if (answerText.includes(optionLabel.toLowerCase()) || answerText.includes(optionLabel)) {
          shouldSelect = true;
        }
      }

      if (shouldSelect) {
        // 检查选项是否已经被选中 - 修复重复选择导致的匹配失败问题
        const isAlreadySelected = option.input && option.input.checked;

        if (isAlreadySelected) {
          // 修复日志显示选项文本问题
          const displayText = (option.content || option.text || option || '').toString().replace(/<[^>]*>/g, '').trim();
          logger(`选项 ${String.fromCharCode(65 + index)} 已被选中: ${displayText}`, 'blue');
          selectedCount++;
        } else {
          clickZhihuishuOption(option);
          selectedCount++;
          // 修复日志显示选项文本问题
          const displayText = (option.content || option.text || option || '').toString().replace(/<[^>]*>/g, '').trim();
          logger(`选择了选项 ${String.fromCharCode(65 + index)}: ${displayText}`, 'green');
        }

        // 单选题只选择一个选项
        if (questionData.type === 0) {
          return;
        }
      }
    });

    if (selectedCount === 0) {
      // 检查是否所有选项都已经被选中
      const alreadySelectedCount = questionData.options.filter(option => option.input && option.input.checked).length;

      if (alreadySelectedCount > 0) {
        logger(`💡 题目已有 ${alreadySelectedCount} 个选项被选中，无需重复选择`, 'blue');
        // 添加成功状态指示器，因为题目实际上已经完成
        const questionNumber = getCurrentQuestionNumber();
        const actualQuestionText = getQuestionText(document.querySelector('.questionContent')) || '题目内容获取失败';
        const selectedOptions = questionData.options
          .filter(option => option.input && option.input.checked)
          .map((option) => {
            const displayText = (option.content || option.text || option || '').toString().replace(/<[^>]*>/g, '').trim();
            return `${String.fromCharCode(65 + questionData.options.indexOf(option))}. ${displayText}`;
          })
          .join(', ');

        addQuestionStatusIndicator(questionNumber, 'success', {
          question: actualQuestionText,
          answer: answer,
          selected: selectedOptions,
          type: questionData.type === 0 ? '单选题' : questionData.type === 1 ? '多选题' : '其他',
          error: '题目已完成，无需重复选择'
        });
      } else {
        logger('❌ 未找到匹配的选项', 'red');
        logger('💡 提示: 请检查答案格式或题库数据准确性', 'blue');

        // 添加失败状态指示器
        const questionNumber = getCurrentQuestionNumber();
        const actualQuestionText = getQuestionText(document.querySelector('.questionContent')) || '题目内容获取失败';

        addQuestionStatusIndicator(questionNumber, 'failed', {
          question: actualQuestionText,
          answer: answer,
          error: '未找到选项或，已经答题',
          type: questionData.type === 0 ? '单选题' : questionData.type === 1 ? '多选题' : '其他'
        });
      }
    }

  } catch (error) {
    logger(`❌ 选择选项时出错: ${error}`, 'red');
    logger('💡 提示: 请检查页面结构或刷新页面重试', 'blue');
  }
}

// 点击智慧树选项
function clickZhihuishuOption(option) {
  try {
    // 尝试多种点击方式
    if (option.input) {
      // 方式1：直接点击radio input
      option.input.click();
    } else if (option.element) {
      // 方式2：点击选项元素
      option.element.click();
    }

    // 方式3：触发change事件
    if (option.input) {
      option.input.checked = true;
      const event = new Event('change', { bubbles: true });
      option.input.dispatchEvent(event);
    }

    // 修复选项文本显示问题
    const displayText = (option.content || option.text || option || '').toString().replace(/<[^>]*>/g, '').trim();
    logger(`成功点击选项: ${displayText.substring(0, 20)}...`, 'green');

  } catch (error) {
    logger(`点击选项失败: ${error}`, 'red');
  }
}

// 随机选择功能已删除 - 根据用户要求完全删除随机选择功能

// 初始化视频专用UI - 简化版控制面板，只包含视频相关功能
function initZhihuishuVideoUI() {
  logger('🎬 开始初始化视频页面专用控制面板', 'blue');

  // 防止重复创建
  if (document.getElementById('zhs-video-control-panel')) {
    logger('🎬 视频控制面板已存在，跳过创建', 'orange');
    return;
  }

  try {
    const panel = document.createElement('div');
    panel.id = 'zhs-video-control-panel';

    // 创建标题栏
    const header = document.createElement('div');
    header.style.cssText = `
      background: #409EFF;
      color: white;
      padding: 12px 15px;
      border-radius: 8px 8px 0 0;
      font-weight: 500;
      display: flex;
      align-items: center;
      cursor: move;
    `;

    const logo = document.createElement('img');
    logo.src = 'https://mx.mixuelo.cc/index/pengzi/images/思考2.gif';
    logo.style.cssText = 'width: 20px; height: 20px; margin-right: 8px;';

    const title = document.createElement('span');
    title.textContent = '智慧树视频助手';

    header.appendChild(logo);
    header.appendChild(title);

    // 创建内容区域
    const content = document.createElement('div');
    content.style.cssText = 'padding: 15px;';

    // 视频控制区域
    const videoControl = document.createElement('div');
    videoControl.style.cssText = 'margin-bottom: 15px;';
    videoControl.innerHTML = `
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">🎬 视频控制</label>
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
          <input type="checkbox" id="zhs-auto-video" style="margin-right: 5px;">
          自动播放视频
        </label>
      </div>
      <div style="display: flex; gap: 8px;">
        <label style="display: flex; align-items: center; font-size: 12px; cursor: pointer;">
          <input type="checkbox" id="zhs-auto-next" style="margin-right: 5px;">
          自动下一个视频
        </label>
      </div>
    `;

    // 播放速度区域
    const speedControl = document.createElement('div');
    speedControl.style.cssText = 'margin-bottom: 15px;';
    speedControl.innerHTML = `
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">⚡ 播放速度</label>
      <select id="zhs-video-speed" style="
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
      ">
        <option value="0.5">0.5x</option>
        <option value="1" selected>1.0x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2.0x</option>
      </select>
    `;

    // 状态显示区域
    const statusArea = document.createElement('div');
    statusArea.style.cssText = `
      background: #f8f9fa;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    `;
    statusArea.innerHTML = '<div id="zhs-video-status">等待视频加载...</div>';

    // 组装面板
    content.appendChild(videoControl);
    content.appendChild(speedControl);
    content.appendChild(statusArea);

    panel.appendChild(header);
    panel.appendChild(content);

    // 设置面板样式
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 280px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
    `;

    document.body.appendChild(panel);
    logger('🎬 视频控制面板已创建并添加到页面', 'green');

    // 初始化事件监听
    setTimeout(() => {
      initVideoControlEvents();
      logger('🎬 视频控制事件已初始化', 'green');
    }, 100);

    // 使面板可拖拽
    setTimeout(() => {
      makeVideoPanelDraggable(panel);
      logger('🎬 视频面板拖拽功能已启用', 'green');
    }, 200);

  } catch (error) {
    logger(`🎬 视频控制面板创建失败: ${error.message}`, 'red');
  }
}

// 初始化视频控制事件
function initVideoControlEvents() {
  logger('🎬 开始初始化视频控制事件', 'blue');

  try {
    // 自动播放视频开关
    const autoVideoToggle = document.getElementById('zhs-auto-video');
    if (autoVideoToggle) {
      autoVideoToggle.checked = localStorage.getItem('ZhsJsSetting.video') === 'true';
      autoVideoToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('ZhsJsSetting.video', isChecked.toString());
        setting.video = isChecked;
        logger(`🎬 自动播放视频已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
        updateVideoStatus(`自动播放: ${isChecked ? '开启' : '关闭'}`);
      });
      logger('🎬 自动播放视频开关已初始化', 'green');
    } else {
      logger('🎬 未找到自动播放视频开关元素', 'orange');
    }

    // 自动下一个视频开关
    const autoNextToggle = document.getElementById('zhs-auto-next');
    if (autoNextToggle) {
      // 默认开启自动下一个视频功能
      autoNextToggle.checked = localStorage.getItem('ZhsJsSetting.jump') !== 'false';
      localStorage.setItem('ZhsJsSetting.jump', autoNextToggle.checked.toString());
      setting.jump = autoNextToggle.checked;

      autoNextToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('ZhsJsSetting.jump', isChecked.toString());
        setting.jump = isChecked;
        logger(`🎬 自动下一个视频已${isChecked ? '开启' : '关闭'}`, isChecked ? 'green' : 'orange');
        updateVideoStatus(`自动下一个: ${isChecked ? '开启' : '关闭'}`);
      });
      logger('🎬 自动下一个视频开关已初始化', 'green');
    } else {
      logger('🎬 未找到自动下一个视频开关元素', 'orange');
    }

    // 播放速度选择
    const speedSelect = document.getElementById('zhs-video-speed');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        const speed = parseFloat(e.target.value);
        setVideoSpeed(speed);
        logger(`🎬 视频播放速度设置为: ${speed}x`, 'blue');
        updateVideoStatus(`播放速度: ${speed}x`);
      });
      logger('🎬 播放速度选择已初始化', 'green');
    } else {
      logger('🎬 未找到播放速度选择元素', 'orange');
    }

    // 初始化状态显示
    updateVideoStatus('视频控制面板已就绪');

  } catch (error) {
    logger(`🎬 视频控制事件初始化失败: ${error.message}`, 'red');
  }
}

// 使视频面板可拖拽
function makeVideoPanelDraggable(panel) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  const header = panel.querySelector('div:first-child');
  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header || header.contains(e.target)) {
      isDragging = true;
      panel.style.cursor = 'grabbing';
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    panel.style.cursor = 'move';
  }
}

// 更新视频状态显示
function updateVideoStatus(status) {
  const statusDiv = document.getElementById('zhs-video-status');
  if (statusDiv) {
    statusDiv.textContent = status;
  }
}

// 设置视频播放速度
function setVideoSpeed(speed) {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.playbackRate = speed;
  });
}

// 初始化视频自动下一个功能
function initVideoAutoNext() {
  logger('🎬 初始化视频自动下一个功能', 'blue');

  // 监听视频播放结束事件
  const checkVideoEnd = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!video.hasAttribute('data-auto-next-listener')) {
        video.setAttribute('data-auto-next-listener', 'true');
        video.addEventListener('ended', () => {
          if (setting.jump) {
            logger('🎬 视频播放结束，准备自动下一个', 'green');
            updateVideoStatus('视频播放结束，准备跳转...');
            setTimeout(goToNextVideo, 2000);
          }
        });
        logger(`🎬 已为视频添加播放结束监听器`, 'green');
      }
    });
  };

  // 定期检查新的视频元素
  setInterval(checkVideoEnd, 3000);
  checkVideoEnd();

  // 额外的检测机制：监听任务点状态变化
  const checkTaskStatus = () => {
    // 检查当前任务是否已完成（出现icon-finish）
    const currentActiveItem = document.querySelector('.file-item.active');
    if (currentActiveItem) {
      const hasFinishIcon = currentActiveItem.querySelector('.icon-finish');
      if (hasFinishIcon && setting.jump) {
        logger('🎬 检测到当前任务已完成，准备自动下一个', 'green');
        updateVideoStatus('任务已完成，准备跳转...');
        setTimeout(goToNextVideo, 3000);
      }
    }
  };

  // 定期检查任务状态
  setInterval(checkTaskStatus, 5000);

  logger('🎬 视频自动下一个功能已启动', 'green');
}

// 跳转到下一个视频 - 根据icon-finish元素判断
function goToNextVideo() {
  try {
    logger('开始查找下一个未完成的视频任务', 'blue');

    // 查找所有视频任务项（包含icon-video的元素）
    const videoItems = document.querySelectorAll('.file-item');
    let nextVideoItem = null;

    // 遍历所有任务项，找到第一个没有icon-finish的视频任务
    for (const item of videoItems) {
      const hasVideoIcon = item.querySelector('.icon-video');
      const hasFinishIcon = item.querySelector('.icon-finish');

      // 如果是视频任务且没有完成标记
      if (hasVideoIcon && !hasFinishIcon) {
        nextVideoItem = item;
        break;
      }
    }

    if (nextVideoItem) {
      const fileName = nextVideoItem.querySelector('.file-name')?.textContent || '未知';
      const fileId = nextVideoItem.id.replace('file_', '');

      logger(`找到下一个未完成的视频: ${fileName} (ID: ${fileId})`, 'green');

      // 点击跳转到下一个视频
      nextVideoItem.click();
      updateVideoStatus(`正在跳转到: ${fileName}`);

      // 记录跳转信息
      setTimeout(() => {
        logger(`已跳转到视频: ${fileName}`, 'green');
        updateVideoStatus(`当前视频: ${fileName}`);
      }, 2000);

    } else {
      // 没有找到未完成的视频，查找未完成的文档任务
      for (const item of videoItems) {
        const hasDocIcon = item.querySelector('.icon-doc');
        const hasFinishIcon = item.querySelector('.icon-finish');

        if (hasDocIcon && !hasFinishIcon) {
          nextVideoItem = item;
          break;
        }
      }

      if (nextVideoItem) {
        const fileName = nextVideoItem.querySelector('.file-name')?.textContent || '未知';
        logger(`所有视频已完成，跳转到下一个文档任务: ${fileName}`, 'blue');
        nextVideoItem.click();
        updateVideoStatus(`跳转到文档: ${fileName}`);
      } else {
        logger('所有任务已完成！', 'green');
        updateVideoStatus('所有任务已完成');
      }
    }

  } catch (error) {
    logger(`自动下一个视频失败: ${error.message}`, 'red');
    updateVideoStatus('自动下一个失败');
  }
}

// 智慧树视频控制初始化
function initZhihuishuVideoControl() {
  logger('🎬 初始化智慧树视频控制系统', 'blue');

  // 延迟执行，等待页面加载完成
  setTimeout(() => {
    startZhihuishuVideoControl();
  }, 2000);

  // 定期检查新的视频元素
  setInterval(() => {
    startZhihuishuVideoControl();
  }, 10000);

  logger('🎬 视频控制系统监听器已启动', 'green');
}

// 开始智慧树视频控制
function startZhihuishuVideoControl() {
  try {
    // 查找视频元素
    const videoElements = findZhihuishuVideoElements();

    if (videoElements.length > 0) {
      logger(`发现 ${videoElements.length} 个视频元素，开始处理`, 'green');

      videoElements.forEach((video, index) => {
        processZhihuishuVideo(video, index);
      });
    }

    // 查找iframe中的视频
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, index) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const iframeVideos = iframeDoc.querySelectorAll('video');
          if (iframeVideos.length > 0) {
            logger(`在iframe ${index + 1} 中发现 ${iframeVideos.length} 个视频`, 'blue');
            iframeVideos.forEach((video, videoIndex) => {
              processZhihuishuVideo(video, `iframe-${index}-${videoIndex}`);
            });
          }
        }
      } catch (e) {
        // 跨域iframe无法访问，忽略错误
      }
    });

  } catch (error) {
    logger(`视频控制出错: ${error}`, 'red');
  }
}

// 查找智慧树视频元素
function findZhihuishuVideoElements() {
  const selectors = [
    'video',                    // 直接的video标签
    '.video-player video',      // 视频播放器中的video
    '.player-container video',  // 播放器容器中的video
    '[class*="video"] video',   // 包含video类名的容器中的video
    '.vjs-tech',               // Video.js技术层
  ];

  let videos = [];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      videos = Array.from(elements);
      logger(`使用选择器 "${selector}" 找到 ${elements.length} 个视频`, 'blue');
      break;
    }
  }

  return videos;
}

// 处理智慧树视频
function processZhihuishuVideo(video, index) {
  try {
    if (!video || video.zhsProcessed) {
      return; // 避免重复处理
    }

    logger(`处理第 ${index + 1} 个视频元素`, 'blue');

    // 标记已处理
    video.zhsProcessed = true;

    // 设置视频属性
    setupZhihuishuVideoProperties(video);

    // 自动播放
    if (setting.video) {
      autoPlayZhihuishuVideo(video, index);
    }

    // 监听视频事件
    setupZhihuishuVideoEvents(video, index);

  } catch (error) {
    logger(`处理视频 ${index + 1} 时出错: ${error}`, 'red');
  }
}

// 设置智慧树视频属性
function setupZhihuishuVideoProperties(video) {
  try {
    // 设置音量
    const volume = parseFloat(setting.vol) / 100;
    video.volume = volume;

    // 设置静音
    video.muted = setting.vol == '0';

    // 设置倍速
    const speed = parseFloat(setting.speed);
    if (speed > 0 && speed <= 16) {
      video.playbackRate = speed;
      logger(`视频倍速设置为: ${speed}x`, 'blue');
    }

    // 其他属性设置
    video.controls = true;  // 显示控制条
    video.preload = 'auto'; // 预加载

    logger(`视频属性设置完成 - 音量: ${volume}, 倍速: ${speed}x, 静音: ${video.muted}`, 'blue');

  } catch (error) {
    logger(`设置视频属性时出错: ${error}`, 'red');
  }
}

// 自动播放智慧树视频
function autoPlayZhihuishuVideo(video, index) {
  try {
    // 尝试播放视频
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        logger(`视频 ${index + 1} 开始播放，倍速: ${setting.speed}x`, 'green');
      }).catch(error => {
        logger(`视频 ${index + 1} 自动播放失败: ${error.message}`, 'orange');

        // 尝试用户交互后播放
        setTimeout(() => {
          video.play().then(() => {
            logger(`视频 ${index + 1} 延迟播放成功`, 'green');
          }).catch(e => {
            logger(`视频 ${index + 1} 延迟播放也失败: ${e.message}`, 'red');
          });
        }, 1000);
      });
    } else {
      logger(`视频 ${index + 1} 播放方法不支持Promise`, 'orange');
    }

  } catch (error) {
    logger(`播放视频 ${index + 1} 时出错: ${error}`, 'red');
  }
}

// 设置智慧树视频事件监听
function setupZhihuishuVideoEvents(video, index) {
  try {
    // 播放事件
    video.addEventListener('play', () => {
      logger(`视频 ${index + 1} 开始播放`, 'green');
    });

    // 暂停事件
    video.addEventListener('pause', () => {
      logger(`视频 ${index + 1} 暂停播放`, 'orange');

      // 如果设置了自动播放，尝试继续播放
      if (setting.video && !video.ended) {
        setTimeout(() => {
          video.play().catch(e => {
            logger(`重新播放视频 ${index + 1} 失败: ${e.message}`, 'red');
          });
        }, 2000);
      }
    });

    // 结束事件
    video.addEventListener('ended', () => {
      logger(`视频 ${index + 1} 播放完成`, 'green');
    });

    // 错误事件
    video.addEventListener('error', (e) => {
      logger(`视频 ${index + 1} 播放错误: ${e.message || '未知错误'}`, 'red');
    });

    // 时间更新事件（用于显示进度）
    video.addEventListener('timeupdate', () => {
      if (video.duration > 0) {
        const progress = (video.currentTime / video.duration * 100).toFixed(1);
        // 每10%显示一次进度，避免日志过多
        if (progress % 10 < 0.1) {
          logger(`视频 ${index + 1} 播放进度: ${progress}%`, 'blue');
        }
      }
    });

    // 加载完成事件
    video.addEventListener('loadeddata', () => {
      logger(`视频 ${index + 1} 数据加载完成，时长: ${video.duration.toFixed(1)}秒`, 'blue');
    });

  } catch (error) {
    logger(`设置视频事件监听时出错: ${error}`, 'red');
  }
}

function hookHiexam() {
  var ajax = new xhr();
  ajax.onload = function () {
    if (this.status != 200 || !this.responseURL.match('getDoQuestSingle')) return;
    var obj = JSON.parse(this.responseText).rt;
    $.each(obj.questionOptionList || [], function (index) {
      var $input = $('.TitleOptions-div input')[index];
      if (obj.questionTypeId == 1) {
        this.isCorrect && setting.queue.push($input);
      } else if (obj.questionTypeId == 2) {
        this.isCorrect == $input.checked || setting.queue.push($input);
      }
    });
  };
  return ajax;
}

function filterStyle(dom, that) {
  var $dom = $(dom, that).clone().find('style').remove().end();
  return $dom.find('img[src]').replaceWith(function () {
    return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
  }).end().text().trim();
}

// 添加字符串转换方法
String.prototype.toCDB = function () {
  return this.replace(/[\uff01-\uff5e]/g, function (a) {
    return String.fromCharCode(a.charCodeAt(0) - 65248);
  });
};

// 添加智慧树API Key配置界面样式
function addZhsConfigStyles() {
  if (document.getElementById('zhs-config-styles')) return;

  const style = document.createElement('style');
  style.id = 'zhs-config-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .zhs-config-panel::-webkit-scrollbar {
      width: 6px;
    }
    .zhs-config-panel::-webkit-scrollbar-thumb {
      background: #409EFF;
      border-radius: 3px;
    }
    .zhs-config-panel::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    #zhs-control-panel::-webkit-scrollbar {
      width: 6px;
    }
    #zhs-control-panel::-webkit-scrollbar-thumb {
      background: #409EFF;
      border-radius: 3px;
    }
    #zhs-control-panel::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    #zhs-log-window::-webkit-scrollbar {
      width: 6px;
    }
    #zhs-log-window::-webkit-scrollbar-thumb {
      background: #409EFF;
      border-radius: 3px;
    }
    #zhs-log-window::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
    .zhs-config-panel {
      position: fixed !important;
      top: 80px !important;
      right: 10px !important;
      width: 320px !important;
      max-height: 500px !important;
      overflow-y: auto !important;
      background: rgba(255, 255, 255, 0.98) !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
      z-index: 2147483647 !important;
      padding: 20px !important;
      font-family: "Microsoft YaHei", sans-serif !important;
      transition: all 0.3s ease !important;
      border: 2px solid #409EFF !important;
      backdrop-filter: blur(10px) !important;
    }

    .zhs-config-header {
      text-align: center !important;
      margin-bottom: 20px !important;
      color: #409EFF !important;
      font-size: 18px !important;
      font-weight: bold !important;
      border-bottom: 2px solid #409EFF !important;
      padding-bottom: 10px !important;
    }

    .zhs-config-section {
      margin-bottom: 20px !important;
      padding: 15px !important;
      background: rgba(64, 158, 255, 0.05) !important;
      border-radius: 8px !important;
      border: 1px solid rgba(64, 158, 255, 0.2) !important;
    }

    .zhs-config-label {
      display: block !important;
      margin-bottom: 8px !important;
      color: #333 !important;
      font-weight: bold !important;
      font-size: 14px !important;
    }

    .zhs-config-input {
      width: 100% !important;
      padding: 10px !important;
      border: 2px solid #ddd !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      transition: border-color 0.3s ease !important;
      box-sizing: border-box !important;
    }

    .zhs-config-input:focus {
      outline: none !important;
      border-color: #FC3D74 !important;
      box-shadow: 0 0 0 3px rgba(252, 61, 116, 0.1) !important;
    }

    .zhs-config-button {
      width: 100% !important;
      padding: 12px !important;
      background: linear-gradient(135deg, #409EFF, #337ecc) !important;
      color: white !important;
      border: none !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      margin-top: 10px !important;
    }

    .zhs-config-button:hover {
      background: linear-gradient(135deg, #337ecc, #2b6cb0) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3) !important;
    }

    .zhs-config-message {
      margin-top: 10px !important;
      padding: 10px !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      font-weight: bold !important;
      text-align: center !important;
      transition: all 0.3s ease !important;
      display: none !important;
    }

    .zhs-config-message.success {
      background: #4CAF50 !important;
      color: white !important;
    }

    .zhs-config-message.error {
      background: #f44336 !important;
      color: white !important;
    }

    .zhs-config-status {
      text-align: center !important;
      padding: 10px !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      font-weight: bold !important;
      margin-bottom: 15px !important;
    }

    .zhs-config-status.configured {
      background: rgba(76, 175, 80, 0.1) !important;
      color: #4CAF50 !important;
      border: 1px solid rgba(76, 175, 80, 0.3) !important;
    }

    .zhs-config-status.not-configured {
      background: rgba(244, 67, 54, 0.1) !important;
      color: #f44336 !important;
      border: 1px solid rgba(244, 67, 54, 0.3) !important;
    }

    .zhs-config-close {
      position: absolute !important;
      top: 10px !important;
      right: 15px !important;
      background: none !important;
      border: none !important;
      font-size: 20px !important;
      color: #FC3D74 !important;
      cursor: pointer !important;
      width: 30px !important;
      height: 30px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s ease !important;
    }

    .zhs-config-close:hover {
      background: rgba(252, 61, 116, 0.1) !important;
      transform: rotate(90deg) !important;
    }

    .zhs-floating-button {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 60px !important;
      height: 60px !important;
      background: linear-gradient(135deg, #409EFF, #337ecc) !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: white !important;
      font-size: 24px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4) !important;
      transition: all 0.3s ease !important;
      z-index: 2147483646 !important;
      border: none !important;
    }

    .zhs-floating-button:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 25px rgba(64, 158, 255, 0.6) !important;
    }

    .zhs-status-indicator {
      position: absolute !important;
      top: -5px !important;
      right: -5px !important;
      width: 20px !important;
      height: 20px !important;
      border-radius: 50% !important;
      border: 2px solid white !important;
      font-size: 10px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .zhs-status-indicator.configured {
      background: #4CAF50 !important;
    }

    .zhs-status-indicator.not-configured {
      background: #f44336 !important;
      animation: pulse 2s infinite !important;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `;

  document.head.appendChild(style);
}

// 创建智慧树API Key配置界面
function createZhsConfigPanel() {
  // 防止重复创建
  if (document.getElementById('zhs-config-panel')) return;

  // 添加样式
  addZhsConfigStyles();

  // 获取当前配置状态
  const currentKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';
  const isConfigured = !!currentKey;

  // 创建配置面板
  const panel = document.createElement('div');
  panel.id = 'zhs-config-panel';
  panel.className = 'zhs-config-panel';

  panel.innerHTML = `
    <button class="zhs-config-close" id="zhs-close-btn">×</button>

    <div class="zhs-config-header">
      🌟 智慧树助手配置
    </div>

    <div class="zhs-config-status ${isConfigured ? 'configured' : 'not-configured'}">
      ${isConfigured ? '✅ API Key 已配置' : '⚠️ 请配置 API Key'}
    </div>

    <div class="zhs-config-section">
      <label class="zhs-config-label" for="zhs-api-key">
        🔑 题库 API Key:
      </label>
      <input
        type="text"
        id="zhs-api-key"
        class="zhs-config-input"
        placeholder="请输入您的题库 API Key"
        value="${currentKey}"
      >
      <button class="zhs-config-button" id="zhs-save-btn">
        💾 保存并验证
      </button>
      <div id="zhs-config-message" class="zhs-config-message"></div>
    </div>

    <div class="zhs-config-section">
      <label class="zhs-config-label">
        🔑 题库API配置:
      </label>
      <div style="margin-bottom: 10px;">
        <input type="text" id="zhs-api-key" placeholder="请输入题库API Key"
               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
               value="${localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || ''}">
      </div>
      <div style="font-size: 12px; color: #999; background: rgba(252, 61, 116, 0.05); padding: 8px; border-radius: 4px; margin-bottom: 15px;">
        <strong>💡 提示：</strong>请输入有效的题库API Key以使用题库功能
      </div>
    </div>

    <div class="zhs-config-section">
      <label class="zhs-config-label">
        🚀 答题功能控制:
      </label>
      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; margin-bottom: 8px;">
          <input type="checkbox" id="zhs-work" style="margin-right: 8px;" ${localStorage.getItem('GPTJsSetting.work') !== 'false' ? 'checked' : ''}>
          <span style="font-size: 14px; font-weight: bold; color: #FC3D74;">自动答题功能</span>
        </label>
      </div>
      <div style="font-size: 12px; color: #999; background: rgba(252, 61, 116, 0.05); padding: 8px; border-radius: 4px; margin-bottom: 15px;">
        <strong>⚠️ 重要：</strong>关闭此选项将停止所有自动答题功能
      </div>
    </div>

    <div class="zhs-config-section">
      <label class="zhs-config-label">
        🎯 答题优先级配置:
      </label>
      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; margin-bottom: 5px;">
          <input type="checkbox" id="zhs-use-tiku" style="margin-right: 8px;" ${localStorage.getItem('GPTJsSetting.useTiku') === 'true' ? 'checked' : ''}>
          <span style="font-size: 13px;">启用题库API（主要答题方式）</span>
        </label>
        <label style="display: flex; align-items: center; margin-bottom: 5px;">
          <input type="checkbox" id="zhs-use-ai" style="margin-right: 8px;" ${localStorage.getItem('GPTJsSetting.useAI') === 'true' ? 'checked' : ''}>
          <span style="font-size: 13px;">启用AI答题（题库API失败时使用）</span>
        </label>

      </div>
      <div style="font-size: 12px; color: #999; background: rgba(252, 61, 116, 0.05); padding: 8px; border-radius: 4px;">
        <strong>优先级顺序：</strong>主题库 → 备用题库 → AI答题
      </div>
    </div>

    <div class="zhs-config-section">
      <div style="font-size: 13px; color: #666; line-height: 1.5;">
        <strong>📋 使用说明:</strong><br>
        • 配置API Key后可自动获取正确答案<br>
        • 支持多层备用方案确保答题连续性<br>
        • 按F9或点击浮动按钮可快速打开配置<br>
        • 所有配置将安全存储在本地浏览器中
      </div>
    </div>

    <div class="zhs-config-section">
      <div style="font-size: 12px; color: #999; text-align: center;">
        智慧树自动答题助手 v2.0<br>
        支持自动答题、视频播放等功能
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  setupZhsConfigPanelEvents(panel);

  // 添加拖拽功能
  makeZhsPanelDraggable(panel);
}

// 保存API Key
function saveZhsApiKey() {
  const keyInput = document.getElementById('zhs-api-key');
  const messageDiv = document.getElementById('zhs-config-message');
  const key = keyInput.value.trim();

  if (!key) {
    showZhsMessage('请输入API Key！', 'error');
    return;
  }

  // 显示验证中状态
  showZhsMessage('正在验证API Key...', 'info');

  // 发送验证请求
  GM_xmlhttpRequest({
    method: "POST",
    url: API_BASE_URL + "?act=verify_key",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: "key=" + encodeURIComponent(key),
    timeout: 10000,
    onload: function (response) {
      try {
        if (response.status === 200) {
          const result = JSON.parse(response.responseText);
          if (result.code === 1) {
            // 验证成功，保存key
            localStorage.setItem('GPTJsSetting.key', key);
            localStorage.setItem('tiku_key', key);

            showZhsMessage('✅ API Key 验证成功并已保存！', 'success');
            logger('API Key 配置成功', 'green');

            // 更新状态显示
            updateZhsConfigStatus(true);
            updateZhsFloatingButton();

          } else {
            showZhsMessage('❌ Key不存在，请前往蜜雪激活', 'error');
          }
        } else {
          showZhsMessage('❌ 验证请求失败，状态码: ' + response.status, 'error');
        }
      } catch (e) {
        showZhsMessage('❌ 验证响应解析失败: ' + e.message, 'error');
      }
    },
    onerror: function () {
      showZhsMessage('❌ 网络请求失败，请检查网络连接', 'error');
    },
    ontimeout: function () {
      showZhsMessage('❌ 请求超时，请稍后重试', 'error');
    }
  });
}

// 立即声明全局函数（在HTML创建之前）
window.saveZhsApiKey = saveZhsApiKey;

function setupZhsConfigPanelEvents(panel) {
  try {
    // 保存按钮事件
    const saveBtn = panel.querySelector('#zhs-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        saveZhsApiKey();
      });
    }

    // 关闭按钮事件
    const closeBtn = panel.querySelector('#zhs-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeZhsConfigPanel();
      });
    }

    // 输入框回车事件
    const keyInput = panel.querySelector('#zhs-api-key');
    if (keyInput) {
      keyInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveZhsApiKey();
        }
      });
    }


    const apiKeyInput = panel.querySelector('#zhs-api-key');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', function (e) {
        const key = e.target.value.trim();
        localStorage.setItem('GPTJsSetting.key', key);
        localStorage.setItem('tiku_key', key); // 同步到tiku_key
        if (key) {
          logger('API Key已更新: ' + key.substring(0, 3) + '***' + key.substring(key.length - 3), 'green');
        } else {
          logger('API Key已清空', 'orange');
        }
      });
    }


    const workCheckbox = panel.querySelector('#zhs-work');
    if (workCheckbox) {
      workCheckbox.addEventListener('change', function (e) {
        const isEnabled = e.target.checked;
        localStorage.setItem('GPTJsSetting.work', isEnabled.toString());
        setting.work = isEnabled ? 1 : 0; // 同步到setting对象

        logger('自动答题功能已' + (isEnabled ? '开启' : '关闭'), isEnabled ? 'green' : 'red');

        // 如果关闭了自动答题功能，显示提示
        if (!isEnabled) {
          showZhsMessage('⚠️ 自动答题功能已关闭，需要手动开启才能继续答题', 'warning');
        } else {
          showZhsMessage('✅ 自动答题功能已开启，系统将自动处理题目', 'success');
        }
      });
    }

    // 题库API配置事件
    const useTikuCheckbox = panel.querySelector('#zhs-use-tiku');
    if (useTikuCheckbox) {
      useTikuCheckbox.addEventListener('change', function (e) {
        localStorage.setItem('GPTJsSetting.useTiku', e.target.checked);
        logger('题库API配置已更新: ' + e.target.checked, 'blue');
      });
    }

    // AI答题配置事件
    const useAICheckbox = panel.querySelector('#zhs-use-ai');
    if (useAICheckbox) {
      useAICheckbox.addEventListener('change', function (e) {
        localStorage.setItem('GPTJsSetting.useAI', e.target.checked);
        logger('AI答题配置已更新: ' + e.target.checked, 'blue');
      });
    }



    logger('配置面板事件监听器设置完成', 'green');
  } catch (e) {
    logger(`设置配置面板事件监听器失败: ${e.message}`, 'red');
  }
}

// 显示消息
function showZhsMessage(message, type) {
  const messageDiv = document.getElementById('zhs-config-message');
  if (!messageDiv) return;

  messageDiv.textContent = message;
  messageDiv.className = 'zhs-config-message ' + type;
  messageDiv.style.display = 'block';

  // 3秒后自动隐藏
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// 更新配置状态显示
function updateZhsConfigStatus(isConfigured) {
  const statusDiv = document.querySelector('.zhs-config-status');
  if (statusDiv) {
    statusDiv.className = `zhs-config-status ${isConfigured ? 'configured' : 'not-configured'}`;
    statusDiv.textContent = isConfigured ? '✅ API Key 已配置' : '⚠️ 请配置 API Key';
  }
}

// 关闭配置面板
function closeZhsConfigPanel() {
  const panel = document.getElementById('zhs-config-panel');
  if (panel) {
    panel.remove();
  }
}

// 立即声明全局函数
window.closeZhsConfigPanel = closeZhsConfigPanel;

// 使面板可拖拽
function makeZhsPanelDraggable(panel) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  panel.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    // 排除所有交互元素，防止拖拽干扰正常交互
    const interactiveElements = ['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'OPTION', 'A'];
    if (interactiveElements.includes(e.target.tagName)) return;

    // 排除具有特定ID的元素（AI助手面板内的所有元素）
    if (e.target.id && (e.target.id.startsWith('zhs-ai-') || e.target.closest('#zhs-tab-ai'))) return;

    // 只允许在标题栏或空白区域拖拽
    const isHeaderArea = e.target.classList.contains('zhs-tab-header') ||
      e.target.closest('.zhs-tab-header') ||
      (e.target === panel && !e.target.closest('.zhs-tab-panel'));

    if (!isHeaderArea) return;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === panel || panel.contains(e.target)) {
      isDragging = true;
      panel.style.cursor = 'grabbing';
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    panel.style.cursor = 'move';
  }
}

// 智慧树题库API调用函数
function zhsGetAnswerFromAPI(questionText, questionType, optionList) {
  try {
    // 移除自动答题功能检查 - 默认总是答题
    // if (localStorage.getItem('GPTJsSetting.work') !== 'true') {
    //   logger('自动答题功能已关闭，跳过当前题目', 'orange');
    //   return;
    // }

    var userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || setting.token || '';

    if (!userKey) {
      logger('未设置API Key，无法调用题库API', 'orange');
      // 启动备用方案
      zhsHandleAPIFailure(questionText, questionType, optionList);
      return;
    }

    logger('开始调用题库API查询答案...', 'blue');

    // 构建选项文本
    var optionsText = '';
    if (optionList && optionList.length > 0) {
      optionsText = optionList.map(function (option, index) {
        var label = String.fromCharCode(65 + index); // A, B, C, D...
        return label + '.' + option.content.replace(/<[^>]*>/g, '').trim();
      }).join('\n');
    }

    // 题型映射
    var typeMapping = {
      1: '单选题',
      2: '多选题',
      3: '填空题',
      4: '问答题',
      14: '判断题'
    };

    var mappedType = typeMapping[questionType] || '单选题';

    // 构建请求数据
    var requestData = "key=" + encodeURIComponent(userKey) +
      "&question=" + encodeURIComponent(questionText) +
      "&type=" + encodeURIComponent(mappedType);

    if (optionsText) {
      requestData += "&options=" + encodeURIComponent(optionsText);
    }

    // 检查题库API是否开启
    if (localStorage.getItem('GPTJsSetting.useTiku') !== 'true') {
      logger('题库API已禁用，跳过题库查询', 'orange');
      zhsHandleAPIFailure(questionText, questionType, optionList);
      return;
    }

    const API_BASE_URL = (() => {
      const baseUrl = "tk.mixuelo.cc/api.php";
      const protocol = window.location.protocol;
      if (protocol === 'https:') {
        return "https://" + baseUrl;
      } else {
        return "http://" + baseUrl;
      }
    })();

    logger('发送题库API请求...', 'blue');
    logger(`使用API Key: ${userKey.substring(0, 8)}...`, 'blue');
    logger(`题库API状态: ${localStorage.getItem('GPTJsSetting.useTiku')}`, 'blue');
    logger(`请求URL: ${API_BASE_URL}?act=query`, 'blue');
    logger(`请求数据: ${requestData.substring(0, 200)}...`, 'blue');

    GM_xmlhttpRequest({
      method: "POST",
      url: API_BASE_URL + "?act=query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "PHPSESSID=th9rcnfi47nl9fhjsjrcbmvq01"
        // 添加Cookie头部，API Key通过data参数传递
      },
      data: requestData,
      timeout: 30000, // 修复主题库查询问题 - 统一超时时间到30秒
      onload: function (response) {
        try {
          if (response.status === 200) {
            var result = JSON.parse(response.responseText);
            if (result.code === 1 && result.data) {
              logger(`题库API返回答案: ${result.data}`, 'green');
              const success = zhsProcessAnswer(result.data, questionType, optionList);
              if (success) {
                // 只在答题成功后添加状态指示器
                const currentQuestionNum = getCurrentQuestionNumber();
                addQuestionStatusIndicator(currentQuestionNum, 'success', {
                  question: questionText,
                  answer: result.data,
                  selectedOptions: result.data,
                  type: '题库答题'
                });
              }
            } else {
              logger(`题库API返回错误: ${result.msg || '未知错误'}`, 'orange');
              // 添加失败状态指示器
              const currentQuestionNum = getCurrentQuestionNumber();
              addQuestionStatusIndicator(currentQuestionNum, 'failed', {
                question: questionText,
                answer: '题库API失败',
                selectedOptions: '无',
                type: '题库API错误'
              });
              // 启动备用方案
              zhsHandleAPIFailure(questionText, questionType, optionList);
            }
          } else {
            logger(`题库API请求失败，状态码: ${response.status}`, 'red');
            // 添加失败状态指示器
            const currentQuestionNum = getCurrentQuestionNumber();
            addQuestionStatusIndicator(currentQuestionNum, 'failed', {
              question: questionText,
              answer: '题库API请求失败',
              selectedOptions: '无',
              type: `HTTP错误${response.status}`
            });
            // 启动备用方案
            zhsHandleAPIFailure(questionText, questionType, optionList);
          }
        } catch (e) {
          logger(`解析题库API响应失败: ${e.message}`, 'red');
          // 启动备用方案
          zhsHandleAPIFailure(questionText, questionType, optionList);
        }
      },
      onerror: function () {
        logger('题库API请求网络错误', 'red');
        // 启动备用方案
        zhsHandleAPIFailure(questionText, questionType, optionList);
      },
      ontimeout: function () {
        logger('题库API请求超时（30秒）', 'red');
        // 添加失败状态指示器
        const currentQuestionNum = getCurrentQuestionNumber();
        addQuestionStatusIndicator(currentQuestionNum, 'failed', {
          question: questionText,
          answer: '题库API超时',
          selectedOptions: '无',
          type: '网络超时'
        });
        // 启动备用方案
        zhsHandleAPIFailure(questionText, questionType, optionList);
      }
    });

  } catch (e) {
    logger(`题库API调用异常: ${e.message}`, 'red');
    // 启动备用方案
    zhsHandleAPIFailure(questionText, questionType, optionList);
  }
}

function zhsHandleAPIFailure(questionText, questionType, optionList) {
  return new Promise((resolve, reject) => {
    logger('启动答题备用方案...', 'orange');

    // 调试：检查当前配置状态
    const useAI = localStorage.getItem('GPTJsSetting.useAI');
    // 随机答题功能已删除
    logger(`当前配置状态: AI答题=${useAI}`, 'blue');

    if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {
      logger('已开启AI答题功能，准备获取AI答案...', '#1890ff');

      // 题型映射
      var typeMapping = {
        0: '单选题',
        1: '单选题',
        2: '多选题',
        3: '填空题',
        4: '问答题',
        14: '判断题'
      };
      var typeName = typeMapping[questionType] || '单选题';

      // 设置AI答题超时保护
      var aiTimeout = setTimeout(() => {
        logger('❌ AI答题系统响应超时', 'red');
        logger('💡 提示: 请检查网络连接或AI服务状态', 'blue');
      }, 30000); // 30秒超时

      // 为AI构建完整的题目信息（题型+题目+选项）- 修复AI没有收到选项信息的问题
      let aiQuestionText = '';
      if (typeName) {
        aiQuestionText += typeName + ': ';
      }
      aiQuestionText += questionText;

      // 添加选项信息
      if (optionList && optionList.length > 0) {
        aiQuestionText += '\n选项：\n';
        optionList.forEach((option, index) => {
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
          // 修复选项信息传递问题 - 确保提取实际的选项文本
          const optionText = option.content ? option.content.replace(/<[^>]*>/g, '').trim() :
            option.text ? option.text.trim() :
              (typeof option === 'string' ? option : String(option));
          aiQuestionText += `${optionLabel}. ${optionText}\n`;
        });
      }

      logger(`🤖 发送给AI的完整题目信息: ${aiQuestionText.substring(0, 200)}...`, 'blue');
      logger(`🤖 题型: ${typeName}`, 'blue');
      logger(`🤖 选项数量: ${optionList ? optionList.length : 0}`, 'blue');
      if (optionList && optionList.length > 0) {
        logger(`🤖 选项详情: ${JSON.stringify(optionList.slice(0, 2))}`, 'blue');
      }

      zhsGetAIAnswer(aiQuestionText, typeName)
        .then(aiAnswer => {
          clearTimeout(aiTimeout);
          logger('AI成功回答，继续处理...', 'green');
          const success = zhsProcessAnswer(aiAnswer, questionType, optionList);
          if (success) {
            logger('✅ AI答题成功，准备自动下一题', 'green');
            // 只在答题成功后添加状态指示器
            const currentQuestionNum = getCurrentQuestionNumber();
            addQuestionStatusIndicator(currentQuestionNum, 'success', {
              question: questionText,
              answer: aiAnswer,
              selectedOptions: aiAnswer,
              type: 'AI答题'
            });
            // 设置导航标记并立即尝试导航
            setting.shouldNavigateNext = true;
            setTimeout(() => {
              zhsContinueToNextQuestion();
            }, 1500);
          }
        })
        .catch(error => {
          clearTimeout(aiTimeout);
          logger('❌ AI回答失败: ' + error, 'red');
          logger('💡 提示: 请检查AI配置或网络连接', 'blue');
          // AI失败后不再使用随机答题，直接报错
          const currentQuestionNum = getCurrentQuestionNumber();
          addQuestionStatusIndicator(currentQuestionNum, 'failed', {
            question: questionText,
            answer: 'AI答题失败',
            selectedOptions: '无',
            type: 'AI答题失败'
          });
        });
    } else {
      // AI答题功能未开启
      logger('❌ AI答题功能未开启，无法获取答案', 'red');
      logger('💡 提示: 请在设置中开启AI答题功能', 'blue');
    }
  });
}

// 随机答题功能已删除 - 根据用户要求完全删除随机答题功能


function zhsHandleAPIFailureForOriginal(questionData) {
  logger('启动原始答题系统备用方案...', 'orange');

  // 第一备用方案：AI答题
  if (localStorage.getItem('GPTJsSetting.useAI') === 'true') {
    logger('已开启AI答题功能，准备获取AI答案...', '#1890ff');

    // 题型映射
    var typeMapping = {
      0: '单选题',
      1: '单选题',
      2: '多选题',
      3: '填空题',
      4: '问答题',
      14: '判断题'
    };
    var typeName = typeMapping[questionData.type] || '单选题';

    // 设置AI答题超时保护
    var aiTimeout = setTimeout(() => {
      logger('AI答题系统响应超时，跳过当前题目', 'red');
      logger('⚠️ 答案选择失败，不自动跳题，请手动处理', 'orange');
    }, 30000); // 30秒超时

    // 为AI构建完整的题目信息（题型+题目+选项）- 修复AI没有收到选项信息的问题
    let aiQuestionText = '';
    if (typeName) {
      aiQuestionText += typeName + ': ';
    }
    aiQuestionText += questionData.question;

    // 添加选项信息
    if (questionData.options && questionData.options.length > 0) {
      aiQuestionText += '\n选项：\n';
      questionData.options.forEach((option, index) => {
        const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
        // 修复选项信息传递问题 - 确保提取实际的选项文本
        const optionText = option.content ? option.content.replace(/<[^>]*>/g, '').trim() :
          option.text ? option.text.trim() :
            (typeof option === 'string' ? option : String(option));
        aiQuestionText += `${optionLabel}. ${optionText}\n`;
      });
    }

    logger(`🤖 发送给AI的完整题目信息: ${aiQuestionText.substring(0, 200)}...`, 'blue');

    zhsGetAIAnswer(aiQuestionText, typeName)
      .then(aiAnswer => {
        clearTimeout(aiTimeout);
        logger('AI成功回答，继续处理...', 'green');
        selectZhihuishuOption(questionData, aiAnswer);
      })
      .catch(error => {
        clearTimeout(aiTimeout);
        logger('AI回答失败: ' + error, 'red');
        // AI失败，跳过当前题目
        logger('⚠️ 答案选择失败，不自动跳题，请手动处理', 'orange');
      });
  } else {
    // AI答题功能未开启，跳过当前题目
    logger('⚠️ AI答题功能未开启，答案选择失败，不自动跳题，请手动处理', 'orange');
  }
}

// 随机答题功能已删除 - 根据用户要求完全删除随机选择功能


function zhsGetAIAnswer(question, typeName) {
  return new Promise((resolve, reject) => {
    if (!question || question.trim() === '') {
      reject('问题不能为空');
      return;
    }

    // 获取选择的模型
    const model = localStorage.getItem('GPTJsSetting.model') || 'gpt-3.5-turbo-16k';

    // 获取用户配置的 key
    let userKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';

    // 检查key是否为空
    if (!userKey) {
      reject('Key不存在，请前往蜜雪激活');
      return;
    }

    // 处理题目内容
    let processedQuestion = question;

    // 根据题型构建提示词 - 修复AI答题系统提示词问题
    let systemPrompt = "你是一个专业的答题助手。";
    if (typeName) {
      systemPrompt += `这是一道${typeName}，请给出准确答案。`;

      // 根据题型调整提示词
      if (typeName.includes("单选题")) {
        systemPrompt += "请直接给出正确选项的完整内容，不要返回选项字母（如A/B/C/D）。如果题目包含选项，请从给出的选项中选择正确答案。";
      } else if (typeName.includes("多选题")) {
        systemPrompt += "请直接给出所有正确选项的完整内容，用###分隔，不要返回选项字母。如果题目包含选项，请从给出的选项中选择正确答案。";
      } else if (typeName.includes("判断题")) {
        systemPrompt += "请直接回答'正确'或'错误'。";
      } else if (typeName.includes("填空题")) {
        systemPrompt += "请直接给出填空内容，无需额外说明。";
      }
    }

    // 添加调试信息
    // logger(`🤖 AI答题调试信息:`, 'blue');
    // logger(`   - 题型: ${typeName}`, 'blue');
    // logger(`   - 题目长度: ${processedQuestion.length}`, 'blue');
    // logger(`   - SystemPrompt: ${systemPrompt}`, 'blue');

    // 设置超时时间
    let requestTimedOut = false;
    const timeoutId = setTimeout(() => {
      requestTimedOut = true;
      reject('请求超时，未收到响应');
    }, 130000); // 130秒超时

    try {
     
      const API_BASE_URL = (() => {
        const baseUrl = "tk.mixuelo.cc/api.php";
        const protocol = window.location.protocol;
        if (protocol === 'https:') {
          return "https://" + baseUrl;
        } else {
          return "http://" + baseUrl;
        }
      })();

      GM_xmlhttpRequest({
        method: 'POST',
        url: API_BASE_URL + '?act=aimodel',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + userKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `key=${encodeURIComponent(userKey)}&model=${encodeURIComponent(model)}&question=${encodeURIComponent(processedQuestion)}&system=${encodeURIComponent(systemPrompt)}`,
        timeout: 120000, // 120秒超时
        onload: function (response) {
          clearTimeout(timeoutId);
          if (requestTimedOut) return;

          try {
            if (!response.responseText) {
              resolve("");
              return;
            }

            const result = JSON.parse(response.responseText);

            if (response.status === 200) {
              // 检查是否有错误信息
              if (result.code === 1001) {
                resolve("");
                return;
              }

              // 处理成功响应
              if (result.code === 1 && result.data) {
                resolve(result.data);
              } else {
                resolve("");
              }
            } else {
              resolve("");
            }
          } catch (e) {
            resolve("");
          }
        },
        onerror: function () {
          clearTimeout(timeoutId);
          if (requestTimedOut) return;
          resolve("");
        },
        ontimeout: function () {
          clearTimeout(timeoutId);
          resolve("");
        }
      });
    } catch (e) {
      clearTimeout(timeoutId);
      resolve("");
    }
  });
}

// 随机答案生成功能已删除 - 根据用户要求完全删除随机选择功能

// 处理题库API返回的答案
function zhsProcessAnswer(answer, questionType, optionList) {
  try {
    if (!optionList || optionList.length === 0) {
      logger('没有选项列表，无法处理答案', 'orange');
      return;
    }

    // 检查答案是否有效
    if (!answer || typeof answer !== 'string') {
      logger('答案无效，启动备用方案', 'orange');
      logger('⚠️ 答案选择失败，不自动跳题，请手动处理', 'orange');
      return;
    }

    // 清理答案文本
    var cleanAnswer = answer.replace(/<[^>]*>/g, '').trim();
    logger(`处理答案: ${cleanAnswer}`, 'blue');

    // 处理"###"分隔的多个答案（用户示例格式）
    var answerParts = cleanAnswer.split('###').map(part => part.trim()).filter(part => part.length > 0);
    logger(`📝 答案分割结果: ${JSON.stringify(answerParts)} (共${answerParts.length}个答案)`, 'blue');

    // 查找匹配的选项
    var matchedOptions = [];

    optionList.forEach(function (option, index) {
      var optionText = option.content.replace(/<[^>]*>/g, '').trim();
      var optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

      // 检查是否匹配任何一个答案部分
      var isMatched = false;

      for (var i = 0; i < answerParts.length; i++) {
        var answerPart = answerParts[i];

        // 多种匹配方式
        if (answerPart.includes(optionText) ||
          optionText.includes(answerPart) ||
          answerPart.includes(optionLabel) ||
          answerPart === optionText) {
          isMatched = true;
          break;
        }
      }

      if (isMatched) {
        matchedOptions.push({
          index: index,
          option: option,
          label: optionLabel
        });
        logger(`✅ 找到匹配选项 ${optionLabel}: ${optionText}`, 'green');
      }
    });

    // 执行选择
    if (matchedOptions.length > 0) {
      var successCount = 0;
      matchedOptions.forEach(function (match) {
        var success = zhsSelectOption(match.index, match.option);
        if (success) {
          successCount++;
        }
      });

      if (successCount > 0) {
        logger(`🎯 成功选择 ${successCount}/${matchedOptions.length} 个选项`, 'green');
        logger(`📊 答题结果: 已选择选项 ${matchedOptions.map(m => m.label).join(', ')}`, 'blue');
        // 只有在成功选择选项后才自动进行下一题
        setTimeout(() => {
          zhsContinueToNextQuestion();
        }, 1500);
      } else {
        logger('❌ 选项选择失败，不自动跳题', 'red');
      }
    } else {
      logger('❌ 未找到匹配的选项，启动备用方案', 'orange');
      logger(`💡 提示: 答案"${cleanAnswer}"与选项不匹配`, 'blue');
      // 随机选择功能已删除，跳过当前题目
      logger('⚠️ 答案选择失败，不自动跳题，请手动处理', 'orange');
    }

  } catch (e) {
    logger(`处理答案时出错: ${e.message}`, 'red');
    // 随机选择功能已删除，跳过当前题目
    logger('⚠️ 答案选择失败，不自动跳题，请手动处理', 'orange');
  }
}

function zhsSelectOption(index, option, autoNext = false) {
  try {
    logger(`尝试选择选项 ${String.fromCharCode(65 + index)}: ${option.content ? option.content.replace(/<[^>]*>/g, '').trim() : option}`, 'blue');

    // 多种选择器尝试，基于智慧树平台的实际结构
    var selectors = [
      '.TitleOptions-div input',
      '.optionUl input',
      '.el-radio input',
      '.el-checkbox input',
      'input[type="radio"]',
      'input[type="checkbox"]',
      '.option-item input',
      '.question-option input'
    ];

    var $input = null;
    var $container = null;

    // 尝试找到对应的输入元素
    for (var i = 0; i < selectors.length; i++) {
      var elements = document.querySelectorAll(selectors[i]);
      if (elements && elements[index]) {
        $input = elements[index];
        $container = $input.closest('.TitleOptions-div, .optionUl, .el-radio, .el-checkbox, .option-item, .question-option');
        logger(`使用选择器 ${selectors[i]} 找到选项`, 'green');
        break;
      }
    }

    if ($input) {
    
      var clickSuccess = false;

      try {
        // 方法1: 直接点击输入元素
        $input.click();
        $input.checked = true;
        logger(`成功点击选项 ${String.fromCharCode(65 + index)}`, 'green');
        clickSuccess = true;
      } catch (e) {
        logger(`直接点击失败: ${e.message}`, 'orange');
      }

      if (!clickSuccess && $container) {
        try {
          // 方法2: 点击容器元素
          $container.click();
          logger(`点击容器成功选择选项 ${String.fromCharCode(65 + index)}`, 'green');
          clickSuccess = true;
        } catch (e) {
          logger(`点击容器失败: ${e.message}`, 'orange');
        }
      }

      if (!clickSuccess && $) {
        try {
          // 方法3: 使用jQuery
          $($input).prop('checked', true).trigger('click').trigger('change');
          if ($container) {
            $($container).trigger('click');
          }
          logger(`使用jQuery选择选项 ${String.fromCharCode(65 + index)}`, 'green');
          clickSuccess = true;
        } catch (e) {
          logger(`jQuery点击失败: ${e.message}`, 'orange');
        }
      }

      if (!clickSuccess) {
        try {
          // 方法4: 事件模拟
          var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          $input.dispatchEvent(clickEvent);

          var changeEvent = new Event('change', { bubbles: true });
          $input.dispatchEvent(changeEvent);

          logger(`使用事件模拟选择选项 ${String.fromCharCode(65 + index)}`, 'green');
          clickSuccess = true;
        } catch (e) {
          logger(`事件模拟失败: ${e.message}`, 'red');
        }
      }

      // 添加到队列
      if (setting.queue) {
        setting.queue.push($input);
      }

      // 只有在autoNext为true时才自动跳转
      if (autoNext && clickSuccess) {
        setTimeout(() => {
          zhsContinueToNextQuestion();
        }, 1500);
      }

      return clickSuccess;

    } else {
      logger(`未找到选项 ${String.fromCharCode(65 + index)} 的输入元素`, 'orange');
      return false;
    }

  } catch (e) {
    logger(`选择选项时出错: ${e.message}`, 'red');
    return false;
  }
}

function zhsContinueToNextQuestion() {
  try {
    // 首先检查答题状态 - 只有在答题开启时才自动导航
    const isAutoAnswerEnabled = localStorage.getItem('GPTJsSetting.work') === 'true';
    if (!isAutoAnswerEnabled) {
      logger(`🛑 自动答题已关闭，停止自动导航到下一题`, 'orange');
      return false;
    }

    // 使用统一的导航标记机制，而不是直接导航
    logger('设置导航标记，等待定时器处理', 'blue');
    setting.shouldNavigateNext = true;
    return true;

  } catch (e) {
    logger(`继续下一题时出错: ${e.message}`, 'red');
  }
}

// 随机选择功能已删除 - 根据用户要求完全删除随机选择功能

// 创建浮动按钮
function createZhsFloatingButton() {
  // 防止重复创建
  if (document.getElementById('zhs-floating-button')) return;

  const currentKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';
  const isConfigured = !!currentKey;

  const button = document.createElement('div');
  button.id = 'zhs-floating-button';
  button.className = 'zhs-floating-button';
  button.innerHTML = '⚙️';
  button.title = isConfigured ? 'API Key已配置 - 点击打开设置' : '请配置API Key - 点击打开设置';

  // 添加状态指示器
  const indicator = document.createElement('div');
  indicator.className = `zhs-status-indicator ${isConfigured ? 'configured' : 'not-configured'}`;
  indicator.innerHTML = isConfigured ? '✓' : '!';
  button.appendChild(indicator);

  // 点击事件
  button.addEventListener('click', function () {
    const panel = document.getElementById('zhs-config-panel');
    if (panel) {
      panel.remove();
    } else {
      createZhsConfigPanel();
    }
  });

  document.body.appendChild(button);
}

// 更新浮动按钮状态
function updateZhsFloatingButton() {
  const button = document.getElementById('zhs-floating-button');
  const indicator = button ? button.querySelector('.zhs-status-indicator') : null;

  if (button && indicator) {
    const currentKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';
    const isConfigured = !!currentKey;

    button.title = isConfigured ? 'API Key已配置 - 点击打开设置' : '请配置API Key - 点击打开设置';
    indicator.className = `zhs-status-indicator ${isConfigured ? 'configured' : 'not-configured'}`;
    indicator.innerHTML = isConfigured ? '✓' : '!';
  }
}

// 初始化智慧树配置系统
function initZhsConfigSystem() {
  // 强制重新初始化 - 确保新配置生效
  window.zhsConfigInitialized = true;

  logger('初始化智慧树配置系统', 'blue');

  // 检查API Key配置状态
  const currentKey = localStorage.getItem('GPTJsSetting.key') || localStorage.getItem('tiku_key') || '';
  if (currentKey) {
    logger('检测到已配置的API Key: ' + currentKey.substring(0, 8) + '...', 'green');
  } else {
    logger('未检测到API Key配置，请配置后使用', 'orange');
  }

  // 初始化答题配置系统 - 修改默认配置：不开启题库答题，默认GPT-3.5-Turbo模型
  // 只在首次初始化时设置默认值，保持用户的配置选择
  const settingDefaults = {
    'GPTJsSetting.useTiku': 'false',       // 题库答题默认关闭
    'GPTJsSetting.useBackupTiku': 'false', // 备用题库默认关闭
    'GPTJsSetting.useAI': 'true',          // AI答题默认开启
    // 随机答题功能已删除
    'GPTJsSetting.autoSubmit': 'false',    // 自动提交默认关闭
    'GPTJsSetting.showAnswer': 'true',     // 显示答案默认开启
    'GPTJsSetting.model': 'gpt-3.5-turbo-16k'  // 默认GPT-3.5-Turbo模型
  };

  // 只在配置不存在时设置默认值，保持用户配置
  Object.keys(settingDefaults).forEach(key => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, settingDefaults[key]);
    }
  });

  // 强制确保AI答题功能开启 - 修复用户配置中AI答题被关闭的问题
  if (localStorage.getItem('GPTJsSetting.useAI') !== 'true') {
    logger('检测到AI答题功能被禁用，强制启用AI答题功能', 'orange');
    localStorage.setItem('GPTJsSetting.useAI', 'true');
  }

  // 删除强制启用题库API的逻辑，尊重用户配置
  // 注释掉原来的强制启用逻辑
  // if (localStorage.getItem('GPTJsSetting.useTiku') !== 'true') {
  //   logger('检测到题库API被禁用，强制启用题库API', 'orange');
  //   localStorage.setItem('GPTJsSetting.useTiku', 'true');
  // }

  // 强制默认开启自动答题功能 - 修复用户反馈的默认不答题问题
  localStorage.setItem('GPTJsSetting.work', 'true');
  localStorage.setItem('ZhsJsSetting.work', 'true');
  setting.work = true;
  logger('🚀 强制开启自动答题功能（默认行为）', 'green');

  // 立即启动答题流程
  setTimeout(() => {
    if (checkZhsAnswerPage()) {
      logger('🎯 检测到答题页面，立即启动自动答题', 'green');
      zhsProcessQuestions();
    }
  }, 2000);

  // 初始化设置项的UI状态
  setTimeout(() => {
    Object.keys(settingDefaults).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = localStorage.getItem(key) === 'true';
          element.addEventListener('change', () => {
            localStorage.setItem(key, element.checked.toString());
          });
        } else if (element.tagName === 'SELECT') {
          element.value = localStorage.getItem(key) || settingDefaults[key];
          element.addEventListener('change', () => {
            localStorage.setItem(key, element.value);
          });
        }
      }
    });

    // 特别处理AI助手面板的模型选择
    const aiModelSelect = document.getElementById('zhs-ai-model');
    if (aiModelSelect) {
      const savedModel = localStorage.getItem('GPTJsSetting.model') || 'DeepSeek-Chat';
      aiModelSelect.value = savedModel;
      aiModelSelect.addEventListener('change', (e) => {
        const selectedModel = e.target.value;
        localStorage.setItem('GPTJsSetting.model', selectedModel);
        logger(`AI模型已切换为: ${selectedModel}`, 'blue');
      });
      logger(`AI助手模型选择已初始化: ${savedModel}`, 'green');
    }
  }, 1000);
  // 移除重复的配置设置，避免覆盖用户配置
  // 所有默认配置已在上面的settingDefaults中统一处理

  logger('配置初始化完成，答题功能状态: ' + (setting.work ? '开启' : '关闭'), 'green');

  // 显示答题优先级配置状态 - 实时检查
  const workStatus = localStorage.getItem('GPTJsSetting.work') === 'true';
  const useAI = localStorage.getItem('GPTJsSetting.useAI') === 'true';
  const useTiku = localStorage.getItem('GPTJsSetting.useTiku') === 'true';
  // 随机答题功能已删除

  logger('✅ 完整配置状态检查:', 'blue');
  logger('   - 自动答题功能: ' + workStatus, workStatus ? 'green' : 'red');
  logger('   - 题库API: ' + useTiku, useTiku ? 'green' : 'red');
  logger('   - AI答题: ' + useAI, useAI ? 'green' : 'red');
  // 随机答题功能已删除

  setting.none = 0;

  setTimeout(() => {
    const isAnswerPage = checkZhsAnswerPage();
    if (isAnswerPage) {
      logger('检测到智慧树答题页面，自动启动答题功能', 'blue');
      // 自动启动答题，不需要手动点击按钮
      setTimeout(() => {
        zhsProcessQuestions();
      }, 1000);
    }
  }, 2000);


 
  if (!currentKey) {
    setTimeout(() => {
      logger('💡 提示：按F9或点击右下角设置按钮配置API Key', 'blue');


      setTimeout(() => {
        logger('⚠️ 重要：当前未配置API Key，无法进行自动答题！', 'red');
        logger('🔧 配置方法：按F9键打开配置面板，输入API Key', 'orange');


        setTimeout(() => {
          const stillNoKey = !localStorage.getItem('GPTJsSetting.key') && !localStorage.getItem('tiku_key');
          if (stillNoKey) {
            logger('🚨 请使用新的控制面板配置API Key以获取正确答案', 'red');
            logger('💡 按F9键打开控制面板进行配置', 'blue');
            // createZhsConfigPanel(); // 已被新控制面板替代
          }
        }, 5000);
      }, 3000);
    }, 2000);
  }
}







