// ==UserScript==
// @name        mmmturkeybacon Last HITs Previewed
// @version     1.11
// @description Shows a log of the last 50 HITs that were previewed. This can aid you in saving a HIT to look at later, examining a HIT's contents after it has been submitted, contacting a requester, looking at turkopticon ratings, or sharing a HIT. MTurk Great HIT Export and mmmturkeybacon Color Coded Search with Checkpoints should execute after this script so they operate correctly on the page it generates. To see the last 50 HITs previewed visit: https://www.mturk.com/mturk/viewhits?last_hits_previewed
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/preview?groupId=*
// @match       https://*.mturk.com/mturk/viewhits?last_hits_previewed*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/8032/mmmturkeybacon%20Last%20HITs%20Previewed.user.js
// @updateURL https://update.greasyfork.org/scripts/8032/mmmturkeybacon%20Last%20HITs%20Previewed.meta.js
// ==/UserScript==

var HIT_LOG_SIZE = 50;

if (document.location.href.indexOf('preview?groupId=') > -1)
{
    var groupId = $('form[name="hitForm"][method="POST"][action="/mturk/hitReview"] input[name="groupId"]').val();
    if (groupId)
    {
        var hitId = $('form[name="hitForm"][method="POST"][action="/mturk/hitReview"] input[name="hitId"]').val();
        var requesterId = $('input[type="hidden"][name="requesterId"]').val();
        var title = $('td[class="capsulelink_bold"][nowrap=""][valign="middle"][width="100%"][align="left"] > div').text().trim();
        var requester = $('td[class="capsule_field_title"]').has('a[id="requester.tooltip"]').next('td[class="capsule_field_text"]').text().trim().split(/\u00a0/)[0]; // split at &nbsp; to remove requesterId added by mmmturkeybacon Enhanced HIT Information Capsule
        var reward = $('td[class="capsule_field_title"]').has('a[id="reward.tooltip"]').next('td[class="capsule_field_text"]').text().trim().split(' per')[0]; // remove 'per HIT' from reward
        var number_of_hits = $('td[class="capsule_field_title"]').has('a[id="number_of_hits.tooltip"]').next('td[class="capsule_field_text"]').text().trim();
        var time_left = $('td[class="capsule_field_title"]').has('a[id="time_left.tooltip"]').next('td[class="capsule_field_text"]').text().trim();
        var qualifications = $('td[class="capsule_field_title"]').has('a[id="qualifications.tooltip"]').next('td[class="capsule_field_text"]').text().trim();
        var date_viewed = (new Date()).toLocaleString();
        var iframe_src = $('iframe').attr('src');
        iframe_src = iframe_src ? iframe_src : '#';

        var hitAutoAppDelayInSeconds = $('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').val();
        
        // time formatting code modified from http://userscripts.org/scripts/show/169154
        var days  = Math.floor((hitAutoAppDelayInSeconds/(60*60*24)));
        var hours = Math.floor((hitAutoAppDelayInSeconds/(60*60)) % 24);
        var mins  = Math.floor((hitAutoAppDelayInSeconds/60) % 60);
        var secs  = hitAutoAppDelayInSeconds % 60;
        
        var aa_time = (days  == 0 ? '' : days  + (days  > 1 ? ' days '    : ' day '))    +
                      (hours == 0 ? '' : hours + (hours > 1 ? ' hours '   : ' hour '))   + 
                      (mins  == 0 ? '' : mins  + (mins  > 1 ? ' minutes ' : ' minute ')) + 
                      (secs  == 0 ? '' : secs  + (secs  > 1 ? ' seconds ' : ' second '));
        
        if (hitAutoAppDelayInSeconds == 0)
        {
            aa_time = "0 seconds ";
        }

        aa_time = aa_time.slice(0,-1);
        
        var previewed_HITs_data_array = JSON.parse(localStorage.getItem('mtb_previewed_HITs_data_array'));
        
        if (previewed_HITs_data_array == null ||  previewed_HITs_data_array.length != HIT_LOG_SIZE)
        {
            previewed_HITs_data_array = new Array(HIT_LOG_SIZE);
        }

        var i;
        for (i = 0; i < previewed_HITs_data_array.length; i++)
        {
            if (previewed_HITs_data_array[i] && previewed_HITs_data_array[i].groupId == groupId)
            {
                break;
            }
        }
        
        if (i == previewed_HITs_data_array.length)
        {
            i = 0;
        }
        previewed_HITs_data_array.splice(i, 1);
        previewed_HITs_data_array.push({hitId:hitId, groupId:groupId, requesterId:requesterId, title:title, requester:requester, reward:reward, number_of_hits:number_of_hits, time_left:time_left, qualifications:qualifications, date_viewed:date_viewed, aa_time:aa_time, iframe_src:iframe_src});
        
        localStorage.setItem('mtb_previewed_HITs_data_array', JSON.stringify(previewed_HITs_data_array));
    }
}
else if (document.location.href.indexOf('viewhits?last_hits_previewed') > -1)
{
    document.title = 'Last HITs Previewed';
    document.body.innerHTML = '<center><h1>Last HITs Previewed</h1></center>';
    var previewed_HITs_data_array = JSON.parse(localStorage.getItem('mtb_previewed_HITs_data_array'));
    var innerHTML = '<table cellpadding="0" cellspacing="0" border="0" style="margin:5px; clear:both;"></table>\
                     <table cellpadding="0" cellspacing="0" border="0" style="margin:5px; clear:both;"></table>\
                     <table cellpadding="0" cellspacing="5" border="0" width="100%">';

    for (var i = previewed_HITs_data_array.length-1; i > -1; i--)
    {
        j = (previewed_HITs_data_array.length-1)-i;
        var phda = previewed_HITs_data_array[i];
        if (phda == null)
        {
            continue;
        }

        innerHTML += '        <tr>\
            <td>'+(j+1)+'</td><td width="100%">\
                \
\
        \
<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
    <tr>\
        <td height="21" colspan="2" rowspan="2" align="left" valign="bottom"><img src="/media/top_left_corner.gif" width="11" height="21" border="0" alt=""></td>\
        <td align="center" valign="middle" bgcolor="#336699" height="1"></td>\
        <td colspan="2" rowspan="2" align="right" valign="bottom"><img src="/media/top_right_corner.gif" width="11" height="21" border="0" alt=""></td>\
    </tr>\
\
    <tr>\
        <td align="left" valign="middle" bgcolor="#CCDDE9" height="20" width="100%">\
            <table cellpadding="0" cellspacing="0" border="0" width="100%">\
                <tr>\
                    <td align="left" valign="middle" nowrap>\
                        <a class="capsulelink" href="'+phda.iframe_src+'" id="capsule'+j+'-0">\
                            '+phda.title+'\
                            <span class="tags"></span>\
                        </a>\
                    </td>\
                    <td align="left" valign="middle">\
                            <img src="/media/spacer.gif" width="20" height="1" border=0 alt="">\
                    </td>\
                    <td align="right" valign="middle" width="100%" nowrap>\
                        <span class="capsulelink">\
                            \
\
    \
\
\
\
\
    <a href="/mturk/preview?groupId='+phda.groupId+'">View a HIT in this group</a>\
\
\
\
                        </span>\
                    </td>\
                </tr>\
            </table>\
        </td>\
    </tr>\
\
    <tr>\
        <td width="1" align="center" valign="middle" bgcolor="#336699"></td>\
\
        <td align="center" valign="middle" bgcolor="#FOF6F9" width="18"></td>\
\
        <td align="left" valign="top" bgcolor="#FOF6F9" width="100%">\
            <table cellpadding="0" cellspacing="0" border="0" width="100%">\
                <tr>\
                    <td valign="top" width="33%">\
                        <table cellspacing="5" border="0">\
                            <tr>\
                                <td align="left" valign="top" nowrap class="capsule_field_title">\
                                    <a id="requester.tooltip--'+j+'">\
                                        Requester:&nbsp;&nbsp;\
                                    </a>\
                                </td>\
                                <td align="left" valign="top" nowrap class="capsule_field_text"  width="100%">\
                                    \
                                    \
                                    <a href="/mturk/searchbar?selectedSearchType=hitgroups&amp;requesterId='+phda.requesterId+'"><span class="requesterIdentity">'+phda.requester+'</span></a>\
                                </td>\
                            </tr>\
                        </table>\
                    </td>\
                    <td valign="top" width="33%">\
                        <table cellpadding="5" cellspacing="0" border="0">\
                            <tr>\
                                <td align="left" valign="top" nowrap class="capsule_field_title">\
                                    <a id="expiration_date.toolip--'+j+'">\
                                        Date Viewed:&nbsp;&nbsp;\
                                    </a>\
                                </td>\
                                <td align="left" valign="top" nowrap class="capsule_field_text">'+phda.date_viewed+'&nbsp;\
                                    \
                                                            \
                                        \
                                </td>\
                            </tr>\
                            <tr>\
                                <td align="left" valign="top" nowrap class="capsule_field_title">\
                                    <a id="duration_to_complete.tooltip--'+j+'">\
                                       Time Allotted:&nbsp;&nbsp;\
                                    </a>\
                                </td>\
                                <td align="left" valign="top" nowrap class="capsule_field_text">'+phda.time_left+'</td>\
                            </tr>\
\
                        </table>\
                    </td>\
                    <td valign="top" width="33%">\
                        <table cellpadding="5" cellspacing="0" border="0">\
                            <tr>\
                                <td align="left" valign="top" nowrap class="capsule_field_title">\
                                    <a id="reward.tooltip--'+j+'">\
                                        Reward:&nbsp;&nbsp;\
                                    </a>\
                                </td>\
                                <td align="left" valign="top" nowrap class="capsule_field_text"><span class="reward">'+phda.reward+'</span></td>\
                            </tr>\
                            <tr>\
                                <td align="left" valign="top" nowrap class="capsule_field_title">\
                                    <a id="number_of_hits.tooltip--'+j+'">\
                                        HITs Available:&nbsp;&nbsp;\
                                    </a>\
                                </td>\
                                <td align="left" valign="top" nowrap class="capsule_field_text">'+phda.number_of_hits+'</td>\
                            </tr>\
                        </table>\
                    </td>\
                </tr>\
            </table>\
\
            <div id="capsule'+j+'target" class="capsuletarget" width="100%">\
            <table cellpadding="5" cellspacing="0" border="0" width="100%">\
                <tr>\
                    <td align="left" valign="top" nowrap class="capsule_field_title">\
                        <a id="description.tooltip--'+j+'">\
                            Description:\
                        </a>\
                    </td>\
                    <td colspan="2" align="left" valign="top" class="capsule_field_text" width="100%">No description available. Automatically approves after '+phda.aa_time+'.</td>\
                </tr>\
            </table>\
            <table cellpadding="0" cellspacing="0" border="0" width="100%">\
                <tr>\
                    <td align="left" width="100%" valign="top" nowrap>\
                    \
\
\
    \
	<table style="padding: 2px; margin: 0;">\
	  <tr>\
	    <td align="left" valign="top" nowrap class="capsule_field_title">\
	        <a id="qualificationsRequired.tooltip--'+j+'">\
	            Qualifications Required:\
	        </a>\
	    </td>\
	  </tr>\
	  \
		\
			\
		\
		<tr>\
			<td style="padding-right: 2em; white-space: nowrap;">\
				<div style="float: left; display: table-row; max-width: 600px;">\
					<div style="display: table-cell; white-space: normal;">\
						'+phda.qualifications+'\
	\
\
					</div>\
				</div>\
			</td>\
		</tr>\
	</table>\
\
\
\
                    </td>\
                    <td align="right" valign="bottom" style="padding: 5px;" nowrap>\
                         \
                            \
                                \
                                \
                                \
                                <a href="/mturk/contact?subject=Regarding+An+Amazon+Mechanical+Turk+HIT&amp;requesterId='+phda.requesterId+'&amp;requesterName='+phda.requester.replace(' ','+')+'">Contact the Requester of this HIT</a>\
                            \
                        \
                    </td>\
                </tr>\
            </table>\
            </div>\
        </td>\
\
        <td align="center" valign="middle" bgcolor="#FOF6F9" width="8"></td>\
        <td align="center" valign="middle" bgcolor="#336699" width="1"></td>\
    </tr>\
\
    <tr>\
        <td height="10" colspan="2" rowspan="2" align="left" valign="top"><img src="/media/bottom_left_corner.gif" width=11 height=10 border=0 alt=""></td>\
        <td align="center" valign="top" bgcolor="#FOF6F9" height="9" width="100%"></td>\
        <td align="right" valign="top" colspan="2" rowspan="2" height="10"><img src="/media/bottom_right_corner.gif" width=11 height=10 border=0 alt=""></td>\
    </tr>\
\
    <tr>\
        <td align="center" valign="top" bgcolor="#336699" height="1" width="100%"></td>\
    </tr>\
</table>\
\
\
                \
            </td><td>'+(j+1)+'</td>\
        </tr>\
    \
    ';

    }
    document.body.innerHTML += innerHTML + '</table>';
}