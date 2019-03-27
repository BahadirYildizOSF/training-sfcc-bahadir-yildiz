var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');

/**
 * Export the product which haven't been exported.
 * @returns {dw.system.Status}
 */
exports.execute = function (params) {
    var searchResults = OrderMgr.searchOrders('exportStatus ={0} OR exportStatus ={1}', null, Order.EXPORT_STATUS_NOTEXPORTED, Order.EXPORT_STATUS_READY);

    Transaction.wrap(function () {
        var file = new File([File.IMPEX, "src", "exports", "exported_orders.xml"].join(File.SEPERATOR));
        var fileWriter = new FileWriter(file, "UTF-8");
        fileWriter.setLineSeparator('\r\n');
        var xsw = new XMLStreamWriter(fileWriter);

        xsw.writeStartDocument();
        xsw.writeStartElement("orders");
        xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/order/2006-10-31");

        while (searchResults.hasNext()) {
            var order = searchResults.next().getCurrentOrder();
            var orderDate = order.getCreationDate();
            var productLineItems = order.getAllProductLineItems().iterator();
            var paymentInstruments = order.getPaymentInstruments().iterator();

            /**
             * @formatter:off
             */
            xsw.writeStartElement("order");
            xsw.writeAttribute("order-no", order.getOrderNo());
                if(orderDate !== null) {
                    xsw.writeStartElement("order-date");
                        xsw.writeCharacters(order.getCreationDate().toString());
                    xsw.writeEndElement();
                }
                xsw.writeStartElement("customer");
                    if(order.getCustomerName() !== null) {
                        xsw.writeStartElement("customer-name");
                            xsw.writeCharacters(order.getCustomerName());
                        xsw.writeEndElement();
                    }
                    if(order.getCustomerNo() !== null) {
                        xsw.writeStartElement("customer-no");
                            xsw.writeCharacters(order.getCustomerNo());
                        xsw.writeEndElement();
                    }
                    if(order.getCustomerEmail() !== null) {
                        xsw.writeStartElement("customer-email");
                            xsw.writeCharacters(order.getCustomerEmail());
                        xsw.writeEndElement();
                    }
                xsw.writeEndElement();
                xsw.writeStartElement("adjusted-merchandize-total");
                    if(order.getAdjustedMerchandizeTotalGrossPrice() !== null) {
                        xsw.writeStartElement("gross-price");
                            xsw.writeCharacters(order.getAdjustedMerchandizeTotalGrossPrice());
                        xsw.writeEndElement();
                    }
                xsw.writeEndElement();
                xsw.writeStartElement("product-lineitems");
                    while(productLineItems.hasNext()) {
                        var product = productLineItems.next().getProduct();
                        if(product !== null) {
                            xsw.writeStartElement("product-lineitem");
                                xsw.writeStartElement("product-id");
                                    xsw.writeCharacters(product.getID());
                                xsw.writeEndElement();
                            xsw.writeEndElement();
                        }
                    }
                xsw.writeEndElement();
                xsw.writeStartElement("payments");
                    while(paymentInstruments.hasNext()) {
                        var paymentInstrument = paymentInstruments.next();
                        xsw.writeStartElement("payment");
                            xsw.writeStartElement("payment-method");
                                xsw.writeCharacters(paymentInstrument.getPaymentMethod());
                            xsw.writeEndElement();
                        xsw.writeEndElement();
                    }
                xsw.writeEndElement();
            xsw.writeEndElement();
            /**
             * @formatter:on
             */
        }

        xsw.writeEndElement();
        xsw.writeEndDocument();
        xsw.close();
        fileWriter.close();
    });

    return new Status(Status.OK);
};