var CouponMgr = require('dw/campaign/CouponMgr');
var Resource = require('dw/web/Resource');
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Mail = require('dw/net/Mail');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var createNewsLetterObject = function (newsletterForm) {
    var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscription", newsletterForm.email.value);
    customObjectInstance.custom.firstname = newsletterForm.firstname.value;
    customObjectInstance.custom.lastname = newsletterForm.lastname.value;
    return customObjectInstance;
};

var assignCouponCode = function (customObjectInstance) {
    customObjectInstance.custom.couponCode = CouponMgr.getCoupon("20_percent_coupons").getNextCouponCode();
    return customObjectInstance;
};

var sendNewsLetterMail = function (customObjectInstance) {
    var template = new Template("newsletter/newslettermail.isml");
    var params = new HashMap();
    params.put("firstname", customObjectInstance.custom.firstname);
    params.put("lastname", customObjectInstance.custom.lastname);
    params.put("couponCode", customObjectInstance.custom.couponCode);
    var text = template.render(params);
    var subject = Resource.msg("newsletter.subscribe.mail.subject", "locale", null);

    var mail = new Mail();
    mail.addTo(customObjectInstance.custom.email);
    mail.setFrom(dw.system.Site.getCurrent().getPreferences().getCustom()["customerServiceEmail"]);
    mail.setSubject(subject);
    mail.setContent(text);
    return mail.send();
};

exports.createObjectAndSendMail = function (newsletterForm) {
    return Transaction.wrap(function () {
        var newsletter = createNewsLetterObject(newsletterForm);
        newsletter = assignCouponCode(newsletter);
        var mailStatus = sendNewsLetterMail(newsletter);

        if (mailStatus.isError()) {
            Logger.error(mailStatus.getMessage());
            return false;
        } else {
            return true;
        }
    }) || false;
};
