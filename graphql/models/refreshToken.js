import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true
    },
})

schema.plugin(uniqueValidator)

export default mongoose.model('RefreshToken', schema)