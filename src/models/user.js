import mongoose from "mongoose";
const { Schema } =  mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64
        },
        image: {
            type: String,
        },
        imagePublicId: {
            type: String,
        },
        role: {
            type: Number,
            default: 0,
        },
        address: {
            type: "object",
            default: {
                street:"1 ogunlesi street",
                city:"onipanu",
                state:"CA",
                zip:11001,
            }
            
        },
        OTP:{
            type:String,
          }
        },
    { timestamps: true }
);

export default mongoose.model('User', userSchema)