const ISML = require('dw/template/ISML');
const guard = require('app_storefront_controllers/cartridge/scripts/guard');

function start(){
    ISML.renderTemplate("areyouhuman.isml");
}

exports.Start = guard.ensure(["get"], start);