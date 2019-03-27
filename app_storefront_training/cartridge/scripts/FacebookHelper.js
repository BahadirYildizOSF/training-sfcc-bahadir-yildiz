var HTTPClient = require('dw/net/HTTPClient');
var preferences = require('dw/system/Site').getCurrent().getPreferences();
var URLUtils = require('dw/web/URLUtils');

module.exports = {
    APISecret: preferences.getCustom()["facebookAPISecret"],
    AppID: preferences.getCustom()["facebookAppID"],
    state: "{kemange=kako,sugarke=magekako}",
    links: {
        oauth: "https://www.facebook.com/v3.2/dialog/oauth",
        graph: "https://graph.facebook.com/v3.2/me",
        accessToken: "https://graph.facebook.com/v3.2/oauth/access_token"
    },
    redirectURI: URLUtils.https("ShowFacebookInfo-LoggedIn").toString(),
    getLoginDialogLink: function () {
        return this.links.oauth + "?" + this.convertToURLParams({
            client_id: this.AppID,
            redirect_uri: encodeURIComponent(this.redirectURI),
            state: '"' + encodeURIComponent(this.state) + '"'
        });
    },
    getAccessTokenLink: function (code) {
        return this.links.accessToken + "?" + this.convertToURLParams({
            client_id: this.AppID,
            redirect_uri: encodeURIComponent(this.redirectURI),
            client_secret: this.APISecret,
            code: code
        });
    },
    getGraphLink: function (accessToken) {
        return this.links.graph + "?access_token=" + accessToken + "&fields=" + this.getFields();
    },
    getAccessToken: function (code) {
        var client = new HTTPClient();
        var url = this.getAccessTokenLink(code);
        client.open('GET', url);
        client.setRequestHeader('Content-Type', 'application/json');
        client.setTimeout(3000);
        client.send();
        return JSON.parse(client.text);
    },
    getUserInformation: function (accessToken) {
        var client = new HTTPClient();
        client.open('GET', this.getGraphLink(accessToken));
        client.setRequestHeader('Content-Type', 'application/json');
        client.setTimeout(3000);
        client.send();

        if (client.statusCode === 200) {
            var data = JSON.parse(client.text);
            return data;
        } else {
            var error = JSON.parse(client.text);
            return error;
        }
    },
    getFields: function () {
        return ["id", "name", "email", "birthday", "picture.width(720)"].join(",");
    },
    convertToURLParams: function (obj) {
        return Object.keys(obj)
            .map(function (key) { return key + "=" + obj[key]; })
            .join('&');
    }
};