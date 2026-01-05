function displaySoftwareVersion(type){
	var isEditButtonClicked = $('#isEditButtonClicked').val();	
	if(isEditButtonClicked == 'false') {
		return;
	}
	var parentSoftwareVersions = document.getElementById("softwareVersions").value;	
	var osPlatform = document.getElementById("hiddenOsPlatFormId").value;
	if(osPlatform == null || osPlatform =='' || osPlatform =='select') {
		alert("You must first select an OS Platform before editing this field");
	} else {
		if(type =='softwareVersion-radio'){
			enableCategoryCondition('versionCondition');
			document.getElementById('saveBtnNew').style.display = 'block';
			
		}else{
			fnDisplayMainDiv('versionCategoryDiv','versionCategoryMainDivId','versionCategoryClearDiv');	
			tb_show('Software Tree', 'softwareTree?&method=post&osPlatform='+osPlatform+'&KeepThis=true&TB_iframe=true&height=400&width=500', null);
		}
	}
}

function displayMoreAdvOptions (__stack, method) {
    //var platform = $("#platform option:selected").val();

    if (moreAdvOptions == 0) {
        var stack = {};
        // OS for which default needs to be set
        stack.os = getSelectedOsFromURL(__stack);
        // To execute the default Query, set df= 1
        stack.df = 1;
        // no need to set offset as we are trying to get Default Navigator list
        stack.start = 0;
        // show the loading image only on 'click' event of down-arrow else never
        if (method == 'AftrSrch') {
            $('#ldimage').hide();
        } else {
            $('#ldimage').show();
        }

        $.jsonp({
            url: qrurl,
            data: {
                sJson: JSON.stringify(stack)
            },
            dataType: "jsonp",
            callbackParameter: "callback",
            timeout: 50000, // in  msecs, if response is not back in this time throws Exception
            success: function(p, status) {
                // Remove loading image
                //$.AjaxLoader.RemoveImageObject();
                //$('#ldimage').hide();
                console.log('success');

                if (p.numResults > 0) {
                    renderTemplate("#dmore", "#mofeatureGrpNavTemplate", p);
                    var innerHeight = $('#innerElement').height();

                    $("#dmore").height(innerHeight);
                    $("#dmore").addClass("dmorecls");
                    chkBoxCss();

                    if (method == 'AftrSrch') {
                        $("#dmore").hide();
                        updateCheckboxSelections(__stack);
                        $("img.imgadvmore").attr("src", imgRight);
                    } else {
                        $("#dmore").show();
                        $("img.imgadvmore").attr("src", imgDown);
                    }

                } else {
                    //alert('Error');   
                    $('#ldimage').hide();
                }
            },
            error: function(xOptions, textStatus) {
                // alert(errorThrown);
                $('#ldimage').hide();
                $.AjaxLoader.RemoveImageObject();
                if (textStatus == 'timeout') {
                    window.location.replace(errorURL);
                }
            }
        });
        moreAdvOptions = 1;
    } else {

        if (method != 'AftrSrch') {
            console.log("hree");
            $('#dmore').slideToggle('slow');

            var album = $("img.imgadvmore").attr("src").split("/");
            if (album[album.length - 1] === 'btn-drawerRight.gif') {
                $("img.imgadvmore").attr("src", imgDown);
            } else {
                $("img.imgadvmore").attr("src", imgRight);
            }
        } else {
            console.log('hhhhhhh');
            $("#dmore").hide();
            updateCheckboxSelections(__stack);
            $("img.imgadvmore").attr("src", imgRight);
        }
    }

    return false;
}

function postJsonDataSearchSvc(data, frmMthd) {

    var __stack = data;
    if (!__stack.os) $("#platform").val('junos');
    else $("#platform").val(__stack.os);

    // Base version is required for FAST Service
    if ($.isEmptyObject(__stack) || !__stack.bv) return false;

    $.jsonp({
        url: qrurl,
        data: {
            sJson: JSON.stringify(data)
        },
        dataType: "jsonp",
        callbackParameter: "callback",
        timeout: 50000,
        success: function(p, status) {
            console.log('123");
            $.AjaxLoader.RemoveImageObject();
            gp.navStateList = p.navStateList;
            p.viewName = "gnatssppublished";

            if (p.numResults > 0) {
                showBody(p);
                $("#sugs").empty();
                if (p.numResults > offset) {
                    if (p.offset && p.offset > 0) {
                        console.log('12");
                        $(".dpage").pagination(p.numResults, returnPageOptions(p, (p.offset / p.hitsPerPage)), p);
                    } else {
                        console.log('13");
                        showPageFooter(p, __stack);
                    }
                } else {
                    $(".dpage").empty();
                }
            } else {

                // no results empty the body and display error message
                $("#sbody").empty();
                $("#fc").empty();
                $("#msg").empty();
                $("#sbd").empty();
                $("#sugs").empty();
                $(".dpage").empty();
            }
            setGlblVars(p, __stack);

        },
        error: function(xOptions, textStatus) {
            // alert(errorThrown);
            $.AjaxLoader.RemoveImageObject();
            if (textStatus == 'timeout') {
                window.location.replace(errorURL);
            }
        }
    });
}