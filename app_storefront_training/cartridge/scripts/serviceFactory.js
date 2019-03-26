'use strict';

/**
 * Function responsible for getting an dw.svc.ServiceRegistry instance using the ID of the Service that was created in BM
 * @param serviceID{String}: ID of the webservice that was configured in BM
 * @param serviceCallback{Dictionary}: Dictionary containing the mandatory methods for the service (createRequest and parse)
 * @returns
 */
function get(serviceID, serviceCallback) {
    var service;
    //If the service was not configured and callback was sent
    if (serviceCallback) {
        service = dw.svc.LocalServiceRegistry.createService(serviceID, serviceCallback);
    }
    return service;
}

function initializeFlickrService() {
    return get("flickr.http.get", {
        createRequest: function (svc, params) {
            svc.setRequestMethod("GET");
            for (var name in params) {
                svc.addParam(name, params[name]);
            }
        },
        parseResponse: function (svc, client) {
            return JSON.parse(client.text);
        },
        mockCall: function () {
            return {
                items: [
                    { title: "Mock Object 1", media: { m: "https://via.placeholder.com/150" } },
                    { title: "Mock Object 2", media: { m: "https://via.placeholder.com/150" } },
                    { title: "Mock Object 3", media: { m: "https://via.placeholder.com/150" } }
                ]
            };
        },
        filterLogMessage: function (msg) {
            return msg.replace("headers", "OFFWITHTHEHEADERS");
        }
    });
}

exports.initializeFlickrService = initializeFlickrService;