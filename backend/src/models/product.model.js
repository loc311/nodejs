'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_slug: String, //là biến viết nhu-the-nay
    product_decription: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref:'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    product_rating:{
        type:Number,
        default:4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5,'Rating must be above 5.0'],
        //làm tròn 4.53013 -> 4.5
        set: (val) => Math.round(val *10) /10
    },
    product_variations: {
        type:Array,
        default:[]
    },
    isDraft:{type:Boolean, default:true, index:true, select: false},
    isPublished:{type:Boolean, default:false, index:true, select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});
//create index for search
productSchema.index({
    product_name: 'text',
    product_decription:'text'
})

//document middleware : runs before .save() and . create()
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name,{lower: true})
    next();
})

//define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
},{
    collection: 'clothes',
    timestamps: true
})

//define the product type = Furniture
const furnitureSchema = new Schema({
    brand: {type: String, require: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
},{
    collection: 'furniture',
    timestamps: true
})
//
const electtronicSchema = new Schema({
    brand: {type: String, require: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'}
},{
    collection: 'elcetronics',
    timestamps: true
})
//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronics', electtronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema)
}