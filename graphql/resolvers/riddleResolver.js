
import Riddle from "../models/riddleQuest.js";

const riddleResolver = {
    Query: {
        allRiddle: async () => {
            return Riddle.find({})
        },
    },
    Mutation: {
        addRiddle: async (root, args) => {
            const riddle = new Riddle({...args})
            try{
                await riddle.save()
    
            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return riddle
        },
    },
};

export default riddleResolver;


