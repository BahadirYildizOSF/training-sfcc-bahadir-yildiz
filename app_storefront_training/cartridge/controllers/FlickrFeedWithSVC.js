var ISML = require('dw/template/ISML');
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var serviceFactory = require('app_storefront_training/cartridge/scripts/serviceFactory');
var preferences = dw.system.Site.getCurrent().getPreferences();
var lang = preferences.getCustom()["flickrLanguage"];


function start(){
    var FlickrService = serviceFactory.Get("flickr.http.get", {
        createRequest: function(svc, params){
            svc.setRequestMethod("GET");
            for (var name in params) {
                svc.addParam(name, params[name]);
            }
        },
        parseResponse: function(svc, client){
            return eval(client.text);
        },
        mockCall : function(svc, client) {
            return { items: [
                {title: "Mock Object 1", media:{ m: "https://via.placeholder.com/150" }},
                {title: "Mock Object 2", media:{ m: "https://via.placeholder.com/150" }},
                {title: "Mock Object 3", media:{ m: "https://via.placeholder.com/150" }}
            ]};
        },
        filterLogMessage: function (msg) {
            return msg.replace("headers", "OFFWITHTHEHEADERS");
        }
    });
    var result = FlickrService.call({lang: lang, format: "json"});
    ISML.renderTemplate("flickr/showphotos", {
        items: result.ok ? result.getObject().items : null  
    });   
}

function jsonFlickrFeed(data){
    return data;
}

exports.Start = guard.ensure(["get"], start);