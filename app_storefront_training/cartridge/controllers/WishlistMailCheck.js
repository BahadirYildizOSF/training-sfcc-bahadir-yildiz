const ISML = require('dw/template/ISML');
const guard = require("app_storefront_controllers/cartridge/scripts/guard");
const app = require("app_storefront_controllers/cartridge/scripts/app");
const Resource = require('dw/web/Resource');
const params = request.httpParameterMap;

function start() {
    const Product = app.getModel("Product");
    const product = Product.get(params.pid.stringValue);
    ISML.renderTemplate("mail/mailwishlist", {
        Product: product,
        MailSubject: Resource.msg("mail.newItemInWishlist", "training", null)
    })
}

exports.Start = guard.ensure(["get"], start);