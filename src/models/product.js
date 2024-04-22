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
    ratings: [{
      type: ObjectId,
      ref: 'Rating'
    }],
    avgRating: {
      type: Number,
      default: 0,
    }

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);