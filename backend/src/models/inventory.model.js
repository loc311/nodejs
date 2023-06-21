'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

// Declare the Schema of the Mongo model
var invenSchema = new Schema({
    inven_productId:{type: Schema.Types.ObjectId, ref:'Products'},
    iven_location:{type:String, default:"unKnow"},
    inven_stock:{type:Number, required:true},
    inven_stockId:{type:Schema.Types.ObjectId, ref:'Shop'},
    //khi đặt hàng thì phải trừ đi hàng tồn kho, khi thanh toán thì xóa đặt hàng
    inven_reservations: {type: Array, default: []}
    /*
    cartId, stock:1, createOn:
    */
}, {
    collection: COLLECTION_NAME,
    timestamps: true

});

//Export the model
module.exports ={ 
    inventory: model(DOCUMENT_NAME, invenSchema)
}
