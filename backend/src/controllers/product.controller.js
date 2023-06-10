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

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product By Shop',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unPublish Product By Shop',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Search Product',
      metadata: await ProductService.searchProduct(req.params)
    }).send(res)
  }

  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List All Product',
      metadata: await ProductService.findAllProduct(req.query)
    }).send(res)
  }

  findProduct= async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Product',
      metadata: await ProductService.findProduct({product_id:req.params.product_id})
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product success',
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId,{
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new ProductController()