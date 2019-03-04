var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var HTTPClient = require('dw/net/HTTPClient');
var Resource = require('dw/web/Resource');
function start() {
    var format = 'json',
        preferences = dw.system.Site.getCurrent().getPreferences(),
        lang = preferences.getCustom()["flickrLanguage"];
    var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=" + format + "&lang=" + lang;
    var client = new HTTPClient();
    client.setRequestHeader('Content-Type', 'application/json');
    client.open('GET', flickrAPI);
    client.setTimeout(3000);
    client.send();
    if (client.statusCode == 200) {
        var data = eval(client.text);
        ISML.renderTemplate("flickr/showphotos", {
            items: data.items
        })
    } else {
        ISML.renderTemplate("flickr/showphotos", {
            items: null
        })
    }
}

function jsonFlickrFeed(data){
    return data;
}

exports.Start = guard.ensure(["get"], start);