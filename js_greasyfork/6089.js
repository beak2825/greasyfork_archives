// ==UserScript==
// @name        115videocrack
// @namespace   thunderhit@163.com
// @include     http://115.com/?ct=play&pickcode=*
// @version     1.2
// @description 115video
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6089/115videocrack.user.js
// @updateURL https://update.greasyfork.org/scripts/6089/115videocrack.meta.js
// ==/UserScript==
function js() {
  /*
var _pickcode = location.search.replace('?ct=play&pickcode=', '');
var ajax_data_load = function (callback) {
  UA$.ajax({
    url: '/files/video?pickcode=at81a53gtk0aehjce',
    type: 'get',
    dataType: 'json',
    success: function (de) {
      // if(de.state) {
      var notToPlay = false;
      if (de['file_status']) {
        if (IS_VIP) {
          PLAY_CAN_PLAY = true;
        } else {
          if (de['video_url_demo']) {
            PLAY_CAN_PLAY = true;
          } else {
            PLAY_CAN_PLAY = false;
          }
        }
      } else {
        PLAY_CAN_PLAY = false;
      }
      if (!IS_VIP) {
        //限制只看5次
        if (PLAY_CAN_PLAY && de.play_count <= de.play_count_limit) {
        } 
        else {
          if (PLAY_CAN_PLAY) {
            notToPlay = true;
          }
          PLAY_CAN_PLAY = false;
        }
      }
      if (de['state']) {
        PLAY_NOT_FILE = true;
      } else {
        if (de['errNo'] == 405) {
          notToPlay = true;
          PLAY_CAN_PLAY = false;
          PLAY_NOT_FILE = true;
        } 
        else {
          PLAY_NOT_FILE = false;
        }
      }
      video_data['parent_id'] = de.parent_id;
      video_data['file_id'] = de.file_id;
      video_data['file_name'] = de.file_name;
      video_data['file_size'] = de.file_size;
      callback && callback(de, notToPlay);
    }
  })
}
ajax_data_load(function (de, notToPlay) {
  if (!PLAY_CAN_PLAY) {
    ;
    (function () {
      var nnStr = navigator.platform.toString().toLowerCase();
      if ($.inArray(nnStr, [
        'ipad',
        'iphone'
      ]) != - 1 || navigator.userAgent.match(/Android/i)) {
        $(function () {
          $('#js_video').css({
            width: '100%',
            height: '100%'
          });
          $('#js-video_title').attr('title', de.file_name).text(de.file_name);
          document.title = de.file_name;
          var list_video = [
          ];
          list_video.push({
            width: de.width,
            height: de.height,
            title: de.file_name,
            value: Video_Cookie.get('video_play_value') ? Number(Video_Cookie.get('video_play_value'))  : 0.8,
            url: de.video_url_demo,
            text: de['caption_url'] || '',
            text_type: 1,
            thumb: de['outline_info'] || []
          })
          var obj = list_video;
          if (obj.length) {
            var item = obj[0];
            var h = item.height;
            var dh = $(document).height();
            var w = item.width;
            var b = w / h;
            if (dh - 88 < h) {
              h = dh - 88;
            }
            if (h < 450) {
              h = 450;
            }
            w = b * h;
            if (w > 960) {
              w = 960;
              h = w / b;
            }
            var html = [
            ];
            if (obj.length > 1) {
              html.push('<div>');
              for (var i = 0, len = obj.length; i < len; i++) {
                var txt = '视频' + i;
                switch (i) {
                  case 0:
                    txt = '标清';
                    break;
                  case 1:
                    txt = '高清';
                    break;
                  case 2:
                    txt = '超清';
                    break;
                }
                html.push('<button i="' + i + '">' + txt + '</button>');
              }
              html.push('</div>');
              videoBox.delegate('[i]', 'click', function () {
                var vitem = obj[Number($(this).attr('i'))];
                var v = videoBox.find('video');
                v.attr('src', vitem.url);
                var h = vitem.height;
                var dh = $(document).height();
                var w = vitem.width;
                var b = w / h;
                if (dh - 88 < h) {
                  h = dh - 88;
                }
                if (h < 450) {
                  h = 450;
                }
                w = b * h;
                if (w > 960) {
                  w = 960;
                  h = w / b;
                }
                v.css({
                  width: w,
                  height: h
                });
                return false;
              });
            }
            html.push('<video src="' + item.url + '" style="width:' + w + 'px;height:' + h + 'px;" controls="controls"></video>');
            videoBox.html(html.join(''));
            videoBox.css({
              top: ''
            });
          }
        });
      } 
      else {
        function start(callback) {
          if (!de.state) {
            var new_thumb_obj = [
            ];
            de = {
              //download_url: {
              //  1200000: 'http://cdn.115.com/mp422/07/26/CnQA71PVM0UAAAAANnzvpiKUe-E004.mp4?t=1410080213&k=BAt4K_LRipoLbBnJhqsQ4w',
              //  800000: 'http://cdn.115.com/mp422/07/26/CnQA71PVMzsAAAAAINRZxBBfCPg226.mp4?t=1410080213&k=0kGmpv8Y3cSJqGcPFxGgRQ'
              //},
              //file_id: '335838922880019565',
              file_name: '我正在测试',
              //file_size: '1289782320',
              file_status: 1,
              height: 360,
              width: 640,
              //outline_info: {
              //  height: 72,
              //  interval: 10,
              //  width: 128,
              //  url: [
              //    'http://cdn.115.com/mp422/06/D6/CnQA71PVDaEAAAAAAAFvFHtPyyk070.jpg?t=1410080213&k=6nSr5oGVKsKKIYPANGMYQA',
              //    'http://cdn.115.com/mp422/06/D6/CnQA71PVDaEAAAAAAAFqnlAABOc532.jpg?t=1410080213&k=9p8YmdhMl3izeIa60Tib6Q',
              //    'http://cdn.115.com/mp422/06/D6/CnQA71PVDaIAAAAAAAFMG0kcy5Y050.jpg?t=1410080213&k=fAJ8UFGcTotpHJdfFlg7KQ',
               //   'http://cdn.115.com/mp422/06/D6/CnQA71PVDaMAAAAAAAFSphCbUgE464.jpg?t=1410080213&k=FWwtP3wVFSJk6JAAMfqJQg',
               //   'http://cdn.115.com/mp422/06/D6/CnQA71PVDaMAAAAAAAEw0RDGdNk200.jpg?t=1410080213&k=eOl7VwOq9pn3X0ngl6p6mQ',
                 // 'http://cdn.115.com/mp422/06/D6/CnQA71PVDaQAAAAAAAE1mAoibQ0557.jpg?t=1410080213&k=OFXRKt3j2KRb4ST4nfkr4w',
                  //'http://cdn.115.com/mp422/06/D6/CnQA71PVDaQAAAAAAAEg4Bm0Szg970.jpg?t=1410080213&k=FI0PsrL4pcq5V_cONN71Jg',
                  //'http://cdn.115.com/mp422/06/D6/CnQA71PVDaQAAAAAAAB1JUhYTo0546.jpg?t=1410080213&k=WFIARxqZF4kQ-3WKUPmttw'
               // ]
              //},
              //parent_id: '335838922854853740',
              pick_code: _pickcode,
              //play_count: 2,
              //play_copunt_limit: 5,
              state: true,
              subtitle_info: [
              ],
              //thumb_url: 'http://static.115.com/video/FB51C063AD5A0699CDA2802EE1A4C8E5D82E621F.jpg',
              video_url: 'http://115.com/api/video/m3u8/' + _pickcode + '.m3u8',
              video_url_demo: 'http://115.com/api/video/m3u8/' + _pickcode + '.m3u8',
            }
            if (de['outline_info'] && de['outline_info']['url']) {
              for (var k = 0; k < de['outline_info']['url'].length; k++) {
                new_thumb_obj.push({
                  url: de['outline_info']['url'][k]
                })
              }
              de['outline_info']['url'] = new_thumb_obj;
            }
            $('#js-video_title').attr('title', de.file_name).text(de.file_name);
            document.title = de.file_name;
            var list_video = [
            ];
            list_video.push({
              width: de.width,
              height: de.height,
              title: de.file_name,
              value: Video_Cookie.get('video_play_value') ? Number(Video_Cookie.get('video_play_value'))  : 0.8,
              url: de.video_url_demo,
              text: de['caption_url'] || '',
              text_type: 1,
              thumb: de['outline_info'] || []
            })
            $('.video-vip').hide();
            if (de['subtitle_info']) {
              Subtitle = de['subtitle_info'];
            }
            window['download_url'] = de.download_url;
            window['OOF_VIDEO_OBJ'] = function () {
              return list_video;
            }
            UA$.ajax({
              url: '/files/history?pick_code=at81a53gtk0aehjce&fetch=one&category=1',
              type: 'get',
              dataType: 'json',
              success: function (data) {
                var k = 0;
                var def = - 1;
                if (data.state) {
                  k = data.data.time;
                  def = data.data ? data.data.definition : - 1;
                }
                callback && callback(k, Number(def));
              }
            })
          } else {
            Core.MinMessage.Show({
              text: data.msg || '获取内容失败请重刷尝试',
              type: 'err',
              timeout: 2000
            })
          }
          liwidth = 8 * 108;
          if (!_listLoad) {
            _listLoad = true;
            addPlay({
              offset: _offset,
              callback: function (arr) {
                videoList.html(arr.join(''));
              }
            })
          }
        }


        var time_setInterval;
        start(function (s, def) {
          OOF_RETURN.config = function () {
            return {
              isvip: IS_VIP,
              time: 60,
              start: s,
              def: - 1
            }
          }
          if (window.navigator.userAgent.indexOf('rv:11') != - 1) {
            $.browser.msie = false;
          }
          var swfURL = '/static/oof_video/VideoASHLS.swf?v=46';

          var lbox = $('#js_loaind_box');
          var lbBox = $('#js_loading_bottom_box');
          var swfVersionStr = '10.2.0';
          var xiSwfUrlStr = 'http://115.com/static/plug/video_play/playerProductInstall.swf?v=1.8.0';
          var flashvars = {
          };
          var params = {
          };
          params.quality = 'high';
          params.bgcolor = '#000000';
          params.wmode = 'Opaque';
          params.allowscriptaccess = 'sameDomain';
          params.allowfullscreen = 'true';
          var attributes = {
          };
          attributes.id = 'video';
          attributes.name = 'video';
          attributes.align = 'middle';
          swfobject.embedSWF(swfURL, 'js_swf_play', '960', '540', swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
          var time_i = 0,
          swf_download = false;
          time_setInterval = setInterval(function () {
            if (time_i > 10 || swf_download) {
              time_setInterval && clearInterval(time_setInterval);
            } else {
              if (document.getElementById('video') && document.getElementById('video').Init) {
                swf_download = true;
                document.getElementById('video').Init();
                time_setInterval && clearInterval(time_setInterval);
              } else {
                time_i++;
              }
            }
          }, 500);
          var $js_video = $('#js_video'),
          js_video_time;
          $(window).resize(function (event) {
            js_video_time && clearTimeout(js_video_time);
            js_video_time = setTimeout(function () {
              $js_video.css('position', 'relative');
            }, 50);
            return false;
          });
        })
      }
    }) ();
  } 
  else {
    ;
    (function () {
      if (!PLAY_NOT_FILE) {
        $(document.body).append($('<div class="video-addfile">' +
        '<span>点击添加文件播放视频</span>' +
        '<a href="javascript:;" class="video-btn" rel="js_select_btn">添加文件</a>' +
        '</div>'));
      } 
      else {
        if (notToPlay) {
          if (!VIP_ALERT_DOM) {
            VIP_ALERT_DOM = $('<div class="video-vip"><a href="http://vip.115.com/?p=player_min" target="_blank">立即开通VIP</a></div>');
            $(document.body).append(VIP_ALERT_DOM);
          } 
          else {
            VIP_ALERT_DOM.show();
          }
          Core.DialogBaseHandler['ShowHandler'] && Core.DialogBaseHandler['ShowHandler']();
        } 
        else {
          var con = $('<div class="speed_bg"><a href="javascript:;" btn="speed" ><img src="/static/images/speed_btn.gif" /></a></div>')
          var speed_box = new Core.DialogBase({
            title: '云端转码',
            content: con,
            width: 480,
            height: 120
          });
          con.on('click', '[btn]', function () {
            var el = $(this);
            Core.Message.Confirm({
              text: 'VIP方可使用加速转码功能，请立即升级',
              confirm_text: '升级VIP',
              confirm_link: 'http://vip.115.com/?p=vediocov',
              type: 'info'
            });
            return false;
          })
          speed_box.Open(function () {
            $('[rel="title_box"]').hide();
            $('.dialog-box').css({
              margin: '-60px 0 0 -240px',
              top: '50%',
              left: '50%'
            })
          });
        }
      }
      $('[rel="js_select_btn"]').on('click', function () {
        Core.FileSelectDG.Open(function (list) {
          if (list.length) {
            var item = list[0];
            var pc = item.pick_code;
            if (pc) {
              window.location.href = '/?ct=play&ac=location&pickcode=' + pc;
            }
          }
        }, {
          filter: 4,
          select: 1
        });
        return false;
      });
    }) ();
  }
});
  */
}
str = js.toString();
str = str.substring(str.indexOf("/*")+2,str.lastIndexOf("*/"));
var c = document.createElement('script');
c.type = 'text/javascript';
c.innerHTML = "function c(){"+str+"}";
document.body.appendChild(c);
location.assign("javascript:c();$('.video-vip').hide();void(0);");