import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    accessLevel: {
        type: Number,
        default: 1
    }
})

schema.plugin(uniqueValidator)

export default mongoose.model('ApiKey', schema)