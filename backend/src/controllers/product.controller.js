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

  // /**
  //  * @des get all draft
  //  * @param {Number} limit 
  //  * @param {Number} skip 
  //  * @return {JSON}
  //  */
  getAllDraftsForShop = async (req, res, next) => {

    new SuccessResponse({
      message: 'Created new Product',
      metadata: await ProductService.findAllDraftForShop({
       
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPushlishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Pushlish Shop',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

}

module.exports = new ProductController()