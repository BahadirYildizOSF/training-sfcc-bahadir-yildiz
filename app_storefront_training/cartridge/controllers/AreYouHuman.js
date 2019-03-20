var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

function start() {
    ISML.renderTemplate("areyouhuman.isml");
}

exports.Start = guard.ensure(["get"], start);