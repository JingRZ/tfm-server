import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    description: {
        type: String,
        minlength: 5
    },
    code: {
        type: String,
        required: true,
        minlength: 6
    },
    img_url: {
        type: String,
        minlength: 5,
        default: "404.jpg"
    },
    duration: {
        type: Number,
        min: 0,
        default: 10
    },
    coins: {
        type: Number,
        min: 0,
        default: 10
    },
    checkpoints: {
        type: Number,
        min: 0,
        default: 1
    },
    location: {
        type: String,
        minlength: 2,
        default: "FDI"
    },
    tags: [{
        type: String,
        minlength: 2
    }]
})

schema.plugin(uniqueValidator)

export default mongoose.model('Card', schema)