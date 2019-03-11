var ISML = require('dw/template/ISML');
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var app = require("app_storefront_controllers/cartridge/scripts/app");
var Resource = require('dw/web/Resource');
var params = request.httpParameterMap;

function start() {
    var Product = app.getModel("Product");
    var product = Product.get(params.pid.stringValue);
    ISML.renderTemplate("mail/mailwishlist", {
        Product: product,
        MailSubject: Resource.msg("mail.newItemInWishlist", "training", null)
    });
}

exports.Start = guard.ensure(["get"], start);