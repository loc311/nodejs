'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")
// const accessService = require("../services/access.service")

class ProductController {

  createProduct = async (req, res, next) => {
    
    new SuccessResponse({
        message: 'Created new Product',
        metadata: await ProductService.createProduct(req.body.product_type, {
            ...req.body,
            product_shop: req.user.userId
        })
      }).send(res) 
  }

}

module.exports = new ProductController()