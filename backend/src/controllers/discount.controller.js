'use strict'

const DiscountService = require('../services/discount.service')
const { SuccessResponse} = require('../core/success.response')

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message:'Create discount code successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) =>{
        new SuccessResponse({
            message:'Get all discount code',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) =>{
        new SuccessResponse({
            message:'Get all DiscountAmount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res, next) =>{
        new SuccessResponse({
            message:'Get all discount code',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()