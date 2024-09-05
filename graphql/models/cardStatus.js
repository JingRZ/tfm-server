import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    cardCode: {
        type: String,
        required: true,
        unique: true,
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
})

schema.plugin(uniqueValidator)

export default mongoose.model('CardStatus', schema)

