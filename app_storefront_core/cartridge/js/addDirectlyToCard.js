'use strict';

var util = require('./util');
var dialog = require('./dialog');

/**
 * @description Make the AJAX request to add an item to cart directly
 * @param {Event} event then event element for stopping default behaviour of form
 * @returns {Promise}
 */

var addDirectlyToCard = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var productID = document.dwfrm_fastSearch.dwfrm_fastSearch_productID.value;
    var url = util.appendParamToURL(Urls.checkProductExists, "pid", productID);
    url = util.ajaxUrl(url);

    $.ajax({
        url,
        type: "GET",
        crossDomain: true,
        complete: function (data) {
            if (data.readyState == '4' && data.status == '200') {
                var response = data.responseJSON;
                if (response.status === 'ADDED_TO_CART') {
                    window.location.href = response.redirectTo;
                } else if ( response.status === "PRODUCT_NOT_FOUND" || 
                            response.status === "PRODUCT_IS_MASTER" || 
                            response.status === "PRODUCT_NOT_IS_STOCK") {
                    dialog.open({
                        html: `<h2>${response.statusText}</h2>`
                    })
                }
            } else {
                dialog.open({
                    html: `<h2>${data.statusText}</h2>`
                })
            }
        }
    })
    return false;
}

module.exports = addDirectlyToCard
