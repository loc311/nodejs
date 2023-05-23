'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

//login
router.post('/shop/login', asyncHandler(accessController.login))

//authentication
router.use(authentication)

//handlerRefreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

//logout
router.post('/shop/logout', asyncHandler(accessController.logout))


module.exports = router