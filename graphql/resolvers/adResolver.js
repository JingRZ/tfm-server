import Ad from '../models/ad.js';
import { UserInputError } from 'apollo-server'
import fetchImage from '../utils/imgService.js';


const adResolver = {
    Query: {
        allAds: async (root, args) => {
            return Ad.find({})
        },
        findAd: async (root, args) => {
            const {code} = args;
            if(!code)
                throw new UserInputError('Card ID not provided')

            
            const ad = await Ad.findOne({code})
            if(!ad) return ad

            const {image} = await fetchImage(ad.img_url)
            return {
                ...ad._doc,
                image
            }
        },
    },
    Mutation: {
        addAd: async (root, args) => {
        
            const ad = new Ad({...args})

            try{
                await ad.save()

            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return ad
        },
    }
};

export default adResolver;