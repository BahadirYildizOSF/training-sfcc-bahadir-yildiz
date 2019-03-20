/**
 * Gets the products in catalog and filters them with given brand name
 *
 * @input brand : string The product list representing the gift registry.
 * @input newCategory : string The form definition representing the gift registry.
 */

exports.execute = function (params) {
    var File = require('dw/io/File');
    var FileWriter = require('dw/io/FileWriter');
    var XMLStreamWriter = require('dw/io/XMLStreamWriter');
    var Transaction = require('dw/system/Transaction');
    var psm = new dw.catalog.ProductSearchModel();

    psm.addRefinementValues("brand", params.brand);
    psm.search();
    var searchResults = psm.getProductSearchHits();
    var filteredProducts = {};

    Transaction.wrap(function () {
        var file = new File(File.IMPEX + File.SEPARATOR + "src" + File.SEPARATOR + "assigned_products.xml");
        var fileWriter = new FileWriter(file, "UTF-8");
        fileWriter.setLineSeparator('\r\n');
        var xsw = new XMLStreamWriter(fileWriter);

        xsw.writeStartDocument();
        xsw.writeStartElement("catalog");
        xsw.writeAttribute("catalog-id", "storefront-catalog-en");
        xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");

        while (searchResults.hasNext()) {
            var product = searchResults.next().getProduct();
            if (product.getID() in filteredProducts) {
                continue;
            } else {
                xsw.writeStartElement("category-assignment");
                xsw.writeAttribute("category-id", params.newCategory);
                xsw.writeAttribute("product-id", product.getID());
                    xsw.writeStartElement("primary-flag");
                    xsw.writeCharacters("true");
                    xsw.writeEndElement();
                xsw.writeEndElement();
                filteredProducts[product.getID()] = product;
            }
        }

        xsw.writeEndElement();
        xsw.writeEndDocument();
        xsw.close();
        fileWriter.close();
    });

    return PIPELET_NEXT;
};