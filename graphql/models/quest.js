import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const options = { discriminatorKey: 'kind', collection: 'quests' };

const questSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    description: {
        type: String,
        minlength: 5,
        default: "No description available"
    },
    cardID: {
        type: String,
        required: true,
    },
    step: {
        type: Number,
        required: true,
        default: 0
    },
}, options);

questSchema.plugin(uniqueValidator);

const Quest = mongoose.model('Quest', questSchema);
export default Quest;
