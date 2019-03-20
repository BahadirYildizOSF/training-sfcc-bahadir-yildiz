var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var FacebookHelper = require('app_storefront_training/cartridge/scripts/FacebookHelper');
var URLUtils = require('dw/web/URLUtils');
var params = request.httpParameterMap;

function start() {
    ISML.renderTemplate("facebook/showuser", {
        data: null,
        loginLink: FacebookHelper.getLoginDialogLink()
    });
}

function loggedIn() {
    if (params.code && params.code.stringValue) {
        var accessToken = FacebookHelper.getAccessToken(params.code.stringValue);
        var data = FacebookHelper.getUserInformation(accessToken.access_token);
        ISML.renderTemplate("facebook/showuser", {
            data: data
        });
    } else {
        response.redirect(URLUtils.https("ShowFacebookInfo-Start"));
    }
}

exports.Start = guard.ensure(["get"], start);
exports.LoggedIn = guard.ensure(["get"], loggedIn);