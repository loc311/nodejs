'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()



//authentication
router.use(authentication)

//logout
router.post('', asyncHandler(productController.createProduct))

//query
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))

router.get('/pushlished/all', asyncHandler(productController.getAllPushlishForShop))

module.exports = router