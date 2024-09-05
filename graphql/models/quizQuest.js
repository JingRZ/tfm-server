import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import Quest from "./quest.js";

const schema = new mongoose.Schema({

    question: {
        type: String,
        required: true,
        minlength: 5
    },
    options: [{
        type: String,
        required: true
    }],
    img_url: {
        type: String,
        minlength: 5,
        default: "404.jpg"
    },
    answer: {
        type: String,
        required: true,
        minlength: 1
    },
})

//schema.plugin(uniqueValidator)
//export default mongoose.model('Quiz', schema)
export default Quest.discriminator('Quiz', schema);
