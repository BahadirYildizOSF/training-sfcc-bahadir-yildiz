'use strict';

/**
 * Controller for the default single shipping scenario.
 * Single shipping allows only one shipment, shipping address, and shipping method per order.
 *
 * @module controllers/Training
 * 
 */


const ISML = require('dw/template/ISML');
const guard = require("app_storefront_controllers/cartridge/scripts/guard");

function start() {
    const results = require("~/cartridge/scripts/job/CategoryAssigner").Start("Pencil", "New Category");
    ISML.renderTemplate("categoryassigner/result.isml", {
        results: results
    });
}

exports.Start = guard.ensure(["get"], start);