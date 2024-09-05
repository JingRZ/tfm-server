import Card from '../models/card.js';
import { UserInputError } from 'apollo-server';
import fetchImage from '../utils/imgService.js';


const cardResolver = {
    Query: {
        cardCount: () => Card.collection.countDocuments(),
        allCards: async (root, args) => {
            const cards = args?.tags ? 
            await Card.find({ tags: { $all: args.tags } }) : 
            await Card.find({});

            const cardsWithImages = await Promise.all(cards.map(async card => {
                const {image} = await fetchImage(card.img_url);
                return {
                  ...card._doc, // Usar ._doc ya que card es un documento de Mongoose
                  image // Agrega la imagen en base64 al objeto de la tarjeta
                };
            }));

            return cardsWithImages;
        },
        findCard: async (root, args) => {
            const {code} = args;
            const card =  await Card.findOne({code});
            if(!card) return card;

            const {image} = await fetchImage(card.img_url);

            return {
                ...card._doc,
                image
            }
           
        },
    },
    Mutation: {
        addCard: async (root, args, context) => {
            //const {currentUser} = context
            //if(!currentUser) throw new AuthenticationError('Not Authenticated')

            const card = new Card({...args})

            try{
                await card.save()
                //currentUser.cards = currentUser.cards.concat(card)
                //await currentUser.save()

            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return card
        },
        editTitle: async (root, args) => {
            const card = await Card.findOne({code: args.code})
            if(!card) return

            card.title = args.title
            try {
                await card.save()
            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

            return card

        },
        addTags: async (root, args) => {
            if(!args.tags || !args.code) return

            try{
                const card = await Card.findOneAndUpdate(
                    { code: args.code },
                    { $addToSet: { tags: args.tags } },
                    { new: true }
                )

                if (!card) {
                    throw new Error('No data related to code <' + args.code + '>');
                }

                console.log('Documento actualizado:', card);
                await card.save()

                return card

            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

        },
        
    }
};

export default cardResolver;