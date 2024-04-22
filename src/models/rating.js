import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema

const ratingSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Rating', ratingSchema);