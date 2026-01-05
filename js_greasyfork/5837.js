// ==UserScript==
// @name           易玩通交易区违规检查助手
// @namespace      shirakawahotaru
// @description    易玩通交易区违规检查助手 白河ほたる
// @include        http://bbs.polchina.com.cn/viewthread.php?tid=*
// @include        http://bbs.polchina.com.cn/modcp.php?action=members&op=ban&uid=*
// @grant       GM_openInTab
// @version 0.0.1.20141018044449
// @downloadURL https://update.greasyfork.org/scripts/5837/%E6%98%93%E7%8E%A9%E9%80%9A%E4%BA%A4%E6%98%93%E5%8C%BA%E8%BF%9D%E8%A7%84%E6%A3%80%E6%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/5837/%E6%98%93%E7%8E%A9%E9%80%9A%E4%BA%A4%E6%98%93%E5%8C%BA%E8%BF%9D%E8%A7%84%E6%A3%80%E6%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  var log = function(arg){
    unsafeWindow.console.log(arg);
  }
  
  var Storage = {
    getValue: function (key, defaultVal) {
      var value = unsafeWindow.localStorage.getItem(key);
      if (value == null) {
        return defaultVal;
      } else {
        return value;
      }
    },
    setValue: function (key, value) {
      unsafeWindow.localStorage.setItem(key, value);
    },
    deleteValue: function (key) {
      unsafeWindow.localStorage.removeItem(key);
    }
  };
  var $ = function (id) {
    return document.getElementById(id);
  };
  var $tg = function (tgName) {
    return document.getElementsByTagName(tgName);
  };
  var $css = function (cssName) {
    return document.getElementsByClassName(cssName);
  };
  var nowLocation = window.location.toString();
  if (nowLocation.indexOf('http://bbs.polchina.com.cn/modcp.php?action=members&op=ban&uid=') > - 1) {
    var uid = nowLocation.replace('http://bbs.polchina.com.cn/modcp.php?action=members&op=ban&uid=', '');
    var k = JSON.parse(Storage.getValue('User_Ban_' + uid, '{"op":"s","day":"","reason":""}'));
    if (k.op == 's') {
      $('bannew_4').click();
    } else {
      $('bannew_5').click();
    }
    $('banexpirynew').value = k.day;
    $tg('textarea') [0].value = k.reason;
    try {
      Storage.deleteValue('User_Ban_' + uid);
    } catch (e) {
    }
    return;
  }
  if (!$('nav')) return;
  if ($('nav').innerHTML.indexOf('回收站') + $('nav').innerHTML.indexOf('怀旧服交易区') == - 2) return;
  nowLocation = nowLocation.indexOf('#') > - 1 ? nowLocation.substr(0, nowLocation.indexOf('#'))  : nowLocation;
  nowLocation = nowLocation.indexOf('&') > - 1 ? nowLocation.substr(0, nowLocation.indexOf('&'))  : nowLocation;
  var messageList = $('postlist').childNodes;
  var firstFloor = 1;
  var pagerContainer = $css('pages');
  var nowpage = 1;
  if (pagerContainer.length > 0) {
    nowpage = parseInt(pagerContainer[0].getElementsByTagName('strong') [0].innerHTML, 10);
    firstFloor = (nowpage - 1) * 30 + 1;
  }
  //个性化展示开启

  diydisplay();
  //重置本系统参数
  if (Storage.getValue('nowLocation', '') != nowLocation) {
    Storage.setValue('nowLocation', nowLocation);
    Storage.setValue('AuthorsData', '{}')
  }
  Storage.setValue('nowpage', nowpage);
  if (Storage.getValue('AuthorsData', '{}') == 'undefined') {
    Storage.setValue('AuthorsData', '{}');
  }
  var GMauthorsData = JSON.parse(Storage.getValue('AuthorsData', '{}'));
  GMauthorsData = frequent_check(GMauthorsData);
  Storage.setValue('AuthorsData', JSON.stringify(GMauthorsData));

  var keywordCount = 0;
  var keywordresult = keyword_check();
  //窗口
  var img1 = 'data:image/gif;base64,R0lGODlhBQA3APQAAPz9/sbe8sTd8sbd8sPc8sLc8cLb8cDb8b/a8b3Z8b7Z8bvY8bnX8LrX8LfW8LbV8LXU8LPU8LLT77HS73W612+41kqmzEWjyv///wAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABgALAAAAAAFADcAAAVUICWOZGmeaKqWVeu+VizP9GXfeK7vfF/8P4BQGCgWB8ikUsBkEp7QqGE6PVivWIR2y1V4vYlweEEumxtoNGO9drjf8IdcDqnb7/iIXi/p9yeAgYIhADs=';
  var img2 = 'data:image/gif;base64,R0lGODlhPAA/APYAAAVrk4bL8sLe86TW9CSh5eTy/K7j/WSw4sXr/bTS6zW1843a/pHS77Ha9ES99tXn9ez2/NTu/Mzi9a7d+b/g9X7A5xuP1YvQ7sjf863U7y+w7bvY7kvC+93y/CSq6/D3/Lfo/7vV7ESNriyX2JzX8XHK9zy8+c7w/////5bU7zy7+Nvu+7Ti9Z3S83vK7Cij5muz44bO7UbB+7zm/Kra97rd9cPi96HY8eb0/LTV7/P5/Mnm+tvr+JTQ80S++Y/Q9bzb8v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEEALAAAAAA8AD8AAAf/gCKCg4SFhkGIiYqLjI2OiSI3kpOUlZQij5maj5GWnpWYm6KinZ+moaOpjqWmnqiqsJCtp7G1iKySAJW6oI4oi7+2spQAxZPFvJOviSjNzM7CQbg3yNTGvY3Nv9rRt57I19jZ2sHdIi7o6ejI6urLwNDd0u3r4PQu78/c8uft7Ozt8gXhti+aiBgIESJLuDBhjHwFC2oCsMqhQosALD70BWwUxVUXQoocSXKkQFsUPzISwaCly5cwX56MlZJTips4c+rMOVNVTZWLRJAYSrSo0aI9PQapucqQU6fyfi6VR9UWjBEWsmrdyrWr169gwY6AEQRGhQLk0qpdy7at27QF/ypchfC2rt27aiFg1cG3r9+/gAMLHky4b1YdEBIrXsy4sePHkCND0JH1g+TLmDM7zgqhgOfPoEOLHk26tOkCEDifXs26tejUFiCsmE27tu3buHPr3r0CdgHewIMLv10ga4EIyJMrX868ufPn0CMUt8BDgvXr2LNr385dO4vu2Hlk5YGhvPnz6NOrX8++PQbxFh4ImE+/vv37+PPr3y/gQdYHGwQo4IAEFmjggQgmuIF/FkgQwoMQRijhhBRWaOGFIUiQlQQJdOjhhyCGKOKIJJaYgIYWYGDiiiy2GCIGFozwoIs01hjigyMccMAG4PXo44/cbQDDAUEcgFVYSCappP9XOSJy1ZJQRikWWTC8oIIMWHKg5ZYOdOlllxqEKeaYZJYppgpoernlmiq8cJUJC4CAwAknRGfnnXYiAMICJmAlgwEIRNDBoIQWauihiCaqqKER6ClDVhzMICgOOGhm6aUdRDADB5AiMOiloGrmGQKcWsDBDp+Gqmpknu1QaqQduCbrrKFtCqmksdKqK2uavirpCrsGW9oKvd6K3HDIJlubrRb4MMEOOzwg7bTUVmvttdhOO0O20u4wgQ9Z+UADtECWa652O9AAbrMD2CCAe/DGKy8GNgywrg8DUAAEf/z26y8QFNgbbgs15JADEAgnrPDCDDfs8MMK51BDC+uq0ENiAxlkbPDGHHfs8ccgh8xxBg30oEJWKvxAwgAst+zyyzDHLPPMMv9w8ggKlBBDCzT37PPPLpMQQAkK5EiAAiYkrTSaKijg9NNOeyD11FRXbfXUUDvN9NYKEECkkVKGLXaTgQAAOw==';
  var img3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmFJREFUeNqkU0toU0EUPTN5eUmTl8TGfmykgqLSBopoiS4Uo6Rx04UKiqBCEUEQC2bhxq0Ld4IionEjrUHEjV2IC0VsiCgS6xdUqKWgNjWaNG0+fUneexlnTBNLjCA4cLh37sycOXPvHcIYw/8MqebcO2v6ZU2UwCqjnwB+Pu1cWk7ya6LFMiaMCmtOUBtckE9SPCd6dx/bk/iWahExz6o29cPjG70snbjOp/GmBGq5ThHcsmNo8NmjB5n3b56PiYh307YB386hwdid89ONBLTmyBJBToVANyPWzs+TL7/KEk4LCF/ExJrYI5kIzEuoE7jsQJtTkDClsJClYFpJ4Q8oaUKUVlJzeSrWHDwm4LRVQWpVGD8nndR0bHzxyeja4KH5dI61Sibos3NsbbuLfKlU0DJfYFlvN83ZreQtz/XlxiSuCw6PhnYtqigXiyirHCUVmfQkLDJ8Nisg0KJIGL89cqlpFeLRKCRKIUkSCKEwDB2ZjAoTr7DVzA/LgN1h/nsZfX4/tAYFFjkvFKCm4Nr3gyg5V/QUKxZopfJvAv5+9i8KXi24MWc+snmedh1VjXykTjCTZEZw+E8FN1PbMV3oAE8aODeHin0HAh1XR9+FGM9snWBqhsnNFLxOeLH3+AA+ZnmP6NW9T1NAcH9f/9jIk1CdYDaFlb5AAEZZg84V6FyBzhWsn0ribvgWJ6wqEDYXPIyH4fsThNKL9T441Eeu8Lqv4Yn64XaRgrsVVLHDEYuz1aKVxB5+FtGeC1sNalksWtrP2BQlsrwKp5p91+W/Xbhp3RXmJmYxVyIi9lOAAQBLvBDiMOy+fQAAAABJRU5ErkJggg==';
  var img4 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADv0lEQVR4nAXBX0wbdQAH8O/9+/Wu9A9XelAClBUYmY5NMaBS/m6AjoQMRgImPrg9qHGKD/KkD3vwTwwx/vfNkBjiMmfiEscyXfSBGGboqCBEJqVz/CntWAttr3+gvTvuzs+Hmp6eBs/zkGW5T1GUzwH4ACyKovhxWVnZbzRNwzAMKIoCRVHAMAySyeRFVVV7ysvLJ1lBEEAIgaIoYy0tLaeam5sRjUa75+fnu2Ox2JXaWu9HpgkAgKqq7OHh4dc2m+1yQ0M9FhaCPtowDHc+n3vO5/N9tbi4+DgUCqG6uhqDg4MoFosThVyOhaqCUhUcHBy8I0nuy8PDw5DlDAgh83QikbhhGGYgEY+PS6LYOzc3t7m/vweet8Bms4kHcqYG+TwSydRLHMd90tbWhqWlJYTD4X/sdtv7NAD/hQvDKHO730ikUl8yDOPkOA6apqFQKIA6UtMxOTNKE3J9YOAcgsEglpeXb7tcrlFCLEUWwIYsy41dXZ3Y2truLy11gmVZqKqKSknCzu7uLUEQ/Ode6Ecw+Bcikcg1yeG4RHheM0wTNE9RU3fv/glNVVHrrYHT4YBh6AiPj4OMvwX3zExHb1cnvbi0hEgkcq3Cwl0SOFYDBZimAerOZ58iSjMfKoS87XK5nPlUChWBAKgbP6H12/ewdfVXxIoWxEZGCiKNZ508v0rZ7DB4HqqmgSaZNBrTe1caUvEq/DHbI05OznmS2zj+2ghYlkHjxBhKwvfxtKdCkE3q98yRfppmGLAsC8JxoJnUPmg5CX5lRS/5bnrC2+TrtB2rAmeYyIUjCLz8AQyaoOrkE+ho93uyujH7KJXuoSgKLMeBplJ70ELrfObWnR89Z58/bz9WDZIvIhONo7Av41DyoGrmJnSWQYmVR3dnh0s3zV9isUejpmmCecXK87l7f1+v7PMPOeu9IEUNmXQKfI2E/6ZuPi4MnX9zXdE6ytzuEgshoCigvr6O29mJjmaz2Thd3Ii8W/li55B4+gQEg0JWlmGtrcDDqZm482zHGa+NfO/Ly92BwMJufC8Ji8WC1dX76OvvhaYdTdJaNn/S3d4M14k6ZA5yEGor8GDq57iz7ZkzTLkU0kFBoKg1L2Fbl5dX/n24uY2mpiYUCgXouq4yrzbUbiVm710U/U8xoEysf/NDvLT5yTOsJK5pYKARHrrNAcbhyPF2+9XNnWhrWk7XhULrGYuFjFHBgW7kNnba81uxLwAo4qnjr/Meae0IFA4pFgXJA91XB1TVAKWlMGkaspzxWwXhgbXEuvc/6bindNaZ5xwAAAAASUVORK5CYII=';
  var img5 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH1gUIAgUGknd3EwAAAwBJREFUaIHtmEtIVFEch7/zv5PjDGlJJkKJhZNoZTEaOkUMtLCiBLE2tmsWgUTUhNBDRUgMXJQmLYJeFlSzijYGiS0KIQoKbFUoWdA6Kq2JoLwt0lnIPO4ZZ+ZK3W8zl3se8/04c//nzgEHBwcHh/8Zw24BCwjQDVQBr2x20caD4j5gArN2y+hSrAz1XIma5W+AMbuFdPCJyDtX3rLfx66cMjdsq04YQHIsZoWAGPLCU+gtP32vR2p3NyTt7MqRlFValKjIqjWrXe23uo2S8tKUA5ZSgBNKqf71W3yEr3fI8qJCS4OWQgABLgLh2t0N5pH+EyovP8/yYLsDeFDcweRAY6iJ1o7DSonSmsDOAMXKUMOY1Ld2hWg8vD+tSewK4BORETGMdW2DJ1WqSpMMOwIExJCHngLvivD1TqnwVy5qslwH0C6TAJMv3yRsy2WAtMpkpHdo/vJRvHa9Rz49YmWybk9Aq0xGeocYHRoGuAScjNdHN0Dn3Od5i/0Xlkmslkkr8qD3ExoAwnPXxckmne+Tbpm0Kg/W/9AMAOHGUBMV/kqmxicCwEpgJEF/n4g8NVyuTUcvt8vOg7usumvJg7UViMkf6grFbo4ODc+vxsIvSbtM6spD6hWIK18T9BOdicZbiRYlarh4bYn3TKTXKKsqz6p8qgBx5ZOEqFJK3Vi/1WecvnvOKCpdlXX5ZAE6gY5E8vMsCLG3bk+A41fPiqfAa1lgMfKQgY3sUFeIgqJCZj5Pa79NLlYeEq/AGLByanwiEJ2JUhP0J52ksn4jNUE/SuVWHpI/AyNohNAhU/KQugplPEQm5cHaRpaxEJmWB+s78aJDZEMe9M5G0w6RLXnQP9zVDpFNeUjvdDoW4vuXb2xOUD7NWZNIz00e334IWZKH9I/XR4DlU68nd3x8+8Gs3l6j3N78WOP0p69cax80nz14ooALQHsGXLNCm4j8cHvcvwLNQXNfW4sZaA6abo/7l4j8ANrsFrRCGdAnhvFeifophvEe6Ju77+Dg4PCP8wfi9jGtoOQLYgAAAABJRU5ErkJggg=='
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML =
  '.dialogcontainter{height:400px; width:400px; border:1px solid #14495f; position:fixed; font-size:13px;}\n' +
  '.dialogtitle{height:26px; width:auto; background-image:url(' + img1 + ');}\n' +
  '.dialogtitleinfo{float:left;height:20px; margin-top:2px; margin-left:10px;line-height:20px; vertical-align:middle; color:#FFFFFF; font-weight:bold; }\n' +
  '.dialogtitleico{float:right; height:20px;  width:21px; margin-top:2px; margin-right:5px;text-align:left; line-height:20px; vertical-align:middle; background-image:url(' + img2 + ');background-position:-21px 0px}\n' +
  '.dialogbody{ padding:10px; width:auto; background-color: #FFFFFF;text-align:left;over-flow:auto;-moz-user-select:none;-webkit-user-select:none;-khtml-user-select:none }\n' +
  '.dialogbottom{bottom:1px; right:1px;cursor:nw-resize;position:absolute;background-image:url(' + img2 + ');background-position:-42px -10px;width:10px;height:10px;font-size:0;}';
  document.getElementsByTagName('HEAD').item(0).appendChild(style);
  var Extend = function (destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
  }
  var Bind = function (object, fun, args) {
    return function () {
      return fun.apply(object, args || []);
    }
  }
  var BindAsEventListener = function (object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function (event) {
      return fun.apply(object, [
        event || window.event
      ].concat(args));
    }
  }
  var CurrentStyle = function (element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
  }
  function create(elm, parent, fn) {
    var element = document.createElement(elm);
    fn && fn(element);
    parent && parent.appendChild(element);
    return element
  };
  function addListener(element, e, fn) {
    element.addEventListener ? element.addEventListener(e, fn, false)  : element.attachEvent('on' + e, fn)
  };
  function removeListener(element, e, fn) {
    element.removeEventListener ? element.removeEventListener(e, fn, false)  : element.detachEvent('on' + e, fn)
  };
  var Class = function (properties) {
    var _class = function () {
      return (arguments[0] !== null && this.initialize && typeof (this.initialize) == 'function') ? this.initialize.apply(this, arguments)  : this;
    };
    _class.prototype = properties;
    return _class;
  };
  var Dialog = new Class({
    options: {
      Width: Storage.getValue('width', 350),
      Height: Storage.getValue('height', 200),
      Left: Storage.getValue('left', 100),
      Top: Storage.getValue('top', 100),
      Titleheight: 26,
      Minwidth: 350,
      Minheight: 200,
      CancelIco: true,
      ResizeIco: true,
      Info: '',
      Content: '',
      Zindex: 2
    },
    initialize: function (options) {
      this._dragobj = null;
      this._resize = null;
      this._cancel = null;
      this._body = null;
      this._x = 0;
      this._y = 0;
      this._fM = BindAsEventListener(this, this.Move);
      this._fS = Bind(this, this.Stop);
      this._isdrag = null;
      this._Css = null;
      this.Width = this.options.Width;
      this.Height = this.options.Height;
      this.Left = this.options.Left;
      this.Top = this.options.Top;
      this.CancelIco = this.options.CancelIco;
      this.Info = this.options.Info;
      this.Content = this.options.Content;
      this.Minwidth = this.options.Minwidth;
      this.Minheight = this.options.Minheight;
      this.Titleheight = this.options.Titleheight;
      this.Zindex = this.options.Zindex;
      Extend(this, options);
      Dialog.Zindex = this.Zindex
      //构造dialog
      var obj = [
        'dialogcontainter',
        'dialogtitle',
        'dialogtitleinfo',
        'dialogtitleico',
        'dialogbody',
        'dialogbottom'
      ];
      for (var i = 0; i < obj.length; i++)
      {
        obj[i] = create('div', null, function (elm) {
          elm.className = obj[i];
        });
      }
      obj[2].innerHTML = this.Info;
      obj[4].innerHTML = this.Content;
      obj[1].appendChild(obj[2]);
      obj[1].appendChild(obj[3]);
      obj[0].appendChild(obj[1]);
      obj[0].appendChild(obj[4]);
      obj[0].appendChild(obj[5]);
      document.body.appendChild(obj[0]);
      this._dragobj = obj[0];
      this._resize = obj[5];
      this._cancel = obj[3];
      this._body = obj[4];
      ///o,x1,x2
      ////设置Dialog的长 宽 ,left ,top
      with (this._dragobj.style) {
        height = this.Height + 'px';
        top = this.Top + 'px';
        width = this.Width + 'px';
        left = this.Left + 'px';
        zIndex = this.Zindex;
      }
      this._body.style.height = this.Height - this.Titleheight - parseInt(CurrentStyle(this._body).paddingLeft) * 2 + 'px';
      ///////////////////////////////////////////////////////////////////////////////   添加事件 
      addListener(this._dragobj, 'mousedown', BindAsEventListener(this, this.Start, true));
      addListener(this._cancel, 'mouseover', Bind(this, this.Changebg, [
        this._cancel,
        '0px 0px',
        '-21px 0px'
      ]));
      addListener(this._cancel, 'mouseout', Bind(this, this.Changebg, [
        this._cancel,
        '0px 0px',
        '-21px 0px'
      ]));
      addListener(this._cancel, 'mousedown', BindAsEventListener(this, this.Disappear));
      addListener(this._body, 'mousedown', BindAsEventListener(this, this.Cancelbubble));
      addListener(this._resize, 'mousedown', BindAsEventListener(this, this.Start, false));
    },
    Disappear: function (e) {
      this.Cancelbubble(e);
      document.body.removeChild(this._dragobj);
    },
    Cancelbubble: function (e) {
      this._dragobj.style.zIndex = ++Dialog.Zindex;
      document.all ? (e.cancelBubble = true)  : (e.stopPropagation())
    },
    Changebg: function (o, x1, x2) {
      o.style.backgroundPosition = (o.style.backgroundPosition == x1) ? x2 : x1;
    },
    Start: function (e, isdrag) {
      if (!isdrag) {
        this.Cancelbubble(e);
      }
      this._Css = isdrag ? {
        x: 'left',
        y: 'top'
      }
       : {
        x: 'width',
        y: 'height'
      }
      this._dragobj.style.zIndex = ++Dialog.Zindex;
      this._isdrag = isdrag;
      this._x = isdrag ? (e.clientX - this._dragobj.offsetLeft || 0)  : (this._dragobj.offsetLeft || 0);
      this._y = isdrag ? (e.clientY - this._dragobj.offsetTop || 0)  : (this._dragobj.offsetTop || 0);
      e.preventDefault();
      addListener(window, 'blur', this._fS);
      addListener(document, 'mousemove', this._fM)
      addListener(document, 'mouseup', this._fS)
    },
    Move: function (e) {
      window.getSelection ? window.getSelection().removeAllRanges()  : document.selection.empty();
      var i_x = e.clientX - this._x,
      i_y = e.clientY - this._y;
      Storage.setValue(this._Css.x, (this._isdrag ? Math.max(i_x, 0)  : Math.max(i_x, this.Minwidth)));
      Storage.setValue(this._Css.y, (this._isdrag ? Math.max(i_y, 0)  : Math.max(i_y, this.Minheight)));
      this._dragobj.style[this._Css.x] = Storage.getValue(this._Css.x) + 'px';
      this._dragobj.style[this._Css.y] = Storage.getValue(this._Css.y) + 'px';
      if (!this._isdrag)
      this._body.style.height = Math.max(i_y - this.Titleheight, this.Minheight - this.Titleheight) - 2 * parseInt(CurrentStyle(this._body).paddingLeft) + 'px';
    },
    Stop: function () {
      removeListener(document, 'mousemove', this._fM);
      removeListener(document, 'mouseup', this._fS);
      removeListener(window, 'blur', this._fS);
    }
  });
  var display = frequent_display(GMauthorsData);
  if (display != '') {
    display = '<b>频顶统计:</b><br/>' + display;
  }
  if (display != '' && keywordresult != '') {
    display += '—————————————————————<br/>';
  }
  if (keywordresult != '') {
    display += '<b>关键字统计:</b><br/>' + keywordresult;
  }
  if (display == '') {
    display = '<table style="height:100%;width:100%;"><tr><td><img src="' + img5 + '"></td><td style="font-size:20px;color:green;" >本页未发现违规内容。</td></tr></table>';
  }
  var tid = nowLocation.substr(nowLocation.indexOf('=') + 1);
  var tidpage = '[' + tid + '#' + nowpage + ']';
  new Dialog({
    Info: '<span style="color:black;background-image:url(' + img4 + ');padding:0px 0px 0px 20px;background-position:1px 1px; background-repeat:no-repeat;" >管理操作提示</span> - <a href="javascript:void(0);"><span id="diynotice" style="color:white">DIY设置</span></a>',
    Content: display
  });
  noticeout_provider();
  var Xoutput = '';
  Xoutput += '[b]用户名：[/b] [url=http://bbs.polchina.com.cn/space.php?uid={x_uid}][b]{x_username}[/b][/url]'; // uid username
  Xoutput += '\n[b]帖子地址：[/b] [url={x_location}][b]{x_address}[/b][/url]';
  Xoutput += '\n[b]违规内容：[/b] [b][color=Red]{x_illegal}[/color][/b]';
  Xoutput += '\n[b]处罚内容：[/b] [b][color=Red]{x_discipline}[/color][/b]';
  Xoutput += '\n[b]详细内容：[/b]###{x_count}次 {x_floor}楼###';
  //公告输出模块
  function noticeout_provider() {
    for (var i = 0; i < messageList.length; i++) {
      var thisFloorHref = '#' + messageList[i].getElementsByTagName('table') [0].id;
      var hreftag = messageList[i].getElementsByClassName('postinfo') [0].getElementsByTagName('a') [0];
      var uid = hreftag.href.toString();
      uid = uid.substr(uid.indexOf('uid=') + 4);
      messageList[i].getElementsByClassName('pagecontrol') [0].innerHTML = '<a class="right" style="color:black;background-image:url(' + img3 +
      ');padding:0px 0px 0px 20px;background-position:0px 10px; background-repeat:no-repeat;" href="javascript:void(0);">复制违规内容</a>';
      var noticeout_button = messageList[i].getElementsByClassName('pagecontrol') [0].getElementsByTagName('a') [0];
      addListener(noticeout_button, 'click', Bind(noticeout_button, noticeout, [
        uid,
        thisFloorHref
      ]));
    }
  }
  function noticeout(uid, thisFloorHref) {
    Storage.setValue('nowuid', uid);
    Storage.setValue('floor', thisFloorHref);
    unsafeWindow['floatwin']('open_noticeedit', - 1, 640, 385);
    $('floatwin_noticeedit_title').innerHTML = '<span style="color:black;background-image:url(' + img3 +
    ');padding:0px 0px 0px 20px;background-position:1px 1px; background-repeat:no-repeat;">复制违规内容</span>';
    str = '<div><p style="text-align:left;margin:0px 0px 10px 20px;">违规内容 ：' +
    '<input name="wg" count="A"  type="radio" class="illegal_cb" value="频顶违规" />频顶违规 &nbsp;' +
    '<input name="wg" count="60" type="radio" class="illegal_cb" value="删贴频顶" />删贴频顶 &nbsp;' +
    '<input name="wg" count="A" type="radio" class="illegal_cb" value="马甲频顶" />马甲频顶 &nbsp;' +
    '<input name="wg" count="7" type="radio" class="illegal_cb" value="无价出售" />无价出售 &nbsp;' +
    '<input name="wg" count="7" type="radio" class="illegal_cb" value="发布群号" />发布群号 &nbsp;' +
    '<input name="wg" count="Z" type="radio" class="illegal_cb" value="R交易" />R交易</p>' +
    '<p style="text-align:left;margin:0px 0px 10px 20px;">' +
    '处罚决定：<input id="cf_1" name="cf" type="radio" value="禁言1天" class="discipline_rb" checked="checked">禁言1天' +
    '<input id="cf_7" name="cf" type="radio" value="禁言7天" class="discipline_rb"  />禁言7天' +
    '<input id="cf_30" name="cf" type="radio" value="禁言30天" class="discipline_rb" />禁言30天' +
    '<input id="cf_60" name="cf" type="radio" value="禁言60天" class="discipline_rb" />禁言60天' +
    '<input id="cf_Y" name="cf" type="radio" value="永久禁言" class="discipline_rb" />永久禁言' +
    '<input id="cf_Z" name="cf" type="radio" value="禁止访问" class="discipline_rb" />禁止访问</p>' +
    '<input id="readyoutput" type="hidden" ><input id="readyuid" type="hidden" ><input id="readyforsubjet" type="hidden" ><div id="floatwin_noticeedit_content2" style="border-color: #999999 #CCCCCC #CCCCCC #999999;border-style: solid;border-width:1px;margin-left:20px;margin-right:20px"></div></div><input class="readypost" type="button" value="复制并发帖" style="margin-top:5px;">';
     $('floatwin_noticeedit_content').innerHTML = str;
   
    var illegal_cb_list = $('floatwin_noticeedit_content').getElementsByClassName('illegal_cb');
    var discipline_rb_list = $('floatwin_noticeedit_content').getElementsByClassName('discipline_rb');  
    for (var i = 0; i < illegal_cb_list.length; i++) {
      var the_button = illegal_cb_list[i];
      addListener(the_button, 'click', Bind(the_button, editnotice, [
        the_button.attributes.count.value
      ]));
    }
    for (var i = 0; i < discipline_rb_list.length; i++) {
      var the_button = discipline_rb_list[i];
      addListener(the_button, 'click', Bind(the_button, editnotice, []));
    }
    
    var readypost_button = $('floatwin_noticeedit_content').getElementsByClassName('readypost')[0]; 
    addListener(readypost_button, 'click', Bind(readypost_button, readypost, []));

    var editbox = document.createElement('iframe');
    $('floatwin_noticeedit_content2').appendChild(editbox);
    editbox.id = 'preview_box';
    editbox.style.width = '585px';
    editbox.style.height = '230px';
    editbox.style.padding = '5px';
    editbox.style.border = '0px';
    editbox.style.backgroundColor = 'white';
    var editwin = editbox.contentWindow;
    var editdoc = editwin.document;
    editdoc.open('text/html', 'replace');
    editdoc.write('<br>');
    editdoc.close();
    editdoc.firstChild.style.background = 'none';
    editdoc.body.style.textAlign = 'left';
    editdoc.body.id = 'wysiwyg';
    var headNode = editdoc.getElementsByTagName('head') [0];
    if (!headNode.getElementsByTagName('link').length) {
      var editcss = editdoc.createElement('link');
      editcss.type = 'text/css';
      editcss.rel = 'stylesheet';
      editcss.href = 'http://bbs.polchina.com.cn/forumdata/cache/style_1_common.css';
      headNode.appendChild(editcss);
    }
     
  }
  
  function editnotice(arg) {
    var GMauthorsData = JSON.parse(Storage.getValue('AuthorsData', '{}'));
    var uid = Storage.getValue('nowuid');
    var username = GMauthorsData[uid].authorName;
   
    var locout = Storage.getValue('nowLocation', '');
    var location = Storage.getValue('nowLocation', '') + '&page=' + Storage.getValue('nowpage', '') + Storage.getValue('floor', '');
    var illegal = '';
    var kf = document.getElementsByClassName('illegal_cb');
    
    for (i = 0; i < kf.length; i++) {
      if (kf[i].checked) illegal += kf[i].value + ' ';
    }
    if (typeof arg != 'undefined') {
      if (arg != 'A') {
        document.getElementById('cf_' + arg).click();
      } else {
        var pdcount = GMauthorsData[uid].count + GMauthorsData[uid].igcount;
        if (pdcount < 7) {
          document.getElementById('cf_1').click();
        } else if (pdcount < 21) {
          document.getElementById('cf_7').click();
        } else {
          document.getElementById('cf_30').click();
        }
      }
      return;
    }
    
    var x_count = 0;
    var x_floors = '';
    if (illegal.indexOf('频顶违规') > - 1) {
      x_count = (GMauthorsData[uid].count + GMauthorsData[uid].igcount);
      x_floors = GMauthorsData[uid].frequentFloor.replace(/\]\[/g, ' ').replace(/[\]\[]/g, '');
    }
    var discipline = '';
    kf = document.getElementsByClassName('discipline_rb');
    for (i = 0; i < kf.length; i++) {
      if (kf[i].checked) discipline += kf[i].value;
    }

    var output = Storage.getValue('DIYNotice', Xoutput);
    output = output.replace('{x_uid}', uid);
    output = output.replace('{x_username}', username);
    output = output.replace('{x_location}', location);
    output = output.replace('{x_address}', locout);
    output = output.replace('{x_illegal}', illegal);
    output = output.replace('{x_discipline}', discipline);
    output = output.replace('{x_count}', x_count);
    output = output.replace('{x_floor}', x_floors);
    if (illegal.indexOf('频顶违规') > - 1) {
      output = output.replace(/###/g, '');
    } else {
      output = output.replace(/###[\s\S]+###/g, '');
    }
    var windoc = document.getElementById('preview_box').contentWindow.document.body;
    windoc.innerHTML = bbcode2html(output);
    document.getElementById('readyuid').value = uid;
    document.getElementById('readyoutput').value = output;
    document.getElementById('readyforsubjet').value = 'ID：' + GMauthorsData[uid].authorName + ' ' + discipline;
    var y_discipl = (discipline.indexOf('访') > - 1) ? 'p' : 's';
    var y_day = (discipline.indexOf('访') > - 1) ? '' : discipline.replace('禁言', '').replace('天', '');
    var y_bean = {
      'op': y_discipl,
      'day': y_day,
      'reason': illegal + ' ' + discipline + '\n' + location
    };
    Storage.setValue('User_Ban_' + uid, JSON.stringify(y_bean));
  }
  
  function readypost() {
    unsafeWindow['floatwin']('close_noticeedit');
    var readyforsubjet = document.getElementById('readyforsubjet').value;
    var readyoutput = document.getElementById('readyoutput').value;
    var readyuid = document.getElementById('readyuid').value;
    unsafeWindow['floatwin']('open_newthread', 'post.php?action=newthread&fid=240', 600, 410, '600,0');
    setTimeout(function () {
      document.getElementById('subject').value = readyforsubjet;
      unsafeWindow['switchEditor'](0);
      unsafeWindow['loadselect_liset']('typeid', 0, 'typeid', '27', '怀旧交易', 1);
      document.getElementById('e_textarea').value = readyoutput;
      document.getElementById('postsubmit').addEventListener('click', function () {
        GM_openInTab('http://bbs.polchina.com.cn/modcp.php?action=members&op=ban&uid=' + readyuid);
      }, false);
    }, 2000);
  }
  

  var diynotice_button = $('diynotice');
  addListener(diynotice_button, 'click', Bind(diynotice_button, diy_notice, []));

  function diy_notice(arg, arg2) {
      if (typeof arg != 'undefined') {
        log(arg2.checked);
        var valuereal = arg2.checked?"1":"0";
        switch (arg) {
          case "1": //x_close_userdata
            Storage.setValue('x_close_userdata', valuereal);
            break;
          case "2": //x_close_sign
            Storage.setValue('x_close_sign', valuereal);
            break;
          case "3": //x_close_minwidth
            Storage.setValue('x_close_minwidth',valuereal);
            break;
          case "4": //x_close_br
            Storage.setValue('x_close_br', valuereal);
            break;
          case "5": //x_close_br
            Storage.setValue('x_close_font', valuereal);
            break;
          case "6": //x_close_br
            Storage.setValue('x_close_hour', valuereal);
            break;
          case "7":
            Storage.setValue('DIYNotice', $('diy_box').value);
            break;
          default:
        }
      
        return;
      }
      unsafeWindow['floatwin']('open_noticediy', - 1, 640, 380);
      $('floatwin_noticediy_title').innerHTML = '<span style="color:black;background-image:url(' + img3 +
      ');padding:0px 0px 0px 20px;background-position:1px 1px; background-repeat:no-repeat;">个性化设置</span>';
      str = '<div><p style="text-align:left;margin:0px 0px 10px 20px;">' +
      '<input rel="1" type="checkbox" ' + (Storage.getValue('x_close_userdata', "0") =="1" ? 'checked="checked"' : '') + ' />关闭用户信息' +
      '<input rel="2" type="checkbox" ' + (Storage.getValue('x_close_sign', "0") =="1" ? 'checked="checked"' : '') + ' />关闭用户签名' +
      '<input rel="3" type="checkbox" ' + (Storage.getValue('x_close_minwidth', "0") =="1" ? 'checked="checked"' : '') + ' />关闭最小高度' +
      '<input rel="4" type="checkbox" ' + (Storage.getValue('x_close_br', "0") =="1" ? 'checked="checked"' : '') + ' />删除多余空行' +
      '<input rel="5" type="checkbox" ' + (Storage.getValue('x_close_font', "0") =="1" ? 'checked="checked"' : '') + ' />清理字体格式' +
      '<input rel="6" type="checkbox" ' + (Storage.getValue('x_close_hour', "0") =="1" ? 'checked="checked"' : '') + ' />时间直接显示' +
      '<p style="text-align:left;margin:0px 0px 10px 20px;">' +
      '公告自定义格式：<textarea id="diy_box" style="width:600px;height:230px"></textarea></div><input rel="7" type="button" value="保存自定义公告结果">';
    
      $('floatwin_noticediy_content').innerHTML = str;
      var inputs = $('floatwin_noticediy_content').getElementsByTagName("input");
      
      for (var i = 0; i < inputs.length; i++) {
        var the_button = inputs[i];
        addListener(the_button, 'click', Bind(the_button, diy_notice, [
          the_button.attributes.rel.value,the_button
        ]));
     }
    
    
      $('diy_box').value = Storage.getValue('DIYNotice', Xoutput);
  }
  //个性化缩减程序

  function diydisplay() {
    if (Storage.getValue('x_close_userdata', "0")=="1") {
      var k1 = document.getElementsByClassName('avatar');
      for (var i = 0; i < k1.length; i++) {
        try {
          var node = k1[i].nextSibling.nextSibling;
          node.style.display = 'none';
          node = node.parentElement.nextSibling.nextSibling;
          node.style.display = 'none';
          node = node.nextSibling.nextSibling;
          node.style.display = 'none';
        } catch (e) {
        }
      }
    }
    if (Storage.getValue('x_close_sign', "0")=="1") {
      var k2 = document.getElementsByClassName('signatures');
      for (var j = 0; j < k2.length; j++) {
        try {
          k2[j].style.display = 'none';
        } catch (e) {
        }
      }
    }
    if (Storage.getValue('x_close_minwidth', "0")=="1") {
      var node = document.getElementsByClassName('defaultpost') [0];
      while (node != null) {
        node.className = '';
        node = document.getElementsByClassName('defaultpost') [0];
      }
    }
    if (Storage.getValue('x_close_font', "0")=="1") {
      var k3 = document.getElementsByClassName('t_msgfont');
      for (var k = 0; k < k3.length; k++) {
        var node1 = k3[k];
        node1.innerHTML = node1.innerHTML.replace(/(<font[\s\S]+?>|<\/font>)/g, '');
      }
    }
    if (Storage.getValue('x_close_br', "0")=="1") {
      var k3 = document.getElementsByClassName('t_msgfont');
      for (var k = 0; k < k3.length; k++) {
        var node1 = k3[k];
        while (node1.innerHTML.indexOf('<br>\n<br>') > - 1) {
          node1.innerHTML = node1.innerHTML.replace(/<br>\n<br>/g, '<br>');
        }
      }
    }
    if (Storage.getValue('x_close_hour', "0")=="1") {
      for (var i = 0; i < messageList.length; i++) {
        var timetag = messageList[i].getElementsByClassName('authorinfo') [0].getElementsByTagName('em') [0];
        var spantag = timetag.getElementsByTagName('span');
        if (spantag.length > 0) {
          timetag.innerHTML = '发表于 ' + spantag[0].title;
        }
      }
    }
  }
  //频顶检查输出

  function frequent_display(authorsData) {
    var outputk = '';
    for (var prop in authorsData) {
      if (authorsData[prop].frequentHTML != '') {
        outputk += '&nbsp;<a href="' + '">' + authorsData[prop].authorName + '(' + (authorsData[prop].count + authorsData[prop].igcount) + ')</a>: '
        + authorsData[prop].frequentHTML + '<br/>';
      }
    }
    return outputk;
  }
  //频顶检查插件

  function frequent_check(authorsData) {
    for (var prop in authorsData) {
      authorsData[prop].frequentHTML = '';
      authorsData[prop].prevTime = '';
    }
    for (var i = 0; i < messageList.length; i++) {
      var hreftag = messageList[i].getElementsByClassName('postinfo') [0].getElementsByTagName('a') [0];
      var uid = hreftag.href.toString();
      uid = uid.substr(uid.indexOf('uid=') + 4);
      if (!authorsData[uid]) {
        authorsData[uid] = new Object();
        authorsData[uid].authorName = hreftag.innerHTML;
        authorsData[uid].count = 0;
        authorsData[uid].igcount = 0;
        authorsData[uid].frequentFloor = '';
        authorsData[uid].frequentHTML = '';
        authorsData[uid].prevTime = '';
      }
      var thisFloorHref = '#' + messageList[i].getElementsByTagName('table') [0].id;
      var nowFloor = firstFloor + i;
      var timetag = messageList[i].getElementsByClassName('authorinfo') [0].getElementsByTagName('em') [0];
      var spantag = timetag.getElementsByTagName('span');
      var nowTime = (spantag.length > 0) ? spantag[0].title : timetag.innerHTML.replace('发表于 ', '');
      if (firstFloor > 1 && authorsData[uid].nowfirstFloor != firstFloor) {
        if (authorsData[uid][firstFloor - 30]) {
          authorsData[uid].prevTime = authorsData[uid][firstFloor - 30];
        }
      }
      if (authorsData[uid].prevTime != '') {
        var timeDiff = getTimeDiff(authorsData[uid].prevTime, nowTime);
        var newhreftag = '|';
        if (timeDiff > 3 && timeDiff < 110 && nowFloor > 2) {
          newhreftag += '<a href="javascript:void(0);" style="color:red;background-color:yellow">距上次回复 ' + getTimerString(timeDiff) + '</a>';
          if (authorsData[uid].frequentFloor.indexOf('[' + nowFloor + ']') < 0) {
            authorsData[uid].count++;
            authorsData[uid].frequentFloor += '[' + nowFloor + ']';
          }
          authorsData[uid].frequentHTML += '<a title="距上次回复' + getTimerString(timeDiff) + '" href="' + thisFloorHref + '">' + nowFloor + '<sup>#</sup></a> ';
        } else if ((timeDiff >= 110 && timeDiff < 120 && nowFloor > 2) || (timeDiff > - 1 && timeDiff <= 3 && nowFloor > 2)) {
          var thisFloorHref = '#' + messageList[i].getElementsByTagName('table') [0].id;
          newhreftag += '<a href="javascript:void(0);" style="color:red;background-color:yellow">距上次回复 ' + getTimerString(timeDiff) + '</a>';
          if (authorsData[uid].frequentFloor.indexOf('[' + nowFloor + ']') < 0) {
            authorsData[uid].igcount++;
            authorsData[uid].frequentFloor += '[' + nowFloor + ']';
          }
          authorsData[uid].frequentHTML += '<a style="color:#808080" title="距上次回复' + getTimerString(timeDiff) + '" href="' + thisFloorHref + '">' + nowFloor + '<sup>#</sup></a> ';
        } else if (timeDiff == - 1) {
          newhreftag += '<a href="javascript:void(0);" style="background-color:#EBF2F8">过期忽略检查</a>';
        } else {
          newhreftag += '<a href="javascript:void(0);">距上次回复 ' + getTimerString(timeDiff) + '</a>';
        }
        messageList[i].getElementsByClassName('authorinfo') [0].innerHTML += newhreftag;
      } else {
        var newhreftag = '|<a href="javascript:void(0);" style="background-color:#EBF2F8">第一次回复</a>';
        messageList[i].getElementsByClassName('authorinfo') [0].innerHTML += newhreftag;
      }
      authorsData[uid].nowfirstFloor = firstFloor;
      authorsData[uid][firstFloor] = nowTime;
      authorsData[uid].prevTime = nowTime;
    }
    return authorsData;
  }
  function keyword_check() {
    var result = '';
    if ($('threadtitle') && $('threadtitle').innerHTML.indexOf('出售') > - 1) {
      var ahrefcnt = 0;
      for (var i = 0; i < messageList.length; i++) {
        var theitem = messageList[i].getElementsByClassName('postmessage') [0];
        var thereturn = keywordCheck(theitem);
        if (thereturn) {
          if (result != '') {
            result = result + ', ';
          }
          var thehref = '#' + messageList[i].getElementsByTagName('table') [0].id;
          result += '<a href="' + thehref + '">' + (firstFloor + i) + '<sup>#</sup></a>(' + thereturn + ')';
        }
      }
    }
    return result;
  }
  // 内置函数区域

  function keywordCheck(test) {
    var dirctory = [
      'tb',
      'taobao',
      'rmb',
      '带价',
      '点卡',
      '淘宝',
      '挂个',
      '代练',
      '带价格',
      '标价',
      '1MB',
      '代价',
      '账号',
      '号',
      '留价',
      '带上价格',
      '现金',
      '0R',
      'R交易'
    ];
    var result = '';
    for (var k = 0; k < dirctory.length; k++) {
      var text = test.innerHTML.replace(/<.*?>/g, '');
      if (text.indexOf(dirctory[k]) != - 1) {
        var re = new RegExp(dirctory[k], 'gi');
        test.innerHTML = test.innerHTML.replace(re, '<a name="keyword_e' + keywordCount + '" style="background-color:red;color:yellow;">' + dirctory[k] + '</a>');
        result = result + '[<a href="#keyword_e' + keywordCount + '">' + dirctory[k] + '</a>]';
        keywordCount++;
      }
    }
    if (result == '') {
      return false;
    } else {
      return result;
    }
  }
  function getTimeDiff(t1, t2) {
    var s1 = t1.split(' ') [0];
    var s2 = t2.split(' ') [0];
    s1 = s1.replace(/-/g, '/');
    s2 = s2.replace(/-/g, '/');
    s1 = new Date(s1);
    s2 = new Date(s2);
    var s3 = parseInt((new Date().getTime() - s2.getTime()) / (1000 * 60 * 60 * 24), 10);
    if (s3 > 30) {
      return - 1;
    }
    var time = s2.getTime() - s1.getTime();
    var days = parseInt(time / (1000 * 60 * 60 * 24), 10);
    var ts1 = t1.split(' ') [1].split(':');
    var ts2 = t2.split(' ') [1].split(':');
    if (days == 0) {
      return parseInt(ts2[1], 10) + parseInt(ts2[0], 10) * 60 - parseInt(ts1[0], 10) * 60 - parseInt(ts1[1], 10);
    } else {
      return parseInt(ts2[1], 10) + (parseInt(ts2[0], 10) + 24 * (days - 1)) * 60 + (23 - parseInt(ts1[0], 10)) * 60 + (60 - parseInt(ts1[1], 10))
    }
  }
  function getTimerString(t) {
    var result = '';
    if (t >= 60 * 24) {
      result = parseInt(t / 60 / 24, 10) + '天';
      t = t - parseInt(t / 60 / 24, 10) * 60 * 24;
    }
    if (t >= 60) {
      result = result + parseInt(t / 60, 10) + '小时';
      t = t - parseInt(t / 60, 10) * 60;
    }
    if (t != 0) {
      result = result + parseInt(t, 10) + '分钟';
    }
    if (result == '') {
      result = '小于1分钟'
    }
    return result;
  }
  function bbcode2html(str) {
    str = str.replace(/\[url\]\s*(www.|https?:\/\/|ftp:\/\/|gopher:\/\/|news:\/\/|telnet:\/\/|rtsp:\/\/|mms:\/\/|callto:\/\/|bctp:\/\/|ed2k:\/\/){1}([^\[\"']+?)\s*\[\/url\]/gi, function ($1, $2, $3) {
      return cuturl($2 + $3);
    });
    str = str.replace(/\[url=www.([^\[\"']+?)\](.+?)\[\/url\]/gi, '<a href="http://www.$1" target="_blank">$2</a>');
    str = str.replace(/\[url=(https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k){1}:\/\/([^\[\"']+?)\]([\s\S]+?)\[\/url\]/gi, '<a href="$1://$2" target="_blank">$3</a>');
    str = str.replace(/\[email\](.*?)\[\/email\]/gi, '<a href="mailto:$1">$1</a>');
    str = str.replace(/\[email=(.[^\[]*)\](.*?)\[\/email\]/gi, '<a href="mailto:$1" target="_blank">$2</a>');
    str = str.replace(/\[color=([^\[\<]+?)\]/gi, '<font color="$1">');
    str = str.replace(/\[size=(\d+?)\]/gi, '<font size="$1">');
    str = str.replace(/\[size=(\d+(\.\d+)?(px|pt|in|cm|mm|pc|em|ex|%)+?)\]/gi, '<font style="font-size: $1">');
    str = str.replace(/\[font=([^\[\<]+?)\]/gi, '<font face="$1">');
    str = str.replace(/\[align=([^\[\<]+?)\]/gi, '<p align="$1">');
    str = str.replace(/\[float=([^\[\<]+?)\]/gi, '<br style="clear: both"><span style="float: $1;">');
    str = preg_replace([
    '\\[\\/color\\]',
    '\\[\\/size\\]',
    '\\[\\/font\\]',
    '\\[\\/align\\]',
    '\\[b\\]',
    '\\[\\/b\\]',
    '\\[i\\]',
    '\\[\\/i\\]',
    '\\[u\\]',
    '\\[\\/u\\]',
    '\\[list\\]',
    '\\[list=1\\]',
    '\\[list=a\\]',
    '\\[list=A\\]',
    '\\[\\*\\]',
    '\\[\\/list\\]',
    '\\[indent\\]',
    '\\[\\/indent\\]',
    '\\[\\/float\\]'
    ], [
      '</font>',
      '</font>',
      '</font>',
      '</p>',
      '<b>',
      '</b>',
      '<i>',
      '</i>',
      '<u>',
      '</u>',
      '<ul>',
      '<ul type=1 class="litype_1">',
      '<ul type=a class="litype_2">',
      '<ul type=A class="litype_3">',
      '<li>',
      '</ul>',
      '<blockquote>',
      '</blockquote>',
      '</span>'
    ], str, 'g');
    str = str.replace(/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/gi, '<a href="$1" target="_blank">$1</a>');
    str = str.replace(/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/gi, '<a href="$1" target="_blank">$1</a>');
    str = preg_replace(['(\r\n|\n|\r)'], [
      '<br />'
    ], str);
    return str;
    function cuturl(url) {
      var length = 100;
      var urllink = '<a href="' + (url.toLowerCase().substr(0, 4) == 'www.' ? 'http://' + url : url) + '" target="_blank">';
      if (url.length > length) {
        url = url.substr(0, parseInt(length * 0.5)) + ' ... ' + url.substr(url.length - parseInt(length * 0.3));
      }
      urllink += url + '</a>';
      return urllink;
    }
    function preg_replace(search, replace, str, regswitch) {
      var regswitch = !regswitch ? 'ig' : regswitch;
      var len = search.length;
      for (var i = 0; i < len; i++) {
        re = new RegExp(search[i], regswitch);
        str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
      }
      return str;
    }
  }
}) ();
