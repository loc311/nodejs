'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop, findAllProduct, findProduct, publishProductByShop, findAllPublishForShop, searchProductByUser, updateProductById } = require('../models/repositories/product.repo')
const { model } = require('mongoose')
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
//create product
class ProductFactory {
    //type:"Clothing", payload
    // static async createProduct(type, payload) {
    //     switch(type){
    //         case 'Electronics':
    //                 return new Electronics(payload)
    //         case 'Clothing':
    //                 return new Clothing(payload).createProduct()
    //         default:
    //                 throw new BadRequestError(`Invalid product types: ${type}`)
    //     }
    // }

    static productRegister = {}
    static registerProductType(type, classRef) {
        ProductFactory.productRegister[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegister[type]
        if (!productClass) throw new BadRequestError(`Invalid product types ${type}`)
        return new productClass(payload).createProduct()

    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegister[type]
        if (!productClass) throw new BadRequestError(`Invalid product types ${type}`)

        return new productClass(payload).updateProduct(productId)

    }

    //PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }


    //query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb','product_shop'] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}


class Product {
    constructor({
        product_name, product_thumb, product_decription, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_decription = product_decription
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            //add product stock in inventory
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

//define sub-class
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new clothes error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new product error')
        return newProduct;
    }

    async updateProduct(productId) {
        // console.log(`[1]::`, this)
        const objectParams = removeUndefinedObject(this)
        // console.log(`[2]::`, objectParams)
        if (objectParams.product_attributes) {
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
    }
}

class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new clothes error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product error')
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error')
        return newProduct
    }
}

//regis type
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory;