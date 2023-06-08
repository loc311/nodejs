'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProduct))
router.get('/:product_id', asyncHandler(productController.findProduct))

//authentication bên dưới là có authen
router.use(authentication)

//logout
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//query
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/pushlished/all', asyncHandler(productController.getAllPushlishForShop))

module.exports = router