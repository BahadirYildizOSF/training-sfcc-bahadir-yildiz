var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var Status = require('dw/system/Status');

/**
 * Gets the products in catalog and filters them with given brand name
 *
 * @input brand : string The product list representing the gift registry.
 * @input newCategory : string The form definition representing the gift registry.
 * @returns {dw.system.Status}
 */
exports.execute = function (params) {
    var psm = new ProductSearchModel();
    psm.addRefinementValues("brand", params.brand);
    psm.search();
    var searchResults = psm.getProducts();
    var file = new File([File.IMPEX, "src", "assigned_products.xml"].join(File.SEPARATOR));
    var fileWriter = new FileWriter(file, "UTF-8");
    fileWriter.setLineSeparator('\r\n');
    var xsw = new XMLStreamWriter(fileWriter);

    xsw.writeStartDocument();
    xsw.writeStartElement("catalog");
    xsw.writeAttribute("catalog-id", "storefront-catalog-en");
    xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");

    while (searchResults.hasNext()) {
        var product = searchResults.next();
        xsw.writeStartElement("category-assignment");
        xsw.writeAttribute("category-id", params.newCategory);
        xsw.writeAttribute("product-id", product.getID());
            xsw.writeStartElement("primary-flag");
            xsw.writeCharacters("true");
            xsw.writeEndElement();
        xsw.writeEndElement();
    }

    xsw.writeEndElement();
    xsw.writeEndDocument();
    xsw.close();
    fileWriter.close();

    return new Status(Status.OK);
};