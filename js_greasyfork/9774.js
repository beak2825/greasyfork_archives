// ==UserScript==
// @name        Agar.io neural bot
// @description An agar.io bot based on the principles of neural networking.
// @namespace   http://msparp.com/
// @include     http://agar.io/*
// @version     0.0.1
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/9774/Agario%20neural%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/9774/Agario%20neural%20bot.meta.js
// ==/UserScript==
var changed = 0; // script need to be edited with
window.addEventListener('beforescriptexecute', function (e) {
  //for external script:
  src = e.target.src;
  if (src.search(/main_out\.js..../) != - 1) {
    console.log('event listener fired, main_out found');
    changed++;
    e.preventDefault();
    e.stopPropagation();
    append(main_out);
    //init();
  };
  //when done, remove the listener:
  if (changed == 1)
  window.removeEventListener(e.type, arguments.callee, true);
}, true);
////// append with new block function:
function append(s) {
  console.log('append fired');
  document.head.appendChild(document.createElement('script')).innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}
////////////////////////////////////////////////

function main_out() {
  $.getScript('http://cs.stanford.edu/people/karpathy/convnetjs/build/convnet-min.js', function()
  {
    $.getScript('https://raw.githubusercontent.com/maxkueng/victor/master/build/victor.js', function ()
    {
      (function (self, $) {
        /**
  		 * @return {undefined}
  		 */
        function init() {
          console.log('init fired');
          getRegions();
          setInterval(getRegions, 180000);
          /** @type {(HTMLElement|null)} */
          canvas = tempCanvas = document.getElementById('canvas');
          canvas.width *= 2;
          canvas.height *= 2;
          canvasContext = canvas.getContext('2d');
          canvas.onmousedown = function (e) {
            if (options) {
              var z0 = e.clientX - (5 + width / 5 / 2);
              var z1 = e.clientY - (5 + width / 5 / 2);
              if (Math.sqrt(z0 * z0 + z1 * z1) <= width / 5 / 2) {
                sendMovementToServer();
                sendServerCommand(17);
                return;
              }
            }
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            recalculateDestination();
            sendMovementToServer();
          };
          canvas.onmousemove = function (e) {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            useMouseX = (currentMouseX - width / 2 + cellX * screenRatio) / screenRatio;
            useMouseY = (currentMouseY - height / 2 + cellY * screenRatio) / screenRatio;
            tempPoint = [
              useMouseX,
              useMouseY,
              1
            ];
            recalculateDestination();
          };
          canvas.onmouseup = function (evt) {
          };
          var b = false;
          var a = false;
          var all = false;
          self.onkeydown = function (e) {
            if (!(32 != e.keyCode)) {
              if (!b) {
                sendMovementToServer();
                sendServerCommand(17);
                b = true;
              }
            }
            if (!(69 != e.keyCode)) {
              sendServerCommand(1);
            }
            if (!(81 != e.keyCode)) {
              if (!a) {
                sendServerCommand(18);
                a = true;
              }
            }
            if (!(87 != e.keyCode)) {
              if (!all) {
                sendMovementToServer();
                sendServerCommand(21);
                all = true;
              }
            }
          };
          self.onkeyup = function (event) {
            if (32 == event.keyCode) {
              b = false;
            }
            if (87 == event.keyCode) {
              all = false;
            }
            if (81 == event.keyCode) {
              if (a) {
                sendServerCommand(19);
                a = false;
              }
            }
          };
          self.onblur = function () {
            sendServerCommand(19);
            all = a = b = false;
          };
          self.onresize = onResize;
          onResize();
          if (self.requestAnimationFrame) {
            self.requestAnimationFrame(anim);
          } else {
            setInterval(draw, 1000 / 60);
          }
          setInterval(sendMovementToServer, 5);
          done($('#region').val());
        }
        function processData() {
          var v = Number.POSITIVE_INFINITY;
          var j = Number.POSITIVE_INFINITY;
          var bottom = Number.NEGATIVE_INFINITY;
          var maxY = Number.NEGATIVE_INFINITY;
          var newDuration = 0;
          var i = 0;
          for (; i < items.length; i++) {
            newDuration = Math.max(items[i].size, newDuration);
            v = Math.min(items[i].x, v);
            j = Math.min(items[i].y, j);
            bottom = Math.max(items[i].x, bottom);
            maxY = Math.max(items[i].y, maxY);
          }
          context = QUAD.init({
            minX: v - (newDuration + 100),
            minY: j - (newDuration + 100),
            maxX: bottom + (newDuration + 100),
            maxY: maxY + (newDuration + 100)
          });
          i = 0;
          for (; i < items.length; i++) {
            if (v = items[i], v.shouldRender()) {
              j = 0;
              for (; j < v.points.length; ++j) {
                context.insert(v.points[j]);
              }
            }
          }
        }
        function recalculateDestination() {
          moveX = (currentMouseX - width / 2) / screenRatio + cellX;
          moveY = (currentMouseY - height / 2) / screenRatio + cellY;
        }
        function getRegions() {
          if (null == old) {
            old = {
            };
            $('#region').children().each(function () {
              var option = $(this);
              var name = option.val();
              if (name) {
                old[name] = option.text();
              }
            });
          }
          $.get('http://m.agar.io/info', function (b) {
            var name;
            for (name in b.regions) {
              $('#region option[value="' + name + '"]').text(old[name] + ' (' + b.regions[name].numPlayers + ' players)');
            }
          }, 'json');
        }
        function done(mat) {
          if (mat) {
            if (mat != dest) {
              dest = mat;
              after();
            }
          }
        }
        function next() {
          $.ajax('http://m.agar.io/', {
            error: function () {
              setTimeout(next, 1000);
            },
            success: function (status) {
              status = status.split('\n');
              open('ws://' + status[0]);
            },
            dataType: 'text',
            method: 'POST',
            cache: false,
            crossDomain: true,
            data: dest || '?'
          });
        }
        function after() {
          $('#connecting').show();
          next();
        }
        function open(url) {
          //Verify existing connection.
          if (ws) {
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            ws.close();
            ws = null;
          }
          //Start new connection.

          bucket = [
          ];
          playerCell = [
          ];
          nodes = {
          };
          items = [
          ];
          destroyedCells = [
          ];
          leaderboardPlayers = [
          ];
          console.log('Connecting to ' + url);
          ws = new WebSocket(url);
          ws.binaryType = 'arraybuffer';
          ws.onopen = listener;
          ws.onmessage = parse;
          ws.onclose = report;
          ws.onerror = function () {
            console.log('socket error');
          };
        }
        function listener(data) {
          $('#connecting').hide();
          console.log('socket open');
          data = new ArrayBuffer(5);
          var view = new DataView(data);
          view.setUint8(0, 255);
          view.setUint32(1, 1, true);
          ws.send(data);
          close();
        }
        function report(failing_message) {
          console.log('socket close');
          setTimeout(after, 500);
        }
        function parse(target) {
          function encode() {
            var utftext = '';
            for (; ; ) {
              var c = d.getUint16(i, true);
              i += 2;
              if (0 == c) {
                break;
              }
              utftext += String.fromCharCode(c);
            }
            return utftext;
          }
          var i = 1;
          var d = new DataView(target.data);
          switch (d.getUint8(0)) {
            case 16:
              //console.log("Code 16");
              run(d);
              break;
            case 20:
              //Likely for when the server resets.
              console.log('Code 20');
              playerCell = [
              ];
              bucket = [
              ];
              break;
            case 32:
              console.log('Code 32');
              bucket.push(d.getUint32(1, true));
              break;
            case 48:
              console.log('Code 48');
              leaderboardPlayers = [
              ];
              for (; i < d.byteLength; ) {
                tempName = encode();
                console.log('Name: ' + tempName);
                leaderboardPlayers.push({
                  id: 0,
                  name: tempName
                });
              }
              drawLeaderboard();
              break;
            case 49:
              //Parses the leaderboard.
              target = d.getUint32(i, true);
              i += 4;
              leaderboardPlayers = [
              ];
              var seek = 0;
              for (; seek < target; ++seek) {
                var r = d.getUint32(i, true);
                i = i + 4;
                leaderboardPlayers.push({
                  id: r,
                  name: encode()
                });
              }
              drawLeaderboard();
              break;
            case 64:
              console.log('Code 64');
              left = d.getFloat64(1, true);
              bottom = d.getFloat64(9, true);
              right = d.getFloat64(17, true);
              top = d.getFloat64(25, true);
              if (0 == playerCell.length) {
                cellX = (right + left) / 2;
                cellY = (top + bottom) / 2;
              };
          }
        }
        function run(d) {
          e = + new Date;
          var key = Math.random();
          var offset = 1;
          aa = false;
          var cellID = d.getUint16(offset, true);
          offset = offset + 2;
          var i = 0;
          for (; i < cellID; ++i) {
            var current = nodes[d.getUint32(offset, true)];
            var that = nodes[d.getUint32(offset + 4, true)];
            offset = offset + 8;
            if (current) {
              if (that) {
                that.destroy();
                that.ox = that.x;
                that.oy = that.y;
                that.oSize = that.size;
                that.nx = current.x;
                that.ny = current.y;
                that.nSize = that.size;
                that.updateTime = e;
              }
            }
          }
          for (; ; ) {
            cellID = d.getUint32(offset, true);
            offset += 4;
            if (0 == cellID) {
              break;
            }
            i = d.getFloat64(offset, true);
            offset = offset + 8;
            current = d.getFloat64(offset, true);
            offset = offset + 8;
            that = d.getFloat64(offset, true);
            offset = offset + 8;
            var color = d.getUint8(offset++);
            var second = false;
            if (0 == color) {
              second = true;
              color = '#33FF33';
            } else {
              if (255 == color) {
                second = d.getUint8(offset++);
                color = d.getUint8(offset++);
                var cellName = d.getUint8(offset++);
                color = isArray(second << 16 | color << 8 | cellName);
                cellName = d.getUint8(offset++);
                second = !!(cellName & 1);
                if (cellName & 2) {
                  offset += 4;
                }
                if (cellName & 4) {
                  offset += 8;
                }
                if (cellName & 8) {
                  offset += 16;
                }
              } else {
                color = 63487 | color << 16;
                var data = (color >> 16 & 255) / 255 * 360;
                var params = (color >> 8 & 255) / 255;
                color = (color >> 0 & 255) / 255;
                if (0 == params) {
                  color = color << 16 | color << 8 | color << 0;
                } else {
                  data = data / 60;
                  cellName = ~~data;
                  var callback = data - cellName;
                  data = color * (1 - params);
                  var tmp = color * (1 - params * callback);
                  params = color * (1 - params * (1 - callback));
                  var fn = callback = 0;
                  var result = 0;
                  switch (cellName % 6) {
                    case 0:
                      callback = color;
                      fn = params;
                      result = data;
                      break;
                    case 1:
                      callback = tmp;
                      fn = color;
                      result = data;
                      break;
                    case 2:
                      callback = data;
                      fn = color;
                      result = params;
                      break;
                    case 3:
                      callback = data;
                      fn = tmp;
                      result = color;
                      break;
                    case 4:
                      callback = params;
                      fn = data;
                      result = color;
                      break;
                    case 5:
                      callback = color;
                      fn = data;
                      result = tmp;
                  }
                  callback = ~~(255 * callback) & 255;
                  fn = ~~(255 * fn) & 255;
                  result = ~~(255 * result) & 255;
                  color = callback << 16 | fn << 8 | result;
                }
                color = isArray(color);
              }
            }
            cellName = '';
            for (; ; ) {
              data = d.getUint16(offset, true);
              offset += 2;
              if (0 == data) {
                break;
              }
              cellName += String.fromCharCode(data);
            }
            var cellData = null;
            if (nodes.hasOwnProperty(cellID)) {
              cellData = nodes[cellID];
              cellData.updatePos();
              cellData.ox = cellData.x;
              cellData.oy = cellData.y;
              cellData.oSize = cellData.size;
              cellData.color = color;
              if (cellData.name != '') {
                //console.log("Text: " + cellData.name);
              }
            } else {
              cellData = new cell(cellID, i, current, that, color, second, cellName);
              cellData.pX = i;
              cellData.pY = current;
              if (cellName != '') {
                //console.log("Text: " + cellData.name + " Bool: " + second);
              }
            }
            cellData.nx = i;
            cellData.ny = current;
            cellData.nSize = that;
            cellData.updateCode = key;
            cellData.updateTime = e;
            if ( - 1 != bucket.indexOf(cellID)) {
              if ( - 1 == playerCell.indexOf(cellData)) {
                document.getElementById('overlays').style.display = 'none';
                playerCell.push(cellData);
                if (1 == playerCell.length) {
                  cellX = cellData.x;
                  cellY = cellData.y;
                }
              }
            }
          }
          d.getUint16(offset, true);
          offset += 2;
          current = d.getUint32(offset, true);
          offset += 4;
          i = 0;
          for (; i < current; i++) {
            cellID = d.getUint32(offset, true);
            offset += 4;
            if (nodes[cellID]) {
              nodes[cellID].updateCode = key;
            }
          }
          i = 0;
          for (; i < items.length; i++) {
            if (items[i].updateCode != key) {
              items[i--].destroy();
            }
          }
          if (aa) {
            if (0 == playerCell.length) {
              $('#overlays').fadeIn(3000);
              //window.connect("ws://45.33.48.113:443");
              setNick(originalName); // <---- TROLL hahaha
            }
          }
        }
        function computeDistance(x1, y1, x2, y2) {
          var xdis = Math.abs(x1 - x2);
          var ydis = Math.abs(y1 - y2);
          var distance = Math.sqrt(xdis * xdis + ydis * ydis);
          return distance;
        }
        function getListBasedOnFunction(booleanFunction, listToUse) {
          var dotList = [
          ];
          Object.keys(listToUse).forEach(function (element, index) {
            if (booleanFunction(element)) {
              dotList.push(nodes[element]);
            }
          });
          return dotList;
        }
        function getAllThreats() {
          var dotList = [
          ];
          dotList = getListBasedOnFunction(function (element) {
            var isMe = false;
            for (var i = 0; i < playerCell.length; i++) {
              if (nodes[element].id == playerCell[i].id) {
                isMe = true;
                break;
              }
            }
            for (var i = 0; i < playerCell.length; i++) {
              if (!isMe && (!nodes[element].isVirus && (nodes[element].size >= playerCell[i].oSize * 1.15))) {
                return true;
              } else if (nodes[element].isVirus && (nodes[element].size * 1.15 <= playerCell[i].oSize)) {
                return true;
              }
              return false;
            }
          }, nodes);
          return dotList;
        }
        function getAllFood() {
          var elementList = [
          ];
          var dotList = [
          ];
          elementList = getListBasedOnFunction(function (element) {
            var isMe = false;
            for (var i = 0; i < playerCell.length; i++) {
              if (nodes[element].id == playerCell[i].id) {
                isMe = true;
                break;
              }
            }
            for (var i = 0; i < playerCell.length; i++) {
              if (!isMe && !nodes[element].isVirus && (nodes[element].size * 1.25 <= playerCell[i].size) || (nodes[element].size <= 11)) {
                return true;
              } else {
                return false;
              }
            }
          }, nodes);
          for (var i = 0; i < elementList.length; i++) {
            dotList.push([elementList[i].x,
            elementList[i].y,
            elementList[i].size]);
          }
          return dotList;
        }
        function clusterFood(foodList, blobSize) {
          var clusters = [
          ];
          var addedCluster = false;
          for (var i = 0; i < foodList.length; i++) {
            for (var j = 0; j < clusters.length; j++) {
              if (computeDistance(foodList[i][0], foodList[i][1], clusters[j][0], clusters[j][1]) < blobSize * 1.5) {
                clusters[j][0] = (foodList[i][0] + clusters[j][0]) / 2;
                clusters[j][1] = (foodList[i][1] + clusters[j][1]) / 2;
                clusters[j][2] += foodList[i][2];
                addedCluster = true;
                break;
              }
            }
            if (!addedCluster) {
              clusters.push([foodList[i][0],
              foodList[i][1],
              foodList[i][2]]);
            }
            addedCluster = false;
          }
          return clusters;
        }
        //Given two points on a line, finds the slope of a perpendicular line crossing it.

        function inverseSlope(x1, y1, x2, y2) {
          var m = (y1 - y2) / (x1 - x2);
          return ( - 1) / m;
        }
        //Given a slope and an offset, returns two points on that line.

        function pointsOnLine(slope, useX, useY) {
          var b = useY - slope * useX;
          return [[useX - 100,
          slope * (useX - 100) + b],
          [
            useX + 100,
            slope * (useX + 100) + b
          ]];
        }
        //Using a line formed from point a to b, tells if point c is on left side of that line.

        function isSideLine(a, b, c) {
          if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0) {
            return true;
          }
          return false;
        }
        function findDestination() {
          dPoints = [
          ];
          lines = [
          ];
          if (playerCell[0] != null) {
            var allPossibleFood = null;
            allPossibleFood = getAllFood(); // #1
            /*for (var i = -1000; i < 1000; i += playerCell[0].size) {
                      for (var j = -1000; j < 1000; j += playerCell[0].size) {
                          allPossibleFood.push([playerCell[0].x + i, playerCell[0].y + j, -200]);
                      }
                  }*/
            allPossibleThreats = getAllThreats();
            allThreatLines = [
            ];
            var clusterAllFood = clusterFood(allPossibleFood, playerCell[0].oSize);
            for (var i = 0; i < allPossibleThreats.length; i++) {
              var tempD = computeDistance(allPossibleThreats[i].x, allPossibleThreats[i].y, playerCell[0].x, playerCell[0].y);
              ratioX = tempD / (allPossibleThreats[i].x - playerCell[0].x);
              ratioY = tempD / (allPossibleThreats[i].y - playerCell[0].y);
              var offsetX = 0;
              var offsetY = 0;
              if (allPossibleThreats[i].size >= playerCell[0].size * 2.3) {
                offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * 4);
                offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * 4);
              } else if (allPossibleThreats[i].size >= playerCell[0].size * 15) {
                offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX);
                offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY);
              } else {
                offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX);
                offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY);
              }
              //offsetX = ((allPossibleThreats[i].x + playerCell[0].x) / 2);
              //offsetY = ((allPossibleThreats[i].y + playerCell[0].y) / 2);

              drawPoint(offsetX, offsetY, 2);
              iSlope = inverseSlope(allPossibleThreats[i].x, allPossibleThreats[i].y, playerCell[0].x, playerCell[0].y);
              threatLine = pointsOnLine(iSlope, offsetX, offsetY);
              drawLine(allPossibleThreats[i].x, allPossibleThreats[i].y, playerCell[0].x, playerCell[0].y, 3);
              drawLine(threatLine[0][0], threatLine[0][1], threatLine[1][0], threatLine[1][1], 0);
              allThreatLines.push(threatLine);
              var badSide = isSideLine(threatLine[0], threatLine[1], [
                allPossibleThreats[i].x,
                allPossibleThreats[i].y
              ])
              var removeClusterList = [
              ];
              for (var j = 0; j < clusterAllFood.length; j++) {
                if (badSide == isSideLine(threatLine[0], threatLine[1], [
                  clusterAllFood[j][0],
                  clusterAllFood[j][1]
                ])) {
                  removeClusterList.push(j);
                }
              }
              for (var j = removeClusterList.length - 1; j >= 0; j--) {
                drawPoint(clusterAllFood[j][0], clusterAllFood[j][1], 0);
                clusterAllFood.splice(removeClusterList[j], 1);
              }
              if (badSide == isSideLine(threatLine[0], threatLine[1], [
                tempPoint[0],
                tempPoint[1]
              ])) {
                tempPoint[2] = 0;
              }
            }
            for (var i = 0; i < clusterAllFood.length; i++) {
              //console.log("Before: " + clusterAllFood[i][2]);
              clusterAllFood[i][2] = clusterAllFood[i][2] * 6 - computeDistance(clusterAllFood[i][0], clusterAllFood[i][1], playerCell[0].ox, playerCell[0].oy);
              drawPoint(clusterAllFood[i][0], clusterAllFood[i][1], 1);
              //console.log("After: " + clusterAllFood[i][2]);
            }
            if (clusterAllFood.length != 0) {
              biggestCluster = clusterAllFood[0];
              for (var i = 1; i < clusterAllFood.length; i++) {
                if (clusterAllFood[i][2] > biggestCluster[2]) {
                  biggestCluster = clusterAllFood[i];
                }
              }
              /**
                       * #1 Get a list of all the food.
                       * #2 Get a list of all the threats.
                       * #3 Remove all the food near threats.
                       * #4 Find closest food after the filter.
                       */

              for (var i = 0; i < playerCell.length; i++) {
                drawLine(playerCell[i].ox, playerCell[i].oy, biggestCluster[0], biggestCluster[1], 1);
              }
              moveX = biggestCluster[0];
              moveY = biggestCluster[1];
              console.log('X: ' + moveX + ' Y: ' + moveY);
              if (playerCell.length > 1 && splitted) {
                splitted = false;
                moveX = biggestCluster[0];
                moveY = biggestCluster[1];
                return;
              }
              if (splitting) {
                moveX = biggestCluster[0];
                moveY = biggestCluster[1];
                sendServerCommand(17);
                splitting = false;
                splitted = true;
                return;
              }
              if (biggestCluster[2] * 1.25 < playerCell[0].size && !splitted) {
                drawLine(playerCell[0].x, playerCell[0].y, biggestCluster[0], biggestCluster[1], 4);
                var worthyTargetDistance = computeDistance(playerCell[0].x, playerCell[0].y, biggestCluster[0], biggestCluster[1]);
                console.log('I want to split.');
                if ((worthyTargetDistance < playerCell[0].size * 3) && playerCell.length == 1) {
                  moveX = biggestCluster[0];
                  moveY = biggestCluster[1];
                  splitting = true;
                  return;
                }
              }
            }
            drawPoint(tempPoint[0], tempPoint[1], tempPoint[2]);
            tempPoint[2] = 1;
          }
        }
        function drawPoint(x_1, y_1, drawColor) {
          var x1 = ((x_1 - cellX) * screenRatio) + width / 2;
          var y1 = ((y_1 - cellY) * screenRatio) + height / 2;
          //console.log("\tdX: " + x1 + " dY: " + y1);
          dPoints.push([x1,
          y1,
          drawColor]);
        }
        function drawLine(x_1, y_1, x_2, y_2, drawColor) {
          var x1 = ((x_1 - cellX) * screenRatio) + width / 2;
          var y1 = ((y_1 - cellY) * screenRatio) + height / 2;
          var x2 = ((x_2 - cellX) * screenRatio) + width / 2;
          var y2 = ((y_2 - cellY) * screenRatio) + height / 2;
          lines.push([x1,
          y1,
          x2,
          y2,
          drawColor]);
        }
        function sendMovementToServer() { //Sends server mouse position or movement
          //console.log("Nodes Length: " + Object.keys(nodes).length);
          findDestination();
          if (null != ws && ws.readyState == ws.OPEN) {
            var z0 = currentMouseX - width / 2; //z0 and z1 are mouse position relative to the player cell
            var z1 = currentMouseY - height / 2;
            if (!(64 > z0 * z0 + z1 * z1)) { //To keep ball still if the mouse position is in the center of the ball
              if (!(val == moveX && min == moveY)) {
                val = moveX;
                min = moveY;
                z0 = new ArrayBuffer(21);
                z1 = new DataView(z0);
                z1.setUint8(0, 16);
                z1.setFloat64(1, moveX, true);
                z1.setFloat64(9, moveY, true);
                z1.setUint32(17, 0, true);
                ws.send(z0);
              }
            }
          }
        }
        function close() {
          if (null != ws && (ws.readyState == ws.OPEN && null != result)) {
            var buf = new ArrayBuffer(1 + 2 * result.length);
            var view = new DataView(buf);
            view.setUint8(0, 0);
            var i = 0;
            for (; i < result.length; ++i) {
              view.setUint16(1 + 2 * i, result.charCodeAt(i), true);
            }
            ws.send(buf);
          }
        }
        function sendServerCommand(opt_attributes) { //opt_attributes appears to be a server-side command, I don't know what the exact details are
          if (null != ws && ws.readyState == ws.OPEN) {
            /** @type {ArrayBuffer} */
            var buf = new ArrayBuffer(1);
            (new DataView(buf)).setUint8(0, opt_attributes);
            ws.send(buf);
          }
        }
        function anim() {
          draw();
          self.requestAnimationFrame(anim);
        }
        /**
  		 * @return {undefined}
  		 */

        function onResize() {
          width = self.innerWidth;
          height = self.innerHeight;
          tempCanvas.width = canvas.width = width;
          tempCanvas.height = canvas.height = height;
          draw();
        }
        /**
  		 * @return {undefined}
  		 */

        function calculateScreenRatio() {
          if (0 != playerCell.length) {
            var offset = 0;
            var fileIndex = 0;
            for (; fileIndex < playerCell.length; fileIndex++) {
              offset += playerCell[fileIndex].size;
            }
            offset = Math.pow(Math.min(64 / offset, 1), 0.4) * Math.max(height / (970), width / (1920));
            screenRatio = (9 * screenRatio + offset) / 10; //Ratio is used to scale the ball size based on screen size, so that you can still see pretty much the same amount no matter how big your screen is
          }
        }
        /**
  		 * @return {undefined}
  		 */

        function draw() {
          var tick = + new Date;
          ++Ba;
          calculateScreenRatio();
          e = + new Date;
          if (0 < playerCell.length) {
            var w = 0;
            var d = 0;
            var i = 0;
            for (; i < playerCell.length; i++) {
              playerCell[i].updatePos();
              w += playerCell[i].x / playerCell.length;
              d += playerCell[i].y / playerCell.length;
            }
            cellX = (cellX + w) / 2;
            cellY = (cellY + d) / 2;
          }
          processData();
          recalculateDestination();
          canvasContext.clearRect(0, 0, width, height);
          canvasContext.fillStyle = color ? '#111111' : '#F2FBFF';
          canvasContext.fillRect(0, 0, width, height);
          canvasContext.save();
          canvasContext.strokeStyle = color ? '#AAAAAA' : '#000000';
          canvasContext.globalAlpha = 0.2;
          canvasContext.scale(screenRatio, screenRatio);
          w = width / screenRatio;
          d = height / screenRatio;
          i = - 0.5 + ( - cellX + w / 2) % 50;
          for (; i < w; i += 50) { //Draw grid lines vertical
            canvasContext.beginPath();
            canvasContext.moveTo(i, 0);
            canvasContext.lineTo(i, d);
            canvasContext.stroke();
          }
          i = - 0.5 + ( - cellY + d / 2) % 50;
          for (; i < d; i += 50) { //Draw grid lines horizontal
            canvasContext.beginPath();
            canvasContext.moveTo(0, i);
            canvasContext.lineTo(w, i);
            canvasContext.stroke();
          }
          canvasContext.restore();
          items.sort(function (a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size;
          });
          canvasContext.save();
          canvasContext.translate(width / 2, height / 2);
          canvasContext.scale(screenRatio, screenRatio);
          canvasContext.translate( - cellX, - cellY);
          i = 0;
          for (; i < destroyedCells.length; i++) {
            destroyedCells[i].draw();
          }
          i = 0;
          for (; i < items.length; i++) {
            items[i].draw();
          }
          canvasContext.restore();
          if (img) {
            if (0 != leaderboardPlayers.length) {
              canvasContext.drawImage(img, width - img.width - 10, 10);
            }
          }
          closingAnimationTime = Math.max(closingAnimationTime, getHeight());
          if (0 != closingAnimationTime) {
            if (null == button) {
              button = new SVGPlotFunction(24, '#FFFFFF');
            }
            button.setValue('Score: ' + ~~(closingAnimationTime / 100));
            d = button.render();
            w = d.width;
            canvasContext.globalAlpha = 0.2;
            /** @type {string} */
            canvasContext.fillStyle = '#000000';
            canvasContext.fillRect(10, height - 10 - 24 - 10, w + 10, 34);
            canvasContext.globalAlpha = 1;
            canvasContext.drawImage(d, 15, height - 10 - 24 - 5);
          }
          clear();
          tick = + new Date - tick;
          if (tick > 1000 / 60) {
            n_players -= 0.01;
          } else {
            if (tick < 1000 / 65) {
              n_players += 0.01;
            }
          }
          if (0.4 > n_players) {
            n_players = 0.4;
          }
          if (1 < n_players) {
            n_players = 1;
          }
          for (var i = 0; i < dPoints.length; i++) {
            var radius = 10;
            canvasContext.beginPath();
            canvasContext.arc(dPoints[i][0], dPoints[i][1], radius, 0, 2 * Math.PI, false);
            if (dPoints[i][2] == 0) {
              canvasContext.fillStyle = 'black';
            } else if (dPoints[i][2] == 1) {
              canvasContext.fillStyle = 'yellow';
            } else if (dPoints[i][2] == 2) {
              canvasContext.fillStyle = 'blue';
            } else {
              canvasContext.fillStyle = '#000000';
            }
            canvasContext.fill();
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#003300';
            canvasContext.stroke();
          }
          canvasContext.lineWidth = 1;
          for (var i = 0; i < lines.length; i++) {
            canvasContext.beginPath();
            canvasContext.lineWidth = 5;
            if (lines[i][4] == 0) {
              canvasContext.strokeStyle = '#FF0000';
            } else if (lines[i][4] == 1) {
              canvasContext.strokeStyle = '#00FF00';
            } else if (lines[i][4] == 2) {
              canvasContext.strokeStyle = '#0000FF';
            } else if (lines[i][4] == 3) {
              canvasContext.strokeStyle = '#FF8000';
            } else if (lines[i][4] == 4) {
              canvasContext.strokeStyle = '#8A2BE2';
            } else {
              canvasContext.strokeStyle = '#000000';
            }
            canvasContext.moveTo(lines[i][0], lines[i][1]);
            canvasContext.lineTo(lines[i][2], lines[i][3]);
            canvasContext.stroke();
          }
          canvasContext.lineWidth = 1;
        }
        /**
  		 * @return {undefined}
  		 */

        function clear() {
          if (options && skin_image.width) {
            var dim = width / 5;
            canvasContext.drawImage(skin_image, 5, 5, dim, dim);
          }
        }
        /**
  		 * @return {?}
  		 */

        function getHeight() {
          var value = 0;
          var second = 0;
          for (; second < playerCell.length; second++) {
            value += playerCell[second].nSize * playerCell[second].nSize;
          }
          return value;
        }
        function drawLeaderboard() {
          if (0 != leaderboardPlayers.length) {
            if (v) {
              img = document.createElement('canvas');
              var canvasContext = img.getContext('2d');
              var s = 60 + 24 * leaderboardPlayers.length;
              var n = Math.min(200, 0.3 * width) / 200;
              img.width = 200 * n;
              img.height = s * n;
              canvasContext.scale(n, n);
              canvasContext.globalAlpha = 0.4;
              canvasContext.fillStyle = '#000000';
              canvasContext.fillRect(0, 0, 200, s);
              canvasContext.globalAlpha = 1;
              canvasContext.fillStyle = '#FFFFFF';
              n = null;
              n = 'Leaderboard'; //Draws leaderboard from here on
              canvasContext.font = '30px Ubuntu';
              canvasContext.fillText(n, 100 - canvasContext.measureText(n).width / 2, 40);
              canvasContext.font = '20px Ubuntu';
              s = 0;
              for (; s < leaderboardPlayers.length; ++s) {
                n = leaderboardPlayers[s].name || 'An unnamed cell';
                if ( - 1 != playerCell.indexOf(leaderboardPlayers[s].id)) {
                  n = playerCell[0].name;
                }
                if (!v) {
                  if (!(0 != playerCell.length && playerCell[0].name == n)) {
                    /** @type {string} */
                    n = 'An unnamed cell';
                  }
                }
                /** @type {string} */

                n = s + 1 + '. ' + n;
                canvasContext.fillText(n, 100 - canvasContext.measureText(n).width / 2, 70 + 24 * s);
              }
            } else {
              img = null;
            }
          }
        }
        function cell(id, x, y, size, color, isVirus, i) {
          items.push(this);
          nodes[id] = this;
          this.id = id;
          this.ox = this.x = x;
          this.oy = this.y = y;
          this.oSize = this.size = size;
          this.color = color;
          /** @type {string} */
          this.isVirus = isVirus;
          this.points = [
          ];
          this.pointsAcc = [
          ];
          this.createPoints();
          this.setName(i);
        }
        /**
  		 * @param {?} val
  		 * @return {?}
  		 */

        function isArray(val) {
          val = val.toString(16);
          for (; 6 > val.length; ) {
            /** @type {string} */
            val = '0' + val;
          }
          return '#' + val;
        }
        /**
  		 * @param {number} n
  		 * @param {number} Var
  		 * @param {?} stroke
  		 * @param {?} plot
  		 * @return {undefined}
  		 */

        function SVGPlotFunction(n, Var, stroke, plot) {
          if (n) {
            this._size = n;
          }
          if (Var) {
            this._color = Var;
          }
          this._stroke = !!stroke;
          if (plot) {
            this._strokeColor = plot;
          }
        }
        //if ("agar.io" != self.location.hostname && ("localhost" != self.location.hostname && "10.10.2.13" != self.location.hostname)) { //Antihack, probably going to have to remove this at some stage
        /** @type {string} */
        // self.location = "http://agar.io/";
        // } else {
        //Global variables I think

        var originalName; //For storing the original name for use when the bot restarts
        var splitted = false;
        var splitting = false;
        var tempPoint = [
          0,
          0,
          1
        ];
        var splitted = false;
        var splitting = false;
        var dPoints = [
        ];
        var lines = [
        ];
        var tempCanvas;
        var canvasContext;
        var canvas;
        var width;
        var height;
        var context = null;
        var ws = null;
        var cellX = 0;
        var cellY = 0;
        var bucket = [
        ];
        var playerCell = [
        ];
        var nodes = {
        };
        var items = [
        ];
        var destroyedCells = [
        ];
        var leaderboardPlayers = [
        ];
        var currentMouseX = 0;
        var currentMouseY = 0;
        var moveX = - 1;
        var moveY = - 1;
        var Ba = 0;
        var e = 0;
        var result = null;
        var left = 0;
        var bottom = 0;
        var right = 10000;
        var top = 10000;
        var screenRatio = 1;
        var dest = null;
        var $timeout = true;
        var v = true;
        var doneResults = false;
        var aa = false;
        var closingAnimationTime = 0;
        var color = false;
        var text = false;
        var options = 'ontouchstart' in self && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var skin_image = new Image;
        skin_image.src = 'img/split.png';
        var old = null;
        self.setNick = function (subKey) {
          originalName = subKey;
          $('#adsBottom').hide();
          result = subKey;
          console.log(subKey);
          close();
          $('#overlays').hide();
          closingAnimationTime = 0;
        };
        /** @type {function (?): undefined} */
        self.setRegion = done;
        /**
  		 * @param {boolean} _$timeout_
  		 * @return {undefined}
  		 */
        self.setSkins = function (_$timeout_) {
          /** @type {boolean} */
          $timeout = _$timeout_;
        };
        /**
  		 * @param {boolean} o2
  		 * @return {undefined}
  		 */
        self.setNames = function (o2) {
          /** @type {boolean} */
          v = o2;
        };
        /**
  		 * @param {boolean} newColor
  		 * @return {undefined}
  		 */
        self.setDarkTheme = function (newColor) {
          /** @type {boolean} */
          color = newColor;
        };
        /**
  		 * @param {boolean} data
  		 * @return {undefined}
  		 */
        self.setColors = function (data) {
          /** @type {boolean} */
          doneResults = data;
        };
        /**
  		 * @param {boolean} textAlt
  		 * @return {undefined}
  		 */
        self.setShowMass = function (textAlt) {
          /** @type {boolean} */
          text = textAlt;
        };
        /** @type {function (string): undefined} */
        self.connect = open;
        var val = - 1;
        var min = - 1;
        var img = null;
        var n_players = 1;
        var button = null;
        var sources = {
        };
        /** @type {Array.<string>} */
        var excludes = 'a;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;pewdiepie;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;nazi;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;isis;doge;notreallyabot'.split(';');
        var names = [
          'm\'blob'
        ];
        cell.prototype = {
          id: 0,
          points: null,
          pointsAcc: null,
          name: null,
          nameCache: null,
          sizeCache: null,
          x: 0,
          y: 0,
          size: 0,
          ox: 0,
          oy: 0,
          oSize: 0,
          nx: 0,
          ny: 0,
          nSize: 0,
          updateTime: 0,
          updateCode: 0,
          drawTime: 0,
          destroyed: false,
          isVirus: false,
          splitThreat: false,
          /**
  			 * @return {undefined}
  			 */
          destroy: function () {
            var i;
            i = 0;
            for (; i < items.length; i++) {
              if (items[i] == this) {
                items.splice(i, 1);
                break;
              }
            }
            delete nodes[this.id];
            i = playerCell.indexOf(this);
            if ( - 1 != i) {
              /** @type {boolean} */
              aa = true;
              playerCell.splice(i, 1);
            }
            i = bucket.indexOf(this.id);
            if ( - 1 != i) {
              bucket.splice(i, 1);
            }
            this.destroyed = true;
            destroyedCells.push(this);
          },
          getNameSize: function () {
            return Math.max(~~(0.3 * this.size), 24);
          },
          setName: function (name) {
            if (this.name = name) {
              if (null == this.nameCache) {
                this.nameCache = new SVGPlotFunction(this.getNameSize(), '#FFFFFF', true, '#000000');
              } else {
                this.nameCache.setSize(this.getNameSize());
              }
              this.nameCache.setValue(this.name);
            }
          },
          createPoints: function () {
            var max = this.getNumPoints();
            for (; this.points.length > max; ) {
              var i = ~~(Math.random() * this.points.length);
              this.points.splice(i, 1);
              this.pointsAcc.splice(i, 1);
            }
            if (0 == this.points.length) {
              if (0 < max) {
                this.points.push({
                  c: this,
                  v: this.size,
                  x: this.x,
                  y: this.y
                });
                this.pointsAcc.push(Math.random() - 0.5);
              }
            }
            for (; this.points.length < max; ) {
              i = ~~(Math.random() * this.points.length);
              var pt = this.points[i];
              this.points.splice(i, 0, {
                c: this,
                v: pt.v,
                x: pt.x,
                y: pt.y
              });
              this.pointsAcc.splice(i, 0, this.pointsAcc[i]);
            }
          },
          /**
  			 * @return {?}
  			 */
          getNumPoints: function () {
            return ~~Math.max(this.size * screenRatio * (this.isVirus ? Math.min(2 * n_players, 1)  : n_players), this.isVirus ? 10 : 5);
          },
          /**
  			 * @return {undefined}
  			 */
          movePoints: function () {
            this.createPoints();
            var points = this.points;
            var chars = this.pointsAcc;
            var value = chars.concat();
            var rows = points.concat();
            var l = rows.length;
            var i = 0;
            for (; i < l; ++i) {
              var y = value[(i - 1 + l) % l];
              var v = value[(i + 1) % l];
              chars[i] += Math.random() - 0.5;
              chars[i] *= 0.7;
              if (10 < chars[i]) {
                chars[i] = 10;
              }
              if ( - 10 > chars[i]) {
                chars[i] = - 10;
              }
              chars[i] = (y + v + 8 * chars[i]) / 10;
            }
            var flipped = this;
            i = 0;
            for (; i < l; ++i) {
              value = rows[i].v;
              y = rows[(i - 1 + l) % l].v;
              v = rows[(i + 1) % l].v;
              if (15 < this.size) {
                var m = false;
                var startX = points[i].x;
                var startY = points[i].y;
                context.retrieve2(startX - 5, startY - 5, 10, 10, function (vars) {
                  if (vars.c != flipped) {
                    if (25 > (startX - vars.x) * (startX - vars.x) + (startY - vars.y) * (startY - vars.y)) {
                      /** @type {boolean} */
                      m = true;
                    }
                  }
                });
                if (!m) {
                  if (points[i].x < left || (points[i].y < bottom || (points[i].x > right || points[i].y > top))) {
                    /** @type {boolean} */
                    m = true;
                  }
                }
                if (m) {
                  if (0 < chars[i]) {
                    chars[i] = 0;
                  }
                  chars[i] -= 1;
                }
              }
              value += chars[i];
              if (0 > value) {
                value = 0;
              }
              value = (12 * value + this.size) / 13;
              points[i].v = (y + v + 8 * value) / 10;
              y = 2 * Math.PI / l;
              v = this.points[i].v;
              if (this.isVirus) {
                if (0 == i % 2) {
                  v += 5;
                }
              }
              points[i].x = this.x + Math.cos(y * i) * v;
              points[i].y = this.y + Math.sin(y * i) * v;
            }
          },
          /**
  			 * @return {?}
  			 */
          updatePos: function () {
            var A;
            A = (e - this.updateTime) / 120;
            A = 0 > A ? 0 : 1 < A ? 1 : A;
            A = A * A * (3 - 2 * A);
            var getNameSize = this.getNameSize();
            if (this.destroyed && 1 <= A) {
              var idx = destroyedCells.indexOf(this);
              if ( - 1 != idx) {
                destroyedCells.splice(idx, 1);
              }
            }
            this.x = A * (this.nx - this.ox) + this.ox;
            this.y = A * (this.ny - this.oy) + this.oy;
            this.size = A * (this.nSize - this.oSize) + this.oSize;
            if (!this.destroyed) {
              if (!(getNameSize == this.getNameSize())) {
                this.setName(this.name);
              }
            }
            return A;
          },
          shouldRender: function () {
            return this.x + this.size + 40 < cellX - width / 2 / screenRatio || (this.y + this.size + 40 < cellY - height / 2 / screenRatio || (this.x - this.size - 40 > cellX + width / 2 / screenRatio || this.y - this.size - 40 > cellY + height / 2 / screenRatio)) ? false : true;
          },
          draw: function () {
            if (this.shouldRender()) {
              canvasContext.save();
              this.drawTime = e;
              var key = this.updatePos();
              if (this.destroyed) {
                canvasContext.globalAlpha *= 1 - key;
              }
              this.movePoints();
              if (doneResults) {
                canvasContext.fillStyle = '#FFFFFF';
                canvasContext.strokeStyle = '#AAAAAA';
              } else {
                canvasContext.fillStyle = this.color;
                canvasContext.strokeStyle = this.color;
              }
              canvasContext.beginPath();
              canvasContext.lineWidth = 10;
              canvasContext.lineCap = 'round';
              canvasContext.lineJoin = this.isVirus ? 'mitter' : 'round';
              key = this.getNumPoints();
              canvasContext.moveTo(this.points[0].x, this.points[0].y);
              var src = 1;
              for (; src <= key; ++src) {
                var i = src % key;
                canvasContext.lineTo(this.points[i].x, this.points[i].y);
              }
              canvasContext.closePath();
              key = this.name.toLowerCase();
              if ($timeout) {
                if ( - 1 != excludes.indexOf(key)) {
                  if (!sources.hasOwnProperty(key)) {
                    sources[key] = new Image;
                    if (key == 'notreallyabot') {
                      sources[key].src = 'http://i.imgur.com/ZW5T4cd.png';
                    } else {
                      sources[key].src = 'skins/' + key + '.png';
                    }
                  }
                  src = sources[key];
                } else {
                  src = null;
                }
              } else {
                src = null;
              }
              key = src ? - 1 != names.indexOf(key)  : false;
              canvasContext.stroke();
              canvasContext.fill();
              if (null != src) {
                if (0 < src.width) {
                  if (!key) {
                    canvasContext.save();
                    canvasContext.clip();
                    canvasContext.drawImage(src, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                    canvasContext.restore();
                  }
                }
              }
              if (doneResults || 15 < this.size) {
                canvasContext.strokeStyle = '#000000';
                canvasContext.globalAlpha *= 0.1;
                canvasContext.stroke();
              }
              canvasContext.globalAlpha = 1;
              if (null != src) {
                if (0 < src.width) {
                  if (key) {
                    canvasContext.drawImage(src, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                  }
                }
              }
              key = - 1 != playerCell.indexOf(this);
              src = ~~this.y;
              if (v || key) {
                if (this.name) {
                  if (this.nameCache) {
                    i = this.nameCache.render();
                    canvasContext.drawImage(i, ~~this.x - ~~(i.width / 2), src - ~~(i.height / 2));
                    src += i.height / 2 + 4;
                  }
                }
              }
              if (text) {
                if (key) {
                  if (null == this.sizeCache) {
                    this.sizeCache = new SVGPlotFunction(this.getNameSize() / 2, '#FFFFFF', true, '#000000');
                  }
                  this.sizeCache.setSize(this.getNameSize() / 2);
                  this.sizeCache.setValue(~~(this.size * this.size / 100));
                  i = this.sizeCache.render();
                  canvasContext.drawImage(i, ~~this.x - ~~(i.width / 2), src - ~~(i.height / 2));
                }
              }
              canvasContext.restore();
            }
          }
        };
        SVGPlotFunction.prototype = {
          _value: '',
          _color: '#000000',
          _stroke: false,
          _strokeColor: '#000000',
          _size: 16,
          _canvas: null,
          _ctx: null,
          _dirty: false,
          /**
  			 * @param {number} size
  			 * @return {undefined}
  			 */
          setSize: function (size) {
            if (this._size != size) {
              this._size = size;
              /** @type {boolean} */
              this._dirty = true;
            }
          },
          /**
  			 * @param {number} color
  			 * @return {undefined}
  			 */
          setColor: function (color) {
            if (this._color != color) {
              this._color = color;
              /** @type {boolean} */
              this._dirty = true;
            }
          },
          /**
  			 * @param {boolean} stroke
  			 * @return {undefined}
  			 */
          setStroke: function (stroke) {
            if (this._stroke != stroke) {
              /** @type {boolean} */
              this._stroke = stroke;
              /** @type {boolean} */
              this._dirty = true;
            }
          },
          /**
  			 * @param {number} b
  			 * @return {undefined}
  			 */
          setStrokeColor: function (b) {
            if (this._strokeColor != b) {
              this._strokeColor = b;
              /** @type {boolean} */
              this._dirty = true;
            }
          },
          /**
  			 * @param {number} value
  			 * @return {undefined}
  			 */
          setValue: function (value) {
            if (value != this._value) {
              this._value = value;
              this._dirty = true;
            }
          },
          /**
  			 * @return {?}
  			 */
          render: function () {
            if (null == this._canvas) {
              /** @type {Element} */
              this._canvas = document.createElement('canvas');
              this._ctx = this._canvas.getContext('2d');
            }
            if (this._dirty) {
              var style = this._canvas;
              var canvasContext = this._ctx;
              var caracter = this._value;
              var size = this._size;
              /** @type {string} */
              var text = size + 'px Ubuntu';
              /** @type {string} */
              canvasContext.font = text;
              var parentWidth = canvasContext.measureText(caracter).width;
              var PX = ~~(0.2 * size);
              style.width = parentWidth + 6;
              style.height = size + PX;
              /** @type {string} */
              canvasContext.font = text;
              canvasContext.globalAlpha = 1;
              canvasContext.lineWidth = 3;
              canvasContext.strokeStyle = this._strokeColor;
              canvasContext.fillStyle = this._color;
              if (this._stroke) {
                canvasContext.strokeText(caracter, 3, size - PX / 2);
              }
              canvasContext.fillText(caracter, 3, size - PX / 2);
            }
            return this._canvas;
          }
        };
        /** @type {function (): undefined} */
        self.onload = init;
      }) (window, jQuery);
    });
  });
};
