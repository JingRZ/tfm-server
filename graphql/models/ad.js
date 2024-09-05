import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    code: {
        type: String,
        required: true,
        minlength: 3
    },
    img_url: {
        type: String,
        minlength: 5,
        default: "404.jpg"
    },
    url: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "FDI"
    },
    tag: {
        type: String,
        required: true,
    }
})

schema.plugin(uniqueValidator)

export default mongoose.model('Ad', schema)