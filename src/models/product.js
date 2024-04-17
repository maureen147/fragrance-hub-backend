import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [{
      url: {
        type: String,
      },
      imagePublicId: {
        type: String,
      }
    }], 
    isAvailable: {
      type: Boolean,
      default: true,
    },
    shipping: {
      type: Boolean,
      default: false,
    },
    

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);






// import mongoose from 'mongoose';
// const {Schema}= mongoose;
// const {ObjectId}=Schema

// //for description in productschema
// const descriptionSchema= new Schema({
//     content:{
//         type:String,
//         required:true,
//     },
//     brand:{
//         type:String
    
//     },
//     scent:{
//         type:String
//     },
//     gender :{
//       type:String
//     },
// });
// //for image in productSchema
// const imageSchema = new Schema({
//     url:{
//         type:String,
    
//     },
//     imagePublicId:{
//         type:String,
//     }
// });
// const productSchema = new Schema({
//     name:{
//         type:String,
//         trim:true,
//         required:true,
//         maxlength:160,
//     },
//     slug:{
//         type: String,
//         lowercase:true,

//     },
//     description:{
//         type:descriptionSchema,
//         required:true,
//     },
//     price:{
//         type:Number,
//         required:true,
//         trim:true,
//     },
//     category:{
//         type: ObjectId,
//         ref:"Category",
//         required:true,
//     },
//     quantity:{
//         type:Number,
//     },
//     sold:{
//         type:Number,
//         default:0,
//     },
//     images:[imageSchema],
//     isAvailable:{
//         type:Boolean,
//         default:true,
//     },
//     shipping:{
//         type:Boolean,
//         default:false,
//     },
// },
// {timestamps:true}
// );

// export default mongoose.model('Product',productSchema);