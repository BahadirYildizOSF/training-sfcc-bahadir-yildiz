'use strict';

var dialog = require('app_storefront_core/cartridge/js/dialog'),
    productStoreInventory = require('app_storefront_core/cartridge/js/storeinventory/product'),
    tooltip = require('app_storefront_core/cartridge/js/tooltip'),
    util = require('app_storefront_core/cartridge/js/util'),
    addToCart = require('app_storefront_core/cartridge/js/pages/product/addToCart'),
    availability = require('app_storefront_core/cartridge/js/pages/product/availability'),
    image = require('app_storefront_core/cartridge/js/pages/product/image'),
    productNav = require('app_storefront_core/cartridge/js/pages/product/productNav'),
    productSet = require('app_storefront_core/cartridge/js/pages/product/productSet'),
    recommendations = require('app_storefront_core/cartridge/js/pages/product/recommendations'),
    variant = require('app_storefront_core/cartridge/js/pages/product/variant');

/**
 * @description Initialize product detail page with reviews, recommendation and product navigation.
 */
function initializeDom() {
    productNav();
    recommendations();
    tooltip.init();
}

/**
 * @description Initialize event handlers on product detail page
 */
function initializeEvents() {
    var $pdpMain = $('#pdpMain');

    addToCart();
    availability();
    variant();
    image();
    productSet();
    if (SitePreferences.STORE_PICKUP) {
        productStoreInventory.init();
    }

    // Add to Wishlist and Add to Gift Registry links behaviors
    $pdpMain.on('click', '[data-action="wishlist"], [data-action="gift-registry"]', function (e) {
        if (customer.isAuthenticated()) {
            var data = util.getQueryStringParams($('.pdpForm').serialize());
            if (data.cartAction) {
                delete data.cartAction;
            }
            var url = util.appendParamsToUrl(this.href, data);
            this.setAttribute('href', url);
        } else {
            e.stopPropagation()
            e.preventDefault();
            dialog.open("Are you even a human?");
        }
    });

    // product options
    $pdpMain.on('change', '.product-options select', function () {
        var salesPrice = $pdpMain.find('.product-add-to-cart .price-sales');
        var selectedItem = $(this).children().filter(':selected').first();
        salesPrice.text(selectedItem.data('combined'));
    });

    // prevent default behavior of thumbnail link and add this Button
    $pdpMain.on('click', '.thumbnail-link, .unselectable a', function (e) {
        e.preventDefault();
    });

    $('.size-chart-link a').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            url: $(e.target).attr('href')
        });
    });
}

var product = {
    initializeEvents: initializeEvents,
    init: function () {
        initializeDom();
        initializeEvents();
    }
};

module.exports = product;
