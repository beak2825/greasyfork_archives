    function addSettings() { 
        if ($("#settingsButton").length)
            return;
        // Add the required CSS
        AddCss("\
#settingsButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 0px; top: 0px; padding: 3px; z-index: 1000;}\
#pauseButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 23px; top: 0px; padding: 3px; z-index: 1000;}\
/* MAC-NW -- Put Panel at a higher layer than status window */ #settingsPanel{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); color: rgb(0, 0, 0); position: fixed; overflow: auto; right: 0px; top: 0px; width: 750px;max-height:800px;font: 12px sans-serif; text-align: left; display: block; z-index: 1001;}\
#settings_title{font-weight: bolder; background: none repeat scroll 0% 0% rgb(204, 204, 204); border-bottom: 1px solid rgb(102, 102, 102); padding: 3px;}\
#settingsPanelButtonContainer {background: none repeat scroll 0% 0% rgb(204, 204, 204); border-top: 1px solid rgb(102, 102, 102);padding: 3px;text-align:center} \
#settingsPanel label.purple {font-weight:bold;color:#7C37F6}\
#settingsPanel label.blue {font-weight:bold;color:#007EFF}\
#settingsPanel label.green {font-weight:bold;color:#8AFF00}\
#settingsPanel label.white {font-weight:bold;color:#FFFFFF}\
#charPanel {width:98%;max-height:400px;overflow:auto;display:block;padding:3px;}\
#charPanel div div ul li { display: inline-block; width: 48%; }\
.inventory-container {float: left; clear: none; width: 270px; margin-right: 20px;}\
#prinfopane {position: fixed; top: 5px; left: 200px; display: block; z-index: 1000;}\
.prh3 {padding: 5px; height: auto!important; width: auto!important; background-color: rgba(0, 0, 0, 0.7);}\
.custom-radio{width:16px;height:16px;display:inline-block;position:relative;z-index:1;top:3px;background-color:#fff;margin:0 4px 0 2px;}\
.custom-radio:hover{background-color:black;} .custom-radio.selected{background-color:red;} .custom-radio-selected-text{color:darkred;font-weight:500;}\
.custom-radio input[type='radio']{margin:1px;position:absolute;z-index:2;cursor:pointer;outline:none;opacity:0;_nofocusline:expression(this.hideFocus=true);-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);filter:alpha(opacity=0);-khtml-opacity:0;-moz-opacity:0}\
#settingsPanel input[type='button'].button-green,#settingsPanel input[type='button'].button-red,#settingsPanel input[type='button'].button-yellow,#settingsPanel input[type='button'].button-blue{color:#eff;border-radius:4px;text-shadow:0 1px 1px rgba(0,0,0,0.2);font-size:110%;font-weight:bold;}\
.pure-button{display:inline-block;*display:inline;zoom:1;line-height:normal;white-space:nowrap;vertical-align:baseline;text-align:center;cursor:pointer;-webkit-user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pure-button::-moz-focus-inner{padding:0;border:0}.pure-button{font-family:inherit;font-size:100%;*font-size:90%;*overflow:visible;padding:.5em 1em;color:#444;color:rgba(0,0,0,.8);*color:#444;border:1px solid #999;border:0 rgba(0,0,0,0);background-color:#E6E6E6;text-decoration:none;border-radius:2px}.pure-button-hover,.pure-button:hover,.pure-button:focus{filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#1a000000', GradientType=0);background-image:-webkit-gradient(linear,0 0,0 100%,from(transparent),color-stop(40%,rgba(0,0,0,.05)),to(rgba(0,0,0,.1)));background-image:-webkit-linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));background-image:-moz-linear-gradient(top,rgba(0,0,0,.05) 0,rgba(0,0,0,.1));background-image:-o-linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));background-image:linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1))}.pure-button:focus{outline:0}.pure-button-active,.pure-button:active{box-shadow:0 0 0 1px rgba(0,0,0,.15) inset,0 0 6px rgba(0,0,0,.2) inset}.pure-button[disabled],.pure-button-disabled,.pure-button-disabled:hover,.pure-button-disabled:focus,.pure-button-disabled:active{border:0;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);filter:alpha(opacity=40);-khtml-opacity:.4;-moz-opacity:.4;opacity:.4;cursor:not-allowed;box-shadow:none}.pure-button-hidden{display:none}.pure-button::-moz-focus-inner{padding:0;border:0}.pure-button-primary,.pure-button-selected,a.pure-button-primary,a.pure-button-selected{background-color:#0078e7;color:#fff}\
#settingsPanel input[type='button'].button-green{background:#1cb841; margin: 2px 20px 2px 2px;}\
#settingsPanel input[type='button'].button-red{background:#ca3c3c; margin: 2px 2px 2px 2px;}\
#settingsPanel input[type='button'].button-yellow{background:#df7514; margin: 2px 2px 2px 2px;}\
#settingsPanel input[type='button'].button-blue{background:#42b8dd; margin: 2px 2px 2px 2px;}\
");

        // Add settings panel to page body
        $("body").append(
            '<div id="settingsPanel">\
    <div id="settings_title">\
    <img src=' + image_prefs + ' style="float: left; vertical-align: text-bottom;"\>\
<img id="settings_close" src=' + image_close + ' title="Click to hide preferences" style="float: right; vertical-align: text-bottom; cursor: pointer; display: block;"\>\
<span style="margin:3px">Settings</span>\
</div>\
<form style="margin: 0px; padding: 0px">\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto; margin: 3px; padding: 0px;">\
</ul>\
</form>\
</div>'
        );

        // Add each setting input
        var settingsList = $("#settingsPanel form ul");
        for (var i = 0; i < settingnames.length; i++) {
            var id = 'settings_' + settingnames[i].name;
            var indent = (countLeadingSpaces(settingnames[i].title) >= 1) ? 1 : 0;
            /*if ((settingnames[i].type == 'text' && settingnames[i-1].type == 'checkbox') || (settingnames[i-1] && settingnames[i].type == 'checkbox' && settingnames[i-1].type == 'text'))
             settingsList.append('<li style="margin-left:0em; width: 48%; display: inline-block;"/>&nbsp;</li>')*/
            var border = "";
            if (settingnames[i].border)
                border = "border-top: #000 solid 1px;"
            switch (settingnames[i].type) {
                case "checkbox":
                    var _checkWidth = "48%";
                    if (i < 9)
                        _checkWidth = "31%";
                    if (settingnames[i].border)
                        _checkWidth = "98%";
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; width: ' + _checkWidth + '; display: inline-block;"><input style="margin:4px" name="' + id + '" id="' + id + '" type="checkbox" /><label class="' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label></li>')
                    $('#' + id).prop('checked', settings[settingnames[i].name]);
                    break;
                case "text":
                    if (settingnames[i].border)
                        _inputkWidth = "95%; padding: 10px";
                    else
                        _inputkWidth = "46%";
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; margin-top:1em; width: ' + _inputkWidth + '; display: inline-block;"<label class="' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label><input style="margin:4px; padding: 2px; min-width: 80%;" name="' + id + '" id="' + id + '" type="text" /></li>')
                    $('#' + id).val(settings[settingnames[i].name]);
                    break;
                case "password":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; margin-top:1em; width: 46%; display: inline-block;"' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label><input style="margin:4px; padding: 2px; min-width: 80%;" name="' + id + '" id="' + id + '" type="password" /></li>')
                    $('#' + id).val(settings[settingnames[i].name]);
                    break;
                case "select":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; width: 48%; display: inline-block;"' + settingnames[i].class + '" style="padding-left:4px" for="' + id + '">' + settingnames[i].title + '</label><select style="margin:4px" name="' + id + '" id="' + id + '" /></li>')
                    var options = settingnames[i].opts;
                    var select = $('#' + id);
                    for (var j = 0; j < options.length; j++) {
                        if (settings[settingnames[i].name] == options[j].path)
                            select.append('<option value="' + options[j].path + '" selected="selected">' + options[j].name + '</option>');
                        else
                            select.append('<option value="' + options[j].path + '">' + options[j].name + '</option>');
                    }
                    break;
                case "label":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'margin-left:' + indent + 'em;><label class="' + settingnames[i].class + '">' + settingnames[i].title + '</label></li>')
                    break;
            }
        }

        // Add character settings for each char
        var addText = '\
<script type="text/javascript">\
<!--\
function click_position(obj)\
{\
change_position(obj.value)\
}\
\
function customRadio(radioName) {\
var radioButton = $( \'input[name="\'+ radioName +\'"]\');\
$(radioButton).each(function(){\
$(this).wrap( "<span class=\'custom-radio\'></span>" );\
if($(this).is(\':checked\')){\
$(this).parent().addClass("selected");\
$(this).parent().parent().addClass("custom-radio-selected-text");\
}\
});\
$(radioButton).click(function(){\
if($(this).is(\':checked\')){\
$(this).parent().addClass("selected");\
$(this).parent().parent().addClass("custom-radio-selected-text");\
}\
$(radioButton).not(this).each(function(){\
$(this).parent().removeClass("selected");\
$(this).parent().parent().removeClass("custom-radio-selected-text");\
});\
});\
}\
function change_position(val)\
{\
for (var i = 0; i < ' + settings["charcount"] + '; i++)\
{\
document.getElementById("charContainer"+i).style.display="none";\
}\
document.getElementById("charContainer"+val).style.display="block";\
}\
//-->\
</script>\
<div id="charPanel">\
<div style="width:30%;float:left;max-height:400px;overflow:auto;">\
';
        for (var i = 0; i < settings["charcount"]; i++) {
            addText += '\
<div><label for="value_' + i + '" style="display:block;padding-top:2px;"><input autocomplete="off" type="radio" name="radio_position" onclick="click_position(this)" id="value_' + i + '" value="' + i + '" />' + settings["nw_charname" + i] + '</label></div>\
';
        }
        addText += '\
</div>\
<div style="width:69%;float:right;">\
';
        for (var i = 0; i < settings["charcount"]; i++) {
            addText += '\
<div id="charContainer' + i + '" style="display:none">\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto;">\
';
            var k = 0 + (i * charSettings.length / settings["charcount"]);
            var id = 'settings_' + charSettings[k].name;
            addText += '<li title="' + charSettings[k].tooltip + '"><input style="margin:4px; padding: 2px;" name="' + id + '" id="' + id + '" type="text" /></li>';
            for (var j = 1; j < (charSettings.length / settings["charcount"]); j++) {
                k = j + (i * charSettings.length / settings["charcount"]);
                if (charSettings[k].type == 'void') {
                    continue;
                }
                id = 'settings_' + charSettings[k].name;
                addText += '<li title="' + charSettings[k].tooltip + '"><input maxlength="2" size="1" style="margin:4px; padding: 2px;" name="' + id + '" id="' + id + '" type="text" /><label class="' + charSettings[k].class + '" for="' + id + '">' + charSettings[k].title + '</label></li>';
            }
            addText += '</ul>\
</div>';
        }
        addText += '\
</div>\
</div>\
';
        $("#settingsPanel form").append(addText);

        // Add values to character input fields
        for (var i = 0; i < charSettings.length; i++) {
            var id = 'settings_' + charSettings[i].name;
            $('#' + id).val(settings[charSettings[i].name]);
        }

        // Add save/cancel buttons to panel
        $("#settingsPanel form").append('\
<div id="settingsPanelButtonContainer">\
<input id="settings_save" class="button-blue pure-button" type="button" value="Save and Apply">\
<input id="settings_close" class="button-yellow pure-button" type="button" value="Close">\
<input id="settings_sca" class="button-red pure-button" type="button" value="Cycle SCA">\
<input id="log_error" class="button-green pure-button" type="button" value="Log Error">\
<input id="settings_wipe" class="button-white pure-button" type="button" value="RESET all">\
</div>');

        // Add open settings button to page
        $("body").append('<div id="settingsButton"><img src="' + image_prefs + '" title="Click to show preferences" style="cursor: pointer; display: block;"></div>');

        // Add pause button to page
        $("body").append('<div id="pauseButton"><img src="' + (settings["paused"] ? image_play : image_pause) + '" title="Click to ' + (settings["paused"] ? "resume" : "pause") + ' task script" style="cursor: pointer; display: block;"></div>');

        // Add info pane
        $("body").append("<div id='prinfopane' class='header-newrelease'>");

        // Add the javascript
        $("#settingsPanel").hide();
        $("#settingsButton").click(function () {
            $("#settingsButton").hide();
            $("#pauseButton").hide();
            $("#settingsPanel").show();
        });
        $("#settings_close,settings_cancel").click(function () {
            $("#settingsButton").show();
            $("#pauseButton").show();
            $("#settingsPanel").hide();
        });
        $("#pauseButton").click(PauseSettings);

        // Use setTimeout to workaround permission issues when calling GM functions from main window
        $("#settings_save").click(function () {
            setTimeout(function () {
                SaveSettings();
            }, 0)
        });
        $("#settings_sca").click(function () {
            $("#settings_close").trigger("click");
            unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + "/adventures");
            processSwordCoastDailies();
        });
        $("#log_error").click(function () {
            setTimeout(function () {
                var epic = GM_getValue("Epic_error", 0);
                var un_def_err = GM_getValue("Undefine_error", 0)
                console.log("Button Epic fails[" + epic +"] & undefine [" + un_def_err + "].");
            }, 0)
        });
        $("#settings_wipe").click(function() {
            setTimeout(function () {
                // Delete all saved settings, EXCEPT password/username
                var keys = GM_listValues();
                for (i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!key.match(/(username|password)/)) {
                        //console.log("do delete these", key);
                        GM_deleteValue(key);}
                }
            }, 0)
            unsafeWindow.location.href = current_Gateway;
            return;
        });

        customRadio("radio_position");

        $('#update-content-inventory-bags-0 .bag-header').waitUntilExists(function () {
            if ($('#update-content-inventory-bags-0 .bag-header div').length && !$('#update-content-inventory-bags-0 .bag-header div.autovendor').length) {
                $('#update-content-inventory-bags-0 .bag-header').append('<div class="input-field button light autovendor"><div class="input-bg-left"></div><div class="input-bg-mid"></div><div class="input-bg-right"></div><button id="nwprofs-autovendor">Auto Vendor</button></div>');
                $("button#nwprofs-autovendor").on("click", vendorJunk);
            }
        });
    }
