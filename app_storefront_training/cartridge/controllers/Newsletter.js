'use strict';

/** @module controllers/Newsletter */

var ISML = require('dw/template/ISML');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var newsletterForm = session.forms.newsletter;

function start() {
    newsletterForm.clearFormElement();
    ISML.renderTemplate('newsletter/newslettersubscribe', {
        ContinueURL: dw.web.URLUtils.https('Newsletter-HandleForm')
    });
}

/**
 * The form handler.
 */
function handleForm() {

    var Transaction = require('dw/system/Transaction');
    var submitButton = request.triggeredFormAction;
    if (submitButton && submitButton.formId === "subscribe") {
        try {
            Transaction.wrap(function () {
                var Newsletter = require("~/cartridge/scripts/models/Newsletter");
                var newsletter = Newsletter.CreateNewsLetterObject(newsletterForm);
                newsletter = Newsletter.AssignCouponCode(newsletter);
                Newsletter.sendNewsLetterMail(newsletter);
            });
            ISML.renderTemplate("newsletter/newslettersuccess.isml");
        } catch (e) {
            ISML.renderTemplate("newsletter/newslettererror.isml", {
                error: e
            });
        }
    } else {
        ISML.renderTemplate('newsletter/newslettersignup', {
            ContinueURL: dw.web.URLUtils.https('Newsletter-HandleForm')
        });
    }
}
exports.Start = guard.ensure(['get'], start);
exports.HandleForm = guard.ensure([], handleForm);

