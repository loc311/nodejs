'use strict'

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')
const { cart } = require("../models/cart.model")
const { product } = require("../models/product.model")
const { getProductById } = require('../models/repositories/product.repo')

/*    feature:
    -add product to cart (user)
    -reduce quantity of product in cart (user)
    -increase quantity of product by one (user)
    -get cart
    -clear cart
    -remove product from cart (user)
*/

class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    //để update quantity product trong cart
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {

        //check cart is exist
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await CartService.createUserCart({ userId, product })
        }
        //check có trong giỏ hàng nhưng chưa có sản phẩm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        //gio hang ton tại và có product thì update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    //update cart 
    /*
    shop_order_ids:[
        {
            shopId,
            item_products: [
                {
                    quantity, price, shopId, old_quantity, productId
                }
            ], version?
        }
    ]
    */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not found')
        //compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('product do not belong to the shop?')

        if (quantity === 0) {
            //delete
        }
        return await CartService.updateUserCartQuantity({ userId, product: { productId, quantity: quantity - old_quantity } })
    }

    static async deleteUserCart({userId, productId}) {
        const query = { cart_userId: userId, cart_state:'active' },
        updateSet ={
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        //khi xóa product trong cart nên cho vào 1 nơi, ví dụ khi có giảm tiền thì mail lại quảng cáo ng đã xóa khỏi cart
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListCart({userId}){
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }
}

module.exports = CartService