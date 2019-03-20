var CouponMgr = require('dw/campaign/CouponMgr');
var Resource = require('dw/web/Resource');

exports.CreateNewsLetterObject = function (newsletterForm) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscription", newsletterForm.email.value);
    customObjectInstance.custom.firstname = newsletterForm.firstname.value;
    customObjectInstance.custom.lastname = newsletterForm.lastname.value;
    return customObjectInstance;
};

exports.AssignCouponCode = function (customObjectInstance) {
    customObjectInstance.custom.couponCode = CouponMgr.getCoupon("20_percent_coupons").getNextCouponCode();
    return customObjectInstance;
};

exports.sendNewsLetterMail = function (customObjectInstance) {
    var Template = require('dw/util/Template');
    var HashMap = require('dw/util/HashMap');
    var template = new Template("newsletter/newslettermail.isml");
    var params = new HashMap();
    params.put("firstname", customObjectInstance.custom.firstname);
    params.put("lastname", customObjectInstance.custom.lastname);
    params.put("couponCode", customObjectInstance.custom.couponCode);
    var text = template.render(params);
    var subject = Resource.msg("newsletter.subscribe.mail.subject", "locale", null);

    var mail = new (require('dw/net/Mail'))();
    mail.addTo(customObjectInstance.custom.email);
    mail.setFrom(dw.system.Site.getCurrent().getPreferences().getCustom()["customerServiceEmail"]);
    mail.setSubject(subject);
    mail.setContent(text);
    mail.send();
};