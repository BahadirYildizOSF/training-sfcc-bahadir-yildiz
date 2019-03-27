'use strict';

var util = require('./util');
var dialog = require('./dialog');

/**
 * @description Make the AJAX request to add an item to cart directly
 * @param {Event} event then event element for stopping default behaviour of form
 * @returns {boolean}
 */

var addDirectlyToCard = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var productID = $('input[name$="_productID"]').val();

    if (productID === '') {
        dialog.open({
            html: '<h2>' + Resources.VALIDATE_FASTSEARCH_INPUT_EMPTY + '<h2>'
        });
    } else {
        var url = util.appendParamToURL(Urls.checkProductExists, 'pid', productID);
        url = util.ajaxUrl(url);

        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            complete: function (data) {
                if (data.readyState == '4' && data.status == '200') {
                    var response = data.responseJSON;
                    if (response.status === 'PRODUCT_ADDED_TO_CART') {
                        window.location.href = response.redirectTo;
                    } else if (['PRODUCT_NOT_FOUND', 'PRODUCT_IS_MASTER', 'PRODUCT_NOT_IN_STOCK', 'PRODUCT_NOT_ADDED_TO_CART'].includes(response.status)) {
                        dialog.open({
                            html: '<h2>' + response.statusText + '</h2>'
                        })
                    }
                } else {
                    dialog.open({
                        html: '<h2>' + data.status + ': ' + data.statusText + '</h2>'
                    })
                }
            }
        })
    }

    return false;
}

module.exports = addDirectlyToCard
