'use strict';

/** @module controllers/Newsletter */

var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var Newsletter = require('app_storefront_training/cartridge/scripts/models/Newsletter');

function start() {
    var newsletterForm = session.forms.newsletter;
    newsletterForm.clearFormElement();
    ISML.renderTemplate('newsletter/newslettersubscribe', {
        ContinueURL: dw.web.URLUtils.https('Newsletter-HandleForm')
    });
}

/**
 * The form handler.
 */
function handleForm() {
    var submitButton = request.triggeredFormAction;
    var newsletterForm = session.forms.newsletter;

    if (submitButton && submitButton.formId === "subscribe") {
        if (Newsletter.createObjectAndSendMail(newsletterForm)) {
            ISML.renderTemplate("newsletter/newslettersuccess.isml");
        } else {
            ISML.renderTemplate("newsletter/newslettererror.isml");
        }
    } else {
        ISML.renderTemplate('newsletter/newslettersignup', {
            ContinueURL: dw.web.URLUtils.https('Newsletter-HandleForm')
        });
    }
}
exports.Start = guard.ensure(['get'], start);
exports.HandleForm = guard.ensure([], handleForm);

