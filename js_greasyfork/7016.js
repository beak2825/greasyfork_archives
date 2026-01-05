// ==UserScript==
// @name        CNCOpt + Alliance POI Analyser - by flyerdp
// @description Two usefull scripts for C&C Tiberium Alliance.
// @version     1
// @namespace   http*://*alliances*.com/*
// @include     http*://*alliances*.com/*
// @icon        http://s3.amazonaws.com/uso_ss/icon/171353/large.png?1371656082
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
/* 
Pack list : 
 1 - Infernal Wrapper (API needed) *version 0.390737.5*
 2 - CNCOpt Link Button *version 1.7.6*
 3 - POIs Analyser *version 2.0.1*
*/



/***********************************************************************************
CNCOpt Link Button
***********************************************************************************/

// ==UserScript==
// @name          C&C:TA CNCOpt Link Button for SC
// @namespace     http://cncopt.com/
// @icon          http://cncopt.com/favicon.ico
// @description   Creates a "CNCOpt" button when selecting a base in Command & Conquer: Tiberium Alliances. The share button takes you to http://cncopt.com/ and fills in the selected base information so you can analyze or share the base.
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include       http*://*.cncopt.com/*
// @include       http*://cncopt.com/*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @contributor   PythEch (http://http://userscripts.org/users/220246)
// @contributor   jerbri (http://userscripts.org/users/507954)
// @contributor   Der_Flake
// @downloadURL https://update.greasyfork.org/scripts/7016/CNCOpt%20%2B%20Alliance%20POI%20Analyser%20-%20by%20flyerdp.user.js
// @updateURL https://update.greasyfork.org/scripts/7016/CNCOpt%20%2B%20Alliance%20POI%20Analyser%20-%20by%20flyerdp.meta.js
// ==/UserScript==
/* 

2013-03-03: Special thanks to jerbri for fixing this up so it worked again!
2012-11-25: Special thanks to PythEch for fixing this up so it worked again!

*/
var scity = null;
var tcity = null;
var tbase = null;
try {
  unsafeWindow.__cncopt_version = "1.7.6";
  (function () {
    var cncopt_main = function () {

      var defense_unit_map = {
        /* GDI Defense Units */"GDI_Wall": "w",
        "GDI_Cannon": "c",
        "GDI_Antitank Barrier": "t",
        "GDI_Barbwire": "b",
        "GDI_Turret": "m",
        "GDI_Flak": "f",
        "GDI_Art Inf": "r",
        "GDI_Art Air": "e",
        "GDI_Art Tank": "a",
        "GDI_Def_APC Guardian": "g",
        "GDI_Def_Missile Squad": "q",
        "GDI_Def_Pitbull": "p",
        "GDI_Def_Predator": "d",
        "GDI_Def_Sniper": "s",
        "GDI_Def_Zone Trooper": "z",
        /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
        "NOD_Def_Art Air": "e",
        "NOD_Def_Art Inf": "r",
        "NOD_Def_Art Tank": "a",
        "NOD_Def_Attack Bike": "p",
        "NOD_Def_Barbwire": "b",
        "NOD_Def_Black Hand": "z",
        "NOD_Def_Cannon": "c",
        "NOD_Def_Confessor": "s",
        "NOD_Def_Flak": "f",
        "NOD_Def_MG Nest": "m",
        "NOD_Def_Militant Rocket Soldiers": "q",
        "NOD_Def_Reckoner": "g",
        "NOD_Def_Scorpion Tank": "d",
        "NOD_Def_Wall": "w",

        /* Forgotten Defense Units */"FOR_Wall": "w",
        "FOR_Barbwire_VS_Inf": "b",
        "FOR_Barrier_VS_Veh": "t",
        "FOR_Inf_VS_Inf": "g",
        "FOR_Inf_VS_Veh": "r",
        "FOR_Inf_VS_Air": "q",
        "FOR_Sniper": "n",
        "FOR_Mammoth": "y",
        "FOR_Veh_VS_Inf": "o",
        "FOR_Veh_VS_Veh": "s",
        "FOR_Veh_VS_Air": "u",
        "FOR_Turret_VS_Inf": "m",
        "FOR_Turret_VS_Inf_ranged": "a",
        "FOR_Turret_VS_Veh": "v",
        "FOR_Turret_VS_Veh_ranged": "d",
        "FOR_Turret_VS_Air": "f",
        "FOR_Turret_VS_Air_ranged": "e",
        "": ""
      };

      var offense_unit_map = {
        /* GDI Offense Units */"GDI_APC Guardian": "g",
        "GDI_Commando": "c",
        "GDI_Firehawk": "f",
        "GDI_Juggernaut": "j",
        "GDI_Kodiak": "k",
        "GDI_Mammoth": "m",
        "GDI_Missile Squad": "q",
        "GDI_Orca": "o",
        "GDI_Paladin": "a",
        "GDI_Pitbull": "p",
        "GDI_Predator": "d",
        "GDI_Riflemen": "r",
        "GDI_Sniper Team": "s",
        "GDI_Zone Trooper": "z",

        /* Nod Offense Units */"NOD_Attack Bike": "b",
        "NOD_Avatar": "a",
        "NOD_Black Hand": "z",
        "NOD_Cobra": "r",
        "NOD_Commando": "c",
        "NOD_Confessor": "s",
        "NOD_Militant Rocket Soldiers": "q",
        "NOD_Militants": "m",
        "NOD_Reckoner": "k",
        "NOD_Salamander": "l",
        "NOD_Scorpion Tank": "o",
        "NOD_Specter Artilery": "p",
        "NOD_Venom": "v",
        "NOD_Vertigo": "t",
        "": ""
      };


      function findTechLayout(city) {
        for (var k in city) {
          //console.log(typeof(city[k]), "1.city[", k, "]", city[k])
          if ((typeof (city[k]) == "object") && city[k] && 0 in city[k] && 8 in city[k]) {
            if ((typeof (city[k][0]) == "object") && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0]) {
              if ((typeof (city[k][0][0]) == "object") && city[k][0][0] && "BuildingIndex" in city[k][0][0]) {
                return city[k];
              }
            }
          }
        }
        return null;
      }

      function findBuildings(city) {
        var cityBuildings = city.get_CityBuildingsData();
        for (var k in cityBuildings) {
          if (PerforceChangelist >= 376877) {
            if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0) {
              return cityBuildings[k].d;
            }
          } else {
            if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
              return cityBuildings[k].l;
            }
          }
        }
      }

      function isOffenseUnit(unit) {
        return (unit.get_UnitGameData_Obj().n in offense_unit_map);
      }

      function isDefenseUnit(unit) {
        return (unit.get_UnitGameData_Obj().n in defense_unit_map);
      }

      function getUnitArrays(city) {
        var ret = [];
        for (var k in city) {
          if ((typeof (city[k]) == "object") && city[k]) {
            for (var k2 in city[k]) {
              if (PerforceChangelist >= 376877) {
                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
                  var lst = city[k][k2].d;
                  if ((typeof (lst) == "object") && lst) {
                    for (var i in lst) {
                      if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                        ret.push(lst);
                      }
                    }
                  }
                }
              } else {
                if ((typeof (city[k][k2]) == "object") && city[k][k2] && "l" in city[k][k2]) {
                  var lst = city[k][k2].l;
                  if ((typeof (lst) == "object") && lst) {
                    for (var i in lst) {
                      if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                        ret.push(lst);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return ret;
      }

      function getDefenseUnits(city) {
        var arr = getUnitArrays(city);
        for (var i = 0; i < arr.length; ++i) {
          for (var j in arr[i]) {
            if (isDefenseUnit(arr[i][j])) {
              return arr[i];
            }
          }
        }
        return [];
      }

      function getOffenseUnits(city) {
        var arr = getUnitArrays(city);
        for (var i = 0; i < arr.length; ++i) {
          for (var j in arr[i]) {
            if (isOffenseUnit(arr[i][j])) {
              return arr[i];
            }
          }
        }
        return [];
      }


      function cncopt_create() {
        console.log("CNCOpt Link Button v" + window.__cncopt_version + " loaded");
        var cncopt = {
          selected_base: null,
          keymap: {
            /* GDI Buildings */"GDI_Accumulator": "a",
            "GDI_Refinery": "r",
            "GDI_Trade Center": "u",
            "GDI_Silo": "s",
            "GDI_Power Plant": "p",
            "GDI_Construction Yard": "y",
            "GDI_Airport": "d",
            "GDI_Barracks": "b",
            "GDI_Factory": "f",
            "GDI_Defense HQ": "q",
            "GDI_Defense Facility": "w",
            "GDI_Command Center": "e",
            "GDI_Support_Art": "z",
            "GDI_Support_Air": "x",
            "GDI_Support_Ion": "i",
            /* Forgotten Buildings */"FOR_Silo": "s",
            "FOR_Refinery": "r",
            "FOR_Tiberium Booster": "b",
            "FOR_Crystal Booster": "v",
            "FOR_Trade Center": "u",
            "FOR_Defense Facility": "w",
            "FOR_Construction Yard": "y",
            "FOR_Harvester_Tiberium": "h",
            "FOR_Defense HQ": "q",
            "FOR_Harvester_Crystal": "n",
            /* Nod Buildings */"NOD_Refinery": "r",
            "NOD_Power Plant": "p",
            "NOD_Harvester": "h",
            "NOD_Construction Yard": "y",
            "NOD_Airport": "d",
            "NOD_Trade Center": "u",
            "NOD_Defense HQ": "q",
            "NOD_Barracks": "b",
            "NOD_Silo": "s",
            "NOD_Factory": "f",
            "NOD_Harvester_Crystal": "n",
            "NOD_Command Post": "e",
            "NOD_Support_Art": "z",
            "NOD_Support_Ion": "i",
            "NOD_Accumulator": "a",
            "NOD_Support_Air": "x",
            "NOD_Defense Facility": "w",
            //"NOD_Tech Lab": "",
            //"NOD_Recruitment Hub": "X",
            //"NOD_Temple of Nod": "X",

            /* GDI Defense Units */"GDI_Wall": "w",
            "GDI_Cannon": "c",
            "GDI_Antitank Barrier": "t",
            "GDI_Barbwire": "b",
            "GDI_Turret": "m",
            "GDI_Flak": "f",
            "GDI_Art Inf": "r",
            "GDI_Art Air": "e",
            "GDI_Art Tank": "a",
            "GDI_Def_APC Guardian": "g",
            "GDI_Def_Missile Squad": "q",
            "GDI_Def_Pitbull": "p",
            "GDI_Def_Predator": "d",
            "GDI_Def_Sniper": "s",
            "GDI_Def_Zone Trooper": "z",
            /* Nod Defense Units */"NOD_Def_Antitank Barrier": "t",
            "NOD_Def_Art Air": "e",
            "NOD_Def_Art Inf": "r",
            "NOD_Def_Art Tank": "a",
            "NOD_Def_Attack Bike": "p",
            "NOD_Def_Barbwire": "b",
            "NOD_Def_Black Hand": "z",
            "NOD_Def_Cannon": "c",
            "NOD_Def_Confessor": "s",
            "NOD_Def_Flak": "f",
            "NOD_Def_MG Nest": "m",
            "NOD_Def_Militant Rocket Soldiers": "q",
            "NOD_Def_Reckoner": "g",
            "NOD_Def_Scorpion Tank": "d",
            "NOD_Def_Wall": "w",

            /* Forgotten Defense Units */"FOR_Wall": "w",
            "FOR_Barbwire_VS_Inf": "b",
            "FOR_Barrier_VS_Veh": "t",
            "FOR_Inf_VS_Inf": "g",
            "FOR_Inf_VS_Veh": "r",
            "FOR_Inf_VS_Air": "q",
            "FOR_Sniper": "n",
            "FOR_Mammoth": "y",
            "FOR_Veh_VS_Inf": "o",
            "FOR_Veh_VS_Veh": "s",
            "FOR_Veh_VS_Air": "u",
            "FOR_Turret_VS_Inf": "m",
            "FOR_Turret_VS_Inf_ranged": "a",
            "FOR_Turret_VS_Veh": "v",
            "FOR_Turret_VS_Veh_ranged": "d",
            "FOR_Turret_VS_Air": "f",
            "FOR_Turret_VS_Air_ranged": "e",

            /* GDI Offense Units */"GDI_APC Guardian": "g",
            "GDI_Commando": "c",
            "GDI_Firehawk": "f",
            "GDI_Juggernaut": "j",
            "GDI_Kodiak": "k",
            "GDI_Mammoth": "m",
            "GDI_Missile Squad": "q",
            "GDI_Orca": "o",
            "GDI_Paladin": "a",
            "GDI_Pitbull": "p",
            "GDI_Predator": "d",
            "GDI_Riflemen": "r",
            "GDI_Sniper Team": "s",
            "GDI_Zone Trooper": "z",

            /* Nod Offense Units */"NOD_Attack Bike": "b",
            "NOD_Avatar": "a",
            "NOD_Black Hand": "z",
            "NOD_Cobra": "r",
            "NOD_Commando": "c",
            "NOD_Confessor": "s",
            "NOD_Militant Rocket Soldiers": "q",
            "NOD_Militants": "m",
            "NOD_Reckoner": "k",
            "NOD_Salamander": "l",
            "NOD_Scorpion Tank": "o",
            "NOD_Specter Artilery": "p",
            "NOD_Venom": "v",
            "NOD_Vertigo": "t",

            "<last>": "."
          },
          make_sharelink: function () {
            try {
              var selected_base = cncopt.selected_base;
              var city_id = selected_base.get_Id();
              var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
              var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
              var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
              var server = ClientLib.Data.MainData.GetInstance().get_Server();
              var doLinkCity = (city.get_CityFaction() > 2 ? own_city.get_CityFaction() : city.get_CityFaction());
              var doCity = (city.get_CityFaction() > 2 ? own_city : city);
              tbase = selected_base;
              tcity = city;
              scity = own_city;
              //console.log("Target City: ", city);
              //console.log("Own City: ", own_city);
              var link = "http://cncopt.com/?map=";
              link += "3|"; /* link version */
              switch (city.get_CityFaction()) {
                case 1:
                  /* GDI */
                  link += "G|";
                  break;
                case 2:
                  /* NOD */
                  link += "N|";
                  break;
                case 3:
                  /* FOR faction - unseen, but in GAMEDATA */
                case 4:
                  /* Forgotten Bases */
                case 5:
                  /* Forgotten Camps */
                case 6:
                  /* Forgotten Outposts */
                  link += "F|";
                  break;
                default:
                  console.log("cncopt: Unknown faction: " + city.get_CityFaction());
                  link += "E|";
                  break;
              }
              //switch (own_city.get_CityFaction()) {
              switch (doLinkCity) {
                case 1:
                  /* GDI */
                  link += "G|";
                  break;
                case 2:
                  /* NOD */
                  link += "N|";
                  break;
                case 3:
                  /* FOR faction - unseen, but in GAMEDATA */
                case 4:
                  /* Forgotten Bases */
                case 5:
                  /* Forgotten Camps */
                case 6:
                  /* Forgotten Outposts */
                  link += "F|";
                  break;
                default:
                  console.log("cncopt: Unknown faction: " + own_city.get_CityFaction());
                  link += "E|";
                  break;
              }
              link += city.get_Name() + "|";
              defense_units = []
              for (var i = 0; i < 20; ++i) {
                var col = [];
                for (var j = 0; j < 9; ++j) {
                  col.push(null);
                }
                defense_units.push(col)
              }
              var defense_unit_list = getDefenseUnits(city);
              if (PerforceChangelist >= 376877) {
                for (var i in defense_unit_list) {
                  var unit = defense_unit_list[i];
                  defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                }
              } else {
                for (var i = 0; i < defense_unit_list.length; ++i) {
                  var unit = defense_unit_list[i];
                  defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                }
              }

              offense_units = []
              for (var i = 0; i < 20; ++i) {
                var col = [];
                for (var j = 0; j < 9; ++j) {
                  col.push(null);
                }
                offense_units.push(col)
              }

              //var offense_unit_list = getOffenseUnits(own_city);
              var offense_unit_list = getOffenseUnits(doCity);
              if (PerforceChangelist >= 376877) {
                for (var i in offense_unit_list) {
                  var unit = offense_unit_list[i];
                  offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                }
              } else {
                for (var i = 0; i < offense_unit_list.length; ++i) {
                  var unit = offense_unit_list[i];
                  offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                }
              }

              var techLayout = findTechLayout(city);
              var buildings = findBuildings(city);
              for (var i = 0; i < 20; ++i) {
                row = [];
                for (var j = 0; j < 9; ++j) {
                  var spot = i > 16 ? null : techLayout[j][i];
                  var level = 0;
                  var building = null;
                  if (spot && spot.BuildingIndex >= 0) {
                    building = buildings[spot.BuildingIndex];
                    level = building.get_CurrentLevel();
                  }
                  var defense_unit = defense_units[j][i];
                  if (defense_unit) {
                    level = defense_unit.get_CurrentLevel();
                  }
                  var offense_unit = offense_units[j][i];
                  if (offense_unit) {
                    level = offense_unit.get_CurrentLevel();
                  }
                  if (level > 1) {
                    link += level;
                  }

                  switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
                    case 0:
                      if (building) {
                        var techId = building.get_MdbBuildingId();
                        if (GAMEDATA.Tech[techId].n in cncopt.keymap) {
                          link += cncopt.keymap[GAMEDATA.Tech[techId].n];
                        } else {
                          console.log("cncopt [5]: Unhandled building: " + techId, building);
                          link += ".";
                        }
                      } else if (defense_unit) {
                        if (defense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                          link += cncopt.keymap[defense_unit.get_UnitGameData_Obj().n];
                        } else {
                          console.log("cncopt [5]: Unhandled unit: " + defense_unit.get_UnitGameData_Obj().n);
                          link += ".";
                        }
                      } else if (offense_unit) {
                        if (offense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                          link += cncopt.keymap[offense_unit.get_UnitGameData_Obj().n];
                        } else {
                          console.log("cncopt [5]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
                          link += ".";
                        }
                      } else {
                        link += ".";
                      }
                      break;
                    case 1:
                      /* Crystal */
                      if (spot.BuildingIndex < 0) link += "c";
                      else link += "n";
                      break;
                    case 2:
                      /* Tiberium */
                      if (spot.BuildingIndex < 0) link += "t";
                      else link += "h";
                      break;
                    case 4:
                      /* Woods */
                      link += "j";
                      break;
                    case 5:
                      /* Scrub */
                      link += "h";
                      break;
                    case 6:
                      /* Oil */
                      link += "l";
                      break;
                    case 7:
                      /* Swamp */
                      link += "k";
                      break;
                    default:
                      console.log("cncopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
                      link += ".";
                      break;
                  }
                }
              }
              /* Tack on our alliance bonuses */
              if (alliance && scity.get_AllianceId() == tcity.get_AllianceId()) {
                link += "|" + alliance.get_POITiberiumBonus();
                link += "|" + alliance.get_POICrystalBonus();
                link += "|" + alliance.get_POIPowerBonus();
                link += "|" + alliance.get_POIInfantryBonus();
                link += "|" + alliance.get_POIVehicleBonus();
                link += "|" + alliance.get_POIAirBonus();
                link += "|" + alliance.get_POIDefenseBonus();
              }
              if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
                  link += "|newEconomy";
              }

              //console.log(link);
              window.open(link, "_blank");
            } catch (e) {
              console.log("cncopt [1]: ", e);
            }
          }
        };
        if (!webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
        }

        var check_ct = 0;
        var check_timer = null;
        var button_enabled = 123456;
        /* Wrap showMenu so we can inject our Sharelink at the end of menus and
         * sync Base object to our cncopt.selected_base variable  */
        webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
          try {
            var self = this;
            //console.log(selected_base);
            cncopt.selected_base = selected_base;
            if (this.__cncopt_initialized != 1) {
              this.__cncopt_initialized = 1;
              this.__cncopt_links = [];
              for (var i in this) {
                try {
                  if (this[i] && this[i].basename == "Composite") {
                    var link = new qx.ui.form.Button("CNCOpt", "http://cncopt.com/favicon.ico");
                    link.addListener("execute", function () {
                      var bt = qx.core.Init.getApplication();
                      bt.getBackgroundArea().closeCityInfo();
                      cncopt.make_sharelink();
                    });
                    this[i].add(link);
                    this.__cncopt_links.push(link)
                  }
                } catch (e) {
                  console.log("cncopt [2]: ", e);
                }
              }
            }
            var tf = false;
            switch (selected_base.get_VisObjectType()) {
              case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                switch (selected_base.get_Type()) {
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                    tf = true;
                    break;
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                  case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                    tf = true;
                    break;
                }
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                tf = false;
                console.log("cncopt: Ghost City selected.. ignoring because we don't know what to do here");
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                tf = true;
                break;
              case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                tf = true;
                break;
            }

            var orig_tf = tf;

            function check_if_button_should_be_enabled() {
              try {
                tf = orig_tf;
                var selected_base = cncopt.selected_base;
                var still_loading = false;
                if (check_timer != null) {
                  clearTimeout(check_timer);
                }

                /* When a city is selected, the data for the city is loaded in the background.. once the 
                 * data arrives, this method is called again with these fields set, but until it does
                 * we can't actually generate the link.. so this section of the code grays out the button
                 * until the data is ready, then it'll light up. */
                if (selected_base && selected_base.get_Id) {
                  var city_id = selected_base.get_Id();
                  var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                  //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                  //console.log("City", city);
                  //console.log("get_OwnerId", city.get_OwnerId());
                  if (!city || city.get_OwnerId() == 0) {
                    still_loading = true;
                    tf = false;
                  }
                } else {
                  tf = false;
                }
                if (tf != button_enabled) {
                  button_enabled = tf;
                  for (var i = 0; i < self.__cncopt_links.length; ++i) {
                    self.__cncopt_links[i].setEnabled(tf);
                  }
                }
                if (!still_loading) {
                  check_ct = 0;
                } else {
                  if (check_ct > 0) {
                    check_ct--;
                    check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                  } else {
                    check_timer = null;
                  }
                }
              } catch (e) {
                console.log("cncopt [3]: ", e);
                tf = false;
              }
            }

            check_ct = 50;
            check_if_button_should_be_enabled();
          } catch (e) {
            console.log("cncopt [3]: ", e);
          }
          this.__cncopt_real_showMenu(selected_base);
        }
      }


      /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
      function cnc_check_if_loaded() {
        try {
          if (typeof qx != 'undefined') {
            a = qx.core.Init.getApplication(); // application
            if (a) {
              cncopt_create();
            } else {
              window.setTimeout(cnc_check_if_loaded, 1000);
            }
          } else {
            window.setTimeout(cnc_check_if_loaded, 1000);
          }
        } catch (e) {
          if (typeof console != 'undefined') console.log(e);
          else if (window.opera) opera.postError(e);
          else GM_log(e);
        }
      }
      if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
    }

    // injecting because we can't seem to hook into the game interface via unsafeWindow 
    //   (Ripped from AmpliDude's LoU Tweak script)
    var script_block = document.createElement("script");
    txt = cncopt_main.toString();
    script_block.innerHTML = "(" + txt + ")();";
    script_block.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script_block);
  })();
} catch (e) {
  GM_log(e);
}

// ==UserScript==
// @name        C&C Tiberium Alliances POIs Analyser
// @description Display alliance's POIs scores and next tier requirements.
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     2.0.1
// @grant none
// @author zdoom
// ==/UserScript==

(function () {
    var injectScript = function () {
        function create_ccta_pa_class() {
            qx.Class.define('ccta_pa',
			{
			    type: 'singleton',
			    extend: qx.ui.tabview.Page,

			    construct: function () {
			        try {
			            this.base(arguments);
			            this.set({ layout: new qx.ui.layout.Grow(), label: "Alliance POIs", padding: 10 });
			            var root = this;
			            var footerLayout = new qx.ui.layout.Grid();
			            footerLayout.setColumnFlex(1, 1);
			            var footer = new qx.ui.container.Composite(footerLayout).set({ font: "font_size_13", padding: [5, 10], marginTop: 5, decorator: "pane-light-opaque" });
			            var label = new qx.ui.basic.Label().set({ textColor: "text-value", font: "font_size_13", padding: 10, alignX: 'right' });
			            var checkBox = new qx.ui.form.CheckBox('Show/Hide image and alliance appreviation.')
			            checkBox.set({ textColor: webfrontend.gui.util.BBCode.clrLink, font: "font_size_13" });
			            var abr = new qx.ui.basic.Label().set({ alignX: 'center', marginTop: 30, font: 'font_size_14', textColor: 'black' });
			            var manager = qx.theme.manager.Font.getInstance();
			            var defaultFont = manager.resolve(abr.getFont());
			            var newFont = defaultFont.clone();
			            newFont.setSize(32);
			            abr.setFont(newFont);
			            var deco = new qx.ui.decoration.Background().set({ backgroundImage: "http://archeikhmeri.co.uk/images/fop2.png" });
			            var imgCont = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			            imgCont.set({ minWidth: 363, minHeight: 356, maxWidth: 363, maxHeight: 356, decorator: deco, alignX: 'center' });
			            var scrl = new qx.ui.container.Scroll();
			            var cont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ allowGrowY: true, padding: 10 });
			            var gb = new qx.ui.groupbox.GroupBox("Statistics").set({ layout: new qx.ui.layout.VBox(), marginLeft: 2 });
			            var lgb = new webfrontend.gui.GroupBoxLarge().set({ layout: new qx.ui.layout.Canvas() });
			            var lgbc = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ padding: [50, 10, 20, 10] });
			            var widget = new qx.ui.core.Widget().set({ minWidth: 628, minHeight: 335 });
			            var html = new qx.html.Element('div', null, { id: "graph" });
			            var info = new qx.ui.groupbox.GroupBox("Additional Information").set({ layout: new qx.ui.layout.VBox(), marginTop: 10 });
			            var buttonCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ marginTop: 10 });
			            var tableCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ minWidth: 500 });
			            var grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(2, 1));
			            grid.add(buttonCont, { row: 1, column: 1 });
			            grid.add(tableCont, { row: 1, column: 2 });
			            var noAllianceLabel = new qx.ui.basic.Label('No Alliance found, please create or join an alliance.').set({ maxHeight: 30 });

			            var data = ClientLib.Data.MainData.GetInstance();
			            var alliance = data.get_Alliance();
			            var exists = alliance.get_Exists();
			            var allianceName = alliance.get_Name();
			            var allianceAbbr = alliance.get_Abbreviation();
			            var faction = ClientLib.Base.Util.GetFactionGuiPatchText();
			            var fileManager = ClientLib.File.FileManager.GetInstance();
			            var opois = alliance.get_OwnedPOIs();
			            var poiUtil = ClientLib.Base.PointOfInterestTypes;
			            var getScore = poiUtil.GetScoreByLevel;
			            var getMultiplier = poiUtil.GetBoostModifierByRank;
			            var getBonus = poiUtil.GetBonusByType;
			            var getNextScore = poiUtil.GetNextScore;
			            var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
			            var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
			            var maxPoiLevel = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxCenterLevel();
			            var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
			            var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;

			            var tiersData = [], scoreData = [], bonusData = [], tiers = [];
			            for (var i = 0; i < 50; i++) {
			                var previousScore = (i == 0) ? 0 : bonusData[i - 1][1];
			                var score = getNextScore(previousScore);
			                var bonus = getBonus(startRank, score);
			                var percent = getBonus(endRank - 1, score);
			                if (score != previousScore) {
			                    bonusData[i] = [i + 1, score, bonus, percent + '%'];
			                    tiers[i] = [i, previousScore, score];
			                }
			                else break;
			            }
			            for (var i = 1; i <= maxPoiLevel; i++) {
			                if (getScore(i + 1) == 1) continue;
			                scoreData.push([i, getScore(i)]);
			            }
			            for (var i = 1; i < 41; i++) tiersData.push([i, '+' + getMultiplier(i) + '%']);

			            var createTable = function () {

			                var columns = [["POI Level", "Score"], ["Tier", "Score Required", "Bonus", "Percentage"], ["Rank", "Multiplier"]];
			                var rows = [scoreData, bonusData, tiersData];

			                var make = function (n) {
			                    var model = new qx.ui.table.model.Simple().set({ columns: columns[n], data: rows[n] });
			                    var table = new qx.ui.table.Table(model).set({
			                        columnVisibilityButtonVisible: false,
			                        headerCellHeight: 25,
			                        marginTop: 20,
			                        minWidth: 500,
			                        height: 400
			                    });
			                    var renderer = new qx.ui.table.cellrenderer.Default().set({ useAutoAlign: false });
			                    for (i = 0; i < columns[n].length; i++) table.getTableColumnModel().setDataCellRenderer(i, renderer);
			                    return table;
			                };
			                this.Scores = make(0);
			                this.Tiers = make(1);
			                this.Multiplier = make(2);
			            };
			            var tables = new createTable();

			            ['Scores', 'Multiplier', 'Tiers'].map(function (key) {
			                var table = tables[key];
			                var button = new qx.ui.form.Button(key).set({ width: 100, margin: [10, 10, 0, 10] });
			                button.addListener('execute', function () {
			                    tableCont.removeAll();
			                    tableCont.add(table)
			                    scrl.scrollChildIntoViewY(tableCont, 'top');
			                }, this);
			                buttonCont.add(button);
			            });

			            info.add(grid);

			            var tabview = new qx.ui.tabview.TabView().set({ marginTop: 20, maxWidth: 500, maxHeight: 500 });
			            var coordsButton = new qx.ui.form.Button('Coords').set({ width: 100, margin: [10, 10, 0, 10] });
			            coordsButton.addListener('execute', function () {
			                tableCont.removeAll();
			                tableCont.add(tabview);
			                scrl.scrollChildIntoViewY(tableCont, 'top');
			            }, this);
			            var res =
						[
							"ui/common/icn_res_tiberium.png",
							"ui/common/icn_res_chrystal.png",
							"ui/common/icn_res_power.png",
							"ui/" + faction + "/icons/icon_arsnl_off_squad.png",
							"ui/" + faction + "/icons/icon_arsnl_off_vehicle.png",
							"ui/" + faction + "/icons/icon_arsnl_off_plane.png",
							"ui/" + faction + "/icons/icon_def_army_points.png"
						];
			            var columns = ['Coords', 'Level', 'Score'], models = [], pages = [];
			            for (var i = 0; i < 7; i++) {
			                var page = new qx.ui.tabview.Page().set({ layout: new qx.ui.layout.VBox() });
			                page.setIcon(fileManager.GetPhysicalPath(res[i]));
			                var model = new qx.ui.table.model.Simple().set({ columns: columns });
			                model.sortByColumn(1, false);
			                var table = new qx.ui.table.Table(model)
			                table.set({ columnVisibilityButtonVisible: false, headerCellHeight: 25, marginTop: 10, minWidth: 470, showCellFocusIndicator: false, height: 320 });
			                var renderer = new qx.ui.table.cellrenderer.Default().set({ useAutoAlign: false });
			                for (var n = 0; n < columns.length; n++) {
			                    if (n == 0) renderer = new qx.ui.table.cellrenderer.Html();
			                    table.getTableColumnModel().setDataCellRenderer(n, renderer);
			                }
			                page.add(table);
			                tabview.add(page);
			                models.push(model);
			                pages.push(page);
			            }
			            this.__poisCoordsPages = pages;

			            //Simulator
			            var wrapper = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ decorator: 'tabview-pane-clear', padding: [10, 14, 13, 10], marginTop: 20 });
			            var header = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({ decorator: 'pane-light-opaque', padding: [8, 12] });
			            var initValCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({ padding: [5, 0], marginLeft: 20 });
			            var initVals = ['Score:', 'Tier: ', 'Rank:', 'Bonus:'], valueLabels = [];
			            for (var i = 0; i < 4; i++) {
			                var initCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			                var ln = new qx.ui.basic.Label(initVals[i]).set({ textColor: webfrontend.gui.util.BBCode.clrLink, font: 'font_size_11' });
			                var lv = new qx.ui.basic.Label().set({ font: 'font_size_11', paddingLeft: 5, paddingRight: 10 });
			                initCont.add(ln);
			                initCont.add(lv);
			                initValCont.add(initCont, { flex: 1 });
			                valueLabels.push(lv);
			            }
			            var mainCont = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({ maxWidth: 480 });
			            var modifierCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());

			            var rankingModel = new qx.ui.table.model.Simple().set({ columns: ['Rank', 'Name', 'Score', 'Multiplier', 'Total Bonus'] });
			            var custom =
						{
						    tableColumnModel: function (obj) {
						        return new qx.ui.table.columnmodel.Resize(obj);
						    }
						};
			            var rankingTable = new qx.ui.table.Table(rankingModel, custom);
			            rankingTable.set({
			                columnVisibilityButtonVisible: false,
			                headerCellHeight: 25,
			                marginTop: 3,
			                showCellFocusIndicator: false,
			                statusBarVisible: false,
			                keepFirstVisibleRowComplete: false,
			                height: 105
			            });
			            for (var n = 0; n < 5; n++) {
			                if (n == 1) rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
			                else rankingTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({ useAutoAlign: false }));
			            }
			            var rankingTableColumnModel = rankingTable.getTableColumnModel();
			            var rankingTableResizeBehavior = rankingTableColumnModel.getBehavior();
			            rankingTableResizeBehavior.setWidth(0, 50);
			            rankingTableResizeBehavior.setWidth(1, "2*");
			            rankingTableResizeBehavior.setWidth(2, 100);
			            rankingTableResizeBehavior.setWidth(3, 70);
			            rankingTableResizeBehavior.setWidth(4, 100);

			            var resultsModel = new qx.ui.table.model.Simple().set({ columns: ['Property', 'Value'] });
			            var resultsTable = new qx.ui.table.Table(resultsModel, custom);
			            var resultsTableColumnModel = resultsTable.getTableColumnModel();
			            var resultsTableResizeBehavior = resultsTableColumnModel.getBehavior();
			            resultsTableResizeBehavior.setWidth(0, 100);
			            resultsTableResizeBehavior.setWidth(1, "2*");
			            resultsTable.set({
			                columnVisibilityButtonVisible: false,
			                headerCellHeight: 25,
			                marginTop: 5,
			                width: 210,
			                maxWidth: 210,
			                showCellFocusIndicator: false,
			                height: 300
			            });
			            resultsTable.getTableColumnModel().setDataCellRenderer(0, new qx.ui.table.cellrenderer.Html());
			            resultsTable.getTableColumnModel().setDataCellRenderer(1, new qx.ui.table.cellrenderer.Html());
			            var codeToString = function (s) { return String.fromCharCode(s).toLowerCase() };
			            label.setValue(String.fromCharCode(77) + [65, 68, 69, 32, 66, 89, 32, 90, 68, 79, 79, 77].map(codeToString).join().replace(/,/g, ''));

			            var poisColumns = ['Coords', 'Level', 'Score', 'Enabled'];
			            var poisModel = new qx.ui.table.model.Simple().set({ columns: poisColumns });
			            var poisTable = new qx.ui.table.Table(poisModel, custom);
			            poisTable.set({
			                columnVisibilityButtonVisible: false,
			                headerCellHeight: 25,
			                marginTop: 5,
			                marginLeft: 5,
			                showCellFocusIndicator: false,
			                height: 300
			            });
			            for (var n = 0; n < 4; n++) {
			                if (n == 0) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Html());
			                else if (n == 3) poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Boolean())
			                else poisTable.getTableColumnModel().setDataCellRenderer(n, new qx.ui.table.cellrenderer.Default().set({ useAutoAlign: false }));
			            }
			            var poisTableColumnModel = poisTable.getTableColumnModel();
			            var poisTableResizeBehavior = poisTableColumnModel.getBehavior();
			            poisTableResizeBehavior.setWidth(0, 70);
			            poisTableResizeBehavior.setWidth(1, 50);
			            poisTableResizeBehavior.setWidth(2, "2*");
			            poisTableResizeBehavior.setWidth(3, 60);
			            var selectionModel = poisTable.getSelectionManager().getSelectionModel();
			            selectionModel.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE);
			            poisTable.getSelectionModel().addListener('changeSelection', function (e) {
			                var table = this.__poisTable;
			                var tableModel = table.getTableModel();
			                var data = tableModel.getDataAsMapArray();
			                var score = 0;
			                for (var i = 0; i < data.length; i++) {
			                    var isSelected = selectionModel.isSelectedIndex(i);
			                    var level = tableModel.getValue(1, i);
			                    tableModel.setValue(3, i, !isSelected);
			                    if (!isSelected) score += getScore(parseInt(level, 10));
			                }
			                this.__setResultsRows(score);
			                this.__setRankingRows(score);
			                table.setUserData('score', score);
			            }, this);

			            var addRowCont = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({ decorator: 'pane-light-opaque', padding: [8, 12], marginTop: 5 });
			            var selectPoiLabelCont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			            var selectPoiLabel = new qx.ui.basic.Label('Select POI\'s Level').set({ margin: [5, 10], font: 'font_size_11' });
			            var selectLevel = new qx.ui.form.SelectBox().set({ padding: [5, 15] });
			            for (var i = 12; i <= maxPoiLevel; i++) selectLevel.add(new qx.ui.form.ListItem('Level ' + i, null, i));
			            var addButton = new qx.ui.form.Button('Add POI').set({ padding: [5, 20] });
			            var resetButton = new qx.ui.form.Button('Reset').set({ padding: [5, 20], marginLeft: 5 });
			            addButton.addListener('execute', function () {
			                var level = selectLevel.getSelection()[0].getModel();
			                var score = getScore(parseInt(level, 10));
			                var originalScore = poisTable.getUserData('score');
			                poisModel.addRows([['<p style="padding:0; margin:0; color:' + webfrontend.gui.util.BBCode.clrLink + '">New</p>', level, this.__format(score), true]]);
			                var newScore = originalScore + score;
			                this.__setResultsRows(newScore);
			                this.__setRankingRows(newScore);
			                poisTable.setUserData('score', newScore);
			            }, this);
			            resetButton.addListener('execute', this.__initSim, this);
			            mainCont.add(rankingTable, { flex: 1 });
			            modifierCont.add(resultsTable);
			            modifierCont.add(poisTable, { flex: 1 });
			            mainCont.add(modifierCont);
			            selectPoiLabelCont.add(selectPoiLabel);
			            addRowCont.add(selectLevel);
			            addRowCont.add(selectPoiLabelCont, { flex: 1 });
			            addRowCont.add(addButton);
			            addRowCont.add(resetButton);
			            mainCont.add(addRowCont);

			            var selectBox = new qx.ui.form.SelectBox().set({ padding: [5, 20] });
			            for (var i = 0; i < 7; i++) {
			                var type = poiInfo(i + startRank).type;
			                var listItem = new qx.ui.form.ListItem(type, null, type);
			                selectBox.add(listItem);
			            }
			            selectBox.addListener('changeSelection', function (e) {
			                if (!e.getData()[0]) return;
			                var type = e.getData()[0].getModel();
			                this.__selectedSimPoi = type;
			                this.__initSim();
			            }, this);

			            header.add(selectBox);
			            header.add(initValCont, { flex: 1 });
			            wrapper.add(header);
			            wrapper.add(mainCont);

			            this.__simLabels = valueLabels;
			            this.__rankingModel = rankingModel;
			            this.__resultsModel = resultsModel;
			            this.__poisModel = poisModel;
			            this.__poisTable = poisTable;
			            this.__selectPoiLevel = selectLevel;
			            this.__simCont = wrapper;
			            this.__selectedSimPoi = poiInfo(startRank).type;

			            var simulatorButton = new qx.ui.form.Button('Simulator').set({ width: 100, margin: [10, 10, 0, 10] });
			            simulatorButton.addListener('execute', function () {
			                scrl.scrollChildIntoViewY(tableCont, 'top');
			                tableCont.removeAll();
			                tableCont.add(wrapper);
			            }, this);
			            ////////////////////////////////////////////////////////////////////////////////////////////////////////


			            var showImage = true;
			            if (typeof localStorage.ccta_pa == 'undefined') {
			                localStorage.ccta_pa = JSON.stringify({ 'showImage': true });
			            }
			            else showImage = JSON.parse(localStorage.ccta_pa).showImage;
			            checkBox.setValue(showImage);

			            var toggleImage = function () {
			                var isChecked = checkBox.getValue();
			                localStorage.ccta_pa = JSON.stringify({ 'showImage': isChecked });
			                if (!isChecked) cont.remove(imgCont);
			                else cont.addAt(imgCont, 0);
			            };
			            checkBox.addListener('changeValue', toggleImage, this);

			            footer.add(checkBox, { row: 0, column: 0 });
			            footer.add(label, { row: 0, column: 1 });
			            scrl.add(cont);
			            imgCont.add(abr);
			            if (showImage) cont.add(imgCont);
			            cont.add(lgb);
			            lgb.add(lgbc);
			            lgbc.add(gb);
			            lgbc.add(info);
			            lgbc.add(footer);
			            widget.getContentElement().add(html);
			            this.add(scrl);

			            if (exists) {
			                gb.add(widget);
			                buttonCont.addAt(coordsButton, 0);
			                buttonCont.addAt(simulatorButton, 1);
			                tableCont.add(tabview);
			                abr.setValue(allianceAbbr);
			                this.__allianceName = allianceName;
			                this.__allianceAbbr = allianceAbbr;
			            }
			            else {
			                gb.add(noAllianceLabel);
			                tableCont.add(tables.Scores);
			                noAllianceLabel.setValue('No Alliance found, please create or join an alliance.');
			                this.__isReset = true;
			            }

			            this.__models = models;
			            this.__tableCont = tableCont;
			            this.__timer = new qx.event.Timer(1000);
			            this.__tiers = tiers;
			            this.__timer.addListener('interval', this.__update, this);
			            this.addListener('appear', function () {
			                try {
			                    var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
			                    var allianceName = alliance.get_Name();
			                    var allianceAbbr = alliance.get_Abbreviation();
			                    var exists = alliance.get_Exists();
			                    if (!exists && !this.__isReset) {
			                        console.log('No alliance found');
			                        gb.removeAll();
			                        gb.add(noAllianceLabel);
			                        buttonCont.remove(coordsButton);
			                        buttonCont.remove(simulatorButton);
			                        tableCont.removeAll();
			                        tableCont.add(tables.Scores);
			                        abr.setValue('');
			                        this.__allianceName = '';
			                        this.__allianceAbbr = '';
			                        this.__pois = {};
			                        this.__isReset = true;
			                    }
			                    else if (exists) {
			                        if (this.__isReset) {
			                            gb.removeAll();
			                            gb.add(widget);
			                            buttonCont.addAt(coordsButton, 0);
			                            buttonCont.addAt(simulatorButton, 1);
			                            abr.setValue(allianceAbbr);
			                            this.__isReset = false;
			                            this.__allianceName = allianceName;
			                            this.__allianceAbbr = allianceAbbr;
			                        }
			                        tableCont.removeAll();
			                        tableCont.add(tabview);
			                        this.__update();
			                    }
			                }
			                catch (e) {
			                    console.log(e.toString())
			                }
			            }, this);

			            var overlay = webfrontend.gui.alliance.AllianceOverlay.getInstance();
			            var mainTabview = overlay.getChildren()[12].getChildren()[0];
			            mainTabview.addAt(this, 0);
			            mainTabview.setSelection([this]);
			        }
			        catch (e) {
			            console.log(e.toString());
			        }
			    },
			    destruct: function () { },
			    members:
				{
				    __isReset: false,
				    __timer: null,
				    __allianceName: null,
				    __allianceAbbr: null,
				    __pois: null,
				    __tiers: null,
				    __ranks: {},
				    __models: null,
				    __poisCoordsPages: null,
				    __tableCont: null,
				    __simCont: null,
				    __selectedSimPoi: null,
				    __isolatedRanks: null,
				    __simLabels: [],
				    __rankingModel: null,
				    __resultsModel: null,
				    __poisModel: null,
				    __poisTable: null,
				    __selectPoi: null,
				    __style:
					{
					    "table": { "margin": "5px", "borderTop": "1px solid #333", "borderBottom": "1px solid #333", "fontFamily": "Verdana, Geneva, sans-serif" },
					    "graph":
						{
						    "td": { "width": "68px", "verticalAlign": "bottom", "textAlign": "center" },
						    "div": { "width": "24px", "margin": "0 auto -1px auto", "border": "3px solid #333", "borderBottom": "none" }
						},
					    "icon":
						{
						    "ul": { "listStyleType": "none", "margin": 0, "padding": 0 },
						    "div": { "padding": "6px", "marginRight": "6px", "display": "inline-block", "border": "1px solid #000" },
						    "p": { "display": "inline", "fontSize": "10px", "color": "#555" },
						    "li": { "height": "15px", "padding": "2px", "marginLeft": "10px" }
						},
					    "cell":
						{
						    "data": { "width": "68px", "textAlign": "center", "color": "#555", "padding": "3px 2px" },
						    "header": { "color": "#416d96", "padding": "3px 2px" }
						},
					    "rows":
						{
						    "graph": { "borderBottom": "3px solid #333", "height": "200px" },
						    "tr": { "fontSize": "11px", "borderBottom": "1px solid #333", "backgroundColor": "#d6dde1" }
						}
					},

				    __element: function (tag) {
				        var elm = document.createElement(tag), root = this;
				        this.css = function (a) {
				            for (var b in a) {
				                root.elm.style[b] = a[b];
				                root.__style[b] = a[b];
				            }
				        }
				        this.set = function (a) {
				            for (var b in a) root.elm[b] = a[b];
				        }
				        this.append = function () {
				            for (var i in arguments) {
				                if (arguments[i].__instanceof == 'element') root.elm.appendChild(arguments[i].elm);
				                else if (arguments[i] instanceof Element) root.elm.appendChild(arguments[i]);
				                else console.log(arguments[i] + ' is not an element');
				            }
				        }
				        this.text = function (str) {
				            var node = document.createTextNode(str);
				            root.elm.appendChild(node);
				        }
				        this.elm = elm;
				        this.__style = {};
				        this.__instanceof = 'element';
				    },

				    __format: function (n) {
				        var f = "", n = n.toString();
				        if (n.length < 3) return n;
				        for (var i = 0; i < n.length; i++) {
				            (((n.length - i) % 3 === 0) && (i !== 0)) ? f += "," + n[i] : f += n[i];
				        }
				        return f;
				    },

				    __update: function () {
				        this.__timer.stop();
				        var div = document.getElementById('graph');
				        if (!div) {
				            this.__timer.start();
				            console.log('Waiting for div dom element to be loaded');
				        }
				        if (div) {
				            console.log('Reloading graph');
				            div.innerHTML = "";
				            this.__updatePOIList();
				            this.__updateGraph();
				            this.__updateRanks();
				        }
				    },

				    __updatePOIList: function () {
				        var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
				        var opois = alliance.get_OwnedPOIs();
				        var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
				        var getScore = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel;
				        var models = this.__models, format = this.__format, pages = this.__poisCoordsPages;
				        for (var i = 0; i < 7; i++) {
				            var rows = [];
				            opois.map(function (poi) {
				                if (poi.t - startRank === i) {
				                    var a = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
				                    rows.push([a, poi.l, format(getScore(poi.l))]);
				                }
				            });
				            models[i].setData(rows);
				            models[i].sortByColumn(1, false);
				            pages[i].setLabel(rows.length);
				        }
				    },

				    __updateRanks: function () {
				        this.__ranks = {}, this.__isolatedRanks = {}, root = this, allianceName = this.__allianceName;
				        var getPoiRankType = ClientLib.Base.PointOfInterestTypes.GetPOITypeFromPOIRanking;
				        var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType, startRank;
				        for (var i = 0; i < 20; i++) if (getPoiRankType(i) > 0) { startRank = i; break; };
				        var getPoiRanks = function (type, poiType, increment) {
				            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("RankingGetData",
							{ 'ascending': true, 'firstIndex': 0, 'lastIndex': 100, 'rankingType': poiType, 'sortColumn': 200 + increment, 'view': 1 },
							phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, root, function (context, data) {
							    if (data !== null) {
							        var skip = 1, arr = [];
							        for (var i = 0; i < data.a.length; i++) {
							            var alliance = data.a[i], name = alliance.an, score = (alliance.pois || 0);
							            if (name == allianceName) {
							                skip = 0;
							                continue;
							            }
							            alliance.r = i + skip;
							            arr.push(alliance);
							        }
							        this.__isolatedRanks[type] = arr;
							        this.__ranks[type] = data.a;
							        if (this.__selectedSimPoi == type) this.__initSim();
							    }
							}), null);
				        };
				        if (startRank) for (var n = 0; n < 7; n++) getPoiRanks(poiInfo(getPoiRankType(n + startRank)).type, n + startRank, n);
				    },

				    __setSimLabels: function () {
				        var labels = this.__simLabels, pois = this.__pois, type = this.__selectedSimPoi, format = this.__format;
				        if (pois[type]) {
				            labels[0].setValue(pois[type].s);
				            labels[1].setValue((pois[type].tier == 0) ? "0" : pois[type].tier);
				            labels[2].setValue((pois[type].rank == 0) ? "0" : pois[type].rank);
				            labels[3].setValue(pois[type].tb);
				        }
				    },

				    __setRankingRows: function (score) {
				        var isolatedRanks = this.__isolatedRanks, format = this.__format, allianceName = this.__allianceName, type = this.__selectedSimPoi, pois = this.__pois;
				        var poiUtil = ClientLib.Base.PointOfInterestTypes;
				        var getMultiplier = poiUtil.GetBoostModifierByRank;
				        var getBonus = poiUtil.GetBonusByType;
				        var getRankingData = function (i, type, nr) {
				            var x = isolatedRanks[type][i], score = (x.pois || 0), name = webfrontend.gui.util.BBCode.createAllianceLinkText(x.an);
				            var bonus = getBonus(pois[type].index, score), multiplier = getMultiplier(nr), totalBonus = bonus + (bonus * multiplier / 100);
				            totalBonus = (pois[type].bonusType == 1) ? format(Math.round(totalBonus)) : Math.round(totalBonus * 100) / 100 + '%';
				            return [nr, name, format(score), '+' + multiplier + '%', totalBonus]
				        };
				        getMyRanking = function (s, i, p) {
				            var b = getBonus(pois[p].index, s);
				            var m = getMultiplier(i);
				            var tb = b + (b * m / 100);
				            tb = (pois[p].bonusType == 1) ? format(Math.round(tb)) : Math.round(tb * 100) / 100 + '%';
				            var n = webfrontend.gui.util.BBCode.createAllianceLinkText(allianceName);
				            return [i, n, format(s), '+' + m + '%', tb];
				        };
				        var getRankingRows = function (s, type) {
				            var rows;
				            for (var i = 0; i < isolatedRanks[type].length; i++) {
				                if (s >= (isolatedRanks[type][i].pois || 0)) {
				                    var matched = getRankingData(i, type, i + 2);
				                    var nextMatched = getRankingData(i + 1, type, i + 3);
				                    var preMatched = (i > 0) ? getRankingData(i - 1, type, i) : null;
				                    if (i == 0) rows = [getMyRanking(s, i + 1, type), matched, nextMatched];
				                    else rows = [preMatched, getMyRanking(s, i + 1, type), matched];
				                    break;
				                }
				            }
				            return rows;
				        }
				        var rankingRows = getRankingRows(score, type);
				        if (rankingRows) this.__rankingModel.setData(rankingRows);
				    },

				    __setResultsRows: function (score) {
				        var pois = this.__pois, tiers = this.__tiers, format = this.__format, type = this.__selectedSimPoi, ranks = this.__isolatedRanks;
				        var poiUtil = ClientLib.Base.PointOfInterestTypes;
				        var getScore = poiUtil.GetScoreByLevel;
				        var getMultiplier = poiUtil.GetBoostModifierByRank;
				        var getBonus = poiUtil.GetBonusByType;
				        var getTier = function (s) {
				            if (s == 0) return "0";
				            else for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
				        };
				        var getNextTier = function (s) {
				            for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return (tiers[i][2] - s);
				        };
				        var getPreviousTier = function (s) {
				            for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return (s - tiers[i][1]);
				        };
				        var getRank = function (s, t) {
				            for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return i + 1;
				        };
				        var getNextRank = function (s, t) {
				            for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i - 1]) ? ranks[t][i - 1].pois : s;
				        };
				        var getPreviousRank = function (s, t) {
				            for (var i = 0; i < ranks[t].length; i++) if (s >= (ranks[t][i].pois || 0)) return (ranks[t][i].pois || 0);
				        };
				        var getSimulatedData = function (s, p) {
				            var ot = pois[p].tier;
				            var or = pois[p].rank;
				            var ob = pois[p].bonus;
				            var otb = pois[p].totalBonus;
				            var pp = pois[p].bonusType;
				            var t = getTier(s);
				            var r = getRank(s, p);
				            var ps = getPreviousRank(s, p);
				            var ns = getNextRank(s, p);
				            var pr = s - ps;
				            var nr = ns - s;
				            var nt = getNextTier(s);
				            var pt = getPreviousTier(s);
				            var b = getBonus(pois[p].index, s);
				            var m = getMultiplier(r);
				            var f = format;
				            var tb = b + (b * m / 100);
				            var sc = function (val, org, poiType, fac) {
				                var cs = [webfrontend.gui.util.BBCode.clrLink, '#41a921', '#e23636'];
				                var st = function (c) { return '<p style="padding: 0; margin: 0; color: ' + c + '">' }, et = '</p>';
				                if (val == undefined) return null;
				                if (org == undefined) return st(cs[0]) + val + et;
				                else if (org != undefined && poiType == null) return ((val - org) * fac > 0) ? st(cs[1]) + val + et : ((val - org) * fac < 0) ? st(cs[2]) + val + et : val;
				                else {
				                    var fv = (poiType == 1) ? format(Math.round(val)) : Math.round(val * 100) / 100 + '%';
				                    return ((val - org) * fac > 0) ? st(cs[1]) + fv + et : ((val - org) * fac < 0) ? st(cs[2]) + fv + et : fv;
				                }
				            };
				            var rows = ['Score', 'Tier', 'Rank', 'Multiplier', 'Previous Rank', 'Next Rank', 'Previous Tier', 'Next Tier', 'Bonus', 'Total Bonus'];
				            var data = [f(s), sc(t, ot, null, 1), sc(r, or, null, -1), '+' + m + '%', '+' + f(pr), '-' + f(nr), '+' + f(pt), '-' + f(nt), sc(b, ob, pp, 1), sc(tb, otb, pp, 1)];
				            var results = [];
				            for (var i = 0; i < rows.length; i++) results.push([sc(rows[i]), data[i]]);
				            return results;
				        };
				        var resultsRows = getSimulatedData(score, type);
				        if (resultsRows) this.__resultsModel.setData(resultsRows);
				    },

				    __setPoisRows: function () {
				        var poiUtil = ClientLib.Base.PointOfInterestTypes;
				        var getScore = poiUtil.GetScoreByLevel; //poi level
				        var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
				        var opois = alliance.get_OwnedPOIs();
				        var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
				        var poisRows = [], type = this.__selectedSimPoi;
				        opois.map(function (poi) {
				            if (poiInfo(poi.t).type == type) {
				                var a = webfrontend.gui.util.BBCode.createCoordsLinkText((poi.x + ':' + poi.y), poi.x, poi.y);
				                poisRows.push([a, poi.l, getScore(poi.l), true]);
				            }
				        });
				        if (poisRows) this.__poisModel.setData(poisRows);
				    },

				    __initSim: function () {
				        var score = this.__pois[this.__selectedSimPoi].score;
				        this.__setSimLabels();
				        this.__setRankingRows(score);
				        this.__setResultsRows(score);
				        this.__setPoisRows();
				        this.__poisTable.setUserData('score', score);
				        this.__poisTable.resetSelection();
				        this.__selectPoiLevel.setSelection([this.__selectPoiLevel.getSelectables()[0]]);
				    },

				    __updateGraph: function () {
				        try {
				            var data = ClientLib.Data.MainData.GetInstance();
				            var alliance = data.get_Alliance();
				            var ranks = alliance.get_POIRankScore();
				            var poiUtil = ClientLib.Base.PointOfInterestTypes;
				            var getScore = poiUtil.GetScoreByLevel;
				            var getMultiplier = poiUtil.GetBoostModifierByRank;
				            var getBonus = poiUtil.GetBonusByType;
				            var getNextScore = poiUtil.GetNextScore;
				            var startRank = ClientLib.Base.EPOIType.RankedTypeBegin;
				            var endRank = ClientLib.Base.EPOIType.RankedTypeEnd;
				            var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;

				            var pois = {}, format = this.__format, tiers = this.__tiers;
				            var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
				            var getTier = function (s) {
				                for (var i = 0; i < tiers.length; i++) if (s >= tiers[i][1] && s < tiers[i][2]) return tiers[i][0];
				            };
				            var getHeight = function (s) {
				                if (s == 0) return 0;
				                for (var i = 0; i < tiers.length; i++)
				                    if (s >= tiers[i][1] && s < tiers[i][2]) return Math.round((s - tiers[i][1]) / (tiers[i][2] - tiers[i][1]) * 100);
				            };

				            var colors = ["#8dc186", "#5b9dcb", "#8cc1c7", "#d7d49c", "#dbb476", "#c47f76", "#928195"];
				            for (var i = 0; i < ranks.length; i++) {
				                var type = i + startRank;
				                var name = poiInfo(type).type;
				                var rank = ranks[i].r;
				                var multiplier = getMultiplier(rank);
				                var score = ranks[i].s;
				                var bonus = getBonus(type, score);
				                var nextScore = getNextScore(score);
				                var nextBonus = getBonus(type, nextScore);
				                var totalBonus = bonus + (bonus * multiplier / 100);
				                var nextTotalBonus = nextBonus + (nextBonus * multiplier / 100);
				                var nextTier = format(nextScore - score);
				                var poiType = (i > 2) ? 2 : 1;
				                var color = colors[i];
				                var tier = getTier(ranks[i].s);
				                var height = getHeight(ranks[i].s);
				                var f_score = format(score);
				                var f_rank = rank + ' (' + multiplier + '%)';
				                var f_totalBonus = (poiType == 1) ? format(totalBonus) : Math.round(totalBonus * 100) / 100 + ' %';
				                nextTotalBonus = (poiType == 1) ? format(nextTotalBonus) : Math.round(nextTotalBonus * 100) / 100 + ' %';
				                pois[name] =
								{
								    'score': score,
								    'tier': tier,
								    'bonus': bonus,
								    'totalBonus': totalBonus,
								    'index': type,
								    'bonusType': poiType,
								    'rank': rank,
								    'multiplier': multiplier,
								    't': tier,
								    's': f_score,
								    'r': f_rank,
								    'nt': nextTier,
								    'tb': f_totalBonus,
								    'ntb': nextTotalBonus,
								    'c': color,
								    'h': height
								};
				            }
				            console.log('data ready')
				            this.__pois = pois;
				            this.__graph.call(this);
				        }
				        catch (e) {
				            console.log(e.toString());
				        }
				    },

				    __graph: function () {
				        console.log('creating graph');
				        var root = this, pois = this.__pois, style = this.__style;
				        var create = function (a, b) {
				            var elm = new root.__element(a);
				            if (b instanceof Object) elm.css(b);
				            return elm;
				        };
				        var addRow = function (title, arr, table, selected) {
				            var row = create('tr', style.rows.tr), header = create('td', style.cell.header);
				            row.elm.onclick = function () {
				                var tr = table.elm.getElementsByTagName('tr');
				                for (var i = 1; i < tr.length; i++) {
				                    tr[i].style.backgroundColor = '#d6dde1';
				                }
				                this.style.backgroundColor = '#ecf6fc';
				            };
				            if (selected == 1) row.css({ 'backgroundColor': '#ecf6fc' });
				            header.text(title);
				            row.append(header);
				            for (var key in arr) {
				                var td = create('td', style.cell.data);
				                td.text(arr[key]);
				                row.append(td);
				            }
				            table.append(row);
				        };

				        var table = create('table', style.table);
				        var gc = create('tr', style.rows.graph);
				        var gh = create('td');
				        var ul = create('ul', style.icon.ul);
				        table.set({ "id": "data", "cell-spacing": 0, "cell-padding": 0, "rules": "groups", "width": "100%" });
				        gh.append(ul);
				        gc.append(gh);
				        table.append(gc);

				        var score = [], tier = [], nextTier = [], bns = [], nextBns = [], poiRank = [], m = 0;
				        for (var key in pois) {
				            var color = pois[key].c,
								name = key,
								h = pois[key].h,
								td = create('td', style.graph.td),
								div = create('div', style.graph.div),
								li = create('li', style.icon.li),
								icon = create('div', style.icon.div),
								p = create('p', style.icon.p);

				            bns[m] = pois[key].tb;
				            poiRank[m] = pois[key].r;
				            score[m] = pois[key].s;
				            tier[m] = pois[key].t;
				            nextTier[m] = pois[key].nt;
				            nextBns[m] = pois[key].ntb;

				            div.css({ 'backgroundColor': color, 'height': h * 2 - 3 + 'px' });
				            td.append(div);
				            gc.append(td);
				            icon.css({ 'backgroundColor': color });
				            p.text(name);
				            li.append(icon);
				            li.append(p);
				            ul.append(li);
				            m++;
				        }

				        addRow('Tier', tier, table, 0);
				        addRow('Alliance Rank', poiRank, table, 0);
				        addRow('Score', score, table);
				        addRow('Next Tier Requires', nextTier, table, 0);
				        addRow('Bonus', bns, table, 1);
				        addRow('Next Tier Bonus', nextBns, table, 0);
				        document.getElementById('graph').appendChild(table.elm);
				    }
				}
			});
        }

        function initialize_ccta_pa() {
            console.log('poiAnalyser: ' + 'POIs Analyser retrying...');
            if (typeof qx != 'undefined' && typeof qx.core != 'undefined' && typeof qx.core.Init != 'undefined' && typeof ClientLib != 'undefined' && typeof webfrontend != 'undefined' && typeof phe != 'undefined') {
                var app = qx.core.Init.getApplication();
                if (app.initDone == true) {
                    try {
                        var isDefined = function (a) { return (typeof a == 'undefined') ? false : true };
                        var data = ClientLib.Data.MainData.GetInstance();
                        var net = ClientLib.Net.CommunicationManager.GetInstance();
                        if (isDefined(data) && isDefined(net)) {
                            var alliance = data.get_Alliance();
                            var player = data.get_Player();
                            var poiUtil = ClientLib.Base.PointOfInterestTypes;
                            var poiInfo = phe.cnc.gui.util.Text.getPoiInfosByType;
                            if (isDefined(alliance) && isDefined(player) && isDefined(alliance.get_Exists()) && isDefined(player.get_Name()) && player.get_Name() != '' && isDefined(poiUtil) && isDefined(poiInfo)) {
                                try {
                                    console.log('poiAnalyser: ' + 'initializing POIs Analyser');
                                    create_ccta_pa_class();
                                    ccta_pa.getInstance();
                                }
                                catch (e) {
                                    console.log('poiAnalyser: ' + "POIs Analyser script init error:");
                                    console.log('poiAnalyser: ' + e.toString());
                                }
                            }
                            else window.setTimeout(initialize_ccta_pa, 10000);
                        }
                        else window.setTimeout(initialize_ccta_pa, 10000);
                    }
                    catch (e) {
                        console.log('poiAnalyser: ' + e.toString());
                    }
                }
                else window.setTimeout(initialize_ccta_pa, 10000);
            }
            else window.setTimeout(initialize_ccta_pa, 10000);
        };
        window.setTimeout(initialize_ccta_pa, 10000);
    };

    function inject() {
        var script = document.createElement("script");
        script.innerHTML = "(" + injectScript.toString() + ")();";
        script.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(script);
            console.log('injected');
        }
    };
    inject();

})();