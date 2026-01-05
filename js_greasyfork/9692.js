// ==UserScript==
// @name         SGWG Building
// @namespace    ui
// @version      0.3
// @author       Ondřej Jodas
// @match        http://sgwg.net/stavby.php
// @match        http://stargate-dm.cz/stavby.php
// @description  Stavba na sgwg z přehledu
// @downloadURL https://update.greasyfork.org/scripts/9692/SGWG%20Building.user.js
// @updateURL https://update.greasyfork.org/scripts/9692/SGWG%20Building.meta.js
// ==/UserScript==
$.widget('ui.buildings', {
    _create : function() {
        var self = this,
            element = self.element;
        
        self._antihack = self.options.antihack;
        
        self._elementsRows = element.find('tr');
        
        self._fillData();
        
        $('.build').click(function() {
            var button = this;
            $(button).html('Stavím')
            $(this).build({
                building: $('#selectBuilding').val(),
                typeBuilding: $('#selectTypeBuilding').val(),
                whereBuild: $('#whereBuild').val(),
                count: $('#count').val(),
                complete: function(){
                    $(button).html('Postaveno');
                }
            });
        });
    },
    
    _fillData : function() {
        var self = this._elementsRows,
            antihack = this._antihack;
        $.each(self, function(key, value){
            var tdElement = $('<th></th>', {
                    class : 'title',
                    style: 'width: 140px'
            }).html('Hustakovo stavění');
            // Na druhý řádek dám výběr stavby
            if (key == 1) {
                var selectElement = $('<select>', {
                    id : 'selectBuilding',
                    style: 'width:70px'
                })
                .append($('<option>', {value: '2', html: 'NAQ extraktor'}))
                .append($('<option>', {value: '3', html: 'TRI separátor'}))
                .append($('<option>', {value: 'c', html: 'Mincovna'}))
                .append($('<option>', {value: '6', html: 'Laboratoře'}))
                .append($('<option>', {value: '7', html: 'Loděnice'}))
                .append($('<option>', {value: '1', html: 'Město'}))
                .append($('<option>', {value: '5', html: 'Kasárna'}))
                .append($('<option>', {value: 'a', html: 'Generátor'}))
                .append($('<option>', {value: 'b', html: 'Hvězdný portál'}))
                .append($('<option>', {value: 'z', html: 'Zbořit'}));
                
                var selectTypeElement = $('<select>', {
                    id : 'selectTypeBuilding',
                    style: 'width:70px'
                })
                .append($('<option>', {value: 'průmyslová', html: 'Průmyslová'}))
                .append($('<option>', {value: 'vojenská', html: 'Vojenská'}))
                .append($('<option>', {value: 'civilní', html: 'Civilní'}));
                
                var countElement = $('<select>', {
                    id: 'count',
                    style: 'width:70px'
                });
                for (i=1;i<=10;i++) {
                    countElement.append($('<option>', {value: i, html: i}));
                }
                
                var whereBuild = $('<select>', {
                    id: 'whereBuild',
                    style: 'width:70px'
                })
                .append($('<option>', {value: 'free', html: 'Na volných místech'}))
                .append($('<option>', {value: 'all', html: 'Všude (přepíše stávající budovy)'}));
                
                tdElement = $('<th></th>', {
                    class : 'title building'
                }).html(selectElement.after(selectTypeElement).after(countElement).after(whereBuild));
            } else
            // Od třetího řádku přidám sloupeček se stavěním
            if (key > 1) {
                var columns = $(this).find('td');
                var res = $(columns[0]).html().match(/(\d{1,10})/g);
                var planetId = res[0];
                var maxBuilding = $(columns[4]).html();
                // Vytvořím další sloupeček
                if (maxBuilding != 0 ){
                    var text = 'Postavit';
                    if ($(columns[3]).html() == '0 (64)') {
                        text = '--- Přestavět ---';
                    }
                    tdElement = $('<td></td>', {
                        class : 'build',
                        'data-planet-id' : planetId,
                        'data-antihack' : antihack,
                        'data-max-building' : maxBuilding,
                        style : 'text-decoration: underline; cursor: pointer;'
                    }).html(text);
                } else {
                    tdElement = $('<td></td>');
                }
            }
            $(this).append(tdElement);
        });
    }
});

$.widget('ui.build', {
    _create: function() {
        var self = this;
        self._planetId = self.element.data('planet-id');
        self._antihack = self.element.data('antihack');
        self._maxBuilding = parseInt(self.element.data('max-building'));
        self._listBuildingsForBuild = {};
        self._downloadData();
    },
    
    _downloadData: function() {
        var self = this;
        $.ajax({
            type: "POST",
            url: '/stavby.php?nap='+self._planetId,
            data: {},
            success: function(data) {
                var pocet = 0;
                for (i=1; i <=64; i++) {
                    var hiddenBuilding = $(data).find('#hh'+i).val();
                    var building = $(data).find("#pp"+i);
                    
                    // Rohodnutí zda zde budu stavět
                    var hereBuild = false;
                    if (building.attr('alt') == self.options.typeBuilding) {
                        hereBuild = true;
                    }
                    if (self.options.whereBuild == 'all') {
                        var typeBuilding = building.attr('onClick').match(/\'t(.){1}\'/g); // typ budovy: 1 - prumyslova; 2 - vojenska; 3 - civilni  
                        if (self.options.typeBuilding == 'průmyslová' && typeBuilding == "'t1'" && self.options.building != hiddenBuilding) {
                            hereBuild = true;
                        } else if (self.options.typeBuilding == 'vojenská' && typeBuilding == "'t2'" && self.options.building != hiddenBuilding) {
                            hereBuild = true;
                        } else if (self.options.typeBuilding == 'civilní' && typeBuilding == "'t3'" && self.options.building != hiddenBuilding) {
                            hereBuild = true;
                        }
                    }
                    
                    
                    self._listBuildingsForBuild['h'+i] = hiddenBuilding;
                    if (hereBuild === true && (pocet < self._maxBuilding && pocet < self.options.count)) {
                        self._listBuildingsForBuild['h'+i] = self.options.building;
                        pocet = pocet + 1;
                    }
                }
                self._build();
            },
        });
    },
    
    _build: function() {
        var self = this;
        var data = self._listBuildingsForBuild;
        data.nap = self._planetId;
        data.antihack = self._antihack;
        //console.log(data);
        $.ajax({
            type: "POST",
            url: '/stavby.php?nap='+this._planetId,
            data: data,
            success: function(){
                self._trigger("complete");
            }
        });
    }
});

$(function(){
    var antihack = $( "input[name='antihack']" ).val();
    $('.data2').buildings({antihack: antihack});
});