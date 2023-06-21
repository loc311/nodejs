'use strict'

const { getSelcetData, unGetSelcetData } = require("../../utils");
const { discount } = require("../discount.model");

const findAllDiscountCodeUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelcetData(unSelect))
        .lean()
    return documents
}

const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelcetData(select))
        .lean()
    return documents
}

const checkDiscount = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    checkDiscount,
    findAllDiscountCodeSelect
}