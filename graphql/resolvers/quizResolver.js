
import Quiz from "../models/quizQuest.js";

const quizResolver = {
    Query: {
        allQuiz: async () => {
            return Quiz.find({})
        },
    },
    Mutation: {
        addQuiz: async (root, args) => {
            const quiz = new Quiz({...args})
            try{
                await quiz.save()
    
            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return quiz
        },
    },
};

export default quizResolver;


