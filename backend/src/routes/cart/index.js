'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


router.post('', asyncHandler(cartController.addtoCart))
router.get('', asyncHandler(cartController.listToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
module.exports= router