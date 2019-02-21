const Coupon = require('dw/campaign/Coupon');

exports.CreateNewsLetterObject = function (newsletterForm) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscription", newsletterForm.email.value);
    customObjectInstance.custom.firstName = newsletterForm.firstname.value;
    customObjectInstance.custom.lastName = newsletterForm.lastname.value;
    return customObjectInstance;
}

exports.AssignCouponCode = function (customObjectInstance){
    customObjectInstance.custom.couponCode = CouponMgr.getCoupon("20_percent_coupons").getNextCouponCode();
    return customObjectInstance;
}