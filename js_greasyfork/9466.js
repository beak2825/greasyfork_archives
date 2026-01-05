// ==UserScript==
// @name         HMRK
// @author       Morten Møller
// @description  Ændrer lidt i LapCounter timing
// @version      1.2
// @match        *hmrk.dk/live/pclclivetiming.html
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js 
// @namespace https://greasyfork.org/users/10802
// @downloadURL https://update.greasyfork.org/scripts/9466/HMRK.user.js
// @updateURL https://update.greasyfork.org/scripts/9466/HMRK.meta.js
// ==/UserScript==

refreshrate = 0;
counter = 1;

loadXMLDoc = function(url) 
{
    var xmlhttp;
    var txt,x,xx,i,LastUpdateData,LastUpdateTime;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            txt="";
            x=xmlhttp.responseXML.documentElement.getElementsByTagName("RaceInfo");
            xx=x[0].getElementsByTagName("LastUpdateDate");
            LastUpdateDate = xx[0].firstChild.nodeValue
            xx=x[0].getElementsByTagName("LastUpdateTime");
            LastUpdateTime = xx[0].firstChild.nodeValue

            xx=x[0].getElementsByTagName("ClientRefreshRate");
            refreshrate = xx[0].firstChild.nodeValue;

            //xx=x[0].getElementsByTagName("RaceName");
            //txt=txt + "<div class=\"alert alert-info\">"+"<p class=\"text-center\">"+"<strong>"+ xx[0].firstChild.nodeValue+" - Ranking at "+LastUpdateDate+" "+LastUpdateTime+"</strong>"+"</p>"+ "</div>";
            //txt=txt+"<title>"+xx[0].firstChild.nodeValue+"</title>";

            txt=txt+"<table style='margin-bottom: 5px' class=\"table table-bordered table-striped table-condensed\"><tr><th><center>Løbstype</center></th><th><center>Session</center></th><th><center>Bane</center></th><th><center>Status</center></th><th><center>Løbstid tilbage</center></th><th><center>Tid tilbage dette stint</center></th><th><center>Total antal stints</center></th><th><center>Aktuelle stint</center></th>";
            txt=txt+"</tr>";
            txt=txt + "<tr style='text-align: center;' class=\"Active\">";
            xx=x[0].getElementsByTagName("RaceType");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("SessionType");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("TrackName");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("RaceStatus");
            switch (xx[0].firstChild.nodeValue ) {
                case "Start":
                    txt=txt + "<td class=\"success\"><center><strong><big>" + xx[0].firstChild.nodeValue + "</big></strong></center></td>";
                    break;
                case "Pause":
                    txt=txt + "<td class=\"danger\"><center><strong><big>" + xx[0].firstChild.nodeValue + "</big></strong></center></td>";
                    break;
                case "Finish":
                    txt=txt + "<td class=\"danger\"><center><strong><big>" + xx[0].firstChild.nodeValue + "</big></strong></center></td>";
                    break;
                case "Grid":
                    txt=txt + "<td class=\"info\"><center><strong><big>" + xx[0].firstChild.nodeValue + "</big></strong></center></td>";
                    break;
                case "Yellow Flag":
                    txt=txt + "<td class=\"warning\"><center><strong><big>" + xx[0].firstChild.nodeValue + "</big></strong></center></td>";
                    break;
                default:
                    txt=txt + "<td>" + xx[0].firstChild.nodeValue + "</td>";
            };


            xx=x[0].getElementsByTagName("RaceTimeLeft");{try{txt=txt + "<td style='font-size: 125%'><center>" + xx[0].firstChild.nodeValue + "</center></td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("SegmentTimeLeft");{try{txt=txt + "<td style='font-size: 125%'><center>" + xx[0].firstChild.nodeValue + "</center></td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            //xx=x[0].getElementsByTagName("LapsLeft");{try{txt=txt + "<td><center>" + xx[0].firstChild.nodeValue + "</center></td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("NbSegment");{try{txt=txt + "<td style='font-size: 125%'><center>" + xx[0].firstChild.nodeValue + "</center></td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            xx=x[0].getElementsByTagName("SegmentID");{try{txt=txt + "<td style='font-size: 125%'><center>" + xx[0].firstChild.nodeValue + "</center></td>";} catch (er){txt=txt + "<td>-</td>"; }} 
            txt=txt + "</tr>";  
            txt=txt + "</table>";

            txt=txt+"<table style='margin-bottom: 5px' class=\"table table-bordered table-striped table-condensed\"><tr><th><center>Banerekord</center></th><th><center>Dette stints hurtigste omgang</center></th><th><center>Løbets hurtigste omgang</center></th></th>";
            txt=txt+"</tr>";
            txt=txt + "<tr style='text-align: center;' class=\"Active\">";
            xx=x[0].getElementsByTagName("TrackBestLapTime");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue;} catch (er){txt=txt + "<td>-"; }} 
            xx=x[0].getElementsByTagName("TrackBestLapTimeOwner");{try{txt=txt +" "+ xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + " -</td>"; }} 
            xx=x[0].getElementsByTagName("SegBestLapTime");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue;} catch (er){txt=txt + "<td>-"; }} 
            xx=x[0].getElementsByTagName("SegBestLapTimeOwner");{try{txt=txt +" "+ xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + " -</td>"; }} 
            xx=x[0].getElementsByTagName("RaceBestLapTime");{try{txt=txt + "<td style='font-size: 125%'>" + xx[0].firstChild.nodeValue ;} catch (er){txt=txt + "<td>-"; }} 
            xx=x[0].getElementsByTagName("RaceBestLapTimeOwner");{try{txt=txt +" "+ xx[0].firstChild.nodeValue + "</td>";} catch (er){txt=txt + " -</td>"; }} 
            txt=txt + "</tr>";  
            txt=txt + "</table>";

            txt=txt+"<table style='margin-bottom: 5px' class=\"table table-bordered table-striped table-condensed\"><tr><th><center>Position</center></th><th>Kører</th><th><center>Omgang</center></th><th><center>Omgangstid</center></th><th><center>Hurtigste omgangstid</center></th><th><center>Gennemsnit</center></th>";
            txt=txt+"<th><center>Omgange dette stint</center></th><th><center>Spor</center></th>";
            txt=txt+"";
            txt=txt+"</tr>";
            x=xmlhttp.responseXML.documentElement.getElementsByTagName("Row");
            for (i=0;i<x.length;i++)
            {
                if (i % 2 ==0) 
                {
                    txt=txt + "<tr class=\"info\">";
                } 
                else 
                {
                    txt=txt + "<tr class=\"success\">";
                };
                xx=x[i].getElementsByTagName("Position");{try{txt=txt + "<td style='width: 5%;'><strong><center><big>" + xx[0].firstChild.nodeValue + "</big></center></strong></td>";} catch (er){txt=txt + "<td>-</td>"; }}
                //xx=x[i].getElementsByTagName("TeamName");{try{txt=txt + "<td><small>" + xx[0].firstChild.nodeValue + "</small></td>";} catch (er){txt=txt + "<td>-</td>"; }}
                xx=x[i].getElementsByTagName("DriverName");{try{txt=txt + "<td style='width: 20%;font-size: 150%'><small>" + xx[0].firstChild.nodeValue + "</small></td>";} catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("Lap");{try{txt=txt + "<td style='width: 5%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";} catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("LapTime");{try{txt=txt + "<td style='width: 10%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("BestLapTime");{try{txt=txt + "<td style='width: 10%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("Average");{try{txt=txt + "<td style='width: 10%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("FuelLeft");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //1xx=x[i].getElementsByTagName("StopAndGo");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("InPitStop");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("PitStopTime");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("NbPitStop");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("SegmentLap");{try{txt=txt + "<td style='width: 10%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("SegmentPosition");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("SegmentAverage");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                xx=x[i].getElementsByTagName("Lane");{try{txt=txt + "<td style='width: 10%;font-size: 150%'><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("CarName");{try{txt=txt + "<td><small>" + xx[0].firstChild.nodeValue + "</small></td>";} catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("FuelAverage");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("FuelMax");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("FuelLap");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                //xx=x[i].getElementsByTagName("OnTrack");{try{txt=txt + "<td><small><center>" + xx[0].firstChild.nodeValue + "</center></small></td>";}catch (er){txt=txt + "<td>-</td>";}}
                txt=txt + "</tr>";
            }
            txt=txt + "</table>";
            document.getElementById('LeaderBoardInfo').innerHTML=txt;
        }
    }
    xmlhttp.open("GET",url+"?nocache="+Math.random(),true);
    xmlhttp.send();
}