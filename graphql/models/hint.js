import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    cardID: {
        type: String,
        required: true,
    },
    step: {
        type: String,
        required: true,
        min: 0
    },
    questCode: {
        type: String,
        minlength: 3,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
    },
    img_url: {
        type: String,
    },
    
})

schema.plugin(uniqueValidator)

export default mongoose.model('Hint', schema)