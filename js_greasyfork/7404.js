// ==UserScript==
// @name           WME URComments (Mapraid)
// @description    This script is for replying to user requests the goal is to speed up and simplify the process. Thanks to Chat Jumper and URO+!
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        1.3.2
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMRMhUfnAOZC6VaPRlJ8+ffrzM2fOXMW9BvgazWZzD9TG8qOBZgnr9fqg5OTklPfff39bUlLSfL3ZKvmmqZ2q2rqoy2h2jAtSKmhsaBD9LDqUVAqZ/fbt29c2b978IfS9HCqjUalUXf0Sfyygp0+f7kB8584d6bhx4/xTU1PT9uzZk69WB2derdHSxQf1ZLTaRpyrlAmUkxpH05OiqbGxoWrjxo07Wltbb0KFNNevX+/FENEBmqUyWvCTJ0+WDPEKrh4S8oFXiDp+/HhedHT0M6fKvqWbDa0e0Z0YG05LMpPp/v37xWvXrn0XqlRWX1+vraysNEkfZu38zE1zXHPmzOH53ARuAQEBUuieBM2OJoaFhSl27NixAPr7TGFVo8eA+eKxPAc7Nen111/PgX5HxMXF+TIsmSe+1bkbEuintKamRoBeyqxWq6Knp0eA2xJAUAJ3Zce9+PTTT9tkMpkF7opgQEEwwjU6g4kKKhu83sWCynrKjg2jhQsXPrd///4L2Dkm0iv9PntiSUIF5JmZmSpMCsI2hwNMNBYSC4+QgLUkoE909vF4HoP3kVhY+Pz589Mh/czi+layiqLXoK2inXhuVFRUUlZWViIE45eSkiI8LCKyZAUAZbfki8sfxhA4bdq0+GXLluUmJCRMBqCxkHQY9E2BdxwY2iDtqtra2hsHDhy4jIVOYTqV8BIDr3ERakd/r0Xn9nf/9aBNx4YpmTlzZtrNmzcvBwUFuQXNIZaDgRJS84eDV8+bN2/cqlWr1rF+AqTMbDFRU72WdI29ZNZbSaGSKdQx/jFRcdExERGTZ6Snp/8GYbmGiXVBPQZeyyakOvrtX/7X7e/+S2f4ziXCPoIhaam73MMBGJcvBgXBP4bv3LnztSlTpmwAWOW9svtU/kkd1V/rINE23ONIBQnFTQuh1OciZXHJsSn8TBwy7NitB67g7O53/yX8386sHOqhgnbZSCrBEoaOqpVKZXReXt5W6OfC5uZGuvjnW9RU2v1QPbRZ7aS50kbVl5spY2kHLdg4i0L9lNRtMrvGDNx+d7/7rxCVj6Nva2vTArARPts21BClHR0dPqy7MKgIAOYItrD8ZgUdWXmFtCVdZIfYPGsILufqsBsipYYHjTpQpYWrCXjEixcv3oKX6oNXGgRasmDBAhkyMD+MCd21a9dKAF5QUVxB598uJZvR5nB9njZHcOm20oOva2lKfAT5yASvAXN0nIy5zc3NJRUVFd/CvvpY26QDsjABhqMEw0AYXQZ0eG1TUwOd+30pr9QrwA7Q+JfapVT0j1sE46BF4xO9Bv1sehIDF8+ePfsR7KmF01UOG/06LUGIFIKDg33hwtRvvPHGagzyOf9uMVlNVrdEx+ZEUdZLSZSYlkBymYK6ejrp/rVqupFfTT3NBodNNd1pp6IjJTRzxSRHcsR5hyfXL9LiaWJcOOcvJ/Pz8wvgSjud+bXLe0iR3yogIb+JEyeOiY+Pn1VRUkHaMt3I5Y5CSs/unkTjJ4wf9FwdGEJT54VQ1px0Or21kKqLWhGdZHRpXwn5h6goZ9F4ig5UEecgBsvIwghVKSHhRPjsYIIgv3jrrbfeMxqNWrhQA0DbXaChGhKkjwpI2W/JkiXsh4XS4xq3SdSczRnDAA+8fBS+9OKOuZS/4jPS1fUhlRTo0z8VUGeHjua+Ng3pp47+U9viGv8Egkp0oB+NCQlEehrI6mhEarpvw4YNfzMYDM3IEntPnjxpG1QjsmogPCtgnX6JiYnZJrPRISW7OBy0b4Ccsudkfu/2KuQ+NGXtGPrij9+QiD8b/vyDVWSDfVQ0dTrGBPjI6YUnk+mJyGDOF+wACCj1Xx47duwQ9Pge7ruReJmcdePgwjY8PFzKtRoinxKpZFJjbSNXESOCCc8IIgQdj/QyeUI8AkupA3DChCiaujCTyps7KF7tT2mQ7oSYMJJJyFp840beoUOHjiBM17OHAG8DUgTzgCJ3eDXOKSUsU4ZtUSDHUHc0drlVjYAYpcfWLyBL6KczY/kkkkgl9CQqE27skZAb30Cuve/ChQuFiA9aCM9YVFRke1gl7gKN1UkQtlnaUq7bLMglyA3omGzPA0VjdZODDjJwOrXlIl3PKiOFv5ySc8IoKT2BkMt8AL4VXMjCyPq+D+ywcw+AtbNKoFnkKplctItDPIZArx6cRWOSx3oMuvhgFfXTsejtVH2tyZHspuZGENwru68upAt9UDeLp4DJWXUQJyFI6kVMtvX19XWExquHBQsL/PX9As8T+Suffk0PLjcOCjZkl3CFR5Fjwnh3O2BDlv4kyJvA5QDNFYczizK3t7fXxMbHkVQhcUhpYCvaW0H7Vp+iqsoHDwX87xNF9MWOkmHzuTHdmLg4gg5XMz/m6+RPXkkamZOIbeItMty7d++WXCan1LnRHOaHtbpbzVT4QZljxTbRRof/8E/au+oEHd3+LxewygtNI87llga6TP/u3bulzI/5Mn+vz/JQMNpQdXCmrj948GBRbm7uqqmvjfOpOKsZcdK317T0l5c/JptJpM7671LV+jJCFvixw0O01ejcV++vphFU0XT48OEi2I+e8yrm77WkCwsLRURDM3S6j8t0RKPC1CfSaOysGLd61VrZSR11XYOetWl01Frd6XYO00sbP47gKQpRkmmZH/Nl/l6DZhMBWOT+FnY7nbt37z4Bwfcs3jaLfIOUXmd4IzWmw/SYLtNnPsyP+XrjOQaBhqO3wmfqwUBXVVVVjVj/kTooxL48fzYJPsKIRuVp4/lMh+kxXabPfJgf8x0taEcph2TbzPEev1v27t174dKlS6fGpqTSm0fnU0C4alQS5nk8n+mA3idMl+kzH+bntFAaLWiWNm+VHv6zHX3D1q1bD3/11VcnksYki7898yvKfGkMOHgGlsdlvphMPI/nMx3QO8R0nfT1Tn5en8e5zvIGFrZc6fDBDIhHwJfGvvLKK7NXrFjxa+QoIVptA109WUqlJ2uot1M/jKBcIaOpq9Jo+tIsio6O5RjQgWToo6NHj15C1G2AHrfA+PggxAgDdOUZ3pwlDgU9CDhcUgDcUxisPDIkJCQBCflzTz311BzUkUG1dTX01+c/Iat5sLd6YefPadaiGQy2+/r16wV79uz5rLOzUwNazdDhNtDqGQr4hwDtAg7GCpVK5YeQq4bUQyCpSDCOfeedd55HHTm/8MwV+nTzVdekJ+cn0Zu7XubsrWLNmjUfYpfq0Jqw8HaEah0KjT5OOYcC/qFAu87xAF6u0+mU2FJ/gOZTnkg8jz9w4MCm5OTkjL+/fYxun9eQOiqAfvf5ShQOEt26deve1Wg0d0FbC3VoR+tBns7StTgNzz7SIedoDJFGOGfmbbYhxzZBWj0A3c6SQ2vYtm1bPpKrruXvLSJ1tD+9ujeHfJV+Yl5e3n4EjkoGDJVoY8A8f0ColgykP6qvDCPp9NKlS6UlJSUyqIYMDAU+u8MYmfNLlD+kHQbgcYsXL56xadOm9XpDr9RPFUAFBQVfbtmy5Qho1rFb4zVjjhH31sDAQCvcHJ+7WLu7u22IitaBn94eRT1cugxg/CXKl8/vMEbOF/d8tIBxfIIaivvI7du3/zInJ2d2XV1dzcqVKz+EZDlb4tPzHrw3YryZQXNihN0y8yIw1xAREWE8d+5cv7o8EmhpSkqKHGWPH0Cr+XiMz4TZk3Apxh6tHziYx+J3KNYSCA+xaOfOnVeqq6ubQUuH941o7NYYlJULC4w14Z0ehtyLe37XY8SFOtD6HWa7d1newEVwkcuqwODQs5T5k4EvepY+PxMgMTkWwc9l4Gtfv379ebwX0QS89+HzE/Qc7fhs28qVCcYL/LUAcy0Od65QCJj7g3xmtrPBREVFOXJrMOdi1wYAnLbKISHWbWbOC+vg+XzPjZUV4/mrq5V7bpC2o7jghnszABv4EJH9NPhY+w9fHhl0dna2FQQNXE1gK01wdQpIhMexWjgAcyXt7LmxivEnGTvXmUyDF8D3zm13nCszcNZrVhN4HRaC2Z37G5X36P/YjtJLCA0NlfIRA38UQi+BtCT8Ycj5hVUy/NhAcIFgb8H3SqVSZCH4+fmJ7DmgguLjiIhDvwmyG+SyTALmHvtYLNIOcHaei5S0H5X9UYPL/wQYAOwQASZqvrLnAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/7404/WME%20URComments%20%28Mapraid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7404/WME%20URComments%20%28Mapraid%29.meta.js
// ==/UserScript==
//URO+ in order for the URO pop up not to be over the ur pin change the URO+ script find all 4 uroPopupX = markerXY.x + popupXOffset; and change it to uroPopupX = markerXY.x + popupXOffset + 40;
//to make this script find open URs faster change the number 1000 to something smaller this is in milliseconds 1000 = 1 second
//line 892 it looks like this setTimeout(URComments.LookForOpenedUR, 1000);  // 1 second search
//line 892 it looks like this setTimeout(URComments.LookForOpenedUR, 500);   // .5 second search
var URCommentVersion = "1.3.2"; //branched from 0.9.3
var URCommentUpdateMessage = "yes"; // yes alert the user, no has a silent update.

/* Changelog
The change log has been moved to https://docs.google.com/spreadsheets/d/1PM4bOYGJxL82E4th2yy87ZzQKpMDF4N1dcKZ2evXc5o/edit?usp=sharing
This sheet will now be used to also track editor requests, to add a request please pm me on waze at rickzabel  
*/

var URCommentVersionUpdateNotes = "UR Comments has been updated to " + URCommentVersion;
URCommentVersionUpdateNotes = URCommentVersionUpdateNotes + "\n" + "I changed the way the reminder and close dates work with the UR filtering. The shows other past close has been changed to show reminder + close days. -RickZabel";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////
////// Define items that need to be at the root level so they can be used inside functions
//////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//use this for counting how many times we waited for waze to finish a task.. 
//currently used to write to the console so the code is easier to debug
//in the future we might do actions if we waited to long
var PauseCount = "1";

//these are the names of the comments lists built into the script and will show up in the comment list drop down
var BoilerPlateCreatorsArray = ["CommentTeam",
                                "Custom",
                                "BrazilianPortuguese", //maintained Murilo-Carvalho mcarvalho79&gmail.com https://greasyfork.org/en/scripts/7292-wme-ur-comments-brazilianportuguese-list
                                "Czech", //maintained by Zirland zirland&gmail.com
                                "Dutch", //maintained by moweez moweeznh&gmail.com https://greasyfork.org/nl/scripts/7276-wme-ur-comments-dutch-list
                                "Spanish", //maintained by carloslaso carloslaso&gmail.com https://greasyfork.org/en/scripts/7279-wme-ur-comments-spanish-list
                                "IsraeliHebrew", //maintained by crayzee, ktamir&gmail.com
																//"Italian", //maintained by Fabianotkd, fabiano.fumarola&gmail.com
                                "---User's Lists---",
                                "PesachZ" //maintained by PesachZ https://greasyfork.org/en/scripts/7272-wme-ur-comments-pesachz-list
                                //"orbit" //https://greasyfork.org/en/users/8079-orbit
                               ];

//get the SelectedBoilerPlateCreator
var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');
//console.log( SelectedBoilerPlateCreator);

//if the comment list hasn't been chosen default to the CommentTeam's list
if (SelectedBoilerPlateCreator === "" || SelectedBoilerPlateCreator === null || SelectedBoilerPlateCreator === "rickzabel") {
    SelectedBoilerPlateCreator = "CommentTeam";
    localStorage.setItem('BoilerPlateCreators', SelectedBoilerPlateCreator);
}

//array that holds the comments
var URCommentsArray = [];

//these are the holders for the position in the comments list that the reminder and close messages are at
var ReminderPosistion = "";
var CloseNotIdentifiedPosistion = "";


var def_names = [];			//default waze message array
var URC_Text = [];			//URC text
var URC_Text_tooltip = [];	//URC tool-tip text
var URC_USER_PROMPT = []; 	//URC Alerts, Confirmations, and orange box messages

//waze swaps out the close button on the UR window after you click send. we use this to grab the close and compare to the new one
var CloseButtonHolder = "";
//since we are scanning for open ur i need to keep taack of the current urID so the comments can be overridden
var UrCommentLasturID = "";

//this is used to hold the info about the previous tab, before we auto switched tabs
var PreviousTab = null;

//used to track if we are switching languages
var ChangeLanguage = false;

//return to zoom instead of zoom 0
var ReturnToCurrentZoom = "";

var UrCommentsIcon  ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMRMhUfnAOZC6VaPRlJ8+ffrzM2fOXMW9BvgazWZzD9TG8qOBZgnr9fqg5OTklPfff39bUlLSfL3ZKvmmqZ2q2rqoy2h2jAtSKmhsaBD9LDqUVAqZ/fbt29c2b978IfS9HCqjUalUXf0Sfyygp0+f7kB8584d6bhx4/xTU1PT9uzZk69WB2derdHSxQf1ZLTaRpyrlAmUkxpH05OiqbGxoWrjxo07Wltbb0KFNNevX+/FENEBmqUyWvCTJ0+WDPEKrh4S8oFXiDp+/HhedHT0M6fKvqWbDa0e0Z0YG05LMpPp/v37xWvXrn0XqlRWX1+vraysNEkfZu38zE1zXHPmzOH53ARuAQEBUuieBM2OJoaFhSl27NixAPr7TGFVo8eA+eKxPAc7Nen111/PgX5HxMXF+TIsmSe+1bkbEuintKamRoBeyqxWq6Knp0eA2xJAUAJ3Zce9+PTTT9tkMpkF7opgQEEwwjU6g4kKKhu83sWCynrKjg2jhQsXPrd///4L2Dkm0iv9PntiSUIF5JmZmSpMCsI2hwNMNBYSC4+QgLUkoE909vF4HoP3kVhY+Pz589Mh/czi+layiqLXoK2inXhuVFRUUlZWViIE45eSkiI8LCKyZAUAZbfki8sfxhA4bdq0+GXLluUmJCRMBqCxkHQY9E2BdxwY2iDtqtra2hsHDhy4jIVOYTqV8BIDr3ERakd/r0Xn9nf/9aBNx4YpmTlzZtrNmzcvBwUFuQXNIZaDgRJS84eDV8+bN2/cqlWr1rF+AqTMbDFRU72WdI29ZNZbSaGSKdQx/jFRcdExERGTZ6Snp/8GYbmGiXVBPQZeyyakOvrtX/7X7e/+S2f4ziXCPoIhaam73MMBGJcvBgXBP4bv3LnztSlTpmwAWOW9svtU/kkd1V/rINE23ONIBQnFTQuh1OciZXHJsSn8TBwy7NitB67g7O53/yX8386sHOqhgnbZSCrBEoaOqpVKZXReXt5W6OfC5uZGuvjnW9RU2v1QPbRZ7aS50kbVl5spY2kHLdg4i0L9lNRtMrvGDNx+d7/7rxCVj6Nva2vTArARPts21BClHR0dPqy7MKgIAOYItrD8ZgUdWXmFtCVdZIfYPGsILufqsBsipYYHjTpQpYWrCXjEixcv3oKX6oNXGgRasmDBAhkyMD+MCd21a9dKAF5QUVxB598uJZvR5nB9njZHcOm20oOva2lKfAT5yASvAXN0nIy5zc3NJRUVFd/CvvpY26QDsjABhqMEw0AYXQZ0eG1TUwOd+30pr9QrwA7Q+JfapVT0j1sE46BF4xO9Bv1sehIDF8+ePfsR7KmF01UOG/06LUGIFIKDg33hwtRvvPHGagzyOf9uMVlNVrdEx+ZEUdZLSZSYlkBymYK6ejrp/rVqupFfTT3NBodNNd1pp6IjJTRzxSRHcsR5hyfXL9LiaWJcOOcvJ/Pz8wvgSjud+bXLe0iR3yogIb+JEyeOiY+Pn1VRUkHaMt3I5Y5CSs/unkTjJ4wf9FwdGEJT54VQ1px0Or21kKqLWhGdZHRpXwn5h6goZ9F4ig5UEecgBsvIwghVKSHhRPjsYIIgv3jrrbfeMxqNWrhQA0DbXaChGhKkjwpI2W/JkiXsh4XS4xq3SdSczRnDAA+8fBS+9OKOuZS/4jPS1fUhlRTo0z8VUGeHjua+Ng3pp47+U9viGv8Egkp0oB+NCQlEehrI6mhEarpvw4YNfzMYDM3IEntPnjxpG1QjsmogPCtgnX6JiYnZJrPRISW7OBy0b4Ccsudkfu/2KuQ+NGXtGPrij9+QiD8b/vyDVWSDfVQ0dTrGBPjI6YUnk+mJyGDOF+wACCj1Xx47duwQ9Pge7ruReJmcdePgwjY8PFzKtRoinxKpZFJjbSNXESOCCc8IIgQdj/QyeUI8AkupA3DChCiaujCTyps7KF7tT2mQ7oSYMJJJyFp840beoUOHjiBM17OHAG8DUgTzgCJ3eDXOKSUsU4ZtUSDHUHc0drlVjYAYpcfWLyBL6KczY/kkkkgl9CQqE27skZAb30Cuve/ChQuFiA9aCM9YVFRke1gl7gKN1UkQtlnaUq7bLMglyA3omGzPA0VjdZODDjJwOrXlIl3PKiOFv5ySc8IoKT2BkMt8AL4VXMjCyPq+D+ywcw+AtbNKoFnkKplctItDPIZArx6cRWOSx3oMuvhgFfXTsejtVH2tyZHspuZGENwru68upAt9UDeLp4DJWXUQJyFI6kVMtvX19XWExquHBQsL/PX9As8T+Suffk0PLjcOCjZkl3CFR5Fjwnh3O2BDlv4kyJvA5QDNFYczizK3t7fXxMbHkVQhcUhpYCvaW0H7Vp+iqsoHDwX87xNF9MWOkmHzuTHdmLg4gg5XMz/m6+RPXkkamZOIbeItMty7d++WXCan1LnRHOaHtbpbzVT4QZljxTbRRof/8E/au+oEHd3+LxewygtNI87llga6TP/u3bulzI/5Mn+vz/JQMNpQdXCmrj948GBRbm7uqqmvjfOpOKsZcdK317T0l5c/JptJpM7671LV+jJCFvixw0O01ejcV++vphFU0XT48OEi2I+e8yrm77WkCwsLRURDM3S6j8t0RKPC1CfSaOysGLd61VrZSR11XYOetWl01Frd6XYO00sbP47gKQpRkmmZH/Nl/l6DZhMBWOT+FnY7nbt37z4Bwfcs3jaLfIOUXmd4IzWmw/SYLtNnPsyP+XrjOQaBhqO3wmfqwUBXVVVVjVj/kTooxL48fzYJPsKIRuVp4/lMh+kxXabPfJgf8x0taEcph2TbzPEev1v27t174dKlS6fGpqTSm0fnU0C4alQS5nk8n+mA3idMl+kzH+bntFAaLWiWNm+VHv6zHX3D1q1bD3/11VcnksYki7898yvKfGkMOHgGlsdlvphMPI/nMx3QO8R0nfT1Tn5en8e5zvIGFrZc6fDBDIhHwJfGvvLKK7NXrFjxa+QoIVptA109WUqlJ2uot1M/jKBcIaOpq9Jo+tIsio6O5RjQgWToo6NHj15C1G2AHrfA+PggxAgDdOUZ3pwlDgU9CDhcUgDcUxisPDIkJCQBCflzTz311BzUkUG1dTX01+c/Iat5sLd6YefPadaiGQy2+/r16wV79uz5rLOzUwNazdDhNtDqGQr4hwDtAg7GCpVK5YeQq4bUQyCpSDCOfeedd55HHTm/8MwV+nTzVdekJ+cn0Zu7XubsrWLNmjUfYpfq0Jqw8HaEah0KjT5OOYcC/qFAu87xAF6u0+mU2FJ/gOZTnkg8jz9w4MCm5OTkjL+/fYxun9eQOiqAfvf5ShQOEt26deve1Wg0d0FbC3VoR+tBns7StTgNzz7SIedoDJFGOGfmbbYhxzZBWj0A3c6SQ2vYtm1bPpKrruXvLSJ1tD+9ujeHfJV+Yl5e3n4EjkoGDJVoY8A8f0ColgykP6qvDCPp9NKlS6UlJSUyqIYMDAU+u8MYmfNLlD+kHQbgcYsXL56xadOm9XpDr9RPFUAFBQVfbtmy5Qho1rFb4zVjjhH31sDAQCvcHJ+7WLu7u22IitaBn94eRT1cugxg/CXKl8/vMEbOF/d8tIBxfIIaivvI7du3/zInJ2d2XV1dzcqVKz+EZDlb4tPzHrw3YryZQXNihN0y8yIw1xAREWE8d+5cv7o8EmhpSkqKHGWPH0Cr+XiMz4TZk3Apxh6tHziYx+J3KNYSCA+xaOfOnVeqq6ubQUuH941o7NYYlJULC4w14Z0ehtyLe37XY8SFOtD6HWa7d1newEVwkcuqwODQs5T5k4EvepY+PxMgMTkWwc9l4Gtfv379ebwX0QS89+HzE/Qc7fhs28qVCcYL/LUAcy0Od65QCJj7g3xmtrPBREVFOXJrMOdi1wYAnLbKISHWbWbOC+vg+XzPjZUV4/mrq5V7bpC2o7jghnszABv4EJH9NPhY+w9fHhl0dna2FQQNXE1gK01wdQpIhMexWjgAcyXt7LmxivEnGTvXmUyDF8D3zm13nCszcNZrVhN4HRaC2Z37G5X36P/YjtJLCA0NlfIRA38UQi+BtCT8Ycj5hVUy/NhAcIFgb8H3SqVSZCH4+fmJ7DmgguLjiIhDvwmyG+SyTALmHvtYLNIOcHaei5S0H5X9UYPL/wQYAOwQASZqvrLnAAAAAElFTkSuQmCC";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////
////// bootstrap 
//////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function urcToConsole(logtext)
{
    //console.log('URComments: '+logtext);
}

//now we use this to load the arrays, but we wait till the me tab loads, this gives the custom comments file a chance to also load
function URComments_bootstrap() {




    //urcToConsole("Test");
    //get the SelectedBoilerPlateCreator
    var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // these is the array used to store the ur comments
    // comment arrays should follow the format
    // "Title",     * is what will show up in the ur comment tab
    // "comment",   * is the comment that will be sent to the user currently 
    // "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on.
    //					after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (SelectedBoilerPlateCreator === "CommentTeam") {

        //CommentTeam's list
//possible tweak
//Please note, for privacy reasons Map Editors usually cannot see your intended destination or where you started from.



URCommentsArray = [

"No further communication",
"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
"Solved", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14

"Fixed",
//"Thanks to your report we've found and fixed a problem with the map. The fix should reach handheld devices within a few days, but on rare occasions it can take closer to a week.",//karlcr9911 12/7/14  //removed an extra space at the end - rickzabel 12/7/14 t0cableguy 12/8/14
//"Thanks to your report we've found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy, t0cableguy, rickzabel 1/14/2015

"Thanks to your report we have found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy 4/13/15
"Solved", 

"Address Adjustments",
//"Thanks! The address has been adjusted. This should reach handheld devices within a few days, but on rare occasions it can take closer to a week.",
"Thanks! The address has been adjusted. This should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Solved",

"Address in correct spot",
"The live map is currently showing your address in the correct spot. Please remove any instance of this address from your history and favorites by tapping the 'i' within the blue circle and then 'remove from history'. Then search for the address. If you don't remove the old results from your navigation or favorites, you will continue to be routed to the old coordinates. Please submit another report if this does not resolve your issue. Thanks!",
"Solved", //karlcr9911 rickzabel 4/3/2015

"Address fishing",
//"Waze does not tell us your starting or ending destinations. Would you tell us the address you are having problems with as you entered it into Waze? Thanks!"
//"Waze does not tell us your starting or ending destinations. Would you please tell us the destination name and address you are having problems with? Thanks!", //t0cableguy 12/7/14, karlcr9911 12/7/14 
//"Waze does not tell us your starting or ending destinations. Would you please tell us the destination name and address you are having problems with? Thanks!",
//this is going to be the message we voted on above! rickzabel 12/8/14
"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel i use this one after i sent a message with Volunteer responding 1
"Open",

"Errors with no text",
//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",  //karlcr9911 12/7/14 //rickzabel 12/7/14 //t0cableguy 12/7/14
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/8/14
"Open",

"Reminder message", //do not change (rickzabel)
//"Just a reminder: We have not received a response on your report. If we don't hear back from you soon we will infer everything is okay and close the report. Thanks!", //karlcr9911 12/7/14  //this has been getting me the most responses, but it probably is the special link i am including with the UR layer enabled rickzabel 12/7/14 t0cableguy 12/8/14
"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Open", 

"No reply close message",
//"The problem was unclear and volunteers didn't receive a response so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//karlcr9911 12/7/14 //rickzabel 12/7/14 t0cableguy 12/8/14
"The problem was unclear and volunteers didn't receive a response, so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified", 

"App Bug", 
"Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to https://support.google.com/waze/answer/6090951?hl=en",
"NotIdentified", //twintiggrz, t0cableguy, rickzabel 3/15/2015

"Bad GPS",
"Volunteer responding - It appears that your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky.",//rickzabel 12/18/2014
"NotIdentified",

"Valid Route",
//"We reviewed the issue and did not find any map errors. It looks like Waze provided a valid route. If you feel yours is correct, keep driving that way. If it is indeed faster, Waze will learn from your drives and route you and others the faster route. Thanks!", //karlcr9911 12/7/14  
//"We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. If you feel yours is correct, keep driving that way. If it is indeed faster, Waze will learn from your drives and route you and others the faster route. Thanks!", //added "you with" rickzabel 12/7/14
//"We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, it may turn out to actually be faster, if not you'll be teaching Waze that that route is slower, and your route will become preferred " //Pesach 12/8/14
//"Volunteer responding - We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, it may turn out to actually be faster, if not you'll be teaching Waze that that route is slower, and the faster route will become preferred.", //rickzabel 12/8/14, karlcr9911 12/8/14
"Volunteer responding - We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, as it may turn out to actually be faster. If not you'll be teaching Waze that that route is slower, and the faster route will become preferred.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified",

"Valid Left turns",
//"Volunteer responding - If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.", //rz 2/26/15 
"Volunteer responding - If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.", //karlcr9911 4/4/15 //rickzabel 4/5/15
"NotIdentified",

"Valid Left turns 2",
//"Volunteer responding – We do not disable legal turns only because they are difficult. If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.", //rz 2/26/15
"Volunteer responding – We cannot disable legal turns only because they are difficult. If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.", //karlcr9911 4/4/15 //rickzabel 4/5/15
"NotIdentified",

"Valid but Difficult Route",
//"Volunteer responding – We do not disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it’s not faster, you wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate."', //rz 2/26/15
"Volunteer responding – We cannot disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate.", //karlcr9911 4/4/15 //rickzabel 4/5/15
"NotIdentified",

"Missing place", 
"Volunteer responding - Thank you for reporting a missing place.  Anytime you find a a place that is missing from the waze app you can add it from the app by tapping the Pin icon > Place. After taking a picture of the place please add as many details as you can. Thanks!",
"NotIdentified",


"California double yellow",
"Volunteer responding, In California it is perfectly legal to make a left turn across one double yellow line. Turning across two double yellow lines, spaced apart 2 feet or more, is considered a barrier, and is illegal to cross. Thanks!", //rz 2/26/15 //karlcr9911 4/4/15
"NotIdentified",

"Detours / Odd-Routing",
//"We can't find anything in the map to explain route Waze gave you. Waze wants to save you time every way it can and sometimes it suggests complex detours just to shave a few seconds off your trip. Waze may recommend a detour even after the traffic has cleared up because: it doesn't know yet, other Wazers may have reported a temporary street closure, or daily traffic patterns. In any event, we are very sorry to say that the volunteer map editors can't be much help here. Thanks!",
//"We can't find anything on the map to explain route Waze gave you. Waze tries to save you time and sometimes suggests complex detours just to shave a few seconds off your trip. We are very sorry to say that the volunteer map editors can not be much help here. Thanks!", //rickzabel 12/7/14
//"We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors can not be helpful in this situation. Thanks!", //t0cableguy 12/7/14 //rickzabel 12/7/14 //karlcr9911 12/8/14
//"Volunteer responding - We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors can not be helpful in this situation. Thanks!", //rickzabel 12/11/14
"Volunteer responding - We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors cannot be helpful in this situation. Thanks!", //rickzabel 4/18/20115
"NotIdentified",

"Overall Waze complaint",
"Volunteer responding - You can help make Waze better by reporting problems as you find them. Please include as many details as possible? Thanks!",
"NotIdentified", //rickzabel Pesach 12/22/14

"Report to local municipality",
//"Volunteer responding - We are only able to help with map issues, this should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thanks!",//rickzabel Pesach 12/22/14
"Volunteer responding - We are only able to help with map issues. This should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified", 

"No user transponder (avoid tolls)",
//"Volunteer responding - Waze is about getting you to your destination the fastest; however, it does not know if you have a toll transponder. Therefore, if you prefer to not have toll routes suggested, there is a feature under Settings > Navigation to avoid toll roads. Thanks!", //rickzabel Pesach 12/22/14
//"Volunteer responding - Waze is about getting you to your destination via the fastest route. However, it does not know if you have a toll transponder. Therefore, if you prefer to not have toll routes suggested, there is a feature under Settings > Navigation to avoid toll roads. Thanks!", //rz 2/26/15 //karlcr9911 4/4/15
//"Volunteer responding - Waze is about getting you to your destination via the fastest route. However, it does not know if you have a toll transponder. To avoid tolls, there is an option under Settings > Navigation or after clicking GO tap Routes and select one without gold coins (iphone) or toll (android). Thanks!", //a version of this was suggested by subs5 4/12/2015 //rickzabel 4/17/2015
"Volunteer responding -  While Waze attempts to route you to your destination efficiently, it does not know if you have a toll transponder. To avoid tolls, there is an option under Settings > Navigation or after clicking GO tap Routes and select one without gold coins (iphone) or toll (android). Thanks!", //rickzabel 4/17/2015
"NotIdentified",

"No user transponder",
//"Volunteer responding - Waze is about getting to your destination the fastest; however, it does not know if you have a toll transponder. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//rickzabel Pesach 12/22/14
//"Volunteer responding - Waze is about getting to your destination via the fastest route. However, it does not know if you have a toll transponder. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //rickzabel 2/26/15 //t0cableguy 4/5/2015
"Volunteer responding - While Waze attempts to route you to your destination efficiently, it does not know if you have a toll transponder.  We are very sorry to say that the volunteer map editors cannot be much help here. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //rickzabel karlcr9911 4/18/2015
"NotIdentified", 

"Not Using HOV",
//"The map is setup correctly to support the HOV lane here. However the Waze Client App doesn't yet have the ability to know if you are in an HOV vehicle, it therefore assumes you do not meet the HOV criteria, and will only route you on roads open to all private vehicles.\nIf you are a qualified HOV vehicle and want to use the HOV lane, driving into the HOV should force Waze to recalculate your route. Once Waze realizes you are in the HOV lane, it should calculate the best route to your destination allowing you to stay in the HOV lane. If you have other questions or issues, please reply here, or send a new report at the location of the issue.\nThank you, and Happy Wazing", //peash 12/14/14
"Waze does not have the ability to know you meet the HOV criteria. Driving into the HOV lane should force Waze to recalculate your route. Afterwards you should be allowed to stay in the HOV lane. Thanks!", //rickzabel 12/14/14
"NotIdentified",

"U-turns",
//"Volunteer responding - Currently Waze will not tell you to make a \"U-turn\". It will route you in several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors, but we understand that Waze is working on a fix. Thanks!",//rickzabel Pesach 12/22/14
"Volunteer responding - Currently Waze will not tell you to make a \"U-turn\". It will route you in several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors. We understand that Waze is working on a fix. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified", 

"Traffic - Stale Information",
//"Volunteer map editors can't do anything about Waze's traffic reporting. Waze relies on data from people using Waze to assess traffic. In the case of a fresh accident or slowdown, Waze may not yet have any data on the situation. Once Waze has detected a traffic situation, it can remember it for awhile, sometimes long after the situation changes.",
"Waze relies on data from people using Waze to assess traffic. The volunteer map editors cannot edit conditions reported through the Waze app. In the case of a recent accident or slowdown, Waze may not have any data for this situation. Once Waze has detected a traffic situation it might remember it for a period of time after the situation cleared up.", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
"NotIdentified",

"Traffic - Jams",
//"To report traffic jam conditions, please use the Report -> Traffic Jam options in the Waze app. This will tell Waze about the problem in real-time. Traffic Jam reports can help route you and other Wazers around traffic problems.",
"To report a traffic jams please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
"NotIdentified",

"Signal Avoidance Bug",
//"I do not see any issues with the current turn restrictions in the area. This appears to be part of the known signal avoidance bug. Waze's developers are working on a fix for the issue but currently we do not have an ETA. Please feel free to take the turn until the issue is resolved. Thanks!",  // remove - rickzabel 12/7/2014  // added - rickzabel 12/7/2014
//"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue but we do not have an ETA. Please feel free use the signaled turn until the issue is resolved. Thanks!", // t0cableguy 12/7/14 
//"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue but we do not have an ETA. Please feel free to use the turn until the issue is resolved. Thanks!", // rickzabel 12/9/14
"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue. We do not have an ETA. Please feel free to use the turn until the issue is resolved. Thanks!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified",

"Already included restrictions",
"This restriction is already included in the map, Waze should not route through this illegal turn. If Waze ever gives you a route through a restricted turn, please send another Map Issue report at that time. Thanks!",
"NotIdentified",  //rickzabel Pesach 12/27/14

"1000 mile limit",
//"The search and navigation capabilities of Waze are limited to 1000 miles. When driving further than that distance you will need to select a target under that distance as your temporary destination.",//rz 2/26/15
"The search and navigation capabilities of Waze are limited to 1000 miles. When driving further than that distance you will need to select a destination less than 1000 miles as your temporary destination.", //karlcr9911 4/5/15 //rickzabel 4/5/15
"NotIdentified", 

"Temporary road blockage",
//"Volunteer responding - if the road is completely blocked use the Report > Closure feature for you and others to be rerouted around it, otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.", //rickzabel Pesach 12/22/14
"Volunteer responding - If the road is completely blocked, use the Report > Closure feature for you and others to be rerouted around it. Otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified",

"Temporary Road Closure",
"Volunteer responding - For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",
"NotIdentified",

"Temporary Road Closure",
//"How long is the road going to be closed? For closures of only a few days, we volunteer map editors can't be much help. It takes at least that long for our edits to make it to devices! When you encounter short-term road closures in the future, please use the Report->Closure feature in the Waze app. If this is a long-term closure please respond and let us know as much as you can. Thanks!",
"Do you know how long the road is going to be closed? For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. If this is a long-term closure please respond and let us know as much as you can. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
"Open",	

"Closure clean-up",
"Due to daily changing closures we are closing out the old requests to concentrate on the newest ones. For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",//rickzabel 12/28/14
"NotIdentified",

"Thanks for the reply",
"Thank you for the reply! This request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
"NotIdentified", //rickzabel 12/27/14			

"No further communication",
//"No further communication was received. This request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",  //rickzabel 12/7/14, karlcr9911 12/7/14 t0cableguy 12/8/14 // one sentence? rickzabel 12/7/14
//"No further communication was received. This request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14
"NotIdentified", // same comment different action based off UR status rickzabel 12/7/14, karlcr9911 12/7/14 // one sentence? rickzabel 12/7/14 t0cableguy 12/8/14

"water non-editable",
"This particular water feature is not editable by the volunteer editors, feel free to report this to support at https://support.google.com/waze/",
"NotIdentified",

"The road has been closed.",
//"Thank you for your report, the road has been closed.",
//"Volunteer responding - Thank you for your report, the road has been closed.", //rickzabel 1211/14
"Volunteer responding - Thank you for your report. The road has been closed.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"NotIdentified", //requested by SkiDooGuy //changed to NotIdentified by karlcr9911 4/3/2015

"Clear TTS Cache",
//"If you continue to have this problem you will need to clear your Text-to-Speech cache. Go to the navigation screen and type cc@tts in search field and hit search. You should get a pop up message that the TTS file has been cleared. It will take a few days for the file to build back up with all the spoken street names.",
//"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. A message that the TTS file has been cleared should appear. It will take a few days for the file to download the spoken street names. Thanks!", //t0cableguy 12/8/2014, karlcr9911 12/8/14
//"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. It will take a few days for the the spoken street names to be downloaded. Thanks!", //rickzabel 12/9/14

"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. Your TTS cache we be re-populated as you use routing.. Thanks!", //GizmoGuy411  t0cableguy rickzabel 2015-04-04
"NotIdentified", //t0cableguy This should be a last chance option for fixing the issue.04-04-2015  //rickzabel 04-04-2015 

"Camera report",
//"Thanks for the report. To ensure proper placement, Cameras must be reported in the app.  REPORT > CAMERA (may have to scroll down for it) > SPEED/Red LIGHT > Submit”, //subs5 4/17/2015
//"Thanks for the report. To ensure proper placement, Cameras must be reported in the app. REPORT > (scroll to) CAMERA > SPEED / Red LIGHT / Fake  > Send”, //GizmoGuy411 2015-04-17

"Volunteer responding, cameras must be reported from the app at / near the actual location using the Report > Camera option. Thank you!", //karlcr9911 rickzabel 4/17/2015

"NotIdentified",

"<br>",
"",
"",

"Problem appears corrected",
"Just a reminder: The problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks!",
"Open", //karlcr9911 12/7/14 t0cableguy 12/8/14 //rickzabel 12/8/14

"Clears comment & sets UR status to Open",
"",
"Open",

"Include Users Description",
"Volunteer responding - You reported \"$URD\" and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

//selected segments requires the use of https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Include selected segments names",
"Volunteer responding - You reported a problem near $SELSEGS, Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",


"Wrong Street Name",
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know which street name you think is wrong and what it should be? Thanks",
"Open", //rickzabel Pesach 12/22/14



"<br>",
"",
"",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
"Incorrect turn", //6
//"Would you please let us know what turn you are having a problem with? Thanks!",
//"Volunteer responding to your report: Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!",//rickzabel 12/7/14, karlcr9911 12/8/14
"Volunteer responding - Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Incorrect address", //7
//"Waze did not send us enough information to fix your request. In order for us to help you we need to know a couple of things; What is the address as you entered it into Waze and what was the problem you were having with this address?",
//"Volunteer responding to your report: Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!", //rickzabel 12/8/14, karlcr9911 12/8/14
"Volunteer responding - Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!", //rickzabel 12/8/14
"Open",

"Incorrect route", //8
//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
//"Volunteer responding to your report: Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", // karlcr9911  12/8/14
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Missing roundabout", //9
"Volunteer responding - Would you tell us as much as possible about the roundabout you believe is missing? Thanks!",
"Open",

"General error", //10
//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!",
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Turn not allowed", //11
//"Would you please let us know what turn was not, or should not be, allowed and the street names at the intersection? Thanks!",
//"Volunteer responding - Would you please let us know what turn was not, or should not be, allowed and the street names at the intersection? Thanks!", //rickzabel 12/9/14
"Volunteer responding - Would you please let us know which turn was or should not be allowed and why? Please specify the street names at the intersection. Thanks!",//rickzabel 2/26/15
"Open",

"Incorrect junction", //12
//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Missing bridge overpass", //13
//"Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!",
"Volunteer responding - Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!", //rickzabel 12/9/14
"Open",

"Wrong driving direction", //14
//"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",


"Missing Exit", //15
//"Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!",
"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!", //rickzabel 12/9/14
"Open",

"Missing Road", //16
//"Would you tell us as much as possible about the road you believe is missing? Thanks!",
"Volunteer responding - Would you tell us as much as possible about the road you believe is missing? Thanks!", //rickzabel 12/9/14
"Open",


"Missing Landmark", //18
"Volunteer responding - Would you tell us as much as possible about the landmark you believe is missing? Thanks!",
"Open",

/*
"Blocked Road", //19
"Volunteer responding -",
"Open",

"Missing Street Name", //21
"Volunteer responding -",
"Open",

"Incorrect Street Prefix or Suffix", ///22
"Volunteer responding -",
"Open",


*/

"<br>",
"",
"",
//End of Default URs  

"User Followed Waze's route",
//"It appears that you ended up going the route Waze suggested, what was the problem you were having? Would you tell us your destination as you entered it into Waze? Thanks!",
//"It appears that you followed the Waze-suggested route. What problem did you encounter here? Would you tell us your destination as you entered it into Waze? Thanks!",  //karlcr9911 12/7/2014
"Volunteer responding - It appears that you followed the route Waze suggested. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //reworded rickzabel 12/7/2014
"Open",

"Alley Interference",
//"Waze doesn't tell volunteer editors where you were going, although it was probably adjacent to the alley. If you would, please supply your destination as you entered it into Waze it may be helpful in correcting the route. Thanks!",
//"Waze does not let the volunteer editors know where you were going, although it was probably adjacent to the alley. If you would, please supply your destination as you entered it into Waze, it may be helpful in correcting the route. Thanks!", //rickzabel 12/7/14
"Volunteer responding - Waze does not let the us know where you were going, although it was probably adjacent to the alley. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Road Closed",
//"Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!", //karlcr9911
"Volunteer responding - Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!", //rickzabel 12/9/14
"Open",

"Area Entrances",
"We have had problems with Google pins being placed in the center of large landmarks. Delete your previous search and do a new search for the location. Go to the bottom of the auto fill list to see more results and make sure you pick the Waze search engine.",
"Open",

"48 Hour Reply",
//"Please allow 48 hours for changes to be reflected in the live map.",
"We made some changes to the map, please allow up to 48 hours for the changes to be reflected on the live map.", //rickzabel 12/7/14 //t0cableguy 12/8/14, karlcr9911 12/8/14
"Open",

"Clear Saved Locations",
//"You should remove the location from your favorites and recent searches and then re-search for the location to update the result.",
//"To get an updated result you should remove the location from your favorites and recent searches and then re-search for the location.", //rickzabel 12/7/14
"To get an updated result, remove the location from your navigation history and then search for the location again.", //t0cableguy 12/8/14, karlcr9911 12/8/14
"Open",

"Address - Incorrect Position",
//"Thank you for your report. Would you please let us know what address you’re reporting the problem with? You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location your are marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks!", //i also prefer not to send messages with contractions "you’re" rickzabel 12/7/14
//"What was the Address you had issues with? Please show us where the address you had issues is with the Report > Places feature in Waze. After taking a picture move as close to the entrance of the place you are adding before saving. Please do not submit images with personal details. Thanks!", //t0cableguy 12/7/14, karlcr9911 12/8/14
//"What was the Address you had issues with? Please show us where the address you had issues is with the Report > Places feature in Waze. After taking a picture, move close to the entrance of the place you are adding, before saving. Please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 2/26/15
"Can you tell us the address or if you can revisit visit the location, please show us the correct position by using the Report > Places feature. Before you save move as close as possible to the entrance. Please do not submit pictures containing faces, license plates, or personal details. Thanks!",  //rickzabel t0cableguy 04-04-2015
"Open",

"Address - Missing from Map",
//"Thank you for your report. Would you please let us know where the address you're reporting is? The live map doesn't have all the street numbers for that street and Waze is interpolating in error. You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location you’re marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks!", //rickzabel 12/7/14 
//"Volunteer responding -  Would you let us know the address that is missing? The live map does not have all the street numbers. You can also use the Report Places feature in Waze to mark the location. It is helpful that after taking a picture that you move near the location you’re marking to save the place. Also, please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 12/9/14 

//"Volunteer responding -  Would you let us know the address that is missing? The live map does not have all the street numbers. You can also use the Report Places feature in Waze to mark the location. It is helpful that after taking a picture that you move near the location you’re marking to save the place. Please do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 2/26/15 

"Volunteer responding - Would you let us know the address that is missing? The available resources do not have the address available for your location. You can use the Report > Places feature in Waze to mark the location. Before you save move close as possible to the entrance. Do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 4/5/2015 //t0cableguy 4/5/2015
"Open",

"Address - Bad Results",
//"Thank you for your report. The search feature retrieves results from a number of locations, including Google. Scrolling to the bottom the Navigate screen, you'll see more results for 'name.' Select that and Waze will list locations Around You. From there, you can also select results from other search engines.",
//"Search results in Waze are retrieved from numerous sources. After tapping search, Scroll to the bottom and you will see options for other search engines . Please try a different option as each one may provide better navigation", //t0cableguy 12/7/14, karlcr9911 12/8/14
"Search results in Waze are retrieved from numerous sources. After tapping search, Scroll to the bottom and you will see options for other search engines. Please try a different option as another search engine might have the address you are looking for", //rickzabel 12/9/14
"Open",

"House Number Adjustment",
//"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow 48 hours for changes to be reflected in the live map. If the location is in your saved searches or favorites, please remove them and search for them again to pick up the change in the live map. Please let me know if you continue to experience the problem. Thanks!",
"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow up to 48 hours for changes to be reflected in the live map. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Please let me know if you continue to experience this problem by submitting another error report. Thanks!", //rickzabel 12/7/14 //karlcr9911 12/8/14
"Open",

"Missing Bridges or Roads",
//"The roads here have been pretty thoroughly mapped and we volunteers can't see anything missing that should ordinarily be there. Waze probably simply chose not to show you the feature in question. When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!",
//"The roads for this area are thoroughly mapped and the volunteer editors can not find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!", //reworded rickzabel 12/7/14  //karlcr9911 12/8/14
"The roads for this area are thoroughly mapped and the volunteer editors cannot find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!", //rickzabel karlcr9911 4/18/2015
"Open",

"Manual Refresh",
//"You can try a manual refresh by going to Settings > Advanced > Data transfer > refresh maps.",
//"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Second you can try clearing Waze's app cache in your phone’s app manager. The final option is  to Uninstall and Reinstall the app.", //t0cableguy 12/7/14
//"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Second, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", // to Uninstall and Reinstall the app. (avoid user to use cellular data) //carloslaso 12/7/14 //rickzabel //t0cableguy
"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Secondly, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", //GizmoGuy rickzabel 2/26/15
"Open",

"Pave Road",
//"Please use the pave function in the app to show us the path of the missing road. You can do this by tapping the bottom right Pin icon, then Map Issue, and selecting the Pave Road tab. Once you leave any mapped roads you can tap start paving. Please be sure to tap the steamroller and tap stop paving before driving back onto any roads that are mapped. If paving a parking lot, please only drive the main roads and perimeters, not each aisle and space. Thanks for your contribution to the map! Thanks!", //requested by t0cableguy
//"Please use the pave function in the app to show us the path of the missing road. You can do this by tapping the bottom right Pin icon, then Map Issue, and selecting the Pave Road tab. Once you leave any mapped roads you can tapp paving. Please be sure to tap the steamroller and tap stop paving before driving back onto any roads that are mapped. If paving a parking lot please only drive the main roads and perimeters, not each aisle and space. Thanks for your contribution to the map! Thanks!",//rickzabel
//"Please pave the road in the app. Tap the Pin icon > Map Issue > Pave Road tab. After leaving any mapped roads tap start paving. Once done tap the steamroller > stop paving. Thanks for your contribution to the map!", //shortened and voted for by t0cableguy 12/7/14, karlcr9911 12/8/14
//"Please pave the road in the app. Tap the Pin icon > Map Issue > Pave Road tab. After leaving any mapped roads tap start paving. Once done tap the steamroller > stop paving. If you then tap the  Pin icon (Report) > Map Issue > Missing Road, you can enter text providing information about the new road (name, is it a private road, etc.). Thanks for your contribution to the map!",//addition suggested by SuperDave1426 12/08/14
//We already have open communication if we are telling them to pave a road. It would be helpful to drop ur pins but we have open communication and the users know how to submit reports. We shouldn’t close the UR that is already open, so we don’t need another UR.  t0cableguy 12/8/14 I’m leaning more torward adding this though SD as a teaching tool. t0cableguy 12/8/14
//"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road tap start paving. Once done tap the steamroller > stop paving. You can provide information about the new road such as it's name buy tapping on the Pin icon > Map Issue > Missing Road, and Thanks!", //rickzabel 12/8/14 t0cableguy 12/8/14
//"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road tap start paving. Once done tap the steamroller > stop paving. You can provide information about the new road such as it's name by tapping on the Pin icon > Map Issue > Missing Road, and Thanks!", //rickzabel 2/26/15
"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road, tap Start paving. Once done, tap the Steamroller > Stop paving. You can provide information about the new road such as its name by tapping on the Pin icon > Map Issue > Missing Road. Thanks!", //karlcr9911 4/5/15 //rickzabel 4/5/15 removed single quotes
"Open",

//"Blank Screen.",
//"Please follow these instructions in the app. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh map of my area. Second you can try clearing Waze's app cache in your phone’s app manager. The final option is  to Uninstall and Reinstall the app.",
//"Open", //requested by t0cableguy 12/7/14 in map refresh now t0cableguy 12/8/14

"Unlock request",
//"I have requested the rights to get this issue fixed. Thanks for your report. Thanks! ", //requested by t0cableguy 12/8/14 
//"Volunteer responding to your report: I have requested the rights to get this issue fixed. Thanks for your report.", //rikzabel 12/8/14  i usually dont say anything cause this is weird that they made a request for you to make a request…
//"I have begun the process to get this issue fixed. Thanks for your report. Thanks! ",//reword t0cableguy 12/8/14
//"I have begun the process to get this issue fixed. Thanks for your report!", //rickzabel 12/11/14
"I have started the process to get this issue fixed. Thanks for your report!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Open"
  ];

        //auto insertion config:
        //the position in the list that the reminder message is at. (counting titles, comments, and ur status)
        ReminderPosistion = 18;

        //the position of the close as Not Identified message that you have in the list (the first comment is the list is 0)
        CloseNotIdentifiedPosistion = 21;

        //Waze's default URs number to name conversion array
        //Thanks to SuperMedic

		//console.log("URC trash " + URCommentsArray[ReminderPosistion]);
		//console.log("URC trash " + URCommentsArray[CloseNotIdentifiedPosistion]);
			
        def_names[6] = "Incorrect turn";
        def_names[7] = "Incorrect address";
        def_names[8] = "Incorrect route";
        def_names[9] = "Missing roundabout";
        def_names[10] = "General error";
        def_names[11] = "Turn not allowed";
        def_names[12] = "Incorrect junction";
        def_names[13] = "Missing bridge overpass";
        def_names[14] = "Wrong driving direction";
        def_names[15] = "Missing Exit";
        def_names[16] = "Missing Road";
        def_names[18] = "Missing Landmark";
        def_names[19] = "Blocked Road";
        def_names[21] = "Missing Street Name";
        def_names[22] = "Incorrect Street Prefix or Suffix";

		//zoom out links
		URC_Text[0] = "Zoom Out 0 & Close UR";
		URC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

		URC_Text[1] = "Zoom Out 2 & Close UR";		
		URC_Text_tooltip[1] = "Zooms out to level 2 this is where I found most of the toolbox highlighting works and closes the UR window";

		URC_Text[2] = "Zoom Out 3 & Close UR";
		URC_Text_tooltip[2] = "Zooms out to level 3 this is where I found most of the toolbox highlighting works and closes the UR window";

		URC_Text_tooltip[3] = "Reload the map";

		URC_Text_tooltip[4] = "Number of UR Shown";

		//tab names
		URC_Text[5] = "Comments";
		URC_Text[6] = "UR Filtering";
		URC_Text[7] = "Settings";

		//UR Filtering Tab
		URC_Text[8] = "Instructions";
				
		URC_Text[9] = "Enable URComments UR filtering";
		URC_Text_tooltip[9] = "Enable or disable URComments filtering";

		URC_Text[10] = "Enable UR pill counts";
		URC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

		URC_Text[12] = "Hide Waiting";
		URC_Text_tooltip[12] = "Only show UR that need work (hide inbetween states)";

		URC_Text[13] = "Only show my UR";
		URC_Text_tooltip[13] = "Hide UR where there are zero comments from the logged in editor";

		URC_Text[14] = "Show others UR past reminder + close";
		URC_Text_tooltip[14] = "Show UR that have gone past the reminder and close day settings added together";

		URC_Text[15] = "Hide UR Reminders needed";
		URC_Text_tooltip[15] = "Hide UR where reminders are needed";

		URC_Text[16] = "Hide user replies";
		URC_Text_tooltip[16] = "Hide UR with user replies";

		URC_Text[17] = "Hide UR close needed";
		URC_Text_tooltip[17] = "Hide UR that need closing";

		URC_Text[18] = "Hide UR no comments";
		URC_Text_tooltip[18] = "Hide UR that have zero comments";

		URC_Text[19] = "hide 0 comments without descriptions";
		URC_Text_tooltip[19] = "Hide UR that do not have descriptions or comments";

		URC_Text[20] = "hide 0 comments with descriptions";
		URC_Text_tooltip[20] = "Hide UR that have descriptions and zero comments";

		URC_Text[21] = "Hide Closed UR";
		URC_Text_tooltip[21] = "Hide closed UR";

		URC_Text[22] = "Hide Tagged UR";
		URC_Text_tooltip[22] = "Hide UR that are tagged with URO stle tags ex. [NOTE]";

		URC_Text[23] = "Reminder days: ";
		//URC_Text_tooltip[23] = "";

		URC_Text[24] = "Close days: ";
		//URC_Text_tooltip[] = "";

		//settings tab
		URC_Text[25] = "Auto set new UR comment";
		URC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

		URC_Text[26] = "Auto set reminder UR comment";
		URC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

		URC_Text[27] = "Auto zoom in on new UR";
		URC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

		URC_Text[28] = "Auto center on UR";
		URC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

		URC_Text[29] = "Auto click open, solved, not identified";
		URC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

		URC_Text[30] = "Auto save after a solved or not identified comment";
		URC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

		URC_Text[31] = "Auto close comment window";
		URC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

		URC_Text[32] = "Auto reload map after comment";
		URC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map.";

		URC_Text[33] = "Auto zoom out after comment";
		URC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

		URC_Text[34] = "Auto switch to the UrComments tab";
		URC_Text_tooltip[34] = "Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab";

		URC_Text[35] = "Close message - double click link (auto send)";
		URC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

		URC_Text[36] = "All comments - double click link (auto send)";
		URC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

		URC_Text[37] = "Comment List";
		URC_Text_tooltip[37] = "This is shows the selected comment list, there is support for a custom list or If you would like your comment list built into the this script or have suggestions on the Comments team’s list please contact me at rickzabel @waze or @gmail";

		URC_Text[38] = "Disable done button";
		URC_Text_tooltip[38] = "Disable the done button at the bottom of the new UR window";

		URC_Text[39] = "Unfollow UR after send";
		URC_Text_tooltip[39] = "Unfollow UR after sending comment";

		URC_Text[40] = "Auto send reminders";
		URC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

		URC_Text[41] = "Replace tag name with editor names";
		URC_Text_tooltip[41] = "When a UR has the logged in editors name in it replace the tag type with the editors name";

		URC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";
		
		URC_USER_PROMPT[1] = "UR Comments - you are missing the following items from your custom comment list: ";
		
		URC_USER_PROMPT[2] = "List can not be found. You can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";
		
		URC_USER_PROMPT[3] = "URComments you can not set close days to zero";
		
		URC_USER_PROMPT[4] = "URComments to use the double click links you must have the autoset UR status option enabled";
		
		URC_USER_PROMPT[5] = "Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";
		
		URC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a oragne box, length must be kept short
		
		URC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a oragne box, length must be kept short
		
		URC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO\'s UR filters are active."; //this message is shown across the top of the map in a oragne box, length must be kept short
		
		URC_USER_PROMPT[9] = "UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send.";
		
		URC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a user request open."; //this message is shown across the top of the map in a oragne box, length must be kept short

		URC_USER_PROMPT[11] = "URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. "; //conformation message/ question



		
        //end CommentTeam's list

        //custom other languages lists from external list
        // } else if (SelectedBoilerPlateCreator === "Custom") {
    } else {



        var CustomListError = false;
        var CustomErrorListText = "";
        var CustomErrorListCount = 0;
        if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "Array2")) {
            CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "Array2, ";
            CustomListError = true;
            CustomErrorListCount = CustomErrorListCount + 1;
        }

        if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names")) {
            CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "def_names, ";
            CustomListError = true;
            CustomErrorListCount = CustomErrorListCount + 1;
        }

        if (!eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion")) {
            CustomErrorListText = CustomErrorListText + "Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion, ";
            CustomListError = true;
            CustomErrorListCount = CustomErrorListCount + 1;
        }
/*
        if (! eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[41]")) {
            CustomErrorListText = CustomErrorListText + " " + SelectedBoilerPlateCreator + " missing URC_Text Please reinstall the custom comments file from greasyfork.";
            CustomListError = true;
            CustomErrorListCount = CustomErrorListCount + 1;
        }
*/
        if (CustomListError === false) {

            //found custom list
            URCommentsArray = eval("window.Urcomments" + SelectedBoilerPlateCreator + "Array2");

            //the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status)
            ReminderPosistion = eval("window.Urcomments" + SelectedBoilerPlateCreator + "ReminderPosistion");

            //the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status)
            CloseNotIdentifiedPosistion = eval("window.Urcomments" + SelectedBoilerPlateCreator + "CloseNotIdentifiedPosistion");

            //copy the waze default titles into the active ?
            //Waze's default URs number to name conversion array
            //Thanks to SuperMedic

            def_names[6] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[6]"); //"Incorrect turn";
            def_names[7] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[7]"); //"Incorrect address";
            def_names[8] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[8]"); //"Incorrect route";
            def_names[9] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[9]"); //"Missing roundabout";
            def_names[10] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[10]"); //"General error";
            def_names[11] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[11]"); //"Turn not allowed";
            def_names[12] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[12]"); //"Incorrect junction";
            def_names[13] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[13]"); //"Missing bridge overpass";
            def_names[14] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[14]"); //"Wrong driving direction";
            def_names[15] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[15]"); //"Missing Exit";
            def_names[16] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[16]"); //"Missing Road";
            def_names[18] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[18]"); //"Missing Landmark";
            def_names[19] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[19]"); //"Blocked Road";
            def_names[21] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[21]"); //"Missing Street Name";
            def_names[22] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "def_names[22]"); //"Incorrect Street Prefix or Suffix";	

			
			
			try {
				URC_Text[0] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[0]");
				URC_Text_tooltip[0] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[0]");	

				URC_Text[1] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[1]");
				URC_Text_tooltip[1] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[1]");	

				URC_Text[2] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[2]");
				URC_Text_tooltip[2] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[2]");	

				URC_Text[3] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[3]");
				URC_Text_tooltip[3] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[3]");	

				URC_Text[4] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[4]");
				URC_Text_tooltip[4] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[4]");	

				URC_Text[5] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[5]");
				URC_Text_tooltip[5] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[5]");	

				URC_Text[6] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[6]");
				URC_Text_tooltip[6] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[6]");	

				URC_Text[7] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[7]");
				URC_Text_tooltip[7] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[7]");	

				URC_Text[8] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[8]");
				URC_Text_tooltip[8] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[8]");	

				URC_Text[9] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[9]");
				URC_Text_tooltip[9] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[9]");	

				URC_Text[10] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[10]");
				URC_Text_tooltip[10] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[10]");	

				URC_Text[11] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[11]");
				URC_Text_tooltip[11] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[11]");	

				URC_Text[12] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[12]");
				URC_Text_tooltip[12] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[12]");	

				URC_Text[13] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[13]");
				URC_Text_tooltip[13] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[13]");	

				URC_Text[14] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[14]");
				URC_Text_tooltip[14] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[14]");	

				URC_Text[15] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[15]");
				URC_Text_tooltip[15] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[15]");	

				URC_Text[16] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[16]");
				URC_Text_tooltip[16] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[16]");	

				URC_Text[17] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[17]");
				URC_Text_tooltip[17] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[17]");	

				URC_Text[18] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[18]");
				URC_Text_tooltip[18] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[18]");	

				URC_Text[19] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[19]");
				URC_Text_tooltip[19] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[19]");	

				URC_Text[20] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[20]");
				URC_Text_tooltip[20] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[20]");	

				URC_Text[21] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[21]");
				URC_Text_tooltip[21] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[21]");	

				URC_Text[22] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[22]");
				URC_Text_tooltip[22] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[22]");	

				URC_Text[23] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[23]");
				URC_Text_tooltip[23] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[23]");	

				URC_Text[24] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[24]");
				URC_Text_tooltip[24] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[24]");	

				URC_Text[25] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[25]");
				URC_Text_tooltip[25] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[25]");	

				URC_Text[26] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[26]");
				URC_Text_tooltip[26] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[26]");	

				URC_Text[27] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[27]");
				URC_Text_tooltip[27] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[27]");	

				URC_Text[28] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[28]");
				URC_Text_tooltip[28] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[28]");	

				URC_Text[29] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[29]");
				URC_Text_tooltip[29] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[29]");	

				URC_Text[30] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[30]");
				URC_Text_tooltip[30] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[30]");	

				URC_Text[31] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[31]");
				URC_Text_tooltip[31] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[31]");	

				URC_Text[32] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[32]");
				URC_Text_tooltip[32] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[32]");	

				URC_Text[33] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[33]");
				URC_Text_tooltip[33] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[33]");	

				URC_Text[34] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[34]");
				URC_Text_tooltip[34] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[34]");	

				URC_Text[35] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[35]");
				URC_Text_tooltip[35] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[35]");	

				URC_Text[36] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[36]");
				URC_Text_tooltip[36] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[36]");	

				URC_Text[37] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[37]");
				URC_Text_tooltip[37] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[37]");	

				URC_Text[38] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[38]");
				URC_Text_tooltip[38] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[38]");	

				URC_Text[39] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[39]");
				URC_Text_tooltip[39] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[39]");	

				URC_Text[40] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[40]");
				URC_Text_tooltip[40] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[40]");	

				URC_Text[41] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text[41]");
				URC_Text_tooltip[41] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_Text_tooltip[41]");	


				URC_USER_PROMPT[0] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[0]");
				URC_USER_PROMPT[1] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[1]");
				URC_USER_PROMPT[2] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[2]");
				URC_USER_PROMPT[3] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[3]");
				URC_USER_PROMPT[4] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[4]");
				URC_USER_PROMPT[5] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[5]");
				URC_USER_PROMPT[6] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[6]");
				URC_USER_PROMPT[7] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[7]");
				URC_USER_PROMPT[8] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[8]");
				URC_USER_PROMPT[9] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[9]");
				URC_USER_PROMPT[10] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[10]");
				URC_USER_PROMPT[11] = eval("window.Urcomments" + SelectedBoilerPlateCreator + "URC_USER_PROMPT[11]");
						
				
			}
			catch(err) {
					alert("URC: The text is URC is now configurable in the custom comments file. Your comments file is outdated please back up your comments, force update the comments file @greasyfork and then paste your comments back into the custom comments file. Since there is an error the comments team's list will be chosen.");
					
				localStorage.setItem('BoilerPlateCreators', 'CommentTeam');
				$("#sidepanel-Comments").html('');
				//reload the content
				ChangeLanguage = true;

				//setTimeout(URComments_bootstrap, 200);
				URComments_bootstrap();
				return false;
			
				
				
			}
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
        } else {
            //on problem set the list back to the comments team
            localStorage.setItem('BoilerPlateCreators', 'CommentTeam');

            if (CustomErrorListCount == 5) {
                alert(URC_USER_PROMPT[0] + CustomErrorListText);
            } else {
                alert(URC_USER_PROMPT[1] + CustomErrorListText);

            }

            URCommentsArray = [SelectedBoilerPlateCreator + " " + URC_USER_PROMPT[2],
                               " ",
                               " "
                              ];
            }
    }
    URComments_init();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////
////// init
//////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function URComments_init() {
    //urcToConsole("Start init 1");

    //create the URComments object
    var URComments = {};

    URComments.init = function() {
        //if we are changing the language do not redraw the tab		
        if (ChangeLanguage === false) {

            //CSS
            //expand the UR textarea so we can verfiy what comment we clicked on. special thanks to SeekingSerenity 
            var g = '.ur-comment-list .comment-list { bottom: 200px !important; } .ur-comment-list .new-comment-form textarea { height: 140px !important; } .ur-comment-list .new-comment-form { height: 200px !important; }';
			
			var wazeheight = $(".view-area").height();
			if (wazeheight > 500){
				//betaeditor commetn textarea
				g = g + '.new-comment-form .new-comment-text { height: 140px !important; }';
			}
			
            //css for items in my tab that are in a label (uro presets)
            g = g + '#sidepanel-Comments label { cursor:pointer; margin:0px 0px 0px; vertical-align: middle;font-size: 10px;}';

            //css for checkboxes
            g = g + '#sidepanel-Comments .URCommentsCheckbox { text-decoration:none; cursor:pointer; color: #000000; margin:0px 0px 0px; vertical-align: middle; font-size: 12px;}';

            //css for our comments,
            g = g + '#sidepanel-Comments .URComments { text-decoration:none; cursor:pointer; color: #000000; font-size: 12px;}'; // margin-top: 5px;

            //css for our uro presets,
            g = g + '#sidepanel-Comments .URCommentsPresets { text-decoration:none; cursor:pointer; color: #000000; font-size: 10px;}';

            //css for our nav tabs,
            g = g + '#comments-tab22 ul { font-size: 12px; padding: 0px;}';

            //css for our nav tabs links,
            g = g + '#comments-tab22 a { padding: 3px !important ; margin-right: 0px !important;}';

            // keep the padding on our nav tabs
            g = g + '#comments-tab22 nav-tabs { padding: 0px !important;}';

            //css for non selected UR opacity
            g = g + ".olMap.problem-selected .map-problem:not(.selected) { opacity: .5 !important;}";


            //css to fix the beta editors UR window
            g = g + '.problem-edit .section .title { line-height: 15px !important;  }';

            g = g + '.problem-edit .header { line-height: 15px !important; padding: 0px 15px!important; }';
            g = g + '.problem-edit .section .content { padding: 5px !important;}';

            /*
				g = g + '.problem-edit { max-height: 85% !important; }';

				//g = g + '.problem-edit .body { position: absolute !important; top: 30px !important; bottom: 5px !important; overflow: auto !important;}';

				//g = g + '.problem-edit .body { position: absolute !important; top: 30px !important; bottom: 5px !important; overflow: auto !important; width: 280px !important;}';

				g = g + '#panel-container .panel { left: 0px !important; top: 60px !important; bottom: 25px !important; margin-bottom: 15px !important;}';

				g = g + '.problem-edit .conversation.section .new-comment-form { padding: 10px 15px !important; }';
				//g = g + '.problem-edit .conversation.section .new-comment-form textarea { placeholder: "Remember, be nice!"; margin-bottom: 5px; }';
				g = g + '.problem-edit .actions .controls-container label[for|="state"] { margin-bottom: 5px; }';
				g = g + '.header .close-panel { padding-top: 5px; }';
				g = g + '.header .focus { padding-top: 5px; }';
				g = g + '.problem-edit .conversation.section .comment-list { padding-right: 0px; margin-right: 5px; padding-left: 0px; margin-left: 5px; overflow-y: hidden; max-height: 100%;}';
				*/
				
            //css to undo some of the changes from maximizer
            if($("#sidebar").width() < 300) {
                g = g + '#sidebar { max-width: 290px !important;}';
                g = g + '.show-sidebar .row-fluid .fluid-fixed {margin-left: 290px !important;}';
            }
	
			//move description up a div
			g = g + '.problem-edit .description { background-color: white; overflow-x: hidden;  overflow-y: auto;  max-height: 80px; border-bottom: 2px solid #e9e9e9;}';
					
					
			//var g = '#panel-container .panel { margin-top:50px !important;}';	
		
            //append our css to the head
			$("head").append($('<style type="text/css">' + g + '</style>'));

            //urcToConsole("Start adding the URComments's tab");
            //add comments tab
            var b = $('<li><a href="#sidepanel-Comments" data-toggle="tab" id="CommentsTab">URComments</a> </li> ');
            //i had to switch to first() becuase someone was reusing the nav tabs in another script and this would cause my tab to go inside theirs!
            $("h2 + ul.nav-tabs").first().append(b);

            //add the content to the comments tab
            //Comment tab header and zoom out button
            var c = "";
            c = c + '<div class="tab-pane" id="sidepanel-Comments" ><div class="URComments"></div></div>';
            $("h2 + ul.nav-tabs + .tab-content").append(c);

        }
        //reset the var to change the language
        ChangeLanguage = false;


        var c = "";
        c = c + '<div style="position: absolute; left: 20px;"><img src="' + UrCommentsIcon + '" style="cursor:default;"></div>';
        c = c + '<div style="position: absolute; left: 70px;"><b>UR Comments Mapraid ' + URCommentVersion + '</b>';
        c = c + '<br>';
        c = c + '<a id="URCommentZoomOutButton" class="URComments" Title="' + URC_Text_tooltip[0] + '">' + URC_Text[0] + '</a>';
        c = c + '<br>';
        c = c + '<a id="URCommentZoomOutButton2" class="URComments" Title="' + URC_Text_tooltip[1] + '">' + URC_Text[1] + '</a>';
        c = c + '<br>';
        c = c + '<a id="URCommentZoomOutButton3" class="URComments" Title="' + URC_Text_tooltip[2] + '">' + URC_Text[2] + '</a>';		
        c = c + '<div id="URCWazeReloadMap" title="'+ URC_Text_tooltip[3] + '" data-original-title="" class="icon-repeat reload-button URComments" content="" style="font-size: 20px; position: absolute; left: 140px; top: 22px;"></div>';			

        //UR count
        //c = c + '<div Title="Number of UR Shown" id="URCount" style="position: absolute; top: 110px; left: 30px; font-size: 8px; width: 55px;"></div>';
        c = c + '<div Title="' + URC_Text_tooltip[4]  + '" id="URCount" style="font-size: 12px; width: 75%; text-align:center;"></div>';

        $("#sidepanel-Comments").append(c);

        //add the map zoom out handlers
        $("#URCommentZoomOutButton").click(URComments.SetZoomCloseUR(0, "CloseUR"));
		//$("#URCommentZoomOutButton").click(URComments.SetZoomCloseUR(1, "CloseUR"));
        $("#URCommentZoomOutButton2").click(URComments.SetZoomCloseUR(2, "CloseUR"));
        $("#URCommentZoomOutButton3").click(URComments.SetZoomCloseUR(3, "CloseUR"));


        //add the map reload handler
        $("#URCWazeReloadMap").click(URComments.AutoReloadMapOnComment);

        c = '<div id="comments-tab22" class="active" style="padding-top: 90px;">';
        c = c + '	<ul class="nav nav-tabs">';
        c = c + '		<li class="active"><a data-toggle="tab" href="#sidepanel-URComments-list">' + URC_Text[5] + '</a></li>';
        c = c + '		<li><a data-toggle="tab" href="#sidepanel-URComments-URO-Presets">' + URC_Text[6] + '</a></li>';
        c = c + '		<li><a data-toggle="tab" href="#sidepanel-URComments-settings">' + URC_Text[7] + '</a></li>';
        c = c + '	</ul>';
        c = c + '	<div class="tab-content">'; // style="padding: 10px 1px 1px 10px !important;"
        c = c + '		<div class="tab-pane active" id="sidepanel-URComments-list">';
        c = c + '		</div>';
        c = c + '		<div class="tab-pane" id="sidepanel-URComments-URO-Presets">';
        c = c + '		</div>';
        c = c + '		<div class="tab-pane" id="sidepanel-URComments-settings">';
        c = c + '		</div>';
        c = c + '	</div>';
        c = c + '</div>';

        //add the sub tabs to the scripts main tab
        $("#sidepanel-Comments").append(c);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Comments
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

		
		d = $('<a href="https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide=id.p">' + URC_Text[8] + '<a/><br><br>');
        $("#sidepanel-URComments-URO-Presets").append(d);
		
        //enable or disable urc filtering URCommentsFilterEnabled
        d = $('<label Title="' + URC_Text_tooltip[9] + '"><input type="checkbox" id="URCommentsFilterEnabled" class="URCommentsCheckbox"> ' + URC_Text[9] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsFilterEnabled").click(function () {
            $(localStorage.setItem('URCommentsFilterEnabled', URCommentsFilterEnabled.checked ));

            //if(URCommentsFilterEnabled.checked == true){
            setTimeout(URComments.FilterURs('filterenabled'), 0);
            //}
        });

        var avdd = localStorage.getItem('URCommentsFilterEnabled');
        if(avdd === null) { avdd = true;}
        $("#URCommentsFilterEnabled").prop('checked', eval(avdd));


        //enable or disable ur pill counts
        d = $('<label Title="' + URC_Text_tooltip[10] + '"><input type="checkbox" id="URCommentsPillEnabled" class="URCommentsCheckbox"> ' + URC_Text[10] + '</input></label><br><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsPillEnabled").click(function () {
            $(localStorage.setItem('URCommentsPillEnabled', URCommentsPillEnabled.checked ));

            //if(URCommentsPillEnabled.checked == true){
            setTimeout(URComments.FilterURs('filterenabled'), 0);
            //}
        });

        var avdd = localStorage.getItem('URCommentsPillEnabled');
        if(avdd === null) { avdd = true;}
        $("#URCommentsPillEnabled").prop('checked', eval(avdd));


        //hide inbetween ur
        d = $('<label Title="' + URC_Text_tooltip[12] + '"><input type="checkbox" id="URCommentsHideInbetween" class="URCommentsCheckbox"> ' + URC_Text[12] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideInbetween").click(function () {
            $(localStorage.setItem('URCommentsHideInbetween', URCommentsHideInbetween.checked ));
            setTimeout(URComments.FilterURs('hideInbetween'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideInbetween');
        if(avdd === null) { avdd = true;}
        $("#URCommentsHideInbetween").prop('checked', eval(avdd));



        //hide UR that are not "mine"
        d = $('<label Title="' + URC_Text_tooltip[13] + '"><input type="checkbox" id="URCommentsHideNotMyUR" class="URCommentsCheckbox"> ' + URC_Text[13] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideNotMyUR").click(function () {
            $(localStorage.setItem('URCommentsHideNotMyUR', URCommentsHideNotMyUR.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideNotMyUR'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideNotMyUR');
        if(avdd === null) { avdd = true;}
        $("#URCommentsHideNotMyUR").prop('checked', eval(avdd));

        //show UR that have gone past the close day setting
        d = $('<label Title="' + URC_Text_tooltip[14] + '"><input type="checkbox" id="URCommentsShowPastClose" class="URCommentsCheckbox"> ' + URC_Text[14] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsShowPastClose").click(function () {
            $(localStorage.setItem('URCommentsShowPastClose', URCommentsShowPastClose.checked ));
            setTimeout(URComments.FilterURs('URCommentsShowPastClose'), 0);
        });

        var avdd = localStorage.getItem('URCommentsShowPastClose');
        if(avdd === null) { avdd = true;}
        $("#URCommentsShowPastClose").prop('checked', eval(avdd));



        //hide reminders
        d = $('<label Title="' + URC_Text_tooltip[15] + '"><input type="checkbox" id="URCommentsHideReminderNeeded" class="URCommentsCheckbox"> ' + URC_Text[15] + '</input></label><br><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideReminderNeeded").click(function () {
            $(localStorage.setItem('URCommentsHideReminderNeeded', URCommentsHideReminderNeeded.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideReminderNeeded'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideReminderNeeded');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideReminderNeeded").prop('checked', eval(avdd));


        //hide replies
        d = $('<label Title="' + URC_Text_tooltip[16] + '"><input type="checkbox" id="URCommentsHideReplies" class="URCommentsCheckbox"> ' + URC_Text[16] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideReplies").click(function () {
            $(localStorage.setItem('URCommentsHideReplies', URCommentsHideReplies.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideReplies'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideReplies');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideReplies").prop('checked', eval(avdd));



        //hide older than 7 day
        d = $('<label Title="' + URC_Text_tooltip[17] + '"><input type="checkbox" id="URCommentsHideCloseNeeded" class="URCommentsCheckbox"> ' + URC_Text[17] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideCloseNeeded").click(function () {
            $(localStorage.setItem('URCommentsHideCloseNeeded', URCommentsHideCloseNeeded.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideCloseNeeded'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideCloseNeeded');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideCloseNeeded").prop('checked', eval(avdd));


        //hide initial (zero comments)
        d = $('<label Title="' + URC_Text_tooltip[18] + '"><input type="checkbox" id="URCommentsHideInital" class="URCommentsCheckbox"> ' + URC_Text[18] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideInital").click(function () {
            $(localStorage.setItem('URCommentsHideInital', URCommentsHideInital.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideInital'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideInital');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideInital").prop('checked', eval(avdd));

        //Hide UR that do not have descriptions
        d = $('<label Title="' + URC_Text_tooltip[19] + '"><input type="checkbox" id="URCommentsHideWithoutDescript" class="URCommentsCheckbox"> ' + URC_Text[19] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideWithoutDescript").click(function () {
            $(localStorage.setItem('URCommentsHideWithoutDescript', URCommentsHideWithoutDescript.checked ));
            setTimeout(URComments.FilterURs('HideWithoutDescript'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideWithoutDescript');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideWithoutDescript").prop('checked', eval(avdd));


        //Hide UR that have descriptions
        d = $('<label Title="' + URC_Text_tooltip[20] + '"><input type="checkbox" id="URCommentsHideWithDescript" class="URCommentsCheckbox"> ' + URC_Text[20] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideWithDescript").click(function () {
            $(localStorage.setItem('URCommentsHideWithDescript', URCommentsHideWithDescript.checked ));
            setTimeout(URComments.FilterURs('HideWithDescript'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideWithDescript');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideWithDescript").prop('checked', eval(avdd));			


        //hide closed
        d = $('<label Title="' + URC_Text_tooltip[21] + '"><input type="checkbox" id="URCommentsHideClosed" class="URCommentsCheckbox"> ' + URC_Text[21] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideClosed").click(function () {
            $(localStorage.setItem('URCommentsHideClosed', URCommentsHideClosed.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideClosed'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideClosed');
        if(avdd === null) { avdd = true;}
        $("#URCommentsHideClosed").prop('checked', eval(avdd));


        //hide notes
        d = $('<label Title="' + URC_Text_tooltip[22] + '"><input type="checkbox" id="URCommentsHideNotes" class="URCommentsCheckbox"> ' + URC_Text[22] + '</input></label><br><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentsHideNotes").click(function () {
            $(localStorage.setItem('URCommentsHideNotes', URCommentsHideNotes.checked ));
            setTimeout(URComments.FilterURs('URCommentsHideNotes'), 0);
        });

        var avdd = localStorage.getItem('URCommentsHideNotes');
        if(avdd === null) { avdd = false;}
        $("#URCommentsHideNotes").prop('checked', eval(avdd));


        //days used to filter UR (reminder days / close days)
        var d = $('<form>' + URC_Text[23] + '<input type="text" id="ReminderDays" style="width: 35px;"><br>' + URC_Text[24] + ' <input type="text" id="CloseDays" style="width: 35px;"><br> </form><br><br><br><br><br><br>');
        $("#sidepanel-URComments-URO-Presets").append(d);


        //load reminder days
        $('#ReminderDays').val(localStorage.getItem('ReminderDays'));
        //load close days			
        $('#CloseDays').val(localStorage.getItem('CloseDays'));
        //on load validation
        if ($('#ReminderDays').val() < 0  ) { //|| $('#ReminderDays').val() >= $('#CloseDays').val()
            $('#ReminderDays').val('0');
            $(localStorage.setItem('ReminderDays', $('#ReminderDays').val() ));
        }		
        if ($('#CloseDays').val() < 1) { // || $('#CloseDays').val() <= $('#ReminderDays').val() 
            $('#CloseDays').val('7');
            $(localStorage.setItem('CloseDays', $('#CloseDays').val() ));
        }

        //reminder days verification
        $("#ReminderDays").change(function () {
           /* if ($('#ReminderDays').val() >= $('#CloseDays').val() ) {
                $('#ReminderDays').val('4');
                alert("urcomments you can not sent the reminder message larger than close days");
            } else {*/
                //save 
                $(localStorage.setItem('ReminderDays', $('#ReminderDays').val() ));
                setTimeout(URComments.FilterURs('ReminderDaysChange'), 0);
            //}
        });

        //close days verification
        $("#CloseDays").change(function () {
           if ($('#CloseDays').val() < 1  ) { //|| $('#CloseDays').val() <= $('#ReminderDays').val()
                $('#CloseDays').val('7');
                alert(URC_USER_PROMPT[3]); //"URComments you can not set close days to zero days";
            } else {
                //save
                $(localStorage.setItem('CloseDays', $('#CloseDays').val() ));
                setTimeout(URComments.FilterURs('CloseDaysChange'), 0);
            }
        });

			
			
			
			
			//mapraid tools

        
            //mapraid AvoidInitialWithDescriptions
			d = $('<label Title="Avoid Initial With Descriptions"><input type="checkbox" id="AvoidInitialWithDescriptions" class="URCommentsCheckbox"> Avoid Initial With Descriptions</input></label><br><br>');
            $("#sidepanel-URComments-list").append(d);
			$("#AvoidInitialWithDescriptions").click(function () {
				$(localStorage.setItem('AvoidInitialWithDescriptions', AvoidInitialWithDescriptions.checked ));
			});

			var avdd = localStorage.getItem('AvoidInitialWithDescriptions');
			if(avdd === null) { avdd = true;}
			$("#AvoidInitialWithDescriptions").prop('checked', eval(avdd));
			
      
	  
			//mapraid avoid commenting on turns not allowed AvoidTurnsNotAllowed.checked
			d = $('<label Title="Avoid commenting on turns not allowed"><input type="checkbox" id="AvoidTurnsNotAllowed" class="URCommentsCheckbox"> Avoid commenting on turns not allowed</input></label><br><br>');
            $("#sidepanel-URComments-list").append(d);
			$("#AvoidTurnsNotAllowed").click(function () {
				$(localStorage.setItem('AvoidTurnsNotAllowed', AvoidTurnsNotAllowed.checked ));
			});

			var avdd = localStorage.getItem('AvoidTurnsNotAllowed');
			if(avdd === null) { avdd = true;}
			$("#AvoidTurnsNotAllowed").prop('checked', eval(avdd));
						
			//send initial
			var d = $('<a id="URCSendInital" class="URComments" Title="Mapraid send inital messages for all UR">Mapraid Send Initial</a></div><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
            //create the callback function
            $("#URCSendInital").click(URComments.FilterURs('SendAllInitial'));
			//setTimeout(URComments.FilterURs(a), 0);

			//enable or disable URC's AUTO close stale UR URCommentsAutoClose
			//d = $('<label Title="Auto Close 2 comments, past close date, with just reminding"><input type="checkbox" id="URCommentsAutoClose" class="URCommentsCheckbox"> Auto Close URs past date</input></label><br>');
			// $("#sidepanel-URComments-URO-Presets").append(d);
			d = $('<a id="URCommentsAutoClose" class="URComments" Title="Auto Close 2 comments, past close date, with the words just reminding">Mapraid Close 2 comment stale Initial</a></div><br><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
            //create the callback function
            $("#URCommentsAutoClose").click(URComments.FilterURs('URCommentsAutoClose'));

			/*
			//send all reminders
			var d = $('<a id="MapraidReport" class="URComments" Title="Mapraid send reminders for all UR that need reminders">Mapraid Send Reminders</a></div><br><br><br>');
            //d.click (URCommentscomment1);
            $("#sidepanel-URComments-list").append(d);
            //create the callback function
            $("#MapraidReport").click(URComments.FilterURs('SendAllReminders'));
			//setTimeout(URComments.FilterURs(a), 0);
			*/		
			
			//mapraid tools
			
	




	

        //start generating the comment list and mouse click handlers
        //urcToConsole("Start adding comments to the comment tab");
        //comments setup
        d = "";

        //CurrentIndex is used to keep count of total arrays pairs which is used on the div's id tags
        var CurrentIndex = 1;
        //urcToConsole("Create Div 1");

        //setup the comment color var
        var colorrr = "CC0000";
        var Title = "";
        var URCommentURLNote = "";

        //go over the array and generate comment divs
        for (var i = 0; i < URCommentsArray.length; i = i + 3) {
            //urcToConsole("Create div for - " + URCommentsArray[i] + " " + URCommentsArray[i + 2]);

            // make the URStatus lower case
            var URStatus = (URCommentsArray[i + 2]).toLowerCase();

            if (URStatus === "open") {
                //black
                colorrr = "#000000";
            } else if (URStatus === "solved") {
                //green
                colorrr = "#008F00";
            } else if (URStatus === "notidentified") {
                //orange
                colorrr = "#E68A00";
            } else {
                //red - not defined and that is a problem	
                colorrr = "#CC0000";

            }
            //escaping titles and comments with escapeHtml(Comment) so we can display items with special char as html;
            //generate the comment links

            Title = URCommentsArray[i];
            var Comment = URComments.escapeHtml(URCommentsArray[i + 1]);

            //normal comment link
            d = '<div><a id="URComments-comment' + CurrentIndex + '" class="URComments" style="color:' + colorrr + '" Title="Title: ' + Title + ' Action: ' + URStatus + '; Comment: ' + Comment + ' ">' + Title + '</a>';
            //$("#sidepanel-Comments").append(d);

            //(double click) comment add-on
            if (URCommentsArray[i] === URCommentsArray[CloseNotIdentifiedPosistion] && localStorage.getItem('DBLClk7DCAutoSend') == "yes" || localStorage.getItem('DBLClkAll') == "yes") {
                if (URCommentsArray[i] !== "<br>") {
                    d = d + '<a id="URComments-commentDBLCLK' + CurrentIndex + '" class="URComments" style="color:' + colorrr + '" Title="Double click here to auto send - ' + Title + '"> (Double Click)</a>';
                }
            }

            d = d + '</div>';

            //add comment to list
            $("#sidepanel-URComments-list").append(d);

            //urcToConsole("Create callback(s) for - " + 'URComments-comment' + CurrentIndex);

			//set urID to zero so we dont freak out the functions expecting a UR ID
            urID = 0;

            //create the click function for each comment
            $("#URComments-comment" + CurrentIndex).click(URComments.AutoZoomIN(URCommentsArray[i], URCommentsArray[i + 1], URStatus, urID));

            //create the double click function for each comment
            if (URCommentsArray[i] !== "<br>" && URCommentsArray[i] === URCommentsArray[CloseNotIdentifiedPosistion] && localStorage.getItem('DBLClk7DCAutoSend') == "yes" || localStorage.getItem('DBLClkAll') == "yes") {
                //use this to click send automatically
                if (URCommentsArray[i] !== "<br>") {
                    $("#URComments-commentDBLCLK" + CurrentIndex).dblclick(URComments.AutoZoomIN(URCommentsArray[i], URCommentsArray[i + 1], URStatus, urID, "AutoSendComment"));
                }

            }

            //inc the CurrentIndex
            CurrentIndex++;
        }

        //add 2 br to the end of the list for lower resolution monitors
        d = '<br><br>';
        $("#sidepanel-URComments-list").append(d);	



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// URO+ Preset filters
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //urcToConsole("Start adding URO preset filters to the comment tab");

		/*
        //URO+ new ur with no description
        var d = $('<div><a id="URONewNoDescription" class="URCommentsPresets" Title="Use URO+ to only show new requests without descriptions">URO+ New UR without descriptions</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URONewNoDescription").click(URComments.UROClearClicked('URONewNoDescription'));

        //URO+ new ur
        d = $('<div><a id="URCommentURONEW" class="URCommentsPresets" Title="Use URO+ to only show new requests or ones that have replies from the requestor">URO+ New requests / UR replies</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        $("#URCommentURONEW").click(URComments.UROClearClicked('UroShowNew'));

        //show no responses for reminders
        d = $('<div><a id="URCommentURO4DayFollowUp" class="URCommentsPresets" Title="Use URO+ to only show URs that need a reminders message sent to them">URO+ Reminder message</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentURO4DayFollowUp").click(URComments.UROClearClicked('URO4DayFollowUp'));

        //show no responses for 7 days needs closing
        d = $('<div><a id="URCommentURO7Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 7 days and need to be closed">URO+ 7 Day</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentURO7Day").click(URComments.UROClearClicked('URO7Day'));

        //show no responses for 8 days needs closing
        d = $('<div><a id="URCommentURO8Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 8 days and need to be closed">URO+ 8 Day</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentURO8Day").click(URComments.UROClearClicked('URO8Day'));

        //show no responses for 10 days needs closing
        d = $('<div><a id="URCommentURO10Day" class="URCommentsPresets" Title="Use URO+ to only show URs that are older than 10 days and need to be closed">URO+ 10 Day</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentURO10Day").click(URComments.UROClearClicked('URO10Day'));

        //show no responses for 24 Hour Notice now needs closing
        d = $('<div><a id="URCommentURO24Hr" class="URCommentsPresets" Title="URO+ 8 day 24 Hour Notice. the idea behind this one is that on day 7 you will send 24 hour notices and then 24 hours later come back with this preset to find the ones that need closing">24 Hour Notice expermintal</a></div>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentURO24Hr").click(URComments.UROClearClicked('URO24Hr'));
		*/
        //URO+ clear
		//var d = $('<div><a id="URCommentUROclearUROFiltrs" class="URCommentsPresets" Title="Clears all of the checks boxes in URO’s URs tab, except for Do not apply state/age filters to tagged URs and if you have Only My URs enabled in URComments">URO+ Clear UR Filters</a></div>');
        //$("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        //$("#URCommentUROclearUROFiltrs").click(URComments.UROClearClicked('UROclearUROFiltrs'));

		/*
        //the predefined presets only show comments that the current user has commented on
        d = $('<label Title="Use URO+ to only Show URs with comments from me"><input type="checkbox" id="URCommentUROOnlyMyUR" class="URCommentsCheckbox"> Only My URs</input></label><br>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentUROOnlyMyUR").click(URComments.OnlyMyUR);

        //the predefined presets only show comments that the current user has commented on
        d = $('<label Title="Use URO+ to hide tagged pins. This setting will not be saved."><input type="checkbox" id="URCommentUROHideTagged" class="URCommentsCheckbox"> Temporarily hide tagged pins</input></label><br><br>');
        $("#sidepanel-URComments-URO-Presets").append(d);
        //create the callback function
        $("#URCommentUROHideTagged").click(URComments.HideTagged("trash"));
		*/
		
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Draw Options
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //Auto Set ur comment on new URs
        d = $('<label Title="' + URC_Text_tooltip[25] + '"><input type="checkbox" id="UrCommentAutoSetNewComment" class="URCommentsCheckbox"> ' + URC_Text[25] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentAutoSetNewComment").click(URComments.AutoSetNewComment);

        //Auto Set ur reminder on new URs
        d = $('<label Title="' + URC_Text_tooltip[26] + '"><input type="checkbox" id="UrCommentAutoSet4dayComment" class="URCommentsCheckbox"> ' + URC_Text[26] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentAutoSet4dayComment").click(URComments.UrCommentAutoSet4dayComment);

			/*
            //Auto Set ur 7 day close comment
            d = $('<label Title="Auto set the UR remineder comment on URs that are older then 7 days and have only one comments"><input type="checkbox" id="UrCommentAutoSet7dayComment" class="URCommentsCheckbox"> Auto set 7 day close comment</input></label><br>');
            $("#sidepanel-URComments-settings").append(d);
            //create the callback function
            $("#UrCommentAutoSet7dayComment").click(URComments.UrCommentAutoSet7dayComment);
            */
			
        //auto zoom in for new with no comments
        d = $('<label Title="' + URC_Text_tooltip[27] + '"><input type="checkbox" id="UrCommentNewZoomIn" class="URCommentsCheckbox"> ' + URC_Text[27] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentNewZoomIn").click(URComments.NewZoomIn);

        //auto center at current zoom for UR with comments
        d = $('<label Title="' + URC_Text_tooltip[28] + '"><input type="checkbox" id="UrCommentWithCommentRecenter" class="URCommentsCheckbox"> ' + URC_Text[28] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentWithCommentRecenter").click(URComments.WithCommentRecenter);

        //Auto Click open solved not Identified 
        d = $('<label Title="' + URC_Text_tooltip[29] + '"><input type="checkbox" id="URCommentAutoClickURStatus" class="URCommentsCheckbox"> ' + URC_Text[29] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#URCommentAutoClickURStatus").click(URComments.AutoClickURStatus);

        //UrCommentSaveAfterComment
        d = $('<label Title="' + URC_Text_tooltip[30] + '"><input type="checkbox" id="UrCommentSaveAfterComment" class="URCommentsCheckbox"> ' + URC_Text[30] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentSaveAfterComment").click(URComments.SaveAfterComment);

        //auto close after sending comment replies
        d = $('<label Title="' + URC_Text_tooltip[31] + '"><input type="checkbox" id="UrCommentAutoCloseComment" class="URCommentsCheckbox"> ' + URC_Text[31] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentAutoCloseComment").click(URComments.AutoCloseComment);

        //auto reload map after sending comment replies
        d = $('<label Title="' + URC_Text_tooltip[32] + '"><input type="checkbox" id="UrCommentAutoReloadAfterComment" class="URCommentsCheckbox"> ' + URC_Text[32] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentAutoReloadAfterComment").click(URComments.AutoReloadAfterComment);

        //zoom out map after sending comment replies
        d = $('<label Title="' + URC_Text_tooltip[33] + '"><input type="checkbox" id="UrCommentZoomOutAfterComment" class="URCommentsCheckbox"> ' + URC_Text[33] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentZoomOutAfterComment").click(URComments.ZoomOutAfterComment);

        //Auto switch to the URComments tab after page load
        d = $('<label Title="' + URC_Text_tooltip[34] + '"><input type="checkbox" id="UrCommentAutoSwitchToURCommentsTab" class="URCommentsCheckbox"> ' + URC_Text[34] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentAutoSwitchToURCommentsTab").click(URComments.AutoSwitchToURCommentsTab);

        //Double clicking the 7 day close comment will auto send the 7day close comment
        d = $('<label Title="' + URC_Text_tooltip[35] + '"><input type="checkbox" id="UrCommentDBLClk7DCAutoSend" class="URCommentsCheckbox"> ' + URC_Text[35] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentDBLClk7DCAutoSend").click(URComments.DBLClk7DCAutoSend);

        //Double clicking comments will auto send comments
        d = $('<label Title="' + URC_Text_tooltip[36] + '"><input type="checkbox" id="UrCommentDBLClkAll" class="URCommentsCheckbox"> ' + URC_Text[36] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        //create the callback function
        $("#UrCommentDBLClkAll").click(URComments.DBLClkAll);

        //go over  BoilerPlateCreatorsArray and generate the select   
        d = '<font style="font-size: 12px;">' + URC_Text[37] + ' <select id="BoilerPlateCreators" style="font-size: 12px; margin-top: 5px;" title="' + URC_Text_tooltip[37] + '">';
        for (i = 0; i < BoilerPlateCreatorsArray.length; i = i + 1) {
            urcToConsole("BoilerPlateCreatorsArray " + BoilerPlateCreatorsArray[i]);
			d = d + '<option style="font-size 12px;" value="' + BoilerPlateCreatorsArray[i] + '">' + BoilerPlateCreatorsArray[i] + '</option>';
        }
        d = d + "</select> </font><br><br>";
        $("#sidepanel-URComments-settings").append(d);
        //create call back for the select
        $("#BoilerPlateCreators").change(URComments.BoilerPlateCreatorsFunction);

        //UrCommentDisableURDoneBtn			
        d = $('<label Title="' + URC_Text_tooltip[38] + '"><input type="checkbox" id="UrCommentDisableURDoneBtn" class="URCommentsCheckbox"> ' + URC_Text[38] + '</input></label><br>');
        //$("#sidepanel-URComments-list").append(d);
        $("#sidepanel-URComments-settings").append(d);
        $("#UrCommentDisableURDoneBtn").click(function () {
            $(localStorage.setItem('UrCommentDisableURDoneBtn', UrCommentDisableURDoneBtn.checked ));
        });

        var avdd = localStorage.getItem('UrCommentDisableURDoneBtn');
        if(avdd === null) { avdd = true;}
        $("#UrCommentDisableURDoneBtn").prop('checked', eval(avdd));


        //URCommentURUnfollow
        d = $('<label Title="' + URC_Text_tooltip[39] + '"><input type="checkbox" id="URCommentURUnfollow" class="URCommentsCheckbox"> ' + URC_Text[39] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        $("#URCommentURUnfollow").click(function () {
            $(localStorage.setItem('URCommentURUnfollow', URCommentURUnfollow.checked ));
        });

        var avdd = localStorage.getItem('URCommentURUnfollow');
        if(avdd === null) { avdd = false;}
        $("#URCommentURUnfollow").prop('checked', eval(avdd));

        //when on screen auto send my own reminders
        d = $('<label Title="' + URC_Text_tooltip[40] + '"><input type="checkbox" id="URCommentsAutoSendMyReminders" class="URCommentsCheckbox"> ' + URC_Text[40] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        $("#URCommentsAutoSendMyReminders").click(function () {

            if(URCommentsAutoSendMyReminders.checked == true) {
                var r = confirm(URC_USER_PROMPT[11]); //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. "
				
                //this is where we reuse the r var this makes the nested ifs much more simple
                if (r === true ) {
                    setTimeout(URComments.FilterURs('URCommentsAutoSendMyReminders'), 0);
                } else {
                    $("#URCommentsAutoSendMyReminders").prop('checked', false);

                }
            }
            $(localStorage.setItem('URCommentsAutoSendMyReminders', URCommentsAutoSendMyReminders.checked ));
        });

        var avdd = localStorage.getItem('URCommentsAutoSendMyReminders');
        if(avdd === null) { avdd = false;}
        $("#URCommentsAutoSendMyReminders").prop('checked', eval(avdd));			

        //when on screen auto send my own reminders
        d = $('<label Title="' + URC_Text_tooltip[41] + '"><input type="checkbox" id="URCommentsReplaceTagWithEditorName" class="URCommentsCheckbox"> ' + URC_Text[41] + '</input></label><br>');
        $("#sidepanel-URComments-settings").append(d);
        $("#URCommentsReplaceTagWithEditorName").click(function () {
            $(localStorage.setItem('URCommentsReplaceTagWithEditorName', URCommentsReplaceTagWithEditorName.checked ));
            setTimeout(URComments.FilterURs('URCommentsReplaceTagWithEditorName'), 0);
        });

        var avdd = localStorage.getItem('URCommentsReplaceTagWithEditorName');
        if(avdd === null) { avdd = false;}
        $("#URCommentsReplaceTagWithEditorName").prop('checked', eval(avdd));	

        urcToConsole("Tab Complete");

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Load and set saved options
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //URComments tab is loaded load options to last state
        //here we also check to see if the options have ever been set (new user) if not we enable them all on script load
        //enabling them will trigger a click of the option which will cause the option to be saved

        //OnlyMyUR have the predefined pre-sets only show comments that the current user has commented on
        if (localStorage.getItem('OnlyMyUR') == "yes") {
            $("#URCommentUROOnlyMyUR").trigger('click');
        }

        //auto set new urs comment
        if (localStorage.getItem('AutoSetNewComment') == "yes" || !localStorage.getItem('AutoSetNewComment')) {
            $("#UrCommentAutoSetNewComment").trigger('click');
        }

        //auto set 4day urs comment
        if (localStorage.getItem('UrCommentAutoSet4dayComment') == "yes" || !localStorage.getItem('UrCommentAutoSet4dayComment')) {
           $("#UrCommentAutoSet4dayComment").trigger('click');
        }

        /*
            //auto set 7day urs comment
            if (localStorage.getItem('UrCommentAutoSet7dayComment') == "yes" || !localStorage.getItem('UrCommentAutoSet7dayComment')) {
            $("#UrCommentAutoSet7dayComment").trigger('click');
            }
            */

        //UrCommentAutoCloseComment
        if (localStorage.getItem('UrCommentAutoCloseComment') == "yes" || !localStorage.getItem('UrCommentAutoCloseComment')) {
            $("#UrCommentAutoCloseComment").trigger('click');
        }

        //AutoReloadAfterComment
        if (localStorage.getItem('AutoReloadAfterComment') == "yes") {
            $("#UrCommentAutoReloadAfterComment").trigger('click');
        }

        //NewZoomIn
        if (localStorage.getItem('NewZoomIn') == "yes" || !localStorage.getItem('NewZoomIn')) {
            $("#UrCommentNewZoomIn").trigger('click');
        }

        //auto recenter ur without comments
        if (localStorage.getItem('WithCommentRecenter') == "yes" || !localStorage.getItem('WithCommentRecenter')) {
             $("#UrCommentWithCommentRecenter").trigger('click');
        }

        // URComments load and set settings and check boxes  
        if (localStorage.getItem('AutoClickURStatus') == "yes" || !localStorage.getItem('AutoClickURStatus')) {
            $("#URCommentAutoClickURStatus").trigger('click');
            if(localStorage.getItem('DBLClk7DCAutoSend') == "yes" ||localStorage.getItem('DBLClkAll') == "yes") {
                $('#URCommentAutoClickURStatus').prop('checked', true);
                localStorage.setItem('AutoClickURStatus', 'yes');
            }
        }

        //UrCommentSaveAfterComment
        if (localStorage.getItem('SaveAfterComment') == "yes" || !localStorage.getItem('SaveAfterComment')) {
            $("#UrCommentSaveAfterComment").trigger('click');
        }

        //AutoZoomOutAfterComment
        if (localStorage.getItem('ZoomOutAfterComment') == "yes" || !localStorage.getItem('ZoomOutAfterComment')) {
             $("#UrCommentZoomOutAfterComment").trigger('click');
        }

        //AutoSwitchToURCommentsTab
        if (localStorage.getItem('AutoSwitchToURCommentsTab') == "yes" || !localStorage.getItem('AutoSwitchToURCommentsTab')) {
            $("#UrCommentAutoSwitchToURCommentsTab").trigger('click');
        }

        //UrCommentDBLClk7DCAutoSend
        if (localStorage.getItem('DBLClk7DCAutoSend') == "yes") {
            $("#UrCommentDBLClk7DCAutoSend").prop('checked', true);
            $("#AutoClickURStatus").prop('checked', true);
            localStorage.setItem('AutoClickURStatus', 'yes');
        }

        //UrCommentDBLClkAll
        if (localStorage.getItem('DBLClkAll') == "yes") {
            $("#UrCommentDBLClkAll").prop('checked', true);
            $("#AutoClickURStatus").prop('checked', true);
            localStorage.setItem('AutoClickURStatus', 'yes');
        }

        //set the users BoilerPlateCreators choice in the select   
        var SelectedBoilerPlateCreator = localStorage.getItem('BoilerPlateCreators');
        $("#BoilerPlateCreators").val(SelectedBoilerPlateCreator);
        //end getting boilerplatecreators

        //check to see if the option to auto switch to the URComments tab is enabled
        if (UrCommentAutoSwitchToURCommentsTab.checked) {
            //make UR Comments tab active
            $('#CommentsTab').trigger('click');
        }

        if (URCommentUpdateMessage === "yes") {
            //alert the user in  URComment version updates
            if (localStorage.getItem('URCommentVersion') === URCommentVersion) {
                urcToConsole("Version - " + URCommentVersion);
            } else {
                alert(URCommentVersionUpdateNotes);
                localStorage.setItem('URCommentVersion', URCommentVersion);
            }
        }

        //set the background of the last used URO preset
        URComments.UROPresetHighlight(localStorage.getItem('UROCurrentPeset'));

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////
        ////// Launch background task(s)
        //////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //start looking for opened UR's window
        setTimeout(URComments.LookForOpenedUR, 1000);

        //reset the hiding of tagged pin
        setTimeout(URComments.HideTagged("startup"), 10000);

        setTimeout(URComments.URCLoadUpdateRequestsEvents, 0);

		//enable exp road $( ".toggler label span:contains('Roads experimental')" ).click();// turn on experimental roads layer 
		$( ".toggler label span:contains('Me!')" ).click();
		//end of URCommentsinit	
    };

    ///////////////////////////////////////////////////////////////////////////////////
    //////
    ////// Background task(s)
    //////
	///////////////////////////////////////////////////////////////////////////////////

    //look for the UR window to be open	
    URComments.LookForOpenedUR = function() {
        //urcToConsole("look for open UR window " + (new Date()).getTime());
        //check for an open UR and that the UR's text area is shown
        
		//relaunch checking for open ur - moved this up here so the script would keep trying if i had an error
        setTimeout(URComments.LookForOpenedUR, 500); //line 892
       
		var urID = 0;

        urID = $(".update-requests .selected").data("id");

        if (urID > 0 && typeof urID !== 'undefined') {

            //new or same ur (re))open(ed) so now we can do stuff; this prevents this function to continuously applying settings to a ur
            if (UrCommentLasturID !== urID && $(".new-comment-text").length !== 0) {
                urcToConsole("Found open UR - " + urID);

                //grab the current UR ID for next time
                UrCommentLasturID = urID;

                //url to open a UR
                //https://www.waze.com/editor/?zoom=5&lat=34.024522&lon=-118.297005&mapUpdateRequest=3710607&env=usa
				//https://www.waze.com/editor/?zoom=5&mapUpdateRequest=4271288&env=usa
				
				
				//otto requested to move the ur window down a bit so it isn't over the town name
				//$("#panel-container .panel").css("margin-top", "50px");

               /* //make the new ur window not dragable
                if ($("#panel-container .ui-draggable").length !== 0) {

                    $("#panel-container .panel").removeClass('ui-draggable'); //beta editor auto expand UR Comment box 

                    $("#panel-container .panel").draggable( { disabled: true } );

                    $("#panel-container .panel").removeClass('ui-state-disabled'); //beta editor auto expand UR Comment box 
                }

				*/
				
                //auto expand ur comments list and text area (verify that this is not for the old WME)
                if ($('#edit-request .comment-view-shown').length === 0) {
						//URC
						setTimeout(function() {
                        $('#edit-request .toggle-comment-view').trigger('click');
                    }, 0);
                }

                //beta editor auto expand ur comments list and text area
                if ($("#panel-container .problem-edit .conversation").length !== 0) {
                    $("#panel-container .problem-edit .conversation").removeClass('collapsed'); //beta editor auto expand UR Comment box 
                }

                //beta editor auto expand ur comments more info
                if ($("#panel-container .problem-edit .more-info").length !== 0) {
                    $("#panel-container .problem-edit .more-info").removeClass('collapsed'); //beta editor auto expand UR Comment box 
                }

                //disable the stupid new done button
                if($("#panel-container .content .done").length > 0 && UrCommentDisableURDoneBtn.checked === true) {
                    $("#panel-container .content .done").attr('disabled', true);
                    $("#panel-container .content .done").html('(Done) Disabled by URComments');
                }

				
				
				//compliants about editors not reading the description so i am moving the description up a div
				var desc =  $(".body .description").html();
				if(desc != undefined){
					//move the description up a div
					$( ".problem-edit .header" ).after('<div class="description section">' + desc + '</div>');
					$( ".problem-edit .body .description" ).remove();
					
					//$(".view-area").height();
					
					
					//$( "#WMETB_MaskDiv" ).height();
					//set the height of the description relative to the browser height
					/*var wazeheight = $(".view-area").height();
					wazeheight = wazeheight - 120;
					if(wazeheight > 540) {wazeheight = 540;}
					$( ".problem-edit .body" ).height(wazeheight);
					*/
				}
				
                //jump to bottom
                $('.problem-edit .comment-list').scrollTop($('.conversation-view .comment-list')[0].scrollHeight);
				$('.problem-edit .problem-data').scrollTop($('.conversation-view .comment-list')[0].scrollHeight);
				
				
                //auto fill  in comment
                //check what type of message to insert into the ur
                reporter_comment = Waze.model.updateRequestSessions.objects[urID].comments;
                i = reporter_comment.length;

                urcToConsole("LookForOpenedUR number of comments: " + i);

                //if number of comment is zero assume this is a new ur
                if (i === 0) {
                    //initial, zero comments

                    urcToConsole("LookForOpenedUR no comments");
       
					if (UrCommentAutoSetNewComment.checked === true) {
                        urcToConsole("LookForOpenedUR no comments2");
                        //this will be on of the types of UR that a user can choose from when submitting a UR 

                        var urType = Waze.model.mapUpdateRequests.objects[urID].attributes.type;

                        urcToConsole("LookForOpenedUR Found open UR - " + urID + " " + def_names[urType]);

                        //loop trough the comment array for a comment that matches the request type.
                        for (var ii = 0; ii < URCommentsArray.length; ii = ii + 3) {
                            if (URCommentsArray[ii].toLowerCase() === def_names[urType].toLowerCase()) {
                                urcToConsole("LookForOpenedUR Matched Comment: " + def_names[urType]);
                                setTimeout(URComments.AutoZoomIN(URCommentsArray[ii], URCommentsArray[ii + 1], URCommentsArray[ii + 2], urID), 0);
                            }
                        }
					}

                } else {
                    //4DAY OR 7DAY section

                    LastCommentorUserID = reporter_comment[reporter_comment.length - 1].userID;
                    urcToConsole("LookForOpenedUR LastCommentorUserID: " + LastCommentorUserID);

                    //uro days old
                    var commentDaysOld = URComments.uroGetCommentAge(W.model.updateRequestSessions.objects[urID].comments[i - 1]);
                    urcToConsole("LookForOpenedUR Days old: " + commentDaysOld);

                    //if (i === 1 && commentDaysOld >= 4 && LastCommentorUserID > 1 && UrCommentAutoSet4dayComment.checked === true) {
                    var ReminderDays = $('#ReminderDays').val();
                    urcToConsole("LookForOpenedUR ReminderDays: " + ReminderDays);

                    if (i === 1 && ReminderDays > 0 && commentDaysOld >= ReminderDays && LastCommentorUserID > 1 && UrCommentAutoSet4dayComment.checked === true) {
                        //4day - 1 comment, last comment less than 4 days, last comment is not from reporter
                        urcToConsole("LookForOpenedUR 4day");

                        //4 day ur 1 comment
                        setTimeout(URComments.AutoZoomIN(URCommentsArray[ReminderPosistion], URCommentsArray[ReminderPosistion + 1], URCommentsArray[ReminderPosistion + 2], urID), 0);
                    }
                    //don't allow auto filling of the close message because it clicks the not identified option and causes trouble when the Ur window is shut/closed the next save will mark it as not identified, without a comment.

                }

               var WazeCurrentZoom = "";
               WazeCurrentZoom = URComments.GetWazeMapZoomLevel();
			   if (i === 0 && UrCommentNewZoomIn.checked === true) {
                    //zoom in new 
                    //predefined zoom threshold for auto zoom
                    var zoom = 4;
                    
                    //do not zoom back out if we are already zoomed in and just happen to be re-clicking on a UR.
                    if (WazeCurrentZoom < zoom) {

                        URComments.gotoURById(urID, 5);
                    }
                } else if(UrCommentWithCommentRecenter.checked === true) {
                    //re-center on urs that are not zoom in
                    if (WazeCurrentZoom < 3) {
                        //alert(WazeCurrentZoom);
                        URComments.gotoURById(urID, WazeCurrentZoom);
                    }

                }

                //auto switch to ur comments tab
                if (UrCommentAutoSwitchToURCommentsTab.checked) {
                    //grab the active tab
                    PreviousTab = $("h2 + ul.nav-tabs .active a");
                    //make UR Comments tab active
                    $('#CommentsTab').trigger('click');
                }
            }


        } else {
            //reset the id if a ur is not open so we can set the tab for the same ur
            UrCommentLasturID = "";
            urID = "";
            //switch tab back
            if (UrCommentAutoSwitchToURCommentsTab.checked) {
                //verify that we had found a tab
                if (PreviousTab !== null) {
                    //click back on the previous tab
                    $(PreviousTab).trigger('click');
                    //clear out the previous tab holder
                    PreviousTab = null;
                }
            }
            //urcToConsole("LookForOpenedUR Looking for ur...");
        }

    };


    ////////////////////////////////////////////////////////////////////////////
    //////
    ////// Save Options on click 
    //////
    ////////////////////////////////////////////////////////////////////////////

    //use uro to only show urs that I have commented on
    URComments.OnlyMyUR = function() {

        //try to save the state of the check box
        if (URCommentUROOnlyMyUR.checked) {
            localStorage.setItem('OnlyMyUR', 'yes');
        } else {
            localStorage.setItem('OnlyMyUR', 'no');
        }

        //only show my ur 'OnlyMyUR' 
        if (URCommentUROOnlyMyUR.checked && !_cbHideAnyComments.checked) {
            $("#_cbHideAnyComments").trigger('click');

        } else if (!URCommentUROOnlyMyUR.checked && _cbHideAnyComments.checked) {
            $("#_cbHideAnyComments").trigger('click');
        }

    };

    //URCommentUROHideTagged
    //use uro to Hide Tagged pins
    URComments.HideTagged = function(when) {
        return function() {
            urcToConsole("URCommentUROHideTagged");
            URComments.TaggedPinsAray = [
                "_cbFilterRoadworks",	//
                "_cbFilterConstruction",//
                "_cbFilterClosure",		//
                "_cbFilterEvent",		//
                "_cbFilterNote"		//
            ];

            //go over the array and clear all of the URO+ check boxes
            for (var URComments_URO_Index = 0; URComments_URO_Index < URComments.TaggedPinsAray.length; URComments_URO_Index = URComments_URO_Index + 1) {
                if(when==="startup") {
                    if ($('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
                        $('#URCommentUROHideTagged').prop('checked', true);
                    }


                } else {	
                    urcToConsole("URCommentUROHideTagged " + URComments.TaggedPinsAray[URComments_URO_Index]);

                    if ($('#' + URComments.TaggedPinsAray[URComments_URO_Index]).length <= 0) {
                        alert("there was an error finding URO's hide tagged pins setting please verify these settings are in the correct state");
                        return false;
                    }


                    if (URCommentUROHideTagged.checked && !$('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
                        $('#' + URComments.TaggedPinsAray[URComments_URO_Index]).trigger('click');
                    } else if (!URCommentUROHideTagged.checked && $('#' + URComments.TaggedPinsAray[URComments_URO_Index]).is(":checked")) {
                        $('#' + URComments.TaggedPinsAray[URComments_URO_Index]).trigger('click');
                    }              
                }
            }
        };	
    };


    URComments.AutoClickURStatus = function() {
        //try to save the state of the check box
        if (URCommentAutoClickURStatus.checked) {
            localStorage.setItem('AutoClickURStatus', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('AutoClickURStatus', 'no');
            //alert("no");
            //turn off save after send
            if (!URCommentAutoClickURStatus.checked && UrCommentSaveAfterComment.checked) {
                $('#UrCommentSaveAfterComment').prop('checked', false);
                localStorage.setItem('SaveAfterComment', 'no');
            }

            if(UrCommentDBLClk7DCAutoSend.checked == true || UrCommentDBLClkAll.checked == true) {
                $('#URCommentAutoClickURStatus').prop('checked', true);
                alert(URC_USER_PROMPT[4]);//"URComments to use the double click links you must have the autoset UR status option enabled"
                localStorage.setItem('AutoClickURStatus', 'yes');
            }
        }
    };

    URComments.SaveAfterComment = function() {
        //try to save the state of the check box
        if (UrCommentSaveAfterComment.checked) {
            localStorage.setItem('SaveAfterComment', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('SaveAfterComment', 'no');
            //alert("no");
        }
        //when save if on turn on auto click status
        if (UrCommentSaveAfterComment.checked && !URCommentAutoClickURStatus.checked) {
            $('#URCommentAutoClickURStatus').prop('checked', true);
            localStorage.setItem('AutoClickURStatus', 'yes');
        }
    };

    URComments.AutoCloseComment = function() {
        //try to save the state of the check box
        if (UrCommentAutoCloseComment.checked) {
            localStorage.setItem('UrCommentAutoCloseComment', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('UrCommentAutoCloseComment', 'no');
            //alert("no");
        }
        //alert ( localStorage.getItem('UrCommentAutoCloseComment') ); 
    };

    // UrCommentAutoReloadAfterComment
    URComments.AutoReloadAfterComment = function() {
        // UrCommentAutoReloadAfterComment
        //try to save the state of the check box
        if (UrCommentAutoReloadAfterComment.checked) {
            localStorage.setItem('AutoReloadAfterComment', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('AutoReloadAfterComment', 'no');
            //alert("no");
        }
    };

    URComments.ZoomOutAfterComment = function() {
        // UrCommentAutoReloadAfterComment
        //try to save the state of the check box
        if (UrCommentZoomOutAfterComment.checked) {
            localStorage.setItem('ZoomOutAfterComment', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('ZoomOutAfterComment', 'no');
            //alert("no");
        }
    };

    URComments.AutoSetNewComment = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentAutoSetNewComment.checked) {
            localStorage.setItem('AutoSetNewComment', 'yes');
            //alert(" AutoSetNewComment yes");
        } else {
            localStorage.setItem('AutoSetNewComment', 'no');
            //alert("AutoSetNewComment no");
        }
    };

    URComments.UrCommentAutoSet4dayComment = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentAutoSet4dayComment.checked) {
            localStorage.setItem('UrCommentAutoSet4dayComment', 'yes');
            //alert(" UrCommentAutoSet4dayComment yes");
        } else {
            localStorage.setItem('UrCommentAutoSet4dayComment', 'no');
            //alert("UrCommentAutoSet4dayComment no");
        }
    };

    /*
        URComments.UrCommentAutoSet7dayComment = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentAutoSet7dayComment.checked) {
        localStorage.setItem('UrCommentAutoSet7dayComment', 'yes');
        //alert(" UrCommentAutoSet7dayComment yes");
        } else {
        localStorage.setItem('UrCommentAutoSet7dayComment', 'no');
        //alert("UrCommentAutoSet7dayComment no");
        }
        };
        */


    URComments.NewZoomIn = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentNewZoomIn.checked) {
            localStorage.setItem('NewZoomIn', 'yes');
            //alert(" NewZoomIn yes");
        } else {
            localStorage.setItem('NewZoomIn', 'no');
            //alert("NewZoomIn no");
        }

    };

    URComments.WithCommentRecenter = function() {
        //add reply instructions to replies
        //try to save the state of the check box
        if (UrCommentWithCommentRecenter.checked) {
            localStorage.setItem('WithCommentRecenter', 'yes');
            //alert(" WithCommentRecenter yes");
        } else {
            localStorage.setItem('WithCommentRecenter', 'no');
            //alert("WithCommentRecenter no");
        }

    };

    URComments.AutoSwitchToURCommentsTab = function() {
        // AutoSwitchToURCommentsTab
        //try to save the state of the check box
        if (UrCommentAutoSwitchToURCommentsTab.checked) {
            localStorage.setItem('AutoSwitchToURCommentsTab', 'yes');
            //alert("yes");
        } else {
            localStorage.setItem('AutoSwitchToURCommentsTab', 'no');
            //alert("no");
        }
    };

    //UrCommentDBLClk7DCAutoSend
    URComments.DBLClk7DCAutoSend = function() {
        if (UrCommentDBLClk7DCAutoSend.checked) {
            //save the selection
            localStorage.setItem('DBLClk7DCAutoSend', 'yes');

            $('#URCommentAutoClickURStatus').prop('checked', true);
            localStorage.setItem('AutoClickURStatus', 'yes');

        } else {
            localStorage.setItem('DBLClk7DCAutoSend', 'no');
        }

        //clear the html from the tabs
        $("#sidepanel-Comments").html('');
        //reload the content
        ChangeLanguage = true;

        //setTimeout(URComments_bootstrap, 20);
        URComments_bootstrap();

    };


    //UrCommentDBLClkAll
    URComments.DBLClkAll = function() {
        if (UrCommentDBLClkAll.checked) {
            localStorage.setItem('DBLClkAll', 'yes');

            $('#URCommentAutoClickURStatus').prop('checked', true);
            localStorage.setItem('AutoClickURStatus', 'yes');
        } else {
            localStorage.setItem('DBLClkAll', 'no');
        }			

        //clear the html from the tabs
        $("#sidepanel-Comments").html('');
        //reload the content
        ChangeLanguage = true;

        //setTimeout(URComments_bootstrap, 20);
        URComments_bootstrap();	




    };

    ///////////////////////////////////////////////////////////////////////
    //////
    //////  UR Comment functions
    //////
    ///////////////////////////////////////////////////////////////////////

    URComments.escapeHtml = function(a) {
        a = a.replace(/&/g, "&amp;");
        a = a.replace(/</g, "&lt;");
        a = a.replace(/>/g, "&gt;");
        a = a.replace(/"/g, "&quot;");
        a = a.replace(/'/g, "&#039;");
        return a;
    };

    //$( "#update-request-panel .solution p").html()
    URComments.StringSwap = function(a) {

        if($( "#update-request-panel .solution p").length > 0 ) {
            a = a.replace( "$URD", $( "#update-request-panel .solution p").html() );
        }

        if($( ".description .content").length > 0){
            a = a.replace( "$URD", $( ".description .content").html() );
            //alert($( ".description .content").html());
        }
		
		//selected segments
		var streetName = "";
		if(W.selectionManager.selectedItems.length >= 1 && W.selectionManager.selectedItems.length <= 2) {
			for (var i = 0; i < W.selectionManager.selectedItems.length; i++) {
				if(W.selectionManager.selectedItems[i].model.CLASS_NAME == "Waze.Feature.Vector.Segment"){
					var primaryStreetID = W.selectionManager.selectedItems[i].model.attributes.primaryStreetID;
					if(i==0){
						streetName = W.model.streets.objects[primaryStreetID].name;
					} else {
						streetName = "the intersection of " + streetName + " and " + W.model.streets.objects[primaryStreetID].name;
					}
					
					
				}
			}   
			console.log(streetName);
			a = a.replace( "$SELSEGS", streetName );
		}

        return a;
    };


    //gets the total number of comments on a ur
    TotalNumberOfComments = function(urID) {
        urcToConsole("reporterComments");
        return ($(wazeModel.updateRequestSessions.objects[urID].comments).length);
    };

    //sorry URO if i was going to use you to sort Urs i needed to use the same dates you do! Thanks! ;)
    URComments.uroGetCommentAge = function(commentObj) {
        if (commentObj.createdOn === null) return -1;
        return URComments.uroDateToDays(commentObj.createdOn);
    };

    URComments.uroDateToDays = function(dateToConvert) {
        var dateNow = new Date();
        var elapsedSinceEpoch = dateNow.getTime();
        var elapsedSinceEvent = elapsedSinceEpoch - dateToConvert;
        dateNow.setHours(0);
        dateNow.setMinutes(0);
        dateNow.setSeconds(0);
        dateNow.setMilliseconds(0);
        var elapsedSinceMidnight = elapsedSinceEpoch - dateNow.getTime();
        if (elapsedSinceEvent < elapsedSinceMidnight) {
            // event occurred today...
            return 0;
        } else {
            // event occurred at some point prior to midnight this morning, so return a minimum value of 1...
            return 1 + Math.floor((elapsedSinceEvent - elapsedSinceMidnight) / 86400000);
        }
    };

    URComments.onScreen = function(obj) {

        //geometry was removed from Waze.model.mapUpdateRequests.objects[id]
        //but can be found in Waze.model.mapUpdateRequests.objects[id].geometry

        if (obj.geometry) {
            return (Waze.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
        }
        return false;
    };



    URComments.URCLoadUpdateRequestsEvents = function(){
        /*
		 W.model.mapUpdateRequests.events.register("objectschanged", null, uroFilterURs_onObjectsChanged);
         W.model.mapUpdateRequests.events.register("objectsadded", null, uroFilterURs_onObjectsAdded);
         W.model.mapUpdateRequests.events.register("objectsremoved", null, uroFilterURs_onObjectsRemoved);

         W.model.updateRequestSessions.events.register("objectschanged", null, uroUREvent_onObjectsChanged);
         W.model.updateRequestSessions.events.register("objectsadded", null, uroUREvent_onObjectsAdded);
         W.model.updateRequestSessions.events.register("objectsremoved", null, uroUREvent_onObjectsRemoved);
		*/

        window.HideUR = "stopped";
        W.model.mapUpdateRequests.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectschanged')); //needed
		// W.model.mapUpdateRequests.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectsadded')); //this one triggers for ever ur added to the db
        //W.model.mapUpdateRequests.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded('mapUpdateRequests objectsremoved'));
        //W.model.updateRequestSessions.events.register("objectsremoved", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectsremoved'));


        //W.model.updateRequestSessions.events.register("objectschanged", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectschanged')); // this launches every time a UR is opened
        W.model.updateRequestSessions.events.register("objectsadded", null, URComments.urcUREvent_onObjectsAdded('updateRequestSessions objectsadded'));//needed


        W.map.events.register("moveend", null, URComments.urcUREvent_onObjectsAdded('moveend'));//needed
        W.map.events.register("zoomend", null, URComments.urcUREvent_onObjectsAdded('zoomend'));//needed
        //W.map.events.register("mouseup", null,  URComments.urcUREvent_onObjectsAdded('mouseup'));

        //urcToConsole("UR events added");

        //setTimeout(URComments.urcUREvent_onObjectsAdded('pageload'), 1000);  
        setTimeout(URComments.urcUREvent_onObjectsAdded('pageload'), 50);
    }; 


    URComments.urcUREvent_onObjectsAdded = function(a){
        return function() {

            //check if filtering or the pill count are enabled other wise abort this function
            //URCommentsFilterEnabled URCommentsPillEnabled
            if(URCommentsFilterEnabled.checked === false && URCommentsPillEnabled.checked === false && URCommentsAutoSendMyReminders.checked === false){
                urcToConsole(URC_USER_PROMPT[5]);//"aborting FilterURs2 becasue both filtering, counts, and auto reminders are disabled"
                return;
            }

            urcToConsole("urcUREvent_onObjectsAdded " + a + " " + window.HideUR);
            
            if (a == "timedout" && window.HideUR == "running"){ //|| a === "list is empty retry"){
                window.HideUR = "stopped";
                a = "timedout";
                URComments.ShowWMEMessage(URC_USER_PROMPT[6] ,5000);//"URComments: Loading UR data has timed out, retrying."
            }

            if (window.HideUR === "stopped" && a !== "timedout"){
                clearTimeout(window.buffertedtimeout);
                clearTimeout(window.buffertedtimeout2);

                urcToConsole("set time-out to filter UR and time-out check " + a + " " + window.HideUR);

                //certain events need to be launched a bit later then others
                if(a == "moveend" || a == "zoomend"){
                    window.buffertedtimeout = setTimeout(URComments.FilterURs(a), 2000);	
                } else {
                    window.buffertedtimeout = setTimeout(URComments.FilterURs(a), 500);	
                }

                window.HideUR = "running";
                window.BufferFillterURCommand = false;
                window.buffertedtimeout2 = setTimeout(URComments.urcUREvent_onObjectsAdded("timedout"), 30000);	
            } else { 					
				urcToConsole("aborted: " + a + " " + window.HideUR);
            }

        };
    };

    URComments.FilterURs = function(a,b) {
        return function() {

				/*
				Waze.model.updateRequestSessions.objects[4223545].addComment('TEST');
				uroSelectedURID='4223545';
				//$(W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects['4223545']));
				//W.model.updateRequestSessions.get(uroSelectedURID);
				alert($(Waze.model.updateRequestSessions.objects[4223545].comments).length);
				W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects['4223545']);
				W.model.updateRequestSessions.get('4223545');	
				if ($(Waze.model.updateRequestSessions.objects[4223545].comments).length < 3 ) {
				Waze.model.updateRequestSessions.objects[4223545].addComment('TEST');
				W.model.updateRequestSessions.remove(W.model.updateRequestSessions.objects[4223545]);
				W.model.updateRequestSessions.get(Waze.model.updateRequestSessions.objects['4223545']);				
				}
				*/

            urcToConsole("Start Filtering URs - " + a);
            for (var i = 0; i < W.map.layers.length; i++) {
                if (W.map.layers[i].uniqueName == 'update_requests') window.uroURLayerIdx = i;

                //if(W.map.layers[i].uniqueName == 'problems') uroProblemLayerIdx = i;
                //if(W.map.layers[i].name == 'Spotlight') uroMaskLayer = i;
                //if(W.map.layers[i].uniqueName == 'speed_cameras') uroCamLayer = i;
                //if(W.map.layers[i].name.indexOf('Waze.Control.SelectHighlightFeature') !== -1) uroRootContainer = W.map.layers[i].div.id;
                //if(W.map.layers[i].uniqueName == 'area_managers') uroAMLayerIdx = i;
                //if(W.map.layers[i].uniqueName == 'landmarks') uroPlacesRoot = W.map.layers[i].id + '_vroot';
                //if(W.map.layers[i].name == 'Node Connections') uroTurnsLayerIdx = i;

            }
            //var ReminderDays = 2;
            var CloseDays = $('#CloseDays').val();
            //check that all visible urs are loaded
            var idList = [];
            var allID = "";
            var PushNeededCount = 0;
				
            for (var urID in W.model.mapUpdateRequests.objects) {

                if (W.model.updateRequestSessions.objects[urID] == null) {
                    idList.push(urID);
                    PushNeededCount = PushNeededCount + 1;

                }

                if (PushNeededCount > 500) {
                    //urcToConsole('trash ' + allID);
                    //urcToConsole('trash grabbing updateRequestSessions with IDs ' + idList);
                    W.model.updateRequestSessions.get(idList);
                    idList = [];
                    PushNeededCount = 0;
                    urcToConsole('over 1k ur');
                }			
            }

            if (idList.length > 0) {
                //urcToConsole('trash ' + allID);
                //urcToConsole('trash grabbing updateRequestSessions with IDs ' + idList);
                W.model.updateRequestSessions.get(idList);
            }


            //abort filtering URs if the list is empty
            if (Object.keys(W.model.updateRequestSessions.objects).length === 0) {
                window.HideUR = "stopped";
                urcToConsole("no Ur in active sessions");
                setTimeout(URComments.urcUREvent_onObjectsAdded("list is empty retry"), 5000);
                return;
            }

            var urdescription = "";
            var EditorID = Waze.model.loginManager.user.id; //editor's id number
            var ReminderReload = false;

            //for (var id1 in W.model.mapUpdateRequests.objects) {
            //urcToConsole("get UR info " + id1);
            var TotalVisibleURCount = 0;

            var CountOfIdInList = 0;
            var DelayTimeoutCountOfIdInList = 0;
			
            for (var id1 in W.model.mapUpdateRequests.objects) {
                TotalVisibleURCount = TotalVisibleURCount + 1;
                if (URComments.onScreen(W.model.mapUpdateRequests.objects[id1])) {
					// && W.model.mapUpdateRequests.objects[id1].type == "mapUpdateRequest"
                    allID = allID + id1 + ",";
                    CountOfIdInList = CountOfIdInList + 1;

                }

                if(CountOfIdInList >= 500 ) {
                    urcToConsole("reached 500 UR requesting list: " + DelayTimeoutCountOfIdInList);
                    //setTimeout(URComments.FilterURs2(a,allID,TotalVisibleURCount), 0);

                    //play with putting a timeout between each group requested
                    setTimeout(URComments.FilterURs2(a,allID,TotalVisibleURCount), DelayTimeoutCountOfIdInList);

                    CountOfIdInList=0;
                    allID = "";
                    DelayTimeoutCountOfIdInList = DelayTimeoutCountOfIdInList + 1000;
                }

            } 

            //urcToConsole("left over UR requesting listCountOfIdInList: " + TotalVisibleURCount);
            urcToConsole("reached end of UR list requesting list: " + DelayTimeoutCountOfIdInList);
            $("#URCount").html(TotalVisibleURCount);
            setTimeout(URComments.FilterURs2(a,allID,TotalVisibleURCount), 0);

        };
    };




    URComments.FilterURs2 = function(a, allID, TotalVisibleURCount) {
        return function() {
			urcToConsole("FilterURs2 TotalVisibleURCount: " + TotalVisibleURCount);
			//window.CloseidList = [];
			//window.CloseidLis.push(id);
            //urcToConsole("Start FilterURs2: " + a);

            var CloseDays = ($('#CloseDays').val()*1 );
			var ReminderDays = ($('#ReminderDays').val()*1 );
			var ClosePlussReminderDays = CloseDays + ReminderDays;
			
			urcToConsole("CloseDays " + CloseDays);
			urcToConsole("ReminderDays " + ReminderDays);
			
			
			urcToConsole("ClosePlussReminderDays " + ClosePlussReminderDays);
			
            var urdescription = "";
            var EditorID = Waze.model.loginManager.user.id; //editor's id number
            var ReminderReload = false;
            var LoggedInEditor = Waze.model.loginManager.user.userName;
			
var openingUR;

r = require("Waze/Feature/Vector/ProblemResolution");

            if(allID !== ""){
                //this is the link that works but i think it is grabbing a cached version of the page var urSessionURL = 'https://www.waze.com/2tes-live/app/MapProblems/UpdateRequests?ids=' + allID;

                //https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=4284449
/*
                if(Waze.Config.api_base === "/Descartes-beta/app") {
                    var urSessionURL = 'https://editor-beta.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                } else if(Waze.Config.api_base === "/Descartes-live/app") {
                    var urSessionURL = 'https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                }
*/

                if(Waze.Config.api_base === "/Descartes-beta/app") { 
                    var urSessionURL = 'https://editor-beta.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
				} else if(Waze.Config.api_base === "/Descartes-live/app") {
                    var urSessionURL = 'https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                } else if(Waze.Config.api_base === "/row-Descartes-live/app") {
                    var urSessionURL = 'https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                } else if(Waze.Config.api_base === "/il-Descartes-live/app") {
                    var urSessionURL = 'https://www.waze.com/il-Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                }
				
				
				
                //var urSessionURL = 'https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();
                //var urSessionURL = 'https://editor-beta.waze.com/Descartes-beta/app/MapProblems/UpdateRequests?ids=' + allID + "&time=" + (new Date()).getTime();

                urcToConsole("urSessionURL: " + a + " " + urSessionURL);

                // https://www.waze.com/Descartes-live/app/MapProblems/UpdateRequests?ids=3678676
                var LastCommentorUserID = "0";

                //urcToConsole("trash36");						
                $.ajax({
                    dataType: "json",
                    //dataType: 'jsonp',
                    url: urSessionURL,

                    success: function(json) {
                        try {

                            for (jsnObj = 0; jsnObj < $(json.updateRequestSessions.objects).length; jsnObj++) {
                                //TotalVisibleURCount = TotalVisibleURCount + 1;
                                var urDetail = json.updateRequestSessions.objects[jsnObj];
                                var id = urDetail.id;
                                //urcToConsole("json count " + jsnObj + " id " + id );
                                var skip = false;
                                var urStyle = 'shown';
                                var i = 0;
                                var Marked = "";
                                var UrcURType = "";
                                //urcToConsole("id " + urDetail.id);
                                
								var urdescription = W.model.mapUpdateRequests.objects[id].attributes.description;
								
								if (urDetail.comments.length === 0) {
                                    //urcToConsole('UR Responder: no comments for id ' + id + '. Adding comment.');
                                    //Waze.model.updateRequestSessions.objects[v.attributes.id].addComment(customURInitialComment);
                                    //Waze.model.updateRequestSessions.objects[4066755].addComment("This is a test");
                                    //$(Waze.model.updateRequestSessions.objects[4066755].addComment("This is a test"));

                                    //initial UR no comments
                                    //if(urDetail.comments.length === 0 && URCommentsHideInital.checked == true && Marked = ""){
                                    //	UrcURType = "initial";
                                    //}
									var InitialurType = Waze.model.mapUpdateRequests.objects[id].attributes.type;
									if(a == "SendAllInitial" && $('[data-id="' + id + '"]').hasClass('InitialSent') === false){
										if ((urdescription && AvoidInitialWithDescriptions.checked == true) || ("turn not allowed" === def_names[InitialurType].toLowerCase() && AvoidTurnsNotAllowed.checked == true)) {
											urcToConsole("URC Matched: " + urdescription + " " + id);
										} else {
											//looking up UR type and finding comment	
											//loop trough the comment array for a comment that matches the request type.
											for (var ii = 0; ii < URCommentsArray.length; ii = ii + 3) {
												if (URCommentsArray[ii].toLowerCase() === def_names[InitialurType].toLowerCase()) {
													urcToConsole("LookForOpenedUR Matched Comment: " + def_names[InitialurType] + " " + id);
													
													urcToConsole("URC Matched Comment: " + URCommentsArray[ii + 1]  + " " + id);
													Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ii + 1]);
													$('[data-id="' + id + '"]').addClass('InitialSent');
												}
											}
											
											
										}
									}
									
									//AvoidInitialWithDescriptions.checked == true
									//a == SendAllInitial

                                }
								
								
								
                                var NumberOfComments = urDetail.comments.length;
                                var CountsBGColor = "#FFFF99"; //light yellow

                                if (NumberOfComments > 0) {
                                    var reporterResponse = false;
                                    var lastCommentDateTime = 0;
                                    var LastComment = "";

                                    for (i = 0; i < urDetail.comments.length; i++) {
                                        if (urDetail.comments[i].userID == -1) {
                                            reporterResponse = true;
                                        }
                                        lastCommentDateTime = urDetail.comments[i].createdOn;
                                        LastCommentorUserID = urDetail.comments[i].userID;
                                        LastComment = urDetail.comments[i].text;

										if (LastCommentorUserID === EditorID) {
                                            CountsBGColor = "white";
                                        }

                                        var Commenttext = urDetail.comments[i].text;
                                        //urcToConsole(Commenttext + " " + id);
                                        if (Commenttext.indexOf("NOTE]") >= 0 || Commenttext.indexOf("ROADWORKS]") >= 0 || Commenttext.indexOf("CONSTRUCTION]") >= 0 || Commenttext.indexOf("CLOSURE]") >= 0 || Commenttext.indexOf("EVENT]") >= 0 || Commenttext.indexOf(LoggedInEditor) >= 0 ){
                                            //urcToConsole("skipped1 URO+ tagged in comments urid: " + id + "with comment text " + Commenttext);
                                            skip = true;
                                        }
                                        //LoggedInEditor				

                                        if(Commenttext.indexOf(LoggedInEditor) >= 0 && URCommentsReplaceTagWithEditorName.checked === true) {
                                            Marked = LoggedInEditor; 	
                                        } else if (Commenttext.indexOf("NOTE]") >= 0){
                                            Marked = "Note";
                                        } else if(Commenttext.indexOf("ROADWORKS]") >= 0){
                                            Marked = "Roadworks";
                                        } else if(Commenttext.indexOf("CONSTRUCTION]") >= 0){
                                            Marked = "Construction";
                                        } else if(Commenttext.indexOf("CLOSURE]") >= 0){
                                            Marked = "Closure";
                                        } else if(Commenttext.indexOf("EVENT]") >= 0) {
                                            Marked = "Event";
                                        }
                                        //urcToConsole("Marked " + Marked);

                                    }
									//urcToConsole("LastComment: " + LastComment + " " + id);
                                }

                                var lastCommentAge = URComments.uroDateToDays(lastCommentDateTime);
                                //urcToConsole('Responder: reporter response for ' + id + ' = ' + reporterResponse + ', last comment on ' + lastCommentDateTime + ', comment age in days = ' + lastCommentAge + ' number of comments = ' + i);

                                //urdescription = W.model.mapUpdateRequests.objects[id].attributes.description;

                                //urcToConsole("urdescription: " + urdescription + " " + id);

                                if (urdescription) {
                                    //urcToConsole("urdescription present: " + urdescription + " " + id);
                                    //skip tagged URs
                                    if (urdescription.indexOf("NOTE]") >= 0 || urdescription.indexOf("ROADWORKS]") >= 0 || urdescription.indexOf("CONSTRUCTION]") >= 0 || urdescription.indexOf("CLOSURE]") >= 0 || urdescription.indexOf("EVENT]") >= 0 || urdescription.indexOf(LoggedInEditor) >= 0 ){
                                        //urcToConsole("skipped2 URO+ tagged in description urid: " + id + "with comment text " + urdescription);
                                        skip = true;
                                    }

                                    if(urdescription.indexOf(LoggedInEditor) >= 0 && URCommentsReplaceTagWithEditorName.checked === true) {
                                        Marked = LoggedInEditor; 	
                                    } else if (urdescription.indexOf("NOTE]") >= 0){
                                        Marked = "Note";
                                    } else if(urdescription.indexOf("ROADWORKS]") >= 0){
                                        Marked = "Roadworks";
                                    } else if(urdescription.indexOf("CONSTRUCTION]") >= 0){
                                        Marked = "Construction";
                                    } else if(urdescription.indexOf("CLOSURE]") >= 0){
                                        Marked = "Closure";
                                    } else if(urdescription.indexOf("EVENT]") >= 0) {
                                        Marked = "Event";
                                    }

                                    if(URCommentsHideWithDescript.checked == true && NumberOfComments <= 0){
                                        UrcURType = "WithDescription";
                                        //urcToConsole("UrcURType WithDescription: " + id);
                                    }
                                    //urcToConsole("skipped2 tagged in description urid: " + id + "with comment text " + Commenttext);
                                } else {
                                    if(URCommentsHideWithoutDescript.checked == true && NumberOfComments <= 0){
                                        UrcURType = "WithoutDescription";
                                        //urcToConsole("UrcURType WithoutDescription: " + id);
                                    }
                                }

                                if (W.model.mapUpdateRequests.objects[id].attributes.open === false) {
                                    skip = true;
                                  //  UrcURType = "IsClosed"; 
								  
                                }

                                //urcToConsole("just before skipping, skip is " + skip + " " + id);			   
                                //Waze.model.mapUpdateRequests.objects[id].type == "mapUpdateRequest"
                                if (skip === false && W.model.mapUpdateRequests.objects[id].type == "mapUpdateRequest") {

                                    // && URComments.onScreen(Waze.model.mapUpdateRequests.objects[id])	

                                    if (NumberOfComments > 0) {

                                        //4 day UR if there is only one comment, if the comment is less or equal to the editors setting, and if the last comment was not made by the driver
                                        if (NumberOfComments === 1 && ReminderDays > 0 && lastCommentAge >= ReminderDays && LastCommentorUserID > 1) {
                                            urcToConsole("URComments2 - 4day URID: " + id);
                                            //direct link to a UR https://www.waze.com/editor/?zoom=5&lat=41.586201000000024&lon=-88.060863&layers=1957&mapUpdateRequest=4048801
                                            //look up editors user id

                                            if(URCommentsHideReminderNeeded.checked == true){
                                                UrcURType = "NeedsReminder";
                                            }

                                            //testing and and and or
                                            if (LastCommentorUserID === EditorID && URCommentsAutoSendMyReminders.checked == true  &&  $('[data-id="' + id + '"]').hasClass('ReminderSent') === false || a == "SendAllReminders") {
                                                //urcToConsole("rem and and and or id " + id);
                                            }
											
											//var Machete808 = false;
											if (LastCommentorUserID !== EditorID && URCommentsAutoSendMyReminders.checked == true  &&  $('[data-id="' + id + '"]').hasClass('ReminderSent') === false ) {
												urcToConsole("reminder needed for other editors UR: " + LastComment + " " + id);
												
												//if(LastComment == "We will be circling back") {
													// or "Send them as a reply at the bottom of this message, from your app inbox. Thanks!"

													//citeman "Can you please provide more details about the error you were reporting?" = 17
													//citeman  "If we don't hear back from you," = 1
													//citeman "please respond with details." = 2
													
													//comments team "Would you tell us your destination as you entered it into Waze? Thanks!" = 
													//Machete808 "We will be circling back" = 926
													//Machete808 " If this is a long-term closure please respond and let us know as much as you can. " = 222
													//&& !urdescription 
													//Thanks for any further feedback! 
													//Send them as a reply at the bottom of this message, from your app inbox. Thanks! 
													
													
												/*	
												if(LastComment.indexOf("If this is a long-term closure please respond and let us know as much as you can.") >= 0 && LastCommentorUserID == "6333744" ){
													urcToConsole("Machete808 reminder needed for UR: " + id);
													Machete808 = true;	
													window.Machete808Count = window.Machete808Count + 1;
												}
												*/
											}
											
										
											
                                            if (LastCommentorUserID === EditorID && URCommentsAutoSendMyReminders.checked == true  &&  $('[data-id="' + id + '"]').hasClass('ReminderSent') === false) { //|| Machete808 === true
                                                urcToConsole("reminder needed UR: " + LastComment + " " + id);
												//make UR Link
                                               // var x = Waze.model.mapUpdateRequests.objects[id].attributes.geometry.x;
                                                //urcToConsole("re x " + x);

                                                //var y = Waze.model.mapUpdateRequests.objects[id].attributes.geometry.y;
                                                //urcToConsole("re y " + y);

                                                //var ConvertedCoords = new OpenLayers.Geometry.Point(x, y).transform(Waze.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
                                                //urcToConsole("re  " + ConvertedCoords);

                                               // var MapUrl = "https://www.waze.com/editor/?zoom=5&lat=" + ConvertedCoords.y + "&lon=" + ConvertedCoords.x + "&layers=1925&mapUpdateRequest=" + id;
                                                //urcToConsole("re " + MapUrl);

												//if (Machete808===true){
												//	 urcToConsole("Machete808 reminder Id: " + id + " MapUrl: " + MapUrl);
												//} else {
													 //urcToConsole("reminder Id: " + id + " MapUrl: " + MapUrl);
												//}
                                               
                                                //URComments.gotoURById(id, 5);

												/* reply link is no longer needed
                                                //check if we should include the reminder message and link
                                                if(UrCommentAddReplyInstructions.checked === true){
                                                    Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1] + "\r\n\r\n" + ReplyInstructions + "\r\n" + MapUrl);
                                                    //ReminderReload = true;
                                                } else {
                                                    Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1]);
                                                    //ReminderReload = true;
                                                }		
												*/
												Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1]);
												//toggleFollowConversation true or false
												if ($("#URCommentURUnfollow").is(":checked")){
													//Waze.model.updateRequestSessions.objects[id].toggleFollowConversation('false');
													setTimeout(URComments.toggleFollowConversation(id), 0);
												}
												/*
												if(Machete808 !== true){
													urcToConsole("reminder day and the last comment was by me, adding reminder message " + id);
												}
												*/
											  
                                                URComments.ShowWMEMessage(URC_USER_PROMPT[7] + id,2500);//"URComments: Adding reminder message to UR: "

                                                //attempting to stop double reminders from being sent by adding a class that we can check for before sending the reminder
                                                $('[data-id="' + id + '"]').addClass('ReminderSent');

                                                //set to hide if hide in between states is checked
                                                if(URCommentsHideInbetween.checked == true){ 
                                                    UrcURType = "InBetweenStates";
                                                }

                                            }											

                                            if (a === "all" || a === "reminders") {
                                                //add reminder to the ur in the background
												//remove reply instructions
                                                //Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[ReminderPosistion + 1] + "\r\n\r\n" + ReplyInstructions + "\r\n" + MapUrl);
                                            }
                                            //7 day if the number of comments are greater than or equal to 1, days past are more then 7, the last comment was not from the driver, and number of comments are less than 2
                                        //} else if (NumberOfComments >= 1 && lastCommentAge >= CloseDays && LastCommentorUserID > 1) {
										} else if ( (NumberOfComments >= 2 && lastCommentAge >= CloseDays && LastCommentorUserID > 1) || (NumberOfComments >= 1  && ReminderDays == 0 && lastCommentAge >= CloseDays && LastCommentorUserID > 1) ) {                                        
										// && LastComment.indexOf(URCommentsArray[ReminderPosistion + 1]) >= 0 //would be useful for auto closing when last message was a 4 day
											
											//urcToConsole("close needed UR: " + LastComment + " " + id);

                                            //hide or show UR that need closing
                                            if(URCommentsHideCloseNeeded.checked == true && UrcURType === ""){
                                                UrcURType = "NeedsClose";
                                            }

                                            //7day - less than one comment, last comment less then 7 days ago, last comment is not from reporter
                                            //urcToConsole("URComments2 - 7+day URID: " + id);
                                            //7 day ur 1 comment
                                            if (a === "all" || a === "close") {
                                                //setTimeout(URComments.PostURComment(URCommentsArray[CloseNotIdentifiedPosistion], URCommentsArray[CloseNotIdentifiedPosistion + 1], URCommentsArray[CloseNotIdentifiedPosistion + 2], urID), 0);
                                            }
                                            //urcToConsole("trash56");					
                                            //UR has comments but was not a 4 day or a 7 day and the driver was not the last to comment
                                            //"waiting for reply"
                                        } else if (LastCommentorUserID >0) {
                                            //in between states waiting for replies or time to elapse
                                            //urcToConsole("hiding ur 2: " + id);
                                            if(URCommentsHideInbetween.checked == true){ 
                                                UrcURType = "InBetweenStates";
                                            }
                                        }
										
										//last comment was a user reply; change the pin color to blue or peach
										if(LastCommentorUserID < 1){
                                            if (CountsBGColor == "white") {
                                                CountsBGColor = "#79B5C7"; //light blue
                                            } else {
                                                CountsBGColor = "#FFCC99"; //peach
                                                //CountsBGColor = 6699FF; //darker blue
                                            }


											if(URCommentsHideReplies.checked == true){
                                                UrcURType = "HasUserReplies";
                                            }

                                        }else if(lastCommentAge > ClosePlussReminderDays && CountsBGColor !== "white"){
                                            //}else if(lastCommentAge > CloseDays && LastCommentorUserID !== EditorID){
                                            CountsBGColor = "#FF8B8B"; //light red
                                        }
										
										//urcToConsole("after red1 " + CountsBGColor + " NumberOfComments: " +NumberOfComments + " lastCommentAge: " +lastCommentAge + " CloseDays: " + CloseDays + " LastCommentorUserID: " + LastCommentorUserID + " ClosePlussReminderDays: " + ClosePlussReminderDays + " urid: " + id + " " + " ReminderDays: " + ReminderDays);
									
										
										
										//yellow at close days workaround
										//urcToConsole("yellow at close days workaround " + CountsBGColor + " NumberOfComments: " +NumberOfComments + "lastCommentAge: " +lastCommentAge + " CloseDays" + CloseDays + " LastCommentorUserID: " + LastCommentorUserID + "urid: " + id);
										if (CountsBGColor == "#FFFF99" && NumberOfComments >= 1 && lastCommentAge >= ClosePlussReminderDays && LastCommentorUserID > 1) {
											CountsBGColor = "#FF8B8B"; //light red
										}
										//urcToConsole("after red2 " + CountsBGColor + " NumberOfComments: " +NumberOfComments + " lastCommentAge: " +lastCommentAge + " CloseDays: " + CloseDays + " LastCommentorUserID: " + LastCommentorUserID + " ClosePlussReminderDays: " + ClosePlussReminderDays + " urid: " + id + " " + " ReminderDays: " + ReminderDays);
									
																				
		

                                    }
                                    //zero comments
                                } else {
									 urcToConsole("skipped UR: " + id);
								}
                                //&& NumberOfComments > 0
                                //skipped
                                //urcToConsole("check for urcounts class; comment count " + i );
                                //if ($('[data-id="' + id + '"] .URCounts').hasClass('URCounts') === false ) {
                                //urcToConsole("trash58");
                                if (lastCommentAge === undefined) {
                                    lastCommentAge = "?";
                                }
//2553 by 1436
                                var Message ="";

                                if(Marked !== ""){	
                                    Message = Marked + " " + i + "c";
                                    CountsBGColor = "#CCCCCC"; //light grey
                                } else {
                                    Message = i + "c " + lastCommentAge + "d";
                                }

                                //urcToConsole("message " + Message);
                                //urcToConsole("Marked " + Marked);


                                //if the ur is tagged or has more than 0 comments reorder the ur stacking	
                                if (Marked !== "" || i>0){

                                    var MessageOffset = Message.length;
                                    if (MessageOffset < 10){
                                        MessageOffset = MessageOffset * 1.4;
                                    } else {
                                        MessageOffset = MessageOffset * 2.3;
                                    }
                                    MessageOffset = "-" + MessageOffset + "px";
                                    //urcToConsole("message " + Message);
                                    if(CountsBGColor == "#CCCCCC") { //light grey
                                        $('[data-id="' + id + '"]').css({'z-index' : '999'}); 
                                    }else if (CountsBGColor == "white" || CountsBGColor == "#79B5C7"){
                                        $('[data-id="' + id + '"]').css({'z-index' : '998'}); 
                                        //).style.visibility
                                    } else if (CountsBGColor == "#FF8B8B"){ //light red
                                        $('[data-id="' + id + '"]').css({'z-index' : '997'});
                                    }
                                    if(URCommentsPillEnabled.checked === true){
                                        //add URC bubble	
                                        if ($('[data-id="' + id + '"] .URCounts').hasClass('URCounts') === false) {
                                            $('[data-id="' + id + '"]').append($("<div>").css("clear", "both")
                                                                               .css("margin-bottom", "10px")

                                                                               .append($("<div>").html(Message)
                                                                                       .css("color", "black")
                                                                                       .css("background", CountsBGColor)
                                                                                       .css("position", "absolute")
                                                                                       .css("top", "30px")
                                                                                       .css("right", MessageOffset)

                                                                                       .css("display", "block")
                                                                                       .css("width", "auto")
                                                                                       .css("white-space", "nowrap")
                                                                                       .css("padding-left", "5px")
                                                                                       .css("padding-right", "5px")

                                                                                       .css("border", "1px solid")
                                                                                       .css("border-radius", "25px")

                                                                                       .addClass('URCounts')
                                                                                      )
                                                                              );

                                        } else {
                                            $('[data-id="' + id + '"] .URCounts').html(Message);
                                            $('[data-id="' + id + '"] .URCounts').css("background", CountsBGColor);
                                            $('[data-id="' + id + '"] .URCounts').css("right", MessageOffset);
                                        }

                                        //end of URC bubble
                                    }
                                }

									
									//console.log(a);
									//AUTO CLOSE STALE UR && LastCommentorUserID === EditorID
									if(a == "URCommentsAutoClose"){
										//alert(a);
										if ($(".new-comment-text")[0] === undefined && W.model.mapUpdateRequests.objects[id].attributes.open === true){
											if(openingUR !== true && NumberOfComments == 2 && lastCommentAge >= CloseDays && LastComment.indexOf("Just a reminder:") >= 0 ) {
												//openingUR = true;
												//lastCommentAge >= ReminderDays
												//$('[data-id="' + id + '"]').click();
												//alert(id);
												//setTimeout(URComments.AutoZoomIN(URCommentsArray[CloseNotIdentifiedPosistion], URCommentsArray[CloseNotIdentifiedPosistion+1], "notidentified", id, "AutoSendComment"), 5000);
												


												//setTimeout(URComments.WaitForURtoOpen(URCommentsArray[CloseNotIdentifiedPosistion], URCommentsArray[CloseNotIdentifiedPosistion+1], "notidentified", id, "AutoSendComment"), 200);
												

												//URCommentsArray[CloseNotIdentifiedPosistion + 1], URCommentsArray[CloseNotIdentifiedPosistion + 2], urID), 0)											
												//Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[CloseNotIdentifiedPosistion + 1]);			
															
												//console.log("test: " + URCommentsArray[CloseNotIdentifiedPosistion + 1]);

																								
												v = Waze.model.mapUpdateRequests.objects[id];
												//v.attributes.open
												//v2 = v.attributes;
												//console.log(v);
												//holds the name to number values for the statuses for the URs
												//r = require("Waze/Feature/Vector/ProblemResolution");
												//console.log(r);
												var e ="";
												var o = v.attributes;
												//creates an object with the current UR state and looks up the number value for not identified
												 t = {}, t.open = e === o.OPEN, t.resolution = r.NOT_A_PROBLEM;
												//console.log(t);
												//W.model.mapUpdateRequests.objects[4334868].attributes.open
												b = require("Waze/Action/UpdateObject");
												//console.log(b);

												Waze.model.updateRequestSessions.objects[id].addComment(URCommentsArray[CloseNotIdentifiedPosistion + 1]);
												
												v.model.actionManager.add(new b(v, t));
																						
												// var URCommentsUnsaveCount = $(".WazeControlSave .counter").html();
												//if ($(".WazeControlSave .counter").html() >= 1 ){
													//click save
													//$('#toolbar #edit-buttons .WazeControlSave').trigger('click');	
													//alert("morehtanone")
												//}											
													//return;										
												
											}	
										}
									}
									


                                //URC UR Filtering

                                var uroURFiltersActive = false; // var used to keep track if we actually need to show / hide the UR pins

								if(sessionStorage.UROverview_hasActiveURFilters == undefined){
								    //condsole.log("old version of URO, need to use existing UI-parsing test...");
								   
								     //these are all of the tags that URO uses to filter URs. If any of the settings are enabled set a var to let URO do the filterenabled
									if ( $("#_cbFilterWazeAuto").is(":checked") || $("#_cbFilterIncorrectTurn").is(":checked") || $("#_cbFilterIncorrectAddress").is(":checked") || $("#_cbFilterIncorrectRoute").is(":checked") || $("#_cbFilterMissingRoundabout").is(":checked") || $("#_cbFilterGeneralError").is(":checked") || $("#_cbFilterTurnNotAllowed").is(":checked") || $("#_cbFilterIncorrectJunction").is(":checked") || $("#_cbFilterMissingBridgeOverpass").is(":checked") || $("#_cbFilterWrongDrivingDirection").is(":checked") || $("#_cbFilterMissingExit").is(":checked") || $("#_cbFilterMissingRoad").is(":checked") || $("#_cbFilterBlockedRoad").is(":checked") || $("#_cbFilterMissingLandmark").is(":checked") || $("#_cbFilterUndefined").is(":checked") || $("#_cbFilterRoadworks").is(":checked") || $("#_cbFilterConstruction").is(":checked") || $("#_cbFilterClosure").is(":checked") || $("#_cbFilterEvent").is(":checked") || $("#_cbFilterNote").is(":checked") || $("#_cbInvertURFilter").is(":checked") || $("#_cbFilterOpenUR").is(":checked") || $("#_cbFilterClosedUR").is(":checked") || $("#_cbFilterSolved").is(":checked") || $("#_cbFilterUnidentified").is(":checked") || $("#_cbEnableMinAgeFilter").is(":checked") || $("#_cbEnableMaxAgeFilter").is(":checked") || $("#_cbURDescriptionMustBePresent").is(":checked") || $("#_cbURDescriptionMustBeAbsent").is(":checked") || $("#_cbEnableKeywordMustBePresent").is(":checked") || $("#_cbEnableKeywordMustBeAbsent").is(":checked") || $("#_cbCaseInsensitive").is(":checked") || $("#_cbHideMyComments").is(":checked") || $("#_cbHideAnyComments").is(":checked") || $("#_cbHideIfLastCommenter").is(":checked") || $("#_cbHideIfNotLastCommenter").is(":checked") || $("#_cbHideIfReporterLastCommenter").is(":checked") || $("#_cbHideIfReporterNotLastCommenter").is(":checked") || $("#_cbEnableMinCommentsFilter").is(":checked") || $("#_cbEnableMaxCommentsFilter").is(":checked") || $("#_cbHideMyFollowed").is(":checked") || $("#_cbHideMyUnfollowed").is(":checked") || $("#_cbEnableCommentAgeFilter2").is(":checked") || $("#_cbEnableCommentAgeFilter").is(":checked") || $("#_cbURUserIDFilter").is(":checked") || $("#_cbURResolverIDFilter").is(":checked") ){
										uroURFiltersActive = true; //at least one of URO's UR checkboxes were enabledPlugin
									}
                                } else if(sessionStorage.UROverview_hasActiveURFilters == "true"){
								   //console.log("new version of URO is actively filtering UR markers...");
								   uroURFiltersActive = true; //twisters URO active filter bit is set to true
								}
								

								if(uroURFiltersActive === true && URCommentsFilterEnabled.checked === true){
									URComments.ShowWMEMessage(URC_USER_PROMPT[8],5000);//"URComment's UR Filtering has been disabled because URO\'s UR filters are active."
									$('#URCommentsFilterEnabled').prop('checked', false);
								}
								
                                if(URCommentsFilterEnabled.checked == true && uroURFiltersActive === false){
                                    //check if we should hide URO stype tagged UR
                                    if(URCommentsHideNotes.checked == true && Marked !== ""){										
                                        UrcURType = "IsTagged";
                                    } else if(Marked !== "" && UrcURType !== "IsClosed"){
                                        UrcURType ="1";
                                    }

                                    //check if not "my" ur
                                    //if(URCommentsHideNotMyUR.checked == true && NumberOfComments > 0 && lastCommentAge <= CloseDays ){
                                    if(URCommentsHideNotMyUR.checked == true && NumberOfComments > 0){
                                        //light red, peach, light yellow 
                                        //if(CountsBGColor == "#FF8B8B" || CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99"){
                                        if(CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99" || CountsBGColor == "#FF8B8B"){
                                            UrcURType = "NotMyUR";
                                        }
                                    }					
                                    //URCommentsShowPastClose
                                    //check if not "my" ur
                                    if(URCommentsShowPastClose.checked == true && NumberOfComments > 0 && lastCommentAge > ClosePlussReminderDays ){
                                        //light red, peach, light yellow 
                                        //if(CountsBGColor == "#FF8B8B" || CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99"){
                                        if(CountsBGColor == "#FFCC99" || CountsBGColor == "#FFFF99" || CountsBGColor == "#FF8B8B"){
                                            UrcURType = "2";
                                        }
                                    }										

                                    //initial UR no comments
                                    if(urDetail.comments.length === 0 && URCommentsHideInital.checked == true){
                                        UrcURType = "initial";
                                    }


                                    //urcToConsole('UrcURType: ' + UrcURType);

				

                                    //show or hide URs|| NumberOfComments > 3 || NumberOfComments < 3
									
									if(W.model.mapUpdateRequests.objects[id].attributes.open === false){
										if(URCommentsHideClosed.checked == true){
											UrcURType = "IsClosed";
										} else {
											UrcURType = "ClosedNotHiden";
										}
									}
									if(UrcURType == "IsTagged"){ //|| NumberOfComments > 2
										//urcToConsole('UR is tagged and set to be hidden');
                                        urStyle = 'hidden';
									
                                    } else if(UrcURType == "InBetweenStates" || UrcURType == "NeedsReminder" || UrcURType == "NeedsClose" || UrcURType == "initial" || UrcURType == "HasUserReplies" || UrcURType =="IsClosed" || UrcURType == "NotMyUR" || UrcURType == "WithoutDescription" || UrcURType == "WithDescription" ){ 
                                        urStyle = 'hidden';
                                    } else {
                                        urStyle = 'visible';
                                    }
                                    //W.map.layers[uroURLayerIdx].markers[id].icon.imageDiv.style.visibility = urStyle;
									$('[data-id="' + id + '"]').css("visibility",urStyle);
                                    //urcToConsole('next ur ' + id);

                                    //when filtering is disable and URO filters are disabled reshow all the UR
                                } else if(URCommentsFilterEnabled.checked == false && uroURFiltersActive === false){
                                    //urcToConsole('UR filtering is disabled showing all ur ' + id);
                                    urStyle = 'visible';
                                   // W.map.layers[uroURLayerIdx].markers[id].icon.imageDiv.style.visibility = urStyle;
								   $('[data-id="' + id + '"]').css("visibility",urStyle);
                                }
							
								
                            }
                            window.HideUR = "stopped";
                            //urcToConsole('rem done filtering UR, Total UR: ' + TotalVisibleURCount);

							//URComments.ShowWMEMessage("URComments: Machete808Count: " + window.Machete808Count,600000);
                        	//alert(CountsBGColor);					

						} catch (e) {

                            setTimeout(URComments.FilterURs('error retry'), 1000);
                            urcToConsole('Responder: error obtaining UR response = ' + e);
                            //window.HideUR = "stopped";
                        }
                    }
                });
                urcToConsole("" + a + " total visible: " + TotalVisibleURCount); // + " allID " + allID);
                //window.HideUR = "stopped";

            } else {
                //urcToConsole("no UR aborting");
                window.HideUR = "stopped";
            }

        };
    };

	//window.Machete808Count = 0;
    
	URComments.OpenNextUR = function(message,delay) {
		return function() {
			setTimeout(URComments.OpenNextUR(a,allID,TotalVisibleURCount), 0);

        };
    };

	URComments.ShowWMEMessage = function(message,delay) {
        //if ($("#URCMapNote").length <= 0){
        var dateNow = new Date();
        TrickRemove = dateNow.getTime();

        //var message = "URComments UR Filtering has been disabled because URO\'s UR filters are active.";
        //var message = "URComments: Can not find the comment box! In order for this script to work you need to have a user request open."
        //var message = "URComments: Adding reminder message to UR: 4239896"
        //delay = 10000;
        var width = message.length * 10;
        var c = '<div id="URCMapNote' + TrickRemove +'" style="width: ' + width + 'px; font-size: 15px; font-weight: bold; margin-left: auto; margin-right: auto; background-color: orange;"><center><b>' + message + '</b></center></div>';
        $("#toolbar").append(c);		
        $("#URCMapNote" + TrickRemove).show().delay(delay).queue(function(n) {
            $(this).remove(); n();
        });	
        //}	
    };



    /*
CountsBGColor = "#FFFF99"; //light yellow = UR that are waiting for the last editor but still has time before the Close days setting ex 7 days
CountsBGColor = "#CCCCCC"; //light grey = URO styled notes ex [NOTE]
CountsBGColor = "#FFCC99"; //peach = another editor before the close days has gone by has user reply
CountsBGColor = "#FF8B8B"; //light red = past the close days setting and is now able to be taken over by another editor
CountsBGColor = "white"; = UR that "belong to the editor logged in that need work
CountsBGColor = "#79B5C7"; //light blue = UR that "belong to the editor logged in that have user replies


White = The editor logged in has comments on the UR and the UR needs work
light blue = The editor logged in has comments on the UR and the UR's last comment was a user reply
light red = past the close days setting and is now able to be taken over by another editor

light yellow = UR that are waiting for the another editor to send a reminder or to be closed but still has time before the Close days setting (ex 7 days)
peach = UR that another editor had commented on but the last comment is a user reply

light grey = URO styled notes ex [NOTE]

*/



    //save what comment list is selected and then reload the page
    URComments.BoilerPlateCreatorsFunction = function() {
        if (BoilerPlateCreators.value !== "---User's Lists---") {
            //save the selection
            localStorage.setItem('BoilerPlateCreators', BoilerPlateCreators.value);

            //clear the html from the tabs
            $("#sidepanel-Comments").html('');
            //reload the content
            ChangeLanguage = true;

            //setTimeout(URComments_bootstrap, 20);
            URComments_bootstrap();
        } else {
            $("#BoilerPlateCreators").val(localStorage.getItem('BoilerPlateCreators'));
        }
    };

	
    URComments.URCommentZoomOutcheck = function(Title, URStatus) {
		return function() {
            urcToConsole("zoom out URCommentZoomOutcheck");

            //this is the new place for zooming out and will still be happening while the comment is sending
            //zoom out option - if the user option is set to reload map after posting a comment reply
            if (UrCommentZoomOutAfterComment.checked === true) {
                urcToConsole("zoom out ZoomOutAfterComment enabled");
                setTimeout(URComments.SetZoomCloseUR(ReturnToCurrentZoom, "LeaveOpen"), 0);
            } else {
                //alert("autozoomout not checked");
            }
            setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
        };
    };

    URComments.URCommentSendBtnClicked = function(Title, URStatus) {

        //waze is weird and after clicking send button the close button had to be refound, which takes a few seconds for the new close button to be drawn
        // so we wait 1500 milliseconds before looking for the close button
        //since we are passing vars to the next function we have to pass this to handler function so it doesn't happen on click

        //the above is still true but what i have found is that it sometimes takes a while from clicking send to the comment actually posting. there was time when i closed the comment before it actually posted and it would have to be redone. so added a check and a timeout and recheck if the textarea isn't empty. afterwards we can re-grab and click the close button
        return function() {
            //grab the close button to compare to later
            CloseButtonHolder = $(".problem-panel-navigation button.close-button");

            //check to see if the comments went through before saving or closing the comment 
            if ($(".new-comment-text").val() !== "" && $(".new-comment-text").val() !== undefined) {
                urcToConsole('the send button was clicked, Waiting for the comment to send. ' + PauseCount);
                urcToConsole("current comment = " + $(".new-comment-text").val() );
                urcToConsole("current comment = ");
                PauseCount++;
                setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
            } else {
                urcToConsole('The comment went through, jumping to CloseDelayHack2');
                PauseCount = "1";

                //check if we want to unfollow
                if ($("#URCommentURUnfollow").is(":checked") && $("#follow-on").is(":checked")) {
                    //$('#follow-on').trigger('click');
                    //setTimeout(URComments.URCommentSendBtnClicked(Title, URStatus), 20);
					var urID = $(".update-requests .selected").data("id");
					//urcToConsole("toggleFollowConversation id " + urID);
					//Waze.model.updateRequestSessions.objects[urID].toggleFollowConversation('false');
					setTimeout(URComments.toggleFollowConversation(urID), 500);
                }
				//delay this command for uro not to freakout on refreshing uro bubble ur count
				setTimeout(URComments.CloseDelayHack2(Title, URStatus), 100);
							
            }
        };
    };


    URComments.toggleFollowConversation = function(urID) {
		return function() {
			urcToConsole("toggleFollowConversation id " + urID);
			Waze.model.updateRequestSessions.objects[urID].toggleFollowConversation('false');	
        };
    };
	
	
    //this checks to see if the Waze's save button is waiting to be clicked.
	//currently unused
    URComments.WazeSaveWaiting = function() {
        if ($(".WazeControlSave").hasClass('ItemInactive')) {
            return true;
        } else {
            return false;
        }
    };

    URComments.CloseDelayHack2 = function(Title, URStatus) {
        return function() {
            urcToConsole("CloseDelayhack2 " + Title + " " + URStatus);

            PauseCount = "1";
            urcToConsole("New close button");
            //wrap the code in the finding of the new close button

            //now that we found the new close button and send was clicked

            //lets check if we should click close or save
            //when clicking save you dint need to click close

            //this checks to see if the Waze's save button is waiting to be clicked.
            //URComments.WazeSaveWaiting()

            if (URStatus.toLowerCase() === "solved" || URStatus.toLowerCase() === "notidentified") {
                urcToConsole("CloseDelayhack2 Solved or NotIdentified- Clicking Save");
                //this clicks the waze save btn
                if (URCommentAutoClickURStatus.checked === true && UrCommentSaveAfterComment.checked === true) {
                    //click save
                    $('#toolbar #edit-buttons .WazeControlSave').trigger('click');
                } else if (UrCommentAutoCloseComment.checked) {
                    $(".problem-panel-navigation button.close-button").trigger('click');
                }

            } else {
                //when not saving you have to click close.
                urcToConsole("CloseDelayhack2 since we are not saving click the close button");
                if (UrCommentAutoCloseComment.checked) {
                    urcToConsole("CloseDelayhack2 auto close option checked");


                    //normal editor
                    if ($(".problem-panel-navigation button.close-button").length !== 0) {
                        urcToConsole("zoom out CloseDelayHack2 normal editor");
                        $(".problem-panel-navigation button.close-button").trigger('click');
                    }

                    //beta editor
                    if ($(".problem-edit .header .close-panel").length !== 0) {
                        urcToConsole("zoom out CloseDelayHack2 beta editor");
                        $(".problem-edit .header .close-panel").trigger('click');
                        //setTimeout(function() {
                        //    $('a .close-popover').trigger('click');
                        // }, 2000);
                    }

                    //since saving above reloads the map we need this reload only to happen when we dont click save
                    //auto reload map for non save urs
                    if (UrCommentAutoReloadAfterComment.checked) {
                        setTimeout(URComments.AutoReloadMapOnComment, 500);
                    }
                }
            }

            urcToConsole("end of saving or closing comment");
            //}

            //this is the new place for zooming out and will still be happening while the comment is sending
            //zoom out option - if the user option is set to reload map after posting a comment reply
            if (UrCommentZoomOutAfterComment.checked === true) {
                urcToConsole("zoom out CloseDelayHack2");
                setTimeout(URComments.SetZoomCloseUR(ReturnToCurrentZoom, "LeaveOpen"), 0);
            } else {
                //alert("autozoomout not checked");
            }

            setTimeout(URComments.urcUREvent_onObjectsAdded('URCommentsReload'), 0);

        };
    };

    URComments.SetZoomCloseUR = function(a, b) {
        //this sets the map zoom; 0 is all the way out; 10 is all the way in but next to useless (the map and sat views disappear);
        //the closest zoom that shows the sat and map is zoom 9
        return function() {
            urcToConsole("Setting map zoom to: " + a + " with flag: " + b);
            //alert(a + " " + b);
            Waze.map.setCenter(Waze.map.getCenter(), a);
            //close ur if zooming out to 
            if (b === "CloseUR") {
                //alert(b);

                //normal editor
/*                if ($(".problem-panel-navigation button.close-button").length !== 0) {
                    $(".problem-panel-navigation button.close-button").trigger('click');
                }
*/
                //beta editor
                if ($(".problem-edit .header .close-panel").length !== 0) {
                    $(".problem-edit .header .close-panel").trigger('click');
                    // setTimeout(function() {
                    //    $('a .close-popover').trigger('click');
                    // }, 2000);
                }
            }
        };
    };

    URComments.AutoReloadMapOnComment = function() {
        //waze together with URO is buggy i have to close the comment window before reloading the map or the pin ends up getting stuck on for all URO filters and it takes a page reload to fix it.
        // to get URO to rescan urs that have been commented on you have to reload the map this also causes URO to hide the ones that no longer fit the current URO filters like when using my pre-sets

        //click the reload button for the map
        $(".layer-togglers .reload-button").trigger('click');
    };

    URComments.ConfirmToConsole = function() {
        //over ride the default action of the standard confirm by writing confirm to a new function nconfirm, making a 'fake' confirm and then restoring confirm by copying the nconfirm back over confirm!
        nconfirm = unsafeWindow.confirm;
        unsafeWindow.confirm = function(msg) {
            //if ((I18n.translations[I18n.locale].update_requests.panel.confirm == msg) && (uroGetCBChecked('_cbDisablePendingQuestions') == true)) {
            urcToConsole('URComment confirm redirected to console: ' + msg);
            return true;
        };
    };

    URComments.RestoreConfirmToConfirm = function() {
        //restore the normal action of confirm by writing nconfirm to back over confirm, so the site is able to send user messages outside of my script!
        unsafeWindow.confirm = nconfirm;
    };

    URComments.AutoZoomIN = function(Title, Comment, URStatus, urID, AutoSendComment) {
        return function() {
            urcToConsole("AutoZoomIN");
            var URCommentsUnsavedDetected = false;
            var URCommentsUnsaveCount = $(".WazeControlSave .counter").html();

            //detect unsaved changed if there are and the auto save option is on abort adding comments to the UR
            if (URCommentsUnsaveCount > 0 && $("#UrCommentSaveAfterComment").is(":checked") && URStatus.toLowerCase() !== "open") {
                URCommentsUnsavedDetected = true;
                alert(URC_USER_PROMPT[9]); //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send."
            }
            //URCommentsUnsavedDetected = true;

            //get urid for manually clicked comments
            if (urID === 0 || urID === "" || urID === undefined) {
                urID = $(".update-requests .selected").data("id");
            }

            //check to see if the auto zoom in option in enabled if it is start the zooming in process
            urcToConsole("AutoZoomIN checking if we should zoom in based of if the Title is the same as the reminder title: " + Title + " pointer title: " + URCommentsArray[ReminderPosistion] + " urID: " + urID);
            //having OneOrTheOTher first is a hack to make the logic work
            var OneOrTheOTher = "no";

            if (UrCommentNewZoomIn.checked === true && Title !== URCommentsArray[ReminderPosistion] && Title !== URCommentsArray[CloseNotIdentifiedPosistion] && AutoSendComment !== "AutoSendComment") {
                OneOrTheOTher = "yes";
            }

            //alert(OneOrTheOTher);
            if (OneOrTheOTher === "yes" && URCommentsUnsavedDetected === false) {

                urcToConsole("AutoZoomIN zooming to location");

                //predefined zoom threshold for auto zoom
                var zoom = 4;

                //do not zoom back out if we are already zoomed in and just happen to be re-clicking on a UR.
                //or we have the map set good for a 4-day reminder
                var WazeCurrentZoom = URComments.GetWazeMapZoomLevel();

                if (WazeCurrentZoom < zoom) {
                    URComments.gotoURById(urID, 5);
                }

                //setTimeout(URComments.AutoZoomIN2(Title, Comment, URStatus), 2500);
                setTimeout(URComments.PostURComment(Title, Comment, URStatus, AutoSendComment, urID), 1);

            } else if(URCommentsUnsavedDetected === false) {

                //auto zoom in is disabled jump to postURComment
                //alert("else");
                urcToConsole("AutoZoomIN disabled to PostURComment id - " + urID);
                //we have to use set timeout here because we need the  return function() in PostURComment
                //for when we are zooming in and out for the reminder
                //since we are not zooming here jump rigth to PostURComment
                setTimeout(URComments.PostURComment(Title, Comment, URStatus, AutoSendComment, urID), 1);
            }

        };
    };

    URComments.gotoURById = function(urID, zoom) {
        //alert(urID);
        //$('span[id="WME_AutoUR_Count"]').html((WMEAutoUR.Auto.index+1)+"/"+WMEAutoUR.Auto.UR_len);

        //save zoom so we can return this the current zoom level
        ReturnToCurrentZoom = URComments.GetWazeMapZoomLevel();

        var x = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.x;
        var y = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.y;

        urcToConsole("gotoURById: " + "x: " + x + "y: " + y + "zoom: " + zoom);

        Waze.map.setCenter([x, y], zoom);
        return;
    };

    URComments.GetWazeMapZoomLevel = function(Title, Comment, URStatus) {
        zoom = W.map.mapState.mapLocation.zoom;
        urcToConsole("Current Zoom: " + zoom);
        return zoom;
    };


	URComments.WaitForURtoOpen = function(Title, Comment, URStatus, urID, AutoSendComment) {
        return function() {
			if ($(".new-comment-text")[0]) {
				setTimeout(URComments.AutoZoomIN(Title, Comment, URStatus, urID, AutoSendComment), 500);
			} else {
				setTimeout(URComments.WaitForURtoOpen(Title, Comment, URStatus, urID, AutoSendComment), 200);
			}	
		};
	}
	
	
    URComments.PostURComment = function(Title, Comment, URStatus, AutoSendComment, urID) {
        // the user clicked on a comment link
        return function() {
            //Swap out special text
            Comment = URComments.StringSwap( Comment );
            urcToConsole("attaching to send button " + Title + " - " + Comment + " - " + URStatus);

            //add event listener that runs most of the options = URCommentZoomOutcheck
            $('.new-comment-form .new-comment-text + .btn-default').click(URComments.URCommentZoomOutcheck(Title, URStatus));

            //check if the comment text area is present if not alert the user to open a UR
            if ($(".new-comment-text")[0]) {
                urcToConsole('found comment box ' + Title + ' - ' + Comment);
                $(".new-comment-text").val(Comment);
                //click the Ur status
                setTimeout(URComments.CheckIfClickStatus(URStatus, AutoSendComment), 1);
            } else {
                //we were unable to find an open UR
                URComments.ShowWMEMessage(URC_USER_PROMPT[10],5000);//"URComments: Can not find the comment box! In order for this script to work you need to have a user request open."
            }
        };
    };

    //this is part of the script that gets the maps position for the 4 day reminder map link
    getQueryString = function(link, name) {
        var pos = link.indexOf(name + '=') + name.length + 1;
        var len = link.substr(pos).indexOf('&');
        if (-1 == len) len = link.substr(pos).length;
        return link.substr(pos, len);
    };

    URComments.CheckIfClickStatus = function(URStatus, AutoSendComment) {
        return function() {
            urcToConsole("checking ur status function: " + URStatus + " " + AutoSendComment);

            if (URCommentAutoClickURStatus.checked === true) {
                //bypass the confirm function so other site messages do not come up!
                URComments.ConfirmToConsole();
    
				//click the ur status options (Not identified solved, open)
                if ($("#state-open").length !== 0) {
                    $(".problem-edit .body").scrollTop($(".problem-edit .body")[0].scrollHeight);
                    if (URStatus.toLowerCase() == "notidentified") {
                        //click Not identified 
                        $("#state-not-identified").trigger('click');
                    } else if (URStatus.toLowerCase() == "solved") {
                        //click solved
                        $("#state-solved").trigger('click');
                    } else {
                        //click back on open just encase the wrong reply was clicked previously
                        $("#state-open").trigger('click');
                    }
                }

                //restores confirm function so other site messages come up!
                URComments.RestoreConfirmToConfirm();
                //wait for the status to change
            }	

            if (AutoSendComment === "AutoSendComment") {	
                setTimeout(URComments.URVerfiyStatusSet(URStatus, AutoSendComment), 1);
            }	
        };
    };

    URComments.URVerfiyStatusSet = function(URStatus, AutoSendComment) {
        return function() {
            urcToConsole("URVerfiyStatusSet function: " + URStatus + " " + AutoSendComment);
            var URStatusOk = true;

            if (URCommentAutoClickURStatus.checked === true) {

                if(URStatus.toLowerCase() == "notidentified") {
                    //click Not identified 
                    if($("#state-not-identified").is(":checked") == false) {
                        URStatusOk = false;
                    }
                } else if (URStatus.toLowerCase() == "solved") {
                    //click solved
                    if($("#state-solved").is(":checked") == false) {
                        URStatusOk = false;
                    }
                } else {
                    //click back on open just encase the wrong reply was clicked previously
                    if($("#state-open").is(":checked") == false) {
                        URStatusOk = false;
                    }
                }

            }

            if(URStatusOk == true){

                setTimeout(URComments.AutoClickSend(URStatus,AutoSendComment), 1);
            } else {
                urcToConsole("UR Status has yet to change waiting 250ms");
                setTimeout(URComments.URVerfiyStatusSet(URStatus,AutoSendComment), 150);
            }

        };
    };

    URComments.AutoClickSend = function(URStatus,AutoSendComment) {
        return function() {
            urcToConsole("checking if we are auto clicking the send button");
            if (AutoSendComment === "AutoSendComment") {
                urcToConsole("Auto clicking the send button");
                $('.new-comment-form .new-comment-text + .btn-default').trigger('click');
            }
        };
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////
    //// on start-up keep checking the site to see if the me tab is loaded
    ////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////	

    URComments.startcode = function() {
        // Check if WME is loaded, if not, waiting a moment and checks again. if yes init URComments
        try {
            //look for the me tab instead if the buggy chat room!           
            var element = $("#user-details");
            urcToConsole("Found user-details window");
            if (typeof element !== "undefined" && element.value !== '') {
                //urcToConsole("Test2");
                URComments.init();
                //urcToConsole("Test3");
            } else {
                setTimeout(URComments.startcode, 2000);
            }
        } catch (err) {
            urcToConsole(err);
            if (err === "TypeError: element is null" || err === "TypeError: element is null") {
                setTimeout(URComments.startcode, 2000);
            }
            setTimeout(URComments.startcode, 2000);
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////    URO Preset Filters
    ////   
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //URO+ these are the tags of all of the items URO uses to filter URs
    URComments.UROCheckboxesArray = ["_cbFilterWazeAuto",
                                     "_cbFilterIncorrectTurn",				//
                                     "_cbFilterIncorrectAddress",			//
                                     "_cbFilterIncorrectRoute",				//
                                     "_cbFilterMissingRoundabout",			//
                                     "_cbFilterGeneralError", 				//
                                     "_cbFilterTurnNotAllowed",				//
                                     "_cbFilterIncorrectJunction",			//
                                     "_cbFilterMissingBridgeOverpass",		//
                                     "_cbFilterWrongDrivingDirection",		//
                                     "_cbFilterMissingExit",				//
                                     "_cbFilterMissingRoad",				//
                                     "_cbFilterBlockedRoad",				//
                                     "_cbFilterMissingLandmark",			//
                                     "_cbFilterUndefined",					//
                                     //"_cbFilterCryosphere",				//
                                     "_cbFilterRoadworks",					//
                                     "_cbFilterConstruction",				//
                                     "_cbFilterClosure",					//
                                     "_cbFilterEvent",						//
                                     "_cbFilterNote",						//
                                     "_cbInvertURFilter",					//
                                     "_cbFilterOpenUR", 					//
                                     "_cbFilterClosedUR",					//
                                     "_cbFilterSolved",						//
                                     "_cbFilterUnidentified",				//
                                     "_cbEnableMinAgeFilter",				//
                                     "_cbEnableMaxAgeFilter",				//
                                     "_cbURDescriptionMustBePresent",		//
                                     "_cbURDescriptionMustBeAbsent", 		//
                                     "_cbEnableKeywordMustBePresent", 		//
                                     "_cbEnableKeywordMustBeAbsent", 		//
                                     "_cbCaseInsensitive", 					//
                                     "_cbHideMyComments", 					//
                                     "_cbHideAnyComments", 					//
                                     "_cbHideIfLastCommenter", 				//
                                     "_cbHideIfNotLastCommenter", 			//
                                     "_cbHideIfReporterLastCommenter",		//
                                     "_cbHideIfReporterNotLastCommenter",	//
                                     "_cbEnableMinCommentsFilter", 			//
                                     "_cbEnableMaxCommentsFilter", 			//
                                     "_cbHideMyFollowed", 					//
                                     "_cbHideMyUnfollowed", 				//
                                     "_cbEnableCommentAgeFilter2", 			//
                                     "_cbEnableCommentAgeFilter", 			//
                                     "_cbNoFilterForTaggedURs",				//
                                     "_cbURUserIDFilter",					//Without comments from user
                                     "_cbURResolverIDFilter"				//Not resolved by user
                                    ];

    URComments.UROPresetHighlight = function(a) {
        if (a === "URONewNoDescription") {
            $('#URONewNoDescription').css('background-color', '#FFFF66');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }

        if (a === "UroShowNew") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '#FFFF66');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }
        if (a === "URO4DayFollowUp") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '#FFFF66');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }
        if (a === "URO7Day") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '#FFFF66');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }
        if (a === "URO8Day") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '#FFFF66');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }
        if (a === "URO10Day") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '#FFFF66');
            $('#URCommentURO24Hr').css('background-color', '');
        }
        if (a === "URO24Hr") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '#FFFF66');
        }
        if (a === "UROclearUROFiltrs") {
            $('#URONewNoDescription').css('background-color', '');
            $('#URCommentURONEW').css('background-color', '');
            $('#URCommentURO4DayFollowUp').css('background-color', '');
            $('#URCommentURO7Day').css('background-color', '');
            $('#URCommentURO8Day').css('background-color', '');
            $('#URCommentURO10Day').css('background-color', '');
            $('#URCommentURO24Hr').css('background-color', '');
        }

    };

    URComments.UROClearClicked = function(a) {
        return function() {
			
			/*
            //reshow tagged urs on preset change
            if (URCommentUROHideTagged.checked){
                $('#URCommentUROHideTagged').prop('checked', false);
            }
			*/
			
            URComments.UROPresetHighlight(a);

            //save the current preset so we can reaply the highlighting on startup
            localStorage.setItem('UROCurrentPeset', a);

            if ($("#sidepanel-uroverview").length) {
                //alert("test");
                urcToConsole("URO clear");
                //this is the array used to store the URO id tags

                //go over the array and clear all of the URO+ check boxes
                for (var URComments_URO_Index = 0; URComments_URO_Index < URComments.UROCheckboxesArray.length; URComments_URO_Index = URComments_URO_Index + 1) {

                    if ($('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).length <= 0) {
                        alert("there was an error finding URO's tag " + URComments.UROCheckboxesArray[URComments_URO_Index]);
                        return false;
                    }

                    if ($('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).is(":checked")) {
                        //clicks the checkbox by if the checkbox is checked
                        $('#' + URComments.UROCheckboxesArray[URComments_URO_Index]).trigger('click');
                    } else {
                        //click check box if checkbox in unchecked
                        //$(document.getElementById(URComments.UROCheckboxesArray[ URComments_URO_Index ])).trigger('click');
                    }
                }

                // make it so uro+ doesnt filter tagged urs [NOTE]...
                $('#_cbNoFilterForTaggedURs').trigger('click');
                if (a === "UroShowNew") {
                    urcToConsole("URO show new");
                    //If last comment made by UR reporter? chose no
                    $('#_cbHideIfReporterNotLastCommenter').trigger('click');
                }
                if (a === "URONewNoDescription") {
                    //only show no user description
                    $('#_cbURDescriptionMustBeAbsent').trigger('click');

                    //hide reporter did not leave the last comment
                    $('#_cbHideIfReporterNotLastCommenter').trigger('click');

                    //Hide With more than 1 comments
                    $('#_cbEnableMaxCommentsFilter').trigger('click');
                    $('#_inputFilterMaxComments').val(1);
                }
                if (a === "URO4DayFollowUp") {
                    urcToConsole("URO 4 day");

                    //hide With less than 1 comments
                    $('#_inputFilterMinComments').val(1);
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //Hide With more than 1 comments
                    $('#_inputFilterMaxComments').val(1);
                    $('#_cbEnableMaxCommentsFilter').trigger('click');

                    //Hide Last comment less than 4 days ago
                    $('#_inputFilterCommentDays2').val(4);
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                }
                if (a === "URO7Day") {
                    urcToConsole("URO 7 day");

                    //hide With less than 1 comments
                    $('#_inputFilterMinComments').val(1); //1
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //hide Last comment less than 7 days ago
                    $('#_inputFilterCommentDays2').val(7);//7
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                    //hide If last comment made by UR reporter?
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                }
                if (a === "URO8Day") {
                    urcToConsole("URO 7 day");

                    //hide With less than 1 comments
                    $('#_inputFilterMinComments').val(1); //1
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //hide Last comment less than 8 days ago
                    $('#_inputFilterCommentDays2').val(8);//8
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                    //hide If last comment made by UR reporter?
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                }
                if (a === "URO10Day") {
                    urcToConsole("URO 10 day");

                    //hide With less than 1 comments
                    $('#_inputFilterMinComments').val(1); //1
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //hide Last comment less than 8 days ago
                    $('#_inputFilterCommentDays2').val(10);//10
                    $('#_cbEnableCommentAgeFilter2').trigger('click');

                    //hide If last comment made by UR reporter?
                    $('#_cbHideIfReporterLastCommenter').trigger('click');
                }
                if (a === "URO24Hr") {

                    //alanoftheberg 

                    //check "Hide URs less than days old" "8" days old
                    $('#_inputFilterMinDays').val(8);//8
                    $('#_cbEnableMinAgeFilter').trigger('click');


                    //check "yes" on "If last comment made by UR reporter?"
                    $('#_cbHideIfReporterLastCommenter').trigger('click');

                    //check "With less than" and put in "1" comments
                    $('#_inputFilterMinComments').val(1);//1
                    $('#_cbEnableMinCommentsFilter').trigger('click');

                    //check "Last comment more than"  "1" days ago
                    $('#_inputFilterCommentDays').val(1);//1
                    $('#_cbEnableCommentAgeFilter').trigger('click');

                }
                if (a === "UROclearUROFiltrs") {}

                //shared URO settings except clear
                if (a !== "UROclearUROFiltrs") {
                    $('#_cbFilterUnidentified').trigger('click');
                }
/*
                if (URCommentUROOnlyMyUR.checked) {
                    $("#_cbHideAnyComments").trigger('click');
                }
*/
            } else {
                alert("UR Overview Plus (URO+) needs to be installed to use these URO Presets.");
            }
        };
    };

    URComments.startcode();
}
//URComments_bootstrap();
setTimeout(URComments_bootstrap, 3000);