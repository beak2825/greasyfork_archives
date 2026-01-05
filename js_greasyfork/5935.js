// ==UserScript==
// @name       Supremacy Ressource Helper
// @version    0.1
// @description  Can calculate various important statistics for the browsergame Supremacy 1914.
// @match      http://www.supremacy1914.de/play.php?L=1&gameID=*
// @copyright  2014, Zahlii
// @namespace https://greasyfork.org/users/6229
// @downloadURL https://update.greasyfork.org/scripts/5935/Supremacy%20Ressource%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5935/Supremacy%20Ressource%20Helper.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}

addGlobalStyle('td, th { text-align:center; }');

function handleGameSite() {
    var GAME_ID = location.href.match(/gameID=(\d+)/)[1];


    function ArmyCalculator() {
        var mainDiv;
        var mainDocument;
        var mapContainer;
        var ressourceContainer;
        var newspaperContainer;
        var diplomacyTable;
        var diplomacyContainer;
        var provinceContainer;

        var _this = this;

        var hideOverriddenContainer = function() {
            newspaperContainer.style.display = 'none';
            newspaperContainer.style.zIndex = '-1000';
            ressourceContainer.style.display = 'block';
            diplomacyContainer.style.display = 'none';
        };

        this.init = function(main, cont) {
            mainDiv = main;
            mainDocument = cont;
            mapContainer = mainDocument.getElementById('mapContainer');
            ressourceContainer = mainDocument.getElementById('resource_bar');
            newspaperContainer = mainDocument.getElementById('newspaperContainer');
            diplomacyContainer = mainDocument.getElementById('diplomacyContainer');
            provinceContainer = mainDocument.getElementById('provinceListContainer');

            window.setTimeout(function() {
                //mainDocument.getElementById('func_btn_diplomacy').click();

                //diplomacyTable = mainDocument.getElementById('func_diplomacy_table');
                //_this.getDiplomacyData();
            }, 1000);
            _this.Ressources = new Ressources();
            _this.Provinces = new Provinces();
        };
        /*
            var data = [{
                num:30,
                moral:89
            },{
                num:80,
                moral:76
            },{
                num:70,
                moral:89
            }];
            
            
            
            function calcValForPlayer(x) {
                var res = data[x].num * (16 * data[x].moral/100 - 4);
                console.log(x,res);
                return res;
            }
            
            function calcForPlayer(x) {
                var sum = 0;
                for(var i=0,l=data.length;i<l;i++) {
                    sum += calcValForPlayer(i);
                }
                console.log(sum);
                return calcValForPlayer(x)/sum*2000;
            }
            
            alert(calcForPlayer(2));
		*/

        var diplomacyData = [];

        this.getDiplomacyData = function() {
            var r = diplomacyTable.getElementsByClassName('func_player_row');
            var detail;

            var i = 0;

            function handleNext() {
                if (i >= r.length) {
                    handleStop();
                    return;
                }

                var td = r[i].getElementsByTagName('td');
                i++;
                td[10].getElementsByClassName('info_button')[0].click();

                window.setTimeout(function() {

                    detail = mainDocument.getElementById('playerDetailContainer');

                    var ent = detail.getElementsByClassName('detail_entry');

                    var ind = ent.length > 6 ? 5 : 3;
                    diplomacyData.push({
                        playerCountryFlag: td[0].getElementsByTagName('img')[0].src,
                        playerCountryName: td[1].textContent,
                        playerName: td[3].textContent,
                        playerProvinceCount: parseInt(td[4].textContent, 10),
                        playerPowerIndex: parseInt(td[6].textContent),
                        playerIsKI: (td[7].innerHTML.match(/inactive/) ? true : false),
                        playerAvgMoral: parseFloat(ent[ind].getElementsByClassName('sg_float_l')[0].textContent.replace(/%/, ''))
                    });

                    handleNext();
                }, 200);
            }

            function handleStop() {
                window.setTimeout(function() {
                    console.log(diplomacyData);
                    detail.getElementsByClassName('close_button')[0].click();
                    diplomacyContainer.getElementsByClassName('close_button')[0].click();
                }, 100);
            }

            handleNext();
        };

        var stringFill = function(x, n) {
            var s = '';
            for (;;) {
                if (n & 1)
                    s += x;
                n >>= 1;
                if (n)
                    x += x;
                else
                    break;
            }
            return s;
        };

        var pad = function(n, l, p) {
            if (l == null)
                l = 2;
            if (p == null)
                p = '0';
            n = '' + n;

            return stringFill(p, l - n.length) + n;
        };

        var formatInterval = function(time) {
            if (time < 0)
                return '-';

			if(time == Number.POSITIVE_INFINITY)
                return '&infin;';
            
            var days = Math.floor(time / (24 * 3600 * 1000));
            time -= days * (24 * 3600 * 1000);

            var hours = Math.floor(time / (3600 * 1000));
            time -= hours * (3600 * 1000);

            var minutes = Math.floor(time / (60 * 1000));
            time -= minutes * (60 * 1000);

            var seconds = Math.floor(time / 1000);

            var dayS = (days > 1 ? days + ' Tage, ' : (days > 0 ? '1 Tag, ' : ''));
            var hoursS = hours > 0 ? pad(hours) + 'h ' : '';
            var minS = minutes > 0 ? pad(minutes) + 'm ' : '';
            var secS = pad(seconds) + 's';

            return dayS + hoursS + minS + secS;
        }

        var formatTime = function(date) {
            if (date == null)
                date = new Date();
            return pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
        };

        var formatNumber = function(n) {
            return number_format(n, 0, ',', '.');
        };

        var getTime = function(dateStr) {
            var parts = dateStr.split(/[\.\s:]/);
            return new Date(parts[2], parts[1] == 0 ? 11 : parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
        };




        this.displayOverriddenContainer = function(title, content) {
            var html = '    <div class="main_popup_container">' +
                '        <div class="dialog_background_layer_80" id="func_modal_dialog"></div>' +
                '        <div class="metal_panel metal_dialog_header popup_shadow">' +
                '            <div class="metal_dialog_header_deco">' +
                '                <div class="deco-Scharnier"></div>' +
                '            </div>' +
                '            <div class="wooden_panel">' +
                '                <h1 class="capitals autoResizeLine">' + title + '</h1>' +
                '            </div>' +
                '            <div class="metal_dialog_close_area">' +
                '                <div class="close_button metal_dialog_close_button func_close_button">' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '        <div class="metal_panel metal_dialog_body popup_shadow_bottom">' +
                '            <div class="wooden_panel">' +
                '                <div class="wooden_panel_content">' +
                '                    <div class="paper_panel">' +
                '                        <div class="paper_panel_content func_dialog_content">' +
                content +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '    </div>';
            ressourceContainer.style.display = 'none';
            newspaperContainer.style.display = 'block';
            newspaperContainer.innerHTML = html;
            newspaperContainer.style.zIndex = 1005;
            window.setTimeout(function() {
                newspaperContainer.getElementsByClassName('metal_dialog_close_area')[0].addEventListener('click', hideOverriddenContainer);
            }, 100);
        };

        // type IN 'date', 'interval', 'number'
        this.format = function(n, type, symbol) {
            var symbol = symbol === null ? '' : symbol;
            switch (type) {
                case 'date':
                    return formatTime(n);
                case 'interval':
                    return formatInterval(n);
                case 'number':
                    return formatNumber(n) + symbol;
            }
        }

        function Provinces() {
            var self = this;
            var provinces;
            var sumInfo;
            var table;

            var extract = function() {
                provinces = [];
                var tr = table.getElementsByTagName('tr');

                var slots = 0;

                for (var i = 0, l = tr.length; i < l; i++) {
                    var t = tr[i];
                    var td = t.getElementsByTagName('td');

                    var res = td[0].innerHTML.match(/icons-resource_(\d+)(_double)?/);

                    var buildings = td[2].getElementsByClassName('prov_list_building_slot');

                    var bName = ['Festung', 'Hafen', 'Eisenbahn', 'Wehramt', 'Kaserne', 'Fabrik'];

                    var bInfo = {};
                    for (var j = 0, k = buildings.length; j < k; j++) {
                        var b = buildings[j];
                        if (b.innerHTML == '&nbsp;') {
                            bInfo[bName[j]] = {
                                buildingType: bName[j],
                                buildingLevel: 0,
                                buildingIsActive: false,
                                buildingProgress: 0
                            };
                        } else {
                            var level = b.getElementsByClassName('upgrade_level')[0] ? parseInt(b.getElementsByClassName('upgrade_level')[0].textContent, 10) : 1;
                            var progress = b.innerHTML.match(/condition_(\d+)/) ? parseInt(b.innerHTML.match(/condition_(\d+)/)[1], 10) : 100;
                            bInfo[bName[j]] = {
                                buildingType: bName[j],
                                buildingLevel: level,
                                buildingIsActive: level > 1 || progress == 100,
                                buildingProgress: progress
                            };
                        }
                    }


                    var data = {
                        provinceID: parseInt(t.getAttribute('province_id'), 10),
                        provinceRessourceID: parseInt(res[1], 10),
                        provinceIsDouble: (res[2] == '_double'),
                        provinceName: td[1].textContent.trim(),
                        provinceIsCapital: (td[1].innerHTML.match(/non_capital/) ? false : true),
                        provinceBuildings: bInfo,
                        provinceIsBuilding: td[3].innerHTML.match(/icons-infoicon_building/) ? false : true,
                        provinceIsProducing: td[4].innerHTML.match(/icons-infoicon_production/) ? false : true,
                    };

                    var prod = data.provinceIsDouble ? 3136 * 2 : 3136;
                    var tax = data.provinceIsDouble ? 2598 * 2 : 2598;

                    var inc_prod = prod;
                    if (data.provinceBuildings.Hafen.buildingActive) {
                        inc_prod += 0.25 * prod;
                    }
                    if (data.provinceBuildings.Eisenbahn.buildingActive) {
                        inc_prod += 0.33 * prod;
                    }
                    data.provinceMaxProduction = Math.floor(inc_prod, 0);
                    data.provinceMaxTax = tax;
                    data.provinceMightProduce = data.provinceBuildings.Fabrik.buildingIsActive && !data.provinceIsProducing;

                    if (data.provinceMightProduce)
                        slots++;

                    provinces.push(data);

                }

                var mapping = {
                    0:'Nahrung',
                    1:'Nahrung',
                    2:'Baumaterial',
                    3:'Baumaterial',
                    4:'Energie',
                    5:'Energie',
                    6:'Energie',
                    20:'Geld'
                };

                var totalConsume = {
                    'Geld': 0,
                    'Nahrung': 0,
                    'Baumaterial': 0,
                    'Energie': 0
                }, baseConsume = {
                    'Geld': 0,
                    'Nahrung': 0,
                    'Baumaterial': 0,
                    'Energie': 0
                }, totalProduce = {
                    'Geld': 0,
                    'Nahrung': 0,
                    'Baumaterial': 0,
                    'Energie': 0
                }, totalResult = {
                    'Geld': {},
                    'Nahrung': {},
                    'Baumaterial': {},
                    'Energie': {}
                };


                for (var y = 0, o = provinces.length; y < o; y++) {
                    var d = provinces[y];

                    var id = d.provinceRessourceID;
                    var am = d.provinceMaxProduction;

                    totalProduce[mapping[id]] += am;
                    totalProduce['Geld'] += d.provinceMaxTax;
                    
                    totalConsume['Geld'] += 250;
                    totalConsume['Nahrung'] += 800;
                    totalConsume['Baumaterial'] += 800;
                    totalConsume['Energie'] += 800;
                    
                    /*baseConsume['Geld'] += 250;
                    baseConsume['Nahrung'] += 800;
                    baseConsume['Baumaterial'] += 800;
                    baseConsume['Energie'] += 800;*/

                    if (d.provinceBuildings.Kaserne.buildingIsActive) {
                        totalConsume['Nahrung'] += 1000 * d.provinceBuildings.Kaserne.buildingLevel;
                        totalConsume['Geld'] += 500 * d.provinceBuildings.Kaserne.buildingLevel;
                    }
                    if (d.provinceBuildings.Eisenbahn.buildingIsActive) {
                        totalConsume['Energie'] += 500;
                    }
                    
                    
                }

                var k = ['Geld','Nahrung','Baumaterial','Energie'];
                for(var i=0,l=k.length;i<l;i++) {
                    var ck = k[i];
                    var dif = totalProduce[ck] - totalConsume[ck];
                    totalResult[ck] = {
                        amountPerDay:dif,
                        amountPerHour:Math.round(dif/24,2)
                    };
                }

                console.log(totalResult);
                
                sumInfo = {
                    provinceCount: tr.length,
                    freeProducingSlots: slots
                };
            };

            var init = function() {
                table = mainDocument.getElementById('province_table');
                extract();
            }
            init();
        };
        


        function Ressources() {
            var self = this;

            var ressources = [];


            var buildingQueue = [];
            
            this.addBuildingToQueue = function(type) {
                buildingQueue.push({
                    buildingType: type,
                    buildingPosition: buildingQueue.length,
                    buildingRequirements: neededMap[type],
                    buildingInfo:{}
                });
                self.recalculateQueue();
            };
            
            this.removeFromBuildingQueue = function(index) {
  
                
                if(index < 0 || index >= buildingQueue.length) 
                    return;
                
                buildingQueue.splice(index,1);
                self.recalculateQueue();
            };
            
            this.recalculateQueue = function() {

                var currentRes = clone(ressources);
                

                
                for(var i=0,l=buildingQueue.length;i<l;i++) {
                    var e = buildingQueue[i];
                    var n = e.buildingRequirements;

                    var t = self.getTimeNeededForRessource(n, currentRes);
                    
                    for(var prop in n) {
                        if(!n.hasOwnProperty(prop))
                            continue;
                        
                        prop = parseInt(prop,10);
                        
                        self.getRessourceById(prop, currentRes).ressourceAmount -= n[prop];
                    }
                    
                    buildingQueue[i].buildingInfo = t;
                }

            }
            
            var ressourceIdMap = {
                20: 'Geld',
                0: 'Getreide',
                1: 'Fisch',
                2: 'Eisenerz',
                3: 'Holz',
                4: 'Kohle',
                5: 'Öl',
                6: 'Gas'
            };
            
            var lastChosenQueueItem = '';
            
            this.displayBuildingQueue = function() {
                
				var img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACV0lEQVQ4T4WTzW8SQRiH3wUsGNKFXRCwH5hqldoEq0TiB22RIuXixavXGtN40z/EkzFooiaePHlqpQlfbWlSlR6qoiJtNWnV8jml1MpSdl13sLM0gHGS3U1m3ueZ3+zMULDf7gMYhjznE+lEcmLiJxcj/Qe/T7Va38mLg4E3kYTzLgDCYxR+YXj42mi676yNRZm8EH0+42uWYNhzYzzImI3KteVPhdmpBRuWUBh2+S+nj5/uZ8lsxVxBiL2I+ia4v0meabX+0eueacbIKknNWjJdmA2/slHxc4Nfzjjtfc2Ri3kkxIJxX4dSVI/43VOMkZFhUvs28W6FeqzReK64L4QMhoZdTlJEgoJSAMPqW+Ai2uKj4YWx+j+oS5yOEMs0FYoiiLU9gBoPoiAA/JYeqa9Y3uGjHz57J3l+vi4gErfdHmJpWinWagAcB+KeBEvAwYZ2d/nw6urYbYC4vAuyRKXyDHdZQ6zqUEtkXIO4ijD3Y917C2COMHIC3PEEwO8y9UzrOzTtBVVOiOe/tRc8BBgfMfe81P0DJjMiSbKYa0jqCQIAPpe5N0j/ByaSUrUivN6XUI8ArjrN1hla3Rp7WyrEkE59uGVJeGwpu+Glgp36lROsqb/5IJWrFX4ps+FVSMfdYemN0G0kaZRNUfcAWDtjSnXrmCNEUuYq/HJm3TsJMI/7HgC4HRZrhNY0knwvoWyylB+QL9Mp1pyy6BjjDveLf7/ZgIkUS4aOHot0SpLNbZT9iHIDdwBK8jbiS9VN6xez5dJNMnPzsrCki2YCX8tblzCMx/8AF+H3pjKo/BIAAAAASUVORK5CYII=';
                
                function getIcons() {
                    var s = '';
                    
                    for(var prop in ressourceIdMap) {
                        if(!ressourceIdMap.hasOwnProperty(prop))
                            continue;

                        s += '<th>' + self.getRessourceById(parseInt(prop,10)).ressourceIcon +'</th>';
                    }
                    
                    return s;
                }
                
                function getQueue() {
                    var s = '';
                    for(var i=0,l=buildingQueue.length;i<l;i++) {
                        var b = buildingQueue[i];
                        s += '<tr><td>' + (i+1) +'</td><td>' + b.buildingType +'</td>';
                        for(var prop in ressourceIdMap) {
                            if(!ressourceIdMap.hasOwnProperty(prop))
                                continue;
                            
                            var t = typeof b.buildingRequirements[prop];
                            
                            var a =  t !== 'undefined' ? _this.format(b.buildingRequirements[prop],'number',self.getRessourceById(parseInt(prop,10)).ressourceSymbol) : '-';
                            
                            s += '<td>' + a + '</td>';
                        }
                        
                        var cls = b.buildingInfo.isPossible ? 'resource_bar_rate_positive' : 'resource_bar_rate_negative';
                        
                        s += '<td class="'+cls+'">' + b.buildingInfo.possibleFromString +'</td><td class="'+cls+'">' + b.buildingInfo.possibleUntilString +'</td>';
                        s += '<td><img class="remove_building_queue" id="remove-' + i +'" src="'+img+'" style="cursor:pointer;" alt="X" /></td>';
                    }
                    
                    return s +'</tr>';
                };
                
                var tbl = '<table class="full" id="building-queue" style="width:800px"><thead><tr><th>#</th><th>Typ</th>' + getIcons() + '<th>Möglich ab</th><th>Möglich bis</th><th>&nbsp;</th></tr></thead><tbody>'+getQueue()+'</tbody></table>';
                
                var sel = '<select id="select_projects">';
                for(var prop in neededMap) {
                    if(!neededMap.hasOwnProperty(prop))
                       continue;
                       
                    var issel = lastChosenQueueItem == prop ? 'selected="selected"' : '';
                    sel += '<option value="'+prop+'" '+issel+'>'+prop+'</option>';   
                }
                
                
				sel += '</select><div id="input_queue_submit" class="default_button">Einreihen</div>';
                _this.displayOverriddenContainer('Bauwarteschlange','<h2>Folgende Projekte sind eingereiht</h2>'+tbl+sel);
            
                window.setTimeout(function() {
                    var sub = mainDocument.getElementById('input_queue_submit');
                    sub.addEventListener('click',function() {
                        var v = mainDocument.getElementById('select_projects').value;
                        lastChosenQueueItem = v;
                        self.addBuildingToQueue(v);
                        self.displayBuildingQueue();
                    });
                    var t = mainDocument.getElementsByClassName('remove_building_queue');
                    for(var i=0, l=t.length;i<l;i++) {
                        var x = t[i];
                        
                        
                        
                        x.addEventListener('click', function(event) {
                            var e = event.target || event.srcElement;
                            var index = parseInt(e.id.split('-')[1],10);
                            self.removeFromBuildingQueue(index);
                            self.displayBuildingQueue();
                        });
                    }
                },100);
            }
            
            
            
            
            
            

            var neededMap = {
                'Wehramt': {
                    20: 1000,
                    2: 250,
                    3: 250
                },
                'Werkstatt': {
                    20: 1000,
                    2: 500,
                    3: 500,
                    5: 500
                },
                'Kaserne': {
                    20: 4000,
                    0: 1500,
                    3: 1500
                },
                'Festung': {
                    20: 4000,
                    2: 2000
                },
                'Hafen': {
                    20: 10000,
                    3: 10000
                },
                'Eisenbahn': {
                    20: 10000,
                    3: 5000,
                    2: 3000,
                    4: 1000
                },
                'Fabrik': {
                    20: 10000,
                    2: 2500,
                    3: 2500,
                    5: 2500
                },
                'Panzerwagen': {
                    20: 7000,
                    2: 2000,
                    5: 1500
                },
                'Artillerie': {
                    20: 10000,
                    2: 3000,
                    5: 2000
                },
                'Panzer': {
                    20: 20000,
                    2: 5000,
                    5: 3000
                },
                'EBG': {
                    20: 50000,
                    2: 10000,
                    3: 5000,
                    4: 5000,
                    5: 10000
                },
                'Schlachtschiff': {
                    20: 50000,
                    2: 15000,
                    3: 5000,
                    4: 10000,
                    5: 5000
                }
            };
            
            var lastInput = {};

            var extract = function() {
                ressources = [];
                var li = ressourceContainer.getElementsByTagName('li');
                for (var i = 0, l = li.length; i < l; i++) {
                    var liE = li[i];

                    var amnt = liE.getElementsByClassName('resource_bar_amount')[0];
                    if (typeof amnt === 'undefined')
                        continue;
                    var entry = amnt.parentNode;



                    var rate = entry.getElementsByTagName('div')[1];
                    var resID = parseInt(liE.getAttribute('resource_id'));

                    amnt = parseInt(amnt.textContent.replace(/\./, ''), 10);
                    rate = parseInt(rate.textContent.replace(/\./, '').replace(/\s\/h/, ''), 10);

                    var time = (rate >= 0 ? -1 : amnt / Math.abs(rate) * 3600 * 1000);

                    ressources.push({
                        ressourceName: ressourceIdMap[resID],
                        ressourceBarEntry: entry,
                        ressourceID: resID,
                        ressourceAmount: amnt,
                        ressourceRate: rate,
                        ressourceTimeLeft: time,
                        ressourceTimeLeftText: _this.format(time, 'interval'),
                        ressourceSymbol: resID === 20 ? '£' : 't',
                        ressourceIcon: '<div class="icons-resource_' + resID + ' resource_bar_icon"></div>'
                    });
                }
            }
            this.getRessourceInfo = function() {
                return ressources;
            }
            this.getRessourceById = function(id, res) {
                res = res == null ? ressources : res;
                for (var i = 0, l = res.length; i < l; i++) {

                    if (res[i].ressourceID === id)
                        return res[i];
                }
            }
            this.getRessourceByName = function(name, res) {
                res = res == null ? ressources : res;
                for (var i = 0, l = res.length; i < l; i++) {
                    if (res[i].ressourceName === name)
                        return res[i];
                }
            }
            this.updateTimeLeftDisplay = function() {
                for (var i = 0, l = ressources.length; i < l; i++) {
                    var res = ressources[i];
                    if (mainDocument.getElementById('time_left_for_' + res.ressourceID) == null) {
                        res.ressourceBarEntry.innerHTML += '<div id="time_left_for_' + res.ressourceID + '"></div>';
                    }

                    var timeLeft = mainDocument.getElementById('time_left_for_' + res.ressourceID);
                    timeLeft.className = res.ressourceTimeLeft > 0 ? 'resource_bar_rate_negative' : 'resource_bar_rate_positive';
                    timeLeft.innerHTML = res.ressourceTimeLeftText;
                }
            };

            this.getTimeNeededForRessource = function(need, base) {
                var mintime = Number.NEGATIVE_INFINITY; // from when to
                var maxtime = Number.POSITIVE_INFINITY; // when can it be built
                var isPossible = true;
                
                for (var prop in need) {
                    if (!need.hasOwnProperty(prop))
                        continue;
                    
                    
                    var r = self.getRessourceById(parseInt(prop, 10), base);
                    var dif = need[prop] - r.ressourceAmount;
                    
                    var time = dif / r.ressourceRate * 3600 * 1000;
                    if (need[prop] <= 0) {
                        continue;
                    } else {
                        if (dif < 0 && r.ressourceRate < 0) {// mehr da, nimmt aber ab
                            if(time < maxtime)
                                maxtime = time;
                        }
                        
                        if (dif < 0 && r.ressourceRate > 0) {// mehr da, nimmt zu
                            continue;
                        }
                        
                        if (dif > 0 && r.ressourceRate < 0) {// weniger da, nimmt ab
                            isPossible = false;
                            break;
                        }
                        
                        if (dif > 0 && r.ressourceRate > 0) {// weniger da, nimmt zu
                            if(time > mintime)
                                mintime = time;
                        }
                        
                    }                  
                }
				mintime = Math.max(0,mintime);
                maxtime = Math.max(0,maxtime);
                
                return {
                    isPossible:isPossible,
                    possibleFrom:mintime,
                    possibleFromString:_this.format(mintime +'','interval'),
                    possibleUntil:Math.max(0,maxtime),
                    possibleUntilString:_this.format(maxtime +'','interval'),
                };
            };
            
            var addTimeButton = function() {
                var ul = ressourceContainer.getElementsByTagName('ul')[0];
                if (mainDocument.body.innerHTML.indexOf('time_button"') === -1) {
                    ul.innerHTML += '<li><input type="button" value="Ressourcen zu Zeitpunkt" id="time_button" class="default_button" /></li>';
                }
                window.setTimeout(function() {
                    mainDocument.getElementById('time_button').addEventListener('click', function() {
                        var dn = new Date();
                        _this.displayOverriddenContainer('Ressourcen zu Zeitpunkt', '<h1>Bitte das Datum eingeben, für das Du die Ressourcen hochrechnen möchtest</h1>' + '<input type="text" value="' + formatTime() + '" id="input_date" /><div id="input_date_submit" class="default_button">Hochrechnen</div><br />' + '<table class="full" id="input_date_result" style="width:500px;">' + '<thead>' + '<tr><th>&nbsp;</th><th>Ressource</th><th>Vorrat</th><th>Veränderung</th></tr>' + '</thead>' + '<tbody>' + '</tbody>' + '</table>');

                        window.setTimeout(function() {
                            mainDocument.getElementById('input_date_submit').addEventListener('click', function() {
                                var d = mainDocument.getElementById('input_date').value;
                                d = getTime(d);

                                var time_dif = d.getTime() - (new Date()).getTime();

                                var tbody = mainDocument.getElementById('input_date_result').getElementsByTagName('tbody')[0];
                                tbody.innerHTML = '';

                                for (var i = 0, l = ressources.length; i < l; i++) {
                                    var r = ressources[i];
                                    var c = time_dif / (3600 * 1000) * r.ressourceRate;
                                    var a = r.ressourceAmount + c;
                                    var txt = _this.format(a, 'number', r.ressourceSymbol);
                                    var chng = _this.format(c, 'number', r.ressourceSymbol);
                                    var cls = c < 0 ? 'resource_bar_rate_negative' : 'resource_bar_rate_positive';
                                    var rowHtml = '<tr><td>' + r.ressourceIcon + '</td><td>' + r.ressourceName + '</td><td>' + txt + '</td><td><div class="' + cls + '">' + chng + '</div></td></tr>';
                                    tbody.innerHTML += rowHtml;
                                }
                            });
                        }, 100);
                    });
                }, 100);
            }

            var addRessourceButton = function() {
                var ul = ressourceContainer.getElementsByTagName('ul')[0];
                if (mainDocument.body.innerHTML.indexOf('time_button_2"') === -1) {
                    ul.innerHTML += '<li><input type="button" value="Zeit für Ressourcen" id="time_button_2" class="default_button" /></li>';
                }
                window.setTimeout(function() {
                    mainDocument.getElementById('time_button_2').addEventListener('click', function() {
                        var selStr = '<table style="width:500px;" id="input_projects"><thead><tr><th>Projekt</th><th>Anzahl</th></tr></thead><tbody>';
                        for (var prop in neededMap) {
                            if (!neededMap.hasOwnProperty(prop))
                                continue;

                            selStr += '<tr><td>' + prop + '</td><td><input type="number" style="width:50px;" name="amount_' + prop + '" size="3" value="'+(lastInput[prop] ? lastInput[prop] : 0) +'" min="0" class="project"/></td></tr>';
                        }
                        selStr += '</tbody></table>';
                        _this.displayOverriddenContainer('Zeit für Ressourcen', '<h1>Wähle aus folgenden Bauprojekten:</h1>' + selStr +
                            '<br /><div id="input_date_submit_2" class="default_button">Zeitbedarf berechnen</div><br />' + '<table class="full" id="result_total_need" style="width:500px;">' + '<thead>' + '<tr><th>&nbsp;</th><th>Ressource</th><th>Insgesamt Benötigt</th><th>Zeit verbleibend</th></tr>' + '</thead>' + '<tbody>' + '</tbody>' + '</table>');

                        window.setTimeout(function() {
                            mainDocument.getElementById('input_date_submit_2').addEventListener('click', function() {
                                var el = mainDocument.getElementById('input_projects').getElementsByClassName('project');
                                var need = {};
                                for (var i = 0, l = el.length; i < l; i++) {
                                    var descr = el[i].name.split('_')[1];
                                    
                                    
                                    var n = neededMap[descr];
                                    var am = parseInt(el[i].value, 10);
                                    lastInput[descr] = am;
                                    
                                    if (!n)
                                        alert(n);

                                    for (var prop in n) {
                                        if (!n.hasOwnProperty(prop))
                                            continue;

                                        if (!need[prop])
                                            need[prop] = 0;

                                        need[prop] += am * n[prop];
                                    }
                                }
                                var tbody = mainDocument.getElementById('result_total_need').getElementsByTagName('tbody')[0];
                                tbody.innerHTML = '';
                                for (var prop in need) {
                                    if (!need.hasOwnProperty(prop))
                                        continue;


                                    var r = self.getRessourceById(parseInt(prop, 10));
           
                                    var dif = need[prop] - r.ressourceAmount;
                                    var time = dif / r.ressourceRate * 3600 * 1000;
                                    var str = '', cls = '';

                                    if (need[prop] <= 0) {
                                        str = 'Nicht benötigt.';
                                        cls = 'resource_bar_rate_positive';
                                    } else {
                                        if (dif < 0 && r.ressourceRate < 0) {// mehr da, nimmt aber ab
                                            str = 'Möglich bis in ' + _this.format(time, 'interval') + '.';
                                            cls = 'resource_bar_rate_positive';
                                        }

                                        if (dif < 0 && r.ressourceRate > 0) {// mehr da, nimmt zu
                                            str = 'Vorhanden.';
                                        	cls = 'resource_bar_rate_positive';
                                        }

                                        if (dif > 0 && r.ressourceRate < 0) {// weniger da, nimmt ab
                                            str = 'Nicht möglich.';
                                            cls = 'resource_bar_rate_negative';
                                        }

                                        if (dif > 0 && r.ressourceRate > 0) {// weniger da, nimmt zu
                                            str = 'Möglich ab ' + _this.format(time, 'interval') + '.';
                                            cls = 'resource_bar_rate_negative';
                                        }

                                    }
                                    var rowHtml = '<tr><td>' + r.ressourceIcon + '</td><td>' + r.ressourceName + '</td><td>' + _this.format(need[prop], 'number', r.ressourceSymbol) + '</td><td><div class="'+cls+'">' + str + '</div></td></tr>';
                                    tbody.innerHTML += rowHtml;
                                }
                            });
                        }, 100);
                    });
                }, 100);
            }

            var addQueueButton = function() {
                var ul = ressourceContainer.getElementsByTagName('ul')[0];
                if (mainDocument.body.innerHTML.indexOf('queue_button"') === -1) {
                    ul.innerHTML += '<li><input type="button" class="default_button" value="Bauwarteschlange" id="queue_button" /></li>';
                }
                 window.setTimeout(function() {
                    mainDocument.getElementById('queue_button').addEventListener('click', function() {
                        self.displayBuildingQueue();
                    });
                 });
            };

            var init = function() {
                hideOverriddenContainer(); //nicer layout
                addTimeButton();
                addRessourceButton();
                addQueueButton();
                extract();
                self.updateTimeLeftDisplay();

            };
            init();
            var run = function() {
                extract();
                self.updateTimeLeftDisplay();
            };
            window.setInterval(run, 2000);
        }

    };


    var intervalStart = window.setInterval(handle, 500);

    function number_format(number, decimals, dec_point, thousands_sep) {

        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }

    function handle() {
        var ifm = document.getElementById('ifm');

        if (ifm == null || typeof ifm === 'undefined' || ifm.contentWindow == null || ifm.contentWindow.document == null)
            return;

        var contWind = ifm.contentWindow.document;
        var main = contWind.getElementById('s1914');

        if (main == null || typeof main === 'undefined' || main.innerHTML == null)
            return;



        if (~main.innerHTML.indexOf('Global')) {
            window.clearInterval(intervalStart);
            (new ArmyCalculator()).init(main, contWind);
        }
    }
}



handleGameSite();
