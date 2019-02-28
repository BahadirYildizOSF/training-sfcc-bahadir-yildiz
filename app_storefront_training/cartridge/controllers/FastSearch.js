var ISML = require('dw/template/ISML');
var guard = require("app_storefront_controllers/cartridge/scripts/guard");

function start(){
    var fastSearchForm = session.forms.fastSearch;
    fastSearchForm.clearFormElement();
    ISML.renderTemplate("search/fastsearch", {
        ContinueURL: dw.web.URLUtils.https('FastSearch-HandleForm')
    })
}

function HandleForm() {
    
}

exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["get"], HandleForm);