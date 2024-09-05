import User from '../models/user.js'
import Card from '../models/card.js'
import CardStatus from '../models/cardStatus.js'
import RefreshToken from '../models/refreshToken.js'
import bcrypt from 'bcrypt'
import { UserInputError, AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import refreshTokenResolver from './refreshTokenResolver.js'

import { verifyToken, generateRefreshToken, withAuth } from '../helpers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'oN823SarucV9VE1qTyIbjfdUL'
const ACCESS_TOKEN_EXP_TIME = '30m'
const REFRESH_TOKEN_EXP_TIME = '2h'


const userResolver = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },
        allUsers: async() => {
            return await User.find({})
        },
    },
    Mutation: {
        createUser: async (root, args) => {
            const userExists = await User.findOne({username: args.username})
            if(userExists){
                console.log("User already exists")
                throw new UserInputError("Invalid user or password", {
                    invalidArgs: args
                })
            }

            const saltRounds = 10;
            const hash = await bcrypt.hash(args.password, saltRounds)

            const user = new User({username: args.username, pwd: hash, email: args.email})
 
            return user.save().catch(error => {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            })
        },
        login: async (root, args) => {
            const user = await User.findOne({username: args.username})
            const pwdCorrect = user === null
                ? false
                : await bcrypt.compare(args.password, user.pwd)

            if(!pwdCorrect){
                throw new UserInputError("Invalid credentials")
            }
            
            const refreshTokenInput = {
                email: user.email,
                username: user.username,
                id: user._id,
            };
            const refreshToken = generateRefreshToken(refreshTokenInput);
            const tokenInput = {
                refreshToken,
                id: user._id,
            };
            const token = generateRefreshToken(tokenInput);

            return token
        },
        refreshSessionToken: async (root, args) => {
            const refreshToken = await RefreshToken.findOne({token: args.refreshToken})
            if(!refreshToken){
                throw new UserInputError("Invalid refresh token")
            }
            
            const user = await User.find({username: refreshToken.username})

            const use4Token = {
                username: user.username,
                id: user._id
            }

            const token = jwt.sign(use4Token, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP_TIME })

            return {token}
        },
        addCardToUser: async (root, args, {currentUser}) => {
            if(!currentUser) throw new AuthenticationError('Not Authenticated')

            const user = await User.findOne({username: currentUser.username})
            const card = await Card.findOne({code: args.code})

            if(!card){
                throw new UserInputError("Invalid card code")
            }

            const inCollectionAlready = card => user.cards
                .map(cardStatus => cardStatus.cardCode)    //De la lista de cards, nos quedamos con los cardCode de cada uno
                .includes(card.code)     //Comprueba si el codigo de la card ya existe en esa lista

            if(!inCollectionAlready(card)){
                const status = {
                    cardCode: card.code,
                }

                user.cards = user.cards.concat(status)
                await user.save()
            }

            return user
        },
        updateCardStatus: async (_, {cardCode, step}, {currentUser}) => {
            console.log("[updateCardStatus] cardCode, step", cardCode, step);
            if(!currentUser){
                console.error("[updateCardStatus] Not Authenticated");
                throw new AuthenticationError('Not Authenticated')
            }
                
            
            try {
                const index = currentUser.cards.findIndex(q => q.cardCode === cardCode);
                if (index !== -1) {
                    const card = await Card.findOne({code: cardCode})
                    if(!card){
                        console.error("[updateCardStatus] Card not found")
                        throw new UserInputError("Invalid card code")
                    }
                        
                    if(step > card.checkpoints){
                        console.log("[updateCardStatus] step-card.checkpoints", step, card.checkpoints)
                        currentUser.cards[index].completed = true;
                        currentUser.cards[index].step = step;
                        currentUser.coins += card.coins;

                    } else {
                        if(currentUser.cards[index].step < step){
                            currentUser.cards[index].step = step;
                        }
                    }

                    await currentUser.save();
                    const currentStep = currentUser.cards[index].step;
                    const finish = currentUser.cards[index].completed;
                    console.log("[updateCardStatus] finish, currentStep", finish, currentStep);
                    
                    return {finish, currentStep};
                } else {
                    const card = new CardStatus({cardCode, step:1, completed: false});
                    currentUser.cards.push(card);
                    await currentUser.save();

                    return {
                        finish: false,
                        currentStep: 1
                    }
                }
            } catch (error) {
                console.error('Error updating step:', error);
                throw new Error('Failed to update step');
            }
        }
       
    }
}

export default userResolver;