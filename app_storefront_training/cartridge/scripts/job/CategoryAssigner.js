/**
 * Gets the products in catalog and filters them with given brand name. 
 *
 * @input brand : string The product list representing the gift registry.
 * @input newCategory : string The form definition representing the gift registry.
 */

exports.execute = function (params) {
    const File = require('dw/io/File');
    const FileWriter = require('dw/io/FileWriter');
    const XMLStreamWriter = require('dw/io/XMLStreamWriter');
    const Transaction = require('dw/system/Transaction');
    const CatalogMgr = require('dw/catalog/CatalogMgr');
    const catalog = CatalogMgr.getCatalog("storefront-catalog-en");
    let allProducts = require('dw/catalog/ProductMgr').queryProductsInCatalog(catalog).asList();
    let filteredProducts = {};
    
    Transaction.wrap(function () {
        const file = new File(File.IMPEX+File.SEPARATOR+"src"+File.SEPARATOR+"catalog"+File.SEPARATOR+"assigned_products.xml");
        const fileWriter = new FileWriter(file, "UTF-8");
        fileWriter.setLineSeparator('\r\n');
        const xsw = new XMLStreamWriter(fileWriter);
        
        xsw.writeStartDocument();

        for (let index = 0; index < allProducts.length; index++) {
            let product = allProducts.get(index);
            product = product.constructor.name == "dw.catalog.Variant" ? product.getMasterProduct() : product;

            if(product.getID() in filteredProducts){
                continue;
            } else {
                if (product.brand === params.brand) {
                    xsw.writeStartElement("category-assignment");
                    xsw.writeAttribute("category-id", params.newCategory);
                    xsw.writeAttribute("product-id", product.getID());
                        xsw.writeStartElement("primary-flag");
                        xsw.writeCharacters("true");
                        xsw.writeEndElement();
                    xsw.writeEndElement();
                }
                filteredProducts[product.getID()] = product;
            }
        }

        xsw.writeEndDocument();
        xsw.close();
        fileWriter.close();
    });

    return PIPELET_NEXT;
}