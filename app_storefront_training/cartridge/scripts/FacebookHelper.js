var HTTPClient = require('dw/net/HTTPClient');
var preferences = dw.system.Site.getCurrent().getPreferences();
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
        return this.links.oauth +"?"+ this.convertToURLParams({
            client_id: this.AppID, 
            redirect_uri: encodeURIComponent(this.redirectURI), 
            state: '"'+ encodeURIComponent(this.state)+ '"'
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
            .map(function (key) { return key + "=" + obj[key] })
            .join('&');
    },
}

// https://www.facebook.com/v3.2/dialog/oauth/?app_id=440466183357411&redirect_uri=https%3A%2F%2Fosfglobal02-alliance-prtnr-eu03-dw.demandware.net%2Fon%2Fdemandware.store%2FSites-SiteGenesis-Site%2Fdefault%2FShowFacebookInfo-LoggedIn&state=

// https://www.facebook.com/v3.2/dialog/oauth/?app_id=f9d2880664e0a16e301d220780c8922a&redirect_uri=https%3A%2F%2Fosfglobal02-alliance-prtnr-eu03-dw.demandware.net%2Fon%2Fdemandware.store%2FSites-SiteGenesis-Site%2Fdefault%2FShowFacebookInfo-LoggedIn

// https://osfglobal02-alliance-prtnr-eu03-dw.demandware.net/on/demandware.store/Sites-SiteGenesis-Site/default/ShowFacebookInfo-LoggedIn?code=AQCAxgppyMHv1NWTUhen6hLwOrugdnVJ8kMJJevDBDSfI334pATN_N_N2L4agzML52kALus4mKhPPIfrhzkJoOpvVL_hjBpcG_mAq3JieGSe6QTeJdUmDxRZiImLh8SMAfs16C5y7GVMsw5ATDQH9Hjj5TKWldFP8Cc7_AuHUHlyw0_5D6-aBYBQE5kDyPeeJGpXNqETuXUodJmw5OEZ_ZHi40hxd4TznPA3NsPc3SFVwJyPzB0nfWbzOZKmLhRrOqrDosNtpG9AnRD8zCl0fM85W8c480aTi8b5ICvs5-wIIWsqS_Z-DcWI0nf1kt3Hjz8&state=%22%7Bkemange%3Dkako%2Csugarke%3Dmagekako%7D%22#_=_