import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    pwd: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        default: 0
    },
    cards: [
        {
            cardCode: {
                type: String,
                required: true,
            },
            step: {
                type: Number,
                default: 0,
                min: 0,
            },
            completed: {
                type: Boolean,
                default: false
            },
        }
    ]
})

export default mongoose.model('User', schema)

