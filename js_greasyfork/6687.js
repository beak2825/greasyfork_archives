// ==UserScript==
// @name         Resque multiselect
// @namespace    resque
// @homepage     https://github.com/timo-p/userscripts/tree/master/resque-multiselect
// @version      0.3
// @description  Select multiple failed jobs at once in resque web
// @author       timo-p
// @match        */resque/failed*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6687/Resque%20multiselect.user.js
// @updateURL https://update.greasyfork.org/scripts/6687/Resque%20multiselect.meta.js
// ==/UserScript==

var $selectAll = $('<input type="submit" onclick="return false;" value="Select all"></input>');
var $selectByClass = $('<input type="submit" onclick="return false;" value="Select all by class"></input>');
var $retrySelected = $('<input type="submit" onclick="return false;" value="Retry selected"></input>');
var $removeSelected = $('<input type="submit" onclick="return false;" value="Remove selected"></input>');
var $retryAndRemoveSelected = $('<input type="submit" onclick="return false;" value="Retry and remove selected"></input>');
var $progress = $('<span style="display: none;"></span>');

var processSelected = function(type){
    var $elems = $('input.multiselect:checked');
    if (type == 'retry')
    {
        $elems = $elems.filter(function(){
            var $elem = $(this);
            return $elem.data('retry') ? true : false;
        });
    }

    if ($elems.length > 0)
    {
        $retrySelected.attr('disabled', true);
        $removeSelected.attr('disabled', true);
        $retryAndRemoveSelected.attr('disabled', true);

        $elems.sort(function(a, b){
            var $a = $(a);
            var $b = $(b);
            if ($a.data('id') == $b.data('id'))
                return 0;

            return $a.data('id') < $b.data('id') ? 1 : -1;
        });

        var pickType = type == 'retry_and_remove' ? 'retry' : type;
        var urls = [];
        $elems.each(function(i, elem){
            $elem = $(elem);
            if ($elem.data(pickType))
              urls.push($elem.data(pickType));
        });

        if (type == 'retry_and_remove')
        {
            $elems.each(function(i, elem){
                $elem = $(elem);
                urls.push($elem.data('remove'));
            });
        }

        var counter = 0,
            count = urls.length;
        
        $progress.show();
        var doRequest = function(url){
            counter++;
            $progress.html('Request '+counter+' of '+count);
            $.get(url, function(){
                if (urls.length > 0)
                    doRequest(urls.shift());
                else
                    window.location.reload();
            });
        };
        doRequest(urls.shift());
    }
};

$selectAll.click(function(){
    var $elem = $(this);
    var checked = $elem.data('select-all') ? ':checked' : ':not(:checked)';
    $elem.data('select-all', $elem.data('select-all') ? false : true);
    $('input.multiselect'+checked).click();
});
$selectByClass.click(function(){
	var klass = prompt("Class to select");
    $('input.multiselect:checked').click();
    if (klass === null || klass.length == 0)
        return;

    klass = klass.replace(/\\/g, '\\');
    
    $('[href*=/resque/failed/?class='+klass+']').each(function(i, elem){
        $(elem).closest('li').find('input.multiselect:not(:checked)').click();
    });
});
$removeSelected.click(function(event){
    processSelected('remove');
});
$retrySelected.click(function(event){
    processSelected('retry');
});
$retryAndRemoveSelected.click(function(event){
    processSelected('retry_and_remove');
});

var $form = $('<form></form>');
$form.append($selectAll).append($selectByClass).append($retrySelected).append($removeSelected).append($retryAndRemoveSelected).append('<br/>').append($progress);
$('#main > h1').after($form);

$('div.controls,div.retried').each(function(){
    var $e = $(this);
    var $checkbox = $('<input type="checkbox" class="multiselect" style="float: right;margin-left:10px;"></input>');
    var $retry = $e.find('a[rel=retry]');
    var $remove = $e.find('a[rel=remove]');
    var domain = window.location.protocol+'//'+window.location.host;
    var id = parseInt($remove.attr('href').match(/\d+$/)[0], 10);
    $checkbox.data('remove', domain+$remove.attr('href')).data('id', id);
    if ($retry.length > 0)
        $checkbox.data('retry', domain+$retry.attr('href'));

    $e.before($checkbox);
});
