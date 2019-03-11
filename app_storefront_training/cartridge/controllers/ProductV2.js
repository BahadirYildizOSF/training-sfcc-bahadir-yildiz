'use strict';

/**
 * Controller that renders product detail pages and snippets or includes used on product detail pages.
 * Also renders product tiles for product listings.
 *
 * @module controllers/ProductV2
 */

var params = request.httpParameterMap;

/* Script Modules */
var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

var ProductMgr = require('dw/catalog/ProductMgr');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var CatalogMgr = require('dw/catalog/CatalogMgr');

function show() {
    var product = ProductMgr.getProduct(params.pid.stringValue);
    var primaryCategory = product.getPrimaryCategory();
    var psm = new ProductSearchModel();
    psm.setCategoryID(primaryCategory.getID());
    psm.setSortingRule(CatalogMgr.getSortingRule("price-low-to-high"));
    psm.search();
    var searchHits = psm.getProducts();

    ISML.renderTemplate("productv2", {
        Product: product,
        pid: params.pid.stringValue,
        searchHits: searchHits
    });
}

exports.Show = guard.ensure(["get"], show);