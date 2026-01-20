// ==UserScript==
// @name         Youtube Speed By Channel (patched for low CPU in background) + dropdown UI (stable hover)
// @namespace    Alpe
// @version      0.2.17-patched
// @description  Allow to choose the default speed for specific YT channel (with fixed polling & visibility handling) + compact dropdown UI to avoid breaking layout on small player
// @author       Alpe + patched
// @include      https://www.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @run-at       document-start
// @resource     jquery https://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563294/Youtube%20Speed%20By%20Channel%20%28patched%20for%20low%20CPU%20in%20background%29%20%2B%20dropdown%20UI%20%28stable%20hover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563294/Youtube%20Speed%20By%20Channel%20%28patched%20for%20low%20CPU%20in%20background%29%20%2B%20dropdown%20UI%20%28stable%20hover%29.meta.js
// ==/UserScript==

(async () => {
    if (window.trustedTypes && window.trustedTypes.createPolicy){
        try {
            trustedTypes?.createPolicy?.('default', {createScriptURL: s => s, createScript: s => s, createHTML: s => s});
        } catch {}
    }
    eval(GM_getResourceText('jquery'));

    const defaults = {
        DEFAULT_SPEED: 1.0,
        SHOW_RELATIVE_TIME: true,
        COLOR_SELECTED: "red",
        COLOR_NORMAL: "rgb(220,220,220)",
        BUTTON_TEMPLATES: JSON.stringify([
            ["3.5x", 3.5],
            ["3x", 3],
            ["2.5x", 2.5],
            ["2.25x", 2.25],
            ["2x", 2],
            ["1.75x", 1.75],
            ["1.5x", 1.5],
            ["1.25x", 1.25],
            ["Normal", 1],
            ["0.75x", 0.75],
            ["0.5x", 0.5]
        ]),
        AUDIO_BOOST: 1,
        SAVE_RESUME_TIME: false,
        SHOW_ON_PLAYER: false
    };

    for (let name in defaults) {
        let value = defaults[name];
        window[name] = (name === "BUTTON_TEMPLATES"
            ? JSON.parse(await GM.getValue("_YSC-" + name, value))
            : await GM.getValue("_YSC-" + name, value)
        );
    }

    async function toggleconfig(name, e){
        e = e || !(await GM.getValue("_YSC-" + name, defaults[name]));
        GM.setValue("_YSC-" + name, e);
        alert(name + ': ' + e);
    }

    if (typeof GM_registerMenuCommand == 'undefined') {
        this.GM_registerMenuCommand = (caption, commandFunc, accessKey) => {
            if (!document.body) {
                if (document.readyState === 'loading'
                    && document.documentElement && document.documentElement.localName === 'html') {
                    new MutationObserver((mutations, observer) => {
                        if (document.body) {
                            observer.disconnect();
                            GM_registerMenuCommand(caption, commandFunc, accessKey);
                        }
                    }).observe(document.documentElement, {childList: true});
                } else {
                    console.error('GM_registerMenuCommand got no body.');
                }
                return;
            }
            let contextMenu = document.body.getAttribute('contextmenu');
            let menu = (contextMenu ? document.querySelector('menu#' + contextMenu) : null);
            if (!menu) {
                menu = document.createElement('menu');
                menu.setAttribute('id', 'gm-registered-menu');
                menu.setAttribute('type', 'context');
                document.body.appendChild(menu);
                document.body.setAttribute('contextmenu', 'gm-registered-menu');
            }
            let menuItem = document.createElement('menuitem');
            menuItem.textContent = caption;
            menuItem.addEventListener('click', commandFunc, true);
            menu.appendChild(menuItem);
        };
    }

    $.each([
        ["List current settings", async function(){
            var set = [];
            for (let name in defaults) {
                let value = defaults[name];
                set.push(
                    name + ' = ' + await GM.getValue('_YSC-' + name, value)
                    + ((await GM.getValue('_YSC-' + name, value) != defaults[name]) ? " [default is " + defaults[name] + "]" : "")
                );
            }
            alert(set.join('\n'));
        }],
        ["Configure default speed", async function(){
            var temp = prompt("Default: " + defaults['DEFAULT_SPEED'], await GM.getValue('_YSC-DEFAULT_SPEED', DEFAULT_SPEED));
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-DEFAULT_SPEED');
                alert("default restored");
                return;
            }
            temp = parseFloat(temp);
            if (!isNaN(temp)) toggleconfig('DEFAULT_SPEED', temp);
        }],
        ["Show time relative to speed", async function(){
            var temp = prompt("Default: " + defaults['SHOW_RELATIVE_TIME'], await GM.getValue('_YSC-SHOW_RELATIVE_TIME', SHOW_RELATIVE_TIME));
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-SHOW_RELATIVE_TIME');
                alert("default restored");
                return;
            }
            if (temp === "true" || temp === "false") toggleconfig('SHOW_RELATIVE_TIME', (temp === "true"));
        }],
        ["Configure Color for the selected speed", async function(){
            var temp = prompt("Default: " + defaults['COLOR_SELECTED'], await GM.getValue('_YSC-COLOR_SELECTED', COLOR_SELECTED));
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-COLOR_SELECTED');
                alert("default restored");
                return;
            }
            toggleconfig('COLOR_SELECTED', temp);
        }],
        ["Configure color for unselected speed", async function(){
            var temp = prompt("Default: " + defaults['COLOR_NORMAL'], await GM.getValue('_YSC-COLOR_NORMAL', COLOR_NORMAL));
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-COLOR_NORMAL');
                alert("default restored");
                return;
            }
            toggleconfig('COLOR_NORMAL', temp);
        }],
        ["Configure Buttons", async function(){
            var temp = prompt(
                "What buttons should be displayed.\nformat: [text,speed]\neg: [half,0.5][normal,1][double,2]",
                '[' + JSON.parse(await GM.getValue('_YSC-BUTTON_TEMPLATES', JSON.stringify(BUTTON_TEMPLATES))).join('],[') + ']'
            );
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-BUTTON_TEMPLATES');
                alert("default restored");
                return;
            }
            var match = temp.match(/\[[^,]+,[^\]]+\]/g);
            if (!match){
                alert("invalid option");
            } else {
                var array = [];
                for (let i=0; i < match.length; i++){
                    let match2 = match[i].match(/\[([^,]+),([^\]]+)/);
                    array.push([match2[1], parseFloat(match2[2])]);
                }
                toggleconfig('BUTTON_TEMPLATES', JSON.stringify(array));
            }
        }],
        ["Configure audio boost", async function(){
            var temp = prompt(
                "Can be any number bigger than 1.\n\n1    = function disabled\n1.5 = 50% boost\n2    = 100% boost\n\n\nDefault: " + defaults['AUDIO_BOOST'],
                await GM.getValue('_YSC-AUDIO_BOOST', AUDIO_BOOST)
            );
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-AUDIO_BOOST');
                alert("default restored");
                return;
            }
            temp = parseFloat(temp);
            if (!isNaN(temp) && temp >= 1){
                toggleconfig('AUDIO_BOOST', temp);
                window['AUDIO_BOOST'] = temp;
                $(temp === 1 ? 'video[vsb-audioboost]' : 'video').each(function(){
                    audioboost(this, true);
                });
            }
        }],
        ["Save resume time to url", async function(){
            var temp = prompt(
                "Can be true or false\nIf true, it updates the url every 5 seconds with &t= parameter. So if you close the browser or tab and reopen it, the video will start playing close to where you stopped it.\n\nDefault: " + defaults['SAVE_RESUME_TIME'],
                await GM.getValue('_YSC-SAVE_RESUME_TIME', SAVE_RESUME_TIME)
            );
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-SAVE_RESUME_TIME');
                alert("default restored");
                return;
            }
            if (temp === "true" || temp === "false") toggleconfig('SAVE_RESUME_TIME', (temp === "true"));
        }],
        ["Show speed controls on top of the player instead of below the progress bar", async function(){
            var temp = prompt(
                "Can be true or false\n\nDefault: " + defaults['SHOW_ON_PLAYER'],
                await GM.getValue('_YSC-SHOW_ON_PLAYER', SHOW_ON_PLAYER)
            );
            if (temp === null) return;
            if (temp.length === 0){
                GM.deleteValue('_YSC-SHOW_ON_PLAYER');
                alert("default restored");
                return;
            }
            if (temp === "true" || temp === "false") toggleconfig('SHOW_ON_PLAYER', (temp === "true"));
        }],
        ["Restore default", function(){
            for (let name in defaults) {
                GM.deleteValue('_YSC-' + name);
            }
            alert("Default restored");
        }]
    ], function(a,b){ GM_registerMenuCommand(b[0],b[1]); });

    var stateKey, eventKey;
    {
        let keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
    }

    function vis (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }

    function getspeed(params = {}){
        let speed, reason;
        if (params.hasOwnProperty('force1x') && params.force1x){
            speed = 1;
            reason = "forcing 1x (live?)";
        } else if (params.hasOwnProperty('channelspeed') && typeof params.channelspeed === "number"){
            speed = params.channelspeed;
            reason = "channelspeed";
        } else if (params.hasOwnProperty('defspeed') && Number.isInteger(params.defspeed)){
            speed = params.defspeed;
            reason = "overwritten default (music?)";
        } else {
            speed = DEFAULT_SPEED;
            reason = "default";
        }
        if (params.channelspeed === undefined) delete params.channelspeed;
        if (params.defspeed === null) delete params.defspeed;
        if (params.force1x === false) delete params.force1x;
        params['chosenspeed'] = speed;
        params['chosenreason'] = reason;
        console.log(params);
        return speed;
    }

    // ===== Dropdown UI helpers =====
    function formatRate(r){
        const v = Math.round(r * 100) / 100;
        return (String(v).replace(/\.0+$/,'') + 'x');
    }

    // ===== VSB dropdown UI CSS =====
    let vsbCssInjected = false;
    function injectVsbCss(){
        if (vsbCssInjected) return;
        vsbCssInjected = true;

        const style = document.createElement('style');
        style.id = 'vsb-speedmenu-style';
        style.textContent = `
#movie_player .vsb-root, #c4-player .vsb-root {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  font-weight: 700;
  font-size: 80%;
  --vsb-selected: red;
  --vsb-normal: rgb(220,220,220);
}

/* 開いてる時だけ前面に出す（進捗バーに奪われないように） */
#movie_player .vsb-root.vsb-open, #movie_player .vsb-root:focus-within,
#c4-player .vsb-root.vsb-open, #c4-player .vsb-root:focus-within{
  z-index: 2147483647;
}

.vsb-toggle{
  background: transparent;
  color: var(--vsb-normal, #ddd);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
  cursor: pointer;
  min-width: 44px;
}
.vsb-toggle:hover{
  border-color: rgba(255,255,255,.35);
}

/* パネル：トグルの真上にまっすぐ + ちょい上げて進捗バーと被らせない */
.vsb-panel{
  position: absolute;
  left: 50%;
  right: auto;
  transform: translateX(-50%);

  bottom: calc(100% + 15px); /* ←ここで少し上に逃がす */

  display: none;
  flex-direction: column;
  gap: 0;

  background: rgba(28,28,28,.96);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 12px;
  padding: 4px;

  z-index: 2147483647;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
}

/* hover依存は捨てる（vsb-open / focus-within で表示） */
.vsb-root:focus-within .vsb-panel,
.vsb-root.vsb-open .vsb-panel{
  display: flex;
}

/* トグル⇄パネル間の“橋”（進捗バー跨ぎで閉じるの防止） */
.vsb-panel::after{
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -32px;
  height: 32px;
  background: transparent;
}

.vsb-item{
  color: var(--vsb-normal, #ddd);
  padding: 2px 8px;      /* 行の縦幅を詰める */
  line-height: 1.75;     /* 文字高さ寄せ */
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}
.vsb-item:hover{ background: rgba(255,255,255,.10); }

.vsb-speed.vsb-selected{
  color: var(--vsb-selected, red);
  font-weight: 900;
}
.vsb-speed.vsb-default{ text-decoration: underline; }

.vsb-setdefault{
  color: #fff;
  opacity: .92;
  padding-bottom: 4px;
  margin-bottom: 3px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}
`;
        (document.head || document.documentElement).appendChild(style);

        // 外側クリックで閉じる（メニュー内クリックは無視：キャプチャでも閉じないように）
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest && e.target.closest('.vsb-root')) return;
            document.querySelectorAll('.vsb-root.vsb-open').forEach(el => el.classList.remove('vsb-open'));
        }, true);
    }

    function buttonclick(evt){
        evt.stopPropagation();

        const btn = $(evt.target).closest('.vsb-speed')[0];
        if (!btn) return;

        const id = btn.dataset.vsbid;
        const speed = parseFloat(btn.dataset.speed);

        const root = document.getElementById('vsb-container' + id);
        if (root){
            root.querySelectorAll('.vsb-speed').forEach(el => el.classList.remove('vsb-selected'));
            btn.classList.add('vsb-selected');

            const toggle = root.querySelector('.vsb-toggle');
            if (toggle) toggle.textContent = formatRate(speed);
        }

        if ($('video[vsb-video="' + id + '"]').length === 0){
            youtubefix();
        }
        try {
            let video = $('video[vsb-video=' + id + ']')[0];
            video.playbackRate = speed;
            if (SHOW_RELATIVE_TIME || SAVE_RESUME_TIME) changetime(video);
        } catch (err){
            console.log('error on buttonclick()', evt, err);
            setTimeout(function(){ buttonclick(evt); }, 1000);
        }
    }

    function getchannelname (id, div = null){
        try {
            if (div === null) div = $('#channel-name[vsb-channel=' + id + ']');
            let channel = div.find('#container #text:visible:first').text().trim();
            if (!channel){
                channel = div.find('.ytd-channel-name').find('a').text().trim();
            }
            if (!channel){
                let metavid = document.querySelector('#watch7-content > meta[itemprop=videoId]');
                if (metavid !== null && (new URL(div.closest('ytd-watch-flexy, ytd-browse').find('video')[0].baseURI)).searchParams.get('v') === metavid.getAttribute('content')){
                    let metaname = document.querySelector('#watch7-content > span[itemprop=author] > link[itemprop=name]');
                    if (metaname !== null) channel = metaname.getAttribute('content');
                    if (!channel) channel = '';
                }
            }
            return channel;
        } catch (e) {
            console.log("error", e);
            return '';
        }
    }

    function setchanneldefault(evt){
        evt.stopPropagation();

        const el = $(evt.target).closest('.vsb-setdefault')[0];
        if (!el) return;

        const id = el.dataset.vsbid;
        const channel = getchannelname(id);

        changebuttontitle(id, channel);

        const video = $('video[vsb-video=' + id + ']')[0];
        const currentspeed = video ? video.playbackRate : 1;

        const root = document.getElementById('vsb-container' + id);
        if (root){
            root.querySelectorAll('.vsb-speed').forEach(x => x.classList.remove('vsb-default'));
            const target = root.querySelector('.vsb-speed[data-speed="' + currentspeed + '"]');
            if (target) target.classList.add('vsb-default');
        }

        GM.setValue(channel, currentspeed);
        console.log('changing default for (' + channel + ') to (' + currentspeed + ')');
    }

    function createcontainer(curspeed, id){
        injectVsbCss();

        const div = document.createElement("div");
        div.id = "vsb-container" + id;
        div.className = "vsb-root";
        div.style.setProperty('--vsb-selected', COLOR_SELECTED);
        div.style.setProperty('--vsb-normal', COLOR_NORMAL);

        // compact toggle
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'vsb-toggle';
        toggle.textContent = formatRate(curspeed);
        toggle.title = "Playback speed menu";
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // クリックでも開閉できる（タッチ対策）
            div.classList.toggle('vsb-open');
        });
        div.appendChild(toggle);

        // panel (opens upward)
        const panel = document.createElement('div');
        panel.className = 'vsb-panel';
        panel.addEventListener('click', (e) => e.stopPropagation());

        // setdefault
        const setdef = document.createElement('div');
        setdef.className = 'vsb-item vsb-setdefault';
        setdef.textContent = 'setdefault';
        setdef.title = 'Set current speed as default for this channel';
        setdef.dataset.vsbid = id;
        panel.appendChild(setdef);

        // speed items
        BUTTON_TEMPLATES.forEach(function(button){
            const item = document.createElement('div');
            item.className = 'vsb-item vsb-speed';
            item.textContent = button[0];
            item.dataset.speed = button[1];
            item.dataset.vsbid = id;
            if (curspeed === button[1]) item.classList.add('vsb-selected');
            panel.appendChild(item);
        });

        div.appendChild(panel);

        // bind (jQuery) so that $(...).trigger('click') keeps working elsewhere
        $('.vsb-speed', div).on('click', buttonclick);
        $('.vsb-setdefault', div).on('click', setchanneldefault);

        // ===== hover-open with delayed close (progress bar crossing safe) =====
        let closeTimer = null;
        const CLOSE_DELAY_MS = 900;

        function openMenu(){
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            div.classList.add('vsb-open');
        }
        function closeMenuLater(){
            if (closeTimer) clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                // まだ乗ってないなら閉じる
                if (!div.matches(':hover')) div.classList.remove('vsb-open');
                closeTimer = null;
            }, CLOSE_DELAY_MS);
        }

        div.addEventListener('mouseenter', openMenu);
        div.addEventListener('mouseleave', closeMenuLater);
        panel.addEventListener('mouseenter', openMenu);
        panel.addEventListener('mouseleave', closeMenuLater);

        return div;
    }

    window.vsbid = 0;
    function getid(){
        let id = window.vsbid;
        window.vsbid++;
        return id;
    }

    function changebuttontitle(id, channelname = ''){
        let container = $('#vsb-container' + id + ' .vsb-setdefault');
        if (container.length > 0){
            container[0].title = container[0].title.split(' [')[0] + (channelname !== '' ? ' [' + channelname + ']' : '');
        }
    }

    function ob_youtube_movieplayer (mutationsList, observer){
        for(let mutation of mutationsList) {
            if (mutation.attributeName === 'video-id'){
                let el = $('[id^=vsb-container]', mutation.target);
                if (el.length === 0){
                    alert('fixing');
                    console.log('fixing this');
                    youtube();
                    el = $('[id^=vsb-container]', mutation.target);
                }
                let id = el[0].id.match(/\d+$/)[0];
                let channeldiv = $('#channel-name[vsb-channel="' + id + '"]');

                // reset to 1x via UI if possible
                if ($('.vsb-speed[data-speed="1"]', el).trigger('click').length === 0) {
                    $('video[vsb-video="' + id + '"]')[0].playbackRate = 1;
                }

                $('.vsb-speed', el).removeClass('vsb-default');
                changebuttontitle(id);

                setTimeout(async function(){
                    let channelspeed, channelname = getchannelname(id, channeldiv);
                    let tries = 1;
                    while(channelname === '' && tries <= 8){
                        if (tries === 1){
                            alert('sleeping');
                            console.log("id", id);
                            console.log("channeldiv", channeldiv);
                            console.log("channelname", channelname);
                        }
                        console.log('sleeping ' + tries, channeldiv);
                        await (new Promise(resolve => setTimeout(resolve, 200)));
                        channelname = getchannelname(id, channeldiv);
                        tries++;
                    }
                    if (channelname !== ''){
                        channelspeed = await GM.getValue(channelname);
                    } else {
                        channelspeed = undefined;
                    }

                    changebuttontitle(id, channelname);
                    $('.vsb-speed[data-speed="' + channelspeed + '"]', el).addClass('vsb-default');

                    let speed = getspeed({
                        channelname: channelname,
                        channelspeed: channelspeed,
                        defspeed: (channeldiv.find('.badge-style-type-verified-artist').length > 0 || channelname.match(/VEVO$/) ? 1 : null),
                        force1x: (el.closest('#movie_player').find('.ytp-live').length === 1)
                    });

                    // apply via UI if possible (updates toggle text too)
                    if ($('.vsb-speed[data-speed="' + speed + '"]', el).trigger('click').length === 0) {
                        $('video[vsb-video="' + id + '"]')[0].playbackRate = speed;
                        const root = document.getElementById('vsb-container' + id);
                        if (root){
                            const toggle = root.querySelector('.vsb-toggle');
                            if (toggle) toggle.textContent = formatRate(speed);
                        }
                    }
                }, 500);
            }
        }
    }

    function ob_youtube_c4player (mutationsList, observer){
        for(let mutation of mutationsList) {
            if (mutation.attributeName === 'src' && mutation.target.src !== ''){
                let id = mutation.target.getAttribute("vsb-video");
                let channeldiv = $('#channel-name[vsb-channel="' + id + '"]');
                $('video[vsb-video="' + id + '"]')[0].playbackRate = 1;
                setTimeout(async function(){
                    $('video[vsb-video="' + id + '"]')[0].playbackRate = getspeed({
                        channelname: getchannelname(id, channeldiv),
                        channelspeed: await GM.getValue(getchannelname(id, channeldiv)),
                        defspeed: (channeldiv.find('.badge-style-type-verified-artist').length === 1 ? 1 : null)
                    });
                },1000);
            }
        }
    }

    function youtubefix(){
        $('#movie_player[monitored], #c4-player[monitored]').each(
            function(){
                let video = $('video', this);
                if (video.attr('vsb-video') === undefined){
                    let el = $(this);
                    let id = el.attr('monitored');
                    console.log('fixing', video);
                    setTimeout(function(){
                        audioboost(video, true);
                        video.attr('vsb-video', id);
                        youtubefix2('#vsb-container' + id);
                        if (SHOW_RELATIVE_TIME || SAVE_RESUME_TIME) ['timeupdate','seeked', 'pause'].forEach( function(evt) { video[0].addEventListener(evt, changetime,false) });
                    },750);
                } else {
                    console.log('fixing2', video);
                    youtubefix2('#vsb-container' + $(this).attr('monitored'));
                }
            }
        );
    }

    function youtubefix2(el, log = false){
        try {
            const root = $(el)[0];
            if (!root) return;

            const btn = root.querySelector('.vsb-speed.vsb-selected');
            if (btn) $(btn).trigger('click');
        } catch (e){
            if (log) console.log('fixing failed', e);
        }
    }

    function fancyTimeFormat(duration){
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    function changetime (event){
        let video = (typeof event.target === "object" ? event.target : event);
        if (SHOW_RELATIVE_TIME){
            let id = video.getAttribute('vsb-video');
            let timediv = $('#movie_player[monitored="' + id + '"]:visible .ytp-time-display:visible');
            if (timediv.length === 0) return;
            let reltimespan = timediv[0].getElementsByClassName('vsb-reltime');
            if (reltimespan.length === 0){
                timediv[0].insertAdjacentHTML('beforeend', '<span class="vsb-reltime"></span>');
                reltimespan = timediv[0].getElementsByClassName('vsb-reltime');
            }
            reltimespan[0].innerHTML = (video.playbackRate === 1 || isNaN(video.duration) ? '' : '<span> (</span>' + fancyTimeFormat(video.currentTime / video.playbackRate) + ' / ' + fancyTimeFormat(video.duration / video.playbackRate) + '<span>)</span>');
        }
        if (SAVE_RESUME_TIME){
            const time = Math.floor(video.currentTime),
                  url = new URL(location);
            if (url.pathname === "/watch" && time >= 10){
                if (typeof event.target !== "object" || event.type !== "timeupdate" || Number.isInteger(time/5)){
                    url.searchParams.set('t', (time - 5) + 's');
                    history.replaceState({}, document.title, url.toString());
                }
            } else if (url.searchParams.has('t')){
                url.searchParams.delete('t');
                history.replaceState({}, document.title, url.toString());
            }
        }
    }

    function audioboost(el = null, force = false){
        if (el === null || typeof el !== 'object') el = this;
        if (el.tagName !== "VIDEO") return;
        if (el.getAttribute('vsb-audioboost') === null){
            el.setAttribute('vsb-audioboost', getid());
        } else if (!force){
            return;
        }
        const audioCtx = "YTSBC_audioCtx_" + el.getAttribute('vsb-audioboost');
        try { window[audioCtx].close(); } catch {}
        if (AUDIO_BOOST === 1 && !force) return;
        window[audioCtx] = new AudioContext();
        const source = window[audioCtx].createMediaElementSource(el),
            gainNode = window[audioCtx].createGain();
        gainNode.gain.value = AUDIO_BOOST;
        source.connect(gainNode);
        if (AUDIO_BOOST > 1){
            const limiterNode = window[audioCtx].createDynamicsCompressor();
            limiterNode.threshold.value = -5.0;
            limiterNode.knee.value = 0;
            limiterNode.ratio.value = 40.0;
            limiterNode.attack.value = 0.001;
            limiterNode.release.value = 0.1;

            limiterNode.connect(window[audioCtx].destination);
            gainNode.connect(limiterNode);
        } else {
            gainNode.connect(window[audioCtx].destination);
        }
    }

    function observevideo(el){
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.target.src === ''){
                    youtubefix();
                } else {
                    const id = mutation.target.getAttribute('vsb-video');
                    youtubefix2('#vsb-container' + id);
                }
            }
        });
        observer.observe(el, {attributes: true, attributeFilter: ['src']});
    }

    function youtube(){
        $('#movie_player:visible:not([monitored]), #c4-player:visible:not([monitored])').each(async function( index ) {
            let el = $(this);
            let speed, channelspeed;
            if (this.id === "movie_player" && !this.classList.contains('ytp-player-minimized')){
                let channeldiv = el.closest('ytd-watch-flexy').find('#upload-info #channel-name');
                if (!channeldiv.length) channeldiv = $('ytd-watch-metadata #upload-info #channel-name');
                if (!channeldiv.length) return;
                let channelname = getchannelname(-1, channeldiv);
                if (channelname === '') return;
                let appendto = (SHOW_ON_PLAYER ? el.find("div.ytp-iv-video-content") : el.find("div.ytp-right-controls"));
                if (!appendto.length) return;
                let videodiv = el.find('video');
                if (!videodiv.length) return;

                let id = getid();
                el.attr('monitored', id);
                channeldiv.attr('vsb-channel', id);
                videodiv.attr('vsb-video', id);
                videodiv.each(audioboost);

                $('#ytp-id-20 .ytp-menuitem-label:contains(Playback speed)', el).parent().css('display', 'none');

                console.log("Adding video-id observer");
                let el2 = el.closest('ytd-watch-flexy');
                if (!el2.length) el2 = $('ytd-watch-flexy:visible');
                (new MutationObserver(ob_youtube_movieplayer)).observe(el2[0], { attributes: true });

                el2 = el.find('video');
                if (!el2.length) el2 = $('video:visible');
                observevideo(el2[0]);

                channelspeed = await GM.getValue(channelname);

                speed = getspeed({
                    channelname: channelname,
                    channelspeed: channelspeed,
                    defspeed: (channeldiv.find('.badge-style-type-verified-artist').length > 0 || channelname.match(/VEVO$/) ? 1 : null),
                    force1x: (el.find('.ytp-live').length === 1)
                });

                let div = createcontainer(speed, id);
                $('.vsb-speed[data-speed="' + channelspeed + '"]', div).addClass('vsb-default');

                if (SHOW_ON_PLAYER){
                    div.style.position = "absolute";
                    div.style.zIndex = 10;
                    div.style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
                }

                appendto.prepend(div);
                changebuttontitle(id, channelname);

                videodiv[0].playbackRate = speed;
                if (SHOW_RELATIVE_TIME || SAVE_RESUME_TIME) ['timeupdate','seeked', 'pause'].forEach(function(evt) {
                    videodiv[0].addEventListener(evt, changetime, false);
                });
            } else if (this.id === "c4-player"){
                let channeldiv = el.closest('ytd-browse').find('#header #channel-name');
                if (!channeldiv.length) return;
                let channelname = getchannelname(-1, channeldiv);
                if (channelname === '') return;
                let videodiv = el.find('video');
                if (!videodiv.length) return;

                // FIX: id を宣言してから使う
                let id = getid();
                el.attr('monitored', id);
                channeldiv.attr('vsb-channel', id);
                videodiv.attr('vsb-video', id);
                videodiv.each(audioboost);

                console.log("Adding c4 observer");
                (new MutationObserver(ob_youtube_c4player)).observe(el.find('video')[0], { attributes: true, subtree: true });

                videodiv[0].playbackRate = getspeed({
                    channelname: channelname,
                    channelspeed: await GM.getValue(channelname),
                    defspeed: (channeldiv.find('.badge-style-type-verified-artist').length === 1 ? 1 : null)
                });
            }
        });
        if (AUDIO_BOOST !== 1){
            $('video:not([vsb-audioboost])').each(audioboost);
        }
    }

    // ★ 修正済 mark_loop: monitored が 0 の間だけポーリング
    function mark_loop(){
        if (location.host.endsWith('youtube.com')){
            youtube();
            let test = document.querySelectorAll('[monitored]');
            if (test.length === 0){
                setTimeout(
                    mark_loop,
                    ((test.length === 0 || test[0].id !== "movie_player" ? 250 : 2000) * (vis() ? 1 : 2))
                );
            } else {
                console.log('stopping loop');
            }
        } else {
            setTimeout(mark_loop, 1500 * (vis() ? 1 : 4));
        }
    }

    // ★ visibility を見て、表示されるまで mark_loop を起動しない
    function start_mark_loop_when_visible() {
        if (vis()) {
            mark_loop();
        } else if (eventKey) {
            const onVisChange = () => {
                if (vis()) {
                    document.removeEventListener(eventKey, onVisChange);
                    mark_loop();
                }
            };
            document.addEventListener(eventKey, onVisChange);
        } else {
            mark_loop();
        }
    }

    if (AUDIO_BOOST !== 1){
        start_mark_loop_when_visible();
    } else {
        window.addEventListener('load', start_mark_loop_when_visible);
    }
})();
