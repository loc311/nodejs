'use strict'

const CartService = require("../services/cart.service")
const { CREATED, OK, SuccessResponse } = require("../core/success.response")

class CartController {

    addtoCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new cart',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'update cart',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete cart',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list cart',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()