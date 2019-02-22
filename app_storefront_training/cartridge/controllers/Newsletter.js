'use strict';

/** @module controllers/Newsletter */

const ISML = require('dw/template/ISML');
const guard = require('app_storefront_controllers/cartridge/scripts/guard');
const newsletterForm = session.forms.newsletter;

function start() {
    newsletterForm.clearFormElement();
    ISML.renderTemplate('newsletter/newslettersubscribe', {
        ContinueURL : dw.web.URLUtils.https('Newsletter-HandleForm')
    });
}

/**
 * The form handler.
 */
function handleForm() {

    const Transaction = require('dw/system/Transaction');
    const submitButton = request.triggeredFormAction;
    if(submitButton && submitButton.formId === "subscribe"){
        try {
            Transaction.wrap(function(){
                const Newsletter = require("~/cartridge/scripts/models/Newsletter");
                let newsletter = Newsletter.CreateNewsLetterObject(newsletterForm);
                newsletter = Newsletter.AssignCouponCode(newsletter);
                Newsletter.sendNewsLetterMail(newsletter);
            })
            ISML.renderTemplate("newsletter/newslettersuccess.isml");
        } catch (e) {
            ISML.renderTemplate("newsletter/newslettererror.isml", {
                error: e
            });
        }
    } else {
        ISML.renderTemplate('newsletter/newslettersignup', {
            ContinueURL : dw.web.URLUtils.https('Newsletter-HandleForm')
        });
    }
}
exports.Start = guard.ensure(['get'], start);
exports.HandleForm = guard.ensure([], handleForm);

