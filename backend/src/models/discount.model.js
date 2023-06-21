'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({

    discount_name :{type:String, required:true},
    discount_description:{type:String, required:true},
    discount_type:{type:String, default:'fixed_amount'}, //theo số tiền
    discount_value:{type:Number, required:true}, 
    discount_code:{type:String, required:true},
    discount_start_date:{type:Date, required:true},
    discount_end_date:{type:Date, required:true},
    discount_max_uses:{type:Number, required:true}, //số lượng được sử dụng
    discount_uses_count:{type:Number, required:true},// số discount đã được sử dụng
    discount_users_used:{type: Array, default:[]}, //ai đã sử dụng
    discount_max_uses_per_users:{type:Number, required:true}, //số user được dùng
    discount_min_order_value:{type:Number, required:true},
    discount_shopId:{type:Types.ObjectId, ref:'Shop'},
    
    discount_is_active:{type:Boolean, default:true},
    discount_applies_to:{type:String,required:true, enum:['all','specific']},
    discount_product_ids:{type: Array, default:[]}//số sản phẩm áp dụng
}, {
    collection: COLLECTION_NAME,
    timestamps: true

});

//Export the model
module.exports ={ 
    discount: model(DOCUMENT_NAME, discountSchema)
}
