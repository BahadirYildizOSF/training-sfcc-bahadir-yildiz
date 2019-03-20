var ISML = require('dw/template/ISML');
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var app = require("app_storefront_controllers/cartridge/scripts/app");
var r = require('app_storefront_controllers/cartridge/scripts/util/Response');
var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var params = request.httpParameterMap;

function start() {
    var fastSearchForm = session.forms.fastSearch;
    fastSearchForm.clearFormElement();
    ISML.renderTemplate("search/fastsearch", {
        ContinueURL: dw.web.URLUtils.https('FastSearch-HandleForm')
    });
}

function HandleForm() {
    var ProductModel = app.getModel('Product');
    var result = {};
    try {
        var product = ProductMgr.getProduct(params.pid.stringValue);
        if (product === null) {
            throw new Error(JSON.stringify({ status: "PRODUCT_NOT_FOUND", statusText: Resource.msgf("product.notFound", "training", null, params.pid.stringValue) }));
        } else if (product.master) {
            throw new Error(JSON.stringify({ status: "PRODUCT_IS_MASTER", statusText: Resource.msgf("product.isMaster", "training", null, product.getName()) }));
        }
        var availability = ProductModel.get(product).getAvailability(1);
        if (!availability.inStock) {
            throw new Error(JSON.stringify({ status: "PRODUCT_NOT_IN_STOCK", statusText: Resource.msgf("product.notInStock", "training", null, product.getName()) }));
        }
        app.getModel('Cart').goc().addProductToCart();
        result.status = "ADDED_TO_CART";
        result.redirectTo = URLUtils.url("Cart-Show").toString();
    } catch (error) {
        result = JSON.parse(error.message);
    } finally {
        r.renderJSON(result);
    }
}

exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["get"], HandleForm);