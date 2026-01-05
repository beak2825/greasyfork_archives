// ==UserScript==
// @name         FASTudents Achieve / Parcours vers la réussite Rapide
// @namespace    http://pierresarazin.com
// @version      0.1
// @description  Speeds up grade book data entry / Accélère l'entrée de notes dans le PVR.
// @author       Pierre Sarazin, pierre.sarazin@gmail.com
// @match        https://*/SASTeacherWeb/Forms/StudentTask/StudentTaskMarksByTaskAjaxIFrame.aspx*
// @grant        none
// @require
// @downloadURL https://update.greasyfork.org/scripts/9208/FASTudents%20Achieve%20%20Parcours%20vers%20la%20r%C3%A9ussite%20Rapide.user.js
// @updateURL https://update.greasyfork.org/scripts/9208/FASTudents%20Achieve%20%20Parcours%20vers%20la%20r%C3%A9ussite%20Rapide.meta.js
// ==/UserScript==


$('<style>.found{background-color:yellow;} .onlyOne{font-size:2em;} .grey{opacity: 0;}</style>').appendTo('BODY');
$('<div id="consoleBG" style="z-index:2;padding-left:10px;background-color:rgba(0,0,0,0.5);display:true;width:100%;height:25px;position:fixed;bottom:0px;left:0px;color:#0AFF0A;font-family:Courier, monospace;font-size:20px;line-height:25px;">fast ></div>').appendTo('BODY');
$('<textarea id="console" style="z-index:3;border:none;outline:0px solid transparent;padding-left:90px;background-color:transparent;display:true;width:100%;height:25px;position:fixed;bottom:0px;left:0px;color:#0AFF0A;font-family:Courier, monospace;font-size:20px;line-height:25px;"></textarea>').appendTo('BODY');
$(document).bind('keydown',function(e){
    if(e.currentTarget==document && e.target==document.body)
    {
        if(e.keyCode==27 || (e.keyCode>=48 && e.keyCode<=90))
        	$('#console').focus();
        else if(e.keyCode==8 || e.keyCode==9)
            e.preventDefault();
	}
});

var $parentRow=$('.DataGrid tr:eq(0)');
var cols={lName:$parentRow.find('th').index($('#LN')),fName:$parentRow.find('th').index($('#FN'))};
var keys={};
var highlightedRows=[];
var noteStart=1;
var beforeString="";
///Build dictionary
$('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').each(function(i,row)
                        {
                            $row=$(row);
                            lName=$row.find('td:eq('+cols.lName+')').text().toLowerCase();
                            fName=$row.find('td:eq('+cols.fName+')').text().toLowerCase();
                            if(keys[lName] === undefined)
                                keys[lName]=[];
                            if(keys[fName] === undefined)
                                keys[fName]=[];
                            keys[lName].push($row);
							keys[fName].push($row);
                        });
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
$('#console').bind('keyup',
                function(e)
				{
                    if(e.keyCode==13)//Submit notes or cancel
                    {
                        if(highlightedRows.length!==0)
	                        highlightedRows.find('td.found').removeClass('found').removeClass('onlyOne');
                        $('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').find('td').removeClass('grey');
                        $('#console').val('').focus();
                        processUnsavedRows(true);
                        e.preventDefault();
                        noteStart=1;
                    }
                    else
                    {
                        var query=$('#console').val().trim().toLowerCase();
                        if(query.match(/[1234]$/))
                        {
                        	if(e.keyCode==40 || e.keyCode==37)
                                $('#console').val(query+'-');
                            else if(e.keyCode==38 || e.keyCode==39)
                                $('#console').val(query+'+');
                        }
                        else if((query.match(/[1234]\-$/) && (e.keyCode==38 || e.keyCode==39)) || (query.match(/[1234]\+$/) && (e.keyCode==40 || e.keyCode==37)))
                        {
                        	$('#console').val(query.substring(0,query.length-1));
                        }
                        query=$('#console').val().trim().toLowerCase();
                        
                        if(query.match(/[1234ri\+\-][1234ri]$/))//Allow entry of consecutive numbers as grades
                        {
                       		$('#console').val(query.substring(0,query.length-1)+' '+query.substring(query.length-1,query.length));
                            query=$('#console').val().trim().toLowerCase();
                        }
                        if(e.keyCode>=37 && e.keyCode<=40)
                        {
                            e.stopPropagation();
	                        e.preventDefault();
                        }
                        
                        query=$('#console').val().trim().toLowerCase();
                        
                        var queries=query.split(/\s+/);
                        var originalQueryLength=queries.length;
                        var removeQueries=beforeString.split(/\s+/);
                      	while(queries.length<removeQueries.length)//Pad to overwrite what was there in the past
                        	queries.push("");
      
                        if(query.length<2)//Not enough info, consider the row empty
                        {
                            if(highlightedRows.length!==0)
		                        highlightedRows.find('td.found').removeClass('found').removeClass('onlyOne');
                            $('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').find('td').removeClass('grey');
                            noteStart=1;
                            return;
                        }
                        else
                        {
                            if(highlightedRows.length!==0)
		                        highlightedRows.find('td.found').removeClass('found').removeClass('onlyOne');
                            
                            $('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').find('td').removeClass('grey');
                            
                            noteStart=0;
                            $.each(queries,function(query_i,query)
                            {
                                highlightedRows=$('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').has('td.found');
                                
                                if(query.length>=2 && query.match(/[^1234\-\+ri]/) && (query_i<noteStart || noteStart===0))//Valid grade
                                {
                                   for(var key in keys)
                                   {
                                       if(key.match(query))
                                       {
                                           $.each(keys[key],function(i,e)
                                           {
                                               if(highlightedRows.length!==0)//matched on more than one key, find all the ones that matched on another one
                                                   e.find('td.found').removeClass('found').addClass('found2');                                                                  
                                               else
                                                   e.find('td').removeClass('grey').addClass('found');
                                           });  
                                       }
                                   }
                                   //If we've narrowed the search down (we matched on more than one key...we have a bunch of rows tagged found, found2. Delete all tagginhs that are only found. Then flip all found2 back to found for next series
                                    if(highlightedRows.length!==0)
                                    {
                                        $('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').find('td.found').removeClass('found');//.addClass('grey');
                                        $('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').find('td.found2').addClass('found').removeClass('found2');
                                    }                                    
                                    highlightedRows=$('.DataGrid_Row, .DataGrid_Row_Alt, .DataGrid_Row_Save, .DataGrid_Row_Changed').has('td.found');
                                }
                                else if(!query.match(/[^1234\-\+ri]/) && query.length>0 && noteStart===0)
                                {
                                    noteStart=query_i;                                  
                                }
                            });
                            if(highlightedRows.length==1)
                            {
                                highlightedRows.find('td').addClass('onlyOne');
                                highlightedRows.siblings().find('td').addClass('grey');
                            }                               
                        }
                        if(queries.length>noteStart && highlightedRows.length==1)//have at least one grade & one active row
                        {
                            var col=0;
                            $.each(queries,function(query_i,query)
                                   {
                                       if(query_i<noteStart)//things that aren't grades
                                            return;                                        
                                        highlightedRows.find('SELECT').each(function(i,e){
                                            if(i == col)
                                            {
                                                $e=$(e);
                                                $e.val($e.find('option').filter(function(i,e) {
                                                    return $(e).text().toLowerCase() == query.toLowerCase(); 
                                                }).val());
                                                //Trigger so SA realises the data has been changed and needs to be saved
                                                var evt=new Event();evt.type='focus';evt.srcElement=e;evt.forcedTargetObject=e;
                                                F(evt,true);
                                                $e.trigger('blur');
                                                $e.trigger('change');
                                            }                                           
                                        });
                                       col++;
                                   });
                        }
                    }
                }).bind('keydown',function(e)
                        {
                            if (e.keyCode==8)//Need trailing empty to properly treat deleting elements
                                beforeString=$('#console').val().trim().toLowerCase();                            	
                            else
                                beforeString="";
                            if(e.keyCode>=37 && e.keyCode<=40 || e.keyCode==9)
                            {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        });
