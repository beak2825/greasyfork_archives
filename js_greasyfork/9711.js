// ==UserScript==
// @name           CnC: Tiberium Alliances Self User Info
// @author         mutanwulf and Soera(update) and TheStriker(OriginalAuthor) and BaseInfo
// @description    Insert into message/chat/post infos about himself
// @description    Alt+Y - Insert to message/chat/post all your bases/cities info
// @description    Alt+N - Insert to message/chat/post ally support info
// @description    Alt+J - Insert to message/chat/post all your bases/cities production
// @namespace      https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version        0.5.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/9711/CnC%3A%20Tiberium%20Alliances%20Self%20User%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/9711/CnC%3A%20Tiberium%20Alliances%20Self%20User%20Info.meta.js
// ==/UserScript==
(function () {
  var TAI_main = function () {
    function createInstance() {
      qx.Class.define("TAI", { //TAS.main
        type : "singleton",
        extend : qx.core.Object,
        members : {
          initialize : function () {
            addEventListener("keyup", this.onKey, false);
            console.log("TA Info loaded.");
          },
          onKey : function (ev) {
            var s = String.fromCharCode(ev.keyCode);
            var inputField = document.querySelector('input:focus, textarea:focus');
            if (inputField !== null) {
              // ALT+
              if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "Y") {
                // player bases info to share with others (Off / Deff / Buildings)                
                inputField.value += generateBaseInfo();
              } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "N") {
                inputField.value += generateSupInfo();                
              } else if (ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.shiftKey && s == "J") {
				  // player bases info to share with others (production) 
                  inputField.value += generateProductionInfo();
              }
            }
          }
        } // members
      });
    }

    // Loading
    function TAI_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          if (qx.core.Init.getApplication().getMenuBar() !== null) {
            createInstance();
            TAI.getInstance().initialize();
          } else setTimeout(TAI_checkIfLoaded, 1000);
        } else {
          setTimeout(TAI_checkIfLoaded, 1000);
        }
      } catch (e) {
        if (typeof console != 'undefined') {
          console.log(e);
        } else if (window.opera) {
          opera.postError(e);
        } else {
          GM_log(e);
        }
      }
    }

	// text base info
	function generateBaseInfo(){
		var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;//all player cities
        var text = "",vortext = "", c, unitData, bh, supp, type, df, baselvl;
        var repairMaxTime = null;
        // var commandpointsMaxStorage = c.GetResourceMaxStorage(ClientLib.Base.EResourceType.CommandPoints);
        var PlayerName = "", reptime = null;
        for (var key in apc) {
					c = apc[key];  

					if(c.get_CommandCenterLevel() > 0)
    			{
    			    repairMaxTime = c.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
    			    reptime = repairMaxTime / 60 / 60;
						  PlayerName = c.get_PlayerName();
    			    vortext = "[b]" + PlayerName + "[/b] " + " CP: [b]" + c.GetResourceMaxStorage(ClientLib.Base.EResourceType.CommandPoints) + "[/b] RepTime: [b]" + reptime + "[/b] hours \n";
    			}
			  text += "[b][coords]"+ c.get_PosX() + ":" + c.get_PosY() + ":" + c.get_Name() + "(" + ('0' + c.get_LvlBase().toFixed(2)).slice(-5) + ")" + "[/coords][/b] ";
			  text += "Def: [b]" + ('0' + c.get_LvlDefense().toFixed(2)).slice(-5) + "[/b] ";
			  text += "Off: [b]" + ('0' + c.get_LvlOffense().toFixed(2)).slice(-5) + "[/b] ";
			  unitData = c.get_CityBuildingsData();
			  bh = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Construction_Yard);
			  df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
			  supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Ion);
			  if (supp === null)
				supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Art);
			  if (supp === null)
				supp = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Support_Air);
			  if (bh !== null) {
				text += "CY: [b]" + bh.get_CurrentLevel() + "[/b] ";
				//txt += "[u]BaseRep:[/u] [b]" + (c.get_CityBuildingsData().GetFullRepairTime() / 3600).toFixed(2) + "h[/b] ";
				//txt += "[u]DefRep:[/u] [b]" + (c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense) / 3600).toFixed(2) + "h[/b] ";
			  }
			  if (df !== null) {
				text += "DF: [b]" + df.get_CurrentLevel() + "[/b] ";
			  }
				else {
					text += "DF: [b]NA[/b] ";
				}
			  if (supp !== null) {
				text += "" + supp.get_TechGameData_Obj().dn.slice(0, 3) + ": [b]" + supp.get_CurrentLevel() + "[/b] ";
			  }
				else {
					text += "SUP: [b]NA[/b] ";
				}
			text += " \n "; // End LineBreak
		}
		vortext += text;
		return vortext;
	}
	
		// text base info
	function generateProductionInfo(){
		var instance = ClientLib.Data.MainData.GetInstance();
		var alliance = instance.get_Alliance();
		var credit_durchschnitt = null;
		var creditPerHour = 0;
		var creditsPerHour = 0;
		var PowerPerHour = 0;
		var PowersPerHour = 0;
		var PowerProduction = 0;
		var PowersProduction = 0;
		var TiberiumPerHour = 0;
		var TiberiumsPerHour = 0;
		var TiberiumProduction = 0;
		var TiberiumsProduction = 0;
		var CrystalPerHour = 0;
		var CrystalsPerHour = 0;
		var CrystalProduction = 0;
		var CrystalsProduction = 0;
		
		var apc = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;//all player cities
        var text = "", c, unitData;
		for (var key in apc) {
			c = apc[key];      
			creditPerHour = ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction(), false) + ClientLib.Base.Resource.GetResourceBonusGrowPerHour(c.get_CityCreditsProduction(), false);
			
			PowerPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
			PowerProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
			TiberiumPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
			TiberiumProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);
			CrystalPerHour = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal) + alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
			CrystalProduction = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);
			
			creditsPerHour = creditsPerHour + creditPerHour;
			
			PowersPerHour = PowersPerHour + PowerPerHour;
			PowersProduction = PowersProduction + PowerProduction;
			TiberiumsPerHour = TiberiumsPerHour + TiberiumPerHour;
			TiberiumsProduction = TiberiumsProduction + TiberiumProduction;
			CrystalsPerHour = CrystalsPerHour + CrystalPerHour;
			CrystalsProduction = CrystalsProduction + CrystalProduction;
		 		  
			}
		  text += "Tib/h: [b]" + TiberiumsProduction.toFixed(0) + "[/b]  ";
			text += "Kri/h: [b]" + CrystalsProduction.toFixed(0) + "[/b] ";
			text += "Pow/h: [b]" + PowersProduction.toFixed(0) + "[/b] ";
			text += "Cred/h: [b]" + creditsPerHour.toFixed(0) + "[/b] ";			
			text += " \n "; // End LineBreak
			text += "with Alliance Bonus \n";
			text += "Tib/h: [b]" + TiberiumsPerHour.toFixed(0) + "[/b]  ";
			text += "Kri/h: [b]" + CrystalsPerHour.toFixed(0) + "[/b] ";
			text += "Pow/h: [b]" + PowersPerHour.toFixed(0) + "[/b] ";
		
			text += " \n "; // End LineBreak
		
		return text;
	}
	
	function generateSupInfo(){
		var text = "";
		var bases = ClientLib.Data.MainData.GetInstance().get_AllianceSupportState().get_Bases().d;
		var base, keys = Object.keys(bases), len = keys.length, info = {}, avg = 0, high = 0, supBaseCount = len;
		while (len--) {
		  base = bases[keys[len]];
		  if (!info.hasOwnProperty(base.get_Type())) {
			info[base.get_Type()] = 0;
		  }
		  info[base.get_Type()]++;
		  if (base.get_Level() >= 30)
			high++;
		  avg += base.get_Level();
		}
		avg /= supBaseCount;
		var members = ClientLib.Data.MainData.GetInstance().get_Alliance().get_MemberData().d, member, baseCount = 0;
		keys = Object.keys(members);
		len = keys.length;
		while (len--) {
		  member = members[keys[len]];
		  baseCount += member.Bases;
		}
		text = "Alliance Bases: " + baseCount + " SupCount: " + supBaseCount + "(" + (supBaseCount / baseCount * 100).toFixed(0) + "%) Avg: " + avg.toFixed(2) + " 30+: " + high + "(" + (high / baseCount * 100).toFixed(0) + "%)";
		//for (var i in info)
        //  console.log("Type: " + i + " Count: " + info[i]);
		return text
	}
	
    if (/commandandconquer\.com/i.test(document.domain)) {
      setTimeout(TAI_checkIfLoaded, 1000);
    }
  };
  // injecting, because there seem to be problems when creating game interface with unsafeWindow
  var TAIScript = document.createElement("script");
  var txt = TAI_main.toString();
  TAIScript.innerHTML = "(" + txt + ")();";
  TAIScript.type = "text/javascript";
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName("head")[0].appendChild(TAIScript);
  }
})();