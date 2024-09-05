import Hint from '../models/hint.js'
import { UserInputError } from 'apollo-server'
import fetchImage from '../utils/imgService.js';


const hintResolver = {
    Query: {
        allHints: async (root, args) => {
            if(!args.cardId) return Hint.find({})
            
            return Hint.find({cardID: {$all: args.cardId}})
        },
        findHint: async (root, args) => {
            const {cardId, step} = args
            const hint = await Hint.findOne({cardID: cardId, step})
            if(!hint) return hint

            const {image} = await fetchImage(hint.img_url)
            return {
                ...hint._doc,
                image
            }
        },
        findHintById: async (root, args) => {
            const {code} = args
            const hint = await Hint.findOne({code})
            if(!hint) return hint

            const {image} = await fetchImage(hint.img_url)
            return {
                ...hint._doc,
                image
            }
        },
    },
    Mutation: {
        addHint: async (root, args) => {
        
            const hint = new Hint({...args})

            try{
                await hint.save()

            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return hint
        },
    }
};

export default hintResolver;