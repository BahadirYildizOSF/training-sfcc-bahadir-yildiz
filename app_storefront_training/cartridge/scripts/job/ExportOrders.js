/**
 * Export the product which haven't been exported.
 */

exports.execute = function (params) {
    const File = require('dw/io/File');
    const FileWriter = require('dw/io/FileWriter');
    const XMLStreamWriter = require('dw/io/XMLStreamWriter');
    const Transaction = require('dw/system/Transaction');
    const OrderMgr = require('dw/order/OrderMgr');
    const Order = require('dw/order/Order');
    var searchResults = OrderMgr.searchOrders('exportStatus ={0} OR exportStatus ={1}', null, Order.EXPORT_STATUS_NOTEXPORTED, Order.EXPORT_STATUS_READY);

    Transaction.wrap(function () {
        const file = new File(File.IMPEX + File.SEPARATOR + "src" + File.SEPARATOR + "exports" + File.SEPARATOR + "exported_orders.xml");
        const fileWriter = new FileWriter(file, "UTF-8");
        fileWriter.setLineSeparator('\r\n');
        const xsw = new XMLStreamWriter(fileWriter);

        xsw.writeStartDocument();
        xsw.writeStartElement("orders");
        xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/order/2006-10-31");

        while (searchResults.hasNext()) {
            var order = searchResults.next().getCurrentOrder();
            var productLineItems = order.getAllProductLineItems().iterator();
            var paymentInstruments = order.getPaymentInstruments().iterator();

            /**
             * @formatter:off
             */
            xsw.writeStartElement("order");
            xsw.writeAttribute("order-no", order.getOrderNo());
                xsw.writeStartElement("order-date");
                    xsw.writeCharacters(order.getCreationDate().toString());
                xsw.writeEndElement();
                xsw.writeStartElement("customer");
                    xsw.writeStartElement("customer-name");
                        xsw.writeCharacters(order.getCustomerName());
                    xsw.writeEndElement();
                    xsw.writeStartElement("customer-no");
                        xsw.writeCharacters(order.getCustomerNo());
                    xsw.writeEndElement();
                    xsw.writeStartElement("customer-email");
                        xsw.writeCharacters(order.getCustomerEmail());
                    xsw.writeEndElement();
                xsw.writeEndElement();
                xsw.writeStartElement("adjusted-merchandize-total");
                    xsw.writeStartElement("gross-price");
                        xsw.writeCharacters(order.getAdjustedMerchandizeTotalGrossPrice());
                    xsw.writeEndElement();
                xsw.writeEndElement();
                xsw.writeStartElement("product-lineitems");
                    while(productLineItems.hasNext()){
                        var product = productLineItems.next().getProduct();
                        if(product !== null){
                            xsw.writeStartElement("product-lineitem");
                                xsw.writeStartElement("product-id");
                                    xsw.writeCharacters(product.getID());
                                xsw.writeEndElement();
                            xsw.writeEndElement();
                        }
                    };
                xsw.writeEndElement();
                xsw.writeStartElement("payments");
                    while(paymentInstruments.hasNext()){
                        var paymentInstrument = paymentInstruments.next();
                        xsw.writeStartElement("payment");
                            xsw.writeStartElement("payment-method");
                                xsw.writeCharacters(paymentInstrument.getPaymentMethod());
                            xsw.writeEndElement();
                        xsw.writeEndElement();
                    };
                xsw.writeEndElement();
            xsw.writeEndElement();;
            /**
             * @formatter:on
             */
        }

        xsw.writeEndElement();
        xsw.writeEndDocument();
        xsw.close();
        fileWriter.close();
    });

    return PIPELET_NEXT;
}