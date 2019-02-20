'use strict';

/**
 * Controller that renders product detail pages and snippets or includes used on product detail pages.
 * Also renders product tiles for product listings.
 *
 * @module controllers/ProductV2
 */

var params = request.httpParameterMap;

/* Script Modules */
const ISML = require('dw/template/ISML');
const guard = require('app_storefront_controllers/cartridge/scripts/guard');

const ProductMgr = require('dw/catalog/ProductMgr');
const ProductSearchModel = require('dw/catalog/ProductSearchModel');
const PagingModel = require('dw/web/PagingModel');

function show(){
    let product = ProductMgr.getProduct(params.pid.stringValue);
    let primaryCategory = product.getPrimaryCategory();
    let psm = new ProductSearchModel();
    psm.setCategoryID(primaryCategory.getID());
    psm.search();
    let searchHits = psm.getProductSearchHits();

    ISML.renderTemplate("productv2", {
        Product: product,
        pid: params.pid.stringValue,
        searchHits: searchHits
    });
}

exports.Show = guard.ensure(["get"], show);