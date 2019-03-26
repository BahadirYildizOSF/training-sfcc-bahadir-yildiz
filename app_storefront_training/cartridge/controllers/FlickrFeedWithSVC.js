var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var serviceFactory = require('app_storefront_training/cartridge/scripts/serviceFactory');
var preferences = require('dw/system/Site').getCurrent().getPreferences();
var lang = preferences.getCustom()["flickrLanguage"];


function start() {
    var FlickrService = serviceFactory.initializeFlickrService();
    var result = FlickrService.call({ nojsoncallback: 1, lang: lang, format: "json" });
    ISML.renderTemplate("flickr/showphotos", {
        items: result.ok ? result.getObject().items : null
    });
}

exports.Start = guard.ensure(["get"], start);