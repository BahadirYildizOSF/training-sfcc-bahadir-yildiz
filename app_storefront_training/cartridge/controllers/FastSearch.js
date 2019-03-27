var ISML = require('dw/template/ISML');
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var app = require("app_storefront_controllers/cartridge/scripts/app");
var r = require('app_storefront_controllers/cartridge/scripts/util/Response');
var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var Logger = require('dw/system/Logger');

function start() {
    var fastSearchForm = session.forms.fastSearch;
    fastSearchForm.clearFormElement();
    ISML.renderTemplate("search/fastsearch", {
        ContinueURL: dw.web.URLUtils.https('FastSearch-HandleForm')
    });
}

function HandleForm() {
    var ProductModel = app.getModel('Product');
    var params = request.httpParameterMap;
    var result = false;
    try {
        var product = ProductMgr.getProduct(params.pid.stringValue);

        if (product === null) {
            result = {
                status: "PRODUCT_NOT_FOUND",
                statusText: Resource.msgf("product.notFound", "training", null, params.pid.stringValue)
            };
        } else {

            if (product.master) {
                result = {
                    status: "PRODUCT_IS_MASTER",
                    statusText: Resource.msgf("product.isMaster", "training", null, product.getName())
                };
            }
            var availability = ProductModel.get(product).getAvailability(1);

            if (!availability.inStock && !result) {
                result = {
                    status: "PRODUCT_NOT_IN_STOCK",
                    statusText: Resource.msgf("product.notInStock", "training", null, product.getName())
                };
            }

            if (!result) {
                var Cart = app.getModel('Cart');
                var cartStatus = Cart.goc().addProductToCart();

                if (!cartStatus) {
                    result = {
                        status: "PRODUCT_NOT_ADDED_TO_CART",
                        statusText: Resource.msgf("product.notAddedToCart", "training", null, product.getName())
                    };
                }
            }
        }

        r.renderJSON(result || {
            status: "PRODUCT_ADDED_TO_CART",
            redirectTo: URLUtils.url("Cart-Show").toString()
        });
    } catch (e) {
        Logger.error(e.message);

        r.renderJSON({
            status: "PRODUCT_NOT_ADDED_TO_CART",
            statusText: Resource.msgf("product.notAddedToCart", "training", null, product.getName())
        });
    }
}

exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["get"], HandleForm);