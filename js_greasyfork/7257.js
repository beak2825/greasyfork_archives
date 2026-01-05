// ==UserScript==
// @name         Books.ru mark buyed.
// @namespace    http://apkawa.org/
// @version      0.3
// @description  Показываем в каталоге отметку, если уже покупали.
// @author       You
// @match        http://www.books.ru/
// @include      http://www.books.ru/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/7257/Booksru%20mark%20buyed.user.js
// @updateURL https://update.greasyfork.org/scripts/7257/Booksru%20mark%20buyed.meta.js
// ==/UserScript==

var StorageWrapper = function () {
     this._prefix = 'BooksRu_'
     var self = this
     var unsafeWindow = this['unsafeWindow'] || window;
     self._storage = unsafeWindow.localStorage
     self.set = function (key, value){
         self._storage.setItem(self._prefix + key, value);
     }
     
     self.get = function (key) {
         return self._storage.getItem(self._prefix + key);
     }
}

var storage = new StorageWrapper()

var update = function () {
    
    
    $.get("http://www.books.ru/member/orders/", function (data) {
    
    $(data).find("a[href^='http://www.books.ru/order.php?order=']").each(function (i, el) {
    
        $.get(el.href, function (data) {
    
            $(data).find("p.title > a[href^='/books/']").each(function (_i, book_el) {
                storage.set(book_el.pathname, true)
                storage.set("is_updated_v2", true)
            })
        });
        
    })
    });
}

http://www.books.ru/cart_add.php?product=3643709&currency_id=1&any_price=1

$(function () {
    if (! storage.get("is_updated_v2")) {
        update()
    }
    $("td.opinions > p > a[href^='/books/']").each(function (i, el) {
        var path = el.pathname
       	var _id = path.match(/\d+/)[0]
        if (storage.get(el.pathname)) {
            console.log(el.pathname);    
            $(el).after("<p>already buyed</p>");
        }
        
        $(el).before('<span class="yspan_any"><input type="text" id="a_text1" class="popuptext" value="1">&nbsp;</span>');
        $(el).attr("data-id", _id);
        $(el).off().on('click', function () {
            var _el = $(this);
            $.ajax(
                {
                    method: "GET",
                    url: "http://www.books.ru/cart_add.php?product=" + _id + "&currency_id=1&any_price=1", 
                    success: function (data) { 
                        _el.replaceWith('<a href="/cart.php" title="перейти в корзину"><img src="/static/images/buttons/goto-basket-mini.gif" alt="перейти в корзину" title="перейти в корзину"></a>');
                        return false;
                    }
                }
                    )
            return false;
        });
        
        
    });
    
    
});
