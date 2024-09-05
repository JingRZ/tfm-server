import Quest from "../models/quest.js";
import fetchImage from '../utils/imgService.js';
import Card from "../models/card.js";
import { UserInputError } from 'apollo-server';

function normalizeString(str) {
    return str
        .toLowerCase()          // Convierte a minúsculas
        .trim()                 // Elimina espacios en blanco al inicio y al final
        .normalize("NFD")       // Normaliza para separar caracteres unicode
        .replace(/[\u0300-\u036f]/g, ""); // Elimina los acentos y tildes
}

const questResolver = {
    Quest: {
        __resolveType(obj) {
            if (obj.kind === 'Quiz') {
                return 'Quiz';
            }
            else if (obj.kind === 'Riddle') {
                return 'Riddle';
            }
            else if (obj.kind === 'Hint') {
                return 'Hint';
            }
            return null;
        }
    },
    Query: {
        allQuests: async () => {
            return Quest.find({})
        },
        findQuest: async (_, args) => {
            const {code} = args
            const quest = await Quest.findOne({code});
            if(!quest) return quest;
            const {image} = await fetchImage(quest.img_url);
            return {
                ...quest._doc,
                image
            }
        },
        findQuestByGameStep: async (_, args) => {
            const {cardID, step} = args;
            const quest = await Quest.findOne({cardID, step});
            if(!quest) return quest;
            const {image} = await fetchImage(quest.img_url);
            return {
                ...quest._doc,
                image
            }
        },
        checkAns: async (_, args) => {
            const {code, answer} = args
            const quest = await Quest.findOne({code})
            if(!quest)
                throw new UserInputError('Quest not found', {
                    invalidArgs: args
                })
            
            if(normalizeString(quest.answer) != normalizeString(answer))
                return {
                    correct: false,
                }
            
            const card = await Card.findOne({code: quest.cardID})
            if(!card)
                throw new UserInputError('Card not found', {
                    invalidArgs: args
                })

            return {
                correct: true,
                finished: quest.step === card.checkpoints
            }
        },
    },
};

export default questResolver;