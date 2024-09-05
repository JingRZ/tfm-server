import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    mac: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: String,
    },
    descrip: {
        type: String,
    },
    location: {
        type: String,
    },
    neighbors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
    }]
})

schema.plugin(uniqueValidator)

export default mongoose.model('Node', schema)