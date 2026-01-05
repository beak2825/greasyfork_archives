// ==UserScript==
// @name           WME URComments  Israeli Hebrew List
// @description    This script is for Hebrew comments to be used with my other script URComments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.6.3
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014, comments - crayzee
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @license        MIT/BSD/X11


// @downloadURL https://update.greasyfork.org/scripts/8682/WME%20URComments%20%20Israeli%20Hebrew%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/8682/WME%20URComments%20%20Israeli%20Hebrew%20List.meta.js
// ==/UserScript==
var URCommentIsraeliHebrewVersion = GM_info.script.version; 
//var URCommentIsraeliHebrewVersion = "0.0.0"; //manually change this version number to match the script's version 
var URCommentIsraeliHebrewUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentIsraeliHebrewVersionUpdateNotes =  "רשימת ההערות בעברית עודכנה לגרסה " + URCommentIsraeliHebrewVersion+":";
URCommentIsraeliHebrewVersionUpdateNotes = URCommentIsraeliHebrewVersionUpdateNotes + "\r" + "B5.1 - גוגל - בוצע קישור" +"\r" +"תיקון שגיאות כתיב ותרגום (SH-ODED)";

if (URCommentIsraeliHebrewUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentIsraeliHebrewVersion') !== URCommentIsraeliHebrewVersion) {
		alert(URCommentIsraeliHebrewVersionUpdateNotes);
		localStorage.setItem('URCommentIsraeliHebrewVersion', URCommentIsraeliHebrewVersion);
	}
}

/* Changelog
 * 5th update to the format
 * 
 * 0.0.1 - initial version
 * 0.0.2 - replaced custom to IsraeliHebrew, removed $mapsURL
 * 0.0.3 - Removed duplicate responds, Reorganization, changed permalink spot
 * 0.0.4 - A3,D1 added, A2 moved, D1 title changed
 * 0.0.5 - NotIdentifiedPos updated - double click works now!, A1 moved back
 * 0.0.6 - B5 - עדכון מפות גוגל, B17 - נוסף המפה כבר מעודכנת, B18 - נוסף קריסת תוכנה, B19 - נוסף מסלול תקין, D8 - נוסף כיוון תנועה
 * 0.0.7 - A4 - ניווט משונה נוסף, B11+B16 - איחוד תגובות, B6 - עדכון הערה וקישורים, D6 - ביטול (כפילות)
 * 0.0.8 - D3 - הוחלף לבירור כביש עפר, D6 - נוסף ניווט שגוי - בדיקת מסלולים, B20 - נוסף ניווט לצד נכון של הרחוב
 * 0.0 9 - כללי - צמצם רווחים, A4 - שינוי סימון מיוחד, D6 - תיקון
 * 0.1 - עדכון פורמט, B16 - פניה לאחר פחות מ-200 מטר, C1 - עדכון כללי - בוצע הועלה לראש הרשימה, D - קבוצה הועלתה כלפי מעלה
 * 0.1.1 - B15 - שינוי לניווט משונה - 60שנ', B1,B5,B9- עדכון, tinyurl - החלפת כתובות מדריכים
 * 0.1.2 - עדכון סקריפט DBLCLK, A5 - בירור ניווט משונה
 * 0.1.3 - תרגום מלא של הממשק, D20 - הוספת הערה אישית - PINIFRU
 * 0.1.3.1 - D20 תיקון תרגום ממשק, הסרה של
 * 0.1.4 - הסרת דרישה ללינק בכתובת שגויה, B14 - עדכון פירסוםת,B21 - דיווח על צומת מרומזר
 * 0.2 - (CAFRI שיפור נראות הערות (באדיבות 
 * 0.2.1 - עדכון C1 
 * 0.3 - עדכון סקריפט (הוספת הגדרה 43) לגבי הצגת גלולה עם סימון מיוחד)
 * 0.3.1  - הפניה למדריך משתמש בעברית, שינוי קישור דף תמיכה
 * 0.4 - התאמת קישורים לפורום העולמי (CAFRI)
 * 0.4.1 - עדכון הפניות לפורום החדש, A6 - הוספת פרסום שגוי - סימון מיוחד, B14 - עדכון פרסום שגוי, C8 - הוספה פרסום שגוי -תוקן
 * 0.5 - הוספת התראת עדכון
 * 0.5.1 - עדכון קישור wazepp, עדכון בירור כתובת - D1, הוספת נחיית סיוון + המשך ישר - B22
 * 0.5.2 - D9 - הקלטת כביש - השלמת עריכה
 * 0.5.3 - D10 - בירור שם משתמש + הגדרות, עדכון:Incorrect address - כתובת שגויה, עדכון דיווח במקום לא נכון  - B14
 * 0.5.4 - D11 - הוספת בירור מהירות מירבית, C1 - הוספת ביצוע מהירות מירבית, B2 - שינוי למהירות מותרת תקינה
 * 0.6 - עדכון כתובת בטא, B8 - עדכון קישור, B17, D1, C3-8 - הוספת אפשרות רענון, 
 * 0.6.1 - הוספת סוג הערה חדש -מהירות, D11 - ביטול הערת מהירות
 * 0.6.2 - 6 - תיקון כתובת שגויה[CAFRI], עדכון כללי לגבי מיקום פקודת רענון, C1 - תיקון עדכון מהירות
 * 0.6.3 - B5.1 - גוגל - בוצע קישור, תיקון שגיאות כתיב ותרגום (SH-ODED)
 

*/
//
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \r\r. example "Line1\r\rLine2",
//if you wish to have text on the next line with no spaces in your message use \r. example "Line1\rLine2",
//IsraeliHebrew Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsIsraeliHebrewReminderPosistion = 6;

//this is the note that is added to the the reminder link  option
window.UrcommentsIsraeliHebrewReplyInstructions = 'ניתן להגיב מתוך אפליקציית וויז או בכתובת '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsIsraeliHebrewCloseNotIdentifiedPosistion = 15;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsIsraeliHebrewdef_names = [];
window.UrcommentsIsraeliHebrewdef_names[6] = "Incorrect turn - פניה שגויה"; //"Incorrect turn";
window.UrcommentsIsraeliHebrewdef_names[7] = "Incorrect address - כתובת שגויה"; //"Incorrect address";
window.UrcommentsIsraeliHebrewdef_names[8] = "Incorrect route - מסלול שגוי"; //"Incorrect route";
window.UrcommentsIsraeliHebrewdef_names[9] = "Missing roundabout - כיכר חסרה"; //"Missing roundabout";
window.UrcommentsIsraeliHebrewdef_names[10] = "General error - שגיאה כללית"; //"General error";
window.UrcommentsIsraeliHebrewdef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsIsraeliHebrewdef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsIsraeliHebrewdef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsIsraeliHebrewdef_names[14] = "Wrong driving direction - כיוון נסיעה שגוי"; //"Wrong driving direction";
window.UrcommentsIsraeliHebrewdef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsIsraeliHebrewdef_names[16] = "Missing Road - כביש חסר"; //"Missing Road";
window.UrcommentsIsraeliHebrewdef_names[18] = "Missing landmark - ציון דרך חסר"; //"Missing Landmark";
window.UrcommentsIsraeliHebrewdef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsIsraeliHebrewdef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsIsraeliHebrewdef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsIsraeliHebrewdef_names[23] = "Speed limit - הגבלת מהירות"; //"Speed limit";

//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsIsraeliHebrewURC_Text = [];
window.UrcommentsIsraeliHebrewURC_Text_tooltip = [];
window.UrcommentsIsraeliHebrewURC_USER_PROMPT = [];
window.UrcommentsIsraeliHebrewURC_URL = [];

//zoom out links
window.UrcommentsIsraeliHebrewURC_Text[0] = "זום 0 וסגור דיווח";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[0] = "מגיע לזום הגבוה ביותר וסוגר את חלון בדיווח";

window.UrcommentsIsraeliHebrewURC_Text[1] = "זום 2 וסגור דיווח";		
window.UrcommentsIsraeliHebrewURC_Text_tooltip[1] = "מגיע לזום ברמה 2 שבו ההדגשות של תוספים עובדים בצורה הטובה ביותר וסוגר את חלון בדיווח";

window.UrcommentsIsraeliHebrewURC_Text[2] = "זום 3 וסגור דיווח";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[2] = "מגיע לזום ברמה 3 שבו ההדגשות של תוספים עובדים בצורה הטובה ביותר וסוגר את חלון בדיווח";

window.UrcommentsIsraeliHebrewURC_Text_tooltip[3] = "ריענון מפה";

window.UrcommentsIsraeliHebrewURC_Text_tooltip[4] = "מספר דיווחים מוצגים על המפה";

//tab names
window.UrcommentsIsraeliHebrewURC_Text[5] = "הערות";
window.UrcommentsIsraeliHebrewURC_Text[6] = "סינון דיווחי משתמשים";
window.UrcommentsIsraeliHebrewURC_Text[7] = "הגדרות";

//UR Filtering Tab
window.UrcommentsIsraeliHebrewURC_Text[8] = "(מדריך למשתמש (עברית";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[8] = "מדריך למשתמש של סינון דיווחים";
window.UrcommentsIsraeliHebrewURC_URL[8] = "https://docs.google.com/presentation/d/1yKrSAMvlUFocuuBDchwaT4Yen_cEzjscKBanXot00y0/present?slide=id.ge9f45f893_1_6";
		
window.UrcommentsIsraeliHebrewURC_Text[9] = "לאפשר סינון דיווחים";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[9] = "לאפשר או למנוע סינון של URCOMMENTS";

window.UrcommentsIsraeliHebrewURC_Text[10] = "לאפשר גלולת ספירת דיווחים";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[10] = "לאפשר או למנוע הצגת גלולה עם ספירת דיווחים";

window.UrcommentsIsraeliHebrewURC_Text[12] = "להסתיר דיווחים ממתינים";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[12] = "להציג רק דיווחים אשר זקוקים לטיפול ולהסתיר אלו הממתינים";

window.UrcommentsIsraeliHebrewURC_Text[13] = "הצג רק דיווחים אליהם התייחסתי";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[13] = "להסתיר דיווחים שהם יש 0 התייחסויות שלי ויש התייחסות של עורך אחר";

window.UrcommentsIsraeliHebrewURC_Text[14] = "להציג דיווחים של אחרים שעברו זמני תזכורת + סגירה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[14] = "להציג דיווחים שבהם ישנה התייחסות של עורך אחר ובהם עבר זמן תזכורת וסגירה ביחד";

window.UrcommentsIsraeliHebrewURC_Text[15] = "להסתיר דיווחים בהם נדרשת תזכורת";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[15] = "להסתיר דיווחים בהם נדרשת תזכורת";

window.UrcommentsIsraeliHebrewURC_Text[16] = "להסתיר דיווחים עם תגובות";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[16] = "להסתיר דיווחים בהם ישנה תגובת מדווח";

window.UrcommentsIsraeliHebrewURC_Text[17] = "להסתיר דיווחים הממתינים לסגירה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[17] = "להסתיר דיווחים הממתינים לסגירה";

window.UrcommentsIsraeliHebrewURC_Text[18] = "להסתיר דיווחים ללא התייחסויות";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[18] = "להסתיר דיווחים בהם יש 0 התייחסויות";

window.UrcommentsIsraeliHebrewURC_Text[19] = "להסתיר דיווחי 0 ללא תיאור";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[19] = "להסתיר דיווחים ללא התייחסות בהם אין תיאור ";

window.UrcommentsIsraeliHebrewURC_Text[20] = "להסתיר דיווחי 0 עם תיאור";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[20] = "להסתיר דיווחים ללא התייחסות בהם יש תיאור";

window.UrcommentsIsraeliHebrewURC_Text[21] = "להסתיר דיווחים סגורים";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[21] = "להסתיר דיווחים סגורים";

window.UrcommentsIsraeliHebrewURC_Text[22] = "להסתיר דיווחים מסומנים";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[22] = "[NOTE] להסתיר דיווחים עם סימונים מיוחדים כגון";

window.UrcommentsIsraeliHebrewURC_Text[23] = "ימים לתזכורת: ";

window.UrcommentsIsraeliHebrewURC_Text[24] = "ימים לסגירה: ";

//settings tab
window.UrcommentsIsraeliHebrewURC_Text[25] = "מילוי של דיווח חדש";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[25] = "!!!מילוי אוטומטי של הערות בדיווח בו עדיין אין התייחסויות. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[26] = "הפעלת שליחת תזכורות";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[26] = "!!!במידה לדיווח ישנה הערה אחת ועברו מספר ימים כפי שהוגדרו תישלח תזכורות באופן אוטומטי. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[27] = "הצרה לדיווח חדש";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[27] = "!!!הצרה אוטומטית כאשר פותחים דיווח חדש ללא תגובות או כאשר שולחים תזכורות. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[28] = "מירכוז על דיווח";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[28] = "מירכוז אוטומטי כאשר בזום הנוכחי לדיווח יש תגובות וזום ברמה פחות מ-3";

window.UrcommentsIsraeliHebrewURC_Text[29] = "בחירת מצב פתוח, פתור, לא מזוהה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[29] = "החלפת הודעה מרשימה ולאחר מכן בחירת פעולה 'פתוח, פתור או לא מזוה' כפי שהוגדרה בהערה";

window.UrcommentsIsraeliHebrewURC_Text[30] = "שמירה לאחר הערת פתור או לא מזוהה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[30] = "אם בחירת מצב פתוח, פתור, לא מזוהה מסומן, האפשרות הזו תבצע שמירה ושליחה  אוטומטיות";

window.UrcommentsIsraeliHebrewURC_Text[31] = " סגירת חלון דיווח";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[31] = "חלון הדיווח ייסגר אוטומטית לאחר לחיצה על לחצן השליחה";

window.UrcommentsIsraeliHebrewURC_Text[32] = "ריענון מפה לאחר שליחת הערה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[32] = ". הדבר גורם להפעלת סינון מחדש של URO לאחר בחירת הערה ושליחתה מתבצע רענון מפה";

window.UrcommentsIsraeliHebrewURC_Text[33] = "הרחבה לאחר שליחת הערה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[33] = "לאחר בחירת הערה מתוך הרשימה  ושליחתה, תתבצע החזרה לרמת זום קודמת ";

window.UrcommentsIsraeliHebrewURC_Text[34] = " URC מעבר ללשונית";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[34] = "מעבר אוטומטי ללשונית URC לאחר טעינת מפה ופתיחת דיווח, בסיום הפעולה אחרי סגירת חלון הדיווח תתבצע החזרה ללשונית הקודמת";

//window.UrcommentsIsraeliHebrewURC_Text[35] = "הודעת סגירה - הקלקה כפולה לסגירה (שליחה אוט'(";
window.UrcommentsIsraeliHebrewURC_Text[35] = "הודעת סגירה - הקלקה כפולה לשליחה אוטומטית";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[35] = "!!!הוספת קישור נוסף להערת סגירה אשר הקלקה כפולה עליו תבצע שליחה, שמירה ובחירת פעולה אוטומטיות. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[36] = "כל ההערות - קישור להקלקה כפולה לשליחה אוטומטית";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[36] = "!!!הוספת קישור נוסף לכל הערה ברשימה אשר הקלקה כפולה עליו תבצע שליחה, שמירה ובחירת פעולה אוטומטיות. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[37] = "רשימת הערות";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[37] = "הצגת רשימות הערות זמינות כולל תמיכה ברשימה עצמית.";

window.UrcommentsIsraeliHebrewURC_Text[38] = "DONE\ניטרול לחצן הבא ";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[38] = "ניטרול לחצן DONE בתחתית של חלון דיווח חדש";

window.UrcommentsIsraeliHebrewURC_Text[39] = "הפסק מעקב אחרי הדיווח לאחר השליחה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[39] = "הפסק מעקב אחרי הדיווח לאחר שליחת ההערה";

window.UrcommentsIsraeliHebrewURC_Text[40] = "שליחה אוטומטית של תזכורות";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[40] = "!!!שליחה אוטומטית של תזכורות כאשר דיווח מוצג על המפה. מומלץ";

window.UrcommentsIsraeliHebrewURC_Text[41] = "החלפת תיאור סימון עם שם עורך";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[41] = "כאשר לדיווח עם סימון מיוחד הגיב עורך מזוהה שמו יחליף את תיואר הסימון המיוחד.";

window.UrcommentsIsraeliHebrewURC_Text[42] = "(**)"; //double click to close links
window.UrcommentsIsraeliHebrewURC_Text_tooltip[42] = "הקלק פעמיים כאן לשליחה אוטומטית - ";

window.UrcommentsIsraeliHebrewURC_Text[43] = "אל תציג סימון מיוחד על הגלולה";
window.UrcommentsIsraeliHebrewURC_Text_tooltip[43] = "סימון מיוחד לא יוצג ובמקומו יופיעו נתונים כמו בשאר הדיווחים (מספר תגובות וימים)  ";


window.UrcommentsIsraeliHebrewURC_USER_PROMPT[0] = "UR Comments - השגיאה נובעת או מגרסה ישנה יותר של רשימה פרטית או שגיאת תחביר. השגיאה תמנע טעינה של הרשימה הפרטית. נתון חסר:";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[1] = "UR Comments - נתונים הבאים חסרים ברשימת הערותיך: ";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[2] = "UR Comments - רשימת הערות לא נמצאה, ניתן למצוא רשימה והנחיות בכתובת https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[3] = "URComments - לא ניתן לקבוע כי סגירת הדיווח יתבצע לאחר 0 ימים";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[4] = "URComments - לצורך שימוש בהקלקה כפולה יש לאפשר את שליחה אוטומטית של תזכורות ";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[5] = "UR Comments - ביטול FILTERURS2 עקב כך שסינון, ספירה ותזכורות מנוטרלים";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[6] = "URComments -  זמן טעינת נתוני דיווח הסתיים, מנסה שוב. "; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[7] = "URComments -  מתבצעת שליחת תזכורת לדיווח "; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[8] = "URComment - סינון דיווחים מנוטרל עקב כך ש-URO פעיל."; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[9] = "UrComments - שינויים לא שמורים נמצאו!\r\rמאחר ואיפשרת שמירה אוטומטית, לא ניתן לבצע  שמירה כאשר יש נם שינויים קודמים שלא נשמררו.נא לבצע שמירה של שינויים קודמים ולאחר מכן ללחוץ שוב על הערה שברצונך לשלוח.";

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[10] = "URComments - חלון הערות לא נמצא! בכדי שהסקריפט יבצע פעולתו חלון הדיווח חייב להיות פתוח"; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsIsraeliHebrewURC_USER_PROMPT[11] = "URComments - נבחרה אפשרות לשליחת תזכורות ביום שהוגדר. השליחה מתבצעת כאשר הדיווח נצפה על גבי המסך. הערה: באם אפשרות זו נבחרה לא מומלץ להשאיר דיווח ללא סיום בירור אלא אם ממתינים לתשובת מדווח. "; //conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//IsraeliHebrew list
window.UrcommentsIsraeliHebrewArray2 = [			    
    //C1
    "עדכון כללי – בוצע", 
    "שלום ותודה על הדיווח,\r\rעדכנתי את המפה בהתאם למידע שמסרת.\rבעוד יום-יומיים נסה לבצע עדכון מפה בעזרת התוכנה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //сrayzee 26/12/15
    //"שלום ותודה על הדיווח,\r\rעדכנתי את המפה בהתאם למידע שמסרת.\rעל-מנת שהתיקון יכנס לתוקף אצלך יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 24/12/15
    "Solved", 
    
    //A1
    "מחק הערות ותשאיר דיווח כפתוח",
    "",
    "Open",

    //A2
    "תזכורת לאחר 4 ימים", //do not change (rickzabel)
    "שלום,\r\rעד כה לא התקבלה תגובתך לגבי פנייתך בוויז.\rאם בימים הקרובים לא נקבל את התייחסותך - פנייתך תיסגר ללא טיפול.",
    "Open", 

    //A3
    "דיווח נמצא בבדיקה",
    "שלום ותודה על הדיווח,\r\rפנייתך נבדקת.\rבסיום הבדיקה ישלח עדכון.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //A4
    "ניווט משונה - סימון מיוחד",
    //"[NOTE]\rשלום ותודה על הדיווח,\r\rהתקלה שדיווחת עליה ברורה, אך במקרה זה לא ניתן לתקנה על-ידי עריכת המפה.\r\rהנושא נמצא בבדיקת החברה.\r\rאפשר לעקוב בפורום:\rhttps://www.waze.com/he/forum/viewforum.php?f=50\r\rאו, במידה והתקלה נמשכת, ניתן לפנות ישירות לתמיכה:\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //crayzee 
    "[NOTE]\rשלום ותודה על הדיווח,\r\rהתקלה שדיווחת עליה ברורה, אך במקרה זה לא ניתן לתקנה על-ידי עריכת המפה.\r\rהנושא נמצא בבדיקת החברה.\r\rאפשר לעקוב בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1541\r\rאו, במידה והתקלה נמשכת, ניתן לפנות ישירות לתמיכה:\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //cafri 31/12/15
    "Open",

    //A5
    "בירור ניווט משונה",
    "שלום ותודה על הדיווח,\r\rהאם בפניה המבוקשת היה עומס תנועה שנמשך מספר דקות?\rהאם ידוע על עומסים שמתרחשים באופן קבוע בשעות הנ''ל במקום זה?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",
    
    //A6
     "פרסום שגוי - סימון מיוחד",
     "[NOTE]\rשלום ותודה על הדיווח. \r\rלידיעתך,הטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד ואין ביכולתנו העורכים המתנדבים לתקנם. \rבמידה והינך לקוח עסקי של חברת וויז, נא לבדוק את הנתונים באתר יעודי : https://biz.waze.co.il. \rיש אפשרות לפנות אל התמיכה בנושא: ads_support@waze.com. \r\rלידיעתך, נשלח טופס לתמיכה www.tinyurl/com/waze-form-ad\rונפתח דיווח בפורום הבא: https://www.waze.com/forum/viewforum.php?f=1545", // crayzee 03/01/2016
	 "Open",

    //B1 
    "שבוע ללא תגובה",
    //"שלום,\r\rלצערנו לא הצלחנו להבין את הטעון תיקון, והדיווח נסגר מחוסר פרטים מספיקים וחוסר עדכון במשך יותר משבוע.\r\rאם הבעיה עדיין קיימת, תוכלו לפתוח דיווח חדש עם פרטים נוספים, או לפתוח בקשה בפורום:\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלהבא אנא עזרו לנו על-ידי צירוף פרטים על מהות הבעיה והתיקון הדרוש.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום,\r\rלצערנו לא הצלחנו להבין את הטעון תיקון, והדיווח נסגר מחוסר פרטים מספיקים וחוסר עדכון במשך יותר משבוע.\r\rאם הבעיה עדיין קיימת, תוכלו לפתוח דיווח חדש עם פרטים נוספים, או לפתוח בקשה בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלהבא אנא עזרו לנו על-ידי צירוף פרטים על מהות הבעיה והתיקון הדרוש.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "NotIdentified",

    //B2  
    "מהירות מותרת תקינה",
   "שלום ותודה על הדיווח,\r\rבקשת שינוי של המהירות המירבית המותרת נבדקה אך לא נמצאה סיבה לאישורה.  \r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה", //crayzee 16/03/15
    "NotIdentified",

    //B3
    "באג ידוע בתוכנה הנראה כמו בעיית מפה",
    //"שלום ותודה על הדיווח,\r\rהתקלה שדיווחת עליה ברורה, אך במקרה זה לא ניתן לתקנה על-ידי עריכת המפה.\r\rהנושא נמצא בבדיקת החברה.\r\rאפשר לעקוב בפורום:\rhttps://www.waze.com/he/forum/viewforum.php?f=50\r\rאו, במידה והתקלה נמשכת, ניתן לפנות ישירות לתמיכה:\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rהתקלה שדיווחת עליה ברורה, אך במקרה זה לא ניתן לתקנה על-ידי עריכת המפה.\r\rהנושא נמצא בבדיקת החברה.\r\rאפשר לעקוב בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1542\r\rאו, במידה והתקלה נמשכת, ניתן לפנות ישירות לתמיכה:\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //cafri 31/12/15
    "NotIdentified",

    //B4
    "דיווח שנובע מניווט ממועדפים/היסטוריה",
    //"שלום ותודה על הדיווח,\r\rיתכן שהתקלה שדיווחת עליה נובעת ממידע שגוי שנשמר אצלך ב'מועדפים'/'היסטוריה' (תוצאת חיפוש שבצעת בעבר), אך כבר תוקן במפה.\r\rכדי לבדוק אם זו הבעיה, יש לבצע חיפוש חדש ליעד הניווט (אם הניווט בוצע מ'היסטוריה'), או למחוק את היעד המועדף ולהוסיפו מחדש (אם הניווט מ'מועדפים').\r\rהסבר על מועדפים ניתן לקרוא כאן:\rhttps://www.waze.com/he/wiki/index.php?title=מועדפים\r\rאם הבעיה עדיין קיימת, תוכלו לפתוח דיווח חדש עם פרטים נוספים, או לפתוח בקשה בפורום:\r    \r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rיתכן שהתקלה שדיווחת עליה נובעת ממידע שגוי שנשמר אצלך ב'מועדפים'/'היסטוריה' (תוצאת חיפוש שבצעת בעבר), אך כבר תוקן במפה.\r\rכדי לבדוק אם זו הבעיה, יש לבצע חיפוש חדש ליעד הניווט (אם הניווט בוצע מ'היסטוריה'), או למחוק את היעד המועדף ולהוסיפו מחדש (אם הניווט מ'מועדפים').\r\rהסבר על מועדפים ניתן לקרוא כאן:\rhttps://www.waze.com/he/wiki/index.php?title=מועדפים\r\rאם הבעיה עדיין קיימת, תוכלו לפתוח דיווח חדש עם פרטים נוספים, או לפתוח בקשה בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "NotIdentified",

    //B5
    "טעות בניווט - תוצאה ממפות גוגל",
    "שלום ותודה על הדיווח,\r\rהתוצאה השגויה שקיבלת הגיעה לוייז ממפות גוגל.\rניתן לפנות למפות גוגל (Google Maps) בבקשה לתיקון, במקביל לפנייתינו אליה.\r\rניתן להיעזר במדריך המצורף לאופן תיקון תוצאות חיפוש:\rhttp://tinyurl.com/wazef\r\rכמו-כן ניתן להוסיף המקום למפת וויז, אם עדין לא קיים. מדריך מפורט נמצא בקישור הבא:\rhttp://tinyurl.com/wazepp\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

	//B5.1
    "טעות בניווט - תוצאה ממפות גוגל - בוצע קישור",
    "שלום ותודה על הדיווח,\r\rהתוצאה השגויה שקיבלת הגיעה לוייז ממפות גוגל.\r בוצע קישור של תוצאת גוגל למיקום הנכון במפות וויז.\r\rיחד עם זאת, התוצאה במפות גוגל עדיין לא תקינה.\rניתן לפנות למפות גוגל (Google Maps) בבקשה לתיקון, במקביל לפנייתינו אליה.\r\rניתן להיעזר במדריך המצורף לאופן תיקון תוצאות חיפוש:\rhttp://tinyurl.com/wazef\r\rכמו-כן ניתן להוסיף המקום למפת וויז, אם עדין לא קיים. מדריך מפורט נמצא בקישור הבא:\rhttp://tinyurl.com/wazepp\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",
	
    //B6
    "GPS אין קליטת",
    "שלום ותודה על הדיווח,\r\rנראה כי מקלט ה-GPS במכשירך סבל מחוסר דיוק.\rניתן להעזר במדריך לאבחון וטיפול בבעיות קליטת GPS ב-WIKI הקהילתי:\rhttp://tinyurl.com/wazeg\r\rאו באתר התמיכה\rhttps://support.google.com/waze/answer/6083679?hl=iw&ref_topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B7
    "דרך חסומה זמנית",
    "שלום ותודה על הדיווח,\r\rחסימה זמנית אינה בעיית מפה.\rיש לדווח עליה באפליקציה על ידי לחיצה על דיווח --> סגירת כביש.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B8
    "בעיה בהקראת שמות רחובות TTS",
    "שלום ותודה על הדיווח,\r\rביכולתך לדווח בעצמך על ההגיה הנכונה של שם הרחוב, באמצעות הטופס בקישור הבא:\rhttp://goo.gl/g1OChG\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B9
    "הוספת מקום",
    "שלום ותודה על הדיווח,\r\rבאפשרותך להוסיף מקום חדש (עסק, נקודת עניין, מגורים) דרך מכשירך. האפשרות זמינה בלחיצה על דיווח --> מקום.\rניתן לצרף תמונה של המקום ופרטים נוספים (שעות פעילות, מספרי טלפון, קישור לאתר וכו').\rהדיווח ייבדק על ידי עורכי המפה, ובמידה והנתונים תקינים, תאושר הוספת המקום והמפה תעודכן תוך יום-יומיים.\r\rבמידה וברצונך להוסיף תמונה למקום (חדש או קיים) יש לוודא כי:\r1. התמונה היא תמונת חוץ של המקום.\r2. התמונה חדה ומוארת היטב.\r3. בתמונה לא מופיעים אנשים אותם ניתן לזהות על-פי פניהם.\r4. בתמונה לא מופיעים רכבים אותם ניתן לזהות לפי מספר רכב.\r\rמדריך מפורט נמצא בקישור הבא:\rhttp://tinyurl.com/wazepp\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B10
    "דיווח על כיכר חסרה בכיכר",
    //"שלום ותודה על הדיווח,\r\rבמקום הדיווח כבר קיימת כיכר.\r\rנסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rיש לשים לב כי כיכרות בעלות רדיוס קטן מ-17 מטר לא יראו בתצוגה במכשיר הנייד אבל בהנחיות הניווט יתנו הוראות נכונות.\r\rבאם עדיין אינכם מקבלים הנחיות נכונות, באפשרותכם:\r- לפתוח בקשה בפורום\rhttps://www.waze.com/he/forum/viewforum.php?f=50\r- לפנות לתמיכה\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לך בכל נושא שאינו קשור בעדכון המפה החיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rבמקום הדיווח כבר קיימת כיכר.\r\rנסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rיש לשים לב כי כיכרות בעלות רדיוס קטן מ-17 מטר לא יראו בתצוגה במכשיר הנייד אבל בהנחיות הניווט יתנו הוראות נכונות.\r\rבאם עדיין אינכם מקבלים הנחיות נכונות, באפשרותכם:\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1541\r- לפנות לתמיכה\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לך בכל נושא שאינו קשור בעדכון המפה החיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //cafri 31/12/15
    "NotIdentified",

    //B11
    "פניה שאינה קשורה לעדכון המפה החיה",
    //"שלום ותודה על הדיווח,\r\rדיווח 'בעיה במפה' מיועד לדווח על בעיות הנוגעות לעדכון המפה, כגון: כתובת שגויה, קיום/אי קיום מצלמה במקום, הוראות ניווט הסותרות את המצב בשטח וכד'.\r\rדיווח 'בעיה במפה' אינו מיועד לדיווח על אי נכונות התרעות מסוג: פקק תנועה, סכנה, משטרה, תאונת דרכים.\r\rבעיות מסוג זה יש לדווח בפורומים הקהילתיים:\rhttps://www.waze.com/he/forum/viewforum.php?f=50\r\rאו להפנות ישירות לתמיכה\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rדיווח 'בעיה במפה' מיועד לדווח על בעיות הנוגעות לעדכון המפה, כגון: כתובת שגויה, קיום/אי קיום מצלמה במקום, הוראות ניווט הסותרות את המצב בשטח וכד'.\r\rדיווח 'בעיה במפה' אינו מיועד לדיווח על אי נכונות התרעות מסוג: פקק תנועה, סכנה, משטרה, תאונת דרכים.\r\rבעיות מסוג זה יש לדווח בפורומים הקהילתיים:\rhttps://www.waze.com/forum/viewforum.php?f=1533\r\rאו להפנות ישירות לתמיכה\rhttps://support.google.com/waze/?hl=iw#topic=6024556\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "NotIdentified",

    //B12
    "כתובת דפי זהב שגוייה",
    //"שלום ותודה על הדיווח,\r\rתיקון כתובת או פרטים של עסקים שכתובתם נמצאה דרך דפי זהב (אפילו אם החיפוש נעשה דרך תוכנת ווייז), יש לבקש מדפי זהב.\r\rבאפשרותך לפתוח הודעה בפורום\rhttps://www.waze.com/he/forum/viewforum.php?f=22\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rתיקון כתובת או פרטים של עסקים שכתובתם נמצאה דרך דפי זהב (אפילו אם החיפוש נעשה דרך תוכנת ווייז), יש לבקש מדפי זהב.\r\rבאפשרותך לפתוח הודעה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1560\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "NotIdentified",

    //B13
    "אין מפה - רענון",
    //"שלום ותודה על הדיווח,\r\rהבעיה המדווחת אינה קשורה לעדכון המפה.\r\rנסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rכך תסתנכרן המפה במכשיר אל מול המפה המעודכנת.\rמומלץ לחזור על פעולה זו אחת לשבוע.\r\rבמידה ותיתקלו שוב בבעיה זו, אנא הפנו את שאלתכם לפורום\rhttps://www.waze.com/he/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\r או פנו לתמיכה:\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לכם בכל נושא שאינו קשור בעדכון המפה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rהבעיה המדווחת אינה קשורה לעדכון המפה.\r\rנסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rכך תסתנכרן המפה במכשיר אל מול המפה המעודכנת.\rמומלץ לחזור על פעולה זו אחת לשבוע.\r\rבמידה ותיתקלו שוב בבעיה זו, אנא הפנו את שאלתכם לפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\r או פנו לתמיכה:\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לכם בכל נושא שאינו קשור בעדכון המפה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "NotIdentified",

   //B14
    "אייקון/פרסומת במיקום שגוי",
    //"שלום, \rתודה על הדיווח. \rהטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד ואין ביכולתנו העורכים המתנדבים לתקנם. \rיש אפשרות לפנות אל התמיכה בנושא: ads_support@waze.com. \rכמו כן, ניתן לדווח בפורום הבא. יש לדווח מה המיקום השגוי ומהו המיקום הנכון במידה וידוע. http://goo.gl/JEyN1e",
    //"שלום, \rתודה על הדיווח. \rהטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד. לשם תיקון הבעיה יש לדווח בפורום הבא. יש לדווח מה המיקום השגוי ומהו המיקום הנכון במידה וידוע. http://goo.gl/JEyN1e ובנוסף יש אפשרות לפנות אל התמיכה במקביל https://www.waze.com/he/support/question",
    //"שלום ותודה על הדיווח. \rלידיעתך,הטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד ואין ביכולתנו העורכים המתנדבים לתקנםלידיעתך. \rנא לבדוק את הנתונים באתר יעודי : https://biz.waze.co.il. \rיש אפשרות לפנות אל התמיכה בנושא: ads_support@waze.com. \rכמו כן, ניתן לדווח בפורום הבא. יש לדווח מה המיקום השגוי ומהו המיקום הנכון במידה וידוע. http://goo.gl/JEyN1e",
    //"שלום ותודה על הדיווח. \rלידיעתך,הטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד ואין ביכולתנו העורכים המתנדבים לתקנם. \rנא לבדוק את הנתונים באתר יעודי : https://biz.waze.co.il. \rיש אפשרות לפנות אל התמיכה בנושא: ads_support@waze.com. \rכמו כן, ניתן לדווח בפורום הבא. יש לדווח מה המיקום השגוי ומהו המיקום הנכון במידה וידוע. https://www.waze.com/forum/viewforum.php?f=1545", // cafri 31/12/15
    "שלום ותודה על הדיווח. \rלידיעתך,הטיפול בנתונים אלו מבוצע על ידי חברת Waze בלבד ואין ביכולתנו העורכים המתנדבים לתקנם. \rבמידה והינך לקוח עסקי של חברת וויז, נא לבדוק את הנתונים באתר יעודי : https://biz.waze.co.il. \rיש אפשרות לפנות אל התמיכה בנושא: ads_support@waze.com. \rכמו כן, ניתן לדווח בפורום הבא. יש לדווח מה המיקום השגוי ומהו המיקום הנכון במידה וידוע. https://www.waze.com/forum/viewforum.php?f=1545", // crayzee 03/01/2016
	"NotIdentified",
    
    
    //B15
    //"תחנת דלק חסרה או ניווט לא נכון לתחנה",
    //"שלום, \rתודה על הדיווח. \rכדי להוסיף ניווט אל תחנת הדלק דרושים פרטים נוספים על שם התחנה, החברה המפעילה, ומיקומה ביחס לדיווח. אפשר להוסיף פרטים בתשובה להודעה בתכנה או בפורום\r http://goo.gl/gMueVV הכללים לפתיחת הודעות בפורום נמצאים פה http://tinyurl.com/wazer. בנוסף, עורכי המפה יכולים רק להוסיף יעד לניווט, כדי להוסיף תחנה למערכת המחירים וחיפוש התחנות יש למלא פרטים בטופס הבא\r: http://tinyurl.com/wrong-gas-station",
    "ניווט משונה - 60 שניות יותר",
    "שלום ותודה על הדיווח,\r\rלפי נתוני המערכת, המסלול שהוצע, על אף היותו ארוך יותר , הינו מהיר יותר בכדקה, מאשר המסלול שבו התבצעה הנסיעה בפועל. אי- לכך, המסלול שהוצע על ידי וויז הינו תקין.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B16
    //    "דיווח על התראה שגויה",               
    //    "שלום, \rתודה על הדיווח. \rלתשומת לבך, פניות עדכון מפה מיועדות לדווח על בעיות הנוגעות לעדכון המפה החיה כגון: כתובת שגויה, קיום/אי קיום מצלמה במקום, הוראות ניווט הסותרות את המצב בשטח וכדו'. אולם אינן מיועדות לדיווח על אי נכונות התרעות מסוג: פקק תנועה, סכנה, משטרה, תאונת דרכים.",
    //    "NotIdentified",

    //B16
	"פניה לאחר פחות מ-200 מטר",
	"שלום ותודה על הדיווח,\r\rמאחר והמרחק בין הרחובות בהן נדרש לפנות הוא פחות מ-200 מטר, מתקבלת הנחיה של פניה מיידית.\r\rניתן להפעיל הנחיות קוליות הכוללות שמות רחובות (סיוון) באופן הבא:\rהגדרות --> שמע --> הנחיות קוליות --> עברית - סיון.\r\rכך ניתן יהיה לדעת לאיזה רחוב נדרש לפנות בדיוק.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
	 "NotIdentified",
    
    //B17
    "דיווח במקום לא נכון",
"שלום ותודה על הדיווח,\r\rנא לפתוח דיווח חדש באיזור בו ישנה בעיה, על-מנת שהבעיה תטופל על-ידי עורך מפה אשר מכיר היטב את האזור. \r\rלחלופין, ניתן לפתוח בקשה בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלהבא אנא עזרו לנו על-ידי צירוף פרטים על מהות הבעיה והתיקון הדרוש.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",    "NotIdentified",

    //B17
    "המפה כבר מעודכנת",
    "שלום ותודה על הדיווח,\r\rהנתונים שהעברת כבר מעודכנים במפה.\rנסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B18
    "קריסת תוכנה",
    "שלום ותודה על הדיווח,\r\rהבעיה המדווחת אינה קשורה לעדכון המפה.\r\rבאפשרותך לדווח על תקלת באפליקציה ישירות לחברה בקישור הבא:\rhttps://support.google.com/waze/answer/6276841\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",    
    "NotIdentified",

    //B19
    "מסלול תקין",
    "שלום ותודה על הדיווח,\r\rעל-פי נתוני נסיעתך, המסלול שהוצע על-ידי ווייז הינו מהיר/קצר יותר מהמסלול שבחרת לנסוע בו.\rאי-לכך, אין צורך בעדכון המפה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",

    //B20
    "ניווט לצד נכון של הרחוב",
    "שלום ותודה על הדיווח,\r\rנכון להיום, אפליקציית ווייז אינה תומכת בניווט לצד זוגי או אי-זוגי של הרחוב, אלא לנקודה הקרובה ביותר ליעד המבוקש.\rבמידה וקיימת הפרדה או אי תנועה בין הנתיבים, הניווט אינו לוקח זאת בחשבון.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",
    
    //B21
    "דיווח על צומת מרומזר",
    "שלום ותודה על העדכון. \rנכון להיום, המערכת אינה מחזיקה מידע לגבי מיקום רמזורים בצמתים. \rהאייקונים עם הרמזור שרואים בגרסאות החדשות של אייפון ואנדרואיד הנם התראות על מצלמות רמזור ישנות. \rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "NotIdentified",
	
	 //B22
	"הנחיית סיוון + המשך ישר",
	"שלום ותודה על הדיווח,\r\rבבדיקה, לא נמצאה שגיאת מפה. ייתכן והנחיות ניווט לא הובנו במלואן.\r\rכמו כן, בשלב זה, לא ניתנת הנחיית 'המשך ישר' פרט לכיכרות.\r\rעל אף האמור, ניתן להפעיל הנחיות קוליות הכוללות שמות רחובות (סיוון) באופן הבא:\rהגדרות --> שמע --> הנחיות קוליות --> עברית - סיון.\r\rכך ניתן יהיה לדעת לאיזה רחוב נדרש לפנות בדיוק.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
	 "NotIdentified",
    
    //D1
    "בירור כתובת",
    "שלום ותודה על הדיווח,\r\rמה הכתובת במקום בו דווחה הבעיה?\rהאם הניווט בוצע ממועדפים/הסטוריה?\r\rבמידה וכן, נסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Open",

    //D2
    "פניית פרסה - בירור",
    "שלום ותודה על התגובה,\r\rמאיזה כיוון לאיזה כיווון הוצע ביצוע פרסה?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //D3
    "כביש עפר - בירור",
    "שלום ותודה על הדיווח,\r\rהרחוב שדרכו הוצע הניווט הינו כביש עפר.\rניווט בכבישי עפר מתאפשר במידה וההגדרות במכשירך סומנו כך.\r\rהאם במכשירך מאופשר ניווט בדרכי עפר? ניתן לבדוק זאת בהגדרות --> ניווט --> כבישי עפר.\r\rנסיעה בכבישים אלו מיועדת לרכבים בעלי עבירות גבוהה.\rניתן לבחור בהגדרות 'הימנע מארוכים'. במצב זה הניווט יעבור דרך כבישי עפר עד 300 מטר.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //D4
    "דיווח על מצלמות - בירור",
    "שלום ותודה על הדיווח,\r\r1. האם מדובר במצלמה חדשה מסוג 'גאטסו' או במצלמה מהסוג הישן?\r2. באיזה כביש ממוקמת המצלמה ולאיזה כיוון נסיעה?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //D5
    "דרך חסומה",
    //"שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן השגיאה, נא לעדכן את הפרטים הבאים:\r\r1. איזו דרך חסומה?\r2. מאיזו נקודה לאיזו נקודה הדרך חסומה?\r3. האם החסימה היא זמנית או קבועה? אם החסימה זמנית - עד מתי?\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן השגיאה, נא לעדכן את הפרטים הבאים:\r\r1. איזו דרך חסומה?\r2. מאיזו נקודה לאיזו נקודה הדרך חסומה?\r3. האם החסימה היא זמנית או קבועה? אם החסימה זמנית - עד מתי?\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", // cafri 31/12/15
    "Open",

    //D6
    "ניווט שגוי - בדיקת מסלולים",
    "שלום ותודה על הדיווח,\r\r1. כאשר בחרת ביעד, האם בחרת מסלול מסוים מתוך שלושה שהוצעו או בחרת במסלול שנבחר אוטומטית?\r2. האם שינית את המסלול במהלך הניווט בניגוד להכוונה?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //D7
    "בירור יעד וניסוח",
    "שלום ותודה על הדיווח,\r\rמה היה היעד המבוקש? \rמה היה הניסוח המדויק של תוצאת החיפוש?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

    //D8
    "כיוון תנועה לא תקין - בירור",
    "שלום ותודה על הדיווח,\r\rהאם כיוון התנועה אינו תקין ברחוב בו נפתח הדיווח?\rבין אלו רחובות יש לעדכן את כיוון התנועה ולאיזה כיוון?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

	//D9
	"הקלטת כביש - השלמת עריכה",
	"שלום ותודה על הקלטת כביש חדש.\r\rבכדי שהכביש החדש יוצג על המפה נדרש לחברו לכבישים קיימים ולהשלים נתונים נוספים לגביו.\r\rבאפשרתך לבצע זאת בעצמך דרך עורך מפה בקישור אשר מופיע מטה (במידה וקיבלת הודעה זו במייל) או למסור פרטים נוספים ואחד מהעורכים המתנדבים ישלים את המלאכה.\r\rבמידה ובחרת באפשרות השניה אודה לך על השלמת הפרטים הבאים:\r\r1. שם של הרחוב\r2. האם הרחוב הוא דו סיטרי או חד סיטרי  ולאיזה כיוון?\r3. האם הכביש הוא סלול או זהו כביש עפר?\r4. מה המהירות המירבית המותרת ברחוב?\r\rלתשומת לבך, אין להשיב להודעה זו במייל.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",

	//D10
	"בירור שם משתמש + הגדרות",
	"שלום ותודה על הדיווח,\r\rלצורך המשך טיפול נא לעדכן את הפרטים הבאים:\r\r1. מהו שם המשתמש איתו נפתח דיווח זה?\r2. מהו סוג הניווט שנבחר במכשירך: מהיר ביותר או קצר ביותר?\r3. האם בחרת באפשרות הימנע מכבישים מהירים?\r4. האם בחרת באפשרות הימנע מכבישי אגרה?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",
	
	//D11
	"מהירות מירבית - בירור",
	"שלום ותודה על הדיווח,\r\rלצורך המשך טיפול נא לעדכן את הפרטים הבאים:\r\r1. מה המהירות המירבית המותרת בקטע שממנו נפתח הדיווח ולאיזה כיוון?\r2. האם היה תמרור המורה על המהירות שציינת והיכן  הוא היה (בערך)?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",   

	//C1
    "עדכון מהירות מירבית – בוצע",
    "שלום ותודה על הדיווח,\r\rהמהירות המירבית עודכנה בהתאם למידע שמסרת.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Solved",  

	//C2
    "עדכון שם רחוב – בוצע",
    "שלום ותודה על הדיווח,\r\rשם הרחוב עודכן.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

    //C3
    "עדכון פניות בצומת – בוצע",
    "שלום ותודה על הדיווח,\r\rהפניות האסורות בצומת עודכנו.\r\rעל-מנת שהעדכון יכנס לתוקף אצלך, בעוד יום-יומיים יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

    //C4
    "עדכון כיוון תנועה – בוצע",
    "שלום ותודה על הדיווח,\r\rכיוון התנועה ברחוב עודכן.\r\rעל-מנת שהעדכון יכנס לתוקף אצלך, בעוד יום-יומיים יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

    //C5
    "ניווט שגוי - בוצע תיקון בצומת",
    "שלום ותודה על הדיווח,\r\rבבדיקה, זוהתה ותוקנה בעיה בצורת הצומת במקום.\r\rעל-מנת שהעדכון יכנס לתוקף אצלך, בעוד יום-יומיים יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

    //C6
    "כיכר חסרה - הוספת כיכר בוצעה",
    "שלום ותודה על הדיווח,\r\rבבדיקה, זוהתה ותוקנה בעיה והוספה כיכר במקום.\r\rעל-מנת שהעדכון יכנס לתוקף אצלך, בעוד יום-יומיים יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

    //C7
    "מספרי בתים - תוקן",
    "שלום ותודה על הדיווח,\r\rבבדיקה, זוהה מספור בתים שגוי ותוקן.\r\rעל-מנת שהעדכון יכנס לתוקף אצלך, בעוד יום-יומיים יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "Solved",

     //C8
    "פרסום שגוי - תוקן",
	"שלום,\r בהמשך לפנייתך, נשלחה בקשת תיקון לצוות התמיכה. השגיאה טופלה והמפה עודכנה.\r\rהעדכון יכנס לתוקף בעוד יום-יומיים, יש לבצע עדכון מפה על-ידי:\rכניסה להגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה במכשיר אנדרויד או לבצע חיפוש מחדש ולבחור תוצאה ללא סמל של שעון.\r\rבמידה והבעיה עדיין קיימת, אנא דווחו שנית והוסיפו פרטים שיעזרו בזיהוי הבעיה.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.", //crayzee 03/01/2016
	"Solved",
	
	
	
    //Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
    //1 - Done
    "General error - שגיאה כללית", 
    //"שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח.\r\rאנא רשמו לנו מידע נוסף על הבעיה, ומה לפי היכרותך בשטח צריך להיות במקום בו העלית את הבעיה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rאו פנו לתמיכה:\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לכם בכל נושא שאינו קשור בעדכון המפה.\r\rבעתיד, יש לרשום מידע נוסף בשדה 'פרטים נוספים' בעת דיווח על טעות במפה, על-מנת לעזור למנהלי האזור לתקן את המפה בצורה המהירה ביותר.\r\rבנוסף, נסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rכך תסתנכרן המפה במכשיר אל מול המפה המעודכנת.\rמומלץ לחזור על פעולה זו אחת לשבוע.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח.\r\rאנא רשמו לנו מידע נוסף על הבעיה, ומה לפי היכרותך בשטח צריך להיות במקום בו העלית את הבעיה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rאו פנו לתמיכה:\rhttp://www.waze.co.il/support\r\rשם יוכלו לעזור לכם בכל נושא שאינו קשור בעדכון המפה.\r\rבעתיד, יש לרשום מידע נוסף בשדה 'פרטים נוספים' בעת דיווח על טעות במפה, על-מנת לעזור למנהלי האזור לתקן את המפה בצורה המהירה ביותר.\r\rבנוסף, נסו לבצע רענון מפה במכשיר:\rהגדרות --> תצוגה ומפה --> העברת נתונים --> רענן מפה.\r\rכך תסתנכרן המפה במכשיר אל מול המפה המעודכנת.\rמומלץ לחזור על פעולה זו אחת לשבוע.\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 31/12/15
    "Open",

    //2- Done
    "Incorrect turn - פניה שגויה", 
    //"שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן השגיאה, נא לעדכן את הפרטים הבאים:\r1. מה שגוי בפניה? למשל: יש לאפשר פניה, יש לאסור פניה, הוראות הניווט בפניה שגויות.\r2. תיאור הפניה: מהיכן (רחוב ו/או כיוון) להיכן (רחוב ו/או כיוון)\r\rבמידה ומדובר בשגיאה בניווט, נא לעדכן את הפרטים הבאים:\r1. מהיכן נסעת ולאן?\r2. מה הייתה שגיאת הניווט?\r\rללא המידע החסר, לא ניתן לטפל בבקשה ולכן היא מועמדת לסגירה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן השגיאה, נא לעדכן את הפרטים הבאים:\r1. מה שגוי בפניה? למשל: יש לאפשר פניה, יש לאסור פניה, הוראות הניווט בפניה שגויות.\r2. תיאור הפניה: מהיכן (רחוב ו/או כיוון) להיכן (רחוב ו/או כיוון)\r\rבמידה ומדובר בשגיאה בניווט, נא לעדכן את הפרטים הבאים:\r1. מהיכן נסעת ולאן?\r2. מה הייתה שגיאת הניווט?\r\rללא המידע החסר, לא ניתן לטפל בבקשה ולכן היא מועמדת לסגירה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 31/12/12
    "Open",

    //3 - Done
    "Incorrect route - מסלול שגוי", 
    //"שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן את שגיאת הניווט, נא לעדכן את הפרטים הבאים:\r1. מהיכן נסעת ולאן?\r2. מה הייתה שגיאת הניווט?\r\rללא המידע החסר, לא ניתן לטפל בבקשה ולכן היא מועמדת לסגירה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rלצערנו, לא הצלחנו לזהות את הבעיה במקום הדיווח. על מנת שנוכל להבין ולתקן את שגיאת הניווט, נא לעדכן את הפרטים הבאים:\r1. מהיכן נסעת ולאן?\r2. מה הייתה שגיאת הניווט?\r\rללא המידע החסר, לא ניתן לטפל בבקשה ולכן היא מועמדת לסגירה.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 31/12/15
    "Open",

    //4 - Done
    "Missing roundabout - כיכר חסרה", 
    //"שלום ותודה על הדיווח,\r\rבהקלטות הנסיעה באזור לא זוהתה כיכר. על-מנת למנוע טעויות, נא לציין את שמות הכבישים הנפגשים בכיכר.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rבהקלטות הנסיעה באזור לא זוהתה כיכר. על-מנת למנוע טעויות, נא לציין את שמות הכבישים הנפגשים בכיכר.\r\rבאפשרותך:\r- לעדכן את הבקשה לפני סגירתה על-ידי מענה להודעה זו מתיבת ההודעות באפליקציה, לא מהמייל\r- לפתוח בקשה בפורום\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 31/12/15
    "Open",

    //5 -Done
    "Missing Road - כביש חסר", 
    //"שלום ותודה על הדיווח,\r\rבווייז המשתמשים מקליטים כבישים חדשים. יש להעביר את האפליקציה למצב הקלטה על-ידי לחיצה על דיווח --> בעיה במפה --> הקלט כביש.\r\rתוך כדי נסיעה, הכביש החדש יופיע על צג המכשיר: תחילה בצבע כחול, ולאחר שיאספו מספיק נתונים - בצבע אדום.\rיש להמשיך עד החזרה לכביש שמופיע על המפה ועד אשר כל הקטעים אדומים.\r\rללא חיבור לאינטרנט, ההקלטה לא תגיע לשרת!\r\rלאחר מספר ימים תופענה ההקלטות בעורך המפה.\rיש לעדכן את פרטי הכביש בעורך המפה תוך 30 יום מהקלטתו, אחרת ימחק אוטומטית.\r\rאפשר להשלים את התהליך לבד או לבקש עדכון בפורום:\rhttp://www.waze.co.il/forum/viewforum.php?f=27\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//crayzee 16/03/15
    "שלום ותודה על הדיווח,\r\rבווייז המשתמשים מקליטים כבישים חדשים. יש להעביר את האפליקציה למצב הקלטה על-ידי לחיצה על דיווח --> בעיה במפה --> הקלט כביש.\r\rתוך כדי נסיעה, הכביש החדש יופיע על צג המכשיר: תחילה בצבע כחול, ולאחר שיאספו מספיק נתונים - בצבע אדום.\rיש להמשיך עד החזרה לכביש שמופיע על המפה ועד אשר כל הקטעים אדומים.\r\rללא חיבור לאינטרנט, ההקלטה לא תגיע לשרת!\r\rלאחר מספר ימים תופענה ההקלטות בעורך המפה.\rיש לעדכן את פרטי הכביש בעורך המפה תוך 30 יום מהקלטתו, אחרת ימחק אוטומטית.\r\rאפשר להשלים את התהליך לבד או לבקש עדכון בפורום:\rhttps://www.waze.com/forum/viewforum.php?f=1546\r\rניתן לקרוא את הכללים לפתיחת הודעות בפורום כאן:\rhttp://tinyurl.com/wazer\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",//cafri 31/12/15
    "Open",

   //6
    "Incorrect address - כתובת שגויה",
    "שלום ותודה על הדיווח, \r\rביכולתך לעדכן את כתובת היעד במספר דרכים:\r\r1. להוסיף מקום חדש (עסק, נקודת עניין, מגורים) דרך מכשירך. האפשרות זמינה בלחיצה על דיווח --> מקום. מדריך מפורט נמצא בקישור הבא: http://tinyurl.com/wazep. \r2. להסביר בתשובה חוזרת על מיקומי הבתים החסרים, הקפד להשתמש בכיוונים של שושנת הרוחות ולא ימין/שמאל.\r3. באם קיבלת את ההודעה בדוא''ל, ביכולתך לעדכן בעצמך את מספרי הבתים דרך עורך המפה בקישור המופיע מטה. \r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",          //"שלום, \rביכולתך לעדכן בעצמך את מספרי הבתים דרך עורך המפה בכתובת \r<פרמלינק כאן> \r \rלחלופין ביכולתך להסביר בתשובה חוזרת על מיקומי הבתים החסרים, הקפד להשתמש בכיוונים של שושנת הרוחות ולא ימין/שמאל. \rתודה על הדיווח.",//crayzee 16/03/15
    "Open",


    //7
    "Missing landmark - ציון דרך חסר",
    "שלום ותודה על הדיווח,\r\rבאפשרותך להוסיף מקום חדש (עסק, נקודת עניין, מגורים) דרך מכשירך. האפשרות זמינה בלחיצה על דיווח --> מקום.\rניתן לצרף תמונה של המקום ופרטים נוספים (שעות פעילות, מספרי טלפון, קישור לאתר וכו').\rהדיווח ייבדק על ידי עורכי המפה, ובמידה והנתונים תקינים, תאושר הוספת המקום והמפה תעודכן תוך יום-יומיים.\r\rבמידה וברצונך להוסיף תמונה למקום (חדש או קיים) יש לוודא כי:\r1. התמונה היא תמונת חוץ של המקום.\r2. התמונה חדה ומוארת היטב.\r3. בתמונה לא מופיעים אנשים אותם ניתן לזהות על-פי פניהם.\r4. בתמונה לא מופיעים רכבים אותם ניתן לזהות לפי מספר רכב.\r\rמדריך מפורט נמצא בקישור הבא:\rhttp://tinyurl.com/wazepp\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",      
    "Open",    

    //8
    "Wrong driving direction - כיוון נסיעה שגוי",
    "",
    "Open",    
    
    //9
    "Speed limit - הגבלת מהירות",
	"שלום ותודה על הדיווח,\r\rלצורך המשך טיפול נא לעדכן את הפרטים הבאים:\r\r1. מה המהירות המירבית המותרת בקטע שממנו נפתח הדיווח ולאיזה כיוון?\r2. האם היה תמרור המורה על המהירות שציינת והיכן  הוא היה (בערך)?\r\rלידיעתך, המפה מנוהלת על-ידי עורכים מתנדבים ולא על-ידי החברה עצמה.",
    "Open",    


    /*    "כיוון נסיעה שגוי",
    "",
    "Open",   
*/
    "<br>",
    "",
    "",
    //End of Default URs  


];

    //end IsraeliHebrew list