import mongoose from "mongoose";
import Quest from "./quest.js";

const schema = new mongoose.Schema({

    question: {
        type: String,
        required: true,
        minlength: 5
    },
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

export default Quest.discriminator('Riddle', schema);
