'use strict'

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')
const { discount } = require('../models/discount.model')
const {product} = require('../models/product.model')
const { findAllDiscountCodeSelect, checkDiscount, findAllDiscountCodeUnSelect } = require('../models/repositories/discount.repo')
const { convertToObjectIdMongodb } = require('../utils')
const { findAllProduct } = require('./product.service')
/*
    1-generate discount code[shop/admin]
    2- get discount amount [user]
    3- get all discount codes[user]
    4- verify discount code[user]
    5- delete discount code[admin/shop]
    6- cancel discount code[user]
*/

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description, uses_count, users_used,
            type, value, max_value, max_uses, max_uses_per_users
        } = payload

        //kiem tra
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code is expired')
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start must be before end_date')
        }

        //create index
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_users: max_uses_per_users,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        //create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code not found')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProduct({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_code', 'discount_name', 'discount_applies_to'],
            model: discount
        })

        return discounts
    }

    /*
        apply discount code
        product = [
            mặt hàng 1{
                productId,
                shopId,
                quanity,
                name,
                price
            },
            mặt hàng 2{
                productId,
                shopId,
                quanity,
                name,
                price
            }
        ]
    */
    static async getDiscountAmount({ codeId, userId, shopId, products }) {

        const foundDiscount = await checkDiscount({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) {throw new NotFoundError('Discount code not found')}
        
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_users,
            discount_value,
            discount_type,
            discount_users_used,
            discount_start_date,
            discount_end_date
        } = foundDiscount

        if (!discount_is_active) { throw new NotFoundError('Discount code exprired') }
        if (!discount_max_uses) { throw new NotFoundError('Discount code are out') }

        // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new BadRequestError('Discount code is expired')
        // }

        //check gia tri tối thiểu
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            
            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Min order value is not enough ${discount_min_order_value} `)
            }
        }
        if (discount_max_uses_per_users > 0) {
            const userDiscount = discount_users_used.find(user => user.userId === userId)
            if (userDiscount) {
                //
            }
        }
        //check xem discount là fixed_amount ?
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
       
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        // const foundDiscount = '';
        // if(foundDiscount) {

        // }
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({ codeId, userId, shopId }) {
        const foundDiscount = await checkDiscount({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }
        const result = await discount.findByIdAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_users_used: userId
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1
                }
            })
        return result
    }
}

module.exports = DiscountService

