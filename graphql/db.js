import mongoose from "mongoose";
//xGoL7bpksFt8RPUY
//const MONGODB_URI = 'mongodb+srv://jing:xGoL7bpksFt8RPUY@tfm-db.vqk9cm5.mongodb.net/?retryWrites=true&w=majority&appName=TFM-DB'
/*
*   Since mongodb is running in the same container as the server,
*   we can use the database container's name to connect to it.
*   Exple: If mongodb is called AaA in the compose file,
*   the connection string would be mongodb://AaA:27017/
*/
const MONGODB_URI = 'mongodb://mongodb:27017/'

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB')
}).catch(error => {
    console.log('Error connection to MongoDB', error)
})